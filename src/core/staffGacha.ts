import { GameState, StaffRarity, StaffRole } from '../types/game';
import { GachaStaffCandidate, getStaffPoolByRarity } from '../content/gachaStaffPool';

export const GACHA_PRICES = {
  SINGLE_ROLL: 200000,   // 200.000đ (x5: Phát tờ rơi tuyển dụng - Ra 3 ứng viên chọn 1)
  TEN_ROLL: 1800000      // 1.800.000đ (x5: Đăng tin sàn tuyển dụng VIP - Ra 10 ứng viên chọn 1, bảo hiểm 1 SR+)
};

export const GACHA_RATES = {
  SSR: 0.015,  // 1.5%
  SR: 0.105,   // 10.5%
  R: 0.280,    // 28.0%
  C: 0.600     // 60.0%
};

export const PITY_CONFIG = {
  SOFT_PITY_THRESHOLD: 10,  // Sau 10 roll không có SR+ -> Đảm bảo SR+
  HARD_PITY_THRESHOLD: 50   // Sau 50 roll không có SSR -> Đảm bảo SSR
};

export interface GachaRollResult {
  candidates: GachaStaffCandidate[];
  cost: number;
  rollType: 'single' | 'ten';
  newSoftPity: number;
  newHardPity: number;
  hasSsr: boolean;
  hasSr: boolean;
}

/**
 * Xác định độ hiếm cho 1 lượt roll dựa trên tỷ lệ và bộ đếm Pity
 */
export function determineRarity(
  softPity: number,
  hardPity: number,
  guaranteedMinRarity?: StaffRarity,
  customRand?: () => number
): StaffRarity {
  const rand = customRand ? customRand() : Math.random();

  // 1. Ưu tiên Hard Pity: Đạt mốc 50 roll chưa có SSR -> 100% SSR
  if (hardPity >= PITY_CONFIG.HARD_PITY_THRESHOLD - 1) {
    return 'SSR';
  }

  // 2. Nếu có yêu cầu tối thiểu SSR
  if (guaranteedMinRarity === 'SSR') {
    return 'SSR';
  }

  // 3. Nếu kích hoạt Soft Pity (10 roll) hoặc có yêu cầu tối thiểu SR
  if (softPity >= PITY_CONFIG.SOFT_PITY_THRESHOLD - 1 || guaranteedMinRarity === 'SR') {
    // Trong bảo hiểm SR+, vẫn có 12.5% cơ hội nâng cấp lên SSR (1.5 / (1.5 + 10.5))
    if (rand < 0.125) {
      return 'SSR';
    }
    return 'SR';
  }

  // 4. Roll thông thường theo tỷ lệ chuẩn
  if (rand < GACHA_RATES.SSR) {
    return 'SSR';
  } else if (rand < GACHA_RATES.SSR + GACHA_RATES.SR) {
    return 'SR';
  } else if (rand < GACHA_RATES.SSR + GACHA_RATES.SR + GACHA_RATES.R) {
    return 'R';
  } else {
    return 'C';
  }
}

/**
 * Sinh 1 ứng viên cụ thể từ pool tương ứng với độ hiếm, có biến thiên chỉ số nhẹ
 */
export function generateCandidateFromPool(
  rarity: StaffRarity,
  preferredRole?: StaffRole,
  customRand?: () => number
): GachaStaffCandidate {
  let pool = getStaffPoolByRarity(rarity);
  if (preferredRole) {
    const rolePool = pool.filter(c => c.role === preferredRole);
    if (rolePool.length > 0) pool = rolePool;
  }
  if (!pool || pool.length === 0) {
    pool = getStaffPoolByRarity('C');
  }

  const randFn = customRand || Math.random;
  const idx = Math.floor(randFn() * pool.length);
  const template: GachaStaffCandidate = pool[idx] || pool[0]!;

  // Biến thiên nhẹ chỉ số +/- 2 điểm tạo nét riêng biệt
  const delta = () => Math.floor(randFn() * 5) - 2;

  const candidate: GachaStaffCandidate = {
    id: `staff_gacha_${Date.now()}_${Math.floor(randFn() * 10000)}`,
    name: template.name,
    role: template.role,
    avatar: template.avatar,
    hourlyWage: template.hourlyWage,
    traits: [...template.traits],
    rarity: template.rarity,
    stars: template.stars,
    title: template.title,
    laziness: template.laziness,
    errorRate: template.errorRate,
    passiveName: template.passiveName,
    passiveDesc: template.passiveDesc,
    quote: template.quote,
    modelAsset: template.modelAsset,
    speed: Math.max(40, Math.min(99, template.speed + delta())),
    skill: Math.max(40, Math.min(99, template.skill + delta())),
    attitude: Math.max(50, Math.min(100, template.attitude + delta())),
    stamina: Math.max(40, Math.min(100, template.stamina + delta())),
    mood: 100,
    shiftsWorked: 0
  };

  return candidate;
}

/**
 * Thực hiện lượt tuyển dụng 1 Roll (Phát tờ rơi - 40.000đ):
 * Sinh ra 3 ứng viên với độ hiếm ngẫu nhiên để người chơi chọn 1
 */
export function performGachaRollSingle(
  state: GameState,
  customRand?: () => number
): { success: boolean; result?: GachaRollResult; error?: string } {
  if (state.money < GACHA_PRICES.SINGLE_ROLL) {
    return { success: false, error: 'Không đủ 200.000đ để phát tờ rơi tuyển dụng!' };
  }

  let softPity = state.staffGachaPity || 0;
  let hardPity = state.staffGachaSsrPity || 0;
  const candidates: GachaStaffCandidate[] = [];

  // Tạo 3 ứng viên cho người chơi lựa chọn
  for (let i = 0; i < 3; i++) {
    const rarity = determineRarity(softPity, hardPity, undefined, customRand);
    const candidate = generateCandidateFromPool(rarity, undefined, customRand);
    candidates.push(candidate);
  }

  // Cập nhật bộ đếm Pity dựa trên lá bài cao nhất roll được
  const hasSsr = candidates.some(c => c.rarity === 'SSR');
  const hasSr = candidates.some(c => c.rarity === 'SR');

  if (hasSsr) {
    hardPity = 0;
    softPity = 0;
  } else if (hasSr) {
    softPity = 0;
    hardPity += 1;
  } else {
    softPity += 1;
    hardPity += 1;
  }

  // Trừ tiền và cập nhật state
  state.money -= GACHA_PRICES.SINGLE_ROLL;
  state.staffGachaPity = softPity;
  state.staffGachaSsrPity = hardPity;
  state.staffGachaTotalRolls = (state.staffGachaTotalRolls || 0) + 1;

  return {
    success: true,
    result: {
      candidates,
      cost: GACHA_PRICES.SINGLE_ROLL,
      rollType: 'single',
      newSoftPity: softPity,
      newHardPity: hardPity,
      hasSsr,
      hasSr
    }
  };
}

/**
 * Thực hiện lượt tuyển dụng 10 Roll (Đăng tin báo lớn - 360.000đ):
 * Sinh ra 10 ứng viên (cam kết có ít nhất 1 SR+) để người chơi chọn 1
 */
export function performGachaRollTen(
  state: GameState,
  customRand?: () => number
): { success: boolean; result?: GachaRollResult; error?: string } {
  if (state.money < GACHA_PRICES.TEN_ROLL) {
    return { success: false, error: 'Không đủ 1.800.000đ để đăng tin sàn tuyển dụng lớn!' };
  }

  let softPity = state.staffGachaPity || 0;
  let hardPity = state.staffGachaSsrPity || 0;
  const candidates: GachaStaffCandidate[] = [];

  // Roll 9 lá đầu bình thường
  for (let i = 0; i < 9; i++) {
    const rarity = determineRarity(softPity, hardPity, undefined, customRand);
    const candidate = generateCandidateFromPool(rarity, undefined, customRand);
    candidates.push(candidate);
    
    if (rarity === 'SSR') {
      hardPity = 0;
      softPity = 0;
    } else if (rarity === 'SR') {
      softPity = 0;
      hardPity += 1;
    } else {
      softPity += 1;
      hardPity += 1;
    }
  }

  // Lá thứ 10: Bảo đảm tối thiểu 1 SR+ nếu 9 lá trước chưa có SR+ nào
  const hasSrOrSsr = candidates.some(c => c.rarity === 'SR' || c.rarity === 'SSR');
  const tenthRarity = determineRarity(
    softPity,
    hardPity,
    hasSrOrSsr ? undefined : 'SR',
    customRand
  );
  const tenthCandidate = generateCandidateFromPool(tenthRarity, undefined, customRand);
  candidates.push(tenthCandidate);

  if (tenthRarity === 'SSR') {
    hardPity = 0;
    softPity = 0;
  } else if (tenthRarity === 'SR') {
    softPity = 0;
    hardPity += 1;
  } else {
    softPity += 1;
    hardPity += 1;
  }

  // Trừ tiền và cập nhật state
  state.money -= GACHA_PRICES.TEN_ROLL;
  state.staffGachaPity = softPity;
  state.staffGachaSsrPity = hardPity;
  state.staffGachaTotalRolls = (state.staffGachaTotalRolls || 0) + 10;

  return {
    success: true,
    result: {
      candidates,
      cost: GACHA_PRICES.TEN_ROLL,
      rollType: 'ten',
      newSoftPity: softPity,
      newHardPity: hardPity,
      hasSsr: candidates.some(c => c.rarity === 'SSR'),
      hasSr: candidates.some(c => c.rarity === 'SR')
    }
  };
}

/**
 * Người chơi chọn 1 ứng viên để ký hợp đồng chính thức
 */
export function hireGachaCandidate(
  state: GameState,
  candidate: GachaStaffCandidate
): { success: boolean; staff?: GachaStaffCandidate; error?: string } {
  if (!state.staff) state.staff = [];

  // Giới hạn số lượng nhân viên tối đa của tiệm (ví dụ 8 nhân viên)
  if (state.staff.length >= 8) {
    return { success: false, error: 'Tiệm đã đủ tối đa 8 nhân viên! Hãy sa thải bớt nhân sự cũ trước.' };
  }

  // Ký hợp đồng: thêm vào danh sách nhân sự
  state.staff.push(candidate);
  if (!state.gachaPullsHistory) state.gachaPullsHistory = [];
  state.gachaPullsHistory.push(candidate.id);

  return { success: true, staff: candidate };
}

/**
 * Hàm mô phỏng N lượt roll để kiểm chứng xác suất phân phối và cân bằng kinh tế
 */
export function runGachaSimulation(rollsCount: number, customSeed?: number) {
  let seed = customSeed || 123456789;
  const pseudoRand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const counts = { C: 0, R: 0, SR: 0, SSR: 0 };
  let softPity = 0;
  let hardPity = 0;

  for (let i = 0; i < rollsCount; i++) {
    const rarity = determineRarity(softPity, hardPity, undefined, pseudoRand);
    counts[rarity]++;

    if (rarity === 'SSR') {
      hardPity = 0;
      softPity = 0;
    } else if (rarity === 'SR') {
      softPity = 0;
      hardPity++;
    } else {
      softPity++;
      hardPity++;
    }
  }

  return {
    totalRolls: rollsCount,
    counts,
    percentages: {
      C: ((counts.C / rollsCount) * 100).toFixed(2) + '%',
      R: ((counts.R / rollsCount) * 100).toFixed(2) + '%',
      SR: ((counts.SR / rollsCount) * 100).toFixed(2) + '%',
      SSR: ((counts.SSR / rollsCount) * 100).toFixed(2) + '%'
    }
  };
}
