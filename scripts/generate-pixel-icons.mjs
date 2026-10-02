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

// 9. Golden Trophy Cup 🏆 (16x16)
const trophyPalette = {
  '.': [0, 0, 0, 0],
  '#': [50, 30, 10, 255],
  'G': [241, 196, 15, 255],
  'Y': [243, 156, 18, 255],
  'W': [255, 255, 210, 255],
  'S': [218, 165, 32, 255],
  'B': [100, 50, 20, 255],
  'L': [140, 75, 30, 255]
};
const trophyGrid = [
  '..############..',
  '.#GWWWWGGGGYY#..',
  '#WGGGGGGGGGYYY#.',
  '#W##GGGGGGG##Y#.',
  '#W##GGGGGGG##Y#.',
  '.##GGGGGGGGG##..',
  '..#GGGGGGGGG#...',
  '...#YYGGGGY#....',
  '....#YYYYY#.....',
  '.....#GGG#......',
  '.....#GGG#......',
  '....#SSSSS#.....',
  '...#LLLLLLL#....',
  '..#LLLLLLLLL#...',
  '..#BBBBBBBBB#...',
  '..###########...'
];

// 10. Vintage Newspaper 📰 (16x16)
const newspaperPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 35, 30, 255],
  'P': [248, 241, 227, 255],
  'S': [225, 215, 195, 255],
  'I': [50, 45, 40, 255],
  'R': [200, 40, 40, 255]
};
const newspaperGrid = [
  '..##########....',
  '.#PPPPPPPPP#....',
  '#PRRRRRRRRP#....',
  '#PPPPPPPPPP#....',
  '#PIIIIIIIIP#....',
  '#PPPPPPPPPP#....',
  '#PII#..#IIIP#...',
  '#PII#..#IIIP#...',
  '#PII#..#IIIP#...',
  '#PPPPPPPPPPP##..',
  '#PIII#..#IIISP#.',
  '#PIII#..#IIISP#.',
  '#PIII#..#IIISP#.',
  '#PPPPPPPPPPSSP#.',
  '.#SSSSSSSSSSSP#.',
  '..#############.'
];

// 11. Crispy Fried Drumstick 🍗 (16x16)
const chickenCrispyPalette = {
  '.': [0, 0, 0, 0],
  '#': [60, 30, 10, 255],
  'C': [230, 126, 34, 255],
  'Y': [243, 156, 18, 255],
  'L': [245, 205, 121, 255],
  'S': [160, 64, 0, 255],
  'B': [250, 240, 230, 255],
  'G': [210, 200, 190, 255]
};
const chickenCrispyGrid = [
  '......#####.....',
  '....##LLLLC##...',
  '...#LLLLCCCCY#..',
  '..#LLLLCCCCCCY#.',
  '.#LLLLCCCCCCCCS#',
  '.#LLLCCCCCCCCCS#',
  '#LLCCCCSCCCCCCS#',
  '#LCCCCCCCCCCCCS#',
  '#CCCCCCCCCCCCS#.',
  '.#YCCCCCCCCCS#..',
  '..#YYCCCCSS##...',
  '...##YYSS##B#...',
  '....####.#BBG#..',
  '........#BBBBG#.',
  '........#BB#BG#.',
  '.........##.##..'
];

// 12. Spicy Glazed Drumstick 🌶️ (16x16)
const chickenSpicyPalette = {
  '.': [0, 0, 0, 0],
  '#': [50, 10, 10, 255],
  'R': [214, 48, 49, 255],
  'D': [150, 20, 20, 255],
  'L': [255, 118, 117, 255],
  'W': [255, 255, 255, 255],
  'Y': [249, 202, 36, 255],
  'B': [250, 240, 230, 255],
  'G': [210, 200, 190, 255]
};
const chickenSpicyGrid = [
  '......#####.....',
  '....##LLLLR##...',
  '...#WLLLRRRRD#..',
  '..#WLLLRRRRRRD#.',
  '.#WLLLRRRRRRRRD#',
  '.#LLLRRYRRRRRRD#',
  '#LLRRRYDRRRRRRD#',
  '#LRRRRRDRRRRRRD#',
  '#RRRRRRYRRRRRD#.',
  '.#DRRRRRRRRRD#..',
  '..#DDRRRRDD##...',
  '...##DDRR##B#...',
  '....####.#BBG#..',
  '........#BBBBG#.',
  '........#BB#BG#.',
  '.........##.##..'
];

// 13. Honey Garlic Drumstick 🍯 (16x16)
const chickenHoneyPalette = {
  '.': [0, 0, 0, 0],
  '#': [55, 30, 10, 255],
  'H': [243, 156, 18, 255],
  'Y': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'D': [180, 85, 10, 255],
  'W': [255, 255, 255, 255],
  'B': [250, 240, 230, 255],
  'G': [210, 200, 190, 255]
};
const chickenHoneyGrid = [
  '......#####.....',
  '....##LLLLY##...',
  '...#WLLLYYYYD#..',
  '..#WLLLYWYYHYD#.',
  '.#WLLLYYYHYHHYD#',
  '.#LLLYYYHHYHHYD#',
  '#LLYYYWDYHHYHYD#',
  '#LYYYYHHDHHYHYD#',
  '#YYYYHHYWYHYHD#.',
  '.#DYYHYHHYYYD#..',
  '..#DDYYHHDD##...',
  '...##DDYY##B#...',
  '....####.#BBG#..',
  '........#BBBBG#.',
  '........#BB#BG#.',
  '.........##.##..'
];

// 14. Shake Fries 🍟 (16x16)
const shakeFriesPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 25, 15, 255],
  'F': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'O': [230, 126, 34, 255],
  'B': [210, 180, 140, 255],
  'D': [180, 140, 100, 255],
  'R': [235, 77, 75, 255]
};
const shakeFriesGrid = [
  '..#L#...#L#.....',
  '.#LFL#.#LFL#.#L#',
  '.#LFL#.#LFL##LFL',
  '#LFLOF##LFL#LFL#',
  '#LFOOF#LFLOFLLF#',
  '################',
  '#BBBBBBBBBBBBBBD',
  '#BBBRRRRRRBBBBDD',
  '#BBBRRRRRRBBBBDD',
  '#BBBRRRRRRBBBBDD',
  '#BBBBBBBBBBBBBBD',
  '#BBBBBBBBBBBBBBD',
  '.#BBBBBBBBBBBBD.',
  '..#BBBBBBBBBBD..',
  '...#DDDDDDDDD#..',
  '....#########...'
];

// 15. Soda Cup 🥤 (16x16)
const sodaCupPalette = {
  '.': [0, 0, 0, 0],
  '#': [30, 30, 40, 255],
  'T': [245, 245, 245, 255],
  'S': [235, 77, 75, 255],
  'C': [52, 152, 219, 255],
  'W': [255, 255, 255, 255],
  'D': [41, 128, 185, 255],
  'L': [220, 225, 230, 255]
};
const sodaCupGrid = [
  '.......#SS#.....',
  '......#TT##.....',
  '.....#SS#.......',
  '....#TT#........',
  '..############..',
  '.#LLLLLLLLLLLL#.',
  '..############..',
  '..#WWCCWWCCWWD#.',
  '..#WWCCWWCCWWD#.',
  '..#WWCCWWCCWWD#.',
  '...#WCCWWCCWD#..',
  '...#WCCWWCCWD#..',
  '...#WCCWWCCWD#..',
  '....#CCWWCCD#...',
  '....#DDDDDDD#...',
  '.....#######....'
];

// 16. Cast Iron Pan 🍳 (16x16)
const panPalette = {
  '.': [0, 0, 0, 0],
  '#': [25, 25, 30, 255],
  'M': [50, 55, 65, 255],
  'L': [80, 85, 95, 255],
  'Y': [241, 196, 15, 255],
  'W': [255, 255, 250, 255],
  'S': [255, 235, 150, 255],
  'H': [140, 75, 30, 255]
};
const panGrid = [
  '................',
  '....########....',
  '..##LLLLLLLL##..',
  '.#LMMMMMMMMMMD#.',
  '.#LMMWWWWMMMMD#.',
  '#LMMWWWWWWMMMMD#',
  '#LMWWYYYYWWMMMD#',
  '#LMWWYSYYWWMMMD#',
  '#LMMWWYYWWMMMMD#',
  '#LMMMWWWWMMMMMD#',
  '.#LMMMMMMMMMMD#.',
  '..##DDDDDDDD##..',
  '....####H####...',
  '.......#HH#.....',
  '.......#HH#.....',
  '........##......'
];

// 17. Role Cook 👨‍🍳 (16x16)
const roleCookPalette = {
  '.': [0, 0, 0, 0],
  '#': [40, 30, 25, 255],
  'W': [255, 255, 255, 255],
  'S': [220, 225, 230, 255],
  'R': [235, 77, 75, 255],
  'F': [255, 218, 193, 255],
  'D': [225, 175, 140, 255]
};
const roleCookGrid = [
  '.....######.....',
  '..###WWWWWW###..',
  '.#WWWWWWWWWWWW#.',
  '#WWWWWWWWWWWWWW#',
  '#WWSSWWSSWWSSWW#',
  '#WWSSWWSSWWSSWW#',
  '.#WWWWWWWWWWWW#.',
  '..############..',
  '...#FFFFFFFF#...',
  '..#F#F####F#F#..',
  '..#FFFFFFFFFF#..',
  '...#FFDDDDFF#...',
  '....#RRRRRR#....',
  '...#RRRRRRRR#...',
  '..#RRRRRRRRRR#..',
  '..############..'
];

// 18. Role Waiter 🧹 (16x16)
const roleWaiterPalette = {
  '.': [0, 0, 0, 0],
  '#': [30, 30, 35, 255],
  'B': [41, 128, 185, 255],
  'L': [52, 152, 219, 255],
  'W': [255, 255, 255, 255],
  'T': [235, 77, 75, 255],
  'F': [255, 218, 193, 255],
  'H': [50, 35, 25, 255]
};
const roleWaiterGrid = [
  '.....######.....',
  '....#HHHHHH#....',
  '...#HHHHHHHH#...',
  '...#FFFFFFFF#...',
  '...#F#F##F#F#...',
  '...#FFFFFFFF#...',
  '....#FFFFFF#....',
  '..###WWTTWW###..',
  '.#W#WWTWTWW#W#..',
  '#W#WW#TT#WWW#W#.',
  '#W#BBLLLLBBW#W#.',
  '..#BBLLLLBB#....',
  '..#BBLLLLBB#....',
  '..#BBLLLLBB#....',
  '..#BBBBBBBB#....',
  '..##########....'
];

// 19. Role Cashier 💰 (16x16)
const roleCashierPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 30, 15, 255],
  'W': [140, 75, 30, 255],
  'L': [180, 110, 50, 255],
  'S': [189, 195, 199, 255],
  'G': [241, 196, 15, 255],
  'B': [212, 172, 13, 255]
};
const roleCashierGrid = [
  '################',
  '#LLLLLLLLLLLLLL#',
  '#L############L#',
  '#L#G#S#G#S#G#G#L#',
  '#L#B#S#B#S#B#B#L#',
  '#L#S#G#S#G#S#S#L#',
  '#L##############',
  '#L#G#S#G#G#S#G#L#',
  '#L#B#S#B#B#S#B#L#',
  '#L#S#G#S#S#G#S#L#',
  '#L#S#B#S#S#B#S#L#',
  '#L#S#S#S#S#S#S#L#',
  '#L############L#',
  '#WWWWWWWWWWWWWW#',
  '################',
  '................'
];

// 20. Role Manager 👔 (16x16)
const roleManagerPalette = {
  '.': [0, 0, 0, 0],
  '#': [30, 30, 35, 255],
  'C': [255, 255, 255, 255],
  'T': [192, 57, 43, 255],
  'L': [231, 76, 60, 255],
  'J': [44, 62, 80, 255],
  'D': [30, 40, 55, 255],
  'G': [241, 196, 15, 255]
};
const roleManagerGrid = [
  '................',
  '....########....',
  '..##CCCCCCCC##..',
  '.#J#C#TTTT#C#J#.',
  '#JJ#C#TLTT#C#JJ#',
  '#JJD##TLTT##DJJ#',
  '#JJJ#GTLTT#DJJJ#',
  '#JJJD#TLTT#DJJJ#',
  '#JJJD#TLTT#DJJJ#',
  '#JJJD.#TT#.DJJJ#',
  '#JJJD.#TL#.DJJJ#',
  '#JJJD..#T#..DJJ#',
  '.#JJD..#T#..DJ#.',
  '..#JD...#...D#..',
  '...##.......##..',
  '................'
];

// 21. Role Security 🛡️ (16x16)
const roleSecurityPalette = {
  '.': [0, 0, 0, 0],
  '#': [25, 35, 20, 255],
  'K': [55, 85, 45, 255],
  'L': [80, 115, 65, 255],
  'R': [200, 35, 35, 255],
  'Y': [245, 215, 60, 255],
  'W': [190, 195, 200, 255],
  'S': [130, 135, 140, 255]
};
const roleSecurityGrid = [
  '.....######.....',
  '...##LLLLLL##...',
  '..#LLLLLLLLLL#..',
  '.#LLLLRRYLLLLL#.',
  '#LLLLRYYYYLLLLK#',
  '#KKKKRYYYYKKKKK#',
  '#KKKKKRRYKKKKKK#',
  '#KKKKKKKKKKKKKK#',
  '################',
  '....#WWWWWW#....',
  '....#WSSSSW#....',
  '....#W#..#W#....',
  '....#WWWWWW#....',
  '.....#WWWW#.....',
  '......#WW#......',
  '.......##.......'
];

// 22. Hamburger Menu ☰ (16x16)
const menuPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 25, 15, 255],
  'W': [160, 82, 45, 255],
  'L': [210, 140, 75, 255],
  'S': [110, 50, 20, 255],
  'N': [200, 200, 200, 255]
};
const menuGrid = [
  '................',
  '..############..',
  '.#NLLLLLLLLLLN#.',
  '.#NWWWWWWWWWWN#.',
  '.#NSSSSSSSSSSN#.',
  '..############..',
  '................',
  '..############..',
  '.#NLLLLLLLLLLN#.',
  '.#NWWWWWWWWWWN#.',
  '.#NSSSSSSSSSSN#.',
  '..############..',
  '................',
  '..############..',
  '.#NLLLLLLLLLLN#.',
  '..############..'
];

// 23. Lightning Bolt ⚡ (16x16)
const lightningPalette = {
  '.': [0, 0, 0, 0],
  '#': [140, 90, 10, 255],
  'Y': [241, 196, 15, 255],
  'W': [255, 255, 220, 255],
  'O': [230, 126, 34, 255]
};
const lightningGrid = [
  '........#####...',
  '.......#WWYY#...',
  '......#WWYY#....',
  '.....#WWYY#.....',
  '....#WWYY#......',
  '...#WWYYYYYY#...',
  '..#WWYYYYYYY#...',
  '..###########...',
  '......#WWYY#....',
  '.....#WWYY#.....',
  '....#WWYY#......',
  '...#WWYY#.......',
  '..#WWYY#........',
  '.#WWY##.........',
  '.#YY#...........',
  '..##............'
];

// 24. Tabby Cat 🐱 (16x16)
const catPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 30, 20, 255],
  'O': [230, 126, 34, 255],
  'L': [245, 185, 120, 255],
  'W': [255, 255, 255, 255],
  'P': [255, 160, 170, 255],
  'G': [46, 204, 113, 255]
};
const catGrid = [
  '.##.......##....',
  '#PL#.....#LP#...',
  '#OPL#...#LPO#...',
  '#OOPL###LPOO#...',
  '#OOOOOOOOOOO#...',
  '#OLLOOOOOLLO#...',
  '#OLGOLOLGLLO#...',
  '#OLLLLLLLLLO#...',
  '#OOOWWWWWPOO#...',
  '#OOOWPWPWOOO#...',
  '#OOOOWWWPOOO#...',
  '.#OOOOOOOOO#....',
  '..#OOOOOOO#.....',
  '...#######......',
  '................',
  '................'
];

// 25. Golden Alley Dog 🐕 (16x16)
const dogPalette = {
  '.': [0, 0, 0, 0],
  '#': [45, 30, 15, 255],
  'Y': [212, 143, 56, 255],
  'L': [245, 195, 130, 255],
  'W': [255, 255, 255, 255],
  'N': [30, 20, 15, 255],
  'R': [235, 77, 75, 255]
};
const dogGrid = [
  '..###.....###...',
  '.#YYY#...#YYY#..',
  '#YYYYY###YYYYY#.',
  '#YYYYYYYYYYYYY#.',
  '#YLLYYYYYYYLLY#.',
  '#YLNYYYYYYYNLY#.',
  '#YLLYYYYYYYLLY#.',
  '#YYYWWWWWWWYYY#.',
  '#YYWWNNNNNWWYY#.',
  '.#YWWNNNNNWWY#..',
  '..#YWWWWWWWY#...',
  '...#YYYYYYY#....',
  '..#RRRRRRRRR#...',
  '..#RRRRRRRRR#...',
  '..###########...',
  '................'
];

// 26. Vintage Radio 📻 (16x16)
const radioPalette = {
  '.': [0, 0, 0, 0],
  '#': [35, 35, 40, 255],
  'M': [140, 80, 45, 255],
  'L': [180, 115, 70, 255],
  'S': [200, 205, 210, 255],
  'D': [80, 85, 90, 255],
  'Y': [241, 196, 15, 255],
  'A': [160, 165, 170, 255]
};
const radioGrid = [
  '........#A......',
  '.......#A.......',
  '......#A........',
  '..#####A######..',
  '.#LLLLLLLLLLLL#.',
  '#LLLLLLLLLLLLLL#',
  '#L#SD#SD##YYYY#M',
  '#L#DS#DS##YYYY#M',
  '#L#SD#SD###YY##M',
  '#L#DS#DS##M##M#M',
  '#L#SD#SD##M##M#M',
  '#MMMMMMMMMMMMMM#',
  '#MMMMMMMMMMMMMM#',
  '.##############.',
  '..##........##..',
  '................'
];

// 27. Green Checkmark ✓ (16x16)
const checkPalette = {
  '.': [0, 0, 0, 0],
  '#': [15, 60, 25, 255],
  'G': [39, 174, 96, 255],
  'L': [46, 204, 113, 255],
  'W': [255, 255, 255, 255]
};
const checkGrid = [
  '................',
  '.............##.',
  '............#LW#',
  '...........#LWG#',
  '..........#LWG#.',
  '.........#LWG#..',
  '........#LWG#...',
  '.##....#LWG#....',
  '#WW#..#LWG#.....',
  '#GWW##LWG#......',
  '.#GLWWWG#.......',
  '..#GLWG#........',
  '...#GW#.........',
  '....##..........',
  '................',
  '................'
];

// 28. Crimson Close Cross ✕ (16x16)
const closePalette = {
  '.': [0, 0, 0, 0],
  '#': [60, 15, 15, 255],
  'R': [235, 77, 75, 255],
  'L': [255, 118, 117, 255],
  'D': [180, 30, 30, 255]
};
const closeGrid = [
  '................',
  '.##..........##.',
  '#LL##......##LL#',
  '#LRRL#....#LRRL#',
  '.#DRRL#..#LRRD#.',
  '..#DRRL##LRRD#..',
  '...#DRRRRRD#....',
  '....#LRRRL#.....',
  '....#LRRRL#.....',
  '...#DRRRRRD#....',
  '..#DRRL##LRRD#..',
  '.#DRRL#..#LRRD#.',
  '#LRRL#....#LRRL#',
  '#LL##......##LL#',
  '.##..........##.',
  '................'
];

// 29. Festive Gift 🎁 (16x16)
const giftPalette = {
  '.': [0, 0, 0, 0],
  '#': [50, 20, 10, 255],
  'Y': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'R': [235, 77, 75, 255],
  'D': [180, 30, 30, 255],
  'W': [255, 255, 255, 255]
};
const giftGrid = [
  '.....##..##.....',
  '....#WW##WW#....',
  '....#WRRRRW#....',
  '.....#RRRR#.....',
  '..############..',
  '.#LLLLRRRRLLLL#.',
  '.#YYYYRRRRYYYY#.',
  '.#YYYYRRRRYYYY#.',
  '..############..',
  '..#LLLRRRRLLL#..',
  '..#YYYRRRRYYY#..',
  '..#YYYRRRRYYY#..',
  '..#YYYRRRRYYY#..',
  '..#YYYRRRRYYY#..',
  '..#DDDRRRRDDD#..',
  '..############..'
];

// 30. Bullseye Target 🎯 (16x16)
const targetPalette = {
  '.': [0, 0, 0, 0],
  '#': [50, 15, 15, 255],
  'R': [235, 77, 75, 255],
  'W': [255, 255, 255, 255],
  'Y': [241, 196, 15, 255]
};
const targetGrid = [
  '.....######.....',
  '...##RRRRRR##...',
  '..#RRWWWWWWRR#..',
  '.#RRWWWWWWWWRR#.',
  '.#RWW#RRRR#WWR#.',
  '#RWW#RRRRRR#WWR#',
  '#RWW#RR##RR#WWR#',
  '#RWW#R#YY#R#WWR#',
  '#RWW#R#YY#R#WWR#',
  '#RWW#RR##RR#WWR#',
  '#RWW#RRRRRR#WWR#',
  '.#RWW#RRRR#WWR#.',
  '.#RRWWWWWWWWRR#.',
  '..#RRWWWWWWRR#..',
  '...##RRRRRR##...',
  '.....######.....'
];

// 31. Police Cap 👮 (16x16)
const policePalette = {
  '.': [0, 0, 0, 0],
  '#': [20, 25, 40, 255],
  'B': [41, 128, 185, 255],
  'L': [52, 152, 219, 255],
  'G': [241, 196, 15, 255],
  'Y': [243, 156, 18, 255],
  'V': [40, 45, 50, 255]
};
const policeGrid = [
  '.....######.....',
  '...##LLLLLL##...',
  '..#LLLLLLLLLL#..',
  '.#LLLL#GG#LLLL#.',
  '#LLLL#GGGG#LLLB#',
  '#BBBB#GGGG#BBBB#',
  '#BBBBB#YY#BBBBB#',
  '#BBBBBBBBBBBBBB#',
  '################',
  '..#VVVVVVVVVV#..',
  '.#VVVVVVVVVVVV#.',
  '..############..',
  '................',
  '................',
  '................',
  '................'
];

// 32. Emote Yum 😋 (16x16)
const emoteYumPalette = {
  '.': [0, 0, 0, 0],
  '#': [80, 50, 10, 255],
  'Y': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'R': [235, 77, 75, 255],
  'W': [255, 255, 255, 255]
};
const emoteYumGrid = [
  '.....######.....',
  '...##LLLLYY##...',
  '..#LLLLYYYYYY#..',
  '.#LL##YYYY##YY#.',
  '.#L#..#YY#..#Y#.',
  '#LL####YY####YY#',
  '#LLYYYYYYYYYYYY#',
  '#LLYYYYYYYYYYYY#',
  '#LL#RRRRRRRR#YY#',
  '#LL#RWWWWWRR#YY#',
  '.#L#RRRRRRRR#Y#.',
  '.#LL##RRRR##YY#.',
  '..#LLLYYYRYYY#..',
  '...##YYYYYY##...',
  '.....######.....',
  '................'
];

// 33. Emote Sweat 💦 (16x16)
const emoteSweatPalette = {
  '.': [0, 0, 0, 0],
  '#': [20, 60, 90, 255],
  'B': [52, 152, 219, 255],
  'L': [116, 185, 255, 255],
  'W': [255, 255, 255, 255]
};
const emoteSweatGrid = [
  '.......#........',
  '......#L#.......',
  '.....#LLW#......',
  '....#LLLLW#.....',
  '....#LLLLLB#....',
  '....#LLLLLB#....',
  '.....#BBB##.....',
  '......###.......',
  '..#.......#.....',
  '.#L#.....#L#....',
  '#LLW#...#LLW#...',
  '#LLLB#..#LLLB#..',
  '#LLLB#..#LLLB#..',
  '.#BB#....#BB#...',
  '..##......##....',
  '................'
];

// 34. Emote Anger 💢 (16x16)
const emoteAngerPalette = {
  '.': [0, 0, 0, 0],
  '#': [70, 10, 10, 255],
  'R': [235, 47, 6, 255],
  'L': [255, 107, 107, 255],
  'W': [255, 255, 255, 255]
};
const emoteAngerGrid = [
  '.####......####.',
  '#WLLR#....#WLLR#',
  '#WLLR######WLLR#',
  '.#RRRWLLLLRRRR#.',
  '..#RRWLLLLRRR#..',
  '..#RRWLLLLRRR#..',
  '..#RRWLLLLRRR#..',
  '.#WLLRRRRRRWLLR#',
  '#WLLLLRRRRWLLLL#',
  '#WLLLLRRRRWLLLL#',
  '.#WLLRRRRRRWLLR#',
  '..#RRWLLLLRRR#..',
  '..#RRWLLLLRRR#..',
  '..#RRWLLLLRRR#..',
  '#WLLR######WLLR#',
  '.####......####.'
];

// 35. Emote Question ❓ (16x16)
const emoteQuestionPalette = {
  '.': [0, 0, 0, 0],
  '#': [60, 40, 10, 255],
  'Y': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'D': [212, 143, 56, 255]
};
const emoteQuestionGrid = [
  '....########....',
  '..##LLLLLLYY##..',
  '.#LLLLYYYYYYDD#.',
  '#LLYY####YYYYDD#',
  '#LLYY#..#YYYYDD#',
  '####....#YYYYDD#',
  '........#YYYDD#.',
  '.......#YYYDD#..',
  '......#YYYDD#...',
  '.....#YYYDD#....',
  '.....#YYYDD#....',
  '......#####.....',
  '................',
  '.....######.....',
  '....#LLYYDD#....',
  '.....######.....'
];

// 36. Emote Money 💵 (16x16)
const emoteMoneyPalette = {
  '.': [0, 0, 0, 0],
  '#': [20, 60, 30, 255],
  'G': [39, 174, 96, 255],
  'L': [46, 204, 113, 255],
  'Y': [241, 196, 15, 255],
  'W': [255, 255, 255, 255]
};
const emoteMoneyGrid = [
  '..############..',
  '.#LLLLLLLLLLLL#.',
  '#LLLLLLLLLLLLLG#',
  '#L##LLLLLLLL##G#',
  '#L#LL##YY##LL#G#',
  '#LLLL#YYYY#LLLG#',
  '#LLLL#YYYY#LLLG#',
  '#L#LL##YY##LL#G#',
  '#L##LLLLLLLL##G#',
  '#LGGGGGGGGGGGGG#',
  '.#GGGGGGGGGGGG#.',
  '..############..',
  '................',
  '................',
  '................',
  '................'
];

// 37. Emote Oil Alert ⚠️ (16x16)
const emoteOilAlertPalette = {
  '.': [0, 0, 0, 0],
  '#': [60, 40, 10, 255],
  'Y': [241, 196, 15, 255],
  'L': [255, 234, 167, 255],
  'O': [45, 25, 10, 255]
};
const emoteOilAlertGrid = [
  '.......##.......',
  '......#LL#......',
  '.....#LLYY#.....',
  '.....#LOOY#.....',
  '....#LLOOYY#....',
  '...#LLLOOYYY#...',
  '...#LLLOOYYY#...',
  '..#LLLLOOYYYY#..',
  '..#LLLLOOYYYY#..',
  '.#LLLLLOOYYYYY#.',
  '.#LLLL####YYYY#.',
  '#LLLLL#OO#YYYYY#',
  '#LLLLL####YYYYY#',
  '#LLLLLLLLYYYYYY#',
  '################',
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
  { name: 'icon_broom.png', grid: broomGrid, pal: broomPalette },
  { name: 'icon_trophy.png', grid: trophyGrid, pal: trophyPalette },
  { name: 'icon_newspaper.png', grid: newspaperGrid, pal: newspaperPalette },
  { name: 'icon_chicken_crispy.png', grid: chickenCrispyGrid, pal: chickenCrispyPalette },
  { name: 'icon_chicken_spicy.png', grid: chickenSpicyGrid, pal: chickenSpicyPalette },
  { name: 'icon_chicken_honey.png', grid: chickenHoneyGrid, pal: chickenHoneyPalette },
  { name: 'icon_shake_fries.png', grid: shakeFriesGrid, pal: shakeFriesPalette },
  { name: 'icon_soda_cup.png', grid: sodaCupGrid, pal: sodaCupPalette },
  { name: 'icon_pan.png', grid: panGrid, pal: panPalette },
  { name: 'icon_role_cook.png', grid: roleCookGrid, pal: roleCookPalette },
  { name: 'icon_role_waiter.png', grid: roleWaiterGrid, pal: roleWaiterPalette },
  { name: 'icon_role_cashier.png', grid: roleCashierGrid, pal: roleCashierPalette },
  { name: 'icon_role_delivery.png', grid: scooterGrid, pal: scooterPalette },
  { name: 'icon_role_manager.png', grid: roleManagerGrid, pal: roleManagerPalette },
  { name: 'icon_role_security.png', grid: roleSecurityGrid, pal: roleSecurityPalette },
  { name: 'icon_hamburger_menu.png', grid: menuGrid, pal: menuPalette },
  { name: 'icon_lightning.png', grid: lightningGrid, pal: lightningPalette },
  { name: 'icon_cat.png', grid: catGrid, pal: catPalette },
  { name: 'icon_dog.png', grid: dogGrid, pal: dogPalette },
  { name: 'icon_radio.png', grid: radioGrid, pal: radioPalette },
  { name: 'icon_check.png', grid: checkGrid, pal: checkPalette },
  { name: 'icon_close.png', grid: closeGrid, pal: closePalette },
  { name: 'icon_gift.png', grid: giftGrid, pal: giftPalette },
  { name: 'icon_target.png', grid: targetGrid, pal: targetPalette },
  { name: 'icon_police.png', grid: policeGrid, pal: policePalette },
  // Stardew emote balloons
  { name: 'emote_yum.png', grid: emoteYumGrid, pal: emoteYumPalette },
  { name: 'emote_sweat.png', grid: emoteSweatGrid, pal: emoteSweatPalette },
  { name: 'emote_anger.png', grid: emoteAngerGrid, pal: emoteAngerPalette },
  { name: 'emote_question.png', grid: emoteQuestionGrid, pal: emoteQuestionPalette },
  { name: 'emote_money.png', grid: emoteMoneyGrid, pal: emoteMoneyPalette },
  { name: 'emote_oil_alert.png', grid: emoteOilAlertGrid, pal: emoteOilAlertPalette },
  { name: 'emote_sparkle.png', grid: sparkleGrid, pal: sparklePalette },
  { name: 'emote_heart.png', grid: heartGrid, pal: heartPalette }
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
