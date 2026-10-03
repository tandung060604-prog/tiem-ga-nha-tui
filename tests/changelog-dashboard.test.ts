import { describe, it, expect } from 'vitest';
import { CHANGELOG_DATA, CURRENT_GAME_VERSION, CURRENT_VERSION_CODENAME } from '../src/content/changelog';
import { renderUpdateDashboardModal } from '../src/ui/components/UpdateDashboardModal';

describe('Bảng Tin Cập Nhật Phiên Bản Dashboard (v2.8.0)', () => {
  it('1. Dữ liệu Changelog có version v2.8.0 và tên phiên bản chuẩn xác', () => {
    expect(CURRENT_GAME_VERSION).toBe('v2.8.0');
    expect(CURRENT_VERSION_CODENAME).toContain('Bác Ba Trợ Giá');

    const release = CHANGELOG_DATA[0];
    expect(release).toBeDefined();
    expect(release.version).toBe('v2.8.0');
    expect(release.isLatest).toBe(true);
    expect(release.metrics.length).toBeGreaterThanOrEqual(5);
    expect(release.categories.length).toBeGreaterThanOrEqual(2);
  });

  it('2. renderUpdateDashboardModal tạo HTML chứa đầy đủ thông tin và các nút đóng', () => {
    const html = renderUpdateDashboardModal();
    expect(html).toContain('v2.8.0');
    expect(html).toContain('BẢNG TIN TIỆM GÀ NHÀ TUI');
    expect(html).toContain('btn-close-dashboard-top');
    expect(html).toContain('btn-close-dashboard-cta');
    expect(html).toContain('Trợ Giá Bác Ba');
  });
});
