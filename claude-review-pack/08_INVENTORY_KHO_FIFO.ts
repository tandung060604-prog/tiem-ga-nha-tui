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

// Trả về false (không trừ gì) nếu không đủ hàng.
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
