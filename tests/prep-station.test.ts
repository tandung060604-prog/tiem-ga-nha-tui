import { describe, it, expect, beforeAll } from 'vitest';
import { prepStationSlots, PREP_LAYOUT } from '../src/core/prepStation';
import { scoopSide } from '../src/core/day';
import { CookingEngine } from '../src/core/cooking';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState, migrateSave } from '../src/core/state';
import { FRY_RECIPES, fryingItemId } from '../src/core/staff';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

describe('quầy khay inox GN', () => {
  it('luôn dựng đủ khay ở mọi chương (giao diện không co giãn khi mở món)', () => {
    const s = createInitialState();
    for (let ch = 1; ch <= 5; ch++) {
      s.currentChapter = ch;
      const slots = prepStationSlots(s);
      expect(slots).toHaveLength(PREP_LAYOUT.length);
      expect(slots.filter(x => x.row === 'top').every(x => x.pan === '1-6')).toBe(true);
      expect(slots.filter(x => x.row === 'bottom').every(x => x.pan === '1-3')).toBe(true);
    }
  });

  it('ngày 1: gà + khoai + củ cải mở; má đùi khóa "Ngày 2", gà viên khóa "Chương 3", phô mai que khóa "Ngày 3"', () => {
    const slot = (id: string) => prepStationSlots(createInitialState()).find(x => x.id === id)!;
    expect(slot('chicken').status).toBe('ready');
    expect(slot('danmuji').status).toBe('ready');
    expect(slot('thigh').lock).toMatchObject({ kind: 'day', label: 'Ngày 2' });
    expect(slot('cheese').lock).toMatchObject({ kind: 'day', label: 'Ngày 3' });
    expect(slot('popcorn').lock).toMatchObject({ kind: 'chapter', label: 'Chương 3' });
    expect(slot('yangnyeom').lock).toMatchObject({ kind: 'chapter', label: 'Chương 2' });
  });

  it('tới ngày nhưng chưa ký hợp đồng → khóa kèm phí; hết hàng → khay rỗng', () => {
    const s = createInitialState();
    s.day = 4;
    const cheese = () => prepStationSlots(s).find(x => x.id === 'cheese')!;
    expect(cheese().lock).toMatchObject({ kind: 'contract', label: 'Hợp đồng 40k' });
    s.inventory.cheese_stick_raw!.unlocked = true;
    expect(cheese().status).toBe('empty');
    s.inventory.cheese_stick_raw!.amount = 6;
    expect(cheese()).toMatchObject({ status: 'ready', stock: 6 });
  });
});

describe('món mới ở bếp', () => {
  it('má đùi và phô mai que ra đúng món khi vớt', () => {
    expect(fryingItemId('thigh', null)).toBe('spicy_thigh');
    expect(fryingItemId('cheese', 'spicy')).toBe('cheese_stick'); // sốt chỉ phủ gà miếng
    const cook = new CookingEngine();
    cook.startFrying(FRY_RECIPES.cheese_stick!.type);
    cook.updateFrying(2500); // phô mai chín nhanh gấp 1,3
    expect(cook.liftFryer().trayItem?.menuItemId).toBe('cheese_stick');
  });

  it('múc củ cải: trừ kho, vào khay; bắp cải chưa tới Chương 2 thì khóa', () => {
    const s = createInitialState();
    const session = createSellingSession();
    const cook = new CookingEngine();
    const before = s.inventory.danmuji!.amount;
    expect(scoopSide(s, session, cook, 'danmuji')).toBe('ok');
    expect(s.inventory.danmuji!.amount).toBe(before - 1);
    expect(cook.getTray()[0]?.menuItemId).toBe('danmuji');
    expect(scoopSide(s, session, cook, 'coleslaw')).toBe('locked');
  });

  it('save cũ: món đổi tên theo content, giữ giá đã chỉnh; có đủ nguyên liệu mới', () => {
    const old = createInitialState() as unknown as Record<string, unknown>;
    const menu = old.menu as { id: string; name: string; currentPrice: number }[];
    const spicy = menu.find(m => m.id === 'crispy_chicken')!;
    spicy.name = 'Gà Giòn Nhà Tui';
    spicy.currentPrice = 38000;
    old.menu = menu.filter(m => m.id !== 'danmuji');
    delete (old.inventory as Record<string, unknown>).chicken_thigh;
    const { state } = migrateSave(JSON.parse(JSON.stringify(old)))!;
    const chicken = state.menu.find(m => m.id === 'crispy_chicken')!;
    expect(chicken.name).toBe('Gà Rán Giòn Truyền Thống');
    expect(chicken.currentPrice).toBe(38000);
    expect(state.menu.some(m => m.id === 'danmuji')).toBe(true);
    expect(state.inventory.chicken_thigh).toBeDefined();
  });
});
