import { GameState } from '../types/game';
import { CHAPTERS } from '../content/chapters';

// "Gà Wrapped": tổng kết mỗi 7 ngày để người chơi chia sẻ lên Threads/Instagram.
// Chỉ đọc sổ sách (dayHistory) và review đã có → không cần lưu thêm gì; vẽ ở ui/components/WrappedCard.ts.

export const WRAPPED_EVERY = 7;
export const isWrappedDay = (day: number) => day > 0 && day % WRAPPED_EVERY === 0;

export interface WrappedData {
  week: number;
  fromDay: number;
  toDay: number;
  shopName: string;
  chapter: number;
  chapterTitle: string;
  revenue: number;      // doanh thu + tip
  profit: number;
  served: number;
  fried: number;
  perfectPct: number;   // 0–100
  bestStreak: number;
  stars: number;
  topDish: { id: string; name: string; count: number } | null;
  quote: { text: string; author: string; stars: number } | null;
  title: string;
  titleDesc: string;
}

function honorTitle(state: GameState, bestStreak: number, perfectPct: number): { title: string; desc: string } {
  // Chỉ số karma nổi trội (khởi đầu 50/50/50 → phải vượt 60 mới tính là "nổi")
  const k = state.karma;
  const top = (Object.entries(k) as [keyof typeof k, number][]).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 60) {
    if (top[0] === 'community') return { title: 'BẬC THẦY HẢO TÂM HẺM 1102', desc: 'Cả hẻm thương, Bác Ba khen nức nở!' };
    if (top[0] === 'craftsmanship') return { title: 'CHIẾN THẦN CANH LỬA', desc: 'Mẻ nào cũng giòn rụm đúng chuẩn!' };
    return { title: 'ÔNG TRÙM GÀ RÁN TƯƠNG LAI', desc: 'Tầm nhìn đế chế, tính từng đồng!' };
  }
  if (bestStreak >= 10) return { title: 'BẬC THẦY GIÒN RỤM', desc: `Chuỗi ${bestStreak} mẻ Perfect liên tiếp!` };
  if (perfectPct >= 80) return { title: 'ĐÔI TAY VÀNG', desc: `${perfectPct}% mẻ gà ra lò vàng giòn Perfect!` };
  return { title: 'NGƯỜI HÙNG KHỞI NGHIỆP HẺM 1102', desc: 'Chiếc xe đẩy vượt bao giông bão Sài Gòn!' };
}

// Tổng kết 7 ngày kết thúc ở `toDay` (mặc định: ngày gần nhất đã chốt sổ). null nếu chưa có ngày nào.
export function weeklyWrapped(state: GameState, toDay?: number): WrappedData | null {
  const last = state.dayHistory[state.dayHistory.length - 1];
  const end = toDay ?? last?.day;
  if (end === undefined) return null;
  const from = end - WRAPPED_EVERY + 1;
  const week = state.dayHistory.filter(l => l.day >= from && l.day <= end);
  if (week.length === 0) return null;

  const sum = (f: (l: (typeof week)[number]) => number) => week.reduce((n, l) => n + f(l), 0);
  const fried = sum(l => l.friedCount ?? 0);
  const perfect = sum(l => l.perfectCount ?? 0);
  const perfectPct = fried > 0 ? Math.round((perfect / fried) * 100) : 0;
  const bestStreak = Math.max(0, ...week.map(l => l.bestStreak ?? 0));

  // Món bán chạy: cộng số phần của món đứng đầu mỗi ngày
  const dishes = new Map<string, number>();
  for (const l of week) if (l.topSellerCount) dishes.set(l.topSellerId, (dishes.get(l.topSellerId) ?? 0) + l.topSellerCount);
  const topEntry = [...dishes.entries()].sort((a, b) => b[1] - a[1])[0];
  const topDish = topEntry
    ? { id: topEntry[0], name: state.menu.find(m => m.id === topEntry[0])?.name ?? topEntry[0], count: topEntry[1] }
    : null;

  // Review "viral" của tuần: nhiều sao nhất, câu dài hơn (có chuyện để kể) được ưu tiên
  const review = [...state.recentReviews, ...state.bestReviews]
    .filter(r => r.day >= from && r.day <= end && r.comment)
    .sort((a, b) => b.stars - a.stars || b.comment.length - a.comment.length)[0];

  const chapter = CHAPTERS.find(c => c.number === state.currentChapter);
  const { title, desc } = honorTitle(state, bestStreak, perfectPct);
  return {
    week: Math.ceil(end / WRAPPED_EVERY),
    fromDay: Math.max(1, from),
    toDay: end,
    shopName: state.shopName,
    chapter: state.currentChapter,
    chapterTitle: chapter?.title ?? '',
    revenue: sum(l => l.grossRevenue + l.tips),
    profit: sum(l => l.netProfit),
    served: sum(l => l.customersServed),
    fried,
    perfectPct,
    bestStreak,
    stars: Math.round(state.ratings.overall * 10) / 10,
    topDish,
    quote: review ? { text: review.comment, author: review.authorName, stars: review.stars } : null,
    title,
    titleDesc: desc
  };
}
