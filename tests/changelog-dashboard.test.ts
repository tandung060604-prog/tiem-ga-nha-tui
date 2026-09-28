import { describe, it, expect } from 'vitest';
import { CHANGELOG_DATA, CURRENT_GAME_VERSION, CURRENT_VERSION_CODENAME } from '../src/content/changelog';
import { renderUpdateDashboardModal } from '../src/ui/components/UpdateDashboardModal';

describe('Bảng Tin Cập Nhật Phiên Bản Dashboard (v2.1.0)', () => {
  it('1. Dữ liệu Changelog có version v2.1.0 và tên phiên bản chuẩn xác', () => {
    expect(CURRENT_GAME_VERSION).toBe('v2.1.0');
    expect(CURRENT_VERSION_CODENAME).toContain('Đại Bản Doanh Hẻm 1102');

    const release = CHANGELOG_DATA[0];
    expect(release).toBeDefined();
    expect(release.version).toBe('v2.1.0');
    expect(release.isLatest).toBe(true);
    expect(release.metrics.length).toBeGreaterThanOrEqual(5);
    expect(release.categories.length).toBeGreaterThanOrEqual(4);
  });

  it('2. renderUpdateDashboardModal tạo HTML chứa đầy đủ thông tin và các nút đóng', () => {
    const html = renderUpdateDashboardModal();
    expect(html).toContain('v2.1.0');
    expect(html).toContain('BẢNG TIN TIỆM GÀ NHÀ TUI');
    expect(html).toContain('btn-close-dashboard-top');
    expect(html).toContain('btn-close-dashboard-cta');
    expect(html).toContain('Công An');
    expect(html).toContain('Quản Lý Thị Trường');
    expect(html).toContain('Bà Bảy Đất');
    expect(html).toContain('Đại Ca Beo');
    expect(html).toContain('Khách Sộp VIP');
  });
});
