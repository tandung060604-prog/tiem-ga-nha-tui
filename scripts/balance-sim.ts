// Mô phỏng cân bằng: người chơi ảo chơi nhiều ngày bằng ĐÚNG luật của game (core/*), không DOM.
// Chạy: npm run sim [-- --days 60 --seeds 20]
// Trả lời: người chơi giỏi / trung bình / vụng qua Chương 1 (850k → 5 triệu, ≥3,5 sao) vào ngày mấy?
import { createInitialState } from '../src/core/state';
import { CookingEngine, Sauce } from '../src/core/cooking';
import { createSellingSession, gameDeltaMs, tickSelling, SellingSession } from '../src/core/sellingSim';
import {
  eventForDay, createCustomerSource, serveFirstOrder, applyBunnyReward, closeDay, useIngredients, recordFryerLift
} from '../src/core/day';
import { EconomyEngine } from '../src/core/economy';
import { upgradeEffects } from '../src/core/upgrades';
import { addStock } from '../src/core/inventory';
import { seedRandom, random } from '../src/core/rng';
import { audio } from '../src/core/audio';
import { CHAPTERS } from '../src/content/chapters';
import { INITIAL_MENU } from '../src/content/menu';
import { GameState, CustomerOrder, TrayItem } from '../src/types/game';

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

const PERFECT_CENTER = (CookingEngine.ZONES.goodLow + CookingEngine.ZONES.perfect) / 2;
const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

const FRYER_FOR: Record<string, { type: 'chicken' | 'fries'; sauce: Sauce | null } | 'drink'> = {
  crispy_chicken: { type: 'chicken', sauce: null },
  spicy_chicken: { type: 'chicken', sauce: 'spicy' },
  honey_garlic_chicken: { type: 'chicken', sauce: 'honey' },
  shake_fries: { type: 'fries', sauce: null },
  soda: 'drink'
};

// Món còn thiếu của một khách, sau khi trừ những món đã nằm sẵn trong khay (không tính gà sống)
function missingItems(order: CustomerOrder, tray: readonly TrayItem[]): string[] {
  const available = tray.filter(t => t.quality !== 'raw').map(t => t.menuItemId);
  const missing: string[] = [];
  for (const it of order.items) {
    for (let k = it.served; k < it.count; k++) {
      const i = available.indexOf(it.menuItemId);
      if (i >= 0) available.splice(i, 1);
      else missing.push(it.menuItemId);
    }
  }
  return missing;
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
function restock(state: GameState, expected: number) {
  const servable = INITIAL_MENU.filter(m => m.station && m.chapter <= state.currentChapter);
  const need: Record<string, number> = {};
  for (const m of servable) {
    for (const [ing, n] of Object.entries(m.ingredients)) need[ing] = (need[ing] ?? 0) + n * expected * 1.35 / servable.length;
  }
  // gà sốt cần thêm sốt, không có trong ingredients của gà giòn
  for (const [id, target] of Object.entries(need)) {
    const want = Math.ceil(target * 1.15);
    while ((state.inventory[id]?.amount ?? 0) < want && buy(state, id, 5)) { /* mua theo lô 5 */ }
  }
}

function buyUpgrades(state: GameState) {
  for (const id of ['marketing', 'kitchen', 'operations', 'space']) {
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

function playDay(state: GameState, p: Profile, policy: UpgradePolicy) {
  const event = eventForDay(state.day);
  const expected = EconomyEngine.calculateDailyCustomerCount(state, event.effect.customerMultiplier ?? 1);
  restock(state, expected);
  if (state.oilCondition !== 'clean' && state.money >= 150000 + 300000) {
    state.money -= 150000;
    state.oilCondition = 'clean';
    state.oilBatchesCooked = 0;
  }
  if (policy === 'có nâng cấp') buyUpgrades(state);

  const session: SellingSession = createSellingSession();
  const cook = new CookingEngine();
  cook.setFryRampBonus(upgradeEffects(state.upgrades).fryRampPct);
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
        state.money += r.paid + r.tip;
        if (r.order.isBunny) applyBunnyReward(state, r.order);
      }
      continue;
    }

    const targets = [first, p.prefetch ? session.orders[1] : undefined].filter((o): o is CustomerOrder => !!o);
    const needed = targets.flatMap(o => missingItems(o, tray))[0];
    if (!needed || cook.isTrayFull()) { busyMs = STEP; continue; }
    const how = FRYER_FOR[needed];
    if (!how) { busyMs = STEP; continue; }
    if (how === 'drink') {
      if (useIngredients(state, session, ['soft_drink'])) cook.addDrink();
      continue;
    }
    const ok = useIngredients(state, session, how.type === 'chicken' ? ['chicken_meat', 'flour'] : ['potato_cheese']);
    if (!ok) { busyMs = STEP; continue; }
    if (how.sauce && (state.inventory[how.sauce === 'spicy' ? 'spicy_sauce' : 'garlic_honey']?.amount ?? 0) > 0) {
      cook.setSeasoning(how.sauce);
    }
    session.totalFriedCount += 1;
    cook.startFrying(how.type);
    liftAt = PERFECT_CENTER + gauss() * p.liftSd;
  }

  const result = closeDay(state, session, event);
  state.day += 1;
  return { ledger: result.ledger, unlocked: result.unlockedChapter, expected };
}

// ---------------------------------------------------------------------------
// Chạy & báo cáo
// ---------------------------------------------------------------------------

const arg = (name: string, fallback: number) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};
const DAYS = arg('days', 60);
const SEEDS = arg('seeds', 12);

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)]! : NaN;
};
const fmt = (v: number) => `${(v / 1e6).toFixed(2)}tr`;
const target = CHAPTERS[0];

console.log(`Mô phỏng ${SEEDS} lượt × ${DAYS} ngày · mục tiêu Chương 1: ${fmt(target.targetMoney)} + ${target.targetStars} sao · GDD: Chương 1 = ngày 1–15\n`);

for (const policy of ['không nâng cấp', 'có nâng cấp'] as UpgradePolicy[]) {
  for (const p of PROFILES) {
    const ch2Days: number[] = [], ch3Days: number[] = [];
    const moneyAt: Record<number, number[]> = { 5: [], 10: [], 15: [], 30: [] };
    let served = 0, lost = 0, expectedSum = 0, profitSum = 0, days = 0, perfect = 0, fried = 0;
    const stars: number[] = [];

    for (let seed = 1; seed <= SEEDS; seed++) {
      seedRandom(seed * 7919);
      const state = createInitialState();
      let ch2 = NaN, ch3 = NaN;
      for (let d = 1; d <= DAYS; d++) {
        const { ledger, unlocked, expected } = playDay(state, p, policy);
        if (unlocked === 2) ch2 = d;
        if (unlocked === 3) ch3 = d;
        if (moneyAt[d]) moneyAt[d]!.push(state.money);
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
    }

    const passed = ch2Days.filter(Number.isFinite).length;
    const m2 = median(ch2Days);
    console.log(`■ ${p.name} · ${policy}`);
    console.log(`  Qua Chương 1: ${passed}/${SEEDS} lượt, trung vị ngày ${Number.isFinite(m2) ? m2 : `> ${DAYS}`}` +
      `  (nhanh nhất ${Math.min(...ch2Days)}, chậm nhất ${Math.max(...ch2Days) === Infinity ? `> ${DAYS}` : Math.max(...ch2Days)})`);
    const m3 = median(ch3Days);
    console.log(`  Qua Chương 2: trung vị ngày ${Number.isFinite(m3) ? m3 : `> ${DAYS}`}`);
    console.log(`  Tiền (trung vị): ngày 5 ${fmt(median(moneyAt[5]!))} · ngày 10 ${fmt(median(moneyAt[10]!))} · ngày 15 ${fmt(median(moneyAt[15]!))} · ngày 30 ${fmt(median(moneyAt[30]!))}`);
    console.log(`  15 ngày đầu/ngày: khách dự kiến ${(expectedSum / days).toFixed(1)}, phục vụ ${(served / days).toFixed(1)}, bỏ về ${(lost / days).toFixed(1)}, lãi ${fmt(profitSum / days)}`);
    console.log(`  Tỉ lệ Perfect ${(100 * perfect / Math.max(1, fried)).toFixed(0)}% · sao cuối ${median(stars).toFixed(1)}\n`);
  }
}
