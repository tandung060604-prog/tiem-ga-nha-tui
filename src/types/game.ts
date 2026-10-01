// Core Types for Tiệm Gà Nhà Tui

// Danh sách content luôn có ít nhất 1 phần tử → list[0] có kiểu chắc chắn, không cần `!`
export type NonEmpty<T> = readonly [T, ...T[]];

export type GamePhase = 'prep' | 'selling' | 'summary';

export type QualityRating = 'raw' | 'perfect' | 'good' | 'burnt';

export type OilCondition = 'clean' | 'medium' | 'dirty';

export type Condiment = 'ketchup' | 'chili';

// Món có sẵn trong content; món combo người chơi tự tạo có id tự sinh (string).
export type BaseMenuItemId =
  | 'crispy_chicken' | 'shake_fries' | 'soda' | 'seven_up' | 'fanta_orange'
  | 'spicy_chicken' | 'honey_garlic_chicken' | 'pasta_beef' | 'combo_duo'
  | 'biscuit_honey' | 'chicken_burger' | 'popcorn_chicken' | 'peach_tea'
  | 'chicken_rice' | 'korean_tokbokki_chicken' | 'sundae_icecream'
  | 'family_bucket'
  | 'spicy_thigh' | 'cheese_stick' | 'danmuji' | 'coleslaw';

// Trạm trong bếp làm ra món. Món chưa có trạm thì khách chưa được gọi.
// 'scoop': múc thẳng từ khay inox (củ cải muối, bắp cải trộn), không nấu.
export type Station = 'fryer' | 'drink' | 'noodle' | 'oven' | 'assembly' | 'combo' | 'scoop';

// Vai trò trong giỏ hàng (core/orders.ts): mọi khách phải gọi ít nhất 1 món chính.
export type BasketRole = 'main' | 'side' | 'drink' | 'dessert';

// Luật giỏ hàng. Xác suất [đầu game, cuối game], tăng dần theo chương.
export interface BasketRule {
  sideChance: readonly [number, number];
  drinkChance: readonly [number, number];
  dessertChance: number;
  walkupDrinkChance: number; // người đi đường chỉ mua nước (đơn duy nhất không có món chính)
  walkupSurcharge: number;   // phụ thu nước mang đi gấp (VNĐ)
}

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  chapter: number;
  icon: string;
  category: 'chicken' | 'sides' | 'drinks' | 'combo';
  station?: Station;
  basketRole?: BasketRole; // món combo không có (combo đã gồm món chính)
  unlockDay?: number;      // ngày tối thiểu khách mới được gọi (ngoài điều kiện chương)
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
  minChapter?: number; // Chương tối thiểu (1..5)
  minDay?: number;     // Ngày tối thiểu (vd: 2, 16, 51...)
  unlockHint?: string; // Gợi ý hiển thị khi chưa đủ điều kiện
  bonus: {
    speed?: number;
    taste?: number;
    hygiene?: number;
    space?: number;
    customers?: number;
    capacity?: number;
    shelfLife?: number;
    discount?: number;
    sauceTip?: number;
    pestShield?: number;
    autoDrink?: boolean;
    pestImmunity?: boolean;
  };
}

export interface UpgradeBranch {
  id: 'kitchen' | 'space' | 'operations' | 'marketing' | 'storage' | 'service' | 'hygiene';
  name: string;
  icon: string;
  currentLevel: number;
  tiers: UpgradeTier[];
}

export type StaffRole = 'cashier' | 'cook' | 'waiter' | 'delivery' | 'manager' | 'security';

export type StaffRarity = 'C' | 'R' | 'SR' | 'SSR';

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
  // Gacha System Attributes
  rarity?: StaffRarity;     // C (Common), R (Rare), SR (Super Rare), SSR (Legendary)
  stars?: number;           // 1★, 2★, 3★, 5★
  title?: string;           // Danh xưng chuyên môn
  laziness?: number;        // 0-100% (độ lười biếng / gián đoạn)
  errorRate?: number;       // 0-100% (tỷ lệ sai sót / làm cháy / nhầm đơn)
  passiveName?: string;     // Tên kỹ năng nội tại
  passiveDesc?: string;     // Mô tả hiệu ứng nội tại
  modelAsset?: string;      // Đường dẫn ảnh model nhân vật
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

export interface ReviewReplyOption {
  id: string;
  strategy?: 'sincere' | 'witty' | 'firm';
  style?: 'sincere' | 'witty' | 'firm'; // alias
  label: string;
  text?: string;
  replyText?: string; // alias
  isRecommended: boolean; // Gợi ý của Bác Ba: câu trả lời đúng tâm lý khách nhất
  customerReaction: string; // Phản hồi cảm xúc của khách sau khi nhận được câu trả lời
  starBonus?: number; // Cứu vãn điểm sao bị trừ (+0.1 - +0.2 sao)
  karmaReward?: {
    community?: number;
    craftsmanship?: number;
    ambition?: number;
  };
  karmaBonus?: {
    community?: number;
    craftsmanship?: number;
    ambition?: number;
  };
}

export interface PlayerReviewReply {
  optionId: string;
  text: string;
  replyText?: string;
  customerReaction: string;
  repliedAtDay: number;
  starBonus?: number;
  karmaBonus?: {
    community?: number;
    craftsmanship?: number;
    ambition?: number;
  };
}

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
  topic?: string;
  personaGroup?: 'genz' | 'office' | 'resident' | 'reviewer' | 'shipper' | 'foodie' | 'student' | 'elder' | 'creator';
  sentiment?: 'furious' | 'disappointed' | 'neutral' | 'delighted' | 'amused';
  advisorHint?: string; // Bác Ba mách nước phân tích tâm lý khách và gợi ý cách đối đáp
  replyOptions?: ReviewReplyOption[];
  playerReply?: PlayerReviewReply;
}

// Tính cách khách hàng ảnh hưởng trực tiếp đến thời gian kiên nhẫn, thái độ và tiền tips
export type CustomerPersonality =
  | 'generous'     // 💎 Hào Phóng: Tip đậm (+10k-15k) khi làm nhanh và món ngon
  | 'frugal'       // 🦀 Keo Kiệt: Không bao giờ tip (0đ), đếm từng đồng lẻ
  | 'impatient'    // ⚡ Vội Vã: Tụt kiên nhẫn nhanh (1.4x), làm nhanh tip +5k, chậm cắt sạch tip
  | 'easygoing'    // 🌸 Dễ Tính: Kiên nhẫn tụt chậm (0.7x), vui vẻ xí xóa, tip 2k-3k
  | 'foodie'       // 👑 Sành Ăn: Cực chuộng Perfect (+8k-12k tip), gà cháy phạt gấp đôi
  | 'student'      // 🎓 Học Sinh: Tiền túi có hạn, tip 1k-2k tiền lẻ hoặc không tip
  | 'driver'       // 🛵 Tài Xế / Shipper: Cần đơn gấp chạy chuyến, không tip
  | 'vip_generous';// 👑✨ Khách Sộp: Đại gia/CEO/Tiktoker, tip khủng +35k-150k+, viền hào quang vàng lấp lánh!

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatar: string;
  isDelivery: boolean;
  isLongDistance?: boolean; // Đơn giao xa cần tự chạy xe máy hoặc thuê ship ngoài (Delivery Runner)
  isMysteryGuest?: boolean;
  isWalkupDrink?: boolean; // người đi đường chỉ mua nước mang đi (đã gồm phụ thu)
  isVip?: boolean;         // Khách Sộp hào phóng
  mysteryQuestId?: string;
  isBunny?: boolean;
  bunnyLetterId?: string;
  archetypeBadge?: string;
  personality?: CustomerPersonality;
  personalityLabel?: string; // Ví dụ: "💎 Hào Phóng", "🦀 Keo Kiệt", "⚡ Vội Vã", "🌸 Dễ Tính", "👑 Sành Ăn"
  personalityDesc?: string;  // Mô tả ngắn ảnh hưởng
  // condiment: khách dặn thêm tương (chỉ xịt đúng loại khách dặn mới có tip); condimentServed: số phần đã xịt đúng
  items: { menuItemId: string; count: number; served: number; completed: boolean; condiment?: Condiment; condimentServed?: number }[];
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
  condiment?: Condiment | null;
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
  wrongOrderCount?: number;  // số đơn giao sai món
  missedItemsCount?: number; // số đơn giao thiếu món
  topSellerId: string;
  // Cho Gà Wrapped hằng tuần (save cũ không có)
  topSellerCount?: number;
  bestStreak?: number;
  friedCount?: number;
  perfectCount?: number;
  // Báo cáo P&L (core/accounting.ts). Save cũ không có → UI coi như 0.
  businessForm?: BusinessForm;
  revenueCounter?: number;   // bán tại quầy
  revenueDelivery?: number;  // bán qua app giao hàng
  cogsCondiments?: number;   // tương cà, tương ớt
  cogsPackaging?: number;    // hộp kraft, giấy thấm dầu, ly nắp, ống hút, túi
  oilCost?: number;          // thay dầu chiên trong ngày
  gasCost?: number;          // gas chảo chiên (theo số mẻ)
  maintenance?: number;      // bảo trì, khấu hao thiết bị
  burntWaste?: number;       // phần tiền mất vì giao món cháy (khách trả nửa giá)
  preTaxProfit?: number;
  taxVat?: number;
  taxPit?: number;
  taxCit?: number;
}

// Hình thức kinh doanh: Chương 1–3 hộ kinh doanh, Chương 4–5 công ty TNHH (core/accounting.ts)
export type BusinessForm = 'household' | 'company';

// Báo cáo lãi lỗ cuối ngày, nhóm theo khoản mục để UI đọc (dựng từ DayLedger bằng financialLedger()).
export interface FinancialLedger {
  revenue: { counter: number; delivery: number; tips: number; gross: number };
  cogs: { ingredients: number; condiments: number; packaging: number; oil: number; total: number };
  opex: { wages: number; rent: number; utilities: number; gas: number; commission: number; maintenance: number; total: number };
  waste: { expired: number; burnt: number; total: number };
  fines: number;
  preTaxProfit: number;
  tax: { form: BusinessForm; vat: number; pit: number; cit: number; total: number };
  netProfit: number;
}

// Một khay inox GN trên quầy sơ chế (core/prepStation.ts). Khay luôn được dựng đủ, kể cả khi còn khóa.
export interface PrepSlotState {
  id: string;
  row: 'top' | 'bottom';       // trên: khay nông GN 1/6 (món kèm, sốt) · dưới: khay sâu GN 1/3 (đồ sống thả chảo)
  pan: '1-3' | '1-6';
  action: string;              // id nút (không có 'btn-'), vd. 'fry-chicken', 'scoop-danmuji', 'season-spicy'
  ingredientId: string;
  menuItemId?: string;
  label: string;
  icon: string;                // emoji dự phòng khi chưa có ảnh
  asset: string | null;
  stock: number;
  status: 'ready' | 'empty' | 'locked';
  lock?: { kind: 'chapter' | 'day' | 'contract'; label: string; hint: string };
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

export type StoryEndingId = 'happy' | 'open' | 'bad_bankruptcy' | 'bad_corporate' | 'bad_police' | 'secret';

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
  scareCustomers?: boolean; // Khi người chơi chọn sai: làm toàn bộ khách đang đợi hoảng sợ bỏ chạy
  disruptionSeconds?: number; // Thời gian gián đoạn quán (đóng băng khách đến)
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

// Định danh mở rộng cho 36 nhân vật Hẻm 1102 & Tuyến Động Vật
export type CharacterId =
  | 'char_01_owner' | 'char_02_lottery_lady' | 'char_03_helper_linh' | 'char_04_fryer_khang'
  | 'char_05_kid_bo' | 'char_06_granny_ba' | 'char_07_trendy_vy' | 'char_08_grumpy_hai'
  | 'char_09_buyer_tam' | 'char_10_winner_hung' | 'char_11_wholesale_nam' | 'char_12_courier_ut'
  | 'char_13_vendor_tham' | 'char_14_scrap_nam' | 'char_15_bread_bay' | 'char_16_icecream_tu'
  | 'char_17_sweeper_lan' | 'char_18_garbage_hung' | 'char_19_shipper_tuan' | 'char_20_mover_cuong'
  | 'char_21_trucker_long' | 'char_22_electrician_dung' | 'char_23_builder_bay' | 'char_24_grocer_sau'
  | 'char_25_police_nam' | 'char_26_traffic_hoang' | 'char_27_warden_hai' | 'char_28_tough_beo'
  | 'char_29_atm_nga' | 'char_30_student_bus' | 'char_31_gossip_tam' | 'char_32_jogger_tuan'
  | 'char_33_couple_genz'
  // Tuyến động vật & dịch hại
  | 'pet_01_dog_vang' | 'pet_02_cat_muop' | 'pest_01_rat_cong';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  roleTitle: string;
  category: 'staff' | 'regular' | 'street_worker' | 'authority' | 'transit' | 'animal';
  unlockChapter: number;
  favoriteOrder: string[];
  patienceMultiplier: number;
  tipTendency: 'low' | 'normal' | 'generous';
  karmaAffinity: 'community' | 'craftsmanship' | 'ambition';
  incidentIds: string[];
}

export interface GameState {
  version: number;
  day: number;
  phase: GamePhase;
  money: number;
  shopName: string;
  userId?: string;
  roomId?: string;
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
  prepTutorialDone?: boolean;  // Bác Ba đã hướng dẫn màn Chuẩn Bị đầu ngày (kho, bàn ghế, nâng cấp, review)
  todayOilCost?: number;       // tiền thay dầu trong ngày (đã trừ ví) → ghi vào sổ lúc đóng cửa
  adoptedPets?: ('pet_01_dog_vang' | 'pet_02_cat_muop')[]; // Thú cưng đã nhận nuôi (Chó Cỏ, Mèo Mướp)
  pestIncidentsCount?: number; // Số lần xuất hiện chuột cống bếp
  dirtyOilPenaltyDays?: number;  // Số ngày còn bị phạt vì đóng cửa lúc dầu đen (giảm sao Vệ sinh + Hương vị)
  dirtyOilViolations?: number;   // Số lần bị công an / kiểm tra ATTP phát hiện xài dầu đen (1: cảnh cáo, 2: phạt 200k, 3: bắt đi tù)
  dirtyOilFryingCount?: number;  // Đếm số mẻ chiên liên tiếp trong dầu đen sì
  totalReviewsCount?: number;    // Tổng số lượt đánh giá đã nhận
  gangsterThreatDays?: number;   // Số ngày giang hồ gây khó (giảm 30% khách) do chưa trả tiền mặt bằng
  lastRentPaidWeek?: number;     // Tuần gần nhất đã trả tiền mặt bằng (tính theo day / 7)
  incidentCooldowns?: Record<string, number>; // incidentId -> last day seen (chống lặp lại sự kiện trong 6 ngày)
  expiredWasteNotification?: { items: string[]; totalValue: number; day: number } | null; // Thông báo hủy hàng hết hạn qua đêm
  secretSauceDay?: SecretSauceDayState | null; // Trạng thái Nồi Sốt Bí Truyền của ngày hôm nay
  todayOilFiltered?: boolean; // Đã chơi minigame lọc cặn dầu cuối ngày hôm nay chưa
  bgmVolume?: number;                // Âm lượng nhạc nền (0.0 -> 1.0)
  sfxVolume?: number;                // Âm lượng hiệu ứng âm thanh (0.0 -> 1.0)
  todayMarketDiscount?: number;      // % giảm giá sỉ khi đi chợ trả giá hôm nay (0 -> 35%)
  todayMarketBargained?: boolean;    // Đã đi chợ đầu ngày hôm nay chưa
  deliveryRunnerDayCount?: number;   // Số đơn giao xa đã xử lý hôm nay (tối đa 2 đơn/ngày)
  // Staff Gacha Recruitment
  staffGachaPity?: number;           // Số roll liên tiếp chưa ra SR/SSR (Soft pity 10)
  staffGachaSsrPity?: number;        // Số roll liên tiếp chưa ra SSR (Hard pity 50)
  staffGachaTotalRolls?: number;     // Tổng số lượt gacha đã roll
  gachaPullsHistory?: string[];      // Lịch sử ID các nhân viên đã roll gần nhất
}

export interface BargainWholesaler {
  id: string;
  name: string;
  stallName: string;
  avatar: string;
  dialogue: string;
  specialty: string;
}

export interface BargainResult {
  success: boolean;
  discountPct: number;
  discountPercent?: number;
  message: string;
  wholesaler: BargainWholesaler;
}

export interface DeliveryRunResult {
  mode: 'manual' | 'outsourced';
  crashes: number;
  tipBonus: number;
  speedRatingDelta: number;
  message: string;
}

export interface OilCrumb {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'small' | 'medium' | 'burnt_chunk';
  collected: boolean;
}

export interface OilFilterResult {
  success: boolean;
  isPartial: boolean;
  collectedCount: number;
  totalCrumbs: number;
  initialCondition: OilCondition;
  newCondition: OilCondition;
  savedMoney: number;
  hygieneBonus: number;
  bonusReward: number;
}

export type SpiceId = 'garlic' | 'honey' | 'chili' | 'soy' | 'sesame';

export interface SauceSpice {
  id: SpiceId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tag: string;
}

export interface SecretSauceDayState {
  day: number;
  recipe: SpiceId[];
  completed: boolean;
  success: boolean;
  buffActive: boolean;
  tipsEarnedToday?: number;
}

export interface LeaderboardEntry {
  userId: string;
  roomId?: string;
  shopName: string;
  day: number;
  money: number;
  chapter: number;
  overallRating: number;
  totalFried: number;
  updatedAt: number;
  isSelf?: boolean;
}
