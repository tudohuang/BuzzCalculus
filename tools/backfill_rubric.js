// 從現行 rank 反推 rubric 三軸，產生 src/kernel/rubric.js
//
// 現況的問題（spec 05.1）：作者只填 difficulty 1–4，而且 935 題（59%）全擠在 4，
// R5/R6 是 problem_difficulty_calibration.js 用 tag 規則推出來的。
// 結果是難度既沒有分辨力，也沒有可解釋性 —— 使用者問「這題為什麼算 R5」，
// 唯一的答案是「因為它有 frullani 這個 tag」。
//
// Rubric 把難度拆成三個可以各自爭論的軸：
//   Steps      解題要幾步
//   Obscurity  技巧多冷門
//   Load       計算量多大
//
// 鐵律：**遷移當下每一題的 rank 必須完全不變**。所以這支不是「重新評難度」，
// 是「把現有的 rank 分解成三軸」。做法是枚舉 27 種組合，取出能還原現行 rank 的那些，
// 再從中挑最接近啟發式猜測的一組。之後人工逐包修正三軸，rank 才會跟著動。
//
// 用法：node tools/backfill_rubric.js

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");

loadAppApi();
const problems = loadAppApi.allProblems();
const skillGraph = global.window.BuzzSkillGraph;
if (!skillGraph) throw new Error("skill graph 沒載到");

/* ── rubric → rank（spec 05.1 的公式，驗證器也用同一份）─────── */

const rubricRank = require("./lib/rubric_rank.js");

/* ── 啟發式先驗 ────────────────────────────────────────────── */

// 這些猜測只用來在「多組解都能還原 rank」時挑一組比較像話的，
// 不影響正確性 —— 正確性由「能不能還原 rank」保證。
function guessAxes(problem) {
  const skills = skillGraph.skillsForProblem(problem) || [];
  const tiers = skills.map((id) => (skillGraph.byId[id] || {}).tier || 1);
  const topTier = tiers.length ? Math.max(...tiers) : 1;

  // 步數：作者填的 difficulty 是最接近「要幾步」的既有訊號
  const steps = { 1: 1, 2: 1, 3: 2, 4: 3 }[problem.difficulty] || 2;

  // 冷門度：技巧在 skill graph 上的層級。tier 4 以上是需要辨識非標準結構的東西
  const obscurity = topTier >= 4 ? 3 : topTier === 3 ? 2 : 1;

  // 計算量：作答秒數上限是作者對「要寫多久」的直接估計
  const load = problem.timeLimit <= 40 ? 1 : problem.timeLimit <= 90 ? 2 : 3;

  return { steps, obscurity, load, skillCount: skills.length, topTier };
}

/* ── 反推 ──────────────────────────────────────────────────── */

const table = {};
const unsolvable = [];
const distribution = {};

problems.forEach((problem) => {
  const guess = guessAxes(problem);
  const target = problem.rank;

  let best = null;
  for (let steps = 1; steps <= 3; steps += 1) {
    for (let obscurity = 1; obscurity <= 3; obscurity += 1) {
      for (let load = 1; load <= 3; load += 1) {
        if (rubricRank({ steps, obscurity, load }, guess.skillCount) !== target) continue;
        const distance =
          Math.abs(steps - guess.steps) +
          Math.abs(obscurity - guess.obscurity) +
          Math.abs(load - guess.load);
        if (!best || distance < best.distance) best = { steps, obscurity, load, distance };
      }
    }
  }

  if (!best) {
    unsolvable.push({ id: problem.id, rank: target, skillCount: guess.skillCount });
    return;
  }
  table[problem.id] = [best.steps, best.obscurity, best.load];
  const key = `${best.steps}${best.obscurity}${best.load}`;
  distribution[key] = (distribution[key] || 0) + 1;
});

/* ── 寫檔 ─────────────────────────────────────────────────── */

const lines = Object.keys(table)
  .sort()
  .map((id) => `    ${JSON.stringify(id)}: [${table[id].join(",")}]`);

const output = path.join(__dirname, "..", "src", "kernel", "rubric.js");
fs.writeFileSync(output, `// 自動產生 —— 不要手改。來源：tools/backfill_rubric.js
//
// 難度三軸：[Steps, Obscurity, Load]，每軸 1–3，定義見 docs/spec/05-content-pipeline.md#51。
// rank 由三軸算出來（tools/lib/rubric_rank.js），不再由 tag 規則決定。
//
// 這份表是從**現行 rank 反推**的，不是重新評分：遷移當下每一題的 rank 完全不變
// （validate_rubric.js 逐題檢查這件事）。也就是說，現在這些三軸值只是
// 「一組能還原現行難度的合理拆解」，還沒有人逐題看過。
//
// 要改難度，就是改這裡的三軸，然後說得出理由。REVIEWED 裡有人工理由的題，
// 代表有人真的看過並負責；其餘的理由由 reasonFor() 依三軸與題目欄位生成，
// 而且會明講「未經人工複核」—— 不要讓機器推導的東西看起來像有人背書。
//
// 重新產生：node tools/backfill_rubric.js

(function () {
  "use strict";

  const RUBRIC = {
${lines.join(",\n")}
  };

  // 人工複核過的題目：內容在 src/kernel/rubric_reviewed.js（手改），這裡只是取用
  const REVIEWED = (typeof window !== "undefined" && window.BUZZ_RUBRIC_REVIEWED) || {};

  const AXIS_WORDS = {
    steps: ["", "一兩步就看得到", "三四步", "五步以上或要分情況"],
    obscurity: ["", "課本必教的技巧", "課本有教但容易忘", "要先認出非標準結構"],
    load: ["", "心算可完成", "要草稿但直線推進", "代數量大、容易算錯"]
  };

  function reasonFor(id) {
    if (REVIEWED[id]) return REVIEWED[id].why || REVIEWED[id];
    const axes = RUBRIC[id];
    if (!axes) return "";
    return AXIS_WORDS.steps[axes[0]] + "、" +
      AXIS_WORDS.obscurity[axes[1]] + "、" +
      AXIS_WORDS.load[axes[2]] + "（機器推導，未經人工複核）";
  }

  const API = {
    version: 1,
    table: RUBRIC,
    reviewed: REVIEWED,
    axesFor: (id) => (RUBRIC[id] ? { steps: RUBRIC[id][0], obscurity: RUBRIC[id][1], load: RUBRIC[id][2] } : null),
    reasonFor,
    isReviewed: (id) => Boolean(REVIEWED[id])
  };

  if (typeof module !== "undefined" && module.exports) module.exports = { RUBRIC, REVIEWED, API };
  if (typeof window !== "undefined") {
    window.BUZZ_RUBRIC = RUBRIC;
    window.BuzzRubric = API;
  }
})();
`, "utf8");

console.log(`rubric.js 寫出 ${Object.keys(table).length} / ${problems.length} 題`);
if (unsolvable.length) {
  console.log(`\n無法用三軸還原現行 rank 的題（${unsolvable.length}）：`);
  unsolvable.slice(0, 20).forEach((item) => {
    console.log(`  ${item.id.padEnd(24)}rank ${item.rank}, ${item.skillCount} 個技巧`);
  });
  if (unsolvable.length > 20) console.log(`  …還有 ${unsolvable.length - 20} 題`);
}

console.log("\n最常見的三軸組合：");
Object.entries(distribution).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([key, n]) => {
  console.log(`  Steps ${key[0]} / Obscurity ${key[1]} / Load ${key[2]}    ${n}`);
});
