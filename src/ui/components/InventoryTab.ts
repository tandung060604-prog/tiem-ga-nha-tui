import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { addStock, refundPurchase, refundableUnits, signIngredientContract, isIngredientUnlocked, UnlockResult } from '../../core/inventory';
import { upgradeEffects } from '../../core/upgrades';

export function renderInventoryTab(state: GameState): string {
  const items = Object.values(state.inventory);
  const effects = upgradeEffects(state.upgrades);
  const discount = effects.discountWholesale || 0;

  const rowsHtml = items.map(item => {
    const isLocked = item.unlocked === false;
    const canUnlockDay = state.day >= (item.unlockDay ?? 1);
    const canAfford = state.money >= (item.unlockCost ?? 0);

    if (isLocked) {
      return `
        <div class="item-row is-locked" data-id="${item.id}" style="opacity: 0.9;">
          <div class="item-icon" style="filter: grayscale(0.8); background: #eee;">${item.icon}</div>
          
          <div class="item-meta">
            <div class="item-name">
              ${item.name}
              <span class="shelf-tag" style="background:#e2e8f0;color:#475569;">🔒 Chưa ký HĐ</span>
            </div>
            <div class="item-sub">
              ${canUnlockDay 
                ? `Phí ký quỹ hợp đồng: <b style="color:var(--accent,#d97706);">${(item.unlockCost ?? 0).toLocaleString('vi-VN')}đ</b>`
                : `Mở hợp đồng từ <b>Ngày ${item.unlockDay}</b> · Phí: ${(item.unlockCost ?? 0).toLocaleString('vi-VN')}đ`
              }
            </div>
          </div>

          <div class="btn-group">
            ${canUnlockDay ? `
              <button class="btn-sm primary btn-unlock" data-id="${item.id}" ${!canAfford ? 'disabled' : ''} style="background:var(--accent,#b45309);border-color:var(--accent,#b45309);color:#fff;" title="Ký hợp đồng cung ứng">
                🔓 Mở HĐ<small>(${((item.unlockCost ?? 0) / 1000)}k)</small>
              </button>
            ` : `
              <button class="btn-sm" disabled style="opacity:0.6;font-size:0.7rem;padding:6px 8px;">
                🔒 Ngày ${item.unlockDay}
              </button>
            `}
          </div>
        </div>
      `;
    }

    const isLow = item.amount <= 5;
    const isOutOfStock = item.amount <= 0;
    const isUrgentShelf = !isOutOfStock && item.currentLifeDays <= 1;
    const unitCost = Math.round(item.cost * (1 - discount / 100));
    const totalCost5 = unitCost * 5;
    const totalCost10 = unitCost * 10;

    return `
      <div class="item-row" data-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        
        <div class="item-meta">
          <div class="item-name">
            ${item.name}
            ${isOutOfStock 
              ? '<span class="shelf-tag" style="background:#f1f5f9;color:#64748b;font-weight:600;">Hết hàng</span>'
              : isUrgentShelf 
              ? '<span class="shelf-tag" style="background:#ffd2d2;color:#b71c1c;font-weight:700;">⚠️ HSD: ' + item.currentLifeDays + ' ngày!</span>' 
              : '<span class="shelf-tag">HSD: ' + item.currentLifeDays + ' ngày</span>'}
          </div>
          <div class="item-sub ${isLow ? 'low-stock' : ''}">
            Tồn kho: <b>${item.amount} ${item.unit}</b> · Giá sỉ: <b>${unitCost.toLocaleString('vi-VN')}đ</b> ${discount > 0 ? `<small style="color:var(--mint-dark,#10b981);font-weight:700;">(-${discount}%)</small>` : ''}
          </div>
          ${item.batches && item.batches.length > 1 ? `
            <div style="font-size: 0.65rem; color: var(--soft); margin-top: 2px;">
              📦 Theo lô FIFO: ${item.batches.map(b => `<b>${b.amount}</b> ${item.unit} (${b.daysLeft}d)`).join(' · ')}
            </div>
          ` : ''}
        </div>

        <div class="btn-group">
          <button class="btn-sm btn-refund" data-id="${item.id}" data-qty="5" ${refundableUnits(item) < 5 ? 'disabled' : ''} title="Đổi trả trong ngày: chỉ hàng vừa nhập hôm nay">
            -5<small>(+${(unitCost * 5 / 1000)}k)</small>
          </button>
          <button class="btn-sm btn-buy" data-id="${item.id}" data-qty="5" ${state.money < totalCost5 ? 'disabled' : ''}>
            +5<small>(${(totalCost5 / 1000)}k)</small>
          </button>
          <button class="btn-sm primary btn-buy" data-id="${item.id}" data-qty="10" ${state.money < totalCost10 ? 'disabled' : ''}>
            +10<small>(${(totalCost10 / 1000)}k)</small>
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
      Nhập đủ gà tươi, bột, dầu và gia vị trước giờ mở bán (10:00). Bấm <b>-5</b> để hoàn trả nếu lỡ tay mua nhầm!
      ${effects.shelfLifeBonus > 0 ? `<br><b style="color:var(--mint-dark,#10b981);">❄️ Kho lạnh bảo quản: +${effects.shelfLifeBonus} ngày hạn dùng cho mọi lô nhập mới!</b>` : ''}
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
  // 1. Nhập hàng (+5 / +10)
  const buyButtons = document.querySelectorAll('.btn-buy');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const itemId = target.getAttribute('data-id');
      const qty = parseInt(target.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      if (!isIngredientUnlocked(item)) {
        showToast('Chưa ký hợp đồng cung ứng nguyên liệu này!');
        return;
      }

      const effects = upgradeEffects(state.upgrades);
      const discount = effects.discountWholesale || 0;
      const unitCost = Math.round(item.cost * (1 - discount / 100));
      const totalCost = unitCost * qty;

      if (state.money < totalCost) {
        showToast('Không đủ tiền để nhập nguyên liệu này!');
        return;
      }

      onUpdateState(draft => {
        const targetItem = draft.inventory[itemId];
        if (!targetItem || draft.money < totalCost) return;
        draft.money -= totalCost;
        // Lô mới có hạn riêng; cộng thêm ngày bảo quản của kho lạnh; ghi giá sỉ đã trả
        addStock(targetItem, qty, unitCost, effects.shelfLifeBonus);
      });

      audio.playCash();
      showToast(`Đã nhập +${qty} ${item.name} (-${totalCost.toLocaleString('vi-VN')}đ)`);
    });
  });

  // 2. Hoàn vốn / Giảm nhập (-5)
  const refundButtons = document.querySelectorAll('.btn-refund');
  refundButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const itemId = target.getAttribute('data-id');
      const qty = parseInt(target.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      let refunded = 0;
      onUpdateState(draft => {
        refunded = refundPurchase(draft.inventory[itemId], qty);
        draft.money += refunded;
      });

      if (refunded === 0) {
        showToast('Chỉ đổi trả được hàng vừa nhập hôm nay (hàng tặng hoặc đã qua đêm thì không).');
        return;
      }
      audio.playCash();
      showToast(`Đã trả lại ${qty} ${item.name} (+${refunded.toLocaleString('vi-VN')}đ)`);
    });
  });

  // 3. Ký hợp đồng mở khóa nguyên liệu mới (Unlock)
  const unlockButtons = document.querySelectorAll('.btn-unlock');
  unlockButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const itemId = target.getAttribute('data-id');
      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      const cost = item.unlockCost ?? 0;

      if (state.money < cost) {
        showToast(`Không đủ tiền ký hợp đồng cung ứng! (Cần ${cost.toLocaleString('vi-VN')}đ)`);
        return;
      }

      let result: UnlockResult | undefined;
      onUpdateState(draft => {
        result = signIngredientContract(draft, itemId);
      });

      if (!result?.success) {
        showToast(result?.reason ?? 'Chưa thể ký hợp đồng này.');
        return;
      }
      audio.playCash();
      showToast(`🎉 Đã ký hợp đồng cung ứng: ${item.name}! Giờ bạn có thể nhập hàng.`);
    });
  });
}
