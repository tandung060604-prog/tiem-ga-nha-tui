import { describe, it, expect, beforeAll } from 'vitest';
import { createSellingSession, drainFx, pushFx, tickSelling } from '../src/core/sellingSim';
import { serveFirstOrder, recordFryerLift, perfectTip } from '../src/core/day';
import { createInitialState } from '../src/core/state';
import { audio } from '../src/core/audio';
import { CustomerOrder, TrayItem } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

const order = (patience = 40): CustomerOrder => ({
  id: 'o1', customerName: 'Khách', avatar: '🙂', isDelivery: false,
  items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }],
  patienceMax: 40, patienceCurrent: patience, totalPrice: 35000, startTime: 0
});
const chicken: TrayItem = { id: 't', menuItemId: 'crispy_chicken', name: 'Gà', icon: '🍗', quality: 'good' };
const lift = (quality: TrayItem['quality']) => ({ quality, trayItem: null, usedSauce: null });

describe('hiệu ứng "đã tay": core ghi, giao diện rút đúng một lần', () => {
  it('giao xong khách → tiền bay đúng số tiền và tip, kể cả khách ĐẦU TIÊN của ca', () => {
    const s = createSellingSession();
    s.orders = [order()];
    const tray = [{ ...chicken }];
    const r = serveFirstOrder(s, tray, () => 35000, i => tray.splice(i, 1));
    expect(r.kind).toBe('complete');
    expect(drainFx(s)).toEqual([{ kind: 'cash', paid: 35000, tip: r.kind === 'complete' ? r.tip : -1 }]);
    expect(drainFx(s)).toEqual([]); // đã rút thì không vẽ lại
  });

  it('chuỗi Perfect ≥ 2 → hiệu ứng lửa kèm đúng tip của core', () => {
    const state = createInitialState();
    const s = createSellingSession();
    recordFryerLift(state, s, lift('perfect'));
    expect(drainFx(s)).toEqual([]); // 1 mẻ chưa phải chuỗi
    recordFryerLift(state, s, lift('perfect'));
    expect(drainFx(s)).toEqual([{ kind: 'streak', streak: 2, tip: perfectTip(2) }]);
  });

  it('khách bỏ về → hiệu ứng "lost"', () => {
    const s = createSellingSession();
    s.orders = [order(0.1)];
    tickSelling(s, 1000, { expectedCustomers: 0, spawnCustomer: () => order() });
    expect(drainFx(s).map(f => f.kind)).toContain('lost');
  });

  it('hàng đợi có giới hạn (tab ẩn lâu không phình bộ nhớ / save)', () => {
    const s = createSellingSession();
    for (let i = 0; i < 100; i++) pushFx(s, { kind: 'lost' });
    expect(drainFx(s).length).toBeLessThanOrEqual(20);
  });
});
