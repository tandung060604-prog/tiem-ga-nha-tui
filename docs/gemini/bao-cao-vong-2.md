# BÁO CÁO NGHIỆM THU CSS VÒNG 2 — GEMINI
**Người thực hiện:** Gemini (Frontend & Visual Specialist)  
**Thời gian:** 06:30 sáng, 27/09/2026  
**Dự án:** Tiệm Gà Nhà Tui (`D:\AI Vin Thực Chiến\Side Project\TiemGaRan`)  
**Bảng điều phối:** [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md)  
**Trang kiểm thử trực quan:** [docs/gemini/preview-vong-2.html](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/gemini/preview-vong-2.html)  

---

## 1. TỔNG QUAN KẾT QUẢ HOÀN THÀNH

Trong Vòng 2, Gemini đã hoàn thành 100% việc chuẩn hóa và bổ sung CSS hoàn chỉnh cho toàn bộ các class và thành phần Claude Lead đã thêm trong ca đêm 27/09, dỡ bỏ hoàn toàn inline styles, đảm bảo hiển thị hoàn mỹ trên mọi kích thước màn hình từ 320px đến 430px:

1. **`.order-condiment[data-condiment=ketchup|chili]`:** Dòng *"khách dặn thêm tương"* trên thẻ khách hàng tại `src/styles/customers.css`.
2. **`.story-karma-effects` / `.story-karma-effect`:** Khối *"lựa chọn đang tác động tới quán"* trong cảnh thoại Visual Novel tại `src/styles/main.css`.
3. **`.fx-layer`, `.money-float.lost-float` ("Khách bỏ về"):** Chuyển toàn bộ inline style trong hàm `renderFx` của `SellingView.ts` sang CSS tại `src/styles/kitchen.css`.
4. **`.btn-wrapped`, `.wrapped-preview-img`, `#wrapped-preview`:** Nút Gà Wrapped sang trọng với gradient lễ hội, hiệu ứng quà nảy và khung ảnh xem trước thẻ tuần tại `src/styles/share.css`.
5. **Khay 5–7 ô (`.tray-slots`) vừa khít màn hình 320px:** Tối ưu hóa lưới quầy giữ nhiệt tại `src/styles/kitchen.css` và cập nhật tiêu đề sức chứa động `${tray.length}/${cookingEngine.getTraySize()}` trong `SellingView.ts`.

---

## 2. CHI TIẾT KỸ THUẬT TỪNG MỤC

### 1. Dòng Khách Dặn Thêm Tương (`.order-condiment`)
* **Tệp chỉnh sửa:** `src/styles/customers.css`
* **Quy cách hiển thị:**
  * Dạng huy hiệu pill nhỏ gọn bo tròn (`border-radius: 999px`, font `0.6rem`, padding `1.5px 6px`), nằm ngay bên cạnh tên món trong dòng gọi món.
  * Tương cà (`[data-condiment="ketchup"]`): Nền hồng phấn `#ffe3e3`, chữ đỏ thắm `#c92a2a`, viền `#ffa8a8` kèm emoji 🍅.
  * Tương ớt (`[data-condiment="chili"]`): Nền cam be `#ffe8cc`, chữ cam cay nồng `#d9480f`, viền `#ffd8a8` kèm emoji 🌶️.
  * Hiệu ứng nhịp đập nhẹ nhàng `.condimentPulse` (chu kỳ 2.2s) thu hút sự chú ý của người chơi để xịt đúng loại tương nhận tiền tip.
  * Tự động vô hiệu hóa hoạt ảnh khi bật `@media (prefers-reduced-motion: reduce)`.

### 2. Khối Tác Động Karma Trong Cảnh Truyện (`.story-karma-effects`)
* **Tệp chỉnh sửa:** `src/styles/main.css`
* **Quy cách hiển thị:**
  * Container sang trọng với dải gradient thanh lịch (`#f0f7ff` → `#e6f4ff`), viền xanh pastel `#91caff` và bóng đổ mờ ảo.
  * Tiêu đề `🧭 Lựa chọn của bạn đang tác động tới quán:` nổi bật chữ đậm màu lam `#0958d9`.
  * Mỗi dòng hiệu ứng `.story-karma-effect` có nền trắng sạch sẽ, viền trái nổi khối `3.5px solid #1677ff`, hiển thị rõ ràng tác động của Karma lên cộng đồng, danh tiếng hoặc kinh doanh.
  * Hoạt ảnh xuất hiện mượt mà `.karmaSectionFade` (0.3s ease-out).

### 3. Hiệu Ứng Tiền Bay & Khách Bỏ Về (`.fx-layer`, `.money-float.lost-float`)
* **Tệp chỉnh sửa:** `src/styles/kitchen.css`, `src/ui/components/SellingView.ts`
* **Dỡ bỏ Inline Styles:**
  * Xóa bỏ lệnh `layer.setAttribute('style', ...)` bên trong `renderFx()` của `SellingView.ts`.
  * Khai báo lớp `.fx-layer` trong `kitchen.css` với `position: fixed; inset: 0; pointer-events: none; z-index: 40; overflow: hidden;`.
* **Hiệu ứng Khách Bỏ Về (`.lost-float`):**
  * Nền cảnh báo đỏ nhạt `rgba(255, 235, 235, 0.96)`, chữ đỏ rực `#e03131`, viền `#fa5252`, bóng đỏ `#e031315c`.
  * Hoạt ảnh `@keyframes floatLostAway`: Lắc lư rung giật góc nghiêng ±4° thể hiện sự bực bội và mờ dần khi bay lên.
  * Khai báo đầy đủ trong `@media (prefers-reduced-motion: reduce)`.

### 4. Nút Gà Wrapped & Xem Trước Thẻ Tuần (`.btn-wrapped`, `.wrapped-preview-img`)
* **Tệp chỉnh sửa:** `src/styles/share.css`
* **Quy cách hiển thị:**
  * Nút `.btn-wrapped` sở hữu dải màu gradient vinh danh rực rỡ (`#e63946` đỏ cam → `#b5179e` hồng tím → `#7209b7` tím đậm) với viền kính phản quang và bóng đổ tím sâu.
  * Hộp quà emoji `🎁` có hoạt ảnh nhấp nhô vui nhộn `@keyframes giftBounce`.
  * Vùng xem trước `#wrapped-preview` canh giữa toàn bộ hình ảnh canvas.
  * Ảnh thẻ `.wrapped-preview-img` bo góc 14px, viền kim loại ấm, bóng đổ nổi khối và hoạt ảnh bung nở lò xo `@keyframes wrappedPopIn`.
  * Đầy đủ hỗ trợ `@media (prefers-reduced-motion: reduce)`.

### 5. Quầy Giữ Nhiệt 5–7 Ô Vừa Khít Màn Hình 320px (`.tray-slots`)
* **Tệp chỉnh sửa:** `src/styles/kitchen.css`, `src/ui/components/SellingView.ts`
* **Cập nhật Logic Hiển Thị:**
  * Thay thế nhãn dung tích cứng `/4` bằng `/cookingEngine.getTraySize()` động.
* **Tối Ưu Lưới & Tránh Tràn Ngang / Tràn Dọc:**
  * Lưới 2 cột đồng đều `repeat(2, minmax(0, 1fr))` với `gap: 4px; padding: 4px;`.
  * Thiết lập `max-height: 220px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin;` với thanh cuộn màu be nâu nhạt tinh tế, giúp khay khi mở rộng lên 5, 6 hoặc 7 ô không làm đẩy quầy nước ra khỏi khung nhìn.
  * Khối media query đặc thù `@media (max-width: 350px)` cho iPhone SE (320px):
    * Thu nhỏ khung hình món ăn `.tray-food-frame` từ 48px xuống 36px.
    * Thu nhỏ ảnh món `.t-img` thành 34px (min 26px), tên món 0.56rem, nhãn chất lượng 0.48rem.
    * Thu nhỏ vỉ trống `.tray-slot-empty` xuống chiều cao tối thiểu 44px (thay vì 56px).
    * `max-height: 185px` vừa khít màn hình chiều cao hạn chế của iPhone SE 1st gen (568px).

---

## 3. DANH SÁCH ẢNH CHỤP KIỂM THỬ TRỰC QUAN (`ui-check-out/`)

| Tên File Ảnh | Kích Thước / Chế Độ | Nội Dung Giao Diện |
|---|---|---|
| `gemini-vong-2-overview.png` | Toàn bộ 5 mục (420px) | Tổng hợp trực quan cả 5 thành phần Vòng 2 |
| `gemini-vong-2-condiment.png` | Khung thẻ khách | Dòng dặn tương cà 🍅 và tương ớt 🌶️ |
| `gemini-vong-2-karma.png` | Khung truyện | Khối tác động Karma xanh dương cao cấp |
| `gemini-vong-2-fx.png` | Khung Fx | Tiền bay thường, tiền tip vàng và khách bỏ về đỏ thắm |
| `gemini-vong-2-wrapped.png` | Khung tổng kết | Nút Gà Wrapped tím gradient và thẻ xem trước |
| `gemini-vong-2-tray-320px.png` | Giả lập iPhone SE 320px | Quầy giữ nhiệt 7 ô (5 có món, 2 vỉ ráo dầu) vừa khít |
| `ios-320-selling.png` | WebKit iPhone SE (320px) | Ca bán hàng thật trên Safari WebKit 320px |
| `ios-390-selling.png` | WebKit iPhone 13 (390px) | Ca bán hàng thật trên Safari WebKit 390px |

---

## 4. KẾT QUẢ BỘ CÔNG CỤ NGHIỆM THU KÉP (QUALITY GATES)

| Cổng Kiểm Tra | Lệnh Chạy | Kết Quả | Trạng Thái |
|---|---|---|:---:|
| **Type Check** | `npx tsc --noEmit` | Clean 100%, 0 errors | **PASS** |
| **Unit Tests** | `npx vitest run` | 25/25 test files PASS, **296/296 tests PASS** | **PASS** |
| **Production Build** | `npm run build` | Vite build hoàn tất trong 610ms (CSS: 93KB, JS: 333KB) | **PASS** |
| **Chrome Mobile Check** | `npm run ui:check http://localhost:3002` | **16/16 checks PASS** trên 360px & 390px (0 tràn ngang, gauges 38/10/22/10/20) | **PASS** |
| **Safari WebKit iOS Check** | `npm run ios:check http://localhost:3002/` | **30/30 checks PASS** trên iPhone SE (320px), iPhone 13 (390px), iPhone 15 Pro Max (430px) | **PASS** |

---

## 5. KẾT LUẬN & SẴN SÀNG BÀN GIAO

* Toàn bộ 5 nhiệm vụ của Vòng 2 đã hoàn tất 100%, vượt qua tất cả các chốt kiểm tra.
* Không phát hiện bất kỳ lỗi layout, vỡ khung hay lỗi console nào.
* Không can thiệp vào các tệp cấm (`src/core/**`, `src/types/game.ts`).

*Báo cáo được lập bởi: **Gemini***
