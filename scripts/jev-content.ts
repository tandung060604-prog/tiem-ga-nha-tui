// Dùng Jev (TypeSafe) để kiểm tra NỘI DUNG lúc làm game — không gọi từ trình duyệt (game ở GitHub Pages,
// gọi từ trình duyệt sẽ lộ API key). Kết quả được đóng gói sẵn vào game.
//   1. Chống lộ truyện: thư Thỏ Cam / lựa chọn truyện / khách bí ẩn có tiết lộ chuyện chương sau không?
//   2. Review GenZ: chấm độ hài (game ưu tiên câu hài hơn), soát tiêu chí gắn nhầm, lọc câu phản cảm.
// Chạy: npm run jev:content   (cần TYPESAFE_API_KEY trong .env)
import { writeFileSync, mkdirSync } from 'node:fs';
import { TypeSafeClient, choice, noul, score } from '@typesafe-ai/sdk';
import { CHAPTERS } from '../src/content/chapters';
import { BUNNY_LETTERS } from '../src/content/mysteryBunny';
import { STORY_ACTS } from '../src/content/storyNovel';
import { MYSTERY_QUESTS } from '../src/content/mysteryGuests';
import { GENZ_REVIEW_TEMPLATES } from '../src/content/reviews';

const client = new TypeSafeClient({ timeout: 15000, retry: { maxRetries: 2 } });
const SPOILER_THRESHOLD = 0.7;

// Chạy song song có giới hạn để không dồn API
async function mapLimit<T, R>(items: readonly T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]!);
    }
  }));
  return out;
}

// ---------------------------------------------------------------------------
// 1. Chống lộ truyện
// ---------------------------------------------------------------------------
interface StoryText { id: string; chapter: number; text: string }

const storyTexts: StoryText[] = [
  ...BUNNY_LETTERS.map(l => ({ id: `thư ${l.id}`, chapter: l.trigger.chapter, text: `${l.noteContent}\n${l.storyImpact}` })),
  ...STORY_ACTS.flatMap(a => (a.options ?? []).map(o => ({
    id: `lựa chọn ${o.id}`, chapter: a.chapterRequirement, text: `${o.label}\n${o.reactionNarrative}`
  }))),
  ...MYSTERY_QUESTS.map(q => ({ id: `khách bí ẩn ${q.id}`, chapter: q.trigger.chapter, text: `${q.dialogue}\n${q.rewardDescription}` }))
];

const laterChapters = (chapter: number) => CHAPTERS
  .filter(c => c.number > chapter)
  .map(c => ({ chapter: c.number, title: c.title, happens: `${c.context} ${c.description}` }));

async function checkSpoiler(t: StoryText) {
  const later = laterChapters(t.chapter);
  if (later.length === 0) return { ...t, spoiler: 0 };
  const { answers } = await client.systemOne({
    state: { shownInChapter: t.chapter, text: t.text, eventsOfLaterChapters: later },
    questions: {
      spoiler: noul('Does the text reveal or clearly foreshadow specific events or outcomes that belong to the later chapters listed?', {
        true: 'Mentions a later-chapter event (e.g. rival chain opening, media crisis, award ceremony, multiple branches) as happening or about to happen',
        false: 'Only talks about the current situation, mood or characters already present'
      })
    }
  });
  return { ...t, spoiler: answers.spoiler.noul };
}

// ---------------------------------------------------------------------------
// 2. Review GenZ
// ---------------------------------------------------------------------------
const CRITERIA = {
  taste: 'Complains or praises taste, doneness, crispiness, burnt/raw food, seasoning',
  speed: 'About waiting time or how fast the food came',
  hygiene: 'About cleanliness, dirty oil, hygiene',
  space: 'About seats, air-con, decor, space, atmosphere',
  pricing: 'About price, value for money, promotions'
} as const;

async function labelReview(t: (typeof GENZ_REVIEW_TEMPLATES)[number]) {
  const { answers } = await client.systemOne({
    state: { review: t.text, language: 'Vietnamese GenZ slang' },
    questions: {
      criteria: choice('Which aspect of the restaurant is this review mainly about?', CRITERIA),
      humor: score('How funny / shareable is this review for Vietnamese GenZ on Threads?', [
        'Flat, no joke', 'Mildly amusing', 'Funny', 'Very funny', 'Viral-worthy'
      ]),
      offensive: noul('Is this review offensive, hateful, sexual or insulting toward a group?', {
        true: 'Contains slurs, hate, sexual content or group insults',
        false: 'Harmless teasing or complaint'
      })
    }
  });
  return {
    text: t.text,
    authorCriteria: t.criteria,
    jevCriteria: answers.criteria.choice,
    criteriaConfidence: answers.criteria.confidence,
    humor: answers.humor.score, // 0..4
    offensive: answers.offensive.noul
  };
}

// ---------------------------------------------------------------------------
const started = Date.now();
const [spoilers, reviews] = await Promise.all([
  mapLimit(storyTexts, 4, checkSpoiler),
  mapLimit(GENZ_REVIEW_TEMPLATES, 4, labelReview)
]);

const humorMap: Record<string, number> = {};
for (const r of reviews) humorMap[r.text] = Math.round(r.humor * 100) / 100;
const blocked = reviews.filter(r => r.offensive >= 0.5).map(r => r.text);

writeFileSync('src/content/reviewLabels.generated.ts', `// SINH TỰ ĐỘNG bởi \`npm run jev:content\` (Jev · TypeSafe). Không sửa tay.
// Độ hài 0–4 của từng mẫu review (game ưu tiên câu hài hơn) và danh sách câu bị chặn vì phản cảm.
export const REVIEW_HUMOR: Readonly<Record<string, number>> = ${JSON.stringify(humorMap, null, 2)};

export const REVIEW_BLOCKED: readonly string[] = ${JSON.stringify(blocked, null, 2)};
`);

const flaggedSpoilers = spoilers.filter(s => s.spoiler >= SPOILER_THRESHOLD);
const mislabeled = reviews.filter(r => r.jevCriteria !== r.authorCriteria && r.criteriaConfidence >= 0.7);
mkdirSync('docs/bao-cao', { recursive: true });
const lines = [
  '# Báo cáo kiểm tra nội dung bằng Jev',
  '',
  `Chạy lúc ${new Date().toLocaleString('vi-VN')} · ${storyTexts.length} đoạn truyện + ${reviews.length} review · ${((Date.now() - started) / 1000).toFixed(1)}s`,
  '',
  `## 1. Lộ truyện (ngưỡng ≥ ${SPOILER_THRESHOLD})`,
  '',
  flaggedSpoilers.length === 0 ? 'Không đoạn nào lộ chuyện chương sau.' : '| Đoạn | Hiện ở chương | Xác suất lộ |\n|---|---|---|',
  ...flaggedSpoilers.map(s => `| ${s.id} | ${s.chapter} | ${s.spoiler.toFixed(2)} |`),
  '',
  '<details><summary>Tất cả đoạn đã kiểm</summary>',
  '',
  ...spoilers.map(s => `- ${s.id} (Ch.${s.chapter}): ${s.spoiler.toFixed(2)}`),
  '</details>',
  '',
  '## 2. Review GenZ',
  '',
  `- Độ hài trung bình: ${(reviews.reduce((a, r) => a + r.humor, 0) / reviews.length).toFixed(2)} / 4`,
  `- Bị chặn vì phản cảm: ${blocked.length}`,
  `- Có thể gắn nhầm tiêu chí: ${mislabeled.length}`,
  '',
  ...mislabeled.map(r => `  - "${r.text}" — tác giả: ${r.authorCriteria}, Jev: ${r.jevCriteria} (${r.criteriaConfidence.toFixed(2)})`),
  '',
  '### 5 câu hài nhất',
  ...[...reviews].sort((a, b) => b.humor - a.humor).slice(0, 5).map(r => `- (${r.humor.toFixed(2)}) ${r.text}`)
];
writeFileSync('docs/bao-cao/jev-content-report.md', lines.join('\n') + '\n');

console.log(`Lộ truyện: ${flaggedSpoilers.length}/${spoilers.length} · review gắn nhầm: ${mislabeled.length} · bị chặn: ${blocked.length}`);
for (const s of flaggedSpoilers) console.log(`  ⚠ ${s.id} (Ch.${s.chapter}) ${s.spoiler.toFixed(2)}`);
console.log('→ docs/bao-cao/jev-content-report.md, src/content/reviewLabels.generated.ts');
