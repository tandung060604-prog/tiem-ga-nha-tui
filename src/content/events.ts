import { GameEvent, NonEmpty } from '../types/game';

export const RANDOM_EVENTS: NonEmpty<GameEvent> = [
  {
    id: 'heavy_rain',
    title: '🌧️ Cơn Mưa Rào Bất Chợt',
    description: 'Trời mưa to ngập đường, khách ăn tại chỗ giảm nhưng đơn app giao hàng tăng vọt 80%!',
    effect: {
      customerMultiplier: 0.6,
      deliveryMultiplier: 1.8,
      specialTip: 'Hãy chuẩn bị sẵn gà chiên và khoai tây để shipper lấy đơn nhanh!'
    }
  },
  {
    id: 'football_match',
    title: '⚽ Trận Bóng Đá Chung Kết!',
    description: 'Đội tuyển Việt Nam đá chung kết, nhóm bạn tụ tập xem bóng đá nổ đơn Combo & Bucket liên tục!',
    effect: {
      customerMultiplier: 1.5,
      deliveryMultiplier: 1.6,
      priceMultiplier: 1.1,
      specialTip: 'Nhu cầu Bucket và Nước ngọt tăng đột biến, chuẩn bị kho thật đầy!'
    }
  },
  {
    id: 'food_reviewer',
    title: '🕵️ Food Reviewer Bí Mật Ghé Quán',
    description: 'Một Tiktoker ẩm thực có tiếng đang ngồi lẫn trong khách để quay video trải nghiệm ẩn danh.',
    effect: {
      customerMultiplier: 1.2,
      specialTip: 'Phục vụ mẻ gà Perfect để nhận review 5 sao lan tỏa viral trên Threads!'
    }
  },
  {
    id: 'health_inspector',
    title: '📋 Đội Kiểm Tra Vệ Sinh Bất Ngờ',
    description: 'Đội kiểm tra ATTP ghé thăm đột xuất kiểm tra độ sạch của dầu chiên và khu chế biến.',
    effect: {
      customerMultiplier: 1.0,
      inspection: true,
      specialTip: 'Hãy chắc chắn dầu chiên sạch sẽ, nếu dầu đen sẽ bị phạt tiền vệ sinh!'
    }
  },
  {
    id: 'heatwave',
    title: '☀️ Nắng Nóng Đỉnh Điểm 39°C',
    description: 'Thời tiết oi bức, khách gọi nhiều nước ngọt, trà đào và kem Sundae để giải nhiệt.',
    effect: {
      customerMultiplier: 1.1,
      deliveryMultiplier: 1.3,
      specialTip: 'Nước ngọt và đồ tráng miệng bán cực chạy trong hôm nay.'
    }
  },
  {
    id: 'rival_promo',
    title: '⚡ Chuỗi Gà Đối Thủ Giảm Giá 50%',
    description: 'Cửa hàng gà rán lớn đối diện chạy chương trình khuyến mãi rầm rộ để tranh giành khách.',
    effect: {
      customerMultiplier: 0.75,
      specialTip: 'Hãy tung khuyến mãi hoặc dựa vào hương vị gà nhà làm tươi ngon hơn đồ công nghiệp!'
    }
  }
];
