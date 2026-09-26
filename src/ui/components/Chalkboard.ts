import { GameState } from '../../types/game';
import { CHAPTERS } from '../../content/chapters';
import { weekdayOf, isWeekend } from '../../core/clock';
import { currentChapterData, chapterProgress, depositStatus } from '../../core/progression';
import { finaleReady } from '../../content/endings';

export function renderChalkboard(state: GameState, currentEventTitle: string = 'Trời Nắng Ráo'): string {
  const currentChapter = currentChapterData(state);
  const nextChapter = CHAPTERS.find(c => c.number === state.currentChapter + 1);
  const deposit = depositStatus(state);
  const progressPercent = Math.round(chapterProgress(state) * 100);
  const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  return `
    <div class="board">
      <div class="board-header">
        <h2>📋 Kế Hoạch Ngày ${state.day} · ${weekdayOf(state.day)}</h2>
        <span class="weather-badge">${currentEventTitle}${isWeekend(state.day) ? ' · 🎉 Cuối tuần đông khách' : ''}</span>
      </div>

      <div class="board-goal deposit-card ${deposit.ready ? 'is-ready' : ''}">
        <div class="goal-info">
          <span>🎯 Chương ${currentChapter.number}: ${currentChapter.title}</span>
          <span>${vnd(state.money)} / ${vnd(deposit.required)} (${progressPercent}%)</span>
        </div>
        <div class="goal-bar deposit-progress">
          <div class="goal-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        ${deposit.isFinal ? (finaleReady(state) ? `
          <button id="btn-finale" class="btn-sm primary">🏆 Dự lễ trao giải Gà Vàng</button>
        ` : '') : `
          <button id="btn-deposit" class="btn-sm ${deposit.ready ? 'primary' : ''}" ${deposit.ready ? '' : 'disabled'}>
            🔑 Đặt cọc ${vnd(deposit.cost)} → ${nextChapter?.title ?? 'chương mới'} (giữ lại ${vnd(deposit.required - deposit.cost)} vốn)
          </button>
          ${deposit.ready ? '' : `<small class="deposit-hint">Cần ${deposit.moneyOk ? '' : `quỹ ${vnd(deposit.required)}`}${!deposit.moneyOk && !deposit.starsOk ? ' và ' : ''}${deposit.starsOk ? '' : `${deposit.starsNeeded.toFixed(1)} sao (hiện ${state.ratings.overall.toFixed(1)})`}</small>`}
        `}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; gap: 6px; flex-wrap: wrap;">
        <div class="board-event-note" style="margin: 0; text-align: left; flex: 1; min-width: 160px;">
          "${currentChapter.description}"
        </div>
        <div style="display: flex; gap: 6px;">
          <button id="btn-open-bunny-notes" class="btn-sm" style="font-size: 0.72rem; padding: 4px 8px; white-space: nowrap; background: #fff3e0; border: 1.5px solid #ff9800; color: #e65100; font-weight: 800;">
            🐰 Thỏ Cam
          </button>
          <button id="btn-read-story" class="btn-sm primary" style="font-size: 0.72rem; padding: 4px 8px; white-space: nowrap;">
            📖 Truyện Hẻm 1102
          </button>
        </div>
      </div>
    </div>
  `;
}
