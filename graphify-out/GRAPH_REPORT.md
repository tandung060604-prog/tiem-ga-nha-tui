# Graph Report - TiemGaRan  (2026-09-27)

## Corpus Check
- 131 files · ~751,976 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 6, .bat 3, (none) 2)

## Summary
- 1096 nodes · 2598 edges · 65 communities (59 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5bd13a2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- save-and-name.test.ts
- 4. Danh sách màn hình
- AppController
- cooking.ts
- Story Bible v2 — Hẻm 1102
- StoryModal.ts
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
- state.ts
- 2. Kết quả công việc: Việc xong & Việc chưa xong
- Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui
- HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI
- KarmaState
- Yêu Cầu Markup (Gemini → Claude)
- Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)
- bao-cao-gio-1.md
- Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui
- Procedural Content Generator — Tiệm Gà Nhà Tui
- SellingView.ts
- Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)
- day.ts
- 04_TYPES_GAME_CONTRACT.ts
- Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu
- Game Narrative Director — Tiệm Gà Nhà Tui
- Story Bible v2 — Hẻm 1102
- 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)
- Báo Cáo Kết Quả Thực Hiện — Giờ 2 (Gemini)
- 3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW)
- core/staff.ts
- review-fixes-2709.test.ts
- Nhiệm vụ Gemini — Giờ 2
- Review toàn diện & sửa lỗi — 26/09/2026 (tối)
- 11_CUSTOMERS_12_NHAN_VAT.ts
- Cân bằng lần 2 — đêm 27/09 (Claude)
- MusicBox
- cookingEngine
- reviewsEngine.ts
- DayLedger
- GameState
- audio.ts
- 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH
- Brief thiết kế giao diện — Tiệm Gà Nhà Tui
- main.ts
- 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)
- Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu
- game.ts
- assets.ts
- CustomerOrder
- UpgradesTab.ts
- 5. Tối ưu UI/UX (P2)
- Đợt 1 — Chương 1 (cần trước để làm vertical slice)
- MenuTab.ts
- gemini-dem-27-09.md

## God Nodes (most connected - your core abstractions)
1. `GameState` - 53 edges
2. `AppController` - 47 edges
3. `cookingEngine` - 34 edges
4. `createInitialState()` - 34 edges
5. `audio` - 24 edges
6. `vitest` - 23 edges
7. `upgradeEffects` - 22 edges
8. `staffEffects` - 20 edges
9. `pick()` - 18 edges
10. `random()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  claude-review-pack/03_GDD_KE_HOACH_TONG_QUAN.md → src/core/reviewsEngine.ts
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  docs/01-review-va-ke-hoach.md → src/core/reviewsEngine.ts
- `3. Bảng trạng thái / yêu cầu qua lại` --references--> `foodImage()`  [INFERRED]
  docs/phan-cong.md → src/content/assets.ts
- `3. Bảng nhân vật (chốt để tránh mâu thuẫn)` --references--> `CharacterGenerator`  [INFERRED]
  claude-review-pack/02_STORY_BIBLE_HEM_1102.md → src/content/characterGenerator.ts
- `3. Bảng nhân vật (chốt để tránh mâu thuẫn)` --references--> `CharacterGenerator`  [INFERRED]
  docs/02-story-bible-v2.md → src/content/characterGenerator.ts

## Import Cycles
- None detected.

## Communities (65 total, 6 thin omitted)

### Community 0 - "save-and-name.test.ts"
Cohesion: 0.24
Nodes (9): DEFAULT_SHOP_NAME, normalizeShopName(), SHOP_NAME_MAX, SHOP_NAME_SUGGESTIONS, bindHeaderEvents(), renderHeader(), renderSettingsModal(), ENTITIES (+1 more)

### Community 1 - "4. Danh sách màn hình"
Cohesion: 0.22
Nodes (9): 4.1 Header (dùng chung), 4.2 Chuẩn bị (Prep), 4.3 Mở bán (màn quan trọng nhất), 4.4 Tổng kết ngày (modal toàn màn), 4.5 Cảnh truyện (visual novel mini), 4.6 Thư Thỏ Cam, 4.7 Thẻ chia sẻ (ảnh xuất ra, 1080×1350), 4.8 Trang giới thiệu (landing.html) (+1 more)

### Community 2 - "AppController"
Cohesion: 0.13
Nodes (12): Đã làm, pickDailyIncident(), createCustomerSource(), recordFryerLift(), recordHelperFry(), babble(), stopNarration(), traySizeFor() (+4 more)

### Community 3 - "cooking.ts"
Cohesion: 0.16
Nodes (11): CookingState, FRY_SPEED, DRINK_RECIPES, isDrinkId(), shouldRunTutorial(), TUTORIAL_TEXT, TutorialState, tutorialStep (+3 more)

### Community 4 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.14
Nodes (13): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 4. Tuyến theo chương, 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15), Chương 2 — Tiệm Trong Hẻm (ngày 16–50) (+5 more)

### Community 5 - "StoryModal.ts"
Cohesion: 0.15
Nodes (16): StoryEpisode, describeKarmaEffects(), BASS, canNarrate(), CHORDS, MELODY, Mode, music (+8 more)

### Community 6 - "sellingSim.ts"
Cohesion: 0.21
Nodes (16): CookingSnapshot, seedRandom(), createSellingSession(), FAST_FORWARD, gameDeltaMs(), MAX_FRAME_MS, MAX_QUEUE, SellingSession (+8 more)

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
Cohesion: 0.12
Nodes (6): cookingEngine, StaffHooks, DrinkId, QualityRating, TrayItem, perfectWindow()

### Community 12 - "package.json"
Cohesion: 0.06
Nodes (29): devDependencies, playwright-core, sharp, tsx, @typesafe-ai/sdk, typescript, vite, vitest (+21 more)

### Community 14 - "Game Narrative Director — Tiệm Gà Nhà Tui"
Cohesion: 0.13
Nodes (14): 1.1. Cốt lõi cảm xúc (Emotional Core), 1.2. Thước đo thành công của câu chuyện, 1. Tinh Thần Cốt Truyện & Thế Giới Hẻm 1102, 2. Bảng Nhân Vật Hạt Nhân (12 Archetypes & Voice Matrix), 3. Lộ Trình Cốt Truyện 5 Chương (100k – 200k Chữ), 4. Chuẩn Kịch Bản Phân Nhánh (Branching Dialogue Format), 5. Quy Chuẩn Viết Thư Thỏ Cam (Mimi's Letters), 6. Quy Tắc Bất Di Bất Dịch (Golden Narrative Rules) (+6 more)

### Community 15 - "stateManager"
Cohesion: 0.05
Nodes (26): createInitialState(), migrateSave(), stateManager, EconomyEngine, CookingState, Sauce, addStock(), ageOneDay() (+18 more)

### Community 16 - "2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION)"
Cohesion: 0.22
Nodes (8): 1. MA TRẬN PHÂN CHIA QUYỀN HẠN (RESPONSIBILITY MATRIX), 2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION), Dự Án: Tiệm Gà Nhà Tui (Anti IDE / AGY CLI Environment), Quy tắc 1: Auto-Proceed & Không Chặn Thao Tác, Quy tắc 2: Khóa Tác Vụ Qua Bảng Điều Phối (`docs/phan-cong.md`), Quy tắc 4: Tự Kiểm Chứng Cục Bộ Trước Khi Bàn Giao (Self-Verification Gate), Quy tắc 5: Nghiệm Thu Tối Cao Bởi Claude Lead, QUY ƯỚC ĐIỀU PHỐI MULTI-AGENT (3 GEMINI PRO & CLAUDE PROJECT LEAD)

### Community 17 - "2. Các Quyết Định UX & Giao Diện Chính"
Cohesion: 0.22
Nodes (8): 1. Quyết Định Quan Trọng Về Nhân Vật Bé Thỏ Cam (Mimi), 2.1. Thumb-Zone (Vùng Một Ngón Cái 40% Dưới Màn Hình), 2.2. Hệ Thống Màu & Tương Phản WCAG AA, 2.3. Kiểu Chữ (Typography), 2.4. Hiệu Năng & Animation, 2. Các Quyết Định UX & Giao Diện Chính, 3. Danh Mục File Giao Nộp, Ghi Chú Thiết Kế UI & Kiến Trúc Thị Giác — Tiệm Gà Nhà Tui

### Community 19 - "state.ts"
Cohesion: 0.08
Nodes (47): vitest, INITIAL_INVENTORY, INITIAL_MENU, INITIAL_CANDIDATES, CLOSE_HOUR, DAY_REAL_MS, GAME_HOUR_MS, isRushHour() (+39 more)

### Community 20 - "2. Kết quả công việc: Việc xong & Việc chưa xong"
Cohesion: 0.22
Nodes (9): 1. Danh sách file đã tạo và chỉnh sửa, 2. Kết quả công việc: Việc xong & Việc chưa xong, 3. Yêu cầu Markup gửi Claude, Báo Cáo Phiên Làm Việc Giờ 1 — Gemini (14:35 → 15:35), File CSS chỉnh sửa (Đưa Tokens & Components vào game):, File tài liệu & Asset đã tạo/cập nhật:, TRIỂN KHAI 4 BỘ SKILLS CHO MULTI-AGENT (GEMINI & CLAUDE):, VIỆC ĐÃ HOÀN THÀNH: (+1 more)

### Community 21 - "Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui"
Cohesion: 0.15
Nodes (12): 1. Triết Lý Vòng Lặp Trò Chơi (Core Game Loop), 2.1. Cấu trúc Sổ Sách Tài Chính (Ledger Formula), 2.2. Biên Lợi Nhuận Mục Tiêu Theo Món (Margin Target), 2. Mô Hình Dòng Tiền & Thuật Toán Kinh Tế (Economy Flow), 3.1. 4 Vùng Đánh Giá Chất Lượng Chiên (Cooking Quality Zones), 3.2. Vòng Đời Của Dầu Chiên (Oil Degradation), 3. Cơ Chế Trạm Bếp & Minigame Chiên Gà, 4. Hệ Thống Nhân Viên & Quản Lý Tâm Trạng (Staff System) (+4 more)

### Community 22 - "HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI"
Cohesion: 0.50
Nodes (3): 1. Phân Công Trách Nhiệm Khi Chạy Song Song Cùng Gemini (Anti IDE), 2. Graphify Knowledge Graph, HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI

### Community 23 - "KarmaState"
Cohesion: 0.05
Nodes (38): 📂 DANH MỤC TỆP TIN TRONG GÓI REVIEW NÀY, Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini), HƯỚNG DẪN REVIEW TOÀN DIỆN CHO CLAUDE CHAT (CLAUDE.AI), 🎯 VAI TRÒ CỦA CLAUDE CHAT, 💬 YÊU CẦU ĐẦU RA CHO CLAUDE CHAT:, 1. Bản Đồ Các Tệp Tin Trọng Tâm Cần Review, 2.1. Nút Hoàn Trả / Giảm Mua (`-5`) Trong Màn Chuẩn Bị:, 2.2. Phân Tầng Mở Khóa Nguyên Liệu (Progression Pacing): (+30 more)

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

### Community 29 - "SellingView.ts"
Cohesion: 0.18
Nodes (24): stationOpen(), timerPhase, checkAndSpawnFloatingMoney(), CustomerMood, CustomerVisualModel, formatClock(), FRY_ICON, getCustomerMood() (+16 more)

### Community 30 - "Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)"
Cohesion: 0.40
Nodes (5): Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05), Bổ sung sau giờ 1 (theo quyết định của chủ dự án, xong 16:17), Cần bạn quyết, Kết quả kiểm chứng cuối giờ, Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

### Community 31 - "day.ts"
Cohesion: 0.12
Nodes (28): RANDOM_EVENTS, assembleAtCounter(), BA_BA_AID_MONEY, BUNNY_VISIT_TIP, FAST_SERVICE_TIP, INSPECTION_FINE, makeDrink(), PERFECT_TIP (+20 more)

### Community 32 - "04_TYPES_GAME_CONTRACT.ts"
Cohesion: 0.09
Nodes (22): BaseMenuItemId, Chapter, Criteria, CustomerOrder, CustomerReview, DayLedger, GameEvent, GamePhase (+14 more)

### Community 33 - "Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu"
Cohesion: 0.12
Nodes (16): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 5. Tối ưu UI/UX (P2), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện (+8 more)

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
Cohesion: 0.06
Nodes (53): 3. Bảng nhân vật (chốt để tránh mâu thuẫn), 3. Bảng nhân vật (chốt để tránh mâu thuẫn), ARCHETYPE_CONFIG, CharacterGenerator, CustomerArchetype, ModularCharacter, generateCandidate(), STAFF_ROLES_INFO (+45 more)

### Community 40 - "review-fixes-2709.test.ts"
Cohesion: 0.17
Nodes (15): DAILY_INCIDENTS, getIncidentById(), hasSecurityStaff(), IncidentResolutionResult, MAX_REPUTATION_DELTA, MAX_RESOLVED_HISTORY, resolveIncidentChoice(), CONDIMENT_TIP (+7 more)

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

### Community 48 - "reviewsEngine.ts"
Cohesion: 0.23
Nodes (10): REVIEW_BLOCKED, REVIEW_HUMOR, CUST_AVATARS, GENZ_REVIEW_TEMPLATES, GENZ_USERNAMES, ReviewTemplate, applyBunnyReward(), ReviewsEngine (+2 more)

### Community 49 - "DayLedger"
Cohesion: 0.23
Nodes (5): DayResult, CustomerReview, DayLedger, ShareCardEngine, renderSummaryModal()

### Community 50 - "GameState"
Cohesion: 0.07
Nodes (41): CHAPTERS, applyKarmaChange(), BANKRUPTCY_DEBT_DAYS, evaluateEnding(), FINALE_CHAPTER, finaleReady(), STORY_ENDINGS, BUNNY_LETTERS (+33 more)

### Community 51 - "audio.ts"
Cohesion: 0.22
Nodes (8): audio, bindEndingEvents(), renderEndingModal(), BACBA_QUOTES, bindTitleScreenInteractions(), CAT_QUOTES, OWNER_QUOTES, renderTitleScreen()

### Community 52 - "2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH"
Cohesion: 0.15
Nodes (12): 1. TỔNG QUAN KẾT QUẢ ĐẠT ĐƯỢC, 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH, 3. DANH SÁCH ẢNH CHỤP KIỂM THỬ TRỰC QUAN (`ui-check-out/`), 4. BẢNG TỔNG HỢP KIỂM TRA CHẤT LƯỢNG (QUALITY GATES), 5. TÌNH TRẠNG HIỆN TẠI & BÀN GIAO CHO CLAUDE LEAD, BÁO CÁO TỔNG KẾT CA ĐÊM 27/09/2026, G0. Hoàn tất giao diện Sự Cố & Máy Nước Ngọt Fanta (Commit `02b2927`), G1. Nén ảnh Assets $\le 4\text{MB}$ & Mọi PNG $\le 40\text{KB}$ (Commit `7e207ef`) (+4 more)

### Community 53 - "Brief thiết kế giao diện — Tiệm Gà Nhà Tui"
Cohesion: 0.29
Nodes (7): 0. Bạn cần giao lại gì, 1. Sản phẩm là gì, 2. Hệ thống thị giác hiện có (giữ và mở rộng), 3. Nguyên tắc UX bắt buộc, 5. Class CSS đang có (giữ nguyên tên), 6. Ràng buộc kỹ thuật, Brief thiết kế giao diện — Tiệm Gà Nhà Tui

### Community 54 - "main.ts"
Cohesion: 0.16
Nodes (16): BunnyLetter, MYSTERY_QUESTS, MysteryGuestQuest, StoryTrigger, isAssemblyId(), isTimerStationId(), isSellingAction(), parseStationAction() (+8 more)

### Community 55 - "2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)"
Cohesion: 0.17
Nodes (11): 1. THÔNG SỐ KHUNG CANVAS TỔNG THỂ, 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI), 3. CÔNG THỨC SINH DANH HIỆU TỰ ĐỘNG (DỰA TRÊN STATE), Khu vực 1: Mái hiên sọc đỏ - trắng K-Chicken (Y: 16 → 46), Khu vực 2: Header Quán & Huy Hiệu Chương (Y: 60 → 170), Khu vực 3: Tiêu đề Báo Cáo & Danh Hiệu Vinh Danh (Y: 190 → 360), Khu vực 4: Lưới 4 Thẻ Chỉ Số Vàng (2×2 Hero Stats Grid) (Y: 415 → 765), Khu vực 5: Món Ăn 'Ruột' Spotlight & Review Viral (Y: 780 → 980) (+3 more)

### Community 56 - "Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu"
Cohesion: 0.20
Nodes (10): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện, 9. Về các skill đã nêu (+2 more)

### Community 57 - "game.ts"
Cohesion: 0.12
Nodes (17): Quy tắc 3: Hiệp Thương Contract-First Qua `src/types/game.ts`, 3. Bảng trạng thái / yêu cầu qua lại, INITIAL_UPGRADES, AUTO_LIFT_KITCHEN_LEVEL, bestOwned(), capacitySlots(), MAX_PRICE_PREMIUM_PCT, SELF_SERVE_OPERATIONS_LEVEL (+9 more)

### Community 58 - "assets.ts"
Cohesion: 0.27
Nodes (6): ref_node_fs, ASSETS, foodImage(), tutorialHint, TutorialActions, paths()

### Community 59 - "CustomerOrder"
Cohesion: 0.33
Nodes (5): perfectTip(), serveFirstOrder(), TickContext, StaffSession, CustomerOrder

### Community 60 - "UpgradesTab.ts"
Cohesion: 0.33
Nodes (5): renderMenuTab(), renderReviewsTab(), bindUpgradesEvents(), effectsSummary(), renderUpgradesTab()

### Community 61 - "5. Tối ưu UI/UX (P2)"
Cohesion: 0.33
Nodes (6): 5. Tối ưu UI/UX (P2), Màn Chuẩn bị, Màn Mở bán (quan trọng nhất), Onboarding, Truyện, Tổng kết ngày

### Community 64 - "Đợt 1 — Chương 1 (cần trước để làm vertical slice)"
Cohesion: 0.25
Nodes (8): 4.1 Linh vật & nhân vật chính, 4.2 Khách ngẫu nhiên (hệ ghép phần), 4.3 Món ăn chương 1 (256×256), 4.4 Bếp & quầy chương 1, 4.5 Icon UI (128×128, cùng nét viền), 4.6 Hiệu ứng (sprite sheet ngang, mỗi khung 256×256, 6–8 khung), 4.7 Giấy thư Thỏ Cam, Đợt 1 — Chương 1 (cần trước để làm vertical slice)

### Community 65 - "MenuTab.ts"
Cohesion: 0.33
Nodes (5): CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer, MenuItem, bindMenuEvents()

## Knowledge Gaps
- **396 isolated node(s):** `NonEmpty`, `GamePhase`, `QualityRating`, `OilCondition`, `BaseMenuItemId` (+391 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 478 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `KarmaState` connect `KarmaState` to `game.ts`, `GameState`, `state.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `vitest` connect `state.ts` to `save-and-name.test.ts`, `cooking.ts`, `sellingSim.ts`, `core/staff.ts`, `review-fixes-2709.test.ts`, `package.json`, `GameState`, `assets.ts`, `day.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `CharacterGenerator` connect `core/staff.ts` to `state.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `NonEmpty`, `GamePhase`, `QualityRating` to the rest of the system?**
  _396 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppController` be split into smaller, more focused modules?**
  _Cohesion score 0.1334730957372467 - nodes in this community are weakly interconnected._
- **Should `Story Bible v2 — Hẻm 1102` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `StoryModal.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._