import { CustomerOrder, CustomerReview, DayLedger, GameEvent, GameState, TrayItem } from '../types/game';
import { RANDOM_EVENTS } from '../content/events';
import { BUNNY_LETTERS, BunnyLetter, MysteryBunnyEngine } from '../content/mysteryBunny';
import { OrdersEngine } from './orders';
import { EconomyEngine } from './economy';
import { ReviewsEngine } from './reviewsEngine';
import { ageOneDay, consumeStock, addStock } from './inventory';
import { CookingEngine, Sauce } from './cooking';
import { upgradeEffects } from './upgrades';
import { auditState, flagIntegrity } from './integrity';
import { SellingSession } from './sellingSim';
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
      return letter
        ? [OrdersEngine.generateBunnyOrder(state, letter), regularCustomer(state, event)]
        : [regularCustomer(state, event), regularCustomer(state, event)];
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
  }
  if (session && result.quality === 'burnt') session.burntCount += 1;
  if (session && result.quality !== 'perfect') session.perfectStreak = 0; // chỉ Perfect mới giữ chuỗi
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
// Giao món
// ---------------------------------------------------------------------------

export type ServeResult =
  | { kind: 'no-order' | 'empty-tray' | 'no-match' | 'raw-rejected' | 'partial' }
  | { kind: 'complete'; order: CustomerOrder; paid: number; tip: number; burnt: boolean };

// Giao cho khách đầu hàng mọi món trong khay khách đang cần.
// Gà sống: khách không nhận (để lại khay). Gà cháy: trả nửa giá món đó. Perfect: +2.000đ tip.
// `removeAt` xóa món khỏi khay (khay thuộc CookingEngine). Cập nhật session; tiền vào ví do caller cộng.
export function serveFirstOrder(
  session: SellingSession,
  tray: readonly TrayItem[],
  prices: (menuItemId: string) => number,
  removeAt: (trayIdx: number) => void
): ServeResult {
  const order = session.orders[0];
  if (!order) return { kind: 'no-order' };
  if (tray.length === 0) return { kind: 'empty-tray' };

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
    if (item.quality === 'burnt') order.burntPenalty = (order.burntPenalty ?? 0) + Math.round(prices(item.menuItemId) / 2);
    if (item.quality === 'perfect') order.perfectBonus = (order.perfectBonus ?? 0) + perfectTip(session.perfectStreak);
    removeAt(i);
    matched = true;
  }

  if (!matched) return { kind: rejectedRaw ? 'raw-rejected' : 'no-match' };
  if (!OrdersEngine.isOrderComplete(order)) return { kind: 'partial' };

  session.orders.shift();
  session.servedCount += 1;
  session.totalWaitSec += order.patienceMax - Math.max(0, order.patienceCurrent);
  const paid = order.totalPrice - (order.burntPenalty ?? 0);
  const tip = (order.patienceCurrent / order.patienceMax > 0.6 ? FAST_SERVICE_TIP : 0) + (order.perfectBonus ?? 0);
  session.grossRevenue += paid;
  session.tips += tip;
  return { kind: 'complete', order, paid, tip, burnt: (order.burntPenalty ?? 0) > 0 };
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

  const ledger = EconomyEngine.finalizeDayLedger(
    draft.day, session.grossRevenue, session.tips, session.ingredientCost, expiredValue,
    EconomyEngine.calculateTotalWages(draft), draft.currentChapter,
    session.servedCount, session.lostCount, session.burntCount, session.topSellerId, fine
  );

  const perfectRatio = session.totalFriedCount > 0 ? session.perfectCount / session.totalFriedCount : 0.8;
  const avgWait = session.servedCount > 0 ? session.totalWaitSec / session.servedCount : 0;
  const { newRatings, generatedReview, advisorTip } = ReviewsEngine.evaluateDay(
    draft, perfectRatio, session.burntCount, avgWait, session.lostCount
  );
  if (inspected) {
    const delta = oil === 'dirty' ? -0.3 : oil === 'clean' ? 0.2 : 0;
    newRatings.hygiene = Math.max(1, Math.min(5, newRatings.hygiene + delta));
    newRatings.overall = ReviewsEngine.calculateOverallStars(newRatings);
  }

  draft.money -= EconomyEngine.closingCharges(ledger);
  draft.debtStreak = draft.money < 0 ? (draft.debtStreak ?? 0) + 1 : 0; // phá sản khi âm quỹ nhiều ngày liền
  draft.ratings = newRatings;
  draft.dayHistory.push(ledger);
  draft.recentReviews.unshift(generatedReview);
  if (draft.recentReviews.length > 50) draft.recentReviews.pop();
  draft.lifetimeStats.totalFried += session.totalFriedCount;
  draft.lifetimeStats.totalBurnt += session.burntCount;
  draft.lifetimeStats.perfectFriedCount += session.perfectCount;

  flagIntegrity(draft, auditState(draft)); // chống gian lận: sổ sách phải hợp lý sau mỗi ngày

  // Qua chương không còn tự động ở đây: người chơi bấm "Đặt cọc" (core/progression.ts)

  return {
    ledger, review: generatedReview, advisorTip,
    inspection: !inspected ? null : fine > 0 ? 'fined' : oil === 'clean' ? 'praised' : 'warned'
  };
}
