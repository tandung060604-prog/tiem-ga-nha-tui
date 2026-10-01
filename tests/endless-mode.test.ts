import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../src/core/state';
import {
  getWaveConfig,
  getEndlessRecord,
  canEnterEndlessMode,
  createEndlessRun,
  recordEndlessServe,
  recordEndlessMiss,
  finishEndlessRun
} from '../src/core/endlessMode';
import { renderEndlessModeModal } from '../src/ui/components/EndlessModeModal';
import { GameState } from '../src/types/game';

describe('Trụ Cột 5: Chế Độ Ca Đêm Bất Tận (Endless Rush Hour Challenge)', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  it('1. getWaveConfig mở rộng quy mô khách và giảm thời gian kiên nhẫn khi Wave tăng dần', () => {
    const wave1 = getWaveConfig(1);
    const wave5 = getWaveConfig(5);
    const wave10 = getWaveConfig(10);

    expect(wave1.customerCount).toBe(6); // 4 + 1*2
    expect(wave5.customerCount).toBe(14); // 4 + 5*2
    expect(wave10.customerCount).toBe(16); // capped at 16

    // Tốc độ tụt kiên nhẫn tăng lên (patienceMultiplier nhỏ hơn)
    expect(wave5.patienceMultiplier).toBeLessThan(wave1.patienceMultiplier);
    expect(wave10.patienceMultiplier).toBeLessThan(wave5.patienceMultiplier);

    // Điểm chỉ tiêu tăng dần theo wave
    expect(wave10.targetScore).toBeGreaterThan(wave1.targetScore);
  });

  it('2. canEnterEndlessMode yêu cầu tối thiểu Ngày 4 hoặc Chương 2 để tham gia', () => {
    state.day = 1;
    state.currentChapter = 1;
    const checkLocked = canEnterEndlessMode(state);
    expect(checkLocked.canEnter).toBe(false);
    expect(checkLocked.reason).toContain('Ngày 4');

    // Đạt Ngày 4
    state.day = 4;
    expect(canEnterEndlessMode(state).canEnter).toBe(true);

    // Ngày 2 nhưng đã lên Chương 2
    state.day = 2;
    state.currentChapter = 2;
    expect(canEnterEndlessMode(state).canEnter).toBe(true);
  });

  it('3. createEndlessRun khởi tạo lượt chơi chuẩn mực', () => {
    const run = createEndlessRun();
    expect(run.currentWave).toBe(1);
    expect(run.score).toBe(0);
    expect(run.comboStreak).toBe(0);
    expect(run.customersFailedThisWave).toBe(0);
    expect(run.maxFailedAllowed).toBe(3);
    expect(run.isGameOver).toBe(false);
  });

  it('4. recordEndlessServe cộng dồn điểm, tích lũy combo và tự động lên wave khi đủ khách', () => {
    const run = createEndlessRun();
    const config1 = getWaveConfig(1);

    // Phục vụ khách 1 Perfect
    const serve1 = recordEndlessServe(run, true, 30000);
    expect(serve1.pointsEarned).toBeGreaterThan(0);
    expect(run.comboStreak).toBe(1);
    expect(run.score).toBe(serve1.pointsEarned);
    expect(run.totalMoneyEarned).toBe(18000); // 60% của 30k

    // Phục vụ khách 2 Perfect (combo x1.15)
    const serve2 = recordEndlessServe(run, true, 30000);
    expect(run.comboStreak).toBe(2);
    expect(serve2.pointsEarned).toBeGreaterThan(serve1.pointsEarned);

    // Phục vụ thêm cho đủ chỉ tiêu wave 1
    for (let i = 2; i < config1.customerCount - 1; i++) {
      recordEndlessServe(run, true, 30000);
    }

    // Khách cuối cùng của wave 1
    const lastServe = recordEndlessServe(run, true, 30000);
    expect(lastServe.newWaveUnlocked).toBe(true);
    expect(run.currentWave).toBe(2);
    expect(run.customersServedThisWave).toBe(0);
  });

  it('5. recordEndlessMiss cắt combo và kích hoạt Game Over sau 3 lần trượt', () => {
    const run = createEndlessRun();
    run.comboStreak = 5;

    // Miss lần 1: đứt combo
    const miss1 = recordEndlessMiss(run);
    expect(miss1.isGameOver).toBe(false);
    expect(run.comboStreak).toBe(0);
    expect(run.customersFailedThisWave).toBe(1);

    // Miss lần 2
    recordEndlessMiss(run);
    expect(run.customersFailedThisWave).toBe(2);

    // Miss lần 3: Game Over
    const miss3 = recordEndlessMiss(run);
    expect(miss3.isGameOver).toBe(true);
    expect(run.isGameOver).toBe(true);
  });

  it('6. finishEndlessRun ghi nhận kỷ lục cá nhân mới và cộng tiền thưởng vào GameState', () => {
    const run = createEndlessRun();
    run.score = 15400;
    run.currentWave = 4;
    run.totalMoneyEarned = 120000;

    const initialMoney = state.money;
    const finish = finishEndlessRun(state, run);

    expect(finish.isNewHighScore).toBe(true);
    expect(finish.isNewHighestWave).toBe(true);
    expect(finish.rewardMoney).toBe(120000);
    expect(state.money).toBe(initialMoney + 120000);

    const record = getEndlessRecord(state);
    expect(record.highScore).toBe(15400);
    expect(record.highestWave).toBe(4);
    expect(record.totalRuns).toBe(1);
  });

  it('7. renderEndlessModeModal render giao diện Arcade Neon sống động và nút tham gia', () => {
    state.day = 5;
    const record = getEndlessRecord(state);
    record.highScore = 28500;
    record.highestWave = 6;

    const html = renderEndlessModeModal(state);
    expect(html).toContain('modal-endless-mode');
    expect(html).toContain('CA ĐÊM BẤT TẬN');
    expect(html).toContain('28.500');
    expect(html).toContain('WAVE 6');
    expect(html).toContain('btn-start-endless-run');
  });
});
