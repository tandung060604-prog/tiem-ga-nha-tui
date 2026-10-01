import { LeaderboardEntry } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { getInviteUrl, getQrCodeUrl } from '../../core/leaderboard';

const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return `<span style="font-size: 1.35rem; filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4));" title="Quán Quân">🥇</span>`;
    case 2:
      return `<span style="font-size: 1.25rem; filter: drop-shadow(0 2px 4px rgba(148, 163, 184, 0.4));" title="Á Quân">🥈</span>`;
    case 3:
      return `<span style="font-size: 1.15rem; filter: drop-shadow(0 2px 4px rgba(217, 119, 6, 0.4));" title="Quý Quân">🥉</span>`;
    default:
      return `<span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #e2e8f0; color: #475569; font-weight: 800; font-size: 0.85rem; border: 1px solid #cbd5e1;">${rank}</span>`;
  }
};

const getRankBg = (rank: number, isSelf: boolean) => {
  if (isSelf) return 'background: #fff8e1; border: 2px solid #f59e0b; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.25);';
  if (rank === 1) return 'background: #fffdf5; border: 2px solid #fbbf24; box-shadow: 0 2px 6px rgba(251, 191, 36, 0.2);';
  if (rank === 2) return 'background: #f8fafc; border: 1.5px solid #cbd5e1;';
  if (rank === 3) return 'background: #fdfbf7; border: 1.5px solid #d97706;';
  return 'background: #ffffff; border: 1px solid #e2e8f0;';
};

/**
 * Render danh sách 4 Slots cho Lobby (dùng cho cả lần đầu và khi Auto-Polling cập nhật mượt mà)
 */
export function renderLobbySlotsHtml(
  entries: LeaderboardEntry[],
  currentUserId?: string
): string {
  const slots: (LeaderboardEntry | null)[] = [null, null, null, null];
  for (let i = 0; i < 4; i++) {
    if (i < entries.length) {
      slots[i] = entries[i] ?? null;
    }
  }

  return slots.map((entry, index) => {
    const rank = index + 1;
    if (entry) {
      const isSelf = Boolean(entry.isSelf || (currentUserId && entry.userId === currentUserId));
      const isHost = rank === 1;

      return `
        <div class="lobby-player-slot" data-user-id="${escapeHtml(entry.userId)}" style="display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 10px; ${getRankBg(rank, isSelf)} transition: transform 0.15s ease;">
          <div style="display: flex; align-items: center; justify-content: center; min-width: 28px;">
            ${getRankBadge(rank)}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px; flex-wrap: nowrap;">
              <b style="font-size: 0.88rem; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 125px;">
                ${escapeHtml(entry.shopName)}
              </b>
              ${isSelf ? `
                <span style="background: #f59e0b; color: #fff; font-size: 0.62rem; font-weight: 800; padding: 1px 4px; border-radius: 4px; letter-spacing: 0.5px; flex-shrink: 0;">BẠN</span>
              ` : ''}
              ${isHost ? `
                <span style="background: #e11d48; color: #fff; font-size: 0.6rem; font-weight: 800; padding: 1px 4px; border-radius: 4px; flex-shrink: 0;" title="Đang dẫn đầu">👑 CHỦ PHÒNG</span>
              ` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--soft); white-space: nowrap;">
              <span>📅 Ngày ${entry.day}</span>
              <span>•</span>
              <span>Chương ${entry.chapter}</span>
              <span>•</span>
              <span>⭐ ${(entry.overallRating || 4.0).toFixed(1)}</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 78px; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 1px;">
            <div style="font-weight: 800; font-size: 0.88rem; color: #b45309;">
              ${vnd(entry.money)}
            </div>
            <div style="font-size: 0.65rem; color: var(--soft);">
              🍗 ${entry.totalFried} mẻ gà
            </div>
            ${!isSelf ? `
              <button class="btn-sm btn-send-care-package" data-recipient-id="${escapeHtml(entry.userId)}" data-recipient-name="${escapeHtml(entry.shopName)}" style="padding: 2px 6px; font-size: 0.62rem; font-weight: 800; border-radius: 5px; background: #fffdf5; border: 1.2px solid #f59e0b; color: #b45309; cursor: pointer; margin-top: 2px;" title="Gửi quà tiếp tế cho quán bạn">
                🎁 Tiếp Tế
              </button>
            ` : ''}
          </div>
        </div>
      `;
    } else {
      // Slot còn trống (Chờ người chơi quét mã QR)
      return `
        <div class="empty-lobby-slot" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; border-radius: 12px; background: rgba(255, 255, 255, 0.45); border: 2px dashed #c49a6c;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #e2e8f0; color: #94a3b8; font-weight: 800; font-size: 0.85rem;">
              ${rank}
            </span>
            <div>
              <div style="font-weight: 700; font-size: 0.82rem; color: #8c6239;">Slot ${rank}: Đang chờ bạn bè...</div>
              <div style="font-size: 0.68rem; color: #a17852;">Quét mã QR để cùng vào phòng này</div>
            </div>
          </div>
          <button class="btn-sm btn-quick-invite-qr" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 800; border-radius: 6px; background: #fff; border: 1.5px solid #d4a373; color: #7c4f32; cursor: pointer;">
            📱 Mời QR
          </button>
        </div>
      `;
    }
  }).join('');
}

export function renderLeaderboardModal(
  entries: LeaderboardEntry[],
  currentUserId?: string,
  sortBy: 'money' | 'day' = 'money',
  isOffline: boolean = false,
  roomId: string = 'HEM1102',
  activeTab: 'lobby' | 'qr' = 'lobby'
): string {
  const inviteUrl = getInviteUrl(roomId);
  const qrCodeUrl = getQrCodeUrl(inviteUrl);
  const slotsHtml = renderLobbySlotsHtml(entries, currentUserId);

  return `
    <div class="leaderboard-modal-box" style="text-align: left; display: flex; flex-direction: column; gap: 10px; max-width: 430px; width: 100%; margin: 0 auto; background: #faeed1; padding: 14px 16px; border-radius: 12px; border: 3px solid #5a3018; box-shadow: inset 2px 2px 0 #f7d046, inset -2px -2px 0 #2b1810, 0 8px 24px rgba(0,0,0,0.35);">
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4a373; padding-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.35rem;">🏆</span>
          <div>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #3d2314; font-family: var(--font-heading); letter-spacing: 0.5px;">LOBBY ĐUA TOP 4 NGƯỜI</h3>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #7c4f32; font-weight: 700;">
              <span>Mã Phòng: <b id="lobby-room-code-badge" style="color: #b45309; background: #fff3cd; padding: 1px 6px; border-radius: 4px; border: 1px solid #f59e0b;">${escapeHtml(roomId)}</b></span>
              <span>•</span>
              <span>100% Người Thật</span>
            </div>
          </div>
        </div>
        <button id="btn-close-leaderboard" style="border: 0; background: none; font-size: 1.35rem; cursor: pointer; color: #7c4f32; line-height: 1; padding: 4px;">✕</button>
      </div>

      <!-- Navigation Tabs: Lobby 4 Người VS Mã QR Mời Bạn -->
      <div style="display: flex; gap: 6px; background: #ebd5b3; padding: 3px; border-radius: 10px; border: 1.5px solid #c49a6c;">
        <button id="tab-nav-lobby" class="btn-sm ${activeTab === 'lobby' ? 'primary' : ''}" style="flex: 1; min-height: 34px; font-weight: 800; font-size: 0.78rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 4px;">
          👥 4 Vị Trí Lobby (<span id="lobby-player-count">${entries.length}</span>/4)
        </button>
        <button id="tab-nav-qr" class="btn-sm ${activeTab === 'qr' ? 'primary' : ''}" style="flex: 1; min-height: 34px; font-weight: 800; font-size: 0.78rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 4px;">
          📱 Mã QR Mời Bạn
        </button>
      </div>

      ${activeTab === 'lobby' ? `
        <!-- Sync Status & Sort Toggle -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${isOffline ? '#f59e0b' : '#10b981'}; box-shadow: 0 0 6px ${isOffline ? '#f59e0b' : '#10b981'};"></span>
            <span id="lobby-sync-status-text" style="font-size: 0.75rem; font-weight: 700; color: ${isOffline ? '#b45309' : '#047857'};">
              ${isOffline ? 'Bộ nhớ đệm (Đang Offline)' : 'Đám mây kết nối (Live 4s)'}
            </span>
          </div>
          <div style="display: flex; gap: 4px;">
            <button id="btn-sort-money" class="btn-sm ${sortBy === 'money' ? 'primary' : ''}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 800; border-radius: 8px;">
              💰 Tài Sản
            </button>
            <button id="btn-sort-day" class="btn-sm ${sortBy === 'day' ? 'primary' : ''}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 800; border-radius: 8px;">
              📅 Số Ngày
            </button>
          </div>
        </div>

        <!-- 4 Lobby Slots (Hỗ trợ Live Update Realtime) -->
        <div id="lobby-slots-container" style="display: flex; flex-direction: column; gap: 6px; max-height: 420px; overflow-y: auto; padding-right: 2px;">
          ${slotsHtml}
        </div>

        <!-- Banner Mời Bạn Nhanh -->
        <button id="btn-open-qr-tab" style="width: 100%; min-height: 36px; padding: 6px 10px; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #451a03; border: 2px solid #b45309; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);">
          <span>📱</span>
          <span>MỞ MÃ QR MỜI BẠN BÈ VÀO LOBBY</span>
          <span>➡️</span>
        </button>
      ` : `
        <!-- Tab 2: Hiển Thị Mã QR & Chia Sẻ Link Mời -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 6px 0;">
          <!-- Khung Mã QR Pixel Retro -->
          <div style="background: #ffffff; padding: 12px; border-radius: 12px; border: 3px solid #5a3018; box-shadow: 0 6px 16px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <img src="${qrCodeUrl}" alt="Mã QR Mời Bạn Chơi Tiệm Gà Nhà Tui" style="width: 190px; height: 190px; display: block; border-radius: 6px; image-rendering: pixelated;" />
            <div style="font-size: 0.72rem; font-weight: 800; color: #5a3018; letter-spacing: 0.5px;">
              MÃ PHÒNG: <span style="color: #b45309; font-size: 0.85rem;">${escapeHtml(roomId)}</span>
            </div>
          </div>

          <div style="font-size: 0.75rem; color: #5a3018; font-weight: 700; text-align: center; max-width: 320px; line-height: 1.4;">
            📸 Dùng <b>Camera điện thoại</b> hoặc <b>Zalo</b> quét mã QR để vào ngay phòng đua top cùng bạn!
          </div>

          <!-- Link Mời, Nút Copy & Nút Tải Poster -->
          <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; gap: 6px;">
              <input id="input-invite-link" type="text" readonly value="${inviteUrl}" style="flex: 1; padding: 8px 10px; font-size: 0.72rem; border-radius: 8px; border: 1.5px solid #c49a6c; background: #fff; color: #475569; font-family: monospace;" />
              <button id="btn-copy-invite-link" class="btn-sm primary" style="padding: 8px 14px; font-weight: 800; font-size: 0.78rem; border-radius: 8px; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                📋 Sao Chép
              </button>
            </div>
            <button id="btn-download-room-poster" class="btn-sm" style="width: 100%; min-height: 38px; padding: 8px 12px; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: 1.5px solid #047857; border-radius: 8px; font-weight: 800; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);">
              <span>📸</span>
              <span>TẢI POSTER PHÒNG ĐUA TOP (9:16 STORY)</span>
            </button>
          </div>

          <!-- Khu Vực Đổi Phòng Hoặc Tạo Phòng Mới -->
          <div style="width: 100%; background: #f4e3c7; border: 1.5px solid #d4a373; border-radius: 10px; padding: 10px; margin-top: 4px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #7c4f32;">
              🔄 Tham Gia Phòng Khác Hoặc Tạo Mới:
            </div>
            <div style="display: flex; gap: 6px;">
              <input id="input-custom-room" type="text" placeholder="Nhập mã phòng..." maxlength="12" style="flex: 1; padding: 6px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 6px; border: 1.5px solid #c49a6c; text-transform: uppercase;" />
              <button id="btn-join-custom-room" class="btn-sm" style="padding: 6px 12px; font-weight: 800; font-size: 0.75rem; border-radius: 6px; background: #fff; border: 1.5px solid #d4a373;">
                Vào Phòng
              </button>
              <button id="btn-create-random-room" class="btn-sm" style="padding: 6px 10px; font-weight: 800; font-size: 0.75rem; border-radius: 6px; background: #fff; border: 1.5px solid #d4a373;" title="Tạo phòng ngẫu nhiên">
                🎲 Tạo Mới
              </button>
            </div>
          </div>
        </div>
      `}

      <!-- Info Footer -->
      <div style="background: #f1f5f9; border-radius: 10px; padding: 8px 10px; font-size: 0.72rem; color: #475569; line-height: 1.45;">
        💡 <b>Cơ chế đua Top</b>: Tối đa 4 tiệm gà trong 1 phòng. Điểm tự đồng bộ khi hết ngày. Bấm <i>"Chơi lại từ đầu"</i> sẽ giải phóng slot để bạn mở tiệm mới!
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 8px; justify-content: space-between; margin-top: 2px;">
        <button id="btn-refresh-leaderboard" class="btn-sm" style="flex: 1; min-height: 40px; font-weight: 800; font-size: 0.82rem; background: var(--bg); border: 1.5px solid var(--line); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
          🔄 Làm Mới Lobby
        </button>
        <button id="btn-close-leaderboard-btn" class="btn-sm primary" style="flex: 1; min-height: 40px; font-weight: 800; font-size: 0.85rem; border-radius: 8px;">
          Đã Hiểu
        </button>
      </div>
    </div>
  `;
}

/**
 * Hộp thoại chọn gói quà tiếp tế gửi cho bạn cùng phòng
 */
export function renderSendCarePackageDialog(recipientId: string, recipientName: string): string {
  return `
    <div class="care-package-dialog" style="max-width: 360px; width: 100%; margin: 0 auto; background: #faeed1; padding: 14px 16px; border-radius: 12px; border: 3px solid #5a3018; box-shadow: inset 2px 2px 0 #f7d046, inset -2px -2px 0 #2b1810, 0 8px 24px rgba(0,0,0,0.35);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4a373; padding-bottom: 6px; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1.35rem;">🎁</span>
          <b style="font-size: 0.95rem; color: #3d2314;">TIẾP TẾ CHO BẠN BÈ</b>
        </div>
        <button id="btn-close-care-pkg" style="border: 0; background: none; font-size: 1.3rem; cursor: pointer; color: #7c4f32; line-height: 1; padding: 2px 4px;">✕</button>
      </div>

      <div style="font-size: 0.78rem; color: #5a3018; margin-bottom: 10px; line-height: 1.4;">
        Thân gửi nghĩa tình Hẻm 1102 tới <b>${escapeHtml(recipientName)}</b>. Chọn 1 gói quà để tiếp tế:
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
        <button class="btn-pkg-option" data-recipient-id="${escapeHtml(recipientId)}" data-recipient-name="${escapeHtml(recipientName)}" data-pkg-type="chicken" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; border: 1.5px solid #d4a373; background: #fff; cursor: pointer; text-align: left;">
          <span style="font-size: 1.4rem;">🍗</span>
          <div style="flex: 1;">
            <b style="font-size: 0.85rem; color: #3d2314;">5 Miếng Gà Tươi</b>
            <div style="font-size: 0.68rem; color: #7c4f32;">Trích 5 gà từ kho (hoặc 70.000đ mua hộ)</div>
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #b45309;">GỬI ➔</span>
        </button>

        <button class="btn-pkg-option" data-recipient-id="${escapeHtml(recipientId)}" data-recipient-name="${escapeHtml(recipientName)}" data-pkg-type="oil" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; border: 1.5px solid #d4a373; background: #fff; cursor: pointer; text-align: left;">
          <span style="font-size: 1.4rem;">🛢️</span>
          <div style="flex: 1;">
            <b style="font-size: 0.85rem; color: #3d2314;">Quỹ Dầu Sạch</b>
            <div style="font-size: 0.68rem; color: #7c4f32;">Hỗ trợ 50.000đ tiền thay dầu mới</div>
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #b45309;">GỬI ➔</span>
        </button>

        <button class="btn-pkg-option" data-recipient-id="${escapeHtml(recipientId)}" data-recipient-name="${escapeHtml(recipientName)}" data-pkg-type="tip" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; border: 1.5px solid #d4a373; background: #fff; cursor: pointer; text-align: left;">
          <span style="font-size: 1.4rem;">🧧</span>
          <div style="flex: 1;">
            <b style="font-size: 0.85rem; color: #3d2314;">Lì Xì May Mắn</b>
            <div style="font-size: 0.68rem; color: #7c4f32;">Tặng 20.000đ tiền tip chúc quán đắt khách</div>
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #b45309;">GỬI ➔</span>
        </button>
      </div>

      <div style="font-size: 0.68rem; color: #7c4f32; line-height: 1.4; background: #fffdf5; padding: 6px 8px; border-radius: 6px; border: 1px solid #fed7aa;">
        ❤️ Gửi tiếp tế giúp tăng <b>+5 Tình Thân Hẻm</b>. Giới hạn 1 lần gửi mỗi ngày kinh doanh.
      </div>
    </div>
  `;
}
