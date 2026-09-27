import { describe, it, expect, beforeAll } from 'vitest';
import {
  staffEffects, tickStaff, endShiftForStaff, maxStaff, extraTraySlots, missingItems, describeStaffEffect, StaffHooks, BASE_APP_COMMISSION
} from '../src/core/staff';
import { recordHelperFry, useIngredients, makeDrink, closeDay, eventForDay } from '../src/core/day';
import { CookingEngine } from '../src/core/cooking';
import { createSellingSession, SellingSession } from '../src/core/sellingSim';
import { OrdersEngine } from '../src/core/orders';
import { EconomyEngine } from '../src/core/economy';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { audio } from '../src/core/audio';
import { INITIAL_CANDIDATES } from '../src/content/staff';
import { CustomerOrder, GameState, StaffMember, StaffRole } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

const member = (role: StaffRole, extra: Partial<StaffMember> = {}): StaffMember => ({
  id: `m_${role}_${Math.random()}`, name: `NV ${role}`, role, avatar: '🧑',
  speed: 80, skill: 80, attitude: 80, stamina: 80, traits: [], hourlyWage: 28000, mood: 100, shiftsWorked: 0, ...extra
});

const stocked = (chapter = 2): GameState => {
  const s = createInitialState();
  s.currentChapter = chapter;
  for (const inv of Object.values(s.inventory)) { inv.unlocked = true; inv.amount = 50; inv.batches = [{ amount: 50, daysLeft: 5 }]; }
  return s;
};

const order = (items: [string, number][]): CustomerOrder => ({
  id: `o${Math.random()}`, customerName: 'Khách', avatar: '🙂', isDelivery: false,
  items: items.map(([menuItemId, count]) => ({ menuItemId, count, served: 0, completed: false })),
  patienceMax: 60, patienceCurrent: 60, totalPrice: 100000, startTime: 0
});

// Chạy ca bán giả: chỉ nhân viên làm việc, trả về số món phụ bếp làm ra
function runShift(state: GameState, session: SellingSession, cook: CookingEngine, ms: number) {
  const hooks: StaffHooks = {
    use: ids => useIngredients(state, session, ids),
    place: item => cook.addToTray(item),
    pour: d => makeDrink(state, session, cook, d) === 'ok',
    traySize: cook.getTraySize()
  };
  const events = [];
  for (let t = 0; t < ms; t += 100) {
    for (const e of tickStaff(session, cook.getTray(), 100, staffEffects(state.staff), null, hooks)) {
      events.push(e);
      if (e.type === 'helperDone') recordHelperFry(state, session, e.item.quality);
    }
  }
  return events;
}

describe('không có nhân viên: không có tác dụng gì', () => {
  it('hiệu ứng trung tính, hoa hồng app 8%', () => {
    const eff = staffEffects([]);
    expect(eff.cooks).toEqual([]);
    expect(eff.waiterServeMs).toBeNull();
    expect(eff.walkInPatiencePct).toBe(0);
    expect(eff.commissionRate).toBe(BASE_APP_COMMISSION);
    expect(extraTraySlots([])).toBe(0);
  });
});

describe('phụ bếp tự chiên món khách đang cần', () => {
  it('chiên đúng món còn thiếu, trừ nguyên liệu, đặt vào khay', () => {
    seedRandom(1);
    const state = stocked();
    state.staff = [member('cook')];
    const session = createSellingSession();
    session.orders = [order([['spicy_chicken', 1]])];
    const cook = new CookingEngine();
    cook.setTraySize(CookingEngine.TRAY_SIZE + extraTraySlots(state.staff));
    const before = state.inventory.spicy_sauce!.amount;

    const events = runShift(state, session, cook, 10000);

    expect(events.filter(e => e.type === 'helperDone')).toHaveLength(1); // đủ món thì dừng, không chiên thừa
    expect(cook.getTray().map(t => t.menuItemId)).toEqual(['spicy_chicken']);
    expect(state.inventory.spicy_sauce!.amount).toBe(before - 1);
    expect(session.totalFriedCount).toBe(1);
  });

  it('món ráp (burger): chiên phần gà nền', () => {
    seedRandom(2);
    const state = stocked(3);
    state.staff = [member('cook')];
    const session = createSellingSession();
    session.orders = [order([['chicken_burger', 1]])];
    const cook = new CookingEngine();
    runShift(state, session, cook, 10000);
    expect(cook.getTray().map(t => t.menuItemId)).toEqual(['crispy_chicken']);
  });

  it('không chiên trùng món đang nằm trong chảo của chủ quán', () => {
    const state = stocked();
    state.staff = [member('cook')];
    const session = createSellingSession();
    session.orders = [order([['crispy_chicken', 1]])];
    const cook = new CookingEngine();
    const hooks: StaffHooks = { use: () => true, place: i => cook.addToTray(i), pour: () => false, traySize: 4 };
    tickStaff(session, cook.getTray(), 100, staffEffects(state.staff), 'crispy_chicken', hooks);
    expect(session.helpers.filter(Boolean)).toHaveLength(0);
  });

  it('luôn chừa 1 ô khay cho chủ quán', () => {
    const state = stocked();
    state.staff = [member('cook')];
    const session = createSellingSession();
    session.orders = [order([['crispy_chicken', 6]])];
    const cook = new CookingEngine();
    runShift(state, session, cook, 60000);
    expect(cook.getTray().length).toBe(cook.getTraySize() - 1);
  });

  it('hết nguyên liệu thì đứng chờ, không tự sinh món', () => {
    const state = stocked();
    state.inventory.chicken_meat!.amount = 0;
    state.inventory.chicken_meat!.batches = [];
    state.staff = [member('cook')];
    const session = createSellingSession();
    session.orders = [order([['crispy_chicken', 1]])];
    const cook = new CookingEngine();
    runShift(state, session, cook, 20000);
    expect(cook.getTray()).toHaveLength(0);
  });

  it('tay nghề cao → nhiều Perfect hơn; mẻ phụ bếp làm dầu xuống cấp', () => {
    const good = staffEffects([member('cook', { skill: 95 })]).cooks[0]!;
    const weak = staffEffects([member('cook', { skill: 40 })]).cooks[0]!;
    expect(good.perfectChance).toBeGreaterThan(weak.perfectChance);
    const state = stocked();
    const session = createSellingSession();
    recordHelperFry(state, session, 'perfect');
    expect(state.oilBatchesCooked).toBe(1);
    expect(session.perfectCount).toBe(1);
    expect(session.perfectStreak).toBe(0); // chuỗi Perfect là của chủ quán
  });

  it('Cú Đêm chiên nhanh hơn sau 18:00; tâm trạng thấp làm chậm', () => {
    const owl = member('cook', { traits: ['night_owl'] });
    expect(staffEffects([owl], 19).cooks[0]!.cycleMs).toBeLessThan(staffEffects([owl], 12).cooks[0]!.cycleMs);
    expect(staffEffects([member('cook', { mood: 20 })]).cooks[0]!.cycleMs)
      .toBeGreaterThan(staffEffects([member('cook', { mood: 100 })]).cooks[0]!.cycleMs);
  });
});

describe('phục vụ: rót nước, tự lên món', () => {
  it('rót nước cho khách, lên món khi khay đủ', () => {
    const state = stocked();
    state.staff = [member('waiter')];
    const session = createSellingSession();
    session.orders = [order([['soda', 2]])];
    const cook = new CookingEngine();
    cook.setTraySize(CookingEngine.TRAY_SIZE + extraTraySlots(state.staff));
    const events = runShift(state, session, cook, 8000);
    expect(cook.getTray().filter(t => t.menuItemId === 'soda')).toHaveLength(2);
    expect(events.some(e => e.type === 'autoServe')).toBe(true);
  });

  it('cộng Vệ sinh cuối ngày', () => {
    const state = stocked();
    state.ratings.hygiene = 3;
    state.staff = [member('waiter')];
    closeDay(state, createSellingSession(), eventForDay(2));
    expect(state.ratings.hygiene).toBeGreaterThan(3);
  });
});

describe('thu ngân / shipper / quản lý / Idol TikTok', () => {
  it('thu ngân: khách tại quán kiên nhẫn hơn', () => {
    const base = stocked();
    const withCashier = stocked();
    withCashier.staff = [member('cashier')];
    seedRandom(5);
    const a = OrdersEngine.generateOrder(base, false);
    seedRandom(5);
    const b = OrdersEngine.generateOrder(withCashier, false);
    expect(b.patienceMax).toBeGreaterThan(a.patienceMax);
  });

  it('shipper nhà giảm hoa hồng app trong sổ cuối ngày', () => {
    const rate = staffEffects([member('delivery')]).commissionRate;
    expect(rate).toBeLessThan(BASE_APP_COMMISSION);
    const ledger = EconomyEngine.finalizeDayLedger({
      day: 1, chapter: 3, revenueCounter: 500000, revenueDelivery: 1000000, tips: 0, ingredientCost: 0, wasteCost: 0, wages: 0,
      servedCount: 10, lostCount: 0, burntCount: 0, topSellerId: 'x', commissionRate: rate
    });
    expect(ledger.appCommissions).toBe(Math.round(1000000 * rate)); // hoa hồng chỉ tính trên đơn app
    expect(ledger.appCommissions).toBeLessThan(1000000 * BASE_APP_COMMISSION);
  });

  it('quản lý tăng hiệu suất cả đội', () => {
    const c = member('cook');
    expect(staffEffects([c, member('manager')]).cooks[0]!.cycleMs).toBeLessThan(staffEffects([c]).cooks[0]!.cycleMs);
  });

  it('Idol TikTok kéo thêm khách', () => {
    const s = stocked();
    const before = EconomyEngine.calculateDailyCustomerCount(s);
    s.staff = [member('cashier', { traits: ['tiktok_idol'] })];
    expect(EconomyEngine.calculateDailyCustomerCount(s)).toBeGreaterThan(before);
  });
});

describe('sau mỗi ca / giới hạn', () => {
  it('tâm trạng giảm (quản lý giảm một nửa), tay nghề tăng dần', () => {
    const a = [member('cook', { skill: 50 })];
    for (let i = 0; i < 4; i++) endShiftForStaff(a);
    const b = [member('cook', { skill: 50 }), member('manager')];
    for (let i = 0; i < 4; i++) endShiftForStaff(b);
    expect(a[0]!.mood).toBeLessThan(100);
    expect(b[0]!.mood).toBeGreaterThan(a[0]!.mood);
    expect(a[0]!.skill).toBe(52);
    expect(a[0]!.shiftsWorked).toBe(4);
  });

  it('số nhân viên theo chương; khay thêm tối đa 2 ô', () => {
    expect(maxStaff(1)).toBe(0);
    expect(maxStaff(2)).toBe(3);
    expect(extraTraySlots([member('cook'), member('cook'), member('waiter')])).toBe(2);
  });

  it('mọi ứng viên ban đầu đều có mô tả tác dụng', () => {
    for (const c of INITIAL_CANDIDATES) expect(describeStaffEffect(c, []).length).toBeGreaterThan(10);
  });

  it('missingItems trừ món đã có trong khay, bỏ qua gà sống', () => {
    const o = order([['crispy_chicken', 2], ['soda', 1]]);
    expect(missingItems(o, [
      { id: 'a', menuItemId: 'crispy_chicken', name: '', icon: '', quality: 'perfect' },
      { id: 'b', menuItemId: 'crispy_chicken', name: '', icon: '', quality: 'raw' }
    ])).toEqual(['crispy_chicken', 'soda']);
  });
});
