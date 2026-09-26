import { describe, it, expect, beforeAll } from 'vitest';
import { weeklyWrapped, isWrappedDay } from '../src/core/wrapped';
import { closeDay, eventForDay, serveFirstOrder } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { audio } from '../src/core/audio';
import { DayLedger, GameState, TrayItem } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

const ledger = (day: number, extra: Partial<DayLedger> = {}): DayLedger => ({
  day, grossRevenue: 1_000_000, tips: 50_000, ingredientCost: 0, wasteCost: 0, wages: 0, rent: 0, utilities: 0,
  appCommissions: 0, netProfit: 400_000, customersServed: 20, customersLost: 1, burntCount: 1,
  topSellerId: 'crispy_chicken', topSellerCount: 10, bestStreak: 3, friedCount: 20, perfectCount: 15, ...extra
});

const withDays = (n: number): GameState => {
  const s = createInitialState();
  for (let d = 1; d <= n; d++) s.dayHistory.push(ledger(d));
  return s;
};

describe('Gà Wrapped hằng tuần', () => {
  it('mỗi 7 ngày mới có', () => {
    expect([1, 6, 7, 13, 14].map(isWrappedDay)).toEqual([false, false, true, false, true]);
  });

  it('chỉ cộng đúng 7 ngày của tuần (trước đây màn tổng kết cộng hôm nay 2 lần)', () => {
    const w = weeklyWrapped(withDays(14), 14)!;
    expect(w.week).toBe(2);
    expect(w.fromDay).toBe(8);
    expect(w.revenue).toBe(7 * 1_050_000);
    expect(w.served).toBe(7 * 20);
    expect(w.perfectPct).toBe(75);
  });

  it('món ruột, chuỗi dài nhất, review hay nhất của tuần', () => {
    const s = withDays(7);
    s.dayHistory[2] = ledger(3, { topSellerId: 'spicy_chicken', topSellerCount: 90, bestStreak: 12 });
    s.recentReviews = [
      { id: 'a', authorName: 'An', avatar: '', day: 5, stars: 5, comment: 'Gà giòn rụm, sốt cay đúng vị hẻm Sài Gòn!', weakestCriteria: 'speed', orderSummary: '' },
      { id: 'b', authorName: 'Bình', avatar: '', day: 2, stars: 2, comment: 'Chờ lâu', weakestCriteria: 'speed', orderSummary: '' }
    ];
    const w = weeklyWrapped(s, 7)!;
    expect(w.topDish?.id).toBe('spicy_chicken');
    expect(w.bestStreak).toBe(12);
    expect(w.quote?.author).toBe('An');
    expect(w.title).toBe('BẬC THẦY GIÒN RỤM');
  });

  it('danh hiệu theo karma nổi trội (khởi đầu 50/50/50 thì chưa tính)', () => {
    const s = withDays(7);
    s.dayHistory.forEach(l => { l.bestStreak = 0; l.perfectCount = 5; });
    expect(weeklyWrapped(s, 7)!.title).toBe('NGƯỜI HÙNG KHỞI NGHIỆP HẺM 1102');
    s.karma.community = 80;
    expect(weeklyWrapped(s, 7)!.title).toBe('BẬC THẦY HẢO TÂM HẺM 1102');
  });

  it('chưa có ngày nào → null', () => {
    expect(weeklyWrapped(createInitialState())).toBeNull();
  });
});

describe('món bán chạy trong sổ cuối ngày', () => {
  it('lấy từ số món thật sự đã giao (trước đây luôn là Gà Giòn)', () => {
    const state = createInitialState();
    const session = createSellingSession();
    const fries: TrayItem = { id: 't', menuItemId: 'shake_fries', name: 'Khoai', icon: '🍟', quality: 'good' };
    for (let i = 0; i < 3; i++) {
      session.orders = [{ id: `o${i}`, customerName: 'K', avatar: '', isDelivery: false, items: [{ menuItemId: 'shake_fries', count: 1, served: 0, completed: false }], patienceMax: 40, patienceCurrent: 40, totalPrice: 25000, startTime: 0 }];
      const tray = [{ ...fries }];
      serveFirstOrder(session, tray, () => 25000, i2 => tray.splice(i2, 1));
    }
    const { ledger: l } = closeDay(state, session, eventForDay(2));
    expect(l.topSellerId).toBe('shake_fries');
    expect(l.topSellerCount).toBe(3);
  });
});
