import { GameState, PrepSlotState } from '../../types/game';
import { prepStationSlots } from '../../core/prepStation';
import { cookingEngine } from '../../core/cooking';
import { FRY_RECIPES } from '../../core/staff';
import { ASSETS } from '../../content/assets';
import { escapeHtml } from '../escapeHtml';

// Quầy khay inox âm bàn GN (luật khóa + bố cục ở core/prepStation.ts). Khay luôn đủ số, khóa thì phủ nắp + ổ khóa.
// CSS chuyên biệt tại src/styles/kitchen.css: .prep-station, .prep-row.top/.bottom, .gn-pan[data-pan][data-state][data-active],
// .gn-pan-img, .gn-pan-emoji, .gn-pan-badge, .gn-pan-label, .gn-pan-lock, .gn-pan-lock-label, .prep-popover, .prep-board

export function prepStationKey(state: GameState): string {
  return prepStationSlots(state).map(s => `${s.id}:${s.status}:${s.stock}`).join(',');
}

function panHtml(slot: PrepSlotState, frying: boolean, activeAction: string | null): string {
  const label = escapeHtml(slot.label);
  if (slot.status === 'locked' && slot.lock) {
    const lockArt = ASSETS.kitchen.gnPanLocked
      ? `<img class="gn-pan-img" src="${ASSETS.kitchen.gnPanLocked}" alt="Đã khóa" width="30" height="30" />`
      : slot.asset
      ? `<img class="gn-pan-img" src="${slot.asset}" alt="${label}" width="30" height="30" />`
      : `<span class="gn-pan-emoji" aria-hidden="true">${slot.icon}</span>`;
    return `
      <button type="button" class="gn-pan" data-pan="${slot.pan}" data-state="locked" data-prep-lock="${slot.id}"
        aria-label="${label} — khóa: ${escapeHtml(slot.lock.label)}">
        ${lockArt}
        <span class="gn-pan-lock" aria-hidden="true"><img src="${ASSETS.icons.lock}" class="pixel-lock-img" alt="Khóa" /></span>
        <span class="gn-pan-lock-label">${escapeHtml(slot.lock.label)}</span>
        <span class="gn-pan-label">${label}</span>
      </button>`;
  }
  const art = slot.status === 'empty'
    ? `<img class="gn-pan-img" src="${ASSETS.kitchen.gnPanEmpty}" alt="${label} — hết hàng" width="30" height="30" />`
    : slot.asset
    ? `<img class="gn-pan-img" src="${slot.asset}" alt="${label}" width="30" height="30" />`
    : `<span class="gn-pan-emoji" aria-hidden="true">${slot.icon}</span>`;
  // Hàng dưới là đồ sống thả chảo: chảo đang bận thì chưa bấm được
  const busy = slot.row === 'bottom' && frying;
  const isEmergencyChicken = slot.action === 'fry-chicken' && slot.stock === 0;
  const badgeText = isEmergencyChicken ? '🛵 +5' : `${slot.stock}`;
  const badgeTitle = isEmergencyChicken ? 'Hết gà! Chạm để gọi Bác Ba tiếp tế 5 gà tươi (50k)' : label;

  return `
    <button type="button" id="btn-${slot.action}" class="gn-pan ${isEmergencyChicken ? 'pan-emergency-restock' : ''}" data-pan="${slot.pan}" data-state="${slot.status}"
      data-active="${activeAction === slot.action}" ${busy ? 'disabled' : ''} title="${badgeTitle}">
      ${art}
      <span class="gn-pan-badge ${isEmergencyChicken ? 'badge-restock-pulse' : ''}">${badgeText}</span>
      <span class="gn-pan-label">${label}</span>
    </button>`;
}

// Nút đang "sáng": khay đồ sống của mẻ trong chảo, hoặc thau sốt đang chọn
function activeActions(): string[] {
  const cook = cookingEngine.getCookState();
  const out: string[] = [];
  if (cook.isFrying) {
    const id = Object.entries(FRY_RECIPES).find(([, r]) => r.type === cook.fryingType && r.sauce === null)?.[0];
    const fryAction: Record<string, string> = {
      crispy_chicken: 'fry-chicken', shake_fries: 'fry-fries', popcorn_chicken: 'fry-popcorn', spicy_thigh: 'fry-thigh', cheese_stick: 'fry-cheese'
    };
    if (id && fryAction[id]) out.push(fryAction[id]);
  }
  const sauce = cookingEngine.getActiveSeasoning();
  if (sauce) out.push(sauce === 'spicy' ? 'season-spicy' : 'season-honey');
  return out;
}

export function renderPrepStation(state: GameState): string {
  const slots = prepStationSlots(state);
  const frying = cookingEngine.getCookState().isFrying;
  const active = activeActions();
  const row = (r: PrepSlotState['row']) => slots.filter(s => s.row === r)
    .map(s => panHtml(s, frying, active.includes(s.action) ? s.action : null)).join('');
  return `
    <div class="prep-station">
      <div class="prep-row top" aria-label="Khay món kèm và sốt">${row('top')}</div>
      <div class="prep-row bottom" aria-label="Khay đồ sống thả chảo">${row('bottom')}</div>
    </div>`;
}

// Chạm khay khóa: hiện bóng hướng dẫn cách mở (tự ẩn)
export function showPrepPopover(root: HTMLElement, slotId: string, state: GameState): void {
  const slot = prepStationSlots(state).find(s => s.id === slotId);
  const station = root.querySelector<HTMLElement>('.prep-station');
  if (!slot?.lock || !station) return;
  station.querySelector('.prep-popover')?.remove();
  const pop = document.createElement('div');
  pop.className = 'prep-popover';
  pop.setAttribute('role', 'status');
  pop.dataset.for = slotId;
  pop.textContent = `🔒 ${slot.lock.hint}`;
  station.appendChild(pop);
  setTimeout(() => pop.remove(), 3500);
}
