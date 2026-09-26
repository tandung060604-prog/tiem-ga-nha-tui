import { StoryTrigger } from '../core/progression';

// Hệ thống Khách Bí Ẩn mang nhiệm vụ & chuỗi sự kiện đặc biệt

export interface MysteryGuestQuest {
  id: string;
  trigger: StoryTrigger; // mở theo tiến độ chương, hiện 1 lần (ghi vào state.completedQuests)
  guestName: string;
  avatar: string;
  title: string;
  dialogue: string;
  conditionDescription: string;
  rewardDescription: string;
  rewardType: 'money' | 'taste_boost' | 'customer_boost' | 'recipe';
  rewardValue: number;
  isCompleted: boolean;
}

export const MYSTERY_QUESTS: MysteryGuestQuest[] = [
  {
    id: 'quest_spices',
    trigger: { chapter: 1, atProgress: 0.5 },
    guestName: 'Lão Hạc Cầm Bình Gốm',
    avatar: '🧙‍♂️',
    title: 'Thương nhân gia vị cổ truyền',
    dialogue: '"Ta ngửi thấy mùi khói chảo gang của người có tâm huyết. Nếu người chiên được mẻ gà đạt chuẩn Vàng Giòn Perfect, ta sẽ trao lại gói ngũ vị thất truyền này!"',
    conditionDescription: 'Chiên 1 mẻ Gà Giòn Nhà Tui đạt chuẩn Perfect.',
    rewardDescription: 'Mở khóa Gói Gia Vị Thất Truyền (+20% điểm Hương Vị vĩnh viễn).',
    rewardType: 'taste_boost',
    rewardValue: 20,
    isCompleted: false
  },
  {
    id: 'quest_michelin',
    trigger: { chapter: 2, atProgress: 0.5 },
    guestName: 'Thanh Tra Ẩm Thực Ẩn Danh',
    avatar: '🕵️‍♂️',
    title: 'Nhà phê bình sao vàng',
    dialogue: '"Tôi đã đi khắp các con phố ẩm thực Sài Gòn. Hãy chứng minh cho tôi thấy tiệm gà trong hẻm này xứng đáng có mặt trên bản đồ ẩm thực thành phố!"',
    conditionDescription: 'Phục vụ mẻ gà giòn với dầu chiên đạt chuẩn Sạch Sẽ (Vàng óng).',
    rewardDescription: 'Bài viết ca ngợi trên báo chí (+50% lượng khách trong 3 ngày).',
    rewardType: 'customer_boost',
    rewardValue: 50,
    isCompleted: false
  },
  {
    id: 'quest_rival_spy',
    trigger: { chapter: 4, atProgress: 0.25 },
    guestName: 'Môi Giới Chuỗi MegaChicken',
    avatar: '🕶️',
    title: 'Kẻ dọ thám đối thủ',
    dialogue: '"Tập đoàn chúng tôi chú ý tới tiệm của bạn đã lâu. Hãy bán lại công thức nước sốt bí mật với giá 15.000.000đ, hoặc chuẩn bị đối đầu với 3 chi nhánh mới của chúng tôi!"',
    conditionDescription: 'Lựa chọn của bạn: Nhận tiền thỏa hiệp hay kiên quyết giữ bản sắc?',
    rewardDescription: 'Nhận 15.000.000đ tiền mặt (Nếu từ chối: Tăng 100% lòng trung thành của cư dân khu phố).',
    rewardType: 'money',
    rewardValue: 15000000,
    isCompleted: false
  }
];
