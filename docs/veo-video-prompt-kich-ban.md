# 🎬 KỊCH BẢN TẠO VIDEO INTRO AI BẰNG GOOGLE GEMINI VEO 2
# DỰ ÁN: TIỆM GÀ NHÀ TUI (VINTAGE STARDEW PIXEL ART EDITION)

Tài liệu này được biên soạn chuyên biệt cho công nghệ sinh video thế hệ mới nhất của Google DeepMind: **Gemini Veo 2 (VideoFX)**, nhằm tạo đoạn video mở màn (Intro Cinematic) tuyệt đẹp trước khi vào game.

---

## 1. TỔNG QUAN Ý TƯỞNG & ĐỊNH HƯỚNG NGHỆ THUẬT

- **Thời lượng tối ưu:** 6 - 8 giây (phù hợp mở app nhanh trên mobile mà không gây chờ đợi lâu).
- **Tỉ lệ khung hình (Aspect Ratio):** `9:16` (chuẩn Web Mobile) và `16:9` (chuẩn Desktop Cinematic).
- **Tốc độ khung hình (Frame Rate):** 24 FPS (mang lại cảm giác hoạt hình điện ảnh ấm cúng).
- **Phong cách nghệ thuật (Art Style):** **16-bit Isometric Retro Pixel Art**, lấy cảm hứng giao thoa giữa phố cổ Thượng Hải náo nhiệt thập niên 90 và Hẻm 1102 Sài Gòn - Chợ Lớn ấm áp; tông màu vàng mật ong hổ phách ấm cúng kiểu Studio Ghibli hòa quyện với phong cách Stardew Valley.
- **Âm thanh tích hợp (Audio & Ambience):** Tiếng dầu sôi xèo xèo giòn rụm, tiếng cười rộn rã đầu hẻm, tiếng còi xe Dream xa xa, tiếng leng keng của vá chảo gang và tiếng chuông mở cửa "keng!".

---

## 2. PHÂN CẢNH CHI TIẾT (STORYBOARD BREAKDOWN)

```
[00:00 - 00:02] TOÀN CẢNH GÓC PHỐ BUỔI SỚM
Góc máy pan từ trên cao xuống con phố retro cổ kính. Ánh nắng sớm mai len lỏi qua làn sương mỏng và làn khói thơm phức. Lồng đèn đỏ đu đưa, các nhân vật pixel art (học sinh, người đi chợ, chú xe ôm) bắt đầu tấp nập qua lại.

[00:02 - 00:05] CẬN CẢNH QUẦY GÀ RÁN BÁC BA NÁO NHIỆT
Máy quay zoom mượt mà vào trung tâm: Tiệm Gà Rán Nhà Tui. Chiếc chảo gang đúc đen nhánh đang sôi sục dầu vàng óng ả. Mẻ đùi gà rán vàng ruộm vừa được nhấc lên, hơi nóng bốc lên thơm phức. Bác Ba (nghệ nhân lớn tuổi phúc hậu) tay cầm vá gỗ cười tươi xởi lởi vẫy tay chào. Bé Gà Bông mascot lông vàng tròn xoe đội nón đầu bếp nhảy tưng tưng hào hứng.

[00:05 - 00:07] KHÁCH XẾP HÀNG & MÙI HƯƠNG BAY XA
Thực khách pixel xếp hàng cười rạng rỡ đón nhận từng phần gà bọc giấy kraft nâu thơm nức. Khói gà vàng giòn bay lượn tạo thành vệt sáng phép thuật dẫn mắt người xem.

[00:07 - 00:08] CHUYỂN CẢNH VÀO GAME
Camera dolly-in nhanh và mượt mà vào tấm biển hiệu gỗ mộc treo xích sắt khắc chữ hoàng kim "TIỆM GÀ NHÀ TUI". Hiệu ứng ánh sáng vàng lấp lánh (sparkle transition) chuyển mờ êm dịu sang màn hình Title Game, mở ra lời chào nồng hậu của Bác Ba!
```

---

## 3. PROMPT CHUẨN MỰC CHO GOOGLE GEMINI VEO 2 (PROMPT SYNTAX)

### 📌 Prompt Chính (Master English Prompt for Gemini Veo 2)

> **Prompt:**  
> `Cinematic 16-bit retro pixel art animation, lively bustling Shanghai nostalgic street corner morning market meets cozy Saigon alley. In the center, a vibrant street food stall named "Tiem Ga Nha Tui" made of rustic wood and brass chains. A friendly elderly Vietnamese-Chinese chef with gray hair and white apron (Bac Ba) joyfully lifts a wire basket of golden-crispy fried chicken drumsticks from a bubbling cast iron fryer, emitting mouthwatering hot steam and savory aroma. A cute fluffy round yellow baby chick mascot wearing a chef hat bounces happily beside him. Diverse cute pixel art customers (smiling school kids, trendy girl, delivery boy) gathering eagerly. Morning golden hour sunlight filtering through red lanterns, detailed cobblestone street, cozy warm amber and honey-golden color grading, fluid pixel motion, Studio Ghibli warmth, Stardew Valley aesthetic, smooth camera dolly-in transitioning into the illuminated wooden storefront sign. 4k resolution equivalent, crisp pixel grid, high aesthetic coherence, 24fps.`

### 🚫 Negative Prompt

> **Negative Prompt:**  
> `3D realistic render, live action, photorealistic, vector art, smooth gradients, modern high-tech, blurry, low resolution, messy pixels, deformed anatomy, dull lighting, depressive atmosphere, distorted hands, noisy compression.`

### ⚙️ Thông Số Thiết Lập Trên Giao Diện Veo 2 / VideoFX

| Thuộc Tính (Parameter) | Giá Trị Đề Xuất (Recommended Value) |
|---|---|
| **Model** | Google Veo 2 (Latest Release) |
| **Duration** | 6 - 8 seconds |
| **Aspect Ratio** | `9:16` (dành cho mobile web app) hoặc `16:9` (desktop) |
| **Motion Strength** | Medium (5 - 6 / 10) |
| **Camera Movement** | Smooth Pan Down & Dolly Zoom In |
| **Frame Rate** | 24 FPS |

---

## 4. LỜI BÌNH LỒNG TIẾNG (VOICEOVER MIỀN TÂY HÒM HĨNH)

Đoạn thuyết minh ngắn đi kèm video khi phát:

> *"Mèn đét ơi! Sáng ra là cái hẻm này thơm nức mùi gà chiên rồi đó nghen! Chảo dầu sôi xèo xèo, gà vàng giòn rụm, bà con cô bác xếp hàng đông vui dữ hôn? Vô lẹ phụ Bác Ba một tay con ơi, khách tới mở hàng rồi nè!"*

---

## 5. CƠ CHẾ TÍCH HỢP TRONG GAME

1. **Hiển thị khi mở app:** Người chơi vừa vào app sẽ thấy khung Video Intro viền gỗ retro phát đoạn hoạt cảnh điện ảnh.
2. **Nút Bắt Đầu / Bỏ Qua:** Người chơi có thể bấm nút **"🍗 BẮT ĐẦU VÀO TIỆM"** hoặc **"⏭️ BỎ QUA"** để ngay lập tức vào màn hình chính.
3. **Lưu tùy chọn:** Người chơi có thể chọn "Không hiển thị lại lần sau" để các lần sau vào thẳng màn hình game mà không phải xem lại.
