import { describe, it, expect, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { upgradeEffects, MAX_PRICE_PREMIUM_PCT, AUTO_LIFT_KITCHEN_LEVEL, SELF_SERVE_OPERATIONS_LEVEL } from '../src/core/upgrades';
import { staffEffects, traySizeFor, extraTraySlots, BASE_APP_COMMISSION, tickStaff, StaffHooks, describeStaffEffect } from '../src/core/staff';
import { OrdersEngine } from '../src/core/orders';
import { EconomyEngine } from '../src/core/economy';
import { CookingEngine } from '../src/core/cooking';
import { createSellingSession } from '../src/core/sellingSim';
import { useIngredients, makeDrink, recordHelperFry } from '../src/core/day';
import { hasSecurityStaff, resolveIncidentChoice } from '../src/core/dailyIncidentsEngine';
import { renderIncidentPrompt } from '../src/ui/components/DailyIncidentModal';
import { DailyIncident, GameState, StaffMember } from '../src/types/game';
import { seedRandom } from '../src/core/rng';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

const makeStaff = (role: StaffMember['role'], extra: Partial<StaffMember> = {}): StaffMember => ({
  id: `staff_${role}_${Math.random()}`,
  name: `Nhân viên ${role}`,
  role,
  avatar: '🧑',
  speed: 80,
  skill: 80,
  attitude: 80,
  stamina: 80,
  traits: [],
  hourlyWage: 28000,
  mood: 100,
  shiftsWorked: 0,
  ...extra
});

describe('1. KIỂM THỬ THỰC TẾ: CÁC NÂNG CẤP (UPGRADES) CÓ TÁC DỤNG THẬT 100%', () => {
  it('Nhánh Bếp (Kitchen): tăng tốc chiên và kích hoạt Robot tự động nhấc giỏ ở cấp 6', () => {
    const state = createInitialState();
    expect(upgradeEffects(state.upgrades).autoLift).toBe(false);
    expect(upgradeEffects(state.upgrades).fryRampPct).toBe(0);

    // Mua bếp cấp 3: tăng tốc chiên
    state.upgrades.kitchen.currentLevel = 3;
    const effLv3 = upgradeEffects(state.upgrades);
    expect(effLv3.fryRampPct).toBe(35);
    expect(effLv3.tastePct).toBe(25);

    // Mua bếp cấp 6: Dây chuyền chiên tự động Robot
    state.upgrades.kitchen.currentLevel = AUTO_LIFT_KITCHEN_LEVEL;
    const effLv6 = upgradeEffects(state.upgrades);
    expect(effLv6.autoLift).toBe(true);

    // Kiểm tra trong ca bán: có Bếp cấp 6 thì Robot xuất hiện trong danh sách cooks tự động
    const teamEff = staffEffects([], 12, state.upgrades);
    expect(teamEff.cooks.some(c => c.staffId === 'robot')).toBe(true);
    const robot = teamEff.cooks.find(c => c.staffId === 'robot')!;
    expect(robot.perfectChance).toBe(0.95);
    expect(robot.burntChance).toBe(0); // Robot không bao giờ làm cháy gà
  });

  it('Nhánh Không Gian & Bàn Ghế (Space): Khách trả thêm tiền (+pricePremiumPct) và Mở rộng khay ra món (+traySlots)', () => {
    const plainState = createInitialState();
    const upgradedState = createInitialState();

    // Ban đầu: không có phụ thu, khay 4 ô
    expect(upgradeEffects(plainState.upgrades).pricePremiumPct).toBe(0);
    expect(traySizeFor(plainState)).toBe(4);

    // Nâng cấp Không gian cấp 2: mở rộng thêm 1 ô khay
    upgradedState.upgrades.space.currentLevel = 2;
    expect(upgradeEffects(upgradedState.upgrades).traySlots).toBe(1);
    expect(traySizeFor(upgradedState)).toBe(5);

    // Nâng cấp Không gian cấp 4 (Quán gỗ sạch đẹp): thêm 2 ô khay và phụ thu 10%
    upgradedState.upgrades.space.currentLevel = 4;
    expect(traySizeFor(upgradedState)).toBe(6);
    expect(upgradeEffects(upgradedState.upgrades).pricePremiumPct).toBe(20);

    // Kiểm chứng đơn hàng: đơn hàng ở quán có bàn ghế đẹp có tổng giá tiền cao hơn quán trơn
    seedRandom(42);
    const orderPlain = OrdersEngine.generateOrder(plainState);
    seedRandom(42);
    const orderUpgraded = OrdersEngine.generateOrder(upgradedState);
    expect(orderUpgraded.totalPrice).toBeGreaterThan(orderPlain.totalPrice);
  });

  it('Nhánh Vận Hành (Operations): Kiosk tự phục vụ (Self-serve) và App giao hàng riêng (0% hoa hồng)', () => {
    const state = createInitialState();

    // Mua Vận hành cấp 4: Kiosk tự order & tự lấy món
    state.upgrades.operations.currentLevel = SELF_SERVE_OPERATIONS_LEVEL;
    const effKiosk = upgradeEffects(state.upgrades);
    expect(effKiosk.selfServe).toBe(true);

    // Dù quán chưa thuê phục vụ nào, khách vẫn tự lấy món sau 2000ms
    const teamEffWithoutWaiter = staffEffects([], 12, state.upgrades);
    expect(teamEffWithoutWaiter.waiterServeMs).toBe(2000);

    // Mua Vận hành cấp 5: App giao hàng riêng
    state.upgrades.operations.currentLevel = 5;
    const effApp = upgradeEffects(state.upgrades);
    expect(effApp.ownDeliveryApp).toBe(true);

    // Hoa hồng sàn giao hàng giảm từ 22% về đúng 0% tròn trĩnh!
    const staffEffWithApp = staffEffects([], 12, state.upgrades);
    expect(staffEffWithApp.commissionRate).toBe(0);
  });

  it('Nhánh Marketing: Tăng số lượng khách hàng ghé quán mỗi ngày', () => {
    const baseState = createInitialState();
    baseState.currentChapter = 2;
    const baseCustomers = EconomyEngine.calculateDailyCustomerCount(baseState);

    // Nâng cấp Marketing cấp 3 (+35% lưu lượng khách)
    const marketingState = createInitialState();
    marketingState.currentChapter = 2;
    marketingState.upgrades.marketing.currentLevel = 3;
    const boostedCustomers = EconomyEngine.calculateDailyCustomerCount(marketingState);

    expect(boostedCustomers).toBeGreaterThan(baseCustomers);
  });

  it('Nhánh Kho Lạnh (Storage): Giảm giá mua sỉ nguyên liệu và Kéo dài hạn sử dụng', () => {
    const state = createInitialState();
    state.upgrades.storage.currentLevel = 3;
    const eff = upgradeEffects(state.upgrades);

    expect(eff.shelfLifeBonus).toBeGreaterThan(0); // Tăng hạn dùng thịt gà/khoai tây thêm ngày
    expect(eff.discountWholesale).toBeGreaterThan(0); // Giảm giá sỉ khi nhập kho
  });

  it('Nhánh Dịch Vụ & Vệ Sinh: Thưởng Tip tương sốt, Máy rót nước tự động, Miễn nhiễm chuột cống', () => {
    const state = createInitialState();
    state.upgrades.service.currentLevel = 3;
    state.upgrades.hygiene.currentLevel = 4;
    const eff = upgradeEffects(state.upgrades);

    expect(eff.autoDrink).toBe(true);      // Tự rót nước ngọt
    expect(eff.sauceTipBonus).toBeGreaterThan(0); // Thưởng tiền tip cho đơn có sốt
    expect(eff.pestImmunity).toBe(true);   // Miễn nhiễm chuột bọ phá hoại
  });
});

describe('2. KIỂM THỬ THỰC TẾ: NHÂN VIÊN (STAFF) CÓ TÁC DỤNG THẬT 100%', () => {
  it('Phụ Bếp (Cook): Tự động chiên đúng món thiếu cho khách, đưa vào khay, trừ nguyên liệu kho', () => {
    const state = createInitialState();
    state.currentChapter = 2;
    state.inventory.chicken_meat = {
      id: 'chicken_meat', name: 'Đùi gà', icon: '🍗', basePrice: 14000, cost: 14000,
      amount: 20, unspoilable: false, unlocked: true, batches: [{ amount: 20, daysLeft: 4 }]
    };
    state.inventory.flour = {
      id: 'flour', name: 'Bột chiên', icon: '🌾', basePrice: 4000, cost: 4000,
      amount: 20, unspoilable: true, unlocked: true, batches: [{ amount: 20, daysLeft: 99 }]
    };

    // Tuyển 1 Phụ bếp
    state.staff = [makeStaff('cook', { name: 'Minh Khang', speed: 90, skill: 85 })];

    const session = createSellingSession();
    session.orders = [{
      id: 'order_1', customerName: 'Khách Test', avatar: '🙂', isDelivery: false,
      items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }],
      patienceMax: 60, patienceCurrent: 60, totalPrice: 35000, startTime: 0
    }];

    const cookEngine = new CookingEngine();
    const hooks: StaffHooks = {
      use: ids => useIngredients(state, session, ids),
      place: item => cookEngine.addToTray(item),
      pour: () => false,
      traySize: 5
    };

    const initialChicken = state.inventory.chicken_meat.amount;

    // Chạy mô phỏng 8000ms
    for (let t = 0; t < 8000; t += 100) {
      const events = tickStaff(session, cookEngine.getTray(), 100, staffEffects(state.staff), null, hooks);
      for (const e of events) {
        if (e.type === 'helperDone') recordHelperFry(state, session, e.item.quality);
      }
    }

    // Kết quả: Đã tự chiên 1 miếng gà vào khay, trừ kho đúng 1 miếng gà & 1 phần bột
    expect(cookEngine.getTray().some(t => t.menuItemId === 'crispy_chicken')).toBe(true);
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken - 1);
    expect(session.totalFriedCount).toBe(1);
  });

  it('Phục Vụ (Waiter): Tự rót nước và TỰ ĐỘNG BẤM LÊN MÓN khi khay đủ, người chơi không cần bấm', () => {
    const state = createInitialState();
    state.currentChapter = 2;
    state.staff = [makeStaff('waiter', { name: 'Thảo Linh', speed: 85 })];

    const session = createSellingSession();
    session.orders = [{
      id: 'order_waiter', customerName: 'Khách Đợi Nước', avatar: '😋', isDelivery: false,
      items: [{ menuItemId: 'soda', count: 1, served: 0, completed: false }],
      patienceMax: 60, patienceCurrent: 60, totalPrice: 15000, startTime: 0
    }];

    const cookEngine = new CookingEngine();
    const hooks: StaffHooks = {
      use: () => true,
      place: item => cookEngine.addToTray(item),
      pour: d => makeDrink(state, session, cookEngine, d) === 'ok',
      traySize: 5
    };

    let autoServed = false;
    for (let t = 0; t < 6000; t += 100) {
      const events = tickStaff(session, cookEngine.getTray(), 100, staffEffects(state.staff), null, hooks);
      if (events.some(e => e.type === 'autoServe')) {
        autoServed = true;
      }
    }

    // Phục vụ đã tự rót soda và tự động lên món
    expect(autoServed).toBe(true);
  });

  it('Thu Ngân (Cashier): Khách ăn tại quán kiên nhẫn hơn, đợi lâu hơn mà không bỏ về', () => {
    const stateNoCashier = createInitialState();
    const stateWithCashier = createInitialState();
    stateWithCashier.staff = [makeStaff('cashier', { attitude: 90 })];

    seedRandom(123);
    const orderWithout = OrdersEngine.generateOrder(stateNoCashier, false);
    seedRandom(123);
    const orderWith = OrdersEngine.generateOrder(stateWithCashier, false);

    expect(orderWith.patienceMax).toBeGreaterThan(orderWithout.patienceMax);
  });

  it('Shipper (Delivery): Giảm hoa hồng sàn giao hàng và tăng kiên nhẫn đơn app', () => {
    const effWithout = staffEffects([]);
    const effWithShipper = staffEffects([makeStaff('delivery', { skill: 85, speed: 80 })]);

    expect(effWithShipper.commissionRate).toBeLessThan(effWithout.commissionRate);
    expect(effWithShipper.deliveryPatiencePct).toBeGreaterThan(0);
  });

  it('Quản Lý Ca (Manager): Tăng +20% hiệu suất toàn đội nhân viên', () => {
    const cook = makeStaff('cook', { speed: 70 });
    const teamWithoutManager = [cook];
    const teamWithManager = [cook, makeStaff('manager')];

    const cycleWithout = staffEffects(teamWithoutManager).cooks[0]!.cycleMs;
    const cycleWith = staffEffects(teamWithManager).cooks[0]!.cycleMs;

    // Có quản lý: chu kỳ chiên của phụ bếp rút ngắn nhanh hơn (hiệu suất cao hơn)
    expect(cycleWith).toBeLessThan(cycleWithout);
  });
});

describe('3. GIỮ XE ĐỂ LÀM GÌ? BẢO VỆ CHÚ TƯ GIẢI QUYẾT TRIỆT ĐỂ NGUY CƠ GÌ?', () => {
  it('hasSecurityStaff chỉ nhận diện bảo vệ khi tâm trạng mood > 20%', () => {
    const state = createInitialState();
    expect(hasSecurityStaff(state)).toBe(false);

    // Tuyển Chú Tư với tâm trạng tốt (100%)
    state.staff = [makeStaff('security', { name: 'Chú Tư Dân Phòng', mood: 100 })];
    expect(hasSecurityStaff(state)).toBe(true);

    // Khi Chú Tư kiệt sức / tâm trạng tụt dưới 20%
    state.staff[0]!.mood = 15;
    expect(hasSecurityStaff(state)).toBe(false);
  });

  it('Khi KHÔNG CÓ BẢO VỆ: Sự cố rủi ro (kẻ trộm gas_solo_chase) có tỷ lệ thất bại (riskRate > 0) và bị trộm mất bình gas -300k', async () => {
    const { DAILY_INCIDENTS } = await import('../src/content/dailyIncidents');
    const state = createInitialState();
    state.money = 500000;

    const gasIncident = DAILY_INCIDENTS.find(i => i.id === 'incident_thief_gas')!;
    const chaseChoice = gasIncident.choices.find(c => c.id === 'gas_solo_chase')!;

    seedRandom(0); // Roll ra 0.266 < 0.5 -> thất bại vì không có bảo vệ
    const result = resolveIncidentChoice(state, gasIncident, chaseChoice);
    expect(result.succeeded).toBe(false);
    expect(result.moneyDelta).toBe(-300000); // Mất bình gas 300.000đ
  });

  it('Khi CÓ CHÚ TƯ BẢO VỆ GIỮ XE: Tỷ lệ rủi ro = 0%, bảo vệ bình gas 100% không bị mất tiền', async () => {
    const { DAILY_INCIDENTS } = await import('../src/content/dailyIncidents');
    const state = createInitialState();
    state.money = 500000;
    // Tuyển Chú Tư Bảo Vệ
    state.staff = [makeStaff('security', { name: 'Chú Tư Dân Phòng', mood: 100 })];

    const gasIncident = DAILY_INCIDENTS.find(i => i.id === 'incident_thief_gas')!;
    const chaseChoice = gasIncident.choices.find(c => c.id === 'gas_solo_chase')!;

    seedRandom(0); // Cùng một roll rủi ro 0.266, nhưng nhờ có Chú Tư (!hasSec = false) -> KHÔNG BAO GIỜ THẤT BẠI
    const result = resolveIncidentChoice(state, gasIncident, chaseChoice);
    expect(result.succeeded).toBe(true);
    expect(result.moneyDelta).toBe(0); // Bảo vệ được bình gas thành công, không mất 300k
  });

  it('Lựa chọn độc quyền của Chú Tư (gas_sec_ambush): Tóm trộm tại trận và nhận thưởng nóng +50k', async () => {
    const { DAILY_INCIDENTS } = await import('../src/content/dailyIncidents');
    const state = createInitialState();
    state.money = 500000;
    state.staff = [makeStaff('security', { name: 'Chú Tư Dân Phòng', mood: 100 })];

    const gasIncident = DAILY_INCIDENTS.find(i => i.id === 'incident_thief_gas')!;
    const ambushChoice = gasIncident.choices.find(c => c.id === 'gas_sec_ambush')!;

    const result = resolveIncidentChoice(state, gasIncident, ambushChoice);
    expect(result.succeeded).toBe(true);
    expect(result.moneyDelta).toBe(50000); // Bác Ba thưởng nóng 50.000đ
  });

  it('Mở khóa lựa chọn độc quyền requiresSecurity trong hộp thoại sự cố', () => {
    const stateNoSecurity = createInitialState();
    const stateWithSecurity = createInitialState();
    stateWithSecurity.staff = [makeStaff('security', { name: 'Chú Tư Dân Phòng', mood: 100 })];

    const securityIncident: DailyIncident = {
      id: 'incident_gangster_extortion',
      title: 'Kẻ Bặm Trợn Quấy Nhiễu Bãi Xe',
      description: 'Một gã bặm trợn đến hạch sách đòi tiền giữ xe của khách.',
      categoryTag: 'AN NINH',
      choices: [
        {
          id: 'choice_normal_negotiate',
          label: 'Nói chuyện nhỏ nhẹ dĩ hòa vi quý',
          outcomes: { success: { text: 'Gã bỏ đi', moneyDelta: 0 } }
        },
        {
          id: 'choice_security_action',
          label: '👮 Nhờ Chú Tư Bảo Vệ ra mặt dẹp loạn',
          requiresSecurity: true, // Lựa chọn độc quyền chỉ có khi tuyển bảo vệ
          outcomes: { success: { text: 'Chú Tư tuýt còi, gã hoảng sợ chạy mất dép!', moneyDelta: 0 } }
        }
      ]
    };

    // Khi CHƯA có Chú Tư: nút bị khóa disabled kèm cảnh báo cần tuyển Chú Tư
    const htmlNoSec = renderIncidentPrompt(securityIncident, stateNoSecurity);
    expect(htmlNoSec).toContain('is-disabled');
    expect(htmlNoSec).toContain('Cần tuyển Chú Tư Giữ Xe tại tab Nhân viên');

    // Khi ĐÃ có Chú Tư: nút mở khóa sáng rõ class btn-security-choice
    const htmlWithSec = renderIncidentPrompt(securityIncident, stateWithSecurity);
    expect(htmlWithSec).toContain('btn-security-choice');
    expect(htmlWithSec).toContain('Có Chú Tư Bảo Vệ canh chừng: 100% bình yên');
  });

  it('Mô tả tác dụng của Chú Tư trong tab Nhân viên nêu rõ vai trò giữ xe & tóm trộm', () => {
    const guard = makeStaff('security', { name: 'Chú Tư Dân Phòng' });
    const desc = describeStaffEffect(guard, [guard]);
    expect(desc).toContain('Bảo vệ an ninh');
    expect(desc).toContain('trông xe an toàn');
    expect(desc).toContain('tóm gọn 100% trộm cắp');
  });
});
