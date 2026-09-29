import { describe, it, expect } from 'vitest';
import { tutorialStep, shouldRunTutorial, TutorialState, TUTORIAL_TEXT } from '../src/core/tutorial';
import { CookingEngine, CookingState } from '../src/core/cooking';
import { createSellingSession, tickSelling } from '../src/core/sellingSim';
import { createInitialState, migrateSave } from '../src/core/state';
import { CustomerOrder, TrayItem } from '../src/types/game';

const order = (items: [string, number][]): CustomerOrder => ({
  id: 'o1', customerName: 'Khách', avatar: '🙂', isDelivery: false,
  items: items.map(([menuItemId, count]) => ({ menuItemId, count, served: 0, completed: false })),
  patienceMax: 40, patienceCurrent: 40, totalPrice: 50000, startTime: 0
});
const idle: CookingState = { isFrying: false, fryingType: 'chicken', progress: 0 };
const frying = (progress: number): CookingState => ({ isFrying: true, fryingType: 'chicken', progress });
const item = (menuItemId: string, quality: TrayItem['quality'] = 'perfect'): TrayItem => ({ id: menuItemId + quality, menuItemId, name: '', icon: '', quality });
const started: TutorialState = { introSeen: true, servedAtStart: 0 };

describe('Bác Ba chỉ bước tiếp theo từ trạng thái thật của ca', () => {
  it('chưa đọc lời mở đầu → intro', () => {
    const s = createSellingSession();
    s.orders = [order([['crispy_chicken', 1]])];
    expect(tutorialStep({ introSeen: false, servedAtStart: 0 }, s, idle, [])).toBe('intro');
  });

  it('một lượt gà + nước: thả gà → chờ → nhấc → rót nước → lên món → xong', () => {
    const s = createSellingSession();
    s.orders = [order([['crispy_chicken', 1], ['soda', 1]])];
    expect(tutorialStep(started, s, idle, [])).toBe('fry-chicken');
    expect(tutorialStep(started, s, frying(10), [])).toBe('wait');
    expect(tutorialStep(started, s, frying(CookingEngine.ZONES.goodLow - 1), [])).toBe('wait'); // chưa vàng giòn
    expect(tutorialStep(started, s, frying(CookingEngine.AUTO_LIFT_AT), [])).toBe('lift');
    expect(tutorialStep(started, s, idle, [item('crispy_chicken')])).toBe('drink');
    expect(tutorialStep(started, s, idle, [item('crispy_chicken'), item('soda', 'good')])).toBe('serve');
    s.servedCount = 1;
    expect(tutorialStep(started, s, idle, [])).toBe('done');
  });

  it('khách gọi 7Up → chỉ máy nước, không bảo thả gà', () => {
    const s = createSellingSession();
    s.orders = [order([['seven_up', 1]])];
    expect(tutorialStep(started, s, idle, [])).toBe('drink');
  });

  it('khách gọi khoai → chỉ nút khoai; lỡ nhấc gà sống → chỉ bỏ món sống', () => {
    const s = createSellingSession();
    s.orders = [order([['shake_fries', 1]])];
    expect(tutorialStep(started, s, idle, [])).toBe('fry-fries');
    expect(tutorialStep(started, s, idle, [item('shake_fries', 'raw')])).toBe('discard-raw');
  });

  it('khách gọi gà viên popcorn → chỉ khay gà viên để chiên', () => {
    const s = createSellingSession();
    s.orders = [order([['popcorn_chicken', 1]])];
    expect(tutorialStep(started, s, idle, [])).toBe('fry-popcorn');
  });

  it('khách gọi cánh gà sốt cay → Bác Ba chỉ khay sốt Yangnyeom trước, ướp xong mới thả gà', () => {
    const s = createSellingSession();
    s.orders = [order([['spicy_chicken', 1]])];
    expect(tutorialStep(started, s, idle, [], null)).toBe('season-spicy');
    expect(tutorialStep(started, s, idle, [], 'spicy')).toBe('fry-chicken');
  });

  it('khách gọi gà sốt bơ tỏi → Bác Ba chỉ khay sốt Bơ Tỏi trước, ướp xong mới thả gà', () => {
    const s = createSellingSession();
    s.orders = [order([['honey_garlic_chicken', 1]])];
    expect(tutorialStep(started, s, idle, [], null)).toBe('season-honey');
    expect(tutorialStep(started, s, idle, [], 'honey')).toBe('fry-chicken');
  });

  it('mọi bước đều có lời thoại; bước cần bấm nút có chỗ chỉ vào', () => {
    for (const [step, t] of Object.entries(TUTORIAL_TEXT)) {
      expect(t.text.length, step).toBeGreaterThan(20);
      if (step !== 'done') expect(t.target, step).toBeTruthy();
    }
  });
});

describe('hướng dẫn chỉ bật một lần, cho tiệm mới', () => {
  it('ngày 1 chưa học → bật; đã học hoặc qua ngày 1 → không', () => {
    const s = createInitialState();
    expect(shouldRunTutorial(s)).toBe(true);
    expect(shouldRunTutorial({ ...s, tutorialDone: true })).toBe(false);
    expect(shouldRunTutorial({ ...s, day: 2 })).toBe(false);
  });

  it('save cũ (chưa có cờ) đã qua ngày 1 → coi như đã học', () => {
    const old = JSON.parse(JSON.stringify(createInitialState()));
    delete old.tutorialDone;
    old.day = 12;
    expect(migrateSave(old)?.state.tutorialDone).toBe(true);
    const fresh = JSON.parse(JSON.stringify(createInitialState()));
    delete fresh.tutorialDone;
    expect(migrateSave(fresh)?.state.tutorialDone).toBe(false);
  });

  it('trong lúc Bác Ba nói: đồng hồ, khách, hàng chờ đứng yên', () => {
    const s = createSellingSession();
    s.orders = [order([['crispy_chicken', 1]])];
    s.tutorial = true;
    const hour = s.gameHour;
    const events = tickSelling(s, 60000, { expectedCustomers: 20, spawnCustomer: () => order([['soda', 1]]) });
    expect(events).toEqual([]);
    expect(s.gameHour).toBe(hour);
    expect(s.orders[0]!.patienceCurrent).toBe(40);
    expect(s.orders).toHaveLength(1);
  });
});
