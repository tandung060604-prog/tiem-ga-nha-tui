import { describe, it, expect, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { INITIAL_MENU } from '../src/content/menu';
import { DAILY_INCIDENTS } from '../src/content/dailyIncidents';
import { pickDailyIncident, resolveIncidentChoice } from '../src/core/dailyIncidentsEngine';
import { generateIndividualCustomerReview } from '../src/content/reviews';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { createSellingSession, tickSelling } from '../src/core/sellingSim';
import { audio } from '../src/core/audio';
import { music } from '../src/core/music';
import { CustomerOrder } from '../src/types/game';

beforeAll(() => {
  audio.setMuted(true);
});

describe('4 Trọng Điểm Mới: Âm Thanh Kịch Tính, Review Giá Đắt/Tiện Nghi, Đồng Bộ Kho Sốt & Giang Hồ Đòi Nợ Ngày 8', () => {
  it('1. Món ăn & Sốt Yangnyeom, Bơ Tỏi, Gà Viên đồng bộ mở khóa từ Chương 1 theo unlockDay', () => {
    const spicyChicken = INITIAL_MENU.find(m => m.id === 'spicy_chicken')!;
    const honeyGarlic = INITIAL_MENU.find(m => m.id === 'honey_garlic_chicken')!;
    const popcorn = INITIAL_MENU.find(m => m.id === 'popcorn_chicken')!;

    expect(spicyChicken.chapter).toBe(1);
    expect(spicyChicken.unlockDay).toBe(3);

    expect(honeyGarlic.chapter).toBe(1);
    expect(honeyGarlic.unlockDay).toBe(4);

    expect(popcorn.chapter).toBe(1);
    expect(popcorn.unlockDay).toBe(5);
  });

  it('2. Review phàn nàn giá đắt khi người chơi đặt giá cao (gouging / expensive)', () => {
    const mockOrder: CustomerOrder = {
      id: 'ord_price_test',
      customerName: 'Minh Sinh Viên',
      patienceMax: 40,
      patienceCurrent: 30,
      totalPrice: 55000,
      items: [{ menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true }],
      avatar: '👨‍🎓',
      personality: 'student',
      isBunny: false
    };

    // Đơn hàng bị bán giá cắt cổ gouging (150% giá gốc)
    const reviewGouging = generateIndividualCustomerReview(5, mockOrder, {
      kind: 'complete',
      patienceRatio: 0.75,
      priceRatio: 1.5,
      priceBand: 'gouging'
    });

    expect(reviewGouging.topic).toBe('expensive');
    expect(reviewGouging.weakestCriteria).toBe('pricing');
    expect(reviewGouging.stars).toBeLessThanOrEqual(2);

    // Đơn hàng bán giá rẻ bình dân cheap (80% giá gốc)
    const reviewCheap = generateIndividualCustomerReview(5, mockOrder, {
      kind: 'complete',
      patienceRatio: 0.75,
      priceRatio: 0.8,
      priceBand: 'cheap'
    });
    expect(reviewCheap.topic).toBe('cheap_price');
    expect(reviewCheap.stars).toBe(5);
  });

  it('3. Đánh giá cuối ngày (ReviewsEngine.evaluateDay) kích hoạt topic expensive khi có đơn giá cao', () => {
    const state = createInitialState();
    state.menu.forEach(m => m.currentPrice = Math.round(m.basePrice * 1.35)); // Đẩy giá toàn menu lên 135%

    const evalResult = ReviewsEngine.evaluateDay(
      state,
      0.85, // perfect fried ratio
      0,    // burntCount
      20,   // waitTimeSec
      0,    // lostCount
      15,   // servedCount
      15,   // friedCount
      10,   // fastServeCount
      2,    // slowServeCount
      4,    // expensiveCount >= 2
      1     // fairPriceCount
    );

    expect(evalResult.generatedReview.topic).toBe('expensive');
    expect(evalResult.generatedReview.weakestCriteria).toBe('pricing');
  });

  it('4. Sự kiện Bà Bảy Đất & Đại Ca Beo đòi nợ/bảo kê xuất hiện từ Ngày 8', () => {
    const incident = DAILY_INCIDENTS.find(i => i.id === 'incident_landlord_racketeer_debt')!;
    expect(incident).toBeDefined();
    expect(incident.minDay).toBe(8);
    expect(incident.minChapter).toBe(1);
    expect(incident.phaseTiming).toBe('shift');

    // Ở Ngày 7: không đủ điều kiện
    const stateDay7 = createInitialState();
    stateDay7.day = 7;
    const candidatesDay7 = DAILY_INCIDENTS.filter(i => (i.minDay ?? 1) <= stateDay7.day);
    expect(candidatesDay7.some(i => i.id === 'incident_landlord_racketeer_debt')).toBe(false);

    // Ở Ngày 8: đủ điều kiện xuất hiện
    const stateDay8 = createInitialState();
    stateDay8.day = 8;
    const candidatesDay8 = DAILY_INCIDENTS.filter(i => (i.minDay ?? 1) <= stateDay8.day);
    expect(candidatesDay8.some(i => i.id === 'incident_landlord_racketeer_debt')).toBe(true);
  });

  it('5. Lựa chọn cự cãi nóng nảy có cờ scareCustomers và disruptionSeconds', () => {
    const incident = DAILY_INCIDENTS.find(i => i.id === 'incident_landlord_racketeer_debt')!;
    const riotChoice = incident.choices.find(c => c.id === 'landlord_provoke_riot')!;

    expect(riotChoice.scareCustomers).toBe(true);
    expect(riotChoice.disruptionSeconds).toBe(18);

    const state = createInitialState();
    state.day = 8;
    const result = resolveIncidentChoice(state, incident, riotChoice);
    expect(result.scareCustomers).toBe(true);
    expect(result.disruptionSeconds).toBe(18);
  });

  it('6. SellingSession xử lý gián đoạn đóng băng khách khi bị giang hồ quậy phá', () => {
    const session = createSellingSession();
    session.orders = [
      { id: '1', customerName: 'Khách A', patienceMax: 30, patienceCurrent: 25, totalPrice: 30000, items: [], avatar: '🧑', isBunny: false }
    ];

    // Mô phỏng sự kiện kích hoạt giang hồ quậy phá đuổi khách
    session.orders = [];
    session.disruptionTimerSec = 10;
    session.disruptionNotice = 'Quán đang hỗn loạn';

    let spawnedCount = 0;
    const ctx = {
      expectedCustomers: 20,
      spawnCustomer: () => {
        spawnedCount++;
        return { id: 'spawned', customerName: 'Khách Mới', patienceMax: 30, patienceCurrent: 30, totalPrice: 35000, items: [], avatar: '👧', isBunny: false };
      }
    };

    // Trong lúc disruptionTimerSec > 0 (10s), tick 5 giây: không có khách mới dám vào
    tickSelling(session, 5000, ctx);
    expect(session.orders).toHaveLength(0);
    expect(session.disruptionTimerSec).toBe(5);
    expect(spawnedCount).toBe(0);

    // Tick thêm 6 giây (hết 5s gián đoạn): disruptionTimerSec về 0, quán trở lại bình thường
    tickSelling(session, 6000, ctx);
    expect(session.disruptionTimerSec).toBe(0);
    expect(session.disruptionNotice).toBeUndefined();
  });

  it('7. AudioManager có đủ các hàm âm thanh phân cảnh kịch tính và MusicBox hỗ trợ mode dramatic_incident', () => {
    expect(typeof audio.playDramaticSting).toBe('function');
    expect(typeof audio.playChaosScare).toBe('function');
    expect(typeof audio.playComedyBoing).toBe('function');
    expect(typeof audio.playRomanceChime).toBe('function');

    expect(() => audio.playDramaticSting()).not.toThrow();
    expect(() => audio.playChaosScare()).not.toThrow();
    expect(() => audio.playComedyBoing()).not.toThrow();
    expect(() => audio.playRomanceChime()).not.toThrow();

    music.setMode('dramatic_incident');
    music.setMode('selling');
    music.stop();
  });
});
