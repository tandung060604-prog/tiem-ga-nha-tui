import { NonEmpty, GameState } from '../types/game';
import { applyKarmaChange, evaluateEnding } from './endings';
import { chapterProgress } from '../core/progression';

export interface DialogueOption {
  id: string;
  label: string;
  kicker: string;
  karmaEffect: {
    community?: number;
    craftsmanship?: number;
    ambition?: number;
  };
  reactionNarrative: string;
}

export interface StoryEpisode {
  act: number;
  chapterRequirement: number;
  title: string;
  subtitle: string;
  characters: string[];
  excerpt: string;
  fullStory: string;
  dilemmaPrompt?: string;
  options?: DialogueOption[];
}

export const STORY_ACTS: NonEmpty<StoryEpisode> = [
  {
    act: 1,
    chapterRequirement: 1,
    title: 'Hồi 1: Hơi Ấm Khói Dầu Đầu Ngõ',
    subtitle: 'Ngày đầu lập nghiệp bên chiếc xe đẩy cũ và người dẫn đường thầm lặng',
    characters: ['Chủ Tiệm Gà', 'Bác Ba Tổ Trưởng', 'Nhóm Học Sinh Bàn Cuối'],
    excerpt: 'Tiếng xèo xèo đầu tiên vang lên giữa chiều mưa lất phất, khi túi tiền chỉ còn lại vài trăm ngàn...',
    fullStory: `
Buổi chiều tháng Chín ở Sài Gòn, mây xám giăng kín bầu trời con hẻm 1102. Tiếng còi xe ngoài đại lộ vọng vào như tiếng thở dài của một đô thị không bao giờ ngủ. 

Bên chiếc xe đẩy bằng inox cũ kỹ được hàn chắp vá, nhân vật chính – một người trẻ mang theo giấc mơ lập nghiệp sau những năm tháng bôn ba – đang cẩn thận đổ can dầu đầu tiên vào chiếc chảo gang đáy dày. Số tiền dành dụm cuối cùng chỉ còn vừa vặn 850.000 đồng, vừa đủ mua vài cân gà tươi, bao bột chiên giòn và chiếc bếp gas mini.

"Chiên gà lửa lớn quá, cháy da ngoài mà bên trong còn đỏ máu đó con!" – Một giọng nói trầm khàn vang lên sau lưng.

Đó là Bác Ba Tổ Trưởng. Ở tuổi gần bảy mươi, đôi bàn tay gân guốc của bác từng là "đôi tay vàng" của tiệm gà chiên nức tiếng Chợ Lớn những năm 1990 trước khi biến cố gia đình khiến bác lui về gác kiếm. Bác Ba đứng nhìn chảo dầu sủi bọt lăn tăn, ánh mắt sắc sảo nhưng ấm áp:

"Bột chiên giòn không phải để bọc thịt cho dày, mà là lớp áo giáp giữ lấy từng giọt nước ngọt của thớ thịt gà. Dầu chưa đủ sôi mà thả vào thì ngấy, dầu quá nhiệt thì đắng ngắt. Nghề bếp cũng như cuộc đời, biết đợi đúng lúc thì mới ra được độ giòn vàng."

Vừa lúc đó, tiếng cười đùa ríu rít xua tan màn mưa ảm đạm. Ba cô cậu học trò trường THPT gần đó, ướt sũng tà áo dài và đồng phục, nép vào mái hiên tiệm gà. Đó là Minh Trí và nhóm bạn bàn cuối lớp 12A1 đang run rẩy vì lạnh sau giờ học phụ đạo:

"Anh/chị ơi, tụi em chỉ còn có ba chục ngàn gom chung, có món gì ăn cho ấm bụng không ạ?"
    `,
    dilemmaPrompt: 'Khi Bác Ba nhắc nhở về kỹ thuật lửa và ba cô cậu học trò chỉ gom được 30.000đ trong túi, bạn quyết định thế nào?',
    options: [
      {
        id: 'act1_opt_community',
        label: 'Tặng thêm 2 miếng gà & khoai lắc nóng hổi, mời các em ăn no lấy sức',
        kicker: '❤️ NGHĨA TÌNH HẺM SÂU',
        karmaEffect: { community: 15, craftsmanship: 5, ambition: -5 },
        reactionNarrative: 'Bác Ba gật đầu cười hiền: "Người biết đãi kẻ đói tấm bánh ấm thì lộc trời chẳng bao giờ cạn đâu con." Lũ trẻ mừng rỡ, vừa ăn vừa khen nức nở.'
      },
      {
        id: 'act1_opt_craft',
        label: 'Tỉ mỉ canh lửa chuẩn xác, dạy lũ trẻ cách nghe tiếng dầu reo để nhận biết gà giòn',
        kicker: '🔥 BẢN SẮC NGHỆ NHÂN',
        karmaEffect: { craftsmanship: 15, community: 5 },
        reactionNarrative: 'Mùi thơm ngào ngạt lan tỏa khắp đầu hẻm, miếng gà chiên vàng óng như mật ong khiến ai đi ngang qua cũng phải ngoái nhìn trầm trồ.'
      },
      {
        id: 'act1_opt_ambition',
        label: 'Bán đúng định lượng 30k, dặn các em rủ thêm bạn bè để tiệm tích lũy vốn mở rộng',
        kicker: '💼 TỐI ƯU TÀI CHÍNH',
        karmaEffect: { ambition: 15, community: -5 },
        reactionNarrative: 'Tiền vốn được giữ chặt chẽ, cuốn sổ tay ghi chép chi phí bắt đầu dày thêm những con số mục tiêu lớn.'
      }
    ]
  },
  {
    act: 2,
    chapterRequirement: 2,
    title: 'Hồi 2: Tiếng Cười Trong Con Hẻm Sâu',
    subtitle: 'Mối tình đầu bên đĩa gà sốt bơ tỏi và chiếc rào chắn gia đình',
    characters: ['Bé Na & Dũng', 'Anh Long Trưởng Phòng', 'Chủ Tiệm Gà'],
    excerpt: 'Hai chiếc ghế gỗ nhỏ nơi góc quán đã chứng kiến lời hẹn ước tuổi mười tám...',
    fullStory: `
Gom đủ tiền lời sau chuỗi ngày vỉa hè miệt mài, Tiệm Gà Nhà Tui dọn vào căn nhà số 14 sâu trong hẻm. Bốn bộ bàn ghế gỗ mộc mạc được kê thẳng thớm dưới tán cây hoa giấy rực hồng.

Cứ đúng 5 giờ chiều mỗi thứ Sáu, bàn số 2 lại có hai vị khách quen: Bé Na và Dũng. Na là cô nữ sinh trường múa với nụ cười má lúm đồng tiền, còn Dũng là chàng thiếu niên xốc nổi đam mê vẽ truyện tranh nhưng gia cảnh khó khăn. Cả hai đều mê mẩn món "Gà Mật Ong Bơ Tỏi" – vị ngọt thanh của mật ong rừng quyện với mùi bơ tỏi thơm lừng khiến đầu lưỡi tê mê.

"Sau này anh thành họa sĩ có tiếng, anh sẽ bao em ăn gà sốt bơ tỏi cả đời!" – Dũng vừa chia nửa miếng gà cho Na vừa quả quyết.

Nhưng cuộc sống chưa bao giờ đơn giản như một lời hứa hẹn. Một chiều nọ, cánh cửa tiệm bị đẩy mạnh. Anh Long – người anh trai nghiêm khắc và là Trưởng phòng kinh doanh của một tập đoàn lớn – bước vào với vẻ mặt đằng đằng sát khí. Nhìn thấy em gái mình ngồi cùng cậu bạn trai nghèo khó, Long lập tức quát lớn:

"Na! Năm nay thi tốt nghiệp mà em ngồi đây ăn gà rán hẹn hò vớ vẩn với đứa không có tương lai à? Đi về nhà ngay!"
    `,
    dilemmaPrompt: 'Khi Anh Long lớn tiếng mắng em gái Na và bạn trai nghèo Dũng, bạn hành động ra sao?',
    options: [
      {
        id: 'act2_opt_community',
        label: 'Mời anh Long đĩa gà bơ tỏi, ôn tồn nhắc lại ký ức nghèo khó nhưng ấm êm của hai anh em ngày xưa',
        kicker: '❤️ HÀN GẮN TÌNH THÂN',
        karmaEffect: { community: 15, craftsmanship: 5 },
        reactionNarrative: 'Anh Long sững người, khóe mắt cay cay rồi dịu giọng. Bữa ăn trở thành cầu nối hàn gắn tình thân gia đình.'
      },
      {
        id: 'act2_opt_craft',
        label: 'Tự tay chiên một mẻ gà bơ tỏi đỉnh cao nhất, chứng minh sự tận tâm và kiên trì có thể tạo ra kỳ tích',
        kicker: '🔥 ĐẲNG CẤP LỬA NGHỀ',
        karmaEffect: { craftsmanship: 15, ambition: 5 },
        reactionNarrative: 'Vị giòn tan và hương thơm béo ngậy khiến cả bàn im lặng thưởng thức. Nghệ thuật ẩm thực đã thuyết phục người khó tính nhất.'
      },
      {
        id: 'act2_opt_ambition',
        label: 'Khuyên Dũng nhận vẽ poster menu cho quán để có thu nhập chính đáng trang trải học phí',
        kicker: '💼 KẾT NỐI CƠ HỘI',
        karmaEffect: { ambition: 15, community: 10 },
        reactionNarrative: 'Dũng sáng mắt đồng ý ngay. Quán có thêm biển hiệu vẽ tay ấn tượng, thu hút đông đảo khách trẻ ghé check-in.'
      }
    ]
  },
  {
    act: 3,
    chapterRequirement: 3,
    title: 'Hồi 3: Ánh Đèn Mặt Tiền & Đứa Trẻ Không Đơn Độc',
    subtitle: 'Nỗi lòng người mẹ đơn thân và cuốc xe nghĩa tình của chàng shipper',
    characters: ['Chị Mai Văn Phòng', 'Bé Bắp', 'Anh Tuấn Shipper Ruột'],
    excerpt: 'Mỗi suất gà gửi đi lúc 9 giờ tối mang theo cả tấm lòng của những phận đời tha hương...',
    fullStory: `
Bước sang chương thứ 3, Tiệm Gà Nhà Tui chính thức khai trương chi nhánh mặt tiền đường lớn với 12 bàn ăn, đèn neon sáng trưng và chiếc máy in đơn app nổ "ting ting" liên tục. Nhưng dù tiệm có hiện đại đến đâu, tình người trong con hẻm cũ vẫn nguyên vẹn.

Chị Mai là một nhân viên kế toán, đồng thời là một người mẹ đơn thân. Vì áp lực nuôi con nhỏ và tiền thuê nhà, chị thường xuyên phải nhận tăng ca đến tận 9-10 giờ đêm tại tòa nhà văn phòng đối diện. Đứa con gái nhỏ – Bé Bắp, mới học lớp hai, tan trường lúc 5 giờ chiều chỉ biết lủi thủi ngồi ở phòng bảo vệ chờ mẹ.

Thấy hoàn cảnh éo le của hai mẹ con, Anh Tuấn Shipper – người chuyên nhận đơn giao gà cho tiệm – đã chủ động đề nghị với chủ quán:

"Chị Mai bận quá, để chiều nào em chạy đơn xong tiện đường qua trường đón Bé Bắp về tiệm gà của mình ngồi chờ mẹ. Quán mình sáng sủa, vừa có đồ ăn vừa có nhiều người, con bé đỡ sợ."
    `,
    dilemmaPrompt: 'Khi thấy Chị Mai vất vả tăng ca đêm và Bé Bắp lủi thủi chờ mẹ, bạn sẽ hỗ trợ ra sao?',
    options: [
      {
        id: 'act3_opt_community',
        label: 'Dành riêng chiếc bàn số 1 làm góc học tập cho Bé Bắp, tặng suất gà bơ mật mỗi tối',
        kicker: '❤️ MÁI ẤM CHE CHỞ',
        karmaEffect: { community: 20, ambition: -5 },
        reactionNarrative: 'Tiệm gà trở thành ngôi nhà thứ hai đầy ắp tiếng cười trẻ thơ và tình cảm xóm giềng nồng hậu.'
      },
      {
        id: 'act3_opt_craft',
        label: 'Nghiên cứu công thức gà tẩm nước dừa thanh đạm, bổ sung vitamin cho trẻ em',
        kicker: '🔥 DINH DƯỠNG LÀNH TÂM',
        karmaEffect: { craftsmanship: 15, community: 5 },
        reactionNarrative: 'Món mới được phụ huynh trong khu phố truyền tai nhau, tạo nên danh tiếng món gà rán lành tính cho sức khỏe.'
      },
      {
        id: 'act3_opt_ambition',
        label: 'Hợp tác với Tuấn Shipper mở rộng đội giao hàng đêm cho các tòa văn phòng tăng ca',
        kicker: '💼 ĐỘT PHÁ DOANH THU',
        karmaEffect: { ambition: 20, community: 5 },
        reactionNarrative: 'Doanh số ca tối bùng nổ, máy in đơn app kêu ting ting liên tục đến tận 22h đêm.'
      }
    ]
  },
  {
    act: 4,
    chapterRequirement: 4,
    title: 'Hồi 4: Cơn Sóng Ngầm MegaChicken & Lửa Thử Vàng',
    subtitle: 'Cuộc chiến giữa chuỗi tập đoàn tỷ đô và sự công tâm của người tiêu dùng',
    characters: ['Chị Lan Karen', 'Quỳnh Anh Tiktoker', 'Food Reviewer Bí Ẩn', 'Đức Huy Game Thủ'],
    excerpt: 'Khi truyền thông bẩn bủa vây, sự thật chính là ngọn lửa vàng không sợ thử thách...',
    fullStory: `
Khi Tiệm Gà Nhà Tui trở thành hiện tượng ẩm thực quận, sóng gió thực sự bắt đầu ập tới. Tập đoàn đồ ăn nhanh đa quốc gia "MegaChicken" mở một chi nhánh hoành tráng ba tầng ngay đối diện, chi hàng trăm triệu đồng chạy quảng cáo và tung ra chương trình gà rán giảm giá 50%.

Chưa dừng lại ở đó, đối thủ thuê một đội ngũ truyền thông ngầm tung tin đồn thất thiệt rằng tiệm dùng "dầu chiên đen như hắc ín" và "thịt gà đông lạnh thải loại". Chị Lan (người vẫn thường bị gán biệt danh "khách Karen khó tính") đã nổi giận đùng đùng đến quán, quay video livestream yêu cầu chủ tiệm giải thích vì tin lời đồn trên mạng:

"Tôi ăn ở đây bao lâu nay, nếu các người thực sự dùng dầu bẩn hại sức khỏe thì tôi sẽ kiện tiệm sập tiệm!"
    `,
    dilemmaPrompt: 'Khi MegaChicken dùng truyền thông bẩn bôi nhọ tiệm dùng dầu đen và thịt thải loại, bạn phản đòn thế nào?',
    options: [
      {
        id: 'act4_opt_community',
        label: 'Mở toang cửa bếp mời bà con hẻm, chị Lan và reviewer cùng vào kiểm chứng nguồn dầu sạch',
        kicker: '❤️ MINH BẠCH LÒNG TIN',
        karmaEffect: { community: 15, craftsmanship: 15 },
        reactionNarrative: 'Video trực tiếp bếp sạch 4h sáng đạt 5 triệu view, người dân Hẻm 1102 đồng loạt lên tiếng bảo vệ tiệm gà chân chính.'
      },
      {
        id: 'act4_opt_ambition',
        label: 'Cùng Đức Huy lần theo IP đối thủ, tổ chức họp báo truyền thông vạch trần chiêu trò MegaChicken',
        kicker: '💼 ĐẤU PHÁP BẢN LĨNH',
        karmaEffect: { ambition: 20, craftsmanship: 5 },
        reactionNarrative: 'MegaChicken bị dư luận lên án dữ dội, thương hiệu Tiệm Gà Nhà Tui bước lên trang nhất các báo lớn.'
      },
      {
        id: 'act4_opt_corporate',
        label: 'Ngồi xuống nghe MegaChicken ra giá: một khoản tiền lớn để đổi lấy bí quyết của tiệm',
        kicker: '💔 THƯƠNG MẠI HÓA',
        karmaEffect: { ambition: 30, community: -25, craftsmanship: -20 },
        reactionNarrative: 'Bác Ba nhìn bạn thở dài thất vọng. Hương vị quán bắt đầu vương mùi toan tính đồng tiền lạnh lẽo.'
      }
    ]
  },
  {
    act: 5,
    chapterRequirement: 5,
    title: 'Hồi 5: Khải Hoàn "Gà Vàng Quốc Dân"',
    subtitle: 'Năm chi nhánh rực rỡ và chiếc thìa vàng truyền thống trao tay',
    characters: ['Tất cả 12 Nhân Vật Chính'],
    excerpt: 'Hành trình từ chiếc xe đẩy 850 ngàn đồng đến chiếc cúp danh dự ẩm thực đất nước...',
    fullStory: `
Đại sảnh Trung tâm Hội nghị Quốc gia rực rỡ ánh đèn. Đêm trao giải thưởng ẩm thực thường niên "Gà Vàng Quốc Dân" diễn ra trong sự hồi hộp của hàng ngàn chuyên gia và thực khách.

Từ một chiếc xe đẩy vỉa hè gom từng đồng bạc lẻ, Tiệm Gà Nhà Tui giờ đây đã là một hệ thống 5 chi nhánh khang trang, một bếp trung tâm điều phối nguyên liệu sạch chuẩn VietGAP, tạo công ăn việc làm ổn định cho hơn 30 nhân viên với mức lương đàng hoàng.

Khi cái tên "TIỆM GÀ NHÀ TUI" được xướng lên ở hạng mục danh giá nhất, cả hội trường như vỡ òa.
    `,
    dilemmaPrompt: 'Đứng trước sân khấu giải Gà Vàng Quốc Dân, bạn công bố sứ mệnh tương lai của tiệm gà là gì?',
    options: [
      {
        id: 'act5_opt_community',
        label: 'Cùng Mimi và Bác Ba giơ cao chiếc vá gỗ gia truyền, giữ vững tiệm gà như một mái ấm tri kỷ',
        kicker: '👑 DI SẢN TRI KỶ',
        karmaEffect: { community: 20, craftsmanship: 20 },
        reactionNarrative: 'Cả hội trường đứng dậy vỗ tay vang dội. Bạn đã chứng minh tình người và hương vị nguyên bản là vô giá!'
      },
      {
        id: 'act5_opt_ambition',
        label: 'Công bố mở rộng 50 chi nhánh toàn quốc, đưa thương hiệu lên sàn chứng khoán',
        kicker: '💼 TẬP ĐOÀN ĐẠI CHÚNG',
        karmaEffect: { ambition: 25, community: 5 },
        reactionNarrative: 'Các quỹ đầu tư lớn tranh nhau ký hợp đồng nhượng quyền, mở ra một kỷ nguyên kinh doanh quy mô tỷ đô.'
      }
    ]
  }
];

export function chooseDialogueOption(
  state: GameState,
  actIdx: number,
  optionId: string
): { success: boolean; option?: DialogueOption; message?: string } {
  const episode = STORY_ACTS[actIdx];
  if (!episode) return { success: false, message: 'Hồi truyện không tồn tại' };

  if (episode.chapterRequirement > state.currentChapter) {
    return { success: false, message: `Chưa mở khóa Hồi ${episode.act} (Yêu cầu Chương ${episode.chapterRequirement})` };
  }

  // Hồi của chương đang chơi chỉ cho chọn khi đã đọc trọn (đã gom đủ tiền cọc chương)
  if (episode.chapterRequirement === state.currentChapter && chapterProgress(state) < 1) {
    return { success: false, message: 'Hãy đọc hết hồi truyện này trước khi quyết định.' };
  }

  const option = episode.options?.find(o => o.id === optionId);
  if (!option) return { success: false, message: 'Lựa chọn không hợp lệ' };

  if (!state.chosenDialogueIds) state.chosenDialogueIds = [];
  if (state.chosenDialogueIds.includes(optionId)) {
    return { success: false, message: 'Bạn đã chọn nhánh cốt truyện này rồi' };
  }

  // Cập nhật Karma
  state.karma = applyKarmaChange(state.karma, option.karmaEffect);
  state.chosenDialogueIds.push(optionId);

  // Kiểm tra xem có kích hoạt ending nào không
  const potentialEnding = evaluateEnding(state);
  if (potentialEnding) {
    state.activeEnding = potentialEnding;
  }

  return {
    success: true,
    option,
    message: option.reactionNarrative
  };
}
