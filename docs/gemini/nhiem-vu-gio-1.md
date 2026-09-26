# Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)

> Đọc trước: [../phan-cong.md](../phan-cong.md) (ranh giới file), [brief-giao-dien.md](brief-giao-dien.md), [brief-asset.md](brief-asset.md).
> Bạn chỉ sửa: `src/styles/*.css`, `public/assets/**`, `docs/gemini/**`. **Không sửa file `.ts`, `index.html`, `package.json`.**
> Ảnh màn hình hiện tại (khung 390px): `screenshots/ban-hang-390px.png`, `screenshots/tong-ket-390px.png`.

Làm theo thứ tự ưu tiên. Hết giờ mà chưa xong thì dừng và ghi rõ trong báo cáo.

## Việc 1 — Tạo file ảnh thật cho Đợt 1 (ưu tiên cao nhất)

Lần bàn giao trước chỉ có prompt trong `asset-notes.md`, **chưa có file ảnh nào** trong `public/assets/`. Giờ này cần file PNG thật, đúng tên và kích thước trong `brief-asset.md`, đặt tại:

| Thư mục | File cần có |
|---|---|
| `public/assets/mascot/` | `mascot_gabong_vui.png`, `_khoc`, `_xiu`, `_on_ap`, `_hoang`, `_ngai` (512×512) |
| `public/assets/food/` | `food_crispy_chicken_perfect.png`, `_raw`, `_burnt`, `food_shake_fries.png`, `food_soda.png` (256×256) |
| `public/assets/kitchen/` | `kitchen_pan_empty.png`, `kitchen_oil_clean.png`, `_medium`, `_dirty` (512×512) |
| `public/assets/icons/` | 15 icon trong mục 4.5 của brief (128×128) |

- PNG nền trong suốt. Nếu công cụ của bạn **không ghi được file ảnh vào repo**, nói thẳng điều đó trong báo cáo (đừng chỉ ghi prompt rồi coi là xong).
- Thỏ Cam: theo quyết định của chủ dự án, **được phép giữ phong cách hiện tại** (dòng cấm Miffy trong `brief-asset.md` không còn hiệu lực). Không cần làm ảnh Thỏ Cam trong giờ này.

## Việc 2 — Đưa `design-tokens.css` + `components.css` vào game

Gộp vào các file đang được nạp, **không thêm file CSS mới** (thêm file cần sửa `index.html`, là file của Claude):
- Token → `src/styles/variables.css`
- Component → `main.css`, `kitchen.css`, `customers.css`, `share.css` theo đúng nhóm hiện tại.

### Ràng buộc bắt buộc (đã gây lỗi thật, Claude vừa sửa, bản `components.css` của bạn đang làm hỏng lại)

| # | Quy tắc | Lý do |
|---|---|---|
| R1 | `.app` phải có `width: 100%` (kèm `max-width`, `margin: 0 auto`) và `min-width: 0` | `margin: auto` trong flex cột làm `.app` rộng theo nội dung → khi có 3 khách, cả màn rộng 557px, cột Khay và nút GIAO tràn khỏi màn 390px |
| R2 | `.main-view` và `.selling-screen` có `min-width: 0` | Cùng lỗi trên |
| R3 | Mọi lưới 2 cột dùng `repeat(2, minmax(0, 1fr))` (hoặc `minmax(0, 1.15fr) minmax(0, 0.85fr)`), không dùng `1fr 1fr` trần | `1fr` không co nhỏ hơn nội dung → tràn |
| R4 | Thanh đo có **5 vùng** theo thứ tự `.zone-raw` 38%, `.zone-good` 10%, `.zone-perfect` 22%, `.zone-good` 10%, `.zone-burnt` 20% | Khớp ngưỡng trong code (`CookingEngine.ZONES`). Bản của bạn 45/15/20/20 sẽ làm người chơi nhấc sai thời điểm |
| R5 | Nhãn chất lượng khay có 4 class: `.t-quality.raw` (CÒN SỐNG), `.good` (VỪA CHÍN / ƯỚP LẠNH), `.perfect`, `.burnt` | `.raw` là class mới |
| R6 | Không đặt `animation` bắt đầu bằng `opacity: 0` cho phần tử bên trong `.selling-screen` cho tới khi `phan-cong.md` ghi "Render cục bộ: XONG" | Màn bán hàng hiện dựng lại DOM mỗi frame → animation kẹt ở khung đầu → phần tử vô hình (đã xảy ra với món trong khay) |
| R7 | `.selling-screen` không dùng `height: 100vh` | Nó nằm dưới header + mái hiên; 100vh làm quầy bếp bị đẩy khỏi màn hình |

### Lỗi hình ảnh cần sửa (xem `screenshots/ban-hang-390px.png`)
1. Header ở 390px: dãy sao đè lên huy hiệu tên tiệm; chữ "Ngày 1" xuống 2 dòng.
2. Nhãn "SỐNG / VÀNG GIÒN (PERFECT) / CHÁY" không thẳng hàng với vùng màu trên thanh đo, "VÀNG GIÒN (PERFECT)" xuống dòng.
3. `.tray-slots`: ô trái rộng, ô phải hẹp (lưới không đều).
4. Tiêu đề "Chảo Chiên" và "Dầu: Vàng óng" xuống dòng lộn xộn trong thẻ 178px.
5. Khoảng trống nâu rất lớn bên dưới quầy (từ ~55% màn trở xuống): quầy nên chiếm hết phần dưới.

Kiểm tra ở 2 bề rộng: **360px** và **390px**. Không được có thanh cuộn ngang.

## Việc 3 — Báo cáo (10 phút cuối)

Ghi `docs/gemini/bao-cao-gio-1.md`:
- Danh sách file đã tạo/sửa (đường dẫn đầy đủ).
- Việc nào xong, việc nào chưa, vì sao.
- Mọi yêu cầu đổi markup cần Claude làm → chép sang `yeu-cau-markup.md`.
- Không tự đánh giá "hoàn hảo/xuất sắc"; chỉ ghi điều kiểm chứng được (ví dụ: "đã mở ở 360px, không có cuộn ngang").
