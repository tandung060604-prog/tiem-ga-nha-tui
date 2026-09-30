import { ASSETS } from '../../content/assets';

const STORAGE_KEY = 'tiem_ga_skip_intro_video';

export interface IntroCinematicOptions {
  onComplete: () => void;
  forceShow?: boolean;
}

export function shouldShowIntroVideo(): boolean {
  try {
    if (typeof navigator !== 'undefined' && /HeadlessChrome/.test(navigator.userAgent)) {
      return false;
    }
    return localStorage.getItem(STORAGE_KEY) !== 'true';
  } catch {
    return true;
  }
}

export function renderIntroCinematicModal(): string {
  const poster = ASSETS.intro.poster;

  return `
    <div id="intro-cinematic-overlay" class="intro-cinematic-overlay" role="dialog" aria-modal="true" aria-label="Video mở màn Tiệm Gà Nhà Tui">
      <div class="intro-cinematic-card stardew-box">
        <!-- Header gỗ cổ điển -->
        <div class="intro-card-header">
          <div class="intro-title-badge">
            <img src="${ASSETS.icons.sparkle}" class="pixel-icon-sm" alt="" />
            <span>KHỞI ĐẦU NGÀY MỚI RỰC RỠ</span>
            <img src="${ASSETS.icons.sparkle}" class="pixel-icon-sm" alt="" />
          </div>
          <button id="btn-intro-skip-top" class="btn-intro-skip-corner" title="Bỏ qua video">Bỏ qua ✕</button>
        </div>

        <!-- Khung chiếu phim Retro 16-Bit -->
        <div class="intro-screen-viewport">
          <div class="intro-cinematic-stage">
            <img src="${poster}" alt="Góc phố Hẻm 1102 sáng sớm náo nhiệt" class="intro-cinematic-img animate-ken-burns" />
            
            <!-- Lớp khói hơi nước bốc lên từ chảo dầu -->
            <div class="steam-particle sp-1"></div>
            <div class="steam-particle sp-2"></div>
            <div class="steam-particle sp-3"></div>
            
            <!-- Đèn lồng đỏ lung linh -->
            <div class="lantern-glow"></div>

            <!-- Dòng chữ phụ đề điện ảnh Miền Tây Bác Ba -->
            <div class="intro-subtitle-box">
              <div class="intro-speaker-tag">
                <img src="${ASSETS.bacba.front}" class="speaker-avatar-pixel" alt="Bác Ba" />
                <span>Bác Ba Nghệ Nhân:</span>
              </div>
              <p class="intro-subtitle-text">
                "Mèn đét ơi! Sáng sớm ra là cái hẻm thơm phức mùi gà rán rồi đa! Chảo gang sôi xèo xèo, gà vàng giòn rụm, bà con cô bác xếp hàng đông vui dữ hôn? Vô lẹ phụ Bác Ba một tay con ơi, khách mở hàng rồi nè!"
              </p>
            </div>
          </div>
        </div>

        <!-- Thanh hành động chân trang -->
        <div class="intro-card-footer">
          <label class="intro-skip-toggle">
            <input type="checkbox" id="chk-never-show-intro" />
            <span class="custom-checkbox-pixel"></span>
            <span>Không hiện lại khi mở app</span>
          </label>

          <div class="intro-actions-row">
            <button id="btn-intro-start-game" class="btn-hero-pixel start-game-btn">
              <span class="btn-shine"></span>
              <img src="${ASSETS.icons.fireRush}" class="pixel-icon-btn" alt="" />
              <span>BẮT ĐẦU VÀO TIỆM GÀ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openIntroCinematicModal(options: IntroCinematicOptions): void {
  // Nếu đã chọn không hiện lại và không bị forceShow thì gọi onComplete ngay
  if (!options.forceShow && !shouldShowIntroVideo()) {
    options.onComplete();
    return;
  }

  // Gỡ overlay cũ nếu có
  document.getElementById('intro-cinematic-overlay')?.remove();

  document.body.insertAdjacentHTML('beforeend', renderIntroCinematicModal());
  const overlay = document.getElementById('intro-cinematic-overlay');
  if (!overlay) {
    options.onComplete();
    return;
  }

  const closeAndProceed = () => {
    const chk = document.getElementById('chk-never-show-intro') as HTMLInputElement | null;
    if (chk?.checked) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
    }

    // Hiệu ứng chuyển cảnh màn hình (Fade out & Flash golden transition)
    overlay.classList.add('fade-out-screen');
    setTimeout(() => {
      overlay.remove();
      options.onComplete();
    }, 450);
  };

  document.getElementById('btn-intro-start-game')?.addEventListener('click', closeAndProceed);
  document.getElementById('btn-intro-skip-top')?.addEventListener('click', closeAndProceed);
}
