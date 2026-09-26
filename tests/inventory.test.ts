import { describe, it, expect, beforeAll } from 'vitest';
import { addStock, refundStock, consumeStock, unlockIngredient, ensureBatches } from '../src/core/inventory';
import { createInitialState, migrateSave } from '../src/core/state';
import { InventoryItem } from '../src/types/game';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

const makeItem = (amount: number, daysLeft: number, shelfLife: number = 5): InventoryItem => {
  const item: InventoryItem = {
    id: 'test_item',
    name: 'Test Item',
    unit: 'phần',
    cost: 10000,
    amount,
    shelfLifeDays: shelfLife,
    currentLifeDays: daysLeft,
    icon: '🍗',
    batches: [{ amount, daysLeft }],
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  };
  ensureBatches(item);
  return item;
};

describe('Hệ Thống Kho & Hoàn Tiền -5 (Gemini 2 Core)', () => {
  it('refundStock hoàn trả theo LIFO và bảo toàn hạn dùng của lô cũ', () => {
    // Ban đầu có lô cũ: 10 đơn vị, còn 1 ngày
    const item = makeItem(10, 1, 3);
    
    // Nhập thêm 5 đơn vị mới (hạn 3 ngày)
    addStock(item, 5);
    expect(item.amount).toBe(15);
    expect(item.batches.length).toBe(2);
    expect(item.batches[0]).toEqual({ amount: 10, daysLeft: 1 });
    expect(item.batches[1]).toEqual({ amount: 5, daysLeft: 3 });

    // Bấm -5 hoàn trả
    const ok = refundStock(item, 5);
    expect(ok).toBe(true);
    expect(item.amount).toBe(10);
    // Lô mới bị trừ hết, lô cũ 1 ngày vẫn còn nguyên vẹn!
    expect(item.batches.length).toBe(1);
    expect(item.batches[0]).toEqual({ amount: 10, daysLeft: 1 });
    expect(item.currentLifeDays).toBe(1);
  });

  it('refundStock từ chối nếu số lượng tồn kho ít hơn lượng hoàn trả', () => {
    const item = makeItem(4, 2);
    const ok = refundStock(item, 5);
    expect(ok).toBe(false);
    expect(item.amount).toBe(4);
  });

  it('refundStock với undefined hoặc null trả về false an toàn', () => {
    expect(refundStock(undefined, 5)).toBe(false);
  });

  it('refundStock hoàn trả một phần lô mới nếu mua nhiều hơn 5', () => {
    const item = makeItem(10, 2, 5);
    addStock(item, 10); // batch 2 có 10 đơn vị
    expect(item.amount).toBe(20);

    const ok = refundStock(item, 5);
    expect(ok).toBe(true);
    expect(item.amount).toBe(15);
    expect(item.batches[1].amount).toBe(5);
  });
});

describe('Phân Tầng Mở Khóa Nguyên Liệu (Progression Pacing)', () => {
  it('Ngày 1 chỉ mở sẵn đúng 5 nguyên liệu cốt lõi', () => {
    const state = createInitialState();
    const coreIds = ['chicken_meat', 'flour', 'fry_oil', 'potato_cheese', 'soft_drink'];
    const tieredIds = ['spicy_sauce', 'garlic_honey', 'dessert_pack', 'pasta_beef', 'burger_bun'];

    for (const id of coreIds) {
      const item = state.inventory[id];
      expect(item).toBeDefined();
      expect(item.unlocked).toBe(true);
      expect(item.amount).toBeGreaterThan(0);
    }

    for (const id of tieredIds) {
      const item = state.inventory[id];
      expect(item).toBeDefined();
      expect(item.unlocked).toBe(false);
      expect(item.amount).toBe(0); // Không bị thối hỏng trước khi mở
      expect(item.unlockDay).toBeGreaterThan(1);
      expect(item.unlockCost).toBeGreaterThan(0);
    }
  });

  it('unlockIngredient từ chối nếu chưa tới mốc ngày', () => {
    const state = createInitialState();
    const spicy = state.inventory['spicy_sauce']; // Mở từ ngày 3
    
    // Ngày 1: chưa đủ ngày
    const res = unlockIngredient(spicy, 1000000, 1);
    expect(res.success).toBe(false);
    expect(res.reason).toContain('Ngày 3');
    expect(spicy.unlocked).toBe(false);
  });

  it('unlockIngredient từ chối nếu không đủ tiền phí hợp đồng', () => {
    const state = createInitialState();
    const spicy = state.inventory['spicy_sauce']; // Phí 50.000đ
    
    // Ngày 3 nhưng chỉ có 30.000đ
    const res = unlockIngredient(spicy, 30000, 3);
    expect(res.success).toBe(false);
    expect(res.reason).toContain('Không đủ tiền');
    expect(spicy.unlocked).toBe(false);
  });

  it('unlockIngredient thành công khi đủ ngày và đủ tiền', () => {
    const state = createInitialState();
    const spicy = state.inventory['spicy_sauce'];
    
    // Ngày 3 với đủ 100.000đ
    const res = unlockIngredient(spicy, 100000, 3);
    expect(res.success).toBe(true);
    expect(res.cost).toBe(50000);
    expect(spicy.unlocked).toBe(true);

    // Không thể mở khóa lần 2
    const res2 = unlockIngredient(spicy, 100000, 3);
    expect(res2.success).toBe(false);
  });

  it('migrateSave bổ sung thuộc tính unlocked cho save game cũ', () => {
    const state = createInitialState();
    const raw = JSON.parse(JSON.stringify(state));
    
    // Xóa thuộc tính unlocked ở save cũ
    delete raw.inventory.spicy_sauce.unlocked;
    delete raw.inventory.chicken_meat.unlocked;

    const migrated = migrateSave(raw)!;
    expect(migrated).not.toBeNull();
    expect(migrated.state.inventory.spicy_sauce.unlocked).toBe(false);
    expect(migrated.state.inventory.chicken_meat.unlocked).toBe(true);
  });
});
