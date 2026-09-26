import { CustomerOrder } from '../types/game';
import { EconomyEngine } from './economy';
import type { CookingSnapshot } from './cooking';
import { OPEN_HOUR, CLOSE_HOUR, GAME_HOUR_MS, isRushHour } from './clock';

// Mô phỏng ca bán, không đụng DOM/âm thanh: main.ts gọi mỗi frame rồi tự xử lý các sự kiện
// trả về (toast, âm thanh, render). Nhờ vậy test được và chạy được mô phỏng cân bằng headless.

export interface SellingSession {
  gameHour: number; // OPEN_HOUR → CLOSE_HOUR (10.0 → 21.0)
  isPaused: boolean;
  isFastForward: boolean;
  orders: CustomerOrder[];
  spawnTimerMs: number; // thời gian game đã trôi kể từ lượt khách trước
  servedCount: number;
  totalWaitSec: number; // tổng thời gian chờ của khách đã phục vụ → sao Tốc độ
  perfectStreak: number; // số mẻ Perfect liên tiếp (cháy/sống → về 0): thưởng tay nghề
  lostCount: number;
  grossRevenue: number;
  tips: number;
  ingredientCost: number;
  burntCount: number;
  perfectCount: number;
  totalFriedCount: number;
  topSellerId: string;
}

export function createSellingSession(): SellingSession {
  return {
    gameHour: OPEN_HOUR,
    isPaused: false,
    isFastForward: false,
    orders: [],
    spawnTimerMs: 0,
    servedCount: 0,
    totalWaitSec: 0,
    perfectStreak: 0,
    lostCount: 0,
    grossRevenue: 0,
    tips: 0,
    ingredientCost: 0,
    burntCount: 0,
    perfectCount: 0,
    totalFriedCount: 0,
    topSellerId: 'crispy_chicken'
  };
}

// Ca bán dở được lưu vào save để thoát app giữa ca không mất gì (và không chơi lại được ngày đó)
export interface ShiftSnapshot {
  day: number;
  session: SellingSession;
  cooking: CookingSnapshot;
  expectedCustomers: number;
  bunnyVisited: boolean;
}

export const FAST_FORWARD = 2.5;
export const MAX_QUEUE = 5;
// Một frame không được "nhảy" quá 250ms: quay lại app sau vài phút không làm cả hàng khách bỏ về
export const MAX_FRAME_MS = 250;

export interface TickContext {
  expectedCustomers: number;
  spawnCustomer: () => CustomerOrder;
}

export type TickEvent =
  | { type: 'customerLeft'; order: CustomerOrder }
  | { type: 'customerArrived'; order: CustomerOrder }
  | { type: 'dayOver' };

// Trả về thời gian game (ms) đã trôi trong frame này, để caller cập nhật chảo chiên cùng nhịp.
export function gameDeltaMs(session: SellingSession, realDtMs: number): number {
  const dt = Math.min(Math.max(realDtMs, 0), MAX_FRAME_MS);
  return session.isPaused ? 0 : dt * (session.isFastForward ? FAST_FORWARD : 1);
}

export function tickSelling(session: SellingSession, gameDt: number, ctx: TickContext): TickEvent[] {
  const events: TickEvent[] = [];

  session.gameHour += gameDt / GAME_HOUR_MS;

  const stillWaiting: CustomerOrder[] = [];
  for (const order of session.orders) {
    order.patienceCurrent -= gameDt / 1000;
    if (order.patienceCurrent > 0) {
      stillWaiting.push(order);
    } else {
      session.lostCount += 1;
      events.push({ type: 'customerLeft', order });
    }
  }
  session.orders = stillWaiting;

  session.spawnTimerMs += gameDt;
  const interval = EconomyEngine.spawnIntervalMs(ctx.expectedCustomers, isRushHour(session.gameHour));
  if (session.spawnTimerMs >= interval && session.orders.length < MAX_QUEUE) {
    session.spawnTimerMs = 0;
    const order = ctx.spawnCustomer();
    session.orders.push(order);
    events.push({ type: 'customerArrived', order });
  }

  if (session.gameHour >= CLOSE_HOUR) events.push({ type: 'dayOver' });
  return events;
}
