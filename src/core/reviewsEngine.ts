import { StarRating, CustomerReview, GameState } from '../types/game';
import { averagePriceRatio, pricingTarget } from './pricing';
import { PROCEDURAL_REVIEW_TEMPLATES, PERSONA_AUTHORS, ReviewTemplate } from '../content/reviews';
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

  // Tạo tóm tắt đơn hàng thực tế của khách review hôm nay
  private static formatOrderSummary(topSellerId?: string): string {
    switch (topSellerId) {
      case 'crispy_chicken':
        return '1 Combo Gà Giòn + Khoai Tây Lắc';
      case 'spicy_chicken':
        return '2 Má Đùi Chiên Cay + Fanta Cam';
      case 'shake_fries':
        return '1 Phần Gà Rán + Khoai Lắc Phô Mai';
      case 'cheese_stick':
        return '1 Combo Gà Giòn + Phô Mai Que Kéo Sợi';
      case 'popcorn_chicken':
        return '1 Hộp Gà Viên Popcorn + Coca-Cola';
      case 'pasta_beef':
        return '1 Đĩa Mì Ý Bò Bằm + Gà Giòn Sốt Cay';
      case 'biscuit_honey':
        return '1 Combo Bánh Biscuit Mật Ong + Gà Rán';
      default:
        return '1 Combo Gà Giòn Vàng Rụm + Nước Giải Khát';
    }
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
    fairPriceCount?: number,
    wrongOrderCount?: number,
    missedItemsCount?: number,
    topSellerId?: string
  ): { newRatings: StarRating; generatedReview: CustomerReview; advisorTip: string } {
    const r = { ...currentState.ratings };
    const lostRatio = servedCount === undefined ? (lostCustomerCount > 1 ? 1 : lostCustomerCount === 0 ? 0 : 0.1)
      : lostCustomerCount / Math.max(1, servedCount + lostCustomerCount);
    const burntRatio = friedCount === undefined ? (burntCount > 1 ? 1 : burntCount === 0 ? 0 : 0.1)
      : burntCount / Math.max(1, friedCount);

    const wrongCount = wrongOrderCount ?? 0;
    const missedCount = missedItemsCount ?? 0;

    // 1. Hương vị (30%): Phụ thuộc vào tỉ lệ Perfect chiên, mẻ cháy và việc lên sai món
    const tasteBoost = upgradeEffects(currentState.upgrades).tastePct / 100;
    if (perfectFriedRatio >= 0.75 && burntRatio <= 0.05 && wrongCount === 0) {
      r.taste = Math.min(5.0, r.taste + 0.15 * (1 + tasteBoost));
    } else if (burntRatio > 0.15 || perfectFriedRatio < 0.4 || wrongCount > 0) {
      const wrongPenalty = wrongCount * 0.2;
      r.taste = Math.max(1.5, r.taste - (0.25 * (1 - tasteBoost / 2) + wrongPenalty));
    }

    // 2. Tốc độ (25%): Phụ thuộc vào số đơn giao nhanh vs chậm, thời gian chờ, khách bỏ đi và miss đơn
    const fastCount = fastServeCount ?? 0;
    const slowCount = slowServeCount ?? 0;
    if (fastCount > slowCount * 1.5 && lostRatio <= 0.05 && averageWaitTimeSec <= 24 && wrongCount === 0 && missedCount === 0) {
      // Phục vụ nhanh vượt trội: sao Tốc độ tăng mạnh
      r.speed = Math.min(5.0, r.speed + 0.3);
    } else if (slowCount > fastCount || lostRatio > 0.12 || averageWaitTimeSec > 35 || wrongCount > 0 || missedCount > 0) {
      // Phục vụ chậm hoặc có sự cố giao nhầm/thiếu món: sao Tốc độ tụt dốc
      const errorPenalty = wrongCount * 0.2 + missedCount * 0.15;
      r.speed = Math.max(1.2, r.speed - 0.35 - errorPenalty);
    } else if (servedCount !== undefined) {
      r.speed = r.speed < 3.5 ? Math.min(3.5, r.speed + 0.15) : Math.max(3.5, r.speed - 0.05);
    }

    // 3. Vệ sinh (15%): Dầu chiên sạch / dơ & nâng cấp Vệ sinh
    const hygieneBoost = (upgradeEffects(currentState.upgrades).hygieneBoost || 0) / 100;
    if (currentState.oilCondition === 'clean') {
      r.hygiene = Math.min(5.0, r.hygiene + 0.1 * (1 + hygieneBoost));
    } else if (currentState.oilCondition === 'dirty') {
      r.hygiene = Math.max(1.5, r.hygiene - 0.45);
    }

    // 4. Không gian (15%): Nâng cấp không gian
    const spaceLevel = currentState.upgrades.space?.currentLevel || 1;
    const targetSpaceScore = Math.min(5.0, 2.8 + spaceLevel * 0.4);
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

    // Xác định chủ đề trọng tâm phản ánh thực tế sự kiện ngày hôm nay:
    let topic = 'general_praise';
    let weakest: keyof StarRating = 'taste';
    let reviewStars = 5;

    if (wrongCount > 0) {
      // Ưu tiên 1: Quán làm sai món của khách
      topic = 'wrong_order';
      weakest = 'taste';
      reviewStars = Math.min(2, Math.max(1, Math.round(r.taste)));
    } else if (lostCustomerCount >= 2 || missedCount > 0) {
      // Ưu tiên 2: Khách bỏ về vì chờ quá lâu hoặc bị thiếu món
      topic = 'missed_order';
      weakest = 'speed';
      reviewStars = Math.min(2, Math.max(1, Math.round(r.speed)));
    } else if (burntCount >= 2) {
      // Ưu tiên 3: Gà chiên bị cháy
      topic = 'burnt_food';
      weakest = 'taste';
      reviewStars = Math.min(2, Math.max(1, Math.round(r.taste)));
    } else if (currentState.oilCondition === 'dirty') {
      // Ưu tiên 4: Dầu đen mất vệ sinh
      topic = 'dirty_oil';
      weakest = 'hygiene';
      reviewStars = Math.min(2, Math.max(1, Math.round(r.hygiene)));
    } else if (slowCount > fastCount && slowCount >= 3) {
      // Ưu tiên 5: Tốc độ chậm
      topic = 'missed_order';
      weakest = 'speed';
      reviewStars = Math.min(3, Math.max(2, Math.round(r.speed)));
    } else if (expensive > fair && expensive >= 3) {
      // Ưu tiên 6: Giá cả đắt đỏ
      topic = 'expensive';
      weakest = 'pricing';
      reviewStars = Math.min(3, Math.max(2, Math.round(r.pricing)));
    } else if (spaceLevel <= 1 && currentState.day >= 4) {
      // Ưu tiên 7: Không gian vỉa hè chật chội
      topic = 'bad_space';
      weakest = 'space';
      reviewStars = Math.min(3, Math.max(2, Math.round(r.space)));
    } else {
      // Ngày kinh doanh tốt / xuất sắc:
      if (spaceLevel >= 4) {
        topic = 'great_space';
        weakest = 'space';
        reviewStars = Math.min(5, Math.max(4, Math.round(r.space)));
      } else if (fair >= expensive * 2 && fair >= 3) {
        topic = 'cheap_price';
        weakest = 'pricing';
        reviewStars = Math.min(5, Math.max(4, Math.round(r.pricing)));
      } else if (fastCount >= 4 && fastCount > slowCount * 2) {
        topic = 'fast_speed';
        weakest = 'speed';
        reviewStars = Math.min(5, Math.max(4, Math.round(r.speed)));
      } else {
        topic = perfectFriedRatio >= 0.7 ? 'perfect_food' : 'general_praise';
        weakest = 'taste';
        reviewStars = Math.min(5, Math.max(4, Math.round(r.taste)));
      }
    }

    // Lọc template tương ứng với chủ đề hôm nay
    const matchingTemplates = PROCEDURAL_REVIEW_TEMPLATES.filter(
      t => t.topic === topic && reviewStars >= t.minStars && reviewStars <= t.maxStars
    );

    const fallbackTemplates = PROCEDURAL_REVIEW_TEMPLATES.filter(
      t => t.criteria === weakest && reviewStars >= t.minStars && reviewStars <= t.maxStars
    );

    const pool = matchingTemplates.length > 0 ? matchingTemplates : fallbackTemplates.length > 0 ? fallbackTemplates : PROCEDURAL_REVIEW_TEMPLATES;
    const usable = pool.filter(t => !REVIEW_BLOCKED.includes(t.text));
    const chosenTemplate: ReviewTemplate = usable.length > 0
      ? weightedPick(usable, t => 1 + (REVIEW_HUMOR[t.text] ?? 1))
      : pool[0]!;

    const orderSummary = this.formatOrderSummary(topSellerId);
    const comment = chosenTemplate.text.replace(/\[ORDER\]/g, orderSummary);

    const author = pick(PERSONA_AUTHORS);

    const generatedReview: CustomerReview = {
      id: 'rev_' + Date.now(),
      authorName: author.name,
      avatar: author.avatar,
      day: currentState.day,
      stars: reviewStars,
      comment,
      tags: chosenTemplate.tags ?? ['#TiemGaNhaTui', '#Hem1102'],
      weakestCriteria: weakest,
      orderSummary
    };

    // Lời khuyên của "Cố vấn gợi ý" (Advisor tip) thực tế theo ngày
    const advisorTip = this.generateAdvisorTip(
      weakest,
      r[weakest],
      wrongCount,
      lostCustomerCount,
      burntCount,
      currentState.oilCondition
    );

    return {
      newRatings: r,
      generatedReview,
      advisorTip
    };
  }

  // Cố vấn chỉ thẳng nguyên nhân và giải pháp theo thực tế xảy ra trong ngày
  public static generateAdvisorTip(
    weakest: keyof StarRating,
    score: number,
    wrongOrderCount: number = 0,
    lostCount: number = 0,
    burntCount: number = 0,
    oilCondition: string = 'clean'
  ): string {
    if (wrongOrderCount > 0) {
      return `Bác Ba nhắc: Hôm nay quán có ${wrongOrderCount} đơn bị lên sai món! Con nhớ quan sát kỹ bong bóng gọi món của khách trước khi bấm KENG lên món nhé.`;
    }
    if (lostCount > 0) {
      return `Bác Ba nhắc: Có ${lostCount} khách bỏ về vì đợi lâu! Con nhớ chiên sẵn vài mẻ gà để sẵn trong khay giữ nóng vào giờ cao điểm nha.`;
    }
    if (burntCount > 0) {
      return `Bác Ba nhắc: Gà bị cháy ${burntCount} mẻ làm khách chê đắng! Canh kim nhiệt độ chạm vạch vàng kim (Perfect) là vớt ngay nhé con.`;
    }
    if (oilCondition === 'dirty') {
      return 'Bác Ba nhắc: Dầu chiên đen quá rồi con ơi, khách chê nồng mùi khét kìa! Vào bếp bấm "Thay dầu mới (150k)" ngay đi.';
    }

    switch (weakest) {
      case 'speed':
        return 'Tốc độ phục vụ đang làm mất khách! Hãy nâng cấp Thiết bị bếp hoặc tuyển thêm Phụ bếp / Thu ngân.';
      case 'taste':
        return score <= 3.0
          ? 'Hương vị bị phàn nàn! Hãy nâng cấp Tủ giữ nóng hoặc mua thêm nước sốt đặc biệt.'
          : 'Gà ngon chuẩn vị! Giữ vững phong độ và mua thêm Tủ giữ nóng giòn 70°C để hương vị luôn 5 sao.';
      case 'hygiene':
        return 'Dầu chiên xuống cấp khiến sao Vệ sinh tụt! Hãy thay dầu thường xuyên hoặc sắm Thùng rác nắp kín / Máy lọc dầu.';
      case 'space':
        return score <= 3.0
          ? 'Khách chê ngồi vỉa hè nóng bức hoặc chật chội! Hãy gom tiền nâng cấp Máy lạnh và Bàn ghế gỗ ấm cúng.'
          : 'Không gian ấm cúng, decor đẹp mắt! Nâng cấp tiếp phòng lạnh view hẻm để đón khách sang.';
      case 'pricing':
        return 'Khách phàn nàn giá món hơi chát so với vỉa hè. Bạn có thể giảm nhẹ giá trong Thực đơn để khách quay lại đông hơn.';
      default:
        return 'Tiệm đang vận hành cực kỳ mượt mà! Hãy tiếp tục duy trì phong độ để tích lũy tiền mở rộng tiệm nhé.';
    }
  }
}
