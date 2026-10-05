import { GameState } from '../../types/game';
import { CHAPTERS } from '../../content/chapters';
import { weekdayOf, isWeekend } from '../../core/clock';
import { currentChapterData, chapterProgress, depositStatus } from '../../core/progression';
import { finaleReady } from '../../content/endings';
import { ASSETS } from '../../content/assets';
import { DAILY_INCIDENTS } from '../../content/dailyIncidents';
import { getClaimableBadgesCount } from '../../core/achievementsEngine';

export function renderChalkboard(state: GameState, currentEventTitle: string = 'Trời Nắng Ráo'): string {
  const currentChapter = currentChapterData(state);
  const nextChapter = CHAPTERS.find(c => c.number === state.currentChapter + 1);
  const deposit = depositStatus(state);
  const progressPercent = Math.round(chapterProgress(state) * 100);
  const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';
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
          <span class="event-badge">${currentEventTitle}${isWeekend(state.day) ? ' · Cuối tuần' : ''}</span>
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
          <!-- HỘP THƯ TRƯỚC CỬA NHÀ (STARDEW COZY MAILBOX WIDGET) -->
          <div class="stardew-mailbox-section">
            <div class="mailbox-widget-card" id="btn-open-stardew-mailbox" title="Ấn vào Hòm Thư Trước Nhà để mở Kỷ Niệm, Tri Kỷ & Sổ Tay Hẻm">
              <div class="mailbox-sprite-frame">
                <img src="${ASSETS.ui.mailboxStardew}" class="mailbox-pixel-sprite ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? 'has-new-mail' : ''}" alt="Hòm Thư Trước Nhà" />
              </div>
              <div class="mailbox-meta-col">
                <div class="mailbox-kicker-row">
                  <span class="mailbox-kicker">HIÊN NHÀ HẺM 1102</span>
                  ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? `
                    <div class="mailbox-pixel-wax-seal" title="Có ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0)} tin mới đang chờ">
                      <span class="wax-seal-text">(${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0)} TIN MỚI)</span>
                    </div>
                  ` : `
                    <div class="mailbox-pixel-wax-seal is-empty" title="Hòm thư trống, đã đọc hết">
                      <span class="wax-seal-text">(ĐÃ ĐỌC HẾT)</span>
                    </div>
                  `}
                </div>
                <div class="mailbox-main-title">HÒM THƯ TRƯỚC NHÀ</div>
                <div class="mailbox-quick-links">
                  <button id="btn-open-loyalty-handbook" class="btn-mailbox-pill ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? 'has-gift' : ''}" title="Sổ Tay Tri Kỷ Hẻm 1102 & Quà Tiếp Tế Cư Dân">
                    <img src="${ASSETS.icons.heart}" class="btn-pixel-icon-xs" alt="" /> Tri Kỷ Hẻm ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? `<b class="pill-seal">${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0)}</b>` : ''}
                  </button>
                  <button id="btn-open-memories" class="btn-mailbox-pill" title="Sổ Tay Kỷ Niệm: Cư Dân Hẻm, Tủ Kỷ Vật, 6 Kết Cục & 18 Mảnh Giấy Nhớ Gà Bông">
                    <img src="${ASSETS.icons.book}" class="btn-pixel-icon-xs" alt="" /> Kỷ Niệm Hẻm
                  </button>
                  <button id="btn-open-incidents" class="btn-mailbox-pill btn-incident-card" title="78 sự kiện drama xóm hẻm">
                    <img src="${ASSETS.icons.reviews}" class="btn-pixel-icon-xs" alt="" /> Sổ Tay Hẻm (${state.seenIncidentIds?.length ?? 0}/${DAILY_INCIDENTS.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- KỆ CÚP VÀNG TỔ DÂN PHỐ (STARDEW GOLDEN TROPHY SHOWCASE WIDGET) -->
          <div class="stardew-trophy-section">
            <div class="trophy-widget-card" id="btn-open-trophy-showcase" title="Ấn vào Kệ Cúp Vàng để mở Bức Tường Bằng Khen Tổ Dân Phố & Thử Thách">
              <div class="trophy-sprite-frame">
                <img src="${ASSETS.ui.trophyGoldenShowcase}" class="trophy-pixel-sprite ${claimableBadges > 0 ? 'has-new-trophy' : ''}" alt="Kệ Cúp Vàng" />
              </div>
              <div class="trophy-meta-col">
                <div class="trophy-kicker-row">
                  <span class="trophy-kicker">VINH DANH HẺM 1102</span>
                  ${claimableBadges > 0 ? `
                    <div class="trophy-pixel-gold-seal" title="Có ${claimableBadges} bằng khen đạt chuẩn đang chờ đóng mộc">
                      <span class="gold-seal-text">(${claimableBadges} CÚP MỚI)</span>
                    </div>
                  ` : `
                    <div class="trophy-pixel-gold-seal is-empty" title="Đã nhận hết bằng khen hiện tại">
                      <span class="gold-seal-text">(ĐÃ TREO HẾT)</span>
                    </div>
                  `}
                </div>
                <div class="trophy-main-title">KỆ CÚP VÀNG TỔ DÂN PHỐ</div>
                <div class="trophy-quick-links">
                  <button id="btn-open-achievements" class="btn-mailbox-pill ${claimableBadges > 0 ? 'has-badge' : ''}" title="Bức Tường Bằng Khen Tổ Dân Phố Hẻm 1102 (44 Danh Hiệu)">
                    <img src="${ASSETS.icons.trophy}" class="btn-pixel-icon-xs" alt="" /> Bằng Khen Tổ Dân Phố ${claimableBadges > 0 ? `<b class="pill-seal">${claimableBadges}</b>` : ''}
                  </button>
                  <button id="btn-weekly-quests" class="btn-mailbox-pill" title="Nhiệm vụ tuần nhận thưởng tiền mặt và danh hiệu">
                    <img src="${ASSETS.icons.target}" class="btn-pixel-icon-xs" alt="" /> Thử Thách Tuần
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- HỘC TỦ ĐỒ NGHỀ BẾP GÀ (STARDEW TOOLBOX CABINET WIDGET) -->
          <div class="stardew-toolbox-section">
            <div class="toolbox-widget-card cozy-cooking-cabinet" id="btn-open-toolbox-cabinet" title="Hộc Tủ Đồ Nghề Bếp Gà: Nấu Sốt Bí Truyền, Thú Cưng Hiên Quán & Ca Đêm Bất Tận">
              <div class="toolbox-sprite-frame">
                <img src="${ASSETS.ui.toolboxCabinet}" class="toolbox-pixel-sprite toolbox-cabinet-pixel-art ${state.secretSauceDay?.buffActive ? 'is-active-sauce' : ''}" alt="Hộc Tủ Đồ Nghề" />
              </div>
              <div class="toolbox-meta-col">
                <div class="toolbox-kicker-row">
                  <span class="toolbox-kicker">BẾP GÀ HẺM 1102</span>
                  ${state.secretSauceDay?.buffActive ? `
                    <div class="toolbox-pixel-amber-seal" title="Nồi Sốt Bí Truyền đang phát huy hiệu lực vàng (+3k tip & +0.25★ Hương vị)">
                      <span class="amber-seal-text">(SỐT VÀNG)</span>
                    </div>
                  ` : (day >= 4 ? `
                    <div class="toolbox-pixel-amber-seal is-ready" title="Đồ nghề bếp sẵn sàng phục vụ">
                      <span class="amber-seal-text">(SẴN SÀNG)</span>
                    </div>
                  ` : `
                    <div class="toolbox-pixel-amber-seal is-empty" title="Đang mở quán">
                      <span class="amber-seal-text">(TIỆM GÀ)</span>
                    </div>
                  `)}
                </div>
                <div class="toolbox-main-title">HỘC TỦ ĐỒ NGHỀ BẾP GÀ</div>
                <div class="toolbox-quick-links">
                  <!-- 1. Nồi Sốt Bí Truyền -->
                  <button id="btn-secret-sauce" class="btn-mailbox-pill btn-sauce-card ${state.secretSauceDay?.buffActive ? 'has-gift' : ''}" title="Gia Vị & Nồi Sốt: Pha nồi sốt bí truyền nhận Buff Vàng (+3k tip & +0.25★ Hương vị)">
                    <img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-xs" alt="" /> ${state.secretSauceDay?.buffActive ? '✨ Sốt Thần Thánh' : 'Gia Vị & Nồi Sốt'}
                  </button>
                  <!-- 2. Thú Cưng Hiên Quán -->
                  ${hasPet ? `
                    <button id="btn-open-pet-patio" class="btn-mailbox-pill" title="Góc Thú Cưng Hiên Quán (Cậu Vàng & Bé Mướp)">
                      <img src="${ASSETS.icons.cat}" class="btn-pixel-icon-xs" alt="" /> Thú Cưng Hiên Quán
                    </button>
                  ` : (day >= 4 ? `
                    <button id="btn-open-pet-patio" class="btn-mailbox-pill" title="Góc Thú Cưng Hiên Quán">
                      <img src="${ASSETS.icons.cat}" class="btn-pixel-icon-xs" alt="" /> Thú Cưng Hiên Quán
                    </button>
                  ` : `
                    <button class="btn-mailbox-pill is-locked" title="Nhận nuôi bé thú cưng vào Ngày 4" disabled>
                      <img src="${ASSETS.icons.lock}" class="btn-pixel-icon-xs" alt="" /> Thú Cưng (Ng.4)
                    </button>
                  `)}
                  <!-- 3. Ca Đêm Bất Tận -->
                  ${(day >= 4 || chapter >= 2) ? `
                    <button id="btn-open-endless-mode" class="btn-mailbox-pill" title="Thử thách sinh tồn bếp dồn dập (Rush Hour Wave Survival)">
                      <img src="${ASSETS.icons.fireRush}" class="btn-pixel-icon-xs" alt="" /> Ca Đêm Bất Tận
                    </button>
                  ` : `
                    <button class="btn-mailbox-pill is-locked" title="Mở khóa chế độ sinh tồn Ca Đêm Bất Tận vào Ngày 4 hoặc Chương 2" disabled>
                      <img src="${ASSETS.icons.lock}" class="btn-pixel-icon-xs" alt="" /> Ca Đêm (Ng.4)
                    </button>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
