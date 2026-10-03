import { CharacterEpisode } from '../types/game';
import { ASSETS } from './assets';
import { CHARACTER_EPISODES_EXPANDED } from './characterNarrativeExpanded';

/**
 * BIÊN NIÊN KÝ PHÂN NHÁNH TUYẾN NHÂN VẬT HẺM 1102 (EPISODIC CHARACTER ARCS)
 * Vũ trụ câu chuyện thống nhất kết nối 12 nhân vật biểu tượng Hẻm 1102.
 * Mỗi nhân vật có chuỗi tập truyện phân nhánh nhân quả liên ngày (Multi-day Causality),
 * 100% không lặp lại, mang lại trải nghiệm tiểu thuyết đời sống Sài Gòn sâu sắc.
 */
const CHAPTER_1_EPISODES: CharacterEpisode[] = [
  // =========================================================================
  // 1. BÁC BA (LƯƠNG VĂN BA) — CỰU ĐẦU BẾP GÀ CHỢ LỚN 1990 & TỔ TRƯỞNG DÂN PHỐ
  // =========================================================================
  {
    id: 'bac_ba_ep_01',
    characterId: 'bac_ba',
    characterName: 'Bác Ba Tổ Trưởng',
    characterRole: 'Cựu Bếp Trưởng Gà Chợ Lớn 1990',
    avatar: ASSETS.bacba.front,
    episodeIndex: 1,
    title: 'Tập 1: Lửa Chảo & Đôi Mắt Người Thợ Cũ',
    subtitle: 'Lời dặn dò đầu tiên bên chiếc xe đẩy vỉa hè đầy gió',
    unlockDay: 1,
    unlockChapter: 1,
    narrativeIntro: `Trời Sài Gòn chập tối lất phất mưa bay. Khói dầu chiên bắt đầu quyện vào gió hẻm 1102. Bác Ba chắp tay sau lưng, chiếc áo sơ mi bạc màu đẫm mồ hôi sau ca đi tuần tra tổ dân phố. Bác đứng lặng hồi lâu nhìn bạn trở đùi gà trong chảo dầu sôi tăm tắp, ánh mắt già nua bỗng rực lên tia lửa nghề của ba mươi năm trước.`,
    dialogueLines: [
      {
        speaker: 'Bác Ba',
        text: 'Dầu chưa sôi bọt tăm mà vội thả gà vô thì ngấy mỡ. Dầu quá lửa thì đắng chát cháy da. Nghề bếp với đời người cũng y chang vậy đó con nghen.',
        mood: 'normal',
      },
      {
        speaker: 'Bạn (Chủ Quán)',
        text: 'Dạ bác Ba, con mới gom được ít vốn mở quầy, nhiều chỗ canh lửa con còn run tay lắm...',
        mood: 'normal',
      },
      {
        speaker: 'Bác Ba',
        text: 'Năm 1990, tiệm Gà Chợ Lớn của thầy Võ Hòa cũng bắt đầu từ một chảo gang mép cống y vầy. Quan trọng hổng phải cái chảo sang, mà là cái tâm của đứa đứng bếp.',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Bác Ba vừa dứt lời, chảo gà của bạn vừa chín tới màu vàng mật. Bạn sẽ làm gì để đáp lại tấm lòng của người tiền bối?',
    choices: [
      {
        id: 'bac_ba_01_taste_respect',
        label: 'Vớt miếng má đùi vàng rụm nhất, kính cẩn mời Bác Ba nếm thử và chỉ giáo',
        kicker: '🔪 TÔN SƯ TRỌNG ĐẠO',
        reactionDialogue: 'Bác Ba cầm miếng gà nóng hổi, cắn nhẹ một miếng nghe giòn rụm rồi cười khà khà: "Vỏ giòn, thịt mọng ngọt nước! Mày có đôi tay của người yêu lửa rồi đó con!"',
        causalityNotice: 'Bác Ba công nhận tay nghề của bạn! Tập sau bác sẽ mang kỷ vật nghề bếp đến.',
        karmaEffect: { craftsmanship: 15, community: 10 },
        rewardReputation: 10,
        setsFlag: 'bacba_respected_craft',
      },
      {
        id: 'bac_ba_01_community_tea',
        label: 'Rót ly trà đá mát lạnh, kéo ghế mời bác ngồi nghỉ chân sau ca trực tổ',
        kicker: '💖 NGHĨA TÌNH HẺM SÂU',
        reactionDialogue: 'Bác Ba uống một hơi cạn ly trà đá, thở phào nhẹ nhõm: "Buôn bán ở đất này, có lòng thương người thì người trong hẻm chẳng bao giờ để mày đói."',
        causalityNotice: 'Bác Ba coi bạn như con cháu ruột! Tập sau bác sẽ giới thiệu mối hàng tốt.',
        karmaEffect: { community: 20, ambition: -5 },
        rewardMoney: 30000,
        setsFlag: 'bacba_warm_heart',
      },
    ],
    summaryNote: 'Ngày đầu tiên lập nghiệp, Bác Ba ghé thăm nhắc nhở triết lý nghề bếp và hé lộ về tiệm Gà Chợ Lớn huyền thoại năm 1990.',
  },
  {
    id: 'bac_ba_ep_02',
    characterId: 'bac_ba',
    characterName: 'Bác Ba Tổ Trưởng',
    characterRole: 'Cựu Bếp Trưởng Gà Chợ Lớn 1990',
    avatar: ASSETS.bacba.front,
    episodeIndex: 2,
    title: 'Tập 2: Bản Đồ Quy Hoạch & Nỗi Lo Xóm Cũ',
    subtitle: 'Cơn bão thị trường đe dọa thổi bay những con hẻm bình yên',
    unlockDay: 4,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'bac_ba_ep_01',
    narrativeIntro: `Bác Ba bước vào quán với xấp giấy tờ kẹp nách, vẻ mặt trầm tư khác hẳn ngày thường. Trên bàn là tờ thông báo sơ đồ mở rộng đại lộ và tin đồn một tập đoàn bất động sản lớn đang nhắm đến mặt bằng đầu hẻm 1102.`,
    dialogueLines: [
      {
        speaker: 'Bác Ba',
        text: 'Hôm nay họp phường về... Họ đang tính giải tỏa dải mặt bằng đầu ngõ để làm trung tâm thương mại cao tầng con à.',
        mood: 'sad',
      },
      {
        speaker: 'Bác Ba',
        text: 'Bà Bảy vé số, chị Lan bán vải, cả xe gà của mày nữa... Nếu hẻm này mất đi, người nghèo biết dạt về đâu?',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Đứng trước nguy cơ con hẻm bị giải tỏa và biến mất, bạn chia sẻ điều gì cùng Bác Ba?',
    choices: [
      {
        id: 'bac_ba_02_fight_for_alley',
        label: 'Cam kết cùng Bác Ba và bà con giữ gìn văn hóa ẩm thực hẻm bằng mọi giá',
        kicker: '🛡️ GIỮ LỬA HẺM NGHÈO',
        reactionDialogue: 'Bác Ba đập tay xuống bàn, mắt ánh lên quyết tâm: "Tốt lắm! Bác với con sẽ chứng minh con hẻm này là cái hồn của thành phố, hổng có tiền nào mua nổi!"',
        causalityNotice: 'Mở khóa nhánh đoàn kết cư dân! Cả hẻm sẽ bảo vệ tiệm khi gặp biến cố lớn.',
        karmaEffect: { community: 25, ambition: -10 },
        rewardReputation: 15,
        setsFlag: 'flag_defend_alley_heritage',
      },
      {
        id: 'bac_ba_02_grow_stronger',
        label: 'Đề xuất nâng cấp tiệm thành điểm sáng kinh doanh văn minh để phường giữ lại',
        kicker: '📈 NÂNG TẦM DI SẢN',
        reactionDialogue: 'Bác Ba vuốt cằm gật gù: "Ý tưởng hay. Biến tiệm gà thành thương hiệu đặc sản đại diện cho phường thì ai nỡ đập bỏ!"',
        causalityNotice: 'Mở khóa nhánh phát triển quy chuẩn! Mở đường cho danh hiệu Gà Vàng.',
        karmaEffect: { ambition: 20, craftsmanship: 10 },
        rewardMoney: 50000,
        setsFlag: 'flag_upgrade_alley_brand',
      },
    ],
    summaryNote: 'Hẻm 1102 đối mặt nguy cơ quy hoạch giải tỏa. Bạn cùng Bác Ba vạch ra chiến lược bảo tồn linh hồn xóm nhỏ.',
  },
  {
    id: 'bac_ba_ep_03',
    characterId: 'bac_ba',
    characterName: 'Bác Ba Tổ Trưởng',
    characterRole: 'Cựu Bếp Trưởng Gà Chợ Lớn 1990',
    avatar: ASSETS.bacba.front,
    episodeIndex: 3,
    title: 'Tập 3: Cuốn Sổ Tay Ố Vàng Năm 1990',
    subtitle: 'Bí mật về gia tộc họ Võ và công thức nước sốt bị lãng quên',
    unlockDay: 8,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'bac_ba_ep_02',
    narrativeIntro: `Đêm khuya, sau khi dọn dẹp quán xong xuôi, Bác Ba quay lại mang theo một chiếc hộp thiếc gỉ sét. Bác mở nắp, bên trong là cuốn sổ tay bìa da đã sờn rách mép, từng trang chi chít nét chữ mực tím nắn nót.`,
    dialogueLines: [
      {
        speaker: 'Bác Ba',
        text: 'Đây là di vật của ông Võ Hòa để lại. Ba mươi năm trước tiệm sập tiệm vì người ta chèn ép, ông Hòa uất ức mà mất sớm...',
        mood: 'touched',
      },
      {
        speaker: 'Bác Ba',
        text: 'Trong này có ghi tỷ lệ ngâm ớt hiểm và mật ong hoa cà phê rừng. Bác giữ bao năm, nay trao lại cho mày.',
        mood: 'normal',
      },
      {
        speaker: 'Bác Ba',
        text: 'Chỉ xin mày nhớ một điều: đừng bao giờ đem công thức này bán cho mấy tập đoàn công nghiệp làm đồ ăn nhanh đóng hộp.',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Đón nhận báu vật cả đời của thế hệ đi trước, lời thề của bạn với Bác Ba là gì?',
    choices: [
      {
        id: 'bac_ba_03_solemn_vow',
        label: 'Cúi đầu tiếp nhận, thề giữ trọn hương vị thủ công thuần khiết vì người ăn',
        kicker: '👑 TRUYỀN THỪA BẢO ĐẠO',
        reactionDialogue: 'Bác Ba rơm rớm nước mắt vỗ vai bạn: "Ông Hòa dưới suối vàng chắc đang mỉm cười. Cố lên nghe con trai!"',
        causalityNotice: 'Mở khóa bí quyết Hương Vị Hoàn Hảo! Nâng cao điểm Taste vĩnh viễn.',
        karmaEffect: { craftsmanship: 30, community: 10 },
        recipeHint: 'Sốt Cay Mật Ong Thượng Hạng',
        setsFlag: 'flag_master_sauce_unlocked',
      },
    ],
    summaryNote: 'Bác Ba chính thức truyền lại cuốn bí kíp của cụ Võ Hòa năm 1990 cho bạn, trao gửi ngọn lửa ẩm thực Chợ Lớn.',
  },

  // =========================================================================
  // 2. BÉ THỎ CAM (MIMI — VÕ MINH MI) — CÔ GÁI MASCOT & BÍ MẬT THÂN PHẬN
  // =========================================================================
  {
    id: 'tho_cam_ep_01',
    characterId: 'tho_cam',
    characterName: 'Bé Thỏ Cam',
    characterRole: 'Người Mặc Đồ Thú Bông Phát Tờ Rơi',
    avatar: ASSETS.thocam.front,
    episodeIndex: 1,
    title: 'Tập 1: Mẩu Giấy Note Màu Cam Đầu Tiên',
    subtitle: 'Bóng dáng chú thỏ lặng lẽ bên góc quầy lúc hoàng hôn',
    unlockDay: 2,
    unlockChapter: 1,
    narrativeIntro: `Giữa dòng xe cộ hối hả tan tầm, một người trong bộ đồ mascot thỏ bông màu cam to xù bước vào quầy. Hai tai thỏ ủ rũ vì mưa ướt. Vì quy định của công ty quảng cáo không được nói chuyện khi mang đồ mascot, bạn ấy chỉ rụt rè đặt lên mặt kính một mảnh giấy note hình chú thỏ nhỏ.`,
    dialogueLines: [
      {
        speaker: 'Mảnh Giấy Note Cam',
        text: '"Mùi gà chiên hôm nay... thơm giống hệt mùi trong ký ức tuổi thơ của em... Cho em xin mua 1 cánh gà nóng nhé ạ!"',
        mood: 'touched',
      },
      {
        speaker: 'Bạn (Chủ Quán)',
        text: 'Em mặc bộ đồ này cả ngày trời nóng nực lắm đúng không? Đợi anh chiên mẻ mới nóng giòn rụm nha!',
        mood: 'happy',
      },
    ],
    dilemmaPrompt: 'Bạn thấy chú thỏ bông run nhẹ vì lạnh và mệt lả. Bạn đối đãi với vị khách thầm lặng này thế nào?',
    choices: [
      {
        id: 'tho_cam_01_extra_snack',
        label: 'Gói thêm phần khoai lắc phô mai và hộp sữa ấm, không lấy thêm tiền',
        kicker: '🥕 NẤM ẤM LÒNG THỎ',
        reactionDialogue: 'Chú thỏ chắp hai tay trước ngực cúi gập người cảm ơn liên hồi, chiếc đuôi bông tròn lắc lư vui sướng.',
        causalityNotice: 'Bé Thỏ Cam cảm nhận được sự ấm áp! Những bức thư sau sẽ hé lộ nhiều tâm tư hơn.',
        karmaEffect: { community: 15, craftsmanship: 5 },
        setsFlag: 'bunny_fondness_high',
      },
      {
        id: 'tho_cam_01_crispy_perfect',
        label: 'Tập trung chiên một miếng đùi đạt chuẩn Perfect vàng óng để bạn ấy thưởng thức trọn vẹn',
        kicker: '✨ TINH HOA ĐẦU BẾP',
        reactionDialogue: 'Thỏ Cam nhận hộp gà, viết vội dòng chữ: "Cảm ơn anh chủ, giòn rụm rực rỡ xua tan hết mệt mỏi luôn!"',
        causalityNotice: 'Thỏ Cam ấn tượng với tay nghề của bạn! Bạn ấy sẽ để lại các mẹo ẩm thực quý.',
        karmaEffect: { craftsmanship: 20 },
        setsFlag: 'bunny_artisan_respect',
      },
    ],
    summaryNote: 'Cuộc gặp gỡ đầu tiên với Bé Thỏ Cam qua những mẩu giấy note viết tay ngập ngừng nhưng chứa chan cảm xúc.',
  },
  {
    id: 'tho_cam_ep_02',
    characterId: 'tho_cam',
    characterName: 'Bé Thỏ Cam',
    characterRole: 'Người Mặc Đồ Thú Bông Phát Tờ Rơi',
    avatar: ASSETS.thocam.front,
    episodeIndex: 2,
    title: 'Tập 2: Thư Tay Dưới Cơn Mưa Đầu Mùa',
    subtitle: 'Áp lực của người trẻ vật lộn mưu sinh giữa Sài Gòn phồn hoa',
    unlockDay: 5,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'tho_cam_ep_01',
    narrativeIntro: `Mưa rào tháng Sáu đổ sập xuống con hẻm. Thỏ Cam nép vào mái hiên tiệm gà, cả bộ mascot ướt sũng nặng trĩu. Bạn ấy run rẩy tháo găng tay thỏ, để lộ bàn tay nhỏ nhắn đầy những vết chai xước vì cầm hàng ngàn tờ rơi mỗi ngày.`,
    dialogueLines: [
      {
        speaker: 'Mảnh Giấy Note Cam',
        text: '"Hôm nay em bị trưởng nhóm phạt trừ lương vì không phát hết 1000 tờ rơi ở ngã tư. Người ta xua đuổi ghê lắm anh..."',
        mood: 'sad',
      },
      {
        speaker: 'Mảnh Giấy Note Cam',
        text: '"Nhiều lúc em muốn bỏ cuộc về quê, nhưng em còn lời hứa với ông ngoại phải mở lại căn bếp nhỏ..."',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Đọc những dòng tâm sự cay đắng của cô bé mưu sinh, bạn viết lời đáp lại thế nào trên mảnh giấy?',
    choices: [
      {
        id: 'tho_cam_02_encourage',
        label: 'Viết: "Sài Gòn không phụ người cố gắng. Khi nào mệt cứ ghé tiệm gà, ở đây luôn có phần ăn ấm chờ em!"',
        kicker: '💌 ĐIỂM TỰA TÂM HỒN',
        reactionDialogue: 'Đôi mắt sau khe hở đầu thỏ lóng lánh ngấn nước. Thỏ Cam cẩn thận gấp mẩu giấy của bạn cất vào túi áo trước ngực.',
        causalityNotice: 'Tình cảm gắn kết sâu đậm! Mimi coi tiệm gà là mái nhà thứ hai.',
        karmaEffect: { community: 20, ambition: 5 },
        setsFlag: 'bunny_deep_bond',
      },
    ],
    summaryNote: 'Thỏ Cam bộc bạch nỗi cơ cực của nghề mascot và lời hứa với người ông đã khuất. Tiệm gà trở thành bến đỗ bình yên của cô.',
  },
  {
    id: 'tho_cam_ep_03',
    characterId: 'tho_cam',
    characterName: 'Bé Thỏ Cam',
    characterRole: 'Người Mặc Đồ Thú Bông Phát Tờ Rơi',
    avatar: ASSETS.thocam.front,
    episodeIndex: 3,
    title: 'Tập 3: Mắt Thỏ Sau Lớp Mặt Nạ Mascot',
    subtitle: 'Manh mối đầu tiên về gia tộc họ Võ và thân phận Mimi',
    unlockDay: 10,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'tho_cam_ep_02',
    narrativeIntro: `Hôm nay Thỏ Cam đến sớm hơn thường lệ. Bạn ấy không mặc nguyên bộ mascot cồng kềnh mà chỉ khoác áo hoodie cam có tai thỏ, tay cầm một bức ảnh đen trắng đã ố vàng mép góc chụp một tiệm gà Chợ Lớn năm 1990.`,
    dialogueLines: [
      {
        speaker: 'Bé Thỏ Cam (Nói khẽ)',
        text: 'Dạ... em là Mi. Mọi người hay gọi em là Mimi...',
        mood: 'normal',
      },
      {
        speaker: 'Mimi',
        text: 'Ông ngoại em là Võ Hòa. Hồi nhỏ ông hay bế em ngồi xem chiên gà. Bác Ba tổ trưởng chính là bác bếp phó ngày xưa của ông em...',
        mood: 'touched',
      },
      {
        speaker: 'Mimi',
        text: 'Em thấy cuốn sổ tay ông trên kệ bếp của anh. Em mừng lắm vì biết bí quyết của ông được trao cho một người tử tế.',
        mood: 'happy',
      },
    ],
    dilemmaPrompt: 'Mimi chính là cháu ngoại cụ Võ Hòa! Bạn sẽ nói gì để động viên cô gái trẻ cùng tiếp nối giấc mơ?',
    choices: [
      {
        id: 'tho_cam_03_partner_promise',
        label: 'Nắm tay Mimi, hứa sau này khi quán lớn sẽ mời Mimi về làm quản lý chi nhánh Chợ Lớn',
        kicker: '🤝 LỜI HỨA CHI NHÁNH',
        reactionDialogue: 'Mimi mỉm cười rạng rỡ, lần đầu tiên nụ cười bừng sáng không còn vướng bận âu lo: "Em sẽ cố gắng học hỏi để không phụ lòng anh và ông ngoại!"',
        causalityNotice: 'Mở khóa điều kiện ẩn cho Đại Kết Cục: Tái sinh thương hiệu Gà Chợ Lớn!',
        karmaEffect: { community: 25, craftsmanship: 20 },
        setsFlag: 'flag_mimi_manager_path',
      },
    ],
    summaryNote: 'Thân phận Thỏ Cam chính thức lộ diện: Võ Minh Mi, cháu ngoại cụ Võ Hòa. Lời hẹn ước tái sinh thương hiệu Chợ Lớn được thiết lập.',
  },

  // =========================================================================
  // 3. EM NA (LÊ BẢO NA) — NỮ SINH HỌC MÚA BALLET & ƯỚC MƠ CHÁY BỎNG
  // =========================================================================
  {
    id: 'na_ep_01',
    characterId: 'le_bao_na',
    characterName: 'Em Na',
    characterRole: 'Nữ Sinh Trường Múa',
    avatar: ASSETS.hocsinh.stand,
    episodeIndex: 1,
    title: 'Tập 1: Đôi Giày Múa Rách Mép & Vết Chai Bàn Chân',
    subtitle: 'Nỗi niềm giấu kín của cô bé bàn số 2 sau những giờ khổ luyện',
    unlockDay: 2,
    unlockChapter: 1,
    narrativeIntro: `Na bước vào quán với chiếc balô múa nặng trĩu. Cô bé ngồi ở bàn số 2, cẩn thận tháo đôi giày múa lụa hồng đã rách toạc mũi. Những ngón chân dán đầy băng keo y tế chằng chịt, sưng đỏ vì những cú xoay pirouette trên sàn gỗ hàng giờ liền.`,
    dialogueLines: [
      {
        speaker: 'Em Na',
        text: 'Anh chủ ơi... cho em một phần ức gà chiên giòn nhưng lột da được không ạ? Huấn luyện viên bắt em ép cân gắt quá...',
        mood: 'sad',
      },
      {
        speaker: 'Em Na',
        text: 'Tháng sau là thi tuyển vào Học viện Múa rồi, mà anh Long nhà em cứ bảo múa men không nuôi nổi bản thân...',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Thấy Na vừa đói lả vừa áp lực tâm lý thi cử, bạn sẽ phục vụ món ăn và đưa ra lời khuyên nào?',
    choices: [
      {
        id: 'na_01_support_dance',
        label: 'Tự tay làm phần ức gà nướng mật ong bọc giấy bạc ít dầu, động viên Na kiên trì múa',
        kicker: '🩰 CHẮP CÁNH ƯỚC MƠ',
        reactionDialogue: 'Na ăn ngon lành, mắt sáng rực lên: "Ngon quá anh ơi! Ăn xong em thấy có thêm sức mạnh để mai tập tiếp rồi!"',
        causalityNotice: 'Na tin tưởng bạn! Tập sau cô bé sẽ mang chuyện mâu thuẫn gia đình ra tâm sự.',
        karmaEffect: { craftsmanship: 10, community: 15 },
        setsFlag: 'na_dance_encouraged',
      },
      {
        id: 'na_01_practical_advice',
        label: 'Chiên ức gà giòn chuẩn vị và nhắc Na lắng nghe thêm lời khuyên thực tế của anh Long',
        kicker: '💼 GÓC NHÌN THỰC TẾ',
        reactionDialogue: 'Na thở dài gật đầu: "Dạ... anh Long cày cuốc nuôi em ăn học vất vả, em cũng hiểu cho ảnh..."',
        causalityNotice: 'Na cân nhắc con đường an toàn, ảnh hưởng đến lựa chọn phân nhánh ở tập sau.',
        karmaEffect: { ambition: 15, community: 5 },
        setsFlag: 'na_practical_considered',
      },
    ],
    summaryNote: 'Em Na ghé tiệm sau giờ tập múa với bàn chân rớm máu, trải lòng về đam mê múa ballet và sự phản đối của anh trai.',
  },
  {
    id: 'na_ep_02',
    characterId: 'le_bao_na',
    characterName: 'Em Na',
    characterRole: 'Nữ Sinh Trường Múa',
    avatar: ASSETS.hocsinh.stand,
    episodeIndex: 2,
    title: 'Tập 2: Bức Tường Ngăn Cách & Lựa Chọn Ngã Rẽ',
    subtitle: 'Cơn thịnh nộ của người anh và giọt nước mắt tuổi 18',
    unlockDay: 5,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'na_ep_01',
    narrativeIntro: `Trời mưa tầm tã, Na chạy vội vào quán ướt như chuột lột. Chưa kịp ngồi xuống bàn số 2 thì tiếng bước chân thình thịch ngoài cửa. Anh Long – anh trai Na, mặc áo sơ mi công sở ướt đẫm, mặt hầm hầm lao vào giật phăng chiếc balô múa trên vai em gái.`,
    dialogueLines: [
      {
        speaker: 'Anh Long',
        text: 'Tao bảo mày nộp hồ sơ Đại học Ngoại Thương sao mày dám lén đăng ký Học viện Múa hả Na?!',
        mood: 'tense',
      },
      {
        speaker: 'Em Na',
        text: 'Em thích múa! Cả đời em chỉ muốn đứng trên sân khấu thôi! Sao anh cứ ép em làm những thứ em ghét?!',
        mood: 'sad',
      },
      {
        speaker: 'Anh Long',
        text: 'Mày có biết tao phải tăng ca đến loét dạ dày để có tiền đóng học cho mày không?! Múa rồi mai mốt ra đường xin ăn à?!',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Không khí quán căng như dây đàn, khách xung quanh ái ngại. Là chủ quán, bạn can thiệp thế nào?',
    choices: [
      {
        id: 'na_02_stand_for_passion',
        label: 'Đứng chắn trước mặt Na, mời anh Long ngồi xuống ăn đĩa gà cay nóng và phân tích cái tâm của đam mê',
        kicker: '🔥 ĐỨNG VỀ PHÍA ĐAM MÊ',
        reactionDialogue: 'Anh Long khựng lại trước thái độ cương quyết của bạn, hậm hực ngồi xuống ghế nhưng mắt vẫn trừng trừng: "Để coi mày múa ra tiền không!"',
        causalityNotice: 'Kích hoạt nhánh [Na Theo Học Múa]! Na quyết tâm thi Học viện Múa.',
        karmaEffect: { craftsmanship: 20, community: 15, ambition: -10 },
        setsFlag: 'na_branch_dance_path',
      },
      {
        id: 'na_02_mediator_peace',
        label: 'Khuyên Na bình tĩnh suy nghĩ và gợi ý giải pháp học song bằng để vẹn cả đôi đường',
        kicker: '⚖️ DUNG HÒA GIA ĐÌNH',
        reactionDialogue: 'Na sụt sùi lau nước mắt, anh Long dịu giọng lại: "Nếu mày chịu học kinh tế đàng hoàng, cuối tuần tao cho đi học múa."',
        causalityNotice: 'Kích hoạt nhánh [Na Học Song Bằng]! Giữ hòa khí gia đình.',
        karmaEffect: { community: 20, ambition: 15 },
        setsFlag: 'na_branch_dual_path',
      },
    ],
    summaryNote: 'Xung đột gay gắt giữa Na và anh trai bùng nổ tại quán. Sự can thiệp của bạn định hình ngã rẽ tương lai của cô bé.',
  },
  {
    id: 'na_ep_03',
    characterId: 'le_bao_na',
    characterName: 'Em Na',
    characterRole: 'Nữ Sinh Trường Múa',
    avatar: ASSETS.hocsinh.stand,
    episodeIndex: 3,
    title: 'Tập 3: Điệu Múa Giữa Giàn Hoa Giấy',
    subtitle: 'Món quà tri ân bất ngờ dành cho người đã bảo vệ ước mơ',
    unlockDay: 11,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'na_ep_02',
    narrativeIntro: `Một buổi chiều nắng vàng ươm rọi qua giàn hoa giấy trước cửa quán. Na xuất hiện trong bộ váy múa trắng muốt tinh khôi. Cùng đi với Na là Dũng – cậu bạn thân ôm chiếc máy quay phim cũ.`,
    dialogueLines: [
      {
        speaker: 'Em Na',
        text: 'Anh chủ ơi! Em vừa nhận được giấy báo trúng tuyển vòng tài năng rồi!',
        mood: 'happy',
      },
      {
        speaker: 'Em Na',
        text: 'Em muốn múa tặng anh và quán một bài ngay tại đây, dưới bóng hoa giấy này, để cảm ơn anh đã tin tưởng em!',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Na chuẩn bị biểu diễn một điệu múa ballet ngẫu hứng ngay giữa sân tiệm gà. Bạn chuẩn bị không gian thế nào?',
    choices: [
      {
        id: 'na_03_stage_setup',
        label: 'Kê gọn bàn ghế, bật điệu nhạc nhẹ du dương và mời bà con lối xóm cùng thưởng thức',
        kicker: '🌸 SÂN KHẤU HẺM NHỎ',
        reactionDialogue: 'Điệu múa uyển chuyển như cánh bướm của Na khiến cả con hẻm lặng đi trong xúc động. Bà con vỗ tay rầm rộ, khách vãng lai đứng chật kín!',
        causalityNotice: 'Tiệm gà trở nên nổi tiếng khắp quận nhờ video múa hoa giấy! Khách ghé nườm nượp.',
        karmaEffect: { community: 30, craftsmanship: 20 },
        rewardReputation: 25,
        setsFlag: 'na_dance_viral_show',
      },
    ],
    summaryNote: 'Na trúng tuyển vòng tài năng và biểu diễn điệu múa tri ân tuyệt đẹp dưới giàn hoa giấy, mang lại khoảnh khắc kỳ diệu cho Hẻm 1102.',
  },

  // =========================================================================
  // 4. DŨNG (TRẦN DŨNG) — CẬU BẠN VẼ MANGA & THIẾT KẾ BỘ NHẬN DIỆN THƯƠNG HIỆU
  // =========================================================================
  {
    id: 'dung_ep_01',
    characterId: 'tran_dung',
    characterName: 'Dũng Vẽ Truyện',
    characterRole: 'Họa Sĩ Truyện Tranh Đam Mê',
    avatar: ASSETS.hocsinh.stand,
    episodeIndex: 1,
    title: 'Tập 1: Trang Bản Thảo Lấm Lem Mỡ Gà',
    subtitle: 'Ước mơ hội họa nảy mầm từ những mẩu chuyện xóm lao động',
    unlockDay: 3,
    unlockChapter: 1,
    narrativeIntro: `Dũng ngồi thu lu ở góc bàn số 2, chiếc kính cận dày cộp trễ xuống sống mũi. Cậu cắm cúi vẽ lên tập giấy vẽ nhăn nhúm, xung quanh là tẩy chì vương vãi. Dũng đang vẽ lại chân dung Bác Ba, chị Lan bán vải và chiếc xe gà của bạn thành những nhân vật truyện tranh sống động.`,
    dialogueLines: [
      {
        speaker: 'Dũng',
        text: 'Dạ... em xin lỗi anh chủ, em ngồi lâu quá mà nãy giờ chỉ dám gọi một ly trà tắc 10 ngàn...',
        mood: 'sad',
      },
      {
        speaker: 'Dũng',
        text: 'Bố mẹ em bảo vẽ vời là nghề lông bông, cắt hết tiền tiêu vặt. Nhưng em muốn vẽ một bộ truyện về con hẻm này lắm anh...',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Nhìn những nét vẽ tài hoa nhưng bụng Dũng sôi réo vì đói, bạn đối xử với cậu họa sĩ trẻ thế nào?',
    choices: [
      {
        id: 'dung_01_treat_artist',
        label: 'Đặt lên bàn đĩa gà popcorn nóng hổi: "Ăn đi lấy sức vẽ tiếp, anh đặt hàng em vẽ menu cho quán!"',
        kicker: '🎨 ĐẦU TƯ TÀI NĂNG',
        reactionDialogue: 'Mắt Dũng sáng rực như vớ được vàng: "Thiệt hả anh?! Em hứa sẽ vẽ chiếc menu đỉnh nhất Sài Gòn cho anh coi!"',
        causalityNotice: 'Dũng dốc toàn lực vẽ bộ nhận diện thương hiệu cho tiệm gà.',
        karmaEffect: { community: 15, craftsmanship: 15 },
        setsFlag: 'dung_commissioned',
      },
      {
        id: 'dung_01_critique_story',
        label: 'Xem bản thảo và góp ý chân thành về tính cách từng nhân vật trong hẻm',
        kicker: '📖 ĐỒNG ĐIỆU TÂM HỒN',
        reactionDialogue: 'Dũng gật đầu lia lịa, hăng say ghi chép từng lời bạn nói: "Anh hiểu con hẻm này sâu sắc quá!"',
        causalityNotice: 'Kịch bản truyện của Dũng có chiều sâu vượt bậc, thu hút độc giả mạng.',
        karmaEffect: { craftsmanship: 20, ambition: 5 },
        setsFlag: 'dung_story_refined',
      },
    ],
    summaryNote: 'Dũng vẽ truyện tranh về Hẻm 1102 trong cảnh thiếu thốn. Bạn tiếp sức cho đam mê của cậu bằng cả miếng ăn và sự trân trọng tài năng.',
  },
  {
    id: 'dung_ep_02',
    characterId: 'tran_dung',
    characterName: 'Dũng Vẽ Truyện',
    characterRole: 'Họa Sĩ Truyện Tranh Đam Mê',
    avatar: ASSETS.hocsinh.stand,
    episodeIndex: 2,
    title: 'Tập 2: Logo Gà Bông Đội Mũ Đầu Bếp',
    subtitle: 'Món quà vô giá định hình diện mạo thương hiệu Tiệm Gà Nhà Tui',
    unlockDay: 7,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'dung_ep_01',
    narrativeIntro: `Dũng hớt hải chạy vào quán với đôi mắt thâm quầng vì thức trắng 3 đêm liền. Cậu cẩn thận trải lên bàn tấm bìa cứng ép bóng. Đó là hình vẽ linh vật chú gà con tròn xoe đội chiếc mũ đầu bếp nghiêng nghiêng, tay cầm chiếc vá gỗ mỉm cười hóm hỉnh – biểu tượng hoàn hảo cho tinh thần ấm cúng của quán.`,
    dialogueLines: [
      {
        speaker: 'Dũng',
        text: 'Em đặt tên cho bé là "Gà Bông Hẻm 1102"! Chiếc mũ đầu bếp tượng trưng cho nghề gia truyền của Bác Ba, còn nụ cười là sự thân thiện của anh!',
        mood: 'happy',
      },
      {
        speaker: 'Dũng',
        text: 'Em tặng quán, em không lấy tiền đâu! Chỉ xin anh cho em ăn gà rán mỗi khi em thi đỗ môn thôi!',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Tác phẩm logo quá đỗi xuất sắc và có hồn! Bạn đáp lại món quà lớn này thế nào?',
    choices: [
      {
        id: 'dung_02_fair_payment',
        label: 'Trao tận tay Dũng 500.000đ nhuận bút kèm thẻ ăn gà miễn phí 1 năm: "Sức lao động sáng tạo phải được đền đáp xứng đáng!"',
        kicker: '💎 SÒNG PHẲNG NGHĨA TÌNH',
        reactionDialogue: 'Dũng rơm rớm nước mắt cầm phong bao: "Lần đầu tiên có người công nhận tranh của em có giá trị... Em cảm ơn anh nhiều lắm!"',
        causalityNotice: 'Mở khóa tùy biến Logo Gà Bông trên toàn bộ giao diện! Danh tiếng quán tăng vọt.',
        karmaEffect: { community: 20, craftsmanship: 25 },
        rewardReputation: 30,
        setsFlag: 'dung_logo_adopted',
      },
    ],
    summaryNote: 'Dũng hoàn thành tác phẩm logo Gà Bông linh vật. Bạn trả thù lao đàng hoàng, tiếp thêm niềm tin sắt đá cho con đường họa sĩ của cậu.',
  },

  // =========================================================================
  // 5. ANH LONG (LÊ HOÀNG LONG) — TRƯỞNG PHÒNG IT & NỖI NIỀM NGƯỜI ANH CẢ
  // =========================================================================
  {
    id: 'anh_long_ep_01',
    characterId: 'anh_long',
    characterName: 'Anh Long Trưởng Phòng',
    characterRole: 'Trưởng Phòng IT & Anh Trai Na',
    avatar: ASSETS.vanphong.stand,
    episodeIndex: 1,
    title: 'Tập 1: Chiếc Cà Vạt Lệch Lúc 9 Giờ Đêm',
    subtitle: 'Nỗi cô đơn và gánh nặng cơm áo của người đàn ông trụ cột',
    unlockDay: 4,
    unlockChapter: 1,
    narrativeIntro: `Đồng hồ điểm 21h30. Khi quán chuẩn bị đóng cửa, một người đàn ông mặc sơ mi xanh xộc xệch, cà vạt nới lỏng lê từng bước mệt mỏi vào quán. Anh Long ngồi thụp xuống ghế, tay ôm lấy bụng với vẻ mặt nhăn nhó vì cơn đau dạ dày hành hạ sau buổi họp khẩn liên miên.`,
    dialogueLines: [
      {
        speaker: 'Anh Long',
        text: 'Chủ tiệm còn gì ăn nhanh không... Cho tôi một phần gì mềm thôi, bụng dạ dạo này tệ quá...',
        mood: 'sad',
      },
      {
        speaker: 'Anh Long',
        text: 'Cả ngày chỉ uống cà phê với nghe sếp chửi. Về nhà thì con em gái dở chứng đòi bỏ học đi múa... Nhức đầu muốn nổ tung.',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Thấy anh Long kiệt sức cả thể xác lẫn tinh thần, bạn chuẩn bị món ăn thế nào?',
    choices: [
      {
        id: 'long_01_comfort_meal',
        label: 'Nấu một bát súp gà xé nấm hương nóng hổi bồi bổ dạ dày, rót thêm ly trà hoa cúc ấm',
        kicker: '🍵 XOA DỊU VẾT THƯƠNG',
        reactionDialogue: 'Húp từng thìa súp ấm nóng, cơ mặt anh Long giãn ra, ánh mắt dịu hẳn đi: "Lâu lắm rồi tôi mới được ăn một thứ gì đó ấm bụng như vầy... Cảm ơn chú em."',
        causalityNotice: 'Anh Long tìm thấy chốn trú chân sau giờ làm việc. Mối quan hệ trở nên thân thiết.',
        karmaEffect: { community: 20, craftsmanship: 10 },
        setsFlag: 'long_healed_stomach',
      },
      {
        id: 'long_01_crispy_energy',
        label: 'Lên combo gà giòn sốt tỏi ớt bổ sung đạm cấp tốc để lấy lại năng lượng chiến đấu',
        kicker: '⚡ NẠP ĐẦY NĂNG LƯỢNG',
        reactionDialogue: 'Anh Long ăn ngấu nghiến: "Vị tỏi đậm đà làm tỉnh cả người! Ăn xong lại có sức đêm nay về cày tiếp slide!"',
        causalityNotice: 'Anh Long ghi nhận tiệm gà là địa chỉ tiếp sức công sở số 1.',
        karmaEffect: { ambition: 15, craftsmanship: 10 },
        setsFlag: 'long_energized',
      },
    ],
    summaryNote: 'Anh Long ghé tiệm trong tình trạng kiệt sức công sở. Bữa ăn ấm áp của bạn xoa dịu nỗi đau dạ dày và gánh nặng tinh thần của người anh cả.',
  },
  {
    id: 'anh_long_ep_02',
    characterId: 'anh_long',
    characterName: 'Anh Long Trưởng Phòng',
    characterRole: 'Trưởng Phòng IT & Anh Trai Na',
    avatar: ASSETS.vanphong.stand,
    episodeIndex: 2,
    title: 'Tập 2: Ký Ức Gói Mì Tôm Chia Đôi',
    subtitle: 'Lời trần tình đẫm nước mắt về lý do hà khắc với em gái',
    unlockDay: 8,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'anh_long_ep_01',
    narrativeIntro: `Hôm nay anh Long ghé sớm, gọi một đĩa gà cay và hai chai bia. Anh ngồi trầm ngâm nhìn về chiếc ghế trống bàn số 2 – nơi Na thường ngồi học bài. Khi men cay thấm vào người, những lớp vỏ bọc cứng nhắc của một trưởng phòng công ty dần bong tróc.`,
    dialogueLines: [
      {
        speaker: 'Anh Long',
        text: 'Năm tôi 14 tuổi, ba mẹ tai nạn mất đột ngột. Căn nhà trong hẻm bị xiết nợ, hai anh em tôi dắt nhau ra gầm cầu trú mưa.',
        mood: 'sad',
      },
      {
        speaker: 'Anh Long',
        text: 'Đêm đó đói quá, trong túi chỉ còn đúng một gói mì tôm sống. Tôi bẻ đôi, nhường Na nửa lớn, phần tôi nửa vụn.',
        mood: 'touched',
      },
      {
        speaker: 'Anh Long',
        text: 'Tôi thề với lòng không bao giờ để con bé phải nếm lại cái nghèo đó nữa. Tôi ép nó học kinh tế không phải vì ghét nó, mà vì tôi sợ... sợ mai mốt tôi già chết đi, không ai nuôi nổi nó.',
        mood: 'sad',
      },
    ],
    dilemmaPrompt: 'Nghe nỗi lòng quặn thắt của người anh trai cả đời hy sinh, bạn giãi bày điều gì cùng anh?',
    choices: [
      {
        id: 'long_02_persuade_trust',
        label: 'Bày tỏ sự kính phục lòng hy sinh của anh, nhưng khuyên anh hãy tin vào nghị lực và tài năng của Na',
        kicker: '🕊️ NIỀM TIN TRAO ĐI',
        reactionDialogue: 'Anh Long im lặng rất lâu, rồi thở dài một hơi nhẹ bẫng: "Có lẽ chú em nói đúng... Tôi bảo bọc nó quá mức thành ra giam cầm ước mơ của nó."',
        causalityNotice: 'Nút thắt tâm lý của anh Long được tháo gỡ! Mở đường cho màn làm lành xúc động.',
        karmaEffect: { community: 25, craftsmanship: 10 },
        setsFlag: 'long_mindset_opened',
      },
    ],
    summaryNote: 'Anh Long kể về ký ức gói mì tôm chia đôi năm 14 tuổi. Nút thắt tâm lý sâu kín nhất của người anh được bạn thấu hiểu và xoa dịu.',
  },

  // =========================================================================
  // 6. CHỊ MAI (PHẠM THU MAI) & BÉ BẮP — TỔ ẤM CỦA NGƯỜI MẸ ĐƠN THÂN
  // =========================================================================
  {
    id: 'mai_ep_01',
    characterId: 'chi_mai',
    characterName: 'Chị Mai Kế Toán',
    characterRole: 'Kế Toán Mẹ Đơn Thân',
    avatar: ASSETS.vanphong.stand,
    episodeIndex: 1,
    title: 'Tập 1: Đón Con Muộn & Góc Học Tập Bàn Số 1',
    subtitle: 'Nơi nương náu ấm áp của cô bé 7 tuổi chờ mẹ tan ca',
    unlockDay: 3,
    unlockChapter: 1,
    narrativeIntro: `Bé Bắp – cô bé 7 tuổi có đôi mắt tròn xoe, ngồi ngay ngắn ở bàn số 1 từ lúc 17h chiều. Trước mặt bé là quyển vở tập viết chữ đẹp và một hộp khoai lắc phô mai. Mẹ bé – chị Mai, làm kế toán ở tòa nhà đối diện hẻm, thường xuyên phải làm thêm giờ kiểm toán đến tận 19h30 tối mới vội vã chạy sang.`,
    dialogueLines: [
      {
        speaker: 'Chị Mai',
        text: 'Chủ quán ơi, chị xin lỗi vì để Bắp ngồi nhờ lâu quá... Công ty cuối tháng quyết toán số liệu chị không dứt ra được...',
        mood: 'sad',
      },
      {
        speaker: 'Bé Bắp',
        text: 'Mẹ ơi! Chú chủ tiệm tốt bụng lắm, chú còn bật đèn bàn sáng cho con viết chữ với tặng con một miếng gà nữa nè mẹ!',
        mood: 'happy',
      },
      {
        speaker: 'Chị Mai',
        text: 'Cảm ơn em nhiều lắm... Giữa thành phố này, tìm được một nơi an tâm gửi gắm con vài tiếng như vầy quý như vàng.',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Chị Mai rút ví đếm từng đồng lẻ tính tiền phần ăn của con. Bạn xử lý thế nào?',
    choices: [
      {
        id: 'mai_01_friendly_discount',
        label: 'Tính giá hữu nghị "combo học sinh", tặng thêm hộp gà mang về cho hai mẹ con ăn tối',
        kicker: '🏡 TÌNH LÀNG NGHĨA XÓM',
        reactionDialogue: 'Chị Mai rơm rớm nước mắt cảm kích: "Em tốt bụng quá, chị không biết lấy gì đền đáp..."',
        causalityNotice: 'Chị Mai trở thành khách ruột trung thành, sau này sẽ giúp tiệm làm sổ sách kế toán.',
        karmaEffect: { community: 20 },
        setsFlag: 'mai_bap_grateful',
      },
    ],
    summaryNote: 'Bé Bắp lấy bàn số 1 làm góc học tập chờ mẹ tan ca. Sự ấm áp của tiệm gà thắp sáng niềm tin cho hai mẹ con đơn thân.',
  },
  {
    id: 'mai_ep_02',
    characterId: 'chi_mai',
    characterName: 'Chị Mai Kế Toán',
    characterRole: 'Kế Toán Mẹ Đơn Thân',
    avatar: ASSETS.vanphong.stand,
    episodeIndex: 2,
    title: 'Tập 2: Cơn Mưa Cầu Sài Gòn & Chiếc Áo Mưa Của Tuấn Shipper',
    subtitle: 'Sự xuất hiện của người đàn ông chất phác sưởi ấm gia đình nhỏ',
    unlockDay: 7,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'mai_ep_01',
    narrativeIntro: `Trời mưa như trút nước, đường Nguyễn Hữu Cảnh ngập sâu lút bánh xe. Chị Mai bị kẹt xe cứng ngắc ở chân cầu Sài Gòn, gọi điện về tiệm trong tiếng khóc nấc vì lo bé Bắp ở quán một mình sợ sấm sét. Đúng lúc đó, anh Tuấn shipper nổ máy chiếc Wave cà tàng tạt vào tiệm.`,
    dialogueLines: [
      {
        speaker: 'Anh Tuấn',
        text: 'Anh nghe máy chị Mai dặn rồi! Để anh chạy xe lội nước sang đón bé Bắp, chủ tiệm cứ để anh!',
        mood: 'tense',
      },
      {
        speaker: 'Bé Bắp',
        text: 'Chú Tuấn ơi! Chú ướt hết trùm áo mưa cho con kìa!',
        mood: 'touched',
      },
      {
        speaker: 'Chị Mai (Khi về tới quán)',
        text: 'Tuấn ơi... em làm vậy chị biết cảm ơn em thế nào đây...',
        mood: 'touched',
      },
    ],
    dilemmaPrompt: 'Thấy Tuấn cả người ướt sũng nhường áo mưa cho bé Bắp, bạn làm gì để gắn kết đôi trẻ?',
    choices: [
      {
        id: 'mai_02_play_cupid',
        label: 'Mời cả Tuấn, chị Mai và bé Bắp ngồi chung một mâm gà chiên nóng, khéo léo vun vén tình cảm',
        kicker: '💘 ÔNG MAI HẺM NHỎ',
        reactionDialogue: 'Bé Bắp cười tít mắt gắp miếng gà to nhất cho chú Tuấn: "Chú Tuấn ăn nhiều cho khỏe chở mẹ con nha!" Tuấn và Mai nhìn nhau đỏ bừng mặt ngượng ngùng.',
        causalityNotice: 'Kích hoạt mối duyên đẹp giữa Tuấn và Mai! Hẻm 1102 sắp có tin vui.',
        karmaEffect: { community: 25, ambition: 5 },
        setsFlag: 'tuan_mai_romance_blooming',
      },
    ],
    summaryNote: 'Tuấn shipper lội mưa đón bé Bắp hộ chị Mai. Bữa gà nóng hổi tại quán trở thành chất xúc tác cho mối tình ngọt ngào nở hoa.',
  },

  // =========================================================================
  // 7. CHỊ LAN (ĐỖ NGỌC LAN) — TIỂU THƯƠNG BÁN VẢI & BÀ CHỊ ĐANH ĐÁ TỐT BỤNG
  // =========================================================================
  {
    id: 'lan_ep_01',
    characterId: 'chi_lan',
    characterName: 'Chị Lan Bán Vải',
    characterRole: 'Tiểu Thương Chợ Tân Định',
    avatar: ASSETS.karen.stand,
    episodeIndex: 1,
    title: 'Tập 1: Tiếng La Làng Đầu Ngõ & Đĩa Gà Chuẩn Perfect',
    subtitle: 'Khách hàng khó tính nhất hẻm và bài kiểm tra khẩu vị',
    unlockDay: 4,
    unlockChapter: 1,
    narrativeIntro: `Chưa thấy người đâu đã nghe tiếng guốc lộc cộc và giọng oang oang từ đầu hẻm: "Trời thần ơi! Chiên gà cái mùi gì mà bay nức mũi từ ngõ vô tới sạp vải vậy nè trời!". Chị Lan xăm xăm bước vào, quạt phe phẩy chiếc nón lá, liếc mắt sắc lẻm nhìn chảo dầu.`,
    dialogueLines: [
      {
        speaker: 'Chị Lan',
        text: 'Lấy tui cái đùi gà coi! Nói trước nghe mậy, chiên mà khô queo hay hôi dầu là tui bắt đền gấp đôi, la làng cho cả chợ biết đó!',
        mood: 'tense',
      },
      {
        speaker: 'Bạn (Chủ Quán)',
        text: 'Dạ chị Lan yên tâm, mẻ này vừa chiên xong, vỏ mỏng giòn tan thịt mềm mọng nước, chị ăn không ngon em không lấy tiền!',
        mood: 'happy',
      },
    ],
    dilemmaPrompt: 'Đối mặt với vị khách khét tiếng khó tính của khu chợ, bạn phục vụ thế nào?',
    choices: [
      {
        id: 'lan_01_flawless_serving',
        label: 'Tự tay chọn miếng đùi Perfect ráo dầu, rắc chút muối tiêu chanh chuẩn vị Nam Bộ',
        kicker: '🍗 CHINH PHỤC KHẨU VỊ',
        reactionDialogue: 'Chị Lan cắn một miếng, tiếng giòn tan vang lên rôm rốp. Chị chép miệng, mắt mở to: "Ừm... cũng được đó mậy! Giòn mà không ngấy, thịt ngọt. Được, duyệt!"',
        causalityNotice: 'Chị Lan công nhận tay nghề quán! Miệng chị khen một câu là cả chợ kéo tới ăn.',
        karmaEffect: { craftsmanship: 20, community: 10 },
        rewardMoney: 40000,
        setsFlag: 'lan_impressed',
      },
    ],
    summaryNote: 'Chị Lan bán vải ghé quán với thái độ đanh đá thử thách. Mẻ gà Perfect chuẩn vị đã hoàn toàn chinh phục "bà trùm miệng thét ra lửa" của hẻm.',
  },
  {
    id: 'lan_ep_02',
    characterId: 'chi_lan',
    characterName: 'Chị Lan Bán Vải',
    characterRole: 'Tiểu Thương Chợ Tân Định',
    avatar: ASSETS.karen.stand,
    episodeIndex: 2,
    title: 'Tập 2: Gánh Nặng Viện Phí & Nỗi Lòng Người Con Gái Hiếu Thảo',
    subtitle: 'Đằng sau chiếc miệng nhanh nhảu là những đêm thức trắng ở Chợ Rẫy',
    unlockDay: 9,
    unlockChapter: 1,
    prerequisiteEpisodeId: 'lan_ep_01',
    narrativeIntro: `Hôm nay chị Lan ghé mua 3 phần gà mang về nhưng gương mặt hốc hác, quầng thâm mắt trũng sâu. Trên tay chị vẫn còn dán chiếc vòng nhựa định danh của Bệnh viện Chợ Rẫy.`,
    dialogueLines: [
      {
        speaker: 'Chị Lan',
        text: 'Gói kỹ giùm tui nha mậy, đem vô viện cho má tui ăn... Bả chạy thận tuần 3 lần, đắng miệng chẳng thèm ăn gì, chỉ khen gà chỗ mày thơm...',
        mood: 'sad',
      },
      {
        speaker: 'Chị Lan',
        text: 'Mấy nay buôn bán ế ẩm, tiền thuốc men mỗi ngày cả triệu bạc... Nhiều lúc muốn khóc mà phải gồng lên cười buôn bán tiếp...',
        mood: 'sad',
      },
    ],
    dilemmaPrompt: 'Biết hoàn cảnh mẹ già bệnh nặng của chị Lan, bạn chia sẻ tấm lòng thế nào?',
    choices: [
      {
        id: 'lan_02_charity_warmth',
        label: 'Từ chối nhận tiền gà, tặng thêm hộp canh gà hầm táo đỏ tẩm bổ cho bác gái',
        kicker: '🍲 BÁT CANH HIẾU NGHĨA',
        reactionDialogue: 'Chị Lan sững người nhìn bạn, đôi mắt sắc sảo bỗng đỏ hoe nước mắt: "Mày làm vậy... chị mang ơn mày cả đời nghen thằng em..."',
        causalityNotice: 'Chị Lan coi bạn như em ruột trong nhà! Sau này chị sẽ đứng ra bảo vệ quán hết mình.',
        karmaEffect: { community: 30, ambition: -5 },
        setsFlag: 'lan_sisterly_bond',
      },
    ],
    summaryNote: 'Hé lộ nỗi đau mẹ già chạy thận của chị Lan. Bát canh gà hiếu nghĩa đã thắt chặt tình chị em ruột thịt nơi xóm nhỏ.',
  },

  // =========================================================================
  // 8. QUỲNH ANH — FOOD CREATOR TIKTOKER GENZ & BÀI HỌC VỀ SỰ CHÂN THẬT
  // =========================================================================
  {
    id: 'quynh_anh_ep_01',
    characterId: 'quynh_anh',
    characterName: 'Quỳnh Anh Reviewer',
    characterRole: 'Food Reviewer TikTok 1 Triệu Followers',
    avatar: ASSETS.tiktoker.stand,
    episodeIndex: 1,
    title: 'Tập 1: Chiếc Đèn Livestream & Tiếng Kêu Rôm Rốp',
    subtitle: 'Cơn sốt mạng xã hội ập vào con hẻm cổ kính',
    unlockDay: 5,
    unlockChapter: 1,
    narrativeIntro: `Một cô gái trẻ sành điệu bước vào cùng chiếc gậy gimbal và đèn LED tròn rực rỡ. Quỳnh Anh – một trong những nhà sáng tạo nội dung ẩm thực hot nhất nền tảng Tóp Tóp, vừa lia máy quay vừa cất giọng lảnh lót: "Hello cả nhà iu! Hôm nay Quỳnh Anh dẫn mọi người thâm nhập vào một quán gà rán núp hẻm đang gây sốt rần rần nha!"`,
    dialogueLines: [
      {
        speaker: 'Quỳnh Anh',
        text: 'Anh chủ ơi cho em một mẹt gà đầy đủ sốt nhất để em quay mukbang ASMR cho fan coi nha! Nghe đồn giòn chấn động dữ lắm!',
        mood: 'happy',
      },
      {
        speaker: 'Quỳnh Anh',
        text: 'Ê nha, miếng gà này cắn một cái ta nói nó giòn rụm keo lỳ luôn á mấy bà! Không có dầu thừa miếng nào luôn 10 điểm!',
        mood: 'happy',
      },
    ],
    dilemmaPrompt: 'Quỳnh Anh ngỏ ý đề xuất ký hợp đồng quảng cáo độc quyền với giá 5 triệu đồng để đẩy clip lên xu hướng. Bạn quyết định thế nào?',
    choices: [
      {
        id: 'quynh_anh_01_authentic_only',
        label: 'Cảm ơn và nói: "Quán chỉ muốn khách đến vì gà thật sự ngon, không dám dùng tiền mua view ảo đâu em!"',
        kicker: '🌱 CHÂN THẬT LÀM GỐC',
        reactionDialogue: 'Quỳnh Anh hơi bất ngờ rồi cười tươi: "Hay nha! Lần đầu tiên có chủ quán từ chối book PR! Em thích cái tính này, em review free luôn cho anh coi!"',
        causalityNotice: 'Video review tự nhiên triệu view bùng nổ vì độ chân thật! Khách kéo đến nườm nượp.',
        karmaEffect: { craftsmanship: 20, community: 15, ambition: -5 },
        rewardReputation: 35,
        setsFlag: 'quynh_anh_organic_viral',
      },
      {
        id: 'quynh_anh_01_take_deal',
        label: 'Đồng ý đầu tư gói truyền thông để đẩy mạnh thương hiệu phủ sóng toàn thành phố',
        kicker: '🚀 BỨT PHÁ TRUYỀN THÔNG',
        reactionDialogue: 'Quỳnh Anh bắt tay bạn: "Ok chốt đơn! Tối nay clip lên xu hướng, mai tiệm chuẩn bị đón bão đơn nha anh!"',
        causalityNotice: 'Lượng khách đặt đơn app tăng vọt 50% trong 3 ngày tới.',
        karmaEffect: { ambition: 25, craftsmanship: 5 },
        rewardMoney: 100000,
        setsFlag: 'quynh_anh_paid_campaign',
      },
    ],
    summaryNote: 'TikToker triệu view Quỳnh Anh ghé quán quay clip. Sự lựa chọn giữa truyền thông hữu cơ hay đầu tư trả phí định hình chiến lược marketing của quán.',
  },

  // =========================================================================
  // 9. ĐỨC HUY — GAME THỦ CÚ ĐÊM & "HIỆP SĨ CÔNG NGHỆ" CỦA HẺM 1102
  // =========================================================================
  {
    id: 'duc_huy_ep_01',
    characterId: 'duc_huy',
    characterName: 'Đức Huy Game Thủ',
    characterRole: 'Cú Đêm IT & Chuyên Viên An Ninh Mạng',
    avatar: ASSETS.gamethu.stand,
    episodeIndex: 1,
    title: 'Tập 1: Bàn Phím Cơ & Chiếc Bẫy Review Ảo',
    subtitle: 'Bóc trần âm mưu chơi xấu của chuỗi gà rán công nghiệp',
    unlockDay: 6,
    unlockChapter: 1,
    narrativeIntro: `Đức Huy – chàng sinh viên IT đeo tai nghe gaming quanh cổ, mắt dán chặt vào màn hình máy tính đang chạy hàng loạt dòng lệnh mã nguồn. Cậu vừa gõ bàn phím lách cách vừa húp cạn ly nước ngọt, vẻ mặt nghiêm trọng chỉ vào màn hình cho bạn xem.`,
    dialogueLines: [
      {
        speaker: 'Đức Huy',
        text: 'Anh chủ, tiệm mình đang bị một hệ thống botnet chuyên nghiệp đánh phá trên Google Maps và ứng dụng giao hàng!',
        mood: 'tense',
      },
      {
        speaker: 'Đức Huy',
        text: 'Em vừa truy vết địa chỉ dải IP của 50 cái đánh giá 1 sao hôm qua. Toàn bộ trỏ về cùng một máy chủ thuộc sở hữu của công ty truyền thông MegaChicken!',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Đứng trước bằng chứng đối thủ MegaChicken thuê bot bẩn dìm hàng tiệm gà, bạn phối hợp cùng Huy thế nào?',
    choices: [
      {
        id: 'duc_huy_01_expose_bots',
        label: 'Nhờ Huy xuất file báo cáo dữ liệu minh bạch để gửi đơn khiếu nại chính thức lên ban quản trị sàn',
        kicker: '💻 VẠCH TRẦN GIAN LẬN',
        reactionDialogue: 'Đức Huy gõ phím thoăn thoắt: "Xong ngay! Em gửi kèm bằng chứng kỹ thuật thì sàn khóa sạch tài khoản bot của tụi nó trong 2 nốt nhạc!"',
        causalityNotice: 'Xóa sạch 100% review 1 sao ảo! Tăng điểm uy tín và nhận huân chương Bảo Mật.',
        karmaEffect: { craftsmanship: 20, ambition: 15 },
        rewardReputation: 20,
        setsFlag: 'duc_huy_security_shield',
      },
    ],
    summaryNote: 'Đức Huy phát hiện và đập tan chiến dịch review bẩn của MegaChicken, trở thành lá chắn công nghệ tin cậy bảo vệ danh tiếng tiệm gà.',
  },

  // =========================================================================
  // 10. ÔNG KÍNH TRÒN — FOOD CRITIC BÍ ẨN & BÀI KHẢO THÍ CỦA TÂM ĐẦU BẾP
  // =========================================================================
  {
    id: 'kinh_tron_ep_01',
    characterId: 'kinh_tron',
    characterName: 'Ông Kính Tròn',
    characterRole: 'Food Critic Ẩn Danh Của Giải Gà Vàng',
    avatar: ASSETS.vanphong.stand,
    episodeIndex: 1,
    title: 'Tập 1: Chiếc Mũ Phớt & Cây Bút Máy Mực Đen',
    subtitle: 'Cuộc ghé thăm bất ngờ của vị giám khảo quyền lực nhất Sài Gòn',
    unlockDay: 7,
    unlockChapter: 1,
    narrativeIntro: `Một người đàn ông trung niên mặc áo măng-tô xám, đội mũ phớt che nửa khuôn mặt bước vào quán. Điểm nhận dạng duy nhất là cặp kính gọng tròn màu đen ánh lên sự sắc sảo. Ông gọi duy nhất 1 miếng cánh gà nguyên bản không nước sốt, không nói một lời nào và chỉ chăm chú quan sát từng thao tác chiên của bạn.`,
    dialogueLines: [
      {
        speaker: 'Ông Kính Tròn',
        text: 'Nhiệt độ dầu 175 độ C. Bột bọc đều không vón cục. Thời gian chiên 8 phút 15 giây. Kỹ thuật không tệ.',
        mood: 'normal',
      },
      {
        speaker: 'Ông Kính Tròn',
        text: 'Thịt gà tươi mọng nước, xương không đỏ. Ngươi học cách căn lửa này từ Lương Văn Ba đúng không?',
        mood: 'tense',
      },
    ],
    dilemmaPrompt: 'Người này nhận ra ngay dấu ấn của Bác Ba! Bạn đối đáp thế nào trước giám khảo ẩn danh?',
    choices: [
      {
        id: 'kinh_tron_01_humble_respect',
        label: 'Kính cẩn: "Dạ thưa chú, Bác Ba là người thầy khai tâm cho con. Con chỉ đang cố gắng giữ trọn ngọn lửa của bác."',
        kicker: '🎖️ ĐẠO LÀM NGHỀ',
        reactionDialogue: 'Cặp kính tròn khẽ gật đầu, khóe môi nhếch lên một nụ cười hiếm hoi: "Biết ơn người đi trước là cái gốc của một đầu bếp lớn. Ta sẽ còn quay lại."',
        causalityNotice: 'Ông Kính Tròn ghi nhận điểm cao vào sổ chấm giải Gà Vàng toàn quốc!',
        karmaEffect: { craftsmanship: 25, community: 15 },
        rewardReputation: 30,
        setsFlag: 'kinh_tron_endorsed',
      },
    ],
    summaryNote: 'Vị giám khảo kỳ cựu "Ông Kính Tròn" xuất hiện kiểm tra kỹ thuật. Lòng khiêm nhường và sự trung thực đã mở ra cánh cửa tiến vào giải Gà Vàng.',
  },
];

export const CHARACTER_EPISODES: CharacterEpisode[] = [
  ...CHAPTER_1_EPISODES,
  ...CHARACTER_EPISODES_EXPANDED,
];

/**
 * Lấy toàn bộ danh sách tập truyện của một nhân vật cụ thể
 */
export function getEpisodesByCharacter(characterId: string): CharacterEpisode[] {
  return CHARACTER_EPISODES.filter(ep => ep.characterId === characterId)
    .sort((a, b) => a.episodeIndex - b.episodeIndex);
}

/**
 * Tìm tập truyện theo mã ID
 */
export function getEpisodeById(episodeId: string): CharacterEpisode | undefined {
  return CHARACTER_EPISODES.find(ep => ep.id === episodeId);
}
