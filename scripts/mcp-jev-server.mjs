#!/usr/bin/env node
/**
 * MCP Server for Jev (TypeSafe AI)
 * Provides tools for System 1 structured decision making, content checking, scoring, and choices.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TypeSafeClient, choice, score, noul } from "@typesafe-ai/sdk";
import fs from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Auto load .env if TYPESAFE_API_KEY is not already in environment
if (!process.env.TYPESAFE_API_KEY) {
  try {
    const envCandidates = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(projectRoot, ".env"),
    ];
    for (const envPath of envCandidates) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx > 0) {
              const k = trimmed.slice(0, eqIdx).trim();
              const v = trimmed.slice(eqIdx + 1).trim();
              process.env[k] = v;
            }
          }
        }
        break;
      }
    }
  } catch (e) {
    console.error("Warning: Could not read .env:", e);
  }
}

const client = new TypeSafeClient({
  apiKey: process.env.TYPESAFE_API_KEY,
  timeout: 10000,
  retry: { maxRetries: 2 },
});

const server = new Server(
  {
    name: "jev",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const TOOLS = [
  {
    name: "jev_system_one",
    description: "Run Jev System 1 structured decision query with custom state and question set (choice, score, noul).",
    inputSchema: {
      type: "object",
      properties: {
        state: {
          type: "object",
          description: "Contextual state key-value pairs (e.g. day, chapter, served, lost, atmosphere).",
        },
        questions: {
          type: "object",
          description: "Map of question name to question definition object.",
        },
      },
      required: ["state", "questions"],
    },
  },
  {
    name: "jev_choice",
    description: "Ask Jev to select the single most appropriate option from choices given a context state.",
    inputSchema: {
      type: "object",
      properties: {
        state: {
          type: "object",
          description: "Context state object describing the situation.",
        },
        prompt: {
          type: "string",
          description: "Question prompt, e.g. 'Which review best fits today's performance?'.",
        },
        choices: {
          type: "object",
          description: "Key-value mapping of choice key to descriptive string.",
        },
      },
      required: ["state", "prompt", "choices"],
    },
  },
  {
    name: "jev_score",
    description: "Ask Jev to rate/score on a multi-point scale given a context state.",
    inputSchema: {
      type: "object",
      properties: {
        state: {
          type: "object",
          description: "Context state object.",
        },
        prompt: {
          type: "string",
          description: "Scoring question, e.g. 'How many stars does this customer give?'.",
        },
        scale: {
          type: "array",
          items: { type: "string" },
          description: "List of scale descriptors from lowest to highest, e.g. ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'].",
        },
      },
      required: ["state", "prompt", "scale"],
    },
  },
  {
    name: "jev_noul",
    description: "Ask Jev a boolean (yes/no) or noul question with probability given a context state.",
    inputSchema: {
      type: "object",
      properties: {
        state: {
          type: "object",
          description: "Context state object.",
        },
        prompt: {
          type: "string",
          description: "Boolean question prompt.",
        },
        trueDescription: {
          type: "string",
          description: "Description of what true means.",
        },
        falseDescription: {
          type: "string",
          description: "Description of what false means.",
        },
      },
      required: ["state", "prompt", "trueDescription", "falseDescription"],
    },
  },
  {
    name: "jev_check_content",
    description: "Check game content (story text, dialogue, review) for spoilers, humor score, or inappropriate language.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to analyze.",
        },
        type: {
          type: "string",
          enum: ["spoiler", "humor", "offensive", "all"],
          description: "Type of check to perform.",
        },
        extraContext: {
          type: "object",
          description: "Optional extra context like chapter, laterEvents, etc.",
        },
      },
      required: ["text", "type"],
    },
  },
  {
    name: "jev_triage_bug",
    description: "Triage and evaluate game bugs, determine severity, root cause category, fix strategy, and recommended compensation test days using TypeSafe AI Jev System 1.",
    inputSchema: {
      type: "object",
      properties: {
        bugTitle: {
          type: "string",
          description: "Title of the bug or failure mode.",
        },
        symptom: {
          type: "string",
          description: "Observed symptom or error details.",
        },
        context: {
          type: "string",
          description: "Contextual game state details (e.g. day, screen, player actions).",
        },
        sourceFile: {
          type: "string",
          description: "Suspected or verified source file path.",
        },
        screenshot: {
          type: "string",
          description: "Optional screenshot path.",
        },
      },
      required: ["bugTitle", "symptom"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "jev_choice") {
      const { state, prompt, choices: rawChoices } = args;
      const res = await client.systemOne({
        state: state || {},
        questions: {
          result: choice(prompt, rawChoices),
        },
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                model: res.model,
                usage: res.usage,
                choice: res.answers.result.choice,
                confidence: res.answers.result.confidence,
                probabilities: res.answers.result.probabilities,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_score") {
      const { state, prompt, scale: rawScale } = args;
      const res = await client.systemOne({
        state: state || {},
        questions: {
          result: score(prompt, rawScale),
        },
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                model: res.model,
                usage: res.usage,
                score: res.answers.result.score,
                confidence: res.answers.result.confidence,
                probabilities: res.answers.result.probabilities,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_noul") {
      const { state, prompt, trueDescription, falseDescription } = args;
      const res = await client.systemOne({
        state: state || {},
        questions: {
          result: noul(prompt, {
            true: trueDescription,
            false: falseDescription,
          }),
        },
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                model: res.model,
                usage: res.usage,
                noul: res.answers.result.noul,
                confidence: res.answers.result.confidence,
                probabilities: res.answers.result.probabilities,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_system_one") {
      const { state, questions: qDefs } = args;
      const builtQuestions = {};
      for (const [k, def] of Object.entries(qDefs || {})) {
        if (def.type === "choice") {
          builtQuestions[k] = choice(def.prompt, def.options);
        } else if (def.type === "score") {
          builtQuestions[k] = score(def.prompt, def.scale);
        } else if (def.type === "noul") {
          builtQuestions[k] = noul(def.prompt, def.options);
        }
      }

      const res = await client.systemOne({
        state: state || {},
        questions: builtQuestions,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                model: res.model,
                usage: res.usage,
                answers: res.answers,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_check_content") {
      const { text, type, extraContext } = args;
      const builtQuestions = {};
      if (type === "humor" || type === "all") {
        builtQuestions.humor = score("How funny / viral is this review or dialogue for Vietnamese GenZ?", [
          "Flat, no joke",
          "Mildly amusing",
          "Funny",
          "Very funny",
          "Viral-worthy",
        ]);
      }
      if (type === "offensive" || type === "all") {
        builtQuestions.offensive = noul("Is this text offensive, hateful, sexual or insulting toward a group?", {
          true: "Contains hate speech, slurs, explicit sexual content, or derogatory abuse",
          false: "Harmless street teasing, slang, or playful critique",
        });
      }
      if (type === "spoiler" || type === "all") {
        builtQuestions.spoiler = noul(
          "Does this text prematurely reveal future storyline plot points or major twists?",
          {
            true: "Reveals major future events, chain rivals, media scandals or endings",
            false: "Focuses on present day events, current atmosphere and lore",
          }
        );
      }

      const res = await client.systemOne({
        state: { text, ...(extraContext || {}) },
        questions: builtQuestions,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                model: res.model,
                usage: res.usage,
                answers: res.answers,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "jev_triage_bug") {
      const { bugTitle, symptom, context, sourceFile, screenshot } = args;
      const started = performance.now();
      const res = await client.systemOne({
        state: {
          game: "Tiệm Gà Nhà Tui",
          project: "Web Mobile Simulation / Stardew Valley Indie Pixel Style",
          bugTitle,
          symptom,
          context: context || "",
          sourceFile: sourceFile || "unknown",
        },
        questions: {
          severity: choice("Mức độ nghiêm trọng của lỗi này đối với trải nghiệm người chơi?", {
            p0_blocker: "P0 - Crash ứng dụng hoặc Softlock đứng máy, không thể tiếp tục chơi",
            p1_economy_break: "P1 - Lỗi kinh tế/logic sai số, rò rỉ dữ liệu hoặc gian lận nghiêm trọng",
            p2_ui_friction: "P2 - Kẹt modal hoặc giao diện khó thao tác nhưng có thể tự phục hồi",
            p3_minor: "P3 - Lỗi hiển thị nhỏ, font chữ hoặc nhầm nhãn review không ảnh hưởng cốt lõi",
          }),
          rootCauseCategory: choice("Nguyên nhân gốc rễ chủ yếu nằm ở tầng kiến trúc nào?", {
            state_lifecycle: "Vòng lặp trạng thái game (Day lifecycle, Page Reload / HMR, Lưu save)",
            ui_modal_stack: "Quản lý ngăn xếp Modal / Overlay chưa đóng triệt để hoặc thiếu event listener",
            economy_math: "Bất biến toán học kinh tế (tồn kho âm, thiếu tiền mua gói nguyên liệu, tính tip)",
            content_mislabel: "Nội dung review / kịch bản thoại bị gán nhầm tiêu chí hoặc thiếu nhánh kết thúc",
          }),
          fixStrategy: choice("Chiến lược vá lỗi tối ưu và an toàn nhất?", {
            defensive_nullcheck_fallback: "Bổ sung fallback phòng thủ, tự phục hồi khi gặp trạng thái bất thường",
            contract_first_type_fix: "Điều chỉnh Data Contract / Types chuẩn hóa và cập nhật logic nguồn",
            modal_queue_guard: "Bổ sung handler tự đóng / tiếp tục cho modal vào vòng lặp thao tác",
          }),
          compensationDays: score("Cần chạy bù bao nhiêu ngày mô phỏng test để xác nhận triệt để lỗi không tái diễn?", [
            "50 ngày chơi",
            "100 ngày chơi",
            "200 ngày chơi",
            "500 ngày chơi",
            "1000 ngày chơi",
          ]),
        },
      });

      const latency = Math.round(performance.now() - started);
      const compIndex = Math.min(4, Math.max(0, Math.round(res.answers.compensationDays.score)));
      const compDaysMap = [50, 100, 200, 500, 1000];

      const report = {
        timestamp: new Date().toISOString(),
        bugTitle,
        symptom,
        sourceFile,
        screenshot,
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
      const reportPath = path.resolve(projectRoot, "docs/bao-cao/jev-bug-triage-report.md");
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const mdEntry = `\n### 🐞 [${new Date().toLocaleTimeString("vi-VN")} ${new Date().toLocaleDateString("vi-VN")}] (via Jev MCP) ${bugTitle}\n- **Triệu chứng:** ${symptom}\n- **Vị trí:** \`${sourceFile || "N/A"}\` ${screenshot ? `(Ảnh: \`${screenshot}\`)` : ""}\n- **Đánh giá Jev (${latency}ms):**\n  - **Mức độ (Severity):** \`${report.jevDecisions.severity}\` (Độ tin cậy: ${(report.jevDecisions.severityConfidence * 100).toFixed(1)}%)\n  - **Nguyên nhân gốc (Root Cause):** \`${report.jevDecisions.rootCauseCategory}\` (Độ tin cậy: ${(report.jevDecisions.rootCauseConfidence * 100).toFixed(1)}%)\n  - **Chiến lược Fix:** \`${report.jevDecisions.fixStrategy}\` (Độ tin cậy: ${(report.jevDecisions.fixStrategyConfidence * 100).toFixed(1)}%)\n  - **Số ngày chạy bù khuyến nghị (Dò bù):** \`${report.jevDecisions.compensationDays}\` ngày chơi\n---\n`;

      let existing = "";
      if (fs.existsSync(reportPath)) {
        existing = fs.readFileSync(reportPath, "utf-8");
      } else {
        existing = "# NHẬT KÝ ĐÁNH GIÁ VÀ XỬ LÝ BUG BẰNG TYPESAFE AI JEV\n\n";
      }
      fs.writeFileSync(reportPath, existing + mdEntry, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error calling Jev: ${err.message || String(err)}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error in MCP Jev server:", err);
  process.exit(1);
});
