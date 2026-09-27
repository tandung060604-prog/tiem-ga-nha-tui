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
      feature: 'Interactive Review Reply & Deep Sentiment System',
      currentReviewCount: 50,
      target: 'Người chơi có thể phản hồi đánh giá, Bác Ba/AI mách nước gợi ý trả lời đúng, tác động tới Karma và Sao'
    },
    questions: {
      replyMechanic: choice('Cơ chế phản hồi review nào mang lại chiều sâu tâm lý và game-feel tốt nhất trên mobile web?', {
        curated_3_choices_with_advisor: '3 phương án lựa chọn chiến lược (Chân thành nhận lỗi/Đền bù vs Hài hước bắt trend GenZ vs Cương trực giải thích) kèm Gợi ý phân tích tâm lý khách của Bác Ba',
        emoji_reaction_only: 'Chỉ thả tim hoặc thả phẫn nộ emoji đơn giản',
        free_text_open: 'Gõ chữ tự do bất kỳ không có phân loại ngữ nghĩa'
      }),
      rewardConsequence: choice('Hậu quả và phần thưởng khi trả lời review đúng tâm lý khách hàng nên tác động thế nào?', {
        reputation_and_karma_shift: 'Cứu vãn điểm sao bị trừ (+0.1 đến +0.2 sao tiêu chí), tăng Tình Nghĩa Hẻm (Community) hoặc Tay Nghề (Craftsmanship), khách hồi đáp cảm ơn',
        only_money_tip: 'Chỉ tặng một ít tiền tip cho ngày hôm sau',
        no_gameplay_impact: 'Chỉ hiển thị dòng chữ mang tính trang trí'
      }),
      sentimentArchetypeMatrix: choice('Cấu trúc phân loại đánh giá có chiều sâu nên xây dựng như thế nào?', {
        persona_sentiment_matrix: 'Ma trận 6 Nhóm thực khách (GenZ, Văn phòng, Cư dân Hẻm, Foodie sành ăn, Shipper, Hot TikToker) × 5 Trạng thái cảm xúc (Furious, Disappointed, Neutral, Delighted, Amused)',
        simple_star_tier: 'Chỉ chia theo số sao từ 1 đến 5 sao đơn giản'
      }),
      playerEngagementScore: score('Mức độ lôi cuốn của tính năng phản hồi review và được Bác Ba mách nước chỉ chiêu đối đáp?', [
        'Không hào hứng',
        'Bình thường',
        'Khá thú vị khi đọc review',
        'Rất cuốn hút, tạo cảm giác thực sự là chủ tiệm gà tương tác với khách',
        'Tuyệt đỉnh nhập vai quản lý kinh doanh, tăng replay value vượt bậc'
      ])
    }
  });

  const ms = Math.round(performance.now() - started);
  console.log(`Jev latency: ${ms}ms`);
  console.log(JSON.stringify(res.answers, null, 2));
}

run().catch(console.error);
