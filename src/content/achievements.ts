import { HeritageBadge, HeritageBadgeId, GameState } from '../types/game';

export const HERITAGE_BADGES: HeritageBadge[] = [
  {
    id: 'badge_ban_tay_vang',
    title: 'Bàn Tay Vàng Làng Gà Rán',
    kicker: 'HỘI ẨM THỰC HẺM 1102 CHỨNG NHẬN',
    icon: '✨',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 50,
    requirementDesc: 'Chiên đạt 50 mẻ gà giòn rụm Perfect',
    rewardMoney: 50000,
    rewardKarma: { craftsmanship: 10 },
    honorTitle: 'Đệ Nhất Bếp Chiên Sài Gòn',
    quote: 'Chảo dầu sôi 180°C mà nhấc ra giòn tan ráo dầu, tay nghề xứng tầm nghệ nhân đất Gia Định!',
  },
  {
    id: 'badge_khac_tinh_toi_pham',
    title: 'Khắc Tinh Tội Phạm Hẻm Sâu',
    kicker: 'BAN BẢO VỆ DÂN PHỐ KHEN TẶNG',
    icon: '👮',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 3,
    requirementDesc: 'Bắt sống hoặc hỗ trợ tóm gọn tên trộm 3 lần',
    rewardMoney: 100000,
    rewardKarma: { community: 15 },
    honorTitle: 'Hiệp Sĩ Bắt Cướp Hẻm 1102',
    quote: 'Tí Chuột Nhắt nghe danh quán gà là hồn xiêu phách lạc, bà con an tâm ăn gà không lo mất ví!',
  },
  {
    id: 'badge_dung_si_dau_sach',
    title: 'Dũng Sĩ Dầu Sạch ATVSTP',
    kicker: 'THANH TRA AN TOÀN VỆ SINH PHỐ',
    icon: '🛢️',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Không để chảo dầu đen liên tiếp 5 ngày',
    rewardMoney: 75000,
    rewardKarma: { craftsmanship: 10, community: 5 },
    honorTitle: 'Tấm Gương Vàng Sức Khỏe Cộng Đồng',
    quote: 'Dầu luôn vàng óng thơm nức mũi, không bao giờ dùng dầu đen hại sức khỏe bà con lối xóm!',
  },
  {
    id: 'badge_to_dan_pho_nghia_tinh',
    title: 'Quán Gà Nghĩa Tình Hẻm 1102',
    kicker: 'UBND PHƯỜNG & TỔ DÂN PHỐ TRAO TẶNG',
    icon: '💖',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 90,
    requirementDesc: 'Đạt từ 90 điểm Karma Tình Thân Hẻm trở lên',
    rewardMoney: 120000,
    rewardKarma: { community: 20 },
    honorTitle: 'Mái Ấm Nghĩa Tình Sài Gòn',
    quote: 'Không chỉ bán gà ngon, nơi đây còn chan chứa tình làng nghĩa xóm, nâng đỡ từng mảnh đời cơ cực.',
  },
  {
    id: 'badge_bac_thay_gia_truyen',
    title: 'Bậc Thầy Nồi Sốt Bí Truyền',
    kicker: 'CÂU LẠC BỘ BẾP TRƯỞNG TRUYỀN THỐNG',
    icon: '🍯',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Nấu thành công 5 nồi Sốt Bí Truyền',
    rewardMoney: 80000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Phù Thủy Gia Vị Hẻm 1102',
    quote: 'Tỏi, ớt, mật ong quyện vào nhau tạo nên giọt sốt sánh mịn đậm đà khó cưỡng!',
  },
  {
    id: 'badge_vua_giao_hang',
    title: 'Chiến Thần Đơn Hẻm Express',
    kicker: 'HIỆP HỘI TÀI XẾ & SHIPPER HẺM',
    icon: '🛵',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 15,
    requirementDesc: 'Xử lý thành công 15 đơn giao hàng Delivery Runner',
    rewardMoney: 90000,
    rewardKarma: { ambition: 10 },
    honorTitle: 'Tay Lái Lụa Ngõ Ngách Sài Gòn',
    quote: 'Dù hẻm sâu ngoằn ngoèo hay ngập nước, đơn gà vẫn đến tay khách còn bốc khói nghi ngút!',
  },
  {
    id: 'badge_nha_hao_tam',
    title: 'Gia Đình Tiếp Tế Tương Trợ',
    kicker: 'CỘNG ĐỒNG LIÊN MINH TIỆM GÀ SÀI GÒN',
    icon: '🎁',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 3,
    requirementDesc: 'Gửi 3 gói quà tiếp tế (Gà, Quỹ dầu, Tip) cho bạn bè trong Lobby',
    rewardMoney: 60000,
    rewardKarma: { community: 15 },
    honorTitle: 'Nhà Hảo Tâm Xóm Đạo',
    quote: 'Lá lành đùm lá rách, gửi từng miếng gà tươi và quỹ dầu sạch cứu nguy cho tiệm bạn lúc ngặt nghèo.',
  },
  {
    id: 'badge_ong_trum_gacha',
    title: 'Đại Gia Chiêu Mộ Nhân Tài',
    kicker: 'VIỆN QUẢN TRỊ NHÂN LỰC HẺM 1102',
    icon: '👑',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 1,
    requirementDesc: 'Chiêu mộ thành công ít nhất 1 nhân viên cấp bậc SSR',
    rewardMoney: 150000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Đại Bản Doanh Ngũ Hổ Tướng',
    quote: 'Dưới trướng toàn nhân tài kiệt xuất, từ Bếp trưởng hoàng gia đến Quản lý tinh hoa!',
  },
  {
    id: 'badge_nha_su_hoc_hem',
    title: 'Sử Gia Ký Ức Cư Dân',
    kicker: 'HỘI SỬ KÝ DÂN GIAN HẺM 1102',
    icon: '📖',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 8,
    requirementDesc: 'Lắng nghe và hoàn thành 8 tập Ký sự phân nhánh của bà con',
    rewardMoney: 100000,
    rewardKarma: { community: 10, craftsmanship: 10 },
    honorTitle: 'Người Gìn Giữ Ký Ức Hẻm 1102',
    quote: 'Mỗi cư dân một số phận, từng câu chuyện vui buồn đều được khắc ghi trọn vẹn trong trang nhật ký.',
  },
  {
    id: 'badge_dai_ban_doanh_ga',
    title: 'Đại Bản Doanh Gà Giòn Đô Thành',
    kicker: 'HIỆP HỘI DOANH NHÂN TRẺ SÀI GÒN',
    icon: '🍗',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 200,
    requirementDesc: 'Phục vụ no nê cho 200 lượt thực khách ghé quán',
    rewardMoney: 180000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Cột Cờ Ẩm Thực Hẻm 1102',
    quote: 'Tiếng cười nói rộn rã sớm tối, quán gà nhỏ nay đã trở thành điểm hẹn thân thương của cả khu phố!',
  },
  {
    id: 'badge_ban_than_thu_cung',
    title: 'Đại Sứ Yêu Thương Thú Cưng',
    kicker: 'TRẠM CỨU HỘ ĐỘNG VẬT CỎ HẺM 1102',
    icon: '🐾',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 5,
    requirementDesc: 'Chăm sóc và xoa đầu Cậu Vàng & Bé Mướp đạt mốc 5 ngày',
    rewardMoney: 50000,
    rewardKarma: { community: 15 },
    honorTitle: 'Người Bạn Tri Kỷ Của Cậu Vàng',
    quote: 'Cậu Vàng vẫy đuôi mừng rỡ, Bé Mướp nằm sưởi nắng rừ rừ, mái hiên quán lúc nào cũng ấm áp tình thương.',
  },
  {
    id: 'badge_huyen_thoai_100_ngay',
    title: 'Huyền Thoại Trăm Ngày Gà Rán',
    kicker: 'TỔ DÂN PHỐ & TOÀN THỂ BÀ CON HẺM 1102',
    icon: '🏛️',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 100,
    requirementDesc: 'Đứng vững và kinh doanh đủ 100 ngày vượt qua bao giông bão',
    rewardMoney: 500000,
    rewardKarma: { community: 25, craftsmanship: 25, ambition: 25 },
    honorTitle: 'Tượng Đài Bất Tử Hẻm 1102',
    quote: '100 ngày lửa cháy trong bếp, 100 ngày tình nghĩa keo sơn. Tiệm Gà Nhà Tui chính là linh hồn của Sài Gòn!',
  },
];

/**
 * Hàm lấy số lượng tiến độ hiện tại cho từng bằng khen
 */
export function getBadgeCurrentProgress(badgeId: HeritageBadgeId, state: GameState): number {
  switch (badgeId) {
    case 'badge_ban_tay_vang':
      return state.lifetimeStats?.perfectFriedCount ?? 0;

    case 'badge_khac_tinh_toi_pham':
      return state.thiefStats?.totalCaught ?? 0;

    case 'badge_dung_si_dau_sach':
      // Dựa vào số ngày không bị phạt dầu đen
      return Math.max(0, 5 - (state.dirtyOilPenaltyDays ?? 0));

    case 'badge_to_dan_pho_nghia_tinh':
      return state.karma?.community ?? 50;

    case 'badge_bac_thay_gia_truyen':
      return state.secretSauceDay?.success ? 1 : 0; // Tính cả lịch sử hoặc ngày thành công

    case 'badge_vua_giao_hang':
      return state.deliveryRunnerDayCount ?? 0;

    case 'badge_nha_hao_tam':
      return state.carePackagesSentDay ? 1 : 0;

    case 'badge_ong_trum_gacha':
      return state.staff?.some(s => s.rarity === 'SSR') ? 1 : 0;

    case 'badge_nha_su_hoc_hem':
      return state.characterStoryState?.readEpisodeHistory?.length ?? 0;

    case 'badge_dai_ban_doanh_ga':
      return state.lifetimeStats?.totalFried ?? 0;

    case 'badge_ban_than_thu_cung':
      return state.petPatio?.pets.reduce((acc, p) => acc + (p.pettedToday ? 1 : 0), 0) ?? 0;

    case 'badge_huyen_thoai_100_ngay':
      return state.day ?? 1;

    default:
      return 0;
  }
}
