import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { escapeHtml, SHOP_NAME_MAX } from '../escapeHtml';

export function renderSettingsModal(state: GameState): string {
  const isMuted = audio.getMuted();

  return `
    <div style="text-align: left; display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: var(--ink);">⚙️ Cài Đặt Game</h3>
        <button id="btn-close-settings" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer;">✕</button>
      </div>

      <!-- Rename Shop -->
      <div>
        <label style="display: block; font-size: 0.8rem; font-weight: 800; color: var(--soft); margin-bottom: 4px;">
          TÊN TIỆM GÀ RÁN
        </label>
        <div style="display: flex; gap: 6px;">
          <input id="input-shop-name" type="text" value="${escapeHtml(state.shopName)}" maxlength="${SHOP_NAME_MAX}"
            style="flex: 1; border: 2px solid var(--line); background: var(--bg); border-radius: 10px; padding: 8px 12px; font-weight: 800; font-size: 0.95rem; color: var(--ink);" />
          <button id="btn-save-shop-name" class="btn-sm primary">Lưu</button>
        </div>
      </div>

      <!-- Audio Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--line); padding-top: 10px;">
        <div>
          <b style="font-size: 0.9rem;">Âm thanh hiệu ứng</b>
          <div style="font-size: 0.74rem; color: var(--soft);">Tiếng chiên xèo xèo, chuông báo, keng tiền</div>
        </div>
        <button id="btn-settings-audio" class="btn-sm ${!isMuted ? 'primary' : ''}">
          ${!isMuted ? 'BẬT 🔊' : 'TẮT 🔇'}
        </button>
      </div>

      <!-- Progression Stats -->
      <div style="background: var(--bg); border-radius: 12px; padding: 10px; font-size: 0.78rem; display: flex; flex-direction: column; gap: 4px;">
        <div>🍗 Tổng miếng gà đã chiên: <b>${state.lifetimeStats.totalFried}</b></div>
        <div>✨ Số lần chiên Perfect: <b>${state.lifetimeStats.perfectFriedCount}</b></div>
        <div>💸 Tổng doanh thu tích lũy: <b>${state.lifetimeStats.totalRevenue.toLocaleString('vi-VN')}đ</b></div>
      </div>

      <!-- Story Ending Preview -->
      <div style="border-top: 1px dashed var(--line); padding-top: 10px; text-align: center;">
        <button id="btn-view-ending" class="btn-sm" style="width: 100%; padding: 8px; font-weight: 800; background: linear-gradient(135deg, #ffd166, #f4a261); border-color: #e76f51; color: #431407;">
          🏆 Xem Vận Mệnh Tiệm Gà (Ending)
        </button>
      </div>

      <!-- Reset Game -->
      <div style="border-top: 1px dashed var(--line); padding-top: 10px; text-align: center;">
        <button id="btn-reset-game" class="btn-sm" style="color: var(--warn); border-color: var(--warn); width: 100%; padding: 8px;">
          🗑️ Chơi lại từ đầu (Xóa Save)
        </button>
      </div>
    </div>
  `;
}
