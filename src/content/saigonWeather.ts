import { SaigonWeather, SaigonWeatherId } from '../types/game';

export const SAIGON_WEATHERS: Record<SaigonWeatherId, SaigonWeather> = {
  sunny_hot: {
    id: 'sunny_hot',
    name: 'Nắng Gắt Chang Chang',
    icon: '☀️',
    badgeText: '☀️ Nắng Gắt 36°C (Đơn Ship x1.5 · Nước Uống x1.8)',
    flavorQuote: 'Trưa nắng đổ lửa, ve kêu râm ran. Khách ngại ra đường gọi ship ào ào, nước sâm trà đào bán cháy máy!',
    dineInMultiplier: 0.85,
    deliveryMultiplier: 1.5,
    walkupDrinkMultiplier: 1.8,
    oilHeatModifier: 0.15, // Dầu nóng nhanh hơn
    patienceModifier: 0.9,  // Khách dễ quạu hơn vì oi bức
    bgAtmosphereClass: 'weather-sunny-hot',
  },
  sudden_rain: {
    id: 'sudden_rain',
    name: 'Mưa Rào Trú Chân',
    icon: '🌧️',
    badgeText: '🌧️ Mưa Rào Trú Chân (Khách Bàn x1.35 · Gà Cay Bán Chạy)',
    flavorQuote: 'Cơn mưa rào bất chợt đổ ào xuống mái tôn. Khách đi đường tấp vào trú chân ngồi kín bàn, gọi mẹt gà nóng giòn!',
    dineInMultiplier: 1.35,
    deliveryMultiplier: 0.9,
    walkupDrinkMultiplier: 0.7,
    oilHeatModifier: -0.05,
    patienceModifier: 1.1,  // Trú mưa nên khách thong thả ngồi đợi
    bgAtmosphereClass: 'weather-sudden-rain',
  },
  cool_breeze: {
    id: 'cool_breeze',
    name: 'Gió Chiều Mát Rượi',
    icon: '🍃',
    badgeText: '🍃 Gió Chiều Mát Rượi (Khách Kiên Nhẫn +15% · Tip Đậm)',
    flavorQuote: 'Gió mát từ bờ kênh lộng vào ngõ hẻm. Khách tâm trạng vui vẻ, vừa nhâm nhi gà vừa cười nói rôm rả!',
    dineInMultiplier: 1.15,
    deliveryMultiplier: 1.1,
    walkupDrinkMultiplier: 1.2,
    oilHeatModifier: 0.0,
    patienceModifier: 1.25, // Khách cực kỳ kiên nhẫn
    bgAtmosphereClass: 'weather-cool-breeze',
  },
  thunderstorm: {
    id: 'thunderstorm',
    name: 'Giông Bão Sấm Sét',
    icon: '⛈️',
    badgeText: '⛈️ Giông Bão Sấm Sét (Đơn Giao Tận Nhà x1.6 · Dầu Nguội)',
    flavorQuote: 'Sấm chớp rền vang, nước ngập lấp xấp ngõ hẻm. Các bác tài shipper trùm áo mưa nối đuôi nhau lấy đơn cứu đói!',
    dineInMultiplier: 0.75,
    deliveryMultiplier: 1.6,
    walkupDrinkMultiplier: 0.6,
    oilHeatModifier: -0.15,
    patienceModifier: 1.0,
    bgAtmosphereClass: 'weather-thunderstorm',
  },
  golden_sunset: {
    id: 'golden_sunset',
    name: 'Chiều Nắng Vàng Hẻm',
    icon: '🌅',
    badgeText: '🌅 Nắng Vàng Hoàng Hôn (Khách Cặp Đôi & Gen Z x1.3)',
    flavorQuote: 'Ánh hoàng hôn nhuộm vàng vách tường rêu phong Hẻm 1102. Các bạn trẻ rủ nhau check-in ăn gà giòn rụm!',
    dineInMultiplier: 1.25,
    deliveryMultiplier: 1.0,
    walkupDrinkMultiplier: 1.3,
    oilHeatModifier: 0.05,
    patienceModifier: 1.15,
    bgAtmosphereClass: 'weather-golden-sunset',
  },
};

/**
 * Xác định thời tiết Sài Gòn theo ngày game (vòng lặp chu kỳ tự nhiên kết hợp ngẫu nhiên theo mùa)
 */
export function getWeatherForDay(day: number): SaigonWeather {
  // Bảng chu kỳ kết hợp seed ngày để nhất quán
  const cycle: SaigonWeatherId[] = [
    'sunny_hot',
    'sudden_rain',
    'cool_breeze',
    'golden_sunset',
    'sunny_hot',
    'thunderstorm',
    'sudden_rain',
    'cool_breeze',
    'golden_sunset',
    'sunny_hot',
  ];

  const weatherId = cycle[(day - 1) % cycle.length] ?? 'cool_breeze';
  return SAIGON_WEATHERS[weatherId];
}
