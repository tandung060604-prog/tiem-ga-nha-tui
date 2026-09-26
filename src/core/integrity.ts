import { GameState } from '../types/game';
import { BUNNY_LETTERS } from '../content/mysteryBunny';

// Chống gian lận cho game chạy hoàn toàn trên trình duyệt (GitHub Pages, không có máy chủ).
// Không có cách nào chặn tuyệt đối người sửa code trên máy của họ; mục tiêu là:
//  1. Phát hiện save bị sửa tay (chữ ký) và sổ sách vô lý (bất biến kinh tế).
//  2. Hậu quả rõ ràng: vẫn chơi được, nhưng bị đánh dấu và không được công nhận kết thúc Viên mãn/Bí mật.

export const START_MONEY = 850000;

// Chữ ký FNV-1a 32-bit có muối: đủ để phát hiện sửa tay localStorage, không phải mật mã.
const SALT = 'hem-1102|ga-bong|1990';
export function signSave(json: string): string {
  let h = 0x811c9dc5;
  const input = SALT + json;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

// Bất biến chỉ có thể sai nếu save bị sửa (hoặc có bug) — mỗi luật kèm lý do đọc được.
export function auditState(state: GameState): string[] {
  const issues: string[] = [];
  const s = state.lifetimeStats;
  const bonus = s.totalBonus ?? 0;

  // Tiền chỉ vào từ: vốn đầu + bán hàng (gồm tip) + thưởng (Thỏ Cam, Bác Ba). Chi tiêu chỉ làm giảm.
  const ceiling = START_MONEY + s.totalRevenue + bonus;
  if (state.money > ceiling + 1) issues.push(`Tiền (${state.money}) vượt tổng thu nhập từ trước tới nay (${ceiling})`);

  if (s.perfectFriedCount > s.totalFried) issues.push('Số mẻ Perfect lớn hơn tổng số mẻ đã chiên');
  if (s.totalBurnt > s.totalFried) issues.push('Số mẻ cháy lớn hơn tổng số mẻ đã chiên');

  for (const c of ['taste', 'speed', 'hygiene', 'space', 'pricing', 'overall'] as const) {
    const v = state.ratings[c];
    if (!(v >= 1 && v <= 5)) issues.push(`Sao ${c} ngoài khoảng 1–5`);
  }

  // Chỉ qua chương bằng đặt cọc: số chương đã mở ≤ 1 + số lần đặt cọc
  if (state.currentChapter > 1 + (state.depositsPaid ?? 0)) issues.push('Mở chương không qua đặt cọc');

  if (state.dayHistory.length > state.day) issues.push('Lịch sử có nhiều ngày hơn số ngày đã chơi');
  for (const d of state.dayHistory) {
    if (d.customersServed > 400) issues.push(`Ngày ${d.day}: phục vụ ${d.customersServed} khách (vô lý)`);
  }

  const validLetters = new Set(BUNNY_LETTERS.map(l => l.id));
  if (state.unlockedBunnyLetters.some(id => !validLetters.has(id))) issues.push('Có thư Thỏ Cam không tồn tại');

  const grand = (state.achievedEndings ?? []).filter(e => e !== 'bad_bankruptcy');
  if (grand.length > 0 && state.currentChapter < 5) issues.push('Có kết thúc lớn khi chưa tới Chương 5');

  return issues;
}

// Ghi nhận vi phạm (giữ nguyên dấu đã có: đã sửa save thì không "tẩy trắng" được)
export function flagIntegrity(draft: GameState, reasons: string[]) {
  if (reasons.length === 0) return;
  const prev = draft.integrity?.reasons ?? [];
  draft.integrity = { tampered: true, reasons: [...new Set([...prev, ...reasons])].slice(0, 20) };
}

export function isTampered(state: GameState): boolean {
  return state.integrity?.tampered === true;
}
