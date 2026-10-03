import { describe, it, expect } from 'vitest';
import { BUNNY_LETTERS, BUNNY_RANDOM_VISIT_NOTES } from '../src/content/mysteryBunny';
import { INITIAL_UPGRADES } from '../src/content/upgrades';
import { BASE_DAILY_INCIDENTS } from '../src/content/dailyIncidents';
import { SIGNATURE_STORY_DISHES } from '../src/content/signatureStoryDishes';
import { PREP_TUTORIAL_STEPS } from '../src/core/tutorial';

describe('Plan V3 Progression & Bé Gà Bông Lore Masterpiece', () => {
  describe('18 Mảnh Giấy Nhớ Bé Gà Bông (18 Gà Bông Memos)', () => {
    it('should have exactly 18 letters spanning Chapters 1 through 5', () => {
      expect(BUNNY_LETTERS).toHaveLength(18);
    });

    it('each letter should have valid structural properties and meaningful narrative content', () => {
      BUNNY_LETTERS.forEach((letter, index) => {
        expect(letter.id).toBe(`bunny_letter_${index + 1}`);
        expect(letter.title).toBeTruthy();
        expect(letter.noteContent.length).toBeGreaterThan(30);
        expect(letter.trigger.chapter).toBeGreaterThanOrEqual(1);
        expect(letter.trigger.chapter).toBeLessThanOrEqual(5);
        expect(letter.preferredFood).toBeTruthy();
        expect(letter.tip).toBeGreaterThanOrEqual(0);
        expect(letter.rewardText).toBeTruthy();
      });
    });

    it('should reflect the 3 Plot Twists at letters 6, 12, and 18', () => {
      // Plot Twist 1 (Letter 6): Manh mối đen về R&D tập đoàn
      const letter6 = BUNNY_LETTERS[5];
      expect(letter6.title).toContain('Manh Mối Đen');
      expect(letter6.noteContent).toContain('R&D');

      // Plot Twist 2 (Letter 12): Đối đầu trực diện MegaChicken
      const letter12 = BUNNY_LETTERS[11];
      expect(letter12.title).toContain('Review Bẩn');
      expect(letter12.noteContent).toContain('MegaChicken');

      // Plot Twist 3 / Epilogue (Letter 18): An chính là người bạn tri kỷ & Epilogue
      const letter18 = BUNNY_LETTERS[17];
      expect(letter18.title).toContain('AN BẾP TRƯỞNG');
      expect(letter18.noteContent).toContain('An');
    });

    it('random visit notes should be in tone with Bé Gà Bông', () => {
      expect(BUNNY_RANDOM_VISIT_NOTES.length).toBeGreaterThanOrEqual(5);
      const combinedNotes = BUNNY_RANDOM_VISIT_NOTES.join(' ');
      expect(combinedNotes).toContain('Gà Bông');
    });
  });

  describe('Đồ Nghề Xe Đẩy Vỉa Hè (Cart Branch)', () => {
    it('should contain a 3-tier cart upgrade progression', () => {
      const cartBranch = INITIAL_UPGRADES.cart;
      expect(cartBranch).toBeDefined();
      expect(cartBranch.tiers).toHaveLength(3);

      const [cart1, cart2, cart3] = cartBranch.tiers;
      expect(cart1.level).toBe(1);
      expect(cart1.cost).toBe(0);
      expect(cart1.minDay).toBe(1);

      expect(cart2.level).toBe(2);
      expect(cart2.cost).toBe(50000);
      expect(cart2.minDay).toBe(3);

      expect(cart3.level).toBe(3);
      expect(cart3.cost).toBe(120000);
      expect(cart3.minDay).toBe(5);
    });
  });

  describe('Sự Kiện Đột Xuất Thực Tế F&B (Urban Patrol)', () => {
    it('should trigger urban patrol incident on Day 2', () => {
      const patrolIncident = BASE_DAILY_INCIDENTS.find(inc => inc.id === 'incident_urban_patrol');
      expect(patrolIncident).toBeDefined();
      expect(patrolIncident?.minDay).toBe(2);
      expect(patrolIncident?.choices).toHaveLength(2);
      expect(patrolIncident?.choices[0].label).toContain('xe đẩy');
    });
  });

  describe('Signature Dishes & Visual Lore Consistency', () => {
    it('signature dish dish_ga_lac_thocam should be renamed to Gà Lắc Bé Gà Bông', () => {
      const signatureDish = SIGNATURE_STORY_DISHES.find(d => d.id === 'dish_ga_lac_thocam');
      expect(signatureDish).toBeDefined();
      expect(signatureDish?.name).toContain('Gà Bông');
      expect(signatureDish?.storyContext).toContain('An');
    });
  });

  describe('Streamlined Prep Tutorial Pacing', () => {
    it('should have 4 streamlined steps for Day 1 prep phase', () => {
      expect(PREP_TUTORIAL_STEPS).toEqual([
        'prep-welcome',
        'prep-inventory',
        'prep-menu',
        'prep-start'
      ]);
    });
  });
});
