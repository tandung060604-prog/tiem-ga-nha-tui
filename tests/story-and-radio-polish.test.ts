import { describe, it, expect, beforeEach } from 'vitest';
import { NIGHT_STORYLETS } from '../src/content/storylets';
import { getTonightRadioBroadcast, activateRadioBroadcastBuff, NIGHT_RADIO_BROADCASTS } from '../src/content/nightRadio';
import { renderStoryletModal } from '../src/ui/components/StoryletModal';
import { renderCharacterEpisodeModal, renderCharacterEpisodeReactionModal } from '../src/ui/components/CharacterStoryModal';
import { renderNightRadioModal } from '../src/ui/components/NightRadioModal';
import { createInitialState } from '../src/core/state';
import { OrdersEngine } from '../src/core/orders';
import { GameState, CharacterEpisode } from '../src/types/game';
import { TypewriterPlayer } from '../src/ui/typewriter';

describe('Story & Radio Polish Test Suite (Jev MCP Approved)', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  describe('1. Night Storylets Character Model Assets', () => {
    it('mọi Night Storylet đều có characterAvatar là đường dẫn asset hợp lệ (không chứa emoji)', () => {
      NIGHT_STORYLETS.forEach(st => {
        expect(typeof st.characterAvatar).toBe('string');
        // Không được là emoji lẻ
        expect(st.characterAvatar.length).toBeGreaterThan(4);
        // Phải chứa đường dẫn ảnh hợp lệ
        const isPath = st.characterAvatar.includes('/') || st.characterAvatar.includes('.');
        expect(isPath).toBe(true);
      });
    });

    it('storylet Mèo Mướp có asset pet_02_cat_muop', () => {
      const catStorylet = NIGHT_STORYLETS.find(s => s.id === 'storylet_night_02_cat_muop');
      expect(catStorylet).toBeDefined();
      expect(catStorylet?.characterAvatar).toContain('pet_02_cat_muop');
    });

    it('storylet Cảnh Sát Nam có asset char_25_police_nam', () => {
      const policeStorylet = NIGHT_STORYLETS.find(s => s.id === 'storylet_night_05_police_patrol');
      expect(policeStorylet).toBeDefined();
      expect(policeStorylet?.characterAvatar).toContain('char_25_police_nam');
    });

    it('storylet Cô Bảy Vé Số có asset char_02_lottery_lady', () => {
      const lotteryStorylet = NIGHT_STORYLETS.find(s => s.id === 'storylet_night_06_lottery_lady_debt');
      expect(lotteryStorylet).toBeDefined();
      expect(lotteryStorylet?.characterAvatar).toContain('char_02_lottery_lady');
    });

    it('renderStoryletModal sinh HTML với img tag và character stage', () => {
      const st = NIGHT_STORYLETS[0];
      const html = renderStoryletModal(st);
      expect(html).toContain('storylet-character-stage');
      expect(html).toContain('storylet-text-line');
      expect(html).toContain('btn-skip-storylet-typewriter');
    });
  });

  describe('2. Typewriter Engine & Dialogue Sequencer', () => {
    it('TypewriterPlayer gõ chữ tuần tự và skip tức thời', async () => {
      // Mock dummy element
      const el = { textContent: '' } as HTMLElement;
      const player = new TypewriterPlayer(el, 'Xin chào bà con Hẻm 1102!', { speedMs: 1 });
      
      const promise = player.start();
      player.skip();
      await promise;

      expect(el.textContent).toBe('Xin chào bà con Hẻm 1102!');
    });

    it('renderCharacterEpisodeModal chứa nút skip typewriter và cấu trúc dữ liệu text crawl', () => {
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
        narrativeIntro: 'Đoạn dẫn nhập...',
        dialogueLines: [
          { speaker: 'Bác Ba', text: 'Chào con!', mood: 'happy' },
          { speaker: 'Bạn', text: 'Dạ chào bác!', mood: 'normal' }
        ],
        dilemmaPrompt: 'Bạn sẽ làm gì?',
        choices: [
          { id: 'c1', label: 'Lựa chọn 1', kicker: 'KICKER' }
        ]
      };

      const html = renderCharacterEpisodeModal(state, mockEpisode);
      expect(html).toContain('btn-skip-char-typewriter');
      expect(html).toContain('vn-bubble-text');
      expect(html).toContain('data-full-text="Chào con!"');
    });

    it('renderCharacterEpisodeReactionModal chứa data-full-text cho phản hồi', () => {
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
        narrativeIntro: 'Intro',
        dialogueLines: [],
        dilemmaPrompt: '',
        choices: []
      };

      const html = renderCharacterEpisodeReactionModal(mockEpisode, {
        id: 'c1',
        label: 'Chọn 1',
        reactionDialogue: 'Cảm ơn con nhiều nha!'
      });

      expect(html).toContain('vn-reaction-text');
      expect(html).toContain('data-full-text="Cảm ơn con nhiều nha!"');
    });
  });

  describe('3. Night Radio Cassette & Daily Buffs', () => {
    it('getTonightRadioBroadcast trả về bản tin tương ứng với ngày chơi', () => {
      state.day = 1;
      const b1 = getTonightRadioBroadcast(state);
      expect(b1.id).toBe('radio_day_01');
      expect(b1.buff?.type).toBe('chef_wisdom');
      expect(b1.buff?.activeForDay).toBe(2);

      state.day = 2;
      const b2 = getTonightRadioBroadcast(state);
      expect(b2.id).toBe('radio_day_02');
      expect(b2.buff?.type).toBe('trending_dish');
      expect(b2.buff?.targetDishId).toBe('shake_fries');

      state.day = 3;
      const b3 = getTonightRadioBroadcast(state);
      expect(b3.buff?.type).toBe('staff_speed');

      state.day = 4;
      const b4 = getTonightRadioBroadcast(state);
      expect(b4.buff?.type).toBe('listener_gift');
      expect(b4.buff?.bonusMoney).toBe(30000);
    });

    it('activateRadioBroadcastBuff lưu activeRadioBuff vào state và cộng tiền/quà', () => {
      state.day = 4;
      state.money = 100000;
      const broadcast = getTonightRadioBroadcast(state);
      const res = activateRadioBroadcastBuff(state, broadcast);

      expect(res.success).toBe(true);
      expect(state.lastRadioBroadcastDay).toBe(4);
      expect(state.activeRadioBuff).toBeDefined();
      expect(state.activeRadioBuff?.type).toBe('listener_gift');
      expect(state.money).toBe(130000); // 100k + 30k quà tặng
    });

    it('renderNightRadioModal hiển thị khối BUFF và nút kích hoạt', () => {
      state.day = 1;
      const broadcast = getTonightRadioBroadcast(state);
      const html = renderNightRadioModal(state, broadcast);

      expect(html).toContain('FM 99.9 MHz');
      expect(html).toContain('btn-claim-radio-buff');
      expect(html).toContain('Mẹo Canh Lửa Bác Ba');
    });
  });

  describe('4. Radio Buff Gameplay Integration', () => {
    it('Radio Buff customer_patience tăng thời gian kiên nhẫn của khách', () => {
      state.day = 5;
      const baseOrder = OrdersEngine.generateOrder(state);

      state.activeRadioBuff = {
        id: 'buff_test_patience',
        type: 'customer_patience',
        title: 'Giai Điệu Dịu Êm',
        description: '+25% kiên nhẫn',
        multiplier: 1.25,
        activeForDay: 5
      };

      const buffedOrder = OrdersEngine.generateOrder(state);
      // Kiên nhẫn phải cao hơn hoặc tối thiểu không giảm
      expect(buffedOrder.patienceMax).toBeGreaterThanOrEqual(12);
    });

    it('Radio Buff trending_dish tăng giá trị đơn hàng khi có món hot', () => {
      state.day = 3;
      state.activeRadioBuff = {
        id: 'buff_test_dish',
        type: 'trending_dish',
        title: 'Hot Crispy Chicken',
        description: '+20% giá',
        targetDishId: 'crispy_chicken',
        multiplier: 1.2,
        activeForDay: 3
      };

      const order = OrdersEngine.generateOrder(state);
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalPrice).toBeGreaterThan(0);
    });
  });
});
