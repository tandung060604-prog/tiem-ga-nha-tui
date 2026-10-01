import { describe, it, expect } from 'vitest';
import { getWeatherForDay, SAIGON_WEATHERS } from '../src/content/saigonWeather';
import {
  getOrCreatePetPatio,
  petThePet,
  upgradePetPatio,
  checkDogGuardBonus,
  checkCatPestDefense
} from '../src/core/petPatioSystem';
import { renderPetPatioModal } from '../src/ui/components/PetPatioComponent';
import { renderWeatherAtmosphereStrip, renderWeatherChalkboardBadge } from '../src/ui/components/WeatherAtmosphere';
import { createInitialState } from '../src/core/state';

describe('Dynamic Saigon Weather & Pet Sanctuary System', () => {
  describe('1. Dynamic Saigon Weather (Thời Tiết Sài Gòn Động)', () => {
    it('provides all 5 Saigon signature weather types with balanced multipliers', () => {
      const weatherKeys = Object.keys(SAIGON_WEATHERS);
      expect(weatherKeys).toContain('sunny_hot');
      expect(weatherKeys).toContain('sudden_rain');
      expect(weatherKeys).toContain('cool_breeze');
      expect(weatherKeys).toContain('thunderstorm');
      expect(weatherKeys).toContain('golden_sunset');

      // Nắng gắt: đơn ship tăng vọt, nước tăng mạnh
      const sunny = SAIGON_WEATHERS.sunny_hot;
      expect(sunny.deliveryMultiplier).toBeGreaterThan(1.0);
      expect(sunny.walkupDrinkMultiplier).toBeGreaterThan(1.0);
      expect(sunny.oilHeatModifier).toBeGreaterThan(0);

      // Mưa rào: khách ăn tại quán tăng vọt
      const rain = SAIGON_WEATHERS.sudden_rain;
      expect(rain.dineInMultiplier).toBeGreaterThan(1.0);
      expect(rain.patienceModifier).toBeGreaterThan(1.0);
    });

    it('generates consistent weather for each day', () => {
      const w1 = getWeatherForDay(1);
      const w1Repeat = getWeatherForDay(1);
      expect(w1.id).toBe(w1Repeat.id);

      const w2 = getWeatherForDay(2);
      expect(w2.name).toBeTruthy();
      expect(w2.icon).toBeTruthy();
      expect(w2.flavorQuote).toBeTruthy();
    });

    it('renders weather HTML components correctly', () => {
      const weather = SAIGON_WEATHERS.sudden_rain;
      const stripHtml = renderWeatherAtmosphereStrip(weather);
      expect(stripHtml).toContain('weather-atmosphere-strip');
      expect(stripHtml).toContain(weather.badgeText);
      expect(stripHtml).toContain(weather.icon);

      const badgeHtml = renderWeatherChalkboardBadge(weather);
      expect(badgeHtml).toContain('weather-badge');
      expect(badgeHtml).toContain(weather.name);
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
