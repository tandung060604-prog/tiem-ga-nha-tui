import fs from 'node:fs';

const filePath = 'src/content/gachaStaffPool.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Bản đồ thang lương mới theo độ hiếm và index trong tier
// C: 15.000đ - 18.000đ
const cWages = [15000, 16000, 17000, 18000];
// R: 20.000đ - 28.000đ
const rWages = [20000, 22000, 25000, 28000];
// SR: 35.000đ - 48.000đ
const srWages = [35000, 40000, 48000];
// SSR: 70.000đ - 85.000đ
const ssrWages = [85000];

// Tách theo từng object nhân viên
const regex = /id:\s*['"]([a-z]+_[a-z0-9]+)['"][\s\S]*?rarity:\s*['"]([A-Z]+)['"][\s\S]*?hourlyWage:\s*(\d+)[\s\S]*?modelAsset:/g;

let updated = 0;
content = content.replace(regex, (match, id, rarity, oldWage) => {
  let newWage = parseInt(oldWage, 10);
  const role = id.split('_')[0];
  const tierCode = id.split('_')[1]; // c1, c2, r1, sr1, ssr...

  if (rarity === 'C') {
    const idx = parseInt(tierCode.replace('c', ''), 10) - 1;
    newWage = cWages[idx % cWages.length] || 16000;
  } else if (rarity === 'R') {
    const idx = parseInt(tierCode.replace('r', ''), 10) - 1;
    newWage = rWages[idx % rWages.length] || 24000;
  } else if (rarity === 'SR') {
    const idx = parseInt(tierCode.replace('sr', ''), 10) - 1;
    newWage = srWages[idx % srWages.length] || 42000;
  } else if (rarity === 'SSR') {
    newWage = 85000;
  }

  updated++;
  return match.replace(`hourlyWage: ${oldWage}`, `hourlyWage: ${newWage}`);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`✅ Đã cập nhật lại thang lương cho ${updated} nhân viên trong ${filePath}!`);
