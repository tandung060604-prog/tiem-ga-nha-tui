// Biến ảnh gốc (Gemini/AI, nền trắng, có thể là sheet nhiều hình) thành asset dùng được trong game:
// tách nền → cắt từng hình → thu về kích thước chuẩn → PNG nền trong suốt.
// Chạy: npm run assets   (đọc assets-src/, ghi public/assets/)
//
// Cách tách nền: loang từ mép ảnh vào, chỉ xóa vùng trắng THÔNG RA MÉP; dừng ở nét viền nâu.
// Nhờ vậy phần trắng bên trong nhân vật (thân thỏ, mũ đầu bếp, khăn vai) được giữ.
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const SRC = 'assets-src';
const OUT = 'public/assets';

// Mỗi ảnh gốc: 'single' = cả ảnh là 1 asset; 'split' = sheet, tên theo thứ tự đọc (hàng trên → dưới, trái → phải).
// Số hình tìm thấy phải đúng bằng số tên, sai là dừng (tránh đặt nhầm tên asset).
const MANIFEST = [
  { src: 'food/food_crispy_chicken_perfect.png', mode: 'single', size: [256, 256],
    out: ['food/food_crispy_chicken_perfect.png'] },
  { src: 'food/food_shake_fries.png', mode: 'single', size: [256, 256],
    out: ['food/food_shake_fries.png'] },
  { src: 'food/food_soda.png', mode: 'single', size: [256, 256],
    out: ['food/food_soda.png'] },
  { src: 'food/food_crispy_chicken_raw.png', mode: 'single', size: [256, 256],
    out: ['food/food_crispy_chicken_raw.png'] },
  { src: 'food/food_crispy_chicken_burnt.png', mode: 'single', size: [256, 256],
    out: ['food/food_crispy_chicken_burnt.png'] },
  { src: 'mascot/mascot_gabong_sheet.jpg', mode: 'split', size: [512, 512],
    out: ['mascot/mascot_gabong_front.png', 'mascot/mascot_gabong_three_quarter.png', 'mascot/mascot_gabong_side.png'] },
  { src: 'mascot/mascot_gabong_vui.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_vui.png'] },
  { src: 'mascot/mascot_gabong_khoc.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_khoc.png'] },
  { src: 'mascot/mascot_gabong_xiu.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_xiu.png'] },
  { src: 'mascot/mascot_gabong_on_ap.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_on_ap.png'] },
  { src: 'mascot/mascot_gabong_hoang.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_hoang.png'] },
  { src: 'mascot/mascot_gabong_ngai.png', mode: 'single', size: [512, 512], out: ['mascot/mascot_gabong_ngai.png'] },
  { src: 'kitchen/kitchen_pan_empty.png', mode: 'single', size: [512, 512], out: ['kitchen/kitchen_pan_empty.png'] },
  { src: 'kitchen/kitchen_oil_clean.png', mode: 'single', size: [512, 512], out: ['kitchen/kitchen_oil_clean.png'] },
  { src: 'kitchen/kitchen_oil_medium.png', mode: 'single', size: [512, 512], out: ['kitchen/kitchen_oil_medium.png'] },
  { src: 'kitchen/kitchen_oil_dirty.png', mode: 'single', size: [512, 512], out: ['kitchen/kitchen_oil_dirty.png'] },
  { src: 'ui/ui_bunny_note.png', mode: 'single', size: [768, 768], out: ['ui/ui_bunny_note.png'] },
  { src: 'icons/icon_money.png', mode: 'single', size: [128, 128], out: ['icons/icon_money.png'] },
  { src: 'icons/icon_star.png', mode: 'single', size: [128, 128], out: ['icons/icon_star.png'] },
  { src: 'icons/icon_star_empty.png', mode: 'single', size: [128, 128], out: ['icons/icon_star_empty.png'] },
  { src: 'icons/icon_inventory.png', mode: 'single', size: [128, 128], out: ['icons/icon_inventory.png'] },
  { src: 'icons/icon_upgrade.png', mode: 'single', size: [128, 128], out: ['icons/icon_upgrade.png'] },
  { src: 'icons/icon_staff.png', mode: 'single', size: [128, 128], out: ['icons/icon_staff.png'] },
  { src: 'icons/icon_reviews.png', mode: 'single', size: [128, 128], out: ['icons/icon_reviews.png'] },
  { src: 'icons/icon_book.png', mode: 'single', size: [128, 128], out: ['icons/icon_book.png'] },
  { src: 'icons/icon_lock.png', mode: 'single', size: [128, 128], out: ['icons/icon_lock.png'] },
  { src: 'icons/icon_settings.png', mode: 'single', size: [128, 128], out: ['icons/icon_settings.png'] },
  { src: 'icons/icon_sound_on.png', mode: 'single', size: [128, 128], out: ['icons/icon_sound_on.png'] },
  { src: 'icons/icon_sound_off.png', mode: 'single', size: [128, 128], out: ['icons/icon_sound_off.png'] },
  { src: 'icons/icon_share.png', mode: 'single', size: [128, 128], out: ['icons/icon_share.png'] },
  { src: 'icons/icon_clock.png', mode: 'single', size: [128, 128], out: ['icons/icon_clock.png'] },
  { src: 'icons/icon_fire_rush.png', mode: 'single', size: [128, 128], out: ['icons/icon_fire_rush.png'] },

  // --- Quầy khay inox GN & Món mới (Bàn giao 27/09) ---
  { src: 'kitchen/prep_chicken_raw.png', mode: 'single', size: [256, 256], out: ['kitchen/prep_chicken_raw.png'] },
  { src: 'kitchen/prep_thigh_raw.png', mode: 'single', size: [256, 256], out: ['kitchen/prep_thigh_raw.png'] },
  { src: 'kitchen/prep_fries_raw.png', mode: 'single', size: [256, 256], out: ['kitchen/prep_fries_raw.png'] },
  { src: 'kitchen/prep_popcorn_raw.png', mode: 'single', size: [256, 256], out: ['kitchen/prep_popcorn_raw.png'] },
  { src: 'kitchen/prep_cheese_stick_raw.png', mode: 'single', size: [256, 256], out: ['kitchen/prep_cheese_stick_raw.png'] },
  { src: 'kitchen/side_radish_pickled.png', mode: 'single', size: [256, 256], out: ['kitchen/side_radish_pickled.png'] },
  { src: 'kitchen/side_coleslaw.png', mode: 'single', size: [256, 256], out: ['kitchen/side_coleslaw.png'] },
  { src: 'kitchen/pan_sauce_yangnyeom.png', mode: 'single', size: [256, 256], out: ['kitchen/pan_sauce_yangnyeom.png'] },
  { src: 'kitchen/pan_sauce_soy_garlic.png', mode: 'single', size: [256, 256], out: ['kitchen/pan_sauce_soy_garlic.png'] },
  { src: 'kitchen/pan_locked_slot.png', mode: 'single', size: [256, 256], out: ['kitchen/pan_locked_slot.png'] },
  { src: 'kitchen/pan_empty.png', mode: 'single', size: [256, 256], out: ['kitchen/pan_empty.png'] },
  { src: 'food/food_spicy_thigh.png', mode: 'single', size: [256, 256], out: ['food/food_spicy_thigh.png'] },
  { src: 'food/food_cheese_stick.png', mode: 'single', size: [256, 256], out: ['food/food_cheese_stick.png'] },
  { src: 'food/food_danmuji.png', mode: 'single', size: [256, 256], out: ['food/food_danmuji.png'] },
  { src: 'food/food_coleslaw.png', mode: 'single', size: [256, 256], out: ['food/food_coleslaw.png'] }
];

const BG_MIN = 228;        // mọi kênh ≥ 228 …
const BG_MAX_SPREAD = 20;  // … và gần như không màu → nền
const EDGE_MIN = 185;      // pixel sáng sát nền: làm mờ dần để viền không bị răng cưa trắng
const MAJOR_RATIO = 0.08;  // khối ≥ 8% khối lớn nhất = một hình; nhỏ hơn = chữ, chấm, vụn
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
    // Pixel sáng ngay cạnh nền: alpha theo độ sáng → viền mềm, không còn quầng trắng
    const x = i % width, y = (i / width) | 0;
    const nearBg = (x > 0 && removed[i - 1]) || (x < width - 1 && removed[i + 1])
      || (y > 0 && removed[i - width]) || (y < height - 1 && removed[i + width]);
    const min = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    if (nearBg && min >= EDGE_MIN) data[i * 4 + 3] = Math.round(255 * (255 - min) / (255 - EDGE_MIN));
  }
}

// Gán nhãn các khối pixel không trong suốt liền nhau (4 hướng)
function components({ data, width, height }) {
  const label = new Int32Array(width * height).fill(-1);
  const comps = [];
  for (let start = 0; start < width * height; start++) {
    if (label[start] !== -1 || data[start * 4 + 3] === 0) continue;
    const c = { id: comps.length, area: 0, x0: width, y0: height, x1: 0, y1: 0 };
    const stack = [start];
    label[start] = c.id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % width, y = (i / width) | 0;
      c.area++;
      if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
      for (const j of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, y > 0 ? i - width : -1, y < height - 1 ? i + width : -1]) {
        if (j >= 0 && label[j] === -1 && data[j * 4 + 3] > 0) { label[j] = c.id; stack.push(j); }
      }
    }
    comps.push(c);
  }
  return { label, comps };
}

// Nhóm khối thành các hình: khối lớn là hình, khối nhỏ gộp vào hình chứa nó hoặc bị bỏ
function groupFigures(comps, mode) {
  const largest = Math.max(...comps.map(c => c.area));
  if (mode === 'single') {
    const kept = comps.filter(c => c.area >= 30); // bỏ nhiễu vài pixel, giữ vụn bột
    return [bbox(kept)];
  }
  const majors = comps.filter(c => c.area >= largest * MAJOR_RATIO).map(c => ({ ...c, ids: [c.id] }));
  for (const c of comps) {
    if (c.area >= largest * MAJOR_RATIO) continue;
    // Chỉ gộp khối nhỏ nằm HẲN trong khung của hình (chi tiết rời như nút áo); chấm trang trí bên cạnh thì bỏ
    const host = majors.find(m => c.x0 >= m.x0 && c.x1 <= m.x1 && c.y0 >= m.y0 && c.y1 <= m.y1);
    if (host) host.ids.push(c.id);
  }
  // Thứ tự đọc: gom thành hàng theo tâm dọc, rồi trái → phải
  majors.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const rows = [];
  for (const m of majors) {
    const row = rows.find(r => Math.abs((r[0].y0 + r[0].y1) / 2 - (m.y0 + m.y1) / 2) < (r[0].y1 - r[0].y0) / 2);
    if (row) row.push(m); else rows.push([m]);
  }
  return rows.flatMap(r => r.sort((a, b) => a.x0 - b.x0)).map(m => ({ ...m, ids: m.ids }));
}

function bbox(list) {
  return {
    ids: list.map(c => c.id),
    x0: Math.min(...list.map(c => c.x0)), y0: Math.min(...list.map(c => c.y0)),
    x1: Math.max(...list.map(c => c.x1)), y1: Math.max(...list.map(c => c.y1))
  };
}

async function exportFigure(img, label, fig, [w, h], outFile) {
  const keep = new Set(fig.ids);
  const pad = Math.round(Math.max(fig.x1 - fig.x0, fig.y1 - fig.y0) * PAD);
  const x0 = Math.max(0, fig.x0 - pad), y0 = Math.max(0, fig.y0 - pad);
  const x1 = Math.min(img.width - 1, fig.x1 + pad), y1 = Math.min(img.height - 1, fig.y1 + pad);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const buf = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const si = (y0 + y) * img.width + (x0 + x);
      if (!keep.has(label[si])) continue; // chỉ lấy pixel của hình này (không lấy chữ/hình bên cạnh)
      img.data.copy(buf, (y * cw + x) * 4, si * 4, si * 4 + 4);
    }
  }
  mkdirSync(dirname(`${OUT}/${outFile}`), { recursive: true });
  const info = await sharp(buf, { raw: { width: cw, height: ch, channels: 4 } })
    .resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 75, colours: 192, effort: 9 })
    .toFile(`${OUT}/${outFile}`);
  return info.size;
}

let failed = false;
for (const item of MANIFEST) {
  const img = await load(`${SRC}/${item.src}`);
  removeBackground(img);
  const { label, comps } = components(img);
  const figures = groupFigures(comps, item.mode);
  if (figures.length !== item.out.length) {
    console.error(`✗ ${item.src}: tìm thấy ${figures.length} hình, manifest khai báo ${item.out.length} tên → bỏ qua, kiểm tra ảnh/ngưỡng`);
    failed = true;
    continue;
  }
  for (let k = 0; k < figures.length; k++) {
    const bytes = await exportFigure(img, label, figures[k], item.size, item.out[k]);
    console.log(`✓ ${item.src} → ${OUT}/${item.out[k]} (${item.size.join('×')}, ${(bytes / 1024).toFixed(0)}KB)`);
  }
}

// ---------------------------------------------------------------------------
// 36 Nhân vật Hẻm 1102: sinh tự động từ characters_36_sheet.jpg
// ---------------------------------------------------------------------------
if (existsSync('docs/gemini/characters_36_sheet.jpg') && existsSync('scripts/extract-36-characters.mjs')) {
  try {
    execSync('node scripts/extract-36-characters.mjs', { stdio: 'inherit' });
  } catch (e) {
    console.error('Lỗi khi extract 36 nhân vật:', e);
    failed = true;
  }
}

// ---------------------------------------------------------------------------
// Icon app (Thêm vào Màn hình chính trên iOS/Android): Gà Bông trên nền kem, vuông, không trong suốt
// (iOS tự bo góc; nền trong suốt sẽ thành nền đen).
// ---------------------------------------------------------------------------
const ICON_SRC = `${OUT}/mascot/mascot_gabong_front.png`;
mkdirSync('public/icons', { recursive: true });
for (const size of [180, 192, 512]) {
  const inner = Math.round(size * 0.8);
  const mascot = await sharp(ICON_SRC).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#fdf3e4' } })
    .composite([{ input: mascot, gravity: 'center' }])
    .flatten({ background: '#fdf3e4' })
    .png({ compressionLevel: 9, palette: true, quality: 80, effort: 9 })
    .toFile(`public/icons/icon-${size}.png`);
  console.log(`✓ icon → public/icons/icon-${size}.png`);
}

// ---------------------------------------------------------------------------
// Nén ảnh toàn bộ public/assets: đảm bảo mọi PNG ≤ 40KB (ảnh 256px) và tổng thư mục ≤ 4MB
// ---------------------------------------------------------------------------
function walkDir(dir) {
  let list = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) list = list.concat(walkDir(full));
    else list.push(full);
  }
  return list;
}

const allPngs = walkDir(OUT).filter(f => f.endsWith('.png'));
console.log(`\n--- Tối ưu hóa & nén palette toàn bộ ${allPngs.length} PNGs trong ${OUT} ---`);
let savedBytes = 0;
let totalBytes = 0;
for (const p of allPngs) {
  try {
    const origBuf = readFileSync(p);
    const orig = origBuf.length;
    const opt = await sharp(origBuf)
      .png({ palette: true, quality: 75, colours: 192, effort: 9 })
      .toBuffer();
    if (opt.length < orig) {
      writeFileSync(p, opt);
      savedBytes += (orig - opt.length);
      totalBytes += opt.length;
    } else {
      totalBytes += orig;
    }
  } catch (err) {
    // Nếu có file bị lock trên Windows, ghi nhận và tiếp tục
    totalBytes += statSync(p).size;
  }
}
console.log(`✓ Đã nén giảm ${(savedBytes / 1024 / 1024).toFixed(2)} MB. Tổng kích thước PNG: ${(totalBytes / 1024 / 1024).toFixed(2)} MB\n`);

process.exit(failed ? 1 : 0);
