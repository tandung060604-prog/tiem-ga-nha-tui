import { GameState, SpiceId } from '../../types/game';
import {
  SAUCE_SPICES,
  SPICE_MAP,
  SECRET_SAUCE_BUFF,
  validateSauceInput,
  getOrCreateSauceDayState
} from '../../core/secretSauce';
import { audio } from '../../core/audio';

export interface SecretSauceModalCallbacks {
  onSuccess: () => void;
  onClose: () => void;
}

export function renderSaucePreviewHtml(day: number, recipe: readonly SpiceId[]): string {
  const stepsHtml = recipe.map((spiceId, idx) => {
    const spice = SPICE_MAP[spiceId];
    return `
      <div class="sauce-step-card pop-in" style="animation-delay: ${idx * 0.12}s;">
        <div class="step-num">BƯỚC ${idx + 1}</div>
        <div class="step-icon">${spice.icon}</div>
        <div class="step-name">${spice.shortName}</div>
        <div class="step-tag">${spice.tag}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="sauce-modal-box preview-mode">
      <div class="sauce-modal-header">
        <span class="sauce-badge-kicker">BÍ QUYẾT GIA TRUYỀN HẺM 1102</span>
        <h2 class="sauce-title">📜 Nồi Sốt Bí Truyền Ngày ${day}</h2>
        <p class="sauce-hint">Ghi nhớ thứ tự 4 gia vị trên cuộn giấy trước khi bắt đầu nghen!</p>
      </div>

      <div class="sauce-timer-container">
        <div class="sauce-timer-bar-fill" id="sauce-preview-progress"></div>
      </div>

      <div class="sauce-scroll-paper">
        <div class="sauce-scroll-inner">
          ${stepsHtml}
        </div>
      </div>

      <div class="sauce-modal-actions">
        <button id="btn-start-cooking-now" class="btn-sm primary btn-sauce-action">
          👨‍🍳 Con Nhớ Rồi · Nấu Ngay!
        </button>
      </div>
    </div>
  `;
}

export function renderSauceCookingHtml(recipe: readonly SpiceId[], userInputs: readonly SpiceId[]): string {
  const slotsHtml = recipe.map((_, idx) => {
    const inputId = userInputs[idx];
    if (inputId) {
      const spice = SPICE_MAP[inputId];
      return `
        <div class="sauce-pot-slot filled pop-in">
          <span class="slot-icon">${spice.icon}</span>
          <span class="slot-name">${spice.shortName}</span>
        </div>
      `;
    }
    return `
      <div class="sauce-pot-slot empty ${idx === userInputs.length ? 'current' : ''}">
        <span class="slot-num">${idx + 1}</span>
      </div>
    `;
  }).join('');

  const spiceBtnsHtml = SAUCE_SPICES.map(spice => {
    return `
      <button class="btn-spice-touch" data-spice-id="${spice.id}">
        <span class="btn-spice-icon">${spice.icon}</span>
        <span class="btn-spice-text">${spice.shortName}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="sauce-modal-box cooking-mode">
      <div class="sauce-modal-header">
        <span class="sauce-badge-kicker">TRẠM BẾP GIA TRUYỀN</span>
        <h2 class="sauce-title">🍲 Nêm Gia Vị Vào Nồi</h2>
        <p class="sauce-hint">Chạm đúng thứ tự 4 gia vị đã ghi nhớ vào nồi đang sôi!</p>
      </div>

      <div class="sauce-pot-visual">
        <div class="sauce-pot-illustration">
          <span class="sauce-pot-steam">♨️</span>
          <div class="sauce-pot-icon">🥘</div>
          <div class="sauce-pot-status">
            Tiến độ: <b>${userInputs.length} / ${recipe.length}</b>
          </div>
        </div>
        <div class="sauce-pot-slots">
          ${slotsHtml}
        </div>
      </div>

      <div class="sauce-controls-tray">
        <div class="sauce-controls-label">HŨ GIA VỊ TRÊN BÀN (CHẠM ĐỂ NÊM):</div>
        <div class="sauce-spices-grid">
          ${spiceBtnsHtml}
        </div>
      </div>

      <div class="sauce-cancel-tray">
        <button id="btn-cancel-sauce" class="btn-sm btn-subtle">
          Bỏ qua hôm nay
        </button>
      </div>
    </div>
  `;
}

export function renderSauceSuccessHtml(): string {
  return `
    <div class="sauce-modal-box success-mode">
      <div class="sauce-celebration-badge">🏆 TUYỆT PHẨM BẾP</div>
      <div class="sauce-success-icon-wrapper">
        <span class="sauce-sparkles-left">✨</span>
        <div class="sauce-golden-pot">🍲</div>
        <span class="sauce-sparkles-right">✨</span>
      </div>
      <h2 class="sauce-success-title">SỐT HOÀNG KIM ĐÃ SẴN SÀNG!</h2>
      <p class="sauce-success-desc">
        Công thức chuẩn không cần chỉnh! Nước sốt sánh mịn, thơm nức mũi cả Hẻm 1102!
      </p>

      <div class="sauce-buff-reward-box">
        <div class="buff-row">
          <span class="buff-icon">💰</span>
          <div class="buff-text">
            <b>Tip thêm +3.000đ</b> cho mỗi đơn hàng có món gà sốt trong ca bán hôm nay.
          </div>
        </div>
        <div class="buff-row">
          <span class="buff-icon">⭐</span>
          <div class="buff-text">
            <b>Tăng +0.25★ Hương Vị</b> trong bảng xếp hạng đánh giá cuối ngày.
          </div>
        </div>
      </div>

      <div class="sauce-modal-actions">
        <button id="btn-sauce-done" class="btn-sm primary btn-sauce-action">
          🔥 Vào Bếp Mở Bán Ngay!
        </button>
      </div>
    </div>
  `;
}

export function renderSauceFailedHtml(): string {
  return `
    <div class="sauce-modal-box failed-mode">
      <div class="sauce-fail-icon">🥣</div>
      <h2 class="sauce-fail-title">Chưa Đúng Vị Rồi Con Ơi!</h2>
      <div class="sauce-fail-quote">
        "Không sao đâu nè! Nồi sốt này vẫn đậm đà vừa vặn để bán hôm nay. Mai nhớ nhìn kỹ cuộn giấy rồi nêm lại nghen!"
        <br><b style="color: var(--primary);">— Bác Ba động viên</b>
      </div>

      <div class="sauce-modal-actions">
        <button id="btn-sauce-fail-done" class="btn-sm primary btn-sauce-action">
          Dạ Con Hiểu Rồi · Bắt Đầu Bán
        </button>
      </div>
    </div>
  `;
}

/**
 * Mở Modal Minigame Pha Nước Sốt Bí Truyền Hẻm 1102
 */
export function openSecretSauceModal(
  state: GameState,
  callbacks: SecretSauceModalCallbacks
) {
  // Lấy hoặc khởi tạo trạng thái sốt hôm nay
  const sauceState = getOrCreateSauceDayState(state.secretSauceDay, state.day, state.currentChapter);
  state.secretSauceDay = sauceState;

  // Nếu hôm nay đã chơi rồi và đã thành công
  if (sauceState.completed && sauceState.success) {
    showAlreadyCompletedModal(sauceState.recipe, callbacks.onClose);
    return;
  }

  // Khởi tạo các biến nội bộ của minigame
  let phase: 'preview' | 'cooking' | 'success' | 'failed' = 'preview';
  const recipe = sauceState.recipe;
  const userInputs: SpiceId[] = [];
  let previewTimer: number | null = null;

  const modalContainer = document.createElement('div');
  modalContainer.className = 'sauce-modal-overlay';
  modalContainer.id = 'sauce-minigame-modal';

  function render() {
    if (phase === 'preview') {
      renderPreviewPhase();
    } else if (phase === 'cooking') {
      renderCookingPhase();
    } else if (phase === 'success') {
      renderSuccessPhase();
    } else if (phase === 'failed') {
      renderFailedPhase();
    }
  }

  function renderPreviewPhase() {
    modalContainer.innerHTML = renderSaucePreviewHtml(state.day, recipe);

    // Thiết lập đếm ngược preview 3.5s
    const progressEl = modalContainer.querySelector<HTMLElement>('#sauce-preview-progress');
    const startCookingBtn = modalContainer.querySelector('#btn-start-cooking-now');

    const totalMs = SECRET_SAUCE_BUFF.previewDurationSec * 1000;
    const startTime = performance.now();

    function updateProgress() {
      const elapsed = performance.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / totalMs) * 100);
      if (progressEl) progressEl.style.width = `${pct}%`;

      if (elapsed >= totalMs) {
        switchToCooking();
      } else {
        previewTimer = requestAnimationFrame(updateProgress);
      }
    }

    previewTimer = requestAnimationFrame(updateProgress);

    startCookingBtn?.addEventListener('click', () => {
      audio.playPop();
      if (previewTimer) cancelAnimationFrame(previewTimer);
      switchToCooking();
    });
  }

  function switchToCooking() {
    if (previewTimer) cancelAnimationFrame(previewTimer);
    phase = 'cooking';
    render();
  }

  function renderCookingPhase() {
    modalContainer.innerHTML = renderSauceCookingHtml(recipe, userInputs);

    // Gắn sự kiện cho các nút gia vị
    modalContainer.querySelectorAll<HTMLButtonElement>('.btn-spice-touch').forEach(btn => {
      btn.addEventListener('click', () => {
        const spiceId = btn.dataset.spiceId as SpiceId;
        if (!spiceId) return;
        handleSpiceInput(spiceId);
      });
    });

    modalContainer.querySelector('#btn-cancel-sauce')?.addEventListener('click', () => {
      audio.playPop();
      closeModal();
    });
  }

  function handleSpiceInput(spiceId: SpiceId) {
    userInputs.push(spiceId);
    const result = validateSauceInput(recipe, userInputs);

    if (result.isFailed) {
      audio.playSecretSauceFail();
      sauceState.completed = true;
      sauceState.success = false;
      sauceState.buffActive = false;
      phase = 'failed';
      render();
      return;
    }

    // Nạp đúng bước
    audio.playSpiceDrop(userInputs.length);

    if (result.isComplete) {
      audio.playSecretSauceSuccess();
      sauceState.completed = true;
      sauceState.success = true;
      sauceState.buffActive = true;
      sauceState.tipsEarnedToday = 0;
      phase = 'success';
      render();
      callbacks.onSuccess();
      return;
    }

    // Tiếp tục bước tiếp theo
    render();
  }

  function renderSuccessPhase() {
    modalContainer.innerHTML = renderSauceSuccessHtml();

    modalContainer.querySelector('#btn-sauce-done')?.addEventListener('click', () => {
      audio.playCash();
      closeModal();
    });
  }

  function renderFailedPhase() {
    modalContainer.innerHTML = renderSauceFailedHtml();

    modalContainer.querySelector('#btn-sauce-fail-done')?.addEventListener('click', () => {
      audio.playPop();
      closeModal();
    });
  }

  function closeModal() {
    if (previewTimer) cancelAnimationFrame(previewTimer);
    modalContainer.classList.add('fade-out');
    setTimeout(() => {
      modalContainer.remove();
      callbacks.onClose();
    }, 200);
  }

  document.body.appendChild(modalContainer);
  render();
}

/**
 * Hiển thị thông báo nếu người chơi đã nấu sốt thành công hôm nay
 */
function showAlreadyCompletedModal(recipe: SpiceId[], onClose: () => void) {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'sauce-modal-overlay';
  modalContainer.id = 'sauce-minigame-modal';

  const recipeNames = recipe.map(id => SPICE_MAP[id].shortName).join(' ➔ ');

  modalContainer.innerHTML = `
    <div class="sauce-modal-box success-mode">
      <div class="sauce-celebration-badge">✨ BUFF ĐANG KÍCH HOẠT</div>
      <div class="sauce-golden-pot">🍲</div>
      <h2 class="sauce-success-title">Nồi Sốt Hôm Nay Đã Đạt Chuẩn!</h2>
      <p class="sauce-success-desc">
        Công thức hôm nay: <b>${recipeNames}</b>
        <br>Hiệu ứng <b>+3.000đ Tip</b> & <b>+0.25★ Hương Vị</b> đang bảo hộ cho toàn bộ ca bán!
      </p>
      <div class="sauce-modal-actions">
        <button id="btn-sauce-already-done" class="btn-sm primary btn-sauce-action">
          Tuyệt Vời · Tiếp Tục
        </button>
      </div>
    </div>
  `;

  modalContainer.querySelector('#btn-sauce-already-done')?.addEventListener('click', () => {
    audio.playPop();
    modalContainer.remove();
    onClose();
  });

  document.body.appendChild(modalContainer);
}
