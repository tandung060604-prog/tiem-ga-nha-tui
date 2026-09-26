# Graph Report - TiemGaRan  (2026-09-27)

## Corpus Check
- 128 files · ~749,638 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 6, .bat 3, (none) 2)

## Summary
- 1078 nodes · 2505 edges · 70 communities (65 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `748e7f6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- 4. Danh sách màn hình
- AppController
- staff.test.ts
- Story Bible v2 — Hẻm 1102
- music.ts
- sellingSim.ts
- Brief asset hình ảnh — Tiệm Gà Nhà Tui
- Kế hoạch game: Tiệm Gà Nhà Tui
- compilerOptions
- 2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset
- cookingEngine
- package.json
- AudioManager
- Game Narrative Director — Tiệm Gà Nhà Tui
- stateManager
- 2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION)
- 2. Các Quyết Định UX & Giao Diện Chính
- parallel-agents.md
- p0-fixes.test.ts
- 2. Kết quả công việc: Việc xong & Việc chưa xong
- Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui
- HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI
- 3.3. Ma Trận 4 Đại Kết Cục (Endings):
- Yêu Cầu Markup (Gemini → Claude)
- Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)
- bao-cao-gio-1.md
- Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui
- Procedural Content Generator — Tiệm Gà Nhà Tui
- day.ts
- Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)
- SellingView.ts
- 04_TYPES_GAME_CONTRACT.ts
- reviewsEngine.ts
- Game Narrative Director — Tiệm Gà Nhà Tui
- Story Bible v2 — Hẻm 1102
- 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)
- Báo Cáo Kết Quả Thực Hiện — Giờ 2 (Gemini)
- 3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW)
- core/staff.ts
- daily-incidents.test.ts
- Nhiệm vụ Gemini — Giờ 2
- Review toàn diện & sửa lỗi — 26/09/2026 (tối)
- 11_CUSTOMERS_12_NHAN_VAT.ts
- Cân bằng lần 2 — đêm 27/09 (Claude)
- random
- cookingEngine
- stations.ts
- orders.ts
- GameState
- game.ts
- 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH
- Brief thiết kế giao diện — Tiệm Gà Nhà Tui
- mysteryBunny.ts
- 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)
- rng.ts
- upgradeEffects
- EconomyEngine
- 13_MENU_TAB_UI.ts
- ref_types_game
- KarmaState
- 3.3. Ma Trận 4 Đại Kết Cục (Endings):
- Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude
- Đợt 1 — Chương 1 (cần trước để làm vertical slice)
- MenuTab.ts
- Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini)
- 05_STATE_VA_VONG_LAP_NGAY.ts
- ensureBatches
- gemini-dem-27-09.md

## God Nodes (most connected - your core abstractions)
1. `GameState` - 53 edges
2. `AppController` - 45 edges
3. `cookingEngine` - 34 edges
4. `createInitialState()` - 32 edges
5. `audio` - 23 edges
6. `upgradeEffects` - 22 edges
7. `vitest` - 21 edges
8. `staffEffects` - 20 edges
9. `pick()` - 18 edges
10. `random()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `🎯 VAI TRÒ CỦA CLAUDE CHAT` --references--> `KarmaState`  [INFERRED]
  claude-review-pack/00_HUONG_DAN_CHO_CLAUDE_CHAT.md → src/types/game.ts
- `1. Bản Đồ Các Tệp Tin Trọng Tâm Cần Review` --references--> `KarmaState`  [INFERRED]
  claude-review-pack/01_DE_XUAT_GAMEPLAY_VA_ENDINGS.md → src/types/game.ts
- `4. Đề Xuất Phân Công Công Việc Tiếp Theo` --references--> `KarmaState`  [INFERRED]
  claude-review-pack/01_DE_XUAT_GAMEPLAY_VA_ENDINGS.md → src/types/game.ts
- `3. Bảng trạng thái / yêu cầu qua lại` --references--> `foodImage()`  [INFERRED]
  docs/phan-cong.md → src/content/assets.ts
- `3. Bảng nhân vật (chốt để tránh mâu thuẫn)` --references--> `CharacterGenerator`  [INFERRED]
  claude-review-pack/02_STORY_BIBLE_HEM_1102.md → src/content/characterGenerator.ts

## Import Cycles
- None detected.

## Communities (70 total, 5 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.15
Nodes (16): Quy tắc 3: Hiệp Thương Contract-First Qua `src/types/game.ts`, CHAPTER_PRICE_STEP, isAssemblyId(), isTimerStationId(), isSellingAction(), parseStationAction(), SELLING_ACTIONS, SellingAction (+8 more)

### Community 1 - "4. Danh sách màn hình"
Cohesion: 0.22
Nodes (9): 4.1 Header (dùng chung), 4.2 Chuẩn bị (Prep), 4.3 Mở bán (màn quan trọng nhất), 4.4 Tổng kết ngày (modal toàn màn), 4.5 Cảnh truyện (visual novel mini), 4.6 Thư Thỏ Cam, 4.7 Thẻ chia sẻ (ảnh xuất ra, 1080×1350), 4.8 Trang giới thiệu (landing.html) (+1 more)

### Community 2 - "AppController"
Cohesion: 0.13
Nodes (12): Đã làm, pickDailyIncident(), createCustomerSource(), makeDrink(), babble(), stopNarration(), normalizeShopName(), tutorialHint (+4 more)

### Community 3 - "staff.test.ts"
Cohesion: 0.20
Nodes (13): generateCandidate(), STAFF_ROLES_INFO, STAFF_TRAITS, recordHelperFry(), BASE_APP_COMMISSION, describeStaffEffect(), maxStaff(), severancePay() (+5 more)

### Community 4 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.14
Nodes (13): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 4. Tuyến theo chương, 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15), Chương 2 — Tiệm Trong Hẻm (ngày 16–50) (+5 more)

### Community 5 - "music.ts"
Cohesion: 0.15
Nodes (9): BASS, CHORDS, MELODY, Mode, MusicBox, narrate(), vietnameseVoice(), Voice (+1 more)

### Community 6 - "sellingSim.ts"
Cohesion: 0.11
Nodes (26): CLOSE_HOUR, DAY_REAL_MS, GAME_HOUR_MS, isRushHour(), isWeekend(), OFF_PEAK_HOURS, OPEN_HOUR, RUSH_HOURS (+18 more)

### Community 7 - "Brief asset hình ảnh — Tiệm Gà Nhà Tui"
Cohesion: 0.22
Nodes (9): 0. Cách giao file, 1. Phong cách chung (art bible), 2. Cấm (bắt buộc), 3. Kích thước chuẩn, 4. Danh sách asset, 5. Kiểm tra trước khi giao, Brief asset hình ảnh — Tiệm Gà Nhà Tui, Đợt 2 — Chương 2–3 (+1 more)

### Community 8 - "Kế hoạch game: Tiệm Gà Nhà Tui"
Cohesion: 0.12
Nodes (16): Core loop theo ngày và kinh tế, Kiến trúc kỹ thuật và cấu trúc repo, Kế hoạch game: Tiệm Gà Nhà Tui, Lộ trình phát triển và mở rộng, Menu (mở khóa theo chương), Menu, nâng cấp, nhân viên và đánh giá, Nguồn, Nhân viên và lương (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 10 - "2. Chi Tiết Prompt, Phong Cách & Kỹ Thuật Từng Asset"
Cohesion: 0.14
Nodes (13): 1. Danh Mục Asset Đã Tạo & Đường Dẫn Artifacts, 2.1. Linh vật Gà Bông (`mascot_gabong_sheet`), 2.2. Bé Thỏ Cam Mimi (`char_thocam_sheet`), 2.3. Bác Ba Tổ Trưởng (`char_bacba_sheet`), 2.4. Món Gà Giòn Nhà Tui (`food_crispy_chicken_perfect`), 2.5. Mockup Màn Hình Mở Bán (`mockup_mo_ban`), 2.6. Khoai Lắc Phô Mai (`food_shake_fries`), 2.7. Ly Soda Đá Không Logo (`food_soda`) (+5 more)

### Community 11 - "cookingEngine"
Cohesion: 0.08
Nodes (19): cookingEngine, CookingState, FRY_SPEED, missingItems(), nextFryTarget(), StaffHooks, tickStaff(), DrinkId (+11 more)

### Community 12 - "package.json"
Cohesion: 0.06
Nodes (29): devDependencies, playwright-core, sharp, tsx, @typesafe-ai/sdk, typescript, vite, vitest (+21 more)

### Community 14 - "Game Narrative Director — Tiệm Gà Nhà Tui"
Cohesion: 0.13
Nodes (14): 1.1. Cốt lõi cảm xúc (Emotional Core), 1.2. Thước đo thành công của câu chuyện, 1. Tinh Thần Cốt Truyện & Thế Giới Hẻm 1102, 2. Bảng Nhân Vật Hạt Nhân (12 Archetypes & Voice Matrix), 3. Lộ Trình Cốt Truyện 5 Chương (100k – 200k Chữ), 4. Chuẩn Kịch Bản Phân Nhánh (Branching Dialogue Format), 5. Quy Chuẩn Viết Thư Thỏ Cam (Mimi's Letters), 6. Quy Tắc Bất Di Bất Dịch (Golden Narrative Rules) (+6 more)

### Community 15 - "stateManager"
Cohesion: 0.29
Nodes (3): createInitialState(), migrateSave(), stateManager

### Community 16 - "2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION)"
Cohesion: 0.22
Nodes (8): 1. MA TRẬN PHÂN CHIA QUYỀN HẠN (RESPONSIBILITY MATRIX), 2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION), Dự Án: Tiệm Gà Nhà Tui (Anti IDE / AGY CLI Environment), Quy tắc 1: Auto-Proceed & Không Chặn Thao Tác, Quy tắc 2: Khóa Tác Vụ Qua Bảng Điều Phối (`docs/phan-cong.md`), Quy tắc 4: Tự Kiểm Chứng Cục Bộ Trước Khi Bàn Giao (Self-Verification Gate), Quy tắc 5: Nghiệm Thu Tối Cao Bởi Claude Lead, QUY ƯỚC ĐIỀU PHỐI MULTI-AGENT (3 GEMINI PRO & CLAUDE PROJECT LEAD)

### Community 17 - "2. Các Quyết Định UX & Giao Diện Chính"
Cohesion: 0.22
Nodes (8): 1. Quyết Định Quan Trọng Về Nhân Vật Bé Thỏ Cam (Mimi), 2.1. Thumb-Zone (Vùng Một Ngón Cái 40% Dưới Màn Hình), 2.2. Hệ Thống Màu & Tương Phản WCAG AA, 2.3. Kiểu Chữ (Typography), 2.4. Hiệu Năng & Animation, 2. Các Quyết Định UX & Giao Diện Chính, 3. Danh Mục File Giao Nộp, Ghi Chú Thiết Kế UI & Kiến Trúc Thị Giác — Tiệm Gà Nhà Tui

### Community 19 - "p0-fixes.test.ts"
Cohesion: 0.24
Nodes (18): audio, addStock(), ageOneDay(), canUnlockIngredient(), consumeStock(), ensureBatches(), isIngredientUnlocked(), refundableUnits() (+10 more)

### Community 20 - "2. Kết quả công việc: Việc xong & Việc chưa xong"
Cohesion: 0.22
Nodes (9): 1. Danh sách file đã tạo và chỉnh sửa, 2. Kết quả công việc: Việc xong & Việc chưa xong, 3. Yêu cầu Markup gửi Claude, Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35), File CSS chỉnh sửa (Đưa Tokens & Components vào game):, File tài liệu & Asset đã tạo/cập nhật:, TRIỂN KHAI 4 BỘ SKILLS CHO MULTI-AGENT (GEMINI & CLAUDE):, VIỆC ĐÃ HOÀN THÀNH: (+1 more)

### Community 21 - "Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui"
Cohesion: 0.15
Nodes (12): 1. Triết Lý Vòng Lặp Trò Chơi (Core Game Loop), 2.1. Cấu trúc Sổ Sách Tài Chính (Ledger Formula), 2.2. Biên Lợi Nhuận Mục Tiêu Theo Món (Margin Target), 2. Mô Hình Dòng Tiền & Thuật Toán Kinh Tế (Economy Flow), 3.1. 4 Vùng Đánh Giá Chất Lượng Chiên (Cooking Quality Zones), 3.2. Vòng Đời Của Dầu Chiên (Oil Degradation), 3. Cơ Chế Trạm Bếp & Minigame Chiên Gà, 4. Hệ Thống Nhân Viên & Quản Lý Tâm Trạng (Staff System) (+4 more)

### Community 22 - "HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI"
Cohesion: 0.50
Nodes (3): 1. Phân Công Trách Nhiệm Khi Chạy Song Song Cùng Gemini (Anti IDE), 2. Graphify Knowledge Graph, HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI

### Community 23 - "3.3. Ma Trận 4 Đại Kết Cục (Endings):"
Cohesion: 0.22
Nodes (9): 3.1. Hệ Thống 3 Chỉ Số Nghiệp Cảm Ẩn (Karma Metrics):, 3.2. Hiệu Ứng Cánh Bướm Tác Động Quá Khứ & Tương Lai:, 3.3. Ma Trận 4 Đại Kết Cục (Endings):, 3. Kiến Trúc Hội Thoại Phân Nhánh & Ma Trận Đa Kết Thúc (Multi-Ending), 💀 Bad Ending 3A: "Cửa Cuốn Đóng Lại" (Phá Sản), 💔 Bad Ending 3B: "Cỗ Máy Gà Vô Hồn" (Mất Chất Thương Mại), 🏆 Ending 1: Happy Ending — "Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ" (Đại Viên Mãn), 🌱 Ending 2: Open Ending — "Gió Hẻm Thổi Mãi" (Bình Dị An Yên) (+1 more)

### Community 24 - "Yêu Cầu Markup (Gemini → Claude)"
Cohesion: 0.18
Nodes (10): 1. Màn Bán Hàng (SellingView.ts), 2. Màn Tổng Kết (SummaryModal.ts), 3. Quản Lý Kho & Nguyên Liệu (InventoryTab.ts), 4. Màn Hình 5 Đại Kết Cục (Multi-Ending Modal), Mẫu 1: Dòng nguyên liệu đã mở khóa (kèm nút `-5` hoàn tiền), Mẫu 2: Dòng nguyên liệu bị khóa phân tầng, Yêu Cầu Markup (Gemini → Claude), Đề xuất 1: Chuyển đổi cập nhật vị trí kim đo sang CSS Transform (Tùy chọn P2) (+2 more)

### Community 25 - "Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)"
Cohesion: 0.33
Nodes (6): Lỗi hình ảnh cần sửa (xem `screenshots/ban-hang-390px.png`), Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35), Ràng buộc bắt buộc (đã gây lỗi thật, Claude vừa sửa, bản `components.css` của bạn đang làm hỏng lại), Việc 1 — Tạo file ảnh thật cho Đợt 1 (ưu tiên cao nhất), Việc 2 — Đưa `design-tokens.css` + `components.css` vào game, Việc 3 — Báo cáo (10 phút cuối)

### Community 26 - "bao-cao-gio-1.md"
Cohesion: 0.24
Nodes (4): 1. Ranh giới file (không sửa file của bên kia), 2. Việc của mỗi bên trong giờ này, 4. Báo cáo cuối giờ, Phân công Claude ↔ Gemini

### Community 27 - "Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui"
Cohesion: 0.17
Nodes (11): 1. Triết Lý "Juice It Or Lose It", 2.1. Phân bổ màn hình dọc 9:16 (390×844pt), 2.2. Kích thước chạm an toàn (Target Size), 2. Quy Chuẩn Vùng Ngón Cái (Thumb-Zone Ergonomics), 3. Bảng Tra Cứu Hiệu Ứng Chuyển Động (Animation Tokens), 4. Haptic Feedback Matrix (Rung Xúc Giác), 5. Bong Bóng Suy Nghĩ Realtime (Customer Thoughts System), 6. Biểu Đồ Radar SVG 5 Tiêu Chí (Summary Radar Chart) (+3 more)

### Community 28 - "Procedural Content Generator — Tiệm Gà Nhà Tui"
Cohesion: 0.22
Nodes (8): 1. Công Thức Đặt Tên Thực Khách Sài Gòn (Naming Formula), 2. Hệ Thống Ghép Tầng Ngoại Hình (Modular Visual Generation), 3. Ngân Hàng Câu Thoại Ngữ Cảnh (Contextual Dialogue Bank), 4. Cơ Chế Khách Bí Ẩn & Chuỗi Nhiệm Vụ (Mystery Quests), 5. Quy Chuẩn Sinh Review GenZ Hài Hước (Viral Review Generator), Các nhóm danh xưng phổ biến:, Cấu trúc Quest:, Procedural Content Generator — Tiệm Gà Nhà Tui

### Community 29 - "day.ts"
Cohesion: 0.13
Nodes (20): RANDOM_EVENTS, assembleAtCounter(), BA_BA_AID_MONEY, BUNNY_VISIT_TIP, creditSale(), FAST_SERVICE_TIP, INSPECTION_FINE, PERFECT_TIP (+12 more)

### Community 30 - "Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)"
Cohesion: 0.40
Nodes (5): Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05), Bổ sung sau giờ 1 (theo quyết định của chủ dự án, xong 16:17), Cần bạn quyết, Kết quả kiểm chứng cuối giờ, Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

### Community 31 - "SellingView.ts"
Cohesion: 0.08
Nodes (42): ref_node_fs, ASSETS, foodImage(), stationOpen(), music, DEFAULT_SHOP_NAME, SHOP_NAME_MAX, SHOP_NAME_SUGGESTIONS (+34 more)

### Community 32 - "04_TYPES_GAME_CONTRACT.ts"
Cohesion: 0.09
Nodes (22): BaseMenuItemId, Chapter, Criteria, CustomerOrder, CustomerReview, DayLedger, GameEvent, GamePhase (+14 more)

### Community 33 - "reviewsEngine.ts"
Cohesion: 0.05
Nodes (43): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 5. Tối ưu UI/UX (P2), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện (+35 more)

### Community 34 - "Game Narrative Director — Tiệm Gà Nhà Tui"
Cohesion: 0.13
Nodes (14): 1.1. Cốt lõi cảm xúc (Emotional Core), 1.2. Thước đo thành công của câu chuyện, 1. Tinh Thần Cốt Truyện & Thế Giới Hẻm 1102, 2. Bảng Nhân Vật Hạt Nhân (12 Archetypes & Voice Matrix), 3. Lộ Trình Cốt Truyện 5 Chương (100k – 200k Chữ), 4. Chuẩn Kịch Bản Phân Nhánh (Branching Dialogue Format), 5. Quy Chuẩn Viết Thư Thỏ Cam (Mimi's Letters), 6. Quy Tắc Bất Di Bất Dịch (Golden Narrative Rules) (+6 more)

### Community 35 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.14
Nodes (13): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 4. Tuyến theo chương, 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15), Chương 2 — Tiệm Trong Hẻm (ngày 16–50) (+5 more)

### Community 36 - "2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)"
Cohesion: 0.22
Nodes (8): 1. Ranh Giới Bất Di Bất Dịch (File Ownership Matrix), [26/09/2026 — 14:35 → 15:35] Phiên Giờ 1: Đưa Tokens & Sửa Lỗi Giao Diện, [26/09/2026 — 16:14 → 16:17] Triển Khai 4 Bộ Agent Skills, [26/09/2026 — 16:18 → 16:22] Giải Quyết Triệt Để 100% CSS Của `npm run ui:check`, [26/09/2026 — 16:27 → 16:30] Hoàn Thành Bộ Asset Món Ăn Đợt 1 (Pipeline Nền Trong Suốt), 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log), 3. Tác Vụ Dự Kiến Tiếp Theo (Task Reservation & Lock), Nhật Ký Thực Thi & Điều Phối Multi-Agent — Gemini

### Community 37 - "Báo Cáo Kết Quả Thực Hiện — Giờ 2 (Gemini)"
Cohesion: 0.18
Nodes (10): 1.1. Asset Gốc & Pipeline Tách Nền (`assets-src/` & `public/assets/`), 1.2. CSS Giao Diện & Visual Components, 1. Danh Sách File Đã Tạo & Sửa Đổi, 2.1. Lệnh 1: `npm run assets`, 2.2. Lệnh 2: `npm run ui:check -- http://localhost:3000`, 2.3. Lệnh 3: `npx vitest run`, 2. Kết Quả Nghiệm Thu Bằng 3 Lệnh Bắt Buộc, 3. Việc Chưa Xong & Lý Do (Tường Trình Chi Tiết) (+2 more)

### Community 38 - "3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW)"
Cohesion: 0.18
Nodes (10): 1. SƠ ĐỒ PHÂN VAI & RANH GIỚI TRÁCH NHIỆM (RESPONSIBILITY MATRIX), 2. CÁCH KHỞI ĐỘNG 3 TÀI KHOẢN GEMINI RIÊNG BIỆT, 3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW), 📌 Bước 1: Giao Task & Khóa Phạm Vi (Lock & Brief), ⚡ Bước 2: Chạy Tác Vụ Song Song Độc Lập (Parallel Execution), 🔍 Bước 3: Tự Kiểm Chứng Cục Bộ (Self-Verification), 🤝 Bước 4: Đồng Bộ & Bàn Giao (Handoff), 👑 Bước 5: Claude Audit & Quyết Định Phê Duyệt (Claude Lead Review) (+2 more)

### Community 39 - "core/staff.ts"
Cohesion: 0.11
Nodes (22): FryType, Sauce, endShiftForStaff(), extraTraySlots(), FRY_LOOK, FRY_RECIPES, fryingItemId(), FryRecipe (+14 more)

### Community 40 - "daily-incidents.test.ts"
Cohesion: 0.30
Nodes (11): 3. Bảng trạng thái / yêu cầu qua lại, DAILY_INCIDENTS, getIncidentById(), hasSecurityStaff(), IncidentResolutionResult, resolveIncidentChoice(), DailyIncident, IncidentChoice (+3 more)

### Community 41 - "Nhiệm vụ Gemini — Giờ 2"
Cohesion: 0.33
Nodes (5): Nhiệm vụ Gemini — Giờ 2, Việc 1 — Asset Đợt 1 còn thiếu (ưu tiên), Việc 2 — CSS cho class mới Claude đã thêm, Việc 3 — Chuẩn bị giao diện cho bước tiếp theo của Claude (truyện + qua chương), Việc 4 — Báo cáo

### Community 42 - "Review toàn diện & sửa lỗi — 26/09/2026 (tối)"
Cohesion: 0.13
Nodes (13): Chất game: âm thanh, tiếng, Chống gian lận, Gameplay (đo bằng `npm run sim`), iOS, Jev, Kiểm chứng, Lỗi nghiêm trọng đã sửa, Review toàn diện & sửa lỗi — 26/09/2026 (tối) (+5 more)

### Community 43 - "11_CUSTOMERS_12_NHAN_VAT.ts"
Cohesion: 0.50
Nodes (3): CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer

### Community 44 - "Cân bằng lần 2 — đêm 27/09 (Claude)"
Cohesion: 0.25
Nodes (7): Cân bằng lần 2 — đêm 27/09 (Claude), Kết quả (`npm run sim -- --days 330 --seeds 5 --policy 3`, có nâng cấp + nhân viên), Kết quả (trung vị ngày qua Chương 1; GDD: ngày 15), Mô phỏng cân bằng — 26/09/2026, Thay đổi, Vấn đề, Vấn đề thiết kế còn lại (không chỉnh bằng số được)

### Community 46 - "random"
Cohesion: 0.20
Nodes (11): perfectTip(), regularCustomer(), serveFirstOrder(), OrdersEngine, current, random(), weightedPick(), TickContext (+3 more)

### Community 48 - "stations.ts"
Cohesion: 0.21
Nodes (13): INITIAL_MENU, pullTimerStation(), ASSEMBLY_RECIPES, AssemblyRecipe, collectTimer(), DrinkRecipe, emptyTimerStations(), tickTimers() (+5 more)

### Community 49 - "orders.ts"
Cohesion: 0.19
Nodes (10): 3. Bảng nhân vật (chốt để tránh mâu thuẫn), 3. Bảng nhân vật (chốt để tránh mâu thuẫn), ARCHETYPE_CONFIG, CharacterGenerator, CustomerArchetype, ModularCharacter, SERVABLE_IDS, pick() (+2 more)

### Community 50 - "GameState"
Cohesion: 0.07
Nodes (51): vitest, CHAPTERS, applyKarmaChange(), BANKRUPTCY_DEBT_DAYS, evaluateEnding(), FINALE_CHAPTER, finaleReady(), STORY_ENDINGS (+43 more)

### Community 51 - "game.ts"
Cohesion: 0.18
Nodes (11): DayResult, Chapter, CustomerReview, DayLedger, GamePhase, Station, StockBatch, StoryEnding (+3 more)

### Community 52 - "2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH"
Cohesion: 0.15
Nodes (12): 1. TỔNG QUAN KẾT QUẢ ĐẠT ĐƯỢC, 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH, 3. DANH SÁCH ẢNH CHỤP KIỂM THỬ TRỰC QUAN (`ui-check-out/`), 4. BẢNG TỔNG HỢP KIỂM TRA CHẤT LƯỢNG (QUALITY GATES), 5. TÌNH TRẠNG HIỆN TẠI & BÀN GIAO CHO CLAUDE LEAD, BÁO CÁO TỔNG KẾT CA ĐÊM 27/09/2026, G0. Hoàn tất giao diện Sự Cố & Máy Nước Ngọt Fanta (Commit `02b2927`), G1. Nén ảnh Assets $\le 4\text{MB}$ & Mọi PNG $\le 40\text{KB}$ (Commit `7e207ef`) (+4 more)

### Community 53 - "Brief thiết kế giao diện — Tiệm Gà Nhà Tui"
Cohesion: 0.29
Nodes (7): 0. Bạn cần giao lại gì, 1. Sản phẩm là gì, 2. Hệ thống thị giác hiện có (giữ và mở rộng), 3. Nguyên tắc UX bắt buộc, 5. Class CSS đang có (giữ nguyên tên), 6. Ràng buộc kỹ thuật, Brief thiết kế giao diện — Tiệm Gà Nhà Tui

### Community 54 - "mysteryBunny.ts"
Cohesion: 0.22
Nodes (10): BUNNY_LETTERS, BUNNY_RANDOM_VISIT_NOTES, BunnyLetter, MYSTERY_QUESTS, MysteryGuestQuest, StoryTrigger, Criteria, bindBunnyModalEvents() (+2 more)

### Community 55 - "2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)"
Cohesion: 0.17
Nodes (11): 1. THÔNG SỐ KHUNG CANVAS TỔNG THỂ, 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI), 3. CÔNG THỨC SINH DANH HIỆU TỰ ĐỘNG (DỰA TRÊN STATE), Khu vực 1: Mái hiên sọc đỏ - trắng K-Chicken (Y: 16 → 46), Khu vực 2: Header Quán & Huy Hiệu Chương (Y: 60 → 170), Khu vực 3: Tiêu đề Báo Cáo & Danh Hiệu Vinh Danh (Y: 190 → 360), Khu vực 4: Lưới 4 Thẻ Chỉ Số Vàng (2×2 Hero Stats Grid) (Y: 415 → 765), Khu vực 5: Món Ăn 'Ruột' Spotlight & Review Viral (Y: 780 → 980) (+3 more)

### Community 56 - "rng.ts"
Cohesion: 0.29
Nodes (7): INITIAL_CANDIDATES, mentionsStoryCharacter(), STORY_CHARACTER_NAMES, createRng(), Rng, seedRandom(), offenders()

### Community 57 - "upgradeEffects"
Cohesion: 0.22
Nodes (9): INITIAL_UPGRADES, AUTO_LIFT_KITCHEN_LEVEL, bestOwned(), capacitySlots(), MAX_PRICE_PREMIUM_PCT, SELF_SERVE_OPERATIONS_LEVEL, upgradeEffects, Upgrades (+1 more)

### Community 58 - "EconomyEngine"
Cohesion: 0.22
Nodes (3): EconomyEngine, ref_clock, ref_upgrades

### Community 59 - "13_MENU_TAB_UI.ts"
Cohesion: 0.20
Nodes (4): ref_content_assets, ref_content_customers, ref_core_audio, ref_core_inventory

### Community 60 - "ref_types_game"
Cohesion: 0.22
Nodes (6): CookingState, Sauce, INITIAL_INVENTORY, INITIAL_MENU, ref_audio, ref_types_game

### Community 61 - "KarmaState"
Cohesion: 0.25
Nodes (8): 1. Bản Đồ Các Tệp Tin Trọng Tâm Cần Review, 2.1. Nút Hoàn Trả / Giảm Mua (`-5`) Trong Màn Chuẩn Bị:, 2.2. Phân Tầng Mở Khóa Nguyên Liệu (Progression Pacing):, 2. Đề Xuất Cải Tiến Logic Gameplay (Phản Hồi Người Dùng), 4. Đề Xuất Phân Công Công Việc Tiếp Theo, Dossier Đề Xuất Gameplay Logic & Hệ Thống Đa Kết Thúc (Multi-Ending), Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude, KarmaState

### Community 62 - "3.3. Ma Trận 4 Đại Kết Cục (Endings):"
Cohesion: 0.22
Nodes (9): 3.1. Hệ Thống 3 Chỉ Số Nghiệp Cảm Ẩn (Karma Metrics):, 3.2. Hiệu Ứng Cánh Bướm Tác Động Quá Khứ & Tương Lai:, 3.3. Ma Trận 4 Đại Kết Cục (Endings):, 3. Kiến Trúc Hội Thoại Phân Nhánh & Ma Trận Đa Kết Thúc (Multi-Ending), 💀 Bad Ending 3A: "Cửa Cuốn Đóng Lại" (Phá Sản), 💔 Bad Ending 3B: "Cỗ Máy Gà Vô Hồn" (Mất Chất Thương Mại), 🏆 Ending 1: Happy Ending — "Bếp Lửa Hẻm 1102 & Chuỗi Gà Tri Kỷ" (Đại Viên Mãn), 🌱 Ending 2: Open Ending — "Gió Hẻm Thổi Mãi" (Bình Dị An Yên) (+1 more)

### Community 63 - "Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude"
Cohesion: 0.25
Nodes (7): 1. Bản Đồ Các Tệp Tin Trọng Tâm Cần Review, 2.1. Nút Hoàn Trả / Giảm Mua (`-5`) Trong Màn Chuẩn Bị:, 2.2. Phân Tầng Mở Khóa Nguyên Liệu (Progression Pacing):, 2. Đề Xuất Cải Tiến Logic Gameplay (Phản Hồi Người Dùng), 4. Đề Xuất Phân Công Công Việc Tiếp Theo, Dossier Đề Xuất Gameplay Logic & Hệ Thống Đa Kết Thúc (Multi-Ending), Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude

### Community 64 - "Đợt 1 — Chương 1 (cần trước để làm vertical slice)"
Cohesion: 0.25
Nodes (8): 4.1 Linh vật & nhân vật chính, 4.2 Khách ngẫu nhiên (hệ ghép phần), 4.3 Món ăn chương 1 (256×256), 4.4 Bếp & quầy chương 1, 4.5 Icon UI (128×128, cùng nét viền), 4.6 Hiệu ứng (sprite sheet ngang, mỗi khung 256×256, 6–8 khung), 4.7 Giấy thư Thỏ Cam, Đợt 1 — Chương 1 (cần trước để làm vertical slice)

### Community 65 - "MenuTab.ts"
Cohesion: 0.33
Nodes (5): CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer, bindMenuEvents(), renderMenuTab()

### Community 66 - "Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini)"
Cohesion: 0.33
Nodes (5): 📂 DANH MỤC TỆP TIN TRONG GÓI REVIEW NÀY, Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini), HƯỚNG DẪN REVIEW TOÀN DIỆN CHO CLAUDE CHAT (CLAUDE.AI), 🎯 VAI TRÒ CỦA CLAUDE CHAT, 💬 YÊU CẦU ĐẦU RA CHO CLAUDE CHAT:

### Community 67 - "05_STATE_VA_VONG_LAP_NGAY.ts"
Cohesion: 0.33
Nodes (5): ref_content_inventory, ref_content_menu, ref_content_staff, ref_content_upgrades, ref_inventory

### Community 68 - "ensureBatches"
Cohesion: 0.80
Nodes (5): addStock(), ageOneDay(), consumeStock(), ensureBatches(), sync()

## Knowledge Gaps
- **396 isolated node(s):** `NonEmpty`, `GamePhase`, `QualityRating`, `OilCondition`, `BaseMenuItemId` (+391 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 475 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `KarmaState` connect `KarmaState` to `Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini)`, `daily-incidents.test.ts`, `GameState`, `game.ts`, `Tiệm Gà Nhà Tui — Trao Đổi Song Song Gemini ➔ Claude`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `vitest` connect `GameState` to `staff.test.ts`, `sellingSim.ts`, `daily-incidents.test.ts`, `cookingEngine`, `package.json`, `stations.ts`, `p0-fixes.test.ts`, `rng.ts`, `SellingView.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `3. Bảng trạng thái / yêu cầu qua lại` connect `daily-incidents.test.ts` to `main.ts`, `AppController`, `GameState`, `game.ts`, `bao-cao-gio-1.md`, `KarmaState`, `SellingView.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `NonEmpty`, `GamePhase`, `QualityRating` to the rest of the system?**
  _396 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppController` be split into smaller, more focused modules?**
  _Cohesion score 0.12928022361984626 - nodes in this community are weakly interconnected._
- **Should `Story Bible v2 — Hẻm 1102` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `music.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._