import { describe, it, expect, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { renderCharacterEpisodeModal } from '../src/ui/components/CharacterStoryModal';
import { renderNightRadioModal } from '../src/ui/components/NightRadioModal';
import { renderInventoryTab } from '../src/ui/components/InventoryTab';
import { renderChalkboard } from '../src/ui/components/Chalkboard';
import { ASSETS } from '../src/content/assets';
import { radioAnnouncer } from '../src/core/radioAnnouncer';
import { audio } from '../src/core/audio';
import { CharacterEpisode } from '../src/types/game';

beforeAll(() => {
  audio.setMuted(true);
});

describe('Visual Novel Dialogue Two-Way RPG & Radio Voice Announcer', () => {
  describe('1. Ký Ức Hẻm: Đối Thoại Hai Chiều & Khắc Phục Bug Thiếu Thoại Chủ Tiệm', () => {
    it('tự động bổ sung lượt thoại của Tôi (Chủ Quán) khi tập phim chỉ có lời nhân vật', () => {
      const state = createInitialState();
      const mockSoloEpisode: CharacterEpisode = {
        id: 'test_ep_01',
        characterId: 'bac_ba',
        characterName: 'Bác Ba Tổ Trưởng',
        characterRole: 'Cựu Bếp Trưởng',
        avatar: '/assets/characters/bacba_front.png',
        title: 'Thử Nghiệm Lửa Nghề',
        subtitle: 'Bác Ba tâm sự',
        unlockChapter: 1,
        narrativeIntro: 'Bác Ba đứng nhìn chảo gà sôi tăm tắp...',
        dialogueLines: [
          { speaker: 'Bác Ba', text: 'Chảo dầu này phải canh kỹ con nghen.', mood: 'normal' },
          { speaker: 'Bác Ba', text: 'Nghề bếp quan trọng nhất là cái tâm.', mood: 'touched' }
        ],
        dilemmaPrompt: 'Bạn trả lời Bác Ba thế nào?',
        choices: [
          {
            id: 'c1',
            label: 'Dạ con ghi nhớ',
            kicker: 'LỄ PHÉP',
            reactionDialogue: 'Bác Ba cười khà khà'
          }
        ]
      };

      const html = renderCharacterEpisodeModal(state, mockSoloEpisode);

      // Phải có lượt thoại của cả hai phía (Hai Chiều)
      expect(html).toContain('is-npc-turn');
      expect(html).toContain('is-player-turn');
      expect(html).toContain('Tôi (Chủ Quán)');
      expect(html).toContain('/assets/characters/char_01_owner.png');
      expect(html).toContain('vn-bubble-box');
    });

    it('giữ nguyên lượt thoại của Bạn khi dữ liệu gốc đã có sẵn', () => {
      const state = createInitialState();
      const mockTwoWayEpisode: CharacterEpisode = {
        id: 'test_ep_02',
        characterId: 'linh',
        characterName: 'Linh Trợ Thủ',
        characterRole: 'Phụ Bếp',
        avatar: '/assets/characters/char_03_helper_linh.png',
        title: 'Ướp Gà Ca Sáng',
        subtitle: 'Linh chuẩn bị nguyên liệu',
        unlockChapter: 1,
        narrativeIntro: 'Linh đang xoa bột...',
        dialogueLines: [
          { speaker: 'Linh', text: 'Anh ơi, thau gà hôm nay ướp tiêu thơm nức luôn!', mood: 'happy' },
          { speaker: 'Bạn (Chủ Quán)', text: 'Cảm ơn Linh nghen, em nhớ để ráo nước trước khi lăn bột.', mood: 'normal' }
        ],
        dilemmaPrompt: 'Bạn dặn dò Linh thế nào?',
        choices: [
          { id: 'c1', label: 'Tốt lắm em', kicker: 'KHÍCH LỆ', reactionDialogue: 'Dạ anh!' }
        ]
      };

      const html = renderCharacterEpisodeModal(state, mockTwoWayEpisode);
      expect(html).toContain('is-npc-turn');
      expect(html).toContain('is-player-turn');
      expect(html).toContain('Cảm ơn Linh nghen');
    });
  });

  describe('2. Đài Phát Thanh Đêm: Phát Thanh Viên Tiếng Việt & Bíp Bíp', () => {
    it('renderNightRadioModal chứa nút nghe phát thanh viên tiếng Việt kèm bíp bíp', () => {
      const state = createInitialState();
      const broadcast = {
        channelName: 'Đài Phát Thanh Đêm Sài Gòn (FM 99.9 MHz)',
        headline: 'Chuyện Khuya Hẻm 1102',
        weatherCondition: 'Trời quang gió nhẹ',
        audioTranscript: 'Đêm nay hẻm 1102 bình yên dưới ánh trăng...',
        streetRumor: 'Mấy chú thợ hồ kháo nhau quán gà sắp có sốt mới.',
        forecastTomorrow: 'Ngày mai nắng ráo thuận lợi buôn bán.'
      };

      const html = renderNightRadioModal(state, broadcast);
      expect(html).toContain('btn-toggle-radio-voice');
      expect(html).toContain('GIỌNG ĐỌC ĐÀI ĐÊM (FM 99.9)');
      expect(html).toContain('Bíp bíp');
    });

    it('radioAnnouncer cung cấp đầy đủ API phát thanh viên và quản lý trạng thái an toàn', () => {
      expect(radioAnnouncer).toBeDefined();
      expect(typeof radioAnnouncer.broadcastTonight).toBe('function');
      expect(typeof radioAnnouncer.stop).toBe('function');
      expect(typeof radioAnnouncer.getSpeakingState).toBe('function');
      expect(typeof radioAnnouncer.addStatusListener).toBe('function');
    });
  });

  describe('3. Quản Lý Kho: Nút Thanh Toán Xấp Tiền Pixel Art', () => {
    it('renderInventoryTab chứa thanh quầy thanh toán tiền sỉ và nút có ảnh xấp tiền', () => {
      const state = createInitialState();
      const html = renderInventoryTab(state);

      expect(html).toContain('inv-cash-checkout-banner');
      expect(html).toContain('btn-inventory-cash-checkout');
      expect(html).toContain(ASSETS.ui.pixelCashStack);
      expect(html).toContain('THANH TOÁN XẤP TIỀN');
    });
  });

  describe('4. Hộc Tủ Đồ Nghề: Asset Pixel Art Tủ Gỗ Stardew Valley', () => {
    it('renderChalkboard hiển thị asset toolboxCabinet trong Hộc Tủ Đồ Nghề Bếp Gà', () => {
      const state = createInitialState();
      const html = renderChalkboard(state);

      expect(html).toContain('toolbox-cabinet-pixel-art');
      expect(html).toContain(ASSETS.ui.toolboxCabinet);
      expect(html).toContain('HỘC TỦ ĐỒ NGHỀ BẾP GÀ');
    });
  });
});
