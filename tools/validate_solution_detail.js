// 詳解 v2（src/problem_solution_detail.js）的驗證器
//
// 詳解是一步一步對著看的：答案對、中間一步寫錯，比沒有詳解更糟（使用者會以為是自己錯）。
// 所以每一份都要過：
//   1. 形狀：spot、why 是有內容的中文；steps 3–8 步，每步 [文字, 宣稱]；trap 是文字；check 是文字或 [文字, 宣稱]
//   2. 排版：文字裡的 $…$ 成對、每一段都過 KaTeX（throwOnError）；$ 外面不准有 \frac 這種 LaTeX 指令（畫面上會原樣露出來）
//   3. 驗算：每一條宣稱都在取樣點上重算成立（tools/lib/step_claims.js；算不出來也算失敗 —— 換一個驗得了的寫法）
//   4. 接回答案：數值／運算式／不定積分題，最後一步要有一條跟 ANS 比的宣稱；答案是 dne 的，最後一步要說「不存在」
//   5. 反向：故意把一份的答案宣稱改錯、把一段 $…$ 弄壞，這支要紅（驗證器本身也要被驗）
//
// 用法：node tools/validate_solution_detail.js [--verbose] [--file 草稿.js（module.exports = { id: detail }）]
"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const { checkClaim, claimsOf } = require("./lib/step_claims.js");
const katex = require(path.join(__dirname, "..", "assets", "vendor", "katex", "katex.min.js"));

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const fileArg = args.includes("--file") ? args[args.indexOf("--file") + 1] : null;
const api = loadAppApi();
const problems = loadAppApi.allProblems();
const byId = new Map(problems.map((p) => [p.id, p]));
const build = require("./build_solution_detail.js");
// 正式表＝tools/content/detail/ 全部批次（同一題寫在兩批會在這裡就丟例外）；--file 只驗一批草稿
const table = fileArg ? require(path.resolve(fileArg)) : build.loadSource().table;
if (!table || typeof table !== "object") {
  console.error("讀不到詳解來源（tools/content/detail/*.js）");
  process.exit(1);
}
const COMPUTABLE = new Set(["numeric", "expression", "antiderivative", undefined]);
const CJK = /[一-鿿]/;

// 文字裡的 $…$：成對、每段都排得出來、外面沒有 LaTeX 指令。回傳問題清單
function texProblems(text) {
  const out = [];
  if (typeof text !== "string" || !text.trim()) return ["是空的"];
  const parts = text.split("$");
  if (parts.length % 2 === 0) return ["$ 沒有成對"];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      if (!part.trim()) { out.push("有一段空的 $$"); return; }
      try { katex.renderToString(part, { throwOnError: true }); } catch (e) { out.push(`$${part}$ 排不出來：${String(e.message).slice(0, 80)}`); }
    } else if (/\\[A-Za-z]/.test(part)) {
      out.push(`$ 外面有 LaTeX 指令（畫面上會原樣露出來）：${part.trim().slice(0, 40)}`);
    }
  });
  return out;
}

function validate(id, d) {
  const failures = [];
  const fail = (message) => failures.push(`${id}: ${message}`);
  const problem = byId.get(id);
  if (!problem) { fail("題庫裡沒有這一題"); return failures; }
  if (!d || typeof d !== "object" || Array.isArray(d)) { fail("要是 { spot, why, steps, trap?, check? }"); return failures; }
  const extra = Object.keys(d).filter((k) => !["spot", "why", "steps", "trap", "check"].includes(k));
  if (extra.length) fail(`不認得的欄位：${extra.join("、")}`);
  ["spot", "why"].forEach((key) => {
    if (typeof d[key] !== "string" || !CJK.test(d[key]) || d[key].replace(/\$[^$]*\$/g, "").trim().length < 8) fail(`${key} 要是有內容的中文`);
    else texProblems(d[key]).forEach((m) => fail(`${key}：${m}`));
  });
  if (d.trap !== undefined) {
    if (typeof d.trap !== "string" || !CJK.test(d.trap)) fail("trap 要是中文的一段話");
    else texProblems(d.trap).forEach((m) => fail(`trap：${m}`));
  }
  const dne = /^\s*dne\s*$/i.test(String(problem.answer || ""));
  const computable = COMPUTABLE.has(problem.answerKind) && !dne;
  const runClaims = (where, claimText) => {
    let usesAns = false;
    claimsOf(claimText).forEach((claim) => {
      if (/(^|[^A-Za-z0-9_])ANS([^A-Za-z0-9_]|$)/.test(claim)) usesAns = true;
      const result = checkClaim(claim, { normalize: api.normalizeExpression, answer: computable ? problem.answer : null, variable: problem.variable });
      if (!result.ok) fail(`${where} 的宣稱「${claim}」${result.reason}`);
      else if (verbose) console.log(`  ok ${id} ${where}  ${claim}`);
    });
    return usesAns;
  };
  const steps = d.steps;
  if (!Array.isArray(steps) || steps.length < 3 || steps.length > 8) { fail("steps 要 3–8 步"); return failures; }
  let lastUsesAns = false;
  steps.forEach((step, i) => {
    const where = `第 ${i + 1} 步`;
    if (!Array.isArray(step) || step.length !== 2 || typeof step[1] !== "string" || !step[1].trim()) { fail(`${where} 要是 [文字, 宣稱]`); return; }
    // 一步可以只是一條式子（$…$），但 $ 外面不准是英文句子（舊解說有幾百題是英文，那正是要換掉的）
    const outside = String(step[0]).replace(/\$[^$]*\$/g, " ");
    if (!CJK.test(step[0]) && !/\$[^$]+\$/.test(step[0])) fail(`${where} 要有中文或式子`);
    if (/[A-Za-z]{4,}\s+[A-Za-z]{3,}/.test(outside)) fail(`${where} 的 $ 外面像是英文句子：${outside.trim().slice(0, 40)}`);
    texProblems(step[0]).forEach((m) => fail(`${where}：${m}`));
    const usesAns = runClaims(where, step[1]);
    if (i === steps.length - 1) lastUsesAns = usesAns;
  });
  if (computable && !lastUsesAns) fail("最後一步要有一條跟 ANS 比對的宣稱（詳解必須接回答案）");
  if (dne && !/不存在/.test(steps[steps.length - 1][0])) fail("答案是 dne：最後一步要說出「不存在」");
  if (d.check !== undefined) {
    const text = Array.isArray(d.check) ? d.check[0] : d.check;
    if (typeof text !== "string" || !CJK.test(text)) fail("check 要是中文（或 [中文, 宣稱]）");
    else texProblems(text).forEach((m) => fail(`check：${m}`));
    if (Array.isArray(d.check)) {
      if (d.check.length !== 2 || typeof d.check[1] !== "string") fail("check 要是 [文字, 宣稱]");
      else runClaims("check", d.check[1]);
    }
  }
  return failures;
}

const failures = [];
let claims = 0;
Object.entries(table).forEach(([id, d]) => {
  failures.push(...validate(id, d));
  (d && Array.isArray(d.steps) ? d.steps : []).forEach((s) => { if (Array.isArray(s)) claims += claimsOf(s[1] || "").length; });
});

// 反向：驗證器自己會不會擋（只在驗正式表時跑）
if (!fileArg) {
  const [firstId, first] = Object.entries(table)[0] || [];
  if (first) {
    const broken = JSON.parse(JSON.stringify(first));
    const last = broken.steps[broken.steps.length - 1];
    last[1] = last[1].replace(/\bANS\b/, "(ANS)+1");
    if (!validate(firstId, broken).length) failures.push("反向測試：把最後一步的答案宣稱改錯，驗證器沒有擋");
    const badTex = JSON.parse(JSON.stringify(first));
    badTex.steps[0][0] = "壞掉的式子 $\\frac{1}{$ 在這";
    if (!validate(firstId, badTex).length) failures.push("反向測試：排不出來的 $…$ 沒有被擋");
    const outside = JSON.parse(JSON.stringify(first));
    outside.why = "這裡的 \\frac{1}{2} 沒有包在 $ 裡面，會原樣露出來";
    if (!validate(firstId, outside).length) failures.push("反向測試：$ 外面的 LaTeX 指令沒有被擋");
  }
  // 分片：產物跟來源同步、瀏覽器的雜湊跟打包工具一樣、每一片載進來真的掛到題目上
  const fs = require("fs");
  const files = build.render(table);
  Object.entries(files).forEach(([name, text]) => {
    const file = path.join(build.OUT, name);
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) failures.push(`src/detail/${name} 跟來源不同步：跑 node tools/build_solution_detail.js`);
  });
  const loader = global.window.BuzzDetail;
  if (!loader) failures.push("瀏覽器端沒有 window.BuzzDetail（src/problem_authored_solutions.js）");
  else {
    if (loader.SHARDS !== build.SHARDS) failures.push(`片數不一致：瀏覽器 ${loader.SHARDS}、打包 ${build.SHARDS}`);
    const off = problems.filter((p) => loader.shardOf(p.id) !== build.shardOf(p.id)).map((p) => p.id);
    if (off.length) failures.push(`雜湊不一致（瀏覽器會去錯的那一片找）：${off.slice(0, 5).join(", ")}`);
    Object.keys(files).forEach((name) => require(path.join(build.OUT, name)));
    const attached = problems.filter((p) => p.detail && table[p.id] === undefined ? false : Boolean(p.detail)).length;
    if (attached !== Object.keys(table).length) failures.push(`詳解有 ${Object.keys(table).length} 份，分片載進來掛上題目的只有 ${attached} 份`);
  }
}

if (failures.length) {
  console.error(`詳解驗證失敗（${failures.length}）：`);
  failures.forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}
console.log(`solution detail OK：${Object.keys(table).length} 份詳解、${claims} 條步驟宣稱全部重算成立`);
