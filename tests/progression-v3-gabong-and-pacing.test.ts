import { describe, it, expect } from 'vitest';
import { BUNNY_LETTERS, BUNNY_RANDOM_VISIT_NOTES, MysteryBunnyEngine } from '../src/content/mysteryBunny';
import { INITIAL_UPGRADES } from '../src/content/upgrades';
import { DAILY_INCIDENTS } from '../src/content/dailyIncidents';
import { SIGNATURE_STORY_DISHES } from '../src/content/signatureStoryDishes';
import { renderBunnyAlbumModal } from '../src/ui/components/BunnyModal';
import { renderMemoriesAlbumModal } from '../src/ui/components/MemoriesAlbumModal';
import { renderEndingModal } from '../src/ui/components/EndingModal';
import { STORY_ENDINGS } from '../src/content/endings';
import { GameState } from '../src/types/game';

function createMockGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    day: 1,
    currentChapter: 1,
    money: 500000,
    ratings: { overall: 5.0, food: 5.0, service: 5.0, hygiene: 5.0 },
    inventory: {
      chicken_meat: { amount: 20, quality: 'good', cost: 15000 },
      cooking_oil: { amount: 10, quality: 'good', cost: 20000 },
      flour: { amount: 10, quality: 'good', cost: 10000 }
    },
    menu: [],
    upgrades: [],
    staff: [],
    recentReviews: [],
    unlockedBunnyLetters: [],
    seenIncidentIds: [],
    ...overrides
  } as unknown as GameState;
}

describe('Bộ Truyện 18 Mảnh Giấy Nhớ Bé Gà Bông (Mystery Bunny Masterpiece)', () => {
  it('BUNNY_LETTERS có đúng 18 bức thư ký ức trải dài qua 5 Hồi / 5 Chương', () => {
    expect(BUNNY_LETTERS.length).toBe(18);

    // Kiểm tra tính duy nhất của ID
    const ids = BUNNY_LETTERS.map(l => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(18);

    // Kiểm tra các chương 1, 2, 3, 4, 5 đều có thư tương ứng
    const chapters = new Set(BUNNY_LETTERS.map(l => l.trigger.chapter));
    expect(chapters.has(1)).toBe(true);
    expect(chapters.has(2)).toBe(true);
    expect(chapters.has(3)).toBe(true);
    expect(chapters.has(4)).toBe(true);
    expect(chapters.has(5)).toBe(true);
  });

  it('Mỗi mảnh giấy đều có đầy đủ title, preferredFood, rewardText và storyImpact phong phú', () => {
    BUNNY_LETTERS.forEach((letter) => {
      expect(letter.title).toBeTruthy();
      expect(letter.noteContent.length).toBeGreaterThan(30);
      expect(letter.preferredFood).toBeTruthy();
      expect(letter.rewardText).toBeTruthy();
      expect(letter.storyImpact).toBeTruthy();
      expect(letter.trigger.atProgress).toBeGreaterThanOrEqual(0);
      expect(letter.trigger.atProgress).toBeLessThanOrEqual(1.0);
    });
  });

  it('Các tầng Plot Twist được lồng ghép tinh tế (Bác Ba, MegaChicken, danh tính An / Chicky)', () => {
    const allNotesText = BUNNY_LETTERS.map(l => l.noteContent).join(' ');
    expect(allNotesText).toContain('Bác Ba');
    expect(allNotesText).toContain('MegaChicken');
    expect(allNotesText).toContain('khăn len cam');
    expect(allNotesText).toContain('An');
  });

  it('BUNNY_RANDOM_VISIT_NOTES phản ánh đúng hình tượng Bé Gà Bông Chicky', () => {
    expect(BUNNY_RANDOM_VISIT_NOTES.length).toBeGreaterThanOrEqual(5);
    const allGreetings = BUNNY_RANDOM_VISIT_NOTES.join(' ');
    expect(allGreetings).toContain('Gà Bông');
    expect(allGreetings).toContain('cánh');
  });

  it('MysteryBunnyEngine hoạt động chính xác với 18 thư', () => {
    // Chương 1, progress 0.26 (1.300.000 / 5.000.000) -> thư 1
    const s1 = createMockGameState({ currentChapter: 1, money: 1300000, unlockedBunnyLetters: [] });
    const letter1 = MysteryBunnyEngine.getScheduledLetter(s1);
    expect(letter1?.id).toBe('bunny_letter_1');

    // Nếu đã mở thư 1 thì trả về thư tiếp theo hoặc null nếu chưa đủ mốc
    const s2 = createMockGameState({ currentChapter: 1, money: 1300000, unlockedBunnyLetters: ['bunny_letter_1'] });
    const letterNext = MysteryBunnyEngine.getScheduledLetter(s2);
    expect(letterNext).toBeNull();
  });
});

describe('Cơ Chế Nâng Cấp Xe Đẩy Vỉa Hè (Cart Progression)', () => {
  it('INITIAL_UPGRADES có nhánh cart với 3 cấp độ thực tế từ xe inox đến dù bạt và đèn neon', () => {
    const cartBranch = INITIAL_UPGRADES.cart;
    expect(cartBranch).toBeDefined();
    expect(cartBranch.tiers.length).toBe(3);

    const [tier1, tier2, tier3] = cartBranch.tiers;
    expect(tier1.cost).toBe(0);
    expect(tier2.cost).toBe(50000);
    expect(tier2.minDay).toBe(3);
    expect(tier3.cost).toBe(120000);
    expect(tier3.minDay).toBe(5);
  });
});

describe('Sự Kiện Thực Tế F&B Ngày 2: Đội Trật Tự Đô Thị & Y Tế Phường', () => {
  it('DAILY_INCIDENTS có incident_urban_patrol ở Ngày 2 với các lựa chọn thực tế', () => {
    const incident = DAILY_INCIDENTS.find(i => i.id === 'incident_urban_patrol');
    expect(incident).toBeDefined();
    expect(incident?.minDay).toBe(2);
    expect(incident?.title).toContain('Đội Trật Tự Đô Thị');
    expect(incident?.choices.length).toBe(2);

    const choiceA = incident?.choices[0];
    const choiceB = incident?.choices[1];
    expect(choiceA).toBeDefined();
    expect(choiceB).toBeDefined();
  });
});

describe('Món Signature Gà Bông & Cốt Truyện Gà Vàng', () => {
  it('dish_ga_lac_thocam gắn với cốt truyện Bé Gà Bông (An)', () => {
    const signature = SIGNATURE_STORY_DISHES.find(d => d.id === 'dish_ga_lac_thocam');
    expect(signature).toBeDefined();
    expect(signature?.name).toContain('Gà Bông');
    expect(signature?.associatedCharacter).toContain('An');
  });
});

describe('Giao Diện Dynamic Không Hardcode /6 và Thể Hiện Đủ 18 Thư Gà Bông', () => {
  it('renderBunnyAlbumModal hiển thị đúng tổng số thư 18 và tab tương ứng', () => {
    const state = createMockGameState({ unlockedBunnyLetters: ['bunny_letter_1', 'bunny_letter_2'] });
    const html = renderBunnyAlbumModal(state, 0);

    expect(html).toContain('2/18');
    expect(html).toContain('Sổ Ký Ức Gà Bông');
    expect(html).toContain('Mảnh Giấy #1');
    expect(html).toContain('Mảnh Giấy #18');
    expect(html).not.toContain('/6');
  });

  it('renderMemoriesAlbumModal render tab Thư Gà Bông với tỉ lệ trên tổng 18', () => {
    const state = createMockGameState({ unlockedBunnyLetters: ['bunny_letter_1'] });
    const html = renderMemoriesAlbumModal(state, 'bunny');

    expect(html).toContain('1/18');
    expect(html).toContain('Gà Bông');
    expect(html).not.toContain('(1/6)');
  });

  it('renderEndingModal hiển thị Kỷ Niệm Gà Bông với số lượng thực tế', () => {
    const state = createMockGameState({ unlockedBunnyLetters: ['bunny_letter_1', 'bunny_letter_2', 'bunny_letter_3'] });
    const html = renderEndingModal(state, 'happy');

    expect(html).toContain('3/18');
    expect(html).toContain('Kỷ Niệm Gà Bông');
    expect(html).not.toContain('3/6');
  });
});
