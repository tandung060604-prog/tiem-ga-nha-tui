import { GameState } from '../../types/game';
import { STAFF_ROLES_INFO, STAFF_TRAITS } from '../../content/staff';
import { audio } from '../../core/audio';
import { describeStaffEffect, maxStaff, severancePay } from '../../core/staff';
import { performGachaRollSingle, performGachaRollTen, GACHA_PRICES } from '../../core/staffGacha';
import { openGachaResultModal } from './GachaResultModal';
import { staffImage, ASSETS } from '../../content/assets';

export function renderStaffTab(state: GameState): string {
  const cap = state.currentChapter < 2 ? 1 : maxStaff(state.currentChapter);
  const isChapter1 = state.currentChapter < 2;

  const softPityRemaining = Math.max(0, 10 - (state.staffGachaPity || 0));
  const hardPityRemaining = Math.max(0, 50 - (state.staffGachaSsrPity || 0));
  const totalRolls = state.staffGachaTotalRolls || 0;

  // Danh sách nhân viên đang làm việc
  const staffRows = state.staff.map((member, idx) => {
    const roleInfo = STAFF_ROLES_INFO[member.role];
    const traitInfo = STAFF_TRAITS.find(t => (member.traits ?? []).includes(t.id));
    const rarityClass = member.rarity ? `rarity-${member.rarity}` : '';
    const starsHtml = member.stars ? ('★'.repeat(member.stars) + '☆'.repeat(5 - member.stars)) : '';
    const modelSrc = staffImage(member);
    const fallbackSrc = staffImage({ role: member.role, rarity: member.rarity });

    return `
      <div class="item-row staff-item-row ${rarityClass}" data-staff-id="${member.id}">
        <div class="item-icon staff-avatar-frame">
          <img src="${modelSrc}" alt="${member.name}" class="staff-avatar-mini" onerror="this.onerror=null;this.src='${fallbackSrc}';"/>
        </div>

        <div class="item-meta">
          <div class="item-name">
            ${member.name}
            ${member.rarity ? `<span class="gacha-rarity-pill ${member.rarity}">${member.rarity === 'SSR' ? `<img src="${ASSETS.icons.star}" class="badge-pixel-star-xs" alt="" /> SSR` : member.rarity}</span>` : ''}
            <span class="shelf-tag shelf-tag-role">${roleInfo ? roleInfo.name : member.role}</span>
          </div>
          ${member.title ? `<div class="staff-sub-title">"${member.title}" · <span class="gacha-stars-mini">${starsHtml}</span></div>` : ''}
          <div class="item-sub">
            Lương: <b>${(member.hourlyWage ?? (member as any).salary ?? 25000).toLocaleString('vi-VN')}đ/h</b> · Tâm trạng: <b>${member.mood}%</b>
          </div>
          <div class="staff-stats">
            <img src="${ASSETS.icons.lightning}" class="btn-pixel-icon-xs" alt="" /> Tốc độ: <b>${member.speed}</b> | <img src="${ASSETS.icons.target}" class="btn-pixel-icon-xs" alt="" /> Tay nghề: <b>${member.skill}</b>
            ${member.laziness !== undefined ? ` | 💤 Lười: <b style="color:#f87171">${member.laziness}%</b>` : ''}
            ${member.errorRate !== undefined ? ` | ⚠️ Sai: <b style="color:#f87171">${member.errorRate}%</b>` : ''}
          </div>
          <div class="staff-effect"><img src="${ASSETS.icons.settings}" class="btn-pixel-icon-xs" alt="" /> ${describeStaffEffect(member, state.staff)}</div>
          ${member.passiveName ? `<div class="staff-passive"><img src="${ASSETS.icons.sparkle}" class="btn-pixel-icon-xs" alt="" /> <b>${member.passiveName}:</b> ${member.passiveDesc}</div>` : ''}
          ${traitInfo ? `<div class="staff-trait"><img src="${ASSETS.icons.star}" class="btn-pixel-icon-xs" alt="" /> ${traitInfo.name}: ${traitInfo.desc}</div>` : ''}
        </div>

        <div class="btn-group">
          <button class="btn-sm btn-bonus" data-index="${idx}">
            Thưởng<small>(50k)</small>
          </button>
          <button class="btn-sm btn-fire" data-index="${idx}">
            Cho nghỉ<small>(${Math.round(severancePay(member) / 1000)}k)</small>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Sức chứa nhân sự tối đa
  const full = state.staff.length >= cap;

  return `
    <!-- BANNER CHIÊU MỘ GACHA NHÂN TÀI HẺM 1102 -->
    <div class="gacha-recruitment-banner">
      <div class="gacha-banner-header">
        <div class="gacha-banner-title">
          <span><img src="${ASSETS.icons.newspaper}" class="pixel-card-title-icon" alt="" /> CHIÊU MỘ NHÂN TÀI GACHA</span>
        </div>
        <div style="font-size: 0.7rem; color: #cbd5e1;">
          Đã tuyển: <b>${totalRolls} lượt</b>
        </div>
      </div>

      <div class="gacha-pity-hud">
        <div class="pity-badge">
          <img src="${ASSETS.icons.roleSecurity}" class="btn-pixel-icon-xs" alt="" /> Bảo hiểm SR+: <b>${softPityRemaining}</b> lượt nữa
        </div>
        <div class="pity-badge ssr">
          <img src="${ASSETS.icons.trophy}" class="btn-pixel-icon-xs" alt="" /> Bảo hiểm SSR: <b>${hardPityRemaining}</b> lượt nữa
        </div>
      </div>

      <div class="gacha-actions-grid">
        <button id="btn-gacha-single" class="btn-gacha-roll btn-gacha-single" ${state.money < GACHA_PRICES.SINGLE_ROLL || full ? 'disabled' : ''}>
          <span class="gacha-btn-name"><img src="${ASSETS.icons.newspaper}" class="btn-pixel-icon-sm" alt="" /> Phát Tờ Rơi Tuyển Dụng</span>
          <span class="gacha-btn-cost">${GACHA_PRICES.SINGLE_ROLL.toLocaleString('vi-VN')}đ</span>
          <span class="gacha-btn-tag" style="background:#0284c7">Ra 3 Ứng Viên · Chọn 1</span>
        </button>

        <button id="btn-gacha-ten" class="btn-gacha-roll btn-gacha-ten" ${state.money < GACHA_PRICES.TEN_ROLL || full ? 'disabled' : ''}>
          <span class="gacha-btn-name"><img src="${ASSETS.icons.trophy}" class="btn-pixel-icon-sm" alt="" /> Đăng Tin Sàn Lớn x10</span>
          <span class="gacha-btn-cost">${GACHA_PRICES.TEN_ROLL.toLocaleString('vi-VN')}đ (-10%)</span>
          <span class="gacha-btn-tag">Cam Kết 1 SR+ · Chọn 1</span>
        </button>
      </div>

      ${isChapter1 ? `<div style="color: #fef08a; font-size: 0.72rem; font-weight: 700; text-align: center; margin-top: 8px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;"><img src="${ASSETS.icons.scooter}" class="btn-pixel-icon-xs" alt="" /> <b>Xe Đẩy Chương 1:</b> Tối đa 1 bạn phụ việc. Đạt Chương 2 để mở rộng tới 4 nhân sự!</div>` : ''}
      ${full ? '<div style="color: #f87171; font-size: 0.72rem; font-weight: 750; text-align: center; margin-top: 8px;">⚠️ Tiệm đã đủ nhân viên tối đa! Hãy cho nghỉ bớt trước khi chiêu mộ thêm.</div>' : ''}
    </div>

    <!-- DANH SÁCH ĐỘI NGŨ NHÂN VIÊN HIỆN CÓ -->
    <div class="sec-title">
      <span>👥 Đội Ngũ Nhân Viên Hiện Tại (${state.staff.length}/${cap} người)</span>
    </div>
    <div class="sec-desc">
      Lương tự động thanh toán cuối mỗi ngày. Nhân viên có độ lười và tỷ lệ làm sai riêng tùy theo độ hiếm. Thưởng nóng để tăng lại tâm trạng khi mệt mỏi.
    </div>
    
    <div class="staff-roster">
      ${state.staff.length > 0 ? staffRows : '<div class="staff-empty-hint">Tiệm chưa có nhân viên nào. Hãy phát tờ rơi hoặc đăng tin ở trên để chiêu mộ nhân tài!</div>'}
    </div>
  `;
}

export function bindStaffEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void
) {
  // Nút Roll Gacha 1 (Phát tờ rơi tuyển dụng - 40k)
  const singleRollBtn = document.getElementById('btn-gacha-single');
  if (singleRollBtn) {
    singleRollBtn.onclick = () => {
      const rollRes = performGachaRollSingle(state);
      if (!rollRes.success || !rollRes.result) {
        showToast(rollRes.error || 'Không thể tuyển dụng lúc này!');
        return;
      }

      onUpdateState(draft => {
        draft.money = state.money;
        draft.staffGachaPity = state.staffGachaPity;
        draft.staffGachaSsrPity = state.staffGachaSsrPity;
        draft.staffGachaTotalRolls = state.staffGachaTotalRolls;
      });

      openGachaResultModal(
        rollRes.result,
        state,
        onUpdateState,
        showToast,
        () => {
          // Re-render view
          const staffContainer = document.querySelector('.pane, .staff-screen, #tab-staff-content, .tab-pane.active');
          if (staffContainer) {
            staffContainer.innerHTML = renderStaffTab(state);
            bindStaffEvents(state, onUpdateState, showToast);
          }
        }
      );
    };
  }

  // Nút Roll Gacha 10 (Đăng tin sàn tuyển dụng lớn - 360k)
  const tenRollBtn = document.getElementById('btn-gacha-ten');
  if (tenRollBtn) {
    tenRollBtn.onclick = () => {
      const rollRes = performGachaRollTen(state);
      if (!rollRes.success || !rollRes.result) {
        showToast(rollRes.error || 'Không thể đăng tin tuyển dụng lớn lúc này!');
        return;
      }

      onUpdateState(draft => {
        draft.money = state.money;
        draft.staffGachaPity = state.staffGachaPity;
        draft.staffGachaSsrPity = state.staffGachaSsrPity;
        draft.staffGachaTotalRolls = state.staffGachaTotalRolls;
      });

      openGachaResultModal(
        rollRes.result,
        state,
        onUpdateState,
        showToast,
        () => {
          const staffContainer = document.querySelector('.pane, .staff-screen, #tab-staff-content, .tab-pane.active');
          if (staffContainer) {
            staffContainer.innerHTML = renderStaffTab(state);
            bindStaffEvents(state, onUpdateState, showToast);
          }
        }
      );
    };
  }

  // Nút Thưởng nhân viên
  const bonusBtns = document.querySelectorAll('.btn-bonus');
  bonusBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      if (state.money < 50000) {
        showToast('Không đủ 50.000đ để thưởng nóng!');
        return;
      }
      const member = state.staff[idx];
      if (!member) return;
      onUpdateState(draft => {
        const target = draft.staff[idx];
        if (!target) return;
        draft.money -= 50000;
        target.mood = Math.min(100, target.mood + 25);
      });
      audio.playCash();
      showToast(`Đã thưởng nóng 50.000đ cho ${member.name}! Nhân viên cực kỳ hào hứng! 🥰`);
    });
  });

  // Nút Cho nghỉ: trả thêm 1 ngày lương
  document.querySelectorAll('.btn-fire').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      const member = state.staff[idx];
      if (!member) return;
      const pay = severancePay(member);
      if (state.money < pay) {
        showToast(`Cần ${pay.toLocaleString('vi-VN')}đ trợ cấp mới cho ${member.name} nghỉ được!`);
        return;
      }
      if (!confirm(`Cho ${member.name} nghỉ việc? Trả trợ cấp thôi việc ${pay.toLocaleString('vi-VN')}đ.`)) return;
      onUpdateState(draft => {
        const i = draft.staff.findIndex(m => m.id === member.id);
        if (i < 0) return;
        draft.staff.splice(i, 1);
        draft.money -= pay;
      });
      audio.playPop();
      showToast(`${member.name} đã nghỉ việc. Chúc bạn ấy may mắn! 👋`);
    });
  });
}
