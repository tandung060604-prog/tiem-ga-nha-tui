import { GameState, GamePhase, DayLedger, CustomerReview, StoryEndingId, CustomerOrder, DineInTable } from './types/game';
import { stateManager, createDefaultDineInTables } from './core/state';
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
import { openIntroCinematicModal } from './ui/components/IntroCinematicModal';
import { showPrepLoadingModal } from './ui/components/PrepLoadingModal';
import { openBacBaManualModal } from './ui/components/BacBaManualModal';
import { renderChalkboard } from './ui/components/Chalkboard';
import { openStardewMailboxModal } from './ui/components/StardewMailboxModal';
import { renderInventoryTab, bindInventoryEvents } from './ui/components/InventoryTab';
import { renderMemoryGalleryModal, bindMemoryGalleryEvents, GalleryTab } from './ui/components/MemoryGalleryModal';
import { renderUpgradesTab, bindUpgradesEvents } from './ui/components/UpgradesTab';
import { renderStaffTab, bindStaffEvents } from './ui/components/StaffTab';
import { renderReviewsTab, bindReviewsEvents } from './ui/components/ReviewsTab';
import { renderReviewReplyModal } from './ui/components/ReviewReplyModal';
import { ReviewsEngine } from './core/reviewsEngine';
import { renderMenuTab, bindMenuEvents } from './ui/components/MenuTab';
import { renderSellingView, patchSellingView, sellingStructureKey, renderFx } from './ui/components/SellingView';
import {
  SellingSession,
  createSellingSession,
  gameDeltaMs,
  tickSelling,
  drainFx,
  scrubDineInTable,
  stopScrubbingDineInTable,
  waiterCleanDineInTable
} from './core/sellingSim';
import { OPEN_HOUR, CLOSE_HOUR } from './core/clock';
import type { ShiftSnapshot } from './core/sellingSim';
import { DRINK_RECIPES, TIMER_RECIPES, timerPhase, TimerStationId, AssemblyId, DrinkId, isTimerStationId, isAssemblyId, isDrinkId, ScoopId, isScoopId } from './core/stations';
import { PREP_LAYOUT, prepLock } from './core/prepStation';
import { showPrepPopover } from './ui/components/PrepStation';
import { staffEffects, tickStaff, fryingItemId, traySizeFor, hasAutoWork, missingItems, FRY_RECIPES, FRY_LOOK } from './core/staff';
import {
  TutorialState, tutorialStep, tutorialHint, shouldRunTutorial, BAC_BA_GAME_TIPS,
  shouldRunPrepTutorial, prepTutorialHint, PREP_TUTORIAL_STEPS, PrepTutorialStep,
  checkDailyFeatureUnlockGuide
} from './core/tutorial';
import { syncTutorialLayer } from './ui/components/TutorialLayer';
import { weeklyWrapped } from './core/wrapped';
import { drawWrapped, shareWrapped, shareImage } from './ui/components/WrappedCard';
import { addStock } from './core/inventory';

import { squeezeCondiment, recordHelperFry, StationResult, scoopSide, changeOil, OIL_CHANGE_COST, startTimerStation, pullTimerStation, assembleAtCounter, makeDrink, creditSale, requestBaBaAid, eventForDay, createCustomerSource, useIngredients, recordFryerLift, checkPoliceOilInspection, PoliceInspectionResult, SAUCE_STOCK, serveFirstOrder, cancelAndApologizeOrder, applyBunnyReward, closeDay, DayResult, INSPECTION_FINE, BUNNY_VISIT_TIP, payWeeklyRent, applyGangsterThreat } from './core/day';
import { upgradeEffects } from './core/upgrades';
import { renderSummaryModal } from './ui/components/SummaryModal';
import { renderSettingsModal } from './ui/components/SettingsModal';
import { renderKitchenGuideModal } from './ui/components/KitchenGuideModal';
import { renderTesterFeedbackModal } from './ui/components/TesterFeedbackModal';
import { renderWeeklyQuestsModal } from './ui/components/WeeklyQuestsModal';
import { renderUpdateDashboardModal } from './ui/components/UpdateDashboardModal';
import { renderStoryModal, bindStoryEvents, revealedStory } from './ui/components/StoryModal';
import { renderBunnyLetterModal, renderBunnyAlbumModal, bindBunnyModalEvents } from './ui/components/BunnyModal';
import { renderEndingModal, bindEndingEvents } from './ui/components/EndingModal';
import { evaluateEnding } from './content/endings';
import { bacBaVoice, BacBaVoiceContext } from './core/bacBaVoice';
import { BUNNY_LETTERS, BunnyLetter, MysteryBunnyEngine } from './content/mysteryBunny';
import { ShareCardEngine } from './ui/components/ShareCard';
import { ASSETS } from './content/assets';
import { pickDailyIncident, resolveIncidentChoice } from './core/dailyIncidentsEngine';
import { DAILY_INCIDENTS } from './content/dailyIncidents';
import { renderSocialShareModal } from './ui/components/SocialShareModal';
import { NIGHT_STORYLETS } from './content/storylets';
import { pickNightStorylet, applyStoryletChoice } from './core/storyletEngine';
import { getInviteUrl } from './core/leaderboard';
import { Storylet } from './types/game';
import { renderIncidentPrompt, renderIncidentConfirmPrompt, renderIncidentReaction, renderIncidentAlbumModal } from './ui/components/DailyIncidentModal';
import { openSecretSauceModal } from './ui/components/SecretSauceModal';
import { openOilFilterModal } from './ui/components/OilFilterModal';
import { getTodayWholesaler, executeBargain, BargainTactic } from './core/marketBargain';
import { renderMarketBargainModal } from './ui/components/MarketBargainModal';
import { DeliveryRunnerEngine, DeliveryRunState } from './core/deliveryRunner';
import { renderDeliveryPromptModal, renderDeliveryRunnerGame, renderDeliveryResultModal } from './ui/components/DeliveryRunnerModal';
import { recordCustomerLoyaltyVisit, ensureLoyaltyState, HEART_LEVEL_TITLES } from './core/loyaltyEngine';
import { openLoyaltyHandbookModal } from './ui/components/LoyaltyHandbookModal';
import {
  syncToLeaderboard,
  fetchLeaderboard,
  removeFromLeaderboard,
  getCurrentRoomId,
  setCurrentRoomId,
  generateRoomId
} from './core/leaderboard';
import { renderLeaderboardModal, renderLobbySlotsHtml, renderSendCarePackageDialog } from './ui/components/LeaderboardModal';
import { sendCarePackage, fetchPendingCarePackages, claimCarePackage } from './core/carePackage';
import { recordWeeklyQuestProgress, claimWeeklyQuestReward, ensureWeeklyQuests } from './core/weeklyQuests';
import { renderMemoriesAlbumModal, MemoriesTabId } from './ui/components/MemoriesAlbumModal';
import { downloadLobbyPoster } from './core/canvasPoster';
import {
  scheduleThiefEvents,
  createThiefEncounter,
  checkSecurityStaff,
  resolveThiefCaught,
  resolveThiefEscaped
} from './core/thiefSystem';
import {
  renderThiefMinigameModal,
  renderThiefCaughtModal,
  renderThiefEscapedModal
} from './ui/components/ThiefMinigameModal';
import {
  getNextAvailableCharacterEpisode,
  resolveCharacterChoice
} from './core/characterNarrativeEngine';
import {
  renderCharacterEpisodeModal,
  renderCharacterEpisodeReactionModal,
  bindCharacterEpisodeTypewriter,
  bindReactionEpisodeTypewriter
} from './ui/components/CharacterStoryModal';
import { renderStoryletModal, bindStoryletTypewriter } from './ui/components/StoryletModal';
import { renderNightRadioModal } from './ui/components/NightRadioModal';
import { getTonightRadioBroadcast, activateRadioBroadcastBuff } from './content/nightRadio';
import { getUnlockedCurios } from './content/curiosAndRelics';
import { getUnlockedSignatureDishes } from './content/signatureStoryDishes';
import {
  petThePet,
  upgradePetPatio,
  checkDogGuardBonus
} from './core/petPatioSystem';
import { renderPetPatioModal } from './ui/components/PetPatioComponent';
import { renderAchievementsWallModal } from './ui/components/AchievementsWallModal';
import { claimBadgeReward } from './core/achievementsEngine';
import { renderShopThemeModal } from './ui/components/ShopThemeModal';
import { unlockShopTheme, setActiveShopTheme, getActiveShopTheme } from './content/shopThemes';
import { renderEndlessModeModal } from './ui/components/EndlessModeModal';
import { canEnterEndlessMode } from './core/endlessMode';
import type { DailyIncident, DeliveryRunResult, CarePackageType, ThiefEncounter, CharacterEpisode } from './types/game';
import confetti from 'canvas-confetti';

type TabId = 'inventory' | 'upgrades' | 'staff' | 'reviews' | 'menu';

/**
 * Cập nhật màu sắc thanh trạng thái trình duyệt (Status Bar / Chrome) trên di động
 * Đảm bảo 100% không bao giờ xuất hiện viền trắng đối lập, đạt chuẩn tràn viền edge-to-edge
 */
export function updateThemeColor(color: string) {
  try {
    const metaList = document.querySelectorAll('meta[name="theme-color"]');
    if (metaList.length > 0) {
      metaList.forEach(m => ((m as HTMLMetaElement).content = color));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  } catch {}
}

const SELLING_ACTIONS = [
  'toggle-fast', 'fry-chicken', 'fry-fries', 'fry-popcorn', 'fry-thigh', 'fry-cheese',
  'add-drink', 'pour-coca', 'pour-7up', 'pour-fanta',
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
  private shownBacBaTipsThisSession = new Set<string>();
  private prepTutorialStep: PrepTutorialStep | null = null;
  private isNewShopFlow = false;
  private leaderboardPollTimer: number | null = null;
  private lastLobbyEntriesCount: number = 0;
  private memoriesActiveTab: MemoriesTabId = 'residents';
  private memoriesFilter: string = 'all';
  private thiefAnimId: number | null = null;
  private toastQueue: string[] = [];
  private isToastActive = false;
  private toastTimer: number | null = null;
  private scrubbingTableIndex: number | null = null;
  private scrubIntervalId: number | null = null;
  private lastScrubPos: { x: number; y: number } = { x: 0, y: 0 };
  private lastSummaryData: { ledger: DayLedger; review: CustomerReview; advisorTip: string; rentDue?: DayResult['rentDue'] } | null = null;

  constructor() {
    if (import.meta.env?.DEV) {
      (window as any).__app = this;
      (window as any).__stateManager = stateManager;
    }
    this.init();
  }

  private init() {
    // Kiểm tra tham số room từ liên kết mời hoặc mã QR
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room') || urlParams.get('lobby');
      if (roomParam) {
        const cleanRoom = roomParam.trim().toUpperCase();
        if (cleanRoom) {
          setCurrentRoomId(cleanRoom);
          const st = stateManager.getState();
          st.roomId = cleanRoom;
          stateManager.saveState();
          setTimeout(() => {
            this.showToast(`🍗 Bạn đã tham gia Phòng Đua Top: ${cleanRoom}!`);
          }, 1200);
        }
      }
    } catch {}

    // Có ca bán dở (thoát app giữa ca) thì giữ nguyên, tiếp tục sau khi chạm "Chơi tiếp" ở màn tiêu đề

    // Pick today's random event based on day
    this.pickDailyEvent();

    const mainViewEl = document.getElementById('main-view');
    if (mainViewEl) {
      mainViewEl.addEventListener('click', e => {
        if (stateManager.getState().phase === 'selling' && e.target instanceof Element) {
          this.handleSellingClick(e.target);
        }
      });

      // Thao tác cọ xát / chà tay lên bàn ăn hiên quán (3-4s sạch bóng)
      mainViewEl.addEventListener('pointerdown', e => {
        if (stateManager.getState().phase !== 'selling' || !(e.target instanceof Element)) return;
        const cleanTableBtn = e.target.closest<HTMLElement>('.btn-clean-table, .patio-table.dirty');
        if (!cleanTableBtn) return;
        const idxStr = cleanTableBtn.dataset.tableIdx ?? cleanTableBtn.getAttribute('data-table-idx');
        if (idxStr !== null && idxStr !== undefined) {
          this.startScrubbingPatioTable(Number(idxStr), e.clientX, e.clientY);
        }
      });

      mainViewEl.addEventListener('pointermove', e => {
        if (this.scrubbingTableIndex === null) return;
        this.onPointerMoveScrub(e.clientX, e.clientY);
      });

      const stopScrub = () => {
        if (this.scrubbingTableIndex !== null) {
          this.stopScrubbingPatioTable();
        }
      };
      mainViewEl.addEventListener('pointerup', stopScrub);
      mainViewEl.addEventListener('pointercancel', stopScrub);
      window.addEventListener('pointerup', stopScrub);
    }

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

    updateThemeColor('#000000');
    openIntroCinematicModal({
      forceShow: true,
      onComplete: () => {
        this.showTitleScreen();
      }
    });
  }

  private titleDismissed = false;

  private showTitleScreen() {
    updateThemeColor('#1a0c06');
    const state = stateManager.getState();
    const hasProgress = state.day > 1 || state.dayHistory.length > 0 || !!state.pausedShift;
    document.getElementById('title-screen')?.remove();
    document.body.insertAdjacentHTML('beforeend', renderTitleScreen(state, hasProgress, music.isEnabled()));
    bindTitleScreenInteractions();

    const start = (fresh: boolean) => {
      // Vào game trước, âm thanh sau: máy không có Web Audio cũng không bị kẹt ở màn tiêu đề
      updateThemeColor('#5a3018');
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
      // Tiệm mới: chủ tiệm tự đặt tên quán trước, rồi mới tới lời chào mừng, rồi mới tới hướng dẫn
      if (fresh || !hasProgress) {
        this.isNewShopFlow = true;
        this.render();
        setTimeout(() => this.openShopNameDialog(() => this.openWelcomeDialog()), 150);
      } else {
        this.render();
      }
    };

    document.getElementById('btn-title-play')!.onclick = () => start(false);
    const newBtn = document.getElementById('btn-title-new');
    if (newBtn) newBtn.onclick = () => {
      music.unlock();
      document.getElementById('title-screen')?.remove();
      void this.confirmDialog('Xóa tiến độ hiện tại và mở tiệm lại từ Ngày 1?', 'Chơi mới').then(ok => {
        if (!ok) { this.showTitleScreen(); return; }
        const oldUserId = stateManager.getState().userId;
        if (oldUserId) {
          void removeFromLeaderboard(oldUserId);
        }
        stateManager.resetGame();
        this.pickDailyEvent();
        this.render();
        start(true);
      });
    };

    const leaderboardBtn = document.getElementById('btn-title-leaderboard');
    if (leaderboardBtn) {
      leaderboardBtn.onclick = (e) => {
        e.stopPropagation();
        void this.openLeaderboard();
      };
    }

    const musicBtn = document.getElementById('btn-title-music')!;
    musicBtn.onclick = () => {
      music.unlock();
      const on = !music.isEnabled();
      music.setEnabled(on);
      if (on && !this.titleDismissed) {
        music.start('title');
      }
      const iconSpan = musicBtn.querySelector('.control-icon');
      const textSpan = musicBtn.querySelector('.control-text');
      if (iconSpan && textSpan) {
        iconSpan.textContent = on ? '🎵' : '🔇';
        textSpan.textContent = on ? 'Nhạc nền: Bật' : 'Nhạc nền: Tắt';
      } else {
        musicBtn.textContent = on ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt';
      }
    };

    const changelogBtn = document.getElementById('btn-title-changelog');
    if (changelogBtn) {
      changelogBtn.onclick = (e) => {
        e.stopPropagation();
        this.openUpdateDashboardModal();
      };
    }


    const bacbaManualBtn = document.getElementById('btn-title-bacba-manual');
    if (bacbaManualBtn) {
      bacbaManualBtn.onclick = (e) => {
        e.stopPropagation();
        openBacBaManualModal();
      };
    }

    const screenEl = document.getElementById('title-screen');
    const onFirstUserTap = () => {
      music.unlock();
      void bacBaVoice.preload();
      if (music.isEnabled() && !this.titleDismissed) {
        music.start('title');
      }
      screenEl?.removeEventListener('pointerdown', onFirstUserTap);
    };
    screenEl?.addEventListener('pointerdown', onFirstUserTap, { passive: true });
  }

  // Mở Bảng tin / Dashboard Cập nhật phiên bản v2.1.0
  public openUpdateDashboardModal() {
    audio.playPop();
    const html = renderUpdateDashboardModal();
    this.openModal(html);
    const modalContent = document.getElementById('modal-content');
    if (modalContent) modalContent.classList.add('is-dashboard');

    const closeTop = document.getElementById('btn-close-dashboard-top');
    const closeCta = document.getElementById('btn-close-dashboard-cta');
    const closeHandler = () => {
      audio.playPop();
      if (modalContent) modalContent.classList.remove('is-dashboard');
      this.closeModal();
    };
    if (closeTop) closeTop.onclick = closeHandler;
    if (closeCta) closeCta.onclick = closeHandler;
  }

  // Đặt tên quán khi mở tiệm mới (đổi lại được trong Cài đặt)
  private openShopNameDialog(onDone: () => void) {
    const current = stateManager.getState().shopName;
    this.openModal(`
      <div class="onboarding-card shop-name-dialog">
        <div class="onboarding-kicker">
          <span>🏷️</span> BƯỚC 1: KHỞI NGHIỆP HẺM 1102
        </div>
        <h2 class="onboarding-title">Đặt Tên Cho Tiệm Gà Của Bạn</h2>
        <p class="onboarding-desc">Tên quán sẽ in trên biển hiệu gỗ, hóa đơn, ca bán và review của thực khách Sài Gòn.</p>
        
        <div class="onboarding-input-wrap">
          <input id="input-new-shop-name" class="onboarding-input" type="text" maxlength="${SHOP_NAME_MAX}" value="${escapeHtml(current)}" placeholder="Nhập tên quán của bạn..." autocomplete="off" />
        </div>

        <div class="onboarding-chips-box">
          <div class="onboarding-chips-label">💡 Gợi ý tên hay cho tiệm:</div>
          <div class="onboarding-chips-list">
            ${SHOP_NAME_SUGGESTIONS.map(n => `<button class="onboarding-chip-btn shop-name-chip" type="button" data-name="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('')}
          </div>
        </div>

        <button id="btn-confirm-shop-name" class="btn-title-hero onboarding-submit-btn" type="button" style="width: 100%; min-height: 50px;">
          <span class="hero-btn-content">
            <span class="hero-btn-icon">🍗</span>
            <span class="hero-btn-text">TREO BIỂN &amp; TIẾP TỤC ➡️</span>
          </span>
        </button>
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
      this.showToast(`Biển hiệu "${name}" đã được treo! 🎉`);
      // QUAN TRỌNG: Không gọi closeModal() giữa chừng để tránh rò rỉ kích hoạt nhầm tutorial.
      // Chuyển thẳng sang WelcomeDialog (onDone())!
      onDone();
    };
    const btn = document.getElementById('btn-confirm-shop-name');
    if (btn) btn.onclick = confirm;
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
  }

  private openWelcomeDialog() {
    const shopName = stateManager.getState().shopName;
    const welcomeHtml = `
      <div class="onboarding-card welcome-dialog">
        <div class="onboarding-kicker">
          <span>🎉</span> BƯỚC 2: KHAI TRƯƠNG HỒNG PHÁT
        </div>

        <div class="welcome-mascot-wrap">
          <img src="${ASSETS.gabong.front}" alt="Gà Bông" class="welcome-mascot-img pixel-art" />
        </div>

        <div class="welcome-shop-banner">
          <h2 class="welcome-shop-title">Chào mừng tới ${escapeHtml(shopName)}!</h2>
        </div>

        <div class="welcome-stat-grid">
          <div class="welcome-stat-card">
            <span class="welcome-stat-icon">💰</span>
            <span class="welcome-stat-label">VỐN BAN ĐẦU</span>
            <span class="welcome-stat-val val-green">850.000đ</span>
          </div>
          <div class="welcome-stat-card">
            <span class="welcome-stat-icon">🛵</span>
            <span class="welcome-stat-label">KHỞI ĐIỂM</span>
            <span class="welcome-stat-val">Xe Đẩy Hẻm</span>
          </div>
          <div class="welcome-stat-card">
            <span class="welcome-stat-icon">🏆</span>
            <span class="welcome-stat-label">MỤC TIÊU LỚN</span>
            <span class="welcome-stat-val val-gold">5.000.000đ</span>
          </div>
        </div>

        <div class="welcome-guide-box">
          <span class="welcome-guide-avatar">👴</span>
          <p class="welcome-guide-text">Bác Ba đang đứng đợi con ở quầy để chỉ dẫn cách chiên gà vàng giòn <b>Perfect</b> và chuẩn bị kho hàng Ngày 1 nè!</p>
        </div>

        <button id="btn-welcome-start" class="btn-title-hero onboarding-submit-btn" type="button" style="width: 100%; min-height: 52px;">
          <span class="hero-btn-content">
            <span class="hero-btn-icon">🍗</span>
            <span class="hero-btn-text">BẮT ĐẦU NGÀY 1 &amp; GẶP BÁC BA ➡️</span>
          </span>
        </button>
      </div>
    `;
    this.openModal(welcomeHtml);
    const startBtn = document.getElementById('btn-welcome-start');
    if (startBtn) {
      startBtn.onclick = () => {
        audio.playPerfect();
        this.isNewShopFlow = false; // Kết thúc chu trình khởi nghiệp tiệm mới
        this.closeModal();          // Đóng modal chào mừng
        this.render();              // Cập nhật lại UI màn chuẩn bị
        this.updatePrepTutorial(stateManager.getState()); // CHÍNH THỨC BẮT ĐẦU ĐOẠN HƯỚNG DẪN BÁC BA!
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

  public showToast(message: string, priority = false) {
    if (!message) return;
    if (priority) {
      this.toastQueue.unshift(message);
    } else {
      // Tránh lặp lại đúng câu vừa có trong queue
      if (this.toastQueue[this.toastQueue.length - 1] === message) return;
      this.toastQueue.push(message);
    }
    this.processToastQueue();
  }

  private processToastQueue() {
    if (this.isToastActive || this.toastQueue.length === 0) return;
    const msg = this.toastQueue.shift();
    if (!msg) return;

    const toast = document.getElementById('toast');
    if (!toast) return;

    this.isToastActive = true;
    toast.textContent = msg;
    toast.classList.add('show');

    if (this.toastTimer !== null) {
      window.clearTimeout(this.toastTimer);
    }

    this.toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
      // Khoảng đệm thư thái 350ms giữa 2 thông báo giúp mắt người chơi kịp nghỉ ngơi
      this.toastTimer = window.setTimeout(() => {
        this.isToastActive = false;
        this.processToastQueue();
      }, 350);
    }, 2200);
  }

  public showBacBaTip(trigger: 'oil_dirty' | 'perfect_streak' | 'low_patience' | 'out_of_chicken' | 'general' | 'sauce_needed') {
    if (this.shownBacBaTipsThisSession.has(trigger) || this.isModalOpen()) return;
    const curState = stateManager.getState();
    if (trigger === 'sauce_needed' && curState.hasSeenSauceTutorial) return;
    if (trigger === 'oil_dirty' && curState.hasSeenOilTutorial) return;

    const tip = BAC_BA_GAME_TIPS.find(t => t.trigger === trigger);
    if (!tip) return;
    this.shownBacBaTipsThisSession.add(trigger);

    if (trigger === 'sauce_needed') {
      stateManager.update(s => { s.hasSeenSauceTutorial = true; });
    } else if (trigger === 'oil_dirty') {
      stateManager.update(s => { s.hasSeenOilTutorial = true; });
    }

    let banner = document.getElementById('bacba-tip-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'bacba-tip-banner';
      banner.className = 'bacba-tip-banner';
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <img src="${ASSETS.bacba.front}" alt="Bác Ba" class="bacba-tip-banner-avatar" />
      <div class="bacba-tip-banner-text">
        <div class="bacba-tip-banner-title">👴 Bác Ba Nam Bộ mách nước</div>
        <div class="bacba-tip-banner-body">${escapeHtml(tip.text)}</div>
      </div>
      <button class="bacba-tip-banner-close" aria-label="Đóng">✕</button>
    `;

    audio.playPop();
    bacBaVoice.speak(tip.trigger as BacBaVoiceContext, tip.text);
    banner.classList.add('show');

    const closeBtn = banner.querySelector('.bacba-tip-banner-close');
    const closeFn = (e?: Event) => {
      e?.stopPropagation();
      banner?.classList.remove('show');
    };
    if (closeBtn) (closeBtn as HTMLElement).onclick = closeFn;
    banner.onclick = closeFn;

    setTimeout(() => {
      banner?.classList.remove('show');
    }, 5500);
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
    if (this.leaderboardPollTimer !== null) {
      window.clearInterval(this.leaderboardPollTimer);
      this.leaderboardPollTimer = null;
    }
    stopNarration();
    const overlay = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    if (modalContent) modalContent.classList.remove('is-dashboard');
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
    else if (stateManager.getState().phase === 'prep') {
      this.updatePrepTutorial(stateManager.getState());
    }
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

    // Âm thanh và nhạc phân cảnh sự kiện (Yêu cầu 8)
    const isDrama = incident.isSecurityRisk ||
      incident.categoryTag?.includes('BẢO KÊ') ||
      incident.categoryTag?.includes('SIẾT NỢ') ||
      incident.categoryTag?.includes('NGUY HIỂM') ||
      incident.categoryTag?.includes('ĐỐI THỦ');
    const isRomance = incident.categoryTag?.includes('TÌNH') || incident.categoryTag?.includes('HẸN HÒ');
    const isComedy = incident.categoryTag?.includes('TREND') || incident.categoryTag?.includes('HÀI') || incident.categoryTag?.includes('MÈO');

    if (isDrama) {
      audio.playDramaticSting();
      music.setMode('dramatic_incident');
    } else if (isRomance) {
      audio.playRomanceChime();
    } else if (isComedy) {
      audio.playComedyBoing();
    }

    babble(incident.dialogue, 'guest');
    const promptHtml = renderIncidentPrompt(incident, state);
    this.openModal(promptHtml);

    document.querySelectorAll<HTMLButtonElement>('.incident-choice-btn').forEach(btn => {
      btn.onclick = () => {
        const choiceId = btn.dataset.choiceId;
        const choice = incident.choices.find(c => c.id === choiceId);
        if (!choice) return;

        // Bác Ba hỏi lại: "Chắc chưa con? Nghĩ kỹ nghen!"
        audio.playPop();
        Haptics.tap();
        const confirmHtml = renderIncidentConfirmPrompt(incident, choice);
        this.openModal(confirmHtml);

        const confirmYesBtn = document.getElementById('btn-incident-confirm-yes');
        const confirmNoBtn = document.getElementById('btn-incident-confirm-no');

        if (confirmNoBtn) {
          confirmNoBtn.onclick = () => {
            audio.playPop();
            Haptics.tap();
            // Quay lại danh sách lựa chọn sự kiện
            this.openDailyIncidentDialog(incident, onDone);
          };
        }

        if (confirmYesBtn) {
          confirmYesBtn.onclick = () => {
            let result: ReturnType<typeof resolveIncidentChoice> | undefined;
            stateManager.update(draft => {
              result = resolveIncidentChoice(draft, incident, choice);
            });

            if (!result) return;

            // Xử lý giang hồ đập phá đuổi khách hoảng sợ chạy sạch (Yêu cầu 11)
            if (result.scareCustomers && this.sellingSession) {
              const lostOrdersCount = this.sellingSession.orders.length;
              this.sellingSession.orders = [];
              this.sellingSession.disruptionTimerSec = result.disruptionSeconds || 18;
              this.sellingSession.disruptionNotice = '⚠️ Quán đang gián đoạn sau khi bị giang hồ quậy phá! Khách chạy tán loạn, đang dọn bàn ghế...';
              audio.playChaosScare();
              Haptics.warning();
              if (lostOrdersCount > 0) {
                this.showToast(`💥 Giang hồ đập bàn phá quán! ${lostOrdersCount} khách đang đợi hoảng sợ bỏ chạy hết sạch! ⚠️`);
              }
            } else if (result.succeeded) {
              audio.playCash();
            } else {
              audio.playPop();
            }

            if (result.moneyDelta > 0) {
              this.showToast(`💵 Sự kiện: Nhận +${result.moneyDelta.toLocaleString('vi-VN')}đ tiền mặt!`);
            } else if (result.moneyDelta < 0) {
              this.showToast(`💸 Sự kiện: Chi -${Math.abs(result.moneyDelta).toLocaleString('vi-VN')}đ tiền mặt!`);
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
                // Khôi phục lại nhạc nền ca bán / chuẩn bị
                music.setMode(wasSelling ? 'selling' : 'prep');
                if (wasSelling && this.sellingSession) {
                  this.sellingSession.isPaused = false;
                  this.lastTimestamp = performance.now();
                }
                this.render();
                if (onDone) onDone();
              };
            }
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
    const currentEndingId = endingId || state.activeEnding || 'open';
    const html = renderEndingModal(state, currentEndingId);
    this.openModal(html);
    bindEndingEvents(
      () => {
        this.closeModal();
        if (stateManager.getState().activeEnding && stateManager.getState().phase === 'selling') {
          this.setPhase('prep');
        }
      },
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
      },
      () => {
        this.openMemoryGalleryModal('endings');
      },
      currentEndingId
    );
  }

  // Phòng Lưu Niệm Ký Ức Hẻm 1102 (Bảo Tàng Thành Tựu & 6 Đại Kết Cục)
  public openMemoryGalleryModal(initialTab: GalleryTab = 'endings') {
    audio.playPop();
    const render = (tab: GalleryTab) => {
      const state = stateManager.getState();
      const html = renderMemoryGalleryModal(state, tab);
      this.openModal(html);
      bindMemoryGalleryEvents(
        (nextTab) => render(nextTab),
        (eid) => {
          this.openEndingModal(eid, false);
        },
        () => this.closeModal()
      );
    };
    render(initialTab);
  }

  public openBunnyLetterDialog(letter: BunnyLetter, isClaimed: boolean = false) {
    babble(letter.noteContent, 'bunny');
    const html = renderBunnyLetterModal(letter, isClaimed);
    this.openModal(html);
    bindBunnyModalEvents(
      () => {
        this.closeModal();
        this.showToast('Đã lưu mảnh giấy vào Sổ Ký Ức Gà Bông! 📜✨');
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
          <img src="${ASSETS.thocam.vui}" alt="Bé Gà Bông" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; background: #fff;" />
        </div>
        <div style="font-size: 0.75rem; color: #e65100; font-weight: 800; text-transform: uppercase;">🐥 KHÁCH TRI KỶ ĐANG CHỜ MÓN 🐥</div>
        <h2 style="margin: 4px 0 8px; font-size: 1.3rem; color: #bf360c; font-weight: 800;">Bé Gà Bông (An / Chicky)</h2>
        <div style="background: #fff8e1; border: 1.5px dashed #ffb74d; border-radius: 10px; padding: 12px; margin-bottom: 14px; font-size: 0.85rem; color: #4e342e; font-style: italic; line-height: 1.5;">
          ${quote}
        </div>
        <button id="btn-close-bunny-greet" class="btn-big-open" style="width: 100%; padding: 10px; font-size: 0.95rem; background: linear-gradient(135deg, #ff9800, #f57c00); box-shadow: 0 4px 0 #e65100;">
          🍗 Chiên Món Thật Ngon Đãi Gà Bông!
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

  // --- SỔ TAY KỶ NIỆM HẺM 1102 (36 CƯ DÂN, 6 KẾT CỤC, 6 THƯ THỎ CAM) ---
  public openMemoriesAlbumModal(activeTab?: MemoriesTabId, filter?: string) {
    if (activeTab) this.memoriesActiveTab = activeTab;
    if (filter !== undefined) this.memoriesFilter = filter;

    const state = stateManager.getState();
    const html = renderMemoriesAlbumModal(state, this.memoriesActiveTab, this.memoriesFilter);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-memories');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    const tabBtns = document.querySelectorAll('.tab-memories-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as MemoriesTabId;
        if (tab) {
          audio.playPop();
          this.openMemoriesAlbumModal(tab, this.memoriesFilter);
        }
      });
    });

    const filterBtns = document.querySelectorAll('.filter-res-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'all';
        audio.playPop();
        this.openMemoriesAlbumModal('residents', cat);
      });
    });
  }

  // --- BIÊN NIÊN KÝ PHÂN NHÁNH TUYẾN NHÂN VẬT HẺM 1102 (EPISODIC CHARACTER ARCS) ---
  public openCharacterEpisodeModal(episode: CharacterEpisode) {
    const state = stateManager.getState();
    const html = renderCharacterEpisodeModal(state, episode);
    this.openModal(html);

    const modalBox = document.getElementById('modal-character-story') || document.getElementById('modal-content');
    if (modalBox) {
      bindCharacterEpisodeTypewriter(modalBox);
    }

    const closeBtn = document.getElementById('btn-close-char-story');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    const choiceBtns = document.querySelectorAll('.btn-char-story-choice');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choiceId = (e.currentTarget as HTMLElement).getAttribute('data-choice-id');
        if (choiceId) {
          audio.playCash();
          const { choice } = resolveCharacterChoice(stateManager.getState(), episode.id, choiceId);
          
          // Tự động kiểm tra và mở khóa kỷ vật & món ăn kỷ niệm mới
          const currentState = stateManager.getState();
          const unlockedCurios = getUnlockedCurios(currentState);
          currentState.unlockedCurioIds = unlockedCurios.map(c => c.id);
          const unlockedDishes = getUnlockedSignatureDishes(currentState);
          currentState.customSignatureDishesUnlocked = unlockedDishes.map(d => d.id);
          stateManager.saveState();

          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          this.openModal(renderCharacterEpisodeReactionModal(episode, choice));

          const reactionBox = document.getElementById('modal-char-reaction') || document.getElementById('modal-content');
          if (reactionBox) {
            bindReactionEpisodeTypewriter(reactionBox);
          }

          const finishBtn = document.getElementById('btn-finish-char-reaction') || document.getElementById('btn-dismiss-char-reaction');
          if (finishBtn) {
            finishBtn.onclick = () => {
              audio.playPop();
              this.closeModal();
              this.render();
            };
          }
        }
      });
    });
  }

  // --- BẢN TIN PHÁT THANH ĐÊM SÀI GÒN (FM 99.9 MHz) ---
  public openNightRadioModal() {
    const state = stateManager.getState();
    const broadcast = getTonightRadioBroadcast(state);
    if (!broadcast) return;

    audio.playRadioTuning();
    const html = renderNightRadioModal(state, broadcast);
    this.openModal(html);

    const claimBtn = document.getElementById('btn-claim-radio-buff');
    if (claimBtn) {
      claimBtn.onclick = () => {
        audio.playRadioTuning();
        setTimeout(() => audio.playRadioJingle(), 180);
        const res = activateRadioBroadcastBuff(stateManager.getState(), broadcast);
        stateManager.saveState();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        this.showToast(res.message);
        this.openNightRadioModal();
      };
    }

    const closeBtn = document.getElementById('btn-close-night-radio');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
        const st = stateManager.getState();
        if (st.phase === 'summary' && this.lastSummaryData) {
          this.openModal(renderSummaryModal(st, this.lastSummaryData.ledger, this.lastSummaryData.review, this.lastSummaryData.advisorTip));
          this.bindSummaryEvents(this.lastSummaryData.ledger, this.lastSummaryData.review, this.lastSummaryData.advisorTip, this.lastSummaryData.rentDue);
        }
      };
    }
  }

  // --- GÓC THÚ CƯNG HIÊN QUÁN (PET SANCTUARY & PATIO) ---
  public openPetPatioModal() {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderPetPatioModal(state);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-pet-patio');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    // Tương tác vuốt ve từng bé thú cưng
    const petBtns = document.querySelectorAll('.btn-pet-action');
    petBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const petId = (e.currentTarget as HTMLElement).getAttribute('data-pet-id') as 'pet_01_dog_vang' | 'pet_02_cat_muop';
        if (petId) {
          const res = petThePet(stateManager.getState(), petId);
          if (res.success) {
            audio.playCash();
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
            this.showToast(res.message);
          } else {
            audio.playPop();
            this.showToast(res.message);
          }
          stateManager.saveState();
          this.openPetPatioModal(); // Re-render modal với trạng thái mới
        }
      });
    });

    // Nâng cấp hiên nhà
    const upgradeBtn = document.getElementById('btn-upgrade-pet-patio');
    if (upgradeBtn) {
      upgradeBtn.onclick = () => {
        const res = upgradePetPatio(stateManager.getState());
        if (res.success) {
          audio.playCash();
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
          this.showToast(`🎉 ${res.message}`);
          stateManager.saveState();
          this.render(); // Cập nhật số tiền trên header
          this.openPetPatioModal();
        } else {
          audio.playBurnt();
          this.showToast(`⚠️ ${res.message}`);
        }
      };
    }
  }

  // --- BỨC TƯỜNG BẰNG KHEN TỔ DÂN PHỐ HẺM 1102 (WALL OF FAME) ---
  public openAchievementsWallModal(filterCat: string = 'all') {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderAchievementsWallModal(state, filterCat);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-achievements');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    // Bộ lọc thể loại
    const filterBtns = document.querySelectorAll('.btn-badge-filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'all';
        audio.playPop();
        this.openAchievementsWallModal(cat);
      });
    });

    // Nút đóng dấu mộc đỏ nhận thưởng
    const claimBtns = document.querySelectorAll('.btn-claim-badge');
    claimBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const badgeId = (e.currentTarget as HTMLElement).getAttribute('data-badge-id') as any;
        if (badgeId) {
          const res = claimBadgeReward(stateManager.getState(), badgeId);
          if (res.success) {
            audio.playCash();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
            this.showToast(`🎉 ${res.message}`);
            stateManager.saveState();
            this.render(); // Cập nhật số tiền header
            this.openAchievementsWallModal(filterCat);
          } else {
            audio.playBurnt();
            this.showToast(`⚠️ ${res.message}`);
          }
        }
      });
    });
  }

  public openShopThemeModal() {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderShopThemeModal(state);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-shop-theme') || document.getElementById('btn-close-shop-themes');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    // Nút Áp Dụng Theme đã có
    const applyBtns = document.querySelectorAll('.btn-apply-theme');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = (e.currentTarget as HTMLElement).getAttribute('data-theme-id') as any;
        if (themeId) {
          const res = setActiveShopTheme(stateManager.getState(), themeId);
          if (res.success) {
            audio.playPop();
            this.showToast(`✨ ${res.message}`);
            stateManager.saveState();
            this.render();
            this.openShopThemeModal();
          } else {
            audio.playBurnt();
            this.showToast(`⚠️ ${res.message}`);
          }
        }
      });
    });

    // Nút Mua/Thi Công Theme Mới
    const unlockBtns = document.querySelectorAll('.btn-unlock-theme');
    unlockBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = (e.currentTarget as HTMLElement).getAttribute('data-theme-id') as any;
        if (themeId) {
          const res = unlockShopTheme(stateManager.getState(), themeId);
          if (res.success) {
            audio.playCash();
            confetti({ particleCount: 75, spread: 85, origin: { y: 0.5 } });
            this.showToast(`🎉 ${res.message}`);
            stateManager.saveState();
            this.render();
            this.openShopThemeModal();
          } else {
            audio.playBurnt();
            this.showToast(`⚠️ ${res.message}`);
          }
        }
      });
    });
  }

  public openEndlessModeModal() {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderEndlessModeModal(state);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-endless-mode');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
      };
    }

    const startBtn = document.getElementById('btn-start-endless-run');
    if (startBtn) {
      startBtn.onclick = () => {
        const check = canEnterEndlessMode(state);
        if (!check.canEnter) {
          audio.playBurnt();
          this.showToast(`⚠️ ${check.reason}`);
          return;
        }
        audio.playCash();
        confetti({ particleCount: 90, spread: 100, origin: { y: 0.5 } });
        this.closeModal();
        this.showToast('🔥 BẮT ĐẦU CA ĐÊM BẤT TẬN! Đợt sóng khách ùa vào!');
        this.setPhase('selling');
      };
    }
  }

  // --- TÊN TRỘM ĐÓNG GIẢ & BẢO VỆ PHÁ ÁN (JEV-POWERED) ---
  private tickThief(session: SellingSession, gameDt: number) {
    if (this.isModalOpen()) return;

    // Tính thời gian giây của ca bán hiện tại (tương ứng 75s / ca)
    const currentSec = ((session.gameHour - OPEN_HOUR) / (CLOSE_HOUR - OPEN_HOUR)) * 75;

    // 1. Kiểm tra kích hoạt trộm theo lịch
    const schedule = session.thiefSchedule;
    if (schedule && schedule.timestamps && schedule.timestamps.length > 0 && !session.activeThief) {
      const firstTarget = schedule.timestamps[0];
      if (firstTarget !== undefined && currentSec >= firstTarget) {
        schedule.timestamps.shift();
        const maxTables = stateManager.getState().upgrades.space?.currentLevel ?? 1;
        const encounter = createThiefEncounter(String(Date.now()), maxTables);
        session.activeThief = encounter;

        // Chó Vàng trợ chiến báo động sớm
        const dogBonus = checkDogGuardBonus(stateManager.getState());
        if (dogBonus.hasDogBonus) {
          encounter.timeRemaining += dogBonus.extraSeconds;
          encounter.initialTime += dogBonus.extraSeconds;
          audio.playPop();
          this.showToast(dogBonus.alertText);
        }

        const sec = checkSecurityStaff(stateManager.getState());
        if (sec.hasSecurity) {
          audio.playBurnt();
          this.showToast(`🚨 ${sec.guardName}: "Phát hiện kẻ khả nghi tại Bàn ${encounter.targetTable}! Bấm BẮT NGAY!"`);
        } else {
          audio.playBurnt();
          this.showToast(`👀 Khách khả nghi: "${encounter.disguiseName}" đang me móc ví khách khác! Bấm vào để bắt!`);
        }
      }
    }

    // 2. Đếm ngược thời gian nếu trộm đang rình rập
    if (session.activeThief && !session.activeThief.isCaught && !session.activeThief.isEscaped) {
      session.activeThief.timeRemaining -= gameDt / 1000;
      if (session.activeThief.timeRemaining <= 0) {
        // Hết giờ mà người chơi chưa kịp bấm! Tên trộm cuỗm đồ chạy mất!
        const encounter = session.activeThief;
        session.activeThief = null;
        audio.playBurnt();
        resolveThiefEscaped(stateManager.getState(), encounter);
        this.whenModalFree(() => {
          this.openModal(renderThiefEscapedModal(stateManager.getState(), encounter));
          this.bindThiefEscapedFailure(encounter);
        });
      }
    }
  }

  public openThiefMinigameModal(encounter: ThiefEncounter) {
    if (encounter.isCaught || encounter.isEscaped) return;
    const state = stateManager.getState();
    const security = checkSecurityStaff(state);
    const greenWidth = security.greenZoneWidthPercent;
    const greenLeft = Math.round((100 - greenWidth) / 2);

    const html = renderThiefMinigameModal(state, encounter);
    this.openModal(html);

    let needlePos = 0;
    let needleDir = 1; // 1: sang phải, -1: sang trái
    const speed = security.hasSecurity ? 0.9 : 1.8;
    let isResolved = false;

    const needleEl = document.getElementById('thief-needle');
    const timerSecEl = document.getElementById('thief-timer-sec');

    const updateNeedle = () => {
      if (isResolved || !this.isModalOpen()) return;
      needlePos += needleDir * speed;
      if (needlePos >= 100) {
        needlePos = 100;
        needleDir = -1;
      } else if (needlePos <= 0) {
        needlePos = 0;
        needleDir = 1;
      }
      if (needleEl) needleEl.style.left = `${needlePos}%`;
      if (timerSecEl) timerSecEl.textContent = `${Math.ceil(encounter.timeRemaining)}`;
      this.thiefAnimId = requestAnimationFrame(updateNeedle);
    };

    if (this.thiefAnimId) cancelAnimationFrame(this.thiefAnimId);
    this.thiefAnimId = requestAnimationFrame(updateNeedle);

    // Xử lý nút Bảo Vệ khống chế 100%
    const guardBtn = document.getElementById('btn-guard-instant-bust');
    if (guardBtn) {
      guardBtn.onclick = () => {
        if (isResolved) return;
        isResolved = true;
        if (this.thiefAnimId) {
          cancelAnimationFrame(this.thiefAnimId);
          this.thiefAnimId = null;
        }
        audio.playThiefBusted();
        audio.playCoinChing();
        Haptics.thiefBusted();
        const result = resolveThiefCaught(stateManager.getState(), encounter, true);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        this.openModal(renderThiefCaughtModal(stateManager.getState(), encounter, result.rewardMoney));
        this.bindThiefCaughtSuccess(encounter);
      };
    }

    // Xử lý nút Người chơi căn bấm chụp tay trộm
    const strikeBtn = document.getElementById('btn-thief-strike');
    if (strikeBtn) {
      strikeBtn.onclick = () => {
        if (isResolved) return;
        isResolved = true;
        if (this.thiefAnimId) {
          cancelAnimationFrame(this.thiefAnimId);
          this.thiefAnimId = null;
        }

        const isHit = needlePos >= greenLeft && needlePos <= (greenLeft + greenWidth);
        if (isHit) {
          // Bắt được!
          audio.playThiefBusted();
          audio.playCoinChing();
          Haptics.thiefBusted();
          const result = resolveThiefCaught(stateManager.getState(), encounter, false);
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          this.openModal(renderThiefCaughtModal(stateManager.getState(), encounter, result.rewardMoney));
          this.bindThiefCaughtSuccess(encounter);
        } else {
          // Trượt! Tên trộm cuỗm đồ phóng chạy
          audio.playBurnt();
          Haptics.warning();
          resolveThiefEscaped(stateManager.getState(), encounter);
          this.openModal(renderThiefEscapedModal(stateManager.getState(), encounter));
          this.bindThiefEscapedFailure(encounter);
        }
      };
    }
  }

  private bindThiefCaughtSuccess(_encounter: ThiefEncounter) {
    const finishBtn = document.getElementById('btn-thief-finish-success');
    if (finishBtn) {
      finishBtn.onclick = () => {
        audio.playPop();
        if (this.sellingSession) this.sellingSession.activeThief = null;
        this.closeModal();
        this.showToast('✅ Đã bàn giao tên trộm cho Công an! Tiệm tiếp tục bán!');
        this.render();
      };
    }
  }

  private bindThiefEscapedFailure(_encounter: ThiefEncounter) {
    const finishBtn = document.getElementById('btn-thief-finish-failure');
    if (finishBtn) {
      finishBtn.onclick = () => {
        audio.playPop();
        if (this.sellingSession) this.sellingSession.activeThief = null;
        this.closeModal();
        this.showToast('💸 Đã bồi thường thiệt hại cho khách! Rút kinh nghiệm sâu sắc!');
        this.render();
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
    if (this.titleDismissed) {
      updateThemeColor('#5a3018');
    }
    const state = stateManager.getState();
    const activeTheme = getActiveShopTheme(state);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.classList.remove('theme-default', 'theme-saigon-90s', 'theme-tet-mai-vang', 'theme-neon-cho-lon');
      appEl.classList.add(activeTheme.cssClass);
    }

    // 1. Render Header (chỉ khi nội dung đổi, để nút header không bị thay mỗi frame)
    const headerEl = document.getElementById('header');
    const headerHtml = renderHeader(state, () => this.openSettings());
    if (headerEl && headerHtml !== this.lastHeaderHtml) {
      this.lastHeaderHtml = headerHtml;
      headerEl.innerHTML = headerHtml;
      bindHeaderEvents(
        state,
        () => this.render(),
        () => this.openSettings(),
        () => this.openUpdateDashboardModal(),
        () => openBacBaManualModal(),
        () => this.openLeaderboard(),
        () => this.openSocialShareModal(),
        () => {
          if (state.phase === 'selling') {
            this.openKitchenGuideModal();
          } else {
            this.openLoyaltyHandbookModal();
          }
        },
        () => this.openLoyaltyHandbookModal()
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
      this.updatePrepTutorial(state);
    } else if (state.phase === 'selling' && this.sellingSession) {
      if (this.prepTutorialStep) {
        this.endPrepTutorial();
      }
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
    const nextEpisode = getNextAvailableCharacterEpisode(state);
    const storyBannerHtml = nextEpisode ? `
      <div id="btn-open-char-story" class="char-story-banner" style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2.5px solid #d97706; border-radius: 12px; padding: 10px 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.25);">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
          <img src="${nextEpisode.avatar}" alt="" style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #b45309; object-fit: cover; background: #fff;" />
          <div style="min-width: 0;">
            <div style="font-size: 0.68rem; font-weight: 800; color: #b45309; text-transform: uppercase;">
              📖 KÝ SỰ HẺM 1102 • ${escapeHtml(nextEpisode.characterName)}
            </div>
            <div style="font-size: 0.84rem; font-weight: 900; color: #451a03; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(nextEpisode.title)}
            </div>
            <div style="font-size: 0.68rem; color: #78350f;">
              Bấm vào để lắng nghe tâm sự & đưa ra lựa chọn phân nhánh!
            </div>
          </div>
        </div>
        <button class="btn-sm" style="background: #b45309; color: #fff; border: none; font-size: 0.75rem; font-weight: 800; padding: 7px 12px; border-radius: 8px; flex-shrink: 0; pointer-events: none; box-shadow: 0 2px 6px rgba(180, 83, 9, 0.3);">
          Lắng Nghe ✨
        </button>
      </div>
    ` : '';

    const chalkboardHtml = renderChalkboard(state, this.currentEvent.title);

    const isReviewsUnlocked = state.day >= 2 || state.currentChapter >= 2;
    const isUpgradesUnlocked = state.day >= 3 || state.currentChapter >= 2;
    const isStaffUnlocked = state.currentChapter >= 2 || state.day >= 10;

    // Safety fallback: nếu tab hiện tại chưa mở thì tự chuyển về kho hàng
    if (this.activeTab === 'reviews' && !isReviewsUnlocked) this.activeTab = 'inventory';
    if (this.activeTab === 'upgrades' && !isUpgradesUnlocked) this.activeTab = 'inventory';
    if (this.activeTab === 'staff' && !isStaffUnlocked) this.activeTab = 'inventory';

    const tabsBarHtml = `
      <div class="tabs-bar">
        <button class="tab-btn ${this.activeTab === 'inventory' ? 'active' : ''}" data-tab="inventory">
          <img src="${ASSETS.icons.inventory}" class="tab-pixel-icon" alt="" />
          <span>Kho hàng</span>
        </button>
        ${isUpgradesUnlocked ? `
          <button class="tab-btn ${this.activeTab === 'upgrades' ? 'active' : ''}" data-tab="upgrades">
            <img src="${ASSETS.icons.upgrade}" class="tab-pixel-icon" alt="" />
            <span>Nâng cấp${state.day === 3 ? ' <span class="tab-badge-new">MỚI</span>' : ''}</span>
          </button>
        ` : ''}
        ${isStaffUnlocked ? `
          <button class="tab-btn ${this.activeTab === 'staff' ? 'active' : ''}" data-tab="staff">
            <img src="${ASSETS.icons.staff}" class="tab-pixel-icon" alt="" />
            <span>Nhân viên</span>
          </button>
        ` : ''}
        ${isReviewsUnlocked ? `
          <button class="tab-btn ${this.activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews">
            <img src="${ASSETS.icons.reviews}" class="tab-pixel-icon" alt="" />
            <span>Đánh giá (${state.ratings.overall.toFixed(1)}★ · ${state.totalReviewsCount ?? state.recentReviews.length})${state.day === 2 ? ' <span class="tab-badge-new">MỚI</span>' : ''}</span>
          </button>
        ` : ''}
        <button class="tab-btn ${this.activeTab === 'menu' ? 'active' : ''}" data-tab="menu">
          <img src="${ASSETS.icons.book}" class="tab-pixel-icon" alt="" />
          <span>Thực đơn</span>
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
        ${storyBannerHtml}
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
    // Ký sự cư dân Hẻm 1102
    const storyBannerBtn = document.getElementById('btn-open-char-story');
    if (storyBannerBtn) {
      storyBannerBtn.onclick = () => {
        audio.playPop();
        const ep = getNextAvailableCharacterEpisode(state);
        if (ep) this.openCharacterEpisodeModal(ep);
      };
    }
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.getAttribute('data-tab') as TabId;
        if (tab) {
          this.activeTab = tab;
          audio.playPop();
          if (this.prepTutorialStep) {
            if (tab === 'inventory') this.prepTutorialStep = 'prep-inventory';
            else if (tab === 'upgrades') this.prepTutorialStep = 'prep-upgrades';
            else if (tab === 'staff') this.prepTutorialStep = 'prep-staff';
            else if (tab === 'reviews') this.prepTutorialStep = 'prep-reviews';
            else if (tab === 'menu') this.prepTutorialStep = 'prep-menu';
          }
          this.render();
        }
      });
    });

    // Chalkboard Buttons
    const weeklyQuestsBtn = document.getElementById('btn-weekly-quests');
    if (weeklyQuestsBtn) {
      weeklyQuestsBtn.onclick = () => {
        audio.playPop();
        this.openWeeklyQuests();
      };
    }

    const secretSauceBtn = document.getElementById('btn-secret-sauce');
    if (secretSauceBtn) {
      secretSauceBtn.onclick = () => {
        audio.playPop();
        openSecretSauceModal(stateManager.getState(), {
          onSuccess: () => {
            stateManager.flush();
            this.showToast('🍲✨ SỐT THẦN THÁNH ĐÃ SẴN SÀNG! +3.000đ Tip mỗi đơn gà sốt!');
            this.render();
          },
          onClose: () => {
            stateManager.flush();
            this.render();
          }
        });
      };
    }

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
          if (chapter !== null) {
            this.openChapterUnlockedDialog(chapter);
            void syncToLeaderboard(stateManager.getState());
          }
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

    const toggleChalkboardBtn = document.getElementById('btn-toggle-chalkboard');
    if (toggleChalkboardBtn) {
      const board = document.getElementById('main-chalkboard');
      if (localStorage.getItem('tiemga_chalkboard_collapsed') === '1' && board) {
        board.classList.add('is-collapsed');
        const iconSpan = toggleChalkboardBtn.querySelector('.toggle-icon');
        if (iconSpan) iconSpan.textContent = '▲';
      }
      toggleChalkboardBtn.onclick = () => {
        audio.playPop();
        if (board) {
          board.classList.toggle('is-collapsed');
          const isCollapsed = board.classList.contains('is-collapsed');
          const iconSpan = toggleChalkboardBtn.querySelector('.toggle-icon');
          if (iconSpan) iconSpan.textContent = isCollapsed ? '▲' : '▼';
          localStorage.setItem('tiemga_chalkboard_collapsed', isCollapsed ? '1' : '0');
        }
      };
    }

    const openStardewMailboxBtn = document.getElementById('btn-open-stardew-mailbox');
    if (openStardewMailboxBtn) {
      openStardewMailboxBtn.onclick = (e) => {
        if ((e.target as HTMLElement).closest('.btn-mailbox-pill')) return;
        audio.playPop();
        openStardewMailboxModal(stateManager.getState(), {
          openMemories: () => this.openMemoriesAlbumModal('residents', 'all'),
          openLoyalty: () => this.openLoyaltyHandbookModal(),
          openIncidents: () => this.openIncidentsAlbumDialog(),
        });
      };
    }

    const openIncidentsBtn = document.getElementById('btn-open-incidents');
    if (openIncidentsBtn) {
      openIncidentsBtn.onclick = () => {
        this.openIncidentsAlbumDialog();
      };
    }

    const openMemoriesBtn = document.getElementById('btn-open-memories');
    if (openMemoriesBtn) {
      openMemoriesBtn.onclick = () => {
        audio.playPop();
        this.openMemoriesAlbumModal('residents', 'all');
      };
    }

    const openLoyaltyBtn = document.getElementById('btn-open-loyalty-handbook');
    if (openLoyaltyBtn) {
      openLoyaltyBtn.onclick = () => {
        audio.playPop();
        this.openLoyaltyHandbookModal();
      };
    }

    const openNightRadioBtn = document.getElementById('btn-open-night-radio');
    if (openNightRadioBtn) {
      openNightRadioBtn.onclick = () => {
        audio.playPop();
        this.openNightRadioModal();
      };
    }

    const openPetPatioBtn = document.getElementById('btn-open-pet-patio');
    if (openPetPatioBtn) {
      openPetPatioBtn.onclick = () => {
        audio.playPop();
        this.openPetPatioModal();
      };
    }

    const openAchievementsBtn = document.getElementById('btn-open-achievements');
    if (openAchievementsBtn) {
      openAchievementsBtn.onclick = () => {
        audio.playPop();
        this.openAchievementsWallModal('all');
      };
    }

    const openShopThemesBtn = document.getElementById('btn-open-shop-themes');
    if (openShopThemesBtn) {
      openShopThemesBtn.onclick = () => {
        audio.playPop();
        this.openShopThemeModal();
      };
    }

    const bannerShopThemesBtn = document.getElementById('btn-banner-shop-themes');
    if (bannerShopThemesBtn) {
      bannerShopThemesBtn.onclick = () => {
        audio.playPop();
        this.openShopThemeModal();
      };
    }

    const openEndlessModeBtn = document.getElementById('btn-open-endless-mode');
    if (openEndlessModeBtn) {
      openEndlessModeBtn.onclick = () => {
        audio.playPop();
        this.openEndlessModeModal();
      };
    }

    // Bind current tab events
    switch (this.activeTab) {
      case 'inventory':
        bindInventoryEvents(
          state,
          fn => stateManager.update(fn),
          msg => this.showToast(msg),
          () => this.openMarketBargainModal()
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
          msg => this.showToast(msg),
          (msg, label) => this.confirmDialog(msg, label)
        );
        break;
      case 'reviews':
        bindReviewsEvents(
          state,
          (rev) => this.openReviewReplyDialog(rev, () => this.render())
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
        // Kiểm tra nguyên liệu tối thiểu (luôn đọc từ stateManager thời gian thực)
        const liveState = stateManager.getState();
        const chickenStock = liveState.inventory.chicken_meat?.amount || 0;
        if (chickenStock < 2) {
          const effects = upgradeEffects(liveState.upgrades);
          const discount = Math.min(60, (effects.discountWholesale || 0) + (liveState.todayMarketDiscount || 0));
          const unitCost = Math.round((liveState.inventory.chicken_meat?.cost || 14000) * (1 - discount / 100));
          const minChickenPackCost = unitCost * 5;

          if (liveState.money >= minChickenPackCost) {
            // Tự động nhập nhanh 5 miếng gà tươi để sẵn sàng mở bán
            stateManager.update(draft => {
              const target = draft.inventory.chicken_meat;
              if (target && draft.money >= minChickenPackCost) {
                draft.money -= minChickenPackCost;
                addStock(target, 5, unitCost, effects.shelfLifeBonus);
              }
            });
            audio.playCash();
            this.showToast(`🍗 Tiệm đã tự động nhập 5 miếng gà tươi (-${minChickenPackCost.toLocaleString('vi-VN')}đ) để kịp giờ mở bán!`);
          } else {
            // Tương trợ khu phố từ Bác Ba Tổ Trưởng nếu người chơi bị kẹt không đủ tiền mua gói gà tối thiểu
            let granted = false;
            stateManager.update(draft => { granted = requestBaBaAid(draft); });
            if (granted) {
              audio.playCash();
              babble('Con ơi cầm lấy mà xoay xở', 'bacba');
              const freshStock = stateManager.getState().inventory.chicken_meat?.amount || 0;
              this.showToast(`❤️ Bác Ba tương trợ kịp thời (${freshStock >= 15 ? '15 miếng gà & 150k vốn' : '5 miếng gà cho mượn tạm'})! Mở bán được rồi con nhé!`);
            } else {
              // Kiểm tra xem người chơi còn nguyên liệu nào có thể hoàn tiền (-5) để xoay vốn không
              const currentInv = stateManager.getState().inventory;
              const canRefundAnything = Object.values(currentInv).some(item => (item?.amount || 0) >= 5);
              const currentMoney = stateManager.getState().money || 0;
              if (!canRefundAnything && currentMoney < minChickenPackCost) {
                this.showToast('💸 Tiệm đã cạn kiệt toàn bộ vốn liếng và gà tươi, không thể tiếp tục kinh doanh!');
                this.openEndingModal('bad_bankruptcy');
                return;
              }

              this.showToast('Hết gà với hết vốn rồi… Bác Ba đã giúp một lần trong chương này rồi. Bán bớt đồ hoặc nhận thưởng Gà Bông đi con.');
              this.activeTab = 'inventory';
              this.render();
              return;
            }
          }
        }

        showPrepLoadingModal({
          onComplete: () => {
            if (this.prepTutorialStep) {
              this.endPrepTutorial();
            }
            audio.playPerfect();
            this.showToast('Quán chính thức mở cửa! Chúc buôn may bán đắt nha! 🎊');
            this.setPhase('selling');
          }
        });
      };
    }
  }

  // --- PREP TUTORIAL (BÁC BA HƯỚNG DẪN MÀN CHUẨN BỊ) ---
  private updatePrepTutorial(state: GameState) {
    if (!this.titleDismissed || this.isModalOpen() || this.isNewShopFlow) return;

    if (!shouldRunPrepTutorial(state)) {
      if (this.prepTutorialStep) {
        this.endPrepTutorial();
      }

      // Hướng dẫn tính năng mới theo ngày (Bác Ba Spotlight - Jev Decision Confidence 1.0)
      const dailyGuide = checkDailyFeatureUnlockGuide(state);
      if (dailyGuide) {
        if (dailyGuide.tabToSwitch && this.activeTab !== dailyGuide.tabToSwitch) {
          this.activeTab = dailyGuide.tabToSwitch;
          this.render();
        }
        syncTutorialLayer({
          step: dailyGuide.step as any,
          text: dailyGuide.text,
          target: dailyGuide.target,
          button: dailyGuide.button
        }, {
          onButton: () => {
            stateManager.update(draft => {
              draft.guidedFeatures = draft.guidedFeatures || [];
              if (!draft.guidedFeatures.includes(dailyGuide.key)) {
                draft.guidedFeatures.push(dailyGuide.key);
              }
            });
            syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
          },
          onSkip: () => {
            stateManager.update(draft => {
              draft.guidedFeatures = draft.guidedFeatures || [];
              if (!draft.guidedFeatures.includes(dailyGuide.key)) {
                draft.guidedFeatures.push(dailyGuide.key);
              }
            });
            syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
          }
        });
        return;
      }

      return;
    }

    if (!this.prepTutorialStep) {
      this.prepTutorialStep = 'prep-welcome';
    }

    const currentStep = this.prepTutorialStep;
    const hint = prepTutorialHint(currentStep);

    // Tự động chuyển tab tương ứng để rọi sáng đúng nút và hiển thị đúng tính năng (mua bàn, kho hàng, nhân viên...)
    if (hint.tabToSwitch && this.activeTab !== hint.tabToSwitch) {
      this.activeTab = hint.tabToSwitch;
      const pane = document.querySelector('.prep-container .pane');
      if (pane) {
        switch (this.activeTab) {
          case 'inventory': pane.innerHTML = renderInventoryTab(state); break;
          case 'upgrades': pane.innerHTML = renderUpgradesTab(state); break;
          case 'staff': pane.innerHTML = renderStaffTab(state); break;
          case 'reviews': pane.innerHTML = renderReviewsTab(state); break;
          case 'menu': pane.innerHTML = renderMenuTab(state); break;
        }
      }
      document.querySelectorAll('.tab-btn').forEach(btn => {
        const tab = btn.getAttribute('data-tab');
        btn.classList.toggle('active', tab === this.activeTab);
      });
    }

    syncTutorialLayer(hint, {
      onButton: () => this.advancePrepTutorial(),
      onSkip: () => this.endPrepTutorial()
    });
  }

  private advancePrepTutorial() {
    if (!this.prepTutorialStep) return;
    const idx = PREP_TUTORIAL_STEPS.indexOf(this.prepTutorialStep);
    if (idx >= 0 && idx < PREP_TUTORIAL_STEPS.length - 1) {
      const nextStep = PREP_TUTORIAL_STEPS[idx + 1];
      if (nextStep) {
        this.prepTutorialStep = nextStep;
        const hint = prepTutorialHint(nextStep);
        if (hint.tabToSwitch) {
          this.activeTab = hint.tabToSwitch;
        }
        this.render();
      }
    } else {
      this.endPrepTutorial();
      const startBtn = document.getElementById('btn-start-selling');
      if (startBtn) {
        startBtn.click();
      }
    }
  }

  private endPrepTutorial() {
    this.prepTutorialStep = null;
    syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
    stateManager.update(draft => { draft.prepTutorialDone = true; });
    stateManager.flush();
  }

  // --- SELLING PHASE ---
  private lastShiftSnapshotAt = 0;
  private tutorial: TutorialState | null = null; // Bác Ba dẫn ca đầu

  private sauceGuideActive = false;

  // Tính bước hướng dẫn từ trạng thái ca bán, vẽ bong bóng. Bước 'done' → đồng hồ chạy lại ngay.
  private updateTutorial(session: SellingSession) {
    if (this.tutorial) {
      const step = tutorialStep(this.tutorial, session, cookingEngine.getCookState(), cookingEngine.getTray(), cookingEngine.getActiveSeasoning());
      session.tutorial = step !== 'done';
      syncTutorialLayer(tutorialHint(step), {
        onButton: () => {
          if (step === 'intro' && this.tutorial) this.tutorial.introSeen = true;
          else this.endTutorial();
        },
        onSkip: () => this.endTutorial()
      });
      return;
    }

    // Hướng dẫn Bác Ba Spotlight khi lần đầu có món sốt cay hoặc sốt bơ tỏi (Jev Decision Confidence 1.0)
    const state = stateManager.getState();
    const hasSauceOrder = session.orders.some(o => o.items.some(it => it.menuItemId === 'spicy_chicken' || it.menuItemId === 'honey_garlic_chicken'));
    if (hasSauceOrder && !state.guidedFeatures?.includes('sauce_cooking_guide')) {
      this.sauceGuideActive = true;
      const isSpicy = session.orders.some(o => o.items.some(it => it.menuItemId === 'spicy_chicken'));
      const activeSauce = cookingEngine.getActiveSeasoning();
      const cookState = cookingEngine.getCookState();

      if (!activeSauce) {
        const target = isSpicy ? '#btn-season-spicy' : '#btn-season-honey';
        const sauceTitle = isSpicy ? 'Sốt Cay Yangnyeom' : 'Sốt Bơ Tỏi Thơm';
        syncTutorialLayer({
          step: 'season-spicy',
          text: `Bác Ba chỉ nghề: Khách mê món Gà ${sauceTitle} kìa con! Nhớ quy tắc nghệ nhân: Chạm khay [${sauceTitle}] trên quầy trước đặng áo đều lớp sốt óng ả lên gà, rồi mới thả gà vô chảo chiên nghen con!`,
          target,
          button: 'Dạ Bác Ba!'
        }, {
          onButton: () => {},
          onSkip: () => {
            stateManager.update(draft => {
              draft.guidedFeatures = draft.guidedFeatures || [];
              if (!draft.guidedFeatures.includes('sauce_cooking_guide')) {
                draft.guidedFeatures.push('sauce_cooking_guide');
              }
            });
            this.sauceGuideActive = false;
            syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
          }
        });
      } else if (!cookState.isFrying) {
        syncTutorialLayer({
          step: 'fry-chicken',
          text: 'Ướp sốt đỏ au thơm nức mũi rồi đó con! Giờ bấm nút [+ Gà Rán] thả miếng gà đã tẩm sốt vô chảo gang chiên đượm lửa nghen con!',
          target: '#btn-fry-chicken',
          button: 'Dạ con chiên liền!'
        }, {
          onButton: () => {},
          onSkip: () => {
            stateManager.update(draft => {
              draft.guidedFeatures = draft.guidedFeatures || [];
              if (!draft.guidedFeatures.includes('sauce_cooking_guide')) {
                draft.guidedFeatures.push('sauce_cooking_guide');
              }
            });
            this.sauceGuideActive = false;
            syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
          }
        });
      } else {
        // Đã thả gà tẩm sốt vô chảo chiên -> Hoàn thành hướng dẫn sốt
        stateManager.update(draft => {
          draft.guidedFeatures = draft.guidedFeatures || [];
          if (!draft.guidedFeatures.includes('sauce_cooking_guide')) {
            draft.guidedFeatures.push('sauce_cooking_guide');
          }
        });
        this.sauceGuideActive = false;
        syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
      }
      return;
    } else if (this.sauceGuideActive) {
      this.sauceGuideActive = false;
      syncTutorialLayer(null, { onButton: () => {}, onSkip: () => {} });
    }
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
    this.sellingSession.expectedCustomers = shift.expectedCustomers;
    if (this.sellingSession.spawnedCount === undefined) {
      this.sellingSession.spawnedCount = this.sellingSession.orders.length + this.sellingSession.servedCount + this.sellingSession.lostCount;
    }
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
    this.shownBacBaTipsThisSession.clear();
    this.sellingSession = createSellingSession();
    const state = stateManager.getState();
    const tables: DineInTable[] = JSON.parse(JSON.stringify(state.dineInTables || createDefaultDineInTables()));
    for (const t of tables) {
      t.status = 'empty';
      t.customerName = undefined;
      t.customerAvatar = undefined;
      t.foodName = undefined;
      t.foodIcon = undefined;
      t.tipAmount = 0;
      t.eatingTimerSec = 0;
      t.eatingDurationSec = 0;
      t.isCritic = false;
    }
    this.sellingSession.dineInTables = tables;
    cookingEngine.setFryRampBonus(upgradeEffects(state.upgrades).fryRampPct);
    // Kỷ vật Chiếc Vá Gỗ Năm 1990: nới rộng cửa sổ Perfect thêm +4%
    const hasVaGoRelic = state.unlockedCurioIds?.includes('relic_va_go_1990');
    // Hiệp đồng Radio Buff Mẹo Canh Lửa Bác Ba: nới rộng cửa sổ Perfect thêm +12%
    const hasChefWisdom = state.activeRadioBuff?.type === 'chef_wisdom' && state.activeRadioBuff.activeForDay === state.day;
    cookingEngine.setPerfectWindowBonus((hasVaGoRelic ? 4 : 0) + (hasChefWisdom ? 12 : 0));
    cookingEngine.clearTray();
    cookingEngine.setTraySize(traySizeFor(state));

    if (state.activeRadioBuff && state.activeRadioBuff.activeForDay === state.day) {
      setTimeout(() => {
        this.showToast(`📻 Sóng FM 99.9: Kích hoạt ${state.activeRadioBuff!.title}!`);
      }, 600);
    }
    this.customerSource = createCustomerSource(state, this.currentEvent);
    this.sellingSession.orders.push(...this.customerSource.opening());
    this.sellingSession.thiefSchedule = scheduleThiefEvents(state.day);
    this.sellingSession.activeThief = null;
    if (shouldRunTutorial(state)) {
      this.tutorial = { introSeen: false, servedAtStart: 0 };
      this.sellingSession.tutorial = true;
    }

    // Số khách cả ngày: khách nền theo chương × sao × marketing × sự kiện (GDD)
    this.expectedCustomers = EconomyEngine.calculateDailyCustomerCount(state, this.currentEvent.effect.customerMultiplier ?? 1);
    this.sellingSession.expectedCustomers = this.expectedCustomers;
    this.sellingSession.spawnedCount = this.sellingSession.orders.length;

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
    if (this.thiefAnimId) {
      cancelAnimationFrame(this.thiefAnimId);
      this.thiefAnimId = null;
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
      this.showToast('Gà chiên bị cháy khét bốc khói rồi! Vớt ra mau đi con ơi! 😭');
    }

    const events = tickSelling(session, gameDt, {
      expectedCustomers: this.expectedCustomers,
      spawnCustomer: () => this.customerSource?.next(session.orders) ?? OrdersEngine.generateOrder(stateManager.getState())
    });

    let dayOver = false;
    for (const event of events) {
      switch (event.type) {
        case 'customerLeft': {
          audio.playBurnt();
          this.showToast('Khách chờ lâu quá quạu bỏ về rồi nè! Tụt sao tốc độ luôn! ⚠️');
          const menu = stateManager.getState().menu;
          const review = ReviewsEngine.generateCustomerReview(stateManager.getState().day, event.order, {
            kind: 'lost',
            patienceRatio: 0,
            menuLookup: id => menu.find(m => m.id === id)?.name || id
          });
          stateManager.update(draft => {
            ReviewsEngine.applyRealtimeReview(draft, review);
          });
          break;
        }
        case 'customerArrived':
          audio.playDoorChime();
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

    // Kiểm tra và đếm ngược tên trộm rình mò (JEV-powered thief system)
    this.tickThief(session, gameDt);

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

    // Cập nhật chu kỳ phục vụ 4 nhịp (The 4-Beat Serving Cadence) cho khách rời quán
    if (session.departingCustomers && session.departingCustomers.length > 0) {
      const now = performance.now();
      let hasStateChange = false;
      session.departingCustomers = session.departingCustomers.filter(dep => {
        const elapsed = now - dep.startedAt;
        if (elapsed > 1350) {
          hasStateChange = true;
          return false; // Đã bước ra khỏi quán, gỡ bỏ
        }
        if (elapsed > 650 && dep.phase === 'receiving') {
          dep.phase = 'leaving'; // Chuyển từ nhận đồ sang quay người bước đi
          hasStateChange = true;
        }
        return true;
      });
      if (hasStateChange) {
        this.sellingStructureKey = '';
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

    // Bác Ba Live Tips mách nước trong ca bán
    if (!session.tutorial && !this.isModalOpen()) {
      const curState = stateManager.getState();
      const hasSauceOrder = session.orders.some(o => o.items.some(it => it.menuItemId.includes('spicy') || it.menuItemId.includes('honey')));
      if (hasSauceOrder && !curState.hasSeenSauceTutorial) {
        this.showBacBaTip('sauce_needed');
      } else if (curState.oilCondition === 'dirty' && !curState.hasSeenOilTutorial) {
        this.showBacBaTip('oil_dirty');
      } else if (session.perfectStreak >= 3) {
        this.showBacBaTip('perfect_streak');
      } else if (session.orders.some(o => (o.patienceCurrent / Math.max(1, o.patienceMax)) < 0.25)) {
        this.showBacBaTip('low_patience');
      } else if (session.gameHour >= 13 && session.gameHour <= 15 && this.shownBacBaTipsThisSession.size === 0) {
        this.showBacBaTip('general');
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
      squeeze: sauce => {
        const sq = squeezeCondiment(cookingEngine.getTray(), session.orders, sauce);
        if (sq) {
          audio.playSquirt();
          this.haptic(15);
          return true;
        }
        return false;
      },
      cleanTable: (tableIdx, dtMs, staffName) => {
        const res = waiterCleanDineInTable(session, tableIdx, dtMs, eff.waiterCleanMs ?? 3500, staffName);
        if (res.completed) {
          return { completed: true, tipCollected: res.tipCollected, tableName: res.tableName };
        }
        return { completed: false };
      },
      dirtyTableIndices: () => {
        return (session.dineInTables || [])
          .filter(t => t.status === 'dirty')
          .map(t => t.tableIndex);
      },
      traySize: cookingEngine.getTraySize()
    });
    for (const ev of events) {
      switch (ev.type) {
        case 'helperDone': {
          stateManager.update(draft => {
            recordHelperFry(draft, session, ev.item.quality);
          });
          if (ev.item.quality === 'burnt') this.showToast(`😅 ${ev.cook} lỡ tay chiên cháy ${ev.item.name}!`);
          break;
        }
        case 'autoServe':
          this.serveCurrentCustomer();
          break;
        case 'waiterCleanDone': {
          audio.playWoodClean();
          audio.playCoinChing();
          Haptics.cleanTable();
          this.showToast(`🧹 ${ev.staffName} đã lau sạch ${ev.tableName}! Thu gom +${ev.tipCollected.toLocaleString('vi-VN')}đ tiền tip 🪙✨`);
          this.sellingStructureKey = '';
          this.render();
          break;
        }
        case 'staffSlacking':
          this.showToast(`⚠️ Nhân viên ${ev.staffName} ${ev.reason}!`);
          break;
        case 'staffMistake':
          this.showToast(`🤦 ${ev.staffName} ${ev.detail}! Bác Ba nhắc nhở nhẹ nhàng.`);
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
    stateManager.update(draft => {
      recordFryerLift(draft, this.sellingSession, result);
    });
    if (!result.trayItem) this.showToast('Khay đầy, món vừa vớt bị bỏ!');
    if (result.quality === 'perfect') {
      audio.playServingBell();
      if ((this.sellingSession?.perfectStreak ?? 0) >= 2) {
        audio.playComboFanfare();
        Haptics.combo();
      } else {
        Haptics.perfect();
      }
      recordWeeklyQuestProgress(stateManager.getState(), 'perfect_fry', 1);
    } else if (result.quality === 'burnt') {
      audio.playBurnt();
      Haptics.warning();
    } else {
      audio.playHarvestPlop();
      Haptics.tap();
    }
  }

  // Xử lý cơ chế công an kiểm tra an toàn thực phẩm khi chiên bằng dầu đen sì:
  // Lần 1: Cảnh cáo + ghi biên bản đánh giá + trừ sao vệ sinh
  // Lần 2: Phạt 200.000đ + ghi biên bản phạt + trừ nặng sao vệ sinh
  // Lần 3: Game over ngay lập tức, chuyển vào bad ending vào tù
  private handlePoliceInspection(insp: PoliceInspectionResult) {
    if (insp.strike === 1) {
      audio.playBurnt();
      Haptics.warning();
      this.showToast('🚨 CÔNG AN NHẮC NHỞ: Dầu chiên đen sì không đảm bảo ATVSTP! (Lần 1) ⚠️');
      this.showPoliceNoticeModal(insp);
    } else if (insp.strike === 2) {
      audio.playBurnt();
      Haptics.warning();
      this.showToast('🚨 CÔNG AN XỬ PHẠT 200.000đ: Tái phạm chiên dầu đen khét lẹt lần 2! 💸');
      this.showPoliceNoticeModal(insp);
    } else if (insp.strike === 3) {
      audio.playBurnt();
      Haptics.warning();
      this.stopSellingPhase();
      this.openEndingModal('bad_police');
    }
  }

  private showPoliceNoticeModal(insp: PoliceInspectionResult) {
    const isStrike1 = insp.strike === 1;
    const badgeText = isStrike1
      ? '⚠️ BIÊN BẢN CẢNH CÁO VỆ SINH ATVSTP (LẦN 1/3)'
      : '🚨 QUYẾT ĐỊNH XỬ PHẠT HÀNH CHÍNH (LẦN 2/3)';
    const title = isStrike1
      ? 'Khách Hàng Phản Ánh Dầu Đen Khét Lẹt!'
      : 'Xử Phạt 200.000đ Tái Phạm Bán Gà Dầu Đen!';
    const quote = isStrike1
      ? 'Khách hàng vừa gọi phản ánh quán dùng dầu đen sì bốc khói khét lẹt để chiên bán, vi phạm nghiêm trọng ATVSTP! Dầu cháy đen sinh ra độc tố Acrylamide cực kỳ nguy hiểm cho sức khỏe! Lần đầu tôi lập biên bản nhắc nhở, yêu cầu bấm Thay Dầu (150k) ngay lập tức!'
      : 'Bất chấp phản ánh từ khách và biên bản cảnh cáo lần trước, tiệm vẫn ngoan cố dùng dầu đen sì chiên bán! Đội Quản lý & Công an chính thức lập biên bản xử phạt 200.000đ! Cảnh báo lần cuối: Nếu còn bị khách báo vi phạm lần thứ 3, tiệm sẽ bị niêm phong và khởi tố đi tù ngay lập tức!';
    const actionBtn = isStrike1
      ? '✍️ Ký Biên Bản & Cam Kết Thay Dầu Ngay'
      : '💸 Chấp Hành Nộp Phạt 200.000đ & Tiếp Tục Bán';

    const html = `
      <div class="incident-dialog">
        <div class="incident-avatar-wrap">
          <div class="incident-chibi-circle" style="background: #e3f2fd; border-color: #1976d2;">
            <div class="chibi-avatar-emoji">👮‍♂️</div>
          </div>
        </div>
        <div class="incident-pill-badge pill-failure">
          ${badgeText}
        </div>
        <h2 class="incident-main-title">${title}</h2>
        <div class="incident-char-subtitle">
          Đồng Chí Nam <span class="char-role-dot">●</span> Cảnh Sát Khu Vực & Đội Quản Lý Thị Trường
        </div>
        <div class="incident-body-box">
          <div class="incident-quote-card" style="border-left: 4px solid #1976d2; background: rgba(25, 118, 210, 0.08);">
            "${quote}"
          </div>
          <p class="incident-story-desc" style="margin-top: 10px; font-size: 0.82rem; color: #555;">
            ${isStrike1 
              ? '📋 Điểm sao Vệ Sinh của tiệm đã bị hạ và ghi vào nhật ký đánh giá. Hãy bấm "Thay dầu" để đảm bảo chất lượng!' 
              : '💸 200.000đ tiền phạt đã bị khấu trừ từ quỹ tiệm. Nếu tái phạm lần 3, bạn sẽ bị bắt đi tù (Game Over lập tức)!'}
          </p>
        </div>
        <div class="incident-choices-list" style="margin-top: 14px;">
          <button id="btn-police-confirm" class="incident-choice-btn btn-neutral-choice" style="background: #1976d2; color: #fff; justify-content: center; text-align: center;">
            <div class="choice-tier1" style="font-weight: 800;">${actionBtn}</div>
          </button>
        </div>
      </div>
    `;

    this.openModal(html);
    const btn = document.getElementById('btn-police-confirm');
    if (btn) {
      btn.onclick = () => {
        audio.playPop();
        this.closeModal();
        this.render();
      };
    }
  }

  private lastPetInteractAt = 0;
  private interactWithAlleyPet(kind: 'dog' | 'cat') {
    const now = Date.now();
    if (now - this.lastPetInteractAt < 1000) return;
    this.lastPetInteractAt = now;

    audio.playPop();
    Haptics.tap();

    if (kind === 'dog') {
      const dogEl = document.getElementById('btn-alley-pet-dog');
      const bubble = document.getElementById('pet-dog-bubble');
      if (dogEl) {
        dogEl.classList.remove('pet-tail-wag');
        void dogEl.offsetWidth;
        dogEl.classList.add('pet-tail-wag');
      }
      if (bubble) {
        bubble.innerHTML = `<img src="${ASSETS.icons.emoteDogBark}" class="pet-emote-icon" alt="" /><span>Gâu gâu! Chúc tiệm đắt khách! 🐶✨</span>`;
        bubble.style.display = 'flex';
        setTimeout(() => {
          if (bubble) bubble.style.display = 'none';
          if (dogEl) dogEl.classList.remove('pet-tail-wag');
        }, 2200);
      }
      this.showToast('🐶 Chó Vàng hớn hở vẫy đuôi: Gâu gâu!');
    } else {
      const catEl = document.getElementById('btn-alley-pet-cat');
      const bubble = document.getElementById('pet-cat-bubble');
      if (catEl) {
        catEl.classList.remove('pet-stretch');
        void catEl.offsetWidth;
        catEl.classList.add('pet-stretch');
      }
      if (bubble) {
        bubble.innerHTML = `<img src="${ASSETS.icons.emoteCatPurr}" class="pet-emote-icon" alt="" /><span>Meo meo... Chúc buôn may bán đắt! 🐾💖</span>`;
        bubble.style.display = 'flex';
        setTimeout(() => {
          if (bubble) bubble.style.display = 'none';
          if (catEl) catEl.classList.remove('pet-stretch');
        }, 2200);
      }
      this.showToast('🐱 Mèo Mướp lười biếng vươn vai: Meo meo~');
    }
  }

  // Mọi click trong màn bán hàng đi qua đây (một listener gắn một lần trên #main-view).
  // Đọc state tại thời điểm bấm, không dùng state bắt trong closure lúc render.
  private handleSellingClick(target: Element) {
    if (!this.sellingSession) return;

    // Bỏ qua hướng dẫn ngày đầu (Day 1 Onboarding Guide)
    const skipOnboardingBtn = target.closest<HTMLElement>('#btn-skip-onboarding');
    if (skipOnboardingBtn) {
      Haptics.tap();
      stateManager.update(draft => {
        draft.onboardingGuideDismissed = true;
        draft.onboardingGuideStep = 0;
      });
      document.getElementById('onboarding-guide-banner')?.remove();
      this.showToast('Đã tắt hướng dẫn ngày đầu! Chúc quán khai trương đại phát! 🍗✨');
      return;
    }

    // Bắt quả tang tên trộm rình mò
    const thiefBanner = target.closest<HTMLElement>('#btn-open-thief-bust, .thief-alert-strip');
    if (thiefBanner && this.sellingSession.activeThief) {
      Haptics.tap();
      this.openThiefMinigameModal(this.sellingSession.activeThief);
      return;
    }

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

    const cancelBtn = target.closest<HTMLElement>('.btn-cancel-order');
    if (cancelBtn) {
      Haptics.tap();
      const orderId = cancelBtn.dataset.orderId;
      if (orderId) this.cancelCustomerOrder(orderId);
      return;
    }

    const serveCustBtn = target.closest<HTMLElement>('.btn-serve-cust, .wooden-order-ticket.has-match');
    if (serveCustBtn) {
      Haptics.tap();
      const orderId = serveCustBtn.dataset.orderId || serveCustBtn.closest<HTMLElement>('.customer-card')?.dataset.orderId;
      if (orderId) this.serveCurrentCustomer(orderId);
      return;
    }

    const bunnyCard = target.closest<HTMLElement>('.customer-card[data-is-bunny="true"]');
    if (bunnyCard && !target.closest('.btn-cancel-order') && !target.closest('.btn-serve-cust') && !target.closest('.wooden-order-ticket.has-match')) {
      Haptics.tap();
      const letter = BUNNY_LETTERS.find(l => l.id === bunnyCard.dataset.letterId);
      if (letter) this.openBunnyLetterDialog(letter);
      else this.openBunnyGreetingDialog();
      return;
    }

    const cleanTableBtn = target.closest<HTMLElement>('.btn-clean-table, .patio-table.dirty');
    if (cleanTableBtn) {
      Haptics.tap();
      const idxStr = cleanTableBtn.dataset.tableIdx ?? cleanTableBtn.getAttribute('data-table-idx');
      if (idxStr !== null && idxStr !== undefined) {
        this.cleanPatioTable(Number(idxStr));
      }
      return;
    }

    const petDog = target.closest<HTMLElement>('#btn-alley-pet-dog');
    if (petDog) {
      this.interactWithAlleyPet('dog');
      return;
    }

    const petCat = target.closest<HTMLElement>('#btn-alley-pet-cat');
    if (petCat) {
      this.interactWithAlleyPet('cat');
      return;
    }

    const guideBtn = target.closest<HTMLElement>('#btn-open-kitchen-guide');
    if (guideBtn) {
      Haptics.tap();
      this.openKitchenGuideModal();
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
          // Cứu hộ khẩn cấp khi hết gà/bột giữa ca bán (Tham khảo aenhatrang.com report #48 & #21: Chờ Cô Chôm / Cứu hộ hết hàng)
          if (action === 'fry-chicken') {
            const curState = stateManager.getState();
            if (curState.money >= 50000 || curState.money < 10000) {
              const deductCost = curState.money >= 50000 ? 50000 : 0;
              stateManager.update(draft => {
                draft.money -= deductCost;
                const chicken = draft.inventory.chicken_meat;
                if (chicken && chicken.amount < 5) addStock(chicken, 5, 10000, 0);
                const flour = draft.inventory.flour;
                if (flour && flour.amount < 5) addStock(flour, 5, 5000, 0);
              });
              audio.playCash();
              this.showToast(deductCost > 0 
                ? '🛵 Bác Ba tiếp tế khẩn cấp: Gà tươi & Bột chiên (-50.000đ)! 🍗' 
                : '❤️ Bác Ba tương trợ khẩn cấp: Cho mượn tạm gà tươi & bột chiên! 🍗');
              if (this.useIngredients([...recipe.stock])) {
                session.totalFriedCount += 1;
                cookingEngine.startFrying(recipe.type);
                break;
              }
            }
          }
          if (action === 'fry-chicken') {
            this.showBacBaTip('out_of_chicken');
          }
          this.showToast(`Hết nguyên liệu cho ${FRY_LOOK[itemId]?.name ?? 'món này'}! Vào Kho hàng để nhập thêm.`);
          return;
        }
        session.totalFriedCount += 1;
        cookingEngine.startFrying(recipe.type);
        audio.playCrispyDrop();
        Haptics.tap();
        if (action === 'fry-chicken') {
          if (stateManager.getState().day === 1 && stateManager.getState().onboardingGuideStep === 1) {
            stateManager.update(draft => { draft.onboardingGuideStep = 2; });
          }
          const s = cookingEngine.getActiveSeasoning();
          if (s === 'spicy') {
            this.showToast('🔥 Đang chiên Cánh Gà Sốt Cay Yangnyeom thơm nức mũi! Chờ chín vàng rồi vớt!');
          } else if (s === 'honey') {
            this.showToast('🍯 Đang chiên Gà Sốt Bơ Tỏi Đậu Nành béo ngậy! Chờ chín vàng rồi vớt!');
          }
        }
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
        audio.playPourFizz();
        Haptics.pourDrink();
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
        audio.playPourFizz();
        Haptics.pourDrink();
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
        audio.playPourFizz();
        Haptics.pourDrink();
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
        audio.playPourFizz();
        Haptics.pourDrink();
        this.showToast('🍊 Đang rót đầy ly Fanta Cam bùng nổ sảng khoái!');
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
        if (stateManager.getState().day === 1 && stateManager.getState().onboardingGuideStep === 2) {
          stateManager.update(draft => { draft.onboardingGuideStep = 3; });
        }
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
        const curState = stateManager.getState();
        const willBeFree = !curState.freeOilFilterUsed && curState.day <= 3;
        let changed = false;
        stateManager.update(draft => { changed = changeOil(draft); });
        if (!changed) {
          this.showToast(`Không đủ ${OIL_CHANGE_COST.toLocaleString('vi-VN')}đ để thay dầu mới!`);
          return;
        }
        audio.playCash();
        if (willBeFree) {
          this.showToast('🎁 Bác Ba tặng can dầu sạch miễn phí tân thủ (Ngày 1-3)! Dầu vàng óng 5 sao! ✨');
        } else {
          this.showToast('Đã thay dầu chiên mới tinh vàng óng! Vệ sinh 5 sao! ✨');
        }
        break;
      }

      case 'season-spicy':
      case 'season-honey': {
        const sauce: Sauce = action === 'season-spicy' ? 'spicy' : 'honey';
        if (cookingEngine.getActiveSeasoning() === sauce) {
          cookingEngine.setSeasoning(null);
          audio.playPop();
          this.showToast('🍗 Đã hủy ướp sốt, chiên Gà Rán Giòn truyền thống.');
        } else if ((stateManager.getState().inventory[SAUCE_STOCK[sauce]]?.amount ?? 0) < 1) {
          this.showToast('Hết sốt trong kho! Vào Kho hàng để nhập thêm.');
          return;
        } else {
          cookingEngine.setSeasoning(sauce);
          audio.playPop();
          if (sauce === 'spicy') {
            this.showToast('🌶️ ĐÃ ƯỚP SỐT CAY! Giờ hãy chạm [🍗 Gà Tẩm Bột] để chiên mẻ Cánh Gà Sốt Cay!');
          } else {
            this.showToast('🧄 ĐÃ ƯỚP BƠ TỎI! Giờ hãy chạm [🍗 Gà Tẩm Bột] để chiên mẻ Gà Bơ Tỏi Đậu Nành!');
          }
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

  // Dọn dẹp bàn ăn hiên quán: hỗ trợ chà khăn lau bằng tay hoặc tap liên tục
  private cleanPatioTable(tableIndex: number) {
    const session = this.sellingSession;
    if (!session) return;
    // Mỗi cú tap cọ xát một nhịp (~600ms tương đương ~18% tiến trình)
    const res = scrubDineInTable(session, tableIndex, 600, false);
    if (res.completed) {
      this.onTableCleanCompleted(tableIndex, res.tipCollected ?? 0, res.tableName ?? `Bàn ${tableIndex + 1}`);
    } else {
      Haptics.tap();
      audio.playPop();
      this.showToast(`🧼 Chà ngón tay qua lại trên bàn 3-4s để lau sạch bong nhé! (${res.progress}%)`);
    }
  }

  // Khởi động thao tác cọ xát / chà khăn lau bàn bằng cử chỉ chạm giữ
  private startScrubbingPatioTable(tableIndex: number, clientX: number, clientY: number) {
    const session = this.sellingSession;
    if (!session) return;
    this.scrubbingTableIndex = tableIndex;
    this.lastScrubPos = { x: clientX, y: clientY };

    // Kích hoạt ngay một nhịp cọ ban đầu
    const res = scrubDineInTable(session, tableIndex, 100, false);
    if (res.completed) {
      this.onTableCleanCompleted(tableIndex, res.tipCollected ?? 0, res.tableName ?? `Bàn ${tableIndex + 1}`);
      this.stopScrubbingPatioTable();
      return;
    }

    if (this.scrubIntervalId) clearInterval(this.scrubIntervalId);
    this.scrubIntervalId = window.setInterval(() => {
      if (this.scrubbingTableIndex === null || !this.sellingSession) {
        this.stopScrubbingPatioTable();
        return;
      }
      const tickRes = scrubDineInTable(this.sellingSession, this.scrubbingTableIndex, 80, false);
      if (tickRes.completed) {
        this.onTableCleanCompleted(this.scrubbingTableIndex, tickRes.tipCollected ?? 0, tickRes.tableName ?? `Bàn ${this.scrubbingTableIndex + 1}`);
        this.stopScrubbingPatioTable();
      }
    }, 80);
  }

  // Xử lý cử chỉ di chuyển ngón tay chà qua lại (Vigorous rubbing acceleration)
  private onPointerMoveScrub(clientX: number, clientY: number) {
    if (this.scrubbingTableIndex === null || !this.sellingSession) return;
    const dx = clientX - this.lastScrubPos.x;
    const dy = clientY - this.lastScrubPos.y;
    const dist = Math.hypot(dx, dy);

    // Người chơi di chuyển chà ngón tay: gia tốc tốc độ lau gấp ~1.85 lần (chỉ mất ~1.8s - 2.0s)
    if (dist >= 6) {
      this.lastScrubPos = { x: clientX, y: clientY };
      const res = scrubDineInTable(this.sellingSession, this.scrubbingTableIndex, 120, true);
      if (res.completed) {
        this.onTableCleanCompleted(this.scrubbingTableIndex, res.tipCollected ?? 0, res.tableName ?? `Bàn ${this.scrubbingTableIndex + 1}`);
        this.stopScrubbingPatioTable();
      }
    }
  }

  // Ngừng cọ xát khi nhấc ngón tay ra
  private stopScrubbingPatioTable() {
    if (this.scrubIntervalId) {
      clearInterval(this.scrubIntervalId);
      this.scrubIntervalId = null;
    }
    if (this.scrubbingTableIndex !== null && this.sellingSession) {
      stopScrubbingDineInTable(this.sellingSession, this.scrubbingTableIndex);
      this.scrubbingTableIndex = null;
    }
  }

  // Hoàn tất dọn bàn: âm thanh, haptic và thu tiền tip
  private onTableCleanCompleted(_tableIndex: number, tipCollected: number, tableName: string) {
    audio.playWoodClean();
    audio.playCoinChing();
    Haptics.cleanTable();
    this.showToast(`✨ Đã lau sạch bóng ${tableName}! Thu gom +${tipCollected.toLocaleString('vi-VN')}đ tiền tip 🪙🫧`);
    this.sellingStructureKey = '';
    this.render();
  }

  // Giao món cho khách trong hàng đợi (ưu tiên khách đầu hoặc khách có món khớp)
  private serveCurrentCustomer(targetOrderId?: string) {
    const session = this.sellingSession;
    if (!session) return;
    const menu = stateManager.getState().menu;
    const curState = stateManager.getState();
    const result = serveFirstOrder(
      session,
      cookingEngine.getTray(),
      id => menu.find(m => m.id === id)?.currentPrice ?? 0,
      idx => cookingEngine.removeFromTray(idx),
      curState.upgrades,
      targetOrderId,
      curState.secretSauceDay?.buffActive,
      curState.unlockedCurioIds,
      curState.customSignatureDishesUnlocked
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
        this.showToast('Đồ ăn trong khay không khớp với món khách nào đang gọi!');
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
      case 'incomplete-finish': {
        audio.playCash();
        Haptics.warning();
        const missingNames = (result.missingItemIds ?? [])
          .map(id => menu.find(m => m.id === id)?.name || id)
          .join(', ');
        this.showToast(`⚠️ GIAO THIẾU MÓN! Khách nhận phần có sẵn (+${result.paid.toLocaleString('vi-VN')}đ) và bực bội bỏ đi vì thiếu ${missingNames}! 📦`);
        const review = ReviewsEngine.generateCustomerReview(stateManager.getState().day, result.order, {
          kind: 'incomplete',
          patienceRatio: result.order.patienceCurrent / Math.max(1, result.order.patienceMax),
          menuLookup: id => menu.find(m => m.id === id)?.name || id
        });
        let policeInsp: PoliceInspectionResult | null = null;
        stateManager.update(draft => {
          creditSale(draft, result.paid, 0);
          ReviewsEngine.applyRealtimeReview(draft, review);
          if (curState.oilCondition === 'dirty') {
            policeInsp = checkPoliceOilInspection(draft);
          }
        });
        if (policeInsp) {
          this.handlePoliceInspection(policeInsp);
        }
        this.render();
        return;
      }
      case 'wrong-item': {
        audio.playBurnt();
        Haptics.warning();
        this.showToast(`❌ GIAO SAI MÓN! Đơn cần ${result.requestedName} nhưng khay đưa ${result.wrongItemName}, khách bực tức bỏ về! 😡`);
        const review = ReviewsEngine.generateCustomerReview(stateManager.getState().day, result.order, {
          kind: 'wrong',
          patienceRatio: result.order.patienceCurrent / Math.max(1, result.order.patienceMax),
          menuLookup: id => menu.find(m => m.id === id)?.name || id
        });
        stateManager.update(draft => {
          ReviewsEngine.applyRealtimeReview(draft, review);
        });
        this.render();
        return;
      }
      case 'complete':
        Haptics.serveSuccess();
        audio.playServingBell();
        audio.playCoinChing();
        if (curState.day === 1 && (curState.onboardingGuideStep ?? 0) >= 1) {
          stateManager.update(draft => {
            draft.onboardingGuideStep = 0;
            draft.onboardingGuideDismissed = true;
          });
          document.getElementById('onboarding-guide-banner')?.remove();
        }
        break;
      default:
        this.render();
        return;
    }

    const { order, paid, tip: initialTip, feedbackNotes } = result;
    let tip = initialTip;

    // Đơn giao xa: nếu có Shipper nhà -> Shipper hỏa tốc giao an toàn, tự động nhận tip mà không gián đoạn ca bán!
    const houseDriver = curState.staff.find(m => m.role === 'delivery' && m.mood > 25);
    const isLongDistanceDelivery = order.isDelivery && order.isLongDistance && !order.isBunny && (curState.deliveryRunnerDayCount ?? 0) < 2;
    if (isLongDistanceDelivery) {
      if (houseDriver) {
        const extraDriverTip = 25000;
        tip += extraDriverTip;
        this.showToast(`🛵 Shipper ${houseDriver.name} đã hỏa tốc giao đơn xa an toàn! (+${extraDriverTip.toLocaleString('vi-VN')}đ tip) 📦`);
        audio.playCash();
      } else {
        this.promptDeliveryRunner(order, paid, tip, feedbackNotes);
        return;
      }
    }

    let letter: BunnyLetter | undefined;
    const patienceRatio = order.patienceCurrent / Math.max(1, order.patienceMax);
    const hasBurnt = (order.burntPenalty ?? 0) > 0;
    const hasDirtyOil = curState.oilCondition === 'dirty';
    const orderBasePrice = order.items.reduce((sum, it) => {
      const def = menu.find(m => m.id === it.menuItemId);
      return sum + (def?.basePrice ?? 30000) * it.count;
    }, 0);
    const orderPriceRatio = orderBasePrice > 0 ? order.totalPrice / orderBasePrice : 1.0;
    const spaceLevel = curState.upgrades.space?.currentLevel || 1;
    const isPerfect = (order.perfectBonus ?? 0) > 0;

    // Số lượt đánh giá chỉ chiếm ~1/3 số khách: (session.servedCount % 3 === 0)
    // Trừ trường hợp đặc biệt: sự cố nghiêm trọng (gà cháy, dầu bẩn) hoặc khách VIP / Bé Thỏ
    const isSevereIncident = hasBurnt || hasDirtyOil;
    const isVipCustomer = order.isBunny || (order.personalityLabel && order.personalityLabel.includes('VIP'));
    const shouldGenerateReview = isSevereIncident || isVipCustomer || (session.servedCount % 3 === 0);

    const review = shouldGenerateReview ? ReviewsEngine.generateCustomerReview(curState.day, order, {
      kind: 'complete',
      patienceRatio,
      hasBurnt,
      hasDirtyOil,
      isPerfect,
      menuLookup: id => menu.find(m => m.id === id)?.name || id,
      priceRatio: orderPriceRatio,
      spaceLevel
    }) : null;

    // Hiệu ứng thực tế của Thu Ngân (Cashier): Khách vui vẻ tặng thêm tip nóng (1.000đ - 3.000đ/đơn)
    const cashierBonus = curState.staff
      .filter(m => m.role === 'cashier' && m.mood > 25)
      .reduce((sum, c) => {
        const p = (c.skill / 100) * (0.6 + 0.4 * c.mood / 100);
        return sum + Math.round(1500 * p);
      }, 0);
    const finalTip = tip + (order.personality !== 'frugal' && !order.isBunny ? cashierBonus : 0);

    let policeInsp: PoliceInspectionResult | null = null;
    stateManager.update(draft => {
      creditSale(draft, paid, finalTip);
      recordWeeklyQuestProgress(draft, 'serve_customer', 1);
      if (finalTip > tip && this.sellingSession) {
        this.sellingSession.tips += (finalTip - tip);
      }
      if (order.isBunny) letter = applyBunnyReward(draft, order);
      if (review) {
        ReviewsEngine.applyRealtimeReview(draft, review);
      }
      if (hasDirtyOil) {
        policeInsp = checkPoliceOilInspection(draft);
      }
    });

    if (policeInsp) {
      this.handlePoliceInspection(policeInsp);
    }

    // Tích lũy Điểm Thân Thiết & Quà Quê Tri Kỷ Hẻm 1102
    if (order.characterId) {
      let leveledUp = false;
      let newLevel = 0;
      let giftNotice: string | undefined;

      stateManager.update(draft => {
        const loyalty = ensureLoyaltyState(draft);
        const expGained = order.dietaryFulfilled ? 45 : (isPerfect ? 30 : 15);
        const lRes = recordCustomerLoyaltyVisit(
          loyalty,
          order.characterId!,
          draft.day,
          isPerfect,
          !!order.dietaryFulfilled,
          expGained
        );
        leveledUp = lRes.leveledUp;
        newLevel = lRes.newHeartLevel;
        if (lRes.newGift) {
          giftNotice = lRes.newGift.giftLabel;
        }
      });

      if (order.dietaryFulfilled) {
        audio.playCoinChing();
        Haptics.combo();
        this.showToast(`💖 ĐÚNG GU HẺM 1102! ${order.customerName} khen nức nở (+${(order.dietaryPreference?.bonusTip ?? 0).toLocaleString('vi-VN')}đ tip)!`);
      }

      if (leveledUp) {
        audio.playGoldChime();
        this.showToast(`✨ THÂN THIẾT CẤP ${newLevel} ❤️! ${order.customerName} đã trở thành ${HEART_LEVEL_TITLES[newLevel]}!`);
        if (giftNotice) {
          this.showToast(`🎁 ${order.customerName} gửi tặng tiệm Quà Quê (${giftNotice}), hãy kiểm tra vào sáng mai nhé!`);
        }
      }
    }

    // Nếu khách chọn ngồi ăn tại bàn hiên quán (Dine-In) và có bàn trống
    let seatedAtTable: DineInTable | null = null;
    if (this.sellingSession && order.isDineIn && this.sellingSession.dineInTables) {
      const emptyTable = this.sellingSession.dineInTables.find(t => t.status === 'empty');
      if (emptyTable) {
        seatedAtTable = emptyTable;
        emptyTable.status = 'eating';
        emptyTable.customerName = order.customerName;
        emptyTable.customerAvatar = order.avatar;
        emptyTable.foodName = order.items[0]
          ? (stateManager.getState().menu.find(m => m.id === order.items[0]?.menuItemId)?.name || 'Gà Rán Giòn')
          : 'Gà Rán Giòn';
        emptyTable.foodIcon = '🍗';
        emptyTable.eatingDurationSec = 8;
        emptyTable.eatingTimerSec = 8;
        emptyTable.tipAmount = finalTip;
        emptyTable.isCritic = !!order.isCriticVip;
        this.sellingStructureKey = '';
      }
    }

    // Đưa khách vào danh sách diễn hoạt nhận món & quay người rời quán (The 4-Beat Serving Cadence) nếu mang về
    if (this.sellingSession && !seatedAtTable) {
      this.sellingSession.departingCustomers ??= [];
      this.sellingSession.departingCustomers.push({
        order,
        phase: 'receiving',
        startedAt: performance.now(),
        paid,
        tip: finalTip,
        isDelighted: (order.burntPenalty ?? 0) === 0 && (finalTip > 0 || (order.perfectBonus ?? 0) > 0),
        takeawayItemName: order.items[0]
          ? (stateManager.getState().menu.find(m => m.id === order.items[0]?.menuItemId)?.name || 'Gà Rán Giòn')
          : 'Gà Rán Giòn'
      });
      this.sellingStructureKey = '';
    }

    if (letter) {
      setTimeout(() => {
        audio.playPerfect();
        if (letter) this.openBunnyLetterDialog(letter, true);
      }, 750); // Đệm trễ 750ms để người chơi ngắm trọn vẹn cử chỉ nhận đồ và vẫy cánh chào của Bé Gà Bông!
    } else if (order.isBunny) {
      audio.playCash();
      this.showToast(`🐥 Bé Gà Bông gật gù hạnh phúc, tip thêm ${BUNNY_VISIT_TIP.toLocaleString('vi-VN')}đ và vẫy cánh chào! 💖`);
    } else if (seatedAtTable) {
      audio.playCash();
      if (order.isCriticVip) {
        this.showToast(`⭐ Giám khảo ẩm thực ngồi vào ${seatedAtTable.name} thưởng thức & thẩm định! (+${paid.toLocaleString('vi-VN')}đ) 🍽️`);
      } else {
        this.showToast(`🍽️ ${order.customerName} ngồi vào ${seatedAtTable.name} dùng món nóng giòn! (+${paid.toLocaleString('vi-VN')}đ) ✨`);
      }
    } else {
      audio.playCash();
      const personalityTag = order.personalityLabel ? `[${order.personalityLabel}] ` : '';
      const notesStr = (feedbackNotes && feedbackNotes.length > 0)
        ? feedbackNotes.join(' · ')
        : (finalTip > 0 ? `+${(finalTip / 1000).toLocaleString('vi-VN')}k tip` : '0đ tip');
      this.showToast(`${personalityTag}+${(paid + finalTip).toLocaleString('vi-VN')}đ (${notesStr}) 💵`);
    }
    this.render();
  }

  // --- MINIGAME CHỢ ĐẦU MỐI CHỢ LỚN (ĐÀM PHÁN GIÁ SỈ) ---
  public openMarketBargainModal() {
    const state = stateManager.getState();
    const wholesaler = getTodayWholesaler(state.day);
    audio.playPop();
    this.openModal(renderMarketBargainModal(wholesaler, null));

    const closeBtn = document.getElementById('btn-close-market');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
        this.render();
      };
    }

    const tacticBtns = document.querySelectorAll<HTMLElement>('.btn-bargain-tactic');
    tacticBtns.forEach(btn => {
      btn.onclick = () => {
        const tactic = btn.dataset.tactic as BargainTactic;
        if (!tactic) return;
        const result = executeBargain(wholesaler, tactic);
        stateManager.update(draft => {
          draft.todayMarketBargained = true;
          draft.todayMarketDiscount = result.discountPct;
        });
        audio.playCash();
        if (result.discountPct >= 25) {
          audio.playGoldChime();
        }
        this.openModal(renderMarketBargainModal(wholesaler, result));
        const resultCloseBtn = document.getElementById('btn-close-bargain-result') || document.getElementById('btn-close-market');
        if (resultCloseBtn) {
          resultCloseBtn.onclick = () => {
            audio.playPop();
            this.closeModal();
            this.render();
            this.showToast(result.discountPct > 0
              ? `🛒 Giảm giá nhập sỉ ${result.discountPct}% cho toàn bộ nguyên liệu hôm nay!`
              : '🛒 Hôm nay tiểu thương giữ nguyên giá sỉ gốc.');
          };
        }
      };
    });
  }

  // --- MINIGAME CHẠY XE GIAO ĐƠN XA (HẺM 1102 EXPRESS) ---
  private promptDeliveryRunner(
    order: CustomerOrder,
    paid: number,
    baseTip: number,
    feedbackNotes?: string[]
  ) {
    if (this.sellingSession) this.sellingSession.isPaused = true;
    this.incidentPausedSelling = true;
    audio.playPop();
    this.openModal(renderDeliveryPromptModal(order));

    const outsourceBtn = document.getElementById('btn-outsource-delivery');
    if (outsourceBtn) {
      outsourceBtn.onclick = () => {
        audio.playCash();
        const runRes = DeliveryRunnerEngine.evaluateOutsource();
        this.finishDeliveryRunner(order, paid, baseTip, runRes, feedbackNotes);
      };
    }

    const runBtn = document.getElementById('btn-start-delivery-run');
    if (runBtn) {
      runBtn.onclick = () => {
        audio.playPop();
        this.startDeliveryRunnerGame(order, paid, baseTip, feedbackNotes);
      };
    }
  }

  private startDeliveryRunnerGame(
    order: CustomerOrder,
    paid: number,
    baseTip: number,
    feedbackNotes?: string[]
  ) {
    const runState = DeliveryRunnerEngine.createInitialState(15);
    this.openModal(renderDeliveryRunnerGame(runState));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        DeliveryRunnerEngine.moveLeft(runState);
        audio.playPop();
        this.updateRunnerDom(runState);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        DeliveryRunnerEngine.moveRight(runState);
        audio.playPop();
        this.updateRunnerDom(runState);
      }
    };
    window.addEventListener('keydown', onKey);

    const modalContent = document.getElementById('modal-content');
    const onModalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#btn-runner-left')) {
        DeliveryRunnerEngine.moveLeft(runState);
        audio.playPop();
        this.updateRunnerDom(runState);
      } else if (target.closest('#btn-runner-right')) {
        DeliveryRunnerEngine.moveRight(runState);
        audio.playPop();
        this.updateRunnerDom(runState);
      } else {
        const laneEl = target.closest<HTMLElement>('[data-runner-lane]');
        if (laneEl) {
          const lane = parseInt(laneEl.dataset.runnerLane || '1', 10);
          if (lane === 0 || lane === 1 || lane === 2) {
            DeliveryRunnerEngine.setLane(runState, lane);
            audio.playPop();
            this.updateRunnerDom(runState);
          }
        }
      }
    };
    modalContent?.addEventListener('click', onModalClick);

    const cleanup = () => {
      window.removeEventListener('keydown', onKey);
      modalContent?.removeEventListener('click', onModalClick);
      clearInterval(loopTimer);
    };

    const loopTimer = setInterval(() => {
      if (!this.isModalOpen()) {
        cleanup();
        return;
      }

      const crashed = DeliveryRunnerEngine.tick(runState, 60);
      if (crashed) {
        audio.playBurnt();
        Haptics.warning();
      }

      this.updateRunnerDom(runState);

      if (runState.isFinished) {
        cleanup();
        const result = DeliveryRunnerEngine.evaluateResult(runState);
        this.finishDeliveryRunner(order, paid, baseTip, result, feedbackNotes);
      }
    }, 60);
  }

  private updateRunnerDom(state: DeliveryRunState) {
    const content = document.getElementById('modal-content');
    if (!content) return;
    content.innerHTML = renderDeliveryRunnerGame(state);
  }

  private finishDeliveryRunner(
    order: CustomerOrder,
    paid: number,
    baseTip: number,
    runResult: DeliveryRunResult,
    _feedbackNotes?: string[]
  ) {
    const curState = stateManager.getState();
    const menu = curState.menu;
    const patienceRatio = order.patienceCurrent / Math.max(1, order.patienceMax);
    const hasBurnt = (order.burntPenalty ?? 0) > 0;
    const hasDirtyOil = curState.oilCondition === 'dirty';
    const isPerfect = runResult.mode === 'manual' && runResult.crashes === 0;

    const finalTip = Math.max(0, baseTip + runResult.tipBonus);
    const costDeduction = runResult.mode === 'outsourced' ? 15000 : 0;

    const review = ReviewsEngine.generateCustomerReview(curState.day, order, {
      kind: 'complete',
      patienceRatio: isPerfect ? 1.0 : patienceRatio,
      hasBurnt,
      hasDirtyOil,
      isPerfect,
      menuLookup: id => menu.find(m => m.id === id)?.name || id,
      priceRatio: 1.0,
      spaceLevel: curState.upgrades.space?.currentLevel || 1
    });

    if (review && runResult.speedRatingDelta !== 0) {
      review.stars = Math.max(1, Math.min(5, Number((review.stars + runResult.speedRatingDelta).toFixed(1))));
    }

    let policeInsp: PoliceInspectionResult | null = null;
    stateManager.update(draft => {
      draft.deliveryRunnerDayCount = (draft.deliveryRunnerDayCount ?? 0) + 1;
      creditSale(draft, paid, finalTip);
      if (costDeduction > 0) {
        draft.money = Math.max(0, draft.money - costDeduction);
      }
      if (review) {
        ReviewsEngine.applyRealtimeReview(draft, review);
      }
      if (hasDirtyOil) {
        policeInsp = checkPoliceOilInspection(draft);
      }
    });

    if (policeInsp) {
      this.handlePoliceInspection(policeInsp);
    }

    if (isPerfect) {
      audio.playGoldChime();
    } else {
      audio.playCash();
    }

    this.openModal(renderDeliveryResultModal(runResult));
    const closeBtn = document.getElementById('btn-close-delivery-result');
    if (closeBtn) {
      closeBtn.onclick = () => {
        audio.playPop();
        this.closeModal();
        if (this.sellingSession) {
          this.sellingSession.isPaused = false;
          this.lastTimestamp = performance.now();
        }
        const tipStr = finalTip > 0 ? ` (+${finalTip.toLocaleString('vi-VN')}đ tip)` : '';
        const outsourceStr = costDeduction > 0 ? ` (-${costDeduction.toLocaleString('vi-VN')}đ ship)` : '';
        this.showToast(`🛵 Giao đơn ${order.customerName}: +${paid.toLocaleString('vi-VN')}đ${tipStr}${outsourceStr}!`);
        this.render();
      };
    }
  }

  // Hủy đơn của khách hàng khi hết món/hết nguyên liệu và gửi lời xin lỗi lịch sự
  private cancelCustomerOrder(orderId: string) {
    const session = this.sellingSession;
    if (!session) return;
    const menu = stateManager.getState().menu;
    const result = cancelAndApologizeOrder(
      session,
      orderId,
      id => menu.find(m => m.id === id)?.currentPrice ?? 0
    );
    if (!result.success || !result.order) return;

    audio.playPop();
    Haptics.tap();
    const curState = stateManager.getState();
    const review = ReviewsEngine.generateCustomerReview(curState.day, result.order, {
      kind: 'apologized',
      patienceRatio: result.order.patienceCurrent / Math.max(1, result.order.patienceMax),
      menuLookup: id => menu.find(m => m.id === id)?.name || id
    });

    if (result.paid > 0) {
      audio.playCash();
      stateManager.update(draft => {
        creditSale(draft, result.paid, 0);
        ReviewsEngine.applyRealtimeReview(draft, review);
      });
      this.showToast(`🙏 Quán xin lỗi do hết món. Khách thanh toán ${result.paid.toLocaleString('vi-VN')}đ phần đã nhận: "${result.apologyReply}"`);
    } else {
      stateManager.update(draft => {
        ReviewsEngine.applyRealtimeReview(draft, review);
      });
      this.showToast(`🙏 Quán xin lỗi do hết món. Khách thông cảm: "${result.apologyReply}"`);
    }
    this.render();
  }

  // --- FINISH DAY & SUMMARY ---
  public finishDay() {
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

    // Cảnh báo dầu đen khi đóng cửa
    if (result.dirtyOilWarning) {
      this.showToast('⚠️ Dầu chiên đen thui! Ngày mai sao Vệ sinh + Hương vị sẽ bị trừ. Nhớ thay dầu sớm nha!');
    }

    audio.playGoldChime();
    if (result.ledger.netProfit > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f7d046', '#c98e1e', '#3ca346', '#faeed1']
        });
      } catch {}
    }
    // Lưu lại kết quả rent để hiển thị modal sau summary
    const rentResult = result.rentDue;
    this.openModal(renderSummaryModal(stateManager.getState(), result.ledger, result.review, result.advisorTip));
    this.bindSummaryEvents(result.ledger, result.review, result.advisorTip, rentResult);
  }

  // Mở hộp thoại phản hồi đánh giá khách hàng (Có Bác Ba / AI Cố vấn mách nước)
  private openReviewReplyDialog(review: CustomerReview, onFinished?: () => void) {
    const currentReview = stateManager.getState().recentReviews.find(r => r.id === review.id) || review;
    this.openModal(renderReviewReplyModal(currentReview));

    const handleClose = () => {
      audio.playPop();
      this.closeModal();
      if (onFinished) {
        onFinished();
      }
    };

    const closeBtn = document.getElementById('btn-close-reply-modal');
    if (closeBtn) {
      closeBtn.onclick = handleClose;
    }

    const cancelBtn = document.getElementById('btn-cancel-reply-modal');
    if (cancelBtn) {
      cancelBtn.onclick = handleClose;
    }

    const iconCloseBtn = document.getElementById('btn-modal-close-icon');
    if (iconCloseBtn) {
      iconCloseBtn.onclick = handleClose;
    }

    const chooseBtns = document.querySelectorAll('.btn-choose-reply');
    chooseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnEl = e.currentTarget as HTMLElement;
        const reviewId = btnEl.getAttribute('data-review-id');
        const optionId = btnEl.getAttribute('data-option-id');
        if (!reviewId || !optionId) return;

        let resultOutcome: { customerReaction: string; bonusText: string } | null = null;
        stateManager.update(draft => {
          resultOutcome = ReviewsEngine.replyToReview(draft, reviewId, optionId);
        });
        stateManager.flush();

        audio.playPerfect();
        Haptics.serveSuccess();

        if (resultOutcome) {
          this.showToast('Đã phản hồi đánh giá! Thực khách rất cảm kích 💌');
        }

        const updatedReview = stateManager.getState().recentReviews.find(r => r.id === reviewId) || currentReview;
        this.openReviewReplyDialog(updatedReview, onFinished);
      });
    });
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

  private bindSummaryEvents(ledger: DayLedger, review: CustomerReview, advisorTip: string, rentDue?: DayResult['rentDue']) {
    this.bindWrappedButton();

    // Nút phản hồi review trực tiếp từ màn Tổng Kết Cuối Ngày
    const summaryReplyBtn = document.getElementById('btn-summary-reply-review');
    if (summaryReplyBtn) {
      summaryReplyBtn.onclick = () => {
        audio.playPop();
        this.openReviewReplyDialog(review, () => {
          const freshReview = stateManager.getState().recentReviews.find(r => r.id === review.id) || review;
          this.openModal(renderSummaryModal(stateManager.getState(), ledger, freshReview, advisorTip));
          this.bindSummaryEvents(ledger, freshReview, advisorTip, rentDue);
        });
      };
    }

    // Nút Mở Quà Quê Tri Kỷ Hẻm 1102 từ màn Tổng Kết Cuối Ngày
    const summaryLoyaltyBtn = document.getElementById('btn-summary-open-loyalty');
    if (summaryLoyaltyBtn) {
      summaryLoyaltyBtn.onclick = () => {
        audio.playPop();
        openLoyaltyHandbookModal(stateManager.getState(), () => {
          stateManager.saveState();
          this.openModal(renderSummaryModal(stateManager.getState(), ledger, review, advisorTip));
          this.bindSummaryEvents(ledger, review, advisorTip, rentDue);
        });
      };
    }

    // Nút Lọc Cặn Dầu & Vớt Bột Cháy Cuối Ngày
    const oilFilterBtn = document.getElementById('btn-open-oil-filter');
    if (oilFilterBtn) {
      oilFilterBtn.onclick = () => {
        audio.playPop();
        openOilFilterModal(stateManager.getState(), {
          onSuccess: (result) => {
            stateManager.flush();
            Haptics.serveSuccess();
            if (result.success && !result.isPartial) {
              this.showToast(`🎉 Đã vớt sạch cặn chảo! Dầu phục hồi thành công, tiết kiệm ${result.savedMoney.toLocaleString('vi-VN')}đ! ✨`);
            } else if (result.isPartial) {
              this.showToast(`🧹 Đã vớt ${result.collectedCount}/${result.totalCrumbs} cặn! Được giảm 50% tiền thay dầu.`);
            } else {
              this.showToast('⚠️ Vẫn còn cặn bột trong chảo! Cần thay dầu để đạt điểm vệ sinh.');
            }
          },
          onClose: () => {
            this.openModal(renderSummaryModal(stateManager.getState(), ledger, review, advisorTip));
            this.bindSummaryEvents(ledger, review, advisorTip, rentDue);
          }
        });
      };
    }

    // Nút Bật Đài Phát Thanh Đêm FM 99.9 từ màn Tổng Kết Cuối Ngày
    this.lastSummaryData = { ledger, review, advisorTip, rentDue };
    const summaryRadioBtn = document.getElementById('btn-summary-open-radio');
    if (summaryRadioBtn) {
      summaryRadioBtn.onclick = () => {
        audio.playPop();
        this.openNightRadioModal();
      };
    }

    // Nút Bắt đầu Ngày mới
    const nextDayBtn = document.getElementById('btn-start-next-day');
    if (nextDayBtn) {
      nextDayBtn.onclick = () => {
        // === Tiền mặt bằng cuối tuần ===
        if (rentDue) {
          this.showRentModal(rentDue, ledger, review, advisorTip);
          return;
        }

        // Kiểm tra Ký ức đêm Hẻm 1102 (QBN Night Storylet)
        const nightStorylet = pickNightStorylet(stateManager.getState(), NIGHT_STORYLETS);
        if (nightStorylet) {
          this.openStoryletModal(nightStorylet, () => this.proceedToNextDay());
          return;
        }

        this.proceedToNextDay();
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

  // Modal tiền mặt bằng cuối tuần
  private showRentModal(rentDue: NonNullable<DayResult['rentDue']>, _ledger: DayLedger, _review: CustomerReview, _advisorTip: string) {
    const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';
    const html = `
      <div class="incident-dialog" style="text-align:center;">
        <div class="incident-avatar-wrap">
          <div class="incident-chibi-circle"><div class="chibi-avatar-emoji">🏠</div></div>
          <div class="incident-heart-badge">💰</div>
        </div>
        <div class="incident-pill-badge">TIỀN MẶT BẰNG TUẦN ${rentDue.weekNum}</div>
        <h2 class="incident-main-title">Tới hẹn đóng tiền mặt bằng rồi nè!</h2>
        <div class="incident-story-box">
          <p class="incident-story-desc">
            Chủ nhà tới thu tiền mặt bằng tuần ${rentDue.weekNum}. 
            ${rentDue.canPay 
              ? `Bạn cần trả <b>${vnd(rentDue.amount)}</b>. Tiền trong ví đủ chi trả.`
              : `Bạn cần <b>${vnd(rentDue.amount)}</b> nhưng ví chỉ còn <b>${vnd(stateManager.getState().money)}</b>. Thiếu tiền rồi nè!`}
          </p>
          ${!rentDue.canPay ? `
            <div class="incident-security-tip">
              ⚠️ <i>Nếu không trả được, giang hồ khu phố sẽ tới "hỏi thăm" — khách sợ không dám ghé tiệm 3 ngày liền!</i>
            </div>
          ` : ''}
        </div>
        <div class="incident-choices-list">
          ${rentDue.canPay ? `
            <button id="btn-pay-rent" class="incident-choice-btn btn-warm-choice">
              <div class="choice-tier1">💵 Đóng tiền mặt bằng (${vnd(rentDue.amount)})</div>
              <div class="choice-tier2">Trả đàng hoàng, yên ổn làm ăn</div>
            </button>
          ` : ''}
          <button id="btn-skip-rent" class="incident-choice-btn btn-cream-choice">
            <div class="choice-tier1">${rentDue.canPay ? '🙈 Xù nợ, giấu mặt' : '😰 Chịu, hổng có tiền...'}</div>
            <div class="choice-tier2">Giang hồ sẽ tới gây khó dễ, giảm 30% khách 3 ngày</div>
          </button>
        </div>
      </div>
    `;
    this.openModal(html);

    const payBtn = document.getElementById('btn-pay-rent');
    if (payBtn) {
      payBtn.onclick = () => {
        audio.playPop();
        let ok = false;
        stateManager.update(draft => { ok = payWeeklyRent(draft); });
        if (ok) {
          this.showToast(`✅ Đã đóng tiền mặt bằng ${vnd(rentDue.amount)}. Yên tâm làm ăn!`);
        }
        this.closeModal();
        this.proceedToNextDay();
      };
    }

    const skipBtn = document.getElementById('btn-skip-rent');
    if (skipBtn) {
      skipBtn.onclick = () => {
        audio.playPop();
        stateManager.update(draft => { applyGangsterThreat(draft); });
        this.showToast('🔥 Giang hồ tới quán dằn mặt! Khách sợ bỏ chạy, 3 ngày tới ế khách nặng...');
        this.closeModal();
        this.proceedToNextDay();
      };
    }
  }

  // Chuyển sang ngày mới (tách ra để dùng chung)
  public proceedToNextDay() {
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
      draft.secretSauceDay = null;
      draft.todayOilFiltered = false;
      ensureWeeklyQuests(draft);
    });
    this.pickDailyEvent();
    this.setPhase('prep');
    this.showToast(`Chào buổi sáng Ngày ${stateManager.getState().day}! Chuẩn bị hàng nào! ☀️`);
    void syncToLeaderboard(stateManager.getState());

    // Mời Tester Feedback khi bước sang Ngày 3+
    const curSt = stateManager.getState();
    if (curSt.day >= 3 && !curSt.day3FeedbackPrompted) {
      stateManager.update(draft => { draft.day3FeedbackPrompted = true; });
      setTimeout(() => {
        this.showToast('💬 Bạn đã đồng hành 3 ngày! Vào Cài đặt ➔ [💬 Góp ý & Báo lỗi] để gửi cảm nhận nha! 🎁');
      }, 2500);
    }

    // Thông báo hàng hết hạn bị hủy nếu có
    const expiredNotice = stateManager.getState().expiredWasteNotification;
    if (expiredNotice && expiredNotice.items.length > 0) {
      setTimeout(() => {
        this.showToast(`🗑️ Đã hủy ${expiredNotice.items.join(', ')} do hết hạn sử dụng! (-${expiredNotice.totalValue.toLocaleString('vi-VN')}đ hao hụt)`);
      }, 1200);
    }

    // Kích hoạt Sự kiện 1 (Tình huống đầu ngày)
    setTimeout(() => {
      const morningIncident = pickDailyIncident(stateManager.getState(), 'morning');
      if (morningIncident) {
        this.whenModalFree(() => this.openDailyIncidentDialog(morningIncident));
      }
    }, 500);

    // Thông báo giang hồ đe dọa nếu đang bị
    const state = stateManager.getState();
    if ((state.gangsterThreatDays ?? 0) > 0) {
      setTimeout(() => {
        this.showToast(`⚠️ Giang hồ vẫn canh tiệm! Khách giảm 30% (còn ${state.gangsterThreatDays} ngày)`);
      }, 1500);
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

    const sfxSlider = document.getElementById('slider-sfx-vol') as HTMLInputElement | null;
    if (sfxSlider) {
      sfxSlider.oninput = () => {
        const val = parseInt(sfxSlider.value, 10) / 100;
        audio.setSfxVolume(val);
        const label = document.getElementById('label-sfx-vol');
        if (label) label.textContent = `${Math.round(val * 100)}%`;
        stateManager.update(draft => { draft.sfxVolume = val; });
      };
    }

    const bgmSlider = document.getElementById('slider-bgm-vol') as HTMLInputElement | null;
    if (bgmSlider) {
      bgmSlider.oninput = () => {
        const val = parseInt(bgmSlider.value, 10) / 100;
        music.setVolume(val);
        const label = document.getElementById('label-bgm-vol');
        if (label) label.textContent = `${Math.round(val * 100)}%`;
        stateManager.update(draft => { draft.bgmVolume = val; });
      };
    }

    const testerFeedbackBtn = document.getElementById('btn-open-tester-feedback');
    if (testerFeedbackBtn) {
      testerFeedbackBtn.onclick = () => {
        this.openTesterFeedbackModal();
      };
    }

    const changelogSettingsBtn = document.getElementById('btn-settings-changelog');
    if (changelogSettingsBtn) {
      changelogSettingsBtn.onclick = () => {
        this.openUpdateDashboardModal();
      };
    }

    const manualSettingsBtn = document.getElementById('btn-settings-manual');
    if (manualSettingsBtn) {
      manualSettingsBtn.onclick = () => {
        openBacBaManualModal();
      };
    }

    const introSettingsBtn = document.getElementById('btn-settings-intro');
    if (introSettingsBtn) {
      introSettingsBtn.onclick = () => {
        openIntroCinematicModal({ forceShow: true, onComplete: () => {} });
      };
    }

    const shopThemesSettingsBtn = document.getElementById('btn-settings-shop-themes');
    if (shopThemesSettingsBtn) {
      shopThemesSettingsBtn.onclick = () => {
        audio.playPop();
        this.openShopThemeModal();
      };
    }

    const viewEndingBtn = document.getElementById('btn-view-ending');
    if (viewEndingBtn) {
      viewEndingBtn.onclick = () => {
        this.openMemoryGalleryModal('endings');
      };
    }

    const closeShopEarlyBtn = document.getElementById('btn-close-shop-early');
    if (closeShopEarlyBtn) {
      closeShopEarlyBtn.onclick = () => {
        void this.confirmDialog(
          'Bạn có chắc chắn muốn <b>đóng cửa hàng sớm hôm nay</b> không?<br/><br/>Tiệm sẽ chốt ca bán và chuyển ngay sang màn hình Tổng Kết Ngày.',
          'Đóng cửa sớm'
        ).then(ok => {
          if (!ok) return;
          this.closeModal();
          this.showToast('🚪 Tiệm đã đóng cửa sớm hôm nay. Tiến hành chốt sổ!');
          this.finishDay();
        });
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
          const oldUserId = stateManager.getState().userId;
          if (oldUserId) {
            void removeFromLeaderboard(oldUserId);
          }
          stateManager.resetGame();
          this.setPhase('prep');
          this.showToast('Đã khôi phục game về ngày đầu tiên!');
        });
      };
    }
  }

  // Sổ tay tra cứu công thức nhanh cho ca bán
  public openKitchenGuideModal() {
    audio.playPop();
    this.openModal(renderKitchenGuideModal());

    const closeBtn1 = document.getElementById('btn-close-kitchen-guide');
    if (closeBtn1) closeBtn1.onclick = () => this.closeModal();

    const closeBtn2 = document.getElementById('btn-close-kitchen-guide-bottom');
    if (closeBtn2) closeBtn2.onclick = () => this.closeModal();
  }

  // Sổ tay Tri Kỷ Hẻm 1102 & Bưu Kiện Quà Tiếp Tế
  public openLoyaltyHandbookModal() {
    audio.playPop();
    const state = stateManager.getState();
    openLoyaltyHandbookModal(state, () => {
      stateManager.saveState();
      this.render();
    });
  }

  // Modal góp ý & báo lỗi dành cho Tester trải nghiệm
  public openTesterFeedbackModal() {
    audio.playPop();
    const state = stateManager.getState();
    this.openModal(renderTesterFeedbackModal(state));

    const closeBtn = document.getElementById('btn-close-tester-feedback');
    if (closeBtn) closeBtn.onclick = () => this.openSettings();

    // Chấm điểm sao tương tác
    const starItems = document.querySelectorAll<HTMLElement>('.star-rating-item');
    const inputStars = document.getElementById('input-feedback-stars') as HTMLInputElement | null;
    starItems.forEach(item => {
      item.onclick = () => {
        const star = parseInt(item.dataset.star || '5', 10);
        if (inputStars) inputStars.value = String(star);
        starItems.forEach(s => {
          const sVal = parseInt(s.dataset.star || '1', 10);
          s.style.opacity = sVal <= star ? '1' : '0.35';
        });
        audio.playPop();
      };
    });

    // Chép mã Save đính kèm
    const copyBtn = document.getElementById('btn-copy-tester-save');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const code = exportSaveCode(stateManager.getState());
        void navigator.clipboard?.writeText(code).then(
          () => this.showToast('Đã chép mã Save vào bộ nhớ tạm! 📋'),
          () => this.showToast('Không thể tự động chép mã.')
        );
      };
    }

    // Gửi góp ý
    const submitBtn = document.getElementById('btn-submit-tester-feedback');
    if (submitBtn) {
      submitBtn.onclick = () => {
        const commentEl = document.getElementById('textarea-feedback-comment') as HTMLTextAreaElement | null;
        const categoryEl = document.getElementById('select-feedback-category') as HTMLSelectElement | null;
        const comment = commentEl?.value.trim() || '';
        const category = categoryEl?.value || 'other';
        const stars = parseInt(inputStars?.value || '5', 10);

        if (!comment) {
          this.showToast('Vui lòng nhập đôi lời góp ý hoặc mô tả lỗi nhé!');
          return;
        }

        const submission = {
          id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          stars,
          category,
          comment,
          timestamp: new Date().toISOString()
        };

        stateManager.update(draft => {
          if (!draft.testerFeedbackSubmissions) draft.testerFeedbackSubmissions = [];
          draft.testerFeedbackSubmissions.push(submission);
        });
        stateManager.saveState();

        audio.playCash();
        confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
        this.showToast('❤️ Cảm ơn bạn rất nhiều vì đã góp ý xây dựng Tiệm Gà Nhà Tui!');
        this.closeModal();
      };
    }
  }

  // --- LOBBY & LEADERBOARD MODAL ---
  public async openLeaderboard(
    sortBy: 'money' | 'day' = 'money',
    activeTab: 'lobby' | 'qr' = 'lobby'
  ) {
    if (this.leaderboardPollTimer !== null) {
      window.clearInterval(this.leaderboardPollTimer);
      this.leaderboardPollTimer = null;
    }
    audio.playPop();
    const state = stateManager.getState();
    const currentUserId = state.userId;
    const currentRoomId = state.roomId || getCurrentRoomId();

    // 1. Tự động đồng bộ bản ghi của mình trước khi mở bảng
    void syncToLeaderboard(state);

    // 2. Tải danh sách bảng xếp hạng (từ cloud hoặc cache)
    const result = await fetchLeaderboard(currentUserId, sortBy, currentRoomId);
    const html = renderLeaderboardModal(
      result.entries,
      currentUserId,
      sortBy,
      result.isOffline,
      result.roomId,
      activeTab
    );
    this.openModal(html);

    // 3. Bind events
    const closeBtn1 = document.getElementById('btn-close-leaderboard');
    if (closeBtn1) closeBtn1.onclick = () => this.closeModal();

    const closeBtn2 = document.getElementById('btn-close-leaderboard-btn');
    if (closeBtn2) closeBtn2.onclick = () => this.closeModal();

    // Chuyển tab: Lobby 4 Người VS Mã QR
    const tabLobby = document.getElementById('tab-nav-lobby');
    if (tabLobby) {
      tabLobby.onclick = () => {
        audio.playPop();
        void this.openLeaderboard(sortBy, 'lobby');
      };
    }

    const tabQr = document.getElementById('tab-nav-qr');
    if (tabQr) {
      tabQr.onclick = () => {
        audio.playPop();
        void this.openLeaderboard(sortBy, 'qr');
      };
    }

    const openQrBtn = document.getElementById('btn-open-qr-tab');
    if (openQrBtn) {
      openQrBtn.onclick = () => {
        audio.playPop();
        void this.openLeaderboard(sortBy, 'qr');
      };
    }

    // Các nút mời nhanh trên từng slot trống
    const quickInviteBtns = document.querySelectorAll('.btn-quick-invite-qr');
    quickInviteBtns.forEach(btn => {
      (btn as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        audio.playPop();
        void this.openLeaderboard(sortBy, 'qr');
      };
    });

    // Sao chép link mời
    const copyBtn = document.getElementById('btn-copy-invite-link');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        const linkInput = document.getElementById('input-invite-link') as HTMLInputElement;
        const linkToCopy = linkInput ? linkInput.value : window.location.href;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(linkToCopy);
          } else if (linkInput) {
            linkInput.select();
            document.execCommand('copy');
          }
          audio.playCash();
          this.showToast('📋 Đã sao chép link mời! Gửi Zalo/Messenger cho bạn bè ngay!');
        } catch {
          this.showToast('📋 Vui lòng sao chép link trong ô bên cạnh!');
        }
      };
    }

    // Tải poster phòng retro 9:16 chia sẻ Story
    const downloadPosterBtn = document.getElementById('btn-download-room-poster');
    if (downloadPosterBtn) {
      downloadPosterBtn.onclick = async () => {
        try {
          audio.playCash();
          this.showToast('🎨 Đang vẽ poster 9:16 retro... Vui lòng đợi!');
          await downloadLobbyPoster({
            state: stateManager.getState(),
            roomId: currentRoomId,
          });
          this.showToast('✅ Đã tải poster phòng 9:16! Hãy chia sẻ Story ngay!');
        } catch (err) {
          console.error('Lỗi khi tải poster:', err);
          this.showToast('❌ Có lỗi khi tạo ảnh poster. Vui lòng thử lại!');
        }
      };
    }

    // Vào phòng tùy chỉnh
    const joinRoomBtn = document.getElementById('btn-join-custom-room');
    if (joinRoomBtn) {
      joinRoomBtn.onclick = () => {
        const roomInput = document.getElementById('input-custom-room') as HTMLInputElement;
        const targetRoom = (roomInput?.value || '').trim().toUpperCase();
        if (!targetRoom) {
          this.showToast('Vui lòng nhập mã phòng!');
          return;
        }
        audio.playCash();
        setCurrentRoomId(targetRoom);
        state.roomId = targetRoom;
        stateManager.saveState();
        this.showToast(`🍗 Đã chuyển sang Phòng: ${targetRoom}!`);
        void this.openLeaderboard(sortBy, 'lobby');
      };
    }

    // Tạo phòng ngẫu nhiên mới
    const createRandomBtn = document.getElementById('btn-create-random-room');
    if (createRandomBtn) {
      createRandomBtn.onclick = () => {
        const newRoom = generateRoomId();
        audio.playCash();
        setCurrentRoomId(newRoom);
        state.roomId = newRoom;
        stateManager.saveState();
        this.showToast(`🎲 Đã tạo Phòng Mới: ${newRoom}!`);
        void this.openLeaderboard(sortBy, 'qr');
      };
    }

    const sortMoneyBtn = document.getElementById('btn-sort-money');
    if (sortMoneyBtn) {
      sortMoneyBtn.onclick = () => {
        audio.playPop();
        void this.openLeaderboard('money', activeTab);
      };
    }

    const sortDayBtn = document.getElementById('btn-sort-day');
    if (sortDayBtn) {
      sortDayBtn.onclick = () => {
        audio.playPop();
        void this.openLeaderboard('day', activeTab);
      };
    }

    const refreshBtn = document.getElementById('btn-refresh-leaderboard');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        audio.playCash();
        this.showToast('Đang kết nối làm mới Lobby... 🔄');
        await this.openLeaderboard(sortBy, activeTab);
      };
    }

    // 4. Kích hoạt nút Tiếp Tế Quà Bạn Bè
    this.bindCarePackageButtons(sortBy, activeTab);

    // 5. Kiểm tra và nhận quà tiếp tế nếu có
    void this.checkAndPromptCarePackages();

    // 6. Kích hoạt Realtime Auto-Polling khi tab là 'lobby'
    this.lastLobbyEntriesCount = result.entries.length;
    if (activeTab === 'lobby') {
      this.leaderboardPollTimer = window.setInterval(async () => {
        const overlay = document.getElementById('modal-container');
        const container = document.getElementById('lobby-slots-container');
        if (!overlay || overlay.hasAttribute('hidden') || !container) {
          if (this.leaderboardPollTimer !== null) {
            window.clearInterval(this.leaderboardPollTimer);
            this.leaderboardPollTimer = null;
          }
          return;
        }

        try {
          const fresh = await fetchLeaderboard(currentUserId, sortBy, currentRoomId);
          const targetContainer = document.getElementById('lobby-slots-container');
          if (!targetContainer) return;

          const prevCount = this.lastLobbyEntriesCount;
          const newCount = fresh.entries.length;

          targetContainer.innerHTML = renderLobbySlotsHtml(fresh.entries, currentUserId);

          // Cập nhật số người trên tab
          const countBadge = document.getElementById('lobby-player-count');
          if (countBadge) countBadge.textContent = String(newCount);

          // Gắn lại sự kiện cho các nút mời nhanh trên slot trống
          targetContainer.querySelectorAll('.btn-quick-invite-qr').forEach(b => {
            (b as HTMLElement).onclick = (e) => {
              e.stopPropagation();
              audio.playPop();
              void this.openLeaderboard(sortBy, 'qr');
            };
          });

          // Gắn lại sự kiện tiếp tế cho các thẻ bạn bè
          this.bindCarePackageButtons(sortBy, activeTab);

          // Hiệu ứng pháo hoa khi có người chơi mới vừa quét QR vào phòng!
          if (newCount > prevCount) {
            this.lastLobbyEntriesCount = newCount;
            audio.playCash();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
            const newest = fresh.entries[fresh.entries.length - 1];
            const name = newest?.shopName || 'Bạn bè';
            this.showToast(`🎉 ${name} vừa quét QR gia nhập phòng!`);
          } else {
            this.lastLobbyEntriesCount = newCount;
          }
        } catch {}
      }, 4000);
    }
  }

  // --- SPRINT 2: CARE PACKAGES & WEEKLY QUESTS HANDLERS ---
  private bindCarePackageButtons(sortBy: 'money' | 'day', activeTab: 'lobby' | 'qr') {
    const sendBtns = document.querySelectorAll('.btn-send-care-package');
    sendBtns.forEach(btn => {
      (btn as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        const recipientId = (btn as HTMLElement).dataset.recipientId || '';
        const recipientName = (btn as HTMLElement).dataset.recipientName || 'Bạn bè';
        if (!recipientId) return;

        audio.playPop();
        const dialogHtml = renderSendCarePackageDialog(recipientId, recipientName);
        this.openModal(dialogHtml);

        const closeBtn = document.getElementById('btn-close-care-pkg');
        if (closeBtn) {
          closeBtn.onclick = () => void this.openLeaderboard(sortBy, activeTab);
        }

        const pkgOptions = document.querySelectorAll('.btn-pkg-option');
        pkgOptions.forEach(opt => {
          (opt as HTMLElement).onclick = async () => {
            const pkgType = (opt as HTMLElement).dataset.pkgType as CarePackageType;
            audio.playPop();
            const res = await sendCarePackage(stateManager.getState(), recipientId, recipientName, pkgType);
            if (res.success) {
              audio.playCash();
              confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
              this.showToast(res.message);
              recordWeeklyQuestProgress(stateManager.getState(), 'community_action', 1);
              stateManager.saveState();
              void this.openLeaderboard(sortBy, activeTab);
            } else {
              audio.playPop();
              this.showToast(res.message);
            }
          };
        });
      };
    });
  }

  public async checkAndPromptCarePackages() {
    const state = stateManager.getState();
    if (!state.userId) return;
    const roomId = state.roomId || getCurrentRoomId();
    try {
      const pending = await fetchPendingCarePackages(state.userId, roomId);
      if (pending && pending.length > 0) {
        for (const pkg of pending) {
          const res = await claimCarePackage(state, pkg);
          if (res.success) {
            audio.playCash();
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
            this.showToast(`🎁 ${res.rewardSummary}`);
            stateManager.saveState();
          }
        }
      }
    } catch {}
  }

  public openWeeklyQuests() {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderWeeklyQuestsModal(state);
    this.openModal(html);

    const closeBtn1 = document.getElementById('btn-close-weekly-quests');
    if (closeBtn1) closeBtn1.onclick = () => this.closeModal();

    const closeBtn2 = document.getElementById('btn-close-weekly-quests-footer');
    if (closeBtn2) closeBtn2.onclick = () => this.closeModal();

    const claimBtns = document.querySelectorAll('.btn-claim-quest');
    claimBtns.forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        const questId = (btn as HTMLElement).dataset.questId;
        if (!questId) return;
        const res = claimWeeklyQuestReward(state, questId);
        if (res.success) {
          audio.playCash();
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          this.showToast(res.message);
          stateManager.saveState();
          this.openWeeklyQuests();
        } else {
          this.showToast(res.message);
        }
      };
    });
  }

  public openSocialShareModal(): void {
    audio.playPop();
    const state = stateManager.getState();
    const html = renderSocialShareModal(state);
    this.openModal(html);

    const closeBtn = document.getElementById('btn-close-social-share');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();

    // 1-Click Native Share (Zalo/Messenger/Web Share)
    const nativeShareBtn = document.getElementById('btn-native-share-room');
    if (nativeShareBtn) {
      nativeShareBtn.onclick = async () => {
        audio.playPop();
        const roomId = (state.roomId || 'HEM1102').toUpperCase();
        const inviteUrl = getInviteUrl(roomId);
        if (typeof navigator !== 'undefined' && navigator.share) {
          try {
            await navigator.share({
              title: 'Tiệm Gà Nhà Tui',
              text: `Vào phòng ${roomId} đua top doanh thu tiệm gà với tui nè! 🍗🏆`,
              url: inviteUrl
            });
            this.showToast('Đã mở menu chia sẻ thành công!');
          } catch {
            // Cancelled
          }
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(inviteUrl);
          audio.playCoinChing();
          this.showToast(`📋 Đã sao chép link mời phòng ${roomId}!`);
        }
      };
    }

    // Sao chép đường link
    const copyBtn = document.getElementById('btn-copy-room-link');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        audio.playPop();
        const roomId = (state.roomId || 'HEM1102').toUpperCase();
        const inviteUrl = getInviteUrl(roomId);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(inviteUrl);
          audio.playCoinChing();
          this.showToast(`📋 Đã sao chép link mời phòng ${roomId}!`);
        }
      };
    }

    // Toggle switch room box
    const openChangeBtn = document.getElementById('btn-open-change-room');
    const switchBox = document.getElementById('switch-room-container');
    if (openChangeBtn && switchBox) {
      openChangeBtn.onclick = () => {
        audio.playPop();
        const isHidden = switchBox.style.display === 'none';
        switchBox.style.display = isHidden ? 'flex' : 'none';
      };
    }

    // Confirm switch room
    const confirmSwitchBtn = document.getElementById('btn-confirm-switch-room');
    const newRoomInput = document.getElementById('input-new-room-id') as HTMLInputElement;
    if (confirmSwitchBtn && newRoomInput) {
      confirmSwitchBtn.onclick = () => {
        const newRoom = (newRoomInput.value || '').trim().toUpperCase();
        if (newRoom) {
          state.roomId = newRoom;
          setCurrentRoomId(newRoom);
          stateManager.saveState();
          audio.playCoinChing();
          this.showToast(`Đã chuyển sang phòng ${newRoom}!`);
          this.openSocialShareModal();
        }
      };
    }

    // Download poster PNG
    const downloadPosterBtn = document.getElementById('btn-download-room-poster');
    if (downloadPosterBtn) {
      downloadPosterBtn.onclick = async () => {
        audio.playPop();
        this.showToast('Đang xuất poster 9:16 sắc nét... 🖼️');
        try {
          await downloadLobbyPoster({ state, roomId: state.roomId || 'HEM1102' });
          audio.playServingBell();
          this.showToast('Đã tải poster về máy thành công!');
        } catch (err) {
          console.error(err);
          this.showToast('Không thể tạo poster lúc này!');
        }
      };
    }
  }

  public openStoryletModal(storylet: Storylet, onDone?: () => void): void {
    audio.playServingBell();
    const html = renderStoryletModal(storylet);
    this.openModal(html);

    const modalBox = document.getElementById('modal-storylet-night') || document.getElementById('modal-content');
    if (modalBox) {
      bindStoryletTypewriter(modalBox);
    }

    const choiceBtns = document.querySelectorAll('.storylet-choice-btn');
    choiceBtns.forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        const choiceId = (btn as HTMLElement).dataset.choiceId;
        if (!choiceId) return;

        audio.playCoinChing();
        const { effect } = applyStoryletChoice(stateManager.getState(), storylet, choiceId);
        stateManager.saveState();

        this.closeModal();
        if (effect.reactionNarrative) {
          this.showToast(`✨ ${effect.reactionNarrative}`);
        }
        if (onDone) {
          setTimeout(() => onDone(), 800);
        }
      };
    });
  }

}

// Khởi chạy game khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  (window as unknown as { __app: AppController }).__app = app;
  (window as unknown as { __stateManager: unknown }).__stateManager = stateManager;
  (window as unknown as { syncToLeaderboard: unknown }).syncToLeaderboard = syncToLeaderboard;
});
