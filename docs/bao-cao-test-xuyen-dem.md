# BÁO CÁO TEST XUYÊN ĐÊM (ENDURANCE MONKEY TEST REPORT)
*Thời gian chạy:* 17:29:00 2/10/2026
*Thời lượng treo máy:* 386 phút
*Số ngày chơi hoàn thành:* 200 ngày
*Tổng số thao tác UI mô phỏng:* 69,631 thao tác
*Số lượng DOM Nodes trung bình:* 568 nodes

---

## 1. TỔNG KẾT CHỈ SỐ SỨC KHỎE SẢN PHẨM (HEALTH MATRIX)
| Hạng mục kiểm tra | Kết quả | Đánh giá |
|---|---|---|
| **JavaScript Unhandled Errors** | **2** lỗi | 🔴 CẦN XỬ LÝ |
| **Console Runtime Errors** | **0** cảnh báo | 🟢 SẠCH SẼ |
| **UI Deadlocks / Freeze** | **0** lần kẹt | 🟢 100% THÔNG SUỐT |
| **Tràn ngang màn hình (Horizontal Overflow)** | **0** lần | 🟢 KHỚP 100% 360px & 390px |
| **Rò rỉ DOM (DOM Node Leak)** | Đỉnh: 617 nodes | 🟢 ỔN ĐỊNH (< 800 nodes) |

---

## 2. CHI TIẾT CÁC LỖI GHI NHẬN (NẾU CÓ)
- **[Ngày 87] [pageerror]:** `ReferenceError: renderStaffCornerCard is not defined
    at renderSellingView (http://localhost:3000/src/ui/components/SellingView.ts?t=1790924777073:858:38)
    at AppController.render (http://localhost:3000/src/main.ts?t=1790924777073:1301:32)
    at AppController.resumeShift (http://localhost:3000/src/main.ts?t=1790924777073:1801:10)
    at start (http://localhost:3000/src/main.ts?t=1790924777073:271:14)
    at document.getElementById.onclick (http://localhost:3000/src/main.ts?t=1790924777073:284:63)` (Ảnh: `logs/screenshots/pageerror-1790924779278.png`)
- **[Ngày 113] [pageerror]:** `ReferenceError: prepStationKey is not defined
    at sellingStructureKey (http://localhost:3000/src/ui/components/SellingView.ts?t=1790927531435:213:5)
    at AppController.render (http://localhost:3000/src/main.ts?t=1790927531435:1322:19)
    at AppController.resumeShift (http://localhost:3000/src/main.ts?t=1790927531435:1825:10)
    at start (http://localhost:3000/src/main.ts?t=1790927531435:274:14)
    at document.getElementById.onclick (http://localhost:3000/src/main.ts?t=1790927531435:287:63)
    at eval (eval at evaluate (:311:30), <anonymous>:31:53)
    at UtilityScript.evaluate (<anonymous>:313:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)` (Ảnh: `logs/screenshots/pageerror-1790927535632.png`)

---

## 3. LỊCH SỬ KẸT GIAO DIỆN / DEADLOCK (NẾU CÓ)
✨ **Toàn bộ các Modal, Minigames và Chuyển Cảnh đóng mở mượt mà 100%!**
