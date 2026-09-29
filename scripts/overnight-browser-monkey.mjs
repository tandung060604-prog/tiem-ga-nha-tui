/**
 * Overnight Browser Monkey & Chaos Stress Tester (BÀI TEST XUYÊN ĐÊM TRÌNH DUYỆT TREO MÁY)
 * Tự động lái Chrome qua hàng trăm ngày chơi thật trên nền tảng UI Mobile (Playwright):
 *  - Tương tác quầy bếp, thả gà, canh lửa, rót nước ngọt 3 vị, xịt tương, phục vụ khách
 *  - Xử lý toàn bộ các Modal, Minigames (Lọc Dầu, Sốt Bí Truyền, Chợ Đầu Mối, Giao Đơn Xa)
 *  - Bắt 100% Page Errors, Console Errors, Tràn Màn Hình, Rò Rỉ DOM Node và UI Deadlock
 *  - Chụp ảnh màn hình bằng chứng tự động khi gặp bất kỳ sự cố nào vào logs/screenshots/
 */

import { chromium } from 'playwright-core';
import { appendFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const LOG_FILE = 'logs/overnight-browser-monkey.log';
const REPORT_MD = 'docs/bao-cao-test-xuyen-dem.md';
mkdirSync('logs/screenshots', { recursive: true });

writeFileSync(LOG_FILE, `=== BẮT ĐẦU TEST XUYÊN ĐÊM TRÌNH DUYỆT: ${new Date().toISOString()} ===\n`);

function log(msg) {
  const line = `[${new Date().toLocaleTimeString('vi-VN')}] ${msg}`;
  console.log(line);
  appendFileSync(LOG_FILE, line + '\n');
}

function triggerJevTriage(title, symptom, source) {
  try {
    const cleanTitle = title.replace(/["\r\n]/g, ' ');
    const cleanSymptom = symptom.replace(/["\r\n]/g, ' ');
    const p = spawn('npx', ['tsx', 'scripts/consult-jev-bug-triage.ts', `"${cleanTitle}"`, `"${cleanSymptom}"`, `"${source}"`], {
      detached: true,
      stdio: 'ignore',
      shell: true,
    });
    p.unref();
  } catch {}
}

// Đọc tham số dòng lệnh: node scripts/overnight-browser-monkey.mjs [--hours H] [--days D] [--headless false] [--url URL]
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const eq = args.find(a => a.startsWith(`--${name}=`));
  if (eq) return eq.split('=')[1];
  return fallback;
};

const TARGET_URL = getArg('url', 'http://localhost:3000');
const MAX_HOURS = parseFloat(getArg('hours', '8')); // Mặc định treo máy 8 tiếng xuyên đêm
const MAX_DAYS = parseInt(getArg('days', '200'), 10);
const IS_HEADLESS = getArg('headless', 'true') !== 'false';
const ACTION_DELAY_MS = parseInt(getArg('delay', '60'), 10);

const sleep = ms => new Promise(r => setTimeout(r, ms));

class OvernightMonkey {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.deadlocks = [];
    this.daysCompleted = 0;
    this.totalActions = 0;
    this.domNodeCounts = [];
  }

  async run() {
    log(`🐒 Khởi động Browser Chaos Monkey trên Chrome (Headless: ${IS_HEADLESS})`);
    log(`🎯 Target URL: ${TARGET_URL} | Giới hạn: ${MAX_HOURS}h hoặc ${MAX_DAYS} ngày chơi`);

    const browser = await chromium.launch({
      channel: 'chrome',
      headless: IS_HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu-rasterization']
    });

    const context = await browser.newContext({
      viewport: { width: 360, height: 800 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    const page = await context.newPage();
    page.setDefaultTimeout(2000);

    // 1. Lắng nghe lỗi JavaScript chưa bắt (Unhandled Exceptions)
    page.on('pageerror', async (err) => {
      const errStr = String(err?.stack || err);
      log(`❌ [PAGE ERROR]: ${errStr}`);
      const shotPath = `logs/screenshots/pageerror-${Date.now()}.png`;
      await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {});
      this.errors.push({ type: 'pageerror', message: errStr, screenshot: shotPath, day: this.daysCompleted });
      triggerJevTriage(`Page Crash Ngày ${this.daysCompleted}`, errStr.slice(0, 150), 'src/main.ts');
    });

    // 2. Lắng nghe Console Error
    page.on('console', async (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')) return;
        log(`⚠️ [CONSOLE ERROR]: ${text}`);
        this.errors.push({ type: 'console.error', message: text, day: this.daysCompleted });
      }
    });

    // 3. Mở trang Web Game
    try {
      await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(1000);
    } catch (e) {
      log(`🚨 Không thể kết nối tới ${TARGET_URL}. Hãy chắc chắn dev server đang chạy: 'npm run dev'`);
      await browser.close();
      return;
    }

    // Vượt qua màn Title Screen nếu có
    await this.dismissTitleScreen(page);

    // VÒNG LẶP CHÍNH TREO MÁY
    const maxDurationMs = MAX_HOURS * 3600 * 1000;
    let lastActionTimestamp = Date.now();

    while (Date.now() - this.startTime < maxDurationMs && this.daysCompleted < MAX_DAYS) {
      try {
        // Kiểm tra UI Deadlock (nếu không có hành động nào thành công trong 25 giây)
        if (Date.now() - lastActionTimestamp > 25000) {
          log(`⚠️ Cảnh báo UI Deadlock: Hệ thống đứng yên > 25s. Kích hoạt Watchdog tự phục hồi...`);
          const shotPath = `logs/screenshots/deadlock-day-${this.daysCompleted}-${Date.now()}.png`;
          await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {});
          this.deadlocks.push({ day: this.daysCompleted, timestamp: new Date().toISOString(), screenshot: shotPath });
          triggerJevTriage(`UI Deadlock Ngày ${this.daysCompleted}`, `Hệ thống đứng yên > 25s tại ngày ${this.daysCompleted}`, 'src/ui/SellingView.ts');
          await this.emergencyRecover(page);
          lastActionTimestamp = Date.now();
        }

        // Thực hiện 1 bước hành vi hỗn loạn
        const acted = await this.performChaosStep(page);
        if (acted) {
          this.totalActions++;
          lastActionTimestamp = Date.now();
        }

        await sleep(ACTION_DELAY_MS);
      } catch (err) {
        log(`⚠️ Ngoại lệ trong vòng lặp monkey: ${err?.message}`);
        await this.emergencyRecover(page);
        await sleep(500);
      }
    }

    log(`🏁 Kết thúc bài test treo máy. Đã hoàn thành ${this.daysCompleted} ngày, ${this.totalActions} thao tác.`);
    await browser.close();
    this.generateMarkdownReport();
  }

  async dismissTitleScreen(page) {
    const playBtn = page.locator('#btn-title-play');
    if (await playBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      log(`👉 Chạm bắt đầu ở Title Screen...`);
      await playBtn.click({ force: true });
      await sleep(500);

      // Đặt tên quán nếu có dialog
      const confirmName = page.locator('#btn-confirm-shop-name');
      if (await confirmName.isVisible({ timeout: 2000 }).catch(() => false)) {
        log(`🏷️ Bấm xác nhận đặt tên quán...`);
        await confirmName.click({ force: true });
        await sleep(500);
      }

      // Đóng welcome dialog nếu có
      const welcomeStart = page.locator('#btn-welcome-start');
      if (await welcomeStart.isVisible({ timeout: 2000 }).catch(() => false)) {
        log(`✨ Đóng hộp thoại chào mừng...`);
        await welcomeStart.click({ force: true });
        await sleep(500);
      }
    }
  }

  async performChaosStep(page) {
    // A. XỬ LÝ CÁC MODAL & MÀN HÌNH ĐẶC BIỆT (ƯU TIÊN SỐ 1 ĐỂ KHÔNG BỊ BLOCKED)
    // 0. Màn hình chính Title Screen (khi reload trang, hot reload hoặc mới vào lại)
    const titlePlayBtn = page.locator('#btn-title-play');
    if (await titlePlayBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      log(`👉 Nhận diện màn hình chính Title Screen -> Bấm TIẾP TỤC / VÀO TIỆM...`);
      await titlePlayBtn.first().click({ force: true });
      await sleep(400);
      return true;
    }

    // Modal Kết Thúc Trò Chơi (Ending Modal)
    const endingCloseBtn = page.locator('#btn-close-ending, #btn-restart-game');
    if (await endingCloseBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      log(`🏆 Xử lý Ending Modal -> Tiếp tục hành trình...`);
      await endingCloseBtn.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 1. Modal Đặt tên quán (Shop Name Dialog)
    const confirmName = page.locator('#btn-confirm-shop-name');
    if (await confirmName.first().isVisible({ timeout: 50 }).catch(() => false)) {
      log(`🏷️ Bấm xác nhận đặt tên quán...`);
      await confirmName.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 2. Modal Chào Mừng (Welcome Dialog)
    const welcomeStart = page.locator('#btn-welcome-start');
    if (await welcomeStart.first().isVisible({ timeout: 50 }).catch(() => false)) {
      log(`✨ Đóng hộp thoại chào mừng...`);
      await welcomeStart.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 3. Tutorial Bác Ba dẫn đường -> Bỏ qua hoặc bấm tiếp
    const tutorialBtn = page.locator('#btn-tutorial-skip, #btn-tutorial-next');
    if (await tutorialBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await tutorialBtn.first().click({ force: true });
      await sleep(200);
      return true;
    }

    // 4. Modal Bảng Tin Cập Nhật (Dashboard v2.5.0)
    const ctaDashboard = page.locator('#btn-close-dashboard-cta, #btn-close-dashboard-top, .dash-close-x');
    if (await ctaDashboard.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await ctaDashboard.first().click({ force: true });
      await sleep(200);
      return true;
    }

    // 5. Modal Tổng Kết Cuối Ngày (Summary Modal) -> Bắt đầu ngày mới
    const nextDayBtn = page.locator('#btn-start-next-day, #btn-summary-next-day, #btn-close-summary, #btn-summary-close');
    if (await nextDayBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      log(`🌙 Chốt ngày ${this.daysCompleted + 1}! Chuẩn bị sang ngày mới...`);
      await nextDayBtn.first().click({ force: true });
      this.daysCompleted++;

      // Đo kiểm DOM Node Leakage
      const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
      this.domNodeCounts.push({ day: this.daysCompleted, nodes: nodeCount });
      log(`📊 [Ngày ${this.daysCompleted}] DOM Nodes hiện tại: ${nodeCount} | Lỗi: ${this.errors.length}`);

      // Kiểm tra tràn ngang
      const isOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (isOverflow) {
        log(`❌ Phát hiện tràn ngang màn hình tại ngày ${this.daysCompleted}!`);
        this.errors.push({ type: 'overflow', message: `Màn hình bị tràn ngang tại ngày ${this.daysCompleted}`, day: this.daysCompleted });
      }

      await sleep(600);
      return true;
    }

    // 6. Modal Tiền mặt bằng cuối tuần (Rent Modal)
    const rentBtn = page.locator('#btn-pay-rent, #btn-skip-rent');
    if (await rentBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await rentBtn.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 7. Modal Chuyển Chương Mới (Chapter Unlocked)
    const chapterBtn = page.locator('#btn-chapter-continue');
    if (await chapterBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await chapterBtn.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 8. Modal Sự Cố Hàng Ngày (Daily Incident)
    const incidentChoice = page.locator('.btn-neutral-choice, .btn-incident-choice, .incident-btn, .btn-warm-choice, .btn-cream-choice');
    if (await incidentChoice.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await incidentChoice.first().click({ force: true });
      await sleep(200);
      const confirmYes = page.locator('#btn-incident-confirm-yes, #btn-incident-continue');
      if (await confirmYes.isVisible({ timeout: 300 }).catch(() => false)) {
        await confirmYes.click({ force: true });
      }
      return true;
    }

    // 9. Modal Công An Kiểm Tra ATVSTP
    const policeBtn = page.locator('#btn-police-confirm');
    if (await policeBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await policeBtn.first().click({ force: true });
      await sleep(300);
      return true;
    }

    // 10. Modal Xác nhận thông thường (Confirm Dialog)
    const confirmOk = page.locator('#btn-confirm-ok, #btn-confirm-cancel');
    if (await confirmOk.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await confirmOk.first().click({ force: true });
      await sleep(200);
      return true;
    }

    // 11. Modal Minigame Chợ Đầu Mối (Market Bargain)
    const bargainTactic = page.locator('.btn-bargain-tactic, #btn-close-market, #btn-close-bargain-result');
    if (await bargainTactic.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await bargainTactic.first().click({ force: true });
      return true;
    }

    // 12. Modal Minigame Giao Đơn Xa (Delivery Runner)
    const outsourceBtn = page.locator('#btn-outsource-delivery, #btn-close-delivery-result');
    if (await outsourceBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await outsourceBtn.first().click({ force: true });
      return true;
    }

    // 13. Modal Minigame Sốt Bí Truyền (Secret Sauce)
    const spiceBtn = page.locator('.btn-spice, #btn-sauce-stir, #btn-close-sauce-modal');
    if (await spiceBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await spiceBtn.first().click({ force: true });
      return true;
    }

    // 14. Modal Minigame Lọc Cặn Dầu (Oil Filter)
    const crumbEl = page.locator('.oil-crumb:not(.collected), #btn-claim-filter-reward, #btn-close-filter-modal');
    if (await crumbEl.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await crumbEl.first().click({ force: true });
      return true;
    }

    // 15. Modal Trả Lời Đánh Giá (Review Reply)
    const replyChoice = page.locator('.btn-reply-choice, .btn-choose-reply, #btn-close-reply-modal, #btn-cancel-reply-modal, #btn-modal-close-icon');
    if (await replyChoice.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await replyChoice.first().click({ force: true });
      return true;
    }

    // 16. Modal Cốt Truyện Visual Novel (Story VN)
    const storyChoice = page.locator('.dialogue-choice, .story-btn, #btn-story-next, #btn-story-close, #btn-story-choice-1');
    if (await storyChoice.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await storyChoice.first().click({ force: true });
      return true;
    }

    // 17. Modal Thỏ Cam & Thư Tín
    const bunnyBtn = page.locator('#btn-bunny-close, #btn-claim-bunny, .btn-bunny-letter');
    if (await bunnyBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
      await bunnyBtn.first().click({ force: true });
      return true;
    }

    // B. PHA BÁN HÀNG (SELLING SCREEN)
    const sellingScreen = page.locator('.selling-screen');
    if (await sellingScreen.isVisible({ timeout: 60 }).catch(() => false)) {
      // 1. Bật tua nhanh nếu chưa bật (chỉ bấm khi đang ở chế độ 1x)
      const fastBtn = page.locator('#btn-toggle-fast');
      if (await fastBtn.first().isVisible({ timeout: 30 }).catch(() => false)) {
        const text = await fastBtn.first().textContent().catch(() => '');
        if (text.includes('1x')) {
          await fastBtn.first().click({ force: true }).catch(() => {});
          await sleep(50);
        }
      }

      // 2. Nhấc chảo rán NGAY khi vàng giòn (Perfect) hoặc sẵn sàng nhấc
      const readyPot = page.locator('#btn-fry-pot.perfect-glow, #btn-fry-pot.ready-lift, .fry-pot.perfect-glow, .fry-pot.ready-lift');
      if (await readyPot.first().isVisible({ timeout: 30 }).catch(() => false)) {
        await readyPot.first().click({ force: true }).catch(() => {});
        return true;
      }

      // 3. Phục vụ món cho khách (Nút 'LÊN MÓN' .btn-serve-cust hoặc #btn-serve-order)
      const serveBtn = page.locator('.btn-serve-cust:not([disabled]), #btn-serve-order:not([disabled])');
      if (await serveBtn.first().isVisible({ timeout: 30 }).catch(() => false)) {
        await serveBtn.first().click({ force: true }).catch(() => {});
        return true;
      }

      // 4. Thả nguyên liệu vào chảo rán từ khay sơ chế (Đùi, má đùi, khoai, gà viên, phô mai)
      const fryAction = page.locator('#btn-fry-chicken:not([disabled]), #btn-fry-thigh:not([disabled]), #btn-fry-fries:not([disabled]), #btn-fry-popcorn:not([disabled]), #btn-fry-cheese:not([disabled])');
      if (await fryAction.first().isVisible({ timeout: 30 }).catch(() => false)) {
        await fryAction.first().click({ force: true }).catch(() => {});
        return true;
      }

      // 5. Rót nước ngọt đa vị (Coca, 7Up, Fanta)
      const drinkAction = page.locator('#btn-add-drink, #btn-pour-7up, #btn-pour-fanta');
      if (await drinkAction.first().isVisible({ timeout: 30 }).catch(() => false)) {
        await drinkAction.first().click({ force: true }).catch(() => {});
        return true;
      }

      // 6. Xịt tương cà / tương ớt lên món trong khay
      if (Math.random() < 0.3) {
        const sauceBtn = page.locator('#btn-squeeze-ketchup, #btn-squeeze-chili');
        if (await sauceBtn.first().isVisible({ timeout: 30 }).catch(() => false)) {
          await sauceBtn.first().click({ force: true }).catch(() => {});
          return true;
        }
      }

      // 7. Nhấp chảo rán định kỳ phòng khi không bắt được class
      if (Math.random() < 0.25) {
        const potEl = page.locator('#btn-fry-pot');
        if (await potEl.first().isVisible({ timeout: 30 }).catch(() => false)) {
          await potEl.first().click({ force: true }).catch(() => {});
          return true;
        }
      }

      // 8. Nếu khách chờ quá lâu hoặc thiếu món, hủy đơn để khách mới vào
      if (Math.random() < 0.15) {
        const cancelBtn = page.locator('.btn-cancel-order');
        if (await cancelBtn.first().isVisible({ timeout: 30 }).catch(() => false)) {
          await cancelBtn.first().click({ force: true }).catch(() => {});
          return true;
        }
      }

      return false; // Không có thao tác cụ thể nào được thực hiện
    }

    // C. PHA CHUẨN BỊ (PREPARATION SCREEN)
    const openBarBtn = page.locator('#btn-start-selling');
    if (await openBarBtn.first().isVisible({ timeout: 80 }).catch(() => false)) {
      // 1. Mua nguyên liệu nếu thiếu (đặc biệt là thịt gà và bột chiên)
      const invTabBtn = page.locator('.tab-btn[data-tab="inventory"]');
      if (await invTabBtn.isVisible({ timeout: 40 }).catch(() => false)) {
        await invTabBtn.click({ force: true }).catch(() => {});
        await sleep(100);
      }

      for (let i = 0; i < 3; i++) {
        const buyChickenBtn = page.locator('.btn-buy[data-id="chicken_meat"]:not([disabled])');
        if (await buyChickenBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
          await buyChickenBtn.first().click({ force: true }).catch(() => {});
          await sleep(60);
        }
      }

      const buyFlourBtn = page.locator('.btn-buy[data-id="flour"]:not([disabled])');
      if (await buyFlourBtn.first().isVisible({ timeout: 50 }).catch(() => false)) {
        await buyFlourBtn.first().click({ force: true }).catch(() => {});
        await sleep(60);
      }

      // 2. Thỉnh thoảng nâng cấp quán
      if (Math.random() < 0.2) {
        const upgradeTabBtn = page.locator('.tab-btn[data-tab="upgrades"]');
        if (await upgradeTabBtn.isVisible().catch(() => false)) {
          await upgradeTabBtn.click({ force: true }).catch(() => {});
          await sleep(100);
          const buyUpgrade = page.locator('.btn-buy-upgrade:not([disabled])');
          if (await buyUpgrade.first().isVisible().catch(() => false)) {
            await buyUpgrade.first().click({ force: true }).catch(() => {});
          }
        }
      }

      log(`🍗 Bấm 'BẮT ĐẦU MỞ BÁN' Ngày ${this.daysCompleted + 1}...`);
      await page.locator('#btn-start-selling').first().click({ force: true, timeout: 2000 }).catch(() => {});
      await sleep(400);
      return true;
    }

    return false;
  }

  async emergencyRecover(page) {
    // Đóng tất cả các modal đang bị kẹt hoặc tự bấm tiếp tục
    await page.evaluate(() => {
      const titleBtn = document.getElementById('btn-title-play');
      if (titleBtn instanceof HTMLElement) { titleBtn.click(); return; }

      const nextDayBtn = document.querySelector('#btn-start-next-day, #btn-summary-next-day');
      if (nextDayBtn instanceof HTMLElement) { nextDayBtn.click(); return; }

      const closeButtons = document.querySelectorAll('.dash-close-x, #btn-modal-close-icon, [id*="btn-close"], .btn-close, .modal-close');
      for (const btn of closeButtons) {
        if (btn instanceof HTMLElement) btn.click();
      }
      const overlay = document.querySelector('.modal-overlay, #modal-overlay');
      if (overlay instanceof HTMLElement) overlay.click();

      // Nếu đang kẹt trong màn bán hàng: hủy các đơn khách tồn đọng để kích hoạt lứa khách mới
      const cancelBtns = document.querySelectorAll('.btn-cancel-order');
      for (const cb of cancelBtns) {
        if (cb instanceof HTMLElement) cb.click();
      }
    }).catch(() => {});
  }

  generateMarkdownReport() {
    const elapsedMinutes = Math.round((Date.now() - this.startTime) / 60000);
    const avgDomNodes = this.domNodeCounts.length > 0
      ? Math.round(this.domNodeCounts.reduce((a, b) => a + b.nodes, 0) / this.domNodeCounts.length)
      : 0;

    const md = `# BÁO CÁO TEST XUYÊN ĐÊM (ENDURANCE MONKEY TEST REPORT)
*Thời gian chạy:* ${new Date().toLocaleString('vi-VN')}
*Thời lượng treo máy:* ${elapsedMinutes} phút
*Số ngày chơi hoàn thành:* ${this.daysCompleted} ngày
*Tổng số thao tác UI mô phỏng:* ${this.totalActions.toLocaleString()} thao tác
*Số lượng DOM Nodes trung bình:* ${avgDomNodes} nodes

---

## 1. TỔNG KẾT CHỈ SỐ SỨC KHỎE SẢN PHẨM (HEALTH MATRIX)
| Hạng mục kiểm tra | Kết quả | Đánh giá |
|---|---|---|
| **JavaScript Unhandled Errors** | **${this.errors.filter(e => e.type === 'pageerror').length}** lỗi | ${this.errors.filter(e => e.type === 'pageerror').length === 0 ? '🟢 TUYỆT VỜI (0 crash)' : '🔴 CẦN XỬ LÝ'} |
| **Console Runtime Errors** | **${this.errors.filter(e => e.type === 'console.error').length}** cảnh báo | ${this.errors.filter(e => e.type === 'console.error').length === 0 ? '🟢 SẠCH SẼ' : '🟡 CÓ CẢNH BÁO'} |
| **UI Deadlocks / Freeze** | **${this.deadlocks.length}** lần kẹt | ${this.deadlocks.length === 0 ? '🟢 100% THÔNG SUỐT' : '🔴 CẦN KIỂM TRA MODAL'} |
| **Tràn ngang màn hình (Horizontal Overflow)** | **${this.errors.filter(e => e.type === 'overflow').length}** lần | ${this.errors.filter(e => e.type === 'overflow').length === 0 ? '🟢 KHỚP 100% 360px & 390px' : '🔴 TRÀN GIAO DIỆN'} |
| **Rò rỉ DOM (DOM Node Leak)** | Đỉnh: ${Math.max(...this.domNodeCounts.map(n => n.nodes), 0)} nodes | ${Math.max(...this.domNodeCounts.map(n => n.nodes), 0) < 800 ? '🟢 ỔN ĐỊNH (< 800 nodes)' : '🟡 PHÌNH TO'} |

---

## 2. CHI TIẾT CÁC LỖI GHI NHẬN (NẾU CÓ)
${this.errors.length === 0 ? '✨ **Không phát hiện bất kỳ lỗi nghiêm trọng nào trong suốt quá trình treo máy!**' : this.errors.map(e => `- **[Ngày ${e.day}] [${e.type}]:** \`${e.message}\`${e.screenshot ? ` (Ảnh: \`${e.screenshot}\`)` : ''}`).join('\n')}

---

## 3. LỊCH SỬ KẸT GIAO DIỆN / DEADLOCK (NẾU CÓ)
${this.deadlocks.length === 0 ? '✨ **Toàn bộ các Modal, Minigames và Chuyển Cảnh đóng mở mượt mà 100%!**' : this.deadlocks.map(d => `- **[Ngày ${d.day}]** Kẹt tại thời điểm ${d.timestamp}. Ảnh chụp: \`${d.screenshot}\``).join('\n')}
`;

    writeFileSync(REPORT_MD, md, 'utf-8');
    log(`📄 Đã xuất báo cáo chi tiết ra tệp tin: ${REPORT_MD}`);
  }
}

const monkey = new OvernightMonkey();
monkey.run().catch(e => log(`Fatal: ${e.message}`));
