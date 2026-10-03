import { Storylet, StoryletChoice } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { playDialogueSequence } from '../typewriter';

function renderCharacterAvatar(avatar: string, name: string): string {
  const isImg = avatar.includes('/') || avatar.includes('.') || avatar.startsWith('http');
  if (isImg) {
    return `<img src="${avatar}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="${escapeHtml(name)}" />`;
  }
  return `<span style="font-size: 1.8rem; line-height: 1;">${avatar}</span>`;
}

function renderCharacterModelStage(avatar: string, name: string, role?: string): string {
  const isImg = avatar.includes('/') || avatar.includes('.') || avatar.startsWith('http');
  if (!isImg) return '';

  return `
    <div class="storylet-character-stage" style="display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg, rgba(69, 26, 3, 0.08), rgba(184, 134, 11, 0.12)); border: 1.5px solid #d4a373; border-radius: 10px; padding: 10px 14px; margin-bottom: 4px;">
      <div style="width: 60px; height: 60px; border-radius: 50%; border: 2.5px solid #b8860b; overflow: hidden; background: #fff8eb; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
        <img src="${avatar}" alt="${escapeHtml(name)}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.72rem; color: #854d0e; font-weight: 800; text-transform: uppercase;">
          ${escapeHtml(role || 'Cư Dân Hẻm 1102')}
        </div>
        <div style="font-size: 0.95rem; font-weight: 900; color: #3d2314;">
          ${escapeHtml(name)}
        </div>
        <div style="font-size: 0.7rem; color: #78350f; font-style: italic; margin-top: 1px;">
          Lặng lẽ ghé hiên quán lúc phố đã lên đèn...
        </div>
      </div>
    </div>
  `;
}

export function renderStoryletModal(storylet: Storylet): string {
  const choicesHtml = storylet.choices.map((choice: StoryletChoice) => `
    <button class="pixel-btn storylet-choice-btn retro-clickable" data-choice-id="${choice.id}" style="width: 100%; min-height: 48px; text-align: left; padding: 10px 14px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px; border-radius: 8px; cursor: pointer; transition: transform 0.1s ease;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 4px;">
        <span style="font-weight: 800; font-size: 0.88rem; color: var(--pixel-wood-dark, #3d2314);">${escapeHtml(choice.label)}</span>
        ${choice.kicker ? `<span class="badge" style="font-size: 0.68rem; background: #fef3c7; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-weight: 800; border: 1px solid #fde047;">${escapeHtml(choice.kicker)}</span>` : ''}
      </div>
      ${choice.subDesc ? `<div style="font-size: 0.74rem; color: #664d38; font-weight: 600;">${escapeHtml(choice.subDesc)}</div>` : ''}
    </button>
  `).join('');

  const paragraphsHtml = storylet.narrativeLines.map((p, idx) => `
    <div class="storylet-dialogue-row" style="display: ${idx === 0 ? 'flex' : 'none'}; margin-bottom: 6px;">
      <p style="margin: 0; line-height: 1.55;">
        "<span class="storylet-text-line" data-full-text="${escapeHtml(p)}">${escapeHtml(p)}</span>"
      </p>
    </div>
  `).join('');

  return `
    <div id="modal-storylet-night" class="storylet-night-modal" style="text-align: left; display: flex; flex-direction: column; gap: 10px; max-height: 85vh; overflow-y: auto; background: #faf4e8; border-radius: 12px; padding: 16px; border: 3px solid #5a3018; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #b8860b; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #b8860b; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center;">
            ${renderCharacterAvatar(storylet.characterAvatar, storylet.characterName)}
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">🌙 KÝ ỨC ĐÊM HẺM 1102</div>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #3d2314;">${escapeHtml(storylet.title)}</h3>
          </div>
        </div>
        <!-- Nút Bỏ Qua Gõ Chữ -->
        <button id="btn-skip-storylet-typewriter" class="btn-sm" style="background: rgba(184, 134, 11, 0.15); color: #78350f; border: 1px solid #b8860b; font-size: 0.68rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; cursor: pointer;" title="Hiện nhanh toàn bộ">
          ⏩ Hiện Hết
        </button>
      </div>

      <!-- Setting Atmosphere -->
      <div style="background: rgba(184, 134, 11, 0.1); border-left: 3px solid #b8860b; padding: 6px 10px; border-radius: 0 6px 6px 0; font-size: 0.74rem; color: #5a3018; font-style: italic;">
        📍 ${escapeHtml(storylet.setting)}
      </div>

      <!-- Character Model Stage -->
      ${renderCharacterModelStage(storylet.characterAvatar, storylet.characterName, storylet.characterRole)}

      <!-- Narrative Text (Typewriter Crawl) -->
      <div id="storylet-narrative-box" style="background: #fffdf8; border: 1.5px solid #d4a373; border-radius: 8px; padding: 12px; font-size: 0.86rem; color: #2d1810; display: flex; flex-direction: column; gap: 4px; min-height: 60px; cursor: pointer;">
        ${paragraphsHtml}
      </div>

      <!-- Choices Prompt -->
      <div id="storylet-choices-section" style="opacity: 0.35; pointer-events: none; transition: opacity 0.3s ease;">
        <div style="font-size: 0.78rem; font-weight: 800; color: #5a3018; margin-bottom: 6px; text-transform: uppercase;">
          Lựa chọn của bạn đêm nay:
        </div>
        <div class="storylet-choices-list">
          ${choicesHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Khởi động hiệu ứng Typewriter cho Modal Ký Ức Đêm Hẻm 1102
 */
export function bindStoryletTypewriter(
  modalEl: HTMLElement,
  onFinished?: () => void
): { skipAll: () => void } {
  const container = modalEl.querySelector<HTMLElement>('#storylet-narrative-box');
  const textElements = Array.from(modalEl.querySelectorAll<HTMLElement>('.storylet-text-line'));
  const choicesSection = modalEl.querySelector<HTMLElement>('#storylet-choices-section');
  const skipBtn = modalEl.querySelector<HTMLElement>('#btn-skip-storylet-typewriter');

  const lines = textElements.map(el => ({
    textEl: el,
    fullText: el.getAttribute('data-full-text') || el.textContent || ''
  }));

  lines.forEach(l => {
    l.textEl.textContent = '';
  });

  const activateChoices = () => {
    if (choicesSection) {
      choicesSection.style.opacity = '1';
      choicesSection.style.pointerEvents = 'auto';
    }
    if (onFinished) onFinished();
  };

  let skipController: (() => void) | null = null;

  void playDialogueSequence(lines, {
    containerEl: container || undefined,
    onAllDone: activateChoices
  }).then(ctrl => {
    skipController = ctrl.skipAll;
  });

  const doSkip = () => {
    if (skipController) {
      skipController();
    } else {
      lines.forEach(l => {
        l.textEl.textContent = l.fullText;
        const row = l.textEl.closest<HTMLElement>('.storylet-dialogue-row');
        if (row) row.style.display = 'flex';
      });
      activateChoices();
    }
  };

  if (skipBtn) {
    skipBtn.onclick = (e) => {
      e.stopPropagation();
      doSkip();
    };
  }

  return { skipAll: doSkip };
}
