import { DailyIncident, GameState, IncidentChoice } from '../types/game';
import { DAILY_INCIDENTS } from '../content/dailyIncidents';
import { applyKarmaChange } from '../content/endings';
import { pick, random } from './rng';
import { ReviewsEngine } from './reviewsEngine';
import { upgradeEffects } from './upgrades';

export const MAX_REPUTATION_DELTA = 0.3;
export const MAX_RESOLVED_HISTORY = 60;

export interface IncidentResolutionResult {
  succeeded: boolean;
  reactionTitle: string;
  reactionNarrative: string;
  karmaDelta: { community?: number; craftsmanship?: number; ambition?: number };
  moneyDelta: number;
  scareCustomers?: boolean;
  disruptionSeconds?: number;
}

/**
 * Kiểm tra xem quán hiện tại có nhân viên Bảo Vệ đang làm việc không.
 */
export function hasSecurityStaff(state: GameState): boolean {
  return state.staff.some(m => m.role === 'security' && m.mood > 20);
}

export const INCIDENT_COOLDOWN_DAYS = 6; // Tuyệt đối không lặp lại sự kiện trong vòng 6 ngày

/**
 * Chọn ngẫu nhiên 1 sự kiện phù hợp với ngày và thời điểm hiện tại.
 * Áp dụng cơ chế kép: Ưu tiên sự kiện chưa gặp (Exhaustion Pool) + Thời gian hồi Cooldown 6 ngày để triệt tiêu trùng lặp.
 */
export function pickDailyIncident(
  state: GameState,
  timing: 'morning' | 'shift' | 'any' = 'any'
): DailyIncident | null {
  const currentChapter = state.currentChapter ?? 1;
  const currentDay = state.day ?? 1;
  const currentStars = state.ratings?.overall ?? 4.0;
  const seen = new Set(state.seenIncidentIds ?? []);
  const cooldowns = state.incidentCooldowns ?? {};

  // Lọc sự kiện đủ điều kiện theo chương, ngày tối thiểu, số sao và thời điểm
  const candidates = DAILY_INCIDENTS.filter(inc => {
    const chapterOk = (inc.minChapter ?? 1) <= currentChapter;
    const dayOk = (inc.minDay ?? 1) <= currentDay;
    const starsOk = !inc.requiredStars || currentStars >= inc.requiredStars;
    const timingOk = timing === 'any' || inc.phaseTiming === 'any' || inc.phaseTiming === timing;
    return chapterOk && dayOk && starsOk && timingOk;
  });

  if (candidates.length === 0) return null;

  // 1. Ưu tiên tuyệt đối sự kiện HOÀN TOÀN CHƯA GẶP LẦN NÀO trong suốt quá trình chơi
  const unseen = candidates.filter(inc => !seen.has(inc.id));
  if (unseen.length > 0) {
    return pick(unseen);
  }

  // 2. Khi đã gặp hết, chỉ chọn các sự kiện đã qua thời gian hồi Cooldown (tối thiểu 6 ngày)
  const notOnCooldown = candidates.filter(inc => {
    const lastDaySeen = cooldowns[inc.id] ?? -999;
    return (currentDay - lastDaySeen) >= INCIDENT_COOLDOWN_DAYS;
  });

  if (notOnCooldown.length > 0) {
    return pick(notOnCooldown);
  }

  // 3. Fallback phòng vệ: nếu tất cả đều dính cooldown (ít xảy ra), chọn sự kiện xảy ra lâu nhất trong quá khứ
  const sortedByOldest = [...candidates].sort((a, b) => {
    const lastA = cooldowns[a.id] ?? 0;
    const lastB = cooldowns[b.id] ?? 0;
    return lastA - lastB;
  });

  return sortedByOldest[0] ?? pick(candidates);
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
  const hasDog = !!draft.adoptedPets?.includes('pet_01_dog_vang');
  const hasCat = !!draft.adoptedPets?.includes('pet_02_cat_muop');
  const hasSec = hasSecurityStaff(draft) || (hasDog && incident.isSecurityRisk);
  const upEffects = upgradeEffects(draft.upgrades ?? {});
  const isPest = incident.id.includes('pest') || incident.id.includes('rat') || incident.id.includes('fly');

  let succeeded = true;

  // Nếu là sự cố côn trùng/chuột và có miễn nhiễm vệ sinh (pestImmunity) hoặc có Mèo Mướp
  if (isPest && (upEffects.pestImmunity || hasCat)) {
    succeeded = true;
  } else {
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
  }

  // Ghi nhận nhận nuôi thú cưng
  if (choice.id === 'cat_adopt_mascot' || choice.id === 'cat_nest_feast') {
    if (!draft.adoptedPets) draft.adoptedPets = [];
    if (!draft.adoptedPets.includes('pet_02_cat_muop')) draft.adoptedPets.push('pet_02_cat_muop');
  }
  if (choice.id === 'dog_adopt_guard') {
    if (!draft.adoptedPets) draft.adoptedPets = [];
    if (!draft.adoptedPets.includes('pet_01_dog_vang')) draft.adoptedPets.push('pet_01_dog_vang');
  }

  let finalMoneyDelta = choice.moneyDelta ?? 0;
  let reactionTitle = choice.reactionTitle;
  let reactionNarrative = choice.reactionNarrative;

  if (isPest && succeeded && upEffects.pestImmunity) {
    reactionTitle = '🛡️ Nâng Cấp Vệ Sinh Bảo Vệ Tuyệt Đối!';
    reactionNarrative = 'Nhờ lưới thép chống chuột và tinh dầu sinh học 5 sao, lũ chuột dịch hại hoàn toàn bị xua tan khỏi gian bếp!';
  } else if (isPest && succeeded && hasCat && choice.id === 'rat_cat_ambush') {
    reactionTitle = '🐱 Mèo Mướp Ra Tay Tóm Gọn!';
    reactionNarrative = 'Bé Mèo Mướp lao ra như tia chớp tóm gọn chuột cống, lập đại công bảo vệ kho bột của tiệm!';
  }

  if (!succeeded) {
    // Thất bại: dùng lời kể thất bại nếu có
    if (choice.reactionFailureNarrative) {
      reactionNarrative = choice.reactionFailureNarrative;
    }
    reactionTitle = '⚠️ Rủi Ro Đã Xảy Ra!';
    if (choice.id === 'debt_trust') {
      finalMoneyDelta = -65000;
    } else if (finalMoneyDelta > 0) {
      finalMoneyDelta = 0;
    }
  } else {
    if (choice.id === 'gas_solo_chase') {
      finalMoneyDelta = 0; // Đuổi trộm thành công, bảo vệ được bình gas không bị mất 300k
    } else if (choice.id === 'debt_trust') {
      finalMoneyDelta = 65000; // Khách giữ chữ tín quay lại trả đủ tiền nợ
    }
  }

  // Tỷ lệ quy mô kinh tế sự kiện theo Chương để tiền thưởng/phạt luôn có giá trị tương xứng
  const chapterRates = [1.0, 1.0, 1.6, 2.5, 3.5, 5.0];
  const scale = chapterRates[draft.currentChapter ?? 1] ?? 1.0;
  if (finalMoneyDelta !== 0) {
    finalMoneyDelta = Math.round((finalMoneyDelta * scale) / 1000) * 1000;
  }

  // Áp dụng thay đổi Karma
  draft.karma = applyKarmaChange(draft.karma, choice.karmaDelta);

  // Tiền: Thay đổi tiền thật vào tài khoản ví người chơi (draft.money)
  // Tiền thưởng ghi vào totalBonus để kiểm tra sổ sách chống gian lận không gắn cờ nhầm người chơi thật thà.
  draft.money += finalMoneyDelta;
  if (finalMoneyDelta > 0) draft.lifetimeStats.totalBonus = (draft.lifetimeStats.totalBonus ?? 0) + finalMoneyDelta;

  // Ghi nhận cooldown để không lặp lại sự kiện trong vòng 6 ngày
  draft.incidentCooldowns ??= {};
  draft.incidentCooldowns[incident.id] = draft.day;

  // Danh tiếng: cộng/trừ đều mọi tiêu chí sao, tối đa ±0,3 mỗi sự cố
  const rep = Math.max(-MAX_REPUTATION_DELTA, Math.min(MAX_REPUTATION_DELTA, succeeded ? choice.reputationDelta ?? 0 : 0));
  if (rep !== 0) {
    for (const c of ['taste', 'speed', 'hygiene', 'space', 'pricing'] as const) {
      draft.ratings[c] = Math.max(1, Math.min(5, draft.ratings[c] + rep));
    }
    draft.ratings.overall = ReviewsEngine.calculateOverallStars(draft.ratings);
  }

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
  // Save không phình mãi: chỉ giữ lịch sử gần đây (Sổ Tay Hẻm dùng seenIncidentIds)
  if (draft.resolvedIncidents.length > MAX_RESOLVED_HISTORY) draft.resolvedIncidents.splice(0, draft.resolvedIncidents.length - MAX_RESOLVED_HISTORY);

  draft.todayIncidentsCount = (draft.todayIncidentsCount ?? 0) + 1;

  return {
    succeeded,
    reactionTitle,
    reactionNarrative,
    karmaDelta: choice.karmaDelta,
    moneyDelta: finalMoneyDelta,
    scareCustomers: choice.scareCustomers,
    disruptionSeconds: choice.disruptionSeconds
  };
}
