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
  // ĐÁNH GIÁ TỐT: VỆ SINH SẠCH BONG (clean_hygiene) - 4..5 sao
  // ==========================================
  {
    criteria: 'hygiene',
    topic: 'clean_hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Quán sạch bong kin kít! Dầu chiên vàng óng thơm phức, bếp mở nhìn thấy từng khâu yên tâm tuyệt đối 10/10!',
    tags: ['#SachBongKinKit', '#DauVangOng', '#YenTamATTP']
  },

  // ==========================================
  // CÁC MẪU REVIEW ĐẶC BIỆT CHIỀU SÂU (ĐA DẠNG NGỮ CẢNH HẺM 1102)
  // ==========================================
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
    criteria: 'speed',
    topic: 'fast_speed',
    minStars: 5,
    maxStars: 5,
    text: 'Giao đồ ăn cả ngày đói lả ghé mua 1 phần gà popcorn, tiệm lên món cái rẹt kịp chạy cuốc tiếp, còn tặng thêm ly nước lạnh. Ấm lòng shipper!',
    tags: ['#AmLongShipper', '#GiaoNhanhKipCuoc', '#NghiaTinhHem']
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
    criteria: 'pricing',
    topic: 'cheap_price',
    minStars: 5,
    maxStars: 5,
    text: 'Tan học đói rã rời tấp vô tiệm làm combo gà giòn 25k no tới tối, nước sốt mật ong thơm lừng. Quán ruột của cả trường tụi em!',
    tags: ['#HocSinhSinhVien', '#GiaSieuYeu', '#QuanRuotTruong']
  }
];

export const GENZ_REVIEW_TEMPLATES: NonEmpty<ReviewTemplate> = PROCEDURAL_REVIEW_TEMPLATES as unknown as NonEmpty<ReviewTemplate>;

// Ma trận Tâm lý khách hàng theo từng chủ đề sự cố
export const TOPIC_SENTIMENTS: Record<string, 'furious' | 'disappointed' | 'neutral' | 'delighted' | 'amused'> = {
  wrong_order: 'furious',
  missed_order: 'disappointed',
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

import { ReviewReplyOption } from '../types/game';

// Sinh 3 phương án phản hồi chiến lược có chiều sâu dựa trên chủ đề và tâm lý khách
function getRawOptions(topic: string, orderSummary: string): any[] {
  switch (topic) {
    case 'wrong_order':
      return [
        {
          id: 'rep_wrong_sincere',
          style: 'sincere',
          label: '🙏 Chân thành nhận lỗi & Tặng voucher',
          replyText: `Dạ tiệm xin cúi đầu nhận lỗi vì sự tắc trách lên sai đơn ${orderSummary} của bạn ạ! Tiệm xin gửi tặng bạn voucher miễn phí 1 combo gà giòn cho lần tới ghé tiệm để tạ lỗi nhé!`,
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Thấy tiệm nhận lỗi đàng hoàng và biết cách xử lý nên mình nguôi giận rồi. Lần tới mình sẽ ghé lại.'",
          starBonus: 0.2,
          karmaBonus: { community: 1.0, craftsmanship: 0.5 }
        },
        {
          id: 'rep_wrong_witty',
          style: 'witty',
          label: '😄 Hài hước bắt trend GenZ',
          replyText: 'Trời ơi kiếp nạn thứ 82 của tiệm gà! Đầu bếp lú lẫn tính thử thách lòng kiên nhẫn của bạn chút xíu thui á, đừng giận tiệm nha sếp ơi!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Haha tiệm rep huề vốn ghê, nhưng thôi thấy cũng hài hước nên bỏ qua đó.'",
          starBonus: 0.1,
          karmaBonus: { community: 1.2 }
        },
        {
          id: 'rep_wrong_firm',
          style: 'firm',
          label: '😐 Phân trần giờ cao điểm',
          replyText: 'Dạ giờ cao điểm shipper hối đơn quá nên nhân viên bị cuống tay, mong bạn thông cảm bỏ qua cho quán nhỏ vỉa hè.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Quán đông thì cũng phải cẩn thận chứ, thôi ghi nhận quán có trả lời.'",
          starBonus: 0,
          karmaBonus: { craftsmanship: 0.2 }
        }
      ];

    case 'missed_order':
      return [
        {
          id: 'rep_missed_sincere',
          style: 'sincere',
          label: '🙏 Nhận lỗi tốc độ & Mời nước mát',
          replyText: 'Dạ tiệm ngàn lần xin lỗi vì để bạn chờ đợi quá lâu trong cơn đói! Tiệm đang nâng cấp thêm bếp chiên, lần sau ghé tiệm xin mời bạn 1 ly nước ngọt mát lạnh nhé!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Cảm ơn chủ quán đã lắng nghe, bữa sau mình sẽ ghé vào giờ vắng hơn ủng hộ tiệm.'",
          starBonus: 0.2,
          karmaBonus: { community: 1.0, craftsmanship: 0.5 }
        },
        {
          id: 'rep_missed_witty',
          style: 'witty',
          label: '⚡ Hứa hẹn nhanh như người yêu cũ',
          replyText: 'Huhu tiệm biết lỗi rùi ạ! Lần tới bạn ghé chỉ cần nháy mắt là gà giòn bay ra nhanh hơn tốc độ crush seen tin nhắn luôn nha!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Được lời như cởi tấm lòng, để xem lần sau nhanh thật không nha!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.0, ambition: 0.5 }
        },
        {
          id: 'rep_missed_firm',
          style: 'firm',
          label: '⏳ Giải thích gà chiên tươi theo mẻ',
          replyText: 'Dạ vì gà rán tại tiệm luôn chiên tươi nóng hổi từng mẻ chứ không dùng đồ chiên sẵn ỉu xìu nên hơi mất thời gian một xíu ạ.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'À ra là gà chiên tươi, thế thì cũng bớt bực hơn xíu.'",
          starBonus: 0.05,
          karmaBonus: { craftsmanship: 0.8 }
        }
      ];

    case 'burnt_food':
      return [
        {
          id: 'rep_burnt_sincere',
          style: 'sincere',
          label: '🍗 Đổi mẻ mới & Siết nhiệt kế bếp',
          replyText: 'Dạ tiệm thành thật xin lỗi vì mẻ gà lỡ nhiệt làm hỏng bữa ăn của bạn! Bếp trưởng đã siết lại đồng hồ nhiệt và xin đổi lại cho bạn mẻ gà vàng giòn chuẩn vị bất kỳ lúc nào!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Quán có trách nhiệm vậy là quá tốt rồi, mình đánh giá cao cách hành xử này!'",
          starBonus: 0.2,
          karmaBonus: { craftsmanship: 1.2, community: 0.5 }
        },
        {
          id: 'rep_burnt_witty',
          style: 'witty',
          label: '😅 Đùa vui phạt đầu bếp ăn gà khét',
          replyText: 'Ui trời nay lửa bếp bén duyên quá trớn rùi! Để tiệm phạt đầu bếp ăn gà khét trừ cơm nha, lần sau bao vàng ươm rực rỡ nè!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Đọc rep mà phì cười, thôi bữa sau nhớ canh lửa giùm tui nghen!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.0 }
        },
        {
          id: 'rep_burnt_firm',
          style: 'firm',
          label: '🔥 Phân trần bột sốt cay đậm vị',
          replyText: 'Dạ da gà bột cay chiên kỹ nên vỏ ngoài hơi sẫm màu, nhưng tiệm sẽ chú ý canh thời gian chuẩn xác hơn ạ.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Hơi sẫm gì mà đắng ngắt, nhưng thôi bỏ qua lần này.'",
          starBonus: 0,
          karmaBonus: { craftsmanship: 0.3 }
        }
      ];

    case 'dirty_oil':
      return [
        {
          id: 'rep_oil_sincere',
          style: 'sincere',
          label: '🛡️ Cam kết thay 100% dầu mới & Khử trùng',
          replyText: 'Dạ tiệm vô cùng cảm ơn phản ánh quý báu này! Tiệm đã lập tức xả bỏ toàn bộ mẻ dầu cũ, thay 100% dầu thực vật mới tinh và cam kết siết chặt vệ sinh chuẩn ATTP!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Biết lắng nghe và hành động quyết liệt vì sức khỏe khách hàng, xứng đáng được ủng hộ tiếp!'",
          starBonus: 0.2,
          karmaBonus: { craftsmanship: 1.0, community: 1.0 }
        },
        {
          id: 'rep_oil_witty',
          style: 'witty',
          label: '🧽 Đùa vui chảo sáng bóng soi gương',
          replyText: 'Dạ tiệm đã bắt bếp trưởng chà sạch từng centimet lòng chảo rồi ạ! Giờ chảo sáng bóng soi gương được luôn á bạn ơi!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Nói được thì làm được nha chủ tiệm, lần sau tới soi gương đó!'",
          starBonus: 0.1,
          karmaBonus: { community: 0.8 }
        },
        {
          id: 'rep_oil_firm',
          style: 'firm',
          label: '📋 Giải thích cặn bột chiên sốt',
          replyText: 'Dạ do vụn bột chiên giòn rớt lại tạo cặn sẫm màu chứ dầu tiệm thay định kỳ, tiệm sẽ vớt cặn liên tục không để bám vào gà nữa ạ.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Dù là cặn bột thì cũng phải vớt sạch, tiệm nhớ rút kinh nghiệm.'",
          starBonus: 0.05,
          karmaBonus: { craftsmanship: 0.5 }
        }
      ];

    case 'expensive':
      return [
        {
          id: 'rep_exp_sincere',
          style: 'sincere',
          label: '🌱 Giải thích chất lượng & Giới thiệu combo',
          replyText: 'Dạ tiệm xin cảm ơn bạn! Tiệm sử dụng 100% thịt gà tươi mỗi ngày và bột nhập khẩu nên giá có nhỉnh hơn xíu, lần sau bạn thử gọi combo tiết kiệm để hời hơn nha!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'À tiền nào của nấy, gà tươi thì ăn cũng an tâm hơn. Cảm ơn tiệm đã gợi ý combo!'",
          starBonus: 0.15,
          karmaBonus: { craftsmanship: 0.8, community: 0.5 }
        },
        {
          id: 'rep_exp_witty',
          style: 'witty',
          label: '💸 Trả lời hài hước không dát vàng',
          replyText: 'Huhu gà nhà tui chứ không phải gà dát vàng đâu sếp ơi! Để tiệm nghiên cứu thêm món ăn vặt 10k-15k cho sinh viên tụi mình no say nè!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Ra món 10k-15k là tui rủ cả lớp ra ăn mỗi ngày luôn á sếp!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.2 }
        },
        {
          id: 'rep_exp_firm',
          style: 'firm',
          label: '📊 Khẳng định giá niêm yết chuẩn thị trường',
          replyText: 'Dạ mức giá tiệm đưa ra đã cân đối rất kỹ với chi phí nguyên liệu và công cán phục vụ, tiệm xin giữ vững chất lượng này ạ.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Ok quán giữ chất lượng thì giá đó cũng chấp nhận được.'",
          starBonus: 0,
          karmaBonus: { ambition: 0.5, craftsmanship: 0.5 }
        }
      ];

    case 'bad_space':
      return [
        {
          id: 'rep_space_sincere',
          style: 'sincere',
          label: '❄️ Báo tin nâng cấp quạt mát & Máy lạnh',
          replyText: 'Dạ tiệm xin lỗi vì thời tiết SG oi ả làm bạn khó chịu ạ! Tiệm đang gom vốn sắm thêm quạt hơi nước và phòng lạnh, mong sớm đón bạn trở lại trong không gian mát rượi!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Có phòng lạnh là mình ghé hoài luôn á, chúc tiệm sớm mở rộng!'",
          starBonus: 0.15,
          karmaBonus: { community: 0.8, ambition: 0.8 }
        },
        {
          id: 'rep_space_witty',
          style: 'witty',
          label: '⛱️ Rủ rê ngồi chill hóng gió hẻm',
          replyText: 'Dạ trời nóng mà lòng người ấm áp nè bạn ơi! Ghé cữ chiều tối có gió hẻm 1102 thổi lồng lộng mát rượi chill lắm á!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Haha được rồi, lần sau mình canh đi chiều tối ngắm phố hẻm!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.0 }
        },
        {
          id: 'rep_space_firm',
          style: 'firm',
          label: '🛵 Gợi ý đặt mang về hoặc qua app',
          replyText: 'Dạ tiệm vỉa hè diện tích có hạn, nếu ngại nóng bạn có thể gọi đặt mang về hoặc order qua app để ăn thoải mái tại nhà nha.',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Ừ vậy lần sau mình đặt ship về nhà cho tiện.'",
          starBonus: 0,
          karmaBonus: { ambition: 0.5 }
        }
      ];

    default: // Các bài khen 4..5 sao
      return [
        {
          id: 'rep_praise_sincere',
          style: 'sincere',
          label: '💖 Tri ân chân thành từ đáy lòng',
          replyText: 'Dạ những lời khen này là nguồn động lực to lớn nhất cho tiệm gà vỉa hè tụi mình ạ! Tiệm sẽ luôn giữ vững phong độ này để đón bạn mỗi ngày nha!',
          isRecommended: true,
          customerReaction: "Khách phản hồi: 'Quán vừa ngon vừa có tâm, chắc chắn mình sẽ rủ thêm bạn bè ủng hộ!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.5, craftsmanship: 0.5 }
        },
        {
          id: 'rep_praise_witty',
          style: 'witty',
          label: '🥳 Bắt trend GenZ cảm ơn xỉu up xỉu down',
          replyText: 'Đọc xong review mà cả tiệm gà cười tít mắt muốn xỉu ngang vì vui á trời! Thả 1000 trái tim cho người khách dễ thương nhất quả đất!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Dễ thương xỉu, cho tiệm 1000 điểm uy tín luôn nè!'",
          starBonus: 0.1,
          karmaBonus: { community: 1.5, ambition: 0.5 }
        },
        {
          id: 'rep_praise_firm',
          style: 'firm',
          label: '🍗 Cam kết nghệ nhân ẩm thực',
          replyText: 'Cảm ơn bạn đã tin chọn Tiệm Gà Nhà Tui. Chất lượng vàng giòn chuẩn vị luôn là lời cam kết danh dự của tiệm!',
          isRecommended: false,
          customerReaction: "Khách phản hồi: 'Chúc tiệm luôn phát tài và giữ vững tay nghề chuẩn mực này nhé!'",
          starBonus: 0.05,
          karmaBonus: { craftsmanship: 1.5 }
        }
      ];
  }
}

export function createReviewReplyOptions(topic: string, orderSummary: string): ReviewReplyOption[] {
  const rawList = getRawOptions(topic, orderSummary);
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
