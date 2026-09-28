import { MenuItem } from '../types/game';

// Luật giá: người chơi chỉnh giá trong khoảng 70%–150% giá gốc. Đắt quá thì khách ít chọn món đó, ít khách tới
// quán, sao Giá cả tụt (kéo sao tổng → chặn lên chương, kết thúc Bí mật), và hẻm mang tiếng "chặt chém"
// (Tình Hẻm giảm → kết thúc Hạnh phúc / Tập đoàn). Rẻ thì ngược lại nhưng lãi mỏng.
// Mọi con số ở đây; mô phỏng: npm run sim -- --price 1.3

export const MIN_PRICE_RATIO = 0.7;
export const MAX_PRICE_RATIO = 1.5;
export const PRICE_STEP = 2000;
const FAIR_UP_TO = 1.1; // tới 110% giá gốc vẫn là "Hợp lý"

export type PriceBand = 'cheap' | 'fair' | 'pricey' | 'expensive' | 'gouging';

export const PRICE_BANDS: Record<PriceBand, { label: string; icon: string; upTo: number }> = {
  cheap: { label: 'Rẻ', icon: '💚', upTo: 0.9 },
  fair: { label: 'Hợp lý', icon: '👌', upTo: 1.1 },
  pricey: { label: 'Hơi đắt', icon: '🟡', upTo: 1.25 },
  expensive: { label: 'Đắt', icon: '🟠', upTo: 1.4 },
  gouging: { label: 'Cắt cổ', icon: '🔴', upTo: Infinity }
};

export const priceRatio = (item: Pick<MenuItem, 'currentPrice' | 'basePrice'>) =>
  item.basePrice > 0 ? item.currentPrice / item.basePrice : 1;

export function priceBand(ratio: number): PriceBand {
  for (const band of Object.keys(PRICE_BANDS) as PriceBand[]) {
    if (ratio <= PRICE_BANDS[band].upTo + 1e-9) return band;
  }
  return 'gouging';
}

// Khoảng giá được phép của một món (làm tròn nghìn, không dưới 5.000đ)
export function priceLimits(item: Pick<MenuItem, 'basePrice'>): { min: number; max: number } {
  return {
    min: Math.max(5000, Math.ceil((item.basePrice * MIN_PRICE_RATIO) / 1000) * 1000),
    max: Math.floor((item.basePrice * MAX_PRICE_RATIO) / 1000) * 1000
  };
}

// Đổi giá có kiểm soát (UI gọi hàm này). Trả về giá mới, hoặc null nếu đã chạm trần/sàn.
export function adjustPrice(item: MenuItem, delta: number): number | null {
  const { min, max } = priceLimits(item);
  const next = Math.max(min, Math.min(max, item.currentPrice + delta));
  if (next === item.currentPrice) return null;
  item.currentPrice = next;
  return next;
}

// Khách chọn một món: rẻ → được chọn nhiều hơn, đắt → ít dần (150% giá gốc gần như không ai gọi)
export function demandWeight(ratio: number): number {
  if (ratio <= 1) return 1 + (1 - ratio) * 1.5;
  return Math.max(0.08, 1 - (ratio - 1) * 2.2);
}

// Giá trung bình của các món đang bán (đã mở chương và đã tới ngày) so với giá gốc
export function averagePriceRatio(state: { menu: MenuItem[]; currentChapter: number; day?: number }): number {
  const selling = state.menu.filter(m =>
    m.chapter <= state.currentChapter &&
    (state.day !== undefined ? (m.unlockDay ?? 1) <= state.day : true) &&
    m.basePrice > 0
  );
  if (selling.length === 0) return 1;
  return selling.reduce((sum, m) => sum + priceRatio(m), 0) / selling.length;
}

// Tiếng giá của quán lan ra: đắt → ít người ghé (tới -75%), rẻ → đông hơn (tới +24%)
export function customerMultiplierFromPrice(avgRatio: number): number {
  if (avgRatio <= 1) return 1 + (1 - avgRatio) * 0.8;
  if (avgRatio <= FAIR_UP_TO) return 1; // vùng Hợp lý: không phạt
  return Math.max(0.25, 1 - (avgRatio - FAIR_UP_TO) * 1.9);
}

// Khách đứng quầy thấy giá: tới 110% vẫn chịu chờ; đắt hơn thì mau quạu (150% giá gốc: còn 35% kiên nhẫn).
// Mô phỏng: quán bị giới hạn bởi sức bếp nên ít khách tới không đủ răn đe → cần phản ứng tại quầy.
export function patienceFactorFromPrice(orderRatio: number): number {
  return orderRatio <= 1.1 ? 1 : Math.max(0.35, 1 - (orderRatio - 1.1) * 1.6);
}

// Sao Giá cả mà khách hướng tới (sao thật nhích dần về đây mỗi ngày): ≤105% → 4,6 · 115% → 3,7 · 130% → 2,4 · ≥140% → 1,5.
// Mô phỏng: dốc hơn mức này thì quán chặt chém lâu ngày vẫn đủ 4,6 sao tổng để vào Chương 5.
export function pricingTarget(avgRatio: number): number {
  if (avgRatio <= 1) return Math.min(5, 4.6 + (1 - avgRatio) * 4); // rẻ: khách khen giá
  return Math.max(1.5, 4.6 - Math.max(0, avgRatio - 1.05) * 9);     // ≤105% giữ 4,6; đắt tụt nhanh
}

// Tình Hẻm mỗi ngày theo mức giá: chặt chém bị cả hẻm bàn tán, giá bình dân được thương
export function communityDriftFromPrice(avgRatio: number): number {
  const band = priceBand(avgRatio);
  if (band === 'gouging') return -2;
  if (band === 'expensive') return -1;
  if (band === 'cheap') return 0.5;
  return 0;
}
