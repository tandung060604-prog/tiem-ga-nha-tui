import { NonEmpty, StarRating } from '../types/game';

export interface ReviewTemplate {
  criteria: keyof StarRating;
  topic: string;
  minStars: number;
  maxStars: number;
  text: string;
  tags: string[];
}

// Ngân hàng mẫu Review bắt trend GenZ, phong phú ngữ nghĩa và phản ánh chân thực từng sự cố trong ngày
export const PROCEDURAL_REVIEW_TEMPLATES: ReviewTemplate[] = [
  // ==========================================
  // SỰ CỐ 1: LÊN SAI MÓN (wrong_order) - 1..2 sao
  // ==========================================
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Trời ơi tin được không, tui order [ORDER] mà tiệm bưng ra cái món gì đâu không á! Ăn nói xà lơ dị? 1 sao trừ 100 điểm thanh lịch!',
    tags: ['#GiaoNhamMon', '#AnNoiXaLo', '#XuCaNa']
  },
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Nay đầu bếp bị người yêu đá hay sao mà lên sai món tùm lum vậy trời? Gọi đằng giao một nẻo, tức muốn trào đờm!',
    tags: ['#GiaoNhamMon', '#LenSaiMon', '#DauBepLuLan']
  },
  {
    criteria: 'speed',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Bảng hiệu nhìn xịn mà làm ăn như giỡn mặt khách dị? Giao nhầm món xong còn không xin lỗi, cạch mặt tiệm từ nay!',
    tags: ['#GiaoNhamMon', '#CachMat', '#BocPhot']
  },
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Lần đầu ghé tiệm gà Bác Ba và cũng là lần cuối! Ship nhầm món cho khách mà thái độ huề cả làng, trap khách trắng trợn!',
    tags: ['#GiaoNhamMon', '#TrapKhach', '#SaiDon']
  },

  // ==========================================
  // SỰ CỐ 2: KHÁCH BỎ VỀ / MISS ĐƠN (missed_order) - 1..2 sao
  // ==========================================
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Đợi gà mà ngỡ như đợi crush hồi âm, muốn mọc rễ ở quán luôn á sếp ơi! Đói hoa cả mắt cuối cùng phải bỏ về ăn mì tôm 😤',
    tags: ['#ChoMocRe', '#NhuRuaBo', '#XiuNgang']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Khách đứng đợi tràn ra đầu hẻm mà tiệm làm rề rà phát bực. 40 phút không ra được một dĩa gà, flop toàn tập!',
    tags: ['#FlopToanTap', '#QuaTai', '#NaoLoanHem']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Đợi lâu tới mức người yêu giận đòi chia tay luôn rồi đồ ăn mới ra... 1 sao vì làm tổn thương sâu sắc tình cảm lứa đôi!',
    tags: ['#TonThuongTinhCam', '#ChoDoiLaHanhPhuc', '#ChiaTay']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Huhu đói lả người giữa trưa nắng Sài Gòn, nhìn bàn bên nhai rôm rốp mà mình đứng đợi mòn mỏi. Tuyển thêm người đi chủ quán ơi!',
    tags: ['#DoiLaNguoi', '#ChamTietNhiet', '#ThieuNhanSu']
  },

  // ==========================================
  // SỰ CỐ 3: GÀ CHÁY KHÉT (burnt_food) - 1..2 sao
  // ==========================================
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Gà chiên bị khét đen thùi lùi như tiền đồ của mình vậy á. Cắn một miếng đắng nghét khóc thét, cứu tui trời ơi!',
    tags: ['#GaKhetDen', '#DangNghet', '#Khocthet']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Miếng gà cháy đen như than củi, vỏ đắng nghét mà bên trong thì khô queo. Bếp ơi làm ơn có tâm giùm xíu đi ạ!',
    tags: ['#ChayKhet', '#CanhLuaLaiDi', '#DangLong']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Cắn miếng da gà tính tận hưởng mà vị khét lẹt nồng nặc cả khoang miệng. Nay bếp lơ là dữ nha, trừ sạch điểm hương vị!',
    tags: ['#KhetLet', '#TruDiem', '#ThatVong']
  },

  // ==========================================
  // SỰ CỐ 4: DẦU ĐEN / MẤT VỆ SINH (dirty_oil) - 1..2 sao
  // ==========================================
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Dầu chiên đen sì như hắc ín, miếng gà bám đầy cặn đen. Chủ tiệm tiếc tiền thay dầu hay gì? Ăn xong về ôm bụng cả đêm!',
    tags: ['#DauDen', '#DauDenXi', '#BaoVeATTP']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Nồng nặc mùi dầu cũ khét lẹt, ăn hai miếng là ngấy tận óc. Làm ăn vầy rồi sao giữ chân khách quen được Bác Ba?',
    tags: ['#DauDen', '#DauCuKhet', '#NgayTanOc']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Miếng gà sũng dầu cũ ngả màu nâu đen, nhìn mất vệ sinh thực sự. Đề nghị đoàn kiểm tra ATTP ghé thăm đột xuất!',
    tags: ['#DauDen', '#DauBan', '#MatVeSinh']
  },

  // ==========================================
  // SỰ CỐ 5: GIÁ MẮC / CHẶT CHÉM (expensive) - 2..3 sao
  // ==========================================
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Ủa bán gà dát vàng 24k hay sao mà chém giá khét lẹt dị? Ăn xong mở ví ra thấy bay màu nửa tháng tiền trọ, khóc ròng!',
    tags: ['#GiaTrenTroi', '#BayMauTienTro', '#TrapGia']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Miếng gà bé xíu xiu bằng nắm tay mà giá cao ngất ngưởng. Giá này chỉ dành cho đại gia chứ sinh viên tụi em xin kiếu!',
    tags: ['#GiaChatChua', '#KhocRong', '#KhongDangTien']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Đồ ăn cũng tạm được mà bill tính ra chát chúa quá, không có combo hay voucher gì hết trơn. Chắc không dám quay lại lần hai.',
    tags: ['#GiaChat', '#ThieuVoucher', '#CanCanNhac']
  },

  // ==========================================
  // SỰ CỐ 6: KHÔNG GIAN NÓNG / CHẬT (bad_space) - 2..3 sao
  // ==========================================
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Trời SG 38 độ hầm hập mà quán ngồi ghế nhựa vỉa hè khói bụi tạt vô mặt, ăn miếng gà mà mồ hôi ướt đẫm cả áo!',
    tags: ['#NongXiuNgang', '#GheNhuaBui', '#CanMayLanh']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Quán trong hẻm chật chội chen chúc nhau ngột ngạt ghê. Hy vọng chủ tiệm sớm mở rộng không gian cho thoáng đãng hơn.',
    tags: ['#KhongGianChat', '#ChenChuc', '#NgotNgot']
  },

  // ==========================================
  // ĐÁNH GIÁ TỐT: KHÔNG GIAN ĐẸP (great_space) - 4..5 sao
  // ==========================================
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 4,
    maxStars: 5,
    text: 'Góc check-in Gà Bông cưng xỉu up xỉu down! Máy lạnh mát rượi, nhạc lofi chill phết, chụp 800 tấm hình sống ảo cháy máy!',
    tags: ['#CheckInGaBong', '#SongAoChayMay', '#ChillHetNuocCham']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 4,
    maxStars: 5,
    text: 'View phòng kính nhìn ra hẻm phố lung linh cực sang! Không gian ấm cúng, vừa ăn gà giòn vừa tâm sự với người yêu là số dách.',
    tags: ['#KhongGian10Diem', '#ViewSangXin', '#ChillPhoc']
  },

  // ==========================================
  // ĐÁNH GIÁ TỐT: GIÁ RẺ HẠT DẺ (cheap_price) - 4..5 sao
  // ==========================================
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Rẻ rúng bất ngờ luôn á trời! Combo no cành hông mà giá học sinh sinh viên siêu hạt dẻ. Chân ái cứu đói cuối tháng là đây!',
    tags: ['#GiaHatDe', '#CuuDoiCuoiThang', '#ChanAiGenZ']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Ăn ngập mặt từ gà giòn đến khoai lắc phô mai mà chia ra mỗi đứa có mấy chục ngàn. Quá hời cho một bữa đại tiệc thịnh soạn!',
    tags: ['#SieuHoi', '#GiaBinhDan', '#10DiemKhongCoNhung']
  },

  // ==========================================
  // ĐÁNH GIÁ TỐT: TỐC ĐỘ PHỤC VỤ SIÊU NHANH (fast_speed) - 4..5 sao
  // ==========================================
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Nhanh như một cơn gió! Vừa quét mã xong tính ngồi lướt TikTok thì khay gà nóng hổi đã bưng ra trước mặt. Tốc độ đỉnh chóp!',
    tags: ['#NhanhChopNhoang', '#TocDoDinhChop', '#KhongChoDoi']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Phục vụ nhanh hơn người yêu cũ trở mặt! Gà bốc khói nghi ngút, giòn tan rôm rốp vừa thổi vừa ăn cưng xỉu!',
    tags: ['#NhanhNhuGio', '#NongHoiGionTan', '#10Diem']
  },

  // ==========================================
  // ĐÁNH GIÁ TỐT: GÀ VÀNG GIÒN PERFECT (perfect_food) - 5 sao
  // ==========================================
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Đỉnh nóc kịch trần bay phấp phới! Da gà giòn rụm rôm rốp, thịt bên trong mềm ngọt mọng nước chấm sốt cay bơ tỏi nhức nách!',
    tags: ['#DinhNocKichTran', '#GaGionRum', '#NgonNhucNach']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Vừa cắn một miếng gà mà ngỡ như lạc vào thiên đường ẩm thực! Bác Ba chiên gà đúng chuẩn nghệ nhân Hẻm 1102!',
    tags: ['#HuyenThoaiBacBa', '#ChuanNgheNhan', '#NgonTuyetHao']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Gà sốt mật ong tỏi ở đây là đỉnh của chóp! Vị đậm đà thấm từng thớ thịt, ăn xong thèm muốn xỉu, ngày mai ghé tiếp!',
    tags: ['#DinhCuaChop', '#QuanRuotHem1102', '#NghienLuon']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 4,
    maxStars: 5,
    text: 'Một trải nghiệm ẩm thực 10 điểm không có nhưng! Gà giòn, sốt ngon, phục vụ dễ thương, xứng đáng là quán ruột số 1 Sài Gòn!',
    tags: ['#QuanRuotSo1', '#10DiemKhongCoNhung', '#YeuThuongTiem']
  },

  // ==========================================
  // ĐÁNH GIÁ TỐT: VỆ SINH SÁCH BONG (clean_hygiene) - 4..5 sao
  // ==========================================
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Quán sạch bong kin kít! Dầu chiên vàng óng thơm phức, bếp mở nhìn thấy từng khâu yên tâm tuyệt đối 10/10!',
    tags: ['#SachBongKinKit', '#DauVangOng', '#YenTamATTP']
  }
];

export const GENZ_REVIEW_TEMPLATES: NonEmpty<ReviewTemplate> = PROCEDURAL_REVIEW_TEMPLATES as unknown as NonEmpty<ReviewTemplate>;

export interface PersonaAuthor {
  name: string;
  avatar: string;
  group: 'genz' | 'office' | 'resident' | 'reviewer' | 'shipper';
}

export const PERSONA_AUTHORS: PersonaAuthor[] = [
  // GenZ & Sinh viên
  { name: 'Bé Trúc Mê Gà 🐥', avatar: '👧', group: 'genz' },
  { name: 'GenZ Săn Sale 💅', avatar: '👱‍♀️', group: 'genz' },
  { name: 'Huy Boy Phố 🕶️', avatar: '👦', group: 'genz' },
  { name: 'Quỳnh Kem Mút 🌸', avatar: '👧', group: 'genz' },
  { name: 'Cú Đêm KTX 🌙', avatar: '👨‍🎓', group: 'genz' },
  { name: 'Linh Kẹo Ngọt 🍬', avatar: '👱‍♀️', group: 'genz' },
  { name: 'Minh Nghiền Gà 🍗', avatar: '👦', group: 'genz' },

  // Dân văn phòng
  { name: 'Trưởng Phòng Quang 👔', avatar: '🧑', group: 'office' },
  { name: 'Kế Toán Thảo 📊', avatar: '👩', group: 'office' },
  { name: 'Thực Tập Sinh Ly 💼', avatar: '👧', group: 'office' },
  { name: 'Sếp Hoàng 💼', avatar: '🧑', group: 'office' },
  { name: 'HR Diệu Linh 🌸', avatar: '👩', group: 'office' },

  // Cư dân Hẻm 1102
  { name: 'Cô Năm Tạp Hóa 🧺', avatar: '👵', group: 'resident' },
  { name: 'Chú Ba Xe Ôm 🛵', avatar: '👴', group: 'resident' },
  { name: 'Bác Tám Cây Kiểng 🪴', avatar: '👴', group: 'resident' },
  { name: 'Dì Bảy Bánh Xèo 🍳', avatar: '👵', group: 'resident' },
  { name: 'Anh Chín Thợ Điện ⚡', avatar: '🧑', group: 'resident' },

  // Food Reviewer & Tiktoker
  { name: 'Tiktoker Review Ăn Sạch 📹', avatar: '🤳', group: 'reviewer' },
  { name: 'Food Blogger 1M Fl ⭐', avatar: '📸', group: 'reviewer' },
  { name: 'Thánh Ăn Vặt Hẻm 🍗', avatar: '😋', group: 'reviewer' },
  { name: 'Quỳnh Đi Đâu Ăn Đó 🍜', avatar: '🥢', group: 'reviewer' },

  // Shipper công nghệ
  { name: 'Đạt Shipper Xanh 🛵', avatar: '🛵', group: 'shipper' },
  { name: 'Bảo Giao Nhanh ⚡', avatar: '🛵', group: 'shipper' },
  { name: 'Hải Mũ Bảo Hiểm 🛵', avatar: '🛵', group: 'shipper' }
];

export const GENZ_USERNAMES = PERSONA_AUTHORS.map(a => a.name);
export const CUST_AVATARS = ['👧', '👦', '👩', '🧑', '👱‍♀️', '👨‍🎓', '🛵', '💅', '🐱', '🕶️', '🤳', '📸'];
