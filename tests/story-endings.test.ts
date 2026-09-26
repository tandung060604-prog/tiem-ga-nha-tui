import { describe, it, expect, beforeAll } from 'vitest';
import { STORY_ACTS, chooseDialogueOption } from '../src/content/storyNovel';
import { STORY_ENDINGS, applyKarmaChange, evaluateEnding } from '../src/content/endings';
import { createInitialState } from '../src/core/state';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

describe('Hệ Thống Visual Novel & Dilemma Phân Nhánh (Gemini 3 Narrative)', () => {
  it('đủ 5 Hồi truyện tương ứng với 5 Chương phát triển', () => {
    expect(STORY_ACTS.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      const act = STORY_ACTS[i];
      expect(act.act).toBe(i + 1);
      expect(act.chapterRequirement).toBe(i + 1);
      expect(act.dilemmaPrompt).toBeDefined();
      expect(act.options && act.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('không thể chọn nhánh cốt truyện của Hồi chưa mở khóa', () => {
    const state = createInitialState();
    state.currentChapter = 1; // Chỉ mở Hồi 1

    // Chọn Hồi 3 (yêu cầu chương 3)
    const res = chooseDialogueOption(state, 2, 'act3_opt_community');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Chưa mở khóa');
  });

  it('chọn lựa chọn phân nhánh: cập nhật Karma chính xác và không cho chọn lại', () => {
    const state = createInitialState();
    state.karma = { community: 50, craftsmanship: 50, ambition: 50 };

    // Chưa đọc hết Hồi 1 (chưa gom đủ tiền cọc Chương 1) → chưa được quyết định
    expect(chooseDialogueOption(state, 0, 'act1_opt_community').success).toBe(false);
    state.money = 5_000_000;

    // Hồi 1: Chọn nhánh tình thân hẻm ({ community: +15, craftsmanship: +5, ambition: -5 })
    const res = chooseDialogueOption(state, 0, 'act1_opt_community');
    expect(res.success).toBe(true);
    expect(state.karma.community).toBe(65);
    expect(state.karma.craftsmanship).toBe(55);
    expect(state.karma.ambition).toBe(45);
    expect(state.chosenDialogueIds).toContain('act1_opt_community');

    // Chọn lại lần nữa phải bị từ chối
    const res2 = chooseDialogueOption(state, 0, 'act1_opt_community');
    expect(res2.success).toBe(false);
    expect(res2.message).toContain('đã chọn');
  });

  it('hàm applyKarmaChange kẹp giá trị Karma luôn trong khoảng 0..100', () => {
    const k1 = applyKarmaChange({ community: 95, craftsmanship: 10, ambition: 50 }, { community: 20, craftsmanship: -30 });
    expect(k1.community).toBe(100);
    expect(k1.craftsmanship).toBe(0);
    expect(k1.ambition).toBe(50);
  });
});

describe('Ma Trận 5 Đại Kết Cục (Multi-Ending)', () => {
  it('đầy đủ 5 Đại Kết Cục theo Story Bible', () => {
    expect(STORY_ENDINGS.happy).toBeDefined();
    expect(STORY_ENDINGS.open).toBeDefined();
    expect(STORY_ENDINGS.bad_bankruptcy).toBeDefined();
    expect(STORY_ENDINGS.bad_corporate).toBeDefined();
    expect(STORY_ENDINGS.secret).toBeDefined();
  });

  });
