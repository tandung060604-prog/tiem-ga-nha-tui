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
  console.log('Consulting Jev on the NEXT feature from report http://aenhatrang.com/report-tinh-nang...');

  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      currentVersion: 'v2.2.0',
      finishedFeature: 'Minigame Nấu Sốt Bí Truyền (đã hoàn tất 100%, 450 tests PASS)',
      remainingCandidates: [
        'A. Minigame "Lọc Cặn Dầu Cuối Ngày" (Chuyển hóa từ Rửa Tô Cuối Ngày): Thao tác gạt cặn bột cháy trong 15s để phục hồi 1 bậc độ sạch dầu, tiết kiệm 150k tiền thay dầu',
        'B. UX Kho Hàng "Bấm Giữ Nút +/- Tăng Tốc Độ Mua Nguyên Liệu" (Long-press stepper hold): Tăng nhanh dần 1 -> 5 -> 10 đơn vị khi giữ nút mua/hoàn vốn kho FIFO',
        'C. Thanh Trượt Âm Lượng BGM & SFX Độc Lập trong Cài Đặt'
      ]
    },
    questions: {
      nextBestFeature: choice('Sau khi đã hoàn tất Minigame Nấu Sốt Bí Truyền, tính năng nào tiếp theo đem lại giá trị trải nghiệm cao nhất và không gây bug?', {
        oil_clean_minigame: 'Minigame Lọc Cặn Dầu Cuối Ngày (Hoàn thiện cặp đôi minigame: đầu ngày nấu sốt, cuối ngày lọc dầu)',
        stepper_hold_ux: 'UX Kho Hàng: Bấm giữ nút +/- tăng nhanh (Tối ưu tiện ích mua sắm nguyên liệu)',
        volume_sliders: 'Thanh trượt âm lượng BGM & SFX độc lập'
      }),
      oilMinigameThemeFit: score('Mức độ ăn khớp của Minigame Lọc Cặn Dầu với cơ chế dầu chiên và chi phí 150k thay dầu hiện tại?', [
        'Không ăn khớp',
        'Bình thường',
        'Khá hay',
        'Rất ăn khớp với đời thực của quán gà rán (vớt bột chiên, gạn dầu)',
        'Hoàn hảo, tạo vòng lặp trọn vẹn: Sáng nấu sốt, Ngày chiên gà, Tối lọc dầu tiết kiệm tiền'
      ]),
      stepperComboStrategy: choice('Có nên kết hợp Minigame Lọc Cặn Dầu cùng UX bấm giữ nút +/- kho hàng hay làm riêng từng cái?', {
        focus_oil_first: 'Tập trung làm trọn vẹn Minigame Lọc Cặn Dầu trước với gameplay, UI vuốt 1 ngón cái, SFX xèo xèo cạo chảo',
        bundle_stepper: 'Làm Minigame Lọc Dầu là chính, kèm theo tiện ích giữ nút +/- kho hàng luôn'
      })
    }
  });

  const ms = Math.round(performance.now() - started);
  console.log(`Jev response time: ${ms}ms`);
  console.log('Jev Next Feature Decisions:');
  console.log(JSON.stringify(res.answers, null, 2));

  fs.writeFileSync('docs/bao-cao/jev-decision-next-feature.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    answers: res.answers,
    latencyMs: ms
  }, null, 2));
}

run().catch(console.error);
