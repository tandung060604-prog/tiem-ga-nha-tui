import { GameState, OilCondition, OilCrumb, OilFilterResult } from '../../types/game';
import {
  generateOilCrumbs,
  calculateFilterResult,
  OIL_FILTER_CONFIG
} from '../../core/oilFilter';
import { audio } from '../../core/audio';

export interface OilFilterModalCallbacks {
  onSuccess: (result: OilFilterResult) => void;
  onClose: () => void;
}

export function renderOilFilterGameHtml(
  oilCondition: OilCondition,
  crumbs: readonly OilCrumb[],
  timeLeft: number,
  collectedCount: number
): string {
  const panColorClass = oilCondition === 'dirty' ? 'pan-dirty' : oilCondition === 'medium' ? 'pan-medium' : 'pan-clean';
  const oilName = oilCondition === 'dirty' ? 'Đen Khét (Khói Độc)' : oilCondition === 'medium' ? 'Nâu Cánh Gián' : 'Vàng Óng Ả';
  const totalCrumbs = crumbs.length;
  const pct = Math.round((collectedCount / totalCrumbs) * 100);

  const crumbsHtml = crumbs.map((crumb, idx) => {
    if (crumb.collected) return '';
    const emoji = crumb.type === 'burnt_chunk' ? '🧆' : crumb.type === 'medium' ? '🍪' : '🍘';
    return `
      <div class="oil-crumb-item ${crumb.type} pop-in"
           data-crumb-id="${crumb.id}"
           data-index="${idx}"
           style="left: ${crumb.x}%; top: ${crumb.y}%; width: ${crumb.size}px; height: ${crumb.size}px;"
           title="Chạm hoặc vuốt để vớt">
        <span class="crumb-icon">${emoji}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="oil-modal-box filter-game-mode">
      <div class="oil-modal-header">
        <span class="oil-badge-kicker">VỆ SINH CHẢO CUỐI NGÀY</span>
        <h2 class="oil-title">🧹 Lọc Cặn Dầu & Vớt Bột Cháy</h2>
        <p class="oil-hint">Chạm hoặc vuốt nhanh các vụn bột cháy trên mặt chảo để làm sạch dầu!</p>
      </div>

      <div class="oil-stats-bar">
        <div class="oil-status-chip ${panColorClass}">
          Dầu hiện tại: <b>${oilName}</b>
        </div>
        <div class="oil-timer-pill">
          ⏱️ <b>${timeLeft}s</b>
        </div>
      </div>

      <div class="oil-progress-container">
        <div class="oil-progress-fill" style="width: ${pct}%;"></div>
      </div>
      <div class="oil-progress-label">Độ sạch chảo: <b>${collectedCount} / ${totalCrumbs} cặn (${pct}%)</b></div>

      <!-- Chảo gang tròn tương tác -->
      <div class="oil-pan-stage ${panColorClass}" id="oil-pan-touch-area">
        <div class="pan-oil-surface">
          <div class="pan-reflection"></div>
          <div class="pan-bubbles"></div>
          ${crumbsHtml}
        </div>
        <div class="pan-handle"></div>
      </div>

      <div class="oil-action-tray">
        <button id="btn-cancel-oil-filter" class="btn-sm btn-subtle">
          Đóng lại (Giữ nguyên dầu)
        </button>
      </div>
    </div>
  `;
}

export function renderOilFilterSuccessHtml(result: OilFilterResult): string {
  const isUpgraded = result.newCondition !== result.initialCondition;
  const upgradeText = result.newCondition === 'clean' ? '✨ Vàng Óng Thơm Lừng' : '琥 Phách Nâu Cánh Gián';

  return `
    <div class="oil-modal-box success-mode">
      <div class="oil-celebration-badge">✨ VỆ SINH XUẤT SẮC</div>
      <div class="oil-pan-sparkle-icon">🍳✨</div>
      <h2 class="oil-success-title">ĐÃ LỌC SẠCH CẶN DẦU!</h2>
      
      <p class="oil-success-desc">
        ${isUpgraded ? `Chảo dầu đã được hồi sinh lên cấp <b>${upgradeText}</b>!` : 'Dầu đã được lọc trong veo, tinh khiết thơm lừng!'}
      </p>

      <div class="oil-reward-summary-card">
        <div class="reward-row">
          <span class="reward-icon">💰</span>
          <div class="reward-text">
            <b>Tiết kiệm ${result.savedMoney.toLocaleString('vi-VN')}đ</b> chi phí thay dầu mới!
          </div>
        </div>
        ${result.bonusReward > 0 ? `
          <div class="reward-row">
            <span class="reward-icon">💵</span>
            <div class="reward-text">
              <b>Thưởng nóng +${result.bonusReward.toLocaleString('vi-VN')}đ</b> quỹ tiệm vì bảo quản dầu xuất sắc!
            </div>
          </div>
        ` : ''}
        <div class="reward-row">
          <span class="reward-icon">⭐</span>
          <div class="reward-text">
            <b>Cộng +${result.hygieneBonus}★ Vệ Sinh</b>, ngày mai khách khen nức nở không lo công an phạt!
          </div>
        </div>
      </div>

      <div class="oil-modal-actions">
        <button id="btn-oil-filter-finish" class="btn-sm primary btn-oil-action">
          Tuyệt Vời · Tiếp Tục
        </button>
      </div>
    </div>
  `;
}

export function renderOilFilterFailedHtml(result: OilFilterResult): string {
  return `
    <div class="oil-modal-box failed-mode">
      <div class="oil-fail-icon">🫗</div>
      <h2 class="oil-fail-title">Chưa Vớt Kịp Toàn Bộ Cặn!</h2>
      <p class="oil-fail-desc">
        Bạn đã vớt được <b>${result.collectedCount}/${result.totalCrumbs}</b> cặn bột cháy.
      </p>

      <div class="oil-fail-quote">
        ${result.isPartial ? `
          "Vớt được hơn phân nửa cũng đỡ lắm rồi con! Tiệm được giảm 50% tiền thay dầu (còn 75k) nghen!"
        ` : `
          "Không sao đâu nè, mai tay nhanh hơn xíu là lọc sạch bong hà! Nhớ canh thay dầu để tránh bị trừ sao nha!"
        `}
        <br><b style="color: var(--primary);">— Bác Ba an ủi</b>
      </div>

      <div class="oil-modal-actions">
        <button id="btn-oil-filter-fail-close" class="btn-sm primary btn-oil-action">
          Dạ Con Hiểu Rồi · Đóng Lại
        </button>
      </div>
    </div>
  `;
}

/**
 * Mở Modal Minigame Lọc Cặn Dầu Cuối Ngày
 */
export function openOilFilterModal(
  state: GameState,
  callbacks: OilFilterModalCallbacks
) {
  const crumbs = generateOilCrumbs(OIL_FILTER_CONFIG.defaultCrumbCount, state.day);
  let timeLeft = OIL_FILTER_CONFIG.durationSec;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let isFinished = false;

  const modalContainer = document.createElement('div');
  modalContainer.className = 'oil-modal-overlay';
  modalContainer.id = 'oil-filter-modal';

  function renderGame() {
    const collectedCount = crumbs.filter(c => c.collected).length;
    modalContainer.innerHTML = renderOilFilterGameHtml(state.oilCondition, crumbs, timeLeft, collectedCount);

    // Gắn sự kiện touch / click vào các đốm cặn
    const panStage = modalContainer.querySelector('#oil-pan-touch-area');
    if (panStage) {
      modalContainer.querySelectorAll<HTMLElement>('.oil-crumb-item').forEach(crumbEl => {
        const idx = Number(crumbEl.dataset.index);

        const handleCollect = () => {
          if (isFinished) return;
          const crumb = crumbs[idx];
          if (!crumb || crumb.collected) return;

          crumb.collected = true;
          crumbEl.classList.add('is-collected');
          audio.playCrumbCollect(crumbs.filter(c => c.collected).length);

          const currentCount = crumbs.filter(c => c.collected).length;
          // Cập nhật thanh tiến độ trực quan
          const fill = modalContainer.querySelector<HTMLElement>('.oil-progress-fill');
          const label = modalContainer.querySelector<HTMLElement>('.oil-progress-label');
          const pct = Math.round((currentCount / crumbs.length) * 100);
          if (fill) fill.style.width = `${pct}%`;
          if (label) label.innerHTML = `Độ sạch chảo: <b>${currentCount} / ${crumbs.length} cặn (${pct}%)</b>`;

          // Nếu đã vớt sạch 100% trước khi hết giờ -> Thắng ngay lập tức!
          if (currentCount >= crumbs.length) {
            finishGame();
          }
        };

        crumbEl.addEventListener('click', handleCollect);
        crumbEl.addEventListener('touchstart', handleCollect, { passive: true });
      });
    }

    modalContainer.querySelector('#btn-cancel-oil-filter')?.addEventListener('click', () => {
      audio.playPop();
      closeModal();
    });
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      const timerEl = modalContainer.querySelector<HTMLElement>('.oil-timer-pill b');
      if (timerEl) timerEl.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        finishGame();
      }
    }, 1000);
  }

  function finishGame() {
    if (isFinished) return;
    isFinished = true;
    if (timerInterval) clearInterval(timerInterval);

    const collectedCount = crumbs.filter(c => c.collected).length;
    const result = calculateFilterResult(collectedCount, crumbs.length, state.oilCondition);

    // Áp dụng kết quả vào state game
    state.todayOilFiltered = true;
    if (result.success && !result.isPartial) {
      audio.playOilFilterSuccess();
      state.oilCondition = result.newCondition;
      if (result.hygieneBonus > 0) {
        state.ratings.hygiene = Math.min(5, Number((state.ratings.hygiene + result.hygieneBonus).toFixed(2)));
      }
      if (result.bonusReward > 0) {
        state.money += result.bonusReward;
      }
      callbacks.onSuccess(result);
      renderSuccess(result);
    } else {
      audio.playPop();
      if (result.isPartial && result.hygieneBonus > 0) {
        state.ratings.hygiene = Math.min(5, Number((state.ratings.hygiene + result.hygieneBonus).toFixed(2)));
      }
      callbacks.onSuccess(result);
      renderFailed(result);
    }
  }

  function renderSuccess(result: OilFilterResult) {
    modalContainer.innerHTML = renderOilFilterSuccessHtml(result);
    modalContainer.querySelector('#btn-oil-filter-finish')?.addEventListener('click', () => {
      audio.playCash();
      closeModal();
    });
  }

  function renderFailed(result: OilFilterResult) {
    modalContainer.innerHTML = renderOilFilterFailedHtml(result);
    modalContainer.querySelector('#btn-oil-filter-fail-close')?.addEventListener('click', () => {
      audio.playPop();
      closeModal();
    });
  }

  function closeModal() {
    if (timerInterval) clearInterval(timerInterval);
    modalContainer.classList.add('fade-out');
    setTimeout(() => {
      modalContainer.remove();
      callbacks.onClose();
    }, 200);
  }

  document.body.appendChild(modalContainer);
  renderGame();
  startTimer();
}
