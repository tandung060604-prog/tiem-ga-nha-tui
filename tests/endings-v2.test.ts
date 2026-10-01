import { describe, it, expect } from 'vitest';
import { evaluateEnding, finaleReady, BANKRUPTCY_DEBT_DAYS } from '../src/content/endings';
import { CHAPTERS } from '../src/content/chapters';
import { closeDay, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { GameState } from '../src/types/game';

const FINALE_MONEY = CHAPTERS.find(c => c.number === 5)!.targetMoney;
const atFinale = (tweak: (s: GameState) => void = () => {}) => {
  const s = createInitialState();
  s.currentChapter = 5;
  s.money = FINALE_MONEY;
  s.day = 100;
  tweak(s);
  return s;
};

describe('kết thúc chỉ đến khi đi hết hành trình', () => {
  it('lỗi cũ: ngày 25 ở Chương 2 KHÔNG còn bị cắt ngang bằng kết thúc', () => {
    const s = createInitialState();
    s.day = 25;
    s.currentChapter = 2;
    expect(evaluateEnding(s)).toBeNull();
  });

  it('Chương 5 nhưng chưa đủ quỹ dự lễ → chưa kết thúc', () => {
    expect(finaleReady(atFinale(s => { s.money = FINALE_MONEY - 1; }))).toBe(false);
    expect(evaluateEnding(atFinale(s => { s.money = FINALE_MONEY - 1; }))).toBeNull();
  });

  it('Chương 5 đủ quỹ 300M nhưng chưa đủ 100 ngày (ví dụ ngày 99) → chưa kích hoạt kết thúc', () => {
    const early = atFinale(s => {
      s.day = 99;
      s.karma = { community: 90, craftsmanship: 90, ambition: 50 };
      s.unlockedBunnyLetters = ['1', '2', '3', '4', '5', '6'];
    });
    expect(finaleReady(early)).toBe(false);
    expect(evaluateEnding(early)).toBeNull();
  });

  it('đủ quỹ ở Chương 5, không cực đoan → Bình dị', () => {
    expect(evaluateEnding(atFinale())).toBe('open');
  });

  it('tình thân + tay nghề cao + đủ 6 thư → Viên mãn', () => {
    expect(evaluateEnding(atFinale(s => {
      s.karma = { community: 80, craftsmanship: 80, ambition: 50 };
      s.unlockedBunnyLetters = ['1', '2', '3', '4', '5', '6'];
    }))).toBe('happy');
  });

  it('tham vọng cao, bỏ bê tình hẻm → Mất chất', () => {
    expect(evaluateEnding(atFinale(s => { s.karma = { community: 20, craftsmanship: 50, ambition: 90 }; }))).toBe('bad_corporate');
  });

  it('Bí mật: ≥4.9 sao, Perfect ≥85%, cháy ≤2%, ≥200 mẻ (không còn đòi 0 miếng cháy cả game)', () => {
    const secret = atFinale(s => {
      s.ratings.overall = 4.95;
      s.lifetimeStats = { totalFried: 400, totalBurnt: 6, perfectFriedCount: 360, totalRevenue: 0 };
    });
    expect(evaluateEnding(secret)).toBe('secret');
    secret.lifetimeStats.totalBurnt = 20;
    expect(evaluateEnding(secret)).not.toBe('secret');
  });
});

describe('phá sản: âm quỹ nhiều ngày liền, không phải một lần', () => {
  it('âm quỹ 1–2 ngày chưa phá sản, 3 ngày liền thì phá sản', () => {
    const s = createInitialState();
    s.money = -1_000_000;
    for (let d = 1; d < BANKRUPTCY_DEBT_DAYS; d++) {
      closeDay(s, createSellingSession(), eventForDay(s.day));
      expect(evaluateEnding(s)).toBeNull();
    }
    closeDay(s, createSellingSession(), eventForDay(s.day));
    expect(evaluateEnding(s)).toBe('bad_bankruptcy');
  });

  it('có một ngày dương quỹ thì chuỗi âm quỹ về 0', () => {
    const s = createInitialState();
    s.money = -1_000_000;
    closeDay(s, createSellingSession(), eventForDay(s.day));
    closeDay(s, createSellingSession(), eventForDay(s.day));
    s.money = 5_000_000;
    closeDay(s, createSellingSession(), eventForDay(s.day));
    expect(s.debtStreak).toBe(0);
  });
});
