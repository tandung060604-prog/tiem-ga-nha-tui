import { describe, it, expect } from 'vitest';
import { renderSummaryModal } from '../src/ui/components/SummaryModal';
import { createInitialState } from '../src/core/state';
import { EconomyEngine } from '../src/core/economy';
import { DayLedger, CustomerReview } from '../src/types/game';

describe('SummaryModal Oil Filter Card Integration (tests/summaryModalOilFilter.test.ts)', () => {
  const dummyLedger: DayLedger = EconomyEngine.finalizeDayLedger({
    day: 1,
    chapter: 1,
    revenueCounter: 200000,
    tips: 10000,
    ingredientCost: 50000,
    wasteCost: 0,
    wages: 20000,
    servedCount: 12,
    lostCount: 0,
    burntCount: 0,
    topSellerId: 'crispy_chicken'
  });

  const dummyReview: CustomerReview = {
    id: 'rev_1',
    authorName: 'Bé Na Foodie',
    avatar: '👧',
    comment: 'Gà giòn rụm thơm ngon lắm ạ!',
    stars: 5,
    tags: ['Ngon', 'Giòn']
  };

  it('1. shows call-to-action button when todayOilFiltered is false', () => {
    const state = createInitialState();
    state.todayOilFiltered = false;
    state.oilCondition = 'dirty';

    const html = renderSummaryModal(state, dummyLedger, dummyReview, 'Chú ý thay dầu nhé con!');

    expect(html).toContain('Lọc Cặn Dầu &amp; Vớt Bột Cháy');
    expect(html).toContain('btn-open-oil-filter');
    expect(html).toContain('Đen Khét ⚠️');
    expect(html).toContain('TIẾT KIỆM 150K');
  });

  it('2. shows completed badge when todayOilFiltered is true', () => {
    const state = createInitialState();
    state.todayOilFiltered = true;
    state.oilCondition = 'clean';

    const html = renderSummaryModal(state, dummyLedger, dummyReview, 'Làm tốt lắm con!');

    expect(html).toContain('Đã Lọc Cặn Dầu Hôm Nay!');
    expect(html).toContain('ĐÃ VỆ SINH');
    expect(html).toContain('Vàng Óng Ả 🌟');
    expect(html).not.toContain('btn-open-oil-filter');
  });

  it('3. adapts contextual message based on medium oil condition', () => {
    const state = createInitialState();
    state.todayOilFiltered = false;
    state.oilCondition = 'medium';

    const html = renderSummaryModal(state, dummyLedger, dummyReview, 'Khuyên bạn');

    expect(html).toContain('Nâu Cánh Gián');
    expect(html).toContain('Dầu đã ngả màu nâu hổ phách');
  });
});
