import { GameState, GamePhase, DayLedger, CustomerReview, StoryEndingId } from './types/game';
import { stateManager } from './core/state';
import { audio } from './core/audio';
import { Haptics } from './core/haptics';
import { music, babble, narrate, stopNarration } from './core/music';
import { renderTitleScreen, bindTitleScreenInteractions } from './ui/components/TitleScreen';
import { STORY_ACTS } from './content/storyNovel';
import { cookingEngine, CookingEngine, Sauce } from './core/cooking';
import { escapeHtml } from './ui/escapeHtml';
import { normalizeShopName, SHOP_NAME_MAX, SHOP_NAME_SUGGESTIONS } from './core/shopName';
import { exportSaveCode, importSaveCode } from './core/saveCode';
import { OrdersEngine } from './core/orders';
import { EconomyEngine } from './core/economy';
import { RANDOM_EVENTS } from './content/events';
import { CHAPTERS } from './content/chapters';
import { MYSTERY_QUESTS, MysteryGuestQuest } from './content/mysteryGuests';
import { isTriggered, depositStatus, depositForNextChapter, CHAPTER_PRICE_STEP } from './core/progression';

// UI Components
import { renderHeader, bindHeaderEvents } from './ui/components/Header';
import { renderChalkboard } from './ui/components/Chalkboard';
import { renderInventoryTab, bindInventoryEvents } from './ui/components/InventoryTab';
import { renderUpgradesTab, bindUpgradesEvents } from './ui/components/UpgradesTab';
import { renderStaffTab, bindStaffEvents } from './ui/components/StaffTab';
import { renderReviewsTab, bindReviewsEvents } from './ui/components/ReviewsTab';
import { renderMenuTab, bindMenuEvents } from './ui/components/MenuTab';
import { renderSellingView, patchSellingView, sellingStructureKey, renderFx } from './ui/components/SellingView';
import { SellingSession, createSellingSession, gameDeltaMs, tickSelling, drainFx } from './core/sellingSim';
import { OPEN_HOUR, CLOSE_HOUR } from './core/clock';
import type { ShiftSnapshot } from './core/sellingSim';
import { DRINK_RECIPES, TIMER_RECIPES, timerPhase, TimerStationId, AssemblyId, DrinkId, isTimerStationId, isAssemblyId, isDrinkId, ScoopId, isScoopId } from './core/stations';
import { PREP_LAYOUT, prepLock } from './core/prepStation';
import { showPrepPopover } from './ui/components/PrepStation';
import { staffEffects, tickStaff, fryingItemId, traySizeFor, hasAutoWork, missingItems, FRY_RECIPES, FRY_LOOK } from './core/staff';
import { TutorialState, tutorialStep, tutorialHint, shouldRunTutorial } from './core/tutorial';
import { syncTutorialLayer } from './ui/components/TutorialLayer';
import { weeklyWrapped } from './core/wrapped';
import { drawWrapped, shareWrapped, shareImage } from './ui/components/WrappedCard';

import { squeezeCondiment, recordHelperFry, StationResult, scoopSide, changeOil, OIL_CHANGE_COST, startTimerStation, pullTimerStation, assembleAtCounter, makeDrink, creditSale, requestBaBaAid, eventForDay, createCustomerSource, useIngredients, recordFryerLift, SAUCE_STOCK, serveFirstOrder, applyBunnyReward, closeDay, DayResult, INSPECTION_FINE, BUNNY_VISIT_TIP } from './core/day';
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
import { pickDailyIncident, resolveIncidentChoice } from './core/dailyIncidentsEngine';
import { DAILY_INCIDENTS } from './content/dailyIncidents';
import { renderIncidentPrompt, renderIncidentReaction, renderIncidentAlbumModal } from './ui/components/DailyIncidentModal';
import type { DailyIncident } from './types/game';

type TabId = 'inventory' | 'upgrades' | 'staff' | 'reviews' | 'menu';

const SELLING_ACTIONS = [
  'toggle-fast', 'fry-chicken', 'fry-fries', 'fry-popcorn', 'fry-thigh', 'fry-cheese',
  'add-drink', 'pour-coca', 'pour-7up', 'pour-fanta', 'squeeze-ketchup', 'squeeze-chili',
  'fry-pot', 'change-oil', 'season-spicy', 'season-honey', 'serve-order'
] as const;
type SellingAction = typeof SELLING_ACTIONS[number];

// Nút chiên trên quầy khay inox → món chiên (công thức ở core/staff.ts FRY_RECIPES)
const FRY_ACTION_ITEM = {
  'fry-chicken': 'crispy_chicken', 'fry-fries': 'shake_fries', 'fry-popcorn': 'popcorn_chicken',
  'fry-thigh': 'spicy_thigh', 'fry-cheese': 'cheese_stick'
} as const;

// Nút của trạm mở theo chương: btn-timer-<nồi>, btn-assemble-<món>, btn-drink-<đồ uống>, btn-scoop-<món kèm>
type StationAction =
  | { kind: 'timer'; id: TimerStationId }
  | { kind: 'assemble'; id: AssemblyId }
  | { kind: 'drink'; id: DrinkId }
  | { kind: 'scoop'; id: ScoopId };

function parseStationAction(action: string | undefined): StationAction | null {
  const [kind, ...rest] = (action ?? '').split('-');
  const id = rest.join('-');
  if (kind === 'timer' && isTimerStationId(id)) return { kind, id };
  if (kind === 'assemble' && isAssemblyId(id)) return { kind, id };
  if (kind === 'drink' && isDrinkId(id)) return { kind, id };
  if (kind === 'scoop' && isScoopId(id)) return { kind, id };
  return null;
}

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
    // Có ca bán dở (thoát app giữa ca) thì giữ nguyên, tiếp tục sau khi chạm "Chơi tiếp" ở màn tiêu đề

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
    window.addEventListener('pagehide', () => this.snapshotShift());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { this.snapshotShift(); music.stop(); stopNarration(); }
      else if (this.titleDismissed) music.start();
    });
    // iOS Safari bỏ qua user-scalable=no: chặn phóng to bằng 2 ngón để không vỡ bố cục khi đang chiên
    document.addEventListener('gesturestart', e => e.preventDefault());

    // Móc gỡ lỗi chỉ có ở bản dev: trên trang thật, gọi sự cố từ console là cày tiền thưởng vô hạn
    if (import.meta.env?.DEV) {
      (window as any).__app = this;
      (window as any).__triggerIncident = (id?: string) => {
        const inc = id ? DAILY_INCIDENTS.find(i => i.id === id) : pickDailyIncident(stateManager.getState(), 'morning');
        if (inc) this.openDailyIncidentDialog(inc);
        return inc;
      };
    }

    this.showTitleScreen();
  }

  private titleDismissed = false;

  private showTitleScreen() {
    const state = stateManager.getState();
    const hasProgress = state.day > 1 || state.dayHistory.length > 0 || !!state.pausedShift;
    document.getElementById('title-screen')?.remove();
    document.body.insertAdjacentHTML('beforeend', renderTitleScreen(state, hasProgress, music.isEnabled()));
    bindTitleScreenInteractions();

    const start = (fresh: boolean) => {
      // Vào game trước, âm thanh sau: máy không có Web Audio cũng không bị kẹt ở màn tiêu đề
      this.titleDismissed = true;
      document.getElementById('title-screen')?.remove();
      music.unlock();             // chạm đầu tiên: được phép bật âm thanh trên iOS
      void navigator.storage?.persist?.().catch(() => false); // xin trình duyệt không tự xóa save (iOS xóa sau ~7 ngày không mở)
      if (!fresh && stateManager.getState().pausedShift) {
        this.resumeShift();
        return;
      }
      music.start('prep');
      audio.playPerfect();
      // Tiệm mới: chủ tiệm tự đặt tên quán trước, rồi mới tới lời chào
      if (fresh || !hasProgress) setTimeout(() => this.openShopNameDialog(() => this.openWelcomeDialog()), 250);
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

  // Đặt tên quán khi mở tiệm mới (đổi lại được trong Cài đặt)
  private openShopNameDialog(onDone: () => void) {
    const current = stateManager.getState().shopName;
    this.openModal(`
      <div class="shop-name-dialog" style="text-align: center; padding: 6px 4px;">
        <div style="font-size: 2.6rem;">🏷️</div>
        <h2 style="margin: 4px 0 6px; font-size: 1.35rem; color: var(--ink); font-weight: 800;">Đặt tên cho quán của bạn</h2>
        <p style="margin: 0 0 12px; color: var(--soft); font-size: 0.85rem;">Tên này sẽ in trên biển hiệu, header và thẻ review chia sẻ.</p>
        <input id="input-new-shop-name" type="text" maxlength="${SHOP_NAME_MAX}" value="${escapeHtml(current)}" autocomplete="off"
          style="width: 100%; box-sizing: border-box; border: 2px solid var(--line); background: var(--bg); border-radius: 12px; padding: 12px; font-weight: 800; font-size: 16px; color: var(--ink); text-align: center;" />
        <div class="shop-name-suggestions" style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 10px 0 14px;">
          ${SHOP_NAME_SUGGESTIONS.map(n => `<button class="btn-sm shop-name-chip" data-name="${escapeHtml(n)}" style="min-height: 36px;">${escapeHtml(n)}</button>`).join('')}
        </div>
        <button id="btn-confirm-shop-name" class="btn-big-open" style="width: 100%; min-height: 52px;">🍗 Treo biển &amp; mở tiệm</button>
      </div>
    `);
    const input = document.getElementById('input-new-shop-name') as HTMLInputElement | null;
    document.querySelectorAll<HTMLElement>('.shop-name-chip').forEach(chip => {
      chip.onclick = () => { if (input) input.value = chip.dataset.name ?? ''; audio.playPop(); };
    });
    const confirm = () => {
      const name = normalizeShopName(input?.value ?? '');
      stateManager.update(draft => { draft.shopName = name; });
      stateManager.flush();
      audio.playCash();
      this.closeModal();
      this.showToast(`Biển hiệu "${name}" đã được treo! 🎉`);
      onDone();
    };
    const btn = document.getElementById('btn-confirm-shop-name');
    if (btn) btn.onclick = confirm;
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
  }

  private openWelcomeDialog() {
    const welcomeHtml = `
      <div style="text-align: center; padding: 6px 4px;">
        <img src="${ASSETS.gabong.front}" alt="Gà Bông" width="120" height="120" style="display: block; margin: 0 auto 6px;" />
        <h2 style="margin: 0 0 6px; font-size: 1.5rem; color: var(--ink); font-weight: 800;">Chào mừng tới ${escapeHtml(stateManager.getState().shopName)}!</h2>
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

  public triggerDrinkPourAnimation(drinkType: DrinkId) {
    const stage = document.getElementById('fountain-pour-stage');
    const label = document.getElementById('glass-cup-label');
    const fill = document.getElementById('cup-liquid-fill');
    if (!stage || !fill) return;

    stage.classList.remove('is-pouring', 'flavor-soda', 'flavor-seven_up', 'flavor-fanta_orange');
    void stage.offsetWidth; // trigger reflow
    stage.classList.add('is-pouring', `flavor-${drinkType}`);

    const nameMap: Record<DrinkId, string> = {
      soda: '🔴 Coca-Cola',
      seven_up: '🟢 7Up Chanh',
      fanta_orange: '🟠 Fanta Cam',
      peach_tea: '🍑 Trà Đào',
      sundae_icecream: '🍨 Kem Sundae'
    };

    if (label) {
      label.textContent = `Đang rót ${nameMap[drinkType] || 'nước'}...`;
    }

    setTimeout(() => {
      if (label) label.textContent = `✨ Đầy cốc ${nameMap[drinkType] || ''}!`;
      setTimeout(() => {
        if (stage) stage.classList.remove('is-pouring');
        if (label) label.textContent = '💧 Chạm vòi để rót';
      }, 500);
    }, 450);
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
    // Ca bán bị dừng vì sự cố: đóng modal bằng bất kỳ đường nào cũng phải cho ca chạy lại
    if (this.incidentPausedSelling && this.sellingSession) {
      this.sellingSession.isPaused = false;
      this.lastTimestamp = performance.now();
    }
    this.incidentPausedSelling = false;
    const next = this.modalQueue.shift();
    if (next) setTimeout(() => this.whenModalFree(next), 250);
  }

  // Sự cố không được đè lên hộp thoại đang mở (lên chương, thư Thỏ Cam, truyện): xếp hàng chờ đóng
  private modalQueue: Array<() => void> = [];
  private incidentPausedSelling = false;
  private isModalOpen(): boolean {
    const overlay = document.getElementById('modal-container');
    return !!overlay && !overlay.hasAttribute('hidden');
  }
  private whenModalFree(open: () => void) {
    if (this.isModalOpen()) this.modalQueue.push(open);
    else open();
  }

  public openDailyIncidentDialog(incident: DailyIncident, onDone?: () => void) {
    const state = stateManager.getState();
    const wasSelling = state.phase === 'selling' && !!this.sellingSession;
    if (wasSelling && this.sellingSession) {
      this.sellingSession.isPaused = true;
      this.incidentPausedSelling = true;
    }
    babble(incident.dialogue, 'guest');
    const promptHtml = renderIncidentPrompt(incident, state);
    this.openModal(promptHtml);

    document.querySelectorAll<HTMLButtonElement>('.incident-choice-btn').forEach(btn => {
      btn.onclick = () => {
        const choiceId = btn.dataset.choiceId;
        const choice = incident.choices.find(c => c.id === choiceId);
        if (!choice) return;

        let result: ReturnType<typeof resolveIncidentChoice> | undefined;
        stateManager.update(draft => {
          result = resolveIncidentChoice(draft, incident, choice);
        });

        if (!result) return;

        if (result.succeeded) {
          audio.playCash();
        } else {
          audio.playPop();
        }

        const reactionHtml = renderIncidentReaction(
          result.reactionTitle,
          result.reactionNarrative,
          result.succeeded,
          result.moneyDelta
        );
        this.openModal(reactionHtml);

        const continueBtn = document.getElementById('btn-incident-continue');
        if (continueBtn) {
          continueBtn.onclick = () => {
            audio.playPop();
            this.closeModal();
            if (wasSelling && this.sellingSession) {
              this.sellingSession.isPaused = false;
              this.lastTimestamp = performance.now();
            }
            this.render();
            if (onDone) onDone();
          };
        }
      };
    });
  }

  public openIncidentsAlbumDialog() {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderIncidentAlbumModal(state);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-incidents-album');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
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
        patchSellingView(mainViewEl, this.sellingSession, state);
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

    const openIncidentsBtn = document.getElementById('btn-open-incidents');
    if (openIncidentsBtn) {
      openIncidentsBtn.onclick = () => {
        this.openIncidentsAlbumDialog();
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
  private lastShiftSnapshotAt = 0;
  private tutorial: TutorialState | null = null; // Bác Ba dẫn ca đầu

  // Tính bước hướng dẫn từ trạng thái ca bán, vẽ bong bóng. Bước 'done' → đồng hồ chạy lại ngay.
  private updateTutorial(session: SellingSession) {
    if (!this.tutorial) return;
    const step = tutorialStep(this.tutorial, session, cookingEngine.getCookState(), cookingEngine.getTray());
    session.tutorial = step !== 'done';
    syncTutorialLayer(tutorialHint(step), {
      onButton: () => {
        if (step === 'intro' && this.tutorial) this.tutorial.introSeen = true;
        else this.endTutorial();
      },
      onSkip: () => this.endTutorial()
    });
  }

  private endTutorial() {
    this.tutorial = null;
    if (this.sellingSession) this.sellingSession.tutorial = false;
    syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
    stateManager.update(draft => { draft.tutorialDone = true; });
  }
  private timerAlerted = new Set<TimerStationId>();

  // Lưu ca bán dở vào save. `immediate`: ghi ngay (trang sắp ẩn/đóng, bộ đếm lưu có thể không kịp chạy)
  private snapshotShift(immediate = true) {
    const session = this.sellingSession;
    const state = stateManager.getState();
    if (!session || state.phase !== 'selling' || session.gameHour >= CLOSE_HOUR) return;
    this.lastShiftSnapshotAt = performance.now();
    const shift: ShiftSnapshot = JSON.parse(JSON.stringify({
      day: state.day,
      session,
      cooking: cookingEngine.snapshot(),
      expectedCustomers: this.expectedCustomers,
      bunnyVisited: this.customerSource?.bunnyVisited() ?? true
    }));
    stateManager.update(draft => { draft.pausedShift = shift; });
    if (immediate) stateManager.flush();
  }

  // Tiếp tục ca bán dở đúng chỗ đã dừng (giờ, hàng khách, khay, chảo)
  private resumeShift() {
    const state = stateManager.getState();
    const shift = state.pausedShift;
    if (!shift) return;
    this.stopSellingPhase();
    this.sellingStructureKey = '';
    this.sellingSession = shift.session;
    this.sellingSession.isPaused = false;
    this.tutorial = shift.session.tutorial ? { introSeen: true, servedAtStart: shift.session.servedCount } : null;
    this.expectedCustomers = shift.expectedCustomers;
    this.customerSource = createCustomerSource(state, this.currentEvent, shift.bunnyVisited);
    cookingEngine.setFryRampBonus(upgradeEffects(state.upgrades).fryRampPct);
    cookingEngine.setTraySize(traySizeFor(state));
    cookingEngine.restore(shift.cooking);
    document.body.classList.add('selling-mode');
    music.setMode('selling');
    music.start('selling');
    const h = Math.floor(shift.session.gameHour);
    const m = Math.floor((shift.session.gameHour - h) * 60);
    this.showToast(`⏯️ Tiếp tục ca bán lúc ${h}:${String(m).padStart(2, '0')} — khách vẫn đang chờ!`);
    this.lastTimestamp = performance.now();
    this.render();
    this.loopSelling(performance.now());
  }

  private startSellingPhase() {
    this.stopSellingPhase(); // đảm bảo không bao giờ có 2 vòng requestAnimationFrame song song
    this.sellingStructureKey = '';
    this.sellingSession = createSellingSession();
    cookingEngine.setFryRampBonus(upgradeEffects(stateManager.getState().upgrades).fryRampPct);
    cookingEngine.clearTray();
    const state = stateManager.getState();
    cookingEngine.setTraySize(traySizeFor(state));
    this.customerSource = createCustomerSource(state, this.currentEvent);
    this.sellingSession.orders.push(...this.customerSource.opening());
    if (shouldRunTutorial(state)) {
      this.tutorial = { introSeen: false, servedAtStart: 0 };
      this.sellingSession.tutorial = true;
    }

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
    syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audio.stopSizzle();
  }

  private loopSelling(currentTimestamp: number) {
    const session = this.sellingSession;
    if (!session || stateManager.getState().phase !== 'selling') return;

    // Đang đọc hộp thoại (thư Thỏ Cam, sự cố, khách bí ẩn…) → ca bán đứng yên, khách không mất kiên nhẫn sau lưng
    const gameDt = this.isModalOpen() ? 0 : gameDeltaMs(session, currentTimestamp - this.lastTimestamp);
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

    // Nhân viên: phụ bếp tự chiên, phục vụ tự lên món (luật ở core/staff.ts)
    this.tickStaff(session, gameDt);

    // Nồi mì / lò bánh vừa chín → chuông báo một lần (đang canh chảo dễ quên)
    for (const id of Object.keys(TIMER_RECIPES) as TimerStationId[]) {
      const ready = timerPhase(TIMER_RECIPES[id], session.timers[id]) === 'ready';
      if (ready && !this.timerAlerted.has(id)) {
        this.timerAlerted.add(id);
        audio.playPerfect();
        this.showToast(`${TIMER_RECIPES[id].icon} ${TIMER_RECIPES[id].name} chín rồi, lấy ra ngay kẻo hỏng!`);
      } else if (!ready) {
        this.timerAlerted.delete(id);
      }
    }

    this.render();
    this.updateTutorial(session); // sau render: viền sáng gắn vào nút vừa dựng
    // Hiệu ứng "đã tay" do core ghi lại (tiền vào, chuỗi Perfect, khách bỏ về): vẽ đúng một lần
    const fx = drainFx(session);
    if (fx.length) {
      renderFx(fx);
      if (fx.some(f => f.kind === 'cash' || f.kind === 'streak')) this.haptic(12);
    }
    if (currentTimestamp - this.lastShiftSnapshotAt > 5000) this.snapshotShift(false);

    // Sự kiện 2 trong ngày: Tình huống bất ngờ giữa ca bán (giờ cao điểm, không bật lúc đang có tutorial)
    if (!session.tutorial && !session.midIncidentTriggered && session.gameHour >= 14.5 && (stateManager.getState().todayIncidentsCount ?? 0) < 2) {
      session.midIncidentTriggered = true;
      const shiftIncident = pickDailyIncident(stateManager.getState(), 'shift');
      if (shiftIncident) {
        // Đang có hộp thoại khác → chờ; tới lượt mà ca đã hết thì bỏ qua
        this.whenModalFree(() => {
          if (stateManager.getState().phase === 'selling' && this.sellingSession) this.openDailyIncidentDialog(shiftIncident);
        });
      }
    }

    if (dayOver) {
      this.finishDay();
      return;
    }
    this.animFrameId = requestAnimationFrame((ts) => this.loopSelling(ts));
  }

  private tickStaff(session: SellingSession, gameDt: number) {
    const state = stateManager.getState();
    const eff = staffEffects(state.staff, session.gameHour, state.upgrades);
    if (!hasAutoWork(eff) || gameDt <= 0) return;
    const cook = cookingEngine.getCookState();
    const playerFrying = cook.isFrying ? fryingItemId(cook.fryingType, cookingEngine.getActiveSeasoning()) : null;
    const events = tickStaff(session, cookingEngine.getTray(), gameDt, eff, playerFrying, {
      // hết hàng thì khỏi mở stateManager.update mỗi frame
      use: ids => ids.every(id => (state.inventory[id]?.amount ?? 0) >= 1) && this.useIngredients([...ids]),
      place: item => cookingEngine.addToTray(item),
      pour: drink => {
        if ((state.inventory[DRINK_RECIPES[drink].stock]?.amount ?? 0) < 1) return false;
        let r = 'locked' as StationResult;
        stateManager.update(draft => { r = makeDrink(draft, session, cookingEngine, drink); });
        return r === 'ok';
      },
      scoop: side => {
        let r = 'locked' as StationResult;
        stateManager.update(draft => { r = scoopSide(draft, session, cookingEngine, side); });
        return r === 'ok';
      },
      traySize: cookingEngine.getTraySize()
    });
    for (const ev of events) {
      switch (ev.type) {
        case 'helperDone':
          stateManager.update(draft => recordHelperFry(draft, session, ev.item.quality));
          if (ev.item.quality === 'burnt') this.showToast(`😅 ${ev.cook} lỡ tay chiên cháy ${ev.item.name}!`);
          break;
        case 'autoServe':
          this.serveCurrentCustomer();
          break;
        default:
          assertNever(ev);
      }
    }
  }

  // Rung nhẹ trên máy có Vibration API (Android). iPhone Safari không có API này → chỉ còn âm thanh.
  private haptic(ms: number) {
    if (!stateManager.getState().soundEnabled) return;
    try { navigator.vibrate?.(ms); } catch { /* một số trình duyệt ném lỗi khi chưa có thao tác người dùng */ }
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
    if (result.quality === 'perfect') {
      Haptics.perfect();
    } else if (result.quality === 'burnt') {
      Haptics.warning();
    } else {
      Haptics.tap();
    }
  }

  // Mọi click trong màn bán hàng đi qua đây (một listener gắn một lần trên #main-view).
  // Đọc state tại thời điểm bấm, không dùng state bắt trong closure lúc render.
  private handleSellingClick(target: Element) {
    if (!this.sellingSession) return;

    const trayEl = target.closest<HTMLElement>('.tray-item');
    if (trayEl) {
      Haptics.tap();
      cookingEngine.removeFromTray(parseInt(trayEl.dataset.trayIdx ?? '0', 10));
      this.showToast('Đã dọn dẹp khay!');
      this.render();
      return;
    }

    const lockedPan = target.closest<HTMLElement>('[data-prep-lock]');
    if (lockedPan) {
      Haptics.tap();
      const root = document.getElementById('main-view');
      if (root) showPrepPopover(root, lockedPan.dataset.prepLock ?? '', stateManager.getState());
      return;
    }

    const bunnyCard = target.closest<HTMLElement>('.customer-card[data-is-bunny="true"]');
    if (bunnyCard) {
      Haptics.tap();
      const letter = BUNNY_LETTERS.find(l => l.id === bunnyCard.dataset.letterId);
      if (letter) this.openBunnyLetterDialog(letter);
      else this.openBunnyGreetingDialog();
      return;
    }

    const button = target.closest<HTMLElement>('[id]');
    const action = button?.id.replace(/^btn-/, '');
    if (!button || button.hasAttribute('disabled')) return;
    Haptics.tap();
    const station = parseStationAction(action);
    if (station) {
      this.runStationAction(station);
      return;
    }
    if (!isSellingAction(action)) return;
    this.runSellingAction(action);
  }

  private runStationAction(action: StationAction) {
    const session = this.sellingSession;
    if (!session) return;
    let result = 'locked' as StationResult; // gán trong callback của update()
    stateManager.update(draft => {
      if (action.kind === 'timer') {
        result = session.timers[action.id] === null
          ? startTimerStation(draft, session, action.id)
          : pullTimerStation(session, cookingEngine, action.id);
      } else if (action.kind === 'assemble') {
        result = assembleAtCounter(draft, session, cookingEngine, action.id);
      } else if (action.kind === 'scoop') {
        result = scoopSide(draft, session, cookingEngine, action.id);
      } else {
        result = makeDrink(draft, session, cookingEngine, action.id);
      }
    });
    const messages: Record<StationResult, string> = {
      ok: '',
      locked: 'Trạm này chưa mở (cần tới chương hoặc ký hợp đồng nguyên liệu).',
      'no-stock': 'Hết nguyên liệu cho món này! Vào Kho hàng để nhập thêm.',
      busy: 'Trạm đang bận nấu.',
      'tray-full': 'Khay đầy rồi, giao bớt món trước đã!',
      'not-ready': 'Chưa chín, đợi thêm chút nhé!',
      'no-base': 'Cần có gà chiên phù hợp trong khay để ráp món này.'
    };
    if (result === 'ok') audio.playPop();
    else this.showToast(messages[result]);
    this.render();
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
      case 'fry-fries':
      case 'fry-popcorn':
      case 'fry-thigh':
      case 'fry-cheese': {
        const itemId = FRY_ACTION_ITEM[action];
        const recipe = FRY_RECIPES[itemId];
        if (!recipe || cookingEngine.getCookState().isFrying) return;
        const pan = PREP_LAYOUT.find(p => p.action === action);
        const lock = pan ? prepLock(stateManager.getState(), pan) : undefined;
        if (lock) {
          this.showToast(`🔒 ${lock.hint}`);
          return;
        }
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients([...recipe.stock])) {
          this.showToast(`Hết nguyên liệu cho ${FRY_LOOK[itemId]?.name ?? 'món này'}! Vào Kho hàng để nhập thêm.`);
          return;
        }
        session.totalFriedCount += 1;
        cookingEngine.startFrying(recipe.type);
        break;
      }

      case 'add-drink': {
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(['soft_drink'])) {
          this.showToast('Hết nước ngọt trong kho!');
          return;
        }
        // Rót loại nước khách đầu hàng còn THIẾU (tính cả ly đã có trong khay). Trước đây thấy khách gọi 7Up là
        // rót 7Up mãi, kể cả khi khay đã có → khách gọi Coca + 7Up không bao giờ đủ, Bác Ba kẹt ở bước rót nước.
        const frontOrder = session.orders[0];
        const missingDrink = frontOrder ? missingItems(frontOrder, cookingEngine.getTray()).find(isDrinkId) : undefined;
        const drinkType: DrinkId = missingDrink ?? 'soda';
        cookingEngine.addDrink(drinkType);
        this.triggerDrinkPourAnimation(drinkType);
        audio.playPop();
        break;
      }

      case 'pour-coca': {
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(['soft_drink'])) {
          this.showToast('Hết nước ngọt trong kho!');
          return;
        }
        cookingEngine.addDrink('soda');
        this.triggerDrinkPourAnimation('soda');
        audio.playPop();
        this.showToast('🥤 Đang rót đầy ly Coca sủi bọt caramel mát lạnh!');
        break;
      }

      case 'pour-7up': {
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(['soft_drink'])) {
          this.showToast('Hết nước ngọt trong kho!');
          return;
        }
        cookingEngine.addDrink('seven_up');
        this.triggerDrinkPourAnimation('seven_up');
        audio.playPop();
        this.showToast('🍋 Đang rót đầy ly 7Up Chanh đá sảng khoái!');
        break;
      }

      case 'pour-fanta': {
        if (cookingEngine.isTrayFull()) {
          this.showToast('Khay đầy rồi, giao bớt món trước đã!');
          return;
        }
        if (!this.useIngredients(['soft_drink'])) {
          this.showToast('Hết nước ngọt trong kho!');
          return;
        }
        cookingEngine.addDrink('fanta_orange');
        this.triggerDrinkPourAnimation('fanta_orange');
        audio.playPop();
        this.showToast('🍊 Đang rót đầy ly Fanta Cam bùng nổ sảng khoái!');
        break;
      }

      case 'squeeze-ketchup':
      case 'squeeze-chili': {
        const sauce = action === 'squeeze-ketchup' ? 'ketchup' : 'chili';
        const sauceName = sauce === 'ketchup' ? 'Tương Cà' : 'Tương Ớt';
        // Luật ở core/day.ts: ưu tiên món khách dặn đúng loại tương; chỉ món được dặn mới có tip
        const squeezed = squeezeCondiment(cookingEngine.getTray(), session.orders, sauce);
        if (!squeezed) {
          this.showToast(`Chưa có món chiên nào trong khay để xịt ${sauceName}!`);
          return;
        }
        audio.playPop();
        this.showToast(squeezed.requested
          ? `${sauce === 'ketchup' ? '🍅' : '🌶️'} Xịt ${sauceName} lên ${squeezed.item.name} đúng ý khách! (+tip)`
          : `${sauce === 'ketchup' ? '🍅' : '🌶️'} Đã xịt ${sauceName} lên ${squeezed.item.name} (khách không dặn, không có tip)`);
        break;
      }

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

      case 'change-oil': {
        let changed = false;
        stateManager.update(draft => { changed = changeOil(draft); });
        if (!changed) {
          this.showToast(`Không đủ ${OIL_CHANGE_COST.toLocaleString('vi-VN')}đ để thay dầu mới!`);
          return;
        }
        audio.playCash();
        this.showToast('Đã thay dầu chiên mới tinh vàng óng! Vệ sinh 5 sao! ✨');
        break;
      }

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
    if (action === 'add-drink' || action === 'pour-coca' || action === 'pour-7up' || action === 'pour-fanta') {
      const frontOrder = session.orders[0];
      const wants7Up = frontOrder?.items.some(it => it.menuItemId === 'seven_up' && !it.completed);
      const wantsFanta = frontOrder?.items.some(it => it.menuItemId === 'fanta_orange' && !it.completed);
      const drinkType: DrinkId = action === 'pour-7up' ? 'seven_up' : action === 'pour-fanta' ? 'fanta_orange' : (action === 'add-drink' ? (wants7Up ? 'seven_up' : wantsFanta ? 'fanta_orange' : 'soda') : 'soda');
      this.triggerDrinkPourAnimation(drinkType);
    }
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
        Haptics.warning();
        this.showToast('Khay đồ ăn đang trống, chưa có món để giao!');
        return;
      case 'raw-rejected':
        Haptics.warning();
        this.showToast('🤢 Gà còn sống, khách không nhận! Chiên lại mẻ khác nhé.');
        return;
      case 'no-match':
        Haptics.warning();
        this.showToast('Đồ ăn trong khay không khớp với món khách gọi!');
        return;
      case 'partial': {
        audio.playPop();
        Haptics.tap();
        const missingNames = (result.missingItemIds ?? [])
          .map(id => menu.find(m => m.id === id)?.name || id)
          .join(', ');
        this.showToast(`Đã nhận một phần! Khách đang đợi: ${missingNames || 'món còn lại'} ⏳`);
        this.render();
        return;
      }
      case 'complete':
        Haptics.serveSuccess();
        break;
      default:
        assertNever(result);
    }

    const { order, paid, tip, feedbackNotes } = result;
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
      const personalityTag = order.personalityLabel ? `[${order.personalityLabel}] ` : '';
      const notesStr = (feedbackNotes && feedbackNotes.length > 0)
        ? feedbackNotes.join(' · ')
        : (tip > 0 ? `+${(tip / 1000).toLocaleString('vi-VN')}k tip` : '0đ tip');
      this.showToast(`${personalityTag}+${(paid + tip).toLocaleString('vi-VN')}đ (${notesStr}) 💵`);
    }
    this.render();
  }

  // --- FINISH DAY & SUMMARY ---
  private finishDay() {
    if (this.tutorial) this.endTutorial();
    this.stopSellingPhase();
    this.lastShiftSnapshotAt = 0;
    stateManager.update(draft => { draft.pausedShift = null; });
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
        <p class="chapter-unlocked-prices">🏷️ Bảng giá mới: mọi món +${Math.round((CHAPTER_PRICE_STEP - 1) * 100)}% — mặt bằng mới, giá mới, khách vẫn thấy hợp lý.</p>
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
    this.bindWrappedButton();
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
          draft.todayIncidentsCount = 0;
        });
        this.pickDailyEvent();
        this.setPhase('prep');
        this.showToast(`Chào buổi sáng Ngày ${stateManager.getState().day}! Chuẩn bị hàng nào! ☀️`);

        // Kích hoạt Sự kiện 1 (Tình huống đầu ngày)
        setTimeout(() => {
          const morningIncident = pickDailyIncident(stateManager.getState(), 'morning');
          if (morningIncident) {
            this.whenModalFree(() => this.openDailyIncidentDialog(morningIncident));
          }
        }, 500);
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

        const outcome = await shareImage(blob, `TiemGaNhaTui_Review_Ngay_${state.day}.png`, 'Tiệm Gà Nhà Tui - Review Khách Hàng',
          `Khách vừa review tiệm gà của tui nè: "${review.comment}" ⭐ ${review.stars}/5 sao! Chơi ngay nha!`);
        if (outcome === 'downloaded') this.showToast('Đã tải ảnh thẻ review về máy! Hãy đăng lên Threads nhé! 📸');
      };
    }
  }

  // Gà Wrapped mỗi 7 ngày: vẽ thẻ tuần (core/wrapped.ts + ui/components/WrappedCard.ts), xem trước rồi chia sẻ
  private bindWrappedButton() {
    const btn = document.getElementById('btn-wrapped') as HTMLButtonElement | null;
    if (!btn) return;
    btn.onclick = async () => {
      const data = weeklyWrapped(stateManager.getState());
      if (!data) return;
      btn.disabled = true;
      this.showToast('Đang gói Gà Wrapped của tuần… 🎁');
      try {
        const canvas = await drawWrapped(data);
        const preview = document.getElementById('wrapped-preview');
        if (preview) preview.innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Gà Wrapped tuần ${data.week}" class="wrapped-preview-img" style="width: 100%; border-radius: 14px; margin-top: 10px;">`;
        const outcome = await shareWrapped(canvas, data);
        if (outcome === 'downloaded') this.showToast('Đã lưu ảnh Gà Wrapped về máy! 📸');
      } finally {
        btn.disabled = false;
      }
    };
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
        const name = input ? normalizeShopName(input.value) : '';
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

    // Sao lưu: xuất mã (và chép vào clipboard nếu được)
    const box = document.getElementById('save-code-box') as HTMLTextAreaElement | null;
    const exportBtn = document.getElementById('btn-export-save');
    if (exportBtn && box) {
      exportBtn.onclick = () => {
        this.snapshotShift();
        box.value = exportSaveCode(stateManager.getState());
        box.select();
        void navigator.clipboard?.writeText(box.value).then(
          () => this.showToast('Đã chép mã sao lưu! Dán vào Ghi chú/Zalo để giữ nhé 📋'),
          () => this.showToast('Hãy giữ lâu vào ô mã → Chọn tất cả → Sao chép.')
        );
      };
    }
    // Khôi phục: kiểm tra mã, hỏi xác nhận rồi thay toàn bộ tiến trình
    const importBtn = document.getElementById('btn-import-save');
    if (importBtn && box) {
      importBtn.onclick = () => {
        const result = importSaveCode(box.value);
        if (!result.ok) {
          this.showToast(`❌ ${result.reason}`);
          return;
        }
        const next = result.state;
        void this.confirmDialog(
          `Khôi phục <b>${escapeHtml(next.shopName)}</b> · Ngày ${next.day} · Chương ${next.currentChapter}? Tiến trình hiện tại trên máy này sẽ bị thay thế.${result.tampered ? '<br/><br/>⚠️ Mã đã bị chỉnh sửa: tiến trình sẽ bị đánh dấu.' : ''}`,
          'Khôi phục'
        ).then(ok => {
          if (!ok) return;
          this.stopSellingPhase();
          this.sellingSession = null;
          stateManager.replaceState(next);
          this.pickDailyEvent();
          this.setPhase('prep');
          this.showToast(`Đã khôi phục ${next.shopName} — Ngày ${next.day}! 🎉`);
        });
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
