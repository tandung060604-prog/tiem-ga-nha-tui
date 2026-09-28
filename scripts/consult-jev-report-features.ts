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
  timeout: 15000,
  retry: { maxRetries: 2 },
});

async function run() {
  const started = performance.now();
  console.log('Consulting Jev on candidate features from report http://aenhatrang.com/report-tinh-nang...');
  
  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      context: 'Game mô phỏng kinh doanh tiệm gà rán vỉa hè Hẻm 1102 Sài Gòn (Web Mobile 1 ngón cái, Vitest 438 tests PASS). Cần chọn lọc 1 tính năng tốt nhất từ báo cáo tiệm mì cay để tích hợp chất lượng cao, không bug, UX/UI đỉnh cao.',
      candidateFeatures: [
        '1. Minigame Nước sốt bí truyền (Ghi nhớ thứ tự 4-5 nguyên liệu tỏi, mật ong, ớt, tương để nhận Buff Sốt Thần Thánh tăng tip & sao)',
        '2. Minigame Lọc cặn dầu / Cạo chảo cuối ngày (Gạt cặn bột chiên để phục hồi độ sạch dầu, tiết kiệm 150k tiền đổi dầu)',
        '3. Minigame Lái xe máy giao hàng né ổ gà (Chạy xe né ổ gà giao đơn app xa)',
        '4. UX Stepper Bấm giữ + / - (Long-press tăng tốc độ nhập hàng kho FIFO)',
        '5. Thanh trượt âm lượng BGM / SFX riêng biệt trong Cài đặt'
      ]
    },
    questions: {
      topPriorityFeature: choice('Tính năng nào từ báo cáo có độ hòa quyện gameplay cao nhất, tạo ra nhiều giá trị cảm xúc và gắn kết nhất cho Tiệm Gà Nhà Tui?', {
        secret_sauce_minigame: 'Minigame Nước Sốt Bí Truyền (Ghi nhớ và pha chế sốt đặc biệt trước ca bán để nhận Buff vàng)',
        oil_clean_minigame: 'Minigame Lọc Cặn Dầu Cuối Ngày (Tiết kiệm tiền thay dầu bằng kỹ năng gạt bột)',
        delivery_bike_minigame: 'Minigame Lái Xe Giao Hàng Né Ổ Gà (Minigame lái xe 3 làn)',
        stepper_longpress_ux: 'UX Kho: Bấm giữ nút +/- tăng giảm hàng nhanh (Tiện ích kho hàng)'
      }),
      sauceMinigameSuitability: score('Mức độ phù hợp của Minigame Nước Sốt Bí Truyền với cơ chế chế biến gà rán và trạm sốt hiện tại?', [
        'Hoàn toàn không phù hợp',
        'Hơi khiên cưỡng',
        'Khá phù hợp nhưng tẻ nhạt',
        'Rất phù hợp, nâng tầm khâu Chuẩn Bị & Trạm Sốt của quán gà',
        'Hoàn hảo tuyệt đối (Signature Feature), biến khâu làm sốt thành linh hồn của tiệm gà Sài Gòn'
      ]),
      rolloutStrategy: choice('Chiến lược triển khai nào đảm bảo không bug, UX/UI tốt nhất theo yêu cầu người dùng?', {
        one_feature_depth_first: 'Triển khai trọn vẹn 1 tính năng (Minigame Sốt Bí Truyền) với cơ chế, UI ngón cái, âm thanh SFX, bài test Vitest và polish giao diện trước khi làm bất kỳ thứ gì khác',
        bundle_multiple_features: 'Làm đồng loạt cả 3 minigame cùng lúc',
        only_small_ux_fixes: 'Chỉ làm các nút bấm +/- nhỏ lẻ không thêm gameplay mới'
      }),
      gameFeelAndPolishKeys: choice('Yếu tố Game Feel và UX/UI then chốt khi triển khai tính năng này trên mobile 360px-390px là gì?', {
        sensory_tactile_and_clear_feedback: 'Thao tác chạm 1 ngón cái dễ dàng, hiệu ứng nảy hạt gia vị (pop/drop), âm thanh sủi bọt/khuấy sốt sột soạt vui tai, cuộn bí kíp cổ điển Sài Gòn, buff biểu thị rõ ràng trên quầy',
        complex_drag_and_drop: 'Kéo thả phức tạp nhiều ngón tay trên màn hình nhỏ'
      })
    }
  });

  const ms = Math.round(performance.now() - started);
  console.log(`Jev response time: ${ms}ms`);
  console.log('Jev Decisions:');
  console.log(JSON.stringify(res.answers, null, 2));

  // Write decision record
  fs.writeFileSync('docs/bao-cao/jev-decision-report-tinh-nang.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    answers: res.answers,
    latencyMs: ms
  }, null, 2));
}

run().catch(console.error);
