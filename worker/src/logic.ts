// Luật thuần của máy chủ (không phụ thuộc Cloudflare) → test được bằng vitest (tests/worker-logic.test.ts).
// Máy chủ KHÔNG tin điểm client gửi: tự tính điểm từ các chỉ số, và loại chỉ số vô lý.

export interface DailyChallenge {
  date: string;        // YYYY-MM-DD theo giờ Việt Nam
  seed: number;        // cùng seed → mọi người chơi cùng một ngày khách giống nhau
  goal: 'served' | 'perfect' | 'streak';
  target: number;
  title: string;
}

export interface ScoreSubmission {
  playerId: string;    // id ngẫu nhiên lưu ở máy người chơi (không phải thông tin cá nhân)
  shopName: string;
  date: string;
  served: number;
  lost: number;
  perfectPct: number;
  bestStreak: number;
  revenue: number;
  token: string;       // HMAC do máy chủ cấp đầu ngày (issueToken)
}

export interface LeaderboardEntry {
  playerId: string;
  shopName: string;
  score: number;
  served: number;
  perfectPct: number;
  at: number;
}

// Giới hạn vật lý của một ca 4 phút (mô phỏng: người giỏi nhất + đủ nâng cấp ~90 khách/ngày)
export const LIMITS = { maxServed: 150, maxTicket: 400_000, maxStreak: 200, maxName: 30, leaderboardSize: 50 } as const;

// FNV-1a 32-bit: seed ổn định theo ngày
export function hash32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Ngày theo giờ Việt Nam (UTC+7), để thử thách đổi lúc 0h ở Việt Nam
export function vnDate(nowMs: number): string {
  return new Date(nowMs + 7 * 3600_000).toISOString().slice(0, 10);
}

export function dailyChallenge(date: string): DailyChallenge {
  const seed = hash32(`tiem-ga:${date}`);
  const kinds: DailyChallenge['goal'][] = ['served', 'perfect', 'streak'];
  const goal = kinds[seed % kinds.length]!;
  const target = goal === 'served' ? 25 + (seed % 16) : goal === 'perfect' ? 70 + (seed % 21) : 6 + (seed % 7);
  const title = goal === 'served' ? `Phục vụ ${target} khách trong một ca`
    : goal === 'perfect' ? `Đạt ${target}% gà Perfect`
    : `Chuỗi ${target} mẻ Perfect liên tiếp`;
  return { date, seed, goal, target, title };
}

// Điểm do máy chủ tính: khách phục vụ là chính, tay nghề cộng thêm, khách bỏ về trừ điểm
export function computeScore(s: Pick<ScoreSubmission, 'served' | 'lost' | 'perfectPct' | 'bestStreak'>): number {
  return Math.max(0, Math.round(s.served * 100 + s.perfectPct * 10 + Math.min(s.bestStreak, 50) * 20 - s.lost * 50));
}

export function sanitizeName(name: string): string {
  // Bỏ ký tự điều khiển / thẻ HTML; giữ tiếng Việt và emoji
  return name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, LIMITS.maxName);
}

export type Validation = { ok: true; score: number; shopName: string } | { ok: false; reason: string };

export function validateSubmission(s: ScoreSubmission, today: string): Validation {
  const int = (v: unknown) => typeof v === 'number' && Number.isInteger(v) && v >= 0;
  if (s.date !== today) return { ok: false, reason: 'Sai ngày thử thách' };
  if (!/^[a-z0-9-]{8,40}$/i.test(s.playerId ?? '')) return { ok: false, reason: 'playerId không hợp lệ' };
  const shopName = sanitizeName(String(s.shopName ?? ''));
  if (!shopName) return { ok: false, reason: 'Thiếu tên quán' };
  if (![s.served, s.lost, s.bestStreak, s.revenue].every(int)) return { ok: false, reason: 'Số liệu phải là số nguyên không âm' };
  if (typeof s.perfectPct !== 'number' || s.perfectPct < 0 || s.perfectPct > 100) return { ok: false, reason: 'Tỉ lệ Perfect vô lý' };
  if (s.served > LIMITS.maxServed) return { ok: false, reason: 'Số khách vượt giới hạn một ca' };
  if (s.revenue > s.served * LIMITS.maxTicket) return { ok: false, reason: 'Doanh thu vượt giới hạn theo số khách' };
  if (s.bestStreak > LIMITS.maxStreak) return { ok: false, reason: 'Chuỗi Perfect vô lý' };
  return { ok: true, score: computeScore(s), shopName };
}

// Mỗi người chơi giữ điểm cao nhất; bảng giữ top N
export function upsertLeaderboard(list: readonly LeaderboardEntry[], entry: LeaderboardEntry): LeaderboardEntry[] {
  const others = list.filter(e => e.playerId !== entry.playerId);
  const prev = list.find(e => e.playerId === entry.playerId);
  const best = prev && prev.score >= entry.score ? prev : entry;
  return [...others, best].sort((a, b) => b.score - a.score || a.at - b.at).slice(0, LIMITS.leaderboardSize);
}

// Token HMAC-SHA256(secret, date|playerId): chỉ máy chủ ký được → điểm phải gắn với một lượt đã xin token hôm đó
const enc = new TextEncoder();
async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export const issueToken = (secret: string, date: string, playerId: string) => hmac(secret, `${date}|${playerId}`);
export async function verifyToken(secret: string, date: string, playerId: string, token: string): Promise<boolean> {
  const expected = await issueToken(secret, date, playerId);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i); // so sánh thời gian hằng
  return diff === 0;
}
