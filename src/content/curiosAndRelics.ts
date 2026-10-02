import { CurioRelic, GameState } from '../types/game';

/**
 * TỦ KỶ VẬT & BẢO VẬT LỊCH SỬ HẺM 1102 (HISTORICAL CURIOS & RELICS)
 * Các kỷ vật hiện hữu gắn liền với từng sự kiện cốt truyện trọng đại,
 * minh chứng cho tình nghĩa xóm giềng và đạo đức làm bếp qua 5 chương.
 */
export const CURIOS_AND_RELICS: CurioRelic[] = [
  {
    id: 'relic_va_go_1990',
    name: 'Chiếc Vá Gỗ Năm 1990',
    sourceCharacter: 'Bác Ba Tổ Trưởng',
    icon: '🥄',
    chapter: 2,
    unlockedByFlag: 'bacba_housewarming_honored',
    loreDescription: 'Chiếc vá gỗ cán dài nhẵn bóng qua hơn 30 năm dầu sôi lửa bỏng. Đây là kỷ vật duy nhất còn sót lại của cựu bếp trưởng Võ Hòa từ tiệm Gà Chợ Lớn 1990 trao lại cho bạn.',
    flavorQuote: 'Dùng vá này vớt gà, từng thớ thịt sẽ luôn vàng óng và thấm đượm tình người.',
    passiveBuffText: 'Tỉ lệ vớt gà đạt mốc Perfect tăng thêm +5% vĩnh viễn.',
  },
  {
    id: 'relic_khan_ran_bacba',
    name: 'Chiếc Khăn Rằn Thấm Mồ Hôi',
    sourceCharacter: 'Bác Ba Tổ Trưởng',
    icon: '🧣',
    chapter: 2,
    unlockedByFlag: 'bacba_health_restored',
    loreDescription: 'Chiếc khăn rằn Nam Bộ quen thuộc Bác Ba quàng trên cổ mỗi khi đi tuần hẻm. Bác tặng lại bạn sau đêm được bạn cứu qua cơn trúng gió bằng bát cháo gà gừng nóng.',
    flavorQuote: 'Bác già rồi, chỉ có cái khăn này giữ ấm cổ họng... Tặng mày để nhớ ngày hẻm cứu bác.',
    passiveBuffText: 'Khách hàng kiên nhẫn đợi thêm +2 giây khi quán đông.',
  },
  {
    id: 'relic_giay_mua_canh',
    name: 'Đôi Giày Múa Đôi Cánh Thiên Thần',
    sourceCharacter: 'Em Na & Họa Sĩ Dũng',
    icon: '🩰',
    chapter: 2,
    unlockedByFlag: 'na_shoes_wings_drawn',
    loreDescription: 'Đôi giày vải múa mộc mạc của Na được Dũng dùng bút lông vẽ đôi cánh thiên thần trắng muốt trên mũi giày. Đôi giày đã nâng bước Na vào vòng chung kết toàn quốc.',
    flavorQuote: 'Mỗi lần nhìn đôi cánh này, em biết mình không bao giờ đơn độc trên sàn diễn.',
    passiveBuffText: 'Tăng +15% tiền tip từ các bạn trẻ và sinh viên ghé quán.',
  },
  {
    id: 'relic_tranh_chan_dung_na',
    name: 'Bức Chân Dung "Vũ Điệu Dưới Mưa"',
    sourceCharacter: 'Họa Sĩ Dũng',
    icon: '🎨',
    chapter: 2,
    unlockedByFlag: 'dung_portrait_revealed',
    loreDescription: 'Bức tranh sơn dầu khổ A3 do Dũng thức 5 đêm liền vẽ lại khoảnh khắc Na xoay người múa dưới bóng giàn hoa giấy Hẻm 1102.',
    flavorQuote: 'Nghệ thuật không nằm ở bảo tàng sang trọng, nó nằm ngay dưới mái hiên tiệm gà này.',
    passiveBuffText: 'Không gian quán thêm +10 điểm Vibe Nghệ Thuật.',
  },
  {
    id: 'relic_o_cung_app_rieng',
    name: 'Ổ Cứng Mã Nguồn App Riêng',
    sourceCharacter: 'Anh Long IT',
    icon: '💾',
    chapter: 3,
    unlockedByFlag: 'app_pos_partnership',
    loreDescription: 'Ổ cứng SSD chứa toàn bộ mã nguồn ứng dụng đặt hàng và quản lý chuỗi do Anh Long tự tay lập trình sau khi nộp đơn thôi việc tại tập đoàn nước ngoài.',
    flavorQuote: 'Từ nay tiệm gà mình tự làm chủ công nghệ, không sợ bị bất kỳ ông lớn nào bóp cổ!',
    passiveBuffText: 'Miễn phí hoàn toàn 30% chiết khấu nền tảng cho mọi đơn hẻm.',
  },
  {
    id: 'relic_nhan_cuoi_trung_thu',
    name: 'Vỏ Hộp Đùi Gà Đựng Nhẫn Cưới',
    sourceCharacter: 'Tuấn Shipper & Chị Mai',
    icon: '💍',
    chapter: 3,
    unlockedByFlag: 'mai_tuan_engaged',
    loreDescription: 'Chiếc hộp giấy màu vàng in logo tiệm gà đã chứng kiến giây phút Tuấn shipper quỳ gối cầu hôn chị Mai trước sự chúc phúc của bé Bắp và toàn thể thực khách.',
    flavorQuote: 'Bé Bắp reo vang: Mẹ ơi chú Tuấn làm ba con rồi! Tiệm gà là nơi con hạnh phúc nhất!',
    passiveBuffText: 'Mỗi ngày có thêm 1 đơn giao hỏa tốc từ Tuấn với phí 0 đồng.',
  },
  {
    id: 'relic_hop_dong_tu_choi_2_ty',
    name: 'Bản Thỏa Thuận Mua Lại Bị Xé Rách',
    sourceCharacter: 'Mr. Mega (MegaChicken)',
    icon: '📜',
    chapter: 3,
    unlockedByFlag: 'mega_hostility_declared',
    loreDescription: 'Mẩu hợp đồng chuyển nhượng công thức trị giá 2 tỷ đồng do Mr. Mega mang đến và bị bạn xé toạc trước mặt đối thủ để giữ trọn danh dự làm nghề.',
    flavorQuote: 'Có những thứ trên đời này tiền không bao giờ mua được: Đó là linh hồn của Hẻm 1102!',
    passiveBuffText: 'Miễn nhiễm 100% trước các chiêu trò tung tin đồn giả mạo của đối thủ.',
  },
  {
    id: 'relic_usb_ddos_huy',
    name: 'Chiếc USB Chứa Mẫu Mã Độc Bị Phá Án',
    sourceCharacter: 'Đức Huy Game Thủ',
    icon: '🛡️',
    chapter: 4,
    unlockedByFlag: 'mega_ddos_crushed',
    loreDescription: 'Chiếc USB kim loại khắc hình rồng của Huy, lưu giữ toàn bộ dữ liệu log máy chủ và bằng chứng cuộc tấn công mạng của MegaChicken lúc 12h trưa.',
    flavorQuote: 'Đụng vào tiệm gà của hẻm tao là mày đụng nhầm cao thủ an ninh mạng rồi con ạ!',
    passiveBuffText: 'Hệ thống gọi món không bao giờ bị nghẽn đơn vào giờ cao điểm.',
  },
  {
    id: 'relic_bien_hieu_ga_cho_lon',
    name: 'Biển Hiệu Gà Chợ Lớn 1990 Sơn Son',
    sourceCharacter: 'Bé Thỏ Cam (Mimi) & Bác Ba',
    icon: '🏮',
    chapter: 5,
    unlockedByFlag: 'heritage_branch_thriving',
    loreDescription: 'Tấm biển gỗ lim sơn son thếp vàng phục chế lại đúng nguyên bản tiệm gà năm 1990 trên đường Hải Thượng Lãn Ông, nơi Mimi làm giám đốc điều hành.',
    flavorQuote: 'Ba mươi năm đằng đẵng... Cuối cùng khói bếp của sư phụ Võ Hòa lại bay lên rực rỡ.',
    passiveBuffText: 'Tăng vĩnh viễn +20% tổng doanh thu mỗi ngày từ chuỗi chi nhánh.',
  },
  {
    id: 'relic_hoc_vien_mua_nhi',
    name: 'Kỷ Niệm Chương Vì Thế Hệ Trẻ',
    sourceCharacter: 'Em Na & Bé Bắp',
    icon: '🌟',
    chapter: 5,
    unlockedByFlag: 'community_academy_founded',
    loreDescription: 'Kỷ niệm chương do Ủy ban Phường trao tặng cho lớp học múa miễn phí trên tầng 2 tiệm gà, nơi hàng chục trẻ em lao động nghèo được theo đuổi ước mơ nghệ thuật.',
    flavorQuote: 'Tiệm gà không chỉ bán đồ ăn... Tiệm gà nuôi dưỡng những ước mơ bay cao.',
    passiveBuffText: 'Tình thân và sự tin yêu của bà con Hẻm 1102 luôn bền vững ở mức cao nhất.',
  },
  {
    id: 'relic_cup_ga_vang',
    name: 'Cúp Gà Rán Quốc Dân Vàng Khối',
    sourceCharacter: 'Ông Kính Tròn & Hội Đồng Ẩm Thực',
    icon: '🏆',
    chapter: 5,
    unlockedByFlag: 'national_champion_crowned',
    loreDescription: 'Chiếc cúp vàng ròng danh giá nhất đất nước được trao trước 10.000 khán giả sân vận động Phú Thọ, vinh danh hương vị chân phương đánh bại đồ ăn công nghiệp.',
    flavorQuote: 'Hương vị chiến thắng không đến từ tiền bạc... Nó đến từ trái tim của những người thợ bếp!',
    passiveBuffText: 'Mọi thực khách bước vào quán đều có đánh giá cơ sở từ 4.8 đến 5.0 sao.',
  },
];

/**
 * Lấy danh sách các kỷ vật đã được mở khóa dựa trên cờ nhân quả của người chơi
 */
export function getUnlockedCurios(state: GameState): CurioRelic[] {
  const flags = new Set<string>();

  // Thu thập từ characterStoryState nếu có
  if (state.characterStoryState?.characterProgress) {
    Object.values(state.characterStoryState.characterProgress).forEach(p => {
      p.causalityFlags?.forEach(f => flags.add(f));
    });
  }

  // Thu thập từ danh sách cờ thủ công đã lưu
  if (state.unlockedCurioIds) {
    state.unlockedCurioIds.forEach(id => flags.add(id));
  }

  return CURIOS_AND_RELICS.filter(relic => {
    // Nếu có cờ trùng với unlockedByFlag hoặc ID đã có trong state
    return flags.has(relic.unlockedByFlag) || flags.has(relic.id) || state.unlockedCurioIds?.includes(relic.id);
  });
}
