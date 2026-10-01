import { DailyIncident, NonEmpty } from '../types/game';
import { EXPANDED_DAILY_INCIDENTS } from './dailyIncidentsExpanded';

/**
 * HỆ THỐNG 78 SỰ KIỆN TÌNH HUỐNG & QUIZ HẺM 1102 (ĐỜI THƯỜNG, DRAMA & BẮT TREND)
 * Phân tầng theo 5 Giai Đoạn Tiến Độ:
 *  - Giai đoạn 1 (Chương 1, Ngày 2–7): Xe Đẩy Vỉa Hè Mộc Mạc
 *  - Giai đoạn 2 (Chương 2, Ngày 8–18): Căn Nhà Số 14 Trong Hẻm & Khách Trẻ
 *  - Giai đoạn 3 (Chương 3, Ngày 19–35): Mặt Tiền Phố Lớn & Đối Thủ Cạnh Tranh
 *  - Giai đoạn 4 (Chương 4, Ngày 36–60): Cuộc Chiến MegaChicken & Bản Lĩnh Triệu Đô
 *  - Giai đoạn 5 (Chương 5, Ngày 61–120+): Đế Chế Bistro & Cúp Gà Vàng Sài Gòn
 */
const BASE = import.meta.env?.BASE_URL ?? '/';
const charImg = (name: string) => `${BASE}assets/characters/${name}`;

export const BASE_DAILY_INCIDENTS: DailyIncident[] = [
  // =========================================================================
  // GIAI ĐOẠN 1: KHỞI NGHIỆP XE ĐẨY VỈA HÈ (CHƯƠNG 1, NGÀY 2 - 7)
  // =========================================================================

  // 1. Mèo hoang lạc vào bếp (Ngày 2)
  {
    id: 'incident_cat_adopted',
    title: 'Bé Mèo Con Lạc Vào Chân Xe Đẩy',
    categoryTag: 'LINH VẬT CHIÊU TÀI',
    icon: '🐱',
    characterName: 'Bé Mèo Mướp Con',
    characterAvatar: '🐾',
    characterImg: charImg('pet_02_cat_muop.png'),
    emoteBubble: '🐾',
    characterRole: 'Khách Không Mời Dễ Thương',
    context: 'Một chú mèo mướp con ướt nhẹp, mắt tròn xoe ngơ ngác chui vào nấp dưới chân xe đẩy gà, kêu meo meo thèm thuồng mùi thịt giòn.',
    dialogue: 'Meo... meooo... (Chú mèo nhỏ ngước đôi mắt long lanh nhìn bạn cầu cứu...)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 2,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 2: Một vị khách bốn chân bé nhỏ bất ngờ ghé thăm xe đẩy.',
    choices: [
      {
        id: 'cat_adopt_mascot',
        label: 'Nhận nuôi làm Linh Vật Chiêu Tài',
        subDesc: 'Tốn 20k thịt gà luộc, khách bu lại cưng nựng chụp hình đăng Threads',
        kicker: '💖 BÉ MÈO CHIÊU TÀI',
        karmaDelta: { community: 25, craftsmanship: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Linh Vật "Bé Bột" Của Tiệm Gà!',
        reactionNarrative: 'Được ăn no ấm áp, bé mèo quấn quýt nằm ngoan ngoãn trên chiếc ghế riêng đầu ngõ. Khách tới ăn ai cũng xúm lại nựng và chụp hình khoe lên Threads, tiệm gà vỉa hè bỗng nổi như cồn!'
      },
      {
        id: 'cat_gift_neighbor',
        label: 'Gửi bà Năm hàng xóm nuôi giùm',
        subDesc: 'Giữ gian bếp sạch bóng tiệt trùng, bà Năm có bạn già đỡ quạnh quẽ',
        kicker: '🏡 GỬI GẮM YÊU THƯƠNG',
        karmaDelta: { community: 15, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Mái Ấm Cho Mèo Nhỏ',
        reactionNarrative: 'Bà Năm vui vẻ nhận bé mèo về bầu bạn cho đỡ quạnh quẽ. Thi thoảng bạn lại mang mẩu gà luộc sang thăm chú mèo mập mạp.'
      },
      {
        id: 'cat_chase_away',
        label: 'Xua đuổi dứt khoát khỏi gian bếp',
        subDesc: 'Tuân thủ nghiêm ngặt nguyên tắc vệ sinh, nhân viên có chút tiếc nuối',
        kicker: '🚫 NGUYÊN TẮC BẾP',
        karmaDelta: { craftsmanship: 10, community: -15 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vệ Sinh Tuyệt Đối',
        reactionNarrative: 'Bé mèo lủi thủi chạy sang hiên nhà khác. Gian bếp của bạn bảo đảm chuẩn vệ sinh nhưng nhân viên có chút tiếc nuối.'
      }
    ]
  },

  // 2. Chú nghệ sĩ già hát rong (Ngày 2)
  {
    id: 'incident_street_singer',
    title: 'Khúc Nhạc Trịnh Bên Mái Hiên Tiệm Gà',
    categoryTag: 'NGHỆ SĨ ĐƯỜNG PHỐ',
    icon: '🎸',
    characterName: 'Nghệ Sĩ Ba Đờn',
    characterAvatar: '👨‍🦳',
    characterImg: charImg('char_09_buyer_tam.png'),
    emoteBubble: '🎵',
    characterRole: 'Nghệ Sĩ Guitar Hẻm 1102',
    context: 'Một chú nghệ sĩ mù với cây đàn guitar sờn cũ đứng dưới bóng râm trước xe đẩy, gảy một đoạn khúc Trịnh Công Sơn làm nao lòng người qua đường.',
    dialogue: 'Hạt bụi nào hóa kiếp thân tôi... để một mai vươn hình hài lớn dậy... Xin gửi chút tiếng đàn bình an đến quán xá bà con...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 2,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 2: Tiếng đàn guitar mộc mạc ghé qua đầu ngõ.',
    choices: [
      {
        id: 'singer_treat_and_tip',
        label: 'Mời chú vào ghế mát, tặng gà & biếu 30k',
        subDesc: 'Chú Ba xúc động đàn khúc "Nắng Thủy Tinh", khách lặng người lắng nghe',
        kicker: '🎵 TRI ÂM ĐƯỜNG PHỐ',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: -30000,
        reactionTitle: 'Khoảnh Khắc Lắng Đọng Tâm Hồn',
        reactionNarrative: 'Chú Ba cười hiền hậu, ăn từng miếng gà giòn rụm rồi gảy tặng tiệm bản "Nắng Thủy Tinh" tuyệt mỹ. Khách ngồi ăn ai nấy đều lặng người xúc động, không khí quán ngập tràn sự bình yên hiếm có.'
      },
      {
        id: 'singer_play_for_guests',
        label: 'Nhờ chú đàn giao lưu 3 bài',
        subDesc: 'Xe gà biến thành góc acoustic ấm cúng, khách thưởng tiền rôm rả (+35k tiền boa)',
        kicker: '✨ BẦU KHÔNG KHÍ ẤM ÁP',
        karmaDelta: { community: 15, ambition: 10 },
        moneyDelta: 35000,
        reactionTitle: 'Mini Show Acoustic Tiệm Gà',
        reactionNarrative: 'Tiếng đàn mộc mạc biến xe đẩy gà thành một góc hòa nhạc thu nhỏ ấm cúng. Khách ủng hộ chú chiếc nón đầy tiền lẻ, ai cũng tấm tắc khen quán có gu!'
      },
      {
        id: 'singer_send_away',
        label: 'Tặng chai nước ngọt & mời đi nơi khác',
        subDesc: 'Mất 8k nước sâm, giữ không gian yên tĩnh tuyệt đối cho khách ăn',
        kicker: '🔇 GIỮ YÊN TĨNH',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: -8000,
        reactionTitle: 'Quán Giữ Sự Riêng Tư',
        reactionNarrative: 'Chú Ba nhận chai nước cám ơn rồi lặng lẽ bước đi. Không gian yên ắng trở lại để khách tập trung ăn uống.'
      }
    ]
  },

  // 3. Bà Năm ve chai xin dầu chiên cũ (Ngày 3)
  {
    id: 'incident_neighbour_oil',
    title: 'Bà Năm Xin Dầu Chiên Cũ Gom Bán',
    categoryTag: 'TÌNH NGHĨA HÀNG XÓM',
    icon: '👵',
    characterName: 'Bác Năm Ve Chai',
    characterAvatar: '👵',
    characterImg: charImg('char_14_scrap_nam.png'),
    emoteBubble: '👵',
    characterRole: 'Cụ Bà Hẻm 1102',
    context: 'Bà Năm xách chiếc can nhựa cũ sang trước giờ mở bán, ngỏ lời xin gom dầu chiên đã qua sử dụng của tiệm để bán kiếm tiền.',
    dialogue: 'Con ơi, dầu chiên thừa tiệm con có bán lại cho bà gom không? Mấy chỗ họ mua lại dầu cũ giá cao lắm, bà gom kiếm ít đồng mua thuốc khớp...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 3,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 3: Bà cụ hàng xóm sang xin dầu chiên thải.',
    choices: [
      {
        id: 'oil_deny_and_gift',
        label: 'Từ chối vì sợ dầu bẩn, biếu bà 50k & hộp gà',
        subDesc: 'Bảo vệ sức khỏe cộng đồng, bà Năm xúc động cảm ơn tấm lòng',
        kicker: '🔥 ĐẠO ĐỨC NGHỀ BẾP & TÌNH THÂN',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: -50000,
        reactionTitle: 'Tấm Lòng Lương Thiện Của Chủ Tiệm',
        reactionNarrative: 'Bạn ân cần giải thích tiệm giao dầu cho đơn vị chế biến diesel sinh học để bảo vệ sức khỏe cộng đồng, rồi biếu bà 50.000đ cùng hộp gà nóng. Bà Năm xúc động chúc bạn buôn may bán đắt!'
      },
      {
        id: 'oil_give_freely',
        label: 'Bán can dầu cũ cho bà kiếm thêm 30k',
        subDesc: 'Thu thêm 30k tiền túi, nhưng lòng cắn rứt vì lo dầu bẩn trôi nổi',
        kicker: '⚠️ THỎA HIỆP KHÔNG NGUYÊN TẮC',
        karmaDelta: { community: 10, craftsmanship: -20 },
        moneyDelta: 30000,
        reactionTitle: 'Bà Năm Vui Vẻ Nhận Dầu',
        reactionNarrative: 'Bà Năm cảm ơn và xách can dầu đi. Dù giúp được bà một ít tiền nhưng trong lòng bạn cứ gợn lên nỗi lo về nguồn dầu bẩn trôi nổi.'
      },
      {
        id: 'oil_strict_reject',
        label: 'Lắc đầu dứt khoát: "Dầu tiệm con tự hủy"',
        subDesc: 'Giữ vững chuẩn mực vệ sinh nghiêm ngặt, bà cụ hơi chạnh lòng',
        kicker: '💼 NGUYÊN TẮC CỨNG NHẮC',
        karmaDelta: { craftsmanship: 10, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vững Tiêu Chuẩn',
        reactionNarrative: 'Bà Năm lủi thủi quay về xe ve chai. Bạn bảo đảm được quy chuẩn nhưng ánh mắt bà cụ khiến bạn suy nghĩ mãi.'
      }
    ]
  },

  // 4. Trẻ cơ nhỡ đổi vé số lấy gà rán (Ngày 3)
  {
    id: 'incident_kid_lottery',
    title: 'Đổi Vé Số Lấy Gà Rán Cho Hai Bé',
    categoryTag: 'CHIỀU MƯA HẺM SÂU',
    icon: '🎟️',
    characterName: 'Bé Bo & Bé Bắp',
    characterAvatar: '🧒',
    characterImg: charImg('char_05_kid_bo.png'),
    emoteBubble: '🎟️',
    characterRole: 'Trẻ Bán Vé Số Mùa Mưa',
    context: 'Trời đổ mưa rào, hai anh em bán vé số quần áo ướt mèm đứng nép dưới mái hiên tiệm gà, mắt dán chặt vào khay gà chiên sốt bơ tỏi thơm lừng.',
    dialogue: 'Anh ơi... tụi em còn 4 tờ vé số ế chưa bán được, đổi cho hai đứa em một miếng gà rán ăn cho đỡ lạnh bụng được không anh?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 3,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 3: Hai đứa trẻ cơ nhỡ nép mưa dưới mái hiên.',
    choices: [
      {
        id: 'kid_exchange_feast',
        label: 'Đổi 4 vé số lấy Combo Gà + Khoai no nê',
        subDesc: 'Đổi 4 vé số lấy gà ấm bụng, tối dò vé số trúng lộc trời ban 100k! (+60k lời)',
        kicker: '❤️ NẤU BẰNG TẤM LÒNG',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: -5 },
        moneyDelta: 60000,
        reactionTitle: 'Bữa Ăn Hạnh Phúc Nhất Đời!',
        reactionNarrative: 'Hai đứa trẻ cầm miếng gà giòn nóng hổi, cắn rôm rốp mà mắt cười tít lại hạnh phúc. Đêm đó bạn dò vé số: trúng giải tám 100.000đ! Đúng là lộc trời ban cho người có tâm!'
      },
      {
        id: 'kid_gift_only',
        label: 'Tặng 2 đùi gà, dặn giữ vé số bán tiếp',
        subDesc: 'Tốn 30k tiền gà, hai đứa nhỏ cúi đầu cảm ơn rối rít trong mưa',
        kicker: '🎁 CHO ĐI KHÔNG TOAN TÍNH',
        karmaDelta: { community: 20, ambition: -10 },
        moneyDelta: -30000,
        reactionTitle: 'Ấm Lòng Chiều Mưa Hẻm',
        reactionNarrative: 'Hai đứa nhỏ mừng rỡ cúi đầu cảm ơn rối rít rồi chia nhau ăn ngon lành dưới mái hiên. Tình người Sài Gòn luôn ấm áp như thế.'
      },
      {
        id: 'kid_refuse',
        label: 'Từ chối: "Quán không nhận đổi đồ ăn"',
        subDesc: 'Cửa tiệm ngăn nắp gọn gàng, hai đứa trẻ lầm lũi đội mưa đi tiếp',
        kicker: '💼 KINH DOANH THỰC TẾ',
        karmaDelta: { ambition: 10, community: -20 },
        moneyDelta: 0,
        reactionTitle: 'Hai Đứa Trẻ Lặng Lẽ Rời Đi',
        reactionNarrative: 'Hai đứa nhỏ ôm xấp vé số ướt bước tiếp vào màn mưa. Bạn giữ được cửa tiệm gọn gàng nhưng đáy lòng thoáng chốc chùng xuống.'
      }
    ]
  },

  // 5. Khách xin nợ quên ví (Ngày 4)
  {
    id: 'incident_debt_runner',
    title: 'Khách Ăn Xong Quên Ví Xin Ghi Nợ',
    categoryTag: 'DRAMA QUỴT TIỀN',
    icon: '💸',
    characterName: 'Anh Cường Bốc Vác',
    characterAvatar: '🪵',
    characterImg: charImg('char_20_mover_cuong.png'),
    emoteBubble: '💸',
    characterRole: 'Khách Vãng Lai Vội Vã',
    context: 'Ăn xong hai miếng gà sốt cay và ly nước ngọt mát lạnh, vị khách vội vàng sờ khắp túi áo túi quần rồi toát mồ hôi gãi đầu ái ngại.',
    dialogue: 'Chết rồi em ơi! Nãy chạy giao bàn ghế gấp quá anh để quên bóp ở xưởng mộc, điện thoại lại sập nguồn tối thui. Cho anh ghi nợ 65k chiều anh quay lại gửi liền nha!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    minDay: 4,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 4: Một vị khách ăn xong quên mang ví xin ghi nợ.',
    choices: [
      {
        id: 'debt_trust',
        label: 'Cười tươi tin tưởng: "Lúc nào tiện ghé gửi em"',
        subDesc: 'hên xui: chiều anh quay lại trả đủ mua thêm 2 xô, hoặc một đi không trở lại',
        kicker: '❤️ NGHĨA TÌNH HẺM SÂU',
        riskRate: 0.35,
        karmaDelta: { community: 15, ambition: -5 },
        moneyDelta: -65000,
        reactionTitle: 'Chữ Tín Đáng Giá Ngàn Vàng!',
        reactionNarrative: 'Đến chiều muộn, anh Tuấn quay lại thật! Anh không những gửi lại 65.000đ mà còn mua thêm 2 xô gà mang về cho thợ xưởng mộc cùng ăn, tấm tắc khen chủ tiệm sống có tình có nghĩa!',
        reactionFailureNarrative: 'Mấy ngày trôi qua, anh thợ mộc vội vã ấy đã một đi không trở lại. Coi như tiệm đãi một người lỡ đường một bữa gà ấm bụng!'
      },
      {
        id: 'debt_collateral',
        label: 'Giữ lại chiếc đồng hồ đeo tay làm tin',
        subDesc: 'Tiền bạc phân minh, anh khách hơi sượng mặt tháo đồng hồ để lại',
        kicker: '💼 KỶ CƯƠNG KINH DOANH',
        karmaDelta: { ambition: 10, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Tiền Bạc Phân Minh',
        reactionNarrative: 'Anh Tuấn hơi sượng mặt nhưng vẫn tháo chiếc đồng hồ gửi lại. Chiều hôm đó anh mang tiền sang chuộc, trả đủ tiền nhưng ánh mắt có phần xa cách.'
      },
      {
        id: 'debt_security_help',
        label: 'Nhờ Chú Bảo Vệ cho mượn củ sạc nhanh quét QR',
        subDesc: '👮 Chú Tư cắm sạc dự phòng 2 phút: Khách bật nguồn chuyển khoản ngay',
        kicker: '👮 CÓ BẢO VỆ TIỆM GÀ',
        requiresSecurity: true,
        karmaDelta: { community: 10, craftsmanship: 5 },
        moneyDelta: 65000,
        reactionTitle: 'Bảo Vệ Xử Lý Nhanh Nhẹn!',
        reactionNarrative: 'Chú Bảo Vệ liền rút ngay dây sạc dự phòng cho anh Tuấn cắm nhờ 2 phút. Máy lên nguồn, anh vui vẻ quét mã QR thanh toán gọn gàng và bắt tay cảm ơn chú bảo vệ nhiệt tình!'
      }
    ]
  },

  // 6. Shipper làm rơi vỡ đơn hàng (Ngày 4)
  {
    id: 'incident_shipper_spill',
    title: 'Shipper Làm Rơi Đơn Ngồi Bật Khóc',
    categoryTag: 'SỰ CỐ NGHỀ SHIP',
    icon: '🛵',
    characterName: 'Anh Tuấn Shipper Ruột',
    characterAvatar: '😢',
    characterImg: charImg('char_19_shipper_tuan.png'),
    emoteBubble: '🛵',
    characterRole: 'Tài Xế Công Nghệ Thân Quen',
    context: 'Chú Sáu vấp phải gờ giảm tốc ngay trước cửa tiệm, thùng đồ ăn bung ra khiến 2 phần combo gà rán và nước ngọt đổ tung tóe xuống đường. Chú ngồi thụp xuống ôm đầu bất lực.',
    dialogue: 'Trời ơi là trời... Chạy từ sáng tới giờ chưa đủ tiền mua sữa cho cháu, giờ đền đơn này là mất trắng cả ngày công... App nó khóa tài khoản mất thôi con ơi...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 4,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Ngày 4: Tai nạn bất ngờ của bác tài xế công nghệ già.',
    choices: [
      {
        id: 'shipper_cook_free',
        label: 'Chiên lại đơn mới nóng hổi MIỄN PHÍ',
        subDesc: 'Tốn 45k vốn, chú Sáu cảm động rơi nước mắt, khách xung quanh vỗ tay tán thưởng',
        kicker: '❤️ NGHĨA ĐỒNG BÀO SÀI GÒN',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: -10 },
        moneyDelta: -45000,
        reactionTitle: 'Nụ Cười Rạng Rỡ Trong Nước Mắt',
        reactionNarrative: 'Bạn kéo chú vào quầy, rót ly nước sâm đá và bảo nhân viên làm lại mẻ gà mới giòn rụm trong 5 phút. Chú Sáu cảm động rơi nước mắt, chắp tay cảm ơn rối rít. Khách chứng kiến tấm lòng của bạn đều gật đầu tán thưởng!'
      },
      {
        id: 'shipper_split_cost',
        label: 'Hỗ trợ chia đôi 50% tiền vốn với chú',
        subDesc: 'Mỗi bên gánh 20k, chú Sáu cảm kích sự thông cảm của quán',
        kicker: '🤝 CHIA SẺ RỦI RO',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Mỗi Người Gánh Một Nửa',
        reactionNarrative: 'Chú Sáu vui vẻ gửi bạn một nửa tiền vốn và cảm ơn sự cảm thông của tiệm. Đơn hàng mới được làm nhanh chóng để chú kịp giao khách.'
      },
      {
        id: 'shipper_strict_app',
        label: 'Yêu cầu tự báo cáo sự cố lên tổng đài',
        subDesc: 'Không mất tiền túi, chú Sáu gạt nước mắt gọi app xin hủy đơn',
        kicker: '📱 NGUYÊN TẮC QUY ĐỊNH',
        karmaDelta: { ambition: 15, community: -15 },
        moneyDelta: 0,
        reactionTitle: 'Giải Quyết Theo Thủ Tục',
        reactionNarrative: 'Chú Sáu gạt nước mắt gọi tổng đài app xin hủy chuyến theo quy định. Tiệm không bị tổn thất tiền bạc nhưng không khí trong bếp chùng xuống đôi chút.'
      }
    ]
  },

  // 7. Kẻ gian rình trộm bình gas ban đêm (Ngày 5)
  {
    id: 'incident_thief_gas',
    title: 'Kẻ Gian Cắt Khóa Trộm Bình Gas Đêm',
    categoryTag: 'TRỘM ĐÊM RÌNH RẬP',
    icon: '🦹',
    characterName: 'Đại Ca Beo',
    characterAvatar: '🥷',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '🚨',
    characterRole: 'Kẻ Trộm Đêm Hẻm 1102',
    context: '21h30 chuẩn bị đóng cửa dọn quán, một bóng đen đội mũ trùm kín mặt lén lút tiếp cận góc đặt bình gas dự phòng và xô inox của tiệm.',
    dialogue: '(Tiếng lục lọi loảng xoảng trong đêm vắng... Bóng đen đang lăm lăm chiếc kìm cộng lực định cắt khóa xích bình gas...)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    minDay: 5,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Ngày 5: Hiểm nguy rình rập thiết bị quán trong đêm tối.',
    choices: [
      {
        id: 'gas_sec_ambush',
        label: 'Chú Bảo Vệ phục kích tóm gọn tên trộm',
        subDesc: '👮 Chú Tư quật ngã tên trộm tại trận, Bác Ba thưởng nóng 50k giữ bình yên',
        kicker: '👮 BẢO VỆ TÚM GỌN',
        requiresSecurity: true,
        karmaDelta: { community: 20, ambition: 10 },
        moneyDelta: 50000,
        reactionTitle: 'Bảo Vệ Lập Công Lớn!',
        reactionNarrative: 'Chú Bảo Vệ lao ra như một cơn lốc quật ngã tên trộm tại trận, bà con lối xóm cầm gậy gộc chạy ra vây bắt giao công an phường. Bác Ba tổ trưởng thưởng nóng cho tiệm vì giữ bình yên con hẻm!'
      },
      {
        id: 'gas_solo_chase',
        label: 'Cầm chảo chiên lao ra tri hô một mình',
        subDesc: 'hên xui: trộm hoảng hốt vứt kìm tháo chạy, hoặc cuỗm mất bình gas 300k',
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
        label: 'Bấm còi báo động & khóa chặt cửa',
        subDesc: 'Còi hú inh ỏi dọa kẻ gian bỏ chạy, bảo đảm 100% an toàn tính mạng',
        kicker: '🔒 AN TOÀN TRÊN HẾT',
        karmaDelta: { craftsmanship: 5, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Kẻ Trộm Hoảng Sợ Bỏ Chạy',
        reactionNarrative: 'Tiếng còi hú inh ỏi khiến kẻ gian giật mình tưởng động ổ, vội vàng leo rào bỏ chạy để lại hiện trường nguyên vẹn.'
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 2: CĂN NHÀ SỐ 14 TRONG HẺM & KHÁCH TRẺ (CHƯƠNG 2, NGÀY 8 - 18)
  // =========================================================================

  // 8. Cậu tân sinh viên xin rửa chén (Chương 2, Ngày 8)
  {
    id: 'incident_student_parttime',
    title: 'Cậu Tân Sinh Viên Xin Rửa Chén Kiếm Tiền Học',
    categoryTag: 'TÂN SINH VIÊN',
    icon: '🎓',
    characterName: 'Cậu Út Giao Vé',
    characterAvatar: '👦',
    characterImg: charImg('char_12_courier_ut.png'),
    emoteBubble: '📚',
    characterRole: 'Cậu Trò Nghèo Đất Quê',
    context: 'Một cậu sinh viên rụt rè đứng trước cửa tiệm mới thuê, áo sờn vai xin việc làm thêm buổi tối.',
    dialogue: 'Dạ anh/chị ơi... em mới ở quê lên nhập học, mẹ em dưới quê đang nằm viện. Quán có việc gì rửa chén hay lau bàn buổi tối không, trả em ít tiền cũng được ạ...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 8,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Chương 2: Một cậu học trò nghèo tìm đến xin phụ việc.',
    choices: [
      {
        id: 'student_hire_warm',
        label: 'Nhận vào phụ việc & bao cơm gà',
        subDesc: 'Trả công 50k mỗi ca, cậu bé làm việc siêng năng sạch bóng',
        kicker: '❤️ NÂNG ĐỠ ƯỚC MƠ',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: 5 },
        moneyDelta: -50000,
        reactionTitle: 'Người Em Chăm Chỉ Của Tiệm',
        reactionNarrative: 'Minh làm việc cực kỳ siêng năng, rửa chén bát sạch bóng và nhanh thoăn thoắt. Mỗi tối tan ca được ăn đĩa cơm gà ấm áp, mắt cậu ánh lên niềm tin vào cuộc đời tươi đẹp.'
      },
      {
        id: 'student_gift_meal',
        label: 'Tặng cơm gà & chỉ sang quán trà sữa',
        subDesc: 'Mất 20k phần gà, cậu bé xin việc thành công bên quán trà sữa',
        kicker: '🤝 GIÚP ĐỠ ĐÚNG NƠI',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Kết Nối Duyên Lành',
        reactionNarrative: 'Cậu bé cảm ơn ríu rít ăn hết phần gà rồi sang xin việc bên tiệm trà sữa thành công. Cậu luôn nhớ mãi ơn nghĩa của tiệm gà.'
      },
      {
        id: 'student_reject_full',
        label: 'Từ chối: "Quán anh đủ người rồi em"',
        subDesc: 'Không tốn chi phí, cậu bé lẳng lặng cúi đầu đi tìm nơi khác',
        kicker: '💼 KINH DOANH LÝ TRÍ',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Cậu Bé Lặng Lẽ Rời Đi',
        reactionNarrative: 'Minh cúi chào rồi bước tiếp trên vỉa hè tìm việc. Công việc kinh doanh của bạn vẫn ổn định theo kế hoạch.'
      }
    ]
  },

  // 8B. Bà Bảy Đất & Đại Ca Beo Đòi Nợ & Bảo Kê (Ngày 8+, Giữa ca bán)
  {
    id: 'incident_landlord_racketeer_debt',
    title: 'Bà Bảy Đất & Đại Ca Beo Đòi Nợ & Bảo Kê',
    categoryTag: 'CHỦ NHÀ & BẢO KÊ SIẾT NỢ',
    icon: '💥',
    characterName: 'Bà Bảy Đất & Đại Ca Beo',
    characterAvatar: '🦹‍♂️',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '⚡',
    characterRole: 'Chủ Đất & Giang Hồ Xóm 1102',
    context: 'Bà Bảy Đất (chủ cho thuê đất mặt bằng đầu hẻm) dắt theo Đại Ca Beo (giang hồ xăm trổ khét tiếng, em họ xa của bả) hùng hổ ập vào quán giữa lúc khách đang xếp hàng đông nghẹt, đập bàn đòi tiền cọc mặt bằng và tiền bảo kê!',
    dialogue: 'Mày làm ăn khấm khá quá hén! Tiền thuê mặt bằng tháng này cộng thêm 300k tiền nước nôi cho thằng Beo bảo kê trật tự xe cộ đâu? Nôn ra mau, không thì quán này đừng hòng mở cửa ở Hẻm 1102!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 1,
    minDay: 8,
    rarity: 'epic',
    unlockHint: 'Mở khóa từ Ngày 8: Quán bắt đầu đông khách, chủ mặt bằng câu kết giang hồ xóm đến đòi nợ và tiền bảo kê.',
    choices: [
      {
        id: 'landlord_bacba_mediate',
        label: 'Nhờ Bác Ba và Tổ Dân Phố hòa giải theo luật lệ hẻm',
        subDesc: 'Bác Ba cựu trưởng ban hòa giải: phân tích hợp đồng thấu tình đạt lý, giang hồ chùn bước',
        kicker: '⚖️ UY TÍN BÁC BA & LÝ LẼ',
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Bác Ba Ra Tay, Giang Hồ Rút Lui!',
        reactionNarrative: 'Bác Ba thong thả bước ra, cầm cuốn sổ họp tổ dân phố và bản hợp đồng thuê vỗ vai Đại Ca Beo: "Thằng Beo, mày mới qua quậy tiệm cháu tao hả? Còn chị Bảy, hợp đồng ghi rõ mùng 10 mới đóng tiền, bữa nay mùng 8 chị dắt côn đồ tới đòi là phạm luật đó nghen!". Nhận ra Bác Ba uy tín đầy mình, Đại Ca Beo gãi đầu xin lỗi rồi kéo bà Bảy rút lui. Khách trong quán vỗ tay khen ngợi!'
      },
      {
        id: 'landlord_pay_ransom',
        label: 'Bấm bụng đưa 300.000đ trả tiền cho êm chuyện',
        subDesc: 'Bà Bảy và Đại Ca Beo cầm tiền cười khà khà bỏ đi, ca bán được tiếp tục bình yên',
        kicker: '💸 BẤM BỤNG THỎA HIỆP',
        moneyDelta: -300000,
        karmaDelta: { ambition: -5, community: -5 },
        reactionTitle: 'Êm Thấm Nhưng Tốn Kém!',
        reactionNarrative: 'Cầm 300.000đ trên tay, Bà Bảy Đất nhét túi cười hề hề: "Biết điều vậy có phải tốt không!". Đại Ca Beo vỗ vai bạn bảo "Thôi anh em mình đi nhậu!". Cả hai rút đi, bạn thở phào nhẹ nhõm dù trong lòng xót tiền.'
      },
      {
        id: 'landlord_provoke_riot',
        label: 'Nổi nóng quát mắng, xua đuổi giang hồ và chủ nhà',
        subDesc: '⚠️ CỰC KỲ NGUY HIỂM: Đại Ca Beo sẽ đập bàn phá quán, TOÀN BỘ KHÁCH ĐANG ĐỢI SẼ HOẢNG SỢ BỎ CHẠY HẾT!',
        kicker: '💥 ĐỐI ĐẦU NÓNG NẢY',
        scareCustomers: true,
        disruptionSeconds: 18,
        karmaDelta: { community: -15, ambition: -10 },
        reputationDelta: -0.2,
        reactionTitle: 'Khách Hoảng Sợ Bỏ Chạy Hết Sạch!',
        reactionNarrative: 'Bị bạn quát mắng, Đại Ca Beo đỏ mặt tía tai lật tung bàn ghế inox, gạt đổ khay đĩa: "A thằng ranh con này muốn chống đối hả?". Cảnh tượng giang hồ hung hãn đập phá khiến TOÀN BỘ KHÁCH ĐANG XẾP HÀNG HOẢNG HỐT LA HÉT BỎ CHẠY TÁN LOẠN! Quán trở nên vắng hoe hỗn loạn, bạn phải mất thời gian dọn dẹp và trấn an bà con lối xóm mới có khách dám quay lại!'
      },
      {
        id: 'landlord_sec_restrain',
        label: 'Chú Tư Bảo Vệ bước ra khóa tay trấn áp kẻ quậy phá',
        subDesc: '👮 Chú Tư cựu công an khu vực: khóa tay Đại Ca Beo lập tức, bảo đảm 100% bình yên',
        kicker: '👮 BẢO VỆ CHUYÊN NGHIỆP',
        requiresSecurity: true,
        karmaDelta: { community: 25, ambition: 15 },
        reputationDelta: 0.1,
        reactionTitle: 'Đầu Gấu Bị Khóa Tay Sợ Tái Mặt!',
        reactionNarrative: 'Vừa thấy Đại Ca Beo định giơ tay hung hăng, Chú Tư Bảo Vệ đã lướt tới vặn ngược cổ tay gã khóa chặt xuống bàn: "Mày đụng vô tiệm này một ngón tay nữa tao giải lên phường liền!". Đại Ca Beo đau điếng mặt xanh như tàu lá chuối, Bà Bảy sợ quá líu ríu xin lỗi rồi cả hai lủi mất tăm. Khách vỗ tay rần rần vì quán an ninh quá đỉnh!'
      }
    ]
  },

  // 9. Trend sốt matcha trân châu (Chương 2, Ngày 9)
  {
    id: 'incident_food_trend_matcha',
    title: 'Khách Đòi Trend "Gà Sốt Matcha Trân Châu"',
    categoryTag: 'TRENDING TIKTOK',
    icon: '🍵',
    characterName: 'Cặp Đôi Bách & Diệp',
    characterAvatar: '👧',
    characterImg: charImg('char_33_couple_genz.png'),
    emoteBubble: '✨',
    characterRole: 'GenZ Thích Trải Nghiệm Mới',
    context: 'Một nhóm học sinh giơ điện thoại hí hửng hỏi quán có làm món đang rần rần trên mạng xã hội không.',
    dialogue: 'Anh chủ ơi trên Tóp Tóp đang sốt món Gà Rán Nhúng Sốt Matcha Trân Châu Đường Đen kìa! Quán làm thử cho tụi em 3 dĩa ăn thử check-in với!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 9,
    rarity: 'common',
    unlockHint: 'Mở khóa ở Chương 2: Cơn sốt trào lưu ẩm thực kỳ lạ đổ bộ.',
    choices: [
      {
        id: 'trend_cash_grab',
        label: 'Bắt trend ngay lập tức, bán 89k/dĩa',
        subDesc: 'Bỏ túi 120k tiền lời, nhưng món ăn dị làm giảm uy tín hương vị',
        kicker: '💸 TỐI ƯU TREND THỜI THƯỢNG',
        karmaDelta: { ambition: 20, craftsmanship: -15 },
        moneyDelta: 120000,
        reactionTitle: 'Hốt Bạc Nhờ Bắt Trend',
        reactionNarrative: 'Tụi nhỏ chụp hình đăng mạng nườm nượp kéo theo nhiều khách tò mò. Món ăn hơi dị nhưng quán kiếm được khoản lời đậm đà!'
      },
      {
        id: 'trend_stick_standard',
        label: 'Giữ vững chuẩn mực gà bơ tỏi gia truyền',
        subDesc: 'Mời khách thử gà mật ong chuẩn vị, khách gật gù khen ngon đỉnh',
        kicker: '🔥 ĐẲNG CẤP HƯƠNG VỊ',
        karmaDelta: { craftsmanship: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Thuyết Phục Bằng Chất Lượng Thật',
        reactionNarrative: 'Bạn mời nhóm thử đĩa Gà Sốt Mật Ong Bơ Tỏi chân ái. Cắn miếng gà giòn béo ngậy, các bạn trẻ gật gù: "Đúng là gà chuẩn vị ăn đứt mấy trend ăn xổi anh ơi!".'
      },
      {
        id: 'trend_trial_staff',
        label: 'Làm thử nội bộ cho nhân viên nếm',
        subDesc: 'Tốn 25k nguyên liệu, cả bếp lắc đầu vì matcha đắng chát',
        kicker: '🧪 THỬ NGHIỆM THẬN TRỌNG',
        karmaDelta: { craftsmanship: 10, community: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Hội Đồng Bếp Lắc Đầu',
        reactionNarrative: 'Nhân viên nếm xong cười nghiêng ngả vì vị đắng chát của matcha không hợp với da gà rán. Tiệm quyết định giữ vững menu chuẩn chỉ.'
      }
    ]
  },

  // 10. Khách đưa ảnh chuyển khoản giả mạo (Chương 2, Ngày 10)
  {
    id: 'incident_fake_transfer',
    title: 'Khách Đưa Ảnh Chuyển Khoản Ảo',
    categoryTag: 'CẠM BẪY CHUYỂN KHOẢN',
    icon: '💳',
    characterName: 'Anh Tuấn Chạy Bộ',
    characterAvatar: '🕶️',
    characterImg: charImg('char_32_jogger_tuan.png'),
    emoteBubble: '💳',
    characterRole: 'Khách Đi Xe Ga',
    context: 'Order đơn hàng mang về trị giá 150k, thanh niên nhanh tay giơ màn hình điện thoại chụp sẵn biên lai chuyển khoản giả trong chớp mắt rồi toan lên xe rồ ga phóng đi.',
    dialogue: 'Em chuyển khoản thành công rồi nha chị! Khác ngân hàng nên tin nhắn tiền về hơi trễ xíu đó, em đang vội đi họp sếp gọi quá!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    minDay: 10,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 10): Cạm bẫy thanh toán thời đại chuyển khoản số.',
    choices: [
      {
        id: 'fake_cashier_audit',
        label: '💁 Thu Ngân check biến động số dư tức thì trên POS',
        subDesc: '💁 Thu Ngân đối soát chuẩn xác: Nhắc khách hiện rõ bill giả, nhận đủ 150k + 20k tip!',
        kicker: '💁 THU NGÂN ĐỐI SOÁT',
        requiresRole: 'cashier',
        requiresRoleDesc: '🔒 Cần tuyển Thu Ngân tại tab Nhân viên để kiểm soát thanh toán tức thì',
        karmaDelta: { craftsmanship: 15, ambition: 10 },
        moneyDelta: 170000,
        reactionTitle: 'Thu Ngân Đối Soát Bắt Thóp Bill Giả!',
        reactionNarrative: 'Thu Ngân liếc qua màn hình là biết ngay ảnh chụp giả mạo: "Dạ anh ơi, app tiệm em tích hợp báo biến động số dư theo giây, chưa thấy nổ chuông ạ!". Thanh niên toát mồ hôi đành móc ví trả tiền mặt 150k và gửi thêm 20k tiền tip vì quá xấu hổ!'
      },
      {
        id: 'fake_sec_stop',
        label: 'Chú Bảo Vệ giữ đuôi xe, đợi tiền nổi',
        subDesc: '👮 Chú Tư chặn xe lịch thiệp: Bắt thóp ảnh fake, khách đành trả đủ 150k tiền mặt',
        kicker: '👮 BẢO VỆ CHẶN BẮT',
        requiresSecurity: true,
        karmaDelta: { ambition: 10, community: 5 },
        moneyDelta: 150000,
        reactionTitle: 'Bảo Vệ Tỉnh Táo Tóm Gọn!',
        reactionNarrative: 'Chú Bảo Vệ đứng ngay cửa liền giơ tay chặn nhẹ: "Kìa bạn trẻ, ngồi uống ly trà đá chờ ngân hàng nổ chuông đã nhé!". Bị bắt thóp chiếc ảnh photoshop giờ giấc sai lệch, thanh niên ngượng chín mặt đành móc ví trả đủ tiền mặt!'
      },
      {
        id: 'fake_let_go',
        label: 'Tin người cho đi luôn vì sợ khách vội',
        subDesc: 'hên xui: ngân hàng nghẽn mạng tiền về sau, hoặc mất trắng đơn 150k',
        kicker: '⚠️ MAY RỦI THẢ TRÔI',
        riskRate: 0.65,
        mitigatedByRoles: ['cashier', 'security'],
        karmaDelta: { community: 5, ambition: -10 },
        moneyDelta: -150000,
        reactionTitle: 'Khách Chuyển Thật Sự!',
        reactionNarrative: 'Khoảng 10 phút sau chuông điện thoại reng "ting ting", tiền nổi thật do nghẽn mạng liên ngân hàng. Hú hồn một phen!',
        reactionFailureNarrative: 'Cả ngày không thấy tiền đâu, kiểm tra lại mới biết mã giao dịch là ảnh cắt ghép. Quán chịu mất trắng đơn hàng 150k coi như bài học cảnh giác!'
      },
      {
        id: 'fake_strict_policy',
        label: 'Yêu cầu mở app ngân hàng kiểm tra lịch sử',
        subDesc: 'Khách ấp úng viện cớ quên mật khẩu rồi lẳng lặng chuồn mất',
        kicker: '🛡️ NGUYÊN TẮC RÕ RÀNG',
        karmaDelta: { ambition: 10, craftsmanship: 5 },
        moneyDelta: 0,
        reactionTitle: 'Kiểm Tra Đúng Quy Trình',
        reactionNarrative: 'Thấy bạn cứng rắn yêu cầu mở app thật kiểm tra, thanh niên ấp úng viện cớ "quên mật khẩu ngân hàng" rồi lẳng lặng bỏ lại bịch gà chuồn mất.'
      }
    ]
  },

  // 11. Tiktoker xin review free (Chương 2, Ngày 11, cần ≥ 4.0⭐)
  {
    id: 'incident_tiktoker_free',
    title: 'Idol Tóp Tóp Xin Ăn Free Review',
    categoryTag: 'IDOL TÓP TÓP',
    icon: '📱',
    characterName: 'Ben Lee',
    characterAvatar: '🤳',
    characterImg: charImg('char_07_trendy_vy.png'),
    emoteBubble: '📱',
    characterRole: 'Tiktoker 200k Follower',
    context: 'Một nam thanh niên tóc tai bóng bẩy, cầm cây chống rung và gắn micro thu âm bước vào tiệm với vẻ mặt tự tin khi thấy quán đạt trên 4 sao.',
    dialogue: 'Anh chủ ơi, kênh em đang viral clip triệu view. Anh tài trợ cho em 1 Xô Gà Gia Đình đầy đủ sốt bơ tỏi với 2 ly kem, em quay clip đẩy quán anh lên xu hướng bảo đảm mai khách xếp hàng nghẹt hẻm luôn!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 11,
    requiredStars: 4.0,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 11 & ≥4.0⭐): Người nổi tiếng mạng xã hội đánh hơi thấy độ hot của quán.',
    choices: [
      {
        id: 'tiktoker_free_accept',
        label: 'Tài trợ miễn phí trọn gói & trà đào',
        subDesc: 'Mất 55k xô gà, đổi lại clip lên xu hướng 50k tim nườm nượp khách',
        kicker: '🌟 NẮM BẮT CƠ HỘI VIRAL',
        karmaDelta: { ambition: 15, community: -5 },
        moneyDelta: -55000,
        reactionTitle: 'Video Lên Xu Hướng Tóp Tóp!',
        reactionNarrative: 'Ben Lee quay góc cận cảnh miếng gà giòn rụm bốc khói rất đẹp mắt. Video cắn gà ròn tan đạt 50k tim trong đêm, hôm sau quán đón thêm nhiều bạn trẻ tò mò ghé ăn thử!'
      },
      {
        id: 'tiktoker_free_reject',
        label: 'Từ chối: "Quán bán đúng giá niêm yết"',
        subDesc: 'Ben Lee tự móc ví mua ăn, gật gù khen gà ngon thật không cần màu mè',
        kicker: '🔥 TÔN TRỌNG TAY NGHỀ',
        karmaDelta: { craftsmanship: 15, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Giữ Vững Bản Lĩnh Người Làm Bếp',
        reactionNarrative: 'Ben Lee hơi bẽ bàng nhưng thấy thái độ tự tin, đàng hoàng của bạn nên vẫn móc ví gọi 1 phần gà giòn. Khi ăn thử miếng đầu tiên, cậu ta gật gù khen: "Gà giòn thật, không cần làm màu!".'
      },
      {
        id: 'tiktoker_free_snack',
        label: 'Tặng đĩa khoai lắc, gà tính tiền đủ',
        subDesc: 'Mất 15k khoai lắc, đôi bên vui vẻ quay clip khen quán mến khách',
        kicker: '🤝 ĐỐI ĐÃI KHÉO LÉO',
        karmaDelta: { community: 10, craftsmanship: 5 },
        moneyDelta: -15000,
        reactionTitle: 'Hài Hòa Cả Đôi Đường',
        reactionNarrative: 'Vừa được ăn khoai lắc thơm phức miễn phí vừa được chủ tiệm vui vẻ tiếp chuyện, Ben Lee rất thích tính cách xởi lởi của bạn và quay một đoạn ngắn khen ngợi lòng mến khách của hẻm 1102.'
      }
    ]
  },

  // 12. Thách đấu ăn gà siêu cay cấp 7 (Chương 2, Ngày 12)
  {
    id: 'incident_spicy_challenge',
    title: 'Thách Đấu Gà Siêu Cay Cấp Độ 7',
    categoryTag: 'THÁCH ĐẤU SIÊU CAY',
    icon: '🌶️',
    characterName: 'Anh Khang Thợ Chiên',
    characterAvatar: '🤠',
    characterImg: charImg('char_04_fryer_khang.png'),
    emoteBubble: '🔥',
    characterRole: 'Thánh Ăn Cay Livestream',
    context: 'Một nam thanh niên bật livestream trước cửa tiệm, gạ chủ quán làm đĩa gà cay cấp độ xé họng để thử thách.',
    dialogue: 'Anh chủ có dám làm cho em 1 đĩa gà cay xé họng cấp 7 không? Nếu em ăn hết trong 5 phút mà không uống giọt nước nào, anh miễn phí bữa này và tặng em áo kỷ niệm nha!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 12,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 12): Kèo thách thức ăn cay xé lưỡi trực tiếp.',
    choices: [
      {
        id: 'spicy_accept_milk',
        label: 'Nhận kèo & chuẩn bị sữa tươi lạnh',
        subDesc: 'Khang húp sữa chịu thua nộp 50k, livestream triệu view cười nghiêng ngả',
        kicker: '🌶️ VUI VẺ CHĂM SÓC KHÁCH',
        karmaDelta: { craftsmanship: 15, community: 10, ambition: 10 },
        moneyDelta: 50000,
        reactionTitle: 'Trận Chiến Cay Nồng Đầy Tiếng Cười',
        reactionNarrative: 'Khang ăn tới miếng thứ hai thì mắt đỏ hoe toát mồ hôi hột kêu trời. Bạn đưa ngay ly sữa tươi đá lạnh giải cứu kịp thời. Khán giả xem live cười ngất ngưởng, like thả tim ầm ầm!'
      },
      {
        id: 'spicy_refuse_health',
        label: 'Từ chối: "Quán không nấu hại bao tử khách"',
        subDesc: 'Khang thán phục cái tâm của bạn, gọi đĩa gà giòn ăn ngon lành',
        kicker: '🛡️ BẢO VỆ SỨC KHỎE KHÁCH',
        karmaDelta: { craftsmanship: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Lời Khuyên Có Tâm Của Người Nấu',
        reactionNarrative: 'Khang ngẫm lại thấy bạn nói rất có lý. Cậu tắt thử thách và gọi đĩa gà giòn sốt cay thông thường, ăn uống ngon lành và khen ngợi tư duy làm nghề chuẩn mực của bạn.'
      },
      {
        id: 'spicy_double_bet',
        label: 'Thách ngược lại: Bỏ cuộc trả tiền gấp đôi!',
        subDesc: 'Thu về 100k tiền phạt, nhưng streamer ôm bụng cay xè ấm ức',
        kicker: '💼 SÁT PHẠT KINH DOANH',
        karmaDelta: { ambition: 20, community: -10 },
        moneyDelta: 100000,
        reactionTitle: 'Thua Cược Nộp Phạt',
        reactionNarrative: 'Khang bỏ cuộc ở phút thứ 3 vì quá cay, đành móc ví trả gấp đôi tiền đĩa gà. Bạn đút túi tiền lời nhưng Khang ôm bụng khó chịu rời quán.'
      }
    ]
  },

  // 13. Chuyện tình trong bếp (Chương 2, Ngày 13 - Phong cách Mì Cay Bà Tám)
  {
    id: 'incident_kitchen_romance',
    title: 'Anh Khang Với Bé Linh Hẹn Hò!',
    categoryTag: 'CHUYỆN TÌNH TRONG BẾP',
    icon: '💑',
    characterName: 'Khang & Linh',
    characterAvatar: '👩‍🍳',
    characterImg: charImg('char_03_helper_linh.png'),
    emoteBubble: '❤️',
    characterRole: 'Cặp Đôi Bếp & Thu Ngân',
    context: 'Mấy bữa nay anh Khang phụ bếp cứ lén bỏ thêm đùi gà giòn sốt cay vào hộp cơm của bé Linh thu ngân. Hôm nay hai đứa đỏ mặt lí nhí xin nghỉ ngày mai đi chơi Vũng Tàu.',
    dialogue: 'Dạ... tụi em xin phép anh chủ cho hai đứa tụi em xin nghỉ ngày mai để đi Vũng Tàu đổi gió một bữa ngắm biển được không anh...',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 13,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 13): Chuyện tình bí mật nảy nở bên chảo dầu thơm nức.',
    choices: [
      {
        id: 'romance_day_off',
        label: 'Cho nghỉ 1 ngày',
        subDesc: '1 ngày tự đứng chảo chiên gà mỏi rã rời, không trả lương hai đứa',
        kicker: '❤️ TÁC THÀNH LỨA ĐÔI',
        karmaDelta: { community: 20, craftsmanship: 5, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Tình Yêu Nở Rộ Trong Bếp!',
        reactionNarrative: 'Hai đứa mừng rỡ cúi đầu cảm ơn rối rít, dắt tay nhau đi Vũng Tàu chụp một rổ ảnh kỷ niệm. Bạn ở lại tiệm một mình rán gà mỏi rã cánh tay nhưng trong lòng ấm áp vì đã tác thành cho một đôi trẻ!'
      },
      {
        id: 'romance_strict_no',
        label: 'Không cho nghỉ, ai nghỉ trừ lương',
        subDesc: 'hên xui: hai đứa dỗi tắt máy trốn luôn 2-3 ngày, hoặc chịu trừ lương',
        kicker: '💼 KỶ CƯƠNG BẾP NÚC',
        riskRate: 0.5,
        karmaDelta: { ambition: 15, community: -15 },
        moneyDelta: -50000,
        reactionTitle: 'Chịu Trừ Lương Ở Lại Làm',
        reactionNarrative: 'Thấy bạn cứng rắn, hai đứa đành lí nhí xin lỗi chịu ở lại làm ca. Dù hơi tiu nghỉu nhưng quán không bị thiếu hụt người làm.',
        reactionFailureNarrative: 'Bị từ chối phũ phàng, hai đứa dỗi dắt tay nhau tắt điện thoại bỏ về quê luôn 2 ngày! Quán thiếu người rối tinh rối mù, bạn vừa chiên gà vừa tính tiền toát mồ hôi!'
      },
      {
        id: 'romance_sec_cover',
        label: 'Nhờ Chú Bảo Vệ bưng bê phụ ca để cho nghỉ',
        subDesc: '👮 Chú Tư nhận bưng bê dọn bàn giúp: Tiệm chạy êm, hỗ trợ 30k tiền xăng xe',
        kicker: '👮 CÓ BẢO VỆ TIỆM GÀ',
        requiresSecurity: true,
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: -30000,
        reactionTitle: 'Chú Bảo Vệ Đa Năng Ra Tay!',
        reactionNarrative: 'Chú Bảo Vệ xắn tay áo cười khà khà: "Thôi cho tụi nhỏ đi chơi đi cháu, có gì chú bưng bê dọn bàn phụ cho!". Chú Tư vừa giữ xe vừa thoăn thoắt bưng gà, quán vẫn nhộn nhịp vui vẻ!'
      }
    ]
  },

  // 14. Bẻ khóa xe máy khách (Chương 2, Ngày 14)
  {
    id: 'incident_bike_theft',
    title: 'Đạo Chích Bẻ Khóa Xe Máy Của Khách',
    categoryTag: 'AN NINH HẺM 1102',
    icon: '🏍️',
    characterName: 'Đại Ca Beo',
    characterAvatar: '👺',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '🚨',
    characterRole: 'Kẻ Bẻ Khóa Chuyên Nghiệp',
    context: 'Giờ cao điểm tối khi quán bắt đầu đông khách dựng xe ngoài ngõ, một đối tượng áp sát chiếc xe tay ga đắt tiền của khách, tay rút đoản chữ T chuẩn bị bẻ khóa.',
    dialogue: '(Két... Tiếng ổ khóa xe máy bị cấn mạnh dưới tán cây...)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    minDay: 14,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 14): Bãi xe đông đúc lọt vào tầm ngắm kẻ gian (Cần Bảo Vệ).',
    choices: [
      {
        id: 'bike_sec_catch',
        label: 'Chú Bảo Vệ quật gậy giữ xe tóm gọn',
        subDesc: '👮 Chú Tư quật ngã tên trộm, khách mừng rớt nước mắt tip nóng 100k',
        kicker: '👮 BẢO VỆ CHUYÊN NGHIỆP',
        requiresSecurity: true,
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 100000,
        reactionTitle: 'Khách Cảm Kích Tột Cùng!',
        reactionNarrative: 'Chú Bảo Vệ phản ứng cực nhanh, quật ngã tên trộm khiến hắn không kịp tẩu thoát. Khách ăn gà chạy ra thấy xe mình còn nguyên vẹn mừng rớt nước mắt, tip ngay cho quán 100k và đăng bài khen ngợi nức nở trên mạng!'
      },
      {
        id: 'bike_no_sec_luck',
        label: 'Khách vô tình thấy qua cửa kính hô hoán',
        subDesc: 'hên xui: trộm giật mình quăng đoản chạy, hoặc bẻ khóa mất xe đền 500k',
        kicker: '⚠️ MAY RỦI NGẪU NHIÊN',
        riskRate: 0.55,
        mitigatedByRoles: ['security'],
        karmaDelta: { community: -10, ambition: -10 },
        moneyDelta: -500000,
        reactionTitle: 'Kịp Thời Phát Giác!',
        reactionNarrative: 'Một vị khách vô tình nhìn ra cửa và hét lớn, tên trộm giật mình quăng đoản nhảy lên xe tẩu thoát trong gang tấc!',
        reactionFailureNarrative: 'Tên trộm bẻ khóa quá điêu luyện trong vòng 5 giây rồi rồ ga biến mất. Không có bảo vệ trông coi, quán phải hỗ trợ đền bù 500.000đ cho khách và nhận 1 sao thất vọng!'
      },
      {
        id: 'bike_shout_neighbors',
        label: 'Hô hoán cả hẻm 1102 cùng tiếp ứng',
        subDesc: 'Bà con chặn kín hai đầu hẻm, tên trộm vứt xe chạy thục mạng',
        kicker: '🏘️ SỨC MẠNH CỘNG ĐỒNG',
        karmaDelta: { community: 20, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Cả Hẻm Đồng Lòng!',
        reactionNarrative: 'Nghe tiếng tri hô, bà con đầu ngõ ùa ra chặn kín hai đầu ngách. Tên trộm vứt xe chạy bộ thoát thân, chiếc xe của khách được bảo vệ an toàn!'
      }
    ]
  },

  // 15. Cúp điện giờ cao điểm (Chương 2, Ngày 15)
  {
    id: 'incident_blackout',
    title: 'Cúp Điện Đột Ngột Giữa Giờ Đông Khách',
    categoryTag: 'CÚP ĐIỆN ĐỘT NGỘT',
    icon: '⚡',
    characterName: 'Anh Dũng Thợ Điện',
    characterAvatar: '⚡',
    characterImg: charImg('char_22_electrician_dung.png'),
    emoteBubble: '🕯️',
    characterRole: 'Kỹ Thuật Viên Điện Lực',
    context: '19h00 tối, tiếng "bụp" ngoài trạm biến áp, cả con hẻm chìm vào bóng tối. Khách đang ngồi đông nghẹt bắt đầu nhốn nháo khi quạt và đèn vụt tắt.',
    dialogue: 'Đứt cáp đầu hẻm rồi con ơi! Thợ điện báo phải mất ít nhất 1 tiếng nữa mới nối xong. Quán tính sao đây?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 15,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2 (Ngày 15): Sự cố mất điện bất ngờ trong hẻm sâu.',
    choices: [
      {
        id: 'blackout_candles',
        label: 'Thắp nến trên từng bàn & mở nhạc hát',
        subDesc: 'Tốn 20k mua nến, khách thích thú quay clip tiệm gà lãng mạn nhất Sài Gòn',
        kicker: '🕯️ BIẾN NGUY THÀNH CƠ',
        karmaDelta: { community: 25, craftsmanship: 10, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Đêm Gà Rán Dưới Ánh Nến Lãng Mạn',
        reactionNarrative: 'Những ngọn nến lung linh bừng sáng. Bạn tặng mỗi bàn một ly nước mát và cùng nhân viên gảy đàn hát những khúc ca vui vẻ. Khách thích thú quay video check-in "Tiệm gà lãng mạn nhất Sài Gòn"!'
      },
      {
        id: 'blackout_generator',
        label: 'Kéo máy nổ dự phòng chạy tiếp',
        subDesc: 'Tốn 50k xăng máy nổ, bếp vẫn đỏ lửa ra món liên tục không gián đoạn',
        kicker: '⚡ ĐẦU TƯ BẢN LĨNH',
        karmaDelta: { ambition: 20, craftsmanship: 15 },
        moneyDelta: -50000,
        reactionTitle: 'Bếp Vẫn Đỏ Lửa Trong Đêm',
        reactionNarrative: 'Máy nổ gầm vang, ánh đèn bật sáng trở lại. Mùi gà rán thơm lừng vẫn tỏa khắp con ngõ tối, đơn hàng vẫn ra đều đặn không gián đoạn phút nào!'
      },
      {
        id: 'blackout_refund_close',
        label: 'Xin lỗi, hoàn tiền đơn dở & đóng cửa sớm',
        subDesc: 'Mất 100k tiền hoàn đơn, cả tiệm có một buổi tối quây quần nghỉ ngơi',
        kicker: '🚪 NGHỈ NGƠI AN TOÀN',
        karmaDelta: { craftsmanship: 10, ambition: -15 },
        moneyDelta: -100000,
        reactionTitle: 'Một Tối Nghỉ Ngơi Sớm',
        reactionNarrative: 'Khách thông cảm nhận lại tiền và hẹn hôm khác quay lại. Đội ngũ nhân viên có một buổi tối hiếm hoi được nghỉ ngơi quây quần bên nhau.'
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 3: MẶT TIỀN PHỐ LỚN & ĐỐI THỦ CẠNH TRANH (CHƯƠNG 3, NGÀY 19 - 35)
  // =========================================================================

  // 16. Bể ống nước sạch đầu hẻm (Chương 3, Ngày 19)
  {
    id: 'incident_water_outage',
    title: 'Bể Đường Ống Nước Sạch Đầu Hẻm',
    categoryTag: 'KHỦNG HOẢNG NƯỚC SẠCH',
    icon: '🚰',
    characterName: 'Chú Bảy Thợ Hồ',
    characterAvatar: '👴',
    characterImg: charImg('char_23_builder_bay.png'),
    emoteBubble: '🚰',
    characterRole: 'Công Nhân Xây Dựng Hẻm',
    context: 'Xe tải cán vỡ đường ống nước máy đầu hẻm, toàn khu vực bị cắt nước sạch trong 5 tiếng đúng lúc tiệm đang cần rửa chén bát dồn dập.',
    dialogue: 'Cắt nước toàn hẻm tới tối muộn mới sửa xong nghen con! Nhà nào lo trữ nước nấu ăn đi!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 19,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 3: Khủng hoảng nguồn nước sạch giờ phục vụ cao điểm.',
    choices: [
      {
        id: 'water_buy_purified',
        label: 'Mua 10 bình nước khoáng rửa tiệt trùng',
        subDesc: 'Tốn 120k mua nước bình, đảm bảo vệ sinh 5 sao, khách tin tưởng tuyệt đối',
        kicker: '🧼 VỆ SINH TUYỆT ĐỐI',
        karmaDelta: { craftsmanship: 20, community: 10 },
        moneyDelta: -120000,
        reactionTitle: 'Đẳng Cấp An Toàn Vệ Sinh',
        reactionNarrative: 'Chấp nhận tốn thêm tiền mua nước bình tinh khiết, từng chiếc khay, chiếc kẹp đều được rửa sạch bóng không tì vết. Khách thấy quán dùng nước lọc rửa đồ càng thêm tin tưởng bội phần!'
      },
      {
        id: 'water_use_stagnant',
        label: 'Múc nước bể ngầm cũ dùng tạm',
        subDesc: 'Tiết kiệm chi phí, nhưng nước ngả vàng canh cánh nỗi lo',
        kicker: '⚠️ TIẾT KIỆM NGUY CƠ',
        karmaDelta: { ambition: 10, craftsmanship: -15 },
        moneyDelta: 0,
        reactionTitle: 'Rửa Nước Lắng Cũ',
        reactionNarrative: 'Nước bể ngầm hơi ngả vàng khiến chén đĩa không được sạch bóng như thường ngày. Bạn tiết kiệm được ít tiền nhưng canh cánh nỗi lo vệ sinh.'
      },
      {
        id: 'water_takeaway_only',
        label: 'Chuyển sang chỉ bán mang đi (hộp giấy)',
        subDesc: 'Tốn 30k hộp giấy, linh hoạt thích ứng không tốn giọt nước',
        kicker: '📦 LINH HOẠT THÍCH ỨNG',
        karmaDelta: { craftsmanship: 10, ambition: 5 },
        moneyDelta: -30000,
        reactionTitle: 'Giải Pháp Hộp Giấy Thông Minh',
        reactionNarrative: 'Toàn bộ đơn hàng được đóng gói trong hộp giấy thân thiện môi trường, vừa sạch sẽ vừa không tốn nước rửa chén!'
      }
    ]
  },

  // 17. Bỏ quên iPhone 15 Pro Max (Chương 3, Ngày 20)
  {
    id: 'incident_lost_iphone',
    title: 'Khách Bỏ Quên iPhone 15 Pro Max Trên Bàn',
    categoryTag: 'CỦA RƠI HẺM PHỐ',
    icon: '📱',
    characterName: 'Bé Linh Phụ Bếp',
    characterAvatar: '👩',
    characterImg: charImg('char_03_helper_linh.png'),
    emoteBubble: '💎',
    characterRole: 'Phục Vụ Bàn',
    context: 'Dọn dẹp bàn số 2 sau khi tốp khách văn phòng rời đi, nhân viên phát hiện chiếc iPhone đời mới trị giá 30 triệu nằm dưới kẽ ghế sofa.',
    dialogue: 'Anh chủ ơi, khách bàn 2 bỏ quên chiếc điện thoại xịn đét này nè anh! Chuông đang reo liên tục có người gọi đến!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 20,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 3: Thử thách lòng trung thực trước tài sản giá trị lớn.',
    choices: [
      {
        id: 'iphone_return_prompt',
        label: 'Bắt máy & trao trả tận tay khách',
        subDesc: 'Khách mừng rớt nước mắt, gửi tặng 200k uống nước và chấm 5 sao',
        kicker: '❤️ THẬT THÀ LÀ VỐN QUÝ',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 200000,
        reactionTitle: 'Chữ Tín Lan Tỏa Hẻm Sâu',
        reactionNarrative: 'Chủ nhân chiếc máy hớt hải chạy lại tiệm, mừng rỡ khi thấy tài sản còn nguyên vẹn. Khách cảm kích gửi tặng đội ngũ 200.000đ uống nước và viết bài review 5 sao ca ngợi sự tử tế của quán!'
      },
      {
        id: 'iphone_post_threads',
        label: 'Đăng Threads tìm chủ nhân kèm ảnh tiệm',
        subDesc: 'Bài viết viral nghìn share, khách tìm được máy còn tiệm nổi như cồn',
        kicker: '📢 TIẾP THỊ LAN TỎA',
        karmaDelta: { ambition: 15, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Bài Viết Viral Nổi Tiếng!',
        reactionNarrative: 'Bài đăng tìm người đánh rơi nhận được hàng nghìn lượt chia sẻ vì nghĩa cử đẹp. Khách tìm lại được máy, còn tiệm gà thì nổi tiếng khắp cõi mạng!'
      },
      {
        id: 'iphone_keep_silent',
        label: 'Cất vào tủ chờ khách tự quay lại',
        subDesc: 'Khách nhận lại đồ nhưng thắc mắc sao gọi nhiều cuộc không ai nghe máy',
        kicker: '🤫 THỤ ĐỘNG CẨN THẬN',
        karmaDelta: { ambition: 5, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Khách Quay Lại Nhận Đồ',
        reactionNarrative: 'Hôm sau khách mới nhớ ra quay lại hỏi. Bạn trả lại điện thoại an toàn nhưng khách vẫn hơi thắc mắc sao hôm qua gọi nhiều cuộc không thấy ai nghe máy.'
      }
    ]
  },

  // 18. Người yêu cũ dẫn người mới ghé tiệm (Chương 3, Ngày 22)
  {
    id: 'incident_ex_lover',
    title: 'Người Yêu Cũ Dẫn Người Mới Ghé Quán',
    categoryTag: 'NGƯỜI CŨ GHÉ THĂM',
    icon: '💔',
    characterName: 'Chị Nga ATM',
    characterAvatar: '💃',
    characterImg: charImg('char_29_atm_nga.png'),
    emoteBubble: '💔',
    characterRole: 'Người Xưa Từng Chê Xe Đẩy',
    context: 'Bước vào quán là cô bạn gái cũ từng chia tay bạn vì "anh bán gà rán vỉa hè không có tương lai", nay đi cùng một anh chàng đi xe sang ăn mặc bảnh bao.',
    dialogue: 'Ủa... anh là chủ tiệm gà đông khách này hả? Em thấy rần rần trên mạng nên dắt bạn trai ghé ăn thử, không ngờ là quán của anh...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 22,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 3 (Ngày 22): Cuộc hội ngộ bất ngờ với người yêu cũ năm xưa.',
    choices: [
      {
        id: 'ex_serve_perfect',
        label: 'Tự tay làm phần Gà Perfect đỉnh cao',
        subDesc: 'Thu 80k, phong thái bản lĩnh tự tin khiến cả hai trầm trồ nể phục',
        kicker: '👑 PHONG THÁI BẢN LĨNH',
        karmaDelta: { craftsmanship: 20, ambition: 20, community: 10 },
        moneyDelta: 80000,
        reactionTitle: 'Đẳng Cấp Của Sự Trưởng Thành!',
        reactionNarrative: 'Đĩa gà vàng óng, da giòn rụm tỏa khói nghi ngút được bạn bưng ra với nụ cười tự tin, phong thái đĩnh đạc của một người làm chủ chân chính. Cả hai người họ ăn xong phải trầm trồ thán phục!'
      },
      {
        id: 'ex_extra_spicy',
        label: 'Cho gấp ba lượng ớt siêu cay cho bõ tức',
        subDesc: 'Thu 50k, bạn trai mặt đỏ gay tu 3 chai nước, người cũ ngượng ngùng rời đi',
        kicker: '🌶️ TRẢ THÙ NGỌT NGÀO',
        karmaDelta: { ambition: 10, craftsmanship: -15 },
        moneyDelta: 50000,
        reactionTitle: 'Cay Đến Chảy Nước Mắt',
        reactionNarrative: 'Anh bạn trai ăn miếng đầu tiên mặt mày đỏ gay, uống cạn sạch 3 chai nước ngọt. Ngọc Lan biết bạn chơi khăm nhưng chỉ biết cười trừ rồi vội vã rời đi.'
      },
      {
        id: 'ex_hide_kitchen',
        label: 'Lánh mặt sau bếp để nhân viên phục vụ',
        subDesc: 'Thu 50k, giữ khoảng cách bình yên mỉm cười nhìn người xưa khuất bóng',
        kicker: '🙈 TRÁNH CHUYỆN THỊ PHI',
        karmaDelta: { community: 5, ambition: -10 },
        moneyDelta: 50000,
        reactionTitle: 'Giữ Khoảng Cách An Yên',
        reactionNarrative: 'Khách ăn xong tính tiền ra về êm thấu. Bạn đứng bên chảo dầu nhìn bóng lưng người xưa khuất dần, mỉm cười thanh thản vì mình đã đi được một chặng đường dài.'
      }
    ]
  },

  // 19. Đơn tiệc công ty 50 phần (Chương 3, Ngày 24)
  {
    id: 'incident_corporate_catering',
    title: 'Công Ty Đối Diện Đặt Gấp 50 Hộp Gà',
    categoryTag: 'ĐƠN TIỆC 50 HỘP',
    icon: '🏢',
    characterName: 'Bà Năm Đại Lý Sỉ',
    characterAvatar: '👩‍💼',
    characterImg: charImg('char_11_wholesale_nam.png'),
    emoteBubble: '🏢',
    characterRole: 'Khách Đặt Tiệc Đột Xuất',
    context: '16h30 chiều, chị trưởng phòng công ty tài chính chạy hớt hải sang tiệm gà thở không ra hơi.',
    dialogue: 'Em ơi cứu chị với! Công ty chị sếp tổng ghé đột xuất, cần ngay 50 phần gà rán khoai tây trong 40 phút nữa! Làm kịp chị gửi thêm 200k tiền bo!',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 24,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 3: Cơ hội đơn tiệc khổng lồ từ giới văn phòng.',
    choices: [
      {
        id: 'catering_rush_all',
        label: 'Cả đội dốc toàn lực chiên thần tốc',
        subDesc: 'Kiếm đậm 450k tiền lời, giao đúng 38 phút sếp lớn công ty khen nức nở',
        kicker: '⚡ THẦN TỐC TẬP TRUNG',
        karmaDelta: { ambition: 20, craftsmanship: 10 },
        moneyDelta: 450000,
        reactionTitle: 'Kỳ Tích 50 Hộp Gà Nóng Hổi!',
        reactionNarrative: 'Tất cả nhân viên phối hợp nhịp nhàng như một cỗ máy: người tẩm bột, người canh giỏ, người đóng hộp. Đúng 38 phút, 50 phần gà vàng ruộm thơm lừng được giao tận tay, sếp lớn công ty khen nức nở!'
      },
      {
        id: 'catering_refuse_quality',
        label: 'Từ chối: "40 phút không đảm bảo độ giòn"',
        subDesc: 'Không đánh đổi uy tín, khách hiểu và hôm sau đặt trước chu đáo',
        kicker: '🔥 GIỮ CHẤT LƯỢNG MÓN',
        karmaDelta: { craftsmanship: 25, ambition: -15 },
        moneyDelta: 0,
        reactionTitle: 'Không Đánh Đổi Uy Tín',
        reactionNarrative: 'Chị Mai hơi tiếc nhưng hiểu bạn là người coi trọng chất lượng món ăn trên hết. Hôm sau chị đặt trước 1 ngày để tiệm chuẩn bị chu đáo nhất.'
      },
      {
        id: 'catering_split_batch',
        label: 'Giao trước 25 phần, 25 phần sau 15 phút',
        subDesc: 'Kiếm 350k, gà luôn nóng giòn bỏng tay, khách cảm ơn sự linh hoạt',
        kicker: '🧠 LINH HOẠT THIỆN CHÍ',
        karmaDelta: { ambition: 15, craftsmanship: 10, community: 10 },
        moneyDelta: 350000,
        reactionTitle: 'Giải Pháp Vẹn Cả Đôi Đường',
        reactionNarrative: 'Công ty chia thành hai đợt tiệc vừa vặn, gà mang lên lúc nào cũng nóng giòn bỏng tay. Chị Mai cảm ơn sự linh hoạt tuyệt vời của quán!'
      }
    ]
  },

  // 20. Đầu gấu đòi tiền bảo kê (Chương 3, Ngày 26)
  {
    id: 'incident_protection_racketeer',
    title: 'Đầu Gấu Đòi "Phí An Ninh Trật Tự"',
    categoryTag: 'ĐÒI TIỀN BẢO KÊ',
    icon: '🥋',
    characterName: 'Đại Ca Beo',
    characterAvatar: '🦹‍♂️',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '⚡',
    characterRole: 'Giang Hồ Vặt Xăm Trổ',
    context: 'Ba thanh niên xăm trổ ngồi rung đùi gác chân lên bàn khi thấy tiệm phát đạt, nói chuyện oang oang đòi thu tiền "an ninh".',
    dialogue: 'Quán làm ăn đông khách quá ta. Mặt tiền này xe cộ phức tạp lắm đó, mỗi tháng gửi anh em 300k tiền nước non bảo kê xe cộ cho yên ổn nghen!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 3,
    minDay: 26,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 3 (Ngày 26): Mặt tiền lớn thu hút sự chú ý của các băng nhóm bảo kê.',
    choices: [
      {
        id: 'racketeer_sec_bust',
        label: 'Chú Bảo Vệ bước ra cùng đội cựu chiến binh',
        subDesc: '👮 Chú Tư từng là công an khu vực: Hải Búa tái mét mặt xin lỗi rồi lủi mất',
        kicker: '👮 BẢO VỆ CỨNG CỰA',
        requiresSecurity: true,
        karmaDelta: { community: 20, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Đầu Gấu Cụp Đuôi Chạy Lẹ!',
        reactionNarrative: 'Chú Bảo Vệ tiến lại vỗ vai Hải Búa: "Ủa Hải, mày mới ra trại hả con? Dám vào hẻm này quậy tiệm cháu tao à?". Nhận ra chú bảo vệ từng là công an khu vực uy tín, cả đám tái mét mặt xin lỗi rồi lủi mất tăm!'
      },
      {
        id: 'racketeer_call_police',
        label: 'Báo ngay Bác Ba và Công An Phường',
        subDesc: 'Công an có mặt lập biên bản răn đe, khu hẻm giữ vững trật tự',
        kicker: '⚖️ THƯỢNG TÔN PHÁP LUẬT',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Công An Phường Tới Kịp Thời',
        reactionNarrative: 'Chỉ 5 phút sau khi Bác Ba gọi điện, các chiến sĩ công an phường có mặt lập biên bản răn đe. Khu hẻm trở lại trật tự nghiêm minh.'
      },
      {
        id: 'racketeer_pay_quiet',
        label: 'Bấm bụng đưa 300.000đ cho êm ấm',
        subDesc: 'hên xui: chúng bỏ đi êm thấm, hoặc tuần sau kéo tới đòi tăng 500k',
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

  // 21. Quán đối thủ sai người đến thả ruồi (Chương 3, Ngày 28)
  {
    id: 'incident_rival_fly',
    title: 'Kẻ Lạ Mặt Thả Ruồi Vào Dĩa Gà',
    categoryTag: 'ĐỐI THỦ PHÁ ĐÁM',
    icon: '🪰',
    characterName: 'Gã Mắt Lươn',
    characterAvatar: '🕶️',
    characterImg: charImg('char_28_tough_beo.png'),
    emoteBubble: '⚠️',
    characterRole: 'Kẻ Phá Rối Nặc Danh',
    context: 'Một gã đàn ông ngồi góc khuất lấm lét ngó nghiêng, rồi lén rút từ bao thuốc lá ra một con ruồi chết thả vào đĩa gà đang bốc khói, lập tức đập bàn la toáng lên!',
    dialogue: 'Trời ơi! Quán làm ăn dơ bẩn cỡ này hả? Gà rán có nguyên con ruồi to đùng! Đền tôi 500k tiền viện phí không tôi chụp hình bóc phốt lên mạng cho sập tiệm!',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 3,
    minDay: 28,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 3 (Ngày 28): Đòn bẩn phá hoại từ chuỗi gà đối thủ MegaChicken.',
    choices: [
      {
        id: 'fly_cook_proof',
        label: '👨‍🍳 Bếp Trưởng chứng minh dầu 180°C không để ruồi nguyên vẹn',
        subDesc: '👨‍🍳 Bếp Trưởng đối chất khoa học: Gà chiên 180°C ruồi phải cháy đen, kẻ phá hoại chạy mất dạng',
        kicker: '👨‍🍳 BẾP TRƯỞNG ĐỐI CHẤT',
        requiresRole: 'cook',
        requiresRoleDesc: '🔒 Cần tuyển Phụ Bếp tại tab Nhân viên để chứng minh nhiệt độ dầu',
        karmaDelta: { craftsmanship: 20, ambition: 15 },
        moneyDelta: 0,
        reactionTitle: 'Tay Nghề Bếp Trưởng Lật Tẩy Kẻ Gian!',
        reactionNarrative: 'Bếp trưởng bước ra gắp con ruồi lên cười nhạt: "Gà tiệm tôi chiên ngập dầu 180 độ C, ruồi rơi vào là cháy giòn tan thành tro. Con ruồi này cánh còn nguyên, ướt nhẹp nước lã!". Cả quán ồ lên vỗ tay tán thưởng, kẻ phá hoại ôm mặt tháo chạy!'
      },
      {
        id: 'fly_security_bust',
        label: 'Chú Bảo Vệ giữ tay, trích camera góc quán',
        subDesc: '👮 Chú Tư lật tẩy cảnh rút ruồi từ bao thuốc lá, kẻ phá hoại chạy mất dạng',
        kicker: '👮 BẢO VỆ BẮT QUẢ TANG',
        requiresSecurity: true,
        karmaDelta: { community: 10, craftsmanship: 15 },
        moneyDelta: 0,
        reactionTitle: 'Lật Tẩy Kẻ Đê Hèn!',
        reactionNarrative: 'Chú Bảo Vệ đã để mắt tới gã từ lúc vào quán. Chú chỉ tay thẳng vào mắt kính của gã: "Camera góc kia quay rõ mồn một cảnh anh rút ruồi từ bao thuốc lá ra nhé!". Gã tái mặt, lủi thủi chuồn mất dạng giữa tiếng cười chê của thực khách!'
      },
      {
        id: 'fly_no_sec_pay',
        label: 'Bấm bụng đền 200k cho êm chuyện',
        subDesc: 'hên xui: êm ấm tạm thời, hoặc mất 200k mà vẫn bị chụp ảnh bôi nhọ',
        kicker: '💸 NGẬM BỒ HÒN LÀM NGỌT',
        riskRate: 0.8,
        mitigatedByRoles: ['security', 'cook', 'manager'],
        karmaDelta: { ambition: -10, craftsmanship: -5 },
        moneyDelta: -200000,
        reactionTitle: 'Thiệt Đơn Thiệt Kép',
        reactionNarrative: 'Vì không có người an ninh đối chất, bạn đành móc tiền túi đền cho gã để dập tắt ồn ào. Gã đắc chí đút túi tiền rồi hí hửng rời đi.',
        reactionFailureNarrative: 'Bạn vừa đền tiền xong thì gã vẫn lên mạng đăng một bài ẩn danh bịa đặt. Không có bảo vệ hay bằng chứng rõ ràng, quán bị mất oan một khoản tiền!'
      },
      {
        id: 'fly_scientific_proof',
        label: 'Đối chất khoa học: Dầu 180°C ruồi phải cháy đen',
        subDesc: 'Cả quán vỗ tay ủng hộ chứng minh chuẩn xác, kẻ phá rối xấu hổ trốn tiệt',
        kicker: '🔥 CHÂN LÝ LỬA VÀ DẦU',
        karmaDelta: { craftsmanship: 20, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Chân Tướng Rõ Ràng!',
        reactionNarrative: 'Bạn điềm tĩnh chỉ ra: "Dầu chiên ở 180°C, nếu ruồi rơi vào từ đầu thì cánh và thân đã cháy giòn tan từ lâu, không thể còn nguyên vẹn và tươi thế này được!". Khách xung quanh đồng thanh vỗ tay ủng hộ, kẻ phá rối xấu hổ trốn tiệt.'
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 4: ĐẾ CHẾ BISTRO & THỬ THÁCH BẢN LĨNH TRIỆU ĐÔ (CHƯƠNG 4-5, NGÀY 36+)
  // =========================================================================

  // 22. Tin đồn bóc phốt ảo dầu bẩn (Chương 4, Ngày 36)
  {
    id: 'incident_rumor_social',
    title: 'Bài Viết Bóc Phốt Ảo "Quán Dùng Dầu Đen Chiên Lại"',
    categoryTag: 'BÃO DƯ LUẬN ẢO',
    icon: '📢',
    characterName: 'Bà Tám Hóng Mát',
    characterAvatar: '👻',
    characterImg: charImg('char_31_gossip_tam.png'),
    emoteBubble: '💬',
    characterRole: 'Camera Chạy Bằng Cơm Hẻm 1102',
    context: 'Một tài khoản nặc danh đăng lên nhóm khu phố Facebook bài viết vu khống quán chiên gà bằng dầu đen khét lẹt gây ung thư, thu hút nhiều bình luận hoang mang.',
    dialogue: '(Ảnh chụp chảo dầu cháy đen ở quán nào đó trên mạng ghép vào tên Tiệm Gà Nhà Tui...)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 36,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 4: Bão truyền thông ác ý nhắm vào uy tín thương hiệu.',
    choices: [
      {
        id: 'rumor_manager_crisis_pr',
        label: '👔 Quản Lý phát hành video quy trình chuẩn ISO & voucher',
        subDesc: '👔 Quản lý xử lý khủng hoảng truyền thông 5 sao: Biến drama thành cơ hội viral (+50k doanh thu)!',
        kicker: '👔 QUẢN LÝ XỬ LÝ KHỦNG HOẢNG',
        requiresRole: 'manager',
        requiresRoleDesc: '🔒 Cần tuyển Quản Lý Ca tại tab Nhân viên để xử lý truyền thông chuyên nghiệp',
        karmaDelta: { craftsmanship: 20, ambition: 20, community: 15 },
        moneyDelta: 50000,
        reactionTitle: 'Quản Lý Biến Khủng Hoảng Thành Thắng Lợi!',
        reactionNarrative: 'Quản Lý ca lập tức đăng video quy trình kiểm định que test dầu đạt chuẩn ISO, đồng thời mở tour tham quan gian bếp tặng voucher 50k. Drama lập tức bị đập tan, lượng khách kéo tới ủng hộ tăng vọt kỷ lục!'
      },
      {
        id: 'rumor_livestream_oil',
        label: 'Livestream que đo dầu & quy trình sạch bóng',
        subDesc: 'Minh bạch 100%, cộng đồng quay sang chỉ trích kẻ vu khống, tiệm thêm uy tín',
        kicker: '🔥 MINH BẠCH BẰNG SỰ THẬT',
        karmaDelta: { craftsmanship: 25, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Sự Thật Đánh Bại Mọi Tin Đồn!',
        reactionNarrative: 'Bạn bật livestream quay cận cảnh chảo dầu vàng trong vắt, dùng que thử test chuẩn ATTP trước hàng trăm người xem. Cư dân mạng quay sang chỉ trích kẻ bịa đặt và khen ngợi tiệm gà uy tín số 1!'
      },
      {
        id: 'rumor_invite_neighbors',
        label: 'Mời Bác Ba & ban quản trị khu phố chứng thực',
        subDesc: 'Cả khu phố lên tiếng bảo chứng, tin đồn ác ý tan biến như bọt nước',
        kicker: '🏘️ BẢO CHỨNG BÀ CON HẺM',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: 0,
        reactionTitle: 'Tiếng Nói Của Cả Khu Phố',
        reactionNarrative: 'Bác Ba cùng ban quản trị đích thân viết bài xác nhận tiệm luôn tuân thủ vệ sinh sạch sẽ bậc nhất khu vực. Tin đồn ác ý tan biến như bọt xà phòng!'
      },
      {
        id: 'rumor_ignore',
        label: 'Im lặng không quan tâm, hữu xạ tự nhiên hương',
        subDesc: 'Khách mới hơi chần chừ mất 50k, khách quen vẫn nhiệt tình ủng hộ',
        kicker: '🤫 IM LẶNG LÀ VÀNG',
        karmaDelta: { ambition: -10, craftsmanship: 5 },
        moneyDelta: -50000,
        reactionTitle: 'Khách Hơi E Ngại Ban Đầu',
        reactionNarrative: 'Một số khách mới hơi chần chừ khi ghé ăn, nhưng khách quen trong hẻm vẫn ủng hộ nhiệt tình giúp tiệm vượt qua sóng gió.'
      }
    ]
  },

  // 23. Đại gia đình 10 người đòi xô gà độc bản (Chương 4, Ngày 38)
  {
    id: 'incident_giant_bucket',
    title: 'Đại Gia Đình 10 Người Đòi Xô Gà Độc Bản',
    categoryTag: 'ĐẠI GIA ĐÌNH SUM VẦY',
    icon: '👨‍👩‍👧‍👦',
    characterName: 'Cụ Ba Quạt Nón',
    characterAvatar: '👵',
    characterImg: charImg('char_06_granny_ba.png'),
    emoteBubble: '🍗',
    characterRole: 'Bô Lão Hẻm 1102 & Đại Gia Đình',
    context: 'Cả gia đình 3 thế hệ gồm ông bà, cha mẹ và 4 đứa nhỏ đi mừng thọ ghé tiệm muốn thưởng thức một bữa tiệc gà rán đáng nhớ.',
    dialogue: 'Tiệm có xô gà nào to bự đủ cho 10 người ăn mà có cả gà cay cho ba mẹ, gà ngọt cho tụi nhỏ và cháo gà nóng cho ông bà không cháu ơi?',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 38,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 4: Bữa tiệc sum vầy của đại gia đình 3 thế hệ.',
    choices: [
      {
        id: 'giant_custom_craft',
        label: 'Sáng tạo Xô Đại Sum Vầy & tặng kem các bé',
        subDesc: 'Thu 320k, đủ vị cay ngọt và cháo nóng, cả nhà quây quần hạnh phúc',
        kicker: '👑 NGHỆ THUẬT PHỤC VỤ TẬN TÂM',
        karmaDelta: { craftsmanship: 20, community: 20 },
        moneyDelta: 320000,
        reactionTitle: 'Bữa Tiệc Gia Đình Đại Viên Mãn!',
        reactionNarrative: 'Cả gia đình quây quần ấm cúng bên chiếc xô gà khổng lồ rực rỡ sắc màu. Ông bà khen súp thơm ngọt, tụi nhỏ liếm ngón tay khen gà giòn rụm. Cả nhà chụp bức ảnh kỷ niệm tuyệt đẹp trước tiệm!'
      },
      {
        id: 'giant_standard_combos',
        label: 'Tư vấn 3 combo tiêu chuẩn trong menu',
        subDesc: 'Thu 250k, phục vụ chuẩn thực đơn nhanh chóng ngăn nắp',
        kicker: '📋 QUY CHUẨN MENU',
        karmaDelta: { ambition: 15, craftsmanship: 5 },
        moneyDelta: 250000,
        reactionTitle: 'Phục Vụ Đúng Chuẩn',
        reactionNarrative: '3 phần combo được dọn ra nhanh chóng. Cả nhà ăn uống vui vẻ theo đúng thực đơn niêm yết.'
      },
      {
        id: 'giant_add_surcharge',
        label: 'Phụ thu 20% phí phục vụ bàn đông',
        subDesc: 'Thu 380k, túi tiền rủng rỉnh nhưng bữa ăn mất đi một chút vị ngọt ngào',
        kicker: '💼 TỐI ƯU DOANH THU',
        karmaDelta: { ambition: 20, community: -15 },
        moneyDelta: 380000,
        reactionTitle: 'Thu Đậm Nhưng Kém Ấm Cúng',
        reactionNarrative: 'Gia đình thanh toán đủ tiền nhưng người lớn có phần phàn nàn vì khoản phụ thu bất ngờ. Bữa ăn mất đi một chút vị ngọt ngào.'
      }
    ]
  },

  // 24. Lái buôn chào gà đông lạnh nhập lậu (Chương 4, Ngày 40)
  {
    id: 'incident_cheap_meat_dealer',
    title: 'Lái Buôn Gạ Bán Thịt Gà Lậu Giá Rẻ Một Nửa',
    categoryTag: 'CÁM DỖ GÀ BẨN',
    icon: '🍗',
    characterName: 'Bác Tài Long',
    characterAvatar: '🚚',
    characterImg: charImg('char_21_trucker_long.png'),
    emoteBubble: '🍖',
    characterRole: 'Tài Xế Xe Đông Lạnh Thịt Sạch',
    context: 'Một tay buôn ghé tiệm sáng sớm thì thào gạ gẫm cung cấp nguồn thịt gà đông lạnh trôi nổi giá rẻ mạt để ăn chênh lệch dày.',
    dialogue: 'Em trai, anh có mối gà đông lạnh xả hàng giá chỉ bằng 35% thị trường thôi. Bột chiên đậm đà tẩm vào là giòn rụm ai biết đâu mà lần, mỗi tháng bỏ túi thêm 15-20 triệu ngon ơ!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 40,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 4 (Ngày 40): Cám dỗ siêu lợi nhuận từ nguồn thịt gà bẩn.',
    choices: [
      {
        id: 'meat_reject_proudly',
        label: 'Cự tuyệt: "Tiệm chỉ dùng gà tươi kiểm dịch!"',
        subDesc: 'Giữ vững đạo đức nghề bếp, thịt gà tươi ngọt tự nhiên không ai sánh bằng',
        kicker: '🔥 ĐẠO ĐỨC NGHỀ NGHIỆP TỐI THƯỢNG',
        karmaDelta: { craftsmanship: 25, community: 15, ambition: -5 },
        moneyDelta: 0,
        reactionTitle: 'Lương Tâm Người Làm Bếp Vững Vàng!',
        reactionNarrative: 'Tay buôn bĩu môi bỏ đi. Bạn ngẩng cao đầu chuẩn bị từng mẻ thịt gà tươi nguyên óng ả. Hương vị ngọt thơm tự nhiên từ gà tươi chính là bí quyết không đế chế nào sao chép được!'
      },
      {
        id: 'meat_buy_cheap',
        label: 'Ham lời nhập thử 1 thùng tối ưu chi phí',
        subDesc: 'Kiếm thêm 300k, nhưng thịt bở bùng bục có mùi lạ bị khách chê tụt sao',
        kicker: '⚠️ CON ĐƯỜNG TỘI LỖI',
        karmaDelta: { ambition: 30, craftsmanship: -30, community: -25 },
        moneyDelta: 300000,
        reactionTitle: 'Hậu QuẢ Thịt Đông Lạnh Bở Nát',
        reactionNarrative: 'Thịt chiên lên bị ra nước, bở bùng bục và có mùi lạ. Khách quen ăn thử liền nhăn mặt chê bai, đánh tụt điểm sao của tiệm!'
      },
      {
        id: 'meat_report_authorities',
        label: 'Báo biển số xe cho Quản Lý Thị Trường',
        subDesc: 'Được thưởng nóng 100k và giấy khen, xóa sổ một kho hàng lậu',
        kicker: '⚖️ BẢO VỆ CỘNG ĐỒNG',
        karmaDelta: { community: 25, craftsmanship: 15 },
        moneyDelta: 100000,
        reactionTitle: 'Xóa Sổ Điểm Thực Phẩm Bẩn',
        reactionNarrative: 'Nhờ tin báo chuẩn xác của bạn, đội kiểm tra đã chặn đứng kho thịt bẩn tuồn ra thị trường. Cơ quan trao giấy khen cho tiệm vì ý thức trách nhiệm cao!'
      }
    ]
  },

  // 25. MegaChicken gạ mua công thức 20 triệu (Chương 4, Ngày 42)
  {
    id: 'incident_rival_poach',
    title: 'MegaChicken Gạ Mua Công Thức 20 Triệu',
    categoryTag: 'GẠ MUA CÔNG THỨC',
    icon: '💰',
    characterName: 'Anh Hưng Trúng Số',
    characterAvatar: '👔',
    characterImg: charImg('char_10_winner_hung.png'),
    emoteBubble: '💰',
    characterRole: 'Thực Khách Đại Diện Chuỗi Lớn',
    context: 'Một người đàn ông ăn mặc lịch thiệp đưa danh thiếp tập đoàn đồ ăn nhanh đối diện, đặt chiếc phong bì dày cộp 20 triệu lên bàn bạn.',
    dialogue: 'Bột chiên của tiệm bạn giữ độ giòn da gà cực tốt sau 40 phút. Chúng tôi gửi bạn 20.000.000đ tiền mặt để chuyển giao tỉ lệ pha bột. Bạn vẫn được bán nhưng không được đăng ký thương hiệu.',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 4,
    minDay: 42,
    rarity: 'epic',
    unlockHint: 'Mở khóa ở Chương 4 (Ngày 42): Lời gạ gẫm 20 triệu tiền mặt mua đứt linh hồn quán.',
    choices: [
      {
        id: 'poach_reject_pride',
        label: 'Kiên quyết từ chối: "Linh hồn quán không thể bán!"',
        subDesc: 'Giữ vững bản lĩnh nghệ nhân, Bác Ba cười vang khen ngợi hết lời',
        kicker: '🔥 BẢN LĨNH NGHỆ NHÂN',
        karmaDelta: { craftsmanship: 25, community: 15, ambition: -10 },
        moneyDelta: 0,
        reactionTitle: 'Linh Hồn Không Thể Bán Đứng!',
        reactionNarrative: 'Đại diện MegaChicken lắc đầu tiếc nuối ra về. Bác Ba chứng kiến từ đầu cười vang: "Khá lắm con! Giữ được ngọn lửa của riêng mình thì chẳng sợ đế chế nào nuốt chửng!".'
      },
      {
        id: 'poach_take_cash',
        label: 'Cầm 20.000.000đ tiền mặt mở rộng tiệm ngay',
        subDesc: 'Có ngay 20 triệu vốn, nhưng đối thủ tung gà nhái giá rẻ đè bẹp thị trường',
        kicker: '🏢 CƠ HỘI LÀM GIÀU',
        karmaDelta: { ambition: 30, craftsmanship: -25, community: -15 },
        moneyDelta: 20000000,
        reactionTitle: 'Đổi Lấy Triệu Đồng',
        reactionNarrative: 'Túi tiền căng phồng 20 triệu giúp bạn nâng cấp mặt bằng tức thì. Nhưng ít hôm sau, chuỗi đối thủ bắt đầu tung ra món gà giống hệt tiệm bạn với giá rẻ mạt!'
      },
      {
        id: 'poach_fake_recipe',
        label: 'Giao công thức cơ bản lấy 10 triệu cọc',
        subDesc: 'Đút túi 10 triệu cọc, đối thủ chiên lên bột cứng ngắc không bao giờ bằng',
        kicker: '🦊 MẸO VẶT MA MÃNH',
        karmaDelta: { ambition: 15, craftsmanship: -15 },
        moneyDelta: 10000000,
        reactionTitle: 'Cú Lừa Ngoạn Mục',
        reactionNarrative: 'Bạn đút túi 10 triệu tiền cọc. Bên đối thủ hí hửng đem về thử nghiệm nhưng chiên lên bột vừa cứng vừa ngấy dầu, không bao giờ đạt được hương vị Tiệm Gà Nhà Tui!'
      }
    ]
  },

  // 26. Đại chiến tờ rơi với Gà Rán Phố Cao (Chương 3, Ngày 20+)
  {
    id: 'incident_pho_cao_flyer_war',
    title: 'Gà Rán Phố Cao Rải Tờ Rơi Giảm 50% Đầu Hẻm',
    categoryTag: 'ĐỐI THỦ CẠNH TRANH',
    icon: '⚔️',
    characterName: 'Quản Lý Khang (Chuỗi Phố Cao)',
    characterAvatar: '🕴️',
    characterImg: charImg('char_10_winner_hung.png'),
    emoteBubble: '📢',
    characterRole: 'Đại Diện Chuỗi Nhượng Quyền Phố Cao',
    context: 'Chuỗi Gà Rán Phố Cao thuê PG đứng ngay đầu Hẻm 1102 phát tờ rơi giảm giá 50%, kèm loa phát thanh chê gà rán vỉa hè trong hẻm "kém chuẩn công nghiệp" nhằm lôi kéo khách ruột của bạn.',
    dialogue: 'Gà rán chuẩn chuỗi 5 sao ngoài phố lớn giảm nửa giá đây! Tội gì chui vào hẻm ăn gà chiên vỉa hè!',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 20,
    rarity: 'rare',
    unlockHint: 'Mở khóa từ Chương 3 (Ngày 20): Chuỗi gà công nghiệp Phố Cao bắt đầu cạnh tranh khốc liệt.',
    choices: [
      {
        id: 'pho_cao_free_taste',
        label: 'Tung "Thách Thức Giòn Rụm" mời nếm thử miễn phí',
        subDesc: 'Tốn 50k gà tươi chiên nóng, khách ăn thử khen đứt đuôi chuỗi công nghiệp',
        kicker: '🍗 CHẤT LƯỢNG LÊN TIẾNG',
        karmaDelta: { craftsmanship: 25, community: 20 },
        moneyDelta: -50000,
        reactionTitle: 'Chiến Thắng Bằng Đẳng Cấp!',
        reactionNarrative: 'Bạn mang khay gà vừa vớt nóng hổi thơm phức ra đầu hẻm mời khách ăn thử đối chứng. Mùi thơm ngào ngạt đánh bại hoàn toàn gà đông lạnh của Phố Cao! Khách xếp hàng dài dằng dặc tràn vào hẻm 1102!'
      },
      {
        id: 'pho_cao_neighbors_support',
        label: 'Nhờ Bác Ba và bà con hẻm vận động văn minh',
        subDesc: 'Bà con hẻm 1102 ra đầu ngõ nhắc nhở, kiên quyết bảo vệ tiệm gà nhà mình',
        kicker: '🏘️ TÌNH LÀNG NGHĨA XÓM',
        karmaDelta: { community: 30, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Sức Mạnh Tình Thân Hẻm 1102',
        reactionNarrative: 'Bác Ba cùng các cô chú trong hẻm ra đầu ngõ nhắc nhở đội ngũ tiếp thị không được xả rác và gây ồn ào. Khách quen trong hẻm đồng thanh tuyên bố: "Gà ở đây tươi ngon nóng hổi, chuỗi máy móc tuổi gì sánh bằng!"'
      },
      {
        id: 'pho_cao_focus_kitchen',
        label: 'Mặc kệ đối thủ, tập trung canh chảo vàng giòn nhất',
        subDesc: 'Tập trung tối đa chất lượng phục vụ, không bị xao nhãng bởi chiêu trò',
        kicker: '🍳 TÂM BẤT BIẾN GIỮA DÒNG ĐỜI',
        karmaDelta: { craftsmanship: 20, ambition: 10 },
        moneyDelta: 0,
        reactionTitle: 'Hương Thơm Tự Nhiên Bay Xa',
        reactionNarrative: 'Bạn điềm tĩnh đứng bên chảo dầu nóng, canh từng mẻ gà vàng ươm hoàn hảo. Mùi thơm từ hẻm bay ra tận mặt đường lôi cuốn từng lượt khách tự tìm đến nếm thử.'
      }
    ]
  },

  // 27. Cứu nguy Shipper Phố Cao chết máy (Chương 3, Ngày 22+)
  {
    id: 'incident_pho_cao_shipper_help',
    title: 'Shipper Phố Cao Chết Máy Giữa Trưa Nắng Gắt',
    categoryTag: 'TÌNH NGHĨA HẺM 1102',
    icon: '🛵',
    characterName: 'Shipper Hoàng (Giao Phố Cao)',
    characterAvatar: '🛵',
    characterImg: charImg('char_19_shipper_tuan.png'),
    emoteBubble: '💦',
    characterRole: 'Tài Xế Giao Hàng Cho Chuỗi Đối Thủ',
    context: 'Một bạn shipper trẻ mặc áo đồng phục chuỗi Phố Cao dắt bộ chiếc xe xịt lốp trong trưa hè nắng đổ lửa 38°C, đứng mồ hôi nhễ nhại trước tiệm bạn, mặt tái mét vì sắp trễ đơn bị trừ lương.',
    dialogue: 'Anh/chị ơi cho em xin ngụm nước với... Xe em bể bánh giữa trưa, còn 3 đơn gà Phố Cao giao trễ là em bị trừ sạch tiền công ngày hôm nay...',
    phaseTiming: 'shift',
    isSecurityRisk: false,
    minChapter: 3,
    minDay: 22,
    rarity: 'rare',
    unlockHint: 'Mở khóa từ Chương 3 (Ngày 22): Tình người giữa cái nắng Sài Gòn và những con hẻm.',
    choices: [
      {
        id: 'shipper_fellow_support',
        label: '🛵 Shipper nhà nổ máy chạy giao giùm 1 đơn gấp cho bạn',
        subDesc: '🛵 Tình đồng nghiệp shipper: Giao giùm đơn gấp, cả hội tài xế ưu tiên nhận đơn app cho tiệm!',
        kicker: '🛵 CHIẾN HỮU ĐƯỜNG PHỐ',
        requiresRole: 'delivery',
        requiresRoleDesc: '🔒 Cần tuyển Shipper tại tab Nhân viên để kích hoạt tương trợ',
        karmaDelta: { community: 40, craftsmanship: 15 },
        moneyDelta: 0,
        reactionTitle: 'Chiến Hữu Đường Phố Tương Trợ Đỉnh Cao!',
        reactionNarrative: 'Shipper tiệm bạn nhảy lên xe nổ máy: "Để đó tui giao giùm ông 1 đơn gần đây cho, ông ngồi nghỉ uống nước đi!". Cả hội shipper công nghệ khu vực nghe tin đều cảm kích, từ đó về sau đơn app của tiệm luôn được tài xế nhận ngay sau 3 giây!'
      },
      {
        id: 'shipper_iced_tea_tools',
        label: 'Mời ly trà đá mát lạnh & chỉ tiệm Chú Tư vá xe nhanh',
        subDesc: 'Tốn 5k trà đá, shipper cảm kích đăng bài cảm ơn làm tiệm viral trên mạng xã hội',
        kicker: '💖 NGHĨA TÌNH SÀI GÒN',
        karmaDelta: { community: 35, craftsmanship: 10 },
        moneyDelta: -5000,
        reactionTitle: 'Nghĩa Cử Ấm Áp Giữa Trưa Hè!',
        reactionNarrative: 'Bạn rót ngay ly trà đá mát lạnh và dẫn bạn shipper sang tiệm Chú Tư vá xe cấp tốc. Bạn shipper sau đó viết bài cảm ơn "Chủ tiệm gà nhân hậu nhất Sài Gòn" trên nhóm Shipper Sài Gòn, kéo theo hàng trăm tài xế ủng hộ quán!'
      },
      {
        id: 'shipper_exchange_fresh',
        label: 'Bán giảm giá 1 hộp gà nóng của quán cho khách của anh ta',
        subDesc: 'Đổi hộp gà nguội ngắt thành gà tươi nóng hổi giúp shipper cứu nguy đơn',
        kicker: '🍗 TAY NGHỀ CỨU NGUY',
        karmaDelta: { craftsmanship: 25, community: 20 },
        moneyDelta: 30000,
        reactionTitle: 'Vị Cứu Tinh Của Khách Ăn Gà',
        reactionNarrative: 'Vị khách đặt đơn Phố Cao khi nhận được hộp gà chiên nóng giòn của Tiệm Gà Nhà Tui ngạc nhiên vì quá ngon, liền nhắn hỏi địa chỉ tiệm để từ nay chuyển hẳn sang ăn gà của quán bạn!'
      }
    ]
  }
];

// =========================================================================
// HỆ THỐNG SỰ KIỆN ĐỘNG VẬT & DỊCH HẠI BỔ TRỢ (34 - 36)
// =========================================================================
export const SPECIAL_ANIMAL_INCIDENTS: DailyIncident[] = [
  // 26. Chó Cỏ Vàng Trông Tiệm (Chương 1, Ngày 5+)
  {
    id: 'inc_pet_dog_adoption',
    title: 'Chú Chó Cỏ Vàng Lạc Đến Canh Xe',
    categoryTag: 'VỆ SĨ TRUNG THÀNH',
    icon: '🐕',
    characterName: 'Chó Cỏ Vàng',
    characterAvatar: '🐕',
    characterImg: charImg('pet_01_dog_vang.png'),
    emoteBubble: '🐾',
    characterRole: 'Vệ Sĩ Cửa Tiệm & Trông Đêm',
    context: 'Một chú chó cỏ lông vàng mượt mà, ngoe nguẩy đuôi đứng túc trực trước hiên quán. Khi có kẻ lạ dòm ngó xe máy, chú liền sủa gâu gâu đuổi đi.',
    dialogue: 'Gâu! Gâu gâu! (Vẫy đuôi mừng rỡ, ngồi ngoan ngoãn cạnh hàng xe máy khách dựng)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 1,
    minDay: 5,
    rarity: 'rare',
    unlockHint: 'Mở khóa từ Ngày 5: Một người bạn bốn chân trung thành xin nhận việc giữ xe.',
    choices: [
      {
        id: 'dog_adopt_guard',
        label: 'Nhận nuôi làm Vệ Sĩ Canh Cửa (30k thịt)',
        subDesc: 'Được chú chó trung thành bảo vệ bãi xe, giảm 80% rủi ro trộm xe',
        kicker: '🐕 BẠN BỐN CHÂN TRUNG THÀNH',
        karmaDelta: { community: 25, craftsmanship: 10 },
        moneyDelta: -30000,
        reactionTitle: 'Vệ Sĩ Bốn Chân Của Tiệm Gà!',
        reactionNarrative: 'Được ăn đĩa gà luộc thơm lừng, Chó Vàng ngoan ngoãn nằm canh hàng xe máy của khách suốt ngày đêm. Khách tới ăn ai cũng khen chú chó thông minh, an tâm ăn uống!'
      },
      {
        id: 'dog_give_bone_only',
        label: 'Cho gặm khúc xương rồi vuốt ve',
        subDesc: 'Tiết kiệm chi phí, chú chó vui vẻ gặm xương rồi đi dạo quanh hẻm',
        kicker: '🍖 BỮA ĂN ẤM ÁP',
        karmaDelta: { community: 15, ambition: 5 },
        moneyDelta: 0,
        reactionTitle: 'Bữa Ăn Ngon Miệng',
        reactionNarrative: 'Chú Vàng mừng rỡ gặm khúc xương gà giòn sần sật rồi vẫy đuôi chạy chơi quanh hẻm 1102.'
      },
      {
        id: 'dog_shoo_away',
        label: 'Xua đi tránh vướng chân khách',
        subDesc: 'Giữ lối đi thông thoáng tuyệt đối, Chó Vàng buồn bã cụp tai bỏ đi',
        kicker: '🚫 NGUYÊN TẮC CỬA TIỆM',
        karmaDelta: { craftsmanship: 5, community: -10 },
        moneyDelta: 0,
        reactionTitle: 'Lối Đi Thông Thoáng',
        reactionNarrative: 'Chú chó cụp tai lầm lũi rời đi. Quầy bán hoàn toàn thông thoáng.'
      }
    ]
  },

  // 27. Chuột Cống Đột Nhập Bếp (Chương 2, Ngày 10+)
  {
    id: 'inc_pest_rat_infestation',
    title: 'Chuột Cống Đột Nhập Kho Bột',
    categoryTag: 'DỊCH HẠI BẾP NÚC',
    icon: '🐀',
    characterName: 'Chuột Cống Đột Nhập',
    characterAvatar: '🐀',
    characterImg: charImg('pest_01_rat_cong.png'),
    emoteBubble: '⚠️',
    characterRole: 'Dịch Hại & Hiểm Họa ATTP',
    context: 'Nửa đêm sau giờ đóng cửa, tiếng sột soạt vang lên từ góc chứa bột chiên giòn. Một con chuột cống béo múp đang cắn xé bao bì.',
    dialogue: 'Chít chít... (Tiếng răng gặm nhấm góc bao bột trong bóng tối)',
    phaseTiming: 'shift',
    isSecurityRisk: true,
    minChapter: 2,
    minDay: 10,
    rarity: 'rare',
    unlockHint: 'Mở khóa từ Chương 2: Dịch hại rình rập gian bếp (Cần Nâng Cấp Vệ Sinh hoặc Mèo Bắt Chuột).',
    choices: [
      {
        id: 'rat_pest_control',
        label: 'Lắp bẫy sinh học & tinh dầu đuổi chuột (40k)',
        subDesc: 'Tiêu diệt 100% chuột cống, gian bếp sạch bong đạt chuẩn 5 sao',
        kicker: '🧼 VỆ SINH TIÊU CHUẨN CAO',
        karmaDelta: { craftsmanship: 20, community: 10 },
        moneyDelta: -40000,
        reactionTitle: 'Gian Bếp Sạch Bóng Không Tì Vết!',
        reactionNarrative: 'Bẫy sinh học và lưới thép ngăn chuột hoạt động hoàn hảo. Toàn bộ bao bột được cất vào thùng kín tiệt trùng, chuột cống không còn đường bén mảng!'
      },
      {
        id: 'rat_chase_broom',
        label: 'Cầm chổi rượt đuổi một mình trong đêm',
        subDesc: 'hên xui: chuột chạy mất hút, hoặc cắn rách 2 bao bột đền 80k',
        kicker: '⚠️ ĐUỔI BẮT TỰ PHÁT',
        riskRate: 0.5,
        karmaDelta: { craftsmanship: -10, ambition: -5 },
        moneyDelta: -80000,
        reactionTitle: 'Đuổi Được Chuột Ra Cống!',
        reactionNarrative: 'Bạn khua chổi đuổi con chuột chạy tọt ra cống thoát nước. Dù mệt phờ nhưng kho hàng vẫn bảo toàn nguyên vẹn!',
        reactionFailureNarrative: 'Con chuột quá nhanh nhẹn cắn rách toang 2 bao bột hảo hạng rồi mới chui qua kẽ ngói trốn mất. Tiệm thiệt hại 80.000đ tiền nguyên liệu!'
      },
      {
        id: 'rat_cat_ambush',
        label: 'Thả Bé Mèo Mướp vào kho phục kích',
        subDesc: '🐱 Mèo cưng tóm gọn chuột trong 1 nốt nhạc, thưởng 1 miếng gà giòn',
        kicker: '🐱 LINH VẬT CHIÊU TÀI RA TAY',
        karmaDelta: { craftsmanship: 25, community: 15 },
        moneyDelta: 0,
        reactionTitle: 'Mèo Mướp Lập Đại Công!',
        reactionNarrative: 'Bé Mèo Mướp phóng như chớp tóm gọn con chuột cống mang ra cửa ngõ. Cả tiệm trầm trồ khen ngợi chú mèo thần tài của quán!'
      }
    ]
  },

  // 28. Mèo Mướp Đẻ Ổ Con Đáng Yêu (Chương 2, Ngày 16+)
  {
    id: 'inc_pet_cat_nesting',
    title: 'Mèo Mướp Sinh Đàn Con Trong Giỏ Mây',
    categoryTag: 'HỶ SỰ CỬA TIỆM',
    icon: '🐱',
    characterName: 'Mèo Mướp Tam Thể',
    characterAvatar: '🐾',
    characterImg: charImg('pet_02_cat_muop.png'),
    emoteBubble: '💖',
    characterRole: 'Thần Tài Diệt Chuột Kho Bếp',
    context: 'Trong chiếc giỏ mây êm ái góc tiệm, Bé Mèo Mướp vừa sinh 3 bé mèo con lông vàng trắng xinh xắn. Khách ăn gà xúm lại ngắm nghía khen nức nở.',
    dialogue: 'Meo meo... (Mèo mẹ âu yếm liếm láp bầy con đỏ hỏn, mắt tròn ngước nhìn bạn âu yếm)',
    phaseTiming: 'morning',
    isSecurityRisk: false,
    minChapter: 2,
    minDay: 16,
    rarity: 'rare',
    unlockHint: 'Mở khóa ở Chương 2: Hỷ sự đại cát đại lộc đến với tiệm gà.',
    choices: [
      {
        id: 'cat_nest_feast',
        label: 'Nấu súp gà tẩm bổ mèo mẹ & đặt tên đàn con',
        subDesc: 'Tốn 25k súp gà, khách đăng clip Threads viral 30k tim nườm nượp ghé quán',
        kicker: '💖 PHÚC LỘC TRÀN ĐẦY',
        karmaDelta: { community: 30, craftsmanship: 10 },
        moneyDelta: -25000,
        reactionTitle: 'Quán Gà Cưng Nhất Hẻm 1102!',
        reactionNarrative: 'Đoạn video đàn mèo con ti sữa trong giỏ mây lan truyền chóng mặt trên Threads. Rất nhiều bạn trẻ ghé quán vừa ăn gà vừa xin ngắm đàn mèo, tiệm gà rộn rã tiếng cười vui!'
      },
      {
        id: 'cat_adopt_customers',
        label: 'Tìm chủ tốt cho đàn mèo con',
        subDesc: '2 khách quen nhận nuôi 2 bé, tặng mỗi người 1 xô gà chúc may mắn',
        kicker: '🏡 TỔ ẤM MỚI CHO CÁC BÉ',
        karmaDelta: { community: 20, ambition: 5 },
        moneyDelta: -20000,
        reactionTitle: 'Mái Ấm Cho Đàn Mèo Nhỏ',
        reactionNarrative: 'Hai khách quen trong hẻm vui mừng nhận nuôi hai bé mèo bụ bẫm. Mối giao hảo giữa tiệm và bà con lối xóm càng thêm khăng khít.'
      },
      {
        id: 'cat_keep_box_quiet',
        label: 'Che rèm êm để mẹ con yên tĩnh nghỉ ngơi',
        subDesc: 'Giữ không gian yên tĩnh tuyệt đối cho mèo mẹ',
        kicker: '🌿 YÊN TĨNH BÌNH AN',
        karmaDelta: { craftsmanship: 10, community: 10 },
        moneyDelta: 0,
        reactionTitle: 'Bình Yên Bên Khung Cửa',
        reactionNarrative: 'Mèo mẹ nằm cuộn tròn cho con bú trong góc nhỏ ấm cúng. Tiệm gà bình yên khởi đầu một ngày bán buôn may mắn.'
      }
    ]
  }
];

export const DAILY_INCIDENTS: NonEmpty<DailyIncident> = [
  ...BASE_DAILY_INCIDENTS,
  ...SPECIAL_ANIMAL_INCIDENTS,
  ...EXPANDED_DAILY_INCIDENTS
] as unknown as NonEmpty<DailyIncident>;

export function getIncidentById(id: string): DailyIncident | undefined {
  return DAILY_INCIDENTS.find(inc => inc.id === id);
}
