// 題庫必須是純微積分
//
// 2026-08 之前，本站同時放了微積分與理科秒殺包（物理 90 + 化學 81），
// 靠一道「科目閘門」擋著理科題不要跑進快速訓練、雷達、主線路線圖。
// 那道閘門要在每一條抽題路徑上重複防守，成本比價值高 ——
// 理科已移到姊妹站 BuzzPhysics，這裡改成守一條更簡單也更強的規則：
//
//   **這個題庫只有微積分。**
//
// 這支驗證器取代了原本的 validate_science_gate.js。它擋的是「有人不小心
// 把理科題包加回來」—— 那會讓能力模型、雷達與主線在沒有閘門保護的情況下
// 被非微積分內容污染。
//
// 用法：node tools/validate_calculus_only.js

"use strict";

const fs = require("fs");
const path = require("path");

global.window = {};
require("./lib/load_problem_sources.js")();
require("../src/kernel/skill_tags.js");
const graph = require("../src/kernel/skill_graph.js");

const root = path.join(__dirname, "..");
const problems = window.BUZZ_PROBLEMS || [];
const CALCULUS_TOPICS = new Set(["limits", "derivatives", "integrals", "series"]);

const failures = [];
function fail(message) {
  failures.push(message);
}

/* ── 1. 題目的 topic ────────────────────────────────────────── */

const badTopic = problems.filter((problem) => !CALCULUS_TOPICS.has(problem.topic));
if (badTopic.length) {
  const kinds = [...new Set(badTopic.map((p) => p.topic))];
  fail(`${badTopic.length} 題不是微積分（topic: ${kinds.join(", ")}）：${badTopic.slice(0, 5).map((p) => p.id).join(", ")}`);
}

/* ── 2. 不得有理科題包檔案被載入 ───────────────────────────── */

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scienceScripts = [...html.matchAll(/src="(src\/[^"]*(?:science|physics|chem)[^"]*\.js)"/gi)].map((m) => m[1]);
if (scienceScripts.length) {
  fail(`index.html 載入了理科題庫檔：${scienceScripts.join(", ")}`);
}

const scienceFiles = fs
  .readdirSync(path.join(root, "src"))
  .filter((name) => /^problem.*(science|physics|chem).*\.js$/i.test(name));
if (scienceFiles.length) {
  fail(`src/ 底下還有理科題庫檔：${scienceFiles.join(", ")}`);
}

/* ── 3. skill graph 不得有理科節點 ─────────────────────────── */

const scienceSkills = graph.skills.filter((skill) => skill.subject === "science");
if (scienceSkills.length) {
  fail(`skill graph 還有理科節點：${scienceSkills.map((s) => s.id).join(", ")}`);
}

/* ── 4. app.js 不得再有理科專屬設定 ────────────────────────── */

const app = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const leftovers = [
  ["TOPICS 仍有 physics", /^\s+physics: \{ label:/m],
  ["TOPICS 仍有 chemistry", /^\s+chemistry: \{ label:/m],
  ["仍有理科題包", /science_flash:|physics_flash:|chemistry_flash:|chem_memory:/],
  ["仍有科目閘門函式", /function (isScienceProblem|calculusOnly|scienceRequested)\b/]
];
leftovers.forEach(([label, pattern]) => {
  if (pattern.test(app)) fail(`app.js ${label}`);
});

/* ── 5. 使用者的舊紀錄不得因此壞掉 ─────────────────────────
   移除題目之後，既有使用者的 mistakes / history 裡會留著指向已消失題目的 id。
   那些地方必須自己擋掉 null，而不是丟例外 —— 否則老使用者一開站就白畫面。 */

const byId = new Map(problems.map((p) => [p.id, p]));
const ghostIds = ["ph-kin-001", "chem-mole-003", "sci-flash-099"];
ghostIds.forEach((id) => {
  if (byId.has(id)) fail(`${id} 竟然還在題庫裡`);
});

const ghostRecords = {
  history: [
    {
      id: "ghost",
      mode: "quick",
      finishedAt: new Date().toISOString(),
      answers: ghostIds.map((id) => ({ problemId: id, correct: true, elapsed: 20 }))
    }
  ],
  mistakes: ghostIds.reduce((acc, id) => {
    acc[id] = { problemId: id, wrongCount: 2, srs: { interval: 1, dueAt: 0 } };
    return acc;
  }, {})
};

const ability = require("../src/kernel/ability.js");
const planner = require("../src/kernel/planner.js");
const session = require("../src/kernel/session.js");
global.window.BuzzSkillGraph = graph;
global.window.BuzzAbility = ability;

try {
  const profile = ability.profile(ghostRecords, { problems, graph });
  if (profile.coverage.attempts !== 0) {
    fail(`指向已刪除題目的紀錄不該被算進能力，實際算了 ${profile.coverage.attempts} 筆`);
  }
  const plan = planner.recipe(ghostRecords, "daily15", { problems, graph, BuzzAbility: ability, BuzzSkillGraph: graph });
  if (!plan.why || !plan.why.trim()) fail("只有已刪除題目的紀錄，配方的 why 竟然是空的");
  const filled = session.fill(plan, { problems, graph, seed: "ghost" });
  if (!filled.problems.length) fail("只有已刪除題目的紀錄，抽不出任何題");
  if (filled.problems.some((p) => !CALCULUS_TOPICS.has(p.topic))) fail("抽出來的題不是微積分");
} catch (error) {
  fail(`指向已刪除題目的紀錄讓 kernel 丟例外：${error.message}`);
}

/* ── 報告 ─────────────────────────────────────────────────── */

const byTopic = problems.reduce((acc, p) => {
  acc[p.topic] = (acc[p.topic] || 0) + 1;
  return acc;
}, {});

console.log("Calculus-only bank");
console.log(`  題數      ${problems.length}`);
console.log(`  分佈      ${Object.entries(byTopic).map(([k, v]) => `${k} ${v}`).join(" / ")}`);
console.log(`  skill     ${graph.skills.length} 個節點，全部非理科`);

if (failures.length) {
  console.error("");
  console.error(`純微積分驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("calculus-only OK");
