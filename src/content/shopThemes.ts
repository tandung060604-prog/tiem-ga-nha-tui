import { GameState, ShopTheme, ShopThemeId } from '../types/game';

/**
 * 4 BỘ GIAO DIỆN & BIỂN HIỆU QUÁN VINTAGE (SHOP SKINS & SIGNBOARDS)
 * Mang đậm bản sắc Sài Gòn từ xe đẩy mộc mạc, hoài niệm thập niên 90,
 * sắc xuân Tết đoàn viên cho đến phố đêm neon rực rỡ Chợ Lớn.
 */
export const SHOP_THEMES: ShopTheme[] = [
  {
    id: 'default',
    name: 'Tiệm Mộc Mạc Hẻm 1102',
    signboardTitle: 'TIỆM GÀ NHÀ TUI',
    signboardSubtitle: 'Đầu Hẻm 1102 • Giòn Rụm Yêu Thương',
    icon: '🍗',
    cssClass: 'theme-default',
    desc: 'Chiếc xe đẩy gỗ mộc đơn sơ những ngày đầu khởi nghiệp, bảng hiệu gỗ đóng đinh mộc mạc thơm mùi dầu mới.',
    unlockDay: 1,
    unlockCost: 0,
    atmosphereBuff: 'Không gian thân thuộc: Gần gũi bà con xóm giềng Hẻm 1102.',
    accentColor: '#d97706',
    previewCardStyle: 'background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2.5px solid #d97706; color: #78350f;',
  },
  {
    id: 'saigon_90s',
    name: 'Sài Gòn Thập Niên 90',
    signboardTitle: 'TIỆM GÀ RÁN BÁC BA 1990',
    signboardSubtitle: 'Chuyên Gà Xối Mỡ • Trà Đá Chợ Cũ Sài Gòn',
    icon: '📻',
    cssClass: 'theme-saigon-90s',
    desc: 'Biển tôn sơn vẽ tay kiểu xưa với font chữ cong vút, gam màu vàng nghệ và xanh cổ vịt hoài niệm thập niên 90.',
    unlockDay: 5,
    unlockCost: 250000,
    atmosphereBuff: 'Hoài niệm Bác Ba: Khách lớn tuổi & cư dân hẻm kiên nhẫn hơn +2s khi chờ món.',
    accentColor: '#0d9488',
    previewCardStyle: 'background: linear-gradient(135deg, #ccfbf1, #99f6e4); border: 2.5px solid #0d9488; color: #115e59;',
  },
  {
    id: 'tet_mai_vang',
    name: 'Tết Mai Vàng Đoàn Viên',
    signboardTitle: 'VẠN SỰ NHƯ Ý • GÀ GIÒN PHÁT TÀI',
    signboardSubtitle: 'Khai Xuân Đắc Lộc • Hạnh Phúc Tràn Đầy',
    icon: '🏮',
    cssClass: 'theme-tet-mai-vang',
    desc: 'Đèn lồng đỏ rực rỡ, câu đối chúc Tết vàng son, cành mai nở rộ quanh quầy bếp mang lại tài lộc và vận may.',
    unlockDay: 10,
    unlockCost: 600000,
    atmosphereBuff: 'Khí sắc năm mới: Khách ghé ăn hào phóng lì xì tip thêm +10% toàn ca.',
    accentColor: '#dc2626',
    previewCardStyle: 'background: linear-gradient(135deg, #fee2e2, #fecaca); border: 2.5px solid #dc2626; color: #991b1b;',
  },
  {
    id: 'neon_cho_lon',
    name: 'Neon Phố Đêm Chợ Lớn',
    signboardTitle: 'CHỢ LỚN BISTRO • GÀ RÁN ĐÊM',
    signboardSubtitle: 'Đèn Neon Rực Rỡ • Đậm Đà Hương Vị Phố Hoa',
    icon: '🌃',
    cssClass: 'theme-neon-cho-lon',
    desc: 'Ánh đèn neon hồng tím huyền ảo, bảng LED nhấp nháy nghệ thuật mang đậm phong cách phố đêm sầm uất.',
    unlockDay: 20,
    unlockCost: 1500000,
    atmosphereBuff: 'Sức hút check-in thời thượng: Khách GenZ và thực khách sành ăn ghé quán tăng +15%.',
    accentColor: '#a855f7',
    previewCardStyle: 'background: linear-gradient(135deg, #18181b, #27272a); border: 2.5px solid #c084fc; color: #e9d5ff; box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);',
  },
];

export function getShopTheme(id: ShopThemeId): ShopTheme {
  const found = SHOP_THEMES.find(t => t.id === id);
  return found || SHOP_THEMES[0]!;
}

export function getAllShopThemes(): ShopTheme[] {
  return SHOP_THEMES;
}

export function canUnlockShopTheme(
  state: GameState,
  themeId: ShopThemeId
): { canUnlock: boolean; reason?: string } {
  const theme = getShopTheme(themeId);
  const unlocked = state.unlockedThemeIds || ['default'];

  if (unlocked.includes(themeId)) {
    return { canUnlock: false, reason: 'Giao diện này đã được mở khóa!' };
  }

  if (state.day < theme.unlockDay) {
    return { canUnlock: false, reason: `Cần đạt Ngày ${theme.unlockDay} để mở khóa mẫu biển hiệu này.` };
  }

  if (state.money < theme.unlockCost) {
    return {
      canUnlock: false,
      reason: `Không đủ kinh phí sơn sửa quán! Cần ${theme.unlockCost.toLocaleString('vi-VN')}đ (Hiện có ${state.money.toLocaleString('vi-VN')}đ).`,
    };
  }

  return { canUnlock: true };
}

export function unlockShopTheme(
  state: GameState,
  themeId: ShopThemeId
): { success: boolean; message: string } {
  const check = canUnlockShopTheme(state, themeId);
  if (!check.canUnlock) {
    return { success: false, message: check.reason || 'Không thể mở khóa giao diện này.' };
  }

  const theme = getShopTheme(themeId);
  state.money -= theme.unlockCost;
  if (!state.unlockedThemeIds) state.unlockedThemeIds = ['default'];
  if (!state.unlockedThemeIds.includes(themeId)) {
    state.unlockedThemeIds.push(themeId);
  }
  state.activeShopTheme = themeId;

  return {
    success: true,
    message: `Đã mở khóa và treo biển hiệu mới: "${theme.name}"! ${theme.atmosphereBuff}`,
  };
}

export function applyShopTheme(
  state: GameState,
  themeId: ShopThemeId
): { success: boolean; message: string } {
  const unlocked = state.unlockedThemeIds || ['default'];
  if (!unlocked.includes(themeId)) {
    return { success: false, message: 'Bạn chưa mở khóa giao diện quán này!' };
  }

  state.activeShopTheme = themeId;
  const theme = getShopTheme(themeId);
  return {
    success: true,
    message: `Đã chuyển sang giao diện: "${theme.name}"!`,
  };
}

export const setActiveShopTheme = applyShopTheme;

export function getActiveShopTheme(state: GameState): ShopTheme {
  const currentId = state.activeShopTheme || 'default';
  return getShopTheme(currentId);
}

