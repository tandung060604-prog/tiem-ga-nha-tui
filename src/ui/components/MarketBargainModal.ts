import { BargainWholesaler, BargainResult } from '../../types/game';
import { BARGAIN_TACTICS } from '../../core/marketBargain';
import { escapeHtml } from '../escapeHtml';

export function renderMarketBargainModal(
  wholesaler: BargainWholesaler,
  outcome: BargainResult | null
): string {
  if (outcome) {
    const isSuccess = outcome.success;
    return `
      <div class="market-bargain-dialog" style="text-align: center; padding: 4px;">
        <div style="font-size: 2.2rem; margin-bottom: 6px;">
          ${isSuccess ? '🎉' : '😅'}
        </div>
        <div style="font-family: var(--font-pixel-heading), inherit; font-size: 1rem; color: ${isSuccess ? 'var(--pixel-gold-dark, #c98e1e)' : '#e11d48'}; font-weight: 800; margin-bottom: 4px;">
          ${isSuccess ? `THƯƠNG LƯỢNG THÀNH CÔNG (-${outcome.discountPct}%)!` : 'MẶC CẢ KHÔNG THÀNH CÔNG!'}
        </div>
        <div style="font-size: 0.8rem; color: var(--pixel-parchment-text, #3a2210); margin-bottom: 12px; font-weight: 700;">
          ${escapeHtml(outcome.wholesaler.stallName)}
        </div>

        <div style="background: rgba(0,0,0,0.06); border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px dashed rgba(0,0,0,0.2); font-style: italic; font-size: 0.86rem; line-height: 1.5; color: var(--pixel-parchment-text, #3a2210);">
          ${escapeHtml(outcome.message)}
        </div>

        ${isSuccess ? `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 8px; padding: 8px; margin-bottom: 16px; font-size: 0.82rem; color: #065f46; font-weight: 800;">
            ✨ Mọi nguyên liệu trong Kho hôm nay đều được giảm giá sỉ -${outcome.discountPct}%!
          </div>
        ` : `
          <div style="background: rgba(244, 63, 94, 0.1); border: 1.5px solid #f43f5e; border-radius: 8px; padding: 8px; margin-bottom: 16px; font-size: 0.82rem; color: #9f1239; font-weight: 700;">
            Tiểu thương giữ nguyên giá sỉ ban đầu. Ngày mai hãy thử vận may lại nhé!
          </div>
        `}

        <button id="btn-close-bargain-result" class="pixel-btn is-warning" style="width: 100%; min-height: 44px; font-size: 0.88rem;">
          🛒 VÀO KHO NHẬP HÀNG NGAY
        </button>
      </div>
    `;
  }

  const tactics = Object.values(BARGAIN_TACTICS);
  const tacticsHtml = tactics.map(t => `
    <button class="btn-bargain-tactic" data-tactic="${t.id}" style="
      display: flex; flex-direction: column; align-items: flex-start; text-align: left; width: 100%;
      background: var(--pixel-parchment-bg, #faeed1);
      border: 2px solid var(--pixel-wood-light, #8a5229);
      box-shadow: inset -1px -1px 0 var(--pixel-wood-dark, #4a2810), 2px 2px 0 rgba(0,0,0,0.2);
      border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; cursor: pointer; transition: transform 0.1s;
    ">
      <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 3px;">
        <span style="font-weight: 800; font-size: 0.88rem; color: var(--pixel-wood-dark, #4a2810);">
          ${t.icon} ${t.label}
        </span>
        <span style="font-family: var(--font-pixel-heading), inherit; font-size: 0.78rem; font-weight: 800; color: #059669; background: rgba(5,150,105,0.12); padding: 2px 6px; border-radius: 4px;">
          -${t.discountPct}%
        </span>
      </div>
      <div style="font-size: 0.74rem; color: #6b4c35; line-height: 1.35;">
        ${t.subDesc}
      </div>
    </button>
  `).join('');

  return `
    <div class="market-bargain-dialog" style="text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px; margin-bottom: 12px;">
        <div>
          <div style="font-family: var(--font-pixel-heading), inherit; font-size: 0.95rem; font-weight: 800; color: var(--pixel-wood-dark, #4a2810);">
            🛒 Đi Chợ Đầu Mối Chợ Lớn
          </div>
          <div style="font-size: 0.72rem; color: var(--soft);">
            Thương lượng giá sỉ nguyên liệu cho tiệm gà ngày hôm nay
          </div>
        </div>
        <button id="btn-close-bargain-modal" style="border: 0; background: none; font-size: 1.3rem; cursor: pointer; color: var(--pixel-wood-dark, #4a2810);">✕</button>
      </div>

      <!-- Wholesaler Card -->
      <div style="background: rgba(0,0,0,0.05); border-radius: 8px; border: 1.5px solid var(--pixel-wood-light, #8a5229); padding: 10px; margin-bottom: 12px; display: flex; gap: 10px; align-items: center;">
        <div style="font-size: 2.2rem; background: #fff; border-radius: 8px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--line); flex-shrink: 0;">
          ${wholesaler.avatar}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 800; font-size: 0.88rem; color: var(--pixel-wood-dark, #4a2810); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHtml(wholesaler.stallName)}
          </div>
          <div style="font-size: 0.72rem; color: #b45309; font-weight: 700; margin-bottom: 2px;">
            Mặt hàng sỉ: ${escapeHtml(wholesaler.specialty)}
          </div>
          <div style="font-size: 0.76rem; color: #4b3621; font-style: italic; line-height: 1.3;">
            "${escapeHtml(wholesaler.dialogue)}"
          </div>
        </div>
      </div>

      <div style="font-size: 0.78rem; font-weight: 800; color: var(--pixel-wood-dark, #4a2810); margin-bottom: 6px;">
        Chọn Chiến Thuật Mặc Cả Với Tiểu Thương:
      </div>

      <div class="bargain-tactics-list">
        ${tacticsHtml}
      </div>
    </div>
  `;
}
