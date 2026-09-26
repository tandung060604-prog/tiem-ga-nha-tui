import { describe, it, expect, beforeAll } from 'vitest';
import { addStock, consumeStock, canUnlockIngredient, signIngredientContract, ensureBatches } from '../src/core/inventory';
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
    expect(signIngredientContract(state, 'spicy_sauce').success).toBe(false);

    // Đến Ngày 3 nhưng không đủ tiền
    state.day = 3;
    state.money = 20000; // thiếu so với 50.000đ
    const checkMoney = canUnlockIngredient(state, 'spicy_sauce');
    expect(checkMoney.canUnlock).toBe(false);
    expect(checkMoney.reason).toContain('Thiếu tiền');
    expect(signIngredientContract(state, 'spicy_sauce').success).toBe(false);
  });

  it('đủ ngày và đủ tiền: trừ tiền chính xác và đổi trạng thái unlocked = true', () => {
    const state = createInitialState();
    state.day = 3;
    state.money = 100000;

    const success = signIngredientContract(state, 'spicy_sauce').success;
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
