import { Condiment, CustomerOrder, QualityRating, StaffMember, TrayItem } from '../types/game';
import type { FryType, Sauce } from './cooking';
import { ASSEMBLY_RECIPES, DrinkId, ScoopId, isAssemblyId, isDrinkId, isScoopId } from './stations';
import { random } from './rng';
import { upgradeEffects } from './upgrades';
import type { UpgradeBranch } from '../types/game';
type Upgrades = { [id: string]: UpgradeBranch };

// Nhân viên có tác dụng thật trong ca bán (trước đây chỉ trừ lương). Mọi con số tính từ chỉ số
// (tốc độ, tay nghề, thái độ) × tâm trạng × quản lý. main.ts và mô phỏng cân bằng dùng chung.
//  • Phụ bếp: giỏ chiên riêng, tự chiên món khách đang cần
//  • Phục vụ: tự rót nước, tự lên món khi khay đã đủ cho khách đầu hàng; giữ Vệ sinh
//  • Thu ngân: khách tại quán kiên nhẫn hơn
//  • Shipper: khách app kiên nhẫn hơn, giảm hoa hồng app
//  • Quản lý: cả đội +20% hiệu suất, tâm trạng giảm chậm một nửa

export const MAX_HELPER_FRYERS = 2;
export const SELF_SERVE_MS = 2000;
export const ROBOT_CYCLE_MS = 4200;
// Hoa hồng sàn giao hàng trên doanh thu đơn app (22%); shipper nhà giảm tới 60%, app riêng về 0
export const BASE_APP_COMMISSION = 0.22;
// Quán càng lớn càng chứa được nhiều người (Chương 2: 3 người … Chương 5: 6 người)
export const maxStaff = (chapter: number) => (chapter < 2 ? 0 : chapter + 1);
export const SHIFT_HOURS = 8;
// Mỗi phụ bếp / phục vụ kê thêm 1 ô khay ra món (tối đa +2): thêm người mà chung 4 ô khay thì kẹt tay nhau
export const extraTraySlots = (staff: readonly StaffMember[]) =>
  Math.min(2, staff.filter(m => m.role === 'cook' || m.role === 'waiter').length);
// Khay = 4 ô gốc + nhân viên (tối đa +2) + nâng cấp Không gian (tối đa +3), trần 7 ô (vừa màn 320px)
export const MAX_TRAY_SIZE = 7;
export const traySizeFor = (state: { staff: readonly StaffMember[]; upgrades: Upgrades }) =>
  Math.min(MAX_TRAY_SIZE, 4 + extraTraySlots(state.staff) + upgradeEffects(state.upgrades).traySlots);
export const severancePay = (m: StaffMember) => m.hourlyWage * SHIFT_HOURS; // cho nghỉ: trả thêm 1 ngày lương

// Món chảo làm được: loại mẻ + sốt + nguyên liệu trừ lúc thả
export interface FryRecipe { type: FryType; sauce: Sauce | null; stock: readonly string[] }
export const FRY_RECIPES: Record<string, FryRecipe> = {
  crispy_chicken: { type: 'chicken', sauce: null, stock: ['chicken_meat', 'flour'] },
  spicy_chicken: { type: 'chicken', sauce: 'spicy', stock: ['chicken_meat', 'flour', 'spicy_sauce'] },
  honey_garlic_chicken: { type: 'chicken', sauce: 'honey', stock: ['chicken_meat', 'flour', 'garlic_honey'] },
  shake_fries: { type: 'fries', sauce: null, stock: ['potato_cheese'] },
  popcorn_chicken: { type: 'popcorn', sauce: null, stock: ['popcorn_chicken', 'flour'] },
  spicy_thigh: { type: 'thigh', sauce: null, stock: ['chicken_thigh', 'flour'] },
  cheese_stick: { type: 'cheese', sauce: null, stock: ['cheese_stick_raw'] }
};
export const FRY_LOOK: Record<string, { name: string; icon: string }> = {
  crispy_chicken: { name: 'Gà Rán Giòn Truyền Thống', icon: '🍗' },
  spicy_chicken: { name: 'Cánh Gà Sốt Cay Yangnyeom', icon: '🌶️' },
  honey_garlic_chicken: { name: 'Gà Sốt Bơ Tỏi Đậu Nành', icon: '🍯' },
  shake_fries: { name: 'Khoai Lắc Phô Mai', icon: '🍟' },
  popcorn_chicken: { name: 'Gà Viên Popcorn', icon: '🍿' },
  spicy_thigh: { name: 'Má Đùi Gà Rán Giòn Cay', icon: '🍗' },
  cheese_stick: { name: 'Phô Mai Que Kéo Sợi', icon: '🧀' }
};

// Món ra khỏi chảo: loại mẻ + sốt (sốt chỉ phủ lên gà miếng). Cũng là món đang trong chảo của người chơi
// (để phụ bếp không chiên trùng).
export function fryingItemId(type: FryType, sauce: Sauce | null): string {
  if (type === 'chicken') return sauce === 'spicy' ? 'spicy_chicken' : sauce === 'honey' ? 'honey_garlic_chicken' : 'crispy_chicken';
  const plain = Object.entries(FRY_RECIPES).find(([, r]) => r.type === type && r.sauce === null);
  return plain?.[0] ?? 'crispy_chicken';
}

// Món còn thiếu của một khách, sau khi trừ món đã có trong khay (không tính gà sống)
export function missingItems(order: CustomerOrder, tray: readonly TrayItem[]): string[] {
  const available = tray.filter(t => t.quality !== 'raw').map(t => t.menuItemId);
  const missing: string[] = [];
  for (const it of order.items) {
    for (let k = it.served; k < it.count; k++) {
      const i = available.indexOf(it.menuItemId);
      if (i >= 0) available.splice(i, 1);
      else missing.push(it.menuItemId);
    }
  }
  return missing;
}

/**
 * Kiểm tra xem khách có món nào dặn tương (condiment) mà trong khay CHƯA CÓ món chín cùng loại đã được xịt tương hay không.
 * Trả về loại tương đang còn thiếu, hoặc null nếu khách không dặn tương hoặc khay đã có đủ món xịt tương.
 */
export function orderPendingCondiment(order: CustomerOrder, tray: readonly TrayItem[]): Condiment | null {
  for (const it of order.items) {
    if (!it.condiment) continue;
    const needed = it.count - (it.condimentServed ?? 0);
    if (needed <= 0) continue;

    const matchingSauced = tray.filter(
      t => t.quality !== 'raw' && t.menuItemId === it.menuItemId && t.condiment === it.condiment
    ).length;

    if (matchingSauced < needed) {
      return it.condiment;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Hiệu ứng của cả đội
// ---------------------------------------------------------------------------

export interface HelperCook { staffId: string; name: string; cycleMs: number; perfectChance: number; burntChance: number }

export interface StaffEffects {
  cooks: HelperCook[];
  walkInPatiencePct: number;
  deliveryPatiencePct: number;
  commissionRate: number;
  waiterServeMs: number | null; // null = không có phục vụ
  hygienePerDay: number;
  customersPct: number;
  hasSecurity: boolean;
  dineInTipBonus: number;       // Thưởng tip tại quán nhờ Phục Vụ & Bảo Vệ (%)
  expressDeliveryBonus: number; // Thưởng đơn giao hỏa tốc nhờ Shipper + App riêng (đ)
  upsellChance: number;         // Tỷ lệ Thu Ngân upsell thành công (0-1)
}

const managerBoost = (staff: readonly StaffMember[]) => (staff.some(m => m.role === 'manager') ? 1.2 : 1);
// Sức làm việc 0..~1,2: chỉ số × tâm trạng (tâm trạng 0% còn 60% sức) × quản lý
const power = (m: StaffMember, stat: 'speed' | 'skill' | 'attitude', boost: number) =>
  (m[stat] / 100) * (0.6 + 0.4 * m.mood / 100) * boost;
const has = (m: StaffMember, trait: string) => (m.traits ?? []).includes(trait);

export function staffEffects(staff: readonly StaffMember[], gameHour = 12, upgrades?: Upgrades): StaffEffects {
  const boost = managerBoost(staff);
  const up = upgrades ? upgradeEffects(upgrades) : null;
  const kitchenSpeed = 1 + (up?.fryRampPct ?? 0) / 200; // bếp tốt: giỏ phụ bếp cũng nhanh hơn (một nửa mức của chủ quán)
  const ofRole = (role: StaffMember['role']) => staff.filter(m => m.role === role);

  const cooks = [...ofRole('cook')]
    .sort((a, b) => b.skill - a.skill)
    .slice(0, MAX_HELPER_FRYERS)
    .map(m => {
      const nightOwl = has(m, 'night_owl') && gameHour >= 18 ? 1.4 : 1;
      return {
        staffId: m.id,
        name: m.name,
        cycleMs: Math.round(Math.max(3500, 8000 - 5000 * power(m, 'speed', boost)) / nightOwl / kitchenSpeed),
        perfectChance: Math.min(0.95, 0.3 + 0.6 * power(m, 'skill', boost)),
        burntChance: up?.autoLift ? 0 : (has(m, 'clumsy') ? 0.1 : 0.03) // Bếp tự động bảo vệ gà không bao giờ cháy
      };
    });

  // Dây chuyền chiên tự động (Bếp cấp 3): một giỏ robot chạy riêng, không cần người đứng
  if (up?.autoLift) {
    cooks.push({ staffId: 'robot', name: 'Robot Dây Chuyền', cycleMs: Math.round(ROBOT_CYCLE_MS / kitchenSpeed), perfectChance: 0.95, burntChance: 0 });
  }

  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const waiters = ofRole('waiter');
  const drivers = ofRole('delivery');
  const cashiers = ofRole('cashier');
  const fastestWaiter = Math.max(0, ...waiters.map(m => power(m, 'speed', boost)));
  const hasSec = staff.some(m => m.role === 'security' && m.mood > 20);

  // Kiosk tự order (Vận hành cấp 3): khách mang về tự lấy món, phục vụ tại bàn tập trung hơn:
  // Nếu có cả phục vụ và kiosk: tốc độ phục vụ x1.5 (giảm waiterServeMs xuống chỉ còn 500ms - 1.5s!)
  const waiterServeMs = waiters.length
    ? Math.round(Math.max(500, (2600 - 1600 * fastestWaiter) / (up?.selfServe ? 1.5 : 1)))
    : up?.selfServe ? SELF_SERVE_MS : null;

  // Thu ngân giúp khách tại quán kiên nhẫn hơn & có tỷ lệ gợi ý món (upsell)
  const walkInPatiencePct = Math.min(45, sum(cashiers.map(m => 25 * power(m, 'attitude', boost))));
  const upsellChance = Math.min(0.35, sum(cashiers.map(m => 0.20 * power(m, 'skill', boost))));

  // Shipper giúp khách app kiên nhẫn hơn
  const deliveryPatiencePct = Math.min(50, sum(drivers.map(m => 35 * power(m, 'speed', boost))));

  // App giao hàng riêng (Vận hành cấp 3): không mất hoa hồng sàn
  const commissionRate = up?.ownDeliveryApp
    ? 0
    : BASE_APP_COMMISSION * (1 - Math.min(0.65, sum(drivers.map(m => 0.55 * power(m, 'skill', boost)))));

  // Hiệp đồng App riêng + Shipper: mở tuyến giao hỏa tốc Hẻm 1102, cộng thẳng tiền thưởng hỏa tốc
  const expressDeliveryBonus = up?.ownDeliveryApp && drivers.length > 0
    ? Math.round(sum(drivers.map(m => 10000 + 5000 * power(m, 'speed', boost))))
    : 0;

  // Phục Vụ + Bảo Vệ giúp tăng tiền Tip tại quán (Dine-in Tip Bonus)
  const dineInTipBonus = Math.min(30, sum(waiters.map(m => 12 * power(m, 'attitude', boost)))) + (hasSec ? 15 : 0);

  // Vệ sinh tích lũy mỗi ngày
  const hygienePerDay = Math.min(0.15, sum(waiters.map(m => 0.08 * power(m, 'attitude', boost))));

  // Lượng khách ghé quán: Idol TikTok (+15%), Nghiện Threads (+8%), Bảo Vệ đón khách (+10%)
  const customersPct = Math.min(
    35,
    staff.filter(m => has(m, 'tiktok_idol')).length * 15 +
    staff.filter(m => has(m, 'phone_addict')).length * 8 +
    (hasSec ? 10 : 0)
  );

  return {
    cooks,
    walkInPatiencePct,
    deliveryPatiencePct,
    commissionRate,
    waiterServeMs,
    hygienePerDay,
    customersPct,
    hasSecurity: hasSec,
    dineInTipBonus,
    expressDeliveryBonus,
    upsellChance
  };
}

// Có ai tự làm việc trong ca không (phụ bếp, robot, phục vụ, kiosk) → khỏi chạy tickStaff khi không có
export const hasAutoWork = (eff: StaffEffects) => eff.cooks.length > 0 || eff.waiterServeMs !== null;

// Một dòng mô tả tác dụng cho tab Nhân viên (tính với cả đội hiện tại, có quản lý hay không)
export function describeStaffEffect(member: StaffMember, team: readonly StaffMember[]): string {
  const withMember = team.some(m => m.id === member.id) ? team : [...team, member];
  const eff = staffEffects(withMember);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  switch (member.role) {
    case 'cook': {
      const c = eff.cooks.find(x => x.staffId === member.id);
      return c
        ? `Tự chiên 1 mẻ mỗi ${(c.cycleMs / 1000).toFixed(1)}s · ${pct(c.perfectChance)} ra Perfect · Hóa giải kiểm tra ATTP`
        : `Chỉ ${MAX_HELPER_FRYERS} phụ bếp giỏi nhất được đứng chảo`;
    }
    case 'waiter':
      return `Rót nước, tự lên món sau ${((eff.waiterServeMs ?? 0) / 1000).toFixed(1)}s khi khay đủ · +${eff.hygienePerDay.toFixed(2)}⭐ Vệ sinh · +${Math.round(eff.dineInTipBonus)}% Tip tại bàn`;
    case 'cashier':
      return `Khách tại quán chờ lâu hơn ${Math.round(eff.walkInPatiencePct)}% · Gợi ý thêm món (+${Math.round(eff.upsellChance * 100)}% upsell) · Hóa giải tiền giả/tranh chấp`;
    case 'delivery':
      return eff.expressDeliveryBonus > 0
        ? `Giao hỏa tốc độc quyền (+${eff.expressDeliveryBonus.toLocaleString('vi-VN')}đ/đơn app) · Khách app chờ lâu hơn ${Math.round(eff.deliveryPatiencePct)}%`
        : `Khách app chờ lâu hơn ${Math.round(eff.deliveryPatiencePct)}% · Hoa hồng app ${(eff.commissionRate * 100).toFixed(1)}% · Hóa giải mưa bão/tắc đường`;
    case 'manager':
      return 'Cả đội +20% hiệu suất · tâm trạng giảm chậm một nửa · hóa giải khủng hoảng truyền thông & thanh tra';
    case 'security':
      return 'Bảo vệ an ninh, trông xe an toàn · tóm gọn 100% trộm cắp, quỵt nợ & đối thủ phá hoại';
  }
}

// ---------------------------------------------------------------------------
// Trong ca bán
// ---------------------------------------------------------------------------

export interface HelperFry { menuItemId: string; elapsedMs: number }

export type StaffEvent =
  | { type: 'helperDone'; item: TrayItem; cook: string }
  | { type: 'autoServe' };

export interface StaffSession {
  helpers: (HelperFry | null)[];
  waiterMs: number;
  pourMs?: number; // phục vụ rót nước: thời gian từ ly trước
  orders: CustomerOrder[];
  totalFriedCount: number;
}

export interface StaffHooks {
  use: (stock: readonly string[]) => boolean;   // trừ nguyên liệu (all-or-nothing)
  place: (item: TrayItem) => boolean;           // đặt vào khay; khay đầy → false (giữ trong giỏ, thử lại)
  pour: (drink: DrinkId) => boolean;           // phục vụ rót nước (trừ kho, đặt vào khay)
  scoop?: (side: ScoopId) => boolean;          // phục vụ múc món kèm từ khay inox (củ cải, bắp cải)
  squeeze?: (condiment: Condiment) => boolean;  // phục vụ xịt tương dặn kèm lên món trong khay
  traySize: number;
}

// Món cần chiên tiếp: món thiếu của 2 khách đầu, trừ khay và các giỏ đang chiên. Món ráp → chiên phần gà nền.
function nextFryTarget(orders: readonly CustomerOrder[], tray: readonly TrayItem[], inProgress: string[]): string | null {
  const heads = orders.slice(0, 2);
  const pending = [...inProgress];
  // Món chiên trong khay chưa khách nào gọi thẳng → dùng làm nền cho món ráp, khỏi chiên thêm
  const spare = tray.filter(t => t.quality !== 'raw').map(t => t.menuItemId);
  for (const o of heads) for (const it of o.items) for (let k = it.served; k < it.count; k++) {
    const i = spare.indexOf(it.menuItemId);
    if (i >= 0) spare.splice(i, 1);
  }
  for (const order of heads) {
    for (const id of missingItems(order, tray)) {
      const fryId = isAssemblyId(id) ? ASSEMBLY_RECIPES[id].base : id;
      if (!FRY_RECIPES[fryId]) continue;
      const pool = isAssemblyId(id) && spare.includes(fryId) ? spare : pending;
      const i = pool.indexOf(fryId);
      if (i >= 0) { pool.splice(i, 1); continue; }
      return fryId;
    }
  }
  return null;
}

function rollQuality(c: HelperCook): QualityRating {
  const r = random();
  if (r < c.perfectChance) return 'perfect';
  if (r < 1 - c.burntChance) return 'good';
  return 'burnt';
}

// `playerFrying`: món đang trong chảo của người chơi (null nếu chảo rảnh)
export function tickStaff(
  session: StaffSession, tray: readonly TrayItem[], gameDt: number, eff: StaffEffects,
  playerFrying: string | null, hooks: StaffHooks
): StaffEvent[] {
  const events: StaffEvent[] = [];
  // Ca bán dở lưu từ bản cũ chưa có các trường này
  session.helpers ??= [];
  session.waiterMs ??= 0;

  eff.cooks.forEach((cook, i) => {
    const slot = session.helpers[i] ?? null;
    if (slot) {
      slot.elapsedMs += gameDt;
      if (slot.elapsedMs < cook.cycleMs) return;
      const look = FRY_LOOK[slot.menuItemId] ?? { name: slot.menuItemId, icon: '🍗' };
      const item: TrayItem = {
        id: `tray_helper${i}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        menuItemId: slot.menuItemId, name: look.name, icon: look.icon, quality: rollQuality(cook)
      };
      if (!hooks.place(item)) return; // khay đầy: đứng chờ, mẻ không cháy thêm
      session.helpers[i] = null;
      events.push({ type: 'helperDone', item, cook: cook.name });
      return;
    }
    const inProgress = session.helpers.filter((h): h is HelperFry => !!h).map(h => h.menuItemId);
    // Luôn chừa 1 ô khay cho chủ quán (phụ bếp chiếm hết khay thì chủ quán kẹt tay)
    if (tray.length + inProgress.length >= hooks.traySize - 1) return;
    if (playerFrying) inProgress.push(playerFrying);
    const target = nextFryTarget(session.orders, tray, inProgress);
    const recipe = target ? FRY_RECIPES[target] : undefined;
    if (!target || !recipe || !hooks.use(recipe.stock)) return;
    session.helpers[i] = { menuItemId: target, elapsedMs: 0 };
    session.totalFriedCount += 1;
  });

  // Phục vụ rót nước / múc món kèm / tự xịt tương dặn kèm cho 2 khách đầu (mỗi phần một nhịp), chừa 1 ô khay cho chủ quán
  if (eff.waiterServeMs !== null) {
    session.pourMs = (session.pourMs ?? 0) + gameDt;
    if (session.pourMs >= eff.waiterServeMs) {
      const pendingSauce = session.orders[0] ? orderPendingCondiment(session.orders[0], tray) : null;
      // 1. Phục vụ thông minh: tự xịt tương dặn kèm lên món chiên đã có trong khay (không cần ô khay trống)
      if (pendingSauce && hooks.squeeze?.(pendingSauce)) {
        session.pourMs = 0;
      } else {
        // 2. Rót nước / múc món kèm cần thêm ô khay mới, nên phải chừa 1 ô khay cho chủ quán
        const trayLimit = (hooks.traySize ?? 4) - 1;
        const busy = session.helpers.filter(Boolean).length;
        if (tray.length + busy < trayLimit) {
          const missing = session.orders.slice(0, 2).flatMap(o => missingItems(o, tray));
          const drink = missing.find(isDrinkId);
          const side = missing.find(isScoopId);

          if (drink && hooks.pour(drink)) {
            session.pourMs = 0;
          } else if (side && hooks.scoop?.(side)) {
            session.pourMs = 0;
          }
        }
      }
    }
  }

  // Phục vụ: khách đầu hàng đã đủ món trong khay VÀ ĐÃ XỊT ĐỦ TƯƠNG DẶN KÈM → tự lên món sau một nhịp
  const first = session.orders[0];
  const pendingCondiment = first ? orderPendingCondiment(first, tray) : null;
  const isOrderFullyReady = first && missingItems(first, tray).length === 0 && !pendingCondiment;

  if (eff.waiterServeMs !== null && isOrderFullyReady) {
    session.waiterMs += gameDt;
    if (session.waiterMs >= eff.waiterServeMs) {
      session.waiterMs = 0;
      events.push({ type: 'autoServe' });
    }
  } else {
    session.waiterMs = 0;
  }
  return events;
}

// ---------------------------------------------------------------------------
// Cuối ca
// ---------------------------------------------------------------------------

// Mỗi ca: tâm trạng giảm theo thể lực (quản lý giảm một nửa), tay nghề tăng dần (Sếp Tương Lai gấp đôi)
export function endShiftForStaff(staff: StaffMember[]) {
  const calm = staff.some(m => m.role === 'manager') ? 0.5 : 1;
  for (const m of staff) {
    m.shiftsWorked += 1;
    const drop = Math.max(2, 10 - m.stamina / 12) * calm;
    m.mood = Math.max(20, Math.round(m.mood - drop));
    const every = has(m, 'future_boss') ? 1 : 2;
    if (m.shiftsWorked % every === 0) m.skill = Math.min(98, m.skill + 1);
  }
}
