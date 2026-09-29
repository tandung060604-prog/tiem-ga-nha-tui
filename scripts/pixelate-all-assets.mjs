import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ASSETS_DIR = 'public/assets';
const BACKUP_DIR = 'assets-original';

// Ensure backup directory exists
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Pixelate a single PNG or JPG image
async function pixelateImage(inputPath, outputPath, config) {
  const { grid, colors, saturation = 1.25, contrast = 1.1 } = config;
  const meta = await sharp(inputPath).metadata();
  const targetW = grid;
  const targetH = Math.round(grid * (meta.height / meta.width));
  const isJpg = inputPath.endsWith('.jpg') || inputPath.endsWith('.jpeg');

  if (isJpg) {
    // Pixelate background scenery
    const lowRes = await sharp(inputPath)
      .resize(targetW, targetH, { kernel: 'lanczos3' })
      .modulate({ saturation, brightness: 1.05 })
      .toBuffer();

    await sharp(lowRes)
      .resize(meta.width, meta.height, { kernel: 'nearest' })
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    return;
  }

  // PNG with Alpha channel
  const { data, info } = await sharp(inputPath)
    .resize(targetW, targetH, {
      kernel: 'lanczos3',
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .modulate({ saturation })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Clean pixel borders: strict alpha threshold to avoid blurry halo
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 90) {
      data[i + 3] = 0;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else {
      data[i + 3] = 255;
    }
  }

  // Upscale back with nearest neighbor to preserve crisp pixel blocks
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .resize(meta.width, meta.height, { kernel: 'nearest' })
    .png({ palette: true, colours: colors, dither: 0.15 })
    .toFile(outputPath);
}

async function run() {
  console.log('--- Bắt đầu quy trình Pixel Hóa toàn bộ Asset theo phong cách Stardew Valley ---');

  // 1. Sao lưu bản gốc nếu chưa có
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('Đang sao lưu asset gốc vào public/assets_original...');
    copyRecursive(ASSETS_DIR, BACKUP_DIR);
    console.log('Sao lưu hoàn tất.');
  }

  // 2. Cấu hình pixelation theo từng loại asset
  const configs = {
    characters: { grid: 48, colors: 48, saturation: 1.25 },
    mascot: { grid: 48, colors: 36, saturation: 1.3 },
    food: { grid: 32, colors: 32, saturation: 1.35 },
    kitchen: { grid: 40, colors: 32, saturation: 1.2 },
    icons: { grid: 24, colors: 16, saturation: 1.3 },
    ui: { grid: 48, colors: 36, saturation: 1.25 }
  };

  function getCategory(filePath) {
    const norm = filePath.replace(/\\/g, '/');
    for (const cat of Object.keys(configs)) {
      if (norm.includes(`assets/${cat}/`)) return cat;
    }
    return 'ui';
  }

  function getFileList(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
      const full = path.join(dir, d.name);
      return d.isDirectory() ? getFileList(full) : [full];
    });
  }

  const allFiles = getFileList(BACKUP_DIR).filter(
    f => (f.endsWith('.png') || f.endsWith('.jpg')) && !f.includes('test_pixel_')
  );

  console.log(`Tìm thấy ${allFiles.length} file asset cần pixel hóa...`);

  let processed = 0;
  for (const backupPath of allFiles) {
    const rel = path.relative(BACKUP_DIR, backupPath);
    const destPath = path.join(ASSETS_DIR, rel);
    const cat = getCategory(destPath);
    const cfg = { ...configs[cat] };

    // Tinh chỉnh riêng cho background phong cảnh
    if (destPath.includes('landing_vn_bg')) {
      cfg.grid = 240;
      cfg.colors = 64;
    } else if (destPath.includes('logo_korean_chicken')) {
      cfg.grid = 64;
      cfg.colors = 48;
    }

    const tempPath = destPath + '.tmp.png';
    try {
      await pixelateImage(backupPath, tempPath, cfg);
      fs.renameSync(tempPath, destPath);
      processed++;
    } catch (err) {
      console.error(`Lỗi xử lý ${rel}:`, err);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  // Xóa file test tạm nếu có
  const testFile = path.join(ASSETS_DIR, 'characters/test_pixel_char.png');
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);

  console.log(`✅ Hoàn tất pixel hóa ${processed}/${allFiles.length} file asset thành công!`);
}

run().catch(console.error);
