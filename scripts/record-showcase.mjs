import { chromium } from 'playwright-core';
import { mkdirSync, existsSync, copyFileSync, renameSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_URL = 'http://localhost:3000';
const RECORDING_DIR = './recordings';
const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/18506250-c5cb-481a-9fbd-2262576c2324';

mkdirSync(RECORDING_DIR, { recursive: true });
if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

console.log('🎬 Bắt đầu khởi động Chrome để quay video showcase 15s...');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true
});

const context = await browser.newContext({
  viewport: { width: 412, height: 860 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  recordVideo: {
    dir: RECORDING_DIR,
    size: { width: 412, height: 860 }
  }
});

const page = await context.newPage();

// Inject Touch Ripple & Showcase Subtitle HUD
await page.addInitScript(() => {
  window.addEventListener('DOMContentLoaded', () => {
    // 1. Touch Ripple FX
    const style = document.createElement('style');
    style.textContent = `
      .showcase-hud {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: rgba(30, 20, 15, 0.88);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #fff;
        padding: 6px 14px;
        border-radius: 24px;
        font-family: 'Baloo 2', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.2px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 1.5px rgba(251, 191, 36, 0.7);
        display: flex;
        align-items: center;
        gap: 6px;
        pointer-events: none;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: center;
        max-width: 90vw;
        white-space: nowrap;
      }
      .showcase-hud .hud-icon {
        font-size: 16px;
        animation: hudPulse 1.5s ease infinite alternate;
      }
      @keyframes hudPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.2); }
      }
      .touch-ripple {
        position: fixed;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(251, 191, 36, 0.85) 0%, rgba(245, 158, 11, 0.35) 60%, transparent 100%);
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
        pointer-events: none;
        transform: translate(-50%, -50%) scale(0.2);
        animation: rippleAnim 0.45s ease-out forwards;
        z-index: 100000;
      }
      @keyframes rippleAnim {
        0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const hud = document.createElement('div');
    hud.id = 'showcase-hud';
    hud.className = 'showcase-hud';
    hud.innerHTML = '<span class="hud-icon">🍗</span><span class="hud-text">TIỆM GÀ NHÀ TUI • Quán Gà Rán Hẻm 1102</span>';
    document.body.appendChild(hud);

    window.updateShowcaseHud = (icon, text) => {
      hud.style.opacity = '0';
      hud.style.transform = 'translateX(-50%) translateY(-6px)';
      setTimeout(() => {
        hud.innerHTML = `<span class="hud-icon">${icon}</span><span class="hud-text">${text}</span>`;
        hud.style.opacity = '1';
        hud.style.transform = 'translateX(-50%) translateY(0)';
      }, 150);
    };

    window.addEventListener('pointerdown', (e) => {
      const rip = document.createElement('div');
      rip.className = 'touch-ripple';
      rip.style.left = e.clientX + 'px';
      rip.style.top = e.clientY + 'px';
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 450);
    }, { passive: true });
  });
});

console.log('🌐 Đang điều hướng tới:', TARGET_URL);
await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Helper click with visible cursor movement and tap
async function humanClick(selector, delayAfter = 800) {
  try {
    const el = await page.$(selector);
    if (!el) {
      console.log(`⚠️ Không tìm thấy selector: ${selector}`);
      return false;
    }
    const box = await el.boundingBox();
    if (!box) {
      await el.click();
      await page.waitForTimeout(delayAfter);
      return true;
    }
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y, { steps: 5 });
    await page.mouse.down();
    await page.waitForTimeout(80);
    await page.mouse.up();
    await page.waitForTimeout(delayAfter);
    return true;
  } catch (err) {
    console.log(`⚠️ Lỗi khi click ${selector}:`, err.message);
    return false;
  }
}

// SCENE 1: MÀN HÌNH CHÀO MỪNG (TITLE SCREEN)
console.log('📍 SCENE 1: Title Screen & Khởi Nghiệp Hẻm 1102');
await page.evaluate(() => window.updateShowcaseHud?.('🍗', 'TIỆM GÀ NHÀ TUI • Khởi nghiệp gà rán giòn rụm'));
await page.waitForTimeout(1000);

// Chạm bé mèo canh vía
await humanClick('#zone-cat', 1200);

// Chạm Bác Ba tổ trưởng mách nước
await humanClick('#zone-bacba', 1200);

// Nhấn nút Hero "VÀO TIỆM BÁN GÀ" / "TIẾP TỤC MỞ BÁN"
await humanClick('#btn-title-play', 800);

// Nếu có hộp thoại đặt tên tiệm
const nameInput = await page.$('.shop-name-dialog');
if (nameInput) {
  console.log('📝 Đặt tên tiệm gà...');
  // Chọn chip gợi ý đầu tiên
  await humanClick('.shop-name-chip:first-of-type', 500);
  await humanClick('#btn-confirm-shop-name', 800);
}

// Nếu có modal chào mừng
const welcomeCta = await page.$('.welcome-dialog button, #modal-content button');
if (welcomeCta) {
  await humanClick('.welcome-dialog button, #modal-content button', 600);
}

await page.waitForTimeout(500);

// SCENE 2: TÍNH NĂNG QUẢN LÝ TIỆM (CHALKBOARD HUB)
console.log('📍 SCENE 2: Khám phá Quản lý Thực đơn, Kho hàng FIFO, Đánh giá');
await page.evaluate(() => window.updateShowcaseHud?.('📋', 'QUẢN LÝ TIỆM • Thực đơn giòn rụm & Kho nguyên liệu FIFO'));

// Chuyển tab Thực đơn
await humanClick('[data-tab="menu"]', 1200);

// Chuyển tab Kho hàng
await humanClick('[data-tab="inventory"]', 1200);

// Chuyển tab Đánh giá GenZ
await page.evaluate(() => window.updateShowcaseHud?.('💬', 'REVIEW GENZ • Đánh giá thực khách & Tích luỹ danh tiếng'));
await humanClick('[data-tab="reviews"]', 1400);

// Quay lại tab kho/bảng điều khiển
await humanClick('[data-tab="inventory"]', 600);

// SCENE 3: GAMEPLAY BÁN GÀ CA CAO ĐIỂM (RUSH HOUR COOKING)
console.log('📍 SCENE 3: Gameplay Bán Gà & Chiên Nấu Realtime');
await page.evaluate(() => window.updateShowcaseHud?.('🔥', 'VÀO CA BÁN HÀNG • Chiên gà canh nhiệt & Phục vụ khách'));

// Bấm MỞ BÁN NGAY
await humanClick('#btn-start-day', 1000);

// Xử lý Tutorial Bác Ba nếu xuất hiện
const tutBtn = await page.$('#btn-tutorial-primary, .tutorial-actions button');
if (tutBtn) {
  console.log('🎓 Nhấn xác nhận hướng dẫn Bác Ba...');
  await humanClick('#btn-tutorial-primary, .tutorial-actions button', 600);
}

// Thả gà vào chảo chiên
console.log('🍗 Thả gà vào chảo...');
await humanClick('#btn-fry-chicken', 300);

// Canh thanh đo nhiệt độ: chờ kim chạy tới vùng Vàng Giòn (khoảng 1.8 giây)
await page.evaluate(() => window.updateShowcaseHud?.('✨', 'CANH LỬA CHUẨN XÁC • Vớt gà ngay vùng Vàng Giòn!'));
await page.waitForTimeout(1600);

// Nhấc chảo lấy gà giòn
await humanClick('#btn-fry-pot', 500);

// Rót nước ngọt có ga mát lạnh
console.log('🥤 Rót nước ngọt...');
await humanClick('#btn-pour-coca, #btn-add-drink', 500);

// Xịt tương hoặc phục vụ
await page.evaluate(() => window.updateShowcaseHud?.('🛎️', 'KENG! LÊN MÓN • Khách nhận gà, Tiền bay & Chuỗi Perfect'));
await humanClick('#btn-serve-order', 1000);

// Thả tiếp mẻ gà thứ 2 + khoai lắc
await humanClick('#btn-fry-chicken', 300);
await humanClick('#btn-fry-fries', 1200);
await humanClick('#btn-fry-pot', 500);

// Rót thêm nước hoặc phục vụ
await humanClick('#btn-pour-7up, #btn-add-drink', 400);
await humanClick('#btn-serve-order', 800);

// Bật tăng tốc ⏩ x2 để ca bán sôi động
await page.evaluate(() => window.updateShowcaseHud?.('⚡', 'TĂNG TỐC BÁN HÀNG • Đơn hàng dồn dập, Tiền vô ào ào'));
await humanClick('#btn-toggle-fast', 2000);

// SCENE 4: KẾT THÚC SHOWCASE HOÀN HẢO
console.log('📍 SCENE 4: Tổng kết & Khép lại Showcase');
await page.evaluate(() => window.updateShowcaseHud?.('🎉', 'TIỆM GÀ NHÀ TUI • Trải nghiệm ngay trên trình duyệt di động!'));
await page.waitForTimeout(1500);

console.log('🏁 Hoàn tất kịch bản showcase. Đang xuất video...');
const video = page.video();
await context.close();
await browser.close();

if (video) {
  const videoPath = await video.path();
  console.log('🎥 Video gốc được lưu tại:', videoPath);

  const destPathArtifact = path.join(ARTIFACT_DIR, 'tiem_ga_showcase_15s.webm');
  const destPathPublic = path.join('public', 'tiem_ga_showcase_15s.webm');
  const destPathRoot = 'tiem_ga_showcase_15s.webm';

  copyFileSync(videoPath, destPathArtifact);
  copyFileSync(videoPath, destPathPublic);
  copyFileSync(videoPath, destPathRoot);
  console.log('✅ Đã copy video tới:');
  console.log('   - Artifact:', destPathArtifact);
  console.log('   - Public:', destPathPublic);
  console.log('   - Root:', destPathRoot);
}

console.log('🎉 Xong toàn bộ pipeline showcase!');
