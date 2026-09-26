import { InventoryItem } from '../types/game';

// Không khai báo `batches`: createInitialState gom `amount` thành lô đầu tiên.
export const INITIAL_INVENTORY: { [id: string]: Omit<InventoryItem, 'batches'> } = {
  chicken_meat: {
    id: 'chicken_meat',
    name: 'Gà tươi tẩm ướp',
    unit: 'miếng',
    cost: 14000,
    amount: 25,
    shelfLifeDays: 2,
    currentLifeDays: 2,
    icon: '🍗'
  },
  flour: {
    id: 'flour',
    name: 'Bột chiên giòn đặc biệt',
    unit: 'phần',
    cost: 3000,
    amount: 30,
    shelfLifeDays: 10,
    currentLifeDays: 10,
    icon: '🌾'
  },
  fry_oil: {
    id: 'fry_oil',
    name: 'Dầu chiên cao cấp',
    unit: 'thùng',
    cost: 150000,
    amount: 2,
    shelfLifeDays: 15,
    currentLifeDays: 15,
    icon: '🛢️'
  },
  potato_cheese: {
    id: 'potato_cheese',
    name: 'Khoai tây & Phô mai',
    unit: 'phần',
    cost: 8000,
    amount: 20,
    shelfLifeDays: 4,
    currentLifeDays: 4,
    icon: '🍟'
  },
  spicy_sauce: {
    id: 'spicy_sauce',
    name: 'Sốt cay xé lưỡi',
    unit: 'phần',
    cost: 5000,
    amount: 15,
    shelfLifeDays: 7,
    currentLifeDays: 7,
    icon: '🌶️'
  },
  garlic_honey: {
    id: 'garlic_honey',
    name: 'Sốt mật ong bơ tỏi',
    unit: 'phần',
    cost: 6000,
    amount: 15,
    shelfLifeDays: 7,
    currentLifeDays: 7,
    icon: '🍯'
  },
  pasta_beef: {
    id: 'pasta_beef',
    name: 'Mì Ý & Sốt bò ngọt',
    unit: 'phần',
    cost: 13000,
    amount: 10,
    shelfLifeDays: 3,
    currentLifeDays: 3,
    icon: '🍝'
  },
  burger_bun: {
    id: 'burger_bun',
    name: 'Vỏ burger & Xà lách',
    unit: 'phần',
    cost: 16000,
    amount: 10,
    shelfLifeDays: 3,
    currentLifeDays: 3,
    icon: '🍔'
  },
  soft_drink: {
    id: 'soft_drink',
    name: 'Nước ngọt có ga lon',
    unit: 'lon',
    cost: 6000,
    amount: 30,
    shelfLifeDays: 30,
    currentLifeDays: 30,
    icon: '🥤'
  },
  dessert_pack: {
    id: 'dessert_pack',
    name: 'Trà đào & Kem Sundae',
    unit: 'ly',
    cost: 8000,
    amount: 15,
    shelfLifeDays: 5,
    currentLifeDays: 5,
    icon: '🍨'
  }
};
