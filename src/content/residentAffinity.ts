import { ResidentAffinity, GameState } from '../types/game';
import { ASSETS } from './assets';

/**
 * HỆ THỐNG CẤP ĐỘ THÂN THIẾT & HỒ SƠ BÍ MẬT CƯ DÂN HẺM 1102
 * Đo lường mức độ gắn kết giữa chủ quán và các nhân vật biểu tượng:
 * Rank 1: Khách Vãng Lai (⭐)
 * Rank 2: Khách Quen Hẻm (⭐⭐)
 * Rank 3: Bạn Hữu Chia Sẻ (⭐⭐⭐)
 * Rank 4: Tri Kỷ Thâm Giao (⭐⭐⭐⭐)
 * Rank 5: Người Một Nhà Hẻm 1102 (⭐⭐⭐⭐⭐)
 */

interface RawResidentDossier {
  characterId: string;
  name: string;
  roleTitle: string;
  avatar: string;
  favoriteDish: string;
  secretBioByRank: Record<1 | 2 | 3 | 4 | 5, string>;
  specialPerkByRank: Record<1 | 2 | 3 | 4 | 5, string>;
}

export const RESIDENT_DOSSIERS: RawResidentDossier[] = [
  {
    characterId: 'bac_ba',
    name: 'Bác Ba Tổ Trưởng',
    roleTitle: 'Cựu Bếp Trưởng Gà Chợ Lớn 1990',
    avatar: ASSETS.bacba.front,
    favoriteDish: 'Đùi gà chiên truyền thống giòn rụm & Cháo gà gừng nóng',
    secretBioByRank: {
      1: 'Tổ trưởng dân phố nghiêm khắc, hay đi tuần tra nhắc nhở xe cộ và rác thải đầu hẻm.',
      2: 'Từng là đầu bếp kỳ cựu ở Quận 5 những năm 90, nhìn bàn tay nhấc vá là biết tay nghề.',
      3: 'Sống một mình trong căn nhà tập thể cũ, người thân đều đã định cư nước ngoài nhiều năm.',
      4: 'Là học trò cưng của cố bếp trưởng Võ Hòa, mang trong mình bí quyết ướp gà thảo mộc trứ danh.',
      5: 'Xem bạn như truyền nhân ruột thịt duy nhất, sẵn sàng dốc trọn gia sản và uy tín để bảo bọc quán.',
    },
    specialPerkByRank: {
      1: 'Nhắc nhở giữ vệ sinh khu vực hè phố.',
      2: 'Tặng sổ tay nhiệt độ dầu sôi chuẩn xác.',
      3: 'Bảo lãnh an ninh mỗi khi có đoàn kiểm tra trật tự đô thị.',
      4: 'Trao vá gỗ 1990 gia truyền tăng +5% tỉ lệ Perfect.',
      5: 'Ban phước lành Bếp Trưởng: Quán không bao giờ bị đóng cửa vì sự cố nhỏ.',
    },
  },
  {
    characterId: 'tho_cam',
    name: 'Bé Thỏ Cam (Mimi)',
    roleTitle: 'Cháu Gái Cố Bếp Trưởng Võ Hòa',
    avatar: ASSETS.thocam.front,
    favoriteDish: 'Gà lắc phô mai mật ong hoa cà phê & Trà đào cam sả',
    secretBioByRank: {
      1: 'Cô bé mặc đồ mascot thú bông phát tờ rơi dưới cái nắng 38 độ ở ngã tư.',
      2: 'Rụt rè không dám lộ mặt, chỉ để lại những mẩu giấy note cảm ơn nắn nót.',
      3: 'Tên thật là Võ Minh Mi, sinh viên nghèo đỗ thủ khoa ngành thiết kế mỹ thuật.',
      4: 'Chính là cháu gái nội duy nhất của ông Võ Hòa - người sáng lập tiệm gà Chợ Lớn 1990.',
      5: 'Trở thành Giám đốc điều hành Chi nhánh Di Sản, sánh bước cùng bạn phát triển chuỗi gà.',
    },
    specialPerkByRank: {
      1: 'Mỗi tuần ghé quán gửi 1 bức thư tay kèm tiền tip nhỏ.',
      2: 'Vẽ tặng menu phấn màu bắt mắt cho quán.',
      3: 'Thiết kế bộ nhận diện thương hiệu miễn phí cho tiệm gà.',
      4: 'Tặng công thức Sốt Mật Ong Hoa Cà Phê độc quyền.',
      5: 'Mở rộng chuỗi nhượng quyền Gà Chợ Lớn mang lại lợi nhuận thụ động.',
    },
  },
  {
    characterId: 'le_bao_na',
    name: 'Em Na',
    roleTitle: 'Vũ Công Múa Đương Đại Hẻm 1102',
    avatar: ASSETS.hocsinh.stand,
    favoriteDish: 'Ức gà giòn không da ít béo & Nước sâm rong biển',
    secretBioByRank: {
      1: 'Nữ sinh nhỏ nhắn hay tan học muộn, thường đứng tần ngần ngắm đôi giày múa trong tủ kính.',
      2: 'Đam mê múa từ bé nhưng bị gia đình ngăn cản vì sợ nghề múa nghèo khó, bấp bênh.',
      3: 'Tự mình làm thêm 3 ca mỗi ngày để có tiền đóng học phí trường múa.',
      4: 'Lọt vào vòng bán kết toàn quốc và làm hòa trọn vẹn với anh trai (Long IT).',
      5: 'Trở thành biên đạo múa trẻ tài năng, mở học viện nghệ thuật miễn phí cho trẻ em nghèo hẻm.',
    },
    specialPerkByRank: {
      1: 'Đem lại năng lượng tươi trẻ, lan tỏa nụ cười cho quán.',
      2: 'Thu hút đông đảo học sinh sinh viên ghé ủng hộ.',
      3: 'Sáng tác điệu nhảy viral TikTok quảng bá món ăn.',
      4: 'Biên đạo điệu múa độc quyền cho tiệm gà trong các dịp lễ.',
      5: 'Học viện múa của Na giúp tình nghĩa xóm giềng Hẻm 1102 đạt đỉnh cao gắn kết tuyệt đối.',
    },
  },
  {
    characterId: 'dung',
    name: 'Dũng Họa Sĩ',
    roleTitle: 'Họa Sĩ Truyện Tranh & Nhiếp Ảnh',
    avatar: ASSETS.hocsinh.stand,
    favoriteDish: 'Cánh gà chiên cay xé lưỡi & Cà phê đen đá không đường',
    secretBioByRank: {
      1: 'Chàng trai phong trần với mái tóc dài, ngồi vẽ phác thảo ở góc bàn số 3.',
      2: 'Vẽ truyện tranh tự do trên mạng, sống bằng tiền thù lao ít ỏi từ các nhà xuất bản.',
      3: 'Thầm thương trộm nhớ Na từ những ngày em mới tập tễnh những bước múa đầu tiên.',
      4: 'Bức tranh vẽ Na dưới mưa đạt giải nhất triển lãm Mỹ Thuật Trẻ thành phố.',
      5: 'Trở thành bạn đời tri kỷ của Na, phụ trách toàn bộ hình ảnh và truyền thông cho tiệm gà.',
    },
    specialPerkByRank: {
      1: 'Vẽ chân dung tặng khách đợi bàn lúc đông đúc.',
      2: 'Vẽ tranh tường bích họa biến quán thành điểm check-in hot.',
      3: 'Tặng bức tranh "Vũ Điệu Dưới Mưa" tăng điểm Vibe quán.',
      4: 'Lập kênh truyện tranh về Hẻm 1102 thu hút hàng trăm nghìn fan.',
      5: 'Đám cưới ấm áp tại quán tạo hiệu ứng truyền thông vang dội toàn quốc.',
    },
  },
  {
    characterId: 'anh_long',
    name: 'Anh Long Trưởng Phòng',
    roleTitle: 'Cựu Kỹ Sư IT & Giám Đốc Công Nghệ',
    avatar: ASSETS.vanphong.stand,
    favoriteDish: 'Bucket gà 10 miếng cày đêm & Cà phê sữa đá đậm đặc',
    secretBioByRank: {
      1: 'Vị khách công sở mặt mày hốc hác vì OT, luôn nghe điện thoại gắt gỏng của sếp.',
      2: 'Gánh trên vai áp lực trụ cột gia đình, luôn muốn em gái có cuộc sống an nhàn.',
      3: 'Chữa lành tinh thần qua những bữa gà nóng hổi và nhận ra sai lầm khi cấm đoán em gái.',
      4: 'Bỏ việc công sở, bắt tay khởi nghiệp viết app và hệ thống bán hàng độc quyền cho tiệm.',
      5: 'Đưa hệ thống IT của quán vận hành tự động mượt mà, sẵn sàng cạnh tranh sòng phẳng với các tập đoàn.',
    },
    specialPerkByRank: {
      1: 'Thường xuyên đặt đơn số lượng lớn cho công ty.',
      2: 'Góp ý tối ưu hóa tốc độ quầy thanh toán.',
      3: 'Hàn gắn gia đình mang lại phúc khí dồi dào cho tiệm.',
      4: 'Mở khóa App Riêng không mất 30% phí nền tảng.',
      5: 'Hệ thống tự động hóa hoàn toàn luồng quản lý kho và dòng tiền.',
    },
  },
  {
    characterId: 'mai_bap',
    name: 'Chị Mai & Bé Bắp',
    roleTitle: 'Chị Bán Xôi Hẻm & Cậu Bé Điểm 10',
    avatar: ASSETS.characters.char_13_vendor_tham,
    favoriteDish: 'Đùi gà sốt bơ tỏi ngọt dịu & Xôi chiên giòn',
    secretBioByRank: {
      1: 'Người mẹ đơn thân tảo tần dậy từ 3 giờ sáng nấu xôi gánh ra đầu chợ.',
      2: 'Bé Bắp rất ngoan, luôn ngồi học bài trên thùng xốp chờ mẹ bán hết hàng.',
      3: 'Từng trải qua biến cố hôn nhân đau thương nhưng luôn giữ nụ cười đôn hậu.',
      4: 'Được Tuấn shipper ngỏ lời yêu thương chân thành sau nhiều năm giúp đỡ.',
      5: 'Gia đình nhỏ trọn vẹn hạnh phúc, mở rộng quầy xôi gà liên kết ngay trước hiên tiệm.',
    },
    specialPerkByRank: {
      1: 'Thường xuyên gửi biếu đĩa xôi nếp thơm ngon cho quán.',
      2: 'Bé Bắp phụ lau bàn ghế sạch bóng.',
      3: 'Tăng danh tiếng khu xóm người lao động xung quanh.',
      4: 'Tặng công thức Xôi Chiên Gà Giòn Đính Hôn độc quyền.',
      5: 'Quầy xôi gà liên kết giúp tiệm bán thêm hàng trăm suất ăn sáng.',
    },
  },
];

/**
 * Lấy hồ sơ thân thiết của một nhân vật cụ thể
 */
export function getResidentAffinity(state: GameState, characterId: string): ResidentAffinity {
  const dossier = RESIDENT_DOSSIERS.find(d => d.characterId === characterId) || {
    characterId,
    name: 'Cư Dân Hẻm',
    roleTitle: 'Bà Con Hẻm 1102',
    avatar: ASSETS.characters.char_02_lottery_lady,
    favoriteDish: 'Đùi gà giòn nóng',
    secretBioByRank: {
      1: 'Khách quen mới gặp ở đầu hẻm.',
      2: 'Thường xuyên ghé quán mỗi chiều.',
      3: 'Người bạn tốt luôn tương trợ nhau lúc hoạn nạn.',
      4: 'Người tri kỷ thấu hiểu mọi gian khó của nghề.',
      5: 'Như ruột thịt một nhà trong hẻm.',
    },
    specialPerkByRank: {
      1: 'Khách hàng thân thiện.',
      2: 'Thêm tiền tip nhỏ.',
      3: 'Ủng hộ nhiệt tình.',
      4: 'Tăng uy tín quán.',
      5: 'Gia tăng phúc lộc dài lâu.',
    },
  };

  const progress = state.characterStoryState?.characterProgress?.[characterId];
  const completedCount = progress?.completedEpisodeIds?.length || 0;

  // Tính rank từ 1 đến 5
  let rank: 1 | 2 | 3 | 4 | 5 = 1;
  if (completedCount >= 6) rank = 5;
  else if (completedCount >= 4) rank = 4;
  else if (completedCount >= 2) rank = 3;
  else if (completedCount >= 1) rank = 2;

  const titles: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: 'Người Lạ Ghé Qua',
    2: 'Khách Quen Đầu Hẻm',
    3: 'Bạn Hữu Chia Sẻ',
    4: 'Tri Kỷ Thâm Giao',
    5: 'Người Một Nhà Hẻm 1102',
  };

  return {
    characterId: dossier.characterId,
    name: dossier.name,
    roleTitle: dossier.roleTitle,
    avatar: dossier.avatar,
    rank,
    rankTitle: titles[rank],
    favoriteDish: dossier.favoriteDish,
    secretBio: dossier.secretBioByRank[rank],
    specialPerkDesc: dossier.specialPerkByRank[rank],
    unlockedAtEpisodeCount: completedCount,
  };
}

/**
 * Lấy toàn bộ danh sách hồ sơ cư dân đã gặp
 */
export function getAllResidentAffinities(state: GameState): ResidentAffinity[] {
  return RESIDENT_DOSSIERS.map(d => getResidentAffinity(state, d.characterId));
}
