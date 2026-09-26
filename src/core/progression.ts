import { GameState } from '../types/game';
import { CHAPTERS } from '../content/chapters';

// Qua chương = hành động "Đặt cọc" (trả tiền một lần), không còn tự nhảy chương khi đang GIỮ đủ tiền.
// Lý do (npm run sim): luật cũ phạt người chơi đầu tư nâng cấp, vì mua gì cũng làm tụt số dư.

export const FINAL_CHAPTER = 5;

export function currentChapterData(state: GameState) {
  return CHAPTERS.find(c => c.number === state.currentChapter) ?? CHAPTERS[0];
}

// 0 → 1: đã gom được bao nhiêu phần tiền cọc của chương hiện tại. Dùng cho thanh tiến độ
// và cho truyện (thư Thỏ Cam, khách bí ẩn mở ở 25% / 50% / 75% chương).
export function chapterProgress(state: GameState): number {
  const target = currentChapterData(state).targetMoney;
  return Math.max(0, Math.min(1, state.money / target));
}

export interface DepositStatus {
  ready: boolean;
  moneyOk: boolean;
  starsOk: boolean;
  isFinal: boolean;
  cost: number;      // tiền cọc thực trả
  required: number;  // quỹ cần có để được đặt cọc
  starsNeeded: number;
}

// Phải có đủ quỹ mục tiêu, nhưng chỉ trả 70%: 30% còn lại là vốn nhập hàng ở tiệm mới.
// (npm run sim: trả 100% → còn ~360k, không đủ vốn nhập hàng, khách bỏ về hết → vòng xoáy phá sản.)
export const DEPOSIT_SHARE = 0.7;

export function depositStatus(state: GameState): DepositStatus {
  const chapter = currentChapterData(state);
  const isFinal = state.currentChapter >= FINAL_CHAPTER;
  const moneyOk = state.money >= chapter.targetMoney;
  const starsOk = state.ratings.overall >= chapter.targetStars;
  return {
    ready: !isFinal && moneyOk && starsOk, moneyOk, starsOk, isFinal,
    cost: Math.round(chapter.targetMoney * DEPOSIT_SHARE), required: chapter.targetMoney, starsNeeded: chapter.targetStars
  };
}

// Trả tiền cọc và sang chương mới. Trả về số chương mới, hoặc null nếu chưa đủ điều kiện.
export function depositForNextChapter(draft: GameState): number | null {
  const status = depositStatus(draft);
  if (!status.ready) return null;
  draft.money -= status.cost;
  draft.currentChapter += 1;
  draft.depositsPaid = (draft.depositsPaid ?? 0) + 1;
  return draft.currentChapter;
}

// Mốc truyện: mở khi đang ở đúng chương và đã gom ≥ atProgress tiền cọc.
// Không gắn với số ngày → không bao giờ lộ nội dung chương sau.
export interface StoryTrigger {
  chapter: number;
  atProgress: number;
}

// Mốc của chương đã qua (người chơi đặt cọc trước khi kịp gặp) vẫn tính là đã tới → không mất thư.
export function isTriggered(trigger: StoryTrigger, state: GameState): boolean {
  if (state.currentChapter > trigger.chapter) return true;
  return state.currentChapter === trigger.chapter && chapterProgress(state) >= trigger.atProgress;
}
