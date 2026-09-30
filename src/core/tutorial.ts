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
    text: 'Mèn đét ơi con ơi! Khách mở hàng đầu tiên ghé tiệm rồi kìa! Con nhìn kỹ thẻ khách ở trên coi người ta thèm món chi nghen. Bác Ba đứng kế bên chỉ cho con từng đường đi nước bước, lúc bác dặn thì thời gian đứng yên, khách đứng chờ hổng có bỏ về đâu, an tâm mần ăn nghen!',
    target: '.customer-card', button: 'Dạ Bác Ba, con làm liền!'
  },
  'fry-chicken': {
    text: 'Khách gọi gà giòn nè con! Bấm nút "+ Gà Rán" trên quầy sơ chế này đặng thả một miếng đùi gà tươi vô chảo gang dầu sôi sùng sục nghen. Nút này đang sáng rực lên đó, chạm vô liền đi con!',
    target: '#btn-fry-chicken'
  },
  'fry-fries': {
    text: 'Khách hảo món Khoai Tây Lắc Phô Mai kìa! Chạm vô khay "+ Khoai" trên quầy sơ chế đặng thả một mẻ khoai tây tươi vô chảo chiên cho vàng ươm giòn rụm đi con!',
    target: '#btn-fry-fries'
  },
  'fry-popcorn': {
    text: 'Khách gọi Gà Viên Popcorn giòn rụm! Chạm khay "Gà Viên" trên quầy sơ chế thả vô chảo chiên liền tay nghen con!',
    target: '#btn-fry-popcorn'
  },
  'season-spicy': {
    text: 'Khách khoái ăn cay xé lưỡi! Chạm thau sốt "Sốt Yangnyeom" trên quầy inox ướp đẫm sốt đỏ au rồi mới thả gà vô chảo nghen!',
    target: '#btn-season-spicy'
  },
  'season-honey': {
    text: 'Khách gọi Gà Sốt Bơ Tỏi thơm lừng! Chạm thau "Sốt Bơ Tỏi" trên quầy inox ướp đều miếng gà trước khi chiên nghen con!',
    target: '#btn-season-honey'
  },
  'drink': {
    text: 'Khách gọi thêm ly nước ngọt giải khát nè! Nước ngọt thì khỏi cần chiên chi cho cực: con chạm vô vòi máy nước ngọt bên phải này, máy nó tự rót cái ào đúng ly khách gọi vô khay liền á!',
    target: '#btn-add-drink'
  },
  'scoop': {
    text: 'Củ cải muối vàng giòn rụm thì khỏi chiên: chạm khay củ cải múc một chén vô khay cho khách ăn kèm đỡ ngấy, bảo đảm mê mệt!',
    target: '#btn-scoop-danmuji'
  },
  'wait': {
    text: 'Canh chừng cây kim đo nhiệt độ chảo gang nha con! Cây kim đang chạy qua vùng SỐNG (màu đỏ). Còn nằm bên vùng SỐNG là chưa chín đâu, con ráng đợi kim chạy vô vùng VÀNG GIÒN (PERFECT) nghen, vớt sớm là thịt sống đó đa!',
    target: '.cook-gauge-container'
  },
  'lift': {
    text: 'VÀNG GIÒN RỤM RỒI ĐA! Kim đã vô vùng VÀNG GIÒN (PERFECT) rồi kìa! Chạm lẹ vô chảo nhấc lên liền con ơi, trễ một nhịp là nó khét lẹt đắng nghét uổng công dữ lắm nghen!',
    target: '#btn-fry-pot'
  },
  'discard-raw': {
    text: 'Trời đất coi kìa, vớt sớm quá gà còn đỏ au sống nhăn răng! Chạm vô món trong khay đổ bỏ đi con, rồi chiên lại mẻ khác bù cho khách nghen.',
    target: '.tray-item'
  },
  'serve': {
    text: 'Đủ bộ món ngon lành cành đào cho khách rồi! Nhìn thẻ khách thấy đủ dấu tích xanh. Giờ bấm nút "KENG! LÊN MÓN" bưng ra trao tận tay khách đặng lấy tiền tươi và sao uy tín nè!',
    target: '#btn-serve-order'
  },
  'done': {
    text: 'Mèn ơi giỏi dữ hôn! Cứ nhịp nhàng vầy nghen: ngó đơn khách → chiên đúng độ → nhấc lúc vàng giòn → rót nước ngọt → keng lên món. Đừng để khách đợi lâu kẻo người ta quạu bỏ về. Giờ Bác Ba để con làm chủ tiệm nghen!',
    target: null, button: 'Dạ, con cảm ơn Bác Ba nhiều nghen!'
  }
};

export interface BacBaGameTip {
  id: string;
  trigger: 'oil_dirty' | 'perfect_streak' | 'low_patience' | 'out_of_chicken' | 'general';
  text: string;
}

export const BAC_BA_GAME_TIPS: BacBaGameTip[] = [
  {
    id: 'tip_oil',
    trigger: 'oil_dirty',
    text: 'Bác Ba nhắc nhỏ: Chảo dầu đen khét rồi đó con! Bấm "Thay dầu 150k" liền đi kẻo công an ghé hốt phạt tội vệ sinh nghen!'
  },
  {
    id: 'tip_streak',
    trigger: 'perfect_streak',
    text: 'Bác Ba khen ngợi: Mèn ơi chuỗi PERFECT đỉnh chóp dữ bay! Ráng giữ tay nghề vàng giòn đặng khách bo thêm tiền tip rủng rỉnh nghen!'
  },
  {
    id: 'tip_patience',
    trigger: 'low_patience',
    text: 'Bác Ba dặn khẩn: Khách đằng kia vòng thời gian đỏ lòm sắp quạu rồi kìa con! Ưu tiên lên món cho người ta trước lẹ lẹ!'
  },
  {
    id: 'tip_stock',
    trigger: 'out_of_chicken',
    text: 'Bác Ba tiếp tế: Hết thịt gà rồi hả con? Chạm nút "🛵 Tiếp tế +5" trên khay, bác chạy xe máy qua chở gà tươi qua cứu liền!'
  },
  {
    id: 'tip_general',
    trigger: 'general',
    text: 'Bác Ba mách nước: Bán đồ ăn quan trọng nhất là cái tâm. Gà giòn, dầu sạch thì khách quen tự khắc rủ bạn bè tới nườm nượp!'
  }
];

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
