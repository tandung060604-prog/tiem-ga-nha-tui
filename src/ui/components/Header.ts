import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { escapeHtml } from '../escapeHtml';
import { ASSETS } from '../../content/assets';

export function renderHeader(state: GameState, _onOpenSettings?: () => void): string {
  const phaseLabel = state.phase === 'prep' ? 'Chuẩn bị' : state.phase === 'selling' ? 'Mở bán' : 'Tổng kết';
  const soundIcon = audio.getMuted() ? '🔇' : '🔊';

  // Format VNĐ e.g. 850.000đ
  const formattedMoney = state.money.toLocaleString('vi-VN') + 'đ';

  // Stars representation
  const starCount = Math.round(state.ratings.overall);
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    starsHtml += i <= starCount ? '★' : '☆';
  }

  const reviewCount = state.totalReviewsCount ?? state.recentReviews.length;

  return `
    <div class="h-l">
      <button id="btn-audio-toggle" class="h-btn" aria-label="Âm thanh" title="Bật/Tắt âm thanh">${soundIcon}</button>
      <button id="btn-settings-toggle" class="h-btn" aria-label="Cài đặt" title="Cài đặt tiệm">⚙️</button>
      <button id="btn-changelog-toggle" class="h-btn" aria-label="Bảng tin" title="Xem bản cập nhật v2.1.0">📜</button>
      <div class="h-day-box">
        <b>Ngày ${state.day}</b>
        <small>${phaseLabel}</small>
      </div>
    </div>

    <div class="h-m">
      <span class="store-badge">
        <img class="store-logo-badge" src="${ASSETS.ui.logoKoreanChicken}" alt="Logo" />
        <span class="store-name-text">${escapeHtml(state.shopName)}</span>
      </span>
      <span class="money">${formattedMoney}</span>
    </div>

    <div class="h-r">
      <span class="stars">${starsHtml}</span>
      <small><b>${state.ratings.overall.toFixed(1)}★</b> · ${reviewCount} lượt</small>
    </div>
  `;
}

export function bindHeaderEvents(
  _state: GameState, 
  onRefresh: () => void, 
  onOpenSettings: () => void,
  onOpenChangelog?: () => void
) {
  const audioBtn = document.getElementById('btn-audio-toggle');
  if (audioBtn) {
    audioBtn.onclick = () => {
      audio.toggleMute();
      onRefresh();
    };
  }

  const settingsBtn = document.getElementById('btn-settings-toggle');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      audio.playPop();
      onOpenSettings();
    };
  }

  const changelogBtn = document.getElementById('btn-changelog-toggle');
  if (changelogBtn && onOpenChangelog) {
    changelogBtn.onclick = () => {
      audio.playPop();
      onOpenChangelog();
    };
  }
}
