import { describe, it, expect } from 'vitest';
import { chapterProgress, depositStatus, depositForNextChapter, isTriggered } from '../src/core/progression';
import { MysteryBunnyEngine, BUNNY_LETTERS } from '../src/content/mysteryBunny';
import { closeDay, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';

const at = (chapter: number, money: number, stars = 4.8) => {
  const s = createInitialState();
  s.currentChapter = chapter;
  s.money = money;
  s.ratings = { taste: stars, speed: stars, hygiene: stars, space: stars, pricing: stars, overall: stars };
  return s;
};

describe('đặt cọc qua chương', () => {
  it('chưa đủ tiền hoặc sao thì không đặt cọc được', () => {
    expect(depositForNextChapter(at(1, 4_900_000))).toBeNull();
    expect(depositForNextChapter(at(1, 6_000_000, 3.0))).toBeNull();
    expect(depositStatus(at(1, 6_000_000, 3.0))).toMatchObject({ moneyOk: true, starsOk: false, ready: false });
  });

  it('đủ điều kiện: trừ đúng tiền cọc, sang chương kế', () => {
    const s = at(1, 6_000_000);
    expect(depositForNextChapter(s)).toBe(2);
    expect(s.money).toBe(6_000_000 - 3_500_000); // chỉ trả 70% của 5 triệu, giữ vốn nhập hàng
    expect(s.currentChapter).toBe(2);
  });

  it('chương 5 là chương cuối, không có đặt cọc', () => {
    expect(depositStatus(at(5, 2_000_000_000)).isFinal).toBe(true);
    expect(depositForNextChapter(at(5, 2_000_000_000))).toBeNull();
  });

  it('chốt ngày không còn tự nhảy chương dù đang giữ đủ tiền', () => {
    const s = at(1, 9_000_000);
    closeDay(s, createSellingSession(), eventForDay(s.day));
    expect(s.currentChapter).toBe(1);
  });

  it('tiến độ chương = tiền / tiền cọc, kẹp trong 0..1', () => {
    expect(chapterProgress(at(1, 2_500_000))).toBeCloseTo(0.5);
    expect(chapterProgress(at(1, -100))).toBe(0);
    expect(chapterProgress(at(1, 99_000_000))).toBe(1);
  });
});

describe('thư Thỏ Cam theo tiến độ chương (không lộ chuyện chương sau)', () => {
  it('ở chương N chỉ nhận thư của chương ≤ N, dù tiền nhiều đến đâu', () => {
    for (let ch = 1; ch <= 5; ch++) {
      const s = at(ch, 1e12);
      const reachable = BUNNY_LETTERS.filter(l => isTriggered(l.trigger, s));
      expect(reachable.every(l => l.trigger.chapter <= ch)).toBe(true);
    }
  });

  it('thư lễ Gà Vàng chỉ đến ở chương 5', () => {
    const award = BUNNY_LETTERS.find(l => l.id === 'bunny_letter_6')!;
    expect(award.trigger.chapter).toBe(5);
    for (let ch = 1; ch <= 4; ch++) expect(isTriggered(award.trigger, at(ch, 1e12))).toBe(false);
  });

  it('chưa gom đủ tiến độ thì chưa có thư', () => {
    expect(MysteryBunnyEngine.getScheduledLetter(at(1, 1_000_000))).toBeNull(); // 20% < 25%
    expect(MysteryBunnyEngine.getScheduledLetter(at(1, 1_300_000))?.id).toBe('bunny_letter_1');
  });

  it('đặt cọc trước khi kịp gặp thư chương cũ → thư vẫn đến ở chương sau, lần lượt từng thư', () => {
    const s = at(4, 0);
    s.unlockedBunnyLetters = ['bunny_letter_1', 'bunny_letter_2', 'bunny_letter_3'];
    expect(MysteryBunnyEngine.getScheduledLetter(s)?.id).toBe('bunny_letter_4');
  });
});
