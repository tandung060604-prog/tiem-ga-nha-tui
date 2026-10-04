import { GameState, KarmaState, StoryEnding, StoryEndingId } from '../types/game';
import { CHAPTERS } from './chapters';

export const STORY_ENDINGS: Record<StoryEndingId, StoryEnding> = {
  happy: {
    id: 'happy',
    themeClass: 'ending-happy',
    kicker: '🏆 ĐẠI KẾT CỤC 1 — ĐẠI VIÊN MÃN',
    icon: '👑',
    title: 'BẾP LỬA HẺM 1102 & CHUỖI GÀ TRI KỶ',
    tagline: 'Khi mùi thơm gà rán hòa cùng nghĩa tình Sài Gòn, không đế chế nào có thể đánh bại bạn.',
    excerpt: 'An đứng trên sân khấu trao giải Gà Vàng, từ từ tháo chiếc đầu mascot Gà Bông. Dưới ánh đèn rực rỡ, cô gái nở nụ cười rạng rỡ. Bác Ba trao lại cho bạn chiếc vá gỗ gia truyền của tiệm Gà Chợ Lớn năm 1990. Hẻm 1102 tối nay sáng rực ánh đèn mừng ngày hội ngộ.',
    conditionDescription: '❤️ Tình thân hẻm ≥ 75 · 🔥 Tay nghề ≥ 75 · Mở khóa ≥ 6 Mảnh giấy nhớ Gà Bông · Gắn bó tiệm ≥ 100 ngày',
    karma: { community: 95, craftsmanship: 88, ambition: 72 },
    cgImage: '/assets/cg/cg_happy_golden_grand_opening.jpg',
    epilogueDetails: [
      '🐰 Thỏ Cam Mimi: Cởi bỏ trang phục mascot, chính thức trở thành Bếp Phó kiêm Giám đốc Vận hành chuỗi Gà Tri Kỷ.',
      '👴 Bác Ba Tổ Trưởng: Tự hào trao lại chiếc vá gỗ gia truyền, an hưởng tuổi già trong tiếng cười rộn rã đầu hẻm.',
      '🛵 Tuấn Shipper: Lên đời xe tay ga mới, trở thành Đội trưởng Giao hàng siêu tốc Hẻm 1102.',
      '🍧 Cô Mười Bán Chè: Quán chè đông gấp ba nhờ lượng khách ghé tiệm gà qua ăn tráng miệng.'
    ]
  },
  open: {
    id: 'open',
    themeClass: 'ending-open',
    kicker: '🌱 ĐẠI KẾT CỤC 2 — BÌNH DỊ AN YÊN',
    icon: '🏡',
    title: 'GIÓ HẺM THỔI MÃI',
    tagline: 'Không cần trở thành đế chế triệu đô, bình yên dưới mái hiên số 14 đã là một hạnh phúc trọn vẹn.',
    excerpt: 'Tiệm số 14 vẫn mở cửa đón gió chiều mát rượi. Na và Dũng đều đậu vào trường đại học mơ ước. An không còn phải mặc đồ thú bông đi phát tờ rơi nữa, mà trở thành thực khách thân quen mỗi chiều thứ Bảy bên đĩa khoai lắc vàng giòn.',
    conditionDescription: 'Giữ quán gà ấm cúng, cân bằng cuộc sống và giữ trọn tình làng nghĩa xóm.',
    karma: { community: 80, craftsmanship: 75, ambition: 45 },
    cgImage: '/assets/cg/cg_rainy_shelter_bacba.jpg',
    epilogueDetails: [
      '🏡 Tiệm Gà Số 14: Luôn rực lửa hồng mỗi chiều muộn, là chốn dừng chân bình yên của mọi phận người Hẻm 1102.',
      '🎒 Bé Na & Dũng: Tốt nghiệp đại học thủ khoa, vẫn luôn ghé tiệm ăn gà rán mỗi khi về thăm nhà.',
      '☕ Bác Ba & Chú Năm: Chiều nào cũng ngồi trước hiên uống trà đá ngắm nhìn phố thị yên ả trôi qua.'
    ]
  },
  bad_bankruptcy: {
    id: 'bad_bankruptcy',
    themeClass: 'ending-bad-bankruptcy',
    kicker: '💀 BAD ENDING 3A — PHÁ SẢN RỜI HẺM',
    icon: '🌧️',
    title: 'CỬA CUỐN ĐÓNG LẠI',
    tagline: 'Tiếng dầu sôi tắt ngấm, chỉ còn tiếng mưa rơi lộp độp trên mái hiên tôn lạnh lẽo.',
    excerpt: 'Hạn chót tiền cọc mặt bằng đã điểm. Bạn đứng trước xe đẩy xếp gọn đồ đạc trong một buổi chiều mưa nặng hạt. Bác Ba thở dài, dúi vào túi bạn vài tờ tiền lộ phí. Con hẻm 1102 vắng tiếng cười, bạn lặng lẽ rời đi...',
    conditionDescription: 'Quỹ tiệm bị âm 3 ngày liên tiếp.',
    karma: { community: 40, craftsmanship: 50, ambition: 60 },
    cgImage: '/assets/ui/landing_vn_bg_clean.jpg',
    epilogueDetails: [
      '🌧️ Chiều mưa Hẻm 1102: Xe đẩy lặng lẽ rời đi trong tiếng thở dài tiếc nuối của bà con lối xóm.',
      '💡 Bài học kinh doanh: Quản lý dòng tiền và nhập sỉ hợp lý là xương sống sống còn của mọi tiệm ăn.'
    ]
  },
  bad_corporate: {
    id: 'bad_corporate',
    themeClass: 'ending-bad-corporate',
    kicker: '💔 BAD ENDING 3B — ĐÁNH MẤT LINH HỒN',
    icon: '🏢',
    title: 'CỖ MÁY GÀ VÔ HỒN',
    tagline: 'Bạn có được triệu đô, nhưng đã đánh mất tất cả những gì làm nên hương vị của một con hẻm.',
    excerpt: 'Bán 49% cổ phần cho MegaChicken, bạn ngồi trong phòng máy lạnh tầng 30 ngắm nhìn 50 chi nhánh nhượng quyền. Nhưng gà giờ đây dùng bột công nghiệp và thịt đông lạnh nguội ngắt. Bác Ba lặng lẽ bỏ về quê; Bé Gà Bông không bao giờ xuất hiện nữa.',
    conditionDescription: '💼 Tham vọng quy mô ≥ 85 · ❤️ Tình thân hẻm < 40 (Chạy theo lợi nhuận mù quáng).',
    karma: { community: 20, craftsmanship: 30, ambition: 98 },
    cgImage: '/assets/ui/chang_chicken_banner.png',
    epilogueDetails: [
      '🏢 Tòa nhà chọc trời: Đầy ắp tiền bạc nhưng con hẻm xưa đã hoàn toàn bị lãng quên.',
      '💔 Mất mát vô giá: Mùi vị công nghiệp lạnh lẽo đã thay thế ngọn lửa ấm áp của tình người.'
    ]
  },
  bad_police: {
    id: 'bad_police',
    themeClass: 'ending-bad-police',
    kicker: '🚔 BAD ENDING — VÀO TÙ VÌ DẦU ĐEN ĐỘC HẠI',
    icon: '⛓️',
    title: 'XE ĐẶC CHỦNG & NIÊM PHONG TIỆM',
    tagline: 'Cố tình chiên xào dầu đen độc hại đầu độc thực khách, bạn đã phải trả giá sau song sắt trại giam.',
    excerpt: 'Tiếng còi hú xe cảnh sát xé toang không gian Hẻm 1102. Đồng chí Nam cùng Đội Cảnh sát kinh tế và Thanh tra ATTP ập vào bắt quả tang chảo dầu đen đặc cặn cháy lần thứ 3. Lệnh bắt tạm giam được thi hành ngay tại chỗ. Bác Ba cúi đầu rơi nước mắt vì quá thất vọng, thực khách phẫn nộ đòi bồi thường. Quán gà bị tịch thu giấy phép, niêm phong vĩnh viễn, sự nghiệp ẩm thực chấm dứt trong vòng lao lý.',
    conditionDescription: 'Cố tình chiên dầu đen sì bị công an phát hiện và lập biên bản lần thứ 3.',
    karma: { community: 0, craftsmanship: 5, ambition: 30 },
    cgImage: '/assets/characters/char_25_police_nam.png',
    epilogueDetails: [
      '🚔 Niêm phong quán: Vết nhơ lương tâm không bao giờ xóa nhòa.',
      '🛑 Lời cảnh tỉnh: An toàn vệ sinh và lương tâm người nấu bếp là giới hạn đỏ không bao giờ được phép bước qua.'
    ]
  },
  secret: {
    id: 'secret',
    themeClass: 'ending-secret',
    kicker: '🌟 SECRET ENDING — BẢO VẬT ẨM THỰC',
    icon: '✨',
    title: 'CHIẾC VÁ VÀNG 1975',
    tagline: 'Đẳng cấp nghệ nhân ẩm thực đường phố vươn tầm di sản ẩm thực.',
    excerpt: 'Suốt chuỗi ngày kinh doanh, tiệm đạt 5.0 sao tuyệt đối, không một miếng gà cháy, tỷ lệ giòn Perfect đạt cảnh giới thượng thừa. Hiệp hội Ẩm thực Quốc tế trao tặng danh hiệu Bàn Tay Vàng. Chiếc vá gỗ của Bác Ba được đúc đồng mạ vàng trang trọng.',
    conditionDescription: 'Về đích Chương 5 với ≥ 4.9⭐ · Perfect ≥ 85% · cháy ≤ 2% (≥ 200 mẻ) · Gắn bó tiệm ≥ 100 ngày',
    karma: { community: 92, craftsmanship: 100, ambition: 85 },
    cgImage: '/assets/cg/cg_tet_reunion_alley.jpg',
    epilogueDetails: [
      '✨ Chiếc Vá Vàng Vĩnh Cửu: Được trưng bày trang trọng tại Bảo tàng Văn hóa Ẩm thực TP.HCM.',
      '🌟 Huyền thoại lưu danh: Người chủ quán gà Hẻm 1102 trở thành tấm gương sáng về cái Tâm và cái Tầm của ẩm thực Việt Nam.'
    ]
  }
};

export function applyKarmaChange(
  karma: KarmaState,
  delta?: { community?: number; craftsmanship?: number; ambition?: number }
): KarmaState {
  const d = delta ?? {};
  return {
    community: Math.max(0, Math.min(100, karma.community + (d.community ?? 0))),
    craftsmanship: Math.max(0, Math.min(100, karma.craftsmanship + (d.craftsmanship ?? 0))),
    ambition: Math.max(0, Math.min(100, karma.ambition + (d.ambition ?? 0)))
  };
}

export const BANKRUPTCY_DEBT_DAYS = 3;
export const FINALE_CHAPTER = 5;
export const MIN_DAYS_FOR_FINALE = 100;
export const MIN_DAYS_FOR_BEST_ENDING = 100;

// Đỉnh hành trình: đang ở Chương 5, gắn bó tiệm ít nhất 100 ngày và đã gom đủ quỹ dự lễ trao giải Gà Vàng.
export function finaleReady(state: GameState): boolean {
  const finale = CHAPTERS.find(c => c.number === FINALE_CHAPTER);
  const daysReached = (state.day ?? 1) >= MIN_DAYS_FOR_FINALE;
  return state.currentChapter >= FINALE_CHAPTER && !!finale && state.money >= finale.targetMoney && daysReached;
}

// Kết thúc duy nhất có thể xảy ra giữa chừng là phá sản (âm quỹ nhiều ngày liền).
// 4 kết thúc lớn chỉ mở ở đỉnh Chương 5 → người chơi đi hết cốt truyện, không bị cắt ngang ở ngày 25.
export function evaluateEnding(state: GameState): StoryEndingId | null {
  if ((state.dirtyOilViolations ?? 0) >= 3) return 'bad_police';
  if ((state.debtStreak ?? 0) >= BANKRUPTCY_DEBT_DAYS) return 'bad_bankruptcy';
  if (!finaleReady(state)) return null;

  const { totalFried, totalBurnt, perfectFriedCount } = state.lifetimeStats;
  const perfectRatio = perfectFriedCount / Math.max(1, totalFried);
  const burntRatio = totalBurnt / Math.max(1, totalFried);
  const trusted = state.integrity?.tampered !== true; // save bị sửa: không công nhận Viên mãn / Bí mật
  const hasMinDays = (state.day ?? 1) >= MIN_DAYS_FOR_BEST_ENDING;

  if (trusted && hasMinDays && state.ratings.overall >= 4.9 && totalFried >= 200 && perfectRatio >= 0.85 && burntRatio <= 0.02) return 'secret';
  if (state.karma.ambition >= 85 && state.karma.community < 40) return 'bad_corporate';
  if (trusted && hasMinDays && state.karma.community >= 75 && state.karma.craftsmanship >= 75 && state.unlockedBunnyLetters.length >= 6) return 'happy';
  return 'open';
}
