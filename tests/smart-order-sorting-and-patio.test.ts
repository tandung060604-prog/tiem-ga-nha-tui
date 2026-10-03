import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/core/state';
import { OrdersEngine, canMake } from '../src/core/orders';
import { renderSellingView } from '../src/ui/components/SellingView';
import { renderHeader } from '../src/ui/components/Header';
import { CustomerOrder, DineInTable } from '../src/types/game';

describe('Smart Order Sorting & Patio Visual Juice Features', () => {
  it('1. Fanta Cam (fanta_orange) can be ordered from Day 1, Chapter 1', () => {
    const state = createInitialState();
    expect(state.currentChapter).toBe(1);
    expect(state.day).toBe(1);

    // canMake phải trả về true cho fanta_orange
    expect(canMake(state, 'fanta_orange')).toBe(true);

    // Kiểm tra trong 200 lượt sinh đơn, khách có gọi fanta_orange
    let orderedFanta = false;
    for (let i = 0; i < 200; i++) {
      const order = OrdersEngine.generateOrder(state);
      if (order.items.some(it => it.menuItemId === 'fanta_orange')) {
        orderedFanta = true;
        break;
      }
    }
    expect(orderedFanta).toBe(true);
  });

  it('2. Smart Order Sorting: Pending items stay on top, completed items auto-collapse into summary chips', () => {
    const state = createInitialState();
    const orderWithMultipleItems: CustomerOrder = {
      id: 'ord_test_multi',
      customerName: 'Bảo Châu',
      avatar: '',
      patienceMax: 60,
      patienceCurrent: 50,
      startTime: Date.now() - 2000,
      items: [
        { menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true },
        { menuItemId: 'shake_fries', count: 1, served: 0, completed: false },
        { menuItemId: 'fanta_orange', count: 1, served: 0, completed: false }
      ]
    };

    const mockSession: any = {
      gameHour: 11.5,
      isFastForward: false,
      orders: [orderWithMultipleItems],
      isPaused: false,
      timers: {},
      perfectStreak: 0,
      tray: [],
      cleanserOrders: 0,
      disruptionTimerSec: 0,
      departingCustomers: [],
      dineInTables: []
    };

    const html = renderSellingView(state, mockSession);

    // Kiểm tra có khối thu gọn completed items
    expect(html).toContain('order-completed-summary');
    expect(html).toContain('completed-summary-label');
    expect(html).toContain('Đã giao (1/3):');
    expect(html).toContain('completed-chip');

    // Món chưa xong shake_fries và fanta_orange phải nằm trong order-row thông thường
    expect(html).toContain('data-item-id="shake_fries"');
    expect(html).toContain('data-item-id="fanta_orange"');

    // Thứ tự trong DOM: shake_fries phải xuất hiện TRƯỚC order-completed-summary
    const friesIdx = html.indexOf('data-item-id="shake_fries"');
    const summaryIdx = html.indexOf('order-completed-summary');
    expect(friesIdx).toBeGreaterThan(-1);
    expect(summaryIdx).toBeGreaterThan(-1);
    expect(friesIdx).toBeLessThan(summaryIdx); // Món chưa xong ở trên, dải thu gọn món xong ở dưới!
  });

  it('3. Header displays pixel weather badge with icon and temperature', () => {
    const state = createInitialState();
    const headerHtml = renderHeader(state);

    expect(headerHtml).toContain('h-weather-badge');
    expect(headerHtml).toContain('h-weather-icon');
    expect(headerHtml).toContain('h-weather-text');
  });

  it('4. Dine-In Patio uses pixel wood table asset and chewing/steam animation', () => {
    const state = createInitialState();
    const tables: DineInTable[] = [
      { id: 'table_0', tableIndex: 0, name: 'Bàn 1 (Hiên Quán)', status: 'empty', eatingTimerSec: 0, eatingDurationSec: 0, tipAmount: 0 },
      { id: 'table_1', tableIndex: 1, name: 'Bàn 2 (Góc Phố)', status: 'eating', eatingTimerSec: 5, eatingDurationSec: 10, tipAmount: 5000, customerName: 'Trúc' }
    ];

    const mockSession: any = {
      gameHour: 12,
      isFastForward: false,
      orders: [],
      isPaused: false,
      timers: {},
      perfectStreak: 0,
      tray: [],
      cleanserOrders: 0,
      disruptionTimerSec: 0,
      departingCustomers: [],
      dineInTables: tables
    };

    const html = renderSellingView(state, mockSession);

    // Bàn trống có asset SVG pixel art bàn ghế gỗ mộc
    expect(html).toContain('patio-furniture-wrap');
    expect(html).toContain('patio-pixel-table-img');
    // Không còn emoji ghế cũ
    expect(html).not.toContain('🪑');

    // Bàn ăn có animation nhai và hơi khói ấm nóng
    expect(html).toContain('chew-head-bob');
    expect(html).toContain('patio-steam-puff');
    expect(html).toContain('♨️');
  });

  it('5. Staff Visual on Kitchen (Jev MCP P0): Renders staff corner card on HUD and staff actor beside fryer', () => {
    const state = createInitialState();
    state.staff = [
      {
        id: 'staff_cook_linh',
        name: 'Bé Linh Phụ Bếp',
        role: 'cook',
        avatar: '',
        speed: 70,
        skill: 80,
        attitude: 90,
        stamina: 85,
        traits: ['chăm chỉ'],
        hourlyWage: 25000,
        mood: 95,
        shiftsWorked: 3,
        rarity: 'SR',
        stars: 3,
        title: 'Thần Bếp Chảo Lửa'
      }
    ];

    const mockSession: any = {
      gameHour: 11.5,
      isFastForward: false,
      orders: [],
      isPaused: false,
      timers: {},
      perfectStreak: 0,
      tray: [],
      cleanserOrders: 0,
      disruptionTimerSec: 0,
      departingCustomers: [],
      dineInTables: [],
      helpers: {
        0: { menuItemId: 'crispy_chicken', progress: 45 }
      }
    };

    const html = renderSellingView(state, mockSession);

    // 1. Unified Staff Roster Card trên kệ sơ chế thay thế 3 layer cũ
    expect(html).toContain('staff-roster-shelf');
    expect(html).toContain('staff-round-card');
    expect(html).toContain('staff-head-status');
    expect(html).toContain('helper-progress');
    expect(html).toContain('Bé Linh Phụ Bếp');
  });
});

