import { GameState, CustomerLoyaltyEntry } from '../../types/game';
import { CHARACTERS_36 } from '../../content/characters36';
import { 
  ensureLoyaltyState, 
  HEART_LEVEL_TITLES, 
  HEART_EXP_THRESHOLDS, 
  claimAlleyGift 
} from '../../core/loyaltyEngine';
import { ASSETS } from '../../content/assets';
import { audio } from '../../core/audio';
import confetti from 'canvas-confetti';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function openLoyaltyHandbookModal(state: GameState, onUpdate: () => void): void {
  const existing = document.getElementById('loyalty-handbook-modal');
  if (existing) existing.remove();

  const loyalty = ensureLoyaltyState(state);
  let activeTab: 'residents' | 'gifts' = loyalty.pendingAlleyGifts.length > 0 ? 'gifts' : 'residents';

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'loyalty-handbook-modal';
  modalOverlay.className = 'modal-overlay loyalty-modal-overlay';

  function renderContent(): void {
    const pendingCount = loyalty.pendingAlleyGifts.length;
    const knownResidents = Object.values(loyalty.residents).filter(r => r.totalVisits > 0).length;

    modalOverlay.innerHTML = `
      <div class="modal-card loyalty-handbook-card" role="dialog" aria-modal="true" aria-labelledby="loyalty-title">
        <!-- Header -->
        <div class="loyalty-modal-header">
          <div class="loyalty-title-wrap">
            <h2 id="loyalty-title" class="loyalty-title">
              <img src="${ASSETS.icons.book}" class="loyalty-title-icon" alt="" />
              SỔ TAY TRI KỶ HẺM 1102
            </h2>
            <span class="loyalty-sub">Gắn kết tình làng nghĩa xóm & Khẩu vị ruột Sài Gòn (${knownResidents}/36 đã ghé)</span>
          </div>
          <button id="btn-close-loyalty-modal" class="btn-modal-close" aria-label="Đóng">✕</button>
        </div>

        <!-- Navigation Tabs -->
        <div class="loyalty-nav-tabs">
          <button class="loyalty-nav-btn ${activeTab === 'residents' ? 'active' : ''}" data-tab="residents">
            👥 Cư Dân Hẻm (${knownResidents}/36)
          </button>
          <button class="loyalty-nav-btn ${activeTab === 'gifts' ? 'active' : ''} ${pendingCount > 0 ? 'has-pending' : ''}" data-tab="gifts">
            🎁 Quà Tiếp Tế ${pendingCount > 0 ? `<span class="pending-gift-badge">${pendingCount}</span>` : ''}
          </button>
        </div>

        <!-- Body Content -->
        <div class="loyalty-modal-body">
          ${activeTab === 'residents' ? renderResidentsTab(state) : renderGiftsTab(state)}
        </div>
      </div>
    `;

    bindEvents();
  }

  function renderResidentsTab(state: GameState): string {
    const loyalty = state.loyaltyState!;

    const cardsHtml = CHARACTERS_36.map(char => {
      const entry: CustomerLoyaltyEntry = loyalty.residents[char.id] || {
        characterId: char.id,
        heartLevel: 0,
        exp: 0,
        totalVisits: 0,
        perfectDishesServed: 0,
        specialRequestsFulfilled: 0,
        unlockedGifts: []
      };

      const level = entry.heartLevel;
      const levelTitle = HEART_LEVEL_TITLES[level] ?? 'Khách Mới';
      const nextThreshold = (level < 5 ? HEART_EXP_THRESHOLDS[level + 1] : HEART_EXP_THRESHOLDS[5]) ?? 1000;
      const currentThreshold = HEART_EXP_THRESHOLDS[level] ?? 0;
      const expInLevel = entry.exp - currentThreshold;
      const expRange = nextThreshold - currentThreshold;
      const progressPercent = level === 5 ? 100 : Math.min(100, Math.max(0, Math.round((expInLevel / Math.max(1, expRange)) * 100)));

      // Render 5 biểu tượng tim
      const heartsHtml = Array.from({ length: 5 }).map((_, idx) => {
        return idx < level 
          ? '<span class="heart-icon filled">❤️</span>' 
          : '<span class="heart-icon empty">🤍</span>';
      }).join('');

      // Khẩu vị ruột dự kiến
      const sampleFav = char.favoriteOrder.map(id => {
        const item = state.menu.find(m => m.id === id);
        return item ? item.name : id;
      }).slice(0, 2).join(', ');

      const isKnown = entry.totalVisits > 0;
      const avatarSrc = (ASSETS.characters as any)[char.id] || ASSETS.bacba.front;

      return `
        <div class="resident-card ${isKnown ? 'is-known' : 'is-unknown'}">
          <div class="resident-avatar-col">
            <div class="resident-avatar-box">
              <img src="${avatarSrc}" class="resident-avatar-img" alt="${escapeHtml(char.name)}" />
            </div>
            <span class="resident-visits-tag">${isKnown ? `Ghé: ${entry.totalVisits} lần` : 'Chưa ghé'}</span>
          </div>

          <div class="resident-info-col">
            <div class="resident-name-row">
              <span class="resident-name">${escapeHtml(char.name)}</span>
              <span class="resident-role">${escapeHtml(char.roleTitle)}</span>
            </div>

            <!-- Heart Meter -->
            <div class="resident-heart-meter">
              <div class="resident-hearts">${heartsHtml}</div>
              <span class="resident-heart-title">Cấp ${level} · ${levelTitle}</span>
            </div>

            <!-- EXP Bar -->
            <div class="resident-exp-wrap" title="${entry.exp}/${nextThreshold} EXP">
              <div class="resident-exp-bar">
                <div class="resident-exp-fill" style="width: ${progressPercent}%;"></div>
              </div>
              <span class="resident-exp-label">${entry.exp} EXP</span>
            </div>

            <!-- Stats & Preferences -->
            <div class="resident-meta-tags">
              <span class="meta-tag" title="Món khoái khẩu">🍗 ${isKnown ? sampleFav : '???'}</span>
              ${entry.specialRequestsFulfilled > 0 ? `<span class="meta-tag special" title="Số lần chiều đúng khẩu vị ruột">💖 Hợp gu: ${entry.specialRequestsFulfilled}</span>` : ''}
              ${entry.perfectDishesServed > 0 ? `<span class="meta-tag perfect" title="Số món Perfect đã phục vụ">✨ Vàng giòn: ${entry.perfectDishesServed}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="residents-grid">
        ${cardsHtml}
      </div>
    `;
  }

  function renderGiftsTab(state: GameState): string {
    const loyalty = state.loyaltyState!;
    const pending = loyalty.pendingAlleyGifts;
    const history = loyalty.claimedAlleyGiftsHistory;

    const pendingHtml = pending.length > 0 ? pending.map(gift => `
      <div class="alley-gift-card pending-card">
        <div class="gift-icon-col">
          <div class="gift-box-icon bounce-gift">🎁</div>
        </div>
        <div class="gift-content-col">
          <div class="gift-header">
            <span class="gift-sender">Từ: <b>${escapeHtml(gift.senderName)}</b></span>
            <span class="gift-badge-lvl">❤️ Cấp ${gift.heartLevel}</span>
          </div>
          <div class="gift-label">${escapeHtml(gift.giftLabel)}</div>
          <div class="gift-letter">"${escapeHtml(gift.letterContent)}"</div>
          <button class="btn-claim-alley-gift" data-gift-id="${gift.id}">
            MỞ BƯU KIỆN 🎁
          </button>
        </div>
      </div>
    `).join('') : `
      <div class="empty-gifts-notice">
        <div class="empty-icon">📭</div>
        <p>Hiện chưa có bưu kiện Quà Quê nào đang chờ.</p>
        <small>Hãy phục vụ đúng khẩu vị ruột của cư dân Hẻm 1102 để nâng Cấp Tim (mốc 2, 4, 5) nhận quà tiếp tế nhé!</small>
      </div>
    `;

    const historyHtml = history.length > 0 ? `
      <div class="gift-history-section">
        <h4 class="history-title">Kỷ Niệm Quà Đã Nhận (${history.length})</h4>
        <div class="history-grid">
          ${history.slice().reverse().map(gift => `
            <div class="history-gift-item">
              <span class="h-gift-icon">✓ 🎁</span>
              <span class="h-gift-name">${escapeHtml(gift.giftLabel)}</span>
              <small class="h-gift-sender">${escapeHtml(gift.senderName)}</small>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="gifts-tab-content">
        <h3 class="gifts-sec-title">Bưu Kiện Quà Quê Đang Chờ (${pending.length})</h3>
        <div class="pending-gifts-list">
          ${pendingHtml}
        </div>
        ${historyHtml}
      </div>
    `;
  }

  function bindEvents(): void {
    const closeModal = () => {
      audio.playPop();
      modalOverlay.remove();
      try {
        onUpdate();
      } catch {
        // ignore
      }
    };

    const closeBtn = modalOverlay.querySelector<HTMLButtonElement>('#btn-close-loyalty-modal');
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    };

    // Tab buttons
    const tabBtns = modalOverlay.querySelectorAll<HTMLButtonElement>('.loyalty-nav-btn');
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        const tab = btn.dataset.tab as 'residents' | 'gifts';
        if (tab && tab !== activeTab) {
          activeTab = tab;
          audio.playPop();
          renderContent();
        }
      };
    });

    // Claim gift buttons
    const claimBtns = modalOverlay.querySelectorAll<HTMLButtonElement>('.btn-claim-alley-gift');
    claimBtns.forEach(btn => {
      btn.onclick = () => {
        const giftId = btn.dataset.giftId;
        if (!giftId) return;
        
        audio.playGoldChime();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti fails
        }

        const res = claimAlleyGift(state, giftId);
        if (res.success) {
          onUpdate();
          renderContent();
        }
      };
    });
  }

  renderContent();
  document.body.appendChild(modalOverlay);
}
