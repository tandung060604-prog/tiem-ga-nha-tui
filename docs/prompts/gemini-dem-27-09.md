# Prompt giao Gemini — đêm 27/09

Dán nguyên khối dưới đây cho Gemini (Antigravity).

```
Bạn là Gemini (ký tên "Gemini" trên docs/phan-cong.md — KHÔNG BAO GIỜ ký "Claude").
Dự án: D:\AI Vin Thực Chiến\Side Project\TiemGaRan. Claude đang làm cùng thư mục, cùng nhánh main.
LUẬT BẮT BUỘC:
- Chỉ sửa: src/styles/**, src/ui/components/** (phần hiển thị), public/assets/**, assets-src/**, docs/gemini/**,
  chữ trong src/content/dailyIncidents.ts. KHÔNG sửa src/core/**, src/types/game.ts, số tiền/giá/khách trong src/content/*.
  Cần dữ liệu/trường mới → ghi đề xuất lên docs/phan-cong.md, Claude sẽ thêm.
- Chỉ `git add <file cụ thể>`; cấm `git add -A`, `git add .`, `--force`, `--no-verify`, `reset --hard`.
- Trước mỗi commit: npx tsc --noEmit, npx vitest run, npm run build, npm run ui:check (preview port 3002, không chạy npm run dev).
  Tất cả PASS mới commit → git push origin main → `gh run list --limit 1` phải success.
- Khóa file trên docs/phan-cong.md trước khi làm, mở khóa + báo cáo (ký "Gemini") khi xong.

VIỆC (làm theo thứ tự, mỗi mục 1 commit):
G0. Hoàn tất khóa lúc 01:05 (giao diện sự cố, Fanta): chạy kiểm tra, commit CHỈ các file của bạn, mở khóa.
G1. Nén ảnh: mọi PNG trong public/assets ≤ 40KB (ảnh 256px) bằng pipeline `npm run assets` (sharp/pngquant),
    xóa public/assets/ui/landing_bg.jpg nếu không dùng, bỏ khỏi src/content/assets.ts; đích public/assets ≤ 4MB.
    Chạy lại test assets.
G2. CSS cho các class Claude đã thêm (hiện đang style inline tạm): .tutorial-layer/.tutorial-bubble/.tutorial-avatar/
    .tutorial-text/.tutorial-actions/.tutorial-target; .staff-strip/.staff-chip(.busy)/.helper-progress;
    .station-strip (lưới 2 cột); tab Nhân viên (hàng đang chật chữ 390px, .staff-effect, .btn-fire);
    .chapter-unlocked-prices; modal sự cố vừa khít 320px. Chuyển style inline trong SellingView/TutorialLayer sang CSS.
G3. Hiệu ứng: số tiền bay lên khi thu tiền, ngọn lửa chuỗi Perfect, bong bóng suy nghĩ trên thẻ khách
    (vui/sốt ruột/sắp bỏ về) — dùng data-* Claude cung cấp ở C4; có @media (prefers-reduced-motion).
G4. Giao diện cảnh truyện: chân dung nhân vật + khung thoại + nút lựa chọn, đọc dữ liệu từ API Claude xuất ở C3.
G5. Mẫu thẻ "Gà Wrapped" 1080×1350 (bố cục, màu, font) dạng HTML/CSS để Claude vẽ canvas ở C5.
    Khi phải chờ Claude (G3/G4/G5): làm mục khác, không tự viết logic thay.
Báo cáo cuối đêm: docs/gemini/bao-cao-dem-27-09.md (việc đã làm, ảnh chụp ui-check-out/, lỗi còn tồn).
```
