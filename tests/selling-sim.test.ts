import { describe, it, expect } from 'vitest';
import { createSellingSession, gameDeltaMs, tickSelling, MAX_FRAME_MS, FAST_FORWARD, TickEvent } from '../src/core/sellingSim';
import { DAY_REAL_MS } from '../src/core/clock';
import { OrdersEngine } from '../src/core/orders';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';

const FRAME = 1000 / 60;

// Chạy trọn một ca ở 60fps, không ai phục vụ; trả về số khách đến/bỏ về và số frame
function simulateDay(expectedCustomers: number) {
  seedRandom(1);
  const state = createInitialState();
  const session = createSellingSession();
  let arrived = 0, left = 0, frames = 0;
  for (let done = false; !done && frames < 1e6; frames++) {
    const events: TickEvent[] = tickSelling(session, gameDeltaMs(session, FRAME), {
      expectedCustomers,
      spawnCustomer: () => OrdersEngine.generateOrder(state)
    });
    for (const e of events) {
      if (e.type === 'customerArrived') arrived++;
      if (e.type === 'customerLeft') left++;
      if (e.type === 'dayOver') done = true;
    }
  }
  return { arrived, left, frames, session };
}

describe('mô phỏng ca bán (core/sellingSim)', () => {
  it('một ca 10:00→21:00 dài đúng 4 phút thật ở tốc độ 1x', () => {
    const { frames, session } = simulateDay(16);
    expect(frames * FRAME / 1000).toBeCloseTo(DAY_REAL_MS / 1000, 0);
    expect(DAY_REAL_MS).toBe(4 * 60 * 1000);
    expect(Math.floor(session.gameHour)).toBe(21);
  });

  it('số khách đến cả ngày xấp xỉ số dự kiến (không tính 2 khách mở cửa)', () => {
    const { arrived } = simulateDay(16);
    expect(arrived).toBeGreaterThanOrEqual(14);
    expect(arrived).toBeLessThanOrEqual(17);
  });

  it('không ai phục vụ thì mọi khách đến đều bỏ về, hàng đợi không vượt 5', () => {
    const { arrived, left, session } = simulateDay(16);
    expect(left + session.orders.length).toBe(arrived);
    expect(session.orders.length).toBeLessThanOrEqual(5);
  });

  it('quay lại app sau 5 phút: một frame chỉ trôi tối đa 250ms, khách không bỏ về hàng loạt', () => {
    const session = createSellingSession();
    expect(gameDeltaMs(session, 5 * 60 * 1000)).toBe(MAX_FRAME_MS);
  });

  it('tua nhanh nhân thời gian game đúng một lần', () => {
    const session = createSellingSession();
    session.isFastForward = true;
    expect(gameDeltaMs(session, 100)).toBe(100 * FAST_FORWARD);
  });

  it('tạm dừng thì thời gian đứng yên', () => {
    const session = createSellingSession();
    session.isPaused = true;
    expect(gameDeltaMs(session, 100)).toBe(0);
  });
});
