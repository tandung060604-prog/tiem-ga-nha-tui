import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../src/core/state';
import { sendCarePackage, fetchPendingCarePackages, claimCarePackage, CARE_PACKAGE_CONFIG } from '../src/core/carePackage';
import { ensureWeeklyQuests, recordWeeklyQuestProgress, claimWeeklyQuestReward } from '../src/core/weeklyQuests';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(globalThis as any).localStorage = new LocalStorageMock();

describe('Sprint 2: Tính Năng Tiếp Tế Bạn Bè & Nhiệm Vụ Tuần (Care Packages & Weekly Milestones)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Cơ Chế Gửi & Nhận Gói Tiếp Tế (Care Packages)', () => {
    it('1.1. sendCarePackage gửi gà tươi thành công, trừ kho và tăng Karma Community', async () => {
      const state = createInitialState();
      state.userId = 'usr_sender_01';
      state.shopName = 'Tiệm Gà Bác Ba';
      state.roomId = 'HEM1102';
      state.day = 5;
      state.karma.community = 50;

      // Đảm bảo có gà tươi trong kho (20 miếng)
      state.inventory['chicken_meat'].batches = [{ amount: 20, daysLeft: 3 }];
      state.inventory['chicken_meat'].amount = 20;

      const res = await sendCarePackage(state, 'usr_recipient_02', 'Tiệm Bạn B', 'chicken');
      expect(res.success).toBe(true);
      expect(res.package).toBeDefined();
      expect(res.package?.type).toBe('chicken');
      expect(res.package?.recipientId).toBe('usr_recipient_02');
      expect(state.inventory['chicken_meat'].amount).toBe(15);
      expect(state.carePackagesSentDay).toBe(5);
      expect(state.karma.community).toBe(55); // +5 Karma
    });

    it('1.2. Chặn gửi tiếp tế lần 2 trong cùng 1 ngày game', async () => {
      const state = createInitialState();
      state.userId = 'usr_sender_01';
      state.day = 5;
      state.carePackagesSentDay = 5; // Đã gửi hôm nay

      const res = await sendCarePackage(state, 'usr_recipient_02', 'Tiệm Bạn B', 'oil');
      expect(res.success).toBe(false);
      expect(res.message).toContain('Hôm nay tiệm đã gửi');
    });

    it('1.3. sendCarePackage gửi Quỹ Dầu Sạch trừ 50k tiền mặt', async () => {
      const state = createInitialState();
      state.userId = 'usr_sender_01';
      state.day = 6;
      state.money = 200000;

      const res = await sendCarePackage(state, 'usr_recipient_02', 'Tiệm Bạn B', 'oil');
      expect(res.success).toBe(true);
      expect(state.money).toBe(150000);
      expect(res.package?.type).toBe('oil');
      expect(res.package?.amount).toBe(50000);
    });

    it('1.4. claimCarePackage nạp gà tươi vào kho của người nhận và tăng Karma', async () => {
      const state = createInitialState();
      state.userId = 'usr_recipient_02';
      state.karma.community = 40;
      const initialChicken = state.inventory['chicken_meat'].amount;

      const pkg = {
        id: 'pkg_test_chicken',
        senderId: 'usr_sender_01',
        senderName: 'Tiệm Bạn A',
        recipientId: 'usr_recipient_02',
        roomId: 'HEM1102',
        type: 'chicken' as const,
        message: 'Chúc bạn đắt hàng!',
        amount: 5,
        sentAt: Date.now(),
        claimed: false
      };

      const res = await claimCarePackage(state, pkg);
      expect(res.success).toBe(true);
      expect(pkg.claimed).toBe(true);
      expect(state.inventory['chicken_meat'].amount).toBe(initialChicken + 5);
      expect(state.karma.community).toBe(43); // +3 Karma khi nhận quà nghĩa tình
    });

    it('1.5. claimCarePackage phục hồi dầu sạch nếu người nhận đang bị dầu đen', async () => {
      const state = createInitialState();
      state.userId = 'usr_recipient_02';
      state.oilCondition = 'dirty';
      state.oilBatchesCooked = 10;

      const pkg = {
        id: 'pkg_test_oil',
        senderId: 'usr_sender_01',
        senderName: 'Tiệm Bạn A',
        recipientId: 'usr_recipient_02',
        roomId: 'HEM1102',
        type: 'oil' as const,
        message: 'Hỗ trợ thay dầu sạch!',
        amount: 50000,
        sentAt: Date.now(),
        claimed: false
      };

      const res = await claimCarePackage(state, pkg);
      expect(res.success).toBe(true);
      expect(state.oilCondition).toBe('clean');
      expect(state.oilBatchesCooked).toBe(0);
    });
  });

  describe('2. Hệ Thống Nhiệm Vụ Tuần (Weekly Milestones)', () => {
    it('2.1. ensureWeeklyQuests khởi tạo đúng 3 nhiệm vụ theo tuần', () => {
      const state = createInitialState();
      state.day = 10; // Tuần 2
      const progress = ensureWeeklyQuests(state);

      expect(progress.week).toBe(2);
      expect(progress.quests.length).toBe(3);
      expect(progress.quests[0].id).toContain('_craft');
      expect(progress.quests[1].id).toContain('_hygiene');
      expect(progress.quests[2].id).toContain('_community');
    });

    it('2.2. recordWeeklyQuestProgress tích lũy đúng số lượng và kích hoạt hoàn thành', () => {
      const state = createInitialState();
      state.day = 3; // Tuần 1
      const progress = ensureWeeklyQuests(state);

      // Chiên 25 mẻ Perfect
      recordWeeklyQuestProgress(state, 'perfect_fry', 20);
      expect(progress.quests[0].currentCount).toBe(20);
      expect(progress.quests[0].completed).toBe(false);

      recordWeeklyQuestProgress(state, 'perfect_fry', 5);
      expect(progress.quests[0].currentCount).toBe(25);
      expect(progress.quests[0].completed).toBe(true);
    });

    it('2.3. claimWeeklyQuestReward nhận thưởng tiền mặt, danh hiệu và điểm Karma', () => {
      const state = createInitialState();
      state.day = 3;
      state.money = 100000;
      state.karma.craftsmanship = 50;
      const progress = ensureWeeklyQuests(state);

      const quest = progress.quests[0];
      quest.completed = true;

      const claimRes = claimWeeklyQuestReward(state, quest.id);
      expect(claimRes.success).toBe(true);
      expect(quest.claimed).toBe(true);
      expect(state.money).toBe(250000); // +150.000đ thưởng
      expect(state.karma.craftsmanship).toBe(60); // +10 Karma Tay Nghề
    });
  });
});
