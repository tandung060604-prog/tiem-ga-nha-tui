import { GameState } from '../../types/game';
import { audio } from '../../core/audio';
import { escapeHtml } from '../escapeHtml';
import { ASSETS } from '../../content/assets';
import { getActiveShopTheme } from '../../content/shopThemes';

export function renderHeader(state: GameState, _onOpenSettings?: () => void): string {
  const phaseLabel = state.phase === 'prep' ? 'Chuẩn bị' : state.phase === 'selling' ? 'Mở bán' : 'Tổng kết';
  const soundIcon = audio.getMuted() ? ASSETS.icons.soundOff : ASSETS.icons.soundOn;
  const theme = getActiveShopTheme(state);

  // Format VNĐ e.g. 850.000đ
  const formattedMoney = state.money.toLocaleString('vi-VN') + 'đ';
  const reviewCount = state.totalReviewsCount ?? state.recentReviews.length;

  return `
    <div class="h-l">
      <button id="btn-header-drawer" class="h-btn btn-drawer-toggle" aria-label="Menu Tiệm" title="Danh mục chức năng quán">
        <span class="drawer-burger-icon">☰</span>
      </button>
      <button id="btn-audio-toggle" class="h-btn" aria-label="Âm thanh" title="Bật/Tắt âm thanh">
        <img src="${soundIcon}" class="h-pixel-icon" alt="Âm thanh" />
      </button>
      <div class="h-day-box">
        <b>Ngày ${state.day}</b>
        <small>${phaseLabel}</small>
      </div>

      <!-- Quick Utilities Dropdown Drawer -->
      <div id="header-quick-drawer" class="header-drawer-popover" style="display: none;">
        <div class="drawer-header-bar">
          <span class="drawer-title">📜 TIỆN ÍCH HẺM 1102</span>
          <button id="btn-close-header-drawer" class="drawer-close-btn" aria-label="Đóng">✕</button>
        </div>
        <div class="drawer-items-list">
          <button id="btn-settings-toggle" class="drawer-action-btn" title="Cài đặt tiệm">
            <img src="${ASSETS.icons.settings}" class="drawer-icon-img" alt="" />
            <span class="drawer-label">Cài đặt tiệm</span>
          </button>
          <button id="btn-leaderboard-toggle" class="drawer-action-btn" title="Bảng xếp hạng Đua Top 4 Tiệm Gà">
            <span class="drawer-icon-emoji">🏆</span>
            <span class="drawer-label">Đua Top 4 Máy</span>
          </button>
          <button id="btn-changelog-toggle" class="drawer-action-btn" title="Xem bản cập nhật">
            <img src="${ASSETS.icons.book}" class="drawer-icon-img" alt="" />
            <span class="drawer-label">Bản tin cập nhật</span>
          </button>
          <button id="btn-bacba-manual" class="drawer-action-btn" title="Cẩm nang Bác Ba (Cách chơi)">
            <img src="${ASSETS.bacba.front}" class="drawer-icon-img avatar" alt="" />
            <span class="drawer-label">Cẩm nang Bác Ba</span>
          </button>
        </div>
      </div>
    </div>

    <div class="h-m">
      <span class="store-badge" title="${escapeHtml(theme.signboardTitle)} • ${escapeHtml(theme.signboardSubtitle)}">
        <img class="store-logo-badge" src="${ASSETS.ui.logoKoreanChicken}" alt="Logo" />
        <span class="store-name-text">${theme.id !== 'default' ? `${theme.icon} ` : ''}${escapeHtml(state.shopName)}</span>
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
  onOpenChangelog?: () => void,
  onOpenBacBaManual?: () => void,
  onOpenLeaderboard?: () => void
) {
  const drawerBtn = document.getElementById('btn-header-drawer');
  const drawer = document.getElementById('header-quick-drawer');
  const closeDrawerBtn = document.getElementById('btn-close-header-drawer');

  const closeDrawer = () => {
    if (drawer) drawer.style.display = 'none';
  };

  if (drawerBtn && drawer) {
    drawerBtn.onclick = (e) => {
      e.stopPropagation();
      audio.playPop();
      const isOpen = drawer.style.display !== 'none';
      drawer.style.display = isOpen ? 'none' : 'block';
    };
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.onclick = (e) => {
      e.stopPropagation();
      audio.playPop();
      closeDrawer();
    };
  }

  // Click outside closes drawer
  document.addEventListener('click', (e) => {
    if (drawer && drawer.style.display !== 'none') {
      const target = e.target as HTMLElement;
      if (!target.closest('#header-quick-drawer') && !target.closest('#btn-header-drawer')) {
        closeDrawer();
      }
    }
  });

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
      closeDrawer();
      audio.playPop();
      onOpenSettings();
    };
  }

  const leaderboardBtn = document.getElementById('btn-leaderboard-toggle');
  if (leaderboardBtn && onOpenLeaderboard) {
    leaderboardBtn.onclick = () => {
      closeDrawer();
      audio.playPop();
      onOpenLeaderboard();
    };
  }

  const changelogBtn = document.getElementById('btn-changelog-toggle');
  if (changelogBtn && onOpenChangelog) {
    changelogBtn.onclick = () => {
      closeDrawer();
      audio.playPop();
      onOpenChangelog();
    };
  }

  const bacbaBtn = document.getElementById('btn-bacba-manual');
  if (bacbaBtn && onOpenBacBaManual) {
    bacbaBtn.onclick = () => {
      closeDrawer();
      audio.playPop();
      onOpenBacBaManual();
    };
  }
}
