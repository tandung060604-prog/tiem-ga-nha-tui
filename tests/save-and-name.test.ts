import { describe, it, expect, beforeAll } from 'vitest';
import { normalizeShopName, DEFAULT_SHOP_NAME, SHOP_NAME_MAX } from '../src/core/shopName';
import { exportSaveCode, importSaveCode } from '../src/core/saveCode';
import { createInitialState, migrateSave } from '../src/core/state';
import { createSellingSession } from '../src/core/sellingSim';
import { CookingEngine } from '../src/core/cooking';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

describe('tên quán do chủ tiệm đặt', () => {
  it('làm sạch khoảng trắng / ký tự điều khiển, rỗng → tên mặc định', () => {
    expect(normalizeShopName('  Gà   Rán\nCô Ba  ')).toBe('Gà Rán Cô Ba');
    expect(normalizeShopName('   ')).toBe(DEFAULT_SHOP_NAME);
  });
  it(`tối đa ${SHOP_NAME_MAX} ký tự, không cắt đôi emoji`, () => {
    const name = normalizeShopName('🍗'.repeat(40));
    expect([...name].length).toBe(SHOP_NAME_MAX);
    expect(name).not.toContain('�');
  });
});

describe('mã sao lưu', () => {
  it('xuất rồi nhập lại → giữ nguyên tiến trình (kể cả tiếng Việt/emoji)', () => {
    const s = createInitialState();
    s.shopName = 'Gà Giòn Hẻm 14 🍗';
    s.day = 42;
    s.money = 12_345_000;
    const r = importSaveCode(exportSaveCode(s));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.tampered).toBe(false);
    expect(r.state).toMatchObject({ shopName: 'Gà Giòn Hẻm 14 🍗', day: 42, money: 12_345_000 });
  });

  it('mã bị sửa vẫn nhập được nhưng bị gắn cờ', () => {
    const code = exportSaveCode(createInitialState());
    const payload = JSON.parse(Buffer.from(code.slice(6), 'base64').toString('utf8'));
    payload.data = payload.data.replace('"money":850000', '"money":850001');
    const forged = 'TGNT1.' + Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    const r = importSaveCode(forged);
    expect(r.ok && r.tampered).toBe(true);
    expect(r.ok && r.state.integrity?.tampered).toBe(true);
  });

  it('mã rác / cụt → báo lỗi, không crash', () => {
    for (const bad of ['', 'hello', 'TGNT1.@@@', 'TGNT1.' + btoa('{"data":"{}"}')]) {
      expect(importSaveCode(bad).ok).toBe(false);
    }
  });
});

describe('thoát giữa ca bán → quay lại tiếp tục đúng chỗ', () => {
  const withShift = (day: number) => {
    const s = createInitialState();
    const session = createSellingSession();
    session.gameHour = 14.5;
    session.servedCount = 7;
    const cook = new CookingEngine();
    cook.startFrying('chicken');
    cook.addDrink();
    s.phase = 'selling';
    s.pausedShift = { day, session, cooking: cook.snapshot(), expectedCustomers: 18, bunnyVisited: true };
    return JSON.parse(JSON.stringify(s));
  };

  it('ca của đúng ngày → giữ pha bán hàng và toàn bộ ca', () => {
    const { state } = migrateSave(withShift(1))!;
    expect(state.phase).toBe('selling');
    expect(state.pausedShift?.session.gameHour).toBe(14.5);
    expect(state.pausedShift?.session.servedCount).toBe(7);
  });

  it('ảnh chụp của ngày khác (hoặc hỏng) → bỏ, về pha Chuẩn bị', () => {
    const { state } = migrateSave(withShift(3))!;
    expect(state.phase).toBe('prep');
    expect(state.pausedShift).toBeNull();
  });

  it('chảo + khay khôi phục y nguyên', () => {
    const a = new CookingEngine();
    a.startFrying('fries');
    a.updateFrying(2000);
    a.addDrink();
    const b = new CookingEngine();
    b.restore(JSON.parse(JSON.stringify(a.snapshot())));
    expect(b.getCookState()).toEqual(a.getCookState());
    expect(b.getTray().map(t => t.menuItemId)).toEqual(['soda']);
  });

  it('mã sao lưu không mang theo ca bán dở', () => {
    const r = importSaveCode(exportSaveCode(migrateSave(withShift(1))!.state));
    expect(r.ok && r.state.pausedShift).toBeNull();
  });
});

describe('mọi trường mới đều sống sót qua lần tải lại', () => {
  it('kết thúc đã đạt, cờ gian lận, Bác Ba đã giúp, chuỗi âm quỹ, số lần đặt cọc', () => {
    const s = createInitialState();
    s.achievedEndings = ['open'];
    s.integrity = { tampered: true, reasons: ['test'] };
    s.baBaAidChapter = 1;
    s.debtStreak = 2;
    s.currentChapter = 2;
    s.depositsPaid = 1;
    const { state } = migrateSave(JSON.parse(JSON.stringify(s)))!;
    expect(state.achievedEndings).toEqual(['open']);
    expect(state.integrity?.tampered).toBe(true); // lỗi cũ: tải lại trang là tẩy được cờ
    expect(state.baBaAidChapter).toBe(1);        // lỗi cũ: tải lại trang là Bác Ba giúp lại được
    expect(state.debtStreak).toBe(2);
    expect(state.depositsPaid).toBe(1);
  });
});
