import { describe, it, expect } from 'vitest';
import { TypewriterPlayer, playDialogueSequence } from '../src/ui/typewriter';
import { renderStoryletModal } from '../src/ui/components/StoryletModal';
import { renderCharacterEpisodeModal } from '../src/ui/components/CharacterStoryModal';
import { NIGHT_STORYLETS } from '../src/content/storylets';
import { createInitialState } from '../src/core/state';
import { CharacterEpisode } from '../src/types/game';

function createMockElement(fullText = ''): any {
  return {
    textContent: '',
    style: {},
    className: '',
    getAttribute: (name: string) => (name === 'data-full-text' ? fullText : null),
    closest: () => ({ style: {} })
  };
}

describe('Đại Tu Visual Novel Dialogue UI & Pacing Hội Thoại Ký Sự Hẻm 1102', () => {
  describe('1. Pacing Chậm Rãi & Nhịp Dừng Nghỉ Dấu Câu (Coffee Talk x Stardew Valley)', () => {
    it('1.1. TypewriterPlayer gõ chữ mượt mà và dừng nghỉ tự nhiên theo dấu câu', async () => {
      const el = createMockElement();
      const text = 'Sài Gòn, đêm nay gió mát. Gà giòn rụm!';
      const player = new TypewriterPlayer(el as HTMLElement, text, { speedMs: 5, punctuationPause: true });

      const promise = player.start();
      player.skip();
      await promise;

      expect(el.textContent).toBe(text);
    });

    it('1.2. playDialogueSequence hoàn thành và kích hoạt callback onAllDone', async () => {
      const line1 = createMockElement('Câu 1');
      const line2 = createMockElement('Câu 2');

      let allDoneCalled = false;
      const { skipAll } = await playDialogueSequence(
        [
          { textEl: line1 as HTMLElement, fullText: 'Câu 1' },
          { textEl: line2 as HTMLElement, fullText: 'Câu 2' }
        ],
        {
          speedMs: 2,
          onAllDone: () => {
            allDoneCalled = true;
          }
        }
      );

      skipAll();
      expect(allDoneCalled).toBe(true);
      expect(line1.textContent).toBe('Câu 1');
      expect(line2.textContent).toBe('Câu 2');
    });
  });

  describe('2. Khay Lựa Chọn Chỉ Bung Ra Sau Khi Cuộc Hội Thoại Kết Thúc', () => {
    it('2.1. renderStoryletModal tạo bảng lựa chọn ban đầu bị ẩn hoàn toàn (display: none)', () => {
      const st = NIGHT_STORYLETS[0];
      const html = renderStoryletModal(st);

      // Chứa cấu trúc Visual Novel Theatre chuẩn phong cách game
      expect(html).toContain('vn-dialogue-theatre');
      expect(html).toContain('vn-dialogue-box');
      expect(html).toContain('vn-choice-card');
      expect(html).toContain('storylet-character-stage');

      // Khay lựa chọn ban đầu ẩn
      expect(html).toContain('id="storylet-choices-section"');
      expect(html).toContain('display: none');
      expect(html).toContain('opacity: 0');
      expect(html).toContain('LỰA CHỌN CỦA CHỦ TIỆM GÀ');
    });

    it('2.2. renderStoryletModal chứa đầy đủ các thẻ bài quyết định và kicker', () => {
      const st = NIGHT_STORYLETS[0];
      const html = renderStoryletModal(st);

      expect(html).toContain('btn-skip-storylet-typewriter');
      expect(html).toContain('storylet-choice-btn');
      expect(html).toContain(st.choices[0].label);
    });

    it('2.3. renderCharacterEpisodeModal tạo câu hỏi và lựa chọn ban đầu bị ẩn hoàn toàn (display: none)', () => {
      const state = createInitialState();
      const mockEpisode: CharacterEpisode = {
        id: 'test_ep_01',
        characterId: 'bac_ba',
        characterName: 'Bác Ba',
        characterRole: 'Tổ Trưởng',
        avatar: '/assets/characters/char_06_granny_ba.png',
        episodeIndex: 1,
        title: 'Tập Thử Nghiệm',
        subtitle: 'Bản Thử',
        unlockDay: 1,
        narrativeIntro: 'Intro bối cảnh...',
        dialogueLines: [
          { speaker: 'Bác Ba', text: 'Chào con!', mood: 'happy' }
        ],
        dilemmaPrompt: 'Bạn sẽ làm gì?',
        choices: [
          { id: 'c1', label: 'Lựa chọn 1', kicker: 'KICKER' }
        ]
      };

      const html = renderCharacterEpisodeModal(state, mockEpisode);
      expect(html).toContain('vn-dialogue-theatre');
      expect(html).toContain('id="vn-dilemma-container"');
      expect(html).toContain('id="vn-choices-container"');
      expect(html).toContain('display: none');
      expect(html).toContain('vn-choice-card');
      expect(html).toContain('btn-skip-char-typewriter');
    });
  });
});
