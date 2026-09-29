import { StarRating, CustomerReview, GameState } from '../types/game';
import { averagePriceRatio, pricingTarget } from './pricing';
import { PROCEDURAL_REVIEW_TEMPLATES, PERSONA_AUTHORS, ReviewTemplate, TOPIC_SENTIMENTS, TOPIC_ADVISOR_HINTS, createReviewReplyOptions, generateIndividualCustomerReview } from '../content/reviews';
import { pick, weightedPick } from './rng';
import { upgradeEffects } from './upgrades';
import { REVIEW_HUMOR, REVIEW_BLOCKED } from '../content/reviewLabels.generated';
import { applyKarmaChange } from '../content/endings';

export class ReviewsEngine {
  // Sinh review riêng cho từng thực khách dựa trên trải nghiệm thực tế
  public static generateCustomerReview = generateIndividualCustomerReview;

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

  // Áp dụng review trực tiếp vào GameState theo thời gian thực (Real-time Review System)
  public static applyRealtimeReview(draft: GameState, review: CustomerReview): void {
    draft.recentReviews.unshift(review);
    if (draft.recentReviews.length > 200) draft.recentReviews.pop();
    draft.totalReviewsCount = (draft.totalReviewsCount ?? 0) + 1;

    // Điều chỉnh các tiêu chí sao theo thang đo 1-5 sao và chủ đề thực tế
    const stars = review.stars;
    const weakest = review.weakestCriteria || 'taste';
    const topic = review.topic || '';

    // Độ dịch chuyển điểm sao cơ bản:
    // 5★: +0.08, 4★: +0.03, 3★: 0, 2★: -0.10, 1★: -0.25
    let delta = 0;
    if (stars === 5) delta = 0.08;
    else if (stars === 4) delta = 0.03;
    else if (stars === 3) delta = 0.0;
    else if (stars === 2) delta = -0.10;
    else if (stars === 1) delta = -0.25;

    // Ảnh hưởng sâu theo chủ đề
    if (topic === 'dirty_oil' || topic === 'police_inspection') {
      draft.ratings.hygiene = Math.max(1.0, Math.min(5.0, draft.ratings.hygiene + (stars <= 2 ? -0.4 : 0.05)));
      draft.ratings.taste = Math.max(1.0, Math.min(5.0, draft.ratings.taste + (stars <= 2 ? -0.2 : 0.03)));
    } else if (topic === 'wrong_order') {
      draft.ratings.taste = Math.max(1.0, Math.min(5.0, draft.ratings.taste - 0.25));
      draft.ratings.speed = Math.max(1.0, Math.min(5.0, draft.ratings.speed - 0.15));
    } else if (topic === 'burnt_food') {
      draft.ratings.taste = Math.max(1.0, Math.min(5.0, draft.ratings.taste - 0.3));
    } else if (topic === 'missed_order' || topic === 'slow_speed') {
      draft.ratings.speed = Math.max(1.0, Math.min(5.0, draft.ratings.speed - 0.25));
    } else if (topic === 'fast_speed') {
      draft.ratings.speed = Math.max(1.0, Math.min(5.0, draft.ratings.speed + 0.1));
    } else if (topic === 'perfect_food') {
      draft.ratings.taste = Math.max(1.0, Math.min(5.0, draft.ratings.taste + 0.1));
    } else if (topic === 'cheap_price') {
      draft.ratings.pricing = Math.max(1.0, Math.min(5.0, draft.ratings.pricing + 0.08));
    } else if (topic === 'expensive') {
      draft.ratings.pricing = Math.max(1.0, Math.min(5.0, draft.ratings.pricing - 0.2));
    } else {
      // Các trường hợp khác áp vào tiêu chí tương ứng
      draft.ratings[weakest] = Math.max(1.0, Math.min(5.0, draft.ratings[weakest] + delta));
    }

    draft.ratings.overall = this.calculateOverallStars(draft.ratings);
  }

  // Tạo bài đánh giá / biên bản chính thức của Công an & Thanh tra ATTP khi phát hiện dầu đen
  public static createPoliceInspectionReview(
    strike: 1 | 2 | 3,
    day: number
  ): CustomerReview {
    const reviewId = 'rev_police_' + Date.now();
    if (strike === 1) {
      return {
        id: reviewId,
        authorName: 'Đồng Chí Nam (Công An Khu Vực)',
        avatar: '👮',
        day,
        stars: 2,
        comment: '⚠️ BIÊN BẢN CẢNH CÁO (LẦN 1): Kiểm tra đột xuất phát hiện tiệm sử dụng chảo dầu chiên đen thui, bốc mùi khét lẹt gây hại cho sức khỏe bà con. Nhắc nhở nghiêm khắc, yêu cầu thay dầu sạch ngay lập tức!',
        weakestCriteria: 'hygiene',
        orderSummary: 'Kiểm tra vệ sinh chảo dầu',
        tags: ['#KiemTraVeSinh', '#CanhCaoLan1', '#DauDen'],
        topic: 'police_inspection',
        personaGroup: 'resident',
        sentiment: 'disappointed',
        advisorHint: 'Bác Ba nhắc nhở nè: Công an phường đã tới tận nơi cảnh cáo rồi đó! Vào bếp bấm "Thay dầu mới (150k)" liền đi kẻo bị phạt tiền nặng nghen con!',
        replyOptions: [
          {
            id: 'opt_police_1_sincere',
            strategy: 'sincere',
            label: 'Chấp hành nghiêm chỉnh',
            text: 'Dạ con xin lỗi đồng chí Nam và bà con cô bác! Con xin rút kinh nghiệm sâu sắc và đã cho thay ngay chảo dầu mới tinh ạ!',
            isRecommended: true,
            customerReaction: 'Đồng chí Nam gật đầu: "Biết lắng nghe và khắc phục liền là tốt. Chú sẽ còn quay lại kiểm tra đột xuất đó nghen!"',
            starBonus: 0.2,
            karmaReward: { community: 2, craftsmanship: 2 }
          },
          {
            id: 'opt_police_1_firm',
            strategy: 'firm',
            label: 'Giải trình phân trần',
            text: 'Do hôm nay khách đông quá nên tiệm chưa kịp xả dầu cũ, tiệm sẽ thay dầu mới ngay!',
            isRecommended: false,
            customerReaction: 'Đồng chí Nam nghiêm giọng: "Đông khách càng phải giữ vệ sinh cho người dân. Lần sau còn tái phạm là phạt tiền đó!"',
            starBonus: 0.1,
            karmaReward: { craftsmanship: 1 }
          }
        ]
      };
    } else if (strike === 2) {
      return {
        id: reviewId,
        authorName: 'Đoàn Thanh Tra Vệ Sinh ATTP',
        avatar: '📋',
        day,
        stars: 1,
        comment: '🚨 BIÊN BẢN XỬ PHẠT HÀNH CHÍNH (LẦN 2): Tái phạm chiên gà bằng dầu đen biến chất, nguy cơ gây ngộ độc và ung thư. Phạt tiền 200.000đ! Cảnh báo: Nếu phát hiện lần 3 sẽ đình chỉ vĩnh viễn và khởi tố hình sự!',
        weakestCriteria: 'hygiene',
        orderSummary: 'Xử phạt vi phạm vệ sinh ATTP',
        tags: ['#XuPhat200k', '#DauDenDocHai', '#TaiPham'],
        topic: 'police_inspection',
        personaGroup: 'resident',
        sentiment: 'furious',
        advisorHint: 'Trời ơi Bác Ba đã dặn rồi mà con không nghe! Bị phạt 200k rồi đó. Lần sau nữa là công an bắt đi tù đóng cửa tiệm luôn đó con ơi!',
        replyOptions: [
          {
            id: 'opt_police_2_sincere',
            strategy: 'sincere',
            label: 'Nộp phạt và cam kết tuyệt đối',
            text: 'Tiệm xin nghiêm túc chấp hành nộp phạt 200.000đ và cam kết hủy toàn bộ dầu đen cũ, bảo đảm 100% an toàn cho thực khách!',
            isRecommended: true,
            customerReaction: 'Đoàn kiểm tra lập biên bản thu tiền phạt: "Tạm tha đình chỉ lần này. Nếu để dân phản ánh thêm lần thứ 3 thì chuẩn bị hầu tòa!"',
            starBonus: 0.2,
            karmaReward: { community: 2, craftsmanship: 3 }
          },
          {
            id: 'opt_police_2_firm',
            strategy: 'firm',
            label: 'Thắc mắc mức phạt',
            text: 'Tiệm xin đóng phạt, nhưng mức phạt 200.000đ với quán vỉa hè là quá nặng!',
            isRecommended: false,
            customerReaction: 'Cán bộ thanh tra đập bàn: "Đầu độc sức khỏe cộng đồng bằng dầu khét mà còn kêu nặng? Muốn niêm phong quán luôn không?"',
            starBonus: 0.0,
            karmaReward: { community: -2 }
          }
        ]
      };
    } else {
      return {
        id: reviewId,
        authorName: 'Công An Quận - Cơ Quan CSĐT',
        avatar: '🚔',
        day,
        stars: 1,
        comment: '⚖️ THI HÀNH LỆNH BẮT TẠM GIAM: Bắt quả tang chủ tiệm cố tình dùng dầu đen biến chất lần thứ 3. Quán bị tịch thu giấy phép, niêm phong vĩnh viễn, chuyển hồ sơ truy tố hình sự!',
        weakestCriteria: 'hygiene',
        orderSummary: 'Khởi tố hình sự & Niêm phong quán',
        tags: ['#KhoiToHinhSu', '#DiTu', '#NiemPhongTiem'],
        topic: 'police_inspection',
        personaGroup: 'resident',
        sentiment: 'furious',
        advisorHint: 'Hết cứu nổi rồi... Dầu đen xào mãi không chịu thay, giờ công an còng tay đi tù rồi con ơi...'
      };
    }
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
      // Dầu đen: phạt nặng vệ sinh + hương vị (khách ăn thấy ngấy, mùi khét)
      r.hygiene = Math.max(1.2, r.hygiene - 0.6);
      r.taste = Math.max(1.5, r.taste - 0.2);
    }
    // Carry-over: hôm trước đóng cửa lúc dầu đen → tiếng xấu lan truyền
    if ((currentState.dirtyOilPenaltyDays ?? 0) > 0) {
      r.hygiene = Math.max(1.5, r.hygiene - 0.15);
      r.taste = Math.max(1.8, r.taste - 0.1);
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
    } else if (expensive >= 2 || (averagePriceRatio(currentState) >= 1.25 && expensive > 0)) {
      // Ưu tiên 6: Giá cả đắt đỏ
      topic = 'expensive';
      weakest = 'pricing';
      reviewStars = Math.min(3, Math.max(1, Math.round(r.pricing)));
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
      orderSummary,
      topic,
      personaGroup: author.group,
      sentiment: TOPIC_SENTIMENTS[topic] || (reviewStars >= 4 ? 'delighted' : 'disappointed'),
      advisorHint: TOPIC_ADVISOR_HINTS[topic] || this.generateAdvisorTip(weakest, r[weakest]),
      replyOptions: createReviewReplyOptions(topic, orderSummary)
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

  // Trả lời phản hồi đánh giá của khách hàng (Interactive Review Reply)
  public static replyToReview(
    draft: GameState,
    reviewId: string,
    optionId: string
  ): { success: boolean; customerReaction: string; bonusText: string } {
    const review = draft.recentReviews.find(r => r.id === reviewId);
    if (!review || !review.replyOptions || review.playerReply) {
      return { success: false, customerReaction: '', bonusText: '' };
    }

    const opt = review.replyOptions.find(o => o.id === optionId);
    if (!opt) {
      return { success: false, customerReaction: '', bonusText: '' };
    }

    review.playerReply = {
      optionId: opt.id,
      text: opt.text || opt.replyText || '',
      customerReaction: opt.customerReaction,
      repliedAtDay: draft.day,
      starBonus: opt.starBonus,
      karmaBonus: opt.karmaReward || {},
    };
    review.ownerReply = opt.text || opt.replyText || '';

    const bonuses: string[] = [];

    // Trả lời đánh giá không cộng thêm sao cho quán (người chơi tự do phản hồi)

    // Tác động chỉ số ngầm Karma
    if (opt.karmaReward) {
      draft.karma = applyKarmaChange(draft.karma, opt.karmaReward);
      if (opt.karmaReward.community) bonuses.push(`${opt.karmaReward.community > 0 ? '+' : ''}${opt.karmaReward.community} Tình Hẻm`);
      if (opt.karmaReward.craftsmanship) bonuses.push(`${opt.karmaReward.craftsmanship > 0 ? '+' : ''}${opt.karmaReward.craftsmanship} Tay Nghề`);
      if (opt.karmaReward.ambition) bonuses.push(`${opt.karmaReward.ambition > 0 ? '+' : ''}${opt.karmaReward.ambition} Tham Vọng`);
    }

    return {
      success: true,
      customerReaction: opt.customerReaction,
      bonusText: bonuses.join(' · ')
    };
  }

  // Cố vấn chỉ thẳng nguyên nhân và giải pháp theo thực tế xảy ra trong ngày (giọng miền Tây)
  public static generateAdvisorTip(
    weakest: keyof StarRating,
    score: number,
    wrongOrderCount: number = 0,
    lostCount: number = 0,
    burntCount: number = 0,
    oilCondition: string = 'clean'
  ): string {
    if (wrongOrderCount > 0) {
      return `Bác Ba dặn nè: Bữa nay quán mình có ${wrongOrderCount} đơn bị lên lộn món rồi đó con! Coi chừng coi kỹ bong bóng gọi món của khách rồi hẵng bấm KENG lên món nghen.`;
    }
    if (lostCount > 0) {
      return `Bác Ba nhắc nè: Có ${lostCount} khách bỏ về vì đợi lâu quá trời! Con nhớ chiên sẵn mấy mẻ gà để dành trong khay giữ nóng lúc giờ cao điểm nghen con.`;
    }
    if (burntCount > 0) {
      return `Bác Ba nói thiệt nè: Gà bị cháy tới ${burntCount} mẻ, khách chê đắng nghét luôn! Canh kim nhiệt độ chạm vạch vàng kim (Perfect) là vớt liền nghen con.`;
    }
    if (oilCondition === 'dirty') {
      return 'Bác Ba la nè: Dầu chiên đen thui rồi con ơi, khách chê nồng mùi khét quá hà! Dzô bếp bấm "Thay dầu mới (150k)" liền đi con.';
    }

    switch (weakest) {
      case 'speed':
        return 'Tốc độ phục vụ đang làm mất khách dữ lắm! Nâng cấp Thiết bị bếp hoặc tuyển thêm Phụ bếp / Thu ngân đi con.';
      case 'taste':
        return score <= 3.0
          ? 'Hương vị bị chê quá trời! Nâng cấp Tủ giữ nóng hoặc mua thêm nước sốt đặc biệt dzô đi con.'
          : 'Gà ngon chuẩn vị rồi đó! Giữ vậy hén, mua thêm Tủ giữ nóng giòn 70°C cho hương vị luôn 5 sao nha.';
      case 'hygiene':
        return 'Dầu chiên xuống cấp nên sao Vệ sinh tụt te tua! Thay dầu thường xuyên hoặc sắm Thùng rác nắp kín / Máy lọc dầu đi con.';
      case 'space':
        return score <= 3.0
          ? 'Khách chê ngồi ngoài vỉa hè nóng bức chật chội quá hà! Gom tiền nâng cấp Máy lạnh với Bàn ghế gỗ ấm cúng đi con.'
          : 'Không gian ấm cúng, decor coi dzô con mắt lắm! Nâng cấp tiếp phòng lạnh view hẻm để đón khách sang nha.';
      case 'pricing':
        return 'Khách kêu ca giá món hơi mắc so với vỉa hè. Con giảm nhẹ giá trong Thực đơn chút để khách quay lại đông hơn nghen.';
      default:
        return 'Tiệm đang chạy ngon lành cành đào! Giữ phong độ dậy để tích lũy tiền mở rộng tiệm nha con.';
    }
  }
}
