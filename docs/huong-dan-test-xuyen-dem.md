# 🌙 HƯỚNG DẪN BÀI TEST XUYÊN ĐÊM TREO MÁY CHECK BUG (TIỆM GÀ NHÀ TUI)

Hệ thống kiểm thử xuyên đêm (Overnight Endurance & Chaos Testing Suite) được thiết kế đặc thù cho game mô phỏng quản lý web mobile **Tiệm Gà Nhà Tui**, cho phép bạn **cắm máy đi ngủ hoặc treo máy nhiều giờ** để tự động quét 100% bug logic, rò rỉ bộ nhớ, lỗi màn hình và kẹt giao diện (deadlock).

---

## 1. HAI TẦNG KIỂM THỬ XUYÊN ĐÊM

### 🔹 Tầng 1: Deep Core Math & State Invariants Stress Test (`npm run test:core-stress`)
- **Tốc độ cực cao:** Mô phỏng từ **5.000 đến 100.000 ngày chơi** chỉ trong vài phút (200 - 750 ngày/giây).
- **Phạm vi kiểm toán liên tục:**
  1. **Tiền & Kinh tế:** Quét lỗi `NaN`, `Infinity`, âm tiền bất hợp pháp không qua cơ chế cứu trợ.
  2. **Kho hàng FIFO theo lô:** Kiểm tra từng lô hàng có bị ngày âm, rò rỉ lô rỗng, hỏng logic khấu trừ khi bán hay không.
  3. **Tâm trạng nhân viên:** Luôn nằm trong giới hạn 0 - 100%, không bị tràn số khi ca làm kéo dài.
  4. **Điểm Karma & Cốt truyện:** 3 chỉ số ngầm (`community`, `craftsmanship`, `ambition`) tiến hóa hợp lệ theo quyết định sự cố.
  5. **Mã Lưu Trữ (SaveCode Base64):** Sau mỗi 100 ngày chơi, tự động xuất mã lưu và giải mã khôi phục (`importSaveCode`), đối soát độ toàn vẹn dữ liệu 100%.
  6. **Rò rỉ RAM (Memory Leak):** Giám sát `process.memoryUsage().heapUsed` qua từng chu kỳ 1.000 ngày.

> 🛠️ **Bug thực tế đã phát hiện & khắc phục ngay trong đợt test:**  
> Hàm [`closeDay()`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/src/core/day.ts) bị crash khi gọi mà không truyền tham số `event` (`Cannot read properties of undefined (reading 'effect')`). Đã bổ sung fallback an toàn: `const activeEvent = event ?? eventForDay(draft.day)`.

---

### 🔹 Tầng 2: Browser Chaos Monkey End-to-End Test (`npm run test:monkey`)
- **Tự động lái trình duyệt Chrome (Playwright Mobile 360x800):**
  - Vượt qua màn Title Screen, đặt tên tiệm, đóng thông báo chào mừng.
  - Tự động nhập nguyên liệu (thịt gà tươi, bột, dầu), nâng cấp tiệm.
  - Bấm mở bán hàng ngày, bật tốc độ 2x (`#btn-toggle-fast`).
  - Thả gà rán, canh lửa vớt chảo, rót nước 3 vị, xịt tương, phục vụ khách theo hàng đợi FIFO.
  - Tự động giải quyết các tình huống Minigames: Lọc Dầu Chợ Lớn, Mặc Cả Chợ Đầu Mối, Sốt Bí Truyền, Giao Hàng Xa.
  - Trả lời đánh giá khách hàng (Review Reply), nộp tiền mặt bằng cuối tuần (Rent).
  - Tự động chốt ngày ở Summary Modal và chuyển sang ngày kế tiếp.
- **Giám sát & Báo động:**
  - 💥 **Unhandled Page Exceptions (`pageerror`):** Bắt ngay lập tức và tự động chụp ảnh màn hình vào `logs/screenshots/`.
  - ⚠️ **Console Runtime Errors:** Lưu toàn bộ log lỗi trình duyệt vào `logs/overnight-browser-monkey.log`.
  - 🛑 **UI Deadlock Watchdog:** Nếu quá 25 giây giao diện không có thao tác thành công (do modal kẹt hoặc nút bị che khuất), hệ thống tự chụp ảnh bằng chứng và kích hoạt cơ chế Emergency Recovery để tiếp tục chạy xuyên đêm.
  - 📐 **Kiểm tra tràn ngang:** Phát hiện lỗi vỡ layout mobile trên màn 360px & 390px.
  - 📈 **Đo rò rỉ DOM Nodes:** Đếm tổng số DOM nodes sau mỗi ngày chơi để cảnh báo hiện tượng phình to DOM tree.

---

## 2. CÁCH SỬ DỤNG (3 CÁCH KHỞI ĐỘNG)

### Cách 1: Click đúp tệp Windows Batch (Khuyên Dùng khi treo máy đi ngủ)
- Click đúp vào tệp tin [`run-overnight.bat`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/run-overnight.bat) trong thư mục gốc dự án.
- Cửa sổ sẽ hỏi bạn muốn cắm máy mấy tiếng (mặc định: 8 tiếng).
- Nhập số giờ (ví dụ `8` hoặc nhấn Enter) ➔ Script sẽ tự động chạy toàn diện cả Core Stress và Browser Monkey.

### Cách 2: Chạy Master Runner qua npm
```bash
# Treo máy mặc định 8 tiếng
npm run test:overnight

# Hoặc chỉ định số giờ và số ngày
npm run test:overnight -- --hours=6 --days=300

# Chạy có hiển thị giao diện Chrome thật (Headed) để vừa ngồi xem vừa quan sát:
npm run test:overnight -- --mode=browser --headless=false
```

### Cách 3: Chạy độc lập từng phần
```bash
# 1. Chạy bài test thuật toán kinh tế & bất biến dữ liệu (5.000 ngày trong 15s):
npm run test:core-stress

# 2. Chạy bài test giao diện Chrome tự động:
npm run test:monkey -- --days=50 --headless=true
```

---

## 3. BÁO CÁO & DỮ LIỆU KẾT QUẢ
- **File báo cáo tổng hợp Markdown:** [`docs/bao-cao-test-xuyen-dem.md`](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/bao-cao-test-xuyen-dem.md)
- **File log chi tiết trình duyệt:** `logs/overnight-browser-monkey.log`
- **File log chi tiết logic lõi:** `logs/overnight-core-stress.log`
- **Thư mục ảnh chụp bằng chứng khi gặp sự cố:** `logs/screenshots/` *(Đã được thêm vào `.gitignore` để không gây nặng repository)*
