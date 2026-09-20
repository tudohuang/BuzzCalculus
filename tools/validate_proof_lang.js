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


// 7. v2.3 全稱條件的實例化：題目說「對所有點 |f'(_)| ≤ 2」，定理產生的 c 寫出 |f'(c)| ≤ 2 就是題目條件的實例，
//    不能到了 c 身上又重新抽籤；對上之後 atom 不再自由抽（後面的鏈才驗得過）。反向：更強、方向反、函數名錯都不能誤綠。
{
  const lipschitz = problems.find((spec) => spec.id === "pl-lipschitz");
  const head = "任取 x, y ∈ I 且 x < y。\n由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。\n";
  const run = (tail) => lang.check(lipschitz, head + tail);
  const positive = run("因為 |f'(c)| ≤ 2，所以 |f(y) − f(x)| = |f'(c)||y − x| ≤ 2|y − x|。");
  checks += 1;
  const premise = positive.lines[2];
  if (positive.verdict !== "verified") fail(`v2.3：|f'(c)| ≤ 2 套用題目的全稱條件之後整份應該全綠，卻是 ${positive.verdict}：${positive.lines.map((l) => l.status).join(",")}\n    ${premise && premise.note}`);
  if (!premise || !/題目給的「abs\(f'\(_\)\) <= 2」對所有點成立，套用到 c/.test(premise.note)) fail(`v2.3：前提的備註要說是題目的全稱條件套用到 c：${premise && premise.note}`);
  if (premise && /前提：「\|f'\(c\)\| <= 2」在 \d+ 個取樣點/.test(premise.note)) fail("v2.3：全稱條件的實例不該說「在 N 個取樣點上成立」——證據是實例化，不是取樣");
  if (!premise || !premise.grounding || premise.grounding.kind !== "universal" || premise.grounding.substitution._ !== "c") fail(`v2.3：grounding 要是 universal、_ := c：${premise && JSON.stringify(premise.grounding)}`);
  if (!positive.facts.some((f) => f.provenance.kind === "universal" && f.provenance.sourceExpr === "abs(f'(_)) <= 2" && f.provenance.substitution._ === "c")) fail("v2.3：factLog 要有 kind=universal、sourceExpr、substitution 的事實");
  // 兩段寫法：−2 ≤ f'(c) ≤ 2 也是同一條全稱條件（登記時展開成兩條單邊）
  const twoSided = run("因為 −2 ≤ f'(c) ≤ 2，所以 |f(y) − f(x)| = |f'(c)||y − x| ≤ 2|y − x|。");
  checks += 1;
  if (twoSided.verdict !== "verified") fail(`v2.3：−2 ≤ f'(c) ≤ 2 也該套得上題目的全稱條件：${twoSided.verdict} ${twoSided.lines[2] && twoSided.lines[2].note}`);
  // 洞可以是式子：|f'((x+y)/2)| ≤ 2
  const midpoint = run("因為 |f'((x + y)/2)| ≤ 2，所以 |f'((x + y)/2)| ≤ 2。");
  checks += 1;
  if (!midpoint.lines[2] || midpoint.lines[2].status !== "ok" || !/套用到 \(x\+y\)\/2/.test(midpoint.lines[2].note)) fail(`v2.3：佔位符要能配 (x+y)/2：${midpoint.lines[2] && midpoint.lines[2].note}`);
  // 負向 A：更強的主張 |f'(c)| ≤ 1 不得綠
  const stronger = run("因為 |f'(c)| ≤ 1，所以 |f(y) − f(x)| ≤ |y − x|。");
  checks += 1;
  if (!stronger.lines[2] || stronger.lines[2].status === "ok" || stronger.verdict === "verified") fail(`v2.3 負向 A：|f'(c)| ≤ 1 不是題目給的，不得綠：${stronger.lines[2] && `${stronger.lines[2].status} ${stronger.lines[2].note}`}`);
  // 負向 B：方向反 |f'(c)| ≥ 2 不得對上
  const reversed = run("因為 |f'(c)| ≥ 2，所以 |f(y) − f(x)| ≥ 2|y − x|。");
  checks += 1;
  if (!reversed.lines[2] || reversed.lines[2].status === "ok" || /套用到/.test(reversed.lines[2].note)) fail(`v2.3 負向 B：方向反的不得對上全稱條件：${reversed.lines[2] && `${reversed.lines[2].status} ${reversed.lines[2].note}`}`);
  // 負向 C：函數名錯 |g'(c)| ≤ 2 不得對上
  const wrongName = run("因為 |g'(c)| ≤ 2，所以 |f(y) − f(x)| ≤ 2|y − x|。");
  checks += 1;
  if (!wrongName.lines[2] || wrongName.lines[2].status === "ok" || /套用到/.test(wrongName.lines[2].note)) fail(`v2.3 負向 C：g' 不是 f'，不得對上：${wrongName.lines[2] && `${wrongName.lines[2].status} ${wrongName.lines[2].note}`}`);
  // 同一個佔位符要配同一個式子：f(_) − g(_) ≤ 0 對 f(c) − g(d) 不算
  const twoHoles = Object.assign({}, lipschitz, { id: "pl-two-holes-test", abstract: { f: { min: -3, max: 3 }, g: { min: -3, max: 3 } }, facts: ["f(_) - g(_) <= 0"], goal: { relation: "f(c) - g(c) <= 0" } });
  const sameHole = lang.check(twoHoles, "任取 c ∈ I。\n任取 d ∈ I。\n因為 f(c) − g(c) ≤ 0，所以 f(c) − g(c) ≤ 0。");
  const diffHole = lang.check(twoHoles, "任取 c ∈ I。\n任取 d ∈ I。\n因為 f(c) − g(d) ≤ 0，所以 f(c) − g(d) ≤ 0。");
  checks += 2;
  if (!sameHole.lines[2] || !/套用到 c/.test(sameHole.lines[2].note)) fail(`v2.3：f(c) − g(c) 應該對上 f(_) − g(_)：${sameHole.lines[2] && sameHole.lines[2].note}`);
  if (diffHole.lines[2] && /套用到/.test(diffHole.lines[2].note)) fail(`v2.3：f(c) − g(d) 不該對上 f(_) − g(_)（同一個 _ 要配同一個式子）：${diffHole.lines[2].note}`);
}


// 8. v2.4 輔助函數法：自訂函數的 g′ 由數值微分驗；「對所有 x > 0，…」是只在這一句有效的條件，驗過登記成全稱事實（帶 domain）；
//    「g 遞增」要靠 g'(_) > 0；g(x) > g(0) 這種同一個函數比大小只能靠單調性（數值上對不算）。
{
  const exp = problems.find((spec) => spec.id === "pl-exp-inequality");
  const ref = exp.reference;
  const run = (lines) => lang.check(exp, lines.join("\n"));
  const good = run(ref);
  checks += 1;
  const dline = good.lines[1];
  if (!dline || dline.status !== "ok" || !dline.grounding || dline.grounding.rule !== "derivative" || !/數值微分驗過/.test(dline.note)) fail(`v2.4：g'(x) = e^x − 1 要由數值微分接地：${dline && `${dline.status} ${JSON.stringify(dline.grounding)} ${dline.note}`}`);
  if (!/登記成對所有 x 成立的事實：.*g'\(_\) > 0/.test(dline.note)) fail(`v2.4：多段鏈的頭尾 g'(_) > 0 也要登記成全稱事實：${dline.note}`);
  const mline = good.lines[2];
  if (!mline || mline.status !== "ok" || !/導數正則遞增/.test(mline.note)) fail(`v2.4：「由單調性，g 在 (0, ∞) 上遞增」要靠 g'(_) > 0 立住：${mline && `${mline.status} ${mline.note}`}`);
  const cline = good.lines[3];
  if (!cline || cline.status !== "ok" || !cline.grounding || cline.grounding.rule !== "monotone") fail(`v2.4：g(x) > g(0) 要由單調性接地：${cline && `${cline.status} ${JSON.stringify(cline.grounding)} ${cline.note}`}`);
  // 錯的導數符號：紅在那一句
  const wrongSign = run(ref.map((line, i) => (i === 1 ? "則對所有 x > 0，g'(x) = e^x − 1 > 1。" : line)));
  checks += 1;
  if (wrongSign.lines[1].status !== "error" || wrongSign.verdict !== "broken") fail(`v2.4：g'(x) > 1 在 x > 0 之下不成立，應該紅：${wrongSign.lines[1].status} ${wrongSign.lines[1].note}`);
  // 錯的導數式：紅（數值微分對得出 g′ 不是 e^x）
  const wrongDerivative = run(ref.map((line, i) => (i === 1 ? "則對所有 x > 0，g'(x) = e^x > 0。" : line)));
  checks += 1;
  if (wrongDerivative.lines[1].status !== "error") fail(`v2.4：g'(x) = e^x 是錯的導數，應該紅：${wrongDerivative.lines[1].status} ${wrongDerivative.lines[1].note}`);
  // 沒有單調性那一行：g(x) > g(0) 只剩數值真話 → 黃，訊息說要單調性
  const noMono = run(ref.filter((_, i) => i !== 2));
  checks += 1;
  const cmp = noMono.lines[2];
  if (noMono.verdict === "verified" || !cmp || cmp.status !== "unsure" || !/理由要是單調性/.test(cmp.note)) fail(`v2.4：沒有「g 遞增」時 g(x) > g(0) 應該黃並說要單調性：${noMono.verdict} ${cmp && `${cmp.status} ${cmp.note}`}`);
  // 全稱事實的 domain：g'(2) > 0 是實例（2 > 0）；g'(−1) > 0 不在 domain 裡，走數值 → 紅
  const domain = run(ref.slice(0, 2).concat(["因為 g'(2) > 0，所以 g'(2) > 0。", "因為 g'(−1) > 0，所以 g'(−1) > 0。"]));
  checks += 2;
  if (domain.lines[2].status !== "ok" || !/套用到 2/.test(domain.lines[2].note)) fail(`v2.4：g'(2) > 0 應該是全稱事實的實例：${domain.lines[2].status} ${domain.lines[2].note}`);
  if (domain.lines[3].status !== "error") fail(`v2.4：g'(−1) > 0 不在 x > 0 的 domain 裡、數值上也錯，應該紅：${domain.lines[3].status} ${domain.lines[3].note}`);
  // 條件只在這一句有效：後面沒有量化的句子不受 x > 0 影響（spec 範圍本來就是 x > 0，這裡驗「當 x > 5 時」的條件不外漏）
  const scoped = run(["令 g(x) = e^x − 1 − x。", "則當 x > 1 時，g'(x) = e^x − 1 > 1。", "則 g'(x) > 1。"]);
  checks += 1;
  if (scoped.lines[1].status !== "ok" || scoped.lines[2].status !== "error") fail(`v2.4：「當 x > 1 時」的條件不該外漏到下一句（下一句在整個範圍上驗，應該紅）：${scoped.lines.map((l) => l.status).join(",")} ${scoped.lines[1].note} / ${scoped.lines[2].note}`);
  // 遞減：導數負才立得住；方向寫反不放行
  const decreasing = run(["令 g(x) = e^x − 1 − x。", "則對所有 x > 0，g'(x) = e^x − 1 > 0。", "則 g 在 (0, ∞) 上遞減。"]);
  checks += 1;
  if (decreasing.lines[2].status === "ok") fail(`v2.4：g' > 0 不能推出 g 遞減：${decreasing.lines[2].status} ${decreasing.lines[2].note}`);
}


// 9. v2.5 積分與和：∫、Σ 的寫法改寫成 int()/sum()，tanh–sinh 數值積分（端點奇異、無窮區間都收斂），
//    令 I(p) = ∫ … 之後 I′ 是數值微分；對參數微分／基本定理／Frullani 進規則字典；基本定理要先算出 I′；不定積分算不了要說清楚。
{
  const n = (text) => lang.normalize(text);
  const cases = [
    ["∫₀¹ x^p dx", "int(x, 0, 1, x^p)"],
    ["∫_0^{inf} e^(-x) dx = 1", "int(x, 0, inf, e^(-x)) = 1"],
    ["\\int_{0}^{\\pi} \\cos x\\,dx", "int(x, 0, pi, cos x)"],
    ["Σ_{k=1}^{n} k(k+1)", "sum(k, 1, n, k(k+1))"],
    ["∫₀¹∫₀¹ x y dx dy", "int(y, 0, 1, int(x, 0, 1, x y))"]
  ];
  cases.forEach(([text, expected]) => {
    checks += 1;
    if (n(text).replace(/\s+/g, " ") !== expected) fail(`v2.5 寫法：「${text}」應該改寫成「${expected}」，卻是「${n(text)}」`);
  });
  const value = (text, env) => lang.compile(n(text), { vars: new Set(Object.keys(env || {})), functions: {} })(env || {});
  const near = (a, b, tol) => Math.abs(a - b) <= (tol || 1e-7) * (1 + Math.abs(b));
  checks += 5;
  if (!near(value("∫_0^1 ln(x) dx"), -1)) fail(`v2.5 積分：∫₀¹ ln x dx 應該是 −1，算出 ${value("∫_0^1 ln(x) dx")}`);
  if (!near(value("∫_0^1 x^(-0.5) dx"), 2)) fail(`v2.5 積分：∫₀¹ x^(−1/2) dx 應該是 2，算出 ${value("∫_0^1 x^(-0.5) dx")}`);
  if (!near(value("∫_0^inf e^(-x) dx"), 1)) fail(`v2.5 積分：∫₀^∞ e^(−x) dx 應該是 1`);
  if (!near(value("∫_{-inf}^{inf} e^(-x^2) dx"), Math.sqrt(Math.PI))) fail(`v2.5 積分：∫ e^(−x²) 應該是 √π`);
  if (value("Σ_{k=1}^{n} k^2", { n: 5 }) !== 55) fail(`v2.5 和：Σ k² 到 5 應該是 55，算出 ${value("Σ_{k=1}^{n} k^2", { n: 5 })}`);
  const feynman = problems.find((spec) => spec.id === "pl-classic-305");
  const ref = feynman.reference;
  const run = (lines) => lang.check(feynman, lines.join("\n"));
  // 錯的積分號下微分：紅
  const wrong = run(ref.map((line, i) => (i === 1 ? "由積分號下微分，I'(p) = ∫₀¹ x^(p+1) dx = 1/(p + 2)。" : line)));
  checks += 1;
  if (wrong.lines[1].status !== "error") fail(`v2.5：I'(p) = ∫ x^(p+1) dx 是錯的，應該紅：${wrong.lines[1].status} ${wrong.lines[1].note}`);
  // 基本定理前面沒算出 I′：黃並說缺什麼
  const noDerivative = run(ref.filter((_, i) => i !== 1));
  checks += 1;
  const ftcLine = noDerivative.lines[1];
  if (noDerivative.verdict === "verified" || !ftcLine || ftcLine.status !== "unsure" || !/前面還沒算出 I′/.test(ftcLine.note)) fail(`v2.5：沒有 I′ 那一行時基本定理應該黃並說前面還沒算出 I′：${noDerivative.verdict} ${ftcLine && `${ftcLine.status} ${ftcLine.note}`}`);
  // 不定積分：黃，訊息講清楚
  const indefinite = run(["令 I(p) = ∫ x^p dx。"]);
  checks += 1;
  if (indefinite.lines[0].status === "ok" || !/不定積分算不了/.test(indefinite.lines[0].note)) fail(`v2.5：不定積分應該說算不了：${indefinite.lines[0].status} ${indefinite.lines[0].note}`);
  // 和：Σ_{k=1}^{n} k = n(n+1)/2 在整數 n 上驗得過；寫錯紅
  const sumSpec = Object.assign({}, feynman, { id: "pl-sum-test", vars: { n: { min: 1, max: 30, int: true } }, goal: { relation: "Σ_{k=1}^{n} k = n(n+1)/2" } });
  const sumOk = lang.check(sumSpec, "則 Σ_{k=1}^{n} k = n(n + 1)/2。");
  const sumBad = lang.check(sumSpec, "則 Σ_{k=1}^{n} k = n(n − 1)/2。");
  checks += 2;
  if (sumOk.lines[0].status === "error") fail(`v2.5：Σ k = n(n+1)/2 不該紅：${sumOk.lines[0].note}`);
  if (sumBad.lines[0].status !== "error") fail(`v2.5：Σ k = n(n−1)/2 應該紅：${sumBad.lines[0].status} ${sumBad.lines[0].note}`);
}

// classic：機器判版本要指到 proofs.js 真的存在的題（題目頁上的「自己寫，機器判」按鈕靠這個）；一題經典證明只能有一個機器判版本
require(path.join(__dirname, "..", "src", "proofs.js"));
const classicIds = new Set((global.window.BUZZ_PROOFS || []).map((item) => item.id));
const seenClassic = new Map();
problems.forEach((spec) => {
  if (!spec.classic) return;
  checks += 1;
  if (!classicIds.has(spec.classic)) fail(`${spec.id}：classic 指到不存在的經典題 ${spec.classic}`);
  if (seenClassic.has(spec.classic)) fail(`${spec.id} 與 ${seenClassic.get(spec.classic)} 都說自己是 ${spec.classic} 的機器判版本`);
  seenClassic.set(spec.classic, spec.id);
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
