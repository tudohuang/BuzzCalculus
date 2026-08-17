// Spec 現況快照 —— 讓規格裡的數字沒辦法過期
//
// docs/spec/README.md 有一段「現況快照（由程式碼實測）」，是整份 spec 的地基：
// 後面每一節的設計都寫著「必須相容於此」。
//
// 問題是那段是手寫的。實測時它寫著 1407 題、app.js 9122 行、12 支驗證器，
// 而當下的真實數字是 1459 題、12415 行、24 支。**一份數字錯的規格比沒有規格更糟** ——
// 因為讀的人會拿它當事實去做取捨，而不會想到要去驗證。
//
// 所以把那段變成產生的。這也是專案自己的規則：
// 「凡是會顯示給人看的數字，都要有 CI 守門。」規格上的數字也是數字。
//
// 用法：
//   node tools/spec_snapshot.js            檢查 README 的快照跟現況一不一致（CI 用）
//   node tools/spec_snapshot.js --update   重新產生

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const README = path.join(ROOT, "docs", "spec", "README.md");
const BEGIN = "<!-- SPEC-SNAPSHOT:BEGIN 由 tools/spec_snapshot.js 產生，不要手改 -->";
const END = "<!-- SPEC-SNAPSHOT:END -->";

const update = process.argv.includes("--update");

/* ── 量測 ─────────────────────────────────────────────────── */

const appApi = require("./lib/app_api.js");
const problems = appApi.allProblems();
const proofs = (global.window && global.window.BUZZ_PROOFS) || [];

const countLines = (relative) =>
  fs.readFileSync(path.join(ROOT, relative), "utf8").split(/\r?\n/).length;

const countFiles = (dir, pattern) => {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return 0;
  return fs.readdirSync(full).filter((name) => pattern.test(name)).length;
};

const withField = (test) => problems.filter(test).length;

const tally = (pick) =>
  problems.reduce((acc, problem) => {
    const key = pick(problem);
    if (key === undefined || key === null) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const distinctTags = new Set();
const skillTags = new Set();
const graph = global.window && global.window.BuzzSkillGraph;
problems.forEach((problem) => {
  (problem.tags || []).forEach((tag) => {
    distinctTags.add(tag);
    if (graph && typeof graph.isSkillTag === "function" && graph.isSkillTag(tag)) skillTags.add(tag);
  });
});

// 驗算覆蓋率直接讀側表，不重跑驗算（那要好幾分鐘）
let verified = 0;
try {
  const sidecar = fs.readFileSync(path.join(ROOT, "src", "kernel", "verified_answers.js"), "utf8");
  verified = (sidecar.match(/^\s{4}"/gm) || []).length;
} catch (_error) {
  verified = 0;
}

const answerKinds = tally((p) => p.answerKind);
const ranks = tally((p) => p.rank);

const stats = {
  total: problems.length,
  source: withField((p) => p.source),
  tags: withField((p) => p.tags && p.tags.length),
  solution: withField((p) => typeof p.solution === "string" && p.solution.trim()),
  hints: withField((p) => p.hints && p.hints.length),
  solutionSteps: withField((p) => p.solutionSteps && p.solutionSteps.length),
  verified,
  proofs: proofs.length,
  distinctTags: distinctTags.size,
  skillTags: skillTags.size,
  appLines: countLines("src/app.js"),
  cssLines: countLines("styles.css"),
  problemFiles: countFiles("src", /^problem_.*\.js$/),
  kernelFiles: countFiles("src/kernel", /\.js$/),
  validators: countFiles("tools", /^(validate_|verify_|smoke_|e2e_).*\.js$/)
};

/* ── 產生 ─────────────────────────────────────────────────── */

const pct = (n) => `${((100 * n) / stats.total).toFixed(0)}%`;
const row = (label, value, note) => `| ${label} | ${value} |${note === undefined ? "" : ` ${note} |`}`;

function render() {
  const kindOrder = Object.keys(answerKinds).sort((a, b) => answerKinds[b] - answerKinds[a]);
  return [
    BEGIN,
    "",
    "**規模**",
    "",
    "| 項目 | 數字 | 備註 |",
    "| --- | ---: | --- |",
    row("題目總數", stats.total, "純微積分；理科秒殺包已於 2026-08 移出"),
    row("答案通過獨立數值驗算", `${stats.verified}（${pct(stats.verified)}）`, "其餘是證明題與定性題，本質上沒有可比對的數值"),
    row("有 `source`", stats.source, ""),
    row("有 `tags`", stats.tags, `distinct tag ${stats.distinctTags} 個，其中 ${stats.skillTags} 個是技巧 tag`),
    row("有 `solution`", stats.solution, "單段文字"),
    row("有作者撰寫 `hints`", stats.hints, ""),
    row("有 `solutionSteps`", stats.solutionSteps, "結構化步驟，仍是最大的內容缺口"),
    row("證明題", stats.proofs, "含 Lean 機器驗證 8 則"),
    row("`src/app.js`", `${stats.appLines} 行`, "單一 IIFE，拆分進行中"),
    row("`styles.css`", `${stats.cssLines} 行`, ""),
    row("題庫檔 `src/problem_*.js`", stats.problemFiles, ""),
    row("kernel 模組 `src/kernel/*.js`", stats.kernelFiles, "純函式層"),
    row("CI 驗證器 `tools/`", `${stats.validators} 支`, "validate / verify / smoke / e2e"),
    "",
    `**答案型別分佈**：${kindOrder.map((k) => `\`${k}\` ${answerKinds[k]}`).join("、")}。`,
    "",
    `**難度分佈**：${[1, 2, 3, 4, 5, 6].map((r) => `R${r} ${ranks[r] || 0}`).join(" / ")}。`,
    "rank 由 `src/kernel/rubric.js` 的三軸（步驟數 / 冷僻度 / 計算負擔）算出，",
    "不再由 tag 規則推導；黃金檔 `tools/golden/difficulty.json` 釘住分佈與錨點題。",
    "",
    END
  ].join("\n");
}

/* ── 檢查或寫入 ───────────────────────────────────────────── */

const source = fs.readFileSync(README, "utf8");
const nl = source.includes("\r\n") ? "\r\n" : "\n";
const beginAt = source.indexOf(BEGIN);
const endAt = source.indexOf(END);

if (beginAt < 0 || endAt < 0) {
  console.error("docs/spec/README.md 裡找不到 SPEC-SNAPSHOT 標記。");
  console.error("第一次建立請手動加上這兩行，再跑 --update：");
  console.error(`  ${BEGIN}`);
  console.error(`  ${END}`);
  process.exit(1);
}

const current = source.slice(beginAt, endAt + END.length);
const next = render().split("\n").join(nl);

if (update) {
  fs.writeFileSync(README, source.slice(0, beginAt) + next + source.slice(endAt + END.length), "utf8");
  console.log("已更新 docs/spec/README.md 的現況快照");
  console.log(`  ${stats.total} 題 / 驗算 ${stats.verified} / app.js ${stats.appLines} 行 / 驗證器 ${stats.validators} 支`);
  process.exit(0);
}

console.log("Spec 現況快照");
console.log(`  題目      ${stats.total}（驗算通過 ${stats.verified}）`);
console.log(`  程式      app.js ${stats.appLines} 行 / kernel ${stats.kernelFiles} 個模組`);
console.log(`  驗證器    ${stats.validators} 支`);

if (current.replace(/\r\n/g, "\n") !== next.replace(/\r\n/g, "\n")) {
  console.error("");
  console.error("docs/spec/README.md 的現況快照跟程式碼不一致。");
  console.error("那一段是整份 spec 的地基（後面每一節都寫著「必須相容於此」），");
  console.error("數字錯掉的話讀的人會拿它當事實去做取捨。");
  console.error("");
  console.error("跑這個更新：node tools/spec_snapshot.js --update");
  process.exit(1);
}

console.log("");
console.log("spec snapshot OK");
