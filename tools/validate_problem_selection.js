// 載入方式改用 tools/lib/app_api.js（2026-08-16）。
//
// 這支原本自己帶一份假 DOM，只載題庫 + app.js，沒有載 kernel，
// 所以難度校準走的是 fallback 路徑 —— 驗到的 rank 跟使用者看到的不一樣。
// 共用載入層會照 index.html 的**文件順序**把所有 src/*.js 載進來，
// 驗證的因此是實際上線的那份組態。

"use strict";

const loadAppApi = require("./lib/app_api.js");
const api = loadAppApi();
const window = global.window;
if (!api || typeof api.adaptiveShuffle !== "function" || typeof api.padPool !== "function") {
  throw new Error("selection test hooks are unavailable");
}

const records = {
  history: [
    {
      answers: [
        { problemId: "recent-a" },
        { problemId: "recent-b" }
      ]
    }
  ],
  problemStats: {},
  topicStats: {},
  mistakes: {}
};

const pool = [
  { id: "recent-a", topic: "derivatives", difficulty: 2 },
  { id: "fresh-a", topic: "derivatives", difficulty: 2 },
  { id: "fresh-b", topic: "derivatives", difficulty: 2 }
];

const failures = [];
const ordered = api.adaptiveShuffle(pool, records, 12345).map((problem) => problem.id);
if (ordered[0] === "recent-a") {
  failures.push(`adaptiveShuffle kept a recent problem first: ${ordered.join(", ")}`);
}

const padded = api.padPool([], pool, 2, { records }).map((problem) => problem.id);
if (padded.includes("recent-a") && (padded.includes("fresh-a") || padded.includes("fresh-b"))) {
  failures.push(`padPool used a recent problem before exhausting fresh options: ${padded.join(", ")}`);
}

const tiny = api.padPool([], [pool[0]], 2, { records }).map((problem) => problem.id);
if (tiny.length !== 2 || tiny[0] !== "recent-a" || tiny[1] !== "recent-a") {
  failures.push(`padPool should fall back to repeats only when the pool is tiny: ${tiny.join(", ")}`);
}

const recent = api.recentProblemIds(records, 2);
if (recent.join(",") !== "recent-a,recent-b") {
  failures.push(`recentProblemIds returned unexpected order: ${recent.join(", ")}`);
}

global.localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ settings: { difficultyCap: 2 } }));
const cappedQuick = api.selectProblemPool(api.modes.quick, "all");
const quickRanks = cappedQuick.map((problem) => api.problemRank(problem));
if (!cappedQuick.length || quickRanks.some((rank) => rank > 2)) {
  failures.push(`quick mode should honor R2 cap, got ranks: ${quickRanks.join(", ")}`);
}
const cappedCount = api.difficultyScopedCount(2, "all", "all");
if (cappedCount <= 0 || cappedCount >= global.window.BUZZ_PROBLEMS.length) {
  failures.push(`difficultyScopedCount produced suspicious R2 count: ${cappedCount}`);
}

global.localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ settings: { difficultyCap: 2 } }));
const examPool = api.selectProblemPool(api.modes.exam, "all");
if (examPool.length !== api.modes.exam.count) {
  failures.push(`exam mode selected ${examPool.length} problems instead of ${api.modes.exam.count}`);
}
const examHasHard = examPool.some((problem) => api.problemRank(problem) > 2);
if (!examHasHard) {
  failures.push("exam mode should ignore the beginner cap and keep higher-rank exam problems available");
}
const invalidExam = examPool.filter((problem) => !["numeric", "expression", "antiderivative"].includes(problem.answerKind));
if (invalidExam.length) {
  failures.push(`exam mode selected non-WebWork problems: ${invalidExam.map((problem) => problem.id).join(", ")}`);
}
const nonExamTagged = examPool.filter((problem) => !(problem.tags || []).includes("exam-style"));
if (nonExamTagged.length) {
  failures.push(`exam mode should prefer exam-style tagged problems: ${nonExamTagged.map((problem) => problem.id).join(", ")}`);
}
const examTopicCounts = examPool.reduce((counts, problem) => {
  counts[problem.topic] = (counts[problem.topic] || 0) + 1;
  return counts;
}, {});
if ((examTopicCounts.derivatives || 0) + (examTopicCounts.integrals || 0) < 12) {
  failures.push(`exam mode should emphasize derivatives/integrals: ${JSON.stringify(examTopicCounts)}`);
}
if ((examTopicCounts.series || 0) > 4) {
  failures.push(`exam mode selected too many series problems: ${JSON.stringify(examTopicCounts)}`);
}
const radiusCount = examPool.filter((problem) => (problem.tags || []).includes("radius")).length;
if (radiusCount > 1) {
  failures.push(`exam mode selected too many radius problems: ${radiusCount}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

console.log(`Selection avoids recent repeats: ${ordered.join(", ")}`);
console.log(`Selection pad result: ${padded.join(", ")}`);
console.log(`Tiny pool fallback: ${tiny.join(", ")}`);
console.log(`Exam mode pool: ${examPool.length} WebWork problems ${JSON.stringify(examTopicCounts)}, radius=${radiusCount}`);
