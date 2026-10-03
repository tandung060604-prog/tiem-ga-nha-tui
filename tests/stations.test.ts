import { describe, it, expect, beforeAll } from 'vitest';
import { TIMER_RECIPES, timerPhase, emptyTimerStations, tickTimers, collectTimer, ASSEMBLY_RECIPES } from '../src/core/stations';
import { startTimerStation, pullTimerStation, assembleAtCounter, makeDrink, stationOpen } from '../src/core/day';
import { CookingEngine } from '../src/core/cooking';
import { createSellingSession } from '../src/core/sellingSim';
import { OrdersEngine } from '../src/core/orders';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { audio } from '../src/core/audio';
import { INITIAL_MENU } from '../src/content/menu';
import { GameState } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

// Mở mọi hợp đồng nguyên liệu + đủ hàng
const fullyStocked = (chapter: number): GameState => {
  const s = createInitialState();
  s.currentChapter = chapter;
  for (const inv of Object.values(s.inventory)) { inv.unlocked = true; inv.amount = 50; inv.batches = [{ amount: 50, daysLeft: 5 }]; }
  return s;
};

describe('mỗi món trong thực đơn đều có trạm làm được', () => {
  it('15/15 món có trạm (trước: 10 món từ Chương 2 trở đi không làm được)', () => {
    expect(INITIAL_MENU.filter(m => !m.station).map(m => m.id)).toEqual([]);
  });
});

describe('nồi mì / lò bánh: hẹn giờ, phải vớt kịp', () => {
  it('đang nấu → chưa lấy được; chín → Perfect; để quá lâu → hỏng', () => {
    const r = TIMER_RECIPES.noodle;
    const t = emptyTimerStations();
    t.noodle = 0;
    tickTimers(t, r.cookMs - 1);
    expect(timerPhase(r, t.noodle)).toBe('cooking');
    expect(collectTimer(t, 'noodle')).toBeNull();
    tickTimers(t, 2);
    expect(collectTimer(t, 'noodle')?.quality).toBe('perfect');
    t.noodle = r.cookMs + r.holdMs + 1;
    expect(collectTimer(t, 'noodle')?.quality).toBe('burnt');
  });

  it('chưa tới chương / chưa ký hợp đồng thì trạm khóa', () => {
    const s = createInitialState();
    expect(startTimerStation(s, createSellingSession(), 'noodle')).toBe('locked');
  });

  it('chạy song song với chảo, trừ nguyên liệu khi bắt đầu, vớt vào khay', () => {
    const s = fullyStocked(3);
    const session = createSellingSession();
    const cook = new CookingEngine();
    cook.startFrying('chicken');
    expect(startTimerStation(s, session, 'oven')).toBe('ok');
    expect(s.inventory.garlic_honey!.amount).toBe(49);
    expect(startTimerStation(s, session, 'oven')).toBe('busy');
    session.timers.oven = TIMER_RECIPES.oven.cookMs;
    expect(pullTimerStation(session, cook, 'oven')).toBe('ok');
    expect(cook.getTray()[0]?.menuItemId).toBe('biscuit_honey');
    expect(cook.getCookState().isFrying).toBe(true);
  });
});

describe('bàn ráp món', () => {
  it('burger cần gà giòn chín trong khay; ráp giữ chất lượng', () => {
    const s = fullyStocked(3);
    const cook = new CookingEngine();
    expect(assembleAtCounter(s, createSellingSession(), cook, 'chicken_burger')).toBe('no-base');
    cook.startFrying('chicken');
    cook.updateFrying(3500);             // vào vùng Perfect
    cook.liftFryer();
    expect(assembleAtCounter(s, createSellingSession(), cook, 'chicken_burger')).toBe('ok');
    expect(cook.getTray()[0]).toMatchObject({ menuItemId: 'chicken_burger', quality: 'perfect' });
    expect(s.inventory.burger_bun!.amount).toBe(49);
  });

  it('gà sống không ráp được', () => {
    const s = fullyStocked(4);
    const cook = new CookingEngine();
    cook.startFrying('chicken');
    cook.setSeasoning('spicy');
    cook.liftFryer();                    // vớt ngay → sống
    expect(assembleAtCounter(s, createSellingSession(), cook, 'chicken_rice')).toBe('no-base');
  });

  it('món ráp chỉ mở từ đúng chương', () => {
    expect(stationOpen(fullyStocked(3), ASSEMBLY_RECIPES.chicken_rice.chapter, [])).toBe(false);
    expect(stationOpen(fullyStocked(4), ASSEMBLY_RECIPES.chicken_rice.chapter, [])).toBe(true);
  });
});

describe('máy nước, gà viên, combo', () => {
  it('trà đào mở ở Chương 3 khi đã ký hợp đồng', () => {
    expect(makeDrink(fullyStocked(2), createSellingSession(), new CookingEngine(), 'peach_tea')).toBe('locked');
    const cook = new CookingEngine();
    expect(makeDrink(fullyStocked(3), createSellingSession(), cook, 'peach_tea')).toBe('ok');
    expect(cook.getTray()[0]?.menuItemId).toBe('peach_tea');
  });

  it('gà viên chín nhanh hơn gà giòn (vùng Perfect ngắn hơn)', () => {
    const t = (type: 'chicken' | 'popcorn') => {
      const c = new CookingEngine();
      c.startFrying(type);
      let ms = 0;
      while (c.calculateCurrentQuality() !== 'perfect') { c.updateFrying(10); ms += 10; }
      return ms;
    };
    expect(t('popcorn')).toBeLessThan(t('chicken'));
  });

  it('combo: khách gọi từng món trong combo, trả giá combo', () => {
    seedRandom(11);
    const s = fullyStocked(3);
    const combos = Array.from({ length: 400 }, () => OrdersEngine.generateOrder(s)).filter(o => o.comboName);
    expect(combos.length).toBeGreaterThan(0);
    const duo = combos.find(o => o.comboName === 'Combo Đôi' || o.comboName === 'Combo Cặp Đôi Hẹn Hò');
    expect(duo?.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ menuItemId: 'crispy_chicken', count: 2 }),
      expect.objectContaining({ menuItemId: 'soda', count: 2 })
    ]));
    expect(duo?.totalPrice).toBe(95000);
  });

  it('chưa làm được gà viên (chương 2) thì không có Bucket gia đình', () => {
    seedRandom(12);
    const s = fullyStocked(2);
    const names = new Set(Array.from({ length: 400 }, () => OrdersEngine.generateOrder(s).comboName));
    expect(names.has('Bucket Gia Đình') || names.has('Bucket Đại Tiệc Gia Đình')).toBe(false);
  });
});
