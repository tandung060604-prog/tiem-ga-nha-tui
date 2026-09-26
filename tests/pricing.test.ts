import { describe, it, expect } from 'vitest';
import {
  adjustPrice, priceBand, priceLimits, demandWeight, customerMultiplierFromPrice, patienceFactorFromPrice,
  pricingTarget, communityDriftFromPrice, averagePriceRatio, MAX_PRICE_RATIO, MIN_PRICE_RATIO
} from '../src/core/pricing';
import { OrdersEngine } from '../src/core/orders';
import { EconomyEngine } from '../src/core/economy';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { closeDay, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState, migrateSave } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { GameState } from '../src/types/game';

const priced = (ratio: number): GameState => {
  const s = createInitialState();
  for (const m of s.menu) m.currentPrice = Math.round((m.basePrice * ratio) / 1000) * 1000;
  return s;
};

describe('luật giá: khoảng cho phép', () => {
  it('chỉ đặt được trong 70%–150% giá gốc; chạm trần/sàn thì không đổi', () => {
    const s = createInitialState();
    const chicken = s.menu.find(m => m.id === 'crispy_chicken')!;
    const { min, max } = priceLimits(chicken);
    expect(max).toBeLessThanOrEqual(chicken.basePrice * MAX_PRICE_RATIO);
    expect(min).toBeGreaterThanOrEqual(chicken.basePrice * MIN_PRICE_RATIO);
    for (let i = 0; i < 50; i++) adjustPrice(chicken, 2000);
    expect(chicken.currentPrice).toBe(max);
    expect(adjustPrice(chicken, 2000)).toBeNull();
    for (let i = 0; i < 50; i++) adjustPrice(chicken, -2000);
    expect(chicken.currentPrice).toBe(min);
    expect(adjustPrice(chicken, -2000)).toBeNull();
  });

  it('save cũ để giá vượt trần → kéo về trần khi tải', () => {
    const raw = JSON.parse(JSON.stringify(createInitialState()));
    raw.menu[0].currentPrice = raw.menu[0].basePrice * 5;
    const { state, repaired } = migrateSave(raw)!;
    expect(state.menu[0]!.currentPrice).toBe(priceLimits(state.menu[0]!).max);
    expect(repaired.some(r => r.includes('price'))).toBe(true);
  });

  it('5 mức giá: Rẻ · Hợp lý · Hơi đắt · Đắt · Cắt cổ', () => {
    expect([0.8, 1, 1.2, 1.35, 1.5].map(priceBand)).toEqual(['cheap', 'fair', 'pricey', 'expensive', 'gouging']);
  });
});

describe('đắt → ít người mua', () => {
  it('món đắt ít được gọi, món rẻ được gọi nhiều hơn', () => {
    expect(demandWeight(1.5)).toBeLessThan(0.1);
    expect(demandWeight(1.25)).toBeLessThan(demandWeight(1));
    expect(demandWeight(0.8)).toBeGreaterThan(demandWeight(1));
    // Khách thật sự tránh món đắt: khoai 150%, gà 100% → gần như ai cũng gọi gà
    const s = createInitialState();
    s.day = 3;
    const fries = s.menu.find(m => m.id === 'shake_fries')!;
    fries.currentPrice = priceLimits(fries).max;
    seedRandom(11);
    let friesOrders = 0, chickenOrders = 0;
    for (let i = 0; i < 400; i++) for (const it of OrdersEngine.generateOrder(s).items) {
      if (it.menuItemId === 'shake_fries') friesOrders++;
      if (it.menuItemId === 'crispy_chicken') chickenOrders++;
    }
    expect(friesOrders * 4).toBeLessThan(chickenOrders);
  });

  it('quán đắt → ít khách ghé mỗi ngày', () => {
    expect(EconomyEngine.calculateDailyCustomerCount(priced(1.4))).toBeLessThan(EconomyEngine.calculateDailyCustomerCount(priced(1)));
    expect(customerMultiplierFromPrice(1.5)).toBe(0.25);
  });

  it('khách tại quầy thấy đắt thì mau bỏ về (tới 110% vẫn chịu chờ)', () => {
    expect(patienceFactorFromPrice(1.1)).toBe(1);
    expect(patienceFactorFromPrice(1.5)).toBeLessThan(0.5);
    seedRandom(5);
    const fair = OrdersEngine.generateOrder(priced(1));
    seedRandom(5);
    const gouge = OrdersEngine.generateOrder(priced(1.5));
    expect(gouge.patienceMax).toBeLessThan(fair.patienceMax);
  });
});

describe('đắt → bị đánh giá thấp → ảnh hưởng kết thúc', () => {
  it('sao Giá cả tụt dần theo mức giá, không bậc thang', () => {
    expect(pricingTarget(1)).toBeCloseTo(4.6);
    expect(pricingTarget(1.05)).toBeCloseTo(4.6);
    expect(pricingTarget(1.3)).toBeLessThan(2.6);
    expect(customerMultiplierFromPrice(1.08)).toBe(1); // vùng Hợp lý không phạt
    const s = priced(1.5);
    const before = s.ratings.pricing;
    const r1 = ReviewsEngine.evaluateDay(s, 0.8, 0, 20, 0, 20, 20).newRatings.pricing;
    expect(r1).toBeLessThan(before);
    expect(before - r1).toBeLessThan(1.5); // tụt dần, không sập một lần
  });

  it('chặt chém → Tình Hẻm giảm mỗi ngày (kết thúc Hạnh phúc cần ≥75, Tập đoàn khi <40)', () => {
    expect(communityDriftFromPrice(1.5)).toBeLessThan(0);
    expect(communityDriftFromPrice(1)).toBe(0);
    const s = priced(1.5);
    closeDay(s, createSellingSession(), eventForDay(2));
    expect(s.karma.community).toBeLessThan(50);
  });

  it('chỉ tính món đang bán (món chương sau chưa mở không kéo sao)', () => {
    const s = createInitialState();
    for (const m of s.menu) if (m.chapter > 1) m.currentPrice = m.basePrice * 3;
    expect(averagePriceRatio(s)).toBe(1);
  });
});
