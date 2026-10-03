import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { audio } from '../../core/audio';
import { CURIOS_AND_RELICS, getUnlockedCurios } from '../../content/curiosAndRelics';
import { DAILY_INCIDENTS } from '../../content/dailyIncidents';

/**
 * Modal Hòm Thư Trước Nhà • Hẻm 1102 (Stardew Valley Rustic Mailbox Modal)
 * Trưng bày 3 chuyên mục lớn:
 * 1. 💖 Tri Kỷ Hẻm (Sổ tay cư dân theo role & quà tiếp tế)
 * 2. 📸 Kỷ Niệm Hẻm (Biên niên ký 36 cư dân, kỷ vật, 6 kết cục & giấy nhớ thỏ cam)
 * 3. 📖 Sổ Tay Hẻm (78 sự kiện drama xóm hẻm)
 */
export function openStardewMailboxModal(
  state: GameState,
  callbacks: {
    openMemories: () => void;
    openLoyalty: () => void;
    openIncidents: () => void;
  }
): void {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('modal-stardew-mailbox');
  if (existing) existing.remove();

  const currentChapter = state.currentChapter || 1;
  const loyalty = state.loyaltyState;
  const pendingGifts = loyalty?.pendingAlleyGifts?.length ?? 0;
  const knownResidents = Object.values(loyalty?.residents ?? {}).filter(r => r.totalVisits > 0).length;
  const unlockedCurios = getUnlockedCurios(state);
  const achievedEndings = state.achievedEndings?.length ?? 0;
  const seenIncidents = state.seenIncidentIds?.length ?? 0;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'modal-stardew-mailbox';
  modalOverlay.className = 'modal-overlay mailbox-modal-overlay';

  modalOverlay.innerHTML = `
    <div class="modal-card stardew-mailbox-card" role="dialog" aria-modal="true" aria-labelledby="mailbox-title">
      <!-- Header Mộc Mạc Cổ Điển Stardew -->
      <div class="mailbox-modal-header">
        <div class="mailbox-header-lead">
          <img src="${ASSETS.ui.mailboxStardew}" class="mailbox-header-sprite" alt="Mailbox" />
          <div class="mailbox-header-text">
            <h2 id="mailbox-title" class="mailbox-modal-title">HÒM THƯ TRƯỚC NHÀ</h2>
            <span class="mailbox-modal-sub">Hiên Quán Gà Rán • Hẻm 1102 Sài Gòn</span>
          </div>
        </div>
        <button id="btn-close-stardew-mailbox" class="btn-modal-close" aria-label="Đóng Hòm Thư">✕</button>
      </div>

      <!-- Khung Nội Dung 3 Thẻ Bài Lớn -->
      <div class="mailbox-modal-body">
        <div class="mailbox-notice-banner">
          <span class="notice-kicker">THƯ TÍN & BẢN TIN HÀNG NGÀY</span>
          <p class="notice-desc">Những cánh thư, bưu kiện quà quê và ký ức chân thật từ bà con Hẻm 1102 gửi gắm cho tiệm gà.</p>
        </div>

        <div class="mailbox-cards-grid">
          <!-- THẺ 1: TRI KỶ HẺM -->
          <div class="mailbox-action-card card-loyalty" id="btn-mailbox-loyalty">
            <div class="card-icon-frame">
              <img src="${ASSETS.icons.heart}" class="card-pixel-icon" alt="" />
            </div>
            <div class="card-info-col">
              <div class="card-title-row">
                <span class="card-title">TRI KỶ HẺM 1102</span>
                ${pendingGifts > 0 ? `
                  <div class="card-wax-seal-mini">
                    <span class="wax-text">${pendingGifts} QUÀ CHỜ</span>
                  </div>
                ` : ''}
              </div>
              <p class="card-sub-desc">Hồ sơ 36 cư dân phân theo vai trò (Bếp, Khách Quen, Đường Phố, Chính Quyền...), mức tim thân thiết & mở bưu kiện quà tiếp tế.</p>
              <div class="card-stats-strip">
                <span class="stat-pill">👥 ${knownResidents}/36 đã ghé</span>
                <span class="stat-pill">🎁 ${pendingGifts > 0 ? `${pendingGifts} quà quê đang chờ` : 'Đã nhận đủ quà'}</span>
              </div>
            </div>
            <button id="btn-open-loyalty-handbook" class="btn-card-action">
              MỞ SỔ TRI KỶ →
            </button>
          </div>

          <!-- THẺ 2: KỶ NIỆM HẺM -->
          <div class="mailbox-action-card card-memories" id="btn-mailbox-memories">
            <div class="card-icon-frame">
              <img src="${ASSETS.icons.book}" class="card-pixel-icon" alt="" />
            </div>
            <div class="card-info-col">
              <div class="card-title-row">
                <span class="card-title">KỶ NIỆM HẺM</span>
              </div>
              <p class="card-sub-desc">Biên niên ký chi tiết, 12 bảo vật cổ xưa Hẻm 1102, 6 đại kết cục cốt truyện & các bức thư bí mật của Thỏ Cam.</p>
              <div class="card-stats-strip">
                <span class="stat-pill">Chương ${currentChapter}</span>
                <span class="stat-pill">🏺 ${unlockedCurios.length}/${CURIOS_AND_RELICS.length} Kỷ vật</span>
                <span class="stat-pill">🏆 ${achievedEndings}/6 Kết cục</span>
              </div>
            </div>
            <button id="btn-open-memories" class="btn-card-action">
              LẬT KỶ NIỆM →
            </button>
          </div>

          <!-- THẺ 3: SỔ TAY HẺM -->
          <div class="mailbox-action-card card-incidents" id="btn-mailbox-incidents">
            <div class="card-icon-frame">
              <img src="${ASSETS.icons.reviews}" class="card-pixel-icon" alt="" />
            </div>
            <div class="card-info-col">
              <div class="card-title-row">
                <span class="card-title">SỔ TAY HẺM 1102</span>
              </div>
              <p class="card-sub-desc">Cẩm nang lưu trữ 78 biến cố, drama xóm giềng và những bài học kinh nghiệm buôn bán thực chiến giữa lòng Sài Gòn.</p>
              <div class="card-stats-strip">
                <span class="stat-pill">📖 Đã chứng kiến: ${seenIncidents}/${DAILY_INCIDENTS.length}</span>
                <span class="stat-pill">✨ Tình làng nghĩa xóm</span>
              </div>
            </div>
            <button id="btn-open-incidents" class="btn-card-action">
              XEM SỔ TAY →
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mailbox-modal-footer">
        <span>🏮 Tiệm Gà Nhà Tui • Bưu Kiện & Thư Tín Hẻm</span>
        <button id="btn-dismiss-stardew-mailbox" class="btn-sm btn-mailbox-done">Đóng Hòm Thư</button>
      </div>
    </div>
  `;

  // Bind Events
  const closeModal = () => {
    audio.playPop();
    modalOverlay.remove();
  };

  const closeBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-close-stardew-mailbox');
  if (closeBtn) closeBtn.onclick = closeModal;

  const dismissBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-dismiss-stardew-mailbox');
  if (dismissBtn) dismissBtn.onclick = closeModal;

  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };

  // Nút Tri Kỷ Hẻm
  const loyaltyCard = modalOverlay.querySelector<HTMLElement>('#btn-mailbox-loyalty');
  const loyaltyBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-open-loyalty-handbook');
  const triggerLoyalty = (e: Event) => {
    e.stopPropagation();
    closeModal();
    callbacks.openLoyalty();
  };
  if (loyaltyCard) loyaltyCard.onclick = triggerLoyalty;
  if (loyaltyBtn) loyaltyBtn.onclick = triggerLoyalty;

  // Nút Kỷ Niệm Hẻm
  const memoriesCard = modalOverlay.querySelector<HTMLElement>('#btn-mailbox-memories');
  const memoriesBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-open-memories');
  const triggerMemories = (e: Event) => {
    e.stopPropagation();
    closeModal();
    callbacks.openMemories();
  };
  if (memoriesCard) memoriesCard.onclick = triggerMemories;
  if (memoriesBtn) memoriesBtn.onclick = triggerMemories;

  // Nút Sổ Tay Hẻm
  const incidentsCard = modalOverlay.querySelector<HTMLElement>('#btn-mailbox-incidents');
  const incidentsBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-open-incidents');
  const triggerIncidents = (e: Event) => {
    e.stopPropagation();
    closeModal();
    callbacks.openIncidents();
  };
  if (incidentsCard) incidentsCard.onclick = triggerIncidents;
  if (incidentsBtn) incidentsBtn.onclick = triggerIncidents;

  document.body.appendChild(modalOverlay);
}
