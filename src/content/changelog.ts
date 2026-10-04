export interface ChangelogItem {
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  details: string[];
}

export interface ChangelogRelease {
  version: string;
  codename: string;
  releaseDate: string;
  isLatest: boolean;
  highlightSummary: string;
  metrics: {
    label: string;
    value: string;
    icon: string;
  }[];
  categories: {
    categoryName: string;
    categoryIcon: string;
    items: ChangelogItem[];
  }[];
}

export const CURRENT_GAME_VERSION = 'v1.1';
export const CURRENT_VERSION_CODENAME = 'Pixel Art Sài Gòn Retro 90s: Đồng Bộ Toàn Diện Asset Game, Nút Tua Nhanh 2X Thuần Sprite, Ẩn Sốt Vàng & Tái Thiết Kế Ca Bán';
export const CURRENT_BUILD_DATE = '04/10/2026';

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: 'v1.1',
    codename: 'Pixel Art Sài Gòn Retro 90s: Đồng Bộ Toàn Diện Asset Game, Nút Tua Nhanh 2X Thuần Sprite, Ẩn Sốt Vàng & Tái Thiết Kế Ca Bán',
    releaseDate: '04/10/2026',
    isLatest: true,
    highlightSummary: 'Bản cập nhật v1.1 đánh dấu bước chuyển mình toàn diện về thị giác và trải nghiệm Game Feel: Thay thế 100% emoji thô bằng bộ 18+ asset pixel art 16-bit độc bản chuẩn phong cách Sài Gòn Retro 90s (cozy Stardew Valley); Nút Tua Nhanh 1X/2X thuần sprite arcade nổi tự nhiên trên HUD, xóa bỏ hoàn toàn lớp nền layer lót và chữ thừa; Ẩn chữ Sốt Vàng giúp quầy bếp tinh gọn; Tái thiết kế toàn bộ 4 ca bán (Trưa, Chiều, Tối, Đêm & Cao Điểm) với template thống nhất và icon thời gian sống động!',
    metrics: [
      { icon: '🎨', label: 'Pixel Art Icons', value: '18+ Asset Tự Thiết Kế' },
      { icon: '⚡', label: 'Nút Tua Nhanh', value: 'Thuần Sprite 1X/2X' },
      { icon: '🍲', label: 'Tối Giản Quầy Bếp', value: 'Ẩn Chữ Sốt Vàng' },
      { icon: '⏰', label: 'Ca Bán Thời Khắc', value: '4 Ca + Cao Điểm' },
      { icon: '🔊', label: 'Web Audio API', value: 'Phục Hồi SFX Toàn Diện' },
      { icon: '📱', label: 'Chuẩn 1 Ngón Cái', value: 'Touch Target ≥ 44px' }
    ],
    categories: [
      {
        categoryName: 'Thay Thế Toàn Diện Emoji Bằng Asset Pixel Art Thuần Việt',
        categoryIcon: '🎨',
        items: [
          {
            tag: 'PIXEL ART ASSETS',
            tagColor: '#10b981',
            title: 'Bộ Asset Pixel Art 16-Bit Tự Thiết Kế Độc Quyền',
            desc: 'Dọn sạch hoàn toàn emoji hệ thống trên toàn bộ các bề mặt tương tác quan trọng, thay bằng ảnh pixel art 16-bit sắc nét 64x64 nền trong suốt:',
            details: [
              'Biển hiệu gỗ Bác Ba (icon_wooden_sign.png) và bóng đèn dây tóc retro (icon_lightbulb_retro.png) trên màn hình khởi nghiệp.',
              'Bọt biển & xà phòng (icon_sponge_soap.png) cho hành động lau chùi bàn gỗ hiên quán.',
              'Robot phụ bếp bằng đồng (icon_helper_bot.png) và vương miện khách VIP (icon_crown_vip.png).',
              'Còi báo động (icon_alarm_siren.png) và bàn tay bắt trộm (icon_hand_catch.png) trong sự kiện kẻ gian đột nhập.',
              'Làn khói chảo & đĩa nóng (icon_smoke_puff.png) cùng cảnh báo chảo khét (icon_burnt_alert.png).'
            ]
          },
          {
            tag: 'HUD STREAMLINE',
            tagColor: '#f59e0b',
            title: 'Nút Tăng Tốc Độ Thuần Sprite & Ẩn Chữ Sốt Vàng',
            desc: 'Thiết kế lại toàn bộ thanh HUD quầy bếp chuẩn tối giản:',
            details: [
              'Nút #btn-toggle-fast trong suốt 100%, chỉ hiển thị trực tiếp ảnh sprite pixel art 1X (vàng caramel) và 2X (đỏ cam bốc lửa), không còn bất kỳ viền hộp hay chữ thừa nào.',
              'Ẩn hoàn toàn nhãn chữ "Sốt Vàng" trên HUD theo yêu cầu người dùng, giữ nguyên 100% hiệu ứng buff tiền thưởng ngầm khi bán hàng.'
            ]
          }
        ]
      },
      {
        categoryName: 'Tái Thiết Kế 4 Ca Bán Thời Gian & Môi Trường Hẻm 1102',
        categoryIcon: '⏰',
        items: [
          {
            tag: 'SHIFT REDESIGN',
            tagColor: '#3b82f6',
            title: 'Template Mẫu Bán Hàng Thống Nhất Không Layer Hộp Lót',
            desc: 'Loại bỏ hoàn toàn lớp nền hộp đen mờ và viền container, dùng chung một template cấu trúc thanh thoát [Icon Pixel] [Tên Ca] · [Mô tả Hẻm]:',
            details: [
              'Ca Trưa (10:00 - 13:00): Icon mặt trời ấm (icon_shift_noon.png) · Nắng Vàng Giòn Rụm.',
              'Ca Chiều (13:00 - 17:00): Icon nắng xế hoàng hôn (icon_shift_afternoon.png) · Nắng Xế Hoàng Hôn.',
              'Ca Tối (17:00 - 19:30): Icon trăng khuyết & đèn phố (icon_shift_evening.png) · Phố Lên Đèn.',
              'Ca Đêm (19:30 - 21:00): Icon trăng bạc & sao khuya (icon_shift_night.png) · Trăng Sao Tĩnh Lặng.',
              'Ca Cao Điểm (Rush Hours): Icon lửa rực cháy (icon_fire_rush.png) · Khách Tấp Nập với hiệu ứng nhịp thở nhẹ nhàng.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v3.2.0',
    codename: 'Game Feel & Visual Juice: Bộ Emote Pixel Tự Thiết Kế, Khói Đĩa Nóng & Thú Cưng Hiên Quán',
    releaseDate: '03/10/2026',
    isLatest: false,
    highlightSummary: 'Bản nâng cấp Game Feel & Visual Juice toàn diện: Bộ 6 bóng thoại Emote 16-bit pixel nghệ thuật tự thiết kế riêng bằng AI (Yum, Sweat, Anger, Heart, Sủa mừng, Kêu meo meo); Làn khói nóng bốc lên từ 4 ô đĩa sứ gốm nung men ngà; Chùm hạt vàng kim lấp lánh khi chiên đạt Vàng Giòn Perfect; Quỹ đạo tiền bán & tiền bo bay parabol uốn lượn mượt mà về Header; Tương tác chạm cưng nựng Chó Cỏ Vàng & Mèo Mướp Tam Thể hiên quán!',
    metrics: [
      { icon: '💬', label: 'Emote Pixel AI', value: '6 Emote Độc Quyền' },
      { icon: '♨️', label: 'Khói Đĩa Nóng', value: '3 Làn Hơi Tự Nhiên' },
      { icon: '✨', label: 'Vàng Giòn Perfect', value: 'Chùm Tia Vàng Kim' },
      { icon: '🪙', label: 'Quỹ Đạo Bay', value: 'Parabola Mượt Mà' },
      { icon: '🐕', label: 'Chó Cỏ Vàng', value: 'Vẫy Đuôi Sủa Mừng' },
      { icon: '🐈', label: 'Mèo Mướp', value: 'Vươn Vai Thả Tim' }
    ],
    categories: [
      {
        categoryName: 'Visual Juice & Emote Pixel Stardew Tự Thiết Kế',
        categoryIcon: '💬',
        items: [
          {
            tag: 'CUSTOM ASSETS',
            tagColor: '#10b981',
            title: 'Bộ 6 Emote Pixel 16-bit Tự Thiết Kế Độc Quyền',
            desc: 'Thay thế hoàn toàn emoji hệ thống thông thường bằng ảnh pixel art 16-bit phong cách Stardew Valley tách nền trong suốt cực sắc nét:',
            details: [
              'Emote Ngon Miệng (emote_yum.png): Mặt cười tít mắt liếm môi cùng đùi gà vàng ruộm tỏa hào quang.',
              'Emote Toát Mồ Hôi (emote_sweat.png): Mặt bối rối lo lắng với giọt mồ hôi xanh ngọc rỏ giọt khi khách đợi lâu.',
              'Emote Tức Giận (emote_anger.png): Mặt đỏ bừng bốc khói hai tai kèm ký hiệu tĩnh mạch nổi giận khi kiên nhẫn cạn kiệt.',
              'Emote Trái Tim (emote_heart.png): Trái tim hồng ngọc pixel lấp lánh khi phục vụ khách VIP, Thỏ Cam hay hoàn thành đơn xuất sắc.',
              'Emote Chó Sủa (emote_dog_bark.png): Đầu Chó Vàng hớn hở kèm dấu chân cún và nốt nhạc vui nhộn.',
              'Emote Mèo Meo Meo (emote_cat_purr.png): Mèo Mướp cuộn tròn ngủ trưa với bóng tim và ký hiệu zzz êm đềm.'
            ]
          },
          {
            tag: 'VISUAL JUICE',
            tagColor: '#f59e0b',
            title: 'Làn Khói Đĩa Nóng & Hào Quang Vàng Giòn Perfect',
            desc: 'Cảm giác nấu nướng và bày món chân thực, kích thích thị giác tối đa:',
            details: [
              'Khói bốc nghi ngút (.plate-steam-particles): Từng cuộn hơi nóng bốc lên mờ ảo từ các món chiên rán vừa vớt lên 4 đĩa sứ.',
              'Hạt sáng vàng kim (.perfect-sparkles-burst): Khi món ăn chạm chuẩn xác mốc Vàng Giòn (Perfect 100%), chảo gang bừng sáng các ngôi sao kim tuyến vàng lấp lánh.'
            ]
          },
          {
            tag: 'ECONOMY FX',
            tagColor: '#3b82f6',
            title: 'Quỹ Đạo Tiền Bán & Tiền Bo Bay Parabol',
            desc: 'Hiệu ứng nhận tiền bay cong mượt mà theo đường cong Bezier về góc trên Header kèm âm thanh rổn rảng vui tai, tạo dopamine cao khi hoàn thành đơn.',
            details: [
              'Quỹ đạo parabol uốn lượn: Tiền bán (+Xđ) và tiền bo (+Yđ tip) bay từ vị trí phục vụ về thẳng widget ngân khố trên Header.',
              'Âm thanh procedual đồng xu leng keng cùng hiệu ứng lấp lánh khi tiền đáp xuống ví.'
            ]
          }
        ]
      },
      {
        categoryName: 'Tương Tác Thú Cưng Hiên Quán Hẻm 1102',
        categoryIcon: '🐾',
        items: [
          {
            tag: 'PET INTERACTION',
            tagColor: '#8b5cf6',
            title: 'Chạm Vào Chó Vàng & Mèo Mướp Để Cưng Nựng',
            desc: 'Hiên quán luôn sinh động với hai cư dân 4 chân đáng yêu của Hẻm 1102:',
            details: [
              'Chạm vào Chó Vàng (#btn-alley-pet-dog): Cún hớn hở vẫy đuôi, sủa "Gâu gâu! Chúc tiệm đắt khách!" kèm bóng thoại pixel.',
              'Chạm vào Mèo Mướp (#btn-alley-pet-cat): Mèo lười biếng vươn vai kêu "Meo meo~" thả tim chúc buôn may bán đắt.',
              'Huy hiệu "Tri Kỷ" gắn nơ hồng và chuông vàng khi người chơi hoàn thành nhận nuôi.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v3.1.0',
    codename: 'Sài Gòn Bistro, Khách Quen Hẻm 1102 & Khẩu Vị Ruột',
    releaseDate: '03/10/2026',
    isLatest: false,
    highlightSummary: 'Bước chuyển mình rực rỡ sang phong cách Sài Gòn Retro Bistro: Giọng nói Bác Ba Nam Bộ tương tác chạm; Đại tu khay ra món đĩa gốm sứ 4 ô men ngà; Tinh giản tên món và badge số lượng chống tràn; Mở rộng quầy sơ chế 12 khay cân đối; Hệ thống Khách Quen Hẻm 1102 tích lũy 5 cấp tim thân thiết với Khẩu Vị Ruột tặng Tip khủng & Bưu Kiện Quà Quê mỗi sáng; Phòng Lưu Niệm Ký Ức Hẻm 1102 & Cao Trào Tuyến Truyện Visual Novel!',
    metrics: [
      { icon: '💖', label: 'Khách Quen', value: '5 Cấp Tim Tri Kỷ' },
      { icon: '🎁', label: 'Bưu Kiện Quà', value: 'Tiếp Tế Mỗi Sáng' },
      { icon: '🍱', label: 'Quầy Sơ Chế', value: '12 Khay Cân Đối' },
      { icon: '👴', label: 'Tiếng Bác Ba', value: 'Web Audio Voice' },
      { icon: '🏛️', label: 'Phòng Lưu Niệm', value: 'Bảo Tàng Ký Ức' },
      { icon: '🍽️', label: 'Sài Gòn Bistro', value: 'Đĩa Sứ Gốm Ấm' }
    ],
    categories: [
      {
        categoryName: 'Khách Quen Hẻm 1102 & Khẩu Vị Ruột',
        categoryIcon: '💖',
        items: [
          {
            tag: 'ALLEY LOYALTY',
            tagColor: '#ec4899',
            title: 'Hệ Thống 5 Cấp Tim Thân Thiết Cư Dân',
            desc: 'Gắn kết tình làng nghĩa xóm sâu sắc với 12 cư dân Hẻm 1102:',
            details: [
              'Tích lũy điểm thân thiết qua mỗi lần ghé quán: Khách Vãng Lai (1★) → Khách Quen (2★) → Bạn Tâm Giao (3★) → Ruột Thịt Hẻm (4★) → Tri Kỷ Muôn Đời (5★).',
              'Khách gửi Bưu Kiện Quà Quê tiếp tế tiền vốn và nguyên liệu tươi ngon vào đầu ngày mới.'
            ]
          },
          {
            tag: 'DIETARY ORDERS',
            tagColor: '#f59e0b',
            title: 'Phục Vụ Đúng Khẩu Vị Ruột & Tip Khủng',
            desc: 'Mỗi cư dân có sở thích ăn uống và dặn dò riêng biệt:',
            details: [
              'Thẻ order hiển thị pill dặn dò khẩu vị ruột (ít đá, nhiều sốt, chiên kỹ...) với hiệu ứng nhấp nháy êm dịu.',
              'Phục vụ đúng gu ruột thưởng ngay tiền Tip hậu hĩnh và tăng vọt điểm thân thiết.'
            ]
          }
        ]
      },
      {
        categoryName: 'Đại Tu Giao Diện Sài Gòn Retro Bistro',
        categoryIcon: '🎨',
        items: [
          {
            tag: 'CERAMIC DISHES',
            tagColor: '#d97706',
            title: 'Đĩa Gốm Sứ Men Ngà Thay Vỉ Kim Loại',
            desc: 'Thay thế hoàn toàn khay kim loại công nghiệp bằng đĩa sứ gốm nung men ngà ấm áp:',
            details: [
              'Bố cục 4 ô đĩa sứ (2x2) men ngà viền đất nung thủ công, hiển thị món ăn ngon mắt.',
              'Gỡ bỏ hoàn toàn 2 chai tương cà/ớt rườm rà, tập trung trọn vẹn vào nghệ thuật chiên gà.'
            ]
          },
          {
            tag: 'PREP 12 TRAYS',
            tagColor: '#10b981',
            title: 'Lấp Đầy 12 Khay Sơ Chế Phủ Kín Quầy Bếp',
            desc: 'Mở rộng bố cục 2 hàng × 6 khay cân đối, chuẩn bị cho tương lai phát triển quán:',
            details: [
              'Hàng trên: Củ cải muối, Salad bắp cải, Sốt cay ngọt, Sốt tỏi tương, Nồi mì Ý, Lò nướng.',
              'Hàng dưới: Gà truyền thống, Đùi góc tư, Khoai tây, Gà viên, Phô mai que, Bàn ráp Burger.'
            ]
          },
          {
            tag: 'BAC BA AUDIO',
            tagColor: '#6366f1',
            title: 'Tiếng Bác Ba Nam Bộ Thật & Âm Thanh Bistro',
            desc: 'Nạp âm thanh WAV thật của Bác Ba tổ trưởng qua Web Audio API:',
            details: [
              'Tự động resume audio context ngay tại cử chỉ chạm đầu tiên; chạm Bác Ba ở Title Screen để nghe tiếng chào ấm áp.',
              'Bộ font chữ Cozy Bistro Tiny5 Duo + Baloo 2 + Be Vietnam Pro chuẩn hóa 100% tiếng Việt không lỗi dấu.'
            ]
          }
        ]
      },
      {
        categoryName: 'Phòng Lưu Niệm & Tuyến Truyện Cao Trào',
        categoryIcon: '🏛️',
        items: [
          {
            tag: 'MEMORY GALLERY',
            tagColor: '#8b5cf6',
            title: 'Bảo Tàng Ký Ức & Xem Lại Đại Kết Cục',
            desc: 'Nơi lưu giữ toàn bộ hành trình lập nghiệp tại Hẻm 1102:',
            details: [
              'Xem lại các Đại Kết Cục đã chinh phục, album thư Thỏ Cam và các mốc bằng khen đạt được.',
              'Cao trào Hồi 4 & Hồi 5 trong Ký Sự Cư Dân gắn kết với các chỉ số ngầm Karma.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.9.0',
    codename: 'Smart Order Sorting, Quầy Khách Rộng Rãi, Fanta Cam & Bàn Ăn Pixel Art',
    releaseDate: '03/10/2026',
    isLatest: false,
    highlightSummary: 'Tối ưu trải nghiệm thao tác đỉnh cao cho người chơi: Sắp xếp đơn hàng thông minh đưa món chưa làm xong lên trên đầu danh sách, tự động thu gọn món đã xong dạng chip để không bao giờ bị trôi món làm mất khách; Mở rộng hàng đợi khách cho phép đọc trọn vẹn thông tin; Mở khóa Fanta Cam ngay từ Chương 1 giúp máy rót 3 vòi hoạt động đầy đủ; Dời thời tiết lên Header dạng mini pixel badge và lược bỏ biển hiệu vỉa hè thừa; Thay thế hoàn toàn ghế emoji bằng bàn ghế gỗ mộc Pixel Art retro Stardew Valley kèm animation nhai thức ăn và hơi khói ấm nóng!',
    metrics: [
      { icon: '📋', label: 'Order Sorting', value: 'Món Chưa Xong Lên Đầu' },
      { icon: '🥤', label: 'Fanta Cam', value: 'Mở Ngay Ngày 1' },
      { icon: '🚶', label: 'Hàng Đợi Khách', value: 'Mở Rộng 176px (+16px)' },
      { icon: '🪑', label: 'Pixel Patio', value: 'Bàn Ghế Gỗ Mộc Stardew' },
      { icon: '☀️', label: 'Header Weather', value: 'Pixel Badge Tiết Kiệm Chỗ' },
      { icon: '🧪', label: 'Kiểm Định', value: '714 Tests PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Thao Tác Ca Bán & Giao Món Thông Minh',
        categoryIcon: '📋',
        items: [
          {
            tag: 'SMART SORTING',
            tagColor: '#ea580c',
            title: 'Tự Động Đẩy Món Chưa Xong Lên Trên Cùng',
            desc: 'Giải quyết triệt để vấn đề khách gọi nhiều món khiến món chưa làm bị trôi xuống dưới đáy ticket:',
            details: [
              'Toàn bộ món chưa hoàn thành (pending items) luôn được ưu tiên nổi lên trên đầu danh sách, hiển thị to rõ kèm số lượng và trạng thái khay.',
              'Món đã giao đủ (completed items) tự động thu gọn thành dải chip mini màu xanh bạc hà mờ, tiết kiệm 80% diện tích và có hiệu ứng popIn trực quan.'
            ]
          },
          {
            tag: 'FANTA CAM CHƯƠNG 1',
            tagColor: '#f97316',
            title: 'Kích Hoạt Thực Khách Gọi Nước Ngọt Fanta Cam',
            desc: 'Khách đến quán giờ đây gọi đều đặn cả 3 vị nước ngọt có ga ngay từ Chương 1:',
            details: [
              'Chuyển fanta_orange từ Chương 2 về Chương 1 để đồng bộ hoàn toàn với máy rót nước ngọt 3 vòi (Cola, 7Up, Fanta) có sẵn tại quầy.',
              'Tự động cập nhật save game cũ giúp người chơi thấy khách gọi Fanta Cam ngay lập tức.'
            ]
          }
        ]
      },
      {
        categoryName: 'Giao Diện & Pixel Art Aesthetic',
        categoryIcon: '🎨',
        items: [
          {
            tag: 'CUSTOMER LANE',
            tagColor: '#2563eb',
            title: 'Nới Rộng Quầy Khách Chờ & Thẻ Khách',
            desc: 'Tăng diện tích hiển thị giúp thông tin khách hàng không còn bị che khuất:',
            details: [
              'Nới rộng chiều rộng thẻ khách từ 160px lên 176px và chiều cao lên 124px.',
              'Tên khách, huy hiệu VIP, Cư Dân Hẻm và phiếu order hiển thị thoáng đãng, sắc nét.'
            ]
          },
          {
            tag: 'PATIO PIXEL ART',
            tagColor: '#8b5a2b',
            title: 'Bàn Ghế Gỗ Mộc Stardew Valley & Hoạt Họa Khách Ăn',
            desc: 'Nâng cấp toàn diện mỹ thuật Bàn Ăn Hiên Quán:',
            details: [
              'Thay emoji ghế đơn sơ bằng Asset SVG Pixel Art bàn tròn gỗ sồi mộc mạc và 2 ghế đẩu retro Stardew Valley.',
              'Bổ sung hoạt họa khách gật gù nhai thức ăn (chewHeadBob), đĩa đồ ăn bốc khói ấm nóng (♨️) và lược bỏ text rườm rà.'
            ]
          },
          {
            tag: 'HEADER WEATHER',
            tagColor: '#d97706',
            title: 'Huy Hiệu Pixel Thời Tiết Trên Header',
            desc: 'Tiết kiệm không gian dọc màn hình bán hàng:',
            details: [
              'Dời dải thời tiết ca bán lên Header cạnh hiển thị Ngày, thiết kế mini badge pixel retro.',
              'Bỏ biển hiệu tên quán thừa ở quầy bán vì đã có tên quán hiển thị trang trọng trên Header.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.8.0',
    codename: 'Bác Ba Trợ Giá Can Dầu, Sổ Tay Bếp Trưởng & Kênh Góp Ý Tester',
    releaseDate: '03/10/2026',
    isLatest: false,
    highlightSummary: 'Nâng cấp toàn diện trải nghiệm End-to-End sẵn sàng phát hành thử nghiệm: Bác Ba trợ giá miễn phí 100% can dầu sạch đầu tiên ở Ngày 1-3 giúp người chơi mới không bao giờ bị nghẽn vốn; Tích hợp Sổ Tay Bếp Trưởng tra nhanh công thức món ngay trong ca bán; Hệ thống cảnh báo kho thông minh chống hao hụt nguyên liệu hết hạn; Bảng hiệu mặt tiền cá nhân hóa tên quán; Hoạt họa chụp ảnh check-in sống ảo tại bàn hiên quán; và Kênh Góp Ý & Báo Lỗi Tester ngay trong phần Cài đặt!',
    metrics: [
      { icon: '🛢️', label: 'Trợ Giá Bác Ba', value: 'Miễn Phí Can Dầu 100%' },
      { icon: '📖', label: 'Sổ Tay Bếp', value: 'Tra Nhanh Công Thức' },
      { icon: '⚠️', label: 'Cảnh Báo HSD', value: 'Smart Spoilage Alert' },
      { icon: '📸', label: 'Check-in Hiên', value: 'Flash & Bubble Sống Động' },
      { icon: '💬', label: 'Kênh Tester', value: 'Đánh Giá & Chép Save' },
      { icon: '🧪', label: 'Kiểm Định', value: '701+ Tests PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Kinh Tế & Kho Hàng Thông Minh',
        categoryIcon: '🛢️',
        items: [
          {
            tag: 'TRỢ GIÁ BÁC BA',
            tagColor: '#16a34a',
            title: 'Tặng 1 Can Dầu Sạch Miễn Phí (0đ) Tân Thủ',
            desc: 'Bảo đảm người chơi mới trong Ngày 1 đến Ngày 3 không bao giờ rơi vào bế tắc kinh tế khi dầu chiên bị bẩn:',
            details: [
              'Lần đầu tiên chảo dầu bị bẩn hoặc cần thay ở Ngày 1-3, Bác Ba xuất hiện trợ giá 100% (miễn phí 150.000đ).',
              'Nút thay dầu hiển thị nhãn "0k 🎁" trực quan và giải tỏa áp lực vốn cho người mới làm quen.'
            ]
          },
          {
            tag: 'KHO THÔNG MINH',
            tagColor: '#dc2626',
            title: 'Cảnh Báo Lô Hàng Hạn Hôm Nay (Smart Spoilage Alert)',
            desc: 'Giúp người chơi quản lý kho FIFO chặt chẽ và không bị mất tiền oan vì nguyên liệu hỏng:',
            details: [
              'Thẻ nguyên liệu có lô còn hạn 1 ngày sẽ hiển thị viền đỏ và huy hiệu nhấp nháy "⚠️ Hạn hôm nay!".',
              'Gợi ý người chơi ưu tiên dùng hoặc bấm nút "-5" hoàn trả lại đại lý thu hồi vốn.'
            ]
          }
        ]
      },
      {
        categoryName: 'Trải Nghiệm Màn Bán Hàng & Bảng Hiệu Cá Nhân Hóa',
        categoryIcon: '🍗',
        items: [
          {
            tag: 'SỔ TAY BẾP',
            tagColor: '#b45309',
            title: 'Sổ Tay Bếp Trưởng Mở Nhanh Trong Ca Bán',
            desc: 'Tra cứu nhanh gọn bí quyết chiên gà chuẩn 5 sao:',
            details: [
              'Nút 📖 Sổ Tay bố trí tiện tay trên thanh HUD ca bán, chạm để mở cẩm nang tóm tắt.',
              'Hướng dẫn vùng nhiệt Perfect vàng giòn, cách ướp sốt cay, sốt bơ tỏi và tác dụng rót nước giải khát.'
            ]
          },
          {
            tag: 'CÁ NHÂN HÓA',
            tagColor: '#9333ea',
            title: 'Bảng Hiệu Hiên Quán & Khách Check-in Sống Ảo',
            desc: 'Mang đậm hơi thở phố thị Sài Gòn:',
            details: [
              'Biển hiệu vỉa hè Hẻm 1102 tự động khắc tên quán người chơi đặt trong Cài đặt.',
              'Khách ngồi bàn hiên quán thỉnh thoảng giơ điện thoại check-in chụp ảnh với hiệu ứng chớp flash và bong bóng 📸 sống động.'
            ]
          }
        ]
      },
      {
        categoryName: 'Kênh Góp Ý & Báo Lỗi Dành Cho Tester',
        categoryIcon: '💬',
        items: [
          {
            tag: 'TESTER FEEDBACK',
            tagColor: '#ca8a04',
            title: 'Góp Ý Trực Tiếp & Đính Kèm Mã Save',
            desc: 'Kênh kết nối trực tiếp giữa người chơi thử nghiệm và đội ngũ phát triển:',
            details: [
              'Chấm điểm trải nghiệm từ 1 đến 5 sao theo từng danh mục: Kinh tế, Đồ họa, Cốt truyện, Bug, Tính năng.',
              'Nút Chép Mã Save 1 chạm giúp tester dễ dàng chia sẻ file save để dev tái hiện và fix lỗi tức thì.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.7.0',
    codename: 'Hiên Quán Bàn Ăn Tại Chỗ (Dine-In Patio) & Giám Khảo Ẩm Thực VIP Khó Tính',
    releaseDate: '03/10/2026',
    isLatest: false,
    highlightSummary: 'Đột phá chiều sâu trải nghiệm quán gà với 2 trụ cột gameplay mới toanh: Mở rộng Góc Bàn Ăn Hiên Quán (Dine-In Patio Tables) cho thực khách nán lại thưởng thức món ăn nóng hổi, đếm ngược thời gian và để lại cọc tiền tip vàng rực kèm thao tác dọn bàn 1 ngón cái; đồng thời diện kiến dàn Giám Khảo Ẩm Thực VIP Khó Tính (Food Critic Bosses) với những yêu cầu chế biến khắt khe thử thách bản lĩnh tay nghề chiên gà Vàng Kim thượng hạng!',
    metrics: [
      { icon: '🪑', label: 'Bàn Ăn Hiên Quán', value: '3 Bàn Độc Lập' },
      { icon: '🧐', label: 'Giám Khảo VIP', value: 'Thẩm Định Khắt Khe' },
      { icon: '🧹', label: 'Dọn Bàn & Thu Tip', value: 'Touch Target 44px' },
      { icon: '💵', label: 'Thưởng Vàng', value: 'Tip Tới +45.000đ' },
      { icon: '⚡', label: 'Tốc Độ Tự Hành', value: '200 Ngày Bền Bỉ' },
      { icon: '🧪', label: 'Kiểm Định', value: '701 Tests PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Góc Bàn Ăn Hiên Quán (Dine-In Patio Tables)',
        categoryIcon: '🪑',
        items: [
          {
            tag: 'DINE-IN PATIO',
            tagColor: '#ea580c',
            title: 'Không Gian Thưởng Thức Món Ăn Tại Chỗ',
            desc: 'Khách ghé tiệm giờ đây không chỉ mua mang về mà còn có thể chọn ngồi lại hiên quán:',
            details: [
              'Khu vực 3 bàn ăn hiên quán phong cách retro bố trí gọn gàng phía trên quầy gọi món, không che lấp tầm nhìn.',
              'Trạng thái bàn ăn linh hoạt: Sạch sẽ chờ khách ➔ Khách ngồi thưởng thức (avatar tròn, bong bóng gặm đùi gà thơm ngon 😋) ➔ Đĩa sạch để lại cọc tiền tip vàng rực.',
              'Thao tác dọn bàn chuẩn công thái học: Nút Dọn Bàn đạt chuẩn ≥ 44px, chạm để bỏ túi tiền tip từ 2.000đ đến 15.000đ+.'
            ]
          }
        ]
      },
      {
        categoryName: 'Dàn Giám Khảo Ẩm Thực VIP Khó Tính (Food Critic Bosses)',
        categoryIcon: '🧐',
        items: [
          {
            tag: 'VIP CRITIC',
            tagColor: '#9333ea',
            title: 'Thử Thách Tay Nghề & Tiêu Chí Chế Biến Khắt Khe',
            desc: 'Các chuyên gia thẩm định ẩm thực và nhân vật tầm cỡ bất ngờ ghé thăm Hẻm 1102:',
            details: [
              'Thẻ khách viền tím phát quang lộng lẫy (.critic-card), huy hiệu ⭐ PHÊ BÌNH và bong bóng suy nghĩ nghiêm khắc.',
              'Cơ chế đánh giá thưởng phạt công bằng: Gà cháy khét lập tức bị trừ sạch 0đ tip; Gà chín thường chỉ nhận 3.000đ nhắc nhở; Gà chiên Vàng Giòn chuẩn Perfect thưởng khủng 35.000đ - 45.000đ+ và lời khen 5 sao nức nở!',
              'Thoại ngữ cảnh độc quyền cho Giám Khảo Ẩm Thực, phản ánh chính xác từng mẻ chiên của người chơi.'
            ]
          }
        ]
      },
      {
        categoryName: 'Tiến Hóa Test Bot & Độ Ổn Định 200 Ngày',
        categoryIcon: '🤖',
        items: [
          {
            tag: 'LOOP BOT',
            tagColor: '#16a34a',
            title: 'Test Bot Tự Động Nhận Diện & Dọn Bàn',
            desc: 'Nâng cấp toàn diện kịch bản test bot tự hành theo chuẩn Loop Engineering:',
            details: [
              'Dạy bot tự động dọn bàn (.btn-clean-table) và giải phóng chỗ ngồi trong cả chu trình thường và cấp cứu.',
              'Bộ kiểm thử Vitest nâng lên 61 files với 701/701 tests PASS 100%.',
              'Vite Production Build sạch 0 lỗi TypeScript, UI Check đạt 16/16 checks trên 360px & 390px.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.6.0',
    codename: 'Bếp Nấu Thủ Công Cozy 16-Bit & Trị Dứt Điểm Cắt Cụt Thông Tin (Zero Truncation)',
    releaseDate: '02/10/2026',
    isLatest: false,
    highlightSummary: 'Đột phá mỹ thuật và trải nghiệm người dùng với bản nâng cấp toàn diện Bếp Nấu Thủ Công Cozy 16-bit Pixel Art: Mặt quầy gỗ tếch đầm ấm, chảo gang đúc ngập dầu sủi bọt chân thực, trạm máy rót nước 3 cần gạt phong cách retro diner và mẹt tre lót giấy sáp ca-rô cổ điển. Đồng thời trị dứt điểm 100% tình trạng che khuất và cắt cụt chữ (Zero Truncation) trên toàn bộ màn hình bán hàng, đảm bảo avatar khách hàng và tên món ăn luôn hiển thị trọn vẹn, sắc nét!',
    metrics: [
      { icon: '🍳', label: 'Bếp Thủ Công', value: 'Cozy Pixel 16-Bit' },
      { icon: '📐', label: 'Cắt Cụt Chữ', value: '0% Truncation' },
      { icon: '👤', label: 'Avatar Khách', value: '100% Lộ Diện Rõ' },
      { icon: '🪧', label: 'Khay Sơ Chế GN', value: 'Inox Dập Nổi 3D' },
      { icon: '🔔', label: 'Chuông Ra Món', value: 'Chuông Đồng KENG' },
      { icon: '🧪', label: 'Kiểm Định', value: '691 Tests Vitest 100%' }
    ],
    categories: [
      {
        categoryName: 'Đại Tu Không Gian Bếp Nấu Cozy 16-Bit Pixel Art',
        categoryIcon: '🍳',
        items: [
          {
            tag: 'COZY KITCHEN',
            tagColor: '#ea580c',
            title: 'Mặt Bếp Gỗ Tếch & Không Gian Nấu Nướng Ấm Cúng',
            desc: 'Thay thế hoàn toàn các khối ô vuông cơ bản bằng trạm bếp ấm áp mang đậm linh hồn quán nhỏ:',
            details: [
              'Mặt quầy bếp vân gỗ tếch tự nhiên (Teakwood Countertop) với thớ gỗ bóng bẩy, viền vát cạnh và đinh tán đồng ấm áp.',
              'Chảo chiên gang đúc sâu lòng (Cast-Iron Deep Fryer) ngập dầu vàng óng ánh sủi bọt tăm xèo xèo chân thực.',
              'Đồng hồ đo nhiệt độ kim cơ khí retro phân chia 3 vùng nhiệt: Quá nguội, Vàng giòn chuẩn xác, Quá lửa.',
              'Hệ thống hiệu ứng hơi nước bốc lên nghi ngút cùng ánh lửa rực rỡ khi thả gà rán.'
            ]
          },
          {
            tag: 'DINER STATION',
            tagColor: '#0284c7',
            title: 'Trạm Rót Nước 3 Cần Gạt & Mẹt Ra Món Gingham Ca-rô',
            desc: 'Trang bị trạm pha chế và bàn phục vụ thủ công phong cách retro hoài niệm:',
            details: [
              'Máy rót nước ngọt 3 cần gạt diner cổ điển với 3 hương vị: Trà Tắc Má Bảy, 7Up Băng Đậy và Fanta Cam Đá Xay.',
              'Mẹt tre ra món thủ công lót giấy sáp ca-rô đỏ trắng (Gingham Checkered Wax Paper) phong cách quán ăn hoài niệm.',
              'Chuông gọi phục vụ bằng đồng nguyên khối (Brass Service Bell) 3D dập nổi, phát hào quang vàng khi đủ món giao khách.'
            ]
          },
          {
            tag: 'GN PANS',
            tagColor: '#16a34a',
            title: 'Khay Inox Gastronorm Chuyên Nghiệp & Khóa Đồng Cổ',
            desc: 'Thiết kế lại 8 khay sơ chế nguyên liệu theo chuẩn bếp nhà hàng Gastronorm (GN Pan):',
            details: [
              'Khay inox phay xước viền kim loại 3D bo góc với đáy lõm phản quang chân thực.',
              'Huy hiệu xu đồng dập nổi hiển thị số lượng tồn kho sắc nét, không che lấp nguyên liệu.',
              'Nắp đậy kim loại phay xước đính ổ khóa đồng cổ điển cho các nguyên liệu chưa mở khóa.'
            ]
          }
        ]
      },
      {
        categoryName: 'Trị Dứt Điểm Cắt Cụt & Che Khuất Thông Tin (Zero Truncation)',
        categoryIcon: '👁️',
        items: [
          {
            tag: 'ZERO OVERLAP',
            tagColor: '#d97706',
            title: 'Giải Phóng 100% Tầm Nhìn Cho Avatar Thực Khách',
            desc: 'Khắc phục hoàn toàn lỗi dải ruy-băng "CHICKEN 1102" chắn ngang nửa người nhân vật:',
            details: [
              'Loại bỏ ribbon counter-welcome-mat chèn đè lên người diễn hoạt của thực khách.',
              'Toàn bộ 36 nhân vật và thú cưng Hẻm 1102 giờ đây lộ diện nguyên vẹn từ đầu đến chân với biểu cảm sống động.',
              'Bong bóng thoại và thanh kiên nhẫn hiển thị thoáng đãng, không bị va chạm hay chồng lấn.'
            ]
          },
          {
            tag: 'TYPO POLISH',
            tagColor: '#dc2626',
            title: 'Tự Động Xuống Dòng Thông Minh & Tối Ưu Độ Dài Nhãn',
            desc: 'Loại bỏ hoàn toàn dấu ba chấm cắt chữ (...) gây khó chịu trên màn hình hẹp 360px & 390px:',
            details: [
              'Huy hiệu đặc điểm và vai trò thực khách tự động ngắt dòng thông minh (flex-wrap), không bao giờ bị cắt cụt.',
              'Tên món ăn dài tự động co giãn và xuống dòng 2 dòng thanh thoát, giữ trọn vẹn từng chữ tiếng Việt có dấu.',
              'Chuẩn hóa nhãn khay sơ chế GN thành cụm từ 2 chữ súc tích: "Gà Tươi", "Củ Cải", "Khoai Cắt", "Má Đùi", "Gà Viên", "Phô Mai", "Sốt Cay", "Sốt Bơ Tỏi".',
              'Thông điệp hướng dẫn chảo chiên cô đọng, sinh động: "👉 Thả gà vào chiên", "🍗 Đang chiên giòn...", "⭐ VÀNG GIÒN! VỚT".'
            ]
          }
        ]
      },
      {
        categoryName: 'Độ Tin Cậy, Hiệu Năng & Nghiệm Thu Kép 3 Lớp',
        categoryIcon: '⚡',
        items: [
          {
            tag: 'QUALITY GATE',
            tagColor: '#7c3aed',
            title: 'Vượt Qua Tuyệt Đối Cả 3 Cổng Kiểm Định Khắt Khe',
            desc: 'Bảo đảm chất lượng phần mềm không tì vết trước khi đưa lên máy chủ sản xuất:',
            details: [
              '100% bộ kiểm thử Vitest PASS (691/691 tests trên 60 file kiểm thử cốt lõi).',
              'Biên dịch TypeScript Build nghiêm ngặt đạt 0 lỗi type checking và 0 cảnh báo.',
              'Bộ kiểm thử UI Automation (scripts/ui-check.mjs) đạt 16/16 chốt kiểm định PASS trên cả 2 độ phân giải chuẩn iPhone/Android (360×780px và 390×844px).',
              'Mọi nút bấm thao tác đạt chuẩn công thái học ngón cái (Touch Target ≥ 44px).'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.5.0',
    codename: 'Đại Trùng Tu Pixel Art: Hoài Niệm Stardew Valley & Typography Tiếng Việt Tuyệt Đối',
    releaseDate: '29/09/2026',
    isLatest: false,
    highlightSummary: 'Big Update đồ họa và trải nghiệm lớn nhất từ trước đến nay: Chuyển mình toàn diện sang phong cách Pixel Art 16-bit hoài niệm Stardew Valley! Bức tranh bìa & banner quầy xe Hẻm 1102 hoàn toàn mới từ Gemini AI, bộ font Tiny5 Duo / Tiny5 hỗ trợ 100% tiếng Việt chống lỗi font, 118 asset pixel sắc nét và âm thanh 16-bit acoustic ấm áp.',
    metrics: [
      { icon: '🎨', label: 'Bìa & Banner', value: 'Stardew 16-Bit' },
      { icon: '🔡', label: 'Font Tiếng Việt', value: '100% Không Lỗi' },
      { icon: '🍗', label: 'Asset Món & Bếp', value: '118 Pixel Thật' },
      { icon: '🎵', label: 'Âm Thanh Retro', value: '16-Bit Acoustic' },
      { icon: '⚡', label: 'Tốc Độ Khung Hình', value: '60-120 FPS' },
      { icon: '🧪', label: 'Kiểm Định', value: '476 Tests PASS' }
    ],
    categories: [
      {
        categoryName: 'Mỹ Thuật Pixel Art & Bìa Mở Đầu Stardew Valley',
        categoryIcon: '🎨',
        items: [
          {
            tag: 'COVER ART',
            tagColor: '#d97706',
            title: 'Tranh Bìa & Biển Gỗ Treo Hẻm 1102 Chuẩn Stardew Valley',
            desc: 'Được sáng tác bởi Gemini AI và inpaint tinh xảo từng pixel:',
            details: [
              'Khung cảnh Hẻm 1102 lúc hoàng hôn buông xuống ấm áp, lồng đèn đỏ và dây đèn tròn vàng rực rỡ.',
              'Cô chủ tiệm rạng rỡ bưng mẹt đùi gà rán vàng ươm, Bác Ba phúc hậu canh chảo dầu sôi bốc hơi nghi ngút.',
              'Bé Gà Bông linh vật đội nón bếp đứng cổ vũ trên quầy, bé Miu nằm ngủ ngoan trên ghế đẩu.',
              'Bảng hiệu gỗ mộc vát cạnh đính đinh tán vàng, dây xích sắt treo cổ điển: "TIỆM GÀ NHÀ TUI · HẺM 1102 · GIÒN RỤM".'
            ]
          },
          {
            tag: 'PIXEL ASSETS',
            tagColor: '#16a34a',
            title: 'Chuyển Đổi Toàn Diện 118 Asset Sang 16-Bit Pixel Thật',
            desc: 'Không còn nét vẽ vector mượt, toàn bộ thế giới Tiệm Gà Nhà Tui trở về phong cách đồ họa SNES:',
            details: [
              '36 Nhân vật & Pet cư dân Hẻm 1102 theo chuẩn pixel 48×48 sắc nét.',
              '22 Món ăn, đồ uống, sốt ướp theo chuẩn pixel 32×32 bóng bẩy giòn rụm.',
              'Toàn bộ thiết bị bếp: Chảo gang đúc dầu sôi phản quang, quầy khay GN inox, máy rót nước có đá viên pixel.',
              'Hệ thống nút bấm 3D pixel bevel lún phím êm ái khi chạm 1 ngón cái.'
            ]
          }
        ]
      },
      {
        categoryName: 'Hệ Thống Typography Pixel Chống Lỗi Font Tiếng Việt',
        categoryIcon: '🔡',
        items: [
          {
            tag: 'TYPOGRAPHY',
            tagColor: '#dc2626',
            title: 'Độ Phủ 100% Ký Tự Tiếng Việt — Không Bao Giờ Nhảy Font',
            desc: 'Khắc phục triệt để lỗi thiếu ký tự của các font pixel quốc tế cũ:',
            details: [
              'Tiny5 Duo: Chân chữ kép đậm 16-bit chuyên dụng cho Headings, Banner, Nút Bấm Hero và Bảng Giá.',
              'Tiny5 Regular: Nét đơn thanh thoát dễ đọc cho Lời Thoại Visual Novel, Nhật Ký Cốt Truyện và Review GenZ.',
              'VT323: Font Monospace CRT cổ điển cho Đồng Hồ Ca Bán và Số Tiền Cuối Ngày.',
              'Độ phủ tuyệt đối 148/148 nguyên âm có dấu (U+1EA0-1EF9), tự lưu trữ offline WOFF2 chỉ 25KB, không lo giật FOUT.'
            ]
          }
        ]
      },
      {
        categoryName: 'Gameplay: Đàm Phán Chợ Đầu Mối & Giao Đơn Xa',
        categoryIcon: '🛵',
        items: [
          {
            tag: 'CHỢ LỚN',
            tagColor: '#f59e0b',
            title: 'Minigame Đi Chợ Trả Giá (Chợ Lớn Bargaining)',
            desc: 'Gặp gỡ 3 tiểu thương Chợ Lớn (Cô Năm, Chú Bảy, Dì Tám) đầu ngày để mặc cả giá sỉ:',
            details: [
              '3 Chiến thuật đàm phán: Năn nỉ tình nghĩa (-15%), Cam kết số lượng lớn (-25%), Ép giá cứng rắn (-35%).',
              'Đàm phán thành công giúp giảm trực tiếp giá mua toàn bộ nguyên liệu trong ngày.'
            ]
          },
          {
            tag: 'EXPRESS',
            tagColor: '#0284c7',
            title: 'Minigame Chạy Xe Giao Đơn Xa (Hẻm 1102 Express)',
            desc: 'Thực khách ngoại khu đặt đơn gà lớn mang lại cơ hội kiếm tiền khủng:',
            details: [
              'Tự mình lái xe máy né ổ gà, rào chắn 3 làn trong 15s để nhận 100% tiền tip đậm (+35k-50k).',
              'Hoặc thuê shipper ngoài nhanh gọn an toàn với mức phí hợp lý 15.000đ.'
            ]
          },
          {
            tag: 'QOL',
            tagColor: '#8b5cf6',
            title: 'Thao Tác Kho Nhanh & Thanh Trượt Âm Lượng Riêng Biệt',
            desc: 'Nâng cấp trải nghiệm người dùng chuẩn game indie cao cấp:',
            details: [
              'Nhấn giữ nút +/- trong kho để mua/bán nguyên liệu nhanh với gia tốc tự động.',
              'Thanh trượt điều chỉnh âm lượng riêng biệt cho Nhạc Nền (BGM) và Âm Hiệu 16-bit (SFX) trong Cài Đặt.'
            ]
          }
        ]
      },
      {
        categoryName: 'Âm Thanh Retro & Tối Ưu Hiệu Năng 60-120 FPS',
        categoryIcon: '⚡',
        items: [
          {
            tag: 'AUDIO & FEEL',
            tagColor: '#7c3aed',
            title: 'Hệ Thống Âm Thanh 16-Bit Acoustic & Game Feel',
            desc: 'Mang bầu không khí thư thái chữa lành phong cách Pelican Town:',
            details: [
              'Âm thanh nhảy chữ typewriter blip khi nhân vật trò chuyện.',
              'Tiếng click gỗ mộc ấm áp, tiếng chuông vàng khải hoàn khi chốt ngày có lãi.',
              'Bong bóng cảm xúc Stardew Emote Bubbles (❤️, 💡, ❓, 💢, ✨) nảy mẩy trên thẻ thực khách.',
              'Tối ưu WeakMap DOM Cache giúp giảm 100% Layout Thrashing, mượt mà 60-120 FPS trên mobile.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.2.1',
    codename: 'Vòng Lặp Vàng: Nấu Sốt Sáng & Lọc Dầu Đêm — Tuyển Chọn Bởi TypeSafe AI Jev',
    releaseDate: '28/09/2026',
    isLatest: false,
    highlightSummary: 'Tuyển chọn trọn vẹn 2 tính năng vàng từ báo cáo mì cay theo khuyến nghị TypeSafe AI Jev: Sáng nêm Sốt Bí Truyền Má Bảy (Buff Vàng +3k tip & +0.25★ Hương Vị), Tối vớt cặn bột cháy cứu chảo chiên (Tiết kiệm tới 150k thay dầu & +0.2★ Vệ Sinh). Khép kín vòng lặp quản lý tiệm gà cực kỳ cuốn hút!',
    metrics: [
      { icon: '🍲', label: 'Nấu Sốt Sáng', value: '5 Gia Vị Tuyển Chọn' },
      { icon: '🧹', label: 'Lọc Dầu Tối', value: '15s Cứu Chảo Cháy' },
      { icon: '💰', label: 'Tiết Kiệm', value: '150.000đ Phí Dầu' },
      { icon: '⭐', label: 'Sao Tiệm', value: '+0.25★ Vị & +0.2★ Sạch' },
      { icon: '🤖', label: 'Cố Vấn Jev', value: 'Hệ Thống 1 Tin Cậy 96%' },
      { icon: '🧪', label: 'Kiểm Định', value: '462 Vitest PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Minigame 2: Lọc Cặn Dầu & Vớt Bột Cháy Cuối Ngày',
        categoryIcon: '🧹',
        items: [
          {
            tag: 'NIGHT MINIGAME',
            tagColor: '#ea580c',
            title: 'Lọc Cặn Dầu & Vệ Sinh Chảo Cuối Ngày (Save 150.000đ)',
            desc: 'Sau ca bán tất bật, người chơi thực hiện vệ sinh chảo dầu ngay tại Màn Hình Tổng Kết Ngày:',
            details: [
              'Chảo gang 3D mô phỏng mặt dầu sôi lăn tăn cùng 8 đốm cặn bột cháy vàng sậm nổi trên mặt dầu.',
              'Tương tác 1 ngón cái: Chạm hoặc vuốt nhanh các đốm cặn trong 15 giây trước khi dầu nguội đặc lại.',
              'Cơ chế phục hồi phẩm cấp dầu: Vớt sạch 100% giúp dầu đen khói hồi sinh thành dầu nâu cánh gián (hoặc dầu nâu thành vàng óng), tiết kiệm ngay 150.000đ tiền thay dầu và cộng thưởng +0.2★ Vệ Sinh.',
              'Cơ chế an ủi bác Ba: Nếu chỉ kịp vớt 60% trở lên, bác Ba thưởng công giảm 50% tiền thay dầu (còn 75k). Dưới 60% giữ nguyên tình trạng dầu.',
              'Hiệu ứng Web Audio độc quyền: Tiếng vợt lưới cạo sột soạt xèo xèo kim loại và hợp âm G-Major trong trẻo khi hoàn tất chảo dầu sạch bóng.'
            ]
          },
          {
            tag: 'DAY LOOP INTEGRATION',
            tagColor: '#16a34a',
            title: 'Tích Hợp Sâu Vào Sổ Sách P&L & Bảng Báo Cáo Cuối Ngày',
            desc: 'Liên kết chặt chẽ với cơ chế kiểm tra ATVSTP của Công An & Quản Lý Thị Trường:',
            details: [
              'Thẻ kêu gọi hành động nổi bật ngay trên Màn Hình Tổng Kết Ngày nếu dầu bị biến chất hoặc bốc khói đen.',
              'Sau khi lọc dầu thành công, giao diện tự động cập nhật huy hiệu "✅ ĐÃ VỆ SINH CHẢO" sáng bóng.',
              'Tránh hoàn toàn nguy cơ bị Đội Kiểm Tra ập vào phạt 200.000đ hoặc dính kết cục Game Over 3 Strikes vào tù.'
            ]
          }
        ]
      },
      {
        categoryName: 'Minigame 1: Pha Nước Sốt Bí Truyền Hẻm 1102',
        categoryIcon: '🍲',
        items: [
          {
            tag: 'MORNING MINIGAME',
            tagColor: '#d97706',
            title: 'Pha Nước Sốt Bí Truyền Hẻm 1102 (The Secret Sauce)',
            desc: 'Người chơi trổ tài nấu sốt trước ca bán tại Bảng Kế Hoạch với cơ chế ghi nhớ thứ tự gia vị:',
            details: [
              'Cuộn giấy gia truyền của Má Bảy mở ra trong 3.5 giây với 4 nguyên liệu ngẫu nhiên (Tỏi Lý Sơn, Mật Ong Tràm, Ớt Bay, Tương Đen, Mè Rang).',
              'Giai đoạn nêm nếm: Người chơi chạm các hũ gia vị dưới đáy màn hình theo đúng thứ tự đã ghi nhớ vào nồi sốt đang sôi.',
              'Phần thưởng Buff Vàng: Đạt chuẩn 4/4 mở khóa danh hiệu SỐT THẦN THÁNH trong ca bán, tặng ngay +3.000đ tip cho mỗi đơn hàng có món gà sốt và bảo hộ +0.25★ Hương Vị cuối ngày.',
              'Tâm lý tích cực: Nếu nêm sai thứ tự, Bác Ba động viên nhẹ nhàng và không phạt tiền, tạo trải nghiệm ấm áp thư giãn.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.2.0',
    codename: 'Tinh Hoa Sốt Bí Truyền — Tuyển Chọn Bởi TypeSafe AI Jev',
    releaseDate: '28/09/2026',
    isLatest: false,
    highlightSummary: 'Tính năng minigame pha chế được tuyển chọn và tối ưu từ báo cáo tính năng tiệm mì cay (chỉ số tín nhiệm Jev 94%): Nấu Sốt Bí Truyền Hẻm 1102, Buff Vàng ca bán (+3.000đ tip/đơn & +0.25★ Hương vị), âm thanh Web Audio chuyên biệt và tối ưu 1 ngón cái!',
    metrics: [
      { icon: '🍲', label: 'Tính Năng Mới', value: 'Minigame Nấu Sốt' },
      { icon: '📜', label: 'Bí Quyết', value: '5 Gia Vị Tuyển Chọn' },
      { icon: '💰', label: 'Buff Ca Bán', value: '+3.000đ Tip / Đơn' },
      { icon: '⭐', label: 'Hương Vị', value: '+0.25★ Bảo Hộ' },
      { icon: '🤖', label: 'Cố Vấn Jev', value: 'Hệ Thống 1 Tin Cậy 94%' },
      { icon: '🧪', label: 'Kiểm Định', value: '446 Vitest PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Minigame & Cơ Chế Gameplay Mới',
        categoryIcon: '🍲',
        items: [
          {
            tag: 'SIGNATURE MINIGAME',
            tagColor: '#d97706',
            title: 'Pha Nước Sốt Bí Truyền Hẻm 1102 (The Secret Sauce)',
            desc: 'Người chơi trổ tài nấu sốt trước ca bán tại Bảng Kế Hoạch với cơ chế ghi nhớ thứ tự gia vị:',
            details: [
              'Cuộn giấy gia truyền của Má Bảy mở ra trong 3.5 giây với 4 nguyên liệu ngẫu nhiên (Tỏi Lý Sơn, Mật Ong Tràm, Ớt Bay, Tương Đen, Mè Rang).',
              'Giai đoạn nêm nếm: Người chơi chạm các hũ gia vị dưới đáy màn hình theo đúng thứ tự đã ghi nhớ vào nồi sốt đang sôi.',
              'Phần thưởng Buff Vàng: Đạt chuẩn 4/4 mở khóa danh hiệu SỐT THẦN THÁNH trong ca bán, tặng ngay +3.000đ tip cho mỗi đơn hàng có món gà sốt và bảo hộ +0.25★ Hương Vị cuối ngày.',
              'Tâm lý tích cực: Nếu nêm sai thứ tự, Bác Ba động viên nhẹ nhàng và không phạt tiền, tạo trải nghiệm ấm áp thư giãn.'
            ]
          },
          {
            tag: 'AUDIO & GAME FEEL',
            tagColor: '#059669',
            title: 'Hệ Thống Âm Thanh & Xúc Giác Nấu Bếp Chuyên Biệt',
            desc: 'Trải nghiệm nấu bếp sống động bằng công nghệ Web Audio Synthesizer:',
            details: [
              'Âm thanh thả gia vị: Cao độ tần số tăng dần theo từng bước nêm đúng (từ 440Hz lên 680Hz).',
              'Hợp âm khải hoàn F-Major rực rỡ khi hoàn thành mẻ sốt hoàng kim.',
              'Giao diện chạm Golden Thumb Zone: Các nút hũ gia vị to tròn (>= 48px) bố trí ngay ngón cái người dùng.'
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v2.1.0',
    codename: 'Đại Bản Doanh Hẻm 1102 — Siêu Bản Cập Nhật Cốt Lõi',
    releaseDate: '28/09/2026',
    isLatest: false,
    highlightSummary: 'Bản cập nhật lớn nhất hoàn thiện toàn diện hệ thống: Pháp lý ATVSTP 3 Strikes, Sự kiện đòi nợ gián đoạn ca bán, Đánh giá Realtime 1-5★, Khách Sộp VIP viền vàng, và Đồng bộ Kho FIFO chuẩn xác!',
    metrics: [
      { icon: '🍗', label: 'Cốt Truyện', value: '5 Chương · 5 Ending' },
      { icon: '👥', label: 'Thực Khách', value: '36 Cư Dân + Khách Sộp' },
      { icon: '⭐', label: 'Đánh Giá', value: '1-5★ Realtime' },
      { icon: '👮‍♂️', label: 'Pháp Lý ATVSTP', value: '3 Strikes Dầu Đen' },
      { icon: '💸', label: 'Dòng Tiền', value: 'Quy Mô Theo Chương' },
      { icon: '🧪', label: 'Kiểm Định', value: '436 Vitest PASS 100%' }
    ],
    categories: [
      {
        categoryName: 'Pháp Lý & An Toàn Thực Phẩm (ATVSTP)',
        categoryIcon: '👮‍♂️',
        items: [
          {
            tag: '3 STRIKES',
            tagColor: '#d32f2f',
            title: 'Công An & Quản Lý Thị Trường Kiểm Tra Dầu Đen',
            desc: 'Nếu chủ quán cố tình chiên gà bằng dầu đen sì bốc khói độc hại, Đội kiểm tra sẽ lập tức ập vào kiểm tra với cơ chế 3 lần nghiêm khắc:',
            details: [
              'Lần 1: Lập biên bản cảnh cáo nhắc nhở, trừ điểm sao Vệ Sinh và ghi nhận vào nhật ký đánh giá của thực khách.',
              'Lần 2: Quyết định xử phạt hành chính 200.000đ trừ thẳng ví tiền mặt và trừ nặng sao Vệ Sinh của quán.',
              'Lần 3: Đình chỉ quán vĩnh viễn, Game Over lập tức chuyển vào Đại Kết Cục 3C: "Vào Tù Vì Dầu Đen Độc Hại" (bad_police).'
            ]
          }
        ]
      },
      {
        categoryName: 'Sự Kiện Kịch Tính & Xóm Hẻm 1102',
        categoryIcon: '💥',
        items: [
          {
            tag: 'ĐÒI NỢ NGÀY 8+',
            tagColor: '#e65100',
            title: 'Bà Bảy Đất & Đại Ca Beo Đòi Tiền Bảo Kê',
            desc: 'Từ Ngày 8 trở đi, sự kiện xuất hiện ngay giữa ca bán hàng với 4 lựa chọn đối đáp phân nhánh:',
            details: [
              'Nhánh cự cãi nóng nảy khiến Đại Ca Beo đập phá bàn ghế, toàn bộ khách đang đợi sợ hãi bỏ chạy sạch (orders = []).',
              'Quán bị gián đoạn hỗn loạn trong 18 giây, chặn dòng khách mới dám bước vào kèm còi báo động và rung xúc giác.',
              'Nhánh mời gà khất nợ hoặc nhờ Bác Ba can thiệp giúp êm chuyện, giữ yên ổn làm ăn và tăng điểm Karma Tình Hẻm.'
            ]
          },
          {
            tag: 'KINH TẾ & CHỐNG LẶP',
            tagColor: '#0288d1',
            title: 'Sự Kiện Tiền Thật Theo Chương & Cooldown 6 Ngày',
            desc: 'Tiền thưởng/phạt từ các sự cố được cộng/trừ thẳng vào ví tiền mặt, quy mô tiền tăng dần theo Chương (x1.0 đến x5.0).',
            details: [
              'Cơ chế chống lặp kép: Ưu tiên tuyệt đối sự kiện chưa gặp + Thời gian hồi Cooldown 6 ngày (INCIDENT_COOLDOWN_DAYS = 6).',
              'Hiện toast thông báo biến động tiền mặt ngay trên màn hình (💵 Nhận tiền / 💸 Chi tiền).'
            ]
          }
        ]
      },
      {
        categoryName: 'Đánh Giá Real-time & Đối Đáp Khách Hàng',
        categoryIcon: '⭐',
        items: [
          {
            tag: 'REAL-TIME REVIEW',
            tagColor: '#f57c00',
            title: 'Hệ Thống Đánh Giá 1-5 Sao Từng Lượt Khách',
            desc: 'Mỗi khách ăn xong, bỏ về do đợi lâu, nhận sai món hay thiếu món đều để lại đánh giá tức thì với số sao và hashtag tương ứng.',
            details: [
              'Giá đắt (≥125% - 140%+): Khách bức xúc phàn nàn giá cả (topic expensive, 1-3★), gắn tag #GiaCatCo #ChatChem.',
              'Tiện nghi vỉa hè: Quán chật chội sau Ngày 4 khi chưa nâng cấp không gian bị chê bai nóng bức (topic bad_space, 2-3★).',
              'Giá rẻ bình dân (≤90%): Khách hết lời khen ngợi quán ruột giá hời (topic cheap_price, 5★).'
            ]
          },
          {
            tag: 'ĐỐI ĐÁP 2 CHIỀU',
            tagColor: '#388e3c',
            title: 'Hộp Thoại Phản Hồi Có Bác Ba Cố Vấn',
            desc: 'Chủ tiệm có thể trực tiếp trả lời đánh giá của khách trên Tab Đánh Giá hoặc Màn Tổng Kết Cuối Ngày:',
            details: [
              'Bác Ba gợi ý phân tích tâm lý khách hàng và mách nước phương án trả lời khuyên chọn ⭐.',
              '3 Phong cách đối đáp (Chân thành, Hài hước GenZ, Cương trực) giúp cứu vãn điểm sao (+0.1★ - +0.2★) và tăng điểm Karma.',
              'Sửa dứt điểm lỗi kẹt không đóng được hộp thoại trả lời review.'
            ]
          }
        ]
      },
      {
        categoryName: 'Khách Hàng & Gia Tốc Kinh Tế',
        categoryIcon: '👑',
        items: [
          {
            tag: 'VIP BIG SPENDER',
            tagColor: '#fbc02d',
            title: 'Khách Sộp VIP Hào Quang Vàng Lấp Lánh',
            desc: 'Bổ sung tính cách Khách Sộp (vip_generous) đại gia/CEO/Tiktoker với diện mạo sang trọng và hào quang nổi bật:',
            details: [
              'Thẻ khách viền vàng mạ kim vip-card cùng huy hiệu 👑 KHÁCH SỘP.',
              'Tiền tip cực khủng (+45.000đ khi giao nhanh +15.000đ khi chiên chuẩn vị, tổng tip lên tới 35k-150k+).',
              'Bong bóng thoại chịu chi: "Tiền nong không quan trọng, làm chuẩn giòn rụm anh bo hết nấc!".'
            ]
          },
          {
            tag: 'SMART SERVING',
            tagColor: '#7b1fa2',
            title: 'Phục Vụ Đa Khách Hàng Thông Minh & Hủy Đơn Xin Lỗi',
            desc: 'Khắc phục triệt để tình trạng nghẽn cổ chai hàng đợi bán hàng:',
            details: [
              'Tự động giao cho khách thứ 2, thứ 3 nếu món trong khay đã sẵn sàng hoặc bấm nút LÊN MÓN trực tiếp trên thẻ khách.',
              'Nút "🙏 Hết món · Xin lỗi": Khi hết nguyên liệu, chủ động xin lỗi để khách thông cảm rời đi và thanh toán món đã nhận.',
              'Đồng bộ 100% số lượng khách dự kiến đến quán thực tế trong 11 tiếng ca bán (10h-21h).'
            ]
          }
        ]
      },
      {
        categoryName: 'Bếp Chiên & Kho Hàng FIFO Chuẩn Mực',
        categoryIcon: '🍗',
        items: [
          {
            tag: 'ĐỒNG BỘ MÓN ĂN',
            tagColor: '#c2185b',
            title: 'Mở Khóa Món Mới Ngay Từ Chương 1 Theo Ngày',
            desc: 'Khắc phục lỗi hiển thị mua bên ngoài nhưng vào ca bán lại báo "khóa chương sau":',
            details: [
              'Cánh gà sốt cay Yangnyeom: Mở khóa ngay Ngày 3 Chương 1.',
              'Gà sốt bơ tỏi đậu nành: Mở khóa ngay Ngày 4 Chương 1.',
              'Gà viên popcorn giòn rụm: Mở khóa ngay Ngày 5 Chương 1.',
              'Sốt Yangnyeom & Sốt Bơ Tỏi sẵn sàng nhập tại Kho để phục vụ quầy chiên.'
            ]
          },
          {
            tag: 'KHO FIFO CHUẨN',
            tagColor: '#00796b',
            title: 'Tiêu Hủy Hàng Hết Hạn Thật Sự & Tồn Kho 1:1',
            desc: 'Cơ chế kho hàng FIFO chuẩn mực bảo vệ chất lượng món ăn:',
            details: [
              'Hiển thị số lượng trên quầy Inox đúng 1:1 với nguyên liệu chính tồn kho (primaryStock), hết nguyên liệu không cho chiên khống.',
              'Bán đùi gà chỉ trừ tồn đùi gà, không bao giờ trừ chéo má đùi gà.',
              'Tiêu hủy sạch các lô nguyên liệu hết hạn sử dụng qua đêm (daysLeft <= 0) kèm thông báo chi phí hao hụt vào sáng hôm sau.'
            ]
          }
        ]
      },
      {
        categoryName: 'Âm Thanh, Nhạc Nền & Cảm Giác Game Feel',
        categoryIcon: '🎵',
        items: [
          {
            tag: 'AUDIO SYNTH',
            tagColor: '#512da8',
            title: 'Âm Thanh Web Audio Synth Theo Từng Phân Cảnh',
            desc: 'Thay đổi âm thanh sống động theo nhịp đập kịch bản:',
            details: [
              'Hợp âm Synth trượt tần số dồn dập (playDramaticSting) khi sự cố bất ngờ xuất hiện.',
              'Rung tần số FM hỗn loạn (playChaosScare) khi khách sợ hãi tháo chạy.',
              'Hiệu ứng lò xo boing hoạt hình dí dỏm và chuông lãng mạn leng keng.',
              'Dynamic BGM: Nhạc nền tự hạ âm lượng và chuyển sang điệu kịch tính 68 BPM (gam D thứ) khi có sự kiện.'
            ]
          }
        ]
      }
    ]
  }
];
