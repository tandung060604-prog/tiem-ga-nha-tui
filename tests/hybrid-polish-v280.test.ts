import { describe, it, expect } from 'vitest';
import { createInitialState, migrateSave } from '../src/core/state';
import { changeOil, OIL_CHANGE_COST } from '../src/core/day';
import { renderInventoryTab } from '../src/ui/components/InventoryTab';
import { renderKitchenGuideModal } from '../src/ui/components/KitchenGuideModal';
import { renderTesterFeedbackModal } from '../src/ui/components/TesterFeedbackModal';
import { renderSellingView } from '../src/ui/components/SellingView';
import { SellingSession } from '../src/types/game';
import { CookingEngine } from '../src/core/cooking';

describe('Hybrid Polish v2.8.0 Feature Tests', () => {
  describe('Bac Ba Free Oil Aid System', () => {
    it('grants free oil replacement on Day 1-3 when freeOilFilterUsed is false, even with 0 money', () => {
      const state = createInitialState();
      state.day = 1;
      state.money = 0;
      state.oilCondition = 'dirty';
      state.freeOilFilterUsed = false;

      const result = changeOil(state);
      expect(result).toBe(true);
      expect(state.money).toBe(0); // Không bị trừ tiền
      expect(state.todayOilCost).toBe(0);
      expect(state.oilCondition).toBe('clean');
      expect(state.freeOilFilterUsed).toBe(true);
    });

    it('requires 150.000d for subsequent oil changes once free aid has been used', () => {
      const state = createInitialState();
      state.day = 2;
      state.money = 50000;
      state.oilCondition = 'dirty';
      state.freeOilFilterUsed = true; // Đã dùng trợ giá

      // Không đủ tiền
      const failed = changeOil(state);
      expect(failed).toBe(false);
      expect(state.oilCondition).toBe('dirty');

      // Có đủ 150.000đ
      state.money = 200000;
      const success = changeOil(state);
      expect(success).toBe(true);
      expect(state.money).toBe(50000);
      expect(state.todayOilCost).toBe(OIL_CHANGE_COST);
      expect(state.oilCondition).toBe('clean');
    });

    it('does not grant free oil aid on Day 4 or later even if freeOilFilterUsed was false', () => {
      const state = createInitialState();
      state.day = 4;
      state.money = 10000;
      state.oilCondition = 'dirty';
      state.freeOilFilterUsed = false;

      const result = changeOil(state);
      expect(result).toBe(false);
      expect(state.oilCondition).toBe('dirty');
    });
  });

  describe('State Initialization & Migration', () => {
    it('initializes freeOilFilterUsed and testerFeedbackSubmissions in createInitialState', () => {
      const state = createInitialState();
      expect(state.freeOilFilterUsed).toBe(false);
      expect(Array.isArray(state.testerFeedbackSubmissions)).toBe(true);
      expect(state.testerFeedbackSubmissions?.length).toBe(0);
    });

    it('safely migrates old save without freeOilFilterUsed or testerFeedbackSubmissions', () => {
      const oldRaw = {
        version: 2,
        day: 5,
        money: 100000,
        currentChapter: 2,
      };

      const migrated = migrateSave(oldRaw);
      expect(migrated).not.toBeNull();
      expect(migrated!.state.freeOilFilterUsed).toBe(false);
      expect(Array.isArray(migrated!.state.testerFeedbackSubmissions)).toBe(true);
    });
  });

  describe('Smart Spoilage Alert in InventoryTab', () => {
    it('renders shelf-expiring-soon class and expiring today badge when batch has daysLeft === 1', () => {
      const state = createInitialState();
      state.inventory.chicken_meat.batches = [
        { amount: 5, daysLeft: 1 },
        { amount: 5, daysLeft: 3 }
      ];

      const html = renderInventoryTab(state);
      expect(html).toContain('shelf-expiring-soon');
      expect(html).toContain('⚠️ Hạn hôm nay!');
      expect(html).toContain('(hôm nay!)');
    });
  });

  describe('Kitchen Guide & Tester Feedback Modals', () => {
    it('renders kitchen guide modal with chef tips and close buttons', () => {
      const html = renderKitchenGuideModal();
      expect(html).toContain('SỔ TAY BẾP TRƯỞNG');
      expect(html).toContain('btn-close-kitchen-guide');
      expect(html).toContain('btn-close-kitchen-guide-bottom');
      expect(html).toContain('CĂN NHIỆT VÀNG GIÒN');
    });

    it('renders tester feedback modal with star selector, category and save code copy', () => {
      const state = createInitialState();
      state.shopName = 'TIỆM GÀ THỬ NGHIỆM';
      state.day = 7;

      const html = renderTesterFeedbackModal(state);
      expect(html).toContain('GÓP Ý & BÁO LỖI TESTER');
      expect(html).toContain('TIỆM GÀ THỬ NGHIỆM');
      expect(html).toContain('feedback-star-group');
      expect(html).toContain('select-feedback-category');
      expect(html).toContain('textarea-feedback-comment');
      expect(html).toContain('btn-copy-tester-save');
      expect(html).toContain('btn-submit-tester-feedback');
    });
  });

  describe('SellingView Enhancements', () => {
    it('renders personalized shop name on alley-sidewalk-sign and kitchen guide button', () => {
      const state = createInitialState();
      state.shopName = 'GÀ RÁN SÀI GÒN PHỐ';
      state.freeOilFilterUsed = false;
      state.day = 1;

      const mockSession: SellingSession = {
        orders: [],
        day: 1,
        totalCustomers: 5,
        servedCount: 0,
        gameHour: 10,
        gameMinute: 0,
        isFastForward: false,
        isPaused: false,
        timers: {} as any,
        perfectStreak: 0,
        tray: [],
        cleanserOrders: 0,
        disruptionTimerSec: 0,
        departingCustomers: [],
        dineInTables: [
          { tableIndex: 0, name: 'Bàn 1', status: 'eating', eatingTimerSec: 4, eatingDurationSec: 10, tipAmount: 3000, customerName: 'Khách A', customerAvatar: '' }
        ]
      };

      const html = renderSellingView(state, mockSession);
      expect(html).toContain('GÀ RÁN SÀI GÒN PHỐ · Hẻm 1102');
      expect(html).toContain('btn-open-kitchen-guide');
      expect(html).toContain('0k 🎁'); // Nút thay dầu hiển thị trợ giá 0k
      expect(html).toContain('patio-checkin-flash'); // Khách ăn giây thứ 4 check-in sống ảo
      expect(html).toContain('📸 Check-in!');
    });
  });
});
