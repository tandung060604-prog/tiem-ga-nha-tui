import { GameState } from '../../types/game';
import { STORY_ACTS, StoryEpisode, chooseDialogueOption } from '../../content/storyNovel';
import { audio } from '../../core/audio';
import { chapterProgress } from '../../core/progression';
import { canNarrate } from '../../core/music';
import { ASSETS } from '../../content/assets';

export function getCharacterPortrait(name: string): string {
  if (name.includes('Bác Ba')) return ASSETS.bacba.front;
  if (name.includes('Thỏ Cam')) return ASSETS.thocam.front;
  if (name.includes('Học Sinh') || name.includes('Trí')) return ASSETS.hocsinh.stand;
  if (name.includes('Văn Phòng') || name.includes('Châu')) return ASSETS.vanphong.stand;
  if (name.includes('Karen') || name.includes('Khó Tính')) return ASSETS.karen.stand;
  if (name.includes('Shipper')) return ASSETS.shipper.stand;
  if (name.includes('Game') || name.includes('Cú Đêm')) return ASSETS.gamethu.stand;
  return ASSETS.gabong.front;
}

// Hồi của chương đang chơi hé mở dần theo tiến độ gom tiền cọc (25% → 100% số đoạn);
// hồi của chương đã qua thì đọc trọn. Lựa chọn quyết định chỉ hiện khi đọc hết.
export function revealedStory(episode: StoryEpisode, state: GameState): { text: string; shown: number; total: number; complete: boolean } {
  const paragraphs = episode.fullStory.trim().split(/\n\s*\n/).filter(p => p.trim());
  const total = paragraphs.length;
  const fraction = episode.chapterRequirement < state.currentChapter ? 1 : 0.25 + 0.75 * chapterProgress(state);
  const shown = Math.max(1, Math.min(total, Math.ceil(total * fraction)));
  return { text: paragraphs.slice(0, shown).join('\n\n'), shown, total, complete: shown >= total };
}

export function renderStoryModal(state: GameState, selectedActIndex: number = 0): string {
  const currentChapter = state.currentChapter;

  const actsListHtml = STORY_ACTS.map((episode, idx) => {
    const isUnlocked = episode.chapterRequirement <= currentChapter;
    const isSelected = idx === selectedActIndex;

    return `
      <button class="story-act-btn ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" data-act-idx="${idx}">
        <div style="font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
          <span>${isUnlocked ? episode.title.split(':')[0] : `Hồi ${episode.act}`}</span>
          ${isUnlocked ? '<span style="color: var(--mint-dark); font-size: 0.72rem;">Đã mở</span>' : '<span style="color: var(--soft); font-size: 0.72rem;">🔒 Chương ' + episode.chapterRequirement + '</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--soft); text-align: left; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${isUnlocked ? (episode.title.split(':')[1] || episode.title) : '???'}
        </div>
      </button>
    `;
  }).join('');

  const currentEpisode: StoryEpisode = STORY_ACTS[selectedActIndex] || STORY_ACTS[0];
  const isCurrentUnlocked = currentEpisode.chapterRequirement <= currentChapter;
  const revealed = revealedStory(currentEpisode, state);

  // Lựa chọn hiện tại đã chọn
  const chosenId = currentEpisode.options?.find(opt => state.chosenDialogueIds?.includes(opt.id))?.id;
  const chosenOption = currentEpisode.options?.find(opt => opt.id === chosenId);

  const optionsHtml = currentEpisode.options ? currentEpisode.options.map(opt => {
    const isChosen = opt.id === chosenId;
    const isDisabled = Boolean(chosenId && !isChosen);

    // Không hiện điểm karma: người chơi chọn theo lòng mình, hệ quả chỉ lộ ra ở kết thúc
    const karmaBadges = isChosen ? '✔ Đã chọn' : '';

    return `
      <button class="btn-story-choice ${isChosen ? 'chosen' : ''}" data-act-idx="${selectedActIndex}" data-opt-id="${opt.id}" ${isDisabled ? 'disabled' : ''}>
        <div class="btn-story-choice-top">
          <span class="btn-story-choice-kicker">${opt.kicker}</span>
          <span class="btn-story-choice-badge">${karmaBadges}</span>
        </div>
        <div class="btn-story-choice-label">${opt.label}</div>
      </button>
    `;
  }).join('') : '';

  const leftChar = currentEpisode.characters[1] || currentEpisode.characters[0] || 'Bác Ba Tổ Trưởng';
  const rightChar = currentEpisode.characters[0] || 'Chủ Tiệm Gà';

  return `
    <div style="text-align: left; display: flex; flex-direction: column; gap: 8px; max-height: 85vh;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px;">
        <div>
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--ink);">📖 Visual Novel: Hẻm 1102</h2>
          <small style="color: var(--soft); font-size: 0.75rem;">Truyện mở dần theo hành trình của tiệm</small>
        </div>
        <button id="btn-close-story" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: var(--soft);">✕</button>
      </div>

      <div style="font-size: 0.76rem; color: var(--soft); font-style: italic; text-align: center;">
        Hẻm 1102 đang lặng lẽ ghi nhớ từng lựa chọn của bạn…
      </div>

      <!-- Acts Horizontal Selector -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
        ${actsListHtml}
      </div>

      <!-- Visual Novel 2D Character Portraits -->
      ${isCurrentUnlocked ? `
        <div class="story-scene-stage">
          <div class="story-portraits">
            <img class="story-portrait is-speaking" src="${getCharacterPortrait(leftChar)}" alt="${leftChar}" title="${leftChar}">
            <img class="story-portrait is-muted" src="${getCharacterPortrait(rightChar)}" alt="${rightChar}" title="${rightChar}">
          </div>
        </div>
      ` : ''}

      <!-- Reading Body -->
      <div class="story-reading-panel">
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
            ${canNarrate() ? '<button id="btn-story-narrate" class="btn-sm" style="margin-top: 8px; min-height: 44px;">🔊 Nghe đọc</button>' : ''}
          </div>

          <div style="white-space: pre-line; text-align: justify;">
            ${revealed.text}
          </div>
          ${revealed.complete ? '' : `
            <div style="margin-top: 12px; text-align: center; font-size: 0.78rem; color: var(--soft); font-style: italic;">
              … Câu chuyện còn tiếp. Gom thêm tiền cọc chương này để đọc tiếp (${revealed.shown}/${revealed.total} đoạn).
            </div>`}

          <!-- Dilemma & Branching Choices -->
          ${currentEpisode.dilemmaPrompt && revealed.complete ? `
            <div class="story-dilemma-section">
              <div class="story-dilemma-title">
                <span>⚡ LỰA CHỌN QUYẾT ĐỊNH HƯỚNG ĐI</span>
              </div>
              <div class="story-dilemma-prompt">
                "${currentEpisode.dilemmaPrompt}"
              </div>

              <div class="story-choice">
                ${optionsHtml}
              </div>

              ${chosenOption ? `
                <div class="story-reaction-narrative">
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
