import { describe, it, expect, beforeAll } from 'vitest';
import { serveFirstOrder, createCustomerSource, closeDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { EconomyEngine } from '../src/core/economy';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { CustomerOrder, TrayItem } from '../src/types/game';
import { audio } from '../src/core/audio';
import { RANDOM_EVENTS } from '../src/content/events';

beforeAll(() => audio.setMuted(true));

const makeTray = (...items: Partial<TrayItem>[]): TrayItem[] =>
  items.map((t, i) => ({
    id: `tray_${i}`,
    menuItemId: 'crispy_chicken',
    name: 'Gà Rán Giòn',
    icon: '🍗',
    quality: 'good',
    ...t
  }));

const makeOrder = (lines: Array<{ menuItemId: string; count: number; served?: number; completed?: boolean }>): CustomerOrder => ({
  id: 'ord_1',
  customerName: 'Khách Thử Nghiệm',
  customerAvatar: 'avatar.png',
  items: lines.map(l => ({
    menuItemId: l.menuItemId,
    count: l.count,
    served: l.served ?? 0,
    completed: l.completed ?? false
  })),
  totalPrice: 45000,
  patienceMax: 60,
  patienceCurrent: 50,
  createdAt: 10.0,
  isDelivery: false
});

describe('Luồng phục vụ: Giao đúng, sai món và thiếu món', () => {
  it('Giao sai món: Không đóng băng hàng đợi, khách cầm món đi, tính đã phục vụ xong, 0đ tiền, tăng wrongOrderCount', () => {
    const session = createSellingSession(1, 1);
    const order = makeOrder([{ menuItemId: 'shake_fries', count: 1 }]);
    session.orders = [order];

    let removedIdx = -1;
    const tray = makeTray({ menuItemId: 'crispy_chicken', name: 'Gà Rán Giòn' });

    const result = serveFirstOrder(
      session,
      tray,
      () => 35000,
      idx => { removedIdx = idx; }
    );

    expect(result.kind).toBe('wrong-item');
    if (result.kind === 'wrong-item') {
      expect(result.paid).toBe(0);
      expect(result.tip).toBe(0);
      expect(result.wrongItemName).toBe('Gà Rán Giòn');
    }
    // Món bị vứt khỏi khay
    expect(removedIdx).toBe(0);
    // Hàng đợi chuyển sang khách tiếp theo
    expect(session.orders.length).toBe(0);
    expect(session.servedCount).toBe(1);
    expect(session.wrongOrderCount).toBe(1);
  });

  it('Giao thiếu món: Khách đã nhận 1 phần, nay bấm keng khi khay hết món khớp -> trừ 30% tiền, hoàn tất đơn', () => {
    const session = createSellingSession(1, 1);
    // Đơn có 2 món: 1 món đã nhận (served: 1), 1 món chưa nhận (served: 0)
    const order = makeOrder([
      { menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true },
      { menuItemId: 'shake_fries', count: 1, served: 0, completed: false }
    ]);
    session.orders = [order];

    // Khay trống không còn món khớp
    const tray: TrayItem[] = [];

    const result = serveFirstOrder(
      session,
      tray,
      () => 30000,
      () => {}
    );

    expect(result.kind).toBe('incomplete-finish');
    if (result.kind === 'incomplete-finish') {
      expect(result.paid).toBe(21000); // 30.000 * 0.7 = 21.000 (phạt 30%)
      expect(result.missingItemIds).toContain('shake_fries');
    }
    expect(session.orders.length).toBe(0);
    expect(session.servedCount).toBe(1);
    expect(session.missedItemsCount).toBe(1);
  });
});

describe('Giãn cách và lượng khách những ngày đầu', () => {
  it('Chương 1, Ngày 1: Lượng khách được điều chỉnh hợp lý, mở cửa chỉ có 1 khách', () => {
    const state = createInitialState();
    state.day = 1;
    state.currentChapter = 1;

    const count = EconomyEngine.calculateDailyCustomerCount(state);
    expect(count).toBeGreaterThanOrEqual(8);
    expect(count).toBeLessThanOrEqual(12);

    const source = createCustomerSource(state, RANDOM_EVENTS[0]);
    const openingQueue = source.opening();
    expect(openingQueue.length).toBe(1); // 1 khách duy nhất lúc mở cửa giúp người chơi làm quen
  });

  it('Khoảng cách xuất hiện (spawnIntervalMs) giãn cách đều đặn và giờ cao điểm dày hơn', () => {
    const intervalNormal = EconomyEngine.spawnIntervalMs(10, false);
    const intervalRush = EconomyEngine.spawnIntervalMs(10, true);

    expect(intervalNormal).toBeGreaterThan(25000); // ~29s
    expect(intervalRush).toBeGreaterThan(15000); // ~17s
    expect(intervalRush).toBeLessThan(intervalNormal);
  });
});

describe('Đánh giá review cuối ngày đa dạng và ngữ nghĩa theo lỗi thực tế', () => {
  it('Có đơn giao sai món -> Review 1-2 sao với tag giao sai món và Bác Ba nhắc nhở', () => {
    const state = createInitialState();
    const evaluation = ReviewsEngine.evaluateDay(
      state,
      0.9, // perfect ratio
      0,   // burnt count
      15,  // avg wait
      0,   // lost count
      8,   // served
      8,   // fried
      6,   // fast
      0,   // slow
      0,   // expensive
      5,   // fair
      2,   // wrongOrderCount = 2
      0,   // missedItemsCount = 0
      'crispy_chicken'
    );

    expect(evaluation.generatedReview.stars).toBeLessThanOrEqual(2);
    expect(evaluation.generatedReview.tags.some(t => ['#GiaoNhamMon', '#LenSaiMon', '#GiaoSaiMon', '#SaiDon'].includes(t))).toBe(true);
    expect(evaluation.advisorTip).toContain('lên lộn món');
  });

  it('Dầu đen dơ -> Review phản ánh dầu khét, mất vệ sinh với tag cảnh báo ATTP', () => {
    const state = createInitialState();
    state.oilCondition = 'dirty';

    const evaluation = ReviewsEngine.evaluateDay(
      state,
      0.8,
      0,
      18,
      0,
      10,
      10,
      5,
      1,
      0,
      5,
      0, // wrong
      0  // missed
    );

    expect(evaluation.generatedReview.stars).toBeLessThanOrEqual(2);
    expect(evaluation.generatedReview.tags.some(t => ['#DauDenXi', '#DauCuKhet', '#DauBan', '#ATTP', '#MatVeSinh'].includes(t))).toBe(true);
    expect(evaluation.advisorTip).toContain('Dầu chiên đen thui');
  });

  it('Sai sót trong ngày trừ điểm Karma Nghệ Nhân và Tình Hẻm', () => {
    const state = createInitialState();
    const beforeCraft = state.karma.craftsmanship;
    const beforeComm = state.karma.community;

    const session = createSellingSession(1, 1);
    session.wrongOrderCount = 1;
    session.missedItemsCount = 1;
    session.lostCount = 1;

    closeDay(state, session, RANDOM_EVENTS[0]);

    expect(state.karma.craftsmanship).toBeLessThan(beforeCraft);
    expect(state.karma.community).toBeLessThan(beforeComm);
  });
});
