import { describe, it, expect } from 'vitest';
import { ASSETS } from '../src/content/assets';
import fs from 'node:fs';
import path from 'node:path';

describe('Flying Polymer Banknote & Realistic Cash Payment FX', () => {
  it('1. ASSETS.ui.pixelBanknoteFly được đăng ký và file asset tồn tại trên đĩa', () => {
    expect(ASSETS.ui.pixelBanknoteFly).toBeDefined();
    expect(ASSETS.ui.pixelBanknoteFly).toContain('pixel_banknote_fly.png');

    const publicPath = path.resolve('public/assets/ui/pixel_banknote_fly.png');
    expect(fs.existsSync(publicPath)).toBe(true);
    const stat = fs.statSync(publicPath);
    expect(stat.size).toBeGreaterThan(1000); // Đảm bảo file ảnh hợp lệ không rỗng
  });

  it('2. SellingView.ts đã loại bỏ hoàn toàn emoji đồng xu Tây 🪙, sử dụng asset tờ tiền polymer pixel thật', () => {
    const sellingViewPath = path.resolve('src/ui/components/SellingView.ts');
    const content = fs.readFileSync(sellingViewPath, 'utf-8');

    // Không còn emoji 🪙 trong hàm spawnParabola / renderFx
    expect(content).not.toContain('<span class="coin-icon">🪙</span>');
    // Thay thế bằng ảnh tờ tiền polymer pixel
    expect(content).toContain('ASSETS.ui.pixelBanknoteFly');
    expect(content).toContain('flying-banknote-img');
    expect(content).toContain('banknote-flutter-particle');
  });

  it('3. InventoryTab.ts đã loại bỏ triệt để canvas-confetti party khi thanh toán tiền sỉ kho', () => {
    const invTabPath = path.resolve('src/ui/components/InventoryTab.ts');
    const content = fs.readFileSync(invTabPath, 'utf-8');

    // Không còn gọi confetti khi bấm thanh toán tiền hàng
    expect(content).not.toContain('(window as any).confetti');
    expect(content).not.toContain("colors: ['#22c55e'");

    // Có hiệu ứng chi tiền chuyên biệt với tờ tiền polymer pixel và dấu mộc
    expect(content).toContain('triggerBanknotePaymentFx');
    expect(content).toContain('pixel-paid-stamp');
    expect(content).toContain('expense-cash-float');
    expect(content).toContain('banknote-flutter-particle');
  });

  it('4. kitchen.css đã có đầy đủ animation tokens cho tờ tiền bay, rung rinh flutter, dấu mộc và trừ quỹ', () => {
    const cssPath = path.resolve('src/styles/kitchen.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.flying-banknote-img');
    expect(content).toContain('.banknote-flutter-particle');
    expect(content).toContain('@keyframes banknoteFlutterFlight');
    expect(content).toContain('.pixel-paid-stamp');
    expect(content).toContain('@keyframes stampSlapDown');
    expect(content).toContain('.expense-cash-float');
    expect(content).toContain('@keyframes expenseFloatUp');
  });
});
