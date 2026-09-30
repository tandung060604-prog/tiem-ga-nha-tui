import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { escapeHtml } from '../escapeHtml';
import { audio } from '../../core/audio';

const OWNER_QUOTES = [
  'Tiệm Gà Nhà Tui xin chào bạn! Gà vàng giòn rụm đang chờ nè! 🍗✨',
  'Khởi nghiệp từ chiếc xe đẩy nhỏ xíu ở hẻm 1102, cùng nhau cố lên nha! 💛',
  'Gà giòn thơm nức mũi, sốt đậm đà, khách ăn một lần là nhớ mãi! 🌟'
];

const BACBA_QUOTES = [
  'Cứ bình tĩnh mà làm con ơi! Bác Ba đứng đây canh hẻm và chỉ dẫn cho con. 👴',
  'Khởi nghiệp cực lắm con, nhưng chăm chỉ và thật thà thì lộc sẽ tự đến! 🍵',
  'Mùi gà rán thơm phức cả con hẻm rồi đấy, chuẩn bị mở bán thôi! 🍗'
];

const CAT_QUOTES = [
  'Meo~ Mùi gà rán thơm phức làm mèo thức giấc nè! 🐱✨',
  'Meo meo... Mèo nằm canh vía cho tiệm hôm nay buôn may bán đắt nha! 🐾'
];

export function renderTitleScreen(state: GameState, hasProgress: boolean, musicOn: boolean): string {
  return `
    <div id="title-screen" class="title-screen" style="--landing-bg: url('${new URL(ASSETS.ui.landingVnBg, document.baseURI).href}');">
      <!-- Vignette & Warm Atmosphere -->
      <div class="title-overlay"></div>

      <!-- Scalloped Awning on top edge -->
      <div class="title-awning"></div>

      <!-- Grand Opening Game Banner (Stardew Valley Wooden Signboard) -->
      <header class="title-banner-container">
        <div class="title-stardew-banner">
          <img src="${ASSETS.ui.bannerStardewChicken}" class="banner-stardew-img pixel-art" alt="Tiệm Gà Nhà Tui - Banner Stardew Valley" />
        </div>
      </header>

      <!-- Invisible Character Touch Zones on the Artwork -->
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

      <!-- Bottom Action Deck (Mượt mà, tinh gọn chuẩn game di động) -->
      <footer class="title-bottom-panel">
        <div class="title-action-deck">
          ${hasProgress ? `
            <div class="save-status-chip">
              <span class="chip-dot"></span>
              <span class="chip-name">${escapeHtml(state.shopName)}</span>
              <span class="chip-sep">•</span>
              <span class="chip-day">Ngày ${state.day}</span>
              <span class="chip-sep">•</span>
              <span class="chip-money">${state.money.toLocaleString('vi-VN')}đ</span>
            </div>
          ` : ''}

          <!-- Hero Action CTA -->
          <button id="btn-title-play" class="btn-title-hero" aria-label="Bắt đầu mở bán">
            <span class="hero-btn-glow"></span>
            <span class="hero-btn-content">
              <span class="hero-btn-icon">${hasProgress ? '▶' : '🍗'}</span>
              <span class="hero-btn-text">${hasProgress ? 'TIẾP TỤC MỞ BÁN' : 'VÀO TIỆM BÁN GÀ'}</span>
            </span>
          </button>

          ${hasProgress ? `
            <!-- Nút Chơi Lại Game toàn chiều ngang, chữ to rõ không bao giờ bị cắt -->
            <button id="btn-title-new" class="btn-title-replay" aria-label="Chơi lại game từ đầu">
              <span class="replay-btn-icon">🔄</span>
              <span class="replay-btn-text">CHƠI LẠI GAME TỪ ĐẦU</span>
            </button>
          ` : ''}

          <!-- Hàng 3 nút tiện ích tinh gọn -->
          <div class="title-utilities-row">
            <button id="btn-title-bacba-manual" class="btn-utility-pill" aria-label="Cẩm nang Bác Ba">
              <span class="u-icon">📖</span>
              <span class="u-text">Cẩm Nang</span>
            </button>

            <button id="btn-title-music" class="btn-utility-pill" aria-label="Bật tắt nhạc nền">
              <span class="u-icon">${musicOn ? '🎵' : '🔇'}</span>
              <span class="u-text">${musicOn ? 'Nhạc Bật' : 'Nhạc Tắt'}</span>
            </button>

            <button id="btn-title-changelog" class="btn-utility-pill" aria-label="Xem bản cập nhật">
              <span class="u-icon">📜</span>
              <span class="u-text">Cập Nhật</span>
            </button>
          </div>
        </div>
      </footer>
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
