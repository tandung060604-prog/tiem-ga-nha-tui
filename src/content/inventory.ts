import { InventoryItem } from '../types/game';

// Không khai báo `batches`: createInitialState gom `amount` thành lô đầu tiên.
export const INITIAL_INVENTORY: { [id: string]: Omit<InventoryItem, 'batches'> } = {
  // 5 NGUYÊN LIỆU CỐT LÕI (NGÀY 1 - KHỞI NGHIỆP XE ĐẨY)
  chicken_meat: {
    id: 'chicken_meat',
    name: 'Gà tươi tẩm ướp',
    unit: 'miếng',
    cost: 14000,
    amount: 25,
    shelfLifeDays: 2,
    currentLifeDays: 2,
    icon: '🍗',
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  },
  flour: {
    id: 'flour',
    name: 'Bột chiên giòn đặc biệt',
    unit: 'phần',
    cost: 3000,
    amount: 30,
    shelfLifeDays: 10,
    currentLifeDays: 10,
    icon: '🌾',
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  },
  fry_oil: {
    id: 'fry_oil',
    name: 'Dầu chiên cao cấp',
    unit: 'thùng',
    cost: 150000,
    amount: 2,
    shelfLifeDays: 15,
    currentLifeDays: 15,
    icon: '🛢️',
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  },
  potato_cheese: {
    id: 'potato_cheese',
    name: 'Khoai tây & Phô mai',
    unit: 'phần',
    cost: 8000,
    amount: 20,
    shelfLifeDays: 4,
    currentLifeDays: 4,
    icon: '🍟',
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  },
  soft_drink: {
    id: 'soft_drink',
    name: 'Nước ngọt có ga lon',
    unit: 'lon',
    cost: 6000,
    amount: 30,
    shelfLifeDays: 30,
    currentLifeDays: 30,
    icon: '🥤',
    unlocked: true,
    unlockDay: 1,
    unlockCost: 0
  },

  // 5 NGUYÊN LIỆU NÂNG CAO (PHÂN TẦNG MỞ KHÓA THEO NGÀY & PHÍ HỢP ĐỒNG)
  spicy_sauce: {
    id: 'spicy_sauce',
    name: 'Sốt cay xé lưỡi',
    unit: 'phần',
    cost: 5000,
    amount: 0,
    shelfLifeDays: 7,
    currentLifeDays: 7,
    icon: '🌶️',
    unlocked: false,
    unlockDay: 3,
    unlockCost: 50000
  },
  garlic_honey: {
    id: 'garlic_honey',
    name: 'Sốt mật ong bơ tỏi',
    unit: 'phần',
    cost: 6000,
    amount: 0,
    shelfLifeDays: 7,
    currentLifeDays: 7,
    icon: '🍯',
    unlocked: false,
    unlockDay: 4,
    unlockCost: 80000
  },
  dessert_pack: {
    id: 'dessert_pack',
    name: 'Trà đào & Kem Sundae',
    unit: 'ly',
    cost: 8000,
    amount: 0,
    shelfLifeDays: 5,
    currentLifeDays: 5,
    icon: '🍨',
    unlocked: false,
    unlockDay: 7,
    unlockCost: 120000
  },
  pasta_beef: {
    id: 'pasta_beef',
    name: 'Mì Ý & Sốt bò ngọt',
    unit: 'phần',
    cost: 13000,
    amount: 0,
    shelfLifeDays: 3,
    currentLifeDays: 3,
    icon: '🍝',
    unlocked: false,
    unlockDay: 9,
    unlockCost: 150000
  },
  burger_bun: {
    id: 'burger_bun',
    name: 'Vỏ burger & Xà lách',
    unit: 'phần',
    cost: 16000,
    amount: 0,
    shelfLifeDays: 3,
    currentLifeDays: 3,
    icon: '🍔',
    unlocked: false,
    unlockDay: 14,
    unlockCost: 250000
  }
};
