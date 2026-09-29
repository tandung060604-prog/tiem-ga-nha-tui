import opentype from 'opentype.js';
import fs from 'node:fs';

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

function testFile(name, filePath) {
  const buf = fs.readFileSync(filePath);
  const font = opentype.parse(buf.buffer);
  const missing = [];
  const supported = [];

  for (const char of VN_CHARS) {
    const g = font.charToGlyph(char);
    if (!g || g.index === 0) missing.push(char);
    else supported.push(char);
  }

  const pct = ((supported.length / VN_CHARS.length) * 100).toFixed(1);
  console.log(`\n========================================`);
  console.log(`📌 Font: ${name} (${filePath})`);
  console.log(`Hỗ trợ: ${supported.length}/${VN_CHARS.length} (${pct}%)`);
  if (missing.length > 0) {
    console.log(`❌ THIẾU (${missing.length} ký tự): ${missing.slice(0, 30).join(' ')}${missing.length > 30 ? '...' : ''}`);
  } else {
    console.log(`🎉 HỖ TRỢ HOÀN TOÀN 100% KÝ TỰ TIẾNG VIỆT! KHÔNG THIẾU KÝ TỰ NÀO!`);
  }
}

testFile('Tiny5-Regular.ttf (Gissio GitHub Master)', 'public/assets/fonts/Tiny5-Regular.ttf');
