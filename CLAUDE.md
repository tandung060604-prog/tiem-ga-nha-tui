# HƯỚNG DẪN DÀNH CHO CLAUDE — TIỆM GÀ NHÀ TUI

## 1. Phân Công Trách Nhiệm Khi Chạy Song Song Cùng Gemini (Anti IDE)
- **Vai trò của Claude:** Core Engine & Backend Logic (`src/core/`), Quản lý Game State (`src/core/state.ts`), Cân bằng kinh tế & công thức nấu ăn (`src/core/economy.ts`, `src/core/cooking.ts`), Soạn thảo kịch bản cốt truyện 100k–200k chữ (`docs/02-story-bible-v2.md`).
- **Vai trò của Gemini:** Phụ trách toàn bộ UI Components (`src/ui/`), Styling (`src/styles/`), CSS tokens/classes (`docs/gemini/`), và sinh Asset hình ảnh 2D (`public/assets/`, `docs/gemini/brief-asset.md`).
- **Quy tắc phối hợp:**
  - Không tự ý sửa file trong `src/styles/` hoặc `docs/gemini/`.
  - Mọi thay đổi dữ liệu hoặc tính năng mới cần được định nghĩa qua TypeScript interface tại `src/types/game.ts`.
  - Không chạy lệnh khởi động server mới (`npm run dev`) vì Vite đang chạy ở port 3000.
  - Luôn kiểm tra tính toàn vẹn type bằng `npm run build` trước khi hoàn tất lượt trả lời.

---

## 2. Graphify Knowledge Graph

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
