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

/* ── 4. v2.1：目標宣告、一句多動作、結論接地、連鎖抑制 ───────── */
const CANONICAL_ACCEPTANCE = [
  "We want to show that",
  "",
  "$$",
  "(\\forall \\varepsilon>0)(\\exists \\delta>0)",
  "(0<|x-2|<\\delta \\Rightarrow |3x-6|<\\varepsilon).",
  "$$",
  "",
  "Let $\\varepsilon>0$ be given.",
  "",
  "We choose $\\delta=\\frac{\\varepsilon}{3}>0$ and suppose",
  "$0<|x-2|<\\delta$.",
  "",
  "Then",
  "",
  "$$",
  "|3x-6|",
  "=3|x-2|",
  "<3\\delta",
  "=3\\cdot\\frac{\\varepsilon}{3}",
  "=\\varepsilon.",
  "$$",
  "",
  "By the $\\varepsilon$-$\\delta$ definition of limit, we have",
  "",
  "$$",
  "\\lim_{x\\to2}3x=6.",
  "$$"
].join("\n");
{
  const report = surfaceCheck(linear, CANONICAL_ACCEPTANCE);
  checks += 1;
  const kinds = report.lines.map((l) => l.kind).join(",");
  if (report.verdict !== "verified") fail(`v2.1 驗收證明應該全綠，卻是 ${report.verdict}：${statuses(report)}\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `${l.raw.slice(0, 50)} → ${l.note}`).join("\n    ")}`);
  if (!/^goal,let,let,claim,assume,claim,claim$/.test(kinds)) fail(`v2.1 驗收證明的動作序列不對：${kinds}（要 goal → 引入 → 取 → δ > 0 → 假設 → 推導 → 結論）`);
  if (!report.lines[0] || report.lines[0].status !== "ok") fail(`目標宣告（∀ε∃δ 形式）沒有對上題目的極限：${report.lines[0] && report.lines[0].note}`);
}
// 目標寫成 lim 形式、寫成中文，也要對上；寫錯目標要紅（v2.2：目標是明確的命題，寫錯不是「驗不了」）
[["We want to show that lim_{x->2} 3x = 6.", "ok"], ["我們要證明 lim_{x→2} 3x = 6。", "ok"], ["要證：$\\lim_{x\\to 2}3x=6$", "ok"], ["We want to show that lim_{x->2} 3x = 7.", "error"]].forEach(([text, expected]) => {
  const report = surfaceCheck(linear, `${text}\n${linear.reference.join("\n")}`);
  checks += 1;
  if (!report.lines[0] || report.lines[0].kind !== "goal" || report.lines[0].status !== expected) fail(`目標宣告「${text}」應該是 goal/${expected}，卻是 ${report.lines[0] && `${report.lines[0].kind}/${report.lines[0].status}`}`);
  if (expected === "ok" && report.verdict !== "verified") fail(`加了目標宣告「${text}」之後整份應該仍全綠，卻是 ${report.verdict}`);
});
// 負向：δ = ε 本身不紅、假設能登記、紅在真正不成立的推導
{
  const negative = "We want to show that lim_{x->2} 3x = 6.\n\nLet eps > 0 be given.\n\nChoose delta = eps and suppose\n0 < |x-2| < delta.\n\nThen\n|3x-6| < eps.";
  const report = surfaceCheck(linear, negative);
  checks += 1;
  const st = report.lines.map((l) => `${l.kind}:${l.status}`).join(",");
  const defineLine = report.lines.find((l) => l.kind === "let" && /delta/.test(l.canonical));
  const assumeLine = report.lines.find((l) => l.kind === "assume");
  const deriveLine = report.lines[report.lines.length - 1];
  if (!defineLine || defineLine.status !== "ok") fail(`負向測試：δ = ε 的定義本身不該紅（${st}）`);
  if (!assumeLine || assumeLine.status !== "ok") fail(`負向測試：假設應該登記成功（${st}）`);
  if (!deriveLine || deriveLine.status !== "error" || !/不成立/.test(deriveLine.note)) fail(`負向測試：紅要在最後那句推導（${st}）`);
  if (report.verdict !== "broken") fail(`負向測試：整份應該 broken，卻是 ${report.verdict}`);
}
// 一句多動作與條件連接詞：Suppose x > 0 and y > 0 是一個假設、Choose … and suppose … 是兩個動作
{
  const one = surface.translate("Suppose x > 0 and y > 0.", lang, linear).nodes;
  checks += 1;
  if (one.length !== 1 || one[0].type !== "assume") fail(`「Suppose x > 0 and y > 0」應該是一個假設，卻拆成 ${one.map((n) => n.type).join(",")}`);
  const two = surface.translate("We choose δ = ε/3 > 0 and suppose 0 < |x-2| < δ.", lang, linear).nodes;
  checks += 1;
  if (two.map((n) => n.type).join(",") !== "define,derive,assume") fail(`「We choose δ = ε/3 > 0 and suppose …」應該拆成 define,derive,assume，卻是 ${two.map((n) => n.type).join(",")}`);
}
// 括號沒關：黃、訊息講括號；連鎖抑制：後面因為 δ 沒宣告而倒的那句也是黃，並指回定義那句
{
  const broken = "Let eps > 0 be given.\nChoose $\\delta=\\frac{\\varepsilon}{3$\nSuppose 0 < |x-2| < delta.\nThen |3x-6| = 3|x-2| < 3 delta = eps.";
  const report = surfaceCheck(linear, broken);
  checks += 1;
  const st = statuses(report);
  if (report.lines[1].status !== "unsure" || !/括號/.test(report.lines[1].note)) fail(`括號沒關的那句應該黃並講括號：${report.lines[1].status}「${report.lines[1].note}」`);
  if (/unexpected token|syntaxerror|parse failed/i.test(report.lines.map((l) => l.note).join(" "))) fail("括號沒關的訊息不能是 parser 術語");
  if (report.lines.some((l) => l.status === "error")) fail(`括號沒關之後，後面因為 δ 沒宣告而倒的句子應該黃（連鎖），卻有紅：${st}`);
  const dependent = report.lines.slice(2).find((l) => /前面「/.test(l.note));
  if (!dependent) fail(`連鎖的句子沒有指回定義那一句：${report.lines.slice(2).map((l) => l.note).join(" | ")}`);
  if (report.verdict === "verified") fail("括號沒關不能放行");
}

/* ── 結果 ──────────────────────────────────────────────────── */

/* ── 5. v2.2：Goal Semantics + Transformation Grounding ────────────
   「是真的」和「是由前面推出來的」是兩件事。這一節釘住：
   目標宣告（∀ε∃δ 形式）與題目的 lim 形式是同一個語意目標；寫錯目標是紅；
   |x−a|<r ⇒ a−r<x<a+r 這種改寫有來源（provenance），更寬的區間算「由條件推出」；
   數值成立但沒來源仍然黃；結論句對上語意目標＋骨架齊。 */
const V22_CANONICAL = [
  "We want to show that",
  "",
  "$",
  "(\\forall \\varepsilon>0)(\\exists \\delta>0)",
  "(0<|x-3|<\\delta \\Rightarrow |x^2-9|<\\varepsilon).",
  "$",
  "",
  "Let $\\varepsilon>0$ be given.",
  "",
  "Choose",
  "",
  "$",
  "\\delta=\\min\\left(1,\\frac{\\varepsilon}{7}\\right).",
  "$",
  "",
  "Suppose $0<|x-3|<\\delta$.",
  "",
  "Since $\\delta\\le1$, we have",
  "",
  "$",
  "|x-3|<1.",
  "$",
  "",
  "so",
  "",
  "$",
  "2<x<4.",
  "$",
  "",
  "Hence",
  "",
  "$",
  "|x+3|<7.",
  "$",
  "",
  "Therefore,",
  "",
  "$",
  "|x^2-9|",
  "=",
  "|x-3||x+3|",
  "<",
  "7|x-3|",
  "<",
  "7\\delta",
  "\\le\\varepsilon.",
  "$",
  "",
  "Thus, by the $\\varepsilon$-$\\delta$ definition of limit,",
  "",
  "$",
  "\\lim_{x\\to3}x^2=9.",
  "$"
].join("\n");
{
  const report = surfaceCheck(square, V22_CANONICAL);
  checks += 1;
  if (report.verdict !== "verified") fail(`v2.2 驗收證明應該全綠，卻是 ${report.verdict}：${statuses(report)}\n    ${report.lines.filter((l) => l.status !== "ok").map((l) => `${l.raw.slice(0, 40)} → ${l.note}`).join("\n    ")}`);
  const types = surface.translate(V22_CANONICAL, lang, square).nodes.map((n) => n.type).join(",");
  if (types !== "goal,introduce,define,assume,derive,derive,derive,derive,conclude") fail(`v2.2 驗收證明的 IR 不對：${types}`);
  const goal = report.lines[0];
  if (!goal || goal.kind !== "goal" || goal.status !== "ok" || !/已辨識證明目標/.test(goal.note) || !/ε–δ 極限目標/.test(goal.note)) fail(`v2.2 目標宣告應該辨識成 ε–δ 極限目標：${goal && goal.note}`);
  const interval = report.lines.find((l) => /2<x<4/.test(l.canonical));
  if (!interval || !interval.grounding || interval.grounding.rule !== "abs_interval" || !/可得 2 < x < 4/.test(interval.note)) fail(`2<x<4 應該由 |x−3|<1 經 abs_interval 接地：${interval && JSON.stringify([interval.grounding, interval.note])}`);
  const transitive = report.lines.find((l) => /因為 delta<=1/.test(l.canonical));
  if (!transitive || !transitive.grounding || transitive.grounding.rule !== "transitive") fail(`|x−3|<1 應該由 |x−3|<δ 與 δ≤1 傳遞而來：${transitive && JSON.stringify([transitive.grounding, transitive.note])}`);
  const conclusion = report.lines[report.lines.length - 1];
  if (!conclusion || conclusion.kind !== "claim" || !/結論與原證明目標一致/.test(conclusion.note) || !/骨架完整/.test(conclusion.note) || conclusion.rule !== "epsilon_delta_definition") fail(`結論句應該說「結論與原證明目標一致」且規則是 ε–δ 定義：${conclusion && JSON.stringify([conclusion.rule, conclusion.note])}`);
  if (!Array.isArray(report.facts) || !report.facts.some((f) => f.provenance && f.provenance.rule === "abs_interval")) fail("報告要帶 facts（含 provenance），而且 2<x<4 的兩段要記成 abs_interval 推出");
  if (!report.semanticGoal || report.semanticGoal.kind !== "limit" || report.semanticGoal.point !== "3") fail(`報告要帶題目的語意目標：${JSON.stringify(report.semanticGoal)}`);
}
// 語意目標：lim 形式與 ∀ε∃δ 形式等價；點或值不同就不等價
{
  const a = surface.parseSemanticGoal(lang, "lim_{x->3} x^2 = 9");
  const b = surface.parseSemanticGoal(lang, "forall eps > 0 exists delta > 0 (0 < |x-3| < delta => |x^2-9| < eps)");
  const c = surface.parseSemanticGoal(lang, "lim_{x->3} x^2 = 8");
  const d = surface.parseSemanticGoal(lang, "lim_{x->2} x^2 = 9");
  checks += 4;
  if (!a || a.kind !== "limit" || a.functionExpr !== "x^2" || a.value !== "9" || a.proofForm.kind !== "epsilon_delta") fail(`parseSemanticGoal(lim) 不對：${JSON.stringify(a)}`);
  if (!b || !b.quantified || !surface.goalEquivalent(lang, a, b)) fail(`lim 形式與 ∀ε∃δ 形式應該等價：${JSON.stringify(b)}`);
  if (surface.goalEquivalent(lang, a, c)) fail("lim x^2 = 9 與 lim x^2 = 8 不該等價");
  if (surface.goalEquivalent(lang, a, d)) fail("x→3 與 x→2 不該等價");
  if (!surface.goalEquivalent(lang, surface.specSemanticGoal(lang, square), b)) fail("題目的語意目標應該跟使用者寫的 ∀ε∃δ 形式等價");
}
// 目標寫錯：紅，訊息列出題目與你寫的；整份 broken
{
  const wrong = surfaceCheck(square, `We want to show that lim_{x->3} x^2 = 8.\n\n${squareText}`);
  checks += 1;
  const goal = wrong.lines[0];
  if (!goal || goal.status !== "error" || !/你宣告的證明目標與題目不同/.test(goal.note) || !/題目：lim_\(x→3\) x\^2 = 9/.test(goal.note) || !/你寫：lim_\(x→3\) x\^2 = 8/.test(goal.note)) fail(`目標寫錯應該紅並列出兩者：${goal && `${goal.status} ${goal.note}`}`);
  if (wrong.verdict !== "broken") fail(`目標寫錯整份應該 broken，卻是 ${wrong.verdict}`);
  // 沒寫目標句照樣能完成
  const noGoal = surfaceCheck(square, V22_CANONICAL.split("\n").slice(7).join("\n"));
  checks += 1;
  if (noGoal.verdict !== "verified") fail(`沒有目標宣告也該全綠，卻是 ${noGoal.verdict}：${statuses(noGoal)}`);
}
// 改寫規則的變異：更寬的區間綠但註明「由目前條件推出」；錯的區間紅；憑空的數值真話仍黃
{
  const swap = (from, to) => V22_CANONICAL.replace(from, to);
  const wider = surfaceCheck(square, swap("2<x<4.", "1<x<5."));
  checks += 1;
  const widerLine = wider.lines.find((l) => /1<x<5/.test(l.canonical));
  if (!widerLine || widerLine.status !== "ok" || !/由目前條件推出，不是等價改寫/.test(widerLine.note)) fail(`1<x<5 應該綠但註明由條件推出：${widerLine && `${widerLine.status} ${widerLine.note}`}`);
  const falseInterval = surfaceCheck(square, swap("2<x<4.", "3<x<4."));
  checks += 1;
  const falseLine = falseInterval.lines.find((l) => /3<x<4/.test(l.canonical));
  if (!falseLine || falseLine.status !== "error" || !/不成立/.test(falseLine.note)) fail(`3<x<4 應該紅並給反例：${falseLine && `${falseLine.status} ${falseLine.note}`}`);
  if (falseInterval.verdict !== "broken") fail(`3<x<4 整份應該 broken，卻是 ${falseInterval.verdict}`);
  // 憑空一句數值上對的話（跟前文沒關係）：黃，訊息說找不到來源
  const orphan = surfaceCheck(square, `Let eps > 0 be given.\nChoose delta = min(1, eps/7).\nSuppose 0 < |x-3| < delta.\nThen x^2 + 1 > 2x.`);
  checks += 1;
  const orphanLine = orphan.lines[orphan.lines.length - 1];
  if (!orphanLine || orphanLine.status !== "unsure" || !/找不到它是由哪一步推出的/.test(orphanLine.note)) fail(`憑空的數值真話應該黃並說找不到來源：${orphanLine && `${orphanLine.status} ${orphanLine.note}`}`);
}
// 引擎的改寫規則表要跟速查表一致
{
  checks += 1;
  const listed = (lang.cheatsheet.transformations || []).map((t) => t.id).sort().join(",");
  const engine = (lang.transformations || []).map((t) => t.id).sort().join(",");
  if (!listed || listed !== engine) fail(`速查表的改寫規則（${listed}）跟引擎（${engine}）不一致`);
}

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
