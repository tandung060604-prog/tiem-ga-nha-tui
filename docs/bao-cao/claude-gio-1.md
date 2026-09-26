# Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)

Xong việc lúc 15:05, sớm hơn mốc 15:35. Phạm vi: chỉ file `.ts`, `tests/`, `scripts/`, `package.json`, `tsconfig.json`, `index.html` (theo [phan-cong.md](../phan-cong.md)).

## Kết quả kiểm chứng cuối giờ

| Kiểm tra | Kết quả |
|---|---|
| `tsc --noEmit` (đã bật thêm `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`) | 0 lỗi |
| `npm test` | **32/32** qua (đầu giờ: 13) |
| `npm run build` | sạch |
| Bấm nút thật trên Chrome (Playwright, khung 390px, tap + click) | **6/6** thao tác ăn (đầu giờ: 0/60) |
| Số lần màn bán hàng bị dựng lại khi rảnh, 3 giây | **0** (đầu giờ: ~180) |
| Chơi trọn 1 ngày, đối chiếu ví với sổ sách | khớp từng đồng (850k → +42k giao món → −25k điện nước = 867k) |
| Tải save cũ (thiếu lô kho, thiếu 9 nguyên liệu, dở ca bán) | giữ 2.500.000đ + ngày 6, tự bổ sung phần thiếu, về pha Chuẩn bị |
| Tải save hỏng (JSON cụt) | không crash, bản gốc được sao lưu, tạo game mới |

## Đã làm

**1. Hết lỗi "bấm không ăn" (việc chính)**
- Màn bán hàng chỉ dựng lại HTML khi cấu trúc đổi (khách đến/đi, món vào/ra khay, chảo bật/tắt); mỗi frame chỉ vá đồng hồ, thanh kiên nhẫn, kim đo, gợi ý chảo ([SellingView.ts](../../src/ui/components/SellingView.ts)).
- Một listener click duy nhất trên `#main-view`, bảng hành động có kiểu chặt + `assertNever` ([main.ts](../../src/main.ts)). Trước đây mỗi frame gắn lại listener và đọc `state` cũ bị bắt trong closure (ví dụ nút Thay dầu kiểm tra tiền theo số dư lúc render).
- Header chỉ vẽ lại khi nội dung đổi.

**2. Lỗi vòng lặp**
- Ngày 1: vòng `requestAnimationFrame` bị khởi động 2 lần; ngày 2+: frame đầu vẽ phiên bán của hôm qua. Đã sửa thứ tự trong `setPhase` và luôn dừng vòng cũ trước khi mở vòng mới.
- **Tua nhanh làm chảo chín nhanh gấp 6,25 lần thay vì 2,5** (nhân tốc độ 2 lần). Đã sửa, gỡ `setSpeedMultiplier`.
- **Quay lại app sau vài phút → cả hàng khách bỏ về, ngày kết thúc ngay** (delta frame không giới hạn). Giờ mỗi frame tối đa 250ms.

**3. Lưu game**: gom ghi `localStorage` tối đa 1 lần/500ms, ghi ngay khi đổi pha / rời trang / chuyển app ([state.ts](../../src/core/state.ts)). Đọc save qua `migrateSave`: giữ trường hợp lệ, sửa trường hỏng, bổ sung nguyên liệu/món mới của bản cập nhật, sao lưu save không đọc được thay vì xóa âm thầm.

**4. Bỏ `alert()` / `confirm()`**: màn "Mở khóa chương" và hộp xác nhận trong game. Gỡ nút 🔄 xóa save khỏi header (nằm sát nút Cài đặt, dễ bấm nhầm); chơi lại vẫn có trong Cài đặt, có xác nhận.

**5. Số khách và sự kiện có tác dụng thật**
- Số khách/ngày = khách nền × sao × marketing × sự kiện (hàm có sẵn nhưng trước đây không được gọi). Bảng phấn hiện "dự kiến ~N khách".
- Mưa/bóng đá/nắng nóng đổi số khách, tỉ lệ đơn app, giá; **kiểm tra vệ sinh**: dầu đen phạt 200.000đ + trừ 0,3 sao Vệ sinh, dầu sạch +0,2 sao; dòng "Phạt" hiện trong sổ.
- **Ca bán dài ~4 phút thật** (trước ~54 giây) theo GDD 4–5 phút. Đây là thay đổi cân bằng; muốn đổi chỉ sửa `EconomyEngine.GAME_HOUR_MS`.

**6. Kiến trúc type-safe**
- Tách mô phỏng ca bán ra [core/sellingSim.ts](../../src/core/sellingSim.ts) (không DOM, không âm thanh): chạy trọn 1 ngày trong test mất vài ms → nền cho balance-sim.
- [core/rng.ts](../../src/core/rng.ts): RNG có seed + `pick()`; mọi ngẫu nhiên gameplay đi qua đây; test xác nhận cùng seed → cùng chuỗi khách (nền cho Thử thách ngày).
- `NonEmpty<T>` cho danh sách content; sửa 75 chỗ truy cập mảng/object có thể `undefined` (một số là lỗi thật, ví dụ bunny order crash nếu menu thiếu món).

**7. Công cụ `npm run ui:check`** ([scripts/ui-check.mjs](../../scripts/ui-check.mjs)): Chrome headless ở 360/390px, kiểm tra tràn ngang (kể cả hàng 5 khách), thanh đo khớp ngưỡng code, món trong khay nhìn thấy được, nút bấm ăn, nút ≥ 44px, lỗi console. Dùng để nghiệm thu CSS khách quan cho cả hai bên.

**Khác**: thêm favicon (hết 404), `playwright-core` + `vitest@5` là devDependency (0 lỗ hổng).

## Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

| Gemini báo | Kiểm chứng của Claude |
|---|---|
| R1/R2/R3/R7: không tràn ngang | **Đúng.** `ui:check`: hàng 5 khách vẫn gọn trong 360px |
| R4: thanh đo 5 vùng đúng tỉ lệ | **Chưa đúng.** CSS dùng `.zone-good:first-of-type` / `:last-of-type`; `:first-of-type` xét loại thẻ (`div`) nên không bao giờ khớp → vùng "Vừa" rộng 0, các vùng khác 48/27/25%. Người chơi sẽ thấy vùng Perfect lệch với thời điểm thật. Sửa: một rule `.zone-good { width: 10% }` (đã ghi ở phan-cong.md) |
| Bật lại `popIn` cho khay | Đúng, món trong khay vẫn nhìn thấy (`opacity` 1) |
| CSS cho `.confirm-dialog`, `.chapter-unlocked` | Có trong CSS; chưa kiểm tra bằng mắt |
| Đã có 4 file asset | Đúng là có 4 file, **chất lượng hình tốt, đúng phong cách**, nhưng chưa dùng thẳng được: không nền trong suốt, 1024px thay vì 256/512px, sheet Gà Bông có chữ "FRONT VIEW…", 4/~30 file. Gemini đã nói rõ lý do (công cụ không tách nền được) |
| Nút ≥ 44px | Chưa làm: `ui:check` WARN — nút tua 54×21, nút Gà/Khoai/Nước cao 26, Thay dầu cao 17 |

## Cần bạn quyết

1. **Tách nền ảnh**: mình có thể viết script trong `scripts/` tự tách nền trắng + thu về đúng kích thước từ ảnh Gemini tạo (ảnh nền trắng phẳng, nét viền rõ nên tách tự động được khá tốt). Có làm không?
2. **Ca bán 4 phút** (theo GDD) hay giữ ~1 phút như trước?
3. **Hiệu ứng nâng cấp Bếp/Vận hành** vẫn chưa có tác dụng. Mô tả hiện ghi "tăng tốc độ chiên 35%", nhưng làm đúng nghĩa đen thì vùng Perfect ngắn lại (khó hơn). Cần chọn: nâng cấp làm tăng kiên nhẫn khách, hay giữ số khách/lãi, hay thêm giỏ chiên thứ 2?
4. **OmniRoute**: vẫn chờ bạn chọn (không cài / dùng OpenRouter cho Jev / vẫn cài).
5. Chưa commit gì (repo git gốc là cả `D:/AI Vin Thực Chiến`).

## Bổ sung sau giờ 1 (theo quyết định của chủ dự án, xong 16:17)

- **Đồng hồ 10:00 → 21:00 trong đúng 4 phút thật**; mọi hằng số giờ giấc gom vào [core/clock.ts](../../src/core/clock.ts).
- **Cuối tuần đông khách**: Ngày 1 = Thứ Hai; Thứ Bảy/Chủ Nhật ×1,4 khách; bảng phấn hiện thứ trong tuần và "🎉 Cuối tuần đông khách".
- **Nâng cấp có tác dụng thật** ([core/upgrades.ts](../../src/core/upgrades.ts)), mô tả trong game sửa cho đúng:
  bếp tăng tốc = gà lên vàng nhanh hơn nhưng vùng Perfect giữ nguyên độ dài; tủ giữ nóng/nồi áp suất = sao Hương vị tăng nhanh, tụt chậm; lọc dầu = dầu bền hơn; bếp cấp 6 = tự nhấc giỏ ở giữa vùng Perfect; POS/kiosk = khách chờ lâu hơn; marketing/app/không gian = thêm khách. Mỗi chỉ số lấy mức cao nhất trong nhánh (không cộng dồn).
- **Script `npm run assets`** ([scripts/process-assets.mjs](../../scripts/process-assets.mjs)): tách nền trắng bằng cách loang từ mép (giữ phần trắng bên trong nhân vật), cắt sheet thành từng hình theo thứ tự đọc, bỏ chữ/chấm trang trí, thu về kích thước chuẩn. 4 ảnh Gemini → 14 PNG trong suốt (22–134KB mỗi file, ảnh gốc ~400KB). Đã dùng trong game: Gà Bông ở màn chào, gà giòn trong khay, Thỏ Cam ở thẻ khách/hộp thoại.
- **OmniRoute: không cài** (Jev đã chạy trực tiếp bằng SDK chính thức; OmniRoute đổi đường đi của chính Claude Code qua proxy bên thứ ba).
- Test: **57/57**; build sạch; chơi trọn 1 ngày tiền khớp sổ sách; `ui:check` chỉ còn lỗi CSS thanh đo (phần Gemini).
