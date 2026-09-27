import { describe, it, expect, beforeAll } from 'vitest';
import { serveFirstOrder, cancelAndApologizeOrder } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { CustomerOrder, TrayItem } from '../src/types/game';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

const makeTray = (...items: Partial<TrayItem>[]): TrayItem[] =>
  items.map((t, i) => ({
    id: `tray_${i}_${Date.now()}`,
    menuItemId: 'crispy_chicken',
    name: 'Gà Rán Giòn',
    icon: '🍗',
    quality: 'perfect',
    ...t
  }));

const makeOrder = (id: string, name: string, lines: Array<{ menuItemId: string; count: number; served?: number; completed?: boolean }>): CustomerOrder => ({
  id,
  customerName: name,
  items: lines.map(l => ({
    menuItemId: l.menuItemId,
    count: l.count,
    served: l.served ?? 0,
    completed: l.completed ?? false
  })),
  totalPrice: 45000,
  patienceMax: 60,
  patienceCurrent: 50,
  isDelivery: false,
  personality: 'student',
  personalityLabel: 'Học Sinh',
  personalityDesc: 'Thích ăn gà rán giòn rụm'
});

describe('Hệ Thống Phục Vụ Thông Minh & Hủy Đơn Xin Lỗi (Smart Serving & Cancel Order)', () => {
  it('Khách 1 đang chờ món khác, Khách 2 có món trong khay -> Tự động giao cho Khách 2, không làm nghẽn hàng đợi', () => {
    const session = createSellingSession();
    // Khách 1 gọi nước ngọt 7Up
    const order1 = makeOrder('ord_1', 'Khách 1 Chờ Nước', [{ menuItemId: 'seven_up', count: 1 }]);
    // Khách 2 gọi Gà Rán Giòn
    const order2 = makeOrder('ord_2', 'Khách 2 Chờ Gà', [{ menuItemId: 'crispy_chicken', count: 1 }]);
    session.orders = [order1, order2];

    // Khay đang có 1 Gà Rán Giòn vừa chiên xong
    const tray = makeTray({ menuItemId: 'crispy_chicken', name: 'Gà Rán Giòn' });

    let removedTrayIdx = -1;
    const result = serveFirstOrder(
      session,
      tray,
      () => 35000,
      idx => { removedTrayIdx = idx; }
    );

    // Kết quả phải hoàn tất cho Khách 2!
    expect(result.kind).toBe('complete');
    if (result.kind === 'complete') {
      expect(result.order.id).toBe('ord_2');
      expect(result.paid).toBeGreaterThan(0);
    }

    // Khay đã vớt món
    expect(removedTrayIdx).toBe(0);
    // Khách 2 đã được phục vụ và rời khỏi hàng đợi, chỉ còn Khách 1
    expect(session.orders.length).toBe(1);
    expect(session.orders[0]!.id).toBe('ord_1');
    expect(session.servedCount).toBe(1);
  });

  it('Hủy đơn & Xin lỗi khi hết hàng (cancelAndApologizeOrder): Giải phóng slot ngay, khách thông cảm rời đi', () => {
    const session = createSellingSession();
    const order1 = makeOrder('ord_1', 'Bé Trúc Mê Gà', [{ menuItemId: 'spicy_thigh', count: 1 }]);
    const order2 = makeOrder('ord_2', 'Anh Tuấn Shipper', [{ menuItemId: 'crispy_chicken', count: 1 }]);
    session.orders = [order1, order2];

    // Quán hết má đùi cay, chủ quán bấm Hủy đơn & xin lỗi Khách 1
    const cancelResult = cancelAndApologizeOrder(session, 'ord_1', () => 40000);

    expect(cancelResult.success).toBe(true);
    expect(cancelResult.order?.id).toBe('ord_1');
    expect(cancelResult.apologyReply).toContain('Dạ hông sao đâu ạ');
    // Khách 1 rời đi ngay, Khách 2 tiến lên vị trí đầu hàng!
    expect(session.orders.length).toBe(1);
    expect(session.orders[0]!.id).toBe('ord_2');
    expect(session.apologiesCount).toBe(1);
  });

  it('Hủy đơn khi khách đã nhận 1 phần trước đó: Khách thanh toán phần đã nhận với giá ưu đãi', () => {
    const session = createSellingSession();
    // Khách gọi 1 gà giòn (đã nhận) + 1 khoai lắc (hết hàng)
    const order = makeOrder('ord_partial', 'Chú Nam', [
      { menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true },
      { menuItemId: 'shake_fries', count: 1, served: 0, completed: false }
    ]);
    session.orders = [order];

    const cancelResult = cancelAndApologizeOrder(session, 'ord_partial', id => id === 'crispy_chicken' ? 35000 : 25000);

    expect(cancelResult.success).toBe(true);
    // Thanh toán phần gà giòn đã nhận (35000 * 0.8 = 28000)
    expect(cancelResult.paid).toBe(28000);
    expect(session.grossRevenue).toBe(28000);
    expect(session.orders.length).toBe(0);
  });

  it('Phục vụ chỉ định đích danh theo targetOrderId', () => {
    const session = createSellingSession();
    const order1 = makeOrder('ord_1', 'Khách 1', [{ menuItemId: 'crispy_chicken', count: 1 }]);
    const order2 = makeOrder('ord_2', 'Khách 2', [{ menuItemId: 'crispy_chicken', count: 1 }]);
    session.orders = [order1, order2];

    const tray = makeTray({ menuItemId: 'crispy_chicken' });
    let removedTrayIdx = -1;

    // Chỉ định phục vụ đúng Khách 2
    const result = serveFirstOrder(
      session,
      tray,
      () => 35000,
      idx => { removedTrayIdx = idx; },
      undefined,
      'ord_2'
    );

    expect(result.kind).toBe('complete');
    if (result.kind === 'complete') {
      expect(result.order.id).toBe('ord_2');
    }
    expect(session.orders.length).toBe(1);
    expect(session.orders[0]!.id).toBe('ord_1');
  });
});
