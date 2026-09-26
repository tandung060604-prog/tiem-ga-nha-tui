import { TrayItem } from '../types/game';
import type { CookingState } from './cooking';
import { CookingEngine } from './cooking';
import { missingItems } from './staff';
import type { SellingSession } from './sellingSim';

// Bác Ba dẫn ca bán đầu tiên. Không có kịch bản cứng: mỗi bước được TÍNH từ trạng thái thật của ca
// (khách đầu hàng cần gì, chảo đang ra sao, khay có gì) → người chơi làm sai thứ tự vẫn được chỉ đúng.
// Trong lúc hướng dẫn, đồng hồ/khách đứng yên (tickSelling bỏ qua khi session.tutorial = true), chảo vẫn chạy.

export type TutorialStep =
  | 'intro' | 'fry-chicken' | 'fry-fries' | 'drink' | 'wait' | 'lift' | 'discard-raw' | 'serve' | 'done';

export interface TutorialHint {
  step: TutorialStep;
  text: string;
  target: string | null; // selector phần tử cần chỉ vào
  button?: string;        // nút trong bong bóng (intro / done)
}

export const TUTORIAL_TEXT: Record<TutorialStep, Omit<TutorialHint, 'step'>> = {
  'intro': {
    text: 'Con ơi, khách đầu tiên tới rồi kìa! Nhìn thẻ khách để biết họ gọi gì. Bác đứng đây chỉ con từng bước, đừng lo — lúc bác nói thì khách đứng chờ, không ai bỏ về đâu.',
    target: '.customer-card', button: 'Dạ, con làm liền!'
  },
  'fry-chicken': { text: 'Khách gọi gà. Bấm "+ Gà Rán" để thả một miếng vào chảo nè.', target: '#btn-fry-chicken' },
  'fry-fries': { text: 'Khách gọi khoai. Bấm "+ Khoai" để thả khoai vô chảo.', target: '#btn-fry-fries' },
  'drink': { text: 'Nước ngọt thì khỏi chiên: bấm "Nước" là có ly lạnh trong khay liền.', target: '#btn-add-drink' },
  'wait': { text: 'Canh thanh đo nha. Còn ở vùng SỐNG thì chưa được nhấc — đợi kim chạy tới vùng VÀNG GIÒN.', target: '.cook-gauge-container' },
  'lift': { text: 'VÀNG GIÒN rồi! Chạm vô chảo để nhấc ngay, để lâu là cháy đó con!', target: '#btn-fry-pot' },
  'discard-raw': { text: 'Miếng này còn sống, khách không ăn đâu. Chạm vô món trong khay để bỏ, rồi chiên mẻ khác.', target: '.tray-item' },
  'serve': { text: 'Đủ món rồi! Bấm "KENG! LÊN MÓN" để giao cho khách.', target: '#btn-serve-order' },
  'done': {
    text: 'Giỏi lắm con! Cứ vậy mà làm: nhìn món khách gọi → chiên → nhấc lúc vàng giòn → lên món. Khách chờ lâu là quạu bỏ về đó. Giờ bác để con tự bán nha!',
    target: null, button: 'Cảm ơn Bác Ba!'
  }
};

export interface TutorialState {
  introSeen: boolean;
  servedAtStart: number;
}

// Bước hiện tại, từ trạng thái ca bán. `firstServed`: đã giao xong ít nhất một khách kể từ lúc bắt đầu hướng dẫn.
export function tutorialStep(
  t: TutorialState, session: Pick<SellingSession, 'orders' | 'servedCount'>, cook: CookingState, tray: readonly TrayItem[]
): TutorialStep {
  if (!t.introSeen) return 'intro';
  if (session.servedCount > t.servedAtStart) return 'done';
  const first = session.orders[0];
  if (!first) return 'done';

  if (cook.isFrying) {
    return cook.progress < CookingEngine.ZONES.goodLow ? 'wait' : 'lift'; // chỉ giục nhấc khi đã vào vùng vàng giòn
  }
  if (tray.some(t => t.quality === 'raw')) return 'discard-raw';

  const missing = missingItems(first, tray);
  if (missing.length === 0) return 'serve';
  const next = missing[0];
  if (next === 'soda') return 'drink';
  if (next === 'shake_fries') return 'fry-fries';
  return 'fry-chicken';
}

export function tutorialHint(step: TutorialStep): TutorialHint {
  return { step, ...TUTORIAL_TEXT[step] };
}

// Chỉ tiệm mới, ca đầu tiên
export function shouldRunTutorial(state: { day: number; tutorialDone?: boolean }): boolean {
  return state.day === 1 && !state.tutorialDone;
}
