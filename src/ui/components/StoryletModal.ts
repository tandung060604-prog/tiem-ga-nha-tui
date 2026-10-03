import { Storylet, StoryletChoice } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

export function renderStoryletModal(storylet: Storylet): string {
  const choicesHtml = storylet.choices.map((choice: StoryletChoice) => `
    <button class="pixel-btn storylet-choice-btn" data-choice-id="${choice.id}" style="width: 100%; min-height: 48px; text-align: left; padding: 10px 14px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px; border-radius: 8px; cursor: pointer;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-weight: 800; font-size: 0.88rem; color: var(--pixel-wood-dark, #3d2314);">${escapeHtml(choice.label)}</span>
        ${choice.kicker ? `<span class="badge" style="font-size: 0.68rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 800;">${escapeHtml(choice.kicker)}</span>` : ''}
      </div>
      ${choice.subDesc ? `<div style="font-size: 0.74rem; color: #664d38; font-weight: 600;">${escapeHtml(choice.subDesc)}</div>` : ''}
    </button>
  `).join('');

  return `
    <div class="storylet-night-modal" style="text-align: left; display: flex; flex-direction: column; gap: 12px; max-height: 82vh; overflow-y: auto; background: #faf4e8; border-radius: 12px; padding: 16px; border: 3px solid #5a3018; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #b8860b; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #b8860b; overflow: hidden; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
            ${storylet.characterAvatar.startsWith('http') || storylet.characterAvatar.startsWith('/') 
              ? `<img src="${storylet.characterAvatar}" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeHtml(storylet.characterName)}" />`
              : storylet.characterAvatar}
          </div>
          <div>
            <div style="font-size: 0.72rem; color: #854d0e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">🌙 KÝ ỨC ĐÊM HẺM 1102</div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #3d2314;">${escapeHtml(storylet.title)}</h3>
          </div>
        </div>
      </div>

      <!-- Setting Atmosphere -->
      <div style="background: rgba(184, 134, 11, 0.1); border-left: 3px solid #b8860b; padding: 6px 10px; border-radius: 0 6px 6px 0; font-size: 0.74rem; color: #5a3018; font-style: italic;">
        📍 ${escapeHtml(storylet.setting)}
      </div>

      <!-- Narrative Text -->
      <div style="background: #fffdf8; border: 1.5px solid #d4a373; border-radius: 8px; padding: 12px; line-height: 1.6; font-size: 0.86rem; color: #2d1810; display: flex; flex-direction: column; gap: 8px;">
        ${storylet.narrativeLines.map(p => `<p style="margin: 0;">${escapeHtml(p)}</p>`).join('')}
      </div>

      <!-- Choices Prompt -->
      <div>
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
