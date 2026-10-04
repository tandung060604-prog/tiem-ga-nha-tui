import { Storylet, StoryletChoice, KarmaState } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { playDialogueSequence } from '../typewriter';
import { audio } from '../../core/audio';

function renderKarmaDeltaBadges(delta?: Partial<KarmaState>): string {
  if (!delta) return '';
  const badges: string[] = [];
  if (delta.community) {
    const sign = delta.community > 0 ? `+${delta.community}` : `${delta.community}`;
    badges.push(`<span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 800;">❤️ ${sign} Tình Hẻm</span>`);
  }
  if (delta.craftsmanship) {
    const sign = delta.craftsmanship > 0 ? `+${delta.craftsmanship}` : `${delta.craftsmanship}`;
    badges.push(`<span style="background: rgba(245, 158, 11, 0.2); color: #fde047; border: 1px solid #f59e0b; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 800;">🔥 ${sign} Nghệ Nhân</span>`);
  }
  if (delta.ambition) {
    const sign = delta.ambition > 0 ? `+${delta.ambition}` : `${delta.ambition}`;
    badges.push(`<span style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 800;">🚀 ${sign} Tham Vọng</span>`);
  }
  return badges.length > 0 ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px;">${badges.join('')}</div>` : '';
}

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
    <div class="storylet-character-stage vn-character-stage" style="display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, rgba(69, 26, 3, 0.65), rgba(30, 14, 5, 0.85)); border: 2px solid #b8860b; border-radius: 12px; padding: 12px 14px; box-shadow: inset 0 0 12px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.3);">
      <div style="width: 64px; height: 64px; border-radius: 50%; border: 2.5px solid #f59e0b; overflow: hidden; background: #fff8eb; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
        <img src="${avatar}" alt="${escapeHtml(name)}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.72rem; color: #fde047; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          ${escapeHtml(role || 'Cư Dân Hẻm 1102')}
        </div>
        <div style="font-size: 1.05rem; font-weight: 900; color: #fffbeb; text-shadow: 1px 1px 2px #000;">
          ${escapeHtml(name)}
        </div>
        <div style="font-size: 0.72rem; color: #fef08a; font-style: italic; margin-top: 2px; opacity: 0.9;">
          Lặng lẽ ghé hiên quán lúc phố đã lên đèn...
        </div>
      </div>
    </div>
  `;
}

export function renderStoryletModal(storylet: Storylet): string {
  const choicesHtml = storylet.choices.map((choice: StoryletChoice) => `
    <button class="pixel-btn storylet-choice-btn retro-clickable vn-choice-card" data-choice-id="${choice.id}" style="width: 100%; min-height: 52px; text-align: left; padding: 12px 14px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 5px; border-radius: 10px; cursor: pointer; background: linear-gradient(135deg, rgba(69, 26, 3, 0.95), rgba(43, 16, 2, 0.98)); border: 2px solid #b8860b; box-shadow: 0 4px 12px rgba(0,0,0,0.4); transition: transform 0.12s ease, box-shadow 0.12s ease;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 6px;">
        <span style="font-weight: 900; font-size: 0.92rem; color: #fffbeb; text-shadow: 1px 1px 1px #000;">${escapeHtml(choice.label)}</span>
        ${choice.kicker ? `<span class="badge" style="font-size: 0.68rem; background: #fef3c7; color: #854d0e; padding: 2px 7px; border-radius: 4px; font-weight: 800; border: 1px solid #fde047; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${escapeHtml(choice.kicker)}</span>` : ''}
      </div>
      ${choice.subDesc ? `<div style="font-size: 0.76rem; color: #fef08a; font-weight: 600; opacity: 0.95;">${escapeHtml(choice.subDesc)}</div>` : ''}
      ${renderKarmaDeltaBadges(choice.effect?.karmaDelta)}
    </button>
  `).join('');

  const paragraphsHtml = storylet.narrativeLines.map((p, idx) => `
    <div class="storylet-dialogue-row vn-dialogue-row" style="display: ${idx === 0 ? 'flex' : 'none'}; margin-bottom: 8px;">
      <p style="margin: 0; line-height: 1.6; font-size: 0.92rem; color: #fffdf0; text-shadow: 1px 1px 1px rgba(0,0,0,0.8);">
        "<span class="storylet-text-line" data-full-text="${escapeHtml(p)}">${escapeHtml(p)}</span>"
      </p>
    </div>
  `).join('');

  return `
    <div id="modal-storylet-night" class="storylet-night-modal vn-dialogue-theatre" style="text-align: left; display: flex; flex-direction: column; gap: 12px; max-height: 88vh; overflow-y: auto; background: radial-gradient(circle at 50% 10%, #2e170c 0%, #150904 100%); border-radius: 16px; padding: 18px 16px; border: 3px solid #b8860b; box-shadow: 0 16px 45px rgba(0,0,0,0.85), inset 0 0 0 2px rgba(254, 240, 138, 0.25);">
      <!-- Header Điện Ảnh -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed rgba(245, 158, 11, 0.5); padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #f59e0b; overflow: hidden; background: #fff8eb; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            ${renderCharacterAvatar(storylet.characterAvatar, storylet.characterName)}
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #fde047; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;">🌙 KÝ ỨC ĐÊM HẺM 1102</div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #fffbeb; text-shadow: 1px 1px 2px #000;">${escapeHtml(storylet.title)}</h3>
          </div>
        </div>
        <!-- Nút Bỏ Qua Gõ Chữ -->
        <button id="btn-skip-storylet-typewriter" class="btn-sm pixel-btn" style="background: rgba(245, 158, 11, 0.25); color: #fde047; border: 1.5px solid #f59e0b; font-size: 0.72rem; font-weight: 800; padding: 5px 10px; border-radius: 8px; cursor: pointer;" title="Hiện nhanh toàn bộ">
          ⏩ Hiện Hết
        </button>
      </div>

      <!-- Setting Atmosphere -->
      <div style="background: rgba(184, 134, 11, 0.15); border-left: 3.5px solid #f59e0b; padding: 7px 12px; border-radius: 0 8px 8px 0; font-size: 0.78rem; color: #fef08a; font-style: italic;">
        📍 ${escapeHtml(storylet.setting)}
      </div>

      <!-- Character Model Stage -->
      ${renderCharacterModelStage(storylet.characterAvatar, storylet.characterName, storylet.characterRole)}

      <!-- Visual Novel Dialogue Box (Typewriter Crawl) -->
      <div style="position: relative; margin-top: 4px;">
        <!-- Floating Nameplate -->
        <div style="position: absolute; top: -11px; left: 14px; background: #854d0e; color: #fef08a; border: 1.5px solid #fde047; border-radius: 6px; padding: 2px 10px; font-size: 0.72rem; font-weight: 900; text-transform: uppercase; z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
          💬 ${escapeHtml(storylet.characterName)}
        </div>
        <div id="storylet-narrative-box" class="vn-dialogue-box" style="background: rgba(18, 9, 4, 0.94); border: 2px solid #d4a373; border-radius: 12px; padding: 18px 14px 14px 14px; display: flex; flex-direction: column; gap: 6px; min-height: 80px; cursor: pointer; box-shadow: inset 0 0 14px rgba(0,0,0,0.6);">
          ${paragraphsHtml}
        </div>
      </div>

      <!-- Choices Prompt: BAN ĐẦU HOÀN TOÀN ẨN, CHỈ XUẤT HIỆN KHI KẾT THÚC THOẠI -->
      <div id="storylet-choices-section" class="vn-choices-tray" style="display: none; opacity: 0; transform: translateY(14px); transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-top: 4px;">
        <div style="font-size: 0.82rem; font-weight: 900; color: #fde047; margin-bottom: 8px; text-transform: uppercase; display: flex; align-items: center; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; overflow: hidden; border: 1.5px solid #38bdf8; background: #0f172a; flex-shrink: 0; box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);">
            <img src="/assets/characters/char_01_owner.png" alt="Tôi" style="width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated;" />
          </div>
          <span>🤔 LỰA CHỌN CỦA CHỦ TIỆM GÀ:</span>
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

  let choicesShown = false;
  const activateChoices = () => {
    if (choicesShown) return;
    choicesShown = true;

    if (skipBtn) {
      skipBtn.style.display = 'none';
    }

    if (choicesSection) {
      choicesSection.style.display = 'block';
      // Trigger reflow cho transition mượt mà
      void choicesSection.offsetHeight;
      choicesSection.style.opacity = '1';
      choicesSection.style.transform = 'translateY(0)';
      choicesSection.style.pointerEvents = 'auto';

      // Tự động cuộn xuống khay lựa chọn để người chơi chọn ngay
      setTimeout(() => {
        choicesSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }

    try { audio.playPop(); } catch {}
    if (onFinished) onFinished();
  };

  let skipController: (() => void) | null = null;

  void playDialogueSequence(lines, {
    containerEl: container || undefined,
    speedMs: 38, // Nhịp gõ thư thả có nhịp thở tự nhiên
    onAllDone: activateChoices
  }).then(ctrl => {
    skipController = ctrl.skipAll;
  });

  const doSkip = () => {
    if (skipBtn) {
      skipBtn.style.display = 'none';
    }
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

  // Click vào khung thoại cũng tự động skip nhanh toàn bộ
  if (container) {
    container.onclick = (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        doSkip();
      }
    };
  }

  return { skipAll: doSkip };
}

