import { describe, it, expect } from 'vitest';
import {
  getOrCreatePetPatio,
  petThePet,
  upgradePetPatio,
  checkDogGuardBonus,
  checkCatPestDefense
} from '../src/core/petPatioSystem';
import { renderPetPatioModal } from '../src/ui/components/PetPatioComponent';
import { createInitialState } from '../src/core/state';
import { renderHeader } from '../src/ui/components/Header';
import { renderChalkboard } from '../src/ui/components/Chalkboard';

describe('Weather Removal & Pet Sanctuary System', () => {
  describe('1. Clean HUD & Removal of Saigon Weather (Loại Bỏ Thời Tiết Khỏi HUD)', () => {
    it('ensures Header does not contain weather badge or weather text', () => {
      const state = createInitialState();
      const headerHtml = renderHeader(state);
      expect(headerHtml).not.toContain('h-weather-badge');
      expect(headerHtml).not.toContain('h-weather-icon');
    });

    it('ensures Chalkboard displays event badge cleanly without weather badge', () => {
      const state = createInitialState();
      const boardHtml = renderChalkboard(state, 'Trời Nắng Ráo');
      expect(boardHtml).toContain('event-badge');
      expect(boardHtml).not.toContain('weather-badge');
    });
  });

  describe('2. Pet Sanctuary & Patio (Góc Thú Cưng Hiên Quán)', () => {
    it('initializes patio with Cậu Vàng and Bé Mướp', () => {
      const state = createInitialState();
      const patio = getOrCreatePetPatio(state);

      expect(patio.unlocked).toBe(true);
      expect(patio.patioLevel).toBe(1);
      expect(patio.pets).toHaveLength(2);

      const dog = patio.pets.find(p => p.type === 'dog');
      const cat = patio.pets.find(p => p.type === 'cat');

      expect(dog).toBeDefined();
      expect(dog?.name).toContain('Chó Vàng');
      expect(cat).toBeDefined();
      expect(cat?.name).toContain('Mèo Mướp');
    });

    it('petting pet increases happiness and Karma Community once per day', () => {
      const state = createInitialState();
      const patio = getOrCreatePetPatio(state);
      const initialKarma = state.karma.community;
      const dog = patio.pets.find(p => p.id === 'pet_01_dog_vang')!;
      dog.happiness = 70;

      // Lần 1: Thành công
      const res1 = petThePet(state, 'pet_01_dog_vang');
      expect(res1.success).toBe(true);
      expect(dog.happiness).toBe(90);
      expect(dog.pettedToday).toBe(true);
      expect(state.karma.community).toBe(initialKarma + 2);
      expect(res1.sound).toBe('dog_bark');

      // Lần 2 trong ngày: Thất bại do đã no nê
      const res2 = petThePet(state, 'pet_01_dog_vang');
      expect(res2.success).toBe(false);
      expect(res2.message).toContain('no nê');
    });

    it('upgrades patio level when player has enough money', () => {
      const state = createInitialState();
      state.money = 500000;
      const patio = getOrCreatePetPatio(state);
      expect(patio.patioLevel).toBe(1);

      const upgradeRes = upgradePetPatio(state);
      expect(upgradeRes.success).toBe(true);
      expect(patio.patioLevel).toBe(2);
      expect(state.money).toBe(500000 - 250000);
      expect(patio.pets[0]!.happiness).toBe(100);
      expect(patio.pets[1]!.happiness).toBe(100);
    });

    it('fails upgrade when player has insufficient money', () => {
      const state = createInitialState();
      state.money = 50000;
      const patio = getOrCreatePetPatio(state);
      expect(patio.patioLevel).toBe(1);

      const upgradeRes = upgradePetPatio(state);
      expect(upgradeRes.success).toBe(false);
      expect(patio.patioLevel).toBe(1);
    });

    it('dog provides alert bonus against undercover thief', () => {
      const state = createInitialState();
      const patio = getOrCreatePetPatio(state);
      const dog = patio.pets.find(p => p.id === 'pet_01_dog_vang')!;
      dog.happiness = 80;

      const bonus = checkDogGuardBonus(state);
      expect(bonus.hasDogBonus).toBe(true);
      expect(bonus.extraSeconds).toBe(3);
      expect(bonus.alertText).toContain('Cậu Vàng sủa vang');
    });

    it('cat provides pest defense against rats in kitchen', () => {
      const state = createInitialState();
      const patio = getOrCreatePetPatio(state);
      const cat = patio.pets.find(p => p.id === 'pet_02_cat_muop')!;
      cat.happiness = 85;

      const defense = checkCatPestDefense(state);
      expect(defense.hasCatDefense).toBe(true);
      expect(defense.message).toContain('Bé Mướp');
    });

    it('renders pet patio modal correctly', () => {
      const state = createInitialState();
      const html = renderPetPatioModal(state);

      expect(html).toContain('modal-pet-patio');
      expect(html).toContain('GÓC THÚ CƯNG HIÊN QUÁN');
      expect(html).toContain('Cậu Vàng');
      expect(html).toContain('Bé Mướp');
      expect(html).toContain('btn-pet-action');
      expect(html).toContain('btn-upgrade-pet-patio');
    });
  });
});
