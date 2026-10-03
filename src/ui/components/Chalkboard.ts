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
    <div class="board chalkboard" id="main-chalkboard">
      <div class="board-header">
        <div class="board-title-box">
          <span class="board-kicker">KẾ HOẠCH HÔM NAY</span>
          <h2><img src="${ASSETS.icons.book}" class="board-pixel-icon-sm" alt="" /> Ngày ${state.day} · ${weekdayOf(state.day)}</h2>
        </div>
        <div class="board-header-right" style="display: flex; align-items: center; gap: 6px;">
          <span class="weather-badge" title="${weather.flavorQuote}">${weather.name} · ${currentEventTitle}${isWeekend(state.day) ? ' · Cuối tuần' : ''}</span>
          <button id="btn-toggle-chalkboard" class="btn-chalkboard-toggle" title="Thu gọn / Mở rộng Bảng Kế Hoạch">
            <span class="toggle-icon">▼</span>
          </button>
        </div>
      </div>

      <!-- Compact 1-Line Strip when collapsed -->
      <div class="board-compact-strip" id="board-compact-strip">
        <span><img src="${ASSETS.icons.book}" class="board-pixel-icon-xs" alt="" /> Ch.${currentChapter.number}: ${currentChapter.title}</span>
        <span class="sep">•</span>
        <span><img src="${ASSETS.icons.target}" class="board-pixel-icon-xs" alt="" /> ${vnd(state.money)} / ${vnd(deposit.required)} (${progressPercent}%)</span>
        <span class="sep">•</span>
        <span class="compact-status ${deposit.ready ? 'ready' : ''}">${deposit.ready ? 'Đã đủ cọc!' : 'Đang tích vốn'}</span>
      </div>

      <div class="board-collapsible-body" id="board-collapsible-body">
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
            <small class="deposit-hint"><img src="${ASSETS.icons.trophy}" class="btn-pixel-icon-xs" alt="" /> Lễ Trao Giải Gà Vàng: Cần quỹ ${vnd(deposit.required)}${state.money < deposit.required ? ` (còn thiếu ${vnd(deposit.required - state.money)})` : ''} và gắn bó tiệm ít nhất 100 ngày (hiện Ngày ${state.day || 1}/100).</small>
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
          <!-- HỘC TỦ ĐỒ NGHỀ TIỆM GÀ (STARDEW TOOLBOX CABINET 4 NGĂN) -->
          <div class="toolbox-cabinet">
            <div class="toolbox-header">
              <span class="toolbox-title">
                <img src="${ASSETS.icons.inventory}" class="pixel-section-icon" alt="" />
                HỘC TỦ ĐỒ NGHỀ TIỆM GÀ
              </span>
              <span class="toolbox-subtitle">Tính Năng & Sự Kiện Hẻm 1102</span>
            </div>

            <div class="toolbox-grid">
              <!-- Ngăn 1: Ký Sự & Bằng Khen -->
              <div class="toolbox-drawer drawer-lore">
                <div class="drawer-header">
                  <img src="${ASSETS.icons.book}" class="btn-pixel-icon-xs" alt="" /> Ký Sự & Kỷ Niệm
                </div>
                <div class="drawer-actions">
                  <button id="btn-open-memories" class="btn-sm btn-toolbox" title="Sổ Tay Kỷ Niệm: Cư Dân Hẻm, Tủ Kỷ Vật, 6 Kết Cục & 18 Mảnh Giấy Nhớ Gà Bông">
                    <img src="${ASSETS.icons.heart}" class="btn-pixel-icon-xs" alt="" /> Kỷ Niệm Hẻm
                  </button>
                  <button id="btn-open-loyalty-handbook" class="btn-sm btn-toolbox ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? 'has-gift' : ''}" title="Sổ Tay Tri Kỷ Hẻm 1102 & Quà Tiếp Tế Cư Dân">
                    <img src="${ASSETS.icons.heart}" class="btn-pixel-icon-xs" alt="" /> Tri Kỷ Hẻm ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? '<span class="badge-dot-pulse">🎁</span>' : ''}
                  </button>
                  ${(day >= 2 || chapter >= 2) ? `
                    <button id="btn-open-achievements" class="btn-sm btn-toolbox ${claimableBadges > 0 ? 'has-badge' : ''}" title="Bức Tường Bằng Khen Tổ Dân Phố Hẻm 1102">
                      <img src="${ASSETS.icons.trophy}" class="btn-pixel-icon-xs" alt="" /> Bằng Khen
                      ${claimableBadges > 0 ? `<span class="badge-dot-pulse">${claimableBadges}</span>` : ''}
                    </button>
                  ` : ''}
                  <button id="btn-open-incidents" class="btn-sm btn-toolbox btn-incident-card" title="78 sự kiện drama xóm hẻm">
                    <img src="${ASSETS.icons.reviews}" class="btn-pixel-icon-xs" alt="" /> Sổ Tay Hẻm (${state.seenIncidentIds?.length ?? 0}/${DAILY_INCIDENTS.length})
                  </button>
                </div>
              </div>

              ${(day >= 2 || chapter >= 2) ? `
              <!-- Ngăn 2: Bếp Nghệ Nhân & Decor -->
              <div class="toolbox-drawer drawer-kitchen">
                <div class="drawer-header">
                  <img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-xs" alt="" /> Bếp & Không Gian
                </div>
                <div class="drawer-actions">
                  <button id="btn-secret-sauce" class="btn-sm btn-toolbox btn-sauce-card ${state.secretSauceDay?.buffActive ? 'is-active' : ''}" title="Pha nồi sốt bí truyền nhận Buff Vàng (+3k tip & +0.25★ Hương vị)">
                    <img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-xs" alt="" /> ${state.secretSauceDay?.buffActive ? '✨ Sốt Thần Thánh' : 'Nấu Sốt Bí Truyền'}
                  </button>
                  ${(day >= 5 || chapter >= 2) ? `
                    <button id="btn-open-shop-themes" class="btn-sm btn-toolbox" title="Biển Hiệu Vintage & Đổi Giao Diện Quán">
                      <img src="${ASSETS.icons.upgrade}" class="btn-pixel-icon-xs" alt="" /> Biển Hiệu Vintage
                    </button>
                  ` : `
                    <span class="drawer-locked-hint">🔒 Biển hiệu (Ngày 5)</span>
                  `}
                </div>
              </div>
              ` : ''}

              ${(day >= 3 || chapter >= 2) ? `
              <!-- Ngăn 3: Chốn Bình Yên Hẻm -->
              <div class="toolbox-drawer drawer-cozy">
                <div class="drawer-header">
                  <img src="${ASSETS.icons.radio}" class="btn-pixel-icon-xs" alt="" /> Chốn Nghỉ Hẻm
                </div>
                <div class="drawer-actions">
                  <button id="btn-open-night-radio" class="btn-sm btn-toolbox" title="Đài Phát Thanh Đêm Sài Gòn (FM 99.9 MHz)">
                    <img src="${ASSETS.icons.radio}" class="btn-pixel-icon-xs" alt="" /> Đài Đêm FM 99.9
                  </button>
                  ${hasPet ? `
                    <button id="btn-open-pet-patio" class="btn-sm btn-toolbox" title="Góc Thú Cưng Hiên Quán (Cậu Vàng & Bé Mướp)">
                      <img src="${ASSETS.icons.cat}" class="btn-pixel-icon-xs" alt="" /> Thú Cưng Hiên Quán
                    </button>
                  ` : `
                    <span class="drawer-locked-hint">🐾 Nhận nuôi bé (Ngày 4)</span>
                  `}
                </div>
              </div>
              ` : ''}

              ${(day >= 3 || chapter >= 2) ? `
              <!-- Ngăn 4: Thử Thách & Đua Top -->
              <div class="toolbox-drawer drawer-arena">
                <div class="drawer-header">
                  <img src="${ASSETS.icons.target}" class="btn-pixel-icon-xs" alt="" /> Thử Thách & Đua Top
                </div>
                <div class="drawer-actions">
                  <button id="btn-weekly-quests" class="btn-sm btn-toolbox" title="Nhiệm vụ tuần nhận thưởng tiền mặt và danh hiệu">
                    <img src="${ASSETS.icons.target}" class="btn-pixel-icon-xs" alt="" /> Thử Thách Tuần
                  </button>
                  ${(day >= 4 || chapter >= 2) ? `
                    <button id="btn-open-endless-mode" class="btn-sm btn-toolbox" title="Thử thách sinh tồn bếp dồn dập (Rush Hour Wave Survival)">
                      <img src="${ASSETS.icons.fireRush}" class="btn-pixel-icon-xs" alt="" /> Ca Đêm Bất Tận
                    </button>
                  ` : `
                    <span class="drawer-locked-hint">🔒 Ca bất tận (Ngày 4)</span>
                  `}
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
