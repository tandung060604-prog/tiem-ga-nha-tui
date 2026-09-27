import { describe, it, expect } from 'vitest';
import { PROCEDURAL_REVIEW_TEMPLATES, CUSTOMER_REACTION_POOLS, generateIndividualCustomerReview, resolveCustomerReaction, createReviewReplyOptions } from '../src/content/reviews';
import { renderIncidentPrompt, renderIncidentConfirmPrompt } from '../src/ui/components/DailyIncidentModal';
import { renderReviewReplyModal } from '../src/ui/components/ReviewReplyModal';
import { renderReviewsTab } from '../src/ui/components/ReviewsTab';
import { createInitialState } from '../src/core/state';
import { CustomerOrder, DailyIncident, CustomerReview } from '../src/types/game';

describe('5 Tính Năng Mới: Review Từng Khách, Bác Ba Hỏi Lại, Ẩn Điểm Thưởng & 100+ Mẫu Review/Phản Hồi', () => {
  it('ngân hàng review procedural có hơn 100 mẫu bao quát đủ 12 case và bắt trend GenZ', () => {
    expect(PROCEDURAL_REVIEW_TEMPLATES.length).toBeGreaterThanOrEqual(100);

    const topics = new Set(PROCEDURAL_REVIEW_TEMPLATES.map(t => t.topic));
    expect(topics).toContain('wrong_order');
    expect(topics).toContain('missed_order');
    expect(topics).toContain('slow_speed');
    expect(topics).toContain('burnt_food');
    expect(topics).toContain('dirty_oil');
    expect(topics).toContain('expensive');
    expect(topics).toContain('bad_space');
    expect(topics).toContain('fast_speed');
    expect(topics).toContain('perfect_food');
    expect(topics).toContain('cheap_price');
    expect(topics).toContain('great_space');
    expect(topics).toContain('clean_hygiene');
    expect(topics).toContain('general_praise');

    // Kiểm tra có các tag trendy
    const allTags = PROCEDURAL_REVIEW_TEMPLATES.flatMap(t => t.tags);
    expect(allTags).toContain('#DinhNocKichTran');
    expect(allTags).toContain('#GiaoNhamMon');
    expect(allTags).toContain('#DauDenXi');
  });

  it('ngân hàng phản hồi khách hàng có gần 100 mẫu phân loại theo case tích cực / tiêu cực', () => {
    const totalReactions = 
      CUSTOMER_REACTION_POOLS.sincere_positive.length +
      CUSTOMER_REACTION_POOLS.witty_positive.length +
      CUSTOMER_REACTION_POOLS.witty_negative.length +
      CUSTOMER_REACTION_POOLS.firm_positive.length +
      CUSTOMER_REACTION_POOLS.firm_negative.length +
      CUSTOMER_REACTION_POOLS.praise_positive.length;

    expect(totalReactions).toBeGreaterThanOrEqual(70);

    // Khi khách khen ngợi 5 sao và chủ tiệm hài hước bắt trend -> phản hồi tích cực vui vẻ
    const praiseWitty = resolveCustomerReaction('witty', 'genz', 'perfect_food', false);
    expect(praiseWitty).toContain('Khách phản hồi:');

    // Khi lỗi nặng (dầu đen, gà khét) mà chủ tiệm đùa cợt với khách nghiêm túc -> phản hồi tiêu cực
    const severeWittyNegative = resolveCustomerReaction('witty', 'foodie', 'dirty_oil', false);
    expect(severeWittyNegative).toContain('Khách phản hồi:');
    expect(severeWittyNegative.toLowerCase()).toMatch(/giỡn|thất vọng|cợt nhả|trừ|không thấy vui/);
  });

  it('các nút sự kiện đồng đều màu sắc (btn-neutral-choice), không có nút nào nổi bật áp đặt người chơi', () => {
    const state = createInitialState();
    const mockIncident: DailyIncident = {
      id: 'inc_test',
      title: 'Thử Thách Sự Kiện',
      characterName: 'Anh Khang',
      characterRole: 'Đầu Bếp',
      context: 'Tình huống bất ngờ trong bếp',
      dialogue: 'Con tính làm sao đây Bác Ba?',
      choices: [
        { id: 'c1', label: 'Phương án Một', subDesc: 'Làm theo cách này' },
        { id: 'c2', label: 'Phương án Hai', subDesc: 'Làm theo cách kia' }
      ]
    };

    const html = renderIncidentPrompt(mockIncident, state);
    // Cả 2 nút bình thường đều phải dùng btn-neutral-choice, không có nút nào dùng btn-warm-choice nổi bật riêng
    expect(html).toContain('btn-neutral-choice');
    expect(html).not.toContain('btn-warm-choice');
  });

  it('hộp thoại Bác Ba hỏi lại (renderIncidentConfirmPrompt) nhắc nhở con nghĩ kỹ', () => {
    const mockIncident: DailyIncident = {
      id: 'inc_test',
      title: 'Thử Thách Sự Kiện',
      characterName: 'Anh Khang',
      characterRole: 'Đầu Bếp',
      context: 'Tình huống bất ngờ trong bếp',
      dialogue: 'Con tính làm sao đây Bác Ba?',
      choices: [
        { id: 'c1', label: 'Bao tiền ăn một bữa no say', subDesc: 'Trừ 200k' }
      ]
    };

    const confirmHtml = renderIncidentConfirmPrompt(mockIncident, mockIncident.choices[0]);
    expect(confirmHtml).toContain('Chắc chưa con? Nghĩ kỹ nghen!');
    expect(confirmHtml).toContain('BÁC BA HỎI LẠI');
    expect(confirmHtml).toContain('Bao tiền ăn một bữa no say');
    expect(confirmHtml).toContain('btn-incident-confirm-yes');
    expect(confirmHtml).toContain('btn-incident-confirm-no');
  });

  it('lựa chọn phản hồi review đã ẩn hoàn toàn điểm số cộng thưởng (+X sao, +Y karma)', () => {
    const review: CustomerReview = {
      id: 'rev_123',
      authorName: 'Bé Trúc',
      avatar: '👧',
      day: 1,
      stars: 2,
      comment: 'Gà hơi khét nè tiệm ơi!',
      weakestCriteria: 'taste',
      orderSummary: '1 Combo Gà Giòn',
      personaGroup: 'genz',
      replyOptions: createReviewReplyOptions('burnt_food', '1 Combo Gà Giòn', 'genz')
    };

    const modalHtml = renderReviewReplyModal(review);
    // Đã ẩn phần preview điểm số
    expect(modalHtml).not.toContain('opt-effects-preview');
    expect(modalHtml).not.toContain('Cứu Sao');
    expect(modalHtml).not.toContain('💖 Hẻm +');
  });

  it('sinh review cho từng lượt khách hàng phụ thuộc vào tính cách, tốc độ phục vụ và chất lượng món', () => {
    const mockOrderFastPerfect: CustomerOrder = {
      id: 'ord_1',
      customerName: 'Minh Trí (Học Sinh)',
      avatar: '👦',
      isDelivery: false,
      personality: 'student',
      items: [{ menuItemId: 'crispy_chicken', count: 1, served: 1, completed: true }],
      patienceMax: 60,
      patienceCurrent: 50, // nhanh (50/60 > 0.7)
      totalPrice: 35000,
      startTime: 1000
    };

    // Đơn nhanh & Perfect -> 5 sao
    const reviewFast = generateIndividualCustomerReview(1, mockOrderFastPerfect, {
      kind: 'complete',
      patienceRatio: 50 / 60,
      isPerfect: true
    });
    expect(reviewFast.stars).toBe(5);
    expect(reviewFast.authorName).toBe('Minh Trí (Học Sinh)');
    expect(reviewFast.replyOptions?.length).toBe(3);

    // Đơn sai món -> 1-2 sao
    const mockOrderWrong: CustomerOrder = {
      id: 'ord_2',
      customerName: 'Bảo Châu (Công Sở)',
      avatar: '👩',
      isDelivery: false,
      personality: 'office',
      items: [{ menuItemId: 'spicy_chicken', count: 2, served: 0, completed: false }],
      patienceMax: 50,
      patienceCurrent: 30,
      totalPrice: 70000,
      startTime: 1000
    };
    const reviewWrong = generateIndividualCustomerReview(1, mockOrderWrong, {
      kind: 'wrong',
      patienceRatio: 30 / 50
    });
    expect(reviewWrong.stars).toBeLessThanOrEqual(2);
    expect(reviewWrong.topic).toBe('wrong_order');

    // Đơn bị cháy -> 1-2 sao
    const reviewBurnt = generateIndividualCustomerReview(1, mockOrderFastPerfect, {
      kind: 'complete',
      patienceRatio: 0.5,
      hasBurnt: true
    });
    expect(reviewBurnt.stars).toBeLessThanOrEqual(2);
    expect(reviewBurnt.topic).toBe('burnt_food');
  });

  it('Nhật ký đánh giá (ReviewsTab) hiển thị danh sách phân nhóm theo Ngày', () => {
    const state = createInitialState();
    state.recentReviews = [
      {
        id: 'rev_d2_1',
        authorName: 'Khách Ngày 2',
        avatar: '👧',
        day: 2,
        stars: 5,
        comment: 'Ngon tuyệt vời!',
        weakestCriteria: 'taste',
        orderSummary: '1 Gà Giòn'
      },
      {
        id: 'rev_d1_1',
        authorName: 'Khách Ngày 1',
        avatar: '👦',
        day: 1,
        stars: 4,
        comment: 'Tạm ổn nha!',
        weakestCriteria: 'speed',
        orderSummary: '1 Khoai Tây'
      }
    ];

    const tabHtml = renderReviewsTab(state);
    expect(tabHtml).toContain('Nhật Ký Ngày 2');
    expect(tabHtml).toContain('Nhật Ký Ngày 1');
    expect(tabHtml).toContain('Khách Ngày 2');
    expect(tabHtml).toContain('Khách Ngày 1');
    expect(tabHtml).toContain('Nhật Ký Đánh Giá Từng Khách');
  });
});
