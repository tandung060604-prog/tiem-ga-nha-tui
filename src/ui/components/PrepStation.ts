import { GameState, PrepSlotState } from '../../types/game';
import { prepStationSlots } from '../../core/prepStation';
import { cookingEngine } from '../../core/cooking';
import { FRY_RECIPES } from '../../core/staff';
import { escapeHtml } from '../escapeHtml';

// Quầy khay inox âm bàn GN (luật khóa + bố cục ở core/prepStation.ts). Khay luôn đủ số, khóa thì phủ nắp + ổ khóa.
// Class cho CSS (Gemini): .prep-station, .prep-row.top/.bottom, .gn-pan[data-pan][data-state][data-active],
// .gn-pan-img, .gn-pan-emoji, .gn-pan-badge, .gn-pan-label, .gn-pan-lock, .gn-pan-lock-label, .prep-popover, .prep-board
// Style inline bên dưới (TMP_*) là TẠM cho tới khi có CSS trong kitchen.css; Gemini thay xong thì xóa.
const TMP_ROW = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(52px,1fr));gap:4px;margin-bottom:4px';
const TMP_PAN = 'position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:56px;padding:2px;font-size:.62rem;line-height:1.1;overflow:hidden';
const TMP_IMG = 'width:30px;height:30px;object-fit:contain';

export function prepStationKey(state: GameState): string {
  return prepStationSlots(state).map(s => `${s.id}:${s.status}:${s.stock}`).join(',');
}

function panHtml(slot: PrepSlotState, frying: boolean, activeAction: string | null): string {
  const label = escapeHtml(slot.label);
  const art = slot.asset
    ? `<img class="gn-pan-img" src="${slot.asset}" alt="${label}" width="30" height="30" style="${TMP_IMG}" />`
    : `<span class="gn-pan-emoji" aria-hidden="true">${slot.icon}</span>`;
  if (slot.status === 'locked' && slot.lock) {
    return `
      <button type="button" class="gn-pan" style="${TMP_PAN};opacity:.6" data-pan="${slot.pan}" data-state="locked" data-prep-lock="${slot.id}"
        aria-label="${label} — khóa: ${escapeHtml(slot.lock.label)}">
        ${art}
        <span class="gn-pan-lock" aria-hidden="true">🔒</span>
        <span class="gn-pan-lock-label" style="font-weight:800">${escapeHtml(slot.lock.label)}</span>
        <span class="gn-pan-label">${label}</span>
      </button>`;
  }
  // Hàng dưới là đồ sống thả chảo: chảo đang bận thì chưa bấm được
  const busy = slot.row === 'bottom' && frying;
  return `
    <button type="button" id="btn-${slot.action}" class="gn-pan" style="${TMP_PAN}" data-pan="${slot.pan}" data-state="${slot.status}"
      data-active="${activeAction === slot.action}" ${busy ? 'disabled' : ''} title="${label}">
      ${art}
      <span class="gn-pan-badge">${slot.stock}</span>
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
      <div class="prep-row top" style="${TMP_ROW}" aria-label="Khay món kèm và sốt">${row('top')}</div>
      <div class="prep-row bottom" style="${TMP_ROW}" aria-label="Khay đồ sống thả chảo">${row('bottom')}</div>
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
