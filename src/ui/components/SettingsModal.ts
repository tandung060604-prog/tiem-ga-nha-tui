import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { music } from '../../core/music';
import { escapeHtml, SHOP_NAME_MAX } from '../escapeHtml';

export function renderSettingsModal(state: GameState): string {
  const isMuted = audio.getMuted();

  return `
    <div style="text-align: left; display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px;">
        <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: var(--ink);">⚙️ Cài Đặt Game</h3>
        <button id="btn-close-settings" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer;">✕</button>
      </div>

      ${state.phase === 'selling' ? `
      <!-- Đóng Cửa Hàng Sớm Hôm Nay -->
      <div style="background: #fff1f2; border: 2px solid #f43f5e; border-radius: 12px; padding: 12px; text-align: left; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.15);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 1.3rem;">🚪</span>
          <b style="font-size: 0.95rem; color: #9f1239;">Đóng Cửa Hàng Sớm Hôm Nay</b>
        </div>
        <div style="font-size: 0.78rem; color: #881337; margin-bottom: 10px; line-height: 1.45;">
          Nghỉ bán sớm nếu quán hết sạch nguyên liệu hoặc bạn muốn chốt ca ngay. Các đơn còn lại sẽ được kết thúc lịch sự và chuyển sang màn Tổng Kết Ngày.
        </div>
        <button id="btn-close-shop-early" class="btn-sm" style="width: 100%; min-height: 44px; font-weight: 800; font-size: 0.92rem; background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: 0; border-radius: 10px; cursor: pointer; box-shadow: 0 3px 8px rgba(190, 18, 60, 0.35);">
          🛑 NGHỈ BÁN SỚM & CHỐT SỔ NGÀY
        </button>
      </div>
      ` : ''}

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

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 800; color: var(--ink);">🎵 Nhạc nền</span>
        <button id="btn-settings-music" class="btn-sm ${music.isEnabled() ? 'primary' : ''}">
          ${music.isEnabled() ? 'BẬT 🎵' : 'TẮT 🔇'}
        </button>
      </div>

      <!-- Sliders Âm Lượng Riêng Biệt (report-tinh-nang #50) -->
      <div style="background: rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 2px;">
            <span>🔊 Âm lượng hiệu ứng (SFX)</span>
            <span id="label-sfx-vol">${Math.round((state.sfxVolume ?? 0.8) * 100)}%</span>
          </div>
          <input id="slider-sfx-vol" type="range" min="0" max="100" value="${Math.round((state.sfxVolume ?? 0.8) * 100)}"
            style="width: 100%; accent-color: var(--pixel-gold-dark, #c98e1e); cursor: pointer;" />
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 2px;">
            <span>🎵 Âm lượng nhạc nền (BGM)</span>
            <span id="label-bgm-vol">${Math.round((state.bgmVolume ?? 0.7) * 100)}%</span>
          </div>
          <input id="slider-bgm-vol" type="range" min="0" max="100" value="${Math.round((state.bgmVolume ?? 0.7) * 100)}"
            style="width: 100%; accent-color: var(--pixel-gold-dark, #c98e1e); cursor: pointer;" />
        </div>
      </div>

      <!-- Progression Stats -->
      <div style="background: var(--bg); border-radius: 12px; padding: 10px; font-size: 0.78rem; display: flex; flex-direction: column; gap: 4px;">
        <div>🍗 Tổng miếng gà đã chiên: <b>${state.lifetimeStats.totalFried}</b></div>
        <div>✨ Số lần chiên Perfect: <b>${state.lifetimeStats.perfectFriedCount}</b></div>
        <div>💸 Tổng doanh thu tích lũy: <b>${state.lifetimeStats.totalRevenue.toLocaleString('vi-VN')}đ</b></div>
      </div>

      ${state.integrity?.tampered ? `
        <div class="integrity-warning" style="background: #fff3e0; border: 1.5px solid #fb8c00; border-radius: 10px; padding: 10px; font-size: 0.78rem; color: #6d3a00;">
          <b>⚠️ Save này đã bị chỉnh sửa ngoài game</b><br/>
          Vẫn chơi tiếp được, nhưng kết thúc Viên mãn và Bí mật sẽ không được công nhận.
          <div style="margin-top: 4px; opacity: .8;">${state.integrity.reasons.slice(0, 3).map(r => escapeHtml(r)).join('<br/>')}</div>
        </div>` : ''}

      <!-- Sao lưu / khôi phục tiến trình (chuyển máy, hoặc khi trình duyệt tự xóa dữ liệu) -->
      <div class="save-backup" style="border-top: 1px dashed var(--line); padding-top: 10px;">
        <b style="font-size: 0.9rem;">💾 Tiến trình</b>
        <div style="font-size: 0.74rem; color: var(--soft); margin: 2px 0 8px;">Game tự lưu trên máy này. Chép mã sao lưu để chuyển máy hoặc phòng khi trình duyệt xóa dữ liệu. Mẹo iPhone: "Thêm vào Màn hình chính" để Safari không tự xóa.</div>
        <div style="display: flex; gap: 6px;">
          <button id="btn-export-save" class="btn-sm" style="flex: 1; min-height: 44px;">📤 Sao lưu</button>
          <button id="btn-import-save" class="btn-sm" style="flex: 1; min-height: 44px;">📥 Khôi phục</button>
        </div>
        <textarea id="save-code-box" rows="3" placeholder="Dán mã sao lưu (TGNT1.…) vào đây rồi bấm Khôi phục" style="width: 100%; box-sizing: border-box; margin-top: 8px; font-size: 16px; border: 2px solid var(--line); border-radius: 10px; padding: 8px; font-family: monospace;"></textarea>
      </div>

      <!-- Bac Ba Manual & Intro Cinematic -->
      <div style="border-top: 1px dashed var(--line); padding-top: 10px; display: flex; flex-direction: column; gap: 6px;">
        <button id="btn-settings-manual" class="btn-sm" style="width: 100%; padding: 8px; font-weight: 800; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 1.5px solid #22c55e; color: #14532d; border-radius: 8px;">
          📖 Cẩm Nang Bác Ba Truyền Nghề (Cách Chơi)
        </button>
        <button id="btn-settings-intro" class="btn-sm" style="width: 100%; padding: 8px; font-weight: 800; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); border: 1.5px solid #6366f1; color: #312e81; border-radius: 8px;">
          🎬 Xem Lại Video Mở Màn AI (Intro Cinematic)
        </button>
      </div>

      <!-- Version Changelog Dashboard -->
      <div style="border-top: 1px dashed var(--line); padding-top: 10px; text-align: center;">
        <button id="btn-settings-changelog" class="btn-sm" style="width: 100%; padding: 8px; font-weight: 800; background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #f59e0b; color: #92400e;">
          📜 Nhật Ký Cập Nhật Phiên Bản (v2.2.0)
        </button>
      </div>

      <!-- Story Ending Preview -->
      <div style="border-top: 1px dashed var(--line); padding-top: 10px; text-align: center;">
        <button id="btn-view-ending" class="btn-sm" style="width: 100%; padding: 8px; font-weight: 800; background: linear-gradient(135deg, #ffd166, #f4a261); border-color: #e76f51; color: #431407;">
          🏆 Kết thúc đã đạt (${(state.achievedEndings ?? []).length}/5)
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
