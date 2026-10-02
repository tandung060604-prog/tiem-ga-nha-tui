# KHUNG HƯỚNG DẪN KỸ SƯ VÒNG LẶP KHÉP KÍN (LOOP ENGINEERING FRAMEWORK)
## DỰ ÁN: TIỆM GÀ NHÀ TUI (AGY MULTI-AGENT / ANTI IDE)
*Tài liệu chuẩn mực bắt buộc cho toàn bộ Agent (Gemini 1, Gemini 2, Gemini 3, Antigravity & Claude Lead) nhằm bảo đảm chất lượng game liên tục tăng trưởng qua từng chu kỳ test xuyên đêm (Round 9, 10, 11...).*

---

## 1. TRIẾT LÝ LOOP ENGINEERING (VÒNG LẶP TIẾN HÓA LIÊN TỤC)

Trong phát triển phần mềm game truyền thống, việc kiểm thử tự động (Monkey Test) thường chỉ đóng vai trò **"người gác cổng thụ động"** (tìm lỗi rồi báo cáo). 

Mô hình **Loop Engineer (Kỹ Sư Vòng Lặp Khép Kín)** biến bài test tự hành thành **động lực tiến hóa chủ động**:
> **"Mỗi đợt test 200 ngày hoàn tất không phải là điểm dừng, mà là phát súng mở màn cho đợt nâng cấp mã nguồn tiếp theo. Khi mã nguồn đổi mới, chính bot kiểm thử cũng phải tự tiến hóa để chinh phục tính năng đó."**

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VÒNG TUẦN HOÀN LOOP ENGINEERING 5 PHA                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   PHA 1: THU HOẠCH & HẬU KIỂM TOÁN (Post-Mortem & Metrics)            │
│   [Đạt mốc 200 ngày] ──► Phân tích Log, DOM Nodes, Memory, Crash Rate  │
│                                      │                                 │
│                                      ▼                                 │
│   PHA 2: TÁI THIẾT KẾ & NÂNG CẤP CODEBASE (Feature Implementation)     │
│   [Sprint Backlog / Blueprint] ──► Code tính năng, UI, Animation, Core │
│                                      │                                 │
│                                      ▼                                 │
│   PHA 3: TIẾN HÓA KỊCH BẢN TEST BOT (Test Script Evolution)           │
│   [Dạy Bot Chơi Tính Năng Mới] ──► Selectors, Mega-Button, Collision   │
│                                      │                                 │
│                                      ▼                                 │
│   PHA 4: CHỐT NGHIỆM THU KÉP 3 LỚP (Triple Quality Gates)              │
│   [Vitest 100%] + [Vite Build 0 Lỗi TS] + [ui:check 360/390px 100%]    │
│                                      │                                 │
│                                      ▼                                 │
│   PHA 5: TÁI KHỞI ĐỘNG CHU KỲ TEST 200 NGÀY TIẾP THEO (Next Round)    │
│   [Round N+1 Launch] ──► Tự hành 200 ngày, giám sát thời gian thực     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. QUY TRÌNH THỰC THI 5 PHA CHI TIẾT (STANDARD OPERATING PROCEDURE)

Mỗi khi tiến trình kiểm thử tự hành hoàn thành cột mốc (hoặc hết thời gian), Agent phụ trách **BẮT BUỘC** thực hiện đầy đủ 5 pha sau:

### PHA 1: THU HOẠCH & HẬU KIỂM TOÁN (HARVESTING & POST-MORTEM)
1. **Trích xuất chỉ số sống còn từ log**:
   - `Số ngày chơi thực tế`: Phải đạt đủ 100–200 ngày.
   - `Crash Rate`: Số lỗi JavaScript (`pageerror`, unhandled rejections) phải bằng **0**.
   - `UI Freeze / Deadlock`: Số lần Watchdog kích hoạt cứu kẹt timeout > 25s.
   - `DOM Node Leak`: Kiểm tra số lượng DOM nodes qua từng ngày (Ví dụ: Dao động trong ngưỡng 300–480 nodes là chuẩn; nếu tăng tịnh tiến vượt > 800 nodes là có rò rỉ bộ nhớ).
2. **Xuất báo cáo tổng kết đợt**:
   - Cập nhật vào [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md) và lưu báo cáo tại `docs/bao-cao-test-xuyen-dem.md`.

---

### PHA 2: TÁI THIẾT KẾ & NÂNG CẤP CODEBASE (FEATURE & POLISH IMPLEMENTATION)
Dựa trên tài liệu kiến trúc (ví dụ: `docs/04-ui-ux-mobile-redesign-blueprint.md`) và phản hồi thực tế, tiến hành nâng cấp mã nguồn:
1. **Tuân thủ nguyên tắc Contract-First**:
   - Mọi thay đổi dữ liệu phải cập nhật trước tại `src/types/game.ts`.
2. **Kiến trúc phân vùng bất khả xâm phạm (Zero-Collision)**:
   - Tuyệt đối không để phần tử nổi (Toast, Emote, Popup) đè lên khu vực thao tác (Chảo chiên, nút bấm).
3. **Chuẩn công thái học ngón cái (Golden Thumb Zone)**:
   - Các nút tương tác chính trong ca bán phải có chiều cao $\ge 44\text{px}$ (khuyên dùng $\ge 56\text{px}$ cho Mega-Button đáy).
   - Vừa khít màn hình 360px và 390px, tuyệt đối không phát sinh thanh cuộn ngang trang (`overflow-x: hidden`, dư 0px).

---

### PHA 3: TIẾN HÓA KỊCH BẢN TEST BOT (TEST SCRIPT EVOLUTION)
**Đây là quy tắc sống còn của Loop Engineer:**
> **"Agent không bao giờ được phép sửa code giao diện mà để nguyên file test cũ!"**

Khi mã nguồn thay đổi, file chạy test `scripts/overnight-browser-monkey.mjs` **BẮT BUỘC** phải được cập nhật tương ứng:

1. **Đồng bộ Selectors & Cấu trúc DOM**:
   - Nếu nút bị dời vào Hamburger Drawer: Bot phải biết mở Drawer (`#btn-header-drawer`), tương tác, rồi đóng Drawer an toàn (`#btn-close-header-drawer`).
   - Nếu đổi từ nút cũ sang Mega-Button ngón cái: Bot phải nhận diện `#btn-mega-thumb-action` hoặc alias `#btn-serve-all`.
   - Nếu đổi thẻ gọi món sang Phiếu Gỗ Mini: Bot phải hỗ trợ click vào `.order-wood-ticket`.
2. **Thêm kịch bản test tính năng mới vừa code**:
   - Có Minigame mới ➔ Thêm logic giải minigame vào bot.
   - Có Gacha nhân sự ➔ Thêm logic vào tab Nhân Sự, roll thẻ, kiểm tra ảnh không bị vỡ (`naturalWidth > 0`).
   - Có Hệ thống tiếp tế bạn bè / Thử thách tuần ➔ Thêm logic click nhận quà / xem nhiệm vụ.
3. **Phát hiện va chạm giao diện (Layout Collision Detection)**:
   - Tích hợp hàm kiểm tra tọa độ `getBoundingClientRect()` giữa các vùng giao diện chính để phát hiện sớm các lỗi CSS đè lớp.
4. **Cơ chế tự gỡ kẹt phòng vệ tối cao (Self-Healing Watchdog)**:
   - Mọi bước click / chờ đều phải bọc qua `Promise.race` timeout 8s.
   - Hàm `emergencyRecover(page)` phải luôn dọn sạch mọi modal rác đang che màn hình.

---

### PHA 4: CHỐT NGHIỆM THU KÉP 3 LỚP (TRIPLE QUALITY GATES)
Trước khi khởi chạy đợt test dài hạn mới, Agent phải tự mình vượt qua cả 3 chốt kiểm soát cục bộ:

```bash
# Chốt 1: Toàn bộ Unit & Integration Test phải PASS 100%
npx vitest run

# Chốt 2: TypeScript Type Check & Vite Production Build sạch 100% (0 lỗi)
npm run build

# Chốt 3: Playwright Mobile UI Check đạt 100% PASS trên cả 360px & 390px
npm run ui:check -- http://localhost:3000
```
*(Nếu bất kỳ chốt nào bị FAIL, Agent phải khắc phục triệt để trước khi chuyển sang Pha 5).*

---

### PHA 5: TÁI KHỞI ĐỘNG CHU KỲ TEST 200 NGÀY TIẾP THEO (NEXT ROUND LAUNCH)
1. **Khởi động tiến trình test nền mới**:
   ```bash
   node scripts/overnight-browser-monkey.mjs --hours=8 --days=200 --headless=true
   ```
2. **Ghi nhận trạng thái vào bảng điều phối**:
   - Cập nhật dòng `[Lock Task]` / `[Audit Log]` vào [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md).
3. **Commit Git đồng bộ**:
   - Format: `chore(loop): complete round <N>, implement <feature>, evolve monkey test and launch round <N+1>`.

---

## 3. BẢNG CHECKLIST LOOP ENGINEER MỖI ĐỢT TEST

Mỗi Agent khi nhận ca kiểm toán hoặc nâng cấp phải tự đánh dấu kiểm tra:

- [ ] **1. Đợt test trước đã cán đích an toàn?** (100–200 ngày, 0 crash unhandled, Zero DOM Leak).
- [ ] **2. Mã nguồn mới tuân thủ nghiêm ngặt 5 Zone cố định?** (Không đè chảo dầu, không che nút bấm).
- [ ] **3. Bot test tự hành đã được dạy tính năng mới chưa?** (Đã bổ sung selectors, hành vi bấm, tự đóng modal).
- [ ] **4. Bot test có bị treo khi gặp giao diện mới không?** (Chạy thử 2–3 ngày local kiểm chứng trước khi thả treo máy).
- [ ] **5. Vitest PASS 100%?** (Toàn bộ test suite không có bài nào bị đứt gãy logic).
- [ ] **6. Build production thành công 0 lỗi TypeScript?**
- [ ] **7. UI Check PASS 100% trên 360px & 390px?** (Touch target $\ge 44\text{px}$, 0 tràn ngang, 0 lỗi console).
- [ ] **8. Đã khởi chạy đợt test tiếp theo trong background với `--isDaemon=true`?**
- [ ] **9. Đã cập nhật nhật ký kiểm toán vào `docs/phan-cong.md` và commit Git?**

---

## 4. MA TRẬN TRÁCH NHIỆM TRONG VÒNG LẶP (RESPONSIBILITY IN LOOP)

| Agent | Nhiệm Vụ Trong Pha Code | Nhiệm Vụ Trong Pha Nâng Cấp Test Bot |
|---|---|---|
| **🎨 Gemini 1 (UI)** | Tái cấu trúc CSS, 5 Zone, Drawer, Emote Balloon, nạp icon pixel thuần Việt. | Bổ sung selectors UI vào bot, kiểm tra touch target $\ge 44\text{px}$ và đo đạc collision. |
| **⚙️ Gemini 2 (Core)** | Thuật toán kinh tế, giỏ hàng, kho FIFO, logic phục vụ Mega-Button, Gacha nhân sự. | Cập nhật luồng logic cho bot, đảm bảo bot biết mua sắm kho, thay dầu và ký hợp đồng nhân viên. |
| **📖 Gemini 3 (Story)** | Rút gọn thoại dài sang Emote + Ticker Rail đáy, phát triển lore 12 nhân vật và minigame. | Dạy bot xử lý các thoại phân nhánh ký sự cư dân và các minigame cốt truyện không bị kẹt. |
| **👑 Claude Lead & Auditor** | Review Data Contract `src/types/game.ts`, duyệt Git diff của cả 3 Gemini. | Thực thi 3 chốt kiểm định kép (`vitest` + `build` + `ui:check`), phê duyệt xuất bản đợt test mới. |

---

## 5. VÍ DỤ ĐIỂN HÌNH VÒNG LẶP TIẾN HÓA QUA TỪNG ĐỢT (CASE STUDIES)

Để mọi Agent hình dung rõ ràng cách thực thi ở bất kỳ đợt nào trong tương lai (Đợt 9, 10, 11...):

### Ví Dụ 1: Đợt 8 ➔ Đợt 9 (Tái Thiết Kế UI Mobile & Mega-Button)
1. **Pha 1 (Thu hoạch Đợt 8)**: Đạt 186/200 ngày, 0 crash, DOM nodes 357–473 (sạch). Phát hiện: Header có quá nhiều nút bấm làm chật chội màn hình 360px.
2. **Pha 2 (Nâng cấp Codebase)**: 
   - Gom các nút phụ (Âm thanh, Hướng dẫn, Reset, Thống kê) vào Hamburger Drawer `#header-quick-drawer`.
   - Chuyển nút phục vụ thành Mega-Button ngón cái `#btn-mega-thumb-action` ở Zone 5 (đáy màn hình).
   - Thêm Phiếu Order Gỗ Mini `.order-wood-ticket` và Stardew Emote Balloon.
3. **Pha 3 (Tiến hóa Test Bot)**:
   - Dạy `overnight-browser-monkey.mjs` biết:
     - Thỉnh thoảng bấm `#btn-header-drawer` để kiểm tra menu phụ, sau đó bấm `#btn-close-header-drawer` để đóng.
     - Tương tác phục vụ thông qua `#btn-mega-thumb-action`.
     - Click trực tiếp vào `.order-wood-ticket` để kiểm tra chi tiết đơn hàng.
4. **Pha 4 (Nghiệm thu kép)**: Vitest 655/655 PASS, Build sạch 0 lỗi, UI Check 14/14 checks PASS trên 360px & 390px.
5. **Pha 5 (Khởi chạy Đợt 9)**: Chạy test nền 200 ngày với bộ kịch bản mới.

### Ví Dụ 2: Đợt 9 ➔ Đợt 10 (Hệ Thống Nhân Sự Hẻm & Mini-Game Lắc Gà)
1. **Pha 1 (Thu hoạch Đợt 9)**: Phân tích hiệu năng giao diện mới, xác nhận Drawer và Mega-Button hoạt động mượt mà suốt 200 ngày.
2. **Pha 2 (Nâng cấp Codebase)**:
   - Thêm tab Nhân Sự: Tuyển dụng 4 nhân viên (Bé Ba Phụ Bếp, Chú Bảy Shipper...).
   - Thêm Mini-game Lắc Gà khi khách gọi món đặc biệt.
3. **Pha 3 (Tiến hóa Test Bot)**:
   - Dạy bot vào Tab Nhân Sự định kỳ mỗi 5 ngày, bấm chiêu mộ nhân viên nếu số dư tiền $> 500.000đ$.
   - Dạy bot tự động giải Mini-game Lắc Gà (click vào thanh lực gia vị) khi xuất hiện modal minigame.
4. **Pha 4 (Nghiệm thu kép)**: Bổ sung unit tests cho Staff System & Minigame, chạy Vitest + Build + UI Check.
5. **Pha 5 (Khởi chạy Đợt 10)**: Bắt đầu bài test 200 ngày có hệ thống nhân sự tự vận hành.

---

## 6. GIAO THỨC CHỐNG HỒI QUY & XỬ LÝ SỰ CỐ (ANTI-REGRESSION & FALLBACK)

Trong quá trình thực hiện vòng lặp, nếu xảy ra sự cố, Agent phải tuân thủ nghiêm ngặt:

1. **Nguyên tắc "Chạy Thử Cục Bộ Trước Khi Thả Xuyên Đêm"**:
   - Sau khi nâng cấp bot test ở Pha 3, **BẮT BUỘC** chạy thử bot cục bộ 2–3 ngày (`node scripts/overnight-browser-monkey.mjs --days=3`) để xác nhận bot bấm trúng selectors mới và không bị kẹt.
2. **Kẹt Modal hoặc Timeout > 8s**:
   - Nếu bot bị kẹt ở một màn hình mới, kiểm tra `emergencyRecover(page)` trong `scripts/overnight-browser-monkey.mjs`. Đảm bảo mọi modal mới đều có nút đóng hoặc cơ chế bấm ra ngoài overlay.
3. **Rollback Có Kiểm Soát**:
   - Nếu tính năng mới làm vỡ bố cục hoặc gây crash unhandled khiến bot không thể vượt qua Ngày 50 sau 2 lần thử vá, thực hiện `git stash` hoặc revert nhánh tính năng đó, bảo toàn trạng thái ổn định của Đợt trước và báo cáo Claude Lead.

---

## 7. MẪU BÁO CÁO KẾT THÚC CHU KỲ (ROUND COMPLETION TEMPLATE)

Agent khi hoàn thành chu kỳ test và nâng cấp code cần điền mẫu báo cáo sau vào `docs/phan-cong.md`:

```markdown
### [Báo Cáo Nghiệm Thu Chu Kỳ Loop Engineer - Đợt N]
- **Thời gian kiểm thử**: [Từ HH:MM đến HH:MM]
- **Số ngày hoàn thành**: [X] / 200 ngày
- **Chỉ số sinh tồn**:
  - Unhandled Crashes: 0
  - Hang / Freeze Timeouts: [Số lần tự gỡ kẹt]
  - DOM Nodes: [Min - Max nodes] (Tiêu chuẩn: < 500 nodes)
- **Tính năng mới được nâng cấp (Pha 2)**:
  - [Mô tả tính năng 1]
  - [Mô tả tính năng 2]
- **Tiến hóa kịch bản Test Bot (Pha 3)**:
  - [Các selector & hành vi mới được thêm vào scripts/overnight-browser-monkey.mjs]
- **Kết quả 3 Chốt Nghiệm Thu Kép (Pha 4)**:
  - Vitest: PASS [X/X tests, 100%]
  - Build: PASS [0 lỗi TypeScript, Bundle size: X KB]
  - UI Check (360px & 390px): PASS [14/14 checks]
- **Kế hoạch tiếp theo (Pha 5)**:
  - Khởi chạy Đợt [N+1] với thời lượng [X] giờ / 200 ngày.
```

---

*Tài liệu này có hiệu lực vĩnh viễn xuyên suốt toàn bộ vòng đời dự án Tiệm Gà Nhà Tui. Mọi Agent tham gia pair-programming đều phải lấy tài liệu này làm kim chỉ nam hành động.*

