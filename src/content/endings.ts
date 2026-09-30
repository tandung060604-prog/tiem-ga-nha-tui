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
    excerpt: 'Mimi đứng trên sân khấu trao giải Gà Vàng, từ từ tháo chiếc đầu mascot Thỏ Cam. Dưới ánh đèn rực rỡ, cô gái nở nụ cười rạng rỡ. Bác Ba trao lại cho bạn chiếc vá gỗ gia truyền của tiệm Gà Chợ Lớn năm 1990. Hẻm 1102 tối nay sáng rực ánh đèn mừng ngày hội ngộ.',
    conditionDescription: '❤️ Tình thân hẻm ≥ 75 · 🔥 Tay nghề ≥ 75 · Mở khóa trọn vẹn 6 thư Thỏ Cam',
    karma: { community: 95, craftsmanship: 88, ambition: 72 }
  },
  open: {
    id: 'open',
    themeClass: 'ending-open',
    kicker: '🌱 ĐẠI KẾT CỤC 2 — BÌNH DỊ AN YÊN',
    icon: '🏡',
    title: 'GIÓ HẺM THỔI MÃI',
    tagline: 'Không cần trở thành đế chế triệu đô, bình yên dưới mái hiên số 14 đã là một hạnh phúc trọn vẹn.',
    excerpt: 'Tiệm số 14 vẫn mở cửa đón gió chiều mát rượi. Na và Dũng đều đậu vào trường đại học mơ ước. Mimi không còn phải mặc đồ thú bông đi phát tờ rơi nữa, mà trở thành thực khách thân quen mỗi chiều thứ Bảy bên đĩa khoai lắc vàng giòn.',
    conditionDescription: 'Giữ quán gà ấm cúng, cân bằng cuộc sống và giữ trọn tình làng nghĩa xóm.',
    karma: { community: 80, craftsmanship: 75, ambition: 45 }
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
    karma: { community: 40, craftsmanship: 50, ambition: 60 }
  },
  bad_corporate: {
    id: 'bad_corporate',
    themeClass: 'ending-bad-corporate',
    kicker: '💔 BAD ENDING 3B — ĐÁNH MẤT LINH HỒN',
    icon: '🏢',
    title: 'CỖ MÁY GÀ VÔ HỒN',
    tagline: 'Bạn có được triệu đô, nhưng đã đánh mất tất cả những gì làm nên hương vị của một con hẻm.',
    excerpt: 'Bán 49% cổ phần cho MegaChicken, bạn ngồi trong phòng máy lạnh tầng 30 ngắm nhìn 50 chi nhánh nhượng quyền. Nhưng gà giờ đây dùng bột công nghiệp và thịt đông lạnh nguội ngắt. Bác Ba lặng lẽ bỏ về quê; Thỏ Cam không bao giờ xuất hiện nữa.',
    conditionDescription: '💼 Tham vọng quy mô ≥ 85 · ❤️ Tình thân hẻm < 40 (Chạy theo lợi nhuận mù quáng).',
    karma: { community: 20, craftsmanship: 30, ambition: 98 }
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
    karma: { community: 0, craftsmanship: 5, ambition: 30 }
  },
  secret: {
    id: 'secret',
    themeClass: 'ending-secret',
    kicker: '🌟 SECRET ENDING — BẢO VẬT ẨM THỰC',
    icon: '✨',
    title: 'CHIẾC VÁ VÀNG 1975',
    tagline: 'Đẳng cấp nghệ nhân ẩm thực đường phố vươn tầm di sản ẩm thực.',
    excerpt: 'Suốt chuỗi ngày kinh doanh, tiệm đạt 5.0 sao tuyệt đối, không một miếng gà cháy, tỷ lệ giòn Perfect đạt cảnh giới thượng thừa. Hiệp hội Ẩm thực Quốc tế trao tặng danh hiệu Bàn Tay Vàng. Chiếc vá gỗ của Bác Ba được đúc đồng mạ vàng trang trọng.',
    conditionDescription: 'Về đích Chương 5 với ≥ 4.9⭐ · Perfect ≥ 85% · cháy ≤ 2% (≥ 200 mẻ).',
    karma: { community: 92, craftsmanship: 100, ambition: 85 }
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

// Đỉnh hành trình: đang ở Chương 5 và đã gom đủ quỹ dự lễ trao giải Gà Vàng.
export function finaleReady(state: GameState): boolean {
  const finale = CHAPTERS.find(c => c.number === FINALE_CHAPTER);
  return state.currentChapter >= FINALE_CHAPTER && !!finale && state.money >= finale.targetMoney;
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
  if (trusted && state.ratings.overall >= 4.9 && totalFried >= 200 && perfectRatio >= 0.85 && burntRatio <= 0.02) return 'secret';
  if (state.karma.ambition >= 85 && state.karma.community < 40) return 'bad_corporate';
  if (trusted && state.karma.community >= 75 && state.karma.craftsmanship >= 75 && state.unlockedBunnyLetters.length >= 6) return 'happy';
  return 'open';
}
