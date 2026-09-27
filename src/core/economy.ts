import { staffEffects } from './staff';
import { karmaEffects } from './karmaEffects';
import { averagePriceRatio, customerMultiplierFromPrice } from './pricing';
import { GameState, DayLedger } from '../types/game';
import { upgradeEffects } from './upgrades';
import { BASE_APP_COMMISSION } from './staff';
import { CONDIMENT_COST, GAS_PER_BATCH, ServiceCounts, businessForm, computeTaxes, packagingCost } from './accounting';
import { GAME_HOUR_MS, OFF_PEAK_HOURS, RUSH_HOURS, isWeekend, WEEKEND_CUSTOMER_MULTIPLIER } from './clock';

export class EconomyEngine {
  // Tính toán lượng khách dự kiến trong ngày
  public static calculateDailyCustomerCount(state: GameState, weatherMultiplier: number = 1.0): number {
    // Khách nền theo từng chương
    const baseCustomersPerChapter: { [key: number]: number } = {
      1: 10, // mô phỏng (npm run sim): 12 → qua Chương 1 ngày 16 khi giỏ hàng có món kèm + nước (27/09); 10 → ~ngày 20
      2: 40, // mô phỏng: 28 khách thì phụ bếp không có việc, Chương 2 không qua nổi trong 35 ngày
      3: 65,
      4: 75,
      5: 140
    };

    const base = baseCustomersPerChapter[state.currentChapter] || 16;
    
    // Hệ số đánh giá sao (GDD: 3 sao ≈ 0.6x, 4 sao ≈ 1.0x, 4.8 sao trở lên ≈ 1.6x)
    const stars = state.ratings.overall;
    let starMultiplier = 1.0;
    if (stars <= 3.0) {
      starMultiplier = 0.6 + (stars - 1) * 0.15;
    } else if (stars <= 4.0) {
      starMultiplier = 0.6 + (stars - 3.0) * 0.4; // 3.0 -> 0.6x, 4.0 -> 1.0x
    } else {
      starMultiplier = 1.0 + (stars - 4.0) * 0.75; // 4.0 -> 1.0x, 4.8 -> 1.6x
    }

    // Nâng cấp có ghi "+% khách" (Marketing, App giao hàng, Không gian check-in…)
    // Nhân viên Idol TikTok cũng kéo khách tới
    // + Tham Vọng (karma): quảng bá mạnh tay → thêm khách
    const marketingMultiplier = 1.0 + (upgradeEffects(state.upgrades).customersPct + staffEffects(state.staff).customersPct + karmaEffects(state.karma).customersPct) / 100;

    // Thứ Bảy, Chủ Nhật khách đông hơn ngày thường
    const weekendMultiplier = isWeekend(state.day) ? WEEKEND_CUSTOMER_MULTIPLIER : 1;

    // Tiếng giá của quán: đắt → ít người ghé, rẻ → đông hơn (core/pricing.ts)
    const priceMultiplier = customerMultiplierFromPrice(averagePriceRatio(state));

    // Giang hồ đe dọa: khách sợ không dám ghé (chưa trả tiền mặt bằng)
    const gangsterMultiplier = (state.gangsterThreatDays ?? 0) > 0 ? 0.7 : 1;

    // Dầu đen carry-over: tiếng xấu lan → ít khách hơn
    const oilRepMultiplier = (state.dirtyOilPenaltyDays ?? 0) > 0 ? 0.9 : 1;

    const total = Math.round(base * starMultiplier * marketingMultiplier * weatherMultiplier * weekendMultiplier * priceMultiplier * gangsterMultiplier * oilRepMultiplier);
    return Math.max(8, total);
  }

  private static readonly RUSH_RATE_FACTOR = 1.75; // giờ cao điểm khách đến dày gấp 1,75

  // Khoảng cách (ms thời gian game) giữa hai lượt khách sao cho cả ngày ra đúng `expectedCustomers`.
  public static spawnIntervalMs(expectedCustomers: number, isRushHour: boolean): number {
    const offPeakPerHour = expectedCustomers / (OFF_PEAK_HOURS + RUSH_HOURS * this.RUSH_RATE_FACTOR);
    const perHour = isRushHour ? offPeakPerHour * this.RUSH_RATE_FACTOR : offPeakPerHour;
    return GAME_HOUR_MS / perHour;
  }

  // Tiền mặt bằng và điện nước theo ngày
  public static getOverheadCosts(chapter: number): { rent: number; utilities: number } {
    switch (chapter) {
      case 1:
        return { rent: 0, utilities: 25000 }; // Vỉa hè không mất tiền mặt bằng
      case 2:
        return { rent: 150000, utilities: 60000 }; // Tiệm trong hẻm
      case 3:
        return { rent: 350000, utilities: 110000 }; // Mặt tiền phố (mô phỏng: 500k+160k → Chương 3 lỗ)
      case 4:
        return { rent: 1100000, utilities: 350000 }; // Tiệm hot trend (mô phỏng: 1,5tr + thuế công ty → Chương 4 chậm 4 ngày)
      case 5:
        return { rent: 2400000, utilities: 600000 }; // Chuỗi 5 chi nhánh (mô phỏng: 5,45tr/ngày → Chương 5 lỗ)
      default:
        return { rent: 0, utilities: 25000 };
    }
  }

  // Tính lương nhân viên cuối ngày
  public static calculateTotalWages(state: GameState): number {
    let total = 0;
    state.staff.forEach(staff => {
      // 1 ca làm kéo dài 8 giờ
      total += staff.hourlyWage * 8;
    });
    return total;
  }

  // Khoản trừ ví lúc đóng cửa: những gì CHƯA được trả trong ngày. Doanh thu + tip đã vào ví khi giao món,
  // nguyên liệu trả lúc nhập kho, dầu trả lúc thay, hàng hết hạn là hàng đã trả tiền: chỉ hiện trong P&L.
  public static closingCharges(ledger: DayLedger): number {
    return ledger.wages + ledger.rent + ledger.utilities + ledger.appCommissions + (ledger.fines ?? 0)
      + (ledger.cogsPackaging ?? 0) + (ledger.cogsCondiments ?? 0) + (ledger.gasCost ?? 0) + (ledger.maintenance ?? 0)
      + (ledger.taxVat ?? 0) + (ledger.taxPit ?? 0) + (ledger.taxCit ?? 0);
  }

  // Báo cáo tài chính cuối ngày (P&L, core/accounting.ts). netProfit = lãi SAU thuế, chỉ để hiển thị.
  public static finalizeDayLedger(input: DayLedgerInput): DayLedger {
    const {
      day, chapter, tips, ingredientCost, wasteCost, wages, fines = 0,
      commissionRate = BASE_APP_COMMISSION, // shipper nhà giảm hoa hồng app (core/staff.ts)
      overheadPct = 0                       // Tham Vọng (karma): mặt bằng, điện nước đội lên
    } = input;
    const revenueCounter = input.revenueCounter;
    const revenueDelivery = input.revenueDelivery ?? 0;
    const grossRevenue = revenueCounter + revenueDelivery;
    const base = this.getOverheadCosts(chapter);
    const rent = Math.round(base.rent * (1 + overheadPct / 100));
    const utilities = Math.round(base.utilities * (1 + overheadPct / 100));
    const appCommissions = Math.round(revenueDelivery * commissionRate); // hoa hồng sàn chỉ tính đơn app

    const counts = input.counts ?? { counterOrders: 0, deliveryOrders: 0, cups: 0, squirts: 0 };
    const cogsPackaging = packagingCost(counts);
    const cogsCondiments = counts.squirts * CONDIMENT_COST;
    const oilCost = input.oilCost ?? 0;
    const gasCost = (input.friedBatches ?? 0) * GAS_PER_BATCH;
    const maintenance = input.maintenance ?? 0;
    const cogs = ingredientCost + cogsPackaging + cogsCondiments + oilCost;

    const preTaxProfit = grossRevenue + tips - cogs - wasteCost
      - (wages + rent + utilities + gasCost + appCommissions + maintenance) - fines;
    const form = businessForm(chapter);
    const tax = computeTaxes(form, grossRevenue, cogs, preTaxProfit);
    const netProfit = preTaxProfit - tax.vat - tax.pit - tax.cit;

    return {
      day,
      grossRevenue,
      tips,
      ingredientCost,
      wasteCost,
      wages,
      rent,
      utilities,
      appCommissions,
      fines,
      netProfit,
      customersServed: input.servedCount,
      customersLost: input.lostCount,
      burntCount: input.burntCount,
      topSellerId: input.topSellerId,
      businessForm: form,
      revenueCounter,
      revenueDelivery,
      cogsCondiments,
      cogsPackaging,
      oilCost,
      gasCost,
      maintenance,
      burntWaste: input.burntWaste ?? 0,
      preTaxProfit,
      taxVat: tax.vat,
      taxPit: tax.pit,
      taxCit: tax.cit
    };
  }
}

export interface DayLedgerInput {
  day: number;
  chapter: number;
  revenueCounter: number;   // doanh thu tại quầy (thực thu, sau khi trừ nửa giá món cháy)
  revenueDelivery?: number; // doanh thu đơn app
  tips: number;
  ingredientCost: number;
  wasteCost: number;        // hàng hết hạn bỏ đi
  wages: number;
  servedCount: number;
  lostCount: number;
  burntCount: number;
  topSellerId: string;
  fines?: number;
  commissionRate?: number;
  overheadPct?: number;
  counts?: ServiceCounts;   // số đơn theo kênh, số ly, số lần xịt tương → bao bì + tương
  oilCost?: number;
  friedBatches?: number;
  maintenance?: number;
  burntWaste?: number;
}
