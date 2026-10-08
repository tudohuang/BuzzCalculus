// 新版課程（tools/content/course_v2/lessons/*.json）的把關。
//
// 用法：node tools/validate_course_v2.js            全部
//       node tools/validate_course_v2.js <id> …     只驗這幾課
// 錯誤（exit 1）：格式、id 不在大綱、引用不存在的課、題號不存在、粗 tag 不存在、
//   小測正解不是恰好一個或錯誤選項沒有 why、TeX 渲染不了、claim 算出來不成立、
//   課號寫死在正文、學校名稱、簡體字。
// 警告（不擋）：推薦題未驗算、claim 為 null、長度超出建議範圍。
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "tools", "content", "course_v2");
const LESSON_DIR = path.join(DIR, "lessons");

// ── 大綱 ──
const outline = {};
let stage = null;
let chapter = null;
for (const line of fs.readFileSync(path.join(DIR, "OUTLINE.md"), "utf8").split(/\r?\n/)) {
  let m;
  if ((m = /^## Stage (\d+)\s+(.*)$/.exec(line))) { stage = Number(m[1]); continue; }
  if ((m = /^### (\S+)\s+(.*)$/.exec(line))) { chapter = m[1]; continue; }
  if ((m = /^- ([\d.]+) \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(line))) {
    outline[m[2]] = { number: m[1], id: m[2], title: m[3].trim(), stage, chapter };
  }
}
// 同名的課（例如一維與二維的「臨界點」）都要認得：一個課名對到多個 id
const titleToIds = {};
Object.values(outline).forEach((o) => { (titleToIds[o.title] = titleToIds[o.title] || []).push(o.id); });

// ── 題庫與工具 ──
const load = require("./lib/app_api.js");
const api = load();
const problems = load.allProblems();
const byId = Object.fromEntries(problems.map((p) => [p.id, p]));
const bankTags = new Set(problems.flatMap((p) => p.tags || []));
const verified = global.window.BuzzVerifiedAnswers;
const isVerified = (id) => Boolean(verified && verified.has && verified.has(id));
const { checkClaim, claimsOf } = require("./lib/step_claims.js");
const katex = require(path.join(ROOT, "assets", "vendor", "katex", "katex.min.js"));

const SCHOOL = /\b(MIT|Berkeley|Princeton|Oxford|Cambridge|Harvard|Stanford|Caltech|Putnam|Todai|ETH|IMO|IMC)\b|東大|台大|臺大|清大|交大|(?<!變)成大(?!於)|普林斯頓|哈佛|劍橋|牛津/;
// 只收「簡體專用、繁體不會出現」的常見字，避免誤報
const SIMPLIFIED = /[这们个为说时对学题数积级论变导极线图点实则问应设无须将并开关发样还没让从过当经与会两对于给]/;
const HARD_NUMBER = /(?:第\s*)?\d{1,2}\.\d{1,2}\s*課|\b\d{1,2}\.\d{1,2}\s*(?:節|lesson)/;


// 取出每一個 LIM( … ) 的第一個參數
function limBodies(claim) {
  const bodies = [];
  let at = claim.indexOf("LIM(");
  while (at >= 0) {
    let depth = 0;
    let start = at + 4;
    let end = start;
    for (let k = start; k < claim.length; k += 1) {
      const ch = claim[k];
      if (ch === "(") depth += 1;
      else if (ch === ")") { if (depth === 0) { end = k; break; } depth -= 1; }
      else if (ch === "," && depth === 0) { end = k; break; }
    }
    bodies.push(claim.slice(start, end));
    at = claim.indexOf("LIM(", at + 4);
  }
  return bodies;
}

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);
const cjkLen = (s) => String(s || "").replace(/\s/g, "").length;

const wanted = process.argv.slice(2);
const files = fs.existsSync(LESSON_DIR) ? fs.readdirSync(LESSON_DIR).filter((f) => f.endsWith(".json")) : [];
const lessons = [];
for (const file of files) {
  const id = file.replace(/\.json$/, "");
  if (wanted.length && !wanted.includes(id)) continue;
  try {
    lessons.push(JSON.parse(fs.readFileSync(path.join(LESSON_DIR, file), "utf8")));
  } catch (e) {
    err(id, `JSON 壞掉：${e.message}`);
  }
}

const allText = (lesson) => {
  const parts = [lesson.title, ...(lesson.objectives || []), lesson.visual || ""];
  (lesson.concept || []).forEach((c) => parts.push(c.heading, ...(c.body || [])));
  (lesson.workedExamples || []).forEach((w) => parts.push(w.title, w.prompt, ...(w.steps || []), w.answer, w.note || ""));
  parts.push(...(lesson.pitfalls || []));
  (lesson.checks || []).forEach((c) => { parts.push(c.ask); (c.options || []).forEach((o) => parts.push(o.label, o.why || "")); });
  (lesson.practice || []).forEach((p) => parts.push(p.note || ""));
  (lesson.figures || []).forEach((f) => parts.push(f.caption || "", ...((f.graph && f.graph.labels) || []).map((l) => l.text || "")));
  return parts.filter(Boolean).join("\n");
};

// ── 圖（lesson.figures）──
// 用網站自己的編譯器（BuzzGraphRender.graphCurveFn）與 widget 的 build（BuzzCourseFigures），驗的就是畫面會畫的東西。
const Graph = global.window.BuzzGraphRender;
const Figures = global.window.BuzzCourseFigures;
const isWin = (w) => Array.isArray(w) && w.length === 4 && w.every(Number.isFinite) && w[1] > w[0] && w[3] > w[2];
const isRange = (r) => Array.isArray(r) && r.length === 2 && r.every(Number.isFinite) && r[1] > r[0];
// 取樣點落在窗內的比例（曲線大半跑出窗外 ＝ 窗開錯了，畫面上只看得到一小截）
function insideRatio(points, win) {
  const finite = points.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (!finite.length) return 0;
  return finite.filter(([x, y]) => x >= win[0] && x <= win[1] && y >= win[2] && y <= win[3]).length / points.length;
}
function curvePoints(curve, win) {
  const N = 200;
  if (Array.isArray(curve.pts)) return curve.pts;
  if (curve.param || curve.polar) {
    const spec = curve.param || curve.polar;
    const [a, b] = Array.isArray(spec.t) ? spec.t.map(Number) : [0, 2 * Math.PI];
    const fx = curve.param ? Graph.graphCurveFn(spec.x, "t") : null;
    const fy = curve.param ? Graph.graphCurveFn(spec.y, "t") : null;
    const r = curve.polar ? Graph.graphCurveFn(spec.r, "t") : null;
    if (curve.param ? !(fx && fy) : !r) return null;
    return Array.from({ length: N + 1 }, (_, i) => {
      const t = a + ((b - a) * i) / N;
      return curve.param ? [fx(t), fy(t)] : [r(t) * Math.cos(t), r(t) * Math.sin(t)];
    });
  }
  const fn = Graph.graphCurveFn(curve.expr);
  if (!fn) return null;
  const [a, b] = Array.isArray(curve.domain) ? curve.domain.map(Number) : [win[0], win[1]];
  return Array.from({ length: N + 1 }, (_, i) => { const x = a + ((b - a) * i) / N; return [x, fn(x)]; });
}
function checkGraph(id, where, graph, opts) {
  if (!isWin(graph.window)) { err(id, `${where} 的 window 要是 [xmin, xmax, ymin, ymax]`); return; }
  (graph.curves || []).forEach((curve, i) => {
    const pts = curvePoints(curve, graph.window);
    if (!pts) { err(id, `${where} 曲線 ${i + 1} 編譯不了：${JSON.stringify(curve.expr || curve.param || curve.polar)}（負號接次方要寫 -(x^2)）`); return; }
    const ratio = insideRatio(pts, graph.window);
    if (!(opts && opts.skipRatio) && !curve.dashed && ratio < 0.6) err(id, `${where} 曲線 ${i + 1}（${curve.expr || "參數曲線"}）只有 ${Math.round(ratio * 100)}% 的取樣點在窗內（要 ≥ 60%）`);
  });
  (graph.fills || []).forEach((fill, i) => {
    if (fill.pts) return;
    if (fill.polar ? !Graph.graphCurveFn(fill.polar.r, "t") : !(Graph.graphCurveFn(fill.expr) && (!fill.expr2 || Graph.graphCurveFn(fill.expr2)))) err(id, `${where} 塗色 ${i + 1} 編譯不了`);
  });
  (graph.points || []).forEach((p, i) => { if (!Number.isFinite(Number(p.x)) || !Number.isFinite(Number(p.y))) err(id, `${where} 點 ${i + 1} 座標不是數字`); });
  (graph.labels || []).forEach((l, i) => { if (typeof l.text !== "string" || !Number.isFinite(Number(l.x)) || !Number.isFinite(Number(l.y))) err(id, `${where} 標籤 ${i + 1} 要有 text、x、y`); });
}
const WIDGET_NEEDS = {
  "secant-tangent": ["f", "a", "h", "window"],
  riemann: ["f", "a", "b", "n", "window"],
  taylor: ["f", "center", "coeffs", "order", "window"],
  "epsilon-delta": ["f", "at", "limit", "range", "window"],
  family: ["f", "range", "window"],
  accumulation: ["f", "a", "range", "window"],
  zoom: ["curves", "center", "levels", "window"],
  approach: ["f", "a", "range", "window"]
};
function checkFigures(id, L) {
  const F = L.figures;
  if (F === undefined) return;
  if (!Array.isArray(F)) { err(id, "figures 要是陣列"); return; }
  if (F.length > 4) err(id, `figures 最多 4 張，現在 ${F.length}`);
  F.forEach((fig, k) => {
    const where = `圖 ${k + 1}`;
    if (typeof fig.caption !== "string" || !fig.caption.trim()) err(id, `${where} 沒有 caption`);
    else if (cjkLen(fig.caption) > 40) err(id, `${where} 的 caption ${cjkLen(fig.caption)} 字，一行寫得完才算（≤ 40）`);
    else if (cjkLen(fig.caption) > 28) warn(id, `${where} 的 caption ${cjkLen(fig.caption)} 字，手機上會折行（建議 ≤ 28）`);
    if (fig.after !== undefined && fig.after !== "examples" && !(Number.isInteger(fig.after) && fig.after >= 0 && fig.after < (L.concept || []).length)) err(id, `${where} 的 after 要是觀念段落的索引（0–${(L.concept || []).length - 1}）或 "examples"`);
    if (Boolean(fig.graph) === Boolean(fig.widget)) { err(id, `${where} 要恰好有 graph 或 widget 其中一個`); return; }
    if (fig.graph) { checkGraph(id, where, fig.graph); return; }
    const w = fig.widget;
    const type = w.type;
    if (!Figures.WIDGETS[type]) { err(id, `${where} 的 widget 種類「${type}」不存在（${Object.keys(Figures.WIDGETS).join("、")}）`); return; }
    const missing = WIDGET_NEEDS[type].filter((key) => w[key] === undefined);
    if (missing.length) { err(id, `${where}（${type}）缺 ${missing.join("、")}`); return; }
    if (!isWin(w.window)) { err(id, `${where} 的 window 要是 [xmin, xmax, ymin, ymax]`); return; }
    for (const key of ["h", "n", "order", "range"]) if (w[key] !== undefined && !isRange(w[key])) err(id, `${where} 的 ${key} 要是 [min, max] 且 min < max`);
    const compiled = type === "family" ? Graph.graphCurveFn(Figures.WIDGETS.family.expr(w, w.range[0])) : Figures.fnOf(w.f);
    if (type !== "zoom" && !compiled) { err(id, `${where} 的 f 編譯不了：${JSON.stringify(w.f)}`); return; }
    if ((type === "accumulation" || type === "family" || type === "epsilon-delta") && typeof w.f !== "string") err(id, `${where}（${type}）的 f 要是單一式子，不能分段`);
    if (type === "riemann" && !(Number.isInteger(w.n[0]) && w.n[0] >= 1 && Number.isInteger(w.n[1]) && w.n[1] <= 200 && w.a < w.b)) err(id, `${where} 的 n 要是 1–200 的整數範圍、a < b`);
    if (type === "taylor") {
      if (!(Number.isInteger(w.order[0]) && w.order[0] >= 0 && w.order[1] <= w.coeffs.length - 1)) err(id, `${where} 的 order 超出 coeffs 給的階數`);
      // 係數對數值導數（到 4 階；更高階的數值微分不準，靠作者）
      const f = Figures.fnOf(w.f);
      const c = Number(w.center);
      const h = 1e-2;
      const derivs = [f(c), (f(c + h) - f(c - h)) / (2 * h), (f(c + h) - 2 * f(c) + f(c - h)) / (h * h),
        (f(c + 2 * h) - 2 * f(c + h) + 2 * f(c - h) - f(c - 2 * h)) / (2 * h ** 3),
        (f(c + 2 * h) - 4 * f(c + h) + 6 * f(c) - 4 * f(c - h) + f(c - 2 * h)) / h ** 4];
      const fact = [1, 1, 2, 6, 24];
      w.coeffs.slice(0, 5).forEach((coef, i) => {
        const want = derivs[i] / fact[i];
        const got = Graph.graphCurveFn(String(coef))(0);
        if (!(Math.abs(got - want) <= 2e-3 * Math.max(1, Math.abs(want)))) err(id, `${where} 的 Taylor 係數 c${i} = ${coef}，數值算出來是 ${want.toFixed(5)}`);
      });
    }
    if (type === "epsilon-delta") {
      const f = Graph.graphCurveFn(w.f);
      const near = [1e-4, -1e-4].map((d) => Math.abs(f(Number(w.at) + d) - Number(w.limit)));
      if (near.some((gap) => !(gap < 1e-2))) err(id, `${where}：x → ${w.at} 時 f 不靠近 limit = ${w.limit}`);
      if (w.drive === "delta" && !(Number(w.eps) > 0)) err(id, `${where}：drive 是 delta 時要給固定的 eps`);
    }
    if (type === "zoom") {
      if (!Array.isArray(w.curves) || !w.curves.length) err(id, `${where} 的 curves 是空的`);
      if (!(w.levels > 0 && w.levels <= 7)) err(id, `${where} 的 levels（10 的幾次方）要在 (0, 7]`);
      if (!Array.isArray(w.center) || w.center.length !== 2) err(id, `${where} 的 center 要是 [x, y]`);
    }
    if (["secant-tangent", "approach"].includes(type) && !(w.a >= w.window[0] && w.a <= w.window[1])) err(id, `${where} 的 a 不在窗內`);
    // 在滑桿的兩端與預設值各建一次：建得出來、主曲線大半在窗內
    const s = Figures.sliderOf(fig);
    if (!(s.value >= s.min - 1e-9 && s.value <= s.max + 1e-9)) err(id, `${where} 的預設值 ${s.value} 不在滑桿範圍 [${s.min}, ${s.max}]`);
    [...new Set([s.min, s.value, s.max])].forEach((value) => {
      let built;
      try { built = Figures.WIDGETS[type].build(w, value); } catch (e) { err(id, `${where} 在滑桿 = ${value} 時建圖失敗：${e.message}`); return; }
      if (!built.readout || /NaN|undefined/.test(built.readout)) err(id, `${where} 在滑桿 = ${value} 時讀數壞了：${built.readout}`);
      if (built.svg) return;
      // 每一條曲線都要編譯得過（例：-x^2 在 JS 是語法錯誤，要寫 -(x^2)；畫面上那條線會安靜地消失）
      built.graphs.forEach((g) => (g.curves || []).forEach((c, i) => {
        if (!curvePoints(c, g.window)) err(id, `${where} 在滑桿 = ${value} 時曲線 ${i + 1} 編譯不了：${JSON.stringify(c.expr)}${/(^|[(+*\/,-])-[a-z0-9(]+\^/.test(c.expr || "") ? "（負號接次方要寫 -(x^2)）" : ""}`);
      }));
      const main = built.graphs[0];
      const first = (main.curves || []).find((c) => !c.dashed && c.color !== "muted");
      // 主曲線（widget 自己的 f）要在窗內；作者加的 extra 與 Taylor 多項式不算（高階本來就會甩出去）
      if (first && value === s.value) {
        const ratio = insideRatio(curvePoints(first, main.window) || [], main.window);
        if (ratio < 0.6) err(id, `${where} 的主曲線只有 ${Math.round(ratio * 100)}% 的取樣點在窗內（要 ≥ 60%）`);
      }
      if (w.extra) checkGraph(id, `${where} 的 extra`, { ...w.extra, window: main.window }, { skipRatio: true });
    });
  });
}

for (const L of lessons) {
  const id = L.id || "(沒有 id)";
  const o = outline[id];
  if (!o) { err(id, "id 不在 OUTLINE.md"); continue; }
  if (L.title !== o.title) err(id, `title「${L.title}」跟大綱「${o.title}」不同`);
  for (const key of ["readMinutes", "totalMinutes"]) if (!(Number(L[key]) > 0)) err(id, `${key} 要是正數`);
  if (L.totalMinutes < L.readMinutes) err(id, "totalMinutes 不能小於 readMinutes");
  for (const key of ["prerequisites", "next", "related"]) {
    if (!Array.isArray(L[key])) { err(id, `${key} 要是陣列`); continue; }
    L[key].forEach((ref) => { if (!outline[ref]) err(id, `${key} 引用了不存在的課 ${ref}`); });
  }
  if (!Array.isArray(L.objectives) || L.objectives.length < 2 || L.objectives.length > 4) err(id, "objectives 要 2–4 條");
  if (!(L.visual === null || (typeof L.visual === "string" && L.visual.trim()))) err(id, "visual 要是字串或 null");
  if (!Array.isArray(L.concept) || !L.concept.length) err(id, "concept 不能是空的");
  (L.concept || []).forEach((c, i) => {
    if (!c.heading || !Array.isArray(c.body) || !c.body.length) err(id, `concept[${i}] 要有 heading 與 body`);
    if (/可折疊/.test(c.heading || "")) err(id, `concept[${i}] 的 heading 不要寫「可折疊」，用 collapsible: true（顯示層自己加標記）`);
    (c.tex || []).forEach((t) => { try { katex.renderToString(t, { throwOnError: true }); } catch (e) { err(id, `concept[${i}] TeX 渲染失敗：${t}（${e.message.slice(0, 80)}）`); } });
  });
  const visibleConcept = (L.concept || []).filter((c) => !c.collapsible).map((c) => (c.body || []).join("")).join("");
  const vlen = cjkLen(visibleConcept);
  if (vlen < 350 || vlen > 950) warn(id, `預設顯示的觀念 ${vlen} 字（建議 450–800）`);

  const W = L.workedExamples || [];
  if (W.length < 2 || W.length > 4) err(id, `workedExamples 要 2–4 題，現在 ${W.length}`);
  W.forEach((w, i) => {
    if (!w.prompt || !Array.isArray(w.steps) || w.steps.length < 2 || !w.answer) err(id, `範例 ${i + 1} 要有 prompt、至少 2 步、answer`);
    if (w.problemId && !byId[w.problemId]) err(id, `範例 ${i + 1} 的 problemId ${w.problemId} 不在題庫`);
    if (w.claim) {
      for (const claim of claimsOf(w.claim)) {
        // LIM 只有一個自由變數時對那個變數取極限；同時出現 x 和 n、t、h、k 時會對 x 取極限、把另一個當參數，安靜地算錯
        const mixed = limBodies(claim).some((body) => {
          const stripped = body.replace(/\b(sinh|cosh|tanh|sqrt|exp|ln|log|sin|cos|tan|atan|asin|acos|abs|pi|inf|LIM|INT|SUM|SUB|D2|D)\b/g, "");
          return /(^|[^A-Za-z])x([^A-Za-z]|$)/.test(stripped) && /(^|[^A-Za-z])[nthk]([^A-Za-z]|$)/.test(stripped);
        });
        if (mixed) {
          err(id, `範例 ${i + 1} 的 claim 在 LIM 裡用了 x 以外的變數（LIM 只對 x 取極限）：${claim}`);
          continue;
        }
        const r = checkClaim(claim, { normalize: api.normalizeExpression, answer: null });
        if (!r.ok) err(id, `範例 ${i + 1} 的 claim 不成立或算不出來：${claim} —— ${r.reason}`);
      }
    } else {
      if (!w.claimNote) err(id, `範例 ${i + 1} 沒有 claim，也沒有 claimNote 說明為什麼驗不了`);
      else warn(id, `範例 ${i + 1} 無機器驗算（${w.claimNote.slice(0, 40)}）`);
    }
  });
  if (!Array.isArray(L.pitfalls) || L.pitfalls.length < 2) err(id, "pitfalls 至少 2 條");
  const C = L.checks || [];
  if (C.length < 3 || C.length > 5) err(id, `checks 要 3–5 題（建議 4），現在 ${C.length}`);
  C.forEach((c, i) => {
    const opts = c.options || [];
    if (opts.length < 3) err(id, `小測 Q${i + 1} 至少 3 個選項`);
    const correct = opts.filter((x) => x.correct === true).length;
    if (correct !== 1) err(id, `小測 Q${i + 1} 正解要恰好一個，現在 ${correct}`);
    opts.filter((x) => !x.correct).forEach((x) => { if (!x.why) err(id, `小測 Q${i + 1} 的錯誤選項「${x.label}」沒有 why`); });
    const labels = opts.map((x) => x.label);
    if (new Set(labels).size !== labels.length) err(id, `小測 Q${i + 1} 有重複選項`);
  });
  const tags = L.skillTags || {};
  (tags.coarse || []).forEach((t) => { if (!bankTags.has(t)) err(id, `粗 tag「${t}」題庫裡沒有（新標籤請放 fine）`); });
  if (!Array.isArray(tags.fine) || !tags.fine.length) err(id, "skillTags.fine 至少一個");
  (tags.fine || []).forEach((t) => { if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(t)) err(id, `細標籤「${t}」要是 kebab-case`); });
  const P = L.practice || [];
  P.forEach((p) => {
    const prob = byId[p.id];
    if (!prob) { err(id, `推薦題 ${p.id} 不在題庫`); return; }
    if (!isVerified(p.id) && !["proof", "text", "sketch", "graph"].includes(prob.answerKind)) warn(id, `推薦題 ${p.id} 未通過獨立驗算`);
    if (p.trains && !(tags.fine || []).includes(p.trains)) err(id, `推薦題 ${p.id} 的 trains「${p.trains}」不在本課的細標籤裡`);
  });
  if (P.length && !P.some((p) => p.core)) err(id, "推薦題至少要有一題 core");
  if (!P.length && !(L.gaps || []).length) err(id, "沒有推薦題就要在 gaps 寫清楚缺什麼");
  (L.gaps || []).forEach((g, i) => { if (!g.tag || !(g.count > 0)) err(id, `gaps[${i}] 要有 tag 與 count`); });

  checkFigures(id, L);

  const text = allText(L);
  // 正文裡的行內數學寫成 $…$（KaTeX）：$ 要成對、每一段都要渲染得過
  if (((text.match(/(?<!\\)\$/g) || []).length) % 2) err(id, "正文的 $ 不成對（行內數學要寫成 $…$）");
  for (const m of text.matchAll(/(?<!\\)\$([^$]+?)(?<!\\)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true }); } catch (e) { err(id, `行內數學 KaTeX 渲染失敗：$${m[1]}$（${e.message.slice(0, 60)}）`); }
  }
  if (SCHOOL.test(text)) err(id, `出現學校名稱或 Putnam：${text.match(SCHOOL)[0]}`);
  const simp = text.match(SIMPLIFIED);
  if (simp) err(id, `出現簡體字「${simp[0]}」`);
  const hard = text.match(HARD_NUMBER);
  if (hard) err(id, `正文寫死了課號「${hard[0]}」，改寫〈課名〉並放進 related`);
  for (const m of text.matchAll(/〈([^〉]+)〉/g)) {
    const refs = titleToIds[m[1]];
    const listed = [...(L.prerequisites || []), ...(L.next || []), ...(L.related || []), id];
    if (!refs) err(id, `〈${m[1]}〉不是大綱裡的課名`);
    else if (!refs.some((ref) => listed.includes(ref))) err(id, `提到〈${m[1]}〉但 ${refs.join(" 或 ")} 不在 prerequisites／next／related`);
  }
  const total = cjkLen(text);
  if (total < 1500 || total > 3600) warn(id, `整課 ${total} 字（建議 2,000–2,800）`);
}

const all = Object.keys(outline).length;
const written = files.length;
console.log(`新版課程：大綱 ${all} 課，已寫 ${written} 課${wanted.length ? `（這次驗 ${lessons.length} 課）` : ""}`);
if (warnings.length) {
  console.log(`\n警告 ${warnings.length}：`);
  warnings.slice(0, 80).forEach((w) => console.log("  " + w));
  if (warnings.length > 80) console.log(`  …另有 ${warnings.length - 80} 條`);
}
if (errors.length) {
  console.error(`\n錯誤 ${errors.length}：`);
  errors.forEach((e) => console.error("  " + e));
  process.exit(1);
}
console.log("\ncourse v2 OK");
