import { UpgradeBranch } from '../types/game';

// Tác dụng thật của nâng cấp. Mỗi chỉ số trong một nhánh lấy mức CAO NHẤT trong các cấp đã mua
// (thiết bị mới thay thiết bị cũ, không cộng dồn), rồi cộng giữa các nhánh.
export interface UpgradeEffects {
  fryRampPct: number;   // Bếp · speed: gà lên tới vùng vàng nhanh hơn; vùng Perfect GIỮ NGUYÊN độ dài
  tastePct: number;     // Bếp · taste: sao Hương vị tăng nhanh hơn / tụt chậm hơn mỗi ngày
  oilLifePct: number;   // hygiene: dầu lâu bị đen hơn
  patiencePct: number;  // Vận hành / Dịch vụ · speed: khách chờ được lâu hơn
  customersPct: number; // customers (mọi nhánh): thêm khách mỗi ngày
  autoLift: boolean;    // Bếp cấp 6+: tự nhấc giỏ khi gà chín Perfect
  pricePremiumPct: number; // space (mọi nhánh): quán đẹp / nổi tiếng, khách trả thêm (tổng space / 3 %, tối đa 40%)
  traySlots: number;       // capacity (mọi nhánh): thêm ô khay ra món (tối đa +4)
  selfServe: boolean;      // Vận hành cấp 4 (kiosk): khách tự lấy món khi khay đủ
  ownDeliveryApp: boolean; // Vận hành cấp 5: app giao hàng riêng, không mất hoa hồng app ngoài
  shelfLifeBonus: number;  // Kho lạnh: cộng thêm số ngày hạn dùng cho nguyên liệu trong kho
  discountWholesale: number; // Kho / Vận hành: % giảm giá mua sỉ nguyên liệu
  sauceTipBonus: number;   // Dịch vụ: tiền tip thưởng thêm khi khách dặn tương
  autoDrink: boolean;      // Dịch vụ: máy rót nước tự động phục vụ
  pestImmunity: boolean;   // Vệ sinh: miễn nhiễm 100% chuột cống phá hoại
  hygieneBoost: number;    // Vệ sinh: tăng tốc độ tích lũy sao Vệ Sinh
}

type Upgrades = { [id: string]: UpgradeBranch };

function bestOwned(branch: UpgradeBranch | undefined, stat: keyof UpgradeBranch['tiers'][number]['bonus']): number {
  if (!branch) return 0;
  return branch.tiers
    .filter(t => t.level <= branch.currentLevel)
    .reduce((best, t) => {
      const val = t.bonus[stat];
      return Math.max(best, typeof val === 'number' ? val : val ? 1 : 0);
    }, 0);
}

export const AUTO_LIFT_KITCHEN_LEVEL = 6;
export const SELF_SERVE_OPERATIONS_LEVEL = 4;
export const MAX_PRICE_PREMIUM_PCT = 30;

// capacity 2 → +1 ô, 4 → +2, 12 → +3 (cấp 1 miễn phí không có capacity → khay gốc 4 ô)
const capacitySlots = (capacity: number) => (capacity >= 12 ? 3 : capacity >= 4 ? 2 : capacity >= 2 ? 1 : 0);

export function upgradeEffects(upgrades: Upgrades): UpgradeEffects {
  const { kitchen, space, operations, marketing, storage, service, hygiene } = upgrades;

  const autoDrink = (service?.currentLevel ?? 1) >= 3;
  const pestImmunity = (hygiene?.currentLevel ?? 1) >= 4;

  return {
    fryRampPct: bestOwned(kitchen, 'speed'),
    tastePct: bestOwned(kitchen, 'taste'),
    oilLifePct: bestOwned(hygiene, 'hygiene'),
    patiencePct: bestOwned(operations, 'speed'),
    customersPct: bestOwned(marketing, 'customers'),
    autoLift: (kitchen?.currentLevel ?? 1) >= AUTO_LIFT_KITCHEN_LEVEL,
    pricePremiumPct: Math.min(MAX_PRICE_PREMIUM_PCT, Math.round(bestOwned(space, 'space') / 3)),
    traySlots: Math.min(3, capacitySlots(bestOwned(space, 'capacity'))),
    selfServe: (operations?.currentLevel ?? 1) >= SELF_SERVE_OPERATIONS_LEVEL,
    ownDeliveryApp: (operations?.currentLevel ?? 1) >= 5,
    shelfLifeBonus: bestOwned(storage, 'shelfLife'),
    discountWholesale: Math.min(30, bestOwned(storage, 'discount')),
    sauceTipBonus: bestOwned(service, 'sauceTip'),
    autoDrink,
    pestImmunity,
    hygieneBoost: bestOwned(hygiene, 'hygiene')
  };
}
