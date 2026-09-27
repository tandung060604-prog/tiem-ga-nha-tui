import { describe, it, expect } from 'vitest';
import { OrdersEngine, BASKET_RULE, basketChance, basketRoleOf, canMake } from '../src/core/orders';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { GameState } from '../src/types/game';

const stocked = (chapter: number, day: number): GameState => {
  const s = createInitialState();
  s.currentChapter = chapter;
  s.day = day;
  for (const inv of Object.values(s.inventory)) inv.unlocked = true;
  return s;
};

function sample(s: GameState, n: number) {
  seedRandom(42);
  let side = 0, drink = 0, plain = 0, walkup = 0;
  for (let i = 0; i < n; i++) {
    const o = OrdersEngine.generateOrder(s);
    const roles = o.items.map(it => basketRoleOf(it.menuItemId));
    if (o.isWalkupDrink) {
      walkup++;
      expect(o.items).toHaveLength(1);
      expect(roles[0]).toBe('drink');
      continue;
    }
    expect(roles).toContain('main'); // không bao giờ có đơn chỉ gọi nước / món kèm
    if (o.comboName) continue;
    plain++;
    if (roles.includes('side')) side++;
    if (roles.includes('drink')) drink++;
  }
  return { side: side / plain, drink: drink / plain, walkup: walkup / n };
}

describe('giỏ hàng quán gà', () => {
  it('Chương 1: 100% có món chính, món kèm ~40%, nước ~65%, người đi đường ~3%', () => {
    const r = sample(stocked(1, 5), 5000);
    expect(r.side).toBeGreaterThan(0.36);
    expect(r.side).toBeLessThan(0.44);
    expect(r.drink).toBeGreaterThan(0.61);
    expect(r.drink).toBeLessThan(0.69);
    expect(r.walkup).toBeGreaterThan(0.015);
    expect(r.walkup).toBeLessThan(0.045);
  });

  it('Chương 5: món kèm ~60%, nước ~85%', () => {
    const r = sample(stocked(5, 120), 5000);
    expect(r.side).toBeGreaterThan(0.56);
    expect(r.side).toBeLessThan(0.64);
    expect(r.drink).toBeGreaterThan(0.81);
    expect(r.drink).toBeLessThan(0.89);
  });

  it('ngày 1: không có người đi đường, đơn gọn hơn cho Bác Ba dạy', () => {
    const r = sample(stocked(1, 1), 2000);
    expect(r.walkup).toBe(0);
    expect(r.drink).toBeLessThan(0.45);
  });

  it('xác suất tăng dần theo chương', () => {
    expect(basketChance(BASKET_RULE.sideChance, 1)).toBe(0.4);
    expect(basketChance(BASKET_RULE.sideChance, 5)).toBeCloseTo(0.6);
    expect(basketChance(BASKET_RULE.drinkChance, 3)).toBeCloseTo(0.75);
  });

  it('món chưa tới ngày mở thì khách chưa gọi (má đùi ngày 2, phô mai que ngày 3)', () => {
    const s = stocked(1, 1);
    expect(canMake(s, 'spicy_thigh')).toBe(false);
    expect(canMake(s, 'cheese_stick')).toBe(false);
    s.day = 3;
    expect(canMake(s, 'spicy_thigh')).toBe(true);
    expect(canMake(s, 'cheese_stick')).toBe(true);
  });

  it('người đi đường trả thêm phụ thu', () => {
    const s = stocked(2, 10);
    seedRandom(1);
    for (let i = 0; i < 3000; i++) {
      const o = OrdersEngine.generateOrder(s);
      if (!o.isWalkupDrink) continue;
      const price = s.menu.find(m => m.id === o.items[0]!.menuItemId)!.currentPrice;
      expect(o.totalPrice).toBe(price + BASKET_RULE.walkupSurcharge);
      return;
    }
    throw new Error('không gặp người đi đường nào');
  });
});
