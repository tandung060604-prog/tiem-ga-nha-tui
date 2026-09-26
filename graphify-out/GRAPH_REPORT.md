# Graph Report - TiemGaRan  (2026-09-26)

## Corpus Check
- 72 files · ~171,309 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 6, (none) 2, .example 1)

## Summary
- 558 nodes · 1190 edges · 38 communities (36 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- main.ts
- 4. Danh sách màn hình
- AppController
- reviewsEngine.ts
- Story Bible v2 — Hẻm 1102
- GameState
- sellingSim.ts
- Đợt 1 — Chương 1 (cần trước để làm vertical slice)
- Kế hoạch game: Tiệm Gà Nhà Tui
- compilerOptions
- 2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset
- cookingEngine
- package.json
- AudioManager
- Game Narrative Director — Tiệm Gà Nhà Tui
- p0-fixes.test.ts
- 2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES)
- 2. Các Quyết Định UX & Giao Diện Chính
- parallel-agents.md
- orders.ts
- 2. Kết quả công việc: Việc xong & Việc chưa xong
- Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui
- HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI
- day.ts
- 1. Màn Bán Hàng (SellingView.ts)
- nhiem-vu-gio-1.md
- bao-cao-gio-1.md
- Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui
- Procedural Content Generator — Tiệm Gà Nhà Tui
- 4. Tuyến theo chương
- Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)
- game.ts
- audio.ts
- MenuTab.ts
- DayLedger
- upgradeEffects
- 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)
- StoryModal.ts

## God Nodes (most connected - your core abstractions)
1. `GameState` - 35 edges
2. `AppController` - 32 edges
3. `cookingEngine` - 24 edges
4. `compilerOptions` - 17 edges
5. `pick()` - 16 edges
6. `upgradeEffects` - 16 edges
7. `audio` - 14 edges
8. `EconomyEngine` - 14 edges
9. `createInitialState()` - 14 edges
10. `stateManager` - 13 edges

## Surprising Connections (you probably didn't know these)
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  docs/01-review-va-ke-hoach.md → src/core/reviewsEngine.ts
- `5. Cách trình bày trong game` --references--> `GameState`  [INFERRED]
  docs/02-story-bible-v2.md → src/types/game.ts
- `Kết quả (trung vị ngày qua Chương 1; GDD: ngày 15)` --references--> `EconomyEngine`  [INFERRED]
  docs/bao-cao/mo-phong-can-bang.md → src/core/economy.ts
- `Đã làm` --references--> `pick()`  [INFERRED]
  docs/bao-cao/claude-gio-1.md → src/core/rng.ts
- `Đã làm` --references--> `migrateSave()`  [INFERRED]
  docs/bao-cao/claude-gio-1.md → src/core/state.ts

## Import Cycles
- None detected.

## Communities (38 total, 2 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.18
Nodes (13): BUNNY_LETTERS, MYSTERY_QUESTS, MysteryGuestQuest, SELLING_ACTIONS, SellingAction, TabId, bindBunnyModalEvents(), renderBunnyAlbumModal() (+5 more)

### Community 1 - "4. Danh sách màn hình"
Cohesion: 0.12
Nodes (16): 0. Bạn cần giao lại gì, 1. Sản phẩm là gì, 2. Hệ thống thị giác hiện có (giữ và mở rộng), 3. Nguyên tắc UX bắt buộc, 4.1 Header (dùng chung), 4.2 Chuẩn bị (Prep), 4.3 Mở bán (màn quan trọng nhất), 4.4 Tổng kết ngày (modal toàn màn) (+8 more)

### Community 2 - "AppController"
Cohesion: 0.21
Nodes (4): createCustomerSource(), AppController, assertNever(), isSellingAction()

### Community 3 - "reviewsEngine.ts"
Cohesion: 0.14
Nodes (13): Kết quả (trung vị ngày qua Chương 1; GDD: ngày 15), Mô phỏng cân bằng — 26/09/2026, Vấn đề thiết kế còn lại (không chỉnh bằng số được), CUST_AVATARS, GENZ_REVIEW_TEMPLATES, GENZ_USERNAMES, ReviewTemplate, applyBunnyReward() (+5 more)

### Community 4 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.25
Nodes (7): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Danh tính Thỏ Cam (lộ diện chương 5), Story Bible v2 — Hẻm 1102

### Community 5 - "GameState"
Cohesion: 0.09
Nodes (24): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 5. Tối ưu UI/UX (P2), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện (+16 more)

### Community 6 - "sellingSim.ts"
Cohesion: 0.14
Nodes (23): foodImage(), DAY_REAL_MS, isRushHour(), serveFirstOrder(), OrdersEngine, createSellingSession(), FAST_FORWARD, gameDeltaMs() (+15 more)

### Community 7 - "Đợt 1 — Chương 1 (cần trước để làm vertical slice)"
Cohesion: 0.12
Nodes (17): 0. Cách giao file, 1. Phong cách chung (art bible), 2. Cấm (bắt buộc), 3. Kích thước chuẩn, 4.1 Linh vật & nhân vật chính, 4.2 Khách ngẫu nhiên (hệ ghép phần), 4.3 Món ăn chương 1 (256×256), 4.4 Bếp & quầy chương 1 (+9 more)

### Community 8 - "Kế hoạch game: Tiệm Gà Nhà Tui"
Cohesion: 0.12
Nodes (16): Core loop theo ngày và kinh tế, Kiến trúc kỹ thuật và cấu trúc repo, Kế hoạch game: Tiệm Gà Nhà Tui, Lộ trình phát triển và mở rộng, Menu (mở khóa theo chương), Menu, nâng cấp, nhân viên và đánh giá, Nguồn, Nhân viên và lương (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 10 - "2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset"
Cohesion: 0.20
Nodes (9): 1. Danh Mục Asset Đã Tạo & Đường Dẫn Artifacts, 2.1. Linh vật Gà Bông (`mascot_gabong_sheet`), 2.2. Bé Thỏ Cam Mimi (`char_thocam_sheet`), 2.3. Bác Ba Tổ Trưởng (`char_bacba_sheet`), 2.4. Món Gà Giòn Nhà Tui (`food_crispy_chicken_perfect`), 2.5. Mockup Màn Hình Mở Bán (`mockup_mo_ban`), 2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset, 3. Bảng Kiểm Tra Chất Lượng (Quality Checklist) (+1 more)

### Community 11 - "cookingEngine"
Cohesion: 0.13
Nodes (8): cookingEngine, CookingState, Sauce, OilCondition, QualityRating, TrayItem, perfectWindow(), withLevels()

### Community 12 - "package.json"
Cohesion: 0.07
Nodes (27): devDependencies, playwright-core, sharp, tsx, @typesafe-ai/sdk, typescript, vite, vitest (+19 more)

### Community 14 - "Game Narrative Director — Tiệm Gà Nhà Tui"
Cohesion: 0.13
Nodes (14): 1.1. Cốt lõi cảm xúc (Emotional Core), 1.2. Thước đo thành công của câu chuyện, 1. Tinh Thần Cốt Truyện & Thế Giới Hẻm 1102, 2. Bảng Nhân Vật Hạt Nhân (12 Archetypes & Voice Matrix), 3. Lộ Trình Cốt Truyện 5 Chương (100k – 200k Chữ), 4. Chuẩn Kịch Bản Phân Nhánh (Branching Dialogue Format), 5. Quy Chuẩn Viết Thư Thỏ Cam (Mimi's Letters), 6. Quy Tắc Bất Di Bất Dịch (Golden Narrative Rules) (+6 more)

### Community 15 - "p0-fixes.test.ts"
Cohesion: 0.18
Nodes (20): vitest, CLOSE_HOUR, GAME_HOUR_MS, isWeekend(), OFF_PEAK_HOURS, OPEN_HOUR, RUSH_HOURS, RUSH_WINDOWS (+12 more)

### Community 16 - "2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES)"
Cohesion: 0.22
Nodes (8): 1. PHÂN CHIA QUYỀN HẠN & VAI TRÒ (RESPONSIBILITY MATRIX), 2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES), Anti IDE Project: Tiệm Gà Nhà Tui, Quy tắc 1: Không can thiệp chéo thư mục (File Ownership Isolation), Quy tắc 2: Giao tiếp "Contract-First" qua `src/types/game.ts`, Quy tắc 3: Quản lý tiến trình & Dev Server trong Anti IDE, Quy tắc 4: Đồng bộ kiến thức qua MCP Memory Server, QUY ƯỚC LÀM VIỆC SONG SONG CHO MULTI-AGENT (GEMINI & CLAUDE)

### Community 17 - "2. Các Quyết Định UX & Giao Diện Chính"
Cohesion: 0.22
Nodes (8): 1. Quyết Định Quan Trọng Về Nhân Vật Bé Thỏ Cam (Mimi), 2.1. Thumb-Zone (Vùng Một Ngón Cái 40% Dưới Màn Hình), 2.2. Hệ Thống Màu & Tương Phản WCAG AA, 2.3. Kiểu Chữ (Typography), 2.4. Hiệu Năng & Animation, 2. Các Quyết Định UX & Giao Diện Chính, 3. Danh Mục File Giao Nộp, Ghi Chú Thiết Kế UI & Kiến Trúc Thị Giác — Tiệm Gà Nhà Tui

### Community 19 - "orders.ts"
Cohesion: 0.12
Nodes (20): 3. Bảng nhân vật (chốt để tránh mâu thuẫn), ARCHETYPE_CONFIG, CharacterGenerator, CustomerArchetype, ModularCharacter, INITIAL_MENU, BUNNY_RANDOM_VISIT_NOTES, BunnyLetter (+12 more)

### Community 20 - "2. Kết quả công việc: Việc xong & Việc chưa xong"
Cohesion: 0.22
Nodes (9): 1. Danh sách file đã tạo và chỉnh sửa, 2. Kết quả công việc: Việc xong & Việc chưa xong, 3. Yêu cầu Markup gửi Claude, Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35), File CSS chỉnh sửa (Đưa Tokens & Components vào game):, File tài liệu & Asset đã tạo/cập nhật:, TRIỂN KHAI 4 BỘ SKILLS CHO MULTI-AGENT (GEMINI & CLAUDE):, VIỆC ĐÃ HOÀN THÀNH: (+1 more)

### Community 21 - "Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui"
Cohesion: 0.15
Nodes (12): 1. Triết Lý Vòng Lặp Trò Chơi (Core Game Loop), 2.1. Cấu trúc Sổ Sách Tài Chính (Ledger Formula), 2.2. Biên Lợi Nhuận Mục Tiêu Theo Món (Margin Target), 2. Mô Hình Dòng Tiền & Thuật Toán Kinh Tế (Economy Flow), 3.1. 4 Vùng Đánh Giá Chất Lượng Chiên (Cooking Quality Zones), 3.2. Vòng Đời Của Dầu Chiên (Oil Degradation), 3. Cơ Chế Trạm Bếp & Minigame Chiên Gà, 4. Hệ Thống Nhân Viên & Quản Lý Tâm Trạng (Staff System) (+4 more)

### Community 22 - "HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI"
Cohesion: 0.50
Nodes (3): 1. Phân Công Trách Nhiệm Khi Chạy Song Song Cùng Gemini (Anti IDE), 2. Graphify Knowledge Graph, HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI

### Community 23 - "day.ts"
Cohesion: 0.16
Nodes (13): CHAPTERS, RANDOM_EVENTS, BUNNY_VISIT_TIP, eventForDay(), FAST_SERVICE_TIP, INSPECTION_FINE, PERFECT_TIP, recordFryerLift() (+5 more)

### Community 24 - "1. Màn Bán Hàng (SellingView.ts)"
Cohesion: 0.29
Nodes (6): 1. Màn Bán Hàng (SellingView.ts), 2. Màn Tổng Kết (SummaryModal.ts), Yêu Cầu Markup (Gemini → Claude), Đề xuất 1: Chuyển đổi cập nhật vị trí kim đo sang CSS Transform (Tùy chọn P2), Đề xuất 2: Gắn thêm `data-action` cho event delegation, Đề xuất: Chuẩn bị container cho biểu đồ Radar SVG 5 tiêu chí

### Community 25 - "nhiem-vu-gio-1.md"
Cohesion: 0.22
Nodes (6): Lỗi hình ảnh cần sửa (xem `screenshots/ban-hang-390px.png`), Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35), Ràng buộc bắt buộc (đã gây lỗi thật, Claude vừa sửa, bản `components.css` của bạn đang làm hỏng lại), Việc 1 — Tạo file ảnh thật cho Đợt 1 (ưu tiên cao nhất), Việc 2 — Đưa `design-tokens.css` + `components.css` vào game, Việc 3 — Báo cáo (10 phút cuối)

### Community 26 - "bao-cao-gio-1.md"
Cohesion: 0.29
Nodes (5): 1. Ranh giới file (không sửa file của bên kia), 2. Việc của mỗi bên trong giờ này, 3. Bảng trạng thái / yêu cầu qua lại, 4. Báo cáo cuối giờ, Phân công Claude ↔ Gemini

### Community 27 - "Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui"
Cohesion: 0.17
Nodes (11): 1. Triết Lý "Juice It Or Lose It", 2.1. Phân bổ màn hình dọc 9:16 (390×844pt), 2.2. Kích thước chạm an toàn (Target Size), 2. Quy Chuẩn Vùng Ngón Cái (Thumb-Zone Ergonomics), 3. Bảng Tra Cứu Hiệu Ứng Chuyển Động (Animation Tokens), 4. Haptic Feedback Matrix (Rung Xúc Giác), 5. Bong Bóng Suy Nghĩ Realtime (Customer Thoughts System), 6. Biểu Đồ Radar SVG 5 Tiêu Chí (Summary Radar Chart) (+3 more)

### Community 28 - "Procedural Content Generator — Tiệm Gà Nhà Tui"
Cohesion: 0.22
Nodes (8): 1. Công Thức Đặt Tên Thực Khách Sài Gòn (Naming Formula), 2. Hệ Thống Ghép Tầng Ngoại Hình (Modular Visual Generation), 3. Ngân Hàng Câu Thoại Ngữ Cảnh (Contextual Dialogue Bank), 4. Cơ Chế Khách Bí Ẩn & Chuỗi Nhiệm Vụ (Mystery Quests), 5. Quy Chuẩn Sinh Review GenZ Hài Hước (Viral Review Generator), Các nhóm danh xưng phổ biến:, Cấu trúc Quest:, Procedural Content Generator — Tiệm Gà Nhà Tui

### Community 29 - "4. Tuyến theo chương"
Cohesion: 0.33
Nodes (6): 4. Tuyến theo chương, Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15), Chương 2 — Tiệm Trong Hẻm (ngày 16–50), Chương 3 — Mặt Tiền Phố (ngày 51–100), Chương 4 — Tiệm Hot Trend (ngày 101–150), Chương 5 — Chuỗi Gà Quốc Dân (ngày 151–210)

### Community 30 - "Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)"
Cohesion: 0.33
Nodes (6): Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05), Bổ sung sau giờ 1 (theo quyết định của chủ dự án, xong 16:17), Cần bạn quyết, Kết quả kiểm chứng cuối giờ, Đã làm, Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

### Community 31 - "game.ts"
Cohesion: 0.24
Nodes (10): generateCandidate(), STAFF_ROLES_INFO, STAFF_TRAITS, GamePhase, StaffMember, StaffRole, Station, StockBatch (+2 more)

### Community 32 - "audio.ts"
Cohesion: 0.27
Nodes (8): audio, bindHeaderEvents(), renderHeader(), bindInventoryEvents(), renderSettingsModal(), ENTITIES, escapeHtml(), SHOP_NAME_MAX

### Community 33 - "MenuTab.ts"
Cohesion: 0.21
Nodes (8): ref_node_fs, ASSETS, CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer, MenuItem, bindMenuEvents(), paths()

### Community 34 - "DayLedger"
Cohesion: 0.33
Nodes (5): DayResult, CustomerReview, DayLedger, ShareCardEngine, renderSummaryModal()

### Community 35 - "upgradeEffects"
Cohesion: 0.29
Nodes (8): AUTO_LIFT_KITCHEN_LEVEL, bestOwned(), upgradeEffects, Upgrades, UpgradeBranch, bindUpgradesEvents(), effectsSummary(), renderUpgradesTab()

### Community 36 - "2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)"
Cohesion: 0.25
Nodes (7): 1. Ranh Giới Bất Di Bất Dịch (File Ownership Matrix), [26/09/2026 — 14:35 → 15:35] Phiên Giờ 1: Đưa Tokens & Sửa Lỗi Giao Diện, [26/09/2026 — 16:14 → 16:17] Triển Khai 4 Bộ Agent Skills, [26/09/2026 — 16:18 → 16:22] Giải Quyết Triệt Để 100% CSS Của `npm run ui:check`, 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log), 3. Tác Vụ Dự Kiến Tiếp Theo (Task Reservation & Lock), Nhật Ký Thực Thi & Điều Phối Multi-Agent — Gemini

### Community 37 - "StoryModal.ts"
Cohesion: 0.47
Nodes (4): STORY_ACTS, StoryEpisode, bindStoryEvents(), renderStoryModal()

## Knowledge Gaps
- **207 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 230 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu` connect `GameState` to `nhiem-vu-gio-1.md`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `vitest` connect `p0-fixes.test.ts` to `MenuTab.ts`, `GameState`, `sellingSim.ts`, `cookingEngine`, `package.json`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `GameState` connect `GameState` to `main.ts`, `audio.ts`, `AppController`, `reviewsEngine.ts`, `Story Bible v2 — Hẻm 1102`, `MenuTab.ts`, `sellingSim.ts`, `DayLedger`, `StoryModal.ts`, `upgradeEffects`, `p0-fixes.test.ts`, `orders.ts`, `day.ts`, `game.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `4. Danh sách màn hình` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `reviewsEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `GameState` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._