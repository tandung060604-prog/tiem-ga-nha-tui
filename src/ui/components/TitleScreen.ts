import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { CHAPTERS } from '../../content/chapters';
import { escapeHtml } from '../escapeHtml';
import { audio } from '../../core/audio';

const GABONG_QUOTES = [
  'Dạ Tiệm Gà Nhà Tui xin chào bạn! 🍗',
  'Hôm nay đùi gà sốt cay giòn rụm đang chờ chủ tiệm nè! ✨',
  'Khởi nghiệp từ chiếc xe đẩy nhỏ xíu, cùng nhau cố lên nha! 💛',
  'Chíp chíp! Chúc quán hôm nay bán hết veo trong một nốt nhạc! 🌟',
  'Bí quyết là sốt tẩm đậm đà và nụ cười tươi rói với khách! 🥰'
];

const CAT_QUOTES = [
  'Meo~ Mùi gà rán thơm phức làm mèo thức giấc nè! 🐱',
  'Meo meo... Cho mèo xin một miếng gà giòn không tiêu nha! ✨',
  'Ngủ nướng một xíu rồi phụ chủ tiệm canh hẻm nha meo~ 🐾'
];

const BASKET_QUOTES = [
  'Xèo xèo~ Mẻ gà vừa chiên xong, vàng giòn rùm rụm thơm nức mũi! 🍗🔥',
  'Vỏ ngoài giòn tan, bên trong mọng nước ngọt thịt! 🤤',
  'Lắc thêm xíu phô mai béo ngậy nữa là số dách luôn! 🧀'
];

const LANTERN_QUOTES = [
  '🏮 Đèn lồng sáng ấm, góc hẻm nhỏ bỗng bình yên lạ kỳ!',
  '✨ Ánh đèn vàng lung linh soi lối thực khách ghé tiệm gà!'
];

export function renderTitleScreen(state: GameState, hasProgress: boolean, musicOn: boolean): string {
  const chapter = CHAPTERS.find(c => c.number === state.currentChapter);
  return `
    <div id="title-screen" class="title-screen" style="--landing-bg: url('${ASSETS.ui.landingBg}');">
      <!-- Vignette and mood gradient overlay -->
      <div class="title-overlay"></div>

      <!-- Scalloped Awning on top edge -->
      <div class="title-awning"></div>

      <!-- Top Title Area -->
      <div class="title-top">
        <div class="title-kicker">🏮 TIỆM NHỎ KHỞI NGHIỆP · HẺM 1102 🏮</div>
        <h1 class="title-name">TIỆM GÀ<br/>NHÀ TUI</h1>
        <p class="title-tagline">Từ xe đẩy đầu hẻm đến chuỗi gà quốc dân</p>
        ${hasProgress ? `
          <div class="title-save">
            🍗 ${escapeHtml(state.shopName)} · Ngày ${state.day}${chapter ? ` · Chương ${chapter.number}` : ''}
          </div>` : ''}
      </div>

      <!-- Interactive Hotspots on the AI Landing Backdrop -->
      <div class="title-hotspots">
        <!-- Hotspot 1: Mascot Gà Bông -->
        <button id="hotspot-gabong" class="title-hotspot hotspot-gabong" aria-label="Gà Bông" title="Chạm để nói chuyện với Gà Bông">
          <span class="hotspot-ping"></span>
          <span class="hotspot-pill">🐥 Gà Bông</span>
        </button>

        <!-- Hotspot 2: Rổ gà rán giòn rụm -->
        <button id="hotspot-basket" class="title-hotspot hotspot-basket" aria-label="Rổ Gà Rán" title="Chạm xem gà chiên giòn">
          <span class="hotspot-ping"></span>
          <span class="hotspot-pill">🍗 Gà Rán Giòn</span>
        </button>

        <!-- Hotspot 3: Mèo ngủ trên gờ tường -->
        <button id="hotspot-cat" class="title-hotspot hotspot-cat" aria-label="Mèo Ngủ" title="Chạm đánh thức bé mèo">
          <span class="hotspot-ping"></span>
          <span class="hotspot-pill">🐱 Bé Mèo</span>
        </button>

        <!-- Hotspot 4: Đèn lồng ấm cúng -->
        <button id="hotspot-lantern" class="title-hotspot hotspot-lantern" aria-label="Đèn Lồng" title="Chạm thắp sáng đèn lồng">
          <span class="hotspot-ping"></span>
          <span class="hotspot-pill">🏮 Đèn Lồng</span>
        </button>

        <!-- Dynamic Floating Speech Bubble Container -->
        <div id="title-speech-bubble" class="title-speech-bubble" hidden></div>
      </div>

      <!-- Bottom Actions Area -->
      <div class="title-bottom">
        <div class="title-actions">
          <button id="btn-title-play" class="title-btn-play">
            ${hasProgress ? '▶ TIẾP TỤC BÁN GÀ' : '🍗 MỞ TIỆM NGAY (BẮT ĐẦU)'}
          </button>
          <div class="title-sub-actions">
            ${hasProgress ? '<button id="btn-title-new" class="btn-sm title-btn-sub">🆕 Chơi lại từ đầu</button>' : ''}
            <button id="btn-title-music" class="btn-sm title-btn-sub">${musicOn ? '🎵 Nhạc: Bật' : '🔇 Nhạc: Tắt'}</button>
          </div>
        </div>
        <p class="title-hint">
          ✨ Chạm vào <b>Gà Bông</b>, <b>Rổ Gà</b> hoặc <b>Bé Mèo</b> để tương tác nha!
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
    }, 3800);
  };

  const bindHotspot = (id: string, quotes: string[], left: number, top: number, onSound: () => void) => {
    const el = document.getElementById(id);
    if (!el) return;
    let idx = 0;
    el.onclick = (e) => {
      e.stopPropagation();
      onSound();
      const quote = quotes[idx % quotes.length] ?? '';
      idx++;
      showBubble(quote, left, top);
      el.classList.remove('hotspot-tapped');
      void el.offsetWidth;
      el.classList.add('hotspot-tapped');
    };
  };

  bindHotspot('hotspot-gabong', GABONG_QUOTES, 32, 54, () => audio.playPop());
  bindHotspot('hotspot-basket', BASKET_QUOTES, 55, 58, () => audio.playPerfect());
  bindHotspot('hotspot-cat', CAT_QUOTES, 65, 33, () => audio.playPop());
  bindHotspot('hotspot-lantern', LANTERN_QUOTES, 72, 45, () => audio.playPop());
}
