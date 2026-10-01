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
    <div class="board chalkboard">
      <div class="board-top-banner">
        <span class="bistro-badge">
          <img src="${ASSETS.icons.fireRush}" class="board-pixel-icon-xs" alt="" /> KOREAN CHICKEN BISTRO
        </span>
        <img class="board-neon-sticker" src="${ASSETS.ui.stickerNeon}" alt="치킨" />
      </div>

      <div class="board-header">
        <div class="board-title-box">
          <span class="board-kicker">KẾ HOẠCH HÔM NAY</span>
          <h2><img src="${ASSETS.icons.book}" class="board-pixel-icon-sm" alt="" /> Ngày ${state.day} · ${weekdayOf(state.day)}</h2>
        </div>
        <span class="weather-badge">${currentEventTitle}${isWeekend(state.day) ? ' · 🎉 Cuối tuần đông khách' : ''}</span>
      </div>

      <div class="board-goal deposit-card ${deposit.ready ? 'is-ready' : ''}">
        <div class="goal-info">
          <span class="goal-chapter-label"><img src="${ASSETS.icons.upgrade}" class="board-pixel-icon-xs" alt="" /> Chương ${currentChapter.number}: ${currentChapter.title}</span>
          <span class="goal-money-val">${vnd(state.money)} / ${vnd(deposit.required)} <b class="goal-pct">(${progressPercent}%)</b></span>
        </div>
        <div class="goal-bar deposit-progress">
          <div class="goal-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        ${deposit.isFinal ? (finaleReady(state) ? `
          <button id="btn-finale" class="btn-sm primary"><img src="${ASSETS.icons.star}" class="btn-pixel-icon-xs" alt="" /> Dự lễ trao giải Gà Vàng</button>
        ` : `
          <small class="deposit-hint">🏆 Lễ Trao Giải Gà Vàng: Cần quỹ ${vnd(deposit.required)}${state.money < deposit.required ? ` (còn thiếu ${vnd(deposit.required - state.money)})` : ''} và gắn bó tiệm ít nhất 100 ngày (hiện Ngày ${state.day || 1}/100).</small>
        `) : `
          <button id="btn-deposit" class="btn-sm ${deposit.ready ? 'primary' : ''}" ${deposit.ready ? '' : 'disabled'}>
            <img src="${ASSETS.icons.lock}" class="btn-pixel-icon-xs" alt="" /> Đặt cọc ${vnd(deposit.cost)} → ${nextChapter?.title ?? 'chương mới'} (giữ lại ${vnd(deposit.required - deposit.cost)} vốn)
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
          <button id="btn-weekly-quests" class="btn-sm" style="background: #fef3c7; border: 1.5px solid #d97706; color: #78350f; font-weight: 800;" title="Nhiệm vụ tuần nhận thưởng tiền mặt và danh hiệu">
            📜 Thử Thách Tuần
          </button>
          <button id="btn-secret-sauce" class="btn-sm btn-sauce-card ${state.secretSauceDay?.buffActive ? 'is-active' : ''}" title="Pha nồi sốt bí truyền nhận Buff Vàng (+3k tip & +0.25★ Hương vị)">
            <img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-sm" alt="" /> ${state.secretSauceDay?.buffActive ? '✨ Sốt Thần Thánh' : 'Nấu Sốt Bí Truyền'}
          </button>
          <button id="btn-open-bunny-notes" class="btn-sm btn-bunny-card">
            <img src="${ASSETS.ui.bunnyNote}" class="btn-pixel-icon-sm" alt="" /> Thỏ Cam
          </button>
          <button id="btn-open-incidents" class="btn-sm btn-incident-card">
            <img src="${ASSETS.icons.reviews}" class="btn-pixel-icon-sm" alt="" /> Sổ Tay Hẻm (${state.seenIncidentIds?.length ?? 0}/25)
          </button>
          <button id="btn-read-story" class="btn-sm primary btn-story-card">
            <img src="${ASSETS.icons.book}" class="btn-pixel-icon-sm" alt="" /> Truyện Hẻm 1102
          </button>
        </div>
      </div>
    </div>
  `;
}
