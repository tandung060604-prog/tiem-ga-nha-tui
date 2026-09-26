// Mô phỏng cân bằng: người chơi ảo chơi nhiều ngày bằng ĐÚNG luật của game (core/*), không DOM.
// Chạy: npm run sim [-- --days 60 --seeds 20]
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { CHAPTERS } from '../src/content/chapters';
import { PROFILES, playDay, UpgradePolicy, StaffPolicy, setPricePolicy } from './sim/engine';
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
setPricePolicy(arg('price', 1)); // --price 1.3: mọi món 130% giá gốc (luật kẹp 70–150%)
const ONLY_POLICY = arg('policy', -1); // --policy 3: chỉ chạy một chính sách (mô phỏng dài cho nhanh)
for (const pol of POLICIES.filter((_, i) => ONLY_POLICY < 0 || i === ONLY_POLICY)) {
  const [policy, staffPolicy] = pol;
  for (const p of PROFILES) {
    const ch2Days: number[] = [], ch3Days: number[] = [], ch4Days: number[] = [], ch5Days: number[] = [];
    const moneyAt: Record<number, number[]> = { 5: [], 10: [], 15: [], 30: [], 60: [], 100: [], 150: [], 210: [], 300: [] };
    let served = 0, lost = 0, expectedSum = 0, profitSum = 0, days = 0, perfect = 0, fried = 0;
    const stars: number[] = [];
    const community: number[] = [];
    const blank = () => ({ days: 0, expected: 0, served: 0, lost: 0, revenue: 0, ingredients: 0, wages: 0, profit: 0, stars: 0 });
    const per: Record<number, ReturnType<typeof blank>> = { 2: blank(), 3: blank(), 4: blank(), 5: blank() };

    for (let seed = 1; seed <= SEEDS; seed++) {
      seedRandom(seed * 7919);
      const state = createInitialState();
      let ch2 = NaN, ch3 = NaN, ch4 = NaN, ch5 = NaN;
      for (let d = 1; d <= DAYS; d++) {
        const { ledger, unlocked, expected } = playDay(state, p, policy, staffPolicy);
        if (unlocked === 2) ch2 = d;
        if (unlocked === 3) ch3 = d;
        if (unlocked === 4) ch4 = d;
        if (unlocked === 5) ch5 = d;
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
      community.push(state.karma.community);
      ch2Days.push(Number.isNaN(ch2) ? Infinity : ch2);
      ch3Days.push(Number.isNaN(ch3) ? Infinity : ch3);
      ch4Days.push(Number.isNaN(ch4) ? Infinity : ch4);
      ch5Days.push(Number.isNaN(ch5) ? Infinity : ch5);
    }

    const passed = ch2Days.filter(Number.isFinite).length;
    const m2 = median(ch2Days);
    console.log(`■ ${p.name} · ${policy} · ${staffPolicy}${arg('price', 1) !== 1 ? ` · giá ×${arg('price', 1)}` : ''}`);
    console.log(`  Qua Chương 1: ${passed}/${SEEDS} lượt, trung vị ngày ${Number.isFinite(m2) ? m2 : `> ${DAYS}`}` +
      `  (nhanh nhất ${Math.min(...ch2Days)}, chậm nhất ${Math.max(...ch2Days) === Infinity ? `> ${DAYS}` : Math.max(...ch2Days)})`);
    const m3 = median(ch3Days);
    const m4 = median(ch4Days);
    const pass = (xs: number[]) => xs.filter(Number.isFinite).length;
    console.log(`  Qua Chương 2: ${pass(ch3Days)}/${SEEDS}, trung vị ngày ${Number.isFinite(m3) ? m3 : `> ${DAYS}`} · Qua Chương 3: ${pass(ch4Days)}/${SEEDS}, trung vị ngày ${Number.isFinite(m4) ? m4 : `> ${DAYS}`} (GDD: 50 / 100)` + ` · Qua Chương 4: ${pass(ch5Days)}/${SEEDS}, trung vị ngày ${Number.isFinite(median(ch5Days)) ? median(ch5Days) : `> ${DAYS}`} (GDD: 150)`);
    console.log(`  Tiền (trung vị): ngày 5 ${fmt(median(moneyAt[5]!))} · ngày 10 ${fmt(median(moneyAt[10]!))} · ngày 15 ${fmt(median(moneyAt[15]!))} · ngày 30 ${fmt(median(moneyAt[30]!))} · ngày 60 ${fmt(median(moneyAt[60]!))} · ngày 100 ${fmt(median(moneyAt[100]!))} · ngày 150 ${fmt(median(moneyAt[150]!))} · ngày 210 ${fmt(median(moneyAt[210]!))} · ngày 300 ${fmt(median(moneyAt[300]!))}`);
    console.log(`  15 ngày đầu/ngày: khách dự kiến ${(expectedSum / days).toFixed(1)}, phục vụ ${(served / days).toFixed(1)}, bỏ về ${(lost / days).toFixed(1)}, lãi ${fmt(profitSum / days)}`);
    for (const [ch, c2] of Object.entries(per)) {
      if (!c2.days) continue;
      const a = (v: number) => v / c2.days;
      console.log(`  Chương ${ch}/ngày: khách dự kiến ${a(c2.expected).toFixed(1)}, phục vụ ${a(c2.served).toFixed(1)}, bỏ ${a(c2.lost).toFixed(1)} | thu ${fmt(a(c2.revenue))} hàng ${fmt(a(c2.ingredients))} lương ${fmt(a(c2.wages))} lãi ${fmt(a(c2.profit))} | sao TB ${a(c2.stars).toFixed(2)}`);
    }
    console.log(`  Cuối kỳ: sao ${median(stars).toFixed(2)} · Tình Hẻm ${median(community).toFixed(0)} (Hạnh phúc cần ≥75, Tập đoàn khi <40)`);
    console.log(`  Tỉ lệ Perfect ${(100 * perfect / Math.max(1, fried)).toFixed(0)}% · sao cuối ${median(stars).toFixed(1)}\n`);
  }
}
