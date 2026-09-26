import { describe, it, expect } from 'vitest';
import { addStock, consumeStock, ageOneDay, refundPurchase, refundableUnits, ensureBatches } from '../src/core/inventory';
import { createInitialState } from '../src/core/state';
import { InventoryItem } from '../src/types/game';

const chicken = (): InventoryItem => createInitialState().inventory.chicken_meat!;

describe('đổi trả trong ngày (nút −5)', () => {
  it('lỗi cũ: hàng TẶNG lúc đầu game không đổi ra tiền được', () => {
    const item = chicken();               // 25 miếng tặng sẵn
    expect(refundableUnits(item)).toBe(0);
    expect(refundPurchase(item, 5)).toBe(0);
    expect(item.amount).toBe(25);
  });

  it('hàng vừa mua hôm nay hoàn đúng giá đã trả', () => {
    const item = chicken();
    addStock(item, 10, 14000);
    expect(refundPurchase(item, 5)).toBe(70000);
    expect(item.amount).toBe(30);
    expect(refundableUnits(item)).toBe(5);
  });

  it('lỗi cũ: hàng đã qua đêm (sắp hết hạn) không hoàn được → mua dư vẫn là lỗ', () => {
    const item = chicken();
    addStock(item, 10, 14000);
    ageOneDay(item);
    expect(refundPurchase(item, 5)).toBe(0);
  });

  it('đã bán bớt từ lô mới thì chỉ hoàn phần còn lại', () => {
    const item = createInitialState().inventory.soft_drink!;
    item.batches = [];
    ensureBatches(item);
    addStock(item, 5, 6000);
    consumeStock(item, 3);
    expect(refundableUnits(item)).toBe(2);
    expect(refundPurchase(item, 5)).toBe(0);  // không đủ 5 → không hoàn gì, kho giữ nguyên
    expect(item.amount).toBe(2);
    expect(refundPurchase(item, 2)).toBe(12000);
  });

  it('hoàn lô mới nhất trước, giữ nguyên hạn của lô cũ', () => {
    const item = chicken();
    addStock(item, 5, 14000);
    refundPurchase(item, 5);
    expect(item.batches).toEqual([{ amount: 25, daysLeft: 2 }]);
  });

  it('không nhận số lượng âm / không có hàng', () => {
    expect(refundPurchase(undefined, 5)).toBe(0);
    expect(refundPurchase(chicken(), -5)).toBe(0);
  });
});

import { OrdersEngine } from '../src/core/orders';
import { seedRandom } from '../src/core/rng';

describe('order chỉ gồm món có nguyên liệu đã mở khóa', () => {
  it('chương 2 chưa ký hợp đồng sốt → không có khách gọi gà sốt', () => {
    seedRandom(3);
    const s = createInitialState();
    s.currentChapter = 2;
    for (let i = 0; i < 300; i++) {
      for (const it of OrdersEngine.generateOrder(s).items) {
        expect(['spicy_chicken', 'honey_garlic_chicken']).not.toContain(it.menuItemId);
      }
    }
    s.inventory.spicy_sauce!.unlocked = true;
    const ids = new Set(Array.from({ length: 300 }, () => OrdersEngine.generateOrder(s).items.map(i => i.menuItemId)).flat());
    expect(ids.has('spicy_chicken')).toBe(true);
  });
});
