import { staffEffects } from '../../core/staff';
import { GameState, CustomerOrder, QualityRating } from '../../types/game';
import { cookingEngine } from '../../core/cooking';
import { SellingSession } from '../../core/sellingSim';
import { isRushHour } from '../../core/clock';
import { foodImage, ASSETS } from '../../content/assets';
import { TIMER_RECIPES, TimerStationId, timerPhase, DRINK_RECIPES, DrinkId, ASSEMBLY_RECIPES, AssemblyId, assemblyBaseIndex } from '../../core/stations';
import { stationOpen } from '../../core/day';
import { escapeHtml } from '../escapeHtml';

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
export function sellingStructureKey(state: GameState, session: SellingSession): string {
  const cook = cookingEngine.getCookState();
  const quality = cookingEngine.calculateCurrentQuality();
  return JSON.stringify([
    session.orders.map(o => [o.id, o.items.map(it => it.served)]),
    cookingEngine.getTray().map(t => t.id),
    cook.isFrying, cook.fryingType, quality, cookingEngine.getActiveSeasoning(),
    state.oilCondition, state.currentChapter,
    session.isFastForward, isRushHour(session.gameHour),
    stationStripKey(state, session),
    staffStripKey(state, session)
  ]);
}

// Cập nhật tại chỗ các giá trị chạy theo thời gian; không tạo/xóa node.
// Cập nhật tại chỗ các giá trị chạy theo thời gian; không tạo/xóa node.
export function patchSellingView(root: HTMLElement, session: SellingSession, state?: GameState): void {
  if (state) {
    const cooks = staffEffects(state.staff, session.gameHour).cooks;
    cooks.forEach((c, i) => {
      const el = root.querySelector<HTMLElement>(`.helper-progress[data-helper="${i}"]`);
      const slot = session.helpers?.[i];
      if (el && slot) el.textContent = `${Math.min(100, Math.round((slot.elapsedMs / c.cycleMs) * 100))}%`;
    });
  }
  const clock = root.querySelector('.clock b');
  if (clock) clock.textContent = formatClock(session.gameHour);

  for (const id of Object.keys(TIMER_RECIPES) as TimerStationId[]) {
    const el = root.querySelector<HTMLElement>(`.timer-progress[data-timer="${id}"]`);
    const elapsed = session.timers[id];
    if (el && elapsed !== null) {
      const r = TIMER_RECIPES[id];
      const pct = Math.min(100, Math.round((elapsed / r.cookMs) * 100));
      el.textContent = timerPhase(r, elapsed) === 'cooking' ? `${pct}%` : '';
    }
  }

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
    const moodEmoji = card.querySelector<HTMLElement>('.mood-indicator');
    if (moodEmoji) {
      moodEmoji.textContent = p.angry ? '💢' : p.cls === 'low' ? '🥺' : p.cls === 'mid' ? '😋' : '✨';
    }

    // Dynamic 2D sprite expression swap
    const img = card.querySelector<HTMLImageElement>('.char-sprite-img');
    if (img) {
      const standSrc = card.dataset.standSrc;
      const angrySrc = card.dataset.angrySrc;
      const walkSrc = card.dataset.walkSrc;
      const isNew = Date.now() - order.startTime < 750;

      if (p.angry && angrySrc) {
        if (!img.src.endsWith(angrySrc)) img.src = angrySrc;
        img.classList.remove('standing', 'walking');
        img.classList.add('angry');
      } else if (isNew && walkSrc) {
        if (!img.src.endsWith(walkSrc)) img.src = walkSrc;
        img.classList.remove('standing', 'angry');
        img.classList.add('walking');
      } else if (standSrc) {
        if (!img.src.endsWith(standSrc)) img.src = standSrc;
        img.classList.remove('angry', 'walking');
        img.classList.add('standing');
      }
    }
  }

  const cook = cookingEngine.getCookState();
  const pointer = root.querySelector<HTMLElement>('.cook-gauge-pointer');
  if (pointer) pointer.style.left = `${Math.min(100, Math.round(cook.progress))}%`;
  const hint = root.querySelector('.pot-hint');
  if (hint) hint.textContent = potHint();

  const fryPot = root.querySelector<HTMLElement>('#btn-fry-pot');
  if (fryPot && cook.isFrying) {
    const quality = cookingEngine.calculateCurrentQuality();
    fryPot.classList.toggle('perfect-glow', quality === 'perfect');
    fryPot.classList.toggle('burnt-smoke', quality === 'burnt');
  }
}

function potHint(): string {
  const cook = cookingEngine.getCookState();
  if (!cook.isFrying) return '👉 Chạm để thả gà tươi / khoai vào chảo!';
  const quality = cookingEngine.calculateCurrentQuality();
  if (quality === 'perfect') return '⭐ VÀNG GIÒN RỒI! BẤM VỚT NGAY!';
  if (quality === 'burnt') return '💥 CHÁY KHÉT! BẤM VỚT BỎ NGAY!';
  if (quality === 'good') return '🔥 Dầu sôi xèo xèo... Canh vàng giòn!';
  return '🍗 Đang chiên ngập dầu... Chờ chín!';
}

const TRAY_QUALITY_LABEL: Record<QualityRating, string> = {
  raw: 'CÒN SỐNG',
  good: 'VỪA CHÍN',
  perfect: 'VÀNG GIÒN ⭐',
  burnt: 'CHÁY KHÉT'
};

export interface CustomerVisualModel {
  stand: string;
  walk: string;
  angry: string;
  leave: string;
  name: string;
  badge: string;
  badgeClass: string;
}

function getCustomerVisual(order: CustomerOrder): CustomerVisualModel {
  if (order.isBunny) {
    return {
      stand: ASSETS.thocam.front,
      walk: ASSETS.thocam.side,
      angry: ASSETS.thocam.buon,
      leave: ASSETS.thocam.vui,
      name: 'Bé Thỏ Cam 🐰',
      badge: 'Khách Tri Kỷ',
      badgeClass: 'bunny-badge'
    };
  }
  if (order.customerName.includes('Bác Ba')) {
    return {
      stand: ASSETS.bacba.front,
      walk: ASSETS.bacba.threeQuarter,
      angry: ASSETS.bacba.front,
      leave: ASSETS.bacba.threeQuarter,
      name: order.customerName,
      badge: 'Trưởng Ban Hẻm',
      badgeClass: 'vip-badge'
    };
  }
  if (order.customerName.includes('Gà Bông') || order.isMysteryGuest) {
    return {
      stand: ASSETS.gabong.front,
      walk: ASSETS.gabong.side,
      angry: ASSETS.gabong.hoang,
      leave: ASSETS.gabong.vui,
      name: order.customerName,
      badge: 'Khách Bí Ẩn',
      badgeClass: 'mystery-badge'
    };
  }
  if (order.isDelivery || order.customerName.includes('Shipper') || order.customerName.includes('Giao Hàng') || order.customerName.includes('[App]')) {
    return {
      stand: ASSETS.shipper.stand,
      walk: ASSETS.shipper.walk,
      angry: ASSETS.shipper.angry,
      leave: ASSETS.shipper.leave,
      name: order.customerName,
      badge: 'Shipper Ruột',
      badgeClass: 'delivery-badge'
    };
  }

  const n = order.customerName;
  if (n.includes('Học Sinh') || n.includes('Sinh Viên') || n.includes('Kiệt') || n.includes('Vy') || n.includes('Khôi') || n.includes('Nguyên')) {
    return {
      stand: ASSETS.hocsinh.stand,
      walk: ASSETS.hocsinh.walk,
      angry: ASSETS.hocsinh.angry,
      leave: ASSETS.hocsinh.leave,
      name: order.customerName,
      badge: 'Học Sinh Ôn Thi',
      badgeClass: 'student-badge'
    };
  }
  if (n.includes('Game') || n.includes('Huy') || n.includes('Rank') || n.includes('Cú Đêm') || n.includes('Bảo')) {
    return {
      stand: ASSETS.gamethu.stand,
      walk: ASSETS.gamethu.walk,
      angry: ASSETS.gamethu.angry,
      leave: ASSETS.gamethu.leave,
      name: order.customerName,
      badge: 'Cú Đêm Cày Rank',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Review') || n.includes('Tiktok') || n.includes('Mukbang') || n.includes('Quỳnh Anh') || n.includes('Hân') || n.includes('Trend')) {
    return {
      stand: ASSETS.tiktoker.stand,
      walk: ASSETS.tiktoker.walk,
      angry: ASSETS.tiktoker.angry,
      leave: ASSETS.tiktoker.leave,
      name: order.customerName,
      badge: 'Tiktoker Triệu View',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Khó Tính') || n.includes('Karen') || n.includes('Lan') || n.includes('Hằng') || n.includes('Soi')) {
    return {
      stand: ASSETS.karen.stand,
      walk: ASSETS.karen.walk,
      angry: ASSETS.karen.angry,
      leave: ASSETS.karen.leave,
      name: order.customerName,
      badge: 'Thực Khách Kỹ Tính',
      badgeClass: 'demanding-badge'
    };
  }
  if (n.includes('Bắp') || n.includes('Bé') || n.includes('Mít') || n.includes('Cháu')) {
    return {
      stand: ASSETS.becon.stand,
      walk: ASSETS.becon.walk,
      angry: ASSETS.becon.angry,
      leave: ASSETS.becon.leave,
      name: order.customerName,
      badge: 'Khách Hàng Nhí',
      badgeClass: 'kid-badge'
    };
  }
  if (n.includes('Trưởng Phòng') || n.includes('Long') || n.includes('Khải') || n.includes('Sếp')) {
    return {
      stand: ASSETS.truongphong.stand,
      walk: ASSETS.truongphong.walk,
      angry: ASSETS.truongphong.angry,
      leave: ASSETS.truongphong.leave,
      name: order.customerName,
      badge: 'Sếp Khao Team',
      badgeClass: 'office-badge'
    };
  }
  if (n.includes('Bảy') || n.includes('Bà') || n.includes('Chợ Cũ') || n.includes('Cô Tư') || n.includes('Bác Hạc')) {
    return {
      stand: ASSETS.babay.stand,
      walk: ASSETS.babay.walk,
      angry: ASSETS.babay.angry,
      leave: ASSETS.babay.leave,
      name: order.customerName,
      badge: 'Bà Bảy Nam Bộ',
      badgeClass: 'local-badge'
    };
  }
  if (n.includes('Cặp Đôi') || n.includes('Bé Na') || n.includes('Bạn Trai') || n.includes('Hẹn Hò')) {
    return {
      stand: ASSETS.capdoi.stand,
      walk: ASSETS.capdoi.walk,
      angry: ASSETS.capdoi.angry,
      leave: ASSETS.capdoi.leave,
      name: order.customerName,
      badge: 'Cặp Đôi Hẹn Hò',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Su Su') || n.includes('Mẹ Con') || n.includes('Gia Đình') || n.includes('Nhà')) {
    return {
      stand: ASSETS.mecon.stand,
      walk: ASSETS.mecon.walk,
      angry: ASSETS.mecon.angry,
      leave: ASSETS.mecon.leave,
      name: order.customerName,
      badge: 'Gia Đình Ấm Cúng',
      badgeClass: 'family-badge'
    };
  }

  // Default: Office Lady
  return {
    stand: ASSETS.vanphong.stand,
    walk: ASSETS.vanphong.walk,
    angry: ASSETS.vanphong.angry,
    leave: ASSETS.vanphong.leave,
    name: order.customerName,
    badge: order.archetypeBadge || 'Dân Văn Phòng',
    badgeClass: 'office-badge'
  };
}

export function renderSellingView(state: GameState, session: SellingSession): string {
  const formattedTime = formatClock(session.gameHour);
  const rush = isRushHour(session.gameHour);
  const hourNum = session.gameHour;
  const timePeriodLabel = hourNum < 14 ? '☀️ Ca Trưa Hẻm 1102 · Nắng Vàng Giòn Rụm' : '🌙 Ca Tối Hẻm 1102 · Đèn Dầu Bập Bùng';

  // Customer Queue Lane
  const customerCardsHtml = session.orders.map((ord, idx) => {
    const { percent: patiencePercent, cls: patienceColorClass, angry: isAngry } = patienceLevel(ord);
    const visual = getCustomerVisual(ord);

    const comboHtml = ord.comboName ? `<div class="order-combo" style="font-size: .72rem; font-weight: 800; color: var(--red);">🍱 ${escapeHtml(ord.comboName)}</div>` : '';
    const itemsHtml = comboHtml + ord.items.map(it => {
      const menuItem = state.menu.find(m => m.id === it.menuItemId);
      const name = menuItem ? menuItem.name : it.menuItemId;
      const img = foodImage(it.menuItemId, 'perfect');
      return `
        <div class="order-row">
          <span class="order-item-title">
            ${img ? `<img src="${img}" class="order-food-thumb" alt="${name}" />` : `<span class="order-food-emoji">${menuItem ? menuItem.icon : '🍗'}</span>`}
            ${it.count > 1 ? `${it.served}/${it.count}` : '1x'} ${name}
          </span>
          <span class="order-check ${it.completed ? 'done' : ''}">${it.completed ? '✓' : '○'}</span>
        </div>
      `;
    }).join('');

    const isNew = Date.now() - ord.startTime < 750;
    const initialSrc = isAngry ? visual.angry : isNew ? visual.walk : visual.stand;
    const initialCls = isAngry ? 'angry' : isNew ? 'walking' : 'standing';
    const actorHtml = `<img src="${initialSrc}" alt="${visual.name}" class="char-sprite-img ${initialCls}" />`;

    return `
      <div class="customer-card ${ord.isBunny ? 'bunny-card' : ''} ${isAngry ? 'angry' : ''} ${idx === 0 ? 'active' : ''}" 
           data-order-id="${ord.id}" 
           data-is-bunny="${ord.isBunny ? 'true' : 'false'}" 
           data-letter-id="${ord.bunnyLetterId || ''}"
           data-stand-src="${visual.stand}"
           data-walk-src="${visual.walk}"
           data-angry-src="${visual.angry}"
           data-leave-src="${visual.leave}">
        <!-- 2D Character Walking & Standing Stage -->
        <div class="cust-stage">
          <div class="char-actor">
            ${actorHtml}
            <div class="char-shadow"></div>
          </div>
          <div class="cust-info-col">
            <div class="cust-name-row">
              <span class="cust-name">${visual.name}</span>
              <span class="mood-indicator">${isAngry ? '💢' : patienceColorClass === 'low' ? '🥺' : '✨'}</span>
            </div>
            <span class="cust-badge ${visual.badgeClass}">${visual.badge}</span>
          </div>
        </div>

        <!-- Speech Bubble Order -->
        <div class="speech-bubble">
          <div class="bubble-arrow"></div>
          ${itemsHtml}
        </div>

        <!-- Patience Bar -->
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
  const quality = cookingEngine.calculateCurrentQuality();
  const tray = cookingEngine.getTray();
  const oilCondition = state.oilCondition;

  const chickenStock = state.inventory.chicken_meat?.amount ?? 0;
  const friesStock = state.inventory.potato_cheese?.amount ?? 0;
  const drinkStock = state.inventory.soft_drink?.amount ?? 0;

  const potProgressPercent = Math.min(100, Math.round(cookState.progress));
  const oilLabel = oilCondition === 'clean' ? 'Vàng óng (Thơm lừng)' : oilCondition === 'medium' ? 'Nâu hổ phách' : 'Đen khét (Bốc khói!)';

  // Render food in pan
  let panFoodHtml = '';
  if (cookState.isFrying) {
    if (cookState.fryingType === 'chicken') {
      const foodImg = quality === 'raw' 
        ? ASSETS.food.crispyChickenRaw 
        : quality === 'burnt' 
        ? ASSETS.food.crispyChickenBurnt 
        : ASSETS.food.crispyChickenPerfect;
      
      const qualityTag = quality === 'perfect' ? '⭐ VÀNG GIÒN' : quality === 'burnt' ? '💥 CHÁY KHÉT' : quality === 'good' ? 'VỪA CHÍN' : 'SỐNG';

      panFoodHtml = `
        <div class="frying-food-item ${quality} sizzle-active">
          <img src="${foodImg}" alt="Gà chiên" class="food-pan-img" />
          <div class="food-status-badge ${quality}">${qualityTag}</div>
          ${quality === 'perfect' ? '<div class="perfect-sparkles">✨</div>' : ''}
          ${quality === 'burnt' ? '<div class="burnt-smoke-puff">💨</div>' : ''}
        </div>
      `;
    } else {
      panFoodHtml = `
        <div class="frying-food-item perfect sizzle-active">
          <img src="${ASSETS.food.shakeFries}" alt="Khoai tây chiên" class="food-pan-img" />
          <div class="food-status-badge perfect">🍟 KHOAI LẮC</div>
        </div>
      `;
    }
  } else {
    panFoodHtml = `
      <div class="pot-idle-view">
        <span class="pan-big-icon">🍳</span>
        <div class="pan-idle-text">Chảo dầu sôi 180°C sẵn sàng</div>
      </div>
    `;
  }

  // Tray HTML
  const traySlotsHtml = Array.from({ length: cookingEngine.getTraySize() }, (_, i) => i).map(slotIdx => {
    const item = tray[slotIdx];
    if (item) {
      const isDrink = item.menuItemId === 'soda' || item.menuItemId === 'seven_up';
      const img = foodImage(item.menuItemId, item.quality);
      const qClass = isDrink ? 'good' : item.quality;
      const qText = isDrink ? 'ƯỚP LẠNH ❄️' : TRAY_QUALITY_LABEL[item.quality];
      const condimentHtml = item.condiment === 'ketchup'
        ? `<span class="tray-condiment-tag ketchup">🍅 Tương Cà</span>`
        : item.condiment === 'chili'
        ? `<span class="tray-condiment-tag chili">🌶️ Tương Ớt</span>`
        : '';
      return `
        <div class="tray-item" data-tray-idx="${slotIdx}" title="Bấm để vớt hoặc vứt">
          <div class="tray-food-frame">
            ${img ? `<img class="t-icon t-img" src="${img}" alt="${item.name}" width="52" height="52" />` : `<span class="t-icon">${item.icon}</span>`}
            ${condimentHtml}
          </div>
          <span class="t-name">${item.name}</span>
          <span class="t-quality ${qClass}">${qText}</span>
        </div>
      `;
    }
    return `
      <div class="tray-slot-empty">
        <span class="empty-wire-icon">▤</span>
        <span class="empty-wire-label">Vỉ ráo dầu</span>
      </div>
    `;
  }).join('');

  return `
    <div class="selling-screen">
      <!-- HUD Time & Sài Gòn Ambience -->
      <div class="kitchen-hud">
        <div class="clock">
          <span>🕒 Giờ mở bán: <b>${formattedTime}</b></span>
        </div>
        ${rush ? '<span class="rush-badge">🔥 CA CAO ĐIỂM!</span>' : `<span class="session-ambience">${timePeriodLabel}</span>`}
        <div style="display: flex; gap: 6px;">
          <button id="btn-toggle-fast" class="btn-sm" style="font-size: 0.7rem; padding: 2px 8px;">
            ${session.isFastForward ? '⏩ Tua x2' : '▶️ 1x'}
          </button>
        </div>
      </div>

      <!-- Customer Queue Lane (Khách vào/ra quán) -->
      <div class="customer-lane">
        ${session.orders.length > 0 ? customerCardsHtml : '<div class="empty-queue">🍗 Mùi gà thơm phức bay khắp hẻm... Khách đang tấp nập tới! 🏃</div>'}
      </div>

      <!-- Wood Kitchen Counter (Quầy Bếp Gỗ Chiên Gà) -->
      <div class="kitchen-counter">
        <div class="work-grid">
          <!-- Real Cast Iron Fryer Card (Bếp Chiên Ngập Dầu Chợ Lớn) -->
          <div class="fryer-card">
            <div class="fryer-header">
              <span>🍳 Bếp Chiên Ngập Dầu 1990</span>
              <div class="oil-status">
                <span class="oil-dot ${oilCondition}"></span>
                <span>Dầu: ${oilLabel}</span>
              </div>
            </div>

            <!-- The Boiling Pot with Real Food Asset -->
            <div id="btn-fry-pot" class="fry-pot ${oilCondition !== 'clean' ? 'oil-' + oilCondition : ''} ${cookState.isFrying && quality === 'perfect' ? 'perfect-glow' : ''}">
              <div class="bubble" style="left: 15%; animation-delay: 0s;"></div>
              <div class="bubble" style="left: 38%; animation-delay: 0.3s;"></div>
              <div class="bubble" style="left: 65%; animation-delay: 0.6s;"></div>
              <div class="bubble" style="left: 82%; animation-delay: 0.9s;"></div>
              
              <div class="pot-chicken">
                ${panFoodHtml}
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

            <!-- Khay Đựng Đồ Ăn Chưa Chế Biến (Raw Prep Containers) -->
            <div class="prep-baskets-section">
              <div class="prep-baskets-header">
                <span class="prep-baskets-title">🧺 Nguyên Liệu</span>
                <button id="btn-change-oil" class="oil-change-btn">Thay dầu (150k)</button>
              </div>
              <div class="prep-baskets-grid">
                <button id="btn-fry-chicken" class="prep-basket-btn primary ${cookState.isFrying ? 'disabled' : ''}" ${cookState.isFrying ? 'disabled' : ''} title="Thả gà tươi tẩm bột vào chảo chiên">
                  <img src="${ASSETS.kitchen.prepChicken}" alt="Rổ Gà Tươi" class="prep-basket-img" />
                  <div class="prep-basket-details">
                    <span class="prep-basket-label">+ Gà Tươi</span>
                    <span class="prep-basket-qty">Còn: ${chickenStock}</span>
                  </div>
                </button>

                <button id="btn-fry-fries" class="prep-basket-btn ${cookState.isFrying ? 'disabled' : ''}" ${cookState.isFrying ? 'disabled' : ''} title="Thả khoai tây cắt sợi vào chảo chiên">
                  <img src="${ASSETS.kitchen.prepFries}" alt="Khay Khoai Tươi" class="prep-basket-img" />
                  <div class="prep-basket-details">
                    <span class="prep-basket-label">+ Khoai Tươi</span>
                    <span class="prep-basket-qty">Còn: ${friesStock}</span>
                  </div>
                </button>

                ${stationOpen(state, 3, ['chicken_meat', 'flour']) ? `
                  <button id="btn-fry-popcorn" class="prep-basket-btn ${cookState.isFrying ? 'disabled' : ''}" ${cookState.isFrying ? 'disabled' : ''} title="Chiên gà viên popcorn">
                    <img src="${ASSETS.food.popcornChicken}" alt="Gà Viên" class="prep-basket-img" />
                    <div class="prep-basket-details">
                      <span class="prep-basket-label">+ Gà Viên</span>
                      <span class="prep-basket-qty">Chảo</span>
                    </div>
                  </button>
                ` : ''}

                <button id="btn-add-drink" class="prep-basket-btn drink tap-coca" title="Máy Bơm Nước: Rót một cốc Coca thơm ngon sủi bọt">
                  <img src="${ASSETS.kitchen.stationSodaFountain}" alt="Máy Bơm Coca" class="prep-basket-img" />
                  <div class="prep-basket-details">
                    <span class="prep-basket-label">🔴 Rót Coca</span>
                    <span class="prep-basket-qty">Còn: ${drinkStock}</span>
                  </div>
                </button>

                <button id="btn-pour-7up" class="prep-basket-btn drink tap-7up" title="Rót một cốc 7Up Chanh đá mát lạnh">
                  <img src="${ASSETS.food.sevenUp}" alt="Cốc 7Up" class="prep-basket-img" />
                  <div class="prep-basket-details">
                    <span class="prep-basket-label">🟢 Rót 7Up</span>
                    <span class="prep-basket-qty">Chanh</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Tray & Assemble Card (Quầy Giữ Nhiệt Giòn Tan) -->
          <div class="assemble-card">
            <div class="tray-title">
              <span>🍱 Quầy Giữ Nhiệt (${tray.length}/4)</span>
              <span style="font-size: 0.68rem; color: var(--soft);">Bấm khay để vớt/vứt</span>
            </div>

            <div class="tray-slots">
              ${traySlotsHtml}
            </div>

            <!-- Condiment Station: Chai tương bóp xịt món ăn -->
            <div class="condiment-station">
              <span class="condiment-station-title">🧴 Chai Tương Xịt Món:</span>
              <div class="condiment-bottles-row">
                <button id="btn-squeeze-ketchup" class="condiment-btn ketchup" title="Xịt Tương Cà đỏ tươi thơm ngọt lên món (+Tip & Hương vị)">
                  <img src="${ASSETS.kitchen.bottleKetchup}" alt="Tương Cà" class="condiment-btn-img" />
                  <span class="condiment-btn-text">🍅 Tương Cà</span>
                </button>
                <button id="btn-squeeze-chili" class="condiment-btn chili" title="Xịt Tương Ớt cay nồng giòn rụm lên món (+Tip & Hương vị)">
                  <img src="${ASSETS.kitchen.bottleChili}" alt="Tương Ớt" class="condiment-btn-img" />
                  <span class="condiment-btn-text">🌶️ Tương Ớt</span>
                </button>
              </div>
            </div>

            <!-- Seasoning Addons (món sốt mở từ chương 2) -->
            ${state.currentChapter < 2 ? '' : `<div class="addon-station">
              <button id="btn-season-spicy" class="addon-btn ${cookingEngine.getActiveSeasoning() === 'spicy' ? 'active' : ''}">
                <img src="${ASSETS.kitchen.prepSpicyPot}" class="addon-pot-img" alt="Hũ Sốt Cay" />
                <span>🌶️ Sốt Cay</span>
              </button>
              <button id="btn-season-honey" class="addon-btn ${cookingEngine.getActiveSeasoning() === 'honey' ? 'active' : ''}">
                <img src="${ASSETS.kitchen.prepHoneyPot}" class="addon-pot-img" alt="Hũ Bơ Tỏi" />
                <span>🍯 Bơ Tỏi</span>
              </button>
            </div>`}

            ${renderStaffStrip(state, session)}
            ${renderStationStrip(state, session)}

            <!-- Serve Button -->
            <button id="btn-serve-order" class="btn-serve" ${session.orders.length === 0 || tray.length === 0 ? 'disabled' : ''}>
              🛎️ KENG! LÊN MÓN (SERVE)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Dải trạm nấu mở theo chương: nồi mì, lò bánh, bàn ráp, máy nước (luật ở core/stations.ts + core/day.ts)
// ---------------------------------------------------------------------------
const TIMER_LABEL: Record<TimerStationId, { idle: string; ready: string }> = {
  noodle: { idle: 'Trụng mì', ready: 'Vớt mì!' },
  oven: { idle: 'Nướng bánh', ready: 'Lấy bánh!' }
};

function openDrinks(state: GameState): DrinkId[] {
  return (Object.keys(DRINK_RECIPES) as DrinkId[])
    .filter(id => id !== 'soda' && id !== 'seven_up' && stationOpen(state, DRINK_RECIPES[id].chapter, [DRINK_RECIPES[id].stock]));
}
function openTimers(state: GameState): TimerStationId[] {
  return (Object.keys(TIMER_RECIPES) as TimerStationId[]).filter(id => stationOpen(state, TIMER_RECIPES[id].chapter, TIMER_RECIPES[id].stock));
}
function openAssembly(state: GameState): AssemblyId[] {
  return (Object.keys(ASSEMBLY_RECIPES) as AssemblyId[]).filter(id => stationOpen(state, ASSEMBLY_RECIPES[id].chapter, ASSEMBLY_RECIPES[id].stock));
}

function stationStripKey(state: GameState, session: SellingSession): string {
  const tray = cookingEngine.getTray();
  return [
    openDrinks(state).join(','),
    openTimers(state).map(id => `${id}:${timerPhase(TIMER_RECIPES[id], session.timers[id])}`).join(','),
    openAssembly(state).map(id => `${id}:${assemblyBaseIndex(tray, ASSEMBLY_RECIPES[id]) >= 0}`).join(',')
  ].join('|');
}

function renderStationStrip(state: GameState, session: SellingSession): string {
  const tray = cookingEngine.getTray();
  const buttons = [
    ...openTimers(state).map(id => {
      const r = TIMER_RECIPES[id];
      const phase = timerPhase(r, session.timers[id]);
      const label = phase === 'idle' ? TIMER_LABEL[id].idle : phase === 'cooking' ? 'Đang nấu' : phase === 'ready' ? TIMER_LABEL[id].ready : 'Hỏng rồi! Dọn';
      return `<button id="btn-timer-${id}" class="btn-sm station-btn timer-${phase}" ${phase === 'cooking' ? 'disabled' : ''}>
        ${r.icon} ${label} <small class="timer-progress" data-timer="${id}"></small></button>`;
    }),
    ...openAssembly(state).map(id => {
      const r = ASSEMBLY_RECIPES[id];
      const ready = assemblyBaseIndex(tray, r) >= 0;
      return `<button id="btn-assemble-${id}" class="btn-sm station-btn" ${ready ? '' : 'disabled'} title="Cần ${r.base === 'crispy_chicken' ? 'Gà Giòn' : 'Gà Sốt Cay'} trong khay">${r.icon} Ráp ${r.name.split(' ')[0]}</button>`;
    }),
    ...openDrinks(state).map(id => `<button id="btn-drink-${id}" class="btn-sm station-btn">${DRINK_RECIPES[id].icon} ${DRINK_RECIPES[id].label}</button>`)
  ];
  if (buttons.length === 0) return '';
  return `<div class="station-strip" style="display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0;">${buttons.join('')}</div>`;
}

// ---------------------------------------------------------------------------
// Dải nhân viên: phụ bếp đang chiên gì, có phục vụ tự lên món không (luật ở core/staff.ts)
// ---------------------------------------------------------------------------
function staffStripKey(state: GameState, session: SellingSession): string {
  return state.staff.map(m => m.id).join(',') + '|' + (session.helpers ?? []).map(h => h?.menuItemId ?? '-').join(',');
}

function renderStaffStrip(state: GameState, session: SellingSession): string {
  if (state.staff.length === 0) return '';
  const eff = staffEffects(state.staff, session.gameHour);
  const chips = eff.cooks.map((c, i) => {
    const slot = session.helpers?.[i];
    const what = slot ? `${FRY_ICON[slot.menuItemId] ?? '🍗'} <small class="helper-progress" data-helper="${i}"></small>` : 'đang rảnh';
    return `<span class="staff-chip${slot ? ' busy' : ''}">👨‍🍳 ${c.name.split(' ')[0]}: ${what}</span>`;
  });
  if (eff.waiterServeMs !== null) chips.push('<span class="staff-chip">🧹 Phục vụ rót nước & lên món</span>');
  if (chips.length === 0) return '';
  return `<div class="staff-strip" style="display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; font-size: 0.72rem;">${chips.join('')}</div>`;
}
const FRY_ICON: Record<string, string> = { crispy_chicken: '🍗', spicy_chicken: '🌶️', honey_garlic_chicken: '🍯', shake_fries: '🍟', popcorn_chicken: '🍿' };
