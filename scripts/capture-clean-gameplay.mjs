import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/cca998b2-81e4-44d7-868b-8683332dd524';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const width of [360, 390]) {
  const height = width === 360 ? 800 : 844;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://localhost:3000');
  const introPrompt = page.locator('#intro-tap-prompt');
  if (await introPrompt.isVisible({ timeout: 2500 }).catch(() => false)) {
    await introPrompt.click({ force: true }).catch(() => {});
    await page.waitForTimeout(600);
  }
  await page.locator('#btn-title-play').click();
  await page.locator('#btn-confirm-shop-name').click({ timeout: 5000 }).catch(() => {});
  await page.locator('#btn-welcome-start').click({ timeout: 5000 }).catch(() => {});

  const introOverlay = page.locator('#intro-cinematic-overlay');
  if (await introOverlay.isVisible({ timeout: 1000 }).catch(() => false)) {
    await introOverlay.click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
  }

  await page.locator('#btn-start-selling').click();
  await page.locator('.selling-screen').waitFor();
  await page.waitForTimeout(500);
  
  // Dismiss tutorial or intro popups
  const tutNext = page.locator('#btn-tutorial-next');
  if (await tutNext.isVisible().catch(() => false)) await tutNext.click();
  const tutSkip = page.locator('#btn-tutorial-skip');
  if (await tutSkip.isVisible().catch(() => false)) await tutSkip.click();
  const skipBtn = page.locator('button:has-text("Bỏ qua hướng dẫn")');
  if (await skipBtn.isVisible().catch(() => false)) await skipBtn.click();
  
  // Pour drink into tray
  await page.locator('#btn-add-drink').click({ timeout: 3000 }).catch(() => {});
  
  // Drop raw chicken into fryer
  await page.locator('#btn-fry-pot').click({ timeout: 3000 }).catch(() => {});
  
  // Remove any remaining toast / modal elements
  await page.evaluate(() => {
    document.querySelectorAll('.toast, .bacba-tip-banner, .tutorial-spotlight-box').forEach(el => el.remove());
  });
  
  await page.waitForTimeout(800);
  
  const localPath = `ui-check-out/${width}-clean-selling.png`;
  const artifactPath = path.join(ARTIFACT_DIR, `screen_${width}_hero_kitchen.png`);
  
  await page.screenshot({ path: localPath });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`Captured ${width}px -> ${artifactPath}`);
}

await browser.close();
console.log('Clean gameplay screenshots captured and copied to artifacts!');
