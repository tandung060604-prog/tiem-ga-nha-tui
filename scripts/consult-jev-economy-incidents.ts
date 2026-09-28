import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';

// Auto load .env if TYPESAFE_API_KEY is not already in environment
if (!process.env.TYPESAFE_API_KEY) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const k = trimmed.slice(0, eqIdx).trim();
            const v = trimmed.slice(eqIdx + 1).trim();
            process.env[k] = v;
          }
        }
      }
    }
  } catch (e) {
    console.error('Warning: Could not read .env:', e);
  }
}

const client = new TypeSafeClient({
  apiKey: process.env.TYPESAFE_API_KEY,
  timeout: 10000,
  retry: { maxRetries: 2 },
});

async function run() {
  const started = performance.now();
  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      feature: 'Gameplay Balancing, Incident Anti-Repeat & VIP Big Spender System',
      context: 'Người chơi phản ánh: sự kiện game cần cộng/trừ tiền hợp lý thay đổi tiền thật và không lặp lại; lỗi mua hàng & tồn kho không bằng nhau và chiên đùi gà bị trừ má đùi gà, hết hạn phải mất thật; kiếm tiền đang chậm, cần có thêm cơ hội và gặp khách sộp cho nhiều tiền hơn.'
    },
    questions: {
      incidentEconomyBalancing: choice('Mức tiền thưởng/phạt của sự kiện hẻm nên thiết kế như thế nào để vừa kích thích vừa cân bằng?', {
        scaled_by_chapter: 'Quy mô tiền thưởng/phạt tỷ lệ thuận với Chương (Chương 1: 20k-50k; Chương 2: 50k-150k; Chương 3+: 200k-500k), lựa chọn liều lĩnh thưởng to nhưng rủi ro phạt nặng',
        flat_fixed_amount: 'Giữ nguyên số tiền cố định nhỏ 10k-20k cho tất cả các chương',
        no_money_only_karma: 'Chỉ cộng trừ điểm Karma danh tiếng, không cộng trừ tiền mặt'
      }),
      incidentAntiRepeatStrategy: choice('Giải pháp kỹ thuật nào tối ưu nhất để ngăn chặn sự kiện lặp lại nhàm chán?', {
        cooldown_and_exhaustion_pool: 'Kết hợp Pool chưa gặp (exhaustion) + Thời gian hồi Cooldown tối thiểu 6-8 ngày cho sự kiện đã gặp, đảm bảo không bao giờ gặp lại sự kiện vừa xảy ra hôm qua',
        pure_random_pick: 'Bốc thăm ngẫu nhiên hoàn toàn không cần lưu lịch sử',
        one_time_only_per_game: 'Mỗi sự kiện chỉ xuất hiện đúng 1 lần trong suốt toàn bộ game rồi xóa vĩnh viễn'
      }),
      prepStationStockDisplay: choice('Để xử lý triệt để bug số lượng mua không bằng tồn kho và bán đùi gà bị trừ má đùi gà, hiển thị trên khay inox nên thế nào?', {
        independent_primary_stock: 'Mỗi khay hiển thị trực tiếp số lượng tồn kho của NGUYÊN LIỆU CHÍNH (Đùi gà riêng, Má đùi riêng). Khi chiên đùi gà chỉ trừ đùi gà và bột, số má đùi gà giữ nguyên 100%',
        min_bottleneck_all_ingredients: 'Tiếp tục lấy min của tất cả nguyên liệu phụ (bột chiên) làm số hiển thị',
        infinite_supplies: 'Bỏ tính năng quản lý kho, cho nguyên liệu vô hạn'
      }),
      vipBigSpenderDesign: choice('Cơ chế Khách Sộp (VIP Big Spender) nên được thiết kế như thế nào để mang lại cảm giác thỏa mãn (Juice)?', {
        vip_persona_with_huge_tips: 'Thêm archetype Khách Sộp (Đại gia Hẻm, CEO Việt Kiều, Tiktoker Triệu View, Trúng Vé Số): viền hào quang vàng lấp lánh, câu thoại sộp, gọi combo to và tip đậm 50.000đ - 150.000đ khi được phục vụ nhanh + vàng giòn',
        double_revenue_buff: 'Chỉ nhân đôi doanh thu toàn bộ ca bán hàng',
        lottery_minigame: 'Bật minigame cờ bạc quay số may rủi'
      }),
      economySpeedScore: score('Độ cần thiết của việc tăng tốc dòng tiền đầu game và cơ hội gặp khách sộp cho trải nghiệm người chơi?', [
        'Không cần thiết',
        'Hơi cần',
        'Khá quan trọng',
        'Rất quan trọng, giúp người chơi hứng khởi mở khóa trang thiết bị và món mới',
        'Tối quan trọng, cứu vớt nhịp độ game tránh gây ức chế vì cày cuốc quá chậm'
      ])
    }
  });

  const ms = Math.round(performance.now() - started);
  console.log(`Jev latency: ${ms}ms`);
  console.log(JSON.stringify(res.answers, null, 2));
}

run().catch(console.error);
