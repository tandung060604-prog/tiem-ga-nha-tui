// Dùng cho mọi chuỗi do người chơi nhập trước khi nhét vào template innerHTML.
const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(text?: string | null): string {
  if (typeof text !== 'string') {
    return text === null || text === undefined ? '' : String(text);
  }
  return text.replace(/[&<>"']/g, ch => ENTITIES[ch] ?? ch);
}

export { SHOP_NAME_MAX } from '../core/shopName';
