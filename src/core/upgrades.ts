import { UpgradeBranch } from '../types/game';
import { INITIAL_UPGRADES } from '../content/upgrades';

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

type Upgrades = { [id: string]: UpgradeBranch | number };

function getLevel(branch: UpgradeBranch | number | undefined): number {
  if (typeof branch === 'number') return branch;
  return branch?.currentLevel ?? 1;
}

function bestOwned(branch: UpgradeBranch | number | undefined, stat: keyof UpgradeBranch['tiers'][number]['bonus'], branchId?: string): number {
  if (branch === undefined || branch === null) return 0;
  const level = getLevel(branch);
  const tiers = (typeof branch === 'object' && Array.isArray(branch?.tiers))
    ? branch.tiers
    : (branchId && INITIAL_UPGRADES[branchId]?.tiers)
      ? INITIAL_UPGRADES[branchId].tiers
      : [];
  if (!tiers.length) return 0;
  return tiers
    .filter(t => t.level <= level)
    .reduce((best, t) => {
      const val = t.bonus?.[stat];
      return Math.max(best, typeof val === 'number' ? val : val ? 1 : 0);
    }, 0);
}

export const AUTO_LIFT_KITCHEN_LEVEL = 3;
export const SELF_SERVE_OPERATIONS_LEVEL = 3;
export const MAX_PRICE_PREMIUM_PCT = 30;

// capacity 2 → +1 ô, 4 → +2, 12 → +3 (cấp 1 miễn phí không có capacity → khay gốc 4 ô)
const capacitySlots = (capacity: number) => (capacity >= 12 ? 3 : capacity >= 4 ? 2 : capacity >= 2 ? 1 : 0);

export function upgradeEffects(upgrades?: Upgrades | null): UpgradeEffects {
  if (!upgrades) {
    return {
      fryRampPct: 0,
      tastePct: 0,
      oilLifePct: 0,
      patiencePct: 0,
      customersPct: 0,
      autoLift: false,
      pricePremiumPct: 0,
      traySlots: 0,
      selfServe: false,
      ownDeliveryApp: false,
      shelfLifeBonus: 0,
      discountWholesale: 0,
      autoDrink: false,
      sauceTipBonus: 0,
      hygieneBoost: 0,
      pestImmunity: false,
    };
  }
  const { kitchen, space, operations, marketing, storage, service, hygiene } = upgrades;

  const autoDrink = getLevel(service) >= 2;
  const pestImmunity = getLevel(hygiene) >= 3;
  const ownDeliveryApp = getLevel(operations) >= 3;

  return {
    fryRampPct: bestOwned(kitchen, 'speed', 'kitchen'),
    tastePct: bestOwned(kitchen, 'taste', 'kitchen'),
    oilLifePct: bestOwned(hygiene, 'hygiene', 'hygiene'),
    patiencePct: bestOwned(operations, 'speed', 'operations'),
    customersPct: bestOwned(marketing, 'customers', 'marketing'),
    autoLift: getLevel(kitchen) >= AUTO_LIFT_KITCHEN_LEVEL,
    pricePremiumPct: Math.min(MAX_PRICE_PREMIUM_PCT, Math.round(bestOwned(space, 'space', 'space') / 3)),
    traySlots: Math.min(3, capacitySlots(bestOwned(space, 'capacity', 'space'))),
    selfServe: getLevel(operations) >= SELF_SERVE_OPERATIONS_LEVEL,
    ownDeliveryApp,
    shelfLifeBonus: bestOwned(storage, 'shelfLife', 'storage'),
    discountWholesale: Math.min(30, bestOwned(storage, 'discount', 'storage')),
    sauceTipBonus: bestOwned(service, 'sauceTip', 'service'),
    autoDrink,
    pestImmunity,
    hygieneBoost: bestOwned(hygiene, 'hygiene', 'hygiene')
  };
}
