# Dossier Đề Xuất Gameplay Logic & Hệ Thống Đa Kết Thúc (Multi-Ending)
# Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude

> Tài liệu tổng hợp toàn diện các tệp tin cốt lõi, phản hồi người dùng về quản lý kho, và kiến trúc cây hội thoại phân nhánh ảnh hưởng quá khứ/tương lai (Happy Ending, Open Ending, Bad Ending, Secret Ending).

---

## 1. Bản Đồ Các Tệp Tin Trọng Tâm Cần Review

| Phân Vùng | Tệp Tin Quan Trọng | Mô Tả & Nhiệm Vụ | Phụ Trách |
|---|---|---|---|
| **Contract** | `src/types/game.ts` | Interface chung: `GameState`, `InventoryItem`, `MenuItem`, `Customer`, `KarmaState` | Cả hai |
| **Logic Kho & Tiến Trình** | `src/core/inventory.ts`, `src/content/inventory.ts` | Lô hàng FIFO, hạn dùng, cơ chế hoàn trả vốn, phân tầng mở khóa | Claude |
| **Vòng Lặp Game** | `src/core/state.ts`, `src/core/economy.ts`, `src/core/cooking.ts` | Tiến trình ngày, tài chính, thanh đo 5 vùng độ chín, chất lượng dầu | Claude |
| **Cốt Truyện & Lore** | `docs/02-story-bible-v2.md`, `src/content/customers.ts` | 12 cư dân Hẻm 1102, lai lịch Thỏ Cam Mimi, 3 chuỗi đối thủ | Claude |
| **Kỹ Năng Multi-Agent** | `.agents/skills/game-narrative-director/SKILL.md` | Hướng dẫn đạo diễn cốt truyện, văn phong Sài Gòn, ma trận lời thoại | Cả hai |
| **Giao Diện Đã Chuẩn Bị** | `src/styles/main.css`, `docs/gemini/preview-story.html` | CSS Visual Novel Mini (`.story-*`), Thư Thỏ Cam (`.bunny-*`), Cọc mặt bằng (`.deposit-*`) | Gemini |
| **Tài Nguyên Sẵn Sàng** | `public/assets/` (44 files) | 5 món ăn, 6 biểu cảm Gà Bông, 4 chảo/dầu, thư note, 15 icon UI trong suốt | Gemini |

---

## 2. Đề Xuất Cải Tiến Logic Gameplay (Phản Hồi Người Dùng)

### 2.1. Nút Hoàn Trả / Giảm Mua (`-5`) Trong Màn Chuẩn Bị:
* **Thực trạng:** `src/ui/components/InventoryTab.ts` hiện chỉ có nút `+5` và `+10`. Người chơi lỡ tay bấm nhầm sẽ bị trừ tiền ngay lập tức, không thể rút lại vốn để mua các nguyên liệu cốt lõi (gà tươi, dầu), dễ dẫn tới thua cuộc ngay Ngày 1.
* **Đề xuất:**
  * Thêm nút `-5` bên cạnh `+5` / `+10`.
  * Khi bấm `-5`: Hoàn lại 100% tiền nhập (`draft.money += item.cost * 5`) và giảm tồn kho qua `consumeStock(item, 5)`.
  * Khóa nút `-5` nếu tồn kho `< 5`.

### 2.2. Phân Tầng Mở Khóa Nguyên Liệu (Progression Pacing):
* **Thực trạng:** Toàn bộ 10 nguyên liệu (kể cả Mì Ý, Vỏ Burger, Trà đào kem, Sốt cay) đều mở sẵn từ Ngày 1, làm loãng ngân sách và phá vỡ cảm giác thăng tiến từ xe đẩy lên cửa hàng.
* **Đề xuất bảng tiến trình:**
  1. **Ngày 1 (Khởi nghiệp xe đẩy — Menu tinh gọn 5 món):**
     * `chicken_meat` (Gà tươi 14.000đ): Cốt lõi
     * `flour` (Bột chiên giòn 3.000đ): Cốt lõi
     * `fry_oil` (Dầu chiên cao cấp 150.000đ): Cốt lõi
     * `potato_cheese` (Khoai tây & Phô mai 8.000đ): Món ăn kèm
     * `soft_drink` (Nước ngọt lon 6.000đ): Nước uống
  2. **Giai đoạn Mở Khóa Theo Mốc Ngày & Phí Hợp Đồng Cung Ứng (Unlock Fee):**
     * `spicy_sauce` (Sốt cay xé lưỡi): Mở từ **Ngày 3** · Phí: **50.000đ**
     * `garlic_honey` (Sốt mật ong bơ tỏi): Mở từ **Ngày 4** · Phí: **80.000đ**
     * `dessert_pack` (Trà đào & Kem Sundae): Mở từ **Ngày 7** (Chương 2: Tiệm Số 14) · Phí: **120.000đ**
     * `pasta_beef` (Mì Ý & Sốt bò ngọt): Mở từ **Ngày 9** (Chương 2) · Phí: **150.000đ**
     * `burger_bun` (Vỏ burger & Xà lách): Mở từ **Ngày 14** (Chương 3: Mặt Tiền Phố) · Phí: **250.000đ**

---

## 3. Kiến Trúc Hội Thoại Phân Nhánh & Ma Trận Đa Kết Thúc (Multi-Ending)

### 3.1. Hệ Thống 3 Chỉ Số Nghiệp Cảm Ẩn (Karma Metrics):
Mỗi lựa chọn trong Visual Novel Mini sẽ cộng trừ vào 3 chỉ số chi phối tương lai:

```typescript
export interface KarmaState {
  community: number;     // ❤️ Tình Thân Hẻm (Gắn kết Bác Ba, Mimi, bà con lối xóm)
  craftsmanship: number; // 🔥 Bản Sắc Nghệ Nhân (Tôn trọng lửa nghề, dầu sạch, kiên trì)
  ambition: number;      // 💼 Tham Vọng Quy Mô (Tối ưu doanh thu, PR truyền thông, mở chuỗi)
}
```

### 3.2. Hiệu Ứng Cánh Bướm Tác Động Quá Khứ & Tương Lai:
* **Mở khóa quá khứ ẩn (Flashbacks):**
  * Chọn quan tâm Bác Ba ➔ Mở ký ức tiệm "Gà Chợ Lớn" năm 1990 của ông Võ Hòa (ông ngoại Thỏ Cam Mimi), nhận bí quyết "nghe tiếng dầu reo" (+3% vùng Perfect).
  * Gặng hỏi Thỏ Cam nhẹ nhàng ➔ Nhận được bức thư tâm sự về gánh nặng gia đình và lý do phải mặc đồ mascot phát tờ rơi câm lặng.
* **Hệ quả trong khủng hoảng Chương 4 (Cuộc chiến chống MegaChicken):**
  * `community >= 70`: Bà con Hẻm 1102, Quỳnh Anh TikToker và Tuấn Shipper mở chiến dịch phản pháo review ảo bảo vệ tiệm.
  * `ambition` quá cao, `community` thấp: Khách quen bỏ đi, tiệm đơn độc bị chuỗi lớn chèn ép.

### 3.3. Ma Trận 4 Đại Kết Cục (Endings):

```
                                [QUYẾT ĐỊNH CHƯƠNG 4 & 5]
                                            |
             +------------------------------+------------------------------+
             |                                                             |
   [Giữ Bản Sắc & Tình Hẻm]                                     [Chạy Theo Thương Mại Hóa]
             |                                                             |
    +--------+--------+                                           +--------+--------+
    |                 |                                           |                 |
(Đủ Điều Kiện)   (Bình Thường)                              (Lợi Nhuận Thấp)   (Lợi Nhuận Cực Đại)
    |                 |                                           |                 |
  🏆 ENDING 1       🌱 ENDING 2                                 💀 BAD ENDING 3A   💔 BAD ENDING 3B
  [Đại Viên Mãn]   [Bình Dị An Yên]                           [Phá Sản Rời Hẻm]   [Đánh Mất Linh Hồn]
```

#### 🏆 Ending 1: Happy Ending — "Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ" (Đại Viên Mãn)
* **Điều kiện:** `community >= 80` + `craftsmanship >= 80` + Mở khóa 100% thư Thỏ Cam.
* **Diễn biến:** Tiệm thắng thế trước MegaChicken bằng ngày hội "Bếp Mở Hẻm 1102". Mimi cởi mũ mascot Thỏ Cam trên sân khấu giải Gà Vàng, nhận chức Giám đốc Vận hành Chi nhánh Chợ Lớn. Khôi phục lại biển hiệu "Gà Chợ Lớn" năm 1990 bên cạnh "Tiệm Gà Nhà Tui". Bác Ba trao lại chiếc vá gỗ gia truyền.

#### 🌱 Ending 2: Open Ending — "Gió Hẻm Thổi Mãi" (Bình Dị An Yên)
* **Điều kiện:** `community` cân bằng, người chơi giữ lại quán ăn ấm cúng tại Tiệm Số 14, không mở chuỗi lớn.
* **Diễn biến:** Tiệm gà là linh hồn của con hẻm. Na và Dũng đỗ đại học. Mimi không còn phải mặc đồ thú bông đi phát tờ rơi dưới nắng mưa, trở thành người khách quen ngồi ăn gà mỗi chiều thứ Bảy. Một cái kết bình dị, ấm áp.

#### 💀 Bad Ending 3A: "Cửa Cuốn Đóng Lại" (Phá Sản)
* **Điều kiện:** Vỡ nợ tiền cọc mặt bằng, hoặc điểm sao `< 2.5` kéo dài 3 ngày liên tiếp.
* **Diễn biến:** Xe đẩy bị dẹp, bạn dọn đồ rời hẻm trong một chiều mưa buồn. Bác Ba thở dài dúi vào tay bạn ít tiền lộ phí.

#### 💔 Bad Ending 3B: "Cỗ Máy Gà Vô Hồn" (Mất Chất Thương Mại)
* **Điều kiện:** `ambition >= 90`, chọn hợp tác bán 49% cổ phần cho Mr. Mega (MegaChicken), chuyển sang dùng bột pha sẵn và gà đông lạnh giá rẻ.
* **Diễn biến:** Chuỗi mở 50 chi nhánh, doanh thu tiền tỷ nhưng đồ ăn dở tệ. Bác Ba lặng lẽ trả lại chiếc vá gỗ bỏ về quê; Thỏ Cam không bao giờ xuất hiện nữa. Bạn ngồi trong phòng kính máy lạnh nhận ra mình đã đánh mất linh hồn quán gà.

#### 🌟 Secret Ending: "Chiếc Vá Vàng 1975" (Đẳng Cấp Nghệ Nhân)
* **Điều kiện:** Đạt 5.0⭐ toàn diện suốt 20 ngày, 0 miếng gà cháy, tỷ lệ Perfect >= 90%.
* **Diễn biến:** Hiệp hội Ẩm thực Quốc tế vinh danh tiệm gà rán thủ công đỉnh cao nhất Sài Gòn. Chiếc vá gỗ của Bác Ba được đúc đồng mạ vàng lưu niệm như một bảo vật ẩm thực đường phố.

---

## 4. Đề Xuất Phân Công Công Việc Tiếp Theo

1. **Claude:**
   * Cập nhật `src/types/game.ts` (thêm `unlockDay`, `unlockCost` cho `InventoryItem`; thêm `KarmaState` vào `GameState`).
   * Triển khai hàm logic hoàn tiền `-5` và mở khóa nguyên liệu trong `src/core/inventory.ts` và `src/ui/components/InventoryTab.ts`.
   * Xây dựng kịch bản cây hội thoại phân nhánh trong `src/content/storyNovel.ts`.
2. **Gemini:**
   * Sẵn sàng cập nhật CSS cho giao diện kho (thẻ khóa `🔒 Mở khóa Ngày X`, nút `-5`, nút `Mở Khóa`).
   * Sẵn sàng hỗ trợ đồ họa visual banner cho các Ending khi Claude kết nối màn hình kết thúc.
