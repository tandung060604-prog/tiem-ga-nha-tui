import { BargainWholesaler, BargainResult } from '../types/game';

export const WHOLESALERS: BargainWholesaler[] = [
  {
    id: 'co_nam',
    name: 'Cô Năm',
    stallName: 'Sạp Gà Tươi Cô Năm · Chợ Lớn',
    avatar: '🍗',
    specialty: 'Thịt gà tươi, má đùi, cánh gà',
    dialogue: 'Gà ta thả vườn sáng nay vừa về bến Bình Điền, da vàng thịt chắc nịch! Cháu lấy bao nhiêu để cô đóng thùng gửi qua tiệm?'
  },
  {
    id: 'chu_bay',
    name: 'Chú Bảy',
    stallName: 'Đại Lý Bột & Dầu Chú Bảy · Chợ Lớn',
    avatar: '🌾',
    specialty: 'Bột chiên giòn xù, dầu ăn, phô mai',
    dialogue: 'Bột mì hảo hạng gia truyền Chợ Lớn chiên lên giòn rụm tới tối! Mở hàng sớm cho chú một mẻ lấy hên đi!'
  },
  {
    id: 'di_tam',
    name: 'Dì Tám',
    stallName: 'Nông Sản & Giải Khát Dì Tám · Chợ Lớn',
    avatar: '🥬',
    specialty: 'Khoai tây, củ cải, gia vị sốt, nước ngọt',
    dialogue: 'Khoai tây củ to bùi ngọt, củ cải trắng giòn tươi rói! Cháu mua sỉ nhiều Dì bớt cho chút đỉnh làm quen!'
  }
];

export type BargainTactic = 'friendly' | 'volume' | 'hardball';

export interface BargainTacticInfo {
  id: BargainTactic;
  label: string;
  subDesc: string;
  successRate: number;
  discountPct: number;
  icon: string;
}

export const BARGAIN_TACTICS: Record<BargainTactic, BargainTacticInfo> = {
  friendly: {
    id: 'friendly',
    label: 'Năn Nỉ Tình Nghĩa',
    subDesc: 'Tỉ lệ thành công 90% · Giảm 15% giá nhập sỉ hôm nay',
    successRate: 0.9,
    discountPct: 15,
    icon: '🌸'
  },
  volume: {
    id: 'volume',
    label: 'Cam Kết Lấy Số Lượng Lớn',
    subDesc: 'Tỉ lệ thành công 65% · Giảm 25% giá nhập sỉ hôm nay',
    successRate: 0.65,
    discountPct: 25,
    icon: '📦'
  },
  hardball: {
    id: 'hardball',
    label: 'Ép Giá & So Với Sạp Khác',
    subDesc: 'Tỉ lệ thành công 35% · Giảm 35% cực hời, thất bại bị từ chối!',
    successRate: 0.35,
    discountPct: 35,
    icon: '🔥'
  }
};

export function getTodayWholesaler(day: number): BargainWholesaler {
  const idx = Math.abs(day - 1) % WHOLESALERS.length;
  return WHOLESALERS[idx] ?? WHOLESALERS[0]!;
}

export function executeBargain(
  wholesaler: BargainWholesaler,
  tactic: BargainTactic,
  randomVal: number = Math.random()
): BargainResult {
  const info = BARGAIN_TACTICS[tactic];
  const success = randomVal < info.successRate;

  if (success) {
    let msg = '';
    if (tactic === 'friendly') {
      msg = `${wholesaler.name}: "Thôi thấy cháu chịu thương chịu khó mở quán buôn bán tử tế, cô/chú bớt hẳn ${info.discountPct}% lấy lộc buôn may bán đắt nghen!"`;
    } else if (tactic === 'volume') {
      msg = `${wholesaler.name}: "Được lời như cởi tấm lòng! Cam kết lấy đều mối ruột là cô/chú ưng bụng liền, chiết khấu ${info.discountPct}% cho tiệm mau phát đạt!"`;
    } else {
      msg = `${wholesaler.name}: "Trời ơi ép giá sát ván thấy sợ luôn! Thôi nể mặt Bác Ba với cháu, bớt luôn ${info.discountPct}%, mai mốt nhớ ghé sạp cô/chú tiếp đó!"`;
    }
    return {
      success: true,
      discountPct: info.discountPct,
      discountPercent: info.discountPct,
      message: msg,
      wholesaler
    };
  } else {
    let msg = '';
    if (tactic === 'hardball') {
      msg = `${wholesaler.name}: "Nè chê đắt thì qua sạp khác mua giùm cái, sạp cô/chú bán hàng tuyển chất lượng loại một chứ không bán thách nghen!" (Không giảm giá)`;
    } else {
      msg = `${wholesaler.name}: "Bán rẻ vậy là cô/chú lấy công làm lời rồi, giá này hữu nghị lắm không bớt thêm được nữa đâu cháu ơi!" (Không giảm giá)`;
    }
    return {
      success: false,
      discountPct: 0,
      discountPercent: 0,
      message: msg,
      wholesaler
    };
  }
}
