import { BaseMenuItemId, MenuItem } from '../types/game';

export const INITIAL_MENU: (MenuItem & { id: BaseMenuItemId })[] = [
  // CHƯƠNG 1
  {
    id: 'crispy_chicken',
    name: 'Gà Giòn Nhà Tui',
    basePrice: 35000,
    currentPrice: 35000,
    chapter: 1,
    icon: '🍗',
    category: 'chicken',
    station: 'fryer',
    steps: ['Tẩm bột', 'Chiên vàng giòn'],
    ingredients: { chicken_meat: 1, flour: 1 }
  },
  {
    id: 'shake_fries',
    name: 'Khoai Lắc Phô Mai',
    basePrice: 25000,
    currentPrice: 25000,
    chapter: 1,
    icon: '🍟',
    category: 'sides',
    station: 'fryer',
    steps: ['Chiên khoai', 'Lắc bột phô mai'],
    ingredients: { potato_cheese: 1 }
  },
  {
    id: 'soda',
    name: 'Nước Ngọt Coca',
    basePrice: 15000,
    currentPrice: 15000,
    chapter: 1,
    icon: '🥤',
    category: 'drinks',
    station: 'drink',
    steps: ['Bơm Coca đầy cốc'],
    ingredients: { soft_drink: 1 }
  },
  {
    id: 'seven_up',
    name: 'Nước Ngọt 7Up Chanh',
    basePrice: 15000,
    currentPrice: 15000,
    chapter: 1,
    icon: '🥤',
    category: 'drinks',
    station: 'drink',
    steps: ['Bơm 7Up đầy cốc'],
    ingredients: { soft_drink: 1 }
  },

  // CHƯƠNG 2
  {
    id: 'fanta_orange',
    name: 'Nước Ngọt Fanta Cam',
    basePrice: 15000,
    currentPrice: 15000,
    chapter: 2,
    icon: '🥤',
    category: 'drinks',
    station: 'drink',
    steps: ['Bơm Fanta Cam đầy cốc'],
    ingredients: { soft_drink: 1 }
  },
  {
    id: 'spicy_chicken',
    name: 'Gà Sốt Cay Xé Lưỡi',
    basePrice: 42000,
    currentPrice: 42000,
    chapter: 2,
    icon: '🌶️',
    category: 'chicken',
    station: 'fryer',
    steps: ['Chiên giòn', 'Quét sốt cay'],
    ingredients: { chicken_meat: 1, flour: 1, spicy_sauce: 1 }
  },
  {
    id: 'honey_garlic_chicken',
    name: 'Gà Mật Ong Bơ Tỏi',
    basePrice: 45000,
    currentPrice: 45000,
    chapter: 2,
    icon: '🍯',
    category: 'chicken',
    station: 'fryer',
    steps: ['Chiên giòn', 'Rưới sốt bơ tỏi'],
    ingredients: { chicken_meat: 1, flour: 1, garlic_honey: 1 }
  },
  {
    id: 'pasta_beef',
    name: 'Mì Ý Sốt Bò Ngọt',
    basePrice: 39000,
    currentPrice: 39000,
    chapter: 2,
    icon: '🍝',
    category: 'sides',
    station: 'noodle',
    steps: ['Trụng mì', 'Rưới sốt bò'],
    ingredients: { pasta_beef: 1 }
  },
  {
    id: 'combo_duo',
    name: 'Combo Cặp Đôi Hẹn Hò',
    basePrice: 89000,
    currentPrice: 89000,
    chapter: 2,
    icon: '🍱',
    category: 'combo',
    station: 'combo',
    components: [{ menuItemId: 'crispy_chicken', count: 2 }, { menuItemId: 'shake_fries', count: 1 }, { menuItemId: 'soda', count: 2 }],
    steps: ['2 Miếng gà', '1 Khoai lắc', '2 Nước ngọt'],
    ingredients: { chicken_meat: 2, flour: 2, potato_cheese: 1, soft_drink: 2 }
  },

  // CHƯƠNG 3
  {
    id: 'biscuit_honey',
    name: 'Bánh Quy Bơ Mật',
    basePrice: 18000,
    currentPrice: 18000,
    chapter: 3,
    icon: '🥐',
    category: 'sides',
    station: 'oven',
    steps: ['Nướng bánh', 'Quét bơ mật'],
    ingredients: { garlic_honey: 1 }
  },
  {
    id: 'chicken_burger',
    name: 'Burger Gà Giòn',
    basePrice: 55000,
    currentPrice: 55000,
    chapter: 3,
    icon: '🍔',
    category: 'chicken',
    station: 'assembly',
    steps: ['Chiên gà', 'Ghép lớp burger'],
    ingredients: { chicken_meat: 1, flour: 1, burger_bun: 1 }
  },
  {
    id: 'popcorn_chicken',
    name: 'Gà Viên Popcorn',
    basePrice: 32000,
    currentPrice: 32000,
    chapter: 3,
    icon: '🍿',
    category: 'chicken',
    station: 'fryer',
    steps: ['Chiên mẻ nhỏ'],
    ingredients: { chicken_meat: 1, flour: 1 }
  },
  {
    id: 'peach_tea',
    name: 'Trà Đào Hạt Chia',
    basePrice: 22000,
    currentPrice: 22000,
    chapter: 3,
    icon: '🍑',
    category: 'drinks',
    station: 'drink',
    steps: ['Pha trà đào', 'Thêm đào miếng'],
    ingredients: { dessert_pack: 1 }
  },

  // CHƯƠNG 4
  {
    id: 'chicken_rice',
    name: 'Cơm Gà Sốt Đặc Biệt',
    basePrice: 49000,
    currentPrice: 49000,
    chapter: 4,
    icon: '🍛',
    category: 'chicken',
    station: 'assembly',
    steps: ['Xới cơm dẻo', 'Gà giòn', 'Rưới nước sốt'],
    ingredients: { chicken_meat: 1, flour: 1, spicy_sauce: 1 }
  },
  {
    id: 'korean_tokbokki_chicken',
    name: 'Gà Trộn Tokbokki Phô Mai',
    basePrice: 69000,
    currentPrice: 69000,
    chapter: 4,
    icon: '🍲',
    category: 'chicken',
    station: 'assembly',
    steps: ['Chiên gà 2 lần', 'Nấu tokbokki', 'Phủ phô mai'],
    ingredients: { chicken_meat: 1, flour: 1, spicy_sauce: 1, potato_cheese: 1 }
  },
  {
    id: 'sundae_icecream',
    name: 'Kem Sundae Sôcôla',
    basePrice: 18000,
    currentPrice: 18000,
    chapter: 4,
    icon: '🍨',
    category: 'drinks',
    station: 'drink',
    steps: ['Rót kem', 'Rưới sốt sôcôla'],
    ingredients: { dessert_pack: 1 }
  },

  // COMBO ĐẶC BIỆT CHƯƠNG 3+
  {
    id: 'family_bucket',
    name: 'Bucket Đại Tiệc Gia Đình',
    basePrice: 179000,
    currentPrice: 179000,
    chapter: 3,
    icon: '🪣',
    category: 'combo',
    station: 'combo',
    // 8 món (mô phỏng: xô 12 món chặn cả hàng khách, Chương 3 tụt từ 66 xuống ~25 khách/ngày)
    components: [{ menuItemId: 'crispy_chicken', count: 4 }, { menuItemId: 'shake_fries', count: 1 }, { menuItemId: 'popcorn_chicken', count: 1 }, { menuItemId: 'soda', count: 2 }],
    steps: ['4 Miếng gà', '1 Khoai lớn', '1 Popcorn', '2 Nước ngọt'],
    ingredients: { chicken_meat: 5, flour: 5, potato_cheese: 1, soft_drink: 2 }
  }
];
