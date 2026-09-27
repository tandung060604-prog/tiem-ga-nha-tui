import { pick, random } from '../core/rng';
import { CustomerPersonality } from '../types/game';
// Hệ thống sinh nhân vật ngẫu nhiên (100 - 200 nhân vật) theo Archetype, Tên & Tính cách riêng biệt

export type CustomerArchetype = 'student' | 'delivery' | 'office' | 'genz' | 'demanding' | 'family';

export interface ModularCharacter {
  id: string;
  name: string;
  archetype: CustomerArchetype;
  personality: CustomerPersonality;
  personalityLabel: string;
  personalityDesc: string;
  avatar: string;
  title: string;
  patienceMultiplier: number;
  tipChance: number;
  hairStyle: string;
  outfit: string;
  accessory: string;
}

export const PERSONALITY_MAP: Record<CustomerPersonality, { label: string; desc: string; patienceRate: number }> = {
  generous: {
    label: '💎 Hào Phóng',
    desc: 'Làm nhanh tip đậm (+10k-15k), món Perfect tip thêm',
    patienceRate: 1.0
  },
  frugal: {
    label: '🦀 Chi Ly',
    desc: 'Tuyệt đối không bao giờ tip (0đ), đếm từng đồng lẻ',
    patienceRate: 1.0
  },
  impatient: {
    label: '⚡ Vội Vã',
    desc: 'Tụt kiên nhẫn nhanh (1.4x), nhanh mới tip (+5k), chậm cắt sạch',
    patienceRate: 1.4
  },
  easygoing: {
    label: '🌸 Dễ Tính',
    desc: 'Kiên nhẫn chờ lâu (0.7x), luôn tip nhẹ 2k-3k vui vẻ',
    patienceRate: 0.7
  },
  foodie: {
    label: '👑 Sành Ăn',
    desc: 'Món Perfect tip to (+8k-12k), gà cháy phạt tiền gấp đôi',
    patienceRate: 0.95
  },
  student: {
    label: '🎓 Học Sinh',
    desc: 'Tiền túi có hạn, tip tiền lẻ 1k-2k hoặc 0đ, rất lễ phép',
    patienceRate: 1.1
  },
  driver: {
    label: '🛵 Tài Xế',
    desc: 'Cần đơn gấp đi giao, không tip nhưng đơn nhanh gọn',
    patienceRate: 1.3
  }
};

const ARCHETYPE_CONFIG: Record<CustomerArchetype, {
  titles: string[];
  names: string[];
  avatars: string[];
  patienceMultiplier: number;
  tipChance: number;
  hairStyles: string[];
  outfits: string[];
  accessories: string[];
}> = {
  student: {
    titles: ['Học sinh THPT', 'Sinh viên đại học', 'Học sinh ôn thi', 'Bàn cuối lớp 12A1'],
    names: ['Tường Vy', 'Gia Hân', 'Anh Kiệt', 'Bảo Châu', 'Khôi Nguyên', 'Phương Nhi', 'Thanh Trúc', 'Huy Hoàng', 'Ánh Tuyết', 'Hữu Phước'],
    avatars: ['🎒', '👦', '👧', '👨‍🎓', '👩‍🎓'],
    patienceMultiplier: 1.15,
    tipChance: 0.2,
    hairStyles: ['Tóc mái ngố', 'Tóc buộc đuôi ngựa', 'Tóc undercut học sinh', 'Tóc ngắn ngang vai'],
    outfits: ['Đồng phục áo trắng váy xanh', 'Áo sơ mi trắng quần tây', 'Áo khoác thể dục trường'],
    accessories: ['Kính cận gọng tròn', 'Balo học sinh', 'Bình nước giữ nhiệt', 'Hộp bút']
  },
  delivery: {
    titles: ['Tài xế công nghệ', 'Shipper siêu tốc', 'Ninja giao hàng', 'Bác tài 5 sao'],
    names: ['Phong Rồ-Ga', 'Bác Bảy Siêu Tốc', 'Cường Ninja', 'Khoa Giao Hàng', 'Thành Đạt Shipper', 'Hải Bánh Mì', 'Văn Lâm Vận Chuyển'],
    avatars: ['🛵', '🧑‍✈️', '📦', '🦺'],
    patienceMultiplier: 0.75, // Shipper hay vội
    tipChance: 0.1,
    hairStyles: ['Mũ bảo hiểm nửa đầu', 'Mũ lưỡi trai', 'Tóc cắt cua'],
    outfits: ['Áo khoác shipper xanh dương', 'Áo khoác gió cam phản quang', 'Găng tay chống nắng'],
    accessories: ['Điện thoại định vị GPS', 'Tai nghe bluetooth 1 bên', 'Túi giữ nhiệt giao đồ ăn']
  },
  office: {
    titles: ['Nhân viên công sở', 'Kế toán viên', 'Trưởng nhóm kinh doanh', 'HR tuyển dụng'],
    names: ['Chị Hạnh Kế Toán', 'Anh Khải Trưởng Phòng', 'Thảo Linh HR', 'Hoàng Tử Deadline', 'Huyền Trang Marketing', 'Quốc Bảo Lập Trình', 'Thu Hà Designer'],
    avatars: ['💼', '👔', '👩‍💼', '👨‍💼', '💻'],
    patienceMultiplier: 0.9,
    tipChance: 0.45,
    hairStyles: ['Tóc xoăn lọn sóng', 'Tóc búi công sở', 'Tóc vuốt sáp lịch lãm', 'Tóc bob hiện đại'],
    outfits: ['Áo sơ mi trắng quần âu', 'Váy công sở thanh lịch', 'Áo vest blazer'],
    accessories: ['Thẻ đeo cổ nhân viên', 'Cặp đựng laptop', 'Đồng hồ đeo tay', 'Ly cà phê sáng']
  },
  genz: {
    titles: ['Tiktoker triệu view', 'Game thủ cày rank', 'Dân chơi hệ Threads', 'Hot girl review'],
    names: ['Ngọc Hân Review', 'Zét-Bi Đói Bụng', 'Mèo Béo Mukbang', 'Gia Bảo Cày Rank', 'Bé Sóc Chill', 'Khánh Vy Vui Vẻ', 'Minh Châu Trend'],
    avatars: ['📱', '🎧', '📸', '🕶️', '✨'],
    patienceMultiplier: 1.0,
    tipChance: 0.35,
    hairStyles: ['Tóc nhuộm xám khói', 'Tóc layer Hàn Quốc', 'Tóc highlight màu pastel', 'Tóc mullet cá tính'],
    outfits: ['Áo hoodie oversized', 'Áo thun phong cách streetwear', 'Áo bomber jacket'],
    accessories: ['Tai nghe chụp tai gaming', 'Kính râm gọng vuông', 'Điện thoại quay phim', 'Túi chéo tote']
  },
  demanding: {
    titles: ['Thực khách sành ăn', 'Tổ trưởng gương mẫu', 'Chuyên gia soi dầu', 'Khách VIP khó tính'],
    names: ['Cô Hằng Khó Tính', 'Bác Sáu Tổ Phó', 'Cô Tư Soi Mỡ', 'Bác Hạc Ẩm Thực', 'Bà Bảy Chợ Cũ', 'Bác Năm Kiểm Tra'],
    avatars: ['💅', '👴', '👵', '🧐', '🔍'],
    patienceMultiplier: 0.7, // Rất khó tính
    tipChance: 0.6, // Nếu làm vừa lòng thì tip cực khủng
    hairStyles: ['Tóc búi cao quý phái', 'Tóc hoa râm cổ điển', 'Tóc uốn xù retro'],
    outfits: ['Đồ bộ lụa hoa văn', 'Áo sơ mi cộc tay cài cúc', 'Áo khoác len trang nhã'],
    accessories: ['Kính lão trễ mũi', 'Túi xách da cổ điển', 'Quạt nan phe phẩy', 'Khăn tay thêu']
  },
  family: {
    titles: ['Gia đình ấm cúng', 'Mẹ bỉm sữa', 'Bố đảm đang', 'Hai mẹ con dễ thương'],
    names: ['Bé Mít & Mẹ', 'Bác Tư & Cháu', 'Gia Đình Anh Phát', 'Mẹ Con Su Su', 'Nhà Bác Sáu'],
    avatars: ['👨‍👩‍👧', '🧒', '👶', '🧸'],
    patienceMultiplier: 1.1,
    tipChance: 0.3,
    hairStyles: ['Tóc cột nơ', 'Tóc ngắn trẻ em', 'Tóc dài buộc gọn'],
    outfits: ['Áo thun gia đình ton-sur-ton', 'Váy hoa nhí mẹ và bé', 'Yếm bò đáng yêu'],
    accessories: ['Gấu bông cầm tay', 'Bình sữa em bé', 'Xe đẩy trẻ em', 'Bong bóng hình gà']
  }
};

export class CharacterGenerator {
  // Sinh ngẫu nhiên 1 trong 100 - 200 vị khách với đầy đủ thông tin đồng bộ
  public static generateCharacter(): ModularCharacter {
    const archetypes: CustomerArchetype[] = ['student', 'delivery', 'office', 'genz', 'demanding', 'family'];
    const chosenArchetype = pick(archetypes);
    const config = ARCHETYPE_CONFIG[chosenArchetype];

    const name = pick(config.names);
    const title = pick(config.titles);
    const avatar = pick(config.avatars);
    const hairStyle = pick(config.hairStyles);
    const outfit = pick(config.outfits);
    const accessory = pick(config.accessories);

    let personality: CustomerPersonality;
    switch (chosenArchetype) {
      case 'student':
        personality = random() < 0.75 ? 'student' : 'easygoing';
        break;
      case 'delivery':
        personality = random() < 0.7 ? 'driver' : 'impatient';
        break;
      case 'office':
        personality = pick(['generous', 'impatient', 'frugal'] as const);
        break;
      case 'genz':
        personality = pick(['generous', 'impatient', 'easygoing'] as const);
        break;
      case 'demanding':
        personality = random() < 0.65 ? 'foodie' : 'frugal';
        break;
      case 'family':
      default:
        personality = random() < 0.6 ? 'easygoing' : 'generous';
        break;
    }
    const pInfo = PERSONALITY_MAP[personality];

    return {
      id: 'cust_' + Math.floor(random() * 10000000).toString(36),
      name,
      title,
      archetype: chosenArchetype,
      personality,
      personalityLabel: pInfo.label,
      personalityDesc: pInfo.desc,
      avatar,
      patienceMultiplier: config.patienceMultiplier * (1 / pInfo.patienceRate),
      tipChance: config.tipChance,
      hairStyle,
      outfit,
      accessory
    };
  }
}
