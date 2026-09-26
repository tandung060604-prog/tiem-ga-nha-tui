// Tên quán do chủ tiệm tự đặt. Hiển thị qua escapeHtml; ở đây chỉ làm sạch và giới hạn độ dài.
export const SHOP_NAME_MAX = 24;
export const DEFAULT_SHOP_NAME = 'Tiệm Gà Nhà Tui';
export const SHOP_NAME_SUGGESTIONS = [
  'Tiệm Gà Nhà Tui', 'Gà Giòn Hẻm 14', 'Gà Rán Cô Ba', 'Gà Bông Quán', 'Xèo Xèo Chicken', 'Gà Cháy Túi'
] as const;

// Bỏ ký tự điều khiển / xuống dòng, gộp khoảng trắng, cắt theo ký tự (không cắt đôi emoji), rỗng → tên mặc định
export function normalizeShopName(input: string): string {
  const clean = input.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim();
  const chars = [...clean].slice(0, SHOP_NAME_MAX).join('').trim();
  return chars || DEFAULT_SHOP_NAME;
}
