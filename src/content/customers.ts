export interface RegularCustomer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  favoriteOrder: string[];
  story: string;
}

export const REGULAR_CUSTOMERS: RegularCustomer[] = [
  {
    id: 'reg_1',
    name: 'Bé Na & Bạn Trai',
    avatar: '👩‍❤️‍👨',
    title: 'Cặp đôi hẹn hò',
    favoriteOrder: ['combo_duo'],
    story: 'Cứ mỗi chiều thứ 6 là hai bạn lại dắt tay nhau qua tiệm ăn gà sốt bơ tỏi.'
  },
  {
    id: 'reg_2',
    name: 'Nhóm Học Sinh Bàn Cuối',
    avatar: '🎒',
    title: 'Học sinh ôn thi',
    favoriteOrder: ['shake_fries', 'crispy_chicken', 'soda'],
    story: 'Tan trường là tụ tập vừa ăn khoai lắc vừa bàn luận đề thi thử đại học.'
  },
  {
    id: 'reg_3',
    name: 'Anh Tuấn Shipper Ruột',
    avatar: '🛵',
    title: 'Tài xế công nghệ',
    favoriteOrder: ['crispy_chicken', 'soda'],
    story: 'Chạy xe mệt mỏi ghé tiệm nghỉ chân, thích tiệm vì làm đơn nhanh không phải chờ.'
  },
  {
    id: 'reg_4',
    name: 'Chị Mai Dân Văn Phòng',
    avatar: '💼',
    title: 'Nhân viên công sở',
    favoriteOrder: ['chicken_rice', 'peach_tea'],
    story: 'Ăn trưa gọn gàng để kịp về chạy KPI dự án, đánh giá cao tốc độ phục vụ.'
  },
  {
    id: 'reg_5',
    name: 'Gia Đình Bác Tư',
    avatar: '👨‍👩‍👧',
    title: 'Gia đình ấm cúng',
    favoriteOrder: ['family_bucket'],
    story: 'Dắt hai bé nhỏ đi ăn mừng cuối tuần, thích gà chiên da giòn không bị ngấy dầu.'
  },
  {
    id: 'reg_6',
    name: 'Quỳnh Anh Tiktoker',
    avatar: '📸',
    title: 'Content Creator ẩm thực',
    favoriteOrder: ['spicy_chicken', 'korean_tokbokki_chicken'],
    story: 'Thích quay video review reaction đồ ăn cay xé lưỡi, mang về hàng triệu lượt xem.'
  },
  {
    id: 'reg_7',
    name: 'Bác Ba Tổ Trưởng',
    avatar: '👴',
    title: 'Người lớn tuổi trong hẻm',
    favoriteOrder: ['crispy_chicken', 'biscuit_honey'],
    story: 'Ủng hộ người trẻ lập nghiệp, thường dắt các cháu sang ăn gà vào chiều muộn.'
  },
  {
    id: 'reg_8',
    name: 'Chị Lan Khó Tính (Karen)',
    avatar: '💅',
    title: 'Thực khách kỹ tính',
    favoriteOrder: ['honey_garlic_chicken', 'soda'],
    story: 'Rất kỹ về độ giòn và sạch sẽ của dầu ăn. Khi tiệm làm chuẩn Perfect, chị sẽ cho 5 sao trung thành.'
  },
  {
    id: 'reg_9',
    name: 'Đức Huy Game Thủ',
    avatar: '🎧',
    title: 'Cú đêm cày rank',
    favoriteOrder: ['popcorn_chicken', 'soda'],
    story: 'Chuyên ghé ca tối mua gà viên popcorn về vừa cày game vừa nhâm nhi.'
  },
  {
    id: 'reg_10',
    name: 'Bé Bắp & Mẹ',
    avatar: '🧒',
    title: 'Khách hàng nhí',
    favoriteOrder: ['shake_fries', 'sundae_icecream'],
    story: 'Mê tít khoai lắc phô mai và kem sundae mát lạnh, được mẹ dắt đi thưởng sau khi đạt điểm 10.'
  },
  {
    id: 'reg_11',
    name: 'Anh Long Trưởng Phòng',
    avatar: '👔',
    title: 'Sếp khao cả team',
    favoriteOrder: ['family_bucket', 'soda'],
    story: 'Mỗi khi team chốt được hợp đồng lớn, anh lại đặt 3-4 xô gà về văn phòng khao cả phòng.'
  },
  {
    id: 'reg_12',
    name: 'Food Reviewer Bí Ẩn',
    avatar: '🕵️',
    title: 'Nhà phê bình ẩm thực',
    favoriteOrder: ['crispy_chicken', 'spicy_chicken', 'honey_garlic_chicken'],
    story: 'Thử đủ các vị gà để chấm điểm khắt khe. Bài đánh giá của chuyên gia này sẽ quyết định danh tiếng cả quận!'
  }
];

export const CUSTOMER_GROUPS = [
  { type: 'student', name: 'Học Sinh', avatar: '🎒', patienceMultiplier: 1.1 },
  { type: 'office', name: 'Dân Văn Phòng', avatar: '💼', patienceMultiplier: 0.85 },
  { type: 'couples', name: 'Cặp Đôi', avatar: '👫', patienceMultiplier: 1.2 },
  { type: 'family', name: 'Gia Đình', avatar: '👨‍👩‍👧', patienceMultiplier: 1.0 },
  { type: 'shipper', name: 'Shipper Giao Hàng', avatar: '🛵', patienceMultiplier: 0.8 },
  { type: 'reviewer', name: 'Reviewer Khó Tính', avatar: '🧐', patienceMultiplier: 0.9 },
  { type: 'tiktoker', name: 'TikToker GenZ', avatar: '📱', patienceMultiplier: 1.0 }
];
