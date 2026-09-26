import { QualityRating, OilCondition, TrayItem } from '../types/game';
import { audio } from './audio';
import { DRINK_RECIPES, DrinkId } from './stations';

export type Sauce = 'spicy' | 'honey';
// Gà viên (Chương 3): mẻ nhỏ chín nhanh gấp 1,5 → vùng Perfect ngắn hơn, đòi tay canh nhanh hơn
export type FryType = 'chicken' | 'fries' | 'popcorn';
const BASE_TRAY_SIZE = 4;
const FRY_SPEED: Record<FryType, number> = { chicken: 1, fries: 1, popcorn: 1.5 };

export interface CookingState {
  isFrying: boolean;
  fryingType: FryType;
  progress: number; // 0 to 100
}

export interface CookingSnapshot {
  cook: CookingState;
  tray: TrayItem[];
  seasoning: Sauce | null;
}

export class CookingEngine {
  private cookState: CookingState = {
    isFrying: false,
    fryingType: 'chicken',
    progress: 0
  };

  private tray: TrayItem[] = [];
  private activeSeasoning: Sauce | null = null;
  private fryRampPct = 0;
  private traySize = BASE_TRAY_SIZE;

  // Khay rộng thêm khi có phụ bếp / phục vụ (core/staff.ts extraTraySlots)
  public setTraySize(n: number) {
    this.traySize = Math.max(CookingEngine.TRAY_SIZE, n);
  }
  public getTraySize(): number {
    return this.traySize;
  }

  public setFryRampBonus(pct: number) {
    this.fryRampPct = Math.max(0, pct);
  }

  // Chụp / khôi phục chảo + khay cho "ca bán dở" (thoát app giữa ca rồi quay lại). Âm thanh chiên
  // không khôi phục ở đây: vòng lặp bán hàng tự bật lại khi chảo đang chiên.
  public snapshot(): CookingSnapshot {
    return {
      cook: { ...this.cookState },
      tray: this.tray.map(t => ({ ...t })),
      seasoning: this.activeSeasoning
    };
  }

  public restore(s: CookingSnapshot) {
    this.cookState = { ...s.cook };
    this.tray = s.tray.map(t => ({ ...t })).slice(0, this.traySize);
    this.activeSeasoning = s.seasoning;
    if (this.cookState.isFrying) audio.startSizzle();
  }

  public getCookState(): CookingState {
    return this.cookState;
  }

  public getTray(): TrayItem[] {
    return this.tray;
  }

  // Bắt đầu thả gà/khoai vào chảo chiên
  public startFrying(type: FryType): boolean {
    if (this.cookState.isFrying) return false;
    this.cookState.isFrying = true;
    this.cookState.fryingType = type;
    this.cookState.progress = 0;
    audio.startSizzle();
    return true;
  }

  // Cập nhật thanh đo độ chín theo delta time
  public updateFrying(deltaMs: number): { finished: boolean; quality: QualityRating } {
    if (!this.cookState.isFrying) return { finished: false, quality: 'raw' };

    // Tốc độ chiên: mỗi mẻ chuẩn mất khoảng 5 - 7 giây
    // deltaMs là thời gian game (đã tính tua nhanh) → không nhân tốc độ lần nữa.
    // Nâng cấp bếp chỉ rút ngắn pha còn sống; từ vùng Vừa trở đi chạy tốc độ chuẩn
    // để cửa sổ Perfect luôn dài như nhau (nâng cấp không làm game khó hơn).
    const ramp = this.cookState.progress < CookingEngine.ZONES.raw ? 1 + this.fryRampPct / 100 : 1;
    const step = (deltaMs / 6000) * 100 * ramp * FRY_SPEED[this.cookState.fryingType];
    this.cookState.progress += step;

    if (this.cookState.progress >= 100) {
      // Bị cháy khét hoàn toàn
      this.cookState.progress = 100;
      return { finished: true, quality: 'burnt' };
    }

    return { finished: false, quality: this.calculateCurrentQuality() };
  }

  public calculateCurrentQuality(): QualityRating {
    return CookingEngine.qualityAt(this.cookState.progress);
  }

  // Ngưỡng vùng trên thanh đo; phải khớp độ rộng .zone-* trong styles/kitchen.css
  public static readonly ZONES = { raw: 38, goodLow: 48, perfect: 70, goodHigh: 80 } as const;

  public static qualityAt(p: number): QualityRating {
    const z = CookingEngine.ZONES;
    if (p < z.raw) return 'raw';
    if (p < z.goodLow) return 'good';
    if (p < z.perfect) return 'perfect';
    if (p < z.goodHigh) return 'good';
    return 'burnt';
  }

  // Điểm giữa vùng Perfect: dây chuyền tự động nhấc giỏ tại đây
  public static readonly AUTO_LIFT_AT = (CookingEngine.ZONES.goodLow + CookingEngine.ZONES.perfect) / 2;

  public static readonly TRAY_SIZE = BASE_TRAY_SIZE;

  public isTrayFull(): boolean {
    return this.tray.length >= this.traySize;
  }

  // Trạm nước: lấy lon lạnh bỏ thẳng vào khay, không qua chảo
  public addDrink(drink: DrinkId = 'soda'): TrayItem | null {
    const r = DRINK_RECIPES[drink];
    const item: TrayItem = {
      id: 'tray_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      menuItemId: r.menuItemId,
      name: r.name,
      icon: r.icon,
      quality: 'good'
    };
    return this.addToTray(item) ? item : null;
  }

  // Đặt món từ trạm khác (nồi mì, lò bánh) vào khay; khay đầy → false
  public addToTray(item: TrayItem): boolean {
    if (this.isTrayFull()) return false;
    this.tray.push(item);
    audio.playPop();
    return true;
  }

  // Nhấc vợt vớt gà ra khỏi chảo
  public liftFryer(): { quality: QualityRating; trayItem: TrayItem | null; usedSauce: Sauce | null } {
    if (!this.cookState.isFrying) return { quality: 'raw', trayItem: null, usedSauce: null };

    audio.stopSizzle();
    const quality = this.calculateCurrentQuality();
    this.cookState.isFrying = false;

    if (quality === 'perfect') {
      audio.playPerfect();
    } else if (quality === 'burnt') {
      audio.playBurnt();
    } else {
      audio.playPop();
    }

    let menuItemId = 'crispy_chicken';
    let name = 'Gà Giòn Nhà Tui';
    let icon = '🍗';

    if (this.cookState.fryingType === 'fries') {
      menuItemId = 'shake_fries';
      name = 'Khoai Lắc Phô Mai';
      icon = '🍟';
    } else if (this.cookState.fryingType === 'popcorn') {
      menuItemId = 'popcorn_chicken';
      name = 'Gà Viên Popcorn';
      icon = '🍿';
    }

    // Sốt chỉ phủ lên gà, không phủ lên khoai
    const sauce = this.cookState.fryingType === 'chicken' ? this.activeSeasoning : null;
    if (sauce === 'spicy') {
      menuItemId = 'spicy_chicken';
      name = 'Gà Sốt Cay Xé Lưỡi';
      icon = '🌶️';
    } else if (sauce === 'honey') {
      menuItemId = 'honey_garlic_chicken';
      name = 'Gà Mật Ong Bơ Tỏi';
      icon = '🍯';
    }

    const item: TrayItem = {
      id: 'tray_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      menuItemId,
      name,
      icon,
      quality
    };

    this.cookState.progress = 0;
    this.activeSeasoning = null;

    // Khay đầy: món không được đặt vào khay (trayItem = null) để caller báo người chơi
    if (this.isTrayFull()) {
      return { quality, trayItem: null, usedSauce: sauce };
    }
    this.tray.push(item);
    return { quality, trayItem: item, usedSauce: sauce };
  }

  public setSeasoning(seasoning: Sauce | null) {
    this.activeSeasoning = seasoning;
    audio.playPop();
  }

  public getActiveSeasoning(): Sauce | null {
    return this.activeSeasoning;
  }

  public removeFromTray(index: number) {
    if (index >= 0 && index < this.tray.length) {
      this.tray.splice(index, 1);
      audio.playPop();
    }
  }

  public clearTray() {
    this.tray = [];
    audio.stopSizzle();
    this.cookState.isFrying = false;
    this.cookState.progress = 0;
  }

  // Kiểm tra tình trạng dầu
  public static getOilCondition(batches: number, oilLifePct = 0): OilCondition {
    const life = 1 + oilLifePct / 100; // máy lọc dầu: dầu lâu đen hơn
    if (batches < 8 * life) return 'clean';
    if (batches < 18 * life) return 'medium';
    return 'dirty';
  }
}

export const cookingEngine = new CookingEngine();
