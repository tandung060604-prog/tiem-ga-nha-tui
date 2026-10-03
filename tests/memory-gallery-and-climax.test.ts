import { describe, it, expect, vi } from 'vitest';
import { renderMemoryGalleryModal, bindMemoryGalleryEvents } from '../src/ui/components/MemoryGalleryModal';
import { renderEndingModal, bindEndingEvents } from '../src/ui/components/EndingModal';
import { STORY_ACTS, chooseDialogueOption } from '../src/content/storyNovel';
import { STORY_ENDINGS } from '../src/content/endings';
import { GameState } from '../src/types/game';

function createMockState(): GameState {
  return {
    day: 105,
    money: 50000000,
    shopName: 'Tiệm Gà Thơm Lừng',
    currentChapter: 5,
    phase: 'prep',
    reputation: 90,
    cleanliness: 95,
    oilQuality: 'clean',
    oilUses: 2,
    freeOilFilterUsed: true,
    ratings: {
      overall: 4.95,
      taste: 5.0,
      service: 4.9,
      cleanliness: 5.0,
      price: 4.9,
      speed: 4.9
    },
    inventory: [],
    menu: [],
    staff: [],
    dayHistory: [],
    bestReviews: [],
    unlockedStoryActs: [1, 2, 3, 4, 5],
    completedQuests: [],
    bunnyVisitsCount: 12,
    unlockedBunnyLetters: ['bunny_letter_1', 'bunny_letter_2'],
    karma: {
      community: 85,
      craftsmanship: 90,
      ambition: 40
    },
    activeEnding: 'happy',
    achievedEndings: ['happy', 'open'],
    seenStoryletIds: ['storylet_night_01_bac_ba_oil', 'storylet_night_02_cat_muop'],
    lifetimeStats: {
      totalFried: 250,
      totalBurnt: 2,
      totalRevenue: 6500000,
      perfectFriedCount: 220
    }
  } as unknown as GameState;
}

describe('Option A: Narrative Climax & Memory Gallery Suite', () => {
  it('STORY_ACTS contains 5 acts and Act 4 & 5 have enriched choices', () => {
    expect(STORY_ACTS).toHaveLength(5);
    const act4 = STORY_ACTS.find(a => a.act === 4);
    expect(act4).toBeDefined();
    expect(act4?.options).toBeDefined();
    expect(act4?.options?.length).toBeGreaterThanOrEqual(3);
    expect(act4?.characters).toContain('Mr. Mega Peter Hoàng');

    const act5 = STORY_ACTS.find(a => a.act === 5);
    expect(act5).toBeDefined();
    expect(act5?.options).toBeDefined();
    expect(act5?.options?.length).toBeGreaterThanOrEqual(3);
    expect(act5?.characters).toContain('Mimi An Thỏ Cam');
  });

  it('chooseDialogueOption updates karma for Act 4 choices correctly', () => {
    const state = createMockState();
    state.currentChapter = 5;
    state.money = 50000000;
    state.karma = { community: 50, craftsmanship: 50, ambition: 50 };
    state.chosenDialogueIds = [];

    const res = chooseDialogueOption(state, 3, 'act4_opt_community');
    expect(res.success).toBe(true);
    expect(state.karma.community).toBe(70);
    expect(state.karma.craftsmanship).toBe(65);
    expect(state.karma.ambition).toBe(45);
    expect(state.chosenDialogueIds).toContain('act4_opt_community');
  });

  it('chooseDialogueOption updates karma for Act 5 choices correctly', () => {
    const state = createMockState();
    state.currentChapter = 5;
    state.money = 350000000;
    state.karma = { community: 50, craftsmanship: 50, ambition: 50 };
    state.chosenDialogueIds = [];

    const res = chooseDialogueOption(state, 4, 'act5_opt_craft');
    expect(res.success).toBe(true);
    expect(state.karma.craftsmanship).toBe(80);
    expect(state.karma.community).toBe(65);
    expect(state.chosenDialogueIds).toContain('act5_opt_craft');
  });

  it('renderMemoryGalleryModal renders all 4 tabs with appropriate state data', () => {
    const state = createMockState();

    // Tab endings
    const endingsHtml = renderMemoryGalleryModal(state, 'endings');
    expect(endingsHtml).toContain('PHÒNG LƯU NIỆM KÝ ỨC HẺM 1102');
    expect(endingsHtml).toContain('BẾP LỬA HẺM 1102 & CHUỖI GÀ TRI KỶ');
    expect(endingsHtml).toContain('GIÓ HẺM THỔI MÃI');
    expect(endingsHtml).toContain('ĐÃ ĐẠT');
    expect(endingsHtml).toContain('VẬN MỆNH CHƯA KHÁM PHÁ');
    expect(endingsHtml).toContain('btn-replay-ending');
    expect(endingsHtml).toContain('btn-close-gallery');

    // Tab storylets
    const storyletsHtml = renderMemoryGalleryModal(state, 'storylets');
    expect(storyletsHtml).toContain('Ngọn Lửa Sau Giờ Đóng Cửa');
    expect(storyletsHtml).toContain('Vị Khách Bốn Chân Mái Tôn');
    expect(storyletsHtml).toContain('ĐÃ LƯU');
    expect(storyletsHtml).toContain('KÝ ỨC ĐÊM CHƯA MỞ');

    // Tab letters
    const lettersHtml = renderMemoryGalleryModal(state, 'letters');
    expect(lettersHtml).toContain('MẢNH GIẤY #1');
    expect(lettersHtml).toContain('Đã đọc');
    expect(lettersHtml).toContain('CHƯA NHẬN ĐƯỢC');

    // Tab milestones
    const milestonesHtml = renderMemoryGalleryModal(state, 'milestones');
    expect(milestonesHtml).toContain('Trăm Ngày Khởi Nghiệp');
    expect(milestonesHtml).toContain('Đôi Tay Vàng Giòn');
    expect(milestonesHtml).toContain('Bảo Vật Chiếc Vá Vàng');
    expect(milestonesHtml).toContain('Đã hoàn thành');
  });

  it('bindMemoryGalleryEvents handles missing DOM elements gracefully in node environment', () => {
    const onSwitchTab = vi.fn();
    const onReplayEnding = vi.fn();
    const onClose = vi.fn();

    // Trong môi trường Node không có document, hàm không ném exception
    expect(() => {
      bindMemoryGalleryEvents(onSwitchTab, onReplayEnding, onClose);
    }).not.toThrow();
  });

  it('renderEndingModal includes gallery button and displays title and excerpt', () => {
    const state = createMockState();
    const html = renderEndingModal(state, 'happy');
    expect(html).toContain('Xem Phòng Ký Ức Hẻm 1102');
    expect(html).toContain('BẾP LỬA HẺM 1102 & CHUỖI GÀ TRI KỶ');
    expect(html).toContain('btn-open-gallery-from-ending');
    expect(html).toContain('btn-close-ending');
    expect(html).toContain('btn-restart-game');

    const onClose = vi.fn();
    const onRestart = vi.fn();
    const onOpenGallery = vi.fn();

    // bindEndingEvents handles missing DOM elements gracefully
    expect(() => {
      bindEndingEvents(onClose, onRestart, onOpenGallery, 'happy');
    }).not.toThrow();
  });
});
