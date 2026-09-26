import { QualityRating } from '../types/game';

// Đường dẫn ảnh do `npm run assets` sinh ra trong public/assets/. Test kiểm tra mọi file ở đây tồn tại.
export const ASSETS = {
  gabong: {
    front: '/assets/mascot/mascot_gabong_front.png',
    threeQuarter: '/assets/mascot/mascot_gabong_three_quarter.png',
    side: '/assets/mascot/mascot_gabong_side.png'
  },
  bacba: {
    front: '/assets/characters/char_bacba_front.png',
    threeQuarter: '/assets/characters/char_bacba_three_quarter.png'
  },
  thocam: {
    front: '/assets/characters/char_thocam_front.png',
    notes: '/assets/characters/char_thocam_notes.png',
    side: '/assets/characters/char_thocam_side.png',
    vui: '/assets/characters/char_thocam_vui.png',
    buon: '/assets/characters/char_thocam_buon.png',
    ngacNhien: '/assets/characters/char_thocam_ngac_nhien.png',
    suyNghi: '/assets/characters/char_thocam_suy_nghi.png',
    ngu: '/assets/characters/char_thocam_ngu.png'
  },
  food: {
    crispyChickenPerfect: '/assets/food/food_crispy_chicken_perfect.png',
    crispyChickenRaw: '/assets/food/food_crispy_chicken_raw.png',
    crispyChickenBurnt: '/assets/food/food_crispy_chicken_burnt.png',
    shakeFries: '/assets/food/food_shake_fries.png',
    soda: '/assets/food/food_soda.png'
  }
} as const;

// Ảnh món theo chất lượng; món chưa có ảnh (gà sốt, món chương sau) → null, UI dùng emoji
export function foodImage(menuItemId: string, quality: QualityRating): string | null {
  switch (menuItemId) {
    case 'crispy_chicken':
      return quality === 'raw' ? ASSETS.food.crispyChickenRaw
        : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt
        : ASSETS.food.crispyChickenPerfect;
    case 'shake_fries':
      return ASSETS.food.shakeFries;
    case 'soda':
      return ASSETS.food.soda;
    default:
      return null;
  }
}
