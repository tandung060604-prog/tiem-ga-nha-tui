import { UpgradeBranch } from '../types/game';

// Hệ thống 7 nhánh nâng cấp mở rộng (Bếp, Không gian, Vận hành, Marketing, Kho lạnh, Dịch vụ, Vệ sinh)
// Đảm bảo người chơi có tiến trình lâu dài tới Chương 5 (hơn 50 mốc nâng cấp, giá từ 500k đến 150 triệu).
// Mọi nâng cấp đều có tác dụng thực tế lên tốc độ, bảo quản, miễn dịch chuột, hoa hồng, tiền tip và giá bán.

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
        description: 'Chảo gang truyền thống, chiên từng mẻ một.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Nồi Chiên Đôi 2 Giỏ',
        cost: 1000000,
        description: 'Giỏ lớn, lửa đều: gà lên vàng nhanh hơn 35% (vùng Perfect vẫn giữ nguyên độ dài).',
        bonus: { speed: 35 }
      },
      {
        level: 3,
        name: 'Tủ Giữ Nóng Giòn 70°C',
        cost: 2500000,
        description: 'Gà ra lò lúc nào cũng nóng giòn: khách sẵn lòng trả thêm 5%, sao Hương vị tăng nhanh hơn 25%.',
        bonus: { taste: 25, space: 15 }
      },
      {
        level: 4,
        name: 'Nồi Chiên Áp Suất Cao Tần',
        cost: 3500000,
        description: 'Khóa độ ẩm, thịt ngọt da giòn: gà lên vàng nhanh hơn 50% (cả giỏ phụ bếp), sao Hương vị tăng nhanh hơn 35%.',
        bonus: { taste: 35, speed: 50 }
      },
      {
        level: 5,
        name: 'Hệ Thống Lọc Dầu Tuần Hoàn',
        cost: 4500000,
        description: 'Dầu luôn vàng trong: dầu bền hơn 45%, lâu phải thay dầu mới.',
        bonus: { hygiene: 45 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Chiên Tự Động',
        cost: 8000000,
        description: 'Thêm một giỏ chiên robot tự chạy (95% Perfect, không cần người đứng), tự nhấc giỏ của chủ quán đúng lúc Perfect.',
        bonus: { speed: 60, taste: 20 }
      },
      {
        level: 7,
        name: 'Trạm Chiên 3 Hộc Công Nghiệp',
        cost: 15000000,
        description: 'Nâng công suất toàn bếp: gà chín nhanh hơn 75%, hương vị đậm đà thơm ngát.',
        bonus: { speed: 75, taste: 30 }
      },
      {
        level: 8,
        name: 'Nồi Chiên Áp Suất Kép Robot AI',
        cost: 30000000,
        description: 'Công nghệ chiên chân không áp suất kép: gà giòn tan mọng nước, tốc độ chiên +90%, sao Hương vị +45%.',
        bonus: { speed: 90, taste: 45 }
      },
      {
        level: 9,
        name: 'Hệ Thống Bếp Master Chef',
        cost: 60000000,
        description: 'Đỉnh cao kỹ nghệ chiên giòn: gà chín siêu tốc +100%, sao Hương vị vĩnh viễn vững chắc.',
        bonus: { speed: 100, taste: 60 }
      },
      {
        level: 10,
        name: 'Lò Luyện Kim Bí Truyền Hẻm 1102',
        cost: 120000000,
        description: 'Bảo vật gia truyền Bác Ba: gà giòn rực rỡ, khách trả thêm 10%, tốc độ +120%, hương vị +80%.',
        bonus: { speed: 120, taste: 80, space: 30 }
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
        description: 'Vài chiếc ghế nhựa con ngồi ăn nhanh bên xe đẩy.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Bàn Gỗ Ấm Cúng (Tiệm Hẻm)',
        cost: 1200000,
        description: '4 bộ bàn ghế gỗ sạch đẹp: khách sẵn lòng trả thêm 5%, quầy rộng thêm 1 ô khay.',
        bonus: { space: 15, capacity: 2 }
      },
      {
        level: 3,
        name: 'Máy Lạnh Inverter Mát Lạnh',
        cost: 3200000,
        description: 'Mát lạnh giữa trưa Sài Gòn: khách sẵn lòng trả thêm 10%, quầy rộng thêm 2 ô khay.',
        bonus: { space: 30, capacity: 4 }
      },
      {
        level: 4,
        name: 'Góc Sống Ảo Check-in Gà Bông',
        cost: 4200000,
        description: 'Góc decor hút GenZ chụp hình: khách trả thêm 15%, thêm 25% khách.',
        bonus: { space: 45, capacity: 4, customers: 25 }
      },
      {
        level: 5,
        name: 'Mặt Tiền Phố 12 Bàn Ăn',
        cost: 7000000,
        description: 'Đèn neon, nhạc lofi, quầy lớn: khách trả thêm 20%, quầy rộng thêm 3 ô khay, thêm 40% khách.',
        bonus: { space: 60, capacity: 12, customers: 40 }
      },
      {
        level: 6,
        name: 'Phòng Lạnh Kính Cường Lực View Hẻm',
        cost: 16000000,
        description: 'Không gian máy lạnh kính tràn viền: khách trả thêm 25%, tăng thêm 60% lượng khách.',
        bonus: { space: 75, capacity: 12, customers: 60 }
      },
      {
        level: 7,
        name: 'Bistro 2 Tầng Phong Cách Hàn Quốc',
        cost: 35000000,
        description: 'Nhà hàng K-Bistro 2 tầng ấm cúng: khách trả thêm 30%, tăng 85% khách ghé tiệm.',
        bonus: { space: 90, capacity: 12, customers: 85 }
      },
      {
        level: 8,
        name: 'Mặt Tiền Phố Đi Bộ Sầm Uất',
        cost: 75000000,
        description: 'Tọa độ kim cương giữa lòng thành phố: khách trả thêm 35%, lượng khách tăng gấp đôi (+120%).',
        bonus: { space: 105, capacity: 12, customers: 120 }
      },
      {
        level: 9,
        name: 'Tòa Nhà Gà Rán 5 Tầng Landmark',
        cost: 150000000,
        description: 'Đại bản doanh chuỗi tiệm gà số 1 Việt Nam: khách trả thêm 40%, khách đổ về tấp nập (+160%).',
        bonus: { space: 120, capacity: 12, customers: 160 }
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
        description: 'Viết bill bằng tay, dễ nhầm lẫn khi đông khách.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Máy POS In Bill Nhanh',
        cost: 600000,
        description: 'In order rõ ràng, sắp món theo số: quầy rộng thêm 1 ô khay, khách chờ được lâu hơn 20%.',
        bonus: { speed: 20, capacity: 2 }
      },
      {
        level: 3,
        name: 'Màn Hình Gọi Số Khách Hàng',
        cost: 900000,
        description: 'Khách tự nhìn số lấy món: quầy rộng thêm 1 ô khay, chờ được lâu hơn 25%, dầu bền hơn 15%.',
        bonus: { speed: 25, hygiene: 15, capacity: 2 }
      },
      {
        level: 4,
        name: 'Kiosk Cảm Ứng Tự Order',
        cost: 1200000,
        description: 'Khách tự order, tự lấy nước và tự nhận món khi khay đủ (như có phục vụ); chờ được lâu hơn 40%.',
        bonus: { speed: 40, capacity: 2 }
      },
      {
        level: 5,
        name: 'App Giao Hàng Độc Quyền',
        cost: 4500000,
        description: 'App riêng của tiệm: không còn mất 8% hoa hồng cho app giao hàng ngoài, thêm 70% khách mỗi ngày.',
        bonus: { customers: 70 }
      },
      {
        level: 6,
        name: 'Màn Hình Quản Lý Bếp KDS',
        cost: 10000000,
        description: 'Hệ thống KDS đồng bộ quầy bán & bếp: khách kiên nhẫn tăng thêm 50%, thêm 80% khách.',
        bonus: { speed: 50, customers: 80 }
      },
      {
        level: 7,
        name: 'Robot Thu Dọn Bàn Tự Động',
        cost: 24000000,
        description: 'Robot bưng khay và dọn bàn: phục vụ siêu tốc, khách kiên nhẫn +65%, vệ sinh tăng +30%.',
        bonus: { speed: 65, hygiene: 30 }
      },
      {
        level: 8,
        name: 'Hệ Thống ERP Chuỗi Cung Ứng AI',
        cost: 55000000,
        description: 'AI tối ưu vận hành: giảm 10% chi phí nguyên liệu sỉ, tăng kiên nhẫn khách +80%.',
        bonus: { speed: 80, discount: 10 }
      },
      {
        level: 9,
        name: 'Mạng Lưới Drone Giao Hàng Siêu Tốc',
        cost: 110000000,
        description: 'Giao hàng hỏa tốc trong 5 phút: thêm 150% khách giao hàng, khách kiên nhẫn +100%.',
        bonus: { speed: 100, customers: 150 }
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
        description: 'Khách quen trong hẻm giới thiệu cho nhau.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Phát Tờ Rơi Ngã Ba',
        cost: 650000,
        description: 'Tờ rơi in màu bắt mắt: thêm 20% khách mỗi ngày.',
        bonus: { customers: 20 }
      },
      {
        level: 3,
        name: 'Fanpage Threads & Facebook',
        cost: 1800000,
        description: 'Meme Gà Bông viral triệu view: thêm 35% khách, thương hiệu nổi → khách trả thêm 3%.',
        bonus: { customers: 35, space: 9 }
      },
      {
        level: 4,
        name: 'Livestream Mukbang Gà Giòn',
        cost: 2400000,
        description: 'Tiếng cắn gà giòn rụm trên livestream: thêm 55% khách, khách trả thêm 5%.',
        bonus: { customers: 55, space: 15 }
      },
      {
        level: 5,
        name: 'Hợp Tác Food Reviewer Triệu Follower',
        cost: 3200000,
        description: 'Reviewer khen nức nở: thêm 85% khách, khách trả thêm 8% cho quán nổi tiếng.',
        bonus: { customers: 85, space: 24 }
      },
      {
        level: 6,
        name: 'Billboard Đèn LED Ngã Tư Hàng Xanh',
        cost: 8500000,
        description: 'Biển quảng cáo khổng lồ cửa ngõ thành phố: thêm 110% khách, khách trả thêm 10%.',
        bonus: { customers: 110, space: 30 }
      },
      {
        level: 7,
        name: 'Tài Trợ Gameshow Ẩm Thực Giờ Vàng',
        cost: 20000000,
        description: 'Phủ sóng truyền hình quốc gia: thương hiệu quốc dân, thêm 140% khách mỗi ngày.',
        bonus: { customers: 140, space: 40 }
      },
      {
        level: 8,
        name: 'Đại Sứ Thương Hiệu Idol Hạng A',
        cost: 50000000,
        description: 'Idol K-pop/V-pop làm đại diện: fan hâm mộ xếp hàng mua gà, thêm 180% khách.',
        bonus: { customers: 180, space: 50 }
      },
      {
        level: 9,
        name: 'Chiến Dịch Toàn Cầu Gà Rán Nam Bộ Viral',
        cost: 100000000,
        description: 'Gà rán Sài Gòn bước ra thế giới: khách quốc tế săn đón, thêm 230% khách tấp nập.',
        bonus: { customers: 230, space: 60 }
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
        description: 'Để tạm vài khay thịt gà và lon nước ngọt trong ngày.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Thùng Giữ Lạnh Foam Dày',
        cost: 800000,
        description: 'Giữ thịt gà tươi thêm 1 ngày hạn dùng, giảm hao hụt nguyên liệu tồn kho.',
        bonus: { shelfLife: 1 }
      },
      {
        level: 3,
        name: 'Tủ Đông Sanaky 2 Cánh 400L',
        cost: 2200000,
        description: 'Bảo quản nguyên liệu lâu hơn 2 ngày, giảm 5% giá mua nguyên liệu sỉ.',
        bonus: { shelfLife: 2, discount: 5 }
      },
      {
        level: 4,
        name: 'Phòng Lạnh Hút Chân Không Bếp',
        cost: 5500000,
        description: 'Nguyên liệu không hỏng trước 4 ngày (+3 ngày hạn dùng), giảm 10% giá mua sỉ.',
        bonus: { shelfLife: 3, discount: 10 }
      },
      {
        level: 5,
        name: 'Kho Đông Lạnh Cấp Tốc -18°C',
        cost: 12000000,
        description: 'Khóa trọn độ tươi sống (+4 ngày hạn), giảm 15% giá nhập sỉ toàn bộ kho.',
        bonus: { shelfLife: 4, discount: 15 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Bảo Quản Khí Nitơ Lỏng',
        cost: 25000000,
        description: 'Bảo quản hoàn hảo (+5 ngày hạn), giảm 20% giá sỉ, thịt ngọt thơm tăng sao Hương vị.',
        bonus: { shelfLife: 5, discount: 20, taste: 15 }
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
        description: 'Phục vụ nước uống và khăn ăn đơn sơ tại quầy.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Bình Giữ Nhiệt Trà Đá Tự Phục Vụ',
        cost: 750000,
        description: 'Khách tự rót trà đá trong lúc đợi: khách vui vẻ chờ lâu hơn 15%.',
        bonus: { speed: 15 }
      },
      {
        level: 3,
        name: 'Máy Rót Nước Tự Động 2 Vòi',
        cost: 2500000,
        description: 'Rót nước ngọt trong chớp mắt: tự động hoàn thành món nước ngọt khi khách order!',
        bonus: { autoDrink: true, speed: 25 }
      },
      {
        level: 4,
        name: 'Quầy Sốt Đầy Đủ Tự Phục Vụ',
        cost: 4800000,
        description: 'Tương cà, tương ớt, mayonnaise: khách dặn tương được thưởng tip gấp đôi (+4.000đ/món).',
        bonus: { sauceTip: 4000 }
      },
      {
        level: 5,
        name: 'Thẻ Rung Báo Lấy Món Điện Tử',
        cost: 9500000,
        description: 'Khách ngồi yên tâm chờ thẻ rung: khách kiên nhẫn +35%, quầy rộng thêm 1 ô khay.',
        bonus: { speed: 35, capacity: 2 }
      },
      {
        level: 6,
        name: 'Quầy Pha Chế Barista K-Chicken',
        cost: 22000000,
        description: 'Tự động phục vụ nước ngọt và tráng miệng, tip tương tăng +8.000đ, phục vụ siêu mượt.',
        bonus: { autoDrink: true, sauceTip: 8000, speed: 45 }
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
        description: 'Quét dọn vỉa hè và gom rác thủ công cuối mỗi ca.',
        bonus: {}
      },
      {
        level: 2,
        name: 'Thùng Rác Đạp Chân Có Nắp Kín',
        cost: 500000,
        description: 'Dọn sạch dầu thừa và rác bếp: sao Vệ sinh +15%, giảm 20% nguy cơ chuột bọ.',
        bonus: { hygiene: 15, pestShield: 20 }
      },
      {
        level: 3,
        name: 'Cửa Lưới Chắn Côn Trùng Inox',
        cost: 1800000,
        description: 'Ngăn ruồi muỗi và chuột bọ: sao Vệ sinh +30%, giảm 50% nguy cơ chuột kho.',
        bonus: { hygiene: 30, pestShield: 50 }
      },
      {
        level: 4,
        name: 'Bẫy Chuột Sóng Siêu Âm Thông Minh',
        cost: 4200000,
        description: 'Sóng âm xua đuổi 100% loài gặm nhấm: Miễn nhiễm hoàn toàn sự cố Chuột Cống đột nhập!',
        bonus: { pestImmunity: true, hygiene: 40 }
      },
      {
        level: 5,
        name: 'Hệ Thống Hút Khói & Khử Khuẩn UV',
        cost: 10000000,
        description: 'Gian bếp vô trùng chuẩn nhà hàng: dầu chiên lâu đen gấp đôi (+60%), miễn dịch chuột 100%.',
        bonus: { hygiene: 60, pestImmunity: true }
      },
      {
        level: 6,
        name: 'Chứng Nhận ATTP 5 Sao Quốc Tế',
        cost: 28000000,
        description: 'Đạt chuẩn vàng vệ sinh: đoàn thanh tra khen ngợi, khách tin tưởng trả thêm 10% giá trị món.',
        bonus: { hygiene: 80, space: 30, pestImmunity: true }
      }
    ]
  }
};
