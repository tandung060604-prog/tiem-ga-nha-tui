import { GameState, PrepSlotState } from '../types/game';
import { INITIAL_MENU } from '../content/menu';
import { ASSETS } from '../content/assets';
import { FRY_RECIPES } from './staff';

// Quầy khay inox âm bàn (chuẩn Gastronorm). Bố cục CỐ ĐỊNH: mọi khay luôn được dựng, khay chưa mở phủ nắp
// + ổ khóa kèm điều kiện → mở món mới không làm giao diện co giãn. UI: ui/components/PrepStation.ts.
//  • Hàng trên, khay nông GN 1/6: món kèm múc thẳng (củ cải, bắp cải) và thau sốt đảo gà
//  • Hàng dưới, khay sâu GN 1/3 có kẹp gắp: đồ sống sẵn sàng thả chảo
// Ảnh: `asset` = null thì UI dùng emoji `icon` (ảnh khay GN do Gemini vẽ, xem docs/phan-cong.md).

interface PrepPanDef {
  id: string;
  row: PrepSlotState['row'];
  action: string;
  menuItemId: string;  // món quyết định chương / ngày mở khay
  stock: readonly string[]; // tồn kho hiển thị = phần làm được (ít nhất trong các nguyên liệu)
  label: string;
  icon: string;
  asset: string | null;
}

export const PREP_LAYOUT: readonly PrepPanDef[] = [
  { id: 'danmuji', row: 'top', action: 'scoop-danmuji', menuItemId: 'danmuji', stock: ['danmuji'], label: 'Củ Cải Muối', icon: '🥒', asset: ASSETS.kitchen.gnSideRadishPickled },
  { id: 'coleslaw', row: 'top', action: 'scoop-coleslaw', menuItemId: 'coleslaw', stock: ['coleslaw'], label: 'Bắp Cải Trộn', icon: '🥗', asset: ASSETS.kitchen.gnSideColeslaw },
  { id: 'yangnyeom', row: 'top', action: 'season-spicy', menuItemId: 'spicy_chicken', stock: ['spicy_sauce'], label: 'Sốt Yangnyeom', icon: '🌶️', asset: ASSETS.kitchen.gnPanSauceYangnyeom },
  { id: 'soy_garlic', row: 'top', action: 'season-honey', menuItemId: 'honey_garlic_chicken', stock: ['garlic_honey'], label: 'Sốt Bơ Tỏi', icon: '🧄', asset: ASSETS.kitchen.gnPanSauceSoyGarlic },
  { id: 'chicken', row: 'bottom', action: 'fry-chicken', menuItemId: 'crispy_chicken', stock: FRY_RECIPES.crispy_chicken!.stock, label: 'Gà Tẩm Bột', icon: '🍗', asset: ASSETS.kitchen.gnPrepChickenRaw },
  { id: 'thigh', row: 'bottom', action: 'fry-thigh', menuItemId: 'spicy_thigh', stock: FRY_RECIPES.spicy_thigh!.stock, label: 'Má Đùi Cay', icon: '🍗', asset: ASSETS.kitchen.gnPrepThighRaw },
  { id: 'fries', row: 'bottom', action: 'fry-fries', menuItemId: 'shake_fries', stock: FRY_RECIPES.shake_fries!.stock, label: 'Khoai Cắt Sợi', icon: '🍟', asset: ASSETS.kitchen.gnPrepFriesRaw },
  { id: 'popcorn', row: 'bottom', action: 'fry-popcorn', menuItemId: 'popcorn_chicken', stock: FRY_RECIPES.popcorn_chicken!.stock, label: 'Gà Viên', icon: '🍿', asset: ASSETS.kitchen.gnPrepPopcornRaw },
  { id: 'cheese', row: 'bottom', action: 'fry-cheese', menuItemId: 'cheese_stick', stock: FRY_RECIPES.cheese_stick!.stock, label: 'Phô Mai Que', icon: '🧀', asset: ASSETS.kitchen.gnPrepCheeseStickRaw }
];

const k = (vnd: number) => `${Math.round(vnd / 1000).toLocaleString('vi-VN')}k`;

type PrepView = Pick<GameState, 'day' | 'currentChapter' | 'inventory'>;

// Khay chưa mở: xét lần lượt chương → ngày → hợp đồng cung ứng. null = đã mở.
export function prepLock(state: PrepView, def: PrepPanDef): PrepSlotState['lock'] | undefined {
  const menu = INITIAL_MENU.find(m => m.id === def.menuItemId);
  const chapter = menu?.chapter ?? 1;
  if (chapter > state.currentChapter) {
    return { kind: 'chapter', label: `Chương ${chapter}`, hint: `${def.label} mở ở Chương ${chapter}: đặt cọc mặt bằng mới trên bảng kế hoạch.` };
  }
  const day = Math.max(menu?.unlockDay ?? 1, ...def.stock.map(id => state.inventory[id]?.unlockDay ?? 1));
  if (day > state.day) {
    return { kind: 'day', label: `Ngày ${day}`, hint: `${def.label} mở từ Ngày ${day}. Tới ngày thì nhập hàng trong tab Kho.` };
  }
  const unsigned = def.stock.map(id => state.inventory[id]).find(inv => inv?.unlocked === false);
  if (unsigned) {
    const fee = unsigned.unlockCost ?? 0;
    return { kind: 'contract', label: `Hợp đồng ${k(fee)}`, hint: `Ký hợp đồng cung ứng "${unsigned.name}" (${fee.toLocaleString('vi-VN')}đ) trong tab Kho hàng.` };
  }
  return undefined;
}

export function prepStationSlots(state: PrepView): PrepSlotState[] {
  return PREP_LAYOUT.map(def => {
    const lock = prepLock(state, def);
    // Tồn kho hiển thị trực tiếp theo NGUYÊN LIỆU CHÍNH (Đùi gà riêng, Má đùi riêng)
    // Giúp số lượng khi mua và tồn kho quầy bếp luôn bằng nhau, không bị trừ chéo má đùi khi bán đùi gà
    const primaryId = def.stock[0] ?? '';
    const primaryStock = state.inventory[primaryId]?.amount ?? 0;
    return {
      id: def.id,
      row: def.row,
      pan: def.row === 'top' ? '1-6' : '1-3',
      action: def.action,
      ingredientId: primaryId,
      menuItemId: def.menuItemId,
      label: def.label,
      icon: def.icon,
      asset: def.asset,
      stock: lock ? 0 : primaryStock,
      status: lock ? 'locked' : primaryStock > 0 ? 'ready' : 'empty',
      ...(lock ? { lock } : {})
    };
  });
}
