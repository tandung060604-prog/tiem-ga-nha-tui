import { describe, it, expect } from 'vitest';
import { applyKarmaChange, evaluateEnding, STORY_ENDINGS } from '../src/content/endings';
import { createInitialState } from '../src/core/state';
import { GameState } from '../src/types/game';

describe('Hệ thống Nghiệp Cảm Karma (applyKarmaChange)', () => {
  it('cộng trừ điểm karma chuẩn xác và giới hạn trong khoảng 0 đến 100', () => {
    const initial = { community: 50, craftsmanship: 50, ambition: 50 };
    
    // Tăng điểm
    const boosted = applyKarmaChange(initial, { community: 20, craftsmanship: -10, ambition: 60 });
    expect(boosted.community).toBe(70);
    expect(boosted.craftsmanship).toBe(40);
    expect(boosted.ambition).toBe(100); // kẹp max 100

    // Giảm điểm dưới 0
    const clamped = applyKarmaChange(boosted, { community: -100, craftsmanship: -50 });
    expect(clamped.community).toBe(0); // kẹp min 0
    expect(clamped.craftsmanship).toBe(0);
    expect(clamped.ambition).toBe(100);
  });
});

describe('Đánh giá 5 Đại Kết Cục (evaluateEnding)', () => {
  it('trả về null khi game đang diễn ra bình thường ở các ngày đầu', () => {
    const state = createInitialState();
    state.day = 10;
    state.money = 2_000_000;
    state.ratings.overall = 4.5;
    expect(evaluateEnding(state)).toBeNull();
  });

  it('Secret Ending: Đạt 5.0 sao suốt 20 ngày, 0 miếng gà cháy, tỷ lệ Perfect >= 85%', () => {
    const state = createInitialState();
    state.day = 20;
    state.ratings.overall = 4.95;
    state.lifetimeStats = {
      totalFried: 100,
      totalBurnt: 0,
      totalRevenue: 50_000_000,
      perfectFriedCount: 90
    };
    expect(evaluateEnding(state)).toBe('secret');
  });

  it('Bad Ending 3A (Phá sản): nợ tiền sau Ngày 5 hoặc sao dưới 2.5 sau Ngày 15', () => {
    const state = createInitialState();
    state.day = 6;
    state.money = -50_000;
    expect(evaluateEnding(state)).toBe('bad_bankruptcy');

    state.money = 1_000_000;
    state.day = 16;
    state.ratings.overall = 2.3;
    expect(evaluateEnding(state)).toBe('bad_bankruptcy');
  });

  it('Bad Ending 3B (Cỗ máy gà vô hồn): Tham vọng >= 85 và Tình hẻm < 40 ở cuối game', () => {
    const state = createInitialState();
    state.day = 25;
    state.currentChapter = 5;
    state.karma = { community: 35, craftsmanship: 60, ambition: 90 };
    expect(evaluateEnding(state)).toBe('bad_corporate');
  });

  it('Happy Ending (Đại viên mãn): Tình hẻm >= 75, Tay nghề >= 75 và mở đủ 6 thư Thỏ Cam', () => {
    const state = createInitialState();
    state.day = 25;
    state.currentChapter = 5;
    state.karma = { community: 85, craftsmanship: 80, ambition: 60 };
    state.unlockedBunnyLetters = [
      'bunny_letter_1', 'bunny_letter_2', 'bunny_letter_3',
      'bunny_letter_4', 'bunny_letter_5', 'bunny_letter_6'
    ];
    expect(evaluateEnding(state)).toBe('happy');
  });

  it('Open Ending (Bình dị an yên): Về đích ở Chương 5/Ngày 25 mà không rơi vào các cực đoan', () => {
    const state = createInitialState();
    state.day = 25;
    state.currentChapter = 5;
    state.karma = { community: 60, craftsmanship: 60, ambition: 50 };
    state.unlockedBunnyLetters = ['bunny_letter_1', 'bunny_letter_2'];
    expect(evaluateEnding(state)).toBe('open');
  });

  it('mọi StoryEndingId đều có nội dung định nghĩa đầy đủ trong STORY_ENDINGS', () => {
    const ids = ['happy', 'open', 'bad_bankruptcy', 'bad_corporate', 'secret'] as const;
    for (const id of ids) {
      const ending = STORY_ENDINGS[id];
      expect(ending).toBeDefined();
      expect(ending.title.length).toBeGreaterThan(0);
      expect(ending.excerpt.length).toBeGreaterThan(0);
      expect(ending.themeClass.length).toBeGreaterThan(0);
      expect(ending.kicker.length).toBeGreaterThan(0);
    }
  });
});
