import { FRY_RECIPES } from '../src/core/staff';
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

describe('quầy tương: đã bỏ hẳn phần tương ớt và tương cà khỏi cơ chế game', () => {
  it('không còn xịt tương và không tính tip tương', () => {
    const session = createSellingSession();
    session.orders = [order([{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }])];
    const t = tray({ menuItemId: 'crispy_chicken' });
    const r = serveFirstOrder(session, t, () => 35000, i => t.splice(i, 1));
    expect(r.kind).toBe('complete');
    if (r.kind === 'complete') expect(r.tip).toBe(0);
    expect(squeezeCondiment(t, session.orders, 'chili')).toBeNull();
  });

  it('khách không bao giờ dặn tương trong bất kỳ ngày nào', () => {
    const s = createInitialState();
    seedRandom(3);
    for (let day = 1; day <= 10; day++) {
      s.day = day;
      for (let i = 0; i < 20; i++) {
        const ord = OrdersEngine.generateOrder(s);
        expect(ord.items.some(it => it.condiment)).toBe(false);
      }
    }
  });

  it('tip Perfect vẫn giữ nguyên cách tính', () => {
    expect(perfectTip(1)).toBeGreaterThan(0);
  });
});
