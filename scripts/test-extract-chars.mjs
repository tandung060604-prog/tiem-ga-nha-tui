import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const BG_MIN = 225;
const BG_MAX_SPREAD = 25;
const EDGE_MIN = 180;
const PAD = 0.03;

async function load(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function removeBackground({ data, width, height }) {
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
    if (removed[i]) { data[i * 4 + 3] = 0; continue; }
    const x = i % width, y = (i / width) | 0;
    const nearBg = (x > 0 && removed[i - 1]) || (x < width - 1 && removed[i + 1])
      || (y > 0 && removed[i - width]) || (y < height - 1 && removed[i + width]);
    const min = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    if (nearBg && min >= EDGE_MIN) data[i * 4 + 3] = Math.round(255 * (255 - min) / (255 - EDGE_MIN));
  }
}

// Slice 2x2 grid (quadrants)
async function sliceQuad(srcPath, outNames) {
  const img = await load(srcPath);
  removeBackground(img);
  const halfW = Math.floor(img.width / 2);
  const halfH = Math.floor(img.height / 2);

  // 4 quadrants: [x0, y0, x1, y1]
  const quads = [
    { name: outNames[0], x: 0, y: 0, w: halfW, h: halfH },            // top-left: walk in
    { name: outNames[1], x: halfW, y: 0, w: halfW, h: halfH },        // top-right: stand
    { name: outNames[2], x: 0, y: halfH, w: halfW, h: halfH },        // bottom-left: angry / wait
    { name: outNames[3], x: halfW, y: halfH, w: halfW, h: halfH }     // bottom-right: leave
  ];

  for (const q of quads) {
    // Crop quadrant to memory
    const qBuf = Buffer.alloc(q.w * q.h * 4);
    for (let row = 0; row < q.h; row++) {
      for (let col = 0; col < q.w; col++) {
        const srcIdx = (q.y + row) * img.width + (q.x + col);
        const dstIdx = row * q.w + col;
        img.data.copy(qBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
      }
    }

    // Find bounding box inside quadrant (excluding bottom 18% where text labels might be)
    let minX = q.w, minY = q.h, maxX = 0, maxY = 0;
    const safeH = Math.floor(q.h * 0.88); // exclude text label below
    for (let row = 0; row < safeH; row++) {
      for (let col = 0; col < q.w; col++) {
        const idx = (row * q.w + col) * 4;
        if (qBuf[idx + 3] > 20) {
          if (col < minX) minX = col;
          if (col > maxX) maxX = col;
          if (row < minY) minY = row;
          if (row > maxY) maxY = row;
        }
      }
    }

    if (maxX <= minX || maxY <= minY) {
      console.warn(`Quadrant empty for ${q.name}`);
      continue;
    }

    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * PAD);
    const x0 = Math.max(0, minX - pad), y0 = Math.max(0, minY - pad);
    const x1 = Math.min(q.w - 1, maxX + pad), y1 = Math.min(safeH - 1, maxY + pad);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

    const figBuf = Buffer.alloc(cw * ch * 4);
    for (let row = 0; row < ch; row++) {
      for (let col = 0; col < cw; col++) {
        const srcIdx = (y0 + row) * q.w + (x0 + col);
        const dstIdx = row * cw + col;
        qBuf.copy(figBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
      }
    }

    const outFile = `public/assets/characters/${q.name}`;
    mkdirSync(dirname(outFile), { recursive: true });
    await sharp(figBuf, { raw: { width: cw, height: ch, channels: 4 } })
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 95 })
      .toFile(outFile);
    console.log(`✓ Processed ${outFile}`);
  }
}

// Slice 1x4 horizontal strip
async function sliceStrip1x4(srcPath, outNames) {
  const img = await load(srcPath);
  removeBackground(img);
  const colW = Math.floor(img.width / 4);
  const colH = img.height;

  for (let i = 0; i < 4; i++) {
    const q = { name: outNames[i], x: i * colW, y: 0, w: colW, h: colH };
    const qBuf = Buffer.alloc(q.w * q.h * 4);
    for (let row = 0; row < q.h; row++) {
      for (let col = 0; col < q.w; col++) {
        const srcIdx = (q.y + row) * img.width + (q.x + col);
        const dstIdx = row * q.w + col;
        img.data.copy(qBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
      }
    }

    // Connected components inside quadrant to isolate only the central figure
    const label = new Int32Array(q.w * q.h).fill(-1);
    const comps = [];
    for (let start = 0; start < q.w * q.h; start++) {
      if (label[start] !== -1 || qBuf[start * 4 + 3] === 0) continue;
      const c = { id: comps.length, area: 0, x0: q.w, y0: q.h, x1: 0, y1: 0 };
      const stack = [start];
      label[start] = c.id;
      while (stack.length) {
        const i = stack.pop();
        const x = i % q.w, y = (i / q.w) | 0;
        c.area++;
        if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x;
        if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
        for (const j of [x > 0 ? i - 1 : -1, x < q.w - 1 ? i + 1 : -1, y > 0 ? i - q.w : -1, y < q.h - 1 ? i + q.w : -1]) {
          if (j >= 0 && label[j] === -1 && qBuf[j * 4 + 3] > 0) { label[j] = c.id; stack.push(j); }
        }
      }
      comps.push(c);
    }

    if (!comps.length) continue;
    // The main figure is the largest component near the center
    const maxArea = Math.max(...comps.map(c => c.area));
    const mainComps = comps.filter(c => c.area >= maxArea * 0.1);
    // Find component closest to column center
    const centerX = q.w / 2;
    mainComps.sort((a, b) => Math.abs((a.x0 + a.x1) / 2 - centerX) - Math.abs((b.x0 + b.x1) / 2 - centerX));
    const targetComp = mainComps[0];
    
    // Also include smaller components (like detached buttons or hands) that are within targetComp x range
    const keptIds = new Set();
    keptIds.add(targetComp.id);
    for (const c of comps) {
      if (c.x0 >= targetComp.x0 - 10 && c.x1 <= targetComp.x1 + 10 && c.y0 >= targetComp.y0 - 10 && c.y1 <= targetComp.y1 + 10) {
        keptIds.add(c.id);
      }
    }

    const minX = targetComp.x0, minY = targetComp.y0, maxX = targetComp.x1, maxY = targetComp.y1;
    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * PAD);
    const x0 = Math.max(0, minX - pad), y0 = Math.max(0, minY - pad);
    const x1 = Math.min(q.w - 1, maxX + pad), y1 = Math.min(q.h - 1, maxY + pad);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

    const figBuf = Buffer.alloc(cw * ch * 4);
    for (let row = 0; row < ch; row++) {
      for (let col = 0; col < cw; col++) {
        const srcIdx = (y0 + row) * q.w + (x0 + col);
        if (!keptIds.has(label[srcIdx])) continue;
        const dstIdx = row * cw + col;
        qBuf.copy(figBuf, dstIdx * 4, srcIdx * 4, srcIdx * 4 + 4);
      }
    }

    const outFile = `public/assets/characters/${q.name}`;
    mkdirSync(dirname(outFile), { recursive: true });
    await sharp(figBuf, { raw: { width: cw, height: ch, channels: 4 } })
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 95 })
      .toFile(outFile);
    console.log(`✓ Processed ${outFile}`);
  }
}

async function main() {
  await sliceQuad('assets-src/characters/char_shipper_sheet.jpg', [
    'char_shipper_walk.png',
    'char_shipper_stand.png',
    'char_shipper_angry.png',
    'char_shipper_leave.png'
  ]);
  await sliceQuad('assets-src/characters/char_hocsinh_sheet.jpg', [
    'char_hocsinh_walk.png',
    'char_hocsinh_stand.png',
    'char_hocsinh_angry.png',
    'char_hocsinh_leave.png'
  ]);
  await sliceStrip1x4('assets-src/characters/char_vanphong_sheet.jpg', [
    'char_vanphong_walk.png',
    'char_vanphong_stand.png',
    'char_vanphong_angry.png',
    'char_vanphong_leave.png'
  ]);
  console.log('All 3 character sheets sliced successfully!');
}

main().catch(err => { console.error(err); process.exit(1); });
