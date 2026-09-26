import { KarmaState } from '../types/game';

// Lựa chọn trong truyện và sự cố (karma) có tác dụng THẬT trong ca bán, không chỉ quyết định kết thúc.
// Mỗi chỉ số 0–100, mốc trung tính 50. Lệch khỏi 50 → hiệu ứng tỉ lệ, cả chiều tốt lẫn xấu:
//  • Tình Hẻm (community): khách quen kiên nhẫn hơn (hẻm thương quán) — thấp thì khách dễ quạu
//  • Nghệ Nhân (craftsmanship): tiếng lành "gà ngon" — sao Hương vị nhích dần mỗi ngày
//  • Tham Vọng (ambition): thêm khách (quảng bá mạnh) nhưng chi phí mặt bằng/điện nước đội lên

export interface KarmaEffects {
  patiencePct: number;       // cộng vào độ kiên nhẫn của khách (%)
  customersPct: number;      // cộng vào số khách mỗi ngày (%)
  overheadPct: number;       // cộng vào mặt bằng + điện nước (%), chỉ khi tham vọng > 50
  tasteDriftPerDay: number;  // sao Hương vị cộng/trừ mỗi ngày
}

export const KARMA_LIMITS = { patiencePct: 12, customersPct: 15, overheadPct: 12, tasteDriftPerDay: 0.05 } as const;

// -1 … +1 quanh mốc 50
const lean = (v: number) => Math.max(-1, Math.min(1, (v - 50) / 50));

export function karmaEffects(k: KarmaState | undefined): KarmaEffects {
  const c = lean(k?.community ?? 50);
  const a = lean(k?.ambition ?? 50);
  const m = lean(k?.craftsmanship ?? 50);
  return {
    patiencePct: Math.round(KARMA_LIMITS.patiencePct * c),
    customersPct: Math.round(KARMA_LIMITS.customersPct * a),
    overheadPct: Math.round(KARMA_LIMITS.overheadPct * Math.max(0, a)),
    tasteDriftPerDay: Math.round(KARMA_LIMITS.tasteDriftPerDay * m * 100) / 100
  };
}

// Dòng mô tả cho giao diện (bảng kế hoạch / cảnh truyện). Chỉ liệt kê hiệu ứng khác 0.
export function describeKarmaEffects(k: KarmaState | undefined): string[] {
  const e = karmaEffects(k);
  const sign = (v: number) => (v > 0 ? `+${v}` : `${v}`);
  const out: string[] = [];
  if (e.patiencePct) out.push(`🏘️ Tình Hẻm: khách ${e.patiencePct > 0 ? 'kiên nhẫn hơn' : 'dễ quạu hơn'} ${sign(e.patiencePct)}%`);
  if (e.tasteDriftPerDay) out.push(`👨‍🍳 Nghệ Nhân: sao Hương vị ${sign(e.tasteDriftPerDay)}/ngày`);
  if (e.customersPct) out.push(`🚀 Tham Vọng: khách ${sign(e.customersPct)}%${e.overheadPct ? `, chi phí mặt bằng +${e.overheadPct}%` : ''}`);
  return out;
}
