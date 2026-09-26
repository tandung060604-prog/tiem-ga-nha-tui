import { UpgradeBranch } from '../types/game';

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
        cost: 800000,
        description: 'Giỏ lớn, lửa đều: gà lên vàng nhanh hơn 35% (vùng Perfect vẫn dài như cũ).',
        bonus: { speed: 35 }
      },
      {
        level: 3,
        name: 'Tủ Giữ Nóng Giòn 70°C',
        cost: 2500000,
        description: 'Giữ gà luôn nóng giòn: sao Hương vị tăng nhanh hơn 25%, tụt chậm hơn.',
        bonus: { taste: 25 }
      },
      {
        level: 4,
        name: 'Nồi Chiên Áp Suất Cao Tần',
        cost: 8000000,
        description: 'Khóa độ ẩm, thịt ngọt da giòn: sao Hương vị tăng nhanh hơn 35%.',
        bonus: { taste: 35, speed: 25 }
      },
      {
        level: 5,
        name: 'Hệ Thống Lọc Dầu Tuần Hoàn',
        cost: 18000000,
        description: 'Dầu luôn vàng trong: dầu bền hơn 45%, lâu phải thay.',
        bonus: { hygiene: 45 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Chiên Tự Động',
        cost: 45000000,
        description: 'Tự động nhấc giỏ đúng lúc gà chín Perfect, gà lên vàng nhanh hơn 60%.',
        bonus: { speed: 60, taste: 20 }
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
        bonus: { capacity: 2 }
      },
      {
        level: 2,
        name: 'Bàn Gỗ Ấm Cúng (Tiệm Hẻm)',
        cost: 1200000,
        description: 'Trang bị 4 bộ bàn ghế gỗ sạch đẹp, khách ngồi thoải mái.',
        bonus: { space: 25, capacity: 4 }
      },
      {
        level: 3,
        name: 'Máy Lạnh Inverter Mát Lạnh',
        cost: 4500000,
        description: 'Giải nhiệt ngày nóng, khách ngồi lâu vui vẻ: tăng điểm Không gian.',
        bonus: { space: 30 }
      },
      {
        level: 4,
        name: 'Góc Sống Ảo Check-in Gà Bông',
        cost: 12000000,
        description: 'Góc decor hút GenZ chụp hình đăng Threads: thêm 25% khách.',
        bonus: { space: 35, customers: 25 }
      },
      {
        level: 5,
        name: 'Mặt Tiền Phố 12 Bàn Ăn',
        cost: 35000000,
        description: 'Sức chứa lớn, đèn neon, nhạc lofi: thêm 40% khách.',
        bonus: { space: 45, capacity: 12, customers: 40 }
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
        cost: 1500000,
        description: 'In order rõ ràng, khách chờ được lâu hơn 20%.',
        bonus: { speed: 20 }
      },
      {
        level: 3,
        name: 'Màn Hình Gọi Số Khách Hàng',
        cost: 5000000,
        description: 'Khách tự nhìn số lấy món: chờ được lâu hơn 25%, dầu bền hơn 15%.',
        bonus: { speed: 25, hygiene: 15 }
      },
      {
        level: 4,
        name: 'Kiosk Cảm Ứng Tự Order',
        cost: 15000000,
        description: 'Khách tự bấm order, thanh toán: chờ được lâu hơn 40%.',
        bonus: { speed: 40 }
      },
      {
        level: 5,
        name: 'App Giao Hàng Độc Quyền',
        cost: 40000000,
        description: 'Đơn online nổ liên tục trưa và tối: thêm 70% khách mỗi ngày.',
        bonus: { customers: 70 }
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
        cost: 500000,
        description: 'Tờ rơi in màu bắt mắt: thêm 20% khách mỗi ngày.',
        bonus: { customers: 20 }
      },
      {
        level: 3,
        name: 'Fanpage Threads & Facebook',
        cost: 3000000,
        description: 'Đăng meme Gà Bông, bài viral triệu view: thêm 35% khách.',
        bonus: { customers: 35 }
      },
      {
        level: 4,
        name: 'Livestream Mukbang Gà Giòn',
        cost: 10000000,
        description: 'Tiếng cắn gà giòn rụm trên livestream: thêm 55% khách.',
        bonus: { customers: 55 }
      },
      {
        level: 5,
        name: 'Hợp Tác Food Reviewer Triệu Follower',
        cost: 25000000,
        description: 'Reviewer khen nức nở, khách xếp hàng dài: thêm 85% khách.',
        bonus: { customers: 85 }
      }
    ]
  }
};
