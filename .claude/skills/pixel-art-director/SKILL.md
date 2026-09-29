---
name: pixel-art-director
description: "Chuyên gia giám đốc nghệ thuật Pixel Art, thiết kế khung hộp thoại 9-slice, template sự kiện retro, âm thanh 16-bit acoustic và tối ưu hiển thị điểm ảnh sắc nét phong cách Stardew Valley cho Tiệm Gà Nhà Tui."
---

# Pixel Art Director & Stardew Valley Aesthetics — Tiệm Gà Nhà Tui

Skill này hướng dẫn toàn bộ đội ngũ Agent (**Gemini 1 - Visuals**, **Gemini 2 - Core & Audio**, **Gemini 3 - Narrative**, **Claude - Lead & Auditor**) trong chiến dịch **Big Update**: Chuyển đổi toàn diện đồ họa, khung sự kiện, hộp thoại Visual Novel và âm thanh sang phong cách **Cozy 16-bit Pixel Art** lấy cảm hứng từ *Stardew Valley*.

---

## 1. BẢNG MÀU CHUẨN MỰC (STARDEW COZY COLOR PALETTE)

Phong cách Stardew Valley mang nét ấm cúng, thôn dã, mộc mạc với gam màu tự nhiên (đất, gỗ mộc, giấy da cổ, vàng đồng):

```css
:root {
  /* Khung viền gỗ cổ điển (Wood Frame) */
  --pixel-wood-dark: #3a1f11;
  --pixel-wood-base: #62361b;
  --pixel-wood-light: #8e542d;
  --pixel-wood-highlight: #b87c4c;

  /* Giấy da hộp thoại & cuộn thư (Parchment & Scroll) */
  --pixel-parchment-bg: #faeed1;
  --pixel-parchment-border: #d4a96a;
  --pixel-parchment-shadow: #c49654;
  --pixel-parchment-text: #4a2810;

  /* Kim loại & Huy hiệu vàng (Gold Trim & Accents) */
  --pixel-gold-dark: #7a4805;
  --pixel-gold-base: #c98e1e;
  --pixel-gold-light: #f7d046;

  /* Trạng thái cảm xúc Stardew */
  --pixel-heart-red: #e03b3b;
  --pixel-energy-green: #3ca346;
  --pixel-night-blue: #1c2646;
}
```

---

## 2. QUY TẮC HIỂN THỊ PIXEL SẮC NÉT TRÊN WEB (CRISP RENDERING)

Để hình ảnh pixel không bị nhòe mờ (anti-aliasing) trên màn hình Retina của điện thoại:

```css
/* Luôn áp dụng cho hình ảnh pixel, khung border-image và icon */
.pixel-art,
.pixel-box,
.portrait-box,
img[src*="pixel"] {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

---

## 3. KHUNG HỘP THOẠI 9-SLICE (STARDEW DIALOGUE BOX)

Sử dụng kỹ thuật CSS `border-image` hoặc `box-shadow` nhiều tầng để tạo hộp thoại mở rộng linh hoạt mà không méo viền:

### Hộp thoại gỗ có ảnh nhân vật đối thoại (Stardew Dialogue Layout)
```html
<div class="stardew-dialog-container">
  <!-- Ảnh đại diện pixel 64x64 kèm khung gỗ -->
  <div class="stardew-portrait-frame">
    <img src="/assets/characters/bac_ba_pixel_portrait.png" class="pixel-art portrait-img" alt="Bác Ba">
    <div class="portrait-name">Bác Ba</div>
  </div>

  <!-- Nội dung lời thoại cuộn chữ Typewriter -->
  <div class="stardew-speech-box">
    <div class="speech-speaker">Bác Ba Trưởng Hẻm</div>
    <div class="speech-text" id="dialogue-content">
      "Sáng sớm hẻm 1102 ngửi mùi gà rán của cháu là cả xóm đều thấy ấm bụng..."
    </div>
    <div class="dialogue-arrow">▼</div>
  </div>
</div>
```

---

## 4. QUẢN LÝ ÂM THANH COZY (HOWLER.JS + 16-BIT AUDIO)

Hệ sinh thái thư viện đã được cài đặt trong dự án:
- `howler`: Quản lý BGM loop mượt mà, chuyển cảnh không giật tiếng.
- `nes.css`: Hệ thống retro UI container, balloon, badge có sẵn.
- `@fontsource/silkscreen`, `@fontsource/vt323`: Font pixel offline nhúng thẳng vào bundle, không trễ layout.
- `canvas-confetti`: Hiệu ứng hạt nổ pháo hoa dạng pixel khi xong ngày/lên cấp.

### Bộ âm thanh cần có:
1. **Typewriter Blip (Bloop/Chirp):** Âm tần số cao 400-800Hz ngắt sau 20-30ms, phát khi từng ký tự nhảy ra trong hộp thoại.
2. **Coin / Gold Clink:** Tiếng kim loại ngân nhẹ 2 nốt (B6 → E7) khi khách trả tiền.
3. **Wooden Pop:** Tiếng "cộp" mộc ấm khi bấm nút hoặc đổi tab.
4. **BGM Cozy Loop:** Nhạc cụ mộc (guitar acoustic, marimba, flute) nhịp điệu 70 BPM.

---

## 5. PIPELINE XỬ LÝ ẢNH SHARP (PIXEL ART PRESERVATION)

Khi xử lý ảnh qua script `npm run assets` (`scripts/process-assets.mjs`):
- Tuyệt đối dùng thuật toán **Nearest Neighbor** khi resize để giữ nguyên từng khối pixel vuông:
  ```js
  sharp(inputBuffer)
    .resize(width, height, { kernel: sharp.kernel.nearest })
    .png({ compressionLevel: 9 })
  ```
- Không áp dụng gaussian blur hay bi-linear interpolation làm mềm viền.

---

## 6. PHÂN CÔNG TÁC VỤ MULTI-AGENT (AGENTS.MD SYNERGY)

- **🎨 Gemini 1 (UI & Visuals):**
  - Chuyển đổi CSS HUD, modal, khung sự kiện thành viền gỗ Stardew và giấy cuộn Parchment.
  - Tích hợp `@fontsource/silkscreen` cho tiêu đề và `@fontsource/vt323` cho đồng hồ / điểm số.
  - Sử dụng các class của `nes.css` kết hợp custom CSS tokens.
- **⚙️ Gemini 2 (Core & Sound):**
  - Tích hợp `Howler` vào `src/core/audio.ts` để nạp soundbank 16-bit và quản lý mute/volume an toàn trên mobile.
  - Thêm hiệu ứng âm thanh Typewriter cho hội thoại và âm thanh gỗ cho thao tác quầy bếp.
- **📖 Gemini 3 (Narrative & Templates):**
  - Chuyển giao diện truyện Visual Novel thành chuẩn Stardew Dialogue Box với biểu cảm avatar (4 trạng thái: cười, giận, ngạc nhiên, suy ngẫm).
- **👑 Claude (Lead & Auditor):**
  - Review diff, đảm bảo 100% test Vitest PASS, build sạch và kiểm tra `ui:check` + `ios:check` hiển thị pixel hoàn hảo trên 360px & 390px.
