import { isWrappedDay, weeklyWrapped } from '../../core/wrapped';
import { GameState, DayLedger, CustomerReview } from '../../types/game';

export function renderSummaryModal(
  state: GameState,
  ledger: DayLedger,
  review: CustomerReview,
  advisorTip: string
): string {
  const isProfit = ledger.netProfit >= 0;
  // Gà Wrapped mỗi 7 ngày: cùng số liệu với thẻ chia sẻ (core/wrapped.ts). Trước đây cộng hôm nay 2 lần.
  const wrapped = isWrappedDay(ledger.day) ? weeklyWrapped(state, ledger.day) : null;

  return `
    <div class="summary-container">
      <h2 class="summary-title">🎉 Tổng Kết Ngày ${ledger.day}</h2>
      <div class="summary-subtitle">Ca bán hoàn thành xuất sắc! Dưới đây là sổ sách hôm nay:</div>

      ${wrapped ? `
        <!-- Gà Wrapped Cuối Tuần (Viral Threads Feature từ GDD) -->
        <div style="background: linear-gradient(135deg, #ff7675, #d63031); color: #fff; border-radius: var(--radius-md); padding: 14px; box-shadow: 0 4px 14px rgba(214, 48, 49, 0.35); text-align: left; margin-bottom: 8px;">
          <div style="font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; justify-content: space-between;">
            <span>🎁 GÀ WRAPPED · TUẦN ${wrapped.week}</span>
            <span style="font-size: 0.72rem; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px;">ĐẶC BIỆT 7 NGÀY</span>
          </div>
          <div style="font-size: 0.8rem; margin: 4px 0 10px; opacity: 0.9;">
            Nhìn lại 7 ngày vừa qua của chuỗi Tiệm Gà Nhà Tui:
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; text-align: center;">
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 6px;">
              <small style="font-size: 0.68rem; display: block; opacity: 0.85;">Doanh Thu</small>
              <b style="font-size: 0.95rem;">+${Math.round(wrapped.revenue / 1000).toLocaleString('vi-VN')}k</b>
            </div>
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 6px;">
              <small style="font-size: 0.68rem; display: block; opacity: 0.85;">Khách Phục Vụ</small>
              <b style="font-size: 0.95rem;">${wrapped.served} khách</b>
            </div>
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 6px;">
              <small style="font-size: 0.68rem; display: block; opacity: 0.85;">Gà Perfect</small>
              <b style="font-size: 0.95rem;">${wrapped.perfectPct}% 🍗</b>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Financial Ledger -->
      <div class="ledger-box">
        <div class="ledger-row">
          <span>Doanh thu bán hàng</span>
          <span class="val-pos">+${ledger.grossRevenue.toLocaleString('vi-VN')}đ</span>
        </div>
        ${ledger.tips > 0 ? `
          <div class="ledger-row">
            <span>Tiền tip của khách</span>
            <span class="val-pos">+${ledger.tips.toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        <div class="ledger-row">
          <span>Nguyên liệu đã dùng <small>(đã trả lúc nhập)</small></span>
          <span class="val-neg">-${ledger.ingredientCost.toLocaleString('vi-VN')}đ</span>
        </div>
        ${ledger.wasteCost > 0 ? `
          <div class="ledger-row">
            <span>Hàng hết hạn bỏ đi</span>
            <span class="val-neg">-${ledger.wasteCost.toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        ${ledger.wages > 0 ? `
          <div class="ledger-row">
            <span>Lương nhân viên</span>
            <span class="val-neg">-${ledger.wages.toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        ${ledger.rent > 0 ? `
          <div class="ledger-row">
            <span>Tiền mặt bằng</span>
            <span class="val-neg">-${ledger.rent.toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        <div class="ledger-row">
          <span>Điện nước</span>
          <span class="val-neg">-${ledger.utilities.toLocaleString('vi-VN')}đ</span>
        </div>
        ${(ledger.fines ?? 0) > 0 ? `
          <div class="ledger-row">
            <span>Phạt kiểm tra vệ sinh</span>
            <span class="val-neg">-${(ledger.fines ?? 0).toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        ${ledger.appCommissions > 0 ? `
          <div class="ledger-row">
            <span>Hoa hồng app giao hàng</span>
            <span class="val-neg">-${ledger.appCommissions.toLocaleString('vi-VN')}đ</span>
          </div>
        ` : ''}
        <div class="ledger-row total">
          <span>LỢI NHUẬN RÒNG</span>
          <span class="${isProfit ? 'val-pos' : 'val-neg'}">
            ${isProfit ? '+' : ''}${ledger.netProfit.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      <!-- 5 Criteria Ratings -->
      <div class="stars-summary-box">
        <div class="stars-header">
          <span style="font-weight: 800; font-size: 0.95rem; color: var(--ink);">⭐ Đánh Giá Sao Tiệm</span>
          <span class="stars-score-big">${state.ratings.overall.toFixed(1)} / 5.0</span>
        </div>
        <div class="criteria-grid">
          <div class="criteria-item">
            <span>🍗 Hương Vị:</span>
            <span>${state.ratings.taste.toFixed(1)}</span>
          </div>
          <div class="criteria-item">
            <span>⚡ Tốc Độ:</span>
            <span>${state.ratings.speed.toFixed(1)}</span>
          </div>
          <div class="criteria-item">
            <span>✨ Vệ Sinh:</span>
            <span>${state.ratings.hygiene.toFixed(1)}</span>
          </div>
          <div class="criteria-item">
            <span>🪑 Không Gian:</span>
            <span>${state.ratings.space.toFixed(1)}</span>
          </div>
          <div class="criteria-item" style="grid-column: 1 / -1;">
            <span>💰 Giá Cả:</span>
            <span>${state.ratings.pricing.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <!-- Highlight GenZ Review -->
      <div class="review-highlight-card">
        <span class="review-badge-top">REVIEW NỔI BẬT</span>
        <div class="review-author">
          <span class="review-avatar">${review.avatar}</span>
          <span class="review-user-name">${review.authorName}</span>
          <span class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span>
        </div>
        <p class="review-quote">
          "${review.comment}"
        </p>
      </div>

      <!-- Advisor Tip Box -->
      <div class="advisor-box">
        <span>💡</span>
        <div><b>Cố vấn gợi ý:</b> ${advisorTip}</div>
      </div>

      <div id="wrapped-preview"></div>

      <!-- Action Buttons -->
      <div class="summary-actions">
        <button id="btn-share-card" class="btn-share-threads">
          <span>📸</span> Tải Thẻ Review / Chia Sẻ Lên Threads
        </button>
        ${wrapped ? `<button id="btn-wrapped" class="btn-share-threads btn-wrapped">
          <span>🎁</span> Gà Wrapped tuần ${wrapped.week} — tạo thẻ & chia sẻ
        </button>` : ''}
        <button id="btn-start-next-day" class="btn-next-day">
          👉 BẮT ĐẦU NGÀY ${ledger.day + 1}
        </button>
      </div>
    </div>
  `;
}
