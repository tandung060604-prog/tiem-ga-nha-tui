import { GameState, CharacterEpisode, CharacterStoryChoice } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { playDialogueSequence, TypewriterPlayer } from '../typewriter';

/**
 * Modal Ký Sự Hẻm 1102 (Character Narrative Episode Modal)
 * Nâng cấp trải nghiệm Visual Novel Mini:
 * - Hiệu ứng Typewriter gõ từng chữ từ từ kèm âm thanh 'tít tít' (ZzFX retro blip)
 * - Nút '⏩ Hiện Hết' để xem nhanh nếu người chơi muốn đọc lẹ
 * - Chân dung cảm xúc (Mood badge: 😊 Vui Vẻ, 🥺 Xúc Động, ⚡ Căng Thẳng, 💖 Nghẹn Ngào)
 * - Tách biệt rõ nét bong bóng thoại người chơi vs nhân vật
 * - Kicker lựa chọn phân nhánh rõ ràng
 */
export function renderCharacterEpisodeModal(
  _state: GameState,
  episode: CharacterEpisode
): string {
  const dialogueHtml = episode.dialogueLines.map((line, idx) => {
    const isPlayer = line.speaker.includes('Bạn') || line.speaker.includes('Chủ');
    const bubbleBg = isPlayer ? '#eff6ff' : '#fffdf5';
    const borderCol = isPlayer ? '#3b82f6' : '#d97706';
    const alignSelf = isPlayer ? 'flex-end' : 'flex-start';

    // Mood badge
    let moodBadge = '';
    if (line.mood === 'happy') moodBadge = '<span style="font-size: 0.65rem; background: #fef08a; color: #854d0e; padding: 1px 5px; border-radius: 4px; font-weight: 800;">😊 Vui Vẻ</span>';
    else if (line.mood === 'sad') moodBadge = '<span style="font-size: 0.65rem; background: #e0e7ff; color: #3730a3; padding: 1px 5px; border-radius: 4px; font-weight: 800;">🥺 Buồn Bã</span>';
    else if (line.mood === 'tense') moodBadge = '<span style="font-size: 0.65rem; background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 4px; font-weight: 800;">⚡ Căng Thẳng</span>';
    else if (line.mood === 'touched') moodBadge = '<span style="font-size: 0.65rem; background: #fce7f3; color: #9d174d; padding: 1px 5px; border-radius: 4px; font-weight: 800;">💖 Nghẹn Ngào</span>';

    // Dòng đầu tiên hiện sẵn, các dòng sau xuất hiện dần theo nhịp typewriter
    const initialDisplay = idx === 0 ? 'flex' : 'none';

    return `
      <div class="vn-dialogue-row" data-line-index="${idx}" style="display: ${initialDisplay}; flex-direction: column; align-self: ${alignSelf}; max-width: 92%; margin-bottom: 10px; animation: popIn 0.2s ease-out;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px; ${isPlayer ? 'justify-content: flex-end;' : ''}">
          <span style="font-size: 0.72rem; font-weight: 900; color: ${isPlayer ? '#1d4ed8' : '#b45309'};">
            ${escapeHtml(line.speaker)}
          </span>
          ${moodBadge}
        </div>
        <div class="vn-bubble-box" style="background: ${bubbleBg}; border: 1.5px solid ${borderCol}; border-radius: ${isPlayer ? '12px 12px 2px 12px' : '12px 12px 12px 2px'}; padding: 9px 12px; font-size: 0.82rem; line-height: 1.45; color: #1f2937; box-shadow: 0 2px 6px rgba(0,0,0,0.06); position: relative;">
          "<span class="vn-bubble-text" data-full-text="${escapeHtml(line.text)}">${escapeHtml(line.text)}</span>"
        </div>
      </div>
    `;
  }).join('');

  const choicesHtml = episode.choices.map((choice) => {
    const rewardMoneyHtml = choice.rewardMoney ? `<span style="background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700;">💰 +${choice.rewardMoney.toLocaleString('vi-VN')}đ</span>` : '';

    return `
      <button class="btn-char-story-choice retro-clickable" data-episode-id="${episode.id}" data-choice-id="${choice.id}" style="width: 100%; text-align: left; background: #fff; border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #d97706; background: #fef3c7; padding: 2px 6px; border-radius: 4px; border: 1px solid #fde68a;">
            ${escapeHtml(choice.kicker)}
          </span>
          ${rewardMoneyHtml ? `
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              ${rewardMoneyHtml}
            </div>
          ` : ''}
        </div>
        <div style="font-size: 0.84rem; font-weight: 800; color: #111827; margin-top: 3px; line-height: 1.35;">
          ${escapeHtml(choice.label)}
        </div>
        ${choice.causalityNotice ? `
          <div style="font-size: 0.7rem; color: #059669; font-style: italic; margin-top: 2px; display: flex; align-items: center; gap: 4px;">
            <span>⏳</span> <span>${escapeHtml(choice.causalityNotice)}</span>
          </div>
        ` : ''}
      </button>
    `;
  }).join('');

  return `
    <div id="modal-character-story" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 92vh; display: flex; flex-direction: column; background: #fffcf7; border: 3px solid #854d0e; border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.4); overflow: hidden;">
        
        <!-- Header: Chân dung nhân vật & Tên tập -->
        <div style="background: linear-gradient(135deg, #a16207, #713f12); color: #fff; padding: 12px 14px; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #582f0c;">
          <img src="${episode.avatar}" alt="${escapeHtml(episode.characterName)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2.5px solid #fef08a; background: #fef9c3; flex-shrink: 0;" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.7rem; font-weight: 800; color: #fef08a; text-transform: uppercase; letter-spacing: 0.5px;">
              📖 Ký Sự Hẻm 1102 • ${escapeHtml(episode.characterRole)}
            </div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #fff; text-shadow: 1px 1px #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(episode.title)}
            </div>
            <div style="font-size: 0.68rem; color: #fef9c3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(episode.subtitle)}
            </div>
          </div>
          <!-- Nút Skip Typewriter -->
          <button id="btn-skip-char-typewriter" class="btn-sm" style="background: rgba(254, 240, 138, 0.2); color: #fef08a; border: 1px solid #fef08a; font-size: 0.68rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; cursor: pointer; flex-shrink: 0;" title="Hiện nhanh toàn bộ đoạn hội thoại">
            ⏩ Hiện Hết
          </button>
        </div>

        <!-- Body Scrollable -->
        <div id="vn-dialogue-scroll-panel" style="padding: 12px 14px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px; cursor: pointer;">
          
          <!-- Bối cảnh dẫn nhập -->
          <div style="background: #fefce8; border-left: 3.5px solid #eab308; padding: 8px 10px; border-radius: 4px; font-size: 0.78rem; line-height: 1.4; color: #713f12; font-style: italic;">
            ${escapeHtml(episode.narrativeIntro)}
          </div>

          <!-- Đoạn hội thoại Visual Novel (Gõ chữ từng chữ một) -->
          <div id="vn-dialogue-list" style="display: flex; flex-direction: column; margin-top: 4px;">
            ${dialogueHtml}
          </div>

          <!-- Hộp câu hỏi nan giải -->
          <div id="vn-dilemma-container" style="background: #fafaf9; border: 1.5px dashed #a8a29e; border-radius: 8px; padding: 8px 10px; text-align: center; opacity: 0.35; transition: opacity 0.4s ease;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #78350f; text-transform: uppercase; margin-bottom: 2px;">
              🤔 LỰA CHỌN CỦA CHỦ TIỆM GÀ
            </div>
            <div style="font-size: 0.82rem; font-weight: 800; color: #1c1917; line-height: 1.35;">
              ${escapeHtml(episode.dilemmaPrompt)}
            </div>
          </div>

          <!-- Danh sách lựa chọn phân nhánh -->
          <div id="vn-choices-container" style="display: flex; flex-direction: column; margin-top: 2px; opacity: 0.35; pointer-events: none; transition: opacity 0.4s ease;">
            ${choicesHtml}
          </div>

        </div>

        <!-- Footer đóng/bỏ qua -->
        <div style="padding: 8px 14px; background: #f5f5f4; border-top: 1px solid #e7e5e4; display: flex; justify-content: flex-end;">
          <button id="btn-close-char-story" class="btn-sm" style="background: #e7e5e4; color: #44403c; border: 1px solid #d6d3d1; padding: 6px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 6px; cursor: pointer;">
            Để Lát Nữa Tâm Sự
          </button>
        </div>

      </div>
    </div>
  `;
}

/**
 * Khởi động hiệu ứng Typewriter cho Modal Ký Sự Hẻm 1102
 */
export function bindCharacterEpisodeTypewriter(
  modalEl: HTMLElement,
  onFinished?: () => void
): { skipAll: () => void } {
  const scrollPanel = modalEl.querySelector<HTMLElement>('#vn-dialogue-scroll-panel');
  const textElements = Array.from(modalEl.querySelectorAll<HTMLElement>('.vn-bubble-text'));
  const dilemmaBox = modalEl.querySelector<HTMLElement>('#vn-dilemma-container');
  const choicesBox = modalEl.querySelector<HTMLElement>('#vn-choices-container');
  const skipBtn = modalEl.querySelector<HTMLElement>('#btn-skip-char-typewriter');

  const lines = textElements.map(el => ({
    textEl: el,
    fullText: el.getAttribute('data-full-text') || el.textContent || ''
  }));

  // Xóa nội dung ban đầu để chuẩn bị gõ từ từ
  lines.forEach(l => {
    l.textEl.textContent = '';
  });

  const activateChoices = () => {
    if (dilemmaBox) dilemmaBox.style.opacity = '1';
    if (choicesBox) {
      choicesBox.style.opacity = '1';
      choicesBox.style.pointerEvents = 'auto';
    }
    if (scrollPanel) {
      scrollPanel.scrollTop = scrollPanel.scrollHeight;
    }
    if (onFinished) onFinished();
  };

  let skipController: (() => void) | null = null;

  void playDialogueSequence(lines, {
    containerEl: scrollPanel || undefined,
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
        const row = l.textEl.closest<HTMLElement>('.vn-dialogue-row');
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

/**
 * Modal hiển thị kết quả phản hồi của nhân vật sau khi người chơi đưa ra lựa chọn
 */
export function renderCharacterEpisodeReactionModal(
  episode: CharacterEpisode,
  choice: CharacterStoryChoice
): string {
  return `
    <div id="modal-char-reaction" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1065; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 400px; background: #fffdf5; border: 3px solid #16a34a; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); overflow: hidden; display: flex; flex-direction: column;">
        
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; padding: 12px 14px; text-align: center; border-bottom: 2px solid #14532d;">
          <div style="font-size: 0.72rem; font-weight: 800; color: #bbf7d0; text-transform: uppercase;">
            ✨ KÝ SỰ HẺM 1102 • HOÀN THÀNH TẬP ${episode.episodeIndex}
          </div>
          <div style="font-size: 1.05rem; font-weight: 900; color: #fef08a;">
            ${escapeHtml(episode.characterName)}
          </div>
        </div>

        <div style="padding: 16px 14px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center;">
          <img src="${episode.avatar}" alt="${escapeHtml(episode.characterName)}" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2.5px solid #16a34a; background: #dcfce7;" />
          
          <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 12px; font-size: 0.84rem; line-height: 1.45; color: #14532d; font-style: italic; width: 100%; min-height: 48px;">
            "<span id="vn-reaction-text" data-full-text="${escapeHtml(choice.reactionDialogue)}">${escapeHtml(choice.reactionDialogue)}</span>"
          </div>

          ${choice.causalityNotice ? `
            <div style="background: #ecfdf5; border-radius: 6px; padding: 8px 12px; font-size: 0.74rem; color: #047857; font-weight: 800; border: 1px dashed #10b981;">
              ⏳ HỆ QUẢ LIÊN NGÀY: ${escapeHtml(choice.causalityNotice)}
            </div>
          ` : ''}

          <div style="font-size: 0.72rem; color: #6b7280;">
            Đã lưu lại trong <b>Sổ Tay Kỷ Niệm Hẻm 1102</b>
          </div>

          <button id="btn-dismiss-char-reaction" class="btn-primary" style="width: 100%; padding: 10px; font-size: 0.85rem; font-weight: 800; border-radius: 8px; background: #16a34a; color: #fff; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);">
            Ghi Nhớ Trong Tim ❤️
          </button>
        </div>

      </div>
    </div>
  `;
}

/**
 * Kích hoạt hiệu ứng Typewriter cho modal phản hồi của nhân vật
 */
export function bindReactionEpisodeTypewriter(modalEl: HTMLElement): void {
  const textEl = modalEl.querySelector<HTMLElement>('#vn-reaction-text');
  if (!textEl) return;
  const fullText = textEl.getAttribute('data-full-text') || textEl.textContent || '';
  const player = new TypewriterPlayer(textEl, fullText, { speedMs: 22, soundInterval: 2 });
  void player.start();

  modalEl.onclick = () => {
    player.skip();
  };
}
