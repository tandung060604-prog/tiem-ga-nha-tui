import { UpgradeBranch } from '../types/game';

// Giá theo lãi thêm đo bằng scripts/upgrade-roi.ts (người chơi trung bình có nhân viên):
// cấp 2 hoàn vốn ~8 ngày, cấp 3 ~12, cấp 4–6 ~15–20 ngày; cấp sau luôn đắt hơn cấp trước.
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
        description: 'Giỏ lớn, lửa đều: gà lên vàng nhanh hơn 35% (vùng Perfect vẫn dài như cũ).',
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
        description: 'Dầu luôn vàng trong: dầu bền hơn 45%, lâu phải thay.',
        bonus: { hygiene: 45 }
      },
      {
        level: 6,
        name: 'Dây Chuyền Chiên Tự Động',
        cost: 8000000,
        description: 'Thêm một giỏ chiên robot tự chạy (95% Perfect, không cần người đứng), tự nhấc giỏ của chủ quán đúng lúc Perfect.',
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
      }
    ]
  }
};
