import { GameState } from '../../types/game';
import { ASSETS } from '../../content/assets';
import { escapeHtml } from '../escapeHtml';

export interface OnboardingStepInfo {
  step: number;
  badge: string;
  instruction: string;
  targetSelector: string;
}

export const ONBOARDING_STEPS: Record<number, OnboardingStepInfo> = {
  1: {
    step: 1,
    badge: 'BƯỚC 1/3: THẢ GÀ VÔ CHẢO',
    instruction: 'Chạm nút [+ Gà Rán] trên quầy sơ chế để thả miếng đùi gà tươi vô chảo gang dầu sôi nghen con!',
    targetSelector: '#btn-fry-chicken'
  },
  2: {
    step: 2,
    badge: 'BƯỚC 2/3: VỚT GÀ VÀNG GIÒN',
    instruction: 'Canh kim đồng hồ lọt vô vùng VÀNG GIÒN (PERFECT), chạm nhanh vô chảo nhấc gà ra khay liền tay!',
    targetSelector: '#btn-fry-pot'
  },
  3: {
    step: 3,
    badge: 'BƯỚC 3/3: RÓT NƯỚC & LÊN MÓN',
    instruction: 'Chạm nút vòi nước ngọt rót ly nước giải khát & bấm [KENG! LÊN MÓN] trao tận tay khách nhận tiền tươi!',
    targetSelector: '#btn-serve-order'
  }
};

export function renderOnboardingGuide(state: GameState): string {
  if (state.onboardingGuideDismissed || state.day > 1) {
    return '';
  }

  const currentStep = state.onboardingGuideStep || 1;
  if (currentStep > 3) return '';

  const defaultStep: OnboardingStepInfo = {
    step: 1,
    badge: 'BƯỚC 1/3',
    instruction: 'Mua thịt gà & dầu ăn trong kho để chuẩn bị mở bán!',
    targetSelector: '#btn-fry-chicken'
  };
  const stepInfo: OnboardingStepInfo = ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[1] || defaultStep;

  return `
    <div id="onboarding-guide-banner" class="onboarding-guide-banner" style="position: fixed; bottom: 8px; left: 8px; right: 8px; z-index: 9999; background: #fffcf0; border: 3px solid #b45309; border-radius: 12px; padding: 10px 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: space-between; gap: 10px; animation: slideUp 0.3s ease; pointer-events: none;">
      <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
        <img src="${ASSETS.bacba.front}" alt="Bác Ba" style="width: 44px; height: 44px; object-fit: cover; border-radius: 50%; border: 2px solid #b45309; background: #fef3c7; flex-shrink: 0;" />
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.7rem; font-weight: 800; background: #f59e0b; color: #fff; padding: 1px 6px; border-radius: 4px; letter-spacing: 0.5px;">${stepInfo.badge}</span>
            <span style="font-size: 0.72rem; color: #78350f; font-weight: 700;">Bác Ba chỉ dẫn</span>
          </div>
          <div style="font-size: 0.78rem; font-weight: 800; color: #451a03; line-height: 1.35;">
            ${escapeHtml(stepInfo.instruction)}
          </div>
        </div>
      </div>
      <button id="btn-skip-onboarding" class="btn-sm" style="min-height: 44px; min-width: 44px; padding: 4px 10px; font-size: 0.72rem; font-weight: 800; color: #78350f; background: #fef3c7; border: 1.5px solid #d97706; border-radius: 8px; cursor: pointer; white-space: nowrap; pointer-events: auto;">
        Đã hiểu ✕
      </button>
    </div>
  `;
}
