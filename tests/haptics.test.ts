import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Haptics } from '../src/core/haptics';

describe('haptics engine (vibration feedback)', () => {
  const originalNavigator = globalThis.navigator;

  beforeEach(() => {
    // Mock navigator.vibrate
    const vibrateMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis, 'navigator', {
      value: { vibrate: vibrateMock },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  it('tap() kích hoạt rung nhẹ 10ms', () => {
    Haptics.tap();
    expect(navigator.vibrate).toHaveBeenCalledWith(10);
  });

  it('perfect() kích hoạt rung giòn tan 18ms', () => {
    Haptics.perfect();
    expect(navigator.vibrate).toHaveBeenCalledWith(18);
  });

  it('serveSuccess() kích hoạt nhịp rung kép [18, 40, 22]', () => {
    Haptics.serveSuccess();
    expect(navigator.vibrate).toHaveBeenCalledWith([18, 40, 22]);
  });

  it('warning() kích hoạt nhịp rung cảnh báo trầm [60, 40, 60]', () => {
    Haptics.warning();
    expect(navigator.vibrate).toHaveBeenCalledWith([60, 40, 60]);
  });

  it('không văng lỗi khi navigator.vibrate không tồn tại', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      configurable: true,
      writable: true,
    });
    expect(() => Haptics.tap()).not.toThrow();
    expect(() => Haptics.perfect()).not.toThrow();
    expect(() => Haptics.serveSuccess()).not.toThrow();
    expect(() => Haptics.warning()).not.toThrow();
  });
});
