import { describe, it, expect } from 'vitest';
import {
  renderOilFilterGameHtml,
  renderOilFilterSuccessHtml,
  renderOilFilterFailedHtml
} from '../src/ui/components/OilFilterModal';
import { generateOilCrumbs, calculateFilterResult } from '../src/core/oilFilter';

describe('Oil Filter Modal HTML Renderers & UI Structure (tests/oilFilterModal.test.ts)', () => {
  it('1. renderOilFilterGameHtml renders pan stage, timer, crumbs and progress bar', () => {
    const crumbs = generateOilCrumbs(8, 1);
    const html = renderOilFilterGameHtml('dirty', crumbs, 15, 0);

    expect(html).toContain('VỆ SINH CHẢO CUỐI NGÀY');
    expect(html).toContain('Lọc Cặn Dầu & Vớt Bột Cháy');
    expect(html).toContain('oil-pan-touch-area');
    expect(html).toContain('pan-dirty');
    expect(html).toContain('oil-crumb-item');
    expect(html).toContain('⏱️ <b>15s</b>');
    expect(html).toContain('btn-cancel-oil-filter');
  });

  it('2. renderOilFilterSuccessHtml renders celebration badge, saved money and hygiene bonus', () => {
    const result = calculateFilterResult(8, 8, 'dirty');
    const html = renderOilFilterSuccessHtml(result);

    expect(html).toContain('VỆ SINH XUẤT SẮC');
    expect(html).toContain('ĐÃ LỌC SẠCH CẶN DẦU');
    expect(html).toContain('150.000đ');
    expect(html).toContain('Vệ Sinh');
    expect(html).toContain('btn-oil-filter-finish');
  });

  it('3. renderOilFilterFailedHtml renders encouragement and partial discount when >= 60%', () => {
    const partialResult = calculateFilterResult(5, 8, 'dirty');
    const html = renderOilFilterFailedHtml(partialResult);

    expect(html).toContain('Chưa Vớt Kịp Toàn Bộ Cặn');
    expect(html).toContain('5/8');
    expect(html).toContain('giảm 50% tiền thay dầu');
    expect(html).toContain('Bác Ba an ủi');
    expect(html).toContain('btn-oil-filter-fail-close');
  });
});
