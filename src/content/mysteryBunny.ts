// Nội dung và cốt truyện của Bé Gà Bông (An / Chicky) - Khách hàng tri kỷ & Sứ giả Hẻm 1102
// Bộ kịch bản 18 Mảnh Giấy Nhớ (Gà Bông Memos) với 3 tầng Plot Twist phong cách Itaewon Class x Ratatouille x To the Moon
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
  tip: number; // tiền cộng thẳng vào ví khi giao món cho Bé Gà Bông
  // Cộng vào tiêu chí (không cộng vào overall, vì overall được tính lại từ tiêu chí mỗi ngày)
  boost?: { criteria: readonly Criteria[]; value: number };
  preferredFood: string;       // Tên món ăn bé thích
  menuItemId: BaseMenuItemId;  // ID món ăn
}

export const BUNNY_LETTERS: NonEmpty<BunnyLetter> = [
  // =========================================================================
  // CHƯƠNG 1: KHỞI NGHIỆP XE ĐẨY VỈA HÈ (NGÀY 1 – 15)
  // =========================================================================
  {
    id: 'bunny_letter_1',
    trigger: { chapter: 1, atProgress: 0.25 },
    title: 'Mảnh Giấy Số 1: Khói Dầu Chiều Mưa & Vết Sẹo Cổ Tay',
    relatedCharacters: ['Bác Ba Tổ Trưởng', 'Chủ Tiệm Gà'],
    noteContent: `
      "Chào bạn chủ tiệm!
      Chiều nay mưa gió sụt sùi, mình đứng co ro nép dưới hiên xe đẩy thấy bạn chăm chú chiên từng mẻ gà. Bác Ba đứng đằng xa nhìn bạn hồi lâu rồi gật gù đấy. Bác ấy nhớ những ngày rực rỡ ở Chợ Lớn năm xưa...
      Miếng gà của bạn giòn và ấm lắm. Cố lên nhé, cả con hẻm đang bắt đầu ngửi thấy mùi thơm từ chiếc xe đẩy của bạn rồi!"
    `,
    storyImpact: 'Bác Ba Tổ Trưởng bí mật gửi tặng bạn bí quyết chỉnh lửa chảo gang, giúp gà chín đều vàng giòn không bị sống bên trong.',
    rewardText: '+50.000đ tiền tip & Tăng +0.2 sao Hương Vị vĩnh viễn',
    tip: 50000,
    boost: { criteria: ['taste'], value: 0.2 },
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_2',
    trigger: { chapter: 1, atProgress: 0.50 },
    title: 'Mảnh Giấy Số 2: Chiếc Khăn Len Cam & Mẩu Bánh Gà Nguội',
    relatedCharacters: ['Bé Gà Bông', 'Bà Năm Bán Nước'],
    noteContent: `
      "Bạn đừng cười vì giữa trời Sài Gòn nắng gắt mà mình cứ quàng chiếc khăn len cam rách mép này nhé...
      Đó là hơi ấm duy nhất mẹ để lại cho mình trước khi đi xa. Hồi trước mình sợ mùi gà rán lắm, vì xưởng công nghiệp toàn mùi hóa chất đông lạnh nồng nặc.
      Nhưng mẩu gà chiên tay của bạn có mùi thơm giống hệt nồi bếp của mẹ mình ngày xưa..."
    `,
    storyImpact: 'Bà con hàng xóm cảm nhận được sự tỉ mỉ của tiệm, điểm uy tín Tình Hẻm tăng thêm +0.1 sao.',
    rewardText: '+60.000đ tiền tip & Tăng +0.1 sao Tình Hẻm',
    tip: 60000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_3',
    trigger: { chapter: 1, atProgress: 0.85 },
    title: 'Mảnh Giấy Số 3: Bác Ba Đứng Trầm Ngâm Dưới Đèn Đường',
    relatedCharacters: ['Bác Ba Tổ Trưởng', 'Chú Bảy Chợ Lớn'],
    noteContent: `
      "Tối qua dọn hàng muộn, mình thấy Bác Ba đứng hút thuốc dưới ngọn đèn đường nhìn xe gà của bạn rất lâu.
      Bác ấy thở dài: 'Ước gì hai mươi năm trước con hẻm này cũng có một người trẻ yêu nghề như thế...'.
      Bạn hãy kiên định với chảo dầu sạch nhé. Con hẻm này nghèo tiền bạc nhưng giàu tình nghĩa, bà con sẽ là bức tường thành vững chắc che chở cho bạn!"
    `,
    storyImpact: 'Mở khóa sự tin tưởng tuyệt đối của Bác Ba, tốc độ ra món của xe đẩy tăng thêm 15%.',
    rewardText: '+75.000đ tiền tip & Tăng +0.2 sao Tốc Độ',
    tip: 75000,
    boost: { criteria: ['speed'], value: 0.2 },
    preferredFood: 'Khoai Lắc Phô Mai',
    menuItemId: 'shake_fries'
  },

  // =========================================================================
  // CHƯƠNG 2: CĂN NHÀ SỐ 14 TRONG HẺM (NGÀY 16 – 50)
  // =========================================================================
  {
    id: 'bunny_letter_4',
    trigger: { chapter: 2, atProgress: 0.15 },
    title: 'Mảnh Giấy Số 4: Bức Tranh Dưới Giàn Hoa Giấy',
    relatedCharacters: ['Bé Na', 'Dũng Vẽ Truyện Tranh'],
    noteContent: `
      "Chúc mừng tiệm dọn vào căn nhà số 14 khang trang nghen!
      Hôm nay góc bàn số 2 có hai bạn trẻ dễ thương lắm. Bạn nam tên Dũng hí hoáy vẽ cuốn sổ tay, còn bạn nữ tên Na chia nửa miếng gà. Dũng vẽ tặng mình bức tranh chú gà bông mặc áo khăn cam nè!
      Gia đình Na đang cấm đoán hai bạn gặp nhau, bạn hãy giữ lấy góc bàn ấm áp này cho hai bạn ấy nuôi dưỡng ước mơ nhé."
    `,
    storyImpact: 'Mở khóa góc hẹn hò ấm cúng, lượng khách học sinh sinh viên ghé quán tăng 20%.',
    rewardText: '+80.000đ tiền tip & Tăng +0.4 sao Phục Vụ & Vệ Sinh vĩnh viễn',
    tip: 80000,
    boost: { criteria: ['speed', 'hygiene'], value: 0.4 },
    preferredFood: 'Khoai Lắc Phô Mai',
    menuItemId: 'shake_fries'
  },
  {
    id: 'bunny_letter_5',
    trigger: { chapter: 2, atProgress: 0.40 },
    title: 'Mảnh Giấy Số 5: Hộp Cơm Trưa & Tiếng Thở Dài Chị Mai',
    relatedCharacters: ['Chị Mai Văn Phòng', 'Bé Bắp'],
    noteContent: `
      "Trưa nay Chị Mai lại ngồi góc khuất bấm máy tính cộng sổ chi tiêu. Chị ấy chỉ dám gọi 1 đùi gà ráo dầu ăn tạm để dành tiền đóng học phí cho Bé Bắp.
      Chị ấy thở dài nhiều lắm...
      Thi thoảng nếu tiện tay, bạn tặng chị ấy một ly nước mát ngọt lành nhé. Sự tử tế nho nhỏ giữa trưa hè oi ả có thể cứu rỗi cả một ngày của một người mẹ đơn thân đấy."
    `,
    storyImpact: 'Khách công sở cảm nhận được sự ấm áp tinh tế, tiền tip từ giới văn phòng tăng thêm 15%.',
    rewardText: '+95.000đ tiền tip & Tăng 15% Tip văn phòng',
    tip: 95000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_6',
    trigger: { chapter: 2, atProgress: 0.65 },
    title: 'Mảnh Giấy Số 6: Mảnh Giấy In Chìm Ký Hiệu R&D (Manh Mối Đen)',
    relatedCharacters: ['Bé Gà Bông', 'Bếp Chiên Hẻm 1102'],
    noteContent: `
      "Bạn hãy đọc kỹ mặt sau của mảnh giấy này...
      [TÀI LIỆU R&D MEGACORP - BÁO CÁO HỢP CHẤT SUPERCISP-X: NGUY CƠ HOẠI TỬ NIÊM MẠC DẠ DÀY VÀ GÂY NGHIỆN VỊ GIÁC Ở TRẺ EM - TRẠNG THÁI: TỪ CHỐI DUYỆT].
      Bạn tuyệt đối đừng bao giờ mua bột chiên giá rẻ trôi nổi ngoài chợ nhé. Hãy hứa với mình là luôn dùng bột mì nguyên cám và dầu sạch, dù có đắt hơn một chút..."
    `,
    storyImpact: 'Quán nâng cấp quy trình vệ sinh nghiêm ngặt, sao Vệ Sinh tăng vững chắc +0.3 sao.',
    rewardText: '+110.000đ tiền tip & Tăng +0.3 sao Vệ Sinh',
    tip: 110000,
    boost: { criteria: ['hygiene'], value: 0.3 },
    preferredFood: 'Má Đùi Gà Cay',
    menuItemId: 'spicy_thigh'
  },
  {
    id: 'bunny_letter_7',
    trigger: { chapter: 2, atProgress: 0.90 },
    title: 'Mảnh Giấy Số 7: Những Bước Chân Lạ Đầu Ngõ Hẻm',
    relatedCharacters: ['Chú Tư Bảo Vệ', 'Kẻ Rình Mò Áo Đen'],
    noteContent: `
      "Mấy ngày nay mình để ý thấy có 2 gã đàn ông mặc vest đen đi xe hơi lượn lờ đầu hẻm, cầm máy ảnh quay lén căn nhà số 14 và chụp lại biển hiệu tiệm gà.
      Hình như... họ đang tìm kiếm một thứ gì đó. Hoặc tìm kiếm một ai đó...
      Bạn và Chú Tư nhớ khóa cửa nẹp cẩn thận mỗi khi dọn hàng ban đêm nghen."
    `,
    storyImpact: 'Chú Tư bảo vệ đề cao cảnh giác, giảm 50% nguy cơ kẻ gian phá hoại tiệm.',
    rewardText: '+125.000đ tiền tip & Tăng 15% kiên nhẫn khách hàng',
    tip: 125000,
    preferredFood: 'Má Đùi Gà Cay',
    menuItemId: 'spicy_thigh'
  },

  // =========================================================================
  // CHƯƠNG 3: MẶT PHỐ LỚN & ĐÒN TRỪNG PHẠT (NGÀY 51 – 105)
  // =========================================================================
  {
    id: 'bunny_letter_8',
    trigger: { chapter: 3, atProgress: 0.15 },
    title: 'Mảnh Giấy Số 8: Bóng Cây Xà Cừ & Tiếng Còi Xe Ngã Tư',
    relatedCharacters: ['Chủ Tiệm Gà', 'Tập Đoàn MegaChicken'],
    noteContent: `
      "Tiệm gà đã ra mặt tiền đường lớn rồi, sáng rực cả một góc phố!
      Nhưng nhìn sang bên kia ngã tư... tòa nhà 3 tầng màu đỏ của MegaChicken đang nhìn chằm chằm vào tiệm bạn đấy.
      Đứng dưới bóng cây xà cừ, nhìn logo con gà màu đỏ của họ, tim mình lại đập thình thịch trong sợ hãi. Họ là con quái vật không từ thủ đoạn nào đâu..."
    `,
    storyImpact: 'Tiệm mở rộng liên kết app shipper hỏa tốc, tăng thêm +1 đơn hàng shipper online đồng thời.',
    rewardText: '+140.000đ tiền tip & Tăng công suất giao hàng online',
    tip: 140000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_9',
    trigger: { chapter: 3, atProgress: 0.40 },
    title: 'Mảnh Giấy Số 9: Hộp Cánh Gà Nóng Cho Mẹ Già Chị Lan',
    relatedCharacters: ['Chị Lan Karen', 'Bác Sĩ Bệnh Viện'],
    noteContent: `
      "Mọi người hay trách Chị Lan đanh đá gắt gỏng. Nhưng chiều nay mẹ chị ấy vừa phải lọc máu đợt thứ 8.
      Mẩu gà giòn bạn chiên mềm đặc biệt để gửi tặng mẹ chị ấy... bà cụ ăn ngon lành rồi cười móm mém: 'Lâu lắm rồi mới được ăn miếng gà thơm như ngày xưa'.
      Chị Lan quay mặt ra hành lang lau nước mắt đấy. Người Sài Gòn miệng la lối vậy thôi chứ ruột để ngoài da, thương lắm!"
    `,
    storyImpact: 'Chị Lan trở thành người bảo vệ uy tín số 1 của quán, hóa giải mọi sự cố khiếu nại của khách.',
    rewardText: '+160.000đ tiền tip & Tăng +0.3 sao Phục Vụ',
    tip: 160000,
    boost: { criteria: ['speed'], value: 0.3 },
    preferredFood: 'Củ Cải Muối Chua Ngọt',
    menuItemId: 'danmuji'
  },
  {
    id: 'bunny_letter_10',
    trigger: { chapter: 3, atProgress: 0.65 },
    title: 'Mảnh Giấy Số 10: Đêm Vỡ Cửa Kính & Nước Mắt Sau Lớp Vải',
    relatedCharacters: ['Bé Gà Bông', 'Bác Ba Tổ Trưởng'],
    noteContent: `
      "Sau khi bạn từ chối bán lại tiệm với giá 2 tỷ cho tay sai của MegaChicken... đêm qua họ đã cho người ném đá vỡ toang cửa kính tiệm gà.
      Mình đã thức trắng đêm nhặt từng mảnh vỡ...
      Mình xin lỗi, ngàn lần xin lỗi bạn! Là tại mình... nếu mình không trốn về con hẻm này thì tiệm gà đã không bị bọn chúng nhắm tới..."
    `,
    storyImpact: 'Cả con Hẻm 1102 chung tay quyên góp và canh gác thâu đêm, tinh thần đoàn kết lên đỉnh điểm.',
    rewardText: '+180.000đ tiền tip & Toàn hẻm cam kết bảo vệ quán',
    tip: 180000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_11',
    trigger: { chapter: 3, atProgress: 0.90 },
    title: 'Mảnh Giấy Số 11: 💥 Lời Thú Tội Của Kẻ Đào Tẩu An (PLOT TWIST 1)',
    relatedCharacters: ['Nguyễn Hoàng An', 'Chủ Tịch MegaChicken'],
    noteContent: `
      "Đến lúc mình phải nói ra tất cả rồi...
      Mình tên thật là Nguyễn Hoàng An. Mình từng là Thần đồng Hóa thực phẩm, cựu Trưởng phòng Nghiên cứu R&D của MegaChicken.
      Khi phát hiện họ pha chế hợp chất gây nghiện độc hại để hủy hoại vị giác trẻ em và thôn tính các quán ăn truyền thống, mình đã từ chối ký duyệt và mang tài liệu trốn chạy. Họ tước đoạt toàn bộ bằng cấp, truy sát sự nghiệp của mình.
      150.000đ và cuốn sổ tay Ngày 1 Bác Ba trao cho bạn... thực ra là đồng tiền cuối cùng mình gửi gắm nhờ Bác Ba tìm một người có tâm kế thừa.
      Mình trốn trong bộ đồ Gà Bông này, chỉ để nhìn xem giữa Sài Gòn nghiệt ngã này, liệu lương tâm của người làm bếp có còn tồn tại hay không..."
    `,
    storyImpact: 'Mở ra sự thật chấn động, kích hoạt liên minh chính nghĩa giữa Tiệm Gà Nhà Tui và An.',
    rewardText: '+220.000đ tiền tip & Buff +0.5 sao Toàn Diện vĩnh viễn',
    tip: 220000,
    boost: { criteria: ['taste', 'speed', 'hygiene', 'space', 'pricing'], value: 0.5 },
    preferredFood: 'Gà Sốt Yangnyeom Cay',
    menuItemId: 'spicy_chicken'
  },

  // =========================================================================
  // CHƯƠNG 4: CUỘC CHIẾN MEGACHICKEN & NỖI ĐAU GIA TỘC (NGÀY 106 – 175)
  // =========================================================================
  {
    id: 'bunny_letter_12',
    trigger: { chapter: 4, atProgress: 0.15 },
    title: 'Mảnh Giấy Số 12: Cơn Bão Review Bẩn & Tình Nghĩa Hẻm 1102',
    relatedCharacters: ['Quỳnh Anh Tiktoker', 'Đức Huy Game Thủ', 'Kính Tròn Reviewer'],
    noteContent: `
      "MegaChicken tung chiêu bài bẩn thỉu nhất: chi 500 triệu thuê nick ảo đánh sập Google Maps và Threads của tiệm, tung clip cắt ghép vu khống bạn dùng dầu phế thải!
      Nhưng bạn nhìn xem:
      Đức Huy thức trắng đêm truy vết địa chỉ IP trại bot ảo; Quỳnh Anh livestream đột xuất kiểm tra kho lạnh đạt chuẩn VietGAP; Bác Kính Tròn lên bài phân tích chất lượng dầu đạt 5 sao quốc tế!
      Tình nghĩa của con hẻm này mạnh hơn triệu đô của họ!"
    `,
    storyImpact: 'Chiến dịch bẩn bị bẻ gãy, tiệm được miễn nhiễm 100% review tiêu cực trong 7 ngày.',
    rewardText: '+250.000đ tiền tip & Miễn nhiễm review bẩn',
    tip: 250000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_13',
    trigger: { chapter: 4, atProgress: 0.40 },
    title: 'Mảnh Giấy Số 13: Hành Lang Bệnh Viện & Bàn Tay Gầy Của Bác Ba',
    relatedCharacters: ['Bác Ba Tổ Trưởng', 'Bé Gà Bông An'],
    noteContent: `
      "Bác Ba uất ức vì tiệm bị cơ quan thanh tra đến niêm phong tạm thời, bác lên cơn đau tim ngất xỉu giữa sân...
      Hành lang bệnh viện lạnh buốt. Mình đứng dưới mưa nhìn qua cửa kính phòng cấp cứu mà hai chân khuỵu xuống.
      Bác Ba nắm lấy tay mình thều thào: 'Con ráng giữ lấy cuốn sổ của mẹ... Đừng để lão Phát cướp mất linh hồn con hẻm này...'."
    `,
    storyImpact: 'Đội ngũ nhân viên đồng lòng tình nguyện giảm 30% lương để cùng tiệm vượt qua giai đoạn ngặt nghèo.',
    rewardText: '+280.000đ tiền tip & Giảm 30% lương nhân viên',
    tip: 280000,
    preferredFood: 'Khoai Lắc Phô Mai',
    menuItemId: 'shake_fries'
  },
  {
    id: 'bunny_letter_14',
    trigger: { chapter: 4, atProgress: 0.65 },
    title: 'Mảnh Giấy Số 14: 💥 Tro Tàn Xưởng Bếp Năm Mười Tuổi (PLOT TWIST 2)',
    relatedCharacters: ['Đỗ Trọng Phát (Chủ Tịch MegaChicken)', 'Mẹ Của An'],
    noteContent: `
      "Bạn có biết tại sao Bác Ba lại nhắc đến 'lão Phát' không?
      Đỗ Trọng Phát — Chủ tịch tập đoàn MegaChicken lẫy lừng kia... chính là CHA RUỘT CỦA MÌNH!
      Hai mươi năm trước, mẹ mình là truyền nhân bếp gà Chợ Lớn. Phát cưới mẹ chỉ để ăn cắp cuốn sổ bí kíp rồi bỏ trốn cùng đồng vốn. Đêm mẹ uất ức qua đời, xưởng bếp bị phóng hỏa thiêu rụi.
      Cô bé An 10 tuổi là mình đã lao vào biển lửa cứu lấy chiếc khăn len cam của mẹ và cuốn sổ tay, để lại vết sẹo bỏng vĩnh viễn ở cổ tay này...
      Ông ta không coi mình là con, mà biến mình thành cỗ máy thí nghiệm rồi ruồng bỏ khi mình không chịu hại người!"
    `,
    storyImpact: 'Mở khóa công thức Sốt Cổ Truyền Di Sản gia truyền, giá bán món tăng thêm 25%.',
    rewardText: '+320.000đ tiền tip & Mở khóa Sốt Di Sản',
    tip: 320000,
    boost: { criteria: ['taste'], value: 0.4 },
    preferredFood: 'Gà Sốt Mật Ong Bơ Tỏi',
    menuItemId: 'honey_garlic_chicken'
  },
  {
    id: 'bunny_letter_15',
    trigger: { chapter: 4, atProgress: 0.90 },
    title: 'Mảnh Giấy Số 15: Chiếc USB Màu Cam Trong Ngăn Kéo Cũ',
    relatedCharacters: ['Bé Gà Bông An', 'Cơ Quan Báo Chí'],
    noteContent: `
      "Mình đã hoàn tất bản sao lưu toàn bộ dữ liệu nội bộ, kết quả xét nghiệm chất gây ung thư và cả băng ghi âm chỉ đạo của Đỗ Trọng Phát vào chiếc USB màu cam này.
      Mình sẽ không trốn chui trốn nhủi sau chiếc đầu bông này nữa.
      Vòng chung kết Cúp Gà Vàng sắp tới phát sóng trực tiếp cả nước... đó sẽ là nơi mình đưa mọi tội ác ra ánh sáng!"
    `,
    storyImpact: 'Toàn bộ tiệm đạt trạng thái Tự Tin Đỉnh Cao, tốc độ chiên gà tăng 50%.',
    rewardText: '+380.000đ tiền tip & Tăng 50% tốc độ bếp',
    tip: 380000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },

  // =========================================================================
  // CHƯƠNG 5: CÚP GÀ VÀNG & KHẢI HOÀN DI SẢN (NGÀY 176 – 210+)
  // =========================================================================
  {
    id: 'bunny_letter_16',
    trigger: { chapter: 5, atProgress: 0.25 },
    title: 'Mảnh Giấy Số 16: Đêm Trước Trận Đấu Lớn Nhất Cuộc Đời',
    relatedCharacters: ['Chủ Tiệm Gà', 'An Gà Bông'],
    noteContent: `
      "Chỉ còn 24 giờ nữa là đêm chung kết tại Nhà Thi Đấu Phú Thọ diễn ra...
      Ngồi bên cạnh bạn và chiếc chảo gang cũ kỹ này, ngửi mùi dầu sôi trong vắt, mình thấy lòng bình yên đến lạ.
      Dù ngày mai đối thủ có dùng dàn máy triệu đô hay mua chuộc ban giám khảo, chúng ta hãy cứ chiên mẻ gà bằng tất cả tình thương của Hẻm 1102.
      Hương vị chân chính sẽ chạm tới trái tim của mọi người!"
    `,
    storyImpact: 'Nhận Buff Vàng Chuẩn Bị Hoàn Mỹ: Toàn bộ mẻ chiên đầu tiên trong ca thi đấu tự động đạt PERFECT.',
    rewardText: '+450.000đ tiền tip & Buff Chuẩn Bị Hoàn Mỹ',
    tip: 450000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_17',
    trigger: { chapter: 5, atProgress: 0.75 },
    title: 'Mảnh Giấy Số 17: 💥 Chiếc Đầu Mascot Rơi Xuống Sân Khấu (PLOT TWIST 3)',
    relatedCharacters: ['Nguyễn Hoàng An', 'Toàn Bộ Khán Giả Sài Gòn'],
    noteContent: `
      "Khoảnh khắc chiếc đầu mascot rơi xuống sàn gỗ trước hàng chục máy quay truyền hình... mình đã run rẩy biết bao.
      Nhưng khi nhìn thấy ánh mắt kiên định của bạn, nhìn thấy bà con Hẻm 1102 giơ cao băng rôn cổ vũ, mình đã dõng dạc nói ra tất cả tội ác của cha mình.
      Chiếc USB cắm lên màn hình LED khổng lồ... sự thật đã chiến thắng!
      MegaChicken sụp đổ. Chiếc Cúp Gà Vàng đang nằm trong tay bạn — người đã mang lại ánh sáng cho cuộc đời mình!"
    `,
    storyImpact: 'Mở khóa Danh Hiệu Huyền Thoại: "Đệ Nhất Gà Rán Sài Thành", tỷ lệ khách hàng trung thành vĩnh cửu đạt 100%.',
    rewardText: '+600.000đ tiền thưởng vinh quang & Danh hiệu Huyền Thoại',
    tip: 600000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  },
  {
    id: 'bunny_letter_18',
    trigger: { chapter: 5, atProgress: 1.00 },
    title: 'Mảnh Giấy Số 18: 🌟 Bức Thư Không Còn Đeo Mặt Nạ (EPILOGUE - AN BẾP TRƯỞNG)',
    relatedCharacters: ['An', 'Bác Ba', '12 Cư Dân Hẻm 1102', 'Bạn'],
    noteContent: `
      "Gửi người bạn tri kỷ của An!
      Hôm nay Sài Gòn lại đón một cơn mưa rào chiều, nhưng mình không còn phải chui vào bộ đồ mascot ngột ngạt để trốn chạy quá khứ nữa.
      Bác Ba đã khỏe hẳn, đang cười rôm rả thưởng trà ngoài hiên; Na và Dũng vừa nhận giấy báo đậu thủ khoa trường nghệ thuật; Bé Bắp vừa ăn gà giòn vừa khoe điểm 10 tập làm văn...
      Cảm ơn bạn vì đã chứng minh cho cả thế giới thấy: Nấu ăn bằng cái tâm chân thật sẽ luôn chiến thắng lòng tham tàn bạo.
      Từ ngày mai, cho An xin một chân phụ bếp chính thức tại Tiệm Gà Nhà Tui nghen bạn!"
    `,
    storyImpact: 'Mở khóa Nhân Viên SSR Huyền Thoại: "Bếp Trưởng An (Chicky)" và Danh Hiệu Vĩnh Cửu: "Sứ Giả Gắn Kết Hẻm 1102"!',
    rewardText: '+1.000.000đ Quỹ Tri Ân & Mở khóa Bếp Trưởng An (SSR)',
    tip: 1000000,
    preferredFood: 'Gà Giòn Nhà Tui',
    menuItemId: 'crispy_chicken'
  }
];

// Danh sách các câu thoại ngẫu nhiên khi Bé Gà Bông ghé ăn vào những ngày thường
export const BUNNY_RANDOM_VISIT_NOTES = [
  '🍗 (Bé Gà Bông vỗ vỗ đôi cánh tròn xoe mừng rỡ, giơ mẩu giấy: "Hôm nay chảo dầu thơm phức, cho mình một phần giòn tan nhé!")',
  '🍗 (Bé Gà Bông khẽ nghiêng chiếc đầu mỏ tròn, giơ giấy: "Bác Ba ngoài đầu ngõ cứ khen tiệm dạo này đông khách mà phục vụ chu đáo lắm!")',
  '🍗 (Bé Gà Bông vuốt lại chiếc khăn len cam: "Chiếc khăn len cam của mình vừa được giặt thơm phức, ăn miếng gà giòn là ấm bụng cả ngày!")',
  '🍗 (Bé Gà Bông giơ giấy note nắn nót: "Bé Bắp hôm nay được điểm 10 văn, đề bài tả về tiệm gà của bạn đấy!")',
  '🍗 (Bé Gà Bông chớp đôi mắt tròn xoe sau lớp lưới vải: "Một ngày bận rộn nhưng ấm áp nhé bạn chủ tiệm tử tế!")'
];

export class MysteryBunnyEngine {
  // Thư sớm nhất đã tới mốc mà chưa nhận; mỗi ngày tối đa 1 thư
  public static getScheduledLetter(state: GameState): BunnyLetter | null {
    return BUNNY_LETTERS.find(l => isTriggered(l.trigger, state) && !state.unlockedBunnyLetters.includes(l.id)) ?? null;
  }

  // Kiểm tra xem hôm nay Bé Gà Bông có ghé ngẫu nhiên không (xác suất 35% mỗi ngày sau ngày 3)
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
