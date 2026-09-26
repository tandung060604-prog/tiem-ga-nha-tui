import { TutorialHint } from '../../core/tutorial';
import { ASSETS } from '../../content/assets';

// Bong bóng lời Bác Ba + viền sáng quanh nút cần bấm. Nằm NGOÀI #main-view (màn bán hàng dựng lại
// HTML liên tục) → chỉ vẽ lại khi đổi bước. Viền sáng gắn lại mỗi frame vì nút có thể vừa được dựng mới.
// CSS nằm trong kitchen.css: .tutorial-layer, .tutorial-bubble, .tutorial-avatar, .tutorial-text,
// .tutorial-actions, .tutorial-target.

const LAYER_ID = 'tutorial-layer';
const TARGET_CLASS = 'tutorial-target';
let shownKey = '';

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
    document.body.appendChild(layer);
  }
  // Chỉ vào thẻ khách / lời kết → bong bóng ở dưới; chỉ vào nút bếp (nửa dưới màn) → bong bóng ở trên
  const atBottom = !hint.target || hint.target === '.customer-card';
  layer.className = `tutorial-layer ${atBottom ? 'at-bottom' : 'at-top'}`;
  layer.innerHTML = `
    <div class="tutorial-bubble" role="dialog" aria-live="polite">
      <img class="tutorial-avatar" src="${ASSETS.bacba.front}" alt="Bác Ba" />
      <div class="tutorial-body">
        <div class="tutorial-speaker">Bác Ba</div>
        <div class="tutorial-text">${hint.text}</div>
        <div class="tutorial-actions">
          ${hint.step === 'done' ? '' : '<button id="btn-tutorial-skip" class="btn-sm btn-tutorial-skip">Bỏ qua hướng dẫn</button>'}
          ${hint.button ? `<button id="btn-tutorial-next" class="btn-sm primary btn-tutorial-next">${hint.button}</button>` : ''}
        </div>
      </div>
    </div>`;
  layer.querySelector('#btn-tutorial-next')?.addEventListener('click', actions.onButton);
  layer.querySelector('#btn-tutorial-skip')?.addEventListener('click', actions.onSkip);
}
