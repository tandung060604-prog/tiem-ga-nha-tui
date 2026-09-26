import { GameState } from '../../types/game';
import { STAFF_ROLES_INFO, STAFF_TRAITS, generateCandidate } from '../../content/staff';
import { audio } from '../../core/audio';
import { describeStaffEffect, maxStaff, severancePay } from '../../core/staff';

export function renderStaffTab(state: GameState): string {
  // Nếu ở Chương 1: Báo mở khóa ở Chương 2
  if (state.currentChapter < 2) {
    return `
      <div style="text-align: center; padding: 30px 10px; color: var(--soft);">
        <div style="font-size: 3rem; margin-bottom: 10px;">🛵</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--ink);">Chương 1: Tự Thân Vận Động!</div>
        <p style="font-size: 0.85rem; margin-top: 6px; line-height: 1.4;">
          Ở giai đoạn xe đẩy đầu hẻm, bạn tự tay nhận order và chiên gà. <br/>
          <b>Hệ thống Nhân viên & Lương</b> sẽ mở khóa khi bạn đạt <b>Chương 2: Tiệm Trong Hẻm</b> (Gom đủ 5.000.000đ)!
        </p>
      </div>
    `;
  }

  // Danh sách nhân viên đang làm việc
  const staffRows = state.staff.map((member, idx) => {
    const roleInfo = STAFF_ROLES_INFO[member.role];
    const traitInfo = STAFF_TRAITS.find(t => member.traits.includes(t.id));

    return `
      <div class="item-row" data-staff-id="${member.id}">
        <div class="item-icon">${member.avatar}</div>

        <div class="item-meta">
          <div class="item-name">
            ${member.name}
            <span class="shelf-tag" style="background:#eafaf1;color:#27ae60;">${roleInfo.name}</span>
          </div>
          <div class="item-sub">
            Lương: <b>${member.hourlyWage.toLocaleString('vi-VN')}đ/h</b> · Tâm trạng: ${member.mood}%
          </div>
          <div style="font-size: 0.72rem; color: var(--soft); margin-top: 2px;">
            Tốc độ: <b>${member.speed}</b> | Tay nghề: <b>${member.skill}</b> | Thái độ: <b>${member.attitude}</b>
          </div>
          <div class="staff-effect" style="font-size: 0.72rem; color: #27ae60; font-weight: 700; margin-top: 2px;">⚙️ ${describeStaffEffect(member, state.staff)}</div>
          ${traitInfo ? `<div style="font-size: 0.7rem; color: #8e44ad; font-weight: 700; margin-top: 1px;">✨ ${traitInfo.name}: ${traitInfo.desc}</div>` : ''}
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

  // Danh sách ứng viên đang tuyển
  const cap = maxStaff(state.currentChapter);
  const full = state.staff.length >= cap;
  const candidateRows = state.candidates.map((cand, idx) => {
    const roleInfo = STAFF_ROLES_INFO[cand.role];
    const traitInfo = STAFF_TRAITS.find(t => cand.traits.includes(t.id));

    return `
      <div class="item-row" style="background: #faf4ea; border-radius: 10px; margin-bottom: 6px; padding: 8px;">
        <div class="item-icon">${cand.avatar}</div>

        <div class="item-meta">
          <div class="item-name">
            ${cand.name}
            <span class="shelf-tag">${roleInfo.name}</span>
          </div>
          <div class="item-sub">
            Lương đề xuất: <b>${cand.hourlyWage.toLocaleString('vi-VN')}đ/h</b>
          </div>
          <div style="font-size: 0.72rem; color: var(--soft);">
            Tốc độ: <b>${cand.speed}</b> · Tay nghề: <b>${cand.skill}</b> · Thái độ: <b>${cand.attitude}</b>
          </div>
          <div class="staff-effect" style="font-size: 0.72rem; color: #27ae60; font-weight: 700;">⚙️ ${describeStaffEffect(cand, state.staff)}</div>
          ${traitInfo ? `<div style="font-size: 0.7rem; color: #8e44ad; font-weight: 700;">✨ ${traitInfo.name}</div>` : ''}
        </div>

        <div>
          <button class="btn-sm primary btn-hire" data-index="${idx}" ${full ? 'disabled' : ''}>
            Tuyển Dụng
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="sec-title">
      <span>👥 Đội Ngũ Nhân Viên (${state.staff.length}/${cap} người)</span>
    </div>
    <div class="sec-desc">
      Lương trả cuối mỗi ngày (ca 8 tiếng). Tâm trạng giảm dần sau mỗi ca: nhân viên buồn làm việc kém hơn, thưởng nóng để vui lại.${full ? ' <b>Quán đã đủ chỗ</b> — lên chương để có thêm chỗ.' : ''}
    </div>
    
    <div class="staff-roster" style="margin-bottom: 16px;">
      ${state.staff.length > 0 ? staffRows : '<div style="font-size: 0.82rem; color: var(--soft); text-align: center; padding: 12px;">Chưa có nhân viên nào. Hãy tuyển dụng ở danh sách bên dưới!</div>'}
    </div>

    <div class="sec-title" style="margin-top: 14px; border-top: 1px solid var(--line); padding-top: 10px;">
      <span>📝 Nhóm Tìm Việc (Ứng Viên Mới)</span>
      <button id="btn-refresh-candidates" class="btn-sm" style="font-size: 0.7rem;">Đăng tin mới (50k)</button>
    </div>
    <div class="candidates-list">
      ${candidateRows}
    </div>
  `;
}

export function bindStaffEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void
) {
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
      if (!confirm(`Cho ${member.name} nghỉ việc? Trả trợ cấp ${pay.toLocaleString('vi-VN')}đ.`)) return;
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

  // Nút Tuyển dụng
  const hireBtns = document.querySelectorAll('.btn-hire');
  hireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      const candidate = state.candidates[idx];
      if (!candidate) return;
      if (state.staff.length >= maxStaff(state.currentChapter)) {
        showToast('Quán chật rồi, không còn chỗ cho thêm người! Lên chương để mở rộng.');
        return;
      }

      onUpdateState(draft => {
        draft.staff.push(candidate);
        draft.candidates.splice(idx, 1);
        // Bổ sung ứng viên mới
        draft.candidates.push(generateCandidate(draft.currentChapter));
      });
      audio.playPerfect();
      showToast(`Chúc mừng! ${candidate.name} đã chính thức gia nhập Tiệm Gà Nhà Tui! 🎉`);
    });
  });

  // Nút Đăng tin tìm việc mới
  const refreshBtn = document.getElementById('btn-refresh-candidates');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      if (state.money < 50000) {
        showToast('Không đủ 50.000đ để đăng tin tuyển dụng!');
        return;
      }
      onUpdateState(draft => {
        draft.money -= 50000;
        draft.candidates = [
          generateCandidate(draft.currentChapter),
          generateCandidate(draft.currentChapter),
          generateCandidate(draft.currentChapter)
        ];
      });
      audio.playCash();
      showToast('Đã đăng tin tuyển dụng mới lên các nhóm tìm việc! 📄');
    };
  }
}
