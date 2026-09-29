import { TypeSafeClient, choice, score } from '@typesafe-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';

// Auto-load .env
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

export interface BugTriageInput {
  bugTitle: string;
  symptom: string;
  context: string;
  sourceFile?: string;
  screenshot?: string;
}

export async function triageBugWithJev(input: BugTriageInput) {
  const started = performance.now();
  console.log(`🤖 Đang tham vấn Cố Vấn TypeSafe AI Jev về bug: "${input.bugTitle}"...`);

  const res = await client.systemOne({
    state: {
      game: 'Tiệm Gà Nhà Tui',
      project: 'Web Mobile Simulation / Stardew Valley Indie Pixel Style',
      bugTitle: input.bugTitle,
      symptom: input.symptom,
      context: input.context,
      sourceFile: input.sourceFile || 'unknown',
    },
    questions: {
      severity: choice('Mức độ nghiêm trọng của lỗi này đối với trải nghiệm người chơi?', {
        p0_blocker: 'P0 - Crash ứng dụng hoặc Softlock đứng máy, không thể tiếp tục chơi',
        p1_economy_break: 'P1 - Lỗi kinh tế/logic sai số, rò rỉ dữ liệu hoặc gian lận nghiêm trọng',
        p2_ui_friction: 'P2 - Kẹt modal hoặc giao diện khó thao tác nhưng có thể tự phục hồi',
        p3_minor: 'P3 - Lỗi hiển thị nhỏ, font chữ hoặc nhầm nhãn review không ảnh hưởng cốt lõi',
      }),
      rootCauseCategory: choice('Nguyên nhân gốc rễ chủ yếu nằm ở tầng kiến trúc nào?', {
        state_lifecycle: 'Vòng lặp trạng thái game (Day lifecycle, Page Reload / HMR, Lưu save)',
        ui_modal_stack: 'Quản lý ngăn xếp Modal / Overlay chưa đóng triệt để hoặc thiếu event listener',
        economy_math: 'Bất biến toán học kinh tế (tồn kho âm, thiếu tiền mua gói nguyên liệu, tính tip)',
        content_mislabel: 'Nội dung review / kịch bản thoại bị gán nhầm tiêu chí hoặc thiếu nhánh kết thúc',
      }),
      fixStrategy: choice('Chiến lược vá lỗi tối ưu và an toàn nhất?', {
        defensive_nullcheck_fallback: 'Bổ sung fallback phòng thủ, tự phục hồi khi gặp trạng thái bất thường',
        contract_first_type_fix: 'Điều chỉnh Data Contract / Types chuẩn hóa và cập nhật logic nguồn',
        modal_queue_guard: 'Bổ sung handler tự đóng / tiếp tục cho modal vào vòng lặp thao tác',
      }),
      compensationDays: score('Cần chạy bù bao nhiêu ngày mô phỏng test để xác nhận triệt để lỗi không tái diễn?', [
        '50 ngày chơi',
        '100 ngày chơi',
        '200 ngày chơi',
        '500 ngày chơi',
        '1000 ngày chơi',
      ]),
    },
  });

  const latency = Math.round(performance.now() - started);

  const compIndex = Math.min(4, Math.max(0, Math.round(res.answers.compensationDays.score)));
  const compDaysMap = [50, 100, 200, 500, 1000];

  const report = {
    timestamp: new Date().toISOString(),
    bugTitle: input.bugTitle,
    symptom: input.symptom,
    sourceFile: input.sourceFile,
    screenshot: input.screenshot,
    latencyMs: latency,
    jevDecisions: {
      severity: res.answers.severity.choice,
      severityConfidence: res.answers.severity.confidence,
      rootCauseCategory: res.answers.rootCauseCategory.choice,
      rootCauseConfidence: res.answers.rootCauseCategory.confidence,
      fixStrategy: res.answers.fixStrategy.choice,
      fixStrategyConfidence: res.answers.fixStrategy.confidence,
      compensationDays: compDaysMap[compIndex],
    },
  };

  // Append to docs/bao-cao/jev-bug-triage-report.md
  const reportPath = path.resolve(process.cwd(), 'docs/bao-cao/jev-bug-triage-report.md');
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const mdEntry = `
### 🐞 [${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}] ${input.bugTitle}
- **Triệu chứng:** ${input.symptom}
- **Vị trí:** \`${input.sourceFile || 'N/A'}\` ${input.screenshot ? `(Ảnh: \`${input.screenshot}\`)` : ''}
- **Đánh giá Jev (${latency}ms):**
  - **Mức độ (Severity):** \`${report.jevDecisions.severity}\` (Độ tin cậy: ${(report.jevDecisions.severityConfidence * 100).toFixed(1)}%)
  - **Nguyên nhân gốc (Root Cause):** \`${report.jevDecisions.rootCauseCategory}\` (Độ tin cậy: ${(report.jevDecisions.rootCauseConfidence * 100).toFixed(1)}%)
  - **Chiến lược Fix:** \`${report.jevDecisions.fixStrategy}\` (Độ tin cậy: ${(report.jevDecisions.fixStrategyConfidence * 100).toFixed(1)}%)
  - **Số ngày chạy bù khuyến nghị (Dò bù):** \`${report.jevDecisions.compensationDays}\` ngày chơi
---
`;

  let existing = '';
  if (fs.existsSync(reportPath)) {
    existing = fs.readFileSync(reportPath, 'utf-8');
  } else {
    existing = `# NHẬT KÝ ĐÁNH GIÁ VÀ XỬ LÝ BUG BẰNG TYPESAFE AI JEV\n\n`;
  }

  fs.writeFileSync(reportPath, existing + mdEntry, 'utf-8');
  console.log(`✅ Đã lưu kết quả tham vấn Jev vào: docs/bao-cao/jev-bug-triage-report.md`);

  return report;
}

// Chạy trực tiếp qua CLI nếu có tham số
if (process.argv[1] && process.argv[1].endsWith('consult-jev-bug-triage.ts')) {
  const title = process.argv[2] || 'UI Freeze tại Title Screen khi Hot Reload';
  const symptom = process.argv[3] || 'Vite HMR reload trình duyệt, Title Screen xuất hiện nhưng script monkey không click Tiếp Tục';
  const source = process.argv[4] || 'scripts/overnight-browser-monkey.mjs';

  triageBugWithJev({
    bugTitle: title,
    symptom,
    context: 'Test xuyên đêm phát hiện kẹt ở màn Title Screen sau khi reload trang ở Ngày 3',
    sourceFile: source,
  }).catch(console.error);
}
