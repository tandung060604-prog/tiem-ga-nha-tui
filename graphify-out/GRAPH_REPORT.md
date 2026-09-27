# Graph Report - TiemGaRan  (2026-09-27)

## Corpus Check
- 152 files · ~770,276 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .css 6, .bat 3, (none) 2)

## Summary
- 1288 nodes · 3166 edges · 78 communities (73 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5384cc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- mysteryBunny.ts
- 4. Danh sách màn hình
- AppController
- logic.ts
- Story Bible v2 — Hẻm 1102
- music.ts
- orders.ts
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
- main.ts
- 2. Kết quả công việc: Việc xong & Việc chưa xong
- Game Gameplay Systems & Economy Balancer — Tiệm Gà Nhà Tui
- HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI
- KarmaState
- Yêu Cầu Markup (Gemini → Claude)
- Nhiệm vụ Gemini — Giờ 1 (14:35 → 15:35)
- Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)
- Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui
- Procedural Content Generator — Tiệm Gà Nhà Tui
- SellingView.ts
- core/staff.ts
- state.ts
- 04_TYPES_GAME_CONTRACT.ts
- Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu
- Game Narrative Director — Tiệm Gà Nhà Tui
- Story Bible v2 — Hẻm 1102
- 2. Nhật Ký Chi Tiết Từng Phiên (Activity Log)
- Báo Cáo Kết Quả Thực Hiện — Giờ 2 (Gemini)
- 3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW)
- review-fixes-2709.test.ts
- GameState
- Nhiệm vụ Gemini — Giờ 2
- Review toàn diện & sửa lỗi — 26/09/2026 (tối)
- 11_CUSTOMERS_12_NHAN_VAT.ts
- Mô phỏng cân bằng — 26/09/2026
- economy.ts
- cookingEngine
- 2. CHI TIẾT KỸ THUẬT TỪNG MỤC
- day.ts
- sellingSim.ts
- 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH
- p0-fixes.test.ts
- Brief thiết kế giao diện — Tiệm Gà Nhà Tui
- assets.ts
- 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)
- Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu
- Đợt 1 — Chương 1 (cần trước để làm vertical slice)
- endings.ts
- 3. Bảng trạng thái / yêu cầu qua lại
- cooking.ts
- prepStation.ts
- wrapped.ts
- progression.ts
- tutorial.test.ts
- game.ts
- 5. Tối ưu UI/UX (P2)
- staff.test.ts
- gemini-dem-27-09.md
- compilerOptions
- Máy chủ Tiệm Gà Nhà Tui (Cloudflare Worker) — chưa deploy
- BÁO CÁO NGHIỆM THU CSS VÒNG 3 — GEMINI
- EconomyEngine
- 13_MENU_TAB_UI.ts
- ref_types_game
- 05_STATE_VA_VONG_LAP_NGAY.ts
- ensureBatches
- StoryModal.ts

## God Nodes (most connected - your core abstractions)
1. `GameState` - 60 edges
2. `AppController` - 49 edges
3. `createInitialState()` - 43 edges
4. `cookingEngine` - 36 edges
5. `vitest` - 30 edges
6. `audio` - 28 edges
7. `closeDay()` - 24 edges
8. `upgradeEffects` - 22 edges
9. `createSellingSession()` - 20 edges
10. `staffEffects` - 20 edges

## Surprising Connections (you probably didn't know these)
- `3. Ảnh cần tạo` --references--> `foodImage()`  [INFERRED]
  docs/bao-cao/hop-dong-pnl-quay-inox.md → src/content/assets.ts
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  claude-review-pack/03_GDD_KE_HOACH_TONG_QUAN.md → src/core/reviewsEngine.ts
- `7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu` --references--> `ReviewsEngine`  [INFERRED]
  docs/01-review-va-ke-hoach.md → src/core/reviewsEngine.ts
- `3. Bảng trạng thái / yêu cầu qua lại` --references--> `foodImage()`  [INFERRED]
  docs/phan-cong.md → src/content/assets.ts
- `3. Bảng nhân vật (chốt để tránh mâu thuẫn)` --references--> `CharacterGenerator`  [INFERRED]
  claude-review-pack/02_STORY_BIBLE_HEM_1102.md → src/content/characterGenerator.ts

## Import Cycles
- None detected.

## Communities (78 total, 5 thin omitted)

### Community 0 - "mysteryBunny.ts"
Cohesion: 0.23
Nodes (9): BUNNY_RANDOM_VISIT_NOTES, BunnyLetter, MYSTERY_QUESTS, MysteryGuestQuest, StoryTrigger, Criteria, bindBunnyModalEvents(), renderBunnyAlbumModal() (+1 more)

### Community 1 - "4. Danh sách màn hình"
Cohesion: 0.22
Nodes (9): 4.1 Header (dùng chung), 4.2 Chuẩn bị (Prep), 4.3 Mở bán (màn quan trọng nhất), 4.4 Tổng kết ngày (modal toàn màn), 4.5 Cảnh truyện (visual novel mini), 4.6 Thư Thỏ Cam, 4.7 Thẻ chia sẻ (ảnh xuất ra, 1080×1350), 4.8 Trang giới thiệu (landing.html) (+1 more)

### Community 2 - "AppController"
Cohesion: 0.08
Nodes (27): Đã làm, Báo cáo đêm 27/09 — Claude + Gemini, Claude đã làm, Còn tồn / cần anh/chị, Gemini đã làm (theo `docs/gemini/bao-cao-dem-27-09.md`, Claude đã kiểm), Kiểm chứng cuối đêm, pickDailyIncident(), createCustomerSource() (+19 more)

### Community 3 - "logic.ts"
Cohesion: 0.17
Nodes (22): Env, fetch(), json(), KV, RATE_LIMIT, rateLimited(), readBoard(), computeScore() (+14 more)

### Community 4 - "Story Bible v2 — Hẻm 1102"
Cohesion: 0.14
Nodes (13): 1. Vấn đề của tuyến truyện hiện tại, 2. Xương sống mới, 4. Tuyến theo chương, 5. Cách trình bày trong game, 6. Kiểu dữ liệu đề xuất, Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật), Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15), Chương 2 — Tiệm Trong Hẻm (ngày 16–50) (+5 more)

### Community 5 - "music.ts"
Cohesion: 0.15
Nodes (9): BASS, CHORDS, MELODY, Mode, MusicBox, narrate(), vietnameseVoice(), Voice (+1 more)

### Community 6 - "orders.ts"
Cohesion: 0.06
Nodes (59): 3. Bảng nhân vật (chốt để tránh mâu thuẫn), 3. Bảng nhân vật (chốt để tránh mâu thuẫn), ARCHETYPE_CONFIG, CharacterGenerator, CustomerArchetype, ModularCharacter, CUSTOMER_GROUPS, REGULAR_CUSTOMERS (+51 more)

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
Cohesion: 0.14
Nodes (3): cookingEngine, QualityRating, TrayItem

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

### Community 19 - "main.ts"
Cohesion: 0.13
Nodes (21): music, CHAPTER_PRICE_STEP, DEFAULT_SHOP_NAME, SHOP_NAME_MAX, SHOP_NAME_SUGGESTIONS, FRY_ACTION_ITEM, isSellingAction(), SELLING_ACTIONS (+13 more)

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

### Community 26 - "Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)"
Cohesion: 0.21
Nodes (5): Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05), Bổ sung sau giờ 1 (theo quyết định của chủ dự án, xong 16:17), Cần bạn quyết, Kết quả kiểm chứng cuối giờ, Đối chiếu báo cáo của Gemini ([bao-cao-gio-1.md](../gemini/bao-cao-gio-1.md))

### Community 27 - "Game Feel & Visual Juice Polish — Tiệm Gà Nhà Tui"
Cohesion: 0.17
Nodes (11): 1. Triết Lý "Juice It Or Lose It", 2.1. Phân bổ màn hình dọc 9:16 (390×844pt), 2.2. Kích thước chạm an toàn (Target Size), 2. Quy Chuẩn Vùng Ngón Cái (Thumb-Zone Ergonomics), 3. Bảng Tra Cứu Hiệu Ứng Chuyển Động (Animation Tokens), 4. Haptic Feedback Matrix (Rung Xúc Giác), 5. Bong Bóng Suy Nghĩ Realtime (Customer Thoughts System), 6. Biểu Đồ Radar SVG 5 Tiêu Chí (Summary Radar Chart) (+3 more)

### Community 28 - "Procedural Content Generator — Tiệm Gà Nhà Tui"
Cohesion: 0.22
Nodes (8): 1. Công Thức Đặt Tên Thực Khách Sài Gòn (Naming Formula), 2. Hệ Thống Ghép Tầng Ngoại Hình (Modular Visual Generation), 3. Ngân Hàng Câu Thoại Ngữ Cảnh (Contextual Dialogue Bank), 4. Cơ Chế Khách Bí Ẩn & Chuỗi Nhiệm Vụ (Mystery Quests), 5. Quy Chuẩn Sinh Review GenZ Hài Hước (Viral Review Generator), Các nhóm danh xưng phổ biến:, Cấu trúc Quest:, Procedural Content Generator — Tiệm Gà Nhà Tui

### Community 29 - "SellingView.ts"
Cohesion: 0.15
Nodes (28): assembleAtCounter(), perfectTip(), startTimerStation(), stationOpen(), assemble(), assemblyBaseIndex(), timerPhase, CustomerMood (+20 more)

### Community 30 - "core/staff.ts"
Cohesion: 0.11
Nodes (29): FryType, Sauce, endShiftForStaff(), FRY_LOOK, FryRecipe, has(), hasAutoWork(), HelperCook (+21 more)

### Community 31 - "state.ts"
Cohesion: 0.19
Nodes (12): INITIAL_INVENTORY, INITIAL_MENU, INITIAL_CANDIDATES, createInitialState(), migrateSave(), chicken(), good(), fullyStocked() (+4 more)

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

### Community 39 - "review-fixes-2709.test.ts"
Cohesion: 0.17
Nodes (15): DAILY_INCIDENTS, getIncidentById(), hasSecurityStaff(), IncidentResolutionResult, MAX_REPUTATION_DELTA, MAX_RESOLVED_HISTORY, resolveIncidentChoice(), CONDIMENT_TIP (+7 more)

### Community 40 - "GameState"
Cohesion: 0.16
Nodes (14): closeDay(), requestBaBaAid(), auditState(), flagIntegrity(), isTampered(), signSave(), START_MONEY, exportSaveCode() (+6 more)

### Community 41 - "Nhiệm vụ Gemini — Giờ 2"
Cohesion: 0.33
Nodes (5): Nhiệm vụ Gemini — Giờ 2, Việc 1 — Asset Đợt 1 còn thiếu (ưu tiên), Việc 2 — CSS cho class mới Claude đã thêm, Việc 3 — Chuẩn bị giao diện cho bước tiếp theo của Claude (truyện + qua chương), Việc 4 — Báo cáo

### Community 42 - "Review toàn diện & sửa lỗi — 26/09/2026 (tối)"
Cohesion: 0.13
Nodes (13): Chất game: âm thanh, tiếng, Chống gian lận, Gameplay (đo bằng `npm run sim`), iOS, Jev, Kiểm chứng, Lỗi nghiêm trọng đã sửa, Review toàn diện & sửa lỗi — 26/09/2026 (tối) (+5 more)

### Community 43 - "11_CUSTOMERS_12_NHAN_VAT.ts"
Cohesion: 0.50
Nodes (3): CUSTOMER_GROUPS, REGULAR_CUSTOMERS, RegularCustomer

### Community 44 - "Mô phỏng cân bằng — 26/09/2026"
Cohesion: 0.22
Nodes (8): 27/09: P&L + thuế, giỏ hàng thực tế, thực đơn K-chicken, Cân bằng lần 2 — đêm 27/09 (Claude), Kết quả (`npm run sim -- --days 330 --seeds 5 --policy 3`, có nâng cấp + nhân viên), Kết quả (trung vị ngày qua Chương 1; GDD: ngày 15), Mô phỏng cân bằng — 26/09/2026, Thay đổi, Vấn đề, Vấn đề thiết kế còn lại (không chỉnh bằng số được)

### Community 46 - "economy.ts"
Cohesion: 0.05
Nodes (55): 1. Quầy khay inox âm bàn: `src/ui/components/PrepStation.ts`, 2. Bảng P&L cuối ngày: `renderPnl()` trong `src/ui/components/SummaryModal.ts`, 3. Ảnh cần tạo, 4. Đổi tên món (giữ nguyên id), Bàn giao cho Gemini: quầy khay inox GN + bảng P&L cuối ngày (27/09), BUSINESS_FORM_LABEL, businessForm(), COMPANY_CIT_RATE (+47 more)

### Community 48 - "2. CHI TIẾT KỸ THUẬT TỪNG MỤC"
Cohesion: 0.17
Nodes (12): 1. Dòng Khách Dặn Thêm Tương (`.order-condiment`), 1. TỔNG QUAN KẾT QUẢ HOÀN THÀNH, 2. CHI TIẾT KỸ THUẬT TỪNG MỤC, 2. Khối Tác Động Karma Trong Cảnh Truyện (`.story-karma-effects`), 3. DANH SÁCH ẢNH CHỤP KIỂM THỬ TRỰC QUAN (`ui-check-out/`), 3. Hiệu Ứng Tiền Bay & Khách Bỏ Về (`.fx-layer`, `.money-float.lost-float`), 4. KẾT QUẢ BỘ CÔNG CỤ NGHIỆM THU KÉP (QUALITY GATES), 4. Nút Gà Wrapped & Xem Trước Thẻ Tuần (`.btn-wrapped`, `.wrapped-preview-img`) (+4 more)

### Community 49 - "day.ts"
Cohesion: 0.10
Nodes (28): RANDOM_EVENTS, BA_BA_AID_MONEY, BUNNY_VISIT_TIP, CLEANSER_IDS, CLEANSER_TASTE_PER_DAY, FAST_SERVICE_TIP, INSPECTION_FINE, PERFECT_TIP (+20 more)

### Community 50 - "sellingSim.ts"
Cohesion: 0.12
Nodes (25): CookingSnapshot, recordOrderBooks(), serveFirstOrder(), OrdersEngine, createSellingSession(), drainFx(), FAST_FORWARD, FxEvent (+17 more)

### Community 51 - "2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH"
Cohesion: 0.15
Nodes (12): 1. TỔNG QUAN KẾT QUẢ ĐẠT ĐƯỢC, 2. CHI TIẾT CÁC MỤC ĐÃ HOÀN THÀNH, 3. DANH SÁCH ẢNH CHỤP KIỂM THỬ TRỰC QUAN (`ui-check-out/`), 4. BẢNG TỔNG HỢP KIỂM TRA CHẤT LƯỢNG (QUALITY GATES), 5. TÌNH TRẠNG HIỆN TẠI & BÀN GIAO CHO CLAUDE LEAD, BÁO CÁO TỔNG KẾT CA ĐÊM 27/09/2026, G0. Hoàn tất giao diện Sự Cố & Máy Nước Ngọt Fanta (Commit `02b2927`), G1. Nén ảnh Assets $\le 4\text{MB}$ & Mọi PNG $\le 40\text{KB}$ (Commit `7e207ef`) (+4 more)

### Community 52 - "p0-fixes.test.ts"
Cohesion: 0.25
Nodes (18): vitest, addStock(), ageOneDay(), canUnlockIngredient(), consumeStock(), ensureBatches(), isIngredientUnlocked(), refundableUnits() (+10 more)

### Community 53 - "Brief thiết kế giao diện — Tiệm Gà Nhà Tui"
Cohesion: 0.29
Nodes (7): 0. Bạn cần giao lại gì, 1. Sản phẩm là gì, 2. Hệ thống thị giác hiện có (giữ và mở rộng), 3. Nguyên tắc UX bắt buộc, 5. Class CSS đang có (giữ nguyên tên), 6. Ràng buộc kỹ thuật, Brief thiết kế giao diện — Tiệm Gà Nhà Tui

### Community 54 - "assets.ts"
Cohesion: 0.18
Nodes (13): ref_node_fs, ASSETS, foodImage(), TutorialActions, drawWrapped(), loadImage(), money(), roundRect() (+5 more)

### Community 55 - "2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI)"
Cohesion: 0.17
Nodes (11): 1. THÔNG SỐ KHUNG CANVAS TỔNG THỂ, 2. CÁC KHU VỰC VẼ CHI TIẾT (TỪ TRÊN XUỐNG DƯỚI), 3. CÔNG THỨC SINH DANH HIỆU TỰ ĐỘNG (DỰA TRÊN STATE), Khu vực 1: Mái hiên sọc đỏ - trắng K-Chicken (Y: 16 → 46), Khu vực 2: Header Quán & Huy Hiệu Chương (Y: 60 → 170), Khu vực 3: Tiêu đề Báo Cáo & Danh Hiệu Vinh Danh (Y: 190 → 360), Khu vực 4: Lưới 4 Thẻ Chỉ Số Vàng (2×2 Hero Stats Grid) (Y: 415 → 765), Khu vực 5: Món Ăn 'Ruột' Spotlight & Review Viral (Y: 780 → 980) (+3 more)

### Community 56 - "Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu"
Cohesion: 0.20
Nodes (10): 1. Tóm tắt, 2. Lỗi nghiêm trọng (P0), 3. Hiệu năng & UX kỹ thuật (P1), 4. Kiến trúc type-safe (P1), 6. Bài học từ các repo/game mã nguồn mở, 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu, 8. Lộ trình thực hiện, 9. Về các skill đã nêu (+2 more)

### Community 57 - "Đợt 1 — Chương 1 (cần trước để làm vertical slice)"
Cohesion: 0.25
Nodes (8): 4.1 Linh vật & nhân vật chính, 4.2 Khách ngẫu nhiên (hệ ghép phần), 4.3 Món ăn chương 1 (256×256), 4.4 Bếp & quầy chương 1, 4.5 Icon UI (128×128, cùng nét viền), 4.6 Hiệu ứng (sprite sheet ngang, mỗi khung 256×256, 6–8 khung), 4.7 Giấy thư Thỏ Cam, Đợt 1 — Chương 1 (cần trước để làm vertical slice)

### Community 58 - "endings.ts"
Cohesion: 0.30
Nodes (10): applyKarmaChange(), BANKRUPTCY_DEBT_DAYS, evaluateEnding(), FINALE_CHAPTER, finaleReady(), STORY_ENDINGS, chooseDialogueOption(), DialogueOption (+2 more)

### Community 59 - "3. Bảng trạng thái / yêu cầu qua lại"
Cohesion: 0.20
Nodes (9): Quy tắc 3: Hiệp Thương Contract-First Qua `src/types/game.ts`, 1. Ranh giới file (không sửa file của bên kia), 2. Việc của mỗi bên trong giờ này, 3. Bảng trạng thái / yêu cầu qua lại, Phân công Claude ↔ Gemini, StoryEnding, StoryEndingId, bindEndingEvents() (+1 more)

### Community 60 - "cooking.ts"
Cohesion: 0.39
Nodes (4): audio, FRY_SPEED, fryingItemId(), OilCondition

### Community 61 - "prepStation.ts"
Cohesion: 0.24
Nodes (13): k(), PREP_LAYOUT, prepLock(), PrepPanDef, prepStationSlots(), PrepView, FRY_RECIPES, PrepSlotState (+5 more)

### Community 62 - "wrapped.ts"
Cohesion: 0.50
Nodes (4): honorTitle(), weeklyWrapped(), WRAPPED_EVERY, WrappedData

### Community 63 - "progression.ts"
Cohesion: 0.19
Nodes (15): CHAPTERS, BUNNY_LETTERS, MysteryBunnyEngine, eventForDay(), applyChapterPrices(), chapterProgress(), currentChapterData(), DEPOSIT_SHARE (+7 more)

### Community 64 - "tutorial.test.ts"
Cohesion: 0.23
Nodes (7): CookingState, shouldRunTutorial(), TUTORIAL_TEXT, tutorialHint, TutorialState, idle, started

### Community 65 - "game.ts"
Cohesion: 0.18
Nodes (11): 4. Báo cáo cuối giờ, INITIAL_UPGRADES, BasketRole, BasketRule, Condiment, FinancialLedger, GamePhase, Station (+3 more)

### Community 66 - "5. Tối ưu UI/UX (P2)"
Cohesion: 0.33
Nodes (6): 5. Tối ưu UI/UX (P2), Màn Chuẩn bị, Màn Mở bán (quan trọng nhất), Onboarding, Truyện, Tổng kết ngày

### Community 68 - "staff.test.ts"
Cohesion: 0.18
Nodes (16): generateCandidate(), STAFF_ROLES_INFO, STAFF_TRAITS, makeDrink(), recordHelperFry(), useIngredients(), describeStaffEffect(), extraTraySlots() (+8 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, lib, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck, strict (+2 more)

### Community 72 - "Máy chủ Tiệm Gà Nhà Tui (Cloudflare Worker) — chưa deploy"
Cohesion: 0.50
Nodes (3): Chưa làm (chờ deploy), Máy chủ Tiệm Gà Nhà Tui (Cloudflare Worker) — chưa deploy, Việc anh/chị cần làm (khoảng 10 phút)

### Community 73 - "BÁO CÁO NGHIỆM THU CSS VÒNG 3 — GEMINI"
Cohesion: 0.15
Nodes (12): 1. TỔNG QUAN KẾT QUẢ HOÀN THÀNH, 2.1. Cấu trúc Markup & Dỡ Bỏ Inline Styles, 2.2. CSS Chuyên Biệt Cho Dòng Món Ăn, 2.3. Tối Ưu Chiều Cao Thẻ Khách ≤ 150px Trên 320px, 2. CHI TIẾT KỸ THUẬT MỤC 1 — THẺ KHÁCH GỌN GÀNG MOBILE, 3.1. Dải Màu Trực Quan 5 Mức (Xanh → Đỏ), 3.2. Khối `.price-summary` Nổi Bật, 3.3. Tối Ưu Màn Hình Hẹp 320px (+4 more)

### Community 74 - "EconomyEngine"
Cohesion: 0.22
Nodes (3): EconomyEngine, ref_clock, ref_upgrades

### Community 75 - "13_MENU_TAB_UI.ts"
Cohesion: 0.20
Nodes (4): ref_content_assets, ref_content_customers, ref_core_audio, ref_core_inventory

### Community 76 - "ref_types_game"
Cohesion: 0.22
Nodes (6): CookingState, Sauce, INITIAL_INVENTORY, INITIAL_MENU, ref_audio, ref_types_game

### Community 79 - "05_STATE_VA_VONG_LAP_NGAY.ts"
Cohesion: 0.33
Nodes (5): ref_content_inventory, ref_content_menu, ref_content_staff, ref_content_upgrades, ref_inventory

### Community 80 - "ensureBatches"
Cohesion: 0.80
Nodes (5): addStock(), ageOneDay(), consumeStock(), ensureBatches(), sync()

### Community 82 - "StoryModal.ts"
Cohesion: 0.27
Nodes (10): StoryEpisode, describeKarmaEffects(), KARMA_LIMITS, karmaEffects, lean(), canNarrate(), bindStoryEvents(), getCharacterPortrait() (+2 more)

## Knowledge Gaps
- **449 isolated node(s):** `NonEmpty`, `GamePhase`, `QualityRating`, `OilCondition`, `BaseMenuItemId` (+444 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 539 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `p0-fixes.test.ts` to `tutorial.test.ts`, `logic.ts`, `staff.test.ts`, `orders.ts`, `review-fixes-2709.test.ts`, `GameState`, `package.json`, `state.ts`, `economy.ts`, `sellingSim.ts`, `StoryModal.ts`, `assets.ts`, `endings.ts`, `cooking.ts`, `progression.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `KarmaState` connect `KarmaState` to `game.ts`, `endings.ts`, `3. Bảng trạng thái / yêu cầu qua lại`, `StoryModal.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu` connect `Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu` to `Báo cáo Claude — Giờ 1 (26/09/2026, 14:35 → 15:05)`, `5. Tối ưu UI/UX (P2)`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `NonEmpty`, `GamePhase`, `QualityRating` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppController` be split into smaller, more focused modules?**
  _Cohesion score 0.08108108108108109 - nodes in this community are weakly interconnected._
- **Should `Story Bible v2 — Hẻm 1102` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `music.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._