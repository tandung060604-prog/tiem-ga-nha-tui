import { describe, it, expect } from 'vitest';
import {
  generateOilCrumbs,
  calculateFilterResult,
  OIL_FILTER_CONFIG
} from '../src/core/oilFilter';

describe('Oil Filter Minigame Core Logic (tests/oilFilter.test.ts)', () => {
  it('1. generateOilCrumbs generates exactly 8 crumbs nicely positioned inside the pan (15-85%)', () => {
    const crumbs = generateOilCrumbs(8, 42);
    expect(crumbs).toHaveLength(8);

    crumbs.forEach(crumb => {
      expect(crumb.x).toBeGreaterThanOrEqual(15);
      expect(crumb.x).toBeLessThanOrEqual(85);
      expect(crumb.y).toBeGreaterThanOrEqual(15);
      expect(crumb.y).toBeLessThanOrEqual(85);
      expect(crumb.size).toBeGreaterThanOrEqual(30);
      expect(crumb.collected).toBe(false);
    });
  });

  it('2. calculateFilterResult handles 100% full success on dirty oil (dirty -> medium, saves 150k)', () => {
    const result = calculateFilterResult(8, 8, 'dirty');
    expect(result.success).toBe(true);
    expect(result.isPartial).toBe(false);
    expect(result.newCondition).toBe('medium');
    expect(result.savedMoney).toBe(150000);
    expect(result.hygieneBonus).toBe(OIL_FILTER_CONFIG.fullHygieneBonus);
  });

  it('3. calculateFilterResult handles 100% full success on medium oil (medium -> clean, saves 150k)', () => {
    const result = calculateFilterResult(8, 8, 'medium');
    expect(result.success).toBe(true);
    expect(result.newCondition).toBe('clean');
    expect(result.savedMoney).toBe(150000);
  });

  it('4. calculateFilterResult handles 100% success on clean oil (rewards bonus 20k)', () => {
    const result = calculateFilterResult(8, 8, 'clean');
    expect(result.success).toBe(true);
    expect(result.newCondition).toBe('clean');
    expect(result.bonusReward).toBe(20000);
  });

  it('5. calculateFilterResult handles partial success (60%+ crumbs, discounts 50% = 75k)', () => {
    const result = calculateFilterResult(5, 8, 'dirty'); // 5/8 = 62.5%
    expect(result.success).toBe(true);
    expect(result.isPartial).toBe(true);
    expect(result.savedMoney).toBe(75000);
    expect(result.newCondition).toBe('dirty');
  });

  it('6. calculateFilterResult handles failure (<60% crumbs collected)', () => {
    const result = calculateFilterResult(3, 8, 'dirty'); // 3/8 = 37.5%
    expect(result.success).toBe(false);
    expect(result.isPartial).toBe(false);
    expect(result.savedMoney).toBe(0);
    expect(result.newCondition).toBe('dirty');
  });
});
