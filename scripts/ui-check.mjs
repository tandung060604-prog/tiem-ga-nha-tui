// Kiểm tra giao diện tự động trên Chrome thật (headless), khung điện thoại.
// Chạy: npm run dev (terminal khác) rồi npm run ui:check [url]
// Mỗi mục in PASS / FAIL / WARN; exit code 1 nếu có FAIL. Ảnh chụp lưu ở ui-check-out/.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const TARGET = process.argv[2] ?? 'http://localhost:3000';
const OUT = 'ui-check-out';
const WIDTHS = [360, 390];
// Phải khớp CookingEngine.ZONES (38 / 48 / 70 / 80) → độ rộng 38, 10, 22, 10, 20 (%)
const ZONE_PCT = [['zone-raw', 38], ['zone-good', 10], ['zone-perfect', 22], ['zone-good', 10], ['zone-burnt', 20]];
const MIN_TAP = 44;

mkdirSync(OUT, { recursive: true });
const results = [];
const record = (status, width, name, detail = '') => results.push({ status, width, name, detail });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const width of WIDTHS) {
  const page = await (await browser.newContext({
    viewport: { width, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true
  })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // 404 báo qua console không kèm URL → lấy URL từ response, bỏ bản console trùng
  page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`); });
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const loc = m.location().url;
    // Bản console của một lỗi HTTP đã ghi ở trên thì bỏ; còn lại (vd. favicon) vẫn ghi kèm URL
    if (m.text().startsWith('Failed to load resource') && errors.some(e => loc && e.endsWith(new URL(loc).pathname))) return;
    errors.push(loc ? `${m.text()} @ ${loc}` : m.text());
  });

  // Tràn trang = FAIL. Phần tử vượt màn nhưng nằm trong khung cuộn riêng (overflow-x auto/scroll/hidden)
  // thì không làm trang cuộn ngang, chỉ bị khuất → WARN.
  const overflow = () => page.evaluate(() => {
    const clipped = e => {
      for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
        if (['auto', 'scroll', 'hidden'].includes(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    const name = e => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`;
    const outside = [...document.querySelectorAll('.app *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1);
    return {
      over: document.documentElement.scrollWidth - innerWidth,
      culprits: outside.filter(e => !clipped(e)).slice(0, 3).map(name),
      // Hàng khách cuộn ngang là thiết kế cố ý → không cảnh báo
      hidden: [...new Set(outside.filter(e => clipped(e) && !e.closest('.customer-lane')).map(e => name(e.closest('[class]') ?? e)))].slice(0, 3)
    };
  });
  const checkOverflow = async label => {
    const o = await overflow();
    const fail = o.over > 0 || o.culprits.length > 0;
    record(fail ? 'FAIL' : 'PASS', width, `không tràn ngang (${label})`,
      fail ? `dư ${o.over}px; tràn: ${o.culprits.join(', ')}` : '');
    if (!fail && o.hidden.length) record('WARN', width, `phần tử bị khuất trong khung cuộn (${label})`, o.hidden.join(', '));
  };

  await page.goto(TARGET);
  await page.locator('#btn-title-play').click(); // màn tiêu đề (chạm đầu tiên bật âm thanh iOS)
  await page.locator('#btn-confirm-shop-name').click(); // tiệm mới: đặt tên quán (giữ tên gợi ý)
  await page.locator('#btn-welcome-start').click();
  await checkOverflow('màn Chuẩn bị');
  await page.screenshot({ path: `${OUT}/${width}-prep.png` });

  await page.locator('#btn-start-selling').click();
  await page.locator('.selling-screen').waitFor();
  await checkOverflow('vào ca bán');

  // Thanh đo 5 vùng đúng tỉ lệ
  const zones = await page.locator('.cook-gauge-zones > div').evaluateAll(els => {
    const total = els.reduce((s, e) => s + e.getBoundingClientRect().width, 0);
    return els.map(e => [e.classList[0], total ? (e.getBoundingClientRect().width / total) * 100 : 0]);
  });
  const zonesOk = zones.length === ZONE_PCT.length
    && zones.every(([cls, pct], i) => cls === ZONE_PCT[i][0] && Math.abs(pct - ZONE_PCT[i][1]) <= 1.5);
  record(zonesOk ? 'PASS' : 'FAIL', width, 'thanh đo khớp ngưỡng code (38/10/22/10/20)',
    zones.map(([c, p]) => `${c}:${p.toFixed(0)}%`).join(' '));

  // Bấm nút thật + món trong khay nhìn thấy được
  try {
    const tutNext = page.locator('#btn-tutorial-next');
    if (await tutNext.isVisible().catch(() => false)) await tutNext.click();
    await page.locator('#btn-add-drink').click({ timeout: 3000 });
    record('PASS', width, 'nút bấm ăn (click thật)');
  } catch (e) {
    record('FAIL', width, 'nút bấm ăn (click thật)', e.message.split('\n')[0]);
  }
  await page.waitForTimeout(400); // cho animation vào khay chạy xong
  const tray = await page.locator('.tray-item').first().evaluate(e => {
    const r = e.getBoundingClientRect();
    return { opacity: Number(getComputedStyle(e).opacity), w: r.width, h: r.height };
  }).catch(() => null);
  record(tray && tray.opacity > 0.9 && tray.w > 20 && tray.h > 20 ? 'PASS' : 'FAIL', width,
    'món trong khay nhìn thấy được', tray ? `opacity=${tray.opacity} ${Math.round(tray.w)}x${Math.round(tray.h)}` : 'không có .tray-item');

  // Vùng chạm tối thiểu
  const small = await page.locator('.selling-screen button').evaluateAll((els, min) => els
    .map(e => ({ id: e.id || e.className, r: e.getBoundingClientRect() }))
    .filter(x => x.r.width > 0 && (x.r.width < min || x.r.height < min))
    .map(x => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`), MIN_TAP);
  record(small.length ? 'WARN' : 'PASS', width, `nút trong ca bán ≥ ${MIN_TAP}px`, small.join('; '));

  // Hàng khách đông (lỗi tràn cũ chỉ lộ ra khi ≥3 thẻ): nhân bản thẻ để tạo đúng tình huống,
  // đo ngay trước khi vòng render kế tiếp dựng lại DOM.
  const crowded = await page.evaluate(() => {
    const lane = document.querySelector('.customer-lane');
    const card = lane?.querySelector('.customer-card');
    if (!lane || !card) return null;
    while (lane.querySelectorAll('.customer-card').length < 5) lane.appendChild(card.cloneNode(true));
    const over = document.documentElement.scrollWidth - innerWidth;
    const app = Math.round(document.querySelector('.app').getBoundingClientRect().width);
    return { over, app };
  });
  record(crowded && crowded.over <= 0 && crowded.app <= width ? 'PASS' : 'FAIL', width, 'không tràn ngang (hàng 5 khách)',
    crowded ? `dư ${crowded.over}px, .app rộng ${crowded.app}px` : 'không có thẻ khách để thử');
  await page.screenshot({ path: `${OUT}/${width}-selling.png` });

  record(errors.length ? 'FAIL' : 'PASS', width, 'không lỗi JS/console', errors.slice(0, 3).join(' | '));
  await page.context().close();
}
await browser.close();

for (const r of results) console.log(`${r.status.padEnd(4)} [${r.width}px] ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
const failed = results.filter(r => r.status === 'FAIL').length;
console.log(`\n${failed ? `${failed} FAIL` : 'Tất cả PASS'} · ảnh chụp: ${OUT}/`);
process.exit(failed ? 1 : 0);
