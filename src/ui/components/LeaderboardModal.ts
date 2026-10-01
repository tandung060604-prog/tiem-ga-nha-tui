import { LeaderboardEntry } from '../../types/game';
import { escapeHtml } from '../escapeHtml';
import { CHAPTERS } from '../../content/chapters';

const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export function renderLeaderboardModal(
  entries: LeaderboardEntry[],
  currentUserId?: string,
  sortBy: 'money' | 'day' = 'money',
  isOffline: boolean = false
): string {
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

  return `
    <div class="leaderboard-modal-box" style="text-align: left; display: flex; flex-direction: column; gap: 10px; max-width: 420px; width: 100%; margin: 0 auto; background: #faeed1; padding: 14px 16px; border-radius: 12px; border: 3px solid #5a3018; box-shadow: inset 2px 2px 0 #f7d046, inset -2px -2px 0 #2b1810, 0 8px 24px rgba(0,0,0,0.35);">
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4a373; padding-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.35rem;">🏆</span>
          <div>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #3d2314; font-family: var(--font-heading); letter-spacing: 0.5px;">BẢNG XẾP HẠNG HẺM 1102</h3>
            <div style="font-size: 0.72rem; color: #7c4f32; font-weight: 600;">Đua Top 4 Tiệm Gà (100% Người Thật) · Đồng bộ Đám Mây</div>
          </div>
        </div>
        <button id="btn-close-leaderboard" style="border: 0; background: none; font-size: 1.35rem; cursor: pointer; color: #7c4f32; line-height: 1; padding: 4px;">✕</button>
      </div>

      <!-- Sync Status & Sort Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${isOffline ? '#f59e0b' : '#10b981'}; box-shadow: 0 0 6px ${isOffline ? '#f59e0b' : '#10b981'};"></span>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${isOffline ? '#b45309' : '#047857'};">
            ${isOffline ? 'Bộ nhớ đệm (Đang Offline)' : 'Đám mây kết nối (Realtime)'}
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

      <!-- Leaderboard List -->
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 340px; overflow-y: auto; padding-right: 2px;">
        ${entries.length === 0 ? `
          <div style="text-align: center; padding: 24px 12px; color: var(--soft); font-size: 0.85rem;">
            Chưa có tiệm gà nào trên bảng xếp hạng. Hãy hoàn thành Ngày 1 để ghi danh đầu tiên!
          </div>
        ` : entries.slice(0, 10).map((entry, index) => {
          const rank = index + 1;
          const isSelf = Boolean(entry.isSelf || (currentUserId && entry.userId === currentUserId));
          const chapterData = CHAPTERS.find(c => c.number === entry.chapter) || CHAPTERS[0];

          return `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; ${getRankBg(rank, isSelf)} transition: transform 0.15s ease;">
              <div style="display: flex; align-items: center; justify-content: center; min-width: 32px;">
                ${getRankBadge(rank)}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                  <b style="font-size: 0.92rem; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">
                    ${escapeHtml(entry.shopName)}
                  </b>
                  ${isSelf ? `
                    <span style="background: #f59e0b; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 1px 6px; border-radius: 6px; letter-spacing: 0.5px;">BẠN</span>
                  ` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.73rem; color: var(--soft);">
                  <span>📅 Ngày ${entry.day}</span>
                  <span>•</span>
                  <span>Chương ${entry.chapter}: ${chapterData?.title || 'Khởi đầu'}</span>
                  <span>•</span>
                  <span>⭐ ${(entry.overallRating || 4.0).toFixed(1)}</span>
                </div>
              </div>
              <div style="text-align: right; min-width: 85px;">
                <div style="font-weight: 800; font-size: 0.95rem; color: #b45309;">
                  ${vnd(entry.money)}
                </div>
                <div style="font-size: 0.68rem; color: var(--soft);">
                  🍗 ${entry.totalFried} mẻ gà
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${entries.length > 0 && entries.length < 4 ? `
        <div style="background: #fef3c7; border: 1px dashed #f59e0b; border-radius: 8px; padding: 6px 10px; font-size: 0.72rem; color: #92400e; font-weight: 700; text-align: center;">
          🍗 Đang có <b>${entries.length}/4</b> tiệm người thật trên bảng. Hãy rủ thêm bạn bè cùng mở tiệm đua top!
        </div>
      ` : ''}

      <!-- Info Footer -->
      <div style="background: #f1f5f9; border-radius: 10px; padding: 8px 10px; font-size: 0.72rem; color: #475569; line-height: 1.45;">
        💡 <b>Cơ chế đua Top</b>: Bảng xếp hạng 100% người thật. Dữ liệu tự đồng bộ khi kết thúc ngày hoặc chuyển chương. Khi bạn bấm <i>"Chơi lại từ đầu"</i>, hồ sơ cũ sẽ tự động bị xóa khỏi BXH để mở đường cho tài khoản mới!
      </div>


      <!-- Action Buttons -->
      <div style="display: flex; gap: 8px; justify-content: space-between; margin-top: 2px;">
        <button id="btn-refresh-leaderboard" class="btn-sm" style="flex: 1; min-height: 40px; font-weight: 800; font-size: 0.82rem; background: var(--bg); border: 1.5px solid var(--line); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
          🔄 Làm Mới BXH
        </button>
        <button id="btn-close-leaderboard-btn" class="btn-sm primary" style="flex: 1; min-height: 40px; font-weight: 800; font-size: 0.85rem; border-radius: 8px;">
          Đã Hiểu
        </button>
      </div>
    </div>
  `;
}
