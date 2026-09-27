import { describe, it, expect } from 'vitest';
import { CHARACTERS_36, getCharacterProfile, isPetAdopted } from '../src/content/characters36';

describe('hệ thống 36 nhân vật Hẻm 1102 & tuyến 3 động vật', () => {
  it('đúng 36 nhân vật trong ma trận 6x6', () => {
    expect(CHARACTERS_36.length).toBe(36);
  });

  it('mọi nhân vật có đầy đủ thông tin chuẩn contract', () => {
    for (const char of CHARACTERS_36) {
      expect(char.id).toBeTruthy();
      expect(char.name).toBeTruthy();
      expect(char.roleTitle).toBeTruthy();
      expect(['staff', 'regular', 'street_worker', 'authority', 'transit', 'animal']).toContain(char.category);
      expect(char.unlockChapter).toBeGreaterThanOrEqual(1);
      expect(['community', 'craftsmanship', 'ambition']).toContain(char.karmaAffinity);
      expect(['low', 'normal', 'generous']).toContain(char.tipTendency);
    }
  });

  it('tuyến 3 động vật đặc biệt ở hàng cuối được định nghĩa chính xác', () => {
    const dog = getCharacterProfile('pet_01_dog_vang');
    const cat = getCharacterProfile('pet_02_cat_muop');
    const rat = getCharacterProfile('pest_01_rat_cong');

    expect(dog).toBeDefined();
    expect(dog?.category).toBe('animal');
    expect(dog?.name).toContain('Chó Cỏ Vàng');

    expect(cat).toBeDefined();
    expect(cat?.category).toBe('animal');
    expect(cat?.name).toContain('Mèo Mướp');

    expect(rat).toBeDefined();
    expect(rat?.category).toBe('animal');
    expect(rat?.name).toContain('Chuột Cống');
  });

  it('hàm helper isPetAdopted nhận diện chính xác', () => {
    expect(isPetAdopted('pet_01_dog_vang', ['pet_01_dog_vang'])).toBe(true);
    expect(isPetAdopted('pet_02_cat_muop', ['pet_01_dog_vang'])).toBe(false);
    expect(isPetAdopted('pet_01_dog_vang', undefined)).toBe(false);
  });
});
