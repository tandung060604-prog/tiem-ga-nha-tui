// Kiểm tra trên engine của Safari iOS (WebKit) với cấu hình iPhone thật: màn tiêu đề, chạm, ảnh, tràn ngang.
// Chạy: npm run build && npx vite preview --port 3002, rồi: node scripts/ios-check.mjs [url]
import { webkit, devices } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const TARGET = process.argv[2] ?? 'http://localhost:3002/';
const OUT = 'ui-check-out';
mkdirSync(OUT, { recursive: true });
const results = [];
const check = (ok, name, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);

const browser = await webkit.launch();
for (const deviceName of ['iPhone SE', 'iPhone 13', 'iPhone 15 Pro Max']) {
  const device = devices[deviceName] ?? devices['iPhone 13'];
  const ctx = await browser.newContext({ ...device });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  const tag = `[${deviceName} ${device.viewport.width}px]`;

  await page.goto(TARGET);
  const title = page.locator('#title-screen');
  check(await title.isVisible(), `${tag} màn tiêu đề hiện ra`);
  await page.screenshot({ path: `${OUT}/ios-${device.viewport.width}-title.png` });
  await page.locator('#btn-title-play').tap();
  await page.locator('#btn-welcome-start').tap({ timeout: 5000 }).catch(() => {});
  check(!(await title.isVisible()), `${tag} chạm Bắt đầu vào được game`);

  await page.locator('#btn-start-selling').tap();
  await page.locator('.selling-screen').waitFor();
  let tapsOk = true;
  for (const id of ['#btn-add-drink', '#btn-fry-chicken']) {
    try { await page.locator(id).tap({ timeout: 3000 }); } catch { tapsOk = false; }
  }
  check(tapsOk, `${tag} chạm nút trong ca bán ăn ngay`);

  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
  check(broken.length === 0, `${tag} mọi ảnh tải được`, broken.slice(0, 3).join(', '));
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(over <= 0, `${tag} không cuộn ngang`, over > 0 ? `dư ${over}px` : '');
  await page.screenshot({ path: `${OUT}/ios-${device.viewport.width}-selling.png` });
  check(errors.length === 0, `${tag} không lỗi JS / tải file`, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
