import { CustomerOrder, DeliveryRunResult } from '../../types/game';
import type { DeliveryRunState } from '../../core/deliveryRunner';
import { escapeHtml } from '../escapeHtml';

export function renderDeliveryPromptModal(order: CustomerOrder): string {
  return `
    <div class="delivery-prompt-dialog" style="text-align: center; padding: 4px;">
      <div style="font-size: 2.2rem; margin-bottom: 6px;">🛵💨</div>
      <div style="font-family: var(--font-pixel-heading), inherit; font-size: 1rem; color: var(--pixel-gold-dark, #c98e1e); font-weight: 800; margin-bottom: 4px;">
        ĐƠN HÀNG GIAO XA (HẺM 1102 EXPRESS)
      </div>
      <div style="font-size: 0.8rem; color: var(--pixel-parchment-text, #3a2210); margin-bottom: 12px; font-weight: 700;">
        Khách hàng: <b>${escapeHtml(order.customerName)}</b> · Trị giá đơn: <b>${order.totalPrice.toLocaleString('vi-VN')}đ</b>
      </div>

      <div style="background: rgba(0,0,0,0.06); border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px dashed rgba(0,0,0,0.2); font-size: 0.82rem; line-height: 1.5; color: var(--pixel-parchment-text, #3a2210);">
        Đơn giao xa vượt tuyến Hẻm 1102! Bạn có thể tự xách xe Dream của Bác Ba chạy đua 15 giây né ổ gà để kiếm tip đậm, hoặc thuê shipper chuyên nghiệp ngoài.
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-start-delivery-run" class="pixel-btn is-warning" style="min-height: 48px; font-size: 0.88rem; width: 100%;">
          🛵 TỰ LÁI XE DREAM (15s NÉ Ổ GÀ · TIP ĐẬM +40K)
        </button>
        <button id="btn-outsource-delivery" class="pixel-btn" style="min-height: 42px; font-size: 0.8rem; width: 100%; background: #e2e8f0; color: #334155;">
          📦 THUÊ SHIPPER NGOÀI (-15.000đ CƯỚC PHÍ)
        </button>
      </div>
    </div>
  `;
}

export function renderDeliveryRunnerGame(state: DeliveryRunState): string {
  const laneWidthPct = 33.333;
  const bikeLeftPct = state.playerLane * laneWidthPct + laneWidthPct / 2;

  const obstaclesHtml = state.obstacles.map(obs => {
    const leftPct = obs.lane * laneWidthPct + laneWidthPct / 2;
    return `
      <div class="runner-obs ${obs.hit ? 'obs-hit' : ''}" style="
        position: absolute;
        top: ${obs.y}%;
        left: ${leftPct}%;
        transform: translate(-50%, -50%);
        font-size: 1.8rem;
        z-index: 10;
        pointer-events: none;
        transition: transform 0.1s;
      ">
        ${obs.icon}
      </div>
    `;
  }).join('');

  return `
    <div class="delivery-runner-screen" style="
      background: #334155;
      border: 3px solid var(--pixel-wood-dark, #4a2810);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 380px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      user-select: none;
    ">
      <!-- Top HUD -->
      <div style="
        background: var(--pixel-wood-dark, #4a2810);
        color: #fff;
        padding: 6px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-pixel-heading), inherit;
        font-size: 0.78rem;
      ">
        <span>⏱️ Còn: <b style="color: #fbbf24;">${Math.ceil(state.timeLeftSeconds)}s</b></span>
        <span>💥 Va chạm: <b style="color: ${state.crashes > 0 ? '#f87171' : '#4ade80'};">${state.crashes}</b></span>
        <span>🏁 Tiến trình: <b>${Math.round(state.distanceProgress)}%</b></span>
      </div>

      <!-- 3-Lane Road Track -->
      <div id="runner-road-track" style="
        flex: 1;
        position: relative;
        background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        overflow: hidden;
        cursor: pointer;
      ">
        <!-- Lane Dividers -->
        <div style="position: absolute; left: 33.333%; top: 0; bottom: 0; width: 2px; border-left: 2px dashed rgba(255,255,255,0.3);"></div>
        <div style="position: absolute; left: 66.666%; top: 0; bottom: 0; width: 2px; border-left: 2px dashed rgba(255,255,255,0.3);"></div>

        <!-- Lane Click Detectors (Touch Controls) -->
        <div data-runner-lane="0" style="position: absolute; left: 0; top: 0; width: 33.333%; height: 100%; z-index: 5;"></div>
        <div data-runner-lane="1" style="position: absolute; left: 33.333%; top: 0; width: 33.333%; height: 100%; z-index: 5;"></div>
        <div data-runner-lane="2" style="position: absolute; left: 66.666%; top: 0; width: 33.334%; height: 100%; z-index: 5;"></div>

        <!-- Obstacles -->
        ${obstaclesHtml}

        <!-- Player Dream Bike -->
        <div id="runner-player-bike" style="
          position: absolute;
          top: 80%;
          left: ${bikeLeftPct}%;
          transform: translate(-50%, -50%);
          font-size: 2.3rem;
          z-index: 20;
          transition: left 0.12s cubic-bezier(0.2, 0.8, 0.4, 1);
          pointer-events: none;
        ">
          🛵
        </div>
      </div>

      <!-- Thumb Zone Controls -->
      <div style="
        background: var(--pixel-wood-dark, #4a2810);
        padding: 6px 10px;
        display: flex;
        gap: 10px;
        justify-content: space-between;
      ">
        <button id="btn-runner-left" class="pixel-btn" style="flex: 1; min-height: 46px; font-size: 1rem; font-weight: 800;">
          ◀ LÀN TRÁI
        </button>
        <button id="btn-runner-right" class="pixel-btn" style="flex: 1; min-height: 46px; font-size: 1rem; font-weight: 800;">
          LÀN PHẢI ▶
        </button>
      </div>
    </div>
  `;
}

export function renderDeliveryResultModal(result: DeliveryRunResult): string {
  const isPerfect = result.crashes === 0 && result.mode === 'manual';
  return `
    <div class="delivery-result-dialog" style="text-align: center; padding: 4px;">
      <div style="font-size: 2.2rem; margin-bottom: 6px;">
        ${isPerfect ? '🌟' : (result.mode === 'outsourced' ? '📦' : (result.crashes <= 2 ? '🛵' : '💥'))}
      </div>
      <div style="font-family: var(--font-pixel-heading), inherit; font-size: 1rem; color: ${isPerfect ? 'var(--pixel-gold-dark, #c98e1e)' : '#059669'}; font-weight: 800; margin-bottom: 4px;">
        ${isPerfect ? 'GIAO HÀNG THẦN TỐC PERFECT!' : (result.mode === 'outsourced' ? 'ĐÃ GIAO HÀNG QUA SHIPPER' : 'KẾT QUẢ GIAO HÀNG')}
      </div>

      <div style="background: rgba(0,0,0,0.06); border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px dashed rgba(0,0,0,0.2); font-size: 0.86rem; line-height: 1.5; color: var(--pixel-parchment-text, #3a2210);">
        ${escapeHtml(result.message)}
      </div>

      <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
        ${result.tipBonus > 0 ? `
          <span class="nes-badge"><span class="is-warning">+${result.tipBonus.toLocaleString('vi-VN')}đ TIP</span></span>
        ` : ''}
        ${result.speedRatingDelta > 0 ? `
          <span class="nes-badge"><span class="is-success">+${result.speedRatingDelta.toFixed(2)}★ TỐC ĐỘ</span></span>
        ` : (result.speedRatingDelta < 0 ? `
          <span class="nes-badge"><span class="is-error">${result.speedRatingDelta.toFixed(2)}★ TỐC ĐỘ</span></span>
        ` : '')}
      </div>

      <button id="btn-close-delivery-result" class="pixel-btn is-warning" style="width: 100%; min-height: 44px; font-size: 0.88rem;">
        🛎️ HOÀN TẤT & TRỞ LẠI QUÁN
      </button>
    </div>
  `;
}
