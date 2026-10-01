import { GameState } from '../../types/game';
import { SHOP_THEMES, canUnlockShopTheme } from '../../content/shopThemes';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * RENDER MODAL PHÒNG TRƯNG BÀY BIỂN HIỆU & GIAO DIỆN QUÁN (SHOP THEME MODAL)
 */
export function renderShopThemeModal(state: GameState): string {
  const currentThemeId = state.activeShopTheme || 'default';
  const unlockedThemeIds = state.unlockedThemeIds || ['default'];

  const themeCardsHtml = SHOP_THEMES.map(theme => {
    const isCurrent = currentThemeId === theme.id;
    const isUnlocked = unlockedThemeIds.includes(theme.id);
    const unlockCheck = canUnlockShopTheme(state, theme.id);

    let actionBtnHtml = '';
    if (isCurrent) {
      actionBtnHtml = `
        <button class="btn-sm" disabled style="background: #16a34a; color: #fff; border: none; font-weight: 800; padding: 6px 14px; border-radius: 6px; cursor: default; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);">
          ⭐ ĐANG SỬ DỤNG
        </button>
      `;
    } else if (isUnlocked) {
      actionBtnHtml = `
        <button class="btn-sm btn-apply-theme" data-theme-id="${theme.id}" style="background: #2563eb; color: #fff; border: none; font-weight: 800; padding: 6px 14px; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);">
          🔄 Treo Biển Này
        </button>
      `;
    } else if (unlockCheck.canUnlock) {
      actionBtnHtml = `
        <button class="btn-sm btn-unlock-theme" data-theme-id="${theme.id}" style="background: #ea580c; color: #fff; border: none; font-weight: 800; padding: 6px 14px; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);">
          🔨 Sơn Sửa & Treo Biển (${theme.unlockCost.toLocaleString('vi-VN')}đ)
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button class="btn-sm" disabled style="background: #d6d3d1; color: #78716c; border: 1px solid #a8a29e; font-weight: 700; padding: 6px 14px; border-radius: 6px; cursor: not-allowed;">
          🔒 Mở Ngày ${theme.unlockDay} (${theme.unlockCost.toLocaleString('vi-VN')}đ)
        </button>
      `;
    }

    return `
      <div class="theme-card" style="background: #fff; border: 2px solid ${isCurrent ? '#16a34a' : isUnlocked ? '#e2e8f0' : '#cbd5e1'}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: ${isCurrent ? '0 4px 14px rgba(22, 163, 74, 0.2)' : '0 2px 6px rgba(0,0,0,0.05)'};">
        
        <!-- Preview Biển Hiệu Vintage -->
        <div style="${theme.previewCardStyle} border-radius: 8px; padding: 10px 12px; text-align: center;">
          <div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.85;">
            ${escapeHtml(theme.signboardSubtitle)}
          </div>
          <div style="font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px; margin: 2px 0;">
            ${escapeHtml(theme.signboardTitle)}
          </div>
          <div style="font-size: 0.65rem; font-style: italic; opacity: 0.9;">
            ${theme.icon} ${escapeHtml(theme.name)}
          </div>
        </div>

        <!-- Thông Tin Chi Tiết -->
        <div style="font-size: 0.76rem; color: #475569; line-height: 1.4;">
          ${escapeHtml(theme.desc)}
        </div>

        <!-- Buff Bầu Không Khí Quán -->
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 6px 8px; font-size: 0.72rem; color: #0f172a; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1rem;">✨</span>
          <div style="flex: 1; font-weight: 700;">
            ${escapeHtml(theme.atmosphereBuff)}
          </div>
        </div>

        <!-- Nút Thao Tác -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 2px;">
          ${actionBtnHtml}
        </div>

      </div>
    `;
  }).join('');

  return `
    <div id="modal-shop-theme" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1070; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 88vh; background: #fafaf9; border: 3px solid #78350f; border-radius: 16px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); display: flex; flex-direction: column; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #78350f, #92400e); color: #fff; padding: 12px 16px; border-bottom: 2px solid #451a03; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; color: #fde68a; text-transform: uppercase;">
              🎨 THẨM MỸ HẺM 1102
            </div>
            <div style="font-size: 1rem; font-weight: 900; color: #fff;">
              Biển Hiệu & Giao Diện Quán
            </div>
          </div>
          <button id="btn-close-shop-theme-top" style="background: transparent; border: none; font-size: 1.2rem; color: #fde68a; cursor: pointer;">✕</button>
        </div>

        <!-- Body Scrollable -->
        <div style="padding: 12px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px;">
          <div style="font-size: 0.74rem; color: #57534e; font-style: italic; background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid #e7e5e4;">
            Mỗi thời kỳ Sài Gòn mang một vẻ đẹp riêng. Đổi biển hiệu và sơn sửa quán sẽ tạo không gian mới mẻ và buff tâm lý thực khách ghé tiệm!
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${themeCardsHtml}
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 10px 14px; background: #f5f5f4; border-top: 1px solid #e7e5e4; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.72rem; color: #78716c; font-weight: 700;">
            Ví tiệm: <b style="color: #16a34a;">${state.money.toLocaleString('vi-VN')}đ</b>
          </div>
          <button id="btn-close-shop-theme" class="btn-sm" style="background: #e7e5e4; color: #292524; border: 1px solid #d6d3d1; padding: 6px 16px; font-size: 0.78rem; font-weight: 800; border-radius: 6px; cursor: pointer;">
            Đóng
          </button>
        </div>

      </div>
    </div>
  `;
}
