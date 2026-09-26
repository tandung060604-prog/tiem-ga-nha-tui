import { TutorialHint } from '../../core/tutorial';
import { ASSETS } from '../../content/assets';

// Bong bóng lời Bác Ba + viền sáng quanh nút cần bấm. Nằm NGOÀI #main-view (màn bán hàng dựng lại
// HTML liên tục) → chỉ vẽ lại khi đổi bước. Viền sáng gắn lại mỗi frame vì nút có thể vừa được dựng mới.
// Class cho Gemini style lại: .tutorial-layer, .tutorial-bubble, .tutorial-avatar, .tutorial-text,
// .tutorial-actions, .tutorial-target (đang có style tối thiểu inline bên dưới để chạy được ngay).

const LAYER_ID = 'tutorial-layer';
const TARGET_CLASS = 'tutorial-target';
let shownKey = '';

function ensureStyle() {
  if (document.getElementById('tutorial-style')) return;
  const style = document.createElement('style');
  style.id = 'tutorial-style';
  style.textContent = `
    .${TARGET_CLASS} { position: relative; z-index: 5; box-shadow: 0 0 0 3px #ffb400, 0 0 18px 4px rgba(255,180,0,.75) !important; animation: tutorial-pulse 1.1s ease-in-out infinite; }
    @keyframes tutorial-pulse { 50% { box-shadow: 0 0 0 5px #ffb400, 0 0 26px 8px rgba(255,180,0,.55); } }
    @media (prefers-reduced-motion: reduce) { .${TARGET_CLASS} { animation: none; } }`;
  document.head.appendChild(style);
}

export interface TutorialActions { onButton: () => void; onSkip: () => void }

export function syncTutorialLayer(hint: TutorialHint | null, actions: TutorialActions) {
  document.querySelectorAll(`.${TARGET_CLASS}`).forEach(el => {
    if (!hint?.target || !el.matches(hint.target)) el.classList.remove(TARGET_CLASS);
  });
  if (!hint) {
    document.getElementById(LAYER_ID)?.remove();
    shownKey = '';
    return;
  }
  ensureStyle();
  if (hint.target) document.querySelector(hint.target)?.classList.add(TARGET_CLASS);
  if (shownKey === hint.step && document.getElementById(LAYER_ID)) return;
  shownKey = hint.step;
  // Đổi bước → cuộn nút cần bấm vào giữa màn (iPhone SE: nút bếp thường nằm dưới mép màn hình)
  const targetEl = hint.target ? document.querySelector<HTMLElement>(hint.target) : null;
  if (targetEl) {
    const r = targetEl.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetEl.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  let layer = document.getElementById(LAYER_ID);
  if (!layer) {
    layer = document.createElement('div');
    layer.id = LAYER_ID;
    layer.className = 'tutorial-layer';
    document.body.appendChild(layer);
  }
  // Chỉ vào thẻ khách / lời kết → bong bóng ở dưới; chỉ vào nút bếp (nửa dưới màn) → bong bóng ở trên
  const atBottom = !hint.target || hint.target === '.customer-card';
  layer.setAttribute('style', `position: fixed; left: 0; right: 0; ${atBottom ? 'bottom: calc(12px + env(safe-area-inset-bottom))' : 'top: calc(8px + env(safe-area-inset-top))'}; z-index: 50; display: flex; justify-content: center; padding: 0 10px; pointer-events: none;`);
  layer.innerHTML = `
    <div class="tutorial-bubble" role="dialog" aria-live="polite" style="pointer-events: auto; display: flex; gap: 10px; align-items: flex-start; max-width: 480px; width: 100%; background: #fffaf0; border: 2px solid #f0b44c; border-radius: 16px; padding: 10px 12px; box-shadow: 0 6px 20px rgba(80,40,0,.25);">
      <img class="tutorial-avatar" src="${ASSETS.bacba.front}" alt="Bác Ba" style="width: 52px; height: 52px; object-fit: contain; flex: none;">
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 800; color: #b5541b; font-size: 0.8rem;">Bác Ba</div>
        <div class="tutorial-text" style="font-size: 0.86rem; line-height: 1.4; color: #3b2a1a;">${hint.text}</div>
        <div class="tutorial-actions" style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 6px;">
          ${hint.step === 'done' ? '' : '<button id="btn-tutorial-skip" class="btn-sm" style="min-height: 36px;">Bỏ qua hướng dẫn</button>'}
          ${hint.button ? `<button id="btn-tutorial-next" class="btn-sm primary" style="min-height: 36px;">${hint.button}</button>` : ''}
        </div>
      </div>
    </div>`;
  layer.querySelector('#btn-tutorial-next')?.addEventListener('click', actions.onButton);
  layer.querySelector('#btn-tutorial-skip')?.addEventListener('click', actions.onSkip);
}
