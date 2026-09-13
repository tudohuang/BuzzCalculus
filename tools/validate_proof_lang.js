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

// 句型表與規則表要能列出來（教學頁用）
if (!lang.patterns.length || !lang.rules.length) fail("patterns / rules 表是空的");

console.log("白話證明");
console.log(`  題目      ${problems.length} 題`);
console.log(`  檢查      ${checks} 次（參考證明、刪行、翻符號）`);
console.log(`  句型      ${lang.patterns.length} 種 · 規則 ${lang.rules.length} 條`);
if (failures.length) {
  console.error(`\n白話證明驗證失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}
console.log("proof language OK");
