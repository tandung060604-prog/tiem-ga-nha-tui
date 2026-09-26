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
  page.on('response', r => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
    // vite preview trả index.html (200) cho file không tồn tại → ảnh nhận về dạng HTML là ảnh hỏng (trang thật sẽ 404)
    else if (r.request().resourceType() === 'image' && (r.headers()['content-type'] ?? '').includes('text/html')) errors.push(`Ảnh không tồn tại ${r.url()}`);
  });
  const tag = `[${deviceName} ${device.viewport.width}px]`;

  await page.goto(TARGET);
  const title = page.locator('#title-screen');
  check(await title.isVisible(), `${tag} màn tiêu đề hiện ra`);
  await page.screenshot({ path: `${OUT}/ios-${device.viewport.width}-title.png` });
  await page.locator('#btn-title-play').tap();
  // Tiệm mới: đặt tên quán
  const nameInput = page.locator('#input-new-shop-name');
  await nameInput.waitFor({ timeout: 5000 });
  await nameInput.fill('Gà Giòn Test 🍗');
  await page.locator('#btn-confirm-shop-name').tap();
  await page.locator('#btn-welcome-start').tap({ timeout: 5000 }).catch(() => {});
  check((await page.locator('.store-badge').textContent())?.includes('Gà Giòn Test'), `${tag} đặt tên quán hiện lên biển hiệu`);
  check(!(await title.isVisible()), `${tag} chạm Bắt đầu vào được game`);

  await page.locator('#btn-start-selling').tap();
  await page.locator('.selling-screen').waitFor();
  // Tiệm mới ngày 1: làm theo Bác Ba tới khi giao xong khách đầu (chạm cảm ứng thật: touchstart → touchend → click)
  const steps = [];
  let tutorialDone = false;
  for (let i = 0; i < 80 && !tutorialDone; i++) {
    const hint = await page.evaluate(() => {
      const t = document.querySelector('.tutorial-target');
      return { text: (document.querySelector('.tutorial-text')?.textContent ?? '').slice(0, 20), target: t ? (t.id || t.className.split(' ')[0]) : '', button: !!document.getElementById('btn-tutorial-next') };
    });
    if (!hint.text) break;
    if (steps[steps.length - 1] !== hint.text) steps.push(hint.text);
    const sel = hint.button ? '#btn-tutorial-next' : hint.target && hint.target !== 'cook-gauge-container' && hint.target !== 'customer-card' ? '.tutorial-target' : null;
    if (sel) {
      if (hint.button && hint.text.startsWith('Giỏi lắm')) tutorialDone = true;
      await page.locator(sel).first().scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(450); // Bác Ba cuộn mượt tới nút: đợi cuộn xong mới lấy tọa độ
      const box = await page.locator(sel).first().boundingBox();
      if (box) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    }
    await page.waitForTimeout(250);
  }
  const stuck = tutorialDone ? '' : await page.evaluate(() => JSON.stringify({
    modal: document.getElementById('modal-container')?.hasAttribute('hidden') === false ? document.getElementById('modal-content')?.textContent?.trim().slice(0, 60) : null,
    tray: [...document.querySelectorAll('.tray-item .t-name')].map(e => e.textContent),
    target: document.querySelector('.tutorial-target')?.id ?? null
  }));
  check(tutorialDone && !(await page.locator('#tutorial-layer').count()), `${tag} làm theo Bác Ba tới hết hướng dẫn`, `${steps.length} bước: ${steps.join(' / ')} ${stuck}`);
  let tapsOk = true;
  for (const id of ['#btn-add-drink', '#btn-fry-chicken']) {
    try { await page.locator(id).tap({ timeout: 3000 }); } catch (e) {
      console.log(`[TAP ERROR ${id}]`, e.message.split('\n')[0]);
      tapsOk = false;
    }
  }
  check(tapsOk, `${tag} chạm nút trong ca bán ăn ngay`);

  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
  check(broken.length === 0, `${tag} mọi ảnh tải được`, broken.slice(0, 3).join(', '));
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(over <= 0, `${tag} không cuộn ngang`, over > 0 ? `dư ${over}px` : '');
  await page.screenshot({ path: `${OUT}/ios-${device.viewport.width}-selling.png` });

  // Thoát giữa ca (đóng/tải lại trang) → mở lại → tiếp tục đúng ca, giữ tên quán
  await page.waitForTimeout(1500);
  const clockBefore = await page.locator('.clock b').textContent();
  await page.reload();
  await page.locator('#btn-title-play').tap();
  const resumed = await page.locator('.selling-screen').waitFor({ timeout: 5000 }).then(() => true, () => false);
  const clockAfter = resumed ? await page.locator('.clock b').textContent() : '';
  check(resumed && (clockAfter ?? '') >= (clockBefore ?? ''), `${tag} tải lại giữa ca → tiếp tục ca bán`, `${clockBefore} → ${clockAfter}`);
  check((await page.locator('.store-badge').textContent())?.includes('Gà Giòn Test'), `${tag} tên quán còn sau khi tải lại`);
  check(errors.length === 0, `${tag} không lỗi JS / tải file`, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
