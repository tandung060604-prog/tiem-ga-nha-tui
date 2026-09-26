# Ghi Chú Thiết Kế UI & Kiến Trúc Thị Giác — Tiệm Gà Nhà Tui

> Tài liệu tổng hợp các quyết định thiết kế chính và ghi chú điều chỉnh theo yêu cầu của User.
> Tham chiếu: `docs/gemini/brief-giao-dien.md` & `docs/gemini/brief-asset.md`.

---

## 1. Quyết Định Quan Trọng Về Nhân Vật Bé Thỏ Cam (Mimi)

* **Điều chỉnh theo lệnh trực tiếp từ User:**
  * Trong tài liệu ban đầu `brief-asset.md` mục 2 có dòng *"Thỏ Cam không được giống Miffy (không miệng hình chữ X, không phong cách tối giản của Dick Bruna...)"*.
  * **User đã chỉ đạo trực tiếp và chính thức:** `Không cấm miffy nhé.`
  * **Quyết định thiết kế:** Giữ trọn vẹn và tôn vinh phong cách Thỏ Trắng tối giản mặc áo len cam ấm áp với chiếc miệng chữ `x` im lặng hiền từ (Miffy vibe). Nhân vật này trở thành **Sứ Giả Tri Kỷ Hẻm 1102**, giao tiếp qua những mẩu giấy nhớ viết tay màu cam nắn nót. Đây là điểm nhấn cảm xúc độc đáo nhất kết nối toàn bộ 12 nhân vật chính.

---

## 2. Các Quyết Định UX & Giao Diện Chính

### 2.1. Thumb-Zone (Vùng Một Ngón Cái 40% Dưới Màn Hình)
* Màn hình mở bán (Selling Phase) chia 3 tầng rõ rệt:
  * **Tầng HUD (10%):** Chỉ xem thông tin đồng hồ và tua nhanh.
  * **Tầng Hàng Khách (35%):** Khách cuộn ngang tự nhiên, thẻ khách được chọn có viền vàng giòn, thẻ Thỏ Cam có viền cam phát sáng lung linh (`.bunny-card`).
  * **Tầng Quầy Bếp (55%):** Toàn bộ tương tác bấm thả gà, nâng vợt, thay dầu, rắc sốt và nút **🔔 GIAO MÓN** đều nằm trong bán kính vươn ngón cái thuận tiện nhất. Kích thước nút tối thiểu **44×44 pt** theo chuẩn Apple HIG.

### 2.2. Hệ Thống Màu & Tương Phản WCAG AA
* Giữ nguyên 100% tên biến màu gốc trong brief:
  * Nền kem ấm: `--bg: #fdf3e4`
  * Chữ & viền sticker: `--ink: #3d2c2e` (Đạt độ tương phản **8.8:1** trên nền kem, vượt xa chuẩn WCAG AA 4.5:1).
  * Điểm nhấn: Đỏ tương ớt `--red: #e63946`, Vàng giòn `--gold: #ffd166`, Bạc hà `--mint: #4fa883`.

### 2.3. Kiểu Chữ (Typography)
* **Tiêu đề:** `Baloo 2` (Google Fonts) — bo tròn, thân thiện, đậm chất game cozy casual.
* **Nội dung:** `Be Vietnam Pro` (Google Fonts) — tối ưu hóa tuyệt đối cho tiếng Việt có dấu, không bao giờ bị cắt xén các dấu mũ nặng ("Ệ, Ượ, Ữ").
* **Thư tay Thỏ Cam:** `Patrick Hand` — nét bút mực nắn nót, ấm áp và gần gũi.

### 2.4. Hiệu Năng & Animation
* Toàn bộ chuyển động trong game chỉ sử dụng `transform` (`translate`, `scale`) và `opacity`.
* Không animate thuộc tính `width`, `height`, `left` hay `top` trong game loop để tránh kích hoạt Layout Reflow trên các dòng điện thoại Android tầm trung.
* Tích hợp `@media (prefers-reduced-motion: reduce)` để tắt toàn bộ rung lắc khi người dùng kích hoạt chế độ giảm chuyển động.

---

## 3. Danh Mục File Giao Nộp

1. **`docs/gemini/design-tokens.css`**: Toàn bộ biến CSS chuẩn `:root { ... }`.
2. **`docs/gemini/components.css`**: Toàn bộ class UI chuẩn của game (Vanilla CSS, 0 framework, 0 `!important`).
3. **`docs/gemini/landing.html`**: Trang landing page độc lập chuẩn mobile-first.
4. **`docs/gemini/notes.md`**: Bản ghi chú lý do và quyết định thiết kế này.
5. **`docs/gemini/asset-notes.md`**: Danh mục prompt AI và kế hoạch asset hình ảnh.
