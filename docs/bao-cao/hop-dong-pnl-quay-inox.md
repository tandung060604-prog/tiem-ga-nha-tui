# Bàn giao cho Gemini: quầy khay inox GN + bảng P&L cuối ngày (27/09)

Claude đã xong phần logic và markup. Gemini làm **CSS** (`src/styles/kitchen.css`, `src/styles/main.css`) và **ảnh** (`assets-src/` → `npm run assets`).
Không đổi tên class / id bên dưới. Cần đổi markup thì ghi vào `docs/gemini/yeu-cau-markup.md`.

## 1. Quầy khay inox âm bàn: `src/ui/components/PrepStation.ts`

Quầy này thay cho `.food-shelf-grid` cũ (ô gà / khoai / popcorn) và cho `.addon-station` (hai hũ sốt). Hai chai tương vẫn là `.shelf-tile` nằm trong `.food-shelf-grid.prep-bottles`.

```
.prep-station
  .prep-row.top      ← 4 khay nông GN 1/6: củ cải, bắp cải trộn, sốt Yangnyeom, sốt bơ tỏi
  .prep-row.bottom   ← 5 khay sâu GN 1/3 có kẹp gắp: gà tẩm bột, má đùi, khoai, gà viên, phô mai que
    button.gn-pan[data-pan="1-6"|"1-3"][data-state="ready"|"empty"|"locked"][data-active="true"|"false"]
      img.gn-pan-img | span.gn-pan-emoji     ← ảnh nguyên liệu sống trong khay (emoji khi chưa có ảnh)
      span.gn-pan-badge                      ← số tồn kho góc khay (khay mở)
      span.gn-pan-lock + span.gn-pan-lock-label  ← 🔒 + "Chương 2" / "Ngày 3" / "Hợp đồng 40k" (khay khóa)
      span.gn-pan-label                      ← tên khay
  .prep-popover      ← bóng hướng dẫn khi chạm khay khóa, tự ẩn sau 3,5s (con cuối của .prep-station)
```

- `data-state="empty"`: hết hàng. Hiện đáy inox trơn và viền đỏ cảnh báo.
- `data-state="locked"`: phủ nắp inox mờ (frosted metal), ổ khóa đồng ở giữa. Khay khóa **không có id**, chỉ có `data-prep-lock`.
- `data-active="true"`: khay của mẻ đang trong chảo, hoặc thau sốt đang chọn. Có thể dùng lại hiệu ứng `shelfPulse`.
- `button[disabled]`: khay hàng dưới khi chảo đang bận.
- Id của các khay mở là hợp đồng (tutorial và các script kiểm tra dùng):
  - Chiên: `#btn-fry-chicken`, `#btn-fry-thigh`, `#btn-fry-fries`, `#btn-fry-popcorn`, `#btn-fry-cheese`
  - Múc: `#btn-scoop-danmuji`, `#btn-scoop-coleslaw`
  - Sốt: `#btn-season-spicy`, `#btn-season-honey`
- **Style inline tạm** (`TMP_ROW`, `TMP_PAN`, `TMP_IMG` trong `PrepStation.ts`) chỉ để quầy dùng được khi chưa có CSS. Gemini viết CSS xong thì ghi vào bảng phân công, Claude sẽ xóa.
- Kích thước:
  - Phải vừa màn 320/360/390px.
  - Mỗi khay chạm được tối thiểu 44px.
  - Hàng dưới có 5 khay; nếu chật thì cho cuộn ngang **bên trong** `.prep-row`, không để cả trang cuộn ngang.

## 2. Bảng P&L cuối ngày: `renderPnl()` trong `src/ui/components/SummaryModal.ts`

```
.ledger-box.pnl
  .pnl-form-badge[data-form="household"|"company"]   ← "Hộ kinh doanh · thuế khoán 4,5%" / "Công ty TNHH · VAT 8% + TNDN 17%"
  details.pnl-section (Doanh thu mở sẵn; Giá vốn, Chi phí vận hành, Hao hụt & phạt, Thuế thu gọn)
    summary.ledger-row.pnl-subtotal
    .ledger-row.pnl-row(.neg)
    .pnl-note                                        ← ghi chú nhỏ (tiền mất vì món cháy)
  .ledger-row.pnl-profit                             ← Lãi trước thuế
  .ledger-row.total.pnl-net                          ← LỢI NHUẬN RÒNG
  .pnl-note                                          ← giải thích dòng tiền
```

Các class `.ledger-box` và `.ledger-row` vẫn giữ để style cũ còn tác dụng. Cần thêm:
- Mũi tên mở/đóng cho `summary`.
- Màu badge riêng cho hộ kinh doanh và công ty.
- Dòng thuế và lãi ròng nổi bật.

## 3. Ảnh cần tạo

Ảnh để trong `assets-src/`, xuất bằng `npm run assets`. Nền trong suốt, 256px, mỗi file ≤ 40KB.

| File | Nội dung |
|---|---|
| `kitchen/prep_chicken_raw.png` | Khay GN 1/3: gà tươi áo bột chiên xù vàng nhạt, kẹp gắp inox |
| `kitchen/prep_thigh_raw.png` | Khay GN 1/3: má đùi gà ướp cay đỏ |
| `kitchen/prep_fries_raw.png` | Khay GN 1/3: khoai tây vàng cắt que đều |
| `kitchen/prep_popcorn_raw.png` | Khay GN 1/3: gà viên tròn lăn bột |
| `kitchen/prep_cheese_stick_raw.png` | Khay GN 1/3: phô mai que phủ bột chiên xù |
| `kitchen/side_radish_pickled.png` | Khay GN 1/6: củ cải vàng ngâm chua ngọt, vá múc |
| `kitchen/side_coleslaw.png` | Khay GN 1/6: bắp cải sợi tím trắng trộn mayonnaise |
| `kitchen/pan_sauce_yangnyeom.png` | Khay GN 1/6: sốt cay đỏ óng |
| `kitchen/pan_sauce_soy_garlic.png` | Khay GN 1/6: sốt bơ tỏi đậu nành nâu bóng |
| `kitchen/pan_locked_slot.png` | Nắp inox mờ + ổ khóa đồng (phủ lên khay khóa) |
| `kitchen/pan_empty.png` | Khay inox rỗng trơ đáy |
| `food/food_spicy_thigh.png` | Má đùi gà rán giòn cay (thành phẩm) |
| `food/food_cheese_stick.png` | Phô mai que kéo sợi |
| `food/food_danmuji.png` | Chén củ cải vàng |
| `food/food_coleslaw.png` | Chén bắp cải trộn |

Gemini giao ảnh xong thì ghi vào bảng phân công. Claude sẽ đăng ký ảnh trong `src/content/assets.ts` (`PREP_LAYOUT.asset` và `foodImage()`); `tests/assets.test.ts` yêu cầu mọi ảnh đã đăng ký phải tồn tại.

## 4. Đổi tên món (giữ nguyên id)

| id | Tên cũ | Tên mới |
|---|---|---|
| `crispy_chicken` | Gà Giòn Nhà Tui | Gà Rán Giòn Truyền Thống |
| `spicy_chicken` | Gà Sốt Cay Xé Lưỡi | Cánh Gà Sốt Cay Yangnyeom |
| `honey_garlic_chicken` | Gà Mật Ong Bơ Tỏi | Gà Sốt Bơ Tỏi Đậu Nành |

Tên dài hơn trước. Cần kiểm tra các chỗ hiện tên món: `.order-item-title`, `.t-name`, tab Thực đơn.
