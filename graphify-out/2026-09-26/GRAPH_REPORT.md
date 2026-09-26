# Graph Report - TiemGaRan  (2026-09-26)

## Corpus Check
- 69 files · ~169,148 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 6, (none) 2, .example 1)

## Summary
- 527 nodes · 1122 edges · 31 communities (28 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- main.ts
- 4. Danh sách màn hình
- AppController
- game.ts
- Story Bible v2 — Hẻm 1102
- GameState
- Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu
- Đợt 1 — Chương 1 (cần trước để làm vertical slice)
- Kế hoạch game: Tiệm Gà Nhà Tui
- compilerOptions
- 2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset
- cookingEngine
- package.json
- AudioManager
- Game Narrative Director — Tiệm Gà Nhà Tui
- clock.ts
- 2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES)
- 2. Các Quyết Định UX & Giao Diện Chính
- parallel-agents.md
- p0-fixes.test.ts
- Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35)
- Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui
- HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI
- 1. Màn Bán Hàng (SellingView.ts)
- Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)
- Phân công Claude ↔ Gemini
- Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui
- Procedural Content Generator — Tiệm Gà Nhà Tui
- 4. Tuyến theo chương
- Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)

## God Nodes (most connected - your core abstractions)
1. `GameState` - 35 edges
2. `AppController` - 34 edges
3. `cookingEngine` - 23 edges
4. `compilerOptions` - 17 edges
5. `pick()` - 16 edges
6. `upgradeEffects` - 15 edges
7. `audio` - 14 edges
8. `createInitialState()` - 14 edges
9. `stateManager` - 13 edges
10. `CustomerOrder` - 13 edges

## Surprising Connections (you probably didn't know these)
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  docs/01-review-va-ke-hoach.md → src/core/reviewsEngine.ts
- `5. Cách trình bày trong game` --references--> `GameState`  [INFERRED]
  docs/02-story-bible-v2.md → src/types/game.ts
- `3. Bảng nhân vật (chốt để tránh mâu thuẫn)` --references--> `CharacterGenerator`  [INFERRED]
  docs/02-story-bible-v2.md → src/content/characterGenerator.ts
- `Đã làm` --references--> `pick()`  [INFERRED]
  docs/bao-cao/claude-gio-1.md → src/core/rng.ts
- `Đã làm` --references--> `migrateSave()`  [INFERRED]
  docs/bao-cao/claude-gio-1.md → src/core/state.ts

## Import Cycles
- None detected.

## Communities (31 total, 3 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.08
Nodes (35): ref_node_fs, ASSETS, CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer, MYSTERY_QUESTS, MysteryGuestQuest, STORY_ACTS (+27 more)

### Community 1 - "4. Danh sách màn hình"
Cohesion: 0.12
Nodes (16): 0. Bạn cần giao lại gì, 1. Sản phẩm là gì, 2. Hệ thống thị giác hiện có (giữ và mở rộng), 3. Nguyên tắc UX bắt buộc, 4.1 Header (dùng chung), 4.2 Chuẩn bị (Prep), 4.3 Mở bán (màn quan trọng nhất), 4.4 Tổng kết ngày (modal toàn màn) (+8 more)

### Community 2 - "AppController"
Cohesion: 0.19
Nodes (4): Đã làm, SellingSession, AppController, assertNever()

### Community 3 - "game.ts"
Cohesion: 0.09
Nodes (27): RANDOM_EVENTS, CUST_AVATARS, GENZ_REVIEW_TEMPLATES, GENZ_USERNAMES, ReviewTemplate, INITIAL_UPGRADES, ReviewsEngine, AUTO_LIFT_KITCHEN_LEVEL (+19 more)

### Community 4 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.22
Nodes (8): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 3. Bảng nhân vật (chốt để tránh mâu thuẫn), 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Danh tính Thỏ Cam (lộ diện chương 5), Story Bible v2 — Hẻm 1102

### Community 5 - "GameState"
Cohesion: 0.14
Nodes (17): vitest, INITIAL_INVENTORY, INITIAL_CANDIDATES, addStock(), ageOneDay(), consumeStock(), ensureBatches(), sync() (+9 more)

### Community 6 - "Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu"
Cohesion: 0.12
Nodes (16): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 5. Tối ưu UI/UX (P2), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện (+8 more)

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
Cohesion: 0.11
Nodes (16): foodImage(), isRushHour(), cookingEngine, CookingState, Sauce, OilCondition, QualityRating, TrayItem (+8 more)

### Community 12 - "package.json"
Cohesion: 0.08
Nodes (24): devDependencies, playwright-core, sharp, @typesafe-ai/sdk, typescript, vite, vitest, name (+16 more)

### Community 14 - "Game Narrative Director — Tiệm Gà Nhà Tui"
Cohesion: 0.13
Nodes (14): 1.1. Cốt lõi cảm xúc (Emotional Core), 1.2. Thước đo thành công của câu chuyện, 1. Tinh Thần Cốt Truyện & Thế Giới Hẻm 1102, 2. Bảng Nhân Vật Hạt Nhân (12 Archetypes & Voice Matrix), 3. Lộ Trình Cốt Truyện 5 Chương (100k – 200k Chữ), 4. Chuẩn Kịch Bản Phân Nhánh (Branching Dialogue Format), 5. Quy Chuẩn Viết Thư Thỏ Cam (Mimi's Letters), 6. Quy Tắc Bất Di Bất Dịch (Golden Narrative Rules) (+6 more)

### Community 15 - "clock.ts"
Cohesion: 0.11
Nodes (25): CHAPTERS, CLOSE_HOUR, DAY_REAL_MS, GAME_HOUR_MS, isWeekend(), OFF_PEAK_HOURS, OPEN_HOUR, RUSH_HOURS (+17 more)

### Community 16 - "2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES)"
Cohesion: 0.22
Nodes (8): 1. PHÂN CHIA QUYỀN HẠN & VAI TRÒ (RESPONSIBILITY MATRIX), 2. QUY TẮC BẤT DI BẤT DỊCH ĐỂ TRÁNH XUNG ĐỘT (GOLDEN RULES), Anti IDE Project: Tiệm Gà Nhà Tui, Quy tắc 1: Không can thiệp chéo thư mục (File Ownership Isolation), Quy tắc 2: Giao tiếp "Contract-First" qua `src/types/game.ts`, Quy tắc 3: Quản lý tiến trình & Dev Server trong Anti IDE, Quy tắc 4: Đồng bộ kiến thức qua MCP Memory Server, QUY ƯỚC LÀM VIỆC SONG SONG CHO MULTI-AGENT (GEMINI & CLAUDE)

### Community 17 - "2. Các Quyết Định UX & Giao Diện Chính"
Cohesion: 0.22
Nodes (8): 1. Quyết Định Quan Trọng Về Nhân Vật Bé Thỏ Cam (Mimi), 2.1. Thumb-Zone (Vùng Một Ngón Cái 40% Dưới Màn Hình), 2.2. Hệ Thống Màu & Tương Phản WCAG AA, 2.3. Kiểu Chữ (Typography), 2.4. Hiệu Năng & Animation, 2. Các Quyết Định UX & Giao Diện Chính, 3. Danh Mục File Giao Nộp, Ghi Chú Thiết Kế UI & Kiến Trúc Thị Giác — Tiệm Gà Nhà Tui

### Community 19 - "p0-fixes.test.ts"
Cohesion: 0.11
Nodes (23): ARCHETYPE_CONFIG, CharacterGenerator, CustomerArchetype, ModularCharacter, INITIAL_MENU, BUNNY_LETTERS, BUNNY_RANDOM_VISIT_NOTES, BunnyLetter (+15 more)

### Community 20 - "Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35)"
Cohesion: 0.25
Nodes (8): 1. Danh sách file đã tạo và chỉnh sửa, 2. Kết quả công việc: Việc xong & Việc chưa xong, 3. Yêu cầu Markup gửi Claude, Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35), File CSS chỉnh sửa (Đưa Tokens & Components vào game):, File tài liệu & Asset đã tạo/cập nhật:, VIỆC CHƯA HOÀN THÀNH (NÓI RÕ LÝ DO KỸ THUẬT):, VIỆC ĐÃ HOÀN THÀNH:

### Community 21 - "Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui"
Cohesion: 0.15
Nodes (12): 1. Triết Lý Vòng Lặp Trò Chơi (Core Game Loop), 2.1. Cấu trúc Sổ Sách Tài Chính (Ledger Formula), 2.2. Biên Lợi Nhuận Mục Tiêu Theo Món (Margin Target), 2. Mô Hình Dòng Tiền & Thuật Toán Kinh Tế (Economy Flow), 3.1. 4 Vùng Đánh Giá Chất Lượng Chiên (Cooking Quality Zones), 3.2. Vòng Đời Của Dầu Chiên (Oil Degradation), 3. Cơ Chế Trạm Bếp & Minigame Chiên Gà, 4. Hệ Thống Nhân Viên & Quản Lý Tâm Trạng (Staff System) (+4 more)

### Community 22 - "HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI"
Cohesion: 0.50
Nodes (3): 1. Phân Công Trách Nhiệm Khi Chạy Song Song Cùng Gemini (Anti IDE), 2. Graphify Knowledge Graph, HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI

### Community 24 - "1. Màn Bán Hàng (SellingView.ts)"
Cohesion: 0.29
Nodes (6): 1. Màn Bán Hàng (SellingView.ts), 2. Màn Tổng Kết (SummaryModal.ts), Yêu Cầu Markup (Gemini → Claude), Đề xuất 1: Chuyển đổi cập nhật vị trí kim đo sang CSS Transform (Tùy chọn P2), Đề xuất 2: Gắn thêm `data-action` cho event delegation, Đề xuất: Chuẩn bị container cho biểu đồ Radar SVG 5 tiêu chí

### Community 25 - "Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)"
Cohesion: 0.33
Nodes (6): Lỗi hình ảnh cần sửa (xem `screenshots/ban-hang-390px.png`), Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35), Ràng buộc bắt buộc (đã gây lỗi thật, Claude vừa sửa, bản `components.css` của bạn đang làm hỏng lại), Việc 1 — Tạo file ảnh thật cho Đợt 1 (ưu tiên cao nhất), Việc 2 — Đưa `design-tokens.css` + `components.css` vào game, Việc 3 — Báo cáo (10 phút cuối)

### Community 26 - "Phân công Claude ↔ Gemini"
Cohesion: 0.40
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
Cohesion: 0.50
Nodes (4): Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05), Cần bạn quyết, Kết quả kiểm chứng cuối giờ, Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

## Knowledge Gaps
- **193 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+188 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 214 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu` connect `Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu` to `bao-cao-gio-1.md`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `vitest` connect `GameState` to `main.ts`, `p0-fixes.test.ts`, `package.json`, `clock.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Đã làm` connect `AppController` to `p0-fixes.test.ts`, `GameState`, `Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _193 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08078431372549019 - nodes in this community are weakly interconnected._
- **Should `4. Danh sách màn hình` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._