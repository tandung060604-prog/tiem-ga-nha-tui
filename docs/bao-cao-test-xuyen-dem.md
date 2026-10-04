# BÁO CÁO TEST XUYÊN ĐÊM (ENDURANCE MONKEY TEST REPORT)
*Thời gian chạy:* 19:54:56 4/10/2026
*Thời lượng treo máy:* 480 phút
*Số ngày chơi hoàn thành:* 119 ngày
*Tổng số thao tác UI mô phỏng:* 182,632 thao tác
*Số lượng DOM Nodes trung bình:* 487 nodes

---

## 1. TỔNG KẾT CHỈ SỐ SỨC KHỎE SẢN PHẨM (HEALTH MATRIX)
| Hạng mục kiểm tra | Kết quả | Đánh giá |
|---|---|---|
| **JavaScript Unhandled Errors** | **1** lỗi | 🔴 CẦN XỬ LÝ |
| **Console Runtime Errors** | **0** cảnh báo | 🟢 SẠCH SẼ |
| **UI Deadlocks / Freeze** | **1** lần kẹt | 🔴 CẦN KIỂM TRA MODAL |
| **Tràn ngang màn hình (Horizontal Overflow)** | **0** lần | 🟢 KHỚP 100% 360px & 390px |
| **Rò rỉ DOM (DOM Node Leak)** | Đỉnh: 651 nodes | 🟢 ỔN ĐỊNH (< 800 nodes) |

---

## 2. CHI TIẾT CÁC LỖI GHI NHẬN (NẾU CÓ)
- **[Ngày 24] [pageerror]:** `ReferenceError: rush is not defined
    at renderSellingView (http://localhost:3000/src/ui/components/SellingView.ts?t=1791094889904:1135:11)
    at AppController.render (http://localhost:3000/src/main.ts?t=1791094889904:1530:32)
    at AppController.resumeShift (http://localhost:3000/src/main.ts?t=1791094889904:2192:10)
    at start (http://localhost:3000/src/main.ts?t=1791094889904:343:14)
    at document.getElementById.onclick (http://localhost:3000/src/main.ts?t=1791094889904:356:63)` (Ảnh: `logs/screenshots/pageerror-1791094891199.png`)

---

## 3. LỊCH SỬ KẸT GIAO DIỆN / DEADLOCK (NẾU CÓ)
- **[Ngày 20]** Kẹt tại thời điểm 2026-10-04T06:04:12.142Z. Ảnh chụp: `logs/screenshots/deadlock-day-20-1791093851973.png`
