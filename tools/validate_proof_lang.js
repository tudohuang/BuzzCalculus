// 白話證明的黃金測試。
//
// 一個「檢查器」最容易犯的錯不是紅錯，是綠錯：什麼都放行。
// 所以這裡對每一題做三件事：
//   1. 參考證明必須全綠（allowUnsure 的題允許黃，但不能紅、不能缺骨架）
//   2. 刪掉任何一行，都不能還是「全綠」（每一行都得是有用的）
//   3. 把任何一條推導裡的關係符號翻掉（< ↔ >、= → !=），必須紅在那一行
// 三者缺一，這個語言就只是會點頭的橡皮圖章。
//
// 用法：node tools/validate_proof_lang.js

"use strict";

const path = require("path");
global.window = global;
require(path.join(__dirname, "..", "src", "kernel", "proof_lang.js"));
require(path.join(__dirname, "..", "src", "proof_lang_content.js"));

const lang = global.window.BuzzProofLang;
const problems = global.window.BUZZ_PROOF_LANG_PROBLEMS;
const failures = [];
let checks = 0;

function fail(message) {
  failures.push(message);
}

const FLIP = [[" < ", " > "], [" <= ", " >= "], [" ≤ ", " ≥ "], [" ≥ ", " ≤ "], [" >= ", " <= "], [" > ", " < "], [" = ", " != "]];

problems.forEach((spec) => {
  const text = spec.reference.join("\n");
  const report = lang.check(spec, text);
  checks += 1;
  const okVerdict = spec.allowUnsure ? ["verified", "partial"] : ["verified"];
  // 1b. 使用者不打空格：把運算子、括號、標點旁邊的空格全刪掉（cos c 這種靠空格分開的識別字不動），判定必須一樣。
  //     實際踩過：接地判斷去空白的正規式寫成 /s+/，|x-3| 對不上假設裡的 |x − 3|，
  //     跟題解一模一樣的證明被標黃。
  const squeezed = lang.check(spec, spec.reference.map((line) => line.replace(/ *([=<>+\-*\/|(),，。：；≤≥≠−]) */g, "$1")).join("\n"));
  if (squeezed.verdict !== report.verdict) {
    fail(`${spec.id}：參考證明去掉空格之後判定從 ${report.verdict} 變成 ${squeezed.verdict}\n    ${squeezed.lines.filter((l) => l.status !== "ok").map((l) => `第 ${l.n} 行 ${l.status}：${l.note}`).join("\n    ")}`);
  }
  if (!okVerdict.includes(report.verdict)) {
    fail(`${spec.id}：參考證明應該${spec.allowUnsure ? "至少結構完整" : "全綠"}，卻是 ${report.verdict}（${report.verdictText}）\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `第 ${l.n} 行 ${l.status}：${l.raw} —— ${l.note}`).join("\n    ")}`);
  }

  // 2. 刪一行
  spec.reference.forEach((line, index) => {
    // optional：宣告、標籤、可以跳過的一步（「展開得 …」前後兩行等價）—— 刪了本來就該還是對的
    if (spec.optional && spec.optional.includes(index)) return;
    const mutated = spec.reference.filter((_, i) => i !== index).join("\n");
    const result = lang.check(spec, mutated);
    checks += 1;
    if (result.verdict === "verified") {
      fail(`${spec.id}：刪掉第 ${index + 1} 行「${line}」之後居然還全綠 —— 這一行沒有被用到`);
    }
  });

  // 3. 翻符號
  spec.reference.forEach((line, index) => {
    const kind = lang.parse(line)[0]?.kind;
    if (!["claim", "because", "by", "base"].includes(kind)) return;
    const flip = FLIP.find(([from]) => line.includes(from));
    if (!flip) return;
    // lim 這種文字主張不走代數引擎（那是規則對形狀），翻它的符號本來就抓不到
    if (/lim/.test(line)) return;
    const mutatedLine = line.replace(flip[0], flip[1]);
    const mutated = spec.reference.map((item, i) => (i === index ? mutatedLine : item)).join("\n");
    const result = lang.check(spec, mutated);
    checks += 1;
    const hit = result.lines.find((item) => item.n === index + 1);
    if (!hit || hit.status !== "error") {
      // 有些翻法還是對的（a >= b 翻成 a <= b 在 a = b 時），只要整份不再全綠就算抓到
      if (result.verdict === "verified") {
        fail(`${spec.id}：第 ${index + 1} 行「${line}」翻成「${mutatedLine}」之後還是全綠 —— 代數引擎沒在看`);
      }
    }
  });
});

// 4. 橡皮圖章測試：一行寫出目標就當證完，必須不是全綠
const bare = problems.find((spec) => spec.id === "pl-square-bound");
const bareReport = lang.check(bare, "所以 x^2 + 1 >= 2x。");
checks += 1;
if (bareReport.verdict === "verified") fail("一行直接寫目標居然全綠 —— 接地檢查沒有作用");
const wrongDelta = problems.find((spec) => spec.id === "pl-limit-linear");
const wrongReport = lang.check(wrongDelta, wrongDelta.reference.map((line) => line.replace("δ = ε/3", "δ = ε")).join(String.fromCharCode(10)));
checks += 1;
if (wrongReport.verdict === "verified" || !wrongReport.lines.some((line) => line.n === 4 && line.status === "error")) fail("δ = ε 這個錯的 δ 沒有被第 4 行的鏈抓到");
const gibberish = lang.check(bare, "我覺得這題很簡單。" + String.fromCharCode(10) + "所以 x^2 + 1 >= 2x。");
checks += 1;
if (gibberish.lines[0].status !== "error") fail("讀不懂的句子應該標紅");

// 5. 嚴格語法：這些以前會被放行的寫法，現在要紅或黃（2026-09-14 收緊）
const strictCases = [
  ["A = A 湊兩段鏈", "設 x 為實數。\n則 x² + 1 = x² + 1 ≥ 2x。", (r) => r.verdict === "broken" && r.lines[1].status === "error"],
  ["因為目標所以目標", "設 x 為實數。\n因為 x² + 1 ≥ 2x，所以 x² + 1 ≥ 2x。", (r) => r.verdict !== "verified" && r.lines[1].status !== "ok"],
  ["沒有句型的裸關係式", "設 x 為實數。\n(x − 1)² ≥ 0。\n所以 x² + 1 ≥ 2x。", (r) => r.lines[1].status === "error"],
  ["沒宣告的變數", "設 x 為實數。\n則 (x − 1)² ≥ 0 且 y ≥ 0。\n所以 x² + 1 ≥ 2x。", (r) => r.lines[1].status === "error"],
  ["方向不一致的鏈", "設 x 為實數。\n則 x² ≥ 0 ≤ x² + 1 − 2x。\n所以 x² + 1 ≥ 2x。", (r) => r.lines[1].status === "error"],
  ["一行兩句", "設 x 為實數。則 (x − 1)² ≥ 0。", (r) => r.lines[0].status === "error" && /一行只能一句/.test(r.lines[0].note)],
  ["第一段就是目標的鏈", "設 x 為實數。\n則 2x ≤ x² + 1 = (x − 1)² + 2x。", (r) => r.verdict !== "verified"],
  ["從目標左式出發、走到顯然的東西", "設 x 為實數。\n則 x² + 1 = (x − 1)² + 2x ≥ 2x。", (r) => r.verdict === "verified"],
  ["顯然：a + b ≥ 0 當 a, b ≥ 0", "設 a, b ≥ 0。\n因為 a + b ≥ 0 且 (a − b)² ≥ 0，所以 (a + b)(a − b)² ≥ 0。", (r) => r.lines[1].status === "ok"],
  ["不顯然：x² + 1 ≥ 2x 不能當前提", "設 x 為實數。\n因為 x² + 1 ≥ 2x，所以 (x − 1)² ≥ 0。", (r) => r.lines[1].status !== "ok"]
];
strictCases.forEach(([name, text, expect]) => {
  const spec = /a, b/.test(text) ? problems.find((item) => item.id === "pl-cube-sum") : bare;
  const result = lang.check(spec, text);
  checks += 1;
  if (!expect(result)) fail(`嚴格語法「${name}」沒守住：${result.verdict} / ${result.lines.map((l) => l.status).join(",")}\n    ${result.lines.map((l) => `${l.raw} —— ${l.note}`).join("\n    ")}`);
});

// 句型表與規則表要能列出來（教學頁用）
if (!lang.patterns.length || !lang.rules.length) fail("patterns / rules 表是空的");
// 速查表不能漂：每一個句型、每一條規則都要有一列，規則要寫出「會認的寫法」
const sheet = lang.cheatsheet || {};
lang.patterns.filter((p) => p.kind !== "unknown").forEach((p) => {
  if (!(sheet.syntax || []).some((row) => row.kind === p.kind)) fail(`速查表少了句型「${p.label}」（${p.kind}）`);
});
lang.rules.forEach((rule) => {
  const row = (sheet.rules || []).find((item) => item.id === rule.id);
  if (!row) fail(`速查表少了定理「${rule.name}」`);
  else if (!row.form) fail(`速查表的定理「${rule.name}」沒寫「會認的寫法」`);
});
(sheet.syntax || []).forEach((row) => {
  if (!lang.patterns.some((p) => p.kind === row.kind)) fail(`速查表多了一個不存在的句型 ${row.kind}`);
});

const minimum = problems.find((spec) => spec.id === "pl-min-positive");
for (const [name, edits] of [
  ["negative witness", (line) => line.replace("t = m/2", "t = -1").replace("0 < t < m", "t < m")],
  ["zero witness", (line) => line.replace("t = m/2", "t = 0").replace("0 < t < m", "t < m")],
  ["missing membership", (line) => line.replace("0 < t < m", "t < m")],
  ["wrong set", (line) => line.replaceAll("正實數", "正整數")]
]) {
  const text = minimum.reference.map(edits).join("\n");
  const spec = name === "wrong set" ? { ...minimum, goal: { text: ["不存在最小的正整數"] } } : minimum;
  const result = lang.check(spec, text);
  checks += 1;
  if (result.verdict === "verified" || result.lines[3].status === "ok") fail(`反證不能接受 ${name}`);
}
// A satisfiable but unsampled domain is not a contradiction.
const rare = { ...minimum, vars: { m: { min: 1000000000, max: 1000000001 } } };
const rareResult = lang.check(rare, ["反設 m > 2000000000。", "這與假設矛盾。", minimum.reference[4]].join("\n"));
checks += 1;
if (rareResult.lines[1].status === "ok" || rareResult.verdict === "verified") fail("取樣失敗不能推出反證成立");

// 5. 課程：範例要全綠（課文旁邊的註解是真的跑出來的）、練習的起手式不能有紅、
//    也不能起手就寫完（要留東西給人寫）、每一課引用的題目都要存在、id 不能重複
const lessons = global.window.BUZZ_PROOF_LANG_LESSONS || [];
if (!lessons.length) fail("沒有課程");
const seen = new Set();
lessons.forEach((lesson, index) => {
  const label = `第 ${index + 1} 課（${lesson.id}）`;
  if (seen.has(lesson.id)) fail(`${label}：id 重複`);
  seen.add(lesson.id);
  if (!Array.isArray(lesson.intro) || !lesson.intro.length) fail(`${label}：沒有課文`);
  const example = problems.find((spec) => spec.id === lesson.exampleId);
  if (!example) { fail(`${label}：範例 ${lesson.exampleId} 不存在`); return; }
  checks += 1;
  if (lang.check(example, example.reference.join("\n")).verdict !== "verified") fail(`${label}：範例 ${example.id} 不是全綠`);
  const exercise = lesson.exercise && problems.find((spec) => spec.id === lesson.exercise.id);
  if (!exercise) { fail(`${label}：練習 ${lesson.exercise && lesson.exercise.id} 不存在`); return; }
  if (exercise.id === example.id) fail(`${label}：練習跟範例是同一題，答案就在旁邊`);
  if (!lesson.exercise.task) fail(`${label}：練習沒有說明`);
  const starter = lesson.exercise.starter || [];
  const starterReport = lang.check(exercise, starter.join("\n"));
  checks += 1;
  if (starterReport.lines.some((line) => line.status === "error")) fail(`${label}：練習的起手式就有紅的\n    ${starterReport.lines.filter((l) => l.status === "error").map((l) => `${l.raw} —— ${l.note}`).join("\n    ")}`);
  if (starterReport.verdict === "verified") fail(`${label}：起手式已經全綠，沒東西留給人寫`);
  // 起手式要真的是參考證明的開頭（逐行對得上），使用者接著寫參考證明的其餘行就會全綠
  const normalizeLine = (text) => lang.parse(text)[0] ? lang.parse(text)[0].kind + ":" + String(text).replace(/\s+/g, "") : String(text);
  starter.forEach((line, i) => {
    if (normalizeLine(line) !== normalizeLine(exercise.reference[i] || "")) fail(`${label}：起手式第 ${i + 1} 行「${line}」跟參考證明第 ${i + 1} 行「${exercise.reference[i] || ""}」對不上`);
  });
  const completed = lang.check(exercise, starter.concat(exercise.reference.slice(starter.length)).join("\n"));
  checks += 1;
  if (completed.verdict !== "verified") fail(`${label}：起手式接上參考證明的其餘行之後不是全綠（${completed.verdict}）`);
});

console.log("白話證明");
console.log(`  題目      ${problems.length} 題 · 課程 ${lessons.length} 課`);
console.log(`  檢查      ${checks} 次（參考證明、刪行、翻符號）`);
console.log(`  句型      ${lang.patterns.length} 種 · 規則 ${lang.rules.length} 條`);
if (failures.length) {
  console.error(`\n白話證明驗證失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}
console.log("proof language OK");
