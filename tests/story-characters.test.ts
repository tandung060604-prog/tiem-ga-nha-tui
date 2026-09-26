import { describe, it, expect } from 'vitest';
import { mentionsStoryCharacter } from '../src/content/storyCharacters';
import { CharacterGenerator } from '../src/content/characterGenerator';
import { INITIAL_CANDIDATES, generateCandidate } from '../src/content/staff';
import { GENZ_USERNAMES } from '../src/content/reviews';
import { seedRandom } from '../src/core/rng';

const offenders = (names: Iterable<string>) =>
  [...new Set(names)].map(n => [n, mentionsStoryCharacter(n)] as const).filter(([, hit]) => hit);

describe('nhân vật cốt truyện không bị sinh ngẫu nhiên', () => {
  it('bộ so khớp theo từ trọn vẹn', () => {
    expect(mentionsStoryCharacter('Chị Mai Kế Toán')).toBe('Mai');
    expect(mentionsStoryCharacter('Mai Anh')).toBe('Mai');
    expect(mentionsStoryCharacter('Bé Mít & Mẹ')).toBeNull();
    expect(mentionsStoryCharacter('Khánh Vy')).toBeNull();
  });

  it('khách ngẫu nhiên', () => {
    seedRandom(1);
    const names = Array.from({ length: 3000 }, () => CharacterGenerator.generateCharacter().name);
    expect(offenders(names)).toEqual([]);
  });

  it('ứng viên nhân viên (có sẵn + sinh ngẫu nhiên mọi chương)', () => {
    seedRandom(2);
    const names = [...INITIAL_CANDIDATES.map(c => c.name)];
    for (let ch = 1; ch <= 5; ch++) for (let i = 0; i < 300; i++) names.push(generateCandidate(ch).name);
    expect(offenders(names)).toEqual([]);
  });

  it('tên tài khoản viết review', () => {
    expect(offenders(GENZ_USERNAMES)).toEqual([]);
  });
});
