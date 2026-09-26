import { describe, it, expect } from 'vitest';
import { weekdayOf, isWeekend, isRushHour, OPEN_HOUR, CLOSE_HOUR, WEEKEND_CUSTOMER_MULTIPLIER } from '../src/core/clock';
import { EconomyEngine } from '../src/core/economy';
import { createInitialState } from '../src/core/state';

describe('lịch tiệm (core/clock)', () => {
  it('mở cửa 10:00, đóng cửa 21:00', () => {
    expect(OPEN_HOUR).toBe(10);
    expect(CLOSE_HOUR).toBe(21);
  });

  it('ngày 1 là Thứ Hai, ngày 6–7 là cuối tuần, ngày 8 lại là Thứ Hai', () => {
    expect(weekdayOf(1)).toBe('Thứ Hai');
    expect(weekdayOf(6)).toBe('Thứ Bảy');
    expect(weekdayOf(7)).toBe('Chủ Nhật');
    expect(weekdayOf(8)).toBe('Thứ Hai');
    expect([1, 2, 3, 4, 5, 6, 7, 13, 14].map(isWeekend))
      .toEqual([false, false, false, false, false, true, true, true, true]);
  });

  it('giờ cao điểm trưa 11:30–13:00 và tối 18:00–20:00', () => {
    expect(isRushHour(12)).toBe(true);
    expect(isRushHour(19)).toBe(true);
    expect(isRushHour(15)).toBe(false);
    expect(isRushHour(20.5)).toBe(false);
  });

  it('cuối tuần khách đông hơn ngày thường cùng điều kiện', () => {
    const friday = createInitialState();
    friday.day = 5;
    const saturday = createInitialState();
    saturday.day = 6;
    const weekday = EconomyEngine.calculateDailyCustomerCount(friday);
    const weekend = EconomyEngine.calculateDailyCustomerCount(saturday);
    expect(weekend).toBe(Math.round(weekday * WEEKEND_CUSTOMER_MULTIPLIER));
  });
});
