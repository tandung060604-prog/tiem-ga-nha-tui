import { GameState, Storylet, StoryletEffect } from '../types/game';

/**
 * Storylet QBN Engine (Quality-Based Narrative)
 * Hệ thống tự động thẩm định các chỉ số thế giới (Day, Karma, Doanh thu, Tay nghề)
 * để mở khóa các mẩu chuyện & ký ức đêm độc quyền của 36 cư dân Hẻm 1102.
 */

export function meetsStoryletRequirements(storylet: Storylet, state: GameState): boolean {
  // 1. One-shot check: Nếu sự kiện chỉ xảy ra 1 lần và đã xem rồi thì bỏ qua
  if (storylet.oneShot !== false) {
    if (state.seenStoryletIds && state.seenStoryletIds.includes(storylet.id)) {
      return false;
    }
  }

  // 2. Kiểm tra điều kiện mở khóa (Requirements)
  const req = storylet.requirements;
  if (!req) return true;

  if (req.minDay && state.day < req.minDay) return false;
  if (req.maxDay && state.day > req.maxDay) return false;
  if (req.chapter && state.currentChapter < req.chapter) return false;

  // Kiểm tra Karma
  if (req.minKarma) {
    const karma = state.karma || { community: 0, craftsmanship: 0, ambition: 0 };
    if (req.minKarma.community && (karma.community || 0) < req.minKarma.community) return false;
    if (req.minKarma.craftsmanship && (karma.craftsmanship || 0) < req.minKarma.craftsmanship) return false;
    if (req.minKarma.ambition && (karma.ambition || 0) < req.minKarma.ambition) return false;
  }

  // Kiểm tra tiền tối thiểu
  if (req.minMoney && state.money < req.minMoney) return false;

  return true;
}

export function getEligibleStorylets(state: GameState, pool: Storylet[]): Storylet[] {
  return pool.filter(s => meetsStoryletRequirements(s, state));
}

export function pickNightStorylet(state: GameState, pool: Storylet[]): Storylet | null {
  // Giới hạn nghiêm ngặt theo Jev Decision (Confidence 1.0): Mỗi ngày chỉ 1 mẩu truyện duy nhất
  if (state.lastStoryletDay && state.lastStoryletDay >= state.day) {
    return null;
  }

  const eligible = getEligibleStorylets(state, pool);
  if (eligible.length === 0) return null;

  return eligible[0] ?? null;
}

export function applyStoryletChoice(
  state: GameState,
  storylet: Storylet,
  choiceId: string
): { effect: StoryletEffect; updatedState: GameState } {
  const choice = storylet.choices.find(c => c.id === choiceId) || storylet.choices[0];
  const fallbackEffect: StoryletEffect = {
    reactionNarrative: 'Bạn gật đầu đồng tình và tiếp tục dọn hàng.'
  };
  const effect: StoryletEffect = choice?.effect || fallbackEffect;

  // Clone hoặc cập nhật trực tiếp state
  if (!state.seenStoryletIds) {
    state.seenStoryletIds = [];
  }
  if (!state.seenStoryletIds.includes(storylet.id)) {
    state.seenStoryletIds.push(storylet.id);
  }
  state.lastStoryletDay = state.day;

  // Cập nhật Karma
  if (effect.karmaDelta) {
    if (!state.karma) {
      state.karma = { community: 0, craftsmanship: 0, ambition: 0 };
    }
    if (effect.karmaDelta.community) {
      state.karma.community = Math.max(0, (state.karma.community || 0) + effect.karmaDelta.community);
    }
    if (effect.karmaDelta.craftsmanship) {
      state.karma.craftsmanship = Math.max(0, (state.karma.craftsmanship || 0) + effect.karmaDelta.craftsmanship);
    }
    if (effect.karmaDelta.ambition) {
      state.karma.ambition = Math.max(0, (state.karma.ambition || 0) + effect.karmaDelta.ambition);
    }
  }

  // Cập nhật tiền
  if (effect.moneyDelta) {
    state.money = Math.max(0, state.money + effect.moneyDelta);
  }

  // Cập nhật sao đánh giá
  if (effect.reputationDelta) {
    state.ratings.overall = Math.min(5, Math.max(1, state.ratings.overall + effect.reputationDelta));
  }

  // Thưởng nguyên liệu kho (nếu có)
  if (effect.bonusItem) {
    const item = state.inventory[effect.bonusItem.id];
    if (item) {
      item.amount += effect.bonusItem.amount;
      if (!item.batches) item.batches = [];
      item.batches.push({
        amount: effect.bonusItem.amount,
        daysLeft: item.shelfLifeDays ?? 3,
        refundable: 0,
        unitCost: 0
      });
    }
  }

  return { effect, updatedState: state };
}
