import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { ASSETS } from '../src/content/assets';
import { HERITAGE_BADGES } from '../src/content/achievements';
import { getAllBadgesProgress, getBadgeProgress } from '../src/core/achievementsEngine';
import { renderChalkboard } from '../src/ui/components/Chalkboard';
import { renderAchievementsWallModal } from '../src/ui/components/AchievementsWallModal';
import { createInitialState } from '../src/core/state';

describe('Kệ Cúp Vàng Tổ Dân Phố & Hệ Thống 44 Bằng Khen Mở Rộng', () => {
  describe('1. Asset Cúp Vàng Pixel Art Stardew Valley', () => {
    it('ASSETS.ui.trophyGoldenShowcase tồn tại và trỏ tới file vật lý sạch nền', () => {
      expect(ASSETS.ui.trophyGoldenShowcase).toBe('/assets/ui/trophy_golden_showcase.png');
      expect(existsSync(`public${ASSETS.ui.trophyGoldenShowcase}`)).toBe(true);
    });
  });

  describe('2. Đa Dạng Hóa 44 Bằng Khen (Thêm +32 Achievements Mới)', () => {
    it('hệ thống sở hữu đúng 44 bằng khen theo quyết định Jev MCP', () => {
      expect(HERITAGE_BADGES).toHaveLength(44);
    });

    it('phân bố đầy đủ 5 phân nhóm công trạng Hẻm 1102', () => {
      const cooking = HERITAGE_BADGES.filter(b => b.category === 'cooking');
      const security = HERITAGE_BADGES.filter(b => b.category === 'security');
      const community = HERITAGE_BADGES.filter(b => b.category === 'community');
      const operations = HERITAGE_BADGES.filter(b => b.category === 'operations');
      const legend = HERITAGE_BADGES.filter(b => b.category === 'legend');

      expect(cooking).toHaveLength(10);
      expect(security).toHaveLength(8);
      expect(community).toHaveLength(10);
      expect(operations).toHaveLength(9);
      expect(legend).toHaveLength(7);
    });

    it('toàn bộ 44 bằng khen đều có metadata chuẩn mực, không rỗng hay undefined', () => {
      for (const badge of HERITAGE_BADGES) {
        expect(badge.id).toBeTruthy();
        expect(badge.title).toBeTruthy();
        expect(badge.kicker).toBeTruthy();
        expect(badge.requirementDesc).toBeTruthy();
        expect(badge.honorTitle).toBeTruthy();
        expect(badge.quote).toBeTruthy();
        expect(badge.targetCount).toBeGreaterThan(0);
        expect(badge.rewardMoney).toBeGreaterThanOrEqual(50000);
      }
    });

    it('động cơ getAllBadgesProgress tính toán an toàn cho cả 44 bằng khen không throw', () => {
      const state = createInitialState();
      const allProgress = getAllBadgesProgress(state);

      expect(allProgress).toHaveLength(44);
      allProgress.forEach(p => {
        expect(typeof p.current).toBe('number');
        expect(typeof p.target).toBe('number');
        expect(typeof p.percent).toBe('number');
        expect(typeof p.isCompleted).toBe('boolean');
        expect(typeof p.isClaimed).toBe('boolean');
      });
    });

    it('tính toán đúng tiến độ cho các bằng khen mới (sốt bí truyền, thau bột, trộm, mèo hẻm, bão saigon)', () => {
      const state = createInitialState();
      state.secretSauces = {
        garlic_chili: { level: 2, unlocked: true },
        salted_egg: { level: 3, unlocked: true },
        tamarind: { level: 1, unlocked: true },
        cheese: { level: 0, unlocked: false },
        black_pepper: { level: 0, unlocked: false }
      };
      state.lifetimeStats.totalSaucesCooked = 15;
      state.lifetimeStats.catStrokesCount = 20;

      const sauceBadge = HERITAGE_BADGES.find(b => b.id === 'badge_bac_thay_gia_truyen')!;
      const petBadge = HERITAGE_BADGES.find(b => b.id === 'badge_ban_than_thu_cung')!;

      expect(getBadgeProgress(sauceBadge, state).target).toBe(5);
      expect(getBadgeProgress(petBadge, state).target).toBe(5);
    });
  });

  describe('3. Giao Diện Kệ Cúp Vàng Trên Hiên Quán (Chalkboard)', () => {
    it('render Chalkboard hiển thị widget kệ cúp vàng với sprite cúp và seal vàng', () => {
      const state = createInitialState();
      const html = renderChalkboard(state);

      expect(html).toContain('id="btn-open-trophy-showcase"');
      expect(html).toContain('trophy-widget-card');
      expect(html).toContain('trophy-pixel-sprite');
      expect(html).toContain(ASSETS.ui.trophyGoldenShowcase);
      expect(html).toContain('trophy-pixel-gold-seal');
      expect(html).toContain('id="btn-open-achievements"');
      expect(html).toContain('id="btn-weekly-quests"');
    });

    it('hiển thị số cúp mới chờ nhận dạng pixel gold seal khi có bằng khen hoàn thành', () => {
      const state = createInitialState();
      state.thiefStats = { totalCaught: 1, totalEscaped: 0, totalFinesPaid: 0 }; // Hoàn thành đúng 1 cúp: badge_mat_than_dan_pho

      const html = renderChalkboard(state);
      expect(html).toContain('1 CÚP MỚI');
      expect(html).not.toContain('ĐÃ TREO HẾT');
    });

    it('hiển thị (ĐÃ TREO HẾT) khi không có cúp nào chờ nhận', () => {
      const state = createInitialState();
      const html = renderChalkboard(state);

      expect(html).toContain('ĐÃ TREO HẾT');
    });
  });

  describe('4. Bức Tường Bằng Khen Tổ Dân Phố Modal', () => {
    it('hiển thị asset cúp vàng thay cho emoji trên header và có số lượng theo từng tab', () => {
      const state = createInitialState();
      const html = renderAchievementsWallModal(state, 'all');

      expect(html).toContain(ASSETS.ui.trophyGoldenShowcase);
      expect(html).toContain('Tất Cả (44)');
      expect(html).toContain('Bếp (10)');
      expect(html).toContain('An Ninh (8)');
      expect(html).toContain('Nghĩa Tình (10)');
      expect(html).toContain('Vận Hành (9)');
      expect(html).toContain('Huyền Thoại (7)');
    });
  });
});
