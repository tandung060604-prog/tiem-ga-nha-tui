import { TutorialHint, PrepTutorialHint } from '../../core/tutorial';
import { ASSETS } from '../../content/assets';

// Bong bóng lời Bác Ba + Hiệu ứng Spotlight Highlight (chiếu sáng nút mục tiêu, làm tối xung quanh).
// Nằm NGOÀI #main-view (màn bán hàng dựng lại HTML liên tục) → chỉ vẽ lại khi đổi bước.
// CSS nằm trong kitchen.css: .tutorial-spotlight-box, .tutorial-spotlight-arrow, .tutorial-layer,
// .tutorial-bubble, .tutorial-avatar, .tutorial-text, .tutorial-actions, .tutorial-target.

const LAYER_ID = 'tutorial-layer';
const SPOTLIGHT_ID = 'tutorial-spotlight';
const TARGET_CLASS = 'tutorial-target';

let shownKey = '';
let activeTargetSelector: string | null = null;
let trackingListenersAttached = false;

function updateSpotlight() {
  const spot = document.getElementById(SPOTLIGHT_ID);
  if (!activeTargetSelector || !spot) {
    if (spot) spot.style.display = 'none';
    return;
  }
  const el = document.querySelector<HTMLElement>(activeTargetSelector);
  if (!el) {
    spot.style.display = 'none';
    return;
  }
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) {
    spot.style.display = 'none';
    return;
  }

  spot.style.display = 'block';
  const pad = 6;
  spot.style.top = `${Math.max(0, r.top - pad)}px`;
  spot.style.left = `${Math.max(0, r.left - pad)}px`;
  spot.style.width = `${r.width + pad * 2}px`;
  spot.style.height = `${r.height + pad * 2}px`;

  const computedRadius = window.getComputedStyle(el).borderRadius;
  spot.style.borderRadius = computedRadius && computedRadius !== '0px' ? computedRadius : '8px';

  // Điều chỉnh hướng mũi tên trỏ vào nút (nếu nút ở nửa dưới màn hình thì mũi tên trỏ từ trên xuống 👇)
  const arrow = document.getElementById('tutorial-spotlight-arrow');
  if (arrow) {
    const isLower = r.top > window.innerHeight * 0.5;
    arrow.innerHTML = `<span class="spotlight-arrow-icon">${isLower ? '👆' : '👇'}</span><span class="spotlight-arrow-pill">Chạm vô đây nè con!</span>`;
    arrow.className = `tutorial-spotlight-arrow ${isLower ? 'arrow-above' : 'arrow-below'}`;
  }
}

let glideAnimId: number | null = null;
function glideTrackingToTarget(durationMs = 600) {
  if (glideAnimId) cancelAnimationFrame(glideAnimId);
  const startTime = performance.now();
  const tick = () => {
    updateSpotlight();
    if (performance.now() - startTime < durationMs && activeTargetSelector) {
      glideAnimId = requestAnimationFrame(tick);
    } else {
      glideAnimId = null;
      updateSpotlight();
    }
  };
  glideAnimId = requestAnimationFrame(tick);
}

function ensureTrackingListeners() {
  if (trackingListenersAttached) return;
  trackingListenersAttached = true;
  window.addEventListener('scroll', updateSpotlight, true);
  window.addEventListener('resize', updateSpotlight);
}

function removeTrackingListeners() {
  if (!trackingListenersAttached) return;
  trackingListenersAttached = false;
  window.removeEventListener('scroll', updateSpotlight, true);
  window.removeEventListener('resize', updateSpotlight);
  if (glideAnimId) {
    cancelAnimationFrame(glideAnimId);
    glideAnimId = null;
  }
}

export interface TutorialActions { onButton: () => void; onSkip: () => void }

export function syncTutorialLayer(hint: TutorialHint | PrepTutorialHint | null, actions: TutorialActions) {
  // Gỡ class highlight khỏi các nút cũ
  document.querySelectorAll(`.${TARGET_CLASS}`).forEach(el => {
    if (!hint?.target || !el.matches(hint.target)) el.classList.remove(TARGET_CLASS);
  });

  if (!hint) {
    document.getElementById(LAYER_ID)?.remove();
    document.getElementById(SPOTLIGHT_ID)?.remove();
    removeTrackingListeners();
    shownKey = '';
    activeTargetSelector = null;
    return;
  }

  activeTargetSelector = hint.target;
  const targetEl = hint.target ? document.querySelector<HTMLElement>(hint.target) : null;
  if (targetEl) {
    targetEl.classList.add(TARGET_CLASS);
  }

  // Quản lý Spotlight Box (Khoét lỗ sáng nút mục tiêu, làm tối sầm xung quanh)
  let spotlight = document.getElementById(SPOTLIGHT_ID);
  if (hint.target) {
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.id = SPOTLIGHT_ID;
      spotlight.className = 'tutorial-spotlight-box';
      spotlight.innerHTML = '<div class="tutorial-spotlight-arrow" id="tutorial-spotlight-arrow"><span class="spotlight-arrow-icon">👇</span><span class="spotlight-arrow-pill">Chạm vô đây nè con!</span></div>';
      document.body.appendChild(spotlight);
    }
    ensureTrackingListeners();
  } else if (spotlight) {
    spotlight.remove();
  }

  // Hiệu ứng cuộn và chuyển tiếp mượt mà tới nút mục tiêu khi đổi bước
  if (shownKey !== hint.step && targetEl) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    targetEl.scrollIntoView({ block: 'center', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    glideTrackingToTarget(650);
  } else {
    updateSpotlight();
  }

  if (shownKey === hint.step && document.getElementById(LAYER_ID)) return;
  shownKey = hint.step;

  let layer = document.getElementById(LAYER_ID);
  if (!layer) {
    layer = document.createElement('div');
    layer.id = LAYER_ID;
    document.body.appendChild(layer);
  }

  // Tính vị trí thông minh cho bong bóng thoại Bác Ba:
  // Nếu nút ở nửa dưới màn hình -> bong bóng ở trên; nếu nút ở nửa trên -> bong bóng ở dưới.
  let isTargetNearBottom = false;
  if (targetEl) {
    const r = targetEl.getBoundingClientRect();
    isTargetNearBottom = r.top > window.innerHeight * 0.45;
  }
  const atBottom = !targetEl || !isTargetNearBottom;

  layer.className = `tutorial-layer ${atBottom ? 'at-bottom' : 'at-top'}`;
  layer.innerHTML = `
    <div class="tutorial-bubble stardew-dialog-box" role="dialog" aria-live="polite">
      <div class="tutorial-avatar-wrap">
        <img class="tutorial-avatar" src="${ASSETS.bacba.front}" alt="Bác Ba" />
        <span class="tutorial-avatar-badge">BÁC BA</span>
      </div>
      <div class="tutorial-body">
        <div class="tutorial-header-row">
          <div class="tutorial-speaker">Bác Ba Nghệ Nhân</div>
          <div class="tutorial-step-pill">HƯỚNG DẪN TRUYỀN NGHỀ</div>
        </div>
        <div class="tutorial-text">${hint.text}</div>
        <div class="tutorial-actions">
          ${hint.step === 'done' ? '' : '<button id="btn-tutorial-skip" class="btn-sm btn-tutorial-skip">✕ Bỏ qua</button>'}
          ${hint.button ? `<button id="btn-tutorial-next" class="btn-sm primary btn-tutorial-next">${hint.button}</button>` : ''}
        </div>
      </div>
    </div>`;

  layer.querySelector('#btn-tutorial-next')?.addEventListener('click', actions.onButton);
  layer.querySelector('#btn-tutorial-skip')?.addEventListener('click', actions.onSkip);
}
