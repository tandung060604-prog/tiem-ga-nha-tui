import { GameState } from '../types/game';
import { migrateSave } from './state';
import { signSave, flagIntegrity } from './integrity';

// Mã sao lưu: chép tiến trình sang máy khác, hoặc cứu save khi trình duyệt tự xóa dữ liệu
// (Safari iOS xóa dữ liệu trang không mở ~7 ngày nếu chưa thêm vào Màn hình chính).
// Dạng: "TGNT1." + base64(UTF-8 JSON {data, sig}). Chữ ký giống save thường: sửa mã → bị gắn cờ.
const PREFIX = 'TGNT1.';

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): string {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

export function exportSaveCode(state: GameState): string {
  const data = JSON.stringify({ ...state, pausedShift: null }); // mã sao lưu không mang theo ca bán dở
  return PREFIX + toBase64(JSON.stringify({ data, sig: signSave(data) }));
}

export type ImportResult =
  | { ok: true; state: GameState; tampered: boolean }
  | { ok: false; reason: string };

export function importSaveCode(code: string): ImportResult {
  const trimmed = code.trim().replace(/\s+/g, '');
  if (!trimmed.startsWith(PREFIX)) return { ok: false, reason: 'Mã không đúng định dạng (phải bắt đầu bằng TGNT1.)' };
  let payload: { data?: unknown; sig?: unknown };
  try {
    payload = JSON.parse(fromBase64(trimmed.slice(PREFIX.length)));
  } catch {
    return { ok: false, reason: 'Mã bị thiếu hoặc hỏng, hãy chép lại toàn bộ mã.' };
  }
  if (typeof payload.data !== 'string') return { ok: false, reason: 'Mã không chứa tiến trình.' };
  let raw: unknown;
  try { raw = JSON.parse(payload.data); } catch { return { ok: false, reason: 'Mã bị hỏng.' }; }
  const result = migrateSave(raw);
  if (!result) return { ok: false, reason: 'Mã không phải tiến trình của Tiệm Gà Nhà Tui.' };
  const tampered = payload.sig !== signSave(payload.data);
  if (tampered) flagIntegrity(result.state, ['Mã sao lưu bị chỉnh sửa']);
  return { ok: true, state: result.state, tampered };
}
