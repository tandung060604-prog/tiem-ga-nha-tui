import { NightRadioBroadcast, GameState, RadioBuff } from '../types/game';

/**
 * BẢN TIN PHÁT THANH ĐÊM SÀI GÒN — ĐÀI TIẾNG NÓI HẺM 1102 (FM 99.9 MHz)
 * Thiết kế nâng cấp theo chuẩn TypeSafe AI Jev MCP:
 * - Bản tin thay đổi linh hoạt theo từng ngày, dự báo thời tiết và diễn biến hẻm 1102.
 * - Kèm theo RADIO BUFF thực tế cho ca bán ngày tiếp theo (Tăng tốc nhân viên, buff món hot, quà thính giả, canh lửa Perfect).
 * - Hiệu ứng âm thanh cassette băng từ hoài niệm thập niên 90.
 */

export const NIGHT_RADIO_BROADCASTS: NightRadioBroadcast[] = [
  // --- CHƯƠNG 1: KHỞI NGHIỆP XE ĐẨY VỈA HÈ ---
  {
    id: 'radio_day_01',
    chapter: 1,
    dayMin: 1,
    dayMax: 1,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Bác Ba Mách Nước: Mẹo Canh Lửa Cho Mẻ Gà Đầu Ngày',
    weatherCondition: 'Đêm se lạnh, mưa bụi lất phất dưới ngọn đèn vàng',
    musicTrackName: 'Khúc Hoài Niệm Chợ Lớn 1990 - Băng Cassette Số 1',
    audioTranscript: 'Kính chào quý thính giả, 23 giờ đêm tại Sài Gòn. Góc ngã ba hẻm 1102 hôm nay rộn ràng hẳn lên bởi mùi gà chiên giòn thơm nức từ xe đẩy mới mở. Bác Ba tổ trưởng nhắn nhủ: Canh lửa chảo gang phải nhẫn nại, khi dầu sủi tăm tắp mới thả gà vào.',
    streetRumor: 'Bác Ba vừa dặn dò chủ tiệm ngày mai cứ tự tin mở bếp, bác chúc mẻ gà đầu ngày vàng giòn hoàn hảo!',
    forecastTomorrow: 'Ngày mai trời tạnh ráo, công nhân tan ca ghé ăn đông đúc.',
    buff: {
      id: 'buff_radio_day_01',
      type: 'chef_wisdom',
      title: '💡 Mẹo Canh Lửa Bác Ba',
      description: 'Mẻ gà rán đầu tiên trong ngày mai được Bác Ba hộ trì, chắc chắn đạt chuẩn Vàng Giòn (Perfect)!',
      activeForDay: 2,
    }
  },
  {
    id: 'radio_day_02',
    chapter: 1,
    dayMin: 2,
    dayMax: 2,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Cơn Sốt Khoai Lắc Phô Mai: Giới Trẻ Hẻm Sâu Phát Cuồng',
    weatherCondition: 'Đêm hè mát mẻ, gió từ kênh Nhiêu Lộc thổi vào',
    musicTrackName: 'Sài Gòn Cà Phê Sữa Đá - Lofi Chill Tape',
    audioTranscript: 'Bản tin ẩm thực đường phố: Món khoai tây lắc phô mai giòn rụm của Tiệm Gà Nhà Tui đang trở thành tâm điểm bàn tán của các bạn trẻ quanh khu KTX. Tiếng lắc lắc xì xèo vui nhộn khiến ai đi ngang cũng phải ngoái nhìn.',
    streetRumor: 'Mấy bạn sinh viên kháo nhau ngày mai sẽ rủ cả lớp ghé tiệm gọi khoai lắc!',
    forecastTomorrow: 'Nhu cầu ăn vặt ngày mai tăng đột biến, khoai lắc sẽ bán cực chạy.',
    buff: {
      id: 'buff_radio_day_02',
      type: 'trending_dish',
      title: '🍟 Xu Hướng Khoai Lắc Phô Mai',
      description: 'Món Khoai Lắc được thính giả săn đón: Giá bán tăng +20% và khách gọi thường xuyên hơn!',
      targetDishId: 'shake_fries',
      multiplier: 1.2,
      activeForDay: 3,
    }
  },
  {
    id: 'radio_day_03',
    chapter: 1,
    dayMin: 3,
    dayMax: 3,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Giai Điệu Lofi Sài Gòn 1995: Tinh Thần Nhân Viên Phấn Chấn',
    weatherCondition: 'Đêm tĩnh lặng, tiếng dế kêu rả rích sau giàn hoa giấy',
    musicTrackName: 'Nhịp Sống Hẻm Nhỏ - Acoustic Jazz Guitar',
    audioTranscript: 'Đêm nay đài xin gửi tới quý vị thính giả bản nhạc jazz nhẹ nhàng dành tặng những người lao động thầm lặng nơi góc phố. Âm nhạc xua tan mệt mỏi sau một ngày đứng bếp nóng nực, tiếp thêm năng lượng cho ca bán ngày mai.',
    streetRumor: 'Nhân viên quán được nghe nhạc thư giãn, ai nấy đều hừng hực khí thế phục vụ!',
    forecastTomorrow: 'Khách đến dồn dập vào giờ ăn trưa, cần đôi tay thoăn thoắt.',
    buff: {
      id: 'buff_radio_day_03',
      type: 'staff_speed',
      title: '🎵 Giai Điệu Lofi Sài Gòn',
      description: 'Nhân viên quán tràn đầy năng lượng: Tốc độ chuẩn bị & phục vụ tăng +20%!',
      multiplier: 1.2,
      activeForDay: 4,
    }
  },
  {
    id: 'radio_day_04',
    chapter: 1,
    dayMin: 4,
    dayMax: 4,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Thính Giả Gửi Tặng Quà: Nghĩa Tình Chòm Xóm Hẻm Sâu',
    weatherCondition: 'Trời nhiều mây, gió giật nhẹ báo hiệu cơn mưa đầu mùa',
    musicTrackName: 'Tình Làng Nghĩa Xóm - Độc Tấu Mandolin',
    audioTranscript: 'Chương trình Quà Tặng Âm Nhạc vừa nhận được thư của một thính giả giấu tên là tiểu thương chợ đầu mối. Cảm mến sự chịu thương chịu khó của bạn chủ quán gà trẻ tuổi, thính giả xin gửi tặng quán một phần nguyên liệu sạch để tiếp sức buôn bán.',
    streetRumor: 'Bác Ba đi tuần qua cười bảo: Ở cái hẻm này, sống có tâm thì luôn được quý nhân phù trợ!',
    forecastTomorrow: 'Giá nguyên liệu ngoài chợ có biến động nhẹ, nhưng quán đã có tiếp tế.',
    buff: {
      id: 'buff_radio_day_04',
      type: 'listener_gift',
      title: '🎁 Quà Tặng Thính Giả Hẻm 1102',
      description: 'Thính giả thân thương gửi tặng 5 gói Bột Chiên Thượng Hạng hoặc 30.000đ tiền tip chúc quán đắt hàng!',
      bonusMoney: 30000,
      bonusItem: { id: 'flour', amount: 5 },
      activeForDay: 5,
    }
  },
  {
    id: 'radio_day_05',
    chapter: 1,
    dayMin: 5,
    dayMax: 6,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Dự Báo Mưa Rào Chiều Mai: Đơn Ship Hỏa Tốc Bùng Nổ',
    weatherCondition: 'Mưa rào đêm hè, tiếng mưa gõ tí tách trên mái tôn hiên',
    musicTrackName: 'Mưa Chiều Sài Gòn - Lofi Beats',
    audioTranscript: 'Dự báo thời tiết: Chiều mai Sài Gòn đón cơn mưa rào lớn. Trời mưa lạnh thế này, người ta thường ngại lội nước ra đường mà chuyển sang đặt gà rán nóng hổi giao tận cửa phòng trọ.',
    streetRumor: 'Anh Tuấn shipper đã chuẩn bị sẵn áo mưa và giỏ giữ nhiệt để nhận đơn của quán!',
    forecastTomorrow: 'Trời mưa to, đơn hàng mang về & gọi qua app dự kiến tăng vọt.',
    buff: {
      id: 'buff_radio_day_05',
      type: 'delivery_boom',
      title: '🛵 Bão Đơn Ngày Mưa',
      description: 'Trời mưa khách chuộng gọi món nóng: Đơn hàng giao xa & khách đặt app tăng +25%!',
      multiplier: 1.25,
      activeForDay: 6,
    }
  },
  {
    id: 'radio_day_06',
    chapter: 1,
    dayMin: 7,
    dayMax: 10,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Gió Mát Tan Tầm: Khách Kiên Nhẫn Xếp Hàng Ngắm Hoa Giấy',
    weatherCondition: 'Đêm trăng sáng vằng vặc, không khí mát dịu trong lành',
    musicTrackName: 'Khúc Ca Hẻm Sâu - Acoustic Guitar & Harmonica',
    audioTranscript: 'Không khí khu phố hôm nay thật thanh bình. Dưới giàn hoa giấy đầu ngõ, mùi gà chiên vàng mật lan tỏa khắp xóm. Khách đến ăn dù phải chờ đôi ba phút vẫn vui vẻ trò chuyện cùng nhau.',
    streetRumor: 'Bà con trong hẻm bảo chờ miếng gà nóng hổi ngon lành thì đợi một chút cũng đáng!',
    forecastTomorrow: 'Khách hàng cực kỳ dễ chịu và kiên nhẫn, không lo bị giục đơn hay bỏ về.',
    buff: {
      id: 'buff_radio_day_06',
      type: 'customer_patience',
      title: '🌸 Giai Điệu Dịu Êm',
      description: 'Không gian ấm cúng xoa dịu lòng người: Thời gian kiên nhẫn của khách tăng +25%!',
      multiplier: 1.25,
      activeForDay: 8,
    }
  },

  // --- CHƯƠNG 2: MỞ QUÁN NHÀ SỐ 14 DƯỚI GIÀN HOA GIẤY ---
  {
    id: 'radio_ch2_general',
    chapter: 2,
    dayMin: 11,
    dayMax: 35,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Bốn Chiếc Bàn Gỗ Sồi & Nồi Sốt Bí Truyền Hoàng Kim',
    weatherCondition: 'Đêm hè oi ả, tiếng ve ngân ran râm ran nơi tán bàng',
    musicTrackName: 'Bản Hòa Âm Bếp Lửa Sài Gòn - Cassette Master Tape',
    audioTranscript: 'Chào mừng bà con khu phố đến với chuyên mục Ẩm Thực Nhà Quán. Tiệm gà nhỏ nay đã mở rộng bàn ăn tại chỗ. Nồi sốt bí truyền óng ả màu hổ phách đang làm nức lòng thực khách gần xa.',
    streetRumor: 'Mấy anh kỹ sư công nghệ bảo ăn gà sốt cay ở đây xong là code xuyên đêm không biết mệt!',
    forecastTomorrow: 'Món Gà Cay Sốt Bí Truyền dự kiến sẽ là ngôi sao của ngày mai.',
    buff: {
      id: 'buff_radio_ch2',
      type: 'trending_dish',
      title: '🔥 Ngôi Sao Gà Cay Hoàng Kim',
      description: 'Món Gà Cay Sốt Bí Truyền được quảng bá trên sóng radio: Doanh thu món tăng +20%!',
      targetDishId: 'spicy_chicken',
      multiplier: 1.2,
      activeForDay: 16,
    }
  },

  // --- CHƯƠNG 3, 4, 5: RA ĐẠI LỘ & VÔ ĐỊCH QUỐC DÂN ---
  {
    id: 'radio_ch3_high',
    chapter: 3,
    dayMin: 36,
    dayMax: 999,
    channelName: 'Đài Tiếng Nói Hẻm 1102 • FM 99.9 MHz',
    headline: 'Bản Lĩnh Đất Sài Gòn: Tay Nghề Chân Chính Chinh Phục Triệu Trái Tim',
    weatherCondition: 'Đêm rực rỡ ánh đèn đô thị phồn hoa',
    musicTrackName: 'Khúc Vang Khải Hoàn Hẻm 1102 - Stereo Cassette',
    audioTranscript: 'Bản tin đặc biệt: Từ một chiếc xe đẩy đơn sơ nơi hẻm cụt, Tiệm Gà Nhà Tui đã trở thành biểu tượng ẩm thực được triệu người mến mộ. Tình làng nghĩa xóm và cái tâm với nghề bếp đã làm nên điều kỳ diệu.',
    streetRumor: 'Cả con hẻm 1102 mở tiệc ăn mừng thâu đêm suốt sáng!',
    forecastTomorrow: 'Lượng khách ghé thăm ngày mai sẽ đông kín mọi bàn ăn.',
    buff: {
      id: 'buff_radio_ch3',
      type: 'staff_speed',
      title: '🏆 Khí Thế Vô Địch Ẩm Thực',
      description: 'Toàn bộ đội ngũ nhân viên đạt phong độ đỉnh cao: Tốc độ phục vụ +25% và khách tip hào phóng!',
      multiplier: 1.25,
      activeForDay: 51,
    }
  }
];

/**
 * Lấy bản tin radio thích hợp cho ngày hiện tại (100% khớp ngày hoặc xoay vòng phong phú)
 */
export function getTonightRadioBroadcast(state: GameState): NightRadioBroadcast {
  const day = state.day || 1;
  const chapter = state.currentChapter || 1;

  // 1. Tìm bản tin khớp chính xác với ngày hiện tại
  const exactMatch = NIGHT_RADIO_BROADCASTS.find(b => day >= b.dayMin && day <= b.dayMax);
  if (exactMatch) {
    // Đảm bảo buff có activeForDay đúng bằng ngày mai
    if (exactMatch.buff) {
      exactMatch.buff.activeForDay = day + 1;
    }
    return exactMatch;
  }

  // 2. Nếu ngày lớn hơn, xoay vòng bản tin theo chu kỳ (không bao giờ lặp nhàm chán)
  const pool = NIGHT_RADIO_BROADCASTS.filter(b => b.chapter <= chapter);
  const cycleIndex = (day - 1) % (pool.length || 1);
  const base = pool[cycleIndex] || NIGHT_RADIO_BROADCASTS[0]!;
  const picked: NightRadioBroadcast = { ...base };
  if (picked.buff) {
    picked.buff = { ...picked.buff, activeForDay: day + 1 };
  }
  return picked;
}

/**
 * Kích hoạt và áp dụng Buff Đài FM vào GameState
 */
export function activateRadioBroadcastBuff(
  state: GameState,
  broadcast: NightRadioBroadcast
): { success: boolean; message: string; buff: RadioBuff | null } {
  state.lastRadioBroadcastDay = state.day;

  if (!state.heardRadioBroadcastIds) {
    state.heardRadioBroadcastIds = [];
  }
  if (!state.heardRadioBroadcastIds.includes(broadcast.id)) {
    state.heardRadioBroadcastIds.push(broadcast.id);
  }

  if (!broadcast.buff) {
    return {
      success: true,
      message: '📻 Đã lắng nghe bản tin Đài Tiếng Nói Hẻm 1102 đêm nay!',
      buff: null
    };
  }

  const buff = { ...broadcast.buff, activeForDay: state.day + 1 };
  state.activeRadioBuff = buff;

  // Nếu buff có quà tặng trực tiếp (tiền hoặc nguyên liệu) thì cộng ngay lập tức
  if (buff.bonusMoney) {
    state.money += buff.bonusMoney;
  }
  if (buff.bonusItem && state.inventory[buff.bonusItem.id]) {
    const item = state.inventory[buff.bonusItem.id];
    if (item) {
      item.amount += buff.bonusItem.amount;
      if (!item.batches) item.batches = [];
      item.batches.push({
        amount: buff.bonusItem.amount,
        daysLeft: item.shelfLifeDays || 5,
        refundable: 0
      });
    }
  }

  return {
    success: true,
    message: `📻 Nhận thành công Buff ngày mai: ${buff.title}!`,
    buff
  };
}
