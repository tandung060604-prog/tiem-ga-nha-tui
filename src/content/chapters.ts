import { Chapter, NonEmpty } from '../types/game';

export const CHAPTERS: NonEmpty<Chapter> = [
  {
    number: 1,
    title: 'Xe Đẩy Đầu Hẻm',
    context: 'Vỉa hè góc phố, một chiếc chảo chiên gang đơn sơ nhưng đầy ắp nhiệt huyết.',
    daysRange: [1, 15],
    targetMoney: 5000000,
    targetStars: 3.5,
    mechanicsUnlocked: ['Chiên gà cơ bản', 'Lắc phô mai', 'Quản lý kho'],
    description: 'Bắt đầu từ số vốn ít ỏi, tích lũy từng đồng lãi để gom đủ 5.000.000đ thuê mặt bằng tiệm trong hẻm.'
  },
  {
    number: 2,
    title: 'Tiệm Trong Hẻm',
    context: 'Căn nhà nhỏ trong hẻm với 4 bộ bàn gỗ, hương thơm gà rán bay ngào ngạt khắp xóm.',
    daysRange: [16, 50],
    targetMoney: 30000000,
    targetStars: 4.0,
    mechanicsUnlocked: ['Thuê nhân viên', 'Xếp ca trả lương', 'Tự tạo combo', 'Đánh giá 5 tiêu chí'],
    description: 'Xây dựng đội ngũ nhân viên đầu tiên, nâng tầm món ăn với gà sốt cay và sốt bơ tỏi.'
  },
  {
    number: 3,
    title: 'Mặt Tiền Phố',
    context: 'Cửa hàng khang trang 12 bàn ở mặt tiền đường lớn, đèn neon rực rỡ.',
    daysRange: [51, 100],
    targetMoney: 60000000, // mô phỏng: người chơi trung bình có nhân viên lãi ~1,4tr/ngày ở Chương 3 (90tr: không qua nổi)
    targetStars: 4.5,
    mechanicsUnlocked: ['App giao hàng', 'Kiosk tự order', 'Marketing chuyên nghiệp', '12 Khách quen'],
    description: 'Chinh phục thực khách toàn quận, kết hợp bán tại chỗ và app giao hàng công nghệ.'
  },
  {
    number: 4,
    title: 'Tiệm Hot Trend',
    context: 'Cạnh tranh trực tiếp với 3 chuỗi gà rán lớn mở đối diện, biến tiệm thành hiện tượng GenZ.',
    daysRange: [101, 150],
    targetMoney: 250000000,
    targetStars: 4.6,
    mechanicsUnlocked: ['Chiến dịch Limited', 'Livestream KOL', 'Xử lý khủng hoảng', 'Tua nhanh ngày êm'],
    description: 'Chiến thắng thị phần trước các ông lớn gà rán bằng sự sáng tạo và linh hồn Việt.'
  },
  {
    number: 5,
    title: 'Chuỗi Gà Quốc Dân',
    context: '5 chi nhánh phủ khắp các quận trung tâm, bếp trung tâm điều phối chuyên nghiệp.',
    daysRange: [151, 210],
    targetMoney: 800000000,
    targetStars: 4.7,
    mechanicsUnlocked: ['Quản lý 5 chi nhánh', 'Bếp trung tâm', 'CEO Xuống bếp', 'Cúp Gà Vàng'],
    description: 'Trở thành thương hiệu gà rán quốc dân được yêu thích nhất cả nước!'
  }
];
