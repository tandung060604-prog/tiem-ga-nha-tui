import sharp from 'sharp';
import fs from 'node:fs';

async function cleanBg() {
  const bgPath = 'public/assets/ui/landing_vn_bg.jpg';
  const meta = await sharp(bgPath).metadata();
  console.log(`Đang xử lý làm sạch text trên ảnh nền ${meta.width}x${meta.height}...`);

  // Tạo một lớp phủ gradient màu bầu trời / tường hẻm ấm cúng ở vùng y=80 đến y=380
  const overlaySvg = `
  <svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="warmHaze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#23120b" stop-opacity="0.98" />
        <stop offset="20%" stop-color="#2b1810" stop-opacity="0.96" />
        <stop offset="28%" stop-color="#3d2114" stop-opacity="0.92" />
        <stop offset="34%" stop-color="#5a3018" stop-opacity="0.80" />
        <stop offset="38%" stop-color="#8e542d" stop-opacity="0.45" />
        <stop offset="42%" stop-color="#8e542d" stop-opacity="0" />
      </linearGradient>
    </defs>
    <!-- Phủ vùng đỉnh và che sạch text cũ, hòa trộn mượt mà vào mái hiên và đèn lồng -->
    <rect x="0" y="0" width="${meta.width}" height="${meta.height}" fill="url(#warmHaze)" />
  </svg>
  `;

  const cleanPath = 'public/assets/ui/landing_vn_bg_clean.jpg';
  await sharp(bgPath)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(cleanPath);

  console.log('✅ Đã xuất bản thành công landing_vn_bg_clean.jpg!');
}

cleanBg().catch(console.error);
