import { describe, it, expect } from 'vitest';
import { createDefaultDineInTables, createInitialState, migrateSave } from '../src/core/state';
import { calculateCustomerTip } from '../src/core/day';
import { cleanDineInTable, tickDineInTables, createSellingSession, SellingSession } from '../src/core/sellingSim';
import { renderDineInPatio } from '../src/ui/components/SellingView';
import { CustomerOrder, DineInTable } from '../src/types/game';

describe('1. Hệ Thống VIP Critic Orders (Nhà Phê Bình Ẩm Thực)', () => {
  const createBaseOrder = (overrides: Partial<CustomerOrder> = {}): CustomerOrder => ({
    id: 'test_ord_critic_1',
    customerName: '⭐ Giám Khảo Khoa Pug',
    avatar: '👨‍💼',
    isDelivery: false,
    items: [{ menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true }],
    patienceMax: 30,
    patienceCurrent: 25,
    totalPrice: 45000,
    startTime: Date.now(),
    isCriticVip: true,
    personality: 'critic',
    personalityLabel: '⭐ Phê Bình VIP',
    ...overrides
  });

  it('VIP Critic phạt 0đ tip và chê bai thậm tệ khi nhận phải món cháy', () => {
    const order = createBaseOrder({
      burntPenalty: 22500, // bị cháy 1 phần
      perfectBonus: 0
    });
    const res = calculateCustomerTip(order);
    expect(res.tip).toBe(0);
    expect(res.feedbackNotes.some(n => n.includes('cháy khét'))).toBe(true);
  });

  it('VIP Critic chỉ cho tip tượng trưng 3.000đ nhắc nhở nếu món chỉ chín thường (không có Perfect)', () => {
    const order = createBaseOrder({
      burntPenalty: 0,
      perfectBonus: 0
    });
    const res = calculateCustomerTip(order);
    expect(res.tip).toBe(3000);
    expect(res.feedbackNotes.some(n => n.includes('chưa chuẩn Vàng Giòn'))).toBe(true);
  });

  it('VIP Critic thưởng tip khủng 35.000đ+ khi tay nghề chiên đạt chuẩn Vàng Giòn Perfect', () => {
    const order = createBaseOrder({
      burntPenalty: 0,
      perfectBonus: 5000 // mẻ Perfect
    });
    const res = calculateCustomerTip(order);
    expect(res.tip).toBe(35000 + 5000 * 2); // 45.000đ tip
    expect(res.feedbackNotes.some(n => n.includes('5 sao'))).toBe(true);
  });
});

describe('2. Khởi Tạo & Quản Lý Dữ Liệu Bàn Ăn Hiên Quán (Dine-In Tables)', () => {
  it('createDefaultDineInTables khởi tạo đúng 3 bàn hiên quán ở trạng thái empty', () => {
    const tables = createDefaultDineInTables();
    expect(tables.length).toBe(3);
    for (let i = 0; i < tables.length; i++) {
      expect(tables[i].tableIndex).toBe(i);
      expect(tables[i].status).toBe('empty');
      expect(tables[i].eatingTimerSec).toBe(0);
      expect(tables[i].tipAmount).toBe(0);
    }
  });

  it('createInitialState có sẵn dineInTables mặc định', () => {
    const state = createInitialState();
    expect(state.dineInTables).toBeDefined();
    expect(state.dineInTables?.length).toBe(3);
    expect(state.dineInTables?.[0].status).toBe('empty');
  });

  it('migrateSave bảo lưu và tự phục hồi dineInTables nếu dữ liệu cũ thiếu', () => {
    const rawSave = { version: 2, day: 3, money: 1000000 };
    const migrated = migrateSave(rawSave);
    expect(migrated).not.toBeNull();
    expect(migrated?.state.dineInTables).toBeDefined();
    expect(migrated?.state.dineInTables?.length).toBe(3);
  });
});

describe('3. Vòng Lặp Ăn Uống & Dọn Bàn Hiên Quán (tickDineInTables & cleanDineInTable)', () => {
  it('tickDineInTables giảm dần thời gian ăn và chuyển sang dirty khi đếm ngược về 0', () => {
    const session = createSellingSession();
    session.dineInTables = [
      {
        id: 'table_0',
        tableIndex: 0,
        name: 'Bàn 1 (Hiên Quán)',
        status: 'eating',
        customerName: 'Bảo Châu',
        eatingDurationSec: 8,
        eatingTimerSec: 5,
        tipAmount: 15000
      }
    ];

    // Trôi qua 3 giây (3000ms)
    tickDineInTables(session, 3000);
    expect(session.dineInTables[0].status).toBe('eating');
    expect(session.dineInTables[0].eatingTimerSec).toBe(2);

    // Trôi tiếp 2.5 giây (2500ms) -> hết giờ ăn -> chuyển sang dirty
    tickDineInTables(session, 2500);
    expect(session.dineInTables[0].status).toBe('dirty');
    expect(session.dineInTables[0].eatingTimerSec).toBe(0);
  });

  it('cleanDineInTable từ chối dọn khi bàn đang trống hoặc khách đang ăn dở', () => {
    const session = createSellingSession();
    session.dineInTables = [
      { id: 'table_0', tableIndex: 0, name: 'Bàn 1', status: 'empty', eatingDurationSec: 0, eatingTimerSec: 0, tipAmount: 0 },
      { id: 'table_1', tableIndex: 1, name: 'Bàn 2', status: 'eating', eatingDurationSec: 8, eatingTimerSec: 4, tipAmount: 10000 }
    ];

    const cleanEmpty = cleanDineInTable(session, 0);
    expect(cleanEmpty.success).toBe(false);

    const cleanEating = cleanDineInTable(session, 1);
    expect(cleanEating.success).toBe(false);
  });

  it('cleanDineInTable dọn sạch bàn dirty, thu gom tiền tip và reset bàn về empty', () => {
    const session = createSellingSession();
    session.grossRevenue = 100000;
    session.tips = 10000;
    session.dineInTables = [
      {
        id: 'table_0',
        tableIndex: 0,
        name: 'Bàn 1 (Hiên Quán)',
        status: 'dirty',
        customerName: '⭐ Giám Khảo Minh Trí',
        customerAvatar: '👨‍🎓',
        foodName: 'Gà Vàng Giòn',
        eatingDurationSec: 8,
        eatingTimerSec: 0,
        tipAmount: 35000,
        isCritic: true
      }
    ];

    const cleanRes = cleanDineInTable(session, 0);
    expect(cleanRes.success).toBe(true);
    expect(cleanRes.tipCollected).toBe(35000);
    expect(cleanRes.tableName).toBe('Bàn 1 (Hiên Quán)');

    // Kiểm tra tài chính ca bán được cộng tip
    expect(session.tips).toBe(45000);
    expect(session.grossRevenue).toBe(135000);

    // Kiểm tra trạng thái bàn được làm sạch hoàn toàn
    const table = session.dineInTables[0];
    expect(table.status).toBe('empty');
    expect(table.customerName).toBeUndefined();
    expect(table.tipAmount).toBe(0);
    expect(table.isCritic).toBe(false);
  });
});

describe('4. Render Giao Diện Hiên Quán (renderDineInPatio)', () => {
  it('renderDineInPatio tạo đúng cấu trúc HTML và các nút dọn bàn', () => {
    const tables: DineInTable[] = [
      { id: 'table_0', tableIndex: 0, name: 'Bàn 1', status: 'empty', eatingDurationSec: 0, eatingTimerSec: 0, tipAmount: 0 },
      { id: 'table_1', tableIndex: 1, name: 'Bàn 2', status: 'eating', customerName: 'Trúc', eatingDurationSec: 8, eatingTimerSec: 4, tipAmount: 5000 },
      { id: 'table_2', tableIndex: 2, name: 'Bàn 3', status: 'dirty', customerName: 'Hùng', eatingDurationSec: 8, eatingTimerSec: 0, tipAmount: 20000 }
    ];

    const html = renderDineInPatio(tables);
    expect(html).toContain('dine-in-patio-container');
    expect(html).toContain('data-table-idx="0"');
    expect(html).toContain('data-table-idx="1"');
    expect(html).toContain('data-table-idx="2"');

    // Bàn 0: empty
    expect(html).toContain('patio-table empty');
    expect(html).toContain('patio-furniture-wrap');

    // Bàn 1: eating
    expect(html).toContain('patio-table eating');
    expect(html).toContain('Trúc');

    // Bàn 2: dirty có nút .btn-clean-table
    expect(html).toContain('patio-table dirty');
    expect(html).toContain('btn-clean-table');
    expect(html).toContain('+20k');
  });
});
