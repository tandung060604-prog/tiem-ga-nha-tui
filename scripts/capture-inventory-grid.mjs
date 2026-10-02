import { chromium } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.goto('http://localhost:3000');
  await page.locator('#intro-tap-prompt').click({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(400);
  await page.locator('#btn-title-play').click();
  await page.locator('#btn-confirm-shop-name').click({ timeout: 4000 }).catch(() => {});
  await page.locator('#btn-welcome-start').click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(400);

  // Collapse chalkboard if open
  const toggleChalkboard = page.locator('#btn-toggle-chalkboard');
  if (await toggleChalkboard.isVisible()) {
    await toggleChalkboard.click();
    await page.waitForTimeout(300);
  }

  // Switch to inventory tab
  await page.locator('.tab-btn[data-tab="inventory"]').click();
  await page.waitForTimeout(400);

  // Scroll inventory into view
  await page.locator('.inventory-grid-stardew').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'ui-check-out/360-inventory-grid.png' });
  console.log('Successfully captured ui-check-out/360-inventory-grid.png');
  await browser.close();
}

run().catch(console.error);
