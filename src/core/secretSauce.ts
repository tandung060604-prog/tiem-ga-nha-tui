import { SpiceId, SauceSpice, SecretSauceDayState } from '../types/game';

// Danh sách 5 gia vị tuyển chọn cho Nồi Sốt Bí Truyền Hẻm 1102
export const SAUCE_SPICES: readonly SauceSpice[] = [
  { id: 'garlic', name: 'Tỏi Băm Lý Sơn', shortName: 'Tỏi Băm', icon: '🧄', color: '#fef08a', tag: 'Dậy Mùi' },
  { id: 'honey', name: 'Mật Ong Rừng Tràm', shortName: 'Mật Ong', icon: '🍯', color: '#fde047', tag: 'Sánh Mịn' },
  { id: 'chili', name: 'Ớt Bay Cay Xè', shortName: 'Ớt Bay', icon: '🌶️', color: '#f87171', tag: 'Bùng Nổ' },
  { id: 'soy', name: 'Tương Đen Gia Truyền', shortName: 'Tương Đen', icon: '🥢', color: '#cbd5e1', tag: 'Đậm Đà' },
  { id: 'sesame', name: 'Mè Rang Vàng Giòn', shortName: 'Mè Rang', icon: '✨', color: '#fed7aa', tag: 'Bùi Béo' }
] as const;

export const SPICE_MAP: Readonly<Record<SpiceId, SauceSpice>> = {
  garlic: SAUCE_SPICES[0]!,
  honey: SAUCE_SPICES[1]!,
  chili: SAUCE_SPICES[2]!,
  soy: SAUCE_SPICES[3]!,
  sesame: SAUCE_SPICES[4]!
};

export const SECRET_SAUCE_BUFF = {
  name: 'Sốt Hoàng Kim Hẻm 1102',
  tag: '🍲✨ SỐT THẦN THÁNH',
  tipBonus: 3000,
  tasteRatingBonus: 0.25,
  previewDurationSec: 3.5,
  inputTimeoutSec: 12.0,
  minRecipeLength: 4
};

/**
 * Sinh công thức sốt bí truyền của ngày:
 * - Dựa trên ngày và chương (đảm bảo mỗi ngày có 1 công thức riêng biệt)
 * - Độ dài: 4 bước
 * - Không để 2 nguyên liệu giống nhau đứng cạnh nhau để người chơi ghi nhớ nhịp điệu tốt nhất
 */
export function generateDailySauceRecipe(day: number, chapter: number = 1): SpiceId[] {
  const spices: SpiceId[] = ['garlic', 'honey', 'chili', 'soy', 'sesame'];
  const recipe: SpiceId[] = [];
  const length = SECRET_SAUCE_BUFF.minRecipeLength;

  let seed = Math.abs(Math.sin(day * 997 + chapter * 31)) * 10000;

  for (let i = 0; i < length; i++) {
    const available = recipe.length > 0
      ? spices.filter(s => s !== recipe[recipe.length - 1])
      : spices;
    const idx = Math.floor((seed * (i + 1) * 7.919) % available.length);
    const chosen = available[idx] ?? 'garlic';
    recipe.push(chosen);
    seed = (seed * 9301 + 49297) % 233280;
  }

  return recipe;
}

export interface StepValidationResult {
  isCorrect: boolean;
  isComplete: boolean;
  isFailed: boolean;
  currentIndex: number;
  totalRequired: number;
}

/**
 * Kiểm tra bước nạp gia vị của người chơi
 */
export function validateSauceInput(recipe: readonly SpiceId[], currentInputs: readonly SpiceId[]): StepValidationResult {
  const currentIndex = currentInputs.length - 1;
  const totalRequired = recipe.length;

  if (currentIndex < 0) {
    return { isCorrect: true, isComplete: false, isFailed: false, currentIndex: 0, totalRequired };
  }

  // Kiểm tra bước vừa nhấn có khớp với công thức không
  const lastInput = currentInputs[currentIndex];
  const expected = recipe[currentIndex];

  if (lastInput !== expected) {
    return {
      isCorrect: false,
      isComplete: false,
      isFailed: true,
      currentIndex,
      totalRequired
    };
  }

  const isComplete = currentInputs.length === recipe.length;
  return {
    isCorrect: true,
    isComplete,
    isFailed: false,
    currentIndex: currentInputs.length,
    totalRequired
  };
}

/**
 * Khởi tạo hoặc lấy trạng thái Sốt Bí Truyền của ngày
 */
export function getOrCreateSauceDayState(current: SecretSauceDayState | null | undefined, day: number, chapter: number = 1): SecretSauceDayState {
  if (current && current.day === day) {
    return current;
  }
  return {
    day,
    recipe: generateDailySauceRecipe(day, chapter),
    completed: false,
    success: false,
    buffActive: false,
    tipsEarnedToday: 0
  };
}
