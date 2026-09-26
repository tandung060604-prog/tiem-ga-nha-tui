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

  it('Bad Ending 3A: kích hoạt khi phá sản (tiền âm) hoặc sao < 2.5', () => {
    const state = createInitialState();
    state.day = 6;
    state.money = -50000;
    expect(evaluateEnding(state)).toBe('bad_bankruptcy');

    state.money = 200000;
    state.day = 16;
    state.ratings.overall = 2.2;
    expect(evaluateEnding(state)).toBe('bad_bankruptcy');
  });

  it('Secret Ending: kích hoạt khi đạt 5.0⭐, không cháy và tỷ lệ Perfect cao', () => {
    const state = createInitialState();
    state.day = 21;
    state.ratings.overall = 4.95;
    state.lifetimeStats = {
      totalFried: 100,
      totalBurnt: 0,
      totalRevenue: 20000000,
      perfectFriedCount: 90 // 90%
    };
    expect(evaluateEnding(state)).toBe('secret');
  });

  it('Bad Ending 3B: Tham vọng cực cao, xem nhẹ tình thân hẻm', () => {
    const state = createInitialState();
    state.day = 26;
    state.karma = { community: 25, craftsmanship: 40, ambition: 90 };
    expect(evaluateEnding(state)).toBe('bad_corporate');
  });

  it('Happy Ending: Tình thân và Bản sắc nghệ nhân đều cao, mở khóa 6 thư Thỏ Cam', () => {
    const state = createInitialState();
    state.day = 26;
    state.karma = { community: 85, craftsmanship: 85, ambition: 60 };
    state.unlockedBunnyLetters = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
    expect(evaluateEnding(state)).toBe('happy');
  });

  it('Open Ending: Kết thúc bình dị an yên khi không rơi vào trường hợp cực đoan', () => {
    const state = createInitialState();
    state.day = 26;
    state.karma = { community: 60, craftsmanship: 60, ambition: 50 };
    state.unlockedBunnyLetters = ['l1', 'l2'];
    expect(evaluateEnding(state)).toBe('open');
  });
});
