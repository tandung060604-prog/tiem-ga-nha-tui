import { OrdersEngine } from '../src/core/orders';
import { seedRandom } from '../src/core/rng';
import { traySizeFor, staffEffects } from '../src/core/staff';
import { INITIAL_CANDIDATES } from '../src/content/staff';
import { describe, it, expect, beforeAll } from 'vitest';
import { upgradeEffects } from '../src/core/upgrades';
import { CookingEngine } from '../src/core/cooking';
import { EconomyEngine } from '../src/core/economy';
import { OrdersEngine } from '../src/core/orders';
import { createInitialState } from '../src/core/state';
import { audio } from '../src/core/audio';
import { seedRandom } from '../src/core/rng';

beforeAll(() => audio.setMuted(true));

const withLevels = (levels: Partial<Record<'kitchen' | 'space' | 'operations' | 'marketing', number>>) => {
  const state = createInitialState();
  for (const [id, lvl] of Object.entries(levels)) state.upgrades[id]!.currentLevel = lvl!;
  return state;
};

// Thời gian (ms game) từ lúc thả gà tới khi vào / ra khỏi vùng Perfect
function perfectWindow(rampPct: number) {
  const engine = new CookingEngine();
  engine.setFryRampBonus(rampPct);
  engine.startFrying('chicken');
  let t = 0, enter = -1, exit = -1;
  while (exit < 0 && t < 20000) {
    engine.updateFrying(1);
    t += 1;
    const q = engine.calculateCurrentQuality();
    if (q === 'perfect' && enter < 0) enter = t;
    if (enter >= 0 && q !== 'perfect') exit = t;
  }
  return { enter, length: exit - enter };
}

describe('tác dụng nâng cấp (core/upgrades)', () => {
  it('chưa mua gì → không có tác dụng', () => {
    expect(upgradeEffects(createInitialState().upgrades)).toEqual({
      fryRampPct: 0, tastePct: 0, oilLifePct: 0, patiencePct: 0, customersPct: 0, autoLift: false, ownDeliveryApp: false,
      pricePremiumPct: 0, traySlots: 0, selfServe: false,
      shelfLifeBonus: 0, discountWholesale: 0, sauceTipBonus: 0, autoDrink: false, pestImmunity: false, hygieneBoost: 0
    });
  });

  it('mỗi nhánh lấy mức cao nhất đã mua, không cộng dồn các cấp', () => {
    const e = upgradeEffects(withLevels({ kitchen: 4, marketing: 3 }).upgrades);
    expect(e.fryRampPct).toBe(50);   // max(35, 50)
    expect(e.tastePct).toBe(35);     // max(25, 35)
    expect(e.customersPct).toBe(35); // marketing cấp 3
  });

  it('quán đẹp / nổi tiếng → khách trả thêm (cộng giữa các nhánh, trần 30%); giá đơn hàng tăng theo', () => {
    expect(upgradeEffects(withLevels({}).upgrades).pricePremiumPct).toBe(0);
    expect(upgradeEffects(withLevels({ space: 3 }).upgrades).pricePremiumPct).toBe(10);
    expect(upgradeEffects(withLevels({ space: 5, kitchen: 6, marketing: 5 }).upgrades).pricePremiumPct).toBe(30);
    const plain = withLevels({});
    const fancy = withLevels({ space: 3 });
    seedRandom(9);
    const a = OrdersEngine.generateOrder(plain);
    seedRandom(9);
    const b = OrdersEngine.generateOrder(fancy);
    expect(b.totalPrice).toBeGreaterThan(a.totalPrice);
  });

  it('sức chứa: thêm ô khay (trần +3, tổng khay tối đa 7); cấp 1 miễn phí không thêm gì', () => {
    expect(upgradeEffects(withLevels({}).upgrades).traySlots).toBe(0);
    expect(upgradeEffects(withLevels({ space: 2 }).upgrades).traySlots).toBe(1);
    expect(upgradeEffects(withLevels({ space: 5, operations: 4 }).upgrades).traySlots).toBe(3);
    const s = withLevels({ space: 5, operations: 4 });
    s.staff = [{ ...INITIAL_CANDIDATES[1]! }, { ...INITIAL_CANDIDATES[2]! }];
    expect(traySizeFor(s)).toBe(7);
  });

  it('kiosk tự order: khách tự nhận món dù chưa có phục vụ', () => {
    expect(upgradeEffects(withLevels({ operations: 3 }).upgrades).selfServe).toBe(false);
    const eff = staffEffects([], 12, withLevels({ operations: 4 }).upgrades);
    expect(eff.waiterServeMs).not.toBeNull();
  });

  it('bếp nhanh hơn: gà vào vùng Perfect sớm hơn nhưng cửa sổ Perfect dài như cũ', () => {
    const base = perfectWindow(0);
    const fast = perfectWindow(60);
    expect(fast.enter).toBeLessThan(base.enter);
    expect(Math.abs(fast.length - base.length)).toBeLessThanOrEqual(2);
  });

  it('lọc dầu: cùng số mẻ, dầu có nâng cấp vẫn sạch', () => {
    expect(CookingEngine.getOilCondition(10)).toBe('medium');
    expect(CookingEngine.getOilCondition(10, 45)).toBe('clean');
  });

  it('vận hành: khách kiên nhẫn hơn', () => {
    seedRandom(7);
    const plain = OrdersEngine.generateOrder(withLevels({}));
    seedRandom(7);
    const kiosk = OrdersEngine.generateOrder(withLevels({ operations: 4 }));
    expect(kiosk.patienceMax).toBeGreaterThan(plain.patienceMax);
  });

  it('marketing: thêm khách mỗi ngày', () => {
    expect(EconomyEngine.calculateDailyCustomerCount(withLevels({ marketing: 5 })))
      .toBeGreaterThan(EconomyEngine.calculateDailyCustomerCount(withLevels({})));
  });

  it('dây chuyền cấp 6 tự nhấc giỏ ở giữa vùng Perfect', () => {
    expect(upgradeEffects(withLevels({ kitchen: 5 }).upgrades).autoLift).toBe(false);
    expect(upgradeEffects(withLevels({ kitchen: 6 }).upgrades).autoLift).toBe(true);
    expect(CookingEngine.qualityAt(CookingEngine.AUTO_LIFT_AT)).toBe('perfect');
  });
});
