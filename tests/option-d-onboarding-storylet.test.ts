import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../src/core/state';
import { GameState, Storylet } from '../src/types/game';
import {
  meetsStoryletRequirements,
  getEligibleStorylets,
  pickNightStorylet,
  applyStoryletChoice
} from '../src/core/storyletEngine';
import { NIGHT_STORYLETS } from '../src/content/storylets';
import { renderOnboardingGuide, ONBOARDING_STEPS } from '../src/ui/components/OnboardingGuide';
import { renderSocialShareModal } from '../src/ui/components/SocialShareModal';
import { renderStoryletModal } from '../src/ui/components/StoryletModal';

describe('Option D: Storylet Narrative QBN & Onboarding Social Loop', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  describe('Storylet QBN Engine', () => {
    it('evaluates requirements correctly based on day and karma', () => {
      const mockStorylet: Storylet = {
        id: 'test_storylet_1',
        title: 'Thử nghiệm ký ức',
        characterId: 'char_06_granny_ba',
        characterName: 'Bác Ba',
        characterAvatar: '👵',
        setting: 'Hẻm 1102',
        narrativeLines: ['Dòng chữ tâm sự đêm muộn.'],
        choices: [
          {
            id: 'c1',
            label: 'Đồng ý',
            effect: {
              karmaDelta: { craftsmanship: 2 },
              moneyDelta: 10000,
              reactionNarrative: 'Bác Ba vui mừng.'
            }
          }
        ],
        requirements: {
          minDay: 2,
          maxDay: 5,
          minKarma: { craftsmanship: 1 }
        },
        oneShot: true
      };

      // Ngày 1: chưa đủ điều kiện
      state.day = 1;
      state.karma = { community: 0, craftsmanship: 0, ambition: 0 };
      expect(meetsStoryletRequirements(mockStorylet, state)).toBe(false);

      // Ngày 2 nhưng chưa đủ karma
      state.day = 2;
      expect(meetsStoryletRequirements(mockStorylet, state)).toBe(false);

      // Ngày 2 và đủ karma
      state.karma.craftsmanship = 1.5;
      expect(meetsStoryletRequirements(mockStorylet, state)).toBe(true);

      // Vượt quá maxDay (ngày 6)
      state.day = 6;
      expect(meetsStoryletRequirements(mockStorylet, state)).toBe(false);

      // Đã xem rồi (one-shot check)
      state.day = 3;
      state.seenStoryletIds = ['test_storylet_1'];
      expect(meetsStoryletRequirements(mockStorylet, state)).toBe(false);
    });

    it('picks the first eligible night storylet from the content bank', () => {
      state.day = 1;
      state.seenStoryletIds = [];
      const picked = pickNightStorylet(state, NIGHT_STORYLETS);
      expect(picked).not.toBeNull();
      expect(picked?.id).toBe('storylet_night_01_bac_ba_oil');
    });

    it('applies storylet choice effects and records seen ID', () => {
      const storylet = NIGHT_STORYLETS[0];
      const initialMoney = state.money;
      state.seenStoryletIds = [];

      const { effect, updatedState } = applyStoryletChoice(state, storylet, 'opt_craft_heart');
      expect(effect.karmaDelta?.craftsmanship).toBeGreaterThan(0);
      expect(updatedState.seenStoryletIds).toContain(storylet.id);
      expect(updatedState.karma.craftsmanship).toBeGreaterThan(0);
    });
  });

  describe('Day 1 Onboarding Guide', () => {
    it('renders step 1 guide on Day 1 for new players', () => {
      state.day = 1;
      state.onboardingGuideDismissed = false;
      state.onboardingGuideStep = 1;

      const html = renderOnboardingGuide(state);
      expect(html).toContain('onboarding-guide-banner');
      expect(html).toContain(ONBOARDING_STEPS[1].badge);
      expect(html).toContain('btn-skip-onboarding');
    });

    it('does not render if player dismissed the guide or is beyond Day 1', () => {
      state.day = 1;
      state.onboardingGuideDismissed = true;
      expect(renderOnboardingGuide(state)).toBe('');

      state.day = 2;
      state.onboardingGuideDismissed = false;
      expect(renderOnboardingGuide(state)).toBe('');
    });
  });

  describe('Social Share & Storylet Modals UI', () => {
    it('renders social share modal with room code and action buttons', () => {
      state.roomId = 'HEM1102';
      const html = renderSocialShareModal(state);
      expect(html).toContain('HEM1102');
      expect(html).toContain('btn-native-share-room');
      expect(html).toContain('btn-copy-room-link');
      expect(html).toContain('btn-download-room-poster');
    });

    it('renders storylet modal with narrative lines and choices', () => {
      const storylet = NIGHT_STORYLETS[0];
      const html = renderStoryletModal(storylet);
      expect(html).toContain(storylet.title);
      expect(html).toContain(storylet.setting);
      expect(html).toContain('storylet-choice-btn');
      expect(html).toContain('opt_craft_heart');
    });
  });
});
