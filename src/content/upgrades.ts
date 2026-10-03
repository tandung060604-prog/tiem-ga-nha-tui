import { UpgradeBranch } from '../types/game';

// Hệ thống 7 nhánh nâng cấp tinh hoa (3 Cấp Độ mỗi nhánh - Tier 1, Tier 2, Tier 3)
// Thiết kế tối ưu theo yêu cầu: Cắt giảm từ 8-10 cấp vi mô rườm rà xuống 3 Cột Mốc Lớn,
// mỗi cấp độ mang lại bước nhảy vọt (Milestone Leap) về công năng, cộng hưởng sâu với nhân viên:
//
// 1. kitchen:
//    - Cấp 1: Chảo Gang Đầu Hẻm (Cơ bản).
//    - Cấp 2: Bếp Chiên Đôi Áp Suất Cao Tần (Tốc độ +40%, Hương vị +35%).
//    - Cấp 3: Dây Chuyền Bếp Tự Động & Lò Nướng Kép (Tốc độ +80%, Hương vị +60%, autoLift bảo vệ gà không cháy).
// 2. space:
//    - Cấp 1: Ghế Nhựa Đầu Hẻm (Khay 4 ô gốc, không phụ thu).
//    - Cấp 2: Bàn Ghế Gỗ & Máy Lạnh Inverter (Phụ thu +15% giá món, quầy +1 ô khay ra món = 5 ô).
//    - Cấp 3: K-Bistro Kính Tràn Viền 2 Tầng (Phụ thu +30% giá món, quầy mở rộng tối đa 7 ô khay = +3 ô).
// 3. operations:
//    - Cấp 1: Ghi Giấy Nhớ Thủ Công (Cơ bản).
//    - Cấp 2: Hệ Thống POS & Màn Hình Gọi Số (Kiên nhẫn khách +35%).
//    - Cấp 3: Kiosk Cảm Ứng & App Giao Hàng Riêng (Kiên nhẫn +70%, khách mang về tự nhận món kiosk, hoa hồng app về 0%).
// 4. marketing:
//    - Cấp 1: Tiếng Thơm Truyền Miệng Hẻm (Khởi đầu).
//    - Cấp 2: Viral Threads & Food Reviewer Triệu View (Lượng khách +35%/ngày).
//    - Cấp 3: Đại Sứ Thương Hiệu & Billboard Ngã Tư Phố (Lượng khách +85%/ngày).
// 5. storage:
//    - Cấp 1: Tủ Mát Mini Đầu Hẻm.
//    - Cấp 2: Tủ Đông Sanaky 400L Hút Chân Không (+3 ngày hạn dùng, giảm 10% giá sỉ, giữ độ mọng thịt +0.15⭐ Hương Vị).
//    - Cấp 3: Kho Cấp Đông Khí Nitơ Lỏng Siêu Tốc (+6 ngày hạn dùng, giảm 25% giá sỉ, thịt chuẩn nhà hàng +0.30⭐ Hương Vị).
// 6. service:
//    - Cấp 1: Bình Nước Nhựa & Khăn Giấy.
//    - Cấp 2: Máy Rót Nước Tự Động & Khay Sốt Đủ Vị (Tự rót nước ngọt, tip tương +4.000đ/đơn).
//    - Cấp 3: Quầy Barista & Tráng Miệng Cao Cấp (Tự phục vụ đồ uống, tip tương +10.000đ/đơn).
// 7. hygiene:
//    - Cấp 1: Chổi Tre & Thùng Rác Đầu Hẻm.
//    - Cấp 2: Cửa Lưới Côn Trùng & Khử Khuẩn UV (Dầu bền hơn 40%, sao Vệ Sinh tăng nhanh hơn 40%).
//    - Cấp 3: Hệ Thống Lọc Dầu Tuần Hoàn & Bẫy Sóng Âm (Dầu bền +100%, sao Vệ Sinh vững chắc, MIỄN NHIỄM 100% CHUỘT BỌ).

export const INITIAL_UPGRADES: { [id: string]: UpgradeBranch } = {
  cart: {
    id: 'cart',
    name: 'Đồ Nghề Xe Đẩy Vỉa Hè',
    icon: '🛒',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Xe Đẩy Inox Cơ Bản',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Chiếc xe đẩy inox mộc mạc đầu hẻm 1102, che chắn tạm bợ.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Dù Bạt Che Mưa & Kẹp Gắp Inox Cách Nhiệt',
        cost: 50000,
        minChapter: 1,
        minDay: 3,
        unlockHint: 'Mở từ Ngày 3',
        description: 'Dù bạt che mưa gió Sài Gòn, kẹp gắp inox chống bỏng giúp thao tác chiên nhanh +15% và giữ trọn hương vị +10%.',
        bonus: { speed: 15, taste: 10 }
      },
      {
        level: 3,
        name: 'Dây Đèn Led Neon & Khay Lưới Róc Dầu',
        cost: 120000,
        minChapter: 1,
        minDay: 5,
        unlockHint: 'Mở từ Ngày 5',
        description: 'Đèn led sáng rực đầu hẻm, khay lưới ráo dầu inox giúp gà ráo dầu giòn tan, đảm bảo vệ sinh ATTP (+10% Vệ Sinh, +20% Hương Vị).',
        bonus: { speed: 25, taste: 20, hygiene: 10 }
      }
    ]
  },
  kitchen: {
    id: 'kitchen',
    name: 'Thiết Bị Bếp Chiên',
    icon: '🍳',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Chảo Gang Vỉa Hè',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Chảo gang truyền thống trên bếp than hồng, chiên từng mẻ một bằng tay nghề tỉ mỉ.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Bếp Chiên Đôi Áp Suất Cao Tần',
        cost: 4800000,
        minChapter: 2,
        minDay: 15,
        unlockHint: 'Mở ở Chương 2, Ngày 15',
        description: 'Lửa đều chuẩn xác, khóa trọn mọng nước: gà chín vàng nhanh hơn 40%, sao Hương vị tăng nhanh hơn 35%.',
        bonus: { speed: 40, taste: 35 }
      },
      {
        level: 3,
        name: 'Dây Chuyền Bếp Tự Động & Lò Nướng Kép',
        cost: 32000000,
        minChapter: 3,
        minDay: 50,
        unlockHint: 'Mở ở Chương 3, Ngày 50',
        description: 'Robot hỗ trợ nhấc giỏ bảo vệ gà không bị cháy đen (autoLift): tốc độ chiên +80%, sao Hương vị +60%!',
        bonus: { speed: 80, taste: 60 }
      }
    ]
  },

  space: {
    id: 'space',
    name: 'Không Gian & Chỗ Ngồi',
    icon: '🪑',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Ghế Nhựa Đầu Hẻm',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Vài chiếc ghế nhựa con ngồi ăn nhanh bên xe đẩy mộc mạc.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Bàn Gỗ Ấm Cúng & Máy Lạnh Inverter',
        cost: 4500000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: '4 bộ bàn gỗ sạch mát rượi giữa trưa hè: khách sẵn lòng trả thêm +15% giá món, quầy mở rộng +1 ô khay ra món (5 ô).',
        bonus: { space: 45, capacity: 2 }
      },
      {
        level: 3,
        name: 'K-Bistro Kính Tràn Viền 2 Tầng',
        cost: 28000000,
        minChapter: 3,
        minDay: 52,
        unlockHint: 'Mở ở Chương 3, Ngày 52',
        description: 'Không gian nhà hàng sang trọng view phố sầm uất: khách trả thêm kịch trần +30% giá món, quầy mở rộng tối đa 7 ô khay (thêm +3 ô).',
        bonus: { space: 90, capacity: 12 }
      }
    ]
  },

  operations: {
    id: 'operations',
    name: 'Vận Hành & Công Nghệ',
    icon: '⚡',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Ghi Giấy Nhớ Thủ Công',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Viết bill bằng tay, dễ nhầm lẫn khi đông khách.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Hệ Thống POS In Bill & Màn Hình Gọi Số',
        cost: 3800000,
        minChapter: 2,
        minDay: 15,
        unlockHint: 'Mở ở Chương 2, Ngày 15',
        description: 'In order rõ ràng, xếp hàng trật tự: khách vui vẻ kiên nhẫn chờ lâu hơn +35% mà không quạu.',
        bonus: { speed: 35 }
      },
      {
        level: 3,
        name: 'Kiosk Cảm Ứng & App Giao Hàng Riêng',
        cost: 26000000,
        minChapter: 3,
        minDay: 50,
        unlockHint: 'Mở ở Chương 3, Ngày 50',
        description: 'Khách kiên nhẫn tăng thêm +70%, khách mua mang về tự nhận đồ (kiosk), và KHÔNG CÒN MẤT 22% phí hoa hồng app ngoài!',
        bonus: { speed: 70 }
      }
    ]
  },

  marketing: {
    id: 'marketing',
    name: 'Quảng Bá & Tiếp Thị',
    icon: '📢',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Tiếng Thơm Truyền Miệng',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Khách quen trong hẻm giới thiệu cho nhau từng bữa ăn.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Viral Threads & Food Reviewer Triệu View',
        cost: 4200000,
        minChapter: 2,
        minDay: 15,
        unlockHint: 'Mở ở Chương 2, Ngày 15',
        description: 'Meme Gà Bông và bài viết review khen nức nở: thu hút thêm +35% lượng khách ghé quán mỗi ngày.',
        bonus: { customers: 35 }
      },
      {
        level: 3,
        name: 'Chiến Dịch Đại Sứ Thương Hiệu & Billboard Phố',
        cost: 30000000,
        minChapter: 3,
        minDay: 50,
        unlockHint: 'Mở ở Chương 3, Ngày 50',
        description: 'Biển quảng cáo khổng lồ và người nổi tiếng đồng hành: khách kéo đến nườm nượp mỗi ngày (+85% khách).',
        bonus: { customers: 85 }
      }
    ]
  },

  storage: {
    id: 'storage',
    name: 'Kho & Bảo Quản Lạnh',
    icon: '❄️',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Tủ Mát Mini Đầu Hẻm',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Để tạm vài khay thịt gà và lon nước ngọt trong ngày.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Tủ Đông Sanaky 400L Hút Chân Không',
        cost: 4500000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Bảo quản nguyên liệu tươi thêm +3 ngày, giảm 10% giá sỉ khi nhập kho nguyên liệu.',
        bonus: { shelfLife: 3, discount: 10 }
      },
      {
        level: 3,
        name: 'Kho Cấp Đông Khí Nitơ Lỏng Siêu Tốc',
        cost: 26000000,
        minChapter: 3,
        minDay: 52,
        unlockHint: 'Mở ở Chương 3, Ngày 52',
        description: 'Khóa trọn độ tươi sống (+6 ngày hạn dùng), giảm 25% chi phí nhập sỉ số lượng lớn.',
        bonus: { shelfLife: 6, discount: 25 }
      }
    ]
  },

  service: {
    id: 'service',
    name: 'Dịch Vụ & Trạm Pha Chế',
    icon: '🥤',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Bình Nước Nhựa & Khăn Giấy',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Phục vụ nước uống và khăn ăn đơn sơ tại quầy.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Máy Rót Nước Tự Động & Khay Sốt Đủ Vị',
        cost: 4800000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Rót nước ngọt trong chớp mắt (tự động hoàn thành món nước ngọt khi khách gọi), tip khi khách dặn sốt tương +4.000đ/đơn.',
        bonus: { sauceTip: 4000, autoDrink: true }
      },
      {
        level: 3,
        name: 'Quầy Barista & Tráng Miệng Cao Cấp',
        cost: 28000000,
        minChapter: 3,
        minDay: 52,
        unlockHint: 'Mở ở Chương 3, Ngày 52',
        description: 'Hệ thống pha chế thông minh: phục vụ đồ uống tự động siêu tốc, tip tương hào phóng +10.000đ/đơn.',
        bonus: { sauceTip: 10000, autoDrink: true }
      }
    ]
  },

  hygiene: {
    id: 'hygiene',
    name: 'Vệ Sinh & Phòng Dịch Hại',
    icon: '✨',
    currentLevel: 1,
    tiers: [
      {
        level: 1,
        name: 'Chổi Tre & Thùng Rác Đầu Hẻm',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Quét dọn vỉa hè và gom rác thủ công cuối mỗi ca.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Cửa Lưới Côn Trùng & Khử Khuẩn UV',
        cost: 4000000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Ngăn ruồi muỗi và bụi bẩn: dầu chiên bền lâu đen hơn 40%, sao Vệ Sinh tăng nhanh hơn 40%.',
        bonus: { hygiene: 40 }
      },
      {
        level: 3,
        name: 'Hệ Thống Lọc Dầu Tuần Hoàn & Bẫy Sóng Âm',
        cost: 25000000,
        minChapter: 3,
        minDay: 50,
        unlockHint: 'Mở ở Chương 3, Ngày 50',
        description: 'Lọc cặn nano tự động: dầu bền gấp đôi (+100% số mẻ), MIỄN NHIỄM 100% SỰ CỐ CHUỘT BỌ ĐỘT NHẬP!',
        bonus: { hygiene: 100, pestImmunity: true }
      }
    ]
  }
};
