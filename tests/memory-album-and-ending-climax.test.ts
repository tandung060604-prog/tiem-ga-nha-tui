import { describe, it, expect, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { MEMORY_ALBUM_CGS, isCGUnlocked, unlockCG, syncEligibleCGs } from '../src/content/memoryAlbum';
import { STORY_ENDINGS } from '../src/content/endings';
import { renderMemoryGalleryModal } from '../src/ui/components/MemoryGalleryModal';
import { renderEndingModal } from '../src/ui/components/EndingModal';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

describe('Album Kỷ Niệm CG Polaroid & Trực Quan Hóa 6 Đại Kết Cục', () => {
  it('MEMORY_ALBUM_CGS có đầy đủ 4 bức tranh pixel art retro và metadata hoàn chỉnh', () => {
    expect(MEMORY_ALBUM_CGS.length).toBe(4);
    for (const cg of MEMORY_ALBUM_CGS) {
      expect(cg.id).toBeDefined();
      expect(cg.title).toBeDefined();
      expect(cg.subtitle).toBeDefined();
      expect(cg.characterName).toBeDefined();
      expect(cg.image).toContain('assets/cg/');
      expect(cg.unlockCondition).toBeDefined();
      expect(cg.storySnippet).toBeDefined();
      expect(cg.karmaBonus).toBeDefined();
    }
  });

  it('isCGUnlocked và unlockCG quản lý mở khóa và cộng điểm Karma chính xác', () => {
    const state = createInitialState();
    state.day = 1;
    state.karma = { community: 50, craftsmanship: 50, ambition: 50 };

    // Chưa đủ điều kiện
    expect(isCGUnlocked(state, 'cg_tet_reunion')).toBe(false);

    // Mở khóa thủ công
    const res = unlockCG(state, 'cg_tet_reunion');
    expect(res).toBe(true);
    expect(isCGUnlocked(state, 'cg_tet_reunion')).toBe(true);
    expect(state.unlockedCGIds).toContain('cg_tet_reunion');

    // Karma được cộng thưởng (+10 community, +5 craftsmanship)
    expect(state.karma.community).toBe(60);
    expect(state.karma.craftsmanship).toBe(55);

    // Mở khóa lại không cộng trùng
    const res2 = unlockCG(state, 'cg_tet_reunion');
    expect(res2).toBe(false);
    expect(state.karma.community).toBe(60);
  });

  it('syncEligibleCGs tự động phát hiện và mở khóa khi đạt mốc tiến trình', () => {
    const state = createInitialState();
    state.day = 5; // Day >= 3 -> Tự mở cg_rainy_shelter
    state.unlockedCGIds = [];

    const unlocked = syncEligibleCGs(state);
    expect(unlocked).toContain('cg_rainy_shelter');
    expect(state.unlockedCGIds).toContain('cg_rainy_shelter');
  });

  it('renderMemoryGalleryModal render tab album chứa ảnh polaroid và tiêu đề', () => {
    const state = createInitialState();
    state.day = 10;
    unlockCG(state, 'cg_rainy_shelter');

    const html = renderMemoryGalleryModal(state, 'album');

    expect(html).toContain('PHÒNG LƯU NIỆM KÝ ỨC HẺM 1102');
    expect(html).toContain('📸 Album Ảnh');
    expect(html).toContain('Chiều Mưa Dưới Mái Hiên');
    expect(html).toContain('cg-polaroid-card');
    expect(html).toContain('polaroid-photo-wrap');
  });

  it('STORY_ENDINGS chứa đầy đủ cgImage và epilogueDetails cho 6 đại kết cục', () => {
    const endingIds: (keyof typeof STORY_ENDINGS)[] = ['happy', 'open', 'bad_bankruptcy', 'bad_corporate', 'bad_police', 'secret'];
    for (const id of endingIds) {
      const ending = STORY_ENDINGS[id];
      expect(ending.cgImage).toBeDefined();
      expect(ending.epilogueDetails).toBeDefined();
      expect(ending.epilogueDetails!.length).toBeGreaterThan(0);
    }
  });

  it('renderEndingModal hiển thị ảnh CG minh họa, bảng vĩ thanh và nút New Game+', () => {
    const state = createInitialState();
    state.day = 100;
    state.activeEnding = 'happy';

    const html = renderEndingModal(state, 'happy');

    expect(html).toContain('BẾP LỬA HẺM 1102 & CHUỖI GÀ TRI KỶ');
    expect(html).toContain('ending-cg-frame');
    expect(html).toContain('ending-epilogue-box');
    expect(html).toContain('VĨ THANH HẺM 1102 & SỐ PHẬN NHÂN VẬT');
    expect(html).toContain('btn-restart-game-legacy');
    expect(html).toContain('CHƠI LẠI NEW GAME+');
  });
});
