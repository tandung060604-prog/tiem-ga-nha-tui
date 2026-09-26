// SINH TỰ ĐỘNG bởi `npm run jev:content` (Jev · TypeSafe). Không sửa tay.
// Độ hài 0–4 của từng mẫu review (game ưu tiên câu hài hơn) và danh sách câu bị chặn vì phản cảm.
export const REVIEW_HUMOR: Readonly<Record<string, number>> = {
  "Gà ngon nhưng đợi lâu tới mức mình với người yêu chia tay luôn rồi đồ ăn mới ra... ⭐ 1 sao vì tổn thương tình cảm!": 2.81,
  "Đợi gà mà ngỡ như đợi crush trả lời tin nhắn, muốn mọc rễ ở quán luôn á sếp ơi!": 2.68,
  "Huhu đói hoa cả mắt, nhìn bạn bàn bên ăn mà nước miếng chảy ròng ròng. Nấu gì lâu dữ thần thiên địa!": 2.34,
  "Gà giòn xỉu up xỉu down nhưng làm đồ lâu quá trời, trừ 3 sao tốc độ cho tiệm thức tỉnh!": 1.92,
  "Chờ hơi lâu xíu nhưng bù lại miếng gà nóng hổi phỏng cả mỏ. Tạm tha nha.": 1.68,
  "Vừa order quay qua tính chụp tấm ảnh sống ảo thì đồ ăn đã bưng ra! Tốc độ bàn thờ 10 điểm không có nhưng!": 2.13,
  "Nhanh như người yêu cũ trở mặt! Gà nóng hổi giòn rụm vừa thổi vừa ăn cưng xỉu.": 2.41,
  "Gà chiên bị khét đen thùi lùi như tương lai của mình vậy á. Cắn một miếng đắng nghét khóc thét!": 2.78,
  "Bột chiên dày cui mà bên trong thịt còn hơi tái đỏ. Bếp ơi có tâm xíu đi ạ, đang thất tình đừng làm tui đau bụng!": 2.42,
  "Ủa nay bếp giận người yêu hay sao mà khoai lắc phô mai mặn chát chúa zậy trời?": 2.33,
  "Gà ăn cũng ổn áp, da giòn nhưng thịt hơi khô xíu. Cần thêm sốt cay chấm mút mới đã cái nư.": 0.92,
  "Ăn miếng gà mà ngỡ đang ở thiên đường! Da giòn tan rôm rốp, thịt mọng nước ngọt lịm tim, ngon xỉu!": 1.61,
  "Gà sốt mật ong bơ tỏi đỉnh nóc kịch trần bay phấp phới! Ăn xong muốn xin in-tư anh bếp liền!": 2.54,
  "Vị ngon nhức nách! Cắn miếng da gà kêu rôm rốp át cả tiếng deadline réo bên tai.": 2.79,
  "Gà chiên dầu đen sì, cắn vào nghe nồng mùi khét. Chủ tiệm tiếc tiền thay dầu hay gì? 1 sao cảnh cáo!": 1.34,
  "Bàn dính đầy tương cà với vụn khoai của khách trước, ngồi vô dính cả áo trắng xui xẻo ghê.": 1.46,
  "Quầy hơi bừa bộn một chút vào giờ cao điểm, nhưng chén dĩa vẫn sạch sẽ. Ráng phát huy nha tiệm.": 0.47,
  "Quán sạch bong kin kít! Dầu chiên vàng ươm, bếp mở nhìn thấy từng khâu yên tâm tuyệt đối.": 1.12,
  "Thơm phức mùi bơ sữa và gà rán, không hề có mùi dầu cũ khét lẹt. 10 điểm vệ sinh!": 1.05,
  "Trời SG 38 độ mà quán không bật máy lạnh, vừa ăn gà rán vừa đổ mồ hôi như tắm xông hơi!": 2.05,
  "Ngồi ghế nhựa sát lề đường bị khói xe tạt thẳng vô mặt, ăn miếng gà mà nuốt luôn cả bụi mịn.": 2.2,
  "Chỗ ngồi hơi hẹp xíu, đi nhóm đông phải chen chúc nhưng không khí vui vẻ nhộn nhịp.": 0.74,
  "Góc check-in Gà Bông cưng xỉu! Chụp cả trăm tấm hình sống ảo cháy máy, nhạc lofi chill phết!": 1.78,
  "Máy lạnh phà mát rượi, decor tông vàng kem ấm áp ăn gà rán ngắm mưa lãng mạn xỉu.": 2.06,
  "Ủa bán gà dát vàng hay sao mà chém giá khét lẹt dị? Ăn xong xem lại ví thấy bay màu nửa tháng tiền trọ.": 2.66,
  "Miếng gà bé xíu xiu bằng nắm tay mà giá trên trời, cảm giác bị “trap” quá trời trap.": 2.12,
  "Giá hơi chát hơn mấy chuỗi lớn một tẹo, nếu có thêm voucher hay combo học sinh sinh viên thì ngon lành.": 0.6,
  "Rẻ rúng bất ngờ! 35k một miếng gà to bự chảng ăn no cành hông, xứng đáng là chân ái cuối tháng cháy túi!": 2.31,
  "Combo đại tiệc siêu hời, chia ra mỗi đứa có mấy chục ngàn mà ăn no muốn lăn về luôn á!": 2.05
};

export const REVIEW_BLOCKED: readonly string[] = [];
