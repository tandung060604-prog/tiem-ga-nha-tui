import { GameState, LeaderboardEntry } from '../types/game';

export const LEADERBOARD_STORAGE_KEY = 'tiem_ga_nha_tui_leaderboard_cache';
export const CLOUD_ENDPOINT_KEY = 'tiem_ga_cloud_rtdb_url';

// Endpoint Firebase Realtime Database mặc định cho cộng đồng Tiệm Gà Nhà Tui
// (Người chơi hoặc nhóm 4 bạn có thể đổi URL database riêng của nhóm trong Cài Đặt)
export const DEFAULT_CLOUD_RTDB_URL = 'https://tiem-ga-nha-tui-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Sinh User ID duy nhất cho mỗi máy / mỗi lượt chơi
 */
export function generateUniqueUserId(): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `usr_${time}_${rand}`;
}

/**
 * Lấy cấu hình Cloud URL hiện tại
 */
export function getCloudEndpoint(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_CLOUD_RTDB_URL;
  return localStorage.getItem(CLOUD_ENDPOINT_KEY) || DEFAULT_CLOUD_RTDB_URL;
}

/**
 * Cập nhật cấu hình Cloud URL (dành cho nhóm 4 bạn muốn dùng database riêng)
 */
export function setCloudEndpoint(url: string): void {
  if (typeof localStorage === 'undefined') return;
  const clean = url.trim().replace(/\/+$/, '');
  if (!clean) {
    localStorage.removeItem(CLOUD_ENDPOINT_KEY);
  } else {
    localStorage.setItem(CLOUD_ENDPOINT_KEY, clean);
  }
}

/**
 * Trích xuất bản ghi xếp hạng từ GameState hiện tại
 */
export function buildLeaderboardEntry(state: GameState): LeaderboardEntry {
  return {
    userId: state.userId || 'unknown_user',
    shopName: state.shopName || 'Tiệm Gà Nhà Tui',
    day: state.day || 1,
    money: state.money || 0,
    chapter: state.currentChapter || 1,
    overallRating: Number((state.ratings?.overall || 4.0).toFixed(2)),
    totalFried: state.lifetimeStats?.totalFried || 0,
    updatedAt: Date.now()
  };
}

/**
 * Lấy dữ liệu Leaderboard từ bộ nhớ đệm Local Storage
 */
export function getLocalLeaderboardCache(): Record<string, LeaderboardEntry> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.warn('Lỗi đọc cache leaderboard:', e);
    return {};
  }
}

/**
 * Lưu dữ liệu Leaderboard vào Local Storage Cache
 */
export function saveLocalLeaderboardCache(cache: Record<string, LeaderboardEntry>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Lỗi lưu cache leaderboard:', e);
  }
}

/**
 * 3 Quán Gà Cư Dân Hẻm 1102 mẫu để bảng xếp hạng luôn sống động khi mới mở
 */
export const DEFAULT_PEER_STORES: LeaderboardEntry[] = [
  {
    userId: 'bot_chu_nam',
    shopName: 'Gà Cay Chú Nam 67',
    day: 78,
    money: 89500000,
    chapter: 3,
    overallRating: 4.6,
    totalFried: 1450,
    updatedAt: Date.now() - 3600000 * 2
  },
  {
    userId: 'bot_be_na',
    shopName: 'Gà Giòn Bé Na Xinh',
    day: 52,
    money: 42300000,
    chapter: 2,
    overallRating: 4.4,
    totalFried: 890,
    updatedAt: Date.now() - 3600000 * 5
  },
  {
    userId: 'bot_co_sau',
    shopName: 'Tiệm Bác Ba Chiên Giòn',
    day: 110,
    money: 215000000,
    chapter: 4,
    overallRating: 4.85,
    totalFried: 2800,
    updatedAt: Date.now() - 3600000 * 12
  }
];

/**
 * Đồng bộ dữ liệu người chơi lên Cloud Leaderboard & Local Cache
 */
export async function syncToLeaderboard(
  state: GameState
): Promise<{ success: boolean; entries: LeaderboardEntry[]; error?: string }> {
  const entry = buildLeaderboardEntry(state);

  // 1. Luôn cập nhật Local Cache ngay lập tức
  const cache = getLocalLeaderboardCache();
  cache[entry.userId] = entry;
  saveLocalLeaderboardCache(cache);

  // 2. Thử gửi lên Cloud Firebase RTDB qua REST API (Timeout 3.5 giây để không chặn UI)
  const endpoint = getCloudEndpoint();
  if (endpoint && typeof fetch === 'function') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${endpoint}/leaderboard/${encodeURIComponent(entry.userId)}.json`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (res.ok) {
        return await fetchLeaderboard(entry.userId);
      }
    } catch (e) {
      // Offline hoặc kết nối mạng chậm: tự động dùng cache cục bộ
      console.warn('Sync Cloud Leaderboard fallback to local cache:', e);
    }
  }

  return fetchLeaderboard(entry.userId);
}

/**
 * Lấy danh sách bảng xếp hạng từ Cloud (hoặc Local Cache nếu offline)
 * Sắp xếp theo Tài Sản (money) giảm dần, hỗ trợ đánh dấu `isSelf`
 */
export async function fetchLeaderboard(
  currentUserId?: string,
  sortBy: 'money' | 'day' = 'money'
): Promise<{ success: boolean; entries: LeaderboardEntry[]; error?: string; isOffline?: boolean }> {
  let entriesMap: Record<string, LeaderboardEntry> = { ...getLocalLeaderboardCache() };
  let isOffline = true;

  // 1. Thử lấy dữ liệu mới nhất từ Cloud qua REST API
  const endpoint = getCloudEndpoint();
  if (endpoint && typeof fetch === 'function') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${endpoint}/leaderboard.json`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && typeof cloudData === 'object') {
          // Gộp dữ liệu từ cloud vào map
          for (const [k, v] of Object.entries(cloudData)) {
            if (v && typeof v === 'object') {
              entriesMap[k] = v as LeaderboardEntry;
            }
          }
          isOffline = false;
          // Cập nhật lại cache cục bộ
          saveLocalLeaderboardCache(entriesMap);
        }
      }
    } catch (e) {
      isOffline = true;
    }
  }

  // 2. Nếu danh sách người chơi thực tế ít hơn 4 (nhóm chưa đủ 4 người),
  // bổ sung các quán mẫu của Hẻm 1102 để bảng xếp hạng đủ 4 dòng đẹp mắt
  const allEntries: LeaderboardEntry[] = Object.values(entriesMap);
  if (allEntries.length < 4) {
    for (const peer of DEFAULT_PEER_STORES) {
      if (!entriesMap[peer.userId]) {
        allEntries.push(peer);
      }
    }
  }

  // 3. Đánh dấu isSelf và sắp xếp
  const processed = allEntries.map(e => ({
    ...e,
    isSelf: currentUserId ? e.userId === currentUserId : false
  }));

  if (sortBy === 'day') {
    processed.sort((a, b) => b.day - a.day || b.money - a.money);
  } else {
    processed.sort((a, b) => b.money - a.money || b.day - a.day);
  }

  return {
    success: true,
    entries: processed,
    isOffline
  };
}

/**
 * Xóa người chơi khỏi Bảng Xếp Hạng khi bấm "Chơi Lại Từ Đầu"
 * (Gửi lệnh DELETE lên Cloud và xóa khỏi Local Storage Cache)
 */
export async function removeFromLeaderboard(userId: string): Promise<{ success: boolean }> {
  if (!userId) return { success: true };

  // 1. Xóa khỏi Local Cache ngay lập tức
  const cache = getLocalLeaderboardCache();
  delete cache[userId];
  saveLocalLeaderboardCache(cache);

  // 2. Gửi request DELETE lên Cloud Firebase RTDB
  const endpoint = getCloudEndpoint();
  if (endpoint && typeof fetch === 'function') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const url = `${endpoint}/leaderboard/${encodeURIComponent(userId)}.json`;
      await fetch(url, {
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e) {
      console.warn('Lỗi khi xóa user khỏi Cloud Leaderboard:', e);
    }
  }

  return { success: true };
}
