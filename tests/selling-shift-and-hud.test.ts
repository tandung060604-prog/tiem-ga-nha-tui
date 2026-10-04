import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/core/state';
import { createSellingSession } from '../src/core/sellingSim';
import { renderSellingView, getShiftDisplayInfo } from '../src/ui/components/SellingView';

describe('SellingView HUD Shift Periods & Sốt Vàng Redesign (Jev MCP Option A)', () => {
  it('1. getShiftDisplayInfo trả về đúng icon, nhãn và class cho 4 ca thời gian và ca cao điểm', () => {
    // 10:00 -> Ca Trưa (off-peak)
    const noon = getShiftDisplayInfo(10.5);
    expect(noon.title).toBe('Ca Trưa');
    expect(noon.className).toBe('shift-noon');
    expect(noon.icon).toContain('icon_shift_noon.png');

    // 12:00 -> Ca Cao Điểm Trưa (rush hour: 11.5 - 13.0)
    const rushNoon = getShiftDisplayInfo(12.0);
    expect(rushNoon.title).toBe('CA CAO ĐIỂM');
    expect(rushNoon.className).toBe('shift-rush');
    expect(rushNoon.icon).toContain('icon_fire_rush.png');

    // 14:00 -> Ca Chiều (13.0 - 17.0)
    const afternoon = getShiftDisplayInfo(14.0);
    expect(afternoon.title).toBe('Ca Chiều');
    expect(afternoon.className).toBe('shift-afternoon');
    expect(afternoon.icon).toContain('icon_shift_afternoon.png');

    // 17:30 -> Ca Tối (17.0 - 19.5, lưu ý 18.0 - 20.0 là rush tối)
    const evening = getShiftDisplayInfo(17.5);
    expect(evening.title).toBe('Ca Tối');
    expect(evening.className).toBe('shift-evening');
    expect(evening.icon).toContain('icon_shift_evening.png');

    // 19:00 -> Ca Cao Điểm Tối (rush hour: 18.0 - 20.0)
    const rushEvening = getShiftDisplayInfo(19.0);
    expect(rushEvening.title).toBe('CA CAO ĐIỂM');
    expect(rushEvening.className).toBe('shift-rush');

    // 20.5 (20:30) -> Ca Đêm (>= 19.5 hoặc sau rush)
    const night = getShiftDisplayInfo(20.5);
    expect(night.title).toBe('Ca Đêm');
    expect(night.className).toBe('shift-night');
    expect(night.icon).toContain('icon_shift_night.png');
  });

  it('2. renderSellingView ẩn hoàn toàn chữ Sốt Vàng trên HUD kể cả khi buffActive = true', () => {
    const state = createInitialState();
    state.secretSauceDay = {
      day: 1,
      targetOrder: 5,
      actualOrder: 5,
      unlocked: true,
      buffActive: true,
      buffUsedForDay: 1,
      bonusRevenue: 15000
    };
    const session = createSellingSession();

    const html = renderSellingView(state, session);

    // Không còn chữ Sốt Vàng hay badge sauce-buff-hud-badge
    expect(html).not.toContain('sauce-buff-hud-badge');
    expect(html).not.toContain('Sốt Vàng');
  });

  it('3. renderSellingView sử dụng chung template session-ambience không có layer lót dưới', () => {
    const state = createInitialState();
    const session = createSellingSession();
    session.gameHour = 14.5; // Ca Chiều

    const html = renderSellingView(state, session);

    expect(html).toContain('session-ambience shift-afternoon');
    expect(html).toContain('Ca Chiều');
    expect(html).toContain('Nắng Xế Hoàng Hôn');
    expect(html).toContain('icon_shift_afternoon.png');
  });
});
