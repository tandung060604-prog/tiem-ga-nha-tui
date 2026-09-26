import { GameState, CustomerOrder, QualityRating } from '../../types/game';
import { cookingEngine } from '../../core/cooking';
import { SellingSession } from '../../core/sellingSim';
import { isRushHour } from '../../core/clock';
import { foodImage } from '../../content/assets';

export type { SellingSession };

function formatClock(gameHour: number): string {
  const h = Math.floor(gameHour);
  const m = Math.floor((gameHour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function patienceLevel(order: CustomerOrder): { percent: number; cls: '' | 'mid' | 'low'; angry: boolean } {
  const percent = Math.max(0, Math.round((order.patienceCurrent / order.patienceMax) * 100));
  return { percent, cls: percent > 50 ? '' : percent > 25 ? 'mid' : 'low', angry: percent <= 25 };
}

// Mọi thứ làm thay đổi CẤU TRÚC màn bán hàng. Khác key cũ → dựng lại HTML; giống → chỉ patch.
// Không đưa vào đây những giá trị đổi mỗi frame (giờ, kiên nhẫn, tiến độ chiên), nếu không
// nút sẽ bị thay giữa lúc người chơi đang bấm và click bị nuốt.
export function sellingStructureKey(state: GameState, session: SellingSession): string {
  const cook = cookingEngine.getCookState();
  return JSON.stringify([
    session.orders.map(o => [o.id, o.items.map(it => it.served)]),
    cookingEngine.getTray().map(t => t.id),
    cook.isFrying, cook.fryingType, cookingEngine.getActiveSeasoning(),
    state.oilCondition, state.currentChapter,
    session.isFastForward, isRushHour(session.gameHour)
  ]);
}

// Cập nhật tại chỗ các giá trị chạy theo thời gian; không tạo/xóa node.
export function patchSellingView(root: HTMLElement, session: SellingSession): void {
  const clock = root.querySelector('.clock b');
  if (clock) clock.textContent = formatClock(session.gameHour);

  for (const order of session.orders) {
    const card = root.querySelector<HTMLElement>(`.customer-card[data-order-id="${order.id}"]`);
    if (!card) continue;
    const p = patienceLevel(order);
    card.classList.toggle('angry', p.angry);
    const fill = card.querySelector<HTMLElement>('.patience-fill');
    if (fill) {
      fill.style.width = `${p.percent}%`;
      fill.classList.toggle('mid', p.cls === 'mid');
      fill.classList.toggle('low', p.cls === 'low');
    }
  }

  const cook = cookingEngine.getCookState();
  const pointer = root.querySelector<HTMLElement>('.cook-gauge-pointer');
  if (pointer) pointer.style.left = `${Math.min(100, Math.round(cook.progress))}%`;
  const hint = root.querySelector('.pot-hint');
  if (hint) hint.textContent = potHint();
}

function potHint(): string {
  const cook = cookingEngine.getCookState();
  if (!cook.isFrying) return 'Bấm để thả gà/khoai';
  return cookingEngine.calculateCurrentQuality() === 'perfect' ? '👉 NHẤC LÊN NGAY! (Perfect)' : 'Đang chiên xèo xèo...';
}

const TRAY_QUALITY_LABEL: Record<QualityRating, string> = {
  raw: 'CÒN SỐNG',
  good: 'VỪA CHÍN',
  perfect: 'VÀNG GIÒN',
  burnt: 'CHÁY KHÉT'
};

export function renderSellingView(state: GameState, session: SellingSession): string {
  const formattedTime = formatClock(session.gameHour);
  const rush = isRushHour(session.gameHour);

  // Customer Lane HTML
  const customerCardsHtml = session.orders.map((ord, idx) => {
    const { percent: patiencePercent, cls: patienceColorClass, angry: isAngry } = patienceLevel(ord);

    const itemsHtml = ord.items.map(it => {
      const menuItem = state.menu.find(m => m.id === it.menuItemId);
      const name = menuItem ? menuItem.name : it.menuItemId;
      return `
        <div class="order-row">
          <span class="order-item-title">${menuItem ? menuItem.icon : '🍗'} ${it.count > 1 ? `${it.served}/${it.count}` : '1x'} ${name}</span>
          <span class="order-check ${it.completed ? 'done' : ''}">${it.completed ? '✓' : '○'}</span>
        </div>
      `;
    }).join('');

    const isImageAvatar = ord.avatar.startsWith('/') || ord.avatar.includes('.');
    const avatarHtml = isImageAvatar
      ? `<img src="${ord.avatar}" alt="${ord.customerName}" class="cust-avatar-img" />`
      : ord.avatar;

    return `
      <div class="customer-card ${ord.isBunny ? 'bunny-card' : ''} ${isAngry ? 'angry' : ''} ${idx === 0 ? 'active' : ''}" data-order-id="${ord.id}" data-is-bunny="${ord.isBunny ? 'true' : 'false'}" data-letter-id="${ord.bunnyLetterId || ''}">
        <div class="cust-header">
          <div class="cust-avatar">${avatarHtml}</div>
          <div class="cust-name">
            ${ord.customerName}
            ${ord.isDelivery ? '<span class="delivery-badge">Shipper</span>' : ''}
            ${ord.isBunny ? '<span class="bunny-badge">🐰 Tri Kỷ</span>' : ''}
          </div>
        </div>

        <div class="speech-bubble">
          ${itemsHtml}
        </div>

        <div class="patience-container">
          <div class="patience-bar">
            <div class="patience-fill ${patienceColorClass}" style="width: ${patiencePercent}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Fryer Pot State
  const cookState = cookingEngine.getCookState();
  const tray = cookingEngine.getTray();
  const oilCondition = state.oilCondition;

  const potProgressPercent = Math.min(100, Math.round(cookState.progress));

  const oilLabel = oilCondition === 'clean' ? 'Vàng óng' : oilCondition === 'medium' ? 'Nâu sẫm' : 'Đen khét (Giảm sao!)';

  // Tray HTML
  const traySlotsHtml = [0, 1, 2, 3].map(slotIdx => {
    const item = tray[slotIdx];
    if (item) {
      const isDrink = item.menuItemId === 'soda';
      const img = foodImage(item.menuItemId, item.quality);
      const qClass = isDrink ? 'good' : item.quality;
      const qText = isDrink ? 'ƯỚP LẠNH' : TRAY_QUALITY_LABEL[item.quality];
      return `
        <div class="tray-item" data-tray-idx="${slotIdx}" title="Bấm để vứt nếu bị cháy">
          ${img ? `<img class="t-icon t-img" src="${img}" alt="${item.name}" width="36" height="36" />` : `<span class="t-icon">${item.icon}</span>`}
          <span class="t-name">${item.name}</span>
          <span class="t-quality ${qClass}">${qText}</span>
        </div>
      `;
    }
    return `
      <div style="border: 1.5px dashed var(--line); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--line); font-size: 0.7rem; font-weight: 700;">
        Trống
      </div>
    `;
  }).join('');

  return `
    <div class="selling-screen">
      <!-- HUD Time & Rush Hour -->
      <div class="kitchen-hud">
        <div class="clock">
          <span>🕒 Giờ mở bán: <b>${formattedTime}</b></span>
        </div>
        ${rush ? '<span class="rush-badge">🔥 CA CAO ĐIỂM!</span>' : '<span style="color: var(--soft); font-size: 0.74rem;">Ca bán bình thường</span>'}
        <div style="display: flex; gap: 6px;">
          <button id="btn-toggle-fast" class="btn-sm" style="font-size: 0.7rem; padding: 2px 8px;">
            ${session.isFastForward ? '⏩ Tua x2' : '▶️ 1x'}
          </button>
        </div>
      </div>

      <!-- Customer Queue Lane -->
      <div class="customer-lane">
        ${session.orders.length > 0 ? customerCardsHtml : '<div class="empty-queue">Đang chờ khách tới quầy... 🏃</div>'}
      </div>

      <!-- Wood Kitchen Counter -->
      <div class="kitchen-counter">
        <div class="work-grid">
          <!-- Fryer Card -->
          <div class="fryer-card">
            <div class="fryer-header">
              <span>🍳 Chảo Chiên</span>
              <div class="oil-status">
                <span class="oil-dot ${oilCondition}"></span>
                <span>Dầu: ${oilLabel}</span>
              </div>
            </div>

            <!-- The Boiling Pot -->
            <div id="btn-fry-pot" class="fry-pot ${oilCondition !== 'clean' ? 'oil-' + oilCondition : ''}">
              <div class="bubble" style="left: 20%; animation-delay: 0s;"></div>
              <div class="bubble" style="left: 55%; animation-delay: 0.4s;"></div>
              <div class="bubble" style="left: 75%; animation-delay: 0.8s;"></div>
              
              <div class="pot-chicken">
                ${cookState.isFrying ? (cookState.fryingType === 'chicken' ? '🍗' : '🍟') : '✨'}
              </div>
              <div class="pot-hint">${potHint()}</div>
            </div>

            <!-- Cooking Progress Gauge -->
            <div class="cook-gauge-container">
              <div class="gauge-labels">
                <span class="gauge-label-raw">SỐNG</span>
                <span class="gauge-label-perfect">VÀNG GIÒN (PERFECT)</span>
                <span class="gauge-label-burnt">CHÁY</span>
              </div>
              <div class="cook-gauge">
                <div class="cook-gauge-zones">
                  <div class="zone-raw"></div>
                  <div class="zone-good"></div>
                  <div class="zone-perfect"></div>
                  <div class="zone-good"></div>
                  <div class="zone-burnt"></div>
                </div>
                <div class="cook-gauge-pointer" style="left: ${potProgressPercent}%;"></div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 2px;">
              <button id="btn-fry-chicken" class="btn-sm primary" ${cookState.isFrying ? 'disabled' : ''}>+ Gà Rán</button>
              <button id="btn-fry-fries" class="btn-sm" ${cookState.isFrying ? 'disabled' : ''}>+ Khoai</button>
              <button id="btn-add-drink" class="btn-sm">🥤 Nước</button>
              <button id="btn-change-oil" class="oil-change-btn">Thay dầu (150k)</button>
            </div>
          </div>

          <!-- Tray & Assemble Card -->
          <div class="assemble-card">
            <div class="tray-title">
              <span>🍱 Khay Thành Phẩm (${tray.length}/4)</span>
              <span style="font-size: 0.68rem; color: var(--soft);">Bấm khay để vứt</span>
            </div>

            <div class="tray-slots">
              ${traySlotsHtml}
            </div>

            <!-- Seasoning Addons (món sốt mở từ chương 2) -->
            ${state.currentChapter < 2 ? '' : `<div class="addon-station">
              <button id="btn-season-spicy" class="addon-btn ${cookingEngine.getActiveSeasoning() === 'spicy' ? 'active' : ''}">
                🌶️ Cay
              </button>
              <button id="btn-season-honey" class="addon-btn ${cookingEngine.getActiveSeasoning() === 'honey' ? 'active' : ''}">
                🍯 Mật Ong
              </button>
            </div>`}

            <!-- Serve Button -->
            <button id="btn-serve-order" class="btn-serve" ${session.orders.length === 0 || tray.length === 0 ? 'disabled' : ''}>
              🔔 GIAO MÓN (SERVE)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
