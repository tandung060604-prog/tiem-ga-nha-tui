import sharp from 'sharp';
import fs from 'node:fs';

async function prepareCover() {
  const localRepoPath = 'assets-src/ui/stardew_cover_art_raw.jpg';
  const fallbackPath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\8563f67a-47be-4728-ac78-b7cca4abe939\\stardew_cover_art_1790695637709.jpg';
  const srcPath = fs.existsSync(localRepoPath) ? localRepoPath : fallbackPath;
  console.log('--- Đang tinh chỉnh Cover Art Pixel chuẩn từng pixel từ:', srcPath);

  const meta = await sharp(srcPath).metadata();
  const W = meta.width;  // 768
  const H = meta.height; // 1376

  // Tọa độ chuẩn xác 100% của bảng hiệu quầy xe gà (đo đạc chính xác):
  const cx = 558;
  const cy = 464;
  const angle = -20.8;
  const w = 312;
  const h = 74;

  const overlaySvg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Phủ hoàng hôn ấm xóa sạch chữ ở đỉnh -->
      <linearGradient id="duskHaze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#140703" stop-opacity="1" />
        <stop offset="20%" stop-color="#1a0a04" stop-opacity="1" />
        <stop offset="26%" stop-color="#240e06" stop-opacity="0.98" />
        <stop offset="32%" stop-color="#3d1b0d" stop-opacity="0.85" />
        <stop offset="37%" stop-color="#5a2712" stop-opacity="0.3" />
        <stop offset="40%" stop-color="#5a2712" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- Phủ bầu trời hoàng hôn đỉnh che triệt để chữ thừa -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#duskHaze)" />

    <!-- Biển hiệu quầy xe đẩy che khít 100% toàn bộ khung gỗ "GÀ RÁN PHỐ CAO" -->
    <g transform="translate(${cx}, ${cy}) rotate(${angle})">
      <!-- Khung viền gỗ mộc sồi -->
      <rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="2" fill="#faeed1" stroke="#422212" stroke-width="4"/>
      <!-- Nền gỗ kem sáng -->
      <rect x="${-w/2+4}" y="${-h/2+4}" width="${w-8}" height="${h-8}" fill="#fcf4e3"/>
      <!-- Đường viền chỉ vàng kim -->
      <rect x="${-w/2+6}" y="${-h/2+6}" width="${w-12}" height="${h-12}" fill="none" stroke="#c49654" stroke-width="1.5"/>

      <!-- Chữ chính TIỆM GÀ NHÀ TUI phong cách Pixel Retro 100% Tiếng Việt -->
      <text x="0" y="5" text-anchor="middle" font-family="'Tiny5 Duo', 'Arial Black', sans-serif" font-weight="900" font-size="21" fill="#8b1818" letter-spacing="1">TIỆM GÀ NHÀ TUI</text>
      <!-- Dòng phụ đề quán -->
      <text x="0" y="24" text-anchor="middle" font-family="'VT323', monospace" font-weight="bold" font-size="14" fill="#7a4805" letter-spacing="1">✦ HẺM 1102 · GIÒN RỤM ✦</text>

      <!-- Đèn tròn vàng ấm áp phía trên biển hiệu -->
      <circle cx="-60" cy="${-h/2}" r="8" fill="#ffeaa7" opacity="0.9" />
      <circle cx="-60" cy="${-h/2}" r="4" fill="#ffffff" />
      <circle cx="50" cy="${-h/2}" r="8" fill="#ffeaa7" opacity="0.9" />
      <circle cx="50" cy="${-h/2}" r="4" fill="#ffffff" />
    </g>
  </svg>
  `;

  const finalCover = await sharp(srcPath)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toBuffer();

  const out1 = 'public/assets/ui/stardew_cover_art.jpg';
  const out2 = 'public/assets/ui/landing_vn_bg.jpg';
  const out3 = 'public/assets/ui/landing_vn_bg_clean.jpg';

  fs.writeFileSync(out1, finalCover);
  fs.writeFileSync(out2, finalCover);
  fs.writeFileSync(out3, finalCover);

  console.log(`✅ Đã xuất bản thành công Cover Banner Stardew Pixel Art hoàn chỉnh 100%!`);
}

prepareCover().catch(console.error);
