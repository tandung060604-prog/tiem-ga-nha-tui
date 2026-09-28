import { pick, random } from '../core/rng';
import { CustomerPersonality } from '../types/game';
import { CHARACTERS_36 } from './characters36';
import { mentionsStoryCharacter } from './storyCharacters';
import { ASSETS } from './assets';

// Hệ thống 36 nhân vật Hẻm 1102 (33 nhân vật người thực khách/cư dân hẻm + 3 động vật đặc biệt)
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
  isVip?: boolean;
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
  vip_generous: {
    label: '👑✨ KHÁCH SỘP 💵',
    desc: 'Đại gia hào phóng! Đơn to, phục vụ nhanh + vàng giòn tip khủng (+25k–60k+)',
    patienceRate: 0.85
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

// Khách hàng Hẻm 1102: loại trừ động vật, nhân viên quán (chủ quán + phụ bếp), và nhân vật cốt truyện
const HUMAN_CHARACTERS = CHARACTERS_36.filter(c => c.category !== 'animal' && c.category !== 'staff' && !mentionsStoryCharacter(c.name));

export class CharacterGenerator {
  public static generateCharacter(): ModularCharacter {
    const char = pick(HUMAN_CHARACTERS);

    // Xác định archetype dựa trên vai trò & nghề nghiệp
    let archetype: CustomerArchetype = 'office';
    if (char.id.includes('student') || char.id.includes('kid')) {
      archetype = 'student';
    } else if (char.id.includes('shipper') || char.id.includes('courier') || char.id.includes('buyer_tam') || char.id.includes('trucker')) {
      archetype = 'delivery';
    } else if (char.id.includes('trendy') || char.id.includes('couple') || char.id.includes('jogger')) {
      archetype = 'genz';
    } else if (char.id.includes('grumpy') || char.id.includes('tough') || char.id.includes('police') || char.id.includes('traffic')) {
      archetype = 'demanding';
    } else if (char.id.includes('granny') || char.id.includes('wholesale') || char.id.includes('vendor') || char.id.includes('scrap') || char.id.includes('bread') || char.id.includes('grocer')) {
      archetype = 'family';
    }

    // Cơ chế Khách Sộp (VIP Big Spender): ~15% tỷ lệ khách thường, ~35% cho khách sang/thương lái
    const isVipEligible = char.tipTendency === 'generous' || char.id.includes('buyer') || char.id.includes('wholesale') || char.id.includes('trendy');
    const isVip = isVipEligible ? random() < 0.30 : random() < 0.12;

    // Xác định personality phù hợp tính cách nhân vật
    let personality: CustomerPersonality;
    if (isVip) {
      personality = 'vip_generous';
    } else if (char.tipTendency === 'generous') {
      personality = random() < 0.65 ? 'generous' : 'foodie';
    } else if (char.tipTendency === 'low') {
      personality = char.patienceMultiplier < 0.9 ? 'impatient' : 'frugal';
    } else {
      if (archetype === 'student') personality = 'student';
      else if (archetype === 'delivery') personality = 'driver';
      else personality = random() < 0.5 ? 'easygoing' : 'generous';
    }

    const pInfo = PERSONALITY_MAP[personality];
    const tipChance = isVip ? 0.95 : char.tipTendency === 'generous' ? 0.65 : char.tipTendency === 'low' ? 0.12 : 0.35;
    const title = isVip ? `👑 ${char.roleTitle} (Khách Sộp)` : char.roleTitle;

    return {
      id: char.id,
      name: char.name,
      title,
      archetype,
      personality,
      personalityLabel: pInfo.label,
      personalityDesc: pInfo.desc,
      avatar: (ASSETS.characters as Record<string, string>)[char.id] || `${import.meta.env?.BASE_URL ?? './'}assets/characters/${char.id}.png`,
      patienceMultiplier: char.patienceMultiplier * (1 / pInfo.patienceRate),
      tipChance,
      hairStyle: 'Chuẩn phong cách Sài Gòn',
      outfit: isVip ? 'Trang phục bảnh bao sang trọng' : 'Trang phục đời thường hẻm 1102',
      accessory: title,
      isVip
    };
  }
}
