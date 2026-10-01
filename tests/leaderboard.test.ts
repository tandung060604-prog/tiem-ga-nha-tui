import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../src/core/state';
import {
  generateUniqueUserId,
  buildLeaderboardEntry,
  syncToLeaderboard,
  fetchLeaderboard,
  removeFromLeaderboard,
  getCloudEndpoint,
  setCloudEndpoint,
  DEFAULT_CLOUD_RTDB_URL,
  LEADERBOARD_STORAGE_KEY
} from '../src/core/leaderboard';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(globalThis as any).localStorage = new LocalStorageMock();

describe('Hệ Thống Bảng Xếp Hạng Đua Top 4 Người Chơi (Leaderboard System)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. generateUniqueUserId sinh mã định danh duy nhất cho mỗi máy/lượt chơi', () => {
    const id1 = generateUniqueUserId();
    const id2 = generateUniqueUserId();
    expect(id1).toMatch(/^usr_[a-z0-9]+_[a-z0-9]+$/);
    expect(id2).toMatch(/^usr_[a-z0-9]+_[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });

  it('2. buildLeaderboardEntry trích xuất đầy đủ dữ liệu từ GameState', () => {
    const state = createInitialState();
    state.userId = 'usr_test_player_1';
    state.shopName = 'Gà Rán Đại Ca';
    state.day = 25;
    state.money = 15000000;
    state.currentChapter = 2;
    state.ratings.overall = 4.75;
    state.lifetimeStats.totalFried = 350;

    const entry = buildLeaderboardEntry(state);
    expect(entry.userId).toBe('usr_test_player_1');
    expect(entry.shopName).toBe('Gà Rán Đại Ca');
    expect(entry.day).toBe(25);
    expect(entry.money).toBe(15000000);
    expect(entry.chapter).toBe(2);
    expect(entry.overallRating).toBe(4.75);
    expect(entry.totalFried).toBe(350);
    expect(entry.updatedAt).toBeGreaterThan(0);
  });

  it('3. syncToLeaderboard lưu vào cache và fetchLeaderboard trả về đúng xếp hạng theo tài sản', async () => {
    const state1 = createInitialState();
    state1.userId = 'usr_player_alpha';
    state1.shopName = 'Tiệm Gà Alpha';
    state1.money = 50000000;
    state1.day = 30;

    const state2 = createInitialState();
    state2.userId = 'usr_player_beta';
    state2.shopName = 'Tiệm Gà Beta';
    state2.money = 120000000;
    state2.day = 45;

    await syncToLeaderboard(state1);
    await syncToLeaderboard(state2);

    const result = await fetchLeaderboard('usr_player_alpha', 'money');
    expect(result.entries.length).toBe(2); // 100% người chơi thật, không chèn quán ảo

    // Người nhiều tiền hơn phải đứng trước
    const betaIdx = result.entries.findIndex(e => e.userId === 'usr_player_beta');
    const alphaIdx = result.entries.findIndex(e => e.userId === 'usr_player_alpha');
    expect(betaIdx).toBeLessThan(alphaIdx);

    // Kiểm tra cờ isSelf
    const alphaEntry = result.entries.find(e => e.userId === 'usr_player_alpha');
    const betaEntry = result.entries.find(e => e.userId === 'usr_player_beta');
    expect(alphaEntry?.isSelf).toBe(true);
    expect(betaEntry?.isSelf).toBe(false);
  });

  it('4. fetchLeaderboard sắp xếp chính xác theo số ngày sinh tồn khi chọn sortBy day', async () => {
    const stateA = createInitialState();
    stateA.userId = 'usr_short_rich';
    stateA.shopName = 'Gà Giàu Nhưng Mới Mở';
    stateA.money = 200000000;
    stateA.day = 20;

    const stateB = createInitialState();
    stateB.userId = 'usr_veteran_poor';
    stateB.shopName = 'Gà Thâm Niên Hẻm';
    stateB.money = 10000000;
    stateB.day = 95;

    await syncToLeaderboard(stateA);
    await syncToLeaderboard(stateB);

    const result = await fetchLeaderboard(undefined, 'day');
    const veteranIdx = result.entries.findIndex(e => e.userId === 'usr_veteran_poor');
    const richIdx = result.entries.findIndex(e => e.userId === 'usr_short_rich');
    expect(veteranIdx).toBeLessThan(richIdx); // 95 ngày đứng trước 20 ngày
  });

  it('5. removeFromLeaderboard xóa sạch dữ liệu người chơi cũ khi chơi lại game mới', async () => {
    const stateOld = createInitialState();
    stateOld.userId = 'usr_retired_boss';
    stateOld.shopName = 'Tiệm Gà Cũ Sắp Xóa';
    stateOld.money = 999000000;

    await syncToLeaderboard(stateOld);

    let check = await fetchLeaderboard();
    expect(check.entries.some(e => e.userId === 'usr_retired_boss')).toBe(true);

    // Người chơi bấm "Chơi lại từ đầu" -> Xóa khỏi BXH
    const removeRes = await removeFromLeaderboard('usr_retired_boss');
    expect(removeRes.success).toBe(true);

    check = await fetchLeaderboard();
    expect(check.entries.some(e => e.userId === 'usr_retired_boss')).toBe(false);
  });

  it('6. Cấu hình Cloud Endpoint lưu và đọc đúng URL tùy chỉnh', () => {
    expect(getCloudEndpoint()).toBe(DEFAULT_CLOUD_RTDB_URL);

    setCloudEndpoint('https://my-team-4-friends.firebasedatabase.app/');
    expect(getCloudEndpoint()).toBe('https://my-team-4-friends.firebasedatabase.app');

    setCloudEndpoint('');
    expect(getCloudEndpoint()).toBe(DEFAULT_CLOUD_RTDB_URL);
  });
});
