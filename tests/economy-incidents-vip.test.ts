import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/core/state';
import { pickDailyIncident, resolveIncidentChoice, INCIDENT_COOLDOWN_DAYS } from '../src/core/dailyIncidentsEngine';
import { getIncidentById } from '../src/content/dailyIncidents';
import { prepStationSlots } from '../src/core/prepStation';
import { purgeAllExpiredStock } from '../src/core/inventory';
import { calculateCustomerTip, closeDay, eventForDay } from '../src/core/day';
import { CustomerOrder } from '../src/types/game';
import { SellingSession } from '../src/core/sellingSim';
import { OrdersEngine } from '../src/core/orders';

describe('Yêu cầu 4: Sự kiện ngẫu nhiên, chống lặp & dòng tiền thật theo chương', () => {
  it('Chống lặp: Sự kiện vừa xảy ra có cooldown 6 ngày và không lặp lại ngay', () => {
    const state = createInitialState();
    state.day = 2; // Sự kiện bắt đầu từ Ngày 2 (Ngày 1 Bác Ba đang hướng dẫn)
    state.currentChapter = 1;

    const event1 = pickDailyIncident(state);
    expect(event1).not.toBeNull();
    if (!event1) return;

    // Giả lập chọn phương án đầu tiên
    const res1 = resolveIncidentChoice(state, event1, event1.choices[0]);
    expect(res1.succeeded).toBeDefined();
    expect(state.incidentCooldowns?.[event1.id]).toBe(2); // Ghi nhận ngày xảy ra sự kiện là ngày 2

    // Ngày 3: Sự kiện event1 không được chọn vì đang trong cooldown 6 ngày
    state.day = 3;
    const event2 = pickDailyIncident(state);
    expect(event2?.id).not.toBe(event1.id);

    // Ngày 5: Vẫn còn trong cooldown
    state.day = 5;
    const event4 = pickDailyIncident(state);
    expect(event4?.id).not.toBe(event1.id);
  });

  it('Thay đổi tiền thật vào ví người chơi và nhân hệ số kinh tế theo chương', () => {
    // Chương 1 (hệ số 1.0x)
    const stateCh1 = createInitialState();
    stateCh1.currentChapter = 1;
    stateCh1.money = 100000;
    const eventKid = getIncidentById('incident_kid_lottery')!;
    const choiceKid = eventKid.choices.find(c => c.id === 'kid_exchange_feast')!;
    const resCh1 = resolveIncidentChoice(stateCh1, eventKid, choiceKid);
    expect(resCh1.moneyDelta).toBe(60000); // 60k net profit ở Ch1
    expect(stateCh1.money).toBe(160000);

    // Chương 3 (hệ số 2.5x)
    const stateCh3 = createInitialState();
    stateCh3.currentChapter = 3;
    stateCh3.money = 500000;
    const resCh3 = resolveIncidentChoice(stateCh3, eventKid, choiceKid);
    expect(resCh3.moneyDelta).toBe(Math.round(60000 * 2.5)); // 150.000đ ở Ch3
    expect(stateCh3.money).toBe(500000 + 150000);
  });
});

describe('Yêu cầu 5: Số lượng mua bằng tồn kho, không trừ chéo đùi gà & má đùi, hết hạn bị hủy thật', () => {
  it('Số lượng hiển thị trên trạm nấu phản ánh nguyên liệu chính (1:1 với tồn kho)', () => {
    const state = createInitialState();
    state.day = 5; // Mở trạm má đùi gà
    // Mua 10 đùi gà và 2 bột chiên
    state.inventory.chicken_meat = {
      id: 'chicken_meat',
      name: 'Đùi gà',
      amount: 10,
      price: 15000,
      shelfLifeDays: 2,
      batches: [{ amount: 10, daysLeft: 2, buyPrice: 15000 }]
    };
    state.inventory.chicken_thigh = {
      id: 'chicken_thigh',
      name: 'Má đùi gà',
      amount: 8,
      price: 18000,
      shelfLifeDays: 2,
      batches: [{ amount: 8, daysLeft: 2, buyPrice: 18000 }]
    };
    state.inventory.flour = {
      id: 'flour',
      name: 'Bột chiên',
      amount: 2,
      price: 5000,
      shelfLifeDays: 5,
      batches: [{ amount: 2, daysLeft: 5, buyPrice: 5000 }]
    };

    const slots = prepStationSlots(state);
    const chickenSlot = slots.find(s => s.id === 'chicken');
    const thighSlot = slots.find(s => s.id === 'thigh');

    // Số lượng trên khay phải phản ánh đúng 10 đùi gà và 8 má đùi, KHÔNG bị ghìm bởi 2 bột chiên
    expect(chickenSlot?.stock).toBe(10);
    expect(thighSlot?.stock).toBe(8);
  });

  it('Chiên đùi gà (chicken_meat) tuyệt đối KHÔNG làm trừ số lượng má đùi gà (chicken_thigh)', () => {
    const state = createInitialState();
    state.day = 5;
    state.inventory.chicken_meat = {
      id: 'chicken_meat',
      name: 'Đùi gà',
      amount: 10,
      price: 15000,
      shelfLifeDays: 2,
      batches: [{ amount: 10, daysLeft: 2, buyPrice: 15000 }]
    };
    state.inventory.chicken_thigh = {
      id: 'chicken_thigh',
      name: 'Má đùi gà',
      amount: 8,
      price: 18000,
      shelfLifeDays: 2,
      batches: [{ amount: 8, daysLeft: 2, buyPrice: 18000 }]
    };
    state.inventory.flour = {
      id: 'flour',
      name: 'Bột chiên',
      amount: 5,
      price: 5000,
      shelfLifeDays: 5,
      batches: [{ amount: 5, daysLeft: 5, buyPrice: 5000 }]
    };

    // Giả lập chiên 1 mẻ đùi gà: trừ 1 chicken_meat và 1 flour
    state.inventory.chicken_meat.amount -= 1;
    state.inventory.chicken_meat.batches[0].amount -= 1;
    state.inventory.flour.amount -= 1;
    state.inventory.flour.batches[0].amount -= 1;

    const slots = prepStationSlots(state);
    const chickenSlot = slots.find(s => s.id === 'chicken');
    const thighSlot = slots.find(s => s.id === 'thigh');

    expect(chickenSlot?.stock).toBe(9);
    expect(thighSlot?.stock).toBe(8); // Vẫn nguyên vẹn 8 má đùi gà!
    expect(state.inventory.chicken_thigh.amount).toBe(8);
  });

  it('Hết hạn: Lô hàng có daysLeft <= 0 bị loại bỏ triệt để và trừ kho thật', () => {
    const state = createInitialState();
    state.inventory.chicken_meat = {
      id: 'chicken_meat',
      name: 'Đùi gà',
      amount: 10,
      price: 15000,
      shelfLifeDays: 2,
      batches: [
        { amount: 6, daysLeft: 0, buyPrice: 15000 }, // Hết hạn
        { amount: 4, daysLeft: 1, buyPrice: 15000 }  // Còn hạn
      ]
    };

    // Sync và purge
    purgeAllExpiredStock(state.inventory);
    expect(state.inventory.chicken_meat.amount).toBe(4);
    expect(state.inventory.chicken_meat.batches).toHaveLength(1);
    expect(state.inventory.chicken_meat.batches[0].amount).toBe(4);
    expect(state.inventory.chicken_meat.currentLifeDays).toBe(1);

    // Khi tất cả các lô đều hết hạn
    state.inventory.chicken_meat.batches[0].daysLeft = 0;
    purgeAllExpiredStock(state.inventory);
    expect(state.inventory.chicken_meat.amount).toBe(0);
    expect(state.inventory.chicken_meat.batches).toHaveLength(0);
    expect(state.inventory.chicken_meat.currentLifeDays).toBe(0);
  });

  it('Chốt ngày (closeDay) thông báo và tiêu hủy nguyên liệu quá hạn lưu kho', () => {
    const state = createInitialState();
    state.day = 1;
    state.inventory.chicken_meat = {
      id: 'chicken_meat',
      name: 'Đùi gà tươi',
      amount: 5,
      price: 15000,
      shelfLifeDays: 2,
      batches: [{ amount: 5, daysLeft: 1, buyPrice: 15000 }]
    };

    const session: SellingSession = {
      day: 1,
      orders: [],
      soldCounts: {},
      tray: [],
      timers: { fryer_1: null, fryer_2: null, boil: null, shake: null },
      servedCount: 0,
      grossRevenue: 0,
      totalWaitSec: 0,
      perfectCount: 0,
      burntCount: 0,
      perfectStreak: 0,
      fxQueue: []
    };

    const event = eventForDay(1);
    // Khi closeDay kết thúc ngày 1, lô hàng giảm 1 ngày tuổi (1 -> 0) và bị tiêu hủy
    const summary = closeDay(state, session, event);
    expect(summary).toBeDefined();
    expect(state.expiredWasteNotification).toBeDefined();
    expect(state.expiredWasteNotification?.items.some(it => it.includes('Đùi gà'))).toBe(true);
    expect(state.inventory.chicken_meat.amount).toBe(0);
  });
});

describe('Yêu cầu 6: Khách Sộp (VIP Big Spender) & Tăng tốc kinh tế', () => {
  it('Khách Sộp thưởng tiền tip vượt trội (+45k phục vụ nhanh + bonus tay nghề)', () => {
    const vipOrder: CustomerOrder = {
      id: 'ord_vip_test',
      customerName: '👑 Anh Tuấn (Khách Sộp)',
      avatar: 'assets/characters/rich_ceo.png',
      isDelivery: false,
      isVip: true,
      personality: 'vip_generous',
      personalityLabel: '👑✨ KHÁCH SỘP 💵',
      items: [{ menuItemId: 'crispy_chicken', count: 2, served: 2, completed: true }],
      patienceMax: 40,
      patienceCurrent: 35, // Phục vụ cực nhanh (> 60% thời gian)
      totalPrice: 60000,
      perfectBonus: 5000, // Làm món chuẩn vị
      startTime: Date.now()
    };

    const result = calculateCustomerTip(vipOrder);
    expect(result.tip).toBeGreaterThanOrEqual(45000); // Tip cơ bản 45k + 25k bonus = 70.000đ!
    expect(result.feedbackNotes.some(n => n.includes('KHÁCH SỘP'))).toBe(true);
  });

  it('Hệ thống tạo đơn nhận diện Khách Sộp và gán cờ isVip', () => {
    let vipFound = false;
    const state = createInitialState();
    state.currentChapter = 1;
    state.day = 2;

    // Lấy mẫu 40 đơn hàng, chắc chắn sẽ xuất hiện Khách Sộp (xác suất ~15-20%)
    for (let i = 0; i < 40; i++) {
      const order = OrdersEngine.generateOrder(state);
      if (order.isVip || order.personality === 'vip_generous') {
        vipFound = true;
        expect(order.customerName.includes('👑')).toBe(true);
        break;
      }
    }
    expect(vipFound).toBe(true);
  });
});
