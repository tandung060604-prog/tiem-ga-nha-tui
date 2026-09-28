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
      feature: 'Sự kiện Chủ nhà & Giang hồ đòi nợ phá quán, Khách hoảng sợ bỏ chạy và Đóng băng hàng chờ',
      target: 'Người chơi sau tuần đầu (Ngày 8+) đối mặt sự kiện Bà Bảy Đất dắt giang hồ đòi tiền/bảo kê, lựa chọn sai làm khách chạy hết và tiệm bị gián đoạn'
    },
    questions: {
      timingAndTrigger: choice('Thời điểm và điều kiện xuất hiện lý tưởng nhất cho sự kiện đòi nợ bảo kê liên minh này là gì?', {
        day_8_shift_mid: 'Ngày 8 (bắt đầu tuần thứ 2, giai đoạn Tiệm Hẻm 14) xuất hiện giữa ca bán hàng tạo áp lực cao độ',
        chapter_3_only: 'Chỉ xuất hiện ở Chương 3 Ngày 26 như thiết kế cũ',
        end_of_day_summary: 'Chỉ xuất hiện ở màn tổng kết cuối ngày không ảnh hưởng ca bán'
      }),
      customerScareConsequence: choice('Khi người chơi trả lời đối đầu hung hăng khiến giang hồ phá phách, khách hàng nên phản ứng thế nào?', {
        panic_flee_and_cooldown: 'Toàn bộ khách đang đợi hoảng sợ bỏ chạy hết (orders = []), quầy bị gián đoạn hỗn loạn trong 15-20s trước khi lứa khách mới dám ghé',
        only_lose_one_customer: 'Chỉ mất 1 khách đầu tiên, các khách sau vẫn thản nhiên đứng đợi',
        no_queue_impact: 'Không ảnh hưởng gì đến khách đang đợi, chỉ trừ tiền'
      }),
      storyResolutionBranches: choice('Bộ 4 nhánh giải quyết câu chuyện nên được phân bổ như thế nào để cân bằng cảm xúc và chiến thuật?', {
        strategic_4_branches: '1. Nhờ Bác Ba và Tổ Dân Phố phân xử theo hợp đồng; 2. Bấm bụng trả nợ êm ấm; 3. Cự cãi thách thức (bị phá quán, khách chạy sạch, gián đoạn); 4. Chú Tư Bảo Vệ trấn áp (nếu đã thuê bảo vệ)',
        only_two_binary_choices: 'Chỉ có 2 lựa chọn: Trả tiền hoặc Không trả tiền'
      }),
      dramaticAudioStyle: choice('Âm thanh kịch tính khi giang hồ và chủ nợ xông vào tiệm nên được xử lý thế nào?', {
        dynamic_suspense_synth_and_stabs: 'Web Audio Synth phát nhạc dồn dập kịch tính (suspense minor chord, bass rumble) + hạ nhỏ BGM chính + tiếng hét đám đông hoảng loạn nếu bị quậy',
        keep_normal_happy_bgm: 'Giữ nguyên nhạc nền huýt sáo vui tươi không đổi'
      }),
      playerTensionScore: score('Mức độ tạo cảm xúc căng thẳng, hồi hộp và chân thực đời thường Hẻm Sài Gòn của sự kiện này?', [
        'Không căng thẳng',
        'Bình thường',
        'Khá hồi hộp',
        'Rất gay cấn và thực tế đời sống tiểu thương Sài Gòn',
        'Cực kỳ đỉnh cao, tạo bước ngoặt cảm xúc đáng nhớ trong game'
      ])
    }
  });

  const ms = Math.round(performance.now() - started);
  console.log(`Jev latency: ${ms}ms`);
  console.log(JSON.stringify(res.answers, null, 2));
}

run().catch(console.error);
