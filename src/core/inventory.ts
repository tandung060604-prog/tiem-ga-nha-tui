import { GameState, InventoryItem } from '../types/game';

// Kho theo lô: mỗi lần nhập là một lô có hạn riêng, xuất kho theo FIFO (lô cũ trước).
// `amount` và `currentLifeDays` luôn được đồng bộ từ `batches` để UI cũ đọc được.

function sync(item: InventoryItem) {
  item.batches = item.batches.filter(b => b.amount > 0);
  // Đã bán bớt từ lô đang được đổi trả → phần hoàn được không vượt quá phần còn lại
  for (const b of item.batches) if (b.refundable) b.refundable = Math.min(b.refundable, b.amount);
  item.amount = item.batches.reduce((sum, b) => sum + b.amount, 0);
  item.currentLifeDays = item.batches[0]?.daysLeft ?? item.shelfLifeDays;
}

// Save cũ (trước khi có lô) chỉ có amount + currentLifeDays: gom thành một lô.
export function ensureBatches(item: InventoryItem) {
  if (!Array.isArray(item.batches)) {
    item.batches = item.amount > 0 ? [{ amount: item.amount, daysLeft: item.currentLifeDays }] : [];
  }
  sync(item);
}

// `unitCost` có nghĩa là lô MUA bằng tiền (được đổi trả trong ngày); bỏ trống = hàng tặng/tiếp tế.
export function addStock(item: InventoryItem, qty: number, unitCost?: number) {
  ensureBatches(item);
  item.batches.push(unitCost === undefined
    ? { amount: qty, daysLeft: item.shelfLifeDays }
    : { amount: qty, daysLeft: item.shelfLifeDays, refundable: qty, unitCost });
  sync(item);
}

export function refundableUnits(item: InventoryItem | undefined): number {
  if (!item) return 0;
  ensureBatches(item);
  return item.batches.reduce((sum, b) => sum + (b.refundable ?? 0), 0);
}

// Trả về false (không trừ gì) nếu không đủ hàng. Xuất kho FIFO (lô cũ trước).
export function consumeStock(item: InventoryItem | undefined, qty: number): boolean {
  if (!item) return false;
  ensureBatches(item);
  if (item.amount < qty) return false;
  let left = qty;
  for (const batch of item.batches) {
    const take = Math.min(batch.amount, left);
    batch.amount -= take;
    left -= take;
    if (left === 0) break;
  }
  sync(item);
  return true;
}

// Đổi trả trong ngày (nút −5): chỉ hoàn hàng MUA HÔM NAY, chưa qua đêm, đúng giá đã trả; lô mới nhất trước.
// Trả về số tiền hoàn (0 = không hoàn được gì, kho không đổi). Chống lỗi cũ: hoàn nguyên giá cả hàng
// được tặng lúc đầu game và hàng sắp hết hạn → in tiền, xóa mất rủi ro "mua dư là lỗ".
export function refundPurchase(item: InventoryItem | undefined, qty: number): number {
  if (!item || qty <= 0 || refundableUnits(item) < qty) return 0;
  let left = qty;
  let money = 0;
  for (let i = item.batches.length - 1; i >= 0 && left > 0; i--) {
    const batch = item.batches[i];
    if (!batch?.refundable) continue;
    const take = Math.min(batch.refundable, left);
    batch.amount -= take;
    batch.refundable -= take;
    money += take * (batch.unitCost ?? item.cost);
    left -= take;
  }
  sync(item);
  return money;
}

// Kiểm tra nguyên liệu đã mở khóa hay chưa
export function isIngredientUnlocked(item: InventoryItem | undefined): boolean {
  if (!item) return false;
  return item.unlocked ?? true;
}

// Kiểm tra điều kiện mở khóa hợp đồng cung ứng nguyên liệu
export function canUnlockIngredient(
  state: { day: number; money: number; inventory: { [id: string]: InventoryItem } },
  itemId: string
): { canUnlock: boolean; reason?: string } {
  const item = state.inventory[itemId];
  if (!item) return { canUnlock: false, reason: 'Nguyên liệu không tồn tại' };
  if (item.unlocked) return { canUnlock: false, reason: 'Đã mở khóa' };

  const minDay = item.unlockDay ?? 1;
  const cost = item.unlockCost ?? 0;

  if (state.day < minDay) {
    return { canUnlock: false, reason: `Cần đạt Ngày ${minDay}` };
  }
  if (state.money < cost) {
    return { canUnlock: false, reason: `Thiếu tiền hợp đồng (${(cost / 1000).toLocaleString('vi-VN')}k)` };
  }
  return { canUnlock: true };
}

export interface UnlockResult { success: boolean; reason?: string; cost: number }

// Kiểm tra điều kiện và mở khóa (KHÔNG trừ tiền). Dùng signIngredientContract để làm trọn thao tác.
export function unlockIngredient(item: InventoryItem | undefined, currentMoney: number, currentDay: number): UnlockResult {
  if (!item) return { success: false, reason: 'Nguyên liệu không tồn tại', cost: 0 };
  if (item.unlocked !== false) return { success: false, reason: 'Nguyên liệu này đã được mở khóa!', cost: 0 };
  const unlockDay = item.unlockDay ?? 1;
  if (currentDay < unlockDay) {
    return { success: false, reason: `Cần đạt Ngày ${unlockDay} để mở hợp đồng cung ứng!`, cost: 0 };
  }
  const cost = item.unlockCost ?? 0;
  if (currentMoney < cost) {
    return { success: false, reason: `Không đủ tiền ký hợp đồng (Cần ${cost.toLocaleString('vi-VN')}đ)!`, cost };
  }
  item.unlocked = true;
  return { success: true, cost };
}

// Ký hợp đồng cung ứng: kiểm tra, mở khóa VÀ trừ phí trong một bước (không để caller quên trừ tiền).
export function signIngredientContract(state: GameState, itemId: string): UnlockResult {
  const result = unlockIngredient(state.inventory[itemId], state.money, state.day);
  if (result.success) state.money -= result.cost;
  return result;
}

// Qua một đêm: trừ hạn mọi lô, bỏ lô hết hạn. Trả về số đơn vị bị bỏ.
export function ageOneDay(item: InventoryItem): number {
  ensureBatches(item);
  let expired = 0;
  for (const batch of item.batches) {
    batch.refundable = 0; // qua đêm: hết hạn đổi trả
    batch.daysLeft -= 1;
    if (batch.daysLeft <= 0) {
      expired += batch.amount;
      batch.amount = 0;
    }
  }
  sync(item);
  return expired;
}
