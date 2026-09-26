import { chromium } from 'playwright-core';
import { mkdirSync, copyFileSync } from 'node:fs';

const OUT = 'ui-check-out';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
})).newPage();

page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);

// Bấm nút chơi hoặc kích hoạt incident
await page.evaluate(() => {
  console.log('HAS __triggerIncident?', typeof window.__triggerIncident, typeof window.__app);
  document.getElementById('title-screen')?.remove();
  if (window.__triggerIncident) {
    const inc = window.__triggerIncident('incident_kitchen_romance');
    console.log('TRIGGERED INCIDENT:', inc?.id);
  }
});

// Chờ modal xuất hiện
await page.waitForSelector('.incident-dialog', { timeout: 5000 });
await page.waitForTimeout(600); // chờ animation pop-in hoàn tất

const screenshotPath = `${OUT}/incident-kitchen-romance.png`;
await page.screenshot({ path: screenshotPath });
console.log('Screenshot prompt saved to', screenshotPath);

// Bấm vào nút lựa chọn đầu tiên (Cho nghỉ 1 ngày)
await page.click('.incident-choice-btn.btn-coral-choice');
await page.waitForTimeout(600);

const reactionPath = `${OUT}/incident-reaction-result.png`;
await page.screenshot({ path: reactionPath });
console.log('Screenshot reaction saved to', reactionPath);

await browser.close();
