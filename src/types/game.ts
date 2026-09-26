// Core Types for Tiệm Gà Nhà Tui

// Danh sách content luôn có ít nhất 1 phần tử → list[0] có kiểu chắc chắn, không cần `!`
export type NonEmpty<T> = readonly [T, ...T[]];

export type GamePhase = 'prep' | 'selling' | 'summary';

export type QualityRating = 'raw' | 'perfect' | 'good' | 'burnt';

export type OilCondition = 'clean' | 'medium' | 'dirty';

// Món có sẵn trong content; món combo người chơi tự tạo có id tự sinh (string).
export type BaseMenuItemId =
  | 'crispy_chicken' | 'shake_fries' | 'soda'
  | 'spicy_chicken' | 'honey_garlic_chicken' | 'pasta_beef' | 'combo_duo'
  | 'biscuit_honey' | 'chicken_burger' | 'popcorn_chicken' | 'peach_tea'
  | 'chicken_rice' | 'korean_tokbokki_chicken' | 'sundae_icecream'
  | 'family_bucket';

// Trạm trong bếp làm ra món. Món chưa có trạm thì khách chưa được gọi.
export type Station = 'fryer' | 'drink';

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  chapter: number;
  icon: string;
  category: 'chicken' | 'sides' | 'drinks' | 'combo';
  station?: Station;
  steps: string[];
  ingredients: { [key: string]: number };
}

export interface StockBatch {
  amount: number;
  daysLeft: number;
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

export type StaffRole = 'cashier' | 'cook' | 'waiter' | 'delivery' | 'manager';

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
  chosenDialogueIds?: string[];
  lifetimeStats: {
    totalFried: number;
    totalBurnt: number;
    totalRevenue: number;
    perfectFriedCount: number;
  };
}
