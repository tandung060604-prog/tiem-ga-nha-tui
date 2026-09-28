import { describe, it, expect } from 'vitest';
import {
  renderSaucePreviewHtml,
  renderSauceCookingHtml,
  renderSauceSuccessHtml,
  renderSauceFailedHtml
} from '../src/ui/components/SecretSauceModal';
import { SpiceId } from '../src/types/game';

describe('Secret Sauce Modal HTML Renderers & Interactive UI Structure', () => {
  const sampleRecipe: SpiceId[] = ['garlic', 'honey', 'chili', 'sesame'];

  it('1. renderSaucePreviewHtml renders title, 4 recipe steps and start button', () => {
    const html = renderSaucePreviewHtml(1, sampleRecipe);

    expect(html).toContain('Nồi Sốt Bí Truyền Ngày 1');
    expect(html).toContain('BÍ QUYẾT GIA TRUYỀN HẺM 1102');
    expect(html).toContain('sauce-step-card');
    expect(html).toContain('Tỏi Băm');
    expect(html).toContain('Mật Ong');
    expect(html).toContain('Ớt Bay');
    expect(html).toContain('Mè Rang');
    expect(html).toContain('btn-start-cooking-now');
    expect(html).toContain('sauce-preview-progress');
  });

  it('2. renderSauceCookingHtml renders 5 spice buttons, slots, and pot visual', () => {
    const userInputs: SpiceId[] = ['garlic'];
    const html = renderSauceCookingHtml(sampleRecipe, userInputs);

    expect(html).toContain('TRẠM BẾP GIA TRUYỀN');
    expect(html).toContain('Nêm Gia Vị Vào Nồi');
    expect(html).toContain('sauce-pot-visual');
    expect(html).toContain('btn-spice-touch');
    expect(html).toContain('data-spice-id="garlic"');
    expect(html).toContain('data-spice-id="honey"');
    expect(html).toContain('data-spice-id="chili"');
    expect(html).toContain('data-spice-id="soy"');
    expect(html).toContain('data-spice-id="sesame"');
    expect(html).toContain('btn-cancel-sauce');
    expect(html).toContain('Tiến độ: <b>1 / 4</b>');
  });

  it('3. renderSauceSuccessHtml renders celebration badge, pot icon, buff bonuses and finish CTA', () => {
    const html = renderSauceSuccessHtml();

    expect(html).toContain('TUYỆT PHẨM BẾP');
    expect(html).toContain('SỐT HOÀNG KIM ĐÃ SẴN SÀNG');
    expect(html).toContain('+3.000đ');
    expect(html).toContain('+0.25★ Hương Vị');
    expect(html).toContain('btn-sauce-done');
  });

  it('4. renderSauceFailedHtml renders encouraging quote and retry message without penalty', () => {
    const html = renderSauceFailedHtml();

    expect(html).toContain('Chưa Đúng Vị Rồi Con Ơi');
    expect(html).toContain('Bác Ba động viên');
    expect(html).toContain('btn-sauce-fail-done');
  });
});
