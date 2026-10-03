import { GameState } from '../../types/game';
import { getInviteUrl, getQrCodeUrl } from '../../core/leaderboard';
import { escapeHtml } from '../escapeHtml';

export function renderSocialShareModal(state: GameState): string {
  const roomId = (state.roomId || 'HEM1102').toUpperCase();
  const inviteUrl = getInviteUrl(roomId);
  const qrCodeUrl = getQrCodeUrl(inviteUrl);

  return `
    <div class="social-share-modal" style="text-align: left; display: flex; flex-direction: column; gap: 12px; max-height: 84vh; overflow-y: auto; background: #faf4e8; border-radius: 12px; padding: 16px; border: 3px solid #5a3018; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4a373; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.4rem;">👥</span>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #3d2314;">RỦ BẠN BÈ ĐUA TOP</h3>
            <div style="font-size: 0.72rem; color: #78350f; font-weight: 700;">Thi tài quản lý tiệm gà cùng bạn bè người thật</div>
          </div>
        </div>
        <button id="btn-close-social-share" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: #5a3018; font-weight: 800; padding: 2px 6px;">✕</button>
      </div>

      <!-- Current Room Badge -->
      <div style="background: #fffdf8; border: 2px dashed #b45309; border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
        <div>
          <div style="font-size: 0.7rem; color: #78350f; font-weight: 700;">MÃ PHÒNG ĐUA TOP HIỆN TẠI:</div>
          <div id="share-modal-room-code" style="font-size: 1.25rem; font-weight: 900; color: #b45309; letter-spacing: 1px;">
            ${escapeHtml(roomId)}
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button id="btn-open-change-room" class="btn-sm" style="font-size: 0.74rem; font-weight: 800; padding: 6px 10px; background: #e2e8f0; color: #334155; border: 1.5px solid #94a3b8; border-radius: 6px; cursor: pointer;">
            🔄 Đổi Phòng
          </button>
        </div>
      </div>

      <!-- Switch Room Box (Toggled) -->
      <div id="switch-room-container" style="display: none; background: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 8px; gap: 6px; flex-direction: column;">
        <label style="font-size: 0.74rem; font-weight: 800; color: #78350f;">Nhập mã phòng bạn bè muốn tham gia:</label>
        <div style="display: flex; gap: 6px;">
          <input type="text" id="input-new-room-id" placeholder="VD: NHOMBAN, SAIGON99..." maxlength="12" style="flex: 1; border: 2px solid #b45309; border-radius: 6px; padding: 6px 8px; font-weight: 800; font-size: 0.85rem; text-transform: uppercase;" />
          <button id="btn-confirm-switch-room" class="btn-sm is-primary" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 800; white-space: nowrap; cursor: pointer;">
            Xác Nhận
          </button>
        </div>
      </div>

      <!-- 1-Click Share & Copy Buttons -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="btn-native-share-room" class="pixel-btn is-primary" style="width: 100%; min-height: 46px; font-size: 0.92rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>📲 GỬI LINK QUA ZALO / MESSENGER</span>
        </button>

        <button id="btn-copy-room-link" class="btn-sm" style="width: 100%; min-height: 42px; font-size: 0.84rem; font-weight: 800; background: #fff; color: #3d2314; border: 2px solid #5a3018; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>📋 SAO CHÉP ĐƯỜNG LINK MỜI</span>
        </button>
      </div>

      <!-- QR Code Section -->
      <div style="background: #fff; border: 2px solid #5a3018; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="font-size: 0.76rem; font-weight: 800; color: #5a3018;">QUÉT MÃ QR BẰNG CAMERA ĐIỆN THOẠI</div>
        <img src="${qrCodeUrl}" alt="QR Mời Phòng" style="width: 160px; height: 160px; border-radius: 8px; border: 1.5px solid #d4a373;" />
        <div style="font-size: 0.7rem; color: #64748b; text-align: center;">
          Bạn bè quét mã sẽ vào thẳng phòng đua top cùng bạn!
        </div>
      </div>

      <!-- Poster Download Button -->
      <button id="btn-download-room-poster" class="btn-sm" style="width: 100%; min-height: 40px; font-size: 0.8rem; font-weight: 800; background: #faeed1; color: #78350f; border: 1.5px solid #b45309; border-radius: 8px; cursor: pointer;">
        🖼️ Tải Poster Thi Đấu Đẹp Mắt (PNG)
      </button>
    </div>
  `;
}
