---
description: Quy tắc phối hợp phát triển song song giữa Gemini và Claude trong Anti IDE
globs: *
alwaysApply: true
---

# Quy tắc làm việc song song (Gemini & Claude)

1. Phân chia vai trò:
   - Gemini: UI Components (`src/ui/`), Styles (`src/styles/`), Design Deliverables (`docs/gemini/`), Asset generation (`public/assets/`).
   - Claude: Core Engine (`src/core/`), State logic, Economy balance, Story text novel (`docs/02-story-bible-v2.md`).
2. Giao tiếp Contract-First qua `src/types/game.ts`.
3. Không ghi đè thư mục của nhau.
4. Kiểm tra hợp lệ bằng `npm run build` trước khi hoàn tất.
