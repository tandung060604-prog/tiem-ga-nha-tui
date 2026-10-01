import { GameState, HeritageBadgeId, HeritageBadge } from '../types/game';
import { HERITAGE_BADGES, getBadgeCurrentProgress } from '../content/achievements';

export interface BadgeProgressInfo {
  badge: HeritageBadge;
  current: number;
  target: number;
  percent: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

/**
 * Lấy tiến độ chi tiết của một Bằng Khen
 */
export function getBadgeProgress(badge: HeritageBadge, state: GameState): BadgeProgressInfo {
  const claimedList = state.claimedHeritageBadgeIds ?? [];
  const isClaimed = claimedList.includes(badge.id);

  const current = getBadgeCurrentProgress(badge.id, state);
  const target = badge.targetCount;
  const percent = Math.min(100, Math.round((current / target) * 100));
  const isCompleted = current >= target;

  return {
    badge,
    current,
    target,
    percent,
    isCompleted,
    isClaimed,
  };
}

/**
 * Lấy toàn bộ danh sách tiến độ của 12 Bằng Khen
 */
export function getAllBadgesProgress(state: GameState): BadgeProgressInfo[] {
  return HERITAGE_BADGES.map(b => getBadgeProgress(b, state));
}

/**
 * Đếm số lượng Bằng Khen đã hoàn thành nhưng chưa nhận thưởng
 */
export function getClaimableBadgesCount(state: GameState): number {
  return getAllBadgesProgress(state).filter(p => p.isCompleted && !p.isClaimed).length;
}

/**
 * Nhận thưởng Bằng Khen (Tiền mặt, Điểm Karma & Vinh danh)
 */
export function claimBadgeReward(
  state: GameState,
  badgeId: HeritageBadgeId
): { success: boolean; message: string; badge: HeritageBadge | null } {
  const badge = HERITAGE_BADGES.find(b => b.id === badgeId);
  if (!badge) {
    return { success: false, message: 'Không tìm thấy bằng khen!', badge: null };
  }

  if (!state.claimedHeritageBadgeIds) {
    state.claimedHeritageBadgeIds = [];
  }

  if (state.claimedHeritageBadgeIds.includes(badgeId)) {
    return { success: false, message: 'Bạn đã nhận thưởng bằng khen này rồi!', badge };
  }

  const progress = getBadgeProgress(badge, state);
  if (!progress.isCompleted) {
    return {
      success: false,
      message: `Chưa hoàn thành điều kiện! Tiến độ: ${progress.current}/${progress.target}.`,
      badge,
    };
  }

  // Trao thưởng
  state.claimedHeritageBadgeIds.push(badgeId);
  state.money += badge.rewardMoney;

  if (badge.rewardKarma && state.karma) {
    if (badge.rewardKarma.community) {
      state.karma.community = Math.min(100, (state.karma.community || 50) + badge.rewardKarma.community);
    }
    if (badge.rewardKarma.craftsmanship) {
      state.karma.craftsmanship = Math.min(100, (state.karma.craftsmanship || 50) + badge.rewardKarma.craftsmanship);
    }
    if (badge.rewardKarma.ambition) {
      state.karma.ambition = Math.min(100, (state.karma.ambition || 50) + badge.rewardKarma.ambition);
    }
  }

  return {
    success: true,
    message: `Đã đóng mộc đỏ và nhận Bằng Khen "${badge.title}"! Thưởng +${badge.rewardMoney.toLocaleString('vi-VN')}đ!`,
    badge,
  };
}
