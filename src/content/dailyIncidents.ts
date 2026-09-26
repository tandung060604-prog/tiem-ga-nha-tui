import { DailyIncident, NonEmpty } from '../types/game';

export const DAILY_INCIDENTS: NonEmpty<DailyIncident> = [
  // 1. Tiktoker xin review free
  {
    id: 'incident_tiktoker_free',
    title: 'Idol Tóp Tóp Xin Ăn Free Review',
    icon: '📱',
    characterName: 'Ben Lee',
    characterAvatar: '🤳',
    characterRole: 'Tiktoker 200k Follower',
    context: 'Một nam thanh niên tóc tai bóng bẩy, cầm cây chống rung và gắn micro thu âm bước vào tiệm với vẻ mặt tự tin.',
    dialogue: 'Anh chủ ơi, kênh em đang viral clip triệu view. Anh tài trợ cho em 1 Xô Gà Gia Đình đầy đủ sốt bơ tỏi với 2 ly kem, em quay clip đẩy quán anh lên xu hướng bảo đảm mai khách xếp hàng nghẹt hẻm luôn!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'tiktoker_free_accept',
        label: 'Tài trợ miễn phí trọn gói, còn tặng thêm 2 ly trà đào mát lạnh',
        kicker: '🌟 NẮM BẮT CƠ HỘI VIRAL',
        karmaDelta: { ambition: 15, community: -5 },
        moneyDelta: -55000,
        reactionTitle: 'Video Lên Xu Hướng Tóp Tóp!',
        reactionNarrative: 'Ben Lee quay góc cận cảnh miếng gà giòn rụm bốc khói rất đẹp mắt. Video cắn gà ròn tan đạt 50k tim trong đêm, hôm sau quán đón thêm nhiều bạn trẻ tò mò ghé ăn thử!'
      },
      {
        id: 'tiktoker_free_reject',
        label: 'Từ chối lịch sự: "Quán lấy công làm lời, xin phép bán đúng giá niêm yết"',
        kicker: '🔥 TÔN TRỌNG TAY NGHỀ',
        karmaDelta: { craftsmanship: 15, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vững Bản Lĩnh Người Làm Bếp',
        reactionNarrative: 'Ben Lee hơi bẽ bàng nhưng thấy thái độ tự tin, đàng hoàng của bạn nên vẫn móc ví gọi 1 phần gà giòn. Khi ăn thử miếng đầu tiên, cậu ta gật gù khen: "Gà giòn thật, không cần làm màu!".'
      },
      {
        id: 'tiktoker_free_snack',
        label: 'Tặng đĩa khoai lắc phô mai làm quen, gà rán vẫn tính tiền bình thường',
        kicker: '🤝 ĐỐI ĐÃI KHÉO LÉO',
        karmaDelta: { community: 10, craftsmanship: 5 },
        moneyDelta: -15000,
        reactionTitle: 'Hài Hòa Cả Đôi Đường',
        reactionNarrative: 'Vừa được ăn khoai lắc thơm phức miễn phí vừa được chủ tiệm vui vẻ tiếp chuyện, Ben Lee rất thích tính cách xởi lởi của bạn và quay một đoạn ngắn khen ngợi lòng mến khách của hẻm 1102.'
      }
    ]
  },

  // 2. Khách xin nợ rồi không quay lại (hoặc quay lại)
  {
    id: 'incident_debt_runner',
    title: 'Khách Vội Quên Ví Xin Ghi Nợ',
    icon: '💸',
    characterName: 'Anh Tuấn Thợ Mộc',
    characterAvatar: '🪵',
    characterRole: 'Khách Vãng Lai Vội Vã',
    context: 'Ăn xong hai miếng gà sốt cay và ly nước ngọt mát lạnh, vị khách vội vàng sờ khắp túi áo túi quần rồi toát mồ hôi gãi đầu ái ngại.',
    dialogue: 'Chết rồi em ơi! Nãy chạy giao bàn ghế gấp quá anh để quên bóp ở xưởng mộc, điện thoại lại sập nguồn tối thui. Cho anh ghi nợ 65k chiều anh quay lại gửi liền nha!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    choices: [
      {
        id: 'debt_trust',
        label: 'Cười tươi tin tưởng: "Dạ không sao anh ơi, lúc nào tiện ghé gửi em cũng được!"',
        kicker: '❤️ NGHĨA TÌNH HẺM SÂU',
        riskRate: 0.35, // 35% rủi ro khách quên luôn
        karmaDelta: { community: 15, ambition: -5 },
        moneyDelta: -65000,
        reactionTitle: 'Chữ Tín Đáng Giá Ngàn Vàng!',
        reactionNarrative: 'Đến chiều muộn, anh Tuấn quay lại thật! Anh không những gửi lại 65.000đ mà còn mua thêm 2 xô gà mang về cho thợ xưởng mộc cùng ăn, tấm tắc khen chủ tiệm sống có tình có nghĩa!',
        reactionFailureNarrative: 'Mấy ngày trôi qua, anh thợ mộc vội vã ấy đã một đi không trở lại. Coi như tiệm đãi một người lỡ đường một bữa gà ấm bụng!'
      },
      {
        id: 'debt_collateral',
        label: 'Giữ lại giấy tờ hoặc chiếc đồng hồ đeo tay cũ làm tin',
        kicker: '💼 KỶ CƯƠNG KINH DOANH',
        karmaDelta: { ambition: 10, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Tiền Bạc Phân Minh',
        reactionNarrative: 'Anh Tuấn hơi sượng mặt nhưng vẫn tháo chiếc đồng hồ gửi lại. Chiều hôm đó anh mang tiền sang chuộc, trả đủ tiền nhưng ánh mắt có phần xa cách.'
      },
      {
        id: 'debt_security_help',
        label: 'Nhờ Chú Bảo Vệ cho mượn củ sạc nhanh cắm điện thoại chuyển khoản ngay',
        kicker: '👮 CÓ BẢO VỆ TIỆM GÀ',
        requiresSecurity: true,
        karmaDelta: { community: 10, craftsmanship: 5 },
        moneyDelta: 65000,
        reactionTitle: 'Bảo Vệ Xử Lý Nhanh Nhẹn!',
        reactionNarrative: 'Chú Bảo Vệ liền rút ngay dây sạc dự phòng cho anh Tuấn cắm nhờ 2 phút. Máy lên nguồn, anh vui vẻ quét mã QR thanh toán gọn gàng và bắt tay cảm ơn chú bảo vệ nhiệt tình!'
      }
    ]
  },

  // 3. Quán đối thủ sai người đến thả ruồi vào dĩa
  {
    id: 'incident_rival_fly',
    title: 'Kẻ Lạ Mặt Thả Ruồi Vào Dĩa Gà',
    icon: '🪰',
    characterName: 'Gã Mắt Lươn',
    characterAvatar: '🕶️',
    characterRole: 'Kẻ Phá Rối Nặc Danh',
    context: 'Một gã đàn ông ngồi góc khuất lấm lét ngó nghiêng, rồi lén rút từ bao thuốc lá ra một con ruồi chết thả vào đĩa gà đang bốc khói, lập tức đập bàn la toáng lên!',
    dialogue: 'Trời ơi! Quán làm ăn dơ bẩn cỡ này hả? Gà rán có nguyên con ruồi to đùng! Đền tôi 500k tiền viện phí không tôi chụp hình bóc phốt lên mạng cho sập tiệm!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    choices: [
      {
        id: 'fly_security_bust',
        label: 'Chú Bảo Vệ tiến tới giữ tay, trích xuất camera góc quán',
        kicker: '👮 BẢO VỆ BẮT QUẢ TANG',
        requiresSecurity: true,
        karmaDelta: { community: 10, craftsmanship: 15 },
        moneyDelta: 0,
        reactionTitle: 'Lật Tẩy Kẻ Đê Hèn!',
        reactionNarrative: 'Chú Bảo Vệ đã để mắt tới gã từ lúc vào quán. Chú chỉ tay thẳng vào mắt kính của gã: "Camera góc kia quay rõ mồn một cảnh anh rút ruồi từ bao thuốc lá ra nhé!". Gã tái mặt, lủi thủi chuồn mất dạng giữa tiếng cười chê của thực khách!'
      },
      {
        id: 'fly_no_sec_pay',
        label: 'Bấm bụng đền 200.000đ cho êm chuyện để khách khác không hoảng sợ',
        kicker: '💸 NGẬM BỒ HÒN LÀM NGỌT',
        riskRate: 0.8,
        karmaDelta: { ambition: -10, craftsmanship: -5 },
        moneyDelta: -200000,
        reactionTitle: 'Thiệt Đơn Thiệt Kép',
        reactionNarrative: 'Vì không có người an ninh đối chất, bạn đành móc tiền túi đền cho gã để dập tắt ồn ào. Gã đắc chí đút túi tiền rồi hí hửng rời đi.',
        reactionFailureNarrative: 'Bạn vừa đền tiền xong thì gã vẫn lên mạng đăng một bài ẩn danh bịa đặt. Không có bảo vệ hay bằng chứng rõ ràng, quán bị mất oan một khoản tiền!'
      },
      {
        id: 'fly_scientific_proof',
        label: 'Mời khách vào xem chảo dầu sôi 180°C đối chất khoa học',
        kicker: '🔥 CHÂN LÝ LỬA VÀ DẦU',
        karmaDelta: { craftsmanship: 20, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Chân Tướng Rõ Ràng!',
        reactionNarrative: 'Bạn điềm tĩnh chỉ ra: "Dầu chiên ở 180°C, nếu ruồi rơi vào từ đầu thì cánh và thân đã cháy giòn tan từ lâu, không thể còn nguyên vẹn và tươi thế này được!". Khách xung quanh đồng thanh vỗ tay ủng hộ, kẻ phá rối xấu hổ trốn tiệt.'
      }
    ]
  },

  // 4. Chiêu trò chuyển khoản giả mạo
  {
    id: 'incident_fake_transfer',
    title: 'Khách Đưa Ảnh Chuyển Khoản Ảo',
    icon: '💳',
    characterName: 'Thanh Niên Điệu Đà',
    characterAvatar: '🕶️',
    characterRole: 'Khách Đi Xe Ga',
    context: 'Order đơn hàng mang về trị giá 150k, thanh niên nhanh tay giơ màn hình điện thoại chụp sẵn biên lai chuyển khoản giả trong chớp mắt rồi toan lên xe rồ ga phóng đi.',
    dialogue: 'Em chuyển khoản thành công rồi nha chị! Khác ngân hàng nên tin nhắn tiền về hơi trễ xíu đó, em đang vội đi họp sếp gọi quá!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    choices: [
      {
        id: 'fake_sec_stop',
        label: 'Chú Bảo Vệ giữ đuôi xe, mời kiểm tra thông báo ngân hàng nổi tiền',
        kicker: '👮 BẢO VỆ CHẶN BẮT',
        requiresSecurity: true,
        karmaDelta: { ambition: 10, community: 5 },
        moneyDelta: 150000,
        reactionTitle: 'Bảo Vệ Tỉnh Táo Tóm Gọn!',
        reactionNarrative: 'Chú Bảo Vệ đứng ngay cửa liền giơ tay chặn nhẹ: "Kìa bạn trẻ, ngồi uống ly trà đá chờ ngân hàng nổ chuông đã nhé!". Bị bắt thóp chiếc ảnh photoshop giờ giấc sai lệch, thanh niên ngượng chín mặt đành móc ví trả đủ tiền mặt!'
      },
      {
        id: 'fake_let_go',
        label: 'Tin người cho đi luôn vì sợ làm phiền khách vội',
        kicker: '⚠️ MAY RỦI THẢ TRÔI',
        riskRate: 0.65, // 65% là lừa đảo
        karmaDelta: { community: 5, ambition: -10 },
        moneyDelta: -150000,
        reactionTitle: 'Khách Chuyển Thật Sự!',
        reactionNarrative: 'Khoảng 10 phút sau chuông điện thoại reng "ting ting", tiền nổi thật do nghẽn mạng liên ngân hàng. Hú hồn một phen!',
        reactionFailureNarrative: 'Cả ngày không thấy tiền đâu, kiểm tra lại mới biết mã giao dịch là ảnh cắt ghép. Quán chịu mất trắng đơn hàng 150k coi như bài học cảnh giác!'
      },
      {
        id: 'fake_strict_policy',
        label: 'Yêu cầu mở app ngân hàng kiểm tra biến động lịch sử',
        kicker: '🛡️ NGUYÊN TẮC RÕ RÀNG',
        karmaDelta: { ambition: 10, craftsmanship: 5 },
        moneyDelta: 0,
        reactionTitle: 'Kiểm Tra Đúng Quy Trình',
        reactionNarrative: 'Thấy bạn cứng rắn yêu cầu mở app thật kiểm tra, thanh niên ấp úng viện cớ "quên mật khẩu ngân hàng" rồi lẳng lặng bỏ lại bịch gà chuồn mất.'
      }
    ]
  },

  // 5. Trộm rình bình gas ban đêm
  {
    id: 'incident_thief_gas',
    title: 'Kẻ Gian Rình Trộm Bình Gas Ban Đêm',
    icon: '🦹',
    characterName: 'Bóng Đen Lén Lút',
    characterAvatar: '🥷',
    characterRole: 'Kẻ Trộm Đêm',
    context: '21h30 chuẩn bị đóng cửa dọn quán, một bóng đen đội mũ trùm kín mặt lén lút tiếp cận góc đặt bình gas dự phòng và xô inox của tiệm.',
    dialogue: '(Tiếng lục lọi loảng xoảng trong đêm vắng... Bóng đen đang lăm lăm chiếc kìm cộng lực định cắt khóa xích bình gas...)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    choices: [
      {
        id: 'gas_sec_ambush',
        label: 'Chú Bảo Vệ phục kích sẵn, hô to quật ngã kẻ trộm',
        kicker: '👮 BẢO VỆ TÚM GỌN',
        requiresSecurity: true,
        karmaDelta: { community: 20, ambition: 10 },
        moneyDelta: 50000, // Tổ dân phố thưởng nóng
        reactionTitle: 'Bảo Vệ Lập Công Lớn!',
        reactionNarrative: 'Chú Bảo Vệ lao ra như một cơn lốc quật ngã tên trộm tại trận, bà con lối xóm cầm gậy gộc chạy ra vây bắt giao công an phường. Bác Ba tổ trưởng thưởng nóng cho tiệm vì giữ bình yên con hẻm!'
      },
      {
        id: 'gas_solo_chase',
        label: 'Cầm chảo chiên lao ra tri hô đuổi trộm một mình',
        kicker: '⚠️ LIỀU LĨNH TỰ THÂN',
        riskRate: 0.5,
        karmaDelta: { community: 10, ambition: 5 },
        moneyDelta: -300000,
        reactionTitle: 'Dũng Cảm Đuổi Trộm Thành Công!',
        reactionNarrative: 'Bạn vung chảo gõ mạnh vào thùng tôn kêu vang dội, tên trộm hoảng hốt vứt lại kìm cắt nhảy lên xe đồng bọn tẩu thoát!',
        reactionFailureNarrative: 'Tên trộm quá nhanh tay đã vác mất chiếc bình gas trị giá 300.000đ rồi phóng xe mất hút vào ngõ tối. Quán đành tốn tiền mua bình gas mới!'
      },
      {
        id: 'gas_lock_inside',
        label: 'Bấm còi báo động khẩn cấp và khóa chặt cửa trong',
        kicker: '🔒 AN TOÀN TRÊN HẾT',
        karmaDelta: { craftsmanship: 5, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Kẻ Trộm Hoảng Sợ Bỏ Chạy',
        reactionNarrative: 'Tiếng còi hú inh ỏi khiến kẻ gian giật mình tưởng động ổ, vội vàng leo rào bỏ chạy để lại hiện trường nguyên vẹn.'
      }
    ]
  },

  // 6. Bẻ khóa trộm xe máy khách
  {
    id: 'incident_bike_theft',
    title: 'Đạo Chích Bẻ Khóa Xe Máy Của Khách',
    icon: '🏍️',
    characterName: 'Tay Đua Nóng Xe',
    characterAvatar: '👺',
    characterRole: 'Kẻ Bẻ Khóa Chuyên Nghiệp',
    context: 'Giờ cao điểm tối, khách đang ăn gà rôm rả bên trong thì một đối tượng áp sát chiếc xe tay ga đắt tiền dựng trước quán, tay rút đoản chữ T chuẩn bị bẻ khóa.',
    dialogue: '(Két... Tiếng ổ khóa xe máy bị cấn mạnh dưới tán cây...)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    choices: [
      {
        id: 'bike_sec_catch',
        label: 'Chú Bảo Vệ quật gậy giữ xe, tóm gọn tên trộm tại trận',
        kicker: '👮 BẢO VỆ CHUYÊN NGHIỆP',
        requiresSecurity: true,
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 100000,
        reactionTitle: 'Khách Cảm Kích Tột Cùng!',
        reactionNarrative: 'Chú Bảo Vệ phản ứng cực nhanh, đạp văng chiếc xe máy của tên trộm khiến hắn ngã dúi dụi. Khách ăn gà chạy ra thấy xe mình còn nguyên vẹn mừng rớt nước mắt, tip ngay cho quán 100k và đăng bài khen ngợi nức nở trên mạng!'
      },
      {
        id: 'bike_no_sec_luck',
        label: 'Khách trong quán vô tình nhìn thấy qua cửa kính hô hoán',
        kicker: '⚠️ MAY RỦI NGẪU NHIÊN',
        riskRate: 0.55,
        karmaDelta: { community: -10, ambition: -10 },
        moneyDelta: -500000,
        reactionTitle: 'Kịp Thời Phát Giác!',
        reactionNarrative: 'Một vị khách vô tình nhìn ra cửa và hét lớn, tên trộm giật mình quăng đoản nhảy lên xe tẩu thoát trong gang tấc!',
        reactionFailureNarrative: 'Tên trộm bẻ khóa quá điêu luyện trong vòng 5 giây rồi rồ ga biến mất. Không có bảo vệ trông coi, quán phải hỗ trợ đền bù 500.000đ cho khách và nhận 1 sao thất vọng!'
      },
      {
        id: 'bike_shout_neighbors',
        label: 'Hô hoán cả hẻm 1102 cùng đổ ra tiếp ứng',
        kicker: '🏘️ SỨC MẠNH CỘNG ĐỒNG',
        karmaDelta: { community: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Cả Hẻm Đồng Lòng!',
        reactionNarrative: 'Nghe tiếng tri hô, bà con đầu ngõ ùa ra chặn kín hai đầu ngách. Tên trộm vứt xe chạy bộ thoát thân, chiếc xe của khách được bảo vệ an toàn!'
      }
    ]
  },

  // 7. Shipper làm rơi vỡ đơn hàng ngồi khóc
  {
    id: 'incident_shipper_spill',
    title: 'Shipper Làm Rơi Đơn Ngồi Bật Khóc',
    icon: '🛵',
    characterName: 'Chú Sáu Shipper',
    characterAvatar: '😢',
    characterRole: 'Tài Xế Công Nghệ Lớn Tuổi',
    context: 'Chú Sáu vấp phải gờ giảm tốc ngay trước cửa tiệm, thùng đồ ăn bung ra khiến 2 phần combo gà rán và nước ngọt đổ tung tóe xuống đường. Chú ngồi thụp xuống ôm đầu bất lực.',
    dialogue: 'Trời ơi là trời... Chạy từ sáng tới giờ chưa đủ tiền mua sữa cho cháu, giờ đền đơn này là mất trắng cả ngày công... App nó khóa tài khoản mất thôi con ơi...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'shipper_cook_free',
        label: 'Mời chú vào nghỉ, chiên lại toàn bộ đơn mới nóng hổi MIỄN PHÍ',
        kicker: '❤️ NGHĨA ĐỒNG BÀO SÀI GÒN',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: -10 },
        moneyDelta: -45000, // Chi phí vốn gà
        reactionTitle: 'Nụ Cười Rạng Rỡ Trong Nước Mắt',
        reactionNarrative: 'Bạn kéo chú vào quầy, rót ly nước sâm đá và bảo nhân viên làm lại mẻ gà mới giòn rụm trong 5 phút. Chú Sáu cảm động rơi nước mắt, chắp tay cảm ơn rối rít. Khách chứng kiến tấm lòng của bạn đều gật đầu tán thưởng!'
      },
      {
        id: 'shipper_split_cost',
        label: 'Hỗ trợ chia đôi 50% tiền vốn với chú shipper',
        kicker: '🤝 CHIA SẺ RỦI RO',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Mỗi Người Gánh Một Nửa',
        reactionNarrative: 'Chú Sáu vui vẻ gửi bạn một nửa tiền vốn và cảm ơn sự cảm thông của tiệm. Đơn hàng mới được làm nhanh chóng để chú kịp giao khách.'
      },
      {
        id: 'shipper_strict_app',
        label: 'Nhắc chú tự báo cáo sự cố rơi vỡ lên tổng đài ứng dụng',
        kicker: '📱 NGUYÊN TẮC QUY ĐỊNH',
        karmaDelta: { ambition: 15, community: -15 },
        moneyDelta: 0,
        reactionTitle: 'Giải Quyết Theo Thủ Tục',
        reactionNarrative: 'Chú Sáu gạt nước mắt gọi tổng đài app xin hủy chuyến theo quy định. Tiệm không bị tổn thất tiền bạc nhưng không khí trong bếp chùng xuống đôi chút.'
      }
    ]
  },

  // 8. Bà Năm xin dầu chiên cũ
  {
    id: 'incident_neighbour_oil',
    title: 'Bà Năm Xin Dầu Chiên Thải Về Bán Lại',
    icon: '👵',
    characterName: 'Bà Năm Ve Chai',
    characterAvatar: '👵',
    characterRole: 'Cụ Bà Hẻm 1102',
    context: 'Bà Năm xách chiếc can nhựa cũ sang trước giờ mở bán, ngỏ lời xin gom dầu chiên đã qua sử dụng của tiệm.',
    dialogue: 'Con ơi, dầu chiên thừa bên tiệm con có bán lại cho bà gom không? Mấy chỗ họ mua lại dầu cũ giá cao lắm, bà gom kiếm ít đồng mua thuốc khớp...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'oil_deny_and_gift',
        label: 'Từ chối vì sợ dầu bẩn quay lại đồ ăn, biếu bà 50k & hộp gà nóng',
        kicker: '🔥 ĐẠO ĐỨC NGHỀ BẾP & TÌNH THÂN',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: -50000,
        reactionTitle: 'Tấm Lòng Lương Thiện Của Chủ Tiệm',
        reactionNarrative: 'Bạn ân cần giải thích tiệm giao dầu cho đơn vị chế biến diesel sinh học để bảo vệ sức khỏe cộng đồng, rồi biếu bà 50.000đ cùng hộp gà nóng. Bà Năm xúc động chúc bạn buôn may bán đắt!'
      },
      {
        id: 'oil_give_freely',
        label: 'Cho bà toàn bộ can dầu cũ để bà kiếm thêm thu nhập',
        kicker: '⚠️ THỎA HIỆP KHÔNG NGUYÊN TẮC',
        karmaDelta: { community: 10, craftsmanship: -20 },
        moneyDelta: 30000,
        reactionTitle: 'Bà Năm Vui Vẻ Nhận Dầu',
        reactionNarrative: 'Bà Năm cảm ơn và xách can dầu đi. Dù giúp được bà một ít tiền nhưng trong lòng bạn cứ gợn lên nỗi lo về nguồn dầu bẩn trôi nổi.'
      },
      {
        id: 'oil_strict_reject',
        label: 'Lắc đầu dứt khoát: "Dầu tiệm con tự hủy, không cho ai được"',
        kicker: '💼 NGUYÊN TẮC CỨNG NHẮC',
        karmaDelta: { craftsmanship: 10, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vững Tiêu Chuẩn',
        reactionNarrative: 'Bà Năm lủi thủi quay về xe ve chai. Bạn bảo đảm được quy chuẩn nhưng ánh mắt bà cụ khiến bạn suy nghĩ mãi.'
      }
    ]
  },

  // 9. Chú nghệ sĩ già hát rong qua quán
  {
    id: 'incident_street_singer',
    title: 'Khúc Nhạc Trịnh Bên Mái Hiên Tiệm Gà',
    icon: '🎸',
    characterName: 'Nghệ Sĩ Ba Đờn',
    characterAvatar: '👨‍🦳',
    characterRole: 'Nghệ Sĩ Đường Phố',
    context: 'Một chú nghệ sĩ mù với cây đàn guitar sờn cũ đứng dưới bóng râm trước tiệm, gảy một đoạn nhạc khúc Trịnh Công Sơn làm nao lòng người qua đường.',
    dialogue: 'Hạt bụi nào hóa kiếp thân tôi... để một mai vươn hình hài lớn dậy... Xin gửi chút tiếng đàn bình an đến quán xá bà con...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'singer_treat_and_tip',
        label: 'Mời chú vào ghế mát, tặng đĩa gà nóng & gửi chú 30.000đ',
        kicker: '🎵 TRI ÂM ĐƯỜNG PHỐ',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: -30000,
        reactionTitle: 'Khoảnh Khắc Lắng Đọng Tâm Hồn',
        reactionNarrative: 'Chú Ba cười hiền hậu, ăn từng miếng gà giòn rụm rồi gảy tặng tiệm bản "Nắng Thủy Tinh" tuyệt mỹ. Khách ngồi ăn ai nấy đều lặng người xúc động, không khí quán ngập tràn sự bình yên hiếm có.'
      },
      {
        id: 'singer_play_for_guests',
        label: 'Nhờ chú đàn giao lưu 3 bài, khách thưởng tiền rôm rả',
        kicker: '✨ BẦU KHÔNG KHÍ ẤM ÁP',
        karmaDelta: { community: 15, ambition: 10 },
        moneyDelta: 0,
        reactionTitle: 'Mini Show Acoustic Tiệm Gà',
        reactionNarrative: 'Tiếng đàn mộc mạc biến quán gà thành một phòng trà thu nhỏ ấm cúng. Khách ủng hộ chú chiếc nón đầy tiền lẻ, ai cũng tấm tắc khen quán có gu!'
      },
      {
        id: 'singer_send_away',
        label: 'Tặng chú chai nước ngọt rồi nhẹ nhàng mời chú sang nơi khác',
        kicker: '🔇 GIỮ YÊN TĨNH',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: -8000,
        reactionTitle: 'Quán Giữ Sự Riêng Tư',
        reactionNarrative: 'Chú Ba nhận chai nước cám ơn rồi lặng lẽ bước đi. Không gian yên ắng trở lại để khách tập trung ăn uống.'
      }
    ]
  },

  // 10. Đổi vé số lấy gà rán cho trẻ cơ nhỡ
  {
    id: 'incident_kid_lottery',
    title: 'Đổi Vé Số Lấy Gà Rán Cho Hai Bé',
    icon: '🎟️',
    characterName: 'Bé Bo & Bé Bắp',
    characterAvatar: '🧒',
    characterRole: 'Trẻ Bán Vé Số Mùa Mưa',
    context: 'Trời đổ mưa rào, hai anh em bán vé số quần áo ướt mèm đứng nép dưới mái hiên tiệm gà, mắt dán chặt vào khay gà chiên sốt bơ tỏi thơm lừng.',
    dialogue: 'Anh ơi... tụi em còn 4 tờ vé số ế chưa bán được, đổi cho hai đứa em một miếng gà rán ăn cho đỡ lạnh bụng được không anh?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'kid_exchange_feast',
        label: 'Đổi 4 vé số lấy Combo Gà Rán + Khoai Lắc no nê',
        kicker: '❤️ NẤU BẰNG TẤM LÒNG',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: -5 },
        moneyDelta: -40000,
        reactionTitle: 'Bữa Ăn Hạnh Phúc Nhất Đời!',
        reactionNarrative: 'Hai đứa trẻ cầm miếng gà giòn nóng hổi, cắn rôm rốp mà mắt cười tít lại hạnh phúc. Đêm đó bạn dò vé số: trúng giải tám 100.000đ! Đúng là lộc trời ban cho người có tâm!'
      },
      {
        id: 'kid_gift_only',
        label: 'Tặng hai bé 2 đùi gà miễn phí, dặn giữ vé số bán tiếp lấy tiền',
        kicker: '🎁 CHO ĐI KHÔNG TOAN TÍNH',
        karmaDelta: { community: 20, ambition: -10 },
        moneyDelta: -30000,
        reactionTitle: 'Ấm Lòng Chiều Mưa Hẻm',
        reactionNarrative: 'Hai đứa nhỏ mừng rỡ cúi đầu cảm ơn rối rít rồi chia nhau ăn ngon lành dưới mái hiên. Tình người Sài Gòn luôn ấm áp như thế.'
      },
      {
        id: 'kid_refuse',
        label: 'Từ chối vì sợ trẻ em tụ tập đông trước cửa quán',
        kicker: '💼 KINH DOANH THỰC TẾ',
        karmaDelta: { ambition: 10, community: -20 },
        moneyDelta: 0,
        reactionTitle: 'Hai Đứa Trẻ Lặng Lẽ Rời Đi',
        reactionNarrative: 'Hai đứa nhỏ ôm xấp vé số ướt bước tiếp vào màn mưa. Bạn giữ được cửa tiệm gọn gàng nhưng đáy lòng thoáng chốc chùng xuống.'
      }
    ]
  },

  // 11. Đối thủ gạ mua bí quyết bột chiên 20 triệu
  {
    id: 'incident_rival_poach',
    title: 'MegaChicken Gạ Mua Công Thức 20 Triệu',
    icon: '💰',
    characterName: 'Đại Diện MegaChicken',
    characterAvatar: '👔',
    characterRole: 'Chuyên Viên Thu Mua Chuỗi Lớn',
    context: 'Một người đàn ông ăn mặc lịch thiệp đưa danh thiếp tập đoàn đồ ăn nhanh đối diện, đặt chiếc phong bì dày cộp lên bàn bạn.',
    dialogue: 'Bột chiên của tiệm bạn giữ độ giòn da gà cực tốt sau 40 phút. Chúng tôi gửi bạn 20.000.000đ tiền mặt để chuyển giao tỉ lệ pha bột. Bạn vẫn được bán nhưng không được đăng ký thương hiệu.',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 3,
    choices: [
      {
        id: 'poach_reject_pride',
        label: 'Kiên quyết từ chối: "Công thức là linh hồn của tiệm, tiền tỷ cũng không bán!"',
        kicker: '🔥 BẢN LĨNH NGHỆ NHÂN',
        karmaDelta: { craftsmanship: 25, community: 15, ambition: -10 },
        moneyDelta: 0,
        reactionTitle: 'Linh Hồn Không Thể Bán Đứng!',
        reactionNarrative: 'Đại diện MegaChicken lắc đầu tiếc nuối ra về. Bác Ba chứng kiến từ đầu cười vang: "Khá lắm con! Giữ được ngọn lửa của riêng mình thì chẳng sợ đế chế nào nuốt chửng!".'
      },
      {
        id: 'poach_take_cash',
        label: 'Cầm ngay 20.000.000đ tiền mặt để có vốn mở rộng tiệm lập tức',
        kicker: '🏢 CƠ HỘI LÀM GIÀU',
        karmaDelta: { ambition: 30, craftsmanship: -25, community: -15 },
        moneyDelta: 20000000,
        reactionTitle: 'Đổi Lấy Triệu Đồng',
        reactionNarrative: 'Túi tiền căng phồng 20 triệu giúp bạn nâng cấp mặt bằng tức thì. Nhưng ít hôm sau, chuỗi đối thủ bắt đầu tung ra món gà giống hệt tiệm bạn với giá rẻ mạt!'
      },
      {
        id: 'poach_fake_recipe',
        label: 'Giao công thức pha bột cơ bản trên mạng rồi lấy 10 triệu tiền cọc',
        kicker: '🦊 MẸO VẶT MA MÃNH',
        karmaDelta: { ambition: 15, craftsmanship: -15 },
        moneyDelta: 10000000,
        reactionTitle: 'Cú Lừa Ngoạn Mục',
        reactionNarrative: 'Bạn đút túi 10 triệu tiền cọc. Bên đối thủ hí hửng đem về thử nghiệm nhưng chiên lên bột vừa cứng vừa ngấy dầu, không bao giờ đạt được hương vị Tiệm Gà Nhà Tui!'
      }
    ]
  },

  // 12. Giang hồ vặt đòi phí bảo kê
  {
    id: 'incident_protection_racketeer',
    title: 'Đầu Gấu Đòi "Phí An Ninh Trật Tự"',
    icon: '🥋',
    characterName: 'Hải Búa Đầu Hẻm',
    characterAvatar: '🦹‍♂️',
    characterRole: 'Giang Hồ Vặt Xăm Trổ',
    context: 'Ba thanh niên xăm trổ ngồi rung đùi gác chân lên bàn, nói chuyện oang oang đòi thu tiền "an ninh".',
    dialogue: 'Quán làm ăn đông khách quá ta. Đầu hẻm này xe cộ phức tạp lắm đó, mỗi tháng gửi anh em 300k tiền nước non bảo kê xe cộ cho yên ổn nghen!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    choices: [
      {
        id: 'racketeer_sec_bust',
        label: 'Chú Bảo Vệ bước ra cùng đội cựu chiến binh đầu hẻm',
        kicker: '👮 BẢO VỆ CỨNG CỰA',
        requiresSecurity: true,
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Đầu Gấu Cụp Đuôi Chạy Lẹ!',
        reactionNarrative: 'Chú Bảo Vệ tiến lại vỗ vai Hải Búa: "Ủa Hải, mày mới ra trại hả con? Dám vào hẻm này quậy tiệm cháu tao à?". Nhận ra chú bảo vệ từng là công an khu vực uy tín, cả đám tái mét mặt xin lỗi rồi lủi mất tăm!'
      },
      {
        id: 'racketeer_call_police',
        label: 'Báo ngay cho Bác Ba Tổ Trưởng và Công An Phường xử lý',
        kicker: '⚖️ THƯỢNG TÔN PHÁP LUẬT',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Công An Phường Tới Kịp Thời',
        reactionNarrative: 'Chỉ 5 phút sau khi Bác Ba gọi điện, các chiến sĩ công an phường có mặt lập biên bản răn đe. Khu hẻm trở lại trật tự nghiêm minh.'
      },
      {
        id: 'racketeer_pay_quiet',
        label: 'Bấm bụng đưa 300.000đ cho êm ấm làm ăn',
        kicker: '💸 THỎA HIỆP YẾU THẾ',
        riskRate: 0.7,
        karmaDelta: { ambition: -10, community: -15 },
        moneyDelta: -300000,
        reactionTitle: 'Êm Ấm Tạm Thời',
        reactionNarrative: 'Cầm tiền xong chúng bỏ đi. Nhưng sự nhượng bộ này khiến bạn luôn bất an về những lần vòi vĩnh tiếp theo.',
        reactionFailureNarrative: 'Vừa đưa 300k xong, tuần sau chúng lại kéo thêm bạn bè tới đòi tăng lên 500k. Đúng là thỏa hiệp với kẻ xấu không bao giờ có hồi kết!'
      }
    ]
  },

  // 13. Trend bắt mắt: Gà Sốt Matcha Trân Châu Đường Đen
  {
    id: 'incident_food_trend_matcha',
    title: 'Khách Đòi Trend "Gà Sốt Matcha Trân Châu"',
    icon: '🍵',
    characterName: 'Nhóm Bạn Trẻ Bàn 4',
    characterAvatar: '👧',
    characterRole: 'GenZ Thích Trải Nghiệm Mới',
    context: 'Một nhóm học sinh giơ điện thoại hí hửng hỏi quán có làm món đang rần rần trên mạng xã hội không.',
    dialogue: 'Anh chủ ơi trên Tóp Tóp đang sốt món Gà Rán Nhúng Sốt Matcha Trân Châu Đường Đen kìa! Quán làm thử cho tụi em 3 dĩa ăn thử check-in với!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'trend_cash_grab',
        label: 'Bắt trend ngay lập tức, chế biến bán giá cao 89k/dĩa',
        kicker: '💸 TỐI ƯU TREND THỜI THƯỢNG',
        karmaDelta: { ambition: 20, craftsmanship: -15 },
        moneyDelta: 120000,
        reactionTitle: 'Hốt Bạc Nhờ Bắt Trend',
        reactionNarrative: 'Tụi nhỏ chụp hình đăng mạng nườm nượp kéo theo nhiều khách tò mò. Món ăn hơi dị nhưng quán kiếm được khoản lời đậm đà!'
      },
      {
        id: 'trend_stick_standard',
        label: 'Giữ vững chuẩn mực: "Gà tiệm anh chỉ phục vụ sốt cay bơ tỏi chuẩn vị!"',
        kicker: '🔥 ĐẲNG CẤP HƯƠNG VỊ',
        karmaDelta: { craftsmanship: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Thuyết Phục Bằng Chất Lượng Thật',
        reactionNarrative: 'Bạn mời nhóm thử đĩa Gà Sốt Mật Ong Bơ Tỏi chân ái. Cắn miếng gà giòn béo ngậy, các bạn trẻ gật gù: "Đúng là gà chuẩn vị ăn đứt mấy trend ăn xổi anh ơi!".'
      },
      {
        id: 'trend_trial_staff',
        label: 'Làm thử nội bộ cho nhân viên tiệm nếm thử đánh giá trước',
        kicker: '🧪 THỬ NGHIỆM THẬN TRỌNG',
        karmaDelta: { craftsmanship: 10, community: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Hội Đồng Bếp Lắc Đầu',
        reactionNarrative: 'Nhân viên nếm xong cười nghiêng ngả vì vị đắng chát của matcha không hợp với da gà rán. Tiệm quyết định giữ vững menu chuẩn chỉ.'
      }
    ]
  },

  // 14. Bỏ quên iPhone 15 Pro Max
  {
    id: 'incident_lost_iphone',
    title: 'Khách Bỏ Quên iPhone 15 Pro Max Trên Bàn',
    icon: '📱',
    characterName: 'Bé Linh Nhân Viên',
    characterAvatar: '👩',
    characterRole: 'Phục Vụ Bàn',
    context: 'Dọn dẹp bàn số 2 sau khi tốp khách văn phòng rời đi, nhân viên phát hiện chiếc iPhone đời mới trị giá 30 triệu nằm dưới kẽ ghế.',
    dialogue: 'Anh chủ ơi, khách bàn 2 bỏ quên chiếc điện thoại xịn đét này nè anh! Chuông đang reo liên tục có người gọi đến!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'iphone_return_prompt',
        label: 'Bắt máy liền, hẹn khách quay lại tiệm trao trả nguyên vẹn',
        kicker: '❤️ THẬT THÀ LÀ VỐN QUÝ',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 200000, // Khách hậu tạ
        reactionTitle: 'Chữ Tín Lan Tỏa Hẻm Sâu',
        reactionNarrative: 'Chủ nhân chiếc máy hớt hải chạy lại tiệm, mừng rỡ khi thấy tài sản còn nguyên vẹn. Khách cảm kích gửi tặng đội ngũ 200.000đ uống nước và viết bài review 5 sao ca ngợi sự tử tế của quán!'
      },
      {
        id: 'iphone_post_threads',
        label: 'Đăng bài lên Threads tìm chủ nhân kèm hình ảnh tiệm gà',
        kicker: '📢 TIẾP THỊ LAN TỎA',
        karmaDelta: { ambition: 15, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Bài Viết Viral Nổi Tiếng!',
        reactionNarrative: 'Bài đăng tìm người đánh rơi nhận được hàng nghìn lượt chia sẻ vì nghĩa cử đẹp. Khách tìm lại được máy, còn tiệm gà thì nổi tiếng khắp cõi mạng!'
      },
      {
        id: 'iphone_keep_silent',
        label: 'Cất vào tủ chờ khách tự nhớ ra quay lại đòi',
        kicker: '🤫 THỤ ĐỘNG CẨN THẬN',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Khách Quay Lại Nhận Đồ',
        reactionNarrative: 'Hôm sau khách mới nhớ ra quay lại hỏi. Bạn trả lại điện thoại an toàn nhưng khách vẫn hơi thắc mắc sao hôm qua gọi nhiều cuộc không thấy ai nghe máy.'
      }
    ]
  },

  // 15. Thách đấu Gà Cay Cấp Độ 7
  {
    id: 'incident_spicy_challenge',
    title: 'Thách Đấu Gà Siêu Cay Cấp Độ 7',
    icon: '🌶️',
    characterName: 'Streamer Khang Gà',
    characterAvatar: '🤠',
    characterRole: 'Thánh Ăn Cay Livestream',
    context: 'Một nam thanh niên bật livestream trước cửa tiệm, gạ chủ quán làm đĩa gà cay cấp độ xé họng để thử thách.',
    dialogue: 'Anh chủ có dám làm cho em 1 đĩa gà cay xé họng cấp 7 không? Nếu em ăn hết trong 5 phút mà không uống giọt nước nào, anh miễn phí bữa này và tặng em áo kỷ niệm nha!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'spicy_accept_milk',
        label: 'Nhận kèo, nấu sốt siêu cay nhưng chuẩn bị sẵn sữa tươi lạnh',
        kicker: '🌶️ VUI VẺ CHĂM SÓC KHÁCH',
        karmaDelta: { craftsmanship: 15, community: 10, ambition: 10 },
        moneyDelta: 50000,
        reactionTitle: 'Trận Chiến Cay Nồng Đầy Tiếng Cười',
        reactionNarrative: 'Khang ăn tới miếng thứ hai thì mắt đỏ hoe toát mồ hôi hột kêu trời. Bạn đưa ngay ly sữa tươi đá lạnh giải cứu kịp thời. Khán giả xem live cười ngất ngưởng, like thả tim ầm ầm!'
      },
      {
        id: 'spicy_refuse_health',
        label: 'Từ chối: "Quán nấu ăn để thưởng thức, không làm cay hại bao tử khách"',
        kicker: '🛡️ BẢO VỆ SỨC KHỎE KHÁCH',
        karmaDelta: { craftsmanship: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Lời Khuyên Có Tâm Của Người Nấu',
        reactionNarrative: 'Khang ngẫm lại thấy bạn nói rất có lý. Cậu tắt thử thách và gọi đĩa gà giòn sốt cay thông thường, ăn uống ngon lành và khen ngợi tư duy làm nghề chuẩn mực của bạn.'
      },
      {
        id: 'spicy_double_bet',
        label: 'Bắt cá cược: Nếu không ăn hết thì phải trả tiền gấp đôi!',
        kicker: '💼 SÁT PHẠT KINH DOANH',
        karmaDelta: { ambition: 20, community: -10 },
        moneyDelta: 100000,
        reactionTitle: 'Thua Cược Nộp Phạt',
        reactionNarrative: 'Khang bỏ cuộc ở phút thứ 3 vì quá cay, đành móc ví trả gấp đôi tiền đĩa gà. Bạn đút túi tiền lời nhưng Khang ôm bụng khó chịu rời quán.'
      }
    ]
  },

  // 16. Đơn tiệc đột xuất 50 phần
  {
    id: 'incident_corporate_catering',
    title: 'Công Ty Đối Diện Đặt Gấp 50 Hộp Gà',
    icon: '🏢',
    characterName: 'Chị Mai Trưởng Phòng',
    characterAvatar: '👩‍💼',
    characterRole: 'Khách Đặt Tiệc Đột Xuất',
    context: '16h30 chiều, chị trưởng phòng công ty tài chính chạy hớt hải sang tiệm gà thở không ra hơi.',
    dialogue: 'Em ơi cứu chị với! Công ty chị sếp tổng ghé đột xuất, cần ngay 50 phần gà rán khoai tây trong 40 phút nữa! Làm kịp chị gửi thêm 200k tiền bo!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    choices: [
      {
        id: 'catering_rush_all',
        label: 'Cả đội dốc toàn lực, bếp chiên hoạt động tối đa công suất',
        kicker: '⚡ THẦN TỐC TẬP TRUNG',
        karmaDelta: { ambition: 20, craftsmanship: 10 },
        moneyDelta: 450000, // Lợi nhuận lớn
        reactionTitle: 'Kỳ Tích 50 Hộp Gà Nóng Hổi!',
        reactionNarrative: 'Tất cả nhân viên phối hợp nhịp nhàng như một cỗ máy: người tẩm bột, người canh giỏ, người đóng hộp. Đúng 38 phút, 50 phần gà vàng ruộm thơm lừng được giao tận tay, sếp lớn công ty khen nức nở!'
      },
      {
        id: 'catering_refuse_quality',
        label: 'Từ chối: "40 phút làm 50 phần gà sẽ không kịp giòn chuẩn chất lượng"',
        kicker: '🔥 GIỮ CHẤT LƯỢNG MÓN',
        karmaDelta: { craftsmanship: 25, ambition: -15 },
        moneyDelta: 0,
        reactionTitle: 'Không Đánh Đổi Uy Tín',
        reactionNarrative: 'Chị Mai hơi tiếc nhưng hiểu bạn là người coi trọng chất lượng món ăn trên hết. Hôm sau chị đặt trước 1 ngày để tiệm chuẩn bị chu đáo nhất.'
      },
      {
        id: 'catering_split_batch',
        label: 'Thỏa thuận giao trước 25 phần nóng, 25 phần sau 15 phút',
        kicker: '🧠 LINH HOẠT THIỆN CHÍ',
        karmaDelta: { ambition: 15, craftsmanship: 10, community: 10 },
        moneyDelta: 350000,
        reactionTitle: 'Giải Pháp Vẹn Cả Đôi Đường',
        reactionNarrative: 'Công ty chia thành hai đợt tiệc vừa vặn, gà mang lên lúc nào cũng nóng giòn bỏng tay. Chị Mai cảm ơn sự linh hoạt tuyệt vời của quán!'
      }
    ]
  },

  // 17. Khách bơm hết bình tương ớt cá nhân
  {
    id: 'incident_sauce_hoarder',
    title: 'Vị Khách Bơm Đầy Bình Tương Mang Về',
    icon: '🍅',
    characterName: 'Bác Khách Tiết Kiệm',
    characterAvatar: '👨‍🦳',
    characterRole: 'Khách Nghiện Tương',
    context: 'Gọi 1 phần khoai tây chiên nhỏ 20k nhưng vị khách mang bình giữ nhiệt 1 lít ra quầy gia vị, lén bơm cạn sạch 2 bình tương ớt và tương cà cao cấp của tiệm.',
    dialogue: '(Tiếng bơm tương pịt pịt liên hồi... Hai chai tương đắt tiền sắp cạn đáy...)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    choices: [
      {
        id: 'sauce_sec_gentle',
        label: 'Chú Bảo Vệ bước tới tươi cười rót thêm tương, tặng gói tương nhỏ',
        kicker: '👮 BẢO VỆ LỊCH THIỆP',
        requiresSecurity: true,
        karmaDelta: { community: 15, craftsmanship: 10 },
        moneyDelta: -10000,
        reactionTitle: 'Ứng Xử Đỉnh Cao Của Bảo Vệ!',
        reactionNarrative: 'Chú Bảo Vệ tiến lại nhỏ nhẹ: "Dạ bác thích tương này tiệm con tặng bác 2 gói mang về nhé, để lại chút cho các cháu bàn sau ăn cùng nghen!". Bác khách ngượng ngùng buông tay, cảm ơn chú bảo vệ khéo léo.'
      },
      {
        id: 'sauce_call_out',
        label: 'To tiếng nhắc nhở trước mặt mọi người, đòi tính tiền tương 50k',
        kicker: '📢 CỨNG RẮN TRỪNG PHẠT',
        karmaDelta: { ambition: 10, community: -20 },
        moneyDelta: 50000,
        reactionTitle: 'Quán Rơi Vào Im Lặng Căng Thẳng',
        reactionNarrative: 'Bác khách xấu hổ đỏ mặt móc 50k ném lên bàn rồi bỏ đi. Dù đòi được tiền tương nhưng không khí quán ăn trở nên ngột ngạt khó chịu.'
      },
      {
        id: 'sauce_ignore_loss',
        label: 'Coi như của đi thay người, lặng lẽ châm thêm bình tương mới',
        kicker: '🤷 BẤM BỤNG BỎ QUA',
        karmaDelta: { community: 5, ambition: -5 },
        moneyDelta: -35000,
        reactionTitle: 'Chấp Nhận Thiệt Thòi',
        reactionNarrative: 'Bạn lẳng lặng mang bình tương mới ra thay. Vị khách hí hửng mang bình tương đầy ắp về nhà mà không biết chủ tiệm đã nhẫn nhịn nhường nào.'
      }
    ]
  },

  // 18. Mất điện giờ cao điểm
  {
    id: 'incident_blackout',
    title: 'Cúp Điện Đột Ngột Giữa Giờ Đông Khách',
    icon: '⚡',
    characterName: 'Bác Ba Tổ Trưởng',
    characterAvatar: '👴',
    characterRole: 'Tổ Trưởng Khu Phố',
    context: '19h00 tối, tiếng "bụp" ngoài trạm biến áp, cả con hẻm chìm vào bóng tối. Khách đang ngồi đông nghẹt bắt đầu nhốn nháo khi quạt và đèn vụt tắt.',
    dialogue: 'Đứt cáp đầu hẻm rồi con ơi! Thợ điện báo phải mất ít nhất 1 tiếng nữa mới nối xong. Quán tính sao đây?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'blackout_candles',
        label: 'Thắp nến trên từng bàn, mở nhạc điện thoại hát tặng khách',
        kicker: '🕯️ BIẾN NGUY THÀNH CƠ',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: 5 },
        moneyDelta: -20000, // Chi phí nến và nước ngọt tặng
        reactionTitle: 'Đêm Gà Rán Dưới Ánh Nến Lãng Mạn',
        reactionNarrative: 'Những ngọn nến lung linh bừng sáng. Bạn tặng mỗi bàn một ly nước mát và cùng nhân viên gảy đàn hát những khúc ca vui vẻ. Khách thích thú quay video check-in "Tiệm gà lãng mạn nhất Sài Gòn"!'
      },
      {
        id: 'blackout_generator',
        label: 'Kéo máy nổ dự phòng chạy tiếp bếp chiên',
        kicker: '⚡ ĐẦU TƯ BẢN LĨNH',
        karmaDelta: { ambition: 20, craftsmanship: 15 },
        moneyDelta: -50000, // Tiền xăng máy nổ
        reactionTitle: 'Bếp Vẫn Đỏ Lửa Trong Đêm',
        reactionNarrative: 'Máy nổ gầm vang, ánh đèn bật sáng trở lại. Mùi gà rán thơm lừng vẫn tỏa khắp con ngõ tối, đơn hàng vẫn ra đều đặn không gián đoạn phút nào!'
      },
      {
        id: 'blackout_refund_close',
        label: 'Xin lỗi thực khách, hoàn tiền các đơn dở và đóng cửa sớm',
        kicker: '🚪 NGHỈ NGƠI AN TOÀN',
        karmaDelta: { craftsmanship: 10, ambition: -15 },
        moneyDelta: -100000,
        reactionTitle: 'Một Tối Nghỉ Ngơi Sớm',
        reactionNarrative: 'Khách thông cảm nhận lại tiền và hẹn hôm khác quay lại. Đội ngũ nhân viên có một buổi tối hiếm hoi được nghỉ ngơi quây quần bên nhau.'
      }
    ]
  },

  // 19. Người yêu cũ dẫn bạn mới ghé quán
  {
    id: 'incident_ex_lover',
    title: 'Người Yêu Cũ Dẫn Người Mới Ghé Quán',
    icon: '💔',
    characterName: 'Ngọc Lan (Người Yêu Cũ)',
    characterAvatar: '💃',
    characterRole: 'Người Xưa Từng Chê Xe Đẩy',
    context: 'Bước vào quán là cô bạn gái cũ từng chia tay bạn vì "anh bán gà rán vỉa hè không có tiền đồ", nay đi cùng một anh chàng đi xe sang ăn mặc bảnh bao.',
    dialogue: 'Ủa... anh là chủ tiệm gà đông khách này hả? Em thấy rần rần trên mạng nên dắt bạn trai ghé ăn thử, không ngờ là quán của anh...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'ex_serve_perfect',
        label: 'Tự tay làm phần Gà Perfect đỉnh cao nhất, phục vụ chuyên nghiệp',
        kicker: '👑 PHONG THÁI BẢN LĨNH',
        karmaDelta: { craftsmanship: 20, ambition: 20, community: 10 },
        moneyDelta: 80000,
        reactionTitle: 'Đẳng Cấp Của Sự Trưởng Thành!',
        reactionNarrative: 'Đĩa gà vàng óng, da giòn rụm tỏa khói nghi ngút được bạn bưng ra với nụ cười tự tin, phong thái đĩnh đạc của một người làm chủ chân chính. Cả hai người họ ăn xong phải trầm trồ thán phục!'
      },
      {
        id: 'ex_extra_spicy',
        label: 'Bỏ gấp ba lượng bột ớt siêu cay cho bõ tức năm xưa!',
        kicker: '🌶️ TRẢ THÙ NGỌT NGÀO',
        karmaDelta: { ambition: 10, craftsmanship: -15 },
        moneyDelta: 50000,
        reactionTitle: 'Cay Đến Chảy Nước Mắt',
        reactionNarrative: 'Anh bạn trai ăn miếng đầu tiên mặt mày đỏ gay, uống cạn sạch 3 chai nước ngọt. Ngọc Lan biết bạn chơi khăm nhưng chỉ biết cười trừ rồi vội vã rời đi.'
      },
      {
        id: 'ex_hide_kitchen',
        label: 'Lánh mặt sau bếp để nhân viên phục vụ, tránh khó xử',
        kicker: '🙈 TRÁNH CHUYỆN THỊ PHI',
        karmaDelta: { community: 5, ambition: -10 },
        moneyDelta: 50000,
        reactionTitle: 'Giữ Khoảng Cách An Yên',
        reactionNarrative: 'Khách ăn xong tính tiền ra về êm thấu. Bạn đứng bên chảo dầu nhìn bóng lưng người xưa khuất dần, mỉm cười thanh thản vì mình đã đi được một chặng đường dài.'
      }
    ]
  },

  // 20. Gạ bán thịt gà đông lạnh lậu giá siêu rẻ
  {
    id: 'incident_cheap_meat_dealer',
    title: 'Lái Buôn Gạ Bán Thịt Gà Lậu Giá Rẻ Một Nửa',
    icon: '🍗',
    characterName: 'Cò Gà Đầu Mối',
    characterAvatar: '🕶️',
    characterRole: 'Tay Buôn Thực Phẩm Chui',
    context: 'Một tay buôn ghé quán sáng sớm thì thào gạ gẫm cung cấp nguồn thịt gà đông lạnh trôi nổi.',
    dialogue: 'Em trai, anh có mối gà đông lạnh xả hàng giá chỉ bằng 35% thị trường thôi. Bột chiên đậm đà tẩm vào là giòn rụm ai biết đâu mà lần, mỗi tháng bỏ túi thêm 15-20 triệu ngon ơ!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'meat_reject_proudly',
        label: 'Cự tuyệt thẳng thừng: "Tiệm chỉ dùng gà tươi kiểm dịch có nguồn gốc!"',
        kicker: '🔥 ĐẠO ĐỨC NGHỀ NGHIỆP TỐI THƯỢNG',
        karmaDelta: { craftsmanship: 25, community: 15, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Lương Tâm Người Làm Bếp Vững Vàng!',
        reactionNarrative: 'Tay buôn bĩu môi bỏ đi. Bạn ngẩng cao đầu chuẩn bị từng mẻ thịt gà tươi nguyên óng ả. Hương vị ngọt thơm tự nhiên từ gà tươi chính là bí quyết không đế chế nào sao chép được!'
      },
      {
        id: 'meat_buy_cheap',
        label: 'Ham lời nhập thử 1 thùng thịt giá rẻ để tối ưu lợi nhuận',
        kicker: '⚠️ CON ĐƯỜNG TỘI LỖI',
        karmaDelta: { ambition: 30, craftsmanship: -30, community: -25 },
        moneyDelta: 300000,
        reactionTitle: 'Hậu Quả Thịt Đông Lạnh Bở Nát',
        reactionNarrative: 'Thịt chiên lên bị ra nước, bở bùng bục và có mùi lạ. Khách quen ăn thử liền nhăn mặt chê bai, đánh tụt điểm sao của tiệm!'
      },
      {
        id: 'meat_report_authorities',
        label: 'Ghi lại biển số xe báo cho Đội Quản Lý Thị Trường',
        kicker: '⚖️ BẢO VỆ CỘNG ĐỒNG',
        karmaDelta: { community: 25, craftsmanship: 15 },
        moneyDelta: 100000, // Thưởng tin báo
        reactionTitle: 'Xóa Sổ Điểm Thực Phẩm Bẩn',
        reactionNarrative: 'Nhờ tin báo chuẩn xác của bạn, đội kiểm tra đã chặn đứng kho thịt bẩn tuồn ra thị trường. Cơ quan trao giấy khen cho tiệm vì ý thức trách nhiệm cao!'
      }
    ]
  },

  // 21. Bể ống nước sạch đầu hẻm
  {
    id: 'incident_water_outage',
    title: 'Bể Đường Ống Nước Sạch Đầu Hẻm',
    icon: '🚰',
    characterName: 'Bác Ba Tổ Trưởng',
    characterAvatar: '👴',
    characterRole: 'Tổ Trưởng Khu Phố',
    context: 'Xe tải cán vỡ đường ống nước máy đầu hẻm, toàn khu vực bị cắt nước sạch trong 5 tiếng đúng lúc tiệm đang cần rửa chén bát dồn dập.',
    dialogue: 'Cắt nước toàn hẻm tới tối muộn mới sửa xong nghen con! Nhà nào lo trữ nước nấu ăn đi!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'water_buy_purified',
        label: 'Chi tiền mua 10 bình nước khoáng 20L về rửa tiệt trùng chuẩn 5 sao',
        kicker: '🧼 VỆ SINH TUYỆT ĐỐI',
        karmaDelta: { craftsmanship: 20, community: 10 },
        moneyDelta: -120000,
        reactionTitle: 'Đẳng Cấp An Toàn Vệ Sinh',
        reactionNarrative: 'Chấp nhận tốn thêm tiền mua nước bình tinh khiết, từng chiếc khay, chiếc kẹp đều được rửa sạch bóng không tì vết. Khách thấy quán dùng nước lọc rửa đồ càng thêm tin tưởng bội phần!'
      },
      {
        id: 'water_use_stagnant',
        label: 'Múc nước tích trữ trong bể ngầm cũ dùng tạm cho tiết kiệm',
        kicker: '⚠️ TIẾT KIỆM NGUY CƠ',
        karmaDelta: { ambition: 10, craftsmanship: -15 },
        moneyDelta: 0,
        reactionTitle: 'Rửa Nước Lắng Cũ',
        reactionNarrative: 'Nước bể ngầm hơi ngả vàng khiến chén đĩa không được sạch bóng như thường ngày. Bạn tiết kiệm được ít tiền nhưng canh cánh nỗi lo vệ sinh.'
      },
      {
        id: 'water_takeaway_only',
        label: 'Tạm chuyển sang chỉ bán mang đi (hộp giấy), ngưng phục vụ tại bàn',
        kicker: '📦 LINH HOẠT THÍCH ỨNG',
        karmaDelta: { craftsmanship: 10, ambition: 5 },
        moneyDelta: -30000,
        reactionTitle: 'Giải Pháp Hộp Giấy Thông Minh',
        reactionNarrative: 'Toàn bộ đơn hàng được đóng gói trong hộp giấy thân thiện môi trường, vừa sạch sẽ vừa không tốn nước rửa chén!'
      }
    ]
  },

  // 22. Mèo hoang lạc vào bếp chiên
  {
    id: 'incident_cat_adopted',
    title: 'Bé Mèo Con Lạc Vào Gầm Quầy Giữ Nóng',
    icon: '🐱',
    characterName: 'Bé Mèo Mướp Con',
    characterAvatar: '🐾',
    characterRole: 'Khách Không Mời Dễ Thương',
    context: 'Một chú mèo mướp con ướt nhẹp, mắt tròn xoe ngơ ngác chui vào nấp dưới chân quầy giữ nhiệt, kêu meo meo thèm thuồng mùi gà.',
    dialogue: 'Meo... meooo... (Chú mèo nhỏ ngước đôi mắt long lanh nhìn bạn đầy cầu cứu...)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    choices: [
      {
        id: 'cat_adopt_mascot',
        label: 'Xé thịt gà luộc cho bé ăn, nhận nuôi làm "Linh Vật Chiêu Tài"',
        kicker: '💖 BÉ MÈO CHIÊU TÀI',
        karmaDelta: { community: 25, craftsmanship: 5 },
        moneyDelta: -20000, // Chi phí mua chuông và thức ăn
        reactionTitle: 'Linh Vật "Bé Bột" Của Tiệm Gà!',
        reactionNarrative: 'Được ăn no ấm áp, bé mèo quấn quýt nằm ngoan ngoãn trên ghế riêng trước cửa. Khách tới ăn ai cũng xúm lại nựng và chụp hình khoe lên Threads, tiệm gà bỗng nổi như cồn!'
      },
      {
        id: 'cat_gift_neighbor',
        label: 'Nhờ bà Năm hàng xóm nuôi giúp để đảm bảo tiêu chuẩn bếp',
        kicker: '🏡 GỬI GẮM YÊU THƯƠNG',
        karmaDelta: { community: 15, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Mái Ấm Cho Mèo Nhỏ',
        reactionNarrative: 'Bà Năm vui vẻ nhận bé mèo về bầu bạn cho đỡ quạnh quẽ. Thi thoảng bạn lại mang mẩu gà luộc sang thăm chú mèo mập mạp.'
      },
      {
        id: 'cat_chase_away',
        label: 'Xua đuổi đi nơi khác vì quy định nghiêm ngặt không nuôi thú cưng',
        kicker: '🚫 NGUYÊN TẮC CÔNG NGHIỆP',
        karmaDelta: { craftsmanship: 10, community: -15 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vệ Sinh Không Tì Vết',
        reactionNarrative: 'Bé mèo lủi thủi chạy sang hiên nhà khác. Gian bếp của bạn bảo đảm chuẩn vệ sinh công nghiệp nhưng nhân viên có chút tiếc nuối.'
      }
    ]
  },

  // 23. Cậu tân sinh viên xin rửa chén
  {
    id: 'incident_student_parttime',
    title: 'Cậu Tân Sinh Viên Xin Rửa Chén Kiếm Tiền Học',
    icon: '🎓',
    characterName: 'Minh (Sinh Viên Năm Nhất)',
    characterAvatar: '👦',
    characterRole: 'Cậu Trò Nghèo Đất Quê',
    context: 'Một cậu sinh viên rụt rè đứng trước cửa tiệm, áo sờn vai xin việc làm thêm buổi tối.',
    dialogue: 'Dạ anh/chị ơi... em mới ở quê lên nhập học, mẹ em dưới quê đang nằm viện. Quán có việc gì rửa chén hay lau bàn buổi tối không, trả em ít tiền cũng được ạ...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'student_hire_warm',
        label: 'Nhận vào phụ việc, trả lương tử tế và bao cơm gà nóng sốt',
        kicker: '❤️ NÂNG ĐỠ ƯỚC MƠ',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: 5 },
        moneyDelta: -50000,
        reactionTitle: 'Người Em Chăm Chỉ Của Tiệm',
        reactionNarrative: 'Minh làm việc cực kỳ siêng năng, rửa chén bát sạch bóng và nhanh thoăn thoắt. Mỗi tối tan ca được ăn đĩa cơm gà ấm áp, mắt cậu ánh lên niềm tin vào cuộc đời tươi đẹp.'
      },
      {
        id: 'student_gift_meal',
        label: 'Tặng phần gà ăn lấy sức và chỉ em sang tiệm trà sữa đầu ngõ đang tuyển',
        kicker: '🤝 GIÚP ĐỠ ĐÚNG NƠI',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Kết Nối Duyên Lành',
        reactionNarrative: 'Cậu bé cảm ơn ríu rít ăn hết phần gà rồi sang xin việc bên tiệm trà sữa thành công. Cậu luôn nhớ mãi ơn nghĩa của tiệm gà.'
      },
      {
        id: 'student_reject_full',
        label: 'Từ chối dứt khoát: "Quán anh đủ người rồi em ơi"',
        kicker: '💼 KINH DOANH LÝ TRÍ',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Cậu Bé Lặng Lẽ Rời Đi',
        reactionNarrative: 'Minh cúi chào rồi bước tiếp trên vỉa hè tìm việc. Công việc kinh doanh của bạn vẫn ổn định theo kế hoạch.'
      }
    ]
  },

  // 24. Tin đồn thất thiệt "Dầu bẩn ung thư"
  {
    id: 'incident_rumor_social',
    title: 'Bài Viết Bóc Phốt Ảo "Quán Dùng Dầu Đen Chiên Đi Chiên Lại"',
    icon: '📢',
    characterName: 'Tài Khoản Ẩn Danh',
    characterAvatar: '👻',
    characterRole: 'Nick Clone Phá Hoại',
    context: 'Một tài khoản nặc danh đăng lên nhóm khu phố Facebook bài viết vu khống quán chiên gà bằng dầu đen khét lẹt gây ung thư, thu hút nhiều bình luận hoang mang.',
    dialogue: '(Ảnh chụp chảo dầu cháy đen ở quán nào đó trên mạng ghép vào tên Tiệm Gà Nhà Tui...)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    choices: [
      {
        id: 'rumor_livestream_oil',
        label: 'Livestream công khai que đo dầu và quy trình thay dầu vàng óng',
        kicker: '🔥 MINH BẠCH BẰNG SỰ THẬT',
        karmaDelta: { craftsmanship: 25, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Thật Đánh Bại Mọi Tin Đồn!',
        reactionNarrative: 'Bạn bật livestream quay cận cảnh chảo dầu vàng trong vắt, dùng que thử test chuẩn ATTP trước hàng trăm người xem. Cư dân mạng quay sang chỉ trích kẻ bịa đặt và khen ngợi tiệm gà uy tín số 1!'
      },
      {
        id: 'rumor_invite_neighbors',
        label: 'Mời Bác Ba và ban quản trị khu phố ghé kiểm tra trực tiếp',
        kicker: '🏘️ BẢO CHỨNG BÀ CON HẺM',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Tiếng Nói Của Cả Khu Phố',
        reactionNarrative: 'Bác Ba cùng ban quản trị đích thân viết bài xác nhận tiệm luôn tuân thủ vệ sinh sạch sẽ bậc nhất khu vực. Tin đồn ác ý tan biến như bọt xà phòng!'
      },
      {
        id: 'rumor_ignore',
        label: 'Im lặng không quan tâm, tin rằng hữu xạ tự nhiên hương',
        kicker: '🤫 IM LẶNG LÀ VÀNG',
        karmaDelta: { ambition: -10, craftsmanship: 5 },
        moneyDelta: -50000, // Ảnh hưởng ít khách
        reactionTitle: 'Khách Hơi E Ngại Ban Đầu',
        reactionNarrative: 'Một số khách mới hơi chần chừ khi ghé ăn, nhưng khách quen trong hẻm vẫn ủng hộ nhiệt tình giúp tiệm vượt qua sóng gió.'
      }
    ]
  },

  // 25. Xô đại gia đình 10 người
  {
    id: 'incident_giant_bucket',
    title: 'Đại Gia Đình 10 Người Đòi Xô Gà Độc Bản',
    icon: '👨‍👩‍👧‍👦',
    characterName: 'Ông Sáu Trưởng Tộc',
    characterAvatar: '👴',
    characterRole: 'Đại Gia Đình Sum Vầy',
    context: 'Cả gia đình 3 thế hệ gồm ông bà, cha mẹ và 4 đứa nhỏ đi mừng thọ ghé tiệm muốn thưởng thức một bữa tiệc gà rán đáng nhớ.',
    dialogue: 'Tiệm có xô gà nào to bự đủ cho 10 người ăn mà có cả gà cay cho ba mẹ, gà ngọt cho tụi nhỏ và cháo gà nóng cho ông bà không cháu ơi?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    choices: [
      {
        id: 'giant_custom_craft',
        label: 'Sáng tạo Xô Đại Sum Vầy: đủ vị gà + súp nóng + tặng kem cho các bé',
        kicker: '👑 NGHỆ THUẬT PHỤC VỤ TẬN TÂM',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: 320000,
        reactionTitle: 'Bữa Tiệc Gia Đình Đại Viên Mãn!',
        reactionNarrative: 'Cả gia đình quây quần ấm cúng bên chiếc xô gà khổng lồ rực rỡ sắc màu. Ông bà khen súp thơm ngọt, tụi nhỏ liếm ngón tay khen gà giòn rụm. Cả nhà chụp bức ảnh kỷ niệm tuyệt đẹp trước tiệm!'
      },
      {
        id: 'giant_standard_combos',
        label: 'Tư vấn gọi 3 combo tiêu chuẩn có sẵn trong menu',
        kicker: '📋 QUY CHUẨN MENU',
        karmaDelta: { ambition: 15, craftsmanship: 5 },
        moneyDelta: 250000,
        reactionTitle: 'Phục Vụ Đúng Chuẩn',
        reactionNarrative: '3 phần combo được dọn ra nhanh chóng. Cả nhà ăn uống vui vẻ theo đúng thực đơn niêm yết.'
      },
      {
        id: 'giant_add_surcharge',
        label: 'Nhận làm theo yêu cầu nhưng phụ thu 20% phí bàn đông',
        kicker: '💼 TỐI ƯU DOANH THU',
        karmaDelta: { ambition: 20, community: -15 },
        moneyDelta: 380000,
        reactionTitle: 'Thu Đậm Nhưng Kém Ấm Cúng',
        reactionNarrative: 'Gia đình thanh toán đủ tiền nhưng người lớn có phần phàn nàn vì khoản phụ thu bất ngờ. Bữa ăn mất đi một chút vị ngọt ngào.'
      }
    ]
  }
];

export function getIncidentById(id: string): DailyIncident | undefined {
  return DAILY_INCIDENTS.find(inc => inc.id === id);
}
