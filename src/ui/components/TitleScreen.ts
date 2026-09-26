import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { CHAPTERS } from '../../content/chapters';
import { escapeHtml } from '../escapeHtml';

// Màn tiêu đề: logo, tên game, Chơi tiếp / Chơi mới. Chạm đầu tiên ở đây bật âm thanh trên iOS.
// Style tạm để inline; Gemini 1 chuyển sang CSS các class .title-* (xem docs/phan-cong.md).
export function renderTitleScreen(state: GameState, hasProgress: boolean, musicOn: boolean): string {
  const chapter = CHAPTERS.find(c => c.number === state.currentChapter);
  return `
    <div id="title-screen" class="title-screen" style="position: fixed; inset: 0; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom)); background: radial-gradient(circle at 50% 30%, #fff6e3 0%, #fdf3e4 45%, #f4d9b0 100%); text-align: center;">
      <div class="title-awning" style="position: absolute; top: 0; left: 0; right: 0; height: calc(18px + env(safe-area-inset-top)); background: repeating-linear-gradient(90deg, #e63946 0 28px, #fffaf2 28px 56px);"></div>
      <img class="title-logo" src="${ASSETS.gabong.front}" alt="Gà Bông" width="168" height="168" style="filter: drop-shadow(0 8px 12px rgba(61,44,46,.25)); animation: gabongBob 2.5s ease-in-out infinite;" />
      <h1 class="title-name" style="margin: 0; font-family: var(--font-display); font-size: 2.3rem; line-height: 1; color: #e63946; text-shadow: 0 3px 0 #3d2c2e22; letter-spacing: .5px;">TIỆM GÀ<br/>NHÀ TUI</h1>
      <p class="title-tagline" style="margin: 0; max-width: 300px; color: #8a6452; font-weight: 600; font-size: .92rem;">Từ xe đẩy đầu hẻm đến chuỗi gà quốc dân</p>
      ${hasProgress ? `
        <div class="title-save" style="font-size: .8rem; color: #3d2c2e; background: #fffaf2; border: 2px solid #ead7bd; border-radius: 999px; padding: 4px 12px;">
          🍗 ${escapeHtml(state.shopName)} · Ngày ${state.day}${chapter ? ` · Chương ${chapter.number}` : ''}
        </div>` : ''}
      <div class="title-actions" style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; margin-top: 6px;">
        <button id="btn-title-play" class="btn-big-open" style="min-height: 56px; font-size: 1.15rem;">
          ${hasProgress ? '▶ CHƠI TIẾP' : '▶ BẮT ĐẦU'}
        </button>
        ${hasProgress ? '<button id="btn-title-new" class="btn-sm" style="min-height: 44px;">🆕 Chơi mới từ đầu</button>' : ''}
        <button id="btn-title-music" class="btn-sm" style="min-height: 44px;">${musicOn ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt'}</button>
      </div>
      <small class="title-hint" style="position: absolute; bottom: calc(14px + env(safe-area-inset-bottom)); color: #8a6452; opacity: .8;">Chơi dọc trên điện thoại · Thêm vào Màn hình chính để chơi toàn màn</small>
    </div>
  `;
}
