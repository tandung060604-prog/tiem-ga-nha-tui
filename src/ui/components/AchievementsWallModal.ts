import { GameState } from '../../types/game';
import { getAllBadgesProgress } from '../../core/achievementsEngine';
import { escapeHtml } from '../escapeHtml';
import { ASSETS } from '../../content/assets';

/**
 * Render Modal Bức Tường Bằng Khen Tổ Dân Phố Hẻm 1102 (Wall of Fame)
 */
export function renderAchievementsWallModal(state: GameState, filterCategory: string = 'all'): string {
  const allBadges = getAllBadgesProgress(state);
  const claimedCount = allBadges.filter(b => b.isClaimed).length;
  const completedCount = allBadges.filter(b => b.isCompleted).length;

  const filteredBadges = filterCategory === 'all'
    ? allBadges
    : allBadges.filter(b => b.badge.category === filterCategory);

  const countForCat = (cat: string) => allBadges.filter(b => b.badge.category === cat).length;

  const categories = [
    { id: 'all', label: `Tất Cả (${allBadges.length})` },
    { id: 'cooking', label: `🍳 Bếp (${countForCat('cooking')})` },
    { id: 'security', label: `👮 An Ninh (${countForCat('security')})` },
    { id: 'community', label: `💖 Nghĩa Tình (${countForCat('community')})` },
    { id: 'operations', label: `📦 Vận Hành (${countForCat('operations')})` },
    { id: 'legend', label: `🏛️ Huyền Thoại (${countForCat('legend')})` },
  ];

  const categoryFilterHtml = `
    <div style="display: flex; gap: 4px; overflow-x: auto; padding: 4px 2px; scrollbar-width: none;">
      ${categories.map(c => `
        <button class="btn-badge-filter ${filterCategory === c.id ? 'active' : ''}" data-cat="${c.id}" style="padding: 5px 8px; font-size: 0.7rem; font-weight: 800; border-radius: 6px; border: 1.5px solid ${filterCategory === c.id ? '#854d0e' : '#d4a373'}; background: ${filterCategory === c.id ? '#854d0e' : '#fff'}; color: ${filterCategory === c.id ? '#fff' : '#78350f'}; cursor: pointer; white-space: nowrap;">
          ${c.label}
        </button>
      `).join('')}
    </div>
  `;

  const badgesHtml = filteredBadges.map(item => {
    const { badge, current, target, percent, isCompleted, isClaimed } = item;

    // Khung viền và nền bằng khen
    const borderColor = isClaimed ? '#b45309' : isCompleted ? '#eab308' : '#cbd5e1';
    const bgColor = isClaimed ? '#fffdf7' : isCompleted ? '#fefce8' : '#f8fafc';

    return `
      <div class="heritage-badge-card" style="flex-shrink: 0; background: ${bgColor}; border: 2.5px solid ${borderColor}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); position: relative; overflow: hidden;">
        
        <!-- Dấu Mộc Đỏ Triện Tròn khi đã hoàn thành / đã nhận -->
        ${isCompleted ? `
          <div style="position: absolute; right: 10px; top: 10px; width: 62px; height: 62px; border-radius: 50%; border: 2px dashed #dc2626; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-12deg); opacity: 0.85; pointer-events: none; color: #dc2626; background: rgba(254, 226, 226, 0.4);">
            <div style="font-size: 0.48rem; font-weight: 900; letter-spacing: 0.5px;">TỔ DÂN PHỐ</div>
            <div style="font-size: 0.9rem;">★</div>
            <div style="font-size: 0.45rem; font-weight: 900; letter-spacing: 0.5px;">CHỨNG NHẬN</div>
          </div>
        ` : ''}

        <!-- Header Bằng Khen -->
        <div>
          <div style="font-size: 0.65rem; font-weight: 800; color: #b45309; letter-spacing: 0.5px; text-transform: uppercase;">
            ${escapeHtml(badge.kicker)}
          </div>
          <div style="font-size: 0.95rem; font-weight: 900; color: #451a03; margin-top: 2px; display: flex; align-items: center; gap: 6px;">
            <span>${badge.icon}</span>
            <span>${escapeHtml(badge.title)}</span>
          </div>
        </div>

        <!-- Yêu cầu & Thanh Tiến Độ -->
        <div style="background: rgba(0,0,0,0.03); border-radius: 6px; padding: 6px 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #4b5563; font-weight: 700;">
            <span>${escapeHtml(badge.requirementDesc)}</span>
            <span style="color: ${isCompleted ? '#16a34a' : '#b45309'}; font-weight: 800;">${current}/${target} (${percent}%)</span>
          </div>
          <div style="width: 100%; height: 7px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 4px;">
            <div style="width: ${percent}%; height: 100%; background: ${isCompleted ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #f59e0b, #d97706)'}; border-radius: 4px;"></div>
          </div>
        </div>

        <!-- Trích dẫn & Danh hiệu -->
        <div style="font-size: 0.7rem; color: #6b7280; font-style: italic; line-height: 1.35;">
          "${escapeHtml(badge.quote)}"
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 6px;">
          <div style="font-size: 0.68rem; color: #b45309; font-weight: 800;">
            🎖️ Danh hiệu: <span style="color: #78350f;">${escapeHtml(badge.honorTitle)}</span>
          </div>
          <div style="font-size: 0.68rem; color: #047857; font-weight: 800;">
            +${badge.rewardMoney.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <!-- Nút Hành Động -->
        ${isClaimed ? `
          <div style="text-align: center; font-size: 0.72rem; font-weight: 800; color: #15803d; background: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 6px;">
            ✓ ĐÃ TREO TRÊN TƯỜNG DANH DỰ
          </div>
        ` : isCompleted ? `
          <button class="btn-claim-badge" data-badge-id="${badge.id}" style="width: 100%; padding: 8px; font-size: 0.8rem; font-weight: 900; background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; border: 1.5px solid #991b1b; border-radius: 8px; cursor: pointer; box-shadow: 0 3px 0 #7f1d1d; animation: pulse 1.5s infinite;">
            🎖️ ĐÓNG DẤU MỘC & NHẬN THƯỞNG (+${badge.rewardMoney.toLocaleString('vi-VN')}đ)
          </button>
        ` : `
          <div style="text-align: center; font-size: 0.68rem; font-weight: 700; color: #94a3b8; background: #f1f5f9; border-radius: 6px; padding: 5px;">
            ⏳ Đang tiếp tục phấn đấu (${current}/${target})
          </div>
        `}

      </div>
    `;
  }).join('');

  return `
    <div id="modal-achievements-wall" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1060; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 450px; max-height: 90vh; display: flex; flex-direction: column; background: #fbf5e8; border: 3px solid #6c3b16; border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.5); overflow: hidden;">
        
        <!-- Header Bức Tường Bằng Khen -->
        <div style="background: linear-gradient(135deg, #78350f, #451a03); color: #fff; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #290f02;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${ASSETS.ui.trophyGoldenShowcase}" alt="Cúp Vàng Tổ Dân Phố" style="width: 36px; height: 36px; image-rendering: pixelated; object-fit: contain; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5)); flex-shrink: 0;" />
            <div>
              <div style="font-size: 0.95rem; font-weight: 900; color: #fef08a; letter-spacing: 0.5px;">
                BỨC TƯỜNG BẰNG KHEN TỔ DÂN PHỐ
              </div>
              <div style="font-size: 0.68rem; color: #fde68a;">
                Vinh danh công trạng Hẻm 1102 (${claimedCount}/${allBadges.length} đã treo · ${completedCount} đạt chuẩn)
              </div>
            </div>
          </div>
          <button id="btn-close-achievements" class="btn-close" style="background: #451a03; border: 1.5px solid #fef08a; border-radius: 50%; width: 28px; height: 28px; color: #fff; font-weight: 900; cursor: pointer;">
            ✕
          </button>
        </div>

        <!-- Bộ Lọc Thể Loại -->
        <div style="background: #eedcc0; padding: 6px 10px; border-bottom: 1.5px solid #d4a373;">
          ${categoryFilterHtml}
        </div>

        <!-- Danh Sách Bằng Khen Treo Tường -->
        <div style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
          ${badgesHtml}
        </div>

      </div>
    </div>
  `;
}
