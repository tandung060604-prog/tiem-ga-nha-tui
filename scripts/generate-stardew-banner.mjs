import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

async function buildBanner() {
  console.log('--- Đang tạo Banner Tiệm Gà Rán phong cách Stardew Valley 16-Bit Pixel Art (Bản Tinh Chỉnh) ---');

  const W = 680;
  const H = 220;

  // 1. Tải và xử lý mascot Gà Bông và món Gà Vàng Giòn
  const gabongBuf = await sharp('public/assets/mascot/mascot_gabong_vui.png')
    .resize(96, 96, { kernel: 'nearest' })
    .toBuffer();

  const drumstickBuf = await sharp('public/assets/food/food_crispy_chicken_perfect.png')
    .resize(70, 70, { kernel: 'nearest' })
    .toBuffer();

  const neonBuf = await sharp('public/assets/ui/sticker_neon.png')
    .resize(44, 44, { kernel: 'nearest' })
    .toBuffer();

  // 2. Tạo khung SVG Biển Gỗ Mộc Stardew Valley
  const svgSign = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Pattern vân gỗ Stardew Valley -->
      <pattern id="woodPlanks" width="680" height="40" patternUnits="userSpaceOnUse">
        <rect width="680" height="38" fill="#5a3018" />
        <rect y="38" width="680" height="2" fill="#2b1810" />
        <rect y="0" width="680" height="2" fill="#8e542d" />
        <line x1="80" y1="8" x2="130" y2="8" stroke="#3a1f11" stroke-width="2" />
        <line x1="280" y1="18" x2="340" y2="18" stroke="#3a1f11" stroke-width="2" />
        <line x1="500" y1="26" x2="560" y2="26" stroke="#3a1f11" stroke-width="2" />
      </pattern>
    </defs>

    <!-- Dây xích sắt treo biển hiệu (Pixel Iron Chains) -->
    <!-- Xích trái -->
    <g fill="#4a4a4a" stroke="#1a0c06" stroke-width="2">
      <rect x="80" y="0" width="12" height="12" rx="2" />
      <rect x="82" y="8" width="8" height="12" rx="2" fill="#666" />
      <rect x="80" y="16" width="12" height="12" rx="2" />
      <rect x="82" y="24" width="8" height="12" rx="2" fill="#666" />
      <circle cx="86" cy="40" r="5" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    </g>

    <!-- Xích phải -->
    <g fill="#4a4a4a" stroke="#1a0c06" stroke-width="2">
      <rect x="584" y="0" width="12" height="12" rx="2" />
      <rect x="586" y="8" width="8" height="12" rx="2" fill="#666" />
      <rect x="584" y="16" width="12" height="12" rx="2" />
      <rect x="586" y="24" width="8" height="12" rx="2" fill="#666" />
      <circle cx="590" cy="40" r="5" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    </g>

    <!-- Khối Biển Gỗ Chính (Main Wooden Signboard) -->
    <rect x="18" y="38" width="644" height="174" fill="#1a0c06" rx="4" />
    <rect x="14" y="34" width="648" height="174" fill="#3a1f11" rx="4" stroke="#1a0c06" stroke-width="4" />

    <!-- Mặt bảng gỗ với các tấm ván ghép -->
    <rect x="22" y="42" width="632" height="158" fill="url(#woodPlanks)" />
    
    <!-- Viền nổi Bevel bên trong bảng gỗ -->
    <rect x="22" y="42" width="632" height="3" fill="#b87c4c" />
    <rect x="22" y="42" width="3" height="158" fill="#b87c4c" />
    <rect x="22" y="197" width="632" height="3" fill="#2b1810" />
    <rect x="651" y="42" width="3" height="158" fill="#2b1810" />

    <!-- 4 Khung kim loại mạ vàng đính góc (Stardew Metal Corners) -->
    <!-- Góc trên-trái -->
    <path d="M 20 40 L 46 40 L 46 48 L 28 48 L 28 66 L 20 66 Z" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    <circle cx="26" cy="46" r="2.5" fill="#ffffff" stroke="#7a4805" stroke-width="1" />
    
    <!-- Góc trên-phải -->
    <path d="M 656 40 L 630 40 L 630 48 L 648 48 L 648 66 L 656 66 Z" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    <circle cx="650" cy="46" r="2.5" fill="#ffffff" stroke="#7a4805" stroke-width="1" />

    <!-- Góc dưới-trái -->
    <path d="M 20 202 L 46 202 L 46 194 L 28 194 L 28 176 L 20 176 Z" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    <circle cx="26" cy="196" r="2.5" fill="#ffffff" stroke="#7a4805" stroke-width="1" />

    <!-- Góc dưới-phải -->
    <path d="M 656 202 L 630 202 L 630 194 L 648 194 L 648 176 L 656 176 Z" fill="#c98e1e" stroke="#1a0c06" stroke-width="2" />
    <circle cx="650" cy="196" r="2.5" fill="#ffffff" stroke="#7a4805" stroke-width="1" />

    <!-- Dây leo thường xuân pixel (Pixel Ivy Leaves) -->
    <g fill="#3ca346" stroke="#1e5923" stroke-width="1.5">
      <rect x="36" y="32" width="10" height="10" />
      <rect x="42" y="26" width="12" height="10" fill="#4ade80" />
      <rect x="50" y="34" width="8" height="8" />
      <rect x="626" y="32" width="10" height="8" />
      <rect x="634" y="28" width="12" height="10" fill="#4ade80" />
    </g>

    <!-- Khung nẹp gỗ khắc chữ (Carved Title Plate) -->
    <rect x="175" y="52" width="465" height="138" fill="#3a1f11" rx="4" stroke="#2b1810" stroke-width="3" />
    <rect x="179" y="56" width="457" height="130" fill="#4a2612" />
    <rect x="179" y="56" width="457" height="3" fill="#8e542d" />
    <rect x="179" y="183" width="457" height="3" fill="#1a0c06" />

    <!-- Huy hiệu K-Chicken nhỏ xinh xắn -->
    <g>
      <rect x="190" y="62" width="105" height="18" fill="#d92534" stroke="#1a0c06" stroke-width="2" rx="2" />
      <text x="242" y="75" text-anchor="middle" font-family="'Silkscreen', 'Courier New', monospace" font-size="10" fill="#fff" font-weight="700">★ K-CHICKEN ★</text>
    </g>

    <!-- Ngôi sao pixel lấp lánh (Pixel Sparkles) -->
    <g fill="#ffd166">
      <path d="M 590 68 L 592 73 L 597 75 L 592 77 L 590 82 L 588 77 L 583 75 L 588 73 Z" />
      <path d="M 195 168 L 197 171 L 200 173 L 197 175 L 195 178 L 193 175 L 190 173 L 193 171 Z" />
      <path d="M 618 165 L 620 168 L 623 170 L 620 172 L 618 175 L 616 172 L 613 170 L 616 168 Z" />
    </g>

    <!-- Chữ TIỆM GÀ NHÀ TUI (3D Carved Gold Wood Typography 100% Tiếng Việt) -->
    <text x="408" y="118" text-anchor="middle" font-family="'Tiny5 Duo', 'Arial Black', monospace" font-weight="900" font-size="34" fill="#1a0c06" letter-spacing="2">TIỆM GÀ NHÀ TUI</text>
    <text x="407" y="116" text-anchor="middle" font-family="'Tiny5 Duo', 'Arial Black', monospace" font-weight="900" font-size="34" fill="#7a4805" letter-spacing="2">TIỆM GÀ NHÀ TUI</text>
    <text x="406" y="114" text-anchor="middle" font-family="'Tiny5 Duo', 'Arial Black', monospace" font-weight="900" font-size="34" fill="#f7d046" letter-spacing="2">TIỆM GÀ NHÀ TUI</text>

    <!-- Vạch phân cách chấm vàng retro -->
    <line x1="200" y1="128" x2="615" y2="128" stroke="#c98e1e" stroke-width="2" stroke-dasharray="8 4" />

    <!-- Dòng phụ đề Quán Gà Rán Hẻm 1102 -->
    <text x="406" y="152" text-anchor="middle" font-family="'VT323', 'Courier New', monospace" font-size="24" fill="#faeed1" font-weight="700" letter-spacing="1">QUÁN GÀ RÁN GIÒN RỤM · HẺM 1102</text>
    <text x="406" y="174" text-anchor="middle" font-family="'VT323', 'Courier New', monospace" font-size="18" fill="#ffd166" letter-spacing="1">✦ COZY INDIE TYCOON · STARDEW STYLE ✦</text>
  </svg>
  `;

  // 3. Composite các ảnh pixel mascot và đùi gà vào SVG
  const svgBuffer = Buffer.from(svgSign);

  const finalImage = await sharp(svgBuffer)
    .composite([
      {
        input: gabongBuf,
        top: 56,
        left: 28
      },
      {
        input: drumstickBuf,
        top: 106,
        left: 88
      },
      {
        input: neonBuf,
        top: 58,
        left: 584
      }
    ])
    .png()
    .toBuffer();

  // 4. Pixelate toàn bộ banner qua grid 16-bit và scale lại nearest-neighbor
  const lowRes = await sharp(finalImage)
    .resize(Math.round(W / 2), Math.round(H / 2), { kernel: 'lanczos3' })
    .modulate({ saturation: 1.25 })
    .toBuffer();

  const outPath = 'public/assets/ui/banner_stardew_chicken.png';
  await sharp(lowRes)
    .resize(W, H, { kernel: 'nearest' })
    .png({ palette: true, colours: 64 })
    .toFile(outPath);

  console.log(`✅ Đã xuất bản thành công Banner Stardew Tinh Chỉnh: ${outPath} (${W}x${H} px)!`);
}

buildBanner().catch(console.error);
