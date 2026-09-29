import { describe, it, expect, beforeEach } from 'vitest';
import { getTodayWholesaler, executeBargain, WHOLESALERS } from '../src/core/marketBargain';
import { DeliveryRunnerEngine } from '../src/core/deliveryRunner';
import { music } from '../src/core/music';
import { audio } from '../src/core/audio';
import { closeDay, eventForDay } from '../src/core/day';
import { createSellingSession } from '../src/core/sellingSim';
import { DAILY_INCIDENTS, getIncidentById } from '../src/content/dailyIncidents';
import { createInitialState } from '../src/core/state';

describe('Minigame Đi Chợ Đầu Mối Chợ Lớn (Market Bargain)', () => {
  it('luân phiên tiểu thương theo ngày', () => {
    const w1 = getTodayWholesaler(1);
    const w2 = getTodayWholesaler(2);
    const w3 = getTodayWholesaler(3);
    const w4 = getTodayWholesaler(4);

    expect(w1.id).toBe('co_nam');
    expect(w2.id).toBe('chu_bay');
    expect(w3.id).toBe('di_tam');
    expect(w4.id).toBe('co_nam'); // Quay lại cô Năm
  });

  it('thực hiện 3 chiến thuật đàm phán và trả về kết quả hợp lệ', () => {
    const wholesaler = WHOLESALERS[0];
    
    const resFriendly = executeBargain(wholesaler, 'friendly');
    expect(resFriendly.discountPercent).toBeGreaterThanOrEqual(0);
    expect(resFriendly.discountPercent).toBeLessThanOrEqual(25);
    expect(resFriendly.message).toBeTruthy();

    const resVolume = executeBargain(wholesaler, 'volume');
    expect(resVolume.discountPercent).toBeGreaterThanOrEqual(0);
    expect(resVolume.discountPercent).toBeLessThanOrEqual(30);

    const resHardball = executeBargain(wholesaler, 'hardball');
    expect(resHardball.discountPercent).toBeGreaterThanOrEqual(0);
    expect(resHardball.discountPercent).toBeLessThanOrEqual(35);
  });
});

describe('Minigame Chạy Xe Giao Đơn Xa (Delivery Runner)', () => {
  it('khởi tạo trạng thái ban đầu chính xác', () => {
    const state = DeliveryRunnerEngine.createInitialState(15);
    expect(state.playerLane).toBe(1);
    expect(state.timeLeftSeconds).toBe(15);
    expect(state.totalDuration).toBe(15);
    expect(state.crashes).toBe(0);
    expect(state.obstacles).toHaveLength(0);
    expect(state.isFinished).toBe(false);
  });

  it('di chuyển làn xe không vượt quá 0 và 2', () => {
    const state = DeliveryRunnerEngine.createInitialState(15);
    DeliveryRunnerEngine.moveLeft(state);
    expect(state.playerLane).toBe(0);
    DeliveryRunnerEngine.moveLeft(state);
    expect(state.playerLane).toBe(0); // Không rớt khỏi lề trái

    DeliveryRunnerEngine.moveRight(state);
    expect(state.playerLane).toBe(1);
    DeliveryRunnerEngine.moveRight(state);
    expect(state.playerLane).toBe(2);
    DeliveryRunnerEngine.moveRight(state);
    expect(state.playerLane).toBe(2); // Không rớt khỏi lề phải

    DeliveryRunnerEngine.setLane(state, 1);
    expect(state.playerLane).toBe(1);
  });

  it('phát hiện va chạm vật cản chuẩn xác', () => {
    const state = DeliveryRunnerEngine.createInitialState(15);
    state.obstacles.push({
      id: 'test_obs',
      lane: 1,
      y: 75, // Trùng toạ độ với xe (70 - 92)
      type: 'pothole',
      icon: '🕳️',
      name: 'Ổ gà',
      hit: false
    });

    const crashed = DeliveryRunnerEngine.tick(state, 100);
    expect(crashed).toBe(true);
    expect(state.crashes).toBe(1);
    expect(state.obstacles[0].hit).toBe(true);
  });

  it('đánh giá kết quả giao hàng đạt chuẩn', () => {
    // Không va chạm (Perfect)
    const state0 = DeliveryRunnerEngine.createInitialState(15);
    state0.crashes = 0;
    const res0 = DeliveryRunnerEngine.evaluateResult(state0);
    expect(res0.crashes).toBe(0);
    expect(res0.tipBonus).toBe(40000);
    expect(res0.speedRatingDelta).toBe(0.25);

    // 1-2 va chạm
    const state1 = DeliveryRunnerEngine.createInitialState(15);
    state1.crashes = 1;
    const res1 = DeliveryRunnerEngine.evaluateResult(state1);
    expect(res1.tipBonus).toBe(20000);
    expect(res1.speedRatingDelta).toBe(0.05);

    // 3+ va chạm
    const state3 = DeliveryRunnerEngine.createInitialState(15);
    state3.crashes = 3;
    const res3 = DeliveryRunnerEngine.evaluateResult(state3);
    expect(res3.tipBonus).toBe(0);
    expect(res3.speedRatingDelta).toBe(-0.2);

    // Thuê ngoài
    const resOutsource = DeliveryRunnerEngine.evaluateOutsource();
    expect(resOutsource.mode).toBe('outsourced');
    expect(resOutsource.tipBonus).toBe(0);
  });
});

describe('Audio & Music Volume Sliders', () => {
  it('cho phép điều chỉnh âm lượng BGM độc lập', () => {
    music.setVolume(0.4);
    expect(music.getVolume()).toBe(0.4);
    music.setVolume(1.0);
    expect(music.getVolume()).toBe(1.0);
  });

  it('cho phép điều chỉnh âm lượng SFX độc lập', () => {
    audio.setSfxVolume(0.6);
    expect(audio.getSfxVolume()).toBe(0.6);
    audio.setSfxVolume(0.0);
    expect(audio.getSfxVolume()).toBe(0.0);
    audio.setSfxVolume(0.8); // Khôi phục mặc định
  });
});

describe('Khởi tạo lại trạng thái mỗi ngày (closeDay)', () => {
  it('reset giảm giá chợ và số lượt chạy xe khi kết thúc ngày', () => {
    const state = createInitialState();
    state.todayMarketDiscount = 25;
    state.todayMarketBargained = true;
    state.deliveryRunnerDayCount = 2;

    const session = createSellingSession(1);
    closeDay(state, session, eventForDay(state.day));

    expect(state.todayMarketDiscount).toBe(0);
    expect(state.todayMarketBargained).toBe(false);
    expect(state.deliveryRunnerDayCount).toBe(0);
  });
});

describe('Tuyến sự kiện đối thủ Chuỗi Gà Rán Phố Cao', () => {
  it('có 2 sự kiện Phố Cao trong danh sách Daily Incidents', () => {
    const flyerWar = getIncidentById('incident_pho_cao_flyer_war');
    expect(flyerWar).toBeDefined();
    expect(flyerWar?.title).toContain('Gà Rán Phố Cao Rải Tờ Rơi');
    expect(flyerWar?.choices).toHaveLength(3);

    const shipperHelp = getIncidentById('incident_pho_cao_shipper_help');
    expect(shipperHelp).toBeDefined();
    expect(shipperHelp?.title).toContain('Shipper Phố Cao Chết Máy');
    expect(shipperHelp?.choices).toHaveLength(3);
  });
});
