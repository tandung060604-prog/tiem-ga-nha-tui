import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { addStock, refundPurchase, refundableUnits, signIngredientContract, isIngredientUnlocked, UnlockResult } from '../../core/inventory';
import { upgradeEffects } from '../../core/upgrades';
import { ASSETS } from '../../content/assets';

/**
 * Trạng thái Giỏ Hàng Nhập Sỉ Dự Kiến (Draft Cart)
 * - Khi bấm +5, +10: Chưa trừ tiền ngay, ghi nhận vào giỏ dự kiến
 * - Khi bấm -5: Giảm giỏ dự kiến (nếu có), hoặc hoàn trả lô hàng hôm nay (nếu giỏ = 0)
 * - Khi bấm [THANH TOÁN XẤP TIỀN]: Trừ tiền ví 1 lần, nhập hàng theo lô FIFO, pháo hoa tiền & biên lai
 */
let activeDraftCart: Record<string, number> = {};

export function getDraftCart(): Record<string, number> {
  return activeDraftCart;
}

export function resetDraftCart(): void {
  activeDraftCart = {};
}

export function setDraftCartItem(itemId: string, qty: number): void {
  if (qty <= 0) {
    delete activeDraftCart[itemId];
  } else {
    activeDraftCart[itemId] = qty;
  }
}

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

export function calculateDraftTotals(state: GameState, cart = activeDraftCart) {
  const effects = upgradeEffects(state.upgrades);
  const marketDiscount = state.todayMarketDiscount || 0;
  const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);

  let totalItems = 0;
  let totalCost = 0;
  const itemSummaries: string[] = [];

  for (const [id, qty] of Object.entries(cart)) {
    if (qty > 0 && state.inventory[id]) {
      const item = state.inventory[id];
      const unitCost = Math.round(item.cost * (1 - discount / 100));
      totalItems += qty;
      totalCost += unitCost * qty;
      itemSummaries.push(`${qty} ${item.name}`);
    }
  }

  return { totalItems, totalCost, discount, itemSummaries };
}

export function renderInventoryTab(state: GameState): string {
  const items = Object.values(state.inventory);
  const effects = upgradeEffects(state.upgrades);
  const marketDiscount = state.todayMarketDiscount || 0;
  const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);
  const { totalItems, totalCost, itemSummaries } = calculateDraftTotals(state, activeDraftCart);

  const rowsHtml = items.map(item => {
    const isLocked = item.unlocked === false;
    const canUnlockDay = state.day >= (item.unlockDay ?? 1);
    const canAffordUnlock = state.money >= (item.unlockCost ?? 0);

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
              <button class="btn-sm primary btn-unlock" data-id="${item.id}" ${!canAffordUnlock ? 'disabled' : ''} style="background:var(--accent,#b45309);border-color:var(--accent,#b45309);color:#fff;" title="Ký hợp đồng cung ứng">
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
    const draftQty = activeDraftCart[item.id] || 0;
    const availableRefund = refundableUnits(item);

    return `
      <div class="item-row inv-grid-card ${isLow ? 'is-low-stock' : ''} ${isOutOfStock ? 'is-out-of-stock' : ''} ${hasExpiringTodayBatch ? 'shelf-expiring-soon' : ''}" data-id="${item.id}">
        <div class="inv-card-header">
          <div class="item-icon">${getInventoryIcon(item)}</div>
          <div class="item-meta">
            <div class="item-name">${item.name}</div>
            <div class="inv-badge-wrap" style="display: flex; gap: 4px; flex-wrap: wrap;">
              ${isOutOfStock 
                ? '<span class="shelf-tag is-out-tag">Hết hàng</span>'
                : hasExpiringTodayBatch
                ? '<span class="shelf-tag is-urgent-tag shelf-badge-expiring"><img src="' + ASSETS.icons.clock + '" class="btn-pixel-icon-xs" alt="" /> ⚠️ Hạn hôm nay!</span>'
                : '<span class="shelf-tag">HSD: ' + item.currentLifeDays + ' ngày</span>'}
              
              <!-- Badge Dự Kiến Nhập Kho (Draft Cart Badge) -->
              <span class="shelf-tag is-draft-tag draft-badge-${item.id}" style="${draftQty > 0 ? 'display:inline-flex;' : 'display:none;'} background:#15803d; color:#fef08a; font-weight:800; border:1px solid #86efac;">
                Dự kiến: +${draftQty} ${item.unit}
              </span>
            </div>
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
          <button class="btn-sm btn-refund btn-refund-${item.id}" data-id="${item.id}" data-qty="5" ${draftQty === 0 && availableRefund < 5 ? 'disabled' : ''} title="${draftQty > 0 ? 'Bớt 5 phần khỏi đơn dự kiến' : 'Đổi trả trong ngày: chỉ hàng vừa nhập hôm nay'}">
            ${draftQty > 0 ? '-5<small>(bớt)</small>' : `-5<small>(+${(unitCost * 5 / 1000)}k)</small>`}
          </button>
          <button class="btn-sm btn-buy" data-id="${item.id}" data-qty="5" title="Chọn thêm 5 phần vào đơn nhập sỉ">
            +5<small>(${(totalCost5 / 1000)}k)</small>
          </button>
          <button class="btn-sm primary btn-buy" data-id="${item.id}" data-qty="10" title="Chọn thêm 10 phần vào đơn nhập sỉ">
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

  const hasDraftItems = totalItems > 0;
  const canAffordOrder = state.money >= totalCost;
  const remainingMoney = state.money - totalCost;

  return `
    <div class="sec-title">
      <span>📦 Quản Lý Kho & Nguyên Liệu (Stardew Shelf)</span>
      <span style="font-size: 0.78rem; color: var(--soft); font-weight: normal;">Lưu ý: Mua dư hết hạn là lỗ!</span>
    </div>
    ${marketBannerHtml}
    
    <!-- QUẦY THANH TOÁN XẤP TIỀN PIXEL ART (BULK DRAFT CART & PIXEL CASH CHECKOUT) -->
    <div id="inv-cash-checkout-banner" class="inv-cash-checkout-bar ${hasDraftItems ? 'is-active' : ''}" style="background: linear-gradient(135deg, #2b1810, #4a2810); border: 2.5px solid ${hasDraftItems ? '#facc15' : '#d4a373'}; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: ${hasDraftItems ? '0 0 16px rgba(234, 179, 8, 0.45)' : '0 6px 16px rgba(0,0,0,0.35)'};">
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
        <img src="${ASSETS.ui.pixelCashStack}" class="pixel-cash-stack-icon" alt="Xấp Tiền" style="width: 44px; height: 44px; image-rendering: pixelated; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));" />
        <div style="min-width: 0;">
          <div style="font-size: 0.72rem; font-weight: 800; color: #fde047; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
            💵 QUẦY THANH TOÁN TIỀN SỈ
            ${hasDraftItems ? `<span class="badge-draft-count" style="background:#facc15;color:#4a2810;padding:1px 6px;border-radius:10px;font-size:0.65rem;font-weight:900;">${totalItems} món</span>` : ''}
          </div>
          <div id="inv-checkout-status-text" style="font-size: 0.8rem; color: #fffdf0; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${hasDraftItems 
              ? `Tổng: <b style="color:#fde047;font-size:0.92rem;">${totalCost.toLocaleString('vi-VN')}đ</b> • ${canAffordOrder ? `Quỹ còn: <b style="color:#4ade80;">${remainingMoney.toLocaleString('vi-VN')}đ</b>` : `<b style="color:#f87171;">⚠️ Thiếu ${(totalCost - state.money).toLocaleString('vi-VN')}đ!</b>`}`
              : `Quỹ quán: <b style="color: #4ade80;">${state.money.toLocaleString('vi-VN')}đ</b> • Bấm +5, +10 để chọn hàng`}
          </div>
          ${hasDraftItems ? `
            <div id="inv-checkout-items-summary" style="font-size: 0.68rem; color: #d4a373; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              Đơn sỉ: ${itemSummaries.join(', ')}
            </div>
          ` : ''}
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
        <button id="btn-reset-draft-cart" class="pixel-btn" style="background: rgba(255,255,255,0.1); border: 1.5px solid #d4a373; color: #fef08a; padding: 7px 9px; font-size: 0.72rem; font-weight: 700; border-radius: 6px; cursor: pointer; ${hasDraftItems ? 'display:inline-flex;' : 'display:none;'}" title="Xóa toàn bộ số lượng đang chọn trong đơn dự kiến">
          ↺ Đặt lại
        </button>
        <button id="btn-inventory-cash-checkout" class="pixel-btn is-success btn-cash-checkout" ${!hasDraftItems ? 'disabled style="background:#374151;border-color:#6b7280;color:#9ca3af;opacity:0.7;"' : 'style="background: linear-gradient(135deg, #15803d, #166534); border: 2px solid #86efac; border-radius: 8px; color: #fff; padding: 8px 13px; font-size: 0.82rem; font-weight: 900; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.4); white-space: nowrap;"'} title="Ấn vào xấp tiền pixel để chốt thanh toán tiền hàng sỉ vào kho">
          <img src="${ASSETS.ui.pixelCashStack}" style="width: 20px; height: 20px; image-rendering: pixelated; object-fit: contain;" alt="" />
          <span id="btn-cash-checkout-label">${hasDraftItems ? `THANH TOÁN (${Math.round(totalCost / 1000)}k)` : 'CHƯA CÓ ĐƠN'}</span>
        </button>
      </div>
    </div>

    <div class="sec-desc">
      Nhập đủ gà tươi, bột, dầu và gia vị trước giờ mở bán (10:00). Bấm <b>-5</b> để bớt đơn dự kiến hoặc hoàn trả hàng mua hôm nay!
      ${effects.shelfLifeBonus > 0 ? `<br><b style="color:var(--mint-dark,#10b981);">❄️ Kho lạnh bảo quản: +${effects.shelfLifeBonus} ngày hạn dùng cho mọi lô nhập mới!</b>` : ''}
    </div>
    <div class="inventory-list inventory-grid-stardew">
      ${rowsHtml}
    </div>
  `;
}

/**
 * Đồng bộ DOM cục bộ của giỏ hàng kho (60 FPS Reactive Feedback)
 */
function syncCartDOM(state: GameState) {
  if (typeof document === 'undefined') return;

  const { totalItems, totalCost, itemSummaries } = calculateDraftTotals(state, activeDraftCart);
  const hasDraftItems = totalItems > 0;
  const canAffordOrder = state.money >= totalCost;
  const remainingMoney = state.money - totalCost;

  // 1. Cập nhật banner
  const banner = document.getElementById('inv-cash-checkout-banner');
  if (banner) {
    if (hasDraftItems) {
      banner.classList.add('is-active');
      banner.style.borderColor = '#facc15';
      banner.style.boxShadow = '0 0 16px rgba(234, 179, 8, 0.45)';
    } else {
      banner.classList.remove('is-active');
      banner.style.borderColor = '#d4a373';
      banner.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
    }
  }

  // 2. Cập nhật status text
  const statusText = document.getElementById('inv-checkout-status-text');
  if (statusText) {
    statusText.innerHTML = hasDraftItems
      ? `Tổng: <b style="color:#fde047;font-size:0.92rem;">${totalCost.toLocaleString('vi-VN')}đ</b> • ${canAffordOrder ? `Quỹ còn: <b style="color:#4ade80;">${remainingMoney.toLocaleString('vi-VN')}đ</b>` : `<b style="color:#f87171;">⚠️ Thiếu ${(totalCost - state.money).toLocaleString('vi-VN')}đ!</b>`}`
      : `Quỹ quán: <b style="color: #4ade80;">${state.money.toLocaleString('vi-VN')}đ</b> • Bấm +5, +10 để chọn hàng`;
  }

  // 3. Cập nhật items summary
  let summaryEl = document.getElementById('inv-checkout-items-summary');
  if (hasDraftItems) {
    if (!summaryEl && statusText && statusText.parentElement) {
      summaryEl = document.createElement('div');
      summaryEl.id = 'inv-checkout-items-summary';
      summaryEl.style.cssText = 'font-size: 0.68rem; color: #d4a373; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      statusText.parentElement.appendChild(summaryEl);
    }
    if (summaryEl) {
      summaryEl.textContent = `Đơn sỉ: ${itemSummaries.join(', ')}`;
      summaryEl.style.display = 'block';
    }
  } else if (summaryEl) {
    summaryEl.style.display = 'none';
  }

  // 4. Cập nhật nút đặt lại
  const resetBtn = document.getElementById('btn-reset-draft-cart');
  if (resetBtn) {
    resetBtn.style.display = hasDraftItems ? 'inline-flex' : 'none';
  }

  // 5. Cập nhật nút thanh toán xấp tiền
  const checkoutBtn = document.getElementById('btn-inventory-cash-checkout') as HTMLButtonElement | null;
  const checkoutLabel = document.getElementById('btn-cash-checkout-label');
  if (checkoutBtn) {
    checkoutBtn.disabled = !hasDraftItems;
    if (hasDraftItems) {
      checkoutBtn.style.cssText = 'background: linear-gradient(135deg, #15803d, #166534); border: 2px solid #86efac; border-radius: 8px; color: #fff; padding: 8px 13px; font-size: 0.82rem; font-weight: 900; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.4); white-space: nowrap;';
    } else {
      checkoutBtn.style.cssText = 'background: #374151; border: 2px solid #6b7280; border-radius: 8px; color: #9ca3af; opacity: 0.7; padding: 8px 13px; font-size: 0.82rem; font-weight: 900; display: flex; align-items: center; gap: 6px; cursor: not-allowed; white-space: nowrap;';
    }
  }
  if (checkoutLabel) {
    checkoutLabel.textContent = hasDraftItems ? `THANH TOÁN (${Math.round(totalCost / 1000)}k)` : 'CHƯA CÓ ĐƠN';
  }

  // 6. Cập nhật các badge dự kiến trên từng thẻ
  for (const item of Object.values(state.inventory)) {
    const draftQty = activeDraftCart[item.id] || 0;
    const badge = document.querySelector(`.draft-badge-${item.id}`) as HTMLElement | null;
    if (badge) {
      if (draftQty > 0) {
        badge.style.display = 'inline-flex';
        badge.textContent = `Dự kiến: +${draftQty} ${item.unit}`;
      } else {
        badge.style.display = 'none';
      }
    }

    const refundBtn = document.querySelector(`.btn-refund-${item.id}`) as HTMLButtonElement | null;
    if (refundBtn) {
      const effects = upgradeEffects(state.upgrades);
      const marketDiscount = state.todayMarketDiscount || 0;
      const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);
      const unitCost = Math.round(item.cost * (1 - discount / 100));
      const availableRefund = refundableUnits(item);

      if (draftQty > 0) {
        refundBtn.disabled = false;
        refundBtn.innerHTML = '-5<small>(bớt)</small>';
        refundBtn.title = 'Bớt 5 phần khỏi đơn dự kiến';
      } else {
        refundBtn.disabled = availableRefund < 5;
        refundBtn.innerHTML = `-5<small>(+${(unitCost * 5 / 1000)}k)</small>`;
        refundBtn.title = 'Đổi trả trong ngày: chỉ hàng vừa nhập hôm nay';
      }
    }
  }
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

  // 1. Thêm món vào Đơn Nhập Sỉ Dự Kiến (+5 / +10)
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

      // Thêm vào giỏ dự kiến
      activeDraftCart[itemId] = (activeDraftCart[itemId] || 0) + qty;
      audio.playPop();

      // Đồng bộ DOM tức thời
      syncCartDOM(state);

      const effects = upgradeEffects(state.upgrades);
      const marketDiscount = state.todayMarketDiscount || 0;
      const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);
      const unitCost = Math.round(item.cost * (1 - discount / 100));
      const estCost = unitCost * qty;
      showToast(`🛒 Đã chọn +${qty} ${item.name} (${estCost.toLocaleString('vi-VN')}đ). Bấm Xấp Tiền để thanh toán.`);
    });
  });

  // 2. Bớt hàng khỏi Đơn Dự Kiến hoặc Hoàn Vốn Hàng Đã Mua (-5)
  const refundButtons = document.querySelectorAll<HTMLElement>('.btn-refund');
  refundButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemId = btn.getAttribute('data-id');
      const qty = parseInt(btn.getAttribute('data-qty') || '5', 10);

      if (!itemId || !state.inventory[itemId]) return;

      const item = state.inventory[itemId];

      // A. Nếu đang có trong Đơn Dự Kiến -> Bớt khỏi đơn dự kiến
      if (activeDraftCart[itemId] && activeDraftCart[itemId] > 0) {
        activeDraftCart[itemId] = Math.max(0, activeDraftCart[itemId] - qty);
        if (activeDraftCart[itemId] === 0) {
          delete activeDraftCart[itemId];
        }
        audio.playPop();
        syncCartDOM(state);
        showToast(`Đã bớt ${qty} ${item.name} khỏi đơn dự kiến.`);
        return;
      }

      // B. Nếu không có trong Đơn Dự Kiến -> Hoàn vốn hàng đã mua trong ngày hôm nay
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

  // 4. Nút bấm THANH TOÁN XẤP TIỀN PIXEL ART (Thực thi giao dịch 1 lần)
  const checkoutBtn = document.getElementById('btn-inventory-cash-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const { totalItems, totalCost } = calculateDraftTotals(state, activeDraftCart);

      if (totalItems === 0) {
        showToast('🛒 Chưa có món nào trong đơn! Bấm +5, +10 ở từng món để lên đơn nhập sỉ.');
        return;
      }

      if (state.money < totalCost) {
        const banner = document.getElementById('inv-cash-checkout-banner');
        if (banner) {
          banner.classList.add('shake');
          setTimeout(() => banner.classList.remove('shake'), 600);
        }
        showToast(`⚠️ Quỹ quán không đủ tiền! Cần ${totalCost.toLocaleString('vi-VN')}đ (còn thiếu ${(totalCost - state.money).toLocaleString('vi-VN')}đ).`);
        return;
      }

      const effects = upgradeEffects(state.upgrades);
      const marketDiscount = state.todayMarketDiscount || 0;
      const discount = Math.min(60, (effects.discountWholesale || 0) + marketDiscount);
      const cartSnapshot = { ...activeDraftCart };

      // Chốt đơn giao dịch
      onUpdateState(draft => {
        if (draft.money < totalCost) return;
        draft.money -= totalCost;
        for (const [id, qty] of Object.entries(cartSnapshot)) {
          if (qty > 0 && draft.inventory[id]) {
            const item = draft.inventory[id];
            const unitCost = Math.round(item.cost * (1 - discount / 100));
            addStock(item, qty, unitCost, effects.shelfLifeBonus);
          }
        }
      });

      // Hiệu ứng pháo hoa confetti tiền giấy
      try {
        const c = (window as any).confetti;
        if (typeof c === 'function') {
          c({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.25 },
            colors: ['#22c55e', '#16a34a', '#facc15', '#fef08a', '#ffffff']
          });
        }
      } catch {}

      audio.playCash();
      showToast(`🧾 ĐÃ THANH TOÁN: -${totalCost.toLocaleString('vi-VN')}đ nhập ${totalItems} món vào kho sẵn sàng!`);

      // Xóa giỏ hàng dự kiến sau khi thanh toán thành công
      activeDraftCart = {};
      syncCartDOM(state);
    });
  }

  // 5. Nút HỦY ĐƠN / ĐẶT LẠI GIỎ HÀNG DỰ KIẾN
  const resetBtn = document.getElementById('btn-reset-draft-cart');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeDraftCart = {};
      audio.playPop();
      syncCartDOM(state);
      showToast('Đã xóa đơn hàng dự kiến.');
    });
  }
}
