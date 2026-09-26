import { describe, it, expect, beforeAll } from 'vitest';
import { DAILY_INCIDENTS } from '../src/content/dailyIncidents';
import { resolveIncidentChoice, MAX_RESOLVED_HISTORY } from '../src/core/dailyIncidentsEngine';
import { auditState } from '../src/core/integrity';
import { serveFirstOrder, squeezeCondiment, CONDIMENT_TIP, perfectTip } from '../src/core/day';
import { OrdersEngine, CONDIMENT_REQUEST_CHANCE } from '../src/core/orders';
import { createSellingSession } from '../src/core/sellingSim';
import { createInitialState } from '../src/core/state';
import { seedRandom } from '../src/core/rng';
import { audio } from '../src/core/audio';
import { CustomerOrder, DailyIncident, IncidentChoice, TrayItem } from '../src/types/game';

beforeAll(() => audio.setMuted(true));

// Các lỗi tìm thấy khi review việc Gemini làm đêm 26–27/09 (docs: kế hoạch đêm 27/09, mục A)

const choiceWith = (moneyDelta: number, extra: Partial<IncidentChoice> = {}): { incident: DailyIncident; choice: IncidentChoice } => {
  const incident = DAILY_INCIDENTS[0]!;
  const choice: IncidentChoice = { ...incident.choices[0]!, moneyDelta, riskRate: 0, requiresSecurity: false, ...extra };
  return { incident, choice };
};

describe('sự cố hằng ngày: tiền và sổ sách', () => {
  it('không xóa nợ: đang âm quỹ, sự cố mất tiền thì vẫn âm (trước: kẹp về 0)', () => {
    const s = createInitialState();
    s.money = -500000;
    const { incident, choice } = choiceWith(-50000);
    resolveIncidentChoice(s, incident, choice);
    expect(s.money).toBe(-550000);
  });

  it('tiền thưởng ghi vào totalBonus → người chơi thật thà không bị gắn cờ gian lận', () => {
    const s = createInitialState();
    const { incident, choice } = choiceWith(450000);
    for (let i = 0; i < 10; i++) resolveIncidentChoice(s, incident, choice);
    expect(s.lifetimeStats.totalBonus).toBe(4500000);
    expect(auditState(s)).toEqual([]);
  });

  it('danh tiếng: áp reputationDelta, tối đa ±0,3 mỗi lần', () => {
    const s = createInitialState();
    const before = s.ratings.overall;
    const { incident, choice } = choiceWith(0, { reputationDelta: 2 });
    resolveIncidentChoice(s, incident, choice);
    expect(s.ratings.overall).toBeGreaterThan(before);
    expect(s.ratings.overall - before).toBeLessThanOrEqual(0.31);
  });

  it('lịch sử sự cố trong save có giới hạn', () => {
    const s = createInitialState();
    const { incident, choice } = choiceWith(0);
    for (let i = 0; i < MAX_RESOLVED_HISTORY + 25; i++) resolveIncidentChoice(s, incident, choice);
    expect(s.resolvedIncidents).toHaveLength(MAX_RESOLVED_HISTORY);
  });
});

const tray = (...items: Partial<TrayItem>[]): TrayItem[] =>
  items.map((t, i) => ({ id: `t${i}`, menuItemId: 'crispy_chicken', name: 'Gà', icon: '🍗', quality: 'good', ...t }));
const order = (lines: CustomerOrder['items']): CustomerOrder => ({
  id: 'o1', customerName: 'Khách', avatar: '🙂', isDelivery: false, items: lines,
  patienceMax: 40, patienceCurrent: 10, totalPrice: 50000, startTime: 0
});

describe('quầy tương: chỉ tip khi khách dặn đúng loại', () => {
  it('xịt bừa lên món khách không dặn → không có tip (trước: +2.000đ mọi món có tương)', () => {
    const session = createSellingSession();
    session.orders = [order([{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }])];
    const t = tray({ condiment: 'ketchup' });
    const r = serveFirstOrder(session, t, () => 35000, i => t.splice(i, 1));
    expect(r.kind === 'complete' && r.tip).toBe(0);
  });

  it('khách dặn tương ớt, xịt đúng tương ớt → +tip; xịt nhầm tương cà → không', () => {
    const run = (sauce: 'ketchup' | 'chili') => {
      const session = createSellingSession();
      session.orders = [order([{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false, condiment: 'chili' }])];
      const t = tray({ condiment: sauce });
      const r = serveFirstOrder(session, t, () => 35000, i => t.splice(i, 1));
      return r.kind === 'complete' ? r.tip : -1;
    };
    expect(run('chili')).toBe(CONDIMENT_TIP);
    expect(run('ketchup')).toBe(0);
  });

  it('xịt ưu tiên đúng món khách dặn; không xịt lên nước, gà sống', () => {
    const t = tray({ menuItemId: 'soda', name: 'Nước' }, { menuItemId: 'crispy_chicken', quality: 'raw' }, { menuItemId: 'shake_fries' }, { menuItemId: 'crispy_chicken' });
    const orders = [order([{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false, condiment: 'chili' }])];
    expect(squeezeCondiment(t, orders, 'chili')).toMatchObject({ requested: true, item: { id: 't3' } });
    expect(squeezeCondiment(t, orders, 'ketchup')).toMatchObject({ requested: false, item: { id: 't2' } });
    expect(squeezeCondiment(t, orders, 'ketchup')).toBeNull(); // hết món chiên chưa có tương
  });

  it('khách chỉ dặn tương cho món chiên, và không dặn trong ngày 1 (Bác Ba đang dạy)', () => {
    const s = createInitialState();
    seedRandom(3);
    for (let i = 0; i < 50; i++) expect(OrdersEngine.generateOrder(s).items.some(it => it.condiment)).toBe(false);
    s.day = 5;
    let asked = 0, lines = 0;
    for (let i = 0; i < 300; i++) {
      for (const it of OrdersEngine.generateOrder(s).items) {
        if (it.condiment) { asked++; expect(['crispy_chicken', 'shake_fries']).toContain(it.menuItemId); }
        if (it.menuItemId !== 'soda' && it.menuItemId !== 'seven_up') lines++;
      }
    }
    expect(asked / lines).toBeGreaterThan(CONDIMENT_REQUEST_CHANCE - 0.1);
    expect(asked / lines).toBeLessThan(CONDIMENT_REQUEST_CHANCE + 0.1);
  });

  it('tip Perfect vẫn giữ nguyên cách tính', () => {
    expect(perfectTip(1)).toBeGreaterThan(0);
  });
});
