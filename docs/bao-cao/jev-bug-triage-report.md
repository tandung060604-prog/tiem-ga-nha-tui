# NHẬT KÝ ĐÁNH GIÁ VÀ XỬ LÝ BUG BẰNG TYPESAFE AI JEV


### 🐞 [01:26:09 30/9/2026] UI Freeze tai Title Screen khi Hot Reload
- **Triệu chứng:** Trinh duyet reload vao Title Screen nhung khong tu click Tiep Tuc Mo Ban
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (514ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 53.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 69.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 66.0%)
  - **Số ngày chạy bù khuyến nghị:** Cấp 2.1100000000000003 (~undefined ngày)
---

### 🐞 [02:02:49 30/9/2026] Locators conflict in Selling Phase: .fryer-card blocks frying/drinks
- **Triệu chứng:** Selector .fryer-card matched container div and was clicked every tick, returning true and preventing fry/drink actions; fastBtn lacked active check
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (461ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 66.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 36.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 16.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [03:04:34 30/9/2026] Prep Phase Chicken Restock Loop
- **Triệu chứng:** Monkey clicked start selling repeatedly because chicken stock was empty and inventory buy button had too short timeout
- **Vị trí:** `src/main.ts and scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (638ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 63.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 83.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 58.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `200` ngày chơi
---

### 🐞 [08:05:48 30/9/2026] Softlock tai Modal Ket Qua Su Co Hang Ngay (btn-incident-continue)
- **Triệu chứng:** Sau khi chon su co dau ngay, modal ket qua reaction xuat hien voi nut #btn-incident-continue nhung khong co handler rieng tai top-level monkey loop va emergencyRecover khong co selector nay, dan den modal che toan man hinh va monkey bi ket vong lap bam Mo Ban
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (462ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 94.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 94.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 65.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:06:08 30/9/2026] Test Key
- **Triệu chứng:** Test symptom
- **Vị trí:** `Test context` 
- **Đánh giá Jev (518ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 96.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 56.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:13:11 30/9/2026] Bad Police Ending Softlock & Lack of Oil Changing in Monkey
- **Triệu chứng:** Log stops at [08:13:46] 🏆 Xử lý Ending Modal -> Tiếp tục hành trình... and freezes indefinitely on a zombie selling screen with stopped loop because #btn-close-ending was clicked instead of restart, and monkey never changes dirty oil causing 3 strikes game over.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs, src/main.ts` 
- **Đánh giá Jev (456ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 47.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 72.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:48 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (574ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---


### 🐞 [09:59:51 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (604ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 26.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:51 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (606ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 35.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:54 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (1051ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:55 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (563ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:55 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (563ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:55 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (561ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:56 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (574ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 35.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:56 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (553ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:56 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (570ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:58 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737167
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (515ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:59 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (563ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 33.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [09:59:59 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (590ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:01 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (586ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:02 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (688ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:02 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (666ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:03 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (557ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:05 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (1065ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:06 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (597ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:06 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (662ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:06 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (618ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `contract_first_type_fix` (Độ tin cậy: 25.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:06 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (749ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 32.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:10 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (619ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 33.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:11 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (597ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:11 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (683ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 33.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:12 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (637ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 33.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:12 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (730ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 34.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:12 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (662ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:18 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (1138ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 26.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:22 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (905ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 22.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:25 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (648ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:25 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (702ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 32.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:25 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (677ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:26 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (700ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:26 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (687ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 30.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:27 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (687ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:27 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (681ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:28 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (704ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:28 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (667ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 32.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:28 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (708ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 23.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:29 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (605ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:29 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (725ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:29 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737184
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (628ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:30 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (580ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:30 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (624ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:31 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (561ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:31 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (655ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 37.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (730ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 23.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (669ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 29.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (675ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (644ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 25.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (593ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:32 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (787ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 26.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:33 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (530ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 32.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:48 30/9/2026] Crash in runSellingAction due to undefined this.state
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money') at AppController.runSellingAction
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (684ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 32.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:50 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (748ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 25.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:53 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (736ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 35.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:55 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (753ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 28.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:56 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (696ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:58 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (854ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 99.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 27.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:00:59 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (1070ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:01:01 30/9/2026] Page Crash Ngày 24
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'money')     at AppController.runSellingAction (http://localhost:3000/src/main.ts?t=1790737203
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (1526ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 24.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [10:15:48 30/9/2026] (via Jev MCP) Overnight Monkey Test Loop on Oil Change and Playwright Timeout
- **Triệu chứng:** Playwright locator.click timed out after 30000ms with 'waiting for element to be visible, enabled and stable - element is not stable'. In monkey test run, it logged '[10:07:46] 🛢️ Phát hiện dầu xuống cấp/bẩn -> Bấm THAY DẦU 150k...' over 150 times until timeout.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs, src/styles/pixel-theme.css, src/styles/kitchen.css` 
- **Đánh giá Jev (553ms):**
  - **Mức độ (Severity):** `p2_ui_friction` (Độ tin cậy: 74.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 61.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 61.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `200` ngày chơi
---

### 🐞 [11:01:25 30/9/2026] (via Jev MCP) UI Deadlock after Hot Reload at Day 22 due to Intro Cinematic & Prep Loading overlays
- **Triệu chứng:** Server responded with 500 status on module reload, followed by 'Cảnh báo UI Deadlock: Hệ thống đứng yên > 25s tại ngày 22 (src/ui/SellingView.ts)'.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs, src/ui/components/IntroCinematicModal.ts, src/ui/components/PrepLoadingModal.ts` 
- **Đánh giá Jev (511ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 76.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 71.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 92.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [12:03:38 30/9/2026] (via Jev MCP) Kiểm tra kết nối MCP Jev System 1
- **Triệu chứng:** Hệ thống hoạt động trơn tru, kiểm tra khả năng chẩn đoán và phân loại bug của Jev MCP.
- **Vị trí:** `N/A` 
- **Đánh giá Jev (619ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 37.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 79.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [13:01:48 30/9/2026] (via Jev MCP) Kiểm toán chu kỳ 1 Giờ (Iteration 12) - Endurance Test 36 Ngày
- **Triệu chứng:** 0 lỗi, 0 softlock, 0 memory leak. Hệ thống hoàn toàn ổn định và sẵn sàng tiếp tục test ngầm đến 100 ngày.
- **Vị trí:** `N/A` 
- **Đánh giá Jev (719ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 82.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 75.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [14:00:38 30/9/2026] (via Jev MCP) Kiểm toán chu kỳ 1 Giờ (Iteration 13) - Endurance Test 71 Ngày
- **Triệu chứng:** 0 lỗi, 0 softlock, 0 memory leak. Hệ thống hoàn toàn ổn định và sẵn sàng tiếp tục test ngầm hoàn thành mục tiêu 100 ngày.
- **Vị trí:** `N/A` 
- **Đánh giá Jev (486ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 99.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 65.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 79.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [14:49:13 30/9/2026] (via Jev MCP) HOÀN THÀNH 100 NGÀY TEST XUYÊN ĐÊM: 62.523 thao tác, 0 lỗi, 0 crash
- **Triệu chứng:** 0 lỗi runtime, 0 cảnh báo console, 0 deadlock, 0 tràn ngang. Sản phẩm đạt chuẩn phát hành sản xuất thương mại.
- **Vị trí:** `N/A` 
- **Đánh giá Jev (761ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 99.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 65.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 35.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [15:00:14 30/9/2026] (via Jev MCP) Kiểm toán chu kỳ 1 Giờ (Iteration 14) - Khởi động đợt Endurance Test mới
- **Triệu chứng:** Hệ thống hoàn toàn khỏe mạnh. Sẵn sàng khởi chạy đợt test 100 ngày kế tiếp để liên tục rà soát khả năng xuất hiện edge-case bug.
- **Vị trí:** `N/A` 
- **Đánh giá Jev (442ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 100.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 77.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 74.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [15:37:13 30/9/2026] (via Jev MCP) Defensive check cho inventory item batches khi dữ liệu bị sai lệch
- **Triệu chứng:** TypeError: Cannot create property 'batches' on non-object in ensureBatches
- **Vị trí:** `src/core/inventory.ts` 
- **Đánh giá Jev (498ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 77.0%)
  - **Nguyên nhân gốc (Root Cause):** `economy_math` (Độ tin cậy: 38.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 89.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [15:41:28 30/9/2026] (via Jev MCP) escapeHtml crash khi nhận undefined hoặc non-string trong render review
- **Triệu chứng:** TypeError: Cannot read properties of undefined (reading 'replace') at escapeHtml
- **Vị trí:** `src/ui/escapeHtml.ts` 
- **Đánh giá Jev (535ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 99.0%)
  - **Nguyên nhân gốc (Root Cause):** `content_mislabel` (Độ tin cậy: 78.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 87.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [17:02:39 30/9/2026] (via Jev MCP) Vite HMR Transient 500 Network Error during live code editing
- **Triệu chứng:** Vite dev server responded with status 500 briefly during active file write before HMR recompilation finished.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (583ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 94.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 84.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [02:52:54 1/10/2026] (via Jev MCP) UI Deadlock tại Ngày 28 khi hết bột/nước và Vite HMR reload
- **Triệu chứng:** Hệ thống đứng yên > 25s tại ngày 28 do không thể chiên gà (thiếu bột) hoặc rót nước (thiếu nước ngọt), trong khi nút Hết món xin lỗi phụ thuộc random 15%.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` (Ảnh: `logs/screenshots/deadlock-day-28-1790790429151.png`)
- **Đánh giá Jev (526ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 38.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 98.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 25.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [18:02:07 2/10/2026] (via Jev MCP) Tiệm đứng yên ở màn Chuẩn Bị Ngày 7, liên tục bấm BẮT ĐẦU MỞ BÁN
- **Triệu chứng:** Vòng lặp test bot liên tục log 'Bấm BẮT ĐẦU MỞ BÁN Ngày 7' mỗi 2-3s mà không chuyển sang phase bán hàng
- **Vị trí:** `src/main.ts` 
- **Đánh giá Jev (630ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 88.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 89.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 71.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [19:00:38 2/10/2026] (via Jev MCP) Secret Sauce Modal Cooking Buttons Selector Mismatch in Test Bot
- **Triệu chứng:** System idles > 25s during Secret Sauce cooking phase until Watchdog triggers emergencyRecover
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (517ms):**
  - **Mức độ (Severity):** `p2_ui_friction` (Độ tin cậy: 67.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 89.0%)
  - **Chiến lược Fix:** `contract_first_type_fix` (Độ tin cậy: 40.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [08:47:58 3/10/2026] (via Jev MCP) Intro Cinematic Overlay timeout during auto recovery in monkey test
- **Triệu chứng:** locator.click: Timeout 2000ms exceeded waiting for locator('#btn-intro-start-game, #btn-intro-skip-top, #intro-cinematic-overlay, #intro-tap-prompt, .intro-tap-prompt')
- **Vị trí:** `src/ui/components/IntroCinematicModal.ts` 
- **Đánh giá Jev (442ms):**
  - **Mức độ (Severity):** `p2_ui_friction` (Độ tin cậy: 99.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 76.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 46.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `200` ngày chơi
---

### 🐞 [10:51:50 3/10/2026] (via Jev MCP) Quá nhiều khách xử lý không kịp bị ẩn hết các món ăn khách order (Customer Order Item Overflow & Truncation)
- **Triệu chứng:** Customers waiting in queue have their order items clipped or completely hidden when there are multiple items or multiple customers, so the player cannot see what food to prepare or serve.
- **Vị trí:** `src/ui/components/SellingView.ts and src/styles/customers.css` 
- **Đánh giá Jev (416ms):**
  - **Mức độ (Severity):** `p2_ui_friction` (Độ tin cậy: 91.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 85.0%)
  - **Chiến lược Fix:** `contract_first_type_fix` (Độ tin cậy: 21.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [12:00:55 3/10/2026] (via Jev MCP) Page Error ReferenceError: qText is not defined at SellingView.ts:976
- **Triệu chứng:** ReferenceError: qText is not defined in SellingView.ts line 976 during renderSellingView when mapping pending/completed items
- **Vị trí:** `src/ui/components/SellingView.ts` 
- **Đánh giá Jev (719ms):**
  - **Mức độ (Severity):** `p0_blocker` (Độ tin cậy: 42.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 42.0%)
  - **Chiến lược Fix:** `contract_first_type_fix` (Độ tin cậy: 52.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [13:07:00 3/10/2026] (via Jev MCP) Native Dialog Hang in Overnight Monkey and StaffTab confirm
- **Triệu chứng:** Monkey test hangs after Day 4; StaffTab uses native confirm() which blocks headless browser loop and UI thread without auto-dismissal.
- **Vị trí:** `src/ui/components/StaffTab.ts` 
- **Đánh giá Jev (861ms):**
  - **Mức độ (Severity):** `p2_ui_friction` (Độ tin cậy: 53.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 100.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 95.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [16:01:38 3/10/2026] (via Jev MCP) Missing Storylet Choice Button in Overnight Monkey Script
- **Triệu chứng:** Monkey test pauses after Day 1 summary because Night Storylet modal .storylet-choice-btn is not clicked by the monkey bot.
- **Vị trí:** `scripts/overnight-browser-monkey.mjs` 
- **Đánh giá Jev (937ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 26.0%)
  - **Nguyên nhân gốc (Root Cause):** `ui_modal_stack` (Độ tin cậy: 79.0%)
  - **Chiến lược Fix:** `modal_queue_guard` (Độ tin cậy: 95.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [16:13:41 3/10/2026] (via Jev MCP) undefined
- **Triệu chứng:** undefined
- **Vị trí:** `N/A` 
- **Đánh giá Jev (838ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 96.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 59.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 31.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [17:48:38 3/10/2026] (via Jev MCP) Missing character model assets in Night Storylets (Ký Ức Đêm Hẻm 1102)
- **Triệu chứng:** Certain night dialogues lack 2D character model illustrations, breaking visual immersion and visual novel aesthetics.
- **Vị trí:** `src/content/storylets.ts and src/ui/components/StoryletModal.ts` 
- **Đánh giá Jev (457ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 70.0%)
  - **Nguyên nhân gốc (Root Cause):** `content_mislabel` (Độ tin cậy: 84.0%)
  - **Chiến lược Fix:** `contract_first_type_fix` (Độ tin cậy: 73.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---

### 🐞 [18:05:05 3/10/2026] (via Jev MCP) undefined
- **Triệu chứng:** undefined
- **Vị trí:** `N/A` 
- **Đánh giá Jev (463ms):**
  - **Mức độ (Severity):** `p3_minor` (Độ tin cậy: 96.0%)
  - **Nguyên nhân gốc (Root Cause):** `state_lifecycle` (Độ tin cậy: 54.0%)
  - **Chiến lược Fix:** `defensive_nullcheck_fallback` (Độ tin cậy: 41.0%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** `100` ngày chơi
---
