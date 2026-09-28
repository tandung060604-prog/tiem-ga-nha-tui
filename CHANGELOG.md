# 🍗 NHẬT KÝ CẬP NHẬT — TIỆM GÀ NHÀ TUI

Trang chơi game trực tiếp (GitHub Pages): [https://tandung060604-prog.github.io/tiem-ga-nha-tui/](https://tandung060604-prog.github.io/tiem-ga-nha-tui/)

---

## 🌟 [v2.2.1] — Vòng Lặp Vàng: Nấu Sốt Sáng & Lọc Dầu Đêm (28/09/2026)
> **Tuyển chọn bởi TypeSafe AI Jev (Hệ Thống 1 — Tín nhiệm 96%) từ Báo Cáo Tính Năng Tiệm Mì Cay**

Phiên bản hoàn thiện trọn vẹn **Vòng Lặp Vàng Khép Kín**: Sáng nêm sốt gia truyền nhận Buff Tip $\rightarrow$ Ngày chiên gà phục vụ khách xôm tụ $\rightarrow$ Tối vớt cặn bột cháy cứu dầu & tiết kiệm 150k chi phí vận hành.

### 🧹 1. Minigame Lọc Cặn Dầu & Vớt Bột Cháy Cuối Ngày (The End-of-Day Oil Filter)
* **Gameplay 1 Ngón Cái (15s)**: Chạm hoặc vuốt nhanh các đốm cặn bột cháy trên mặt chảo gang 3D tròn trước khi dầu nguội đặc.
* **Cơ Chế Phục Hồi Dầu Chiên & Tiết Kiệm Chi Phí**:
  * **Vớt sạch 100% (8/8 cặn)**: Phục hồi 1 bậc độ sạch dầu (`dirty` $\rightarrow$ `medium`, `medium` $\rightarrow$ `clean`), **tiết kiệm ngay 150.000đ** tiền thay dầu và cộng thưởng **+0.2★ Vệ Sinh**. Nếu dầu vốn đã sạch (`clean`), người chơi nhận thêm **+20.000đ** tiền thưởng dọn dẹp.
  * **Vớt từ 60% trở lên (5-7 cặn)**: Bác Ba giảm 50% tiền thay dầu (còn 75.000đ) và cộng thưởng **+0.08★ Vệ Sinh**.
  * **Dưới 60%**: Hết giờ, dầu giữ nguyên tình trạng cũ.
* **Web Audio Synth Độc Quyền**: Tiếng vợt lưới cạo sột soạt xèo xèo (`playCrumbCollect`) và hợp âm G-Major trong trẻo (`playOilFilterSuccess`).
* **Tích Hợp Vào Báo Cáo Sổ Sách Ngày (`SummaryModal`)**: Nút kêu gọi hành động `[🧹 BẮT ĐẦU VỚT CẶN DẦU (15 Giây)]` với huy hiệu `TIẾT KIỆM 150K`, tự động chuyển sang `ĐÃ VỆ SINH CHẢO` sau khi hoàn thành. Giúp người chơi chủ động tránh án phạt 200.000đ của Quản Lý Thị Trường hoặc kết cục Game Over 3 Strikes vào tù.

### 🍲 2. Minigame Nấu Sốt Bí Truyền Hẻm 1102 (The Secret Sauce)
* **Bộ 5 Gia Vị Tuyển Chọn**: Tỏi Lý Sơn, Mật Ong Tràm, Ớt Bay, Tương Đen, Mè Rang.
* **Cơ Chế Ghi Nhớ Nêm Nếm**: Cuộn giấy bí kíp mở ra trong 3.5s với công thức 4 bước ngẫu nhiên. Người chơi chạm nêm các hũ gia vị vào nồi sốt đang sôi.
* **Buff Vàng Ca Bán**: Mở khóa danh hiệu **SỐT THẦN THÁNH**, tặng ngay **+3.000đ Tip** cho mỗi đơn hàng có món gà sốt và bảo hộ **+0.25★ Hương Vị** cuối ngày.

---

## 🍲 [v2.2.0] — Tinh Hoa Sốt Bí Truyền (28/09/2026)
* Ra mắt minigame Pha Nước Sốt Bí Truyền tại Bảng Kế Hoạch Ca Bán.
* Tích hợp âm thanh nêm nếm Web Audio và hiệu ứng nồi sốt sủi bọt hoàng kim.
* Hệ thống Dashboard Bảng Tin In-Game cập nhật phiên bản trực quan.

---

## 💥 [v2.1.0] — Đại Bản Doanh Hẻm 1102 (28/09/2026)
* **Pháp Lý ATVSTP 3 Strikes**: Công An & Quản Lý Thị Trường kiểm tra dầu đen (Lần 1: Cảnh cáo $\rightarrow$ Lần 2: Phạt 200k $\rightarrow$ Lần 3: Game Over vào tù Ending 3C).
* **Sự Kiện Đòi Nợ & Mặt Bằng Ngày 8+**: Giang hồ dằn mặt, giảm 30% khách hàng nếu không nộp tiền thuê.
* **Đánh Giá Realtime 1-5★**: Cập nhật trực tiếp sau từng lượt phục vụ khách, phản hồi đánh giá 2 chiều có Bác Ba cố vấn mách nước.
* **Khách Sộp VIP (Big Spender)**: Thẻ viền mạ vàng, chịu chi tip khủng 30k-150k+.
* **Đồng Bộ Kho FIFO Chuẩn Xác**: Sửa lỗi trừ chéo nguyên liệu và tiêu hủy hàng hết hạn thực tế.

---

## 🧪 KIỂM ĐỊNH KỸ THUẬT
* **Vitest Suite**: 45/45 test files PASS (462/462 tests PASS 100%).
* **TypeScript & Vite**: 0 lỗi type check, build bundle < 1.5s.
* **Headless UI Check**: 16/16 checks PASS 100% trên cả 2 chuẩn viewport 360px & 390px (0 tràn ngang, 0 lỗi JS console).
