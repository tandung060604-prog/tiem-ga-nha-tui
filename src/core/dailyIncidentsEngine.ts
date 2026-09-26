import { DailyIncident, GameState, IncidentChoice } from '../types/game';
import { DAILY_INCIDENTS } from '../content/dailyIncidents';
import { applyKarmaChange } from '../content/endings';
import { pick, random } from './rng';

export interface IncidentResolutionResult {
  succeeded: boolean;
  reactionTitle: string;
  reactionNarrative: string;
  karmaDelta: { community?: number; craftsmanship?: number; ambition?: number };
  moneyDelta: number;
}

/**
 * Kiểm tra xem quán hiện tại có nhân viên Bảo Vệ đang làm việc không.
 */
export function hasSecurityStaff(state: GameState): boolean {
  return state.staff.some(m => m.role === 'security' && m.mood > 20);
}

/**
 * Chọn ngẫu nhiên 1 sự kiện phù hợp với ngày và thời điểm hiện tại.
 * Ưu tiên các sự kiện chưa gặp trong `seenIncidentIds`.
 */
export function pickDailyIncident(
  state: GameState,
  timing: 'morning' | 'shift' | 'any' = 'any'
): DailyIncident | null {
  const currentChapter = state.currentChapter ?? 1;
  const currentDay = state.day ?? 1;
  const currentStars = state.ratings?.overall ?? 4.0;
  const seen = new Set(state.seenIncidentIds ?? []);

  // Lọc sự kiện đủ điều kiện theo chương, ngày tối thiểu, số sao và thời điểm
  const candidates = DAILY_INCIDENTS.filter(inc => {
    const chapterOk = (inc.minChapter ?? 1) <= currentChapter;
    const dayOk = (inc.minDay ?? 1) <= currentDay;
    const starsOk = !inc.requiredStars || currentStars >= inc.requiredStars;
    const timingOk = timing === 'any' || inc.phaseTiming === 'any' || inc.phaseTiming === timing;
    return chapterOk && dayOk && starsOk && timingOk;
  });

  if (candidates.length === 0) return null;

  // Ưu tiên sự kiện chưa gặp
  const unseen = candidates.filter(inc => !seen.has(inc.id));
  const pool = unseen.length > 0 ? unseen : candidates;

  return pick(pool);
}

/**
 * Xử lý lựa chọn của người chơi trong sự kiện:
 * - Ẩn điểm số, tính toán kết quả câu chuyện dựa trên may rủi và sự hiện diện của Bảo Vệ.
 * - Áp dụng cập nhật Karma và Tài chính vào GameState.
 */
export function resolveIncidentChoice(
  draft: GameState,
  incident: DailyIncident,
  choice: IncidentChoice
): IncidentResolutionResult {
  const hasSec = hasSecurityStaff(draft);
  let succeeded = true;

  // Nếu lựa chọn có rủi ro và không có bảo vệ
  if (choice.riskRate && choice.riskRate > 0 && !hasSec) {
    const roll = random();
    if (roll < choice.riskRate) {
      succeeded = false;
    }
  }

  // Nếu lựa chọn bắt buộc có bảo vệ mà quán lại không có (fallback phòng vệ)
  if (choice.requiresSecurity && !hasSec) {
    succeeded = false;
  }

  let finalMoneyDelta = choice.moneyDelta ?? 0;
  let reactionTitle = choice.reactionTitle;
  let reactionNarrative = choice.reactionNarrative;

  if (!succeeded) {
    // Thất bại: dùng lời kể thất bại nếu có
    if (choice.reactionFailureNarrative) {
      reactionNarrative = choice.reactionFailureNarrative;
    }
    reactionTitle = '⚠️ Rủi Ro Đã Xảy Ra!';
    // Nếu thất bại mà có tiền thưởng dự kiến thì không nhận được
    if (finalMoneyDelta > 0) {
      finalMoneyDelta = 0;
    }
  }

  // Áp dụng thay đổi Karma
  draft.karma = applyKarmaChange(draft.karma, choice.karmaDelta);

  // Áp dụng thay đổi tiền mặt
  draft.money = Math.max(0, draft.money + finalMoneyDelta);

  // Cập nhật lịch sử sự kiện
  if (!draft.seenIncidentIds) draft.seenIncidentIds = [];
  if (!draft.seenIncidentIds.includes(incident.id)) {
    draft.seenIncidentIds.push(incident.id);
  }

  if (!draft.resolvedIncidents) draft.resolvedIncidents = [];
  draft.resolvedIncidents.push({
    incidentId: incident.id,
    choiceId: choice.id,
    day: draft.day,
    succeeded
  });

  draft.todayIncidentsCount = (draft.todayIncidentsCount ?? 0) + 1;

  return {
    succeeded,
    reactionTitle,
    reactionNarrative,
    karmaDelta: choice.karmaDelta,
    moneyDelta: finalMoneyDelta
  };
}
