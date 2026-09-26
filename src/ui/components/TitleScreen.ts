import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { CHAPTERS } from '../../content/chapters';
import { escapeHtml } from '../escapeHtml';
import { audio } from '../../core/audio';

const OWNER_QUOTES = [
  'Dạ Tiệm Gà Nhà Tui xin chào bạn! Hôm nay gà vàng giòn đang chờ nè! 🍗✨',
  'Khởi nghiệp từ chiếc xe đẩy nhỏ xíu ở hẻm 1102, cùng nhau cố lên nha! 💛',
  'Gà giòn thơm nức mũi, sốt đậm đà, khách ăn một lần là nhớ mãi! 🌟'
];

const BACBA_QUOTES = [
  'Con ơi, cứ bình tĩnh mà làm! Bác đứng đây canh hẻm và chỉ dẫn cho con. 👴',
  'Khởi nghiệp cực lắm con, nhưng chăm chỉ và thật thà thì lộc sẽ tự đến! 🍵',
  'Mùi gà rán của con thơm nức cả con hẻm rồi đấy, khách đang ngóng kìa! 🍗'
];

const CAT_QUOTES = [
  'Meo~ Mùi gà rán thơm phức làm mèo thức giấc nè! Cho xin một miếng nha! 🐱✨',
  'Meo meo... Mèo nằm canh tiền vía cho tiệm hôm nay buôn may bán đắt nha! 🐾'
];

export function renderTitleScreen(state: GameState, hasProgress: boolean, musicOn: boolean): string {
  const chapter = CHAPTERS.find(c => c.number === state.currentChapter);
  return `
    <div id="title-screen" class="title-screen" style="--landing-bg: url('${new URL(ASSETS.ui.landingVnBg, document.baseURI).href}');">
      <!-- Ambient Dark & Warm Vignette -->
      <div class="title-overlay"></div>

      <!-- Scalloped Awning on top edge -->
      <div class="title-awning"></div>

      <!-- Top Title Area: Clean, Crisp Branding -->
      <header class="title-header-badge">
        <span class="title-kicker-tag">🏮 HẺM 1102 SÀI GÒN · KHỞI NGHIỆP INDIE 🏮</span>
      </header>

      <!-- Invisible Character Tap Zones on the Artwork (No ugly floating pills) -->
      <div class="title-touch-zones">
        <!-- Tap Zone: Shop Owner (Center) -->
        <button id="zone-owner" class="touch-zone zone-owner" aria-label="Chủ tiệm" title="Trò chuyện với chủ tiệm"></button>

        <!-- Tap Zone: Bac Ba (Right) -->
        <button id="zone-bacba" class="touch-zone zone-bacba" aria-label="Bác Ba" title="Trò chuyện với Bác Ba"></button>

        <!-- Tap Zone: Cat on stool (Left) -->
        <button id="zone-cat" class="touch-zone zone-cat" aria-label="Bé Miu" title="Vuốt ve bé mèo"></button>

        <!-- Dynamic Speech Bubble -->
        <div id="title-speech-bubble" class="title-speech-bubble" hidden></div>
      </div>

      <!-- Bottom Interactive Bistro Board (Gọn gàng, sang trọng, mang phong cách quán gà VN) -->
      <div class="title-bottom-panel">
        <div class="title-bistro-board">
          <div class="board-header">
            <img src="${ASSETS.ui.logoKoreanChicken}" class="board-logo" alt="Logo Tiệm Gà" />
            <div class="board-info">
              <h2 class="board-shop-name">${escapeHtml(state.shopName)}</h2>
              <div class="board-meta">
                ${hasProgress 
                  ? `<span class="board-tag day">Ngày ${state.day}</span>
                     <span class="board-tag chapter">Chương ${chapter ? chapter.number : 1}</span>
                     <span class="board-tag money">Vốn: ${state.money.toLocaleString('vi-VN')}đ</span>` 
                  : `<span class="board-tag new">✨ Tiệm Mới Khởi Đầu</span>
                     <span class="board-tag capital">Vốn: ${state.money.toLocaleString('vi-VN')}đ</span>`}
              </div>
            </div>
          </div>

          <!-- Character Ensemble Cast Preview -->
          <div class="board-cast-strip">
            <div class="cast-item">
              <span class="cast-avatar">🧑‍🍳</span>
              <span class="cast-name">Chủ Tiệm</span>
            </div>
            <div class="cast-divider">•</div>
            <div class="cast-item">
              <span class="cast-avatar">👴</span>
              <span class="cast-name">Bác Ba Cố Vấn</span>
            </div>
            <div class="cast-divider">•</div>
            <div class="cast-item">
              <span class="cast-avatar">🐱</span>
              <span class="cast-name">Bé Miu Canh Tiệm</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="board-actions">
            <button id="btn-title-play" class="btn-play-hero">
              ${hasProgress ? '▶ TIẾP TỤC MỞ BÁN' : '🍗 BẮT ĐẦU MỞ TIỆM'}
            </button>
            <div class="board-sub-row">
              ${hasProgress ? '<button id="btn-title-new" class="btn-sub-pill">🔄 Chơi lại từ đầu</button>' : ''}
              <button id="btn-title-music" class="btn-sub-pill">${musicOn ? '🎵 Nhạc: Bật' : '🔇 Nhạc: Tắt'}</button>
            </div>
          </div>
        </div>

        <p class="title-touch-hint">
          💡 Chạm vào <b>Chủ Tiệm</b>, <b>Bác Ba</b> hoặc <b>Bé Miu</b> trên tranh để nghe tâm sự nha!
        </p>
      </div>
    </div>
  `;
}

export function bindTitleScreenInteractions() {
  const bubble = document.getElementById('title-speech-bubble');
  let bubbleTimeout: any = null;

  const showBubble = (text: string, leftPercent: number, topPercent: number) => {
    if (!bubble) return;
    clearTimeout(bubbleTimeout);
    bubble.textContent = text;
    bubble.style.left = `${leftPercent}%`;
    bubble.style.top = `${topPercent}%`;
    bubble.hidden = false;
    bubble.classList.remove('pop-anim');
    void bubble.offsetWidth;
    bubble.classList.add('pop-anim');
    bubbleTimeout = setTimeout(() => {
      bubble.hidden = true;
    }, 4200);
  };

  const bindZone = (id: string, quotes: string[], left: number, top: number, onSound: () => void) => {
    const el = document.getElementById(id);
    if (!el) return;
    let idx = 0;
    el.onclick = (e) => {
      e.stopPropagation();
      onSound();
      const quote = quotes[idx % quotes.length] ?? '';
      idx++;
      showBubble(quote, left, top);
    };
  };

  bindZone('zone-owner', OWNER_QUOTES, 50, 42, () => audio.playPop());
  bindZone('zone-bacba', BACBA_QUOTES, 70, 40, () => audio.playPop());
  bindZone('zone-cat', CAT_QUOTES, 25, 68, () => audio.playPerfect());
}
