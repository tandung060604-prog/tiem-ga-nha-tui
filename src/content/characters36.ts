import { CharacterProfile, CharacterId } from '../types/game';

/**
 * Danh sách 36 Nhân Vật Hẻm 1102 & Hệ Sinh Thái 3 Động Vật
 * Được thiết kế dựa trên bảng 6×6 nhân vật Sài Gòn / Nam Bộ.
 * Tài liệu thiết kế chi tiết: docs/gemini/thiet-ke-36-nhan-vat.md
 */
export const CHARACTERS_36: readonly CharacterProfile[] = [
  // Hàng 1: Ban Quản Trị & Nhân Sự Bếp (1 - 6)
  {
    id: 'char_01_owner',
    name: 'Chủ Quầy (Bạn)',
    roleTitle: 'Chủ Tiệm & Bếp Trưởng',
    category: 'staff',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_story_begin']
  },
  {
    id: 'char_02_lottery_lady',
    name: 'Cô Bảy Bán Vé Số',
    roleTitle: 'Người Bán Vé Số Dạo',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['cheese_stick', 'popcorn_chicken'],
    patienceMultiplier: 1.3,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_lottery_rain']
  },
  {
    id: 'char_03_helper_linh',
    name: 'Bé Linh Phụ Bếp',
    roleTitle: 'Nhân Viên Phụ Bếp',
    category: 'staff',
    unlockChapter: 1,
    favoriteOrder: ['shake_fries', 'seven_up'],
    patienceMultiplier: 1.1,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_kitchen_romance']
  },
  {
    id: 'char_04_fryer_khang',
    name: 'Anh Khang Thợ Chiên',
    roleTitle: 'Thợ Chiên Chính',
    category: 'staff',
    unlockChapter: 2,
    favoriteOrder: ['spicy_thigh', 'soda'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_fryer_perfect_zone']
  },
  {
    id: 'char_05_kid_bo',
    name: 'Bé Bo Mê Gà',
    roleTitle: 'Khách Nhí Hẻm 1102',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'shake_fries'],
    patienceMultiplier: 0.7, // Tụt kiên nhẫn nhanh
    tipTendency: 'generous', // Mẹ tip hào phóng nếu ngon
    karmaAffinity: 'community',
    incidentIds: ['inc_kid_bo_tiktok']
  },
  {
    id: 'char_06_granny_ba',
    name: 'Cụ Ba Quạt Nón',
    roleTitle: 'Bô Lão Hẻm 1102',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['biscuit_honey', 'peach_tea'],
    patienceMultiplier: 1.5,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_granny_secret_recipe']
  },

  // Hàng 2: Thực Khách Điển Hình & Vận May Sài Gòn (7 - 12)
  {
    id: 'char_07_trendy_vy',
    name: 'Vy Thư Ký',
    roleTitle: 'Khách Sành Điệu Văn Phòng',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['honey_garlic_chicken', 'coleslaw'],
    patienceMultiplier: 0.9,
    tipTendency: 'generous',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_trendy_dirty_oil_check']
  },
  {
    id: 'char_08_grumpy_hai',
    name: 'Bác Hai Nghiêm Nghị',
    roleTitle: 'Cựu Chiến Binh Về Hưu',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'danmuji'],
    patienceMultiplier: 0.75,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_grumpy_defense']
  },
  {
    id: 'char_09_buyer_tam',
    name: 'Chú Tám Xe Ôm',
    roleTitle: 'Bác Tài Xe Ôm Truyền Thống',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['chicken_rice', 'soda'],
    patienceMultiplier: 1.2,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_tam_lottery_dusk']
  },
  {
    id: 'char_10_winner_hung',
    name: 'Anh Hưng Trúng Số',
    roleTitle: 'Thợ Hồ Trúng Độc Đắc',
    category: 'regular',
    unlockChapter: 2,
    favoriteOrder: ['family_bucket'],
    patienceMultiplier: 1.4,
    tipTendency: 'generous',
    karmaAffinity: 'community',
    incidentIds: ['inc_winner_treat_neighborhood']
  },
  {
    id: 'char_11_wholesale_nam',
    name: 'Bà Năm Đại Lý Sỉ',
    roleTitle: 'Chủ Đại Lý Vé Số Sỉ',
    category: 'regular',
    unlockChapter: 2,
    favoriteOrder: ['chicken_burger', 'fanta_orange'],
    patienceMultiplier: 1.0,
    tipTendency: 'generous',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_wholesale_bulk_order']
  },
  {
    id: 'char_12_courier_ut',
    name: 'Cậu Út Giao Vé',
    roleTitle: 'Giao Vé Tốc Hành Xe Đạp',
    category: 'transit',
    unlockChapter: 1,
    favoriteOrder: ['popcorn_chicken'],
    patienceMultiplier: 0.6,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_express_quick_bite']
  },

  // Hàng 3: Nhịp Sống Hàng Rong & Dịch Vụ Đêm (13 - 18)
  {
    id: 'char_13_vendor_tham',
    name: 'Chị Thắm Gánh Tàu Hũ',
    roleTitle: 'Người Bán Tàu Hũ Đường Gừng',
    category: 'street_worker',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken'],
    patienceMultiplier: 1.2,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_tham_tau_hu_exchange']
  },
  {
    id: 'char_14_scrap_nam',
    name: 'Bác Năm Ve Chai',
    roleTitle: 'Thu Mua Phế Liệu',
    category: 'street_worker',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken'],
    patienceMultiplier: 1.3,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_scrap_recycling_bonus']
  },
  {
    id: 'char_15_bread_bay',
    name: 'Chú Bảy Bánh Mì',
    roleTitle: 'Bánh Mì Xe Đạp Giòn Tan',
    category: 'street_worker',
    unlockChapter: 2,
    favoriteOrder: ['spicy_chicken'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_bread_collab_banh_mi_ga']
  },
  {
    id: 'char_16_icecream_tu',
    name: 'Anh Tư Kem Ống',
    roleTitle: 'Xe Kem Tuổi Thơ Bóp Kèn',
    category: 'street_worker',
    unlockChapter: 2,
    favoriteOrder: ['spicy_thigh'],
    patienceMultiplier: 1.1,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_icecream_heatwave_combo']
  },
  {
    id: 'char_17_sweeper_lan',
    name: 'Cô Lan Lao Công',
    roleTitle: 'Công Nhân Vệ Sinh Ca Đêm',
    category: 'street_worker',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'sundae_icecream'],
    patienceMultiplier: 1.3,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_sweeper_closing_leftover']
  },
  {
    id: 'char_18_garbage_hung',
    name: 'Chú Hùng Xe Rác',
    roleTitle: 'Người Thu Rác Dân Lập',
    category: 'street_worker',
    unlockChapter: 1,
    favoriteOrder: ['chicken_rice'],
    patienceMultiplier: 1.0,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_garbage_clean_kitchen_oil']
  },

  // Hàng 4: Hội Thợ Nghề & Dịch Vụ Đô Thị (19 - 24)
  {
    id: 'char_19_shipper_tuan',
    name: 'Anh Tuấn Shipper Ruột',
    roleTitle: 'Tài Xế Công Nghệ Thân Quen',
    category: 'transit',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'soda'],
    patienceMultiplier: 1.3,
    tipTendency: 'normal',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_shipper_priority_pickup']
  },
  {
    id: 'char_20_mover_cuong',
    name: 'Anh Cường Bốc Vác',
    roleTitle: 'Chuyên Gia Khuân Vác & Lắp Đặt',
    category: 'street_worker',
    unlockChapter: 2,
    favoriteOrder: ['chicken_rice', 'seven_up'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_mover_equipment_discount']
  },
  {
    id: 'char_21_trucker_long',
    name: 'Bác Tài Long',
    roleTitle: 'Tài Xế Xe Đông Lạnh Thịt Sạch',
    category: 'transit',
    unlockChapter: 2,
    favoriteOrder: ['family_bucket'],
    patienceMultiplier: 1.1,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_trucker_traffic_early_warn']
  },
  {
    id: 'char_22_electrician_dung',
    name: 'Anh Dũng Thợ Điện',
    roleTitle: 'Kỹ Thuật Viên Điện Lực',
    category: 'street_worker',
    unlockChapter: 2,
    favoriteOrder: ['crispy_chicken', 'fanta_orange'],
    patienceMultiplier: 0.9,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_electrician_power_surge_fix']
  },
  {
    id: 'char_23_builder_bay',
    name: 'Chú Bảy Thợ Hồ',
    roleTitle: 'Công Nhân Xây Dựng',
    category: 'street_worker',
    unlockChapter: 1,
    favoriteOrder: ['chicken_rice', 'shake_fries'],
    patienceMultiplier: 1.1,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_builder_heavy_meal']
  },
  {
    id: 'char_24_grocer_sau',
    name: 'Dì Sáu Tạp Hóa',
    roleTitle: 'Tiệm Tạp Hóa Đầu Hẻm',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['biscuit_honey', 'peach_tea'],
    patienceMultiplier: 1.2,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_grocer_emergency_stock']
  },

  // Hàng 5: Trật Tự Đô Thị & Drama Hẻm Phố (25 - 30)
  {
    id: 'char_25_police_nam',
    name: 'Đồng Chí Nam',
    roleTitle: 'Công An Khu Vực',
    category: 'authority',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'danmuji'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_police_safety_inspection']
  },
  {
    id: 'char_26_traffic_hoang',
    name: 'Đại Úy Hoàng',
    roleTitle: 'Cảnh Sát Giao Thông',
    category: 'authority',
    unlockChapter: 2,
    favoriteOrder: ['chicken_burger', 'soda'],
    patienceMultiplier: 0.9,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_traffic_alley_congestion']
  },
  {
    id: 'char_27_warden_hai',
    name: 'Anh Hải Dân Phòng',
    roleTitle: 'Tổ Tuần Tra Đô Thị',
    category: 'authority',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'soda'],
    patienceMultiplier: 1.0,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_warden_sidewalk_line']
  },
  {
    id: 'char_28_tough_beo',
    name: 'Đại Ca Beo',
    roleTitle: 'Tay Anh Chị Đòi Bảo Kê',
    category: 'regular',
    unlockChapter: 2,
    favoriteOrder: ['spicy_thigh', 'spicy_chicken'],
    patienceMultiplier: 0.6,
    tipTendency: 'low',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_tough_beo_extortion']
  },
  {
    id: 'char_29_atm_nga',
    name: 'Chị Nga ATM',
    roleTitle: 'Thực Khách Rút Tiền Ghé Tiệm',
    category: 'transit',
    unlockChapter: 1,
    favoriteOrder: ['korean_tokbokki_chicken', 'peach_tea'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_atm_impulse_dinner']
  },
  {
    id: 'char_30_student_bus',
    name: 'Nữ Sinh Đón Buýt',
    roleTitle: 'Học Sinh Chờ Xe Buýt 08',
    category: 'transit',
    unlockChapter: 1,
    favoriteOrder: ['popcorn_chicken', 'cheese_stick'],
    patienceMultiplier: 0.8,
    tipTendency: 'low',
    karmaAffinity: 'community',
    incidentIds: ['inc_bus_rush_snack']
  },

  // Hàng 6: Đời Sống Hẻm & Hệ Thống 3 Động Vật (31 - 36)
  {
    id: 'char_31_gossip_tam',
    name: 'Bà Tám Hóng Mát',
    roleTitle: 'Camera Chạy Bằng Cơm Hẻm 1102',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken', 'peach_tea'],
    patienceMultiplier: 1.1,
    tipTendency: 'normal',
    karmaAffinity: 'community',
    incidentIds: ['inc_gossip_word_of_mouth']
  },
  {
    id: 'char_32_jogger_tuan',
    name: 'Anh Tuấn Chạy Bộ',
    roleTitle: 'Tín Đồ Thể Thao Healthy',
    category: 'regular',
    unlockChapter: 2,
    favoriteOrder: ['coleslaw'],
    patienceMultiplier: 1.0,
    tipTendency: 'normal',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_jogger_healthy_protein']
  },
  {
    id: 'char_33_couple_genz',
    name: 'Cặp Đôi Bách & Diệp',
    roleTitle: 'Đôi Trẻ Check-in Threads/Insta',
    category: 'regular',
    unlockChapter: 1,
    favoriteOrder: ['spicy_chicken', 'cheese_stick', 'peach_tea'],
    patienceMultiplier: 1.2,
    tipTendency: 'generous',
    karmaAffinity: 'ambition',
    incidentIds: ['inc_couple_viral_threads']
  },
  // 3 Động Vật & Dịch Hại Đặc Biệt (34 - 36)
  {
    id: 'pet_01_dog_vang',
    name: 'Chó Cỏ Vàng',
    roleTitle: 'Vệ Sĩ Cửa Tiệm & Trông Đêm',
    category: 'animal',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken'],
    patienceMultiplier: 2.0,
    tipTendency: 'generous',
    karmaAffinity: 'community',
    incidentIds: ['inc_pet_dog_adoption', 'inc_pet_dog_bark_thief']
  },
  {
    id: 'pet_02_cat_muop',
    name: 'Mèo Mướp Tam Thể',
    roleTitle: 'Thần Tài Diệt Chuột Kho Bếp',
    category: 'animal',
    unlockChapter: 1,
    favoriteOrder: ['crispy_chicken'],
    patienceMultiplier: 2.0,
    tipTendency: 'generous',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_pet_cat_nesting', 'inc_pet_cat_catch_rat']
  },
  {
    id: 'pest_01_rat_cong',
    name: 'Chuột Cống Đột Nhập',
    roleTitle: 'Dịch Hại & Hiểm Họa ATTP',
    category: 'animal',
    unlockChapter: 1,
    favoriteOrder: [],
    patienceMultiplier: 0.1,
    tipTendency: 'low',
    karmaAffinity: 'craftsmanship',
    incidentIds: ['inc_pest_rat_infestation', 'inc_pest_rat_clean_warning']
  }
] as const;

/**
 * Lấy hồ sơ nhân vật theo ID
 */
export function getCharacterProfile(id: CharacterId): CharacterProfile | undefined {
  return CHARACTERS_36.find(c => c.id === id);
}

/**
 * Kiểm tra xem thú cưng có mặt trong quán hay không
 */
export function isPetAdopted(id: 'pet_01_dog_vang' | 'pet_02_cat_muop', adoptedList?: readonly string[]): boolean {
  return !!adoptedList?.includes(id);
}
