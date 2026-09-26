// Lịch của tiệm: mọi hằng số giờ giấc nằm ở đây.

export const OPEN_HOUR = 10;  // 10:00 sáng mở cửa
export const CLOSE_HOUR = 21; // 21:00 (9 giờ tối) đóng cửa
export const DAY_REAL_MS = 4 * 60 * 1000; // cả ca bán quay nhanh trong 4 phút thật (tốc độ 1x)
export const GAME_HOUR_MS = DAY_REAL_MS / (CLOSE_HOUR - OPEN_HOUR); // ≈ 21,8 giây thật / giờ game

// Giờ cao điểm trưa và tối (GDD)
export const RUSH_WINDOWS: readonly (readonly [number, number])[] = [[11.5, 13], [18, 20]];
export const RUSH_HOURS = RUSH_WINDOWS.reduce((sum, [a, b]) => sum + (b - a), 0);
export const OFF_PEAK_HOURS = CLOSE_HOUR - OPEN_HOUR - RUSH_HOURS;

export function isRushHour(gameHour: number): boolean {
  return RUSH_WINDOWS.some(([a, b]) => gameHour >= a && gameHour <= b);
}

// Ngày 1 là Thứ Hai → ngày 6, 7, 13, 14… là cuối tuần
const WEEKDAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'] as const;
export type Weekday = typeof WEEKDAYS[number];

export function weekdayOf(day: number): Weekday {
  return WEEKDAYS[(((day - 1) % 7) + 7) % 7] ?? 'Thứ Hai';
}

export function isWeekend(day: number): boolean {
  const w = weekdayOf(day);
  return w === 'Thứ Bảy' || w === 'Chủ Nhật';
}

export const WEEKEND_CUSTOMER_MULTIPLIER = 1.4;
