import { GameState, MenuItem } from '../../types/game';
import { audio } from '../../core/audio';
import { REGULAR_CUSTOMERS } from '../../content/customers';
import { ASSETS } from '../../content/assets';
import { PRICE_BANDS, PRICE_STEP, adjustPrice, averagePriceRatio, communityDriftFromPrice, customerMultiplierFromPrice, priceBand, priceLimits, priceRatio, pricingTarget } from '../../core/pricing';

export function renderMenuTab(state: GameState): string {
  const currentChapter = state.currentChapter;

  const menuRows = state.menu.map((item, idx) => {
    const isUnlocked = item.chapter <= currentChapter;
    const ratio = priceRatio(item);
    const band = priceBand(ratio);
    const limits = priceLimits(item);

    return `
      <div class="item-row" style="opacity: ${isUnlocked ? '1' : '0.5'};">
        <div class="item-icon">${item.icon}</div>

        <div class="item-meta">
          <div class="item-name">
            ${item.name}
            ${!isUnlocked ? `<span class="shelf-tag" style="background:#ddd;color:#666;">Chương ${item.chapter}</span>` : ''}
          </div>
          <div class="item-sub">
            Giá bán: <b style="color: var(--red); font-size: 0.95rem;">${item.currentPrice.toLocaleString('vi-VN')}đ</b>
            ${item.currentPrice !== item.basePrice ? `<small style="color: var(--soft); text-decoration: line-through;">(${item.basePrice.toLocaleString('vi-VN')}đ)</small>` : ''}
          </div>
          ${isUnlocked ? `<div class="price-band" data-band="${band}">${PRICE_BANDS[band].icon} ${PRICE_BANDS[band].label} · ${Math.round(ratio * 100)}% giá gốc · cho phép ${(limits.min / 1000).toLocaleString('vi-VN')}k–${(limits.max / 1000).toLocaleString('vi-VN')}k</div>` : ''}
          <div style="font-size: 0.72rem; color: var(--soft); margin-top: 2px;">
            Công thức: ${item.steps.join(' ➔ ')}
          </div>
        </div>

        ${isUnlocked ? `
          <div class="btn-group">
            <button class="btn-sm btn-price-mod" data-index="${idx}" data-delta="-${PRICE_STEP}" ${item.currentPrice <= limits.min ? 'disabled' : ''}>-2k</button>
            <button class="btn-sm btn-price-mod" data-index="${idx}" data-delta="${PRICE_STEP}" ${item.currentPrice >= limits.max ? 'disabled' : ''}>+2k</button>
          </div>
        ` : `
          <span style="font-size: 0.75rem; color: var(--soft); font-weight: 700;">🔒 Khóa</span>
        `}
      </div>
    `;
  }).join('');

  // 12 Khách quen
  const regularCustomersHtml = REGULAR_CUSTOMERS.map(cust => {
    return `
      <div style="background: #faf4ea; border: 1.5px solid var(--line); border-radius: 10px; padding: 8px 10px; display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 1.6rem;">${cust.avatar}</span>
        <div style="min-width: 0;">
          <div style="font-weight: 800; font-size: 0.82rem; color: var(--ink);">${cust.name} <small style="color: var(--red); font-weight: 700;">(${cust.title})</small></div>
          <div style="font-size: 0.72rem; color: var(--soft); font-style: italic; line-height: 1.25; margin-top: 1px;">"${cust.story}"</div>
        </div>
      </div>
    `;
  }).join('');

  const avg = averagePriceRatio(state);
  const bandKey = priceBand(avg);
  const avgBand = PRICE_BANDS[bandKey];
  const custPct = Math.round((customerMultiplierFromPrice(avg) - 1) * 100);
  const priceSummary = `<div class="price-summary" data-band="${bandKey}">
      <div class="price-summary-header">
        <b>${avgBand.icon} Mặt bằng giá: ${avgBand.label}</b> <span class="price-summary-ratio">(${Math.round(avg * 100)}% giá gốc)</span>
      </div>
      <div class="price-summary-desc">
        Khách tới quán ${custPct === 0 ? 'bình thường' : `${custPct > 0 ? '+' : ''}${custPct}%`} · sao Giá cả hướng về ${pricingTarget(avg).toFixed(1)}⭐${communityDriftFromPrice(avg) < 0 ? ' · <b class="drift-negative">hẻm bàn tán quán chặt chém (Tình Hẻm giảm mỗi ngày)</b>' : communityDriftFromPrice(avg) > 0 ? ' · <span class="drift-positive">hẻm thương quán bình dân (Tình Hẻm tăng)</span>' : ''}
      </div>
    </div>`;

  return `
    ${priceSummary}
    <div class="sec-title">
      <span>📖 Sổ Tay Món Ăn & Giá Bán</span>
      ${currentChapter >= 2 ? `
        <button id="btn-create-combo" class="btn-sm primary" style="font-size: 0.72rem; padding: 4px 8px;">
          ✨ Tự Thiết Kế Combo (+)
        </button>
      ` : ''}
    </div>
    <div class="sec-desc">
      Bạn có thể tùy chỉnh giá bán từng món. Đặt giá quá cao sẽ làm giảm điểm sao Giá Cả, đặt giá quá thấp sẽ làm giảm lợi nhuận!
    </div>
    <div class="menu-list">
      ${menuRows}
    </div>

    <!-- Khách Bí Ẩn Kết Nối Cốt Truyện: Bé Thỏ Cam -->
    <div class="sec-title" style="margin-top: 16px; border-top: 1px solid var(--line); padding-top: 10px;">
      <span>🐰 Sứ Giả Hẻm 1102: Bé Thỏ Cam (Khách Tri Kỷ)</span>
    </div>
    <div style="background: linear-gradient(135deg, #fffbf5, #fff3e0); border: 2px solid #ffb74d; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);">
      <div style="display: flex; gap: 12px; align-items: center;">
        <img src="${ASSETS.thocam.vui}" alt="Bé Thỏ Cam" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2.5px solid #ff9800; background: #fff; box-shadow: 0 2px 8px rgba(230, 81, 0, 0.25); flex-shrink: 0;" />
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <b style="font-size: 0.92rem; color: #bf360c;">Bé Thỏ Cam (Mimi)</b>
            <span style="background: #e65100; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 6px;">SỨ GIẢ TRI KỶ HẺM 1102</span>
          </div>
          <div style="font-size: 0.74rem; color: #5d4037; margin-top: 3px; line-height: 1.4; font-style: italic;">
            "Vị khách nhỏ khoác áo len cam ấm áp, miệng chữ x lặng lẽ nhưng lắng nghe vạn tâm tình. Thường xuyên ghé ăn gà giòn và gửi tặng những mẩu giấy nhớ kết nối số phận 12 cư dân Hẻm 1102."
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <button id="btn-menu-bunny-album" class="btn-sm" style="background: #ff9800; color: #fff; font-size: 0.72rem; padding: 4px 10px; font-weight: 800; border: none; box-shadow: 0 2px 4px rgba(230, 81, 0, 0.3);">
              📜 Mở Sổ Ký Ức (${(state.unlockedBunnyLetters || []).length}/6 Thư)
            </button>
            <button id="btn-menu-story-novel" class="btn-sm" style="background: #fff; border: 1.5px solid #ff9800; color: #e65100; font-size: 0.72rem; padding: 4px 10px; font-weight: 800;">
              📖 Đọc Tiểu Thuyết Hẻm 1102
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 12 Khách Quen & Cốt Truyện -->
    <div class="sec-title" style="margin-top: 16px; border-top: 1px solid var(--line); padding-top: 10px;">
      <span>👥 Bộ Sưu Tập 12 Khách Quen & Cốt Truyện</span>
    </div>
    <div class="sec-desc">
      Mỗi vị khách có gu ẩm thực và tính cách riêng. Phục vụ chu đáo sẽ giúp tiệm viral trên mạng xã hội!
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
      ${regularCustomersHtml}
    </div>
  `;
}

export function bindMenuEvents(
  state: GameState,
  onUpdateState: (fn: (draft: GameState) => void) => void,
  showToast: (msg: string) => void,
  onOpenBunnyAlbum?: () => void,
  onOpenStory?: () => void
) {
  const bunnyAlbumBtn = document.getElementById('btn-menu-bunny-album');
  if (bunnyAlbumBtn && onOpenBunnyAlbum) {
    bunnyAlbumBtn.onclick = () => {
      audio.playPop();
      onOpenBunnyAlbum();
    };
  }

  const storyNovelBtn = document.getElementById('btn-menu-story-novel');
  if (storyNovelBtn && onOpenStory) {
    storyNovelBtn.onclick = () => {
      audio.playPop();
      onOpenStory();
    };
  }

  const priceBtns = document.querySelectorAll('.btn-price-mod');
  priceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
      const delta = parseInt((e.currentTarget as HTMLElement).getAttribute('data-delta') || '0', 10);

      const item = state.menu[idx];
      if (!item) return;
      // Luật giá ở core/pricing.ts: chỉ trong 70%–150% giá gốc
      let next: number | null = null;
      onUpdateState(draft => {
        const target = draft.menu[idx];
        if (target) next = adjustPrice(target, delta);
      });
      if (next === null) {
        showToast(delta > 0 ? `${item.name} đã chạm trần 150% giá gốc — đắt hơn nữa không ai mua!` : `${item.name} đã chạm sàn 70% giá gốc — rẻ hơn là lỗ!`);
        return;
      }
      audio.playPop();
      const band = PRICE_BANDS[priceBand((next as number) / item.basePrice)];
      showToast(`${item.name}: ${(next as number).toLocaleString('vi-VN')}đ — ${band.icon} ${band.label}${band.label === 'Đắt' || band.label === 'Cắt cổ' ? ': khách ít gọi, sao Giá cả tụt, hẻm bàn tán!' : ''}`);
    });
  });

  // Nút tạo Combo mới
  const createComboBtn = document.getElementById('btn-create-combo');
  if (createComboBtn) {
    createComboBtn.onclick = () => {
      const comboName = prompt('Nhập tên Combo mới (VD: Combo Siêu Giòn Tan, Combo Sinh Viên Chill):', 'Combo Gà Giòn Đỉnh Chóp');
      if (!comboName || !comboName.trim()) return;

      const priceStr = prompt('Nhập giá bán cho combo (VNĐ, gợi ý: 89.000đ - 149.000đ):', '99000');
      const price = parseInt(priceStr || '99000', 10);

      if (isNaN(price) || price < 20000) {
        showToast('Giá combo không hợp lệ!');
        return;
      }

      const newCombo: MenuItem = {
        id: 'combo_custom_' + Date.now(),
        name: comboName.trim(),
        basePrice: price,
        currentPrice: price,
        chapter: state.currentChapter,
        icon: '🍱',
        category: 'combo',
        steps: ['2 Miếng gà giòn', '1 Khoai lắc', '1 Nước ngọt'],
        ingredients: { chicken_meat: 2, flour: 2, potato_cheese: 1, soft_drink: 1 }
      };

      onUpdateState(draft => {
        draft.menu.push(newCombo);
      });

      audio.playPerfect();
      showToast(`🎉 Chúc mừng! Tiệm đã ra mắt combo độc quyền: "${newCombo.name}"!`);
    };
  }
}
