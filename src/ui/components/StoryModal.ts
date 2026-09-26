import { GameState } from '../../types/game';
import { STORY_ACTS, StoryEpisode, chooseDialogueOption } from '../../content/storyNovel';
import { audio } from '../../core/audio';

export function renderStoryModal(state: GameState, selectedActIndex: number = 0): string {
  const currentChapter = state.currentChapter;
  const karma = state.karma || { community: 50, craftsmanship: 50, ambition: 50 };

  const actsListHtml = STORY_ACTS.map((episode, idx) => {
    const isUnlocked = episode.chapterRequirement <= currentChapter;
    const isSelected = idx === selectedActIndex;

    return `
      <button class="story-act-btn ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" data-act-idx="${idx}">
        <div style="font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
          <span>${episode.title.split(':')[0]}</span>
          ${isUnlocked ? '<span style="color: var(--mint-dark); font-size: 0.72rem;">Đã mở</span>' : '<span style="color: var(--soft); font-size: 0.72rem;">🔒 Chương ' + episode.chapterRequirement + '</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--soft); text-align: left; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${episode.title.split(':')[1] || episode.title}
        </div>
      </button>
    `;
  }).join('');

  const currentEpisode: StoryEpisode = STORY_ACTS[selectedActIndex] || STORY_ACTS[0];
  const isCurrentUnlocked = currentEpisode.chapterRequirement <= currentChapter;

  // Lựa chọn hiện tại đã chọn
  const chosenId = currentEpisode.options?.find(opt => state.chosenDialogueIds?.includes(opt.id))?.id;
  const chosenOption = currentEpisode.options?.find(opt => opt.id === chosenId);

  const optionsHtml = currentEpisode.options ? currentEpisode.options.map(opt => {
    const isChosen = opt.id === chosenId;
    const isDisabled = Boolean(chosenId && !isChosen);

    const karmaBadges = [
      opt.karmaEffect.community ? `❤️ ${opt.karmaEffect.community > 0 ? '+' : ''}${opt.karmaEffect.community}` : '',
      opt.karmaEffect.craftsmanship ? `🔥 ${opt.karmaEffect.craftsmanship > 0 ? '+' : ''}${opt.karmaEffect.craftsmanship}` : '',
      opt.karmaEffect.ambition ? `💼 ${opt.karmaEffect.ambition > 0 ? '+' : ''}${opt.karmaEffect.ambition}` : ''
    ].filter(Boolean).join(' · ');

    return `
      <button class="btn-story-choice ${isChosen ? 'chosen' : ''}" data-act-idx="${selectedActIndex}" data-opt-id="${opt.id}" ${isDisabled ? 'disabled' : ''} style="display: block; width: 100%; text-align: left; background: ${isChosen ? '#e8f5e9' : isDisabled ? '#f5f5f5' : '#fff'}; border: 1.5px solid ${isChosen ? '#2e7d32' : 'var(--line)'}; border-radius: 8px; padding: 10px; margin-bottom: 8px; cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; opacity: ${isDisabled ? '0.6' : '1'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-weight: 800; font-size: 0.75rem; color: ${isChosen ? '#2e7d32' : 'var(--red)'};">${opt.kicker}</span>
          <span style="font-size: 0.72rem; color: var(--soft); font-weight: 700;">${karmaBadges}</span>
        </div>
        <div style="font-size: 0.84rem; color: var(--ink); line-height: 1.35;">${opt.label}</div>
      </button>
    `;
  }).join('') : '';

  return `
    <div style="text-align: left; display: flex; flex-direction: column; gap: 10px; max-height: 85vh;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px;">
        <div>
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--ink);">📖 Visual Novel: Hẻm 1102</h2>
          <small style="color: var(--soft); font-size: 0.75rem;">12 nhân vật chính · Cây hội thoại phân nhánh & 5 Đại kết cục</small>
        </div>
        <button id="btn-close-story" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: var(--soft);">✕</button>
      </div>

      <!-- Karma Bar Summary -->
      <div style="display: flex; gap: 8px; justify-content: space-around; background: #fff8f0; padding: 6px 12px; border-radius: 10px; border: 1px solid #ffe0b2; font-size: 0.76rem; font-weight: 700;">
        <span>❤️ Tình Thân: <b style="color: #c62828;">${karma.community}</b></span>
        <span>🔥 Lửa Nghề: <b style="color: #e65100;">${karma.craftsmanship}</b></span>
        <span>💼 Tham Vọng: <b style="color: #1565c0;">${karma.ambition}</b></span>
      </div>

      <!-- Acts Horizontal Selector -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
        ${actsListHtml}
      </div>

      <!-- Reading Body -->
      <div style="background: #faf4ea; border: 2px solid var(--line); border-radius: var(--radius-md); padding: 14px; overflow-y: auto; max-height: 52vh; font-family: var(--font-body); line-height: 1.6; font-size: 0.88rem; color: #3d2c2e;">
        ${isCurrentUnlocked ? `
          <div style="border-bottom: 1.5px dashed var(--line); padding-bottom: 8px; margin-bottom: 12px;">
            <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--red);">
              ${currentEpisode.title}
            </div>
            <div style="font-weight: 700; color: #8a6452; font-size: 0.82rem; margin-top: 2px;">
              ${currentEpisode.subtitle}
            </div>
            <div style="font-size: 0.74rem; color: var(--soft); margin-top: 4px;">
              👥 <b>Nhân vật xuất hiện:</b> ${currentEpisode.characters.join(' · ')}
            </div>
          </div>

          <div style="white-space: pre-line; text-align: justify;">
            ${currentEpisode.fullStory.trim()}
          </div>

          <!-- Dilemma & Branching Choices -->
          ${currentEpisode.dilemmaPrompt ? `
            <div style="margin-top: 18px; padding-top: 14px; border-top: 2px dashed #d7ccc8;">
              <div style="font-weight: 800; font-size: 0.88rem; color: #5d4037; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <span>⚡ LỰA CHỌN QUYẾT ĐỊNH HƯỚNG ĐI</span>
              </div>
              <div style="font-size: 0.82rem; color: #6d4c41; margin-bottom: 12px; font-style: italic;">
                "${currentEpisode.dilemmaPrompt}"
              </div>

              ${optionsHtml}

              ${chosenOption ? `
                <div style="background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 8px; padding: 10px; margin-top: 10px; font-size: 0.82rem; color: #1b5e20;">
                  <b>💬 Diễn biến tiếp theo:</b> ${chosenOption.reactionNarrative}
                </div>
              ` : ''}
            </div>
          ` : ''}
        ` : `
          <div style="text-align: center; padding: 40px 10px; color: var(--soft);">
            <div style="font-size: 3rem; margin-bottom: 8px;">🔒</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--ink);">Hồi Truyện Này Chưa Mở Khóa</div>
            <p style="font-size: 0.82rem; margin-top: 6px; line-height: 1.4;">
              Bạn cần đạt <b>Chương ${currentEpisode.chapterRequirement}</b> để mở khóa câu chuyện tiếp theo của cư dân Hẻm 1102!
            </p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function bindStoryEvents(
  _state: GameState,
  onOpenStoryWithIndex: (idx: number) => void,
  onClose: () => void,
  onUpdateState?: (fn: (draft: GameState) => void) => void,
  showToast?: (msg: string) => void
) {
  const closeBtn = document.getElementById('btn-close-story');
  if (closeBtn) {
    closeBtn.onclick = () => {
      audio.playPop();
      onClose();
    };
  }

  const actBtns = document.querySelectorAll('.story-act-btn');
  actBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-act-idx') || '0', 10);
      audio.playPop();
      onOpenStoryWithIndex(idx);
    });
  });

  const choiceBtns = document.querySelectorAll('.btn-story-choice:not([disabled])');
  choiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const actIdx = parseInt(target.getAttribute('data-act-idx') || '0', 10);
      const optId = target.getAttribute('data-opt-id') || '';

      if (!onUpdateState) return;

      onUpdateState(draft => {
        const res = chooseDialogueOption(draft, actIdx, optId);
        if (res.success) {
          audio.playPerfect();
          if (showToast) showToast(`✨ Đã chọn hướng đi mới! Điểm Karma được cập nhật.`);
        } else if (showToast && res.message) {
          showToast(res.message);
        }
      });

      // Re-render modal với act hiện tại
      onOpenStoryWithIndex(actIdx);
    });
  });
}
