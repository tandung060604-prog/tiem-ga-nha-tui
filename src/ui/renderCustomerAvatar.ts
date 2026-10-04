import { ASSETS } from '../content/assets';
import { escapeHtml } from './escapeHtml';

/**
 * Render avatar khách hàng chuẩn pixel art / emoji sạch:
 * - Nếu avatar là chuỗi char_... hoặc đường dẫn ảnh: render <img> tròn pixel art viền vàng men gốm.
 * - Nếu avatar là emoji: render <span> tròn nền vàng kem.
 */
export function renderCustomerAvatar(
  avatar?: string,
  authorName?: string,
  size = 36,
  extraClass = ''
): string {
  const raw = (avatar || '').trim();
  const name = authorName || 'Khách Hẻm';

  // 1. Kiểm tra nếu là URL ảnh hoặc chứa char_
  let imgSrc = '';
  if (raw.includes('/') || raw.endsWith('.png') || raw.endsWith('.jpg') || raw.startsWith('data:')) {
    imgSrc = raw;
  } else if (raw.startsWith('char_')) {
    const chars = ASSETS.characters as Record<string, string | undefined>;
    imgSrc = chars[raw] || `/assets/characters/${raw}.png`;
  } else if (!raw || raw === '🍗') {
    // Nếu rỗng hoặc fallback đùi gà cũ, tra cứu theo tên tác giả nếu là nhân vật quen thuộc
    const chars = ASSETS.characters as Record<string, string | undefined>;
    if (name.includes('Bác Ba') || name.includes('Bác Hai')) imgSrc = chars.char_08_grumpy_hai || '';
    else if (name.includes('Linh') || name.includes('Bé Linh')) imgSrc = chars.char_03_helper_linh || '';
    else if (name.includes('Vy') || name.includes('Trendy')) imgSrc = chars.char_07_trendy_vy || '';
    else if (name.includes('Tuấn') || name.includes('Shipper')) imgSrc = chars.char_19_shipper_tuan || '';
    else if (name.includes('Bo') || name.includes('Khách Nhí')) imgSrc = chars.char_05_kid_bo || '';
    else if (name.includes('Vé Số') || name.includes('Cô Bảy')) imgSrc = chars.char_02_lottery_lady || '';
    else if (name.includes('Cụ Ba') || name.includes('Bà Ba')) imgSrc = chars.char_06_granny_ba || '';
    else if (name.includes('Xe Ôm') || name.includes('Chú Tám')) imgSrc = chars.char_09_buyer_tam || '';
    else if (name.includes('Trúng Số') || name.includes('Hưng')) imgSrc = chars.char_10_winner_hung || '';
    else if (name.includes('Đại Lý') || name.includes('Bà Năm')) imgSrc = chars.char_11_wholesale_nam || '';
    else if (name.includes('Gà Bông')) imgSrc = ASSETS.thocam.vui || '';
    else if (name.includes('Công An') || name.includes('Nam')) imgSrc = chars.char_25_police_nam || '';
  }

  if (imgSrc) {
    return `<img src="${imgSrc}" class="cust-review-avatar-img ${extraClass}" alt="${escapeHtml(name)}" style="width: ${size}px; height: ${size}px; border-radius: 50%; object-fit: cover; border: 1.5px solid #d97706; background: #fef3c7; flex-shrink: 0;" />`;
  }

  // 2. Nếu là emoji thông thường (ví dụ 👧, 👦, 💅, 🛵, v.v.)
  const emojiDisplay = raw || '🍗';
  return `<span class="cust-review-avatar-emoji ${extraClass}" style="width: ${size}px; height: ${size}px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: ${Math.round(size * 0.58)}px; line-height: 1; border: 1.5px solid #d97706; background: #fef3c7; flex-shrink: 0;">${emojiDisplay}</span>`;
}
