import { describe, it, expect } from 'vitest';
import { GACHA_STAFF_POOL, getStaffPoolByRole, getStaffPoolByRarity } from '../src/content/gachaStaffPool';
import {
  determineRarity,
  generateCandidateFromPool,
  performGachaRollSingle,
  performGachaRollTen,
  hireGachaCandidate,
  runGachaSimulation,
  GACHA_PRICES
} from '../src/core/staffGacha';
import { createInitialState } from '../src/core/state';
import { StaffRole } from '../src/types/game';
import { staffImage } from '../src/content/assets';

describe('Staff Gacha System - Comprehensive Tests', () => {
  it('phải có đúng 72 model nhân vật chia đều cho 6 vai trò (mỗi vai trò 12 model)', () => {
    expect(GACHA_STAFF_POOL.length).toBe(72);

    const roles: StaffRole[] = ['cook', 'waiter', 'cashier', 'delivery', 'manager', 'security'];
    roles.forEach(role => {
      const staffInRole = getStaffPoolByRole(role);
      expect(staffInRole.length).toBe(12);

      const cCount = staffInRole.filter(s => s.rarity === 'C').length;
      const rCount = staffInRole.filter(s => s.rarity === 'R').length;
      const srCount = staffInRole.filter(s => s.rarity === 'SR').length;
      const ssrCount = staffInRole.filter(s => s.rarity === 'SSR').length;

      expect(cCount).toBe(4);
      expect(rCount).toBe(4);
      expect(srCount).toBe(3);
      expect(ssrCount).toBe(1);
    });
  });

  it('phải có tổng cộng 24 Common, 24 Rare, 18 Super Rare, và 6 SSR trên toàn bộ pool', () => {
    const cList = getStaffPoolByRarity('C');
    const rList = getStaffPoolByRarity('R');
    const srList = getStaffPoolByRarity('SR');
    const ssrList = getStaffPoolByRarity('SSR');

    expect(cList.length).toBe(24);
    expect(rList.length).toBe(24);
    expect(srList.length).toBe(18);
    expect(ssrList.length).toBe(6);
  });

  it('các chỉ số phải tuân thủ nghiêm ngặt bậc xếp hạng độ hiếm (độ lười, làm sai, lương, tốc độ)', () => {
    GACHA_STAFF_POOL.forEach(s => {
      expect(s.title).toBeDefined();
      expect(s.quote).toBeDefined();
      expect(s.passiveName).toBeDefined();
      expect(s.passiveDesc).toBeDefined();

      if (s.rarity === 'C') {
        expect(s.stars).toBe(1);
        expect(s.hourlyWage).toBeGreaterThanOrEqual(15000);
        expect(s.hourlyWage).toBeLessThanOrEqual(18000);
        expect(s.laziness).toBeGreaterThanOrEqual(15);
        expect(s.laziness).toBeLessThanOrEqual(30);
        expect(s.errorRate).toBeGreaterThanOrEqual(10);
        expect(s.errorRate).toBeLessThanOrEqual(20);
        expect(s.speed).toBeLessThan(65);
      } else if (s.rarity === 'R') {
        expect(s.stars).toBe(2);
        expect(s.hourlyWage).toBeGreaterThanOrEqual(20000);
        expect(s.hourlyWage).toBeLessThanOrEqual(28000);
        expect(s.laziness).toBeGreaterThanOrEqual(5);
        expect(s.laziness).toBeLessThanOrEqual(12);
        expect(s.errorRate).toBeGreaterThanOrEqual(3);
        expect(s.errorRate).toBeLessThanOrEqual(8);
        expect(s.speed).toBeGreaterThanOrEqual(65);
      } else if (s.rarity === 'SR') {
        expect(s.stars).toBe(3);
        expect(s.hourlyWage).toBeGreaterThanOrEqual(35000);
        expect(s.hourlyWage).toBeLessThanOrEqual(48000);
        expect(s.laziness).toBeGreaterThanOrEqual(1);
        expect(s.laziness).toBeLessThanOrEqual(4);
        expect(s.errorRate).toBeGreaterThanOrEqual(0);
        expect(s.errorRate).toBeLessThanOrEqual(2);
        expect(s.speed).toBeGreaterThanOrEqual(85);
      } else if (s.rarity === 'SSR') {
        expect(s.stars).toBe(5);
        expect(s.hourlyWage).toBeGreaterThanOrEqual(65000);
        expect(s.hourlyWage).toBeLessThanOrEqual(90000);
        expect(s.laziness).toBe(0);
        expect(s.errorRate).toBe(0);
        expect(s.speed).toBeGreaterThanOrEqual(95);
        expect(s.skill).toBeGreaterThanOrEqual(95);
      }
    });
  });

  it('cơ chế Soft Pity (10 roll) và Hard Pity (50 roll) phải hoạt động chính xác', () => {
    // 1. Khi chưa chạm mốc Pity và số ngẫu nhiên lớn -> trả về C
    const normalRarity = determineRarity(0, 0, undefined, () => 0.8);
    expect(normalRarity).toBe('C');

    // 2. Khi softPity = 9 (lượt thứ 10) -> bảo đảm SR hoặc SSR
    const softPityRarity = determineRarity(9, 20, undefined, () => 0.5);
    expect(['SR', 'SSR']).toContain(softPityRarity);

    // 3. Khi hardPity = 49 (lượt thứ 50) -> 100% SSR bất chấp số ngẫu nhiên
    const hardPityRarity = determineRarity(2, 49, undefined, () => 0.999);
    expect(hardPityRarity).toBe('SSR');
  });

  it('mô phỏng 10.000 lượt roll gacha chứng minh xác suất ổn định và bảo đảm cân bằng', () => {
    const sim = runGachaSimulation(10000, 42);
    expect(sim.totalRolls).toBe(10000);

    const cRate = sim.counts.C / 10000;
    const rRate = sim.counts.R / 10000;
    const srRate = sim.counts.SR / 10000;
    const ssrRate = sim.counts.SSR / 10000;

    // Do có bảo hiểm Soft Pity và Hard Pity:
    // C ~55-60%, R ~25-30%, SR ~10-15%, SSR ~1.5-3.0%
    expect(cRate).toBeGreaterThan(0.50);
    expect(cRate).toBeLessThan(0.65);

    expect(rRate).toBeGreaterThan(0.20);
    expect(rRate).toBeLessThan(0.35);

    expect(srRate).toBeGreaterThan(0.08);
    expect(srRate).toBeLessThan(0.18);

    expect(ssrRate).toBeGreaterThan(0.012);
    expect(ssrRate).toBeLessThan(0.035);
  });

  it('thực hiện 1 Roll (Phát tờ rơi - 200.000đ): ra 3 ứng viên để chọn 1, trừ tiền chuẩn', () => {
    const state = createInitialState();
    state.money = 500000;

    const roll = performGachaRollSingle(state);
    expect(roll.success).toBe(true);
    expect(roll.result).toBeDefined();
    expect(roll.result?.candidates.length).toBe(3);
    expect(roll.result?.cost).toBe(GACHA_PRICES.SINGLE_ROLL);
    expect(state.money).toBe(500000 - 200000);
    expect(state.staffGachaTotalRolls).toBe(1);

    // Chọn 1 ứng viên ký hợp đồng
    const chosenCandidate = roll.result!.candidates[0];
    const hire = hireGachaCandidate(state, chosenCandidate);
    expect(hire.success).toBe(true);
    expect(state.staff.length).toBe(1);
    expect(state.staff[0].name).toBe(chosenCandidate.name);
  });

  it('thực hiện 10 Roll (Đăng tin sàn lớn - 1.800.000đ): ra 10 ứng viên (có ít nhất 1 SR+), chọn 1', () => {
    const state = createInitialState();
    state.money = 2500000;

    const roll = performGachaRollTen(state);
    expect(roll.success).toBe(true);
    expect(roll.result).toBeDefined();
    expect(roll.result?.candidates.length).toBe(10);
    expect(roll.result?.cost).toBe(GACHA_PRICES.TEN_ROLL);
    expect(state.money).toBe(2500000 - 1800000);
    expect(state.staffGachaTotalRolls).toBe(10);

    // Cam kết có ít nhất 1 SR hoặc SSR trong 10 roll
    const hasSrOrSsr = roll.result!.candidates.some(c => c.rarity === 'SR' || c.rarity === 'SSR');
    expect(hasSrOrSsr).toBe(true);

    // Chọn 1 ứng viên ký hợp đồng
    const bestCandidate = roll.result!.candidates.find(c => c.rarity === 'SR' || c.rarity === 'SSR')!;
    const hire = hireGachaCandidate(state, bestCandidate);
    expect(hire.success).toBe(true);
    expect(state.staff.length).toBe(1);
    expect(state.staff[0].rarity).toBe(bestCandidate.rarity);
  });

  it('báo lỗi khi không đủ tiền roll gacha', () => {
    const state = createInitialState();
    state.money = 50000; // chỉ có 50k không đủ 200k

    const singleRoll = performGachaRollSingle(state);
    expect(singleRoll.success).toBe(false);
    expect(singleRoll.error).toContain('Không đủ 200.000đ');

    const tenRoll = performGachaRollTen(state);
    expect(tenRoll.success).toBe(false);
    expect(tenRoll.error).toContain('Không đủ 1.800.000đ');
  });

  it('tuyệt đối KHÔNG trùng nhân viên hoặc trùng tên trong cùng lượt roll (single và ten roll)', () => {
    const state = createInitialState();
    state.money = 100000000; // Vô hạn tiền test

    // Kiểm tra 20 lần single roll (mỗi lần 3 thẻ)
    for (let r = 0; r < 20; r++) {
      const roll = performGachaRollSingle(state);
      expect(roll.success).toBe(true);
      const names = roll.result!.candidates.map(c => c.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length); // 3/3 tên phải khác nhau

      const templates = roll.result!.candidates.map(c => c.originalTemplateId);
      const uniqueTemplates = new Set(templates);
      expect(uniqueTemplates.size).toBe(templates.length);
    }

    // Kiểm tra 20 lần 10-roll (mỗi lần 10 thẻ)
    for (let r = 0; r < 20; r++) {
      const roll = performGachaRollTen(state);
      expect(roll.success).toBe(true);
      const names = roll.result!.candidates.map(c => c.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length); // 10/10 tên phải khác nhau 100%

      const templates = roll.result!.candidates.map(c => c.originalTemplateId);
      const uniqueTemplates = new Set(templates);
      expect(uniqueTemplates.size).toBe(templates.length);
    }
  });

  it('tuyệt đối KHÔNG roll ra nhân viên mà tiệm đã tuyển dụng', () => {
    const state = createInitialState();
    state.money = 100000000;

    // Giả lập tuyển dụng 3 nhân viên
    const initialRoll = performGachaRollSingle(state);
    const hired1 = initialRoll.result!.candidates[0];
    const hired2 = initialRoll.result!.candidates[1];
    hireGachaCandidate(state, hired1);
    hireGachaCandidate(state, hired2);
    expect(state.staff.length).toBe(2);

    // Roll tiếp 10 lần 10-roll (100 ứng viên): Không ai được trùng với hired1 hoặc hired2
    for (let r = 0; r < 10; r++) {
      const roll = performGachaRollTen(state);
      expect(roll.success).toBe(true);
      roll.result!.candidates.forEach(c => {
        expect(c.name).not.toBe(hired1.name);
        expect(c.name).not.toBe(hired2.name);
        expect(c.originalTemplateId).not.toBe(hired1.originalTemplateId);
        expect(c.originalTemplateId).not.toBe(hired2.originalTemplateId);
      });
    }
  });

  it('100% ứng viên roll ra phải có modelAsset ảnh nhân vật 2D pixel hợp lệ', () => {
    const state = createInitialState();
    state.money = 10000000;

    const roll = performGachaRollTen(state);
    expect(roll.success).toBe(true);

    roll.result!.candidates.forEach(cand => {
      expect(cand.modelAsset).toBeDefined();
      expect(typeof cand.modelAsset).toBe('string');
      expect(cand.modelAsset).toMatch(/assets\/staff\/.+\.png$/);
    });
  });

  it('hireGachaCandidate ngăn chặn tuyển dụng trùng lặp nhân viên đã có trong tiệm', () => {
    const state = createInitialState();
    state.money = 10000000;

    const roll = performGachaRollSingle(state);
    const candidate = roll.result!.candidates[0];

    const hire1 = hireGachaCandidate(state, candidate);
    expect(hire1.success).toBe(true);

    // Tuyển lại cùng candidate đó
    const hireDuplicate = hireGachaCandidate(state, candidate);
    expect(hireDuplicate.success).toBe(false);
    expect(hireDuplicate.error).toContain('đã là nhân viên của tiệm rồi');
  });

  it('staffImage xuất đường dẫn chuẩn xác, không 404 cho mọi loại nhân sự', () => {
    // 1. Candidate từ pool
    const img1 = staffImage({ id: 'cook_c1', modelAsset: 'assets/staff/cook_c1.png' });
    expect(img1).toContain('assets/staff/cook_c1.png');

    // 2. Candidate từ template id
    const img2 = staffImage({ id: 'cashier_ssr' });
    expect(img2).toContain('assets/staff/cashier_ssr.png');

    // 3. Nhân sự cũ / ban đầu
    const img3 = staffImage({ id: 'staff_1', role: 'cashier' });
    expect(img3).toContain('assets/staff/cashier_c1.png');

    // 4. Fallback theo role và rarity
    const img4 = staffImage({ role: 'security', rarity: 'SR' });
    expect(img4).toContain('assets/staff/security_sr1.png');
  });
});

