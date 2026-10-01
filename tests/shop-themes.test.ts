import { describe, it, expect } from 'vitest';
import {
  SHOP_THEMES,
  getShopTheme,
  getAllShopThemes,
  getActiveShopTheme,
  canUnlockShopTheme,
  unlockShopTheme,
  applyShopTheme,
} from '../src/content/shopThemes';
import { createInitialState, migrateSave } from '../src/core/state';
import { renderShopThemeModal } from '../src/ui/components/ShopThemeModal';
import { renderHeader } from '../src/ui/components/Header';

describe('Tùy Biến Giao Diện Quán & Biển Hiệu Vintage (Shop Skins & Themes)', () => {
  describe('1. Danh Mục 4 Mẫu Biển Hiệu & Giao Diện Sài Gòn', () => {
    it('1.1. Cung cấp đầy đủ 4 bộ giao diện phong cách Sài Gòn đặc trưng', () => {
      const themes = getAllShopThemes();
      expect(themes).toHaveLength(4);

      const ids = themes.map(t => t.id);
      expect(ids).toContain('default');
      expect(ids).toContain('saigon_90s');
      expect(ids).toContain('tet_mai_vang');
      expect(ids).toContain('neon_cho_lon');
    });

    it('1.2. Mỗi theme có đầy đủ thông số biển hiệu, cssClass và buff không gian', () => {
      SHOP_THEMES.forEach(t => {
        expect(t.name).toBeTruthy();
        expect(t.signboardTitle).toBeTruthy();
        expect(t.signboardSubtitle).toBeTruthy();
        expect(t.cssClass).toBeTruthy();
        expect(t.atmosphereBuff).toBeTruthy();
        expect(t.unlockDay).toBeGreaterThanOrEqual(1);
        expect(t.unlockCost).toBeGreaterThanOrEqual(0);
      });
    });

    it('1.3. getShopTheme trả về đúng theme hoặc fallback về default', () => {
      expect(getShopTheme('saigon_90s').signboardTitle).toContain('BÁC BA 1990');
      expect(getShopTheme('non_existent' as any).id).toBe('default');
    });
  });

  describe('2. Cơ Chế Mở Khóa & Sơn Sửa Quán (Unlock Logic)', () => {
    it('2.1. Không thể mở khóa lại theme đã sở hữu', () => {
      const state = createInitialState();
      state.unlockedThemeIds = ['default'];
      const check = canUnlockShopTheme(state, 'default');
      expect(check.canUnlock).toBe(false);
      expect(check.reason).toContain('đã được mở khóa');
    });

    it('2.2. Không thể mở khóa nếu chưa đạt mốc ngày tối thiểu', () => {
      const state = createInitialState();
      state.day = 2;
      state.money = 10000000;
      const check = canUnlockShopTheme(state, 'saigon_90s'); // Cần ngày 5
      expect(check.canUnlock).toBe(false);
      expect(check.reason).toContain('Cần đạt Ngày 5');
    });

    it('2.3. Không thể mở khóa nếu thiếu tiền', () => {
      const state = createInitialState();
      state.day = 10;
      state.money = 50000; // Cần 250k
      const check = canUnlockShopTheme(state, 'saigon_90s');
      expect(check.canUnlock).toBe(false);
      expect(check.reason).toContain('Không đủ kinh phí');
    });

    it('2.4. Mở khóa thành công khi đủ điều kiện: trừ tiền và kích hoạt active', () => {
      const state = createInitialState();
      state.day = 15;
      state.money = 500000;

      const res = unlockShopTheme(state, 'saigon_90s');
      expect(res.success).toBe(true);
      expect(state.money).toBe(500000 - 250000);
      expect(state.unlockedThemeIds).toContain('saigon_90s');
      expect(state.activeShopTheme).toBe('saigon_90s');
      expect(getActiveShopTheme(state).id).toBe('saigon_90s');
    });
  });

  describe('3. Chuyển Đổi Giao Diện (Switching / Applying Themes)', () => {
    it('3.1. Chuyển đổi qua lại giữa các theme đã mở khóa', () => {
      const state = createInitialState();
      state.unlockedThemeIds = ['default', 'saigon_90s', 'tet_mai_vang'];
      state.activeShopTheme = 'default';

      const res = applyShopTheme(state, 'tet_mai_vang');
      expect(res.success).toBe(true);
      expect(state.activeShopTheme).toBe('tet_mai_vang');
      expect(getActiveShopTheme(state).name).toContain('Tết Mai Vàng');
    });

    it('3.2. Không thể áp dụng theme chưa mở khóa', () => {
      const state = createInitialState();
      state.unlockedThemeIds = ['default'];

      const res = applyShopTheme(state, 'neon_cho_lon');
      expect(res.success).toBe(false);
      expect(res.message).toContain('chưa mở khóa');
      expect(state.activeShopTheme).toBe('default');
    });
  });

  describe('4. Render Giao Diện Modal & Header', () => {
    it('4.1. renderShopThemeModal hiển thị đầy đủ thẻ preview và nút bấm', () => {
      const state = createInitialState();
      const html = renderShopThemeModal(state);

      expect(html).toContain('modal-shop-theme');
      expect(html).toContain('Biển Hiệu & Giao Diện Quán');
      expect(html).toContain('TIỆM GÀ NHÀ TUI');
      expect(html).toContain('TIỆM GÀ RÁN BÁC BA 1990');
      expect(html).toContain('VẠN SỰ NHƯ Ý • GÀ GIÒN PHÁT TÀI');
      expect(html).toContain('CHỢ LỚN BISTRO • GÀ RÁN ĐÊM');
      expect(html).toContain('ĐANG SỬ DỤNG');
    });

    it('4.2. Header cập nhật biển hiệu và icon của active theme', () => {
      const state = createInitialState();
      state.unlockedThemeIds = ['default', 'tet_mai_vang'];
      state.activeShopTheme = 'tet_mai_vang';

      const html = renderHeader(state);
      expect(html).toContain('🏮');
      expect(html).toContain('VẠN SỰ NHƯ Ý');
    });
  });

  describe('5. Bảo Lưu Trạng Thái Qua Save/Load', () => {
    it('5.1. migrateSave bảo toàn unlockedThemeIds và activeShopTheme', () => {
      const initial = createInitialState();
      initial.unlockedThemeIds = ['default', 'saigon_90s', 'neon_cho_lon'];
      initial.activeShopTheme = 'neon_cho_lon';

      const jsonStr = JSON.stringify(initial);
      const migrated = migrateSave(JSON.parse(jsonStr));

      expect(migrated).not.toBeNull();
      expect(migrated!.state.unlockedThemeIds).toEqual(['default', 'saigon_90s', 'neon_cho_lon']);
      expect(migrated!.state.activeShopTheme).toBe('neon_cho_lon');
    });
  });
});
