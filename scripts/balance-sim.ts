// Mô phỏng cân bằng: người chơi ảo chơi nhiều ngày bằng ĐÚNG luật của game (core/*), không DOM.
// Chạy: npm run sim [-- --days 60 --seeds 20]
// Trả lời: người chơi giỏi / trung bình / vụng qua Chương 1 (850k → 5 triệu, ≥3,5 sao) vào ngày mấy?
import { createInitialState } from '../src/core/state';
import { CookingEngine } from '../src/core/cooking';
import { TIMER_RECIPES, TimerStationId, timerPhase, isDrinkId, isAssemblyId, ASSEMBLY_RECIPES } from '../src/core/stations';
import { createSellingSession, gameDeltaMs, tickSelling, SellingSession } from '../src/core/sellingSim';
import {
  SAUCE_STOCK, recordHelperFry, startTimerStation, pullTimerStation, makeDrink, assembleAtCounter, creditSale, eventForDay, createCustomerSource, serveFirstOrder, applyBunnyReward, closeDay, useIngredients, recordFryerLift
} from '../src/core/day';
import { EconomyEngine } from '../src/core/economy';
import { upgradeEffects } from '../src/core/upgrades';
import { depositForNextChapter } from '../src/core/progression';
import { addStock, signIngredientContract } from '../src/core/inventory';
import { seedRandom, random } from '../src/core/rng';
import { audio } from '../src/core/audio';
import { CHAPTERS } from '../src/content/chapters';
import { INITIAL_MENU } from '../src/content/menu';
import { GameState, CustomerOrder, TrayItem, StaffRole } from '../src/types/game';
import { staffEffects, tickStaff, fryingItemId, missingItems, maxStaff, FRY_RECIPES, extraTraySlots, severancePay } from '../src/core/staff';
import { generateCandidate } from '../src/content/staff';

audio.setMuted(true);

// ---------------------------------------------------------------------------
// Người chơi ảo
// ---------------------------------------------------------------------------

interface Profile {
  name: string;
  reactionMs: number;   // thời gian giữa 2 thao tác
  liftSd: number;       // độ lệch khi nhấc gà, đơn vị tiến độ chảo (1 đơn vị = 60ms)
  prefetch: boolean;    // làm trước món cho khách thứ 2 khi khách đầu đã đủ
}
const PROFILES: Profile[] = [
  { name: 'Giỏi', reactionMs: 450, liftSd: 4, prefetch: true },
  { name: 'Trung bình', reactionMs: 800, liftSd: 8, prefetch: false },
  { name: 'Vụng', reactionMs: 1300, liftSd: 13, prefetch: false }
];

type UpgradePolicy = 'không nâng cấp' | 'có nâng cấp';
type StaffPolicy = 'không nhân viên' | 'có nhân viên';

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

// Nhập đủ cho số khách dự kiến: mỗi order ~1,35 món, chia đều cho các món bếp làm được
// Lượng đã dùng của từng nguyên liệu trong các ngày gần đây (người thật nhìn kho cuối ngày để nhập)
const usageLog = new WeakMap<GameState, Record<string, number>[]>();
function restock(state: GameState, expected: number) {
  const servable = INITIAL_MENU.filter(m => m.station && m.station !== 'combo' && m.chapter <= state.currentChapter
    && Object.keys(m.ingredients).every(id => state.inventory[id]?.unlocked !== false));
  const need: Record<string, number> = {};
  for (const m of servable) {
    for (const [ing, n] of Object.entries(m.ingredients)) need[ing] = (need[ing] ?? 0) + n * expected * 1.35 / servable.length;
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

function playDay(state: GameState, p: Profile, policy: UpgradePolicy, staffPolicy: StaffPolicy) {
  const event = eventForDay(state.day);
  const expected = EconomyEngine.calculateDailyCustomerCount(state, event.effect.customerMultiplier ?? 1);
  for (const [id, inv] of Object.entries(state.inventory)) {
    if (inv.unlocked === false && (inv.unlockCost ?? 0) <= state.money * 0.25) signIngredientContract(state, id);
  }
  // Nhập theo sức bán thật: ngày đông nhất trong 5 ngày gần đây (+40%), không vượt khách dự kiến.
  // (Nhập theo khách dự kiến thì quá tải là hàng hết hạn hàng loạt; theo trung bình thì hết hàng → bán ít → nhập ít hơn)
  const recent = state.dayHistory.slice(-5);
  const peak = recent.length ? Math.max(...recent.map(l => l.customersServed + l.customersLost)) : expected;
  restock(state, Math.min(expected, Math.ceil(peak * 1.4)));
  if (state.oilCondition !== 'clean' && state.money >= 150000 + 300000) {
    state.money -= 150000;
    state.oilCondition = 'clean';
    state.oilBatchesCooked = 0;
  }
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
  cook.setTraySize(CookingEngine.TRAY_SIZE + extraTraySlots(state.staff));
  const source = createCustomerSource(state, event);
  session.orders.push(...source.opening());

  const STEP = 100;
  let busyMs = 0;
  let liftAt = 0;
  const price = (id: string) => state.menu.find(m => m.id === id)?.currentPrice ?? 0;

  for (let dayOver = false; !dayOver;) {
    const dt = gameDeltaMs(session, STEP);
    const cooked = cook.updateFrying(dt);
    if (cooked.finished && cooked.quality === 'burnt') recordFryerLift(state, session, cook.liftFryer());
    for (const e of tickSelling(session, dt, { expectedCustomers: expected, spawnCustomer: () => source.next(session.orders) })) {
      if (e.type === 'dayOver') dayOver = true;
    }
    if (state.staff.length > 0) {
      const cs = cook.getCookState();
      const staffEvents = tickStaff(session, cook.getTray(), dt, staffEffects(state.staff, session.gameHour),
        cs.isFrying ? fryingItemId(cs.fryingType, cook.getActiveSeasoning()) : null,
        { use: ids => useIngredients(state, session, ids), place: item => cook.addToTray(item), pour: d => makeDrink(state, session, cook, d) === 'ok', traySize: cook.getTraySize() });
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
    if (state.oilCondition === 'dirty' && p.name !== 'Vụng' && state.money >= 150000 && !cook.getCookState().isFrying) {
      state.money -= 150000;
      state.oilCondition = 'clean';
      state.oilBatchesCooked = 0;
      continue;
    }

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

// ---------------------------------------------------------------------------
// Chạy & báo cáo
// ---------------------------------------------------------------------------

const arg = (name: string, fallback: number) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};
const DAYS = arg('days', 60);
const DEBUG_DAYS = process.argv.includes('--debug');
const DEBUG_FROM = arg('debug-from', 7);
const SEEDS = arg('seeds', 12);
const DEBUG_POLICY = arg('debug-policy', 0);
const DEBUG_SEED = arg('debug-seed', 1);
const DEBUG_PROFILE = PROFILES[arg('debug-profile', 1)]?.name;

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)]! : NaN;
};
const fmt = (v: number) => `${(v / 1e6).toFixed(2)}tr`;
const target = CHAPTERS[0];

console.log(`Mô phỏng ${SEEDS} lượt × ${DAYS} ngày · mục tiêu Chương 1: ${fmt(target.targetMoney)} + ${target.targetStars} sao · GDD: Chương 1 = ngày 1–15\n`);

const POLICIES: [UpgradePolicy, StaffPolicy][] = [
  ['không nâng cấp', 'không nhân viên'], ['không nâng cấp', 'có nhân viên'], ['có nâng cấp', 'không nhân viên'], ['có nâng cấp', 'có nhân viên']
];
for (const pol of POLICIES) {
  const [policy, staffPolicy] = pol;
  for (const p of PROFILES) {
    const ch2Days: number[] = [], ch3Days: number[] = [], ch4Days: number[] = [];
    const moneyAt: Record<number, number[]> = { 5: [], 10: [], 15: [], 30: [], 60: [], 100: [], 150: [] };
    let served = 0, lost = 0, expectedSum = 0, profitSum = 0, days = 0, perfect = 0, fried = 0;
    const stars: number[] = [];
    const blank = () => ({ days: 0, expected: 0, served: 0, lost: 0, revenue: 0, ingredients: 0, wages: 0, profit: 0, stars: 0 });
    const per: Record<number, ReturnType<typeof blank>> = { 2: blank(), 3: blank(), 4: blank() };

    for (let seed = 1; seed <= SEEDS; seed++) {
      seedRandom(seed * 7919);
      const state = createInitialState();
      let ch2 = NaN, ch3 = NaN, ch4 = NaN;
      for (let d = 1; d <= DAYS; d++) {
        const { ledger, unlocked, expected } = playDay(state, p, policy, staffPolicy);
        if (unlocked === 2) ch2 = d;
        if (unlocked === 3) ch3 = d;
        if (unlocked === 4) ch4 = d;
        if (moneyAt[d]) moneyAt[d]!.push(state.money);
        if (DEBUG_DAYS && seed === DEBUG_SEED && p.name === DEBUG_PROFILE && POLICIES.indexOf(pol) === DEBUG_POLICY && d >= DEBUG_FROM && d <= DEBUG_FROM + 5) {
          console.log(`  [debug] ngày ${d} ch${state.currentChapter} tiền ${fmt(state.money)} | khách dự kiến ${expected} phục vụ ${ledger.customersServed} bỏ ${ledger.customersLost} | thu ${fmt(ledger.grossRevenue + ledger.tips)} nguyên liệu ${fmt(ledger.ingredientCost)} hết hạn ${fmt(ledger.wasteCost)} mặt bằng+điện ${fmt(ledger.rent + ledger.utilities)} lương ${fmt(ledger.wages)} hoa hồng ${fmt(ledger.appCommissions)} lãi ${fmt(ledger.netProfit)} | NV ${state.staff.map(m => m.role + ':' + m.mood).join(',')} | sao ${JSON.stringify(state.ratings)}`);
        }
        const c2 = per[state.currentChapter];
        if (c2 && unlocked === null) {
          c2.days++; c2.expected += expected; c2.served += ledger.customersServed; c2.lost += ledger.customersLost;
          c2.revenue += ledger.grossRevenue + ledger.tips; c2.ingredients += ledger.ingredientCost + ledger.wasteCost;
          c2.wages += ledger.wages; c2.profit += ledger.netProfit; c2.stars += state.ratings.overall;
        }
        if (d <= 15) {
          served += ledger.customersServed; lost += ledger.customersLost;
          expectedSum += expected; profitSum += ledger.netProfit; days++;
        }
      }
      perfect += state.lifetimeStats.perfectFriedCount;
      fried += state.lifetimeStats.totalFried;
      stars.push(state.ratings.overall);
      ch2Days.push(Number.isNaN(ch2) ? Infinity : ch2);
      ch3Days.push(Number.isNaN(ch3) ? Infinity : ch3);
      ch4Days.push(Number.isNaN(ch4) ? Infinity : ch4);
    }

    const passed = ch2Days.filter(Number.isFinite).length;
    const m2 = median(ch2Days);
    console.log(`■ ${p.name} · ${policy} · ${staffPolicy}`);
    console.log(`  Qua Chương 1: ${passed}/${SEEDS} lượt, trung vị ngày ${Number.isFinite(m2) ? m2 : `> ${DAYS}`}` +
      `  (nhanh nhất ${Math.min(...ch2Days)}, chậm nhất ${Math.max(...ch2Days) === Infinity ? `> ${DAYS}` : Math.max(...ch2Days)})`);
    const m3 = median(ch3Days);
    const m4 = median(ch4Days);
    const pass = (xs: number[]) => xs.filter(Number.isFinite).length;
    console.log(`  Qua Chương 2: ${pass(ch3Days)}/${SEEDS}, trung vị ngày ${Number.isFinite(m3) ? m3 : `> ${DAYS}`} · Qua Chương 3: ${pass(ch4Days)}/${SEEDS}, trung vị ngày ${Number.isFinite(m4) ? m4 : `> ${DAYS}`} (GDD: 50 / 100)`);
    console.log(`  Tiền (trung vị): ngày 5 ${fmt(median(moneyAt[5]!))} · ngày 10 ${fmt(median(moneyAt[10]!))} · ngày 15 ${fmt(median(moneyAt[15]!))} · ngày 30 ${fmt(median(moneyAt[30]!))} · ngày 60 ${fmt(median(moneyAt[60]!))} · ngày 100 ${fmt(median(moneyAt[100]!))} · ngày 150 ${fmt(median(moneyAt[150]!))}`);
    console.log(`  15 ngày đầu/ngày: khách dự kiến ${(expectedSum / days).toFixed(1)}, phục vụ ${(served / days).toFixed(1)}, bỏ về ${(lost / days).toFixed(1)}, lãi ${fmt(profitSum / days)}`);
    for (const [ch, c2] of Object.entries(per)) {
      if (!c2.days) continue;
      const a = (v: number) => v / c2.days;
      console.log(`  Chương ${ch}/ngày: khách dự kiến ${a(c2.expected).toFixed(1)}, phục vụ ${a(c2.served).toFixed(1)}, bỏ ${a(c2.lost).toFixed(1)} | thu ${fmt(a(c2.revenue))} hàng ${fmt(a(c2.ingredients))} lương ${fmt(a(c2.wages))} lãi ${fmt(a(c2.profit))} | sao TB ${a(c2.stars).toFixed(2)}`);
    }
    console.log(`  Tỉ lệ Perfect ${(100 * perfect / Math.max(1, fried)).toFixed(0)}% · sao cuối ${median(stars).toFixed(1)}\n`);
  }
}
