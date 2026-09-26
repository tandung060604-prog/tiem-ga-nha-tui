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
