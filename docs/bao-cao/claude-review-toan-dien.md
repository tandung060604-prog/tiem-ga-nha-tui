# Review toàn diện & sửa lỗi — 26/09/2026 (tối)

Phạm vi: toàn bộ việc 3 Gemini đã làm (commit `02d8af8`, `ec317a6`, `f0e1705`) + yêu cầu mới: iOS, gameplay, truyện mở dần, Jev, chất game (âm thanh/tiếng), chống gian lận, deploy.

> Ghi chú kiểm toán: dòng 18:20 trong `docs/phan-cong.md` ký "Claude (Lead & Auditor) … SPRINT DONE 100%" không do phiên Claude Code này viết. Bản review này là kiểm toán độc lập.

## Lỗi nghiêm trọng đã sửa

| # | Lỗi | Hậu quả | Sửa |
|---|---|---|---|
| 1 | Nút hoàn vốn −5 hoàn nguyên giá **mọi** hàng trong kho | Ngày 1 bấm là có ~530k miễn phí (hàng tặng); hàng sắp hết hạn cũng hoàn → "mua dư là lỗ" mất tác dụng | Chỉ đổi trả **hàng mua hôm nay, chưa qua đêm, đúng giá đã trả** ([core/inventory.ts](../../src/core/inventory.ts)) |
| 2 | Game **kết thúc ở ngày 25** bất kể chương | Người chơi đang ở Chương 2 bị cắt ngang, nhận kết thúc "Bình dị" | 4 kết thúc lớn chỉ mở ở **đỉnh Chương 5** (nút "Dự lễ Gà Vàng"); phá sản = âm quỹ **3 ngày liền** ([content/endings.ts](../../src/content/endings.ts)) |
| 3 | Mọi ảnh trên trang live **404** | Người chơi thấy ảnh vỡ | Đường dẫn ảnh theo `BASE_URL` của Vite ([content/assets.ts](../../src/content/assets.ts)) |
| 4 | Bác Ba tiếp tế **không giới hạn** | Hết tiền → bấm mở bán → +150k mãi | 1 lần mỗi chương |
| 5 | Đặt cọc lấy **100%** tiền quỹ | Mô phỏng: sang Chương 2 còn ~360k, không đủ vốn nhập hàng → khách bỏ về → phá sản | Cần đủ quỹ, chỉ trả **70%**, 30% giữ làm vốn |
| 6 | Máy không có Web Audio → **kẹt ở màn tiêu đề** | Không vào được game | Âm thanh tự im lặng; vào game trước, bật âm thanh sau |
| 7 | Mở khóa hợp đồng thất bại vẫn báo "Đã ký" | Người chơi hiểu nhầm | Báo đúng lý do; ký + trừ tiền trong một hàm |

## Truyện mở dần (không soi trước được)

- Hồi chưa mở chỉ hiện "Hồi N · ???" (trước: lộ tên biến cố chương 4 ngay từ chương 1).
- Mỗi hồi **hé mở từng đoạn** theo tiến độ gom tiền cọc của chương; lựa chọn quyết định chỉ xuất hiện khi đọc hết (chặn cả ở tầng logic).
- Ẩn điểm karma trên nút lựa chọn và thanh karma; hệ quả chỉ lộ ở kết thúc.
- Bỏ nút "Xem Vận Mệnh" (xem được kết thúc + điều kiện từ ngày 1) → "Kết thúc đã đạt (n/5)": chỉ xem lại cái đã trải qua.
- **Jev** kiểm tra 23 đoạn truyện: 2 đoạn Chương 4 lộ chuyện Chương 5 → đã viết lại → **0/23** ([báo cáo Jev](jev-content-report.md)).
- Giới hạn trung thực: game là trang tĩnh, người rành kỹ thuật vẫn đọc được mã nguồn; chặn tuyệt đối cần máy chủ.

## Gameplay (đo bằng `npm run sim`)

- **Chuỗi Perfect**: mỗi mẻ Perfect liền nhau tăng tip, tối đa ×3; mẻ không Perfect → về 0. Ngày 30: giỏi 11,6tr / trung bình 7,8tr / vụng 3,5tr (trước: chênh ~5%).
- Khách không gọi món có nguyên liệu chưa ký hợp đồng (Gemini đã làm; thêm test chặn tái phát).
- Còn mở: Chương 1 hơi nhanh (giỏi/trung bình qua ở ngày 8–9, GDD ~15); Chương 2 > 60 ngày vì mô phỏng chưa biết ký hợp đồng sốt/nâng cấp. Cần dạy người chơi ảo các hành động đó trước khi chỉnh số.

## Jev

Dùng ở khâu làm nội dung (`npm run jev:content`), không gọi từ trình duyệt (sẽ lộ API key):
- Chống lộ truyện (ở trên).
- Chấm độ hài 30 mẫu review GenZ → game ưu tiên câu hài hơn; lọc câu phản cảm (0 câu); 1 câu có thể gắn nhầm tiêu chí (giữ nguyên sau khi xem).

## Chất game: âm thanh, tiếng

- **Màn tiêu đề** (logo Gà Bông, Chơi tiếp / Chơi mới / Nhạc) — cũng là chạm đầu tiên để iOS cho phát âm thanh.
- **Nhạc nền tự sinh** (Web Audio, không tải file): êm lúc chuẩn bị, nhanh hơn lúc bán; bật/tắt riêng trong Cài đặt.
- **Giọng nhân vật "líu lo"** (Thỏ Cam cao, Bác Ba trầm, khách thường) khi nói.
- **Nghe đọc truyện** bằng giọng tiếng Việt của máy (iPhone có sẵn).

## iOS

- `npm run ios:check`: WebKit (engine của Safari) với iPhone SE / 13 / 15 Pro Max → **18/18 PASS** (tiêu đề, chạm, ảnh, không cuộn ngang, không lỗi).
- Thêm vào Màn hình chính: icon Gà Bông, mở toàn màn (manifest + meta Apple).
- Chặn phóng to 2 ngón / double-tap, chặn kéo nảy trang, ô nhập ≥16px, nút dùng đúng phông (Safari hiện Times), build tương thích Safari 14+.

## Chống gian lận

Trang tĩnh không chặn tuyệt đối được; mục tiêu là phát hiện + hậu quả ([core/integrity.ts](../../src/core/integrity.ts)):
- Chữ ký cho save → sửa localStorage là bị phát hiện.
- Kiểm tra sổ sách sau mỗi ngày và khi tải: tiền ≤ vốn + doanh thu + thưởng; chương chỉ mở bằng đặt cọc; số liệu chiên/sao hợp lý; thư/kết thúc hợp lệ.
- Bị gắn cờ: vẫn chơi, có cảnh báo trong Cài đặt, không được công nhận kết thúc Viên mãn / Bí mật; cờ không tẩy được.
- Save cũ không bị bắt oan (ước lượng phần thưởng đã nhận).
- Đã vá: hoàn vốn in tiền, Bác Ba vô hạn, frame bị "nhảy" khi quay lại app.

## Kiểm chứng

`tsc` sạch · **166/166 test** (15 file) · build sạch · `ui:check` Chrome 360/390px **tất cả PASS** · `ios:check` WebKit **18/18 PASS** · Jev: 0 đoạn lộ truyện.
