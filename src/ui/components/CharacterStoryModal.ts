import { GameState, CharacterEpisode, CharacterStoryChoice } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { playDialogueSequence, TypewriterPlayer } from '../typewriter';
import { audio } from '../../core/audio';

/**
 * Modal Ký Sự Hẻm 1102 (Character Narrative Episode Modal)
 * Nâng cấp trải nghiệm Visual Novel Mini:
 * - Hiệu ứng Typewriter gõ từng chữ từ từ thư thả có nhịp thở dấu câu
 * - Nút '⏩ Hiện Hết' để xem nhanh toàn bộ
 * - Chân dung cảm xúc (Mood badge: 😊 Vui Vẻ, 🥺 Xúc Động, ⚡ Căng Thẳng, 💖 Nghẹn Ngào)
 * - Tách biệt rõ nét bong bóng thoại người chơi vs nhân vật chuẩn Visual Novel
 * - Bảng câu hỏi & Lựa chọn chỉ bung ra khi câu chuyện kết thúc
 */
export function renderCharacterEpisodeModal(
  _state: GameState,
  episode: CharacterEpisode
): string {
  const dialogueHtml = episode.dialogueLines.map((line, idx) => {
    const isPlayer = line.speaker.includes('Bạn') || line.speaker.includes('Chủ');
    const bubbleBg = isPlayer ? 'rgba(15, 23, 42, 0.95)' : 'rgba(35, 18, 9, 0.95)';
    const borderCol = isPlayer ? '#38bdf8' : '#f59e0b';
    const textColor = isPlayer ? '#f0f9ff' : '#fffdf0';
    const alignSelf = isPlayer ? 'flex-end' : 'flex-start';

    // Mood badge
    let moodBadge = '';
    if (line.mood === 'happy') moodBadge = '<span style="font-size: 0.68rem; background: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-weight: 800;">😊 Vui Vẻ</span>';
    else if (line.mood === 'sad') moodBadge = '<span style="font-size: 0.68rem; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: 800;">🥺 Buồn Bã</span>';
    else if (line.mood === 'tense') moodBadge = '<span style="font-size: 0.68rem; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: 800;">⚡ Căng Thẳng</span>';
    else if (line.mood === 'touched') moodBadge = '<span style="font-size: 0.68rem; background: #fce7f3; color: #9d174d; padding: 2px 6px; border-radius: 4px; font-weight: 800;">💖 Nghẹn Ngào</span>';

    // Dòng đầu tiên hiện sẵn, các dòng sau xuất hiện dần theo nhịp typewriter
    const initialDisplay = idx === 0 ? 'flex' : 'none';

    return `
      <div class="vn-dialogue-row" data-line-index="${idx}" style="display: ${initialDisplay}; flex-direction: column; align-self: ${alignSelf}; max-width: 92%; margin-bottom: 12px; animation: popIn 0.25s ease-out;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; ${isPlayer ? 'justify-content: flex-end;' : ''}">
          <span style="font-size: 0.76rem; font-weight: 900; color: ${isPlayer ? '#38bdf8' : '#fde047'}; text-shadow: 1px 1px 1px #000;">
            ${escapeHtml(line.speaker)}
          </span>
          ${moodBadge}
        </div>
        <div class="vn-bubble-box" style="background: ${bubbleBg}; border: 1.5px solid ${borderCol}; border-radius: ${isPlayer ? '14px 14px 2px 14px' : '14px 14px 14px 2px'}; padding: 11px 14px; font-size: 0.88rem; line-height: 1.55; color: ${textColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-shadow: 1px 1px 1px rgba(0,0,0,0.6);">
          "<span class="vn-bubble-text" data-full-text="${escapeHtml(line.text)}">${escapeHtml(line.text)}</span>"
        </div>
      </div>
    `;
  }).join('');

  const choicesHtml = episode.choices.map((choice) => {
    const rewardMoneyHtml = choice.rewardMoney ? `<span style="background: #dcfce7; color: #15803d; padding: 2px 7px; border-radius: 4px; font-size: 0.68rem; font-weight: 800; border: 1px solid #86efac;">💰 +${choice.rewardMoney.toLocaleString('vi-VN')}đ</span>` : '';

    return `
      <button class="btn-char-story-choice retro-clickable vn-choice-card" data-episode-id="${episode.id}" data-choice-id="${choice.id}" style="width: 100%; text-align: left; background: linear-gradient(135deg, rgba(69, 26, 3, 0.95), rgba(43, 16, 2, 0.98)); border: 2px solid #b8860b; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #854d0e; background: #fef3c7; padding: 2px 7px; border-radius: 4px; border: 1px solid #fde047;">
            ${escapeHtml(choice.kicker)}
          </span>
          ${rewardMoneyHtml ? `
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              ${rewardMoneyHtml}
            </div>
          ` : ''}
        </div>
        <div style="font-size: 0.92rem; font-weight: 900; color: #fffbeb; margin-top: 3px; line-height: 1.4; text-shadow: 1px 1px 1px #000;">
          ${escapeHtml(choice.label)}
        </div>
        ${choice.causalityNotice ? `
          <div style="font-size: 0.74rem; color: #86efac; font-style: italic; margin-top: 2px; display: flex; align-items: center; gap: 4px;">
            <span>⏳</span> <span>${escapeHtml(choice.causalityNotice)}</span>
          </div>
        ` : ''}
      </button>
    `;
  }).join('');

  return `
    <div id="modal-character-story" class="modal-backdrop vn-dialogue-theatre" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 92vh; display: flex; flex-direction: column; background: radial-gradient(circle at 50% 10%, #2e170c 0%, #150904 100%); border: 3px solid #b8860b; border-radius: 16px; box-shadow: 0 16px 45px rgba(0,0,0,0.85), inset 0 0 0 2px rgba(254, 240, 138, 0.25); overflow: hidden;">
        
        <!-- Header: Chân dung nhân vật & Tên tập -->
        <div style="background: linear-gradient(135deg, rgba(88, 38, 10, 0.95), rgba(45, 18, 5, 0.95)); color: #fff; padding: 12px 14px; display: flex; align-items: center; gap: 12px; border-bottom: 2px dashed rgba(245, 158, 11, 0.5);">
          <img src="${episode.avatar}" alt="${escapeHtml(episode.characterName)}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2.5px solid #fde047; background: #fef9c3; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #fde047; text-transform: uppercase; letter-spacing: 0.5px;">
              📖 Ký Sự Hẻm 1102 • ${escapeHtml(episode.characterRole)}
            </div>
            <div style="font-size: 1.05rem; font-weight: 900; color: #fffbeb; text-shadow: 1px 1px 2px #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(episode.title)}
            </div>
            <div style="font-size: 0.72rem; color: #fef08a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.9;">
              ${escapeHtml(episode.subtitle)}
            </div>
          </div>
          <!-- Nút Skip Typewriter -->
          <button id="btn-skip-char-typewriter" class="btn-sm pixel-btn" style="background: rgba(245, 158, 11, 0.25); color: #fde047; border: 1.5px solid #f59e0b; font-size: 0.72rem; font-weight: 800; padding: 5px 10px; border-radius: 8px; cursor: pointer; flex-shrink: 0;" title="Hiện nhanh toàn bộ đoạn hội thoại">
            ⏩ Hiện Hết
          </button>
        </div>

        <!-- Body Scrollable -->
        <div id="vn-dialogue-scroll-panel" style="padding: 14px 14px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px; cursor: pointer;">
          
          <!-- Bối cảnh dẫn nhập -->
          <div style="background: rgba(184, 134, 11, 0.15); border-left: 3.5px solid #f59e0b; padding: 8px 12px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.45; color: #fef08a; font-style: italic;">
            ${escapeHtml(episode.narrativeIntro)}
          </div>

          <!-- Đoạn hội thoại Visual Novel (Gõ chữ từng chữ một) -->
          <div id="vn-dialogue-list" style="display: flex; flex-direction: column; margin-top: 4px;">
            ${dialogueHtml}
          </div>

          <!-- Hộp câu hỏi nan giải: BAN ĐẦU ẨN, CHỈ HIỆN KHI HẾT THOẠI -->
          <div id="vn-dilemma-container" style="background: rgba(30, 14, 5, 0.9); border: 1.5px dashed #f59e0b; border-radius: 10px; padding: 10px 12px; text-align: center; display: none; opacity: 0; transform: translateY(14px); transition: all 0.35s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <div style="font-size: 0.76rem; font-weight: 900; color: #fde047; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.5px;">
              🤔 LỰA CHỌN CỦA CHỦ TIỆM GÀ
            </div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #fffbeb; line-height: 1.4;">
              ${escapeHtml(episode.dilemmaPrompt)}
            </div>
          </div>

          <!-- Danh sách lựa chọn phân nhánh: BAN ĐẦU ẨN, CHỈ HIỆN KHI HẾT THOẠI -->
          <div id="vn-choices-container" style="display: none; flex-direction: column; margin-top: 2px; opacity: 0; transform: translateY(14px); pointer-events: none; transition: all 0.35s ease;">
            ${choicesHtml}
          </div>

        </div>

        <!-- Footer đóng/bỏ qua -->
        <div style="padding: 10px 14px; background: rgba(20, 10, 4, 0.95); border-top: 1px solid rgba(245, 158, 11, 0.3); display: flex; justify-content: flex-end;">
          <button id="btn-close-char-story" class="btn-sm" style="background: rgba(120, 53, 15, 0.4); color: #fef08a; border: 1px solid #b8860b; padding: 6px 14px; font-size: 0.78rem; font-weight: 800; border-radius: 8px; cursor: pointer;">
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

  let choicesShown = false;
  const activateChoices = () => {
    if (choicesShown) return;
    choicesShown = true;

    if (dilemmaBox) {
      dilemmaBox.style.display = 'block';
      void dilemmaBox.offsetHeight;
      dilemmaBox.style.opacity = '1';
      dilemmaBox.style.transform = 'translateY(0)';
    }

    if (choicesBox) {
      choicesBox.style.display = 'flex';
      void choicesBox.offsetHeight;
      choicesBox.style.opacity = '1';
      choicesBox.style.transform = 'translateY(0)';
      choicesBox.style.pointerEvents = 'auto';
    }

    try { audio.playPop(); } catch {}

    if (scrollPanel) {
      setTimeout(() => {
        scrollPanel.scrollTop = scrollPanel.scrollHeight;
      }, 100);
    }
    if (onFinished) onFinished();
  };

  let skipController: (() => void) | null = null;

  void playDialogueSequence(lines, {
    containerEl: scrollPanel || undefined,
    speedMs: 38, // Nhịp gõ chậm rãi, diễn cảm
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

  // Click vào khung thoại cũng tự động skip nhanh toàn bộ
  if (scrollPanel) {
    scrollPanel.onclick = (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        doSkip();
      }
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
