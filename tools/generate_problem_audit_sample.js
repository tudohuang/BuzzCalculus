const fs = require("fs");
const path = require("path");

global.window = {};
require("./lib/load_problem_sources.js")();

const problems = window.BUZZ_PROBLEMS || [];

const TOPIC_PLAN = [
  { key: "limits", label: "極限", count: 10 },
  { key: "derivatives", label: "微分", count: 15 },
  { key: "integrals", label: "積分", count: 15 },
  { key: "series", label: "級數", count: 10 }
];

const ANSWER_KIND_LABELS = {
  numeric: "數值",
  expression: "式子",
  antiderivative: "不定積分",
  text: "文字判定"
};

const SEED = "buzzcalculus-rc-audit-2026-06-05";

function seedFromString(value) {
  return String(value)
    .split("")
    .reduce((seed, char) => ((seed << 5) - seed + char.charCodeAt(0)) >>> 0, 2166136261);
}

function hashUnit(value) {
  let state = seedFromString(value) || 1;
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0xffffffff;
}

function sampleTopic(topicKey, count) {
  const pool = problems
    .filter((problem) => problem.topic === topicKey)
    .map((problem) => {
      const difficulty = Number(problem.rank || problem.difficulty || 1);
      const tagCount = Array.isArray(problem.tags) ? problem.tags.length : 0;
      const sourceWeight = problem.source ? 0.08 : 0;
      const priority = difficulty * 0.18 + Math.min(4, tagCount) * 0.04 + sourceWeight + hashUnit(`${SEED}:${problem.id}`);
      return { problem, priority };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.problem);

  const selected = [];
  [6, 5, 4, 3, 2, 1].forEach((difficulty) => {
    const candidate = pool.find((problem) => (problem.rank || problem.difficulty) === difficulty && !selected.includes(problem));
    if (candidate) selected.push(candidate);
  });
  pool.forEach((problem) => {
    if (selected.length < count && !selected.includes(problem)) selected.push(problem);
  });
  return selected.slice(0, count);
}

function displayAnswer(problem) {
  if (problem.answerKind === "text") return problem.canonical || (problem.answers && problem.answers[0]) || "";
  return problem.answer || "";
}

function formatTags(problem) {
  return Array.isArray(problem.tags) && problem.tags.length ? problem.tags.join(", ") : "無";
}

function formatHints(problem) {
  return Array.isArray(problem.hints) && problem.hints.length ? problem.hints.join(" / ") : "自動提示";
}

function escapeMd(value) {
  return String(value || "").replace(/\r?\n/g, " ").trim();
}

function topicSummary(topicKey, sampled) {
  const byDifficulty = sampled.reduce((acc, problem) => {
    const rank = problem.rank || problem.difficulty;
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {});
  return [1, 2, 3, 4, 5, 6].map((difficulty) => `R${difficulty}: ${byDifficulty[difficulty] || 0}`).join(" · ");
}

function renderProblemCard(problem, index, topicLabel) {
  const answerKind = ANSWER_KIND_LABELS[problem.answerKind] || problem.answerKind;
  const source = problem.source ? `\n- Source: ${escapeMd(problem.source)}` : "";
  return `## ${String(index).padStart(2, "0")}. ${topicLabel} · ${problem.id}

- 題型：${topicLabel}
- Rank：${problem.rank || problem.difficulty}/6 ${problem.rankLabel || ""}
- 答案型態：${answerKind}
- Tags：${escapeMd(formatTags(problem))}
- Time limit：${problem.timeLimit}s
- Tab limit：${problem.tabLimit}${source}

題目：

\`\`\`tex
${problem.prompt}
\`\`\`

參考答案：

\`\`\`text
${displayAnswer(problem)}
\`\`\`

提示：

\`\`\`text
${escapeMd(formatHints(problem))}
\`\`\`

解法 / 說明：

\`\`\`text
${escapeMd(problem.solution)}
\`\`\`

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 
`;
}

const sampledByTopic = TOPIC_PLAN.map((topic) => ({
  ...topic,
  sampled: sampleTopic(topic.key, topic.count)
}));

const selectedIds = new Set();
const duplicate = sampledByTopic.some((topic) =>
  topic.sampled.some((problem) => {
    if (selectedIds.has(problem.id)) return true;
    selectedIds.add(problem.id);
    return false;
  })
);

if (duplicate) {
  throw new Error("audit sample contains duplicate problem IDs");
}

const total = sampledByTopic.reduce((sum, topic) => sum + topic.sampled.length, 0);
if (total !== 50) {
  throw new Error(`audit sample expected 50 problems, got ${total}`);
}

const markdown = `# BuzzCalculus P0-1 題庫人工審核抽樣表

日期：2026-06-05

Seed：\`${SEED}\`

## 審核目標

確認題目本身沒有錯誤，公開 Beta 前錯誤率需小於 2%。

本次抽查共 ${total} 題：

| 題型 | 目標題數 | 實際題數 | 難度分布 |
|---|---:|---:|---|
${sampledByTopic.map((topic) => `| ${topic.label} | ${topic.count} | ${topic.sampled.length} | ${topicSummary(topic.key, topic.sampled)} |`).join("\n")}

## 審核標準

每題檢查：

- 題目是否正確
- 答案是否正確
- 難度是否合理
- Tags 是否合理
- 提示是否合理

建議填寫方式：

- 若題目完全通過，勾選該題所有審核項與「通過」。
- 若只是措辭、tag、提示可優化，但不影響答案，請在備註寫「Minor」。
- 若題目、答案或判定方向錯誤，請在備註寫「Major」，並不要勾選「通過」。
- 錯誤率只計 Major；Minor 納入後續修正清單。

錯誤率計算：

\`\`\`text
錯誤題數 / 50
\`\`\`

驗收標準：

\`\`\`text
錯誤率 < 2%
\`\`\`

也就是最多只能有 0 題重大錯誤；若有 1 題錯，錯誤率就是 2%，不符合「小於 2%」。

## 抽樣清單

${sampledByTopic
  .flatMap((topic) => topic.sampled.map((problem, index) => ({ problem, topic, topicIndex: index + 1 })))
  .map((item, index) => renderProblemCard(item.problem, index + 1, item.topic.label))
  .join("\n---\n\n")}
`;

const outputDir = path.join(__dirname, "..", "reports");
const outputFile = path.join(outputDir, "problem_audit_sample.md");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, markdown, "utf8");

console.log(`Wrote ${path.relative(process.cwd(), outputFile)}`);
sampledByTopic.forEach((topic) => {
  console.log(`${topic.key}: ${topic.sampled.length} (${topic.sampled.map((problem) => problem.id).join(", ")})`);
});
