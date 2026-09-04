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

/* ── 技巧感知抽題（2026-09-04）────────────────────────────────
   能力模型接進 adaptiveShuffle 之後，兩個新行為要釘住：
   1. 弱技巧優先：在「別的題」上把某技巧練爛之後，抽題要偏向
      該技巧的**其他**題（技巧級的泛化正是模型比題目級錯誤率強的地方）。
   2. 交錯保證：同一個技巧不連續出現（能換就換）。 */

const graph = global.window.BuzzSkillGraph;
const bank = global.window.BUZZ_PROBLEMS;
const byId = new Map(bank.map((problem) => [problem.id, problem]));

// 1. 弱技巧優先。把 u-sub 在 exam-int-005 上答錯 14 次（讓 integral.usub
//    的精熟度掉到谷底、可信度過門檻），然後拿兩題**沒做過**的 R2 同主題題
//    對照：一題 u-sub、一題 IBP。多個 seed 下 u-sub 那題要明顯更常排前面。
const weakRecords = {
  history: [{
    finishedAt: new Date().toISOString(),
    mode: "quick",
    answers: Array.from({ length: 14 }, () => ({ problemId: "exam-int-005", correct: false, elapsed: 40 }))
  }],
  problemStats: {},
  topicStats: {},
  mistakes: {}
};
const usubProblem = byId.get("hc-usub-006");
const controlProblem = byId.get("hc-ibp-007");
if (!usubProblem || !controlProblem) {
  failures.push("skill-aware test problems missing from bank (hc-usub-006 / hc-ibp-007)");
} else {
  let usubFirst = 0;
  const TRIALS = 60;
  for (let seed = 0; seed < TRIALS; seed += 1) {
    const first = api.adaptiveShuffle([usubProblem, controlProblem], weakRecords, seed)[0];
    if (first.id === usubProblem.id) usubFirst += 1;
  }
  if (usubFirst < TRIALS * 0.65) {
    failures.push(`weak-skill boost too weak: u-sub problem first in only ${usubFirst}/${TRIALS} seeds`);
  }
  console.log(`Weak-skill boost: u-sub problem first in ${usubFirst}/${TRIALS} seeds`);
}

// 2. 交錯保證。兩題 u-sub + 兩題部分分式（同主題、空紀錄 → 只剩隨機分數），
//    無論隨機排出什麼，輸出必須交錯（2+2 一定排得出 ABAB）。
const interleavePool = ["exam-int-005", "hc-usub-006", "gap-int-pf-001", "gap-int-pf-003"]
  .map((id) => byId.get(id))
  .filter(Boolean);
if (interleavePool.length !== 4) {
  failures.push("interleave test problems missing from bank");
} else {
  const emptyRecords = { history: [], problemStats: {}, topicStats: {}, mistakes: {} };
  for (let seed = 0; seed < 20; seed += 1) {
    const orderedSkills = api.adaptiveShuffle(interleavePool, emptyRecords, seed)
      .map((problem) => (graph.skillsForProblem(problem) || [])[0] || problem.topic);
    for (let i = 1; i < orderedSkills.length; i += 1) {
      if (orderedSkills[i] === orderedSkills[i - 1]) {
        failures.push(`interleave failed at seed ${seed}: ${orderedSkills.join(" → ")}`);
        break;
      }
    }
  }
  console.log("Interleave guard: no adjacent same-skill pairs across 20 seeds");
}

/* ── 壓力訓練（2026-09-04）────────────────────────────────────
   1. 沒有能力資料時要能退回一般池（模式照樣能玩，只是失去針對性）。
   2. 計時遞減：第一題全額、最後一題 60%、下限 15 秒；非壓力模式不動。 */

global.localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({}));
const pressurePool = api.selectProblemPool(api.modes.pressure, "all");
if (pressurePool.length !== api.modes.pressure.count) {
  failures.push(`pressure mode selected ${pressurePool.length} problems instead of ${api.modes.pressure.count}`);
}

const fakeQuiz = { pressureMode: true, problems: new Array(10), index: 0 };
const fakeProblem = { timeLimit: 60 };
if (api.questionTimeLimit(fakeQuiz, fakeProblem) !== 60) {
  failures.push(`pressure timer should give full time on Q1, got ${api.questionTimeLimit(fakeQuiz, fakeProblem)}`);
}
fakeQuiz.index = 9;
if (api.questionTimeLimit(fakeQuiz, fakeProblem) !== 36) {
  failures.push(`pressure timer should give 60% on the last question, got ${api.questionTimeLimit(fakeQuiz, fakeProblem)}`);
}
if (api.questionTimeLimit(fakeQuiz, { timeLimit: 20 }) !== 15) {
  failures.push("pressure timer should floor at 15 seconds");
}
if (api.questionTimeLimit({ pressureMode: false, problems: new Array(10), index: 9 }, fakeProblem) !== 60) {
  failures.push("non-pressure sessions must keep the original time limit");
}
console.log("Pressure mode: fallback pool + decreasing timer (60 → 36, floor 15) pinned");

// 「今天適合」徽章：零紀錄也必須給得出至少一個帶理由的推薦
const recos = api.modeRecommendations({ history: [], problemStats: {}, topicStats: {}, mistakes: {} });
if (!recos.size || [...recos.values()].some((reason) => !reason)) {
  failures.push("modeRecommendations must always return at least one recommendation with a reason");
}
console.log(`Mode recommendations: ${[...recos.entries()].map(([key, why]) => `${key}（${why}）`).join("；")}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

console.log(`Selection avoids recent repeats: ${ordered.join(", ")}`);
console.log(`Selection pad result: ${padded.join(", ")}`);
console.log(`Tiny pool fallback: ${tiny.join(", ")}`);
console.log(`Exam mode pool: ${examPool.length} WebWork problems ${JSON.stringify(examTopicCounts)}, radius=${radiusCount}`);
