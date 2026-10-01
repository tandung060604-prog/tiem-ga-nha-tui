import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT_DIR = 'scratch/qa-test-reports';
mkdirSync(OUT_DIR, { recursive: true });

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runQaSuite() {
  console.log('========================================================================');
  console.log('🚀 BẮT ĐẦU KIỂM TOÁN TOÀN DIỆN: 100% UNLOCKS, MINIGAMES, 12 BÀN & 6 ENDINGS');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: 'android_360x740', width: 360, height: 740 },
    { name: 'iphone_390x844', width: 390, height: 844 }
  ];

  let totalFailures = 0;

  for (const vp of viewports) {
    console.log(`\n📱 ĐANG KIỂM THỬ TRÊN THIẾT BỊ: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})...`);
    const pageErrors = [];
    const overflowBreaches = [];

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: vp.name.includes('iphone')
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 Mobile Safari/537.36'
    });

    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('play() failed') && !text.includes('audio') && !text.includes('AudioContext')) {
          console.error(`  ❌ [Console Error] ${text}`);
          pageErrors.push(text);
        }
      }
    });

    page.on('pageerror', err => {
      console.error(`  ❌ [Page Crash Error] ${err.message}`);
      pageErrors.push(err.message);
    });

    // Hàm kiểm tra tràn ngang (Zero horizontal overflow)
    const checkOverflow = async (screenName) => {
      const isOverflowing = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return (docWidth > winWidth + 1) || (bodyWidth > winWidth + 1);
      });
      if (isOverflowing) {
        const detail = await page.evaluate(() => ({
          doc: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          win: window.innerWidth
        }));
        const msg = `[${vp.name}][${screenName}] Tràn viền ngang! doc: ${detail.doc}px, win: ${detail.win}px`;
        console.warn(`  ⚠️ ${msg}`);
        overflowBreaches.push(msg);
      } else {
        console.log(`  ✅ [${screenName}] Kích thước chuẩn: scrollWidth <= ${vp.width}px`);
      }
    };

    // 1. Tải ứng dụng
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);

    // Bỏ qua Intro / Title nếu có
    const tapPrompt = page.locator('#intro-tap-prompt');
    if (await tapPrompt.isVisible({ timeout: 1500 }).catch(() => false)) {
      await tapPrompt.click({ force: true });
      await page.waitForTimeout(400);
    }
    const introOverlay = page.locator('#intro-cinematic-overlay');
    if (await introOverlay.isVisible({ timeout: 500 }).catch(() => false)) {
      await introOverlay.click({ force: true });
      await page.waitForTimeout(300);
    }
    const btnPlay = page.locator('#btn-title-play');
    if (await btnPlay.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btnPlay.click();
      await page.waitForTimeout(400);
    }
    const confirmName = page.locator('#btn-confirm-shop-name');
    if (await confirmName.isVisible({ timeout: 1000 }).catch(() => false)) {
      await confirmName.click();
      await page.waitForTimeout(300);
    }
    const welcomeStart = page.locator('#btn-welcome-start');
    if (await welcomeStart.isVisible({ timeout: 1000 }).catch(() => false)) {
      await welcomeStart.click();
      await page.waitForTimeout(300);
    }
    const bacbaSpotlight = page.locator('#tutorial-spotlight-layer, .tutorial-overlay');
    if (await bacbaSpotlight.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 2. BƠM TRẠNG THÁI 100% UNLOCKS (MỞ KHÓA TOÀN BỘ MÓN ĂN, NHÂN VIÊN, NÂNG CẤP)
    console.log('  🔓 Bơm trạng thái Maxed Out 100% (Menu 15 món, 72 Staff, 7 Upgrades max, 12 bàn, 6 thư)...');
    await page.evaluate(() => {
      const sm = window.__stateManager;
      const app = window.__app;
      if (!sm) throw new Error('Không tìm thấy __stateManager!');

      sm.update((draft) => {
        draft.phase = 'prep';
        draft.tutorialDone = true;
        draft.prepTutorialDone = true;
        draft.currentChapter = 5;
        draft.day = 250;
        draft.money = 350000000;
        draft.ratings = {
          overall: 4.95,
          taste: 5.0,
          hygiene: 5.0,
          space: 4.9,
          speed: 4.9,
          pricing: 4.9
        };
        draft.unlockedBunnyLetters = ['1', '2', '3', '4', '5', '6'];

        // 1. Mở khóa toàn bộ menu 15 món
        draft.menu.forEach((m) => {
          m.unlocked = true;
          m.available = true;
        });

        // 2. Mở khóa toàn bộ kho nguyên liệu 999 số lượng
        Object.keys(draft.inventory).forEach((k) => {
          draft.inventory[k].unlocked = true;
          draft.inventory[k].amount = 999;
        });

        // 3. Max cấp toàn bộ 7 nhánh nâng cấp (Bếp cấp 8, Không gian cấp 3 = 12 bàn, v.v.)
        Object.keys(draft.upgrades).forEach((branchId) => {
          const branch = draft.upgrades[branchId];
          if (branch && branch.tiers) {
            branch.currentLevel = branch.tiers.length; // Max tier!
          }
        });

        // 4. Tuyển dụng full 6 vai trò nhân viên SSR level 10
        const roles = ['cook', 'waiter', 'cashier', 'delivery', 'manager', 'security'];
        draft.staff = roles.map((r, i) => ({
          id: `qa_staff_ssr_${r}`,
          name: `Cao Thủ ${r.toUpperCase()}`,
          role: r,
          rarity: 'SSR',
          stars: 5,
          level: 10,
          mood: 100,
          hourlyWage: 25000,
          speed: 85,
          skill: 90,
          attitude: 95,
          traits: ['speed_demon', 'master_chef', 'silver_tongue'],
          salary: 150000,
          hiredDay: 1,
          modelAsset: `/assets/staff/staff_${(i % 12) + 1}.png`,
          passiveDescription: `Kỹ năng thần thánh tăng 100% hiệu suất ${r}.`
        }));

        draft.lifetimeStats = {
          totalFried: 500,
          perfectFriedCount: 460,
          totalBurnt: 2,
          totalRevenue: 500000000
        };
      });

      sm.flush();
      if (app && app.render) app.render();
    });

    await page.waitForTimeout(600);

    // =========================================================================
    // GIAI ĐOẠN 1: KIỂM TOÁN TẤT CẢ CÁC TAB CHUẨN BỊ (PREPARATION SCREEN)
    // =========================================================================

    // TAB 1: KHO HÀNG (Inventory)
    console.log('  📦 Kiểm tra Tab Kho Hàng...');
    await page.locator('.tab-btn[data-tab="inventory"]').click();
    await page.waitForTimeout(400);
    await checkOverflow('InventoryTab');
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}_01_inventory_tab.png` });

    // Test nút +5 và -5 nguyên liệu
    const plusBtn = page.locator('.inv-btn-add, .btn-buy-lot').first();
    if (await plusBtn.isVisible().catch(() => false)) {
      await plusBtn.click();
      await page.waitForTimeout(200);
    }

    // TAB 2: NÂNG CẤP (Upgrades) - Kiểm tra 7 nhánh MAX cấp
    console.log('  🍳 Kiểm tra Tab Nâng Cấp (7 nhánh MAX TIER)...');
    await page.locator('.tab-btn[data-tab="upgrades"]').click();
    await page.waitForTimeout(400);
    await checkOverflow('UpgradesTab_Maxed');
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}_02_upgrades_tab_maxed.png` });

    // TAB 3: NHÂN VIÊN (Staff) & GACHA
    console.log('  👥 Kiểm tra Tab Nhân Viên & Gacha Chiêu Mộ...');
    await page.locator('.tab-btn[data-tab="staff"]').click();
    await page.waitForTimeout(400);
    await checkOverflow('StaffTab_6Assigned');
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}_03_staff_tab.png` });

    // Test Gacha 1x Pull
    const gacha1Btn = page.locator('#btn-gacha-pull-1');
    if (await gacha1Btn.isVisible().catch(() => false)) {
      console.log('    ✨ Test Gacha Pull 1x & Lật thẻ 3D...');
      await gacha1Btn.click();
      await page.waitForSelector('#gacha-result-overlay', { timeout: 3000 });
      await page.waitForTimeout(400);
      await checkOverflow('Gacha1xModal');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_03b_gacha_1x_modal.png` });

      // Chạm lật thẻ
      const cardBack = page.locator('.gacha-card-wrapper').first();
      if (await cardBack.isVisible()) {
        await cardBack.click();
        await page.waitForTimeout(500);
      }
      // Bấm nút đóng modal
      await page.locator('#btn-gacha-dismiss').click();
      await page.waitForTimeout(300);
    }

    // Test Gacha 10x Pull
    const gacha10Btn = page.locator('#btn-gacha-pull-10');
    if (await gacha10Btn.isVisible().catch(() => false)) {
      console.log('    👑 Test Gacha Pull 10x & Grid thẻ trên mobile...');
      await gacha10Btn.click();
      await page.waitForSelector('#gacha-result-overlay', { timeout: 3000 });
      await page.waitForTimeout(400);
      await checkOverflow('Gacha10xModal');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_03c_gacha_10x_modal.png` });

      // Lật tất cả thẻ
      const revealAll = page.locator('#btn-gacha-reveal-all');
      if (await revealAll.isVisible()) {
        await revealAll.click();
        await page.waitForTimeout(1600);
      }
      await page.locator('#btn-gacha-dismiss').click();
      await page.waitForTimeout(300);
    }

    // TAB 4: ĐÁNH GIÁ (Reviews)
    console.log('  ⭐ Kiểm tra Tab Đánh Giá Thực Khách...');
    await page.locator('.tab-btn[data-tab="reviews"]').click();
    await page.waitForTimeout(400);
    await checkOverflow('ReviewsTab');
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}_04_reviews_tab.png` });

    // TAB 5: SỔ TAY MÓN ĂN (Menu 15 món)
    console.log('  🍗 Kiểm tra Sổ Tay Toàn Bộ 15 Món Ăn...');
    await page.locator('.tab-btn[data-tab="menu"]').click();
    await page.waitForTimeout(400);
    await checkOverflow('MenuTab_15Items');
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}_05_menu_tab_all_items.png` });

    // Đếm số món ăn hiển thị
    const menuCardsCount = await page.locator('.item-row').count();
    console.log(`    🍲 Số lượng thẻ món ăn hiển thị: ${menuCardsCount} món`);

    // TEST BẢNG THƯ THỎ CAM (BUNNY MODAL)
    console.log('  🐰 Kiểm tra Thư Kỷ Niệm Thỏ Cam (All 6 letters)...');
    await page.evaluate(() => {
      const app = window.__app;
      if (app && app.openBunnyModal) app.openBunnyModal();
      else if (window.openBunnyModal) window.openBunnyModal();
    });
    await page.waitForTimeout(500);
    const bunnyModal = page.locator('#bunny-modal, .bunny-modal-overlay');
    if (await bunnyModal.isVisible().catch(() => false)) {
      await checkOverflow('BunnyModal');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_06_bunny_letters_modal.png` });
      // Đóng modal
      const closeBunny = page.locator('#btn-close-bunny, .btn-modal-close');
      if (await closeBunny.isVisible()) await closeBunny.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // =========================================================================
    // GIAI ĐOẠN 2: KIỂM THỬ CÁC MINIGAME CHUYÊN SÂU
    // =========================================================================

    // MINIGAME 1: NẤU SỐT BÍ TRUYỀN HẺM 1102
    console.log('  🍲 Kiểm thử Minigame Nấu Sốt Bí Truyền Hẻm 1102...');
    await page.evaluate(() => {
      const app = window.__app;
      if (app && app.openSecretSauceModal) app.openSecretSauceModal();
      else if (app) app.triggerDailyIncidentModal?.();
    });
    await page.waitForTimeout(500);
    const sauceModal = page.locator('#sauce-minigame-modal');
    if (await sauceModal.isVisible().catch(() => false)) {
      await checkOverflow('Minigame_SecretSauce');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_07_minigame_secret_sauce.png` });

      // Click gia vị thử nghiệm
      const spiceBtn = page.locator('.btn-spice-item').first();
      if (await spiceBtn.isVisible().catch(() => false)) {
        await spiceBtn.click();
        await page.waitForTimeout(200);
      }
      const closeSauce = page.locator('#btn-close-sauce-modal, #btn-sauce-already-done');
      if (await closeSauce.isVisible()) await closeSauce.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // MINIGAME 2: ĐI CHỢ ĐẦU MỐI TRẢ GIÁ SỈ
    console.log('  🏪 Kiểm thử Minigame Đi ChỢ Đầu Mối Trả Giá...');
    await page.evaluate(() => {
      const app = window.__app;
      if (app && app.openMarketBargainModal) app.openMarketBargainModal();
    });
    await page.waitForTimeout(500);
    const bargainModal = page.locator('.market-bargain-dialog, #modal-overlay');
    if (await bargainModal.isVisible().catch(() => false)) {
      await checkOverflow('Minigame_MarketBargain');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_08_minigame_market_bargain.png` });
      const tacticBtn = page.locator('.btn-bargain-tactic').first();
      if (await tacticBtn.isVisible().catch(() => false)) {
        await tacticBtn.click();
        await page.waitForTimeout(300);
      }
      const closeBargain = page.locator('#btn-close-bargain-result, #btn-modal-close');
      if (await closeBargain.isVisible()) await closeBargain.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // MINIGAME 3: CHẠY XE GIAO ĐƠN XA (HẺM 1102 EXPRESS)
    console.log('  🛵 Kiểm thử Minigame Chạy Xe Giao Đơn Xa Hẻm 1102 Express...');
    await page.evaluate(() => {
      const app = window.__app;
      if (app && app.openDeliveryRunnerModal) app.openDeliveryRunnerModal();
    });
    await page.waitForTimeout(500);
    const deliveryModal = page.locator('.delivery-prompt-dialog, #modal-overlay');
    if (await deliveryModal.isVisible().catch(() => false)) {
      await checkOverflow('Minigame_DeliveryPrompt');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_09_minigame_delivery_prompt.png` });
      const outsourceBtn = page.locator('#btn-outsource-delivery, #btn-modal-close');
      if (await outsourceBtn.isVisible()) await outsourceBtn.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // MINIGAME 4: LỌC CẶN DẦU CUỐI NGÀY
    console.log('  🛢️ Kiểm thử Minigame Lọc Cặn Dầu Cuối Ngày...');
    await page.evaluate(() => {
      const app = window.__app;
      if (app && app.openOilFilterModal) app.openOilFilterModal();
    });
    await page.waitForTimeout(500);
    const oilFilterModal = page.locator('#oil-filter-modal');
    if (await oilFilterModal.isVisible().catch(() => false)) {
      await checkOverflow('Minigame_OilFilter');
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_10_minigame_oil_filter.png` });
      const crumb = page.locator('.oil-crumb-item').first();
      if (await crumb.isVisible().catch(() => false)) {
        await crumb.click();
        await page.waitForTimeout(200);
      }
      const closeOil = page.locator('#btn-close-oil-filter');
      if (await closeOil.isVisible()) await closeOil.click();
      else await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // =========================================================================
    // GIAI ĐOẠN 3: KIỂM THỬ CA BÁN MỞ BÁN VỚI 12 BÀN ĂN & 6 NHÂN VIÊN
    // =========================================================================
    console.log('  🍗 BẮT ĐẦU MỞ BÁN: Kiểm thử Ca Bán với 12 Bàn Ăn, 6 Nhân Viên & Khay 8 Ô...');
    const startSellingBtn = page.locator('#btn-start-selling');
    if (await startSellingBtn.isVisible().catch(() => false)) {
      await startSellingBtn.click();
      // Chờ loading modal hoàn tất và transition sang selling view (modal duration ~1.5s)
      await page.waitForSelector('#selling-view, .selling-container', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(600);
      await checkOverflow('SellingView_12Tables');

      // Kiểm tra thanh nhân viên
      const staffAvatars = await page.locator('.staff-chip').count();
      console.log(`    🧑‍🍳 Số nhân viên đang túc trực: ${staffAvatars} người`);

      // Kiểm tra khay ra món
      const traySlotsCount = await page.locator('.tray-slot').count();
      console.log(`    🍱 Số ô khay ra món (mở rộng tối đa): ${traySlotsCount} ô`);

      // Chụp ảnh giao diện ca bán
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_11_selling_12_tables_active.png` });

      // Thực hiện vài thao tác bán hàng: Chiên gà, vớt gà, rót nước
      const fryBtn = page.locator('#btn-fry-crispy_chicken, .btn-action-fry').first();
      if (await fryBtn.isVisible().catch(() => false)) {
        await fryBtn.click();
        await page.waitForTimeout(400);
      }
      const drinkBtn = page.locator('#btn-pour-soda, .btn-action-drink').first();
      if (await drinkBtn.isVisible().catch(() => false)) {
        await drinkBtn.click();
        await page.waitForTimeout(200);
      }

      // Quay lại Prep để test kết thúc
      await page.evaluate(() => {
        const sm = window.__stateManager;
        const app = window.__app;
        if (sm) {
          sm.update((draft) => { draft.phase = 'prep'; });
          sm.flush();
          if (app) app.render();
        }
      });
      await page.waitForTimeout(400);
    }

    // =========================================================================
    // GIAI ĐOẠN 4: KIỂM THỬ TOÀN BỘ 6 ĐẠI KẾT CỤC (ALL 6 ENDING MODALS)
    // =========================================================================
    console.log('  👑 Kiểm thử hiển thị & giao diện toàn bộ 6 Đại Kết Cục...');
    const endingsList = [
      { id: 'happy', name: '1. Happy Ending (Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ)' },
      { id: 'open', name: '2. Open Ending (Gió Hẻm Thổi Mãi — Bình Dị An Yên)' },
      { id: 'bad_bankruptcy', name: '3. Bad Bankruptcy 3A (Cửa Cuốn Đóng Lại)' },
      { id: 'bad_corporate', name: '4. Bad Corporate 3B (Cỗ Máy Gà Vô Hồn)' },
      { id: 'bad_police', name: '5. Bad Police (Xe Đặc Chủng & Niêm Phong Tiệm)' },
      { id: 'secret', name: '6. Secret Ending (Chiếc Vá Vàng 1975)' }
    ];

    for (const end of endingsList) {
      console.log(`    🏆 Đang mở Modal Ending: ${end.name}...`);
      await page.evaluate((endingId) => {
        const app = window.__app;
        if (app && app.openEndingModal) {
          app.openEndingModal(endingId, false);
        }
      }, end.id);

      await page.waitForTimeout(500);
      await checkOverflow(`Ending_${end.id}`);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}_12_ending_${end.id}.png` });

      // Đóng modal ending để chuẩn bị cho modal tiếp theo
      const closeEndingBtn = page.locator('#btn-close-ending');
      if (await closeEndingBtn.isVisible()) {
        await closeEndingBtn.click();
        await page.waitForTimeout(300);
      }
    }

    await context.close();

    console.log(`\n📊 KẾT QUẢ THIẾT BỊ [${vp.name.toUpperCase()}]:`);
    console.log(`  • Số lỗi Console / Runtime: ${pageErrors.length}`);
    console.log(`  • Số lỗi tràn ngang (Overflow): ${overflowBreaches.length}`);
    if (pageErrors.length > 0 || overflowBreaches.length > 0) {
      totalFailures += pageErrors.length + overflowBreaches.length;
    }
  }

  await browser.close();

  console.log('\n========================================================================');
  console.log(`🏁 TỔNG KẾT TOÀN DIỆN QA SUITE: ${totalFailures === 0 ? 'TẤT CẢ ĐỀU PASS 100%! 🎉' : `CÓ ${totalFailures} LỖI CẦN XỬ LÝ ⚠️`}`);
  console.log('========================================================================\n');

  process.exit(totalFailures > 0 ? 1 : 0);
}

runQaSuite().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
