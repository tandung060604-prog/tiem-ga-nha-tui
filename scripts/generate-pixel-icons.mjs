import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

mkdirSync('public/assets/icons', { recursive: true });
mkdirSync('assets-src/icons', { recursive: true });

function renderPixelArt(grid, palette, scale = 4) {
  const height = grid.length;
  const width = grid[0].length;
  const rawBuf = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = grid[y][x];
      const color = palette[char] || [0, 0, 0, 0];
      const idx = (y * width + x) * 4;
      rawBuf[idx] = color[0];
      rawBuf[idx + 1] = color[1];
      rawBuf[idx + 2] = color[2];
      rawBuf[idx + 3] = color[3];
    }
  }

  return sharp(rawBuf, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .resize(width * scale, height * scale, { kernel: 'nearest' })
    .png();
}

// 1. Service Bell 🛎️ (16x16)
const bellPalette = {
  '.': [0, 0, 0, 0],
  '#': [44, 26, 17, 255],     // dark outline
  'B': [241, 196, 15, 255],   // shiny bell gold
  'Y': [243, 156, 18, 255],   // bell amber shade
  'W': [255, 250, 205, 255],  // specular highlight
  'S': [189, 195, 199, 255],  // ringer steel
  'D': [127, 140, 141, 255],  // ringer dark
  'O': [141, 73, 37, 255],    // wood base
  'K': [94, 44, 20, 255]      // wood base shadow
};
const bellGrid = [
  '.......##.......',
  '......#SS#......',
  '.......##.......',
  '......#YY#......',
  '....##YYYY##....',
  '...#WWBBYYYY#...',
  '..#WWBBYYYYYY#..',
  '.#WWBBYYYYYYYY#.',
  '.#WWBBBBBYYYYY#.',
  '#WWBBBBBBBYYYYY#',
  '#WWBBBBBBBYYYYY#',
  '#WWBBBBBBBYYYYY#',
  '################',
  '..#OOOOOOOOOO#..',
  '..#KKKKKKKKKK#..',
  '..############..'
];

// 2. Stardew Red Heart ❤️ (16x16)
const heartPalette = {
  '.': [0, 0, 0, 0],
  '#': [58, 14, 18, 255],    // deep border
  'R': [235, 47, 6, 255],     // crimson heart
  'D': [183, 21, 64, 255],    // dark heart shading
  'L': [255, 107, 107, 255],  // bright red
  'W': [255, 255, 255, 255]   // shine
};
const heartGrid = [
  '..####...####...',
  '.#LRRR#.#LRRR#..',
  '#WLLRRR#WLLRRR#.',
  '#WLLRRRRRRRRRR#.',
  '#WLLRRRRRRRRRR#.',
  '#LLRRRRRRRRRRR#.',
  '.#LRRRRRRRRRRD#.',
  '..#RRRRRRRRRD#..',
  '...#RRRRRRRRD#..',
  '....#RRRRRRD#...',
  '.....#RRRRD#....',
  '......#RRRD#....',
  '.......#RD#.....',
  '........#D#.....',
  '.........#......',
  '................'
];

// 3. Oil Can / Jerrycan 🛢️ (16x16)
const oilPalette = {
  '.': [0, 0, 0, 0],
  '#': [38, 42, 48, 255],    // dark steel outline
  'M': [116, 125, 140, 255], // metal grey
  'L': [164, 176, 190, 255], // light metal
  'G': [245, 176, 65, 255],  // golden oil
  'Y': [243, 156, 18, 255],  // deep amber oil
  'W': [255, 243, 205, 255], // bright highlight
  'C': [235, 77, 75, 255]    // red spout cap
};
const oilGrid = [
  '....##..........',
  '...#CC#.........',
  '...#CC##.####...',
  '....#LL#.#MM#...',
  '...#LLLL##MM#...',
  '..#LLLLLL####...',
  '..#LLLLLLLLM#...',
  '..#LLWWWWLLM#...',
  '..#LLWGGWLLM#...',
  '..#LLWGGWLLM#...',
  '..#LLWWWWLLM#...',
  '..#LLYYYYLLM#...',
  '..#LLLLLLLLM#...',
  '..#LLLLLLLLM#...',
  '..#MMMMMMMMM#...',
  '...#########....'
];

// 4. Secret Sauce Jar 🍲 (16x16)
const saucePalette = {
  '.': [0, 0, 0, 0],
  '#': [47, 24, 16, 255],     // dark rim
  'C': [225, 112, 85, 255],   // clay terra cotta
  'L': [250, 177, 160, 255],  // clay light
  'S': [178, 60, 40, 255],    // clay shadow
  'R': [214, 48, 49, 255],    // red cloth / ribbon
  'W': [255, 234, 167, 255],  // parchment tie
  'G': [241, 196, 15, 255]    // golden star badge
};
const sauceGrid = [
  '.....######.....',
  '....#WWWWWW#....',
  '....#RRRRRR#....',
  '...#R#R##R#R#...',
  '..#LLLLCCCCCS#..',
  '.#LLLLCCCCCCCS#.',
  '.#LLLLCCCCCCCS#.',
  '.#LLLCCGGCCCS#..',
  '.#LLLCCGGCCCS#..',
  '.#LLLCCCCCCCS#..',
  '.#LLLCCCCCCCS#..',
  '.#LLLCCCCCCCS#..',
  '..#LLCCCCCCCS#..',
  '..#SSSSSSSSSS#..',
  '...##########...',
  '................'
];

// 5. Retro Delivery Scooter 🛵 (16x16)
const scooterPalette = {
  '.': [0, 0, 0, 0],
  '#': [33, 33, 33, 255],    // outline
  'R': [235, 77, 75, 255],   // scooter red
  'W': [255, 255, 255, 255], // white headlight/fender
  'B': [46, 204, 113, 255],  // green delivery thermal box
  'D': [39, 174, 96, 255],   // dark green box
  'Y': [241, 196, 15, 255],  // headlight amber
  'T': [60, 64, 70, 255],    // tire rubber
  'S': [189, 195, 199, 255]  // chrome rim
};
const scooterGrid = [
  '.........##.....',
  '........#SS#....',
  '..####...#R#Y#..',
  '.#BBBB#..#R##...',
  '.#B##B#...#R#...',
  '.#BBBB#.##RR#...',
  '..####.#RRRR#...',
  '...#RRRRRRRR#...',
  '...#RRRRRRR##...',
  '..##TT##RR#TT#..',
  '.#TTSTT#.#TTST#.',
  '.#TSSST#.#TSSST#',
  '.#TTSTT#.#TTSTT#',
  '..##TT##..##TT##',
  '....##......##..',
  '................'
];

// 6. Trash / Cancel Bin 🗑️ (16x16)
const trashPalette = {
  '.': [0, 0, 0, 0],
  '#': [44, 44, 44, 255],
  'M': [149, 165, 166, 255],
  'L': [200, 214, 229, 255],
  'D': [127, 140, 141, 255],
  'R': [231, 76, 60, 255]
};
const trashGrid = [
  '......####......',
  '.....#LLLL#.....',
  '...##########...',
  '..#LLLLLLLLLM#..',
  '...##########...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#LLMRRMLL#...',
  '...#DDMDDMDD#...',
  '....########....',
  '................',
  '................'
];

// 7. Sparkle Star ✨ (16x16)
const sparklePalette = {
  '.': [0, 0, 0, 0],
  '#': [180, 130, 20, 255],
  'G': [241, 196, 15, 255],
  'W': [255, 255, 230, 255],
  'Y': [243, 156, 18, 255]
};
const sparkleGrid = [
  '.......#........',
  '......#W#.......',
  '......#W#.......',
  '.....#GWW#......',
  '....#GGWWG#.....',
  '...#GGWWWGG#....',
  '.##GGWWWWWGG##..',
  '#WWWWWWWWWWWW#..',
  '.##GGWWWWWGG##..',
  '...#GGWWWGG#....',
  '....#GGWWG#.....',
  '.....#GWW#......',
  '......#W#.......',
  '......#W#.......',
  '.......#........',
  '................'
];

// 8. Straw Broom 🧹 (16x16)
const broomPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 30, 15, 255],
  'W': [160, 82, 45, 255],   // wood handle
  'L': [205, 133, 63, 255],  // wood light
  'S': [245, 205, 121, 255], // straw yellow
  'D': [225, 177, 44, 255],  // straw shadow
  'R': [192, 57, 43, 255]    // red twine
};
const broomGrid = [
  '.............#L#',
  '............#LW#',
  '...........#LW#.',
  '..........#LW#..',
  '.........#LW#...',
  '........#LW#....',
  '.......#LW#.....',
  '......#LW#......',
  '.....#RR#.......',
  '....#SSSS#......',
  '...#SSDDSS#.....',
  '..#SSDDDDSS#....',
  '.#SSSDDDDDSS#...',
  '#SSSSDDDDDSS#...',
  '##.##.##.##.##..',
  '................'
];

const icons = [
  { name: 'icon_bell.png', grid: bellGrid, pal: bellPalette },
  { name: 'icon_heart.png', grid: heartGrid, pal: heartPalette },
  { name: 'icon_oil_can.png', grid: oilGrid, pal: oilPalette },
  { name: 'icon_sauce.png', grid: sauceGrid, pal: saucePalette },
  { name: 'icon_scooter.png', grid: scooterGrid, pal: scooterPalette },
  { name: 'icon_trash.png', grid: trashGrid, pal: trashPalette },
  { name: 'icon_sparkle.png', grid: sparkleGrid, pal: sparklePalette },
  { name: 'icon_broom.png', grid: broomGrid, pal: broomPalette }
];

async function main() {
  for (const item of icons) {
    const buf = await renderPixelArt(item.grid, item.pal, 4).toBuffer();
    writeFileSync(join('public/assets/icons', item.name), buf);
    writeFileSync(join('assets-src/icons', item.name), buf);
    console.log(`Generated: public/assets/icons/${item.name}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
