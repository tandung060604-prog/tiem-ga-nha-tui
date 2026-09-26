import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

async function load(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function removeBackground({ data, width, height }) {
  // Concept sheet background is warm cream: R ~ 254, G ~ 248, B ~ 226
  const isBg = i => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    return (r >= 230 && g >= 220 && b >= 200) || (r >= 220 && g >= 220 && b >= 220);
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
    if (removed[i]) { data[i * 4 + 3] = 0; }
  }
}

// Extract a region and isolate main figure, excluding text labels at bottom
async function extractRegion(img, [rx, ry, rw, rh], outFile, excludeBottomRatio = 0.2) {
  const safeH = Math.round(rh * (1 - excludeBottomRatio));
  const qBuf = Buffer.alloc(rw * safeH * 4);
  for (let row = 0; row < safeH; row++) {
    for (let col = 0; col < rw; col++) {
      const srcIdx = (ry + row) * img.width + (rx + col);
      const dstIdx = row * rw + col;
      img.data.copy(qBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
    }
  }

  // Connected components to find main figure
  const label = new Int32Array(rw * safeH).fill(-1);
  const comps = [];
  for (let start = 0; start < rw * safeH; start++) {
    if (label[start] !== -1 || qBuf[start * 4 + 3] === 0) continue;
    const c = { id: comps.length, area: 0, x0: rw, y0: safeH, x1: 0, y1: 0 };
    const stack = [start];
    label[start] = c.id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % rw, y = (i / rw) | 0;
      c.area++;
      if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
      for (const j of [x > 0 ? i - 1 : -1, x < rw - 1 ? i + 1 : -1, y > 0 ? i - rw : -1, y < safeH - 1 ? i + rw : -1]) {
        if (j >= 0 && label[j] === -1 && qBuf[j * 4 + 3] > 0) { label[j] = c.id; stack.push(j); }
      }
    }
    comps.push(c);
  }

  if (!comps.length) return false;
  const maxArea = Math.max(...comps.map(c => c.area));
  // Keep all components that are part of the head/body (at least 5% of max area or inside bounding box)
  const mainComps = comps.filter(c => c.area >= maxArea * 0.05);
  const keptIds = new Set(mainComps.map(c => c.id));

  let minX = rw, minY = safeH, maxX = 0, maxY = 0;
  for (const c of mainComps) {
    if (c.x0 < minX) minX = c.x0;
    if (c.y0 < minY) minY = c.y0;
    if (c.x1 > maxX) maxX = c.x1;
    if (c.y1 > maxY) maxY = c.y1;
  }

  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const figBuf = Buffer.alloc(cw * ch * 4);
  for (let row = 0; row < ch; row++) {
    for (let col = 0; col < cw; col++) {
      const srcIdx = (minY + row) * rw + (minX + col);
      if (!keptIds.has(label[srcIdx])) continue;
      const dstIdx = row * cw + col;
      qBuf.copy(figBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
    }
  }

  mkdirSync(dirname(outFile), { recursive: true });
  await sharp(figBuf, { raw: { width: cw, height: ch, channels: 4 } })
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(outFile);
  return true;
}

// Composite character onto 512x512 canvas
async function compositeChar(headPath, bodyPath, outPath, options = {}) {
  const canvasSize = 512;
  const { headScale = 1.0, bodyScale = 1.0, headY = 40, bodyY = 190, headX = 0, bodyX = 0, flip = false } = options;

  let headSharp = sharp(headPath);
  let bodySharp = sharp(bodyPath);

  if (flip) {
    headSharp = headSharp.flop();
    bodySharp = bodySharp.flop();
  }

  const headBuf = await headSharp.resize(Math.round(230 * headScale), null, { fit: 'inside' }).png().toBuffer();
  const bodyBuf = await bodySharp.resize(Math.round(240 * bodyScale), null, { fit: 'inside' }).png().toBuffer();

  const headMeta = await sharp(headBuf).metadata();
  const bodyMeta = await sharp(bodyBuf).metadata();

  const bodyLeft = Math.round((canvasSize - bodyMeta.width) / 2) + bodyX;
  const headLeft = Math.round((canvasSize - headMeta.width) / 2) + headX;

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: bodyBuf, top: bodyY, left: bodyLeft },
    { input: headBuf, top: headY, left: headLeft }
  ]).png({ compressionLevel: 9, quality: 95 }).toFile(outPath);
  console.log(`✓ Composited ${outPath}`);
}async function main() {
  const conceptImg = await load('assets-src/characters/char_concept_sheet.jpg');
  removeBackground(conceptImg);

  // Heads: full head with hair and chin (75 to 310)
  await extractRegion(conceptImg, [45, 75, 235, 235], 'assets-src/scratch/head_smiling.png', 0.05);
  await extractRegion(conceptImg, [285, 75, 235, 235], 'assets-src/scratch/head_shocked.png', 0.05);
  await extractRegion(conceptImg, [525, 75, 235, 235], 'assets-src/scratch/head_crying.png', 0.05);
  await extractRegion(conceptImg, [755, 75, 235, 235], 'assets-src/scratch/head_karen.png', 0.05);

  // Outfits: full body down to shoes (420 to 710)
  await extractRegion(conceptImg, [45, 420, 180, 290], 'assets-src/scratch/outfit_school.png', 0.05);
  await extractRegion(conceptImg, [225, 420, 195, 290], 'assets-src/scratch/outfit_shipper.png', 0.05);
  await extractRegion(conceptImg, [425, 420, 185, 290], 'assets-src/scratch/outfit_office.png', 0.05);
  await extractRegion(conceptImg, [610, 420, 190, 290], 'assets-src/scratch/outfit_hoodie.png', 0.05);
  await extractRegion(conceptImg, [805, 420, 190, 290], 'assets-src/scratch/outfit_chef.png', 0.05);

  // 1. Chị Lan Khó Tính (Karen)
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_karen_stand.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25 });
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_karen_angry.png', { headScale: 1.05, bodyScale: 1.15, bodyY: 195, headY: 20 });
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_karen_walk.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_karen_leave.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25, headX: 10 });

  // 2. Đức Huy Game Thủ Cú Đêm
  await compositeChar('assets-src/scratch/head_shocked.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_gamethu_stand.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_gamethu_angry.png', { headScale: 1.0, bodyScale: 1.15, bodyY: 195, headY: 25 });
  await compositeChar('assets-src/scratch/head_shocked.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_gamethu_walk.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_gamethu_leave.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25 });

  // 3. Quỳnh Anh Tiktoker Food Reviewer
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_tiktoker_stand.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_tiktoker_angry.png', { headScale: 1.0, bodyScale: 1.15, bodyY: 195, headY: 25 });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_tiktoker_walk.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_hoodie.png', 'public/assets/characters/char_tiktoker_leave.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 195, headY: 25 });

  // 4. Bé Na & Bạn Trai / Cặp đôi GenZ
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_capdoi_stand.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_capdoi_angry.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_capdoi_walk.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_capdoi_leave.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });

  // 5. Bé Bắp (Trẻ em tiểu học)
  await compositeChar('assets-src/scratch/head_shocked.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_becon_stand.png', { headScale: 1.05, bodyScale: 0.95, bodyY: 215, headY: 55 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_becon_angry.png', { headScale: 1.05, bodyScale: 0.95, bodyY: 215, headY: 55 });
  await compositeChar('assets-src/scratch/head_shocked.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_becon_walk.png', { headScale: 1.05, bodyScale: 0.95, bodyY: 215, headY: 55, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_school.png', 'public/assets/characters/char_becon_leave.png', { headScale: 1.05, bodyScale: 0.95, bodyY: 215, headY: 55 });

  // 6. Anh Long Trưởng Phòng
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_truongphong_stand.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_shocked.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_truongphong_angry.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_truongphong_walk.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_truongphong_leave.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });

  // 7. Mẹ Con Su Su
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_mecon_stand.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_mecon_angry.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_mecon_walk.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_office.png', 'public/assets/characters/char_mecon_leave.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });

  // 8. Bà Bảy Chợ Cũ
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_chef.png', 'public/assets/characters/char_babay_stand.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_crying.png', 'assets-src/scratch/outfit_chef.png', 'public/assets/characters/char_babay_angry.png', { headScale: 0.95, bodyScale: 1.15, bodyY: 190, headY: 25 });
  await compositeChar('assets-src/scratch/head_karen.png', 'assets-src/scratch/outfit_chef.png', 'public/assets/characters/char_babay_walk.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25, flip: true });
  await compositeChar('assets-src/scratch/head_smiling.png', 'assets-src/scratch/outfit_chef.png', 'public/assets/characters/char_babay_leave.png', { headScale: 0.92, bodyScale: 1.15, bodyY: 190, headY: 25 });
  console.log('All composite characters generated cleanly!');
}

main().catch(err => { console.error(err); process.exit(1); });
