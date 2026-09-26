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
    friedCount?: number
  ): { newRatings: StarRating; generatedReview: CustomerReview; advisorTip: string } {
    const r = { ...currentState.ratings };
    // Chấm theo TỈ LỆ (mô phỏng: ngưỡng tuyệt đối "bỏ >1 khách / cháy >1 mẻ" làm sao Tốc độ, Hương vị kẹt đáy
    // khi tiệm đông khách ở chương sau). Không truyền số khách/số mẻ → giữ luật cũ.
    const lostRatio = servedCount === undefined ? (lostCustomerCount > 1 ? 1 : lostCustomerCount === 0 ? 0 : 0.1)
      : lostCustomerCount / Math.max(1, servedCount + lostCustomerCount);
    const burntRatio = friedCount === undefined ? (burntCount > 1 ? 1 : burntCount === 0 ? 0 : 0.1)
      : burntCount / Math.max(1, friedCount);

    // 1. Hương vị (30%): Phụ thuộc vào tỉ lệ Perfect chiên và mẻ cháy
    // Nâng cấp bếp (tủ giữ nóng, nồi áp suất): tăng nhanh hơn, tụt chậm hơn
    const tasteBoost = upgradeEffects(currentState.upgrades).tastePct / 100;
    if (perfectFriedRatio >= 0.75 && burntRatio <= 0.05) {
      r.taste = Math.min(5.0, r.taste + 0.15 * (1 + tasteBoost));
    } else if (burntRatio > 0.15 || perfectFriedRatio < 0.4) {
      r.taste = Math.max(2.0, r.taste - 0.25 * (1 - tasteBoost / 2));
    }

    // 2. Tốc độ (25%): Phụ thuộc thời gian chờ và khách bỏ đi
    if (lostRatio <= 0.05 && averageWaitTimeSec <= 22) {
      r.speed = Math.min(5.0, r.speed + 0.2);
    } else if (lostRatio > 0.2 || averageWaitTimeSec > 35) {
      r.speed = Math.max(1.5, r.speed - 0.3);
    } else if (servedCount !== undefined) {
      // Ngày bình thường: dần về mức trung bình 3,5 (mô phỏng: sao Tốc độ từng kẹt đáy 1,5 vĩnh viễn)
      r.speed = r.speed < 3.5 ? Math.min(3.5, r.speed + 0.15) : Math.max(3.5, r.speed - 0.05);
    }

    // 3. Vệ sinh (15%): Dầu chiên sạch / dơ
    if (currentState.oilCondition === 'clean') {
      r.hygiene = Math.min(5.0, r.hygiene + 0.1);
    } else if (currentState.oilCondition === 'dirty') {
      r.hygiene = Math.max(1.8, r.hygiene - 0.4);
    }

    // 4. Không gian (15%): Nâng cấp không gian
    const spaceLevel = currentState.upgrades.space?.currentLevel || 1;
    const targetSpaceScore = Math.min(5.0, 3.0 + spaceLevel * 0.4);
    r.space = Math.round((r.space * 0.8 + targetSpaceScore * 0.2) * 10) / 10;

    // 5. Giá cả (15%): So sánh giá bán với giá gốc
    // Theo giá trung bình các món đang bán so với giá gốc (core/pricing.ts), nhích dần 40%/ngày về đích.
    // Trước: trừ bậc thang 0,6 sao cho MỖI món vượt 125%, tính cả món chưa mở; không có mức giữa.
    const pricingGoal = pricingTarget(averagePriceRatio(currentState));
    r.pricing = Math.round((r.pricing + (pricingGoal - r.pricing) * 0.4) * 100) / 100;

    r.overall = this.calculateOverallStars(r);

    // Xác định tiêu chí yếu nhất
    const criteriaScores: NonEmpty<{ key: keyof StarRating; score: number }> = [
      { key: 'taste', score: r.taste },
      { key: 'speed', score: r.speed },
      { key: 'hygiene', score: r.hygiene },
      { key: 'space', score: r.space },
      { key: 'pricing', score: r.pricing }
    ];

    const lowest = criteriaScores.reduce((min, c) => (c.score < min.score ? c : min));
    const weakest = lowest.key;

    // Tính sao của review ngày hôm nay (1 đến 5 sao)
    const reviewStars = Math.max(1, Math.min(5, Math.round(lowest.score)));

    // Chọn câu review GenZ phù hợp với tiêu chí yếu nhất
    const matchingTemplates = GENZ_REVIEW_TEMPLATES.filter(
      t => t.criteria === weakest && reviewStars >= t.minStars && reviewStars <= t.maxStars
    );

    // Độ hài do Jev chấm sẵn (npm run jev:content): câu hài hơn được chọn nhiều hơn; câu phản cảm bị loại
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
