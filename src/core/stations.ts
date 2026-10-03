import { BaseMenuItemId, TrayItem, QualityRating } from '../types/game';

// Trạm nấu ngoài chảo chiên — mỗi chương mở một cơ chế mới (GDD: "mỗi chương thêm một cơ chế, không chỉ tăng số").
//  • Trạm hẹn giờ (nồi mì, lò bánh): chạy song song với chảo; chín rồi phải vớt kịp, để lâu là hỏng → đa nhiệm.
//  • Bàn ráp: biến món chiên trong khay thành món mới (burger, cơm gà, tokbokki) → phải tính trước.
//  • Máy nước: trà đào, kem — chạm là có.
// Trạng thái trạm hẹn giờ nằm trong SellingSession → được chụp khi thoát giữa ca và chạy được trong mô phỏng.

export type TimerStationId = 'noodle' | 'oven';

export interface TimerRecipe {
  station: TimerStationId;
  menuItemId: BaseMenuItemId;
  name: string;
  icon: string;
  stock: readonly string[];  // nguyên liệu trừ khi bắt đầu
  chapter: number;           // chương mở trạm
  cookMs: number;            // thời gian game tới khi chín
  holdMs: number;            // chín rồi còn bao lâu trước khi hỏng
}

export const TIMER_RECIPES: Record<TimerStationId, TimerRecipe> = {
  noodle: { station: 'noodle', menuItemId: 'pasta_beef', name: 'Mì Ý Sốt Bò Ngọt', icon: '🍝', stock: ['pasta_beef'], chapter: 2, cookMs: 7000, holdMs: 6000 },
  oven: { station: 'oven', menuItemId: 'biscuit_honey', name: 'Bánh Quy Bơ Mật', icon: '🥐', stock: ['garlic_honey'], chapter: 3, cookMs: 10000, holdMs: 7000 }
};

// null = trạm rảnh; số = thời gian game đã nấu
export type TimerStations = Record<TimerStationId, number | null>;
export const emptyTimerStations = (): TimerStations => ({ noodle: null, oven: null });

export type TimerPhase = 'idle' | 'cooking' | 'ready' | 'ruined';

export function timerPhase(recipe: TimerRecipe, elapsed: number | null): TimerPhase {
  if (elapsed === null) return 'idle';
  if (elapsed < recipe.cookMs) return 'cooking';
  if (elapsed < recipe.cookMs + recipe.holdMs) return 'ready';
  return 'ruined';
}

export function tickTimers(stations: TimerStations, gameDt: number) {
  for (const id of Object.keys(stations) as TimerStationId[]) {
    const v = stations[id];
    if (v !== null) stations[id] = v + gameDt;
  }
}

// Vớt món khỏi trạm: đang chín dở → không lấy được; chín → Perfect; để quá lâu → hỏng (tính như cháy)
export function collectTimer(stations: TimerStations, id: TimerStationId): TrayItem | null {
  const recipe = TIMER_RECIPES[id];
  const phase = timerPhase(recipe, stations[id]);
  if (phase === 'idle' || phase === 'cooking') return null;
  stations[id] = null;
  const quality: QualityRating = phase === 'ready' ? 'perfect' : 'burnt';
  return { id: `tray_${id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, menuItemId: recipe.menuItemId, name: recipe.name, icon: recipe.icon, quality };
}

// ---------------------------------------------------------------------------
// Bàn ráp: món chiên (không sống) trong khay + nguyên liệu → món mới, giữ chất lượng của món chiên
// ---------------------------------------------------------------------------

export type AssemblyId = 'chicken_burger' | 'chicken_rice' | 'korean_tokbokki_chicken';

export interface AssemblyRecipe {
  menuItemId: AssemblyId;
  name: string;
  icon: string;
  base: BaseMenuItemId;      // món chiên cần có trong khay
  stock: readonly string[];
  chapter: number;
}

export const ASSEMBLY_RECIPES: Record<AssemblyId, AssemblyRecipe> = {
  chicken_burger: { menuItemId: 'chicken_burger', name: 'Burger Gà Giòn', icon: '🍔', base: 'crispy_chicken', stock: ['burger_bun'], chapter: 3 },
  chicken_rice: { menuItemId: 'chicken_rice', name: 'Cơm Gà Sốt Đặc Biệt', icon: '🍛', base: 'spicy_chicken', stock: [], chapter: 4 },
  korean_tokbokki_chicken: { menuItemId: 'korean_tokbokki_chicken', name: 'Gà Trộn Tokbokki Phô Mai', icon: '🍲', base: 'spicy_chicken', stock: ['potato_cheese'], chapter: 4 }
};

export function assemblyBaseIndex(tray: readonly TrayItem[], recipe: AssemblyRecipe): number {
  return tray.findIndex(t => t.menuItemId === recipe.base && t.quality !== 'raw');
}

// Thay món chiên trong khay bằng món ráp (cùng ô, giữ chất lượng). Caller trừ nguyên liệu trước.
export function assemble(tray: TrayItem[], recipe: AssemblyRecipe): boolean {
  const i = assemblyBaseIndex(tray, recipe);
  const base = tray[i];
  if (!base) return false;
  tray[i] = { ...base, id: `${base.id}_${recipe.menuItemId}`, menuItemId: recipe.menuItemId, name: recipe.name, icon: recipe.icon };
  return true;
}

// ---------------------------------------------------------------------------
// Máy nước
// ---------------------------------------------------------------------------

export type DrinkId = 'soda' | 'seven_up' | 'fanta_orange' | 'peach_tea' | 'sundae_icecream';
export interface DrinkRecipe { menuItemId: DrinkId; name: string; icon: string; stock: string; chapter: number; label: string }

export const DRINK_RECIPES: Record<DrinkId, DrinkRecipe> = {
  soda: { menuItemId: 'soda', name: 'Nước Ngọt Coca', icon: '🥤', stock: 'soft_drink', chapter: 1, label: 'Coca' },
  seven_up: { menuItemId: 'seven_up', name: 'Nước Ngọt 7Up Chanh', icon: '🥤', stock: 'soft_drink', chapter: 1, label: '7Up' },
  fanta_orange: { menuItemId: 'fanta_orange', name: 'Nước Ngọt Fanta Cam', icon: '🥤', stock: 'soft_drink', chapter: 1, label: 'Fanta' },
  peach_tea: { menuItemId: 'peach_tea', name: 'Trà Đào Hạt Chia', icon: '🍑', stock: 'dessert_pack', chapter: 3, label: 'Trà đào' },
  sundae_icecream: { menuItemId: 'sundae_icecream', name: 'Kem Sundae Sôcôla', icon: '🍨', stock: 'dessert_pack', chapter: 4, label: 'Kem' }
};

export const isDrinkId = (v: string): v is DrinkId => v in DRINK_RECIPES;
export const isAssemblyId = (v: string): v is AssemblyId => v in ASSEMBLY_RECIPES;
export const isTimerStationId = (v: string): v is TimerStationId => v in TIMER_RECIPES;

// ---------------------------------------------------------------------------
// Khay múc (quầy inox GN 1/6): món kèm giải ngấy, không nấu, chạm là múc vào khay
// ---------------------------------------------------------------------------

export type ScoopId = 'danmuji' | 'coleslaw';
export interface ScoopRecipe { menuItemId: ScoopId; name: string; icon: string; stock: string; chapter: number }

export const SCOOP_RECIPES: Record<ScoopId, ScoopRecipe> = {
  danmuji: { menuItemId: 'danmuji', name: 'Củ Cải Vàng Muối Chua Ngọt', icon: '🥒', stock: 'danmuji', chapter: 1 },
  coleslaw: { menuItemId: 'coleslaw', name: 'Bắp Cải Trộn Sốt Mè Rang', icon: '🥗', stock: 'coleslaw', chapter: 2 }
};

export const isScoopId = (v: string): v is ScoopId => v in SCOOP_RECIPES;
