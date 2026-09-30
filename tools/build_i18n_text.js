// 英文版的內容句子表：解說、完整推導步驟、提示、機器推的提示、入門課課文。
//
//   來源（人讀、人改）：tools/content/i18n_text_en.json   { 中文樣板: 英文樣板 }
//   產物（瀏覽器載）：  src/kernel/i18n_text_en.js         { 樣板雜湊: 英文樣板 }，type="text/lazy"，只有英文介面抓
//
// 樣板＝中文句子把數學片段換成 〔0〕〔1〕…（切法在 src/kernel/i18n.js 的 textTemplate，瀏覽器跟這裡用同一份）。
// 英文樣板一樣用 〔n〕 指回那些片段，執行時原封不動填回去 —— 翻譯碰不到式子。
// 同一個句型只翻一次；題目改了數字，句型沒變的話不用重翻。
// 入門課的 LaTeX 式子（\text{…} 裡有中文的）不能切，整句翻：來源 key 寫「=整句」，驗證時比對 \text 以外的數學。
//
// 用法：
//   node tools/build_i18n_text.js                    重產 src/kernel/i18n_text_en.js（只收現在用得到的句型）
//   node tools/build_i18n_text.js --check            產物跟來源不同步就失敗（validate_i18n 也會查）
//   node tools/build_i18n_text.js --extract DIR [N]  把還沒翻的句型切成 N 份給翻譯（DIR/in_XX.jsonl）
//   node tools/build_i18n_text.js --import DIR       把 DIR/out_XX.tsv（「key<TAB>英文」一行一句）驗過之後併進來源
"use strict";

const fs = require("fs");
const path = require("path");
const spans = require("./lib/i18n_spans.js");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "tools", "content", "i18n_text_en.json");
const OUTPUT = path.join(ROOT, "src", "kernel", "i18n_text_en.js");
const CJK = /[㐀-䶿一-鿿]/;

// ── 要翻的東西 ─────────────────────────────────────────────────
// 回傳 [{ kind, where, text, whole }]：whole＝整句翻（LaTeX）
function collect() {
  const problems = require("./lib/app_api.js").allProblems();
  const win = global.window;
  const canned = win.BuzzCannedHints;
  const units = [];
  const add = (kind, where, text, whole) => {
    if (typeof text === "string" && CJK.test(text)) units.push({ kind, where, text, whole: Boolean(whole) });
  };
  problems.forEach((p) => {
    add("solution", p.id, p.solutionZh || p.solution);
    (p.solutionStepsZh || p.solutionSteps || []).forEach((step, i) => add("step", `${p.id}#${i}`, step));
    (p.hintsZh || p.hints || []).forEach((hint, i) => {
      if (canned && canned.isCanned(hint)) return; // 罐頭句會被濾掉，不翻
      add("hint", `${p.id}#${i}`, hint);
    });
  });
  const derived = (win.BuzzDerivedHints && win.BuzzDerivedHints.table) || {};
  Object.entries(derived).forEach(([id, entry]) => add("derived", id, entry && entry.text));
  (win.BUZZ_COURSE || []).forEach((lesson) => {
    const at = (suffix) => `${lesson.id}.${suffix}`;
    add("course", at("title"), String(lesson.title || "").replace(/^第 \d+ 課 · /, ""));
    add("course", at("goal"), lesson.goal);
    (lesson.concept || []).forEach((para, i) => { add("course", at(`concept${i}`), para.text); add("course", at(`concept${i}.tex`), para.tex, true); });
    if (lesson.worked) {
      add("course", at("worked.tex"), lesson.worked.tex, true);
      (lesson.worked.steps || []).forEach((step, i) => { add("course", at(`step${i}`), step.text); add("course", at(`step${i}.tex`), step.tex, true); });
    }
    (lesson.checks || []).forEach((check, ci) => {
      add("course", at(`check${ci}`), check.ask);
      (check.options || []).forEach((option, oi) => { add("course", at(`check${ci}.${oi}`), option.label); add("course", at(`check${ci}.${oi}.why`), option.why); });
    });
  });
  return units;
}

// 一個單位對應的來源 key 與（樣板的話）數學片段
function sourceKey(unit) {
  if (unit.whole) return { key: `=${unit.text}`, spans: [] };
  const { template, spans: list } = spans.textTemplate(unit.text);
  return { key: template, spans: list };
}
const runtimeKey = (key) => (key.startsWith("=") ? `=${spans.textKey(key.slice(1))}` : spans.textKey(key));

function loadSource() {
  try { return JSON.parse(fs.readFileSync(SOURCE, "utf8")); } catch (_e) { return {}; }
}
function saveSource(table) {
  const sorted = {};
  Object.keys(table).sort().forEach((k) => { sorted[k] = table[k]; });
  fs.writeFileSync(SOURCE, JSON.stringify(sorted, null, 1) + "\n");
}

// ── 單句檢查（import 與 validate 共用）──────────────────────────
const katexPath = path.join(ROOT, "assets", "vendor", "katex", "katex.min.js");
const stripText = (tex) => String(tex).replace(/\\text\{[^{}]*\}/g, "\u0000");
const mathSignature = (tex) => stripText(tex).split("\u0000").map((s) => s.replace(/\s+/g, "")).filter(Boolean).sort().join("|");
/** 回傳問題清單（空＝可以用） */
function checkEntry(zhKey, en) {
  const problems = [];
  if (typeof en !== "string" || !en.trim()) return ["英文是空的"];
  if (CJK.test(en)) problems.push("英文還有中文");
  if (zhKey.startsWith("=")) {
    const zh = zhKey.slice(1);
    if (mathSignature(zh) !== mathSignature(en)) problems.push("整句翻的 LaTeX 動到了 \\text 以外的數學");
    if (/\\text\{\s*\}/.test(en)) problems.push("有空的 \\text{}");
    try { require(katexPath).renderToString(en, { throwOnError: true, displayMode: true, strict: "ignore" }); }
    catch (error) { problems.push(`KaTeX 渲染失敗：${error.message.slice(0, 80)}`); }
    return problems;
  }
  const want = new Set([...zhKey.matchAll(/〔(\d+)〕/g)].map((m) => m[1]));
  const got = new Set([...en.matchAll(/〔(\d+)〕/g)].map((m) => m[1]));
  want.forEach((n) => { if (!got.has(n)) problems.push(`漏了 〔${n}〕`); });
  got.forEach((n) => { if (!want.has(n)) problems.push(`多了 〔${n}〕`); });
  return problems;
}

// ── 產物 ───────────────────────────────────────────────────────
function render(units, table) {
  const used = new Map(); // runtimeKey → en
  const owner = new Map(); // runtimeKey → zh key（查碰撞）
  const collisions = [];
  units.forEach((unit) => {
    const { key } = sourceKey(unit);
    if (!(key in table)) return;
    const rk = runtimeKey(key);
    if (owner.has(rk) && owner.get(rk) !== key) collisions.push(`${owner.get(rk)} ⇄ ${key}`);
    owner.set(rk, key);
    used.set(rk, table[key]);
  });
  const lines = [...used.keys()].sort().map((rk) => `    ${JSON.stringify(rk)}: ${JSON.stringify(used.get(rk))}`);
  const text = `// 自動產生 —— 不要手改。來源：tools/content/i18n_text_en.json，產生器：tools/build_i18n_text.js
//
// 英文版的內容句子（解說、推導步驟、提示、機器推的提示、入門課課文）。
// key 是中文句子「樣板」的雜湊（數學片段換成 〔n〕，切法見 src/kernel/i18n.js 的 textTemplate）；
// 值是英文樣板，執行時把原句的數學原封不動填回 〔n〕。「=」開頭的 key 是整句翻的 LaTeX。
// 這一支是 type="text/lazy"：只有英文介面才載，中文使用者一個位元組都不用抓。
(function () {
  "use strict";
  if (!window.BuzzI18n) return;
  BuzzI18n.registerText("en", {
${lines.join(",\n")}
  });
})();
`;
  return { text, collisions, count: used.size };
}

module.exports = { collect, sourceKey, runtimeKey, checkEntry, loadSource, render, mathSignature, SOURCE, OUTPUT };

if (require.main === module) {
  const args = process.argv.slice(2);
  const units = collect();
  const table = loadSource();

  if (args[0] === "--extract") {
    const dir = path.resolve(args[1] || ".");
    const parts = Math.max(1, Number(args[2] || 1));
    fs.mkdirSync(dir, { recursive: true });
    const pending = new Map(); // key → { key, kind, examples }
    units.forEach((unit) => {
      const { key } = sourceKey(unit);
      if (key in table) return;
      if (!pending.has(key)) pending.set(key, { kind: unit.kind, whole: unit.whole, key, examples: [] });
      const entry = pending.get(key);
      if (entry.examples.length < 2 && !unit.whole) entry.examples.push(unit.text);
    });
    // 課文自己一份（最後一份）：語氣跟解說不一樣，翻的人要整課看
    const list = [...pending.values()].filter((e) => e.kind !== "course");
    const course = [...pending.values()].filter((e) => e.kind === "course");
    const size = Math.ceil(list.length / parts);
    const slices = [];
    for (let i = 0; i < parts; i += 1) slices.push(list.slice(i * size, (i + 1) * size));
    if (course.length) slices.push(course);
    for (let i = 0; i < slices.length; i += 1) {
      const slice = slices[i];
      if (!slice.length) continue;
      const body = slice.map((entry, j) => JSON.stringify({
        k: `${String(i).padStart(2, "0")}-${String(j).padStart(4, "0")}`,
        kind: entry.kind,
        whole: entry.whole || undefined,
        zh: entry.whole ? entry.key.slice(1) : entry.key.replace(/\n/g, "⏎"),
        ctx: entry.examples.map((e) => e.replace(/\n/g, "⏎"))
      })).join("\n") + "\n";
      fs.writeFileSync(path.join(dir, `in_${String(i).padStart(2, "0")}.jsonl`), body);
    }
    console.log(`還沒翻的句型 ${list.length + course.length} 個（課文 ${course.length}），切成 ${slices.filter((s) => s.length).length} 份 → ${dir}`);
    process.exit(0);
  }

  if (args[0] === "--import") {
    const dir = path.resolve(args[1] || ".");
    let added = 0;
    const bad = [];
    fs.readdirSync(dir).filter((f) => /^in_\d+\.jsonl$/.test(f)).forEach((file) => {
      const outFile = path.join(dir, file.replace(/^in_/, "out_").replace(/\.jsonl$/, ".tsv"));
      if (!fs.existsSync(outFile)) { console.log(`（${path.basename(outFile)} 還沒有）`); return; }
      const inputs = new Map(fs.readFileSync(path.join(dir, file), "utf8").split("\n").filter(Boolean).map((line) => { const e = JSON.parse(line); return [e.k, e]; }));
      const seen = new Set();
      fs.readFileSync(outFile, "utf8").split(/\r?\n/).forEach((line, n) => {
        if (!line.trim()) return;
        // 一行一句：「key 空白 英文」（key 形如 03-0127；TAB 或空白都可以）
        const head = /^\s*(\d{2}-\d{4})\s+/.exec(line);
        if (!head) { bad.push(`${path.basename(outFile)}:${n + 1} 開頭不是 key`); return; }
        const tab = head[0].length - 1;
        const k = head[1];
        const input = inputs.get(k);
        if (!input) { bad.push(`${path.basename(outFile)}:${n + 1} 不認得的 key ${k}`); return; }
        seen.add(k);
        const zhKey = input.whole ? `=${input.zh}` : input.zh.replace(/⏎/g, "\n");
        const en = input.whole ? line.slice(tab + 1).trim() : line.slice(tab + 1).trim().replace(/\s*⏎\s*/g, "\n");
        const problems = checkEntry(zhKey, en);
        if (problems.length) { bad.push(`${k}：${problems.join("、")}｜${input.zh.slice(0, 50)}｜${en.slice(0, 60)}`); return; }
        if (table[zhKey] !== en) { table[zhKey] = en; added += 1; }
      });
      inputs.forEach((_v, k) => { if (!seen.has(k)) bad.push(`${path.basename(outFile)} 少了 ${k}`); });
    });
    saveSource(table);
    console.log(`併進 ${added} 句；有問題 ${bad.length} 句`);
    bad.slice(0, 80).forEach((b) => console.log("  ✗ " + b));
    if (bad.length > 80) console.log(`  … 還有 ${bad.length - 80} 句`);
    // 接著重產
  }

  const { text, collisions, count } = render(units, table);
  if (collisions.length) {
    console.error("雜湊碰撞（兩個不同的句型同一個 key）：\n  " + collisions.join("\n  "));
    process.exit(1);
  }
  if (args[0] === "--check") {
    const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
    if (current !== text) { console.error("src/kernel/i18n_text_en.js 跟來源不同步：跑 node tools/build_i18n_text.js"); process.exit(1); }
    console.log(`i18n_text_en.js 同步（${count} 句型）`);
    process.exit(0);
  }
  fs.writeFileSync(OUTPUT, text);
  const keys = new Set(units.map((u) => sourceKey(u).key));
  const covered = [...keys].filter((k) => k in table).length;
  console.log(`寫出 src/kernel/i18n_text_en.js：${count} 句型（要翻 ${keys.size}、已翻 ${covered}），${Math.round(text.length / 1024)}KB 字元`);
}
