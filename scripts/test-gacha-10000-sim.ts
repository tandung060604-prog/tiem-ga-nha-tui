import { createInitialState } from '../src/core/state';
import { performGachaRollSingle, performGachaRollTen, GACHA_PRICES, GACHA_RATES, PITY_CONFIG } from '../src/core/staffGacha';
import { GachaStaffCandidate, GACHA_STAFF_POOL, getStaffPoolByRarity } from '../src/content/gachaStaffPool';
import { StaffRarity } from '../src/types/game';

console.log('================================================================================');
console.log('🎰 MÔ PHỎNG 10.000 LẦN ROLL GACHA NHÂN VIÊN VÔ HẠN TIỀN (STAFF GACHA MONTE CARLO)');
console.log('================================================================================\n');

// -------------------------------------------------------------
// PHẦN 1: MÔ PHỎNG 10.000 LẦN SINGLE ROLL (30.000 THẺ ỨNG VIÊN)
// -------------------------------------------------------------
console.log('>>> [PHẦN 1] BẮT ĐẦU CHẠY 10.000 LẦN SINGLE ROLL (Phát tờ rơi 200.000đ)...');
const singleState = createInitialState();
singleState.money = 100_000_000_000; // Vô hạn tiền

let singleTotalCards = 0;
const singleRarityCount: Record<StaffRarity, number> = { C: 0, R: 0, SR: 0, SSR: 0 };
let singlePacksWithSsr = 0;
let singlePacksWithSr = 0;
let singlePacksWithOnlyCommonOrRare = 0;
let singleHardPityTriggers = 0;
let singleSoftPityTriggers = 0;

const singleSsrIntervals: number[] = [];
let rollsSinceLastSsr = 0;

for (let i = 1; i <= 10000; i++) {
  const prevHardPity = singleState.staffGachaSsrPity || 0;
  const prevSoftPity = singleState.staffGachaPity || 0;

  if (prevHardPity >= PITY_CONFIG.HARD_PITY_THRESHOLD - 1) {
    singleHardPityTriggers++;
  } else if (prevSoftPity >= PITY_CONFIG.SOFT_PITY_THRESHOLD - 1) {
    singleSoftPityTriggers++;
  }

  const res = performGachaRollSingle(singleState);
  if (!res.success || !res.result) {
    console.error('Lỗi khi roll single:', res.error);
    break;
  }

  const candidates = res.result.candidates;
  singleTotalCards += candidates.length;

  let hasSsrThisRoll = false;
  let hasSrThisRoll = false;

  for (const c of candidates) {
    singleRarityCount[c.rarity]++;
    if (c.rarity === 'SSR') hasSsrThisRoll = true;
    if (c.rarity === 'SR') hasSrThisRoll = true;
  }

  rollsSinceLastSsr++;
  if (hasSsrThisRoll) {
    singlePacksWithSsr++;
    singleSsrIntervals.push(rollsSinceLastSsr);
    rollsSinceLastSsr = 0;
  } else if (hasSrThisRoll) {
    singlePacksWithSr++;
  } else {
    singlePacksWithOnlyCommonOrRare++;
  }
}

// -------------------------------------------------------------
// PHẦN 2: MÔ PHỎNG 1.000 LẦN TEN ROLL (10.000 THẺ ỨNG VIÊN)
// -------------------------------------------------------------
console.log('>>> [PHẦN 2] BẮT ĐẦU CHẠY 1.000 LẦN TEN ROLL (Sàn tuyển dụng VIP 1.800.000đ)...');
const tenState = createInitialState();
tenState.money = 100_000_000_000; // Vô hạn tiền

let tenTotalCards = 0;
const tenRarityCount: Record<StaffRarity, number> = { C: 0, R: 0, SR: 0, SSR: 0 };
let tenPacksWithSsr = 0;
let tenPacksMultipleSsr = 0;
const tenSsrPerPackDistribution: Record<number, number> = {};

for (let i = 1; i <= 1000; i++) {
  const res = performGachaRollTen(tenState);
  if (!res.success || !res.result) {
    console.error('Lỗi khi roll ten:', res.error);
    break;
  }

  const candidates = res.result.candidates;
  tenTotalCards += candidates.length;

  let ssrInPack = 0;
  for (const c of candidates) {
    tenRarityCount[c.rarity]++;
    if (c.rarity === 'SSR') ssrInPack++;
  }

  tenSsrPerPackDistribution[ssrInPack] = (tenSsrPerPackDistribution[ssrInPack] || 0) + 1;
  if (ssrInPack > 0) tenPacksWithSsr++;
  if (ssrInPack > 1) tenPacksMultipleSsr++;
}

// -------------------------------------------------------------
// TÍNH TOÁN & HIỂN THỊ KẾT QUẢ THỐNG KÊ
// -------------------------------------------------------------
console.log('\n================================================================================');
console.log('📊 KẾT QUẢ 10.000 LẦN SINGLE ROLL (30.000 ỨNG VIÊN XUẤT HIỆN)');
console.log('================================================================================');
console.log(`• Tỷ lệ cấu hình cơ bản (Base Rates):`);
console.log(`  - SSR (5★): ${(GACHA_RATES.SSR * 100).toFixed(1)}%`);
console.log(`  - SR  (3★): ${(GACHA_RATES.SR * 100).toFixed(1)}%`);
console.log(`  - R   (2★): ${(GACHA_RATES.R * 100).toFixed(1)}%`);
console.log(`  - C   (1★): ${(GACHA_RATES.C * 100).toFixed(1)}%`);
console.log('--------------------------------------------------------------------------------');
console.log(`• Tỉ lệ thực tế trên từng THẺ ỨNG VIÊN (30.000 lá bài sinh ra):`);
console.log(`  - SSR (Siêu Hiếm 5★) : ${singleRarityCount.SSR.toLocaleString()} lá  (${((singleRarityCount.SSR / singleTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - SR  (Hiếm 3★)      : ${singleRarityCount.SR.toLocaleString()} lá  (${((singleRarityCount.SR / singleTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - R   (Ưu tú 2★)     : ${singleRarityCount.R.toLocaleString()} lá  (${((singleRarityCount.R / singleTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - C   (Thường 1★)    : ${singleRarityCount.C.toLocaleString()} lá (${((singleRarityCount.C / singleTotalCards) * 100).toFixed(2)}%)`);
console.log('--------------------------------------------------------------------------------');
console.log(`• Tỉ lệ may mắn của NGƯỜI CHƠI theo LƯỢT ROLL (10.000 lượt bấm Roll 3 chọn 1):`);
console.log(`  - Số lượt roll CÓ ÍT NHẤT 1 SSR: ${singlePacksWithSsr.toLocaleString()} / 10.000 (${((singlePacksWithSsr / 10000) * 100).toFixed(2)}%)`);
console.log(`  - Số lượt roll CÓ ÍT NHẤT 1 SR : ${singlePacksWithSr.toLocaleString()} / 10.000 (${((singlePacksWithSr / 10000) * 100).toFixed(2)}%)`);
console.log(`  - Số lượt roll chỉ có C / R     : ${singlePacksWithOnlyCommonOrRare.toLocaleString()} / 10.000 (${((singlePacksWithOnlyCommonOrRare / 10000) * 100).toFixed(2)}%)`);
console.log(`  - Số lần chạm kích hoạt Hard Pity (50 roll): ${singleHardPityTriggers} lần`);
console.log(`  - Số lần chạm kích hoạt Soft Pity (10 roll): ${singleSoftPityTriggers} lần`);
if (singleSsrIntervals.length > 0) {
  const avgSsrInterval = singleSsrIntervals.reduce((a, b) => a + b, 0) / singleSsrIntervals.length;
  console.log(`  - Khoảng cách trung bình giữa 2 lần thấy SSR: ~${avgSsrInterval.toFixed(1)} lượt roll`);
}

console.log('\n================================================================================');
console.log('📊 KẾT QUẢ 1.000 LẦN TEN ROLL (10.000 THẺ ỨNG VIÊN - CAM KẾT SR+)');
console.log('================================================================================');
console.log(`• Tỉ lệ thực tế trên từng THẺ ỨNG VIÊN (10.000 lá bài):`);
console.log(`  - SSR (Siêu Hiếm 5★) : ${tenRarityCount.SSR.toLocaleString()} lá  (${((tenRarityCount.SSR / tenTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - SR  (Hiếm 3★)      : ${tenRarityCount.SR.toLocaleString()} lá  (${((tenRarityCount.SR / tenTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - R   (Ưu tú 2★)     : ${tenRarityCount.R.toLocaleString()} lá  (${((tenRarityCount.R / tenTotalCards) * 100).toFixed(2)}%)`);
console.log(`  - C   (Thường 1★)    : ${tenRarityCount.C.toLocaleString()} lá (${((tenRarityCount.C / tenTotalCards) * 100).toFixed(2)}%)`);
console.log('--------------------------------------------------------------------------------');
console.log(`• Tỉ lệ may mắn của NGƯỜI CHƠI theo GÓI 10 ROLL (1.000 gói):`);
console.log(`  - Gói có ít nhất 1 SSR: ${tenPacksWithSsr} / 1.000 gói (${((tenPacksWithSsr / 1000) * 100).toFixed(2)}%)`);
console.log(`  - Gói NỔ ĐÔI SSR (>=2 SSR): ${tenPacksMultipleSsr} / 1.000 gói (${((tenPacksMultipleSsr / 1000) * 100).toFixed(2)}%)`);
console.log(`  - Phân bổ số SSR xuất hiện trong 1 gói 10 Roll:`);
Object.entries(tenSsrPerPackDistribution).sort(([a], [b]) => Number(a) - Number(b)).forEach(([count, times]) => {
  console.log(`    + ${count} SSR: ${times} gói (${((times / 1000) * 100).toFixed(1)}%)`);
});

// -------------------------------------------------------------
// PHẦN 3: PHÂN TÍCH TÁC ĐỘNG CÂN BẰNG KINH TẾ KHI CÓ NHIỀU SSR
// -------------------------------------------------------------
console.log('\n================================================================================');
console.log('⚖️ PHÂN TÍCH TÁC ĐỘNG CÂN BẰNG KINH TẾ (SSR IMPACT ANALYSIS)');
console.log('================================================================================');
const ssrStaffList = GACHA_STAFF_POOL.filter(s => s.rarity === 'SSR');
console.log(`• Số lượng nhân viên SSR hiện có: ${ssrStaffList.length} nhân vật (Mỗi role 1 vị thần)`);
ssrStaffList.forEach(s => {
  console.log(`  - [${s.role.toUpperCase()}] ${s.name} (${s.title}): Lương ${s.hourlyWage.toLocaleString()}đ/h | Passive: ${s.passiveName} ("${s.passiveDesc}")`);
});

console.log('\n• BẢNG ĐỐI CHIẾU LƯƠNG & KHẢ NĂNG TÀI CHÍNH CỦA TIỆM THEO CHƯƠNG:');
const chaptersComparison = [
  { ch: 1, name: 'Chương 1 (Xe Đẩy Vỉa Hè)', avgCust: 22, revDay: 900_000, maxStaff: 0 },
  { ch: 2, name: 'Chương 2 (Tiệm Trong Hẻm)', avgCust: 45, revDay: 2_600_000, maxStaff: 2 },
  { ch: 3, name: 'Chương 3 (Mặt Tiền Phố)', avgCust: 85, revDay: 8_200_000, maxStaff: 4 },
  { ch: 4, name: 'Chương 4 (Tiệm Hot Trend)', avgCust: 140, revDay: 18_500_000, maxStaff: 6 },
  { ch: 5, name: 'Chương 5 (Chuỗi Gà Quốc Dân)', avgCust: 220, revDay: 32_000_000, maxStaff: 6 },
];

const ssrDailyWage = 85_000 * 8; // 680.000đ/ca 8 tiếng

chaptersComparison.forEach(c => {
  const fullSsrWage = c.maxStaff * ssrDailyWage;
  const wageShare = c.maxStaff > 0 ? ((fullSsrWage / c.revDay) * 100).toFixed(1) : '0';
  console.log(`  ▶ ${c.name}:`);
  console.log(`    - Doanh thu trung bình: ${(c.revDay / 1e6).toFixed(1)} triệu/ngày | Ghế nhân viên: ${c.maxStaff} vị trí`);
  if (c.maxStaff > 0) {
    console.log(`    - Nuôi 1 SSR: ${(ssrDailyWage / 1e3).toLocaleString()}k/ngày (Chiếm ${((ssrDailyWage / c.revDay) * 100).toFixed(1)}% tổng doanh thu)`);
    console.log(`    - Nuôi FULL ${c.maxStaff} SSR: ${(fullSsrWage / 1e6).toFixed(2)} triệu/ngày (Chiếm ${wageShare}% doanh thu)`);
    if (Number(wageShare) > 40) {
      console.log(`    ⚠️ NGUY HIỂM: Nuôi full SSR ở giai đoạn này gây gánh nặng quỹ lương cực lớn, rất dễ phá sản nếu ế khách!`);
    } else {
      console.log(`    ✅ AN TOÀN: Tiệm đủ thặng dư lợi nhuận để nuôi và tận dụng tối đa buff khủng của SSR.`);
    }
  } else {
    console.log(`    - Chưa mở khóa tính năng thuê nhân viên (Mở ở Chương 2).`);
  }
});
console.log('================================================================================\n');
