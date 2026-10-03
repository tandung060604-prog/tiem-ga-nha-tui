import { describe, it, expect } from 'vitest';
import { EconomyEngine } from '../src/core/economy';
import { createSellingSession, tickSelling, TickContext } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { pickNightStorylet, applyStoryletChoice } from '../src/core/storyletEngine';
import { NIGHT_STORYLETS } from '../src/content/storylets';
import { checkDailyFeatureUnlockGuide } from '../src/core/tutorial';
import { renderEndlessModeModal } from '../src/ui/components/EndlessModeModal';
import { getWaveConfig } from '../src/core/endlessMode';
import { renderHeader } from '../src/ui/components/Header';
import { renderChalkboard } from '../src/ui/components/Chalkboard';
import { renderSellingView } from '../src/ui/components/SellingView';
import { cookingEngine } from '../src/core/cooking';

describe('Đại Tu Pacing Chương 2, Xóa Thời Tiết, Ca Đêm 21h-6h & Bác Ba Spotlight Mới', () => {
  describe('1. Cân Bằng Pacing Khách Chương 2 & Breather Throttling', () => {
    it('1.1. Lượng khách Chương 2 tăng dần mượt mà thay vì nhảy vọt 40 khách', () => {
      const stateCh1 = createInitialState();
      stateCh1.currentChapter = 1;
      stateCh1.day = 10;
      const countCh1 = EconomyEngine.calculateDailyCustomerCount(stateCh1);

      const stateCh2Early = createInitialState();
      stateCh2Early.currentChapter = 2;
      stateCh2Early.day = 21; // Ngày đầu tiên Chương 2
      const countCh2Early = EconomyEngine.calculateDailyCustomerCount(stateCh2Early);

      const stateCh2Late = createInitialState();
      stateCh2Late.currentChapter = 2;
      stateCh2Late.day = 30; // Ngày giữa Chương 2
      const countCh2Late = EconomyEngine.calculateDailyCustomerCount(stateCh2Late);

      expect(countCh1).toBeLessThanOrEqual(16);
      // Ngày 21 chỉ khởi đầu ~18-24 khách (vừa sức xử lý, không vọt lên 50-60 khách)
      expect(countCh2Early).toBeGreaterThanOrEqual(18);
      expect(countCh2Early).toBeLessThan(35);
      // Ngày 30 tăng dần lũy tiến
      expect(countCh2Late).toBeGreaterThanOrEqual(countCh2Early);
    });

    it('1.2. Khoảng cách sinh khách tối thiểu đạt ít nhất 3800ms để người chơi kịp thở', () => {
      const session = createSellingSession();
      session.gameHour = 20; // Giờ cao điểm sát đóng cửa (còn 1h), cần sinh gấp nhưng bị clamp tối thiểu 3800ms
      session.spawnedCount = 0;
      session.spawnTimerMs = 0;

      let spawned = 0;
      const ctx: TickContext = {
        expectedCustomers: 50,
        spawnCustomer: () => {
          spawned++;
          return {
            id: `ord_${spawned}`,
            customerName: 'Thực khách',
            customerAvatar: '',
            items: ['crispy_chicken'],
            totalPrice: 35000,
            patienceMax: 40,
            patienceCurrent: 40,
            isWalkup: false,
            personality: 'standard',
            startTime: Date.now()
          };
        }
      };

      // Tick 2500ms -> Chưa đủ 3800ms nên chưa được sinh khách
      tickSelling(session, 2500, ctx);
      expect(session.orders).toHaveLength(0);

      // Tick thêm 1500ms (tổng 4000ms >= 3800ms) -> Sinh khách thành công
      tickSelling(session, 1500, ctx);
      expect(session.orders).toHaveLength(1);
    });
  });

  describe('2. Xóa Hoàn Toàn Thời Tiết Khỏi HUD & State', () => {
    it('2.1. GameState ban đầu không còn trường todayWeather', () => {
      const state = createInitialState();
      expect((state as any).todayWeather).toBeUndefined();
    });

    it('2.2. Header và Chalkboard không còn thẻ h-weather-badge hay icon thời tiết', () => {
      const state = createInitialState();
      const headerHtml = renderHeader(state);
      expect(headerHtml).not.toContain('h-weather-badge');
      expect(headerHtml).not.toContain('h-weather-icon');

      const boardHtml = renderChalkboard(state, 'Trời Nắng Ráo');
      expect(boardHtml).toContain('event-badge');
      expect(boardHtml).not.toContain('weather-badge');
    });
  });

  describe('3. Giới Hạn Truyện Hẻm 1102 Nghiêm Ngặt 1 Mẩu Chuyện / Ngày', () => {
    it('3.1. Chỉ xuất hiện tối đa 1 Storylet trong cùng 1 ngày', () => {
      const state = createInitialState();
      state.day = 1;
      state.seenStoryletIds = [];

      const storylet1 = pickNightStorylet(state, NIGHT_STORYLETS);
      expect(storylet1).not.toBeNull();

      // Sau khi người chơi đọc và chọn lựa chọn:
      applyStoryletChoice(state, storylet1!, storylet1!.choices[0].id);
      expect(state.lastStoryletDay).toBe(1);

      // Thử gọi lại trong cùng ngày 1: Bắt buộc trả về null (không được bung thêm mẩu truyện nào nữa)
      const storyletDuplicate = pickNightStorylet(state, NIGHT_STORYLETS);
      expect(storyletDuplicate).toBeNull();
    });
  });

  describe('4. Chuẩn Hóa Ca Đêm 21:00 - 06:00 Sáng & Lợi Ích Khác Biệt', () => {
    it('4.1. Modal Ca Đêm nêu rõ khung giờ 21:00 - 06:00 và 100% doanh thu', () => {
      const state = createInitialState();
      const modalHtml = renderEndlessModeModal(state);

      expect(modalHtml).toContain('21:00 — 06:00 SÁNG');
      expect(modalHtml).toContain('Khách kiên nhẫn hơn +30%');
      expect(modalHtml).toContain('100% doanh thu & tiền bo');
    });

    it('4.2. Khách ca đêm có kiên nhẫn khởi điểm 1.3x (+30% so với ngày thường)', () => {
      const wave1 = getWaveConfig(1);
      expect(wave1.patienceMultiplier).toBe(1.3);
    });
  });

  describe('5. Bác Ba Spotlight Hướng Dẫn Tính Năng Mới Theo Ngày', () => {
    it('5.1. Ngày 2 kích hoạt Spotlight hướng dẫn Tab Đánh Giá & Review', () => {
      const state = createInitialState();
      state.day = 2;
      state.guidedFeatures = [];

      const guideDay2 = checkDailyFeatureUnlockGuide(state);
      expect(guideDay2).not.toBeNull();
      expect(guideDay2?.key).toBe('day_2_reviews');
      expect(guideDay2?.target).toContain('reviews');
      expect(guideDay2?.text).toContain('Đánh Giá & Review');
    });

    it('5.2. Ngày 3 kích hoạt Spotlight hướng dẫn Tab Nâng Cấp Quán', () => {
      const state = createInitialState();
      state.day = 3;
      state.guidedFeatures = ['day_2_reviews'];

      const guideDay3 = checkDailyFeatureUnlockGuide(state);
      expect(guideDay3).not.toBeNull();
      expect(guideDay3?.key).toBe('day_3_upgrades');
      expect(guideDay3?.target).toContain('upgrades');
      expect(guideDay3?.text).toContain('Nâng Cấp Quán');
    });

    it('5.3. Chương 2 / Ngày 4 kích hoạt Spotlight hướng dẫn Tab Nhân Viên', () => {
      const state = createInitialState();
      state.day = 4;
      state.currentChapter = 2;
      state.guidedFeatures = ['day_2_reviews', 'day_3_upgrades'];

      const guideStaff = checkDailyFeatureUnlockGuide(state);
      expect(guideStaff).not.toBeNull();
      expect(guideStaff?.key).toBe('chapter_2_staff');
      expect(guideStaff?.target).toContain('staff');
      expect(guideStaff?.text).toContain('Nhân Viên');
    });
  });

  describe('6. Cảnh Báo Dầu Đen Cực Rõ & Thay Đổi Màu Chảo Dầu', () => {
    it('6.1. Khi dầu đen (oilCondition: dirty), chảo hiển thị cảnh báo nhấp nháy', () => {
      const state = createInitialState();
      state.oilCondition = 'dirty';
      const session = createSellingSession();

      const html = renderSellingView(state, session);
      expect(html).toContain('dirty-oil-warning-overlay');
      expect(html).toContain('⚠️ DẦU ĐEN! THAY DẦU KẺO CHÁY GÀ!');
      expect(html).toContain('⚠️ ĐEN! THAY');
      expect(html).toContain('oil-dirty');
    });
  });
});
