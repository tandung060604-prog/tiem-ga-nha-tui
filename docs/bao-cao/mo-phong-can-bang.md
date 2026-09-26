# Mô phỏng cân bằng — 26/09/2026

Công cụ: `npm run sim -- --days 60 --seeds 12` ([scripts/balance-sim.ts](../../scripts/balance-sim.ts)). Người chơi ảo chơi bằng đúng luật của game (`src/core/*`, gồm [core/day.ts](../../src/core/day.ts) vừa tách từ `main.ts`), 12 lượt × 60 ngày × 3 mức kỹ năng × 2 cách chơi, chạy ~7 giây.

| Mức | Thời gian giữa 2 thao tác | Độ lệch khi nhấc gà | Làm trước cho khách thứ 2 |
|---|---|---|---|
| Giỏi | 0,45s | ±0,24s | có |
| Trung bình | 0,8s | ±0,48s | không |
| Vụng | 1,3s | ±0,78s | không |

"Có nâng cấp": mỗi sáng mua cấp tiếp theo của Marketing/Bếp/Vận hành/Không gian nếu giá ≤ 30% tiền đang có. Nhập hàng đủ cho số khách dự kiến; thay dầu khi dầu ngả màu.

## Kết quả (trung vị ngày qua Chương 1; GDD: ngày 15)

| | Giỏi | Trung bình | Vụng |
|---|---|---|---|
| Trước (khách nền Ch.1 = 16), không nâng cấp | 9 | 9 | 11 |
| **Sau (khách nền Ch.1 = 12)**, không nâng cấp | **10** | **11** | **14** |
| **Sau**, có nâng cấp | **15** | **16** | **21** |

Lãi trung bình 15 ngày đầu (sau chỉnh): 0,28–0,47 triệu/ngày; khách bỏ về 0,2–0,6/ngày; 12/12 lượt đều qua Chương 1.

Đã đổi: `EconomyEngine` khách nền Chương 1 16 → 12 ([economy.ts](../../src/core/economy.ts)).

## Vấn đề thiết kế còn lại (không chỉnh bằng số được)

1. **Kỹ năng ít ảnh hưởng**: người giỏi (98% Perfect) chỉ nhanh hơn người trung bình (85%) 1 ngày. Cả hai phục vụ gần hết khách, nên giới hạn là số khách chứ không phải tay nghề. → Bước 3 (cảm giác chơi): chuỗi Perfect nhân tip, giờ cao điểm dồn khách hơn, khách khó tính chỉ nhận Perfect.
2. **Nâng cấp làm chậm qua chương** (16 so với 11 ngày): điều kiện qua chương là *giữ* đủ tiền, nên đầu tư bị phạt. → Bước 2: qua chương bằng nút "Đặt cọc mặt bằng" (trả tiền một lần), và có thể tính mục tiêu theo lãi tích lũy.
3. Chương 2 (30 triệu): người trung bình không nâng cấp qua ở ~ngày 57 (GDD: ngày 50); có nâng cấp thì > 60. Chỉnh sau khi làm xong bước 2, vì cơ chế đặt cọc sẽ đổi lại toàn bộ đường tiền.
