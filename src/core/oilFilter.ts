import { OilCondition, OilCrumb, OilFilterResult } from '../types/game';

export const OIL_FILTER_CONFIG = {
  durationSec: 15,
  defaultCrumbCount: 8,
  fullSuccessSavedMoney: 150000,
  partialSavedMoney: 75000,
  cleanBonusReward: 20000,
  fullHygieneBonus: 0.2,
  partialHygieneBonus: 0.08
};

/**
 * Sinh danh sách cặn bột cháy phân bố đều hình nan hoa bên trong lòng chảo gang (tâm 50, 50)
 * Đảm bảo 100% cặn nằm trong lòng chảo tròn, không bị đè lên nhau, kích thước lớn chuẩn ngón cái.
 */
export function generateOilCrumbs(count: number = OIL_FILTER_CONFIG.defaultCrumbCount, seed: number = 1): OilCrumb[] {
  const crumbs: OilCrumb[] = [];
  const crumbTypes: ('small' | 'medium' | 'burnt_chunk')[] = ['small', 'medium', 'burnt_chunk'];

  const angleStep = (2 * Math.PI) / count;
  const baseOffset = (seed % 100) * 0.1;

  for (let i = 0; i < count; i++) {
    // Luân phiên bán kính giữa vòng trong (22%-26%) và vòng ngoài (32%-38%)
    const radius = (i % 2 === 0 ? 25 : 36) + ((i * 7 + seed) % 5) - 2;
    const angle = i * angleStep + baseOffset + (((i * 13) % 7) - 3) * 0.05;

    const x = Math.round(50 + radius * Math.cos(angle));
    const y = Math.round(50 + radius * Math.sin(angle));
    const type = (crumbTypes[i % crumbTypes.length] ?? 'medium') as 'small' | 'medium' | 'burnt_chunk';
    const size = type === 'burnt_chunk' ? 44 : type === 'medium' ? 38 : 34;

    crumbs.push({
      id: `crumb_${i}_${seed}`,
      x: Math.max(16, Math.min(84, x)),
      y: Math.max(16, Math.min(84, y)),
      size,
      type,
      collected: false
    });
  }

  return crumbs;
}

/**
 * Tính toán kết quả sau khi kết thúc lượt lọc cặn dầu:
 * - Vớt sạch 100%: Dầu được nâng 1 cấp độ sạch (dirty -> medium, medium -> clean), tiết kiệm 150k hoặc nhận thưởng 20k nếu dầu đã clean.
 * - Vớt từ 60% trở lên: Lọc sạch một phần, được giảm 50% chi phí thay dầu (còn 75k) và thưởng nhẹ sao Vệ Sinh.
 * - Dưới 60%: Thất bại, dầu giữ nguyên tình trạng cũ.
 */
export function calculateFilterResult(
  collectedCount: number,
  totalCrumbs: number,
  initialCondition: OilCondition
): OilFilterResult {
  const isAllCollected = collectedCount >= totalCrumbs;
  const isPartial = !isAllCollected && collectedCount >= Math.ceil(totalCrumbs * 0.6);

  if (isAllCollected) {
    let newCondition: OilCondition = initialCondition;
    let bonusReward = 0;

    if (initialCondition === 'dirty') {
      newCondition = 'medium';
    } else if (initialCondition === 'medium') {
      newCondition = 'clean';
    } else {
      // Nếu đã clean sẵn, vớt cặn định kỳ giúp dầu tinh khiết, thưởng 20.000đ tiền tiết kiệm
      newCondition = 'clean';
      bonusReward = OIL_FILTER_CONFIG.cleanBonusReward;
    }

    return {
      success: true,
      isPartial: false,
      collectedCount,
      totalCrumbs,
      initialCondition,
      newCondition,
      savedMoney: OIL_FILTER_CONFIG.fullSuccessSavedMoney,
      hygieneBonus: OIL_FILTER_CONFIG.fullHygieneBonus,
      bonusReward
    };
  }

  if (isPartial) {
    return {
      success: true,
      isPartial: true,
      collectedCount,
      totalCrumbs,
      initialCondition,
      newCondition: initialCondition,
      savedMoney: OIL_FILTER_CONFIG.partialSavedMoney,
      hygieneBonus: OIL_FILTER_CONFIG.partialHygieneBonus,
      bonusReward: 0
    };
  }

  return {
    success: false,
    isPartial: false,
    collectedCount,
    totalCrumbs,
    initialCondition,
    newCondition: initialCondition,
    savedMoney: 0,
    hygieneBonus: 0,
    bonusReward: 0
  };
}
