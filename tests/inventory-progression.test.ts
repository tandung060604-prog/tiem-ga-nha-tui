import { describe, it, expect, beforeAll } from 'vitest';
import { addStock, consumeStock, refundStock, canUnlockIngredient, unlockIngredient, ensureBatches } from '../src/core/inventory';
import { createInitialState } from '../src/core/state';
import { OrdersEngine } from '../src/core/orders';
import { InventoryItem } from '../src/types/game';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

const makeChicken = (amount = 10, currentLifeDays = 1, shelfLifeDays = 2): InventoryItem => {
  const item: InventoryItem = {
    id: 'chicken_meat',
    name: 'Gà tươi',
    unit: 'miếng',
    cost: 14000,
    amount,
    shelfLifeDays,
    currentLifeDays,
    icon: '🍗',
    batches: [{ amount, daysLeft: currentLifeDays }],
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  };
  return item;
};

describe('Quản lý hoàn vốn kho LIFO (refundStock)', () => {
  it('từ chối hoàn trả khi số lượng trong kho nhỏ hơn số lượng muốn hoàn', () => {
    const item = makeChicken(3);
    expect(refundStock(item, 5)).toBe(false);
    expect(item.amount).toBe(3);
  });

  it('hoàn trả đúng số lượng và trừ từ lô mới nhập nhất (LIFO), bảo toàn HSD lô cũ', () => {
    const item = makeChicken(10, 1, 2); // Lô 1: 10 cái, còn 1 ngày
    addStock(item, 5);                  // Lô 2: 5 cái, còn 2 ngày

    expect(item.amount).toBe(15);
    expect(item.batches.length).toBe(2);

    // Hoàn vốn 5 cái: phải trừ từ Lô 2 (lô mới nhất)
    const success = refundStock(item, 5);
    expect(success).toBe(true);
    expect(item.amount).toBe(10);
    expect(item.batches.length).toBe(1);
    expect(item.batches[0]).toEqual({ amount: 10, daysLeft: 1 });
    expect(item.currentLifeDays).toBe(1);
  });

  it('hoàn trả xuyên qua nhiều lô mới nhất nếu cần', () => {
    const item = makeChicken(5, 1, 2); // Lô 1: 5 cái, 1 ngày
    addStock(item, 3);                 // Lô 2: 3 cái, 2 ngày
    addStock(item, 4);                 // Lô 3: 4 cái, 2 ngày

    expect(item.amount).toBe(12);

    // Hoàn trả 5 cái: trừ 4 từ Lô 3, 1 từ Lô 2
    expect(refundStock(item, 5)).toBe(true);
    expect(item.amount).toBe(7);
    expect(item.batches).toEqual([
      { amount: 5, daysLeft: 1 },
      { amount: 2, daysLeft: 2 }
    ]);
  });
});

describe('Phân tầng mở khóa nguyên liệu (Progression Pacing)', () => {
  it('khởi tạo GameState Ngày 1 chỉ mở sẵn 5 nguyên liệu cốt lõi', () => {
    const state = createInitialState();
    const coreIds = ['chicken_meat', 'flour', 'fry_oil', 'potato_cheese', 'soft_drink'];
    const lockedIds = ['spicy_sauce', 'garlic_honey', 'dessert_pack', 'pasta_beef', 'burger_bun'];

    for (const id of coreIds) {
      expect(state.inventory[id].unlocked).toBe(true);
      expect(state.inventory[id].amount).toBeGreaterThan(0);
    }

    for (const id of lockedIds) {
      expect(state.inventory[id].unlocked).toBe(false);
      expect(state.inventory[id].amount).toBe(0);
      expect(state.inventory[id].unlockDay).toBeGreaterThanOrEqual(3);
      expect(state.inventory[id].unlockCost).toBeGreaterThan(0);
    }
  });

  it('không thể mở khóa nếu chưa đến ngày hoặc không đủ tiền', () => {
    const state = createInitialState(); // day: 1, money: 850000
    
    // spicy_sauce cần Ngày 3, phí 50.000đ
    const checkDay = canUnlockIngredient(state, 'spicy_sauce');
    expect(checkDay.canUnlock).toBe(false);
    expect(checkDay.reason).toContain('Ngày 3');
    expect(unlockIngredient(state, 'spicy_sauce')).toBe(false);

    // Đến Ngày 3 nhưng không đủ tiền
    state.day = 3;
    state.money = 20000; // thiếu so với 50.000đ
    const checkMoney = canUnlockIngredient(state, 'spicy_sauce');
    expect(checkMoney.canUnlock).toBe(false);
    expect(checkMoney.reason).toContain('Thiếu tiền');
    expect(unlockIngredient(state, 'spicy_sauce')).toBe(false);
  });

  it('đủ ngày và đủ tiền: trừ tiền chính xác và đổi trạng thái unlocked = true', () => {
    const state = createInitialState();
    state.day = 3;
    state.money = 100000;

    const success = unlockIngredient(state, 'spicy_sauce');
    expect(success).toBe(true);
    expect(state.inventory.spicy_sauce.unlocked).toBe(true);
    expect(state.money).toBe(50000); // 100k - 50k
  });

  it('khách không gọi món có nguyên liệu bị khóa', () => {
    const state = createInitialState();
    state.currentChapter = 2; // Cho phép món chương 2
    state.inventory.spicy_sauce.unlocked = false;

    // Sinh 100 order: không được có 'spicy_chicken'
    for (let i = 0; i < 100; i++) {
      const order = OrdersEngine.generateOrder(state);
      for (const it of order.items) {
        expect(it.menuItemId).not.toBe('spicy_chicken');
      }
    }

    // Mở khóa sốt cay: spicy_chicken có thể xuất hiện
    state.inventory.spicy_sauce.unlocked = true;
    let foundSpicy = false;
    for (let i = 0; i < 200; i++) {
      const order = OrdersEngine.generateOrder(state);
      if (order.items.some(it => it.menuItemId === 'spicy_chicken')) {
        foundSpicy = true;
        break;
      }
    }
    expect(foundSpicy).toBe(true);
  });
});
