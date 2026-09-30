import { ASSETS } from '../../content/assets';

const STORAGE_KEY = 'tiem_ga_skip_intro_video';
const INTRO_DURATION_SECONDS = 12;

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

export const INTRO_VOICEOVER_PHASES = [
  {
    start: 0,
    end: 4,
    text: 'Mèn đét ơi! Sáng sớm tinh mơ mà cái Hẻm 1102 này đã thơm phức mùi gà chiên giòn rụm rồi nghen bà con ơi! 🌅',
    tag: '00:00 · Hẻm Phố Bình Minh'
  },
  {
    start: 4,
    end: 8,
    text: 'Chảo gang dầu sôi sùng sục, từng mẻ gà vàng ươm ráo dầu vừa nhấc lên là giòn rụm tới tận xương đa! 🍗✨',
    tag: '00:04 · Chảo Gang Sôi Sục'
  },
  {
    start: 8,
    end: 11,
    text: 'Khách xếp hàng nườm nượp rồi kìa! Nhào vô phụ Bác Ba một tay con ơi, bữa nay tiệm mình khai trương hồng phát nghen! 🛵🎉',
    tag: '00:08 · Khách Xếp Hàng Mở Màn'
  },
  {
    start: 11,
    end: 14,
    text: 'Keng! Giờ lành đã điểm, treo biển hiệu gỗ lên rồi vô bán thôi con ơi! 🔔🔥',
    tag: '00:11 · Giờ Vàng Mở Tiệm'
  }
];

export function renderIntroCinematicModal(): string {
  const poster = ASSETS.intro.poster;
  const videoSrc = ASSETS.intro.video;

  return `
    <div id="intro-cinematic-overlay" class="intro-cinematic-overlay" role="dialog" aria-modal="true" aria-label="Video mở màn 3D Pixel Tiệm Gà Nhà Tui">
      <div class="intro-cinematic-card">
        <!-- Khung chiếu video lấp kín 100% màn hình điện thoại (Edge-to-Edge Fullscreen Viewport) -->
        <div class="intro-screen-viewport" id="intro-3d-viewport">
          <div class="intro-cinematic-stage" id="intro-3d-stage">
            <video id="intro-video-element" class="intro-cinematic-video" playsinline muted autoplay loop poster="${poster}" preload="auto">
              <source src="${videoSrc}" type="video/mp4" />
            </video>
            <img src="${poster}" alt="Góc phố Hẻm 1102 3D Pixel Diorama buổi sớm náo nhiệt" class="intro-cinematic-img animate-voxel-3d" id="intro-cinematic-img" />
            
            <!-- Lớp ánh sáng thể tích Ray-Tracing & Đèn lồng điện ảnh -->
            <div class="raytraced-light-cone"></div>
            <div class="lantern-glow"></div>
            
            <!-- Hạt khói thể tích & Đốm dầu sôi 3D bay bổng -->
            <div class="steam-particle sp-1"></div>
            <div class="steam-particle sp-2"></div>
            <div class="steam-particle sp-3"></div>
            <div class="gold-sparkle-3d gs-1"></div>
            <div class="gold-sparkle-3d gs-2"></div>
          </div>
        </div>

        <!-- Floating Top Bar: Header nổi ở đỉnh màn hình (Bán trong suốt mờ ảo) -->
        <div class="intro-card-header">
          <div class="intro-title-badge">
            <span class="veo3-badge">3D VOXEL VEO 3</span>
            <span class="intro-title-text">HẺM 1102 · KHỞI ĐẦU NGÀY MỚI</span>
          </div>
          <button id="btn-intro-skip-top" class="btn-intro-skip-corner" title="Vào game ngay">Bỏ qua ✕</button>
        </div>

        <!-- Huy hiệu công nghệ 3D góc trên -->
        <div class="intro-engine-pill">
          <span class="pill-dot"></span> 3D PIXEL DIORAMA · 12s CINEMATIC
        </div>

        <!-- Floating Bottom Container: Cụm điều khiển và phụ đề Bác Ba nổi ở đáy màn hình -->
        <div class="intro-card-footer">
          <!-- Thanh Timeline Tiến Trình Video 10-15s -->
          <div class="intro-video-timeline">
            <div class="timeline-meta">
              <span id="intro-timer-label" class="timer-label">00:00</span>
              <span class="timer-total">/ 00:12</span>
              <span id="intro-phase-tag" class="timeline-phase-tag">Hẻm Phố Bình Minh</span>
            </div>
            <div class="timeline-track">
              <div id="intro-timeline-bar" class="timeline-fill" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Dòng chữ phụ đề điện ảnh Miền Tây Bác Ba -->
          <div class="intro-subtitle-box">
            <div class="intro-speaker-tag">
              <img src="${ASSETS.bacba.front}" class="speaker-avatar-pixel" alt="Bác Ba" />
              <span>Bác Ba Nghệ Nhân:</span>
            </div>
            <p id="intro-subtitle-text" class="intro-subtitle-text">
              "${INTRO_VOICEOVER_PHASES[0]?.text ?? ''}"
            </p>
          </div>

          <!-- Thanh tùy chọn phụ: Không hiện lại & Xem lại -->
          <div class="intro-footer-top-row">
            <label class="intro-skip-toggle">
              <input type="checkbox" id="chk-never-show-intro" />
              <span class="custom-checkbox-pixel"></span>
              <span>Không hiện lại khi mở app</span>
            </label>
            <button id="btn-intro-replay" class="btn-replay-pixel" title="Phát lại từ đầu">↺ Xem lại</button>
          </div>

          <!-- Nút bấm Hero Bắt Đầu Vào Tiệm Gà -->
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

  let animationTimerId: number | null = null;
  let startTime = performance.now();
  let isClosed = false;

  const viewport = document.getElementById('intro-3d-viewport');
  const stage = document.getElementById('intro-3d-stage');
  const timelineBar = document.getElementById('intro-timeline-bar');
  const timerLabel = document.getElementById('intro-timer-label');
  const phaseTag = document.getElementById('intro-phase-tag');
  const subtitleText = document.getElementById('intro-subtitle-text');
  const videoEl = document.getElementById('intro-video-element') as HTMLVideoElement | null;
  const imgEl = document.getElementById('intro-cinematic-img') as HTMLImageElement | null;

  if (videoEl) {
    const startPlayback = () => {
      videoEl.style.display = 'block';
      if (imgEl) imgEl.style.display = 'none';
      videoEl.play().catch(() => {});
    };

    if (videoEl.readyState >= 2) {
      startPlayback();
    } else {
      videoEl.oncanplay = startPlayback;
      videoEl.onloadeddata = startPlayback;
    }

    videoEl.onerror = () => {
      videoEl.style.display = 'none';
      if (imgEl) imgEl.style.display = 'block';
    };
  }

  // Hiệu ứng tương tác 3D Parallax Tilt khi rê chuột / chạm nhẹ
  if (viewport && stage) {
    const handleMove = (clientX: number, clientY: number) => {
      const rect = viewport.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      stage.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    };

    viewport.addEventListener('pointermove', (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    });

    viewport.addEventListener('pointerleave', () => {
      stage.style.transform = '';
    });
  }

  // Cập nhật timeline 12s đồng bộ với video
  const updateTimeline = (now: number) => {
    if (isClosed) return;
    const elapsed = Math.min((now - startTime) / 1000, INTRO_DURATION_SECONDS);
    const progress = (elapsed / INTRO_DURATION_SECONDS) * 100;

    if (timelineBar) timelineBar.style.width = `${progress}%`;
    if (timerLabel) {
      const sec = Math.floor(elapsed);
      timerLabel.textContent = `00:${String(sec).padStart(2, '0')}`;
    }

    // Tìm phase phụ đề tương ứng
    const currentPhase = INTRO_VOICEOVER_PHASES.find(p => elapsed >= p.start && elapsed < p.end) 
      ?? INTRO_VOICEOVER_PHASES[INTRO_VOICEOVER_PHASES.length - 1]
      ?? INTRO_VOICEOVER_PHASES[0];

    if (currentPhase) {
      if (subtitleText && subtitleText.textContent !== `"${currentPhase.text}"`) {
        subtitleText.textContent = `"${currentPhase.text}"`;
      }
      if (phaseTag && phaseTag.textContent !== currentPhase.tag) {
        phaseTag.textContent = currentPhase.tag;
      }
    }

    if (elapsed < INTRO_DURATION_SECONDS) {
      animationTimerId = requestAnimationFrame(updateTimeline);
    }
  };

  animationTimerId = requestAnimationFrame(updateTimeline);

  // Nút xem lại video
  document.getElementById('btn-intro-replay')?.addEventListener('click', () => {
    startTime = performance.now();
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
    if (animationTimerId) cancelAnimationFrame(animationTimerId);
    animationTimerId = requestAnimationFrame(updateTimeline);
  });

  const closeAndProceed = () => {
    if (isClosed) return;
    isClosed = true;
    if (animationTimerId) cancelAnimationFrame(animationTimerId);

    const chk = document.getElementById('chk-never-show-intro') as HTMLInputElement | null;
    if (chk?.checked) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
    }

    // Hiệu ứng chuyển cảnh màn hình mượt mà (Fade out & Flash golden transition)
    overlay.classList.add('fade-out-screen');
    setTimeout(() => {
      overlay.remove();
      options.onComplete();
    }, 400);
  };

  document.getElementById('btn-intro-start-game')?.addEventListener('click', closeAndProceed);
  document.getElementById('btn-intro-skip-top')?.addEventListener('click', closeAndProceed);
}
