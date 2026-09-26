import { GameState, KarmaState, StoryEnding, StoryEndingId } from '../types/game';

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
    conditionDescription: 'Vỡ nợ tiền cọc mặt bằng hoặc điểm đánh giá tổng thể < 2.5 sao.',
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
  secret: {
    id: 'secret',
    themeClass: 'ending-secret',
    kicker: '🌟 SECRET ENDING — BẢO VẬT ẨM THỰC',
    icon: '✨',
    title: 'CHIẾC VÁ VÀNG 1975',
    tagline: 'Đẳng cấp nghệ nhân ẩm thực đường phố vươn tầm di sản ẩm thực.',
    excerpt: 'Suốt chuỗi ngày kinh doanh, tiệm đạt 5.0 sao tuyệt đối, không một miếng gà cháy, tỷ lệ giòn Perfect đạt cảnh giới thượng thừa. Hiệp hội Ẩm thực Quốc tế trao tặng danh hiệu Bàn Tay Vàng. Chiếc vá gỗ của Bác Ba được đúc đồng mạ vàng trang trọng.',
    conditionDescription: '5.0⭐ toàn diện suốt 20 ngày · 0 miếng gà cháy · Tỷ lệ Perfect ≥ 85%.',
    karma: { community: 92, craftsmanship: 100, ambition: 85 }
  }
};

export function applyKarmaChange(
  karma: KarmaState,
  delta: { community?: number; craftsmanship?: number; ambition?: number }
): KarmaState {
  return {
    community: Math.max(0, Math.min(100, karma.community + (delta.community ?? 0))),
    craftsmanship: Math.max(0, Math.min(100, karma.craftsmanship + (delta.craftsmanship ?? 0))),
    ambition: Math.max(0, Math.min(100, karma.ambition + (delta.ambition ?? 0)))
  };
}

export function evaluateEnding(state: GameState): StoryEndingId | null {
  // 1. Secret Ending: Đỉnh cao nghệ nhân
  if (
    state.day >= 20 &&
    state.ratings.overall >= 4.9 &&
    state.lifetimeStats.totalBurnt === 0 &&
    state.lifetimeStats.totalFried >= 30 &&
    (state.lifetimeStats.perfectFriedCount / Math.max(1, state.lifetimeStats.totalFried)) >= 0.85
  ) {
    return 'secret';
  }

  // 2. Bad Ending 3A: Phá sản
  if (state.money < 0 && state.day >= 5) {
    return 'bad_bankruptcy';
  }
  if (state.day >= 15 && state.ratings.overall < 2.5) {
    return 'bad_bankruptcy';
  }

  // Các kết thúc lớn ở cuối hành trình (Chương 5 hoặc Ngày 25+)
  if (state.currentChapter >= 5 || state.day >= 25) {
    // 3. Bad Ending 3B: Bán mình cho tập đoàn
    if (state.karma.ambition >= 85 && state.karma.community < 40) {
      return 'bad_corporate';
    }

    // 4. Happy Ending: Đại viên mãn
    if (
      state.karma.community >= 75 &&
      state.karma.craftsmanship >= 75 &&
      state.unlockedBunnyLetters.length >= 6
    ) {
      return 'happy';
    }

    // 5. Open Ending: Bình dị an yên
    return 'open';
  }

  return null;
}
