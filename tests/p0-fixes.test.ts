import { describe, it, expect, beforeAll } from 'vitest';
import { addStock, consumeStock, ageOneDay, ensureBatches } from '../src/core/inventory';
import { CookingEngine } from '../src/core/cooking';
import { EconomyEngine } from '../src/core/economy';
import { OrdersEngine } from '../src/core/orders';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { audio } from '../src/core/audio';
import { createInitialState } from '../src/core/state';
import { BUNNY_LETTERS } from '../src/content/mysteryBunny';
import { INITIAL_MENU } from '../src/content/menu';
import { InventoryItem } from '../src/types/game';
import { GAME_HOUR_MS, OFF_PEAK_HOURS, RUSH_HOURS } from '../src/core/clock';

beforeAll(() => audio.setMuted(true)); // Node không có AudioContext

const chicken = (): InventoryItem => {
  const item = { id: 'chicken_meat', name: 'Gà', unit: 'miếng', cost: 14000, amount: 10, shelfLifeDays: 2, currentLifeDays: 1, icon: '🍗' } as InventoryItem;
  ensureBatches(item);
  return item;
};

describe('#8 kho theo lô', () => {
  it('nhập lô mới không reset hạn của lô cũ', () => {
    const item = chicken();
    addStock(item, 5);
    expect(item.amount).toBe(15);
    expect(item.currentLifeDays).toBe(1); // lô cũ vẫn còn 1 ngày
    expect(ageOneDay(item)).toBe(10);      // chỉ lô cũ hết hạn
    expect(item.amount).toBe(5);
    expect(item.currentLifeDays).toBe(1);  // lô mới: 2 -> 1
  });

  it('xuất kho FIFO và từ chối khi thiếu hàng', () => {
    const item = chicken();
    addStock(item, 5);
    expect(consumeStock(item, 12)).toBe(true);
    expect(item.batches).toEqual([{ amount: 3, daysLeft: 2 }]);
    expect(consumeStock(item, 4)).toBe(false);
    expect(item.amount).toBe(3);
  });

  it('save cũ không có batches được migrate thành 1 lô', () => {
    const state = createInitialState();
    expect(state.inventory.chicken_meat.batches).toEqual([{ amount: 25, daysLeft: 2 }]);
  });
});

describe('#1 #2 tiền không bị tính 2 lần', () => {
  it('cuối ngày chỉ trừ chi phí cố định, không cộng lại doanh thu hay trừ lại nguyên liệu', () => {
    const ledger = EconomyEngine.finalizeDayLedger(1, 500000, 20000, 200000, 30000, 0, 2, 12, 1, 0, 'crispy_chicken');
    expect(EconomyEngine.closingCharges(ledger)).toBe(150000 + 60000); // mặt bằng + điện nước chương 2
    expect(ledger.netProfit).toBe(500000 + 20000 - 200000 - 30000 - 210000);
  });
});

describe('#3 order chỉ gồm món bếp làm được', () => {
  it('chương 1 không bao giờ gọi món không có trạm', () => {
    const state = createInitialState();
    const allowed = new Set(['crispy_chicken', 'shake_fries', 'soda']);
    for (let i = 0; i < 300; i++) {
      for (const it of OrdersEngine.generateOrder(state).items) expect(allowed.has(it.menuItemId)).toBe(true);
    }
  });

  it('chương 5 vẫn chỉ gọi món có station', () => {
    const state = createInitialState();
    state.currentChapter = 5;
    const withStation = new Set(INITIAL_MENU.filter(m => m.station).map(m => m.id));
    for (let i = 0; i < 300; i++) {
      for (const it of OrdersEngine.generateOrder(state).items) expect(withStation.has(it.menuItemId as never)).toBe(true);
    }
  });

  it('dòng "2x" cần giao đủ 2 món mới xong', () => {
    const order = OrdersEngine.generateOrder(createInitialState());
    order.items = [{ menuItemId: 'crispy_chicken', count: 2, served: 0, completed: false }];
    OrdersEngine.matchItemToOrder(order, 'crispy_chicken');
    expect(OrdersEngine.isOrderComplete(order)).toBe(false);
    OrdersEngine.matchItemToOrder(order, 'crispy_chicken');
    expect(OrdersEngine.isOrderComplete(order)).toBe(true);
  });
});

describe('#4 #5 chiên', () => {
  it('có đủ 4 vùng chất lượng theo tiến độ', () => {
    expect(CookingEngine.qualityAt(10)).toBe('raw');
    expect(CookingEngine.qualityAt(40)).toBe('good');
    expect(CookingEngine.qualityAt(60)).toBe('perfect');
    expect(CookingEngine.qualityAt(75)).toBe('good');
    expect(CookingEngine.qualityAt(90)).toBe('burnt');
  });

  it('sốt cay không biến khoai thành gà sốt cay', () => {
    const engine = new CookingEngine();
    engine.startFrying('fries');
    engine.setSeasoning('spicy');
    const r = engine.liftFryer();
    expect(r.trayItem?.menuItemId).toBe('shake_fries');
    expect(r.usedSauce).toBeNull();
  });

  it('sốt cay áp cho gà và báo đã dùng sốt', () => {
    const engine = new CookingEngine();
    engine.startFrying('chicken');
    engine.setSeasoning('spicy');
    const r = engine.liftFryer();
    expect(r.trayItem?.menuItemId).toBe('spicy_chicken');
    expect(r.usedSauce).toBe('spicy');
  });

  it('khay đầy thì món vớt ra không vào khay', () => {
    const engine = new CookingEngine();
    for (let i = 0; i < CookingEngine.TRAY_SIZE; i++) engine.addDrink();
    engine.startFrying('chicken');
    expect(engine.liftFryer().trayItem).toBeNull();
    expect(engine.getTray()).toHaveLength(CookingEngine.TRAY_SIZE);
  });
});

describe('#6 #7 thư Thỏ Cam', () => {
  it('mọi thư trỏ tới món có thật trong menu', () => {
    const ids = new Set(INITIAL_MENU.map(m => m.id));
    for (const l of BUNNY_LETTERS) expect(ids.has(l.menuItemId)).toBe(true);
  });

  it('thưởng sao vào tiêu chí nên còn nguyên sau khi tính lại overall', () => {
    const r = createInitialState().ratings;
    const letter = BUNNY_LETTERS.find(l => l.id === 'bunny_letter_4')!;
    for (const c of letter.boost!.criteria) r[c] = Math.min(5, r[c] + letter.boost!.value);
    const boosted = ReviewsEngine.calculateOverallStars(r);
    expect(boosted).toBeGreaterThan(createInitialState().ratings.overall);
    expect(ReviewsEngine.calculateOverallStars(r)).toBe(boosted); // tính lại không làm mất
  });
});

describe('P1: số khách và sự kiện có tác dụng', () => {
  it('nhịp khách cả ngày cộng lại đúng bằng số khách dự kiến', () => {
    const expected = 17;
    const perDay = OFF_PEAK_HOURS * GAME_HOUR_MS / EconomyEngine.spawnIntervalMs(expected, false)
      + RUSH_HOURS * GAME_HOUR_MS / EconomyEngine.spawnIntervalMs(expected, true);
    expect(perDay).toBeCloseTo(expected, 6);
  });

  it('giờ cao điểm khách đến dày hơn', () => {
    expect(EconomyEngine.spawnIntervalMs(20, true)).toBeLessThan(EconomyEngine.spawnIntervalMs(20, false));
  });

  it('mưa (x0,6) làm ít khách hơn ngày thường', () => {
    const state = createInitialState();
    expect(EconomyEngine.calculateDailyCustomerCount(state, 0.6)).toBeLessThan(EconomyEngine.calculateDailyCustomerCount(state, 1));
  });

  it('tiền phạt kiểm tra vệ sinh bị trừ lúc đóng cửa và hiện trong lãi', () => {
    const ledger = EconomyEngine.finalizeDayLedger(1, 100000, 0, 0, 0, 0, 1, 3, 0, 0, 'crispy_chicken', 200000);
    expect(EconomyEngine.closingCharges(ledger)).toBe(25000 + 200000);
    expect(ledger.netProfit).toBe(100000 - 25000 - 200000);
  });

  it('hệ số giá của sự kiện áp vào tổng tiền order', () => {
    const state = createInitialState();
    const order = OrdersEngine.generateOrder(state, false, 1.1);
    const base = order.items.reduce((sum, it) => sum + state.menu.find(m => m.id === it.menuItemId)!.currentPrice * it.count, 0);
    expect(order.totalPrice).toBeGreaterThan(base);
  });
});

describe('P1: RNG có seed', () => {
  it('cùng seed → cùng chuỗi khách và món (nền cho Thử thách ngày)', async () => {
    const { seedRandom } = await import('../src/core/rng');
    const run = () => {
      seedRandom(20260926);
      const state = createInitialState();
      return Array.from({ length: 20 }, () => {
        const o = OrdersEngine.generateOrder(state);
        return [o.customerName, o.items.map(i => `${i.menuItemId}x${i.count}`).join('+'), Math.round(o.patienceMax)].join('|');
      });
    };
    expect(run()).toEqual(run());
  });

  it('pick() trên mảng rỗng báo lỗi ngay thay vì trả undefined', async () => {
    const { pick } = await import('../src/core/rng');
    expect(() => pick([])).toThrow();
  });
});
