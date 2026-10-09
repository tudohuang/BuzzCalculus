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
// 長度算的是「畫面上看到的字」：$…$ 裡的 LaTeX 原始碼（\frac{…}{…}、\sqrt、上下標記號）不算，只算剩下的符號
const cjkLen = (s) => String(s || "")
  .replace(/(?<!\\)\$([^$]+?)(?<!\\)\$/g, (_m, body) => body.replace(/\\[a-zA-Z]+/g, "x").replace(/[{}^_\\]/g, ""))
  .replace(/\s/g, "").length;

// --require-sections：每一課都要有 sections（全部的課分節完才在 CI 打開；現在只是可以手動跑）
const requireSections = process.argv.includes("--require-sections");
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--"));
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
  if (lesson.video) parts.push(lesson.video.caption || "");
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
// ── 影片（lesson.video）──
// 短名要在 media/manifest.json 的 videos 裡（部署時 tools/fetch_media.js 照那份清單抓檔），after 跟 figures 同義。
const MEDIA_MANIFEST = path.join(ROOT, "media", "manifest.json");
const mediaVideos = fs.existsSync(MEDIA_MANIFEST) ? new Set(JSON.parse(fs.readFileSync(MEDIA_MANIFEST, "utf8")).videos || []) : new Set();
function checkVideo(id, L) {
  const v = L.video;
  if (v === undefined) return;
  if (!v || typeof v !== "object" || Array.isArray(v)) { err(id, "video 要是一個物件（每課最多一支）"); return; }
  if (!mediaVideos.has(v.id)) err(id, `video 的 id「${v.id}」不在 media/manifest.json 的 videos（${[...mediaVideos].join("、")}）`);
  if (v.after !== undefined && v.after !== "examples" && !(Number.isInteger(v.after) && v.after >= 0 && v.after < (L.concept || []).length)) err(id, `video 的 after 要是觀念段落的索引（0–${(L.concept || []).length - 1}）或 "examples"`);
  if (!(typeof v.duration === "number" && v.duration > 0)) err(id, "video 的 duration 要是正的秒數");
  if (typeof v.caption !== "string" || !v.caption.trim()) err(id, "video 沒有 caption");
  else if (cjkLen(v.caption) > 40) err(id, `video 的 caption ${cjkLen(v.caption)} 字，一行寫得完才算（≤ 40）`);
  else if (/\$/.test(v.caption)) err(id, "video 的 caption 是純文字，不寫 $…$");
  const extra = Object.keys(v).filter((k) => !["id", "after", "duration", "caption"].includes(k));
  if (extra.length) err(id, `video 多了不認得的欄位：${extra.join("、")}`);
}

// ── 分節（lesson.sections，可選）──
// 一節 = 幾句（beat：畫面上的短字＋一句白話，可以把圖的滑桿帶到某一格）＋結尾一個動作（小測／先猜／拖圖）。
// 內容跟課文同一份：小測每一題恰好落在一節（分節讀完＝小測做完，「完成」才拿得到）；
// 節裡寫的每一個數字都要在課文、圖的參數或這一節的滑桿值裡出現過（分節是換切法，不是新內容）。
// TeX 的單一數字簡寫：\frac12、\tfrac12、\dfrac12 是 1/2（不是 12）；\frac1x 的分子是 1。先拆開再拿掉其他指令。
const numbersIn = (s) => (String(s || "")
  .replace(/\\[dt]?frac\s*(\d)\s*(\d)/g, " $1 $2 ")
  .replace(/\\[dt]?frac\s*(\d)/g, " $1 ")
  .replace(/\\[a-zA-Z]+/g, " ").match(/\d+(?:\.\d+)?/g) || []).map(Number);

// ── 旁白（beat.say）：念出來的話，念法寫成中文，所以數字也要從中文數字讀回來才比得了 ──
// 「三分之十四」→ 3、14；「二點零一」→ 2.01；「十六」→ 16；「八萬八千二百」→ 88200；「負二」→ 2（正負號跟 numbersIn 一樣不看）。
// 「百分之五」→ 5 或 0.05（課文裡有哪一個都算）。
// 不是數字的詞先拿掉（「萬一」「一下子」「三角形」「一定」…），免得被讀成數字：
//   「十分」看上下文：「十分接近」「十分重要」（很）才拿掉；「十分之…」是分母十、「一百八十分之…」「三十分」前面接著數字，都是數字。
//   「一點」後面不是數字（「一點也不」「近一點」）才拿掉；「一點五」是 1.5。
//   「第一」「一個」「一路」照舊讀成 1（是不是真的數字分不出來，寧可多擋）。
const CN_DIGIT = { 零: 0, 〇: 0, 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const CN_UNIT = { 十: 10, 百: 100, 千: 1000 };
const CN_BIG = { 萬: 1e4, 億: 1e8 };
const CN_NUM = "零〇一二兩三四五六七八九十百千萬億";
function cnInt(s) {
  if (!s) return 0;
  let total = 0;
  let section = 0;
  let digit = 0;
  for (const c of s) {
    if (c in CN_DIGIT) digit = CN_DIGIT[c];
    else if (c in CN_UNIT) { section += (digit || 1) * CN_UNIT[c]; digit = 0; }
    else { total += (section + digit || 1) * CN_BIG[c]; section = 0; digit = 0; }
  }
  return total + section + digit;
}
// 一串中文數字（可以帶「點」）→ 讀出來的數
function cnRead(token) {
  const [whole, frac] = token.split("點");
  // 沒有十百千萬億的一串（「負三一路」的「三一」）是相鄰的兩個字，不是 31：一個字一個數；小數只看最後一個字
  const digits = /[十百千萬億]/.test(whole) ? [cnInt(whole)] : [...whole].map((c) => CN_DIGIT[c]);
  if (frac) digits.push(Number(`${digits.pop()}.${[...frac].map((c) => CN_DIGIT[c]).join("")}`));
  return digits;
}
// → 每一個念到的數一格：[數]，或「百分之 N」的 [N, N/100]（課文裡有其中一個就算）
const spokenItems = (s) => {
  const items = [];
  const text = String(s || "")
    .replace(new RegExp(`百分之([${CN_NUM}]+(?:點[零〇一二三四五六七八九]+)?)`, "g"), (_m, n) => { cnRead(n).forEach((v) => items.push([v, Number((v / 100).toPrecision(12))])); return " "; })
    .replace(new RegExp(`(^|[^${CN_NUM}])十分(?!之)`, "g"), "$1 ")
    .replace(/一點(?![零〇一二三四五六七八九])/g, " ")
    .replace(/萬一|一下子|千萬|一模一樣|三角(?:形|函數)?|一些|一樣|一直|一定|統一|唯一|一起|一般|一致|一旦|一切/g, " ");
  numbersIn(text).forEach((n) => items.push([n]));
  for (const m of text.matchAll(new RegExp(`[${CN_NUM}]+(?:點[零〇一二三四五六七八九]+)?`, "g"))) cnRead(m[0]).forEach((v) => items.push([v]));
  return items;
};
// 自測：讀數規則改壞了（例如又把「十分」整個刪掉）就在這裡紅，不等某一課的稿碰到。[數] 或 [數, 另一種讀法]
[
  ["一百八十分之 pi", [[180]]],
  ["十分之零點零五", [[10], [0.05]]],
  ["三分之十四", [[3], [14]]],
  ["十分接近", []],
  ["這裡十分重要", []],
  ["三十分", [[30]]],
  ["二點零一", [[2.01]]],
  ["一點五倍", [[1.5]]],
  ["一點也不難，再近一點", []],
  ["負三一路往上", [[3], [1]]],
  ["八萬八千二百", [[88200]]],
  ["三億零五萬", [[300050000]]],
  ["一萬", [[10000]]],
  ["百分之一", [[1, 0.01]]],
  ["誤差百分之零點五", [[0.5, 0.005]]],
  ["三角形面積", []],
  ["三角函數的週期", []],
  ["用三角代換", []],
  ["一定會收斂，一樣的道理", []],
  ["唯一的解", []],
  ["第一步", [[1]]],
  ["三個三角形", [[3]]]
].forEach(([said, want]) => {
  const key = (list) => list.map((alts) => alts.join("|")).sort().join(", ");
  const got = key(spokenItems(said));
  if (got !== key(want)) errors.push(`自測：「${said}」讀成 [${got}]，應該是 [${key(want)}]`);
});
[
  ["$\\tfrac12$", [1, 2]],
  ["$\\dfrac12 + \\frac{3}{4}$", [1, 2, 3, 4]],
  ["$\\frac1x$", [1]],
  ["$x^{12}$", [12]],
  ["$\\sqrt2$", [2]]
].forEach(([text, want]) => {
  const got = numbersIn(text).sort((a, b) => a - b).join();
  if (got !== want.slice().sort((a, b) => a - b).join()) errors.push(`自測：${text} 讀成 [${got}]，應該是 [${want.join(", ")}]`);
});
// 念的稿：不准有 LaTeX 與會被念錯的符號（分數、次方、不等號、括號…都寫成中文：三分之十四、x 平方、大於等於）
const SAY_BAD = /[$\\^_{}\/=<>≤≥≠→←∞×÷·√∫∑ΔδεπθΣ+*|()（）\[\]［］]/;
const SAY_MAX = 56; // 字數上限：約 12 秒（實測台灣中文神經語音一秒四字多，含停頓）
const SAY_MAX_MS = 12500;
const NARRATION_INDEX = path.join(DIR, "narration.json");
const { hashOf: narrationHash, VOICE: NARRATION_VOICE, RATE: NARRATION_RATE, readIndex: readNarration } = require("./build_narration.js");
// 一課一支（narration.json 的 lessons.<課>.beats.<節-句> = { h, t: [起, 訖] }）
const narration = fs.existsSync(NARRATION_INDEX) ? readNarration() : null;
const clipOf = (id, key) => {
  const got = narration && narration.lessons[id] && narration.lessons[id].beats[key];
  return got ? { h: got.h, ms: got.t[1] - got.t[0] } : null;
};
let sayMissing = 0;
function checkSections(id, L) {
  const S = L.sections;
  if (S === undefined) return "";
  if (!Array.isArray(S)) { err(id, "sections 要是陣列"); return ""; }
  if (S.length < 4 || S.length > 6) err(id, `sections 要 4–6 節，現在 ${S.length}`);
  const figs = L.figures || [];
  const widget = (k) => Number.isInteger(k) && figs[k] && figs[k].widget ? figs[k] : null;
  const inRange = (fig, v) => { const s = Figures.sliderOf(fig); return Number.isFinite(v) && v >= s.min - 1e-9 && v <= s.max + 1e-9; };
  const known = new Set(numbersIn(allText(L)));
  figs.forEach((f) => numbersIn(JSON.stringify(f.widget || {})).forEach((n) => known.add(n)));
  const usedChecks = [];
  const parts = [];
  S.forEach((sec, si) => {
    const where = `第 ${si + 1} 節`;
    const extra = Object.keys(sec || {}).filter((k) => !["title", "beats", "check", "predict", "drag", "video"].includes(k));
    if (extra.length) err(id, `${where} 多了不認得的欄位：${extra.join("、")}`);
    if (typeof sec.title !== "string" || !sec.title.trim()) err(id, `${where} 沒有 title`);
    else if (cjkLen(sec.title) > 12) err(id, `${where} 的 title ${cjkLen(sec.title)} 字（≤ 12）`);
    const beats = Array.isArray(sec.beats) ? sec.beats : [];
    if (beats.length < 2 || beats.length > 6) err(id, `${where} 要 2–6 句（beats），現在 ${beats.length}`);
    const local = new Set(known);
    let shown = cjkLen(sec.title);
    const texts = [sec.title];
    const spoken = [];
    beats.forEach((b, bi) => {
      const at = `${where}第 ${bi + 1} 句`;
      const bad = Object.keys(b || {}).filter((k) => !["show", "note", "fig", "say"].includes(k));
      if (bad.length) err(id, `${at} 多了不認得的欄位：${bad.join("、")}`);
      if (!Array.isArray(b.show) || !b.show.length || b.show.length > 2) err(id, `${at} 的 show 要 1–2 行`);
      (b.show || []).forEach((line) => {
        if (typeof line !== "string" || !line.trim()) err(id, `${at} 的 show 有空行`);
        else if (cjkLen(line) > 30) err(id, `${at} 的 show「${line}」${cjkLen(line)} 字（一行 ≤ 30）`);
        shown += cjkLen(line);
        texts.push(line);
      });
      if (b.note !== undefined) {
        if (typeof b.note !== "string" || !b.note.trim()) err(id, `${at} 的 note 是空的`);
        else if (cjkLen(b.note) > 40) err(id, `${at} 的 note ${cjkLen(b.note)} 字（一句 ≤ 40）`);
        shown += cjkLen(b.note);
        texts.push(b.note);
      }
      if (b.fig !== undefined) {
        const fig = b.fig && widget(b.fig.use);
        if (!fig) err(id, `${at} 的 fig.use 要指到一張 widget 圖（figures 的索引）`);
        else if (!inRange(fig, b.fig.to)) err(id, `${at} 的 fig.to = ${b.fig.to} 不在滑桿範圍`);
        else local.add(Number(b.fig.to));
        const odd = Object.keys(b.fig || {}).filter((k) => !["use", "to"].includes(k));
        if (odd.length) err(id, `${at} 的 fig 多了：${odd.join("、")}`);
      }
      if (b.say !== undefined) {
        const say = typeof b.say === "string" ? b.say.trim() : "";
        if (!say) err(id, `${at} 的 say 是空的`);
        else {
          const sym = say.match(SAY_BAD);
          if (sym) err(id, `${at} 的 say 有「${sym[0]}」：念的稿不寫 LaTeX 與符號（分數、次方、不等號寫成中文）`);
          if (cjkLen(say) > SAY_MAX) err(id, `${at} 的 say ${cjkLen(say)} 字（≤ ${SAY_MAX}，約 12 秒）`);
          if (say === (b.note || "").trim() || b.show.some((line) => line.replace(/\$/g, "") === say)) err(id, `${at} 的 say 照念畫面上的字：要講解畫面，不是重念`);
          spoken.push(say);
          const clip = clipOf(id, `${si}-${bi}`);
          if (!clip || clip.h !== narrationHash(NARRATION_VOICE, NARRATION_RATE, say)) sayMissing += 1;
          else if (clip.ms > SAY_MAX_MS) warn(id, `${at} 的旁白 ${(clip.ms / 1000).toFixed(1)} 秒（建議 ≤ 12）`);
        }
      }
    });
    const acts = ["check", "predict", "drag"].filter((k) => sec[k] !== undefined);
    if (acts.length !== 1) err(id, `${where} 結尾要恰好一個動作（check／predict／drag），現在 ${acts.length ? acts.join("、") : "沒有"}`);
    if (sec.check !== undefined) {
      if (!(Number.isInteger(sec.check) && L.checks && L.checks[sec.check])) err(id, `${where} 的 check 要是小測的索引（0–${(L.checks || []).length - 1}）`);
      else usedChecks.push(sec.check);
    }
    if (sec.predict !== undefined) {
      const p = sec.predict || {};
      const opts = Array.isArray(p.options) ? p.options : [];
      if (typeof p.ask !== "string" || !p.ask.trim()) err(id, `${where} 的 predict 沒有 ask`);
      if (opts.length !== 3) err(id, `${where} 的 predict 要 3 個選項`);
      if (opts.filter((o) => o.correct === true).length !== 1) err(id, `${where} 的 predict 正解要恰好一個`);
      opts.filter((o) => !o.correct).forEach((o) => { if (!o.why) err(id, `${where} 的 predict 選項「${o.label}」沒有 why`); });
      texts.push(p.ask || "", ...opts.flatMap((o) => [o.label, o.why || ""]));
    }
    if (sec.drag !== undefined) {
      const d = sec.drag || {};
      const fig = widget(d.use);
      if (!fig) err(id, `${where} 的 drag.use 要指到一張 widget 圖`);
      else if (!(isRange(d.range) && inRange(fig, d.range[0]) && inRange(fig, d.range[1]))) err(id, `${where} 的 drag.range 要是滑桿範圍裡的 [lo, hi]`);
      else {
        // 進到動作時圖停在最後一句帶到的那一格（沒有就是預設值）；已經在目標裡就不算一個動作
        const last = beats.filter((b) => b.fig && b.fig.use === d.use).pop();
        const start = last ? Number(last.fig.to) : Figures.sliderOf(fig).value;
        if (start >= d.range[0] && start <= d.range[1]) err(id, `${where} 的 drag 一開始（${start}）就在目標範圍裡`);
        d.range.forEach((n) => local.add(Number(n)));
      }
      if (typeof d.ask !== "string" || !d.ask.trim()) err(id, `${where} 的 drag 沒有 ask`);
      texts.push(d.ask || "");
    }
    if (sec.video !== undefined && !(sec.video === true && L.video)) err(id, `${where} 的 video 只能寫 true，而且這一課要有 video`);
    if (shown > 220) err(id, `${where} 畫面上的字 ${shown} 字（一節 ≤ 220；建議 ≤ 150）`);
    else if (shown > 150) warn(id, `${where} 畫面上的字 ${shown} 字（建議 ≤ 150）`);
    const fresh = [...new Set(texts.flatMap(numbersIn))].filter((n) => !local.has(n));
    if (fresh.length) err(id, `${where} 出現課文裡沒有的數字：${fresh.join("、")}（分節不寫新內容）`);
    const said = [...new Set(spoken.flatMap(spokenItems).filter((alts) => !alts.some((n) => local.has(n))).map((alts) => alts[0]))];
    if (said.length) err(id, `${where} 的旁白念了課文裡沒有的數字：${said.join("、")}（中文數字也算）`);
    parts.push(...texts);
  });
  // 旁白要嘛整課都有、要嘛都沒有：「播放」一路念下去，不會念到一半沒聲音
  const allBeats = S.flatMap((sec) => (sec && Array.isArray(sec.beats) ? sec.beats : []));
  const withSay = allBeats.filter((b) => b && b.say !== undefined).length;
  if (withSay && withSay !== allBeats.length) err(id, `say 要每一句都有（現在 ${withSay} / ${allBeats.length} 句）`);
  const want = (L.checks || []).map((_c, i) => i);
  const missing = want.filter((i) => !usedChecks.includes(i));
  const twice = usedChecks.filter((c, i) => usedChecks.indexOf(c) !== i);
  if (missing.length || twice.length) err(id, `小測每一題要恰好落在一節（分節讀完＝小測做完）：${missing.length ? `沒放 Q${missing.map((i) => i + 1).join("、Q")}` : ""}${twice.length ? ` 重複 Q${twice.map((i) => i + 1).join("、Q")}` : ""}`);
  return parts.join("\n");
}

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
  checkVideo(id, L);
  // 分節的字一樣要過 KaTeX、學校名稱、簡體字、〈課名〉；但不算進整課長度（同一份內容換切法）
  const sectionText = checkSections(id, L);

  const text = allText(L) + (sectionText ? `\n${sectionText}` : "");
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
  const total = cjkLen(allText(L));
  if (total < 1500 || total > 3600) warn(id, `整課 ${total} 字（建議 2,000–2,800）`);
}

const all = Object.keys(outline).length;
const written = files.length;
console.log(`新版課程：大綱 ${all} 課，已寫 ${written} 課${wanted.length ? `（這次驗 ${lessons.length} 課）` : ""}`);
// ── 整套課的分節與旁白覆蓋率（每次都印；--require-sections 時沒分節的課算錯）──
{
  const rows = {};
  let secN = 0;
  let sayN = 0;
  let voicedN = 0;
  let beatN = 0;
  lessons.forEach((L) => {
    const st = outline[L.id] ? outline[L.id].stage : "?";
    const row = (rows[st] = rows[st] || { all: 0, sec: 0, say: 0, voiced: 0 });
    row.all += 1;
    if (!Array.isArray(L.sections) || !L.sections.length) {
      if (requireSections) err(L.id, "還沒有 sections（--require-sections）");
      return;
    }
    const beats = [];
    L.sections.forEach((sec, si) => (sec.beats || []).forEach((b, bi) => beats.push({ b, key: `${si}-${bi}` })));
    row.sec += 1;
    secN += 1;
    beatN += beats.length;
    const said = beats.filter(({ b }) => typeof b.say === "string" && b.say.trim());
    if (said.length && said.length === beats.length) { row.say += 1; sayN += 1; }
    if (said.length && said.every(({ b, key }) => { const c = clipOf(L.id, key); return c && c.h === narrationHash(NARRATION_VOICE, NARRATION_RATE, b.say.trim()); })) { row.voiced += 1; voicedN += 1; }
  });
  const pct = (n) => (lessons.length ? `${Math.round((n / lessons.length) * 100)}%` : "—");
  console.log(`分節覆蓋：${secN} / ${lessons.length} 課有 sections（${pct(secN)}，${beatN} 句）、${sayN} 課每句都有 say（${pct(sayN)}）、${voicedN} 課錄好旁白（${pct(voicedN)}）`);
  console.log(`  每個 Stage（分節／say／錄好 ／ 課數）：${Object.keys(rows).sort((a, b) => Number(a) - Number(b)).map((st) => `S${st} ${rows[st].sec}/${rows[st].say}/${rows[st].voiced}／${rows[st].all}`).join("  ")}`);
}
// 字改了、旁白還沒重錄：不擋（播放時那一句沒有聲音，分節照常點），但要看得到
if (sayMissing) warnings.push(`旁白：${sayMissing} 句的 say 沒有對得上的錄音（node tools/build_narration.js）`);
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
