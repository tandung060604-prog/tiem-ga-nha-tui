import { chromium } from 'playwright-core';
import { mkdirSync, existsSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_URL = 'http://localhost:3000';
const RECORDING_DIR = './recordings';
const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/18506250-c5cb-481a-9fbd-2262576c2324';

mkdirSync(RECORDING_DIR, { recursive: true });
if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

console.log('🎬 Bắt đầu khởi động Chrome để quay video showcase 15s chuẩn xác...');
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
    // 1. Touch Ripple & Showcase Styles
    const style = document.createElement('style');
    style.textContent = `
      .showcase-hud {
        position: fixed;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999999;
        background: linear-gradient(135deg, rgba(28, 18, 12, 0.92), rgba(45, 26, 16, 0.95));
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        color: #fff;
        padding: 7px 16px;
        border-radius: 30px;
        font-family: 'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif;
        font-size: 13.5px;
        font-weight: 700;
        letter-spacing: 0.3px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(245, 158, 11, 0.85);
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: center;
        max-width: 92vw;
        white-space: nowrap;
      }
      .showcase-hud .hud-icon {
        font-size: 18px;
        display: inline-block;
        animation: hudPulse 1.2s ease infinite alternate;
      }
      .showcase-hud .hud-text {
        background: linear-gradient(90deg, #fff, #fef08a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      @keyframes hudPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.25) rotate(5deg); }
      }
      .touch-ripple {
        position: fixed;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.45) 50%, transparent 100%);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.8);
        pointer-events: none;
        transform: translate(-50%, -50%) scale(0.2);
        animation: rippleAnim 0.5s ease-out forwards;
        z-index: 1000000;
      }
      @keyframes rippleAnim {
        0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const hud = document.createElement('div');
    hud.id = 'showcase-hud';
    hud.className = 'showcase-hud';
    hud.innerHTML = '<span class="hud-icon">🍗</span><span class="hud-text">TIỆM GÀ NHÀ TUI • Quán Gà Rán Giòn Rụm Hẻm 1102</span>';
    document.body.appendChild(hud);

    window.updateShowcaseHud = (icon, text) => {
      hud.style.opacity = '0';
      hud.style.transform = 'translateX(-50%) translateY(-8px) scale(0.95)';
      setTimeout(() => {
        hud.innerHTML = `<span class="hud-icon">${icon}</span><span class="hud-text">${text}</span>`;
        hud.style.opacity = '1';
        hud.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      }, 150);
    };

    window.addEventListener('pointerdown', (e) => {
      const rip = document.createElement('div');
      rip.className = 'touch-ripple';
      rip.style.left = e.clientX + 'px';
      rip.style.top = e.clientY + 'px';
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 500);
    }, { passive: true });
  });
});

console.log('🌐 Đang tải trang chủ game...');
await page.goto(TARGET_URL);
await page.waitForTimeout(600);

// Helper click with smooth touch animation
async function smoothTap(selector, delayAfter = 600) {
  try {
    const loc = page.locator(selector).first();
    if (await loc.isVisible().catch(() => false)) {
      const box = await loc.boundingBox();
      if (box) {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y, { steps: 4 });
        await page.mouse.down();
        await page.waitForTimeout(60);
        await page.mouse.up();
        await page.waitForTimeout(delayAfter);
        return true;
      }
      await loc.click();
      await page.waitForTimeout(delayAfter);
      return true;
    }
  } catch (err) {
    console.log(`⚠️ Tap ${selector}:`, err.message);
  }
  return false;
}

// ==========================================
// SCENE 1: TITLE SCREEN & KHỞI NGHIỆP HẺM 1102 (0s - 3.2s)
// ==========================================
console.log('📍 SCENE 1: Title Screen & Không Khí Hẻm Sài Gòn');
await page.evaluate(() => window.updateShowcaseHud?.('🍗', 'TIỆM GÀ NHÀ TUI • Quán Gà Rán Giòn Rụm Hẻm 1102'));
await page.waitForTimeout(900);

// Chạm Bé Miu canh vía
console.log('🐱 Vuốt ve Bé Miu...');
await smoothTap('#zone-cat', 1000);

// Chạm Bác Ba tổ trưởng
console.log('👴 Chào Bác Ba...');
await smoothTap('#zone-bacba', 800);

// Bấm VÀO TIỆM BÁN GÀ
console.log('▶️ Bấm Vào Tiệm Bán Gà...');
await smoothTap('#btn-title-play', 600);

// Xác nhận đặt tên tiệm nếu xuất hiện
const nameConfirm = page.locator('#btn-confirm-shop-name');
if (await nameConfirm.isVisible().catch(() => false)) {
  console.log('🏷️ Xác nhận tên tiệm gà...');
  await smoothTap('#btn-confirm-shop-name', 400);
}

// Đóng modal chào mừng nếu xuất hiện
const welcomeStart = page.locator('#btn-welcome-start');
if (await welcomeStart.isVisible().catch(() => false)) {
  console.log('🎉 Bắt đầu ngày 1...');
  await smoothTap('#btn-welcome-start', 500);
}

// ==========================================
// SCENE 2: BẢNG KẾ HOẠCH & TÍNH NĂNG QUẢN LÝ (3.2s - 6.5s)
// ==========================================
console.log('📍 SCENE 2: Quản Lý Tiệm - Thực Đơn, Kho Hàng, Đánh Giá');
await page.evaluate(() => window.updateShowcaseHud?.('📋', 'QUẢN LÝ TIỆM • Thực Đơn Giòn Tan & Kho Nguyên Liệu FIFO'));
await page.waitForTimeout(400);

// Xem Tab Thực Đơn
console.log('🍗 Xem Tab Thực Đơn...');
await smoothTap('button[data-tab="menu"]', 1100);

// Xem Tab Kho Hàng
console.log('📦 Xem Tab Kho Hàng...');
await page.evaluate(() => window.updateShowcaseHud?.('📦', 'KHO HÀNG FIFO • Tồn Kho Tươi Mới & Mở Khóa Theo Ngày'));
await smoothTap('button[data-tab="inventory"]', 1100);

// Xem Tab Đánh Giá Thực Khách GenZ
console.log('💬 Xem Tab Đánh Giá GenZ...');
await page.evaluate(() => window.updateShowcaseHud?.('⭐', 'REVIEW GENZ VIRAL • Đánh Giá Thực Khách & Uy Tín Hẻm'));
await smoothTap('button[data-tab="reviews"]', 1200);

// ==========================================
// SCENE 3: GAMEPLAY CHIÊN GÀ & PHỤC VỤ (6.5s - 13.0s)
// ==========================================
console.log('📍 SCENE 3: Ca Bán Cao Điểm - Chiên Gà & Phục Vụ Realtime');
await page.evaluate(() => window.updateShowcaseHud?.('🔥', 'VÀO CA BÁN HÀNG • Chiên Gà Canh Nhiệt & Lên Món'));
await smoothTap('#btn-start-selling', 700);

// Bỏ qua hướng dẫn nếu có
const tutNext = page.locator('#btn-tutorial-next');
if (await tutNext.isVisible().catch(() => false)) {
  await tutNext.click().catch(() => {});
  await page.waitForTimeout(300);
}

// Thả mẻ gà đầu tiên vào chảo chiên
console.log('🍗 Thả gà vào chảo chiên...');
await smoothTap('#btn-fry-chicken', 300);

// Canh thanh đo nhiệt độ: chờ kim chạy tới vùng VÀNG GIÒN (khoảng 1.7s)
console.log('⏱️ Canh kim đo nhiệt tới vùng VÀNG GIÒN (PERFECT)...');
await page.evaluate(() => window.updateShowcaseHud?.('✨', 'CANH LỬA VÀNG GIÒN • Vớt Đúng Lúc PERFECT!'));
await page.waitForTimeout(1650);

// Nhấc chảo vớt gà giòn rụm vào khay giữ nhiệt
console.log('🥘 Vớt gà giòn rụm lên khay giữ nhiệt!');
await smoothTap('#btn-fry-pot', 500);

// Rót nước ngọt mát lạnh
console.log('🥤 Rót Coca sủi bọt có đá...');
await smoothTap('#btn-add-drink', 500);

// Xịt thêm tương cà / tương ớt tặng tip
console.log('🍅 Xịt tương sốt...');
await smoothTap('#btn-squeeze-ketchup', 500);

// Bấm KENG! LÊN MÓN phục vụ khách
console.log('🛎️ Phục vụ khách hàng đầu tiên!');
await page.evaluate(() => window.updateShowcaseHud?.('🛎️', 'KENG! LÊN MÓN • Tiền Bay (+35k), Tip & Chuỗi Perfect 🔥'));
await smoothTap('#btn-serve-order', 1000);

// Thả tiếp mẻ 2: gà + khoai
console.log('🍟 Thả thêm mẻ gà và khoai...');
await smoothTap('#btn-fry-chicken', 300);
await page.waitForTimeout(1650);
await smoothTap('#btn-fry-pot', 400);
await smoothTap('#btn-pour-7up', 400);
await smoothTap('#btn-serve-order', 800);

// Bật tăng tốc ⏩ x2 cho ca bán bùng nổ
console.log('⚡ Bật tăng tốc ⏩ x2 ca bán...');
await page.evaluate(() => window.updateShowcaseHud?.('⚡', 'TĂNG TỐC BÁN HÀNG • Khách Vào Tấp Nập, Tiền Đếm Mỏi Tay'));
await smoothTap('#btn-toggle-fast', 2000);

// ==========================================
// SCENE 4: GRAND FINALE (13.0s - 15.5s)
// ==========================================
console.log('📍 SCENE 4: Kết thúc Showcase Ấn Tượng');
await page.evaluate(() => window.updateShowcaseHud?.('🎉', 'TIỆM GÀ NHÀ TUI • Chơi Ngay Trên Web Di Động!'));
await page.waitForTimeout(2000);

console.log('🏁 Hoàn thành xuất sắc 15s showcase! Đang xuất video...');
const video = page.video();
await context.close();
await browser.close();

if (video) {
  const videoPath = await video.path();
  console.log('🎥 Video recording hoàn tất tại:', videoPath);

  const destPathArtifact = path.join(ARTIFACT_DIR, 'tiem_ga_showcase_15s.webm');
  const destPathPublic = path.join('public', 'tiem_ga_showcase_15s.webm');
  const destPathRoot = 'tiem_ga_showcase_15s.webm';

  copyFileSync(videoPath, destPathArtifact);
  copyFileSync(videoPath, destPathPublic);
  copyFileSync(videoPath, destPathRoot);
  console.log('✅ Đã sao chép video WebM tới:');
  console.log('   - Artifact:', destPathArtifact);
  console.log('   - Public:', destPathPublic);
  console.log('   - Root:', destPathRoot);
}

console.log('🎉 Toàn bộ Showcase 15s đã hoàn thành 100%!');
