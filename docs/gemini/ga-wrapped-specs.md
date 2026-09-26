# THÔNG SỐ KỸ THUẬT & TOẠ ĐỘ VẼ CANVAS "GÀ WRAPPED" 1080×1350 (CHO CLAUDE C5)

Tài liệu này cung cấp toàn bộ kích thước, toạ độ $(X, Y, W, H)$, mã màu HSL/HEX, phông chữ và hình ảnh để Claude Lead hiện thực hóa hàm vẽ `renderGaWrappedCanvas(ctx, state, ledger, stats)` trong C5.

Xem giao diện mẫu trực quan tại: [preview-ga-wrapped.html](preview-ga-wrapped.html)

---

## 1. THÔNG SỐ KHUNG CANVAS TỔNG THỂ

* **Kích thước Canvas:** `width = 1080`, `height = 1350` (Tỷ lệ 4:5 - chuẩn bài đăng Threads/Instagram).
* **Nền chính (Background):** Linear Gradient từ trên xuống dưới:
  * Điểm `0.0`: `#fdf6ec` (Be kem sáng)
  * Điểm `0.5`: `#faecd7` (Caramel nhạt)
  * Điểm `1.0`: `#f5dfc0` (Vàng bánh quy)
* **Viền khung ngoài (Border Frame):**
  * `ctx.strokeStyle = '#e0c29a';`
  * `ctx.lineWidth = 16;`
  * `ctx.roundRect(16, 16, 1048, 1318, 36);`

---

## 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)

### Khu vực 1: Mái hiên sọc đỏ - trắng K-Chicken (Y: 16 → 46)
* Sọc so le 45px: `#e63946` và `#ffffff`.
* Chiều cao: 30px.

### Khu vực 2: Header Quán & Huy Hiệu Chương (Y: 60 → 170)
* **Logo gà:** Toạ độ `X: 50, Y: 60, W: 90, H: 90`. Nạp từ `ASSETS.ui.logoKoreanChicken` hoặc `ASSETS.gabong.front`.
* **Tên quán:** `ctx.font = 'bold 44px "Baloo 2", sans-serif'; ctx.fillStyle = '#2b1d1f';`
  * Vẽ tại `X: 160, Y: 110`. Ví dụ: `🍗 ${state.shopName}`
* **Dòng phụ đề:** `ctx.font = '600 24px "Be Vietnam Pro", sans-serif'; ctx.fillStyle = '#8c6248';`
  * Vẽ tại `X: 160, Y: 145`. Ví dụ: `Hẻm 1102 Sài Gòn · Đã mở ${state.day} ngày`
* **Huy hiệu chương:** Bo góc tròn (pill), nền đỏ `#e63946`, chữ trắng:
  * `X: 740, Y: 85, W: 290, H: 50, Radius: 25`.
  * Chữ: `CHƯƠNG ${state.currentChapter} · ${CHAPTER_NAME}`

### Khu vực 3: Tiêu đề Báo Cáo & Danh Hiệu Vinh Danh (Y: 190 → 360)
* **Kicker:** `X: 540 (center), Y: 215` — `ctx.font = 'bold 24px "Be Vietnam Pro"'; ctx.fillStyle = '#c2410c';`
  * Chữ: `✨ BÁO CÁO TỔNG KẾT HÀNH TRÌNH ✨`
* **Tiêu đề lớn:** `X: 540 (center), Y: 285` — `ctx.font = '900 64px "Baloo 2"'; ctx.fillStyle = '#e63946';`
  * Chữ: `GÀ WRAPPED CỦA BẠN`
* **Hộp danh hiệu vinh danh (Honor Box):**
  * `X: 90, Y: 315, W: 900, H: 75, Radius: 22`
  * Nền: Linear Gradient `#fffcf5` → `#ffedd5`, Viền: `#f97316` dày 4px.
  * Chữ: `🏆 DANH HIỆU: ${honorTitle}` (`ctx.font = 'bold 34px "Baloo 2"'; ctx.fillStyle = '#9a3412';`)

### Khu vực 4: Lưới 4 Thẻ Chỉ Số Vàng (2×2 Hero Stats Grid) (Y: 415 → 765)
* Mỗi thẻ có `W: 460, H: 160, Radius: 24`, nền trắng `#ffffff`, viền `#e8d2b7` dày 3.5px.
* **Hàng 1 (Y: 415):**
  * **Thẻ 1 (Trái, X: 60):**
    * Tiêu đề: `💰 TỔNG DOANH THU` (`#8c6248`, font 24px)
    * Giá trị: `+${(totalRevenue).toLocaleString('vi-VN')}đ` (`#d97706`, font bold 52px "Baloo 2")
    * Ghi chú: `Tăng trưởng vượt bậc` (`#a8795d`, font 20px)
  * **Thẻ 2 (Phải, X: 560):**
    * Tiêu đề: `🍗 MIẾNG GÀ ĐÃ CHIÊN`
    * Giá trị: `${totalFried} miếng` (`#dc2626`, font bold 52px "Baloo 2")
    * Ghi chú: `Tỷ lệ Perfect ${perfectPct}%`
* **Hàng 2 (Y: 595):**
  * **Thẻ 3 (Trái, X: 60):**
    * Tiêu đề: `👥 THỰC KHÁCH PHỤC VỤ`
    * Giá trị: `${totalCustomers} khách` (`#15803d`, font bold 52px "Baloo 2")
    * Ghi chú: `Đánh giá trung bình ${overallRating} / 5.0 ⭐`
  * **Thẻ 4 (Phải, X: 560):**
    * Tiêu đề: `🔥 KỶ LỤC CHUỖI PERFECT`
    * Giá trị: `x${bestStreak} LẦN LIÊN TIẾP` (`#d97706`, font bold 52px "Baloo 2")
    * Ghi chú: `Đôi tay vàng 1990 Chợ Lớn 👨‍🍳`

### Khu vực 5: Món Ăn 'Ruột' Spotlight & Review Viral (Y: 780 → 980)
* **Hộp Spotlight:** `X: 60, Y: 780, W: 960, H: 185, Radius: 26`.
* Nền trắng `#ffffff`, viền `#f4a261` dày 3.5px.
* **Hình ảnh món ăn:** `X: 85, Y: 805, W: 135, H: 135`. Nạp từ `ASSETS.food.crispyChicken` hoặc `ASSETS.food.spicyChicken`.
* **Nội dung chữ (X: 245):**
  * Tag đỏ: `⭐ MÓN 'RUỘT' ĐƯỢC GỌI NHIỀU NHẤT` (font bold 20px, `#e63946`)
  * Tên món: `${topDishName} (${topDishCount} phần đã bán)` (font bold 36px "Baloo 2", `#2b1d1f`)
  * Trích dẫn review: `"${viralQuote}"` (font italic 22px, `#633e25`, tự động ngắt dòng maxWidth 720)

### Khu vực 6: Mascot Gà Bông & Con Dấu Chứng Nhận (Y: 995 → 1150)
* **Mascot Gà Bông:** `X: 70, Y: 1010, W: 110, H: 110`. Nạp từ `ASSETS.gabong.mascotFront`.
* **Lời nhắn gửi (X: 200, Y: 1045):**
  * `ctx.font = 'bold 22px "Be Vietnam Pro"'; ctx.fillStyle = '#734c34';`
  * `"Cảm ơn bạn đã thức khuya dậy sớm chiên gà cùng tiệm! Hẻm 1102 ấm áp lên rất nhiều là nhờ bạn đó!"`
* **Con dấu đỏ (Official Stamp Seal):**
  * Toạ độ tâm `X: 960, Y: 1065, Radius: 60`.
  * Viền nét đứt (dashed), mực đỏ `#c0392b`, xoay nghiêng `-8deg`.
  * Chữ bên trong: `CHỨNG NHẬN / TIỆM GÀ / CHUẨN VỊ / ★★★★★`

### Khu vực 7: Chân Trang & Watermark Chia Sẻ Threads (Y: 1180 → 1334)
* **Nền chân trang:** Màu nâu đen `#2b1d1f`, bo góc đáy `Radius: 28`.
  * `X: 16, Y: 1180, W: 1048, H: 154`.
* **Thương hiệu bên trái:**
  * Dòng 1: `🐣 Tiệm Gà Nhà Tui · Trò Chơi Quản Lý Tiệm Gà Sài Gòn` (`#ffd166`, font bold 28px "Baloo 2")
  * Dòng 2: `Chơi ngay trên Web: tiem-ga-nha-tui · Không cần cài đặt` (`#d6c5b6`, font 20px)
* **Nút gắn thẻ bên phải:**
  * Nền trắng `#ffffff`, chữ `#2b1d1f` font bold 22px.
  * Chữ: `📸 Chia sẻ Threads`

---

## 3. CÔNG THỨC SINH DANH HIỆU TỰ ĐỘNG (DỰA TRÊN STATE)

```ts
export function resolveWrappedTitle(state: GameState): { title: string; desc: string } {
  const karma = state.karma;
  const bestStreak = state.highestStreak ?? 0;
  
  if (karma && karma.community >= 40) {
    return { title: 'BẬC THẦY HẢO TÂM HẺM 1102', desc: 'Được 100% cư dân và Bác Ba yêu mến!' };
  }
  if (karma && karma.craftsmanship >= 40) {
    return { title: 'CHIẾN THẦN CANH LỬA — ĐÔI TAY VÀNG', desc: 'Mọi mẻ gà đều đạt độ giòn rụm đỉnh cao!' };
  }
  if (karma && karma.ambition >= 40) {
    return { title: 'ÔNG TRÙM KINH DOANH GÀ RÁN', desc: 'Tối ưu lợi nhuận với tầm nhìn đế chế F&B!' };
  }
  if (bestStreak >= 10) {
    return { title: 'BẬC THẦY GIÒN RỤM HOÀN HẢO', desc: 'Đạt chuỗi Perfect không tì vết!' };
  }
  return { title: 'NGƯỜI HÙNG KHỞI NGHIỆP HẺM 1102', desc: 'Chiếc xe đẩy vượt bao giông bão Sài Gòn!' };
}
```
