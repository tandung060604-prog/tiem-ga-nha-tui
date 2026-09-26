// Kiểm tra kết nối Jev bằng một quyết định thật của game: chọn review cuối ngày.
// Chạy: npm run jev:check  (cần TYPESAFE_API_KEY trong .env hoặc biến môi trường)
import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';

const client = new TypeSafeClient({ timeout: 5000, retry: { maxRetries: 1 } });

const started = performance.now();
const { model, answers, usage } = await client.systemOne({
  state: {
    day: 7,
    chapter: 1,
    served: 14,
    lost: 3,
    perfectRatio: 0.42,
    burnt: 2,
    avgWaitSec: 31,
    oil: 'medium',
    weakest: 'speed',
  },
  questions: {
    review: choice('Câu review nào hợp nhất với ca bán hôm nay?', {
      slow_breakup: 'Gà ngon nhưng đợi lâu tới mức chia tay người yêu',
      slow_roots: 'Đợi lâu muốn mọc rễ ở quán',
      burnt_future: 'Gà khét đen như tương lai của mình',
      fast_praise: 'Vừa order đã có đồ, nhanh như người yêu cũ trở mặt',
    }),
    stars: score('Khách này chấm tiệm mấy sao?', [
      '1 sao: rất tệ',
      '2 sao: tệ',
      '3 sao: tạm',
      '4 sao: ngon',
      '5 sao: xuất sắc',
    ]),
  },
});
const ms = Math.round(performance.now() - started);

console.log(`model=${model} latency=${ms}ms tokens_in=${usage.input_tokens}`);
console.log(`review=${answers.review.choice} (confidence ${answers.review.confidence.toFixed(2)})`);
console.log(`stars=${(answers.stars.score + 1).toFixed(2)} / 5`);
