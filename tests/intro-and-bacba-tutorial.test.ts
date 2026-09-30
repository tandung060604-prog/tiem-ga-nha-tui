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
  it('renderIntroCinematicModal tạo cấu trúc HTML hợp lệ có phong cách 3D Voxel và timeline 12s', () => {
    const html = renderIntroCinematicModal();
    expect(html).toContain('intro-cinematic-overlay');
    expect(html).toContain('3D VOXEL VEO 3');
    expect(html).toContain('intro-3d-viewport');
    expect(html).toContain('intro-video-timeline');
    expect(html).toContain('btn-intro-replay');
    expect(html).toContain('BẮT ĐẦU VÀO TIỆM GÀ');
    expect(html).toContain('Bỏ qua ✕');
    expect(html).toContain('Bác Ba Nghệ Nhân:');
    expect(html).toContain('Mèn đét ơi!');
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
