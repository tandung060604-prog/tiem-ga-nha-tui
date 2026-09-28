import { staffEffects, FRY_RECIPES } from './staff';
import { karmaEffects } from './karmaEffects';
import { demandWeight, patienceFactorFromPrice, priceRatio } from './pricing';

export const CONDIMENT_REQUEST_CHANCE = 0.3;
import { BaseMenuItemId, BasketRole, BasketRule, CustomerOrder, GameState, MenuItem } from '../types/game';
import { CharacterGenerator } from '../content/characterGenerator';
import { BunnyLetter } from '../content/mysteryBunny';
import { INITIAL_MENU } from '../content/menu';
import { upgradeEffects } from './upgrades';
import { random, weightedPick } from './rng';
import { ASSETS } from '../content/assets';

// Món khách được gọi = món có trạm trong bếp (đọc từ content, không từ save cũ).
// Nước/sốt còn cần chương mở trạm: sốt mở từ chương 2.
const SERVABLE_IDS: ReadonlySet<string> = new Set(
  INITIAL_MENU.filter(m => m.station !== undefined).map(m => m.id)
);

// Giỏ hàng quán gà: ai vào cũng gọi món chính; món kèm và nước là gọi thêm. Xác suất tăng dần theo chương
// (khách quen dần, thực đơn rộng hơn). Người đi đường xin ly nước mang đi là đơn duy nhất không có món chính.
export const BASKET_RULE: BasketRule = {
  sideChance: [0.4, 0.6],
  drinkChance: [0.65, 0.85],
  dessertChance: 0.12,
  walkupDrinkChance: 0.03,
  walkupSurcharge: 5000
};
// Ngày 1 Bác Ba đang dạy: đơn gọn hơn
const DAY_ONE_CHANCE = { side: 0.25, drink: 0.35 } as const;
const SECOND_MAIN_CHANCE = 0.15; // từ Chương 2: gọi 2 phần món chính
const WALKUP_FROM_DAY = 3;

export function basketChance(range: readonly [number, number], chapter: number): number {
  const t = Math.min(1, Math.max(0, (chapter - 1) / 4));
  return range[0] + (range[1] - range[0]) * t;
}

const CONTENT = new Map<string, MenuItem>(INITIAL_MENU.map(m => [m.id as string, m]));
export const basketRoleOf = (menuItemId: string): BasketRole | undefined => CONTENT.get(menuItemId)?.basketRole;

// Món khách gọi được: đã tới chương + ngày mở, có trạm trong bếp, nguyên liệu đã ký hợp đồng.
// Combo chỉ gọi được khi làm được TỪNG món trong combo. (Đọc từ content, không từ save cũ.)
export function canMake(state: Pick<GameState, 'menu' | 'currentChapter' | 'day' | 'inventory'>, id: string): boolean {
  const def = CONTENT.get(id);
  const live = state.menu.find(m => m.id === id);
  if (!def?.station || !live || def.chapter > state.currentChapter || (def.unlockDay ?? 1) > state.day) return false;
  if (def.components) return def.components.every(c => canMake(state, c.menuItemId));
  return Object.keys(def.ingredients).every(ingId => state.inventory[ingId]?.unlocked !== false);
}

export class OrdersEngine {
  public static generateOrder(state: GameState, isDelivery: boolean = false, priceMultiplier: number = 1): CustomerOrder {
    // Không gian đẹp → khách trả thêm (nâng cấp Không gian, core/upgrades.ts)
    priceMultiplier *= 1 + upgradeEffects(state.upgrades).pricePremiumPct / 100;
    const makeable = state.menu.filter(m => canMake(state, m.id));
    const singles = makeable.filter(m => !CONTENT.get(m.id)?.components);
    const combos = makeable.filter(m => CONTENT.get(m.id)?.components);
    const byRole = (role: BasketRole) => singles.filter(m => basketRoleOf(m.id) === role);
    const mains = byRole('main');
    const mainPool = mains.length > 0 ? mains
      : state.menu.filter(m => m.chapter <= state.currentChapter && SERVABLE_IDS.has(m.id) && basketRoleOf(m.id) === 'main');

    const selectedItems: CustomerOrder['items'] = [];
    const addItem = (menuItemId: string, count: number) => {
      const existing = selectedItems.find(x => x.menuItemId === menuItemId);
      if (existing) existing.count += count;
      else selectedItems.push({ menuItemId, count, served: 0, completed: false });
    };
    let totalPrice = 0;
    let baseTotal = 0;   // tổng giá gốc (món lẻ) → mức giá của đơn
    let orderRatio = 1;
    let comboName: string | undefined;
    let isWalkupDrink = false;
    const pickFrom = (pool: MenuItem[]) => {
      if (pool.length === 0) return;
      const item = weightedPick(pool, m => demandWeight(priceRatio(m))); // món đắt ít người gọi
      addItem(item.id, 1);
      totalPrice += Math.round(item.currentPrice * priceMultiplier);
      baseTotal += item.basePrice;
    };

    // Sinh nhân vật thông qua CharacterGenerator (100 - 200 nhân vật phân bổ đều)
    const char = CharacterGenerator.generateCharacter();
    const isVip = !!char.isVip;

    const drinks = byRole('drink');
    // Giá đắt → combo đó ít được chọn (core/pricing.ts), Khách Sộp ưu tiên combo to
    const comboChance = isVip ? 0.35 : 0.18;
    const combo = combos.length > 0 && random() < comboChance ? weightedPick(combos, m => demandWeight(priceRatio(m))) : undefined;
    if (!isDelivery && state.day >= WALKUP_FROM_DAY && drinks.length > 0 && random() < BASKET_RULE.walkupDrinkChance && !isVip) {
      // Người đi đường khát nước, xin mua ly mang đi gấp (phụ thu)
      isWalkupDrink = true;
      pickFrom(drinks);
      totalPrice += BASKET_RULE.walkupSurcharge;
    } else if (combo) {
      // Combo: nhận từng món, trả giá combo
      for (const c of CONTENT.get(combo.id)?.components ?? []) addItem(c.menuItemId, c.count);
      totalPrice = Math.round(combo.currentPrice * priceMultiplier);
      orderRatio = priceRatio(combo);
      comboName = combo.name;
    } else {
      // Món chính bắt buộc (+ đôi khi 2 phần), rồi món kèm / nước / tráng miệng gọi thêm
      const dayOne = state.day <= 1;
      pickFrom(mainPool);
      if (state.currentChapter >= 2 && random() < SECOND_MAIN_CHANCE) pickFrom(mainPool);
      if (random() < (dayOne ? DAY_ONE_CHANCE.side : basketChance(BASKET_RULE.sideChance, state.currentChapter))) pickFrom(byRole('side'));
      if (random() < (dayOne ? DAY_ONE_CHANCE.drink : basketChance(BASKET_RULE.drinkChance, state.currentChapter))) pickFrom(drinks);
      if (random() < BASKET_RULE.dessertChance) pickFrom(byRole('dessert'));
    }
    // Khách dặn thêm tương cho món chiên (từ ngày 2: ngày đầu Bác Ba đang dạy thao tác cơ bản)
    if (state.day > 1) {
      for (const it of selectedItems) {
        if (FRY_RECIPES[it.menuItemId] && random() < CONDIMENT_REQUEST_CHANCE) {
          it.condiment = it.menuItemId === 'shake_fries' || random() < 0.5 ? 'ketchup' : 'chili';
        }
      }
    }
    const extraItems = selectedItems.reduce((n, it) => n + it.count, 0) - 1;

    const customerName = isDelivery ? `[App] ${isVip ? '👑 ' : ''}${char.name}` : isWalkupDrink ? `Người đi đường (${char.name})` : (isVip ? `👑 ${char.name} 💵` : `${char.name}`);
    const avatar = isDelivery ? '🛵' : char.avatar;

    // Thời gian kiên nhẫn: 28 - 42 giây (ảnh hưởng bởi archetype và nâng cấp không gian)
    const spaceBonus = (state.upgrades.space?.currentLevel || 1) * 2;
    // POS, màn gọi số, kiosk + thu ngân (khách tại quán) / shipper nhà (khách app)
    const team = staffEffects(state.staff);
    const patienceBoost = 1 + (upgradeEffects(state.upgrades).patiencePct + (isDelivery ? team.deliveryPatiencePct : team.walkInPatiencePct)
      + karmaEffects(state.karma).patiencePct) / 100; // Tình Hẻm (core/karmaEffects.ts)
    const orderSizeBonus = Math.min(30, extraItems * 5); // order nhiều món (combo) chờ được lâu hơn
    // Thấy đắt thì khách mất kiên nhẫn nhanh (core/pricing.ts): giá chặt chém → khách bỏ về giữa chừng
    if (baseTotal > 0) orderRatio = (totalPrice - (isWalkupDrink ? BASKET_RULE.walkupSurcharge : 0)) / (baseTotal * priceMultiplier);
    const priceTolerance = patienceFactorFromPrice(orderRatio);
    const walkupRush = isWalkupDrink ? 0.6 : 1; // người đi đường vội, không chờ lâu
    const patienceMax = Math.max(12, Math.round((28 + random() * 12 + spaceBonus + orderSizeBonus) * char.patienceMultiplier * patienceBoost * priceTolerance * walkupRush));

    return {
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      customerName,
      avatar,
      isDelivery,
      isVip,
      archetypeBadge: char.title,
      personality: char.personality,
      personalityLabel: char.personalityLabel,
      personalityDesc: char.personalityDesc,
      items: selectedItems,
      ...(comboName ? { comboName } : {}),
      ...(isWalkupDrink ? { isWalkupDrink } : {}),
      patienceMax,
      patienceCurrent: patienceMax,
      totalPrice,
      startTime: Date.now()
    };
  }

  // Sinh đơn hàng đặc biệt cho Bé Thỏ Cam
  public static generateBunnyOrder(state: GameState, letter?: BunnyLetter | null): CustomerOrder {
    const targetItemId: BaseMenuItemId = letter ? letter.menuItemId : (random() < 0.6 ? 'crispy_chicken' : 'shake_fries');
    const menuItem = state.menu.find(m => m.id === targetItemId);
    if (!menuItem) return this.generateOrder(state); // content lỗi: vẫn có khách, không crash ca bán

    const selectedItems: CustomerOrder['items'] = [{
      menuItemId: menuItem.id,
      count: 1,
      served: 0,
      completed: false
    }];

    return {
      id: 'ord_bunny_' + Date.now(),
      customerName: 'Bé Thỏ Cam 🐰',
      avatar: ASSETS.thocam.vui,
      isDelivery: false,
      isBunny: true,
      bunnyLetterId: letter ? letter.id : undefined,
      archetypeBadge: 'Khách Tri Kỷ',
      personality: 'generous',
      personalityLabel: '🐰 Khách Tri Kỷ',
      personalityDesc: 'Thỏ Cam đem theo thư và phần quà bất ngờ, thưởng tip hào phóng!',
      items: selectedItems,
      patienceMax: 65,
      patienceCurrent: 65,
      totalPrice: menuItem.currentPrice,
      startTime: Date.now()
    };
  }

  // Khớp 1 món trong khay với order đang chờ; dòng "2x" cần giao đủ 2 lần mới xong
  public static matchItemToOrder(order: CustomerOrder, menuItemId: string): boolean {
    const targetItem = order.items.find(it => it.menuItemId === menuItemId && !it.completed);
    if (targetItem) {
      targetItem.served += 1;
      targetItem.completed = targetItem.served >= targetItem.count;
      return true;
    }
    return false;
  }

  // Kiểm tra xem đơn hàng đã đầy đủ các món chưa
  public static isOrderComplete(order: CustomerOrder): boolean {
    return order.items.every(it => it.completed);
  }
}
