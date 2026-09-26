import { InventoryItem } from '../types/game';

// Kho theo lô: mỗi lần nhập là một lô có hạn riêng, xuất kho theo FIFO (lô cũ trước).
// `amount` và `currentLifeDays` luôn được đồng bộ từ `batches` để UI cũ đọc được.

function sync(item: InventoryItem) {
  item.batches = item.batches.filter(b => b.amount > 0);
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

export function addStock(item: InventoryItem, qty: number) {
  ensureBatches(item);
  item.batches.push({ amount: qty, daysLeft: item.shelfLifeDays });
  sync(item);
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

// Hoàn trả vốn / giảm tồn kho theo LIFO (trả lại lô mới nhập gần nhất, giữ lại hạn của các lô trước đó).
export function refundStock(item: InventoryItem | undefined, qty: number): boolean {
  if (!item) return false;
  ensureBatches(item);
  if (item.amount < qty) return false;
  let left = qty;
  for (let i = item.batches.length - 1; i >= 0; i--) {
    const batch = item.batches[i];
    if (!batch) continue;
    const take = Math.min(batch.amount, left);
    batch.amount -= take;
    left -= take;
    if (left === 0) break;
  }
  sync(item);
  return true;
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

// Ký hợp đồng mở khóa nguyên liệu: hỗ trợ cả 2 dạng gọi (item, money, day) hoặc (state, itemId)
export function unlockIngredient(
  item: InventoryItem | undefined,
  currentMoney: number,
  currentDay: number
): { success: boolean; reason?: string; cost: number };
export function unlockIngredient(
  state: { day: number; money: number; inventory: { [id: string]: InventoryItem } },
  itemId: string
): boolean;
export function unlockIngredient(
  target: InventoryItem | { day: number; money: number; inventory: { [id: string]: InventoryItem } } | undefined,
  moneyOrItemId?: number | string,
  currentDay?: number
): { success: boolean; reason?: string; cost: number } | boolean {
  if (!target) {
    if (typeof moneyOrItemId === 'string') return false;
    return { success: false, reason: 'Nguyên liệu không tồn tại', cost: 0 };
  }

  // Signature (state, itemId)
  if ('inventory' in target && typeof moneyOrItemId === 'string') {
    const state = target;
    const item = state.inventory[moneyOrItemId];
    if (!item) return false;
    if (item.unlocked) return false;
    const minDay = item.unlockDay ?? 1;
    const cost = item.unlockCost ?? 0;
    if (state.day < minDay || state.money < cost) return false;
    state.money -= cost;
    item.unlocked = true;
    return true;
  }

  // Signature (item, currentMoney, currentDay)
  const item = target as InventoryItem;
  const currentMoney = typeof moneyOrItemId === 'number' ? moneyOrItemId : 0;
  const day = currentDay ?? 1;

  if (item.unlocked) return { success: false, reason: 'Nguyên liệu này đã được mở khóa!', cost: 0 };
  const unlockDay = item.unlockDay ?? 1;
  if (day < unlockDay) {
    return { success: false, reason: `Cần đạt Ngày ${unlockDay} để mở hợp đồng cung ứng!`, cost: 0 };
  }
  const cost = item.unlockCost ?? 0;
  if (currentMoney < cost) {
    return { success: false, reason: `Không đủ tiền ký hợp đồng (Cần ${cost.toLocaleString('vi-VN')}đ)!`, cost };
  }
  item.unlocked = true;
  return { success: true, cost };
}

// Qua một đêm: trừ hạn mọi lô, bỏ lô hết hạn. Trả về số đơn vị bị bỏ.
export function ageOneDay(item: InventoryItem): number {
  ensureBatches(item);
  let expired = 0;
  for (const batch of item.batches) {
    batch.daysLeft -= 1;
    if (batch.daysLeft <= 0) {
      expired += batch.amount;
      batch.amount = 0;
    }
  }
  sync(item);
  return expired;
}
