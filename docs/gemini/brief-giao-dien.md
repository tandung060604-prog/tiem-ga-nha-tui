# Brief thiết kế giao diện — Tiệm Gà Nhà Tui

> Gửi: Gemini (thiết kế UI/website). Đọc hết tài liệu này trước khi thiết kế. Asset hình ảnh nằm trong brief riêng `brief-asset.md`.

## 0. Bạn cần giao lại gì

1. **Ảnh mockup** cho từng màn trong mục 4, khung **390×844 pt** (xuất PNG @3x = 1170×2532), nền sáng. Mỗi màn 1 ảnh, đặt tên `mockup-<ten-man>.png`.
2. **File `design-tokens.css`**: chỉ gồm khối `:root { … }` với các biến CSS. Giữ nguyên tên biến đã có ở mục 2, được thêm biến mới.
3. **File `components.css`**: CSS cho các class liệt kê ở mục 5. Không đổi tên class. Không dùng framework CSS (không Tailwind, không Bootstrap). Không dùng `!important`.
4. **File `landing.html`**: một trang giới thiệu tĩnh (mục 4.8), HTML + CSS thuần, một file.
5. **Ghi chú ngắn** (`notes.md`): lý do các quyết định chính, danh sách chỗ bạn buộc phải lệch khỏi brief.

Không cần viết JavaScript cho game. Không thêm thư viện.

## 1. Sản phẩm là gì

- Game quản lý tiệm gà rán chạy trên **trình duyệt điện thoại, màn dọc**, mở link là chơi (chia sẻ từ Threads).
- Người chơi đi từ **xe đẩy vỉa hè** (chương 1) → tiệm trong hẻm → mặt tiền phố → tiệm hot trend → chuỗi 5 chi nhánh (chương 5).
- Mỗi ngày game có 3 pha: **Chuẩn bị** (nhập kho, nâng cấp, nhân viên) → **Mở bán** (chiên gà, giao cho khách, 4–5 phút) → **Tổng kết** (sổ sách, sao, review hài, chia sẻ).
- Người chơi: GenZ Việt Nam 16–26 tuổi, chơi phiên 5–15 phút bằng **một ngón cái**.
- Cảm xúc cần có: *ấm cúng, sướng tay, buồn cười, muốn khoe*. Tham chiếu cảm giác: game "cozy" quản lý quán, sticker meme Việt, bảng phấn quán ăn, mái hiên sọc đỏ trắng.
- Toàn bộ chữ trong game là **tiếng Việt có dấu**; kiểm tra các chữ như "Ệ, Ượ, Ữ" không bị cắt dòng trên.

## 2. Hệ thống thị giác hiện có (giữ và mở rộng)

**Màu (tên biến CSS đang dùng — giữ nguyên tên):**
```
--bg #fdf3e4 (kem)      --ink #3d2c2e (nâu viền/chữ)   --soft #8a6452 (chữ phụ)
--panel #fffaf2         --panel-alt #f8ede0            --line #ead7bd   --line-strong #d4bda0
--red #e63946           --red-dark #c42b37             --orange #f4a261 (cam sốt)
--gold #ffd166 (vàng giòn) --gold-dark #e5b338        --mint #4fa883   --mint-dark #3b8868
--warn #e2574c          --counter #8a5a3b (quầy gỗ)    --chalk #243b2f (bảng phấn)
--chalk-ink #f4efe2     --chalk-yellow #f8df81         --chalk-green #9fe2bf
```
**Font:** tiêu đề `Baloo 2` (500–800), nội dung `Be Vietnam Pro` (400–800), đều từ Google Fonts.
**Bo góc:** 8 / 14 / 20 / pill. **Bóng:** kiểu "đáy nổi" (offset dọc 2–4px, không blur) cho nút, gợi cảm giác sticker.
**Chủ đề:** chỉ sáng (`color-scheme: only light`). Không cần dark mode.

Bạn được phép: thêm biến (ví dụ `--space-1..6`, `--text-xs..xl`, `--z-*`, `--dur-*`), tinh chỉnh sắc độ để đạt tương phản **WCAG AA** (chữ thường ≥ 4.5:1). Không được: đổi hẳn bảng màu sang tông khác, dùng màu/hình gợi tới KFC, Jollibee, Texas Chicken (đỏ-trắng sọc + ông già, ong đỏ, v.v.).

## 3. Nguyên tắc UX bắt buộc

1. **Vùng ngón cái:** mọi thao tác trong ca bán nằm ở **40% dưới màn hình**. Nút chạm tối thiểu **44×44 pt**, cách nhau ≥ 8 pt.
2. **Một CTA chính mỗi màn**, màu đỏ `--red`, to, có bóng đáy.
3. **Không chỉ dùng màu để truyền tin:** thanh kiên nhẫn có thêm biểu cảm mặt khách (😊 → 😐 → 😤); chất lượng gà có chữ + icon.
4. **Mở giao diện dần:** thiết kế trạng thái "khóa" đẹp cho tab/tính năng chưa mở (ổ khóa + dòng "Mở ở Chương 2"), không ẩn trống trơn.
5. **Chữ ngắn.** Tiêu đề ≤ 5 từ; mô tả ≤ 2 dòng trên màn 390pt.
6. **Chuyển động có mục đích:** thời lượng 120–300ms; có phương án `prefers-reduced-motion`.
7. Tôn trọng `safe-area-inset-top/bottom` (tai thỏ, thanh home iPhone).

## 4. Danh sách màn hình

### 4.1 Header (dùng chung)
Trái: ô "Ngày 12 · Chuẩn bị". Giữa: tên tiệm (tối đa 24 ký tự, cắt bằng dấu …) + **tiền** to, dễ đọc. Phải: sao (★★★★☆) + "4,2". Góc: nút ⚙️ Cài đặt và 🔊 Âm thanh. **Không đặt nút xóa save ở header.** Bên dưới header là **mái hiên sọc** (đỏ/kem) như chi tiết thương hiệu.

### 4.2 Chuẩn bị (Prep)
Từ trên xuống:
1. **Bảng phấn** (nền `--chalk`, chữ phấn): "Kế hoạch Ngày 12", huy hiệu thời tiết/sự kiện, thanh tiến độ chương (dạng mốc: "Đặt cọc mặt bằng: 3,2tr / 5tr").
2. **Thẻ Dự báo hôm nay:** số khách dự kiến, món dự kiến bán chạy, nút phụ **"Nhập theo gợi ý"**.
3. **Thanh tab** (Kho · Nâng cấp · Nhân viên · Đánh giá · Sổ tay) — thiết kế cả trạng thái khóa.
4. **Nội dung tab** dạng danh sách hàng: icon 48px, tên, dòng phụ (tồn kho, hạn dùng), nhóm nút bên phải (+5 / +10 có giá).
5. **Thanh dưới cố định:** CTA đỏ "🍗 MỞ BÁN" chiếm toàn chiều ngang.

Thiết kế riêng: hàng kho sắp hết hạn (nhãn đỏ "HSD 1 ngày"), hàng tồn thấp, nút bị vô hiệu vì thiếu tiền.

### 4.3 Mở bán (màn quan trọng nhất)
Chia 3 tầng:
- **Tầng trên (HUD, ~10%):** đồng hồ dạng vòng tròn 10:00→22:00, nhãn "🔥 Cao điểm" khi đông, nút tạm dừng, nút tua x2.
- **Tầng giữa (hàng khách, ~35%):** tối đa 3 thẻ khách cuộn ngang. Mỗi thẻ: chân dung nhân vật (ảnh), tên ngắn, **bong bóng order bằng icon món lớn** (không phải chữ dài), thanh kiên nhẫn + biểu cảm, huy hiệu "Shipper" hoặc "🐰 Tri kỷ". Thẻ được chọn có viền vàng. Có **bong bóng suy nghĩ nhỏ** thoáng hiện trên đầu khách ("dầu thơm ghê!", "lâu quá 😤").
- **Tầng dưới (quầy gỗ, ~55%, vùng ngón cái):**
  - **Chảo chiên** lớn ở giữa (vùng chạm to nhất màn hình). Dầu đổi màu theo trạng thái: vàng trong / nâu / đen.
  - **Thanh đo độ chín** ngang ngay dưới chảo: 4 vùng *Sống · Vừa · VÀNG GIÒN · Cháy*, kim di chuyển. Vùng Vàng Giòn phát sáng.
  - Hàng nút nguyên liệu: + Gà, + Khoai, 🥤 Nước; hàng sốt: 🌶️ Cay, 🍯 Mật ong.
  - **Khay 4 ô** thành phẩm, mỗi ô ghi chất lượng.
  - Nút **"🔔 GIAO"** lớn.
  - Nút nhỏ "Thay dầu 150k".

Thiết kế thêm các trạng thái: chảo trống ("Chạm để thả gà"), đang chiên, đang ở vùng Perfect (chảo phát sáng + chữ "NHẤC NGAY!"), cháy (khói, rung), khách sắp bỏ về (thẻ rung, viền đỏ), hiệu ứng tiền bay "+40.000đ".

### 4.4 Tổng kết ngày (modal toàn màn)
1. Tiêu đề "Tổng kết Ngày 12" + lãi ròng thật to (xanh nếu lãi, đỏ nếu lỗ).
2. **Biểu đồ radar 5 tiêu chí** (Hương vị, Tốc độ, Vệ sinh, Không gian, Giá cả) với mũi tên ↑↓ so với hôm qua.
3. Sổ sách thu/chi rút gọn (mở rộng được).
4. **Thẻ review nổi bật** kiểu ảnh chụp app review (avatar, tên, sao, câu hài).
5. Hộp "💡 Cố vấn gợi ý" chỉ 1 nâng cấp.
6. CTA chính "Ngày tiếp theo →", CTA phụ "📸 Khoe lên Threads".
Biến thể: **Gà Wrapped** mỗi 7 ngày (khối gradient đỏ, 3 chỉ số tuần).

### 4.5 Cảnh truyện (visual novel mini)
Nền minh họa cảnh (theo chương) mờ nhẹ; 2 chân dung nhân vật đứng hai bên (người đang nói sáng, người kia tối đi); khung thoại dưới cùng có tên người nói; nút "Bỏ qua ≫" góc trên phải; chạm bất kỳ để tiếp. Biến thể có **2 lựa chọn** (2 nút lớn xếp dọc).

### 4.6 Thư Thỏ Cam
Tờ giấy note màu cam nhạt, mép giấy xé, chữ kiểu viết tay (gợi ý font Google Fonts: "Patrick Hand" hoặc font viết tay có hỗ trợ tiếng Việt, nêu rõ tên font bạn chọn), ký tên bằng hình con thỏ nhỏ, dán bằng băng keo giấy lên nền quầy. Nút "Cất vào Sổ Ký Ức". Cộng thêm màn **Sổ Ký Ức** dạng lưới các tờ note (tờ chưa mở là bóng mờ + dấu ?).

### 4.7 Thẻ chia sẻ (ảnh xuất ra, 1080×1350)
Kiểu ảnh chụp màn hình app review: nền kem, logo tiệm nhỏ, avatar + tên người review, sao lớn, câu review cỡ chữ lớn (đọc được khi thu nhỏ trên feed Threads), dòng dưới "Ngày 12 · Tiệm Gà Nhà Tui · chơi tại <link>", linh vật Gà Bông ở góc. Cần 3 biến thể: review 1 sao (hài), review 5 sao, Gà Wrapped tuần.

### 4.8 Trang giới thiệu (landing.html)
Một trang dọc, ưu tiên điện thoại:
1. Hero: tên game, câu *"Từ xe đẩy gà rán đầu hẻm đến chuỗi gà quốc dân — và mỗi review 1 sao là một content."*, nút **"Chơi ngay — không cần cài"**.
2. 3 thẻ tính năng: Chiên sướng tay · Review GenZ bá đạo · Từ xe đẩy thành chuỗi.
3. Dải ảnh ví dụ thẻ review (dùng khung giữ chỗ).
4. Chân trang: Threads, Discord, dòng "Game hư cấu, không liên quan tới thương hiệu gà rán nào".
Không tracking, không cookie banner, không form thu thập dữ liệu.

## 5. Class CSS đang có (giữ nguyên tên)

```
.app .header .h-l .h-m .h-r .h-btn .h-day-box .store-badge .money .stars .awning .main-view
.prep-container .board .board-header .weather-badge .board-goal .goal-info .goal-bar .goal-bar-fill .board-event-note
.tabs-bar .tab-btn .tab-icon .pane .sec-title .sec-desc .item-row .item-icon .item-meta .item-name .item-sub .shelf-tag .low-stock .btn-group .btn-sm .open-bar .btn-big-open
.selling-screen .kitchen-hud .clock .rush-badge .customer-lane .empty-queue .customer-card .cust-header .cust-avatar .cust-avatar-img .cust-name .delivery-badge .bunny-badge .speech-bubble .order-row .order-item-title .order-check .patience-container .patience-bar .patience-fill
.kitchen-counter .work-grid .fryer-card .fryer-header .oil-status .oil-dot .fry-pot .bubble .pot-chicken .pot-hint .cook-gauge-container .gauge-labels .cook-gauge .cook-gauge-zones .zone-raw .zone-perfect .zone-burnt .cook-gauge-pointer .oil-change-btn
.assemble-card .tray-title .tray-slots .tray-item .t-icon .t-name .t-quality .addon-station .addon-btn .btn-serve
.summary-container .summary-title .summary-subtitle .ledger-box .ledger-row .val-pos .val-neg .stars-summary-box .stars-header .stars-score-big .criteria-grid .criteria-item .review-highlight-card .review-badge-top .review-author .review-avatar .review-user-name .review-stars .review-quote .advisor-box .summary-actions .btn-share-threads .btn-next-day
.modal-overlay .modal-card .toast .money-float .gabong-widget .gabong-bubble .story-act-btn
```
Trạng thái dùng class bổ trợ: `.active`, `.locked`, `.angry`, `.mid`, `.low`, `.perfect`, `.good`, `.burnt`, `.done`, `.bunny-card`, `.oil-medium`, `.oil-dirty`, `body.selling-mode`.

Class **mới** bạn cần định nghĩa: `.zone-good` (vùng "Vừa" trên thanh đo), `.forecast-card`, `.radar-chart`, `.story-scene` / `.story-portrait` / `.story-dialog` / `.story-choice`, `.bunny-note` / `.bunny-album-grid`, `.thought-bubble`, `.is-locked-feature`, `.btn-ghost`, `.clock-ring`.

## 6. Ràng buộc kỹ thuật

- HTML được sinh bằng template string trong TypeScript thuần; CSS là file tĩnh. Không CSS-in-JS.
- Hoạt ảnh chạy mỗi frame chỉ dùng `transform` và `opacity` (thanh kiên nhẫn dùng `transform: scaleX()`, kim đo dùng `translateX()`), không animate `width/left`.
- Ảnh nhân vật hiển thị ở 64–96pt trên thẻ khách, 256pt trong cảnh truyện; asset gốc 512px.
- Máy mục tiêu: Android tầm trung (~3 triệu đồng). Tránh `backdrop-filter` và `box-shadow` có blur lớn trên phần tử động.
