import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { addStock, refundPurchase, refundableUnits, signIngredientContract, isIngredientUnlocked, UnlockResult } from '../../core/inventory';
import { upgradeEffects } from '../../core/upgrades';
import { ASSETS } from '../../content/assets';

function getInventoryIcon(item: any): string {
  const iconMap: Record<string, string> = {
    chicken_meat: ASSETS.icons.chickenCrispy,
    flour: ASSETS.icons.sauce,
    fry_oil: ASSETS.icons.oilCan,
    potato_cheese: ASSETS.icons.shakeFries,
    soft_drink: ASSETS.food.soda,
    spicy_sauce: ASSETS.icons.chickenSpicy,
    honey_garlic_sauce: ASSETS.icons.chickenHoney,
    popcorn_chicken_meat: ASSETS.kitchen.gnPrepPopcornRaw || ASSETS.food.popcornChicken,
    chicken_thigh: ASSETS.kitchen.gnPrepThighRaw || ASSETS.food.spicyThigh,
    cheese_stick: ASSETS.food.cheeseStick,
    radish_danmuji: ASSETS.food.danmuji,
    coleslaw_salad: ASSETS.food.coleslaw,
  };
  const src = iconMap[item.id];
  if (src) {
    return `<img src="${src}" class="item-pixel-thumb" alt="${item.name}" width="32" height="32" />`;
  }
  return `<span class="item-icon-char">${item.icon}</span>`;
}

export function renderInventoryTab(state: GameState): string {
  const items = Object.values(state.inventory);
  const effects = upgradeEffects(state.upgrades);
  const marketDiscount = state.todayMarketDiscount || 0;
  const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);

  const rowsHtml = items.map(item => {
    const isLocked = item.unlocked === false;
    const canUnlockDay = state.day >= (item.unlockDay ?? 1);
    const canAfford = state.money >= (item.unlockCost ?? 0);

    if (isLocked) {
      return `
        <div class="item-row inv-grid-card is-locked" data-id="${item.id}">
          <div class="inv-card-header">
            <div class="item-icon" style="filter: grayscale(0.8); background: #eee;">${getInventoryIcon(item)}</div>
            <div class="item-meta">
              <div class="item-name">${item.name}</div>
              <span class="shelf-tag is-locked-tag"><img src="${ASSETS.icons.lock}" class="pixel-lock-img" alt="" /> Chưa ký HĐ</span>
            </div>
          </div>
          
          <div class="inv-card-body">
            <div class="item-sub locked-sub">
              ${canUnlockDay 
                ? `<div>Phí ký quỹ hợp đồng:</div><b style="color:var(--accent,#d97706);font-size:0.85rem;">${(item.unlockCost ?? 0).toLocaleString('vi-VN')}đ</b>`
                : `<div>Mở từ <b>Ngày ${item.unlockDay}</b></div><div>Phí: ${(item.unlockCost ?? 0).toLocaleString('vi-VN')}đ</div>`
              }
            </div>
          </div>

          <div class="btn-group inv-card-actions">
            ${canUnlockDay ? `
              <button class="btn-sm primary btn-unlock" data-id="${item.id}" ${!canAfford ? 'disabled' : ''} style="background:var(--accent,#b45309);border-color:var(--accent,#b45309);color:#fff;" title="Ký hợp đồng cung ứng">
                <img src="${ASSETS.icons.check}" class="btn-pixel-icon-xs" alt="" /> Mở HĐ<small>(${((item.unlockCost ?? 0) / 1000)}k)</small>
              </button>
            ` : `
              <button class="btn-sm" disabled style="opacity:0.6;font-size:0.7rem;padding:6px 8px;width:100%;">
                <img src="${ASSETS.icons.lock}" class="pixel-lock-img" alt="" /> Ngày ${item.unlockDay}
              </button>
            `}
          </div>
        </div>
      `;
    }

    const isLow = item.amount <= 5;
    const isOutOfStock = item.amount <= 0;
    const hasExpiringTodayBatch = !isOutOfStock && (
      (item.batches && item.batches.some(b => b.amount > 0 && b.daysLeft === 1)) ||
      (item.currentLifeDays <= 1)
    );
    const unitCost = Math.round(item.cost * (1 - discount / 100));
    const totalCost5 = unitCost * 5;
    const totalCost10 = unitCost * 10;

    return `
      <div class="item-row inv-grid-card ${isLow ? 'is-low-stock' : ''} ${isOutOfStock ? 'is-out-of-stock' : ''} ${hasExpiringTodayBatch ? 'shelf-expiring-soon' : ''}" data-id="${item.id}">
        <div class="inv-card-header">
          <div class="item-icon">${getInventoryIcon(item)}</div>
          <div class="item-meta">
            <div class="item-name">${item.name}</div>
            ${isOutOfStock 
              ? '<span class="shelf-tag is-out-tag">Hết hàng</span>'
              : hasExpiringTodayBatch
              ? '<span class="shelf-tag is-urgent-tag shelf-badge-expiring"><img src="' + ASSETS.icons.clock + '" class="btn-pixel-icon-xs" alt="" /> ⚠️ Hạn hôm nay!</span>'
              : '<span class="shelf-tag">HSD: ' + item.currentLifeDays + ' ngày</span>'}
          </div>
        </div>
        
        <div class="inv-card-body">
          <div class="item-sub ${isLow ? 'low-stock' : ''}">
            <div class="inv-stock-line">Tồn kho: <b>${item.amount} ${item.unit}</b></div>
            <div class="inv-cost-line">Giá sỉ: <b>${unitCost.toLocaleString('vi-VN')}đ</b> ${discount > 0 ? `<small style="color:var(--mint-dark,#10b981);font-weight:700;">(-${discount}%)</small>` : ''}</div>
          </div>
          ${item.batches && item.batches.length > 1 ? `
            <div class="inv-batch-info" style="font-size: 0.65rem; color: var(--soft); margin-top: 2px;">
              <img src="${ASSETS.icons.inventory}" class="btn-pixel-icon-xs" alt="" /> FIFO: ${item.batches.map(b => b.daysLeft === 1 && b.amount > 0 ? `<b style="color:#dc2626;">${b.amount}${item.unit}(hôm nay!)</b>` : `<b>${b.amount}</b>${item.unit}(${b.daysLeft}d)`).join(' · ')}
            </div>
          ` : ''}
        </div>

        <div class="btn-group inv-card-actions">
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

  const marketBannerHtml = state.todayMarketBargained
    ? (marketDiscount > 0
        ? `<div style="background: rgba(16,185,129,0.12); border: 1.5px solid #10b981; border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; font-size: 0.8rem; color: #065f46; display: flex; justify-content: space-between; align-items: center;">
            <span><img src="${ASSETS.icons.scooter}" class="btn-pixel-icon-xs" alt="" /> <b>Đã đi Chợ Lớn:</b> Giảm -${marketDiscount}% giá nhập sỉ cả ngày hôm nay!</span>
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
      <span>📦 Quản Lý Kho & Nguyên Liệu (Stardew Shelf)</span>
      <span style="font-size: 0.78rem; color: var(--soft); font-weight: normal;">Lưu ý: Mua dư hết hạn là lỗ!</span>
    </div>
    ${marketBannerHtml}
    <div class="sec-desc">
      Nhập đủ gà tươi, bột, dầu và gia vị trước giờ mở bán (10:00). Bấm <b>-5</b> để hoàn trả nếu lỡ tay mua nhầm!
      ${effects.shelfLifeBonus > 0 ? `<br><b style="color:var(--mint-dark,#10b981);">❄️ Kho lạnh bảo quản: +${effects.shelfLifeBonus} ngày hạn dùng cho mọi lô nhập mới!</b>` : ''}
    </div>
    <div class="inventory-list inventory-grid-stardew">
      ${rowsHtml}
    </div>
  `;
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

  // 1. Nhập hàng (+5 / +10)
  const buyButtons = document.querySelectorAll<HTMLElement>('.btn-buy');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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
    });
  });

  // 2. Hoàn vốn / Giảm nhập (-5)
  const refundButtons = document.querySelectorAll<HTMLElement>('.btn-refund');
  refundButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemId = btn.getAttribute('data-id');
      const qty = parseInt(btn.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];
      const available = refundableUnits(item);
      if (available < qty) {
        showToast('Chỉ đổi trả được hàng vừa nhập hôm nay (hàng tặng hoặc đã qua đêm thì không).');
        return;
      }

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
