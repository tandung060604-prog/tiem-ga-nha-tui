import opentype from 'opentype.js';
import fs from 'node:fs';
import path from 'node:path';

const VN_CHARS = [
  'a', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ',
  'A', 'À', 'Á', 'Ả', 'Ã', 'Ạ', 'Ă', 'Ằ', 'Ắ', 'Ẳ', 'Ẵ', 'Ặ', 'Â', 'Ầ', 'Ấ', 'Ẩ', 'Ẫ', 'Ậ',
  'd', 'đ', 'D', 'Đ',
  'e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ',
  'E', 'È', 'É', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ề', 'Ế', 'Ể', 'Ễ', 'Ệ',
  'i', 'ì', 'í', 'ỉ', 'ĩ', 'ị',
  'I', 'Ì', 'Í', 'Ỉ', 'Ĩ', 'Ị',
  'o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ',
  'O', 'Ò', 'Ó', 'Ỏ', 'Õ', 'Ọ', 'Ô', 'Ồ', 'Ố', 'Ổ', 'Ỗ', 'Ộ', 'Ơ', 'Ờ', 'Ớ', 'Ở', 'Ỡ', 'Ợ',
  'u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự',
  'U', 'Ù', 'Ú', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ừ', 'Ứ', 'Ử', 'Ữ', 'Ự',
  'y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ',
  'Y', 'Ỳ', 'Ý', 'Ỷ', 'Ỹ', 'Ỵ'
];

async function checkCombined(name, filePaths) {
  const fonts = [];
  for (const fp of filePaths) {
    if (fs.existsSync(fp)) {
      const buf = fs.readFileSync(fp);
      fonts.push(opentype.parse(buf.buffer));
    }
  }

  const supported = [];
  const missing = [];

  for (const char of VN_CHARS) {
    let found = false;
    for (const f of fonts) {
      const g = f.charToGlyph(char);
      if (g && g.index > 0) {
        found = true;
        break;
      }
    }
    if (found) supported.push(char);
    else missing.push(char);
  }

  const pct = ((supported.length / VN_CHARS.length) * 100).toFixed(1);
  console.log(`\n========================================`);
  console.log(`📌 Font Family: ${name} (Ghép ${fonts.length} subsets)`);
  console.log(`Hỗ trợ: ${supported.length}/${VN_CHARS.length} (${pct}%)`);
  if (missing.length > 0) {
    console.log(`❌ THIẾU (${missing.length} ký tự): ${missing.slice(0, 30).join(' ')}${missing.length > 30 ? '...' : ''}`);
  } else {
    console.log(`✅ HỖ TRỢ HOÀN TOÀN 100% KÝ TỰ TIẾNG VIỆT! KHÔNG THIẾU KÝ TỰ NÀO!`);
  }
}

async function run() {
  // 1. Silkscreen (tất cả subsets)
  const silkDir = 'node_modules/@fontsource/silkscreen/files';
  const silkFiles = fs.readdirSync(silkDir).filter(f => f.endsWith('.woff')).map(f => path.join(silkDir, f));
  await checkCombined('Silkscreen', silkFiles);

  // 2. VT323 (tất cả subsets)
  const vtDir = 'node_modules/@fontsource/vt323/files';
  const vtFiles = fs.readdirSync(vtDir).filter(f => f.endsWith('.woff')).map(f => path.join(vtDir, f));
  await checkCombined('VT323 (Google Fonts)', vtFiles);

  // 3. Pixelify Sans (tất cả subsets)
  const pxDir = 'node_modules/@fontsource/pixelify-sans/files';
  const pxFiles = fs.readdirSync(pxDir).filter(f => f.endsWith('.woff')).map(f => path.join(pxDir, f));
  await checkCombined('Pixelify Sans', pxFiles);

  // 4. Tiny5 (tất cả subsets)
  const t5Dir = 'node_modules/@fontsource/tiny5/files';
  const t5Files = fs.readdirSync(t5Dir).filter(f => f.endsWith('.woff')).map(f => path.join(t5Dir, f));
  await checkCombined('Tiny5', t5Files);
}

run().catch(console.error);
