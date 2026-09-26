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

---

## Cân bằng lần 2 — đêm 27/09 (Claude)

### Vấn đề
- Từ Chương 2 quán bị **giới hạn bởi sức bếp** (khách dự kiến 80–90, phục vụ 40–60). Hầu hết nâng cấp chỉ "thêm khách" hoặc tăng sao → **không hoàn vốn** (đo bằng `scripts/upgrade-roi.ts`: Máy POS, Tủ Giữ Nóng, Kiosk, Livestream… hoàn vốn > 100 ngày hoặc không bao giờ).
- Commit `510a3e9` tăng giá nâng cấp 35–50% không qua mô phỏng → người chơi trung bình CÓ nâng cấp qua Chương 2 **chậm hơn** không nâng cấp (ngày 85 so với 61).
- Chương 4–5: mặt bằng 1,85tr và 5,45tr/ngày, mục tiêu 250tr và 800tr → không tới được.

### Thay đổi
| | Trước | Sau |
|---|---|---|
| Tác dụng `space` (mọi nhánh) | không dùng | khách trả thêm = tổng / 3 %, tối đa 30% |
| Tác dụng `capacity` (mọi nhánh) | không dùng | +1/+2/+3 ô khay (khay tối đa 7) |
| Bếp cấp 3–4 | chỉ tăng sao | +5% giá; gà lên vàng nhanh 50% (cả giỏ phụ bếp) |
| Bếp cấp 6 (Dây chuyền) | tự nhấc giỏ | + một giỏ robot tự chiên (95% Perfect) |
| Vận hành cấp 2–4 | khách chờ lâu hơn | + ô khay; Kiosk: khách tự nhận món & rót nước |
| Vận hành cấp 5 (App) | +70% khách | + không mất 8% hoa hồng app |
| Quảng bá cấp 3–5 | +khách | + khách trả thêm 3–8% |
| Giá nâng cấp | 0,75–60tr | 0,6–8tr, theo lãi thêm × số ngày hoàn vốn mục tiêu (cấp 2 ~8 ngày … cấp 6 ~20) |
| Mục tiêu Chương 3 | 60tr, 4,5 sao | 120tr, 4,4 sao |
| Chương 4 | 250tr, 4,6 sao | 250tr, 4,5 sao |
| Chương 5 | 800tr, 4,7 sao, mặt bằng 5,45tr | 300tr, 4,6 sao, mặt bằng 3tr |

Mô phỏng: mua theo lượng đã dùng, tự nhấc giỏ khi có Dây chuyền, kiosk/robot, `--policy N`, theo dõi ngày qua Chương 4.

### Kết quả (`npm run sim -- --days 330 --seeds 5 --policy 3`, có nâng cấp + nhân viên)
| Người chơi | Qua Ch.1 | Qua Ch.2 | Qua Ch.3 | Qua Ch.4 | Tiền ngày 210 |
|---|---|---|---|---|---|
| Giỏi | 20 | 41 | 65 | 107 | 658tr |
| **Trung bình** | 20 | **52** | **85** | **144** | 323tr (đích Chương 5: 300tr) |
| Vụng | 35 | 73 | 108 | kẹt 4,40 sao (Vệ sinh 1,8 vì không thay dầu) | 335tr |
| Khung thiết kế | 15 | 50 | 100 | 150 | 210 |

Không nâng cấp, không nhân viên: không qua được Chương 3 — quán mặt phố cần đội ngũ và đầu tư (đúng thiết kế).
