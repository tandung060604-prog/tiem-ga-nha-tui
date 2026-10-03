import { CustomerOrder, DineInTable } from '../types/game';
import { EconomyEngine } from './economy';
import type { CookingSnapshot } from './cooking';
import { TimerStations, emptyTimerStations, tickTimers } from './stations';
import type { HelperFry } from './staff';
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
  timers: TimerStations; // nồi mì, lò bánh (null = rảnh)
  helpers: (HelperFry | null)[]; // giỏ chiên của phụ bếp (core/staff.ts)
  waiterMs: number;              // phục vụ đang chờ lên món bao lâu
  tutorial?: boolean;            // Bác Ba đang hướng dẫn: đồng hồ + khách đứng yên, chảo vẫn chạy
  fx?: FxEvent[];                // hiệu ứng chờ giao diện vẽ (tiền bay, chuỗi Perfect, khách bỏ về) — drainFx()
  lostCount: number;
  grossRevenue: number;
  tips: number;
  ingredientCost: number;
  burntCount: number;
  perfectCount: number;
  totalFriedCount: number;
  topSellerId: string;
  midIncidentTriggered?: boolean;
  soldCounts?: Record<string, number>; // số món đã giao theo loại → món bán chạy
  bestStreak?: number;                 // chuỗi Perfect dài nhất trong ca
  // Sổ P&L (core/accounting.ts). Tùy chọn: ca bán dở lưu từ bản cũ không có.
  revenueDelivery?: number;            // phần doanh thu từ đơn app (trong grossRevenue)
  counterOrders?: number;
  deliveryOrders?: number;
  cups?: number;                       // số ly nước đã giao (ly nắp + ống hút)
  squirts?: number;                    // số phần tương đã xịt trên món giao đi
  burntWaste?: number;                 // tiền mất vì món cháy (khách trả nửa giá)
  friedMainOrders?: number;            // đơn có món chính chiên ngập dầu
  cleanserOrders?: number;             // … và có món giải ngấy (củ cải, bắp cải) → sao Hương vị
  fastServeCount?: number;             // số đơn giao nhanh (kiên nhẫn >= 65%)
  slowServeCount?: number;             // số đơn giao chậm (kiên nhẫn <= 35%)
  expensiveCount?: number;             // số đơn giá cao/chặt chém
  fairPriceCount?: number;             // số đơn giá hợp lý/rẻ
  wrongOrderCount?: number;            // số đơn giao sai món
  missedItemsCount?: number;           // số đơn giao thiếu món
  apologiesCount?: number;             // số đơn hủy do hết hàng và xin lỗi khách
  expectedCustomers?: number;          // số khách dự kiến hôm nay
  spawnedCount?: number;               // số khách đã ghé quán trong ca
  disruptionTimerSec?: number;         // đếm ngược thời gian gián đoạn quán khi bị giang hồ quậy phá
  disruptionNotice?: string;           // thông báo tình trạng gián đoạn quán
  secretSauceTip?: number;             // tiền tip nhận được từ hiệu ứng Sốt Bí Truyền
  // Tên Trộm Đóng Giả Khách Hàng (Thief Encounter)
  thiefSchedule?: { count: number; timestamps: number[] };
  activeThief?: import('../types/game').ThiefEncounter | null;
  thiefCaughtCount?: number;
  thiefEscapedCount?: number;
  departingCustomers?: DepartingCustomer[]; // Khách hàng vừa nhận đồ, đang diễn hoạt nhận món & quay người bước đi
  dineInTables?: DineInTable[];             // Bàn ăn hiên quán (Patio Tables)
}

// Khách hàng hoàn tất đơn hàng đang trong chu trình thư thái rời quán (4-Beat Serving Flow)
export interface DepartingCustomer {
  order: CustomerOrder;
  phase: 'receiving' | 'leaving';
  startedAt: number;
  paid: number;
  tip: number;
  isDelighted: boolean;
  takeawayItemName?: string;
}

// Hiệu ứng "đã tay": core ghi lại chuyện vừa xảy ra, giao diện rút ra (drainFx) để vẽ đúng một lần.
// Không suy ngược từ doanh thu (bỏ sót lần bán đầu, lệch khi tiếp tục ca dở).
export type FxEvent =
  | { kind: 'cash'; paid: number; tip: number }
  | { kind: 'streak'; streak: number; tip: number } // chuỗi Perfect ≥ 2 và tip mẻ tiếp theo
  | { kind: 'lost' };

const MAX_PENDING_FX = 20;
export function pushFx(session: SellingSession, fx: FxEvent) {
  (session.fx ??= []).push(fx);
  if (session.fx.length > MAX_PENDING_FX) session.fx.splice(0, session.fx.length - MAX_PENDING_FX);
}
export function drainFx(session: SellingSession): FxEvent[] {
  const out = session.fx ?? [];
  session.fx = [];
  return out;
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
    timers: emptyTimerStations(),
    helpers: [],
    waiterMs: 0,
    lostCount: 0,
    grossRevenue: 0,
    tips: 0,
    ingredientCost: 0,
    burntCount: 0,
    perfectCount: 0,
    totalFriedCount: 0,
    topSellerId: 'crispy_chicken',
    fastServeCount: 0,
    slowServeCount: 0,
    expensiveCount: 0,
    fairPriceCount: 0,
    wrongOrderCount: 0,
    missedItemsCount: 0,
    expectedCustomers: 10,
    spawnedCount: 0,
    departingCustomers: [],
    dineInTables: []
  };
}

export function tickDineInTables(session: SellingSession, gameDtMs: number): void {
  if (!session.dineInTables || session.dineInTables.length === 0) return;
  const dtSec = gameDtMs / 1000;
  for (const table of session.dineInTables) {
    if (table.status === 'eating') {
      table.eatingTimerSec -= dtSec;
      if (table.eatingTimerSec <= 0) {
        table.eatingTimerSec = 0;
        table.status = 'dirty';
      }
    }
  }
}

export function cleanDineInTable(session: SellingSession, tableIndex: number): { success: boolean; tipCollected: number; tableName: string } {
  if (!session.dineInTables) return { success: false, tipCollected: 0, tableName: '' };
  const table = session.dineInTables.find(t => t.tableIndex === tableIndex) || session.dineInTables[tableIndex];
  if (!table || table.status !== 'dirty') {
    return { success: false, tipCollected: 0, tableName: table?.name || '' };
  }
  const tipCollected = Math.max(0, table.tipAmount || 2000); // Tối thiểu 2k tip thưởng cho việc dọn bàn
  session.tips = (session.tips || 0) + tipCollected;
  session.grossRevenue = (session.grossRevenue || 0) + tipCollected;
  pushFx(session, { kind: 'cash', paid: 0, tip: tipCollected });

  table.status = 'empty';
  table.customerName = undefined;
  table.customerAvatar = undefined;
  table.foodName = undefined;
  table.foodIcon = undefined;
  table.tipAmount = 0;
  table.eatingTimerSec = 0;
  table.eatingDurationSec = 0;
  table.isCritic = false;
  table.cleanProgress = 0;
  table.isBeingCleaned = false;
  table.cleanedByStaff = false;
  table.staffCleanerName = undefined;

  return { success: true, tipCollected, tableName: table.name };
}

export interface ScrubResult {
  completed: boolean;
  progress: number;
  tipCollected?: number;
  tableName?: string;
}

/**
 * Thao tác chà / lau bàn bằng tay của người chơi:
 * - baseScrubMs: thời gian mặc định để chà sạch (~3500ms = 3.5s)
 * - isVigorous: cọ xát ngón tay di chuyển qua lại (tăng tốc độ lên ~1.85x, chỉ mất ~1.8s - 2.0s)
 */
export function scrubDineInTable(
  session: SellingSession,
  tableIndex: number,
  deltaMs: number,
  isVigorous = false
): ScrubResult {
  if (!session.dineInTables) return { completed: false, progress: 0 };
  const table = session.dineInTables.find(t => t.tableIndex === tableIndex) || session.dineInTables[tableIndex];
  if (!table || table.status !== 'dirty') {
    return { completed: false, progress: 0 };
  }

  table.isBeingCleaned = true;
  const baseTimeMs = 3500;
  const speedMultiplier = isVigorous ? 1.85 : 1.0;
  const progressGain = (deltaMs / baseTimeMs) * 100 * speedMultiplier;

  table.cleanProgress = Math.min(100, (table.cleanProgress || 0) + progressGain);

  if (table.cleanProgress >= 100) {
    const res = cleanDineInTable(session, tableIndex);
    return {
      completed: true,
      progress: 100,
      tipCollected: res.tipCollected,
      tableName: res.tableName
    };
  }

  return {
    completed: false,
    progress: Math.min(99, Math.round(table.cleanProgress))
  };
}

/**
 * Người chơi nhấc tay ra khỏi bàn: dừng cọ xát thủ công
 */
export function stopScrubbingDineInTable(session: SellingSession, tableIndex: number): void {
  if (!session.dineInTables) return;
  const table = session.dineInTables.find(t => t.tableIndex === tableIndex) || session.dineInTables[tableIndex];
  if (!table) return;
  if (!table.cleanedByStaff) {
    table.isBeingCleaned = false;
  }
}

/**
 * Nhân viên Phục Vụ (Waiter) tự động lau bàn bẩn khi rảnh tay:
 * - waiterCleanMs: Thời gian Waiter cần để dọn xong 1 bàn (cấp 1 ~4.0s, cấp 5 ~1.5s)
 */
export function waiterCleanDineInTable(
  session: SellingSession,
  tableIndex: number,
  deltaMs: number,
  waiterCleanMs: number,
  staffName?: string
): ScrubResult {
  if (!session.dineInTables) return { completed: false, progress: 0 };
  const table = session.dineInTables.find(t => t.tableIndex === tableIndex) || session.dineInTables[tableIndex];
  if (!table || table.status !== 'dirty') {
    return { completed: false, progress: 0 };
  }

  table.isBeingCleaned = true;
  table.cleanedByStaff = true;
  table.staffCleanerName = staffName || 'Phục vụ';

  const cleanTime = Math.max(1000, waiterCleanMs);
  const progressGain = (deltaMs / cleanTime) * 100;
  table.cleanProgress = Math.min(100, (table.cleanProgress || 0) + progressGain);

  if (table.cleanProgress >= 100) {
    const res = cleanDineInTable(session, tableIndex);
    return {
      completed: true,
      progress: 100,
      tipCollected: res.tipCollected,
      tableName: res.tableName
    };
  }

  return {
    completed: false,
    progress: Math.min(99, Math.round(table.cleanProgress))
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
  const devSpeed = (typeof window !== 'undefined' && (window as any).__DEV_SPEED__) ? Math.max(1, Number((window as any).__DEV_SPEED__)) : 1;
  return session.isPaused ? 0 : dt * (session.isFastForward ? FAST_FORWARD : 1) * devSpeed;
}

export function tickSelling(session: SellingSession, gameDt: number, ctx: TickContext): TickEvent[] {
  const events: TickEvent[] = [];
  if (session.tutorial) return events;

  session.gameHour += gameDt / GAME_HOUR_MS;
  tickTimers(session.timers, gameDt);
  tickDineInTables(session, gameDt);

  session.expectedCustomers = ctx.expectedCustomers;
  session.spawnedCount ??= session.orders.length;

  const stillWaiting: CustomerOrder[] = [];
  for (let i = 0; i < session.orders.length; i++) {
    const order = session.orders[i];
    if (!order) continue;
    // Kiên nhẫn giãn cách theo hàng đợi FIFO: khách đến trước (i = 0) đang được phục vụ trực tiếp,
    // khách đứng sau (i = 1, 2...) thấy có người trước nên kiên nhẫn chờ hơn
    const queueFactor = i === 0 ? 1.0 : i === 1 ? 0.65 : 0.45;
    const traitFactor = order.personality === 'impatient' ? 1.35 : order.personality === 'easygoing' ? 0.75 : 1.0;
    const devSpeed = (typeof window !== 'undefined' && (window as any).__DEV_SPEED__) ? Math.max(1, Number((window as any).__DEV_SPEED__)) : 1;
    const effectivePatienceDt = devSpeed > 1 ? (gameDt / devSpeed) : gameDt;
    order.patienceCurrent -= (effectivePatienceDt / 1000) * queueFactor * traitFactor;

    if (order.patienceCurrent > 0) {
      stillWaiting.push(order);
    } else {
      session.lostCount += 1;
      pushFx(session, { kind: 'lost' });
      events.push({ type: 'customerLeft', order });
    }
  }
  session.orders = stillWaiting;

  // Xử lý gián đoạn quán khi bị giang hồ quậy phá đuổi khách
  const isDisrupted = (session.disruptionTimerSec ?? 0) > 0;
  if (isDisrupted) {
    session.disruptionTimerSec = Math.max(0, (session.disruptionTimerSec ?? 0) - (gameDt / 1000));
    if (session.disruptionTimerSec === 0) {
      session.disruptionNotice = undefined;
    }
  }

  // Spawning logic: Điều tiết nhịp độ sao cho toàn bộ expectedCustomers đều đến quán
  if (!isDisrupted) {
    session.spawnTimerMs += gameDt;
  }

  const remainingToSpawn = Math.max(0, ctx.expectedCustomers - (session.spawnedCount ?? 0));
  const hoursLeft = Math.max(0.1, CLOSE_HOUR - session.gameHour);
  const rushFactor = isRushHour(session.gameHour) ? 0.85 : 1.0;
  // Breather Throttling (Jev Option B - Confidence 1.0): Hàng đợi đông (>=3) tự động giãn nhịp để người chơi có khoảng thở xử lý
  const queueBreather = session.orders.length >= 4 ? 1.75 : session.orders.length >= 3 ? 1.35 : 1.0;
  const baseInterval = remainingToSpawn > 0 
    ? ((hoursLeft * GAME_HOUR_MS) / (remainingToSpawn + 0.3)) * rushFactor * queueBreather
    : EconomyEngine.spawnIntervalMs(ctx.expectedCustomers, isRushHour(session.gameHour));
  const dynamicInterval = Math.max(3800, Math.min(25000, baseInterval));

  if (
    !isDisrupted &&
    remainingToSpawn > 0 &&
    session.gameHour < CLOSE_HOUR &&
    session.spawnTimerMs >= dynamicInterval &&
    session.orders.length < MAX_QUEUE
  ) {
    session.spawnTimerMs = 0;
    session.spawnedCount = (session.spawnedCount ?? 0) + 1;
    const order = ctx.spawnCustomer();
    session.orders.push(order);
    events.push({ type: 'customerArrived', order });
  }

  if (session.gameHour >= CLOSE_HOUR) events.push({ type: 'dayOver' });

  return events;
}
