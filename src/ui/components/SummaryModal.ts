import { isWrappedDay, weeklyWrapped } from '../../core/wrapped';
import { GameState, DayLedger, CustomerReview } from '../../types/game';
import { BUSINESS_FORM_LABEL, financialLedger } from '../../core/accounting';
import { escapeHtml } from '../escapeHtml';

const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

// Một dòng sổ; khoản 0đ không hiện (trừ dòng bắt buộc)
function pnlRow(label: string, amount: number, sign: '+' | '-', always = false): string {
  if (!always && amount === 0) return '';
  return `<div class="ledger-row pnl-row${sign === '-' ? ' neg' : ''}">
    <span>${label}</span><span class="${sign === '+' ? 'val-pos' : 'val-neg'}">${sign}${vnd(amount)}</span>
  </div>`;
}

// Khối thu gọn được (<details> không cần JS) để vừa màn 320px
function pnlSection(title: string, total: number, sign: '+' | '-', rows: string, open = false): string {
  return `<details class="pnl-section"${open ? ' open' : ''}>
    <summary class="ledger-row pnl-subtotal"><span>${title}</span><span class="${sign === '+' ? 'val-pos' : 'val-neg'}">${sign}${vnd(total)}</span></summary>
    ${rows}
  </details>`;
}

// Báo cáo lãi lỗ cuối ngày. Class cho CSS (Gemini): .pnl, .pnl-form-badge, .pnl-section, .pnl-subtotal,
// .pnl-row(.neg), .pnl-profit, .pnl-tax, .pnl-net, .pnl-note. Giữ .ledger-box / .ledger-row để có style sẵn.
export function renderPnl(ledger: DayLedger): string {
  const f = financialLedger(ledger);
  const signed = (n: number) => `${n >= 0 ? '+' : '-'}${vnd(Math.abs(n))}`;
  return `
    <div class="ledger-box pnl">
      <div class="pnl-form-badge" data-form="${f.tax.form}">${BUSINESS_FORM_LABEL[f.tax.form]}</div>
      ${pnlSection('Doanh thu', f.revenue.counter + f.revenue.delivery + f.revenue.tips, '+',
        pnlRow('Bán tại quầy', f.revenue.counter, '+', true)
        + pnlRow('Bán qua app giao hàng', f.revenue.delivery, '+')
        + pnlRow('Tip &amp; thưởng tay nghề', f.revenue.tips, '+')
        + (f.waste.burnt > 0 ? `<div class="pnl-note">Đã mất ${vnd(f.waste.burnt)} vì giao món cháy (khách trả nửa giá).</div>` : ''), true)}
      ${pnlSection('Giá vốn hàng bán', f.cogs.total, '-',
        pnlRow('Nguyên liệu đã dùng', f.cogs.ingredients, '-', true)
        + pnlRow('Tương cà, tương ớt', f.cogs.condiments, '-')
        + pnlRow('Bao bì: hộp kraft, giấy thấm, ly, túi', f.cogs.packaging, '-')
        + pnlRow('Thay dầu chiên', f.cogs.oil, '-'))}
      ${pnlSection('Chi phí vận hành', f.opex.total, '-',
        pnlRow('Lương nhân viên', f.opex.wages, '-')
        + pnlRow('Tiền mặt bằng', f.opex.rent, '-')
        + pnlRow('Điện nước', f.opex.utilities, '-', true)
        + pnlRow('Gas chảo chiên', f.opex.gas, '-')
        + pnlRow('Hoa hồng app giao hàng', f.opex.commission, '-')
        + pnlRow('Bảo trì, khấu hao thiết bị', f.opex.maintenance, '-'))}
      ${f.waste.expired + f.fines > 0 ? pnlSection('Hao hụt &amp; phạt', f.waste.expired + f.fines, '-',
        pnlRow('Hàng hết hạn bỏ đi', f.waste.expired, '-')
        + pnlRow('Phạt kiểm tra vệ sinh', f.fines, '-')) : ''}
      <div class="ledger-row pnl-profit">
        <span>Lãi trước thuế</span>
        <span class="${f.preTaxProfit >= 0 ? 'val-pos' : 'val-neg'}">${signed(f.preTaxProfit)}</span>
      </div>
      ${pnlSection('Thuế', f.tax.total, '-',
        pnlRow(f.tax.form === 'household' ? 'Thuế GTGT (3% doanh thu)' : 'Thuế GTGT (8% phần giá trị tăng thêm)', f.tax.vat, '-', true)
        + pnlRow('Thuế TNCN (1,5% doanh thu)', f.tax.pit, '-')
        + pnlRow('Thuế TNDN (17% lãi)', f.tax.cit, '-'))}
      <div class="ledger-row total pnl-net">
        <span>LỢI NHUẬN RÒNG</span>
        <span class="${f.netProfit >= 0 ? 'val-pos' : 'val-neg'}">${signed(f.netProfit)}</span>
      </div>
      <div class="pnl-note">Tiền bán đã vào quỹ lúc giao món, nguyên liệu trả lúc nhập kho. Đóng cửa chỉ trừ lương, mặt bằng, điện nước, bao bì, gas, bảo trì, hoa hồng và thuế.</div>
    </div>`;
}

export function renderSummaryModal(
  state: GameState,
  ledger: DayLedger,
  review: CustomerReview,
  advisorTip: string
): string {
  // Gà Wrapped mỗi 7 ngày: cùng số liệu với thẻ chia sẻ (core/wrapped.ts). Trước đây cộng hôm nay 2 lần.
  const wrapped = isWrappedDay(ledger.day) ? weeklyWrapped(state, ledger.day) : null;

  return `
    <div class="summary-container">
      <h2 class="summary-title">🎉 Tổng Kết Ngày ${ledger.day}</h2>
      <div class="summary-subtitle">Ca bán hoàn thành xuất sắc! Dưới đây là sổ sách hôm nay:</div>

      <!-- Thống kê khách ăn thực tế vs phục vụ -->
      <div style="background: #fff8f0; border: 1.5px solid #fed7aa; border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
        <div>
          <span>👥 <b>Khách ăn thực tế:</b> <span style="color: #ea580c; font-weight: 800;">${ledger.customersServed} khách</span></span>
          ${ledger.customersLost > 0 ? `<span style="color: #dc2626; margin-left: 6px; font-weight: 600;">(Bỏ về: ${ledger.customersLost})</span>` : '<span style="color: #16a34a; margin-left: 6px; font-weight: 600;">(Đủ 100%)</span>'}
        </div>
        <div style="color: #9a3412; font-weight: 700;">
          Phục vụ: ${Math.round((ledger.customersServed / Math.max(1, ledger.customersServed + ledger.customersLost)) * 100)}%
        </div>
      </div>

      ${state.secretSauceDay?.buffActive ? `
        <!-- Nồi Sốt Bí Truyền Hoàng Kim -->
        <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1.5px solid #f59e0b; border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.2rem;">🍲</span>
            <div>
              <span style="font-weight: 800; color: #b45309;">Sốt Bí Truyền Hoàng Kim</span>
              <div style="font-size: 0.74rem; color: #78350f;">+0.25★ Hương Vị bảo hộ chất lượng món ăn</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.72rem; color: #92400e; display: block;">Tiền tip sốt:</span>
            <b style="color: #16a34a; font-size: 0.95rem;">+${(state.secretSauceDay.tipsEarnedToday || 0).toLocaleString('vi-VN')}đ</b>
          </div>
        </div>
      ` : ''}

      ${(state.loyaltyState?.pendingAlleyGifts?.length ?? 0) > 0 ? `
        <!-- Bưu Kiện Quà Quê Cư Dân Hẻm 1102 -->
        <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px dashed #f59e0b; border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.5rem;">🎁</span>
            <div>
              <span style="font-weight: 800; color: #b45309;">Quà Quê Tri Kỷ Hẻm 1102!</span>
              <div style="font-size: 0.74rem; color: #78350f;">Bạn có <b>${state.loyaltyState!.pendingAlleyGifts.length} bưu kiện</b> gửi tặng quán đang chờ mở!</div>
            </div>
          </div>
          <button id="btn-summary-open-loyalty" style="background: #f59e0b; color: #fff; border: 1px solid #b45309; border-radius: 6px; padding: 6px 10px; font-weight: 800; font-size: 0.74rem; cursor: pointer; min-height: 38px;">
            MỞ QUÀ 💖
          </button>
        </div>
      ` : ''}

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

      <!-- Báo cáo lãi lỗ (P&L) — số liệu ở core/accounting.ts -->
      ${renderPnl(ledger)}

      <!-- 5 Criteria Ratings -->
      <div class="stars-summary-box">
        <div class="stars-header">
          <span style="font-weight: 800; font-size: 0.95rem; color: var(--ink);">⭐ Đánh Giá Sao Tiệm</span>
          <span class="stars-score-big">${state.ratings.overall.toFixed(1)} / 5.0</span>
        </div>
        <div class="criteria-grid">
          <div class="criteria-item">
            <div class="criteria-label-row"><span>🍗 Hương Vị</span><b>${state.ratings.taste.toFixed(1)}</b></div>
            <div class="criteria-bar-track"><div class="criteria-bar-fill taste" style="width: ${Math.min(100, Math.round((state.ratings.taste / 5) * 100))}%;"></div></div>
          </div>
          <div class="criteria-item">
            <div class="criteria-label-row"><span>⚡ Tốc Độ</span><b>${state.ratings.speed.toFixed(1)}</b></div>
            <div class="criteria-bar-track"><div class="criteria-bar-fill speed" style="width: ${Math.min(100, Math.round((state.ratings.speed / 5) * 100))}%;"></div></div>
          </div>
          <div class="criteria-item">
            <div class="criteria-label-row"><span>✨ Vệ Sinh</span><b>${state.ratings.hygiene.toFixed(1)}</b></div>
            <div class="criteria-bar-track"><div class="criteria-bar-fill hygiene" style="width: ${Math.min(100, Math.round((state.ratings.hygiene / 5) * 100))}%;"></div></div>
          </div>
          <div class="criteria-item">
            <div class="criteria-label-row"><span>🪑 Không Gian</span><b>${state.ratings.space.toFixed(1)}</b></div>
            <div class="criteria-bar-track"><div class="criteria-bar-fill space" style="width: ${Math.min(100, Math.round((state.ratings.space / 5) * 100))}%;"></div></div>
          </div>
          <div class="criteria-item criteria-item-full">
            <div class="criteria-label-row"><span>💰 Giá Cả Hợp Lý</span><b>${state.ratings.pricing.toFixed(1)}</b></div>
            <div class="criteria-bar-track"><div class="criteria-bar-fill pricing" style="width: ${Math.min(100, Math.round((state.ratings.pricing / 5) * 100))}%;"></div></div>
          </div>
        </div>
      </div>

      ${(ledger.wrongOrderCount && ledger.wrongOrderCount > 0) || ledger.customersLost > 0 ? `
        <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 8px; font-size: 0.78rem; color: #be123c; font-weight: 700; display: flex; align-items: center; gap: 6px;">
          <span>⚠️</span>
          <span>Sự cố phục vụ: ${ledger.wrongOrderCount ? `${ledger.wrongOrderCount} đơn giao nhầm món · ` : ''}${ledger.customersLost ? `${ledger.customersLost} khách bỏ về do đợi lâu` : ''}</span>
        </div>
      ` : ''}

      <!-- Highlight GenZ Review -->
      <div class="review-highlight-card">
        <span class="review-badge-top">REVIEW NỔI BẬT</span>
        <div class="review-author">
          <span class="review-avatar">${review.avatar}</span>
          <span class="review-user-name">${review.authorName}</span>
          <span class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span>
        </div>
        ${review.orderSummary ? `
          <div style="font-size: 0.72rem; color: #8c5b36; background: rgba(244, 162, 97, 0.2); padding: 2px 8px; border-radius: 8px; display: inline-block; margin-bottom: 6px; font-weight: 700;">
            📦 Đơn gọi: ${escapeHtml(review.orderSummary)}
          </div>
        ` : ''}
        <p class="review-quote">
          "${review.comment}"
        </p>
        ${review.tags && review.tags.length ? `
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${review.tags.map(t => `<span style="font-size: 0.68rem; background: rgba(0,0,0,0.06); color: #78350f; font-weight: 700; padding: 2px 6px; border-radius: 6px;">${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}

        ${review.playerReply || review.ownerReply ? `
          <div style="margin-top: 8px; background: #fff; border-radius: 8px; padding: 6px 10px; font-size: 0.74rem; border-left: 3px solid #10b981; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
            <div style="color: #ea580c; font-weight: 800; display: flex; justify-content: space-between;">
              <span>🍗 Chủ Tiệm Đã Phản Hồi:</span>
            </div>
            <div style="color: #4a2c1d; font-style: italic; margin-top: 2px;">"${escapeHtml(review.playerReply?.text || review.ownerReply || '')}"</div>
            ${review.playerReply?.customerReaction ? `
              <div style="color: #166534; margin-top: 4px; padding-top: 4px; border-top: 1px dashed #e5e7eb;">
                <b>${review.avatar} Khách:</b> "${escapeHtml(review.playerReply.customerReaction)}"
              </div>
            ` : ''}
          </div>
        ` : `
          <button id="btn-summary-reply-review" class="btn-sm" style="width: 100%; margin-top: 10px; font-weight: 800; padding: 7px 12px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);">
            <span>💬</span> Trả Lời Đánh Giá Ngay
          </button>
        `}
      </div>

      <!-- Minigame Lọc Cặn Dầu & Vớt Bột Cháy Cuối Ngày -->
      ${!state.todayOilFiltered ? `
        <div class="oil-filter-card-summary" style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 1.5px solid #fb923c; border-radius: var(--radius-md); padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(251, 146, 60, 0.15);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🧹</span>
              <div>
                <span style="font-weight: 800; font-size: 0.9rem; color: #9a3412;">Lọc Cặn Dầu &amp; Vớt Bột Cháy</span>
                <div style="font-size: 0.74rem; color: #7c2d12;">
                  Tình trạng dầu: <b style="color: ${state.oilCondition === 'dirty' ? '#dc2626' : state.oilCondition === 'medium' ? '#d97706' : '#16a34a'};">
                    ${state.oilCondition === 'dirty' ? 'Đen Khét ⚠️' : state.oilCondition === 'medium' ? 'Nâu Cánh Gián' : 'Vàng Óng Ả'}
                  </b>
                </div>
              </div>
            </div>
            <span style="font-size: 0.7rem; background: #ea580c; color: #fff; padding: 2px 8px; border-radius: 12px; font-weight: 800; letter-spacing: 0.3px;">TIẾT KIỆM 150K</span>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 0.76rem; color: #431407; line-height: 1.4;">
            ${state.oilCondition === 'dirty' 
              ? '🔥 <b>Báo động!</b> Chảo dầu đen khét dễ làm gà cháy khét và bị trừ sao Vệ Sinh ngày mai. Hãy vớt sạch cặn cháy để phục hồi dầu về màu nâu!' 
              : state.oilCondition === 'medium' 
              ? '✨ Dầu đã ngả màu nâu hổ phách. Vớt sạch cặn bột cháy trong 15s để dầu trong trẻo, vàng óng trở lại!' 
              : '🌟 Dầu vẫn sáng màu. Vớt nhanh các vụn bột còn sót để đáy chảo sáng bóng, sẵn sàng cho ngày mới!'}
          </p>
          <button id="btn-open-oil-filter" class="btn-sm" style="width: 100%; font-weight: 800; padding: 9px 14px; background: linear-gradient(135deg, #f97316, #ea580c); border: none; color: #fff; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.85rem; box-shadow: 0 3px 8px rgba(234, 88, 12, 0.35); transition: transform 0.1s ease;">
            <span>🍳</span> BẮT ĐẦU VỚT CẶN DẦU (15 Giây)
          </button>
        </div>
      ` : `
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 10px 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; box-shadow: 0 1px 4px rgba(16, 185, 129, 0.1);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.3rem;">✨</span>
            <div>
              <div style="font-weight: 800; color: #166534;">Đã Lọc Cặn Dầu Hôm Nay!</div>
              <div style="font-size: 0.74rem; color: #15803d;">
                Tình trạng chảo: <b>${state.oilCondition === 'dirty' ? 'Đen Khét' : state.oilCondition === 'medium' ? 'Nâu Cánh Gián' : 'Vàng Óng Ả 🌟'}</b>
              </div>
            </div>
          </div>
          <span style="font-size: 0.72rem; color: #16a34a; font-weight: 800; background: #fff; border: 1px solid #86efac; padding: 3px 8px; border-radius: 8px;">ĐÃ VỆ SINH</span>
        </div>
      `}

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
