import { chromium } from 'playwright-core';
import { mkdirSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const TARGET_URL = 'http://localhost:3000';
const OUT_DIR = 'ui-check-out/showcase';
const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/18506250-c5cb-481a-9fbd-2262576c2324';

mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

console.log('📸 Bắt đầu chụp bộ ảnh showcase chất lượng cao...');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 412, height: 860 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
});
const page = await context.newPage();

await page.goto(TARGET_URL);
await page.waitForTimeout(600);

// Helper screenshot
async function takeShot(name, label) {
  const localFile = path.join(OUT_DIR, `${name}.png`);
  const artifactFile = path.join(ARTIFACT_DIR, `${name}.png`);
  await page.screenshot({ path: localFile });
  copyFileSync(localFile, artifactFile);
  console.log(`✅ [${label}] đã lưu: ${localFile} và ${artifactFile}`);
}

// 1. Title Screen với tương tác Bé Miu
await page.locator('#zone-cat').click();
await page.waitForTimeout(400);
await takeShot('showcase_1_title_screen', '1. Title Screen & Bong bóng thoại Bé Miu');

// Vào game
await page.locator('#btn-title-play').click();
await page.waitForTimeout(400);

const nameConfirm = page.locator('#btn-confirm-shop-name');
if (await nameConfirm.isVisible().catch(() => false)) {
  await nameConfirm.click();
  await page.waitForTimeout(300);
}
const welcomeStart = page.locator('#btn-welcome-start');
if (await welcomeStart.isVisible().catch(() => false)) {
  await welcomeStart.click();
  await page.waitForTimeout(400);
}

// 2. Tab Thực đơn
await page.locator('button[data-tab="menu"]').click();
await page.waitForTimeout(400);
await takeShot('showcase_2_menu_tab', '2. Tab Thực đơn & Dải giá K-Chicken');

// 3. Tab Kho hàng FIFO
await page.locator('button[data-tab="inventory"]').click();
await page.waitForTimeout(400);
await takeShot('showcase_3_inventory_tab', '3. Tab Kho hàng FIFO & Nút Hoàn Vốn -5');

// 4. Tab Đánh giá GenZ
await page.locator('button[data-tab="reviews"]').click();
await page.waitForTimeout(400);
await takeShot('showcase_4_reviews_tab', '4. Tab Đánh giá Viral GenZ');

// 5. Vào Ca bán hàng - Bếp chiên & Quầy Inox Sơ Chế
await page.locator('button[data-tab="inventory"]').click();
await page.waitForTimeout(200);
await page.locator('#btn-start-selling').click();
await page.waitForSelector('.selling-screen', { timeout: 5000 });

const tutNext = page.locator('#btn-tutorial-next');
if (await tutNext.isVisible().catch(() => false)) {
  await tutNext.click();
  await page.waitForTimeout(300);
}

// Thả gà vào chảo & chờ kim đo tới vùng VÀNG GIÒN
await page.locator('#btn-fry-chicken').click();
await page.waitForTimeout(1650); // Ngay đỉnh PERFECT!
await takeShot('showcase_5_frying_perfect', '5. Bếp chiên ngập dầu & Kim đo vùng PERFECT');

// Vớt gà lên khay & rót nước ngọt
await page.locator('#btn-fry-pot').click();
await page.waitForTimeout(300);
await page.locator('#btn-add-drink').click();
await page.waitForTimeout(300);
await page.locator('#btn-squeeze-ketchup').click();
await page.waitForTimeout(300);

// Phục vụ khách hàng
await page.locator('#btn-serve-order').click();
await page.waitForTimeout(300); // Chụp lúc tiền đang bay lên và chuỗi lửa streak
await takeShot('showcase_6_serving_rush', '6. Phục vụ đơn hàng & Hiệu ứng Tiền bay');

await browser.close();
console.log('🎉 Chụp hoàn tất toàn bộ 6 khoảnh khắc tinh hoa!');
