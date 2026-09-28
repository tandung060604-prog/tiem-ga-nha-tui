import { describe, it, expect, beforeEach } from 'vitest';
import { DAILY_INCIDENTS, getIncidentById } from '../src/content/dailyIncidents';
import {
  hasSecurityStaff,
  pickDailyIncident,
  resolveIncidentChoice
} from '../src/core/dailyIncidentsEngine';
import { createInitialState } from '../src/core/state';
import { GameState, StaffMember } from '../src/types/game';
import { STAFF_ROLES_INFO } from '../src/content/staff';
import { describeStaffEffect, staffEffects } from '../src/core/staff';

describe('Hệ Thống 25 Sự Kiện Hài Hước Bắt Trend & Quyết Định Ending', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  describe('1. Ngân hàng 25 Sự Kiện (Content Integrity)', () => {
    it('Phải có ít nhất 25 sự kiện hài hước & đời sống hẻm', () => {
      expect(DAILY_INCIDENTS.length).toBeGreaterThanOrEqual(25);
    });

    it('Mỗi sự kiện phải có đầy đủ thuộc tính, lời thoại và ít nhất 2 lựa chọn', () => {
      const ids = new Set<string>();
      for (const inc of DAILY_INCIDENTS) {
        expect(inc.id).toBeTruthy();
        expect(ids.has(inc.id)).toBe(false); // ID phải duy nhất
        ids.add(inc.id);

        expect(inc.title).toBeTruthy();
        expect(inc.icon).toBeTruthy();
        expect(inc.characterName).toBeTruthy();
        expect(inc.characterAvatar).toBeTruthy();
        expect(inc.characterRole).toBeTruthy();
        expect(inc.context).toBeTruthy();
        expect(inc.dialogue).toBeTruthy();
        expect(inc.choices.length).toBeGreaterThanOrEqual(2);

        for (const choice of inc.choices) {
          expect(choice.id).toBeTruthy();
          expect(choice.label).toBeTruthy();
          expect(choice.reactionTitle).toBeTruthy();
          expect(choice.reactionNarrative).toBeTruthy();
          expect(choice.karmaDelta).toBeDefined();
        }
      }
    });

    it('Tìm kiếm sự kiện theo ID chính xác', () => {
      const tiktoker = getIncidentById('incident_tiktoker_free');
      expect(tiktoker).toBeDefined();
      expect(tiktoker?.characterName).toBe('Ben Lee');

      const nonExistent = getIncidentById('non_existent_incident');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('2. Cơ chế Bảo Vệ (Security Role & Risk Prevention)', () => {
    it('Nhận diện đúng trạng thái có nhân viên bảo vệ hay không', () => {
      expect(hasSecurityStaff(state)).toBe(false);

      const securityGuard: StaffMember = {
        id: 'sec_1',
        name: 'Chú Tư Dân Phòng',
        role: 'security',
        avatar: '👮‍♂️',
        speed: 75,
        skill: 85,
        attitude: 90,
        stamina: 88,
        traits: ['night_owl'],
        hourlyWage: 25000,
        mood: 100,
        shiftsWorked: 0
      };

      state.staff.push(securityGuard);
      expect(hasSecurityStaff(state)).toBe(true);

      // Nếu tâm trạng kiệt quệ (<= 20), bảo vệ không còn sức can thiệp
      securityGuard.mood = 15;
      expect(hasSecurityStaff(state)).toBe(false);
    });

    it('Hệ thống nhân viên hỗ trợ đầy đủ vai trò security', () => {
      expect(STAFF_ROLES_INFO.security).toBeDefined();
      expect(STAFF_ROLES_INFO.security.name).toContain('Bảo Vệ');

      const securityGuard: StaffMember = {
        id: 'sec_1',
        name: 'Chú Tư',
        role: 'security',
        avatar: '👮‍♂️',
        speed: 80,
        skill: 80,
        attitude: 90,
        stamina: 80,
        traits: [],
        hourlyWage: 25000,
        mood: 100,
        shiftsWorked: 0
      };

      const desc = describeStaffEffect(securityGuard, [securityGuard]);
      expect(desc).toContain('Bảo vệ');
      expect(desc).toContain('trộm cắp');

      const eff = staffEffects([securityGuard]);
      expect(eff.hasSecurity).toBe(true);
    });
  });

  describe('3. Xử lý Lựa Chọn & Ảnh Hưởng Karma Ẩn Số (Engine Resolution)', () => {
    it('Lựa chọn có bảo vệ: Thành công 100% khi quán có bảo vệ', () => {
      const bikeTheft = getIncidentById('incident_bike_theft')!;
      const secChoice = bikeTheft.choices.find(c => c.requiresSecurity === true)!;

      // Tuyển bảo vệ
      state.staff.push({
        id: 'sec_1',
        name: 'Chú Tư',
        role: 'security',
        avatar: '👮‍♂️',
        speed: 80,
        skill: 80,
        attitude: 90,
        stamina: 80,
        traits: [],
        hourlyWage: 25000,
        mood: 100,
        shiftsWorked: 0
      });

      const initialMoney = state.money;
      const initialCommunity = state.karma.community;

      const result = resolveIncidentChoice(state, bikeTheft, secChoice);

      expect(result.succeeded).toBe(true);
      expect(result.reactionTitle).toBe('Khách Cảm Kích Tột Cùng!');
      expect(state.money).toBeGreaterThanOrEqual(initialMoney);
      expect(state.karma.community).toBeGreaterThan(initialCommunity);
      expect(state.seenIncidentIds).toContain('incident_bike_theft');
      expect(state.todayIncidentsCount).toBe(1);
    });

    it('Lựa chọn đòi hỏi bảo vệ sẽ thất bại nếu quán KHÔNG có bảo vệ', () => {
      const bikeTheft = getIncidentById('incident_bike_theft')!;
      const secChoice = bikeTheft.choices.find(c => c.requiresSecurity === true)!;

      expect(hasSecurityStaff(state)).toBe(false);

      const result = resolveIncidentChoice(state, bikeTheft, secChoice);
      expect(result.succeeded).toBe(false);
      expect(result.reactionTitle).toContain('Rủi Ro');
    });

    it('Lựa chọn tử tế tăng Tình Thân Hẻm (Community) và tác động đúng kết cục', () => {
      const kidLottery = getIncidentById('incident_kid_lottery')!;
      const warmChoice = kidLottery.choices.find(c => c.id === 'kid_exchange_feast')!;

      const initialCommunity = state.karma.community;
      const result = resolveIncidentChoice(state, kidLottery, warmChoice);

      expect(result.succeeded).toBe(true);
      expect(state.karma.community).toBe(initialCommunity + (warmChoice.karmaDelta.community ?? 0));
    });

    it('Lựa chọn chạy theo lợi nhuận tăng Tham Vọng (Ambition) và giảm Tình Thân', () => {
      const poach = getIncidentById('incident_rival_poach')!;
      const cashChoice = poach.choices.find(c => c.id === 'poach_take_cash')!;

      const initialAmbition = state.karma.ambition;
      const initialCommunity = state.karma.community;

      const result = resolveIncidentChoice(state, poach, cashChoice);

      expect(result.succeeded).toBe(true);
      expect(state.karma.ambition).toBe(initialAmbition + (cashChoice.karmaDelta.ambition ?? 0));
      expect(state.karma.community).toBeLessThan(initialCommunity);
    });
  });

  describe('4. Bộ Chọn Sự Kiện Theo Thời Điểm & Tiến Độ (Pick Incident)', () => {
    it('Chọn được sự kiện phù hợp cho sáng sớm (morning)', () => {
      state.day = 2;
      const inc = pickDailyIncident(state, 'morning');
      expect(inc).toBeDefined();
      expect(inc?.phaseTiming === 'morning' || inc?.phaseTiming === 'any').toBe(true);
    });

    it('Chọn được sự kiện phù hợp cho ca bán (shift)', () => {
      state.day = 3;
      const inc = pickDailyIncident(state, 'shift');
      expect(inc).toBeDefined();
      expect(inc?.phaseTiming === 'shift' || inc?.phaseTiming === 'any').toBe(true);
    });

    it('Ưu tiên sự kiện chưa gặp', () => {
      state.seenIncidentIds = DAILY_INCIDENTS.slice(0, DAILY_INCIDENTS.length - 1).map(i => i.id);
      const remainingId = DAILY_INCIDENTS[DAILY_INCIDENTS.length - 1].id;

      // Chương 5, Ngày 50 để mở khóa toàn bộ
      state.currentChapter = 5;
      state.day = 50;

      const picked = pickDailyIncident(state, 'any');
      expect(picked?.id).toBe(remainingId);
    });

    it('Phân tầng tiến độ chặt chẽ: Ngày 2 Chương 1 không thể xuất hiện sự kiện Chương 3-4', () => {
      state.currentChapter = 1;
      state.day = 2;

      // Lấy thử 30 lần random ở ngày 2 chương 1
      for (let i = 0; i < 30; i++) {
        const inc = pickDailyIncident(state, 'any');
        expect(inc).toBeDefined();
        expect(inc?.minChapter ?? 1).toBeLessThanOrEqual(1);
        expect(inc?.minDay ?? 1).toBeLessThanOrEqual(2);
      }
    });

    it('Mỗi sự kiện đều có gợi ý bí ẩn unlockHint để kích thích tò mò', () => {
      for (const inc of DAILY_INCIDENTS) {
        expect(inc.unlockHint).toBeTruthy();
        expect(inc.unlockHint?.length).toBeGreaterThan(10);
      }
    });
  });

  describe('5. Album Sổ Tay Tình Huống Hẻm 1102 (Incidents Album Modal)', () => {
    it('Render giao diện Album đầy đủ tiến độ và gợi ý bí ẩn', async () => {
      const { renderIncidentAlbumModal } = await import('../src/ui/components/DailyIncidentModal');
      
      // Giả lập đã gặp 2 sự kiện
      state.seenIncidentIds = ['incident_cat_adopted', 'incident_street_singer'];
      state.resolvedIncidents = [
        { incidentId: 'incident_cat_adopted', choiceId: 'cat_adopt_mascot', day: 2, succeeded: true }
      ];

      const html = renderIncidentAlbumModal(state);
      expect(html).toContain('SỔ TAY TÌNH HUỐNG HẺM 1102');
      expect(html).toContain(`2/${DAILY_INCIDENTS.length}`);
      expect(html).toContain('ĐÃ KHÁM PHÁ');
      expect(html).toContain('CHƯA MỞ KHÓA');
      expect(html).toContain('Tình Huống Bí Ẩn');
      expect(html).toContain('Bé Mèo Mướp Con');
      expect(html).toContain('Xử lý thành công');
    });
  });
});
