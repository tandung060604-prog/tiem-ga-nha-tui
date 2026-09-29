import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  
  const page = await browser.newPage({
    viewport: { width: 360, height: 740 }
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'ui-check-out/pixel-title-360.png' });
  console.log('Chụp thành công ui-check-out/pixel-title-360.png');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'ui-check-out/pixel-title-390.png' });
  console.log('Chụp thành công ui-check-out/pixel-title-390.png');

  await browser.close();
}

capture().catch(console.error);
