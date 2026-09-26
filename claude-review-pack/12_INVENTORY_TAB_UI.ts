import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { addStock } from '../../core/inventory';

export function renderInventoryTab(state: GameState): string {
  const items = Object.values(state.inventory);

  const rowsHtml = items.map(item => {
    const isLow = item.amount <= 5;
    const isUrgentShelf = item.currentLifeDays <= 1;

    return `
      <div class="item-row" data-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        
        <div class="item-meta">
          <div class="item-name">
            ${item.name}
            ${isUrgentShelf ? '<span class="shelf-tag" style="background:#ffd2d2;color:#b71c1c;">HSD: ' + item.currentLifeDays + ' ngày!</span>' : '<span class="shelf-tag">HSD: ' + item.currentLifeDays + ' ngày</span>'}
          </div>
          <div class="item-sub ${isLow ? 'low-stock' : ''}">
            Tồn kho: <b>${item.amount} ${item.unit}</b> · Giá nhập: ${item.cost.toLocaleString('vi-VN')}đ
          </div>
          ${item.batches && item.batches.length > 1 ? `
            <div style="font-size: 0.65rem; color: var(--soft); margin-top: 2px;">
              📦 Theo lô FIFO: ${item.batches.map(b => `<b>${b.amount}</b> ${item.unit} (${b.daysLeft}d)`).join(' · ')}
            </div>
          ` : ''}
        </div>

        <div class="btn-group">
          <button class="btn-sm btn-buy" data-id="${item.id}" data-qty="5" ${state.money < item.cost * 5 ? 'disabled' : ''}>
            +5<small>(${(item.cost * 5 / 1000)}k)</small>
          </button>
          <button class="btn-sm primary btn-buy" data-id="${item.id}" data-qty="10" ${state.money < item.cost * 10 ? 'disabled' : ''}>
            +10<small>(${(item.cost * 10 / 1000)}k)</small>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="sec-title">
      <span>📦 Quản Lý Kho & Nguyên Liệu</span>
      <span style="font-size: 0.78rem; color: var(--soft); font-weight: normal;">Lưu ý: Mua dư hết hạn là lỗ!</span>
    </div>
    <div class="sec-desc">
      Nhập đủ gà tươi, bột, dầu và gia vị trước giờ mở bán (10:00). Thiếu nguyên liệu khách sẽ bỏ đi!
    </div>
    <div class="inventory-list">
      ${rowsHtml}
    </div>
  `;
}

export function bindInventoryEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void
) {
  const buyButtons = document.querySelectorAll('.btn-buy');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const itemId = target.getAttribute('data-id');
      const qty = parseInt(target.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      const totalCost = item.cost * qty;

      if (state.money < totalCost) {
        showToast('Không đủ tiền để nhập nguyên liệu này!');
        return;
      }

      onUpdateState(draft => {
        const target = draft.inventory[itemId];
        if (!target) return;
        draft.money -= totalCost;
        // Lô mới có hạn riêng; lô cũ giữ nguyên hạn (xuất FIFO)
        addStock(target, qty);
      });

      audio.playCash();
      showToast(`Đã nhập +${qty} ${item.name} (-${totalCost.toLocaleString('vi-VN')}đ)`);
    });
  });
}
