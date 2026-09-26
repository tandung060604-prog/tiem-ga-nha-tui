import { DailyIncident, GameState, IncidentChoice } from '../../types/game';
import { hasSecurityStaff } from '../../core/dailyIncidentsEngine';

export function renderIncidentPrompt(
  incident: DailyIncident,
  state: GameState
): string {
  const hasSec = hasSecurityStaff(state);

  const choicesHtml = incident.choices.map((choice: IncidentChoice) => {
    const isSecOnly = choice.requiresSecurity === true;
    const canChoose = !isSecOnly || hasSec;

    let badgeHtml = '';
    if (isSecOnly) {
      if (hasSec) {
        badgeHtml = `<span class="incident-badge sec-badge">👮 Chú Bảo Vệ Ra Tay</span>`;
      } else {
        badgeHtml = `<span class="incident-badge locked-badge">🔒 Cần Thuê Bảo Vệ</span>`;
      }
    } else if (choice.riskRate && choice.riskRate > 0) {
      badgeHtml = `<span class="incident-badge risk-badge">⚠️ Tùy May Rủi</span>`;
    }

    return `
      <button 
        class="incident-choice-btn ${canChoose ? '' : 'is-disabled'}" 
        data-choice-id="${choice.id}"
        ${canChoose ? '' : 'disabled'}
      >
        <div class="choice-header">
          ${choice.kicker ? `<span class="choice-kicker">${choice.kicker}</span>` : ''}
          ${badgeHtml}
        </div>
        <div class="choice-label">${choice.label}</div>
      </button>
    `;
  }).join('');

  return `
    <div class="incident-dialog">
      <div class="incident-header">
        <div class="incident-icon-bubble">${incident.icon}</div>
        <div class="incident-title-box">
          <span class="incident-kicker">⚡ SỰ KIỆN BẤT NGỜ · HẺM 1102</span>
          <h2 class="incident-title">${incident.title}</h2>
        </div>
      </div>

      <div class="incident-char-card">
        <div class="char-avatar">${incident.characterAvatar}</div>
        <div class="char-info">
          <div class="char-name">${incident.characterName}</div>
          <div class="char-role">${incident.characterRole}</div>
        </div>
      </div>

      <div class="incident-context-box">
        <p class="context-desc">${incident.context}</p>
        <div class="context-quote">
          <span class="quote-mark">“</span>
          <span class="quote-text">${incident.dialogue}</span>
          <span class="quote-mark">”</span>
        </div>
      </div>

      ${!hasSec && incident.isSecurityRisk ? `
        <div class="incident-security-tip">
          💡 <i>Mẹo: Quán chưa có nhân viên Bảo Vệ! Hãy vào tab <b>Nhân viên</b> tuyển Bảo Vệ để ngăn chặn 100% trộm cắp và quỵt tiền.</i>
        </div>
      ` : ''}

      <div class="incident-choices-list">
        <div class="choices-prompt-label">👉 Bạn quyết định xử lý ra sao?</div>
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
      <div class="reaction-icon-box ${succeeded ? 'success' : 'failure'}">
        ${succeeded ? '✨' : '⚠️'}
      </div>
      <h2 class="reaction-title">${reactionTitle}</h2>
      
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

      <button id="btn-incident-continue" class="btn-big-open" style="width: 100%; min-height: 50px; margin-top: 14px;">
        🍗 Tiếp tục công việc
      </button>
    </div>
  `;
}
