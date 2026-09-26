import { BaseMenuItemId, CustomerOrder, GameState } from '../types/game';
import { CharacterGenerator } from '../content/characterGenerator';
import { BunnyLetter } from '../content/mysteryBunny';
import { INITIAL_MENU } from '../content/menu';
import { upgradeEffects } from './upgrades';
import { pick, random } from './rng';
import { ASSETS } from '../content/assets';

// Món khách được gọi = món có trạm trong bếp (đọc từ content, không từ save cũ).
// Nước/sốt còn cần chương mở trạm: sốt mở từ chương 2.
const SERVABLE_IDS: ReadonlySet<string> = new Set(
  INITIAL_MENU.filter(m => m.station !== undefined).map(m => m.id)
);

export class OrdersEngine {
  public static generateOrder(state: GameState, isDelivery: boolean = false, priceMultiplier: number = 1): CustomerOrder {
    const filtered = state.menu.filter(m => {
      if (m.chapter > state.currentChapter || !SERVABLE_IDS.has(m.id)) return false;
      return Object.keys(m.ingredients).every(ingId => state.inventory[ingId]?.unlocked !== false);
    });
    const availableMenuItems = filtered.length > 0 ? filtered : state.menu.filter(m => m.chapter <= state.currentChapter && SERVABLE_IDS.has(m.id));

    // Chọn ngẫu nhiên 1 - 2 món
    const itemCount = random() < 0.65 ? 1 : 2;
    const selectedItems: CustomerOrder['items'] = [];
    let totalPrice = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pick(availableMenuItems);
      // Kiểm tra xem món đã có trong order chưa
      const existing = selectedItems.find(x => x.menuItemId === item.id);
      if (existing) {
        existing.count += 1;
      } else {
        selectedItems.push({
          menuItemId: item.id,
          count: 1,
          served: 0,
          completed: false
        });
      }
      totalPrice += Math.round(item.currentPrice * priceMultiplier);
    }

    // Sinh nhân vật thông qua CharacterGenerator (100 - 200 nhân vật phân bổ đều)
    const char = CharacterGenerator.generateCharacter();
    const customerName = isDelivery ? `[App] ${char.name}` : `${char.name}`;
    const avatar = isDelivery ? '🛵' : char.avatar;

    // Thời gian kiên nhẫn: 28 - 42 giây (ảnh hưởng bởi archetype và nâng cấp không gian)
    const spaceBonus = (state.upgrades.space?.currentLevel || 1) * 2;
    const patienceBoost = 1 + upgradeEffects(state.upgrades).patiencePct / 100; // POS, màn gọi số, kiosk
    const patienceMax = Math.max(18, Math.round((28 + random() * 12 + spaceBonus) * char.patienceMultiplier * patienceBoost));

    return {
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      customerName,
      avatar,
      isDelivery,
      items: selectedItems,
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
