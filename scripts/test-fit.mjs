import sharp from 'sharp';
import fs from 'node:fs';

async function testSign() {
  const angle = -20.8;
  const cx = 208;
  const cy = 84;
  const w = 310;
  const h = 72;

  const svg = `
  <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(${cx}, ${cy}) rotate(${angle})">
      <rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="2" fill="#faeed1" stroke="#422212" stroke-width="4"/>
      <rect x="${-w/2+4}" y="${-h/2+4}" width="${w-8}" height="${h-8}" fill="#fcf4e3"/>
      <rect x="${-w/2+6}" y="${-h/2+6}" width="${w-12}" height="${h-12}" fill="none" stroke="#c49654" stroke-width="1.5"/>
      
      <!-- Text TIỆM GÀ NHÀ TUI -->
      <text x="0" y="5" text-anchor="middle" font-family="'Silkscreen', 'Arial Black', sans-serif" font-weight="900" font-size="21" fill="#8b1818" letter-spacing="1">TIỆM GÀ NHÀ TUI</text>
      <!-- Subtext -->
      <text x="0" y="23" text-anchor="middle" font-family="'VT323', monospace" font-weight="bold" font-size="14" fill="#7a4805" letter-spacing="1">✦ HẺM 1102 · GIÒN RỤM ✦</text>
    </g>
  </svg>
  `;

  await sharp('ui-check-out/stall_sign_area.png')
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .toFile('ui-check-out/test_sign_fit.png');

  console.log('Fitted successfully!');
}
testSign().catch(console.error);
