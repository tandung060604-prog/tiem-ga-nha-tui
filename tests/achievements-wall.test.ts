import { describe, it, expect } from 'vitest';
import { HERITAGE_BADGES } from '../src/content/achievements';
import {
  getBadgeProgress,
  getAllBadgesProgress,
  getClaimableBadgesCount,
  claimBadgeReward
} from '../src/core/achievementsEngine';
import { renderAchievementsWallModal } from '../src/ui/components/AchievementsWallModal';
import { createInitialState } from '../src/core/state';

describe('Heritage Badges & Wall of Fame System (Bằng Khen Tổ Dân Phố)', () => {
  describe('1. Content & Catalog Integrity', () => {
    it('contains exactly 44 heritage badges with meaningful rewards and titles', () => {
      expect(HERITAGE_BADGES).toHaveLength(44);

      for (const badge of HERITAGE_BADGES) {
        expect(badge.id).toBeTruthy();
        expect(badge.title).toBeTruthy();
        expect(badge.kicker).toBeTruthy();
        expect(badge.honorTitle).toBeTruthy();
        expect(badge.targetCount).toBeGreaterThan(0);
        expect(badge.rewardMoney).toBeGreaterThanOrEqual(50000);
        expect(badge.quote).toBeTruthy();
        expect(['cooking', 'security', 'community', 'operations', 'legend']).toContain(badge.category);
      }
    });
  });

  describe('2. Progress & Eligibility Engine', () => {
    it('calculates progress accurately based on game state stats', () => {
      const state = createInitialState();
      state.lifetimeStats.perfectFriedCount = 25; // 25 / 50 (50%)

      const perfectBadge = HERITAGE_BADGES.find(b => b.id === 'badge_ban_tay_vang')!;
      const prog = getBadgeProgress(perfectBadge, state);

      expect(prog.current).toBe(25);
      expect(prog.target).toBe(50);
      expect(prog.percent).toBe(50);
      expect(prog.isCompleted).toBe(false);
      expect(prog.isClaimed).toBe(false);

      // Khi đạt 50 mẻ
      state.lifetimeStats.perfectFriedCount = 50;
      const progComplete = getBadgeProgress(perfectBadge, state);
      expect(progComplete.isCompleted).toBe(true);
      expect(progComplete.percent).toBe(100);
    });

    it('counts claimable badges correctly and prevents false completions on Day 1', () => {
      const freshState = createInitialState();
      // Vào Ngày 1 chưa làm gì thì tuyệt đối không được có bằng khen nào hoàn thành trước
      expect(getClaimableBadgesCount(freshState)).toBe(0);

      const cleanOilBadge = HERITAGE_BADGES.find(b => b.id === 'badge_dung_si_dau_sach')!;
      const cleanOilProg = getBadgeProgress(cleanOilBadge, freshState);
      expect(cleanOilProg.current).toBe(0);
      expect(cleanOilProg.isCompleted).toBe(false);

      // Đạt đủ 5 ngày sạch dầu
      freshState.cleanOilStreakDays = 5;
      expect(getBadgeProgress(cleanOilBadge, freshState).isCompleted).toBe(true);

      // Thêm 2 badge khác hoàn thành
      freshState.lifetimeStats.perfectFriedCount = 60; // Badge 1 complete
      freshState.thiefStats = { totalCaught: 4, totalEscaped: 0, totalFinesPaid: 0 }; // Badge 2 complete

      const claimable = getClaimableBadgesCount(freshState);
      expect(claimable).toBeGreaterThanOrEqual(3);
    });
  });

  describe('3. Reward Claiming Flow', () => {
    it('refuses reward if badge condition is not met', () => {
      const state = createInitialState();
      state.lifetimeStats.perfectFriedCount = 10; // Chưa đủ 50

      const result = claimBadgeReward(state, 'badge_ban_tay_vang');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Chưa hoàn thành');
    });

    it('claims reward, adds money, boosts karma, and sets claimed state', () => {
      const state = createInitialState();
      state.lifetimeStats.perfectFriedCount = 55;
      const initialMoney = state.money;
      const initialCraft = state.karma.craftsmanship;

      const result = claimBadgeReward(state, 'badge_ban_tay_vang');
      expect(result.success).toBe(true);
      expect(state.money).toBe(initialMoney + 50000);
      expect(state.karma.craftsmanship).toBe(initialCraft + 10);
      expect(state.claimedHeritageBadgeIds).toContain('badge_ban_tay_vang');

      // Thử nhận lần thứ 2: Không được nhận trùng
      const resultDuplicate = claimBadgeReward(state, 'badge_ban_tay_vang');
      expect(resultDuplicate.success).toBe(false);
      expect(resultDuplicate.message).toContain('đã nhận');
      expect(state.money).toBe(initialMoney + 50000); // Tiền không tăng thêm
    });
  });

  describe('4. UI Modal Rendering', () => {
    it('renders wall of fame modal with red seal stamps and category filters', () => {
      const state = createInitialState();
      state.lifetimeStats.perfectFriedCount = 50; // Hoàn thành

      const html = renderAchievementsWallModal(state, 'all');
      expect(html).toContain('modal-achievements-wall');
      expect(html).toContain('BỨC TƯỜNG BẰNG KHEN TỔ DÂN PHỐ');
      expect(html).toContain('btn-badge-filter');
      expect(html).toContain('heritage-badge-card');
      expect(html).toContain('Bàn Tay Vàng Làng Gà Rán');
      expect(html).toContain('btn-claim-badge');
      expect(html).toContain('CHỨNG NHẬN');
    });

    it('filters badges by category properly', () => {
      const state = createInitialState();
      const htmlSecurity = renderAchievementsWallModal(state, 'security');

      expect(htmlSecurity).toContain('Khắc Tinh Tội Phạm Hẻm Sâu');
      expect(htmlSecurity).not.toContain('Bậc Thầy Nồi Sốt Bí Truyền'); // Thuộc cooking
    });
  });
});
