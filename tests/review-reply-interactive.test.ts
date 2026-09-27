import { describe, it, expect } from 'vitest';
import { ReviewsEngine } from '../src/core/reviewsEngine';
import { createInitialState } from '../src/core/state';
import { DayLedger, GameState } from '../src/types/game';

describe('Interactive Review Reply & Jev Depth Mechanics', () => {
  it('sinh review hàng ngày với đầy đủ chiều sâu persona, tags, advisorHint và 3 options', () => {
    const state: GameState = createInitialState();
    const evalResult = ReviewsEngine.evaluateDay(
      state,
      0.9, // perfectFriedRatio
      0,   // burntCount
      15,  // averageWaitTimeSec
      0,   // lostCustomerCount
      8,   // servedCount
      8,   // friedCount
      6,   // fastServeCount
      0,   // slowServeCount
      0,   // expensiveCount
      8,   // fairPriceCount
      0,   // wrongOrderCount
      0,   // missedItemsCount
      'chicken_crispy' // topSellerId
    );
    const review = evalResult.generatedReview;

    expect(review.id).toBeDefined();
    expect(review.authorName).toBeDefined();
    expect(review.avatar).toBeDefined();
    expect(review.stars).toBeGreaterThanOrEqual(1);
    expect(review.stars).toBeLessThanOrEqual(5);
    expect(review.comment.length).toBeGreaterThan(5);

    // Kiểm tra chiều sâu Jev
    expect(review.personaGroup).toBeDefined();
    expect(['student', 'genz', 'office', 'foodie', 'elder', 'resident', 'creator', 'reviewer', 'shipper']).toContain(review.personaGroup);
    expect(review.sentiment).toBeDefined();
    expect(review.advisorHint).toBeDefined();
    expect(review.advisorHint!.length).toBeGreaterThan(10);
    expect(review.tags).toBeDefined();
    expect(review.tags!.length).toBeGreaterThan(0);

    // Kiểm tra 3 lựa chọn trả lời
    expect(review.replyOptions).toBeDefined();
    expect(review.replyOptions!.length).toBe(3);

    // Có ít nhất 1 lựa chọn được Bác Ba khuyên chọn (isRecommended)
    const recommended = review.replyOptions!.filter(o => o.isRecommended);
    expect(recommended.length).toBe(1);

    // Kiểm tra các chiến lược
    const strategies = review.replyOptions!.map(o => o.strategy);
    expect(strategies).toContain('sincere');
    expect(strategies).toContain('witty');
    expect(strategies).toContain('firm');
  });

  it('xử lý phản hồi đánh giá, cứu vãn điểm sao và gia tăng điểm Karma', () => {
    const state: GameState = createInitialState();
    const evalResult = ReviewsEngine.evaluateDay(
      state,
      0.4, // perfectFriedRatio
      1,   // burntCount
      40,  // averageWaitTimeSec
      2,   // lostCustomerCount
      5,   // servedCount
      6,   // friedCount
      1,   // fastServeCount
      3,   // slowServeCount
      2,   // expensiveCount
      2,   // fairPriceCount
      1,   // wrongOrderCount
      0,   // missedItemsCount
      'chicken_crispy'
    );
    const review = evalResult.generatedReview;
    state.recentReviews.unshift(review);

    const initialStars = state.ratings.overall;
    const initialCommunity = state.karma.community;

    const chosenOption = review.replyOptions!.find(o => o.isRecommended) || review.replyOptions![0];

    const result = ReviewsEngine.replyToReview(state, review.id, chosenOption.id);

    expect(result.success).toBe(true);
    expect(result.customerReaction.length).toBeGreaterThan(5);
    expect(result.bonusText).toBeDefined();

    // Kiểm tra đã lưu lại playerReply
    const updatedReview = state.recentReviews.find(r => r.id === review.id);
    expect(updatedReview?.playerReply).toBeDefined();
    expect(updatedReview?.playerReply?.optionId).toBe(chosenOption.id);
    expect(updatedReview?.playerReply?.text).toBe(chosenOption.text);
    expect(updatedReview?.playerReply?.customerReaction).toBe(result.customerReaction);

    // Kiểm tra điểm sao và Karma tăng lên
    expect(state.ratings.overall).toBeGreaterThanOrEqual(initialStars);
    if (chosenOption.karmaReward?.community) {
      expect(state.karma.community).toBeGreaterThan(initialCommunity);
    }
  });

  it('ngăn chặn việc phản hồi 2 lần trên cùng một đánh giá', () => {
    const state: GameState = createInitialState();
    const review = state.recentReviews[0]; // rev_init_1 của Bé Trúc
    expect(review).toBeDefined();
    expect(review.replyOptions).toBeDefined();

    const optId = review.replyOptions![0].id;

    // Lần 1: Thành công
    const firstReply = ReviewsEngine.replyToReview(state, review.id, optId);
    expect(firstReply.success).toBe(true);

    // Lần 2: Bị chặn (success: false)
    const secondReply = ReviewsEngine.replyToReview(state, review.id, optId);
    expect(secondReply.success).toBe(false);
  });
});
