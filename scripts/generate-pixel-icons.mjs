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
  redLight: '#FCA5A5',
  red: '#EF4444',
  redDark: '#B91C1C',
  orange: '#F97316',
  orangeDark: '#C2410C',
  yellow: '#FDE047',
  greenLight: '#86EFAC',
  green: '#10B981',
  greenDark: '#047857',
  cyanLight: '#BAE6FD',
  cyan: '#38BDF8',
  cyanDark: '#0284C7',
  blueLight: '#93C5FD',
  blue: '#3B82F6',
  grayLight: '#F1F5F9',
  grayMed: '#94A3B8',
  grayDark: '#475569',
  grayDeep: '#1E293B',
  woodLight: '#FBBF24',
  woodMed: '#D97706',
  woodDark: '#854D0E',
  woodDeep: '#451A03',
  burlap: '#E2D4B7',
  burlapDark: '#C4B598',
  burlapDeep: '#9A8A70',
  cheese: '#FEF08A',
  crust: '#D97706'
};

const ICONS = {
  // 1. Bọt biển chà bàn (Soap sponge)
  'icon_sponge_soap.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Bong bóng bọt biển -->
  <circle cx="24" cy="7" r="3" fill="${C.cyanLight}" stroke="${C.cyanDark}" stroke-width="1"/>
  <circle cx="26" cy="13" r="2" fill="${C.cyanLight}" stroke="${C.cyanDark}" stroke-width="1"/>
  <circle cx="9" cy="6" r="2" fill="${C.cyanLight}" stroke="${C.cyanDark}" stroke-width="1"/>
  
  <!-- Thân bọt biển: mặt mút vàng -->
  <rect x="5" y="10" width="22" height="11" rx="2" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="7" y="12" width="2" height="2" fill="${C.goldDark}"/>
  <rect x="13" y="14" width="3" height="2" fill="${C.goldDark}"/>
  <rect x="21" y="13" width="2" height="2" fill="${C.goldDark}"/>
  <rect x="10" y="17" width="2" height="2" fill="${C.goldDark}"/>
  <rect x="18" y="17" width="3" height="2" fill="${C.goldDark}"/>
  
  <!-- Lớp cọ rửa nhám xanh lá dưới đáy -->
  <rect x="5" y="21" width="22" height="5" rx="1" fill="${C.green}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="6" y="23" width="20" height="2" fill="${C.greenDark}"/>
</svg>`,

  // 2. Robot phụ bếp tự động (Helper Bot)
  'icon_helper_bot.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Anten xoắn trên đầu có bóng đỏ -->
  <rect x="15" y="3" width="2" height="5" fill="${C.grayDark}" stroke="${C.outline}" stroke-width="0.8"/>
  <circle cx="16" cy="3" r="2.5" fill="${C.red}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Đầu robot hình khối hộp bo góc -->
  <rect x="6" y="8" width="20" height="17" rx="3" fill="${C.grayLight}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="8" y="10" width="16" height="7" rx="2" fill="${C.grayDeep}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Mắt số sáng cyan -->
  <rect x="10" y="12" width="4" height="3" rx="1" fill="${C.cyan}"/>
  <rect x="18" y="12" width="4" height="3" rx="1" fill="${C.cyan}"/>
  
  <!-- Nụ cười cơ khí pixel -->
  <rect x="12" y="20" width="8" height="2" fill="${C.grayDark}"/>
  <rect x="14" y="20" width="4" height="2" fill="${C.white}"/>
  
  <!-- Ốc tai hai bên -->
  <rect x="3" y="14" width="3" height="5" rx="1" fill="${C.gold}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="26" y="14" width="3" height="5" rx="1" fill="${C.gold}" stroke="${C.outline}" stroke-width="1"/>
</svg>`,

  // 3. Còi báo động kẻ gian (Alarm Siren)
  'icon_alarm_siren.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Tia sáng nhấp nháy phát ra -->
  <line x1="16" y1="2" x2="16" y2="5" stroke="${C.yellow}" stroke-width="2" stroke-linecap="round"/>
  <line x1="5" y1="8" x2="8" y2="10" stroke="${C.yellow}" stroke-width="2" stroke-linecap="round"/>
  <line x1="27" y1="8" x2="24" y2="10" stroke="${C.yellow}" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Vòm đèn đỏ tròn bóng -->
  <path d="M 8 20 C 8 10, 24 10, 24 20 Z" fill="${C.red}" stroke="${C.outline}" stroke-width="1.5"/>
  <!-- Điểm highlight sáng vòm -->
  <path d="M 11 18 C 11 12, 17 12, 17 18 Z" fill="${C.redLight}"/>
  <rect x="14" y="13" width="4" height="6" fill="${C.white}" opacity="0.6"/>
  
  <!-- Đế còi kim loại xám bọc cao su đen -->
  <rect x="6" y="20" width="20" height="5" rx="1" fill="${C.grayMed}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="5" y="24" width="22" height="4" rx="1" fill="${C.grayDeep}" stroke="${C.outline}" stroke-width="1.5"/>
</svg>`,

  // 4. Bàn tay bắt trộm (Hand Catch)
  'icon_hand_catch.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Tia chuyển động vồ chộp -->
  <path d="M 2 8 L 6 12" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>
  <path d="M 2 24 L 6 20" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Bàn tay nắm chộp xòe ngón -->
  <path d="M 8 16 C 8 10, 16 7, 24 9 C 27 12, 27 20, 23 23 C 18 26, 10 24, 8 16 Z" fill="${C.gold}" stroke="${C.outline}" stroke-width="1.5"/>
  <!-- Các ngón tay cong -->
  <rect x="18" y="6" width="5" height="4" rx="1.5" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="23" y="10" width="5" height="4" rx="1.5" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="23" y="16" width="5" height="4" rx="1.5" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="19" y="21" width="5" height="4" rx="1.5" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Lòng bàn tay đổ bóng cam đậm -->
  <circle cx="16" cy="16" r="4" fill="${C.orange}"/>
</svg>`,

  // 5. Đèn lồng đỏ hẻm (Red Lantern)
  'icon_lantern_red.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Móc treo sắt trên đầu -->
  <rect x="15" y="1" width="2" height="4" fill="${C.grayDeep}"/>
  
  <!-- Chóp nón vàng trên -->
  <rect x="10" y="5" width="12" height="3" rx="1" fill="${C.goldDark}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Bầu đèn lồng đỏ tròn căng -->
  <ellipse cx="16" cy="16" rx="9" ry="8" fill="${C.red}" stroke="${C.outline}" stroke-width="1.5"/>
  <!-- Múi gân đèn lồng màu cam vàng -->
  <ellipse cx="16" cy="16" rx="4" ry="8" fill="none" stroke="${C.orange}" stroke-width="1.5"/>
  <line x1="16" y1="8" x2="16" y2="24" stroke="${C.yellow}" stroke-width="1.5"/>
  
  <!-- Chóp đáy vàng dưới -->
  <rect x="11" y="23" width="10" height="3" rx="1" fill="${C.goldDark}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Chùm tua rua vàng đung đưa -->
  <rect x="15" y="26" width="2" height="5" fill="${C.gold}"/>
  <circle cx="16" cy="30" r="1.5" fill="${C.goldLight}"/>
</svg>`,

  // 6. Khói khét bốc chảo (Smoke Puff)
  'icon_smoke_puff.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Cụm khói lớn ở giữa -->
  <circle cx="16" cy="15" r="7" fill="${C.grayLight}" stroke="${C.outline}" stroke-width="1.5"/>
  <circle cx="10" cy="18" r="5" fill="${C.grayMed}" stroke="${C.outline}" stroke-width="1.5"/>
  <circle cx="22" cy="19" r="5" fill="${C.grayMed}" stroke="${C.outline}" stroke-width="1.5"/>
  <circle cx="15" cy="8" r="4" fill="${C.white}" stroke="${C.outline}" stroke-width="1.2"/>
  
  <!-- Đuôi khói cuộn nhỏ bên dưới -->
  <circle cx="12" cy="25" r="3" fill="${C.grayDark}" stroke="${C.outline}" stroke-width="1"/>
  <circle cx="17" cy="27" r="2" fill="${C.grayDeep}" stroke="${C.outline}" stroke-width="1"/>
</svg>`,

  // 7. Bao bột chiên giòn (Flour Sack)
  'icon_flour_sack.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Cổ bao bột túm miệng -->
  <path d="M 12 7 L 16 10 L 20 7 L 18 12 L 14 12 Z" fill="${C.burlap}" stroke="${C.outline}" stroke-width="1.2"/>
  <!-- Dây thừng nâu buộc cổ -->
  <rect x="12" y="11" width="8" height="2" fill="${C.woodDeep}"/>
  
  <!-- Bầu bao tải căng tròn -->
  <rect x="8" y="12" width="16" height="16" rx="4" fill="${C.burlap}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="9" y="14" width="14" height="13" rx="3" fill="${C.burlapDark}"/>
  
  <!-- Bột mì trắng rớt ngoài viền -->
  <rect x="11" y="16" width="10" height="7" rx="2" fill="${C.white}"/>
  <!-- Ký hiệu bông lúa mì trên bao -->
  <path d="M 16 17 L 16 22 M 14 18 L 16 20 M 18 18 L 16 20" stroke="${C.goldDark}" stroke-width="1.2" stroke-linecap="round"/>
</svg>`,

  // 8. Đĩa củ cải muối Danmuji (Danmuji Plate)
  'icon_danmuji_plate.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Đĩa sứ men ngọc viền nâu -->
  <ellipse cx="16" cy="18" rx="14" ry="9" fill="${C.white}" stroke="${C.outline}" stroke-width="1.5"/>
  <ellipse cx="16" cy="18" rx="12" ry="7" fill="${C.cyanLight}" opacity="0.4"/>
  
  <!-- 3 lát củ cải vàng bán nguyệt xếp chồng -->
  <path d="M 6 18 A 6 6 0 0 1 14 14 L 14 18 Z" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1"/>
  <path d="M 12 18 A 6 6 0 0 1 20 14 L 20 18 Z" fill="${C.goldLight}" stroke="${C.outline}" stroke-width="1"/>
  <path d="M 18 18 A 6 6 0 0 1 26 14 L 26 18 Z" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Hạt mè đen rắc trên mặt -->
  <rect x="11" y="16" width="1.5" height="1.5" fill="${C.outline}"/>
  <rect x="15" y="15" width="1.5" height="1.5" fill="${C.outline}"/>
  <rect x="21" y="16" width="1.5" height="1.5" fill="${C.outline}"/>
</svg>`,

  // 9. Thanh phô mai que kéo sợi (Cheese Stick)
  'icon_cheese_stick.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Nửa bên trái thanh que bọc bột chiên giòn -->
  <rect x="3" y="18" width="10" height="7" rx="3" fill="${C.crust}" stroke="${C.outline}" stroke-width="1.2"/>
  <rect x="5" y="19" width="6" height="5" rx="2" fill="${C.gold}"/>
  
  <!-- Nửa bên phải que giơ lên chếch -->
  <rect x="19" y="7" width="10" height="7" rx="3" transform="rotate(-20 24 10)" fill="${C.crust}" stroke="${C.outline}" stroke-width="1.2"/>
  
  <!-- Phô mai que nóng chảy kéo sợi đàn hồi giữa 2 đầu -->
  <path d="M 11 20 C 14 18, 16 14, 20 11 L 22 13 C 18 16, 15 21, 12 22 Z" fill="${C.cheese}" stroke="${C.outline}" stroke-width="1"/>
  <path d="M 10 22 C 15 22, 18 16, 22 14" stroke="${C.white}" stroke-width="1.5"/>
</svg>`,

  // 10. Xe đẩy đi chợ Chợ Lớn (Market Cart)
  'icon_market_cart.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Tay nắm đẩy màu đỏ sắt -->
  <path d="M 5 6 L 10 11 L 10 22 L 25 22" fill="none" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Giỏ lưới / thùng hàng trên xe -->
  <rect x="10" y="10" width="16" height="10" rx="1" fill="${C.grayLight}" stroke="${C.outline}" stroke-width="1.5"/>
  <line x1="15" y1="10" x2="15" y2="20" stroke="${C.grayMed}" stroke-width="1"/>
  <line x1="20" y1="10" x2="20" y2="20" stroke="${C.grayMed}" stroke-width="1"/>
  <line x1="10" y1="15" x2="26" y2="15" stroke="${C.grayMed}" stroke-width="1"/>
  
  <!-- 2 bánh xe cao su viền đen căm bạc -->
  <circle cx="12" cy="25" r="3.5" fill="${C.grayDeep}" stroke="${C.outline}" stroke-width="1"/>
  <circle cx="12" cy="25" r="1.5" fill="${C.grayLight}"/>
  <circle cx="23" cy="25" r="3.5" fill="${C.grayDeep}" stroke="${C.outline}" stroke-width="1"/>
  <circle cx="23" cy="25" r="1.5" fill="${C.grayLight}"/>
</svg>`,

  // 11. Bảng hiệu gỗ treo tiệm (Wooden Sign)
  'icon_wooden_sign.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Dây xích sắt treo 2 bên -->
  <line x1="9" y1="2" x2="9" y2="9" stroke="${C.grayDark}" stroke-width="1.5" stroke-dasharray="2 1"/>
  <line x1="23" y1="2" x2="23" y2="9" stroke="${C.grayDark}" stroke-width="1.5" stroke-dasharray="2 1"/>
  
  <!-- Tấm biển gỗ mộc nẹp đồng -->
  <rect x="4" y="9" width="24" height="17" rx="2" fill="${C.woodMed}" stroke="${C.outline}" stroke-width="1.5"/>
  <rect x="6" y="11" width="20" height="13" fill="${C.woodLight}"/>
  
  <!-- Chữ khắc trên biển gỗ -->
  <rect x="9" y="14" width="14" height="3" rx="1" fill="${C.woodDeep}"/>
  <rect x="11" y="19" width="10" height="2" rx="0.5" fill="${C.woodDeep}"/>
</svg>`,

  // 12. Bóng đèn tròn dây tóc gợi ý (Retro Lightbulb)
  'icon_lightbulb_retro.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Tia sáng vàng tỏa ra 4 góc -->
  <line x1="16" y1="2" x2="16" y2="5" stroke="${C.gold}" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="14" x2="7" y2="14" stroke="${C.gold}" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="14" x2="28" y2="14" stroke="${C.gold}" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Bầu bóng đèn thủy tinh vàng óng -->
  <circle cx="16" cy="14" r="8" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1.5"/>
  <path d="M 12 18 L 14 23 L 18 23 L 20 18 Z" fill="${C.yellow}" stroke="${C.outline}" stroke-width="1.5"/>
  
  <!-- Dây tóc tungsten xoắn sáng rực -->
  <path d="M 14 16 L 16 11 L 18 16" fill="none" stroke="${C.orangeDark}" stroke-width="1.5" stroke-linecap="round"/>
  
  <!-- Chuôi đèn ren xoắn kim loại -->
  <rect x="13" y="24" width="6" height="4" rx="1" fill="${C.grayMed}" stroke="${C.outline}" stroke-width="1"/>
  <rect x="14" y="28" width="4" height="2" fill="${C.grayDeep}"/>
</svg>`,

  // 13. Vương miện VIP khách sộp (Crown VIP)
  'icon_crown_vip.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Vương miện hoàng gia 5 đỉnh nạm ngọc -->
  <path d="M 5 24 L 4 10 L 10 16 L 16 7 L 22 16 L 28 10 L 27 24 Z" fill="${C.gold}" stroke="${C.outline}" stroke-width="1.5"/>
  <path d="M 6 22 L 5 12 L 10 17 L 16 9 L 22 17 L 27 12 L 26 22 Z" fill="${C.goldLight}"/>
  
  <!-- 3 viên ngọc châu trên 3 đỉnh chính -->
  <circle cx="4" cy="9" r="1.8" fill="${C.white}" stroke="${C.outline}" stroke-width="1"/>
  <circle cx="16" cy="6" r="2.2" fill="${C.white}" stroke="${C.outline}" stroke-width="1"/>
  <circle cx="28" cy="9" r="1.8" fill="${C.white}" stroke="${C.outline}" stroke-width="1"/>
  
  <!-- Đai vương miện đính ngọc ruby đỏ & sapphire xanh -->
  <rect x="5" y="23" width="22" height="4" rx="1" fill="${C.goldDark}" stroke="${C.outline}" stroke-width="1.2"/>
  <circle cx="10" cy="25" r="1.2" fill="${C.cyan}"/>
  <circle cx="16" cy="25" r="1.5" fill="${C.red}"/>
  <circle cx="22" cy="25" r="1.2" fill="${C.cyan}"/>
</svg>`,

  // 14. Ký hiệu cảnh báo cháy khét / chảo khói (Burnt Alert)
  'icon_burnt_alert.png': `
<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Vết nổ sao lửa 8 cánh cảnh báo -->
  <polygon points="16,2 20,10 29,7 23,15 30,22 20,22 18,30 13,23 3,25 9,16 3,9 12,11" fill="${C.red}" stroke="${C.outline}" stroke-width="1.5"/>
  <polygon points="16,5 19,11 26,9 21,15 27,20 19,20 17,27 13,21 5,23 10,16 5,11 12,12" fill="${C.orange}"/>
  <polygon points="16,8 18,12 23,10 19,15 23,18 18,18 17,23 14,19 8,20 11,16 8,13 13,13" fill="${C.yellow}"/>
  
  <!-- Dấu chấm than cảnh báo màu đen nâu -->
  <rect x="15" y="11" width="2" height="6" rx="1" fill="${C.outline}"/>
  <rect x="15" y="19" width="2" height="2" rx="0.5" fill="${C.outline}"/>
</svg>`
};

async function generate() {
  console.log('Generating 14 Retro Pixel Art Icons...');
  for (const [filename, svgContent] of Object.entries(ICONS)) {
    const svgBuffer = Buffer.from(svgContent.trim());
    const pngBuffer = await sharp(svgBuffer)
      .resize(64, 64, { kernel: sharp.kernel.nearest })
      .png()
      .toBuffer();

    for (const dir of OUT_DIRS) {
      const targetPath = path.join(dir, filename);
      fs.writeFileSync(targetPath, pngBuffer);
    }
    console.log(`✓ Generated: ${filename} (64x64 transparent pixel PNG)`);
  }
  console.log('All 14 icons generated successfully in assets-src/icons and public/assets/icons!');
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
