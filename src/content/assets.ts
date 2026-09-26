import { QualityRating } from '../types/game';

// Đường dẫn ảnh do `npm run assets` sinh ra trong public/assets/. Test kiểm tra mọi file ở đây tồn tại.
export const ASSETS = {
  gabong: {
    front: '/assets/mascot/mascot_gabong_front.png',
    threeQuarter: '/assets/mascot/mascot_gabong_three_quarter.png',
    side: '/assets/mascot/mascot_gabong_side.png',
    hoang: '/assets/mascot/mascot_gabong_hoang.png',
    khoc: '/assets/mascot/mascot_gabong_khoc.png',
    vui: '/assets/mascot/mascot_gabong_vui.png'
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
  shipper: {
    walk: '/assets/characters/char_shipper_walk.png',
    stand: '/assets/characters/char_shipper_stand.png',
    angry: '/assets/characters/char_shipper_angry.png',
    leave: '/assets/characters/char_shipper_leave.png'
  },
  hocsinh: {
    walk: '/assets/characters/char_hocsinh_walk.png',
    stand: '/assets/characters/char_hocsinh_stand.png',
    angry: '/assets/characters/char_hocsinh_angry.png',
    leave: '/assets/characters/char_hocsinh_leave.png'
  },
  vanphong: {
    walk: '/assets/characters/char_vanphong_walk.png',
    stand: '/assets/characters/char_vanphong_stand.png',
    angry: '/assets/characters/char_vanphong_angry.png',
    leave: '/assets/characters/char_vanphong_leave.png'
  },
  karen: {
    walk: '/assets/characters/char_karen_walk.png',
    stand: '/assets/characters/char_karen_stand.png',
    angry: '/assets/characters/char_karen_angry.png',
    leave: '/assets/characters/char_karen_leave.png'
  },
  gamethu: {
    walk: '/assets/characters/char_gamethu_walk.png',
    stand: '/assets/characters/char_gamethu_stand.png',
    angry: '/assets/characters/char_gamethu_angry.png',
    leave: '/assets/characters/char_gamethu_leave.png'
  },
  tiktoker: {
    walk: '/assets/characters/char_tiktoker_walk.png',
    stand: '/assets/characters/char_tiktoker_stand.png',
    angry: '/assets/characters/char_tiktoker_angry.png',
    leave: '/assets/characters/char_tiktoker_leave.png'
  },
  capdoi: {
    walk: '/assets/characters/char_capdoi_walk.png',
    stand: '/assets/characters/char_capdoi_stand.png',
    angry: '/assets/characters/char_capdoi_angry.png',
    leave: '/assets/characters/char_capdoi_leave.png'
  },
  becon: {
    walk: '/assets/characters/char_becon_walk.png',
    stand: '/assets/characters/char_becon_stand.png',
    angry: '/assets/characters/char_becon_angry.png',
    leave: '/assets/characters/char_becon_leave.png'
  },
  truongphong: {
    walk: '/assets/characters/char_truongphong_walk.png',
    stand: '/assets/characters/char_truongphong_stand.png',
    angry: '/assets/characters/char_truongphong_angry.png',
    leave: '/assets/characters/char_truongphong_leave.png'
  },
  mecon: {
    walk: '/assets/characters/char_mecon_walk.png',
    stand: '/assets/characters/char_mecon_stand.png',
    angry: '/assets/characters/char_mecon_angry.png',
    leave: '/assets/characters/char_mecon_leave.png'
  },
  babay: {
    walk: '/assets/characters/char_babay_walk.png',
    stand: '/assets/characters/char_babay_stand.png',
    angry: '/assets/characters/char_babay_angry.png',
    leave: '/assets/characters/char_babay_leave.png'
  },
  kitchen: {
    panEmpty: '/assets/kitchen/kitchen_pan_empty.png',
    oilClean: '/assets/kitchen/kitchen_oil_clean.png',
    oilMedium: '/assets/kitchen/kitchen_oil_medium.png',
    oilDirty: '/assets/kitchen/kitchen_oil_dirty.png'
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
