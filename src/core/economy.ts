import { staffEffects } from './staff';
import { karmaEffects } from './karmaEffects';
import { GameState, DayLedger } from '../types/game';
import { upgradeEffects } from './upgrades';
import { GAME_HOUR_MS, OFF_PEAK_HOURS, RUSH_HOURS, isWeekend, WEEKEND_CUSTOMER_MULTIPLIER } from './clock';

export class EconomyEngine {
  // Tính toán lượng khách dự kiến trong ngày
  public static calculateDailyCustomerCount(state: GameState, weatherMultiplier: number = 1.0): number {
    // Khách nền theo từng chương
    const baseCustomersPerChapter: { [key: number]: number } = {
      1: 12, // mô phỏng (npm run sim): 16 → người chơi trung bình qua Chương 1 ở ngày 9, GDD muốn ~15
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

    const total = Math.round(base * starMultiplier * marketingMultiplier * weatherMultiplier * weekendMultiplier);
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
        return { rent: 1500000, utilities: 350000 }; // Tiệm hot trend
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

  // Khoản trừ ví lúc đóng cửa. Doanh thu + tip đã vào ví khi giao món, nguyên liệu đã trả khi
  // nhập kho, hàng hết hạn là hàng đã trả tiền: cả ba chỉ để hiển thị trong netProfit.
  public static closingCharges(ledger: DayLedger): number {
    return ledger.wages + ledger.rent + ledger.utilities + ledger.appCommissions + (ledger.fines ?? 0);
  }

  // Tạo báo cáo tài chính cuối ngày (Ledger). netProfit là lãi kinh tế của ngày để hiển thị;
  // `ingredientCost` = giá vốn nguyên liệu đã dùng, `wasteCost` = giá trị hàng hết hạn bỏ đi.
  public static finalizeDayLedger(
    day: number,
    grossRevenue: number,
    tips: number,
    ingredientCost: number,
    wasteCost: number,
    wages: number,
    chapter: number,
    servedCount: number,
    lostCount: number,
    burntCount: number,
    topSellerId: string,
    fines = 0,
    commissionRate = 0.08, // shipper nhà giảm hoa hồng app (core/staff.ts)
    overheadPct = 0        // Tham Vọng (karma): mặt bằng, điện nước đội lên
  ): DayLedger {
    const base = this.getOverheadCosts(chapter);
    const overhead = { rent: Math.round(base.rent * (1 + overheadPct / 100)), utilities: Math.round(base.utilities * (1 + overheadPct / 100)) };
    const appCommissions = chapter >= 3 ? Math.round(grossRevenue * commissionRate) : 0; // hoa hồng app nếu có

    const totalIncome = grossRevenue + tips;
    const totalExpenses = ingredientCost + wasteCost + wages + overhead.rent + overhead.utilities + appCommissions + fines;
    const netProfit = totalIncome - totalExpenses;

    return {
      day,
      grossRevenue,
      tips,
      ingredientCost,
      wasteCost,
      wages,
      rent: overhead.rent,
      utilities: overhead.utilities,
      appCommissions,
      fines,
      netProfit,
      customersServed: servedCount,
      customersLost: lostCount,
      burntCount,
      topSellerId
    };
  }
}
