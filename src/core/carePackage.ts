import { GameState, CarePackage, CarePackageType } from '../types/game';
import { getCloudEndpoint, getCurrentRoomId } from './leaderboard';
import { consumeStock, addStock } from './inventory';

export const CARE_PACKAGE_CONFIG: Record<CarePackageType, { name: string; icon: string; costDesc: string; defaultAmount: number }> = {
  chicken: {
    name: 'Gói Tiếp Tế Gà Tươi',
    icon: '🍗',
    costDesc: '5 miếng gà tươi (hoặc 70.000đ mua hộ)',
    defaultAmount: 5
  },
  oil: {
    name: 'Quỹ Hỗ Trợ Dầu Sạch',
    icon: '🛢️',
    costDesc: '50.000đ tiền dầu mới',
    defaultAmount: 50000
  },
  tip: {
    name: 'Lì Xì May Mắn Hẻm Sâu',
    icon: '🧧',
    costDesc: '20.000đ tiền tip chúc quán đông khách',
    defaultAmount: 20000
  }
};

/**
 * Gửi quà tiếp tế cho người bạn cùng phòng Lobby
 */
export async function sendCarePackage(
  state: GameState,
  recipientId: string,
  recipientName: string,
  type: CarePackageType
): Promise<{ success: boolean; message: string; package?: CarePackage }> {
  if (state.carePackagesSentDay === state.day) {
    return {
      success: false,
      message: 'Hôm nay tiệm đã gửi 1 gói quà tiếp tế rồi! Ngày mai hãy sang thăm bạn tiếp nhé.'
    };
  }

  const roomId = state.roomId || getCurrentRoomId();
  const config = CARE_PACKAGE_CONFIG[type];
  let amount = config.defaultAmount;
  let deductMessage = '';

  // Khấu trừ tài nguyên
  if (type === 'chicken') {
    const chickenItem = state.inventory['chicken_meat'];
    if (chickenItem && chickenItem.amount >= 5) {
      consumeStock(chickenItem, 5);
      deductMessage = 'Đã trích 5 miếng gà tươi từ kho quán bạn';
    } else if (state.money >= 70000) {
      state.money -= 70000;
      deductMessage = 'Đã trích 70.000đ tiền vốn mua 5 miếng gà gửi bạn';
    } else {
      return {
        success: false,
        message: 'Bạn không có đủ 5 miếng gà tươi hoặc 70.000đ tiền vốn để gửi tiếp tế!'
      };
    }
  } else if (type === 'oil') {
    if (state.money < 50000) {
      return { success: false, message: 'Cần ít nhất 50.000đ để gửi Quỹ Hỗ Trợ Dầu Sạch!' };
    }
    state.money -= 50000;
    deductMessage = 'Đã trích 50.000đ hỗ trợ dầu sạch';
  } else if (type === 'tip') {
    if (state.money < 20000) {
      return { success: false, message: 'Cần ít nhất 20.000đ để gửi Lì Xì May Mắn!' };
    }
    state.money -= 20000;
    deductMessage = 'Đã trích 20.000đ lì xì bạn';
  }

  // Ghi nhận ngày gửi & Tăng điểm Karma Tình Thân Hẻm
  state.carePackagesSentDay = state.day;
  state.karma.community = Math.min(100, (state.karma.community || 50) + 5);

  const pkg: CarePackage = {
    id: `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    senderId: state.userId || 'unknown_sender',
    senderName: state.shopName || 'Tiệm Gà Hàng Xóm',
    recipientId,
    roomId,
    type,
    amount,
    message: `Thân gửi ${recipientName}, chúc quán buôn may bán đắt!`,
    sentAt: Date.now(),
    claimed: false
  };

  // Đồng bộ lên Cloud REST API
  try {
    const endpoint = getCloudEndpoint();
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          [`care_package_${pkg.id}`]: pkg
        }
      })
    });
  } catch {
    // Lưu vào localStorage fallback nếu offline
    try {
      const cacheKey = `care_pkg_out_${roomId}`;
      const existing: CarePackage[] = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      existing.push(pkg);
      localStorage.setItem(cacheKey, JSON.stringify(existing));
    } catch {}
  }

  return {
    success: true,
    message: `🎁 ${deductMessage}! Đã gửi ${config.name} tới ${recipientName}! (+5 Tình Thân Hẻm ❤️)`,
    package: pkg
  };
}

/**
 * Kiểm tra các gói quà tiếp tế người chơi nhận được
 */
export async function fetchPendingCarePackages(
  userId: string,
  roomId: string
): Promise<CarePackage[]> {
  try {
    const endpoint = getCloudEndpoint();
    const resp = await fetch(endpoint);
    if (!resp.ok) return [];
    const json = await resp.json();
    const data = json?.data || {};

    const packages: CarePackage[] = [];
    for (const key of Object.keys(data)) {
      if (key.startsWith('care_package_')) {
        const pkg = data[key] as CarePackage;
        if (pkg && pkg.recipientId === userId && pkg.roomId === roomId && !pkg.claimed) {
          packages.push(pkg);
        }
      }
    }
    return packages;
  } catch {
    // Fallback local
    try {
      const cacheKey = `care_pkg_out_${roomId}`;
      const existing: CarePackage[] = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      return existing.filter(p => p.recipientId === userId && !p.claimed);
    } catch {
      return [];
    }
  }
}

/**
 * Nhận gói quà tiếp tế và nạp vào tài sản của quán
 */
export async function claimCarePackage(
  state: GameState,
  pkg: CarePackage
): Promise<{ success: boolean; rewardSummary: string }> {
  if (pkg.claimed) {
    return { success: false, rewardSummary: 'Gói quà này đã được nhận trước đó!' };
  }

  let rewardSummary = '';
  if (pkg.type === 'chicken') {
    const item = state.inventory['chicken_meat'];
    if (item) {
      addStock(item, pkg.amount);
      rewardSummary = `+${pkg.amount} miếng Gà Tươi vào kho`;
    }
  } else if (pkg.type === 'oil') {
    if (state.oilCondition === 'dirty') {
      state.oilCondition = 'clean';
      state.oilBatchesCooked = 0;
      rewardSummary = 'Chảo dầu được thay mới tinh tươm (Clean)!';
    } else {
      state.money += pkg.amount;
      rewardSummary = `+${pkg.amount.toLocaleString('vi-VN')}đ tiền quỹ bảo dưỡng dầu`;
    }
  } else if (pkg.type === 'tip') {
    state.money += pkg.amount;
    rewardSummary = `+${pkg.amount.toLocaleString('vi-VN')}đ tiền tip lì xì may mắn`;
  }

  // Thưởng Karma
  state.karma.community = Math.min(100, (state.karma.community || 50) + 3);
  pkg.claimed = true;

  // Cập nhật trạng thái claimed lên Cloud
  try {
    const endpoint = getCloudEndpoint();
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          [`care_package_${pkg.id}`]: { ...pkg, claimed: true }
        }
      })
    });
  } catch {}

  return {
    success: true,
    rewardSummary: `Đã nhận thành công: ${rewardSummary} từ ${pkg.senderName}! (+3 Tình Thân Hẻm ❤️)`
  };
}
