import { DailyIncident } from '../types/game';

const BASE = import.meta.env?.BASE_URL ?? '/';
const charImg = (name: string) => `${BASE}assets/characters/${name}`;

/**
 * 50 SỰ KIỆN QUIZ TÌNH HUỐNG MỞ RỘNG HẺM 1102
 * Giúp hành trình kinh doanh 100-250 ngày luôn kịch tính, phong phú và sâu sắc.
 * Phân tầng theo 5 Chương:
 * - Chương 1 (Xe Đẩy Vỉa Hè, Ngày 2-7): 10 Sự Kiện
 * - Chương 2 (Căn Nhà Số 14, Ngày 8-18): 10 Sự Kiện
 * - Chương 3 (Mặt Tiền Phố Lớn, Ngày 19-35): 10 Sự Kiện
 * - Chương 4 (Cuộc Chiến MegaChicken, Ngày 36-60): 10 Sự Kiện
 * - Chương 5 (Đế Chế Bistro & Giải Gà Vàng, Ngày 61-120+): 10 Sự Kiện
 */
export const EXPANDED_DAILY_INCIDENTS: DailyIncident[] = [
  // =========================================================================
  // CHƯƠNG 1: XE ĐẨY VỈA HÈ MỘC MẠC (NGÀY 2 - 7) - 10 SỰ KIỆN
  // =========================================================================

  // 1. Mưa Rào Bất Chợt Làm Sập Bạt Xe Đẩy (Ngày 2)
  {
    id: 'inc_quiz_01_rain_tarp',
    title: 'Mưa Rào Bất Chợt Làm Sập Bạt Xe Đẩy',
    categoryTag: 'SỰ CỐ VỈA HÈ',
    icon: '🌧️',
    characterName: 'Chị Thắm Hàng Xóm',
    characterAvatar: '👩‍🌾',
    characterImg: charImg('char_13_vendor_tham.png'),
    emoteBubble: '💦',
    characterRole: 'Chủ Sạp Trái Cây Đối Diện',
    context: 'Cơn mưa dông Sài Gòn ập xuống như trút nước, bạt che xe đẩy bị đọng nước trĩu nặng sắp sập trúng chảo dầu đang sôi sùng sục.',
    dialogue: 'Trời đất ơi em gì ơi! Coi chừng cái bạt nó chùng nước sập vô chảo dầu bây giờ! Chạy qua bển lấy cây sào đỡ mau lên!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 2,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 2: Cơn mưa rào đầu mùa thử thách mái che xe đẩy.',
    choices: [
      {
        id: 'tarp_fix_safe',
        label: 'Dập lửa bếp gas ngay, nhờ bà con phụ chống sào',
        subDesc: 'An toàn tuyệt đối, mẻ gà tạm nguội một chút nhưng không ai bị bỏng',
        kicker: '🛡️ AN TOÀN TRÊN HẾT',
        karmaDelta: { craftsmanship: 15, community: 10 },
        moneyDelta: -5000,
        reactionTitle: 'Thoát Hiểm Trong Gang Tấc',
        reactionNarrative: 'Bà con xung quanh xúm lại phụ chống sào đẩy bọc nước mưa ra ngoài. Chảo dầu an toàn, mọi người cùng thở phào nhẹ nhõm.'
      },
      {
        id: 'tarp_risk_hold',
        label: 'Một tay níu bạt, một tay vớt nốt mẻ gà đang giòn',
        subDesc: 'Rủi ro 40%: Dầu bắn xèo xèo trúng tay, cứu được mẻ gà nhưng tốn tiền thuốc',
        kicker: '🔥 LIỀU LĨNH CỨU ĐƠN',
        riskRate: 0.4,
        karmaDelta: { ambition: 15, craftsmanship: -10 },
        moneyDelta: 20000,
        reactionTitle: 'Mẻ Gà Vàng Giòn Trong Mưa',
        reactionNarrative: 'Bạn gồng mình vớt kịp mẻ gà giòn rụm giao cho khách, dù tay hơi rát vì vài giọt dầu bắn nhưng đơn hàng vẫn tròn vẹn.',
        reactionFailureNarrative: 'Nước mưa tạt vào chảo dầu làm dầu sôi bắn tung tóe! Bạn bị phỏng nhẹ ở mu bàn tay và phải đổ bỏ mẻ gà, tốn 25.000đ mua thuốc sát trùng.'
      },
      {
        id: 'tarp_invite_neighbors',
        label: 'Mời mọi người trú mưa nấp chung hiên & rót trà nóng',
        subDesc: 'Hiên xe đẩy chật ních tiếng cười, bà con tấm tắc khen chủ tiệm thảo ăn',
        kicker: '☕ TÌNH THÂN TRONG MƯA',
        karmaDelta: { community: 25 },
        moneyDelta: 0,
        reactionTitle: 'Mái Hiên Ấm Áp Giữa Mưa Dông',
        reactionNarrative: 'Mấy bác xe ôm và cô bán vé số đứng chen chúc dưới mái hiên cùng nhâm nhi ly trà nóng. Tình người Sài Gòn làm ấm bừng cả con hẻm.'
      }
    ]
  },

  // 2. Hai Bé Học Sinh Mua Chung Cánh Gà (Ngày 2)
  {
    id: 'inc_quiz_02_student_split',
    title: 'Hai Bạn Nhỏ Gom Tiền Mua Chung Cánh Gà',
    categoryTag: 'CHUYỆN HỌC TRÒ',
    icon: '🎒',
    characterName: 'Bé Bơ & Bạn Cùng Lớp',
    characterAvatar: '👦',
    characterImg: charImg('char_05_kid_bo.png'),
    emoteBubble: '🍗',
    characterRole: 'Khách Nhí Hẻm 1102',
    context: 'Tan trường, hai cô cậu học sinh tiểu học đứng tần ngần trước xe đẩy, dốc hết túi áo gom được 14.000đ tiền lẻ nhưng cánh gà giá 25.000đ.',
    dialogue: 'Chú ơi... tụi con gom hết cả tiền ăn sáng còn có 14 ngàn à, chú bán cho tụi con nửa chiếc cánh gà được hông chú?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 2,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 2: Những vị khách nhí với túi tiền lẻ tan trường.',
    choices: [
      {
        id: 'student_give_whole',
        label: 'Bán nguyên chiếc cánh gà nóng hổi lấy 14k & tặng khoai',
        subDesc: 'Bù lỗ 11k, hai đứa trẻ mắt sáng ngời chia nhau từng miếng thịt giòn',
        kicker: '💖 NUÔI DƯỠNG NỤ CƯỜI',
        karmaDelta: { community: 25, craftsmanship: 5 },
        moneyDelta: -11000,
        reactionTitle: 'Bữa Ăn Tan Trường Hạnh Phúc',
        reactionNarrative: 'Hai đứa trẻ cầm chiếc cánh gà bốc khói vừa thổi vừa chia nhau ăn ngon lành. Ánh mắt rạng ngời của chúng là món quà vô giá cho gian bếp nhỏ.'
      },
      {
        id: 'student_cut_half',
        label: 'Cắt đôi cánh gà theo đúng tỷ lệ tiền và giải thích rạch ròi',
        subDesc: 'Dạy các bé về giá trị trao đổi công bằng, không lỗ vốn',
        kicker: '⚖️ CÔNG BẰNG SÒNG PHẲNG',
        karmaDelta: { craftsmanship: 10, ambition: 10 },
        moneyDelta: 0,
        reactionTitle: 'Bài Học Kinh Doanh Nhỏ',
        reactionNarrative: 'Bạn khéo léo dùng kéo chặt đôi cánh gà, vừa đủ phần ăn cho hai đứa nhỏ. Các bé vui vẻ cảm ơn vì chú chủ tiệm rất công tâm.'
      },
      {
        id: 'student_quiz_challenge',
        label: 'Đố hai bé bảng cửu chương 7, trả lời đúng tặng không lấy tiền',
        subDesc: 'Hai đứa trẻ hào hứng đọc vanh vách, tiếng cười rộn rã đầu ngõ',
        kicker: '🧠 ĐỐ VUI HỌC TẬP',
        karmaDelta: { community: 20, craftsmanship: 15 },
        moneyDelta: -14000,
        reactionTitle: 'Thưởng Cho Học Trò Chăm Ngoan',
        reactionNarrative: 'Hai cô bé đồng thanh đọc vanh vách bảng cửu chương trong sự cổ vũ của người qua đường. Cả con hẻm rộn ràng lời khen ngợi tinh thần hiếu học.'
      }
    ]
  },

  // 3. Chú Cảnh Sát Khu Vực Nhắc Nhở Vỉa Hè (Ngày 3)
  {
    id: 'inc_quiz_03_police_sidewalk',
    title: 'Chú Cảnh Sát Khu Vực Nhắc Nhở Lối Đi',
    categoryTag: 'TRẬT TỰ ĐÔ THỊ',
    icon: '👮',
    characterName: 'Đại Úy Nam',
    characterAvatar: '👮‍♂️',
    characterImg: charImg('char_25_police_nam.png'),
    emoteBubble: '📋',
    characterRole: 'Cảnh Sát Khu Vực Phụ Trách Hẻm',
    context: 'Chú Nam cảnh sát khu vực đi tuần tra trật tự lòng lề đường, ghé qua xe đẩy nhắc nhở vì đuôi xe hơi lấn ra vạch kẻ trắng dành cho người đi bộ.',
    dialogue: 'Mấy đứa buôn bán chú không cấm, nhưng phải chừa lối cho người đi bộ nghen con. Kéo thụt cái bảng hiệu vô 2 tấc giùm chú!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 3,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 3: Tiếng còi tuần tra trật tự đô thị ghé qua xe đẩy.',
    choices: [
      {
        id: 'police_obey_cheer',
        label: 'Dạ vâng răm rắp, kéo gọn vào trong & quét sạch vỉa hè',
        subDesc: 'Chấp hành nghiêm chỉnh, chú Nam gật đầu khen ngợi ý thức công dân tốt',
        kicker: '✅ CHẤP HÀNH GƯƠNG MẪU',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Ý Thức Đô Thị Chuẩn Mực',
        reactionNarrative: 'Bạn nhanh nhẹn kéo bảng hiệu thụt vào trong và cầm chổi quét sạch vụn rác vỉa hè. Chú Nam mỉm cười gật đầu hài lòng rồi tiếp tục ca tuần tra.'
      },
      {
        id: 'police_treat_chicken',
        label: 'Gói hộp gà giòn biếu chú bồi dưỡng ca trực đêm',
        subDesc: 'Rủi ro 70%: Chú cảnh sát nghiêm khắc từ chối nhận quà và nhắc nhở kỷ luật',
        kicker: '🍗 BIẾU XÉN BỒI DƯỠNG',
        riskRate: 0.7,
        karmaDelta: { ambition: -15, community: -10 },
        moneyDelta: -30000,
        reactionTitle: 'Chú Nam Nhận Lòng Chân Tình',
        reactionNarrative: 'Chú Nam dặn dò chỉ nhận tình cảm chứ không nhận quà buôn bán, động viên quán tiếp tục giữ vệ sinh sạch sẽ.',
        reactionFailureNarrative: 'Chú Nam nghiêm mặt từ chối: "Chú đi làm nhiệm vụ giữ trật tự chung, các cháu đừng làm vậy mất hay!" Bạn ngượng ngùng cất lại hộp gà.'
      },
      {
        id: 'police_propose_paint',
        label: 'Tự nguyện mua hộp sơn trắng sơn lại vạch kẻ cho cả xóm',
        subDesc: 'Tốn 40k tiền sơn, cả đoạn hẻm gọn gàng đẹp mắt được tổ dân phố khen ngợi',
        kicker: '🎨 GÓP SỨC XÂY DỰNG HẺM',
        karmaDelta: { community: 35, ambition: 10 },
        moneyDelta: -40000,
        reactionTitle: 'Vạch Sơn Nghĩa Tình Hẻm 1102',
        reactionNarrative: 'Đoạn vạch trắng thẳng tắp do bạn tự tay sơn giúp người đi bộ có lối đi thông thoáng. Bác tổ trưởng dân phố ghé qua khen quán có trách nhiệm với cộng đồng!'
      }
    ]
  },

  // 4. Mẻ Gà Xém Góc Vì Lửa Gas Bập Bùng (Ngày 3)
  {
    id: 'inc_quiz_04_burnt_batch_dilemma',
    title: 'Mẻ Gà Xém Góc Do Lửa Gas Bập Bùng',
    categoryTag: 'NGHỆ THUẬT BẾP',
    icon: '🍳',
    characterName: 'Anh Khang Thợ Chiên',
    characterAvatar: '👨‍🍳',
    characterImg: charImg('char_04_fryer_khang.png'),
    emoteBubble: '🔥',
    characterRole: 'Cánh Tay Phải Bên Chảo Dầu',
    context: 'Bình gas mini vỉa hè bị hụt áp khiến lửa bập bùng, mẻ đùi gà 5 miếng bị xém nhẹ một góc da, mùi vẫn thơm phức nhưng màu sắc không đều.',
    dialogue: 'Anh ơi, mẻ này bị xém xíu da ngoài, hay là mình chặt bỏ chỗ cháy rồi bán nửa giá cho khách vãng lai gỡ vốn?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 3,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 3: Sự cố nhiệt độ thử thách lương tâm người thợ chiên.',
    choices: [
      {
        id: 'burnt_discard_pride',
        label: 'Hủy bỏ dứt khoát, dạy nhân viên về chữ Tín của nghề',
        subDesc: 'Chấp nhận mất 50k vốn nguyên liệu, không để một miếng gà lỗi đến tay khách',
        kicker: '💎 LƯƠNG TÂM NGHỆ NHÂN',
        karmaDelta: { craftsmanship: 30, community: 10 },
        moneyDelta: -50000,
        reactionTitle: 'Chữ Tín Đáng Giá Ngàn Vàng',
        reactionNarrative: 'Khang nhìn bạn với ánh mắt khâm phục. Bài học về sự hoàn hảo và lòng tự trọng nghề nghiệp đã in sâu vào trái tim người phụ bếp trẻ.'
      },
      {
        id: 'burnt_staff_meal',
        label: 'Giữ lại làm bữa xế chiều cho cả đội tẩm bổ',
        subDesc: 'Cắt gọt phần xém, nhân viên có bữa xế thơm ngon ấm bụng tăng nhuệ khí',
        kicker: '🍗 BỮA XẾ NỘI BỘ',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Bữa Ăn Xế Ấm Tình Đồng Đội',
        reactionNarrative: 'Khang và các bạn phụ bếp vừa gặm gà vừa cười rôm rả. Năng lượng tích cực lan tỏa khắp gian bếp, mọi người chiên những mẻ sau vàng óng ả.'
      },
      {
        id: 'burnt_discount_sale',
        label: 'Bán giảm giá 50% kèm ghi chú rõ ràng cho lao động nghèo',
        subDesc: 'Thu về 35k tiền vốn, giúp các bác xe ôm có bữa ăn rẻ ngon miệng',
        kicker: '🏷️ GIẢM GIÁ GỠ VỐN',
        karmaDelta: { community: 15, ambition: 10, craftsmanship: -10 },
        moneyDelta: 35000,
        reactionTitle: 'Phần Ăn Tiết Kiệm Vỉa Hè',
        reactionNarrative: 'Mấy bác xe ôm ghé mua ủng hộ tấm tắc khen gà vẫn giòn và ngon, cảm ơn tiệm vì đã bán giá bình dân hỗ trợ người lao động.'
      }
    ]
  },

  // 5. Bà Tư Bún Riêu Phàn Nàn Khói Dầu (Ngày 4)
  {
    id: 'inc_quiz_05_neighbor_scold',
    title: 'Bà Tư Bún Riêu Phàn Nàn Mùi Khói Dầu',
    categoryTag: 'LÁNG GIỀNG HẺM',
    icon: '💨',
    characterName: 'Bà Tư Hàng Xóm',
    characterAvatar: '👵',
    characterImg: charImg('char_08_grumpy_hai.png'),
    emoteBubble: '😤',
    characterRole: 'Chủ Gánh Bún Riêu Cổ Thụ',
    context: 'Chiều gió đổi hướng thổi tạt hơi khói chiên gà sang sạp bún riêu kế bên, bà Tư cầm chiếc quạt nan đi sang càu nhàu với vẻ mặt khó chịu.',
    dialogue: 'Nè mấy đứa! Gió thổi khói mỡ bay hết vô nồi nước lèo cua của tao rồi! Buôn bán kiểu gì kỳ cục vậy hả?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 4,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 4: Mâu thuẫn khói bếp giữa hai gian hàng vỉa hè.',
    choices: [
      {
        id: 'neighbor_bow_fan',
        label: 'Cúi đầu xin lỗi, lắp ngay tấm mica chắn gió hướng lên',
        subDesc: 'Tốn 25k mica chắn, điều chỉnh góc bếp triệt tiêu 100% khói tạt',
        kicker: '🙏 CẦU THỊ KHIÊM NHƯỜNG',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Khói Tan Tình Láng Giềng Thắm Thiết',
        reactionNarrative: 'Thấy bạn nhanh nhẹn nhận lỗi và lắp ngay tấm chắn, bà Tư nguôi giận liền, còn mang sang cho bạn một bát canh cua nóng hổi.'
      },
      {
        id: 'neighbor_gift_soup',
        label: 'Mua ủng hộ 2 tô bún riêu & biếu bà 2 đùi gà giòn rụm',
        subDesc: 'Chi 60k làm hòa, hai gian hàng kết thân hỗ trợ nhau buôn bán',
        kicker: '🍲 LÁNG GIỀNG HÒA THUẬN',
        karmaDelta: { community: 30, ambition: 5 },
        moneyDelta: -60000,
        reactionTitle: 'Đôi Bạn Cùng Tiến Đầu Hẻm',
        reactionNarrative: 'Bà Tư vừa ăn gà giòn rụm vừa cười toe toét: "Cái thằng khéo miệng ghê! Thôi nãy tao nóng tính, mai mốt khách ăn bún tao giới thiệu qua mua gà!"'
      },
      {
        id: 'neighbor_argue_sidewalk',
        label: 'Cãi lý vỉa hè là gió trời, ai muốn bay đâu thì bay',
        subDesc: 'Bà Tư bực dọc chửi đổng cả buổi chiều, khách ngồi ăn cũng thấy ngột ngạt',
        kicker: '💥 TRANH CÃI NẢY LỬA',
        karmaDelta: { community: -25, ambition: 5 },
        moneyDelta: 0,
        scareCustomers: true,
        reactionTitle: 'Bữa Ăn Mất Ngon Vì Tiếng Cãi Vã',
        reactionNarrative: 'Hai bên đôi co làm con hẻm mất đi sự bình yên. Mấy vị khách đang ăn gà thấy ồn ào vội vã đứng dậy tính tiền đi sớm.'
      }
    ]
  },

  // 6. Cậu Bé Bán Tăm Dạo Đói Lả (Ngày 4)
  {
    id: 'inc_quiz_06_tam_dao_kid',
    title: 'Cậu Bé Bán Tăm Dạo Đứng Nhìn Chảo Gà',
    categoryTag: 'MẢNH ĐỜI MƯU SINH',
    icon: '🎋',
    characterName: 'Cậu Bé Bán Tăm',
    characterAvatar: '👦',
    characterImg: charImg('char_05_kid_bo.png'),
    emoteBubble: '🥺',
    characterRole: 'Cậu Bé Mưu Sinh Đường Phố',
    context: 'Một cậu bé gầy gò mặc áo rách vai ôm giỏ tăm tre đi từ trưa đến chiều chưa ăn gì, đứng nhìn chiếc chảo gà nuốt nước miếng ừng ực.',
    dialogue: 'Anh ơi... em bán cả ngày chưa được gói tăm nào... anh cho em xin mẩu bánh mì vụn được hông anh...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 4,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 4: Bóng dáng nhỏ bé ôm giỏ tăm tre trước chảo dầu.',
    choices: [
      {
        id: 'tam_full_combo',
        label: 'Tặng em 1 đùi gà nóng hổi, ly nước ngọt & mua 5 gói tăm',
        subDesc: 'Tốn 45k, cậu bé rưng rưng nước mắt cúi đầu cảm ơn rối rít',
        kicker: '❤️ TẤM LÒNG HÀO HIỆP',
        karmaDelta: { community: 35, craftsmanship: 5 },
        moneyDelta: -45000,
        reactionTitle: 'Bữa Ăn Cứu Đói Ấm Áp',
        reactionNarrative: 'Cậu bé ngồi trên bậc thềm ăn chiếc đùi gà giòn rụm với ánh mắt lấp lánh niềm vui. Khách qua đường chứng kiến nghĩa cử đẹp này liền ghé mua ủng hộ tiệm gà tấp nập.'
      },
      {
        id: 'tam_trade_chore',
        label: 'Bảo em phụ quét dọn sân 5 phút rồi trả công bằng đĩa gà',
        subDesc: 'Dạy em lao động chân chính và lòng tự trọng, không xin xỏ',
        kicker: '🧹 LAO ĐỘNG TỰ TRỌNG',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: -25000,
        reactionTitle: 'Thành Quả Của Lao Động Chân Chính',
        reactionNarrative: 'Cậu bé cầm chổi quét dọn rất cẩn thận từng mẩu rác. Khi nhận đĩa gà trên tay, em tự hào vì đó là mồ hôi công sức mình làm ra.'
      },
      {
        id: 'tam_ignore_busy',
        label: 'Xua tay bảo quán đang bận bán hàng, kêu em đi nơi khác',
        subDesc: 'Tiết kiệm tiền nhưng lòng nặng trĩu, nhân viên cảm thấy áy náy',
        kicker: '🚶 LẠNH LÙNG TỪ CHỐI',
        karmaDelta: { community: -20 },
        moneyDelta: 0,
        reactionTitle: 'Bóng Dáng Nhỏ Lủi Thủi Trong Chiều',
        reactionNarrative: 'Cậu bé buồn bã quay lưng ôm giỏ tăm đi tiếp dưới ánh hoàng hôn. Bữa cơm chiều của quán bỗng nhiên thiếu đi tiếng cười thường ngày.'
      }
    ]
  },

  // 7. Ông Chú Say Xỉn Ngủ Quên Trước Xe Đẩy (Ngày 5)
  {
    id: 'inc_quiz_07_drunk_uncle',
    title: 'Ông Chú Say Xỉn Ngủ Quên Trước Xe Đẩy',
    categoryTag: 'CHUYỆN ĐỜI THƯỜNG',
    icon: '🍺',
    characterName: 'Chú Hùng Ve Chai',
    characterAvatar: '🥴',
    characterImg: charImg('char_10_winner_hung.png'),
    emoteBubble: '💤',
    characterRole: 'Khách Quen Xóm Hẻm',
    context: 'Một người đàn ông nồng nặc mùi rượu loạng choạng đi tới rồi gục đầu ngủ thiếp đi ngay trên chiếc ghế nhựa dành cho khách đợi gà.',
    dialogue: 'Khò... khò... (Lẩm bẩm) Mẹ sắp nhỏ ơi... nay tui kiếm được nhiều tiền lắm... mua gà cho mấy đứa nhỏ ăn...',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    minDay: 5,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 5: Vị khách say ngủ quên chiếc ghế chờ.',
    choices: [
      {
        id: 'drunk_lemonade_wake',
        label: 'Pha ly trà chanh đá đường gừng, dìu chú vào bóng râm mát',
        subDesc: 'Tốn 5k chanh gừng, chú tỉnh táo cảm ơn và tâm sự nỗi niềm gia cảnh',
        kicker: '🍋 LY NƯỚC GIẢI SAY',
        karmaDelta: { community: 30, craftsmanship: 5 },
        moneyDelta: -5000,
        reactionTitle: 'Nỗi Lòng Người Cha Nghèo',
        reactionNarrative: 'Tỉnh cơn say, chú Hùng rơm rớm nước mắt kể chuyện làm lụng vất vả nuôi 3 đứa con ăn học. Bạn gói tặng chú một phần da gà chiên giòn đem về cho sắp nhỏ.'
      },
      {
        id: 'drunk_call_security',
        label: 'Nhờ chú Tư dân phòng hỗ trợ đưa chú về tận nhà an toàn',
        subDesc: 'An toàn trật tự cho quán, gia đình chú mừng rỡ vì chú không gặp nạn',
        kicker: '👮 DÂN PHÒNG HỖ TRỢ',
        karmaDelta: { community: 20, ambition: 10 },
        moneyDelta: 0,
        reactionTitle: 'Hành Trình Về Nhà Bình An',
        reactionNarrative: 'Chú Tư dân phòng chở chú Hùng về nhà an toàn. Vợ chú cảm kích chạy sang tiệm gà cảm ơn rối rít vì quán đã giúp đỡ người chồng say xỉn.'
      },
      {
        id: 'drunk_splash_water',
        label: 'Hất xô nước đuổi chú đi kẻo làm khách sợ bỏ chạy',
        subDesc: 'Hành vi thô bạo khiến khách xung quanh bất bình chê trách',
        kicker: '💧 XUA ĐUỔI THÔ LỖ',
        karmaDelta: { community: -30, ambition: -10 },
        moneyDelta: 0,
        scareCustomers: true,
        reactionTitle: 'Hình Ảnh Bị Tổn Hại Nặng Nề',
        reactionNarrative: 'Hành động xua đuổi thô bạo khiến bà con xung quanh nhìn tiệm gà bằng ánh mắt ái ngại. Nhiều người lắc đầu bỏ đi không mua nữa.'
      }
    ]
  },

  // 8. Chị Hàng Xóm Tò Mò Xem Nồi Bột Pha Sẵn (Ngày 5)
  {
    id: 'inc_quiz_08_secret_sauce_peeker',
    title: 'Cô Sáu Tạp Hóa Tò Mò Nhìn Thau Bột',
    categoryTag: 'BÍ QUYẾT BẾP',
    icon: '🥣',
    characterName: 'Cô Sáu Tạp Hóa',
    characterAvatar: '👵',
    characterImg: charImg('char_24_grocer_sau.png'),
    emoteBubble: '👀',
    characterRole: 'Cửa Hàng Tạp Hóa Đầu Hẻm',
    context: 'Cô Sáu sang mượn cây kéo, mắt dáo dác nhìn chăm chú vào thau bột bí truyền tẩm 12 loại gia vị đang để sau quầy chuẩn bị chiên.',
    dialogue: 'Ủa con nhỏ pha bột này có gì trỏng mà chiên lên giòn rụm thơm nức mũi cả hẻm vậy? Chỉ cô bí quyết cô về chiên cho sắp nhỏ ăn coi!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 5,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 5: Sự tò mò về công thức bột chiên giòn rụm.',
    choices: [
      {
        id: 'peeker_share_tip',
        label: 'Chỉ mẹo cơ bản (bột bắp + lòng trắng trứng), giữ bí mật cốt lõi',
        subDesc: 'Vừa giữ được hòa khí xóm giềng vừa bảo vệ công thức gia truyền',
        kicker: '🤝 CHIA SẺ KHÉO LÉO',
        karmaDelta: { community: 20, craftsmanship: 15 },
        moneyDelta: 0,
        reactionTitle: 'Mẹo Bếp Khéo Léo Vẹn Cả Đôi Đường',
        reactionNarrative: 'Cô Sáu hí hửng ghi nhớ mẹo chiên giòn về làm cho các cháu, tấm tắc khen chủ tiệm vừa khéo tay vừa biết cư xử nhã nhặn.'
      },
      {
        id: 'peeker_gift_fried',
        label: 'Không lộ công thức, gói tặng cô đĩa cánh gà chiên sẵn',
        subDesc: 'Tốn 30k gà, cô Sáu vui vẻ khen gà ngon và hứa giảm giá đường muối cho quán',
        kicker: '🍗 ĐĨA GÀ LÀM QUÀ',
        karmaDelta: { community: 25, ambition: 10 },
        moneyDelta: -30000,
        reactionTitle: 'Quà Tặng Thắt Chặt Tình Thân',
        reactionNarrative: 'Nhận đĩa gà nóng giòn, cô Sáu cười tít mắt: "Thôi mày chiên ngon quá tao mua ăn cho khỏe, hơi đâu pha bột chi cho cực!"'
      },
      {
        id: 'peeker_hide_cold',
        label: 'Lạnh lùng đậy nắp lại, bảo đây là bí mật cấm nhìn',
        subDesc: 'Bảo mật công thức nhưng cô Sáu phật ý bỏ về, bán tạp hóa đắt hơn',
        kicker: '🚫 LẠNH LÙNG PHÒNG VỆ',
        karmaDelta: { craftsmanship: 10, community: -15 },
        moneyDelta: 0,
        reactionTitle: 'Khoảng Cách Nơi Xóm Hẻm',
        reactionNarrative: 'Cô Sáu bĩu môi bỏ về: "Xời, làm như báu lắm không bằng!" Mối quan hệ giữa tiệm và tiệm tạp hóa có chút xa cách.'
      }
    ]
  },

  // 9. Bé Nhỏ Vấp Dây Làm Đổ Xô Nước Ngọt (Ngày 6)
  {
    id: 'inc_quiz_09_spilled_soda',
    title: 'Bé Bơ Vấp Dây Làm Đổ Xô Nước Ngọt',
    categoryTag: 'TAI NẠN BẤT NGỜ',
    icon: '🥤',
    characterName: 'Bé Bơ Đi Xe Đạp',
    characterAvatar: '👦',
    characterImg: charImg('char_05_kid_bo.png'),
    emoteBubble: '😭',
    characterRole: 'Cậu Bé Năng Động Hẻm 1102',
    context: 'Chiếc xe đạp mini của bé Bơ vướng phải dây cắm tủ mát, kéo đổ nghiêng chiếc xô đựng 10 lon nước ngọt ướp đá lạnh văng tung tóe ra đường.',
    dialogue: 'Oa oa... Chú ơi con xin lỗi... chân con đau quá... con hông cố ý đâu chú ơi...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 6,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 6: Chiếc xe đạp ba bánh va phải dây điện tủ mát.',
    choices: [
      {
        id: 'soda_comfort_kid',
        label: 'Đỡ bé dậy bôi thuốc đỏ xước đầu gối, gom lon cất lại',
        subDesc: 'Móp 3 lon nước (-30k), ba mẹ bé cảm kích ghé mua 3 phần gà ủng hộ',
        kicker: '🩹 YÊU THƯƠNG CHE CHỞ',
        karmaDelta: { community: 30, craftsmanship: 5 },
        moneyDelta: 45000,
        reactionTitle: 'Tình Thương Xoa Dịu Nỗi Đau',
        reactionNarrative: 'Thấy bạn ân cần băng vết thương cho con mình, mẹ bé Bơ chạy sang cảm ơn rối rít và mua ngay 3 combo gà gia đình ủng hộ quán.'
      },
      {
        id: 'soda_reorganize_wires',
        label: 'Dán băng keo nẹp cố định toàn bộ đường dây điện vào mép tường',
        subDesc: 'Tốn 20k mua nẹp nhựa, loại bỏ 100% nguy cơ vấp ngã về sau',
        kicker: '⚡ AN TOÀN ĐIỆN VỈA HÈ',
        karmaDelta: { craftsmanship: 25, community: 10 },
        moneyDelta: -20000,
        reactionTitle: 'Gian Bếp Gọn Gàng An Toàn',
        reactionNarrative: 'Toàn bộ đường dây điện được nẹp gọn gàng vào chân tường. Không gian bán hàng trở nên chuyên nghiệp và an toàn tuyệt đối.'
      },
      {
        id: 'soda_demand_compensation',
        label: 'Bắt ba mẹ bé đền tiền 10 lon nước ngọt bị móp méo',
        subDesc: 'Đòi được 100k nhưng tiếng xấu đồn xa về tiệm gà thiếu tình người',
        kicker: '💸 BẮT ĐỀN THIỆT HẠI',
        karmaDelta: { ambition: 10, community: -30 },
        moneyDelta: 100000,
        reactionTitle: 'Tiền Vào Túi Nhưng Lòng Xa Cách',
        reactionNarrative: 'Ba mẹ bé trả đủ tiền nhưng vẻ mặt rất thất vọng. Câu chuyện tiệm gà bắt đền đứa trẻ bị ngã lan khắp con hẻm.'
      }
    ]
  },

  // 10. Khách Tây Đi Bụi Tip Tờ 5 Đô La (Ngày 6)
  {
    id: 'inc_quiz_10_first_foreign_tip',
    title: 'Khách Tây Đi Bụi Tip Tờ 5 USD May Mắn',
    categoryTag: 'GIAO LƯU QUỐC TẾ',
    icon: '💵',
    characterName: 'Khách Bụi David',
    characterAvatar: '👱‍♂️',
    characterImg: charImg('char_09_buyer_tam.png'),
    emoteBubble: '⭐',
    characterRole: 'Phượt Thủ Khám Phá Ẩm Thực',
    context: 'Một du khách nước ngoài balo lấm bụi ăn liền 3 miếng gà giòn sốt cay, giơ ngón tay cái khen "Unbelievable!" rồi gửi tờ 5 USD tiền tip.',
    dialogue: 'Best fried chicken in Saigon! The crust is so crispy and flavorful! Keep the change, my friend! You are an artist!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 6,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 6: Tờ 5 USD xanh may mắn từ người lữ khách phương xa.',
    choices: [
      {
        id: 'tip_frame_lucky',
        label: 'Lồng khung kính tờ 5 USD treo cạnh xe đẩy làm kỷ niệm',
        subDesc: 'Biểu tượng may mắn đầu đời, tiếp thêm ngọn lửa đam mê nghề bếp',
        kicker: '🖼️ KỶ NIỆM VÔ GIÁ',
        karmaDelta: { craftsmanship: 25, ambition: 15 },
        moneyDelta: 0,
        reactionTitle: 'Bảo Vật May Mắn Của Tiệm Gà',
        reactionNarrative: 'Chiếc khung kính nhỏ lồng tờ 5 USD trở thành điểm nhấn độc đáo trên xe đẩy. Khách ghé ăn ai cũng thích thú nhìn ngắm và tò mò hỏi chuyện.'
      },
      {
        id: 'tip_split_staff',
        label: 'Đổi ra tiền Việt (125k) chia đều cho Khang và Linh',
        subDesc: 'Nhân viên hào hứng phấn khởi, tinh thần làm việc tăng vọt',
        kicker: '🎉 CHIA SẺ NIỀM VUI',
        karmaDelta: { community: 25, ambition: 10 },
        moneyDelta: 0,
        reactionTitle: 'Nụ Cười Rạng Rỡ Của Đội Ngũ',
        reactionNarrative: 'Cầm trên tay món tiền tip bất ngờ, Khang và Linh cười tít mắt. Cả đội cùng hứa sẽ cố gắng chiên gà thật ngon để đón thêm nhiều khách quốc tế.'
      },
      {
        id: 'tip_treat_street',
        label: 'Dùng số tiền mua 5 hộp xôi gà tặng cô lao công quét rác đêm',
        subDesc: 'Lan tỏa hơi ấm tình thương ra khắp các nẻo đường Sài Gòn',
        kicker: '🌙 NGHĨA TÌNH ĐÊM MUỘN',
        karmaDelta: { community: 35, craftsmanship: 5 },
        moneyDelta: 0,
        reactionTitle: 'Hạt Mầm Tử Tế Đơm Hoa',
        reactionNarrative: 'Các cô chú lao công đêm nhận được phần ăn nóng hổi xúc động khôn xiết. Lời chúc tiệm gà buôn may bán đắt vang vọng giữa màn đêm thanh bình.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 2: CĂN NHÀ SỐ 14 TRONG HẺM & KHÁCH TRẺ (NGÀY 8 - 18) - 10 SỰ KIỆN
  // =========================================================================

  // 11. Nhóm Cày Rank Ngồi Kẹt Bàn 3 Tiếng (Ngày 8)
  {
    id: 'inc_quiz_11_wifi_squatters',
    title: 'Hội Game Thủ Cày Rank Ngồi Kẹt Bàn 3 Tiếng',
    categoryTag: 'KHÁCH HÀNG GENZ',
    icon: '📱',
    characterName: 'Bạn Trẻ Cày Game',
    characterAvatar: '🎮',
    characterImg: charImg('char_30_student_bus.png'),
    emoteBubble: '⚡',
    characterRole: 'Đội Trưởng Team Game Thủ',
    context: 'Bốn bạn trẻ cắm sạc điện thoại ngồi chiếm nguyên chiếc bàn dài 3 tiếng đồng hồ, chỉ gọi 1 ly nước cóc ép và liên tục hò hét combat.',
    dialogue: 'Anh ơi WiFi quán mình lag quá, anh reset modem giùm tụi em đang combat trận Rank Cao Thủ căng lắm!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 8,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 8: Trận chiến Rank nghẹt thở tại chiếc bàn số 2.',
    choices: [
      {
        id: 'wifi_combo_upsell',
        label: 'Mang ra đĩa snack da gà lắc phô mai mời ăn thử & giới thiệu Combo Game Thủ',
        subDesc: 'Mùi da gà giòn rụm kích thích dạ dày, nhóm gọi ngay 4 combo thu về 160k',
        kicker: '🍟 BÁN HÀNG TÂM LÝ',
        karmaDelta: { ambition: 20, craftsmanship: 10 },
        moneyDelta: 160000,
        reactionTitle: 'Combo Tiếp Sức Cày Rank Bùng Nổ',
        reactionNarrative: 'Vừa gắp miếng da gà béo ngậy vừa chơi game, cả nhóm khen nức nở và quyết định chọn Tiệm Gà Nhà Tui làm căn cứ địa cày rank mỗi cuối tuần!'
      },
      {
        id: 'wifi_limit_time',
        label: 'Dán bảng quy định dùng bàn tối đa 90 phút vào giờ cao điểm',
        subDesc: 'Giữ trật tự không gian quán, nhường chỗ cho khách ăn bữa chính',
        kicker: '📋 NỘI QUY RÕ RÀNG',
        karmaDelta: { craftsmanship: 15, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Thiết Lập Chuẩn Mực Quán Ăn',
        reactionNarrative: 'Các bạn trẻ hiểu chuyện thu dọn đồ đạc nhường bàn cho khách gia đình. Quán vận hành trật tự và đón được thêm nhiều lượt khách mới.'
      },
      {
        id: 'wifi_turnoff_router',
        label: 'Rút phích cắm modem giả vờ mạng bị đứt để đuổi khéo',
        subDesc: 'Khách bức xúc bỏ về và rủ nhau lên mạng vote 1 sao chê mạng yếu',
        kicker: '🔌 CHIÊU TRÒ TIÊU CỰC',
        karmaDelta: { ambition: -15, craftsmanship: -10 },
        moneyDelta: 0,
        reactionTitle: 'Chiêu Trò Bị Phản Tác Dụng',
        reactionNarrative: 'Nhóm bạn bực tức vì đang dở trận đấu quan trọng. Họ rủ nhau lên Google Maps để lại bình luận chê quán mạng chập chờn phục vụ kém.'
      }
    ]
  },

  // 12. Cặp Đôi Khách Nhật Lạc Trong Hẻm 1102 (Ngày 9)
  {
    id: 'inc_quiz_12_lost_japanese_couple',
    title: 'Cặp Đôi Du Khách Nhật Lạc Vào Hẻm',
    categoryTag: 'KHÁCH PHƯƠNG XA',
    icon: '🗺️',
    characterName: 'Cặp Đôi Kenji & Yuka',
    characterAvatar: '🎎',
    characterImg: charImg('char_33_couple_genz.png'),
    emoteBubble: '🎌',
    characterRole: 'Du Khách Tự Túc Tokyo',
    context: 'Đôi bạn trẻ người Nhật cầm cuốn sách du lịch lóng ngóng nhìn quanh hẻm, bụng đói cồn cào nhưng không biết tiếng Việt để gọi món.',
    dialogue: 'Sumimasen... Chikin arimasuka? (Chắp tay cúi đầu, chỉ vào hình đùi gà trong cuốn sổ tay với nụ cười ngượng ngùng...)',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 9,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 9: Cuốn sổ tay du lịch và nụ cười cúi chào kiểu Nhật.',
    choices: [
      {
        id: 'couple_menu_drawing',
        label: 'Lấy giấy vẽ minh họa cấp độ cay & mời thử gà sốt phô mai tuyết',
        subDesc: 'Cặp đôi thích thú khen "Oishii!" lia lịa, tip thêm 50k và chụp hình kỷ niệm',
        kicker: '🎨 GIAO TIẾP HỘI HỌA',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: 120000,
        reactionTitle: 'Nét Vẽ Cầu Nối Văn Hóa',
        reactionNarrative: 'Hai bạn trẻ ăn sạch đĩa gà sốt phô mai tuyết và liên tục khen ngon. Họ viết vào sổ lưu niệm của quán bằng tiếng Nhật với những lời chúc tốt đẹp nhất.'
      },
      {
        id: 'couple_google_translate',
        label: 'Mở app dịch tiếng Nhật tận tình và chỉ đường thăm chùa cổ đầu hẻm',
        subDesc: 'Khách cảm động trước sự hiếu khách của người Sài Gòn',
        kicker: '📱 CÔNG NGHỆ KẾT NỐI',
        karmaDelta: { community: 25, ambition: 5 },
        moneyDelta: 70000,
        reactionTitle: 'Sự Hiếu Khách Nồng Hậu',
        reactionNarrative: 'Được chỉ đường tận tình, hai bạn trẻ cúi đầu 90 độ cảm ơn sâu sắc. Họ hứa sẽ giới thiệu tiệm gà cho bạn bè ở Nhật Bản khi sang du lịch Việt Nam.'
      },
      {
        id: 'couple_serve_random',
        label: 'Bê đại đĩa gà sốt siêu cay cấp 7 ra cho khách ăn',
        subDesc: 'Khách ăn cay phỏng lưỡi hoảng hốt uống liền 3 ly nước',
        kicker: '🌶️ PHỤC VỤ TÙY TIỆN',
        karmaDelta: { craftsmanship: -15, community: -10 },
        moneyDelta: 50000,
        reactionTitle: 'Trải Nghiệm Đáng Quên Của Khách Du Lịch',
        reactionNarrative: 'Khách ho sặc sụa vì quá cay, mặt đỏ bừng vội vã trả tiền rồi rời đi trong nỗi sợ hãi. Uy tín phục vụ của quán bị giảm sút.'
      }
    ]
  },

  // 13. Hai Bác Tài Công Nghệ Lấy Nhầm Bọc Gà (Ngày 10)
  {
    id: 'inc_quiz_13_delivery_driver_mixup',
    title: 'Hai Bác Tài Công Nghệ Lấy Nhầm Đơn Hàng',
    categoryTag: 'RẮC RỐI GIAO HÀNG',
    icon: '🛵',
    characterName: 'Shipper Tuấn Cà Mau',
    characterAvatar: '🛵',
    characterImg: charImg('char_19_shipper_tuan.png'),
    emoteBubble: '📦',
    characterRole: 'Tài Xế Công Nghệ Thân Quen',
    context: 'Giờ cao điểm trưa, hai shipper của hai app khác nhau vội vã giật lấy bọc gà trên quầy rồi phóng đi, làm tráo đổi đơn thường và đơn gà sốt hoàng kim.',
    dialogue: 'Chết rồi em ơi! Khách bên Quận 3 gọi réo chửi tui um sùm vì giao thiếu hộp sốt phô mai trứng muối rồi!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 10,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 10: Sự nhầm lẫn giữa hai túi hàng giờ cao điểm trưa.',
    choices: [
      {
        id: 'mixup_emergency_resend',
        label: 'Làm hỏa tốc 2 phần mới tinh, cử nhân viên chạy xe giao đền tận nơi',
        subDesc: 'Tốn 80k bù lỗ, hai vị khách cảm phục sự chịu trách nhiệm của tiệm gà',
        kicker: '🚀 CHỊU TRÁCH NHIỆM 100%',
        karmaDelta: { craftsmanship: 25, community: 15 },
        moneyDelta: -80000,
        reactionTitle: 'Biến Khủng Hoảng Thành Lòng Tin',
        reactionNarrative: 'Nhận được phần gà nóng hổi giao đền tận cửa kèm bức thư tay xin lỗi chân thành, khách hàng không những không giận mà còn lên hội nhóm ẩm thực khen ngợi cách ứng xử của quán!'
      },
      {
        id: 'mixup_split_cost_shipper',
        label: 'Cùng shipper chia đôi chi phí làm lại phần sốt bù cho khách',
        subDesc: 'Mỗi bên chịu 25k, bác tài cảm kích vì quán không bắt đền một mình',
        kicker: '🤝 ĐỒNG CẢM SẺ CHIA',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Nghĩa Tình Đồng Nghiệp Mưu Sinh',
        reactionNarrative: 'Anh Tuấn shipper thở phào nhẹ nhõm: "Cảm ơn chủ quán nhiều nghen, chứ đền nguyên đơn là coi như bữa nay tui chạy xe công cốc!"'
      },
      {
        id: 'mixup_blame_shippers',
        label: 'Đổ hết lỗi cho tài xế bắt shipper tự bỏ tiền túi ra đền',
        subDesc: 'Bác tài uất ức rơi nước mắt, hội tài xế truyền tai nhau tẩy chay nhận đơn quán',
        kicker: '❌ ĐỔ LỖI PHỦI TAY',
        karmaDelta: { community: -30, ambition: -15 },
        moneyDelta: 0,
        reactionTitle: 'Làn Sóng Tẩy Chay Của Cánh Tài Xế',
        reactionNarrative: 'Cánh tài xế công nghệ rỉ tai nhau quán gà đối xử tệ bạc với anh em shipper. Những ngày sau đó, thời gian đợi tài xế nhận đơn tăng vọt bất thường.'
      }
    ]
  },

  // 14. Nhà Đối Diện Hát Loa Kẹo Kéo Đinh Tai (Ngày 11)
  {
    id: 'inc_quiz_14_karaoke_noise_war',
    title: 'Hàng Xóm Mở Loa Kẹo Kéo Hát Karaoke',
    categoryTag: 'ÂM THANH PHỐ THỊ',
    icon: '🎤',
    characterName: 'Ông Bảy Bánh Mì',
    characterAvatar: '👨‍🦱',
    characterImg: charImg('char_15_bread_bay.png'),
    emoteBubble: '📢',
    characterRole: 'Cây Văn Nghệ Xóm Hẻm',
    context: 'Nhà đối diện mở tiệc sinh nhật, kéo dàn loa kéo công suất khủng ra trước cửa gào bài Đắp Mộ Cuộc Tình vang rền làm rung cả cửa kính tiệm gà.',
    dialogue: 'Say một ly... cho vơi sầu cay đắng... Ới dô dô anh em ơi dô trăm phần trăm nào! Hát tiếp bài Đắp Mộ Cuộc Tình coi!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 11,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 11: Khúc ca vang dội từ chiếc loa kẹo kéo đối diện.',
    choices: [
      {
        id: 'karaoke_diplomatic_chicken',
        label: 'Mang đĩa cánh gà sang chúc mừng sinh nhật, nhỏ nhẹ xin vặn bớt bass',
        subDesc: 'Tốn 40k mồi nhậu, ông Bảy vui vẻ hạ âm lượng và hát chay thân mật',
        kicker: '🍗 NGOẠI GIAO ĐĨA GÀ',
        karmaDelta: { community: 30, craftsmanship: 5 },
        moneyDelta: -40000,
        reactionTitle: 'Tiếng Hát Lắng Đọng Trong Hòa Khí',
        reactionNarrative: 'Nhận đĩa mồi ngon thơm phức, ông Bảy cười sảng khoái: "Thằng nhỏ biết điều quá! Thôi anh em mình tắt bớt loa, vặn nhỏ lại cho cháu nó bán hàng!"'
      },
      {
        id: 'karaoke_call_warden',
        label: 'Báo cho bác tổ trưởng dân phố Hai Đất đến nhắc nhở trật tự',
        subDesc: 'Bác Hai Đất can thiệp ngay, xóm ngõ yên tĩnh nhưng ông Bảy có chút hậm hực',
        kicker: '📜 NỘI QUY KHU PHỐ',
        karmaDelta: { craftsmanship: 15, community: 5 },
        moneyDelta: 0,
        reactionTitle: 'Can Thiệp Theo Quy Định Khu Phố',
        reactionNarrative: 'Bác tổ trưởng dân phố đến nhắc nhở quy định không mở loa quá 21h. Dàn loa tắt ngúm, không gian quán trở lại yên bình.'
      },
      {
        id: 'karaoke_play_louder',
        label: 'Bật dàn loa quán to hết cỡ mở nhạc sàn để át tiếng hát',
        subDesc: 'Đại chiến âm thanh đinh tai nhức óc làm khách ôm đầu chạy tán loạn',
        kicker: '🔊 ĐẠI CHIẾN ÂM LƯỢNG',
        karmaDelta: { community: -30, craftsmanship: -20 },
        moneyDelta: 0,
        scareCustomers: true,
        reactionTitle: 'Thảm Họa Tiếng Ồn Hẻm 1102',
        reactionNarrative: 'Hai dàn loa thi nhau gào thét biến con hẻm thành bãi chiến trường âm thanh. Khách ăn gà ôm tai bỏ chạy, hàng xóm hai bên đóng kín cửa phản đối.'
      }
    ]
  },

  // 15. Đàn Cún Con Chạy Vào Nấp Mưa (Ngày 12)
  {
    id: 'inc_quiz_15_rainy_puppy_pack',
    title: 'Đàn Cún Con Lạc Mẹ Chạy Vào Nấp Mưa',
    categoryTag: 'THÚ CƯNG HẺM NHỎ',
    icon: '🐶',
    characterName: 'Đàn Cún Con Lông Vàng',
    characterAvatar: '🐕',
    characterImg: charImg('pet_01_dog_vang.png'),
    emoteBubble: '🐾',
    characterRole: 'Những Vị Khách Bốn Chân Nhỏ Bé',
    context: 'Trời mưa to gió giật, 3 chú cún cỏ con lông vàng ươn ướt núp dưới gầm bàn khách ăn gà, khách nữ trong quán thích thú lấy xúc xích đút cho ăn.',
    dialogue: 'Ẳng... ẳng... (3 chú cún mắt tròn xoe vẫy đuôi mừng rỡ khi thấy hơi ấm của bếp chiên gà...)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 12,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 12: Tiếng cún con reo vui dưới hiên nhà ngày mưa dầm.',
    choices: [
      {
        id: 'puppy_warm_corner',
        label: 'Lót thùng carton êm ái góc hiên, cho các bé ăn thịt gà luộc xé nhỏ',
        subDesc: 'Tốn 20k thịt luộc, khách chụp ảnh đàn cún đăng mạng hút hàng ngàn lượt like',
        kicker: '📦 GÓC ẤM NGHĨA TÌNH',
        karmaDelta: { community: 35, craftsmanship: 10 },
        moneyDelta: -20000,
        reactionTitle: 'Góc Trú Ẩn Ngập Tràn Tình Yêu',
        reactionNarrative: 'Ba chú cún con ăn no nằm cuộn tròn ngủ say sưa trong thùng carton ấm áp. Rất nhiều bạn trẻ ghé quán vừa ăn gà vừa xin chụp hình với đàn cún cưng.'
      },
      {
        id: 'puppy_find_owners',
        label: 'Đăng bài lên nhóm cư dân Hẻm 1102 tìm chủ thất lạc cho đàn cún',
        subDesc: 'Tìm được chủ nhân cho 3 bé ngay trong buổi chiều, nhận lời cảm ơn nồng hậu',
        kicker: '🏡 TÌM LẠI MÁI ẤM',
        karmaDelta: { community: 30, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Cuộc Hội Ngộ Xúc Động',
        reactionNarrative: 'Bác Ba chủ đàn cún mừng rơi nước mắt khi tìm lại được bầy cún thất lạc. Bác mang sang tặng quán một buồng chuối sứ chín cây ngọt lịm.'
      },
      {
        id: 'puppy_shoo_outside',
        label: 'Xua đuổi đàn cún ra ngoài mưa vì sợ lông bay vào bếp',
        subDesc: 'Khách trong quán xì xào thất vọng vì quán thiếu lòng trắc ẩn',
        kicker: '🚫 XUA ĐUỔI LẠNH LÙNG',
        karmaDelta: { community: -25, craftsmanship: 5 },
        moneyDelta: 0,
        reactionTitle: 'Bữa Ăn Thiếu Đi Nụ Cười',
        reactionNarrative: 'Khách ngồi ăn nhìn theo bóng đàn cún run rẩy dưới mưa với ánh mắt thương xót. Bầu không khí trong quán bỗng chốc trở nên lạnh lẽo.'
      }
    ]
  },

  // 16. Nhóm Học Sinh Nhảy TikTok Trước Biển Hiệu (Ngày 13)
  {
    id: 'inc_quiz_16_tiktok_dance_crew',
    title: 'Nhóm Học Sinh Nhảy TikTok Trước Biển Quán',
    categoryTag: 'TRENDING MẠNG XÃ HỘI',
    icon: '💃',
    characterName: 'Nhóm GenZ Trendy Vy',
    characterAvatar: '👧',
    characterImg: charImg('char_07_trendy_vy.png'),
    emoteBubble: '✨',
    characterRole: 'Trưởng Nhóm Nhảy Năng Động',
    context: '5 bạn trẻ mặc đồng phục năng động mang loa kéo dựng tripod trước biển hiệu Tiệm Gà Nhà Tui nhảy vũ đạo viral See Tình.',
    dialogue: 'Chào anh chủ tiệm đẹp trai! Tụi em quay clip dance cover, xong tụi em gắn tag tiệm gà lên TikTok kéo khách giùm anh nha!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 13,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 13: Giai điệu nhảy sôi động của các bạn trẻ trước biển hiệu.',
    choices: [
      {
        id: 'dance_join_cheer',
        label: 'Tặng mỗi bạn 1 ly trà đào & cho mượn tạp dề tiệm gà làm đạo cụ nhảy',
        subDesc: 'Clip lên xu hướng 100k view, tiệm gà nổi như cồn đón thêm 50 khách trẻ',
        kicker: '🔥 BẮT TREND VIRAL',
        karmaDelta: { ambition: 25, community: 20 },
        moneyDelta: -25000,
        reactionTitle: 'Video Triệu View Bùng Nổ Trên Mạng',
        reactionNarrative: 'Chiếc tạp dề in hình logo chú gà ngộ nghĩnh xuất hiện rực rỡ trong đoạn clip nhảy viral. Hàng trăm bạn trẻ từ khắp nơi kéo đến tiệm gà check-in chụp hình!'
      },
      {
        id: 'dance_require_purchase',
        label: 'Yêu cầu nhóm mua tối thiểu 2 combo gà thì mới cho quay phim',
        subDesc: 'Thu được 90k nhưng nhóm nhảy có chút gượng gạo khi quay',
        kicker: '💵 KINH DOANH THỰC DỤNG',
        karmaDelta: { ambition: 15, community: -5 },
        moneyDelta: 90000,
        reactionTitle: 'Giao Dịch Sòng Phẳng Nơi Quán Ăn',
        reactionNarrative: 'Nhóm bạn gom tiền mua 2 combo gà ăn vội rồi quay xong clip rời đi. Dù có thêm doanh thu nhưng không tạo được sự gắn kết thân mật.'
      },
      {
        id: 'dance_chase_sidewalk',
        label: 'Đuổi nhóm đi chỗ khác vì sợ ồn ào chắn lối đi của xe cộ',
        subDesc: 'Giữ trật tự tuyệt đối nhưng bỏ lỡ cơ hội quảng bá miễn phí',
        kicker: '🚫 TỪ CHỐI ỒN ÀO',
        karmaDelta: { craftsmanship: 10, ambition: -15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Yên Tĩnh Được Lập Lại',
        reactionNarrative: 'Nhóm học sinh thu dọn loa kéo đi tìm địa điểm khác. Con hẻm trở lại yên tĩnh nhưng bạn đã bỏ lỡ một cơ hội vàng để đưa tên tuổi tiệm gà bay xa.'
      }
    ]
  },

  // 17. Thùng Tương Cà Còn 2 Ngày Hết Hạn (Ngày 14)
  {
    id: 'inc_quiz_17_near_expiry_sauce',
    title: 'Thùng Tương Cà Đắt Tiền Còn 2 Ngày Hết Hạn',
    categoryTag: 'LƯƠNG TÂM NGHỀ BẾP',
    icon: '🍅',
    characterName: 'Nhân Viên Phụ Bếp Linh',
    characterAvatar: '👩‍🍳',
    characterImg: charImg('char_03_helper_linh.png'),
    emoteBubble: '❓',
    characterRole: 'Trợ Thủ Đắc Lực Trong Bếp',
    context: 'Trong lúc kiểm kê tủ trữ, Linh phát hiện 1 thùng tương cà nguyên seal loại đắt tiền còn đúng 48 tiếng nữa là chạm hạn sử dụng.',
    dialogue: 'Anh chủ ơi, thùng sốt này giá tới 400k lận, hay là mình chiết ra bình rót xài gấp cho khách kẻo bỏ phí đứt ruột?',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 14,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 14: Chiếc thùng sốt đắt đỏ cận kề hạn dùng trong kho lạnh.',
    choices: [
      {
        id: 'sauce_discard_strict',
        label: 'Tiêu hủy ngay lập tức, không đem sức khỏe thực khách ra đánh cược',
        subDesc: 'Mất 400k tiền vốn, giữ vững 100% chuẩn mực an toàn vệ sinh thực phẩm',
        kicker: '🛡️ CHUẨN MỰC VÀNG AN TOÀN',
        karmaDelta: { craftsmanship: 35, community: 10 },
        moneyDelta: -400000,
        reactionTitle: 'Bài Học Khắc Cốt Ghi Tâm Về An Toàn',
        reactionNarrative: 'Nhìn bạn kiên quyết đổ bỏ thùng sốt, Linh hiểu rằng ở Tiệm Gà Nhà Tui, sức khỏe và sự an tâm của khách hàng luôn đứng trên mọi đồng tiền lợi nhuận.'
      },
      {
        id: 'sauce_staff_cook',
        label: 'Nấu món sườn xốt chua ngọt cho toàn bộ nhân viên ăn liên hoan',
        subDesc: 'Tương cà vẫn còn hạn sử dụng ngon lành, cả đội có bữa tiệc tưng bừng',
        kicker: '🍖 BỮA TIỆC GẮN KẾT BẾP',
        karmaDelta: { community: 25, craftsmanship: 15 },
        moneyDelta: -100000,
        reactionTitle: 'Bữa Ăn Nội Bộ Ấm Cúng',
        reactionNarrative: 'Nồi sườn xốt chua ngọt thơm nức mũi khiến cả gian bếp ngập tràn tiếng cười vui vẻ. Tinh thần đoàn kết của đội ngũ nhân viên được củng cố vững chắc.'
      },
      {
        id: 'sauce_fast_dispense',
        label: 'Rót hết vào các hũ bàn để dùng gấp cho khách trong 2 ngày',
        subDesc: 'Rủi ro 50%: 2 vị khách bụng yếu bị đau bụng nhẹ, trừ 0.2 sao đánh giá',
        kicker: '⚡ TẬN DỤNG CẠN HẠN',
        riskRate: 0.5,
        karmaDelta: { ambition: 15, craftsmanship: -25 },
        moneyDelta: 0,
        reactionTitle: 'Dùng Kịp Trước Hạn Sử Dụng',
        reactionNarrative: 'Thùng tương được sử dụng hết sạch ngay trước thời điểm hết hạn mà không xảy ra sự cố nào đáng tiếc.',
        reactionFailureNarrative: 'Hương vị sốt đã bị chua gắt! Hai vị khách phản ánh bị ậm ạch bụng sau khi ăn, tiệm phải gửi lời xin lỗi và bồi thường nước ép giải độc.'
      }
    ]
  },

  // 18. Nhiếp Ảnh Gia Chụp Sách Hẻm Sài Gòn (Ngày 15)
  {
    id: 'inc_quiz_18_film_photographer',
    title: 'Nhiếp Ảnh Gia Gạo Cội Xin Chụp Lửa Bếp',
    categoryTag: 'NGHỆ THUẬT VĂN HÓA',
    icon: '📷',
    characterName: 'Bác Nhiếp Ảnh Gia Cổ Điển',
    characterAvatar: '👴',
    characterImg: charImg('char_09_buyer_tam.png'),
    emoteBubble: '🎞️',
    characterRole: 'Nghệ Sĩ Nhiếp Ảnh Đường Phố',
    context: 'Một nhiếp ảnh gia gạo cội cầm chiếc máy ảnh phim cơ khí Leica xin phép chụp lại khoảnh khắc khói dầu và ngọn lửa bùng lên trên chảo gà.',
    dialogue: 'Nét văn hóa bếp hẻm Sài Gòn của các bạn đẹp và có hồn lắm. Tôi muốn đưa bức ảnh này vào tập sách ảnh Lửa Bếp Phố Thị.',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 15,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 15: Chiếc máy ảnh phim cơ khí và khoảnh khắc bùng lửa bếp.',
    choices: [
      {
        id: 'photo_cook_passionate',
        label: 'Trổ tài múa vá điêu luyện, tạo ra khung hình rực rỡ đầy nghệ thuật',
        subDesc: 'Bức ảnh đoạt giải triển lãm nhiếp ảnh thành phố, tiệm gà được vinh danh',
        kicker: '🔥 ĐAM MÊ NGHỆ SĨ',
        karmaDelta: { craftsmanship: 35, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Kiệt Tác Bên Chảo Lửa Vàng',
        reactionNarrative: 'Bức ảnh chụp bạn đang vớt mẻ gà óng ả trong màn khói lam chiều đoạt giải Nhất cuộc thi ảnh thành phố. Tên tuổi Tiệm Gà Nhà Tui xuất hiện trang trọng trên báo chí!'
      },
      {
        id: 'photo_ask_copyright_fee',
        label: 'Đòi bác trả phí bản quyền hình ảnh 300k nếu đưa vào sách',
        subDesc: 'Bác nhiếp ảnh gia thất vọng cất máy ảnh rời đi vì sự thực dụng',
        kicker: '💰 ĐÒI TIỀN BẢN QUYỀN',
        karmaDelta: { ambition: 15, community: -20, craftsmanship: -15 },
        moneyDelta: 0,
        reactionTitle: 'Cánh Cửa Nghệ Thuật Khép Lại',
        reactionNarrative: 'Bác nhiếp ảnh lắc đầu thở dài: "Nghệ thuật mà đong đếm từng đồng bạc thế này thì mất hết cái hồn của Sài Gòn rồi cháu ơi." Bác lặng lẽ bước đi.'
      },
      {
        id: 'photo_gift_and_chat',
        label: 'Mời bác đĩa gà nóng & ngồi lắng nghe những câu chuyện Sài Gòn xưa',
        subDesc: 'Học hỏi được bao bài học cuộc đời quý báu từ người từng trải',
        kicker: '☕ CHUYỆN XƯA TÍNH TÀI',
        karmaDelta: { community: 30, craftsmanship: 20 },
        moneyDelta: -30000,
        reactionTitle: 'Buổi Trò Chuyện Ký Ức Sâu Lắng',
        reactionNarrative: 'Bác nhiếp ảnh say sưa kể về những gánh hàng rong Sài Gòn từ nửa thế kỷ trước. Những câu chuyện truyền cho bạn niềm cảm hứng vô tận để gìn giữ hương vị truyền thống.'
      }
    ]
  },

  // 19. Nhóm Đòi Nợ Tạt Sơn Nhầm Văng Sang Quán (Ngày 16)
  {
    id: 'inc_quiz_19_paint_spray_mistake',
    title: 'Vết Sơn Đỏ Bị Tạt Nhầm Lên Tường Quán',
    categoryTag: 'SỰ CỐ AN NINH',
    icon: '🎨',
    characterName: 'Đội Trưởng Dân Phòng Hai Đất',
    characterAvatar: '👮‍♂️',
    characterImg: charImg('char_27_warden_hai.png'),
    emoteBubble: '🚨',
    characterRole: 'Tổ Trưởng An Ninh Khu Phố',
    context: 'Nửa đêm, nhóm giang hồ đòi nợ sạp bên cạnh tạt sơn đỏ nhưng gió tạt làm văng một mảng sơn đỏ loét lên góc tường ngoài tiệm gà.',
    dialogue: 'Trời ơi là trời! Đám bất lương tạt sơn nhà con nợ mà văng tè le sang tường quán gà của tụi nhỏ rồi!',
    phaseTiming: 'morning',
    isSecurityRisk: true,
    minChapter: 2,
    minDay: 16,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 16: Mảng sơn đỏ bất ngờ xuất hiện trên vách tường lúc rạng đông.',
    choices: [
      {
        id: 'paint_turn_graffiti',
        label: 'Mời bạn họa sĩ trẻ vẽ đè lên thành bức tranh gà hoạt hình cực ngầu',
        subDesc: 'Tốn 80k tiền sơn, biến bức tường loang lổ thành góc check-in siêu hot',
        kicker: '🎨 BIẾN HỌA THÀNH NGHỆ THUẬT',
        karmaDelta: { ambition: 30, craftsmanship: 20 },
        moneyDelta: -80000,
        reactionTitle: 'Góc Check-In Nghệ Thuật Đường Phố',
        reactionNarrative: 'Bức tranh chú gà siêu nhân phong cách Pop-Art rực rỡ biến góc tường thành điểm sống ảo hot nhất con hẻm. Khách xếp hàng dài chờ chụp hình!'
      },
      {
        id: 'paint_police_and_clean',
        label: 'Báo công an trích xuất camera, mua thùng vôi trắng về quét mới',
        subDesc: 'Tốn 50k, thủ phạm bị triệu tập răn đe, bức tường trắng sạch bóng',
        kicker: '⚖️ PHÁP LUẬT VÀ SẠCH SẼ',
        karmaDelta: { community: 20, craftsmanship: 15 },
        moneyDelta: -50000,
        reactionTitle: 'Bức Tường Tinh Khôi Trở Lại',
        reactionNarrative: 'Công an vào cuộc xử lý nghiêm nhóm đối tượng quá khích. Bức tường được quét vôi mới trắng tinh, xua tan mọi âu lo của người dân xung quanh.'
      },
      {
        id: 'paint_panic_close',
        label: 'Hoảng sợ đóng cửa nghỉ bán cả ngày vì sợ bị trả thù',
        subDesc: 'Mất toi cả ngày doanh thu, nhân viên hoang mang lo lắng',
        kicker: '🚪 ĐÓNG CỬA LO SỢ',
        karmaDelta: { ambition: -20, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Một Ngày Trầm Lắng Trong Lo Sợ',
        reactionNarrative: 'Cửa cuốn đóng im ỉm suốt cả ngày. Sự sợ hãi vô cớ khiến quán mất đi doanh thu và làm giảm sút nhuệ khí của toàn đội ngũ.'
      }
    ]
  },

  // 20. Cậu Bé Thử Thách Gà Cay Cấp 7 Bị Sặc (Ngày 17)
  {
    id: 'inc_quiz_20_spicy_overdose_boy',
    title: 'Cậu Bé Ăn Thử Gà Siêu Cay Cấp 7 Bị Sặc',
    categoryTag: 'CẤP CỨU VỊ GIÁC',
    icon: '🥛',
    characterName: 'Bé Bơ Thích Thể Hiện',
    characterAvatar: '👦',
    characterImg: charImg('char_05_kid_bo.png'),
    emoteBubble: '🥵',
    characterRole: 'Cậu Bé Hiếu Thắng Hẻm 1102',
    context: 'Cậu bé đòi ăn thử loại sốt ớt Ma Vương cấp độ 7, vừa cắn 1 miếng đã đỏ bừng cả mặt, mồ hôi vã như tắm và sặc nước mắt giàn giụa.',
    dialogue: 'Hức hức... Cay quá mẹ ơi cứu con... lưỡi con cháy rồi chú ơi òa òa...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 17,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 17: Nước mắt lăn dài sau thử thách sốt ớt Ma Vương.',
    choices: [
      {
        id: 'spicy_milk_rescue',
        label: 'Mang ngay ly sữa đặc đá lạnh & kem vani đút cho bé giải cay cấp tốc',
        subDesc: 'Cứu nguy vị giác kịp thời, bé nín khóc và cười khúc khích',
        kicker: '🥛 SỮA TƯƠI CỨU HỎA',
        karmaDelta: { community: 30, craftsmanship: 10 },
        moneyDelta: -15000,
        reactionTitle: 'Hóa Giải Cơn Lửa Trong Miệng',
        reactionNarrative: 'Hớp sữa béo ngậy làm dịu mát đầu lưỡi đang bỏng rát. Cậu bé nín khóc, lau nước mắt cười toe toét: "Mai mốt con chỉ ăn gà sốt mật ong thôi chú ơi!"'
      },
      {
        id: 'spicy_comfort_gift',
        label: 'Đổi ngay cho bé phần gà sốt mật ong bơ tỏi ngọt ngào',
        subDesc: 'Hương vị ngọt ngào bù đắp trải nghiệm, mẹ bé khen quán tâm lý',
        kicker: '🍯 NGỌT NGÀO BÙ ĐẮP',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: -25000,
        reactionTitle: 'Nụ Cười Trở Lại Bên Đĩa Gà Mật Ong',
        reactionNarrative: 'Miếng gà sốt mật ong vàng óng ngọt ngào giúp cậu bé lấy lại tinh thần. Mẹ bé cảm ơn sự chu đáo và thái độ ân cần của chủ tiệm.'
      },
      {
        id: 'spicy_laugh_record',
        label: 'Cười trêu chọc cậu bé và quay video đăng Facebook làm trò cười',
        subDesc: 'Mẹ bé tức giận dắt con bỏ về và mắng quán cư xử thiếu đạo đức',
        kicker: '📱 CÂU LIKE THIẾU TẾ NHỊ',
        karmaDelta: { community: -35, ambition: -10 },
        moneyDelta: 0,
        reactionTitle: 'Sự Vô Tuyên Làm Tổn Thương Trẻ Nhỏ',
        reactionNarrative: 'Hành động trêu chọc biến nỗi sợ của đứa trẻ thành trò đùa khiến người mẹ vô cùng phẫn nộ. Bài học về sự thấu hiểu và tôn trọng khách hàng.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 3: MẶT TIỀN PHỐ LỚN & ĐỐI THỦ CẠNH TRANH (NGÀY 19 - 35) - 10 SỰ KIỆN
  // =========================================================================

  // 21. Reviewer 'Chiến Thần Mỏ Hỗn' Đột Kích (Ngày 19)
  {
    id: 'inc_quiz_21_ferocious_critic',
    title: 'Reviewer Chiến Thần Mỏ Hỗn Đột Kích Quán',
    categoryTag: 'THỬ THÁCH TRUYỀN THÔNG',
    icon: '📹',
    characterName: 'Reviewer Hà Mã Trắng',
    characterAvatar: '🕶️',
    characterImg: charImg('char_07_trendy_vy.png'),
    emoteBubble: '🔍',
    characterRole: 'Chiến Thần Review Triệu Follower',
    context: 'Reviewer nổi tiếng chuyên chê các quán ăn với hàng triệu người theo dõi bước vào tiệm với khuôn mặt lạnh như tiền và máy quay giấu kín.',
    dialogue: 'Để xem cái tiệm gà rán hot rần rần này là ngon thiệt hay chỉ là chiêu trò truyền thông tâng bốc dỏm đời!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 19,
    rarity: 'rare',
    requiredStars: 4.0,
    unlockHint: 'Mở khóa ở Ngày 19 (yêu cầu >= 4.0 sao): Ống kính sắc lẹm của chiến thần ẩm thực.',
    choices: [
      {
        id: 'critic_master_craft',
        label: 'Không xu nịnh, dồn 100% bản lĩnh chiên mẻ gà chuẩn xác từng giây',
        subDesc: 'Gà giòn tan mọng nước, reviewer thán phục cho điểm 9.8/10 lên clip khen nức nở',
        kicker: '💎 BẢN LĨNH TAY NGHỀ',
        karmaDelta: { craftsmanship: 40, ambition: 20 },
        moneyDelta: 0,
        reactionTitle: 'Chinh Phục Trọn Vẹn Chiến Thần Khó Tính',
        reactionNarrative: 'Cắn miếng gà đầu tiên, đôi mắt lạnh lùng của vị reviewer bỗng giãn ra ngạc nhiên. Đoạn clip review 9.8/10 với lời khen "Đỉnh cao gà rán Sài Gòn" kéo hàng ngàn khách mới ghé tiệm!'
      },
      {
        id: 'critic_vip_bribe',
        label: 'Ra bàn nịnh nọt, tặng đĩa đặc biệt ngoại cỡ và phong bì 1 triệu',
        subDesc: 'Reviewer bóc phốt quán mua chuộc nhận hối lộ, bị dân mạng tẩy chay kịch liệt',
        kicker: '💸 ĐI CỬA SAU MUA CHUỘC',
        karmaDelta: { ambition: -30, craftsmanship: -30, community: -20 },
        moneyDelta: -1000000,
        reactionTitle: 'Thảm Họa Bóc Phốt Mua Chuộc',
        reactionNarrative: 'Vị reviewer quay trọn vẹn cảnh chiếc phong bì và đĩa gà ngoại cỡ lên mạng với tiêu đề: "Quán gà lộ mặt dùng tiền mua chuộc reviewer". Uy tín xây dựng bao lâu sụp đổ trong chốc lát!'
      },
      {
        id: 'critic_reject_filming',
        label: 'Từ chối cho quay phim theo quy định bảo vệ sự riêng tư của khách',
        subDesc: 'Reviewer ra về đánh giá trung bình 3 sao, nhưng khách quen khen quán tôn trọng họ',
        kicker: '🛡️ BẢO VỆ KHÁCH HÀNG',
        karmaDelta: { community: 25, craftsmanship: 20 },
        moneyDelta: 0,
        reactionTitle: 'Không Gian Bình Yên Được Giữ Gìn',
        reactionNarrative: 'Khách hàng xung quanh thở phào vì không bị ống kính chĩa vào mặt khi đang ăn uống. Quán giữ vững sự riêng tư và đẳng cấp phục vụ văn minh.'
      }
    ]
  },

  // 22. Quán Trà Sữa Kế Bên Lấn Chiếm Bãi Đỗ Xe (Ngày 20)
  {
    id: 'inc_quiz_22_parking_encroachment',
    title: 'Quán Trà Sữa Lấn Chiếm Bãi Đỗ Xe Máy',
    categoryTag: 'TRANH CHẤP MẶT TIỀN',
    icon: '🅿️',
    characterName: 'Quản Lý Quán Trà Sữa',
    characterAvatar: '👱‍♂️',
    characterImg: charImg('char_20_mover_cuong.png'),
    emoteBubble: '🛵',
    characterRole: 'Hàng Xóm Mặt Tiền Phố Lớn',
    context: 'Mặt tiền phố lớn tấc đất tấc vàng, quán trà sữa thương hiệu mới mở kế bên xếp xe máy của khách tràn sang chắn kín cửa tiệm gà.',
    dialogue: 'Đường phố chung mà bạn, khách tôi đông quá xếp tạm xíu làm gì căng dữ vậy!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 3,
    minDay: 20,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 20: Hàng xe máy nối đuôi nhau lấn chiếm lối vào mặt tiền.',
    choices: [
      {
        id: 'parking_cross_promote',
        label: 'Bắt tay hợp tác: Khách ăn gà giảm 10% trà sữa, khách trà sữa qua ăn gà tặng nước',
        subDesc: 'Biến đối đầu thành liên minh nghìn đơn, hai bên vui vẻ chia sẻ bãi đỗ xe',
        kicker: '🤝 LIÊN MINH DOANH SỐ',
        karmaDelta: { ambition: 35, community: 20 },
        moneyDelta: 150000,
        reactionTitle: 'Liên Minh Mặt Tiền Đôi Bên Cùng Thắng',
        reactionNarrative: 'Chiến dịch "Combo Ăn Gà Uống Trà Sữa" thành công vang dội! Hai quán phối hợp thuê chung một chú bảo vệ điều phối xe chuyên nghiệp, khách ra vào nườm nượp.'
      },
      {
        id: 'parking_security_dialogue',
        label: 'Cử nhân viên bảo vệ vạch ranh giới rõ ràng, phân luồng xe chuyên nghiệp',
        subDesc: 'Lối đi thông thoáng, bảo đảm 100% quyền lợi bãi đỗ xe cho khách ăn gà',
        kicker: '🅿️ PHÂN LUỒNG CHUYÊN NGHIỆP',
        requiresSecurity: true,
        karmaDelta: { craftsmanship: 20, ambition: 15 },
        moneyDelta: 0,
        reactionTitle: 'Bãi Xe Ngay Ngắn Chuẩn Mực',
        reactionNarrative: 'Chú bảo vệ quán gà điều phối xe đâu ra đấy, vạch sơn phân định ranh giới rõ ràng giúp cả hai bên không còn mâu thuẫn xích mích.'
      },
      {
        id: 'parking_slash_tire',
        label: 'Thuê người xịt lốp xe khách của quán trà sữa để trả đũa ngầm',
        subDesc: 'Hành vi phá hoại bị camera ghi lại, công an phạt 2 triệu và bồi thường',
        kicker: '🚷 TIỂU NHÂN TRẢ ĐŨA',
        karmaDelta: { ambition: -40, community: -30 },
        moneyDelta: -2000000,
        reactionTitle: 'Cái Giá Đắt Cho Hành Vi Phá Hoại',
        reactionNarrative: 'Camera an ninh ghi lại rõ mồn một. Bạn bị mời lên công an phường nộp phạt và bồi thường, uy tín thương hiệu bị bôi nhọ nặng nề.'
      }
    ]
  },

  // 23. Trường Quốc Tế Đặt Gấp 150 Phần Gà Hội Thao (Ngày 22)
  {
    id: 'inc_quiz_23_school_bulk_order',
    title: 'Đơn Hàng Gấp 150 Suất Cho Ngày Hội Thể Thao',
    categoryTag: 'ĐƠN HÀNG KHỦNG',
    icon: '🏆',
    characterName: 'Thầy Hiệu Phó Thể Thao',
    characterAvatar: '👨‍🏫',
    characterImg: charImg('char_21_trucker_long.png'),
    emoteBubble: '⏱️',
    characterRole: 'Trưởng Ban Tổ Chức Hội Thao',
    context: '10h sáng, trường quốc tế gọi điện thoại đặt hỏa tốc 150 suất combo gà rán và khoai tây giao trước 11h30 cho lễ bế mạc ngày hội thể thao.',
    dialogue: 'Nếu quán làm kịp 150 phần nóng giòn đúng giờ, trường chúng tôi sẽ ký hợp đồng cung cấp suất ăn định kỳ hàng tháng cho toàn bộ học sinh!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 22,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 22: Cuộc gọi hỏa tốc 150 phần ăn lúc 10 giờ sáng.',
    choices: [
      {
        id: 'bulk_mobilize_all',
        label: 'Huy động toàn lực, bật tối đa 2 chảo chiên kiểm soát nhiệt chuẩn xác',
        subDesc: 'Chiến dịch thần tốc! Giao đúng 11h25 nóng hổi, ký hợp đồng định kỳ bỏ túi 3 triệu lãi',
        kicker: '⚡ CHIẾN DỊCH THẦN TỐC',
        karmaDelta: { craftsmanship: 40, ambition: 35 },
        moneyDelta: 3000000,
        reactionTitle: 'Kỳ Tích 150 Phần Gà Nóng Hổi',
        reactionNarrative: 'Cả gian bếp phối hợp nhịp nhàng như một cỗ máy hoàn hảo. 150 hộp gà bốc khói thơm lừng cập bến trường học đúng hẹn. Thầy hiệu phó ký ngay hợp đồng độc quyền cung ứng!'
      },
      {
        id: 'bulk_outsourced_frozen',
        label: 'Mua vội gà đông lạnh chiên sẵn ngoài chợ về chiên lại để kịp giờ',
        subDesc: 'Thịt bở và hôi dầu, các em học sinh chê dở tệ, bị hủy luôn hợp đồng',
        kicker: '🧊 MUA GÀ ĐÔNG LẠNH TRỘN VÀO',
        karmaDelta: { craftsmanship: -40, ambition: -20 },
        moneyDelta: 500000,
        reactionTitle: 'Đơn Hàng Thảm Họa Mất Uy Tín',
        reactionNarrative: 'Thịt gà đông lạnh bở rục khiến các em học sinh ăn dở dang rồi vứt bỏ. Thầy hiệu phó tức giận gọi điện hủy bỏ toàn bộ kế hoạch hợp tác lâu dài.'
      },
      {
        id: 'bulk_decline_capacity',
        label: 'Lịch sự từ chối vì công suất không đảm bảo độ giòn hoàn hảo',
        subDesc: 'Giữ vững nguyên tắc chất lượng, nhà trường đánh giá cao sự trung thực',
        kicker: '🛑 TRUNG THỰC TỪ CHỐI',
        karmaDelta: { craftsmanship: 30, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Lòng Tự Trọng Của Người Đầu Bếp',
        reactionNarrative: 'Thầy hiệu phó cảm kích: "Hiếm có quán nào trung thực như các bạn, không tham tiền mà làm ẩu. Tuần sau trường có sự kiện sẽ đặt trước 2 ngày để ủng hộ quán!"'
      }
    ]
  },

  // 24. Chiến Tranh Lạnh Giữa Bếp Trưởng & Thu Ngân (Ngày 24)
  {
    id: 'inc_quiz_24_kitchen_romance_quarrel',
    title: 'Chiến Tranh Lạnh Giữa Bếp Trưởng & Thu Ngân',
    categoryTag: 'NỘI BỘ GIA ĐÌNH BẾP',
    icon: '💔',
    characterName: 'Linh Thu Ngân & Khang Bếp',
    characterAvatar: '😠',
    characterImg: charImg('char_03_helper_linh.png'),
    emoteBubble: '💢',
    characterRole: 'Cặp Đôi Cốt Cán Của Quán',
    context: 'Khang và Linh giận dỗi chuyện riêng tư, người thì cố tình ra đơn chậm, người thì ném phiếu order vào thùng rác làm ca bán hàng bị ách tắc.',
    dialogue: 'Em không thèm nói chuyện với người vô lý như anh nữa! Khách đòi gà thì tự đi mà bưng ra bàn!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 24,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 24: Tiếng ném phiếu order và sự im lặng ngột ngạt trong bếp.',
    choices: [
      {
        id: 'romance_mediator_meeting',
        label: 'Tạm dừng ca 5 phút, kéo cả hai vào phòng riêng chân thành hòa giải',
        subDesc: 'Hóa giải hiểu lầm, hai bạn đỏ mặt xin lỗi nhau và làm việc ăn ý gấp đôi',
        kicker: '❤️ THẤU HIỂU GẮN KẾT',
        karmaDelta: { community: 35, craftsmanship: 20 },
        moneyDelta: 0,
        reactionTitle: 'Tình Yêu Thăng Hoa Nơi Gian Bếp',
        reactionNarrative: 'Nhờ sự tinh tế và lắng nghe của bạn, hiểu lầm được tháo gỡ. Khang và Linh nhìn nhau cười bẽn lẽn, phối hợp ra đơn nhanh thoăn thoắt khiến khách trầm trồ.'
      },
      {
        id: 'romance_fine_rules',
        label: 'Phạt trừ lương mỗi người 100k theo đúng quy chế kỷ luật vì để việc riêng ảnh hưởng quán',
        subDesc: 'Kỷ luật thép duy trì quy củ, nhưng không khí làm việc có phần căng thẳng',
        kicker: '⚖️ KỶ LUẬT THÉP',
        karmaDelta: { ambition: 20, community: -10 },
        moneyDelta: 200000,
        reactionTitle: 'Bài Học Nghiêm Khắc Về Tính Chuyên Nghiệp',
        reactionNarrative: 'Cả hai chấp hành án phạt và tập trung làm việc nghiêm túc, dù khoảng cách giữa họ vẫn còn chút ngượng ngùng gượng gạo.'
      },
      {
        id: 'romance_fire_one',
        label: 'Đuổi việc một trong hai người ngay giữa ca bán hàng để thị uy',
        subDesc: 'Mất trụ cột giữa ca, đơn hàng ứ đọng, khách giận dữ bỏ về',
        kicker: '🚫 ĐUỔI VIỆC NÓNG NẢY',
        karmaDelta: { ambition: -25, community: -35, craftsmanship: -20 },
        moneyDelta: -500000,
        scareCustomers: true,
        reactionTitle: 'Khủng Hoảng Nhân Sự Trầm Trọng',
        reactionNarrative: 'Quyết định nóng nảy đẩy gian bếp vào cảnh hỗn loạn không người chiên gà. Đơn hàng cháy khét, khách hàng phàn nàn và bỏ về hàng loạt.'
      }
    ]
  },

  // 25. Chập Cầu Chì Khiến Chảo Chiên Tự Ngắt (Ngày 26)
  {
    id: 'inc_quiz_25_power_surge_breaker',
    title: 'Chập Cầu Chì Khiến Chảo Điện Tự Ngắt',
    categoryTag: 'SỰ CỐ KỸ THUẬT',
    icon: '⚡',
    characterName: 'Chú Thợ Điện Dũng',
    characterAvatar: '👨‍🔧',
    characterImg: charImg('char_22_electrician_dung.png'),
    emoteBubble: '🔌',
    characterRole: 'Thợ Điện Kỳ Cựu Phố Lớn',
    context: 'Đang giờ cao điểm tối, điện lưới khu phố sụt áp đột ngột làm aptomat tổng nhảy tanh tách, hệ thống hút mùi và chảo điện tắt ngúm giữa mẻ gà.',
    dialogue: 'Coi chừng quá tải cháy dây nguồn nghen! Đừng có bật bừa bãi kẻo chập cả hộp điện tổng khu phố!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 26,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 26: Tiếng tanh tách của chiếc cầu chì nhảy giữa giờ cao điểm.',
    choices: [
      {
        id: 'power_call_dung_expert',
        label: 'Gọi chú Dũng thợ điện thay aptomat chịu tải cao chuyên dụng',
        subDesc: 'Tốn 120k tiền công và vật tư, lưới điện vận hành êm ru bền vững nhiều năm',
        kicker: '🔧 NÂNG CẤP KỸ THUẬT BỀN VỮNG',
        karmaDelta: { craftsmanship: 30, ambition: 20 },
        moneyDelta: -120000,
        reactionTitle: 'Lưới Điện Chuẩn Công Nghiệp',
        reactionNarrative: 'Chú Dũng thay bộ cầu chì công nghiệp ba pha chịu tải lớn. Toàn bộ chảo chiên hoạt động hết công suất mà không lo bị ngắt quãng.'
      },
      {
        id: 'power_gas_backup',
        label: 'Bật ngay dàn bếp gas khẩn cấp dự phòng để chiên tiếp mẻ gà',
        subDesc: 'Ứng biến nhanh nhạy, phục vụ khách không bị trễ nải phút nào',
        kicker: '🔥 BẾP DỰ PHÒNG CẤP CỨU',
        karmaDelta: { craftsmanship: 25, community: 15 },
        moneyDelta: -30000,
        reactionTitle: 'Kế Hoạch B Hoàn Hảo',
        reactionNarrative: 'Ngọn lửa bếp gas bùng lên kịp thời cứu vãn mẻ gà đang chiên dở. Khách ngồi ăn ngoài sảnh không hề hay biết vừa có sự cố điện xảy ra.'
      },
      {
        id: 'power_force_tape',
        label: 'Lấy băng keo dán đè giữ chặt cầu chì ép chạy tiếp',
        subDesc: 'Rủi ro 80%: Cháy dây nguồn bốc khói đen kịt, đền 1.500k tiền sửa chữa',
        kicker: '⚠️ LIỀU MẠNG DÁN BĂNG KEO',
        riskRate: 0.8,
        karmaDelta: { craftsmanship: -35, ambition: -20 },
        moneyDelta: 0,
        reactionTitle: 'Tạm Thời Vượt Qua Ca Bán',
        reactionNarrative: 'Cầu chì cố gắng chịu đựng qua được ca bán tối, nhưng mùi khét lẹt vẫn khiến ai nấy đều thót tim.',
        reactionFailureNarrative: 'Dây nguồn bị chập bốc cháy ngùn ngụt khói đen! Mọi người hoảng hốt cúp cầu dao tổng, toàn bộ ca bán bị hủy và tốn 1.500.000đ thay đường dây mới.'
      }
    ]
  },

  // 26. Quán Nhái 'Gà Nhà Tui Chi Nhánh 2' Mọc Đầu Phố (Ngày 28)
  {
    id: 'inc_quiz_26_copycat_scam',
    title: 'Quán Nhái "Gà Nhà Tui Chi Nhánh 2" Mọc Lên',
    categoryTag: 'BẢO VỆ THƯƠNG HIỆU',
    icon: '🎭',
    characterName: 'Anh Ba Đất Mua Bán',
    characterAvatar: '🤨',
    characterImg: charImg('char_08_grumpy_hai.png'),
    emoteBubble: '⚠️',
    characterRole: 'Khách Quen Phản Ánh Tin Tức',
    context: 'Một quán gà rán lề đường lấy nguyên logo, font chữ và đặt tên Tiệm Gà Nhà Tui - CN2 nhưng dùng dầu chiên đen kịt và gà ươn bốc mùi.',
    dialogue: 'Khách người ta mua bên đó ăn xong bị đau bụng rồi chạy qua đây chửi quán mình quá trời kìa bạn ơi!',
    phaseTiming: 'morning',
    isSecurityRisk: true,
    minChapter: 3,
    minDay: 28,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 28: Chiếc bảng hiệu sao chép trắng trợn ở ngã tư đầu phố.',
    choices: [
      {
        id: 'copycat_taste_showdown',
        label: 'Treo biển "Chỉ Một Cơ Sở Duy Nhất - Bao Thử Miễn Phí Phân Biệt Thật Giả"',
        subDesc: 'Khách thử xong nhận ra sự khác biệt một trời một vực, quán nhái tự đóng cửa',
        kicker: '🍗 CHẤT LƯỢNG NÓI LÊN TẤT CẢ',
        karmaDelta: { craftsmanship: 40, ambition: 30 },
        moneyDelta: -50000,
        reactionTitle: 'Khẳng Định Đẳng Cấp Độc Bản',
        reactionNarrative: 'Vị giòn tan và hương thơm đậm đà của gà thật lập tức vạch trần hàng giả. Quán nhái ế ẩm không ai thèm mua đành phải tự dẹp tiệm sau 3 ngày.'
      },
      {
        id: 'copycat_legal_notice',
        label: 'Làm việc với công an kinh tế & quản lý thị trường xử lý vi phạm thương hiệu',
        subDesc: 'Pháp luật can thiệp, phạt quán nhái 10 triệu và tịch thu biển hiệu',
        kicker: '⚖️ THƯỢNG TÔN PHÁP LUẬT',
        karmaDelta: { ambition: 30, craftsmanship: 20 },
        moneyDelta: -100000,
        reactionTitle: 'Bảo Vệ Quyền Sở Hữu Trí Tuệ',
        reactionNarrative: 'Đoàn kiểm tra liên ngành lập biên bản xử phạt hành vi xâm phạm nhãn hiệu. Thương hiệu Tiệm Gà Nhà Tui được pháp luật bảo vệ nghiêm minh.'
      },
      {
        id: 'copycat_street_brawl',
        label: 'Thuê giang hồ sang đập phá xe bán hàng của quán nhái',
        subDesc: 'Hành vi côn đồ bị đưa lên mạng bóc phốt, công an mời làm việc',
        kicker: '🥊 BẠO LỰC CÔN ĐỒ',
        karmaDelta: { community: -40, ambition: -30 },
        moneyDelta: -1500000,
        reactionTitle: 'Hậu Quả Của Hành Vi Xốc Nổi',
        reactionNarrative: 'Xô xát ẩu đả khiến hình ảnh quán trở nên méo mó trong mắt công chúng. Tiệm gà bị tạm đình chỉ hoạt động 3 ngày để phục vụ điều tra.'
      }
    ]
  },

  // 27. Phi Vụ Cầu Hôn Bằng Hộp Burger Gà (Ngày 30)
  {
    id: 'inc_quiz_27_wedding_proposal_surprise',
    title: 'Phi Vụ Giấu Nhẫn Cầu Hôn Vào Hộp Burger Gà',
    categoryTag: 'CHUYỆN TÌNH TRONG BẾP',
    icon: '💍',
    characterName: 'Chàng Trai Hẹn Hò 5 Năm',
    characterAvatar: '🤵',
    characterImg: charImg('char_33_couple_genz.png'),
    emoteBubble: '💖',
    characterRole: 'Khách Quen Lâu Năm',
    context: 'Một chàng trai chuẩn bị cầu hôn bạn gái sau 5 năm quen nhau tại chính chiếc bàn số 3 của tiệm gà, nhờ quán giấu chiếc nhẫn kim cương vào hộp burger.',
    dialogue: 'Anh chủ ơi, đây là nơi lần đầu tiên hai đứa em hẹn hò ăn gà. Nhờ anh giúp em tạo khoảnh khắc bất ngờ nhất đời cô ấy!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 30,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 30: Hộp burger tình yêu chứa chiếc nhẫn kim cương lấp lánh.',
    choices: [
      {
        id: 'proposal_romantic_setup',
        label: 'Trang trí nến hoa hồng, bật nhạc lãng mạn & tặng bánh kem chúc mừng',
        subDesc: 'Cô gái vỡ òa hạnh phúc đồng ý trong tiếng vỗ tay rền vang của cả quán',
        kicker: '💐 KHOẢNH KHẮC NGỌT NGÀO',
        karmaDelta: { community: 40, craftsmanship: 20 },
        moneyDelta: -60000,
        reactionTitle: 'Lời Đồng Ý Hạnh Phúc Nhất Năm',
        reactionNarrative: 'Khi chiếc hộp burger mở ra để lộ chiếc nhẫn lấp lánh giữa ánh nến lung linh, cô gái bật khóc gật đầu trong niềm xúc động. Cả tiệm gà vỗ tay rộn rã chúc phúc cho đôi lứa!'
      },
      {
        id: 'proposal_put_ring_normal',
        label: 'Nhét nhẫn vào hộp giấy bình thường theo đúng yêu cầu',
        subDesc: 'Cô gái phát hiện bất ngờ, lời cầu hôn diễn ra giản dị ấm cúng',
        kicker: '📦 BÌNH DỊ MỘC MẠC',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Hạnh Phúc Mộc Mạc Giản Đơn',
        reactionNarrative: 'Lời cầu hôn diễn ra tự nhiên và ấm áp. Đôi bạn trẻ cảm ơn tiệm gà đã luôn là chứng nhân cho tình yêu đẹp của họ suốt những năm tháng thanh xuân.'
      },
      {
        id: 'proposal_charge_event_fee',
        label: 'Thu phụ phí tổ chức sự kiện 500k làm mất đi tính cảm xúc chân thành',
        subDesc: 'Chàng trai ngậm ngùi trả tiền nhưng cảm thấy quán quá thực dụng',
        kicker: '💵 TẬN THU PHỤ PHÍ',
        karmaDelta: { ambition: 15, community: -25 },
        moneyDelta: 500000,
        reactionTitle: 'Cuộc Giao Dịch Đắt Đỏ Nơi Hẹn Hò',
        reactionNarrative: 'Buổi cầu hôn diễn ra thành công nhưng mức phụ phí đắt đỏ khiến chàng trai không còn muốn quay lại tiệm gà để kỷ niệm những năm sau.'
      }
    ]
  },

  // 28. Đoàn Thanh Tra ATVSTP Đột Xuất (Ngày 32)
  {
    id: 'inc_quiz_28_hygiene_surprise_inspection',
    title: 'Đoàn Thanh Tra Vệ Sinh An Toàn Thực Phẩm Đột Xuất',
    categoryTag: 'KIỂM ĐỊNH CHẤT LƯỢNG',
    icon: '📋',
    characterName: 'Bác Sĩ Trưởng Đoàn Thanh Tra',
    characterAvatar: '👨‍⚕️',
    characterImg: charImg('char_27_warden_hai.png'),
    emoteBubble: '🩺',
    characterRole: 'Cán Bộ Chi Cục ATVSTP',
    context: 'Ba cán bộ y tế mang găng tay và dụng cụ đo mẫu kiểm tra đột xuất nguồn gốc thịt gà, chỉ số oxy hóa của dầu ăn và hồ sơ khám sức khỏe nhân viên.',
    dialogue: 'Chúng tôi nhận lệnh kiểm tra an toàn thực phẩm định kỳ. Đề nghị chủ cơ sở xuất trình sổ lưu mẫu và nguồn gốc xuất xứ nguyên liệu!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 32,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 32: Chiếc cặp hồ sơ kiểm định an toàn thực phẩm bất ngờ xuất hiện.',
    choices: [
      {
        id: 'hygiene_show_records',
        label: 'Tự tin xuất trình đầy đủ hóa đơn thịt VietGAP, que thử dầu sạch & sổ lưu mẫu 24h',
        subDesc: 'Đạt chuẩn 100/100 điểm, được cấp Bằng Khen Cơ Sở ATVSTP Tiêu Biểu Thành Phố',
        kicker: '🏆 MINH BẠCH VÀNG TIÊU CHUẨN',
        karmaDelta: { craftsmanship: 45, ambition: 25 },
        moneyDelta: 0,
        reactionTitle: 'Tấm Bằng Khen Xứng Đáng Bản Lĩnh Bếp',
        reactionNarrative: 'Trưởng đoàn thanh tra gật đầu tán thưởng: "Gian bếp sạch bóng, dầu ăn đạt chuẩn oxy hóa tuyệt hảo, sổ sách minh bạch. Rất xứng đáng làm mô hình điểm của quận!"'
      },
      {
        id: 'hygiene_bribe_envelope',
        label: 'Lén nhét phong bì 500k xin bỏ qua khâu kiểm tra dầu',
        subDesc: 'Bị lập biên bản vi phạm hối lộ, phạt kịch khung 15 triệu và đình chỉ 7 ngày',
        kicker: '❌ ĐƯA HỐI LỘ SAI TRÁI',
        karmaDelta: { craftsmanship: -45, ambition: -35, community: -30 },
        moneyDelta: -15000000,
        reactionTitle: 'Biên Bản Phạt Nghiêm Khắc Của Pháp Luật',
        reactionNarrative: 'Cán bộ thanh tra nghiêm giọng lập biên bản hành vi đưa hối lộ. Quán bị phạt nặng và công khai danh sách vi phạm lên cổng thông tin y tế thành phố!'
      },
      {
        id: 'hygiene_stall_for_time',
        label: 'Cố tình câu giờ đóng cửa bảo bận việc riêng từ chối tiếp',
        subDesc: 'Bị đưa vào diện thanh tra đặc biệt với tần suất kiểm tra gấp 3 lần',
        kicker: '⏱️ TRỐN TRÁNH KIỂM TRA',
        karmaDelta: { craftsmanship: -20, ambition: -15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Nghi Ngờ Đặt Lên Thương Hiệu',
        reactionNarrative: 'Đoàn kiểm tra ghi nhận dấu hiệu bất thường và chuyển quán vào danh sách giám sát đặc biệt. Các cuộc kiểm tra sau đó diễn ra gắt gao hơn nhiều.'
      }
    ]
  },

  // 29. Hot Girl Livestream Đòi 5 Triệu Kèm Ăn Miễn Phí (Ngày 33)
  {
    id: 'inc_quiz_29_influencer_collab',
    title: 'Hot Girl Livestream Đòi 5 Triệu Kèm Ăn Gà Miễn Phí',
    categoryTag: 'MARKETING CÔNG NGHỆ',
    icon: '💄',
    characterName: 'Hot Girl Bella Quỳnh',
    characterAvatar: '💃',
    characterImg: charImg('char_07_trendy_vy.png'),
    emoteBubble: '💸',
    characterRole: 'KOL Mạng Xã Hội 500k Follow',
    context: 'Một cô nàng hot girl có 500k followers bước vào quán với ê-kíp 3 người, đề xuất livestream ăn gà rán tại quán với giá cát-xê 5 triệu đồng.',
    dialogue: 'Kênh em tương tác đỉnh lắm anh ơi. 5 triệu đổi lại cả vạn lượt khách mới, anh có dám đầu tư lớn để bùng nổ doanh số không?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 33,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 33: Bản hợp đồng livestream 5 triệu từ cô nàng hot girl triệu view.',
    choices: [
      {
        id: 'influencer_refuse_pure',
        label: 'Từ chối nhẹ nhàng, khẳng định quán tin vào chất lượng và sự truyền miệng tự nhiên',
        subDesc: 'Khách xung quanh ủng hộ vì quán giữ vững bản sắc chân thật không chiêu trò',
        kicker: '💎 HỮU XẠ TỰ NHIÊN HƯƠNG',
        karmaDelta: { craftsmanship: 35, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Chất Lượng Chân Thật Thắng Mọi Chiêu Trò',
        reactionNarrative: 'Bella Quỳnh ngạc nhiên trước sự kiên định của bạn. Khách quen trong quán nghe được câu chuyện càng thêm tin yêu sự chân thật của Tiệm Gà Nhà Tui.'
      },
      {
        id: 'influencer_negotiate_affiliate',
        label: 'Đàm phán hình thức Affiliate: Khách nhập mã của cô ấy mới chia hoa hồng',
        subDesc: 'Không mất tiền cọc trước, đo lường được hiệu quả thực tế của chiến dịch',
        kicker: '📊 HỢP TÁC THEO HIỆU QUẢ',
        karmaDelta: { ambition: 30, craftsmanship: 15 },
        moneyDelta: 250000,
        reactionTitle: 'Chiến Dịch Tiếp Thị Thông Minh',
        reactionNarrative: 'Hình thức chia sẻ hoa hồng theo doanh số thực tế giúp quán thu hút được lượng khách trẻ đông đảo mà không phải chịu bất kỳ rủi ro tài chính nào.'
      },
      {
        id: 'influencer_pay_full',
        label: 'Vung tay chi liền 5 triệu tiền quỹ để thuê livestream ngay trong tối',
        subDesc: 'Clip view ảo do chạy bot, chỉ kéo được 3 đơn hàng, lỗ nặng 4.8 triệu',
        kicker: '💸 ĐỐT TIỀN THUÊ KOL ẢO',
        karmaDelta: { ambition: 15, craftsmanship: -20 },
        moneyDelta: -4800000,
        reactionTitle: 'Bài Học Đắt Giá Về Lượt Xem Ảo',
        reactionNarrative: 'Hàng ngàn lượt xem ảo trên mạng không chuyển đổi thành đơn hàng thực tế. Bài học đau xót về việc đặt cược vào những giá trị ảo phù phiếm.'
      }
    ]
  },

  // 30. Cơn Lốc Xoáy Thổi Tốc Mái Tôn Sân Vườn (Ngày 35)
  {
    id: 'inc_quiz_30_storm_damage_tarp',
    title: 'Cơn Lốc Bất Ngờ Tốc Mái Tôn Khu Sân Vườn',
    categoryTag: 'THIÊN TAI ĐỘT XUẤT',
    icon: '🌪️',
    characterName: 'Bác Bảy Thợ Xây',
    characterAvatar: '👷‍♂️',
    characterImg: charImg('char_23_builder_bay.png'),
    emoteBubble: '⚠️',
    characterRole: 'Thợ Xây Lão Thành Hẻm 1102',
    context: 'Một cơn gió lốc quét qua làm bay một góc mái tôn che sân sau, nước mưa hắt vào bàn ghế ngoài trời giữa lúc khách đang ngồi đông đúc.',
    dialogue: 'Mái tôn bung ốc rồi con ơi! Phải leo lên giằng dây thép với đè bao cát ngay kẻo gió cuốn bay mất nguyên mái!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 35,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 35: Tiếng rít của cơn lốc xoáy làm rung chuyển mái tôn sân vườn.',
    choices: [
      {
        id: 'storm_safety_evacuate',
        label: 'Ưu tiên sơ tán toàn bộ khách vào khu vực nhà trong an toàn, tặng trà sữa nóng',
        subDesc: 'Bảo đảm an toàn tuyệt đối cho thực khách, ai nấy đều ấm lòng cảm phục',
        kicker: '🛡️ SƠ TÁN AN TOÀN TRÊN HẾT',
        karmaDelta: { community: 35, craftsmanship: 15 },
        moneyDelta: -50000,
        reactionTitle: 'Sự Bình Tĩnh Bảo Vệ Tính Mạng',
        reactionNarrative: 'Toàn bộ thực khách được đưa vào nhà an toàn, vừa nhâm nhi ly trà sữa ấm vừa trò chuyện rôm rả. Mọi người xúc động trước sự chăm sóc tận tâm của chủ tiệm.'
      },
      {
        id: 'storm_repair_instant',
        label: 'Cùng bác Bảy thợ xây đội mưa leo thang giằng dây thép gia cố ngay',
        subDesc: 'Tốn 150k vật tư, cứu được nguyên mái tôn không bị gió cuốn bay',
        kicker: '🔨 ĐỘI MƯA CỨU MÁI NHÀ',
        karmaDelta: { craftsmanship: 30, ambition: 20 },
        moneyDelta: -150000,
        reactionTitle: 'Hành Động Quả Cảm Trong Giông Bão',
        reactionNarrative: 'Chiếc mái tôn được giằng néo kiên cố bằng dây cáp thép chịu lực. Cả con hẻm khen ngợi sự dũng cảm và nhanh nhạy của đội ngũ tiệm gà.'
      },
      {
        id: 'storm_ignore_continue',
        label: 'Mặc kệ gió thổi, bảo khách ngoài sân tự che ô dù mà ăn tiếp',
        subDesc: 'Tôn rách văng xuống làm vỡ bàn kính ngoài trời, khách hốt hoảng bỏ chạy',
        kicker: '❌ THỜ Ơ BỎ MẶC HIỂM HỌA',
        karmaDelta: { community: -40, craftsmanship: -30 },
        moneyDelta: -800000,
        scareCustomers: true,
        reactionTitle: 'Hậu Quả Tai Hại Của Sự Tắc Trách',
        reactionNarrative: 'Tấm tôn bung ốc va đập làm vỡ tung chiếc bàn kính ngoài sân. Sự thờ ơ tắc trách khiến khách hàng khiếp sợ và tẩy chay quán mãi mãi.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 4: CUỘC CHIẾN MEGACHICKEN & BẢN LĨNH TRIỆU ĐÔ (NGÀY 36 - 60) - 10 SỰ KIỆN
  // =========================================================================

  // 31. MegaChicken Săn Trộm Đầu Bếp Khang Lương Gấp Đôi (Ngày 36)
  {
    id: 'inc_quiz_31_corporate_poaching',
    title: 'MegaChicken Mời Đầu Bếp Khang Lương Gấp Đôi',
    categoryTag: 'CUỘC CHIẾN TẬP ĐOÀN',
    icon: '💼',
    characterName: 'Giám Đốc Nhân Sự MegaChicken',
    characterAvatar: '🕴️',
    characterImg: charImg('char_11_wholesale_nam.png'),
    emoteBubble: '💰',
    characterRole: 'Kẻ Săn Đầu Người Của Tập Đoàn',
    context: 'Chuỗi thức ăn nhanh khổng lồ cử người tiếp cận anh Khang thợ chiên, đưa ra hợp đồng lương 30 triệu/tháng với điều kiện mang theo công thức sốt bí truyền.',
    dialogue: 'Ở cái tiệm hẻm này cậu kiếm được bao nhiêu? Sang MegaChicken cậu sẽ làm bếp trưởng chuỗi 50 cửa hàng, tương lai rạng ngời!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 36,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 36: Bản hợp đồng triệu đô từ gã khổng lồ thức ăn nhanh.',
    choices: [
      {
        id: 'poaching_trust_bonus',
        label: 'Tăng lương thưởng xứng đáng và trao quyền đồng sáng lập cổ phần nội bộ',
        subDesc: 'Khang từ chối tập đoàn, thề gắn bó trọn đời cùng người anh em nghĩa tình',
        kicker: '🤝 TÌNH ANH EM CÙNG TIẾN',
        karmaDelta: { community: 40, craftsmanship: 30, ambition: 20 },
        moneyDelta: -300000,
        reactionTitle: 'Tình Nghĩa Vượt Lên Trên Tiền Bạc',
        reactionNarrative: 'Khang xé toạc bản hợp đồng của MegaChicken trước mặt họ: "Tiền nhiều ai chẳng ham, nhưng ở đây có cái tâm và tình anh em mà tiền tỷ cũng không mua nổi!"'
      },
      {
        id: 'poaching_let_go',
        label: 'Tôn trọng để Khang tự do lựa chọn tương lai, tặng quà chúc may mắn',
        subDesc: 'Khang cảm động rơi nước mắt trước tấm lòng bao dung và quyết định ở lại',
        kicker: '🕊️ TỰ DO VÀ BAO DUNG',
        karmaDelta: { community: 35, craftsmanship: 20 },
        moneyDelta: 0,
        reactionTitle: 'Sự Bao Dung Giữ Chân Nhân Tài',
        reactionNarrative: 'Thấy bạn thật lòng lo cho tương lai của mình mà không hề ích kỷ, Khang xúc động nghẹn ngào: "Em không đi đâu hết! Em sẽ cùng anh đưa Tiệm Gà Nhà Tui vượt qua bọn họ!"'
      },
      {
        id: 'poaching_threaten_contract',
        label: 'Đe dọa kiện tụng và giữ bằng cấp giấy tờ tùy thân của Khang',
        subDesc: 'Khang bức xúc bỏ việc ngay lập tức, mang theo kinh nghiệm sang đối thủ',
        kicker: '⚠️ ĐE DỌA TIỂU NHÂN',
        karmaDelta: { community: -45, ambition: -30, craftsmanship: -30 },
        moneyDelta: 0,
        reactionTitle: 'Sự Đổ Vỡ Không Thể Hàn Gắn',
        reactionNarrative: 'Sự nghi kỵ và đe dọa biến người anh em chí cốt thành đối thủ cay đắng. Khang dứt áo ra đi, để lại khoảng trống mênh mông trong gian bếp.'
      }
    ]
  },

  // 32. Chiến Dịch Bơm 50 Đánh Giá 1 Sao Trên Google Maps (Ngày 38)
  {
    id: 'inc_quiz_32_fake_review_attack',
    title: 'Bão 50 Đánh Giá 1 Sao Ảo Trên Google Maps',
    categoryTag: 'KHỦNG HOẢNG TRUYỀN THÔNG',
    icon: '⭐',
    characterName: 'Chuyên Viên An Ninh Mạng Út',
    characterAvatar: '💻',
    characterImg: charImg('char_12_courier_ut.png'),
    emoteBubble: '🚨',
    characterRole: 'Hiệp Sĩ Công Nghệ Hẻm 1102',
    context: 'Chỉ sau 1 đêm, điểm Google Maps của quán tụt thảm hại từ 4.8 xuống 3.2 do một loạt tài khoản ảo đánh giá 1 sao cùng nội dung: Ăn xong nhập viện cấp cứu.',
    dialogue: 'Anh chủ ơi! Có kẻ bỏ tiền thuê bot trang trại clone dìm chết quán mình trên bản đồ kìa!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 38,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 38: Cơn bão 1 sao bất thường xuất hiện sau một đêm.',
    choices: [
      {
        id: 'review_livestream_transparency',
        label: 'Mở livestream 24/7 quay toàn cảnh gian bếp sạch bóng & minh bạch quy trình',
        subDesc: 'Cộng đồng mạng cảm phục sự quang minh chính đại, ùa vào đánh giá 5 sao phản công',
        kicker: '📹 BẾP MỞ MINH BẠCH',
        karmaDelta: { craftsmanship: 45, community: 35 },
        moneyDelta: -50000,
        reactionTitle: 'Quang Minh Chính Đại Đập Tan Luận Điệu Xấu',
        reactionNarrative: 'Hình ảnh gian bếp sạch bong kin kít và quy trình thay dầu đạt chuẩn y tế được chiếu trực tiếp trên mạng. Khách hàng khắp nơi phẫn nộ trước trò bẩn của đối thủ và đồng loạt vote 5 sao đưa điểm số lên 4.9 tuyệt đối!'
      },
      {
        id: 'review_appeal_google',
        label: 'Tập hợp log IP và bằng chứng gửi khiếu nại chính thức lên Google',
        subDesc: 'Google quét sạch 50 đánh giá bot rác sau 48h, khôi phục lại điểm số thật',
        kicker: '🛡️ KHIẾU NẠI PHÁP LÝ SỐ',
        karmaDelta: { ambition: 30, craftsmanship: 20 },
        moneyDelta: 0,
        reactionTitle: 'Công Lý Số Được Thực Thi',
        reactionNarrative: 'Đội ngũ kỹ thuật Google xác nhận đây là cuộc tấn công bot spam có tổ chức. Toàn bộ 50 review giả mạo bị xóa sổ hoàn toàn khỏi hệ thống.'
      },
      {
        id: 'review_hire_counter_bot',
        label: 'Bỏ 1 triệu thuê đội bot đánh giá 5 sao ảo đáp trả lại',
        subDesc: 'Google phát hiện hai bên cùng buff bẩn, khóa luôn trang doanh nghiệp của quán',
        kicker: '🤖 DÙNG BOT BẨN ĐÁP TRẢ',
        karmaDelta: { ambition: -35, craftsmanship: -30 },
        moneyDelta: -1000000,
        reactionTitle: 'Án Phạt Khóa Tài Khoản Doanh Nghiệp',
        reactionNarrative: 'Thuật toán chống gian lận của Google phát hiện luồng đánh giá bất thường và khóa luôn trang địa điểm của quán. Một sai lầm tai hại!'
      }
    ]
  },

  // 33. Đầu Mối Bị Mua Đứt, Kho Cạn Kiệt Gà Tươi (Ngày 40)
  {
    id: 'inc_quiz_33_raw_chicken_embargo',
    title: 'Đầu Mối Bị Thâu Tóm, Quán Đứng Trước Nguy Cơ Thiếu Gà',
    categoryTag: 'CHUỖI CUNG ỨNG NGUY CẤP',
    icon: '🐔',
    characterName: 'Chú Năm Cung Cấp Gà Đồi',
    characterAvatar: '👨‍🌾',
    characterImg: charImg('char_11_wholesale_nam.png'),
    emoteBubble: '😰',
    characterRole: 'Nhà Cung Ứng Gà Thả Vườn Cốt Cán',
    context: 'Chuỗi lớn tung tiền gom sạch nguồn cung gà thả vườn đạt chuẩn của chú Năm, đẩy tiệm gà vào nguy cơ không có nguyên liệu tươi để mở bán ngày mai.',
    dialogue: 'Thằng tập đoàn nó ép chú ký độc quyền giá cao gấp rưỡi... Chú thương cháu lắm mà kẹt cái hợp đồng đền tiền tỷ...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 40,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 40: Lời xin lỗi nghẹn ngào từ chiếc xe tải cung cấp gà tươi.',
    choices: [
      {
        id: 'embargo_direct_farm',
        label: 'Lái xe máy xuyên đêm về trang trại Củ Chi hợp tác trực tiếp với hợp tác xã nhỏ',
        subDesc: 'Tự chủ nguồn cung gà tươi VietGAP giá tận gốc, không sợ ai chèn ép',
        kicker: '🚜 TỰ CHỦ CHUỖI CUNG ỨNG',
        karmaDelta: { craftsmanship: 45, ambition: 35 },
        moneyDelta: -200000,
        reactionTitle: 'Hợp Tác Xã Nông Trại Vươn Mình',
        reactionNarrative: 'Cái bắt tay ấm áp với các bác nông dân Củ Chi mở ra nguồn cung gà tươi thả vườn thượng hạng giá gốc. Tiệm Gà Nhà Tui hoàn toàn thoát khỏi sự kìm kẹp của các ông lớn!'
      },
      {
        id: 'embargo_frozen_substitute',
        label: 'Tạm mua ức gà đông lạnh siêu thị về bán đỡ vài hôm',
        subDesc: 'Thịt bở thiếu độ ngọt tự nhiên, khách quen chê gà mất chất',
        kicker: '🧊 DÙNG HÀNG ĐÔNG LẠNH THAY THẾ',
        karmaDelta: { craftsmanship: -35, ambition: 15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Thụt Lùi Tạm Thời Về Chất Lượng',
        reactionNarrative: 'Miếng thịt đông lạnh không thể mang lại độ ngọt mọng tự nhiên của gà tươi. Khách quen ăn thử liền nhận ra sự khác biệt và bày tỏ sự tiếc nuối.'
      },
      {
        id: 'embargo_close_rest',
        label: 'Dán thông báo tạm nghỉ 1 ngày với lý do: "Không Có Gà Tươi Chuẩn - Quán Không Mở Bán"',
        subDesc: 'Khách hàng thán phục nguyên tắc thà nghỉ chứ không bán đồ dở, uy tín tăng vọt',
        kicker: '🛑 THÀ NGHỈ CHỨ KHÔNG BÁN ẨU',
        karmaDelta: { craftsmanship: 50, community: 25 },
        moneyDelta: -500000,
        reactionTitle: 'Thông Cáo Làm Chấn Động Giới Sành Ăn',
        reactionNarrative: 'Tấm biển thông báo đầy tự trọng được lan truyền khắp các hội nhóm ẩm thực. Sự kiên định giữ vững chuẩn mực giúp quán nhận được sự tôn trọng tuyệt đối của thực khách!'
      }
    ]
  },

  // 34. Cò Mồi Giả Mạo Nhà Đầu Tư Xin Nhượng Quyền (Ngày 43)
  {
    id: 'inc_quiz_34_franchise_scammer_trap',
    title: 'Cò Mồi Giả Danh Đại Gia Đòi Mua Đứt Nhượng Quyền 5 Tỷ',
    categoryTag: 'CẠM BẪY TÀI CHÍNH',
    icon: '📑',
    characterName: 'Nhà Đầu Tư Vest Đen Lịch Lãm',
    characterAvatar: '🕴️',
    characterImg: charImg('char_10_winner_hung.png'),
    emoteBubble: '💼',
    characterRole: 'Thợ Săn Bản Quyền Đội Lốt Đại Gia',
    context: 'Một người đàn ông mặc vest bước xuống từ xe hơi sang trọng, đặt lên bàn chiếc cặp da đựng đầy tài liệu đề nghị mua quyền nhượng quyền toàn quốc giá 5 tỷ đồng.',
    dialogue: 'Tôi mở 100 chi nhánh cho anh, anh chỉ cần ký chuyển giao 100% công thức cốt lõi và ủy quyền thương hiệu trong 10 năm!',
    phaseTiming: 'morning',
    isSecurityRisk: true,
    minChapter: 4,
    minDay: 43,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 43: Chiếc vali da bóng bẩy chứa bản hợp đồng 5 tỷ đồng.',
    choices: [
      {
        id: 'scam_scrutinize_lawyer',
        label: 'Mời luật sư kinh tế thẩm định, lật tẩy điều khoản gài bẫy cướp trắng thương hiệu',
        subDesc: 'Tốn 500k phí luật sư, cứu tiệm gà thoát khỏi chiếc bẫy cướp đoạt công thức',
        kicker: '🔍 TỈNH TÁO PHÁP LÝ',
        karmaDelta: { ambition: 35, craftsmanship: 30 },
        moneyDelta: -500000,
        reactionTitle: 'Cái Bẫy Pháp Lý Bị Lật Tẩy',
        reactionNarrative: 'Luật sư chỉ ra điều khoản ẩn: nếu ký, bạn sẽ bị tước đoạt toàn bộ quyền sử dụng tên quán và công thức. Kẻ lừa đảo tái mặt vội vã gom tài liệu chuồn lẹ!'
      },
      {
        id: 'scam_reject_handcraft',
        label: 'Từ chối thẳng thừng: "Tiệm Gà Nhà Tui là linh hồn Hẻm 1102, tiền tỷ cũng không bán!"',
        subDesc: 'Giữ trọn vẹn bản sắc mộc mạc và quyền tự quyết số phận gian bếp',
        kicker: '💎 GIỮ GÌN BẢN SẮC CỐT LÕI',
        karmaDelta: { craftsmanship: 40, community: 30 },
        moneyDelta: 0,
        reactionTitle: 'Linh Hồn Không Thể Đong Bằng Tiền',
        reactionNarrative: 'Câu trả lời đanh thép của bạn khiến gã săn bản quyền cứng họng. Gian bếp Hẻm 1102 mãi mãi thuộc về những con người đã đổ mồ hôi gầy dựng nên nó.'
      },
      {
        id: 'scam_sign_blindly',
        label: 'Mờ mắt trước con số 5 tỷ, vội vàng ký ngay không cần đọc kỹ điều khoản',
        subDesc: 'Mất quyền kiểm soát menu, bị tập đoàn ép hạ chất lượng nguyên liệu xuống đáy',
        kicker: '❌ MỜ MẮT VÌ TIỀN TỶ',
        karmaDelta: { ambition: 20, craftsmanship: -50, community: -40 },
        moneyDelta: 1000000,
        reactionTitle: 'Chiếc Thòng Lọng Quấn Quanh Gian Bếp',
        reactionNarrative: 'Bản hợp đồng trở thành chiếc thòng lọng siết chặt quyền sáng tạo. Bạn nhận được tiền nhưng linh hồn của quán gà đã bị biến thành một cỗ máy công nghiệp vô vị.'
      }
    ]
  },

  // 35. Nền Tảng Giao Hàng Áp Phí Hoa Hồng 32% (Ngày 46)
  {
    id: 'inc_quiz_35_delivery_commission_hike',
    title: 'App Giao Hàng Đòi Tăng Phí Hoa Hồng Lên 32%',
    categoryTag: 'ÁP BỨC CÔNG NGHỆ',
    icon: '📈',
    characterName: 'Quản Lý Nền Tảng Giao Hàng',
    characterAvatar: '👔',
    characterImg: charImg('char_19_shipper_tuan.png'),
    emoteBubble: '📉',
    characterRole: 'Đại Diện Thuật Toán Ứng Dụng',
    context: 'Ứng dụng giao hàng gửi thông báo: nếu không tăng phí chiết khấu lên 32% và mua gói quảng cáo hiển thị, quán sẽ bị hạ thuật toán đề xuất xuống đáy trang.',
    dialogue: 'Các chuỗi lớn đều chấp nhận 32%, tiệm anh muốn giữ vị trí top tìm kiếm thì bắt buộc phải tuân theo chính sách mới!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 46,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 46: Thông báo tối hậu thư tăng phí hoa hồng lên 32%.',
    choices: [
      {
        id: 'commission_own_fleet',
        label: 'Tự lập đội giao hàng Hẻm 1102, tặng voucher 20k cho khách đặt qua số hotline quán',
        subDesc: 'Kéo 60% lượng khách về kênh tự giao, tạo thêm việc làm cho anh em trong xóm',
        kicker: '🛵 ĐỘI SHIPPER NỘI BỘ',
        karmaDelta: { community: 40, ambition: 35 },
        moneyDelta: 400000,
        reactionTitle: 'Đội Bay Hẻm 1102 Xuất Kích',
        reactionNarrative: 'Khách hàng hào hứng gọi điện đặt trực tiếp để được gà nóng hổi hơn và giá rẻ hơn. Đội shipper xóm hẻm chạy đơn rộn rã, quán giữ lại trọn vẹn từng đồng lợi nhuận!'
      },
      {
        id: 'commission_negotiate_volume',
        label: 'Dùng sản lượng đơn khủng đàm phán giữ mức phí độc quyền 22%',
        subDesc: 'Phía nền tảng nhượng bộ vì không muốn mất đi đối tác kim cương hút khách',
        kicker: '🤝 ĐÀM PHÁN VỊ THẾ DẪN ĐẦU',
        karmaDelta: { ambition: 35, craftsmanship: 20 },
        moneyDelta: 200000,
        reactionTitle: 'Sức Mạnh Của Thương Hiệu Hàng Đầu',
        reactionNarrative: 'Nhận thấy lượng đơn hàng của quán quá lớn, nền tảng app đành phải nhượng bộ ký thỏa thuận biểu phí ưu đãi riêng cho Tiệm Gà Nhà Tui.'
      },
      {
        id: 'commission_raise_prices',
        label: 'Tăng giá thực đơn trên app thêm 35% đổ hết gánh nặng lên đầu khách',
        subDesc: 'Khách hàng bất bình chê đắt, lượng đơn app sụt giảm nghiêm trọng',
        kicker: '💸 TĂNG GIÁ BÙ PHÍ',
        karmaDelta: { ambition: 10, community: -30, craftsmanship: -15 },
        moneyDelta: -200000,
        reactionTitle: 'Sự Quay Lưng Của Thực Khách',
        reactionNarrative: 'Giá bán tăng vọt khiến khách hàng cảm thấy bị móc túi. Lượng đơn hàng tụt dốc không phanh, một nước cờ sai lầm về mặt chiến lược.'
      }
    ]
  },

  // 36. Đài Truyền Hình HTV Mời Lên Sóng Giờ Vàng (Ngày 49)
  {
    id: 'inc_quiz_36_national_tv_show',
    title: 'Đài Truyền Hình Mời Lên Chương Trình "Ẩm Thực Phố Thị"',
    categoryTag: 'TRUYỀN THÔNG ĐỈNH CAO',
    icon: '📺',
    characterName: 'Biên Tập Viên Đài HTV',
    characterAvatar: '🎤',
    characterImg: charImg('char_01_owner.png'),
    emoteBubble: '🌟',
    characterRole: 'Biên Tập Viên Giờ Vàng',
    context: 'Biên tập viên chương trình truyền hình nổi tiếng gửi thư mời Tiệm Gà Nhà Tui đại diện cho ẩm thực đường phố Sài Gòn thi đấu ẩm thực trên sóng giờ vàng.',
    dialogue: 'Chúng tôi rất ấn tượng với câu chuyện khởi nghiệp từ xe đẩy vỉa hè của quán. Đây là cơ hội phủ sóng tới hàng triệu khán giả truyền hình!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 49,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 49: Chiếc phong bì đỏ có con dấu của đài truyền hình.',
    choices: [
      {
        id: 'tv_show_authentic_story',
        label: 'Nhận lời tham gia, đem câu chuyện Hẻm 1102 và món gà sốt bí truyền lên sóng',
        subDesc: 'Chương trình phát sóng lấy nước mắt triệu khán giả, quán đón làn sóng khách kỷ lục',
        kicker: '🌟 TỎA SÁNG TRÊN SÓNG GIỜ VÀNG',
        karmaDelta: { community: 40, craftsmanship: 40, ambition: 35 },
        moneyDelta: 1500000,
        reactionTitle: 'Câu Chuyện Truyền Cảm Hứng Triệu Người',
        reactionNarrative: 'Hình ảnh chiếc xe đẩy cũ kỹ năm nào hòa cùng nụ cười rạng rỡ của bạn trên sóng truyền hình làm rung động hàng triệu trái tim. Tiệm Gà Nhà Tui trở thành niềm tự hào của ẩm thực Sài Gòn!'
      },
      {
        id: 'tv_show_dramatic_stunt',
        label: 'Dàn dựng kịch bản giật gân, giả nghèo giả khổ để câu view nước mắt',
        subDesc: 'Bị hàng xóm nhận ra bóc phốt làm màu, mất đi hình ảnh chân thật',
        kicker: '🎭 DIỄN KỊCH CÂU NƯỚC MẮT',
        karmaDelta: { ambition: 20, craftsmanship: -35, community: -35 },
        moneyDelta: 500000,
        reactionTitle: 'Vở Kịch Bị Vạch Trần',
        reactionNarrative: 'Sự giả tạo không thể qua mắt được những người hàng xóm chân chất. Tiếng xấu làm màu câu view khiến quán mất đi sự tin yêu của những người gắn bó.'
      },
      {
        id: 'tv_show_decline_focus',
        label: 'Từ chối lên hình vì muốn dồn 100% thời gian phục vụ thực khách tại quán',
        subDesc: 'Khách hàng khen ngợi tinh thần làm nghề chân chính không ham hư danh',
        kicker: '🛡️ TẬP TRUNG TAY NGHỀ',
        karmaDelta: { craftsmanship: 40, community: 20 },
        moneyDelta: 0,
        reactionTitle: 'Bản Lĩnh Đứng Ngoài Hào Nhoáng',
        reactionNarrative: 'Từ chối ánh hào quang showbiz để gắn bó bên chảo dầu nóng, bạn chứng minh rằng tình yêu của người thợ bếp chỉ thuộc về nụ cười của từng vị khách bước vào quán.'
      }
    ]
  },

  // 37. Đổi Sang Hộp Giấy Bã Mía Bảo Vệ Môi Trường (Ngày 52)
  {
    id: 'inc_quiz_37_eco_packaging_switch',
    title: 'Chuyển Đổi Sang Hộp Bã Mía Tự Hủy Sinh Học',
    categoryTag: 'TIỆM GÀ XANH',
    icon: '🌱',
    characterName: 'Kỹ Sư Khởi Nghiệp Xanh',
    characterAvatar: '👨‍🌾',
    characterImg: charImg('char_14_scrap_nam.png'),
    emoteBubble: '🌿',
    characterRole: 'Đại Diện Xưởng Bao Bì Sinh Học',
    context: 'Nhìn những đống hộp xốp nhựa chất đầy thùng rác mỗi ngày, một xưởng khởi nghiệp xanh chào mời tiệm đổi sang 100% hộp bã mía tự hủy sinh học trong 90 ngày.',
    dialogue: 'Chi phí hộp bã mía cao hơn hộp xốp 1.500đ/phần, nhưng mỗi năm quán sẽ cứu được hàng chục tấn rác thải nhựa ra môi trường!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 52,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 52: Chiếc hộp giấy bã mía màu nâu nhạt thơm mùi thực vật.',
    choices: [
      {
        id: 'eco_switch_full',
        label: 'Chấp nhận giảm bớt một phần lãi, chuyển đổi 100% sang hộp bã mía thân thiện',
        subDesc: 'Giới trẻ ủng hộ phong trào sống xanh nhiệt liệt, doanh thu tăng bù đắp chi phí',
        kicker: '🌱 SỐNG XANH VÌ TƯƠNG LAI',
        karmaDelta: { community: 40, craftsmanship: 30, ambition: 20 },
        moneyDelta: 100000,
        reactionTitle: 'Tiệm Gà Xanh Tiên Phong Của Giới Trẻ',
        reactionNarrative: 'Khách hàng chia sẻ rầm rộ hình ảnh hộp bã mía tinh tế của quán lên mạng xã hội. Phong trào ủng hộ doanh nghiệp xanh giúp quán đón thêm lượng lớn khách hàng có ý thức văn minh!'
      },
      {
        id: 'eco_discount_bring_box',
        label: 'Khuyến khích khách tự mang hộp cá nhân đến mua gà được giảm ngay 5.000đ/phần',
        subDesc: 'Bà con xóm hẻm hào hứng mang âu sứ hộp cơm sang mua gà thơm lừng',
        kicker: '🥣 MANG HỘP TẶNG GIẢM GIÁ',
        karmaDelta: { community: 35, craftsmanship: 20 },
        moneyDelta: 50000,
        reactionTitle: 'Nét Đẹp Ầu Cơm Xóm Hẻm',
        reactionNarrative: 'Hình ảnh bà con mang chiếc âu nhôm hay hộp thủy tinh sang mua gà nóng rẫy vừa thân thương vừa bảo vệ môi trường. Một nét đẹp văn hóa mới được hình thành.'
      },
      {
        id: 'eco_keep_cheap_plastic',
        label: 'Tiếp tục dùng hộp xốp nhựa rẻ tiền mặc kệ môi trường ô nhiễm',
        subDesc: 'Tiết kiệm chi phí trước mắt nhưng bị nhóm bạn trẻ môi trường tẩy chay',
        kicker: '🗑️ GIỮ HỘP XỐP TIẾT KIỆM',
        karmaDelta: { ambition: 15, community: -25, craftsmanship: -20 },
        moneyDelta: 50000,
        reactionTitle: 'Lựa Chọn Thực Dụng Ngắn Hạn',
        reactionNarrative: 'Quán tiết kiệm được chút chi phí bao bì nhưng mất điểm trầm trọng trong mắt thế hệ thực khách trẻ đang hướng tới lối sống xanh bền vững.'
      }
    ]
  },

  // 38. Kẻ Gian Cạy Cửa Cuốn Ban Đêm (Ngày 55)
  {
    id: 'inc_quiz_38_midnight_breakin',
    title: 'Kẻ Gian Dùng Xà Beng Cạy Cửa Cuốn Lúc Nửa Đêm',
    categoryTag: 'BÁO ĐỘNG AN NINH',
    icon: '🦹',
    characterName: 'Hai Tên Đạo Chích Đêm',
    characterAvatar: '🥷',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '🚨',
    characterRole: 'Kẻ Gian Chuyên Rình Rập',
    context: '2 giờ sáng, tiếng kim loại cọ xát ken két vang lên từ cửa cuốn phía trước, hai tên trộm bịt mặt đang dùng xà beng nạy ổ khóa két thu ngân.',
    dialogue: 'Nhanh lên thằng kia! Bẻ khóa lẹ lẹ hốt tiền trong két rồi lượn mau kẻo dân phòng đi tuần!',
    phaseTiming: 'morning',
    isSecurityRisk: true,
    minChapter: 4,
    minDay: 55,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 55: Tiếng ken két của thanh xà beng lúc 2 giờ sáng.',
    choices: [
      {
        id: 'breakin_guard_and_dog',
        label: 'Bảo vệ cùng Chó Cỏ Vàng sủa vang dội lao ra tóm gọn kẻ gian',
        subDesc: 'Bắt sống 2 tên trộm giao công an, được công an quận trao thưởng 1 triệu',
        kicker: '🐕 BẢO VỆ & CÚN CƯNG RA TAY',
        requiresSecurity: true,
        karmaDelta: { community: 40, ambition: 30 },
        moneyDelta: 1000000,
        reactionTitle: 'Lập Đại Công Tóm Gọn Đạo Chích',
        reactionNarrative: 'Chú bảo vệ cùng chú Chó Vàng dũng cảm lao ra quật ngã hai tên trộm tại trận. Cả xóm hẻm vỗ tay khen ngợi tinh thần cảnh giác tuyệt vời của tiệm gà!'
      },
      {
        id: 'breakin_alarm_siren',
        label: 'Kích hoạt còi báo động khẩn cấp hú vang kết nối đèn pha rọi sáng',
        subDesc: 'Hai tên trộm vứt đồ nghề bỏ chạy thục mạng, tài sản được bảo vệ 100%',
        kicker: '🚨 CÒI HÚ ĐÈN PHA',
        karmaDelta: { craftsmanship: 25, ambition: 20 },
        moneyDelta: 0,
        reactionTitle: 'Kẻ Gian Tháo Chạy Trong Hoảng Loạn',
        reactionNarrative: 'Còi báo động rú vang rền cùng dàn đèn pha rọi thẳng vào mặt khiến hai tên trộm hồn xiêu phách lạc, vứt cả xà beng leo lên xe máy phóng trối chết.'
      },
      {
        id: 'breakin_unprotected_loss',
        label: 'Quán không có bảo vệ, bị cạy két lấy mất tiền lẻ dằn túi',
        subDesc: 'Rủi ro thất bại: Mất 800.000đ trong két và hỏng bộ khóa cửa cuốn',
        kicker: '🔓 THIẾU BẢO VỆ ĐÊM',
        riskRate: 0.9,
        karmaDelta: { ambition: -20, community: -10 },
        moneyDelta: -800000,
        reactionTitle: 'Hú Vía Kẻ Trộm Tự Bỏ Đi',
        reactionNarrative: 'May mắn có tiếng còi xe tuần tra đi ngang làm chúng giật mình bỏ chạy trước khi kịp bẻ khóa thành công.',
        reactionFailureNarrative: 'Không có người trông coi, két thu ngân bị cạy phá lấy sạch 800.000đ tiền mặt và làm hỏng bộ ổ khóa cửa cuốn, tốn thêm 500k tiền sửa chữa.'
      }
    ]
  },

  // 39. Tài Trợ Giải Chạy Từ Thiện 'Vì Nụ Cười Em Thơ' (Ngày 58)
  {
    id: 'inc_quiz_39_charity_run_sponsorship',
    title: 'Tài Trợ Giải Chạy Marathon "Vì Nụ Cười Em Thơ"',
    categoryTag: 'TRÁCH NHIỆM XÃ HỘI',
    icon: '🏃',
    characterName: 'Bí Thư Đoàn Phường',
    characterAvatar: '🏃‍♂️',
    characterImg: charImg('char_26_traffic_hoang.png'),
    emoteBubble: '🏅',
    characterRole: 'Trưởng Ban Tổ Chức Marathon',
    context: 'UBND phường tổ chức giải marathon gây quỹ mổ tim cho trẻ em nghèo, ngỏ ý mời Tiệm Gà Nhà Tui tài trợ 100 suất ăn nhẹ và nước bù khoáng cho vận động viên.',
    dialogue: 'Sự hiện diện của thương hiệu tiệm gà sẽ tiếp thêm nguồn năng lượng tuyệt vời cho các chân chạy gây quỹ vì cộng đồng!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 58,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 58: Lá cờ marathon và những bước chạy vì nụ cười trẻ thơ.',
    choices: [
      {
        id: 'charity_sponsor_generous',
        label: 'Tài trợ 100 suất gà cuộn bắp cải thanh đạm & lập trạm tiếp nước miễn phí',
        subDesc: 'Tốn 400k, thương hiệu được vinh danh trên bảng vàng nhà tài trợ kim cương',
        kicker: '💖 TẤM LÒNG VÀNG VÌ CỘNG ĐỒNG',
        karmaDelta: { community: 50, craftsmanship: 25, ambition: 20 },
        moneyDelta: -400000,
        reactionTitle: 'Nụ Cười Rạng Rỡ Trên Đường Chạy',
        reactionNarrative: 'Hàng ngàn vận động viên về đích thưởng thức món gà cuộn thanh đạm thơm ngon. Logo Tiệm Gà Nhà Tui xuất hiện trang trọng trong phóng sự truyền hình thành phố!'
      },
      {
        id: 'charity_staff_run',
        label: 'Cùng toàn bộ nhân viên đăng ký chạy marathon và quyên góp tiền cá nhân',
        subDesc: 'Đội ngũ rèn luyện sức khỏe, tinh thần tập thể gắn kết bền chặt',
        kicker: '🏃‍♂️ CẢ ĐỘI XUẤT QUÂN',
        karmaDelta: { community: 35, craftsmanship: 20 },
        moneyDelta: -150000,
        reactionTitle: 'Bước Chạy Đoàn Kết Của Đại Gia Đình',
        reactionNarrative: 'Cả đội cùng nhau vượt qua cự ly 10km trong tiếng reo hò cổ vũ. Nụ cười rạng rỡ của từng thành viên chứng minh tinh thần gắn kết phi thường của quán.'
      },
      {
        id: 'charity_decline_tight',
        label: 'Từ chối với lý do ngân sách quý này đang eo hẹp',
        subDesc: 'Tiết kiệm chi phí nhưng bỏ lỡ cơ hội gắn kết với phong trào địa phương',
        kicker: '🚫 TỪ CHỐI TÀI TRỢ',
        karmaDelta: { community: -25, ambition: -10 },
        moneyDelta: 0,
        reactionTitle: 'Cơ Hội Gắn Kết Bị Bỏ Lỡ',
        reactionNarrative: 'Quán giữ lại được khoản tiền nhỏ nhưng mất đi cơ hội lan tỏa giá trị nhân văn đến hàng ngàn người dân trong khu vực.'
      }
    ]
  },

  // 40. MegaChicken Tung Chiến Dịch 'Combo Gà 19k' Hủy Diệt (Ngày 60)
  {
    id: 'inc_quiz_40_megachicken_price_dumping',
    title: 'MegaChicken Xả Lỗ Tung Combo 19k Hủy Diệt',
    categoryTag: 'TRẬN ĐÁNH QUYẾT TỬ',
    icon: '⚔️',
    characterName: 'Đại Diện MegaChicken Đối Diện',
    characterAvatar: '👔',
    characterImg: charImg('char_11_wholesale_nam.png'),
    emoteBubble: '💥',
    characterRole: 'Tổng Chỉ Huy Chiến Dịch Phá Giá',
    context: 'MegaChicken chi hàng chục tỷ bù lỗ, mở bán combo gà rán kèm nước chỉ 19.000đ ngay sát vách tiệm gà hòng bóp nghẹt doanh số các quán xung quanh.',
    dialogue: 'Tập đoàn lớn thừa tiền đốt lỗ 6 tháng để đuổi hết tiểu thương rời khỏi cuộc chơi. Liệu quán hẻm nhỏ có trụ nổi qua cơn bão này?',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 60,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 60: Biển quảng cáo combo 19k đỏ rực của tập đoàn MegaChicken.',
    choices: [
      {
        id: 'dumping_quality_loyalty',
        label: 'Kiên định giữ vững chất lượng thịt tươi giòn tan, tặng thêm canh gà lá giang gia truyền',
        subDesc: 'Khách ăn thử bên kia thấy thịt bở quay về với quán, nhận ra đẳng cấp khác biệt',
        kicker: '💎 ĐẲNG CẤP VƯỢT THỜI GIAN',
        karmaDelta: { craftsmanship: 50, community: 40, ambition: 30 },
        moneyDelta: 500000,
        reactionTitle: 'Chiến Thắng Của Giá Trị Thật',
        reactionNarrative: 'Gà giá rẻ công nghiệp thịt khô xác không thể nào so sánh với từng thớ thịt tươi mọng nước của Tiệm Gà Nhà Tui. Thực khách đồng loạt quay trở lại, khẳng định chân lý: Đẳng cấp là mãi mãi!'
      },
      {
        id: 'dumping_partner_local',
        label: 'Liên minh cùng các quán trong hẻm tạo combo "Gà Nhà Tui + Bánh Mì Bảy + Trà Đá"',
        subDesc: 'Sức mạnh tập thể Hẻm 1102 đánh bại chiến dịch xả lỗ của tập đoàn ngoại',
        kicker: '🤝 SỨC MẠNH LIÊN MINH XÓM HẺM',
        karmaDelta: { community: 45, ambition: 35 },
        moneyDelta: 300000,
        reactionTitle: 'Khúc Ca Thắng Lợi Của Xóm Hẻm',
        reactionNarrative: 'Cả con hẻm đồng lòng kết hợp tạo nên thực đơn phong phú hấp dẫn mà không chuỗi thức ăn nhanh nào bắt chước được. MegaChicken ngậm ngùi cắt giảm chiến dịch xả lỗ!'
      },
      {
        id: 'dumping_price_war',
        label: 'Đâm đầu đua hạ giá xuống 18k bán lỗ theo đối thủ',
        subDesc: 'Tiền vốn cạn kiệt nhanh chóng, suýt đẩy tiệm gà vào bờ vực phá sản',
        kicker: '📉 ĐUA GIÁ TỰ SÁT',
        karmaDelta: { ambition: -40, craftsmanship: -40, community: -20 },
        moneyDelta: -2000000,
        reactionTitle: 'Cơn Ác Mộng Cạn Kiệt Dòng Tiền',
        reactionNarrative: 'Đua vốn với tập đoàn nghìn tỷ là một sai lầm chết người. Kho quỹ hao hụt trầm trọng, buộc bạn phải dừng ngay chiến lược phá giá tự sát.'
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 5: ĐẾ CHẾ BISTRO & GIẢI GÀ VÀNG (NGÀY 61 - 120+) - 10 SỰ KIỆN
  // =========================================================================

  // 41. Giám Khảo Ẩn Danh Của Cẩm Nang Ẩm Thực Quốc Tế (Ngày 65)
  {
    id: 'inc_quiz_41_michelin_inspector',
    title: 'Giám Khảo Ẩn Danh Của Cẩm Nang Ẩm Thực Quốc Tế',
    categoryTag: 'ĐỈNH CAO THẾ GIỚI',
    icon: '⭐',
    characterName: 'Chuyên Gia Ẩm Thực Ẩn Danh',
    characterAvatar: '👵',
    characterImg: charImg('char_06_granny_ba.png'),
    emoteBubble: '✨',
    characterRole: 'Giám Khảo Quốc Tế Bí Mật',
    context: 'Một cụ bà phong thái tao nhã ngồi một mình ở góc bàn số 1, từ tốn dùng dao nĩa tách từng thớ thịt gà, ngửi mùi hương và ghi chép tỉ mỉ vào cuốn sổ da.',
    dialogue: 'Độ ẩm 72%, lớp vỏ giòn đạt chuẩn 1.8mm, tinh dầu hồi và quế thẩm thấu vừa vặn không lấn át vị ngọt của thịt gà đồi...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 65,
    rarity: 'epic',
    requiredStars: 4.5,
    unlockHint: 'Mở khóa ở Ngày 65 (yêu cầu >= 4.5 sao): Cuốn sổ da và ánh mắt uyên bác của vị giám khảo ẩn danh.',
    choices: [
      {
        id: 'michelin_humble_service',
        label: 'Phục vụ với phong thái khiêm nhường chuẩn mực, tôn trọng trải nghiệm riêng tư',
        subDesc: 'Được ghi danh vào Cẩm Nang Ẩm Thực Toàn Cầu hạng mục "Ngọc Quý Ẩn Mình"',
        kicker: '🌟 GHI DANH CẨM NANG TOÀN CẦU',
        karmaDelta: { craftsmanship: 50, ambition: 40, community: 20 },
        moneyDelta: 2000000,
        reactionTitle: 'Ngôi Sao Ẩm Thực Tỏa Sáng',
        reactionNarrative: 'Bài đánh giá 5 sao trên cẩm nang ẩm thực quốc tế ca ngợi Tiệm Gà Nhà Tui là "Viên ngọc ẩm thực đường phố sáng giá nhất Đông Nam Á". Du khách từ khắp nơi đổ về thưởng thức!'
      },
      {
        id: 'michelin_explain_philosophy',
        label: 'Sau bữa ăn, nhẹ nhàng trò chuyện chia sẻ về triết lý gia vị bản địa Việt Nam',
        subDesc: 'Vị chuyên gia xúc động trước tâm huyết người đầu bếp, viết bài phóng sự ca ngợi',
        kicker: '🌿 TRIẾT LÝ GIA VỊ BẢN ĐỊA',
        karmaDelta: { craftsmanship: 45, community: 30 },
        moneyDelta: 1000000,
        reactionTitle: 'Tri Âm Giữa Hai Tâm Hồn Ẩm Thực',
        reactionNarrative: 'Cuộc đàm đạo về thảo mộc và kỹ thuật ướp gà truyền thống chạm đến trái tim người sành ăn. Bạn đã đưa ẩm thực Việt Nam bước lên tầm cao mới.'
      },
      {
        id: 'michelin_bother_interview',
        label: 'Xông ra quấy rầy gặng hỏi thân phận và xin chụp ảnh PR rầm rộ',
        subDesc: 'Giám khảo khó chịu vì bữa ăn bị làm phiền, trừ điểm trải nghiệm dịch vụ',
        kicker: '📸 QUẤY RẦY THIẾU TINH TẾ',
        karmaDelta: { craftsmanship: -30, ambition: 15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Vội Vã Làm Mất Điểm Tinh Tế',
        reactionNarrative: 'Vị khách khẽ nhíu mày gấp cuốn sổ lại. Dù món ăn rất ngon nhưng sự vồn vã quá mức đã làm mất đi tính trang trọng của một bữa ăn đỉnh cao.'
      }
    ]
  },

  // 42. Quỹ Ngoại Định Giá 20 Tỷ Nhưng Đòi 51% Cổ Phần (Ngày 70)
  {
    id: 'inc_quiz_42_shark_investment_buyout',
    title: 'Quỹ Ngoại Đề Nghị 20 Tỷ Đổi Lấy 51% Quyền Biểu Quyết',
    categoryTag: 'BẢN LĨNH DOANH NHÂN',
    icon: '🦈',
    characterName: 'Shark Hoàng Quỹ Đầu Tư',
    characterAvatar: '👔',
    characterImg: charImg('char_10_winner_hung.png'),
    emoteBubble: '💰',
    characterRole: 'Cá Mập Đầu Tư Mạo Hiểm',
    context: 'Quỹ mạo hiểm đưa bản hợp đồng trị giá 20 tỷ đồng để mở 50 chi nhánh toàn quốc, nhưng yêu cầu nắm quyền kiểm soát 51% cổ phần và quyền thay đổi công thức cho rẻ tiền hơn.',
    dialogue: '20 tỷ trên bàn, anh lập tức thành triệu phú đô la! Chỉ cần anh giao con dấu và công thức cho chúng tôi tối ưu hóa chi phí!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 70,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 70: Bản hợp đồng định giá 20 tỷ đồng của quỹ đầu tư ngoại.',
    choices: [
      {
        id: 'shark_refuse_autonomy',
        label: 'Dứt khoát từ chối! Quán thuộc về Hẻm 1102 và linh hồn người thợ, không bán mình',
        subDesc: 'Bảo vệ toàn vẹn độc lập và phẩm giá, toàn thể nhân viên đồng lòng hô vang tự hào',
        kicker: '💎 ĐỘC LẬP TỰ CHỦ LÀ VÔ GIÁ',
        karmaDelta: { craftsmanship: 50, community: 40, ambition: -10 },
        moneyDelta: 0,
        reactionTitle: 'Bản Tuyên Ngôn Độc Lập Nơi Gian Bếp',
        reactionNarrative: 'Shark Hoàng sững sờ trước lời từ chối đanh thép: "Tiền của ông rất lớn, nhưng linh hồn của Tiệm Gà Nhà Tui là vô giá!" Toàn thể anh em trong bếp ôm nhau reo hò trong niềm kiêu hãnh khôn xiết.'
      },
      {
        id: 'shark_counter_offer',
        label: 'Đàm phán ngược: Chỉ bán 15% cổ phần không quyền biểu quyết, giữ 100% công thức',
        subDesc: 'Thu về 3 tỷ tiền mặt nâng cấp kho lạnh trung tâm mà vẫn nắm quyền sinh sát',
        kicker: '📈 NƯỚC CỜ ĐÀM PHÁN CAO TAY',
        karmaDelta: { ambition: 45, craftsmanship: 30 },
        moneyDelta: 3000000,
        reactionTitle: 'Thương Vụ Đầu Tư Thế Kỷ',
        reactionNarrative: 'Bản lĩnh thương trường giúp bạn chốt hạ thương vụ với những điều khoản có lợi nhất. Bạn vừa có thêm 3 tỷ tiền vốn mở rộng chuỗi vừa nắm chắc quyền kiểm soát tuyệt đối.'
      },
      {
        id: 'shark_sell_soul',
        label: 'Ký bán mình lấy 20 tỷ, chấp nhận để tập đoàn biến quán thành chuỗi công nghiệp vô hồn',
        subDesc: 'Tài khoản nhảy 20 tỷ nhưng mất đi quyền làm chủ, công thức bị pha tạp chất',
        kicker: '💸 BÁN LINH HỒN CHO TẬP ĐOÀN',
        karmaDelta: { ambition: 50, craftsmanship: -60, community: -50 },
        moneyDelta: 20000000,
        reactionTitle: 'Triệu Phú Đô La Trong Gian Bếp Lạnh Lẽo',
        reactionNarrative: 'Bạn trở thành triệu phú giàu có, nhưng chiếc bảng hiệu Tiệm Gà Nhà Tui giờ đây chỉ còn là một thương hiệu thương mại lạnh lùng, xa lạ với chính những người đã khai sinh ra nó.'
      }
    ]
  },

  // 43. Bác Ba Trao Cuốn Sổ Công Thức Gia Truyền 40 Năm (Ngày 75)
  {
    id: 'inc_quiz_43_heritage_recipe_scroll',
    title: 'Bác Ba Trao Cuốn Sổ Công Thức Gia Truyền 40 Năm',
    categoryTag: 'DI SẢN TRUYỀN ĐỜI',
    icon: '📜',
    characterName: 'Bác Ba Già Làng Hẻm',
    characterAvatar: '👵',
    characterImg: charImg('char_06_granny_ba.png'),
    emoteBubble: '📜',
    characterRole: 'Cội Nguồn Di Sản Hẻm 1102',
    context: 'Bác Ba tuổi đã cao, gọi bạn sang căn nhà cổ, run run mở chiếc tráp gỗ lim lấy ra cuốn sổ ố vàng ghi chép những công thức ướp gà thảo mộc cổ truyền của xứ Nam Kỳ.',
    dialogue: 'Cả đời bác giữ cuốn sổ này... Nay thấy cháu có tâm với nghề bếp, bác yên lòng trao lại cho cháu làm rạng danh ẩm thực nước mình...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 75,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 75: Chiếc tráp gỗ lim mở ra cuốn sổ công thức gia truyền 40 năm.',
    choices: [
      {
        id: 'heritage_reverent_study',
        label: 'Cung kính nhận cuốn sổ bằng hai tay, hứa chỉ dùng để phụng sự món ngon cho đời',
        subDesc: 'Mở khóa bí kíp gà ủ thảo mộc Nam Kỳ, nâng chất lượng món ăn lên đỉnh cao cảnh giới',
        kicker: '🙏 KẾ THỪA DI SẢN THIÊNG LIÊNG',
        karmaDelta: { craftsmanship: 50, community: 40 },
        moneyDelta: 0,
        reactionTitle: 'Ngọn Lửa Di Sản Được Trao Truyền',
        reactionNarrative: 'Những dòng chữ mực tím nắn nót ghi lại tinh hoa gia vị nửa thế kỷ trước như mở ra một chân trời mới. Nước mắt bác Ba rơi trên đôi tay bạn trong giây phút thiêng liêng.'
      },
      {
        id: 'heritage_free_community',
        label: 'Nấu một mẻ gà sốt tương mật cổ truyền chiêu đãi miễn phí cả khu hẻm',
        subDesc: 'Cả con hẻm xúc động sống lại hương vị tuổi thơ, tình thân thắt chặt bền lâu',
        kicker: '🍲 ĐẠI TIỆC TRI ÂN XÓM HẺM',
        karmaDelta: { community: 50, craftsmanship: 35 },
        moneyDelta: -200000,
        reactionTitle: 'Hương Vị Ký Ức Sống Dậy',
        reactionNarrative: 'Hương thơm của nồi sốt cổ truyền lan tỏa khắp các ngõ ngách. Những cụ già rưng rưng nhớ lại Sài Gòn xưa, tiếng cười nói chan hòa khắp con hẻm.'
      },
      {
        id: 'heritage_monetize_auction',
        label: 'Đem bán đấu giá cuốn sổ cổ cho nhà sưu tập lấy tiền mặt',
        subDesc: 'Thu về 20 triệu nhưng phụ bạc tấm lòng và niềm tin của bậc tiền bối',
        kicker: '💸 BÁN ĐỨNG DI SẢN TIỀN BỐI',
        karmaDelta: { ambition: 30, craftsmanship: -50, community: -50 },
        moneyDelta: 20000000,
        reactionTitle: 'Sự Bội Bạc Đắng Cay',
        reactionNarrative: 'Cuốn sổ cổ rơi vào tay nhà sưu tập tư nhân. Ánh mắt thất vọng tột cùng của bác Ba trở thành vết sẹo không bao giờ lành trong tâm khảm bạn.'
      }
    ]
  },

  // 44. Đại Tiệc Tất Niên Chiêu Đãi Cả Hẻm 1102 (Ngày 80)
  {
    id: 'inc_quiz_44_alley_mega_reunion',
    title: 'Đại Tiệc Tất Niên Chiêu Đãi Cả Con Hẻm 1102',
    categoryTag: 'NGHĨA TÌNH TRỌN VẸN',
    icon: '🏮',
    characterName: 'Toàn Thể Bà Con Hẻm 1102',
    characterAvatar: '👨‍👩‍👧‍👦',
    characterImg: charImg('char_31_gossip_tam.png'),
    emoteBubble: '🎉',
    characterRole: 'Đại Gia Đình Xóm Hẻm',
    context: 'Ngày cuối năm, quán dựng 10 dãy bàn dài dọc suốt con hẻm, khói chiên gà nghi ngút quyện cùng tiếng cười rộn rã của hàng trăm người từ già đến trẻ.',
    dialogue: 'Nhờ có tiệm gà mà cái hẻm này vui như hội quanh năm! Nâng ly chúc cho Tiệm Gà Nhà Tui mãi mãi phát đạt nghen con!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 80,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 80: Đèn lồng đỏ treo dọc 10 dãy bàn tiệc cuối năm.',
    choices: [
      {
        id: 'reunion_feast_allout',
        label: 'Đãi toàn bộ bà con ăn uống no nê 100% miễn phí & lì xì phong bao đỏ cho trẻ nhỏ',
        subDesc: 'Tốn 1.5 triệu, đỉnh cao tình thân xóm hẻm, đạt điểm tuyệt đối Karma Community',
        kicker: '🧧 HÀO SẢNG NGHĨA TÌNH HẺM',
        karmaDelta: { community: 50, craftsmanship: 30 },
        moneyDelta: -1500000,
        reactionTitle: 'Đêm Hội Huyền Diệu Hẻm 1102',
        reactionNarrative: 'Tiếng cười, tiếng cụng ly và ánh mắt ấm áp của bà con xóm hẻm tạo nên một bức tranh Sài Gòn đẹp tuyệt mỹ. Đây chính là đích đến viên mãn nhất của người làm kinh doanh!'
      },
      {
        id: 'reunion_talent_music',
        label: 'Tổ chức hội thi văn nghệ "Tiếng Hát Hẻm 1102" trao cúp vinh danh các nhân vật',
        subDesc: 'Không khí sôi động náo nức, gắn kết mọi thế hệ từ cụ già đến thanh thiếu niên',
        kicker: '🎤 TIẾNG HÁT XÓM HẺM',
        karmaDelta: { community: 45, ambition: 20 },
        moneyDelta: -500000,
        reactionTitle: 'Sân Khấu Âm Nhạc Rộn Rã Niềm Vui',
        reactionNarrative: 'Từ chú Hai bảo vệ đến bác Bảy bánh mì đều lên sân khấu hát vang những khúc ca rộn rã. Một đêm hội không thể nào quên của toàn thể cư dân Hẻm 1102.'
      },
      {
        id: 'reunion_charge_subsidized',
        label: 'Thu phụ phí tượng trưng 30k/người để bù đắp tiền nguyên liệu',
        subDesc: 'Mất đi sự hào sảng cuối năm, bà con cảm thấy quán bắt đầu tính toán chi li',
        kicker: '💵 THU PHÍ TƯỢNG TRƯNG',
        karmaDelta: { ambition: 15, community: -30 },
        moneyDelta: 500000,
        reactionTitle: 'Bữa Tiệc Kém Vui Vì Sự Tính Toán',
        reactionNarrative: 'Việc thu tiền biến một buổi họp mặt nghĩa tình thành một bữa tiệc thương mại gượng gạo. Sự hào sảng đặc trưng của Sài Gòn bị phai nhạt.'
      }
    ]
  },

  // 45. Đối Tác Mỹ Đặt Vấn Đề Đóng Chai Xuất Khẩu Sốt Bí Truyền (Ngày 85)
  {
    id: 'inc_quiz_45_export_sauce_deal',
    title: 'Đối Tác Mỹ Đề Xuất Xuất Khẩu Sốt Bí Truyền Sang California',
    categoryTag: 'VƯƠN RA BIỂN LỚN',
    icon: '🚢',
    characterName: 'Giám Đốc Xuất Khẩu Cali',
    characterAvatar: '✈️',
    characterImg: charImg('char_12_courier_ut.png'),
    emoteBubble: '🌎',
    characterRole: 'Cầu Nối Thương Mại Quốc Tế',
    context: 'Việt kiều Mỹ sở hữu chuỗi siêu thị Á Châu tại California bay về tận Sài Gòn, muốn đặt hàng 50.000 chai sốt chấm gà bí truyền xuất khẩu chính ngạch sang Mỹ.',
    dialogue: 'Bà con kiều bào bên kia thèm hương vị gà chiên mộc mạc quê nhà lắm. Hãy mang hồn cốt ẩm thực Việt ra biển lớn!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 85,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 85: Đơn đặt hàng 50.000 chai nước sốt xuất khẩu sang bờ Tây nước Mỹ.',
    choices: [
      {
        id: 'export_partner_fda',
        label: 'Đầu tư kiểm nghiệm đạt chuẩn FDA Hoa Kỳ, bảo chứng chất lượng vàng xuất khẩu',
        subDesc: 'Đơn hàng 50.000 chai xuất bến thành công, thu về 5 triệu tiền lãi và danh tiếng quốc tế',
        kicker: '🇺🇸 TIÊU CHUẨN VÀNG FDA',
        karmaDelta: { ambition: 50, craftsmanship: 40 },
        moneyDelta: 5000000,
        reactionTitle: 'Hương Vị Sài Gòn Cập Bến Nước Mỹ',
        reactionNarrative: 'Từng container nước sốt Tiệm Gà Nhà Tui cập cảng Long Beach trong sự mong đợi của hàng vạn kiều bào. Thương hiệu Việt tự hào vươn tầm thế giới!'
      },
      {
        id: 'export_protect_local',
        label: 'Từ chối vì sợ chất bảo quản công nghiệp làm phai nhạt hương vị tươi nguyên bản',
        subDesc: 'Giữ trọn vẹn sự tinh khiết thủ công, chỉ phục vụ trực tiếp cho khách tại quán',
        kicker: '🛡️ GIỮ TRỌN VỊ TƯƠI NGUYÊN BẢN',
        karmaDelta: { craftsmanship: 50, community: 25 },
        moneyDelta: 0,
        reactionTitle: 'Sự Kiên Định Với Hương Vị Tươi',
        reactionNarrative: 'Đối tác tiếc nuối nhưng vô cùng kính nể: "Anh là người đầu bếp có tâm nhất tôi từng gặp, thà bỏ tiền triệu đô chứ không chịu đánh đổi độ tươi ngon!"'
      },
      {
        id: 'export_cut_corners',
        label: 'Dùng hương liệu nhân tạo giá rẻ đóng chai để tối đa hóa lợi nhuận xuất khẩu',
        subDesc: 'Bị hải quan Mỹ kiểm nghiệm phát hiện hóa chất độc hại, phạt nặng và tịch thu',
        kicker: '❌ GIAN LẬN NGUYÊN LIỆU XUẤT KHẨU',
        karmaDelta: { ambition: -40, craftsmanship: -50 },
        moneyDelta: -3000000,
        reactionTitle: 'Thảm Họa Gian Lận Xuất Khẩu',
        reactionNarrative: 'Lô hàng bị chặn đứng tại cảng và tiêu hủy toàn bộ. Tai tiếng xuất khẩu hàng kém chất lượng làm tổn hại nghiêm trọng đến thể diện ẩm thực quốc gia!'
      }
    ]
  },

  // 46. Đội Ngũ Bếp Kiệt Sức Sau Chuỗi Ngày Bán Vượt Tải (Ngày 90)
  {
    id: 'inc_quiz_46_kitchen_fatigue_strike',
    title: 'Đội Ngũ Bếp Kiệt Sức Sau Chuỗi Ngày Bán Vượt Tải',
    categoryTag: 'PHÚC LỢI ĐỒNG ĐỘI',
    icon: '🛌',
    characterName: 'Đầu Bếp Khang Mệt Mỏi',
    characterAvatar: '👨‍🍳',
    characterImg: charImg('char_04_fryer_khang.png'),
    emoteBubble: '💤',
    characterRole: 'Đại Diện Tiếng Nói Đội Ngũ',
    context: 'Khách đông nườm nượp suốt 3 tháng liền khiến các đầu bếp và nhân viên phục vụ mắt thâm quầng, đôi tay rã rời, tinh thần bắt đầu căng thẳng.',
    dialogue: 'Anh em thương quán lắm nhưng tụi em sắp đứt hơi rồi anh ơi... Cứ thế này chắc cả đội lăn ra ốm mất...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 90,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 90: Đôi mắt thâm quầng và đôi bàn tay mỏi mệt sau chuỗi ngày cháy đơn.',
    choices: [
      {
        id: 'fatigue_retreat_spa',
        label: 'Cho toàn bộ quán nghỉ xả hơi 2 ngày, bao trọn gói chuyến du lịch biển Vũng Tàu',
        subDesc: 'Chi 1 triệu, nhân viên phục hồi 100% năng lượng, tinh thần cống hiến bùng cháy',
        kicker: '🏖️ NGHỈ DƯỠNG BIỂN XANH',
        karmaDelta: { community: 50, craftsmanship: 30, ambition: 20 },
        moneyDelta: -1000000,
        reactionTitle: 'Kỳ Nghỉ Vàng Nạp Lại Năng Lượng',
        reactionNarrative: 'Tiếng sóng biển và gió mát Vũng Tàu xua tan mọi mệt mỏi. Trở về sau chuyến đi, toàn đội bước vào gian bếp với nụ cười rạng rỡ và nguồn sinh lực dồi dào!'
      },
      {
        id: 'fatigue_hire_shift_cover',
        label: 'Tuyển thêm 3 nhân viên phụ việc chia ca & tăng phụ cấp làm thêm 30%',
        subDesc: 'Giảm tải áp lực tức thì, bộ máy vận hành nhẹ nhàng chuyên nghiệp',
        kicker: '👥 TĂNG CƯỜNG NHÂN LỰC',
        karmaDelta: { craftsmanship: 35, ambition: 25 },
        moneyDelta: -400000,
        reactionTitle: 'Bộ Máy Vận Hành Chuyên Nghiệp Mới',
        reactionNarrative: 'Các vị trí được bổ sung người hỗ trợ nhịp nhàng. Khang và Linh có thời gian nghỉ ngơi giữa ca, chất lượng từng đĩa gà được chăm chút kỹ lưỡng hơn bao giờ hết.'
      },
      {
        id: 'fatigue_push_more',
        label: 'Động viên suông "Cố lên vì tập thể" mà không tăng lương hay cho nghỉ ngơi',
        subDesc: 'Hai phụ bếp xin nghỉ việc ngay lập tức, quán thiếu người trầm trọng',
        kicker: '❌ BÓC LỘT ĐỘNG VIÊN SUÔNG',
        karmaDelta: { community: -40, craftsmanship: -30 },
        moneyDelta: 0,
        reactionTitle: 'Làn Sóng Bỏ Việc Vì Kiệt Sức',
        reactionNarrative: 'Lời hứa suông không thể xua đi nỗi mệt mỏi thể xác. Sự ra đi của những người thợ gắn bó là bài học đắt giá về việc chăm lo cho con người.'
      }
    ]
  },

  // 47. Thử Nghiệm Cánh Tay Robot Chiên Gà Tự Động (Ngày 95)
  {
    id: 'inc_quiz_47_robotic_fryer_showcase',
    title: 'Thử Nghiệm Cánh Tay Robot Chiên Gà Tự Động AI',
    categoryTag: 'CÔNG NGHỆ BẾP 4.0',
    icon: '🤖',
    characterName: 'Tiến Sĩ Robot ĐH Bách Khoa',
    characterAvatar: '👨‍🔬',
    characterImg: charImg('char_22_electrician_dung.png'),
    emoteBubble: '⚙️',
    characterRole: 'Kỹ Sư Công Nghệ Trí Tuệ Nhân Tạo',
    context: 'Viện nghiên cứu chế tạo cánh tay robot tích hợp cảm biến nhiệt AI, tự động nhấc giỏ chiên chính xác đến từng phần trăm giây, xin chạy thử tại bếp quán.',
    dialogue: 'Robot không biết mệt, không bị bỏng dầu và nhiệt độ luôn chuẩn tuyệt đối 175°C. Anh có muốn đưa tiệm gà bước vào kỷ nguyên 4.0?',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 95,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 95: Cánh tay kim loại sáng bóng của robot chiên gà tự động.',
    choices: [
      {
        id: 'robot_assist_human',
        label: 'Dùng robot hỗ trợ nhấc giỏ nặng nhọc, nêm ướp và cảm nhận vẫn do con người làm chủ',
        subDesc: 'Sự kết hợp hoàn hảo giữa công nghệ chính xác và trái tim người nghệ nhân',
        kicker: '🤝 GIAO THOA CÔNG NGHỆ & CON NGƯỜI',
        karmaDelta: { craftsmanship: 45, ambition: 40 },
        moneyDelta: -300000,
        reactionTitle: 'Đỉnh Cao Bếp Tương Lai',
        reactionNarrative: 'Robot đảm nhận khâu nhấc giỏ nặng và nóng, còn Khang tập trung toàn lực vào việc canh chỉnh gia vị và trang trí. Năng suất tăng gấp đôi mà cái hồn món ăn vẫn vẹn nguyên!'
      },
      {
        id: 'robot_pure_craft',
        label: 'Từ chối robot, trung thành tuyệt đối với đôi bàn tay và cảm xúc con người',
        subDesc: 'Khách hàng say mê tính thủ công độc bản, coi đây là đỉnh cao của nghệ thuật bếp',
        kicker: '💎 THỦ CÔNG ĐỘC BẢN',
        karmaDelta: { craftsmanship: 50, community: 30 },
        moneyDelta: 0,
        reactionTitle: 'Trái Tim Người Thợ Thắng Cỗ Máy Vô Hồn',
        reactionNarrative: 'Từng chuyển động của đôi bàn tay người thợ như một điệu múa nghệ thuật. Thực khách ngồi ngắm nhìn với sự ngưỡng mộ vô bờ bến đối với nghề thủ công truyền thống.'
      },
      {
        id: 'robot_replace_all_workers',
        label: 'Sa thải bớt thợ chiên để robot làm hết nhằm cắt giảm chi phí lương',
        subDesc: 'Cắt giảm được lương nhưng gian bếp trở nên lạnh lẽo, món ăn mất đi cái hồn',
        kicker: '🤖 TỰ ĐỘNG HÓA VÔ HỒN',
        karmaDelta: { ambition: 30, craftsmanship: -35, community: -45 },
        moneyDelta: 500000,
        reactionTitle: 'Gian Bếp Kim Loại Không Tiếng Cười',
        reactionNarrative: 'Cỗ máy kim loại thay thế con người làm việc chính xác nhưng lạnh lùng. Không khí ấm áp, rộn ràng tiếng cười nói quen thuộc của gian bếp xưa đã biến mất.'
      }
    ]
  },

  // 48. Đám Cưới Sao Showbiz Đặt 'Xô Gà Dát Vàng' (Ngày 100)
  {
    id: 'inc_quiz_48_celebrity_golden_bucket',
    title: 'Đám Cưới Cặp Sao Showbiz Đặt Xô Gà Phủ Bụi Vàng 24K',
    categoryTag: 'SỰ KIỆN THƯỢNG LƯU',
    icon: '✨',
    characterName: 'Quản Lý Cặp Đôi Showbiz',
    characterAvatar: '🕶️',
    characterImg: charImg('char_07_trendy_vy.png'),
    emoteBubble: '🌟',
    characterRole: 'Đại Diện Ngôi Sao Điện Ảnh',
    context: 'Cặp sao nổi tiếng showbiz tổ chức đám cưới riêng tư trên du thuyền sông Sài Gòn, muốn đặt 20 xô gà rán đặc biệt phủ bụi vàng thực phẩm 24K cho tiệc đêm.',
    dialogue: 'Giá cả không thành vấn đề! Chúng tôi cần sự độc bản, lộng lẫy và ngon đến mức khách VIP quốc tế phải trầm trồ!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 100,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 100: Chiếc thiệp cưới mạ vàng trên du thuyền sang trọng sông Sài Gòn.',
    choices: [
      {
        id: 'golden_charity_tie',
        label: 'Nhận đơn, sáng tạo món gà dát vàng & đề nghị trích 50% tiền tiệc lập quỹ học bổng Hẻm',
        subDesc: 'Thu về 3 triệu, quỹ học bổng ra đời giúp 10 em nhỏ nghèo được đến trường',
        kicker: '🌟 THƯỢNG LƯU HÒA CÙNG NHÂN VĂN',
        karmaDelta: { community: 50, craftsmanship: 45, ambition: 40 },
        moneyDelta: 3000000,
        reactionTitle: 'Đêm Tiệc Ánh Vàng Nghĩa Tình',
        reactionNarrative: 'Xô gà dát vàng thảo mộc tỏa sáng lộng lẫy trên du thuyền đêm. Nghĩa cử trích tiền tiệc lập quỹ học bổng được cặp sao và báo chí hết lời ca ngợi, lan tỏa hình ảnh tuyệt đẹp!'
      },
      {
        id: 'golden_gourmet_show',
        label: 'Trổ tài sáng tạo món gà giòn phủ vàng 24K đỉnh cao ẩm thực xa hoa',
        subDesc: 'Giới thượng lưu mê mẩn, thu về trọn vẹn 5 triệu tiền công và danh tiếng',
        kicker: '👑 ẨM THỰC THƯỢNG LƯU ĐỘC BẢN',
        karmaDelta: { craftsmanship: 45, ambition: 45 },
        moneyDelta: 5000000,
        reactionTitle: 'Tuyệt Tác Ẩm Thực Trên Sông Sài Gòn',
        reactionNarrative: 'Các vị khách VIP quốc tế trầm trồ trước sự hòa quyện giữa lớp da giòn phủ vàng lấp lánh và hương vị đậm đà Nam Bộ. Tên tuổi Tiệm Gà bước chân vào giới thượng lưu.'
      },
      {
        id: 'golden_decline_excess',
        label: 'Từ chối vì không muốn làm món ăn xa xỉ hào nhoáng xa rời triết lý bình dân',
        subDesc: 'Giữ vững hình ảnh quán ăn vì người lao động, không chạy theo xa hoa',
        kicker: '🛡️ TRUNG THÀNH VỚI BÌNH DÂN',
        karmaDelta: { community: 35, craftsmanship: 30, ambition: -20 },
        moneyDelta: 0,
        reactionTitle: 'Trái Tim Luôn Hướng Về Bình Dân',
        reactionNarrative: 'Bạn mỉm cười từ chối ánh vàng xa hoa để tiếp tục đứng bên chảo dầu phục vụ những người lao động bình dị. Một lựa chọn kiên định đầy khí chất!'
      }
    ]
  },

  // 49. Triệt Phá Đường Dây Làm Giả Sốt Gà Trên Sàn Thương Mại (Ngày 105)
  {
    id: 'inc_quiz_49_counterfeit_syndicate',
    title: 'Triệt Phá Đường Dây Làm Giả Sốt Gà Trên Sàn Thương Mại',
    categoryTag: 'BẢO VỆ CHỮ TÍN',
    icon: '⚖️',
    characterName: 'Trung Tá Nam Cảnh Sát Kinh Tế',
    characterAvatar: '👮‍♂️',
    characterImg: charImg('char_25_police_nam.png'),
    emoteBubble: '🚨',
    characterRole: 'Đội Trưởng Điều Tra Kinh Tế',
    context: 'Lực lượng chức năng phát hiện một kho hàng lậu đang sản xuất hàng ngàn chai nước sốt nhái thương hiệu Tiệm Gà Nhà Tui bằng hóa chất độc hại đem bán online.',
    dialogue: 'Chúng tôi đã bao vây kho xưởng làm giả. Cần đại diện thương hiệu đến phối hợp lập biên bản xử lý và giám định mẫu độc quyền!',
    phaseTiming: 'morning',
    isSecurityRisk: true,
    minChapter: 5,
    minDay: 105,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Ngày 105: Chiến dịch triệt phá xưởng làm giả nước sốt độc hại.',
    choices: [
      {
        id: 'counterfeit_press_action',
        label: 'Phối hợp xử lý tận gốc, họp báo công bố tem chống giả QR Code bảo mật',
        subDesc: 'Triệt phá ổ làm giả, bảo vệ sức khỏe người tiêu dùng, uy tín thương hiệu vững như bàn thạch',
        kicker: '🛡️ BẢO VỆ NGƯỜI TIÊU DÙNG TẬN CÙNG',
        karmaDelta: { craftsmanship: 50, ambition: 40, community: 35 },
        moneyDelta: -100000,
        reactionTitle: 'Chiến Thắng Của Chữ Tín Và Công Lý',
        reactionNarrative: 'Kho hàng lậu bị niêm phong tiêu hủy hoàn toàn. Buổi họp báo ra mắt tem chống giả công nghệ cao giúp người tiêu dùng cả nước hoàn toàn an tâm khi chọn mua sản phẩm chính hãng.'
      },
      {
        id: 'counterfeit_silent_settle',
        label: 'Nhận 50 triệu tiền bồi thường ngầm từ kẻ gian rồi ỉm đi không làm to chuyện',
        subDesc: 'Kiếm được món tiền lớn nhưng lương tâm cắn rứt vì để hàng độc hại tiếp tục lưu hành',
        kicker: '💸 THỎA HIỆP ĐỒNG TIỀN DƠ BẨN',
        karmaDelta: { ambition: 20, craftsmanship: -50, community: -50 },
        moneyDelta: 50000000,
        reactionTitle: 'Món Tiền Cắn Rứt Lương Tâm',
        reactionNarrative: 'Cầm trên tay món tiền thỏa hiệp ngầm, bạn không thể ngủ yên khi biết rằng ngoài kia vẫn có những người tiêu dùng có nguy cơ ăn phải thứ nước sốt độc hại.'
      },
      {
        id: 'counterfeit_ignore',
        label: 'Bỏ mặc vì nghĩ hàng giả trên mạng không ảnh hưởng gì tới quán bán trực tiếp',
        subDesc: 'Khách mua phải hàng giả ăn đau bụng quay sang chửi rủa quán',
        kicker: '❌ THỜ Ơ VÔ TRÁCH NHIỆM',
        karmaDelta: { community: -35, craftsmanship: -35 },
        moneyDelta: 0,
        reactionTitle: 'Hậu Quả Của Sự Vô Cảm',
        reactionNarrative: 'Sự thờ ơ khiến hàng giả tràn lan khắp nơi. Nhiều người ngộ độc thực phẩm quay sang tẩy chay cả thương hiệu chính hãng.'
      }
    ]
  },

  // 50. Trận Chung Kết Cúp Gà Vàng Sài Gòn Đỉnh Cao (Ngày 110)
  {
    id: 'inc_quiz_50_master_fried_chicken_championship',
    title: 'Trận Chung Kết Tranh Cúp Gà Vàng Sài Gòn',
    categoryTag: 'VINH QUANG ĐỈNH CAO',
    icon: '🏆',
    characterName: 'Chủ Tịch Hiệp Hội Ẩm Thực',
    characterAvatar: '👵',
    characterImg: charImg('char_06_granny_ba.png'),
    emoteBubble: '👑',
    characterRole: 'Trưởng Ban Giám Khảo Cúp Gà Vàng',
    context: 'Sân khấu chật kín 10.000 khán giả, Tiệm Gà Nhà Tui bước vào hiệp đấu chung kết tranh Chiếc Cúp Gà Vàng với các chuỗi nhà hàng quốc tế sừng sỏ nhất.',
    dialogue: 'Đêm nay, toàn bộ người dân Sài Gòn và bà con Hẻm 1102 đang dõi theo từng nhát dao, từng giọt dầu của bạn. Hãy nâng cao niềm tự hào ẩm thực Việt!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 5,
    minDay: 110,
    rarity: 'epic',
    requiredStars: 4.8,
    unlockHint: 'Mở khóa ở Ngày 110 (yêu cầu >= 4.8 sao): Đấu trường chung kết Cúp Gà Vàng danh giá nhất Sài Gòn.',
    choices: [
      {
        id: 'champion_master_creation',
        label: 'Trình diễn tuyệt kỹ chiên gà gia truyền kết hợp sốt me cốt dừa độc bản',
        subDesc: 'Đoạt Cúp Gà Vàng Tuyệt Đối, 10.000 khán giả đứng dậy reo hò rền vang cả cầu trường',
        kicker: '👑 NGÔI VƯƠNG ẨM THỰC SÀI GÒN',
        karmaDelta: { craftsmanship: 50, ambition: 50, community: 40 },
        moneyDelta: 10000000,
        reactionTitle: 'Khoảnh Khắc Đăng Quang Rực Rỡ',
        reactionNarrative: 'Ban giám khảo đồng loạt giơ điểm 10 tuyệt đối! Chiếc Cúp Gà Vàng danh giá nhất được nâng cao trong pháo hoa rực rỡ và tiếng reo hò của hàng vạn người. Bạn đã trở thành huyền thoại ẩm thực!'
      },
      {
        id: 'champion_dedicate_alley',
        label: 'Dành trọn vẹn chiến thắng tri ân Bác Ba, anh Khang, chị Linh và cả Hẻm 1102',
        subDesc: 'Bài phát biểu chạm đến trái tim hàng triệu người, nâng cúp trong nước mắt hạnh phúc',
        kicker: '❤️ CHIẾN THẮNG CỦA TÌNH NGHĨA',
        karmaDelta: { community: 50, craftsmanship: 45, ambition: 35 },
        moneyDelta: 5000000,
        reactionTitle: 'Chiếc Cúp Thuộc Về Những Con Người Chân Lấm Tay Bùn',
        reactionNarrative: 'Lời cảm ơn chân thành tới từng người quét rác, bác xe ôm của Hẻm 1102 làm cả hội trường lặng đi trong xúc động. Chiến thắng này không chỉ của riêng bạn, mà là của tình người Sài Gòn muôn đời!'
      },
      {
        id: 'champion_play_dirty',
        label: 'Lén bỏ thêm gia vị gây say vào phần thi của đối thủ để chắc thắng',
        subDesc: 'Bị camera giám sát phát hiện, tước quyền thi đấu và trục xuất khỏi hiệp hội',
        kicker: '❌ GIAN LẬN HÈN HẠ',
        karmaDelta: { craftsmanship: -60, ambition: -50, community: -50 },
        moneyDelta: -5000000,
        reactionTitle: 'Nỗi Nhục Nhã Muôn Đời Của Kẻ Gian Lận',
        reactionNarrative: 'Hành vi tiểu nhân bị phơi bày trên màn hình lớn trước 10.000 khán giả. Tên tuổi của bạn bị xóa sổ vĩnh viễn khỏi giới ẩm thực trong sự khinh miệt của công chúng.'
      }
    ]
  }
];
