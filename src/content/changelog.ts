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

export const CURRENT_GAME_VERSION = 'v2.6.0';
export const CURRENT_VERSION_CODENAME = 'Bếp Nấu Thủ Công Cozy 16-Bit & Trị Dứt Điểm Cắt Cụt Thông Tin (Zero Truncation)';
export const CURRENT_BUILD_DATE = '02/10/2026';

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: 'v2.6.0',
    codename: 'Bếp Nấu Thủ Công Cozy 16-Bit & Trị Dứt Điểm Cắt Cụt Thông Tin (Zero Truncation)',
    releaseDate: '02/10/2026',
    isLatest: true,
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
