import sharp from 'sharp';
import { existsSync } from 'node:fs';

const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/cca998b2-81e4-44d7-868b-8683332dd524';

const IMAGES = [
  { src: `${ARTIFACT_DIR}/char_shipper_walk_1790930475704.jpg`, out: 'public/assets/characters/char_19_shipper_walk.png' },
  { src: `${ARTIFACT_DIR}/char_student_walk_1790930514157.jpg`, out: 'public/assets/characters/char_30_student_walk.png' },
  { src: `${ARTIFACT_DIR}/char_office_walk_1790930534548.jpg`, out: 'public/assets/characters/char_07_office_walk.png' },
  { src: `${ARTIFACT_DIR}/char_takeaway_walk_1790930555944.jpg`, out: 'public/assets/characters/char_takeaway_walk.png' },
  { src: `${ARTIFACT_DIR}/pet_dog_vang_walk_1790930578082.jpg`, out: 'public/assets/characters/pet_01_dog_vang_walk.png' },
  { src: `${ARTIFACT_DIR}/pet_cat_muop_walk_1790930600763.jpg`, out: 'public/assets/characters/pet_02_cat_muop_walk.png' },
  { src: `${ARTIFACT_DIR}/pest_rat_cong_walk_1790930629352.jpg`, out: 'public/assets/characters/pest_01_rat_cong_walk.png' },
  { src: `${ARTIFACT_DIR}/mascot_gabong_walk_1790930652262.jpg`, out: 'public/assets/mascot/mascot_gabong_walk.png' },
];

const BG_MIN = 220;
const BG_MAX_SPREAD = 35;
const EDGE_MIN = 180;

async function processImage(srcPath, outPath) {
  if (!existsSync(srcPath)) {
    console.warn(`File not found: ${srcPath}`);
    return;
  }
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const isBg = (i) => {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const min = Math.min(r, g, b);
    return min >= BG_MIN && Math.max(r, g, b) - min <= BG_MAX_SPREAD;
  };

  const removed = new Uint8Array(width * height);
  const stack = [];
  const push = (i) => {
    if (!removed[i] && isBg(i)) {
      removed[i] = 1;
      stack.push(i);
    }
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  // Find bounding box of foreground
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let i = 0; i < width * height; i++) {
    if (removed[i]) {
      data[i * 4 + 3] = 0;
    } else {
      const x = i % width;
      const y = (i / width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      const nearBg = (x > 0 && removed[i - 1]) ||
                     (x < width - 1 && removed[i + 1]) ||
                     (y > 0 && removed[i - width]) ||
                     (y < height - 1 && removed[i + width]);
      const min = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
      if (nearBg && min >= EDGE_MIN) {
        data[i * 4 + 3] = Math.round(255 * (255 - min) / (255 - EDGE_MIN));
      }
    }
  }

  // Trim to bounding box
  const cropW = Math.max(1, maxX - minX + 1);
  const cropH = Math.max(1, maxY - minY + 1);

  await sharp(data, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .resize(256, 256, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);

  console.log(`Saved: ${outPath} (${cropW}x${cropH})`);
}

async function run() {
  for (const img of IMAGES) {
    await processImage(img.src, img.out);
  }
}

run().catch(console.error);
