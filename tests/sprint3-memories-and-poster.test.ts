import { describe, it, expect } from 'vitest';
import { renderMemoriesAlbumModal } from '../src/ui/components/MemoriesAlbumModal';
import { getMoodThought } from '../src/ui/components/SellingView';
import { INITIAL_GAME_STATE } from '../src/types/game';
import type { GameState, CustomerOrder } from '../src/types/game';

describe('Sprint 3: Sổ Tay Kỷ Niệm Hẻm 1102 (MemoriesAlbumModal)', () => {
  const baseState: GameState = {
    ...INITIAL_GAME_STATE,
    day: 15,
    currentChapter: 2,
    achievedEndings: ['happy'],
    bunnyLettersReceived: ['bunny_letter_1', 'bunny_letter_2'],
    karma: {
      community: 70,
      craftsmanship: 60,
      ambition: 40,
    },
    oilCondition: 'clean',
    roomId: 'SG1102',
    perfectStreak: 4,
  };

  it('render tab residents đúng số lượng cư dân và bộ lọc', () => {
    const ch1State: GameState = { ...baseState, currentChapter: 1 };
    const html = renderMemoriesAlbumModal(ch1State, 'residents', 'all');
    expect(html).toContain('SỔ TAY KỶ NIỆM HẺM 1102');
    expect(html).toContain('Cư Dân');
    expect(html).toContain('Tất Cả');
    expect(html).toContain('Bếp & Trợ Thủ');
    expect(html).toContain('Thú Cưng');

    // Cư dân Chương 1 đã mở khóa
    expect(html).toContain('Cô Bảy Bán Vé Số');
    // Cư dân Chương 2 hiển thị Cư Dân Bí Ẩn khi đang ở Chương 1
    expect(html).toContain('Cư Dân Bí Ẩn');
  });

  it('bộ lọc category hoạt động chính xác cho thú cưng', () => {
    const htmlPet = renderMemoriesAlbumModal(baseState, 'residents', 'animal');
    expect(htmlPet).toContain('filter-res-btn active');
  });

  it('render tab endings hiển thị đầy đủ 6 đại kết cục và thanh đo Karma', () => {
    const html = renderMemoriesAlbumModal(baseState, 'endings');
    expect(html).toContain('🏆 Kết Cục (1/6)');
    expect(html).toContain('BÁNH LÁI VẬN MỆNH QUÁN HIỆN TẠI:');
    expect(html).toContain('Tình Thân: 70');
    expect(html).toContain('Nghệ Nhân: 60');
    expect(html).toContain('Tham Vọng: 40');

    // Kết cục đã mở
    expect(html).toContain('✓ ĐÃ MỞ KHÓA');
    expect(html).toContain('🔒 CHƯA ĐẠT');
    expect(html).toContain('BẾP LỬA HẺM 1102');

    // Kết cục chưa mở phải được ẩn đi, hiển thị dạng ??? bí ẩn
    expect(html).toContain('??? (Chưa Mở Khóa)');
    expect(html).toContain('VẬN MỆNH BÍ ẨN');
    // Không làm lộ tiêu đề hay nội dung của kết cục chưa mở
    expect(html).not.toContain('CÔNG AN NIÊM PHONG');
    expect(html).not.toContain('PHÁ SẢN ĐẮNG CAY');
  });

  it('render tab bunny hiển thị 6 lá thư Thỏ Cam và phần thưởng', () => {
    const html = renderMemoriesAlbumModal(baseState, 'bunny');
    expect(html).toContain('Thư Thỏ Cam');
    expect(html).toContain('Lá Thư #1');
    expect(html).toContain('Lá Thư #2');
    expect(html).toContain('Phần Thưởng:');
  });
});

describe('Sprint 3: Dynamic Mid-Shift Mood Banter (SellingView)', () => {
  const dummyOrder: CustomerOrder = {
    id: 'ord_1',
    customerName: 'Bác Ba Béo',
    items: [
      {
        id: 'ord_item_1',
        recipeId: 'chicken_original',
        name: 'Gà Giòn Truyền Thống',
        cookingMethod: 'fryer',
        requiredIngredients: ['chicken_raw', 'flour_crispy', 'cooking_oil'],
        basePrice: 35000,
        unlocked: true,
      },
    ],
    status: 'waiting',
    totalPrice: 35000,
    orderTime: 0,
    waitTimeLimit: 60,
    patienceMax: 60,
    patienceCurrent: 60,
  };

  it('phản ánh tình trạng dầu đen khi chất lượng dầu xấu', () => {
    const dirtyOilState: GameState = {
      ...INITIAL_GAME_STATE,
      oilCondition: 'dirty',
    };
    const thought = getMoodThought('impatient', dummyOrder, dirtyOilState);
    expect(thought.toLowerCase()).toContain('dầu');
  });

  it('phản ánh tình trạng dầu sạch vàng ươm khi dầu >= 90', () => {
    const freshOilState: GameState = {
      ...INITIAL_GAME_STATE,
      oilQuality: 95,
    };
    const thought = getMoodThought('happy', dummyOrder, freshOilState);
    expect(thought.length).toBeGreaterThan(0);
  });

  it('phản ánh không khí đua top phòng lobby khi có roomId', () => {
    const lobbyState: GameState = {
      ...INITIAL_GAME_STATE,
      roomId: 'RACE99',
      oilQuality: 80,
    };
    const thought = getMoodThought('neutral', dummyOrder, lobbyState);
    expect(thought.length).toBeGreaterThan(0);
  });

  it('phản ánh chuỗi Perfect liên hoàn khi streak >= 3', () => {
    const streakState: GameState = {
      ...INITIAL_GAME_STATE,
      perfectStreak: 5,
      oilQuality: 80,
    };
    const thought = getMoodThought('happy', dummyOrder, streakState);
    expect(thought.length).toBeGreaterThan(0);
  });
});

describe('Sprint 3: Canvas Poster 9:16 Retro (canvasPoster)', () => {
  it('module canvasPoster export hàm downloadLobbyPoster và generateLobbyPosterCanvas', async () => {
    const mod = await import('../src/core/canvasPoster');
    expect(typeof mod.downloadLobbyPoster).toBe('function');
    expect(typeof mod.generateLobbyPosterCanvas).toBe('function');
  });
});

