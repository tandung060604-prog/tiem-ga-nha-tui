import { GameState, MemoryAlbumCG } from '../types/game';
import { ASSETS } from './assets';

export const MEMORY_ALBUM_CGS: MemoryAlbumCG[] = [
  {
    id: 'cg_rainy_shelter',
    title: 'Chiều Mưa Dưới Mái Hiên',
    subtitle: 'Bác Ba Tổ Trưởng & Chú Chó Vàng',
    characterName: 'Bác Ba & Bé Vàng',
    image: ASSETS.cg.rainyShelterBacBa,
    unlockCondition: 'Gắn bó từ Ngày 3 hoặc hoàn thành tập 2 Ký Sự Bác Ba',
    storySnippet: 'Những giọt mưa rả rích táp vào bạt che, Bác Ba ngồi bên chiếc bàn gỗ nhỏ, ánh mắt hiền từ nhìn chảo gà sôi sục. Chú chó Vàng nép sát chân ông phe phẩy đuôi. Khoảnh khắc ấy, con hẻm bỗng ấm áp lạ kỳ.',
    karmaBonus: { community: 5, craftsmanship: 3 }
  },
  {
    id: 'cg_mimi_reveal',
    title: 'Nụ Cười Sau Lớp Mascot',
    subtitle: 'Thỏ Cam Mimi & Ly Trà Đào',
    characterName: 'Mimi',
    image: ASSETS.cg.mimiBunnyReveal,
    unlockCondition: 'Mở khóa ≥ 3 Thư Tay Gà Bông hoặc hoàn thành tập 2 Ký Sự Mimi',
    storySnippet: 'Dưới ánh đèn lồng lung linh, cô gái nhỏ tháo chiếc đầu thỏ bông to sụ đặt sang một bên. Mái tóc ướt đẫm mồ hôi nhưng nụ cười tươi rói khi đón nhận ly nước mát từ tay bạn: "Gà giòn bữa nay ngon xỉu luôn chú ơi!"',
    karmaBonus: { community: 8, ambition: 2 }
  },
  {
    id: 'cg_tet_reunion',
    title: 'Bữa Cơm Tất Niên Hẻm 1102',
    subtitle: '12 Tri Kỷ Xóm Hẻm Đoàn Viên',
    characterName: 'Bà Con Hẻm 1102',
    image: ASSETS.cg.tetReunionAlley,
    unlockCondition: 'Kinh doanh qua Ngày 15 hoặc đạt chỉ số Tình Thân Hẻm ≥ 60',
    storySnippet: 'Dãy bàn gỗ mộc nối dài từ đầu hẻm tới cuối hẻm. Mùi gà rán giòn rụm hòa cùng sắc mai vàng rực rỡ và tiếng cười đùa rôm rả của Tuấn Shipper, Cô Mười, Chú Năm Dân Phòng. Hẻm 1102 chính là mái nhà chung trọn vẹn.',
    karmaBonus: { community: 10, craftsmanship: 5 }
  },
  {
    id: 'cg_happy_golden',
    title: 'Vinh Quang Gà Rán Sài Gòn',
    subtitle: 'Đại Lễ Trao Giải Cúp Gà Vàng',
    characterName: 'Toàn Thể Tiệm Gà Nhà Tui',
    image: ASSETS.cg.happyGoldenGrandOpening,
    unlockCondition: 'Đạt Kết Cục Đại Viên Mãn (Happy Ending) hoặc Secret Ending',
    storySnippet: 'Pháo hoa giấy ngũ sắc bay rợp trời trước biển hiệu sáng rực. Chiếc cúp Gà Vàng sáng chói được nâng cao giữa tiếng reo hò vang dội của bà con. Tiệm Gà Nhà Tui đã chiến thắng bằng sự tử tế và ngọn lửa nghề chân chính.',
    karmaBonus: { craftsmanship: 10, ambition: 10 }
  }
];

/**
 * Kiểm tra xem một bức ảnh CG đã mở khóa hay chưa
 */
export function isCGUnlocked(state: GameState, cgId: string): boolean {
  if (state.unlockedCGIds && state.unlockedCGIds.includes(cgId)) {
    return true;
  }

  // Tự động kiểm tra điều kiện mở khóa mềm
  switch (cgId) {
    case 'cg_rainy_shelter':
      return state.day >= 3 || (state.chosenDialogueIds ?? []).some(id => id.includes('bacba'));
    case 'cg_mimi_reveal':
      return (state.unlockedBunnyLetters ?? []).length >= 3 || (state.chosenDialogueIds ?? []).some(id => id.includes('mimi'));
    case 'cg_tet_reunion':
      return state.day >= 15 || (state.karma?.community ?? 0) >= 60;
    case 'cg_happy_golden':
      return (state.achievedEndings ?? []).some(e => e === 'happy' || e === 'secret');
    default:
      return false;
  }
}

/**
 * Mở khóa thủ công bức ảnh CG và cộng điểm Karma thưởng
 */
export function unlockCG(state: GameState, cgId: string): boolean {
  if (!state.unlockedCGIds) {
    state.unlockedCGIds = [];
  }
  if (state.unlockedCGIds.includes(cgId)) {
    return false;
  }

  state.unlockedCGIds.push(cgId);

  // Cộng Karma thưởng nếu có
  const cg = MEMORY_ALBUM_CGS.find(c => c.id === cgId);
  if (cg && cg.karmaBonus && state.karma) {
    if (cg.karmaBonus.community) state.karma.community = Math.min(100, (state.karma.community || 50) + cg.karmaBonus.community);
    if (cg.karmaBonus.craftsmanship) state.karma.craftsmanship = Math.min(100, (state.karma.craftsmanship || 50) + cg.karmaBonus.craftsmanship);
    if (cg.karmaBonus.ambition) state.karma.ambition = Math.min(100, (state.karma.ambition || 50) + cg.karmaBonus.ambition);
  }

  return true;
}

/**
 * Tự động đồng bộ và mở khóa các CG đủ điều kiện
 */
export function syncEligibleCGs(state: GameState): string[] {
  if (!state.unlockedCGIds) {
    state.unlockedCGIds = [];
  }

  const newlyUnlocked: string[] = [];
  for (const cg of MEMORY_ALBUM_CGS) {
    if (!state.unlockedCGIds.includes(cg.id) && isCGUnlocked(state, cg.id)) {
      state.unlockedCGIds.push(cg.id);
      newlyUnlocked.push(cg.id);
    }
  }

  return newlyUnlocked;
}
