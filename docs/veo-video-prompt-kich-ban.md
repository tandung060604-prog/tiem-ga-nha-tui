# 🎬 KỊCH BẢN & PROMPT TẠO VIDEO MỞ ĐẦU BẰNG GOOGLE VEO 3 (10 - 15 GIÂY)
# PHONG CÁCH: 3D VOXEL DIORAMA & HD-2D PIXEL ART (RAY-TRACING CINEMATIC)
# DỰ ÁN: TIỆM GÀ NHÀ TUI (VINTAGE RETRO EDITION)

Tài liệu này được biên soạn chuyên biệt cho mô hình sinh video thế hệ mới nhất của Google DeepMind: **Google Veo 3 (VideoFX / Vertex AI)**.
Mục tiêu: Tạo đoạn video mở màn (Intro Cinematic) tuyệt đỉnh thời lượng **12 - 14 giây** với phong cách đột phá: **Không gian 3D có chiều sâu thực tế, nhưng toàn bộ mô hình và chất liệu được tạo tác từ đồ họa Pixel / Voxel 16-bit sắc nét**.

---

## 1. TỔNG QUAN Ý TƯỞNG & ĐỊNH HƯỚNG NGHỆ THUẬT (ART DIRECTION)

- **Thời lượng chuẩn:** 12 - 14 giây (chuẩn cinematic intro 10-15s, đủ dài để kể trọn vẹn câu chuyện buổi sáng hẻm phố mà không gây chán ngắt).
- **Tỉ lệ khung hình (Aspect Ratio):** `9:16` (Web Mobile dọc) hoặc `16:9` (Cinematic ngang).
- **Tốc độ khung hình (Frame Rate):** 24 FPS (điện ảnh) hoặc 60 FPS (siêu mượt).
- **Phong cách nghệ thuật cốt lõi (Core Visual Style):**
  * **3D Voxel Diorama meets HD-2D Pixel Art:** Kết hợp hoàn hảo giữa *The Touryst*, *Octopath Traveler*, *Minecraft RTX* và vẻ ấm cúng mộc mạc của *Stardew Valley*.
  * Toàn bộ nhân vật, món ăn, bếp lò, đèn lồng và góc phố được dựng từ các khối lập phương pixel 3D (cubic micro-voxels) sắc cạnh, khử mờ (crisp pixel grid, zero anti-aliased blur).
  * **Hiệu ứng thị giác 3D đỉnh cao:** Ánh sáng dò tia (Ray-traced lighting), bóng đổ mềm (soft ambient occlusion), chiều sâu trường ảnh (Tilt-shift miniature depth of field with creamy bokeh), sương khói thể tích (volumetric golden steam) bốc lên từ chảo dầu sôi sục.
- **Bối cảnh:** Hẻm 1102 Sài Gòn - Chợ Lớn giao thoa phố cổ Thượng Hải thập niên 90 vào bình minh rực rỡ, lồng đèn đỏ đu đưa, đường lát đá cuội 3D phản quang ánh bình minh mật ong hổ phách.

---

## 2. KỊCH BẢN PHÂN CẢNH CHI TIẾT 12 GIÂY (STORYBOARD BREAKDOWN)

```
[00:00 - 00:03] CẢNH 1: TOÀN CẢNH HẺM PHỐ 3D TỪ TRÊN CAO (TILT-SHIFT ISOMETRIC CRANE)
Camera bay lượn từ trên cao theo góc 3D Isometric nghiêng 45 độ, lướt qua những mái ngói âm dương pixel 3D và các dây phơi lồng đèn đỏ đu đưa trong gió sớm. Lớp sương mai và những luồng ánh sáng thể tích (God rays) màu vàng mật ong xuyên qua các khe nhà. Góc phố bắt đầu thức giấc: chú xe ôm 3D voxel nổ máy xe Dream, đàn bồ câu pixel vỗ cánh bay lên trời xanh.

[00:03 - 00:07] CẢNH 2: HẠ CÁNH VÀO QUẦY GÀ RÁN BÁC BA NÁO NHIỆT (SWOOP & CLOSE-UP)
Máy quay 3D hạ xuống mượt mà ngay trước quầy xe đẩy gỗ mộc "Tiệm Gà Nhà Tui". Chiếc chảo gang đúc 3D đen bóng đang sôi sục chảo dầu vàng óng ánh như ngọc hổ phách, bắn ra những tia bọt dầu vi mô lấp lánh. Bác Ba (nghệ nhân lớn tuổi phúc hậu, tóc hoa râm, mặc tạp dề trắng) hai tay nhấc chiếc giỏ lưới inox đầy ắp những chiếc đùi gà chiên xù vàng rụm bốc khói ngào ngạt. Bé Gà Bông mascot lông vàng tròn xoe đội nón đầu bếp nhảy tưng tưng hào hứng bên cạnh quầy sốt.

[00:07 - 00:11] CẢNH 3: CAMERA 3D ORBIT XOAY 90 ĐỘ QUANH QUẦY & THỰC KHÁCH (3D DEPTH REVEAL)
Góc máy xoay 3D (Camera Orbit) 90 độ mượt mà quanh không gian quầy bán, phô diễn chiều sâu 3D diorama tuyệt mỹ. Hàng dài thực khách 3D pixel (học sinh khăn quàng đỏ, cô nàng sành điệu, anh shipper) đứng xếp hàng tươi cười, hít hà mùi thơm quyến rũ. Bác Ba thoăn thoắt gắp đùi gà vàng giòn vào hộp giấy kraft, trao tận tay thực khách với nụ cười Nam Bộ phúc hậu.

[00:11 - 00:14] CẢNH 4: DOLLY-IN BIỂN HIỆU HOÀNG KIM & NỔ PHÁO HOA PIXEL (TRANSITION TO GAME)
Camera dolly-in tốc độ cao và êm ái tiến sát vào tấm biển hiệu gỗ mộc treo xích sắt khắc nổi chữ vàng 3D "TIỆM GÀ NHÀ TUI". Bất ngờ, một chùm pháo hoa hạt pixel vàng óng và hoa giấy confetti bùng nổ rực rỡ quanh màn hình, khói thơm tan dần chuyển tiếp hoàn hảo vào giao diện bắt đầu game!
```

---

## 3. PROMPT MASTER TỐI ƯU CHO GOOGLE VEO 3 (PROMPT SYNTAX)

### 📌 Master English Prompt (Dùng trực tiếp trên Google Veo 3 / VideoFX)

> **Prompt:**  
> `A breathtaking 3D voxel diorama animation with 16-bit HD-2D pixel art textures, 12 seconds cinematic sequence. Beautiful blend of a lively 1990s Shanghai nostalgic morning alley and cozy Saigon street food market. The entire world is built from crisp 3D cubic voxels with miniature tilt-shift depth of field and ray-traced golden hour morning sunlight. In the center sits a bustling rustic wooden street food stall named "Tiem Ga Nha Tui". An affectionate elderly Vietnamese-Chinese master chef with gray hair and white apron (Bac Ba) joyfully lifts an authentic wire basket overflowing with sizzling, glistening golden-crispy fried chicken drumsticks from a bubbling cast iron fryer. Hot volumetric steam and savory aroma swirl gracefully upward with sparkling golden physics particles. Beside him, an adorable chubby yellow baby chick mascot wearing a tiny white chef hat hops delightfully. Smiling 3D voxel customers queue along the wet cobblestone pavement reflecting red glowing lanterns. The camera performs a cinematic 3D crane swoop down, followed by a smooth 90-degree orbital rotation revealing incredible volumetric depth, then a dynamic dolly-in toward the carved wooden storefront sign illuminated by warm fairy lights. Octopath Traveler lighting aesthetic, The Touryst blocky charm, Studio Ghibli heartwarming atmosphere, sharp pixel edges, fluid 3D character motion, 4k ultra-detailed, 24fps.`

---

### 🎬 Camera & Motion Controls (Tham số điều khiển camera Veo 3)

| Thuộc Tính (Parameter) | Giá Trị Thiết Lập Veo 3 | Ý Nghĩa Nghệ Thuật |
|---|---|---|
| **Model Version** | Google Veo 3 (Latest Gen) | Tái tạo tính nhất quán hạt pixel 3D và vật lý khói thể tích |
| **Duration** | 12 - 14 seconds | Phù hợp trọn vẹn 4 phân cảnh Storyboard |
| **Aspect Ratio** | `9:16` (Mobile) / `16:9` (Desktop) | Khung hình dọc tối ưu cho trải nghiệm web mobile |
| **Camera Choreography** | Crane Down ➔ 90° Orbit ➔ Dolly-In | Phô diễn tối đa không gian chiều sâu 3D diorama |
| **Motion Strength** | Medium-High (6 / 10) | Nhân vật cử động linh hoạt, dầu sôi sủi bọt chân thực |
| **Depth of Field** | Tilt-shift Miniature (f/2.8) | Tạo cảm giác như ngắm một mô hình hộp đồ chơi sống động |
| **Lighting** | Ray-traced God rays + Volumetric Steam | Ánh bình minh mật ong và đèn lồng phản chiếu |

---

### 🚫 Negative Prompt (Ngăn chặn lỗi biến dạng)

> **Negative Prompt:**  
> `flat 2D vector, blurry pixels, photorealistic human faces, smooth organic mud textures, deformed hands, broken anatomy, modern neon cyberpunk, dark depressive colors, glitchy frames, jittery camera, low resolution compression, plastic glossy sheen.`

---

## 4. LỜI BÌNH LỒNG TIẾNG BÁC BA MIỀN TÂY (VOICEOVER TIMELINE)

Được chia khớp chính xác theo từng phân cảnh thời gian:

* **[00:00 - 00:04]** *"Mèn đét ơi! Sáng sớm tinh mơ mà cái Hẻm 1102 này đã thơm phức mùi gà chiên giòn rụm rồi nghen bà con ơi!"*
* **[00:04 - 00:08]** *"Chảo gang dầu sôi sùng sục, từng mẻ gà vàng ươm ráo dầu vừa nhấc lên là giòn rụm tới tận xương đa!"*
* **[00:08 - 00:12]** *"Khách xếp hàng nườm nượp rồi kìa! Nhào vô phụ Bác Ba một tay con ơi, bữa nay tiệm mình khai trương hồng phát nghen!"*
* **[00:12 - 00:14]** *(Âm thanh chuông vàng leng keng + tiếng cười sảng khoái)* *"VÔ BÁN THÔI NÀO!"*

---

## 5. THIẾT KẾ CƠ CHẾ VIDEO TRONG GAME TIỆM GÀ NHÀ TUI

1. **Hiển thị ấn tượng khi mở app:** Khung video mang phong cách hộp gỗ 3D diorama retro với viền xích sắt Stardew.
2. **Hiệu ứng 3D Parallax Perspective:** Khi người dùng rê chuột (hoặc nghiêng điện thoại), khung cảnh 3D Pixel xoay chuyển góc nhìn tương tác nhẹ nhàng tạo chiều sâu nổi khối.
3. **Thanh thời lượng điện ảnh (12 giây):** Có thanh tiến trình chạy mượt, hiển thị phân đoạn phụ đề Bác Ba đồng bộ theo thời gian thực.
4. **Nút Bỏ Qua & Xem Tiếp:** Người chơi có thể bấm "BỎ QUA ✕" để vào thẳng game hoặc bấm "BẮT ĐẦU VÀO TIỆM GÀ 🍗".
