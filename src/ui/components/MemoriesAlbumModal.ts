import { GameState } from '../../types/game';
import { CHARACTERS_36 } from '../../content/characters36';
import { STORY_ENDINGS } from '../../content/endings';
import { BUNNY_LETTERS } from '../../content/mysteryBunny';
import { ASSETS } from '../../content/assets';
import { escapeHtml } from '../escapeHtml';

export type MemoriesTabId = 'residents' | 'endings' | 'bunny';

const BASE = import.meta.env?.BASE_URL ?? '/';
const charImg = (name: string) => `${BASE}assets/characters/${name}`;

/**
 * Modal Sổ Tay Kỷ Niệm Hẻm 1102 (Memories & Lore Album)
 * Trưng bày 36 Cư Dân Hẻm, 6 Đại Kết Cục và 6 Bức Thư Thỏ Cam
 */
export function renderMemoriesAlbumModal(
  state: GameState,
  activeTab: MemoriesTabId = 'residents',
  categoryFilter: string = 'all'
): string {
  const currentChapter = state.currentChapter || 1;
  const achievedEndings = new Set(state.achievedEndings ?? []);
  const receivedLetters = new Set(state.unlockedBunnyLetters ?? []);

  // Đếm thống kê
  const unlockedResidents = CHARACTERS_36.filter(c => c.unlockChapter <= currentChapter).length;
  const totalResidents = CHARACTERS_36.length;

  return `
    <div id="modal-memories-album" class="modal-backdrop" style="display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 10px;">
      <div class="modal-box retro-card" style="width: 100%; max-width: 440px; max-height: 90vh; display: flex; flex-direction: column; background: #fdf3e4; border: 3px solid #5a3018; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; position: relative;">
        
        <!-- Header Modal -->
        <div style="background: linear-gradient(135deg, #7c4f32, #5a3018); color: #fff; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3c1d0f;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem;">📖</span>
            <div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #fbbf24; text-shadow: 1px 1px #000;">
                SỔ TAY KỶ NIỆM HẺM 1102
              </div>
              <div style="font-size: 0.68rem; color: #fde68a;">
                Ký ức cư dân, 6 đại kết cục & thư Thỏ Cam
              </div>
            </div>
          </div>
          <button id="btn-close-memories" class="btn-sm" style="min-width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; border-radius: 6px; background: #fee2e2; color: #991b1b; border: 1.5px solid #ef4444; cursor: pointer;">
            ✕
          </button>
        </div>

        <!-- 3 Tabs Điều Hướng -->
        <div style="display: flex; background: #e8d5b7; border-bottom: 2px solid #c49a6c; padding: 4px 6px; gap: 4px;">
          <button class="tab-memories-btn ${activeTab === 'residents' ? 'active' : ''}" data-tab="residents" style="flex: 1; padding: 7px 4px; font-size: 0.75rem; font-weight: 800; border-radius: 6px; border: 1.5px solid ${activeTab === 'residents' ? '#5a3018' : 'transparent'}; background: ${activeTab === 'residents' ? '#fff' : '#dfc7a5'}; color: ${activeTab === 'residents' ? '#5a3018' : '#78350f'}; cursor: pointer;">
            👥 Cư Dân (${unlockedResidents}/${totalResidents})
          </button>
          <button class="tab-memories-btn ${activeTab === 'endings' ? 'active' : ''}" data-tab="endings" style="flex: 1; padding: 7px 4px; font-size: 0.75rem; font-weight: 800; border-radius: 6px; border: 1.5px solid ${activeTab === 'endings' ? '#5a3018' : 'transparent'}; background: ${activeTab === 'endings' ? '#fff' : '#dfc7a5'}; color: ${activeTab === 'endings' ? '#5a3018' : '#78350f'}; cursor: pointer;">
            🏆 Kết Cục (${achievedEndings.size}/6)
          </button>
          <button class="tab-memories-btn ${activeTab === 'bunny' ? 'active' : ''}" data-tab="bunny" style="flex: 1; padding: 7px 4px; font-size: 0.75rem; font-weight: 800; border-radius: 6px; border: 1.5px solid ${activeTab === 'bunny' ? '#5a3018' : 'transparent'}; background: ${activeTab === 'bunny' ? '#fff' : '#dfc7a5'}; color: ${activeTab === 'bunny' ? '#5a3018' : '#78350f'}; cursor: pointer;">
            💌 Thư Thỏ Cam (${receivedLetters.size}/6)
          </button>
        </div>

        <!-- Nội Dung Scroll Theo Tab -->
        <div style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
          ${activeTab === 'residents' ? renderResidentsTab(state, categoryFilter) : ''}
          ${activeTab === 'endings' ? renderEndingsTab(state) : ''}
          ${activeTab === 'bunny' ? renderBunnyLettersTab(state) : ''}
        </div>

        <!-- Footer -->
        <div style="background: #eedbc2; border-top: 1.5px solid #d4a373; padding: 8px 12px; font-size: 0.7rem; color: #5a3018; display: flex; justify-content: space-between; align-items: center;">
          <span>🏮 Hẻm 1102 • Sài Gòn Hoa Lệ</span>
          <span>Chương ${currentChapter} • Ngày ${state.day || 1}</span>
        </div>

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// TAB 1: 36 CƯ DÂN HẺM 1102
// ---------------------------------------------------------------------------
function renderResidentsTab(state: GameState, filter: string): string {
  const currentChapter = state.currentChapter || 1;

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'staff', label: 'Bếp & Trợ Thủ' },
    { id: 'regular', label: 'Khách Quen' },
    { id: 'street_worker', label: 'Đường Phố' },
    { id: 'authority', label: 'Chính Quyền' },
    { id: 'transit', label: 'Vận Tải' },
    { id: 'animal', label: 'Thú Cưng' },
  ];

  const filterButtons = categories.map(cat => `
    <button class="filter-res-btn ${filter === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border-radius: 12px; border: 1px solid ${filter === cat.id ? '#5a3018' : '#c49a6c'}; background: ${filter === cat.id ? '#5a3018' : '#fff'}; color: ${filter === cat.id ? '#fff' : '#5a3018'}; cursor: pointer; white-space: nowrap;">
      ${cat.label}
    </button>
  `).join('');

  const filtered = CHARACTERS_36.filter(c => filter === 'all' || c.category === filter);

  const cards = filtered.map(c => {
    const isUnlocked = c.unlockChapter <= currentChapter;
    const avatarFile = `${c.id}.png`;

    if (!isUnlocked) {
      return `
        <div style="background: #ebdcc3; border: 1.5px dashed #b89b7b; border-radius: 8px; padding: 8px; display: flex; align-items: center; gap: 8px; opacity: 0.65;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #cbb493; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #78350f;">
            🔒
          </div>
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #78350f;">Cư Dân Bí Ẩn</div>
            <div style="font-size: 0.68rem; color: #a16207;">Sẽ xuất hiện ở Chương ${c.unlockChapter}</div>
          </div>
        </div>
      `;
    }

    const tipBadge = c.tipTendency === 'generous' ? '💎 Hào phóng' : c.tipTendency === 'low' ? '🪙 Tiết kiệm' : '✨ Bình dị';
    const karmaBadge = c.karmaAffinity === 'community' ? '💖 Tình Thân' : c.karmaAffinity === 'craftsmanship' ? '💎 Nghệ Nhân' : '🚀 Tham Vọng';

    return `
      <div style="background: #ffffff; border: 1.5px solid #d4a373; border-radius: 10px; padding: 8px; display: flex; gap: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <img src="${charImg(avatarFile)}" alt="${c.name}" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #b45309; object-fit: contain; background: #fffbeb;" onerror="this.src='${ASSETS.ui.stickerNeon}';" />
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-size: 0.84rem; font-weight: 800; color: #451a03; truncate">${escapeHtml(c.name)}</div>
            <span style="font-size: 0.65rem; background: #fef3c7; color: #92400e; padding: 2px 5px; border-radius: 4px; font-weight: 700;">Ch. ${c.unlockChapter}</span>
          </div>
          <div style="font-size: 0.7rem; color: #b45309; font-weight: 700;">${escapeHtml(c.roleTitle)}</div>
          
          <div style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;">
            <span style="font-size: 0.62rem; background: #e0f2fe; color: #0369a1; padding: 1px 4px; border-radius: 4px; font-weight: 600;">${tipBadge}</span>
            <span style="font-size: 0.62rem; background: #fce7f3; color: #be185d; padding: 1px 4px; border-radius: 4px; font-weight: 600;">${karmaBadge}</span>
            <span style="font-size: 0.62rem; background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 4px; font-weight: 600;">🍗 ${c.favoriteOrder.length} món gu</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
      ${filterButtons}
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
      ${cards}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// TAB 2: 6 ĐẠI KẾT CỤC (ENDINGS)
// ---------------------------------------------------------------------------
function renderEndingsTab(state: GameState): string {
  const achieved = new Set(state.achievedEndings ?? []);
  const k = state.karma || { community: 50, craftsmanship: 50, ambition: 50 };

  const cards = Object.values(STORY_ENDINGS).map(end => {
    const isUnlocked = achieved.has(end.id);

    return `
      <div style="background: ${isUnlocked ? '#fffbeb' : '#ffffff'}; border: 2px solid ${isUnlocked ? '#f59e0b' : '#d4a373'}; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.06); position: relative;">
        ${isUnlocked ? `
          <div style="position: absolute; top: 8px; right: 8px; background: #10b981; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 10px;">
            ✓ ĐÃ MỞ KHÓA
          </div>
        ` : `
          <div style="position: absolute; top: 8px; right: 8px; background: #94a3b8; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 10px;">
            🔒 CHƯA ĐẠT
          </div>
        `}

        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.5rem;">${end.icon}</span>
          <div>
            <div style="font-size: 0.7rem; color: #b45309; font-weight: 800; letter-spacing: 0.5px;">${escapeHtml(end.kicker)}</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #451a03;">${escapeHtml(end.title)}</div>
          </div>
        </div>

        <div style="font-size: 0.72rem; color: #64748b; font-style: italic;">
          "${escapeHtml(end.tagline)}"
        </div>

        <div style="background: #f8fafc; border-radius: 6px; padding: 6px 8px; font-size: 0.68rem; color: #334155; line-height: 1.4;">
          <b>Điều kiện:</b> ${escapeHtml(end.conditionDescription)}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- Thanh đo Karma hiện tại của quán -->
    <div style="background: #451a03; color: #fff; border-radius: 8px; padding: 8px 10px; margin-bottom: 4px;">
      <div style="font-size: 0.72rem; font-weight: 800; color: #fbbf24; margin-bottom: 4px;">
        🧭 BÁNH LÁI VẬN MỆNH QUÁN HIỆN TẠI:
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.68rem; gap: 6px;">
        <span style="color: #f472b6;">💖 Tình Thân: ${k.community}</span>
        <span style="color: #60a5fa;">💎 Nghệ Nhân: ${k.craftsmanship}</span>
        <span style="color: #facc15;">🚀 Tham Vọng: ${k.ambition}</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${cards}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// TAB 3: HỘP THƯ THỎ CAM (BUNNY NOTES)
// ---------------------------------------------------------------------------
function renderBunnyLettersTab(state: GameState): string {
  const currentChapter = state.currentChapter || 1;
  const received = new Set(state.unlockedBunnyLetters ?? []);

  const cards = BUNNY_LETTERS.map(letItem => {
    const chapter = letItem.trigger.chapter;
    const isUnlocked = received.has(letItem.id) || currentChapter >= chapter;

    if (!isUnlocked) {
      return `
        <div style="background: #f5ebe0; border: 1.5px dashed #c49a6c; border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; opacity: 0.65;">
          <span style="font-size: 1.2rem;">🔒</span>
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #78350f;">Thư Thỏ Cam #${chapter}</div>
            <div style="font-size: 0.68rem; color: #a16207;">Sẽ gửi đến khi mở khóa Chương ${chapter}</div>
          </div>
        </div>
      `;
    }

    return `
      <div style="background: #fffdfa; border: 2px solid #f59e0b; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${ASSETS.ui.bunnyNote}" style="width: 22px; height: 22px;" alt="" />
            <span style="font-size: 0.84rem; font-weight: 800; color: #78350f;">Lá Thư #${chapter}: ${escapeHtml(letItem.title)}</span>
          </div>
          <span style="font-size: 0.65rem; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Chương ${chapter}</span>
        </div>

        <div style="font-size: 0.72rem; color: #475569; font-style: italic; background: #faeed1; padding: 6px 8px; border-radius: 6px; line-height: 1.45;">
          "${escapeHtml(letItem.noteContent.trim())}"
        </div>

        <div style="font-size: 0.68rem; color: #047857; font-weight: 700; display: flex; align-items: center; gap: 4px;">
          <span>🎁 Phần Thưởng:</span>
          <span>${escapeHtml(letItem.rewardText)}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="font-size: 0.72rem; color: #78350f; font-style: italic; text-align: center; margin-bottom: 4px;">
      💌 Những dòng tâm thư ấm áp từ vị khách Thỏ Cam bí ẩn gửi lại mỗi khi tiệm gà bước sang chương mới.
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${cards}
    </div>
  `;
}
