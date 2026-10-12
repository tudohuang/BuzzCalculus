// 分節的「自己算」（sections[].solve）的把關：validate_course_v2.js 的 checkSections 每遇到一個 solve 就叫這一支。
//
// 專案規則：答案錯一題的信任損失大過其他一切，所以每一個自己算的答案都要機器驗過，而且驗法跟解法無關：
//   - 不是題庫題：要有 claim（tools/lib/step_claims.js 的語法），用 ANS 指這一題的答案，例如 "D((x^3+1)^2) == ANS"、
//     "LIM((x^3-8)/(x-2), 2) == ANS"、"D(ANS) == x^2*sqrt(1+x^3)"（不定積分：微分回去）。驗證器實際算。
//   - 題庫題（problemId）：題目要通過獨立驗算（tools/verify_answers.js），而且寫在這裡的 answer 要被那一題本身的判分器判對；
//     有 claim 也照算。
//   - 代一題小測（check）：那一題小測的正解（LaTeX）跟 answer 要在取樣點上相等（不定積分差一個常數）。
//   - answer 本身要被網站的判分器（app.js checkAnswer，跟畫面同一支）判成對 —— 寫錯格式、判分器讀不懂的答案在這裡就紅；
//     wrong[] 每一個預料中的錯答案都不能被判成對（不然學生打對了反而看到「你是不是漏了負號」）。
// 另外：欄位、字數（ask ≤ 80、hint ≤ 40、步驟 1–5 句各 ≤ 60、wrong 的 why ≤ 60）。KaTeX、數字規則、簡體字由 checkSections 一起驗（texts）。
"use strict";

const { checkClaim, claimsOf } = require("./step_claims.js");
const latex = require("./latex.js");

const KINDS = ["numeric", "expression", "antiderivative"];
const KEYS = ["ask", "kind", "answer", "variable", "problemId", "check", "claim", "hint", "steps", "wrong"];
const SAMPLES = [0.3137, 0.7219, 1.1743, 1.6181, 2.2913];

// 一題小測的選項（$…$ 的 LaTeX，可能帶 +C）→ 取樣點上的值；讀不懂回 null
function optionFn(label, variable) {
  const tex = String(label || "").replace(/\$/g, "").replace(/\+\s*C\s*$/, "").trim();
  try { return latex.compile(tex, [variable]); } catch (_e) { return null; }
}

// 回傳 { check: 用到的小測索引或 -1, numbers: 這一題額外認得的數字（題庫題的題幹、答案、解說） }
function checkSolve(ctx) {
  const { v, L, where, err, api, byId, isVerified, numbersIn } = ctx;
  const out = { check: -1, numbers: [], texts: [] };
  if (!v || typeof v !== "object" || Array.isArray(v)) { err(`${where} 的 solve 要是一個物件`); return out; }
  const extra = Object.keys(v).filter((k) => !KEYS.includes(k));
  if (extra.length) err(`${where} 的 solve 多了不認得的欄位：${extra.join("、")}`);
  const p = v.problemId ? byId[v.problemId] : null;
  if (v.problemId && !p) { err(`${where} 的 solve.problemId ${v.problemId} 不在題庫`); return out; }
  const kind = p ? p.answerKind : v.kind;
  if (!KINDS.includes(kind)) { err(`${where} 的 solve 題型要是 ${KINDS.join("／")}（題庫題看那一題的 answerKind），現在是 ${kind}`); return out; }
  if (p && v.kind && v.kind !== p.answerKind) err(`${where} 的 solve.kind（${v.kind}）跟題庫題 ${p.id} 的 answerKind（${p.answerKind}）不同`);
  if (p && !isVerified(p.id)) err(`${where} 的 solve.problemId ${p.id} 沒有通過獨立驗算（node tools/verify_answers.js --id ${p.id}）`);
  const answer = String(v.answer || (p ? p.answer : "")).trim();
  if (!answer) { err(`${where} 的 solve 沒有 answer`); return out; }
  const variable = v.variable || (p && (p.variable || (Array.isArray(p.variables) ? p.variables[0] : p.variables))) || "x";
  const P = p || { id: "", answerKind: kind, answer, variable, prompt: "", topic: "" };
  const judge = (input, against) => { try { return api.checkAnswer(against || P, input); } catch (e) { return { correct: false, message: e.message }; } };
  // 判分器要讀得懂答案（題庫題：寫在這裡的 answer 要被那一題判對）
  const self = judge(answer);
  if (!self.correct) err(`${where} 的 solve.answer「${answer}」被判分器判錯（${self.message}）—— 格式寫錯，或跟題庫題 ${p ? p.id : ""} 的答案不一樣`);
  // claim：不是題庫題就一定要有；有就照算
  const claims = claimsOf(v.claim || "");
  if (!p && !claims.length) err(`${where} 的 solve 不是題庫題，要有 claim（用 ANS 指這一題的答案，例如 D((x^3+1)^2) == ANS）`);
  if (claims.length && !claims.some((c) => /\bANS\b/.test(c))) err(`${where} 的 solve.claim 要用 ANS 驗到答案本身`);
  claims.forEach((c) => {
    const r = checkClaim(c, { normalize: api.normalizeExpression, answer, variable: variable !== "x" ? variable : undefined });
    if (!r.ok) err(`${where} 的 solve.claim 不成立或算不出來：${c} —— ${r.reason}`);
  });
  // 代一題小測：那一題的正解跟 answer 要一樣（換成打字，不能換掉答案）
  if (v.check !== undefined) {
    const ck = Number.isInteger(v.check) ? (L.checks || [])[v.check] : null;
    if (!ck) err(`${where} 的 solve.check 要是小測的索引（0–${(L.checks || []).length - 1}）`);
    else {
      out.check = v.check;
      const right = (ck.options || []).find((o) => o.correct);
      const f = right && optionFn(right.label, variable);
      if (!f) err(`${where} 的 solve.check：讀不懂小測 Q${v.check + 1} 正解的 LaTeX「${right ? right.label : ""}」，比不了`);
      else {
        const diffs = SAMPLES.map((x) => {
          const want = f(x);
          const got = api.evaluateExpression(answer, { [variable]: x });
          return Number.isFinite(want) && Number.isFinite(got) ? got - want : null;
        }).filter((d) => d !== null);
        const base = kind === "antiderivative" && diffs.length ? diffs[0] : 0;
        if (diffs.length < 2 || diffs.some((d) => Math.abs(d - base) > 1e-6 * Math.max(1, Math.abs(base)))) err(`${where} 的 solve.answer「${answer}」跟小測 Q${v.check + 1} 的正解「${right.label}」不一樣`);
      }
    }
  }
  // 預料中的錯答案：讀得懂、不能被判對、要有 why
  if (v.wrong !== undefined && !Array.isArray(v.wrong)) err(`${where} 的 solve.wrong 要是陣列`);
  (Array.isArray(v.wrong) ? v.wrong : []).forEach((w, i) => {
    const at = `${where} 的 solve.wrong[${i}]`;
    if (!w || typeof w.answer !== "string" || !w.answer.trim()) { err(`${at} 沒有 answer`); return; }
    if (typeof w.why !== "string" || !w.why.trim()) err(`${at} 沒有 why（打成這樣時要說的那一句）`);
    else if (ctx.cjkLen(w.why) > 60) err(`${at} 的 why ${ctx.cjkLen(w.why)} 字（≤ 60）`);
    if (judge(w.answer).correct) err(`${at}「${w.answer}」會被判成對 —— 它不是錯答案`);
    // 畫面上拿它當「答案」去比學生打的字：判分器要讀得懂它（取樣點上算得出數）
    const finite = SAMPLES.filter((x) => Number.isFinite(api.evaluateExpression(w.answer.replace(/\+\s*C\s*$/, ""), kind === "numeric" ? {} : { [variable]: x }))).length;
    if (finite < 2) err(`${at}「${w.answer}」判分器讀不懂`);
    out.texts.push(w.why || "");
  });
  // 字：問句、提示、解法
  if (v.ask !== undefined && (typeof v.ask !== "string" || !v.ask.trim())) err(`${where} 的 solve.ask 是空的`);
  if (v.ask === undefined && v.check === undefined) err(`${where} 的 solve 要有 ask（代小測的可以省略，用小測的題目）`);
  if (typeof v.ask === "string" && ctx.cjkLen(v.ask) > 80) err(`${where} 的 solve.ask ${ctx.cjkLen(v.ask)} 字（≤ 80）`);
  if (v.hint !== undefined && (typeof v.hint !== "string" || !v.hint.trim() || ctx.cjkLen(v.hint) > 40)) err(`${where} 的 solve.hint 要是一行（≤ 40 字）`);
  if (v.steps !== undefined) {
    if (!Array.isArray(v.steps) || v.steps.length < 1 || v.steps.length > 5) err(`${where} 的 solve.steps 要 1–5 句`);
    else v.steps.forEach((s, i) => { if (typeof s !== "string" || !s.trim() || ctx.cjkLen(s) > 60) err(`${where} 的 solve.steps[${i}] 要是一句（≤ 60 字）`); });
  }
  out.texts.push(v.ask || "", v.hint || "", ...(Array.isArray(v.steps) ? v.steps : []));
  if (p) out.numbers = numbersIn([p.prompt, p.answer, p.solution || "", ...(p.solutionSteps || []).map((s) => (Array.isArray(s) ? s[0] : s))].join(" "));
  return out;
}

// 自測（反向案例）：每一條規則都要真的會紅；改壞了在這裡就看得到，不等某一課的稿碰到
function selfTest(env) {
  const base = { checks: [{ ask: "q", options: [{ label: "$6x^2(x^3 + 1)$", correct: true }, { label: "$2(x^3+1)$", why: "w" }, { label: "$0$", why: "w" }] }] };
  const good = { ask: "求 $(x^3+1)^2$ 的導數", kind: "expression", answer: "6x^2(x^3+1)", claim: "D((x^3+1)^2) == ANS", wrong: [{ answer: "2(x^3+1)", why: "只做了外層。" }], steps: ["外層 $2u$", "乘裡層 $3x^2$"], hint: "外層微完乘裡層。" };
  const cases = [
    ["好的那一題", good, null],
    ["代小測：答案跟正解一樣", { ...good, ask: undefined, check: 0 }, null],
    ["claim 算出來不是答案", { ...good, claim: "D((x^3+1)^2) == ANS + 1" }, /claim 不成立/],
    ["不是題庫題卻沒有 claim", { ...good, claim: undefined }, /要有 claim/],
    ["claim 沒有用到 ANS", { ...good, claim: "D(x^2) == 2x" }, /用 ANS/],
    ["判分器讀不懂答案", { ...good, answer: "6x^^2(", claim: undefined }, /判錯|要有 claim/],
    ["錯答案其實是對的", { ...good, wrong: [{ answer: "6x^5+6x^2", why: "?" }] }, /會被判成對/],
    ["代小測卻換了答案", { ...good, ask: undefined, check: 0, answer: "3x^2(x^3+1)", claim: "D((x^3+1)^2)/2 == ANS" }, /跟小測 Q1 的正解/],
    ["題型不收", { ...good, kind: "text" }, /題型要是/],
    ["多了欄位", { ...good, options: [] }, /不認得的欄位/],
    ["題庫題不存在", { ask: "x", problemId: "no-such-problem" }, /不在題庫/],
    ["題庫題答案寫錯", { ask: "x", problemId: env.sampleId, answer: "123456" }, /判錯/]
  ];
  const errors = [];
  cases.forEach(([name, v, want]) => {
    const got = [];
    checkSolve({ ...env, v, L: base, where: "自測", err: (m) => got.push(m) });
    if (want ? !got.some((m) => want.test(m)) : got.length) errors.push(`自測（自己算）「${name}」：${want ? `應該擋（${want}）卻是 ${JSON.stringify(got)}` : `不該擋卻擋了 ${JSON.stringify(got)}`}`);
  });
  return errors;
}

module.exports = { checkSolve, selfTest, KINDS };
