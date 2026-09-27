import { DailyIncident, GameState, IncidentChoice } from '../../types/game';
import { hasSecurityStaff } from '../../core/dailyIncidentsEngine';

export function renderIncidentPrompt(
  incident: DailyIncident,
  state: GameState
): string {
  const hasSec = hasSecurityStaff(state);

  const choicesHtml = incident.choices.map((choice: IncidentChoice, idx: number) => {
    const isSecOnly = choice.requiresSecurity === true;
    const canChoose = !isSecOnly || hasSec;

    // Xác định theme màu nút theo phong cách Mì Cay Bà Tám:
    // Nút 0: Đỏ cam rực rỡ (Coral Red)
    // Nút 1: Kem be sữa ấm áp (Warm Cream)
    // Nút Bảo Vệ: Xanh an ninh (Security Green)
    let btnThemeClass = idx === 0 ? 'btn-warm-choice' : 'btn-cream-choice';
    if (isSecOnly) {
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
