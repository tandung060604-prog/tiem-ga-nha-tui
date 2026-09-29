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

  const marketDiscount = state.todayMarketDiscount || 0;
  const marketBannerHtml = state.todayMarketBargained
    ? (marketDiscount > 0
        ? `<div style="background: rgba(16,185,129,0.12); border: 1.5px solid #10b981; border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; font-size: 0.8rem; color: #065f46; display: flex; justify-content: space-between; align-items: center;">
            <span>🏷️ <b>Đã đi Chợ Lớn:</b> Giảm -${marketDiscount}% giá nhập sỉ cả ngày hôm nay!</span>
          </div>`
        : `<div style="background: rgba(0,0,0,0.05); border: 1px dashed var(--line); border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; font-size: 0.78rem; color: var(--soft);">
            <span>🛒 Đã ghé chợ sáng nay (tiểu thương giữ nguyên giá sỉ).</span>
          </div>`
      )
    : `<div style="background: var(--pixel-parchment-bg, #faeed1); border: 2px solid var(--pixel-wood-dark, #4a2810); border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 2px 2px 0 rgba(0,0,0,0.2);">
        <div>
          <div style="font-weight: 800; font-size: 0.86rem; color: var(--pixel-wood-dark, #4a2810);">🛒 Đi Chợ Đầu Mối Chợ Lớn</div>
          <div style="font-size: 0.72rem; color: #6b4c35;">Mặc cả với tiểu thương để được giảm 15% - 35% giá nhập sỉ cả ngày!</div>
        </div>
        <button id="btn-open-market-bargain" class="pixel-btn is-warning" style="font-size: 0.74rem; padding: 5px 8px; white-space: nowrap;">ĐI CHỢ NGAY</button>
      </div>`;

  return `
    <div class="sec-title">
      <span>📦 Quản Lý Kho & Nguyên Liệu</span>
      <span style="font-size: 0.78rem; color: var(--soft); font-weight: normal;">Lưu ý: Mua dư hết hạn là lỗ!</span>
    </div>
    ${marketBannerHtml}
    <div class="sec-desc">
      Nhập đủ gà tươi, bột, dầu và gia vị trước giờ mở bán (10:00). Bấm <b>-5</b> để hoàn trả nếu lỡ tay mua nhầm! Nhấn giữ nút để nhập nhanh.
      ${effects.shelfLifeBonus > 0 ? `<br><b style="color:var(--mint-dark,#10b981);">❄️ Kho lạnh bảo quản: +${effects.shelfLifeBonus} ngày hạn dùng cho mọi lô nhập mới!</b>` : ''}
    </div>
    <div class="inventory-list">
      ${rowsHtml}
    </div>
  `;
}

function setupLongPress(btn: HTMLElement, action: () => void) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let interval: ReturnType<typeof setInterval> | null = null;
  let speed = 180;
  let pointerFired = false;

  const start = (e: Event) => {
    e.preventDefault();
    pointerFired = true;
    action();
    speed = 180;
    timer = setTimeout(() => {
      interval = setInterval(() => {
        action();
        speed = Math.max(60, speed - 15);
      }, speed);
    }, 320);
  };

  const stop = () => {
    if (timer) clearTimeout(timer);
    if (interval) clearInterval(interval);
    timer = null;
    interval = null;
    setTimeout(() => { pointerFired = false; }, 100);
  };

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
  btn.addEventListener('click', (e) => {
    if (!pointerFired) {
      e.preventDefault();
      action();
    }
  });
}

export function bindInventoryEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void,
  onOpenMarketBargain?: () => void
) {
  // Đi chợ trả giá
  const bargainBtn = document.getElementById('btn-open-market-bargain');
  if (bargainBtn && onOpenMarketBargain) {
    bargainBtn.addEventListener('click', onOpenMarketBargain);
  }

  // 1. Nhập hàng (+5 / +10) có hỗ trợ nhấn giữ gia tốc
  const buyButtons = document.querySelectorAll<HTMLElement>('.btn-buy');
  buyButtons.forEach(btn => {
    const doBuy = () => {
      const itemId = btn.getAttribute('data-id');
      const qty = parseInt(btn.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      if (!isIngredientUnlocked(item)) {
        showToast('Chưa ký hợp đồng cung ứng nguyên liệu này!');
        return;
      }

      const effects = upgradeEffects(state.upgrades);
      const marketDiscount = state.todayMarketDiscount || 0;
      const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);
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
        addStock(targetItem, qty, unitCost, effects.shelfLifeBonus);
      });

      audio.playCash();
      showToast(`Đã nhập +${qty} ${item.name} (-${totalCost.toLocaleString('vi-VN')}đ)`);
    };

    setupLongPress(btn, doBuy);
  });

  // 2. Hoàn vốn / Giảm nhập (-5) có hỗ trợ nhấn giữ gia tốc
  const refundButtons = document.querySelectorAll<HTMLElement>('.btn-refund');
  refundButtons.forEach(btn => {
    const doRefund = () => {
      const itemId = btn.getAttribute('data-id');
      const qty = parseInt(btn.getAttribute('data-qty') || '5', 10);

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
    };

    setupLongPress(btn, doRefund);
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
