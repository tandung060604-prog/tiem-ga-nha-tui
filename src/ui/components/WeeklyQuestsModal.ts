import { GameState, WeeklyQuest } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { ensureWeeklyQuests } from '../../core/weeklyQuests';

const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export function renderWeeklyQuestsModal(state: GameState): string {
  const progress = ensureWeeklyQuests(state);
  const currentDay = state.day || 1;
  const startDay = (progress.week - 1) * 7 + 1;
  const endDay = progress.week * 7;
  const daysRemaining = Math.max(0, endDay - currentDay);

  return `
    <div class="weekly-quests-modal-box" style="text-align: left; display: flex; flex-direction: column; gap: 10px; max-width: 420px; width: 100%; margin: 0 auto; background: #faeed1; padding: 14px 16px; border-radius: 12px; border: 3px solid #5a3018; box-shadow: inset 2px 2px 0 #f7d046, inset -2px -2px 0 #2b1810, 0 8px 24px rgba(0,0,0,0.35);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4a373; padding-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.35rem;">📜</span>
          <div>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #3d2314; font-family: var(--font-heading); letter-spacing: 0.5px;">THỬ THÁCH TUẦN LỄ</h3>
            <div style="font-size: 0.72rem; color: #7c4f32; font-weight: 700;">
              Tuần ${progress.week} (Ngày ${startDay} – ${endDay}) · Còn ${daysRemaining} ngày
            </div>
          </div>
        </div>
        <button id="btn-close-weekly-quests" style="border: 0; background: none; font-size: 1.35rem; cursor: pointer; color: #7c4f32; line-height: 1; padding: 4px;">✕</button>
      </div>

      <!-- Introduction note -->
      <div style="background: #fffdf5; padding: 8px 10px; border-radius: 8px; border: 1.5px solid #fed7aa; font-size: 0.73rem; color: #7c4f32; line-height: 1.4;">
        💡 Hoàn thành các mục tiêu thử thách trong tuần để nhận thưởng tiền mặt và danh hiệu nghề bếp!
      </div>

      <!-- 3 Quests List -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${progress.quests.map(quest => renderQuestCard(quest)).join('')}
      </div>

      <!-- Action Button -->
      <div style="margin-top: 4px;">
        <button id="btn-close-weekly-quests-footer" class="btn-sm primary" style="width: 100%; min-height: 38px; font-weight: 800; font-size: 0.85rem; border-radius: 8px;">
          Đã Hiểu
        </button>
      </div>
    </div>
  `;
}

function renderQuestCard(quest: WeeklyQuest): string {
  const pct = Math.min(100, Math.round((quest.currentCount / Math.max(1, quest.targetCount)) * 100));

  let actionButton = '';
  if (quest.claimed) {
    actionButton = `
      <span style="font-size: 0.72rem; font-weight: 800; color: #059669; background: #d1fae5; padding: 4px 8px; border-radius: 6px; border: 1px solid #10b981;">
        ✓ Đã Nhận
      </span>
    `;
  } else if (quest.completed) {
    actionButton = `
      <button class="btn-sm btn-claim-quest" data-quest-id="${escapeHtml(quest.id)}" style="padding: 5px 12px; font-size: 0.75rem; font-weight: 800; border-radius: 6px; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #451a03; border: 1.5px solid #b45309; cursor: pointer; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);">
        🎁 Nhận Thưởng
      </button>
    `;
  } else {
    actionButton = `
      <span style="font-size: 0.7rem; font-weight: 700; color: #94a3b8; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">
        ${quest.currentCount}/${quest.targetCount}
      </span>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: #ffffff; border: 1.5px solid #e2e8f0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.3rem;">${quest.icon}</span>
          <div>
            <b style="font-size: 0.85rem; color: #3d2314;">${escapeHtml(quest.title)}</b>
            <div style="font-size: 0.7rem; color: #64748b; line-height: 1.3;">
              ${escapeHtml(quest.desc)}
            </div>
          </div>
        </div>
        <div style="flex-shrink: 0;">
          ${actionButton}
        </div>
      </div>

      <!-- Progress bar -->
      <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
        <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: ${quest.completed ? '#10b981' : '#f59e0b'}; transition: width 0.3s ease;"></div>
        </div>
        <span style="font-size: 0.68rem; font-weight: 800; color: ${quest.completed ? '#059669' : '#b45309'}; min-width: 32px; text-align: right;">
          ${pct}%
        </span>
      </div>

      <!-- Reward info -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: #7c4f32; border-top: 1px dashed #e2e8f0; padding-top: 4px; margin-top: 2px;">
        <span>Phần thưởng: <b style="color: #b45309;">+${vnd(quest.rewardMoney)}</b></span>
        ${quest.rewardBadge ? `<span style="background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 4px; font-weight: 700;">${escapeHtml(quest.rewardBadge)}</span>` : ''}
      </div>
    </div>
  `;
}
