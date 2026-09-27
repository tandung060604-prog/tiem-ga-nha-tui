import { CustomerReview, ReviewReplyOption } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

const PERSONA_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  student: { label: 'Học Sinh / GenZ', icon: '🎒', color: '#3b82f6' },
  office: { label: 'Dân Công Sở', icon: '💼', color: '#6366f1' },
  foodie: { label: 'Food Reviewer / TikTok', icon: '📸', color: '#ec4899' },
  elder: { label: 'Cô Bác Hàng Xóm', icon: '👵', color: '#f59e0b' },
  creator: { label: 'Nghệ Sĩ Sáng Tạo', icon: '🎬', color: '#8b5cf6' },
};

const STRATEGY_BADGES: Record<string, { label: string; icon: string; theme: string }> = {
  sincere: { label: 'Chân Thành & Lắng Nghe', icon: '💖', theme: 'theme-sincere' },
  witty: { label: 'Hài Hước Bắt Trend', icon: '⚡', theme: 'theme-witty' },
  firm: { label: 'Cương Trực Giữ Uy Tín', icon: '🛡️', theme: 'theme-firm' },
};

export function renderReviewReplyModal(review: CustomerReview): string {
  const persona = (review.personaGroup && PERSONA_LABELS[review.personaGroup]) || {
    label: 'Thực Khách Hẻm 1102',
    icon: '🍗',
    color: '#8c5b36',
  };

  const isAlreadyReplied = Boolean(review.playerReply || review.ownerReply);
  const options = review.replyOptions || [];

  return `
    <div class="review-reply-modal">
      <!-- Modal Header -->
      <div class="reply-modal-header">
        <div class="reply-modal-badge">PHẢN HỒI THỰC KHÁCH</div>
        <h2 class="reply-modal-title">💬 Trả Lời Đánh Giá Của Khách</h2>
        <div class="reply-modal-subtitle">Cách bạn hồi đáp quyết định danh tiếng và tình cảm của xóm giềng!</div>
      </div>

      <!-- Khách Hàng & Review Gốc -->
      <div class="reply-original-card">
        <div class="reply-author-row">
          <div class="reply-avatar-box">${review.avatar}</div>
          <div class="reply-meta">
            <div class="reply-author-name">${escapeHtml(review.authorName)}</div>
            <div class="reply-persona-tag" style="background: ${persona.color}15; color: ${persona.color};">
              <span>${persona.icon}</span> ${persona.label}
            </div>
          </div>
          <div class="reply-stars-box">
            <span class="stars-val">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span>
            <span class="day-val">Ngày ${review.day}</span>
          </div>
        </div>

        ${review.orderSummary ? `
          <div class="reply-order-summary">
            📦 <b>Đơn gọi:</b> ${escapeHtml(review.orderSummary)}
          </div>
        ` : ''}

        <blockquote class="reply-comment-quote">
          "${escapeHtml(review.comment)}"
        </blockquote>

        ${review.tags && review.tags.length > 0 ? `
          <div class="reply-tags-row">
            ${review.tags.map(t => `<span class="review-pill-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Hộp Cố Vấn Bác Ba Mách Nước -->
      <div class="advisor-hint-card">
        <div class="advisor-hint-header">
          <span class="advisor-bulb-icon">💡</span>
          <span class="advisor-hint-title">BÁC BA CỐ VẤN MÁCH NƯỚC</span>
          <span class="advisor-badge-recom">TÂM LÝ KHÁCH HÀNG</span>
        </div>
        <p class="advisor-hint-body">
          ${escapeHtml(review.advisorHint || 'Khách ghé tiệm quý ở tấm lòng chân thật. Dù khen hay góp ý, cứ bình tâm lắng nghe và ứng xử thật khéo léo con nghen!')}
        </p>
      </div>

      <!-- Trạng thái: Đã trả lời hoặc Chọn phương án trả lời -->
      ${isAlreadyReplied ? `
        <div class="replied-history-card">
          <div class="replied-badge">ĐÃ PHẢN HỒI</div>
          <div class="chat-bubble owner-bubble">
            <div class="bubble-sender">🍗 Chủ Tiệm Gà:</div>
            <div class="bubble-text">"${escapeHtml(review.playerReply?.text || review.ownerReply || '')}"</div>
          </div>

          ${review.playerReply?.customerReaction ? `
            <div class="chat-bubble customer-bubble">
              <div class="bubble-sender">${review.avatar} ${escapeHtml(review.authorName)} hồi đáp:</div>
              <div class="bubble-text">"${escapeHtml(review.playerReply.customerReaction)}"</div>
            </div>
          ` : ''}

          ${review.playerReply ? `
            <div class="reply-outcome-bar">
              <span class="outcome-pill">⭐ +${(review.playerReply.starBonus ?? 0.2).toFixed(1)} Điểm Sao</span>
              ${review.playerReply.karmaBonus?.community ? `<span class="outcome-pill">💖 Tình Hẻm +${review.playerReply.karmaBonus.community}</span>` : ''}
              ${review.playerReply.karmaBonus?.craftsmanship ? `<span class="outcome-pill">🔪 Tay Nghề +${review.playerReply.karmaBonus.craftsmanship}</span>` : ''}
              ${review.playerReply.karmaBonus?.ambition ? `<span class="outcome-pill">🏆 Tham Vọng +${review.playerReply.karmaBonus.ambition}</span>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="reply-modal-actions">
          <button id="btn-close-reply-modal" class="btn-big-open">
            ✅ Đã Rõ, Đóng Hộp Thoại
          </button>
        </div>
      ` : `
        <div class="reply-options-list">
          <div class="options-header-label">
            <span>🎯 Chọn 1 trong 3 cách ứng xử của bạn:</span>
          </div>

          ${options.map((opt: ReviewReplyOption) => {
            const stratKey = opt.strategy || opt.style || 'sincere';
            const strat = STRATEGY_BADGES[stratKey] || { label: 'Phản Hồi', icon: '💬', theme: 'theme-sincere' };
            const isRec = opt.isRecommended;

            return `
              <div class="reply-option-card ${strat.theme} ${isRec ? 'is-recommended-card' : ''}">
                <div class="opt-card-header">
                  <div class="opt-strat-badge">
                    <span>${strat.icon}</span> ${strat.label}
                  </div>
                  ${isRec ? `
                    <div class="recom-sparkle-badge">
                      ⭐ BÁC BA GỢI Ý ĐÚNG
                    </div>
                  ` : ''}
                </div>

                <div class="opt-speech-text">
                  "${escapeHtml(opt.text || opt.replyText || '')}"
                </div>

                <div class="opt-footer">
                  <div class="opt-effects-preview">
                    ${(opt.starBonus ?? 0) > 0 ? `<span class="eff-pill star-eff">+${(opt.starBonus ?? 0).toFixed(1)}⭐ Cứu Sao</span>` : '<span class="eff-pill">0⭐</span>'}
                    ${opt.karmaReward?.community ? `<span class="eff-pill karma-eff">💖 Hẻm +${opt.karmaReward.community}</span>` : ''}
                    ${opt.karmaReward?.craftsmanship ? `<span class="eff-pill karma-eff">🔪 Nghề +${opt.karmaReward.craftsmanship}</span>` : ''}
                    ${opt.karmaReward?.ambition ? `<span class="eff-pill karma-eff">🏆 Vọng +${opt.karmaReward.ambition}</span>` : ''}
                  </div>
                  <button 
                    class="btn-sm btn-choose-reply ${isRec ? 'primary' : ''}" 
                    data-review-id="${review.id}" 
                    data-option-id="${opt.id}"
                  >
                    ${isRec ? '👉 Chọn Hồi Đáp Này (Tối Ưu)' : 'Chọn Hồi Đáp'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="reply-modal-actions">
          <button id="btn-cancel-reply-modal" class="btn-sm cancel-btn">
            Để Sau, Chưa Trả Lời Vội
          </button>
        </div>
      `}
    </div>
  `;
}
