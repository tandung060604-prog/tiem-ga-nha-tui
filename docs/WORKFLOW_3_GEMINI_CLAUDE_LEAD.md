# WORKFLOW ĐIỀU PHỐI MULTI-AGENT: 3 GEMINI PRO & CLAUDE PROJECT LEAD
# Dự Án: Tiệm Gà Nhà Tui (Anti IDE / AGY CLI Environment)

Tài liệu này xác lập quy trình làm việc chuẩn mực, phân chia trách nhiệm và cơ chế kiểm toán tự động giữa **3 Tài Khoản Gemini Pro (chạy độc lập qua CLI)** dưới sự chỉ đạo, nghiệm thu và audit tối cao của **Claude (Chủ Dự Án / Project Lead)**.

---

## 1. SƠ ĐỒ PHÂN VAI & RANH GIỚI TRÁCH NHIỆM (RESPONSIBILITY MATRIX)

```
                            👑 CLAUDE (PROJECT LEAD & AUDITOR)
              [Duyệt kiến trúc · Kiểm toán mã nguồn · Nghiệm thu toàn hệ thống]
                                             ▲
                                             │ (Báo cáo & Hợp đồng Types)
        ┌────────────────────────────────────┼────────────────────────────────────┐
        │                                    │                                    │
  🎨 GEMINI 1                          ⚙️ GEMINI 2                          📖 GEMINI 3
[UI & Visual Specialist]             [Core Engine & Economy]              [Narrative Director]
Profile: gemini-1-ui                 Profile: gemini-2-core               Profile: gemini-3-narrative
Thư mục:                             Thư mục:                             Thư mục:
• src/styles/*.css                   • src/core/*.ts                      • src/content/storyNovel.ts
• assets-src/**                      • tests/*.ts                         • src/content/customers.ts
• docs/gemini/**                     • src/content/inventory.ts           • src/content/menu.ts
• scripts/process-assets.mjs         • src/ui/components/InventoryTab.ts • Thoại phân nhánh & Karma
```

| Tác Tử (Agent) | Vai Trò | Thư Mục / Tệp Tin Phụ Trách | Trách Nhiệm Cốt Lõi |
|---|---|---|---|
| **🎨 Gemini 1** | Frontend & Visual Specialist | `src/styles/*.css`, `assets-src/**`, `docs/gemini/**` | Giao diện CSS, animation popIn/shake, tối ưu 1 ngón cái màn 360/390px, tạo asset 2D sticker sạch nền, chạy `npm run assets`. |
| **⚙️ Gemini 2** | Core Gameplay & Economy Engineer | `src/core/*.ts`, `tests/*.ts`, `src/ui/components/InventoryTab.ts` | Thuật toán 5 vùng chín gà, kho FIFO theo lô, nút `-5` hoàn tiền, phân tầng mở khóa nguyên liệu theo ngày & phí, bảo đảm 100% test Vitest PASS. |
| **📖 Gemini 3** | Narrative Director & Lore Writer | `src/content/*.ts`, `docs/02-story-bible-v2.md` | Biên kịch 100k–200k chữ, 12 nhân vật Hẻm 1102, cây hội thoại phân nhánh tác động chỉ số ngầm Karma (`community`, `craftsmanship`, `ambition`), kịch bản 4 kết thúc. |
| **👑 Claude** | **Chủ Dự Án & Tổng Kiểm Toán (Lead & Auditor)** | `src/types/game.ts`, `docs/phan-cong.md`, Toàn quyền Audit | Thiết kế kiến trúc data contract, review code diff của 3 Gemini, chạy bộ công cụ nghiệm thu kép (`ui:check` + `vitest`), quyết định merge hoặc yêu cầu sửa lại. |

---

## 2. CÁCH KHỞI ĐỘNG 3 TÀI KHOẢN GEMINI RIÊNG BIỆT

Mỗi tài khoản được cấu hình trong 1 thư mục riêng biệt tại `C:\Users\HP\.gemini-profiles\` để không bao giờ bị đá token hay xung đột phiên làm việc.

Bạn chỉ cần click đúp vào các file launcher tương ứng:

1. **Khởi động Gemini 1 (UI):** Chạy [run-gemini-1-ui.bat](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/run-gemini-1-ui.bat) ➔ Đăng nhập Google Account 1.
2. **Khởi động Gemini 2 (Core):** Chạy [run-gemini-2-core.bat](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/run-gemini-2-core.bat) ➔ Đăng nhập Google Account 2.
3. **Khởi động Gemini 3 (Narrative):** Chạy [run-gemini-3-narrative.bat](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/run-gemini-3-narrative.bat) ➔ Đăng nhập Google Account 3.

---

## 3. CHU TRÌNH LÀM VIỆC 5 BƯỚC (5-STEP SPRINT WORKFLOW)

### 📌 Bước 1: Giao Task & Khóa Phạm Vi (Lock & Brief)
* Claude (hoặc User) cập nhật đầu việc vào bảng tại [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md).
* Mỗi Gemini trước khi bắt đầu BẮT BUỘC ghi 1 dòng `[Lock Task]` vào `docs/phan-cong.md` kèm tên các file mình sẽ sửa để các Agent khác không đụng vào.

### ⚡ Bước 2: Chạy Tác Vụ Song Song Độc Lập (Parallel Execution)
* **Gemini 1:** Vẽ style, nạp asset, chỉnh responsive, kiểm tra `npm run assets`.
* **Gemini 2:** Viết logic kho, gắn nút `-5`, lập hàm mở khóa nguyên liệu, viết unit test mới.
* **Gemini 3:** Soạn thảo kịch bản hội thoại phân nhánh, xây dựng các nút thắt Karma và 4 Ending.
* *Quy tắc:* Nếu một bên cần thay đổi dữ liệu cấu trúc (ví dụ: Gemini 2 cần thêm trường `unlockDay` vào `InventoryItem`, Gemini 3 cần thêm `karma` vào `GameState`), hai bên phải cập nhật thống nhất tại [src/types/game.ts](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/src/types/game.ts).

### 🔍 Bước 3: Tự Kiểm Chứng Cục Bộ (Self-Verification)
Trước khi bàn giao, mỗi Gemini phải tự chạy kiểm tra trong terminal của mình:
* **Gemini 1:** `npm run ui:check -- http://localhost:3000` (Phải đạt 100% PASS, 0 FAIL, 0 WARN).
* **Gemini 2:** `npx vitest run` (Toàn bộ test suites phải PASS 100%).
* **Gemini 3:** `npm run build` (Type-check sạch sẽ không lỗi TypeScript).

### 🤝 Bước 4: Đồng Bộ & Bàn Giao (Handoff)
* Mỗi Gemini ghi nhận kết quả hoàn thành vào [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md) kèm mã log nghiệm thu.
* Đồng bộ thông tin quan trọng vào MCP Memory Server.

### 👑 Bước 5: Claude Audit & Quyết Định Phê Duyệt (Claude Lead Review)
Claude (trong Anti IDE hoặc qua bản tổng hợp tại `claude-review-pack/`) thực hiện quy trình kiểm toán 3 lớp:
1. **Code Quality & Architecture Audit:** Rà soát diff xem có vi phạm ranh giới file, rò rỉ bộ nhớ, hoặc phá vỡ cấu trúc State không.
2. **Automated Verification:** Chạy đồng thời `npm run assets` + `npm run ui:check` + `npx vitest run` + `npm run build`.
3. **Gameplay & Narrative Balance:** Đánh giá độ cuốn hút của cốt truyện, tính hợp lý của chỉ số kinh tế và trải nghiệm người dùng cuối.
4. **Phê duyệt:** Đóng mốc phiên làm việc và giao tiếp task cho chặng kế tiếp.
