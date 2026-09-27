import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

mkdirSync('assets-src/kitchen', { recursive: true });
mkdirSync('assets-src/food', { recursive: true });

// Helper tạo SVG vỏ bọc khay GN inox 1/3 (sâu)
function gnPan13Svg(contentSvg, hasTongs = true) {
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#ffffff" />
      <g transform="translate(36, 60)">
        <!-- Đổ bóng ngoài khay -->
        <rect x="10" y="16" width="420" height="360" rx="28" fill="#cbd5e1" opacity="0.6" />
        <!-- Vành viền inox ngoài -->
        <rect x="0" y="0" width="440" height="380" rx="26" fill="url(#metalBorderGrad)" stroke="#475569" stroke-width="6" />
        <!-- Mặt vát lòng khay GN sâu -->
        <rect x="22" y="22" width="396" height="336" rx="18" fill="url(#metalInnerGrad)" stroke="#64748b" stroke-width="4" />
        <!-- Đáy khay sâu -->
        <rect x="36" y="36" width="368" height="308" rx="14" fill="url(#panFloorGrad)" stroke="#334155" stroke-width="3" />
        
        <!-- Nội dung món ăn trong khay -->
        ${contentSvg}

        ${hasTongs ? `
        <!-- Kẹp gắp inox (Stainless Tongs) gác trên thành khay -->
        <g id="tongs" transform="rotate(-25 360 80)">
          <!-- Cán kẹp -->
          <path d="M 320 20 L 410 160 C 414 166, 400 174, 394 168 L 310 32 Z" fill="#94a3b8" stroke="#334155" stroke-width="3" />
          <path d="M 330 20 L 420 160 C 424 166, 410 174, 404 168 L 320 32 Z" fill="#cbd5e1" stroke="#334155" stroke-width="3" />
          <!-- Đầu gắp có răng cưa -->
          <path d="M 405 162 L 418 180 L 422 176 L 426 182 L 430 174 Z" fill="#e2e8f0" stroke="#334155" stroke-width="2.5" />
          <!-- Điểm sáng bóng kim loại -->
          <line x1="324" y1="36" x2="390" y2="140" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
        </g>
        ` : ''}

        <!-- Viền ánh sáng bóng loáng trên vành khay -->
        <path d="M 24 10 L 416 10" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
        <path d="M 12 24 L 12 356" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.6" />
      </g>

      <defs>
        <linearGradient id="metalBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="35%" stop-color="#cbd5e1" />
          <stop offset="70%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
        <linearGradient id="metalInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="20%" stop-color="#64748b" />
          <stop offset="80%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
        <linearGradient id="panFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e2e6ea" />
          <stop offset="50%" stop-color="#cbd5e1" />
          <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>
      </defs>
    </svg>
  `;
}

// Helper tạo SVG vỏ bọc khay GN 1/6 (nông)
function gnPan16Svg(contentSvg, toolSvg = '') {
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#ffffff" />
      <g transform="translate(56, 56)">
        <!-- Đổ bóng ngoài khay -->
        <rect x="10" y="14" width="380" height="380" rx="26" fill="#cbd5e1" opacity="0.6" />
        <!-- Vành viền inox ngoài vuông bo góc -->
        <rect x="0" y="0" width="400" height="400" rx="24" fill="url(#metalBorder16)" stroke="#475569" stroke-width="6" />
        <!-- Lòng khay GN 1/6 -->
        <rect x="20" y="20" width="360" height="360" rx="16" fill="url(#metalInner16)" stroke="#64748b" stroke-width="4" />
        <!-- Đáy khay nông -->
        <rect x="32" y="32" width="336" height="336" rx="12" fill="url(#panFloor16)" stroke="#334155" stroke-width="3" />
        
        <!-- Nội dung sốt / món kèm trong khay -->
        ${contentSvg}

        ${toolSvg}

        <!-- Viền bóng inox -->
        <path d="M 24 10 L 376 10" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
        <path d="M 10 24 L 10 376" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.6" />
      </g>

      <defs>
        <linearGradient id="metalBorder16" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="40%" stop-color="#cbd5e1" />
          <stop offset="80%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
        <linearGradient id="metalInner16" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>
        <linearGradient id="panFloor16" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#edf2f7" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  `;
}

// 1. prep_chicken_raw: Gà tươi áo bột xù vàng nhạt trong khay GN 1/3
const chickenRawContent = `
  <!-- Miếng gà sống 1 -->
  <g transform="translate(60, 70)">
    <path d="M 40 40 C 20 60, 20 120, 60 150 C 110 180, 160 140, 170 100 C 180 50, 100 20, 40 40 Z" fill="#fde68a" stroke="#b45309" stroke-width="4" />
    <!-- Vảy bột chiên xù panko -->
    <circle cx="60" cy="70" r="5" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
    <circle cx="90" cy="50" r="4" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
    <circle cx="110" cy="90" r="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
    <circle cx="80" cy="120" r="5" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
    <circle cx="130" cy="115" r="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
    <circle cx="140" cy="65" r="5" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
    <circle cx="50" cy="110" r="4" fill="#fde68a" stroke="#d97706" stroke-width="1.5" />
  </g>
  <!-- Miếng gà sống 2 đè lên -->
  <g transform="translate(170, 120)">
    <path d="M 50 30 C 20 60, 30 130, 80 150 C 140 170, 190 120, 180 70 C 170 20, 90 10, 50 30 Z" fill="#fef08a" stroke="#b45309" stroke-width="4" />
    <!-- Vảy bột panko -->
    <circle cx="70" cy="55" r="5" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
    <circle cx="110" cy="45" r="6" fill="#fde68a" stroke="#d97706" stroke-width="1.5" />
    <circle cx="130" cy="90" r="5" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
    <circle cx="90" cy="110" r="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
    <circle cx="150" cy="80" r="4" fill="#fde68a" stroke="#d97706" stroke-width="1.5" />
    <circle cx="65" cy="95" r="5" fill="#ffffff" stroke="#d97706" stroke-width="1.5" />
  </g>
`;

// 2. prep_thigh_raw: Má đùi gà ướp sốt cay đỏ trong khay GN 1/3
const thighRawContent = `
  <!-- Má đùi gà 1 -->
  <g transform="translate(60, 60)">
    <path d="M 30 50 C 10 90, 30 160, 90 180 C 160 200, 200 130, 180 70 C 160 20, 70 10, 30 50 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4" />
    <!-- Lớp sốt cay óng ánh và ớt bột -->
    <path d="M 50 60 Q 110 30 150 70 Q 160 120 120 150 Q 60 150 50 60 Z" fill="#dc2626" opacity="0.7" />
    <circle cx="70" cy="80" r="4" fill="#7f1d1d" />
    <circle cx="110" cy="65" r="5" fill="#ffffff" opacity="0.8" />
    <circle cx="130" cy="110" r="4" fill="#7f1d1d" />
    <circle cx="85" cy="130" r="3" fill="#b91c1c" />
    <circle cx="100" cy="90" r="6" fill="#fca5a5" opacity="0.6" />
  </g>
  <!-- Má đùi gà 2 -->
  <g transform="translate(160, 110)">
    <path d="M 40 40 C 15 80, 40 150, 100 170 C 170 180, 200 120, 180 60 C 160 10, 80 10, 40 40 Z" fill="#f87171" stroke="#991b1b" stroke-width="4" />
    <path d="M 60 50 Q 120 30 150 80 Q 140 140 100 140 Q 60 120 60 50 Z" fill="#dc2626" opacity="0.8" />
    <circle cx="80" cy="70" r="5" fill="#ffffff" opacity="0.8" />
    <circle cx="120" cy="90" r="4" fill="#7f1d1d" />
    <circle cx="95" cy="115" r="4" fill="#991b1b" />
    <circle cx="140" cy="120" r="5" fill="#fca5a5" opacity="0.7" />
  </g>
`;

// 3. prep_fries_raw: Khoai tây cắt que đều màu vàng bơ
const friesRawContent = `
  <g transform="translate(50, 50)">
    <!-- Đống khoai que đan chéo -->
    ${[
      [30, 40, 20], [60, 70, -15], [100, 30, 35], [140, 60, -10], [180, 40, 15],
      [40, 120, -30], [80, 100, 25], [120, 130, -5], [160, 110, 40], [200, 130, -20],
      [50, 180, 10], [90, 170, -15], [130, 190, 30], [170, 180, -25], [210, 170, 15],
      [70, 220, -10], [110, 240, 20], [150, 230, -35], [190, 220, 10]
    ].map(([x, y, deg]) => `
      <g transform="translate(${x}, ${y}) rotate(${deg})">
        <rect x="0" y="0" width="110" height="20" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
        <line x1="6" y1="4" x2="104" y2="4" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
      </g>
    `).join('')}
  </g>
`;

// 4. prep_popcorn_raw: Gà viên tròn lăn bột
const popcornRawContent = `
  <g transform="translate(50, 50)">
    ${[
      [60, 60, 32], [130, 50, 28], [200, 70, 34], [270, 60, 30],
      [80, 130, 30], [150, 120, 36], [220, 140, 30], [290, 130, 32],
      [50, 190, 34], [120, 190, 30], [190, 210, 35], [260, 190, 28],
      [90, 250, 32], [160, 260, 34], [230, 250, 30]
    ].map(([cx, cy, r]) => `
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="${r}" fill="#fde68a" stroke="#b45309" stroke-width="3.5" />
        <circle cx="${-r * 0.3}" cy="${-r * 0.3}" r="${r * 0.3}" fill="#ffffff" opacity="0.7" />
        <circle cx="${r * 0.2}" cy="${r * 0.2}" r="3" fill="#d97706" />
        <circle cx="${-r * 0.2}" cy="${r * 0.3}" r="2.5" fill="#ca8a04" />
        <circle cx="${r * 0.3}" cy="${-r * 0.1}" r="3" fill="#b45309" />
      </g>
    `).join('')}
  </g>
`;

// 5. prep_cheese_stick_raw: Phô mai que bọc bột chiên xù
const cheeseStickRawContent = `
  <g transform="translate(60, 60)">
    ${[
      [30, 40, -15], [130, 30, 10], [230, 50, -5],
      [40, 120, 20], [140, 130, -25], [240, 120, 15],
      [50, 200, -10], [150, 210, 25], [250, 190, -15],
      [90, 270, 5], [190, 270, -20]
    ].map(([x, y, deg]) => `
      <g transform="translate(${x}, ${y}) rotate(${deg})">
        <rect x="0" y="0" width="130" height="34" rx="10" fill="#fef08a" stroke="#b45309" stroke-width="4" />
        <!-- Vảy xù panko bọc quanh que -->
        <circle cx="20" cy="12" r="3" fill="#ffffff" />
        <circle cx="50" cy="20" r="3.5" fill="#fde68a" stroke="#d97706" stroke-width="1" />
        <circle cx="85" cy="10" r="4" fill="#ffffff" />
        <circle cx="110" cy="22" r="3.5" fill="#fde68a" stroke="#d97706" stroke-width="1" />
        <line x1="12" y1="8" x2="118" y2="8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7" />
      </g>
    `).join('')}
  </g>
`;

// 6. side_radish_pickled: Khay GN 1/6 củ cải vàng ngâm chua ngọt + vá múc
const radishContent = `
  <!-- Nước ngâm chua ngọt vàng óng -->
  <rect x="36" y="36" width="328" height="328" rx="10" fill="#fef08a" opacity="0.85" />
  <!-- Các lát củ cải vàng bán nguyệt -->
  <g transform="translate(60, 60)">
    ${[
      [30, 40, -10], [110, 30, 25], [190, 45, -20],
      [45, 110, 30], [125, 100, -15], [205, 115, 10],
      [35, 180, -25], [115, 175, 15], [195, 180, -5],
      [75, 245, 20], [155, 240, -30]
    ].map(([x, y, deg]) => `
      <g transform="translate(${x}, ${y}) rotate(${deg})">
        <path d="M 0 35 A 35 35 0 0 1 70 35 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3.5" />
        <path d="M 8 32 A 27 27 0 0 1 62 32 Z" fill="#fde047" />
        <circle cx="35" cy="20" r="4" fill="#ffffff" opacity="0.8" />
      </g>
    `).join('')}
  </g>
`;
const ladleSvg = `
  <!-- Vá múc inox nhỏ -->
  <g transform="rotate(-35 200 200) translate(90, 40)">
    <!-- Cán vá -->
    <rect x="140" y="20" width="16" height="220" rx="8" fill="#94a3b8" stroke="#334155" stroke-width="3" />
    <line x1="146" y1="30" x2="146" y2="230" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <!-- Muôi vá tròn múc củ cải -->
    <ellipse cx="148" cy="240" rx="46" ry="34" fill="#cbd5e1" stroke="#334155" stroke-width="4" />
    <ellipse cx="148" cy="240" rx="38" ry="26" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
  </g>
`;

// 7. side_coleslaw: Khay GN 1/6 bắp cải trộn mayonnaise
const coleslawContent = `
  <!-- Nền xốt mayonnaise kem béo -->
  <rect x="36" y="36" width="328" height="328" rx="10" fill="#fdfbf7" />
  <!-- Các sợi bắp cải xanh trắng kem, bắp cải tím, cà rốt cam -->
  <g transform="translate(50, 50)">
    ${[
      // Bắp cải tím (purple cabbage)
      [40, 50, 25, '#9333ea'], [120, 40, -15, '#a855f7'], [210, 60, 35, '#7e22ce'],
      [60, 130, -30, '#9333ea'], [150, 120, 20, '#a855f7'], [230, 140, -10, '#7e22ce'],
      [50, 210, 15, '#9333ea'], [140, 200, -25, '#a855f7'], [220, 220, 30, '#7e22ce'],
      // Cà rốt cam (shredded carrot)
      [80, 70, -20, '#ea580c'], [170, 60, 40, '#f97316'], [240, 80, -35, '#ea580c'],
      [90, 150, 30, '#f97316'], [180, 140, -20, '#ea580c'], [70, 240, -15, '#f97316'],
      // Sợi bắp cải giòn xanh nhạt
      [50, 90, 10, '#86efac'], [130, 85, -25, '#bbf7d0'], [200, 100, 15, '#86efac'],
      [110, 170, -35, '#bbf7d0'], [190, 180, 25, '#86efac'], [130, 250, 10, '#bbf7d0']
    ].map(([x, y, deg, color]) => `
      <rect x="${x}" y="${y}" width="65" height="9" rx="4" transform="rotate(${deg} ${x} ${y})" fill="${color}" stroke="#1f2937" stroke-width="2" />
    `).join('')}
    <!-- Xốt mayo béo ngậy phủ bên trên -->
    <path d="M 60 120 Q 140 80 220 140 Q 160 200 60 120 Z" fill="#ffffff" opacity="0.65" />
    <path d="M 120 160 Q 200 130 240 190 Q 180 240 120 160 Z" fill="#ffffff" opacity="0.65" />
  </g>
`;

// 8. pan_sauce_yangnyeom: Khay GN 1/6 sốt cay đỏ óng
const sauceYangnyeomContent = `
  <!-- Lòng sốt đỏ cay gochujang đậm đà bóng loáng -->
  <rect x="36" y="36" width="328" height="328" rx="10" fill="#dc2626" stroke="#991b1b" stroke-width="3" />
  <!-- Độ loang bóng dầu đỏ ớt -->
  <ellipse cx="200" cy="180" rx="130" ry="110" fill="#b91c1c" />
  <path d="M 60 70 Q 180 40 310 90 Q 330 200 270 290 Q 120 330 60 240 Z" fill="#ef4444" opacity="0.75" />
  <!-- Điểm phản chiếu ánh sáng bóng bẩy -->
  <ellipse cx="140" cy="110" rx="60" ry="25" transform="rotate(-20 140 110)" fill="#ffffff" opacity="0.7" />
  <ellipse cx="250" cy="220" rx="45" ry="18" transform="rotate(15 250 220)" fill="#fca5a5" opacity="0.6" />
  <!-- Mè trắng rắc đều trên bề mặt sốt -->
  ${[
    [90, 100], [130, 80], [180, 95], [230, 75], [280, 110],
    [100, 160], [150, 140], [210, 160], [260, 150],
    [80, 220], [140, 210], [190, 230], [250, 210], [290, 240],
    [120, 270], [180, 280], [230, 270]
  ].map(([x, y]) => `
    <ellipse cx="${x}" cy="${y}" rx="4" ry="7" transform="rotate(30 ${x} ${y})" fill="#ffffff" stroke="#7f1d1d" stroke-width="1.5" />
  `).join('')}
`;

// 9. pan_sauce_soy_garlic: Khay GN 1/6 sốt bơ tỏi nâu óng
const sauceSoyGarlicContent = `
  <!-- Sốt bơ tỏi đậu nành màu nâu caramel bóng loáng -->
  <rect x="36" y="36" width="328" height="328" rx="10" fill="#78350f" stroke="#451a03" stroke-width="3" />
  <ellipse cx="200" cy="190" rx="135" ry="115" fill="#92400e" />
  <path d="M 60 70 Q 200 40 320 80 Q 320 220 260 300 Q 110 320 60 220 Z" fill="#b45309" opacity="0.7" />
  <!-- Ánh sáng phản chiếu nâu óng mật ong -->
  <ellipse cx="140" cy="110" rx="55" ry="22" transform="rotate(-15 140 110)" fill="#ffffff" opacity="0.65" />
  <ellipse cx="250" cy="210" rx="40" ry="16" transform="rotate(20 250 210)" fill="#fde68a" opacity="0.5" />
  <!-- Tỏi phi vàng thơm lừng nổi trên mặt sốt -->
  ${[
    [100, 110], [160, 80], [220, 95], [270, 120],
    [90, 170], [145, 150], [210, 150], [265, 175],
    [110, 230], [175, 210], [230, 220], [280, 235],
    [130, 280], [195, 275]
  ].map(([x, y]) => `
    <g transform="translate(${x}, ${y})">
      <ellipse cx="0" cy="0" rx="10" ry="6" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="#b45309" stroke-width="1.5" />
    </g>
  `).join('')}
`;

// 10. pan_locked_slot: Nắp inox mờ + Ổ khóa đồng ở giữa
const lockedSlotSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <g transform="translate(36, 60)">
      <!-- Vành khay GN -->
      <rect x="0" y="0" width="440" height="380" rx="26" fill="#94a3b8" stroke="#334155" stroke-width="6" />
      <!-- Nắp Inox mờ (Frosted Brushed Metal Cover) -->
      <rect x="18" y="18" width="404" height="344" rx="18" fill="url(#frostedSteel)" stroke="#475569" stroke-width="5" />
      
      <!-- Đường xước phay kim loại sang trọng -->
      ${[60, 110, 160, 210, 260, 310].map(y => `
        <line x1="30" y1="${y}" x2="410" y2="${y}" stroke="#ffffff" stroke-width="2" opacity="0.4" stroke-dasharray="16 10" />
      `).join('')}

      <!-- Ổ Khóa Đồng Vàng Rực Rỡ ở chính giữa -->
      <g transform="translate(220, 190)">
        <!-- Vòng khuyên khóa thép -->
        <path d="M -40 -10 L -40 -60 C -40 -95, 40 -95, 40 -60 L 40 -10" fill="none" stroke="#94a3b8" stroke-width="18" stroke-linecap="round" />
        <path d="M -40 -10 L -40 -60 C -40 -95, 40 -95, 40 -60 L 40 -10" fill="none" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />
        <!-- Thân ổ khóa đồng đúc vàng -->
        <rect x="-65" y="-15" width="130" height="110" rx="20" fill="url(#brassGold)" stroke="#78350f" stroke-width="6" />
        <!-- Chi tiết phản chiếu ánh kim vàng -->
        <line x1="-50" y1="-2" x2="50" y2="-2" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8" />
        <!-- Lỗ khóa đen huyền bí -->
        <circle cx="0" cy="30" r="14" fill="#1e293b" />
        <path d="M -8 30 L 8 30 L 12 65 L -12 65 Z" fill="#1e293b" />
      </g>
    </g>

    <defs>
      <linearGradient id="frostedSteel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#cbd5e1" />
        <stop offset="25%" stop-color="#94a3b8" />
        <stop offset="50%" stop-color="#cbd5e1" />
        <stop offset="75%" stop-color="#64748b" />
        <stop offset="100%" stop-color="#94a3b8" />
      </linearGradient>
      <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="40%" stop-color="#f59e0b" />
        <stop offset="80%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#78350f" />
      </linearGradient>
    </defs>
  </svg>
`;

// 11. pan_empty: Khay inox rỗng trơ đáy
const emptyPanContent = `
  <!-- Đáy khay inox rỗng với gân dập nổi định hình -->
  <g transform="translate(60, 60)">
    <!-- Gân dập nổi X giữa khay -->
    <line x1="40" y1="40" x2="280" y2="220" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" opacity="0.7" />
    <line x1="280" y1="40" x2="40" y2="220" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" opacity="0.7" />
    <line x1="42" y1="38" x2="282" y2="218" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" />
    <line x1="282" y1="38" x2="42" y2="218" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" />
    <!-- Vết xước ánh sáng kim loại sạch bong -->
    <path d="M 60 130 L 260 130" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8" />
  </g>
`;

// 12. food_spicy_thigh: Má đùi gà rán giòn cay thành phẩm
const foodSpicyThighSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <g transform="translate(60, 50)">
      <!-- Bóng đổ đùi gà -->
      <ellipse cx="200" cy="360" rx="160" ry="35" fill="#cbd5e1" opacity="0.6" />
      <!-- Xương đùi gà trắng -->
      <path d="M 80 320 C 50 330, 40 370, 70 380 C 100 390, 120 350, 100 330 Z" fill="#f8fafc" stroke="#475569" stroke-width="4" />
      <circle cx="65" cy="350" r="14" fill="#f1f5f9" stroke="#475569" stroke-width="4" />
      <circle cx="85" cy="370" r="14" fill="#f1f5f9" stroke="#475569" stroke-width="4" />
      
      <!-- Khối má đùi gà chiên vàng ươm phủ sốt cay đỏ rực rỡ -->
      <path d="M 90 310 C 60 240, 70 140, 140 80 C 230 10, 340 70, 370 180 C 390 270, 310 350, 210 350 C 140 350, 110 340, 90 310 Z" 
        fill="url(#crispySpicyGrad)" stroke="#7f1d1d" stroke-width="6" />
      
      <!-- Lớp vỏ giòn rụm nổi gồ ghề và sốt cay óng ánh -->
      <path d="M 120 140 Q 200 60 290 100 Q 340 180 310 270 Q 210 310 140 250 Z" fill="#dc2626" opacity="0.75" />
      <path d="M 150 110 Q 230 70 300 130" stroke="#fca5a5" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M 170 200 Q 260 170 320 230" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85" />

      <!-- Vảy chiên xù giòn tan lấm tấm -->
      ${[
        [150, 180], [210, 130], [280, 160], [180, 240], [260, 230], [220, 290], [310, 220]
      ].map(([x, y]) => `
        <circle cx="${x}" cy="${y}" r="6" fill="#fef08a" stroke="#b45309" stroke-width="2" />
      `).join('')}

      <!-- Mè trắng và hành lá cắt nhỏ -->
      ${[
        [190, 150], [240, 110], [270, 190], [170, 220], [230, 250], [290, 260]
      ].map(([x, y]) => `
        <ellipse cx="${x}" cy="${y}" rx="4" ry="7" transform="rotate(35 ${x} ${y})" fill="#ffffff" stroke="#7f1d1d" stroke-width="1.5" />
      `).join('')}
      ${[
        [160, 160, 15], [230, 170, -20], [200, 210, 45], [270, 210, -10]
      ].map(([x, y, deg]) => `
        <rect x="${x}" y="${y}" width="16" height="8" rx="2" transform="rotate(${deg} ${x} ${y})" fill="#22c55e" stroke="#14532d" stroke-width="2" />
      `).join('')}
    </g>

    <defs>
      <linearGradient id="crispySpicyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="35%" stop-color="#ea580c" />
        <stop offset="70%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#991b1b" />
      </linearGradient>
    </defs>
  </svg>
`;

// 13. food_cheese_stick: Phô mai que cắn kéo sợi dài dẻo
const foodCheeseStickSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <g transform="translate(60, 70)">
      <!-- Bóng đổ -->
      <ellipse cx="200" cy="350" rx="160" ry="30" fill="#cbd5e1" opacity="0.6" />
      
      <!-- Que phô mai bên trái -->
      <g transform="rotate(-30 100 180)">
        <rect x="20" y="140" width="160" height="60" rx="20" fill="#f59e0b" stroke="#78350f" stroke-width="5" />
        <!-- Vảy xù giòn -->
        <line x1="35" y1="155" x2="160" y2="155" stroke="#fef08a" stroke-width="5" stroke-linecap="round" />
        <circle cx="50" cy="175" r="4" fill="#ffffff" />
        <circle cx="110" cy="180" r="4" fill="#fef08a" />
      </g>

      <!-- Que phô mai bên phải -->
      <g transform="rotate(30 300 180)">
        <rect x="220" y="140" width="160" height="60" rx="20" fill="#f59e0b" stroke="#78350f" stroke-width="5" />
        <line x1="235" y1="155" x2="360" y2="155" stroke="#fef08a" stroke-width="5" stroke-linecap="round" />
        <circle cx="270" cy="175" r="4" fill="#ffffff" />
        <circle cx="330" cy="180" r="4" fill="#fef08a" />
      </g>

      <!-- Dải sợi phô mai kéo dài dẻo mịn béo ngậy ở giữa -->
      <path d="M 130 150 C 180 180, 220 180, 270 150 C 260 210, 210 230, 180 230 C 150 230, 135 190, 130 150 Z" 
        fill="#fef08a" stroke="#ca8a04" stroke-width="4" />
      <path d="M 140 160 C 180 190, 220 190, 260 160" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" />
      <path d="M 160 190 C 185 210, 215 210, 240 190" stroke="#fde047" stroke-width="4" stroke-linecap="round" fill="none" />
      
      <!-- Vài giọt phô mai tan chảy -->
      <ellipse cx="200" cy="235" rx="8" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
    </g>
  </svg>
`;

// 14. food_danmuji: Chén củ cải vàng muối
const foodDanmujiSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <g transform="translate(76, 76)">
      <!-- Bóng chén -->
      <ellipse cx="180" cy="330" rx="140" ry="30" fill="#cbd5e1" opacity="0.6" />
      <!-- Chén sứ trắng viền xanh -->
      <ellipse cx="180" cy="220" rx="170" ry="110" fill="#f8fafc" stroke="#334155" stroke-width="6" />
      <ellipse cx="180" cy="215" rx="155" ry="95" fill="#f1f5f9" stroke="#0284c7" stroke-width="4" />
      <ellipse cx="180" cy="210" rx="140" ry="85" fill="#fef08a" opacity="0.5" />

      <!-- Các lát củ cải vàng bán nguyệt xếp lớp trong chén -->
      ${[
        [100, 160, -25], [160, 140, 10], [220, 150, -15],
        [120, 190, 20], [180, 185, -5], [240, 195, 30],
        [140, 230, -10], [200, 225, 15]
      ].map(([x, y, deg]) => `
        <g transform="translate(${x}, ${y}) rotate(${deg})">
          <path d="M 0 45 A 45 45 0 0 1 90 45 Z" fill="#facc15" stroke="#ca8a04" stroke-width="4" />
          <path d="M 10 40 A 35 35 0 0 1 80 40 Z" fill="#fde047" />
          <circle cx="45" cy="25" r="5" fill="#ffffff" opacity="0.85" />
        </g>
      `).join('')}

      <!-- Ánh sáng bóng nước ngâm chua ngọt -->
      <path d="M 80 180 Q 180 130 280 180" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75" />
    </g>
  </svg>
`;

// 15. food_coleslaw: Chén bắp cải trộn
const foodColeslawSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <g transform="translate(76, 76)">
      <!-- Bóng chén -->
      <ellipse cx="180" cy="330" rx="140" ry="30" fill="#cbd5e1" opacity="0.6" />
      <!-- Chén sứ trắng -->
      <ellipse cx="180" cy="220" rx="170" ry="110" fill="#f8fafc" stroke="#334155" stroke-width="6" />
      <ellipse cx="180" cy="215" rx="155" ry="95" fill="#fdfbf7" stroke="#475569" stroke-width="4" />

      <!-- Đống bắp cải trộn mayonnaise vun cao trong chén -->
      <ellipse cx="180" cy="205" rx="135" ry="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
      
      <!-- Sợi bắp cải tím, xanh, cà rốt cam -->
      ${[
        [100, 170, 25, '#9333ea'], [160, 155, -20, '#a855f7'], [220, 175, 35, '#7e22ce'],
        [110, 215, -15, '#ea580c'], [170, 200, 40, '#f97316'], [230, 220, -25, '#ea580c'],
        [90, 195, 10, '#86efac'], [150, 180, -30, '#bbf7d0'], [210, 190, 20, '#86efac'],
        [140, 235, 15, '#9333ea'], [190, 230, -35, '#f97316']
      ].map(([x, y, deg, color]) => `
        <rect x="${x}" y="${y}" width="55" height="9" rx="4" transform="rotate(${deg} ${x} ${y})" fill="${color}" stroke="#1f2937" stroke-width="2" />
      `).join('')}

      <!-- Nhánh ngò xanh tươi trang trí trên đỉnh -->
      <g transform="translate(180, 170)">
        <circle cx="-10" cy="-10" r="10" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        <circle cx="10" cy="-10" r="10" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        <circle cx="0" cy="-22" r="11" fill="#4ade80" stroke="#15803d" stroke-width="2" />
        <path d="M 0 0 L 0 -15" stroke="#15803d" stroke-width="3" stroke-linecap="round" />
      </g>
    </g>
  </svg>
`;

const ASSETS_LIST = [
  { path: 'kitchen/prep_chicken_raw.png', svg: gnPan13Svg(chickenRawContent) },
  { path: 'kitchen/prep_thigh_raw.png', svg: gnPan13Svg(thighRawContent) },
  { path: 'kitchen/prep_fries_raw.png', svg: gnPan13Svg(friesRawContent) },
  { path: 'kitchen/prep_popcorn_raw.png', svg: gnPan13Svg(popcornRawContent) },
  { path: 'kitchen/prep_cheese_stick_raw.png', svg: gnPan13Svg(cheeseStickRawContent) },
  { path: 'kitchen/side_radish_pickled.png', svg: gnPan16Svg(radishContent, ladleSvg) },
  { path: 'kitchen/side_coleslaw.png', svg: gnPan16Svg(coleslawContent) },
  { path: 'kitchen/pan_sauce_yangnyeom.png', svg: gnPan16Svg(sauceYangnyeomContent) },
  { path: 'kitchen/pan_sauce_soy_garlic.png', svg: gnPan16Svg(sauceSoyGarlicContent) },
  { path: 'kitchen/pan_locked_slot.png', svg: lockedSlotSvg },
  { path: 'kitchen/pan_empty.png', svg: gnPan13Svg(emptyPanContent, false) },
  { path: 'food/food_spicy_thigh.png', svg: foodSpicyThighSvg },
  { path: 'food/food_cheese_stick.png', svg: foodCheeseStickSvg },
  { path: 'food/food_danmuji.png', svg: foodDanmujiSvg },
  { path: 'food/food_coleslaw.png', svg: foodColeslawSvg }
];

async function generateAll() {
  console.log(`Generating ${ASSETS_LIST.length} source images into assets-src/...`);
  for (const item of ASSETS_LIST) {
    const dest = join('assets-src', item.path);
    await sharp(Buffer.from(item.svg))
      .png()
      .toFile(dest);
    console.log(`✓ Generated ${dest}`);
  }
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
