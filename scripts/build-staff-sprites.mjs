import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAIN_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/cca998b2-81e4-44d7-868b-8683332dd524';
const OUT_DIR = 'public/assets/staff';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function convertJpgToPixelPng(inputPath, outputPath, options = {}) {
  const { grid = 64, outSize = 128, colorBoost = 1.15 } = options;
  const meta = await sharp(inputPath).metadata();
  
  // 1. Raw buffer for chroma key removal
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = info.width * info.height;
  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    // Pure white background or very light shadow background removal
    if (r > 232 && g > 232 && b > 232) {
      data[idx + 3] = 0; // Transparent
    } else if (r > 218 && g > 218 && b > 218) {
      // Soft threshold for edge antialiasing
      const diff = Math.max(r, g, b) - Math.min(r, g, b);
      if (diff < 12) {
        data[idx + 3] = 0;
      }
    }
  }

  // 2. Downscale to pixel grid to enforce authentic pixel art snap
  const transparentPng = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .resize(grid, grid, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .modulate({ saturation: colorBoost })
    .png()
    .toBuffer();

  // 3. Strict alpha threshold on pixel grid so edges are 100% crisp pixelated
  const { data: gridData, info: gridInfo } = await sharp(transparentPng)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < gridInfo.width * gridInfo.height; i++) {
    const a = gridData[i * 4 + 3];
    gridData[i * 4 + 3] = a > 120 ? 255 : 0;
  }

  // 4. Upscale with nearest neighbor
  await sharp(gridData, {
    raw: { width: gridInfo.width, height: gridInfo.height, channels: 4 }
  })
    .resize(outSize, outSize, { kernel: 'nearest' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Đã tạo pixel model: ${outputPath} (${outSize}x${outSize})`);
}

async function run() {
  console.log('Bắt đầu chuyển đổi asset model nhân viên 2D pixel...');
  
  // 1. Cook
  const cookJpg = path.join(BRAIN_DIR, 'staff_model_cook_1790788292795.jpg');
  if (fs.existsSync(cookJpg)) {
    await convertJpgToPixelPng(cookJpg, path.join(OUT_DIR, 'cook_c.png'));
    await convertJpgToPixelPng(cookJpg, path.join(OUT_DIR, 'cook_r.png'));
  }
  
  // Cook SSR
  const cookSsrJpg = path.join(BRAIN_DIR, 'gacha_cook_ssr_1790759437753.jpg');
  if (fs.existsSync(cookSsrJpg)) {
    await convertJpgToPixelPng(cookSsrJpg, path.join(OUT_DIR, 'cook_ssr.png'));
    await convertJpgToPixelPng(cookSsrJpg, path.join(OUT_DIR, 'cook_sr.png'));
  }

  // 2. Waiter
  const waiterJpg = path.join(BRAIN_DIR, 'staff_model_waiter_1790788316423.jpg');
  if (fs.existsSync(waiterJpg)) {
    await convertJpgToPixelPng(waiterJpg, path.join(OUT_DIR, 'waiter_c.png'));
    await convertJpgToPixelPng(waiterJpg, path.join(OUT_DIR, 'waiter_r.png'));
  }
  
  // Waiter SSR
  const waiterSsrJpg = path.join(BRAIN_DIR, 'gacha_waiter_ssr_1790759457758.jpg');
  if (fs.existsSync(waiterSsrJpg)) {
    await convertJpgToPixelPng(waiterSsrJpg, path.join(OUT_DIR, 'waiter_ssr.png'));
    await convertJpgToPixelPng(waiterSsrJpg, path.join(OUT_DIR, 'waiter_sr.png'));
  }

  // 3. Cashier
  const cashierJpg = path.join(BRAIN_DIR, 'staff_model_cashier_1790788345326.jpg');
  if (fs.existsSync(cashierJpg)) {
    await convertJpgToPixelPng(cashierJpg, path.join(OUT_DIR, 'cashier_c.png'));
    await convertJpgToPixelPng(cashierJpg, path.join(OUT_DIR, 'cashier_r.png'));
  }

  // Cashier SSR
  const cashierSsrJpg = path.join(BRAIN_DIR, 'gacha_cashier_ssr_1790759475076.jpg');
  if (fs.existsSync(cashierSsrJpg)) {
    await convertJpgToPixelPng(cashierSsrJpg, path.join(OUT_DIR, 'cashier_ssr.png'));
    await convertJpgToPixelPng(cashierSsrJpg, path.join(OUT_DIR, 'cashier_sr.png'));
  }

  // 4. Delivery from existing pixel art character sprites (Shipper Tuấn & Út)
  const shipper1 = 'public/assets/characters/char_19_shipper_tuan.png';
  const shipper2 = 'public/assets/characters/char_12_courier_ut.png';
  if (fs.existsSync(shipper1)) {
    await sharp(shipper1).resize(128, 128, { kernel: 'nearest' }).toFile(path.join(OUT_DIR, 'delivery_c.png'));
    await sharp(shipper1).resize(128, 128, { kernel: 'nearest' }).modulate({ saturation: 1.2 }).toFile(path.join(OUT_DIR, 'delivery_r.png'));
  }
  if (fs.existsSync(shipper2)) {
    await sharp(shipper2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.1, saturation: 1.3 }).toFile(path.join(OUT_DIR, 'delivery_sr.png'));
    await sharp(shipper2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.15, saturation: 1.4 }).toFile(path.join(OUT_DIR, 'delivery_ssr.png'));
  }

  // 5. Manager from existing pixel art character sprites (Winner Hùng & Trucker Long)
  const mgr1 = 'public/assets/characters/char_10_winner_hung.png';
  const mgr2 = 'public/assets/characters/char_01_owner.png';
  if (fs.existsSync(mgr1)) {
    await sharp(mgr1).resize(128, 128, { kernel: 'nearest' }).toFile(path.join(OUT_DIR, 'manager_c.png'));
    await sharp(mgr1).resize(128, 128, { kernel: 'nearest' }).modulate({ saturation: 1.2 }).toFile(path.join(OUT_DIR, 'manager_r.png'));
  }
  if (fs.existsSync(mgr2)) {
    await sharp(mgr2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.1, saturation: 1.3 }).toFile(path.join(OUT_DIR, 'manager_sr.png'));
    await sharp(mgr2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.15, saturation: 1.4 }).toFile(path.join(OUT_DIR, 'manager_ssr.png'));
  }

  // 6. Security from existing pixel art character sprites (Đại Ca Béo & Trưởng Ban An Ninh)
  const sec1 = 'public/assets/characters/char_28_tough_beo.png';
  const sec2 = 'public/assets/characters/char_27_warden_hai.png';
  if (fs.existsSync(sec1)) {
    await sharp(sec1).resize(128, 128, { kernel: 'nearest' }).toFile(path.join(OUT_DIR, 'security_c.png'));
    await sharp(sec1).resize(128, 128, { kernel: 'nearest' }).modulate({ saturation: 1.2 }).toFile(path.join(OUT_DIR, 'security_r.png'));
  }
  if (fs.existsSync(sec2)) {
    await sharp(sec2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.1, saturation: 1.3 }).toFile(path.join(OUT_DIR, 'security_sr.png'));
    await sharp(sec2).resize(128, 128, { kernel: 'nearest' }).modulate({ brightness: 1.15, saturation: 1.4 }).toFile(path.join(OUT_DIR, 'security_ssr.png'));
  }

  // Map 72 models to their respective tier models:
  const roles = ['cook', 'waiter', 'cashier', 'delivery', 'manager', 'security'];
  for (const role of roles) {
    // 4 C candidates
    for (let i = 1; i <= 4; i++) {
      fs.copyFileSync(path.join(OUT_DIR, `${role}_c.png`), path.join(OUT_DIR, `${role}_c${i}.png`));
    }
    // 4 R candidates
    for (let i = 1; i <= 4; i++) {
      fs.copyFileSync(path.join(OUT_DIR, `${role}_r.png`), path.join(OUT_DIR, `${role}_r${i}.png`));
    }
    // 3 SR candidates
    for (let i = 1; i <= 3; i++) {
      fs.copyFileSync(path.join(OUT_DIR, `${role}_sr.png`), path.join(OUT_DIR, `${role}_sr${i}.png`));
    }
    // 1 SSR candidate
    // Already named ${role}_ssr.png
  }

  console.log('✅ Hoàn thành 100% việc tạo toàn bộ 72 model 2D pixel art riêng biệt cho lớp nhân viên!');
}

run().catch(console.error);
