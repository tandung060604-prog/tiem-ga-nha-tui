# Yêu Cầu Markup (Gemini → Claude)

Tài liệu này ghi lại các đề xuất điều chỉnh markup / HTML trong các file `.ts` để Claude phối hợp thực hiện khi thuận tiện, phục vụ tối ưu hóa trải nghiệm UI/UX.

---

## 1. Màn Bán Hàng (SellingView.ts)

### Đề xuất 1: Chuyển đổi cập nhật vị trí kim đo sang CSS Transform (Tùy chọn P2)
* **Hiện tại:** `.cook-gauge-pointer` đang được cập nhật qua `style.left = ...`.
* **Đề xuất:** Nếu muốn tối ưu render GPU compositor ở 60 FPS, có thể để `left: 0` cố định trong CSS và cập nhật qua `style.transform = `translateX(${percent}%)``.
* **Trạng thái:** Hiện tại `style.left` vẫn chạy mượt và không gây giật lag sau khi Claude sửa render cục bộ.

### Đề xuất 2: Gắn thêm `data-action` cho event delegation
* Các nút trong quầy bếp (`#btn-fry-chicken`, `#btn-fry-fries`, `#btn-add-drink`, `#btn-fry-pot`, `#btn-serve-order`, `#btn-change-oil`) đã chạy ổn định với event delegation. Tiếp tục duy trì chuẩn `data-action` này.

---

## 2. Màn Tổng Kết (SummaryModal.ts)

### Đề xuất: Chuẩn bị container cho biểu đồ Radar SVG 5 tiêu chí
* Trong `SummaryModal.ts`, khối `.stars-summary-box` hiện hiển thị lưới text `.criteria-grid`.
* Khi Claude sẵn sàng cho P2, Gemini có thể cung cấp hàm `renderRadarChartSvg(ratings, prevRatings)` để nhúng vào thay thế hoặc bổ trợ cho lưới số liệu này.

---

## 3. Quản Lý Kho & Nguyên Liệu (InventoryTab.ts)

Gemini 1 đã nạp đầy đủ CSS tokens và styling trong `src/styles/main.css`. Gemini 2 / Claude Lead chỉ cần render cấu trúc HTML theo mẫu sau:

### Mẫu 1: Dòng nguyên liệu đã mở khóa (kèm nút `-5` hoàn tiền)
```html
<div class="item-row" data-id="${item.id}">
  <div class="item-icon">${item.icon}</div>
  <div class="item-meta">
    <div class="item-name">
      ${item.name}
      <span class="shelf-tag">HSD: ${item.currentLifeDays} ngày</span>
    </div>
    <div class="item-sub ${isLow ? 'low-stock' : ''}">
      Tồn kho: <b>${item.amount} ${item.unit}</b> · Giá nhập: ${item.cost.toLocaleString('vi-VN')}đ
    </div>
  </div>
  <div class="btn-group">
    <!-- Nút -5 hoàn tiền: disabled khi tồn kho < 5 -->
    <button class="btn-sm btn-refund" data-id="${item.id}" data-qty="-5" ${item.amount < 5 ? 'disabled' : ''}>
      -5<small>(${item.cost * 5 / 1000}k)</small>
    </button>
    <button class="btn-sm" data-id="${item.id}" data-qty="5" ${state.money < item.cost * 5 ? 'disabled' : ''}>
      +5<small>(${item.cost * 5 / 1000}k)</small>
    </button>
    <button class="btn-sm primary" data-id="${item.id}" data-qty="10" ${state.money < item.cost * 10 ? 'disabled' : ''}>
      +10<small>(${item.cost * 10 / 1000}k)</small>
    </button>
  </div>
</div>
```

### Mẫu 2: Dòng nguyên liệu bị khóa phân tầng
```html
<div class="item-row is-locked" data-id="${item.id}">
  <div class="item-icon">${item.icon}</div>
  <div class="item-meta">
    <div class="item-name">
      ${item.name}
      <span class="locked-tag">🔒 Ngày ${item.unlockDay}</span>
    </div>
    <div class="locked-desc">Cần phí hợp đồng ${item.unlockCost.toLocaleString('vi-VN')}đ để mở khóa.</div>
  </div>
  <div>
    <button class="btn-unlock" data-id="${item.id}" ${state.day < item.unlockDay || state.money < item.unlockCost ? 'disabled' : ''}>
      ${state.day < item.unlockDay ? '🔒 Chưa tới ngày' : `🔓 Mở (${item.unlockCost / 1000}k)`}
    </button>
  </div>
</div>
```

---

## 4. Màn Hình 5 Đại Kết Cục (Multi-Ending Modal)

Theme class cho `.ending-banner`:
* `ending-happy`: 🏆 Happy Ending — Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ
* `ending-open`: 🌱 Open Ending — Gió Hẻm Thổi Mãi
* `ending-bad-bankruptcy`: 💀 Bad Ending 3A — Cửa Cuốn Đóng Lại (Phá Sản)
* `ending-bad-corporate`: 💔 Bad Ending 3B — Cỗ Máy Gà Vô Hồn
* `ending-secret`: 🌟 Secret Ending — Chiếc Vá Vàng 1975

```html
<div class="ending-overlay">
  <div class="ending-modal">
    <!-- Banner màu sắc & Theme -->
    <div class="ending-banner ${themeClass}">
      <div class="ending-kicker">${kicker}</div>
      <div class="ending-illustration">${icon}</div>
      <div class="ending-title">${title}</div>
      <div class="ending-tagline">“${tagline}”</div>
    </div>

    <div class="ending-body">
      <!-- Đoạn trích tiểu thuyết -->
      <div class="ending-novel-excerpt">
        ${novelExcerpt}
      </div>

      <!-- Bảng Nghiệp Cảm Karma -->
      <div class="ending-karma-board">
        <div class="ending-karma-title">
          <span>Chỉ Số Nghiệp Cảm (Karma)</span>
          <span>Tác Động Quá Khứ & Vận Mệnh</span>
        </div>
        <div class="karma-metric">
          <div class="karma-metric-header">
            <span>❤️ Tình Thân Hẻm (Community)</span>
            <span>${karma.community}%</span>
          </div>
          <div class="karma-bar">
            <div class="karma-fill community" style="width: ${karma.community}%;"></div>
          </div>
        </div>
        <div class="karma-metric">
          <div class="karma-metric-header">
            <span>🔥 Bản Sắc Nghệ Nhân (Craft)</span>
            <span>${karma.craftsmanship}%</span>
          </div>
          <div class="karma-bar">
            <div class="karma-fill craftsmanship" style="width: ${karma.craftsmanship}%;"></div>
          </div>
        </div>
        <div class="karma-metric">
          <div class="karma-metric-header">
            <span>💼 Tham Vọng Quy Mô (Ambition)</span>
            <span>${karma.ambition}%</span>
          </div>
          <div class="karma-bar">
            <div class="karma-fill ambition" style="width: ${karma.ambition}%;"></div>
          </div>
        </div>
      </div>

      <!-- Lưới Thống Kê 4 Chỉ Số -->
      <div class="ending-stats-grid">
        <div class="ending-stat-box">
          <div class="ending-stat-val">${stats.days}</div>
          <div class="ending-stat-lbl">Ngày Kinh Doanh</div>
        </div>
        <div class="ending-stat-box">
          <div class="ending-stat-val">${stats.totalRevenue}</div>
          <div class="ending-stat-lbl">Tổng Doanh Thu</div>
        </div>
        <div class="ending-stat-box">
          <div class="ending-stat-val">${stats.averageStars}⭐</div>
          <div class="ending-stat-lbl">Đánh Giá Thực Khách</div>
        </div>
        <div class="ending-stat-box">
          <div class="ending-stat-val">${stats.bunnyLetters}</div>
          <div class="ending-stat-lbl">Thư Thỏ Cam Mimi</div>
        </div>
      </div>
    </div>

    <!-- Hàng Nút Hành Động Cuối -->
    <div class="ending-actions">
      <button class="btn-ending-main" id="btn-ending-restart">
        🔄 BẮT ĐẦU NEW GAME+
      </button>
      <button class="btn-ending-secondary" id="btn-ending-review">
        📖 XEM LẠI SỔ KÝ ỨC HẺM 1102
      </button>
    </div>
  </div>
</div>
```

