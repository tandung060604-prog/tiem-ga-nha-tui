// Nội dung và cốt truyện của Bé Thỏ Cam (Mimi) - Khách hàng bí ẩn kết nối Story Hẻm 1102
import { BaseMenuItemId, Criteria, GameState, NonEmpty } from '../types/game';
import { StoryTrigger, isTriggered } from '../core/progression';
import { pick, random } from '../core/rng';

export interface BunnyLetter {
  id: string;
  // Mở theo tiến độ chương (không theo ngày) để thư không kể trước chuyện của chương sau
  trigger: StoryTrigger;
  title: string;
  relatedCharacters: string[];
  noteContent: string;
  storyImpact: string;
  rewardText: string;
  tip: number; // tiền cộng thẳng vào ví khi giao món cho Thỏ Cam
  // Cộng vào tiêu chí (không cộng vào overall, vì overall được tính lại từ tiêu chí mỗi ngày)
  boost?: { criteria: readonly Criteria[]; value: number };
  preferredFood: string;       // Tên món ăn bé thích
  menuItemId: BaseMenuItemId;  // ID món ăn
}

export const BUNNY_LETTERS: NonEmpty<BunnyLetter> = [
  {
    id: 'bunny_letter_1',
    trigger: { chapter: 1, atProgress: 0.25 },
    title: 'Mảnh Giấy Số 1: Khói Dầu Chiều Mưa & Bác Ba',
    relatedCharacters: ['Bác Ba Tổ Trưởng', 'Chủ Tiệm Gà'],
    noteContent: `
      "Chào bạn chủ tiệm!
      Chiều nay mưa gió, mình núp dưới hiên thấy bạn chăm chú chiên từng mẻ gà. Bác Ba đứng đằng xa nhìn bạn hồi lâu rồi gật gù đấy. Bác ấy nhớ những ngày rực rỡ ở Chợ Lớn năm xưa...
      Miếng gà của bạn giòn và ấm lắm. Cố lên nhé, cả con hẻm đang bắt đầu ngửi thấy mùi thơm từ tiệm bạn rồi!"
    `,
    storyImpact: 'Bác Ba Tổ Trưởng bí mật gửi tặng bạn bí quyết chỉnh lửa chảo gang, giúp gà chín đều không bị sống bên trong.',
    rewardText: '+50.000đ tiền tip & Tăng +0.2 sao Hương Vị vĩnh viễn',
    tip: 50000,
    boost: { criteria: ['taste'], value: 0.2 },
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_2',
    trigger: { chapter: 2, atProgress: 0.25 },
    title: 'Mảnh Giấy Số 2: Bức Tranh Ở Góc Bàn Số 2',
    relatedCharacters: ['Bé Na', 'Dũng Vẽ Truyện Tranh'],
    noteContent: `
      "Hôm nay góc bàn số 2 có hai bạn trẻ dễ thương lắm.
      Bạn nam tên Dũng, vừa chia nửa miếng gà cho bạn nữ vừa hí hoáy vẽ gì đó vào cuốn sổ tay. Bạn ấy còn vẽ tặng mình một bức tranh thỏ con mặc áo cam nữa nè!
      Dù gia đình bạn nữ đang ngăn cấm, nhưng mình thấy trong mắt họ có cả một trời ước mơ. Bạn hãy giữ lấy góc bàn ấm áp này cho hai bạn ấy nhé."
    `,
    storyImpact: 'Mở khóa không gian ấm cúng cho các cặp đôi trẻ, khách học sinh sinh viên ghé quán tăng 25%.',
    rewardText: '+80.000đ tiền tip từ Thỏ Cam',
    tip: 80000,
    preferredFood: 'Khoai Lắc Phô Mai',
    menuItemId: 'shake_fries'
  },
  {
    id: 'bunny_letter_3',
    trigger: { chapter: 3, atProgress: 0.25 },
    title: 'Mảnh Giấy Số 3: Hộp Gà Nóng Cho Bé Bắp & Chị Mai',
    relatedCharacters: ['Chị Mai Văn Phòng', 'Bé Bắp', 'Anh Tuấn Shipper'],
    noteContent: `
      "Sài Gòn vào mùa mưa rồi...
      Bé Bắp chiều nay lại ngồi đợi mẹ ngoài phòng bảo vệ đến tận 8 giờ tối, bụng đói meo mà hai mắt cứ díp lại. May mà anh Tuấn shipper vừa ghé qua mua hộp gà nóng hổi đem qua cho bé.
      Con bé vừa ăn vừa khen: 'Gà của chú ngon nhất trần đời!'. Nụ cười của đứa trẻ vùng hẻm nhỏ thật sự làm sáng cả buổi tối lạnh lẽo."
    `,
    storyImpact: 'Bé Bắp chính thức coi tiệm là ngôi nhà thứ hai sau giờ tan học. Anh Tuấn shipper ưu tiên nhận đơn cho tiệm nhanh gấp đôi.',
    rewardText: '+120.000đ tiền tip & Tăng +0.3 sao Tốc Độ giao hàng',
    tip: 120000,
    boost: { criteria: ['speed'], value: 0.3 },
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_4',
    trigger: { chapter: 3, atProgress: 0.75 },
    title: 'Mảnh Giấy Số 4: Nỗi Lòng Giấu Kín Của Chị Lan',
    relatedCharacters: ['Chị Lan Karen', 'Quỳnh Anh Tiktoker'],
    noteContent: `
      "Mọi người trong xóm hay trách chị Lan khó tính và hay quát nạt. Nhưng bạn chủ tiệm có biết không?
      Mẹ chị Lan tuần này vừa phải nhập viện chạy thận, chị ấy vừa gánh nợ vừa chăm mẹ già nên tâm trạng mới gắt gỏng như vậy. Chiều qua chị ấy lén mua một phần cánh gà về cho mẹ tẩm bổ đấy.
      Nếu có dịp chị ấy ghé tiệm, bạn tặng chị ấy một ly trà đào thanh mát nhé, vị ngọt dịu sẽ làm tan đi những mệt mỏi trong lòng chị ấy."
    `,
    storyImpact: 'Chị Lan cảm động trước sự thấu hiểu của tiệm gà, từ khách khó tính trở thành người bảo vệ uy tín số 1 của quán trước tin đồn thất thiệt.',
    rewardText: '+150.000đ tiền tip & Tăng +0.4 sao Phục Vụ & Vệ Sinh',
    tip: 150000,
    boost: { criteria: ['speed', 'hygiene'], value: 0.4 },
    preferredFood: 'Khoai Lắc Phô Mai',
    menuItemId: 'shake_fries'
  },
  {
    id: 'bunny_letter_5',
    trigger: { chapter: 4, atProgress: 0.5 },
    title: 'Mảnh Giấy Số 5: Ngọn Lửa Chân Chính Trước Cơn Bão',
    relatedCharacters: ['Đức Huy Game Thủ', 'Quỳnh Anh Tiktoker', 'Food Reviewer Ẩn Danh'],
    noteContent: `
      "Tập đoàn MegaChicken đang giăng bẫy truyền thông bẩn bôi nhọ tiệm gà của bạn. Mình thấy nhiều người hoang mang lắm...
      Nhưng bạn đừng bỏ cuộc nhé! Bạn Đức Huy thức thâu đêm để truy tìm IP bọn nick ảo, còn chị Quỳnh Anh và bác Food Reviewer bí ẩn đang phục kích từ sáng sớm để quay video chứng minh bạn dùng dầu sạch và gà tươi VietGAP rồi!
      Sự tử tế giống như chiếc áo cam này vậy – tuy giản dị nhưng luôn giữ ấm cho trái tim giữa cơn bão tuyết."
    `,
    storyImpact: 'Cuộc khủng hoảng truyền thông bị đập tan. Tiệm Gà Nhà Tui được minh oan rực rỡ trên khắp các trang mạng xã hội với 5 triệu lượt xem.',
    rewardText: '+250.000đ tiền tip & Tăng +1.0 sao Đánh Giá Toàn Diện',
    tip: 250000,
    boost: { criteria: ['taste', 'speed', 'hygiene', 'space', 'pricing'], value: 1.0 },
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_6',
    trigger: { chapter: 5, atProgress: 0.75 },
    title: 'Mảnh Giấy Số 6: Khải Hoàn Tri Kỷ & Vinh Quang Gà Vàng',
    relatedCharacters: ['Toàn bộ 12 Cư Dân Hẻm 1102'],
    noteContent: `
      "Chúc mừng bạn chủ tiệm!
      Chiếc cúp 'Gà Vàng Quốc Dân' đang tỏa sáng lấp lánh trên bục vinh quang. Nhìn Bác Ba cười rơi nước mắt, nhìn Na và Dũng nắm tay, nhìn Bé Bắp ôm chú gà mascot... mình vui đến mức hai tai cứ rung rinh mãi thôi!
      Cảm ơn bạn vì đã không chỉ chiên gà, mà còn chiên ra cả niềm tin và hơi ấm cho con hẻm nhỏ 1102 này.
      Dù sau này bạn có mở bao nhiêu chi nhánh lớn, góc bàn nhỏ này vẫn luôn là chốn bình yên nhất trần đời!"
    `,
    storyImpact: 'Mở khóa Danh Hiệu Huyền Thoại: "Sứ Giả Gắn Kết Hẻm 1102". Tỷ lệ khách trung thành vĩnh cửu đạt 100%.',
    rewardText: '+500.000đ tiền thưởng tri ân & Danh hiệu Vĩnh Cửu',
    tip: 500000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  }
];

// Danh sách các câu thoại ngẫu nhiên khi Thỏ Cam ghé ăn vào những ngày thường
export const BUNNY_RANDOM_VISIT_NOTES = [
  '🐰 (Bé Thỏ Cam gật gù tít mắt, giơ mẩu giấy ghi: "Hôm nay chảo dầu thơm quá, cho mình một phần giòn tan nhé!")',
  '🐰 (Bé Thỏ Cam rút mẩu giấy: "Hôm nay mình thấy bác Ba đi dạo ngoài ngõ, bác khen tiệm dạo này đông khách mà phục vụ vẫn niềm nở lắm!")',
  '🐰 (Bé Thỏ Cam rung rinh đôi tai: "Chiếc áo cam của mình vừa được giặt thơm tho, ăn gà xong là ngày tràn đầy năng lượng!")',
  '🐰 (Bé Thỏ Cam giơ giấy: "Bé Bắp hôm nay được điểm 10 tập làm văn, đề bài viết về tiệm gà của bạn đấy!")',
  '🐰 (Bé Thỏ Cam mỉm cười hiền từ: "Một ngày bận rộn nhưng ấm áp nhé bạn chủ tiệm tử tế!")'
];

export class MysteryBunnyEngine {
  // Thư sớm nhất đã tới mốc mà chưa nhận; mỗi ngày tối đa 1 thư
  public static getScheduledLetter(state: GameState): BunnyLetter | null {
    return BUNNY_LETTERS.find(l => isTriggered(l.trigger, state) && !state.unlockedBunnyLetters.includes(l.id)) ?? null;
  }

  // Kiểm tra xem hôm nay Thỏ Cam có ghé ngẫu nhiên không (xác suất 35% mỗi ngày sau ngày 3)
  public static shouldSpawnRandomVisit(day: number): boolean {
    if (day < 3) return false;
    // Xuất hiện đều đặn mỗi 3-4 ngày hoặc 30% random
    return (day % 3 === 0) || random() < 0.25;
  }

  // Lấy câu thoại ngẫu nhiên
  public static getRandomGreeting(): string {
    return pick(BUNNY_RANDOM_VISIT_NOTES);
  }
}
