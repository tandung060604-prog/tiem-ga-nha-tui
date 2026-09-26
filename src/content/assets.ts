import { QualityRating } from '../types/game';

// Ghép BASE_URL của Vite: dev = '/', build GitHub Pages = './' (game nằm ở /tiem-ga-nha-tui/).
// Đường dẫn tuyệt đối '/assets/…' từng làm mọi ảnh 404 trên trang live.
// Ngoài Vite (script Node: mô phỏng, Jev) không có import.meta.env → dùng '/'
const BASE = import.meta.env?.BASE_URL ?? '/';
const url = (path: string) => `${BASE}${path}`;

// Đường dẫn ảnh do `npm run assets` sinh ra trong public/assets/. Test kiểm tra mọi file ở đây tồn tại.
export const ASSETS = {
  gabong: {
    front: url('assets/mascot/mascot_gabong_front.png'),
    threeQuarter: url('assets/mascot/mascot_gabong_three_quarter.png'),
    side: url('assets/mascot/mascot_gabong_side.png'),
    hoang: url('assets/mascot/mascot_gabong_hoang.png'),
    khoc: url('assets/mascot/mascot_gabong_khoc.png'),
    vui: url('assets/mascot/mascot_gabong_vui.png')
  },
  bacba: {
    front: url('assets/characters/char_bacba_front.png'),
    threeQuarter: url('assets/characters/char_bacba_three_quarter.png')
  },
  thocam: {
    front: url('assets/characters/char_thocam_front.png'),
    notes: url('assets/characters/char_thocam_notes.png'),
    side: url('assets/characters/char_thocam_side.png'),
    vui: url('assets/characters/char_thocam_vui.png'),
    buon: url('assets/characters/char_thocam_buon.png'),
    ngacNhien: url('assets/characters/char_thocam_ngac_nhien.png'),
    suyNghi: url('assets/characters/char_thocam_suy_nghi.png'),
    ngu: url('assets/characters/char_thocam_ngu.png')
  },
  shipper: {
    walk: url('assets/characters/char_shipper_walk.png'),
    stand: url('assets/characters/char_shipper_stand.png'),
    angry: url('assets/characters/char_shipper_angry.png'),
    leave: url('assets/characters/char_shipper_leave.png')
  },
  hocsinh: {
    walk: url('assets/characters/char_hocsinh_walk.png'),
    stand: url('assets/characters/char_hocsinh_stand.png'),
    angry: url('assets/characters/char_hocsinh_angry.png'),
    leave: url('assets/characters/char_hocsinh_leave.png')
  },
  vanphong: {
    walk: url('assets/characters/char_vanphong_walk.png'),
    stand: url('assets/characters/char_vanphong_stand.png'),
    angry: url('assets/characters/char_vanphong_angry.png'),
    leave: url('assets/characters/char_vanphong_leave.png')
  },
  karen: {
    walk: url('assets/characters/char_karen_walk.png'),
    stand: url('assets/characters/char_karen_stand.png'),
    angry: url('assets/characters/char_karen_angry.png'),
    leave: url('assets/characters/char_karen_leave.png')
  },
  gamethu: {
    walk: url('assets/characters/char_gamethu_walk.png'),
    stand: url('assets/characters/char_gamethu_stand.png'),
    angry: url('assets/characters/char_gamethu_angry.png'),
    leave: url('assets/characters/char_gamethu_leave.png')
  },
  tiktoker: {
    walk: url('assets/characters/char_tiktoker_walk.png'),
    stand: url('assets/characters/char_tiktoker_stand.png'),
    angry: url('assets/characters/char_tiktoker_angry.png'),
    leave: url('assets/characters/char_tiktoker_leave.png')
  },
  capdoi: {
    walk: url('assets/characters/char_capdoi_walk.png'),
    stand: url('assets/characters/char_capdoi_stand.png'),
    angry: url('assets/characters/char_capdoi_angry.png'),
    leave: url('assets/characters/char_capdoi_leave.png')
  },
  becon: {
    walk: url('assets/characters/char_becon_walk.png'),
    stand: url('assets/characters/char_becon_stand.png'),
    angry: url('assets/characters/char_becon_angry.png'),
    leave: url('assets/characters/char_becon_leave.png')
  },
  truongphong: {
    walk: url('assets/characters/char_truongphong_walk.png'),
    stand: url('assets/characters/char_truongphong_stand.png'),
    angry: url('assets/characters/char_truongphong_angry.png'),
    leave: url('assets/characters/char_truongphong_leave.png')
  },
  mecon: {
    walk: url('assets/characters/char_mecon_walk.png'),
    stand: url('assets/characters/char_mecon_stand.png'),
    angry: url('assets/characters/char_mecon_angry.png'),
    leave: url('assets/characters/char_mecon_leave.png')
  },
  babay: {
    walk: url('assets/characters/char_babay_walk.png'),
    stand: url('assets/characters/char_babay_stand.png'),
    angry: url('assets/characters/char_babay_angry.png'),
    leave: url('assets/characters/char_babay_leave.png')
  },
  kitchen: {
    panEmpty: url('assets/kitchen/kitchen_pan_empty.png'),
    oilClean: url('assets/kitchen/kitchen_oil_clean.png'),
    oilMedium: url('assets/kitchen/kitchen_oil_medium.png'),
    oilDirty: url('assets/kitchen/kitchen_oil_dirty.png'),
    prepChicken: url('assets/kitchen/prep_basket_raw_chicken.png'),
    prepFries: url('assets/kitchen/prep_tray_raw_fries.png'),
    prepSoda: url('assets/kitchen/prep_crate_cold_soda.png'),
    prepSpicyPot: url('assets/kitchen/prep_pot_spicy_sauce.png'),
    prepHoneyPot: url('assets/kitchen/prep_pot_honey_sauce.png'),
    stationSodaFountain: url('assets/kitchen/station_soda_fountain.png'),
    bottleKetchup: url('assets/kitchen/bottle_ketchup.png'),
    bottleChili: url('assets/kitchen/bottle_chili.png'),
    sauceDish: url('assets/kitchen/sauce_dish.png')
  },
  food: {
    crispyChickenPerfect: url('assets/food/food_crispy_chicken_perfect.png'),
    crispyChickenRaw: url('assets/food/food_crispy_chicken_raw.png'),
    crispyChickenBurnt: url('assets/food/food_crispy_chicken_burnt.png'),
    spicyChicken: url('assets/food/food_spicy_chicken.png'),
    honeyGarlicChicken: url('assets/food/food_honey_garlic_chicken.png'),
    popcornChicken: url('assets/food/food_popcorn_chicken.png'),
    shakeFries: url('assets/food/food_shake_fries.png'),
    soda: url('assets/food/food_soda.png'),
    sevenUp: url('assets/food/food_7up.png'),
    fantaOrange: url('assets/food/food_fanta.png'),
    pastaBeef: url('assets/food/food_pasta_beef.png'),
    biscuitHoney: url('assets/food/food_biscuit_honey.png'),
    chickenBurger: url('assets/food/food_chicken_burger.png'),
    peachTea: url('assets/food/food_peach_tea.png'),
    chickenRice: url('assets/food/food_chicken_rice.png'),
    tokbokkiChicken: url('assets/food/food_korean_tokbokki_chicken.png'),
    sundaeIcecream: url('assets/food/food_sundae_icecream.png'),
    familyBucket: url('assets/food/food_family_bucket.png')
  },
  ui: {
    bunnyNote: url('assets/ui/ui_bunny_note.png'),
    logoKoreanChicken: url('assets/ui/logo_korean_chicken.png'),
    stickerDrumstick: url('assets/ui/sticker_drumstick.png'),
    stickerNeon: url('assets/ui/sticker_neon.png'),
    stickerFries: url('assets/ui/sticker_fries.png'),
    stickerCat: url('assets/ui/sticker_cat.png'),
    stickerLantern: url('assets/ui/sticker_lantern.png'),
    stickerDaisy: url('assets/ui/sticker_daisy.png'),
    landingVnBg: url('assets/ui/landing_vn_bg.jpg')
  }
} as const;

// Ảnh món theo chất lượng; món chưa có ảnh (gà sốt, món chương sau) → null, UI dùng emoji
export function foodImage(menuItemId: string, quality: QualityRating): string | null {
  switch (menuItemId) {
    case 'crispy_chicken':
      return quality === 'raw' ? ASSETS.food.crispyChickenRaw
        : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt
        : ASSETS.food.crispyChickenPerfect;
    case 'spicy_chicken':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.spicyChicken;
    case 'honey_garlic_chicken':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.honeyGarlicChicken;
    case 'popcorn_chicken':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.popcornChicken;
    case 'shake_fries':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.shakeFries;
    case 'soda':
      return ASSETS.food.soda;
    case 'seven_up':
    case '7up':
      return ASSETS.food.sevenUp;
    case 'fanta_orange':
    case 'fanta':
      return ASSETS.food.fantaOrange;
    case 'pasta_beef':
      return ASSETS.food.pastaBeef;
    case 'biscuit_honey':
      return ASSETS.food.biscuitHoney;
    case 'chicken_burger':
      return ASSETS.food.chickenBurger;
    case 'peach_tea':
      return ASSETS.food.peachTea;
    case 'chicken_rice':
      return ASSETS.food.chickenRice;
    case 'korean_tokbokki_chicken':
      return ASSETS.food.tokbokkiChicken;
    case 'sundae_icecream':
      return ASSETS.food.sundaeIcecream;
    case 'family_bucket':
      return ASSETS.food.familyBucket;
    default:
      return null;
  }
}
