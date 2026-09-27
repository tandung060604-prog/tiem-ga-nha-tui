import { NonEmpty, StarRating, CustomerReview, ReviewReplyOption, CustomerOrder } from '../types/game';

export interface ReviewTemplate {
  criteria: keyof StarRating;
  topic: string;
  minStars: number;
  maxStars: number;
  text: string;
  tags: string[];
}

// =========================================================================
// NGÂN HÀNG 120+ MẪU REVIEW BẮT TREND GENZ, SÀI GÒN & PHẢN ÁNH THỰC TẾ CA BÁN
// =========================================================================
export const PROCEDURAL_REVIEW_TEMPLATES: ReviewTemplate[] = [
  // ==========================================
  // CASE 1: LÊN SAI MÓN (wrong_order) - 1..2 sao (10 mẫu)
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
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Tui dặn kỹ là [ORDER] mà bưng ra dĩa gì lạ hoắc. Hỏi lại thì kêu ráng ăn giùm, ủa tiền tui lá mít hả sếp?',
    tags: ['#GiaoNhamMon', '#GiaoSaiMon', '#BucMinh']
  },
  {
    criteria: 'speed',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Kiếp nạn thứ 82 của tui ở Hẻm 1102! Đợi nửa tiếng bưng ra dĩa đồ ăn của bàn khác, phục vụ lơ ngơ như bò đội nón.',
    tags: ['#GiaoNhamMon', '#KiepNan82', '#BoDoiNon']
  },
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Order gà không cay cho con nít ăn mà tiệm tọng nguyên dĩa gà sốt cay nồng, xém tí sặc nhập viện! Làm ăn cẩu thả quá!',
    tags: ['#GiaoNhamMon', '#CauTha', '#SuytNhapVien']
  },
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Một pha xử lý cồng kềnh đi vào lòng đất! Đơn [ORDER] biến mất không dấu vết, giao đại món ế cho khách. Quá thất vọng!',
    tags: ['#GiaoSaiMon', '#VaoLongDat', '#GiaoMonE']
  },
  {
    criteria: 'speed',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Bị nhầm đơn mà mặt thu ngân tỉnh bơ như chưa hề có cuộc chia ly. Coi thường thời gian của thực khách vừa thôi nghen!',
    tags: ['#GiaoNhamMon', '#TinhBo', '#CoiThuongKhach']
  },
  {
    criteria: 'taste',
    topic: 'wrong_order',
    minStars: 1,
    maxStars: 2,
    text: 'Ủa alo tiệm gà ơi? Em gọi [ORDER] chứ đâu gọi combo thất vọng này? Đề nghị đổi đầu bếp gấp!',
    tags: ['#GiaoSaiMon', '#UaAlo', '#ComboThatVong']
  },

  // ==========================================
  // CASE 2: KHÁCH BỎ VỀ / MISS ĐƠN (missed_order) - 1..2 sao (10 mẫu)
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
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Shipper nhận đơn đứng đợi tới mức bị hủy cuốc, trừ luôn tiền tài khoản. Quán bán buôn kiểu này ai dám nhận đơn nữa?',
    tags: ['#ShipperKhocRong', '#HuyCuoc', '#ChamTre']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Thanh xuân của em trôi qua nửa đời người chỉ để chờ 1 dĩa [ORDER]... Đợi không nổi đành dắt xe đi về trong cay đắng.',
    tags: ['#MatCaThanhXuan', '#DoiChoMonMoi', '#CayDang']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Quán làm ăn như phim quay chậm Slow Motion! Bàn vô sau thì có trước, bàn mình thì bặt vô âm tín, đành nhịn đói rút lui!',
    tags: ['#SlowMotion', '#BatVoAmTin', '#UaSaoKy']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Đói tụt đường huyết đứng tựa cột đèn ngóng đầu bếp chiên gà mà lòng đau như cắt. Thôi xin kiếu, không bao giờ quay lại!',
    tags: ['#TutDuongHuyet', '#KhongQuayLai', '#CheToanTap']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Order lúc trời còn nắng chói chang, tới lúc sao lên mọc đầy trời vẫn chưa thấy tăm hơi dĩa gà. Bỏ về ngủ cho lành!',
    tags: ['#SaoMocDayTroi', '#NghiKhoe', '#ThatVong']
  },
  {
    criteria: 'speed',
    topic: 'missed_order',
    minStars: 1,
    maxStars: 2,
    text: 'Đứng chờ tới mức con mèo của quán chạy qua liếm chân 3 bận mà đơn vẫn đang chế biến. Đành ngậm ngùi chào thân ái và quyết thắng!',
    tags: ['#MeoNhinDoi', '#RoiQuanTrongNuocMat', '#QuaCham']
  },

  // ==========================================
  // CASE 3: PHỤC VỤ CHẬM / RÙA BÒ (slow_speed) - 2..3 sao (8 mẫu)
  // ==========================================
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Gà thì ăn cũng được mà tốc độ làm món như rùa bò đi dạo phố á. Đi ăn giờ nghỉ trưa mà trễ giờ chấm công luôn nè!',
    tags: ['#RuaBo', '#TreGioChamCong', '#CanCaiThien']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Món ăn tạm ổn nhưng đợi gần 30 phút sốt hết cả ruột. Mong chủ quán đầu tư thêm bếp chiên tốc độ cao chứ vầy oải quá.',
    tags: ['#SotRuot', '#OaiCheChe', '#DauTuBepMoi']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Ăn một miếng gà mà chờ cả nửa buổi chiều. Khách đông thì phải báo trước để người ta liệu đường chứ để khách ngồi ngóng hoài.',
    tags: ['#KhachDongBaoTruoc', '#ChoDoiNangLong', '#3SaoTamOn']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Tay nghề chiên gà được nhưng thao tác tay còn lóng ngóng vụng về quá. Bác Ba huấn luyện lại nhân viên cho nhanh nhẹn nghen!',
    tags: ['#ThaoTacLongNgong', '#CanTapHuan', '#NhanhNhenLen']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Ly nước ngọt đá tan thành nước lọc luôn rồi mới thấy dĩa gà bê ra! Trừ 2 sao vì làm nhạt nhòa ly nước ngọt của tui.',
    tags: ['#DaTanThanhNuocLoc', '#NguoiDoiKhoSo', '#KemNgot']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Quán trong hẻm mà phong cách làm việc thong thả như nghỉ dưỡng resort vậy á. Ai đang vội thì né gấp quán này ra nha!',
    tags: ['#PhongCachResort', '#NeGapNeuVoi', '#ChamTre']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Gà giòn thơm nhưng chờ lâu quá làm tụt hết cả mood thèm ăn. Cần cải thiện quy trình ra món gấp!',
    tags: ['#TutMood', '#GiamHungThu', '#2SaoCanhBao']
  },
  {
    criteria: 'speed',
    topic: 'slow_speed',
    minStars: 2,
    maxStars: 3,
    text: 'Đợi đồ ăn mà kịp lướt hết 50 clip TikTok vẫn chưa thấy đồ ăn. Cho 3 sao khích lệ tinh thần cố gắng lần sau.',
    tags: ['#50ClipTikTok', '#KhichLe', '#3SaoDongVien']
  },

  // ==========================================
  // CASE 4: GÀ CHÁY KHÉT (burnt_food) - 1..2 sao (10 mẫu)
  // ==========================================
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Gà chiên bị khét đen thùi lùi như tiền đồ của mình vậy á. Cắn một miếng đắng nghét khóc thét, cứu tui trời ơi!',
    tags: ['#GaKhetDen', '#DangNghet', '#KhocThet']
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
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Chiên gà hay đốt than vậy tiệm? Đưa dĩa gà cháy đen thui cho khách mà lấy tiền trọn vẹn không biết ngại hả?',
    tags: ['#DotThanHa', '#KhongBietNgai', '#TucSoiMau']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Vỏ gà khét đắng ngắt, lột hết da ra thì thịt bên trong bở rệp. Trải nghiệm tệ hại nhất tuần này!',
    tags: ['#DangNgat', '#VoKhetThitBo', '#TraiNghiemTe']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Tui dắt crush đi ăn mà tiệm bưng ra dĩa gà khét đen sì, quê xệ với crush luôn á! 1 sao không nói nhiều!',
    tags: ['#QueXe', '#MatMatVoiCrush', '#1Sao']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Đầu bếp mải buôn chuyện hay bấm điện thoại mà để chảo cháy khói um sùm vậy? Mùi khét ám vô đồ ăn không nuốt nổi.',
    tags: ['#KhoiUmSum', '#AmMuiKhet', '#NuotKhongTroi']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Ăn gà rán mà ngỡ như đang gặm cục than tổ ong. Coi chừng ung thư nha cả nhà, né mẻ cháy của quán này ra!',
    tags: ['#ThanToOng', '#BaoVeSucKhoe', '#CanhBao']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Lửa canh trật lất, bên ngoài cháy xém bên trong còn đỏ máu tanh tanh. Kỹ thuật chiên quá non nớt!',
    tags: ['#NgoaiChayTrongSong', '#KyThuatKem', '#NonTay']
  },
  {
    criteria: 'taste',
    topic: 'burnt_food',
    minStars: 1,
    maxStars: 2,
    text: 'Biết là quán đông nhưng cháy thì phải bỏ mẻ khác chiên lại chứ sao lại cố giao cho khách? Mất uy tín quá Bác Ba ơi!',
    tags: ['#MatUyTin', '#EpKhachAnGaKhet', '#KhongChapNhanDuoc']
  },

  // ==========================================
  // CASE 5: DẦU ĐEN / MẤT VỆ SINH (dirty_oil) - 1..2 sao (8 mẫu)
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
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Nhìn vô chảo dầu đen thui như nước cống mà rùng mình gai ốc. Khuyên thật lòng tiệm nên thay dầu thường xuyên hơn!',
    tags: ['#DauDenXi', '#DauNuocCong', '#MatVeSinh']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Ăn xong dĩa gà về nhà là bụng réo rắt, tào tháo rượt suốt 3 tiếng đồng hồ. Tiếc tiền thay dầu hại sức khỏe khách hàng!',
    tags: ['#DauCuKhet', '#TaoThaoRuot', '#ATTP']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Miếng bột chiên dính đầy cặn khét màu đen li ti. Dầu tái chế chiên đi chiên lại nhiều lần chắc luôn!',
    tags: ['#DauBan', '#DauTaiChe', '#MatVeSinh']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Mùi dầu hôi nồng nặc bay khắp cả con hẻm. Vừa cắn miếng gà nghe mùi dầu cũ sặc lên mũi phát nôn.',
    tags: ['#DauCuKhet', '#MuiDauHoi', '#MatVeSinh']
  },
  {
    criteria: 'hygiene',
    topic: 'dirty_oil',
    minStars: 1,
    maxStars: 2,
    text: 'Vệ sinh quán là trên hết mà để chảo dầu bẩn kinh hoàng. Tẩy chay cho tới khi tiệm công khai quy trình thay dầu sạch!',
    tags: ['#DauBan', '#TayChayDauBan', '#MatVeSinh']
  },

  // ==========================================
  // CASE 6: GIÁ ĐẮT / CHẶT CHÉM (expensive) - 2..3 sao (8 mẫu)
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
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Quán vỉa hè hẻm nhỏ mà bán giá ngang ngửa nhà hàng trung tâm thương mại! Định vị giá kiểu này coi chừng mất khách sớm.',
    tags: ['#GiaNhaHang', '#ViaHeGiaTrenTroi', '#DatDo']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Tính tiền thêm lon nước ngọt mà giá x2 tạp hóa đầu ngõ. Cảm giác bị vặt lông gà không thương tiếc!',
    tags: ['#VatLongGa', '#PhuThuCao', '#ChatDep']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Ăn chưa kịp no bụng mà ví đã xẹp lép như bánh tráng. Tiệm nên có combo tiết kiệm cho học sinh sinh viên nhờ.',
    tags: ['#ViXepLep', '#CanComboTietKiem', '#GiaHoiCao']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Chất lượng tầm 7 điểm mà giá set 10 điểm. Không tương xứng với số tiền bỏ ra, hơi hối hận khi ghé.',
    tags: ['#KhongTuongXung', '#GiaAo', '#3Sao']
  },
  {
    criteria: 'pricing',
    topic: 'expensive',
    minStars: 2,
    maxStars: 3,
    text: 'Đọc menu thấy rẻ mà tính tiền ra đủ loại phụ phí. Làm ăn không minh bạch gì hết trơn à!',
    tags: ['#PhuPhiNgam', '#ThieuMinhBach', '#KhongUngY']
  },

  // ==========================================
  // CASE 7: KHÔNG GIAN NÓNG / CHẬT (bad_space) - 2..3 sao (8 mẫu)
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
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Khói chiên dầu từ bếp xộc thẳng vô mặt thực khách ngộp thở muốn xỉu. Lắp thêm quạt hút khói đi chủ tiệm ơi!',
    tags: ['#XocKhoiDau', '#CanQuatHut', '#NgopTho']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Bàn ghế kê sát sàn sạt, khách đi qua quẹt trúng đĩa đồ ăn xém rớt. Chỗ ngồi quá tù túng, mất cả ngon!',
    tags: ['#TuTung', '#ChoNgoiChat', '#MatNgon']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Trời mưa một phát là nước tạt ướt mèm cả giỏ xách lẫn dĩa gà rán. Mái hiên tiệm dột tứ tung cần sửa lại gấp!',
    tags: ['#MuaTatUotMem', '#MaiHienDot', '#BatTien']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Tiếng còi xe ngoài hẻm inh ỏi, quán lại không mở nhạc chill át bớt. Ăn bữa gà mà nhức cả màng nhĩ.',
    tags: ['#OnAoInhOi', '#ThieuNhacChill', '#CanPhongKinh']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Chỗ để xe không có người trông, vừa ăn vừa phải ngoái đầu dòm xe máy sợ bị bẻ khóa. Tâm trạng bất an dữ dội!',
    tags: ['#KhongChoGiuXe', '#BatAn', '#CanBaoVe']
  },
  {
    criteria: 'space',
    topic: 'bad_space',
    minStars: 2,
    maxStars: 3,
    text: 'Đèn đóm trong hẻm tù mù tối thui, chụp hình sống ảo da bị ám vàng nhìn ghê quá. Cần thêm đèn neon lung linh!',
    tags: ['#DenToiThu', '#KhongChupDuocAnh', '#CanDenNeon']
  },

  // ==========================================
  // CASE 8: TỐC ĐỘ PHỤC VỤ THẦN TỐC (fast_speed) - 4..5 sao (12 mẫu)
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
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Giao đồ ăn cả ngày đói lả ghé mua 1 phần gà popcorn, tiệm lên món cái rẹt kịp chạy cuốc tiếp, còn tặng thêm ly nước lạnh. Ấm lòng shipper!',
    tags: ['#AmLongShipper', '#GiaoNhanhKipCuoc', '#NghiaTinhHem']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Đúng chuẩn thức ăn nhanh! Order phát là có liền trong 3 nốt nhạc, gà vẫn nóng phỏng lưỡi, không hề chiên sẵn nguội ngắt.',
    tags: ['#3NotNhac', '#NongPhongLuoi', '#FastFoodChuan']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Giờ cao điểm đông nghẹt mà bếp ra món như máy dập, phục vụ tay thoăn thoắt không kịp thở. Bái phục sự chuyên nghiệp!',
    tags: ['#RaMonNhuMay', '#TayThoanThoat', '#ChuyenNghiep']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Tốc độ ánh sáng là có thật! Vừa đặt mông xuống ghế là đồ ăn đã dọn ra tươm tất. Cho tiệm 5 sao tốc độ tên lửa!',
    tags: ['#TocDoAnhSang', '#TenLua5Sao', '#QuaDinh']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Đi ăn trưa với sếp cần ăn lẹ để về họp, tiệm phục vụ đúng 5 phút xong nguyên combo [ORDER]. Cứu nguy một bàn thua trông thấy!',
    tags: ['#CuuNguyKipGio', '#AnTruaNhanh', '#5PhutXong']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Quy trình order và lấy món mượt mà như bôi dầu trơn. Thao tác siêu nhanh mà không hề bị lộn đơn, quá xuất sắc!',
    tags: ['#QuyTrinhMuotMa', '#KhongLonDon', '#XuatSac']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Bác Ba chiên gà điêu luyện, phụ bếp bốc món liền tay, khách vô nườm nượp mà xử lý ngọt xớt. Quá nể phục!',
    tags: ['#DieuLuyen', '#XuLyNgotXot', '#5SaoTuyetDoi']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Tụi mình đói lả sau giờ tập gym, vừa tấp vô gọi món là khay gà vàng ươm đã hạ cánh an toàn. Phục vụ nhiệt tình 10/10!',
    tags: ['#HaCanhAnToan', '#SauGioGym', '#NhietTinh10Diem']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Nhanh - Gọn - Nóng sốt! Không phải đứng chờ một giây nào thừa thãi. Xứng đáng là địa chỉ ăn vặt số 1 cho người bận rộn.',
    tags: ['#NhanhGonLe', '#NongSot', '#So1ChoNguoiBan']
  },
  {
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 4,
    maxStars: 5,
    text: 'Bấm gọi món xong chưa kịp rút điện thoại ra soi gương là đồ ăn đã bưng tới bàn. Nhanh hết hồn chim én luôn á!',
    tags: ['#HetHonChimEn', '#NhanhQuaNhanh', '#HaiLong']
  },

  // ==========================================
  // CASE 9: GÀ VÀNG GIÒN PERFECT (perfect_food) - 5 sao (16 mẫu)
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
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Một buổi chiều mưa ngồi dưới mái hiên số 14, vị giòn tan của miếng gà nóng hổi như đánh thức ký ức Sài Gòn xưa. Bác Ba truyền nghề khéo quá!',
    tags: ['#KyUcSaigon', '#MaiHien14', '#HuongViXua']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Thách thức 24h ăn sập Tiệm Gà Nhà Tui: Gà giòn vỏ mỏng rộp rộp, sốt cay tê lưỡi, đáng tiền từng xu! Đã đăng clip lên TikTok 1M fl nha sếp!',
    tags: ['#FoodReviewer1M', '#ClipTrieuView', '#GaNgonNhatSG']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Lớp bột chiên vàng óng ánh không hề bị ngấy dầu, cắn vô nghe cái rôm rốp sướng rơn cả màng nhĩ. Mê chữ ê kéo dàiii!',
    tags: ['#MeChuEKeoDai', '#RomRopSuongTai', '#BanhCuon']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Má đùi chiên sốt cay Yangnyeom ở đây ngon nuốt lưỡi! Thịt tươi ngọt tự nhiên chứ không hề có mùi đông lạnh công nghiệp. 10 điểm!',
    tags: ['#YangnyeomDinhCao', '#ThitTuoiMoiNgay', '#10DiemKhongCoNhung']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Phô mai que kéo sợi dài cả thước, vỏ ngoài giòn rụm bên trong béo ngậy. Ăn kèm sốt tương ớt chua ngọt của tiệm là chuẩn bài!',
    tags: ['#PhoMaiKeoSoi', '#BeoNgayGionTan', '#ChuanBai']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Gà popcorn lắc bột phô mai thơm nức mũi cả góc phố. Mua một hộp tính vừa đi bộ vừa nhâm nhi mà 2 phút hết veo vì quá ngon!',
    tags: ['#GiaViPhoMai', '#ThomNucMui', '#HetVeoTrong2Phut']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Vị đậm đà miền Nam pha chút cay nồng Hàn Quốc độc lạ chưa từng thấy ở quán nào khác. Tiệm giữ bí kíp này kỹ nghen!',
    tags: ['#ViDocLa', '#KetHopDinhChop', '#BiKipGiaTruyen']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 4,
    maxStars: 5,
    text: 'Món củ cải muối vàng ăn kèm giải ngấy siêu đỉnh! Miếng gà chiên giòn rụm kẹp miếng củ cải giòn sần sật ăn hoài không biết chán.',
    tags: ['#GiaiNgayDinhCao', '#CuCaiMuoiGion', '#AnHoaiKhongChan']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Canh lửa xuất sắc! Bột chiên giòn tan nhưng thịt bên trong vẫn ươm hồng mọng nước, không bị khô xơ chút nào. Đẳng cấp Master Chef!',
    tags: ['#CanhLuaXuatSac', '#MongNuocKhongKho', '#MasterChef']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Miếng gà ngon tới mức nhỏ bạn đi chung đòi ăn cướp luôn phần của tui! Hai đứa xém uýnh lộn vì miếng gà cuối cùng haha!',
    tags: ['#UynhLonViMiengGa', '#NgonBaChay', '#HaiHuoc']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Hương vị tuổi thơ xen lẫn hiện đại. Miếng gà rán làm tui nhớ những buổi chiều theo mẹ đi chợ ăn vặt. Ấm áp vô cùng!',
    tags: ['#HuongViTuoiTho', '#AmApTinhQue', '#NgonNhoDoi']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Bánh biscuit mật ong thơm bơ ngầy ngậy, kết hợp gà cay giòn rụm đúng điệu Soul Food Mỹ nhưng mang hồn Sài Gòn. Quá nể!',
    tags: ['#BiscuitMatOng', '#SoulFoodSaigon', '#NgonTuyetDoi']
  },
  {
    criteria: 'taste',
    topic: 'perfect_food',
    minStars: 5,
    maxStars: 5,
    text: 'Sốt bơ tỏi đậu nành quyện đều từng thớ gà óng ả, vị ngọt mặn hài hòa ăn dính miệng dã man. Món này phải gọi là cực phẩm!',
    tags: ['#BoToiDauNanh', '#DinhMiengDaMan', '#CucPhamAmThuc']
  },

  // ==========================================
  // CASE 10: GIÁ RẺ HẠT DẺ (cheap_price) - 4..5 sao (10 mẫu)
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
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 5,
    maxStars: 5,
    text: 'Tan học đói rã rời tấp vô tiệm làm combo gà giòn 25k no tới tối, nước sốt mật ong thơm lừng. Quán ruột của cả trường tụi em!',
    tags: ['#HocSinhSinhVien', '#GiaSieuYeu', '#QuanRuotTruong']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Giá cả bình dân đúng chất Hẻm 1102 tình nghĩa xóm giềng! Không hề nâng giá chặt chém người lao động, trân quý tiệm lắm!',
    tags: ['#GiaTinhNghia', '#KhongChatChem', '#ThuongTiem']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 5,
    maxStars: 5,
    text: 'Cầm tờ 50k bước vô tiệm mà bước ra no căng rốn, còn được thối lại tiền lẻ. Thời buổi bão giá tìm được quán vầy hiếm có khó tìm!',
    tags: ['#Cam50kNoSay', '#BaoGiaKhongSo', '#HiemCoKhoTim']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Menu thiết kế các combo thông minh, đi nhóm 3-4 người gọi share ra rẻ bèo nhèo luôn. Vote 5 sao nhiệt liệt!',
    tags: ['#ShareRaReBeo', '#DiDongCangRe', '#Vote5Sao']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 5,
    maxStars: 5,
    text: 'Thực khách ruột từ những ngày đầu xe đẩy. Dù giờ tiệm khang trang hơn nhưng giá vẫn giữ vẹn nguyên sự tử tế. Cảm ơn Bác Ba!',
    tags: ['#GiaTuTe', '#KhachRuotXeDay', '#BietOnBacBa']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Chất lượng sánh ngang gà các thương hiệu lớn mà giá chỉ bằng một nửa. Lựa chọn số một cho ví tiền sinh viên tụi mình!',
    tags: ['#BangMotNuaGia', '#ChatLuongNgangHang', '#LuaChonSo1']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 5,
    maxStars: 5,
    text: 'Tiệm gà vị cứu tinh của các anh em văn phòng những ngày chờ lương về. Ngon - Bổ - Rẻ có thiệt trên đời nha quý dị!',
    tags: ['#ViCuuTinhChoLuong', '#NgonBoRe', '#TuyetVoi']
  },
  {
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 4,
    maxStars: 5,
    text: 'Mua mang về được tặng thêm tương ớt, khăn lạnh đầy đủ không tính thêm xu nào. Bán buôn xởi lởi trời cho nghen chủ tiệm!',
    tags: ['#XoiLoiTroiCho', '#KhongTinhThemPhi', '#DeThuong']
  },

  // ==========================================
  // CASE 11: KHÔNG GIAN ĐẸP / CHILL (great_space) - 4..5 sao (10 mẫu)
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
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 5,
    maxStars: 5,
    text: 'Tiệm trang trí phong cách bistro Hàn Quốc sáng sủa, tone màu caramel gỗ ấm cúng. Ngồi ăn cảm giác nhẹ nhàng, chữa lành tâm hồn!',
    tags: ['#CozyHealing', '#BistroHanQuoc', '#ChuaLanhTamHon']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 4,
    maxStars: 5,
    text: 'Bảng hiệu neon nổi bật đầu hẻm chụp hình ban đêm siêu nghệ! Bàn ghế sạch bóng, khoảng cách ngồi rộng rãi thoải mái.',
    tags: ['#BienNeonArt', '#KhongGianRongRai', '#SangXinh']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 5,
    maxStars: 5,
    text: 'Quán có bé mèo tam thể mập ú nằm ngủ gật ở hiên cưng xỉu! Vừa ăn gà vừa được vuốt mèo xả stress sau giờ làm việc căng thẳng.',
    tags: ['#MeoTamTheCungXiu', '#XaStress', '#QuanThuCung']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 4,
    maxStars: 5,
    text: 'Máy lạnh phà mát rượi đập tan cái nóng bức 40 độ ngoài đường. Vô đây ăn dĩa gà uống ly coca mát lạnh là thiên đường!',
    tags: ['#MayLanhMatRuoi', '#ThienDuongMuaHe', '#DapTanOiNong']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 5,
    maxStars: 5,
    text: 'List nhạc của tiệm có gu đỉnh thực sự! Toàn indie Việt với lofi nhẹ nhàng, ngồi học bài hay làm việc nhóm đều cực hợp lý.',
    tags: ['#PlaylistCoGu', '#IndieLofiChill', '#HocBaiTuyetVoi']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 4,
    maxStars: 5,
    text: 'Khu vực quầy bếp mở lắp kính trong suốt nhìn đầu bếp chiên gà thoăn thoắt rất an tâm và thích mắt. Decor rất tinh tế!',
    tags: ['#BepMoTrongSuot', '#DecorTinhTe', '#YenTam']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 5,
    maxStars: 5,
    text: 'Đèn lồng vàng treo dọc mái hiên số 14 tạo cảm giác hoài niệm Sài Gòn thập niên 90. Một góc quán quá đỗi bình yên giữa phố thị.',
    tags: ['#DenLongVang', '#SaiGonHoaiNiem', '#GocBinhYen']
  },
  {
    criteria: 'space',
    topic: 'great_space',
    minStars: 5,
    maxStars: 5,
    text: 'Bãi giữ xe có Chú Tư bảo vệ dắt xe tận tình, che mưa che nắng chu đáo. Điểm 10 cho sự hiếu khách từ ngoài cửa!',
    tags: ['#ChuTuBaoVe10Diem', '#GiuXeTanTinh', '#HieuKhach']
  },

  // ==========================================
  // CASE 12: VỆ SINH SẠCH BONG (clean_hygiene) - 4..5 sao (8 mẫu)
  // ==========================================
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Quán sạch bong kin kít! Dầu chiên vàng óng thơm phức, bếp mở nhìn thấy từng khâu yên tâm tuyệt đối 10/10!',
    tags: ['#SachBongKinKit', '#DauVangOng', '#YenTamATTP']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 5,
    maxStars: 5,
    text: 'Tiệm gà ngăn nắp, bàn ghế xếp trật tự không lấn lòng lề đường, dầu mỡ thu gom chuẩn. Điểm cộng lớn cho ý thức cộng đồng của tiệm!',
    tags: ['#VanMinhDoThi', '#BaoVeMoiTruong', '#KhenNgoi']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 5,
    maxStars: 5,
    text: 'Nhân viên đeo bao tay, tạp dề và khẩu trang chuẩn chỉnh khi chế biến. Ăn gà ở đây không bao giờ phải lo đau bụng!',
    tags: ['#ChuanVeSinh', '#DeoKhauTrang', '#ATTPXuatSac']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Chảo dầu trong veo không một hạt cặn khét! Khay inox GN đựng thức ăn sáng loáng soi gương được. Rất hài lòng về độ sạch!',
    tags: ['#DauTrongVeo', '#KhayInoxSangBong', '#HaiLong']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 5,
    maxStars: 5,
    text: 'Khách vừa đứng dậy là nhân viên cầm chai xịt khuẩn lau bàn sạch bong liền. Quy trình khử trùng rất chuyên nghiệp!',
    tags: ['#KhuKhuanLienTay', '#SachSeMoiLuc', '#ChuyenNghiep']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Đồ đựng mang về dùng hộp giấy thân thiện môi trường thay vì hộp xốp độc hại. Vừa sạch sẽ vừa bảo vệ thiên nhiên!',
    tags: ['#HopGiayEco', '#BaoVeThienNhien', '#SachVaXanh']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 5,
    maxStars: 5,
    text: 'Nguyên liệu gà để trong tủ bảo ôn mát lạnh nhìn tươi roi rói. Tiêu chuẩn an toàn vệ sinh xứng đáng nhận chứng nhận 5 sao!',
    tags: ['#TuBaoOnMat', '#GaTuoiRoiRoi', '#5SaoVeSinh']
  },
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 5,
    maxStars: 5,
    text: 'Khu vực quầy tương sạch sẽ tinh tươm, không hề có tình trạng tương chảy dính nhớp nháp. Chăm chút từng chi tiết nhỏ!',
    tags: ['#QuayTuongTinhTuom', '#ChiTietNho', '#DiemCongLon']
  },

  // ==========================================
  // CASE 13: KHEN TỔNG HỢP / QUÁN RUỘT (general_praise) - 4..5 sao (10 mẫu)
  // ==========================================
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 4,
    maxStars: 5,
    text: 'Một trải nghiệm ẩm thực 10 điểm không có nhưng! Gà giòn, sốt ngon, phục vụ dễ thương, xứng đáng là quán ruột số 1 Sài Gòn!',
    tags: ['#QuanRuotSo1', '#10DiemKhongCoNhung', '#YeuThuongTiem']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Từ chủ tiệm tới nhân viên ai cũng nở nụ cười tươi rói chào đón khách. Ăn dĩa gà mà thấy ấm áp tình người miền Tây sông nước!',
    tags: ['#NuCuoiTuoiRoi', '#AmApTinhNguoi', '#NhietTinhThanThien']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Tuần nào cũng phải ghé tiệm ít nhất 3 lần mới chịu nổi cơn ghiền. Tiệm gà gây nghiện nhất khu vực này rồi!',
    tags: ['#GayNghien', '#TuanGhe3Lan', '#QuanRuot']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 4,
    maxStars: 5,
    text: 'Mang bạn bè từ quê lên ăn thử ai cũng khen nức nở. Tự hào giới thiệu tiệm gà đặc sản Hẻm 1102 cho mọi người!',
    tags: ['#TuHaoGioiThieu', '#DacSanHem1102', '#KhenNucNo']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Chất lượng đồng đều từ ngày đầu khai trương tới giờ, không hề bị xuống phong độ khi đông khách. Rất đáng nể!',
    tags: ['#GiuVungPhongDo', '#UyTinLauDai', '#DangNe']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Ăn gà ở đây thấy lòng nhẹ bẫng sau một ngày làm việc áp lực. Cảm ơn tiệm đã luôn giữ lửa yêu nghề!',
    tags: ['#NheBangTamHon', '#GiuLuaYeuNghe', '#ThuongTiêm']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 4,
    maxStars: 5,
    text: 'Bác Ba với chủ quán nói chuyện có duyên dữ dội, khách vô ăn mà cười rôm rả cả quán. Vừa ngon miệng vừa vui tai!',
    tags: ['#DuyenDang', '#CuoiRomRa', '#VuiVe']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Gà rán chuẩn vị gia đình ấm cúng. Chúc tiệm buôn may bán đắt, sớm mở thêm nhiều chi nhánh lớn mạnh nha!',
    tags: ['#ChucBuonMayBanDat', '#ViGiaDinh', '#MoRongChiNhanh']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Đã bookmark tiệm vào danh sách những địa điểm ăn ngon nhất định phải ghé khi tới Sài Gòn. Quá xuất sắc!',
    tags: ['#MustTrySaigon', '#DiaDiemNhatDinhGhe', '#XuatSac']
  },
  {
    criteria: 'taste',
    topic: 'general_praise',
    minStars: 5,
    maxStars: 5,
    text: 'Mọi thứ từ món ăn, nước chấm cho tới ly nước đá đều chỉn chu hoàn hảo. 5 sao không có gì phải đắn đo!',
    tags: ['#ChinChuTungChut', '#HoanHao', '#5SaoXungDang']
  }
];

export const GENZ_REVIEW_TEMPLATES: NonEmpty<ReviewTemplate> = PROCEDURAL_REVIEW_TEMPLATES as unknown as NonEmpty<ReviewTemplate>;

// =========================================================================
// NGÂN HÀNG 100 MẪU PHẢN HỒI CỦA KHÁCH HÀNG (CUSTOMER REACTIONS TO REPLIES)
// Phân chia theo từng trường hợp (sincere, witty, firm) & tính cách/cảm xúc
// =========================================================================
export const CUSTOMER_REACTION_POOLS = {
  // 1. Phản hồi tích cực khi chủ tiệm Chân Thành (sincere_positive)
  sincere_positive: [
    "Khách phản hồi: 'Thấy tiệm nhận lỗi đàng hoàng và biết cách lắng nghe nên mình nguôi giận rồi. Lần tới mình sẽ ghé ủng hộ tiếp!'",
    "Khách phản hồi: 'Cách xử lý quá văn minh và có tâm! Mình sẽ xóa bài phàn nàn và review lại mẻ mới cho tiệm nhé.'",
    "Khách phản hồi: 'Dạ không sao đâu ạ, quán buôn bán cực khổ ai chẳng có lúc sơ suất. Chúc tiệm luôn đắt khách nghen!'",
    "Khách phản hồi: 'Cảm ơn chủ quán đã hồi đáp chân thành. Nhận được sự tôn trọng này là mình vui rồi.'",
    "Khách phản hồi: 'Biết lắng nghe và cầu thị thế này thì xứng đáng 10 điểm uy tín, lần sau ghé nhớ dành phần ngon nha sếp!'",
    "Khách phản hồi: 'Thôi thấy Bác Ba với tiệm thật tình quá tui cũng bỏ qua đó, bữa sau làm cẩn thận giùm tui nha!'",
    "Khách phản hồi: 'Ghi nhận tinh thần trách nhiệm cao của tiệm, hiếm có quán nhỏ vỉa hè nào chăm sóc khách tốt như vậy.'",
    "Khách phản hồi: 'Dạ em cảm ơn voucher của quán ạ! Chiều mai tan học em rủ bạn ghé thử mẻ mới liền nè!'",
    "Khách phản hồi: 'Chủ tiệm dễ thương ghê, đọc tin nhắn mà ấm lòng. Mong tiệm phát triển bền vững!'",
    "Khách phản hồi: 'Được chủ quán quan tâm chu đáo thế này thì giận sao nổi nữa. Cố lên nhé tiệm gà hẻm 1102!'",
    "Khách phản hồi: 'Thái độ phục vụ 10/10 bù đắp lại sơ suất. Mình sẽ vẫn là khách quen trung thành của tiệm!'",
    "Khách phản hồi: 'Cảm ơn tiệm đã đổi mẻ mới, mẻ này chiên vàng giòn ngon nhức nách luôn á sếp ơi!'",
    "Khách phản hồi: 'Shipper tụi tui chạy mưa nắng mệt mỏi mà nghe tiếng ngọt ngào cầu thị của quán cũng mát dạ lắm.'",
    "Khách phản hồi: 'Ok quán nghen, nói được làm được là tui ưng cái bụng rồi đó!'",
    "Khách phản hồi: 'Thương tiệm buôn bán vất vả, lần sau em sẽ canh đi giờ vắng để ủng hộ tiệm thoải mái hơn.'"
  ],

  // 2. Phản hồi tích cực khi chủ tiệm Hài hước bắt trend (witty_positive - GenZ, học sinh, vui tính)
  witty_positive: [
    "Khách phản hồi: 'Haha admin tiệm gà rep mặn như nước mắm nhĩ vậy trời! Cười muốn nội thương, bỏ qua hết giận dỗi luôn!'",
    "Khách phản hồi: 'Trời ơi đọc rep mà cười té ghế! Duyệt cho tiệm 1000 điểm tấu hài, lần sau nhớ đền miếng gà to bự nha!'",
    "Khách phản hồi: 'Rep lầy lội cưng xỉu up xỉu down! Đã chụp màn hình đăng Threads khoe admin dễ thương nè haha!'",
    "Khách phản hồi: 'Haha kiếp nạn thứ 82 mà gặp admin thứ 83! Thôi tha lỗi đó, bữa sau canh lửa chuẩn giùm tui nghen!'",
    "Khách phản hồi: 'Được lời như cởi tấm lòng, để xem lần sau nhanh hơn người yêu cũ trở mặt thiệt hông nha!'",
    "Khách phản hồi: 'Mặn mòi quá chủ quán ơi! Ăn miếng gà mà được tặng thêm nụ cười sảng khoái, 10 điểm uy tín!'",
    "Khách phản hồi: 'Cười muốn xỉu ngang! Thôi không bực nữa, mai tui ghé ăn tiếp coi đầu bếp bị phạt ăn gà khét chưa haha!'",
    "Khách phản hồi: 'Admin GenZ chính hiệu! Đáng yêu thế này thì ai nỡ giận lâu, mai em kéo cả lớp qua bao quán!'",
    "Khách phản hồi: 'Haha rep huề vốn ghê nhưng mà duyên dáng! Cho 5 sao tinh thần lạc quan yêu đời!'",
    "Khách phản hồi: 'Bắt trend nhanh hơn điện thoại sạc nhanh 120W! Tiệm gà hài hước nhất Vịnh Bắc Bộ!'",
    "Khách phản hồi: 'Hài xỉu! Đọc xong hết quạu luôn, bữa sau tới nhớ nhận diện khách VIP này nghen sếp!'",
    "Khách phản hồi: 'Cười ẻ! Tiệm gà kiêm gánh hài xiếc hả trời? Thôi bỏ qua cho sự đáng yêu này đó!'",
    "Khách phản hồi: 'Haha ok sếp ơi, lần tới tui nháy mắt là phải có gà liền đó nghen, hứa rồi đó!'",
    "Khách phản hồi: 'Rep mượt mà quá! Tiệm gà đỉnh nóc kịch trần bay phấp phới, tha lỗi liền tay!'",
    "Khách phản hồi: 'Thả 1000 tim cho chủ quán! Buôn bán hài hước vầy khách nào nỡ cạch mặt!'"
  ],

  // 3. Phản hồi tiêu cực khi chủ tiệm Hài hước cợt nhả sai chỗ (witty_negative - Khách nghiêm túc, lỗi nặng như dầu đen/cháy)
  witty_negative: [
    "Khách phản hồi: 'Ủa tiệm đang giỡn mặt khách hả trời? Dầu đen/gà khét ăn hại sức khỏe mà đem ra tấu hài được hả? Trừ thêm sao!'",
    "Khách phản hồi: 'Làm ăn cẩu thả không biết nhận lỗi nghiêm túc mà còn đùa cợt cợt nhả. Quá thất vọng về cách hành xử!'",
    "Khách phản hồi: 'Khách góp ý chân thành vì ATTP mà quán trả lời như giỡn chơi. Coi thường sức khỏe cộng đồng quá!'",
    "Khách phản hồi: 'Tưởng vậy là hay hả chủ quán? Người lớn tuổi đọc câu trả lời này thấy bực mình thêm. Cạch mặt!'",
    "Khách phản hồi: 'Cợt nhả thiếu chuyên nghiệp! Quán buôn bán kiểu này sớm muộn gì cũng mất hết khách quen.'",
    "Khách phản hồi: 'Không thấy vui một chút nào! Đồ ăn dở tệ mà còn giở giọng bông đùa, 1 sao vĩnh viễn!'",
    "Khách phản hồi: 'Lấy sự tắc trách ra làm trò cười câu like, không hề thấy sự cầu thị nào ở đây cả!'",
    "Khách phản hồi: 'Tui đang tức sôi máu mà đọc rep kiểu này chỉ muốn report quán ngay và luôn!'",
    "Khách phản hồi: 'Hết nói nổi! Đổi tên thành gánh hài đi chứ đừng bán đồ ăn nữa, làm ăn tắc trách!'",
    "Khách phản hồi: 'Giỡn nhây không đúng chỗ rồi em ơi. Buôn bán ẩm thực là tính mạng con người đó nghen!'"
  ],

  // 4. Phản hồi thấu hiểu khi chủ tiệm Cương trực giải thích hợp lý (firm_positive)
  firm_positive: [
    "Khách phản hồi: 'À ra là gà chiên tươi theo từng mẻ chứ không dùng đồ cũ, thế thì mình cũng thông cảm được phần nào.'",
    "Khách phản hồi: 'Nghe quán giải thích rõ ràng về nguồn gốc gà tươi và bột nhập khẩu thì thấy mức giá đó cũng hợp lý.'",
    "Khách phản hồi: 'Giờ cao điểm shipper hối thì cũng khó cho quán thật. Ghi nhận tiệm có giải thích minh bạch.'",
    "Khách phản hồi: 'Ok quán giữ vững lập trường về chất lượng sạch là tốt. Lần sau mình sẽ canh giờ vắng ghé lại.'",
    "Khách phản hồi: 'Giải thích có lý có tình. Tiền nào của nấy, gà ngon chuẩn vị thì mình vẫn ủng hộ tiệm.'",
    "Khách phản hồi: 'Ừ vậy lần sau mình sẽ đặt món trước qua app hoặc gọi mang về cho đỡ mất công chờ.'",
    "Khách phản hồi: 'Hiểu cho áp lực của quán nhỏ trong hẻm. Chúc quán luôn giữ được chất lượng vàng giòn này.'",
    "Khách phản hồi: 'Thẳng thắn rõ ràng vậy là tốt, không vòng vo đổ lỗi. Tui thích phong cách sòng phẳng này.'",
    "Khách phản hồi: 'Ok ghi nhận sự cố gắng của tiệm. Mong tiệm sớm mở rộng thêm mặt bằng cho thoải mái.'",
    "Khách phản hồi: 'Biết là quán có nguyên tắc nghề nghiệp riêng, thôi bữa sau mình chú ý dặn trước khi gọi món.'"
  ],

  // 5. Phản hồi bực bội khi chủ tiệm Cương trực bị coi là cãi lý / đổ lỗi (firm_negative)
  firm_negative: [
    "Khách phản hồi: 'Quán trả lời nghe cứng nhắc và đổ thừa quá! Khách đông là chuyện của quán chứ sao bắt khách chịu thiệt?'",
    "Khách phản hồi: 'Đổ lỗi cho shipper với giờ cao điểm là dở rồi! Làm ăn thiếu chuyên nghiệp mà còn cãi chày cãi cối.'",
    "Khách phản hồi: 'Bán đắt mà bảo do nguyên liệu hảo hạng? Ăn miếng gà thấy bình thường chả có gì đặc sắc cả!'",
    "Khách phản hồi: 'Không biết tự nhìn lại mình mà toàn phân trần lý do. Cảm giác quán bảo thủ và không lắng nghe.'",
    "Khách phản hồi: 'Nói vậy là khách sai còn tiệm đúng hả? Thái độ ăn thua với khách hàng thế này thì xin kiếu!'",
    "Khách phản hồi: 'Cãi cùn ghê! Tiệm vỉa hè chật chội mà kêu khách thông cảm? Đã không thoải mái thì lần sau khỏi ghé!'",
    "Khách phản hồi: 'Khách hàng bỏ tiền ra trải nghiệm chứ đâu phải nghe quán kể khổ. Không bao giờ quay lại!'",
    "Khách phản hồi: 'Phân trần một hồi hóa ra lỗi do khách đi ăn giờ cao điểm hả? Hay ghê ha!'",
    "Khách phản hồi: 'Thôi khỏi giải thích nữa, nghe mệt tai thêm. Đánh giá 1 sao cho sự bảo thủ của tiệm!'",
    "Khách phản hồi: 'Làm sai thì nhận một câu xin lỗi cho xong, nói nhiều làm người ta ghét thêm!'"
  ],

  // 6. Phản hồi cảm kích khi nhận được tri ân khen ngợi 5 sao (praise_positive)
  praise_positive: [
    "Khách phản hồi: 'Dễ thương xỉu! Chúc tiệm luôn đắt khách và giữ mãi cái tâm làm bếp ấm áp này nhé!'",
    "Khách phản hồi: 'Nhất định mình sẽ rủ thêm bạn bè và đồng nghiệp ghé ủng hộ quán ruột dài dài!'",
    "Khách phản hồi: 'Quán vừa ngon vừa ngọt ngào, xứng đáng được 100 điểm triệu view trên TikTok!'",
    "Khách phản hồi: 'Yêu thương tiệm nhiều! Chiều mai tan làm mình lại tấp vô làm 1 combo sốt cay nha!'",
    "Khách phản hồi: 'Cảm ơn chủ tiệm! Miếng gà rán của tiệm đã cứu rỗi một ngày làm việc mệt mỏi của mình đó.'",
    "Khách phản hồi: 'Bác Ba với chủ quán đáng yêu quá chừng, ăn gà ở đây cảm giác như về nhà vậy á!'",
    "Khách phản hồi: 'Đã share clip review lên trang cá nhân cho mọi người cùng biết tiệm gà ngon đỉnh này rồi nha!'",
    "Khách phản hồi: 'Chúc tiệm mau chóng phát tài, mở thêm 10 chi nhánh khắp Sài Gòn luôn nha!'",
    "Khách phản hồi: 'Mãi là fan cứng của Tiệm Gà Nhà Tui! Giữ vững phong độ nghệ nhân nha Bác Ba ơi!'",
    "Khách phản hồi: 'Đọc rep của tiệm mà mỉm cười suốt cả buổi tối. Cảm ơn sự chu đáo của tiệm!'"
  ]
};

// Ma trận Tâm lý khách hàng theo từng chủ đề sự cố
export const TOPIC_SENTIMENTS: Record<string, 'furious' | 'disappointed' | 'neutral' | 'delighted' | 'amused'> = {
  wrong_order: 'furious',
  missed_order: 'disappointed',
  slow_speed: 'disappointed',
  burnt_food: 'furious',
  dirty_oil: 'furious',
  expensive: 'disappointed',
  bad_space: 'disappointed',
  great_space: 'delighted',
  cheap_price: 'delighted',
  fast_speed: 'delighted',
  perfect_food: 'delighted',
  clean_hygiene: 'delighted',
  general_praise: 'delighted'
};

// Gợi ý của Bác Ba / AI Cố vấn phân tích tâm lý khách hàng cho từng chủ đề
export const TOPIC_ADVISOR_HINTS: Record<string, string> = {
  wrong_order: 'Bác Ba mách nước: Khách đang tức sôi máu vì đói mà nhận nhầm món. Đừng cãi lý hay đổ thừa! Hãy chọn phương án chân thành xin lỗi và tặng voucher mẻ mới để giữ chân khách.',
  missed_order: 'Bác Ba mách nước: Khách chờ quá lâu nên tủi thân bỏ về. Hãy dùng sự chân thành cảm ơn vì đã kiên nhẫn và mời nước mát xoa dịu, cam kết cải thiện tốc độ bếp.',
  slow_speed: 'Bác Ba mách nước: Khách phàn nàn chờ đợi lâu làm trễ giờ. Hãy cảm ơn sự kiên nhẫn, hứa hẹn nâng cấp thêm chảo chiên tốc độ cao để khách vui vẻ trở lại.',
  burnt_food: 'Bác Ba mách nước: Ăn phải miếng gà khét đắng nghét là trải nghiệm rất tệ. Con hãy nhận lỗi tay nghề canh lửa, cam kết đổi mẻ vàng giòn Perfect để lấy lại uy tín.',
  dirty_oil: 'Bác Ba mách nước: Vệ sinh ATTP là tính mạng của quán ăn! Tuyệt đối không cợt nhả. Hãy khẳng định tiệm đã lập tức thay 100% dầu mới tinh và khử trùng bếp.',
  expensive: 'Bác Ba mách nước: Khách chê giá đắt so với vỉa hè. Con hãy giải thích về nguồn gốc thịt gà tươi mỗi ngày và gia vị hảo hạng, hoặc gợi ý các combo tiết kiệm.',
  bad_space: 'Bác Ba mách nước: Khách thấy ngột ngạt khi ngồi ăn. Con hãy thông báo kế hoạch nâng cấp quạt hơi nước hoặc mở phòng lạnh view hẻm để khách an tâm.',
  great_space: 'Bác Ba mách nước: Khách mê mẩn không gian check-in! Hãy đối đáp thân thiện, mời họ rủ thêm bạn bè ghé sống ảo thường xuyên nha con.',
  cheap_price: 'Bác Ba mách nước: Khách khen giá hạt dẻ sinh viên! Hãy duy trì mức giá bình dân để giữ trọn tình nghĩa xóm giềng Hẻm 1102.',
  fast_speed: 'Bác Ba mách nước: Khách khen phục vụ thần tốc! Đây là lúc thể hiện sự chuyên nghiệp và cam kết giữ vững phong độ giòn nóng nhanh lẹ.',
  perfect_food: 'Bác Ba mách nước: Khách tấm tắc khen gà ngon chuẩn vị nghệ nhân! Hãy gửi lời cảm ơn từ đáy lòng và duy trì cái tâm làm bếp vàng giòn.',
  clean_hygiene: 'Bác Ba mách nước: Bếp sạch dầu trong là niềm tự hào của tiệm. Hãy tự tin khẳng định tiêu chuẩn ATTP 5 sao của tiệm gà chúng ta.',
  general_praise: 'Bác Ba mách nước: Khách yêu mến tiệm! Hãy gửi lời cảm ơn ngọt ngào để kết nối tình thân, biến khách vãng lai thành khách tri kỷ.'
};

// =========================================================================
// HÀM XÁC ĐỊNH PHẢN HỒI CỦA KHÁCH HÀNG DỰA TRÊN STRATEGY, PERSONA & CHỦ ĐỀ
// =========================================================================
export function resolveCustomerReaction(
  strategy: 'sincere' | 'witty' | 'firm',
  personaGroup?: string,
  topic?: string,
  isRecommended?: boolean
): string {
  const isSevere = topic === 'dirty_oil' || topic === 'burnt_food' || topic === 'wrong_order';
  const isPraise = topic === 'perfect_food' || topic === 'fast_speed' || topic === 'great_space' || topic === 'cheap_price' || topic === 'clean_hygiene' || topic === 'general_praise';
  const isGenzOrStudent = personaGroup === 'genz' || personaGroup === 'student';
  const isStrictPersona = personaGroup === 'foodie' || personaGroup === 'elder' || personaGroup === 'office';

  let pool: string[];

  if (isPraise) {
    if (strategy === 'witty') pool = CUSTOMER_REACTION_POOLS.witty_positive;
    else if (strategy === 'sincere') pool = CUSTOMER_REACTION_POOLS.praise_positive;
    else pool = CUSTOMER_REACTION_POOLS.firm_positive;
  } else {
    // Các trường hợp sự cố / phàn nàn
    if (strategy === 'sincere') {
      pool = CUSTOMER_REACTION_POOLS.sincere_positive;
    } else if (strategy === 'witty') {
      // Nếu sự cố nặng mà khách nghiêm túc -> phản ứng tiêu cực!
      if (isSevere && isStrictPersona) {
        pool = CUSTOMER_REACTION_POOLS.witty_negative;
      } else if (isGenzOrStudent) {
        pool = CUSTOMER_REACTION_POOLS.witty_positive;
      } else {
        // Hên xui 60% tích cực, 40% khó chịu
        pool = Math.random() < 0.6 ? CUSTOMER_REACTION_POOLS.witty_positive : CUSTOMER_REACTION_POOLS.witty_negative;
      }
    } else { // firm
      // Nếu có lý do xác đáng và là phương án tốt -> tích cực, ngược lại dễ bị chê cãi cùn
      if (isRecommended || topic === 'expensive' || topic === 'missed_order') {
        pool = CUSTOMER_REACTION_POOLS.firm_positive;
      } else {
        pool = CUSTOMER_REACTION_POOLS.firm_negative;
      }
    }
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return chosen || CUSTOMER_REACTION_POOLS.sincere_positive[0] || 'Khách gật gù cảm ơn tiệm!';
}

// Sinh 3 phương án phản hồi chiến lược có chiều sâu dựa trên chủ đề và tâm lý khách
function getRawOptions(topic: string, orderSummary: string, personaGroup?: string): any[] {
  switch (topic) {
    case 'wrong_order':
      return [
        {
          id: 'rep_wrong_sincere',
          strategy: 'sincere',
          label: '🙏 Chân thành nhận lỗi & Tặng voucher',
          replyText: `Dạ tiệm xin cúi đầu nhận lỗi vì sự tắc trách lên sai đơn ${orderSummary} của bạn ạ! Tiệm xin gửi tặng bạn voucher miễn phí 1 combo gà giòn cho lần tới ghé tiệm để tạ lỗi nhé!`,
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.2,
          karmaReward: { community: 1.0, craftsmanship: 0.5 }
        },
        {
          id: 'rep_wrong_witty',
          strategy: 'witty',
          label: '😄 Hài hước bắt trend GenZ',
          replyText: 'Trời ơi kiếp nạn thứ 82 của tiệm gà! Đầu bếp lú lẫn tính thử thách lòng kiên nhẫn của bạn chút xíu thui á, đừng giận tiệm nha sếp ơi!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.2 }
        },
        {
          id: 'rep_wrong_firm',
          strategy: 'firm',
          label: '😐 Phân trần giờ cao điểm',
          replyText: 'Dạ giờ cao điểm shipper hối đơn quá nên nhân viên bị cuống tay, mong bạn thông cảm bỏ qua cho quán nhỏ vỉa hè.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0,
          karmaReward: { craftsmanship: 0.2 }
        }
      ];

    case 'missed_order':
    case 'slow_speed':
      return [
        {
          id: 'rep_missed_sincere',
          strategy: 'sincere',
          label: '🙏 Nhận lỗi tốc độ & Mời nước mát',
          replyText: 'Dạ tiệm ngàn lần xin lỗi vì để bạn chờ đợi quá lâu trong cơn đói! Tiệm đang nâng cấp thêm bếp chiên, lần sau ghé tiệm xin mời bạn 1 ly nước ngọt mát lạnh nhé!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.2,
          karmaReward: { community: 1.0, craftsmanship: 0.5 }
        },
        {
          id: 'rep_missed_witty',
          strategy: 'witty',
          label: '⚡ Hứa hẹn nhanh như người yêu cũ',
          replyText: 'Huhu tiệm biết lỗi rùi ạ! Lần tới bạn ghé chỉ cần nháy mắt là gà giòn bay ra nhanh hơn tốc độ crush seen tin nhắn luôn nha!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.0, ambition: 0.5 }
        },
        {
          id: 'rep_missed_firm',
          strategy: 'firm',
          label: '⏳ Giải thích gà chiên tươi theo mẻ',
          replyText: 'Dạ vì gà rán tại tiệm luôn chiên tươi nóng hổi từng mẻ chứ không dùng đồ chiên sẵn ỉu xìu nên hơi mất thời gian một xíu ạ.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0.05,
          karmaReward: { craftsmanship: 0.8 }
        }
      ];

    case 'burnt_food':
      return [
        {
          id: 'rep_burnt_sincere',
          strategy: 'sincere',
          label: '🍗 Đổi mẻ mới & Siết nhiệt kế bếp',
          replyText: 'Dạ tiệm thành thật xin lỗi vì mẻ gà lỡ nhiệt làm hỏng bữa ăn của bạn! Bếp trưởng đã siết lại đồng hồ nhiệt và xin đổi lại cho bạn mẻ gà vàng giòn chuẩn vị bất kỳ lúc nào!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.2,
          karmaReward: { craftsmanship: 1.2, community: 0.5 }
        },
        {
          id: 'rep_burnt_witty',
          strategy: 'witty',
          label: '😅 Đùa vui phạt đầu bếp ăn gà khét',
          replyText: 'Ui trời nay lửa bếp bén duyên quá trớn rùi! Để tiệm phạt đầu bếp ăn gà khét trừ cơm nha, lần sau bao vàng ươm rực rỡ nè!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.0 }
        },
        {
          id: 'rep_burnt_firm',
          strategy: 'firm',
          label: '🔥 Phân trần bột sốt cay đậm vị',
          replyText: 'Dạ da gà bột cay chiên kỹ nên vỏ ngoài hơi sẫm màu, nhưng tiệm sẽ chú ý canh thời gian chuẩn xác hơn ạ.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0,
          karmaReward: { craftsmanship: 0.3 }
        }
      ];

    case 'dirty_oil':
      return [
        {
          id: 'rep_oil_sincere',
          strategy: 'sincere',
          label: '🛡️ Cam kết thay 100% dầu mới & Khử trùng',
          replyText: 'Dạ tiệm vô cùng cảm ơn phản ánh quý báu này! Tiệm đã lập tức xả bỏ toàn bộ mẻ dầu cũ, thay 100% dầu thực vật mới tinh và cam kết siết chặt vệ sinh chuẩn ATTP!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.2,
          karmaReward: { craftsmanship: 1.0, community: 1.0 }
        },
        {
          id: 'rep_oil_witty',
          strategy: 'witty',
          label: '🧽 Đùa vui chảo sáng bóng soi gương',
          replyText: 'Dạ tiệm đã bắt bếp trưởng chà sạch từng centimet lòng chảo rồi ạ! Giờ chảo sáng bóng soi gương được luôn á bạn ơi!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 0.8 }
        },
        {
          id: 'rep_oil_firm',
          strategy: 'firm',
          label: '📋 Giải thích cặn bột chiên sốt',
          replyText: 'Dạ do vụn bột chiên giòn rớt lại tạo cặn sẫm màu chứ dầu tiệm thay định kỳ, tiệm sẽ vớt cặn liên tục không để bám vào gà nữa ạ.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0.05,
          karmaReward: { craftsmanship: 0.5 }
        }
      ];

    case 'expensive':
      return [
        {
          id: 'rep_exp_sincere',
          strategy: 'sincere',
          label: '🌱 Giải thích chất lượng & Giới thiệu combo',
          replyText: 'Dạ tiệm xin cảm ơn bạn! Tiệm sử dụng 100% thịt gà tươi mỗi ngày và bột nhập khẩu nên giá có nhỉnh hơn xíu, lần sau bạn thử gọi combo tiết kiệm để hời hơn nha!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.15,
          karmaReward: { craftsmanship: 0.8, community: 0.5 }
        },
        {
          id: 'rep_exp_witty',
          strategy: 'witty',
          label: '💸 Trả lời hài hước không dát vàng',
          replyText: 'Huhu gà nhà tui chứ không phải gà dát vàng đâu sếp ơi! Để tiệm nghiên cứu thêm món ăn vặt 10k-15k cho sinh viên tụi mình no say nè!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.2 }
        },
        {
          id: 'rep_exp_firm',
          strategy: 'firm',
          label: '📊 Khẳng định giá niêm yết chuẩn thị trường',
          replyText: 'Dạ mức giá tiệm đưa ra đã cân đối rất kỹ với chi phí nguyên liệu và công cán phục vụ, tiệm xin giữ vững chất lượng này ạ.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0,
          karmaReward: { ambition: 0.5, craftsmanship: 0.5 }
        }
      ];

    case 'bad_space':
      return [
        {
          id: 'rep_space_sincere',
          strategy: 'sincere',
          label: '❄️ Báo tin nâng cấp quạt mát & Máy lạnh',
          replyText: 'Dạ tiệm xin lỗi vì thời tiết SG oi ả làm bạn khó chịu ạ! Tiệm đang gom vốn sắm thêm quạt hơi nước và phòng lạnh, mong sớm đón bạn trở lại trong không gian mát rượi!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.15,
          karmaReward: { community: 0.8, ambition: 0.8 }
        },
        {
          id: 'rep_space_witty',
          strategy: 'witty',
          label: '⛱️ Rủ rê ngồi chill hóng gió hẻm',
          replyText: 'Dạ trời nóng mà lòng người ấm áp nè bạn ơi! Ghé cữ chiều tối có gió hẻm 1102 thổi lồng lộng mát rượi chill lắm á!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.0 }
        },
        {
          id: 'rep_space_firm',
          strategy: 'firm',
          label: '🛵 Gợi ý đặt mang về hoặc qua app',
          replyText: 'Dạ tiệm vỉa hè diện tích có hạn, nếu ngại nóng bạn có thể gọi đặt mang về hoặc order qua app để ăn thoải mái tại nhà nha.',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0,
          karmaReward: { ambition: 0.5 }
        }
      ];

    default: // Các bài khen 4..5 sao
      return [
        {
          id: 'rep_praise_sincere',
          strategy: 'sincere',
          label: '💖 Tri ân chân thành từ đáy lòng',
          replyText: 'Dạ những lời khen này là nguồn động lực to lớn nhất cho tiệm gà vỉa hè tụi mình ạ! Tiệm sẽ luôn giữ vững phong độ này để đón bạn mỗi ngày nha!',
          isRecommended: true,
          customerReaction: resolveCustomerReaction('sincere', personaGroup, topic, true),
          starBonus: 0.1,
          karmaReward: { community: 1.5, craftsmanship: 0.5 }
        },
        {
          id: 'rep_praise_witty',
          strategy: 'witty',
          label: '🥳 Bắt trend GenZ cảm ơn xỉu up xỉu down',
          replyText: 'Đọc xong review mà cả tiệm gà cười tít mắt muốn xỉu ngang vì vui á trời! Thả 1000 trái tim cho người khách dễ thương nhất quả đất!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('witty', personaGroup, topic, false),
          starBonus: 0.1,
          karmaReward: { community: 1.5, ambition: 0.5 }
        },
        {
          id: 'rep_praise_firm',
          strategy: 'firm',
          label: '🍗 Cam kết nghệ nhân ẩm thực',
          replyText: 'Cảm ơn bạn đã tin chọn Tiệm Gà Nhà Tui. Chất lượng vàng giòn chuẩn vị luôn là lời cam kết danh dự của tiệm!',
          isRecommended: false,
          customerReaction: resolveCustomerReaction('firm', personaGroup, topic, false),
          starBonus: 0.05,
          karmaReward: { craftsmanship: 1.5 }
        }
      ];
  }
}

export function createReviewReplyOptions(topic: string, orderSummary: string, personaGroup?: string): ReviewReplyOption[] {
  const rawList = getRawOptions(topic, orderSummary, personaGroup);
  return rawList.map((opt: any) => ({
    id: opt.id,
    strategy: (opt.strategy || opt.style || 'sincere') as 'sincere' | 'witty' | 'firm',
    style: (opt.strategy || opt.style || 'sincere') as 'sincere' | 'witty' | 'firm',
    label: opt.label || '',
    text: opt.text || opt.replyText || '',
    replyText: opt.text || opt.replyText || '',
    customerReaction: opt.customerReaction || '',
    isRecommended: Boolean(opt.isRecommended),
    starBonus: opt.starBonus || 0,
    karmaReward: opt.karmaReward || opt.karmaBonus || {},
    karmaBonus: opt.karmaReward || opt.karmaBonus || {},
  }));
}

export interface PersonaAuthor {
  name: string;
  avatar: string;
  group: 'genz' | 'office' | 'resident' | 'reviewer' | 'shipper' | 'foodie' | 'student';
}

export const PERSONA_AUTHORS: PersonaAuthor[] = [
  // GenZ & Sinh viên
  { name: 'Bé Trúc Mê Gà 🐥', avatar: '👧', group: 'genz' },
  { name: 'GenZ Săn Sale 💅', avatar: '👱‍♀️', group: 'genz' },
  { name: 'Huy Boy Phố 🕶️', avatar: '👦', group: 'genz' },
  { name: 'Quỳnh Kem Mút 🌸', avatar: '👧', group: 'genz' },
  { name: 'Cú Đêm KTX 🌙', avatar: '👨‍🎓', group: 'student' },
  { name: 'Linh Kẹo Ngọt 🍬', avatar: '👱‍♀️', group: 'genz' },
  { name: 'Minh Nghiền Gà 🍗', avatar: '👦', group: 'student' },

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
  { name: 'Food Blogger 1M Fl ⭐', avatar: '📸', group: 'foodie' },
  { name: 'Thánh Ăn Vặt Hẻm 🍗', avatar: '😋', group: 'foodie' },
  { name: 'Quỳnh Đi Đâu Ăn Đó 🍜', avatar: '🥢', group: 'reviewer' },

  // Shipper công nghệ
  { name: 'Đạt Shipper Xanh 🛵', avatar: '🛵', group: 'shipper' },
  { name: 'Bảo Giao Nhanh ⚡', avatar: '🛵', group: 'shipper' },
  { name: 'Hải Mũ Bảo Hiểm 🛵', avatar: '🛵', group: 'shipper' }
];

export const GENZ_USERNAMES = PERSONA_AUTHORS.map(a => a.name);
export const CUST_AVATARS = ['👧', '👦', '👩', '🧑', '👱‍♀️', '👨‍🎓', '🛵', '💅', '🐱', '🕶️', '🤳', '📸'];

// =========================================================================
// HÀM SINH ĐÁNH GIÁ CHO TỪNG LƯỢT KHÁCH HÀNG (PER-CUSTOMER REVIEW GENERATOR)
// =========================================================================
export function generateIndividualCustomerReview(
  day: number,
  order: CustomerOrder,
  outcome: {
    kind: 'complete' | 'incomplete' | 'wrong' | 'apologized' | 'lost';
    patienceRatio: number; // 0..1
    hasBurnt?: boolean;
    hasDirtyOil?: boolean;
    isPerfect?: boolean;
    menuLookup?: (id: string) => string;
  }
): CustomerReview {
  const personality = order.personality || 'easygoing';

  // 1. Xác định số sao (1 đến 5 sao) và chủ đề (topic)
  let stars = 5;
  let topic = 'general_praise';
  let weakest: keyof StarRating = 'taste';

  if (outcome.kind === 'wrong') {
    stars = personality === 'easygoing' ? 2 : 1;
    topic = 'wrong_order';
    weakest = 'taste';
  } else if (outcome.kind === 'lost') {
    stars = 1;
    topic = 'missed_order';
    weakest = 'speed';
  } else if (outcome.kind === 'incomplete') {
    stars = personality === 'easygoing' ? 3 : personality === 'foodie' ? 1 : 2;
    topic = 'missed_order';
    weakest = 'speed';
  } else if (outcome.kind === 'apologized') {
    stars = personality === 'easygoing' ? 3 : 2;
    topic = 'missed_order';
    weakest = 'speed';
  } else {
    // Hoàn tất món (complete)
    if (outcome.hasBurnt) {
      stars = personality === 'foodie' ? 1 : 2;
      topic = 'burnt_food';
      weakest = 'taste';
    } else if (outcome.hasDirtyOil) {
      stars = personality === 'foodie' ? 1 : 2;
      topic = 'dirty_oil';
      weakest = 'hygiene';
    } else if (outcome.patienceRatio <= 0.30) {
      // Phục vụ quá chậm
      stars = personality === 'impatient' || personality === 'driver' ? 1 : personality === 'easygoing' ? 3 : 2;
      topic = 'slow_speed';
      weakest = 'speed';
    } else if (outcome.patienceRatio >= 0.70) {
      // Phục vụ siêu nhanh
      stars = 5;
      topic = 'fast_speed';
      weakest = 'speed';
    } else if (outcome.isPerfect || personality === 'foodie') {
      stars = 5;
      topic = 'perfect_food';
      weakest = 'taste';
    } else if (personality === 'student' || personality === 'frugal') {
      stars = Math.random() < 0.6 ? 5 : 4;
      topic = 'cheap_price';
      weakest = 'pricing';
    } else {
      stars = Math.random() < 0.7 ? 5 : 4;
      topic = Math.random() < 0.4 ? 'great_space' : 'general_praise';
      weakest = 'taste';
    }
  }

  // 2. Tóm tắt đơn gọi thực tế
  let orderSummary = order.comboName || '';
  if (!orderSummary && order.items && order.items.length > 0) {
    orderSummary = order.items
      .map(it => {
        const name = outcome.menuLookup ? outcome.menuLookup(it.menuItemId) : it.menuItemId;
        return `${it.count}x ${name}`;
      })
      .join(', ');
  }
  if (!orderSummary) orderSummary = '1 Phần Gà Rán Giòn Nóng';

  // 3. Lọc template tương ứng
  const matchingTemplates = PROCEDURAL_REVIEW_TEMPLATES.filter(
    t => t.topic === topic && stars >= t.minStars && stars <= t.maxStars
  );
  const fallbackTemplates = PROCEDURAL_REVIEW_TEMPLATES.filter(
    t => stars >= t.minStars && stars <= t.maxStars
  );
  const pool = matchingTemplates.length > 0 ? matchingTemplates : fallbackTemplates.length > 0 ? fallbackTemplates : PROCEDURAL_REVIEW_TEMPLATES;
  const chosenTemplate = pool[Math.floor(Math.random() * pool.length)]!;

  const comment = chosenTemplate.text.replace(/\[ORDER\]/g, orderSummary);

  // 4. Ánh xạ personaGroup
  let personaGroup: 'genz' | 'office' | 'resident' | 'reviewer' | 'shipper' | 'foodie' | 'student' = 'genz';
  switch (personality) {
    case 'student':
      personaGroup = 'student';
      break;
    case 'driver':
      personaGroup = 'shipper';
      break;
    case 'foodie':
      personaGroup = 'foodie';
      break;
    case 'generous':
    case 'frugal':
      personaGroup = 'resident';
      break;
    default:
      personaGroup = Math.random() < 0.5 ? 'genz' : 'office';
  }

  const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  return {
    id: reviewId,
    authorName: order.customerName,
    avatar: order.avatar || '🍗',
    day,
    stars,
    comment,
    tags: chosenTemplate.tags || ['#TiemGaNhaTui', '#Hem1102'],
    weakestCriteria: weakest,
    orderSummary,
    topic,
    personaGroup,
    sentiment: TOPIC_SENTIMENTS[topic] || (stars >= 4 ? 'delighted' : 'disappointed'),
    advisorHint: TOPIC_ADVISOR_HINTS[topic] || 'Khách quý ở sự chân tình, con nhớ đối đáp chu đáo nghen!',
    replyOptions: createReviewReplyOptions(topic, orderSummary, personaGroup)
  };
}
