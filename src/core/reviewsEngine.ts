import { StarRating, CustomerReview, GameState, NonEmpty } from '../types/game';
import { averagePriceRatio, pricingTarget } from './pricing';
import { GENZ_REVIEW_TEMPLATES, GENZ_USERNAMES, CUST_AVATARS } from '../content/reviews';
import { pick, weightedPick } from './rng';
import { upgradeEffects } from './upgrades';
import { REVIEW_HUMOR, REVIEW_BLOCKED } from '../content/reviewLabels.generated';

export class ReviewsEngine {
  // Trọng số 5 tiêu chí theo GDD
  public static readonly WEIGHTS = {
    taste: 0.30,
    speed: 0.25,
    hygiene: 0.15,
    space: 0.15,
    pricing: 0.15
  };

  // Tính sao tổng hợp
  public static calculateOverallStars(ratings: StarRating): number {
    const score = (
      ratings.taste * this.WEIGHTS.taste +
      ratings.speed * this.WEIGHTS.speed +
      ratings.hygiene * this.WEIGHTS.hygiene +
      ratings.space * this.WEIGHTS.space +
      ratings.pricing * this.WEIGHTS.pricing
    );
    return Math.round(score * 10) / 10;
  }

  // Đánh giá hiệu suất ngày và cập nhật 5 tiêu chí
  public static evaluateDay(
    currentState: GameState,
    perfectFriedRatio: number,
    burntCount: number,
    averageWaitTimeSec: number,
    lostCustomerCount: number,
    servedCount?: number,
    friedCount?: number,
    fastServeCount?: number,
    slowServeCount?: number,
    expensiveCount?: number,
    fairPriceCount?: number
  ): { newRatings: StarRating; generatedReview: CustomerReview; advisorTip: string } {
    const r = { ...currentState.ratings };
    const lostRatio = servedCount === undefined ? (lostCustomerCount > 1 ? 1 : lostCustomerCount === 0 ? 0 : 0.1)
      : lostCustomerCount / Math.max(1, servedCount + lostCustomerCount);
    const burntRatio = friedCount === undefined ? (burntCount > 1 ? 1 : burntCount === 0 ? 0 : 0.1)
      : burntCount / Math.max(1, friedCount);

    // 1. Hương vị (30%): Phụ thuộc vào tỉ lệ Perfect chiên và mẻ cháy
    const tasteBoost = upgradeEffects(currentState.upgrades).tastePct / 100;
    if (perfectFriedRatio >= 0.75 && burntRatio <= 0.05) {
      r.taste = Math.min(5.0, r.taste + 0.15 * (1 + tasteBoost));
    } else if (burntRatio > 0.15 || perfectFriedRatio < 0.4) {
      r.taste = Math.max(2.0, r.taste - 0.25 * (1 - tasteBoost / 2));
    }

    // 2. Tốc độ (25%): Phụ thuộc vào số đơn giao nhanh vs chậm, thời gian chờ và khách bỏ đi
    const fastCount = fastServeCount ?? 0;
    const slowCount = slowServeCount ?? 0;
    if (fastCount > slowCount * 1.5 && lostRatio <= 0.05 && averageWaitTimeSec <= 24) {
      // Phục vụ nhanh vượt trội: sao Tốc độ tăng mạnh
      r.speed = Math.min(5.0, r.speed + 0.3);
    } else if (slowCount > fastCount || lostRatio > 0.15 || averageWaitTimeSec > 35) {
      // Phục vụ chậm, khách đợi mỏi mòn: sao Tốc độ tụt dốc
      r.speed = Math.max(1.5, r.speed - 0.35);
    } else if (servedCount !== undefined) {
      r.speed = r.speed < 3.5 ? Math.min(3.5, r.speed + 0.15) : Math.max(3.5, r.speed - 0.05);
    }

    // 3. Vệ sinh (15%): Dầu chiên sạch / dơ & nâng cấp Vệ sinh
    const hygieneBoost = (upgradeEffects(currentState.upgrades).hygieneBoost || 0) / 100;
    if (currentState.oilCondition === 'clean') {
      r.hygiene = Math.min(5.0, r.hygiene + 0.1 * (1 + hygieneBoost));
    } else if (currentState.oilCondition === 'dirty') {
      r.hygiene = Math.max(1.8, r.hygiene - 0.4);
    }

    // 4. Không gian (15%): Nâng cấp không gian
    const spaceLevel = currentState.upgrades.space?.currentLevel || 1;
    const targetSpaceScore = Math.min(5.0, 3.0 + spaceLevel * 0.4);
    r.space = Math.round((r.space * 0.8 + targetSpaceScore * 0.2) * 10) / 10;

    // 5. Giá cả (15%): So sánh số đơn giá cao vs giá hợp lý trong ngày kết hợp tỷ lệ giá niêm yết
    const expensive = expensiveCount ?? 0;
    const fair = fairPriceCount ?? 0;
    const pricingGoal = pricingTarget(averagePriceRatio(currentState));

    if (expensive > fair && expensive >= 2) {
      // Khách phàn nàn giá mắc, chặt chém so với vỉa hè
      r.pricing = Math.max(1.8, r.pricing - 0.35);
    } else if (fair >= expensive * 1.5 && fair >= 3) {
      // Khách khen giá hợp lý, hạt dẻ sinh viên
      r.pricing = Math.min(5.0, r.pricing + 0.25);
    } else {
      r.pricing = Math.round((r.pricing + (pricingGoal - r.pricing) * 0.4) * 100) / 100;
    }

    r.overall = this.calculateOverallStars(r);

    // Xác định tiêu chí ưu tiên cho review hôm nay:
    // Nếu hôm nay phục vụ quá chậm -> ưu tiên review chê tốc độ
    // Nếu bán quá nhiều món đắt -> ưu tiên review chê giá
    // Ngược lại chọn tiêu chí có điểm thấp nhất
    let weakest: keyof StarRating;
    if (slowCount > fastCount && slowCount >= 3) {
      weakest = 'speed';
    } else if (expensive > fair && expensive >= 3) {
      weakest = 'pricing';
    } else {
      const criteriaScores: NonEmpty<{ key: keyof StarRating; score: number }> = [
        { key: 'taste', score: r.taste },
        { key: 'speed', score: r.speed },
        { key: 'hygiene', score: r.hygiene },
        { key: 'space', score: r.space },
        { key: 'pricing', score: r.pricing }
      ];
      const lowest = criteriaScores.reduce((min, c) => (c.score < min.score ? c : min));
      weakest = lowest.key;
    }

    // Tính sao của review ngày hôm nay (1 đến 5 sao)
    const reviewStars = Math.max(1, Math.min(5, Math.round(r[weakest])));

    // Chọn câu review GenZ phù hợp với tiêu chí
    const matchingTemplates = GENZ_REVIEW_TEMPLATES.filter(
      t => t.criteria === weakest && reviewStars >= t.minStars && reviewStars <= t.maxStars
    );

    const usable = matchingTemplates.filter(t => !REVIEW_BLOCKED.includes(t.text));
    const chosenTemplate = usable.length > 0
      ? weightedPick(usable, t => 1 + (REVIEW_HUMOR[t.text] ?? 1))
      : GENZ_REVIEW_TEMPLATES[0];

    const authorName = pick(GENZ_USERNAMES);
    const avatar = pick(CUST_AVATARS);

    const generatedReview: CustomerReview = {
      id: 'rev_' + Date.now(),
      authorName,
      avatar,
      day: currentState.day,
      stars: reviewStars,
      comment: chosenTemplate.text,
      weakestCriteria: weakest,
      orderSummary: '1 Phần Gà Giòn + Nước ngọt'
    };

    // Lời khuyên của "Cố vấn gợi ý" (Advisor tip)
    const advisorTip = this.generateAdvisorTip(weakest, r[weakest]);

    return {
      newRatings: r,
      generatedReview,
      advisorTip
    };
  }

  // Cố vấn chỉ thẳng nâng cấp nên mua tiếp
  public static generateAdvisorTip(weakest: keyof StarRating, score: number): string {
    switch (weakest) {
      case 'speed':
        return 'Tốc độ phục vụ đang làm mất khách! Hãy nâng cấp Nồi chiên đôi hoặc tuyển thêm Bếp chiên / Thu ngân.';
      case 'taste':
        return score <= 3.0
          ? 'Hương vị bị phàn nàn do gà chiên bị cháy hoặc sống! Hãy nâng cấp Tủ giữ nóng hoặc canh chiên đúng vùng Perfect.'
          : 'Gà ngon nhưng hãy giữ phong độ, mua thêm Tủ giữ nóng giòn 70°C để hương vị luôn 5 sao.';
      case 'hygiene':
        return 'Dầu chiên xuống cấp khiến sao Vệ sinh tụt dốc! Hãy bấm Thay dầu mới ngay hoặc mua Máy lọc dầu tuần hoàn.';
      case 'space':
        return 'Khách chê chỗ ngồi chật chội hoặc nóng bức! Hãy nâng cấp Máy lạnh và mua Bàn ghế gỗ ấm cúng.';
      case 'pricing':
        return 'Giá món đang bị cho là cao so với vỉa hè. Bạn có thể giảm nhẹ giá hoặc tạo Combo ưu đãi để kéo khách.';
      default:
        return 'Tiệm đang vận hành rất tốt! Hãy tiếp tục tích lũy tiền để sớm thuê mặt bằng mới.';
    }
  }
}
