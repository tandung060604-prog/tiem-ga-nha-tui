import { CHANGELOG_DATA, CURRENT_GAME_VERSION, CURRENT_VERSION_CODENAME, CURRENT_BUILD_DATE } from '../../content/changelog';
import { escapeHtml } from '../escapeHtml';

export function renderUpdateDashboardModal(): string {
  const currentRelease = CHANGELOG_DATA[0]!;

  const metricsHtml = currentRelease.metrics.map(m => `
    <div class="dash-metric-card">
      <div class="dash-metric-icon">${m.icon}</div>
      <div class="dash-metric-val">${escapeHtml(m.value)}</div>
      <div class="dash-metric-lbl">${escapeHtml(m.label)}</div>
    </div>
  `).join('');

  const categoriesHtml = currentRelease.categories.map(cat => {
    const itemsHtml = cat.items.map(item => `
      <div class="dash-item-box">
        <div class="dash-item-header">
          <span class="dash-item-tag" style="background: ${item.tagColor};">${escapeHtml(item.tag)}</span>
          <h4 class="dash-item-title">${escapeHtml(item.title)}</h4>
        </div>
        <p class="dash-item-desc">${escapeHtml(item.desc)}</p>
        ${(item.details && item.details.length > 0) ? `
          <ul class="dash-item-bullets">
            ${item.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    return `
      <section class="dash-category-sec">
        <div class="dash-category-title">
          <span class="dash-cat-icon">${cat.categoryIcon}</span>
          <span>${escapeHtml(cat.categoryName)}</span>
        </div>
        <div class="dash-category-items">
          ${itemsHtml}
        </div>
      </section>
    `;
  }).join('');

  return `
    <div id="update-dashboard-modal" class="update-dashboard-card">
      <!-- Top Bulletin Ribbon -->
      <div class="dash-header">
        <div class="dash-brand-row">
          <div class="dash-badge-gold">
            <span class="sparkle">✨</span>
            <span class="dash-ver-text">${CURRENT_GAME_VERSION}</span>
            <span class="sparkle">✨</span>
          </div>
          <span class="dash-date-pill">Phát hành: ${CURRENT_BUILD_DATE}</span>
          <button id="btn-close-dashboard-top" class="dash-close-x" aria-label="Đóng">✕</button>
        </div>
        
        <h2 class="dash-main-title">🍗 BẢNG TIN TIỆM GÀ NHÀ TUI</h2>
        <div class="dash-codename">${CURRENT_VERSION_CODENAME}</div>
        <p class="dash-summary-lead">${escapeHtml(currentRelease.highlightSummary)}</p>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="dash-metrics-grid">
        ${metricsHtml}
      </div>

      <!-- Scrollable Changelog Content -->
      <div class="dash-scroll-body">
        ${categoriesHtml}
      </div>

      <!-- Bottom Action Bar (Golden Thumb Zone) -->
      <div class="dash-footer">
        <button id="btn-close-dashboard-cta" class="dash-cta-btn">
          <span class="cta-sparkle">🍗</span>
          <span class="cta-text">ĐÃ HIỂU! VÀO TIỆM BÁN GÀ NGAY</span>
          <span class="cta-sparkle">🍗</span>
        </button>
      </div>
    </div>
  `;
}
