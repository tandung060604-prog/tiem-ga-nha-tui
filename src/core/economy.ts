import { staffEffects } from './staff';
import { karmaEffects } from './karmaEffects';
import { averagePriceRatio, customerMultiplierFromPrice } from './pricing';
import { GameState, DayLedger } from '../types/game';
import { upgradeEffects } from './upgrades';
import { BASE_APP_COMMISSION } from './staff';
import { CONDIMENT_COST, GAS_PER_BATCH, ServiceCounts, businessForm, computeTaxes, packagingCost } from './accounting';
import { GAME_HOUR_MS, OFF_PEAK_HOURS, RUSH_HOURS, isWeekend, WEEKEND_CUSTOMER_MULTIPLIER } from './clock';

export class EconomyEngine {
  // Tính toán lượng khách dự kiến trong ngày - Biến thiên theo Mặt bằng chương, Thứ trong tuần và Nâng cấp
  public static calculateDailyCustomerCount(state: GameState, weatherMultiplier: number = 1.0): number {
    const chapter = state.currentChapter || 1;
    const uEffects = upgradeEffects(state.upgrades);
    const day = state.day;

    // 1. Khách nền biến thiên theo Mặt bằng từng chương & Không gian quán
    let base = 10;
    if (chapter === 1) {
      // Chương 1: Xe đẩy vỉa hè (10 - 13 khách) - Tăng khi nâng cấp mái che, đèn LED xe đẩy
      const cartLevel = typeof state.upgrades?.cart === 'object' ? (state.upgrades.cart.currentLevel ?? 1) : 1;
      base = 10 + (cartLevel >= 3 ? 3 : cartLevel >= 2 ? 1 : 0);
    } else if (chapter === 2) {
      // Chương 2: Tiệm nhỏ trong hẻm (16 - 24 khách) - Tăng dần theo thâm niên mở tiệm & Không gian bàn ghế
      const daysInCh2 = Math.max(0, day - 20);
      const dayBonus = Math.min(8, Math.floor(daysInCh2 * 0.8));
      const spaceBonus = Math.min(3, Math.floor((uEffects.pricePremiumPct || 0) / 10));
      base = 16 + dayBonus + spaceBonus;
    } else if (chapter === 3) {
      // Chương 3: Mặt tiền phố hẻm (22 - 30 khách) - Mặt bằng 2 gian thoáng đãng, vỉa hè rộng
      const daysInCh3 = Math.max(0, day - 50);
      const dayBonus = Math.min(6, Math.floor(daysInCh3 * 0.4));
      const spaceBonus = Math.min(4, Math.floor((uEffects.pricePremiumPct || 0) / 8));
      base = 22 + dayBonus + spaceBonus;
    } else if (chapter === 4) {
      // Chương 4: Bistro hiện đại (28 - 38 khách) - Không gian máy lạnh, nhiều bàn phục vụ
      const daysInCh4 = Math.max(0, day - 90);
      const dayBonus = Math.min(6, Math.floor(daysInCh4 * 0.3));
      const spaceBonus = Math.min(5, Math.floor((uEffects.pricePremiumPct || 0) / 6));
      base = 28 + dayBonus + spaceBonus;
    } else {
      // Chương 5: Đại bản doanh chuỗi 5 chi nhánh (34 - 46 khách) - Công suất lớn có nhân sự gánh vác
      const daysInCh5 = Math.max(0, day - 140);
      const dayBonus = Math.min(8, Math.floor(daysInCh5 * 0.25));
      const spaceBonus = Math.min(6, Math.floor((uEffects.pricePremiumPct || 0) / 5));
      base = 34 + dayBonus + spaceBonus;
    }

    // 2. Hệ số Thứ Trong Tuần (Biến thiên nhịp sống Sài Gòn chân thực)
    // Thứ 2: đầu tuần nhẹ nhàng (0.95x); Thứ 3-6: ngày thường ổn định (1.0x); Thứ 7 & CN: cuối tuần bùng nổ (WEEKEND_CUSTOMER_MULTIPLIER = 1.4x)
    const dayOfWeek = (((day - 1) % 7) + 7) % 7; // 0 = Thứ 2, 4 = Thứ 6, 5 = Thứ 7, 6 = CN
    const weekdayMultiplier = isWeekend(day) ? WEEKEND_CUSTOMER_MULTIPLIER : (dayOfWeek === 0 ? 0.95 : 1.0);
    
    // 3. Hệ số đánh giá sao của quán (GDD: 3 sao ≈ 0.6x, 4 sao ≈ 1.0x, 4.8 sao trở lên ≈ 1.4x)
    const stars = state.ratings.overall;
    let starMultiplier = 1.0;
    if (stars <= 3.0) {
      starMultiplier = 0.6 + (stars - 1) * 0.15;
    } else if (stars <= 4.0) {
      starMultiplier = 0.6 + (stars - 3.0) * 0.4;
    } else {
      starMultiplier = 1.0 + (stars - 4.0) * 0.75; // 4.0 -> 1.0x, 4.8 -> 1.6x
    }

    // 4. Nâng cấp có ghi "+% khách" (Marketing, App giao hàng, Nhân viên, Karma)
    const marketingMultiplier = 1.0 + (uEffects.customersPct + staffEffects(state.staff).customersPct + karmaEffects(state.karma).customersPct) / 100;

    // 5. Tiếng giá của quán: đắt → ít người ghé, rẻ → đông hơn (core/pricing.ts)
    const priceMultiplier = customerMultiplierFromPrice(averagePriceRatio(state));

    // 6. Giang hồ & Dầu đen
    const gangsterMultiplier = (state.gangsterThreatDays ?? 0) > 0 ? 0.7 : 1;
    const oilRepMultiplier = (state.dirtyOilPenaltyDays ?? 0) > 0 ? 0.9 : 1;

    const rawTotal = Math.round(base * starMultiplier * marketingMultiplier * weatherMultiplier * weekdayMultiplier * priceMultiplier * gangsterMultiplier * oilRepMultiplier);

    // 7. Trần an toàn tối đa cho Mobile (Safe Ergonomic Ceiling) - Bảo đảm không bao giờ gây loạn trên màn hình 360-390px
    const maxSafeCapPerChapter: Record<number, number> = {
      1: 16,
      2: 28,
      3: 36,
      4: 44,
      5: 50
    };
    const maxSafeCap = maxSafeCapPerChapter[chapter] || 32;

    // Sàn tối thiểu là 3 khách để đảm bảo ngày mưa bão/giá cao vẫn phản ánh đúng tỉ lệ suy giảm
    return Math.max(3, Math.min(maxSafeCap, rawTotal));
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
