import { GameState } from '../../types/game';
import { getAllBadgesProgress } from '../../core/achievementsEngine';
import { escapeHtml } from '../escapeHtml';
import { ASSETS } from '../../content/assets';

/**
 * Render Modal Bức Tường Bằng Khen Tổ Dân Phố Hẻm 1102 (Wall of Fame)
 * Nâng cấp UX: Tự động đưa Bằng Khen chờ nhận lên đầu tiên, nút 'Nhận Tất Cả' 1 chạm không cần cuộn!
 */
export function renderAchievementsWallModal(state: GameState, filterCategory: string = 'all'): string {
  const allBadges = getAllBadgesProgress(state);
  const claimedCount = allBadges.filter(b => b.isClaimed).length;
  const completedCount = allBadges.filter(b => b.isCompleted).length;
  const pendingClaimBadges = allBadges.filter(b => b.isCompleted && !b.isClaimed);
  const pendingClaimCount = pendingClaimBadges.length;
  const totalClaimableMoney = pendingClaimBadges.reduce((sum, b) => sum + b.badge.rewardMoney, 0);

  // Lọc theo thể loại
  let filteredBadges = filterCategory === 'all'
    ? allBadges
    : filterCategory === 'claimable'
      ? pendingClaimBadges
      : allBadges.filter(b => b.badge.category === filterCategory);

  // Sắp xếp thông minh:
  // 1. Chờ nhận thưởng (isCompleted && !isClaimed) -> ĐƯA LÊN ĐẦU TIÊN
  // 2. Đang thực hiện (!isCompleted) -> Xếp theo % tiến độ giảm dần
  // 3. Đã nhận (isClaimed) -> Xếp ở cuối
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aPending = a.isCompleted && !a.isClaimed ? 1 : 0;
    const bPending = b.isCompleted && !b.isClaimed ? 1 : 0;
    if (aPending !== bPending) return bPending - aPending;

    const aClaimed = a.isClaimed ? 1 : 0;
    const bClaimed = b.isClaimed ? 1 : 0;
    if (aClaimed !== bClaimed) return aClaimed - bClaimed;

    return b.percent - a.percent;
  });

  const countForCat = (cat: string) => allBadges.filter(b => b.badge.category === cat).length;

  const categories = [
    ...(pendingClaimCount > 0 ? [{ id: 'claimable', label: `⭐ Chờ Nhận (${pendingClaimCount})` }] : []),
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
        <button class="btn-badge-filter ${filterCategory === c.id ? 'active' : ''}" data-cat="${c.id}" style="padding: 5px 8px; font-size: 0.7rem; font-weight: 800; border-radius: 6px; border: 1.5px solid ${filterCategory === c.id ? '#854d0e' : '#d4a373'}; background: ${filterCategory === c.id ? (c.id === 'claimable' ? '#dc2626' : '#854d0e') : (c.id === 'claimable' ? '#fee2e2' : '#fff')}; color: ${filterCategory === c.id ? '#fff' : (c.id === 'claimable' ? '#dc2626' : '#78350f')}; cursor: pointer; white-space: nowrap; ${c.id === 'claimable' ? 'animation: pulse 1.5s infinite;' : ''}">
          ${c.label}
        </button>
      `).join('')}
    </div>
  `;

  // Banner "Nhận Tất Cả" nổi bật khi có bằng khen hoàn thành chờ đóng dấu mộc
  const claimAllBannerHtml = pendingClaimCount > 0 ? `
    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 10px; padding: 8px 12px; margin: 8px 10px 4px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.25);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.3rem;">🎖️</span>
        <div>
          <div style="font-size: 0.78rem; font-weight: 900; color: #92400e;">
            CÓ ${pendingClaimCount} BẰNG KHEN CHỜ ĐÓNG MỘC!
          </div>
          <div style="font-size: 0.68rem; color: #b45309; font-weight: 700;">
            Tổng tiền thưởng: <b style="color: #15803d;">+${totalClaimableMoney.toLocaleString('vi-VN')}đ</b>
          </div>
        </div>
      </div>
      <button id="btn-claim-all-badges" style="padding: 7px 12px; font-size: 0.75rem; font-weight: 900; background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; border: 1.5px solid #991b1b; border-radius: 8px; cursor: pointer; box-shadow: 0 3px 0 #7f1d1d; white-space: nowrap; display: flex; align-items: center; gap: 4px; animation: pulse 1.2s infinite;">
        <span>✨</span> NHẬN TẤT CẢ
      </button>
    </div>
  ` : '';

  const badgesHtml = sortedBadges.map(item => {
    const { badge, current, target, percent, isCompleted, isClaimed } = item;
    const isPendingClaim = isCompleted && !isClaimed;

    // Khung viền và nền bằng khen: Nếu chờ nhận thì viền vàng cam nổi bật
    const borderColor = isClaimed ? '#b45309' : isPendingClaim ? '#dc2626' : isCompleted ? '#eab308' : '#cbd5e1';
    const bgColor = isClaimed ? '#fffdf7' : isPendingClaim ? '#fffbeb' : '#f8fafc';

    return `
      <div class="heritage-badge-card ${isPendingClaim ? 'is-pending-claim' : ''}" style="flex-shrink: 0; background: ${bgColor}; border: ${isPendingClaim ? '2.5px solid #dc2626' : '2px solid ' + borderColor}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: ${isPendingClaim ? '0 4px 14px rgba(220, 38, 38, 0.2)' : '0 4px 12px rgba(0,0,0,0.06)'}; position: relative; overflow: hidden;">
        
        <!-- Huy hiệu 'CHỜ NHẬN' ghim góc trên nếu đang chờ nhận -->
        ${isPendingClaim ? `
          <div style="position: absolute; top: 0; right: 0; background: #dc2626; color: #fff; font-size: 0.58rem; font-weight: 900; padding: 3px 10px; border-bottom-left-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ✨ CHỜ NHẬN THƯỞNG
          </div>
        ` : ''}

        <!-- Dấu Mộc Đỏ Triện Tròn khi đã hoàn thành / đã nhận -->
        ${isCompleted ? `
          <div style="position: absolute; right: ${isPendingClaim ? '40px' : '10px'}; top: 8px; width: 56px; height: 56px; border-radius: 50%; border: 2px dashed #dc2626; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-12deg); opacity: 0.85; pointer-events: none; color: #dc2626; background: rgba(254, 226, 226, 0.35);">
            <div style="font-size: 0.44rem; font-weight: 900; letter-spacing: 0.5px;">TỔ DÂN PHỐ</div>
            <div style="font-size: 0.8rem; line-height: 1;">★</div>
            <div style="font-size: 0.42rem; font-weight: 900; letter-spacing: 0.5px;">CHỨNG NHẬN</div>
          </div>
        ` : ''}

        <!-- Header Bằng Khen -->
        <div style="padding-right: ${isPendingClaim ? '80px' : '0'};">
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

        <!-- Banner Nhận Tất Cả Khi Có Bằng Khen Đạt Chuẩn -->
        ${claimAllBannerHtml}

        <!-- Bộ Lọc Thể Loại -->
        <div style="background: #eedcc0; padding: 6px 10px; border-bottom: 1.5px solid #d4a373;">
          ${categoryFilterHtml}
        </div>

        <!-- Danh Sách Bằng Khen Treo Tường (Đã xếp ưu tiên chờ nhận lên đầu) -->
        <div style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px;">
          ${badgesHtml}
        </div>

      </div>
    </div>
  `;
}
