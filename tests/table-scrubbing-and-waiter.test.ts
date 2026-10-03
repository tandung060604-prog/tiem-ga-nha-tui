import { describe, it, expect } from 'vitest';
import { createSellingSession, cleanDineInTable, scrubDineInTable, stopScrubbingDineInTable, waiterCleanDineInTable } from '../src/core/sellingSim';
import { staffEffects, tickStaff, describeStaffEffect } from '../src/core/staff';
import { createInitialState } from '../src/core/state';
import { renderSellingView, renderPatioWipingRagSvg } from '../src/ui/components/SellingView';
import { DineInTable, StaffMember } from '../src/types/game';

describe('Table Scrubbing Mechanism & Waiter Automation Balance', () => {
  it('1. Manual scrubbing increases progress and takes ~3.5s at baseline, completing at 100%', () => {
    const session = createSellingSession(1, 10);
    const table: DineInTable = {
      id: 'table_0',
      tableIndex: 0,
      name: 'Bàn 1 (Hiên Quán)',
      status: 'dirty',
      eatingTimerSec: 0,
      eatingDurationSec: 0,
      tipAmount: 5000,
      cleanProgress: 0,
      isBeingCleaned: false
    };
    session.dineInTables = [table];

    // Chà tay 1000ms (~1 giây)
    const step1 = scrubDineInTable(session, 0, 1000, false);
    expect(step1.completed).toBe(false);
    expect(table.cleanProgress).toBeGreaterThanOrEqual(28); // ~28.5%
    expect(table.isBeingCleaned).toBe(true);

    // Chà tiếp 1500ms (tổng 2.5s)
    const step2 = scrubDineInTable(session, 0, 1500, false);
    expect(step2.completed).toBe(false);
    expect(table.cleanProgress).toBeGreaterThanOrEqual(70);

    // Dừng tay nhấc ra
    stopScrubbingDineInTable(session, 0);
    expect(table.isBeingCleaned).toBe(false);
    expect(table.cleanProgress).toBeGreaterThanOrEqual(70); // Bảo toàn tiến trình lau dở

    // Chà nốt 1200ms (vượt ngưỡng 3.5s -> 100%)
    const step3 = scrubDineInTable(session, 0, 1200, false);
    expect(step3.completed).toBe(true);
    expect(step3.tipCollected).toBe(5000);
    expect(table.status).toBe('empty');
    expect(table.cleanProgress).toBe(0);
    expect(session.tips).toBe(5000);
  });

  it('2. Vigorous scrubbing acceleration: Active rubbing gesture cleans table faster (~1.8s - 2.0s)', () => {
    const session = createSellingSession(1, 10);
    const table: DineInTable = {
      id: 'table_1',
      tableIndex: 1,
      name: 'Bàn 2 (Góc Phố)',
      status: 'dirty',
      eatingTimerSec: 0,
      eatingDurationSec: 0,
      tipAmount: 3000,
      cleanProgress: 0
    };
    session.dineInTables = [table];

    // Cọ xát ngón tay nhiệt tình qua lại (isVigorous = true)
    // 1000ms cọ xát với hệ số 1.85x -> đạt ~52.8%
    const step1 = scrubDineInTable(session, 1, 1000, true);
    expect(step1.completed).toBe(false);
    expect(table.cleanProgress).toBeGreaterThanOrEqual(50);

    // Cọ tiếp 950ms -> tổng ~1950ms (< 2s) hoàn thành 100%!
    const step2 = scrubDineInTable(session, 1, 950, true);
    expect(step2.completed).toBe(true);
    expect(step2.tipCollected).toBe(3000);
    expect(table.status).toBe('empty');
  });

  it('3. Waiter Automation Balance: Waiter cleans dirty tables automatically with speed depending on stat (4.0s down to 1.5s)', () => {
    // Waiter cấp 1 (Tốc độ cơ bản speed=30)
    const juniorWaiter: StaffMember = {
      id: 'staff_waiter_c',
      name: 'Bé Hân Phục Vụ',
      role: 'waiter',
      avatar: '',
      speed: 30,
      skill: 40,
      attitude: 50,
      stamina: 60,
      hourlyWage: 20000,
      mood: 80,
      shiftsWorked: 1,
      rarity: 'C'
    };
    const effJunior = staffEffects([juniorWaiter]);
    expect(effJunior.waiterCleanMs).not.toBeNull();
    expect(effJunior.waiterCleanMs!).toBeGreaterThanOrEqual(3000); // Khoảng ~3.5s - 4.0s

    // Waiter cấp cao (Tốc độ thần tốc speed=95, SSR)
    const masterWaiter: StaffMember = {
      id: 'staff_waiter_ssr',
      name: 'Anh Tuấn Trưởng Bàn',
      role: 'waiter',
      avatar: '',
      speed: 95,
      skill: 90,
      attitude: 90,
      stamina: 95,
      hourlyWage: 45000,
      mood: 100,
      shiftsWorked: 20,
      rarity: 'SSR'
    };
    const effMaster = staffEffects([masterWaiter]);
    expect(effMaster.waiterCleanMs).not.toBeNull();
    expect(effMaster.waiterCleanMs!).toBeLessThanOrEqual(2000); // Khoảng 1.5s - 1.8s

    // Kiểm tra mô tả hiệu ứng nhân viên
    const desc = describeStaffEffect(juniorWaiter, [juniorWaiter]);
    expect(desc).toContain('Tự lau bàn sạch sau');
  });

  it('4. Co-op scrubbing: Player can help Waiter clean table together to finish twice as fast', () => {
    const session = createSellingSession(1, 10);
    const table: DineInTable = {
      id: 'table_0',
      tableIndex: 0,
      name: 'Bàn 1 (Hiên Quán)',
      status: 'dirty',
      eatingTimerSec: 0,
      eatingDurationSec: 0,
      tipAmount: 4000,
      cleanProgress: 0
    };
    session.dineInTables = [table];

    // Waiter đang lau (tốc độ 3000ms)
    waiterCleanDineInTable(session, 0, 1000, 3000, 'Bé Hân');
    expect(table.cleanProgress).toBeCloseTo(33.3, 0);
    expect(table.cleanedByStaff).toBe(true);

    // Người chơi vào chà phụ 800ms cọ xát tích cực
    scrubDineInTable(session, 0, 800, true);
    // Cả 2 cùng lau: 33.3% + (800/3500)*100*1.85 (~42.2%) = ~75.5%
    expect(table.cleanProgress).toBeGreaterThanOrEqual(70);

    // Tiếp tục chà thêm 600ms -> Bàn sạch bong!
    const finish = scrubDineInTable(session, 0, 600, true);
    expect(finish.completed).toBe(true);
    expect(table.status).toBe('empty');
  });

  it('5. Pacing priority: Waiter prioritizes serving ready meals to hungry customers before cleaning dirty tables', () => {
    const waiter: StaffMember = {
      id: 'staff_waiter_1',
      name: 'Bé Hân',
      role: 'waiter',
      avatar: '',
      speed: 80,
      skill: 80,
      attitude: 80,
      stamina: 80,
      hourlyWage: 25000,
      mood: 90,
      shiftsWorked: 5,
      rarity: 'R'
    };
    const eff = staffEffects([waiter]);

    const session: any = {
      helpers: [],
      waiterMs: 0,
      pourMs: 0,
      cleaningTableIndex: null,
      orders: [
        {
          id: 'ord_1',
          customerName: 'Bảo Châu',
          items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }]
        }
      ],
      totalFriedCount: 0
    };

    const tray: any[] = [
      { id: 'tray_1', menuItemId: 'crispy_chicken', quality: 'perfect' }
    ];

    let tableCleanCalled = false;
    const hooks: any = {
      use: () => true,
      place: () => true,
      pour: () => true,
      cleanTable: () => {
        tableCleanCalled = true;
        return { completed: false };
      },
      dirtyTableIndices: () => [0],
      traySize: 4
    };

    // Khi khách đầu tiên ĐÃ ĐỦ MÓN trong khay -> Waiter tập trung phục vụ món, KHÔNG dọn bàn bẩn
    const events = tickStaff(session, tray, 1000, eff, null, hooks);
    expect(tableCleanCalled).toBe(false); // Ưu tiên hàng đầu là lên món cho khách đang đói!
    expect(session.waiterMs).toBeGreaterThan(0);
  });

  it('6. Visual Juice: Dirty table renders custom retro wiping cloth SVG, soap bubbles, and progress bar', () => {
    const state = createInitialState();
    const tables: DineInTable[] = [
      {
        id: 'table_dirty_0',
        tableIndex: 0,
        name: 'Bàn 1 (Hiên Quán)',
        status: 'dirty',
        eatingTimerSec: 0,
        eatingDurationSec: 0,
        tipAmount: 6000,
        cleanProgress: 42,
        isBeingCleaned: true
      }
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

    // Chứa icon khăn lau tự thiết kế inline SVG retro
    expect(html).toContain('patio-rag-svg');
    expect(html).toContain('patio-rag-motion-wrap');
    // Hiển thị bọt xà phòng trắng bay lên và tia sáng lấp lánh khi đang chà
    expect(html).toContain('scrub-bubble');
    expect(html).toContain('scrub-sparkle');
    // Thanh tiến trình lau bàn
    expect(html).toContain('patio-table-clean-bar');
    expect(html).toContain('patio-table-clean-fill');
    expect(html).toContain('width: 42%');
    expect(html).toContain('is-scrubbing');
  });
});
