import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { escapeHtml } from '../escapeHtml';
import { ASSETS } from '../../content/assets';

export function renderHeader(state: GameState, _onOpenSettings?: () => void): string {
  const phaseLabel = state.phase === 'prep' ? 'Chuẩn bị' : state.phase === 'selling' ? 'Mở bán' : 'Tổng kết';
  const soundIcon = audio.getMuted() ? ASSETS.icons.soundOff : ASSETS.icons.soundOn;

  // Format VNĐ e.g. 850.000đ
  const formattedMoney = state.money.toLocaleString('vi-VN') + 'đ';

  const reviewCount = state.totalReviewsCount ?? state.recentReviews.length;

  return `
    <div class="h-l">
      <button id="btn-audio-toggle" class="h-btn" aria-label="Âm thanh" title="Bật/Tắt âm thanh">
        <img src="${soundIcon}" class="h-pixel-icon" alt="Âm thanh" />
      </button>
      <button id="btn-settings-toggle" class="h-btn" aria-label="Cài đặt" title="Cài đặt tiệm">
        <img src="${ASSETS.icons.settings}" class="h-pixel-icon" alt="Cài đặt" />
      </button>
      <button id="btn-changelog-toggle" class="h-btn" aria-label="Bảng tin" title="Xem bản cập nhật">
        <img src="${ASSETS.icons.book}" class="h-pixel-icon" alt="Bảng tin" />
      </button>
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
      <span class="money">
        <img src="${ASSETS.icons.money}" class="h-pixel-coin" alt="Tiền" />
        ${formattedMoney}
      </span>
    </div>

    <div class="h-r">
      <span class="stars">
        <img src="${ASSETS.icons.star}" class="h-pixel-star" alt="Sao" />
        <b>${state.ratings.overall.toFixed(1)}★</b>
      </span>
      <small>${reviewCount} lượt</small>
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
