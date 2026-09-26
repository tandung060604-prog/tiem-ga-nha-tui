import { describe, it, expect } from 'vitest';
import { auditState, signSave, flagIntegrity, isTampered } from '../src/core/integrity';
import { createInitialState, migrateSave } from '../src/core/state';
import { creditSale, requestBaBaAid, closeDay, eventForDay, applyBunnyReward } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { depositForNextChapter } from '../src/core/progression';
import { evaluateEnding } from '../src/content/endings';
import { CHAPTERS } from '../src/content/chapters';
import { GameState, CustomerOrder } from '../src/types/game';

describe('không bắt oan người chơi thật', () => {
  it('bán hàng, nhận thưởng, đặt cọc, chốt ngày hợp lệ → sổ sách sạch', () => {
    const s = createInitialState();
    for (let d = 0; d < 30; d++) {
      creditSale(s, 400000, 20000);
      closeDay(s, createSellingSession(), eventForDay(s.day));
      s.day += 1;
    }
    applyBunnyReward(s, { isBunny: true, bunnyLetterId: 'bunny_letter_1' } as CustomerOrder);
    s.ratings.overall = 4.5;
    expect(depositForNextChapter(s)).toBe(2);
    expect(auditState(s)).toEqual([]);
    expect(isTampered(s)).toBe(false);
  });

  it('save cũ (trước khi có sổ chống gian lận) không bị coi là gian lận', () => {
    const old = JSON.parse(JSON.stringify(createInitialState()));
    old.money = 9_000_000;              // từng nhận thưởng Thỏ Cam nhưng không được ghi
    old.lifetimeStats.totalRevenue = 6_000_000;
    delete old.lifetimeStats.totalBonus;
    old.currentChapter = 2;              // từng tự qua chương theo luật cũ
    delete old.depositsPaid;
    expect(auditState(migrateSave(old)!.state)).toEqual([]);
  });
});

describe('bắt các kiểu gian lận phổ biến', () => {
  const tamper = (fn: (s: GameState) => void) => { const s = createInitialState(); fn(s); return auditState(s); };

  it('sửa tiền trong localStorage', () => {
    expect(tamper(s => { s.money = 999_999_999; }).join()).toContain('vượt tổng thu nhập');
  });
  it('tự nhảy chương không đặt cọc', () => {
    expect(tamper(s => { s.currentChapter = 5; }).join()).toContain('không qua đặt cọc');
  });
  it('sửa số liệu chiên / sao', () => {
    expect(tamper(s => { s.lifetimeStats.perfectFriedCount = 50; }).length).toBeGreaterThan(0);
    expect(tamper(s => { s.ratings.overall = 9; }).length).toBeGreaterThan(0);
  });
  it('chữ ký save: sửa một ký tự là lệch', () => {
    const json = JSON.stringify(createInitialState());
    expect(signSave(json)).toBe(signSave(json));
    expect(signSave(json.replace('850000', '850001'))).not.toBe(signSave(json));
  });
  it('đã bị gắn cờ thì không tẩy được, và không được công nhận kết thúc Viên mãn', () => {
    const s = createInitialState();
    s.currentChapter = 5;
    s.depositsPaid = 4;
    s.money = CHAPTERS.find(c => c.number === 5)!.targetMoney;
    s.karma = { community: 90, craftsmanship: 90, ambition: 50 };
    s.unlockedBunnyLetters = ['a', 'b', 'c', 'd', 'e', 'f'];
    flagIntegrity(s, ['Save bị chỉnh sửa bên ngoài game']);
    flagIntegrity(s, []);
    expect(isTampered(s)).toBe(true);
    expect(evaluateEnding(s)).toBe('open');
  });
});

describe('Bác Ba tiếp tế: 1 lần mỗi chương (lỗi cũ: cày tiền vô hạn)', () => {
  it('lần 2 trong cùng chương bị từ chối, sang chương mới lại được', () => {
    const s = createInitialState();
    s.money = 0;
    expect(requestBaBaAid(s)).toBe(true);
    expect(s.money).toBe(150000);
    expect(requestBaBaAid(s)).toBe(false);
    expect(s.money).toBe(150000);
    s.currentChapter = 2;
    expect(requestBaBaAid(s)).toBe(true);
    expect(auditState({ ...s, depositsPaid: 1 })).toEqual([]);
  });
});
