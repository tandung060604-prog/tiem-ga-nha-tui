import { CustomerReview, GameState } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

const PERSONA_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  student: { label: 'Học Sinh / GenZ', icon: '🎒', color: '#3b82f6' },
  genz: { label: 'GenZ Bắt Trend', icon: '💅', color: '#ec4899' },
  office: { label: 'Dân Công Sở', icon: '💼', color: '#6366f1' },
  foodie: { label: 'Food Reviewer', icon: '📸', color: '#f43f5e' },
  elder: { label: 'Cô Bác Hàng Xóm', icon: '👵', color: '#f59e0b' },
  resident: { label: 'Cư Dân Hẻm 1102', icon: '🏘️', color: '#d97706' },
  shipper: { label: 'Tài Xế Shipper', icon: '🛵', color: '#10b981' },
  creator: { label: 'Nghệ Sĩ Sáng Tạo', icon: '🎬', color: '#8b5cf6' },
};

export function renderReviewsTab(state: GameState): string {
  const r = state.ratings;

  // Criteria bar helper
  const renderBar = (label: string, score: number, weight: string) => {
    const percent = Math.min(100, Math.round((score / 5.0) * 100));
    return `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700;">
          <span>${label} <small style="color: var(--soft);">(${weight})</small></span>
          <span style="color: var(--ink);">${score.toFixed(1)} / 5.0</span>
        </div>
        <div style="height: 6px; background: var(--line); border-radius: 3px; overflow: hidden;">
          <div style="height: 100%; width: ${percent}%; background: linear-gradient(90deg, var(--gold), var(--mint));"></div>
        </div>
      </div>
    `;
  };

  const renderSingleReview = (rev: CustomerReview) => {
    const persona = (rev.personaGroup && PERSONA_LABELS[rev.personaGroup]) || {
      label: 'Thực Khách Hẻm',
      icon: '🍗',
      color: '#8c5b36',
    };
    const isReplied = Boolean(rev.playerReply || rev.ownerReply);

    return `
      <div class="review-item" style="border-bottom: 1.5px solid var(--line); padding: 10px 0;">
        <!-- Header khách hàng -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem; line-height: 1;">${rev.avatar}</span>
            <div>
              <div style="font-weight: 800; font-size: 0.86rem; color: var(--ink);">${escapeHtml(rev.authorName)}</div>
              <div style="display: inline-flex; align-items: center; gap: 3px; font-size: 0.65rem; font-weight: 700; color: ${persona.color}; background: ${persona.color}15; padding: 1px 6px; border-radius: 4px; margin-top: 1px;">
                <span>${persona.icon}</span> ${persona.label}
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--gold-dark); font-size: 0.86rem; font-weight: 800;">
              ${'★'.repeat(rev.stars)}${'☆'.repeat(5 - rev.stars)}
            </div>
            <small style="color: var(--soft); font-size: 0.66rem;">(Ngày ${rev.day})</small>
          </div>
        </div>

        <!-- Món ăn đã gọi nếu có -->
        ${rev.orderSummary ? `
          <div style="font-size: 0.72rem; color: #8c5b36; background: rgba(244, 162, 97, 0.16); padding: 2px 7px; border-radius: 6px; display: inline-block; margin-bottom: 5px; font-weight: 700;">
            📦 Đơn: ${escapeHtml(rev.orderSummary)}
          </div>
        ` : ''}

        <!-- Nội dung nhận xét -->
        <div style="font-size: 0.82rem; color: #4a2c1d; line-height: 1.35; font-style: italic; background: #fffcf8; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #f97316;">
          "${escapeHtml(rev.comment)}"
        </div>

        <!-- Tags ngữ cảnh -->
        ${rev.tags && rev.tags.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px;">
            ${rev.tags.map(t => `<span style="font-size: 0.64rem; background: rgba(0,0,0,0.05); color: #7c2d12; font-weight: 700; padding: 1px 6px; border-radius: 4px;">${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Phản hồi tương tác 2 chiều -->
        ${isReplied ? `
          <div style="background: #f7ede0; border-left: 3px solid var(--red); border-radius: 4px 8px 8px 4px; padding: 6px 10px; margin-top: 6px; font-size: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
              <b style="color: var(--red);">🍗 Chủ Tiệm Đã Trả Lời:</b>
              ${rev.playerReply ? `<span style="font-size: 0.65rem; font-weight: 800; background: #10b981; color: #fff; padding: 1px 6px; border-radius: 4px;">+${(rev.playerReply.starBonus ?? 0.2).toFixed(1)}⭐ Cứu sao</span>` : ''}
            </div>
            <div style="color: #431407; font-style: italic;">"${escapeHtml(rev.playerReply?.text || rev.ownerReply || '')}"</div>

            ${rev.playerReply?.customerReaction ? `
              <div style="margin-top: 5px; padding-top: 4px; border-top: 1px dashed #fdba74; color: #166534; font-size: 0.73rem;">
                <b>${rev.avatar} ${escapeHtml(rev.authorName)}:</b> "${escapeHtml(rev.playerReply.customerReaction)}"
              </div>
            ` : ''}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
            <button class="btn-sm btn-open-reply" data-review-id="${rev.id}" style="font-size: 0.68rem; padding: 3px 8px; background: transparent; border: 1px solid var(--line); color: var(--soft);">
              🔍 Xem Lại Lịch Sử Đối Thoại
            </button>
          </div>
        ` : `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
            <span style="font-size: 0.68rem; color: #b45309; font-weight: 700;">
              💡 Có lời khuyên từ Bác Ba Cố Vấn
            </span>
            <button class="btn-sm btn-open-reply primary" data-review-id="${rev.id}" style="font-size: 0.72rem; padding: 4px 10px; font-weight: 800;">
              💬 Trả Lời Đánh Giá (Bác Ba Mách Nước)
            </button>
          </div>
        `}
      </div>
    `;
  };

  // Nhóm đánh giá theo từng ngày (Nhật ký đánh giá)
  const daysMap = new Map<number, CustomerReview[]>();
  for (const rev of state.recentReviews) {
    const list = daysMap.get(rev.day) || [];
    list.push(rev);
    daysMap.set(rev.day, list);
  }
  const sortedDays = Array.from(daysMap.keys()).sort((a, b) => b - a);

  const reviewsByDayHtml = sortedDays.map(day => {
    const dayReviews = daysMap.get(day) || [];
    const avgStars = (dayReviews.reduce((sum, r) => sum + r.stars, 0) / dayReviews.length).toFixed(1);
    return `
      <div class="review-day-block" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #fffcf8; border: 1.5px solid var(--line); border-left: 4px solid var(--red); border-radius: 6px; padding: 6px 10px; margin-bottom: 4px;">
          <div style="font-weight: 800; font-size: 0.84rem; color: #78350f;">
            📅 Nhật Ký Ngày ${day} <span style="font-size: 0.7rem; color: var(--soft); font-weight: 600;">(${dayReviews.length} lượt khách)</span>
          </div>
          <div style="font-weight: 800; font-size: 0.8rem; color: #d97706;">
            ⭐ ${avgStars} / 5.0
          </div>
        </div>
        <div>
          ${dayReviews.map(r => renderSingleReview(r)).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="sec-title">
      <span>⭐ Đánh Giá Sao Tiệm (5 Tiêu Chí)</span>
    </div>
    <div class="sec-desc">
      Đánh giá tiệm phản ánh thực tế từ trải nghiệm khách. Phản hồi khéo léo với sự cố vấn của Bác Ba giúp cứu vãn điểm sao và gia tăng Tình Làng Nghĩa Xóm!
    </div>

    <!-- 5 Criteria Scorecard -->
    <div style="background: var(--bg); border: 2px solid var(--line); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
      ${renderBar('🍗 Hương Vị', r.taste, '30%')}
      ${renderBar('⚡ Tốc Độ', r.speed, '25%')}
      ${renderBar('✨ Vệ Sinh', r.hygiene, '15%')}
      ${renderBar('🪑 Không Gian', r.space, '15%')}
      ${renderBar('💰 Giá Cả', r.pricing, '15%')}
    </div>

    <div class="sec-title" style="margin-top: 10px;">
      <span>📖 Nhật Ký Đánh Giá Từng Khách (${state.recentReviews.length} Lượt Đánh Giá)</span>
    </div>
    <div class="reviews-list">
      ${sortedDays.length > 0 ? reviewsByDayHtml : '<div style="font-size: 0.8rem; color: var(--soft); text-align: center; padding: 14px;">Chưa có review nào. Hãy mở bán để đón những vị khách đầu tiên!</div>'}
    </div>
  `;
}

export function bindReviewsEvents(
  state: GameState,
  onOpenReplyModal: (review: CustomerReview) => void
) {
  const replyBtns = document.querySelectorAll('.btn-open-reply');
  replyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const reviewId = (e.currentTarget as HTMLElement).getAttribute('data-review-id');
      if (!reviewId) return;
      const review = state.recentReviews.find(r => r.id === reviewId);
      if (review) {
        onOpenReplyModal(review);
      }
    });
  });
}
