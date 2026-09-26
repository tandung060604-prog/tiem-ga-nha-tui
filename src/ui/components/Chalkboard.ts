import { GameState } from '../../types/game';
import { CHAPTERS } from '../../content/chapters';
import { weekdayOf, isWeekend } from '../../core/clock';
import { currentChapterData, chapterProgress, depositStatus } from '../../core/progression';
import { finaleReady } from '../../content/endings';
import { ASSETS } from '../../content/assets';

export function renderChalkboard(state: GameState, currentEventTitle: string = 'Trời Nắng Ráo'): string {
  const currentChapter = currentChapterData(state);
  const nextChapter = CHAPTERS.find(c => c.number === state.currentChapter + 1);
  const deposit = depositStatus(state);
  const progressPercent = Math.round(chapterProgress(state) * 100);
  const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  return `
    <div class="board">
      <div class="board-top-banner">
        <span class="bistro-badge">
          <span class="bistro-fire">🍗</span> KOREAN CHICKEN BISTRO
        </span>
        <img class="board-neon-sticker" src="${ASSETS.ui.stickerNeon}" alt="치킨" />
      </div>

      <div class="board-header">
        <div class="board-title-box">
          <span class="board-kicker">KẾ HOẠCH HÔM NAY</span>
          <h2>📋 Ngày ${state.day} · ${weekdayOf(state.day)}</h2>
        </div>
        <span class="weather-badge">${currentEventTitle}${isWeekend(state.day) ? ' · 🎉 Cuối tuần đông khách' : ''}</span>
      </div>

      <div class="board-goal deposit-card ${deposit.ready ? 'is-ready' : ''}">
        <div class="goal-info">
          <span class="goal-chapter-label">🎯 Chương ${currentChapter.number}: ${currentChapter.title}</span>
          <span class="goal-money-val">${vnd(state.money)} / ${vnd(deposit.required)} <b class="goal-pct">(${progressPercent}%)</b></span>
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

      <div class="board-footer">
        <div class="board-event-note-wrapper">
          <img class="board-drumstick-sticker" src="${ASSETS.ui.stickerDrumstick}" alt="Gà sốt" />
          <div class="board-event-note">
            "${currentChapter.description}"
          </div>
        </div>
        <div class="board-btns">
          <button id="btn-open-bunny-notes" class="btn-sm btn-bunny-card">
            🐰 Thỏ Cam
          </button>
          <button id="btn-open-incidents" class="btn-sm btn-incident-card">
            🎭 Sổ Tay Hẻm (${state.seenIncidentIds?.length ?? 0}/25)
          </button>
          <button id="btn-read-story" class="btn-sm primary btn-story-card">
            📖 Truyện Hẻm 1102
          </button>
        </div>
      </div>
    </div>
  `;
}
