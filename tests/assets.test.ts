import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { ASSETS } from '../src/content/assets';

const paths = (o: object): string[] => Object.values(o).flatMap(v => (typeof v === 'string' ? [v] : paths(v)));

describe('asset registry', () => {
  it.each(paths(ASSETS))('%s tồn tại trong public/ (chạy `npm run assets` nếu thiếu)', p => {
    expect(existsSync(`public${p}`)).toBe(true);
  });
});

import { foodImage } from '../src/content/assets';

describe('ảnh món theo chất lượng', () => {
  it('gà giòn: sống / cháy / chín có ảnh riêng', () => {
    expect(foodImage('crispy_chicken', 'raw')).toContain('raw');
    expect(foodImage('crispy_chicken', 'burnt')).toContain('burnt');
    expect(foodImage('crispy_chicken', 'perfect')).toContain('perfect');
    expect(foodImage('crispy_chicken', 'good')).toContain('perfect');
  });
  it('mọi món trong thực đơn đều có ảnh concept chất lượng cao', () => {
    expect(foodImage('shake_fries', 'perfect')).toContain('fries');
    expect(foodImage('soda', 'good')).toContain('soda');
    expect(foodImage('spicy_chicken', 'perfect')).toContain('spicy');
    expect(foodImage('honey_garlic_chicken', 'perfect')).toContain('honey');
    expect(foodImage('chicken_burger', 'perfect')).toContain('burger');
    expect(foodImage('korean_tokbokki_chicken', 'perfect')).toContain('tokbokki');
    expect(foodImage('spicy_thigh', 'perfect')).toContain('spicy_thigh');
    expect(foodImage('cheese_stick', 'perfect')).toContain('cheese_stick');
    expect(foodImage('danmuji', 'perfect')).toContain('danmuji');
    expect(foodImage('coleslaw', 'perfect')).toContain('coleslaw');
    expect(foodImage('unknown_food_xyz', 'perfect')).toBeNull();
  });
});
