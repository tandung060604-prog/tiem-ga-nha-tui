# Nhiệm vụ Gemini — Giờ 2

> Ranh giới file như cũ ([../phan-cong.md](../phan-cong.md)): bạn sửa `src/styles/*.css`, `assets-src/**`, `docs/gemini/**`, và được thêm mục vào `MANIFEST` trong `scripts/process-assets.mjs`. Không sửa `.ts`, `index.html`, `package.json`.
> Nghiệm thu bằng lệnh, không tự đánh giá: `npm run assets`, `npm run ui:check -- http://localhost:<cổng>`, `npx vitest run`.

Giờ 1 đã đạt: 5 ảnh món + `ui:check` PASS toàn bộ. Cảm ơn!

## Việc 1 — Asset Đợt 1 còn thiếu (ưu tiên)

Quy trình: ảnh gốc **nền trắng phẳng, nét viền nâu rõ, không chữ** → `assets-src/<loại>/` → khai báo `MANIFEST` → `npm run assets`. Sheet nhiều hình được (script tự cắt theo thứ tự trái→phải, trên→dưới; số hình phải đúng số tên).

| Thứ tự | File đầu ra (`public/assets/…`) | Kích thước | Ghi chú |
|---|---|---|---|
| 1 | `mascot/mascot_gabong_vui`, `_khoc`, `_xiu`, `_on_ap`, `_hoang`, `_ngai` | 512×512 | 6 biểu cảm Gà Bông, cùng nhân vật với `mascot_gabong_front.png` hiện có. Làm 1 sheet 3×2 |
| 2 | `kitchen/kitchen_pan_empty`, `kitchen_oil_clean`, `_medium`, `_dirty` | 512×512 | Chảo gang nhìn chéo từ trên; 3 lớp dầu vàng trong / nâu / đen đục |
| 3 | `icons/icon_*` (15 icon, mục 4.5 `brief-asset.md`) | 128×128 | Có thể làm 3 sheet 5 icon |
| 4 | `ui/ui_bunny_note` | 768×768 | Tờ note cam mép xé, băng keo giấy, không chữ |

Lưu ý tách nền: vùng trắng **thông ra mép ảnh** sẽ bị xóa, nên đừng để phần trắng của nhân vật chạm mép (vd. mũ đầu bếp phải có viền nâu khép kín).

## Việc 2 — CSS cho class mới Claude đã thêm

- `.t-img`: ảnh món trong khay (thẻ `<img>` 36×36, đang dùng cho gà giòn; sắp dùng cho khoai, nước, gà sống, gà cháy). Căn giữa, không bị méo, không co giãn khi tên món dài.
- `.upgrade-effects`: dòng "⚡ Đang có hiệu lực: …" ở tab Nâng cấp — nổi bật nhẹ (nền vàng nhạt), chữ nhỏ, xuống dòng gọn ở 360px.

## Việc 3 — Chuẩn bị giao diện cho bước tiếp theo của Claude (truyện + qua chương)

Claude sắp thêm các phần tử sau; hãy viết sẵn CSS theo `brief-giao-dien.md` mục 4.5–4.6:
- `.story-scene` (nền mờ toàn màn), `.story-portrait` (+ `.is-speaking` / `.is-muted`), `.story-dialog`, `.story-speaker`, `.story-skip`, `.story-choice` (2 nút lớn xếp dọc).
- `.bunny-note` (tờ giấy cam, chữ viết tay), `.bunny-album-grid` (lưới tờ note; tờ chưa mở có class `.is-locked`).
- `.deposit-card` + `.deposit-progress` + nút `#btn-deposit` (thẻ "Đặt cọc mặt bằng 5.000.000đ" trên bảng phấn; trạng thái `.is-ready` khi đủ tiền và đủ sao).

Chưa có HTML để thử: hãy làm file mẫu `docs/gemini/preview-story.html` nạp `../../src/styles/*.css` và dựng tay các phần tử trên để tự kiểm tra ở 360px và 390px.

## Việc 4 — Báo cáo

`docs/gemini/bao-cao-gio-2.md`: file đã tạo/sửa, kết quả 3 lệnh nghiệm thu (dán nguyên dòng tổng kết), việc chưa xong và lý do.
