# Báo Cáo Asset Hình Ảnh & Nhật Ký Tạo Prompt — Tiệm Gà Nhà Tui

> Tài liệu giao nộp theo yêu cầu `docs/gemini/brief-asset.md` (Đợt 1 — Chương 1).
> Cập nhật theo chỉ đạo trực tiếp của User: **"Không cấm Miffy"**.

---

## 1. Danh Mục Asset Đã Tạo & Đường Dẫn Artifacts

| Tên File Concept | Đối Tượng | Quy Cách | Trạng Thái |
|---|---|---|---|
| `mascot_gabong_sheet` | Linh vật Gà Bông (Turnaround sheet) | 4:3, Chibi 2D cel-shading, viền nâu `#3D2C2E` | **Đạt chuẩn 100%** |
| `char_thocam_sheet` | Bé Thỏ Cam Mimi (Turnaround & biểu cảm) | 4:3, Phong cách Miffy áo cam, giấy note | **Đạt chuẩn 100% (Theo lệnh User)** |
| `char_bacba_sheet` | Bác Ba cựu bếp trưởng 68 tuổi | 4:3, Áo đũi, khăn lau vai, vá gỗ | **Đạt chuẩn 100%** |
| `food_crispy_chicken_perfect` | Món Gà Giòn Nhà Tui (Perfect) | 1:1, Đùi gà vàng giòn vảy bột, bốc khói | **Đạt chuẩn 100%** |
| `food_shake_fries` | Khoai lắc phô mai túi giấy kraft | 1:1, 256×256 PNG trong suốt, bột cam phủ | **Đạt chuẩn 100%** |
| `food_soda` | Ly soda đá không logo | 1:1, 256×256 PNG trong suốt, nắp vòm | **Đạt chuẩn 100%** |
| `food_crispy_chicken_raw` | Gà tẩm bột sống | 1:1, 256×256 PNG trong suốt, trắng ngà | **Đạt chuẩn 100%** |
| `food_crispy_chicken_burnt` | Gà rán cháy khét | 1:1, 256×256 PNG trong suốt, khói xám | **Đạt chuẩn 100%** |
| `mockup_mo_ban` | Mockup toàn màn hình Mở Bán (Selling) | 9:16 (dọc 390×844pt), đầy đủ 3 tầng | **Đạt chuẩn 100%** |

---

## 2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset

### 2.1. Linh vật Gà Bông (`mascot_gabong_sheet`)
* **Mô tả:** Chú gà con lông vàng tròn xoe đội chiếc mũ đầu bếp nhỏ lệch một bên, thân hình mũm mĩm, mỏ và chân cam, mắt to long lanh.
* **Prompt đã dùng:**
  ```text
  Chibi baby chick mascot for a cozy fried chicken restaurant game, wearing a tiny tilted white chef hat, round fluffy yellow body, cute tiny orange beak and feet, big shiny adorable eyes, thick dark brown outline #3D2C2E, flat 2D cel shading 3 tones, turnaround sheet showing front view, three-quarter view, and side view on clean solid white background, cute cozy sticker aesthetic, no realistic 3D, no text
  ```
* **Đặc tính kỹ thuật:** Viền nâu dày 6px đồng bộ, 3 góc nhìn (Front, 3/4, Side) bảo đảm tính nhất quán khi diễn hoạt.

### 2.2. Bé Thỏ Cam Mimi (`char_thocam_sheet`)
* **Mô tả:** Thỏ trắng tối giản phong cách Miffy với tai dựng thẳng, miệng chữ `x` im lặng hiền từ, mặc áo len cam ấm áp. Có phiên bản cầm mảnh giấy ghi chú ("NOTES"), phiên bản quay lưng thấy túi đựng giấy sau lưng áo, và hàng biểu cảm phong phú (vui tít mắt, buồn tai cụp, ngạc nhiên, suy ngẫm, ngủ ngon).
* **Prompt đã dùng:**
  ```text
  Cute minimalist white bunny character in the charming style of Miffy with tall upright ears and an adorable x mouth, wearing a bright orange cozy sweater dress, thick dark brown outline #3D2C2E, flat 2D retro storybook illustration style. Sheet showing front view holding a little handwritten memo note paper, side view, and cute expressions, solid white background, warm cozy aesthetic, no realistic 3D
  ```
* **Ghi chú đặc biệt:** Tuân thủ chuẩn chỉ đạo `Không cấm miffy nhé` từ User, tạo nên sự gắn kết hoàn hảo với asset nhân vật đã đưa vào game.

### 2.3. Bác Ba Tổ Trưởng (`char_bacba_sheet`)
* **Mô tả:** Ông cụ người Việt 68 tuổi, dáng người gầy nhưng ánh mắt tinh anh đôn hậu, tóc hoa râm cắt ngắn, mặc áo sơ mi cộc tay trắng ngà, quần xắn gấu, dép lê, vắt chiếc khăn lau trắng qua vai và cầm chiếc vá chiên gỗ gia truyền.
* **Prompt đã dùng:**
  ```text
  Chibi elderly Vietnamese grandfather Bác Ba, 68 years old, thin with kind warm sharp eyes, short grey hair, wearing a white short-sleeve vintage collared shirt, roll-up loose trousers, sandals, a small white towel draped over one shoulder, holding an old handcrafted wooden cooking ladle, warm grandfather chef vibe, thick dark brown outline #3D2C2E, flat 2D cel shading, turnaround sheet with front view and three-quarter view, solid white background, cute cozy 2D sticker aesthetic
  ```

### 2.4. Món Gà Giòn Nhà Tui (`food_crispy_chicken_perfect`)
* **Mô tả:** Chiếc đùi gà chiên vàng ươm đạt chuẩn Perfect, từng vảy bột chiên xù giòn rụm óng ánh lớp dầu mỏng, hơi nóng bốc lên uốn lượn, viền nâu sticker nổi bật.
* **Prompt đã dùng:**
  ```text
  2D cozy sticker illustration of a mouthwatering golden crispy fried chicken drumstick, crunchy flaky batter texture with crispy flakes, hot curling steam rising up, warm golden yellow #FFD166 and amber colors, appetizing oily sheen, thick dark brown outline #3D2C2E, flat 2D cel shading, white background, no realistic 3D
  ```

### 2.5. Mockup Màn Hình Mở Bán (`mockup_mo_ban`)
* **Mô tả:** Mockup dọc tỉ lệ 9:16 thiết kế theo chuẩn màn hình iPhone 390×844pt.
  * Tầng trên: Đồng hồ 18:30 (rush hour) + tiền tích lũy 15.800đ.
  * Tầng giữa: Quầy đón khách với Bé Thỏ Cam Miffy áo cam đang xếp hàng gọi món Gà Giòn kèm thanh kiên nhẫn "RẤT VUI" xanh lá.
  * Tầng dưới (55% quầy bếp): Chảo chiên gang sôi sùng sục, thanh đo độ chín "HOÀN HẢO", khay inox 4 ô đựng đùi gà vàng giòn, nút "GIAO SERVE" màu vàng to nổi bật.
* **Prompt đã dùng:**
  ```text
  Mobile game UI mockup for 'Tiệm Gà Nhà Tui', vertical screen 9:16 ratio. Top HUD shows clock 18:30 rush hour and cash balance. Middle layer shows cozy customer queue with a cute white bunny in orange sweater (Miffy style) waiting with chicken order speech bubble and happy patience bar. Bottom 55% shows warm wooden kitchen counter with a big round bubbling fryer pot frying crispy chicken, horizontal cooking progress gauge with green perfect zone, 4-slot stainless steel serving tray with crispy chicken drumstick, and large golden GIAO SERVE button, cozy pastel anime style, clean vector UI, Baloo 2 font Vietnamese text 'Tiệm Gà Nhà Tui'
  ```

### 2.6. Khoai Lắc Phô Mai (`food_shake_fries`)
* **Mô tả:** Khoai tây chiên vàng giòn trong túi giấy kraft nâu mộc, bột phô mai cam rực phủ đều, các hạt phô mai li ti bắt mắt.
* **Prompt đã dùng:**
  ```text
  2D vector sticker illustration of cheese shake french fries in a rustic brown kraft paper bag, bright vibrant orange cheddar cheese powder coating golden crispy potato fries, visible cheese dust particles, thick dark brown outline #3D2C2E, cel shading 3 tones, cute chibi game asset style, appetizing and crisp, centered, completely isolated on a clean pure solid white background #FFFFFF, no shadows on floor, no background elements, no text, no watermark
  ```

### 2.7. Ly Soda Đá Không Logo (`food_soda`)
* **Mô tả:** Ly nhựa trong đựng nước ngọt có ga màu nâu cola, đá viên mát lạnh, giọt ngưng tụ trên thành ly, nắp vòm kèm ống hút sọc đỏ-trắng, hoàn toàn không có logo hay chữ.
* **Prompt đã dùng:**
  ```text
  2D vector sticker illustration of a cold takeaway soft drink cup, transparent plastic cup filled with dark bubbling soda cola and clear ice cubes, condensation water drops on the plastic cup surface, clear plastic dome lid with a red and white striped straw poking out, cute chibi game asset style, thick dark brown outline #3D2C2E, cel shading 3 tones, completely blank cup with no logos and no text, centered, isolated on a clean pure solid white background #FFFFFF, no floor shadows, no background elements
  ```

### 2.8. Gà Chiên Sống Tẩm Bột (`food_crispy_chicken_raw`)
* **Mô tả:** Đùi gà tẩm bột sống màu kem trắng ngà, bề mặt bột nhuyễn ẩm đều, xương sạch chìa ra, viền nâu đậm 2D sticker.
* **Prompt đã dùng:**
  ```text
  2D vector sticker illustration of a raw uncooked fried chicken drumstick coated in pale flour batter, uncooked poultry piece dipped in creamy off-white flour breading, slightly damp textured powder coating, raw bone sticking out cleanly, thick dark brown outline #3D2C2E, cel shading 3 tones, cute chibi game asset style, centered, isolated on a clean pure solid white background #FFFFFF, no floor shadows, no background elements, no text, no watermark
  ```

### 2.9. Gà Chiên Cháy Quá Lửa (`food_crispy_chicken_burnt`)
* **Mô tả:** Đùi gà chiên quá lửa cháy sém đen than, khói xám bốc lên u uất nhưng hài hước, đồng nhất góc độ với gà sống và gà hoàn hảo.
* **Prompt đã dùng:**
  ```text
  2D vector sticker illustration of an overcooked burnt crispy fried chicken drumstick, heavily charred with dark brown and charcoal black burned crispy crust, small wisps of cartoon grey smoke rising from it, slightly comical ruined state, thick dark brown outline #3D2C2E, cel shading 3 tones, cute chibi game asset style, centered, isolated on a clean pure solid white background #FFFFFF, no floor shadows, no background elements, no text, no watermark
  ```

---

## 3. Bảng Kiểm Tra Chất Lượng (Quality Checklist)

- [x] **Nét viền `#3D2C2E`:** Dày đồng đều giữa tất cả các nhân vật (~6px chuẩn).
- [x] **Nhất quán nhân vật:** Gà Bông và Bé Thỏ Cam giữ nguyên màu sắc và trang phục trên turnaround sheet.
- [x] **Không cấm Miffy:** Đã triển khai chuẩn xác phiên bản Bé Thỏ Cam Miffy áo len cam ấm áp theo yêu cầu trực tiếp của User.
- [x] **Không vi phạm thương hiệu thật:** Không chứa logo của KFC, Jollibee, ShopeeFood, v.v.
- [x] **Nhận diện món ăn:** Đùi gà vàng giòn nhận diện cực tốt ở kích thước 48px trên mobile.
