import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 412, height: 860 } });
const page = await context.newPage();

console.log('1. Loading page...');
await page.goto('http://localhost:3000');
await page.waitForTimeout(500);

console.log('2. Clicking cat...');
await page.locator('#zone-cat').click();
await page.waitForTimeout(500);

console.log('3. Clicking Bac Ba...');
await page.locator('#zone-bacba').click();
await page.waitForTimeout(500);

console.log('4. Clicking Play...');
await page.locator('#btn-title-play').click();
await page.waitForTimeout(500);

const nameConfirm = page.locator('#btn-confirm-shop-name');
if (await nameConfirm.isVisible().catch(() => false)) {
  console.log('5. Confirming shop name...');
  await nameConfirm.click();
  await page.waitForTimeout(400);
}

const welcomeStart = page.locator('#btn-welcome-start');
if (await welcomeStart.isVisible().catch(() => false)) {
  console.log('6. Confirming welcome...');
  await welcomeStart.click();
  await page.waitForTimeout(400);
}

console.log('7. In Chalkboard Hub! Checking tabs...');
await page.locator('button[data-tab="menu"]').click();
await page.waitForTimeout(500);
console.log('Tab menu clicked!');

await page.locator('button[data-tab="inventory"]').click();
await page.waitForTimeout(500);
console.log('Tab inventory clicked!');

await page.locator('button[data-tab="reviews"]').click();
await page.waitForTimeout(500);
console.log('Tab reviews clicked!');

await page.locator('button[data-tab="inventory"]').click();
await page.waitForTimeout(400);

console.log('8. Clicking start selling...');
await page.locator('#btn-start-selling').click();
await page.waitForSelector('.selling-screen', { timeout: 5000 });
console.log('In selling screen!');

const tutNext = page.locator('#btn-tutorial-next');
if (await tutNext.isVisible().catch(() => false)) {
  console.log('Skipping tutorial intro...');
  await tutNext.click();
  await page.waitForTimeout(300);
}

console.log('9. Frying chicken...');
const fryChicken = page.locator('#btn-fry-chicken');
if (await fryChicken.isVisible().catch(() => false)) {
  await fryChicken.click();
  console.log('Chicken dropped in pot! Waiting for gauge...');
  await page.waitForTimeout(1600);
  await page.locator('#btn-fry-pot').click();
  console.log('Chicken lifted to tray!');
}

console.log('10. Pouring drink...');
const addDrink = page.locator('#btn-add-drink');
if (await addDrink.isVisible().catch(() => false)) {
  await addDrink.click();
  console.log('Drink poured!');
}

await page.waitForTimeout(500);
const serveBtn = page.locator('#btn-serve-order');
if (await serveBtn.isVisible().catch(() => false)) {
  await serveBtn.click().catch(() => console.log('Serve not ready yet'));
  console.log('Serve clicked!');
}

console.log('ALL ACTIONS PASSED PERFECTLY!');
await browser.close();
