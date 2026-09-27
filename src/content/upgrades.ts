import { UpgradeBranch } from '../types/game';

// Hệ thống 7 nhánh nâng cấp chuyên biệt (Bếp, Không gian, Vận hành, Marketing, Kho lạnh, Dịch vụ, Vệ sinh)
// Đảm bảo nội tại hoàn toàn độc lập (Orthogonal Passives) - KHÔNG TRÙNG LẶP NỘI TẠI GIỮA CÁC NHÁNH:
// 1. kitchen: Tốc độ chiên gà (speed) & Điểm sao hương vị (taste), cấp 6 tự nhấc giỏ (autoLift).
// 2. space: Định giá không gian sang xịn (space -> pricePremiumPct) & Thêm ô khay ra món (capacity -> traySlots).
// 3. operations: Khách kiên nhẫn xếp hàng lâu hơn (speed -> patiencePct), cấp 4 Kiosk tự order (selfServe), cấp 5 App riêng 0% phí (ownDeliveryApp).
// 4. marketing: Thu hút thêm lưu lượng khách ghé quán mỗi ngày (customers -> customersPct).
// 5. storage: Gia hạn ngày bảo quản nguyên liệu tồn kho (shelfLife) & Chiết khấu giá mua sỉ (discount).
// 6. service: Tự động rót nước ngọt (autoDrink từ cấp 3) & Thưởng thêm tiền tip khi khách dặn tương (sauceTip).
// 7. hygiene: Dầu chiên bền lâu đen (hygiene -> oilLifePct), tăng sao Vệ Sinh (hygieneBoost) & Miễn dịch chuột cống (pestImmunity từ cấp 4).
//
// Phân tầng mở khóa theo Chương (minChapter) & Ngày (minDay) và tăng tiến giá hợp lý theo 5 Chương.

export const INITIAL_UPGRADES: { [id: string]: UpgradeBranch } = {
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
        description: 'Chảo gang truyền thống, chiên từng mẻ một.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Nồi Chiên Đôi 2 Giỏ',
        cost: 1500000,
        minChapter: 1,
        minDay: 3,
        unlockHint: 'Mở từ Ngày 3',
        description: 'Giỏ lớn, lửa đều: gà lên vàng nhanh hơn 35% (vùng Perfect vẫn giữ nguyên độ dài).',
        bonus: { speed: 35 }
      },
      {
        level: 3,
        name: 'Tủ Giữ Nóng Giòn 70°C',
        cost: 4800000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Gà ra lò lúc nào cũng nóng giòn: sao Hương vị tăng nhanh hơn 25%, tốc độ giữ nóng +35%.',
        bonus: { speed: 35, taste: 25 }
      },
      {
        level: 4,
        name: 'Nồi Chiên Áp Suất Cao Tần',
        cost: 11500000,
        minChapter: 2,
        minDay: 30,
        unlockHint: 'Mở ở Chương 2, Ngày 30',
        description: 'Khóa độ ẩm, thịt ngọt da giòn: gà chín vàng nhanh hơn 50%, sao Hương vị tăng nhanh hơn 35%.',
        bonus: { speed: 50, taste: 35 }
      },
      {
        level: 5,
        name: 'Hệ Thống Gia Nhiệt Điện Từ Bếp',
        cost: 25000000,
        minChapter: 3,
        minDay: 55,
        unlockHint: 'Mở ở Chương 3, Ngày 55',
        description: 'Nhiệt lượng chuẩn xác từng giây: tốc độ chiên +65%, sao Hương vị +45%.',
        bonus: { speed: 65, taste: 45 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Chiên Tự Động',
        cost: 50000000,
        minChapter: 3,
        minDay: 80,
        unlockHint: 'Mở ở Chương 3, Ngày 80',
        description: 'Robot tự nhấc giỏ đúng lúc Perfect: tốc độ chiên +80%, sao Hương vị +55%, không lo bị cháy!',
        bonus: { speed: 80, taste: 55 }
      },
      {
        level: 7,
        name: 'Trạm Chiên 3 Hộc Công Nghiệp',
        cost: 85000000,
        minChapter: 4,
        minDay: 110,
        unlockHint: 'Mở ở Chương 4, Ngày 110',
        description: 'Công suất đỉnh cao phục vụ giờ cao điểm: tốc độ chiên +95%, sao Hương vị +65%.',
        bonus: { speed: 95, taste: 65 }
      },
      {
        level: 8,
        name: 'Nồi Chiên Áp Suất Kép Robot AI',
        cost: 150000000,
        minChapter: 4,
        minDay: 145,
        unlockHint: 'Mở ở Chương 4, Ngày 145',
        description: 'Công nghệ chiên chân không AI: gà giòn tan mọng nước, tốc độ chiên +110%, sao Hương vị +75%.',
        bonus: { speed: 110, taste: 75 }
      },
      {
        level: 9,
        name: 'Hệ Thống Bếp Master Chef',
        cost: 280000000,
        minChapter: 5,
        minDay: 185,
        unlockHint: 'Mở ở Chương 5, Ngày 185',
        description: 'Đỉnh cao kỹ nghệ chiên giòn: gà chín siêu tốc +130%, sao Hương vị +85%.',
        bonus: { speed: 130, taste: 85 }
      },
      {
        level: 10,
        name: 'Lò Luyện Kim Bí Truyền Hẻm 1102',
        cost: 450000000,
        minChapter: 5,
        minDay: 215,
        unlockHint: 'Mở ở Chương 5, Ngày 215',
        description: 'Bảo vật gia truyền Bác Ba: gà vàng giòn huyền thoại, tốc độ +150%, hương vị tuyệt hảo +100%.',
        bonus: { speed: 150, taste: 100 }
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
        description: 'Vài chiếc ghế nhựa con ngồi ăn nhanh bên xe đẩy.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Bàn Gỗ Ấm Cúng (Tiệm Hẻm)',
        cost: 1800000,
        minChapter: 1,
        minDay: 4,
        unlockHint: 'Mở từ Ngày 4',
        description: '4 bộ bàn gỗ sạch đẹp: khách sẵn lòng trả thêm 5% giá món, quầy rộng thêm 1 ô khay ra món.',
        bonus: { space: 15, capacity: 2 }
      },
      {
        level: 3,
        name: 'Máy Lạnh Inverter Mát Lạnh',
        cost: 5200000,
        minChapter: 2,
        minDay: 18,
        unlockHint: 'Mở ở Chương 2, Ngày 18',
        description: 'Mát lạnh giữa trưa nắng Sài Gòn: khách sẵn lòng trả thêm 10% giá món, quầy rộng thêm 2 ô khay.',
        bonus: { space: 30, capacity: 4 }
      },
      {
        level: 4,
        name: 'Góc Sống Ảo Check-in Gà Bông',
        cost: 12000000,
        minChapter: 2,
        minDay: 35,
        unlockHint: 'Mở ở Chương 2, Ngày 35',
        description: 'Góc decor bắt mắt phong cách Hàn: khách sẵn lòng trả thêm 20% giá món, quầy giữ 2 ô khay thêm.',
        bonus: { space: 60, capacity: 4 }
      },
      {
        level: 5,
        name: 'Mặt Tiền Phố 12 Bàn Ăn',
        cost: 26000000,
        minChapter: 3,
        minDay: 55,
        unlockHint: 'Mở ở Chương 3, Ngày 55',
        description: 'Đèn neon, nhạc lofi, quầy lễ tân rộng rãi: khách trả thêm tối đa 30% giá món, quầy mở rộng tối đa 3 ô khay.',
        bonus: { space: 90, capacity: 12 }
      },
      {
        level: 6,
        name: 'Phòng Lạnh Kính Cường Lực View Hẻm',
        cost: 48000000,
        minChapter: 3,
        minDay: 80,
        unlockHint: 'Mở ở Chương 3, Ngày 80',
        description: 'Không gian máy lạnh kính tràn viền cực sang: khách luôn trả mức giá cao cấp (+30%), khay giữ vững +3 ô.',
        bonus: { space: 90, capacity: 12 }
      },
      {
        level: 7,
        name: 'Bistro 2 Tầng Phong Cách Hàn Quốc',
        cost: 90000000,
        minChapter: 4,
        minDay: 115,
        unlockHint: 'Mở ở Chương 4, Ngày 115',
        description: 'Nhà hàng K-Bistro 2 tầng ấm cúng và bề thế: trải nghiệm ẩm thực thượng lưu (+30% giá bán, +3 ô khay).',
        bonus: { space: 90, capacity: 12 }
      },
      {
        level: 8,
        name: 'Mặt Tiền Phố Đi Bộ Sầm Uất',
        cost: 160000000,
        minChapter: 4,
        minDay: 150,
        unlockHint: 'Mở ở Chương 4, Ngày 150',
        description: 'Tọa độ kim cương giữa trung tâm thành phố: biểu tượng sang trọng đẳng cấp (+30% giá bán, +3 ô khay).',
        bonus: { space: 90, capacity: 12 }
      },
      {
        level: 9,
        name: 'Tòa Nhà Gà Rán 5 Tầng Landmark',
        cost: 300000000,
        minChapter: 5,
        minDay: 190,
        unlockHint: 'Mở ở Chương 5, Ngày 190',
        description: 'Đại bản doanh chuỗi tiệm gà số 1 Việt Nam: đẳng cấp không gian danh tiếng hàng đầu (+30% giá bán, +3 ô khay).',
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
        name: 'Máy POS In Bill Nhanh',
        cost: 1200000,
        minChapter: 1,
        minDay: 2,
        unlockHint: 'Mở từ Ngày 2',
        description: 'In order rõ ràng, xếp hàng trật tự: khách vui vẻ chờ lâu hơn 20% mà không bỏ về.',
        bonus: { speed: 20 }
      },
      {
        level: 3,
        name: 'Màn Hình Gọi Số Khách Hàng',
        cost: 3800000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Khách tự nhìn màn hình lấy món: tính kiên nhẫn của khách tăng thêm 30%.',
        bonus: { speed: 30 }
      },
      {
        level: 4,
        name: 'Kiosk Cảm Ứng Tự Order',
        cost: 9500000,
        minChapter: 2,
        minDay: 28,
        unlockHint: 'Mở ở Chương 2, Ngày 28',
        description: 'Khách tự bấm chọn món và tự nhận đồ khi đủ món: kiên nhẫn tăng thêm 45%, không cần nhân viên bưng bê.',
        bonus: { speed: 45 }
      },
      {
        level: 5,
        name: 'App Giao Hàng Độc Quyền',
        cost: 22000000,
        minChapter: 3,
        minDay: 52,
        unlockHint: 'Mở ở Chương 3, Ngày 52',
        description: 'Ứng dụng đặt hàng riêng của quán: kiên nhẫn +60% và KHÔNG CÒN MẤT 8% phí hoa hồng app ngoài!',
        bonus: { speed: 60 }
      },
      {
        level: 6,
        name: 'Màn Hình Quản Lý Bếp KDS',
        cost: 42000000,
        minChapter: 3,
        minDay: 75,
        unlockHint: 'Mở ở Chương 3, Ngày 75',
        description: 'Hệ thống KDS đồng bộ thời gian thực: khách kiên nhẫn tăng thêm 75% trong giờ cao điểm.',
        bonus: { speed: 75 }
      },
      {
        level: 7,
        name: 'Robot Thu Dọn Bàn Tự Động',
        cost: 80000000,
        minChapter: 4,
        minDay: 110,
        unlockHint: 'Mở ở Chương 4, Ngày 110',
        description: 'Robot thông minh dọn bàn siêu tốc: khách cực kỳ kiên nhẫn (+90% thời gian chờ).',
        bonus: { speed: 90 }
      },
      {
        level: 8,
        name: 'Hệ Thống ERP Chuỗi Cung Ứng AI',
        cost: 140000000,
        minChapter: 4,
        minDay: 140,
        unlockHint: 'Mở ở Chương 4, Ngày 140',
        description: 'AI dự báo và phân luồng thông minh: khách kiên nhẫn chờ lâu hơn 110%.',
        bonus: { speed: 110 }
      },
      {
        level: 9,
        name: 'Mạng Lưới Drone Giao Hàng Siêu Tốc',
        cost: 260000000,
        minChapter: 5,
        minDay: 185,
        unlockHint: 'Mở ở Chương 5, Ngày 185',
        description: 'Drone giao hàng chuẩn xác: khách chờ không bao giờ cáu giận (+135% kiên nhẫn).',
        bonus: { speed: 135 }
      },
      {
        level: 10,
        name: 'Trụ Sở Vận Hành Tự Động Hóa Đám Mây',
        cost: 420000000,
        minChapter: 5,
        minDay: 210,
        unlockHint: 'Mở ở Chương 5, Ngày 210',
        description: 'Hệ thống vận hành không độ trễ: khách hàng kiên nhẫn tối đa (+160% thời gian chờ).',
        bonus: { speed: 160 }
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
        description: 'Khách quen trong hẻm giới thiệu cho nhau.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Phát Tờ Rơi Ngã Ba',
        cost: 1500000,
        minChapter: 1,
        minDay: 3,
        unlockHint: 'Mở từ Ngày 3',
        description: 'Tờ rơi in màu bắt mắt tại ngã ba: thu hút thêm 20% lượng khách ghé quán mỗi ngày.',
        bonus: { customers: 20 }
      },
      {
        level: 3,
        name: 'Fanpage Threads & Facebook',
        cost: 4500000,
        minChapter: 2,
        minDay: 16,
        unlockHint: 'Mở ở Chương 2, Ngày 16',
        description: 'Meme Gà Bông viral triệu view: tăng thêm 35% lượng khách mỗi ngày.',
        bonus: { customers: 35 }
      },
      {
        level: 4,
        name: 'Livestream Mukbang Gà Giòn',
        cost: 10500000,
        minChapter: 2,
        minDay: 32,
        unlockHint: 'Mở ở Chương 2, Ngày 32',
        description: 'Tiếng cắn gà giòn rụm trên sóng trực tiếp: thu hút thêm 55% thực khách săn lùng.',
        bonus: { customers: 55 }
      },
      {
        level: 5,
        name: 'Hợp Tác Food Reviewer Triệu Follower',
        cost: 24000000,
        minChapter: 3,
        minDay: 54,
        unlockHint: 'Mở ở Chương 3, Ngày 54',
        description: 'Top reviewer khen nức nở: khách kéo đến nườm nượp (+85% khách mỗi ngày).',
        bonus: { customers: 85 }
      },
      {
        level: 6,
        name: 'Billboard Đèn LED Ngã Tư Hàng Xanh',
        cost: 46000000,
        minChapter: 3,
        minDay: 78,
        unlockHint: 'Mở ở Chương 3, Ngày 78',
        description: 'Biển quảng cáo khổng lồ cửa ngõ thành phố: bùng nổ thêm 120% khách ghé quán.',
        bonus: { customers: 120 }
      },
      {
        level: 7,
        name: 'Tài Trợ Gameshow Ẩm Thực Giờ Vàng',
        cost: 85000000,
        minChapter: 4,
        minDay: 112,
        unlockHint: 'Mở ở Chương 4, Ngày 112',
        description: 'Phủ sóng truyền hình toàn quốc: trở thành thương hiệu quốc dân (+160% khách mỗi ngày).',
        bonus: { customers: 160 }
      },
      {
        level: 8,
        name: 'Đại Sứ Thương Hiệu Idol Hạng A',
        cost: 155000000,
        minChapter: 4,
        minDay: 148,
        unlockHint: 'Mở ở Chương 4, Ngày 148',
        description: 'Idol K-pop/V-pop làm đại diện: fan hâm mộ xếp hàng dài mua gà (+210% khách).',
        bonus: { customers: 210 }
      },
      {
        level: 9,
        name: 'Chiến Dịch Toàn Cầu Gà Rán Nam Bộ Viral',
        cost: 290000000,
        minChapter: 5,
        minDay: 188,
        unlockHint: 'Mở ở Chương 5, Ngày 188',
        description: 'Gà rán Sài Gòn bước ra thế giới: khách quốc tế đổ về thưởng thức (+270% khách).',
        bonus: { customers: 270 }
      },
      {
        level: 10,
        name: 'Lễ Hội Gà Rán Quốc Tế Sài Gòn',
        cost: 460000000,
        minChapter: 5,
        minDay: 218,
        unlockHint: 'Mở ở Chương 5, Ngày 218',
        description: 'Đại tiệc ẩm thực toàn cầu do tiệm chủ trì: lượng khách bùng nổ kỷ lục (+350% khách).',
        bonus: { customers: 350 }
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
        name: 'Thùng Giữ Lạnh Foam Dày',
        cost: 1600000,
        minChapter: 1,
        minDay: 5,
        unlockHint: 'Mở từ Ngày 5',
        description: 'Giữ thịt gà tươi thêm 1 ngày hạn dùng, giảm hao hụt nguyên liệu tồn kho.',
        bonus: { shelfLife: 1 }
      },
      {
        level: 3,
        name: 'Tủ Đông Sanaky 2 Cánh 400L',
        cost: 5000000,
        minChapter: 2,
        minDay: 20,
        unlockHint: 'Mở ở Chương 2, Ngày 20',
        description: 'Bảo quản nguyên liệu lâu hơn 2 ngày, giảm 5% giá mua nguyên liệu sỉ.',
        bonus: { shelfLife: 2, discount: 5 }
      },
      {
        level: 4,
        name: 'Phòng Lạnh Hút Chân Không Bếp',
        cost: 12500000,
        minChapter: 2,
        minDay: 38,
        unlockHint: 'Mở ở Chương 2, Ngày 38',
        description: 'Nguyên liệu không hỏng trước 4 ngày (+3 ngày hạn dùng), giảm 10% giá mua sỉ.',
        bonus: { shelfLife: 3, discount: 10 }
      },
      {
        level: 5,
        name: 'Kho Đông Lạnh Cấp Tốc -18°C',
        cost: 26000000,
        minChapter: 3,
        minDay: 58,
        unlockHint: 'Mở ở Chương 3, Ngày 58',
        description: 'Khóa trọn độ tươi sống (+4 ngày hạn), giảm 15% giá nhập sỉ toàn bộ kho.',
        bonus: { shelfLife: 4, discount: 15 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Bảo Quản Khí Nitơ Lỏng',
        cost: 52000000,
        minChapter: 3,
        minDay: 82,
        unlockHint: 'Mở ở Chương 3, Ngày 82',
        description: 'Bảo quản hoàn hảo tuyệt đối (+5 ngày hạn), giảm 20% chi phí nhập sỉ.',
        bonus: { shelfLife: 5, discount: 20 }
      },
      {
        level: 7,
        name: 'Kho Logistic Tổng Kho Miền Nam',
        cost: 92000000,
        minChapter: 4,
        minDay: 120,
        unlockHint: 'Mở ở Chương 4, Ngày 120',
        description: 'Trung chuyển quy mô lớn: kéo dài +6 ngày bảo quản, chiết khấu sỉ lên tới 25%.',
        bonus: { shelfLife: 6, discount: 25 }
      },
      {
        level: 8,
        name: 'Trung Tâm Chuỗi Cung Ứng Lạnh Tự Động',
        cost: 165000000,
        minChapter: 4,
        minDay: 155,
        unlockHint: 'Mở ở Chương 4, Ngày 155',
        description: 'Chuỗi cung ứng khép kín hiện đại: nguyên liệu bền thêm 7 ngày, giảm kịch trần 30% giá sỉ.',
        bonus: { shelfLife: 7, discount: 30 }
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
        name: 'Khay Sốt Đủ Vị Đầu Bàn',
        cost: 1400000,
        minChapter: 1,
        minDay: 4,
        unlockHint: 'Mở từ Ngày 4',
        description: 'Tương cà, tương ớt đóng chai sạch sẽ: khách dặn tương được thưởng tip thêm +2.000đ/đơn.',
        bonus: { sauceTip: 2000 }
      },
      {
        level: 3,
        name: 'Máy Rót Nước Tự Động 2 Vòi',
        cost: 5500000,
        minChapter: 2,
        minDay: 18,
        unlockHint: 'Mở ở Chương 2, Ngày 18',
        description: 'Rót nước ngọt trong chớp mắt: TỰ ĐỘNG HOÀN THÀNH MÓN NƯỚC NGỌT khi khách gọi, tip tương +3.000đ.',
        bonus: { sauceTip: 3000, autoDrink: true }
      },
      {
        level: 4,
        name: 'Quầy Sốt Đầy Đủ Tự Phục Vụ',
        cost: 11000000,
        minChapter: 2,
        minDay: 35,
        unlockHint: 'Mở ở Chương 2, Ngày 35',
        description: 'Sốt cay, phô mai, mù tạt mật ong: khách dặn tương thích mê, tip thêm +5.000đ/đơn.',
        bonus: { sauceTip: 5000, autoDrink: true }
      },
      {
        level: 5,
        name: 'Trạm Nước Ngọt & Đá Tự Động Cảm Ứng',
        cost: 25000000,
        minChapter: 3,
        minDay: 56,
        unlockHint: 'Mở ở Chương 3, Ngày 56',
        description: 'Cảm ứng rót nước ngọt siêu tốc, khách dặn sốt thưởng tip lớn +7.000đ/đơn.',
        bonus: { sauceTip: 7000, autoDrink: true }
      },
      {
        level: 6,
        name: 'Quầy Pha Chế Barista K-Chicken',
        cost: 48000000,
        minChapter: 3,
        minDay: 82,
        unlockHint: 'Mở ở Chương 3, Ngày 82',
        description: 'Quầy bar sang trọng: tự động phục vụ đồ uống và thưởng tip tương đậm đà +10.000đ/đơn.',
        bonus: { sauceTip: 10000, autoDrink: true }
      },
      {
        level: 7,
        name: 'Trạm Tráng Miệng & Trà Sữa Tự Động',
        cost: 88000000,
        minChapter: 4,
        minDay: 118,
        unlockHint: 'Mở ở Chương 4, Ngày 118',
        description: 'Hệ thống pha chế thông minh: phục vụ nước ngọt tự động, tip tương cực cao +14.000đ/đơn.',
        bonus: { sauceTip: 14000, autoDrink: true }
      },
      {
        level: 8,
        name: 'Quầy Dịch Vụ 5 Sao Hạng Nhất',
        cost: 155000000,
        minChapter: 4,
        minDay: 152,
        unlockHint: 'Mở ở Chương 4, Ngày 152',
        description: 'Dịch vụ chuẩn khách sạn 5 sao: tự phục vụ nước uống hoàn hảo, tip tương hào phóng +20.000đ/đơn.',
        bonus: { sauceTip: 20000, autoDrink: true }
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
        name: 'Chổi Tre & Xô Nước Đầu Hẻm',
        cost: 0,
        minChapter: 1,
        minDay: 1,
        description: 'Quét dọn vỉa hè và gom rác thủ công cuối mỗi ca.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Thùng Rác Đạp Chân Có Nắp Kín',
        cost: 1300000,
        minChapter: 1,
        minDay: 3,
        unlockHint: 'Mở từ Ngày 3',
        description: 'Dọn sạch dầu thừa và rác bếp: dầu bền hơn 20%, sao Vệ sinh tăng nhanh hơn 20%.',
        bonus: { hygiene: 20 }
      },
      {
        level: 3,
        name: 'Cửa Lưới Chắn Côn Trùng Inox',
        cost: 4200000,
        minChapter: 2,
        minDay: 17,
        unlockHint: 'Mở ở Chương 2, Ngày 17',
        description: 'Ngăn ruồi muỗi và bụi bẩn: dầu bền hơn 40%, sao Vệ sinh tăng nhanh hơn 40%.',
        bonus: { hygiene: 40 }
      },
      {
        level: 4,
        name: 'Bẫy Chuột Sóng Siêu Âm Thông Minh',
        cost: 10000000,
        minChapter: 2,
        minDay: 32,
        unlockHint: 'Mở ở Chương 2, Ngày 32',
        description: 'Sóng âm xua đuổi hoàn toàn gặm nhấm: MIỄN NHIỄM 100% SỰ CỐ CHUỘT CỐNG ĐỘT NHẬP, dầu bền hơn 60%!',
        bonus: { hygiene: 60, pestImmunity: true }
      },
      {
        level: 5,
        name: 'Hệ Thống Hút Khói & Khử Khuẩn UV',
        cost: 23000000,
        minChapter: 3,
        minDay: 54,
        unlockHint: 'Mở ở Chương 3, Ngày 54',
        description: 'Gian bếp vô trùng chuẩn nhà hàng: dầu chiên lâu đen thêm 80%, miễn dịch chuột 100%.',
        bonus: { hygiene: 80, pestImmunity: true }
      },
      {
        level: 6,
        name: 'Hệ Thống Lọc Dầu Tuần Hoàn Áp Suất',
        cost: 45000000,
        minChapter: 3,
        minDay: 78,
        unlockHint: 'Mở ở Chương 3, Ngày 78',
        description: 'Lọc cặn nano tự động: dầu bền gấp đôi (+100% số mẻ), sao Vệ sinh luôn vững chắc, miễn dịch chuột 100%.',
        bonus: { hygiene: 100, pestImmunity: true }
      },
      {
        level: 7,
        name: 'Gian Bếp Vô Trùng Chuẩn ISO',
        cost: 82000000,
        minChapter: 4,
        minDay: 114,
        unlockHint: 'Mở ở Chương 4, Ngày 114',
        description: 'Quy trình phòng sạch tiêu chuẩn quốc tế: dầu bền +120%, miễn dịch hoàn toàn dịch hại.',
        bonus: { hygiene: 120, pestImmunity: true }
      },
      {
        level: 8,
        name: 'Chứng Nhận ATTP 5 Sao Quốc Tế',
        cost: 145000000,
        minChapter: 4,
        minDay: 148,
        unlockHint: 'Mở ở Chương 4, Ngày 148',
        description: 'Đạt chuẩn vàng vệ sinh thực phẩm toàn cầu: dầu bền +150%, tiệm luôn sáng bóng tinh tươm.',
        bonus: { hygiene: 150, pestImmunity: true }
      }
    ]
  }
};
