import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIRS = ['assets-src/icons', 'public/assets/icons'];
OUT_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Palette retro Sài Gòn 16-bit
const C = {
  outline: '#3D2C2E',
  outlineDark: '#231819',
  white: '#FFFFFF',
  goldLight: '#FEF08A',
  gold: '#FBBF24',
  goldDark: '#D97706',
  goldDeep: '#B45309',
  orangeLight: '#FED7AA',
  orange: '#F97316',
  orangeDark: '#EA580C',
  orangeDeep: '#9A3412',
  yellowLight: '#FEF9C3',
  yellow: '#FDE047',
  redLight: '#FCA5A5',
  red: '#EF4444',
  redDark: '#B91C1C',
  cyanLight: '#BAE6FD',
  cyan: '#38BDF8',
  cyanDark: '#0284C7',
  blueLight: '#C7D2FE',
  blue: '#6366F1',
  blueDark: '#4338CA',
  purpleDark: '#581C87',
  silverLight: '#F8FAFC',
  silver: '#E2E8F0',
  silverDark: '#94A3B8'
};

const SHIFT_ICONS = {
  // 1. Ca Trưa (10:00 - 13:00): Mặt trời rực rỡ Sài Gòn nắng ấm
  'icon_shift_noon.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Tia nắng 8 hướng -->
  <rect x="15" y="1" width="2" height="4" fill="${C.gold}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="15" y="27" width="2" height="4" fill="${C.gold}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="1" y="15" width="4" height="2" fill="${C.gold}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="27" y="15" width="4" height="2" fill="${C.gold}" stroke="${C.outline}" stroke-width="0.8"/>
  
  <rect x="5" y="5" width="3" height="3" fill="${C.orange}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="24" y="5" width="3" height="3" fill="${C.orange}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="5" y="24" width="3" height="3" fill="${C.orange}" stroke="${C.outline}" stroke-width="0.8"/>
  <rect x="24" y="24" width="3" height="3" fill="${C.orange}" stroke="${C.outline}" stroke-width="0.8"/>
  
  <!-- Quầng mặt trời chính -->
  <rect x="9" y="9" width="14" height="14" rx="3" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1.2"/>
  <rect x="11" y="11" width="10" height="10" fill="${C.gold}"/>
  <!-- Highlight góc mặt trời -->
  <rect x="11" y="11" width="3" height="3" fill="${C.white}"/>
  <!-- Nụ cười & đôi mắt pixel ấm áp phong cách Stardew -->
  <rect x="12" y="15" width="2" height="2" fill="${C.outlineDark}"/>
  <rect x="18" y="15" width="2" height="2" fill="${C.outlineDark}"/>
  <rect x="14" y="18" width="4" height="1.5" fill="${C.orangeDeep}"/>
</svg>`,

  // 2. Ca Chiều (13:00 - 17:00): Nắng xế hoàng hôn Sài Gòn, vạt mây cam
  'icon_shift_afternoon.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Bầu trời hoàng hôn -->
  <rect x="8" y="4" width="16" height="14" rx="4" fill="${C.orange}" stroke="${C.outline}" stroke-width="1.2"/>
  <rect x="10" y="6" width="12" height="10" fill="${C.gold}"/>
  <rect x="10" y="6" width="3" height="3" fill="${C.white}"/>

  <!-- Vạt mây tím cam hoàng hôn bồng bềnh che chân mặt trời -->
  <rect x="3" y="17" width="26" height="8" rx="3" fill="${C.orangeDark}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="5" y="15" width="12" height="4" rx="2" fill="${C.orangeLight}"/>
  <rect x="15" y="18" width="10" height="4" fill="${C.goldLight}"/>
  <rect x="7" y="23" width="18" height="4" rx="2" fill="${C.purpleDark}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="9" y="24" width="14" height="2" fill="${C.orangeDeep}"/>
</svg>`,

  // 3. Ca Tối (17:00 - 19:30): Trăng lưỡi liềm đầu hôm & ánh đèn phố hẻm
  'icon_shift_evening.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Trăng khuyết đầu hôm -->
  <path d="M 12 3 C 20 3 25 10 25 18 C 25 24 21 28 15 29 C 23 27 27 19 25 12 C 23 6 17 4 12 3 Z" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1.2"/>
  <path d="M 15 7 C 20 8 23 13 23 18 C 23 22 20 25 17 26 C 22 24 24 17 22 12 C 21 9 18 7 15 7 Z" fill="${C.gold}"/>
  
  <!-- Đèn lồng đỏ phố thị lên đèn -->
  <rect x="4" y="13" width="10" height="12" rx="2" fill="${C.red}" stroke="${C.outline}" stroke-width="1.2"/>
  <rect x="6" y="15" width="6" height="8" fill="${C.orange}"/>
  <rect x="7" y="17" width="4" height="4" fill="${C.yellowLight}"/>
  <!-- Quai treo đèn lồng -->
  <line x1="9" y1="8" x2="9" y2="13" stroke="${C.gold}" stroke-width="1.5"/>
  <rect x="7" y="11" width="4" height="2" fill="${C.goldDark}"/>
  <rect x="7" y="25" width="4" height="2" fill="${C.goldDark}"/>
</svg>`,

  // 4. Ca Đêm (19:30 - 21:00): Trăng khuya tĩnh mịch & sao trời
  'icon_shift_night.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Trăng tròn bạc ngọc đêm khuya -->
  <rect x="6" y="6" width="16" height="16" rx="4" fill="${C.silverLight}" stroke="${C.outline}" stroke-width="1.2"/>
  <rect x="8" y="8" width="12" height="12" fill="${C.silver}"/>
  <!-- Craters mặt trăng -->
  <rect x="9" y="10" width="3" height="3" rx="0.5" fill="${C.blueLight}"/>
  <rect x="14" y="15" width="4" height="3" rx="0.5" fill="${C.blueLight}"/>
  <rect x="10" y="16" width="2" height="2" rx="0.5" fill="${C.silverDark}"/>

  <!-- Sao 4 cánh lớn -->
  <rect x="25" y="5" width="2" height="6" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="0.6"/>
  <rect x="23" y="7" width="6" height="2" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="0.6"/>
  <rect x="25" y="7" width="2" height="2" fill="${C.white}"/>

  <!-- Sao nhỏ lấp lánh góc dưới -->
  <rect x="23" y="19" width="2" height="4" fill="${C.cyanLight}"/>
  <rect x="22" y="20" width="4" height="2" fill="${C.cyanLight}"/>
  <rect x="5" y="25" width="2" height="3" fill="${C.goldLight}"/>
</svg>`
};

async function build() {
  console.log('--- Generating 4 Shift Pixel Icons (16-bit Cozy Pixel Art) ---');
  for (const [filename, svg] of Object.entries(SHIFT_ICONS)) {
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(64, 64, { kernel: 'nearest' })
      .png()
      .toBuffer();

    for (const dir of OUT_DIRS) {
      const outPath = path.join(dir, filename);
      fs.writeFileSync(outPath, pngBuffer);
      console.log(`Saved: ${outPath} (64x64 transparent PNG)`);
    }
  }
  console.log('--- Completed All Shift Icons ---');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
