import { describe, it, expect } from 'vitest';
import { ASSETS } from '../src/content/assets';
import { renderSellingView } from '../src/ui/components/SellingView';
import { createInitialState } from '../src/core/state';
import type { SellingSession } from '../src/core/sellingSim';

describe('Gói Game Feel & Visual Juice Polish (v3.2.0)', () => {
  it('1. Toàn bộ các asset emote retro Stardew Valley tự tạo đều tồn tại trong ASSETS.icons', () => {
    expect(ASSETS.icons.emoteYum).toContain('emote_yum.png');
    expect(ASSETS.icons.emoteSweat).toContain('emote_sweat.png');
    expect(ASSETS.icons.emoteAnger).toContain('emote_anger.png');
    expect(ASSETS.icons.emoteHeart).toContain('emote_heart.png');
    expect(ASSETS.icons.emoteDogBark).toContain('emote_dog_bark.png');
    expect(ASSETS.icons.emoteCatPurr).toContain('emote_cat_purr.png');
  });

  it('2. renderSellingView tạo HTML chứa thú cưng tương tác Chó Vàng & Mèo Mướp', () => {
    const state = createInitialState();
    const session: SellingSession = {
      day: 1,
      gameHour: 10,
      speedMultiplier: 1,
      isFastForward: false,
      orders: [],
      timers: { noodle: null, oven: null },
      activeRadioBuff: null,
      assemblyBaseIndex: null,
      assemblyToppings: [],
      dineInTables: [],
      departingCustomers: [],
      helpers: [],
      lastStaffTickAt: 0,
      perfectStreak: 0,
      servedCount: 0,
      totalFriedCount: 0,
      revenueEarned: 0,
      tipsEarned: 0,
      totalOrdersSpawned: 0,
      refundCount: 0,
      tutorial: false,
      disruptionTimerSec: 0,
      activeThief: null
    };

    const html = renderSellingView(state, session);
    // Chó và Mèo đã được gỡ bỏ khỏi màn bán hàng để giao diện gọn gàng, tập trung
    expect(html).not.toContain('id="btn-alley-pet-dog"');
    expect(html).not.toContain('id="btn-alley-pet-cat"');
  });

  it('3. Khi có món chiên trong khay, renderSellingView tạo các hạt khói nóng plate-steam-particles', async () => {
    const state = createInitialState();
    const session: SellingSession = {
      day: 1,
      gameHour: 10,
      speedMultiplier: 1,
      isFastForward: false,
      orders: [],
      timers: { noodle: null, oven: null },
      activeRadioBuff: null,
      assemblyBaseIndex: null,
      assemblyToppings: [],
      dineInTables: [],
      departingCustomers: [],
      helpers: [],
      lastStaffTickAt: 0,
      perfectStreak: 0,
      servedCount: 0,
      totalFriedCount: 0,
      revenueEarned: 0,
      tipsEarned: 0,
      totalOrdersSpawned: 0,
      refundCount: 0,
      tutorial: false,
      disruptionTimerSec: 0,
      activeThief: null
    };

    // Giả lập khay có gà chiên giòn
    const { cookingEngine } = await import('../src/core/cooking');
    cookingEngine.clearTray();
    cookingEngine.addToTray({
      id: 'tray_item_1',
      menuItemId: 'crispy_chicken',
      name: 'Gà Rán Giòn',
      quality: 'perfect',
      icon: '🍗'
    });

    const html = renderSellingView(state, session);
    expect(html).toContain('plate-steam-particles');
    expect(html).toContain('plate-steam-puff');
    cookingEngine.clearTray();
  });
});
