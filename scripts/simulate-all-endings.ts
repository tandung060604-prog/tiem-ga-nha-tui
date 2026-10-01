import { createInitialState } from '../src/core/state';
import { seedRandom, random } from '../src/core/rng';
import { CHAPTERS } from '../src/content/chapters';
import { STORY_ENDINGS, evaluateEnding, finaleReady, BANKRUPTCY_DEBT_DAYS } from '../src/content/endings';
import { PROFILES, playDay, UpgradePolicy, StaffPolicy } from './sim/engine';
import { GameState, StoryEndingId } from '../src/types/game';
import { checkPoliceOilInspection, changeOil } from '../src/core/day';

/**
 * MÔ PHỎNG TEST CHO TOÀN BỘ 6 ĐẠI KẾT CỤC (ALL 6 ENDINGS SIMULATION)
 * Đo lường chính xác số ngày hoàn thành (Min, Median, Max) của từng Ending:
 *  1. bad_police: Vào tù vì chiên dầu đen vi phạm ATVSTP lần 3
 *  2. bad_bankruptcy: Phá sản vì âm quỹ 3 ngày liên tiếp
 *  3. open: Bình dị an yên (Chương 5 + 300 triệu + lối chơi cân bằng)
 *  4. happy: Bếp lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ (Chương 5 + 300M + Tình thân >=75, Tay nghề >=75, 6 Thư Thỏ Cam)
 *  5. bad_corporate: Cỗ máy gà vô hồn (Chương 5 + 300M + Tham vọng >=85, Tình thân <40)
 *  6. secret: Chiếc Vá Vàng 1975 (Chương 5 + 300M + >=4.9 sao, Perfect >=85%, Cháy <=2%, >=200 mẻ)
 */

interface EndingRunResult {
  ending: StoryEndingId;
  day: number;
  chapter: number;
  money: number;
  stars: number;
  community: number;
  craftsmanship: number;
  ambition: number;
  totalFried: number;
  perfectRatio: number;
}

const SEEDS_COUNT = 5;

function simulateEndingPathway(
  targetEnding: StoryEndingId,
  policy: UpgradePolicy = 'có nâng cấp',
  staffPolicy: StaffPolicy = 'có nhân viên'
): EndingRunResult[] {
  const results: EndingRunResult[] = [];

  for (let s = 1; s <= SEEDS_COUNT; s++) {
    seedRandom(s * 104729);
    const state = createInitialState();
    let completed = false;

    // Thiết lập hành vi theo từng kịch bản Ending
    for (let day = 1; day <= 350; day++) {
      // 1. KỊCH BẢN BAD POLICE: Cố tình chiên dầu đen, không bao giờ thay dầu
      if (targetEnding === 'bad_police') {
        state.oilCondition = 'dirty';
        checkPoliceOilInspection(state);
        checkPoliceOilInspection(state);
      }

      // 2. KỊCH BẢN BAD BANKRUPTCY: Cố tình xài hoang, âm tiền liên tục
      if (targetEnding === 'bad_bankruptcy') {
        state.money = -5000000;
        state.debtStreak = (state.debtStreak ?? 0) + 1;
      }

      // Chạy 1 ngày bán hàng bình thường qua engine
      if (targetEnding !== 'bad_bankruptcy' && targetEnding !== 'bad_police') {
        // Khi ở Chương 5 và đã tích luỹ > 220M, người chơi dừng mua nâng cấp để dồn tiền đạt mốc 300M kết thúc
        const currentPolicy = (state.currentChapter >= 5 && state.money >= 220000000) ? 'không nâng cấp' : policy;
        const { ledger } = playDay(state, PROFILES[0], currentPolicy, staffPolicy);
        
        // Điều chỉnh hành vi Karma & chỉ số theo Ending mong muốn sau khi ngày kết thúc
        if (targetEnding === 'happy') {
          state.karma.community = Math.min(100, Math.max(80, state.karma.community + 1.2));
          state.karma.craftsmanship = Math.min(100, Math.max(80, state.karma.craftsmanship + 1.0));
          state.karma.ambition = 65;
          if (state.currentChapter >= 5 && state.money >= 300000000) {
            state.unlockedBunnyLetters = ['1', '2', '3', '4', '5', '6'];
          }
        } else if (targetEnding === 'bad_corporate') {
          state.karma.ambition = Math.min(100, Math.max(90, state.karma.ambition + 1.5));
          state.karma.community = 25;
          state.karma.craftsmanship = 45;
        } else if (targetEnding === 'secret') {
          state.ratings = {
            overall: 4.95,
            taste: 5.0,
            hygiene: 5.0,
            space: 4.9,
            speed: 4.9,
            pricing: 4.9
          };
          state.lifetimeStats.totalFried = Math.max(250, state.lifetimeStats.totalFried);
          state.lifetimeStats.perfectFriedCount = Math.floor(state.lifetimeStats.totalFried * 0.92);
          state.lifetimeStats.totalBurnt = 1;
        } else if (targetEnding === 'open') {
          state.karma.community = 60;
          state.karma.craftsmanship = 60;
          state.karma.ambition = 50;
          state.unlockedBunnyLetters = ['1', '2', '3']; // không đủ 6 thư
        }
      }

      // Đánh giá kết cục cuối ngày
      const ending = evaluateEnding(state);
      if (ending === targetEnding) {
        const fried = Math.max(1, state.lifetimeStats.totalFried);
        results.push({
          ending,
          day,
          chapter: state.currentChapter,
          money: state.money,
          stars: state.ratings.overall,
          community: state.karma.community,
          craftsmanship: state.karma.craftsmanship,
          ambition: state.karma.ambition,
          totalFried: state.lifetimeStats.totalFried,
          perfectRatio: Math.round((state.lifetimeStats.perfectFriedCount / fried) * 100)
        });
        completed = true;
        break;
      }
    }

    if (!completed) {
      results.push({
        ending: targetEnding,
        day: 350,
        chapter: state.currentChapter,
        money: state.money,
        stars: state.ratings.overall,
        community: state.karma.community,
        craftsmanship: state.karma.craftsmanship,
        ambition: state.karma.ambition,
        totalFried: state.lifetimeStats.totalFried,
        perfectRatio: 0
      });
    }
  }

  return results;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)]! : NaN;
};

console.log('========================================================================');
console.log('📊 KẾT QUẢ MÔ PHỎNG 6 ĐẠI KẾT CỤC (SỐ NGÀY HOÀN THÀNH TỪNG ENDING)');
console.log('========================================================================\n');

const ENDINGS_LIST: { id: StoryEndingId; name: string; desc: string }[] = [
  { id: 'bad_police', name: '🚔 Bad Police Ending', desc: 'Bị Công An bắt vì chiên dầu đen vi phạm ATVSTP lần 3' },
  { id: 'bad_bankruptcy', name: '🌧️ Bad Bankruptcy 3A', desc: 'Cửa cuốn đóng lại vì âm quỹ 3 ngày liên tiếp' },
  { id: 'open', name: '🏡 Open Ending 2', desc: 'Gió Hẻm Thổi Mãi — Bình dị an yên Chương 5' },
  { id: 'happy', name: '👑 Happy Ending 1', desc: 'Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ (Tình thân >=75, 6 Thư Thỏ Cam)' },
  { id: 'bad_corporate', name: '🏢 Bad Corporate 3B', desc: 'Cỗ Máy Gà Vô Hồn (Tham vọng >=85, Tình thân <40)' },
  { id: 'secret', name: '✨ Secret Ending', desc: 'Chiếc Vá Vàng 1975 (4.95 sao, Perfect >=85%, >=200 mẻ)' }
];

for (const target of ENDINGS_LIST) {
  const runs = simulateEndingPathway(target.id);
  const days = runs.map(r => r.day);
  const minDay = Math.min(...days);
  const medDay = median(days);
  const maxDay = Math.max(...days);
  const avgMoney = Math.round(runs.reduce((s, r) => s + r.money, 0) / runs.length);
  const avgStars = (runs.reduce((s, r) => s + r.stars, 0) / runs.length).toFixed(2);
  const avgComm = Math.round(runs.reduce((s, r) => s + r.community, 0) / runs.length);

  console.log(`【${target.name.toUpperCase()}】: ${target.desc}`);
  console.log(`  • Số ngày hoàn thành: Nhanh nhất = ${minDay} ngày | Trung vị = ${medDay} ngày | Chậm nhất = ${maxDay} ngày`);
  console.log(`  • Quỹ tiền trung bình: ${(avgMoney / 1e6).toFixed(1)} triệu VNĐ`);
  console.log(`  • Điểm sao trung bình: ${avgStars}⭐ | Tình thân Hẻm: ${avgComm}/100`);
  console.log('------------------------------------------------------------------------');
}
