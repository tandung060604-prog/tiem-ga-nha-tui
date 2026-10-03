import { describe, it, expect } from 'vitest';
import { 
  createInitialLoyaltyState, 
  calculateHeartLevel, 
  assignDietaryPreference, 
  checkDietaryFulfillment, 
  recordCustomerLoyaltyVisit, 
  claimAlleyGift,
  ensureLoyaltyState,
  HEART_EXP_THRESHOLDS
} from '../src/core/loyaltyEngine';
import { createInitialState } from '../src/core/state';
import { CustomerOrder, TrayItem } from '../src/types/game';

describe('Alley Loyalty Engine (Hệ Thống Tri Kỷ Hẻm 1102 & Khẩu Vị Ruột)', () => {
  it('khởi tạo đầy đủ 36 nhân vật trong danh sách cư dân hẻm', () => {
    const loyalty = createInitialLoyaltyState();
    expect(Object.keys(loyalty.residents).length).toBe(36);
    expect(loyalty.residents['char_02_lottery_lady']).toBeDefined();
    expect(loyalty.residents['char_02_lottery_lady'].heartLevel).toBe(0);
    expect(loyalty.residents['char_02_lottery_lady'].exp).toBe(0);
    expect(loyalty.pendingAlleyGifts).toEqual([]);
    expect(loyalty.claimedAlleyGiftsHistory).toEqual([]);
  });

  it('tính toán chuẩn xác Cấp độ Tim (0 -> 5) theo ngưỡng EXP', () => {
    expect(calculateHeartLevel(0)).toBe(0);
    expect(calculateHeartLevel(99)).toBe(0);
    expect(calculateHeartLevel(100)).toBe(1); // Level 1: Khách Quen
    expect(calculateHeartLevel(249)).toBe(1);
    expect(calculateHeartLevel(250)).toBe(2); // Level 2: Bạn Cùng Ngõ (Quà Đợt 1)
    expect(calculateHeartLevel(499)).toBe(2);
    expect(calculateHeartLevel(500)).toBe(3); // Level 3: Khách Hợp Gu (+20% Tip)
    expect(calculateHeartLevel(849)).toBe(3);
    expect(calculateHeartLevel(850)).toBe(4); // Level 4: Tri Kỷ Hẻm (Quà Đợt 2)
    expect(calculateHeartLevel(1299)).toBe(4);
    expect(calculateHeartLevel(1300)).toBe(5); // Level 5: Người Nhà 1102
    expect(calculateHeartLevel(2500)).toBe(5);
  });

  it('gán khẩu vị ruột ngẫu nhiên dựa trên độ thân thiết và nhân vật', () => {
    // Gọi nhiều lần để kiểm tra phân bổ
    let hasPreferenceCount = 0;
    for (let i = 0; i < 50; i++) {
      const pref = assignDietaryPreference('char_02_lottery_lady', 3);
      if (pref) {
        hasPreferenceCount++;
        expect(pref.id).toBeDefined();
        expect(pref.bonusTip).toBeGreaterThan(0);
        expect(pref.loyaltyExp).toBeGreaterThan(0);
      }
    }
    expect(hasPreferenceCount).toBeGreaterThan(0);
  });

  describe('Kiểm tra đáp ứng Khẩu vị ruột (checkDietaryFulfillment)', () => {
    it('nhận diện chuẩn xác crisp_perfection (chỉ đạt khi toàn bộ món chiên là Perfect)', () => {
      const mockOrder: CustomerOrder = {
        id: 'ord_1',
        customerName: 'Cô Bảy',
        avatar: '',
        isDelivery: false,
        items: [{ menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true }],
        patienceMax: 60,
        patienceCurrent: 40,
        totalPrice: 35000,
        startTime: Date.now(),
        dietaryPreference: {
          id: 'crisp_perfection',
          label: '🌟 Giòn Rụm',
          hint: 'Gà vàng giòn rụm nha!',
          bonusTip: 8000,
          loyaltyExp: 35
        }
      };

      const perfectTray: TrayItem[] = [
        { id: 't1', menuItemId: 'crispy_chicken', name: 'Gà Giòn', icon: '🍗', quality: 'perfect' }
      ];
      const resPerfect = checkDietaryFulfillment(mockOrder, perfectTray, 'clean', 66);
      expect(resPerfect.fulfilled).toBe(true);
      expect(resPerfect.bonusTip).toBe(8000);
      expect(resPerfect.loyaltyExp).toBe(35);

      const goodTray: TrayItem[] = [
        { id: 't2', menuItemId: 'crispy_chicken', name: 'Gà Giòn', icon: '🍗', quality: 'good' }
      ];
      const resGood = checkDietaryFulfillment(mockOrder, goodTray, 'clean', 66);
      expect(resGood.fulfilled).toBe(false);
      expect(resGood.bonusTip).toBe(0);
    });

    it('nhận diện chuẩn xác clean_oil_only (chỉ đạt khi dầu chiên trong vắt)', () => {
      const mockOrder: CustomerOrder = {
        id: 'ord_2',
        customerName: 'Đồng chí Nam',
        avatar: '',
        isDelivery: false,
        items: [{ menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true }],
        patienceMax: 60,
        patienceCurrent: 40,
        totalPrice: 35000,
        startTime: Date.now(),
        dietaryPreference: {
          id: 'clean_oil_only',
          label: '🌿 Dầu Sạch',
          hint: 'Chiên dầu sạch nghen!',
          bonusTip: 12000,
          loyaltyExp: 45
        }
      };

      const tray: TrayItem[] = [
        { id: 't1', menuItemId: 'crispy_chicken', name: 'Gà Giòn', icon: '🍗', quality: 'perfect' }
      ];

      expect(checkDietaryFulfillment(mockOrder, tray, 'clean', 60).fulfilled).toBe(true);
      expect(checkDietaryFulfillment(mockOrder, tray, 'medium', 60).fulfilled).toBe(false);
      expect(checkDietaryFulfillment(mockOrder, tray, 'dirty', 60).fulfilled).toBe(false);
    });

    it('nhận diện chuẩn xác extra_chilled_drink (đạt khi đơn có món nước ngọt)', () => {
      const mockOrder: CustomerOrder = {
        id: 'ord_3',
        customerName: 'Tuấn Shipper',
        avatar: '',
        isDelivery: false,
        items: [
          { menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true },
          { menuItemId: 'soda', count: 1, served: 1, completed: true }
        ],
        patienceMax: 60,
        patienceCurrent: 40,
        totalPrice: 50000,
        startTime: Date.now(),
        dietaryPreference: {
          id: 'extra_chilled_drink',
          label: '🧊 Thật Lạnh',
          hint: 'Nước ngọt lạnh buốt nghen!',
          bonusTip: 5000,
          loyaltyExp: 25
        }
      };

      const trayWithDrink: TrayItem[] = [
        { id: 't1', menuItemId: 'crispy_chicken', name: 'Gà Giòn', icon: '🍗', quality: 'perfect' },
        { id: 't2', menuItemId: 'soda', name: 'Coca', icon: '🥤', quality: 'perfect' }
      ];

      expect(checkDietaryFulfillment(mockOrder, trayWithDrink, 'clean', 60).fulfilled).toBe(true);
    });
  });

  describe('Tích lũy điểm thân thiết & Quà Quê Tiếp Tế', () => {
    it('tích lũy điểm thân thiết, thăng cấp tim và sinh Quà Quê khi chạm Level 2', () => {
      const loyalty = createInitialLoyaltyState();
      const charId = 'char_02_lottery_lady';

      // Lần 1: Nhận 100 EXP -> lên Level 1
      const res1 = recordCustomerLoyaltyVisit(loyalty, charId, 1, true, true, 100);
      expect(res1.leveledUp).toBe(true);
      expect(res1.newHeartLevel).toBe(1);
      expect(loyalty.residents[charId].heartLevel).toBe(1);
      expect(loyalty.residents[charId].totalVisits).toBe(1);
      expect(loyalty.pendingAlleyGifts.length).toBe(0); // Level 1 chưa có quà

      // Lần 2: Nhận thêm 160 EXP -> tổng 260 EXP -> lên Level 2
      const res2 = recordCustomerLoyaltyVisit(loyalty, charId, 2, true, true, 160);
      expect(res2.leveledUp).toBe(true);
      expect(res2.newHeartLevel).toBe(2);
      expect(loyalty.residents[charId].heartLevel).toBe(2);
      expect(loyalty.residents[charId].unlockedGifts).toContain(2);
      expect(loyalty.pendingAlleyGifts.length).toBe(1); // Đã sinh 1 bưu kiện quà quê!
      
      const gift = loyalty.pendingAlleyGifts[0];
      expect(gift.characterId).toBe(charId);
      expect(gift.heartLevel).toBe(2);
      expect(gift.giftLabel).toBe('Tờ Vé Số May Mắn');
      expect(gift.giftType).toBe('cash');
      expect(gift.giftValue).toBe(68000);
    });

    it('claimAlleyGift áp dụng phần thưởng thành công vào GameState', () => {
      const state = createInitialState();
      const initialMoney = state.money;
      ensureLoyaltyState(state);

      // Cho quà vào danh sách chờ
      state.loyaltyState!.pendingAlleyGifts.push({
        id: 'gift_test_1',
        characterId: 'char_02_lottery_lady',
        senderName: 'Cô Bảy Vé Số',
        day: 2,
        heartLevel: 2,
        giftType: 'cash',
        giftLabel: 'Tờ Vé Số May Mắn',
        giftValue: 68000,
        letterContent: 'Trúng số độc đắc nha con!',
        claimed: false
      });

      const res = claimAlleyGift(state, 'gift_test_1');
      expect(res.success).toBe(true);
      expect(state.money).toBe(initialMoney + 68000);
      expect(state.loyaltyState!.pendingAlleyGifts.length).toBe(0);
      expect(state.loyaltyState!.claimedAlleyGiftsHistory.length).toBe(1);
    });
  });
});
