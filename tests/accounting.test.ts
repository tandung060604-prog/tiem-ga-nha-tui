import { describe, it, expect, beforeAll } from 'vitest';
import { EconomyEngine } from '../src/core/economy';
import { businessForm, computeTaxes, financialLedger, maintenanceCost, PACKAGING_COST, CONDIMENT_COST, GAS_PER_BATCH } from '../src/core/accounting';
import { closeDay, eventForDay, serveFirstOrder, creditSale, changeOil, OIL_CHANGE_COST, cleanserTasteBonus } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { audio } from '../src/core/audio';
import { CustomerOrder, DayLedger, TrayItem } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

const base = { day: 1, tips: 0, ingredientCost: 0, wasteCost: 0, wages: 0, servedCount: 1, lostCount: 0, burntCount: 0, topSellerId: 'x' };

describe('thuế theo hình thức kinh doanh', () => {
  it('Chương 1–3 là hộ kinh doanh, Chương 4–5 là công ty', () => {
    expect([1, 2, 3, 4, 5].map(businessForm)).toEqual(['household', 'household', 'household', 'company', 'company']);
  });

  it('hộ kinh doanh: VAT 3% + TNCN 1,5% doanh thu, tip không chịu thuế', () => {
    const l = EconomyEngine.finalizeDayLedger({ ...base, chapter: 2, revenueCounter: 1_000_000, tips: 300_000 });
    expect(l.taxVat).toBe(30_000);
    expect(l.taxPit).toBe(15_000);
    expect(l.taxCit).toBe(0);
    expect(l.netProfit).toBe(l.preTaxProfit! - 45_000);
  });

  it('công ty: VAT 8/108 phần giá trị tăng thêm, TNDN 17% lãi sau VAT', () => {
    const t = computeTaxes('company', 1_080_000, 80_000, 500_000);
    expect(t.vat).toBe(Math.round(1_000_000 * 0.08 / 1.08));
    expect(t.cit).toBe(Math.round((500_000 - t.vat) * 0.17));
    expect(t.pit).toBe(0);
  });

  it('công ty lỗ trong ngày thì không nộp TNDN', () => {
    const l = EconomyEngine.finalizeDayLedger({ ...base, chapter: 4, revenueCounter: 100_000 });
    expect(l.preTaxProfit!).toBeLessThan(0);
    expect(l.taxCit).toBe(0);
  });
});

describe('chi phí mới trong sổ', () => {
  it('bao bì theo kênh + ly, tương, gas, hoa hồng chỉ trên đơn app', () => {
    const l = EconomyEngine.finalizeDayLedger({
      ...base, chapter: 3, revenueCounter: 400_000, revenueDelivery: 600_000, commissionRate: 0.22,
      counts: { counterOrders: 4, deliveryOrders: 3, cups: 5, squirts: 2 }, friedBatches: 10
    });
    expect(l.cogsPackaging).toBe(4 * PACKAGING_COST.counter + 3 * PACKAGING_COST.delivery + 5 * PACKAGING_COST.cup);
    expect(l.cogsCondiments).toBe(2 * CONDIMENT_COST);
    expect(l.gasCost).toBe(10 * GAS_PER_BATCH);
    expect(l.appCommissions).toBe(132_000);
    expect(l.grossRevenue).toBe(1_000_000);
  });

  it('bảo trì tăng theo thiết bị đã mua', () => {
    const s = createInitialState();
    const before = maintenanceCost(3, s.upgrades);
    s.upgrades.kitchen!.currentLevel = 3;
    expect(maintenanceCost(3, s.upgrades)).toBeGreaterThan(before);
  });

  it('báo cáo nhóm đọc được sổ cũ chưa có trường P&L', () => {
    const old: DayLedger = { ...base, grossRevenue: 500_000, tips: 0, ingredientCost: 100_000, wasteCost: 0, rent: 0, utilities: 25_000, appCommissions: 0, netProfit: 375_000 } as DayLedger;
    const f = financialLedger(old);
    expect(f.revenue.counter).toBe(500_000);
    expect(f.tax.total).toBe(0);
    expect(f.netProfit).toBe(375_000);
  });
});

describe('dòng tiền không trừ giá vốn hai lần', () => {
  it('ví sau ngày = ví đầu + tiền bán + tip − các khoản đóng cửa', () => {
    const s = createInitialState();
    s.tutorialDone = true;
    const session = createSellingSession();
    const order: CustomerOrder = {
      id: 'o1', customerName: 'A', avatar: '', isDelivery: false, patienceMax: 30, patienceCurrent: 30, totalPrice: 60_000, startTime: 0,
      items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }, { menuItemId: 'soda', count: 1, served: 0, completed: false }]
    };
    session.orders.push(order);
    const tray: TrayItem[] = [
      { id: 't1', menuItemId: 'crispy_chicken', name: '', icon: '', quality: 'good', condiment: 'ketchup' },
      { id: 't2', menuItemId: 'soda', name: '', icon: '', quality: 'good' }
    ];
    const start = s.money;
    const r = serveFirstOrder(session, tray, () => 35_000, i => tray.splice(i, 1));
    expect(r.kind).toBe('complete');
    if (r.kind === 'complete') creditSale(s, r.paid, r.tip);
    expect(session.counterOrders).toBe(1);
    expect(session.cups).toBe(1);
    expect(session.squirts).toBe(1);
    const afterSales = s.money;
    const { ledger } = closeDay(s, session, eventForDay(s.day));
    expect(s.money).toBe(afterSales - EconomyEngine.closingCharges(ledger));
    expect(afterSales - start).toBe(ledger.grossRevenue + ledger.tips);
    expect(ledger.cogsPackaging).toBe(PACKAGING_COST.counter + PACKAGING_COST.cup);
  });

  it('thay dầu trả ngay, ghi vào giá vốn của ngày, không trừ lần nữa lúc đóng cửa', () => {
    const s = createInitialState();
    const start = s.money;
    expect(changeOil(s)).toBe(true);
    expect(s.money).toBe(start - OIL_CHANGE_COST);
    const { ledger } = closeDay(s, createSellingSession(), eventForDay(s.day));
    expect(ledger.oilCost).toBe(OIL_CHANGE_COST);
    expect(EconomyEngine.closingCharges(ledger)).not.toBeGreaterThan(ledger.utilities + ledger.rent + (ledger.maintenance ?? 0) + 10);
    expect(s.todayOilCost).toBe(0);
  });
});

describe('món giải ngấy', () => {
  it('sao Hương vị +0,05/ngày × tỉ lệ đơn gà rán có củ cải / bắp cải', () => {
    expect(cleanserTasteBonus({ friedMainOrders: 10, cleanserOrders: 5 })).toBeCloseTo(0.025);
    expect(cleanserTasteBonus({ friedMainOrders: 0, cleanserOrders: 0 })).toBe(0);
  });
});

import { renderPnl } from '../src/ui/components/SummaryModal';

describe('bảng P&L cuối ngày', () => {
  it('hiện hình thức kinh doanh, lãi trước thuế, thuế và lợi nhuận ròng', () => {
    const l = EconomyEngine.finalizeDayLedger({ ...base, chapter: 1, revenueCounter: 200_000, tips: 10_000, burntWaste: 17_500 });
    const html = renderPnl(l);
    expect(html).toContain('Hộ kinh doanh · thuế khoán 4,5% doanh thu');
    expect(html).toContain('Lãi trước thuế');
    expect(html).toContain('Thuế TNCN (1,5% doanh thu)');
    expect(html).toContain('giao món cháy');
    expect(html).toContain('LỢI NHUẬN RÒNG');
    expect(renderPnl(EconomyEngine.finalizeDayLedger({ ...base, chapter: 5, revenueCounter: 5_000_000 }))).toContain('Công ty TNHH');
  });
});
