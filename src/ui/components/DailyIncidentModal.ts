import { DailyIncident, GameState, IncidentChoice, StaffRole } from '../../types/game';
import { hasSecurityStaff, hasStaffRole } from '../../core/dailyIncidentsEngine';

const ROLE_LABELS: Record<StaffRole, { name: string; icon: string }> = {
  cashier: { name: 'Thu Ngân', icon: '💁' },
  cook: { name: 'Phụ Bếp', icon: '👨‍🍳' },
  waiter: { name: 'Phục Vụ', icon: '🧹' },
  delivery: { name: 'Shipper', icon: '🛵' },
  manager: { name: 'Quản Lý', icon: '👔' },
  security: { name: 'Bảo Vệ', icon: '👮' }
};

export function renderIncidentPrompt(
  incident: DailyIncident,
  state: GameState
): string {
  const hasSec = hasSecurityStaff(state);

  const choicesHtml = incident.choices.map((choice: IncidentChoice) => {
    const isSecOnly = choice.requiresSecurity === true || choice.requiresRole === 'security';
    const hasRequiredRole = choice.requiresRole ? hasStaffRole(state, choice.requiresRole) : true;
    const canChoose = (!choice.requiresSecurity || hasSec) && hasRequiredRole;

    // Nút sự kiện: Các lựa chọn bình thường có màu sắc đồng đều, trung lập (btn-neutral-choice)
    let btnThemeClass = 'btn-neutral-choice';
    if (isSecOnly || choice.requiresRole) {
      btnThemeClass = canChoose ? 'btn-security-choice' : 'btn-locked-choice';
    }

    // Xử lý dòng phụ (Tier 2) giải thích tình thế / hệ quả / may rủi
    let subText = choice.subDesc || choice.kicker || '';
    if (isSecOnly) {
      if (!hasSec) {
        subText = '🔒 Cần tuyển Chú Tư Giữ Xe tại tab Nhân viên mới xài được nè';
      } else if (!subText.includes('Bảo Vệ') && !subText.includes('Chú Tư')) {
        subText = `👮 Có Chú Tư Bảo Vệ canh chừng: 100% bình yên`;
      }
    } else if (choice.requiresRole) {
      const rInfo = ROLE_LABELS[choice.requiresRole];
      if (!hasRequiredRole) {
        subText = choice.requiresRoleDesc || `🔒 Cần tuyển ${rInfo?.name ?? 'Nhân Viên'} tại tab Nhân viên mới kích hoạt được`;
      } else if (!subText.includes(rInfo?.name ?? '')) {
        subText = `${rInfo?.icon ?? '✨'} Có ${rInfo?.name ?? 'Nhân Viên'} chuyên trách giải quyết: 100% an tâm`;
      }
    } else if (choice.mitigatedByRoles && choice.mitigatedByRoles.length > 0) {
      const activeMitigator = choice.mitigatedByRoles.find(r => hasStaffRole(state, r));
      if (activeMitigator) {
        const rInfo = ROLE_LABELS[activeMitigator];
        subText = `🛡️ Có ${rInfo?.name ?? 'Nhân Viên'} hỗ trợ: 100% hóa giải rủi ro!`;
      } else if (choice.riskRate && choice.riskRate > 0 && !subText.toLowerCase().includes('hên xui')) {
        subText = `hên xui: ${subText}`;
      }
    } else if (choice.riskRate && choice.riskRate > 0) {
      if (!subText.toLowerCase().includes('hên xui')) {
        subText = `hên xui: ${subText}`;
      }
    }

    return `
      <button 
        class="incident-choice-btn ${btnThemeClass} ${canChoose ? '' : 'is-disabled'}" 
        data-choice-id="${choice.id}"
        ${canChoose ? '' : 'disabled'}
      >
        <div class="choice-tier1">${choice.label}</div>
        ${subText ? `<div class="choice-tier2">${subText}</div>` : ''}
      </button>
    `;
  }).join('');

  const categoryTag = incident.categoryTag 
    ?? (incident.characterRole ? incident.characterRole.toUpperCase() : 'SỰ KIỆN HẺM 1102');

  const emoteBubble = incident.emoteBubble ?? '❤️';

  return `
    <div class="incident-dialog">
      <!-- 1. Avatar tròn chibi trên đỉnh kèm tim bay bổng -->
      <div class="incident-avatar-wrap">
        <div class="incident-chibi-circle">
          ${incident.characterImg 
            ? `<img src="${incident.characterImg}" class="chibi-avatar-img" alt="${incident.characterName}" />`
            : `<div class="chibi-avatar-emoji">${incident.characterAvatar || incident.icon}</div>`}
        </div>
        <div class="incident-heart-badge" title="Tâm trạng hẻm phố">${emoteBubble}</div>
      </div>

      <!-- 2. Tag Pill phân loại đỏ cam nổi bật -->
      <div class="incident-pill-badge">${categoryTag}</div>

      <!-- 3. Tiêu đề đậm, tròn trịa, to bản -->
      <h2 class="incident-main-title">${incident.title}</h2>

      <!-- Nhân vật & vai trò -->
      <div class="incident-char-subtitle">
        <span class="char-role-dot">●</span> <b>${incident.characterName}</b> · ${incident.characterRole}
      </div>

      <!-- 4. Lời dẫn dí dỏm, chân thực đời thường -->
      <div class="incident-story-box">
        <p class="incident-story-desc">${incident.context}</p>
        ${incident.dialogue ? `
          <div class="incident-quote-card">
            <span class="quote-mark">“</span>
            <span class="quote-body">${incident.dialogue}</span>
            <span class="quote-mark">”</span>
          </div>
        ` : ''}
      </div>

      ${!hasSec && incident.isSecurityRisk ? `
        <div class="incident-security-tip">
          💡 <i>Mẹo nè: Quán chưa có Bảo Vệ! Dzô tab <b>Nhân viên</b> tuyển Chú Tư Giữ Xe để hóa giải 100% trộm cắp với quỵt tiền nha.</i>
        </div>
      ` : ''}

      <!-- 5. Danh sách các nút lựa chọn 2 tầng chữ phong cách Mì Cay Bà Tám -->
      <div class="incident-choices-list">
        ${choicesHtml}
      </div>
    </div>
  `;
}

export function renderIncidentConfirmPrompt(
  _incident: DailyIncident,
  choice: IncidentChoice
): string {
  const subText = choice.subDesc || choice.kicker || '';

  return `
    <div class="incident-dialog incident-confirm-box">
      <!-- Avatar tròn Bác Ba ân cần nhắc nhở -->
      <div class="incident-avatar-wrap">
        <div class="incident-chibi-circle" style="background: #fef3c7; border: 3px solid #f59e0b;">
          <div class="chibi-avatar-emoji" style="font-size: 2.2rem;">👨‍🦳</div>
        </div>
        <div class="incident-heart-badge" title="Bác Ba hỏi lại">❓</div>
      </div>

      <!-- Tag Pill Bác Ba -->
      <div class="incident-pill-badge" style="background: #f59e0b; color: #fff;">BÁC BA HỎI LẠI</div>

      <h2 class="incident-main-title" style="margin-top: 6px;">Chắc chưa con? Nghĩ kỹ nghen!</h2>

      <div class="incident-char-subtitle">
        <span class="char-role-dot" style="color: #f59e0b;">●</span> <b>Bác Ba</b> · Cố Vấn Tiệm Gà
      </div>

      <!-- Lời Bác Ba miền Tây ân cần -->
      <div class="incident-story-box" style="text-align: center; margin: 10px 0;">
        <p class="incident-story-desc" style="font-size: 0.94rem; color: #431407; line-height: 1.45;">
          Ủa con, tính chọn phương án này thiệt hả bây? Mọi chuyện trong Hẻm 1102 đồn lẹ lắm đó nghen, liệu đường tính toán chưa con?
        </p>

        <!-- Thẻ tóm tắt lựa chọn đang được cân nhắc -->
        <div class="chosen-preview-card" style="margin: 12px 0 6px; padding: 12px 14px; background: #fffcf8; border: 1.5px dashed #f59e0b; border-radius: 12px; text-align: left; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);">
          <div style="font-size: 0.72rem; color: #b45309; font-weight: 800; text-transform: uppercase;">👉 Phương án con vừa chọn:</div>
          <div style="font-weight: 800; font-size: 0.98rem; color: #78350f; margin-top: 2px;">${choice.label}</div>
          ${subText ? `
            <div style="font-size: 0.8rem; color: #92400e; margin-top: 3px; font-style: italic;">
              ${subText}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- 2 Nút Xác nhận / Nghĩ lại -->
      <div class="incident-confirm-actions" style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 6px;">
        <button id="btn-incident-confirm-yes" class="btn-big-open" style="background: linear-gradient(180deg, #10b981 0%, #059669 100%); color: #fff; font-weight: 800; border: none; padding: 12px 16px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); font-size: 0.95rem; cursor: pointer;">
          ✅ Dạ chắc rồi Bác Ba, con quyết định vậy nè!
        </button>
        <button id="btn-incident-confirm-no" class="btn-sm" style="background: #fff; color: #4b5563; font-weight: 700; border: 1.5px solid #d1d5db; padding: 10px 14px; border-radius: 12px; font-size: 0.88rem; cursor: pointer;">
          ↩️ Khoan Bác ơi, để con suy nghĩ lại chút nghen!
        </button>
      </div>
    </div>
  `;
}

export function renderIncidentReaction(
  reactionTitle: string,
  reactionNarrative: string,
  succeeded: boolean,
  moneyDelta: number
): string {
  const vnd = (n: number) => Math.abs(n).toLocaleString('vi-VN') + 'đ';

  return `
    <div class="incident-reaction-dialog">
      <!-- Avatar tròn kết quả -->
      <div class="incident-avatar-wrap">
        <div class="reaction-result-circle ${succeeded ? 'success' : 'failure'}">
          ${succeeded ? '✨' : '⚠️'}
        </div>
        <div class="incident-heart-badge">${succeeded ? '🎉' : '💸'}</div>
      </div>

      <div class="incident-pill-badge ${succeeded ? 'pill-success' : 'pill-failure'}">
        ${succeeded ? 'KẾT QUẢ TỐT LÀNH' : 'BÀI HỌC KINH DOANH'}
      </div>

      <h2 class="incident-main-title">${reactionTitle}</h2>
      
      <div class="reaction-narrative-box">
        <p class="reaction-text">${reactionNarrative}</p>
      </div>

      ${moneyDelta !== 0 ? `
        <div class="reaction-money-chip ${moneyDelta > 0 ? 'gain' : 'loss'}">
          ${moneyDelta > 0 ? `💵 Được nhận: +${vnd(moneyDelta)}` : `💸 Thiệt hại: -${vnd(moneyDelta)}`}
        </div>
      ` : ''}

      <div class="reaction-secret-note">
        🌱 <i>Quyết định của bạn đã ghi dấu ấn vào linh hồn tiệm gà và sẽ quyết định đại kết cục sau này...</i>
      </div>

      <button id="btn-incident-continue" class="btn-big-open btn-reaction-continue">
        🍗 Tiếp tục công việc
      </button>
    </div>
  `;
}

import { DAILY_INCIDENTS } from '../../content/dailyIncidents';

export function renderIncidentAlbumModal(state: GameState): string {
  const seenSet = new Set(state.seenIncidentIds ?? []);
  const resolvedList = state.resolvedIncidents ?? [];
  const total = DAILY_INCIDENTS.length;
  const unlockedCount = seenSet.size;
  const progressPct = Math.round((unlockedCount / total) * 100);

  const cardsHtml = DAILY_INCIDENTS.map((inc, index) => {
    const isUnlocked = seenSet.has(inc.id);
    const resolved = resolvedList.find(r => r.incidentId === inc.id);

    if (isUnlocked) {
      return `
        <div class="album-incident-card is-unlocked">
          <div class="card-top-row">
            <span class="card-order-badge">#${index + 1}</span>
            <span class="card-status-tag unlocked">✨ ĐÃ KHÁM PHÁ</span>
            <span class="card-chapter-tag">Chương ${inc.minChapter ?? 1}</span>
          </div>
          <div class="card-main">
            <div class="card-icon">${inc.icon}</div>
            <div class="card-details">
              <h3 class="card-title">${inc.title}</h3>
              <div class="card-char"><b>${inc.characterAvatar} ${inc.characterName}</b> · ${inc.characterRole}</div>
            </div>
          </div>
          <p class="card-quote">“${inc.dialogue.slice(0, 85)}${inc.dialogue.length > 85 ? '...' : ''}”</p>
          ${resolved ? `
            <div class="card-resolved-info">
              <span class="resolved-check">${resolved.succeeded ? '✅ Xử lý thành công' : '⚠️ Gặp rủi ro'}</span>
              <span class="resolved-day">Ngày ${resolved.day}</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Thẻ chưa mở khóa: Bí ẩn kích thích tò mò
    return `
      <div class="album-incident-card is-locked">
        <div class="card-top-row">
          <span class="card-order-badge">#${index + 1}</span>
          <span class="card-status-tag locked">🔒 CHƯA MỞ KHÓA</span>
          <span class="card-chapter-tag">Chương ${inc.minChapter ?? 1}</span>
        </div>
        <div class="card-main">
          <div class="card-icon locked-icon">❓</div>
          <div class="card-details">
            <h3 class="card-title locked-title">Tình Huống Bí Ẩn #${index + 1}</h3>
            <div class="card-hint">🎯 <i>${inc.unlockHint ?? 'Tiếp tục kinh doanh để mở khóa.'}</i></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="incidents-album-dialog">
      <div class="album-header">
        <div class="album-icon-badge">🎭</div>
        <div class="album-title-box">
          <span class="album-kicker">SỔ TAY TÌNH HUỐNG HẺM 1102</span>
          <h2 class="album-heading">Biên Niên Sử Thực Khách & Drama</h2>
        </div>
      </div>

      <div class="album-progress-box">
        <div class="album-progress-info">
          <span>Tiến độ khám phá: <b>${unlockedCount}/${total}</b> tình huống</span>
          <span class="progress-pct-val">${progressPct}%</span>
        </div>
        <div class="album-progress-bar">
          <div class="album-progress-fill" style="width: ${progressPct}%;"></div>
        </div>
        <div class="album-progress-sub">
          💡 <i>Các tình huống lớn (đối thủ phá hoại, gạ mua công thức, bẻ khóa xe...) sẽ dần mở khóa theo từng chương và cấp độ tiệm!</i>
        </div>
      </div>

      <div class="album-cards-scroll">
        ${cardsHtml}
      </div>

      <button id="btn-close-incidents-album" class="btn-big-open" style="width: 100%; min-height: 48px; margin-top: 10px;">
        Đóng sổ tay
      </button>
    </div>
  `;
}
