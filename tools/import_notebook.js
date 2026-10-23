// 收交付的筆記本課（BuzzNotebook 格式：<id>.md 課文＋<id>.voice.mp3 一整支旁白）→ 網站現有的課程格式。
// 網站的版面不變（筆記本／黑板一課一塊、往下寫），只換內容：
//
//   md 的 ## 節            → sections（節裡有題目就在題目那裡切開：網站一節的結尾恰好一個動作）
//   一步（有 say 的那一步） → 一句 beat：show（螢幕閱讀器念的字）、say、board（write 一行一行寫上去）
//     沒有 say 的步           接到下一個有 say 的步（照 BuzzNotebook 的時間表，它們本來就在那一句念的時候寫）
//     box: true 的式子        → 寫上去再框起來；color → 整行的顏色；note → 小一號的一行（板上寫在這一步底下）
//   ```plot／```svg        → 黑板的 plot 動作帶 svg（plot 照 BuzzNotebook 的畫法在這裡先畫好；@set 動滑桿 → 用新的值再畫一張）
//   ```quiz                → checks（小測），那一節結尾 check
//   ```predict             → 那一節結尾 predict
//   ```order               → 那一節結尾 order（排順序；網站只有證明節有這個動作，所以那一節標 proof）
//   mp3                    → media/narration/<id>-<f8>.mp3（一課一支，網站本來就是這樣播），
//                             每一句的 [起, 訖] 毫秒照 md 的 at:（narration.json 標 external：build_narration.js 不重錄它）
//   全文模式的觀念段落也照 md 重寫；範例、常見錯誤、推薦題、技巧標籤沿用原本那一課的。
//
// 用法：node tools/import_notebook.js <交付資料夾> [id…] [--dry]
//   --dry：只轉、印統計，不寫檔
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { parseMd } = require("./lib/notebook_md.js");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "tools", "content", "course_v2");
const LESSONS = path.join(DIR, "lessons");
const OUTLINE = path.join(DIR, "OUTLINE.md");


const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const [SRC, ...ONLY] = args.filter((a) => !a.startsWith("--"));
if (!SRC) { console.log("用法：node tools/import_notebook.js <交付資料夾> [id…] [--dry]"); process.exit(1); }

/* ── BuzzNotebook 的 plot 畫法：跟網站畫的是同一支（src/course_board_nbplot.js），放進沙盒跑：算讀數（readout）── */
const sandbox = { Math, Number, String, Object, Array, JSON, Map, Error, isFinite, Function };
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_board_nbplot.js"), "utf8"), sandbox);
const NBP = sandbox.BuzzNotebookPlot;
// 手畫的 svg：顏色換成網站黑板的變數、空白收掉、座標留一位小數（檔案小一半，畫面看不出差別）
const siteSvg = (svg) => NBP.site(svg)
  .replace(/\s+/g, " ").replace(/>\s+</g, "><")
  .replace(/(\d+\.\d)\d+/g, "$1")
  .trim();
// 函數圖：出貨的是規格（網站上同一支畫），這裡只畫一次拿讀數、順便確定畫得出來
const slimSpec = (f) => { const o = { ...f }; delete o.caption; delete o.type; return o; };
function plotSvg(spec, values) { return NBP.svg({ spec, vals: values || {} }); }

/* ── 字 ── */
// BuzzNotebook 的字的標記（**粗**、==螢光==、{red:紅字}、\$）網站的板上沒有：拿掉記號、字留著
const plain = (s) => String(s || "")
  .replace(/\*\*(.+?)\*\*/g, "$1")
  .replace(/==(.+?)==/g, "$1")
  .replace(/\{(?:red|blue|green|orange|purple|pencil):(.+?)\}/g, "$1")
  .replace(/\\\$/g, "＄")
  .trim();
// 黑板把一行式子在 = < > 這些關係符號切開排（對齊用），只看大括號外面：\begin{cases}…\end{cases} 這種環境整個包進 { } 才不會被切爛
function envWrap(tex) {
  let out = "";
  let i = 0;
  const s = String(tex);
  while (i < s.length) {
    const m = /\\begin\{([a-zA-Z*]+)\}/.exec(s.slice(i));
    if (!m) { out += s.slice(i); break; }
    const at = i + m.index;
    out += s.slice(i, at);
    // 找對應的 \end（同名環境可以巢狀）
    let depth = 0;
    let j = at;
    const re = new RegExp(`\\\\(begin|end)\\{${m[1].replace("*", "\\*")}\\}`, "g");
    re.lastIndex = at;
    let e;
    while ((e = re.exec(s))) { depth += e[1] === "begin" ? 1 : -1; if (!depth) { j = e.index + e[0].length; break; } }
    if (depth) { out += s.slice(at); break; }
    out += `{${s.slice(at, j)}}`;
    i = j;
  }
  return out;
}
const guardLine = (line) => line.split(/(?<!\\)\$/).map((p, k) => (k % 2 ? envWrap(p) : p)).join("$");
// 節名：網站自己會在節前面編號，md 的 ①② 拿掉（不然變成「2. ② …」）
const secTitle = (s) => plain(s).replace(/^[①-⑳]\s*/, "");
const COLOR = { red: "red", blue: "blue", green: "green", orange: "gold", purple: "violet" };
// 句子出現在 say 的第幾個字：給黑板動作的 on（念到這裡才寫）。沒有逐字時間點，畫面照字數比例估
// after：前一個動作的錨在第幾個字（要照念的順序往後）。回傳 [on, 位置]；say 太短放不下就回 null（那個動作跟前一個一起寫）
function anchorAt(say, frac, after) {
  const s = String(say);
  let p = Math.max(after + 1, Math.min(s.length - 2, Math.max(1, Math.floor(s.length * frac))));
  while (p < s.length - 2 && /[\s，。、：；？！,.]/.test(s[p] + s[p + 1])) p += 1;
  if (p > s.length - 2) return null;
  const word = s.slice(p, p + 2);
  // 出現幾次照驗證器的數法（可以重疊：「000」裡的「00」算兩次）
  let n = 0;
  let total = 0;
  for (let i = s.indexOf(word); i >= 0; i = s.indexOf(word, i + 1)) { total += 1; if (i <= p) n += 1; }
  return [total > 1 ? `${word}#${n}` : word, p];
}

/* ── 大綱的課名 → id（〈課名〉要列進 related）── */
const TITLES = {};
fs.readFileSync(OUTLINE, "utf8").split(/\r?\n/).forEach((l) => { const m = /^- [\d.]+ \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(l); if (m) TITLES[m[2].trim()] = m[1]; });

/* ── 一課 ── */
function convert(md, file, old, durMs) {
  const L = parseMd(md);
  const sections = [];
  const checks = [];
  const concept = [];
  const timing = []; // 每一個有 at 的步（含題目）：[at 毫秒, beat 的 key 或 null]
  let figN = 0;
  const figVals = {}; // 圖 id → { spec, vals }
  const want = [];

  (L.sections || []).forEach((sec) => {
    const title = secTitle(sec.title) || plain(L.title);
    const part = { heading: plain(sec.title) || title, body: [], tex: [] };
    concept.push(part);
    let cur = null; // 正在組的網站節
    let pend = []; // 還沒有 say 的步（接到下一句）
    const open = () => { if (!cur) { cur = { title, beats: [] }; sections.push(cur); } return cur; };
    // 一步 → 黑板動作
    const acts = (st) => {
      const out = [];
      if (st.text != null) {
        const lines = String(st.text).split("\n").map(plain).filter(Boolean);
        lines.forEach((line) => { out.push({ do: "write", line: guardLine(line), ...(COLOR[st.color] ? { color: COLOR[st.color] } : {}) }); part.body.push(line); });
      } else if (st.math != null) {
        const tex0 = String(st.math).trim();
        part.tex.push(tex0);
        const tex = envWrap(tex0);
        if (st.box) { figN += 1; out.push({ do: "write", line: `\${{bx${figN}:\\displaystyle ${tex}}}$`, ...(COLOR[st.color] ? { color: COLOR[st.color] } : {}) }, { do: "box", term: `bx${figN}`, ...(COLOR[st.color] ? { color: COLOR[st.color] } : {}) }); }
        else out.push({ do: "write", line: `$\\displaystyle ${tex}$`, ...(COLOR[st.color] ? { color: COLOR[st.color] } : {}) });
      } else if (st.figure) {
        const f = st.figure;
        if (f.type === "svg") out.push({ do: "plot", svg: siteSvg(f.svg) });
        else if (f.type === "plot" || !f.type) {
          const id = f.id || `p${++figN}`;
          figVals[id] = { spec: f, vals: {} };
          const r = plotSvg(f, {});
          out.push({ do: "plot", nb: { spec: slimSpec(f) } });
          if (r.readout) out.push({ do: "write", line: plain(r.readout) });
        } else throw new Error(`${file}：網站收不了這種圖（${f.type}）`);
        if (f.caption) out.push({ do: "write", line: plain(f.caption), color: "violet" });
      } else if (st.set) {
        const fv = figVals[st.set.fig];
        if (fv) {
          Object.entries(st.set).forEach(([k, v]) => { if (k !== "fig") fv.vals[k] = Number(v); });
          const r = plotSvg(fv.spec, fv.vals);
          out.push({ do: "plot", nb: { spec: slimSpec(fv.spec), vals: { ...fv.vals } } });
          if (r.readout) out.push({ do: "write", line: plain(r.readout) });
        }
      }
      if (st.box && st.text != null && out.length) { /* 框起來的字：網站的框要套在式子的項上，字就用顏色標 */ out[out.length - 1].color = out[out.length - 1].color || "gold"; }
      if (st.note) { const n = plain(st.note); out.push({ do: "write", line: guardLine(`　${n}`), color: "violet" }); part.body.push(n); }
      return out;
    };
    const flush = (st) => {
      const all = pend.concat(st ? [st] : []);
      pend = [];
      const board = all.flatMap(acts);
      if (!st) {
        // 這一節最後幾步沒有 say：接到前一句
        // 題目後面才寫的幾步（沒有 say）：接到這一節最後一句（題目前面那一句）
        const mine = sections.filter((s) => s.title === title).pop();
        const last = (cur || mine) && (cur || mine).beats[(cur || mine).beats.length - 1];
        if (last) last.board.push(...board);
        else if (board.length) want.push({ title, board });
        return;
      }
      const say = String(st.say).replace(/\s+/g, " ").trim();
      const show = all.map((s) => (s.text != null ? plain(String(s.text).split("\n")[0]) : s.math != null ? `$${String(s.math).trim()}$` : s.figure ? plain(s.figure.caption || "圖") : "")).filter(Boolean).slice(0, 2);
      const b = { show: show.length ? show : [title], say, board };
      open().beats.push(b);
      timing.push([Math.round(Number(st.at) * 1000), b]);
    };
    (sec.steps || []).forEach((st) => {
      if (!st || st.break) return;
      const q = st.quiz || st.predict;
      if (q || st.order) {
        const s = open();
        if (s.beats.length) {
          flush(null);
          if (st.at != null) timing.push([Math.round(Number(st.at) * 1000), null]);
        } else {
          // 題目前面這一節還沒有句子：念題目那一句（「先猜猜看」）當這一節唯一的一句，前面沒 say 的步一起寫
          const say = String(st.say || "想一想。").trim();
          const board = pend.flatMap(acts);
          pend = [];
          const b = { show: [plain(q ? q.ask : st.order.ask).split("\n")[0] || title], say, board };
          s.beats.push(b);
          if (st.at != null) timing.push([Math.round(Number(st.at) * 1000), b]);
        }
        if (q) {
          const opts = q.options.map((o, k) => (k === q.answer ? { label: o.text, correct: true } : { label: o.text, why: o.why || "" }));
          if (st.quiz) { s.check = checks.length; checks.push({ ask: q.ask, options: opts }); }
          else s.predict = { ask: q.ask, options: opts };
        } else {
          s.proof = true;
          s.order = { ask: st.order.ask, steps: st.order.steps.map((label, k) => (k ? { label, why: `先要有上一步：${plain(st.order.steps[k - 1])}` } : { label })) };
        }
        cur = null;
        return;
      }
      if (st.say) flush(st);
      else pend.push(st);
    });
    flush(null);
  });
  if (want.length) throw new Error(`${file}：有一節整節沒有 say（${want.map((w) => w.title).join("、")}）`);

  // 旁白：每一句從自己的 at 念到下一個 at（題目那一步的 at 也算終點：題目的那一句「先猜猜看」不放）
  timing.sort((a, b) => a[0] - b[0]);
  const beatsT = new Map();
  timing.forEach(([t0, b], k) => { if (b) beatsT.set(b, [t0, k + 1 < timing.length ? timing[k + 1][0] : durMs]); });
  // 黑板動作的 on：每一句第一個動作不用，其他的照順序在 say 裡取一個錨
  sections.forEach((s) => s.beats.forEach((b) => {
    const n = b.board.length;
    let last = -1;
    b.board.forEach((a, k) => {
      if (!k) return;
      const got = anchorAt(b.say, k / n, last);
      // say 太短、錨排不下：照這一句時間的比例（at）
      if (got) { a.on = got[0]; last = got[1]; } else a.at = Math.min(0.95, k / n);
    });
    if (!b.board.length) delete b.board;
  }));

  const objectives = String(L.objectives || "").split(/[;；]/).map((x) => x.trim()).filter(Boolean);
  const prerequisites = String(L.prerequisites || "").split(/[,，]/).map((x) => x.trim()).filter(Boolean);
  const read = Math.max(1, Math.round(durMs / 60000));
  const lesson = {
    id: L.id,
    title: old ? old.title : plain(L.title),
    source: "notebook",
    readMinutes: read,
    totalMinutes: Math.max(read + 10, old ? old.totalMinutes || 0 : 0),
    prerequisites,
    next: old ? old.next || [] : [],
    // 課文用〈課名〉提到的課要列在 related（驗證器查）
    related: [...new Set([...(old ? old.related || [] : []), ...[...md.matchAll(/〈([^〉]+)〉/g)].map((m) => TITLES[m[1]]).filter((x) => x && x !== L.id && !prerequisites.includes(x))])],
    objectives,
    visual: null,
    concept: concept.filter((p) => p.body.length || p.tex.length).map((p) => ({ heading: p.heading, body: p.body.length ? p.body : [p.heading], ...(p.tex.length ? { tex: p.tex } : {}) })),
    workedExamples: old ? old.workedExamples || [] : [],
    pitfalls: old ? old.pitfalls || [] : [],
    checks,
    sections,
    skillTags: old ? old.skillTags || { coarse: [], fine: [] } : { coarse: [], fine: [] },
    practice: old ? old.practice || [] : [],
    gaps: old ? old.gaps || [] : []
  };
  return { lesson, md: L, beatsT };
}

/* ── 主程式 ── */
const mdFiles = [];
(function walk(d) { fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith(".md")) mdFiles.push(f); }); })(path.resolve(SRC));
const { hashOf, VOICES, RATE, readIndex, writeIndex } = require("./build_narration.js");
const narration = readIndex();
let outline = fs.readFileSync(OUTLINE, "utf8");
const inOutline = (id) => new RegExp(`^- [\\d.]+ \\| ${id} \\|`, "m").test(outline);
let done = 0;
const stats = [];
mdFiles.sort().forEach((file) => {
  const id = path.basename(file, ".md");
  if (ONLY.length && !ONLY.includes(id)) return;
  const md = fs.readFileSync(file, "utf8");
  const mp3 = file.replace(/\.md$/, ".voice.mp3");
  if (!fs.existsSync(mp3)) throw new Error(`${file}：沒有 ${path.basename(mp3)}`);
  const durMs = Math.round(Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString().trim()) * 1000);
  const jf = path.join(LESSONS, `${id}.json`);
  const old = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, "utf8")) : null;
  const { lesson, md: M, beatsT } = convert(md, file, old, durMs);
  if (M.id !== id) throw new Error(`${file}：id（${M.id}）跟檔名不一樣`);
  // 新課（after:）：大綱插在那一課後面
  if (!inOutline(id)) {
    if (!M.after || !inOutline(M.after)) throw new Error(`${id}：大綱沒有這一課，after（${M.after}）也不在大綱`);
    outline = outline.replace(new RegExp(`^(- ([\\d.]+) \\| ${M.after} \\|.*)$`, "m"), (line, l0, num) => `${line}\n- ${num}a | ${id} | ${plain(M.title).replace(/\$/g, "")} |`);
    lesson.title = plain(M.title).replace(/\$/g, "");
  }
  // 旁白：一課一支（f8 = 內容的 sha256 前 8 碼）。轉成網站原本的格式（16kHz 32kbps 單聲道，跟 build_narration.js 的一樣）：
  // 交來的是 96kbps，整批 1.5GB 部署帶不動；轉完約三分之一、跟網站自己的檔一起放（Safari 不播 Release 回的 octet-stream）。
  // 轉好的放 tmp/nb_audio/（照原檔雜湊命名，重跑不重轉）
  const src8 = crypto.createHash("sha256").update(fs.readFileSync(mp3)).digest("hex").slice(0, 8);
  const small = path.join(ROOT, "tmp", "nb_audio", `${id}-${src8}.mp3`);
  if (!fs.existsSync(small)) {
    fs.mkdirSync(path.dirname(small), { recursive: true });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp3, "-map_metadata", "-1", "-ac", "1", "-ar", "16000", "-b:a", "32k", "-f", "mp3", `${small}.part`]);
    fs.renameSync(`${small}.part`, small);
  }
  const buf = fs.readFileSync(small);
  const sha = crypto.createHash("sha256").update(buf).digest("hex");
  const f = sha.slice(0, 8);
  const beats = {};
  lesson.sections.forEach((s, si) => s.beats.forEach((b, bi) => {
    const t = beatsT.get(b);
    if (t) beats[`${si}-${bi}`] = { h: hashOf(VOICES.f, RATE, b.say), t };
  }));
  const row = { f, ms: durMs, bytes: buf.length, sha256: sha, external: true, beats };
  const nb = lesson.sections.reduce((n, s) => n + s.beats.length, 0);
  stats.push(`${id}：${lesson.sections.length} 節、${nb} 句、小測 ${lesson.checks.length}、旁白 ${(durMs / 1000).toFixed(0)} 秒`);
  if (!DRY) {
    // 舊版留著：第一次換掉之前，原本的課存一份到 lessons_v1/（旁白索引整份存成 narration_v1.json）
    const keep = path.join(DIR, "lessons_v1", `${id}.json`);
    if (old && old.source !== "notebook" && !fs.existsSync(keep)) { fs.mkdirSync(path.dirname(keep), { recursive: true }); fs.copyFileSync(jf, keep); }
    const keepN = path.join(DIR, "narration_v1.json");
    if (!fs.existsSync(keepN)) fs.copyFileSync(path.join(DIR, "narration.json"), keepN);
    fs.writeFileSync(jf, `${JSON.stringify(lesson, null, 2)}\n`);
    const dest = path.join(ROOT, "media", "narration", `${id}-${f}.mp3`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.existsSync(dest)) fs.copyFileSync(small, dest);
    const live = narration.lessons[id] && narration.lessons[id].f;
    narration.lessons[id] = { ...(narration.lessons[id] || {}), f: { ...row, ...(live && !live.external && live.f !== f ? { prev: { f: live.f, ms: live.ms, bytes: live.bytes, sha256: live.sha256, beats: live.beats } } : {}) } };
  }
  done += 1;
});
if (!DRY) {
  writeIndex(narration);
  // 課號照大綱順序重排（插了新課之後，同一個 Stage 後面的課號往後推一號；畫面上的課號本來就是照順序算的）
  let stage = null;
  let k = 0;
  outline = outline.split("\n").map((line) => {
    const s = /^## Stage (\d+)/.exec(line);
    if (s) { stage = s[1]; k = 0; return line; }
    return line.replace(/^- [\d.a-z]+ \| /, () => { k += 1; return `- ${stage}.${k} | `; });
  }).join("\n");
  fs.writeFileSync(OUTLINE, outline);
}
console.log(stats.join("\n"));
console.log(`${DRY ? "（--dry）" : ""}轉了 ${done} 課`);
fs.readFileSync(OUTLINE, "utf8").split(/\r?\n/).forEach((l) => { const m = /^- [\d.]+ \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(l); if (m) TITLES[m[2].trim()] = m[1]; });