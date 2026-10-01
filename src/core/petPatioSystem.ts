import { GameState, PetPatioState, PetPatioMember } from '../types/game';
import { ASSETS } from '../content/assets';

export const PATIO_UPGRADE_COSTS: Record<number, { cost: number; title: string; perk: string }> = {
  2: {
    cost: 250000,
    title: 'Chòi Gỗ Mái Ngói Vintage',
    perk: 'Khách đến quán thích thú ngắm thú cưng, tăng +10% tiền Tips!',
  },
  3: {
    cost: 600000,
    title: 'Biệt Thự Thú Cưng Hẻm 1102',
    perk: 'Check-in thú cưng cực hot, tăng +15% lượng khách ghé quán mỗi ngày!',
  },
};

/**
 * Lấy hoặc khởi tạo Góc Thú Cưng Hiên Quán
 */
export function getOrCreatePetPatio(state: GameState): PetPatioState {
  if (!state.petPatio) {
    const dog: PetPatioMember = {
      id: 'pet_01_dog_vang',
      name: 'Chó Vàng (Cậu Vàng Hẻm 1102)',
      type: 'dog',
      avatar: ASSETS.characters.pet_01_dog_vang,
      happiness: 80,
      pettedToday: false,
      statusText: 'Đang vẫy đuôi nằm canh hiên quán 🐕',
      perkDescription: 'Sủa vang báo động trộm trước 3s & giảm 30% tốc độ kim!',
    };

    const cat: PetPatioMember = {
      id: 'pet_02_cat_muop',
      name: 'Mèo Mướp (Bé Mướp Meo Meo)',
      type: 'cat',
      avatar: ASSETS.characters.pet_02_cat_muop,
      happiness: 85,
      pettedToday: false,
      statusText: 'Đang cuộn tròn ngủ trưa sưởi nắng 🐈',
      perkDescription: 'Bắt chuột cống ban đêm, bảo vệ 100% thùng dầu sạch!',
    };

    state.petPatio = {
      unlocked: true,
      patioLevel: 1,
      pets: [dog, cat],
      lastPettedDay: 0,
    };
  }

  // Tự động reset lượt vuốt ve sang ngày mới
  if (state.petPatio.lastPettedDay !== state.day) {
    state.petPatio.pets.forEach(p => {
      p.pettedToday = false;
      // Hạnh phúc hao hụt nhẹ theo ngày nếu không được quan tâm
      p.happiness = Math.max(30, p.happiness - 5);
    });
    state.petPatio.lastPettedDay = state.day;
  }

  return state.petPatio;
}

/**
 * Thao tác vuốt ve / xoa đầu thú cưng (Petting Interaction)
 */
export function petThePet(
  state: GameState,
  petId: 'pet_01_dog_vang' | 'pet_02_cat_muop'
): { success: boolean; message: string; happinessGain: number; sound: string } {
  const patio = getOrCreatePetPatio(state);
  const pet = patio.pets.find(p => p.id === petId);

  if (!pet) {
    return { success: false, message: 'Không tìm thấy bé thú cưng!', happinessGain: 0, sound: 'pop' };
  }

  if (pet.pettedToday) {
    return {
      success: false,
      message: `${pet.name} đã được cưng nựng no nê hôm nay rồi! Hãy quay lại vào ngày mai nhé~`,
      happinessGain: 0,
      sound: 'pop',
    };
  }

  pet.pettedToday = true;
  const happinessGain = 20;
  pet.happiness = Math.min(100, pet.happiness + happinessGain);

  // Tăng điểm Karma Tình Thân Hẻm
  if (state.karma) {
    state.karma.community = Math.min(100, (state.karma.community || 50) + 2);
  }

  if (pet.type === 'dog') {
    pet.statusText = 'Sung sướng vẫy tít đuôi, dụi đầu vào tay bạn sủa "Gâu gâu!" ❤️';
    return {
      success: true,
      message: `Bạn đã xoa đầu ${pet.name}! Bé vẫy đuôi tít mù mừng rỡ (+${happinessGain}% Hạnh phúc, +2 Tình Thân Hẻm)!`,
      happinessGain,
      sound: 'dog_bark',
    };
  } else {
    pet.statusText = 'Nằm ngửa bụng rừ rừ thỏa mãn, khẽ liếm ngón tay bạn "Meo meo~" 🐾';
    return {
      success: true,
      message: `Bạn đã gãi cằm ${pet.name}! Bé cất tiếng rừ rừ nũng nịu (+${happinessGain}% Hạnh phúc, +2 Tình Thân Hẻm)!`,
      happinessGain,
      sound: 'cat_purr',
    };
  }
}

/**
 * Nâng cấp Góc Hiên Thú Cưng
 */
export function upgradePetPatio(state: GameState): { success: boolean; message: string } {
  const patio = getOrCreatePetPatio(state);
  const nextLevel = patio.patioLevel + 1;
  const upgradeInfo = PATIO_UPGRADE_COSTS[nextLevel];

  if (!upgradeInfo) {
    return { success: false, message: 'Góc hiên thú cưng đã đạt cấp độ tối đa!' };
  }

  if (state.money < upgradeInfo.cost) {
    return {
      success: false,
      message: `Không đủ tiền nâng cấp! Cần ${upgradeInfo.cost.toLocaleString('vi-VN')}đ.`,
    };
  }

  state.money -= upgradeInfo.cost;
  patio.patioLevel = nextLevel;
  patio.pets.forEach(p => (p.happiness = 100)); // Thú cưng cực vui khi có nhà mới

  return {
    success: true,
    message: `Đã nâng cấp lên "${upgradeInfo.title}"! ${upgradeInfo.perk}`,
  };
}

/**
 * Kiểm tra hiệu ứng Chó Vàng trợ chiến bắt trộm
 */
export function checkDogGuardBonus(state: GameState): { hasDogBonus: boolean; extraSeconds: number; alertText: string } {
  const patio = getOrCreatePetPatio(state);
  const dog = patio.pets.find(p => p.id === 'pet_01_dog_vang');

  if (dog && dog.happiness >= 50) {
    return {
      hasDogBonus: true,
      extraSeconds: 3, // Thêm 3 giây thời gian bắt
      alertText: '🐕 Cậu Vàng sủa vang hẻm: "Gâu gâu gâu!" - Tên trộm giật mình chùn bước (+3s phản xạ)!',
    };
  }

  return { hasDogBonus: false, extraSeconds: 0, alertText: '' };
}

/**
 * Kiểm tra Mèo Mướp canh gác chuột cống
 */
export function checkCatPestDefense(state: GameState): { hasCatDefense: boolean; message: string } {
  const patio = getOrCreatePetPatio(state);
  const cat = patio.pets.find(p => p.id === 'pet_02_cat_muop');

  if (cat && cat.happiness >= 50) {
    return {
      hasCatDefense: true,
      message: '🐈 Bé Mướp dũng cảm vồ gọn chuột cống trong đêm, kho dầu chiên an toàn 100%!',
    };
  }

  return { hasCatDefense: false, message: '' };
}
