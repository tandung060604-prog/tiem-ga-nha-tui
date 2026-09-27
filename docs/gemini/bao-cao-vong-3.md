# BÁO CÁO NGHIỆM THU CSS VÒNG 3 — GEMINI
**Người thực hiện:** Gemini (Frontend & Visual Specialist)  
**Thời gian:** 07:15 sáng, 27/09/2026  
**Dự án:** Tiệm Gà Nhà Tui (`D:\AI Vin Thực Chiến\Side Project\TiemGaRan`)  
**Bảng điều phối:** [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md)  
**Commits hoàn thành (riêng từng mục):**
1. **Commit 1 (`a227ac5`):** `feat(ui): the khach gon tren mobile - anh 28px, 1 dong ellipsis, cao <= 150px tren 320px`
2. **Commit 2 (`dbea863`):** `feat(ui): style price-summary va price-band xanh den do gon tren 320px`

---

## 1. TỔNG QUAN KẾT QUẢ HOÀN THÀNH

Thực hiện theo chỉ đạo tại `docs/prompts/gemini-dem-27-09.md`, Gemini đã hoàn thành trọn vẹn 2 nhiệm vụ cốt lõi, vượt qua toàn bộ 5 cổng kiểm định khắt khe (`tsc`, `vitest`, `build`, `ui:check`, `ios:check`):

1. **Mục 1 — Thẻ khách gọn cho điện thoại:**
   - Mỗi món gọi trong bóng thoại là một dòng nhỏ gọn (`height: 28px`, `min-height: 28px`).
   - Ảnh món ăn `.order-food-thumb` chuẩn xác `28×28px` (`object-fit: contain; flex: none;`), loại bỏ 100% inline style trong `SellingView.ts`, chuyển toàn bộ sang `src/styles/customers.css`.
   - Hiển thị số lượng rõ ràng: `2×` khi khách gọi 2 phần (hoặc lũy tiến `it.served/it.count` khi đang phục vụ dở) và `1×` khi gọi 1 phần, đặt trong `.order-qty`.
   - Tên món cắt gọn gàng trên đúng 1 dòng bằng ellipsis (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`) trong `.order-food-name`.
   - Chiều cao tổng thể thẻ khách `.customer-card` trên màn hình hẹp 320px (iPhone SE) thực đo đạt **130px** (vượt chuẩn yêu cầu không quá 150px).
   - Cổng kiểm thử WebKit iOS Safari `ios:check` bài kiểm tra *"ảnh món trong thẻ khách ≤ 56px"* **PASS 100%** trên cả 3 thế hệ máy: iPhone SE (320px), iPhone 13 (390px), iPhone 15 Pro Max (430px).

2. **Mục 2 — Style `.price-summary` & `.price-band` (Tab Thực đơn):**
   - Loại bỏ toàn bộ style inline tạm thời trong `MenuTab.ts`, chuyển toàn bộ sang hệ thống token và CSS chuẩn mực trong `src/styles/main.css`.
   - Dải màu trực quan chuyển tiếp mượt mà từ **Xanh lá → Xanh ngọc → Vàng → Cam → Đỏ**:
     * `cheap` (Rẻ): Nền xanh lá `#dcfce7`, chữ xanh đậm `#15803d`, viền `#86efac`.
     * `fair` (Hợp lý): Nền xanh ngọc dịu `#ccfbf1`, chữ xanh cổ vịt `#0f766e`, viền `#5eead4`.
     * `pricey` (Hơi đắt): Nền vàng kem `#fef9c3`, chữ vàng hổ phách `#a16207`, viền `#fde047`.
     * `expensive` (Đắt): Nền cam đào `#ffedd5`, chữ cam gạch `#c2410c`, viền `#fdba74`.
     * `gouging` (Cắt cổ): Nền đỏ thắm `#fee2e2`, chữ đỏ tươi `#b91c1c`, viền `#fca5a5` kèm hiệu ứng nhấp nháy cảnh báo `@keyframes gougingPulse`.
   - Khối tổng kết mặt bằng giá `.price-summary` hỗ trợ `data-band`, hiển thị tỉ lệ phần trăm giá gốc, lượng khách ghé quán, mục tiêu sao và biến động Tình Hẻm.
   - Tối ưu hóa tuyệt đối trên màn hình 320px: không tràn ngang (`overflow: 0px`), thu gọn icon thực đơn 36px, co gọn khoảng cách lưới và nút chỉnh giá `-2k` / `+2k` vừa vặn 1 ngón cái.

---

## 2. CHI TIẾT KỸ THUẬT MỤC 1 — THẺ KHÁCH GỌN GÀNG MOBILE

### 2.1. Cấu trúc Markup & Dỡ Bỏ Inline Styles
* **Tệp:** `src/ui/components/SellingView.ts`
* Đưa toàn bộ inline style của `.order-food-thumb` sang `src/styles/customers.css`:
```html
<div class="order-row">
  <span class="order-item-title">
    <img src="${img}" class="order-food-thumb" alt="${escapeHtml(name)}" width="28" height="28" />
    <span class="order-qty">${qtyText}</span>
    <span class="order-food-name">${escapeHtml(name)}</span>
    <span class="order-condiment" data-condiment="...">...</span>
  </span>
  <span class="order-check ${it.completed ? 'done' : ''}">${it.completed ? '✓' : '○'}</span>
</div>
```

### 2.2. CSS Chuyên Biệt Cho Dòng Món Ăn
* **Tệp:** `src/styles/customers.css`
* `.order-row`: Chiều cao cố định `28px`, `display: flex; align-items: center; justify-content: space-between; gap: 4px; min-width: 0; width: 100%;`.
* `.order-food-thumb`: Cố định chính xác `28×28px`, `object-fit: contain; flex: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));`.
* `.order-qty`: `font-weight: 800; font-size: 0.72rem; flex: none; white-space: nowrap;`.
* `.order-food-name`: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1; font-size: 0.72rem;`.

### 2.3. Tối Ưu Chiều Cao Thẻ Khách ≤ 150px Trên 320px
* `.customer-card`: `flex: 0 0 160px; max-height: 150px; padding: 5px 6px; gap: 3px;`.
* `.cust-stage`: Thu gọn chiều cao còn `40px - 44px`, avatar nhân vật `38×38px`.
* `.speech-bubble`: `padding: 3px 5px; max-height: 62px; overflow-y: auto;`.
* **Số liệu đo đạc thực tế trên Playwright WebKit 320px:**
  * Chiều cao thẻ khách (`cardH`): **130px** (Đạt chuẩn ≤ 150px).
  * Chiều cao mỗi dòng món (`rowH`): **28px**.
  * Kích thước ảnh món (`imgW × imgH`): **28px × 28px**.
  * Ảnh chụp nghiệm thu: `ui-check-out/card-compact-320.png`.

---

## 3. CHI TIẾT KỸ THUẬT MỤC 2 — STYLE BẢNG GIÁ PRICE BANDS

### 3.1. Dải Màu Trực Quan 5 Mức (Xanh → Đỏ)
* **Tệp:** `src/styles/main.css`
* Bảng mã màu chuẩn UX Hàn Quốc / Game Bistro:

| Mức Giá (`data-band`) | Tên Mức | Nền (Background) | Chữ (Text) | Viền (Border) | Tác Động Kinh Tế |
|---|---|---|---|---|---|
| `cheap` | **Rẻ** (≤ 90%) | `#dcfce7` (Xanh lá nhạt) | `#15803d` | `#86efac` | Khách đông, sao Giá cả tăng, hẻm thương |
| `fair` | **Hợp lý** (91%–110%) | `#ccfbf1` (Xanh ngọc dịu) | `#0f766e` | `#5eead4` | Trạng thái cân bằng vàng |
| `pricey` | **Hơi đắt** (111%–125%) | `#fef9c3` (Vàng kem) | `#a16207` | `#fde047` | Lãi nhỉnh hơn, khách bắt đầu cân nhắc |
| `expensive` | **Đắt** (126%–140%) | `#ffedd5` (Cam đào) | `#c2410c` | `#fdba74` | Khách ít gọi, sao Giá cả tụt |
| `gouging` | **Cắt cổ** (> 140%) | `#fee2e2` (Đỏ cảnh báo) | `#b91c1c` | `#fca5a5` | Hẻm bàn tán quán chặt chém, mất khách |

### 3.2. Khối `.price-summary` Nổi Bật
* Đồng bộ màu nền và viền theo `data-band` của mặt bằng giá trung bình toàn quán.
* Phân tách tiêu đề `price-summary-header` và mô tả tác động `price-summary-desc` với font chữ sắc nét, tương phản cao.

### 3.3. Tối Ưu Màn Hình Hẹp 320px
* Grid món ăn `.item-row`: Co gọn `grid-template-columns: 36px 1fr auto; gap: 6px;`.
* Nút `.btn-price-mod`: Kích thước `min-width: 32px`, `padding: 3px 5px`, phông chữ `0.7rem`.
* Độ tràn ngang màn hình (`overflow`): **0px** (Không cuộn ngang).
* Ảnh chụp nghiệm thu: `ui-check-out/menu-pricing-320.png`.

---

## 4. KẾT QUẢ NGHIỆM THU 5 CỔNG KIỂM TRA

| Cổng Kiểm Tra | Lệnh Thực Thi | Kết Quả | Chi Tiết |
|---|---|:---:|---|
| **1. TypeScript** | `npx tsc --noEmit` | **PASS** | 0 lỗi type check |
| **2. Unit & Logic Tests** | `npx vitest run` | **PASS** | 26/26 files test, 305/305 tests PASS 100% |
| **3. Production Bundle** | `npm run build` | **PASS** | Build thành công trong 708ms |
| **4. Chrome Headless UI** | `npm run ui:check -- http://localhost:3002` | **PASS** | 100% PASS trên cả 360px & 390px (0 tràn ngang) |
| **5. WebKit iOS Safari** | `npm run ios:check -- http://localhost:3002` | **PASS** | 30/30 checks PASS (iPhone SE 320px, iPhone 13, iPhone 15 Pro Max; bài kiểm tra ảnh món ≤ 56px PASS) |

---

## 5. MINH CHỨNG HÌNH ẢNH 320PX

1. **Thẻ khách hàng gọn gàng trên 320px (`ui-check-out/card-compact-320.png`):**
   * Thẻ cao 130px (≤ 150px).
   * Ảnh món tròn trịa 28px rõ nét.
   * Dòng số lượng `1×` / `2×` và tên món cắt 1 dòng ellipsis hoàn hảo.

2. **Tab Thực đơn & Price Bands trên 320px (`ui-check-out/menu-pricing-320.png`):**
   * Khối `.price-summary` hiển thị rõ nét mặt bằng giá và tác động Tình Hẻm.
   * Dải badge `.price-band` màu xanh ngọc (Hợp lý) đến cam đỏ (Đắt) hiển thị rực rỡ, không tràn viền.
   * Nút bấm `-2k` / `+2k` vừa khít cạnh phải.

---
*Báo cáo được hoàn thành và bàn giao bởi:* **Gemini**
