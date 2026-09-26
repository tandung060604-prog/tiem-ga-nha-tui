---
name: procedural-content-generator
description: "Chuyên gia sinh nội dung ngẫu nhiên (Procedural Generation) cho 100-200 thực khách Sài Gòn, tạo tên gọi, ngoại hình ghép tầng, tính cách, câu thoại ngữ cảnh, nhiệm vụ khách bí ẩn và ngân hàng mẫu review GenZ viral."
---

# Procedural Content Generator — Tiệm Gà Nhà Tui

Skill này hướng dẫn Agent (Claude & Gemini) phương pháp **sinh nội dung thủ tục (Procedural Generation - ProcGen)** để tạo ra một thế giới thực khách sống động với 100–200 nhân vật đô thị không trùng lặp, câu chuyện hẻm phong phú và hệ thống nhiệm vụ phụ lôi cuốn.

---

## 1. Công Thức Đặt Tên Thực Khách Sài Gòn (Naming Formula)

Thực khách đến quán không dùng tên vô hồn (như "Khách 1", "Khách 2"), mà dùng danh xưng đời thường gắn liền với văn hóa đường phố:

$$\text{Tên Hiển Thị} = \text{Danh Xưng / Thứ Bậc} + \text{Tên Riêng / Nghề Nghiệp / Thói Quen}$$

### Các nhóm danh xưng phổ biến:
1. **Nhóm Xóm Hẻm Bình Dân:**
   - *Thứ bậc Nam Bộ:* `Chú Ba Xe Ôm`, `Cô Năm Tạp Hóa`, `Dì Bảy Bánh Xèo`, `Bác Tám Cây Kiểng`, `Anh Chín Thợ Điện`.
   - *Biệt danh ngoại hình / tính cách:* `Thằng Tèo Mắt Kiếng`, `Bé Bông Đầu Nấm`, `Bé Mập Thèm Ăn`, `Cu Tí Lóc Chóc`.
2. **Nhóm Văn Phòng & Công Sở:**
   - *Chức danh + Tên:* `Sếp Hoàng`, `Trưởng Phòng Tuấn`, `Thực Tập Sinh Ly`, `Kế Toán Thảo`, `HR Diệu Linh`.
3. **Nhóm GenZ & Học Sinh Sinh Viên:**
   - *Nickname mạng xã hội:* `Quỳnh Kem Mút`, `Huy Boy Phố`, `Linh Kẹo Ngọt`, `Nam Simp Chúa`, `Trang Mê Gà`, `Duy Cháy Phố`.
4. **Nhóm Nghề Nghiệp Đô Thị:**
   - *Shipper:* `Tuấn Xanh Lá`, `Bảo Giao Nhanh`, `Đức Cày Cuốc`, `Hải Mũ Bảo Hiểm`.
   - *Tự do / Nghệ thuật:* `Sơn Xăm Mình`, `Hà Chụp Ảnh`, `Bảo DJ`, `My Múa Cột`.

---

## 2. Hệ Thống Ghép Tầng Ngoại Hình (Modular Visual Generation)

Để tạo ra 100–200 avatar độc bản mà không cần vẽ 200 ảnh riêng biệt, sử dụng hệ thống ghép mảnh 4 tầng (Layered Compositing):

```
Tầng 1 (Nền):      Màu nền tròn pastel (Vàng / Xanh mint / Cam / Hồng / Be)
Tầng 2 (Thân):     Áo thun đỏ / Sơ mi cà vạt / Áo khoác shipper xanh / Áo hoodie / Áo bà ba
Tầng 3 (Khuôn mặt): Tóc ngắn / Tóc dài búi / Đầu đinh / Tóc xoăn / Kính cận / Râu mép
Tầng 4 (Phụ kiện):  Tai nghe gaming / Mũ bảo hiểm / Khẩu trang kéo cằm / Bút sau tai / Khuyên tai
```

Khi xuất ra dữ liệu nhân vật, cấu trúc như sau:

```ts
export interface ProceduralCustomer {
  id: string; // 'cust_0142'
  displayName: string; // 'Cô Sáu Bán Bún'
  group: 'resident' | 'office' | 'genz' | 'shipper' | 'student';
  avatarConfig: {
    bgColor: string;
    bodyAsset: string;
    faceAsset: string;
    accessoryAsset?: string;
  };
  patienceBaseSec: number; // 25s - 45s
  tipChance: number; // 0.1 - 0.4
  favoriteFoodId: 'crispy_chicken' | 'shake_fries' | 'soda' | 'spicy_chicken';
  dialogueSetId: string;
}
```

---

## 3. Ngân Hàng Câu Thoại Ngữ Cảnh (Contextual Dialogue Bank)

Mỗi thực khách có 4 câu thoại ngắn (mỗi câu < 15 từ) tương ứng 4 thời điểm:

| Thời Điểm | Khách Xóm Hẻm | Dân Văn Phòng | GenZ / Sinh Viên |
|---|---|---|---|
| **Lúc Đặt Món** | "Cho dĩa đùi chiên giòn nha con!" | "Một combo gà sốt mang về gấp nhé em." | "Cho 1 phần nhiều da giòn, 10 điểm!" |
| **Lúc Đang Chờ** | "Khói dầu thơm phức cả con hẻm." | "Sắp đến giờ họp rồi, ráng nhanh giùm anh." | "Hóng mẻ gà rụm rụm quá nè trời..." |
| **Khi Được Giao Món** | "Cảm ơn nghe, chiều bác lại ghé!" | "Cảm ơn em, giữ tiền thừa làm tip nhé." | "U là trời xuất sắc lun á!" |
| **Khi Chờ Quá Lâu** | "Thôi trễ giờ rước cháu rồi, bác đi đây!" | "Lâu quá hủy đơn giùm anh nhé em." | "Flop toàn tập, giận luôn! 😤" |

---

## 4. Cơ Chế Khách Bí Ẩn & Chuỗi Nhiệm Vụ (Mystery Quests)

Vào những ngày chỉ định hoặc ngẫu nhiên với tỷ lệ 15%, một nhân vật bí ẩn sẽ ghé tiệm mang theo **Lời Thách Đấu / Yêu Cầu Đặc Biệt**:

### Cấu trúc Quest:
1. **Điều kiện hoàn thành:**
   - Chiên liên tiếp 3 miếng Vàng Giòn (Perfect Streak).
   - Giao 5 đơn hàng trong thời gian dưới 20 giây mỗi đơn.
   - Không làm cháy bất kỳ miếng gà nào trong suốt ca bán.
   - Phục vụ đúng khẩu vị đặc biệt (ví dụ: Bé Thỏ Cam yêu cầu gà rắc thêm sốt mật ong).
2. **Phần thưởng:**
   - Tiền thưởng lớn (+100.000đ → +500.000đ).
   - Buff sao vĩnh viễn cho 1 tiêu chí (+0.3 sao Tốc Độ hoặc Hương Vị).
   - Mở khóa một lá thư mới trong Sổ Ký Ức.

---

## 5. Quy Chuẩn Sinh Review GenZ Hài Hước (Viral Review Generator)

Để tạo hiệu ứng lan tỏa trên mạng xã hội Threads, các mẫu review cuối ngày phải thỏa mãn:
1. **Ngắn gọn, giật tít:** Đọc trong 3 giây.
2. **Logic tréo ngoe (Meme logic):**
   - *5 sao:* "Gà ngon tới mức làm em quên luôn mình đang giảm cân. Tạm biệt 2 triệu tiền PT gym!"
   - *1 sao:* "Tiệm chiên gà thơm quá làm chó nhà em sủa đòi ăn suốt đêm, mất ngủ. 1 sao!"
   - *5 sao:* "Vừa ăn miếng gà vừa khóc vì nhớ người yêu cũ... Mà gà ngon quá nên nín khóc ăn tiếp."
