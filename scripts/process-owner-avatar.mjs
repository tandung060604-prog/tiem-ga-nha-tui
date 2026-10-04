import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const inputJpg = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\8ab6f6fc-02ef-4b75-872e-590db9f2508b\\char_owner_pixel_1791087116098.jpg';
const outSrc = 'assets-src/characters/char_01_owner.png';
const outPublic = 'public/assets/characters/char_01_owner.png';

async function processAvatar() {
  const BG_MIN = 225;
  const BG_MAX_SPREAD = 22;
  const EDGE_MIN = 180;

  const { data, info } = await sharp(inputJpg).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const isBg = i => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const min = Math.min(r, g, b);
    return min >= BG_MIN && Math.max(r, g, b) - min <= BG_MAX_SPREAD;
  };

  const removed = new Uint8Array(width * height);
  const stack = [];
  const push = i => { if (!removed[i] && isBg(i)) { removed[i] = 1; stack.push(i); } };

  for (let x = 0; x < width; x++) { push(x); push((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { push(y * width); push(y * width + width - 1); }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width, y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  for (let i = 0; i < width * height; i++) {
    if (removed[i]) {
      data[i * 4 + 3] = 0;
      continue;
    }
    const x = i % width, y = (i / width) | 0;
    const nearBg = (x > 0 && removed[i - 1]) || (x < width - 1 && removed[i + 1])
      || (y > 0 && removed[i - width]) || (y < height - 1 && removed[i + width]);
    const min = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    if (nearBg && min >= EDGE_MIN) {
      data[i * 4 + 3] = Math.round(255 * (255 - min) / (255 - EDGE_MIN));
    }
  }

  // Find bounding box
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, (maxX - minX) + pad * 2);
  const cropH = Math.min(height - cropY, (maxY - minY) + pad * 2);

  const pngBuffer = await sharp(data, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  writeFileSync(outSrc, pngBuffer);
  writeFileSync(outPublic, pngBuffer);
  console.log('✅ Đã tạo avatar pixel art thành công vào:', outPublic);
}

processAvatar().catch(err => {
  console.error(err);
  process.exit(1);
});
