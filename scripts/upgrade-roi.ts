// Đo hoàn vốn từng cấp nâng cấp: lấy quán THẬT của người chơi ảo ở đầu mỗi chương, chạy 10 ngày
// có và không có đúng một nâng cấp (cùng seed), so tiền cuối kỳ. Hoàn vốn = giá / lãi thêm mỗi ngày.
// Chạy: npx tsx scripts/upgrade-roi.ts [--profile 1] [--seeds 4] [--days 10]
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { GameState } from '../src/types/game';
import { PROFILES, playDay } from './sim/engine';

const arg = (name: string, fallback: number) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};
const PROFILE = PROFILES[arg('profile', 1)]!;
const SEEDS = arg('seeds', 4);
const DAYS = arg('days', 10);
const clone = (s: GameState): GameState => JSON.parse(JSON.stringify(s));
// Cấp L thường mua từ chương nào (đo ở chương đó trở đi)
const MIN_CHAPTER_FOR_LEVEL: Record<number, number> = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 4 };

// Quán ở đầu mỗi chương (ngày thứ 3 của chương), theo chính sách "có nhân viên, không nâng cấp"
function snapshots(seed: number): Map<number, GameState> {
  seedRandom(seed * 7919);
  const state = createInitialState();
  const out = new Map<number, GameState>();
  let enteredAt = 1;
  for (let d = 1; d <= 260 && out.size < 4; d++) {
    const before = state.currentChapter;
    playDay(state, PROFILE, 'không nâng cấp', 'có nhân viên');
    if (state.currentChapter !== before) enteredAt = d;
    if (d - enteredAt === 3 && !out.has(state.currentChapter)) out.set(state.currentChapter, clone(state));
    if (d === 3) out.set(1, clone(state));
  }
  return out;
}

function run(state: GameState, seed: number): number {
  seedRandom(seed);
  const start = state.money;
  for (let d = 0; d < DAYS; d++) playDay(state, PROFILE, 'không nâng cấp', 'có nhân viên');
  return state.money - start;
}

const fmt = (v: number) => `${(v / 1e6).toFixed(2)}tr`;
const rows = new Map<string, { chapter: number; branch: string; name: string; cost: number; gains: number[] }>();

for (let seed = 1; seed <= SEEDS; seed++) {
  for (const [chapter, snap] of snapshots(seed)) {
    for (const [id, branch] of Object.entries(snap.upgrades)) {
     // Mọi cấp L ≥ 2: so quán ở cấp L-1 với cấp L (các nhánh khác giữ nguyên, không trừ tiền: lãi thêm thuần)
     for (let L = 2; L <= branch.tiers.length; L++) {
      const tier = branch.tiers[L - 1];
      if (!tier || chapter < MIN_CHAPTER_FOR_LEVEL[L]!) continue;
      const baseState = clone(snap);
      baseState.upgrades[id]!.currentLevel = L - 1;
      const variant = clone(snap);
      variant.upgrades[id]!.currentLevel = L;
      const base = run(baseState, seed * 31 + chapter);
      const gain = (run(variant, seed * 31 + chapter) - base) / DAYS;
      const key = `${chapter}|${id}|${L}`;
      const row = rows.get(key) ?? { chapter, branch: branch.name, name: `${L}. ${tier.name}`, cost: tier.cost, gains: [] };
      row.gains.push(gain);
      rows.set(key, row);
     }
    }
  }
}

console.log(`Hoàn vốn nâng cấp · người chơi ${PROFILE.name} có nhân viên · ${SEEDS} lượt × ${DAYS} ngày\n`);
for (const r of [...rows.values()].sort((a, b) => a.chapter - b.chapter || a.branch.localeCompare(b.branch) || a.name.localeCompare(b.name))) {
  const g = r.gains.reduce((a, b) => a + b, 0) / r.gains.length;
  const payback = g > 0 ? `${Math.round(r.cost / g)} ngày` : 'không hoàn vốn';
  console.log(`Chương ${r.chapter} · ${r.branch.padEnd(22)} → ${r.name.padEnd(30)} giá ${fmt(r.cost).padStart(8)} · lãi thêm ${fmt(g).padStart(7)}/ngày · hoàn vốn ${payback}`);
}
