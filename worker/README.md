# Máy chủ Tiệm Gà Nhà Tui (Cloudflare Worker) — chưa deploy

Máy chủ nhỏ, miễn phí (gói Free của Cloudflare Workers + KV), cho:
- **Thử thách ngày** (`GET /api/daily`): mọi người chơi cùng một đề mỗi ngày (theo giờ Việt Nam).
- **Bảng xếp hạng** (`POST /api/score`, `GET /api/leaderboard`): top 50 mỗi ngày.
- **Chống gian lận phía máy chủ**: máy chủ tự tính điểm từ chỉ số (không tin điểm client gửi), loại chỉ số vô lý
  (quá số khách một ca có thể phục vụ, doanh thu vượt trần theo số khách…), điểm phải kèm token HMAC do máy chủ
  cấp trong ngày, giới hạn 12 request/phút mỗi IP.

Luật nằm ở `src/logic.ts` (có test: `tests/worker-logic.test.ts`), phần Cloudflare ở `src/index.ts`.

## Việc anh/chị cần làm (khoảng 10 phút)
1. Tạo tài khoản miễn phí ở https://dash.cloudflare.com/sign-up
2. Trong thư mục dự án:
   ```
   cd worker
   npx wrangler login
   npx wrangler kv namespace create LEADERBOARD
   ```
   Dán `id` in ra vào `wrangler.toml` (dòng `id = "DIEN_ID_KV_O_DAY"`).
3. Tạo bí mật ký token (một chuỗi ngẫu nhiên dài, không chia sẻ cho ai):
   ```
   npx wrangler secret put TOKEN_SECRET
   ```
4. Báo Claude — Claude sẽ `npx wrangler deploy`, nối game với địa chỉ `*.workers.dev`, và thêm màn Thử thách ngày.

## Chưa làm (chờ deploy)
- Nối giao diện game (nút Thử thách ngày, bảng xếp hạng).
- Proxy Jev (TypeSafe) cho review động trong game: khóa Jev sẽ nằm ở `wrangler secret`, không bao giờ ở client.
