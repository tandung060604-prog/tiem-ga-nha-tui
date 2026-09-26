# Tiệm Gà Nhà Tui — Review mã nguồn & Kế hoạch tối ưu

Ngày review: 26/09/2026 · Phạm vi: toàn bộ `src/`, `public/`, `index.html`, GDD `Kế hoạch game Tiệm Gà Nhà Tui.md`
Trạng thái build: `tsc --noEmit` sạch (strict mode). Chưa có test, chưa có git history riêng cho thư mục này.

Tài liệu đi kèm:
- [02-story-bible-v2.md](02-story-bible-v2.md): tuyến truyện viết lại
- [gemini/brief-giao-dien.md](gemini/brief-giao-dien.md): brief UI/website gửi Gemini
- [gemini/brief-asset.md](gemini/brief-asset.md): danh sách asset + prompt gửi Gemini

---

## 1. Tóm tắt

Prototype đã có đủ khung: 3 pha ngày, minigame chiên, kho, nâng cấp, nhân viên, review GenZ, thẻ chia sẻ, truyện Hẻm 1102, Thỏ Cam. Nhưng **nhiều hệ thống mới chỉ có giao diện, chưa có tác dụng lên gameplay**, và có **2 lỗi tiền tệ nghiêm trọng** làm sai toàn bộ cân bằng. Tuyến truyện bị **lộ kết thúc ngay ngày 28** (trong khi kết thúc thật ở ngày 210). Ảnh Thỏ Cam hiện tại **vi phạm bản quyền Miffy**.

Thứ tự ưu tiên: P0 sửa lỗi + pháp lý → P1 hiệu năng/khung type-safe → P2 UX màn bán hàng → P3 story v2 → P4 art thật từ Gemini → P5 Jev + viral.

---

## 2. Lỗi nghiêm trọng (P0)

| # | Lỗi | Vị trí | Hậu quả | Cách sửa |
|---|---|---|---|---|
| 1 | **Doanh thu cộng 2 lần**: giao món đã `money += totalPrice + tip`, cuối ngày lại `money += ledger.netProfit` (netProfit đã gồm grossRevenue + tips) | [main.ts:789-792](../src/main.ts#L789-L792), [main.ts:883](../src/main.ts#L883) | Tiền tăng gấp đôi, cân bằng chương vô nghĩa | Tiền vào ví realtime khi giao; cuối ngày chỉ trừ chi phí cố định (lương, mặt bằng, điện nước, hoa hồng) |
| 2 | **Chi phí nguyên liệu trừ 2 lần**: mua kho đã trừ tiền, chiên lại cộng `ingredientCost += 17000` rồi trừ trong ledger | [InventoryTab.ts:687](../src/ui/components/InventoryTab.ts#L687), [main.ts:613](../src/main.ts#L613), [main.ts:636](../src/main.ts#L636) | Người chơi bị trừ tiền oan | Ledger ghi "giá vốn đã dùng" chỉ để hiển thị, không trừ lại |
| 3 | **Order không thể làm được**: khách gọi ngẫu nhiên mọi món đã mở (Nước ngọt ngay chương 1, Mì Ý, Burger…) nhưng bếp chỉ có nút Gà/Khoai | [orders.ts:663](../src/core/orders.ts#L663) | Khách chắc chắn bỏ về, tụt sao oan | Mỗi món khai báo `station`; chỉ sinh order cho món có trạm đã mở; thêm trạm Nước (tap tủ lạnh) |
| 4 | Chọn sốt Cay khi đang chiên **khoai** → ra "Gà Sốt Cay" | [cooking.ts:492](../src/core/cooking.ts#L492) | Sai món | Sốt chỉ áp cho gà; sốt là bước riêng sau khi vớt |
| 5 | Chất lượng không ảnh hưởng gì: gà sống/cháy vẫn giao được, đủ tiền; `good` không bao giờ xuất hiện | [cooking.ts:458-463](../src/core/cooking.ts#L458-L463) | Minigame chiên mất ý nghĩa | Sống: khách từ chối; Cháy: -50% tiền + review xấu; thêm vùng `good` hai bên `perfect` |
| 6 | Thưởng thư Thỏ Cam `rating` cộng thẳng vào `overall`, nhưng hôm sau `overall` được tính lại từ 5 tiêu chí → **thưởng biến mất** | [main.ts:816-817](../src/main.ts#L816-L817) vs [reviewsEngine.ts:820](../src/core/reviewsEngine.ts#L820) | Phần thưởng "+1.0 sao" là giả | Thưởng vào tiêu chí cụ thể hoặc thành buff có thời hạn |
| 7 | `cheese_fries` không tồn tại trong menu (đúng là `shake_fries`) | [mysteryBunny.ts:53](../src/content/mysteryBunny.ts#L53), [orders.ts:54](../src/core/orders.ts#L54) | Rơi về fallback âm thầm | ID món thành kiểu literal union, TS bắt lỗi lúc build |
| 8 | Nhập thêm 5 miếng làm **reset hạn dùng cả lô cũ** | [InventoryTab.ts:690](../src/ui/components/InventoryTab.ts#L690) | Lách luật hạn dùng | Kho theo lô (FIFO): `batches: {amount, expiresOnDay}[]` |
| 9 | Ảnh `mystery_bunny.png` là Miffy (Dick Bruna / Mercis BV) | [public/assets/characters/](../public/assets/characters/) | Rủi ro pháp lý cao khi viral | Thay bằng thiết kế mới (xem brief asset) trước mọi lần public |
| 10 | Tên tiệm người chơi nhập được nhét thẳng vào `innerHTML` | [Header.ts](../src/ui/components/Header.ts), [main.ts:988](../src/main.ts#L988) | XSS khi làm tính năng "Ghé tiệm bạn" | Hàm `escapeHtml()` dùng chung; giới hạn 24 ký tự |

### Hệ thống "có mà như không" (P0–P1)

- `EconomyEngine.calculateDailyCustomerCount` **không được gọi ở đâu**: số khách/ngày thực chất do timer cố định.
- Hiệu ứng sự kiện (`customerMultiplier`, `deliveryMultiplier`, `priceMultiplier`) **không áp dụng**; sự kiện chọn theo vòng lặp `(day-1) % 6`, không ngẫu nhiên; Kiểm tra vệ sinh không phạt.
- Bonus nâng cấp Bếp (`speed`, `taste`), Vận hành, `capacity` **không được đọc**. Chỉ Marketing (trong hàm không được gọi) và Không gian (kiên nhẫn) có tác dụng.
- Nhân viên chỉ tốn lương, **không làm gì**; `mood` không đổi theo ngày; trait không có hiệu ứng.
- Nhiệm vụ khách bí ẩn không bao giờ hoàn thành (`isCompleted` là hằng trong content, `completedQuests` không được ghi); lựa chọn "bán công thức 15 triệu" không có UI chọn.
- `averageWaitTimeSec` bị hardcode `20`, `orderSummary` review hardcode.
- Ca bán dài ~54 giây thật ([main.ts:523](../src/main.ts#L523)), GDD yêu cầu 4–5 phút.
- Qua chương bằng `alert()` gọi bên trong state updater; điều kiện qua chương là **giữ** đủ tiền → khuyến khích không nâng cấp (anti-pattern "tích tiền").

---

## 3. Hiệu năng & UX kỹ thuật (P1)

**Vấn đề lớn nhất:** vòng `requestAnimationFrame` gọi `this.render()` mỗi frame ([main.ts:573](../src/main.ts#L573)), tức là:
- Thay `innerHTML` toàn màn hình + header 60 lần/giây, gắn lại toàn bộ event listener mỗi frame.
- **Nút bị thay giữa lúc bấm** → `pointerdown` và `pointerup` rơi vào hai element khác nhau → `click` không bắn. Trên điện thoại, người chơi sẽ thấy "bấm không ăn". Đây là lỗi UX số 1.
- Mỗi `stateManager.update` ghi `localStorage` đồng bộ (chiên 1 miếng = 2 lần ghi).

**Hướng sửa (không cần framework):**
1. Render khung màn một lần mỗi pha; mỗi frame chỉ cập nhật đúng node thay đổi: đồng hồ (`textContent`), thanh kiên nhẫn (`transform: scaleX`), kim đo chiên (`translateX`). Chỉ render lại danh sách khách khi hàng đợi đổi.
2. **Event delegation**: một listener trên `#main-view`, đọc `data-action` (kiểu literal union), không gắn lại listener.
3. Lưu game có debounce (500ms) + lưu ngay khi đổi pha / `visibilitychange`.
4. Bỏ ~200 thuộc tính `style="..."` inline trong `ui/` và `main.ts`, chuyển sang class + token CSS (brief Gemini dùng lại đúng tên class).
5. Thay `alert/confirm` bằng modal trong game; chuyển nút 🔄 xóa save ra khỏi header (quá dễ bấm nhầm) vào Cài đặt, xác nhận 2 bước.

---

## 4. Kiến trúc type-safe (P1)

Nguyên tắc: tận dụng thứ đã có (TypeScript strict, DOM, CSS), chỉ thêm thư viện khi thật cần. Chưa chuyển sang Phaser ở M1: DOM + CSS transform đủ cho quầy nhìn thẳng; xét lại khi cần sprite animation dày ở chương 3+.

1. **tsconfig**: bật thêm `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`, `moduleResolution: "Bundler"`.
2. **ID an toàn từ content**: `export const MENU = [...] as const satisfies readonly MenuDef[]` → `type MenuId = typeof MENU[number]['id']`. Lỗi kiểu `cheese_fries` sẽ không build được.
3. **Command + reducer thuần** (đúng như GDD và như `local_overcooked` tách `src/sim`):
   ```ts
   type Command =
     | { type: 'fry/start'; item: FryableId }
     | { type: 'fry/lift' }
     | { type: 'order/serve'; orderId: OrderId }
     | { type: 'stock/buy'; itemId: StockId; qty: number }
     | { type: 'day/tick'; dtMs: number };
   function apply(s: GameState, c: Command, rng: Rng): GameState { switch (c.type) { /* … */ default: return assertNever(c); } }
   ```
   UI chỉ `dispatch(command)`; `core/` không import DOM hay `audio` (âm thanh nghe theo event phát ra từ reducer).
4. **Branded types** cho tiền và thời gian: `type VND = number & { readonly __brand: 'VND' }` tránh cộng nhầm "giây" với "đồng".
5. **Xác thực dữ liệu ở biên**: save game và response API đi qua schema (Zod, hoặc Valibot nếu cần nhẹ hơn). Save có `saveVersion` + chuỗi `migrate`.
6. **RNG có seed** (mulberry32 ~10 dòng) thay mọi `Math.random()` trong `core/`, chuẩn bị cho Thử thách ngày.
7. **Vitest** cho `core/` + script `balance-sim` chạy 210 ngày headless (chỉ làm được sau bước 3).

---

## 5. Tối ưu UI/UX (P2)

### Màn Mở bán (quan trọng nhất)
- Bố cục dọc 9:16 theo vùng ngón cái: trên = HUD (đồng hồ dạng vòng, tiền, sao); giữa = hàng khách (tối đa 3 thẻ nhìn thấy); dưới = chảo lớn + khay + nút giao, nằm trong 40% dưới màn hình.
- **Chạm vào khách để giao cho khách đó**, không bắt buộc giao người đầu hàng.
- Order hiển thị bằng icon món to, chữ phụ; kiên nhẫn dùng cả màu + biểu cảm mặt (không chỉ màu, tốt cho người mù màu).
- **Juice** (bài học từ các game quản lý/nấu ăn): số tiền bay lên, rung nhẹ `navigator.vibrate(15)` khi Perfect, khói + rung màn khi cháy, hạt lấp lánh vùng vàng, chuỗi Perfect liên tiếp nhân tip (x1.2, x1.5…).
- **Bong bóng suy nghĩ realtime** trên đầu khách (học từ hệ "guest thoughts" của OpenRCT2): "đợi lâu quá 😤", "dầu thơm ghê", dẫn thẳng vào review cuối ngày → người chơi hiểu nguyên nhân ngay trong ca.
- Tạm dừng khi rời tab (`visibilitychange`).

### Màn Chuẩn bị
- **Mở giao diện dần theo tiến trình** (bài học từ A Dark Room): ngày 1 chỉ có Kho + nút Mở bán; Nâng cấp mở ngày 2; Nhân viên mở chương 2; Sổ tay/Truyện khi có nội dung. Hiện ngày 1 có 5 tab + 2 nút truyện, quá tải.
- Thẻ "Dự báo hôm nay": số khách dự kiến (dùng `calculateDailyCustomerCount`), thời tiết/sự kiện, và nút **"Nhập theo gợi ý"** một chạm.
- Tiến độ chương dùng **mốc hành động** ("Đặt cọc mặt bằng 5.000.000đ" là một nút mua) thay vì giữ tiền.

### Tổng kết ngày
- Biểu đồ radar 5 tiêu chí + mũi tên tăng/giảm so với hôm qua (đúng GDD).
- Một CTA chính "Ngày tiếp theo"; chia sẻ là CTA phụ nhưng có preview ảnh thẻ.
- Chuyển chương bằng màn cutscene (story v2), không dùng `alert`.

### Onboarding
- Ngày 1 là **tutorial có Bác Ba dẫn** (3 bước chiên → vớt → giao), thay modal chữ chào mừng.

### Truyện
- Bỏ modal đọc tường chữ dài. Chuyển sang **cảnh hội thoại ngắn kiểu visual novel** (chân dung + 4–10 câu, có nút Bỏ qua), bản văn xuôi dài thành phần sưu tập "Sổ Hẻm 1102". Chi tiết ở story bible v2.

---

## 6. Bài học từ các repo/game mã nguồn mở

| Repo | Học gì | Áp dụng vào Tiệm Gà |
|---|---|---|
| [patrickdeanfox/local_overcooked](https://github.com/patrickdeanfox/local_overcooked) (Phaser 3 + TS) | Mô phỏng bếp thuần TS, tất định, không phụ thuộc engine (`src/sim/`), render tách riêng | Reducer `core/` + test + balance-sim; mô hình trạm (fryer, sauce, drink) |
| [inkle/inkjs](https://github.com/inkle/inkjs) + [inkle/ink](https://github.com/inkle/ink) | Ngôn ngữ viết truyện rẽ nhánh, JS thuần không phụ thuộc, biến truyện đọc được từ game | Viết cảnh story v2 bằng `.ink`, biên kịch sửa không cần sửa code; lựa chọn (bênh Dũng / bán công thức) đọc/ghi biến game |
| [doublespeakgames/adarkroom](https://github.com/doublespeakgames/adarkroom) | Mở giao diện dần theo tiến trình, chữ ngắn gây tò mò | Tab/nút xuất hiện theo chương; thư Thỏ Cam là câu hỏi mở chứ không kể hết |
| [OpenRCT2/OpenRCT2](https://github.com/OpenRCT2/OpenRCT2) | Hệ "guest thoughts": mỗi khách có suy nghĩ ngắn, gom lại thành chẩn đoán cho người chơi | Bong bóng suy nghĩ realtime → review → Cố vấn gợi ý |
| [lihaozhe013/cozy-bistro](https://github.com/lihaozhe013/cozy-bistro) (Vite + TS + Phaser 3) | Màn xây dựng/trang trí quán có mặt tiền, phòng ăn, bếp | Tham khảo cho màn trang trí isometric ở chương 3+ |
| [abrahamambedkar-debug/food-empire](https://github.com/abrahamambedkar-debug/food-empire) (Phaser) | Thuê NPC tự làm việc, đối đầu đầu bếp đối thủ | Tham khảo cho nhân viên tự động hóa trạm và đối thủ chương 4 |

Ghi chú: hai repo cuối là dự án nhỏ, chỉ dùng làm tham khảo cấu trúc, không sao chép asset/mã.

---

## 7. Dùng Jev (TypeSafe) ở đâu và không dùng ở đâu

Jev là mô hình ra **quyết định có kiểu** (câu hỏi `noul` có/không, `choice` chọn 1, `score` thang điểm), trả xác suất + độ tin cậy, không sinh văn bản. Model `typesafe/jev` có trên Cloudflare Workers AI (`env.AI.run`) và OpenRouter; giá $0.042/1M token vào, ra miễn phí, context 32k.

**Dùng (tối đa 1 lần gọi/ngày game, gom nhiều câu hỏi):**
| Câu hỏi | Loại | Đầu vào (state) | Dùng để |
|---|---|---|---|
| `review_template` | choice | Tóm tắt ca bán + 6–10 mẫu review đã lọc sẵn theo tiêu chí yếu nhất | Chọn câu review hợp ngữ cảnh nhất (đa dạng hơn random) |
| `review_stars` | score 1–5 | Như trên | Sao của review nổi bật |
| `advisor_focus` | choice | 5 tiêu chí + các nâng cấp **đủ tiền mua** | Cố vấn chỉ đúng 1 nâng cấp |
| `staff_quit_<id>` | noul | Tâm trạng, lương, số giờ làm (chương 2+) | Nhân viên nghỉ / "đăng story bóc phốt" |

**Không dùng:** trong vòng lặp frame, trong chấm điểm Thử thách ngày (phải tất định để chống gian lận), trong balance-sim.

**Kiến trúc:**
- Client gọi `POST /api/day-decisions` trên Cloudflare Worker của mình; Worker gọi `env.AI.run('typesafe/jev', { state, questions })`. Không để API key trên client.
- Câu hỏi khai báo `as const` → suy ra kiểu câu trả lời; response đi qua schema trước khi vào game.
- Timeout 800ms → rơi về luật cục bộ hiện có (`ReviewsEngine`). Game offline vẫn chơi đủ.
- Chi phí ước tính: ~2k token/ngày game × $0.042/1M ≈ không đáng kể.

**Dùng trong quá trình làm (dev-time):** chạy Jev hàng loạt để gắn nhãn 300–500 mẫu review (tiêu chí, khoảng sao, độ hài) và bắt mẫu bị gán sai tiêu chí, thay cho việc tự đọc từng câu.

---

## 8. Lộ trình thực hiện

| Giai đoạn | Việc | Kết quả kiểm chứng |
|---|---|---|
| **P0 — Sửa lỗi & pháp lý** (1–2 ngày) | Lỗi #1–#10 ở mục 2; gỡ ảnh Miffy, dùng placeholder | Test tay: 1 ngày chương 1 cho lãi đúng bằng doanh thu − chi phí |
| **P1 — Khung type-safe & hiệu năng** (3–4 ngày) | Command/reducer, ID literal, RNG seed, render cục bộ + event delegation, save debounce, Vitest | Không mất tap trên điện thoại; test `core` xanh; balance-sim chạy 210 ngày |
| **P2 — UX màn bán hàng & chuẩn bị** (4–5 ngày) | Bố cục vùng ngón cái, chạm khách để giao, juice, thought bubbles, mở tab dần, dự báo + nhập gợi ý, tutorial Bác Ba, radar | 5 người test nói chiên "sướng tay" (cửa M0 của GDD) |
| **P3 — Story v2** (3–4 ngày) | Nội dung theo `02-story-bible-v2.md`, cảnh hội thoại, trigger theo chương, tách nhân vật cốt truyện khỏi generator khách ngẫu nhiên | Không cảnh nào lộ nội dung chương sau |
| **P4 — Art thật** (song song, phụ thuộc Gemini) | Gửi 2 brief trong `docs/gemini/`, nhận asset, thay emoji dần | Asset đúng kích thước/tên file trong brief |
| **P5 — Jev & viral** (3 ngày) | Worker `/api/day-decisions`, fallback, thẻ review, Gà Wrapped | Tắt mạng vẫn chơi được; có mạng thì review đa dạng hơn |

## 9. Về các skill đã nêu

Các skill `omni router` (OmniRoute), `ponytail`, `graphify` **chưa được cài trong phiên Claude Code này**, nên mình chưa gọi được. Trong bản review này mình áp dụng tinh thần của chúng bằng tay:
- *ponytail* (ưu tiên tái dùng thứ có sẵn): giữ DOM + CSS + TS strict, chưa kéo Phaser/Preact vào; chỉ đề xuất thêm schema validator và Vitest.
- *graphify* (bản đồ phụ thuộc mã): sơ đồ phụ thuộc hiện tại là `main.ts` → mọi thứ; `core/cooking.ts` và `core/orders.ts` import `audio`/`content` → không tách được để test. P1 xử lý điểm này.
- Nếu muốn dùng thật, cài các skill đó vào `.claude/skills/` rồi mình chạy `/graphify` trên repo sau P1.
