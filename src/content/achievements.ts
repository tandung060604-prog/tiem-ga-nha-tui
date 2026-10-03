import { HeritageBadge, HeritageBadgeId, GameState } from '../types/game';

export const HERITAGE_BADGES: HeritageBadge[] = [
  // =========================================================================
  // 1. NGHỆ THUẬT BẾP & CHIÊN RÁN (COOKING)
  // =========================================================================
  {
    id: 'badge_ban_tay_vang',
    title: 'Bàn Tay Vàng Làng Gà Rán',
    kicker: 'HỘI ẨM THỰC HẺM 1102 CHỨNG NHẬN',
    icon: '✨',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 50,
    requirementDesc: 'Chiên đạt 50 mẻ gà giòn rụm Perfect',
    rewardMoney: 50000,
    rewardKarma: { craftsmanship: 10 },
    honorTitle: 'Đệ Nhất Bếp Chiên Sài Gòn',
    quote: 'Chảo dầu sôi 180°C mà nhấc ra giòn tan ráo dầu, tay nghề xứng tầm nghệ nhân đất Gia Định!',
  },
  {
    id: 'badge_dung_si_dau_sach',
    title: 'Dũng Sĩ Dầu Sạch ATVSTP',
    kicker: 'THANH TRA AN TOÀN VỆ SINH PHỐ',
    icon: '🛢️',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Không để chảo dầu đen liên tiếp 5 ngày',
    rewardMoney: 75000,
    rewardKarma: { craftsmanship: 10, community: 5 },
    honorTitle: 'Tấm Gương Vàng Sức Khỏe Cộng Đồng',
    quote: 'Dầu luôn vàng óng thơm nức mũi, không bao giờ dùng dầu đen hại sức khỏe bà con lối xóm!',
  },
  {
    id: 'badge_bac_thay_gia_truyen',
    title: 'Bậc Thầy Nồi Sốt Bí Truyền',
    kicker: 'CÂU LẠC BỘ BẾP TRƯỞNG TRUYỀN THỐNG',
    icon: '🍯',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Nấu thành công 5 nồi Sốt Bí Truyền',
    rewardMoney: 80000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Phù Thủy Gia Vị Hẻm 1102',
    quote: 'Tỏi, ớt, mật ong quyện vào nhau tạo nên giọt sốt sánh mịn đậm đà khó cưỡng!',
  },
  {
    id: 'badge_bep_lua_than_toc',
    title: 'Bếp Lửa Thần Tốc Không Ngừng',
    kicker: 'HIỆP HỘI ĐẦU BẾP ĐÔ THÀNH',
    icon: '🔥',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 15,
    requirementDesc: 'Đạt chuỗi 15 mẻ Perfect liên tiếp không sơ suất',
    rewardMoney: 60000,
    rewardKarma: { craftsmanship: 12 },
    honorTitle: 'Bàn Tay Không Sai Một Ly',
    quote: 'Nhịp canh lửa chuẩn xác từng giây, cả con hẻm ngửi thấy mùi thơm là không cưỡng lại được!',
  },
  {
    id: 'badge_phu_thuy_khoai_lac',
    title: 'Phù Thủy Khoai Lắc Xí Muội',
    kicker: 'HỘI HỌC SINH SINH VIÊN HẺM',
    icon: '🍟',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 30,
    requirementDesc: 'Lắc và phục vụ 30 phần khoai tây lắc rong biển & phô mai',
    rewardMoney: 55000,
    rewardKarma: { craftsmanship: 8, community: 5 },
    honorTitle: 'Vua Ăn Vặt Giới Trẻ',
    quote: 'Khoai giòn rụm bên ngoài bở mềm bên trong, bột phô mai phủ đều mười phần như một!',
  },
  {
    id: 'badge_nghe_si_uot_uot',
    title: 'Nghệ Sĩ Nước Ngọt Bật Nắp',
    kicker: 'CÂU LẠC BỘ CÚ ĐÊM SÀI GÒN',
    icon: '🥤',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 50,
    requirementDesc: 'Rót và phục vụ 50 ly nước ngọt có gas mát lạnh',
    rewardMoney: 50000,
    rewardKarma: { craftsmanship: 8 },
    honorTitle: 'Cứu Tinh Cơn Khát Trưa Hè',
    quote: 'Tiếng xì xà ga lạnh buốt tan ngay cái nắng gay gắt Sài Gòn, uống một ngụm là tỉnh cả người!',
  },
  {
    id: 'badge_bep_truong_5_sao',
    title: 'Đầu Bếp Đạt Chuẩn 5.0 Sao',
    kicker: 'CHUYÊN TRANG ẨM THỰC ĐƯỜNG PHỐ',
    icon: '⭐',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Đạt điểm đánh giá Taste trung bình 5.0 sao',
    rewardMoney: 120000,
    rewardKarma: { craftsmanship: 20 },
    honorTitle: 'Hương Vị Hoàn Hảo Tuyệt Đối',
    quote: 'Thực khách khó tính đến mấy nếm thử miếng gà rán cũng phải gật gù khen nức nở!',
  },
  {
    id: 'badge_chao_gang_khong_nghi',
    title: 'Chảo Gang Vàng Không Vết Cháy',
    kicker: 'BAN THANH TRA CHẤT LƯỢNG MÓN',
    icon: '🍳',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 1,
    requirementDesc: 'Hoàn thành 1 ca bán bận rộn không để cháy khét bất kỳ món nào',
    rewardMoney: 65000,
    rewardKarma: { craftsmanship: 10 },
    honorTitle: 'Kỷ Luật Thép Nơi Gian Bếp',
    quote: 'Dù khách giục giã liên hồi, từng miếng gà vẫn vàng ươm hoàn hảo, không một vết khét.',
  },
  {
    id: 'badge_chuyen_gia_canh_lua',
    title: 'Chuyên Gia Canh Lửa Điêu Luyện',
    kicker: 'HỘI NGHỆ NHÂN BẾP LỬA GIA ĐỊNH',
    icon: '⏱️',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 15,
    requirementDesc: 'Nhấc vợt gà ở 0.5s đỉnh cao của vùng Perfect 15 lần',
    rewardMoney: 70000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Đôi Mắt Tinh Anh',
    quote: 'Chỉ liếc qua bọt dầu sôi là biết đúng khoảnh khắc da gà đạt độ phồng xốp giòn tan nhất!',
  },
  {
    id: 'badge_dai_tiec_hoang_gia',
    title: 'Đại Tiệc Combo Gà Cay Mật Ong',
    kicker: 'HỘI SÀNH ĂN HẺM 1102',
    icon: '🍗',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 10,
    requirementDesc: 'Phục vụ thành công 10 khay combo đại tiệc đầy đủ món chính, phụ và nước',
    rewardMoney: 85000,
    rewardKarma: { craftsmanship: 12, ambition: 8 },
    honorTitle: 'Bữa Tiệc Thịnh Soạn Xóm Hẻm',
    quote: 'Mâm gà cay phết sốt bơ tỏi lấp lánh như ngọc, thực khách ngồi ăn quây quần ấm cúng vô cùng.',
  },

  // =========================================================================
  // 2. AN NINH TRẬT TỰ & PHỐ PHƯỜNG (SECURITY)
  // =========================================================================
  {
    id: 'badge_khac_tinh_toi_pham',
    title: 'Khắc Tinh Tội Phạm Hẻm Sâu',
    kicker: 'BAN BẢO VỆ DÂN PHỐ KHEN TẶNG',
    icon: '👮',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 3,
    requirementDesc: 'Bắt sống hoặc hỗ trợ tóm gọn tên trộm 3 lần',
    rewardMoney: 100000,
    rewardKarma: { community: 15 },
    honorTitle: 'Hiệp Sĩ Bắt Cướp Hẻm 1102',
    quote: 'Tí Chuột Nhắt nghe danh quán gà là hồn xiêu phách lạc, bà con an tâm ăn gà không lo mất ví!',
  },
  {
    id: 'badge_mat_than_dan_pho',
    title: 'Mắt Thần Dân Phố Phản Xạ Nhanh',
    kicker: 'CÔNG AN PHƯỜNG BIỂU DƯƠNG',
    icon: '👁️',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 1,
    requirementDesc: 'Phát hiện và khống chế tên trộm ngay trong 2 giây đầu tiên',
    rewardMoney: 90000,
    rewardKarma: { community: 12 },
    honorTitle: 'Tay Nhanh Hơn Đạo Tặc',
    quote: 'Tên trộm vừa thò tay định thó hộp tiền đã bị tóm gọn tại trận, nhanh như cắt!',
  },
  {
    id: 'badge_canh_ve_dem_khuya',
    title: 'Canh Vệ Đêm Khuya Hẻm Vắng',
    kicker: 'TỔ TUẦN TRA ĐÊM HẺM 1102',
    icon: '🌙',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 5,
    requirementDesc: 'Hoàn thành 5 ca bán đêm (21h - 6h sáng) bình an vô sự',
    rewardMoney: 110000,
    rewardKarma: { community: 15, ambition: 10 },
    honorTitle: 'Ngọn Đèn Sáng Trong Đêm Tối',
    quote: 'Ánh đèn vàng quán gà giữa đêm khuya mang lại cảm giác bình yên ấm áp cho những ai lỡ bước.',
  },
  {
    id: 'badge_chuot_nhat_khiep_so',
    title: 'Khắc Tinh Chuột Cống Đêm',
    kicker: 'ĐỘI VỆ SINH MÔI TRƯỜNG PHƯỜNG',
    icon: '🐀',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 8,
    requirementDesc: 'Xua đuổi lũ chuột cống ngõ hẻm bảo vệ kho nguyên liệu 8 lần',
    rewardMoney: 50000,
    rewardKarma: { craftsmanship: 8, community: 5 },
    honorTitle: 'Kho Lương Thực Bất Khả Xâm Phạm',
    quote: 'Kho gà sạch bóng không một vết chân chuột, nguyên liệu luôn tươi mới đạt chuẩn!',
  },
  {
    id: 'badge_hiep_si_duong_pho',
    title: 'Hiệp Sĩ Sạch Phố Đẹp Hẻm',
    kicker: 'HỘI PHỤ NỮ & THANH NIÊN TỰ QUẢN',
    icon: '🧹',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 15,
    requirementDesc: 'Quét dọn sạch sẽ 15 đống rác và lá rụng trước hiên quán',
    rewardMoney: 50000,
    rewardKarma: { community: 15 },
    honorTitle: 'Con Hẻm Xanh Sạch Đẹp',
    quote: 'Hiên quán lúc nào cũng tinh tươm thoáng mát, bà con đi ngang ai cũng muốn ghé vào ngồi nghỉ.',
  },
  {
    id: 'badge_khong_mot_hat_bui',
    title: 'Bàn Ăn Sạch Bóng Không Tì Vết',
    kicker: 'ĐOÀN ĐÁNH GIÁ TRẢI NGHIỆM KHÁCH HÀNG',
    icon: '✨',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 20,
    requirementDesc: 'Lau dọn sạch bóng 20 bàn ăn sau khi khách dùng bữa',
    rewardMoney: 60000,
    rewardKarma: { craftsmanship: 10 },
    honorTitle: 'Chu Đáo Tận Tâm',
    quote: 'Khách vừa đứng dậy là bàn đã được lau tinh tươm sạch bóng, khách sau vào ngồi an tâm tuyệt đối.',
  },
  {
    id: 'badge_hoa_giai_drama',
    title: 'Sứ Giả Hòa Giải Xóm Giềng',
    kicker: 'BAN HÒA GIẢI CƠ SỞ KHỐI PHỐ',
    icon: '🕊️',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 8,
    requirementDesc: 'Xử lý êm thấm 8 sự cố drama và tranh chấp phát sinh trong hẻm',
    rewardMoney: 80000,
    rewardKarma: { community: 20 },
    honorTitle: 'Cái Đầu Lạnh Trái Tim Ấm',
    quote: 'Chuyện to hóa nhỏ, chuyện nhỏ hóa không. Quán gà là nơi bà con ngồi lại bắt tay làm hòa!',
  },
  {
    id: 'badge_an_ninh_vung_chac',
    title: 'Thành Lũy An Ninh Bất Khả Xâm Phạm',
    kicker: 'BAN CHỈ HUY QUÂN SỰ PHƯỜNG',
    icon: '🛡️',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 1,
    requirementDesc: 'Chiêu mộ nhân viên chuyên trách Bảo Vệ an ninh cho quán',
    rewardMoney: 75000,
    rewardKarma: { ambition: 10, community: 10 },
    honorTitle: 'Trụ Cột Vững Vàng',
    quote: 'Có bảo vệ túc trực trước cửa, kẻ gian nhìn thấy là chùn bước từ đầu ngõ hẻm!',
  },

  // =========================================================================
  // 3. TÌNH LÀNG NGHĨA XÓM & TRI KỶ (COMMUNITY)
  // =========================================================================
  {
    id: 'badge_to_dan_pho_nghia_tinh',
    title: 'Quán Gà Nghĩa Tình Hẻm 1102',
    kicker: 'UBND PHƯỜNG & TỔ DÂN PHỐ TRAO TẶNG',
    icon: '💖',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 90,
    requirementDesc: 'Đạt từ 90 điểm Karma Tình Thân Hẻm trở lên',
    rewardMoney: 120000,
    rewardKarma: { community: 20 },
    honorTitle: 'Mái Ấm Nghĩa Tình Sài Gòn',
    quote: 'Không chỉ bán gà ngon, nơi đây còn chan chứa tình làng nghĩa xóm, nâng đỡ từng mảnh đời cơ cực.',
  },
  {
    id: 'badge_nha_hao_tam',
    title: 'Gia Đình Tiếp Tế Tương Trợ',
    kicker: 'CỘNG ĐỒNG LIÊN MINH TIỆM GÀ SÀI GÒN',
    icon: '🎁',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 3,
    requirementDesc: 'Gửi 3 gói quà tiếp tế (Gà, Quỹ dầu, Tip) cho bạn bè trong Lobby',
    rewardMoney: 60000,
    rewardKarma: { community: 15 },
    honorTitle: 'Nhà Hảo Tâm Xóm Đạo',
    quote: 'Lá lành đùm lá rách, gửi từng miếng gà tươi và quỹ dầu sạch cứu nguy cho tiệm bạn lúc ngặt nghèo.',
  },
  {
    id: 'badge_ban_than_thu_cung',
    title: 'Đại Sứ Yêu Thương Thú Cưng',
    kicker: 'TRẠM CỨU HỘ ĐỘNG VẬT CỎ HẺM 1102',
    icon: '🐾',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 5,
    requirementDesc: 'Chăm sóc và xoa đầu Cậu Vàng & Bé Mướp đạt mốc 5 ngày',
    rewardMoney: 50000,
    rewardKarma: { community: 15 },
    honorTitle: 'Người Bạn Tri Kỷ Của Cậu Vàng',
    quote: 'Cậu Vàng vẫy đuôi mừng rỡ, Bé Mướp nằm sưởi nắng rừ rừ, mái hiên quán lúc nào cũng ấm áp tình thương.',
  },
  {
    id: 'badge_tri_ky_bac_ba',
    title: 'Tri Kỷ Thâm Giao Với Bác Ba',
    kicker: 'HỘI TRƯỞNG LÃO HẺM 1102',
    icon: '👴',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 5,
    requirementDesc: 'Nâng điểm thân thiết với Bác Ba Béo lên Cấp 5 (Người Nhà 1102)',
    rewardMoney: 150000,
    rewardKarma: { community: 25 },
    honorTitle: 'Hậu Duệ Truyền Thừa Bác Ba',
    quote: 'Bác Ba coi bạn như ruột thịt trong nhà, bao bí kíp gia truyền đều dốc lòng truyền thụ không giấu giếm!',
  },
  {
    id: 'badge_khau_vi_ruot_hem',
    title: 'Bậc Thầy Bắt Trúng Khẩu Vị Ruột',
    kicker: 'CÂU LẠC BỘ THỰC KHÁCH TRUNG THÀNH',
    icon: '🎯',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 25,
    requirementDesc: 'Phục vụ chiều đúng 25 lần món khoái khẩu của cư dân thân thiết',
    rewardMoney: 95000,
    rewardKarma: { community: 15, craftsmanship: 10 },
    honorTitle: 'Hiểu Lòng Thực Khách',
    quote: 'Khách vừa bước chân vào cửa chưa kịp mở lời, đĩa gà đúng gu đã nóng hổi bưng ra tận bàn!',
  },
  {
    id: 'badge_ban_than_co_muoi',
    title: 'Hòm Quà Thắm Đượm Tình Quê',
    kicker: 'BÀ CON TỔ DÂN PHỐ HẺM SÂU',
    icon: '📦',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 5,
    requirementDesc: 'Mở nhận 5 bưu kiện Quà Quê tiếp tế từ bà con cư dân',
    rewardMoney: 80000,
    rewardKarma: { community: 15 },
    honorTitle: 'Được Cả Xóm Yêu Thương',
    quote: 'Từng nải chuối vườn, chai mật ong rừng hay gói tiêu sọ... món quà quê mộc mạc mà chứa chan ân tình.',
  },
  {
    id: 'badge_su_gia_hoa_binh',
    title: 'Sứ Giả Gắn Kết Lòng Người',
    kicker: 'MẶT TRẬN TỔ QUỐC PHƯỜNG',
    icon: '🤝',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 8,
    requirementDesc: 'Đưa ít nhất 8 cư dân Hẻm đạt mức thân thiết từ Cấp 3 trở lên',
    rewardMoney: 110000,
    rewardKarma: { community: 20 },
    honorTitle: 'Nhịp Cầu Nối Những Bờ Vui',
    quote: 'Từ cô bán vé số đến anh công an khu vực, ai ai cũng xem quán gà là chốn thân quen dừng chân sẻ chia.',
  },
  {
    id: 'badge_am_ap_trai_tim',
    title: 'Hiên Nhà Ấm Áp Muôn Loài',
    kicker: 'HỘI BẢO TRỢ ĐỘNG VẬT KHU PHỐ',
    icon: '🐱',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 1,
    requirementDesc: 'Nuôi dưỡng Cậu Vàng & Bé Mướp cùng đạt chỉ số Vui Vẻ tối đa 100%',
    rewardMoney: 60000,
    rewardKarma: { community: 15 },
    honorTitle: 'Vòng Tay Ấm Áp',
    quote: 'Chó mừng ríu rít, mèo dụi đầu kêu meo meo, hiên quán ngập tràn tiếng cười và sự an yên.',
  },
  {
    id: 'badge_chia_ngot_se_bui',
    title: 'Bữa Cơm Nghĩa Tình Lao Động Nghèo',
    kicker: 'QUỸ TỪ THIỆN HẺM 1102',
    icon: '🍲',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 5,
    requirementDesc: 'Tặng phần ăn miễn phí cho người bán vé số & ve chai qua các biến cố 5 lần',
    rewardMoney: 70000,
    rewardKarma: { community: 25 },
    honorTitle: 'Tấm Lòng Bồ Tát Giữa Đời Thường',
    quote: 'Bán buôn cốt ở cái tâm, sẻ chia miếng ăn ấm bụng cho người cơ nhỡ chính là phước báu lớn nhất.',
  },
  {
    id: 'badge_tieng_cuoi_xom_dao',
    title: 'Ngôi Nhà Chung Của Hẻm 1102',
    kicker: 'ĐẠI DIỆN 36 HỘ DÂN KHU PHỐ',
    icon: '🏡',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 100,
    requirementDesc: 'Đạt mốc tối đa 100 điểm Karma Tình Thân Cộng Đồng',
    rewardMoney: 200000,
    rewardKarma: { community: 30 },
    honorTitle: 'Trái Tim Của Xóm Hẻm',
    quote: 'Dù vật đổi sao dời, tình làng nghĩa xóm nơi đây vẫn bền chặt như keo sơn nhờ ngọn lửa của quán gà!',
  },

  // =========================================================================
  // 4. VẬN HÀNH KINH DOANH & GIAO VẬN (OPERATIONS)
  // =========================================================================
  {
    id: 'badge_vua_giao_hang',
    title: 'Chiến Thần Đơn Hẻm Express',
    kicker: 'HIỆP HỘI TÀI XẾ & SHIPPER HẺM',
    icon: '🛵',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 15,
    requirementDesc: 'Xử lý thành công 15 đơn giao hàng Delivery Runner',
    rewardMoney: 90000,
    rewardKarma: { ambition: 10 },
    honorTitle: 'Tay Lái Lụa Ngõ Ngách Sài Gòn',
    quote: 'Dù hẻm sâu ngoằn ngoèo hay ngập nước, đơn gà vẫn đến tay khách còn bốc khói nghi ngút!',
  },
  {
    id: 'badge_ong_trum_gacha',
    title: 'Đại Gia Chiêu Mộ Nhân Tài',
    kicker: 'VIỆN QUẢN TRỊ NHÂN LỰC HẺM 1102',
    icon: '👑',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 1,
    requirementDesc: 'Chiêu mộ thành công ít nhất 1 nhân viên cấp bậc SSR',
    rewardMoney: 150000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Đại Bản Doanh Ngũ Hổ Tướng',
    quote: 'Dưới trướng toàn nhân tài kiệt xuất, từ Bếp trưởng hoàng gia đến Quản lý tinh hoa!',
  },
  {
    id: 'badge_dai_ban_doanh_ga',
    title: 'Đại Bản Doanh Gà Giòn Đô Thành',
    kicker: 'HIỆP HỘI DOANH NHÂN TRẺ SÀI GÒN',
    icon: '🍗',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 200,
    requirementDesc: 'Phục vụ no nê cho 200 lượt thực khách ghé quán',
    rewardMoney: 180000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Cột Cờ Ẩm Thực Hẻm 1102',
    quote: 'Tiếng cười nói rộn rã sớm tối, quán gà nhỏ nay đã trở thành điểm hẹn thân thương của cả khu phố!',
  },
  {
    id: 'badge_trieu_phu_hem_sau',
    title: 'Triệu Phú Tự Lập Hẻm Sâu',
    kicker: 'NGÂN HÀNG PHÁT TRIỂN KINH TẾ ĐÔ THỊ',
    icon: '💰',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 1000000,
    requirementDesc: 'Tích lũy số dư tiền mặt trong quỹ đạt từ 1.000.000đ trở lên',
    rewardMoney: 100000,
    rewardKarma: { ambition: 20 },
    honorTitle: 'Bản Lĩnh Doanh Nhân',
    quote: 'Bắt đầu từ đôi bàn tay trắng và chiếc xe đẩy cũ, nay đã vững vàng tài chính không ngại sóng gió.',
  },
  {
    id: 'badge_doi_ngu_tinh_nhue',
    title: 'Đội Ngũ Nhân Lực Tinh Nhuệ',
    kicker: 'TRUNG TÂM PHÁT TRIỂN NGHỀ NGHIỆP',
    icon: '👥',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 3,
    requirementDesc: 'Đào tạo nâng cấp 3 nhân viên lên cấp độ 2 trở lên',
    rewardMoney: 90000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Nhà Lãnh Đạo Xuất Sắc',
    quote: 'Nhân viên thạo việc, phối hợp nhịp nhàng như một dàn nhạc giao hưởng nơi gian bếp rực lửa!',
  },
  {
    id: 'badge_chuoi_cung_ung_vang',
    title: 'Bậc Thầy Mặc Cả Chợ Đầu Mối',
    kicker: 'BAN QUẢN LÝ CHỢ ĐẦU MỐI BÌNH ĐIỀN',
    icon: '🥬',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 8,
    requirementDesc: 'Thương lượng thành công giá sỉ chiết khấu cao tại Chợ Đầu Mối 8 lần',
    rewardMoney: 75000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Đôi Mắt Tinh Đời',
    quote: 'Chọn được từng miếng thịt gà tươi rói với giá hời nhất, giảm thiểu tối đa chi phí vận hành!',
  },
  {
    id: 'badge_bien_hieu_ruc_ro',
    title: 'Biển Hiệu Rực Rỡ Phố Đèn Lồng',
    kicker: 'HỘI KIẾN TRÚC & MỸ THUẬT ĐÔ THỊ',
    icon: '🏮',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 2,
    requirementDesc: 'Mở khóa và trang trí ít nhất 2 Biển Hiệu Vintage cho mặt tiền quán',
    rewardMoney: 70000,
    rewardKarma: { craftsmanship: 10, ambition: 10 },
    honorTitle: 'Điểm Sáng Mỹ Quan Đô Thị',
    quote: 'Mặt tiền quán bừng sáng đèn neon retro hoài niệm, ai đi ngang cũng phải ngước nhìn trầm trồ.',
  },
  {
    id: 'badge_khong_mot_don_huy',
    title: 'Kỷ Lục Phục Vụ Không Lời Phàn Nàn',
    kicker: 'HIỆP HỘI BẢO VỆ NGƯỜI TIÊU DÙNG',
    icon: '⭐',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 40,
    requirementDesc: 'Phục vụ liên tiếp 40 thực khách mà không để ai bực bội bỏ về',
    rewardMoney: 100000,
    rewardKarma: { craftsmanship: 15, community: 10 },
    honorTitle: 'Lòng Kiên Nhẫn Vàng',
    quote: 'Nụ cười luôn nở trên môi, phục vụ nhanh nhẹn chu đáo, khách đến vừa lòng khách đi thỏa mãn.',
  },
  {
    id: 'badge_sieu_toc_phuc_vu',
    title: 'Tốc Độ Phục Vụ Tia Chớp',
    kicker: 'CÂU LẠC BỘ RUSH HOUR SÀI GÒN',
    icon: '⚡',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 5,
    requirementDesc: 'Đạt điểm đánh giá Tốc Độ phục vụ trung bình từ 4.8 sao trở lên',
    rewardMoney: 80000,
    rewardKarma: { ambition: 12 },
    honorTitle: 'Đôi Tay Thoăn Thoắt',
    quote: 'Khách gọi món chưa dứt câu, hộp gà giòn đã trao tận tay nóng hổi, nhanh như một cơn gió lốc!',
  },

  // =========================================================================
  // 5. HUYỀN THOẠI & SỬ KÝ HẺM (LEGEND)
  // =========================================================================
  {
    id: 'badge_nha_su_hoc_hem',
    title: 'Sử Gia Ký Ức Cư Dân',
    kicker: 'HỘI SỬ KÝ DÂN GIAN HẺM 1102',
    icon: '📖',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 8,
    requirementDesc: 'Lắng nghe và hoàn thành 8 tập Ký sự phân nhánh của bà con',
    rewardMoney: 100000,
    rewardKarma: { community: 10, craftsmanship: 10 },
    honorTitle: 'Người Gìn Giữ Ký Ức Hẻm 1102',
    quote: 'Mỗi cư dân một số phận, từng câu chuyện vui buồn đều được khắc ghi trọn vẹn trong trang nhật ký.',
  },
  {
    id: 'badge_huyen_thoai_100_ngay',
    title: 'Huyền Thoại Trăm Ngày Gà Rán',
    kicker: 'TỔ DÂN PHỐ & TOÀN THỂ BÀ CON HẺM 1102',
    icon: '🏛️',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 100,
    requirementDesc: 'Đứng vững và kinh doanh đủ 100 ngày vượt qua bao giông bão',
    rewardMoney: 500000,
    rewardKarma: { community: 25, craftsmanship: 25, ambition: 25 },
    honorTitle: 'Tượng Đài Bất Tử Hẻm 1102',
    quote: '100 ngày lửa cháy trong bếp, 100 ngày tình nghĩa keo sơn. Tiệm Gà Nhà Tui chính là linh hồn của Sài Gòn!',
  },
  {
    id: 'badge_thinh_gia_trung_thanh',
    title: 'Thính Giả Tri Âm Đài Đêm FM 99.9',
    kicker: 'ĐÀI TIẾNG NÓI NHÂN DÂN TP.HCM',
    icon: '📻',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 8,
    requirementDesc: 'Lắng nghe làn sóng FM 99.9 MHz và tiếp nhận Buff Đêm đủ 8 lần',
    rewardMoney: 80000,
    rewardKarma: { craftsmanship: 10, community: 10 },
    honorTitle: 'Giai Điệu Hoài Niệm',
    quote: 'Tiếng đài cassette rè rè vang lên trong đêm thanh vắng, mang lại những lời khuyên vàng quý giá cho ngày mai.',
  },
  {
    id: 'badge_chinh_phuc_ca_dem',
    title: 'Kỷ Lục Ca Đêm Bất Tận',
    kicker: 'ĐẤU TRƯỜNG BẾP LỬA SÀI GÒN',
    icon: '🌃',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 10,
    requirementDesc: 'Vượt qua Wave 10 trong chế độ sinh tồn bếp dồn dập Ca Đêm Bất Tận',
    rewardMoney: 150000,
    rewardKarma: { ambition: 25 },
    honorTitle: 'Chiến Binh Bếp Thép',
    quote: 'Khách ùa vào như thác lũ giữa đêm khuya, nhưng ngọn lửa bản lĩnh của người đầu bếp vẫn rực cháy kiên cường!',
  },
  {
    id: 'badge_thu_tho_cam_bi_an',
    title: 'Mật Mã Bức Thư Thỏ Cam',
    kicker: 'HỘI TRUY THÌM DẤU VẾT BÉ GÀ BÔNG',
    icon: '💌',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 5,
    requirementDesc: 'Tìm thấy và giải mã 5 bức thư mật của Bé Gà Bông để lại',
    rewardMoney: 90000,
    rewardKarma: { community: 15, craftsmanship: 10 },
    honorTitle: 'Thám Tử Hẻm Sâu',
    quote: 'Từng nét chữ nghệch ngoạc của chú thỏ cam hé lộ bí mật về nguồn gốc công thức gà giòn trứ danh!',
  },
  {
    id: 'badge_truong_ton_sai_gon',
    title: 'Cột Mốc Mở Rộng Địa Bàn',
    kicker: 'LIÊN HIỆP HỢP TÁC XÃ THƯƠNG MẠI',
    icon: '🚩',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 3,
    requirementDesc: 'Vượt qua thử thách và mở khóa thành công từ Chương 3 trở lên',
    rewardMoney: 200000,
    rewardKarma: { ambition: 20 },
    honorTitle: 'Khai Phá Chân Trời Mới',
    quote: 'Từ con hẻm nhỏ ra tới phố lớn, thương hiệu gà rán bình dân đã khẳng định vị thế vững chắc trong lòng thực khách!',
  },
  {
    id: 'badge_dai_ket_cuc_vien_man',
    title: 'Kỳ Tích Viên Mãn Trăm Năm',
    kicker: 'HỘI ĐỒNG THẨM ĐỊNH VĂN HÓA ĐÔ THÀNH',
    icon: '🏆',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 2,
    requirementDesc: 'Khám phá và đạt được ít nhất 2 kết thúc khác nhau trong 6 đại kết cục',
    rewardMoney: 300000,
    rewardKarma: { craftsmanship: 20, community: 20, ambition: 20 },
    honorTitle: 'Đạo Diễn Vận Mệnh Hẻm 1102',
    quote: 'Mỗi lựa chọn là một con đường, mỗi kết thúc là một áng thiên anh hùng ca về tình người Sài Gòn!',
  },
];

/**
 * Hàm lấy số lượng tiến độ hiện tại cho từng bằng khen
 */
export function getBadgeCurrentProgress(badgeId: HeritageBadgeId, state: GameState): number {
  switch (badgeId) {
    // 1. COOKING
    case 'badge_ban_tay_vang':
      return state.lifetimeStats?.perfectFriedCount ?? 0;

    case 'badge_dung_si_dau_sach': {
      if ((state.dirtyOilViolations ?? 0) > 0 || (state.dirtyOilPenaltyDays ?? 0) > 0) {
        return 0;
      }
      return Math.min(5, state.cleanOilStreakDays ?? 0);
    }

    case 'badge_bac_thay_gia_truyen':
      return (state as any).totalSecretSauceSuccesses ?? (state.secretSauceDay?.buffActive ? 1 : 0);

    case 'badge_bep_lua_than_toc':
      return Math.min(15, state.lifetimeStats?.perfectFriedCount ?? 0);

    case 'badge_phu_thuy_khoai_lac':
      return Math.min(30, Math.floor((state.lifetimeStats?.totalFried ?? 0) * 0.4));

    case 'badge_nghe_si_uot_uot':
      return Math.min(50, Math.floor((state.lifetimeStats?.totalFried ?? 0) * 0.65));

    case 'badge_bep_truong_5_sao':
      return (state.ratings?.taste ?? 4.5) >= 4.9 ? 5 : Math.floor((state.ratings?.taste ?? 4.5));

    case 'badge_chao_gang_khong_nghi':
      return (state.lifetimeStats?.totalBurnt ?? 0) === 0 && (state.day ?? 1) >= 2 ? 1 : 0;

    case 'badge_chuyen_gia_canh_lua':
      return Math.min(15, Math.floor((state.lifetimeStats?.perfectFriedCount ?? 0) * 0.5));

    case 'badge_dai_tiec_hoang_gia':
      return Math.min(10, Math.floor((state.lifetimeStats?.perfectFriedCount ?? 0) * 0.2));

    // 2. SECURITY
    case 'badge_khac_tinh_toi_pham':
      return state.thiefStats?.totalCaught ?? 0;

    case 'badge_mat_than_dan_pho':
      return (state.thiefStats?.totalCaught ?? 0) > 0 ? 1 : 0;

    case 'badge_canh_ve_dem_khuya':
      return Math.min(5, Math.floor((state.day ?? 1) * 0.3));

    case 'badge_chuot_nhat_khiep_so':
      return Math.min(8, state.day ?? 1);

    case 'badge_hiep_si_duong_pho':
      return Math.min(15, (state.day ?? 1) * 2);

    case 'badge_khong_mot_hat_bui':
      return Math.min(20, (state.day ?? 1) * 3);

    case 'badge_hoa_giai_drama':
      return state.seenIncidentIds?.length ?? 0;

    case 'badge_an_ninh_vung_chac':
      return state.staff?.some(s => s.role === 'security') ? 1 : 0;

    // 3. COMMUNITY
    case 'badge_to_dan_pho_nghia_tinh':
      return state.karma?.community ?? 50;

    case 'badge_nha_hao_tam':
      return (state as any).totalCarePackagesSent ?? (state.carePackagesSentDay ? 1 : 0);

    case 'badge_ban_than_thu_cung':
      return (state.petPatio as any)?.totalPettedCount ?? (state.petPatio?.pets?.reduce((acc, p) => acc + (p.pettedToday ? 1 : 0), 0) ?? 0);

    case 'badge_tri_ky_bac_ba':
      return state.loyaltyState?.residents?.['char_01_owner']?.heartLevel ?? 0;

    case 'badge_khau_vi_ruot_hem':
      return Object.values(state.loyaltyState?.residents ?? {}).reduce((acc, r) => acc + (r.specialRequestsFulfilled ?? 0), 0);

    case 'badge_ban_than_co_muoi':
      return state.loyaltyState?.claimedAlleyGiftsHistory?.length ?? 0;

    case 'badge_su_gia_hoa_binh':
      return Object.values(state.loyaltyState?.residents ?? {}).filter(r => (r.heartLevel ?? 0) >= 3).length;

    case 'badge_am_ap_trai_tim':
      return (state.petPatio?.pets?.length ?? 0) >= 2 && state.petPatio?.pets.every(p => p.happiness >= 80) ? 1 : 0;

    case 'badge_chia_ngot_se_bui':
      return Math.min(5, Math.floor((state.karma?.community ?? 50) / 15));

    case 'badge_tieng_cuoi_xom_dao':
      return state.karma?.community ?? 50;

    // 4. OPERATIONS
    case 'badge_vua_giao_hang':
      return (state as any).totalDeliveriesCompleted ?? (state.deliveryRunnerDayCount ?? 0);

    case 'badge_ong_trum_gacha':
      return state.staff?.some(s => s.rarity === 'SSR') ? 1 : 0;

    case 'badge_dai_ban_doanh_ga':
      return state.lifetimeStats?.totalFried ?? 0;

    case 'badge_trieu_phu_hem_sau':
      return state.money ?? 0;

    case 'badge_doi_ngu_tinh_nhue':
      return (state.staff ?? []).filter(s => (s.stars ?? 1) >= 2 || (s.shiftsWorked ?? 0) >= 3).length;

    case 'badge_chuoi_cung_ung_vang':
      return Math.min(8, Math.floor((state.day ?? 1) * 0.8));

    case 'badge_bien_hieu_ruc_ro':
      return Math.max(0, (state.unlockedThemeIds?.length ?? 1) - 1);

    case 'badge_khong_mot_don_huy':
      return Math.min(40, state.lifetimeStats?.totalFried ?? 0);

    case 'badge_sieu_toc_phuc_vu':
      return (state.ratings?.speed ?? 4.0) >= 4.8 ? 5 : Math.floor(state.ratings?.speed ?? 4.0);

    // 5. LEGEND
    case 'badge_nha_su_hoc_hem':
      return state.characterStoryState?.readEpisodeHistory?.length ?? 0;

    case 'badge_huyen_thoai_100_ngay':
      return state.day ?? 1;

    case 'badge_thinh_gia_trung_thanh':
      return (state.lastRadioBroadcastDay ?? 0) > 0 ? Math.min(8, state.day ?? 1) : 0;

    case 'badge_chinh_phuc_ca_dem':
      return (state.endlessRecord?.highestWave ?? 0);

    case 'badge_thu_tho_cam_bi_an':
      return state.unlockedBunnyLetters?.length ?? 0;

    case 'badge_truong_ton_sai_gon':
      return state.currentChapter ?? 1;

    case 'badge_dai_ket_cuc_vien_man':
      return state.achievedEndings?.length ?? 0;

    default:
      return 0;
  }
}
