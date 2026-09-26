import { GameState, StoryEndingId } from '../../types/game';
import { STORY_ENDINGS } from '../../content/endings';
import { audio } from '../../core/audio';

export function renderEndingModal(state: GameState, endingId?: StoryEndingId): string {
  const currentEndingId = endingId || state.activeEnding || 'open';
  const data = STORY_ENDINGS[currentEndingId] || STORY_ENDINGS.open;
  const karma = state.karma || { community: 50, craftsmanship: 50, ambition: 50 };

  const totalRev = (state.lifetimeStats.totalRevenue || 0).toLocaleString('vi-VN') + 'đ';
  const stars = (state.ratings.overall || 4.0).toFixed(2) + '⭐';
  const bunnyNotes = `${(state.unlockedBunnyLetters || []).length}/6`;

  return `
    <div class="ending-modal-container" style="max-height: 85vh; overflow-y: auto;">
      <div class="ending-modal">
        <div class="ending-banner ${data.themeClass}">
          <div class="ending-kicker">${data.kicker}</div>
          <div class="ending-illustration" style="font-size: 2.8rem; margin: 6px 0;">${data.icon}</div>
          <div class="ending-title" style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: #fff;">${data.title}</div>
          <div class="ending-tagline" style="font-size: 0.8rem; opacity: 0.9; margin-top: 4px; font-style: italic;">“${data.tagline}”</div>
        </div>

        <div class="ending-body" style="padding: 14px; background: #fff;">
          <div class="ending-novel-excerpt" style="font-family: var(--font-body); font-size: 0.86rem; line-height: 1.6; color: #424242; margin-bottom: 14px; text-align: justify; background: #fdfbf7; border-left: 3px solid #ffb74d; padding: 10px 12px; border-radius: 4px;">
            ${data.excerpt}
          </div>

          <!-- Bảng Chỉ Số Nghiệp Cảm Thực Tế -->
          <div class="ending-karma-board" style="background: #fafafa; border: 1.5px solid var(--line); border-radius: 10px; padding: 12px; margin-bottom: 14px;">
            <div class="ending-karma-title" style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.76rem; color: var(--soft); margin-bottom: 10px;">
              <span>CHỈ SỐ NGHIỆP CẢM (KARMA)</span>
              <span>VẬN MỆNH TIỆM GÀ</span>
            </div>

            <!-- Community -->
            <div class="karma-metric" style="margin-bottom: 8px;">
              <div class="karma-metric-header" style="display: flex; justify-content: space-between; font-size: 0.76rem; font-weight: 700; margin-bottom: 3px;">
                <span>❤️ Tình Thân Hẻm (Community)</span>
                <span>${karma.community}%</span>
              </div>
              <div class="karma-bar" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div class="karma-fill community" style="height: 100%; width: ${karma.community}%; background: linear-gradient(90deg, #ef5350, #e53935); border-radius: 4px;"></div>
              </div>
            </div>

            <!-- Craftsmanship -->
            <div class="karma-metric" style="margin-bottom: 8px;">
              <div class="karma-metric-header" style="display: flex; justify-content: space-between; font-size: 0.76rem; font-weight: 700; margin-bottom: 3px;">
                <span>🔥 Bản Sắc Nghệ Nhân (Craft)</span>
                <span>${karma.craftsmanship}%</span>
              </div>
              <div class="karma-bar" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div class="karma-fill craftsmanship" style="height: 100%; width: ${karma.craftsmanship}%; background: linear-gradient(90deg, #ff9800, #f57c00); border-radius: 4px;"></div>
              </div>
            </div>

            <!-- Ambition -->
            <div class="karma-metric">
              <div class="karma-metric-header" style="display: flex; justify-content: space-between; font-size: 0.76rem; font-weight: 700; margin-bottom: 3px;">
                <span>💼 Tham Vọng Quy Mô (Ambition)</span>
                <span>${karma.ambition}%</span>
              </div>
              <div class="karma-bar" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div class="karma-fill ambition" style="height: 100%; width: ${karma.ambition}%; background: linear-gradient(90deg, #42a5f5, #1e88e5); border-radius: 4px;"></div>
              </div>
            </div>
          </div>

          <!-- Thống Kê Sự Nghiệp -->
          <div class="ending-stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
            <div class="ending-stat-box" style="background: #f5f5f5; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div class="ending-stat-val" style="font-weight: 800; font-size: 1rem; color: var(--ink);">${state.day} Ngày</div>
              <div class="ending-stat-lbl" style="font-size: 0.68rem; color: var(--soft);">Thời Gian Vận Hành</div>
            </div>
            <div class="ending-stat-box" style="background: #f5f5f5; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div class="ending-stat-val" style="font-weight: 800; font-size: 1rem; color: #2e7d32;">${totalRev}</div>
              <div class="ending-stat-lbl" style="font-size: 0.68rem; color: var(--soft);">Tổng Doanh Thu</div>
            </div>
            <div class="ending-stat-box" style="background: #f5f5f5; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div class="ending-stat-val" style="font-weight: 800; font-size: 1rem; color: #e65100;">${stars}</div>
              <div class="ending-stat-lbl" style="font-size: 0.68rem; color: var(--soft);">Đánh Giá Thực Khách</div>
            </div>
            <div class="ending-stat-box" style="background: #f5f5f5; border-radius: 8px; padding: 8px 10px; text-align: center;">
              <div class="ending-stat-val" style="font-weight: 800; font-size: 1rem; color: #6a1b9a;">${bunnyNotes} Thư</div>
              <div class="ending-stat-lbl" style="font-size: 0.68rem; color: var(--soft);">Kỷ Niệm Thỏ Cam</div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-close-ending" style="flex: 1; padding: 10px; border-radius: 10px; border: 2px solid var(--line); background: #fff; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
              Đóng Xem Lại
            </button>
            <button id="btn-restart-game" style="flex: 1; padding: 10px; border-radius: 10px; border: 2px solid var(--red); background: var(--red); color: #fff; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
              🔄 Chơi Lại Mới
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindEndingEvents(
  onClose: () => void,
  onRestart: () => void
) {
  const closeBtn = document.getElementById('btn-close-ending');
  if (closeBtn) {
    closeBtn.onclick = () => {
      audio.playPop();
      onClose();
    };
  }

  const restartBtn = document.getElementById('btn-restart-game');
  if (restartBtn) {
    restartBtn.onclick = () => {
      audio.playCash();
      onRestart();
    };
  }
}
