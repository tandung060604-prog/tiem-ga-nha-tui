import { DeliveryRunResult } from '../types/game';

export interface DeliveryObstacle {
  id: string;
  lane: 0 | 1 | 2;
  y: number; // 0 (top) to 100 (bottom)
  type: 'pothole' | 'barrier' | 'cart';
  icon: string;
  name: string;
  hit: boolean;
}

export interface DeliveryRunState {
  playerLane: 0 | 1 | 2;
  distanceProgress: number; // 0 to 100%
  timeLeftSeconds: number; // 15s countdown
  totalDuration: number;
  obstacles: DeliveryObstacle[];
  crashes: number;
  isFinished: boolean;
}

export class DeliveryRunnerEngine {
  public static readonly DURATION_SEC = 15;
  public static readonly OUTSOURCE_COST = 15000;

  public static createInitialState(durationSec: number = DeliveryRunnerEngine.DURATION_SEC): DeliveryRunState {
    return {
      playerLane: 1, // bắt đầu ở làn giữa
      distanceProgress: 0,
      timeLeftSeconds: durationSec,
      totalDuration: durationSec,
      obstacles: [],
      crashes: 0,
      isFinished: false
    };
  }

  public static moveLeft(state: DeliveryRunState): void {
    if (state.isFinished) return;
    if (state.playerLane > 0) {
      state.playerLane = (state.playerLane - 1) as 0 | 1 | 2;
    }
  }

  public static moveRight(state: DeliveryRunState): void {
    if (state.isFinished) return;
    if (state.playerLane < 2) {
      state.playerLane = (state.playerLane + 1) as 0 | 1 | 2;
    }
  }

  public static setLane(state: DeliveryRunState, lane: 0 | 1 | 2): void {
    if (state.isFinished) return;
    state.playerLane = lane;
  }

  public static tick(state: DeliveryRunState, deltaMs: number): boolean {
    if (state.isFinished) return false;

    state.timeLeftSeconds = Math.max(0, state.timeLeftSeconds - deltaMs / 1000);
    state.distanceProgress = Math.min(100, ((DeliveryRunnerEngine.DURATION_SEC - state.timeLeftSeconds) / DeliveryRunnerEngine.DURATION_SEC) * 100);

    // Di chuyển vật cản xuống dưới (tốc độ ~35% màn hình / giây)
    const moveAmount = (35 * deltaMs) / 1000;
    for (const obs of state.obstacles) {
      obs.y += moveAmount;
    }

    // Kiểm tra va chạm (Vị trí xe máy ở y = 82, vùng va chạm 76 -> 88)
    let newCrash = false;
    for (const obs of state.obstacles) {
      if (!obs.hit && obs.y >= 74 && obs.y <= 88 && obs.lane === state.playerLane) {
        obs.hit = true;
        state.crashes += 1;
        newCrash = true;
      }
    }

    // Xóa vật cản đã trôi qua khỏi màn hình (y > 105)
    state.obstacles = state.obstacles.filter(o => o.y <= 105);

    // Sinh vật cản mới ngẫu nhiên (cách nhau tối thiểu một khoảng an toàn)
    const lastObsY = state.obstacles.length > 0 ? Math.min(...state.obstacles.map(o => o.y)) : 100;
    if (lastObsY > 26 && state.timeLeftSeconds > 1.8 && Math.random() < 0.22) {
      const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      const typeRand = Math.random();
      const type: DeliveryObstacle['type'] = typeRand < 0.4 ? 'pothole' : (typeRand < 0.75 ? 'barrier' : 'cart');
      const icons: Record<DeliveryObstacle['type'], { icon: string; name: string }> = {
        pothole: { icon: '🕳️', name: 'Ổ gà vũng nước' },
        barrier: { icon: '🚧', name: 'Rào chắn công trình' },
        cart: { icon: '🛺', name: 'Xe ba gác cồng kềnh' }
      };

      state.obstacles.push({
        id: `obs_${Date.now()}_${Math.random()}`,
        lane,
        y: -10,
        type,
        icon: icons[type].icon,
        name: icons[type].name,
        hit: false
      });
    }

    if (state.timeLeftSeconds <= 0) {
      state.isFinished = true;
    }

    return newCrash;
  }

  public static evaluateResult(state: DeliveryRunState): DeliveryRunResult {
    if (state.crashes === 0) {
      return {
        mode: 'manual',
        crashes: 0,
        tipBonus: 40000,
        speedRatingDelta: 0.25,
        message: 'Tay lái lụa thần sầu! Gà giao tới nơi vẫn nóng hổi giòn rụm bốc khói, khách mê mẩn thưởng thêm 40.000đ tip và tặng 5★ tốc độ!'
      };
    } else if (state.crashes <= 2) {
      const tip = state.crashes === 1 ? 20000 : 10000;
      return {
        mode: 'manual',
        crashes: state.crashes,
        tipBonus: tip,
        speedRatingDelta: 0.05,
        message: `Đã giao hàng an toàn! Xe vấp nhẹ ${state.crashes} lần, gà vẫn ấm giòn, khách hài lòng tip thêm ${tip.toLocaleString('vi-VN')}đ!`
      };
    } else {
      return {
        mode: 'manual',
        crashes: state.crashes,
        tipBonus: 0,
        speedRatingDelta: -0.2,
        message: `Ổ gà tưng bừng vấp ${state.crashes} lần! Hộp gà bị móp méo, sốt tràn ra ngoài, khách càu nhàu trừ điểm sao tốc độ!`
      };
    }
  }

  public static evaluateOutsource(): DeliveryRunResult {
    return {
      mode: 'outsourced',
      crashes: 0,
      tipBonus: 0,
      speedRatingDelta: 0,
      message: 'Đã thuê shipper công nghệ giao hàng an toàn (-15.000đ cước phí).'
    };
  }
}
