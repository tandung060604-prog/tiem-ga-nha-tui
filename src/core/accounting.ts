import { BusinessForm, DayLedger, FinancialLedger, UpgradeBranch } from '../types/game';

// Kế toán cuối ngày: báo cáo lãi lỗ (P&L) và thuế. Mọi con số nằm ở đây; mô phỏng: npm run sim.
//
// DÒNG TIỀN ≠ LÃI LỖ. Tiền bán + tip vào ví ngay lúc giao món, nguyên liệu trả lúc nhập kho, thay dầu trả
// lúc thay. Lúc đóng cửa ví chỉ bị trừ các khoản CHƯA trả (closingCharges ở core/economy.ts): lương, mặt bằng,
// điện nước, hoa hồng app, phạt, bao bì, tương, gas, bảo trì và thuế. Lợi nhuận ròng chỉ để hiển thị —
// cộng nó vào ví là trừ giá vốn hai lần.
//
// THUẾ LÀ LUẬT TRONG GAME, đơn giản hóa từ luật Việt Nam (không phải tư vấn thuế):
//  • Hộ kinh doanh (Chương 1–3): 4,5% doanh thu bán hàng = VAT 3% + TNCN 1,5% (tỉ lệ ngành ăn uống
//    kiểu Thông tư 40/2021). Tip khách tặng không tính. Không có lệ phí môn bài (bãi bỏ từ 2026).
//  • Công ty TNHH (Chương 4–5): VAT 8% trên phần giá trị tăng thêm (giá bán đã gồm VAT → × 8/108),
//    TNDN 17% trên lãi trước thuế (sau VAT). Ngày lỗ nộp 0, không chuyển lỗ sang ngày sau.

export const HOUSEHOLD_VAT_RATE = 0.03;
export const HOUSEHOLD_PIT_RATE = 0.015;
export const COMPANY_VAT_RATE = 0.08;
export const COMPANY_CIT_RATE = 0.17;
export const COMPANY_FROM_CHAPTER = 4;

// Phụ liệu mỗi đơn: hộp kraft + giấy thấm dầu (tại quầy) / thêm túi, hộp nắp kín (app); mỗi ly nước: ly nắp cầu + ống hút
export const PACKAGING_COST = { counter: 1500, delivery: 4000, cup: 700 } as const;
export const CONDIMENT_COST = 300;   // một lần xịt tương cà / tương ớt
export const GAS_PER_BATCH = 400;    // gas công nghiệp cho một mẻ chiên
// Bảo trì chảo, lọc dầu, vệ sinh máy rót: phần nền theo chương + khấu hao 0,2%/ngày giá thiết bị đã mua
const MAINTENANCE_BASE: Record<number, number> = { 1: 0, 2: 15000, 3: 30000, 4: 50000, 5: 100000 };
export const MAINTENANCE_UPGRADE_RATE = 0.002;

export const businessForm = (chapter: number): BusinessForm => (chapter >= COMPANY_FROM_CHAPTER ? 'company' : 'household');

export const BUSINESS_FORM_LABEL: Record<BusinessForm, string> = {
  household: 'Hộ kinh doanh · thuế khoán 4,5% doanh thu',
  company: 'Công ty TNHH · VAT 8% + TNDN 17%'
};

export function upgradeSpend(upgrades: { [id: string]: UpgradeBranch }): number {
  return Object.values(upgrades).reduce((sum, b) =>
    sum + b.tiers.filter(t => t.level <= b.currentLevel).reduce((s, t) => s + t.cost, 0), 0);
}

export function maintenanceCost(chapter: number, upgrades: { [id: string]: UpgradeBranch }): number {
  return (MAINTENANCE_BASE[chapter] ?? 0) + Math.round(upgradeSpend(upgrades) * MAINTENANCE_UPGRADE_RATE);
}

export interface ServiceCounts { counterOrders: number; deliveryOrders: number; cups: number; squirts: number }

export function packagingCost(c: ServiceCounts): number {
  return c.counterOrders * PACKAGING_COST.counter + c.deliveryOrders * PACKAGING_COST.delivery + c.cups * PACKAGING_COST.cup;
}

// `sales` = doanh thu bán hàng thực thu (không gồm tip), `cogs` = giá vốn, `preTaxProfit` = lãi trước thuế
export function computeTaxes(form: BusinessForm, sales: number, cogs: number, preTaxProfit: number): { vat: number; pit: number; cit: number } {
  if (form === 'household') {
    return { vat: Math.round(sales * HOUSEHOLD_VAT_RATE), pit: Math.round(sales * HOUSEHOLD_PIT_RATE), cit: 0 };
  }
  const vat = Math.round(Math.max(0, sales - cogs) * COMPANY_VAT_RATE / (1 + COMPANY_VAT_RATE));
  const cit = Math.round(Math.max(0, preTaxProfit - vat) * COMPANY_CIT_RATE);
  return { vat, pit: 0, cit };
}

// Báo cáo nhóm theo khoản mục cho màn tổng kết. Sổ của save cũ (chưa có các trường P&L) vẫn đọc được.
export function financialLedger(l: DayLedger): FinancialLedger {
  const counter = l.revenueCounter ?? l.grossRevenue;
  const delivery = l.revenueDelivery ?? 0;
  const burnt = l.burntWaste ?? 0;
  const cogs = {
    ingredients: l.ingredientCost,
    condiments: l.cogsCondiments ?? 0,
    packaging: l.cogsPackaging ?? 0,
    oil: l.oilCost ?? 0,
    total: 0
  };
  cogs.total = cogs.ingredients + cogs.condiments + cogs.packaging + cogs.oil;
  const opex = {
    wages: l.wages,
    rent: l.rent,
    utilities: l.utilities,
    gas: l.gasCost ?? 0,
    commission: l.appCommissions,
    maintenance: l.maintenance ?? 0,
    total: 0
  };
  opex.total = opex.wages + opex.rent + opex.utilities + opex.gas + opex.commission + opex.maintenance;
  const tax = { form: l.businessForm ?? 'household', vat: l.taxVat ?? 0, pit: l.taxPit ?? 0, cit: l.taxCit ?? 0, total: 0 };
  tax.total = tax.vat + tax.pit + tax.cit;
  const fines = l.fines ?? 0;
  const preTaxProfit = l.preTaxProfit ?? l.netProfit;
  const aid = (l.aidLoanReceived || l.aidLoanRepaid) ? {
    received: l.aidLoanReceived ?? 0,
    repaid: l.aidLoanRepaid ?? 0
  } : undefined;
  return {
    // Doanh thu gộp theo giá niêm yết: món cháy bị trả nửa giá được ghi ở dòng hao hụt
    revenue: { counter, delivery, tips: l.tips, gross: counter + delivery + burnt },
    cogs,
    opex,
    waste: { expired: l.wasteCost, burnt, total: l.wasteCost + burnt },
    fines,
    preTaxProfit,
    tax,
    netProfit: l.netProfit,
    ...(aid ? { aid } : {})
  };
}
