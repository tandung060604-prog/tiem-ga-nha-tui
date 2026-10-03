import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/core/state';
import { checkPoliceOilInspection, changeOil, OIL_CHANGE_COST } from '../src/core/day';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { tickSelling, createSellingSession, SellingSession } from '../src/core/sellingSim';
import { CustomerOrder } from '../src/types/game';
import { OPEN_HOUR, CLOSE_HOUR, GAME_HOUR_MS } from '../src/core/clock';

describe('Hệ Thống Công An Kiểm Tra Dầu Đen & Realtime Reviews', () => {
  it('không kích hoạt kiểm tra khi dầu còn sạch (clean)', () => {
    const state = createInitialState();
    state.oilCondition = 'clean';
    const insp = checkPoliceOilInspection(state);
    expect(insp).toBeNull();
    expect(state.dirtyOilViolations).toBe(0);
  });

  it('Lần 1: Dầu đen chiên liên tiếp kích hoạt Cảnh cáo ATVSTP và trừ sao Vệ Sinh', () => {
    const state = createInitialState();
    state.oilCondition = 'dirty';
    state.ratings.hygiene = 5.0;
    state.ratings.overall = ReviewsEngine.calculateOverallStars(state.ratings);
    const initialOverall = state.ratings.overall;

    // Mẻ 1: ghi nhận 1 lần
    const insp1 = checkPoliceOilInspection(state);
    expect(insp1).toBeNull();
    expect(state.dirtyOilFryingCount).toBe(1);

    // Mẻ 2: phát hiện và lập biên bản cảnh cáo
    const insp2 = checkPoliceOilInspection(state);
    expect(insp2).not.toBeNull();
    expect(insp2?.strike).toBe(1);
    expect(insp2?.fine).toBe(0);
    expect(state.dirtyOilViolations).toBe(1);

    // Kiểm tra review cảnh cáo đã được thêm vào hệ thống
    expect(state.recentReviews.length).toBeGreaterThan(0);
    const policeReview = state.recentReviews[0];
    expect(policeReview.topic).toBe('police_inspection');
    expect(policeReview.stars).toBeLessThanOrEqual(2);
    expect(policeReview.authorName).toContain('Công An');

    // Điểm vệ sinh và overall bị tụt
    expect(state.ratings.hygiene).toBeLessThan(5.0);
    expect(state.ratings.overall).toBeLessThanOrEqual(initialOverall);
    expect(state.totalReviewsCount).toBeGreaterThan(0);
  });

  it('Lần 2: Tái phạm chiên dầu đen bị phạt 200.000đ và lập biên bản phạt tiền', () => {
    const state = createInitialState();
    state.oilCondition = 'dirty';
    state.money = 500000;
    state.dirtyOilViolations = 1; // đã có 1 lần cảnh cáo trước đó

    // Chiên thêm 2 mẻ dầu đen
    checkPoliceOilInspection(state);
    const insp = checkPoliceOilInspection(state);

    expect(insp).not.toBeNull();
    expect(insp?.strike).toBe(2);
    expect(insp?.fine).toBe(200000);
    expect(state.money).toBe(300000); // Bị trừ 200.000đ
    expect(state.dirtyOilViolations).toBe(2);

    const fineReview = state.recentReviews[0];
    expect(fineReview.comment).toContain('200.000đ');
  });

  it('Lần 3: Tái phạm lần 3 bị xử lý hình sự, Game Over ngay lập tức với Bad Ending', () => {
    const state = createInitialState();
    state.oilCondition = 'dirty';
    state.dirtyOilViolations = 2; // đã bị phạt lần 2

    // Chiên thêm 2 mẻ dầu đen
    checkPoliceOilInspection(state);
    const insp = checkPoliceOilInspection(state);

    expect(insp).not.toBeNull();
    expect(insp?.strike).toBe(3);
    expect(state.dirtyOilViolations).toBe(3);
    expect(state.activeEnding).toBe('bad_police');

    const prisonReview = state.recentReviews[0];
    expect(prisonReview.comment).toContain('BẮT TẠM GIAM');
  });

  it('Thay dầu chiên (changeOil) làm mới dầu và đặt lại bộ đếm chiên dầu bẩn', () => {
    const state = createInitialState();
    state.oilCondition = 'dirty';
    state.money = 300000;
    state.dirtyOilFryingCount = 1;
    state.freeOilFilterUsed = true;

    const ok = changeOil(state);
    expect(ok).toBe(true);
    expect(state.oilCondition).toBe('clean');
    expect(state.dirtyOilFryingCount).toBe(0);
    expect(state.money).toBe(300000 - OIL_CHANGE_COST);
  });

  it('Thang đo đánh giá 1-5 sao điều chỉnh điểm số realtime theo chất lượng', () => {
    const state = createInitialState();
    state.ratings = {
      taste: 3.5,
      speed: 3.5,
      pricing: 3.5,
      hygiene: 3.5,
      space: 3.5,
      overall: 3.5
    };
    const initialCount = state.totalReviewsCount ?? 0;

    // Đánh giá 5 sao về món ngon hoàn hảo
    ReviewsEngine.applyRealtimeReview(state, {
      id: 'rev_test_5star',
      authorName: 'Khách VIP',
      avatar: '🌟',
      stars: 5,
      comment: 'Gà rán tuyệt đỉnh giòn tan!',
      day: 1,
      topic: 'perfect_food'
    });

    expect(state.totalReviewsCount).toBe(initialCount + 1);
    expect(state.ratings.taste).toBeGreaterThan(3.5);
    expect(state.ratings.overall).toBeGreaterThanOrEqual(3.5);

    // Đánh giá 1 sao về cháy khét
    const preBurntOverall = state.ratings.overall;
    ReviewsEngine.applyRealtimeReview(state, {
      id: 'rev_test_1star',
      authorName: 'Khách Quạu',
      avatar: '😡',
      stars: 1,
      comment: 'Gà cháy đen đắng nghét!',
      day: 1,
      topic: 'burnt_food'
    });

    expect(state.ratings.taste).toBeLessThan(4.0);
    expect(state.ratings.overall).toBeLessThan(preBurntOverall);
  });

  it('Số khách dự kiến và số khách xuất hiện được phân bổ đều trong ca bán', () => {
    const session = createSellingSession();
    session.expectedCustomers = 10;
    session.spawnedCount = 2; // đã có 2 khách ban đầu

    let generatedCustomerCount = 0;
    const spawnCustomer = () => {
      generatedCustomerCount++;
      return {
        id: `cust_${generatedCustomerCount}`,
        items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0 }],
        patienceMax: 60,
        patienceCurrent: 60,
        totalPrice: 35000,
        isDelivery: false
      } as CustomerOrder;
    };

    // Mô phỏng chạy qua toàn bộ ca bán từ lúc mở cửa (10h) đến đóng cửa (21h)
    // Tổng thời gian thật của 1 ca bán là DAY_REAL_MS (4 phút = 240.000ms)
    const stepMs = 500;
    const totalShiftMs = (CLOSE_HOUR - OPEN_HOUR) * GAME_HOUR_MS;
    for (let t = 0; t <= totalShiftMs; t += stepMs) {
      // Phục vụ khách ngay khi đến để quầy luôn sẵn sàng đón khách tiếp theo
      if (session.orders.length > 0) {
        session.servedCount += session.orders.length;
        session.orders.length = 0;
      }
      tickSelling(session, stepMs, {
        expectedCustomers: 10,
        spawnCustomer
      });
    }

    // Tất cả các khách dự kiến đều phải được sinh ra (spawnedCount == expectedCustomers)
    expect(session.spawnedCount).toBe(10);
    expect(generatedCustomerCount).toBe(8); // 2 khách ban đầu + 8 khách sinh trong ngày = 10
  });
});
