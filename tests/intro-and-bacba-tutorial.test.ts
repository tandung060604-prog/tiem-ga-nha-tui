import { describe, it, expect } from 'vitest';
import { TUTORIAL_TEXT, BAC_BA_GAME_TIPS } from '../src/core/tutorial';
import { renderIntroCinematicModal, shouldShowIntroVideo, INTRO_VOICEOVER_PHASES } from '../src/ui/components/IntroCinematicModal';
import { renderBacBaManualModal } from '../src/ui/components/BacBaManualModal';

describe('Bác Ba Miền Tây Tutorial & Tips', () => {
  it('toàn bộ các bước tutorial đều mang ngữ điệu Miền Tây Nam Bộ ấm áp', () => {
    expect(TUTORIAL_TEXT.intro.text).toContain('Mèn đét ơi');
    expect(TUTORIAL_TEXT.intro.text).toContain('Bác Ba');
    expect(TUTORIAL_TEXT.wait.text).toContain('Canh chừng');
    expect(TUTORIAL_TEXT.lift.text).toContain('VÀNG GIÒN RỤM RỒI ĐA');
    expect(TUTORIAL_TEXT['discard-raw'].text).toContain('sống nhăn răng');
    expect(TUTORIAL_TEXT.done.text).toContain('Mèn ơi giỏi dữ hôn');
  });

  it('ngân hàng mẹo Bác Ba (BAC_BA_GAME_TIPS) có đầy đủ các tình huống quan trọng', () => {
    expect(BAC_BA_GAME_TIPS.length).toBeGreaterThanOrEqual(4);
    const triggers = BAC_BA_GAME_TIPS.map(t => t.trigger);
    expect(triggers).toContain('oil_dirty');
    expect(triggers).toContain('perfect_streak');
    expect(triggers).toContain('low_patience');
    expect(triggers).toContain('out_of_chicken');

    const oilTip = BAC_BA_GAME_TIPS.find(t => t.trigger === 'oil_dirty');
    expect(oilTip?.text).toContain('Thay dầu');
    expect(oilTip?.text).toContain('công an');

    const stockTip = BAC_BA_GAME_TIPS.find(t => t.trigger === 'out_of_chicken');
    expect(stockTip?.text).toContain('Tiếp tế +5');
  });
});

describe('Intro Cinematic Modal & Bac Ba Manual Modal UI', () => {
  it('renderIntroCinematicModal tạo cấu trúc HTML tối giản tràn viền màn dọc và có dòng chữ chạm vào màn hình', () => {
    const html = renderIntroCinematicModal();
    expect(html).toContain('intro-cinematic-overlay');
    expect(html).toContain('intro-3d-viewport');
    expect(html).toContain('CHẠM VÀO MÀN HÌNH ĐỂ VÀO GAME');
    expect(html).toContain('intro-video-element');
    expect(html).toContain('loop');
  });

  it('INTRO_VOICEOVER_PHASES trải dài từ 0s tới 12-14s với đầy đủ 4 giai đoạn mở màn', () => {
    expect(INTRO_VOICEOVER_PHASES.length).toBe(4);
    expect(INTRO_VOICEOVER_PHASES[0].start).toBe(0);
    expect(INTRO_VOICEOVER_PHASES[INTRO_VOICEOVER_PHASES.length - 1].end).toBeGreaterThanOrEqual(12);
  });

  it('renderBacBaManualModal tạo giao diện cẩm nang 4 phần trực quan', () => {
    const html = renderBacBaManualModal();
    expect(html).toContain('CẨM NANG BÁC BA TRUYỀN NGHỀ');
    expect(html).toContain('1. Canh Lửa Vàng Giòn (Chảo Gang)');
    expect(html).toContain('2. Giữ Dầu Vàng Óng — Coi Chừng Công An!');
    expect(html).toContain('3. Sốt Bí Truyền & Rót Nước Tự Động');
    expect(html).toContain('4. Hết Hàng Giữa Ca? Đừng Lo!');
    expect(html).toContain('DẠ CON HIỂU RỒI, CẢM ƠN BÁC BA!');
  });
});

describe('Bác Ba Prep Screen Tutorial (Kho, Bàn Ghế, Nâng Cấp, Nhân Viên, Đánh Giá, Mở Bán)', () => {
  it('đầy đủ 7 bước chuẩn bị với đúng target selector và hướng dẫn', async () => {
    const { PREP_TUTORIAL_STEPS, PREP_TUTORIAL_TEXT, prepTutorialHint } = await import('../src/core/tutorial');
    expect(PREP_TUTORIAL_STEPS).toEqual([
      'prep-welcome',
      'prep-inventory',
      'prep-upgrades',
      'prep-staff',
      'prep-reviews',
      'prep-menu',
      'prep-start'
    ]);

    // Kiểm tra bước 1: Chào mừng
    const welcome = prepTutorialHint('prep-welcome');
    expect(welcome.text).toContain('Bác Ba đứng đây chỉ con từ A tới Z');
    expect(welcome.target).toBeDefined();

    // Kiểm tra bước 2: Kho hàng
    const inv = prepTutorialHint('prep-inventory');
    expect(inv.text).toContain('Kho Hàng');
    expect(inv.target).toContain('data-tab="inventory"');
    expect(inv.tabToSwitch).toBe('inventory');

    // Kiểm tra bước 3: Nâng cấp bàn ghế
    const upg = prepTutorialHint('prep-upgrades');
    expect(upg.text).toContain('Bàn Ghế');
    expect(upg.text).toContain('4 bộ bàn gỗ');
    expect(upg.target).toContain('data-tab="upgrades"');
    expect(upg.tabToSwitch).toBe('upgrades');

    // Kiểm tra bước 4: Nhân viên
    const staff = prepTutorialHint('prep-staff');
    expect(staff.text).toContain('Bé Linh');
    expect(staff.target).toContain('data-tab="staff"');
    expect(staff.tabToSwitch).toBe('staff');

    // Kiểm tra bước 5: Đánh giá review
    const rev = prepTutorialHint('prep-reviews');
    expect(rev.text).toContain('Đánh giá');
    expect(rev.text).toContain('Tình Hẻm');
    expect(rev.target).toContain('data-tab="reviews"');
    expect(rev.tabToSwitch).toBe('reviews');

    // Kiểm tra bước 6: Sổ tay
    const menu = prepTutorialHint('prep-menu');
    expect(menu.text).toContain('Sổ tay');
    expect(menu.target).toContain('data-tab="menu"');
    expect(menu.tabToSwitch).toBe('menu');

    // Kiểm tra bước 7: Mở bán
    const start = prepTutorialHint('prep-start');
    expect(start.text).toContain('BẮT ĐẦU MỞ BÁN');
    expect(start.target).toBe('#btn-start-selling');
    expect(start.button).toContain('MỞ CỬA BÁN LIỀN');
  });

  it('shouldRunPrepTutorial chỉ chạy ở Ngày 1 khi chưa hoàn thành', async () => {
    const { shouldRunPrepTutorial } = await import('../src/core/tutorial');
    expect(shouldRunPrepTutorial({ day: 1, prepTutorialDone: false })).toBe(true);
    expect(shouldRunPrepTutorial({ day: 1, prepTutorialDone: undefined })).toBe(true);
    expect(shouldRunPrepTutorial({ day: 1, prepTutorialDone: true })).toBe(false);
    expect(shouldRunPrepTutorial({ day: 2, prepTutorialDone: false })).toBe(false);
  });
});
