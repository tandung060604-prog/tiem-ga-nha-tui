import { GameState, StoryEndingId } from '../../types/game';
import { STORY_ENDINGS } from '../../content/endings';
import { NIGHT_STORYLETS } from '../../content/storylets';
import { BUNNY_LETTERS } from '../../content/mysteryBunny';
import { MEMORY_ALBUM_CGS, isCGUnlocked } from '../../content/memoryAlbum';
import { audio } from '../../core/audio';

export type GalleryTab = 'endings' | 'storylets' | 'letters' | 'milestones' | 'album';

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
    title: 'Trái Tim Hẻm 1102',
    desc: 'Chỉ số Tình Thân Hẻm (Karma Community) đạt 80+',
    check: s => (s.karma?.community ?? 0) >= 80,
    progressText: s => `${Math.min(100, Math.round(s.karma?.community ?? 0))}/80%`
  },
  {
    id: 'm_master_craft',
    icon: '🔥',
    title: 'Bậc Thầy Chảo Lửa',
    desc: 'Chỉ số Bản Sắc Nghệ Nhân (Karma Craftsmanship) đạt 80+',
    check: s => (s.karma?.craftsmanship ?? 0) >= 80,
    progressText: s => `${Math.min(100, Math.round(s.karma?.craftsmanship ?? 0))}/80%`
  },
  {
    id: 'm_all_endings',
    icon: '👑',
    title: 'Vạn Dặm Bất Bại',
    desc: 'Mở khóa toàn bộ 6 Đại Kết Cục Vận Mệnh',
    check: s => (s.achievedEndings ?? []).length >= 6,
    progressText: s => `${(s.achievedEndings ?? []).length}/6 Kết Cục`
  },
  {
    id: 'm_secret_sauce_king',
    icon: '🍶',
    title: 'Bí Thuật Gia Truyền',
    desc: 'Sở hữu đủ 3 vị sốt Chợ Lớn và pha chế sốt bí truyền',
    check: s => !!s.secretSauceDay,
    progressText: s => s.secretSauceDay ? 'Đã nắm giữ' : 'Chưa pha chế'
  },
  {
    id: 'm_secret_ending_master',
    icon: '🌟',
    title: 'Bảo Vật Chiếc Vá Vàng',
    desc: 'Mở khóa Kết Cục Ẩn Huyền Thoại (Secret Ending)',
    check: s => (s.achievedEndings ?? []).includes('secret'),
    progressText: s => (s.achievedEndings ?? []).includes('secret') ? 'Đã đạt được' : 'Chưa mở khóa'
  }
];

export function renderMemoryGalleryModal(state: GameState, activeTab: GalleryTab = 'album'): string {
  const achievedEndings = state.achievedEndings ?? [];
  const seenStorylets = state.seenStoryletIds ?? [];
  const unlockedLetters = state.unlockedBunnyLetters ?? [];
  const achievedMilestones = MILESTONES.filter(m => m.check(state));
  const unlockedCGs = MEMORY_ALBUM_CGS.filter(cg => isCGUnlocked(state, cg.id));

  // Tab 1: 📸 Album Kỷ Niệm CG Polaroid
  const albumHtml = MEMORY_ALBUM_CGS.map(cg => {
    const isUnlocked = isCGUnlocked(state, cg.id);

    if (isUnlocked) {
      return `
        <div class="gallery-card is-unlocked cg-polaroid-card" style="background: #ffffff; border: 2px solid #d4a373; border-radius: 14px; padding: 12px; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); transition: transform 0.2s ease;">
          <div class="polaroid-photo-wrap" style="position: relative; border-radius: 10px; overflow: hidden; background: #000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <img src="${cg.image}" alt="${cg.title}" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; image-rendering: auto;" />
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); color: #fde047; font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 20px; border: 1px solid rgba(253,224,71,0.5);">
              📸 KỶ NIỆM HẺM 1102
            </div>
          </div>

          <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div>
                <div style="font-size: 0.68rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">${cg.characterName}</div>
                <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 1.05rem; font-weight: 900; color: #451a03; line-height: 1.2;">${cg.title}</div>
                <div style="font-size: 0.72rem; color: #78350f; font-style: italic;">“${cg.subtitle}”</div>
              </div>
              <span style="background: #dcfce7; color: #166534; font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; border: 1px solid #86efac; white-space: nowrap;">
                ✓ ĐÃ LƯU
              </span>
            </div>

            <div style="font-size: 0.78rem; color: #424242; margin-top: 8px; line-height: 1.45; background: #fffdf5; padding: 8px 10px; border-radius: 8px; border-left: 3px solid #f59e0b;">
              ${cg.storySnippet}
            </div>

            ${cg.karmaBonus ? `
              <div style="display: flex; gap: 8px; font-size: 0.7rem; font-weight: 700; color: #065f46; margin-top: 6px;">
                ${cg.karmaBonus.community ? `<span>❤️ Tình thân +${cg.karmaBonus.community}</span>` : ''}
                ${cg.karmaBonus.craftsmanship ? `<span>🔥 Tay nghề +${cg.karmaBonus.craftsmanship}</span>` : ''}
                ${cg.karmaBonus.ambition ? `<span>💼 Tham vọng +${cg.karmaBonus.ambition}</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="gallery-card is-locked cg-polaroid-card" style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 14px; margin-bottom: 12px; opacity: 0.85;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="width: 60px; height: 60px; border-radius: 8px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">
              🔒
            </div>
            <div>
              <div style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase;">ẢNH KỶ NIỆM CHƯA CHỤP</div>
              <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.95rem; font-weight: 800; color: #334155;">??? ${cg.title}</div>
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px; line-height: 1.35; background: rgba(0,0,0,0.03); padding: 4px 6px; border-radius: 4px;">
                💡 Điều kiện mở: ${cg.unlockCondition}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  // Tab 2: 6 Đại Kết Cục
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

  // Tab 3: 6 Ký Ức Đêm Hẻm 1102 (Storylets)
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

  // Tab 4: 18 Thư Tay Gà Bông
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

  // Tab 5: Bảng Vàng Thành Tựu
  const milestonesHtml = MILESTONES.map(m => {
    const isDone = m.check(state);
    return `
      <div class="gallery-card ${isDone ? 'is-unlocked' : 'is-locked'}" style="background: ${isDone ? '#ffffff' : '#f8fafc'}; border: 1.5px solid ${isDone ? '#86efac' : '#cbd5e1'}; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.6rem; filter: ${isDone ? 'none' : 'grayscale(1) opacity(0.5)'};">${m.icon}</span>
          <div>
            <div style="font-family: 'Tiny5 Duo', 'Baloo 2', sans-serif; font-size: 0.92rem; font-weight: 800; color: ${isDone ? '#14532d' : '#334155'};">${m.title}</div>
            <div style="font-size: 0.72rem; color: #64748b;">${m.desc}</div>
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
              Bảo tàng thành tựu, Album kỷ niệm & Vận mệnh Tiệm Gà Nhà Tui
            </small>
          </div>
        </div>
        <button id="btn-close-gallery" style="border: 0; background: none; font-size: 1.4rem; cursor: pointer; color: var(--soft); min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Navigation Tabs Bar -->
      <div class="gallery-nav-bar" style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; border-bottom: 1px solid var(--line); margin-bottom: 10px;">
        <button class="gallery-tab-btn ${activeTab === 'album' ? 'active' : ''}" data-tab="album" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'album' ? '#f59e0b' : '#e2e8f0'}; background: ${activeTab === 'album' ? '#fef3c7' : '#ffffff'}; color: ${activeTab === 'album' ? '#78350f' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; white-space: nowrap;">
          <span>📸 Album Ảnh</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${unlockedCGs.length}/${MEMORY_ALBUM_CGS.length})</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'endings' ? 'active' : ''}" data-tab="endings" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'endings' ? '#b45309' : '#e2e8f0'}; background: ${activeTab === 'endings' ? '#fef3c7' : '#ffffff'}; color: ${activeTab === 'endings' ? '#78350f' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; white-space: nowrap;">
          <span>🏆 Vận Mệnh</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${achievedEndings.length}/6)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'storylets' ? 'active' : ''}" data-tab="storylets" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'storylets' ? '#0284c7' : '#e2e8f0'}; background: ${activeTab === 'storylets' ? '#e0f2fe' : '#ffffff'}; color: ${activeTab === 'storylets' ? '#0369a1' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; white-space: nowrap;">
          <span>🌙 Ký Ức Đêm</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${seenStorylets.length}/6)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'letters' ? 'active' : ''}" data-tab="letters" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'letters' ? '#d97706' : '#e2e8f0'}; background: ${activeTab === 'letters' ? '#fffbeb' : '#ffffff'}; color: ${activeTab === 'letters' ? '#92400e' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; white-space: nowrap;">
          <span>📜 Thư Gà Bông</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${unlockedLetters.length}/18)</span>
        </button>

        <button class="gallery-tab-btn ${activeTab === 'milestones' ? 'active' : ''}" data-tab="milestones" style="flex: 1; padding: 7px 4px; border-radius: 8px; font-weight: 800; font-size: 0.74rem; cursor: pointer; border: 1.5px solid ${activeTab === 'milestones' ? '#16a34a' : '#e2e8f0'}; background: ${activeTab === 'milestones' ? '#dcfce7' : '#ffffff'}; color: ${activeTab === 'milestones' ? '#14532d' : '#64748b'}; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; white-space: nowrap;">
          <span>⭐ Bảng Vàng</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">(${achievedMilestones.length}/${MILESTONES.length})</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="gallery-content-scroll" style="flex: 1; overflow-y: auto; padding-right: 2px; scrollbar-width: thin; scrollbar-color: #d4a373 #fffbf5;">
        ${activeTab === 'album' ? albumHtml : ''}
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
