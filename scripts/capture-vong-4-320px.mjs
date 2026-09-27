import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'ui-check-out';
mkdirSync(OUT, { recursive: true });

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 320, height: 750 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002');

  // Title Screen
  const playBtn = page.locator('#btn-title-play');
  if (await playBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await playBtn.click();
  }

  // Shop Name Dialog
  const nameInput = page.locator('#input-new-shop-name');
  if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await nameInput.fill('Tiệm Gà 320px');
    await page.locator('#btn-confirm-shop-name').click();
    await page.waitForTimeout(400);
  }

  const welcomeBtn = page.locator('#btn-welcome-start');
  if (await welcomeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await welcomeBtn.click();
    await page.waitForTimeout(400);
  }

  // 1. Vào thẳng màn bán hàng trước (Selling screen ở 320px)
  console.log('Entering selling screen at 320px...');
  const startBtn = page.locator('#btn-start-selling');
  if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForSelector('.selling-screen', { timeout: 5000 });
    
    // Bỏ qua hướng dẫn nếu có
    const skipBtn = page.locator('#btn-tutorial-skip');
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/320-selling-prep-station.png` });
    console.log(`✓ Saved ${OUT}/320-selling-prep-station.png`);

    // Chụp riêng phần quầy khay inox GN
    const prepStation = page.locator('.prep-station');
    if (await prepStation.isVisible().catch(() => false)) {
      await prepStation.screenshot({ path: `${OUT}/320-prep-station.png` });
      console.log(`✓ Saved ${OUT}/320-prep-station.png`);
    }

    // Chụp riêng thẻ khách có tên món dài
    const firstCard = page.locator('.customer-card').first();
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.screenshot({ path: `${OUT}/320-customer-card.png` });
      console.log(`✓ Saved ${OUT}/320-customer-card.png`);
    }

    // Chụp riêng quầy giữ nhiệt có .t-name
    const assembleCard = page.locator('.assemble-card');
    if (await assembleCard.isVisible().catch(() => false)) {
      await assembleCard.screenshot({ path: `${OUT}/320-assemble-tray.png` });
      console.log(`✓ Saved ${OUT}/320-assemble-tray.png`);
    }
  }

  // 2. Chụp Bảng P&L Cuối Ngày trong modal ở 320px
  console.log('Rendering P&L summary modal at 320px...');
  await page.evaluate(() => {
    const modalContainer = document.querySelector('#modal-container');
    const modalContent = document.querySelector('#modal-content');
    if (modalContainer && modalContent) {
      modalContainer.hidden = false;
      modalContent.innerHTML = `
        <div class="summary-container">
          <h2 class="summary-title">🎉 Tổng Kết Ngày 1</h2>
          <div class="summary-subtitle">Ca bán hoàn thành xuất sắc! Dưới đây là sổ sách hôm nay:</div>
          <div class="ledger-box pnl">
            <div class="pnl-form-badge" data-form="household">Hộ kinh doanh · thuế khoán 4,5%</div>
            <details class="pnl-section" open>
              <summary class="ledger-row pnl-subtotal"><span>Doanh thu</span><span class="val-pos">+385.000đ</span></summary>
              <div class="ledger-row pnl-row"><span>Bán tại quầy</span><span class="val-pos">+320.000đ</span></div>
              <div class="ledger-row pnl-row"><span>Bán qua app giao hàng</span><span class="val-pos">+50.000đ</span></div>
              <div class="ledger-row pnl-row"><span>Tip &amp; thưởng tay nghề</span><span class="val-pos">+15.000đ</span></div>
            </details>
            <details class="pnl-section" open>
              <summary class="ledger-row pnl-subtotal"><span>Giá vốn hàng bán</span><span class="val-neg">-125.000đ</span></summary>
              <div class="ledger-row pnl-row neg"><span>Nguyên liệu đã dùng</span><span class="val-neg">-90.000đ</span></div>
              <div class="ledger-row pnl-row neg"><span>Bao bì &amp; hộp kraft</span><span class="val-neg">-20.000đ</span></div>
              <div class="ledger-row pnl-row neg"><span>Thay dầu chiên</span><span class="val-neg">-15.000đ</span></div>
            </details>
            <details class="pnl-section" open>
              <summary class="ledger-row pnl-subtotal"><span>Chi phí vận hành</span><span class="val-neg">-80.000đ</span></summary>
              <div class="ledger-row pnl-row neg"><span>Tiền mặt bằng hẻm</span><span class="val-neg">-50.000đ</span></div>
              <div class="ledger-row pnl-row neg"><span>Điện nước &amp; gas</span><span class="val-neg">-30.000đ</span></div>
            </details>
            <div class="ledger-row pnl-profit">
              <span>Lãi trước thuế</span>
              <span class="val-pos">+180.000đ</span>
            </div>
            <details class="pnl-section" open>
              <summary class="ledger-row pnl-subtotal"><span>Thuế</span><span class="val-neg">-17.325đ</span></summary>
              <div class="ledger-row pnl-row neg"><span>Thuế GTGT (3% DT)</span><span class="val-neg">-11.550đ</span></div>
              <div class="ledger-row pnl-row neg"><span>Thuế TNCN (1,5% DT)</span><span class="val-neg">-5.775đ</span></div>
            </details>
            <div class="ledger-row total pnl-net">
              <span>LỢI NHUẬN RÒNG</span>
              <span class="val-pos">+162.675đ</span>
            </div>
            <div class="pnl-note">Tiền bán đã vào quỹ lúc giao món, nguyên liệu trả lúc nhập kho. Đóng cửa chỉ trừ chi phí vận hành và thuế.</div>
          </div>
        </div>
      `;
    }
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/320-pnl-summary.png` });
  console.log(`✓ Saved ${OUT}/320-pnl-summary.png`);

  await browser.close();
  console.log('All 320px screenshots captured successfully.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
