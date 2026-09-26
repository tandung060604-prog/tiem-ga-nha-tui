import { NonEmpty, StarRating } from '../types/game';

export interface ReviewTemplate {
  criteria: keyof StarRating;
  minStars: number;
  maxStars: number;
  text: string;
}

export const GENZ_REVIEW_TEMPLATES: NonEmpty<ReviewTemplate> = [
  // TỐC ĐỘ (Speed) - Chờ lâu hoặc phục vụ nhanh
  {
    criteria: 'speed',
    minStars: 1,
    maxStars: 2,
    text: 'Gà ngon nhưng đợi lâu tới mức mình với người yêu chia tay luôn rồi đồ ăn mới ra... ⭐ 1 sao vì tổn thương tình cảm!'
  },
  {
    criteria: 'speed',
    minStars: 1,
    maxStars: 2,
    text: 'Đợi gà mà ngỡ như đợi crush trả lời tin nhắn, muốn mọc rễ ở quán luôn á sếp ơi!'
  },
  {
    criteria: 'speed',
    minStars: 1,
    maxStars: 2,
    text: 'Huhu đói hoa cả mắt, nhìn bạn bàn bên ăn mà nước miếng chảy ròng ròng. Nấu gì lâu dữ thần thiên địa!'
  },
  {
    criteria: 'speed',
    minStars: 1,
    maxStars: 2,
    text: 'Gà giòn xỉu up xỉu down nhưng làm đồ lâu quá trời, trừ 3 sao tốc độ cho tiệm thức tỉnh!'
  },
  {
    criteria: 'speed',
    minStars: 3,
    maxStars: 3,
    text: 'Chờ hơi lâu xíu nhưng bù lại miếng gà nóng hổi phỏng cả mỏ. Tạm tha nha.'
  },
  {
    criteria: 'speed',
    minStars: 4,
    maxStars: 5,
    text: 'Vừa order quay qua tính chụp tấm ảnh sống ảo thì đồ ăn đã bưng ra! Tốc độ bàn thờ 10 điểm không có nhưng!'
  },
  {
    criteria: 'speed',
    minStars: 4,
    maxStars: 5,
    text: 'Nhanh như người yêu cũ trở mặt! Gà nóng hổi giòn rụm vừa thổi vừa ăn cưng xỉu.'
  },

  // HƯƠNG VỊ (Taste) - Chiên Perfect, cháy hoặc sống
  {
    criteria: 'taste',
    minStars: 1,
    maxStars: 2,
    text: 'Gà chiên bị khét đen thùi lùi như tương lai của mình vậy á. Cắn một miếng đắng nghét khóc thét!'
  },
  {
    criteria: 'taste',
    minStars: 1,
    maxStars: 2,
    text: 'Bột chiên dày cui mà bên trong thịt còn hơi tái đỏ. Bếp ơi có tâm xíu đi ạ, đang thất tình đừng làm tui đau bụng!'
  },
  {
    criteria: 'taste',
    minStars: 1,
    maxStars: 2,
    text: 'Ủa nay bếp giận người yêu hay sao mà khoai lắc phô mai mặn chát chúa zậy trời?'
  },
  {
    criteria: 'taste',
    minStars: 3,
    maxStars: 3,
    text: 'Gà ăn cũng ổn áp, da giòn nhưng thịt hơi khô xíu. Cần thêm sốt cay chấm mút mới đã cái nư.'
  },
  {
    criteria: 'taste',
    minStars: 4,
    maxStars: 5,
    text: 'Ăn miếng gà mà ngỡ đang ở thiên đường! Da giòn tan rôm rốp, thịt mọng nước ngọt lịm tim, ngon xỉu!'
  },
  {
    criteria: 'taste',
    minStars: 4,
    maxStars: 5,
    text: 'Gà sốt mật ong bơ tỏi đỉnh nóc kịch trần bay phấp phới! Ăn xong muốn xin in-tư anh bếp liền!'
  },
  {
    criteria: 'taste',
    minStars: 4,
    maxStars: 5,
    text: 'Vị ngon nhức nách! Cắn miếng da gà kêu rôm rốp át cả tiếng deadline réo bên tai.'
  },

  // VỆ SINH (Hygiene) - Dầu cũ, bàn chưa lau
  {
    criteria: 'hygiene',
    minStars: 1,
    maxStars: 2,
    text: 'Gà chiên dầu đen sì, cắn vào nghe nồng mùi khét. Chủ tiệm tiếc tiền thay dầu hay gì? 1 sao cảnh cáo!'
  },
  {
    criteria: 'hygiene',
    minStars: 1,
    maxStars: 2,
    text: 'Bàn dính đầy tương cà với vụn khoai của khách trước, ngồi vô dính cả áo trắng xui xẻo ghê.'
  },
  {
    criteria: 'hygiene',
    minStars: 3,
    maxStars: 3,
    text: 'Quầy hơi bừa bộn một chút vào giờ cao điểm, nhưng chén dĩa vẫn sạch sẽ. Ráng phát huy nha tiệm.'
  },
  {
    criteria: 'hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Quán sạch bong kin kít! Dầu chiên vàng ươm, bếp mở nhìn thấy từng khâu yên tâm tuyệt đối.'
  },
  {
    criteria: 'hygiene',
    minStars: 4,
    maxStars: 5,
    text: 'Thơm phức mùi bơ sữa và gà rán, không hề có mùi dầu cũ khét lẹt. 10 điểm vệ sinh!'
  },

  // KHÔNG GIAN (Space) - Bàn ghế, nóng nực, decor
  {
    criteria: 'space',
    minStars: 1,
    maxStars: 2,
    text: 'Trời SG 38 độ mà quán không bật máy lạnh, vừa ăn gà rán vừa đổ mồ hôi như tắm xông hơi!'
  },
  {
    criteria: 'space',
    minStars: 1,
    maxStars: 2,
    text: 'Ngồi ghế nhựa sát lề đường bị khói xe tạt thẳng vô mặt, ăn miếng gà mà nuốt luôn cả bụi mịn.'
  },
  {
    criteria: 'space',
    minStars: 3,
    maxStars: 3,
    text: 'Chỗ ngồi hơi hẹp xíu, đi nhóm đông phải chen chúc nhưng không khí vui vẻ nhộn nhịp.'
  },
  {
    criteria: 'space',
    minStars: 4,
    maxStars: 5,
    text: 'Góc check-in Gà Bông cưng xỉu! Chụp cả trăm tấm hình sống ảo cháy máy, nhạc lofi chill phết!'
  },
  {
    criteria: 'space',
    minStars: 4,
    maxStars: 5,
    text: 'Máy lạnh phà mát rượi, decor tông vàng kem ấm áp ăn gà rán ngắm mưa lãng mạn xỉu.'
  },

  // GIÁ CẢ (Pricing) - Đắt hay rẻ
  {
    criteria: 'pricing',
    minStars: 1,
    maxStars: 2,
    text: 'Ủa bán gà dát vàng hay sao mà chém giá khét lẹt dị? Ăn xong xem lại ví thấy bay màu nửa tháng tiền trọ.'
  },
  {
    criteria: 'pricing',
    minStars: 1,
    maxStars: 2,
    text: 'Miếng gà bé xíu xiu bằng nắm tay mà giá trên trời, cảm giác bị “trap” quá trời trap.'
  },
  {
    criteria: 'pricing',
    minStars: 3,
    maxStars: 3,
    text: 'Giá hơi chát hơn mấy chuỗi lớn một tẹo, nếu có thêm voucher hay combo học sinh sinh viên thì ngon lành.'
  },
  {
    criteria: 'pricing',
    minStars: 4,
    maxStars: 5,
    text: 'Rẻ rúng bất ngờ! 35k một miếng gà to bự chảng ăn no cành hông, xứng đáng là chân ái cuối tháng cháy túi!'
  },
  {
    criteria: 'pricing',
    minStars: 4,
    maxStars: 5,
    text: 'Combo đại tiệc siêu hời, chia ra mỗi đứa có mấy chục ngàn mà ăn no muốn lăn về luôn á!'
  }
];

export const GENZ_USERNAMES = [
  'Bé Trúc Mê Gà', 'Hoàng Tử Deadline', 'Huyền Trang Chillin', 'Shipper Không Quạo',
  'Mèo Béo Đói Bụng', 'Khánh Vy Review', 'Thắng Không Quạo', 'GenZ Cày Rank',
  'Anh Ba Ăn Vặt', 'Công Chúa Trà Sữa', 'Tiktoker 100k Fl', 'Cú Đêm Sài Gòn',
  'Ngọc Ánh Xỉu Up', 'Minh Tâm Bụng Bự', 'Thu Hương Ăn Sạch', 'Quốc Bảo Chill'
];

export const CUST_AVATARS = ['👧', '👦', '👩', '🧑', '👱‍♀️', '👨‍🎓', '🛵', '💅', '🐱', '🕶️'];
