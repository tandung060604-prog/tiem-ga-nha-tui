# QUY ƯỚC ĐIỀU PHỐI MULTI-AGENT (3 GEMINI PRO & CLAUDE PROJECT LEAD)
# Dự Án: Tiệm Gà Nhà Tui (Anti IDE / AGY CLI Environment)

Tài liệu này được tự động nạp vào context của toàn bộ các Agent: **Gemini 1 (UI)**, **Gemini 2 (Core)**, **Gemini 3 (Story)** và **Claude (Project Lead & Auditor)**.

---

## 1. MA TRẬN PHÂN CHIA QUYỀN HẠN (RESPONSIBILITY MATRIX)

| Tác Tử (Agent) | Vai Trò Chuyên Trách | Thư Mục / Tệp Tin Phụ Trách | Trách Nhiệm Cốt Lõi |
|---|---|---|---|
| **🎨 GEMINI 1** | **Frontend & Visual Specialist** | `src/styles/*.css`, `assets-src/**`, `docs/gemini/**` | Phụ trách toàn bộ CSS tokens, animation (popIn, shake, sizzle), chuẩn hóa 1 ngón cái màn 360px & 390px, nạp asset 2D sticker sạch nền, chạy `npm run assets`. |
| **⚙️ GEMINI 2** | **Core Gameplay & Economy** | `src/core/*.ts`, `tests/*.ts`, `src/content/inventory.ts`, `src/ui/components/InventoryTab.ts` | Thuật toán nấu nướng, kho FIFO theo lô, nút `-5` hoàn tiền nguyên liệu, phân tầng mở khóa nguyên liệu (Ngày 1: 5 món cơ bản; ngày sau mở bằng tiền/cấp), bảo đảm 100% test Vitest PASS. |
| **📖 GEMINI 3** | **Narrative Director & Lore** | `src/content/*.ts`, `docs/02-story-bible-v2.md` | Biên kịch 12 nhân vật Hẻm 1102, cây hội thoại phân nhánh tác động chỉ số ngầm Karma (`community`, `craftsmanship`, `ambition`), kịch bản 4 kết thúc (Happy, Open, Bad 3A/3B, Secret). |
| **👑 CLAUDE** | **Chủ Dự Án & Tổng Kiểm Toán (Lead & Auditor)** | `src/types/game.ts`, `docs/phan-cong.md`, Toàn quyền Audit | Điểm giao tiếp duy nhất (Data Contract), review diff của 3 Gemini, chạy bộ công cụ nghiệm thu kép (`ui:check` + `vitest` + `build`), phê duyệt tính năng. |

---

## 2. QUY TẮC PHỐI HỢP & LIÊN KẾT TỰ ĐỘNG (INTER-AGENT COORDINATION)

### Quy tắc 1: Auto-Proceed & Không Chặn Thao Tác
* Cả 3 cửa sổ Gemini CLI đều khởi động với cờ `--dangerously-skip-permissions`.
* Mọi hành động đọc file, tạo file, chỉnh sửa code và chạy script kiểm thử đều được tự động phê duyệt (auto proceed) để 3 Agent chạy hết tốc độ mà không cần User bấm xác nhận từng thao tác.

### Quy tắc 2: Khóa Tác Vụ Qua Bảng Điều Phối (`docs/phan-cong.md`)
* Trước khi chỉnh sửa bất kỳ tệp tin nào, Agent **BẮT BUỘC** ghi 1 dòng `[Lock Task]` vào bảng trạng thái tại [docs/phan-cong.md](file:///d:/AI%20Vin%20Th%E1%BB%B1c%20Chi%E1%BA%BFn/Side%20Project/TiemGaRan/docs/phan-cong.md) kèm danh sách file sẽ thao tác.
* Tuyệt đối không chạm vào file mà Agent khác đang giữ Lock.

### Quy tắc 3: Hiệp Thương Contract-First Qua `src/types/game.ts`
* Khi **Gemini 2** cần lưu trữ thuộc tính mới (ví dụ: `unlockDay`, `unlockCost` cho nguyên liệu, `reputation` cho kho):
  ➔ Tạo đề xuất hoặc cập nhật type chuẩn mực tại `src/types/game.ts`.
* Khi **Gemini 3** cần thêm điểm Karma hoặc nhánh kết cục:
  ➔ Cập nhật định nghĩa `StoryEndingId`, `KarmaScore` tại `src/types/game.ts`.
* Khi **Gemini 1** muốn hiển thị giao diện:
  ➔ Luôn đọc type từ `src/types/game.ts` để render component, không dùng type tự chế.

### Quy tắc 4: Tự Kiểm Chứng Cục Bộ Trước Khi Bàn Giao (Self-Verification Gate)
Không Agent nào được bàn giao task nếu chưa tự vượt qua chốt kiểm tra của mình:
* **Gemini 1:** Chạy `npm run ui:check -- http://localhost:3000` ➔ Phải đạt 100% PASS, 0 FAIL, 0 WARN trên cả 360px & 390px.
* **Gemini 2:** Chạy `npx vitest run` ➔ Toàn bộ test suite phải PASS 100%.
* **Gemini 3:** Chạy `npm run build` ➔ Không có bất kỳ lỗi TypeScript type check nào.

### Quy tắc 5: Nghiệm Thu Tối Cao Bởi Claude Lead
* Sau khi 3 Gemini hoàn thành, User hoặc Gemini thông báo cho Claude Lead.
* Claude Lead thực hiện review toàn bộ git diff, chạy kiểm tra tổng hợp và chốt hoàn thành mốc (Sprint Done).

### Quy tắc 6: Khung Kỹ Sư Vòng Lặp Khép Kín (Loop Engineering Framework)
* Mọi chu kỳ kiểm thử dài hạn (Round 8, 9, 10, 11...) bắt buộc phải tuân thủ nghiêm ngặt quy trình 5 pha và bảng checklist tại [docs/05-loop-engineering-framework.md](docs/05-loop-engineering-framework.md):
  1. **Pha 1 (Thu hoạch)**: Rút trích chỉ số crash, freeze, DOM leak, xuất báo cáo vào `docs/phan-cong.md` & `docs/bao-cao-test-xuyen-dem.md`.
  2. **Pha 2 (Nâng cấp Codebase)**: Triển khai tính năng mới theo Blueprint, bảo đảm 5 Zone cố định không va chạm, touch target $\ge 44\text{px}$.
  3. **Pha 3 (Tiến hóa Test Bot)**: **Tuyệt đối không sửa UI mà giữ nguyên bot test cũ!** Phải cập nhật `scripts/overnight-browser-monkey.mjs` để dạy bot chơi tính năng mới.
  4. **Pha 4 (Nghiệm thu kép 3 lớp)**: Vượt qua cả 3 chốt kiểm định (`vitest run` 100% PASS, `build` 0 lỗi TS, `ui:check` 100% PASS trên 360px & 390px).
  5. **Pha 5 (Tái khởi động)**: Chạy bot test mới với cờ `--days=200`, commit Git và lặp lại vòng tuần hoàn.

