# Brief asset hình ảnh — Tiệm Gà Nhà Tui

> Gửi: Gemini (tạo ảnh). Đọc mục 1–3 trước khi tạo bất kỳ ảnh nào. Mục 4 là danh sách asset kèm prompt. Làm theo thứ tự đợt (Đợt 1 trước).

## 0. Cách giao file

- Định dạng: **PNG nền trong suốt** (trừ ảnh nền cảnh là PNG/WebP có nền). Không viền trắng thừa quanh nhân vật.
- Đặt tên **đúng cột "Tên file"**, chữ thường, gạch dưới, không dấu.
- Mỗi nhân vật: 1 ảnh **turnaround sheet** (trước, 3/4, nghiêng) để giữ nhất quán, rồi mới đến các ảnh biểu cảm.
- Kèm 1 file `asset-notes.md`: liệt kê file đã giao, file chưa đạt, và seed/prompt cuối cùng đã dùng cho từng file (để tạo lại được).

## 1. Phong cách chung (art bible)

- **2D chibi**, tỉ lệ đầu:thân ≈ **1 : 1,2**; mắt to, biểu cảm meme rõ ràng.
- **Nét viền dày màu nâu `#3D2C2E`** (không đen tuyền), độ dày đồng đều ~6px ở kích thước 512px.
- **Tô bóng 3 cấp:** màu nền, 1 lớp bóng tối (cel shading cứng), 1 điểm sáng nhỏ. Không gradient mềm kiểu 3D, không texture.
- Bảng màu ấm "gà rán": đỏ cà chua `#E63946`, cam sốt `#F4A261`, vàng giòn `#FFD166`, kem bơ `#FDF3E4`, bạc hà `#4FA883` làm màu nhấn.
- **Đồ ăn luôn có hơi nóng bốc lên và ánh dầu bóng**; gà rán vàng giòn có vảy bột xù.
- Ánh sáng từ trên trái. Bóng đổ dưới chân: elip nâu 20% độ mờ.
- Bối cảnh: **hẻm Sài Gòn** — mái tôn, dây điện, giàn hoa giấy, bảng hiệu viết tay, xe máy, ghế nhựa đỏ/xanh.

## 2. Cấm (bắt buộc)

- **Không** giống nhân vật có bản quyền khác. Ngoại lệ: Thỏ Cam được giữ phong cách hiện tại theo quyết định của chủ dự án (26/09/2026), chủ dự án chịu trách nhiệm về bản quyền.
- **Không** logo, màu đặc trưng hay linh vật của KFC (ông già râu trắng, sọc đỏ trắng xô), Jollibee (ong đỏ), Texas Chicken, McDonald's, Lotteria, Popeyes, Grab, ShopeeFood, Be. Áo shipper chỉ màu xanh lá/cam trơn, không chữ.
- **Không** chữ trong ảnh (trừ khi mục 4 yêu cầu). Chữ sẽ do game hiển thị.
- **Không** phong cách ảnh thật, không 3D render.

## 3. Kích thước chuẩn

| Loại | Kích thước gốc | Hiển thị trong game |
|---|---|---|
| Chân dung nhân vật (bán thân) | 512×512 | 64–96pt thẻ khách |
| Nhân vật toàn thân (cảnh truyện) | 512×1024 | 256pt |
| Món ăn | 256×256 | 48–96pt |
| Icon UI | 128×128 | 24–48pt |
| Thiết bị bếp (chảo, khay) | 512×512 | theo layout |
| Nền cảnh | 1170×2532 (dọc 9:19,5) | toàn màn |
| Khung thẻ chia sẻ | 1080×1350 | ảnh xuất |

---

## 4. Danh sách asset

### Đợt 1 — Chương 1 (cần trước để làm vertical slice)

#### 4.1 Linh vật & nhân vật chính

| Tên file | Nội dung | Prompt gợi ý |
|---|---|---|
| `mascot_gabong_sheet.png` | Gà Bông turnaround | Chibi baby chick mascot wearing a small white chef hat tilted to one side, round fluffy yellow body `#FFD166`, tiny orange beak and feet, big shiny eyes, thick brown outline `#3D2C2E`, cel shading 3 tones, turnaround sheet front / three-quarter / side, transparent background, no text |
| `mascot_gabong_<bieucam>.png` × 6 | biểu cảm: `vui`, `khoc`, `xiu` (ngất, hồn bay ra), `on_ap` (giơ ngón cái, kính râm), `hoang` (dầu bắn, mồ hôi), `ngai` (đỏ mặt) | Same Gà Bông character, expression: …, sticker style, white 8px sticker border, transparent background |
| `owner_<gioitinh>_<bieucam>.png` | Chủ tiệm, 3 biến thể (`nam`, `nu`, `trung_tinh`) × 6 biểu cảm (`vui`, `tap_trung`, `hoang`, `buon`, `tu_hao`, `met`) | Chibi young Vietnamese street-food vendor, age mid-20s, red apron over a cream t-shirt, bandana, holding a frying basket, expression …, thick brown outline, cel shading, bust shot, transparent background |
| `char_bacba_sheet.png` + 4 biểu cảm | Bác Ba, 68 tuổi, cựu bếp chính | Chibi elderly Vietnamese man, 68, thin with kind sharp eyes, short grey hair, white short-sleeve button shirt, loose trousers, sandals, towel over shoulder, holding an old long-handled wooden frying ladle, warm grandfather vibe |
| `char_minhtri_group.png` | Nhóm Minh Trí (3 học sinh lớp 12) | Three chibi Vietnamese high-school students sheltering from rain, white school shirts and navy trousers/skirt, one girl in white áo dài, backpacks, wet hair, laughing, sharing a paper cone of cheese fries |
| `char_thocam_costume_sheet.png` | **Thỏ Cam (Mimi mặc đồ thú bông)** | Chibi person wearing a **handmade orange hoodie mascot costume with long floppy bunny ears on the hood**, the hood covers most of the face showing only big round eyes through a mesh window, rosy cheek patches sewn on the costume, carries a stack of flyers and a small notepad, **mouth is a small embroidered curve (not an X)**, slightly oversized costume with visible seams and a zipper, cozy and a bit clumsy |
| `char_thocam_<bieucam>.png` × 4 | `vay_tai`, `giu_giay`, `buon`, `vui` | Same costume character, holding up a handwritten note, … |

#### 4.2 Khách ngẫu nhiên (hệ ghép phần)
Tạo mỗi nhóm **1 ảnh sheet 4 biến thể** (tóc/giới tính khác nhau, cùng trang phục đặc trưng), bán thân 512×512 mỗi ô:

| Tên file | Nhóm | Đặc điểm nhận diện |
|---|---|---|
| `cust_student_sheet.png` | Học sinh | Đồng phục trắng, balo, kính cận |
| `cust_office_sheet.png` | Dân văn phòng | Sơ mi, thẻ nhân viên đeo cổ, ly cà phê |
| `cust_shipper_sheet.png` | Shipper | Áo khoác xanh lá hoặc cam **không chữ/logo**, mũ bảo hiểm nửa đầu, túi giữ nhiệt |
| `cust_genz_sheet.png` | GenZ/TikToker | Hoodie oversize, tóc nhuộm, cầm điện thoại quay |
| `cust_demanding_sheet.png` | Khách khó tính | Kính trễ mũi, quạt nan, túi xách da |
| `cust_family_sheet.png` | Gia đình | Mẹ/bố bế bé, gấu bông |

Mỗi sheet thêm 1 hàng biểu cảm **kiên nhẫn**: `vui` → `binh_thuong` → `buc` → `gian` (4 ô).

#### 4.3 Món ăn chương 1 (256×256)

| Tên file | Món |
|---|---|
| `food_crispy_chicken_perfect.png` | Gà Giòn Nhà Tui — đùi gà vàng giòn, vảy bột xù, hơi nóng |
| `food_crispy_chicken_raw.png` | Cùng miếng gà, bột còn trắng nhợt |
| `food_crispy_chicken_burnt.png` | Cùng miếng gà, cháy đen, khói xám, mặt buồn cười nhỏ (tùy chọn) |
| `food_shake_fries.png` | Khoai lắc phô mai trong túi giấy kraft, bột phô mai cam |
| `food_soda.png` | Ly nhựa nước ngọt có đá, ống hút, **không logo** |

#### 4.4 Bếp & quầy chương 1

| Tên file | Nội dung |
|---|---|
| `kitchen_pan_empty.png` | Chảo gang sâu lòng trên bếp gas mini, nhìn chéo từ trên |
| `kitchen_oil_clean.png` / `_medium.png` / `_dirty.png` | Lớp dầu tách riêng (để chồng lên chảo): vàng trong / nâu / đen đục có bọt |
| `kitchen_tray.png` | Khay inox 4 ô |
| `kitchen_cart_ch1.png` | Xe đẩy inox cũ hàn chắp vá, mái bạt sọc đỏ-kem, bảng tên để trống |
| `bg_ch1_alley_rain.png` | Nền đầu hẻm chiều mưa, ánh đèn vàng ấm, không người |
| `bg_ch1_alley_day.png` | Cùng góc, trời nắng |

#### 4.5 Icon UI (128×128, cùng nét viền)
`icon_money.png` (đồng xu có chữ đ), `icon_star.png`, `icon_star_empty.png`, `icon_inventory.png` (thùng carton), `icon_upgrade.png` (cờ lê + chảo), `icon_staff.png`, `icon_reviews.png` (bong bóng thoại có sao), `icon_book.png` (sổ tay), `icon_lock.png`, `icon_settings.png`, `icon_sound_on.png`, `icon_sound_off.png`, `icon_share.png`, `icon_clock.png`, `icon_fire_rush.png`.

#### 4.6 Hiệu ứng (sprite sheet ngang, mỗi khung 256×256, 6–8 khung)
`vfx_perfect_sparkle.png` (lấp lánh vàng), `vfx_burnt_smoke.png` (khói xám), `vfx_steam.png` (hơi nóng), `vfx_coin_pop.png` (đồng xu bật lên), `vfx_oil_splash.png` (dầu bắn).

#### 4.7 Giấy thư Thỏ Cam
`ui_bunny_note.png`: tờ note cam nhạt 768×768, mép xé, băng keo giấy ở đỉnh, vết dầu mờ ở góc, **không chữ**. `ui_bunny_note_locked.png`: bản bóng mờ.

### Đợt 2 — Chương 2–3

- Nhân vật (sheet + 4 biểu cảm mỗi người): `char_na` (18, học múa, tóc búi, túi đựng giày múa), `char_dung` (18, vẽ truyện, sổ phác thảo, bút chì sau tai), `char_long` (32, sơ mi, cà vạt nới lỏng, cau mày), `char_mai` (34, kế toán, áo công sở, mệt mỏi dịu dàng), `char_bap` (7, bé gái, cặp sách, hộp bút màu), `char_tuan` (27, shipper áo xanh lá trơn, nụ cười hiền), `char_lan` (45, bán vải chợ, quạt nan, sắc sảo), `char_quynhanh` (23, TikToker, vòng đèn ring light mini), `char_duchuy` (20, tai nghe gaming, hoodie, quầng thâm), `char_kinhtron` (food reviewer: chỉ thấy cặp kính tròn và mũ phớt, mặt luôn khuất).
- Món: `food_spicy_chicken`, `food_honey_garlic_chicken`, `food_pasta_beef`, `food_combo_duo`, `food_biscuit_honey`, `food_chicken_burger`, `food_popcorn_chicken`, `food_peach_tea`, `food_family_bucket` (xô giấy **họa tiết kem-cam**, không sọc đỏ trắng).
- Nhân viên (ghép phần): đồng phục tiệm (áo thun đỏ cổ kem, tạp dề kem, mũ lưỡi trai có hình Gà Bông), 5 vai: thu ngân, bếp, phục vụ, giao hàng, quản lý ca.
- Nền: `bg_ch2_alley_shop.png` (tiệm số 14, 4 bàn gỗ, giàn hoa giấy hồng), `bg_ch3_street_front.png` (mặt tiền 12 bàn, đèn neon hình gà con, tòa văn phòng đối diện).
- Thiết bị theo cấp nâng cấp: nồi chiên 2 giỏ, tủ giữ nóng, máy POS, màn hình gọi số, kiosk.

### Đợt 3 — Chương 4–5

- Đối thủ (toàn thân, phong cách phản diện hài):
  - `rival_mrmega`: CEO 40 tuổi, vest xanh lạnh, tóc vuốt bóng, tay cầm máy tính bảng biểu đồ, cười tự mãn.
  - `rival_oppacrunch`: chị Kim Bảo Ngọc, 30, trang phục neon hồng, đeo 3 điện thoại.
  - `rival_seplon`: anh Sếp Lớn, 45, bụng bia, đồng hồ to, luôn nhìn đồng hồ.
- Mặt tiền đối thủ: `bg_rival_megachicken.png` (tòa kính 3 tầng xanh lạnh, logo là **khối lục giác trừu tượng**, không hình gà), `bg_rival_oppa.png`.
- `char_mimi_reveal_sheet.png`: Mimi không đội mũ thỏ — cô gái 22 tuổi, tóc ngắn rối vì đội mũ lâu, hoodie cam (cùng bộ đồ thú bông, mũ thỏ cầm trên tay), mắt giống hệt ô lưới trên mũ, cười ngượng.
- `bg_ch5_award_stage.png`: sân khấu lễ trao giải "Gà Vàng", đèn vàng ấm, cúp hình gà con vàng (không giống cúp/giải thật nào).
- `prop_golden_ladle.png`: chiếc vá chiên gỗ cũ gia truyền, cán quấn băng vải đỏ.
- `share_frame_review.png`, `share_frame_wrapped.png`: khung thẻ chia sẻ 1080×1350, chừa trống vùng chữ, Gà Bông góc dưới phải.

## 5. Kiểm tra trước khi giao

- [ ] Nét viền `#3D2C2E`, dày đồng đều giữa các nhân vật.
- [ ] Nhân vật giữ nhất quán giữa turnaround và các biểu cảm (tóc, trang phục, màu).
- [ ] Không logo/chữ/thương hiệu thật trong ảnh.
- [ ] Nền trong suốt sạch, không viền trắng quanh nét.
- [ ] Món ăn nhìn "ngon" ở 48px (hình khối rõ, màu vàng giòn nổi).

Ghi chú bản quyền cho nhóm: theo GDD, ảnh AI dùng làm **concept**; bản cuối đưa vào game nên được vẽ lại/chỉnh sửa bởi họa sĩ và lưu nguồn gốc trong `docs/licenses.md`.
