import { QualityRating, StaffRole, StaffRarity } from '../types/game';

// Ghép BASE_URL của Vite: dev = '/', build GitHub Pages = './' (game nằm ở /tiem-ga-nha-tui/).
// Đường dẫn tuyệt đối '/assets/…' từng làm mọi ảnh 404 trên trang live.
// Ngoài Vite (script Node: mô phỏng, Jev) không có import.meta.env → dùng '/'
const BASE = import.meta.env?.BASE_URL ?? '/';
const url = (path: string) => `${BASE}${path}`;

// Đường dẫn ảnh do `npm run assets` sinh ra trong public/assets/. Test kiểm tra mọi file ở đây tồn tại.
export const ASSETS = {
  audio: {
    bgmTitle: url('assets/audio/bgm_title.mp3'),
    bgmSelling: url('assets/audio/bgm_selling.mp3')
  },
  gabong: {
    front: url('assets/mascot/mascot_gabong_front.png'),
    threeQuarter: url('assets/mascot/mascot_gabong_three_quarter.png'),
    side: url('assets/mascot/mascot_gabong_side.png'),
    hoang: url('assets/mascot/mascot_gabong_hoang.png'),
    khoc: url('assets/mascot/mascot_gabong_khoc.png'),
    vui: url('assets/mascot/mascot_gabong_vui.png')
  },
  characters: {
    char_01_owner: url('assets/characters/char_01_owner.png'),
    char_02_lottery_lady: url('assets/characters/char_02_lottery_lady.png'),
    char_03_helper_linh: url('assets/characters/char_03_helper_linh.png'),
    char_04_fryer_khang: url('assets/characters/char_04_fryer_khang.png'),
    char_05_kid_bo: url('assets/characters/char_05_kid_bo.png'),
    char_06_granny_ba: url('assets/characters/char_06_granny_ba.png'),
    char_07_trendy_vy: url('assets/characters/char_07_trendy_vy.png'),
    char_08_grumpy_hai: url('assets/characters/char_08_grumpy_hai.png'),
    char_09_buyer_tam: url('assets/characters/char_09_buyer_tam.png'),
    char_10_winner_hung: url('assets/characters/char_10_winner_hung.png'),
    char_11_wholesale_nam: url('assets/characters/char_11_wholesale_nam.png'),
    char_12_courier_ut: url('assets/characters/char_12_courier_ut.png'),
    char_13_vendor_tham: url('assets/characters/char_13_vendor_tham.png'),
    char_14_scrap_nam: url('assets/characters/char_14_scrap_nam.png'),
    char_15_bread_bay: url('assets/characters/char_15_bread_bay.png'),
    char_16_icecream_tu: url('assets/characters/char_16_icecream_tu.png'),
    char_17_sweeper_lan: url('assets/characters/char_17_sweeper_lan.png'),
    char_18_garbage_hung: url('assets/characters/char_18_garbage_hung.png'),
    char_19_shipper_tuan: url('assets/characters/char_19_shipper_tuan.png'),
    char_20_mover_cuong: url('assets/characters/char_20_mover_cuong.png'),
    char_21_trucker_long: url('assets/characters/char_21_trucker_long.png'),
    char_22_electrician_dung: url('assets/characters/char_22_electrician_dung.png'),
    char_23_builder_bay: url('assets/characters/char_23_builder_bay.png'),
    char_24_grocer_sau: url('assets/characters/char_24_grocer_sau.png'),
    char_25_police_nam: url('assets/characters/char_25_police_nam.png'),
    char_26_traffic_hoang: url('assets/characters/char_26_traffic_hoang.png'),
    char_27_warden_hai: url('assets/characters/char_27_warden_hai.png'),
    char_28_tough_beo: url('assets/characters/char_28_tough_beo.png'),
    char_29_atm_nga: url('assets/characters/char_29_atm_nga.png'),
    char_30_student_bus: url('assets/characters/char_30_student_bus.png'),
    char_31_gossip_tam: url('assets/characters/char_31_gossip_tam.png'),
    char_32_jogger_tuan: url('assets/characters/char_32_jogger_tuan.png'),
    char_33_couple_genz: url('assets/characters/char_33_couple_genz.png'),
    pet_01_dog_vang: url('assets/characters/pet_01_dog_vang.png'),
    pet_02_cat_muop: url('assets/characters/pet_02_cat_muop.png'),
    pest_01_rat_cong: url('assets/characters/pest_01_rat_cong.png'),
    char_37_thief_busted: url('assets/characters/char_37_thief_busted.png')
  },
  // Ánh xạ tương thích cho các component cũ (dùng ảnh từ bộ 36 nhân vật chuẩn)
  bacba: {
    front: url('assets/characters/char_08_grumpy_hai.png'),
    threeQuarter: url('assets/characters/char_08_grumpy_hai.png')
  },
  thocam: {
    front: url('assets/mascot/mascot_gabong_front.png'),
    notes: url('assets/mascot/mascot_gabong_vui.png'),
    side: url('assets/mascot/mascot_gabong_side.png'),
    vui: url('assets/mascot/mascot_gabong_vui.png'),
    buon: url('assets/mascot/mascot_gabong_khoc.png'),
    ngacNhien: url('assets/mascot/mascot_gabong_hoang.png'),
    suyNghi: url('assets/mascot/mascot_gabong_three_quarter.png'),
    ngu: url('assets/mascot/mascot_gabong_front.png')
  },
  shipper: {
    walk: url('assets/characters/char_19_shipper_walk.png'),
    stand: url('assets/characters/char_19_shipper_tuan.png'),
    angry: url('assets/characters/char_19_shipper_tuan.png'),
    leave: url('assets/characters/char_19_shipper_walk.png')
  },
  hocsinh: {
    walk: url('assets/characters/char_30_student_walk.png'),
    stand: url('assets/characters/char_30_student_bus.png'),
    angry: url('assets/characters/char_30_student_bus.png'),
    leave: url('assets/characters/char_takeaway_walk.png')
  },
  vanphong: {
    walk: url('assets/characters/char_07_office_walk.png'),
    stand: url('assets/characters/char_07_trendy_vy.png'),
    angry: url('assets/characters/char_07_trendy_vy.png'),
    leave: url('assets/characters/char_takeaway_walk.png')
  },
  takeawayCustomer: url('assets/characters/char_takeaway_walk.png'),
  pets: {
    dogWalk: url('assets/characters/pet_01_dog_vang_walk.png'),
    catWalk: url('assets/characters/pet_02_cat_muop_walk.png'),
    ratWalk: url('assets/characters/pest_01_rat_cong_walk.png'),
    mascotWalk: url('assets/mascot/mascot_gabong_walk.png')
  },
  karen: {
    walk: url('assets/characters/char_07_office_walk.png'),
    stand: url('assets/characters/char_31_gossip_tam.png'),
    angry: url('assets/characters/char_31_gossip_tam.png'),
    leave: url('assets/characters/char_takeaway_walk.png')
  },
  gamethu: {
    walk: url('assets/characters/char_12_courier_ut.png'),
    stand: url('assets/characters/char_12_courier_ut.png'),
    angry: url('assets/characters/char_12_courier_ut.png'),
    leave: url('assets/characters/char_12_courier_ut.png')
  },
  tiktoker: {
    walk: url('assets/characters/char_07_trendy_vy.png'),
    stand: url('assets/characters/char_07_trendy_vy.png'),
    angry: url('assets/characters/char_07_trendy_vy.png'),
    leave: url('assets/characters/char_07_trendy_vy.png')
  },
  capdoi: {
    walk: url('assets/characters/char_33_couple_genz.png'),
    stand: url('assets/characters/char_33_couple_genz.png'),
    angry: url('assets/characters/char_33_couple_genz.png'),
    leave: url('assets/characters/char_33_couple_genz.png')
  },
  becon: {
    walk: url('assets/characters/char_05_kid_bo.png'),
    stand: url('assets/characters/char_05_kid_bo.png'),
    angry: url('assets/characters/char_05_kid_bo.png'),
    leave: url('assets/characters/char_05_kid_bo.png')
  },
  truongphong: {
    walk: url('assets/characters/char_10_winner_hung.png'),
    stand: url('assets/characters/char_10_winner_hung.png'),
    angry: url('assets/characters/char_10_winner_hung.png'),
    leave: url('assets/characters/char_10_winner_hung.png')
  },
  mecon: {
    walk: url('assets/characters/char_06_granny_ba.png'),
    stand: url('assets/characters/char_06_granny_ba.png'),
    angry: url('assets/characters/char_06_granny_ba.png'),
    leave: url('assets/characters/char_06_granny_ba.png')
  },
  babay: {
    walk: url('assets/characters/char_02_lottery_lady.png'),
    stand: url('assets/characters/char_02_lottery_lady.png'),
    angry: url('assets/characters/char_02_lottery_lady.png'),
    leave: url('assets/characters/char_02_lottery_lady.png')
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
    sauceDish: url('assets/kitchen/sauce_dish.png'),
    // Khay Inox GN Âm Bàn (Gastronorm Pan)
    gnPanEmpty: url('assets/kitchen/pan_empty.png'),
    gnPanLocked: url('assets/kitchen/pan_locked_slot.png'),
    gnPanSauceYangnyeom: url('assets/kitchen/pan_sauce_yangnyeom.png'),
    gnPanSauceSoyGarlic: url('assets/kitchen/pan_sauce_soy_garlic.png'),
    gnPrepChickenRaw: url('assets/kitchen/prep_chicken_raw.png'),
    gnPrepThighRaw: url('assets/kitchen/prep_thigh_raw.png'),
    gnPrepFriesRaw: url('assets/kitchen/prep_fries_raw.png'),
    gnPrepPopcornRaw: url('assets/kitchen/prep_popcorn_raw.png'),
    gnPrepCheeseStickRaw: url('assets/kitchen/prep_cheese_stick_raw.png'),
    gnSideRadishPickled: url('assets/kitchen/side_radish_pickled.png'),
    gnSideColeslaw: url('assets/kitchen/side_coleslaw.png')
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
    familyBucket: url('assets/food/food_family_bucket.png'),
    spicyThigh: url('assets/food/food_spicy_thigh.png'),
    cheeseStick: url('assets/food/food_cheese_stick.png'),
    danmuji: url('assets/food/food_danmuji.png'),
    coleslaw: url('assets/food/food_coleslaw.png')
  },
  ui: {
    bunnyNote: url('assets/ui/ui_bunny_note.png'),
    logoKoreanChicken: url('assets/ui/logo_korean_chicken.png'),
    changChickenLogo: url('assets/ui/chang_chicken.png'),
    changChickenBanner: url('assets/ui/chang_chicken_banner.png'),
    stickerDrumstick: url('assets/ui/sticker_drumstick.png'),
    stickerNeon: url('assets/ui/sticker_neon.png'),
    stickerFries: url('assets/ui/sticker_fries.png'),
    stickerCat: url('assets/ui/sticker_cat.png'),
    stickerLantern: url('assets/ui/sticker_lantern.png'),
    stickerDaisy: url('assets/ui/sticker_daisy.png'),
    landingVnBg: url('assets/ui/landing_vn_bg_clean.jpg'),
    bannerStardewChicken: url('assets/ui/banner_stardew_chicken.png'),
    patioBistroBg: url('assets/ui/patio_bistro_bg.jpg'),
    mailboxStardew: url('assets/ui/mailbox_stardew.png')
  },
  intro: {
    poster: url('assets/intro/veo_intro_cinematic.jpg'),
    video: url('assets/intro/intro_video.mp4')
  },
  icons: {
    book: url('assets/icons/icon_book.png'),
    clock: url('assets/icons/icon_clock.png'),
    fireRush: url('assets/icons/icon_fire_rush.png'),
    inventory: url('assets/icons/icon_inventory.png'),
    lock: url('assets/icons/icon_lock.png'),
    money: url('assets/icons/icon_money.png'),
    reviews: url('assets/icons/icon_reviews.png'),
    settings: url('assets/icons/icon_settings.png'),
    share: url('assets/icons/icon_share.png'),
    soundOn: url('assets/icons/icon_sound_on.png'),
    soundOff: url('assets/icons/icon_sound_off.png'),
    staff: url('assets/icons/icon_staff.png'),
    star: url('assets/icons/icon_star.png'),
    starEmpty: url('assets/icons/icon_star_empty.png'),
    upgrade: url('assets/icons/icon_upgrade.png'),
    bell: url('assets/icons/icon_bell.png'),
    heart: url('assets/icons/icon_heart.png'),
    oilCan: url('assets/icons/icon_oil_can.png'),
    sauce: url('assets/icons/icon_sauce.png'),
    scooter: url('assets/icons/icon_scooter.png'),
    trash: url('assets/icons/icon_trash.png'),
    sparkle: url('assets/icons/icon_sparkle.png'),
    broom: url('assets/icons/icon_broom.png'),
    trophy: url('assets/icons/icon_trophy.png'),
    newspaper: url('assets/icons/icon_newspaper.png'),
    chickenCrispy: url('assets/icons/icon_chicken_crispy.png'),
    chickenSpicy: url('assets/icons/icon_chicken_spicy.png'),
    chickenHoney: url('assets/icons/icon_chicken_honey.png'),
    shakeFries: url('assets/icons/icon_shake_fries.png'),
    sodaCup: url('assets/icons/icon_soda_cup.png'),
    pan: url('assets/icons/icon_pan.png'),
    roleCook: url('assets/icons/icon_role_cook.png'),
    roleWaiter: url('assets/icons/icon_role_waiter.png'),
    roleCashier: url('assets/icons/icon_role_cashier.png'),
    roleDelivery: url('assets/icons/icon_role_delivery.png'),
    roleManager: url('assets/icons/icon_role_manager.png'),
    roleSecurity: url('assets/icons/icon_role_security.png'),
    menu: url('assets/icons/icon_hamburger_menu.png'),
    lightning: url('assets/icons/icon_lightning.png'),
    cat: url('assets/icons/icon_cat.png'),
    dog: url('assets/icons/icon_dog.png'),
    radio: url('assets/icons/icon_radio.png'),
    check: url('assets/icons/icon_check.png'),
    close: url('assets/icons/icon_close.png'),
    gift: url('assets/icons/icon_gift.png'),
    target: url('assets/icons/icon_target.png'),
    police: url('assets/icons/icon_police.png'),
    emoteYum: url('assets/icons/emote_yum.png'),
    emoteSweat: url('assets/icons/emote_sweat.png'),
    emoteAnger: url('assets/icons/emote_anger.png'),
    emoteQuestion: url('assets/icons/emote_question.png'),
    emoteMoney: url('assets/icons/emote_money.png'),
    emoteOilAlert: url('assets/icons/emote_oil_alert.png'),
    emoteHeart: url('assets/icons/emote_heart.png'),
    emoteDogBark: url('assets/icons/emote_dog_bark.png'),
    emoteCatPurr: url('assets/icons/emote_cat_purr.png')
  }
} as const;

/**
 * Trả về đường dẫn ảnh icon Sài Gòn Retro theo tên
 */
export function saigonIcon(name: keyof typeof ASSETS.icons | string): string {
  const iconsMap = ASSETS.icons as Record<string, string>;
  return iconsMap[name] || iconsMap.sparkle || '';
}

/**
 * Trả về chuỗi HTML thẻ <img> chuẩn pixel art
 */
export function saigonIconImg(name: keyof typeof ASSETS.icons | string, className = 'btn-pixel-icon-sm', alt = ''): string {
  const src = saigonIcon(name);
  return `<img class="${className}" src="${src}" alt="${alt}" loading="lazy" />`;
}

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
    case 'spicy_thigh':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.spicyThigh;
    case 'cheese_stick':
      return quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.cheeseStick;
    case 'danmuji':
      return ASSETS.food.danmuji;
    case 'coleslaw':
      return ASSETS.food.coleslaw;
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
    case 'combo_duo':
      return ASSETS.food.familyBucket;
    default:
      return null;
  }
}

/**
 * Chuẩn hóa và xuất đường dẫn ảnh pixel model cho nhân viên, tự động ghép BASE_URL an toàn.
 */
export function staffImage(memberOrCandidate?: {
  id?: string;
  modelAsset?: string;
  role?: StaffRole;
  rarity?: StaffRarity;
  avatar?: string;
} | null): string {
  if (!memberOrCandidate) return url('assets/staff/cook_c1.png');

  // 1. Nếu có modelAsset cụ thể
  if (memberOrCandidate.modelAsset) {
    const raw = memberOrCandidate.modelAsset;
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw;
    }
    // Gỡ bỏ tiền tố ./ hoặc / để url() ghép chuẩn BASE_URL
    const clean = raw.replace(/^\.?\//, '');
    return url(clean);
  }

  // 2. Nếu id khớp với mã model gacha 72 nhân vật hoặc initial candidates
  if (memberOrCandidate.id) {
    const cleanId = memberOrCandidate.id.toLowerCase();
    const match = cleanId.match(/^(cook|waiter|cashier|delivery|manager|security)_(c[1-4]|r[1-4]|sr[1-3]|ssr|[cr]|sr)$/);
    if (match) {
      return url(`assets/staff/${cleanId}.png`);
    }

    const initialMap: Record<string, string> = {
      staff_1: 'assets/staff/cashier_c1.png',
      staff_2: 'assets/staff/cook_c1.png',
      staff_3: 'assets/staff/waiter_c1.png',
      staff_4: 'assets/staff/delivery_c1.png',
      staff_5: 'assets/staff/security_c1.png'
    };
    if (initialMap[memberOrCandidate.id]) {
      return url(initialMap[memberOrCandidate.id]!);
    }
  }

  // 3. Fallback theo role và rarity
  const role = memberOrCandidate.role || 'cook';
  const rarity = (memberOrCandidate.rarity || 'C').toLowerCase();
  const suffix = rarity === 'ssr' ? 'ssr' : rarity === 'sr' ? 'sr1' : rarity === 'r' ? 'r1' : 'c1';
  return url(`assets/staff/${role}_${suffix}.png`);
}
