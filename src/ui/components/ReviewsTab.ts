import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { pick } from '../../core/rng';

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

  const reviewsHtml = state.recentReviews.map((rev, idx) => {
    return `
      <div class="review-item" style="border-bottom: 1px solid var(--line); padding: 10px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.85rem;">
            <span>${rev.avatar}</span>
            <span>${rev.authorName}</span>
          </div>
          <div style="color: var(--gold-dark); font-size: 0.82rem; font-weight: 800;">
            ${'★'.repeat(rev.stars)}${'☆'.repeat(5 - rev.stars)} <small style="color: var(--soft); font-weight: normal;">(Ngày ${rev.day})</small>
          </div>
        </div>
        <div style="font-size: 0.82rem; color: #4a2c1d; line-height: 1.35; font-style: italic;">
          "${rev.comment}"
        </div>
        ${rev.ownerReply ? `
          <div style="background: #f7ede0; border-left: 3px solid var(--red); border-radius: 4px 8px 8px 4px; padding: 4px 8px; margin-top: 6px; font-size: 0.76rem;">
            <b style="color: var(--red);">Chủ Tiệm:</b> <span>${rev.ownerReply}</span>
          </div>
        ` : `
          <button class="btn-sm btn-reply" data-index="${idx}" style="font-size: 0.68rem; margin-top: 4px; padding: 2px 8px;">
            💬 Phản hồi khách
          </button>
        `}
      </div>
    `;
  }).join('');

  return `
    <div class="sec-title">
      <span>⭐ Đánh Giá Sao Tiệm (5 Tiêu Chí)</span>
    </div>
    <div class="sec-desc">
      Đánh giá tiệm được tính từ trung bình có trọng số của các review gần nhất. Review tốt trực tiếp kéo thêm khách!
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
      <span>💬 Review Của Khách Hàng (${state.recentReviews.length})</span>
    </div>
    <div class="reviews-list">
      ${reviewsHtml.length > 0 ? reviewsHtml : '<div style="font-size: 0.8rem; color: var(--soft); text-align: center; padding: 14px;">Chưa có review nào. Hãy mở bán để đón những vị khách đầu tiên!</div>'}
    </div>
  `;
}

export function bindReviewsEvents(
  _state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void
) {
  const replyBtns = document.querySelectorAll('.btn-reply');
  replyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      const replies = [
        'Dạ tiệm xin ghi nhận và rút kinh nghiệm sâu sắc ạ! Lần tới ghé tiệm tặng bạn thêm lon nước ngọt nha!',
        'Dạ cảm ơn bạn nhiều thiệt nhiều ạ, nghe bạn khen mà cả tiệm cười tít mắt luôn á! 🥰',
        'Cảm ơn bạn đã đóng góp! Tiệm vừa nâng cấp chảo mới, đảm bảo lần sau ngon xỉu luôn ạ!',
        'Hiuhiu tiệm xin lỗi vì sơ sót này nha, lần tới ghé nhớ bảo tiệm để được phục vụ chu đáo nhất nhé!'
      ];
      const randomReply = pick(replies);

      onUpdateState(draft => {
        const review = draft.recentReviews[idx];
        if (review) review.ownerReply = randomReply;
      });

      audio.playPop();
      showToast('Đã gửi phản hồi chân thành đến khách hàng! 💌');
    });
  });
}
