import { describe, it, expect } from 'vitest';
import { karmaEffects, describeKarmaEffects, KARMA_LIMITS } from '../src/core/karmaEffects';
import { OrdersEngine } from '../src/core/orders';
import { EconomyEngine } from '../src/core/economy';
import { closeDay, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { STORY_ACTS, chooseDialogueOption } from '../src/content/storyNovel';

describe('karma có tác dụng thật trong ca bán', () => {
  it('trung tính (50/50/50) → không có hiệu ứng', () => {
    expect(karmaEffects({ community: 50, craftsmanship: 50, ambition: 50 })).toEqual({ patiencePct: 0, customersPct: 0, overheadPct: 0, tasteDriftPerDay: 0 });
    expect(describeKarmaEffects({ community: 50, craftsmanship: 50, ambition: 50 })).toEqual([]);
  });

  it('hiệu ứng có trần, cả chiều tốt lẫn xấu', () => {
    const hi = karmaEffects({ community: 100, craftsmanship: 100, ambition: 100 });
    const lo = karmaEffects({ community: 0, craftsmanship: 0, ambition: 0 });
    expect(hi.patiencePct).toBe(KARMA_LIMITS.patiencePct);
    expect(lo.patiencePct).toBe(-KARMA_LIMITS.patiencePct);
    expect(lo.overheadPct).toBe(0); // tham vọng thấp không giảm chi phí
    expect(hi.overheadPct).toBe(KARMA_LIMITS.overheadPct);
  });

  it('Tình Hẻm cao → khách kiên nhẫn hơn', () => {
    const base = createInitialState();
    const kind = createInitialState();
    kind.karma.community = 100;
    seedRandom(4);
    const a = OrdersEngine.generateOrder(base);
    seedRandom(4);
    const b = OrdersEngine.generateOrder(kind);
    expect(b.patienceMax).toBeGreaterThan(a.patienceMax);
  });

  it('Tham Vọng cao → thêm khách nhưng mặt bằng đắt hơn', () => {
    const s = createInitialState();
    s.currentChapter = 3;
    const before = EconomyEngine.calculateDailyCustomerCount(s);
    s.karma.ambition = 100;
    expect(EconomyEngine.calculateDailyCustomerCount(s)).toBeGreaterThan(before);
    const plain = createInitialState();
    plain.currentChapter = 3;
    const { ledger: l0 } = closeDay(plain, createSellingSession(), eventForDay(2));
    const { ledger: l1 } = closeDay(s, createSellingSession(), eventForDay(2));
    expect(l1.rent).toBeGreaterThan(l0.rent);
  });

  it('Nghệ Nhân cao → sao Hương vị nhích lên mỗi ngày', () => {
    const plain = createInitialState();
    const artisan = createInitialState();
    artisan.karma.craftsmanship = 100;
    closeDay(plain, createSellingSession(), eventForDay(2));
    closeDay(artisan, createSellingSession(), eventForDay(2));
    expect(artisan.ratings.taste).toBeGreaterThan(plain.ratings.taste);
  });

  it('lựa chọn trong truyện → karma đổi → hiệu ứng đổi', () => {
    const s = createInitialState();
    s.money = 5_000_000; // hồi của chương đang chơi chỉ chọn được khi đã gom đủ tiền cọc
    const act = STORY_ACTS[0];
    const option = act.options?.find(o => (o.karmaEffect.community ?? 0) > 0);
    expect(option).toBeTruthy();
    expect(chooseDialogueOption(s, 0, option!.id).success).toBe(true);
    expect(karmaEffects(s.karma).patiencePct).toBeGreaterThan(0);
  });
});
