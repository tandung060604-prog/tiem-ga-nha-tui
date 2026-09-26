import { UpgradeBranch } from '../types/game';

// Tác dụng thật của nâng cấp. Mỗi chỉ số trong một nhánh lấy mức CAO NHẤT trong các cấp đã mua
// (thiết bị mới thay thiết bị cũ, không cộng dồn), rồi cộng giữa các nhánh.
export interface UpgradeEffects {
  fryRampPct: number;   // Bếp · speed: gà lên tới vùng vàng nhanh hơn; vùng Perfect GIỮ NGUYÊN độ dài
  tastePct: number;     // Bếp · taste: sao Hương vị tăng nhanh hơn / tụt chậm hơn mỗi ngày
  oilLifePct: number;   // hygiene: dầu lâu bị đen hơn
  patiencePct: number;  // Vận hành · speed: khách chờ được lâu hơn
  customersPct: number; // customers (mọi nhánh): thêm khách mỗi ngày
  autoLift: boolean;    // Bếp cấp 6 (dây chuyền tự động): tự nhấc giỏ khi gà chín Perfect
  // Quán bị giới hạn bởi sức bếp từ Chương 2 (mô phỏng: khách dự kiến gấp đôi số phục vụ được) → nâng cấp
  // chỉ "thêm khách" gần như không hoàn vốn. Các tác dụng dưới nhắm đúng chỗ nghẽn (scripts/upgrade-roi.ts):
  pricePremiumPct: number; // Không gian · space: quán đẹp, khách sẵn lòng trả thêm (space / 3 %)
  traySlots: number;       // Không gian · capacity: thêm ô khay ra món (tối đa +3)
  selfServe: boolean;      // Vận hành cấp 4 (kiosk): khách tự lấy món khi khay đủ
}

type Upgrades = { [id: string]: UpgradeBranch };

function bestOwned(branch: UpgradeBranch | undefined, stat: keyof UpgradeBranch['tiers'][number]['bonus']): number {
  if (!branch) return 0;
  return branch.tiers
    .filter(t => t.level <= branch.currentLevel)
    .reduce((best, t) => Math.max(best, t.bonus[stat] ?? 0), 0);
}

export const AUTO_LIFT_KITCHEN_LEVEL = 6;
export const SELF_SERVE_OPERATIONS_LEVEL = 4;
const capacitySlots = (capacity: number) => (capacity >= 12 ? 2 : capacity >= 4 ? 1 : 0);

export function upgradeEffects(upgrades: Upgrades): UpgradeEffects {
  const { kitchen, operations } = upgrades;
  const all = Object.values(upgrades);
  return {
    fryRampPct: bestOwned(kitchen, 'speed'),
    tastePct: bestOwned(kitchen, 'taste'),
    oilLifePct: all.reduce((sum, b) => sum + bestOwned(b, 'hygiene'), 0),
    patiencePct: bestOwned(operations, 'speed'),
    customersPct: all.reduce((sum, b) => sum + bestOwned(b, 'customers'), 0),
    autoLift: (kitchen?.currentLevel ?? 1) >= AUTO_LIFT_KITCHEN_LEVEL,
    pricePremiumPct: Math.round(bestOwned(upgrades.space, 'space') / 3),
    traySlots: capacitySlots(bestOwned(upgrades.space, 'capacity')),
    selfServe: (operations?.currentLevel ?? 1) >= SELF_SERVE_OPERATIONS_LEVEL
  };
}
