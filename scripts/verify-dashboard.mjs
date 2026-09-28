import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  console.log('Navigating to live GitHub Pages...');
  await page.goto('https://tandung060604-prog.github.io/tiem-ga-nha-tui/', { waitUntil: 'networkidle' });

  // Kiểm tra nút changelog
  console.log('Finding changelog button...');
  const changelogBtn = await page.$('#btn-title-changelog');
  if (!changelogBtn) {
    console.error('FAIL: Could not find #btn-title-changelog');
    await browser.close();
    process.exit(1);
  }

  console.log('Clicking #btn-title-changelog...');
  await changelogBtn.click();
  await page.waitForTimeout(500);

  // Kiểm tra modal
  const modalVisible = await page.$eval('#modal-container', el => !el.hasAttribute('hidden'));
  const dashboardCard = await page.$('#update-dashboard-modal');
  console.log('Modal visible:', modalVisible);
  console.log('Dashboard card present:', !!dashboardCard);

  const titleText = await page.$eval('.dash-main-title', el => el.textContent);
  console.log('Dashboard title:', titleText);

  if (!fs.existsSync('ui-check-out')) {
    fs.mkdirSync('ui-check-out', { recursive: true });
  }

  await page.screenshot({ path: 'ui-check-out/dashboard-live.png' });
  console.log('Screenshot saved to ui-check-out/dashboard-live.png');

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
