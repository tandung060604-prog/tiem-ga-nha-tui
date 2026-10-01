import { GameState, CustomerReview, ThiefEncounter } from '../types/game';
import { ASSETS } from '../content/assets';
import { random, pick } from './rng';

export interface SecurityCheckResult {
  hasSecurity: boolean;
  guardName: string;
  guardAvatar: string;
  greenZoneWidthPercent: number; // Tỉ lệ % vùng xanh bắt trộm
  meterSpeed: number;            // Tốc độ kim trượt
}

// ---------------------------------------------------------------------------
// 1. LẬP LỊCH XUẤT HIỆN TÊN TRỘM TRONG NGÀY
// Tần suất: Có ngày không có (50%), có ngày 1 lần (35%), có ngày 2 lần (15%)
// ---------------------------------------------------------------------------
export function scheduleThiefEvents(day: number, shiftDurationSec: number = 75): { count: number; timestamps: number[] } {
  // Ngày 1 và Ngày 2 không có trộm để người chơi mới làm quen thao tác nấu
  if (day <= 2) {
    return { count: 0, timestamps: [] };
  }

  const roll = random();
  let count = 0;
  if (roll < 0.50) {
    count = 0; // 50% không có trộm
  } else if (roll < 0.85) {
    count = 1; // 35% 1 lần
  } else {
    count = 2; // 15% 2 lần
  }

  const timestamps: number[] = [];
  const minTime = 15;
  const maxTime = Math.max(minTime + 10, shiftDurationSec - 15);

  if (count === 1) {
    timestamps.push(Math.floor(minTime + random() * (maxTime - minTime)));
  } else if (count === 2) {
    const first = Math.floor(minTime + random() * ((maxTime - minTime) / 2));
    const second = Math.floor(first + 20 + random() * (maxTime - first - 20));
    timestamps.push(first, Math.min(second, maxTime));
  }

  return { count, timestamps };
}

// ---------------------------------------------------------------------------
// 2. KHỞI TẠO TÌNH HUỐNG TÊN TRỘM ĐÓNG GIẢ KHÁCH HÀNG
// ---------------------------------------------------------------------------
const DISGUISE_NAMES = [
  'Thanh Niên Áo Trùm Đầu',
  'Vị Khách Đeo Kính Râm',
  'Người Khách Mắt Lấm Lét',
  'Gã Áo Khoác Dày Bí Ẩn',
  'Khách Ngồi Góc Bàn Tối',
];

const DISGUISE_AVATARS = [
  ASSETS.characters.char_08_grumpy_hai,
  ASSETS.characters.char_10_winner_hung,
  ASSETS.characters.char_28_tough_beo,
  ASSETS.characters.char_14_scrap_nam,
  ASSETS.characters.char_20_mover_cuong,
];

const TARGET_CUSTOMERS = [
  { name: 'Chị Thảo Nhân Viên Văn Phòng', item: 'Chiếc ví da LV & iPhone 15 Pro', loss: 250000 },
  { name: 'Bé Bo Mê Gà Bàn Số 2', item: 'Túi xách đựng tiền đóng học phí', loss: 200000 },
  { name: 'Bà Cụ Bán Vé Số Ngồi Nghỉ', item: 'Bọc tiền vốn vé số cả ngày 300k', loss: 300000 },
  { name: 'Anh Tuấn Shipper Đang Chờ Đơn', item: 'Chiếc điện thoại chạy app công nghệ', loss: 350000 },
  { name: 'Cặp Đôi Bách & Diệp Mải Check-in', item: 'Túi máy ảnh du lịch để sơ hở', loss: 280000 },
];

const CLUES = [
  'Đang giả vờ cúi nhặt khăn ăn, tay thò sang giỏ xách bàn bên... 🕵️‍♂️',
  'Mắt đảo như rang lạc, me me chiếc iPhone để trên bàn khách... 👀',
  'Uống nước cầm chừng, tay lén lút kéo khóa ba lô của khách bên cạnh... ✋',
  'Chân nhổm dậy ngó quanh, chuẩn bị vơ ví tiền rồi phóng ra hẻm... 🏃',
];

export function createThiefEncounter(idSuffix: string = '1', maxTables: number = 4): ThiefEncounter {
  const target = pick(TARGET_CUSTOMERS);
  const disguiseIdx = Math.floor(random() * DISGUISE_NAMES.length);
  const targetTable = Math.floor(1 + random() * Math.max(1, maxTables));

  return {
    id: `thief_enc_${Date.now()}_${idSuffix}`,
    disguiseName: DISGUISE_NAMES[disguiseIdx] ?? 'Khách Đội Mũ Trùm',
    disguiseAvatar: DISGUISE_AVATARS[disguiseIdx] ?? ASSETS.characters.char_08_grumpy_hai,
    trueName: 'Tí Chuột Nhắt (Kẻ Đạo Chích Hẻm 1102)',
    trueAvatar: ASSETS.characters.char_37_thief_busted,
    targetCustomerName: target.name,
    targetTable,
    targetItem: target.item,
    lossAmount: target.loss,
    timeRemaining: 12, // 12 giây để người chơi can thiệp
    initialTime: 12,
    isCaught: false,
    isEscaped: false,
    caughtBySecurity: false,
    tellTaleClue: pick(CLUES),
  };
}

// ---------------------------------------------------------------------------
// 3. KIỂM TRA ĐẤT DIỄN CỦA VAI TRÒ BẢO VỆ (SECURITY ROLE)
// ---------------------------------------------------------------------------
export function checkSecurityStaff(state: GameState): SecurityCheckResult {
  const securityGuard = state.staff.find(s => s.role === 'security');

  if (securityGuard) {
    // Có Bảo Vệ: Vùng căn xanh lục cực rộng (55%), tốc độ kim chậm rãi
    return {
      hasSecurity: true,
      guardName: securityGuard.name,
      guardAvatar: securityGuard.avatar || '👮‍♂️',
      greenZoneWidthPercent: 55,
      meterSpeed: 1.0,
    };
  }

  // Không có Bảo Vệ: Vùng căn hẹp (18%), kim chạy nhanh
  return {
    hasSecurity: false,
    guardName: 'Chưa Tuyển Bảo Vệ',
    guardAvatar: '👤',
    greenZoneWidthPercent: 18,
    meterSpeed: 2.2,
  };
}

// ---------------------------------------------------------------------------
// 4. GIẢI QUYẾT KẾT QUẢ KHI BẮT ĐƯỢC TÊN TRỘM (CAUGHT)
// ---------------------------------------------------------------------------
export interface CaughtResult {
  rewardMoney: number;
  narrativeTitle: string;
  narrativeDetail: string;
  review: CustomerReview;
}

export function resolveThiefCaught(
  state: GameState,
  encounter: ThiefEncounter,
  bySecurity: boolean
): CaughtResult {
  encounter.isCaught = true;
  encounter.caughtBySecurity = bySecurity;

  const rewardMoney = 150000; // Tiền nạn nhân và xóm giềng thưởng nóng

  // Cập nhật stats trong GameState
  if (!state.thiefStats) {
    state.thiefStats = { totalCaught: 0, totalEscaped: 0, totalFinesPaid: 0 };
  }
  state.thiefStats.totalCaught += 1;
  state.money += rewardMoney;

  // Cộng điểm Karma
  if (state.karma) {
    state.karma.community = Math.min(100, (state.karma.community || 50) + 15);
    state.karma.craftsmanship = Math.min(100, (state.karma.craftsmanship || 50) + 10);
  }

  const guardMsg = bySecurity
    ? 'Chú Bảo Vệ nhanh như chớp khóa chặt cổ tay, ghì tên trộm xuống bàn trong tràng pháo tay rầm rộ!'
    : 'Chủ tiệm kịp thời lao ra tóm sống cổ tay kẻ gian ngay khi hắn vừa thò tay vào túi xách!';

  const narrativeTitle = 'BẮT QUẢ TANG TÊN TRỘM HẺM 1102!';
  const narrativeDetail = `Lột mặt nạ ra chính là "${encounter.trueName}"! ${guardMsg} Nạn nhân ${encounter.targetCustomerName} vỡ òa cảm kích và thưởng nóng +${rewardMoney.toLocaleString('vi-VN')}đ cho tiệm!`;

  // Thêm review 5 sao rực rỡ
  const review: CustomerReview = {
    id: `rev_thief_caught_${Date.now()}`,
    authorName: encounter.targetCustomerName,
    avatar: '💖',
    day: state.day,
    stars: 5,
    comment: `Vừa ăn gà giòn rụm vừa được quán cứu kịp ${encounter.targetItem}! ${bySecurity ? 'Bảo vệ tiệm quá chuyên nghiệp và dũng cảm!' : 'Chủ tiệm phản xạ như võ sư!'} An ninh số 1 Sài Gòn! ⭐⭐⭐⭐⭐`,
    orderSummary: '1x Mẹt Gà Rán Hẻm 1102, 1x Trà Đào',
    weakestCriteria: 'space',
    tags: ['#AnNinh5Sao', '#BatTronTaiTran', '#TiemGaNghiaTinh'],
    personaGroup: 'resident',
    sentiment: 'delighted',
  };

  state.recentReviews.unshift(review);
  if (state.recentReviews.length > 30) state.recentReviews.pop();
  state.totalReviewsCount = (state.totalReviewsCount ?? 0) + 1;

  return {
    rewardMoney,
    narrativeTitle,
    narrativeDetail,
    review,
  };
}

// ---------------------------------------------------------------------------
// 5. GIẢI QUYẾT KẾT QUẢ KHI TÊN TRỘM CUỖM ĐỒ TẨU THOÁT (ESCAPED)
// ---------------------------------------------------------------------------
export interface EscapedResult {
  finePaid: number;
  narrativeTitle: string;
  narrativeDetail: string;
  review: CustomerReview;
}

export function resolveThiefEscaped(
  state: GameState,
  encounter: ThiefEncounter
): EscapedResult {
  encounter.isEscaped = true;

  const finePaid = encounter.lossAmount;

  // Cập nhật stats trong GameState
  if (!state.thiefStats) {
    state.thiefStats = { totalCaught: 0, totalEscaped: 0, totalFinesPaid: 0 };
  }
  state.thiefStats.totalEscaped += 1;
  state.thiefStats.totalFinesPaid += finePaid;

  // Trừ tiền đền bù tài sản cho khách
  state.money -= finePaid;

  // Trừ điểm Karma Community
  if (state.karma) {
    state.karma.community = Math.max(0, (state.karma.community || 50) - 15);
  }

  // Tụt sao tiệm gà
  if (state.ratings) {
    state.ratings.space = Math.max(1.0, Number((state.ratings.space - 0.3).toFixed(1)));
    state.ratings.overall = Math.max(1.0, Number((state.ratings.overall - 0.2).toFixed(1)));
  }

  const narrativeTitle = 'KHÁCH HÀNG BỊ CUỖM MẤT TÀI SẢN!';
  const narrativeDetail = `Tên trộm đã thó mất ${encounter.targetItem} của ${encounter.targetCustomerName} rồi phóng vụt ra ngõ hẻm mất dạng! Quán phải đền bù -${finePaid.toLocaleString('vi-VN')}đ và nhận đánh giá 1 sao phốt an ninh!`;

  // Thêm review 1 sao cay đắng
  const review: CustomerReview = {
    id: `rev_thief_escaped_${Date.now()}`,
    authorName: encounter.targetCustomerName,
    avatar: '😡',
    day: state.day,
    stars: 1,
    comment: `Gà chiên thì ngon mà quán ăn sơ hở, để trộm lẻn vào móc sạch ${encounter.targetItem}! Không có bảo vệ trông coi, quá thất vọng! 1 sao cạch mặt! ❌`,
    orderSummary: '1x Gà Rán Giòn Cay, 1x Nước Sâm',
    weakestCriteria: 'space',
    tags: ['#CanhBaoMocTui', '#KhongCoBaoVe', '#MatDoOQuan'],
    personaGroup: 'resident',
    sentiment: 'disappointed',
  };

  state.recentReviews.unshift(review);
  if (state.recentReviews.length > 30) state.recentReviews.pop();
  state.totalReviewsCount = (state.totalReviewsCount ?? 0) + 1;

  return {
    finePaid,
    narrativeTitle,
    narrativeDetail,
    review,
  };
}
