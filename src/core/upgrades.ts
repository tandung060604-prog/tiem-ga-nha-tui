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
}

type Upgrades = { [id: string]: UpgradeBranch };

function bestOwned(branch: UpgradeBranch | undefined, stat: keyof UpgradeBranch['tiers'][number]['bonus']): number {
  if (!branch) return 0;
  return branch.tiers
    .filter(t => t.level <= branch.currentLevel)
    .reduce((best, t) => Math.max(best, t.bonus[stat] ?? 0), 0);
}

export const AUTO_LIFT_KITCHEN_LEVEL = 6;

export function upgradeEffects(upgrades: Upgrades): UpgradeEffects {
  const { kitchen, operations } = upgrades;
  const all = Object.values(upgrades);
  return {
    fryRampPct: bestOwned(kitchen, 'speed'),
    tastePct: bestOwned(kitchen, 'taste'),
    oilLifePct: all.reduce((sum, b) => sum + bestOwned(b, 'hygiene'), 0),
    patiencePct: bestOwned(operations, 'speed'),
    customersPct: all.reduce((sum, b) => sum + bestOwned(b, 'customers'), 0),
    autoLift: (kitchen?.currentLevel ?? 1) >= AUTO_LIFT_KITCHEN_LEVEL
  };
}
