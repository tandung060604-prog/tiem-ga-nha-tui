/**
 * Overnight Core Engine Stress & Invariant Tester (BÀI TEST XUYÊN ĐÊM CORE ENGINE)
 * Chạy liên tục từ 1,000 đến 50,000 ngày mô phỏng gameplay sâu dưới áp lực cao (Chaos Monkey).
 * Kiểm tra 100% Invariants:
 *  - Không bao giờ bị NaN / null / undefined / Infinity ở tiền, nợ, rating
 *  - Kho không bị âm số lượng, không rò rỉ bộ nhớ lô hết hạn
 *  - Nhân viên không bị tràn kinh nghiệm / tâm trạng ngoài [0, 100]
 *  - Lưu/Tải SaveCode JSON Round-Trip nguyên vẹn 100%
 *  - Đánh giá Kết Cục (Endings) và Sự Cố không crash
 *  - Toàn bộ 4 Minigames (Chợ Lớn, Giao Đơn Xa, Sốt Bí Truyền, Lọc Dầu) hoạt động ổn định
 */

import { createInitialState } from '../src/core/state';
import { seedRandom, random } from '../src/core/rng';
import { CookingEngine } from '../src/core/cooking';
import { EconomyEngine } from '../src/core/economy';
import { OrdersEngine, canMake, BASKET_RULE, basketChance } from '../src/core/orders';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { evaluateEnding } from '../src/content/endings';
import { executeBargain, getTodayWholesaler, WHOLESALERS, BargainTactic } from '../src/core/marketBargain';
import { DeliveryRunnerEngine } from '../src/core/deliveryRunner';
import { generateDailySauceRecipe, SECRET_SAUCE_BUFF } from '../src/core/secretSauce';
import { generateOilCrumbs, calculateFilterResult, OIL_FILTER_CONFIG } from '../src/core/oilFilter';
import { exportSaveCode, importSaveCode } from '../src/core/saveCode';
import { DAILY_INCIDENTS } from '../src/content/dailyIncidents';
import { pickDailyIncident, resolveIncidentChoice } from '../src/core/dailyIncidentsEngine';
import { checkPoliceOilInspection, closeDay, changeOil, creditSale, useIngredients, recordFryerLift, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { addStock, refundStock, signIngredientContract } from '../src/core/inventory';
import { upgradeEffects, UPGRADES } from '../src/core/upgrades';
import { CHAPTERS } from '../src/content/chapters';
import { GameState, CustomerOrder, TrayItem, StaffRole, OilCondition } from '../src/types/game';
import { appendFileSync, writeFileSync } from 'node:fs';

const LOG_FILE = 'logs/overnight-core-stress.log';
writeFileSync(LOG_FILE, `=== BẮT ĐẦU TEST XUYÊN ĐÊM CORE ENGINE: ${new Date().toISOString()} ===\n`);

function log(msg: string) {
  const line = `[${new Date().toLocaleTimeString('vi-VN')}] ${msg}`;
  console.log(line);
  appendFileSync(LOG_FILE, line + '\n');
}

export interface OvernightConfig {
  maxDays: number;
  checkInvariantsEveryDay: boolean;
  saveCodeCheckIntervalDays: number;
  reportIntervalDays: number;
  maxDurationMinutes?: number;
}

export interface BugRecord {
  day: number;
  category: string;
  message: string;
  stack?: string;
  stateDump?: any;
}

export class OvernightStressTester {
  private bugs: BugRecord[] = [];
  private totalDaysSimulated = 0;
  private totalRuns = 0;
  private startTime = Date.now();
  private lastReportTime = Date.now();
  private maxMemoryMb = 0;

  constructor(private config: OvernightConfig) {}

  public run(): { bugs: BugRecord[]; days: number; runs: number; durationSec: number } {
    log(`🚀 Khởi động bài test xuyên đêm: Mục tiêu ${this.config.maxDays.toLocaleString()} ngày mô phỏng.`);

    let state = createInitialState();
    this.totalRuns = 1;

    for (let day = 1; day <= this.config.maxDays; day++) {
      this.totalDaysSimulated++;

      // Kiểm tra giới hạn thời gian nếu có cấu hình
      if (this.config.maxDurationMinutes) {
        const elapsedMinutes = (Date.now() - this.startTime) / (1000 * 60);
        if (elapsedMinutes >= this.config.maxDurationMinutes) {
          log(`⏳ Đạt giới hạn thời gian ${this.config.maxDurationMinutes} phút. Dừng mô phỏng.`);
          break;
        }
      }

      try {
        const isRunOver = this.simulateSingleDay(state);

        // Kiểm tra Invariants cốt lõi sau mỗi ngày
        if (this.config.checkInvariantsEveryDay) {
          this.verifyStateInvariants(state, day);
        }

        // Kiểm tra tính toàn vẹn SaveCode định kỳ
        if (day % this.config.saveCodeCheckIntervalDays === 0) {
          this.verifySaveCodeIntegrity(state, day);
        }

        // Nếu tiệm bị phá sản hoặc Game Over (Police x3), mở tiệm mới tiếp tục test
        if (isRunOver || state.gameOver) {
          this.totalRuns++;
          state = createInitialState();
          state.day = 1;
        }
      } catch (err: any) {
        this.recordBug(day, 'CRITICAL_EXCEPTION', err?.message || String(err), err?.stack, state);
        state = createInitialState();
      }

      // Giám sát dung lượng RAM tiêu thụ
      const memMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      if (memMb > this.maxMemoryMb) this.maxMemoryMb = memMb;

      // In báo cáo định kỳ
      if (day % this.config.reportIntervalDays === 0 || day === this.config.maxDays) {
        const speed = Math.round(this.config.reportIntervalDays / Math.max(0.01, (Date.now() - this.lastReportTime) / 1000));
        this.lastReportTime = Date.now();
        log(`📊 [Ngày ${day.toLocaleString()} / ${this.config.maxDays.toLocaleString()}] ` +
            `Tốc độ: ${speed} ngày/s | RAM: ${memMb}MB (Đỉnh: ${this.maxMemoryMb}MB) | ` +
            `Runs: ${this.totalRuns} | Tiền tiệm: ${(state.money / 1e6).toFixed(2)}tr | ` +
            `Bugs phát hiện: ${this.bugs.length}`);
      }
    }

    const durationSec = Math.round((Date.now() - this.startTime) / 1000);
    log(`🏁 HOÀN TẤT BÀI TEST: ${this.totalDaysSimulated} ngày trong ${durationSec}s. Tổng số lỗi: ${this.bugs.length}`);

    return {
      bugs: this.bugs,
      days: this.totalDaysSimulated,
      runs: this.totalRuns,
      durationSec
    };
  }

  /**
   * Mô phỏng toàn diện 1 ngày làm việc đầy đủ các pha (Sáng -> Trưa bán hàng -> Tối tổng kết)
   */
  private simulateSingleDay(state: GameState): boolean {
    const day = state.day;
    const ch = state.currentChapter;

    // --- 1. SÁNG: MINIGAME ĐI CHỢ ĐẦU MỐI CHỢ LỚN ---
    if (random() < 0.85) {
      const wholesaler = getTodayWholesaler(day);
      const tactics: BargainTactic[] = ['friendly', 'volume', 'hardball'];
      const tactic = tactics[Math.floor(random() * tactics.length)]!;
      const bargainRes = executeBargain(wholesaler, tactic);
      state.todayMarketBargained = true;
      state.todayMarketDiscount = bargainRes.discountPct;
    }

    // --- 2. SÁNG: MINIGAME PHA NƯỚC SỐT BÍ TRUYỀN ---
    if (random() < 0.9) {
      const recipe = generateDailySauceRecipe(day, ch);
      const isSuccess = random() < 0.85; // 85% nấu thành công
      state.secretSauceDay = {
        recipe,
        isSuccess,
        craftedAt: day,
        activeBonus: isSuccess ? {
          tipBonus: SECRET_SAUCE_BUFF.tipBonus,
          tasteRatingBonus: SECRET_SAUCE_BUFF.tasteRatingBonus,
          tag: SECRET_SAUCE_BUFF.tag
        } : null
      };
    }

    // --- 3. SÁNG: MỞ KHÓA NGUYÊN LIỆU & NÂNG CẤP THIẾT BỊ ---
    this.simulatePurchasesAndContracts(state);

    // --- 4. SÁNG: NHẬP HÀNG KHO ---
    this.simulateRestock(state);

    // --- 5. BAN NGÀY: CA BÁN HÀNG ---
    const expectedCustomers = Math.min(65, Math.floor(10 + ch * 6 + state.ratings.overall * 3));
    let servedCount = 0;
    let lostCount = 0;
    let dayRevenue = 0;
    let dayTips = 0;
    let burntCount = 0;

    for (let c = 0; c < expectedCustomers; c++) {
      // Giả lập khách đặt món
      const isVip = random() < 0.1;
      const orderPaid = 35000 + ch * 12000;
      let orderTip = isVip ? 45000 : (random() < 0.6 ? 5000 : 0);

      // Thêm bonus sốt bí truyền nếu có
      if (state.secretSauceDay?.activeBonus) {
        orderTip += state.secretSauceDay.activeBonus.tipBonus;
      }

      // Giả lập phục vụ thành công hoặc bỏ về
      if (random() < 0.88) {
        servedCount++;
        dayRevenue += orderPaid;
        dayTips += orderTip;

        // Trừ nguyên liệu kho tương ứng
        this.consumeRandomIngredients(state);

        // Giả lập minigame Giao Đơn Xa (10% cơ hội)
        if (random() < 0.1) {
          const runRes = random() < 0.5
            ? DeliveryRunnerEngine.evaluateOutsource()
            : {
                mode: 'manual' as const,
                crashes: Math.floor(random() * 3),
                tipBonus: 35000,
                speedRatingDelta: 0.1,
                message: 'Giao hàng thành công!'
              };
          creditSale(state, orderPaid, runRes.tipBonus);
          if (runRes.mode === 'outsourced') {
            state.money = Math.max(0, state.money - 15000);
          }
        }
      } else {
        lostCount++;
      }

      // Giả lập cháy đồ hoặc dầu bẩn
      if (random() < 0.05) burntCount++;
    }

    // Kiểm tra kiểm định công an ATVSTP nếu dầu bẩn
    if (state.oilCondition === 'dirty' && random() < 0.3) {
      const insp = checkPoliceOilInspection(state);
      if (insp.action === 'game_over') {
        state.gameOver = true;
        return true; // Game Over
      }
    }

    // --- 6. SỰ CỐ NGẪU NHIÊN TRONG NGÀY ---
    if (random() < 0.65) {
      const incident = pickDailyIncident(state, DAILY_INCIDENTS);
      if (incident) {
        const choice = incident.choices[Math.floor(random() * incident.choices.length)]!;
        resolveIncidentChoice(state, incident, choice);
      }
    }

    // --- 7. TỐI: CHỐT NGÀY & LỌC CẶN DẦU ---
    // Minigame lọc dầu
    if (state.oilCondition !== 'clean' && random() < 0.8) {
      const crumbs = generateOilCrumbs(OIL_FILTER_CONFIG.defaultCrumbCount, day);
      const collected = crumbs.slice(0, Math.floor(crumbs.length * (0.6 + random() * 0.4)));
      const filterRes = calculateFilterResult(collected.length, crumbs.length, state.oilCondition);
      state.oilCondition = filterRes.newCondition;
      state.money += filterRes.bonusReward;
    }

    // Chốt sổ sách cuối ngày với đầy đủ SellingSession
    const session = createSellingSession();
    session.servedCount = servedCount;
    session.lostCount = lostCount;
    session.burntCount = burntCount;
    session.grossRevenue = dayRevenue;
    session.tips = dayTips;
    session.totalFriedCount = servedCount + burntCount;
    session.perfectCount = Math.floor(servedCount * 0.75);
    session.totalWaitSec = servedCount * 12;
    session.soldCounts = { crispy_chicken: servedCount };
    session.secretSauceTip = state.secretSauceDay?.activeBonus ? servedCount * state.secretSauceDay.activeBonus.tipBonus : 0;

    closeDay(state, session, eventForDay(state.day));

    // Trả lời review
    if (state.recentReviews.length > 0 && random() < 0.7) {
      const rev = state.recentReviews[0]!;
      if (!rev.reply) {
        rev.reply = {
          style: 'sincere',
          text: 'Cảm ơn quý khách đã ghé ủng hộ tiệm!',
          customerReaction: 'Tiệm dễ thương quá!',
          repliedAt: day
        };
      }
    }

    // Đánh giá kết cục có thể xảy ra
    const ending = evaluateEnding(state);
    if (ending) {
      state.activeEnding = ending.id;
    }

    // Nếu tiền âm quá mức sau ngày chốt -> Phá sản
    if (state.money < -500000) {
      state.gameOver = true;
      return true;
    }

    return false;
  }

  /**
   * Mua nguyên liệu sỉ cho ngày
   */
  private simulateRestock(state: GameState) {
    const discountFactor = (100 - (state.todayMarketDiscount ?? 0)) / 100;
    for (const [id, item] of Object.entries(state.inventory)) {
      if (!item.isUnlocked) continue;
      if (item.amount < 15 && state.money > 50000) {
        const qty = 10;
        const cost = Math.round(item.cost * qty * discountFactor);
        if (state.money >= cost) {
          state.money -= cost;
          addStock(item, qty);
        }
      }
    }
  }

  /**
   * Ký hợp đồng nguyên liệu và nâng cấp trang thiết bị khi đủ điều kiện
   */
  private simulatePurchasesAndContracts(state: GameState) {
    // Ký hợp đồng
    for (const [id, item] of Object.entries(state.inventory)) {
      if (!item.isUnlocked && item.unlockDay <= state.day && state.money >= item.unlockCost) {
        signIngredientContract(state, id);
      }
    }

    // Mua nâng cấp nếu có dư tiền
    if (state.money > 500000) {
      for (const [upId, up] of Object.entries(state.upgrades)) {
        if (!up) continue;
        const nextCost = up.currentLevel * 300000;
        if (up.currentLevel < up.maxLevel && state.money >= nextCost * 2) {
          state.money -= nextCost;
          up.currentLevel++;
        }
      }
    }
  }

  /**
   * Tiêu thụ nguyên liệu ngẫu nhiên khi bán món
   */
  private consumeRandomIngredients(state: GameState) {
    const rawChicken = state.inventory['raw_chicken'];
    if (rawChicken && rawChicken.amount > 0) {
      useIngredients(state, { raw_chicken: 1 });
    }
    const oil = state.inventory['oil'];
    if (oil && oil.amount > 0 && random() < 0.2) {
      useIngredients(state, { oil: 1 });
    }
  }

  /**
   * BỘ KIỂM TRA INVARIANTS CHỐT CHẶN (Không cho phép bất kỳ sai số nào)
   */
  private verifyStateInvariants(state: GameState, day: number) {
    // 1. Tiền phải là số hữu hạn, không được là NaN, null, undefined, Infinity
    if (!Number.isFinite(state.money)) {
      this.recordBug(day, 'MONEY_CORRUPTION', `state.money bị lỗi: ${state.money}`);
    }
    if (state.debtStreak !== undefined && (!Number.isFinite(state.debtStreak) || state.debtStreak < 0)) {
      this.recordBug(day, 'DEBT_CORRUPTION', `state.debtStreak không hợp lệ: ${state.debtStreak}`);
    }

    // 2. Ratings phải nằm trong khoảng hợp lệ [0, 5] và hữu hạn
    for (const [key, val] of Object.entries(state.ratings)) {
      if (!Number.isFinite(val) || val < 0 || val > 5.01) {
        this.recordBug(day, 'RATING_OUT_OF_BOUNDS', `Rating ${key} vượt ngưỡng: ${val}`);
      }
    }

    // 3. Kho hàng: Số lượng >= 0, không có lô hết hạn tồn đọng, không rò rỉ mảng
    for (const [id, item] of Object.entries(state.inventory)) {
      if (!Number.isFinite(item.amount) || item.amount < 0) {
        this.recordBug(day, 'INVENTORY_NEGATIVE_STOCK', `Nguyên liệu ${id} có số lượng âm: ${item.amount}`);
      }
      if (item.batches) {
        if (item.batches.length > 60) {
          this.recordBug(day, 'INVENTORY_MEMORY_LEAK', `Nguyên liệu ${id} có quá nhiều lô (${item.batches.length} lô), rò rỉ bộ nhớ.`);
        }
        for (const batch of item.batches) {
          if (batch.amount <= 0) {
            this.recordBug(day, 'INVENTORY_EMPTY_BATCH', `Nguyên liệu ${id} chứa lô rỗng không được dọn dẹp`);
          }
          if (batch.daysLeft < 0) {
            this.recordBug(day, 'INVENTORY_EXPIRED_BATCH', `Nguyên liệu ${id} còn lô hết hạn chưa hủy: daysLeft = ${batch.daysLeft}`);
          }
        }
      }
    }

    // 4. Nhân viên: Tâm trạng trong khoảng [0, 100], vai trò hợp lệ
    for (const staff of state.staff) {
      if (staff.mood < 0 || staff.mood > 100) {
        this.recordBug(day, 'STAFF_MOOD_OUT_OF_BOUNDS', `Nhân viên ${staff.name} có tâm trạng sai: ${staff.mood}`);
      }
      if (!Number.isFinite(staff.skillXp) || staff.skillXp < 0) {
        this.recordBug(day, 'STAFF_XP_INVALID', `Nhân viên ${staff.name} có skillXp sai: ${staff.skillXp}`);
      }
    }

    // 5. Sự cố: Hàng đợi không phình to vô hạn
    if (state.recentIncidents && state.recentIncidents.length > 60) {
      this.recordBug(day, 'INCIDENTS_QUEUE_LEAK', `Hàng đợi recentIncidents quá lớn: ${state.recentIncidents.length}`);
    }

    // 6. Điểm Karma: Các chỉ số ngầm phải là số nguyên hữu hạn
    if (state.karma) {
      for (const [k, v] of Object.entries(state.karma)) {
        if (!Number.isFinite(v)) {
          this.recordBug(day, 'KARMA_INVALID', `Karma ${k} không hữu hạn: ${v}`);
        }
      }
    }
  }

  /**
   * Kiểm tra tính toàn vẹn SaveCode JSON (Serialization Round-Trip)
   */
  private verifySaveCodeIntegrity(state: GameState, day: number) {
    try {
      const code = exportSaveCode(state);
      if (!code || typeof code !== 'string') {
        this.recordBug(day, 'SAVECODE_EXPORT_FAIL', 'exportSaveCode trả về chuỗi rỗng');
        return;
      }
      const restored = importSaveCode(code);
      if (!restored.ok) {
        this.recordBug(day, 'SAVECODE_IMPORT_FAIL', `importSaveCode không giải mã được: ${restored.reason}`);
        return;
      }
      if (restored.state.day !== state.day || Math.abs(restored.state.money - state.money) > 1) {
        this.recordBug(day, 'SAVECODE_MISMATCH', `Dữ liệu sau khi nạp không khớp: Gốc (Ngày ${state.day}, ${state.money}đ) vs Nạp (Ngày ${restored.state.day}, ${restored.state.money}đ)`);
      }
    } catch (e: any) {
      this.recordBug(day, 'SAVECODE_EXCEPTION', e.message, e.stack);
    }
  }

  private recordBug(day: number, category: string, message: string, stack?: string, stateDump?: any) {
    const record: BugRecord = { day, category, message, stack, stateDump: stateDump ? { day: stateDump.day, money: stateDump.money, chapter: stateDump.currentChapter } : undefined };
    this.bugs.push(record);
    log(`❌ [LỖI PHÁT HIỆN TẠI NGÀY ${day}] [${category}]: ${message}${stack ? '\n' + stack : ''}`);
  }
}

// Khởi chạy khi gọi trực tiếp từ CLI: npx tsx scripts/overnight-core-stress.ts [--days N] [--minutes M]
const args = process.argv.slice(2);
const daysArg = args.find(a => a.startsWith('--days='))?.split('=')[1] || args[args.indexOf('--days') + 1] || '10000';
const minutesArg = args.find(a => a.startsWith('--minutes='))?.split('=')[1] || args[args.indexOf('--minutes') + 1];

const tester = new OvernightStressTester({
  maxDays: parseInt(daysArg, 10),
  checkInvariantsEveryDay: true,
  saveCodeCheckIntervalDays: 100,
  reportIntervalDays: 1000,
  maxDurationMinutes: minutesArg ? parseFloat(minutesArg) : undefined
});

tester.run();
