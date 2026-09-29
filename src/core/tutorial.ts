import { TrayItem } from '../types/game';
import type { CookingState, Sauce } from './cooking';
import { CookingEngine } from './cooking';
import { missingItems } from './staff';
import { isDrinkId, isScoopId } from './stations';
import type { SellingSession } from './sellingSim';

// Bác Ba dẫn ca bán đầu tiên. Không có kịch bản cứng: mỗi bước được TÍNH từ trạng thái thật của ca
// (khách đầu hàng cần gì, chảo đang ra sao, khay có gì) → người chơi làm sai thứ tự vẫn được chỉ đúng.
// Trong lúc hướng dẫn, đồng hồ/khách đứng yên (tickSelling bỏ qua khi session.tutorial = true), chảo vẫn chạy.

export type TutorialStep =
  | 'intro' | 'fry-chicken' | 'fry-fries' | 'fry-popcorn' | 'season-spicy' | 'season-honey' | 'drink' | 'scoop' | 'wait' | 'lift' | 'discard-raw' | 'serve' | 'done';

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
  'fry-popcorn': { text: 'Khách gọi Gà Viên Popcorn! Bấm khay "Gà Viên" trên quầy inox để thả mẻ gà viên vào chảo chiên nha con.', target: '#btn-fry-popcorn' },
  'season-spicy': { text: 'Khách gọi Cánh Gà Sốt Cay! Con hãy chạm khay "Sốt Yangnyeom" trên quầy inox để ướp sốt trước khi thả gà vào chảo nè.', target: '#btn-season-spicy' },
  'season-honey': { text: 'Khách gọi Gà Sốt Bơ Tỏi! Con hãy chạm khay "Sốt Bơ Tỏi" trên quầy inox để ướp sốt trước khi thả gà vào chảo nè.', target: '#btn-season-honey' },
  'drink': { text: 'Nước ngọt thì khỏi chiên: chạm vòi máy nước bác chỉ sáng, máy tự rót đúng loại khách còn thiếu vô khay liền.', target: '#btn-add-drink' },
  'scoop': { text: 'Củ cải muối thì khỏi chiên: chạm khay củ cải vàng trên quầy inox để múc một phần vô khay. Ăn gà kèm củ cải cho đỡ ngấy, khách khen ngon lắm!', target: '#btn-scoop-danmuji' },
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
  t: TutorialState,
  session: Pick<SellingSession, 'orders' | 'servedCount'>,
  cook: CookingState,
  tray: readonly TrayItem[],
  activeSeasoning?: Sauce | null
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
  if (next && isDrinkId(next)) return 'drink'; // Coca, 7Up, Fanta… đều rót ở máy nước
  if (next && isScoopId(next)) return 'scoop';
  if (next === 'shake_fries') return 'fry-fries';
  if (next === 'popcorn_chicken') return 'fry-popcorn';
  if (next === 'spicy_chicken') {
    return activeSeasoning === 'spicy' ? 'fry-chicken' : 'season-spicy';
  }
  if (next === 'honey_garlic_chicken') {
    return activeSeasoning === 'honey' ? 'fry-chicken' : 'season-honey';
  }
  return 'fry-chicken';
}

export function tutorialHint(step: TutorialStep): TutorialHint {
  return { step, ...TUTORIAL_TEXT[step] };
}

// Chỉ tiệm mới, ca đầu tiên
export function shouldRunTutorial(state: { day: number; tutorialDone?: boolean }): boolean {
  return state.day === 1 && !state.tutorialDone;
}
