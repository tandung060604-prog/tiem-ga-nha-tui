import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAIN_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/cca998b2-81e4-44d7-868b-8683332dd524';
const OUT_DIR = 'public/assets/staff';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Hàm cắt ảnh từ sheet, tách nền trắng thành trong suốt, snap pixel 16-bit
async function extractSprite(sheetPath, cropBox, options = {}) {
  const { hue = 0, sat = 1.15, bright = 1.0, outSize = 128 } = options;
  const { left, top, width, height } = cropBox;

  // 1. Cắt vùng nhân vật và lấy raw buffer RGBA
  const { data, info } = await sharp(sheetPath)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = info.width * info.height;
  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    // Tách nền trắng thuần hoặc xám rất nhạt
    if (r > 225 && g > 225 && b > 225) {
      data[idx + 3] = 0; // Trong suốt
    } else if (r > 210 && g > 210 && b > 210) {
      const diff = Math.max(r, g, b) - Math.min(r, g, b);
      if (diff < 15) data[idx + 3] = 0;
    }
  }

  // 2. Downscale snap pixel grid 48x48
  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' });

  if (hue !== 0) pipeline = pipeline.modulate({ hue });
  if (sat !== 1.0) pipeline = pipeline.modulate({ saturation: sat });
  if (bright !== 1.0) pipeline = pipeline.modulate({ brightness: bright });

  const pixelBuffer = await pipeline.png().toBuffer();

  // 3. Alpha threshold để đường viền pixel sắc bén tuyệt đối
  const { data: gridData, info: gridInfo } = await sharp(pixelBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < gridInfo.width * gridInfo.height; i++) {
    const a = gridData[i * 4 + 3];
    gridData[i * 4 + 3] = a > 110 ? 255 : 0;
  }

  // 4. Upscale nearest neighbor về outSize chuẩn
  return sharp(gridData, {
    raw: { width: gridInfo.width, height: gridInfo.height, channels: 4 }
  })
    .resize(outSize, outSize, { kernel: 'nearest' })
    .png({ quality: 95, compressionLevel: 8 });
}

// Hàm xử lý sprite có sẵn (từ assets-src/characters)
async function processExistingCharacter(srcPath, outputPath, options = {}) {
  const { hue = 0, sat = 1.15, bright = 1.0, outSize = 128 } = options;
  let pipeline = sharp(srcPath).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' });
  if (hue !== 0) pipeline = pipeline.modulate({ hue });
  if (sat !== 1.0) pipeline = pipeline.modulate({ saturation: sat });
  if (bright !== 1.0) pipeline = pipeline.modulate({ brightness: bright });

  const buf = await pipeline.png().toBuffer();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < info.width * info.height; i++) {
    data[i * 4 + 3] = data[i * 4 + 3] > 110 ? 255 : 0;
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize(outSize, outSize, { kernel: 'nearest' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);
}

async function run() {
  console.log('🚀 Bắt đầu tạo toàn bộ 72 model 2D pixel art Stardew Valley cho 6 lớp nhân viên...');

  // ==========================================
  // 1. COOKS (BẾP CHIÊN)
  // ==========================================
  const cookSheet = path.join(BRAIN_DIR, 'staff_sheet_cooks_1790817261774.jpg');
  // 4 nhân vật từ trái sang phải:
  // Character 1: left 55, top 250, width 170, height 500 (Apprentice Tí Lạc)
  // Character 2: left 280, top 270, width 215, height 480 (Bé Hạnh lắc khoai)
  // Character 3: left 495, top 250, width 225, height 500 (Chú Ba chiên)
  // Character 4: left 755, top 230, width 250, height 520 (Masterchef hoàng kim)
  
  // Cook C1..C4
  await (await extractSprite(cookSheet, { left: 55, top: 250, width: 170, height: 500 })).toFile(path.join(OUT_DIR, 'cook_c1.png'));
  await (await extractSprite(cookSheet, { left: 280, top: 270, width: 215, height: 480 })).toFile(path.join(OUT_DIR, 'cook_c2.png'));
  await (await extractSprite(cookSheet, { left: 55, top: 250, width: 170, height: 500 }, { hue: 45, sat: 1.2 })).toFile(path.join(OUT_DIR, 'cook_c3.png'));
  await (await extractSprite(cookSheet, { left: 280, top: 270, width: 215, height: 480 }, { hue: -35, sat: 1.1 })).toFile(path.join(OUT_DIR, 'cook_c4.png'));
  await (await extractSprite(cookSheet, { left: 55, top: 250, width: 170, height: 500 })).toFile(path.join(OUT_DIR, 'cook_c.png'));

  // Cook R1..R4
  await (await extractSprite(cookSheet, { left: 495, top: 250, width: 225, height: 500 })).toFile(path.join(OUT_DIR, 'cook_r1.png'));
  await (await extractSprite(cookSheet, { left: 495, top: 250, width: 225, height: 500 }, { hue: 60 })).toFile(path.join(OUT_DIR, 'cook_r2.png'));
  await (await extractSprite(cookSheet, { left: 280, top: 270, width: 215, height: 480 }, { hue: 140, sat: 1.3 })).toFile(path.join(OUT_DIR, 'cook_r3.png'));
  await (await extractSprite(cookSheet, { left: 495, top: 250, width: 225, height: 500 }, { bright: 1.15, sat: 1.25 })).toFile(path.join(OUT_DIR, 'cook_r4.png'));
  await (await extractSprite(cookSheet, { left: 495, top: 250, width: 225, height: 500 })).toFile(path.join(OUT_DIR, 'cook_r.png'));

  // Cook SR1..SR3 & SSR
  await (await extractSprite(cookSheet, { left: 755, top: 230, width: 250, height: 520 }, { hue: -30 })).toFile(path.join(OUT_DIR, 'cook_sr1.png'));
  await (await extractSprite(cookSheet, { left: 755, top: 230, width: 250, height: 520 }, { hue: 35 })).toFile(path.join(OUT_DIR, 'cook_sr2.png'));
  await (await extractSprite(cookSheet, { left: 755, top: 230, width: 250, height: 520 }, { bright: 1.2, sat: 1.3 })).toFile(path.join(OUT_DIR, 'cook_sr3.png'));
  await (await extractSprite(cookSheet, { left: 755, top: 230, width: 250, height: 520 })).toFile(path.join(OUT_DIR, 'cook_sr.png'));
  await (await extractSprite(cookSheet, { left: 755, top: 230, width: 250, height: 520 }, { sat: 1.4, bright: 1.1 })).toFile(path.join(OUT_DIR, 'cook_ssr.png'));
  console.log('✓ 12 model Cook hoàn tất!');

  // ==========================================
  // 2. WAITERS (PHỤC VỤ)
  // ==========================================
  const waiterSheet = path.join(BRAIN_DIR, 'staff_sheet_waiters_1790817284168.jpg');
  // Row 1 (top: 75, height: 430):
  // Character 1: left 38, width 210 (Bé Mai thắt bím)
  // Character 2: left 305, width 255 (Chàng trai bưng khay soda)
  // Character 3: left 565, width 160 (Nữ phục vụ senior tóc xám)
  // Character 4: left 730, width 255 (Quản gia hoàng gia SSR)

  // Waiter C1..C4
  await (await extractSprite(waiterSheet, { left: 38, top: 75, width: 210, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_c1.png'));
  await (await extractSprite(waiterSheet, { left: 38, top: 75, width: 210, height: 430 }, { hue: 45 })).toFile(path.join(OUT_DIR, 'waiter_c2.png'));
  await (await extractSprite(waiterSheet, { left: 305, top: 75, width: 255, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_c3.png'));
  await (await extractSprite(waiterSheet, { left: 38, top: 75, width: 210, height: 430 }, { hue: -50, sat: 1.2 })).toFile(path.join(OUT_DIR, 'waiter_c4.png'));
  await (await extractSprite(waiterSheet, { left: 38, top: 75, width: 210, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_c.png'));

  // Waiter R1..R4
  await (await extractSprite(waiterSheet, { left: 305, top: 75, width: 255, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_r1.png'));
  await (await extractSprite(waiterSheet, { left: 305, top: 75, width: 255, height: 430 }, { hue: 70 })).toFile(path.join(OUT_DIR, 'waiter_r2.png'));
  await (await extractSprite(waiterSheet, { left: 565, top: 75, width: 160, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_r3.png'));
  await (await extractSprite(waiterSheet, { left: 305, top: 75, width: 255, height: 430 }, { hue: -40, bright: 1.1 })).toFile(path.join(OUT_DIR, 'waiter_r4.png'));
  await (await extractSprite(waiterSheet, { left: 305, top: 75, width: 255, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_r.png'));

  // Waiter SR1..SR3 & SSR
  await (await extractSprite(waiterSheet, { left: 565, top: 75, width: 160, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_sr1.png'));
  await (await extractSprite(waiterSheet, { left: 565, top: 75, width: 160, height: 430 }, { hue: 45, sat: 1.3 })).toFile(path.join(OUT_DIR, 'waiter_sr2.png'));
  await (await extractSprite(waiterSheet, { left: 730, top: 75, width: 255, height: 430 }, { hue: -30 })).toFile(path.join(OUT_DIR, 'waiter_sr3.png'));
  await (await extractSprite(waiterSheet, { left: 565, top: 75, width: 160, height: 430 })).toFile(path.join(OUT_DIR, 'waiter_sr.png'));
  await (await extractSprite(waiterSheet, { left: 730, top: 75, width: 255, height: 430 }, { sat: 1.4, bright: 1.15 })).toFile(path.join(OUT_DIR, 'waiter_ssr.png'));
  console.log('✓ 12 model Waiter hoàn tất!');

  // ==========================================
  // 3. CASHIERS (THU NGÂN)
  // ==========================================
  const cashierSheet = path.join(BRAIN_DIR, 'staff_sheet_cashiers_1790817304822.jpg');
  // Character 1: left 15, top 180, width 240, height 680 (Bé Thu Ngân nơ cam)
  // Character 2: left 270, top 180, width 245, height 680 (Nam Thu Ngân máy POS)
  // Character 3: left 520, top 180, width 250, height 680 (Idol TikTok hoodie gậy selfie)
  // Character 4: left 770, top 180, width 240, height 680 (Nữ Hoàng Áo Dài SSR bàn tính vàng)

  // Cashier C1..C4
  await (await extractSprite(cashierSheet, { left: 15, top: 180, width: 240, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_c1.png'));
  await (await extractSprite(cashierSheet, { left: 15, top: 180, width: 240, height: 680 }, { hue: 45 })).toFile(path.join(OUT_DIR, 'cashier_c2.png'));
  await (await extractSprite(cashierSheet, { left: 270, top: 180, width: 245, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_c3.png'));
  await (await extractSprite(cashierSheet, { left: 15, top: 180, width: 240, height: 680 }, { hue: -50, sat: 1.2 })).toFile(path.join(OUT_DIR, 'cashier_c4.png'));
  await (await extractSprite(cashierSheet, { left: 15, top: 180, width: 240, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_c.png'));

  // Cashier R1..R4
  await (await extractSprite(cashierSheet, { left: 270, top: 180, width: 245, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_r1.png'));
  await (await extractSprite(cashierSheet, { left: 270, top: 180, width: 245, height: 680 }, { hue: 80 })).toFile(path.join(OUT_DIR, 'cashier_r2.png'));
  await (await extractSprite(cashierSheet, { left: 520, top: 180, width: 250, height: 680 }, { hue: -35 })).toFile(path.join(OUT_DIR, 'cashier_r3.png'));
  await (await extractSprite(cashierSheet, { left: 270, top: 180, width: 245, height: 680 }, { bright: 1.15, sat: 1.2 })).toFile(path.join(OUT_DIR, 'cashier_r4.png'));
  await (await extractSprite(cashierSheet, { left: 270, top: 180, width: 245, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_r.png'));

  // Cashier SR1..SR3 & SSR
  await (await extractSprite(cashierSheet, { left: 520, top: 180, width: 250, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_sr1.png'));
  await (await extractSprite(cashierSheet, { left: 520, top: 180, width: 250, height: 680 }, { hue: 50, sat: 1.3 })).toFile(path.join(OUT_DIR, 'cashier_sr2.png'));
  await (await extractSprite(cashierSheet, { left: 770, top: 180, width: 240, height: 680 }, { hue: -25 })).toFile(path.join(OUT_DIR, 'cashier_sr3.png'));
  await (await extractSprite(cashierSheet, { left: 520, top: 180, width: 250, height: 680 })).toFile(path.join(OUT_DIR, 'cashier_sr.png'));
  await (await extractSprite(cashierSheet, { left: 770, top: 180, width: 240, height: 680 }, { sat: 1.45, bright: 1.15 })).toFile(path.join(OUT_DIR, 'cashier_ssr.png'));
  console.log('✓ 12 model Cashier hoàn tất!');

  // ==========================================
  // 4. DELIVERY (GIAO HÀNG / SHIPPER)
  // ==========================================
  const shipperTuan = 'assets-src/characters/char_19_shipper_tuan.png';
  const courierUt = 'assets-src/characters/char_12_courier_ut.png';
  const moverCuong = 'assets-src/characters/char_20_mover_cuong.png';
  const truckerLong = 'assets-src/characters/char_21_trucker_long.png';

  // Delivery C1..C4
  await processExistingCharacter(shipperTuan, path.join(OUT_DIR, 'delivery_c1.png'));
  await processExistingCharacter(shipperTuan, path.join(OUT_DIR, 'delivery_c2.png'), { hue: 45 });
  await processExistingCharacter(courierUt, path.join(OUT_DIR, 'delivery_c3.png'));
  await processExistingCharacter(shipperTuan, path.join(OUT_DIR, 'delivery_c4.png'), { hue: -50, sat: 1.2 });
  await processExistingCharacter(shipperTuan, path.join(OUT_DIR, 'delivery_c.png'));

  // Delivery R1..R4
  await processExistingCharacter(courierUt, path.join(OUT_DIR, 'delivery_r1.png'), { sat: 1.25 });
  await processExistingCharacter(courierUt, path.join(OUT_DIR, 'delivery_r2.png'), { hue: 70 });
  await processExistingCharacter(moverCuong, path.join(OUT_DIR, 'delivery_r3.png'));
  await processExistingCharacter(courierUt, path.join(OUT_DIR, 'delivery_r4.png'), { bright: 1.15 });
  await processExistingCharacter(courierUt, path.join(OUT_DIR, 'delivery_r.png'));

  // Delivery SR1..SR3 & SSR
  await processExistingCharacter(truckerLong, path.join(OUT_DIR, 'delivery_sr1.png'));
  await processExistingCharacter(moverCuong, path.join(OUT_DIR, 'delivery_sr2.png'), { sat: 1.35, bright: 1.1 });
  await processExistingCharacter(truckerLong, path.join(OUT_DIR, 'delivery_sr3.png'), { hue: 35, sat: 1.3 });
  await processExistingCharacter(truckerLong, path.join(OUT_DIR, 'delivery_sr.png'));
  await processExistingCharacter(truckerLong, path.join(OUT_DIR, 'delivery_ssr.png'), { sat: 1.5, bright: 1.25, hue: 15 });
  console.log('✓ 12 model Delivery hoàn tất!');

  // ==========================================
  // 5. MANAGER (QUẢN LÝ)
  // ==========================================
  const winnerHung = 'assets-src/characters/char_10_winner_hung.png';
  const wardenHai = 'assets-src/characters/char_27_warden_hai.png';
  const owner = 'assets-src/characters/char_01_owner.png';
  const electricianDung = 'assets-src/characters/char_22_electrician_dung.png';

  // Manager C1..C4
  await processExistingCharacter(winnerHung, path.join(OUT_DIR, 'manager_c1.png'));
  await processExistingCharacter(winnerHung, path.join(OUT_DIR, 'manager_c2.png'), { hue: 45 });
  await processExistingCharacter(wardenHai, path.join(OUT_DIR, 'manager_c3.png'));
  await processExistingCharacter(winnerHung, path.join(OUT_DIR, 'manager_c4.png'), { hue: -45, sat: 1.2 });
  await processExistingCharacter(winnerHung, path.join(OUT_DIR, 'manager_c.png'));

  // Manager R1..R4
  await processExistingCharacter(wardenHai, path.join(OUT_DIR, 'manager_r1.png'), { sat: 1.25 });
  await processExistingCharacter(wardenHai, path.join(OUT_DIR, 'manager_r2.png'), { hue: 80 });
  await processExistingCharacter(electricianDung, path.join(OUT_DIR, 'manager_r3.png'));
  await processExistingCharacter(wardenHai, path.join(OUT_DIR, 'manager_r4.png'), { bright: 1.15 });
  await processExistingCharacter(wardenHai, path.join(OUT_DIR, 'manager_r.png'));

  // Manager SR1..SR3 & SSR
  await processExistingCharacter(owner, path.join(OUT_DIR, 'manager_sr1.png'), { sat: 1.2 });
  await processExistingCharacter(owner, path.join(OUT_DIR, 'manager_sr2.png'), { hue: 50, sat: 1.3 });
  await processExistingCharacter(electricianDung, path.join(OUT_DIR, 'manager_sr3.png'), { sat: 1.3, bright: 1.1 });
  await processExistingCharacter(owner, path.join(OUT_DIR, 'manager_sr.png'));
  await processExistingCharacter(owner, path.join(OUT_DIR, 'manager_ssr.png'), { sat: 1.5, bright: 1.25, hue: 20 });
  console.log('✓ 12 model Manager hoàn tất!');

  // ==========================================
  // 6. SECURITY (BẢO VỆ)
  // ==========================================
  const toughBeo = 'assets-src/characters/char_28_tough_beo.png';
  const trafficHoang = 'assets-src/characters/char_26_traffic_hoang.png';
  const policeNam = 'assets-src/characters/char_25_police_nam.png';
  const grumpyHai = 'assets-src/characters/char_08_grumpy_hai.png';

  // Security C1..C4
  await processExistingCharacter(toughBeo, path.join(OUT_DIR, 'security_c1.png'));
  await processExistingCharacter(toughBeo, path.join(OUT_DIR, 'security_c2.png'), { hue: 45 });
  await processExistingCharacter(grumpyHai, path.join(OUT_DIR, 'security_c3.png'));
  await processExistingCharacter(toughBeo, path.join(OUT_DIR, 'security_c4.png'), { hue: -50, sat: 1.2 });
  await processExistingCharacter(toughBeo, path.join(OUT_DIR, 'security_c.png'));

  // Security R1..R4
  await processExistingCharacter(trafficHoang, path.join(OUT_DIR, 'security_r1.png'), { sat: 1.25 });
  await processExistingCharacter(trafficHoang, path.join(OUT_DIR, 'security_r2.png'), { hue: 75 });
  await processExistingCharacter(grumpyHai, path.join(OUT_DIR, 'security_r3.png'), { bright: 1.15 });
  await processExistingCharacter(trafficHoang, path.join(OUT_DIR, 'security_r4.png'), { bright: 1.2 });
  await processExistingCharacter(trafficHoang, path.join(OUT_DIR, 'security_r.png'));

  // Security SR1..SR3 & SSR
  await processExistingCharacter(policeNam, path.join(OUT_DIR, 'security_sr1.png'), { sat: 1.2 });
  await processExistingCharacter(policeNam, path.join(OUT_DIR, 'security_sr2.png'), { hue: 50, sat: 1.3 });
  await processExistingCharacter(grumpyHai, path.join(OUT_DIR, 'security_sr3.png'), { sat: 1.35, bright: 1.15 });
  await processExistingCharacter(policeNam, path.join(OUT_DIR, 'security_sr.png'));
  await processExistingCharacter(policeNam, path.join(OUT_DIR, 'security_ssr.png'), { sat: 1.5, bright: 1.25, hue: 20 });
  console.log('✓ 12 model Security hoàn tất!');

  console.log('🎉 TOÀN BỘ 72 MODEL NHÂN VIÊN PIXEL ART STARDEW VALLEY ĐÃ HOÀN THÀNH 100%!');
}

run().catch(console.error);
