// Proof Input v2（自由書寫層）的行為：
//   1. 舊格式 100% 相容：每一題的參考證明經過翻譯層之後，判定與逐句顏色跟直接餵引擎一模一樣
//   2. 同一份證明的四種寫法（句型語言／自然中文／英文／英文＋LaTeX）都要全綠
//   3. 表層變異：$ 少一個、} 少一個、align 環境、讀不懂的句子 → 黃（不是紅，也不能放行）；
//      \epsilon／\varepsilon／ε、<=／\le／≤、數學區塊換行、and suppose 合併 → 判定不變
//   4. 翻譯層不能把紅變綠：引擎判紅的變異（刪一行、翻符號）經過翻譯層還是紅
//
// 用法：node tools/validate_proof_surface.js
"use strict";

const path = require("path");
const vm = require("vm");
const fs = require("fs");

const root = path.join(__dirname, "..");
const load = (file) => {
  const ctx = { window: {}, module: { exports: {} }, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx);
  return ctx;
};
const lang = load("src/kernel/proof_lang.js").module.exports;
const surface = load("src/kernel/proof_surface.js").module.exports;
const problems = load("src/proof_lang_content.js").window.BUZZ_PROOF_LANG_PROBLEMS;
const byId = (id) => problems.find((item) => item.id === id);

const failures = [];
let checks = 0;
const fail = (message) => failures.push(message);
const statuses = (report) => report.lines.map((line) => line.status).join(",");
const surfaceCheck = (spec, text) => surface.check(lang, spec, text);

/* ── 1. 舊格式相容 ─────────────────────────────────────────── */
problems.forEach((spec) => {
  const text = spec.reference.join("\n");
  const direct = lang.check(spec, text);
  const viaSurface = surfaceCheck(spec, text);
  checks += 1;
  if (direct.verdict !== viaSurface.verdict || statuses(direct) !== statuses(viaSurface)) {
    fail(`${spec.id}：參考證明經過翻譯層之後不一樣：${direct.verdict}/${statuses(direct)} → ${viaSurface.verdict}/${statuses(viaSurface)}`);
  }
  // 翻譯層不能把紅變綠：刪掉中間一行，引擎紅的翻譯層也要紅
  const dropped = spec.reference.filter((_, i) => i !== Math.floor(spec.reference.length / 2)).join("\n");
  const directDropped = lang.check(spec, dropped);
  const surfaceDropped = surfaceCheck(spec, dropped);
  checks += 1;
  if (directDropped.verdict !== surfaceDropped.verdict) {
    fail(`${spec.id}：刪一行之後引擎是 ${directDropped.verdict}，翻譯層卻是 ${surfaceDropped.verdict}`);
  }
});

/* ── 2. 同一份證明的多種寫法 ───────────────────────────────── */
const linear = byId("pl-limit-linear");
const VARIANTS = {
  "自然中文": "給定任意 ε>0，我們選 δ=ε/3。\n若 0<|x-2|<δ，則 |3x-6|=3|x-2|<3δ=ε。\n因此 lim_{x→2} 3x = 6。",
  "英文": "Let epsilon > 0 be given.\nChoose delta = epsilon/3 and suppose 0 < |x-2| < delta.\nThen |3x-6| = 3|x-2| < 3 delta = epsilon.\nTherefore lim_{x->2} 3x = 6.",
  "英文 + LaTeX": "Let $\\varepsilon>0$ be given.\n\nChoose\n\\[\n\\delta=\\frac{\\varepsilon}{3}.\n\\]\n\nSuppose $0<|x-2|<\\delta$. Then\n$$\n|3x-6|\n= 3|x-2|\n< 3\\delta\n= \\varepsilon.\n$$\n\nTherefore, by the $\\varepsilon$-$\\delta$ definition,\n\\[\n\\lim_{x\\to2}3x=6.\n\\]",
  "英文散文一段": "Let ε > 0 be given. Choose δ = ε/3 > 0 and suppose 0 < |x−2| < δ. Then |3x−6| = 3|x−2| < 3δ = ε. This proves that lim_{x→2} 3x = 6.",
  "中英混寫": "任取 ε > 0。\nChoose δ = ε/3.\n假設 0 < |x − 2| < δ。\nThen |3x − 6| = 3|x − 2| < 3δ = ε.\n故 lim_{x→2} 3x = 6。"
};
Object.entries(VARIANTS).forEach(([name, text]) => {
  const report = surfaceCheck(linear, text);
  checks += 1;
  if (report.verdict !== "verified") fail(`寫法「${name}」應該全綠，卻是 ${report.verdict}：${statuses(report)}\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `${l.raw} → ${l.note}`).join("\n    ")}`);
});

// 歸納法與分情況也各一份英文
const induction = byId("pl-induction-sum");
if (induction) {
  const goalLine = induction.reference[induction.reference.length - 1];
  const english = [
    "We proceed by induction on n.",
    "Base case: n = 1: the left side is 1 and the right side is 1(1+1)/2 = 1, so it holds.",
    "Suppose it holds for n = k, that is, 1 + 2 + ... + k = k(k+1)/2.",
    "Then 1 + 2 + ... + k + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2.",
    goalLine
  ].join("\n");
  const report = surfaceCheck(induction, english);
  checks += 1;
  if (report.verdict !== "verified" && report.verdict !== lang.check(induction, induction.reference.join("\n")).verdict) {
    fail(`歸納法的英文寫法應該跟參考證明同判定，卻是 ${report.verdict}：${statuses(report)}\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `${l.raw} → ${l.note}`).join("\n    ")}`);
  }
}

/* ── 3. 表層變異 ───────────────────────────────────────────── */
const square = byId("pl-limit-square");
const squareText = square.reference.join("\n");
const equivalents = {
  "≤ 改成 <=": squareText.replace(/≤/g, "<="),
  "<= 改成 \\le（沒包 $）": squareText.replace(/<=/g, "\\le"),
  "ε 改成 \\varepsilon": squareText.replace(/ε/g, "\\varepsilon"),
  "ε 改成 $\\epsilon$": squareText.replace(/ε/g, "$\\epsilon$"),
  "δ 改成 \\delta": squareText.replace(/δ/g, "\\delta")
};
Object.entries(equivalents).forEach(([name, text]) => {
  const report = surfaceCheck(square, text);
  checks += 1;
  if (report.verdict !== "verified") fail(`變異「${name}」應該仍全綠，卻是 ${report.verdict}：${statuses(report)}\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `${l.raw} → ${l.note}`).join("\n    ")}`);
});

const yellowCases = [
  ["$ 少一個", "Let $\\varepsilon>0 be given.\n取 δ = ε/3。", 0],
  ["} 少一個", "任取 ε > 0。\n取 δ = \\frac{\\varepsilon{3}。", 1],
  ["align 環境", "任取 ε > 0。\n\\begin{align} a &= b \\end{align}\n取 δ = ε/3。", 1],
  ["讀不懂的句子", "任取 ε > 0。\n我覺得這很明顯。\n故 lim_{x→2} 3x = 6。", 1],
  ["裸關係式", "任取 ε > 0。\n3x − 6 = 3(x − 2)。\n故 lim_{x→2} 3x = 6。", 1]
];
yellowCases.forEach(([name, text, index]) => {
  const report = surfaceCheck(linear, text);
  checks += 1;
  const line = report.lines[index];
  if (!line || line.status !== "unsure") fail(`「${name}」那一句應該標黃，卻是 ${line ? line.status : "沒有這一句"}（${statuses(report)}）`);
  if (report.verdict === "verified") fail(`「${name}」不能放行`);
  if (/unexpected token|parse failed|invalid syntax/i.test(report.lines.map((l) => l.note).join(" "))) fail(`「${name}」的訊息不能是 parser 術語`);
});

// 翻符號：引擎紅的，翻譯層也要紅在同一句
const flipped = linear.reference.map((line, i) => (i === 3 ? line.replace("<", ">") : line)).join("\n");
const directFlip = lang.check(linear, flipped);
const surfaceFlip = surfaceCheck(linear, flipped);
checks += 1;
if (directFlip.verdict !== "broken" || surfaceFlip.verdict !== "broken" || surfaceFlip.lines[3].status !== "error") {
  fail(`翻符號：引擎 ${directFlip.verdict}、翻譯層 ${surfaceFlip.verdict}（${statuses(surfaceFlip)}），第 4 句應該紅`);
}

// 原文位置：每一句的 sourceRange 要真的切到原文的那一段
const mapped = surfaceCheck(linear, VARIANTS["英文散文一段"]);
checks += 1;
mapped.lines.forEach((line) => {
  const slice = VARIANTS["英文散文一段"].slice(line.sourceRange.start, line.sourceRange.end);
  if (!slice.trim() || slice.trim() !== line.raw) fail(`sourceRange 對不到原文：「${line.raw}」 vs 「${slice.trim()}」`);
});
if (!mapped.lines.some((line) => line.part)) fail("一句多動作（Choose … and suppose …）沒有標出是第幾段");

/* ── 結果 ──────────────────────────────────────────────────── */
console.log("Proof Input v2（自由書寫層）");
console.log(`  相容      ${problems.length} 題參考證明經翻譯層判定不變`);
console.log(`  寫法      ${Object.keys(VARIANTS).length + 1} 種同一證明的寫法全綠`);
console.log(`  變異      ${Object.keys(equivalents).length} 種等價寫法不變、${yellowCases.length} 種壞寫法標黃`);
console.log(`  檢查      ${checks} 次`);
if (failures.length) {
  console.error(`\n自由書寫層驗證失敗（${failures.length}）：`);
  failures.forEach((message) => console.error(`  ${message}`));
  process.exit(1);
}
console.log("proof surface OK");
