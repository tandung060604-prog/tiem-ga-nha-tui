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
  it('khoai, nước có ảnh; món chưa có ảnh trả null để dùng emoji', () => {
    expect(foodImage('shake_fries', 'perfect')).toContain('fries');
    expect(foodImage('soda', 'good')).toContain('soda');
    expect(foodImage('spicy_chicken', 'perfect')).toBeNull();
  });
});
