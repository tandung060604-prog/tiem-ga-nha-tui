// Nguồn ngẫu nhiên duy nhất của game. Có seed để sau này làm Thử thách ngày
// (cùng seed → cùng khách, cùng order cho mọi người) và để test tái lập được.

export type Rng = () => number; // [0, 1)

// mulberry32: nhỏ, nhanh, đủ tốt cho game (không dùng cho mật mã)
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let current: Rng = createRng(Date.now());

export function random(): number {
  return current();
}

export function seedRandom(seed: number) {
  current = createRng(seed);
}

// Chọn theo trọng số (trọng số ≤ 0 = không bao giờ chọn); mảng rỗng hoặc tổng 0 → lỗi
export function weightedPick<T>(items: readonly T[], weight: (x: T) => number): T {
  const weights = items.map(x => Math.max(0, weight(x)));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new Error('weightedPick() không có phần tử nào có trọng số > 0');
  let r = random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] ?? 0;
    if (r < 0) return items[i] as T;
  }
  return items[items.length - 1] as T;
}

// Mảng rỗng → lỗi ngay chỗ gọi, thay vì trả undefined rồi crash ở nơi khác
export function pick<T>(items: readonly T[]): T {
  if (items.length === 0) throw new Error('pick() trên mảng rỗng');
  return items[Math.floor(random() * items.length)] as T;
}
