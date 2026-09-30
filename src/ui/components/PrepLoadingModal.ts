import { ASSETS } from '../../content/assets';

export interface PrepLoadingOptions {
  onComplete: () => void;
  durationMs?: number;
}

const STEP_LABELS = [
  { at: 0, text: 'Đang nổi lửa chảo gang Chợ Lớn...' },
  { at: 30, text: 'Đang ướp bột gia vị bí truyền thơm nức mũi...' },
  { at: 65, text: 'Bày gà tươi lên khay inox, ướp lạnh nước ngọt...' },
  { at: 90, text: 'Keng keng! Sẵn sàng mở cửa đón khách nhen!' }
];

export function showPrepLoadingModal(options: PrepLoadingOptions): void {
  const isHeadless = typeof navigator !== 'undefined' && /HeadlessChrome/.test(navigator.userAgent);
  const duration = options.durationMs ?? (isHeadless ? 60 : 1300);
  const overlayId = 'prep-loading-overlay';
  document.getElementById(overlayId)?.remove();

  const chickenArt = ASSETS.gabong.vui;

  const html = `
    <div id="${overlayId}" class="prep-loading-overlay" role="alert" aria-busy="true" title="Chạm để bỏ qua nhanh">
      <div class="prep-loading-box stardew-box">
        <!-- Asset con gà xoay tròn vui nhộn -->
        <div class="chicken-spinner-container">
          <div class="chicken-halo-glow"></div>
          <img src="${chickenArt}" alt="Gà Bông đang chuẩn bị món" class="chicken-spinning-asset" />
          <div class="steam-bubble sb-1">💨</div>
          <div class="steam-bubble sb-2">✨</div>
          <div class="steam-bubble sb-3">🍗</div>
        </div>

        <!-- Lời dặn ân cần phong cách Miền Tây -->
        <div class="prep-dialog-cloud">
          <div class="dialog-speaker-row">
            <span class="speaker-name-badge">Gà Bông Phụ Bếp:</span>
          </div>
          <p class="dialog-speech-text">
            "Chèn ơi đợi tui một chút xíu nghen! Đang bày thịt gà tươi, chiết sốt bí truyền ra khay cho giòn rụm nóng hổi nè bà con ơi!"
          </p>
        </div>

        <!-- Thanh loading pixel retro -->
        <div class="prep-loading-bar-wrapper">
          <div class="prep-loading-bar-track">
            <div id="prep-progress-fill" class="prep-loading-bar-fill" style="width: 0%;"></div>
          </div>
          <div id="prep-loading-status-text" class="prep-loading-status-text">
            Đang nổi lửa chảo gang Chợ Lớn...
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  const overlay = document.getElementById(overlayId);
  if (!overlay) {
    options.onComplete();
    return;
  }

  let isDone = false;
  const finish = () => {
    if (isDone) return;
    isDone = true;
    overlay.classList.add('prep-fade-out');
    setTimeout(() => {
      overlay.remove();
      options.onComplete();
    }, 150);
  };

  overlay.addEventListener('click', finish);

  const fillEl = document.getElementById('prep-progress-fill');
  const statusEl = document.getElementById('prep-loading-status-text');
  const startTime = performance.now();

  const updateProgress = () => {
    if (isDone) return;
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const percent = Math.round(progress * 100);

    if (fillEl) fillEl.style.width = `${percent}%`;

    const currentStep = [...STEP_LABELS].reverse().find(s => percent >= s.at);
    if (statusEl && currentStep && statusEl.textContent !== currentStep.text) {
      statusEl.textContent = currentStep.text;
    }

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      finish();
    }
  };

  requestAnimationFrame(updateProgress);

  // Failsafe timer (bảo đảm luôn kết thúc kể cả khi rAF bị throttle do tab chạy ngầm)
  setTimeout(finish, duration + 300);
}
