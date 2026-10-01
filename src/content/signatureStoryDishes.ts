import { SignatureStoryDish, GameState } from '../types/game';

/**
 * MÓN ĂN KỶ NIỆM GẮN LIỀN CỐT TRUYỆN HẺM 1102 (SIGNATURE STORY DISHES)
 * Các món ăn đặc biệt chỉ mở khóa khi người chơi hoàn thành các cột mốc câu chuyện,
 * mang lại doanh thu cao và điểm thưởng uy tín đặc biệt.
 */
export const SIGNATURE_STORY_DISHES: SignatureStoryDish[] = [
  {
    id: 'dish_chao_ga_gung_bac_ba',
    name: 'Cháo Gà Gừng Tía Tô Bác Ba',
    storyContext: 'Nấu trong đêm mưa Bác Ba bị trúng gió, sưởi ấm tình làng nghĩa xóm.',
    associatedCharacter: 'Bác Ba Tổ Trưởng',
    recipeDescription: 'Gạo rang thơm nấu nhừ cùng nước luộc gà ta, thêm gừng non xắt sợi và lá tía tô giải cảm.',
    priceBonusPercent: 20,
    unlockedByFlag: 'bacba_health_restored',
  },
  {
    id: 'dish_ga_lac_thocam',
    name: 'Gà Lắc Phô Mai Mật Ong Thỏ Cam',
    storyContext: 'Món ăn do Mimi và chủ quán cùng sáng tạo kỷ niệm ngày Mimi đỗ thủ khoa.',
    associatedCharacter: 'Bé Thỏ Cam (Mimi)',
    recipeDescription: 'Miếng gà giòn rụm áo lớp phô mai béo ngậy và sốt mật ong hoa cà phê ngọt ngào.',
    priceBonusPercent: 25,
    unlockedByFlag: 'bunny_study_abroad_success',
  },
  {
    id: 'dish_uc_ga_canh_en_na',
    name: 'Ức Gà Giòn Cánh Én Em Na',
    storyContext: 'Dành tặng Na tiếp sức cho đêm bán kết múa toàn quốc tại Nhà Hát Lớn.',
    associatedCharacter: 'Em Na',
    recipeDescription: 'Ức gà phi lê tẩm bột chiên không ngậm dầu, ăn kèm xà lách sốt mè rang thanh đạm giữ dáng.',
    priceBonusPercent: 15,
    unlockedByFlag: 'na_shoes_wings_drawn',
  },
  {
    id: 'dish_bucket_it_long',
    name: 'Bucket Gà Cày Đêm Kỹ Sư Long IT',
    storyContext: 'Được sáng tạo khi Anh Long đặt tiệc khao 40 kỹ sư công ty làm thêm ca đêm.',
    associatedCharacter: 'Anh Long Trưởng Phòng',
    recipeDescription: 'Thùng 10 miếng gà nóng giòn đủ vị cay nồng kết hợp 4 ly cà phê sữa đá đậm đặc.',
    priceBonusPercent: 30,
    unlockedByFlag: 'long_app_tech_partner',
  },
  {
    id: 'dish_xoi_ga_mai_tuan',
    name: 'Xôi Gà Chiên Giòn Đính Hôn Tuấn & Mai',
    storyContext: 'Kỷ niệm chiếc nhẫn cầu hôn giấu trong hộp gà đêm Trung Thu viên mãn.',
    associatedCharacter: 'Chị Mai & Tuấn Shipper',
    recipeDescription: 'Bánh xôi nếp dẻo chiên phồng kẹp thịt gà xé đậm đà, rưới mỡ hành và hành phi thơm lừng.',
    priceBonusPercent: 25,
    unlockedByFlag: 'mai_tuan_engaged',
  },
  {
    id: 'dish_ga_cho_lon_1990',
    name: 'Gà Rán Thảo Mộc Gia Truyền 1990',
    storyContext: 'Tái sinh công thức bí truyền 30 năm của sư phụ Võ Hòa ngày mở chi nhánh 5.',
    associatedCharacter: 'Mimi & Bác Ba',
    recipeDescription: 'Gà tươi ướp 12 vị thảo mộc Chợ Lớn cổ truyền, chiên bằng chiếc vá gỗ năm 1990 trứ danh.',
    priceBonusPercent: 35,
    unlockedByFlag: 'heritage_branch_thriving',
  },
];

/**
 * Lấy danh sách các món ăn kỷ niệm đã mở khóa
 */
export function getUnlockedSignatureDishes(state: GameState): SignatureStoryDish[] {
  const flags = new Set<string>();

  if (state.characterStoryState?.characterProgress) {
    Object.values(state.characterStoryState.characterProgress).forEach(p => {
      p.causalityFlags?.forEach(f => flags.add(f));
    });
  }

  if (state.customSignatureDishesUnlocked) {
    state.customSignatureDishesUnlocked.forEach(f => flags.add(f));
  }

  return SIGNATURE_STORY_DISHES.filter(d => {
    return flags.has(d.unlockedByFlag) || state.customSignatureDishesUnlocked?.includes(d.id);
  });
}
