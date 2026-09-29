/**
 * Master Overnight Test Suite (ĐIỀU PHỐI BÀI TEST XUYÊN ĐÊM)
 * Chạy đồng thời hoặc theo chế độ:
 *  - Core Stress Test: Mô phỏng 10,000 - 50,000 ngày, kiểm tra 100% Invariants toán học & lưu save
 *  - Browser Monkey Test: Tự động tương tác Chrome Playwright liên tục 8 tiếng hoặc N ngày
 * 
 * Cách chạy:
 *  npm run test:overnight
 *  hoặc: node scripts/run-overnight.mjs --hours=8 --days=10000 --mode=all
 */

import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const eq = args.find(a => a.startsWith(`--${name}=`));
  if (eq) return eq.split('=')[1];
  return fallback;
};

const MODE = getArg('mode', 'all'); // 'all' | 'core' | 'browser'
const HOURS = getArg('hours', '8');
const DAYS = getArg('days', '10000');
const HEADLESS = getArg('headless', 'true');

console.log(`\n=============================================================`);
console.log(`🌙 KHỞI ĐỘNG BỘ TEST XUYÊN ĐÊM (TIỆM GÀ NHÀ TUI - v2.5.0)`);
console.log(`=============================================================`);
console.log(`⚙️  Chế độ kiểm tra: ${MODE.toUpperCase()}`);
console.log(`⏱️  Thời lượng dự kiến: ${HOURS} giờ`);
console.log(`📅  Mục tiêu số ngày: ${DAYS} ngày`);
console.log(`🖥️  Chế độ trình duyệt: ${HEADLESS === 'false' ? 'Có giao diện (Headed)' : 'Ẩn (Headless)'}`);
console.log(`=============================================================\n`);

function runCommand(command, cmdArgs, label) {
  return new Promise((resolve, reject) => {
    console.log(`[${label}] Bắt đầu thực thi: ${command} ${cmdArgs.join(' ')}`);
    const proc = spawn(command, cmdArgs, { stdio: 'inherit', shell: true });

    proc.on('close', code => {
      if (code === 0) {
        console.log(`[${label}] Hoàn thành thành công (Exit 0) ✓`);
        resolve(code);
      } else {
        console.log(`[${label}] Kết thúc với mã: ${code}`);
        resolve(code);
      }
    });

    proc.on('error', err => {
      console.error(`[${label}] Lỗi khởi chạy:`, err);
      reject(err);
    });
  });
}

async function main() {
  if (MODE === 'core' || MODE === 'all') {
    console.log(`\n🔹 GIAI ĐOẠN 1: TEST ĐỘ BỀN TOÁN HỌC & CORE GAMEPLAY (${DAYS} NGÀY)`);
    await runCommand('npx', ['tsx', 'scripts/overnight-core-stress.ts', `--days=${DAYS}`], 'CORE-STRESS');
  }

  if (MODE === 'browser' || MODE === 'all') {
    console.log(`\n🔹 GIAI ĐOẠN 2: BROWSER CHAOS MONKEY (CHẠY TRÌNH DUYỆT TREO MÁY ${HOURS} GIỜ)`);
    await runCommand('node', ['scripts/overnight-browser-monkey.mjs', `--hours=${HOURS}`, `--headless=${HEADLESS}`], 'BROWSER-MONKEY');
  }

  console.log(`\n=============================================================`);
  console.log(`✨ TẤT CẢ BÀI TEST XUYÊN ĐÊM ĐÃ HOÀN TẤT!`);
  console.log(`📄 Nhật ký lưu tại: logs/overnight-core-stress.log & logs/overnight-browser-monkey.log`);
  console.log(`📄 Báo cáo tổng hợp: docs/bao-cao-test-xuyen-dem.md`);
  console.log(`=============================================================\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
