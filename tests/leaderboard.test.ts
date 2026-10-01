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
  DEFAULT_ROOM_ID,
  getCurrentRoomId,
  setCurrentRoomId,
  generateRoomId,
  getInviteUrl,
  getQrCodeUrl
} from '../src/core/leaderboard';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(globalThis as any).localStorage = new LocalStorageMock();

describe('Hệ Thống Lobby Đua Top 4 Người Chơi & Mã QR Mời Bạn', () => {
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

  it('2. Quản lý mã phòng Lobby (Room ID), Link Mời và Mã QR', () => {
    // Mặc định là HEM1102
    expect(getCurrentRoomId()).toBe(DEFAULT_ROOM_ID);

    // Đổi phòng
    setCurrentRoomId('PHONG_VIP');
    expect(getCurrentRoomId()).toBe('PHONG_VIP');

    // Sinh mã ngẫu nhiên dạng GA_XXXX
    const randRoom = generateRoomId();
    expect(randRoom).toMatch(/^GA_[A-Z0-9]{4}$/);

    // Link mời chứa đúng tham số ?room=...
    const inviteUrl = getInviteUrl('PHONG_VIP');
    expect(inviteUrl).toContain('?room=PHONG_VIP');

    // Link ảnh QR code hợp lệ và chứa inviteUrl
    const qrUrl = getQrCodeUrl(inviteUrl);
    expect(qrUrl).toContain('api.qrserver.com');
    expect(qrUrl).toContain(encodeURIComponent(inviteUrl));
  });

  it('3. buildLeaderboardEntry trích xuất đầy đủ dữ liệu từ GameState kèm roomId', () => {
    const state = createInitialState();
    state.userId = 'usr_test_player_1';
    state.roomId = 'LOBBY_99';
    state.shopName = 'Gà Rán Đại Ca';
    state.day = 25;
    state.money = 15000000;
    state.currentChapter = 2;
    state.ratings.overall = 4.75;
    state.lifetimeStats.totalFried = 350;

    const entry = buildLeaderboardEntry(state);
    expect(entry.userId).toBe('usr_test_player_1');
    expect(entry.roomId).toBe('LOBBY_99');
    expect(entry.shopName).toBe('Gà Rán Đại Ca');
    expect(entry.day).toBe(25);
    expect(entry.money).toBe(15000000);
    expect(entry.chapter).toBe(2);
    expect(entry.overallRating).toBe(4.75);
    expect(entry.totalFried).toBe(350);
    expect(entry.updatedAt).toBeGreaterThan(0);
  });

  it('4. syncToLeaderboard và fetchLeaderboard theo đúng phòng Lobby (100% người thật)', async () => {
    const state1 = createInitialState();
    state1.userId = 'usr_player_alpha';
    state1.roomId = 'ROOM_ALPHA';
    state1.shopName = 'Tiệm Gà Alpha';
    state1.money = 50000000;
    state1.day = 30;

    const state2 = createInitialState();
    state2.userId = 'usr_player_beta';
    state2.roomId = 'ROOM_ALPHA';
    state2.shopName = 'Tiệm Gà Beta';
    state2.money = 120000000;
    state2.day = 45;

    await syncToLeaderboard(state1, true);
    await syncToLeaderboard(state2, true);

    const result = await fetchLeaderboard('usr_player_alpha', 'money', 'ROOM_ALPHA');
    expect(result.success).toBe(true);
    expect(result.entries.length).toBe(2); // Đúng 2 người thật, không có bot
    expect(result.roomId).toBe('ROOM_ALPHA');

    // Người nhiều tiền hơn phải đứng trước (Beta trước Alpha)
    const betaIdx = result.entries.findIndex(e => e.userId === 'usr_player_beta');
    const alphaIdx = result.entries.findIndex(e => e.userId === 'usr_player_alpha');
    expect(betaIdx).toBeLessThan(alphaIdx);

    // Kiểm tra cờ isSelf
    const alphaEntry = result.entries.find(e => e.userId === 'usr_player_alpha');
    const betaEntry = result.entries.find(e => e.userId === 'usr_player_beta');
    expect(alphaEntry?.isSelf).toBe(true);
    expect(betaEntry?.isSelf).toBe(false);
  });

  it('5. Phân tách độc lập giữa các Lobby: người chơi phòng A không xuất hiện ở phòng B', async () => {
    const stateRoomA = createInitialState();
    stateRoomA.userId = 'usr_room_a_player';
    stateRoomA.roomId = 'PHONG_A';
    stateRoomA.shopName = 'Quán Ở Phòng A';

    const stateRoomB = createInitialState();
    stateRoomB.userId = 'usr_room_b_player';
    stateRoomB.roomId = 'PHONG_B';
    stateRoomB.shopName = 'Quán Ở Phòng B';

    await syncToLeaderboard(stateRoomA, true);
    await syncToLeaderboard(stateRoomB, true);

    // Fetch Phòng A -> chỉ thấy người ở phòng A
    const resA = await fetchLeaderboard(undefined, 'money', 'PHONG_A');
    expect(resA.entries.some(e => e.userId === 'usr_room_a_player')).toBe(true);
    expect(resA.entries.some(e => e.userId === 'usr_room_b_player')).toBe(false);

    // Fetch Phòng B -> chỉ thấy người ở phòng B
    const resB = await fetchLeaderboard(undefined, 'money', 'PHONG_B');
    expect(resB.entries.some(e => e.userId === 'usr_room_b_player')).toBe(true);
    expect(resB.entries.some(e => e.userId === 'usr_room_a_player')).toBe(false);
  });

  it('6. removeFromLeaderboard xóa sạch dữ liệu người chơi cũ khi chơi lại game mới', async () => {
    const stateOld = createInitialState();
    stateOld.userId = 'usr_retired_boss';
    stateOld.roomId = 'PHONG_TEST';
    stateOld.shopName = 'Tiệm Gà Cũ Sắp Xóa';
    stateOld.money = 999000000;

    await syncToLeaderboard(stateOld, true);

    let check = await fetchLeaderboard(undefined, 'money', 'PHONG_TEST');
    expect(check.entries.some(e => e.userId === 'usr_retired_boss')).toBe(true);

    // Người chơi bấm "Chơi lại từ đầu" -> Xóa khỏi BXH Lobby
    const removeRes = await removeFromLeaderboard('usr_retired_boss', 'PHONG_TEST');
    expect(removeRes.success).toBe(true);

    check = await fetchLeaderboard(undefined, 'money', 'PHONG_TEST');
    expect(check.entries.some(e => e.userId === 'usr_retired_boss')).toBe(false);
  });

  it('7. Cấu hình Cloud Endpoint lưu và đọc đúng URL tùy chỉnh', () => {
    expect(getCloudEndpoint()).toBe(DEFAULT_CLOUD_RTDB_URL);

    setCloudEndpoint('https://my-team-4-friends.firebasedatabase.app/');
    expect(getCloudEndpoint()).toBe('https://my-team-4-friends.firebasedatabase.app');

    setCloudEndpoint('');
    expect(getCloudEndpoint()).toBe(DEFAULT_CLOUD_RTDB_URL);
  });
});
