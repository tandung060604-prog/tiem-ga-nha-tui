import { GameState } from '../types/game';
import { INITIAL_INVENTORY } from '../content/inventory';
import { INITIAL_MENU } from '../content/menu';
import { INITIAL_UPGRADES } from '../content/upgrades';
import { INITIAL_CANDIDATES } from '../content/staff';
import { ensureBatches } from './inventory';
import { signSave, auditState, flagIntegrity } from './integrity';

const SAVE_KEY = 'tiem_ga_nha_tui_save_v2';
const SIG_KEY = `${SAVE_KEY}_sig`;

export function createInitialState(): GameState {
  const state: GameState = {
    version: 2,
    day: 1,
    phase: 'prep',
    money: 850000, // Tiền vốn khởi đầu cho xe đẩy chương 1
    shopName: 'Tiệm Gà Nhà Tui',
    currentChapter: 1,
    isFastForward: false,
    soundEnabled: true,

    inventory: JSON.parse(JSON.stringify(INITIAL_INVENTORY)),
    menu: JSON.parse(JSON.stringify(INITIAL_MENU)),
    upgrades: JSON.parse(JSON.stringify(INITIAL_UPGRADES)),
    staff: [],
    candidates: JSON.parse(JSON.stringify(INITIAL_CANDIDATES)),

    ratings: {
      taste: 4.2,
      speed: 4.0,
      hygiene: 4.5,
      space: 3.5,
      pricing: 4.3,
      overall: 4.1
    },
    recentReviews: [
      {
        id: 'rev_init_1',
        authorName: 'Bé Trúc Mê Gà',
        avatar: '👧',
        day: 0,
        stars: 4,
        comment: 'Xe đẩy đầu hẻm mà gà giòn rụm thơm nức mũi! Giá 35k học sinh sinh viên quá chừng!',
        weakestCriteria: 'space',
        orderSummary: '1 Gà Giòn Nhà Tui'
      }
    ],

    oilCondition: 'clean',
    oilBatchesCooked: 0,

    dayHistory: [],
    bestReviews: [],
    unlockedStoryActs: [1],
    completedQuests: [],
    bunnyVisitsCount: 0,
    unlockedBunnyLetters: [],
    karma: {
      community: 50,
      craftsmanship: 50,
      ambition: 50
    },
    activeEnding: null,
    chosenDialogueIds: [],
    // Mọi trường được lưu PHẢI có mặt ở đây: migrateSave chỉ chép các khóa có trong trạng thái mặc định
    // (thiếu → mất sau khi tải lại trang, kể cả cờ chống gian lận).
    achievedEndings: [],
    debtStreak: 0,
    depositsPaid: 0,
    baBaAidChapter: 0,
    integrity: { tampered: false, reasons: [] },
    pausedShift: null,
    lifetimeStats: {
      totalFried: 0,
      totalBurnt: 0,
      totalRevenue: 0,
      perfectFriedCount: 0
    }
  };
  Object.values(state.inventory).forEach(ensureBatches);
  return state;
}

const hasStorage = typeof localStorage !== 'undefined';
const SAVE_DEBOUNCE_MS = 500;

// Save từ localStorage là dữ liệu không tin cậy (bản cũ, sửa tay, ghi dở). Giữ mọi trường hợp lệ,
// thay trường sai kiểu/thiếu bằng mặc định, ghi lại tên trường đã sửa. null = không cứu được.
export function migrateSave(raw: unknown): { state: GameState; repaired: string[] } | null {
  if (typeof raw !== 'object' || raw === null || (raw as { version?: unknown }).version !== 2) return null;
  const src = raw as Record<string, unknown>;
  const state = createInitialState();
  const target = state as unknown as Record<string, unknown>;
  const repaired: string[] = [];

  for (const key of Object.keys(target)) {
    const fallback = target[key];
    const value = src[key];
    // Mặc định null: nhận null, chuỗi (activeEnding) hoặc object (pausedShift — kiểm tra kỹ ở dưới)
    const sameShape = fallback === null ? (value === null || typeof value === 'string' || (typeof value === 'object' && !Array.isArray(value)))
      : Array.isArray(fallback) ? Array.isArray(value)
      : typeof value === typeof fallback && value !== null
        && !(typeof value === 'number' && !Number.isFinite(value));
    if (sameShape) target[key] = value;
    else repaired.push(key);
  }

  const defaults = createInitialState();
  if (!Number.isInteger(state.day) || state.day < 1) { state.day = defaults.day; repaired.push('day'); }
  if (!Number.isInteger(state.currentChapter) || state.currentChapter < 1 || state.currentChapter > 5) {
    state.currentChapter = defaults.currentChapter;
    repaired.push('currentChapter');
  }
  for (const c of ['taste', 'speed', 'hygiene', 'space', 'pricing', 'overall'] as const) {
    const v = state.ratings[c];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 1 || v > 5) {
      state.ratings[c] = defaults.ratings[c];
      repaired.push(`ratings.${c}`);
    }
  }
  // Kho: mọi nguyên liệu của content phải có mặt và có số lượng hợp lệ
  for (const [id, item] of Object.entries(defaults.inventory)) {
    const saved = state.inventory[id];
    if (!saved || typeof saved.amount !== 'number' || !Number.isFinite(saved.amount) || saved.amount < 0) {
      state.inventory[id] = item;
      repaired.push(`inventory.${id}`);
    } else {
      if (typeof saved.unlocked !== 'boolean') saved.unlocked = item.unlocked ?? true;
      if (typeof saved.unlockDay !== 'number') saved.unlockDay = item.unlockDay;
      if (typeof saved.unlockCost !== 'number') saved.unlockCost = item.unlockCost;
    }
  }
  Object.values(state.inventory).forEach(ensureBatches);
  // Menu: giữ giá người chơi đã chỉnh + combo tự tạo, bổ sung món content còn thiếu (bản cập nhật mới)
  for (const item of defaults.menu) {
    if (!state.menu.some(m => m?.id === item.id)) {
      state.menu.push(item);
      repaired.push(`menu.${item.id}`);
    }
  }
  // Karma & Narrative migration
  if (!state.karma || typeof state.karma.community !== 'number' || !Number.isFinite(state.karma.community)) {
    state.karma = { community: 50, craftsmanship: 50, ambition: 50 };
    repaired.push('karma');
  }
  if (!Array.isArray(state.chosenDialogueIds)) {
    state.chosenDialogueIds = [];
    repaired.push('chosenDialogueIds');
  }
  if (state.activeEnding === undefined) {
    state.activeEnding = null;
  }
  // Save từ trước khi có sổ chống gian lận: không phạt oan người chơi cũ.
  // Tiền thưởng đã nhận không được ghi → coi phần dư so với doanh thu là thưởng hợp lệ;
  // chương đã mở bằng luật tự qua chương cũ → coi như đã đặt cọc.
  if (typeof state.lifetimeStats.totalBonus !== 'number') {
    state.lifetimeStats.totalBonus = Math.max(0, state.money - 850000 - state.lifetimeStats.totalRevenue);
  }
  if (typeof src.depositsPaid !== 'number') state.depositsPaid = state.currentChapter - 1;

  // Thoát giữa ca bán: có ảnh chụp ca của đúng ngày này → tiếp tục ca; không có → về pha Chuẩn bị
  const shift = state.pausedShift;
  const shiftValid = !!shift && shift.day === state.day && Array.isArray(shift.session?.orders)
    && typeof shift.session.gameHour === 'number' && Array.isArray(shift.cooking?.tray);
  if (!shiftValid) state.pausedShift = null;
  else if (shift && !shift.session.timers) shift.session.timers = { noodle: null, oven: null };
  state.phase = shiftValid ? 'selling' : 'prep';
  return { state, repaired };
}

export class StateManager {
  private state: GameState;
  private listeners: Array<(state: GameState) => void> = [];
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.state = hasStorage ? this.loadState() : createInitialState();
    // Rời trang / chuyển app trên điện thoại: ghi ngay phần còn chờ
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => this.flush());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.flush();
      });
    }
  }

  public getState(): GameState {
    return this.state;
  }

  // Ca bán gọi update nhiều lần mỗi giây: gom lại, ghi localStorage tối đa 1 lần / 500ms
  public update(updater: (draft: GameState) => void) {
    updater(this.state);
    this.scheduleSave();
    this.notify();
  }

  private scheduleSave() {
    if (this.saveTimer !== null) return;
    this.saveTimer = setTimeout(() => this.flush(), SAVE_DEBOUNCE_MS);
  }

  public flush() {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.saveState();
  }

  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  public saveState() {
    if (!hasStorage) return;
    try {
      const json = JSON.stringify(this.state);
      localStorage.setItem(SAVE_KEY, json);
      localStorage.setItem(SIG_KEY, signSave(json)); // chữ ký chống sửa tay
    } catch (e) {
      console.error('Không thể lưu save game vào localStorage:', e);
    }
  }

  public loadState(): GameState {
    if (typeof localStorage === 'undefined') {
      return createInitialState();
    }
    // Dọn dẹp key cũ từ phiên test tự động trước
    localStorage.removeItem('tiem_ga_nha_tui_save_v1');

    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return createInitialState();

    let result: ReturnType<typeof migrateSave> = null;
    try {
      result = migrateSave(JSON.parse(data));
    } catch (e) {
      console.warn('Save game không phải JSON hợp lệ:', e);
    }
    if (result) {
      if (result.repaired.length) console.warn('Save game có trường hỏng, đã sửa:', result.repaired.join(', '));
      // Chống gian lận: chữ ký không khớp = save bị sửa ngoài game; bất biến sổ sách sai = số liệu vô lý.
      // Save cũ chưa có chữ ký thì chấp nhận (ký lại ở lần lưu tới).
      const sig = localStorage.getItem(SIG_KEY);
      const reasons = auditState(result.state);
      if (sig !== null && sig !== signSave(data)) reasons.unshift('Save bị chỉnh sửa bên ngoài game');
      flagIntegrity(result.state, reasons);
      return result.state;
    }
    // Không cứu được (JSON cụt, sai version…): giữ bản gốc sang khóa khác trước khi tạo game mới
    try {
      localStorage.setItem(`${SAVE_KEY}_corrupt_${Date.now()}`, data);
    } catch {
      // hết dung lượng: vẫn tạo game mới để người chơi không bị kẹt
    }
    console.warn('Save game không đọc được, đã sao lưu bản gốc và tạo game mới.');
    return createInitialState();
  }

  // Khôi phục từ mã sao lưu: thay toàn bộ tiến trình, ghi ngay
  public replaceState(next: GameState) {
    if (this.saveTimer !== null) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    this.state = next;
    this.saveState();
    this.notify();
  }

  public resetGame(): GameState {
    if (this.saveTimer !== null) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    if (hasStorage) {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(SIG_KEY);
      localStorage.removeItem('tiem_ga_nha_tui_save_v1');
    }
    this.state = createInitialState();
    this.saveState();
    this.notify();
    return this.state;
  }
}

export const stateManager = new StateManager();
