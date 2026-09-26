import { describe, it, expect } from 'vitest';
import { migrateSave, createInitialState } from '../src/core/state';

const good = () => JSON.parse(JSON.stringify(createInitialState()));

describe('đọc save game (migrateSave)', () => {
  it('save hợp lệ giữ nguyên tiến độ, không báo sửa gì', () => {
    const raw = good();
    raw.money = 1234000;
    raw.day = 9;
    const r = migrateSave(raw)!;
    expect(r.state.money).toBe(1234000);
    expect(r.state.day).toBe(9);
    expect(r.repaired).toEqual([]);
  });

  it('trường hỏng được thay bằng mặc định, các trường khác giữ nguyên', () => {
    const raw = good();
    raw.money = null;          // JSON hóa NaN sẽ thành null
    raw.day = 12;
    raw.ratings.taste = 'abc';
    const r = migrateSave(raw)!;
    expect(r.state.money).toBe(createInitialState().money);
    expect(r.state.day).toBe(12);
    expect(r.state.ratings.taste).toBe(createInitialState().ratings.taste);
    expect(r.repaired).toEqual(expect.arrayContaining(['money', 'ratings.taste']));
  });

  it('bản cập nhật thêm nguyên liệu/món mới: save cũ được bổ sung, không crash', () => {
    const raw = good();
    delete raw.inventory.soft_drink;
    raw.menu = raw.menu.filter((m: { id: string }) => m.id !== 'soda');
    const r = migrateSave(raw)!;
    expect(r.state.inventory.soft_drink?.amount).toBeGreaterThan(0);
    expect(r.state.menu.some(m => m.id === 'soda')).toBe(true);
  });

  it('save cũ chưa có lô kho được chuyển thành lô', () => {
    const raw = good();
    delete raw.inventory.flour.batches;
    raw.inventory.flour.amount = 7;
    expect(migrateSave(raw)!.state.inventory.flour?.batches).toEqual([{ amount: 7, daysLeft: 10 }]);
  });

  it('đang dở ca bán lúc tắt trang → về pha Chuẩn bị', () => {
    const raw = good();
    raw.phase = 'selling';
    expect(migrateSave(raw)!.state.phase).toBe('prep');
  });

  it('không phải save v2 hoặc không phải object → null (caller sao lưu rồi tạo game mới)', () => {
    expect(migrateSave({ version: 1 })).toBeNull();
    expect(migrateSave('rác')).toBeNull();
    expect(migrateSave(null)).toBeNull();
  });
});
