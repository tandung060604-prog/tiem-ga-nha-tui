import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../src/core/state';
import { GameState } from '../src/types/game';
import {
  ensureCharacterStoryState,
  isEpisodeUnlocked,
  getNextAvailableCharacterEpisode,
  resolveCharacterChoice,
  getCharacterProgressDetails,
  hasCausalityFlag
} from '../src/core/characterNarrativeEngine';
import { CHARACTER_EPISODES, getEpisodesByCharacter, getEpisodeById } from '../src/content/characterNarrativeArcs';

describe('Hệ Thống Biên Niên Ký Phân Nhánh Tuyến Nhân Vật Hẻm 1102 (Episodic Character Arcs)', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  describe('1. Cấu Trúc Dữ Liệu & Danh Sách Tập Truyện', () => {
    it('Đảm bảo danh sách tập truyện phong phú và không rỗng', () => {
      expect(CHARACTER_EPISODES.length).toBeGreaterThanOrEqual(15);
    });

    it('Mỗi tập truyện đều có đầy đủ tiêu đề, lời thoại, lựa chọn và tóm tắt Sổ Ký Ức', () => {
      for (const ep of CHARACTER_EPISODES) {
        expect(ep.id).toBeTruthy();
        expect(ep.characterId).toBeTruthy();
        expect(ep.title).toBeTruthy();
        expect(ep.dialogueLines.length).toBeGreaterThanOrEqual(1);
        expect(ep.choices.length).toBeGreaterThanOrEqual(1);
        expect(ep.summaryNote).toBeTruthy();

        // Kiểm tra các lựa chọn
        for (const choice of ep.choices) {
          expect(choice.id).toBeTruthy();
          expect(choice.label).toBeTruthy();
          expect(choice.reactionDialogue).toBeTruthy();
        }
      }
    });

    it('Truy vấn tập truyện theo nhân vật hoạt động chính xác', () => {
      const bacBaEpisodes = getEpisodesByCharacter('bac_ba');
      expect(bacBaEpisodes.length).toBeGreaterThanOrEqual(3);
      expect(bacBaEpisodes[0]!.episodeIndex).toBe(1);
      expect(bacBaEpisodes[1]!.episodeIndex).toBe(2);

      const thoCamEpisodes = getEpisodesByCharacter('tho_cam');
      expect(thoCamEpisodes.length).toBeGreaterThanOrEqual(3);

      const naEpisodes = getEpisodesByCharacter('le_bao_na');
      expect(naEpisodes.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('2. Logic Mở Khóa & Nguyên Tắc Không Lặp Lại (Non-Repeating)', () => {
    it('Tập 1 của Bác Ba mở khóa ở Ngày 1', () => {
      state.day = 1;
      const ep1 = getEpisodeById('bac_ba_ep_01')!;
      expect(isEpisodeUnlocked(state, ep1)).toBe(true);
    });

    it('Tập 2 của Bác Ba bị khóa ở Ngày 1 vì yêu cầu Ngày 4 và chưa xong Tập 1', () => {
      state.day = 1;
      const ep2 = getEpisodeById('bac_ba_ep_02')!;
      expect(isEpisodeUnlocked(state, ep2)).toBe(false);
    });

    it('Tập truyện đã hoàn thành thì tuyệt đối KHÔNG bao giờ mở khóa lại (100% Non-repeating)', () => {
      state.day = 1;
      const ep1 = getEpisodeById('bac_ba_ep_01')!;
      expect(isEpisodeUnlocked(state, ep1)).toBe(true);

      // Giải quyết lựa chọn
      resolveCharacterChoice(state, 'bac_ba_ep_01', 'bac_ba_01_taste_respect');

      // Kiểm tra lại: Tập 1 không còn được mở khóa nữa
      expect(isEpisodeUnlocked(state, ep1)).toBe(false);
    });

    it('Tập 2 mở khóa sau khi đã hoàn thành Tập 1 và đạt số ngày yêu cầu', () => {
      state.day = 5;
      const ep2 = getEpisodeById('bac_ba_ep_02')!;
      
      // Khi chưa xong tập 1 -> vẫn khóa
      expect(isEpisodeUnlocked(state, ep2)).toBe(false);

      // Hoàn thành tập 1
      resolveCharacterChoice(state, 'bac_ba_ep_01', 'bac_ba_01_taste_respect');

      // Giờ đã đủ điều kiện mở khóa tập 2
      expect(isEpisodeUnlocked(state, ep2)).toBe(true);
    });
  });

  describe('3. Giải Quyết Lựa Chọn & Nhân Quả Liên Ngày (Multi-day Causality)', () => {
    it('Lựa chọn tôn trọng tay nghề Bác Ba kích hoạt cờ bacba_respected_craft và tăng Karma', () => {
      state.day = 1;
      const initialCraft = state.karma.craftsmanship;
      const initialCommunity = state.karma.community;

      const { choice } = resolveCharacterChoice(state, 'bac_ba_ep_01', 'bac_ba_01_taste_respect');

      expect(choice.id).toBe('bac_ba_01_taste_respect');
      expect(hasCausalityFlag(state, 'bacba_respected_craft')).toBe(true);
      expect(state.karma.craftsmanship).toBeGreaterThan(initialCraft);
      expect(state.karma.community).toBeGreaterThan(initialCommunity);
    });

    it('Lựa chọn mời trà Bác Ba tặng tiền và cờ bacba_warm_heart', () => {
      state.day = 1;
      const initialMoney = state.money;

      resolveCharacterChoice(state, 'bac_ba_ep_01', 'bac_ba_01_community_tea');

      expect(hasCausalityFlag(state, 'bacba_warm_heart')).toBe(true);
      expect(state.money).toBeGreaterThan(initialMoney);
    });

    it('Tuyến Em Na: Phân nhánh con đường Múa (na_branch_dance_path) vs Song Bằng (na_branch_dual_path)', () => {
      state.day = 2;
      resolveCharacterChoice(state, 'na_ep_01', 'na_01_support_dance');
      expect(hasCausalityFlag(state, 'na_dance_encouraged')).toBe(true);

      state.day = 6;
      resolveCharacterChoice(state, 'na_ep_02', 'na_02_stand_for_passion');
      expect(hasCausalityFlag(state, 'na_branch_dance_path')).toBe(true);
      expect(hasCausalityFlag(state, 'na_branch_dual_path')).toBe(false);
    });
  });

  describe('4. Sổ Ký Ức & Lưu Trữ Lịch Sử Tiến Trình', () => {
    it('Lịch sử tiến trình nhân vật được lưu giữ chi tiết cho Sổ Ký Ức', () => {
      state.day = 1;
      resolveCharacterChoice(state, 'bac_ba_ep_01', 'bac_ba_01_taste_respect');

      state.day = 5;
      resolveCharacterChoice(state, 'bac_ba_ep_02', 'bac_ba_02_fight_for_alley');

      const details = getCharacterProgressDetails(state, 'bac_ba');
      expect(details.completedCount).toBe(2);
      expect(details.totalEpisodes).toBeGreaterThanOrEqual(3);
      expect(details.history.length).toBe(2);
      expect(details.history[0]!.episode.id).toBe('bac_ba_ep_01');
      expect(details.history[0]!.chosenOption.id).toBe('bac_ba_01_taste_respect');
      expect(details.history[1]!.episode.id).toBe('bac_ba_ep_02');
      expect(details.history[1]!.chosenOption.id).toBe('bac_ba_02_fight_for_alley');
    });

    it('Tập truyện tiếp theo ưu tiên xuất hiện theo thứ tự hợp lý', () => {
      state.day = 1;
      const nextEp = getNextAvailableCharacterEpisode(state);
      expect(nextEp).not.toBeNull();
      expect(nextEp?.unlockDay).toBeLessThanOrEqual(state.day);
    });
  });

  describe('5. Mở Rộng 5 Chương & Hơn 200 Ngày Kinh Doanh (Multi-Chapter Scope)', () => {
    it('Số lượng tập truyện mở rộng đạt quy mô lớn (>= 25 tập)', () => {
      expect(CHARACTER_EPISODES.length).toBeGreaterThanOrEqual(25);
    });

    it('Tập truyện bao phủ toàn bộ 5 Chương từ Chương 1 đến Chương 5', () => {
      const chaptersCovered = new Set(CHARACTER_EPISODES.map(ep => ep.unlockChapter || 1));
      expect(chaptersCovered.has(1)).toBe(true);
      expect(chaptersCovered.has(2)).toBe(true);
      expect(chaptersCovered.has(3)).toBe(true);
      expect(chaptersCovered.has(4)).toBe(true);
      expect(chaptersCovered.has(5)).toBe(true);
    });

    it('Tập truyện trải dài qua các mốc thời gian lớn: Ngày 50+, Ngày 100+, Ngày 150+, Ngày 200+', () => {
      const maxDay = Math.max(...CHARACTER_EPISODES.map(ep => ep.unlockDay));
      expect(maxDay).toBeGreaterThanOrEqual(210);

      const dayOver100 = CHARACTER_EPISODES.filter(ep => ep.unlockDay >= 100);
      expect(dayOver100.length).toBeGreaterThanOrEqual(5);

      const dayOver200 = CHARACTER_EPISODES.filter(ep => ep.unlockDay >= 200);
      expect(dayOver200.length).toBeGreaterThanOrEqual(2);
    });

    it('Chuỗi liên hoàn 5 Chương: Từ xe đẩy hẻm nhỏ đến Cúp Gà Vàng Toàn Quốc', () => {
      // Ngày 95: Đối mặt Mr. Mega
      state.day = 95;
      state.currentChapter = 3;
      const epMega = getEpisodeById('kinh_tron_ep_03')!;
      expect(epMega).toBeDefined();
      resolveCharacterChoice(state, 'kinh_tron_ep_03', 'mega_03_refuse_fierce');
      expect(hasCausalityFlag(state, 'mega_hostility_declared')).toBe(true);

      // Ngày 180: Khai trương chi nhánh Chợ Lớn cho Mimi
      state.day = 180;
      state.currentChapter = 5;
      const epMimiDir = getEpisodeById('tho_cam_ep_08')!;
      expect(epMimiDir).toBeDefined();
      resolveCharacterChoice(state, 'tho_cam_ep_08', 'tho_cam_08_appoint_director');
      expect(hasCausalityFlag(state, 'heritage_branch_thriving')).toBe(true);

      // Ngày 210: Đại kết cục Cúp Gà Vàng
      state.day = 210;
      const epGrand = getEpisodeById('kinh_tron_ep_05')!;
      expect(epGrand).toBeDefined();
      resolveCharacterChoice(state, 'kinh_tron_ep_05', 'kinh_tron_05_speech_community');
      expect(hasCausalityFlag(state, 'ultimate_legend_achieved')).toBe(true);
    });
  });
});
