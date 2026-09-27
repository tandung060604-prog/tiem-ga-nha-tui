import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { upgradeEffects, UpgradeEffects } from '../../core/upgrades';

function effectsSummary(e: UpgradeEffects): string {
  const parts = [
    e.fryRampPct ? `gà lên vàng nhanh +${e.fryRampPct}%` : '',
    e.tastePct ? `hương vị +${e.tastePct}%` : '',
    e.oilLifePct ? `dầu bền +${e.oilLifePct}%` : '',
    e.patiencePct ? `khách chờ lâu +${e.patiencePct}%` : '',
    e.customersPct ? `khách/ngày +${e.customersPct}%` : '',
    e.autoLift ? 'tự nhấc giỏ khi Perfect' : '',
    e.pricePremiumPct ? `khách trả thêm ${e.pricePremiumPct}%` : '',
    e.traySlots ? `khay +${e.traySlots} ô` : '',
    e.selfServe ? 'khách tự nhận món (kiosk)' : '',
    e.ownDeliveryApp ? 'không mất hoa hồng app' : '',
    e.shelfLifeBonus ? `kho bảo quản +${e.shelfLifeBonus} ngày` : '',
    e.discountWholesale ? `giảm giá sỉ -${e.discountWholesale}%` : '',
    e.sauceTipBonus ? `tip tương +${e.sauceTipBonus / 1000}k` : '',
    e.autoDrink ? 'tự rót nước tự động' : '',
    e.pestImmunity ? 'miễn dịch chuột cống 100%' : ''
  ].filter(Boolean);
  return `⚡ Đang có hiệu lực: ${parts.length ? parts.join(' · ') : 'chưa có (mua nâng cấp đầu tiên nhé!)'}`;
}

export function renderUpgradesTab(state: GameState): string {
  const branches = Object.values(state.upgrades);

  const branchesHtml = branches.map(branch => {
    const curLevel = branch.currentLevel;
    const curTier = branch.tiers[curLevel - 1];
    const nextTier = branch.tiers[curLevel];
    const isMax = !nextTier;
    const isLocked = !isMax && Boolean(
      (nextTier.minChapter !== undefined && state.currentChapter < nextTier.minChapter) ||
      (nextTier.minDay !== undefined && state.day < nextTier.minDay)
    );

    return `
      <div class="item-row" data-branch="${branch.id}">
        <div class="item-icon">${branch.icon}</div>

        <div class="item-meta">
          <div class="item-name">
            ${branch.name}
            <span class="shelf-tag" style="background:#e8f4fd;color:#1976d2;">Cấp ${curLevel}</span>
            ${isLocked ? '<span class="shelf-tag" style="background:#fee2e2;color:#b91c1c;">🔒 Chưa mở</span>' : ''}
          </div>
          <div class="item-sub">
            Hiện tại: <b>${curTier ? curTier.name : 'Chưa có'}</b>
          </div>
          ${!isMax ? `
            <div style="font-size: 0.74rem; color: ${isLocked ? 'var(--soft)' : 'var(--mint-dark)'}; font-weight: 700; margin-top: 3px;">
              Tiếp theo: ${nextTier.name} (${nextTier.cost.toLocaleString('vi-VN')}đ)
            </div>
            ${isLocked ? `
              <div style="font-size: 0.72rem; color: #dc2626; font-weight: 600; margin-top: 2px;">
                🔒 ${nextTier.unlockHint || `Yêu cầu: Chương ${nextTier.minChapter ?? 1}, Ngày ${nextTier.minDay ?? 1}`}
              </div>
            ` : ''}
            <div style="font-size: 0.7rem; color: var(--soft); margin-top: 1px;">
              ${nextTier.description}
            </div>
          ` : `
            <div style="font-size: 0.74rem; color: var(--gold-dark); font-weight: 800; margin-top: 3px;">
              ⭐ Đã nâng cấp tối đa!
            </div>
          `}
        </div>

        <div>
          ${!isMax ? (
            isLocked ? `
              <button class="btn-sm btn-upgrade" data-branch="${branch.id}" disabled style="opacity: 0.6; cursor: not-allowed;" title="Chưa đạt điều kiện mở khóa">
                🔒 Khóa
              </button>
            ` : `
              <button class="btn-sm primary btn-upgrade" data-branch="${branch.id}" ${state.money < nextTier.cost ? 'disabled' : ''}>
                Nâng cấp<b>${(nextTier.cost / 1000).toLocaleString('vi-VN')}k</b>
              </button>
            `
          ) : `
            <button class="btn-sm" disabled>MAX</button>
          `}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="sec-title">
      <span>🛠️ Nâng Cấp Tiệm Gà (7 Nhánh Chuyên Biệt)</span>
    </div>
    <div class="sec-desc">
      7 nhánh nội tại độc lập: Bếp (tốc độ & hương vị), Không gian (giá bán & khay), Vận hành (kiên nhẫn & app riêng), Marketing (lưu lượng khách), Kho lạnh (hạn dùng & giá sỉ), Dịch vụ (tự rót nước & tip tương), Vệ sinh (bền dầu & diệt chuột).
    </div>
    <div class="sec-desc upgrade-effects">${effectsSummary(upgradeEffects(state.upgrades))}</div>
    <div class="upgrades-list">
      ${branchesHtml}
    </div>
  `;
}

export function bindUpgradesEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void
) {
  const upgradeButtons = document.querySelectorAll('.btn-upgrade');
  upgradeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const branchId = target.getAttribute('data-branch');

      if (!branchId || !state.upgrades[branchId]) return;

      const branch = state.upgrades[branchId];
      const nextTier = branch.tiers[branch.currentLevel];

      if (!nextTier) return;

      const isLocked = Boolean(
        (nextTier.minChapter !== undefined && state.currentChapter < nextTier.minChapter) ||
        (nextTier.minDay !== undefined && state.day < nextTier.minDay)
      );

      if (isLocked) {
        showToast(`🔒 Hạng mục này chưa mở khóa! Yêu cầu: ${nextTier.unlockHint || `Chương ${nextTier.minChapter ?? 1}, Ngày ${nextTier.minDay ?? 1}`}`);
        return;
      }

      if (state.money < nextTier.cost) {
        showToast('Không đủ tiền để nâng cấp hạng mục này!');
        return;
      }

      onUpdateState(draft => {
        const target = draft.upgrades[branchId];
        if (!target) return;
        draft.money -= nextTier.cost;
        target.currentLevel += 1;
      });

      audio.playPerfect();
      showToast(`Chúc mừng! Đã nâng cấp lên: ${nextTier.name}! 🎉`);
    });
  });
}
