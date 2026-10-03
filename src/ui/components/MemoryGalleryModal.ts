import { GameState, StoryEndingId } from '../../types/game';
import { STORY_ENDINGS } from '../../content/endings';
import { NIGHT_STORYLETS } from '../../content/storylets';
import { BUNNY_LETTERS } from '../../content/mysteryBunny';
import { audio } from '../../core/audio';

export type GalleryTab = 'endings' | 'storylets' | 'letters' | 'milestones';

interface MilestoneDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (state: GameState) => boolean;
  progressText: (state: GameState) => string;
}

const MILESTONES: MilestoneDef[] = [
  {
    id: 'm_first_day',
    icon: '🐣',
    title: 'Bước Chân Đầu Tiên',
    desc: 'Bắt đầu khởi nghiệp bên chiếc xe đẩy vỉa hè',
    check: s => (s.day ?? 1) >= 1,
    progressText: () => 'Đã hoàn thành'
  },
  {
    id: 'm_100_days',
    icon: '💯',
    title: 'Trăm Ngày Khởi Nghiệp',
    desc: 'Gắn bó bền bỉ cùng Hẻm 1102 ít nhất 100 ngày',
    check: s => (s.day ?? 1) >= 100,
    progressText: s => `${Math.min(100, s.day ?? 1)}/100 ngày`
  },
  {
    id: 'm_perfect_fryer',
    icon: '✨',
    title: 'Đôi Tay Vàng Giòn',
    desc: 'Đạt 100 mẻ chiên chuẩn nhiệt độ Perfect',
    check: s => (s.lifetimeStats?.perfectFriedCount ?? 0) >= 100,
    progressText: s => `${Math.min(100, s.lifetimeStats?.perfectFriedCount ?? 0)}/100 mẻ`
  },
  {
    id: 'm_top_rating',
    icon: '⭐',
    title: 'Đệ Nhất Hẻm 1102',
    desc: 'Đạt đánh giá từ 4.8⭐ trở lên từ thực khách',
    check: s => (s.ratings?.overall ?? 0) >= 4.8,
    progressText: s => `${(s.ratings?.overall ?? 0).toFixed(2)}/4.80⭐`
  },
  {
    id: 'm_millionaire',
    icon: '💰',
    title: 'Doanh Thu Triệu Đô',
    desc: 'Tích lũy tổng doanh thu từ 5.000.000đ trở lên',
    check: s => (s.lifetimeStats?.totalRevenue ?? 0) >= 5000000,
    progressText: s => `${Math.min(5000000, s.lifetimeStats?.totalRevenue ?? 0).toLocaleString('vi-VN')}đ / 5.000.000đ`
  },
  {
    id: 'm_community_heart',
    icon: '❤️',
    title: 'Nghĩa Tình Hẻm Sâu',
    desc: 'Đạt chỉ số Karma Tình Thân Hẻm từ 80% trở lên',
    check: s => (s.karma?.community ?? 0) >= 80,
    progressText: s => `${Math.min(100, s.karma?.community ?? 0)}/80%`
  },
  {
    id: 'm_happy_ending',
    icon: '👑',
    title: 'Khải Hoàn Đại Viên Mãn',
    desc: 'Chinh phục Đại Kết Cục Happy Ending cùng Mimi An & Bác Ba',
    check: s => (s.achievedEndings ?? []).includes('happy'),
    progressText: s => (s.achievedEndings ?? []).includes('happy') ? 'Đã đạt được' : 'Chưa mở khóa'
  },
  {
    id: 'm_golden_spatula',
    icon: '🌟',
    title: 'Bảo Vật Chiếc Vá Vàng',
    desc: 'Mở khóa Secret Ending: Tuyệt kỹ nghệ nhân ẩm thực dân gian',
    check: s => (s.achievedEndings ?? []).includes('secret'),
    progressText: s => (s.achievedEndings ?? []).includes('secret') ? 'Đã đạt được' : 'Chưa mở khóa'
  }
];

export function renderMemoryGalleryModal(state: GameState, activeTab: GalleryTab = 'endings'): string {
  const achievedEndings = state.achievedEndings ?? [];
  const seenStorylets = state.seenStoryletIds ?? [];
  const unlockedLetters = state.unlockedBunnyLetters ?? [];
  const achievedMilestones = MILESTONES.filter(m => m.check(state));

  // Tab: 6 Đại Kết Cục
  const endingsList: StoryEndingId[] = ['happy', 'open', 'bad_bankruptcy', 'bad_corporate', 'bad_police', 'secret'];
  const endingsHtml = endingsList.map(eid => {
    const ending = STORY_ENDINGS[eid];
    const isAchieved = achievedEndings.includes(eid);

    if (isAchieved) {
      return `
        <div class="gallery-card is-unlocked ${ending.themeClass}" style="background: linear-gradient(145deg, #fffdf8 0%, #fff7eb 100%); border: 2px solid #d4a373; border-radius: 12px; padding: 12px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <span style="font-size: 2rem; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));">${ending.icon}</span>
              <div>
                <div style="font-size: 0.68rem; font-weight: 800; color: #b45309; text-transform: uppercase;">${ending.kicker}</div>
                <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 1.05rem; font-weight: 800; color: #451a03; line-height: 1.2;">${ending.title}</div>
              </div>
            </div>
            <span style="background: #dcfce7; color: #166534; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #86efac; white-space: nowrap;">
              ✓ ĐÃ ĐẠT
            </span>
          </div>
          <div style="font-size: 0.78rem; font-style: italic; color: #78350f; margin: 6px 0; opacity: 0.9;">
            "${ending.tagline}"
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
            <button class="btn-sm btn-replay-ending" data-ending-id="${eid}" style="background: #fef08a; border: 1.5px solid #ca8a04; color: #713f12; font-weight: 800; font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; min-height: 44px; display: inline-flex; align-items: center; gap: 4px;">
              📖 Đọc Lại Chi Tiết
            </button>
          </div>
        </div>
      `;
    } else {
      // Clues / Gợi ý khi chưa mở khóa
      const clues: Record<StoryEndingId, string> = {
        happy: 'Gợi ý: Cần gắn bó tiệm ≥ 100 ngày, tình thân hẻm và tay nghề cao, mở khóa đủ thư Gà Bông.',
        open: 'Gợi ý: Giữ quán ăn bình dị dưới mái hiên số 14, cân bằng cuộc sống và giữ trọn tình nghĩa xóm giềng.',
        bad_bankruptcy: 'Gợi ý: Xảy ra khi ngân quỹ tiệm bị âm 3 ngày liên tiếp do chi tiêu vượt quá tầm kiểm soát.',
        bad_corporate: 'Gợi ý: Xảy ra khi tham vọng quy mô quá lớn, bỏ quên tình làng nghĩa xóm vì lợi nhuận.',
        bad_police: 'Gợi ý: Xảy ra nếu liên tục chiên dầu đen độc hại và bị lực lượng chức năng lập biên bản 3 lần.',
        secret: 'Gợi ý: Đạt phong độ thượng thừa: 5.0⭐, tỷ lệ Perfect ≥ 85%, cháy ≤ 2% và gắn bó ≥ 100 ngày.'
      };

      return `
        <div class="gallery-card is-locked" style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 12px; margin-bottom: 10px; opacity: 0.85;">
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="font-size: 1.8rem; filter: grayscale(1) opacity(0.5);">🔒</span>
            <div>
              <div style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase;">VẬN MỆNH CHƯA KHÁM PHÁ</div>
              <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.95rem; font-weight: 800; color: #334155;">??? Kết Cục Ẩn</div>
            </div>
          </div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 6px; line-height: 1.35; background: rgba(0,0,0,0.02); padding: 6px 8px; border-radius: 6px;">
            ${clues[eid]}
          </div>
        </div>
      `;
    }
  }).join('');

  // Tab: 6 Ký Ức Đêm Hẻm 1102 (Storylets)
  const storyletsHtml = NIGHT_STORYLETS.map(st => {
    const isSeen = seenStorylets.includes(st.id);

    if (isSeen) {
      return `
        <div class="gallery-card is-unlocked" style="background: #ffffff; border: 1.5px solid #d4a373; border-radius: 12px; padding: 12px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <span style="font-size: 1.8rem;">${typeof st.characterAvatar === 'string' && st.characterAvatar.startsWith('http') ? `<img src="${st.characterAvatar}" width="36" height="36" style="border-radius: 50%; object-fit: cover;" alt="" />` : (st.characterAvatar || '🌙')}</span>
              <div>
                <div style="font-size: 0.68rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">${st.characterName}</div>
                <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.98rem; font-weight: 800; color: #0f172a;">${st.title}</div>
              </div>
            </div>
            <span style="background: #e0f2fe; color: #0369a1; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd;">
              ✓ ĐÃ LƯU
            </span>
          </div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 4px; font-style: italic;">
            📍 ${st.setting}
          </div>
          <div style="font-size: 0.78rem; color: #334155; margin-top: 6px; line-height: 1.4; background: #f8fafc; padding: 8px; border-radius: 6px; border-left: 2.5px solid #38bdf8;">
            ${st.narrativeLines[0] || ''}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="gallery-card is-locked" style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 12px; margin-bottom: 10px; opacity: 0.85;">
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="font-size: 1.6rem; opacity: 0.5;">🔒</span>
            <div>
              <div style="font-size: 0.68rem; font-weight: 800; color: #64748b;">KÝ ỨC ĐÊM CHƯA MỞ</div>
              <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.92rem; font-weight: 800; color: #334155;">??? Cuộc trò chuyện bí ẩn</div>
            </div>
          </div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">
            Gợi ý: Cần bán hàng xuất sắc, canh lửa chuẩn xác vào ban đêm để gặp cư dân này.
          </div>
        </div>
      `;
    }
  }).join('');

  // Tab: 18 Thư Tay Gà Bông
  const lettersHtml = BUNNY_LETTERS.map((lt, idx) => {
    const isUnlocked = unlockedLetters.includes(lt.id);
    if (isUnlocked) {
      return `
        <div class="gallery-card is-unlocked" style="background: #fffdf5; border: 1.5px solid #fcd34d; border-radius: 10px; padding: 10px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #b45309;">MẢNH GIẤY #${idx + 1}</span>
            <span style="font-size: 0.65rem; color: #166534; background: #dcfce7; padding: 1px 5px; border-radius: 4px;">✓ Đã đọc</span>
          </div>
          <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.9rem; font-weight: 800; color: #451a03; margin: 2px 0;">
            ${lt.title}
          </div>
          <div style="font-size: 0.76rem; color: #78350f; font-style: italic; line-height: 1.35; background: rgba(254, 243, 199, 0.4); padding: 6px 8px; border-radius: 6px;">
            "${lt.noteContent.trim().slice(0, 110)}..."
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #92400e; margin-top: 4px; font-weight: 700;">
            <span>🍗 Món bé thích: ${lt.preferredFood}</span>
            <span>🎁 Tip: +${lt.tip.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="gallery-card is-locked" style="background: #f8fafc; border: 1.5px dashed #e2e8f0; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; opacity: 0.75;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8;">🔒 MẢNH GIẤY #${idx + 1} (CHƯA NHẬN ĐƯỢC)</span>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
            Gợi ý: Mở theo tiến độ cọc chương và tiếp đãi Bé Gà Bông chu đáo khi bé ghé tiệm.
          </div>
        </div>
      `;
    }
  }).join('');

  // Tab: Bảng Vàng Thành Tựu
  const milestonesHtml = MILESTONES.map(m => {
    const isDone = m.check(state);
    return `
      <div class="gallery-card ${isDone ? 'is-unlocked' : 'is-locked'}" style="background: ${isDone ? 'linear-gradient(145deg, #ffffff 0%, #fefce8 100%)' : '#f8fafc'}; border: 1.5px solid ${isDone ? '#eab308' : '#e2e8f0'}; border-radius: 10px; padding: 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 1.8rem; filter: ${isDone ? 'none' : 'grayscale(1) opacity(0.4)'};">${m.icon}</span>
          <div>
            <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.92rem; font-weight: 800; color: ${isDone ? '#854d0e' : '#475569'};">
              ${m.title}
            </div>
            <div style="font-size: 0.72rem; color: #64748b; line-height: 1.25;">
              ${m.desc}
            </div>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <span style="background: ${isDone ? '#dcfce7' : '#f1f5f9'}; color: ${isDone ? '#166534' : '#64748b'}; font-size: 0.68rem; font-weight: 800; padding: 3px 6px; border-radius: 6px; border: 1px solid ${isDone ? '#86efac' : '#cbd5e1'};">
            ${m.progressText(state)}
          </span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="memory-gallery-modal" style="display: flex; flex-direction: column; max-height: 86vh; text-align: left; box-sizing: border-box; overflow: hidden;">
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 8px; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.6rem;">🏛️</span>
          <div>
            <h2 style="margin: 0; font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 1.15rem; font-weight: 900; color: #451a03; line-height: 1.15;">
              PHÒNG LƯU NIỆM KÝ ỨC HẺM 1102
            </h2>
            <small style="color: #78350f; font-size: 0.72rem; font-weight: 700;">
              Bảo tàng thành tựu & đại vận mệnh Tiệm Gà Nhà Tui
            </small>
          </div>
        </div>
        <button id="btn-close-gallery" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: var(--soft); min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Navigation Tabs Bar -->
      <div class="gallery-nav-bar" style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; border-bottom: 1px solid var(--line); margin-bottom: 10px;">
        <button class="gallery-tab-btn ${activeTab === 'endings' ? 'active' : ''}" data-tab="endings" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'endings' ? '#b45309' : '#e2e8f0'}; background: ${activeTab === 'endings' ? '#fef3c7' : '#ffffff'}; color: ${activeTab === 'endings' ? '#78350f' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;">
          <span>🏆 Vận Mệnh</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${achievedEndings.length}/6)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'storylets' ? 'active' : ''}" data-tab="storylets" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'storylets' ? '#0284c7' : '#e2e8f0'}; background: ${activeTab === 'storylets' ? '#e0f2fe' : '#ffffff'}; color: ${activeTab === 'storylets' ? '#0369a1' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;">
          <span>🌙 Ký Ức Đêm</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${seenStorylets.length}/6)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'letters' ? 'active' : ''}" data-tab="letters" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'letters' ? '#d97706' : '#e2e8f0'}; background: ${activeTab === 'letters' ? '#fffbeb' : '#ffffff'}; color: ${activeTab === 'letters' ? '#92400e' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;">
          <span>📜 Thư Gà Bông</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${unlockedLetters.length}/18)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'milestones' ? 'active' : ''}" data-tab="milestones" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'milestones' ? '#16a34a' : '#e2e8f0'}; background: ${activeTab === 'milestones' ? '#dcfce7' : '#ffffff'}; color: ${activeTab === 'milestones' ? '#14532d' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;">
          <span>⭐ Bảng Vàng</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${achievedMilestones.length}/${MILESTONES.length})</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="gallery-content-scroll" style="flex: 1; overflow-y: auto; padding-right: 2px; scrollbar-width: thin; scrollbar-color: #d4a373 #fffbf5;">
        ${activeTab === 'endings' ? endingsHtml : ''}
        ${activeTab === 'storylets' ? storyletsHtml : ''}
        ${activeTab === 'letters' ? lettersHtml : ''}
        ${activeTab === 'milestones' ? milestonesHtml : ''}
      </div>
    </div>
  `;
}

export function bindMemoryGalleryEvents(
  onSwitchTab: (tab: GalleryTab) => void,
  onReplayEnding: (endingId: StoryEndingId) => void,
  onClose: () => void
) {
  if (typeof document === 'undefined') return;

  const closeBtn = document.getElementById('btn-close-gallery');
  if (closeBtn) {
    closeBtn.onclick = () => {
      audio.playPop();
      onClose();
    };
  }

  // Switch tabs
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as GalleryTab;
      if (tab) {
        audio.playPop();
        onSwitchTab(tab);
      }
    });
  });

  // Replay specific ending
  const replayBtns = document.querySelectorAll('.btn-replay-ending');
  replayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const eid = btn.getAttribute('data-ending-id') as StoryEndingId;
      if (eid) {
        audio.playPop();
        onReplayEnding(eid);
      }
    });
  });
}
