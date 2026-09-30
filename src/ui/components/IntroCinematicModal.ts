import { ASSETS } from '../../content/assets';
export const INTRO_DURATION_SECONDS = 12;

export interface IntroCinematicOptions {
  onComplete: () => void;
  forceShow?: boolean;
}

export function shouldShowIntroVideo(): boolean {
  return true; // Luôn hiển thị video mở màn khi bật app
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
    <div id="intro-cinematic-overlay" class="intro-cinematic-overlay intro-cinematic-minimal" role="dialog" aria-modal="true" aria-label="Video mở màn 3D Pixel Tiệm Gà Nhà Tui" tabindex="0">
      <div class="intro-cinematic-card">
        <!-- Khung chiếu video lấp kín 100% màn hình điện thoại dọc (Edge-to-Edge Portrait Fullscreen Viewport) -->
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

        <!-- Dòng chữ nhấp nháy phát sáng ở đáy: CHẠM VÀO MÀN HÌNH ĐỂ VÀO GAME -->
        <div class="intro-tap-prompt-container">
          <div class="intro-tap-prompt" id="intro-tap-prompt">
            <span class="tap-sparkle">✨</span>
            <span class="tap-text">CHẠM VÀO MÀN HÌNH ĐỂ VÀO GAME</span>
            <span class="tap-sparkle">✨</span>
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

  let isClosed = false;

  const viewport = document.getElementById('intro-3d-viewport');
  const stage = document.getElementById('intro-3d-stage');
  const videoEl = document.getElementById('intro-video-element') as HTMLVideoElement | null;
  const imgEl = document.getElementById('intro-cinematic-img') as HTMLImageElement | null;

  if (videoEl) {
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('webkit-playsinline', '');
    videoEl.setAttribute('autoplay', '');
    videoEl.setAttribute('loop', '');

    const startPlayback = () => {
      videoEl.style.display = 'block';
      if (imgEl) imgEl.style.display = 'none';
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay waiting for gesture:', err);
        });
      }
    };

    startPlayback();
    videoEl.addEventListener('canplay', startPlayback);
    videoEl.addEventListener('loadeddata', startPlayback);
    videoEl.addEventListener('playing', () => {
      videoEl.style.display = 'block';
      if (imgEl) imgEl.style.display = 'none';
    });

    videoEl.onended = () => {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    };

    videoEl.onerror = () => {
      videoEl.style.display = 'none';
      if (imgEl) imgEl.style.display = 'block';
    };
  }

  // Hiệu ứng tương tác 3D Parallax Tilt nhẹ khi rê chuột / chạm
  if (viewport && stage) {
    const handleMove = (clientX: number, clientY: number) => {
      const rect = viewport.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      stage.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 5}deg) scale(1.02)`;
    };

    viewport.addEventListener('pointermove', (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    });

    viewport.addEventListener('pointerleave', () => {
      stage.style.transform = '';
    });
  }

  const closeAndProceed = () => {
    if (isClosed) return;
    isClosed = true;

    window.removeEventListener('keydown', handleKeyDown);

    if (videoEl) {
      try { videoEl.pause(); } catch {}
    }

    // Hiệu ứng chuyển cảnh màn hình mượt mà (Fade out & Flash golden transition)
    overlay.classList.add('fade-out-screen');
    setTimeout(() => {
      overlay.remove();
      options.onComplete();
    }, 350);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      closeAndProceed();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  overlay.addEventListener('click', closeAndProceed);
  overlay.addEventListener('pointerdown', closeAndProceed, { passive: true });
}
