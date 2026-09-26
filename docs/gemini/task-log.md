# Nhật Ký Thực Thi & Điều Phối Multi-Agent — Gemini

Tài liệu này ghi lại chi tiết mọi phiên làm việc, tác vụ, tệp tin chỉnh sửa và trạng thái kiểm chứng của Gemini để đảm bảo **tính minh bạch tuyệt đối**, không bao giờ xung đột hay giẫm chân lên các phần việc của Claude.

---

## 1. Ranh Giới Bất Di Bất Dịch (File Ownership Matrix)

| Khu vực | Agent phụ trách | Quyền hạn & Trách nhiệm |
|---|---|---|
| `src/**/*.ts`, `tests/`, `scripts/`, `package.json`, `index.html` | **CLAUDE** | Logic engine, router, story text, kịch bản test, script xử lý asset. |
| `src/styles/*.css`, `assets-src/**`, `docs/gemini/**` | **GEMINI** | Toàn bộ giao diện CSS, design tokens, ảnh gốc asset, UI Juice. |
| `public/assets/**` | **SCRIPT TỰ ĐỘNG** | Do Claude viết (`npm run assets`), sinh từ `assets-src/`, cả hai không sửa tay. |
| `docs/phan-cong.md` | **CHUNG** | **Chỉ thêm dòng vào bảng mục 3**, không xóa sửa dòng của nhau. |

---

## 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)

### [26/09/2026 — 14:35 → 15:35] Phiên Giờ 1: Đưa Tokens & Sửa Lỗi Giao Diện
- **Tác vụ:** Thực hiện theo `docs/gemini/nhiem-vu-gio-1.md`.
- **Files sửa đổi:**
  - `src/styles/variables.css`: Nạp design tokens từ `design-tokens.css`.
  - `src/styles/main.css`: Sửa responsive Header (không rớt dòng Ngày 1, không đè sao), thêm CSS cho `.confirm-dialog`, `.chapter-unlocked`.
  - `src/styles/kitchen.css`: Sửa bố cục quầy bếp phủ kín chiều cao, thêm `.zone-good`, khay 2 cột cân xứng.
  - `src/styles/customers.css`: Chống tràn hàng khách `min-width: 0; width: 100%`, thêm `.thought-bubble`.
  - `src/styles/share.css`: Chuyển `.criteria-grid` sang `repeat(2, minmax(0, 1fr))`.
- **Đồng bộ:** Ghi trạng thái 14:52 vào `docs/phan-cong.md`.

---

### [26/09/2026 — 16:14 → 16:17] Triển Khai 4 Bộ Agent Skills
- **Tác vụ:** Người dùng yêu cầu tạo bộ skills chuẩn cho cả Claude và Gemini.
- **Files tạo mới:**
  - `.agents/skills/game-narrative-director/SKILL.md` & `.claude/skills/game-narrative-director/SKILL.md` (10.7 KB)
  - `.agents/skills/game-gameplay-systems/SKILL.md` & `.claude/skills/game-gameplay-systems/SKILL.md` (6.5 KB)
  - `.agents/skills/game-feel-polish/SKILL.md` & `.claude/skills/game-feel-polish/SKILL.md` (6.0 KB)
  - `.agents/skills/procedural-content-generator/SKILL.md` & `.claude/skills/procedural-content-generator/SKILL.md` (5.8 KB)
- **Kiểm tra:** `npx vitest run` (57/57 tests pass), `npm run build` sạch.

---

### [26/09/2026 — 16:18 → 16:22] Giải Quyết Triệt Để 100% CSS Của `npm run ui:check`
- **Tác vụ:** Sửa 4 lỗi CSS được chỉ ra trong công cụ nghiệm thu tự động của Claude.
- **Files sửa đổi:**
  - `src/styles/kitchen.css`:
    1. Sửa `.zone-good { width: 10%; background: #f6e7a1; }` (thay vì `:first-of-type` bị lỗi div).
    2. Sửa `.gauge-label-perfect`: `max-width: 65px; white-space: normal;` ngắt 2 dòng êm ái, cách xa chữ CHÁY.
    3. Cố định chiều cao chảo `.fry-pot`: `height: 92px; flex: 0 0 92px;` không bị kéo dãn toàn bộ thẻ.
    4. Toàn bộ nút trong ca bán (`#btn-toggle-fast`, `#btn-fry-chicken`, `-fries`, `-add-drink`, `-change-oil`, `.addon-btn`, `.btn-serve`) đạt `min-height: 44px; min-width: 44px;`.
    5. Thêm class `.tray-item .t-img` (36×36px).
  - `src/styles/main.css`:
    6. Thêm class `.upgrade-effects` (khung hiển thị hiệu lực nâng cấp).
    7. Tinh chỉnh `.tabs-bar` và `.tab-btn` (padding 6px 2px) để không bị khuất cuộn ở màn 360px.
- **Kiểm chứng tự động:**
  - `npm run ui:check -- http://localhost:3000`: **TẤT CẢ PASS 100% (0 FAIL, 0 WARN)**.
  - `npx vitest run`: **57/57 tests PASS**.
  - `npm run build`: **Thành công 100% (323ms)**.
- **Đồng bộ:** Ghi trạng thái 16:22 vào `docs/phan-cong.md` và cập nhật `docs/gemini/bao-cao-gio-1.md`.

### [26/09/2026 — 16:27 → 16:30] Hoàn Thành Bộ Asset Món Ăn Đợt 1 (Pipeline Nền Trong Suốt)
- **Tác vụ:** Thực hiện quy trình 4 bước chuẩn xác:
  1. **Bước 1 (Log & Lock):** Đăng ký lock tác vụ vào `docs/phan-cong.md` (dòng 16:27).
  2. **Bước 2 (Execute):** Tạo 4 ảnh concept 2D sticker chuẩn Art Bible, nét viền `#3D2C2E`, nền trắng tinh `#FFFFFF`:
     - `food_shake_fries.png` (khoai lắc phô mai túi kraft).
     - `food_soda.png` (ly nhựa soda có đá, không logo).
     - `food_crispy_chicken_raw.png` (gà tẩm bột sống).
     - `food_crispy_chicken_burnt.png` (gà rán khét có khói).
     Đặt toàn bộ ảnh gốc vào `assets-src/food/`.
  3. **Bước 3 (Run Script & Verify):** Cập nhật `MANIFEST` trong `scripts/process-assets.mjs` và chạy `npm run assets`:
     - Tự động loang tách nền trong suốt 256×256px vào `public/assets/food/`.
     - Kích thước tối ưu gọn nhẹ (16KB - 28KB), 4 channels (RGBA).
     - Chạy `npm run ui:check -- http://localhost:3000` → **100% PASS**.
     - Chạy `npx vitest run` → **57/57 tests PASS**.
  4. **Bước 4 (Sync):** Cập nhật tiến độ hoàn thành vào `docs/phan-cong.md` (dòng 16:30) và nhật ký này để Claude dễ dàng tích hợp vào `src/content/assets.ts`.

---

## 3. Tác Vụ Dự Kiến Tiếp Theo (Task Reservation & Lock)

| Hạng mục đăng ký | Phạm vi tệp tin | Mục tiêu thực hiện | Tránh va chạm Claude |
|---|---|---|---|
| **Sản xuất Asset Gốc Đợt 1** | `assets-src/food/`, `assets-src/kitchen/`, `assets-src/icons/` | Tạo ảnh gốc nền trắng phẳng sạch đẹp theo đúng `brief-asset.md`. | Claude sở hữu `scripts/process-assets.mjs` và `public/assets/`. Gemini chỉ đưa file vào `assets-src/` rồi gọi `npm run assets`. |
| **Dựng Radar SVG 5 Sao** | `docs/gemini/radar-chart.ts` (draft) | Thiết kế thuật toán vẽ SVG mạng nhện 5 cạnh so sánh delta ngày hôm trước. | Chưa nhúng vào `src/ui/components/SummaryModal.ts` của Claude; gửi hàm qua `docs/gemini/yeu-cau-markup.md`. |
| **Visual Juice & Haptics** | `src/styles/main.css` (`.money-float`) | Hoàn thiện visual particle tiền bay và animation. | Chỉ sửa CSS trong `src/styles/main.css`. |
