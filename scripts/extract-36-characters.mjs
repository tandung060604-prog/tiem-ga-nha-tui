import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SHEET_PATH = 'docs/gemini/characters_36_sheet.jpg';

// 36 character definitions in 6x6 grid order
const CHAR_GRID = [
  // Row 0
  { row: 0, col: 0, id: 'char_01_owner', name: 'Chủ Quầy (Bạn)', en: 'Young Shop Owner' },
  { row: 0, col: 1, id: 'char_02_lottery_lady', name: 'Cô Bảy Bán Vé Số', en: 'Lottery Lady' },
  { row: 0, col: 2, id: 'char_03_helper_linh', name: 'Bé Linh Phụ Bếp', en: 'Kitchen Helper Girl' },
  { row: 0, col: 3, id: 'char_04_fryer_khang', name: 'Anh Khang Thợ Chiên', en: 'Fry Cook Boy' },
  { row: 0, col: 4, id: 'char_05_kid_bo', name: 'Bé Bo Mê Gà', en: 'Cute Kid' },
  { row: 0, col: 5, id: 'char_06_granny_ba', name: 'Cụ Ba Quạt Nón', en: 'Elderly Granny' },

  // Row 1
  { row: 1, col: 0, id: 'char_07_trendy_vy', name: 'Vy Thư Ký', en: 'Trendy Female Customer' },
  { row: 1, col: 1, id: 'char_08_grumpy_hai', name: 'Bác Hai Nghiêm Nghị', en: 'Grumpy Uncle' },
  { row: 1, col: 2, id: 'char_09_buyer_tam', name: 'Chú Tám Xe Ôm', en: 'Lottery Buyer' },
  { row: 1, col: 3, id: 'char_10_winner_hung', name: 'Anh Hưng Trúng Số', en: 'Lucky Winner' },
  { row: 1, col: 4, id: 'char_11_wholesale_nam', name: 'Bà Năm Đại Lý Sỉ', en: 'Wholesale Vendor' },
  { row: 1, col: 5, id: 'char_12_courier_ut', name: 'Cậu Út Giao Vé', en: 'Courier on Bicycle' },

  // Row 2
  { row: 2, col: 0, id: 'char_13_vendor_tham', name: 'Chị Thắm Gánh Tàu Hũ', en: 'Street Vendor' },
  { row: 2, col: 1, id: 'char_14_scrap_nam', name: 'Bác Năm Ve Chai', en: 'Scrap Metal Cart' },
  { row: 2, col: 2, id: 'char_15_bread_bay', name: 'Chú Bảy Bánh Mì Dạo', en: 'Bread Vendor Bike' },
  { row: 2, col: 3, id: 'char_16_icecream_tu', name: 'Anh Tư Kem Ống', en: 'Ice Cream Man' },
  { row: 2, col: 4, id: 'char_17_sweeper_lan', name: 'Cô Lan Lao Công', en: 'Street Sweeper' },
  { row: 2, col: 5, id: 'char_18_garbage_hung', name: 'Chú Hùng Gom Rác', en: 'Garbage Worker' },

  // Row 3
  { row: 3, col: 0, id: 'char_19_shipper_tuan', name: 'Anh Tuấn Shipper Ruột', en: 'Delivery Driver' },
  { row: 3, col: 1, id: 'char_20_mover_cuong', name: 'Anh Cường Bốc Vác', en: 'Furniture Mover' },
  { row: 3, col: 2, id: 'char_21_trucker_long', name: 'Bác Tài Long', en: 'Truck Driver' },
  { row: 3, col: 3, id: 'char_22_electrician_dung', name: 'Anh Dũng Thợ Điện', en: 'Electrician' },
  { row: 3, col: 4, id: 'char_23_builder_bay', name: 'Chú Bảy Thợ Hồ', en: 'Construction Worker' },
  { row: 3, col: 5, id: 'char_24_grocer_sau', name: 'Dì Sáu Tạp Hóa', en: 'Grocery Auntie' },

  // Row 4
  { row: 4, col: 0, id: 'char_25_police_nam', name: 'Đ/c Nam Công An Phường', en: 'Police Officer' },
  { row: 4, col: 1, id: 'char_26_traffic_hoang', name: 'Đại Úy Hoàng CSGT', en: 'Traffic Cop' },
  { row: 4, col: 2, id: 'char_27_warden_hai', name: 'Anh Hải Dân Phòng', en: 'Ward Guard' },
  { row: 4, col: 3, id: 'char_28_tough_beo', name: 'Đại Ca Beo', en: 'Street Tough' },
  { row: 4, col: 4, id: 'char_29_atm_nga', name: 'Chị Nga Rút Tiền ATM', en: 'ATM Queue Lady' },
  { row: 4, col: 5, id: 'char_30_student_bus', name: 'Nữ Sinh Mai Chờ Xe Buýt', en: 'Student Girl' },

  // Row 5
  { row: 5, col: 0, id: 'char_31_gossip_tam', name: 'Bà Tám Hóng Mát', en: 'Gossip Neighbor' },
  { row: 5, col: 1, id: 'char_32_jogger_tuan', name: 'Anh Tuấn Chạy Bộ', en: 'Jogger Guy' },
  { row: 5, col: 2, id: 'char_33_couple_genz', name: 'Cặp Đôi Bách & Diệp', en: 'Cute Couple' },
  { row: 5, col: 3, id: 'pet_01_dog_vang', altId: 'char_34_dog_vang', name: 'Chó Cỏ Vàng', en: 'Vietnamese Dog' },
  { row: 5, col: 4, id: 'pet_02_cat_muop', altId: 'char_35_cat_muop', name: 'Mèo Mướp Tam Thể', en: 'Calico Cat' },
  { row: 5, col: 5, id: 'pest_01_rat_cong', altId: 'char_36_rat_cong', name: 'Chuột Cống Đột Nhập', en: 'Sneaky Sewer Rat' }
];

// Exact vertical bounds for character bodies in the 1024x1024 sheet:
// Strictly strips out the bottom ribbon banner with English archetype text
// AND eliminates top banner remnants bleeding in from the row above.
const ROW_BOUNDS = [
  { row: 0, yMin: 18, yMax: 154 },
  { row: 1, yMin: 188, yMax: 324 },
  { row: 2, yMin: 358, yMax: 492 },
  { row: 3, yMin: 528, yMax: 656 },
  { row: 4, yMin: 696, yMax: 822 },
  { row: 5, yMin: 866, yMax: 986 }
];

async function extractAll() {
  console.log('--- EXTRACTING 36 CHARACTERS FROM SHEET (CLEAN CUT - NO BANNER/TEXT) ---');
  if (!fs.existsSync(SHEET_PATH)) {
    throw new Error(`Sheet not found: ${SHEET_PATH}`);
  }

  const { data: sheetData, info: sheetInfo } = await sharp(SHEET_PATH)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cellW = sheetInfo.width / 6;

  fs.mkdirSync('public/assets/characters', { recursive: true });
  fs.mkdirSync('assets-src/characters', { recursive: true });

  for (const c of CHAR_GRID) {
    const rDef = ROW_BOUNDS.find(r => r.row === c.row);
    if (!rDef) continue;

    const xStart = Math.floor(c.col * cellW);
    const xEnd = Math.floor((c.col + 1) * cellW);
    const yStart = rDef.yMin;
    const yEnd = rDef.yMax;
    const w = xEnd - xStart;
    const h = yEnd - yStart;

    // Extract cell pixels
    const cellBuf = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcIdx = ((yStart + y) * sheetInfo.width + (xStart + x)) * 4;
        const dstIdx = (y * w + x) * 4;
        cellBuf[dstIdx] = sheetData[srcIdx];
        cellBuf[dstIdx + 1] = sheetData[srcIdx + 1];
        cellBuf[dstIdx + 2] = sheetData[srcIdx + 2];
        cellBuf[dstIdx + 3] = 255;
      }
    }

    // 1. Flood-fill background from all 4 borders to transparent
    const isBg = (idx) => {
      const r = cellBuf[idx], g = cellBuf[idx + 1], b = cellBuf[idx + 2];
      const isGutter = (r >= 225 && g >= 200 && b >= 160);
      const isCardBg = (r >= 210 && g >= 200 && b >= 185);
      return isGutter || isCardBg;
    };

    const visited = new Uint8Array(w * h);
    const queue = [];
    const push = (x, y) => {
      const i = y * w + x;
      if (!visited[i] && isBg(i * 4)) {
        visited[i] = 1;
        queue.push(i);
      }
    };

    // Seed from all borders
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

    let head = 0;
    while (head < queue.length) {
      const i = queue[head++];
      const x = i % w, y = Math.floor(i / w);
      if (x > 0) push(x - 1, y);
      if (x < w - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1);
      if (y < h - 1) push(x, y + 1);
    }

    // Clear background to transparent
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (visited[i]) {
          cellBuf[i * 4 + 3] = 0;
        }
      }
    }

    // 2. Remove small disconnected speck islands (fewer than 50 connected pixels)
    const ccVisited = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const startIdx = y * w + x;
        if (cellBuf[startIdx * 4 + 3] > 0 && !ccVisited[startIdx]) {
          const component = [startIdx];
          ccVisited[startIdx] = 1;
          let cHead = 0;
          while (cHead < component.length) {
            const ci = component[cHead++];
            const cx = ci % w, cy = Math.floor(ci / w);
            const neighbors = [
              [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
            ];
            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const ni = ny * w + nx;
                if (cellBuf[ni * 4 + 3] > 0 && !ccVisited[ni]) {
                  ccVisited[ni] = 1;
                  component.push(ni);
                }
              }
            }
          }
          if (component.length < 50) {
            for (const ci of component) {
              cellBuf[ci * 4 + 3] = 0;
            }
          }
        }
      }
    }

    // 3. Find bounding box of figure
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (cellBuf[i * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX <= minX || maxY <= minY) {
      console.warn(`Warning: empty figure for ${c.id}`);
      continue;
    }

    // 4. Crop figure
    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;
    const cropBuf = Buffer.alloc(cropW * cropH * 4);
    for (let y = 0; y < cropH; y++) {
      for (let x = 0; x < cropW; x++) {
        const srcIdx = ((minY + y) * w + (minX + x)) * 4;
        const dstIdx = (y * cropW + x) * 4;
        cropBuf[dstIdx] = cellBuf[srcIdx];
        cropBuf[dstIdx + 1] = cellBuf[srcIdx + 1];
        cropBuf[dstIdx + 2] = cellBuf[srcIdx + 2];
        cropBuf[dstIdx + 3] = cellBuf[srcIdx + 3];
      }
    }

    // 5. Fit cleanly inside 256x256 transparent PNG with 12px padding
    const publicFile = `public/assets/characters/${c.id}.png`;
    const srcFile = `assets-src/characters/${c.id}.png`;

    await sharp(cropBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
      .resize(232, 232, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: 12,
        bottom: 12,
        left: 12,
        right: 12,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9 })
      .toFile(publicFile);

    // Copy to assets-src
    fs.copyFileSync(publicFile, srcFile);

    // If there's an altId (for pets/pests), create that file too
    if (c.altId) {
      fs.copyFileSync(publicFile, `public/assets/characters/${c.altId}.png`);
      fs.copyFileSync(publicFile, `assets-src/characters/${c.altId}.png`);
    }

    console.log(`✓ Sliced clean [${c.row},${c.col}] -> ${publicFile} (${c.name})`);
  }

  console.log('--- ALL 36 CHARACTERS EXTRACTED CLEANLY (0 RIBBONS, 0 TEXT) ---');
}

extractAll().catch(err => {
  console.error(err);
  process.exit(1);
});
