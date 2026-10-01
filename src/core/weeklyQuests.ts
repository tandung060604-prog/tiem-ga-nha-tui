import { GameState, WeeklyQuest, WeeklyQuestProgress } from '../types/game';

/**
 * Sinh danh sách 3 Nhiệm Vụ Tuần cho tuần tương ứng
 */
export function generateWeeklyQuestsForWeek(week: number): WeeklyQuest[] {
  return [
    {
      id: `quest_w${week}_craft`,
      week,
      title: 'Tuần Lễ Gà Vàng Giòn Rụm',
      icon: '🔥',
      desc: 'Chiên đạt 25 mẻ gà hoặc khoai ở cấp độ Tuyệt Đỉnh (Perfect)',
      targetCount: 25,
      currentCount: 0,
      rewardMoney: 150000,
      rewardKarma: { craftsmanship: 10 },
      rewardBadge: '🏅 Đôi Tay Vàng',
      completed: false,
      claimed: false
    },
    {
      id: `quest_w${week}_hygiene`,
      week,
      title: 'Tiệm Bếp Chuẩn Sao Sạch Bóng',
      icon: '✨',
      desc: 'Phục vụ thành công 35 lượt thực khách hài lòng trong tuần',
      targetCount: 35,
      currentCount: 0,
      rewardMoney: 180000,
      rewardKarma: { craftsmanship: 5, ambition: 5 },
      rewardBadge: '🌟 Quán Gà Tin Cậy',
      completed: false,
      claimed: false
    },
    {
      id: `quest_w${week}_community`,
      week,
      title: 'Tình Làng Nghĩa Xóm Hẻm 1102',
      icon: '❤️',
      desc: 'Gửi 1 gói tiếp tế cho bạn cùng phòng hoặc giải quyết 2 sự cố đời thường',
      targetCount: 2,
      currentCount: 0,
      rewardMoney: 120000,
      rewardKarma: { community: 15 },
      rewardBadge: '🏡 Tri Kỷ Hẻm Sâu',
      completed: false,
      claimed: false
    }
  ];
}

/**
 * Đồng bộ hoặc khởi tạo nhiệm vụ tuần theo ngày hiện tại trong game
 */
export function ensureWeeklyQuests(state: GameState): WeeklyQuestProgress {
  const currentWeek = Math.max(1, Math.ceil((state.day || 1) / 7));
  if (!state.weeklyQuestsProgress || state.weeklyQuestsProgress.week !== currentWeek) {
    state.weeklyQuestsProgress = {
      week: currentWeek,
      quests: generateWeeklyQuestsForWeek(currentWeek),
      allClaimed: false
    };
  }
  return state.weeklyQuestsProgress;
}

/**
 * Ghi nhận tiến độ nhiệm vụ tuần khi có sự kiện diễn ra
 */
export function recordWeeklyQuestProgress(
  state: GameState,
  action: 'perfect_fry' | 'serve_customer' | 'community_action',
  delta: number = 1
): void {
  const progress = ensureWeeklyQuests(state);
  for (const quest of progress.quests) {
    if (quest.completed) continue;

    if (action === 'perfect_fry' && quest.id.includes('_craft')) {
      quest.currentCount = Math.min(quest.targetCount, quest.currentCount + delta);
      if (quest.currentCount >= quest.targetCount) quest.completed = true;
    } else if (action === 'serve_customer' && quest.id.includes('_hygiene')) {
      quest.currentCount = Math.min(quest.targetCount, quest.currentCount + delta);
      if (quest.currentCount >= quest.targetCount) quest.completed = true;
    } else if (action === 'community_action' && quest.id.includes('_community')) {
      quest.currentCount = Math.min(quest.targetCount, quest.currentCount + delta);
      if (quest.currentCount >= quest.targetCount) quest.completed = true;
    }
  }

  progress.allClaimed = progress.quests.every(q => q.claimed);
}

/**
 * Nhận thưởng từ nhiệm vụ tuần đã hoàn thành
 */
export function claimWeeklyQuestReward(
  state: GameState,
  questId: string
): { success: boolean; message: string; quest?: WeeklyQuest } {
  const progress = ensureWeeklyQuests(state);
  const quest = progress.quests.find(q => q.id === questId);
  if (!quest) {
    return { success: false, message: 'Nhiệm vụ không tồn tại!' };
  }
  if (!quest.completed) {
    return { success: false, message: 'Nhiệm vụ chưa hoàn thành!' };
  }
  if (quest.claimed) {
    return { success: false, message: 'Bạn đã nhận phần thưởng này rồi!' };
  }

  // Nhận thưởng tiền mặt
  state.money += quest.rewardMoney;

  // Nhận thưởng Karma
  if (quest.rewardKarma) {
    if (quest.rewardKarma.community) {
      state.karma.community = Math.min(100, (state.karma.community || 50) + quest.rewardKarma.community);
    }
    if (quest.rewardKarma.craftsmanship) {
      state.karma.craftsmanship = Math.min(100, (state.karma.craftsmanship || 50) + quest.rewardKarma.craftsmanship);
    }
    if (quest.rewardKarma.ambition) {
      state.karma.ambition = Math.min(100, (state.karma.ambition || 50) + quest.rewardKarma.ambition);
    }
  }

  quest.claimed = true;
  progress.allClaimed = progress.quests.every(q => q.claimed);

  return {
    success: true,
    message: `🎉 Đã nhận thưởng ${quest.rewardMoney.toLocaleString('vi-VN')}đ & Danh hiệu "${quest.rewardBadge}"!`,
    quest
  };
}
