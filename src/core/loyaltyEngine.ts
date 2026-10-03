import { 
  CustomerLoyaltyState, 
  CustomerLoyaltyEntry, 
  DietaryPreference, 
  DietaryPreferenceId, 
  AlleyResidentGift, 
  AlleyGiftType,
  CustomerOrder, 
  TrayItem, 
  OilCondition, 
  GameState 
} from '../types/game';
import { CHARACTERS_36 } from '../content/characters36';

// ============================================================================
// HỆ THỐNG TRI KỶ HẺM 1102 & KHẨU VỊ RUỘT (ALLEY LOYALTY ENGINE)
// ============================================================================

export const HEART_EXP_THRESHOLDS: readonly number[] = [0, 100, 250, 500, 850, 1300];

export const HEART_LEVEL_TITLES: readonly string[] = [
  'Khách Mới Ghé',      // Level 0
  'Khách Quen Hẻm',     // Level 1: +15% kiên nhẫn
  'Bạn Cùng Ngõ',       // Level 2: Nhận Quà Quê Đợt 1
  'Khách Hợp Gu',       // Level 3: +25% Tip tri kỷ
  'Tri Kỷ Hẻm',         // Level 4: Nhận Quà Quê Kỷ Vật Đợt 2
  'Người Nhà 1102'      // Level 5: Rủ thêm bạn đi cùng
];

export const DIETARY_PREFERENCES: Record<DietaryPreferenceId, DietaryPreference> = {
  crisp_perfection: {
    id: 'crisp_perfection',
    label: '🌟 Giòn Rụm',
    hint: 'Mê mẻ gà vàng giòn rụm đúng độ nghen!',
    bonusTip: 8000,
    loyaltyExp: 35
  },
  extra_sauce: {
    id: 'extra_sauce',
    label: '🍯 Đẫm Sốt',
    hint: 'Nhớ quét đẫm sốt bí truyền óng ánh nha!',
    bonusTip: 10000,
    loyaltyExp: 40
  },
  clean_oil_only: {
    id: 'clean_oil_only',
    label: '🌿 Dầu Sạch',
    hint: 'Chiên bằng chảo dầu vàng trong vắt cho an tâm!',
    bonusTip: 12000,
    loyaltyExp: 45
  },
  side_pickle_pair: {
    id: 'side_pickle_pair',
    label: '🥢 Thêm Đồ Chua',
    hint: 'Có đồ chua ăn kèm giòn rụm giải ngấy là hết ý!',
    bonusTip: 6000,
    loyaltyExp: 30
  },
  extra_chilled_drink: {
    id: 'extra_chilled_drink',
    label: '🧊 Thật Lạnh',
    hint: 'Cho ly nước ngọt lạnh buốt sảng khoái nha!',
    bonusTip: 5000,
    loyaltyExp: 25
  },
  speedy_serve: {
    id: 'speedy_serve',
    label: '⚡ Nhanh Gọn',
    hint: 'Đang vội chạy việc/vào ca, lên món lẹ nghen!',
    bonusTip: 9000,
    loyaltyExp: 35
  }
};

export function createInitialLoyaltyState(): CustomerLoyaltyState {
  const residents: Record<string, CustomerLoyaltyEntry> = {};
  for (const char of CHARACTERS_36) {
    residents[char.id] = {
      characterId: char.id,
      heartLevel: 0,
      exp: 0,
      totalVisits: 0,
      perfectDishesServed: 0,
      specialRequestsFulfilled: 0,
      unlockedGifts: []
    };
  }
  return {
    residents,
    pendingAlleyGifts: [],
    claimedAlleyGiftsHistory: []
  };
}

export function ensureLoyaltyState(state: GameState): CustomerLoyaltyState {
  if (!state.loyaltyState) {
    state.loyaltyState = createInitialLoyaltyState();
  }
  // Đảm bảo toàn bộ 36 nhân vật đều có mục trong residents
  for (const char of CHARACTERS_36) {
    if (!state.loyaltyState.residents[char.id]) {
      state.loyaltyState.residents[char.id] = {
        characterId: char.id,
        heartLevel: 0,
        exp: 0,
        totalVisits: 0,
        perfectDishesServed: 0,
        specialRequestsFulfilled: 0,
        unlockedGifts: []
      };
    }
  }
  if (!Array.isArray(state.loyaltyState.pendingAlleyGifts)) {
    state.loyaltyState.pendingAlleyGifts = [];
  }
  if (!Array.isArray(state.loyaltyState.claimedAlleyGiftsHistory)) {
    state.loyaltyState.claimedAlleyGiftsHistory = [];
  }
  return state.loyaltyState;
}

/**
 * Tính Cấp độ Tim (0 - 5) dựa trên tổng điểm EXP
 */
export function calculateHeartLevel(exp: number): number {
  for (let i = HEART_EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = HEART_EXP_THRESHOLDS[i];
    if (threshold !== undefined && exp >= threshold) {
      return i;
    }
  }
  return 0;
}

/**
 * Chỉ định Khẩu vị ruột ngẫu nhiên nhưng có trọng số theo tính cách của nhân vật
 */
export function assignDietaryPreference(characterId?: string, heartLevel: number = 0): DietaryPreference | undefined {
  if (!characterId) return undefined;
  
  // Xác suất có khẩu vị ruột: Level 0: 35%, Level 1: 55%, Level 2+: 80%
  const roll = Math.random();
  const threshold = heartLevel === 0 ? 0.35 : heartLevel === 1 ? 0.55 : 0.80;
  if (roll > threshold) return undefined;

  const char = CHARACTERS_36.find(c => c.id === characterId);
  const pool: DietaryPreferenceId[] = [];

  if (char) {
    switch (char.karmaAffinity) {
      case 'craftsmanship':
        pool.push('crisp_perfection', 'clean_oil_only', 'extra_sauce');
        break;
      case 'community':
        pool.push('side_pickle_pair', 'extra_chilled_drink', 'clean_oil_only');
        break;
      case 'ambition':
        pool.push('speedy_serve', 'crisp_perfection', 'extra_chilled_drink');
        break;
      default:
        pool.push('crisp_perfection', 'extra_sauce', 'clean_oil_only', 'side_pickle_pair', 'extra_chilled_drink', 'speedy_serve');
    }
  } else {
    pool.push('crisp_perfection', 'extra_sauce', 'clean_oil_only', 'side_pickle_pair', 'extra_chilled_drink', 'speedy_serve');
  }

  const chosenId = pool[Math.floor(Math.random() * pool.length)];
  return chosenId ? DIETARY_PREFERENCES[chosenId] : undefined;
}

export interface DietaryFulfillmentResult {
  fulfilled: boolean;
  bonusTip: number;
  loyaltyExp: number;
  feedbackText: string;
}

/**
 * Kiểm tra xem khi giao món có đáp ứng khẩu vị ruột của khách không
 */
export function checkDietaryFulfillment(
  order: CustomerOrder,
  servedItems: readonly TrayItem[],
  oilCondition: OilCondition = 'clean',
  patienceRemainingPercent: number
): DietaryFulfillmentResult {
  if (!order.dietaryPreference) {
    return { fulfilled: false, bonusTip: 0, loyaltyExp: 15, feedbackText: '' };
  }

  const pref = order.dietaryPreference;
  let fulfilled = false;
  let feedbackText = '';

  switch (pref.id) {
    case 'crisp_perfection': {
      // Mọi món chiên được giao phải là Perfect
      const friedItems = servedItems.filter(item => 
        item.menuItemId.includes('chicken') || 
        item.menuItemId.includes('thigh') || 
        item.menuItemId.includes('fries') || 
        item.menuItemId.includes('cheese') || 
        item.menuItemId.includes('popcorn')
      );
      if (friedItems.length > 0 && friedItems.every(i => i.quality === 'perfect')) {
        fulfilled = true;
        feedbackText = 'Gà vàng giòn rụm đúng điệu, ngon mê ly!';
      }
      break;
    }
    case 'extra_sauce': {
      // Có món sốt hoặc khoai lắc hoặc gà sốt cay
      const hasSauceDish = servedItems.some(i => 
        i.menuItemId.includes('spicy') || 
        i.menuItemId.includes('shake') || 
        i.menuItemId.includes('garlic') || 
        i.menuItemId.includes('tokbokki') ||
        i.menuItemId.includes('popcorn')
      );
      if (hasSauceDish) {
        fulfilled = true;
        feedbackText = 'Sốt đậm đà thơm nức nở, quá đã!';
      }
      break;
    }
    case 'clean_oil_only': {
      // Chảo dầu lúc này phải là clean
      if (oilCondition === 'clean') {
        fulfilled = true;
        feedbackText = 'Dầu thơm trong vắt, ăn an tâm hẳn!';
      }
      break;
    }
    case 'side_pickle_pair': {
      // Có đồ chua hoặc phục vụ combo kèm món phụ
      const hasPickle = servedItems.some(i => 
        i.menuItemId.includes('danmuji') || 
        i.menuItemId.includes('coleslaw')
      );
      if (hasPickle || order.items.length >= 2) {
        fulfilled = true;
        feedbackText = 'Đồ ăn kèm giòn sần sật, giải ngấy số dzách!';
      }
      break;
    }
    case 'extra_chilled_drink': {
      // Có nước ngọt
      const hasDrink = servedItems.some(i => 
        i.menuItemId === 'soda' || 
        i.menuItemId === 'seven_up' || 
        i.menuItemId === 'fanta_orange' || 
        i.menuItemId === 'peach_tea'
      );
      if (hasDrink) {
        fulfilled = true;
        feedbackText = 'Nước ngọt lạnh buốt tê tái, đã khát thiệt sự!';
      }
      break;
    }
    case 'speedy_serve': {
      // Kiên nhẫn còn trên 50%
      if (patienceRemainingPercent >= 50) {
        fulfilled = true;
        feedbackText = 'Lên món thần tốc, đúng lúc tui đang vội!';
      }
      break;
    }
  }

  if (fulfilled) {
    return {
      fulfilled: true,
      bonusTip: pref.bonusTip,
      loyaltyExp: pref.loyaltyExp,
      feedbackText
    };
  }

  return {
    fulfilled: false,
    bonusTip: 0,
    loyaltyExp: 15, // Vẫn được điểm cơ bản vì đã phục vụ món
    feedbackText: ''
  };
}

/**
 * Danh mục Quà Quê Tiếp Tế độc quyền của 36 cư dân Hẻm 1102
 */
export const RESIDENT_GIFT_TEMPLATES: Record<string, Record<number, { giftType: AlleyGiftType; label: string; value: number; letter: string }>> = {
  char_02_lottery_lady: {
    2: {
      giftType: 'cash',
      label: 'Tờ Vé Số May Mắn',
      value: 68000,
      letter: 'Cô Bảy tặng con tờ vé số đài chiều nay, trúng số độc đắc đầu hẻm lấy hên nghen con!'
    },
    4: {
      giftType: 'reputation_boost',
      label: 'Lời Đồn Miệng Xóm Vé Số',
      value: 2,
      letter: 'Mỗi lần đi bán vé số cô đều kể tiệm gà của con cho cả xóm nghe, ai cũng khen nức nở!'
    }
  },
  char_03_helper_linh: {
    2: {
      giftType: 'inventory_stock',
      label: 'Hũ Bột Phô Mai Nhập Khẩu',
      value: 10,
      letter: 'Em Linh lén mua tặng anh/chị hũ phô mai lắc béo ngậy để làm khoai cho khách ruột nè!'
    },
    4: {
      giftType: 'oil_restore',
      label: 'Can Dầu Đậu Nành Tinh Khiết',
      value: 1,
      letter: 'Em phụ bếp gom tiền lương mua can dầu tặng quán mình, chúc quán lúc nào cũng đắt khách!'
    }
  },
  char_06_officer_nam: {
    2: {
      giftType: 'reputation_boost',
      label: 'Biên Bản An Ninh Khu Vực',
      value: 3,
      letter: 'Đồng chí Nam chứng nhận tiệm gà buôn bán trật tự, đảm bảo an ninh trật tự Hẻm 1102.'
    },
    4: {
      giftType: 'vip_attract',
      label: 'Giấy Giới Thiệu Cán Bộ Phường',
      value: 1,
      letter: 'Tôi có giới thiệu đoàn kiểm tra văn hóa phường ghé ủng hộ quán cuối tuần này nhé.'
    }
  },
  char_07_driver_tuan: {
    2: {
      giftType: 'cash',
      label: 'Tiền Tip Dành Dụm Của Shipper',
      value: 50000,
      letter: 'Tuấn Shipper tặng quán hộp khăn giấy và chút tiền tip chia vui vì quán ra đơn lẹ!'
    },
    4: {
      giftType: 'vip_attract',
      label: 'Đơn Đặt Nhóm Công Ty',
      value: 1,
      letter: 'Tuấn vừa rủ cả hội anh em tài xế công nghệ ghé mở tiệc tại quán chiều nay đó!'
    }
  },
  char_05_kid_bo: {
    2: {
      giftType: 'cash',
      label: 'Heo Đất Tiết Kiệm Của Bé Bo',
      value: 35000,
      letter: 'Bé Bo đập heo đất tặng chú/cô chủ quán vì gà rán ở đây giòn rụm ngon nhất trần đời!'
    },
    4: {
      giftType: 'inventory_stock',
      label: 'Rổ Khoai Tây Đà Lạt Của Mẹ Bo',
      value: 12,
      letter: 'Mẹ Bo gửi biếu quán rổ khoai tây tươi ngon mới chuyển từ quê lên làm quà cảm ơn!'
    }
  }
};

// Fallback quà chung cho các nhân vật chưa có template riêng
export function generateGenericAlleyGift(characterId: string, heartLevel: number): { giftType: AlleyGiftType; label: string; value: number; letter: string } {
  const char = CHARACTERS_36.find(c => c.id === characterId);
  const name = char ? char.name : 'Người Hẻm 1102';

  if (heartLevel === 2) {
    return {
      giftType: 'inventory_stock',
      label: 'Hộp Gia Vị Bí Truyền Quê Nhà',
      value: 8,
      letter: `${name} gửi biếu tiệm gói nguyên liệu tươi ngon chọn lọc từ quê lên, chúc quán phát tài!`
    };
  } else if (heartLevel === 4) {
    return {
      giftType: 'cash',
      label: 'Phong Bì Lì Xì Khách Quen',
      value: 88000,
      letter: `${name} gửi chút lộc may mắn đầu tháng cho quán gà ruột, mãi yêu hương vị của tiệm!`
    };
  } else {
    return {
      giftType: 'oil_restore',
      label: 'Can Dầu Thực Vật Tươi Sạch',
      value: 1,
      letter: `${name} biếu quán can dầu mới để tiệm luôn giữ được chảo dầu vàng óng thơm ngon!`
    };
  }
}

/**
 * Ghi nhận lượt ghé của khách và tích lũy Loyalty EXP
 */
export function recordCustomerLoyaltyVisit(
  state: CustomerLoyaltyState,
  characterId: string,
  currentDay: number,
  isPerfectServe: boolean,
  dietaryFulfilled: boolean,
  expGained: number
): { entry: CustomerLoyaltyEntry; leveledUp: boolean; newHeartLevel: number; newGift?: AlleyResidentGift } {
  let entry = state.residents[characterId];
  if (!entry) {
    entry = {
      characterId,
      heartLevel: 0,
      exp: 0,
      totalVisits: 0,
      perfectDishesServed: 0,
      specialRequestsFulfilled: 0,
      unlockedGifts: []
    };
    state.residents[characterId] = entry;
  }

  entry.totalVisits += 1;
  entry.lastVisitDay = currentDay;
  if (isPerfectServe) entry.perfectDishesServed += 1;
  if (dietaryFulfilled) entry.specialRequestsFulfilled += 1;

  const oldLevel = entry.heartLevel;
  entry.exp += expGained;
  const newLevel = calculateHeartLevel(entry.exp);
  entry.heartLevel = newLevel;

  let leveledUp = false;
  let newGift: AlleyResidentGift | undefined;

  if (newLevel > oldLevel) {
    leveledUp = true;
    // Kiểm tra xem mốc cấp độ mới có quà tiếp tế không (mốc 2, 4, 5)
    for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
      if ((lvl === 2 || lvl === 4 || lvl === 5) && !entry.unlockedGifts.includes(lvl)) {
        entry.unlockedGifts.push(lvl);
        
        const template = RESIDENT_GIFT_TEMPLATES[characterId]?.[lvl] || generateGenericAlleyGift(characterId, lvl);
        const char = CHARACTERS_36.find(c => c.id === characterId);
        const senderName = char ? char.name : 'Tri Kỷ Hẻm 1102';

        newGift = {
          id: `gift_${characterId}_lvl${lvl}_${Date.now()}`,
          characterId,
          senderName,
          day: currentDay + 1, // Sáng hôm sau nhận được
          heartLevel: lvl,
          giftType: template.giftType,
          giftLabel: template.label,
          giftValue: template.value,
          letterContent: template.letter,
          claimed: false
        };
        state.pendingAlleyGifts.push(newGift);
      }
    }
  }

  return {
    entry,
    leveledUp,
    newHeartLevel: newLevel,
    newGift
  };
}

/**
 * Nhận quà tiếp tế từ cư dân Hẻm 1102 và cộng tài nguyên vào GameState
 */
export function claimAlleyGift(state: GameState, giftId: string): { success: boolean; message: string } {
  const loyalty = ensureLoyaltyState(state);
  const giftIndex = loyalty.pendingAlleyGifts.findIndex(g => g.id === giftId);
  if (giftIndex === -1) {
    return { success: false, message: 'Không tìm thấy gói quà!' };
  }

  const gift = loyalty.pendingAlleyGifts[giftIndex];
  if (!gift) {
    return { success: false, message: 'Không tìm thấy gói quà!' };
  }
  gift.claimed = true;

  // Áp dụng phần thưởng vào GameState
  let rewardMessage = '';
  switch (gift.giftType) {
    case 'cash':
      state.money += gift.giftValue;
      rewardMessage = `Nhận được +${gift.giftValue.toLocaleString('vi-VN')}đ tiền mặt!`;
      break;
    case 'oil_restore':
      state.oilCondition = 'clean';
      state.oilBatchesCooked = 0;
      rewardMessage = `Chảo dầu đã được hồi phục vàng óng sạch sẽ (clean)!`;
      break;
    case 'inventory_stock': {
      // Tặng thịt gà hoặc bột chiên
      const itemKey = state.inventory['chicken_meat'] ? 'chicken_meat' : Object.keys(state.inventory)[0];
      if (itemKey && state.inventory[itemKey]) {
        state.inventory[itemKey].batches.push({ amount: gift.giftValue, daysLeft: 4 });
        state.inventory[itemKey].amount += gift.giftValue;
      }
      rewardMessage = `Nhận được +${gift.giftValue} phần nguyên liệu tươi mới!`;
      break;
    }
    case 'reputation_boost':
      state.ratings.overall = Math.min(5.0, Number((state.ratings.overall + 0.2).toFixed(2)));
      state.ratings.taste = Math.min(5.0, Number((state.ratings.taste + 0.2).toFixed(2)));
      rewardMessage = `Danh tiếng tiệm gà được tăng thêm +0.2★ trên MXH!`;
      break;
    case 'vip_attract':
      rewardMessage = `Khách quen sẽ rủ bạn bè ghé quán ủng hộ đông hơn!`;
      break;
  }

  // Chuyển sang lịch sử đã nhận
  loyalty.pendingAlleyGifts.splice(giftIndex, 1);
  loyalty.claimedAlleyGiftsHistory.push(gift);

  return {
    success: true,
    message: `${gift.giftLabel}: ${rewardMessage}`
  };
}
