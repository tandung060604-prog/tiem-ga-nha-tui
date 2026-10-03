import { Storylet } from '../types/game';
import { ASSETS } from './assets';

/**
 * Ngân Hàng Ký Ức Đêm Hẻm 1102 (QBN Night Storylets)
 * Kiến trúc Quality-Based Narrative lấy cảm hứng từ Fallen London & Coffee Talk.
 * Kích hoạt dựa trên Karma ngầm, Ngày chơi, Mẻ chiên Perfect và Trạng thái tiệm.
 */

export const NIGHT_STORYLETS: Storylet[] = [
  {
    id: 'storylet_night_01_bac_ba_oil',
    title: 'Ngọn Lửa Sau Giờ Đóng Cửa',
    characterId: 'char_06_granny_ba',
    characterName: 'Bác Ba Tổ Trưởng',
    characterAvatar: ASSETS.bacba.front,
    characterRole: 'Cựu Bếp Trưởng Chợ Lớn 1990',
    setting: 'Hiên quán Hẻm 1102 lúc 23:30 · Gió đêm thốc nhẹ mùi hoa sứ',
    narrativeLines: [
      'Đèn đường hẻm 1102 ngả sang màu vàng vọt. Bác Ba chậm rãi kéo chiếc ghế đẩu gỗ ngồi xuống cạnh chảo gang vừa nguội.',
      '"Làm nghề chiên gà này coi vậy mà khổ dữ đa con. Người ta chỉ thấy miếng gà giòn rụm bên ngoài, chớ mấy ai thấu được cảnh đứng vạc dầu phỏng tay, mồ hôi ướt đẫm lưng áo.',
      'Nhưng nhớ lời bác: Tiền kiếm bao nhiêu cũng hổng quý bằng cái tâm mình đặt vô miếng ăn cho chòm xóm."'
    ],
    choices: [
      {
        id: 'opt_craft_heart',
        label: 'Dạ con nhớ, giữ dầu sạch và tay nghề vàng giòn là trên hết',
        kicker: 'ĐẠO LÀM BẾP',
        subDesc: 'Tăng chỉ số Tay Nghề (Craftsmanship), nhận sổ tay bí quyết nhiệt độ',
        effect: {
          karmaDelta: { craftsmanship: 1.5, community: 0.5 },
          reactionNarrative: 'Bác Ba mỉm cười gật gù, rút trong túi áo bà ba ra một cuốn sổ tay giấy vàng ố ghi chép các mốc nhiệt độ vàng giòn trao cho bạn.',
          bonusItem: { id: 'flour', amount: 5 }
        }
      },
      {
        id: 'opt_comm_care',
        label: 'Bác Ba ngồi uống với con ngụm trà nóng, khuya rồi bác đừng thức khuya',
        kicker: 'TÌNH NGHĨA XÓM GIỀNG',
        subDesc: 'Tăng chỉ số Cộng Đồng (Community), Bác Ba hỗ trợ trông coi an ninh',
        effect: {
          karmaDelta: { community: 2.0 },
          reputationDelta: 0.1,
          reactionNarrative: 'Bác Ba nhấp ngụm trà sen ấm lòng, vỗ vai bạn dặn: "Mai có gì khó khăn cứ ới bác một tiếng, xóm này hổng ai để con thiệt đâu!"'
        }
      }
    ],
    requirements: {
      minDay: 1,
      maxDay: 4
    },
    oneShot: true
  },
  {
    id: 'storylet_night_02_cat_muop',
    title: 'Vị Khách Bốn Chân Mái Tôn',
    characterId: 'pet_02_cat_muop',
    characterName: 'Mèo Mướp Hẻm Sâu',
    characterAvatar: '🐱',
    characterRole: 'Cư Dân Tự Do Mái Hiên',
    setting: 'Mái tôn sau bếp tiệm gà · Tiếng mưa lất phất gõ nhịp lách tách',
    narrativeLines: [
      'Một bóng hình nhỏ thó nhảy êm ru từ bờ tường xuống quầy inox. Đôi mắt màu hổ phách tròn xoe ngó chăm chú vào vụn bột chiên còn sót lại trên thau.',
      'Bộ lông mướp vằn vện ướt sũng vì cơn mưa rào bất chợt của đất Sài Gòn. Chú mèo không kêu, chỉ khẽ cọ đầu vào chân bàn làm bằng ống tuýp sắt.',
      'Dưới ánh đèn leo lét, trông nó vừa kiêu hãnh vừa tội nghiệp, như chính những mảnh đời trôi dạt neo đậu nơi con hẻm cùng này.'
    ],
    choices: [
      {
        id: 'opt_feed_crispy_skin',
        label: 'Cắt vụn miếng da gà giòn rụm & rót chén nước lọc đãi mèo',
        kicker: 'LÒNG TRẮC ẨN',
        subDesc: 'Mèo Mướp gia tăng độ thân thiện, bảo vệ bếp khỏi chuột cống',
        effect: {
          karmaDelta: { community: 1.2, craftsmanship: 0.5 },
          reactionNarrative: 'Chú mèo nhấm nháp miếng da gà thơm phức một cách khoan thai, rồi dụi đầu vào mu bàn tay bạn kêu "gừ gừ" mãn nguyện trước khi nhảy tót lên mái tôn.',
        }
      },
      {
        id: 'opt_feed_dry_box',
        label: 'Lót chiếc hộp carton cũ làm ổ ấm khô ráo dưới góc hiên',
        kicker: 'MÁI ẤM TÌM LẠI',
        subDesc: 'Tăng chỉ số Cộng Đồng, nhận điềm may mắn ngày mai',
        effect: {
          karmaDelta: { community: 1.8 },
          moneyDelta: 20000,
          reactionNarrative: 'Sáng hôm sau trong chiếc hộp carton ấm cúng, bạn thấy một tờ tiền 20.000đ ai đó làm rơi được chú mèo tha về như một món quà cảm ơn kỳ lạ.'
        }
      }
    ],
    requirements: {
      minDay: 2,
      minPerfectFries: 3
    },
    oneShot: true
  },
  {
    id: 'storylet_night_03_shipper_rain',
    title: 'Ly Nước Ngọt Lúc Nửa Đêm',
    characterId: 'char_19_shipper_tuan',
    characterName: 'Anh Tuấn Giao Hàng',
    characterAvatar: ASSETS.shipper.stand,
    characterRole: 'Tài Xế Công Nghệ Xuyên Đêm',
    setting: 'Trước vỉa hè tiệm gà · Chiếc xe Wave cà tàng dựng nghiêng chống chân',
    narrativeLines: [
      'Chiếc áo khoác xanh sờn rách vai đẫm nước mưa. Anh Tuấn tựa lưng vào cột cờ hẻm, ngón tay run run vì lạnh khi cầm điện thoại chờ nổ cuốc xe cuối.',
      '"Nay ế quá em ơi, chạy từ 6 giờ chiều tới giờ mới được năm cuốc, trừ tiền xăng coi như huề vốn...',
      'Nhìn tiệm gà em đỏ lửa ấm cúng thiệt, đứng ngửi mùi dầu thơm nức mũi mà thấy đỡ tủi thân hẳn."'
    ],
    choices: [
      {
        id: 'opt_treat_drink_hot',
        label: 'Rót tặng anh ly nước ngọt sủi bọt mát lạnh & mời vào trú mưa',
        kicker: 'CHIA NGỌT SẺ BÙI',
        subDesc: 'Lan tỏa hơi ấm tình người, các đơn giao xa sau này được ưu tiên nhận nhanh',
        effect: {
          karmaDelta: { community: 2.2 },
          reputationDelta: 0.15,
          reactionNarrative: 'Anh Tuấn xúc động uống một hơi cạn sạch, cười tươi: "Cảm ơn em trai nhiều nha! Sau này quán có đơn giao xa cứ bấm app, anh ưu tiên chạy hỏa tốc cho!"'
        }
      },
      {
        id: 'opt_share_chicken_tips',
        label: 'Tặng kèm một gói khoai tây lắc phô mai nóng hổi lót dạ',
        kicker: 'ẤM BỤNG ĐÊM ĐÔNG',
        subDesc: 'Hào sảng đất Sài Gòn, tăng uy tín xóm giềng',
        effect: {
          karmaDelta: { community: 1.5, craftsmanship: 1.0 },
          moneyDelta: 15000,
          reactionNarrative: 'Anh Tuấn nhất quyết nhét vào tay bạn 15.000đ tiền tip: "Ăn không của em anh áy náy lắm, lấy tiền này mai nhập thêm khoai ngon nghen!"'
        }
      }
    ],
    requirements: {
      minDay: 3
    },
    oneShot: true
  },
  {
    id: 'storylet_night_04_secret_sauce_whisper',
    title: 'Hương Vị Trong Ký Ức Của Ngoại',
    characterId: 'char_01_owner',
    characterName: 'Ký Ức Bản Thân',
    characterAvatar: ASSETS.gabong.front,
    characterRole: 'Bếp Trưởng Trăn Trở',
    setting: 'Gian bếp nhỏ sau quầy sơ chế · Ngọn đèn vàng chiếu rọi thau sốt',
    narrativeLines: [
      'Trong tĩnh lặng của đêm muộn, bạn mở lại cuốn tập kẻ ô ly ố vàng của Ngoại để lại dưới đáy hòm gỗ.',
      'Những dòng chữ nắn nót mực tím về tỷ lệ tỏi cô đơn Lý Sơn, ớt sừng cay nồng và mật mía xứ Quảng hiện lên mồn một.',
      'Gà rán kiểu Tây thì giòn, nhưng gà rán kiểu Hẻm 1102 phải có cái hồn cốt đậm đà, mặn ngọt chua cay quấn quýt nơi đầu lưỡi.'
    ],
    choices: [
      {
        id: 'opt_heritage_craft',
        label: 'Dành cả đêm thử nghiệm lại công thức sốt bí truyền của Ngoại',
        kicker: 'GIỮ GÌN DI SẢN',
        subDesc: 'Đầu tư công sức luyện tay nghề đỉnh cao, tăng mạnh Craftsmanship',
        effect: {
          karmaDelta: { craftsmanship: 2.5 },
          bonusItem: { id: 'spicy_sauce', amount: 3 },
          reactionNarrative: 'Mùi sốt thơm nồng lan tỏa khắp gian bếp nhỏ, màu đỏ au óng ánh quyến rũ báo hiệu một mẻ sốt xuất thần!'
        }
      },
      {
        id: 'opt_fusion_ambition',
        label: 'Cải tiến sốt theo phong cách cay phô mai GenZ đang thịnh hành',
        kicker: 'ĐỔI MỚI THỜI THƯỢNG',
        subDesc: 'Bắt nhịp xu hướng thị trường, tăng chỉ số Khát Vọng (Ambition)',
        effect: {
          karmaDelta: { ambition: 2.5 },
          moneyDelta: 35000,
          reactionNarrative: 'Công thức mới lạ hứa hẹn sẽ bùng nổ doanh số khi giới trẻ Sài Gòn luôn săn lùng hương vị độc lạ!'
        }
      }
    ],
    requirements: {
      minDay: 4,
      minKarma: { craftsmanship: 2 }
    },
    oneShot: true
  },
  {
    id: 'storylet_night_05_police_patrol',
    title: 'Ngọn Đèn Tuần Đêm An Bình',
    characterId: 'char_25_police_nam',
    characterName: 'Đồng Chí Nam Cảnh Sát',
    characterAvatar: '👮',
    characterRole: 'Cảnh Sát Khu Vực Hẻm 1102',
    setting: 'Đầu hẻm 1102 giao lộ đường lớn · Tiếng bước chân tuần tra đều đặn',
    narrativeLines: [
      'Đồng chí Nam chỉnh lại chiếc mũ cối, chiếc đèn pin rọi vào bảng hiệu tiệm gà đã tắt đèn gọn gàng.',
      '"Quầy xe đẩy của đồng chí thu dọn rất ngăn nắp, không lấn chiếm lòng lề đường, dầu mỡ cũng đổ đúng thùng rác kín.',
      'Dạo này đêm hôm có vài đối tượng lạ mặt dòm ngó xe cộ trong hẻm, quán buôn bán nhớ khóa cửa cẩn thận nghen."'
    ],
    choices: [
      {
        id: 'opt_police_thank',
        label: 'Cảm ơn đồng chí Nam đã thức trắng đêm giữ bình yên cho xóm',
        kicker: 'Ý THỨC CÔNG DÂN',
        subDesc: 'Gắn kết chính quyền địa phương, quán được bảo vệ an ninh tuyệt đối',
        effect: {
          karmaDelta: { community: 1.5, ambition: 0.5 },
          reputationDelta: 0.2,
          reactionNarrative: 'Đồng chí Nam mỉm cười chào thân thiện: "Bà con yên tâm buôn bán làm ăn, có tụi tôi tuần tra trực chiến thường xuyên!"'
        }
      },
      {
        id: 'opt_police_clean_pledge',
        label: 'Cam kết duy trì chuẩn vệ sinh môi trường & an toàn cháy nổ',
        kicker: 'CHUẨN MỰC KINH DOANH',
        subDesc: 'Tăng Craftsmanship & An toàn thực phẩm',
        effect: {
          karmaDelta: { craftsmanship: 2.0 },
          reactionNarrative: 'Biên bản kiểm tra an toàn trật tự ghi nhận tiệm đạt loại Xuất Sắc, không một lời phàn nàn.'
        }
      }
    ],
    requirements: {
      minDay: 5,
      cleanOilStreak: 2
    },
    oneShot: true
  },
  {
    id: 'storylet_night_06_lottery_lady_debt',
    title: 'Những Tờ Vé Số Cuối Ngày',
    characterId: 'char_02_lottery_lady',
    characterName: 'Cô Bảy Bán Vé Số',
    characterAvatar: '👵',
    characterRole: 'Người Mưu Sinh Hẻm Sâu',
    setting: 'Bậc tam cấp trước tiệm · Ánh sáng mờ từ chiếc nón lá rách vành',
    narrativeLines: [
      'Gần nửa đêm, Cô Bảy mới lết đôi dép tổ ong mòn vẹt về đến đầu hẻm. Trên tay vẫn còn xấp vé số gần mười tờ chưa bán hết.',
      'Đôi mắt đục ngầu vì năm tháng lo âu nhìn vào xấp vé, nếu không trả kịp đại lý trước sáng mai coi như mất đứt cả ngày công cơm áo.',
      'Cô đứng ngập ngừng trước cửa tiệm gà, ngượng ngùng không dám mở lời xin giúp đỡ.'
    ],
    choices: [
      {
        id: 'opt_buy_all_lottery',
        label: 'Ủng hộ cô trọn 5 tờ vé số cuối cùng (50.000đ) & gửi thêm hộp cơm nóng',
        kicker: 'TẤM LÒNG NGHĨA HIỆP',
        subDesc: 'Tiêu 50k, nhận phúc đức xóm giềng và cơ hội trúng thưởng may mắn',
        effect: {
          karmaDelta: { community: 3.0 },
          moneyDelta: -50000,
          reputationDelta: 0.25,
          reactionNarrative: 'Cô Bảy mừng rỡ rơm rớm nước mắt, chắp tay cảm ơn rối rít: "Trời Phật phù hộ cho tiệm của con buôn may bán đắt, khách nườm nượp quanh năm nghen con!"'
        }
      },
      {
        id: 'opt_gentle_water',
        label: 'Mời cô uống ly nước chanh ấm và động viên cô nghỉ ngơi',
        kicker: 'LỜI HỎI THĂM CHÂN TÌNH',
        subDesc: 'Tăng Community nhẹ nhàng, giữ gìn vốn liếng quán',
        effect: {
          karmaDelta: { community: 1.0 },
          reactionNarrative: 'Cô Bảy cảm ơn tấm lòng thơm thảo của bạn, nở nụ cười hiền hậu trước khi rẽ vào căn nhà trọ cuối hẻm.'
        }
      }
    ],
    requirements: {
      minDay: 6,
      minMoney: 100000
    },
    oneShot: true
  }
];
