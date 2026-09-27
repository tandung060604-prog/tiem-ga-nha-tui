import { Condiment, CustomerOrder, CustomerPersonality, CustomerReview, DayLedger, GameEvent, GameState, QualityRating, TrayItem, UpgradeBranch } from '../types/game';
import { RANDOM_EVENTS } from '../content/events';
import { BUNNY_LETTERS, BunnyLetter, MysteryBunnyEngine } from '../content/mysteryBunny';
import { INITIAL_MENU } from '../content/menu';
import { OrdersEngine, basketRoleOf } from './orders';
import { maintenanceCost } from './accounting';
import { EconomyEngine } from './economy';
import { ReviewsEngine } from './reviewsEngine';
import { ageOneDay, consumeStock, addStock } from './inventory';
import { CookingEngine, Sauce } from './cooking';
import {
  TIMER_RECIPES, TimerStationId, collectTimer, DRINK_RECIPES, DrinkId, ASSEMBLY_RECIPES, AssemblyId, assemble, assemblyBaseIndex,
  SCOOP_RECIPES, ScoopId
} from './stations';
import { upgradeEffects } from './upgrades';
import { staffEffects, endShiftForStaff, FRY_RECIPES } from './staff';
import { karmaEffects } from './karmaEffects';
import { averagePriceRatio, communityDriftFromPrice } from './pricing';
import { applyKarmaChange } from '../content/endings';
import { auditState, flagIntegrity } from './integrity';
import { SellingSession, pushFx } from './sellingSim';
import { random } from './rng';

// Luật của một ngày (sự kiện, khách, giao món, chốt sổ), không DOM/âm thanh.
// main.ts và mô phỏng cân bằng (scripts/balance-sim.ts) gọi CÙNG các hàm này.

export const INSPECTION_FINE = 200000;
export const FAST_SERVICE_TIP = 5000;
export const PERFECT_TIP = 2000;
// Chuỗi Perfect liên tiếp nhân tip: 1 mẻ ×1, rồi +25% mỗi mẻ, tối đa ×3 (mô phỏng: kỹ năng trước đây gần như không ra tiền)
export function perfectTip(streak: number): number {
  return Math.round(PERFECT_TIP * (1 + Math.min(Math.max(streak - 1, 0), 8) * 0.25) * 2.5);
}
export const BUNNY_VISIT_TIP = 35000;
export const CONDIMENT_TIP = 2000;

// Quầy tương: xịt lên món trong khay. Ưu tiên món khách đầu hàng dặn đúng loại tương này; không ai dặn thì
// xịt lên món chiên đầu tiên chưa có tương (không có tip). Trả về món vừa xịt, hoặc null nếu không có món.
export function squeezeCondiment(tray: TrayItem[], orders: readonly CustomerOrder[], sauce: Condiment): { item: TrayItem; requested: boolean } | null {
  const fried = (t: TrayItem) => !!FRY_RECIPES[t.menuItemId] && !t.condiment && t.quality !== 'raw';
  for (const order of orders.slice(0, 2)) {
    for (const line of order.items) {
      if (line.condiment !== sauce || (line.condimentServed ?? 0) >= line.count) continue;
      const item = tray.find(t => fried(t) && t.menuItemId === line.menuItemId);
      if (item) { item.condiment = sauce; return { item, requested: true }; }
    }
  }
  const item = tray.find(fried);
  if (!item) return null;
  item.condiment = sauce;
  return { item, requested: false };
}

export function eventForDay(day: number): GameEvent {
  return RANDOM_EVENTS[(day - 1) % RANDOM_EVENTS.length] ?? RANDOM_EVENTS[0];
}

// ---------------------------------------------------------------------------
// Khách
// ---------------------------------------------------------------------------

function regularCustomer(state: GameState, event: GameEvent): CustomerOrder {
  const deliveryChance = Math.min(0.9, 0.4 * (event.effect.deliveryMultiplier ?? 1));
  const isDelivery = state.currentChapter >= 3 && random() < deliveryChance;
  return OrdersEngine.generateOrder(state, isDelivery, event.effect.priceMultiplier ?? 1);
}

// Nguồn khách của một ca: 2 khách lúc mở cửa (hoặc Thỏ Cam mang thư + 1 khách), sau đó
// mỗi lượt là khách thường, Thỏ Cam ghé ngẫu nhiên tối đa 1 lần/ngày.
// `resumeBunnyVisited`: tiếp tục ca bán dở → giữ trạng thái "Thỏ Cam đã ghé hôm nay"
export function createCustomerSource(state: GameState, event: GameEvent, resumeBunnyVisited?: boolean) {
  const letter = MysteryBunnyEngine.getScheduledLetter(state);
  let bunnyVisited = resumeBunnyVisited ?? letter !== null;

  return {
    opening(): CustomerOrder[] {
      if (letter) {
        return [OrdersEngine.generateBunnyOrder(state, letter)];
      }
      // Ngày đầu (Chương 1, Ngày 1-2): chỉ 1 khách mở cửa để không bị dồn dập
      if (state.currentChapter === 1 && state.day <= 2) {
        return [regularCustomer(state, event)];
      }
      return [regularCustomer(state, event), regularCustomer(state, event)];
    },
    bunnyVisited: () => bunnyVisited,
    next(queue: readonly CustomerOrder[]): CustomerOrder {
      if (!bunnyVisited && MysteryBunnyEngine.shouldSpawnRandomVisit(state.day) && !queue.some(o => o.isBunny)) {
        bunnyVisited = true;
        return OrdersEngine.generateBunnyOrder(state, null);
      }
      return regularCustomer(state, event);
    }
  };
}

// ---------------------------------------------------------------------------
// Bếp
// ---------------------------------------------------------------------------

export const SAUCE_STOCK: Record<Sauce, string> = { spicy: 'spicy_sauce', honey: 'garlic_honey' };

// Trừ 1 đơn vị mỗi nguyên liệu (all-or-nothing). Tiền đã trả lúc nhập kho: ở đây chỉ ghi giá vốn
// đã dùng vào sổ (session.ingredientCost), không trừ ví lần nữa.
export function useIngredients(draft: GameState, session: SellingSession | null, ids: readonly string[]): boolean {
  if (!ids.every(id => (draft.inventory[id]?.amount ?? 0) >= 1)) return false;
  for (const id of ids) {
    consumeStock(draft.inventory[id], 1);
    if (session) session.ingredientCost += draft.inventory[id]?.cost ?? 0;
  }
  return true;
}

// Mọi lần vớt (tay, tự cháy, dây chuyền tự động): trừ sốt, dầu xuống cấp, đếm chất lượng.
export function recordFryerLift(
  draft: GameState, session: SellingSession | null, result: ReturnType<CookingEngine['liftFryer']>
): void {
  if (result.usedSauce) useIngredients(draft, session, [SAUCE_STOCK[result.usedSauce]]);
  draft.oilBatchesCooked += 1;
  draft.oilCondition = CookingEngine.getOilCondition(draft.oilBatchesCooked, upgradeEffects(draft.upgrades).oilLifePct);
  if (session && result.quality === 'perfect') {
    session.perfectCount += 1;
    session.perfectStreak += 1;
    session.bestStreak = Math.max(session.bestStreak ?? 0, session.perfectStreak);
    if (session.perfectStreak >= 2) pushFx(session, { kind: 'streak', streak: session.perfectStreak, tip: perfectTip(session.perfectStreak) });
  }
  if (session && result.quality === 'burnt') session.burntCount += 1;
  if (session && result.quality !== 'perfect') session.perfectStreak = 0; // chỉ Perfect mới giữ chuỗi
}

// Mẻ của phụ bếp: dầu xuống cấp, đếm chất lượng (chấm sao Vị), không đụng chuỗi Perfect của người chơi
export function recordHelperFry(draft: GameState, session: SellingSession, quality: QualityRating): void {
  draft.oilBatchesCooked += 1;
  draft.oilCondition = CookingEngine.getOilCondition(draft.oilBatchesCooked, upgradeEffects(draft.upgrades).oilLifePct);
  if (quality === 'perfect') session.perfectCount += 1;
  if (quality === 'burnt') session.burntCount += 1;
}

// Bác Ba tiếp tế khi hết gà và hết tiền: 1 lần mỗi chương (trước đây không giới hạn → cày tiền được)
export const BA_BA_AID_MONEY = 150000;
export function requestBaBaAid(draft: GameState): boolean {
  if ((draft.baBaAidChapter ?? 0) >= draft.currentChapter) return false;
  draft.baBaAidChapter = draft.currentChapter;
  const { chicken_meat: meat, flour } = draft.inventory;
  if (meat) addStock(meat, 15);
  if (flour) addStock(flour, 20);
  draft.money += BA_BA_AID_MONEY;
  draft.lifetimeStats.totalBonus = (draft.lifetimeStats.totalBonus ?? 0) + BA_BA_AID_MONEY;
  return true;
}

// ---------------------------------------------------------------------------
// Trạm nấu mới (Chương 2–5): kiểm tra mở khóa + trừ nguyên liệu ở một chỗ cho game và mô phỏng
// ---------------------------------------------------------------------------

export type StationResult = 'ok' | 'locked' | 'no-stock' | 'busy' | 'tray-full' | 'not-ready' | 'no-base';

// Trạm/món mở khi đã tới chương và mọi nguyên liệu đã ký hợp đồng
export function stationOpen(state: GameState, chapter: number, stock: readonly string[]): boolean {
  return state.currentChapter >= chapter && stock.every(id => state.inventory[id]?.unlocked !== false);
}

export function startTimerStation(draft: GameState, session: SellingSession, id: TimerStationId): StationResult {
  const r = TIMER_RECIPES[id];
  if (!stationOpen(draft, r.chapter, r.stock)) return 'locked';
  if (session.timers[id] !== null) return 'busy';
  if (!useIngredients(draft, session, r.stock)) return 'no-stock';
  session.timers[id] = 0;
  return 'ok';
}

export function pullTimerStation(session: SellingSession, cook: CookingEngine, id: TimerStationId): StationResult {
  if (cook.isTrayFull()) return 'tray-full';
  const item = collectTimer(session.timers, id);
  if (!item) return 'not-ready';
  cook.addToTray(item);
  if (item.quality === 'burnt') session.burntCount += 1;
  return 'ok';
}

export function makeDrink(draft: GameState, session: SellingSession, cook: CookingEngine, id: DrinkId): StationResult {
  const r = DRINK_RECIPES[id];
  if (!stationOpen(draft, r.chapter, [r.stock])) return 'locked';
  if (cook.isTrayFull()) return 'tray-full';
  if (!useIngredients(draft, session, [r.stock])) return 'no-stock';
  cook.addDrink(id);
  return 'ok';
}

// Khay múc: củ cải muối / bắp cải trộn vào khay (không nấu nên luôn đạt 'good')
export function scoopSide(draft: GameState, session: SellingSession, cook: CookingEngine, id: ScoopId): StationResult {
  const r = SCOOP_RECIPES[id];
  if (!stationOpen(draft, r.chapter, [r.stock])) return 'locked';
  if (cook.isTrayFull()) return 'tray-full';
  if (!useIngredients(draft, session, [r.stock])) return 'no-stock';
  cook.addToTray({ id: `tray_${id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, menuItemId: r.menuItemId, name: r.name, icon: r.icon, quality: 'good' });
  return 'ok';
}

export function assembleAtCounter(draft: GameState, session: SellingSession, cook: CookingEngine, id: AssemblyId): StationResult {
  const r = ASSEMBLY_RECIPES[id];
  if (!stationOpen(draft, r.chapter, r.stock)) return 'locked';
  if (assemblyBaseIndex(cook.getTray(), r) < 0) return 'no-base';
  if (!useIngredients(draft, session, r.stock)) return 'no-stock';
  assemble(cook.getTray(), r);
  return 'ok';
}

// ---------------------------------------------------------------------------
// Giao món
// ---------------------------------------------------------------------------

export type ServeResult =
  | { kind: 'no-order' | 'empty-tray' | 'raw-rejected' }
  | { kind: 'no-match' }
  | { kind: 'partial'; missingItemIds?: string[] }
  | { kind: 'complete'; order: CustomerOrder; paid: number; tip: number; burnt: boolean; feedbackNotes?: string[] }
  | { kind: 'wrong-item'; order: CustomerOrder; paid: number; tip: number; wrongItemName: string; requestedName: string; feedbackNotes?: string[] }
  | { kind: 'incomplete-finish'; order: CustomerOrder; paid: number; tip: number; missingItemIds: string[]; feedbackNotes?: string[] };

// Tính toán tiền Tip linh hoạt dựa trên tính cách khách hàng, tốc độ phục vụ và độ ngon của món
export function calculateCustomerTip(order: CustomerOrder): { tip: number; feedbackNotes: string[] } {
  const notes: string[] = [];
  const ratio = order.patienceMax > 0 ? order.patienceCurrent / order.patienceMax : 0.5;
  const isFast = ratio > 0.6;
  const isMedium = ratio > 0.35;
  const hasBurnt = (order.burntPenalty ?? 0) > 0;
  const perfectBonus = order.perfectBonus ?? 0;

  // Bé Thỏ Cam tri kỷ
  if (order.isBunny) {
    return { tip: BUNNY_VISIT_TIP, feedbackNotes: ['Tri kỷ tặng quà 💖'] };
  }

  // Nếu khách không có tính cách đặc thù (đơn test hoặc khách thường mặc định)
  if (!order.personality) {
    const tip = (isFast ? FAST_SERVICE_TIP : 0) + perfectBonus;
    if (isFast) notes.push(`Giao nhanh đúng giờ (+${(FAST_SERVICE_TIP / 1000).toLocaleString('vi-VN')}k)`);
    if (perfectBonus > 0) notes.push('Thưởng món vàng giòn/chuẩn vị');
    return { tip, feedbackNotes: notes };
  }

  const personality = order.personality;

  // 1. Keo Kiệt / Chi Ly: Tuyệt đối không tip
  if (personality === 'frugal') {
    if (hasBurnt) notes.push('Chê đắt và càu nhàu vì món cháy');
    else notes.push('Đếm từng đồng tiền lẻ, không tip');
    return { tip: 0, feedbackNotes: notes };
  }

  // 2. Tài Xế / Shipper: Không tip, vội vã
  if (personality === 'driver') {
    if (isFast) notes.push('Cảm ơn quán giao nhanh kịp chuyến!');
    else if (!isMedium) notes.push('Càu nhàu vì trễ giờ cuốc xe');
    return { tip: 0, feedbackNotes: notes };
  }

  let baseTip = 0;

  // 3. Hào Phóng: Rất chuộng tip to
  if (personality === 'generous') {
    if (isFast) {
      baseTip = 10000;
      notes.push('Tip đậm phục vụ thần tốc! (+10k)');
    } else if (isMedium) {
      baseTip = 4000;
      notes.push('Tip vừa lòng (+4k)');
    } else {
      baseTip = 1000;
      notes.push('Tip khích lệ dù đợi hơi lâu (+1k)');
    }
    if (perfectBonus > 0) {
      baseTip += perfectBonus;
      notes.push('Thưởng tay nghề món chuẩn');
    }
  }
  // 4. Vội Vã: Nhanh mới tip, chậm cắt sạch
  else if (personality === 'impatient') {
    if (isFast) {
      baseTip = 5000;
      notes.push('Tip cứu nguy giờ bận rộn (+5k)');
    } else {
      baseTip = 0;
      notes.push('Không tip vì chờ sốt ruột');
    }
    if (isFast && perfectBonus > 0) baseTip += perfectBonus;
  }
  // 5. Sành Ăn: Khắt khe món cháy, chuộng Perfect
  else if (personality === 'foodie') {
    if (hasBurnt) {
      baseTip = 0;
      notes.push('Khách sành ăn cực chê món cháy!');
    } else {
      baseTip = isFast ? 4000 : 0;
      if (perfectBonus > 0) {
        baseTip += perfectBonus + 6000;
        notes.push('Món Vàng Giòn đỉnh chóp! (+6k thưởng)');
      }
    }
  }
  // 6. Học Sinh: Tiền lẻ
  else if (personality === 'student') {
    if (isFast) {
      baseTip = 1000;
      notes.push('Gửi quán 1.000đ tiền lẻ');
    } else {
      baseTip = 0;
      notes.push('Cười trừ chào quán');
    }
  }
  // 7. Dễ Tính (Mặc định): Luôn tip nhẹ vui vẻ khi nhanh
  else {
    baseTip = isFast ? FAST_SERVICE_TIP : 0;
    if (isFast) notes.push(`Khách dễ thương tip ${baseTip.toLocaleString('vi-VN')}đ`);
    if (perfectBonus > 0) baseTip += perfectBonus;
  }

  // Món cháy làm tụt tip nếu không phải foodie (foodie đã xét ở trên)
  if (hasBurnt && personality !== 'foodie') {
    baseTip = Math.max(0, Math.round(baseTip * 0.4));
    notes.push('Trừ bớt tip vì có món cháy');
  }

  return { tip: Math.max(0, baseTip), feedbackNotes: notes };
}


// Giao cho khách trong hàng đợi. Ưu tiên khách đầu hàng; nếu khách đầu hàng chưa có món khớp
// nhưng khách tiếp theo (vị trí 2, 3...) có món trong khay đã làm xong thì tự động giao cho khách đó.
// Gà sống: khách không nhận (để lại khay). Gà cháy: trả nửa giá món đó (khách foodie phạt 100%).
// `removeAt` xóa món khỏi khay (khay thuộc CookingEngine). Cập nhật session; tiền vào ví do caller cộng.
export function serveFirstOrder(
  session: SellingSession,
  tray: readonly TrayItem[],
  prices: (menuItemId: string) => number,
  removeAt: (trayIdx: number) => void,
  upgrades?: { [id: string]: UpgradeBranch },
  targetOrderId?: string
): ServeResult {
  if (session.orders.length === 0) return { kind: 'no-order' };

  // Xác định khách hàng cần phục vụ
  let orderIndex = 0;
  if (targetOrderId) {
    const found = session.orders.findIndex(o => o.id === targetOrderId);
    if (found >= 0) orderIndex = found;
  } else {
    // Ưu tiên khách đầu hàng nếu có món khớp
    const firstOrderHasMatch = session.orders[0] && tray.some(t =>
      session.orders[0]!.items.some(it => it.menuItemId === t.menuItemId && !it.completed)
    );
    if (!firstOrderHasMatch) {
      // Nếu khách đầu không khớp, tìm khách kế tiếp nào có món khớp trong khay
      const matchedIdx = session.orders.findIndex(ord =>
        tray.some(t => ord.items.some(it => it.menuItemId === t.menuItemId && !it.completed))
      );
      if (matchedIdx >= 0) orderIndex = matchedIdx;
    }
  }

  const order = session.orders[orderIndex];
  if (!order) return { kind: 'no-order' };

  if (tray.length === 0) {
    const hasSomeServed = order.items.some(it => it.served > 0);
    if (hasSomeServed) {
      session.orders.splice(orderIndex, 1);
      session.servedCount += 1;
      session.missedItemsCount = (session.missedItemsCount ?? 0) + 1;
      session.totalWaitSec += order.patienceMax - Math.max(0, order.patienceCurrent);

      const missingItemIds = order.items.filter(it => !it.completed).map(it => it.menuItemId);
      const deliveredValue = order.items.filter(it => it.served > 0).reduce((sum, it) => sum + prices(it.menuItemId) * it.served, 0);
      const paid = Math.max(0, Math.round(deliveredValue * 0.7)); // Phạt 30% vì thiếu món
      session.grossRevenue += paid;
      recordOrderBooks(session, order, paid);
      if (paid > 0) pushFx(session, { kind: 'cash', paid, tip: 0 });
      return {
        kind: 'incomplete-finish',
        order,
        paid,
        tip: 0,
        missingItemIds,
        feedbackNotes: ['Giao thiếu món! Khách bực bội trừ 30% tiền.']
      };
    }
    return { kind: 'empty-tray' };
  }

  let matched = false;
  let rejectedRaw = false;
  for (let i = tray.length - 1; i >= 0; i--) {
    const item = tray[i];
    if (!item || !order.items.some(it => it.menuItemId === item.menuItemId && !it.completed)) continue;
    if (item.quality === 'raw') {
      rejectedRaw = true;
      continue;
    }
    OrdersEngine.matchItemToOrder(order, item.menuItemId);
    (session.soldCounts ??= {})[item.menuItemId] = (session.soldCounts[item.menuItemId] ?? 0) + 1;
    if (item.quality === 'burnt') {
      const penaltyRate = order.personality === 'foodie' ? 1.0 : 0.5;
      order.burntPenalty = (order.burntPenalty ?? 0) + Math.round(prices(item.menuItemId) * penaltyRate);
    }
    if (item.quality === 'perfect') order.perfectBonus = (order.perfectBonus ?? 0) + perfectTip(session.perfectStreak);
    // Tip tương: chỉ khi khách DẶN đúng loại đó cho món này (cộng thêm bonus từ Quầy Sốt Dịch Vụ)
    const wantsSauce = item.condiment && order.items.find(it => it.menuItemId === item.menuItemId && it.condiment === item.condiment && (it.condimentServed ?? 0) < it.count);
    if (wantsSauce) {
      wantsSauce.condimentServed = (wantsSauce.condimentServed ?? 0) + 1;
      if (order.personality !== 'frugal') {
        const sauceBonus = upgrades ? (upgradeEffects(upgrades).sauceTipBonus || 0) : 0;
        order.perfectBonus = (order.perfectBonus ?? 0) + CONDIMENT_TIP + sauceBonus;
      }
    }
    if (item.condiment) session.squirts = (session.squirts ?? 0) + 1;
    removeAt(i);
    matched = true;
  }

  // Máy rót nước tự động (Nâng cấp Dịch vụ cấp 3+): tự động phục vụ các món nước ngọt
  if (upgrades && upgradeEffects(upgrades).autoDrink) {
    for (const it of order.items) {
      if (basketRoleOf(it.menuItemId) === 'drink' && !it.completed) {
        it.served = it.count;
        it.completed = true;
      }
    }
  }

  if (matched) {
    if (!OrdersEngine.isOrderComplete(order)) {
      const missingItemIds = order.items.filter(it => !it.completed).map(it => it.menuItemId);
      return { kind: 'partial', missingItemIds };
    }

    session.orders.splice(orderIndex, 1);
    session.servedCount += 1;
    session.totalWaitSec += order.patienceMax - Math.max(0, order.patienceCurrent);

    // Theo dõi tốc độ phục vụ đơn hàng (Nhanh vs Chậm)
    const patienceRatio = order.patienceCurrent / Math.max(1, order.patienceMax);
    if (patienceRatio >= 0.65) {
      session.fastServeCount = (session.fastServeCount ?? 0) + 1;
    } else if (patienceRatio <= 0.35) {
      session.slowServeCount = (session.slowServeCount ?? 0) + 1;
    }

    // Theo dõi cảm nhận giá cả (Đắt vs Rẻ/Hợp lý)
    if (order.totalPrice > 0) {
      const isPricey = order.items.some(it => {
        const def = INITIAL_MENU.find(m => m.id === it.menuItemId);
        return def && prices(it.menuItemId) > def.basePrice * 1.18;
      });
      if (isPricey) {
        session.expensiveCount = (session.expensiveCount ?? 0) + 1;
      } else {
        session.fairPriceCount = (session.fairPriceCount ?? 0) + 1;
      }
    }

    const paid = Math.max(0, order.totalPrice - (order.burntPenalty ?? 0));
    const { tip, feedbackNotes } = calculateCustomerTip(order);
    session.grossRevenue += paid;
    session.tips += tip;
    recordOrderBooks(session, order, paid);
    pushFx(session, { kind: 'cash', paid, tip });
    return { kind: 'complete', order, paid, tip, burnt: (order.burntPenalty ?? 0) > 0, feedbackNotes };
  }

  // Khách từ chối gà còn sống
  if (rejectedRaw && tray.every(t => t.quality === 'raw')) {
    return { kind: 'raw-rejected' };
  }

  // Khách đã nhận 1 phần trước đó, nay bấm KENG khi khay hết món khớp → lấy phần hiện có, phàn nàn thiếu món và rời đi
  const hasSomeServed = order.items.some(it => it.served > 0);
  if (hasSomeServed) {
    session.orders.splice(orderIndex, 1);
    session.servedCount += 1;
    session.missedItemsCount = (session.missedItemsCount ?? 0) + 1;
    session.totalWaitSec += order.patienceMax - Math.max(0, order.patienceCurrent);

    const missingItemIds = order.items.filter(it => !it.completed).map(it => it.menuItemId);
    const deliveredValue = order.items.filter(it => it.served > 0).reduce((sum, it) => sum + prices(it.menuItemId) * it.served, 0);
    const paid = Math.max(0, Math.round(deliveredValue * 0.7)); // Phạt 30% vì thiếu món
    session.grossRevenue += paid;
    recordOrderBooks(session, order, paid);
    if (paid > 0) pushFx(session, { kind: 'cash', paid, tip: 0 });
    return {
      kind: 'incomplete-finish',
      order,
      paid,
      tip: 0,
      missingItemIds,
      feedbackNotes: ['Giao thiếu món! Khách bực bội trừ 30% tiền.']
    };
  }

  // Khay có đồ ăn nhưng KHÔNG CÓ MÓN NÀO KHỚP (Người chơi đưa SAI MÓN!)
  // Giao món sai: tiêu thụ món đầu tiên chín trên khay, tính đã phục vụ xong, chuyển khách kế tiếp, ghi nhận sai sót
  const wrongItemIdx = tray.findIndex(t => t.quality !== 'raw');
  if (wrongItemIdx >= 0) {
    const wrongItem = tray[wrongItemIdx]!;
    removeAt(wrongItemIdx);

    session.orders.splice(orderIndex, 1);
    session.servedCount += 1;
    session.wrongOrderCount = (session.wrongOrderCount ?? 0) + 1;
    session.totalWaitSec += order.patienceMax - Math.max(0, order.patienceCurrent);

    const requestedNames = order.items.map(it => {
      const def = INITIAL_MENU.find(m => m.id === it.menuItemId);
      return def ? def.name : it.menuItemId;
    }).join(' + ');

    return {
      kind: 'wrong-item',
      order,
      paid: 0, // Giao sai món không được tính tiền
      tip: 0,
      wrongItemName: wrongItem.name,
      requestedName: requestedNames,
      feedbackNotes: [`Giao nhầm ${wrongItem.name} cho đơn ${requestedNames}! Khách bỏ về không trả tiền.`]
    };
  }

  return { kind: rejectedRaw ? 'raw-rejected' : 'no-match' };
}

export interface CancelOrderResult {
  success: boolean;
  order?: CustomerOrder;
  paid: number;
  apologyReply: string;
}

// Hủy đơn của khách hàng khi hết món/hết nguyên liệu và xin lỗi lịch sự
export function cancelAndApologizeOrder(
  session: SellingSession,
  orderId: string,
  prices: (menuItemId: string) => number
): CancelOrderResult {
  const idx = session.orders.findIndex(o => o.id === orderId);
  if (idx < 0) return { success: false, paid: 0, apologyReply: '' };

  const order = session.orders[idx]!;
  session.orders.splice(idx, 1);
  session.apologiesCount = (session.apologiesCount ?? 0) + 1;

  // Nếu khách đã nhận 1 phần trước đó, tính tiền phần đã nhận với mức giá ưu đãi (80%)
  const deliveredValue = order.items
    .filter(it => it.served > 0)
    .reduce((sum, it) => sum + prices(it.menuItemId) * it.served, 0);
  const paid = deliveredValue > 0 ? Math.round(deliveredValue * 0.8) : 0;

  if (paid > 0) {
    session.grossRevenue += paid;
    recordOrderBooks(session, order, paid);
    pushFx(session, { kind: 'cash', paid, tip: 0 });
  }

  const replies: Record<CustomerPersonality, string> = {
    easygoing: 'Dạ không sao đâu quán ơi, bán đắt hàng ghê! Hôm khác em ghé lại ủng hộ nha!',
    student: 'Dạ hông sao đâu ạ, bữa sau tan học con lại qua ăn gà rán giòn rụm tiếp!',
    driver: 'Ok tiệm nhé, để tui chạy cuốc khác, bữa sau có dịp ghé lại!',
    generous: 'Quán đông khách hết món là mừng rồi, không sao nha tiệm!',
    foodie: 'Tiếc ghê, món ngon nên mau hết hả tiệm? Bữa sau nhớ phần tui nghen!',
    frugal: 'Hơi tiếc công ghé, nhưng tiệm xin lỗi nhiệt tình quá, để bữa khác vậy!',
    impatient: 'Biết trước hết món thì đỡ đợi, nhưng cảm ơn quán đã báo sớm nha!'
  };

  const apologyReply = (order.personality && replies[order.personality])
    || 'Dạ không sao đâu ạ, cảm ơn quán đã xin lỗi nha, để hôm khác mình ghé lại!';

  return { success: true, order, paid, apologyReply };
}

// Sổ P&L của một đơn đã giao: kênh bán, bao bì, ly nước, tiền mất vì món cháy, món giải ngấy
function recordOrderBooks(session: SellingSession, order: CustomerOrder, paid: number) {
  if (order.isDelivery) {
    session.revenueDelivery = (session.revenueDelivery ?? 0) + paid;
    session.deliveryOrders = (session.deliveryOrders ?? 0) + 1;
  } else {
    session.counterOrders = (session.counterOrders ?? 0) + 1;
  }
  session.cups = (session.cups ?? 0) + order.items.filter(it => basketRoleOf(it.menuItemId) === 'drink').reduce((n, it) => n + it.count, 0);
  session.burntWaste = (session.burntWaste ?? 0) + (order.burntPenalty ?? 0);
  if (order.items.some(it => FRY_RECIPES[it.menuItemId] && basketRoleOf(it.menuItemId) === 'main')) {
    session.friedMainOrders = (session.friedMainOrders ?? 0) + 1;
    if (order.items.some(it => CLEANSER_IDS.has(it.menuItemId))) session.cleanserOrders = (session.cleanserOrders ?? 0) + 1;
  }
}
// Món giải ngấy: ăn gà rán kèm củ cải muối / bắp cải trộn thì khách thấy ngon miệng hơn.
// Mỗi ngày sao Hương vị +0,05 × tỉ lệ đơn gà rán có món giải ngấy (cộng mỗi đơn thì sao lạm phát quá nhanh).
export const CLEANSER_IDS: ReadonlySet<string> = new Set(['danmuji', 'coleslaw']);
export const CLEANSER_TASTE_PER_DAY = 0.05;
export function cleanserTasteBonus(session: Pick<SellingSession, 'friedMainOrders' | 'cleanserOrders'>): number {
  const fried = session.friedMainOrders ?? 0;
  return fried > 0 ? CLEANSER_TASTE_PER_DAY * Math.min(1, (session.cleanserOrders ?? 0) / fried) : 0;
}

// Thay dầu chiên (150k): trả tiền ngay, ghi vào giá vốn của ngày để hiện trong P&L
export const OIL_CHANGE_COST = 150000;
export function changeOil(draft: GameState): boolean {
  if (draft.money < OIL_CHANGE_COST) return false;
  draft.money -= OIL_CHANGE_COST;
  draft.todayOilCost = (draft.todayOilCost ?? 0) + OIL_CHANGE_COST;
  draft.oilCondition = 'clean';
  draft.oilBatchesCooked = 0;
  return true;
}

// Tiền bán hàng vào ví ngay lúc giao; ghi vào doanh thu trọn đời (dùng cho kiểm tra sổ sách)
export function creditSale(draft: GameState, paid: number, tip: number) {
  draft.money += paid + tip;
  draft.lifetimeStats.totalRevenue += paid + tip;
}

// Thưởng khi giao cho Bé Thỏ Cam: có thư → tiền tip + cộng sao tiêu chí; ghé thường → 35.000đ.
export function applyBunnyReward(draft: GameState, order: CustomerOrder): BunnyLetter | undefined {
  draft.bunnyVisitsCount += 1;
  const letter = order.bunnyLetterId ? BUNNY_LETTERS.find(l => l.id === order.bunnyLetterId) : undefined;
  if (!letter) {
    draft.money += BUNNY_VISIT_TIP;
    draft.lifetimeStats.totalBonus = (draft.lifetimeStats.totalBonus ?? 0) + BUNNY_VISIT_TIP;
    return undefined;
  }
  if (!draft.unlockedBunnyLetters.includes(letter.id)) draft.unlockedBunnyLetters.push(letter.id);
  draft.money += letter.tip;
  draft.lifetimeStats.totalBonus = (draft.lifetimeStats.totalBonus ?? 0) + letter.tip;
  if (letter.boost) {
    for (const c of letter.boost.criteria) draft.ratings[c] = Math.min(5.0, draft.ratings[c] + letter.boost.value);
    draft.ratings.overall = ReviewsEngine.calculateOverallStars(draft.ratings);
  }
  return letter;
}

// ---------------------------------------------------------------------------
// Chốt sổ cuối ngày
// ---------------------------------------------------------------------------

export interface DayResult {
  ledger: DayLedger;
  review: CustomerReview;
  advisorTip: string;
  inspection: 'fined' | 'praised' | 'warned' | null;
}

// Gọi một lần lúc đóng cửa, trong stateManager.update: hàng hết hạn, sổ sách, sao, lịch sử, qua chương.
export function closeDay(draft: GameState, session: SellingSession, event: GameEvent): DayResult {
  // Hàng hết hạn bỏ đi qua đêm (tiền đã trả lúc nhập; ghi vào sổ để người chơi thấy lỗ)
  let expiredValue = 0;
  for (const inv of Object.values(draft.inventory)) expiredValue += ageOneDay(inv) * inv.cost;

  const inspected = event.effect.inspection === true;
  const oil = draft.oilCondition;
  const fine = inspected && oil === 'dirty' ? INSPECTION_FINE : 0;
  const team = staffEffects(draft.staff, 12, draft.upgrades);
  const karma = karmaEffects(draft.karma);

  // Món bán chạy nhất trong ca (trước đây topSellerId không bao giờ được cập nhật → luôn là Gà Giòn)
  const sold = Object.entries(session.soldCounts ?? {}).sort((a, b) => b[1] - a[1])[0];
  if (sold) session.topSellerId = sold[0];
  const ledger = EconomyEngine.finalizeDayLedger({
    day: draft.day, chapter: draft.currentChapter,
    revenueCounter: session.grossRevenue - (session.revenueDelivery ?? 0), revenueDelivery: session.revenueDelivery ?? 0,
    tips: session.tips, ingredientCost: session.ingredientCost, wasteCost: expiredValue,
    wages: EconomyEngine.calculateTotalWages(draft),
    servedCount: session.servedCount, lostCount: session.lostCount, burntCount: session.burntCount, topSellerId: session.topSellerId,
    fines: fine, commissionRate: team.commissionRate, overheadPct: karma.overheadPct,
    counts: { counterOrders: session.counterOrders ?? 0, deliveryOrders: session.deliveryOrders ?? 0, cups: session.cups ?? 0, squirts: session.squirts ?? 0 },
    oilCost: draft.todayOilCost ?? 0,
    friedBatches: session.totalFriedCount,
    maintenance: maintenanceCost(draft.currentChapter, draft.upgrades),
    burntWaste: session.burntWaste ?? 0
  });
  draft.todayOilCost = 0;


  const perfectRatio = session.totalFriedCount > 0 ? session.perfectCount / session.totalFriedCount : 0.8;
  const avgWait = session.servedCount > 0 ? session.totalWaitSec / session.servedCount : 0;
  const { newRatings, generatedReview, advisorTip } = ReviewsEngine.evaluateDay(
    draft, perfectRatio, session.burntCount, avgWait, session.lostCount, session.servedCount, session.totalFriedCount,
    session.fastServeCount, session.slowServeCount, session.expensiveCount, session.fairPriceCount,
    session.wrongOrderCount ?? 0, session.missedItemsCount ?? 0, session.topSellerId
  );
  if (karma.tasteDriftPerDay !== 0) { // Nghệ Nhân (karma): tiếng lành / tiếng dữ về độ ngon
    newRatings.taste = Math.max(1, Math.min(5, newRatings.taste + karma.tasteDriftPerDay));
    newRatings.overall = ReviewsEngine.calculateOverallStars(newRatings);
  }
  const cleanser = cleanserTasteBonus(session);
  if (cleanser > 0) { // gà rán kèm củ cải / bắp cải: khách thấy đỡ ngấy, khen ngon
    newRatings.taste = Math.min(5, newRatings.taste + cleanser);
    newRatings.overall = ReviewsEngine.calculateOverallStars(newRatings);
  }
  if (team.hygienePerDay > 0) { // phục vụ lau dọn mỗi ngày
    newRatings.hygiene = Math.min(5, newRatings.hygiene + team.hygienePerDay);
    newRatings.overall = ReviewsEngine.calculateOverallStars(newRatings);
  }
  if (inspected) {
    const delta = oil === 'dirty' ? -0.3 : oil === 'clean' ? 0.2 : 0;
    newRatings.hygiene = Math.max(1, Math.min(5, newRatings.hygiene + delta));
    newRatings.overall = ReviewsEngine.calculateOverallStars(newRatings);
  }

  ledger.topSellerCount = sold?.[1] ?? 0;
  ledger.bestStreak = session.bestStreak ?? 0;
  ledger.friedCount = session.totalFriedCount;
  ledger.perfectCount = session.perfectCount;
  ledger.wrongOrderCount = session.wrongOrderCount ?? 0;
  ledger.missedItemsCount = session.missedItemsCount ?? 0;
  draft.money -= EconomyEngine.closingCharges(ledger);
  draft.debtStreak = draft.money < 0 ? (draft.debtStreak ?? 0) + 1 : 0; // phá sản khi âm quỹ nhiều ngày liền
  draft.ratings = newRatings;
  draft.dayHistory.push(ledger);
  draft.recentReviews.unshift(generatedReview);
  if (draft.recentReviews.length > 50) draft.recentReviews.pop();
  draft.lifetimeStats.totalFried += session.totalFriedCount;
  draft.lifetimeStats.totalBurnt += session.burntCount;
  draft.lifetimeStats.perfectFriedCount += session.perfectCount;
  endShiftForStaff(draft.staff);
  // Giá chặt chém → cả hẻm bàn tán (Tình Hẻm giảm, ảnh hưởng kết thúc); giá bình dân → được thương
  const priceDrift = communityDriftFromPrice(averagePriceRatio(draft));
  if (priceDrift !== 0) draft.karma = applyKarmaChange(draft.karma, { community: priceDrift });

  // Sai sót trong ca bán (lên sai món, miss đơn, khách bỏ về) tác động tiêu cực đến Karma Nghệ Nhân và Tình Hẻm
  const mistakes = (session.wrongOrderCount ?? 0) + (session.missedItemsCount ?? 0);
  if (mistakes > 0 || session.lostCount > 0) {
    const craftPenalty = -0.4 * mistakes - 0.2 * session.lostCount;
    const commPenalty = -0.3 * mistakes - 0.2 * session.lostCount;
    draft.karma = applyKarmaChange(draft.karma, {
      craftsmanship: craftPenalty,
      community: commPenalty
    });
  }

  flagIntegrity(draft, auditState(draft)); // chống gian lận: sổ sách phải hợp lý sau mỗi ngày

  // Qua chương không còn tự động ở đây: người chơi bấm "Đặt cọc" (core/progression.ts)

  return {
    ledger, review: generatedReview, advisorTip,
    inspection: !inspected ? null : fine > 0 ? 'fined' : oil === 'clean' ? 'praised' : 'warned'
  };
}
