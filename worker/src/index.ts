// Cloudflare Worker cho Tiệm Gà Nhà Tui: thử thách ngày + bảng xếp hạng + kiểm chứng điểm phía máy chủ.
// CHƯA DEPLOY — cần tài khoản Cloudflare (xem worker/README.md).
import {
  dailyChallenge, vnDate, validateSubmission, upsertLeaderboard, issueToken, verifyToken,
  LeaderboardEntry, ScoreSubmission
} from './logic';

// Kiểu tối thiểu của KV (khỏi cài @cloudflare/workers-types cho một vài hàm)
interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
interface Env {
  LEADERBOARD: KV;
  TOKEN_SECRET: string;   // wrangler secret put TOKEN_SECRET
  ALLOWED_ORIGIN: string; // https://tandung060604-prog.github.io
}

const RATE_LIMIT = { windowSec: 60, max: 12 };

function json(body: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': env.ALLOWED_ORIGIN,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'cache-control': 'no-store'
    }
  });
}

// Giới hạn số request mỗi IP mỗi phút (KV, xấp xỉ — đủ chặn spam điểm)
async function rateLimited(env: Env, ip: string): Promise<boolean> {
  const key = `rl:${ip}:${Math.floor(Date.now() / 1000 / RATE_LIMIT.windowSec)}`;
  const n = Number((await env.LEADERBOARD.get(key)) ?? 0) + 1;
  await env.LEADERBOARD.put(key, String(n), { expirationTtl: RATE_LIMIT.windowSec * 2 });
  return n > RATE_LIMIT.max;
}

async function readBoard(env: Env, date: string): Promise<LeaderboardEntry[]> {
  try {
    return JSON.parse((await env.LEADERBOARD.get(`lb:${date}`)) ?? '[]');
  } catch {
    return [];
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return json({}, env);
    const url = new URL(request.url);
    const today = vnDate(Date.now());
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    if (await rateLimited(env, ip)) return json({ error: 'Chậm lại chút nha, gửi nhiều quá!' }, env, 429);

    // Thử thách hôm nay (mọi người cùng seed → cùng đề)
    if (url.pathname === '/api/daily' && request.method === 'GET') {
      return json(dailyChallenge(today), env);
    }

    // Token đầu ca: điểm gửi lên phải kèm token hôm nay của đúng người chơi
    if (url.pathname === '/api/token' && request.method === 'POST') {
      const { playerId } = await request.json().catch(() => ({})) as { playerId?: string };
      if (!playerId || !/^[a-z0-9-]{8,40}$/i.test(playerId)) return json({ error: 'playerId không hợp lệ' }, env, 400);
      return json({ date: today, token: await issueToken(env.TOKEN_SECRET, today, playerId) }, env);
    }

    if (url.pathname === '/api/score' && request.method === 'POST') {
      const sub = await request.json().catch(() => null) as ScoreSubmission | null;
      if (!sub) return json({ error: 'Dữ liệu không đọc được' }, env, 400);
      if (!(await verifyToken(env.TOKEN_SECRET, today, sub.playerId ?? '', String(sub.token ?? '')))) {
        return json({ error: 'Token không hợp lệ' }, env, 403);
      }
      const v = validateSubmission(sub, today);
      if (!v.ok) return json({ error: v.reason }, env, 422);
      const board = upsertLeaderboard(await readBoard(env, today), {
        playerId: sub.playerId, shopName: v.shopName, score: v.score, served: sub.served, perfectPct: sub.perfectPct, at: Date.now()
      });
      await env.LEADERBOARD.put(`lb:${today}`, JSON.stringify(board), { expirationTtl: 60 * 60 * 24 * 14 });
      const rank = board.findIndex(e => e.playerId === sub.playerId) + 1;
      return json({ score: v.score, rank: rank || null }, env);
    }

    if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
      const date = url.searchParams.get('date') ?? today;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'Sai định dạng ngày' }, env, 400);
      // Không trả playerId ra ngoài
      return json((await readBoard(env, date)).map(({ playerId: _hidden, ...rest }) => rest), env);
    }

    return json({ error: 'Không có đường này' }, env, 404);
  }
};
