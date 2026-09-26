---
name: game-feel-polish
description: "Chuyên gia nghệ thuật Game Feel, hiệu ứng thị giác (Visual Juice), micro-interactions, haptic feedback và tối ưu giao diện thao tác 1 ngón cái (Thumb-zone) trên web mobile cho Tiệm Gà Nhà Tui."
---

# Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui

Skill này hướng dẫn Agent (đặc biệt là Gemini phụ trách UI/UX/CSS và Claude khi gắn event handler) cách thổi hồn vào giao diện trò chơi, tạo cảm giác bấm **"cực kỳ sướng tay" (tactile satisfaction)**, biến một web game quản lý thành trải nghiệm gây nghiện trên điện thoại di động.

---

## 1. Triết Lý "Juice It Or Lose It"

Một hành động trong game chỉ thực sự thỏa mãn khi hội đủ **4 tầng phản hồi đồng thời**:
1. **Phản hồi xúc giác (Haptics):** Rung nhẹ thiết bị qua `navigator.vibrate()`.
2. **Phản hồi thính giác (Audio):** Âm thanh "tách", "xèo", "ting ting" vang lên ngay tại mili-giây thứ 0.
3. **Phản hồi thị giác (Visual Juice):** Nút lún xuống (scale 0.92), tia sáng bừng lên, hạt tiền bay lơ lửng.
4. **Phản hồi tâm lý (Emotional Reward):** Điểm số nhảy số, biểu cảm khách hàng giãn ra vui vẻ.

---

## 2. Quy Chuẩn Vùng Ngón Cái (Thumb-Zone Ergonomics)

### 2.1. Phân bổ màn hình dọc 9:16 (390×844pt)
- **Top 15% (Vùng mắt nhìn - HUD):** Đồng hồ thời gian vòng tròn, huy hiệu giờ cao điểm, sao đánh giá, nút cài đặt/âm thanh.
- **Mid 35% (Vùng theo dõi diễn biến):** Hàng đợi thực khách, bong bóng order icon món, thanh kiên nhẫn và bong bóng suy nghĩ thoáng qua.
- **Bottom 50% (Vùng ngón cái vàng - Golden Thumb Zone):** Chảo chiên lớn, thanh đo độ chín, hàng nút chọn nguyên liệu, khay 4 ô thành phẩm và nút **🔔 GIAO MÓN** to đại bàng.

### 2.2. Kích thước chạm an toàn (Target Size)
- Nút bấm chính: Tối thiểu **48×48 pt**, bóng đáy nổi 3D (offset dọc 3-4px không làm mờ), không bao giờ đặt nút sát mép màn hình (cách mép ≥ 10px).
- Nút phụ / icon: Tối thiểu **36×36 pt**, vùng đệm cảm ứng vô hình (padding trong) 44pt.

---

## 3. Bảng Tra Cứu Hiệu Ứng Chuyển Động (Animation Tokens)

| Tên Hiệu Ứng | Selector CSS | Đường Cong Easing & Thời Lượng | Cảm Xúc Mang Lại |
|---|---|---|---|
| **Nút bấm nảy** | `.btn-big-open:active`, `.h-btn:active` | `transform: scale(0.92)` / 100ms | Chắc tay, phản hồi tức thì |
| **Bật nảy Sticker** | `.tray-item`, `.customer-card` | `popIn`: `scale(0.8) → scale(1.08) → scale(1)` / 200ms `cubic-bezier(0.34, 1.56, 0.64, 1)` | Tươi vui, gợi cảm giác sticker nổi |
| **Tiền bay lơ lửng** | `.money-float` | `floatUp`: `translateY(0, opacity: 1) → translateY(-40px, opacity: 0)` / 800ms ease-out | Sung sướng khi tiền vào ví |
| **Khách bực bội** | `.customer-card.angry` | `angryShake`: `translateX(-3px) rotate(-1deg) ↔ translateX(3px) rotate(1deg)` / 350ms alternate | Cảnh báo khẩn cấp, thôi thúc người chơi cứu vãn |
| **Chảo dầu sôi** | `.fry-pot .bubble` | `boil`: `translateY(30px) scale(0.4) → translateY(-30px) scale(1)` / 1.2s ease-in | Thèm ăn, sống động mùi thơm dầu chiên |

---

## 4. Haptic Feedback Matrix (Rung Xúc Giác)

Sử dụng Web Vibration API (`navigator.vibrate`) có kiểm tra an toàn thiết bị:

```ts
export const Haptics = {
  // Nhấc gà đúng vùng Vàng Giòn (Perfect) -> Rung giòn tan 1 nhịp nhẹ
  perfect: () => {
    if ('vibrate' in navigator) navigator.vibrate(15);
  },

  // Giao món hoàn thành đơn hàng -> Rung kép 2 nhịp vui vẻ
  serveSuccess: () => {
    if ('vibrate' in navigator) navigator.vibrate([18, 40, 18]);
  },

  // Gà bị cháy khét hoặc khách bỏ về -> Rung trầm cảnh báo
  burntWarning: () => {
    if ('vibrate' in navigator) navigator.vibrate([60, 50, 60]);
  },

  // Bấm nút giao diện thông thường
  tap: () => {
    if ('vibrate' in navigator) navigator.vibrate(8);
  }
};
```

---

## 5. Bong Bóng Suy Nghĩ Realtime (Customer Thoughts System)

Học tập cơ chế "Guest Thoughts" từ OpenRCT2 để biến hàng chờ thành sân khấu tâm lý sống động:

### Quy tắc hiển thị:
- Mỗi khi khách hàng chờ > 5 giây hoặc kiên nhẫn tụt qua các mốc 75%, 50%, 25%, hiển thị một bong bóng suy nghĩ thoáng hiện trong **2.5 giây** rồi mờ dần.
- **Nội dung theo ngữ cảnh:**
  - *Kiên nhẫn > 60%:* `"Dầu thơm quá trời! 😋"`, `"Hóng đùi gà giòn rụm 🍗"`, `"Nhanh giùm tui nha bé ơi"`.
  - *Kiên nhẫn 30% – 60%:* `"Đói bụng cồn cào rùi nè... 🥺"`, `"Sao lâu dữ vậy chèn ⏳"`.
  - *Kiên nhẫn < 30%:* `"Bỏ về qua tiệm khác cho rồi! 😤"`, `"Hết kiên nhẫn nổi rùi đó 💢"`.
  - *Bé Thỏ Cam:* `"Chiếc áo len hôm nay ấm ghê... 🐰"`, `"Công thức bơ tỏi thơm thật..."`.

---

## 6. Biểu Đồ Radar SVG 5 Tiêu Chí (Summary Radar Chart)

Trong màn Tổng kết ngày (`SummaryModal.ts`), vẽ trực tiếp phần tử `<svg>` 5 cạnh đại diện cho:
1. **Hương Vị (Taste)**
2. **Tốc Độ (Speed)**
3. **Vệ Sinh (Hygiene)**
4. **Không Gian (Space)**
5. **Giá Cả (Pricing)**

### Quy chuẩn SVG:
- **Tâm radar:** `(100, 100)`, bán kính $R = 75$px.
- **Tọa độ 5 đỉnh:** $\theta_i = -\frac{\pi}{2} + i \cdot \frac{2\pi}{5}$ với $i \in [0, 4]$.
- **Màng đa giác:** Tô màu vàng cam trong suốt `rgba(255, 209, 102, 0.45)`, viền cam đậm `stroke="#f4a261" stroke-width="2.5"`.
- **Mũi tên biến thiên:** Đi kèm nhãn delta so với ngày hôm trước (ví dụ: `Hương vị: 4.8 (+0.2 ↑)` màu xanh bạc hà, `Tốc độ: 3.2 (-0.4 ↓)` màu đỏ cảnh báo).
