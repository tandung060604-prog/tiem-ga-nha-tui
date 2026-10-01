import { EndlessRunRecord, EndlessRunState, EndlessWaveConfig, GameState } from '../types/game';

/**
 * Cấu hình độ khó cho từng Làn Sóng Khách Ca Đêm (Endless Wave)
 */
export function getWaveConfig(wave: number): EndlessWaveConfig {
  const safeWave = Math.max(1, wave);
  const customerCount = Math.min(16, 4 + safeWave * 2);
  const orderComplexity = Math.min(4, 1 + Math.floor(safeWave / 3));
  const patienceMultiplier = Math.max(0.55, +(1.0 - (safeWave - 1) * 0.035).toFixed(2));
  const targetScore = safeWave * 1500;

  return {
    wave: safeWave,
    customerCount,
    orderComplexity,
    patienceMultiplier,
    targetScore,
  };
}

/**
 * Lấy hoặc khởi tạo kỷ lục Ca Đêm Bất Tận
 */
export function getEndlessRecord(state: GameState): EndlessRunRecord {
  if (!state.endlessRecord) {
    state.endlessRecord = {
      highScore: 0,
      highestWave: 1,
      totalCustomersServed: 0,
      totalPerfectServes: 0,
      totalRuns: 0,
    };
  }
  return state.endlessRecord;
}

/**
 * Kiểm tra điều kiện mở khóa Ca Đêm Bất Tận (từ Ngày 4 hoặc Chương 2)
 */
export function canEnterEndlessMode(state: GameState): { canEnter: boolean; reason?: string } {
  if (state.day < 4 && state.currentChapter < 2) {
    return {
      canEnter: false,
      reason: 'Ca Đêm Bất Tận mở khóa khi bạn đạt Ngày 4 hoặc bước sang Chương 2!',
    };
  }
  return { canEnter: true };
}

/**
 * Khởi tạo một phiên chạy Ca Đêm Bất Tận mới
 */
export function createEndlessRun(): EndlessRunState {
  return {
    currentWave: 1,
    score: 0,
    comboStreak: 0,
    customersServedThisWave: 0,
    customersFailedThisWave: 0,
    maxFailedAllowed: 3,
    isGameOver: false,
    totalMoneyEarned: 0,
  };
}

/**
 * Xử lý khi phục vụ thành công một khách trong Ca Đêm
 */
export function recordEndlessServe(
  runState: EndlessRunState,
  isPerfect: boolean,
  orderPaid: number = 25000
): { pointsEarned: number; newWaveUnlocked: boolean } {
  if (runState.isGameOver) {
    return { pointsEarned: 0, newWaveUnlocked: false };
  }

  // Điểm cơ bản theo wave + điểm combo Perfect liên hoàn
  const basePoints = 100 * runState.currentWave;
  const comboBonus = runState.comboStreak * 30;
  const perfectBonus = isPerfect ? 150 * runState.currentWave : 0;
  const comboMultiplier = 1 + Math.min(2.5, runState.comboStreak * 0.15);

  const pointsEarned = Math.round((basePoints + comboBonus + perfectBonus) * comboMultiplier);
  runState.score += pointsEarned;

  if (isPerfect) {
    runState.comboStreak += 1;
  } else {
    // Không perfect thì duy trì combo nhưng không cộng dồn thêm
    runState.comboStreak = Math.max(0, runState.comboStreak);
  }

  runState.customersServedThisWave += 1;
  runState.totalMoneyEarned += Math.round(orderPaid * 0.6); // 60% doanh số chuyển thành tiền mặt

  const config = getWaveConfig(runState.currentWave);
  let newWaveUnlocked = false;

  // Đủ chỉ tiêu khách của wave -> chuyển sang wave tiếp theo
  if (runState.customersServedThisWave >= config.customerCount) {
    runState.currentWave += 1;
    runState.customersServedThisWave = 0;
    runState.customersFailedThisWave = 0;
    newWaveUnlocked = true;
  }

  return { pointsEarned, newWaveUnlocked };
}

/**
 * Xử lý khi khách hết kiên nhẫn bỏ về trong Ca Đêm
 */
export function recordEndlessMiss(runState: EndlessRunState): { isGameOver: boolean } {
  if (runState.isGameOver) return { isGameOver: true };

  // Đứt chuỗi combo
  runState.comboStreak = 0;
  runState.customersFailedThisWave += 1;

  if (runState.customersFailedThisWave >= runState.maxFailedAllowed) {
    runState.isGameOver = true;
    return { isGameOver: true };
  }

  return { isGameOver: false };
}

/**
 * Kết thúc lượt chơi Ca Đêm và kết toán kỷ lục vào GameState
 */
export function finishEndlessRun(
  state: GameState,
  runState: EndlessRunState
): {
  rewardMoney: number;
  finalScore: number;
  finalWave: number;
  isNewHighScore: boolean;
  isNewHighestWave: boolean;
} {
  const record = getEndlessRecord(state);

  const isNewHighScore = runState.score > record.highScore;
  const isNewHighestWave = runState.currentWave > record.highestWave;

  if (isNewHighScore) {
    record.highScore = runState.score;
  }
  if (isNewHighestWave) {
    record.highestWave = runState.currentWave;
  }

  record.totalRuns += 1;
  record.lastPlayedDay = state.day;

  // Cộng tiền thưởng vào ví tiệm
  const rewardMoney = runState.totalMoneyEarned;
  state.money += rewardMoney;

  return {
    rewardMoney,
    finalScore: runState.score,
    finalWave: runState.currentWave,
    isNewHighScore,
    isNewHighestWave,
  };
}
