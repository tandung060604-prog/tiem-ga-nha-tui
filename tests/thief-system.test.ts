import { describe, it, expect } from 'vitest';
import {
  scheduleThiefEvents,
  createThiefEncounter,
  checkSecurityStaff,
  resolveThiefCaught,
  resolveThiefEscaped
} from '../src/core/thiefSystem';
import {
  renderThiefMinigameModal,
  renderThiefCaughtModal,
  renderThiefEscapedModal
} from '../src/ui/components/ThiefMinigameModal';
import { createInitialState } from '../src/core/state';
import { StaffMember } from '../src/types/game';

import { escapeHtml } from '../src/ui/escapeHtml';

describe('Undercover Thief Disguised Customer & Security System', () => {
  describe('1. scheduleThiefEvents (Tần suất ngẫu nhiên theo ngày)', () => {
    it('Day 1 and Day 2 should never spawn thieves (tutorial safety)', () => {
      const day1 = scheduleThiefEvents(1);
      expect(day1.count).toBe(0);
      expect(day1.timestamps).toEqual([]);

      const day2 = scheduleThiefEvents(2);
      expect(day2.count).toBe(0);
      expect(day2.timestamps).toEqual([]);
    });

    it('Day 3+ should spawn 0, 1, or 2 thieves with valid timestamps within shift duration', () => {
      const countsSeen = new Set<number>();
      for (let i = 0; i < 50; i++) {
        const sched = scheduleThiefEvents(3, 75);
        expect([0, 1, 2]).toContain(sched.count);
        expect(sched.timestamps).toHaveLength(sched.count);
        countsSeen.add(sched.count);

        for (const t of sched.timestamps) {
          expect(t).toBeGreaterThanOrEqual(15);
          expect(t).toBeLessThanOrEqual(60);
        }
      }
      // Over 50 rolls, at least 0 and 1 or 2 should be sampled
      expect(countsSeen.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('2. createThiefEncounter (Tạo dữ liệu kẻ đóng giả)', () => {
    it('generates an encounter with disguise info, true identity and targets', () => {
      const enc = createThiefEncounter('test_1', 6);
      expect(enc.id).toContain('thief_enc_');
      expect(enc.disguiseName).toBeTruthy();
      expect(enc.disguiseAvatar).toBeTruthy();
      expect(enc.trueName).toBe('Tí Chuột Nhắt (Kẻ Đạo Chích Hẻm 1102)');
      expect(enc.trueAvatar).toBeTruthy();
      expect(enc.targetCustomerName).toBeTruthy();
      expect(enc.targetTable).toBeGreaterThanOrEqual(1);
      expect(enc.targetTable).toBeLessThanOrEqual(6);
      expect(enc.targetItem).toBeTruthy();
      expect(enc.lossAmount).toBeGreaterThanOrEqual(150000);
      expect(enc.timeRemaining).toBe(12);
      expect(enc.initialTime).toBe(12);
      expect(enc.isCaught).toBe(false);
      expect(enc.isEscaped).toBe(false);
      expect(enc.caughtBySecurity).toBe(false);
      expect(enc.tellTaleClue).toBeTruthy();
    });
  });

  describe('3. checkSecurityStaff (Đất diễn vai trò Bảo Vệ)', () => {
    it('returns default narrow green zone (18%) and fast meter when no security hired', () => {
      const state = createInitialState();
      state.staff = []; // Không có nhân viên

      const sec = checkSecurityStaff(state);
      expect(sec.hasSecurity).toBe(false);
      expect(sec.greenZoneWidthPercent).toBe(18);
      expect(sec.meterSpeed).toBe(2.2);
    });

    it('returns expanded green zone (55%) and slow meter when security guard is on duty', () => {
      const state = createInitialState();
      const guard: StaffMember = {
        id: 'staff_5',
        name: 'Chú Tư Dân Phòng',
        avatar: '👮‍♂️',
        role: 'security',
        speed: 1.2,
        skill: 1.0,
        salary: 35000,
        hired: true,
        experience: 50,
        mood: 90,
      };
      state.staff = [guard];

      const sec = checkSecurityStaff(state);
      expect(sec.hasSecurity).toBe(true);
      expect(sec.guardName).toBe('Chú Tư Dân Phòng');
      expect(sec.greenZoneWidthPercent).toBe(55);
      expect(sec.meterSpeed).toBe(1.0);
    });
  });

  describe('4. resolveThiefCaught (Bắt quả tang & Lột mặt nạ)', () => {
    it('rewards money, increases Karma, tracks stats, and adds 5-star review', () => {
      const state = createInitialState();
      const initialMoney = state.money;
      const initialComm = state.karma.community;
      const initialCraft = state.karma.craftsmanship;
      const enc = createThiefEncounter('caught_test', 4);

      const result = resolveThiefCaught(state, enc, false);

      expect(enc.isCaught).toBe(true);
      expect(enc.caughtBySecurity).toBe(false);
      expect(state.money).toBe(initialMoney + 150000);
      expect(state.thiefStats?.totalCaught).toBe(1);
      expect(state.karma.community).toBe(Math.min(100, initialComm + 15));
      expect(state.karma.craftsmanship).toBe(Math.min(100, initialCraft + 10));

      expect(result.rewardMoney).toBe(150000);
      expect(result.narrativeTitle).toContain('BẮT QUẢ TANG');
      expect(result.narrativeDetail).toContain(enc.trueName);
      expect(result.review.stars).toBe(5);
      expect(state.recentReviews[0]).toBe(result.review);
    });

    it('highlights security guard bravery if caughtBySecurity is true', () => {
      const state = createInitialState();
      const enc = createThiefEncounter('caught_sec_test', 4);

      const result = resolveThiefCaught(state, enc, true);
      expect(enc.caughtBySecurity).toBe(true);
      expect(result.narrativeDetail).toContain('Chú Bảo Vệ');
      expect(result.review.comment).toContain('Bảo vệ tiệm quá chuyên nghiệp');
    });
  });

  describe('5. resolveThiefEscaped (Trộm cuỗm đồ tẩu thoát)', () => {
    it('deducts loss amount, decreases Karma, docks star rating, and adds 1-star review', () => {
      const state = createInitialState();
      state.money = 1000000;
      state.ratings.overall = 4.8;
      state.ratings.space = 4.5;
      const initialComm = state.karma.community;
      const enc = createThiefEncounter('escaped_test', 4);
      const loss = enc.lossAmount;

      const result = resolveThiefEscaped(state, enc);

      expect(enc.isEscaped).toBe(true);
      expect(state.money).toBe(1000000 - loss);
      expect(state.thiefStats?.totalEscaped).toBe(1);
      expect(state.thiefStats?.totalFinesPaid).toBe(loss);
      expect(state.karma.community).toBe(Math.max(0, initialComm - 15));
      expect(state.ratings.overall).toBe(4.6);
      expect(state.ratings.space).toBe(4.2);

      expect(result.finePaid).toBe(loss);
      expect(result.narrativeTitle).toContain('BỊ CUỖM MẤT');
      expect(result.review.stars).toBe(1);
      expect(result.review.tags).toContain('#CanhBaoMocTui');
      expect(state.recentReviews[0]).toBe(result.review);
    });
  });

  describe('6. UI Modals Rendering', () => {
    it('renders minigame modal correctly with timing bar and disguise details', () => {
      const state = createInitialState();
      const enc = createThiefEncounter('modal_test', 3);
      const html = renderThiefMinigameModal(state, enc);

      expect(html).toContain('modal-thief-minigame');
      expect(html).toContain('thief-meter-track');
      expect(html).toContain('thief-target-zone');
      expect(html).toContain('thief-needle');
      expect(html).toContain('btn-thief-strike');
      expect(html).toContain(escapeHtml(enc.disguiseName));
      expect(html).toContain(escapeHtml(enc.targetItem));
      expect(html).toContain('Quán chưa thuê Bảo Vệ');
    });

    it('renders security guard instant bust button when guard exists', () => {
      const state = createInitialState();
      state.staff = [{
        id: 'staff_5',
        name: 'Chú Tư Dân Phòng',
        avatar: '👮‍♂️',
        role: 'security',
        speed: 1.0,
        skill: 1.0,
        salary: 30000,
        hired: true,
        experience: 10,
        mood: 100,
      }];
      const enc = createThiefEncounter('modal_sec_test', 3);
      const html = renderThiefMinigameModal(state, enc);

      expect(html).toContain('btn-guard-instant-bust');
      expect(html).toContain('Chú Tư Dân Phòng');
      expect(html).toContain('Vùng bắt mở rộng 300%');
    });

    it('renders caught modal showing unmasked real face and plea for mercy', () => {
      const state = createInitialState();
      const enc = createThiefEncounter('caught_modal_test', 2);
      const html = renderThiefCaughtModal(state, enc, 150000);

      expect(html).toContain('modal-thief-result');
      expect(html).toContain('BẮT SỐNG TÊN TRỘM! LỘT MẶT NẠ!');
      expect(html).toContain(escapeHtml(enc.trueName));
      expect(html).toContain('char_37_thief_busted');
      expect(html).toContain('xin chân rửa chén');
      expect(html).toContain('btn-thief-finish-success');
    });

    it('renders escaped modal showing victim outrage and penalty', () => {
      const state = createInitialState();
      const enc = createThiefEncounter('escaped_modal_test', 2);
      const html = renderThiefEscapedModal(state, enc);

      expect(html).toContain('modal-thief-result');
      expect(html).toContain('TÊN TRỘM ĐÃ TẨU THOÁT!');
      expect(html).toContain(escapeHtml(enc.targetItem));
      expect(html).toContain(escapeHtml(enc.targetCustomerName));
      expect(html).toContain('btn-thief-finish-failure');
    });
  });
});
