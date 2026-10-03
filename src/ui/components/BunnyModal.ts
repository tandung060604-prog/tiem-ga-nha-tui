import { GameState } from '../../types/game';
import { BUNNY_LETTERS, BunnyLetter } from '../../content/mysteryBunny';
import { audio } from '../../core/audio';
import { ASSETS } from '../../content/assets';

export function renderBunnyLetterModal(
  letter: BunnyLetter,
  isClaimed: boolean = false
): string {
  const charactersHtml = letter.relatedCharacters
    .map(c => `<span style="background: rgba(230, 81, 0, 0.12); color: #d84315; padding: 2px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: 700;">${c}</span>`)
    .join(' ');

  return `
    <div class="bunny-dialog-modal" style="text-align: center; max-height: 82vh; overflow-y: auto; padding: 4px 6px;">
      <!-- Glowing Badge -->
      <div style="display: inline-flex; align-items: center; gap: 6px; background: #fff3e0; border: 1.5px solid #ffb74d; padding: 4px 14px; border-radius: 20px; color: #e65100; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2); margin-bottom: 10px;">
        <span>✨</span>
        <span>SỨ GIẢ HẺM 1102 · KHÁCH TRI KỶ</span>
        <span>✨</span>
      </div>

      <!-- Character Portrait Frame -->
      <div style="position: relative; width: 110px; height: 110px; margin: 0 auto 10px; border-radius: 50%; padding: 4px; background: linear-gradient(135deg, #ff9800, #ff5722, #f57c00); box-shadow: 0 6px 16px rgba(230, 81, 0, 0.35);">
        <img 
          src="${ASSETS.thocam.vui}" 
          alt="Bé Gà Bông" 
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background: #fff; border: 3px solid #fff;"
        />
        <div style="position: absolute; bottom: 0; right: 0; background: #fff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
          💌
        </div>
      </div>

      <h2 style="margin: 0 0 2px; font-size: 1.35rem; color: #bf360c; font-weight: 800; font-family: var(--font-display);">
        Bé Gà Bông (Chicky)
      </h2>
      <div style="font-size: 0.78rem; color: var(--soft); margin-bottom: 12px;">
        Vị khách tri kỷ thầm lặng & Sứ giả gắn kết tình người Hẻm 1102
      </div>

      <!-- Dialogue Action Narration -->
      <div style="font-size: 0.8rem; font-style: italic; color: #6d4c41; background: #fff8e1; border-left: 3px solid #ffa000; padding: 8px 12px; border-radius: 8px; margin-bottom: 14px; text-align: left; line-height: 1.45;">
        🍗 <i>Bé Gà Bông khẽ nghiêng chiếc đầu mỏ tròn xoe, vỗ vỗ đôi cánh vụng về khi ngửi thấy mùi gà rán giòn rụm từ chiếc chảo gang. Bé rút từ túi chiếc khăn len màu cam một mảnh giấy nhớ viết tay nắn nót trao cho bạn...</i>
      </div>

      <!-- Orange Handwritten Memo Card -->
      <div class="orange-memo-card" style="background: #fffdf7; border: 2px dashed #ff9800; border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; text-align: left; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.12); position: relative;">
        <!-- Pinned Icon -->
        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 1.2rem;">
          📌
        </div>

        <div style="font-size: 0.75rem; text-transform: uppercase; color: #e65100; font-weight: 800; margin-bottom: 4px; border-bottom: 1px dashed #ffe0b2; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
          <span>${letter.title}</span>
          <span style="font-size: 0.7rem; color: var(--soft);">📜 Thư kết nối Hồi ${letter.trigger.chapter}</span>
        </div>

        <div style="margin: 6px 0; display: flex; gap: 4px; flex-wrap: wrap; align-items: center;">
          <span style="font-size: 0.72rem; color: #8d6e63; font-weight: 700;">Nhân vật liên quan:</span>
          ${charactersHtml}
        </div>

        <div style="font-size: 0.86rem; color: #3e2723; line-height: 1.6; white-space: pre-line; font-family: var(--font-body); font-style: italic; background: rgba(255, 243, 224, 0.5); padding: 10px 12px; border-radius: 8px; margin: 8px 0;">
          ${letter.noteContent.trim()}
        </div>

        <div style="margin-top: 8px; font-size: 0.8rem; color: #4e342e; border-top: 1px dashed #ffe0b2; padding-top: 8px;">
          <div style="font-weight: 700; color: #d84315;">📖 Tác động cốt truyện:</div>
          <div style="font-size: 0.78rem; color: #5d4037; margin-top: 2px;">${letter.storyImpact}</div>
        </div>

        <!-- Reward Preview -->
        <div style="margin-top: 10px; background: #e8f5e9; border: 1.5px solid #a5d6a7; border-radius: 8px; padding: 8px 10px; font-size: 0.82rem; color: #2e7d32; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1.2rem;">🎁</span>
          <div>
            <b>Món quà từ Bé Gà Bông:</b> ${letter.rewardText}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="btn-claim-bunny-letter" class="btn-big-open" style="background: linear-gradient(135deg, #ff9800, #f57c00); box-shadow: 0 4px 0 #e65100; font-size: 0.95rem; padding: 10px 16px;">
          ${isClaimed ? '💖 ĐÃ TIẾP NHẬN BỨC THƯ & LỜI CHÚC' : '💖 NHẬN MẢNH GIẤY & GỬI LỜI CẢM ƠN'}
        </button>
        <button id="btn-open-bunny-album" class="btn-sm" style="background: #fff; border: 1.5px solid #ffb74d; color: #e65100; font-size: 0.82rem; padding: 6px 12px;">
          📚 Mở Sổ Ký Ức Mảnh Giấy Bé Gà Bông
        </button>
      </div>
    </div>
  `;
}

// Giao diện Sổ Ký Ức Mảnh Giấy Bé Gà Bông (Memory Album)
export function renderBunnyAlbumModal(
  state: GameState,
  selectedLetterIdx: number = 0
): string {
  const unlockedIds = state.unlockedBunnyLetters || [];

  const letterTabsHtml = BUNNY_LETTERS.map((letter, idx) => {
    const isUnlocked = unlockedIds.includes(letter.id);
    const isSelected = idx === selectedLetterIdx;

    return `
      <button class="bunny-album-tab ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" data-letter-idx="${idx}" style="min-width: 140px; padding: 8px; border-radius: 8px; border: 1.5px solid ${isSelected ? '#e65100' : 'var(--line)'}; background: ${isSelected ? '#fff3e0' : 'var(--panel)'}; cursor: pointer; text-align: left; transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <b style="font-size: 0.78rem; color: ${isUnlocked ? 'var(--ink)' : 'var(--soft)'};">Mảnh Giấy #${idx + 1}</b>
          <span style="font-size: 0.72rem;">${isUnlocked ? '💌' : '🔒'}</span>
        </div>
        <div style="font-size: 0.7rem; color: var(--soft); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${isUnlocked ? letter.title.split(':')[1] || letter.title : `Chương ${letter.trigger.chapter}`}
        </div>
      </button>
    `;
  }).join('');

  const currentLetter = BUNNY_LETTERS[selectedLetterIdx] || BUNNY_LETTERS[0];
  const isCurrentUnlocked = unlockedIds.includes(currentLetter.id);

  return `
    <div style="text-align: left; max-height: 82vh; display: flex; flex-direction: column; gap: 10px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ffe0b2; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${ASSETS.thocam.vui}" alt="Chicky" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #ff9800; object-fit: cover;" />
          <div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #bf360c;">📜 Sổ Ký Ức Gà Bông</h2>
            <small style="color: var(--soft); font-size: 0.75rem;">Đã mở: <b>${unlockedIds.length}/${BUNNY_LETTERS.length}</b> mảnh giấy nhớ · Ghé thăm: <b>${state.bunnyVisitsCount || 0}</b> lần</small>
          </div>
        </div>
        <button id="btn-close-bunny-modal" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: var(--soft);">✕</button>
      </div>

      <!-- Horizontal Letter Tabs -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
        ${letterTabsHtml}
      </div>

      <!-- Letter Content Body -->
      <div style="background: #faf4ea; border: 2px solid #ffe0b2; border-radius: var(--radius-md); padding: 14px; overflow-y: auto; max-height: 52vh; font-size: 0.88rem;">
        ${isCurrentUnlocked ? `
          <div style="border-bottom: 1.5px dashed #ffb74d; padding-bottom: 8px; margin-bottom: 10px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #e65100; font-weight: 800;">
              ✨ ${currentLetter.title}
            </div>
            <div style="font-size: 0.75rem; color: var(--soft); margin-top: 2px;">
              👥 <b>Nhân vật:</b> ${currentLetter.relatedCharacters.join(' · ')} | <b>Món yêu thích:</b> ${currentLetter.preferredFood}
            </div>
          </div>

          <div style="white-space: pre-line; line-height: 1.6; font-style: italic; color: #3e2723; background: #fffdf7; border: 1px dashed #ffcc80; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
            ${currentLetter.noteContent.trim()}
          </div>

          <div style="font-size: 0.8rem; background: #fff3e0; border-radius: 8px; padding: 8px 10px; color: #bf360c;">
            <b>📖 Diễn biến nối tiếp:</b> ${currentLetter.storyImpact}
          </div>
        ` : `
          <div style="text-align: center; padding: 36px 10px; color: var(--soft);">
            <div style="font-size: 3rem; margin-bottom: 8px;">🔒</div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--ink);">Mảnh Giấy Nhớ Chưa Được Khám Phá</div>
            <p style="font-size: 0.82rem; margin-top: 6px; line-height: 1.4;">
              Bé Gà Bông sẽ ghé thăm và gửi tặng mảnh giấy này khi tiệm gom được <b>${Math.round(currentLetter.trigger.atProgress * 100)}% tiền cọc Chương ${currentLetter.trigger.chapter}</b>, lúc bạn phục vụ món <b>${currentLetter.preferredFood}</b> thơm ngon!
            </p>
          </div>
        `}
      </div>

      <!-- Footer Button to Read Full Story Novel -->
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="btn-read-full-novel" class="btn-sm primary" style="padding: 6px 14px; font-size: 0.82rem;">
          📖 Đọc Tiểu Thuyết Hẻm 1102 (5 Hồi)
        </button>
      </div>
    </div>
  `;
}

export function bindBunnyModalEvents(
  onClaim: () => void,
  onOpenAlbum: () => void,
  onClose: () => void
) {
  const claimBtn = document.getElementById('btn-claim-bunny-letter');
  if (claimBtn) {
    claimBtn.onclick = () => {
      audio.playPerfect();
      onClaim();
    };
  }

  const albumBtn = document.getElementById('btn-open-bunny-album');
  if (albumBtn) {
    albumBtn.onclick = () => {
      audio.playPop();
      onOpenAlbum();
    };
  }

  const closeBtn = document.getElementById('btn-close-bunny-modal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      audio.playPop();
      onClose();
    };
  }
}
