// Core Types for Tiệm Gà Nhà Tui

// Danh sách content luôn có ít nhất 1 phần tử → list[0] có kiểu chắc chắn, không cần `!`
export type NonEmpty<T> = readonly [T, ...T[]];

export type GamePhase = 'prep' | 'selling' | 'summary';

export type QualityRating = 'raw' | 'perfect' | 'good' | 'burnt';

export type OilCondition = 'clean' | 'medium' | 'dirty';

// Món có sẵn trong content; món combo người chơi tự tạo có id tự sinh (string).
export type BaseMenuItemId =
  | 'crispy_chicken' | 'shake_fries' | 'soda' | 'seven_up' | 'fanta_orange'
  | 'spicy_chicken' | 'honey_garlic_chicken' | 'pasta_beef' | 'combo_duo'
  | 'biscuit_honey' | 'chicken_burger' | 'popcorn_chicken' | 'peach_tea'
  | 'chicken_rice' | 'korean_tokbokki_chicken' | 'sundae_icecream'
  | 'family_bucket';

// Trạm trong bếp làm ra món. Món chưa có trạm thì khách chưa được gọi.
export type Station = 'fryer' | 'drink' | 'noodle' | 'oven' | 'assembly' | 'combo';

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  chapter: number;
  icon: string;
  category: 'chicken' | 'sides' | 'drinks' | 'combo';
  station?: Station;
  components?: { menuItemId: BaseMenuItemId; count: number }[]; // combo: khách nhận từng món, trả giá combo
  steps: string[];
  ingredients: { [key: string]: number };
}

export interface StockBatch {
  amount: number;
  daysLeft: number;
  // Đổi trả trong ngày: số đơn vị của lô vừa MUA hôm nay còn được hoàn, và giá đã trả mỗi đơn vị.
  // Hàng tặng lúc đầu game / hàng đã qua đêm: refundable = 0 (không hoàn được).
  refundable?: number;
  unitCost?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  cost: number;
  amount: number;          // = tổng các lô, đồng bộ bởi core/inventory
  shelfLifeDays: number;
  currentLifeDays: number; // = hạn của lô cũ nhất
  icon: string;
  batches: StockBatch[];
  unlocked?: boolean;      // Đã mở khóa hợp đồng cung ứng chưa (true = đã mở, false = cần mở khóa)
  unlockDay?: number;      // Ngày tối thiểu để có thể ký hợp đồng mở khóa
  unlockCost?: number;     // Phí hợp đồng mở khóa (VNĐ)
}

export interface UpgradeTier {
  level: number;
  name: string;
  cost: number;
  description: string;
  bonus: {
    speed?: number;
    taste?: number;
    hygiene?: number;
    space?: number;
    customers?: number;
    capacity?: number;
  };
}

export interface UpgradeBranch {
  id: 'kitchen' | 'space' | 'operations' | 'marketing';
  name: string;
  icon: string;
  currentLevel: number;
  tiers: UpgradeTier[];
}

export type StaffRole = 'cashier' | 'cook' | 'waiter' | 'delivery' | 'manager' | 'security';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  avatar: string;
  speed: number;    // 1-100
  skill: number;    // 1-100
  attitude: number; // 1-100
  stamina: number;  // 1-100
  traits: string[];
  hourlyWage: number;
  mood: number;     // 0-100
  shiftsWorked: number;
}

export interface StarRating {
  taste: number;     // 30%
  speed: number;     // 25%
  hygiene: number;   // 15%
  space: number;     // 15%
  pricing: number;   // 15%
  overall: number;
}

export type Criteria = Exclude<keyof StarRating, 'overall'>;

export interface CustomerReview {
  id: string;
  authorName: string;
  avatar: string;
  day: number;
  stars: number;
  comment: string;
  weakestCriteria: keyof StarRating;
  orderSummary: string;
  tags?: string[];
  ownerReply?: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatar: string;
  isDelivery: boolean;
  isMysteryGuest?: boolean;
  mysteryQuestId?: string;
  isBunny?: boolean;
  bunnyLetterId?: string;
  archetypeBadge?: string;
  items: { menuItemId: string; count: number; served: number; completed: boolean }[];
  patienceMax: number;
  patienceCurrent: number;
  totalPrice: number;
  comboName?: string;    // khách gọi combo: tên combo hiển thị trên thẻ khách
  burntPenalty?: number; // tiền bị trừ vì giao gà cháy (nửa giá mỗi món cháy)
  perfectBonus?: number; // tip thêm cho mỗi món Perfect
  startTime: number;
}

export interface TrayItem {
  id: string;
  menuItemId: string;
  name: string;
  icon: string;
  quality: QualityRating;
  condiment?: 'ketchup' | 'chili' | null;
}

export interface DayLedger {
  day: number;
  grossRevenue: number;
  tips: number;
  ingredientCost: number;
  wasteCost: number;
  wages: number;
  rent: number;
  utilities: number;
  appCommissions: number;
  fines?: number; // phạt (vd. kiểm tra vệ sinh gặp dầu đen); save cũ không có
  netProfit: number;
  customersServed: number;
  customersLost: number;
  burntCount: number;
  topSellerId: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effect: {
    customerMultiplier?: number;
    deliveryMultiplier?: number;
    priceMultiplier?: number;
    inspection?: boolean; // cuối ngày kiểm tra dầu: dầu đen bị phạt, dầu sạch được cộng Vệ sinh
    specialTip?: string;
  };
}

export interface Chapter {
  number: number;
  title: string;
  context: string;
  daysRange: [number, number];
  targetMoney: number;
  targetStars: number;
  mechanicsUnlocked: string[];
  description: string;
}

export interface KarmaState {
  community: number;     // Tình Thân Hẻm (0-100)
  craftsmanship: number; // Bản Sắc Nghệ Nhân (0-100)
  ambition: number;      // Tham Vọng Quy Mô (0-100)
}

export type StoryEndingId = 'happy' | 'open' | 'bad_bankruptcy' | 'bad_corporate' | 'secret';

export interface StoryEnding {
  id: StoryEndingId;
  themeClass: string;
  kicker: string;
  icon: string;
  title: string;
  tagline: string;
  excerpt: string;
  conditionDescription: string;
  karma: KarmaState;
}

export interface IncidentChoice {
  id: string;
  label: string;
  kicker?: string;
  subDesc?: string; // Dòng phụ giải thích tình thế, hệ quả, cái giá phải trả hoặc may rủi (chuẩn 2 tầng chữ phong cách Mì Cay Bà Tám)
  requiresSecurity?: boolean; // Cần có Nhân viên Bảo vệ mới kích hoạt được
  riskRate?: number; // Tỷ lệ rủi ro thất bại khi KHÔNG có bảo vệ (0.0 -> 1.0)
  karmaDelta: {
    community?: number;
    craftsmanship?: number;
    ambition?: number;
  };
  moneyDelta?: number; // Thay đổi tiền mặt (âm = mất tiền, dương = thưởng)
  reputationDelta?: number; // Thay đổi sao đánh giá
  reactionTitle: string;
  reactionNarrative: string; // Diễn biến câu chuyện khi thành công / giải quyết (ẩn điểm số)
  reactionFailureNarrative?: string; // Diễn biến khi gặp rủi ro thất bại (quán phải tự chịu)
}

export interface DailyIncident {
  id: string;
  title: string;
  icon: string;
  characterName: string;
  characterAvatar: string;
  characterRole: string;
  context: string;
  dialogue: string;
  choices: IncidentChoice[];
  minChapter?: number;
  minDay?: number; // Ngày tối thiểu trong game mới có thể xuất hiện
  unlockHint?: string; // Gợi ý bí ẩn khi sự kiện chưa mở khóa (kích thích tò mò)
  rarity?: 'common' | 'rare' | 'epic'; // Phân loại độ hiếm
  requiredStars?: number; // Yêu cầu số sao đánh giá tối thiểu (ví dụ reviewer chỉ đến khi quán nổi)
  isSecurityRisk?: boolean; // Tình huống có nguy cơ quỵt nợ, trộm cắp, phá hoại
  phaseTiming?: 'morning' | 'shift' | 'any'; // Thời điểm xuất hiện trong ngày
  categoryTag?: string; // Tag pill như 'CHUYỆN TÌNH TRONG BẾP', 'DRAMA HẺM SÂU', 'GẶP NẠN GIỮA CA'...
  characterImg?: string; // Đường dẫn ảnh chibi tròn sạch nền (ví dụ: '/assets/characters/char_capdoi_stand.png')
  emoteBubble?: string; // Biểu tượng trái tim / cảm xúc bay bổng trên đỉnh avatar: '❤️', '🔥', '💸', '🐾', '👮'
}

export interface GameState {
  version: number;
  day: number;
  phase: GamePhase;
  money: number;
  shopName: string;
  currentChapter: number;
  isFastForward: boolean;
  soundEnabled: boolean;
  
  // Resources & Progression
  inventory: { [id: string]: InventoryItem };
  menu: MenuItem[];
  upgrades: { [id: string]: UpgradeBranch };
  staff: StaffMember[];
  candidates: StaffMember[];
  
  // Reviews & Rating
  ratings: StarRating;
  recentReviews: CustomerReview[];
  
  // Kitchen Live State
  oilCondition: OilCondition;
  oilBatchesCooked: number;
  
  // History, Lore & Narrative
  dayHistory: DayLedger[];
  bestReviews: CustomerReview[];
  unlockedStoryActs: number[];
  completedQuests: string[];
  bunnyVisitsCount: number;
  unlockedBunnyLetters: string[];
  karma: KarmaState;
  activeEnding?: StoryEndingId | null;
  achievedEndings?: StoryEndingId[]; // kết thúc đã đạt: chỉ những cái này được xem lại
  debtStreak?: number;               // số ngày liên tiếp đóng cửa với quỹ âm
  chosenDialogueIds?: string[];
  seenIncidentIds?: string[];        // Danh sách các sự kiện đã gặp
  resolvedIncidents?: { incidentId: string; choiceId: string; day: number; succeeded: boolean }[];
  todayIncidentsCount?: number;      // Đếm số sự kiện đã xuất hiện trong ngày hiện tại
  lifetimeStats: {
    totalFried: number;
    totalBurnt: number;
    totalRevenue: number;
    perfectFriedCount: number;
    totalBonus?: number; // tiền thưởng (Thỏ Cam, Bác Ba tiếp tế) — dùng cho kiểm tra sổ sách chống gian lận
  };
  depositsPaid?: number;       // số lần đặt cọc qua chương (chương chỉ mở bằng đặt cọc)
  baBaAidChapter?: number;     // chương gần nhất Bác Ba đã tiếp tế (1 lần/chương)
  integrity?: { tampered: boolean; reasons: string[] };
  pausedShift?: import('../core/sellingSim').ShiftSnapshot | null; // ca bán dở (thoát giữa ca)
  tutorialDone?: boolean;      // Bác Ba đã dẫn ca đầu (core/tutorial.ts)
}
