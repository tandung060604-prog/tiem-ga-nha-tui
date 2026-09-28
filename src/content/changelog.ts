export interface ChangelogItem {
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  details: string[];
}

export interface ChangelogRelease {
  version: string;
  codename: string;
  releaseDate: string;
  isLatest: boolean;
  highlightSummary: string;
  metrics: {
    label: string;
    value: string;
    icon: string;
  }[];
  categories: {
    categoryName: string;
    categoryIcon: string;
    items: ChangelogItem[];
  }[];
}

export const CURRENT_GAME_VERSION = 'v2.1.0';
export const CURRENT_VERSION_CODENAME = 'Đại Bản Doanh Hẻm 1102';
export const CURRENT_BUILD_DATE = '28/09/2026';

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: 'v2.1.0',
    codename: 'Đại Bản Doanh Hẻm 1102 — Siêu Bản Cập Nhật Cốt Lõi',
    releaseDate: '28/09/2026',
    isLatest: true,
    highlightSummary: 'Bản cập nhật lớn nhất hoàn thiện toàn diện hệ thống: Pháp lý ATVSTP 3 Strikes, Sự kiện đòi nợ gián đoạn ca bán, Đánh giá Realtime 1-5★, Khách Sộp VIP viền vàng, và Đồng bộ Kho FIFO chuẩn xác!',
    metrics: [
      { icon: '🍗', label: 'Cốt Truyện', value: '5 Chương · 5 Ending' },
      { icon: '👥', label: 'Thực Khách', value: '36 Cư Dân + Khách Sộp' },
      { icon: '⭐', label: 'Đánh Giá', value: '1-5★ Realtime' },
      { icon: '👮‍♂️', label: 'Pháp Lý ATVSTP', value: '3 Strikes Dầu Đen' },
      { icon: '💸', label: 'Dòng Tiền', value: 'Quy Mô Theo Chương' },
      { icon: '🧪', label: 'Kiểm Định', value: '436 Vitest PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Pháp Lý & An Toàn Thực Phẩm (ATVSTP)',
        categoryIcon: '👮‍♂️',
        items: [
          {
            tag: '3 STRIKES',
            tagColor: '#d32f2f',
            title: 'Công An & Quản Lý Thị Trường Kiểm Tra Dầu Đen',
            desc: 'Nếu chủ quán cố tình chiên gà bằng dầu đen sì bốc khói độc hại, Đội kiểm tra sẽ lập tức ập vào kiểm tra với cơ chế 3 lần nghiêm khắc:',
            details: [
              'Lần 1: Lập biên bản cảnh cáo nhắc nhở, trừ điểm sao Vệ Sinh và ghi nhận vào nhật ký đánh giá của thực khách.',
              'Lần 2: Quyết định xử phạt hành chính 200.000đ trừ thẳng ví tiền mặt và trừ nặng sao Vệ Sinh của quán.',
              'Lần 3: Đình chỉ quán vĩnh viễn, Game Over lập tức chuyển vào Đại Kết Cục 3C: "Vào Tù Vì Dầu Đen Độc Hại" (bad_police).'
            ]
          }
        ]
      },
      {
        categoryName: 'Sự Kiện Kịch Tính & Xóm Hẻm 1102',
        categoryIcon: '💥',
        items: [
          {
            tag: 'ĐÒI NỢ NGÀY 8+',
            tagColor: '#e65100',
            title: 'Bà Bảy Đất & Đại Ca Beo Đòi Tiền Bảo Kê',
            desc: 'Từ Ngày 8 trở đi, sự kiện xuất hiện ngay giữa ca bán hàng với 4 lựa chọn đối đáp phân nhánh:',
            details: [
              'Nhánh cự cãi nóng nảy khiến Đại Ca Beo đập phá bàn ghế, toàn bộ khách đang đợi sợ hãi bỏ chạy sạch (orders = []).',
              'Quán bị gián đoạn hỗn loạn trong 18 giây, chặn dòng khách mới dám bước vào kèm còi báo động và rung xúc giác.',
              'Nhánh mời gà khất nợ hoặc nhờ Bác Ba can thiệp giúp êm chuyện, giữ yên ổn làm ăn và tăng điểm Karma Tình Hẻm.'
            ]
          },
          {
            tag: 'KINH TẾ & CHỐNG LẶP',
            tagColor: '#0288d1',
            title: 'Sự Kiện Tiền Thật Theo Chương & Cooldown 6 Ngày',
            desc: 'Tiền thưởng/phạt từ các sự cố được cộng/trừ thẳng vào ví tiền mặt, quy mô tiền tăng dần theo Chương (x1.0 đến x5.0).',
            details: [
              'Cơ chế chống lặp kép: Ưu tiên tuyệt đối sự kiện chưa gặp + Thời gian hồi Cooldown 6 ngày (INCIDENT_COOLDOWN_DAYS = 6).',
              'Hiện toast thông báo biến động tiền mặt ngay trên màn hình (💵 Nhận tiền / 💸 Chi tiền).'
            ]
          }
        ]
      },
      {
        categoryName: 'Đánh Giá Real-time & Đối Đáp Khách Hàng',
        categoryIcon: '⭐',
        items: [
          {
            tag: 'REAL-TIME REVIEW',
            tagColor: '#f57c00',
            title: 'Hệ Thống Đánh Giá 1-5 Sao Từng Lượt Khách',
            desc: 'Mỗi khách ăn xong, bỏ về do đợi lâu, nhận sai món hay thiếu món đều để lại đánh giá tức thì với số sao và hashtag tương ứng.',
            details: [
              'Giá đắt (≥125% - 140%+): Khách bức xúc phàn nàn giá cả (topic expensive, 1-3★), gắn tag #GiaCatCo #ChatChem.',
              'Tiện nghi vỉa hè: Quán chật chội sau Ngày 4 khi chưa nâng cấp không gian bị chê bai nóng bức (topic bad_space, 2-3★).',
              'Giá rẻ bình dân (≤90%): Khách hết lời khen ngợi quán ruột giá hời (topic cheap_price, 5★).'
            ]
          },
          {
            tag: 'ĐỐI ĐÁP 2 CHIỀU',
            tagColor: '#388e3c',
            title: 'Hộp Thoại Phản Hồi Có Bác Ba Cố Vấn',
            desc: 'Chủ tiệm có thể trực tiếp trả lời đánh giá của khách trên Tab Đánh Giá hoặc Màn Tổng Kết Cuối Ngày:',
            details: [
              'Bác Ba gợi ý phân tích tâm lý khách hàng và mách nước phương án trả lời khuyên chọn ⭐.',
              '3 Phong cách đối đáp (Chân thành, Hài hước GenZ, Cương trực) giúp cứu vãn điểm sao (+0.1★ - +0.2★) và tăng điểm Karma.',
              'Sửa dứt điểm lỗi kẹt không đóng được hộp thoại trả lời review.'
            ]
          }
        ]
      },
      {
        categoryName: 'Khách Hàng & Gia Tốc Kinh Tế',
        categoryIcon: '👑',
        items: [
          {
            tag: 'VIP BIG SPENDER',
            tagColor: '#fbc02d',
            title: 'Khách Sộp VIP Hào Quang Vàng Lấp Lánh',
            desc: 'Bổ sung tính cách Khách Sộp (vip_generous) đại gia/CEO/Tiktoker với diện mạo sang trọng và hào quang nổi bật:',
            details: [
              'Thẻ khách viền vàng mạ kim vip-card cùng huy hiệu 👑 KHÁCH SỘP.',
              'Tiền tip cực khủng (+45.000đ khi giao nhanh +15.000đ khi chiên chuẩn vị, tổng tip lên tới 35k-150k+).',
              'Bong bóng thoại chịu chi: "Tiền nong không quan trọng, làm chuẩn giòn rụm anh bo hết nấc!".'
            ]
          },
          {
            tag: 'SMART SERVING',
            tagColor: '#7b1fa2',
            title: 'Phục Vụ Đa Khách Hàng Thông Minh & Hủy Đơn Xin Lỗi',
            desc: 'Khắc phục triệt để tình trạng nghẽn cổ chai hàng đợi bán hàng:',
            details: [
              'Tự động giao cho khách thứ 2, thứ 3 nếu món trong khay đã sẵn sàng hoặc bấm nút LÊN MÓN trực tiếp trên thẻ khách.',
              'Nút "🙏 Hết món · Xin lỗi": Khi hết nguyên liệu, chủ động xin lỗi để khách thông cảm rời đi và thanh toán món đã nhận.',
              'Đồng bộ 100% số lượng khách dự kiến đến quán thực tế trong 11 tiếng ca bán (10h-21h).'
            ]
          }
        ]
      },
      {
        categoryName: 'Bếp Chiên & Kho Hàng FIFO Chuẩn Mực',
        categoryIcon: '🍗',
        items: [
          {
            tag: 'ĐỒNG BỘ MÓN ĂN',
            tagColor: '#c2185b',
            title: 'Mở Khóa Món Mới Ngay Từ Chương 1 Theo Ngày',
            desc: 'Khắc phục lỗi hiển thị mua bên ngoài nhưng vào ca bán lại báo "khóa chương sau":',
            details: [
              'Cánh gà sốt cay Yangnyeom: Mở khóa ngay Ngày 3 Chương 1.',
              'Gà sốt bơ tỏi đậu nành: Mở khóa ngay Ngày 4 Chương 1.',
              'Gà viên popcorn giòn rụm: Mở khóa ngay Ngày 5 Chương 1.',
              'Sốt Yangnyeom & Sốt Bơ Tỏi sẵn sàng nhập tại Kho để phục vụ quầy chiên.'
            ]
          },
          {
            tag: 'KHO FIFO CHUẨN',
            tagColor: '#00796b',
            title: 'Tiêu Hủy Hàng Hết Hạn Thật Sự & Tồn Kho 1:1',
            desc: 'Cơ chế kho hàng FIFO chuẩn mực bảo vệ chất lượng món ăn:',
            details: [
              'Hiển thị số lượng trên quầy Inox đúng 1:1 với nguyên liệu chính tồn kho (primaryStock), hết nguyên liệu không cho chiên khống.',
              'Bán đùi gà chỉ trừ tồn đùi gà, không bao giờ trừ chéo má đùi gà.',
              'Tiêu hủy sạch các lô nguyên liệu hết hạn sử dụng qua đêm (daysLeft <= 0) kèm thông báo chi phí hao hụt vào sáng hôm sau.'
            ]
          }
        ]
      },
      {
        categoryName: 'Âm Thanh, Nhạc Nền & Cảm Giác Game Feel',
        categoryIcon: '🎵',
        items: [
          {
            tag: 'AUDIO SYNTH',
            tagColor: '#512da8',
            title: 'Âm Thanh Web Audio Synth Theo Từng Phân Cảnh',
            desc: 'Thay đổi âm thanh sống động theo nhịp đập kịch bản:',
            details: [
              'Hợp âm Synth trượt tần số dồn dập (playDramaticSting) khi sự cố bất ngờ xuất hiện.',
              'Rung tần số FM hỗn loạn (playChaosScare) khi khách sợ hãi tháo chạy.',
              'Hiệu ứng lò xo boing hoạt hình dí dỏm và chuông lãng mạn leng keng.',
              'Dynamic BGM: Nhạc nền tự hạ âm lượng và chuyển sang điệu kịch tính 68 BPM (gam D thứ) khi có sự kiện.'
            ]
          }
        ]
      }
    ]
  }
];
