import { GameState, GamePhase, DayLedger, CustomerReview, StoryEndingId } from './types/game';
import { stateManager } from './core/state';
import { audio } from './core/audio';
import { music, babble, narrate, stopNarration } from './core/music';
import { renderTitleScreen } from './ui/components/TitleScreen';
import { STORY_ACTS } from './content/storyNovel';
import { cookingEngine, CookingEngine, Sauce } from './core/cooking';
import { SHOP_NAME_MAX } from './ui/escapeHtml';
import { OrdersEngine } from './core/orders';
import { EconomyEngine } from './core/economy';
import { RANDOM_EVENTS } from './content/events';
import { CHAPTERS } from './content/chapters';
import { MYSTERY_QUESTS, MysteryGuestQuest } from './content/mysteryGuests';
import { isTriggered, depositStatus, depositForNextChapter } from './core/progression';

// UI Components
import { renderHeader, bindHeaderEvents } from './ui/components/Header';
import { renderChalkboard } from './ui/components/Chalkboard';
import { renderInventoryTab, bindInventoryEvents } from './ui/components/InventoryTab';
import { renderUpgradesTab, bindUpgradesEvents } from './ui/components/UpgradesTab';
import { renderStaffTab, bindStaffEvents } from './ui/components/StaffTab';
import { renderReviewsTab, bindReviewsEvents } from './ui/components/ReviewsTab';
import { renderMenuTab, bindMenuEvents } from './ui/components/MenuTab';
import { renderSellingView, patchSellingView, sellingStructureKey } from './ui/components/SellingView';
import { SellingSession, createSellingSession, gameDeltaMs, tickSelling } from './core/sellingSim';
import { OPEN_HOUR, CLOSE_HOUR } from './core/clock';
import { creditSale, requestBaBaAid, eventForDay, createCustomerSource, useIngredients, recordFryerLift, SAUCE_STOCK, serveFirstOrder, applyBunnyReward, closeDay, DayResult, INSPECTION_FINE, BUNNY_VISIT_TIP } from './core/day';
import { upgradeEffects } from './core/upgrades';
import { renderSummaryModal } from './ui/components/SummaryModal';
import { renderSettingsModal } from './ui/components/SettingsModal';
import { renderStoryModal, bindStoryEvents, revealedStory } from './ui/components/StoryModal';
import { renderBunnyLetterModal, renderBunnyAlbumModal, bindBunnyModalEvents } from './ui/components/BunnyModal';
import { renderEndingModal, bindEndingEvents } from './ui/components/EndingModal';
import { evaluateEnding } from './content/endings';
import { BUNNY_LETTERS, BunnyLetter, MysteryBunnyEngine } from './content/mysteryBunny';
import { ShareCardEngine } from './ui/components/ShareCard';
import { ASSETS } from './content/assets';

type TabId = 'inventory' | 'upgrades' | 'staff' | 'reviews' | 'menu';

// Id nút trong màn bán hàng là `btn-<action>` (hợp đồng với SellingView + CSS)
const SELLING_ACTIONS = [
  'toggle-fast', 'fry-chicken', 'fry-fries', 'add-drink', 'fry-pot',
  'change-oil', 'season-spicy', 'season-honey', 'serve-order'
] as const;
type SellingAction = typeof SELLING_ACTIONS[number];

function isSellingAction(value: string | undefined): value is SellingAction {
  return (SELLING_ACTIONS as readonly string[]).includes(value ?? '');
}

function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${String(value)}`);
}

class AppController {
  private activeTab: TabId = 'inventory';
  private currentEvent = RANDOM_EVENTS[0];
  private sellingSession: SellingSession | null = null;
  private animFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private customerSource: ReturnType<typeof createCustomerSource> | null = null;
  private lastHeaderHtml = '';
  private sellingStructureKey = '';
  private expectedCustomers = 0;

  constructor() {
    this.init();
  }

  private init() {
    // Luôn đảm bảo nếu nạp lại trang mà đang ở pha 'selling', đưa về 'prep' để không bị màn hình trắng
    const state = stateManager.getState();
    if (state.phase === 'selling') {
      stateManager.update(draft => {
        draft.phase = 'prep';
      });
      document.body.classList.remove('selling-mode');
    }

    // Pick today's random event based on day
    this.pickDailyEvent();

    document.getElementById('main-view')?.addEventListener('click', e => {
      if (stateManager.getState().phase === 'selling' && e.target instanceof Element) {
        this.handleSellingClick(e.target);
      }
    });

    // Subscribe to state updates
    stateManager.subscribe(() => {
      this.render();
    });

    // Initial render
    this.render();

    // Âm thanh: tắt tiếng thì tắt nhạc; chuyển app/khóa máy thì dừng nhạc (iOS treo AudioContext)
    audio.onMuteChange(muted => (muted ? music.stop() : this.titleDismissed && music.start()));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { music.stop(); stopNarration(); }
      else if (this.titleDismissed) music.start();
    });
    // iOS Safari bỏ qua user-scalable=no: chặn phóng to bằng 2 ngón để không vỡ bố cục khi đang chiên
    document.addEventListener('gesturestart', e => e.preventDefault());

    this.showTitleScreen();
  }

  private titleDismissed = false;

  private showTitleScreen() {
    const state = stateManager.getState();
    const hasProgress = state.day > 1 || state.dayHistory.length > 0;
    document.getElementById('title-screen')?.remove();
    document.body.insertAdjacentHTML('beforeend', renderTitleScreen(state, hasProgress, music.isEnabled()));

    const start = (fresh: boolean) => {
      // Vào game trước, âm thanh sau: máy không có Web Audio cũng không bị kẹt ở màn tiêu đề
      this.titleDismissed = true;
      document.getElementById('title-screen')?.remove();
      music.unlock();             // chạm đầu tiên: được phép bật âm thanh trên iOS
      music.start(stateManager.getState().phase === 'selling' ? 'selling' : 'prep');
      audio.playPerfect();
      if (fresh || !hasProgress) setTimeout(() => this.openWelcomeDialog(), 250);
    };

    document.getElementById('btn-title-play')!.onclick = () => start(false);
    const newBtn = document.getElementById('btn-title-new');
    if (newBtn) newBtn.onclick = () => {
      music.unlock();
      document.getElementById('title-screen')?.remove();
      void this.confirmDialog('Xóa tiến độ hiện tại và mở tiệm lại từ Ngày 1?', 'Chơi mới').then(ok => {
        if (!ok) { this.showTitleScreen(); return; }
        stateManager.resetGame();
        this.pickDailyEvent();
        this.render();
        start(true);
      });
    };
    const musicBtn = document.getElementById('btn-title-music')!;
    musicBtn.onclick = () => {
      music.setEnabled(!music.isEnabled());
      if (!this.titleDismissed) music.stop();
      musicBtn.textContent = music.isEnabled() ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt';
    };
  }

  private openWelcomeDialog() {
    const welcomeHtml = `
      <div style="text-align: center; padding: 6px 4px;">
        <img src="${ASSETS.gabong.front}" alt="Gà Bông" width="120" height="120" style="display: block; margin: 0 auto 6px;" />
        <h2 style="margin: 0 0 6px; font-size: 1.5rem; color: var(--ink); font-weight: 800;">Chào Mừng Đến Với Tiệm Gà Nhà Tui!</h2>
        <p style="color: var(--soft); font-size: 0.85rem; line-height: 1.45; margin: 0 0 14px;">
          Hành trình của bạn bắt đầu từ chiếc xe đẩy gà rán đầu hẻm đơn sơ với số vốn <b>850.000đ</b>.<br/>
          Hãy kiểm tra kho, canh chiên gà vàng giòn <b>Perfect</b> và gom đủ <b>5.000.000đ</b> để thuê mặt bằng tiệm trong hẻm nhé!
        </p>
        <button id="btn-welcome-start" class="btn-big-open" style="width: 100%; padding: 12px; font-size: 1.1rem; box-shadow: 0 4px 0 var(--red-dark);">
          🍗 BẮT ĐẦU NGÀY 1 NGAY!
        </button>
      </div>
    `;
    this.openModal(welcomeHtml);
    const startBtn = document.getElementById('btn-welcome-start');
    if (startBtn) {
      startBtn.onclick = () => {
        audio.playPerfect();
        this.closeModal();
      };
    }
  }

  private openMysteryGuestDialog(quest: MysteryGuestQuest) {
    babble(quest.dialogue, 'guest');
    const html = `
      <div style="text-align: center; padding: 6px 4px;">
        <div style="font-size: 3.5rem; margin-bottom: 6px;">${quest.avatar}</div>
        <div style="font-size: 0.74rem; color: var(--red); font-weight: 800; letter-spacing: 1px;">✨ NHÂN VẬT BÍ ẨN XUẤT HIỆN ✨</div>
        <h2 style="margin: 4px 0 6px; font-size: 1.35rem; color: var(--ink); font-weight: 800;">${quest.guestName}</h2>
        <div style="font-size: 0.8rem; color: var(--soft); font-style: italic; margin-bottom: 12px; background: #faf4ea; padding: 8px 12px; border-radius: 10px; border-left: 3px solid var(--gold);">
          ${quest.dialogue}
        </div>
        <div style="text-align: left; background: var(--bg); border: 1.5px solid var(--line); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-size: 0.82rem;">
          <div>🎯 <b>Nhiệm vụ:</b> ${quest.conditionDescription}</div>
          <div style="color: var(--mint-dark); margin-top: 4px;">🎁 <b>Phần thưởng:</b> ${quest.rewardDescription}</div>
        </div>
        <button id="btn-accept-quest" class="btn-big-open" style="width: 100%; padding: 10px; font-size: 1rem; box-shadow: 0 4px 0 var(--red-dark);">
          ⚔️ TIẾP NHẬN THỬ THÁCH
        </button>
      </div>
    `;
    this.openModal(html);
    const acceptBtn = document.getElementById('btn-accept-quest');
    if (acceptBtn) {
      acceptBtn.onclick = () => {
        audio.playPerfect();
        this.closeModal();
        this.showToast(`Đã nhận nhiệm vụ từ ${quest.guestName}! Cố lên nhé! 🔥`);
      };
    }
  }

  private pickDailyEvent() {
    this.currentEvent = eventForDay(stateManager.getState().day);
  }

  public showToast(message: string) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  public openModal(contentHtml: string) {
    const overlay = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    content.innerHTML = contentHtml;
    overlay.removeAttribute('hidden');
  }

  public closeModal() {
    stopNarration();
    const overlay = document.getElementById('modal-container');
    if (overlay) {
      overlay.setAttribute('hidden', '');
    }
  }

  public openStoryModal(actIndex: number = 0) {
    const state = stateManager.getState();
    const html = renderStoryModal(state, actIndex);
    this.openModal(html);
    bindStoryEvents(
      state,
      (newIdx) => this.openStoryModal(newIdx),
      () => this.closeModal()
    );
    const episode = STORY_ACTS[actIndex];
    const narrateBtn = document.getElementById('btn-story-narrate');
    if (narrateBtn && episode) {
      narrateBtn.onclick = () => narrate(revealedStory(episode, stateManager.getState()).text);
    }
  }

  // Mở màn kết thúc. `record` = người chơi vừa ĐẠT kết thúc này (lưu vào bộ sưu tập để xem lại).
  public openEndingModal(endingId?: StoryEndingId, record = true) {
    if (endingId && record) {
      stateManager.update(draft => {
        draft.activeEnding = endingId;
        draft.achievedEndings = [...new Set([...(draft.achievedEndings ?? []), endingId])];
      });
      stateManager.flush();
    }
    const state = stateManager.getState();
    const html = renderEndingModal(state, endingId);
    this.openModal(html);
    bindEndingEvents(
      () => this.closeModal(),
      () => {
        void this.confirmDialog(
          'Bạn có chắc chắn muốn xóa dữ liệu và chơi lại từ đầu không?',
          'Chơi lại mới'
        ).then(ok => {
          if (ok) {
            stateManager.resetGame();
            window.location.reload();
          }
        });
      }
    );
  }

  public openBunnyLetterDialog(letter: BunnyLetter, isClaimed: boolean = false) {
    babble(letter.noteContent, 'bunny');
    const html = renderBunnyLetterModal(letter, isClaimed);
    this.openModal(html);
    bindBunnyModalEvents(
      () => {
        this.closeModal();
        this.showToast('Đã lưu mảnh giấy vào Sổ Ký Ức Thỏ Cam! 📜✨');
      },
      () => {
        this.openBunnyAlbumDialog();
      },
      () => {
        this.closeModal();
      }
    );
  }

  public openBunnyAlbumDialog(letterIndex: number = 0) {
    const state = stateManager.getState();
    const html = renderBunnyAlbumModal(state, letterIndex);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-bunny-modal');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    const tabs = document.querySelectorAll('.bunny-album-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-letter-idx') || '0', 10);
        audio.playPop();
        this.openBunnyAlbumDialog(idx);
      });
    });

    const readNovelBtn = document.getElementById('btn-read-full-novel');
    if (readNovelBtn) {
      readNovelBtn.onclick = () => {
        audio.playPop();
        this.openStoryModal(0);
      };
    }
  }

  public openBunnyGreetingDialog() {
    const quote = MysteryBunnyEngine.getRandomGreeting();
    babble(quote, 'bunny');
    const html = `
      <div style="text-align: center; padding: 10px 4px;">
        <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 10px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #ff9800, #f57c00); box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);">
          <img src="${ASSETS.thocam.vui}" alt="Bé Thỏ Cam" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background: #fff;" />
        </div>
        <div style="font-size: 0.75rem; color: #e65100; font-weight: 800; text-transform: uppercase;">🐰 KHÁCH TRI KỶ ĐANG CHỜ MÓN 🐰</div>
        <h2 style="margin: 4px 0 8px; font-size: 1.3rem; color: #bf360c; font-weight: 800;">Bé Thỏ Cam</h2>
        <div style="background: #fff8e1; border: 1.5px dashed #ffb74d; border-radius: 10px; padding: 12px; margin-bottom: 14px; font-size: 0.85rem; color: #4e342e; font-style: italic; line-height: 1.5;">
          ${quote}
        </div>
        <button id="btn-close-bunny-greet" class="btn-big-open" style="width: 100%; padding: 10px; font-size: 0.95rem; background: linear-gradient(135deg, #ff9800, #f57c00); box-shadow: 0 4px 0 #e65100;">
          🍗 Chiên Món Thật Ngon Đãi Bé Thỏ!
        </button>
      </div>
    `;
    this.openModal(html);
    const closeBtn = document.getElementById('btn-close-bunny-greet');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }
  }

  // Chuyển đổi giữa các pha (Prep -> Selling -> Summary)
  public setPhase(phase: GamePhase) {
    // Bỏ phiên cũ trước khi đổi pha, để lần render do update() gây ra không vẽ phiên của hôm qua
    if (phase === 'selling') this.sellingSession = null;
    stateManager.update(draft => {
      draft.phase = phase;
    });
    stateManager.flush();

    music.setMode(phase === 'selling' ? 'selling' : 'prep');
    if (phase === 'selling') {
      document.body.classList.add('selling-mode');
      this.startSellingPhase();
    } else {
      document.body.classList.remove('selling-mode');
      this.stopSellingPhase();
    }
  }

  public render() {
    const state = stateManager.getState();

    // 1. Render Header (chỉ khi nội dung đổi, để nút header không bị thay mỗi frame)
    const headerEl = document.getElementById('header');
    const headerHtml = renderHeader(state, () => this.openSettings());
    if (headerEl && headerHtml !== this.lastHeaderHtml) {
      this.lastHeaderHtml = headerHtml;
      headerEl.innerHTML = headerHtml;
      bindHeaderEvents(
        state,
        () => this.render(),
        () => this.openSettings()
      );
    }

    // 2. Render Main View
    const mainViewEl = document.getElementById('main-view');
    if (!mainViewEl) return;

    if (state.phase === 'prep') {
      document.body.classList.remove('selling-mode');
      this.sellingStructureKey = '';
      mainViewEl.innerHTML = this.renderPrepView(state);
      this.bindPrepEvents(state);
    } else if (state.phase === 'selling' && this.sellingSession) {
      document.body.classList.add('selling-mode');
      const key = sellingStructureKey(state, this.sellingSession);
      if (key !== this.sellingStructureKey) {
        this.sellingStructureKey = key;
        mainViewEl.innerHTML = renderSellingView(state, this.sellingSession);
      } else {
        patchSellingView(mainViewEl, this.sellingSession);
      }
    }
  }

  // --- PREPARATION PHASE ---
  private renderPrepView(state: GameState): string {
    const forecast = EconomyEngine.calculateDailyCustomerCount(state, this.currentEvent.effect.customerMultiplier ?? 1);
    const chalkboardHtml = renderChalkboard(state, `${this.currentEvent.title} · dự kiến ~${forecast} khách`);

    const tabsBarHtml = `
      <div class="tabs-bar">
        <button class="tab-btn ${this.activeTab === 'inventory' ? 'active' : ''}" data-tab="inventory">
          <span class="tab-icon">📦</span>
          <span>Kho hàng</span>
        </button>
        <button class="tab-btn ${this.activeTab === 'upgrades' ? 'active' : ''}" data-tab="upgrades">
          <span class="tab-icon">🛠️</span>
          <span>Nâng cấp</span>
        </button>
        <button class="tab-btn ${this.activeTab === 'staff' ? 'active' : ''}" data-tab="staff">
          <span class="tab-icon">👥</span>
          <span>Nhân viên</span>
        </button>
        <button class="tab-btn ${this.activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews">
          <span class="tab-icon">⭐</span>
          <span>Đánh giá</span>
        </button>
        <button class="tab-btn ${this.activeTab === 'menu' ? 'active' : ''}" data-tab="menu">
          <span class="tab-icon">📖</span>
          <span>Sổ tay</span>
        </button>
      </div>
    `;

    let paneContentHtml = '';
    switch (this.activeTab) {
      case 'inventory':
        paneContentHtml = renderInventoryTab(state);
        break;
      case 'upgrades':
        paneContentHtml = renderUpgradesTab(state);
        break;
      case 'staff':
        paneContentHtml = renderStaffTab(state);
        break;
      case 'reviews':
        paneContentHtml = renderReviewsTab(state);
        break;
      case 'menu':
        paneContentHtml = renderMenuTab(state);
        break;
    }

    const openBarHtml = `
      <div class="open-bar">
        <button id="btn-start-selling" class="btn-big-open">
          🍗 BẮT ĐẦU MỞ BÁN (${OPEN_HOUR}:00 - ${CLOSE_HOUR}:00)
        </button>
      </div>
    `;

    return `
      <div class="prep-container">
        ${chalkboardHtml}
        ${tabsBarHtml}
        <div class="pane">
          ${paneContentHtml}
        </div>
        ${openBarHtml}
      </div>
    `;
  }

  private bindPrepEvents(state: GameState) {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.getAttribute('data-tab') as TabId;
        if (tab) {
          this.activeTab = tab;
          audio.playPop();
          this.render();
        }
      });
    });

    // Chalkboard Buttons
    const readStoryBtn = document.getElementById('btn-read-story');
    if (readStoryBtn) {
      readStoryBtn.onclick = () => {
        audio.playPop();
        this.openStoryModal(0);
      };
    }

    // Về đích Chương 5: dự lễ trao giải Gà Vàng → mở kết thúc theo lựa chọn suốt hành trình
    const finaleBtn = document.getElementById('btn-finale');
    if (finaleBtn) {
      finaleBtn.onclick = () => {
        const ending = evaluateEnding(stateManager.getState());
        if (ending) this.openEndingModal(ending);
      };
    }

    // Đặt cọc qua chương: trả tiền một lần, có xác nhận
    const depositBtn = document.getElementById('btn-deposit');
    if (depositBtn) {
      depositBtn.onclick = () => {
        const status = depositStatus(stateManager.getState());
        if (!status.ready) return;
        void this.confirmDialog(
          `Đặt cọc <b>${status.cost.toLocaleString('vi-VN')}đ</b> để chuyển sang chương mới? Số tiền này sẽ bị trừ khỏi quỹ.`,
          'Đặt cọc'
        ).then(ok => {
          if (!ok) return;
          let chapter: number | null = null;
          stateManager.update(draft => { chapter = depositForNextChapter(draft); });
          stateManager.flush();
          if (chapter !== null) this.openChapterUnlockedDialog(chapter);
        });
      };
    }

    const openBunnyNotesBtn = document.getElementById('btn-open-bunny-notes');
    if (openBunnyNotesBtn) {
      openBunnyNotesBtn.onclick = () => {
        audio.playPop();
        this.openBunnyAlbumDialog(0);
      };
    }

    // Bind current tab events
    switch (this.activeTab) {
      case 'inventory':
        bindInventoryEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg)
        );
        break;
      case 'upgrades':
        bindUpgradesEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg)
        );
        break;
      case 'staff':
        bindStaffEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg)
        );
        break;
      case 'reviews':
        bindReviewsEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg)
        );
        break;
      case 'menu':
        bindMenuEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg),
          () => this.openBunnyAlbumDialog(0),
          () => this.openStoryModal(0)
        );
        break;
    }

    // Start Selling Button
    const startSellingBtn = document.getElementById('btn-start-selling');
    if (startSellingBtn) {
      startSellingBtn.onclick = () => {
        // Kiểm tra nguyên liệu tối thiểu
        const chickenStock = state.inventory.chicken_meat?.amount || 0;
        if (chickenStock < 2) {
          if (state.money < 14000) {
            // Tương trợ khu phố từ Bác Ba Tổ Trưởng nếu người chơi bị kẹt (1 lần mỗi chương)
            let granted = false;
            stateManager.update(draft => { granted = requestBaBaAid(draft); });
            if (granted) {
              audio.playCash();
              babble('Con ơi cầm lấy mà xoay xở', 'bacba');
              this.showToast('❤️ Bác Ba tiếp tế 15 miếng gà tươi & 150k vốn! Chương này bác chỉ giúp được một lần thôi đó.');
            } else {
              this.showToast('Hết gà và hết vốn… Bác Ba đã giúp một lần trong chương này rồi. Bán bớt đồ hoặc nhận thưởng Thỏ Cam nhé.');
            }
            this.render();
            return;
          }
          this.showToast('Kho đã hết thịt gà! Hãy vào tab Kho hàng để nhập thêm!');
          return;
        }

        audio.playPerfect();
        this.showToast('Quán chính thức mở cửa! Chúc buôn may bán đắt! 🎊');
        this.setPhase('selling');
      };
    }
  }

  // --- SELLING PHASE ---
  private startSellingPhase() {
    this.stopSellingPhase(); // đảm bảo không bao giờ có 2 vòng requestAnimationFrame song song
    this.sellingStructureKey = '';
    this.sellingSession = createSellingSession();
    cookingEngine.setFryRampBonus(upgradeEffects(stateManager.getState().upgrades).fryRampPct);
    cookingEngine.clearTray();
    const state = stateManager.getState();
    this.customerSource = createCustomerSource(state, this.currentEvent);
    this.sellingSession.orders.push(...this.customerSource.opening());

    // Số khách cả ngày: khách nền theo chương × sao × marketing × sự kiện (GDD)
    this.expectedCustomers = EconomyEngine.calculateDailyCustomerCount(state, this.currentEvent.effect.customerMultiplier ?? 1);

    this.lastTimestamp = performance.now();

    // Nhân vật bí ẩn: mở theo tiến độ chương, mỗi người hiện một lần
    const activeQuest = MYSTERY_QUESTS.find(q => isTriggered(q.trigger, state) && !state.completedQuests.includes(q.id));
    if (activeQuest) {
      stateManager.update(draft => { draft.completedQuests.push(activeQuest.id); });
      setTimeout(() => {
        this.openMysteryGuestDialog(activeQuest);
      }, 800);
    }

    // Start game tick loop
    this.loopSelling(performance.now());
  }

  private stopSellingPhase() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audio.stopSizzle();
  }

  private loopSelling(currentTimestamp: number) {
    const session = this.sellingSession;
    if (!session || stateManager.getState().phase !== 'selling') return;

    const gameDt = gameDeltaMs(session, currentTimestamp - this.lastTimestamp);
    this.lastTimestamp = currentTimestamp;

    // Chảo chiên chạy cùng nhịp thời gian game (tua nhanh thì chín nhanh)
    const cookResult = cookingEngine.updateFrying(gameDt);
    // Dây chuyền chiên tự động (bếp cấp 6): tự nhấc giỏ ở giữa vùng Perfect
    const { autoLift } = upgradeEffects(stateManager.getState().upgrades);
    if (autoLift && cookingEngine.getCookState().isFrying && cookingEngine.getCookState().progress >= CookingEngine.AUTO_LIFT_AT) {
      this.onFryerLifted(cookingEngine.liftFryer());
      this.showToast('🤖 Dây chuyền tự nhấc giỏ: VÀNG GIÒN PERFECT!');
    } else if (cookResult.finished && cookResult.quality === 'burnt') {
      // Gà bị cháy khét do để quá lâu trong chảo (nguyên liệu đã tính lúc thả gà)
      this.onFryerLifted(cookingEngine.liftFryer());
      this.showToast('Gà chiên bị cháy khét bốc khói rồi! Mau vứt đi! 😭');
    }

    const events = tickSelling(session, gameDt, {
      expectedCustomers: this.expectedCustomers,
      spawnCustomer: () => this.customerSource?.next(session.orders) ?? OrdersEngine.generateOrder(stateManager.getState())
    });

    let dayOver = false;
    for (const event of events) {
      switch (event.type) {
        case 'customerLeft':
          audio.playBurnt();
          this.showToast('Khách chờ lâu quá đã quạu bỏ về! Tụt sao tốc độ! ⚠️');
          break;
        case 'customerArrived':
          break;
        case 'dayOver':
          dayOver = true;
          break;
        default:
          assertNever(event);
      }
    }

    this.render();

    if (dayOver) {
      this.finishDay();
      return;
    }
    this.animFrameId = requestAnimationFrame((ts) => this.loopSelling(ts));
  }

  private useIngredients(ids: string[]): boolean {
    let ok = false;
    stateManager.update(draft => {
      ok = useIngredients(draft, this.sellingSession, ids);
    });
    return ok;
  }

  private onFryerLifted(result: ReturnType<typeof cookingEngine.liftFryer>) {
    stateManager.update(draft => recordFryerLift(draft, this.sellingSession, result));
    if (!result.trayItem) this.showToast('Khay đầy, món vừa vớt bị bỏ!');
  }

  // Mọi click trong màn bán hàng đi qua đây (một listener gắn một lần trên #main-view).
  // Đọc state tại thời điểm bấm, không dùng state bắt trong closure lúc render.
  private handleSellingClick(target: Element) {
    if (!this.sellingSession) return;

    const trayEl = target.closest<HTMLElement>('.tray-item');
    if (trayEl) {
      cookingEngine.removeFromTray(parseInt(trayEl.dataset.trayIdx ?? '0', 10));
      this.showToast('Đã dọn dẹp khay!');
      this.render();
      return;
    }

    const bunnyCard = target.closest<HTMLElement>('.customer-card[data-is-bunny="true"]');
    if (bunnyCard) {
      const letter = BUNNY_LETTERS.find(l => l.id === bunnyCard.dataset.letterId);
      if (letter) this.openBunnyLetterDialog(letter);
      else this.openBunnyGreetingDialog();
      return;
    }

    const button = target.closest<HTMLElement>('[id]');
    const action = button?.id.replace(/^btn-/, '');
    if (!button || button.hasAttribute('disabled') || !isSellingAction(action)) return;
    this.runSellingAction(action);
  }

  private runSellingAction(action: SellingAction) {
    const session = this.sellingSession;
    if (!session) return;

    switch (action) {
      case 'toggle-fast':
        session.isFastForward = !session.isFastForward;
        audio.playPop();
        break;

      case 'fry-chicken':
      case 'fry-fries': {
        const isChicken = action === 'fry-chicken';
        if (cookingEngine.getCookState().isFrying) return;
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(isChicken ? ['chicken_meat', 'flour'] : ['potato_cheese'])) {
          this.showToast(isChicken ? 'Hết thịt gà hoặc bột chiên giòn!' : 'Hết khoai tây & phô mai!');
          return;
        }
        session.totalFriedCount += 1;
        cookingEngine.startFrying(isChicken ? 'chicken' : 'fries');
        break;
      }

      case 'add-drink':
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(['soft_drink'])) {
          this.showToast('Hết nước ngọt trong kho!');
          return;
        }
        cookingEngine.addDrink();
        break;

      case 'fry-pot': {
        // Chảo trống: chạm chảo = thả gà nhanh
        if (!cookingEngine.getCookState().isFrying) {
          this.runSellingAction('fry-chicken');
          return;
        }
        const result = cookingEngine.liftFryer();
        this.onFryerLifted(result);
        const toast: Record<typeof result.quality, string> = {
          perfect: '✨ VÀNG GIÒN PERFECT! +Hương vị!',
          raw: '⚠️ Vớt sớm quá, gà còn sống! Khách sẽ không nhận đâu.',
          good: 'Chín vừa, ăn được nhưng chưa giòn đỉnh.',
          burnt: 'Cháy mất rồi! Giao gà cháy khách chỉ trả nửa giá.'
        };
        this.showToast(toast[result.quality]);
        break;
      }

      case 'change-oil':
        if (stateManager.getState().money < 150000) {
          this.showToast('Không đủ 150.000đ để thay dầu mới!');
          return;
        }
        stateManager.update(draft => {
          draft.money -= 150000;
          draft.oilCondition = 'clean';
          draft.oilBatchesCooked = 0;
        });
        audio.playCash();
        this.showToast('Đã thay dầu chiên mới tinh vàng óng! Vệ sinh 5 sao! ✨');
        break;

      case 'season-spicy':
      case 'season-honey': {
        const sauce: Sauce = action === 'season-spicy' ? 'spicy' : 'honey';
        if (cookingEngine.getActiveSeasoning() === sauce) {
          cookingEngine.setSeasoning(null);
        } else if ((stateManager.getState().inventory[SAUCE_STOCK[sauce]]?.amount ?? 0) < 1) {
          this.showToast('Hết sốt trong kho! Vào Kho hàng để nhập thêm.');
          return;
        } else {
          cookingEngine.setSeasoning(sauce);
        }
        break;
      }

      case 'serve-order':
        this.serveCurrentCustomer();
        return;

      default:
        return assertNever(action);
    }
    this.render();
  }

  // Giao món cho khách đầu hàng (luật ở core/day.ts); ở đây chỉ lo tiền vào ví, âm thanh, thông báo.
  private serveCurrentCustomer() {
    const session = this.sellingSession;
    if (!session) return;
    const menu = stateManager.getState().menu;
    const result = serveFirstOrder(
      session,
      cookingEngine.getTray(),
      id => menu.find(m => m.id === id)?.currentPrice ?? 0,
      idx => cookingEngine.removeFromTray(idx)
    );

    switch (result.kind) {
      case 'no-order':
        return;
      case 'empty-tray':
        this.showToast('Khay đồ ăn đang trống, chưa có món để giao!');
        return;
      case 'raw-rejected':
        this.showToast('🤢 Gà còn sống, khách không nhận! Chiên lại mẻ khác nhé.');
        return;
      case 'no-match':
        this.showToast('Đồ ăn trong khay không khớp với món khách gọi!');
        return;
      case 'partial':
        audio.playPop();
        this.showToast('Đã giao trước một phần, hãy làm tiếp món còn lại!');
        this.render();
        return;
      case 'complete':
        break;
      default:
        assertNever(result);
    }

    const { order, paid, tip, burnt } = result;
    let letter: BunnyLetter | undefined;
    stateManager.update(draft => {
      creditSale(draft, paid, tip);
      if (order.isBunny) letter = applyBunnyReward(draft, order);
    });

    if (letter) {
      audio.playPerfect();
      this.openBunnyLetterDialog(letter, true);
    } else if (order.isBunny) {
      audio.playCash();
      this.showToast(`🐰 Bé Thỏ Cam gật gù hạnh phúc, tip thêm ${BUNNY_VISIT_TIP.toLocaleString('vi-VN')}đ và vẫy tai chào! 💖`);
    } else {
      audio.playCash();
      const notes = [tip > 0 ? `+${(tip / 1000).toLocaleString('vi-VN')}k tip` : '', burnt ? 'gà cháy bị trừ nửa giá' : '']
        .filter(Boolean).join(', ');
      this.showToast(`Phục vụ thành công! +${(paid + tip).toLocaleString('vi-VN')}đ ${notes ? `(${notes})` : ''} 💵`);
    }
    this.render();
  }

  // --- FINISH DAY & SUMMARY ---
  private finishDay() {
    this.stopSellingPhase();
    const session = this.sellingSession;
    if (!session) return;

    let result: DayResult | undefined;
    stateManager.update(draft => {
      result = closeDay(draft, session, this.currentEvent);
    });
    if (!result) return;

    const inspectionToast = {
      fined: `📋 Đoàn kiểm tra phát hiện dầu đen! Phạt ${INSPECTION_FINE.toLocaleString('vi-VN')}đ, trừ sao Vệ sinh.`,
      praised: '📋 Đoàn kiểm tra khen dầu sạch! +Vệ sinh.',
      warned: '📋 Đoàn kiểm tra nhắc nhở: dầu đã ngả màu.'
    };
    if (result.inspection) this.showToast(inspectionToast[result.inspection]);

    audio.playPerfect();
    this.openModal(renderSummaryModal(stateManager.getState(), result.ledger, result.review, result.advisorTip));
    this.bindSummaryEvents(result.ledger, result.review);
  }

  // Màn chúc mừng qua chương: hiện sau khi đóng tổng kết ngày (thay cho alert() cũ)
  private openChapterUnlockedDialog(chapterNumber: number) {
    const chapter = CHAPTERS.find(c => c.number === chapterNumber);
    if (!chapter) return;
    this.openModal(`
      <div class="chapter-unlocked">
        <div class="chapter-unlocked-icon">🎉</div>
        <div class="chapter-unlocked-kicker">MỞ KHÓA CHƯƠNG ${chapter.number}</div>
        <h2 class="chapter-unlocked-title">${chapter.title}</h2>
        <p class="chapter-unlocked-context">${chapter.context}</p>
        <button id="btn-chapter-continue" class="btn-big-open">Tiếp tục 👉</button>
      </div>
    `);
    const btn = document.getElementById('btn-chapter-continue');
    if (btn) btn.onclick = () => {
      audio.playPop();
      this.closeModal();
    };
    audio.playPerfect();
  }

  // Hộp xác nhận trong game (thay confirm() của trình duyệt)
  public confirmDialog(message: string, confirmLabel: string): Promise<boolean> {
    this.openModal(`
      <div class="confirm-dialog">
        <p class="confirm-message">${message}</p>
        <div class="confirm-actions">
          <button id="btn-confirm-cancel" class="btn-sm">Hủy</button>
          <button id="btn-confirm-ok" class="btn-sm primary">${confirmLabel}</button>
        </div>
      </div>
    `);
    return new Promise(resolve => {
      const done = (ok: boolean) => {
        this.closeModal();
        resolve(ok);
      };
      const ok = document.getElementById('btn-confirm-ok');
      const cancel = document.getElementById('btn-confirm-cancel');
      if (ok) ok.onclick = () => done(true);
      if (cancel) cancel.onclick = () => done(false);
    });
  }

  private bindSummaryEvents(ledger: DayLedger, review: CustomerReview) {
    // Nút Bắt đầu Ngày mới
    const nextDayBtn = document.getElementById('btn-start-next-day');
    if (nextDayBtn) {
      nextDayBtn.onclick = () => {
        this.closeModal();
        const currentEnding = evaluateEnding(stateManager.getState());
        if (currentEnding) {
          this.openEndingModal(currentEnding);
          return;
        }
        stateManager.update(draft => {
          draft.day += 1;
          draft.phase = 'prep';
        });
        this.pickDailyEvent();
        this.setPhase('prep');
        this.showToast(`Chào buổi sáng Ngày ${stateManager.getState().day}! Chuẩn bị hàng nào! ☀️`);
      };
    }

    // Nút Tải Thẻ Review / Chia sẻ Threads
    const shareBtn = document.getElementById('btn-share-card');
    if (shareBtn) {
      shareBtn.onclick = async () => {
        this.showToast('Đang tạo ảnh thẻ review Threads sắc nét... 🎨');
        const state = stateManager.getState();
        const blob = await ShareCardEngine.generateReviewCardBlob(review, state, ledger);
        if (!blob) {
          this.showToast('Không thể tạo ảnh canvas!');
          return;
        }

        // Tải ảnh về máy
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TiemGaNhaTui_Review_Ngay_${state.day}.png`;
        a.click();
        URL.revokeObjectURL(url);

        // Mở Web Share API nếu hỗ trợ
        if (navigator.share) {
          try {
            const file = new File([blob], `TiemGa_Ngay_${state.day}.png`, { type: 'image/png' });
            await navigator.share({
              title: 'Tiệm Gà Nhà Tui - Review Khách Hàng',
              text: `Khách vừa review tiệm gà của tui nè: "${review.comment}" ⭐ ${review.stars}/5 sao! Chơi ngay nha!`,
              files: [file]
            });
          } catch {
            // Người dùng hủy chia sẻ
          }
        } else {
          this.showToast('Đã tải ảnh thẻ review về máy thành công! Hãy đăng lên Threads nhé! 📸');
        }
      };
    }
  }

  // --- SETTINGS MODAL ---
  private openSettings() {
    const state = stateManager.getState();
    this.openModal(renderSettingsModal(state));

    const closeBtn = document.getElementById('btn-close-settings');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();

    const saveNameBtn = document.getElementById('btn-save-shop-name');
    if (saveNameBtn) {
      saveNameBtn.onclick = () => {
        const input = document.getElementById('input-shop-name') as HTMLInputElement;
        const name = input?.value.trim().slice(0, SHOP_NAME_MAX);
        if (name) {
          stateManager.update(draft => {
            draft.shopName = name;
          });
          audio.playCash();
          this.showToast(`Đã đổi tên tiệm thành: "${name}"! 🍗`);
          this.closeModal();
        }
      };
    }

    const musicToggleBtn = document.getElementById('btn-settings-music');
    if (musicToggleBtn) {
      musicToggleBtn.onclick = () => {
        music.setEnabled(!music.isEnabled());
        this.openSettings();
      };
    }

    const audioToggleBtn = document.getElementById('btn-settings-audio');
    if (audioToggleBtn) {
      audioToggleBtn.onclick = () => {
        audio.toggleMute();
        this.openSettings(); // re-render settings
      };
    }

    const viewEndingBtn = document.getElementById('btn-view-ending');
    if (viewEndingBtn) {
      viewEndingBtn.onclick = () => {
        audio.playPop();
        // Chỉ xem lại kết thúc ĐÃ đạt; không cho soi trước kết thúc hay điều kiện của chúng
        const achieved = state.achievedEndings ?? [];
        const last = achieved[achieved.length - 1];
        if (!last) {
          this.showToast('Chưa có kết thúc nào. Hành trình của tiệm còn dài lắm! 🍗');
          return;
        }
        this.openEndingModal(last, false);
      };
    }

    const resetBtn = document.getElementById('btn-reset-game');
    if (resetBtn) {
      resetBtn.onclick = () => {
        void this.confirmDialog(
          'Xóa toàn bộ dữ liệu và chơi lại từ Ngày 1? Không hoàn tác được.',
          'Xóa &amp; chơi lại'
        ).then(ok => {
          if (!ok) return;
          stateManager.resetGame();
          this.setPhase('prep');
          this.showToast('Đã khôi phục game về ngày đầu tiên!');
        });
      };
    }
  }
}

// Khởi chạy game khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  new AppController();
});
