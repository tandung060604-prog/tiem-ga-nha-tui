import { GameState } from '../../types/game';
import { escapeHtml } from '../escapeHtml';

export function renderTesterFeedbackModal(state: GameState): string {
  const submissionsCount = (state.testerFeedbackSubmissions || []).length;

  return `
    <div class="tester-feedback-modal" style="text-align: left; display: flex; flex-direction: column; gap: 12px; max-height: 82vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--pixel-wood-dark, #5a3516); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.4rem;">💬</span>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: var(--pixel-wood-dark, #5a3516);">GÓP Ý & BÁO LỖI TESTER</h3>
            <div style="font-size: 0.72rem; color: #78350f;">Đồng hành cùng đội ngũ phát triển hoàn thiện Tiệm Gà Nhà Tui</div>
          </div>
        </div>
        <button id="btn-close-tester-feedback" style="border: 0; background: none; font-size: 1.3rem; cursor: pointer; padding: 4px 8px; color: #5a3516; font-weight: 800;">✕</button>
      </div>

      <!-- Quick Info Strip -->
      <div style="background: rgba(0,0,0,0.04); border-radius: 8px; padding: 6px 10px; font-size: 0.74rem; color: #555; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
        <span>🏠 <b>${escapeHtml(state.shopName)}</b></span>
        <span>📅 Ngày ${state.day} (Chương ${state.currentChapter})</span>
        <span>💰 ${state.money.toLocaleString('vi-VN')}đ</span>
        <span>⭐ ${state.ratings.overall.toFixed(1)}/5.0</span>
      </div>

      <!-- Star Rating -->
      <div>
        <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #5a3516; margin-bottom: 4px;">
          1. ĐÁNH GIÁ CHUNG CẢM XÚC CỦA BẠN (1-5 SAO)
        </label>
        <div class="feedback-star-selector" id="feedback-star-group" style="display: flex; gap: 8px; font-size: 1.6rem; cursor: pointer;">
          <span class="star-rating-item" data-star="1" style="color: #f59e0b;">⭐</span>
          <span class="star-rating-item" data-star="2" style="color: #f59e0b;">⭐</span>
          <span class="star-rating-item" data-star="3" style="color: #f59e0b;">⭐</span>
          <span class="star-rating-item" data-star="4" style="color: #f59e0b;">⭐</span>
          <span class="star-rating-item" data-star="5" style="color: #f59e0b;">⭐</span>
        </div>
        <input type="hidden" id="input-feedback-stars" value="5" />
      </div>

      <!-- Category Selector -->
      <div>
        <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #5a3516; margin-bottom: 4px;">
          2. CHỦ ĐỀ GÓP Ý CHÍNH
        </label>
        <select id="select-feedback-category" style="width: 100%; border: 2px solid var(--pixel-wood-dark, #5a3516); border-radius: 8px; padding: 8px; font-size: 0.85rem; font-weight: 700; background: #fffdf8; color: #333;">
          <option value="economy">💰 Cân bằng kinh tế & Giá sỉ / Bán</option>
          <option value="visual_feel">🎨 Đồ họa, Giao diện & Hiệu ứng Game Feel</option>
          <option value="story">📖 Cốt truyện Hẻm 1102 & Nhân vật</option>
          <option value="bug">🐛 Báo lỗi (Bug) / Trục trặc kỹ thuật</option>
          <option value="feature_idea">💡 Đề xuất tính năng mới</option>
          <option value="other">📝 Ý kiến khác</option>
        </select>
      </div>

      <!-- Textarea -->
      <div>
        <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #5a3516; margin-bottom: 4px;">
          3. NỘI DUNG Ý KIẾN / MÔ TẢ LỖI
        </label>
        <textarea id="textarea-feedback-comment" rows="4" placeholder="Bạn thấy điều gì chưa mượt, cần cải thiện thêm, hoặc tình huống lỗi gặp phải..."
          style="width: 100%; box-sizing: border-box; border: 2px solid var(--pixel-wood-dark, #5a3516); border-radius: 8px; padding: 8px; font-size: 0.85rem; line-height: 1.4; resize: vertical; background: #fff;"></textarea>
      </div>

      <!-- Copy Save Code for Bug Reproduction -->
      <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="font-size: 0.72rem; color: #64748b;">
          Đính kèm mã Save để dev tái hiện bug:
        </div>
        <button id="btn-copy-tester-save" class="btn-sm" style="font-size: 0.72rem; padding: 4px 8px; white-space: nowrap; background: #e2e8f0; color: #334155; border: 1px solid #94a3b8; border-radius: 5px; cursor: pointer;">
          📋 Chép Mã Save
        </button>
      </div>

      <!-- Submit Button -->
      <button id="btn-submit-tester-feedback" class="pixel-btn is-primary" style="width: 100%; min-height: 44px; font-weight: 800; font-size: 0.92rem; margin-top: 4px;">
        🚀 GỬI GÓP Ý CHO BAN QUẢN TRỊ
      </button>

      ${submissionsCount > 0 ? `
        <div style="text-align: center; font-size: 0.72rem; color: #059669; font-weight: 700;">
          ✨ Bạn đã gửi ${submissionsCount} góp ý trước đó. Đội ngũ xin chân thành cảm ơn!
        </div>
      ` : ''}
    </div>
  `;
}
