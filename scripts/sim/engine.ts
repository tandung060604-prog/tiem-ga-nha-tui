// Bộ máy mô phỏng dùng chung (balance-sim, upgrade-roi):
// Mô phỏng cân bằng: người chơi ảo chơi nhiều ngày bằng ĐÚNG luật của game (core/*), không DOM.
// Chạy: npm run sim [-- --days 60 --seeds 20]
// Trả lời: người chơi giỏi / trung bình / vụng qua Chương 1 (850k → 5 triệu, ≥3,5 sao) vào ngày mấy?
import { createInitialState } from '../../src/core/state';
import { CookingEngine } from '../../src/core/cooking';
import { TIMER_RECIPES, TimerStationId, timerPhase, isDrinkId, isAssemblyId, isScoopId, ASSEMBLY_RECIPES } from '../../src/core/stations';
import { createSellingSession, gameDeltaMs, tickSelling, SellingSession } from '../../src/core/sellingSim';
import {
  SAUCE_STOCK, recordHelperFry, scoopSide, changeOil, startTimerStation, pullTimerStation, makeDrink, assembleAtCounter, creditSale, eventForDay, createCustomerSource, serveFirstOrder, applyBunnyReward, closeDay, useIngredients, recordFryerLift
} from '../../src/core/day';
import { EconomyEngine } from '../../src/core/economy';
import { upgradeEffects } from '../../src/core/upgrades';
import { priceLimits } from '../../src/core/pricing';
import { depositForNextChapter } from '../../src/core/progression';
import { addStock, signIngredientContract } from '../../src/core/inventory';
import { seedRandom, random } from '../../src/core/rng';
import { audio } from '../../src/core/audio';
import { CHAPTERS } from '../../src/content/chapters';
import { INITIAL_MENU } from '../../src/content/menu';
import { BASKET_RULE, basketChance, canMake } from '../../src/core/orders';
import { BasketRole } from '../../src/types/game';
import { GameState, CustomerOrder, TrayItem, StaffRole } from '../../src/types/game';
import { staffEffects, tickStaff, fryingItemId, missingItems, maxStaff, FRY_RECIPES, extraTraySlots, severancePay, traySizeFor, hasAutoWork } from '../../src/core/staff';
import { generateCandidate } from '../../src/content/staff';

audio.setMuted(true);

// ---------------------------------------------------------------------------
// Người chơi ảo
// ---------------------------------------------------------------------------

export interface Profile {
  name: string;
  reactionMs: number;   // thời gian giữa 2 thao tác
  liftSd: number;       // độ lệch khi nhấc gà, đơn vị tiến độ chảo (1 đơn vị = 60ms)
  prefetch: boolean;    // làm trước món cho khách thứ 2 khi khách đầu đã đủ
}
export const PROFILES: Profile[] = [
  { name: 'Giỏi', reactionMs: 450, liftSd: 4, prefetch: true },
  { name: 'Trung bình', reactionMs: 800, liftSd: 8, prefetch: false },
  { name: 'Vụng', reactionMs: 1300, liftSd: 13, prefetch: false }
];

export type UpgradePolicy = 'không nâng cấp' | 'có nâng cấp';
export type StaffPolicy = 'không nhân viên' | 'có nhân viên';

const PERFECT_CENTER = (CookingEngine.ZONES.goodLow + CookingEngine.ZONES.perfect) / 2;
const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

const SAUCES: string[] = Object.values(SAUCE_STOCK);
const TIMER_FOR: Record<string, TimerStationId> = { pasta_beef: 'noodle', biscuit_honey: 'oven' };

// Tuyển theo chương khi quỹ dư: phụ bếp trước (tăng sức chiên), rồi phục vụ, shipper, thu ngân, quản lý
const HIRING_PLAN: { role: StaffRole; chapter: number; minMoney: number }[] = [
  { role: 'cook', chapter: 2, minMoney: 800000 },
  { role: 'waiter', chapter: 2, minMoney: 2000000 },
  { role: 'delivery', chapter: 3, minMoney: 3000000 },
  { role: 'cook', chapter: 3, minMoney: 4000000 },
  { role: 'cashier', chapter: 3, minMoney: 5000000 },
  { role: 'manager', chapter: 4, minMoney: 12000000 }
];
function hireStaff(state: GameState) {
  const counts: Partial<Record<StaffRole, number>> = {};
  for (const step of HIRING_PLAN) {
    const seen = (counts[step.role] ?? 0) + 1;
    counts[step.role] = seen;
    if (state.staff.filter(m => m.role === step.role).length >= seen) continue;
    if (state.currentChapter < step.chapter || state.money < step.minMoney || state.staff.length >= maxStaff(state.currentChapter)) return;
    const idx = state.candidates.findIndex(c => c.role === step.role);
    const hire = idx >= 0 ? state.candidates.splice(idx, 1)[0]! : { ...generateCandidate(state.currentChapter), role: step.role };
    state.staff.push(hire);
    return; // mỗi ngày tuyển tối đa 1 người
  }
}

// ---------------------------------------------------------------------------
// Chuẩn bị đầu ngày
// ---------------------------------------------------------------------------

function buy(state: GameState, id: string, qty: number): boolean {
  const item = state.inventory[id];
  if (!item || state.money < item.cost * qty) return false;
  state.money -= item.cost * qty;
  addStock(item, qty);
  return true;
}

// Nhập đủ cho số khách dự kiến theo giỏ hàng (core/orders.ts): 1 món chính (+15% phần thứ hai từ Chương 2),
// món kèm / nước theo xác suất của chương; trong mỗi nhóm chia đều cho các món bếp làm được.
// Lượng đã dùng của từng nguyên liệu trong các ngày gần đây (người thật nhìn kho cuối ngày để nhập)
const usageLog = new WeakMap<GameState, Record<string, number>[]>();
function restock(state: GameState, expected: number) {
  const ch = state.currentChapter;
  const perOrder: Record<BasketRole, number> = {
    main: 1 + (ch >= 2 ? 0.15 : 0),
    side: basketChance(BASKET_RULE.sideChance, ch),
    drink: basketChance(BASKET_RULE.drinkChance, ch),
    dessert: BASKET_RULE.dessertChance
  };
  const servable = INITIAL_MENU.filter(m => m.basketRole && canMake(state, m.id));
  const need: Record<string, number> = {};
  for (const m of servable) {
    const share = perOrder[m.basketRole!] / servable.filter(x => x.basketRole === m.basketRole).length;
    for (const [ing, n] of Object.entries(m.ingredients)) need[ing] = (need[ing] ?? 0) + n * expected * share;
  }
  // gà sốt cần thêm sốt, không có trong ingredients của gà giòn
  // Mua xoay vòng từng lô 5 cho mọi nguyên liệu (hết tiền thì món nào cũng có một ít), chừa tiền trả mặt bằng + lương
  const o = EconomyEngine.getOverheadCosts(state.currentChapter);
  const reserve = o.rent + o.utilities + EconomyEngine.calculateTotalWages(state);
  const log = usageLog.get(state) ?? [];
  for (const day of log) for (const [id, used] of Object.entries(day)) need[id] = Math.max(need[id] ?? 0, used * 1.2);
  for (let bought = true; bought;) {
    bought = false;
    for (const [id, target] of Object.entries(need)) {
      const item = state.inventory[id];
      if (!item || item.unlocked === false || item.amount >= Math.ceil(target * 1.15) || state.money - item.cost * 5 < reserve) continue;
      bought = buy(state, id, 5) || bought;
    }
  }
}

function buyUpgrades(state: GameState, expected: number) {
  // Quán đang quá tải (hôm qua phục vụ chưa tới 60% khách dự kiến) → không mua thêm khách
  const last = state.dayHistory[state.dayHistory.length - 1];
  const overloaded = !!last && last.customersServed < expected * 0.6;
  for (const id of ['marketing', 'kitchen', 'operations', 'space']) {
    if (id === 'marketing' && overloaded) continue;
    const branch = state.upgrades[id];
    const next = branch?.tiers[branch.currentLevel];
    if (branch && next && next.cost <= state.money * 0.3) {
      state.money -= next.cost;
      branch.currentLevel += 1;
    }
  }
}

// ---------------------------------------------------------------------------
// Một ca bán
// ---------------------------------------------------------------------------

// Chính sách giá của người chơi ảo: đặt mọi món = giá gốc × hệ số (kẹp trong khoảng luật cho phép)
let PRICE_POLICY = 1;
export function setPricePolicy(mult: number) { PRICE_POLICY = mult; }
function applyPricePolicy(state: GameState) {
  for (const item of state.menu) {
    const { min, max } = priceLimits(item);
    item.currentPrice = Math.max(min, Math.min(max, Math.round((item.basePrice * PRICE_POLICY) / 1000) * 1000));
  }
}

export function playDay(state: GameState, p: Profile, policy: UpgradePolicy, staffPolicy: StaffPolicy) {
  const event = eventForDay(state.day);
  applyPricePolicy(state);
  const expected = EconomyEngine.calculateDailyCustomerCount(state, event.effect.customerMultiplier ?? 1);
  for (const [id, inv] of Object.entries(state.inventory)) {
    if (inv.unlocked === false && (inv.unlockCost ?? 0) <= state.money * 0.25) signIngredientContract(state, id);
  }
  // Nhập theo sức bán thật: ngày đông nhất trong 5 ngày gần đây (+40%), không vượt khách dự kiến.
  // (Nhập theo khách dự kiến thì quá tải là hàng hết hạn hàng loạt; theo trung bình thì hết hàng → bán ít → nhập ít hơn)
  const recent = state.dayHistory.slice(-5);
  const peak = recent.length ? Math.max(...recent.map(l => l.customersServed + l.customersLost)) : expected;
  restock(state, Math.min(expected, Math.ceil(peak * 1.4)));
  if (state.oilCondition !== 'clean' && state.money >= 150000 + 300000) changeOil(state);
  if (policy === 'có nâng cấp') buyUpgrades(state, expected);
  if (staffPolicy === 'có nhân viên') {
    // Quỹ cạn (không đủ 3 ngày chi phí cố định) → cho người mới nhất nghỉ, như người thật
    const o = EconomyEngine.getOverheadCosts(state.currentChapter);
    const last = state.staff[state.staff.length - 1];
    if (last && state.money < 3 * (o.rent + o.utilities + EconomyEngine.calculateTotalWages(state))) {
      state.money -= severancePay(last);
      state.staff.pop();
    } else {
      hireStaff(state);
    }
    for (const m of state.staff) { // thưởng nóng khi nhân viên buồn (như nút Thưởng 50k)
      if (m.mood < 60 && state.money > 1000000) { state.money -= 50000; m.mood = Math.min(100, m.mood + 25); }
    }
  }

  const openingStock = Object.fromEntries(Object.entries(state.inventory).map(([id, inv]) => [id, inv.amount]));
  const session: SellingSession = createSellingSession();
  const cook = new CookingEngine();
  cook.setFryRampBonus(upgradeEffects(state.upgrades).fryRampPct);
  cook.setTraySize(traySizeFor(state));
  const source = createCustomerSource(state, event);
  session.orders.push(...source.opening());

  const STEP = 100;
  const { autoLift } = upgradeEffects(state.upgrades);
  let busyMs = 0;
  let liftAt = 0;
  const price = (id: string) => state.menu.find(m => m.id === id)?.currentPrice ?? 0;

  for (let dayOver = false; !dayOver;) {
    const dt = gameDeltaMs(session, STEP);
    const cooked = cook.updateFrying(dt);
    // Dây chuyền tự động (Bếp cấp 6): tự nhấc giỏ ở giữa vùng Perfect, giống main.ts
    if (autoLift && cook.getCookState().isFrying && cook.getCookState().progress >= CookingEngine.AUTO_LIFT_AT) {
      recordFryerLift(state, session, cook.liftFryer());
    } else if (cooked.finished && cooked.quality === 'burnt') recordFryerLift(state, session, cook.liftFryer());
    for (const e of tickSelling(session, dt, { expectedCustomers: expected, spawnCustomer: () => source.next(session.orders) })) {
      if (e.type === 'dayOver') dayOver = true;
    }
    const eff = staffEffects(state.staff, session.gameHour, state.upgrades);
    if (hasAutoWork(eff)) {
      const cs = cook.getCookState();
      const staffEvents = tickStaff(session, cook.getTray(), dt, eff,
        cs.isFrying ? fryingItemId(cs.fryingType, cook.getActiveSeasoning()) : null,
        { use: ids => useIngredients(state, session, ids), place: item => cook.addToTray(item), pour: d => makeDrink(state, session, cook, d) === 'ok', scoop: id => scoopSide(state, session, cook, id) === 'ok', traySize: cook.getTraySize() });
      for (const e of staffEvents) {
        if (e.type === 'helperDone') recordHelperFry(state, session, e.item.quality);
        else {
          const r = serveFirstOrder(session, cook.getTray(), price, i => cook.removeFromTray(i));
          if (r.kind === 'complete') {
            creditSale(state, r.paid, r.tip);
            if (r.order.isBunny) applyBunnyReward(state, r.order);
          }
        }
      }
    }

    busyMs -= dt;
    if (busyMs > 0) continue;
    busyMs = p.reactionMs;

    const tray = cook.getTray();
    const first = session.orders[0];
    const state0 = cook.getCookState();

    if (state0.isFrying) {
      if (state0.progress >= liftAt) recordFryerLift(state, session, cook.liftFryer());
      else busyMs = 0; // đang canh chảo: không tốn lượt
      continue;
    }
    // Gà sống hoặc món không ai cần làm đầy khay → vứt
    const rawIdx = tray.findIndex(t => t.quality === 'raw');
    const wantedAnywhere = (t: TrayItem) => session.orders.some(o => o.items.some(it => it.menuItemId === t.menuItemId && !it.completed));
    const junkIdx = rawIdx >= 0 ? rawIdx : cook.isTrayFull() ? tray.findIndex(t => !wantedAnywhere(t)) : -1;
    if (junkIdx >= 0) { cook.removeFromTray(junkIdx); continue; }

    if (first && tray.some(t => t.quality !== 'raw' && first.items.some(it => it.menuItemId === t.menuItemId && !it.completed))) {
      const r = serveFirstOrder(session, tray, price, i => cook.removeFromTray(i));
      if (r.kind === 'complete') {
        creditSale(state, r.paid, r.tip);
        if (r.order.isBunny) applyBunnyReward(state, r.order);
      }
      continue;
    }

    // Dầu đen giữa ca → thay (người vụng thì ráng dùng tiếp)
    if (state.oilCondition === 'dirty' && p.name !== 'Vụng' && !cook.getCookState().isFrying && changeOil(state)) continue;

    // Nồi mì / lò bánh chín → vớt trước khi hỏng
    const readyTimer = (Object.keys(session.timers) as TimerStationId[]).find(id => {
      const phase = timerPhase(TIMER_RECIPES[id], session.timers[id]);
      return phase === 'ready' || phase === 'ruined';
    });
    if (readyTimer && !cook.isTrayFull()) { pullTimerStation(session, cook, readyTimer); continue; }

    const targets = [first, p.prefetch ? session.orders[1] : undefined].filter((o): o is CustomerOrder => !!o);
    // Món phụ bếp đang chiên thì người chơi không chiên trùng
    const helping = session.helpers.flatMap(h => (h ? [h.menuItemId] : []));
    const neededList = targets.flatMap(o => missingItems(o, tray)).filter(id => {
      const k = helping.indexOf(isAssemblyId(id) ? ASSEMBLY_RECIPES[id].base : id);
      if (k < 0) return true;
      helping.splice(k, 1);
      return false;
    });
    if (neededList.length === 0) { busyMs = STEP; continue; }
    if (cook.isTrayFull()) {
      // Ráp món không cần ô trống (món ráp thay vào ô gà)
      if (neededList.some(id => isAssemblyId(id) && assembleAtCounter(state, session, cook, id) === 'ok')) continue;
      // Khay đầy món của khách sau mà khách đầu còn thiếu → bỏ bớt một món để lấy chỗ (người thật cũng vậy)
      const firstNeeds = first ? missingItems(first, []) : [];
      const idx = tray.findIndex(t => !firstNeeds.includes(t.menuItemId));
      if (first && missingItems(first, tray).length > 0 && idx >= 0) { cook.removeFromTray(idx); continue; }
      busyMs = STEP;
      continue;
    }
    // Món đầu tiên làm được (hết nguyên liệu món này thì làm món khác cho khách sau, như người thật)
    if (!neededList.some(needed => act(needed))) busyMs = STEP;
  }

  function act(needed: string): boolean {
    if (isDrinkId(needed)) return makeDrink(state, session, cook, needed) === 'ok';
    if (isScoopId(needed)) return scoopSide(state, session, cook, needed) === 'ok';
    const timer = TIMER_FOR[needed];
    if (timer) return session.timers[timer] === null && startTimerStation(state, session, timer) === 'ok';
    let fryId = needed;
    if (isAssemblyId(needed)) {
      if (assembleAtCounter(state, session, cook, needed) === 'ok') return true;
      fryId = ASSEMBLY_RECIPES[needed].base; // chưa có gà để ráp → chiên gà trước
    }
    const recipe = FRY_RECIPES[fryId];
    if (!recipe || !recipe.stock.every(id => (state.inventory[id]?.amount ?? 0) >= 1)) return false;
    useIngredients(state, session, recipe.stock.filter(id => !SAUCES.includes(id)));
    if (recipe.sauce) cook.setSeasoning(recipe.sauce); // sốt trừ lúc vớt (recordFryerLift)
    session.totalFriedCount += 1;
    cook.startFrying(recipe.type);
    liftAt = PERFECT_CENTER + gauss() * p.liftSd;
    return true;
  }

  const used = Object.fromEntries(Object.entries(state.inventory).map(([id, inv]) => [id, (openingStock[id] ?? 0) - inv.amount]));
  usageLog.set(state, [...(usageLog.get(state) ?? []), used].slice(-5));
  const result = closeDay(state, session, event);
  const unlocked = depositForNextChapter(state); // người chơi ảo bấm "Đặt cọc" ngay khi đủ điều kiện
  state.day += 1;
  return { ledger: result.ledger, unlocked, expected };
}

