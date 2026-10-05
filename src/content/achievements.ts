import { HeritageBadge, HeritageBadgeId, GameState } from '../types/game';

export const HERITAGE_BADGES: HeritageBadge[] = [
  // =========================================================================
  // 1. NGHỆ THUẬT BẾP & CHIÊN RÁN (COOKING)
  // =========================================================================
  {
    id: 'badge_ban_tay_vang',
    title: 'Bàn Tay Vàng Làng Gà Rán',
    kicker: 'HỘI ẨM THỰC TRUYỀN THỐNG ĐÔ THÀNH',
    icon: '✨',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 60,
    requirementDesc: 'Chiên đạt 60 mẻ gà giòn rụm hoàn mỹ Perfect',
    rewardMoney: 75000,
    rewardKarma: { craftsmanship: 12 },
    honorTitle: 'Đệ Nhất Bếp Chiên Sài Gòn',
    quote: 'Chảo dầu sôi sùng sục mà nhấc ra ráo hoảnh, lớp da giòn rụm bọc lấy thớ thịt mọng nước. Nghề dạy nghề, đôi tay qua năm tháng đã đạt độ chín của một nghệ nhân.',
  },
  {
    id: 'badge_dung_si_dau_sach',
    title: 'Dũng Sĩ Dầu Sạch ATVSTP',
    kicker: 'THANH TRA AN TOÀN VỆ SINH PHỐ',
    icon: '🛢️',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 7,
    requirementDesc: 'Tuyệt đối giữ chảo dầu vàng óng không để đen suốt 7 ngày liên tiếp',
    rewardMoney: 95000,
    rewardKarma: { craftsmanship: 12, community: 8 },
    honorTitle: 'Tấm Gương Vàng Lương Tâm Nghề Bếp',
    quote: 'Bán buôn cốt ở chữ Tâm. Giọt dầu vàng óng thơm ngát chính là lời cam kết trân trọng sức khỏe của từng đứa trẻ, cụ già trong con hẻm nhỏ.',
  },
  {
    id: 'badge_bac_thay_gia_truyen',
    title: 'Bậc Thầy Nồi Sốt Bí Truyền',
    kicker: 'CÂU LẠC BỘ BẾP TRƯỞNG TRUYỀN THỐNG',
    icon: '🍯',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 6,
    requirementDesc: 'Nấu thành công 6 nồi Sốt Bí Truyền đậm đà hương vị gia truyền',
    rewardMoney: 90000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Phù Thủy Gia Vị Hẻm 1102',
    quote: 'Tỏi lý sơn phi vàng, ớt chỉ thiên cay nồng và mật ong hoa nhãn hòa quyện. Thứ nước sốt sóng sánh ấy đã trở thành ký ức vị giác không thể nào quên.',
  },
  {
    id: 'badge_bep_lua_than_toc',
    title: 'Bếp Lửa Thần Tốc Không Ngừng',
    kicker: 'HIỆP HỘI ĐẦU BẾP ĐÔ THÀNH',
    icon: '🔥',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 20,
    requirementDesc: 'Đạt chuỗi 20 mẻ Perfect liên tiếp không một lần sai sót',
    rewardMoney: 85000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Bàn Tay Không Sai Một Ly',
    quote: 'Khói bốc nghi ngút, tiếng xèo xèo reo vui nhịp nhàng. Khi tâm đã tĩnh thì ngọn lửa dù dữ dội đến mấy cũng phải ngoan ngoãn tuân theo từng nhịp vợt.',
  },
  {
    id: 'badge_phu_thuy_khoai_lac',
    title: 'Phù Thủy Khoai Lắc Xí Muội',
    kicker: 'HỘI HỌC SINH SINH VIÊN HẺM',
    icon: '🍟',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 40,
    requirementDesc: 'Lắc và phục vụ 40 phần khoai tây lắc rong biển & phô mai thơm lừng',
    rewardMoney: 65000,
    rewardKarma: { craftsmanship: 10, community: 8 },
    honorTitle: 'Vua Ăn Vặt Giới Trẻ',
    quote: 'Từng miếng khoai vàng ruộm khoác lên mình lớp áo phô mai mịn màng. Âm thanh lắc hộp rộn rã xua tan đi bao mệt mỏi sau giờ tan trường.',
  },
  {
    id: 'badge_nghe_si_uot_uot',
    title: 'Nghệ Sĩ Nước Ngọt Bật Nắp',
    kicker: 'CÂU LẠC BỘ CÚ ĐÊM SÀI GÒN',
    icon: '🥤',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 65,
    requirementDesc: 'Rót và phục vụ 65 ly nước ngọt có gas mát lạnh chuẩn vị',
    rewardMoney: 60000,
    rewardKarma: { craftsmanship: 10 },
    honorTitle: 'Cứu Tinh Cơn Khát Trưa Hè',
    quote: 'Tiếng xì xà của bọt ga lạnh buốt xua tan cái oi nồng đặc quánh của phố thị. Một ngụm mát lành, trọn vẹn sự sảng khoái.',
  },
  {
    id: 'badge_bep_truong_5_sao',
    title: 'Đầu Bếp Đạt Chuẩn 5.0 Sao',
    kicker: 'CHUYÊN TRANG ẨM THỰC ĐƯỜNG PHỐ',
    icon: '⭐',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 5,
    requirementDesc: 'Duy trì điểm đánh giá Hương Vị trung bình đạt mốc tuyệt đối 5.0 sao',
    rewardMoney: 150000,
    rewardKarma: { craftsmanship: 25 },
    honorTitle: 'Hương Vị Hoàn Hảo Tuyệt Đối',
    quote: 'Chinh phục được khẩu vị của cả những cụ già khó tính nhất lẫn đám thanh niên sành ăn. Danh tiếng không đến từ biển hiệu mà đọng lại nơi đầu lưỡi.',
  },
  {
    id: 'badge_chao_gang_khong_nghi',
    title: 'Chảo Gang Vàng Không Vết Cháy',
    kicker: 'BAN THANH TRA CHẤT LƯỢNG MÓN',
    icon: '🍳',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 1,
    requirementDesc: 'Hoàn thành 1 ca bán giờ cao điểm bận rộn mà không để cháy khét bất kỳ mẻ nào',
    rewardMoney: 75000,
    rewardKarma: { craftsmanship: 12 },
    honorTitle: 'Kỷ Luật Thép Nơi Gian Bếp',
    quote: 'Khách giục giã dồn dập, tiếng chuông réo vang, nhưng bàn tay vẫn bình thản canh đúng từng tích tắc. Sự điềm tĩnh chính là vũ khí của bậc thầy.',
  },
  {
    id: 'badge_chuyen_gia_canh_lua',
    title: 'Chuyên Gia Canh Lửa Điêu Luyện',
    kicker: 'HỘI NGHỆ NHÂN BẾP LỬA GIA ĐỊNH',
    icon: '⏱️',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 20,
    requirementDesc: 'Nhấc vợt gà ở 0.5s đỉnh cao của vùng Perfect đủ 20 lần',
    rewardMoney: 85000,
    rewardKarma: { craftsmanship: 18 },
    honorTitle: 'Đôi Mắt Tinh Anh',
    quote: 'Chỉ cần lắng tai nghe tiếng dầu nổ tí tách và màu sắc bọt lăn tăn là biết miếng gà đã đạt tới độ thăng hoa giòn rụm.',
  },
  {
    id: 'badge_dai_tiec_hoang_gia',
    title: 'Đại Tiệc Combo Gà Cay Mật Ong',
    kicker: 'HỘI SÀNH ĂN HẺM 1102',
    icon: '🍗',
    category: 'cooking',
    categoryLabel: 'Nghệ Thuật Bếp',
    targetCount: 15,
    requirementDesc: 'Phục vụ thành công 15 khay combo đại tiệc đầy đủ món chính, phụ và nước',
    rewardMoney: 110000,
    rewardKarma: { craftsmanship: 15, ambition: 10 },
    honorTitle: 'Bữa Tiệc Thịnh Soạn Xóm Hẻm',
    quote: 'Mâm gà bày biện thịnh soạn, nước sốt óng ánh dưới ánh đèn vàng, mang lại niềm hân hoan sum vầy cho từng bàn tiệc của bà con xóm hẻm.',
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
    targetCount: 5,
    requirementDesc: 'Bắt sống hoặc hỗ trợ tóm gọn kẻ gian bảo vệ con hẻm 5 lần',
    rewardMoney: 130000,
    rewardKarma: { community: 20 },
    honorTitle: 'Hiệp Sĩ Bắt Cướp Hẻm 1102',
    quote: 'Bảo vệ từng chiếc xe, cái ví của thực khách như chính tài sản của người thân trong nhà. Gian tà nhìn thấy là chùn bước!',
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
    rewardMoney: 95000,
    rewardKarma: { community: 15 },
    honorTitle: 'Tay Nhanh Hơn Đạo Tặc',
    quote: 'Tên trộm vừa thò tay định thó hộp tiền đã bị tóm gọn tại trận. Phản xạ bén nhót của người buôn bán dày dặn sương gió.',
  },
  {
    id: 'badge_canh_ve_dem_khuya',
    title: 'Canh Vệ Đêm Khuya Hẻm Vắng',
    kicker: 'TỔ TUẦN TRA ĐÊM HẺM 1102',
    icon: '🌙',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 7,
    requirementDesc: 'Hoàn thành 7 ca bán đêm (21h - 6h sáng) giữ vững bình an cho xóm',
    rewardMoney: 130000,
    rewardKarma: { community: 18, ambition: 12 },
    honorTitle: 'Ngọn Đèn Sáng Trong Đêm Tối',
    quote: 'Ánh đèn vàng quán gà giữa đêm khuya mang lại cảm giác bình yên ấm áp cho những bước chân muộn màng tìm chốn nương náu.',
  },
  {
    id: 'badge_chuot_nhat_khiep_so',
    title: 'Khắc Tinh Chuột Cống Đêm',
    kicker: 'ĐỘI VỆ SINH MÔI TRƯỜNG PHƯỜNG',
    icon: '🐀',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 10,
    requirementDesc: 'Xua đuổi lũ chuột cống ngõ hẻm bảo vệ kho nguyên liệu 10 lần',
    rewardMoney: 65000,
    rewardKarma: { craftsmanship: 10, community: 8 },
    honorTitle: 'Kho Lương Thực Bất Khả Xâm Phạm',
    quote: 'Kho hàng sạch bóng không một vết tích gặm nhấm, từng thùng bột tẩm ướp được bảo quản tinh tươm đúng chuẩn nhà nghề.',
  },
  {
    id: 'badge_hiep_si_duong_pho',
    title: 'Hiệp Sĩ Sạch Phố Đẹp Hẻm',
    kicker: 'HỘI PHỤ NỮ & THANH NIÊN TỰ QUẢN',
    icon: '🧹',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 25,
    requirementDesc: 'Quét dọn sạch sẽ 25 đống rác và lá rụng giữ sạch đẹp trước hiên quán',
    rewardMoney: 70000,
    rewardKarma: { community: 20 },
    honorTitle: 'Con Hẻm Xanh Sạch Đẹp',
    quote: 'Hiên quán lúc nào cũng tinh tươm thoáng đãng, quét sạch bụi bặm phố phường để đón chào những nụ cười thân thiện.',
  },
  {
    id: 'badge_khong_mot_hat_bui',
    title: 'Bàn Ăn Sạch Bóng Không Tì Vết',
    kicker: 'ĐOÀN ĐÁNH GIÁ TRẢI NGHIỆM KHÁCH HÀNG',
    icon: '✨',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 35,
    requirementDesc: 'Lau dọn sạch bóng 35 bàn ăn sau khi khách dùng bữa xong',
    rewardMoney: 85000,
    rewardKarma: { craftsmanship: 15 },
    honorTitle: 'Chu Đáo Tận Tâm',
    quote: 'Chiếc khăn ẩm lướt nhẹ, mặt bàn sáng bóng không vương một giọt dầu mỡ thừa. Sự tôn trọng khách hàng thể hiện ở chiếc bàn sạch tinh tươm.',
  },
  {
    id: 'badge_hoa_giai_drama',
    title: 'Sứ Giả Hòa Giải Xóm Giềng',
    kicker: 'BAN HÒA GIẢI CƠ SỞ KHỐI PHỐ',
    icon: '🕊️',
    category: 'security',
    categoryLabel: 'An Ninh Trật Tự',
    targetCount: 10,
    requirementDesc: 'Xử lý êm thấm 10 sự cố drama và xích mích phát sinh trong khu phố',
    rewardMoney: 100000,
    rewardKarma: { community: 25 },
    honorTitle: 'Cái Đầu Lạnh Trái Tim Ấm',
    quote: 'Chuyện to hóa nhỏ, chuyện nhỏ hóa không. Bằng sự chân thành và một đĩa gà giòn nóng hổi, mọi khúc mắc xóm giềng đều tan thành tiếng cười.',
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
    rewardMoney: 85000,
    rewardKarma: { ambition: 12, community: 12 },
    honorTitle: 'Trụ Cột Vững Vàng',
    quote: 'Có bóng dáng người bảo vệ cần mẫn trước hiên, thực khách an tâm thưởng thức trọn vẹn bữa ăn mà không chút âu lo.',
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
    targetCount: 95,
    requirementDesc: 'Tích lũy từ 95 điểm Karma Tình Thân Hẻm trở lên',
    rewardMoney: 150000,
    rewardKarma: { community: 25 },
    honorTitle: 'Mái Ấm Nghĩa Tình Sài Gòn',
    quote: 'Không đơn thuần là buôn bán kiếm lời, nơi đây đã trở thành điểm tựa sẻ chia ấm áp của bà con lao động nghèo giữa đô thị hoa lệ.',
  },
  {
    id: 'badge_nha_hao_tam',
    title: 'Gia Đình Tiếp Tế Tương Trợ',
    kicker: 'CỘNG ĐỒNG BẰNG HỮU TIỆM GÀ SÀI GÒN',
    icon: '🎁',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 3,
    requirementDesc: 'Gửi 3 gói quà tiếp tế (Gà, Quỹ dầu, Tip) cho bạn bè đồng hành',
    rewardMoney: 70000,
    rewardKarma: { community: 18 },
    honorTitle: 'Nhà Hảo Tâm Xóm Đạo',
    quote: 'Lá lành đùm lá rách. Lúc gian khó tối lửa tắt đèn có nhau, từng thớ thịt tươi và can dầu sạch gửi trao là vạn tấm lòng.',
  },
  {
    id: 'badge_ban_than_thu_cung',
    title: 'Đại Sứ Yêu Thương Thú Cưng',
    kicker: 'TRẠM CỨU HỘ ĐỘNG VẬT CỎ HẺM 1102',
    icon: '🐾',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 7,
    requirementDesc: 'Chăm sóc và vỗ về Cậu Vàng & Bé Mướp đạt mốc 7 ngày chu đáo',
    rewardMoney: 65000,
    rewardKarma: { community: 18 },
    honorTitle: 'Người Bạn Tri Kỷ Của Cậu Vàng',
    quote: 'Cậu Vàng vẫy đuôi quấn quýt, Bé Mướp lười biếng cuộn tròn sưởi nắng. Nơi chốn dung dưỡng sự sống thuần khiết nhất.',
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
    rewardMoney: 180000,
    rewardKarma: { community: 30 },
    honorTitle: 'Hậu Duệ Truyền Thừa Bác Ba',
    quote: 'Bao thăng trầm cuộc đời gói gọn trong nụ cười đôn hậu của Bác Ba. Lời dặn dò chân tình của thế hệ đi trước chính là kim chỉ nam cho sự nghiệp.',
  },
  {
    id: 'badge_khau_vi_ruot_hem',
    title: 'Bậc Thầy Bắt Trúng Khẩu Vị Ruột',
    kicker: 'CÂU LẠC BỘ THỰC KHÁCH TRUNG THÀNH',
    icon: '🎯',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 35,
    requirementDesc: 'Phục vụ trúng phóc 35 lần món khoái khẩu của cư dân thân thiết',
    rewardMoney: 110000,
    rewardKarma: { community: 18, craftsmanship: 12 },
    honorTitle: 'Hiểu Lòng Thực Khách',
    quote: 'Khách vừa bước chân qua bậu cửa, chưa kịp mở lời thì món gà đúng gu đã bưng ra nghi ngút khói. Đó là sự thấu hiểu từ trái tim.',
  },
  {
    id: 'badge_ban_than_co_muoi',
    title: 'Hòm Quà Thắm Đượm Tình Quê',
    kicker: 'BÀ CON TỔ DÂN PHỐ HẺM SÂU',
    icon: '📦',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 6,
    requirementDesc: 'Mở nhận 6 bưu kiện Quà Quê tiếp tế từ bà con cư dân thân tình',
    rewardMoney: 90000,
    rewardKarma: { community: 18 },
    honorTitle: 'Được Cả Xóm Yêu Thương',
    quote: 'Nải chuối vườn, chai mật ong rừng hay gói tiêu sọ... Những món quà quê mộc mạc thấm đượm tình người đất Phương Nam.',
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
    rewardMoney: 125000,
    rewardKarma: { community: 22 },
    honorTitle: 'Nhịp Cầu Nối Những Bờ Vui',
    quote: 'Từ cô bán vé số dạo đến anh cán bộ khu phố, ai nấy đều xem quán gà là chốn thân tình dừng chân tâm sự.',
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
    rewardMoney: 75000,
    rewardKarma: { community: 18 },
    honorTitle: 'Vòng Tay Ấm Áp',
    quote: 'Chó mừng ríu rít, mèo dụi đầu rừ rừ sưởi nắng. Một hiên nhà tràn ngập lòng nhân ái và sự bình yên.',
  },
  {
    id: 'badge_chia_ngot_se_bui',
    title: 'Bữa Cơm Nghĩa Tình Lao Động Nghèo',
    kicker: 'QUỸ TỪ THIỆN HẺM 1102',
    icon: '🍲',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 6,
    requirementDesc: 'Tặng phần ăn miễn phí cho người già neo đơn & người lao động cơ nhỡ 6 lần',
    rewardMoney: 85000,
    rewardKarma: { community: 30 },
    honorTitle: 'Tấm Lòng Vàng Giữa Đời Thường',
    quote: 'Một miếng khi đói bằng một gói khi no. Bán buôn để mưu sinh, nhưng tấm lòng hào sảng mới là thứ nuôi dưỡng tâm hồn.',
  },
  {
    id: 'badge_tieng_cuoi_xom_dao',
    title: 'Ngôi Nhà Chung Của Hẻm 1102',
    kicker: 'ĐẠI DIỆN 36 HỘ DÂN KHU PHỐ',
    icon: '🏡',
    category: 'community',
    categoryLabel: 'Tình Làng Nghĩa Xóm',
    targetCount: 100,
    requirementDesc: 'Đạt mốc tuyệt đối 100 điểm Karma Tình Thân Cộng Đồng',
    rewardMoney: 250000,
    rewardKarma: { community: 35 },
    honorTitle: 'Trái Tim Của Xóm Hẻm',
    quote: 'Dẫu vật đổi sao dời, tình làng nghĩa xóm nơi con hẻm nhỏ vẫn bền chặt như keo sơn nhờ ngọn lửa ấm từ gian bếp Tiệm Gà.',
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
    targetCount: 20,
    requirementDesc: 'Xử lý và giao thành công 20 đơn hẻm Delivery Runner đúng hẹn',
    rewardMoney: 110000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Tay Lái Lụa Ngõ Ngách Sài Gòn',
    quote: 'Ngõ sâu hun hút hay triều cường ngập lối, hộp gà giòn rụm vẫn đến tay khách còn bốc khói nghi ngút. Chữ tín quý hơn vàng.',
  },
  {
    id: 'badge_ong_trum_gacha',
    title: 'Đại Gia Chiêu Mộ Nhân Tài',
    kicker: 'VIỆN QUẢN TRỊ NHÂN LỰC HẺM 1102',
    icon: '👑',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 1,
    requirementDesc: 'Chiêu mộ thành công ít nhất 1 nhân viên cấp bậc huyền thoại SSR',
    rewardMoney: 160000,
    rewardKarma: { ambition: 18 },
    honorTitle: 'Đại Bản Doanh Ngũ Hổ Tướng',
    quote: 'Dụng nhân như dụng mộc. Chiêu mộ được hiền tài phò tá, cơ nghiệp tiệm gà vững chãi như bàn thạch.',
  },
  {
    id: 'badge_dai_ban_doanh_ga',
    title: 'Đại Bản Doanh Gà Giòn Đô Thành',
    kicker: 'HIỆP HỘI DOANH NHÂN TRẺ SÀI GÒN',
    icon: '🍗',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 300,
    requirementDesc: 'Phục vụ chu đáo cho 300 lượt thực khách ghé thăm tiệm gà',
    rewardMoney: 220000,
    rewardKarma: { ambition: 20 },
    honorTitle: 'Cột Cờ Ẩm Thực Hẻm 1102',
    quote: 'Tiếng cười nói rộn rã sớm hôm. Từ một góc quán chật hẹp, nay đã trở thành chốn dừng chân không thể thiếu của hàng trăm thực khách.',
  },
  {
    id: 'badge_trieu_phu_hem_sau',
    title: 'Cơ Nghiệp Vững Vàng Tự Lập',
    kicker: 'NGÂN HÀNG PHÁT TRIỂN KINH TẾ ĐÔ THỊ',
    icon: '💰',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 2000000,
    requirementDesc: 'Tích lũy quỹ tiền mặt kinh doanh đạt mốc 2.000.000đ từ đôi bàn tay trắng',
    rewardMoney: 150000,
    rewardKarma: { ambition: 25 },
    honorTitle: 'Bản Lĩnh Doanh Nhân Đô Thành',
    quote: 'Ky cóp từng đồng bạc lẻ bằng mồ hôi nước mắt lương thiện. Cơ nghiệp tiền triệu vững vàng trước mọi biến động thời cuộc.',
  },
  {
    id: 'badge_doi_ngu_tinh_nhue',
    title: 'Đội Ngũ Nhân Lực Tinh Nhuệ',
    kicker: 'TRUNG TÂM PHÁT TRIỂN NGHỀ NGHIỆP',
    icon: '👥',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 3,
    requirementDesc: 'Đào tạo nâng cấp 3 nhân viên đạt cấp độ 2 trở lên thạo việc',
    rewardMoney: 100000,
    rewardKarma: { ambition: 18 },
    honorTitle: 'Nhà Lãnh Đạo Xuất Sắc',
    quote: 'Nhân viên thấu việc, nhịp nhàng phối hợp như bản hòa tấu nơi gian bếp lửa hồng. Một người vì mọi người.',
  },
  {
    id: 'badge_chuoi_cung_ung_vang',
    title: 'Bậc Thầy Mặc Cả Chợ Đầu Mối',
    kicker: 'BAN QUẢN LÝ CHỢ ĐẦU MỐI BÌNH ĐIỀN',
    icon: '🥬',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 10,
    requirementDesc: 'Thương lượng thành công nguồn hàng tươi giá sỉ chiết khấu cao 10 lần',
    rewardMoney: 90000,
    rewardKarma: { ambition: 18 },
    honorTitle: 'Đôi Mắt Tinh Đời',
    quote: 'Chọn từng miếng thịt gà tươi ngon với mức giá hời nhất, vừa giữ trọn chất lượng món ăn vừa tối ưu hóa chi phí vận hành.',
  },
  {
    id: 'badge_bien_hieu_ruc_ro',
    title: 'Cơ Ngơi Khang Trang Phố Hẻm',
    kicker: 'HỘI ĐÔ THỊ & KHÔNG GIAN SỐNG SÀI GÒN',
    icon: '🏮',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 2,
    requirementDesc: 'Nâng cấp không gian quán hoặc mở rộng mặt bằng đạt Cấp 2 trở lên',
    rewardMoney: 80000,
    rewardKarma: { craftsmanship: 12, ambition: 12 },
    honorTitle: 'Góc Quán Khang Trang Đầm Ấm',
    quote: 'Không cần phô trương hào nhoáng, góc quán sạch bóng, ánh đèn ấm áp cùng mặt bằng khang trang tự khắc níu chân bà con ghé lại.',
  },
  {
    id: 'badge_khong_mot_don_huy',
    title: 'Kỷ Lục Phục Vụ Không Lời Phàn Nàn',
    kicker: 'HIỆP HỘI BẢO VỆ NGƯỜI TIÊU DÙNG',
    icon: '⭐',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 60,
    requirementDesc: 'Phục vụ liên tiếp 60 thực khách mà không để bất kỳ ai bực bội bỏ về',
    rewardMoney: 120000,
    rewardKarma: { craftsmanship: 18, community: 12 },
    honorTitle: 'Lòng Kiên Nhẫn Vàng',
    quote: 'Nụ cười luôn nở trên môi, phục vụ nhanh nhẹn chu đáo. Đến bằng sự tò mò, đi về bằng sự thỏa mãn và trân trọng.',
  },
  {
    id: 'badge_sieu_toc_phuc_vu',
    title: 'Tốc Độ Phục Vụ Tia Chớp',
    kicker: 'CÂU LẠC BỘ RUSH HOUR SÀI GÒN',
    icon: '⚡',
    category: 'operations',
    categoryLabel: 'Vận Hành & Giao Vận',
    targetCount: 5,
    requirementDesc: 'Duy trì điểm đánh giá Tốc Độ phục vụ trung bình từ 4.8 sao trở lên',
    rewardMoney: 95000,
    rewardKarma: { ambition: 15 },
    honorTitle: 'Đôi Tay Thoăn Thoắt',
    quote: 'Khách vừa dứt lời gọi món, hộp gà giòn đã trao tận tay nóng hôi hổi. Tốc độ làm nên đẳng cấp của tiệm ăn phố thị.',
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
    targetCount: 10,
    requirementDesc: 'Lắng nghe và hoàn thành 10 tập Ký sự phân nhánh cuộc đời cư dân',
    rewardMoney: 120000,
    rewardKarma: { community: 15, craftsmanship: 15 },
    honorTitle: 'Người Gìn Giữ Ký Ức Hẻm 1102',
    quote: 'Mỗi cư dân là một mảnh ghép của Sài Gòn. Từng nỗi niềm buồn vui, thăng trầm được nâng niu trọn vẹn trong trang nhật ký con hẻm.',
  },
  {
    id: 'badge_huyen_thoai_100_ngay',
    title: 'Huyền Thoại Trăm Ngày Gà Rán',
    kicker: 'TỔ DÂN PHỐ & TOÀN THỂ BÀ CON HẺM 1102',
    icon: '🏛️',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 100,
    requirementDesc: 'Đứng vững và kinh doanh đủ 100 ngày kiên cường vượt qua bao giông bão',
    rewardMoney: 600000,
    rewardKarma: { community: 30, craftsmanship: 30, ambition: 30 },
    honorTitle: 'Tượng Đài Bất Tử Hẻm 1102',
    quote: 'Trăm ngày đỏ lửa gian bếp, trăm ngày nghĩa tình keo sơn. Tiệm Gà Nhà Tui không chỉ là tiệm ăn, mà là một phần linh hồn của phố xóm.',
  },
  {
    id: 'badge_thinh_gia_trung_thanh',
    title: 'Thính Giả Tri Âm Đài Đêm FM 99.9',
    kicker: 'ĐÀI TIẾNG NÓI NHÂN DÂN TP.HCM',
    icon: '📻',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 10,
    requirementDesc: 'Lắng nghe làn sóng FM 99.9 MHz và tiếp nhận lời khuyên Buff Đêm đủ 10 lần',
    rewardMoney: 95000,
    rewardKarma: { craftsmanship: 12, community: 12 },
    honorTitle: 'Giai Điệu Hoài Niệm',
    quote: 'Tiếng đài radio rè rè vang lên trong đêm vắng, những ca khúc xưa cũ cùng lời khuyên mộc mạc tiếp thêm nghị lực cho ngày mới.',
  },
  {
    id: 'badge_chinh_phuc_ca_dem',
    title: 'Kỷ Lục Ca Đêm Bất Tận',
    kicker: 'ĐẤU TRƯỜNG BẾP LỬA SÀI GÒN',
    icon: '🌃',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 12,
    requirementDesc: 'Vượt qua Wave 12 trong chế độ sinh tồn bếp dồn dập Ca Đêm Bất Tận',
    rewardMoney: 180000,
    rewardKarma: { ambition: 30 },
    honorTitle: 'Chiến Binh Bếp Thép',
    quote: 'Khách ùa vào như thác đổ lúc nửa đêm, nhưng ngọn lửa bản lĩnh của người đứng bếp vẫn rực cháy can trường không nao núng.',
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
    rewardMoney: 100000,
    rewardKarma: { community: 18, craftsmanship: 12 },
    honorTitle: 'Thám Tử Hẻm Sâu',
    quote: 'Từng nét vẽ nghệch ngoạc của chú thỏ hé lộ bí mật về cội nguồn công thức gà rán vang danh khắp các ngõ ngách.',
  },
  {
    id: 'badge_truong_ton_sai_gon',
    title: 'Cột Mốc Mở Rộng Địa Bàn',
    kicker: 'LIÊN HIỆP HỢP TÁC XÃ THƯƠNG MẠI',
    icon: '🚩',
    category: 'legend',
    categoryLabel: 'Huyền Thoại & Sử Ký',
    targetCount: 3,
    requirementDesc: 'Vượt qua thử thách và chuyển dời mặt bằng thành công từ Chương 3 trở lên',
    rewardMoney: 250000,
    rewardKarma: { ambition: 25 },
    honorTitle: 'Khai Phá Chân Trời Mới',
    quote: 'Từ góc hẻm nhỏ ra tới mặt tiền phố lớn, thương hiệu gà rán bình dân đã hiên ngang khẳng định chỗ đứng vững chắc.',
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
    rewardMoney: 350000,
    rewardKarma: { craftsmanship: 25, community: 25, ambition: 25 },
    honorTitle: 'Đạo Diễn Vận Mệnh Hẻm 1102',
    quote: 'Mỗi quyết định là một ngã rẽ cuộc đời. Những kết thúc đọng lại niềm xúc động sâu xa về tình người và nghĩa khí Sài Gòn.',
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
      return Math.min(7, state.cleanOilStreakDays ?? 0);
    }

    case 'badge_bac_thay_gia_truyen':
      return (state as any).totalSecretSauceSuccesses ?? (state.secretSauceDay?.buffActive ? 1 : 0);

    case 'badge_bep_lua_than_toc':
      return Math.min(20, state.lifetimeStats?.perfectFriedCount ?? 0);

    case 'badge_phu_thuy_khoai_lac':
      return Math.min(40, Math.floor((state.lifetimeStats?.totalFried ?? 0) * 0.4));

    case 'badge_nghe_si_uot_uot':
      return Math.min(65, Math.floor((state.lifetimeStats?.totalFried ?? 0) * 0.65));

    case 'badge_bep_truong_5_sao':
      return (state.ratings?.taste ?? 4.5) >= 4.9 ? 5 : Math.floor((state.ratings?.taste ?? 4.5));

    case 'badge_chao_gang_khong_nghi':
      return (state.lifetimeStats?.totalBurnt ?? 0) === 0 && (state.day ?? 1) >= 2 ? 1 : 0;

    case 'badge_chuyen_gia_canh_lua':
      return Math.min(20, Math.floor((state.lifetimeStats?.perfectFriedCount ?? 0) * 0.5));

    case 'badge_dai_tiec_hoang_gia':
      return Math.min(15, Math.floor((state.lifetimeStats?.perfectFriedCount ?? 0) * 0.2));

    // 2. SECURITY
    case 'badge_khac_tinh_toi_pham':
      return state.thiefStats?.totalCaught ?? 0;

    case 'badge_mat_than_dan_pho':
      return (state.thiefStats?.totalCaught ?? 0) > 0 ? 1 : 0;

    case 'badge_canh_ve_dem_khuya':
      return Math.min(7, Math.floor((state.day ?? 1) * 0.3));

    case 'badge_chuot_nhat_khiep_so':
      return Math.min(10, state.day ?? 1);

    case 'badge_hiep_si_duong_pho':
      return Math.min(25, (state.day ?? 1) * 2);

    case 'badge_khong_mot_hat_bui':
      return Math.min(35, (state.day ?? 1) * 3);

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
      return Math.min(6, Math.floor((state.karma?.community ?? 50) / 15));

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
      return Math.min(10, Math.floor((state.day ?? 1) * 0.8));

    case 'badge_bien_hieu_ruc_ro': {
      const cartLevel = typeof state.upgrades?.cart === 'object' ? (state.upgrades.cart.currentLevel ?? 1) : Number(state.upgrades?.cart ?? 1);
      const isCh2Plus = (state.currentChapter ?? 1) >= 2;
      return (isCh2Plus || cartLevel >= 2) ? 2 : 1;
    }

    case 'badge_khong_mot_don_huy':
      return Math.min(60, state.lifetimeStats?.totalFried ?? 0);

    case 'badge_sieu_toc_phuc_vu':
      return (state.ratings?.speed ?? 4.0) >= 4.8 ? 5 : Math.floor(state.ratings?.speed ?? 4.0);

    // 5. LEGEND
    case 'badge_nha_su_hoc_hem':
      return state.characterStoryState?.readEpisodeHistory?.length ?? 0;

    case 'badge_huyen_thoai_100_ngay':
      return state.day ?? 1;

    case 'badge_thinh_gia_trung_thanh':
      return (state.lastRadioBroadcastDay ?? 0) > 0 ? Math.min(10, state.day ?? 1) : 0;

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
