import { NightRadioBroadcast, GameState } from '../types/game';

/**
 * BẢN TIN PHÁT THANH ĐÊM SÀI GÒN — ĐÀI TIẾNG NÓI HẺM 1102 (FM 99.9 MHz)
 * Những dòng phát thanh rè rè từ chiếc đài cassette cũ sau mỗi ca bán mệt nhoài,
 * mang lại cảm giác hoài niệm, ấm áp và kết nối sâu sắc với nhịp sống đô thị.
 */
export const NIGHT_RADIO_BROADCASTS: NightRadioBroadcast[] = [
  {
    id: 'radio_ch1_01',
    chapter: 1,
    dayMin: 1,
    dayMax: 5,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Đêm Đầu Tiên Xe Đẩy Đỏ Lửa & Tiếng Chuông Leng Keng',
    weatherCondition: 'Trời se lạnh, mưa bụi lất phất dưới ánh đèn vàng',
    audioTranscript: 'Kính chào quý thính giả, 23 giờ đêm tại Sài Gòn. Góc ngã ba hẻm 1102 hôm nay bỗng rộn rã mùi gà chiên thơm nức. Bác Ba tổ trưởng vừa kết thúc ca tuần tra và khen ngợi xe gà mới mở dọn dẹp hè phố rất ngăn nắp...',
    streetRumor: 'Bà Bảy vé số kể chiều nay thấy có một bé gái mặc đồ thú bông đứng nhìn xe gà rất lâu...',
  },
  {
    id: 'radio_ch1_02',
    chapter: 1,
    dayMin: 6,
    dayMax: 15,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Bé Bắp Đạt Điểm 10 & Chuyện Chiếc Giày Múa Rách Mũi',
    weatherCondition: 'Đêm tạnh ráo, gió mát từ phía bờ kênh thổi vào',
    audioTranscript: 'Bản tin tối nay: Cậu bé Bắp con chị Mai bán xôi đã xuất sắc đạt điểm 10 môn chính tả. Trong khi đó, người ta bắt gặp cô bé Na trường múa vẫn miệt mài xoay người tập múa dưới chân cột đèn đến tận khuya...',
    streetRumor: 'Nghe nói họa sĩ Dũng vừa vẽ xong một bức tranh rất đẹp về con hẻm mình...',
  },
  {
    id: 'radio_ch2_01',
    chapter: 2,
    dayMin: 16,
    dayMax: 30,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Bốn Chiếc Bàn Gỗ Dưới Giàn Hoa Giấy Đỏ Rực',
    weatherCondition: 'Mưa rào đêm hè, tiếng mưa gõ tí tách trên mái tôn',
    audioTranscript: 'Chào bà con khu phố. Tiệm gà nhỏ nay đã dọn vào nhà số 14. Dưới giàn hoa giấy đỏ rực, tiếng cười nói của các bạn sinh viên và cô chú công nhân sau ca làm đêm làm ấm cả khúc hẻm vắng...',
    streetRumor: 'Bác Ba vừa trao lại chiếc vá gỗ năm 1990 cho chủ quán. Đúng là truyền nhân đích thực!',
  },
  {
    id: 'radio_ch2_02',
    chapter: 2,
    dayMin: 31,
    dayMax: 50,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Nồi Cháo Gà Nghĩa Tình & Điểm Tựa Lúc Gian Truân',
    weatherCondition: 'Đêm trăng sáng, sương đêm đọng trên lá hoa giấy',
    audioTranscript: 'Thông tin sức khỏe khu phố: Bác Ba đã bình phục hoàn toàn sau cơn cảm lạnh nhờ bát cháo gà tía tô kịp thời. Tình làng nghĩa xóm giữa đất Sài Gòn hoa lệ này vẫn luôn là thứ quý giá nhất...',
    streetRumor: 'Bé Thỏ Cam đã chính thức đỗ thủ khoa ngành thiết kế mỹ thuật rồi bà con ơi!',
  },
  {
    id: 'radio_ch3_01',
    chapter: 3,
    dayMin: 51,
    dayMax: 75,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Tiệm Gà Ra Mặt Phố & Tiếng Vỗ Tay Dưới Khán Đài Nhà Hát',
    weatherCondition: 'Đêm hè oi ả, tiếng còi xe ngoài đại lộ vẫn chưa dứt',
    audioTranscript: 'Thời sự ẩm thực: Tiệm Gà Nhà Tui đã chính thức mở rộng ra mặt tiền đường lớn. Đêm qua tại Nhà Hát Lớn, vũ công Na đã tỏa sáng rực rỡ và nhận được cái ôm làm hòa đầy xúc động từ anh trai kỹ sư IT...',
    streetRumor: 'Anh Long IT đã nộp đơn thôi việc để về viết app đặt gà riêng cho quán!',
  },
  {
    id: 'radio_ch3_02',
    chapter: 3,
    dayMin: 76,
    dayMax: 100,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Đêm Rằm Đính Hôn & Bản Lĩnh Trước Vali Tiền 2 Tỷ',
    weatherCondition: 'Đêm trăng tròn Trung Thu, tiếng trống múa lân rộn rã',
    audioTranscript: 'Bản tin đặc biệt: Lời chúc mừng nồng nhiệt gửi đến cặp đôi Tuấn shipper và chị Mai bán xôi vừa đính hôn trong sự vỡ òa của cả xóm! Cùng lúc đó, nguồn tin mật cho hay chủ quán vừa từ chối thẳng thừng lời đề nghị thâu tóm 2 tỷ từ tập đoàn MegaChicken...',
    streetRumor: 'Mr. Mega tức tối bỏ đi nhưng đe dọa sẽ không để tiệm gà yên thân...',
  },
  {
    id: 'radio_ch4_01',
    chapter: 4,
    dayMin: 101,
    dayMax: 150,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Đập Tan Cuộc Tấn Công Mạng & Giữ Vững Linh Hồn Ẩm Thực',
    weatherCondition: 'Mưa dông sấm chớp dữ dội ngoài đại lộ',
    audioTranscript: 'Bản tin an ninh mạng: Cuộc tấn công DDoS nhắm vào hệ thống đặt món của tiệm gà lúc 12h trưa đã bị chuyên viên trẻ Đức Huy hóa giải xuất sắc. Trong khi đó, các chiêu trò cạnh tranh bẩn của chuỗi thức ăn nhanh công nghiệp đang bị cộng đồng mạng lên án mạnh mẽ...',
    streetRumor: 'Mimi Thỏ Cam đã được giải cứu khỏi sự chèn ép và chuẩn bị ra mắt điều kỳ diệu mới!',
  },
  {
    id: 'radio_ch5_01',
    chapter: 5,
    dayMin: 151,
    dayMax: 210,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Sống Lại Biển Hiệu 1990 & 10.000 Khán Giả Sân Vận Động Phú Thọ',
    weatherCondition: 'Đêm rực rỡ pháo hoa ăn mừng chiến thắng',
    audioTranscript: 'Bản tin lịch sử: Tiệm Gà Nhà Tui đã chính thức được trao cúp vàng Vô Địch Gà Rán Quốc Dân! Từ một chiếc xe đẩy đơn sơ trong con hẻm nhỏ 1102, tình yêu thương và tay nghề chân chính đã chinh phục hàng triệu trái tim...',
    streetRumor: 'Cả con hẻm 1102 đang mở tiệc ăn mừng suốt đêm! Tự hào quá Tiệm Gà Nhà Tui ơi!',
  },
];

/**
 * Lấy bản tin radio thích hợp cho ngày hiện tại
 */
export function getTonightRadioBroadcast(state: GameState): NightRadioBroadcast | null {
  const day = state.day || 1;
  const chapter = state.currentChapter || 1;

  // Tìm bản tin khớp với chapter và khoảng ngày
  const matched = NIGHT_RADIO_BROADCASTS.find(b => {
    return b.chapter === chapter && day >= b.dayMin && day <= b.dayMax;
  });

  return matched || NIGHT_RADIO_BROADCASTS[0] || null;
}
