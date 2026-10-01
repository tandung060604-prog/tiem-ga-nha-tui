import { GameState } from '../../types/game';
import { CHAPTERS } from '../../content/chapters';
import { weekdayOf, isWeekend } from '../../core/clock';
import { currentChapterData, chapterProgress, depositStatus } from '../../core/progression';
import { finaleReady } from '../../content/endings';
import { ASSETS } from '../../content/assets';
import { DAILY_INCIDENTS } from '../../content/dailyIncidents';
import { getWeatherForDay } from '../../content/saigonWeather';
import { getClaimableBadgesCount } from '../../core/achievementsEngine';

export function renderChalkboard(state: GameState, currentEventTitle: string = 'Trời Nắng Ráo'): string {
  const currentChapter = currentChapterData(state);
  const nextChapter = CHAPTERS.find(c => c.number === state.currentChapter + 1);
  const deposit = depositStatus(state);
  const progressPercent = Math.round(chapterProgress(state) * 100);
  const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';
  const weather = getWeatherForDay(state.day);
  const day = state.day || 1;
  const chapter = state.currentChapter || 1;
  const claimableBadges = getClaimableBadgesCount(state);
  const hasPet = (state.adoptedPets && state.adoptedPets.length > 0) || (state.petPatio?.pets?.some(p => p.happiness > 0) && day >= 4);

  return `
    <div class="board chalkboard">
      <div class="board-header">
        <div class="board-title-box">
          <span class="board-kicker">KẾ HOẠCH HÔM NAY</span>
          <h2><img src="${ASSETS.icons.book}" class="board-pixel-icon-sm" alt="" /> Ngày ${state.day} · ${weekdayOf(state.day)}</h2>
        </div>
        <span class="weather-badge" title="${weather.flavorQuote}">${weather.icon} ${weather.name} · ${currentEventTitle}${isWeekend(state.day) ? ' · 🎉 Cuối tuần' : ''}</span>
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
          <!-- Các tính năng cơ bản Ngày 1: Tinh gọn tối đa chống ngợp -->
          <button id="btn-open-incidents" class="btn-sm btn-incident-card" title="78 sự kiện drama xóm hẻm">
            <img src="${ASSETS.icons.reviews}" class="btn-pixel-icon-sm" alt="" /> Sổ Tay Hẻm (${state.seenIncidentIds?.length ?? 0}/${DAILY_INCIDENTS.length})
          </button>
          <button id="btn-open-memories" class="btn-sm" style="background: #fef9c3; border: 1.5px solid #ca8a04; color: #854d0e; font-weight: 800;" title="Sổ Tay Kỷ Niệm: 36 Cư Dân, Hồ Sơ Thân Thiết, Tủ Kỷ Vật, 6 Kết Cục & Thư Thỏ Cam">
            📖 Kỷ Niệm Hẻm
          </button>

          <!-- Progressive Disclosure: Mở dần tính năng theo ngày để tránh rối cho người mới -->
          ${(day >= 2 || chapter >= 2) ? `
            <button id="btn-secret-sauce" class="btn-sm btn-sauce-card ${state.secretSauceDay?.buffActive ? 'is-active' : ''}" title="Pha nồi sốt bí truyền nhận Buff Vàng (+3k tip & +0.25★ Hương vị)">
              <img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-sm" alt="" /> ${state.secretSauceDay?.buffActive ? '✨ Sốt Thần Thánh' : 'Nấu Sốt Bí Truyền'}
            </button>
            <button id="btn-open-achievements" class="btn-sm" style="background: #fef08a; border: 1.5px solid #ca8a04; color: #854d0e; font-weight: 800; position: relative;" title="Bức Tường Bằng Khen Tổ Dân Phố Hẻm 1102">
              🏆 Bằng Khen ${claimableBadges > 0 ? `<span style="background: #dc2626; color: #fff; font-size: 0.6rem; padding: 1px 4px; border-radius: 6px; font-weight: 900; margin-left: 2px;">${claimableBadges}</span>` : ''}
            </button>
          ` : ''}

          ${(day >= 3 || chapter >= 2) ? `
            <button id="btn-weekly-quests" class="btn-sm" style="background: #fef3c7; border: 1.5px solid #d97706; color: #78350f; font-weight: 800;" title="Nhiệm vụ tuần nhận thưởng tiền mặt và danh hiệu">
              📜 Thử Thách Tuần
            </button>
            <button id="btn-open-night-radio" class="btn-sm" style="background: #2b1d0c; border: 1.5px solid #854d0e; color: #fde047; font-weight: 800;" title="Đài Phát Thanh Đêm Sài Gòn (FM 99.9 MHz)">
              📻 Đài Đêm
            </button>
          ` : ''}

          ${hasPet ? `
            <button id="btn-open-pet-patio" class="btn-sm" style="background: #fdf2f8; border: 1.5px solid #ec4899; color: #9d174d; font-weight: 800;" title="Góc Thú Cưng Hiên Quán (Cậu Vàng & Bé Mướp)">
              🐾 Thú Cưng
            </button>
          ` : ''}

          ${(day >= 4 || chapter >= 2) ? `
            <button id="btn-open-endless-mode" class="btn-sm" style="background: #4c0519; border: 1.5px solid #f43f5e; color: #fecdd3; font-weight: 800;" title="Thử thách sinh tồn bếp dồn dập (Rush Hour Wave Survival)">
              🌙 Ca Đêm Bất Tận
            </button>
          ` : ''}

          ${(day >= 5 || chapter >= 2) ? `
            <button id="btn-open-shop-themes" class="btn-sm" style="background: #fdf4ff; border: 1.5px solid #c084fc; color: #6b21a8; font-weight: 800;" title="Biển Hiệu Vintage & Đổi Giao Diện Quán">
              🏮 Biển Hiệu Vintage
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
