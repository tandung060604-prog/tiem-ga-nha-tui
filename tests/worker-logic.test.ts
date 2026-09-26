import { describe, it, expect } from 'vitest';
import {
  dailyChallenge, vnDate, computeScore, validateSubmission, upsertLeaderboard, issueToken, verifyToken, sanitizeName, LIMITS, ScoreSubmission
} from '../worker/src/logic';

const sub = (extra: Partial<ScoreSubmission> = {}): ScoreSubmission => ({
  playerId: 'player-12345678', shopName: 'Gà Giòn 🍗', date: '2026-09-27', served: 40, lost: 2,
  perfectPct: 80, bestStreak: 9, revenue: 2_500_000, token: 'x', ...extra
});

describe('máy chủ: thử thách ngày', () => {
  it('cùng ngày → cùng đề; khác ngày → đề có thể khác', () => {
    expect(dailyChallenge('2026-09-27')).toEqual(dailyChallenge('2026-09-27'));
    const seeds = new Set(['2026-09-27', '2026-09-28', '2026-09-29'].map(d => dailyChallenge(d).seed));
    expect(seeds.size).toBe(3);
  });

  it('ngày theo giờ Việt Nam (17:30 UTC = 0:30 hôm sau ở VN)', () => {
    expect(vnDate(Date.UTC(2026, 8, 27, 17, 30))).toBe('2026-09-28');
  });
});

describe('máy chủ: không tin client', () => {
  it('máy chủ tự tính điểm', () => {
    const v = validateSubmission(sub(), '2026-09-27');
    expect(v).toEqual({ ok: true, score: computeScore(sub()), shopName: 'Gà Giòn 🍗' });
  });

  it('loại chỉ số vô lý và sai ngày', () => {
    expect(validateSubmission(sub({ served: LIMITS.maxServed + 1 }), '2026-09-27').ok).toBe(false);
    expect(validateSubmission(sub({ revenue: 40 * LIMITS.maxTicket + 1 }), '2026-09-27').ok).toBe(false);
    expect(validateSubmission(sub({ perfectPct: 101 }), '2026-09-27').ok).toBe(false);
    expect(validateSubmission(sub({ served: -1 }), '2026-09-27').ok).toBe(false);
    expect(validateSubmission(sub({ served: 1.5 }), '2026-09-27').ok).toBe(false);
    expect(validateSubmission(sub(), '2026-09-28').ok).toBe(false);
    expect(validateSubmission(sub({ playerId: '../../x' }), '2026-09-27').ok).toBe(false);
  });

  it('tên quán bỏ thẻ HTML, giới hạn độ dài', () => {
    expect(sanitizeName('<script>alert(1)</script>Gà')).toBe('scriptalert(1)/scriptGà');
    expect(sanitizeName('a'.repeat(100))).toHaveLength(LIMITS.maxName);
  });

  it('token HMAC: đúng người đúng ngày mới hợp lệ', async () => {
    const t = await issueToken('bi-mat', '2026-09-27', 'player-12345678');
    expect(await verifyToken('bi-mat', '2026-09-27', 'player-12345678', t)).toBe(true);
    expect(await verifyToken('bi-mat', '2026-09-28', 'player-12345678', t)).toBe(false);
    expect(await verifyToken('bi-mat', '2026-09-27', 'player-87654321', t)).toBe(false);
    expect(await verifyToken('khac', '2026-09-27', 'player-12345678', t)).toBe(false);
  });
});

describe('máy chủ: bảng xếp hạng', () => {
  it('mỗi người giữ điểm cao nhất, xếp giảm dần, giới hạn top', () => {
    let b = upsertLeaderboard([], { playerId: 'a', shopName: 'A', score: 100, served: 1, perfectPct: 0, at: 1 });
    b = upsertLeaderboard(b, { playerId: 'a', shopName: 'A', score: 50, served: 1, perfectPct: 0, at: 2 });
    b = upsertLeaderboard(b, { playerId: 'b', shopName: 'B', score: 200, served: 1, perfectPct: 0, at: 3 });
    expect(b.map(e => [e.playerId, e.score])).toEqual([['b', 200], ['a', 100]]);
    for (let i = 0; i < 80; i++) b = upsertLeaderboard(b, { playerId: `p${i}`, shopName: 'P', score: i, served: 1, perfectPct: 0, at: i });
    expect(b).toHaveLength(LIMITS.leaderboardSize);
  });
});
