// 語言層的 CI：三件事都要對，少一件英文介面就會露出中文或印出壞掉的句子。
//
//   1. 原始碼裡含中文的字串一定要包 t("…")。用一個小 tokenizer 走過 UI 檔
//      （字串、模板、regex、註解都認得），模板字串裡的裸中文一樣抓。
//      合法的例外只有三種：比對（=== "中文"）、物件 key（{ "中文": … }）、
//      前面寫了 /* zh-key */ 的字串 —— 這三種是拿中文當 key，不是給人看的字。
//   2. 每個 t("…") 的 key 都要在 src/kernel/i18n_en.js 裡；字典裡不能有原始碼已經沒有的殭屍 key；
//      佔位符 {name} 兩邊要一致；英文值不能含中文。
//   3. 題庫：題幹含中文的每一題都要有英文題幹（src/kernel/i18n_problems_en.js），
//      而且英文題幹去掉 \text{…} 之後的數學要跟中文版一模一樣（翻譯不准動式子），
//      KaTeX 要渲染得過。tableCaption / 干擾選項 / 表格欄位含中文的也要一起翻。
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const UI_FILES = [
  "src/app.js",
  "src/share_cards.js",
  "src/proof_lab_ui.js",
  "src/custom_problems.js",
  "src/kernel/tag_labels.js",
  "src/kernel/skill_graph.js",
  "src/kernel/planner.js",
  "src/kernel/session.js",
  "src/kernel/ability.js",
  "src/kernel/i18n.js"
];
const DICT_FILE = "src/kernel/i18n_en.js";
const PROBLEMS_FILE = "src/kernel/i18n_problems_en.js";
const CJK = /[一-鿿]/;
// 這幾個 key 的英文故意是空字串（中文的量詞英文沒有）
const EMPTY_OK = new Set(["個", " 倍", "句", "行"]);

const failures = [];
const fail = (message) => failures.push(message);

// ── 1. tokenizer ───────────────────────────────────────────────
// 回傳 [{ kind: "string" | "template", text, start, end, line }]
// string：'…' 或 "…"（text 是已解碼的值）；template：模板字串裡 ${} 以外的一段原文。
function scan(source) {
  const tokens = [];
  const n = source.length;
  let i = 0;
  let line = 1;
  // 模式堆疊：{ mode: "code", depth } 或 { mode: "template" }
  const stack = [{ mode: "code", depth: 0 }];
  let lastSignificant = ""; // 上一個有意義的字元（判 regex 用）
  let lastWord = "";

  const cook = (raw) => raw.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (m, e) => {
    if (e[0] === "u" && e[1] === "{") return String.fromCodePoint(parseInt(e.slice(2, -1), 16));
    if (e[0] === "u") return String.fromCharCode(parseInt(e.slice(1), 16));
    if (e[0] === "x") return String.fromCharCode(parseInt(e.slice(1), 16));
    const map = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", v: "\v", "0": "\0" };
    return e in map ? map[e] : e;
  });

  const regexMayStart = () => {
    if (!lastSignificant) return true;
    if (/[(,=:[!&|?{};+\-*%<>~^]/.test(lastSignificant)) return true;
    if (lastSignificant === ")" || lastSignificant === "]") return false;
    if (/[\w$]/.test(lastSignificant)) return /^(return|typeof|case|in|of|do|else|void|delete|throw|new|instanceof|yield|await)$/.test(lastWord);
    return false;
  };

  while (i < n) {
    const top = stack[stack.length - 1];
    const ch = source[i];
    if (top.mode === "template") {
      const start = i;
      const startLine = line;
      let raw = "";
      while (i < n) {
        const c = source[i];
        if (c === "\\") { raw += c + (source[i + 1] || ""); if (source[i + 1] === "\n") line += 1; i += 2; continue; }
        if (c === "`") break;
        if (c === "$" && source[i + 1] === "{") break;
        if (c === "\n") line += 1;
        raw += c; i += 1;
      }
      if (raw) tokens.push({ kind: "template", text: cook(raw), start, end: i, line: startLine });
      if (source[i] === "`") { stack.pop(); i += 1; lastSignificant = "`"; continue; }
      if (source[i] === "$") { stack.push({ mode: "code", depth: 0 }); i += 2; lastSignificant = "{"; continue; }
      break; // EOF inside template
    }
    // code mode
    if (ch === "\n") { line += 1; i += 1; continue; }
    if (ch === " " || ch === "\t" || ch === "\r") { i += 1; continue; }
    if (ch === "/" && source[i + 1] === "/") { while (i < n && source[i] !== "\n") i += 1; continue; }
    if (ch === "/" && source[i + 1] === "*") {
      const close = source.indexOf("*/", i + 2);
      const end = close < 0 ? n : close + 2;
      line += (source.slice(i, end).match(/\n/g) || []).length;
      i = end; continue;
    }
    if (ch === "'" || ch === "\"") {
      const quote = ch;
      const start = i;
      let raw = "";
      i += 1;
      while (i < n && source[i] !== quote) {
        if (source[i] === "\\") { raw += source[i] + (source[i + 1] || ""); i += 2; continue; }
        if (source[i] === "\n") break;
        raw += source[i]; i += 1;
      }
      i += 1;
      tokens.push({ kind: "string", text: cook(raw), start, end: i, line });
      lastSignificant = quote; lastWord = "";
      continue;
    }
    if (ch === "`") { stack.push({ mode: "template" }); i += 1; lastSignificant = "`"; continue; }
    if (ch === "/" && regexMayStart()) {
      // regex literal：跳過到結尾的 /
      i += 1;
      let inClass = false;
      while (i < n) {
        const c = source[i];
        if (c === "\\") { i += 2; continue; }
        if (c === "\n") break;
        if (inClass) { if (c === "]") inClass = false; i += 1; continue; }
        if (c === "[") { inClass = true; i += 1; continue; }
        if (c === "/") { i += 1; break; }
        i += 1;
      }
      while (i < n && /[a-z]/.test(source[i])) i += 1;
      lastSignificant = ")"; lastWord = "";
      continue;
    }
    if (ch === "{") { top.depth += 1; lastSignificant = "{"; lastWord = ""; i += 1; continue; }
    if (ch === "}") {
      if (top.depth === 0 && stack.length > 1) { stack.pop(); i += 1; lastSignificant = "}"; continue; }
      top.depth -= 1; lastSignificant = "}"; lastWord = ""; i += 1; continue;
    }
    if (/[\w$]/.test(ch)) {
      let j = i;
      while (j < n && /[\w$]/.test(source[j])) j += 1;
      lastWord = source.slice(i, j);
      lastSignificant = source[j - 1];
      i = j; continue;
    }
    lastSignificant = ch; lastWord = "";
    i += 1;
  }
  return tokens;
}

// 字串前面（略過空白）是不是 t(
function wrappedByT(source, start) {
  let k = start - 1;
  while (k >= 0 && /\s/.test(source[k])) k -= 1;
  if (source[k] !== "(") return false;
  k -= 1;
  while (k >= 0 && /\s/.test(source[k])) k -= 1;
  if (source[k] !== "t") return false;
  return k === 0 || !/[\w$.]/.test(source[k - 1]);
}

function allowedRawContext(source, start, end) {
  let k = start - 1;
  while (k >= 0 && /\s/.test(source[k])) k -= 1;
  const before = source.slice(Math.max(0, k - 12), k + 1);
  if (/(===|!==|==|!=)$/.test(before)) return "comparison";
  if (/\bcase$/.test(before)) return "case";
  if (/\/\*\s*zh-key\s*\*\/$/.test(before)) return "zh-key";
  // 物件 key：前面是 { 或 ,，後面是 :
  let j = end;
  while (j < source.length && /\s/.test(source[j])) j += 1;
  if (source[j] === ":" && (source[k] === "{" || source[k] === ",")) return "object-key";
  return "";
}

const usedKeys = new Map(); // key → [file:line]
let dynamicCalls = 0;
UI_FILES.forEach((rel) => {
  const source = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const tokens = scan(source);
  tokens.forEach((token) => {
    if (token.kind === "template") {
      // HTML 註解不是給人看的字。註解可能被 ${} 切成兩段，所以沒配對的頭尾也各自砍掉。
      const visible = token.text
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<!--[\s\S]*$/, "")
        .replace(/^[\s\S]*?-->/, "");
      if (CJK.test(visible)) fail(`${rel}:${token.line} 模板字串裡有沒包 t() 的中文：${JSON.stringify(visible.trim().slice(0, 60))}`);
      return;
    }
    if (wrappedByT(source, token.start)) {
      if (!usedKeys.has(token.text)) usedKeys.set(token.text, []);
      usedKeys.get(token.text).push(`${rel}:${token.line}`);
      return;
    }
    if (!CJK.test(token.text)) return;
    if (allowedRawContext(source, token.start, token.end)) return;
    fail(`${rel}:${token.line} 含中文卻沒包 t()：${JSON.stringify(token.text.slice(0, 60))}`);
  });
  // t(`…`) 與 t(變數)：前者不准（key 要能靜態抓到），後者只計數
  (source.match(/\bt\(\s*`/g) || []).forEach(() => fail(`${rel} 有 t(\`…\`)：key 必須是字串字面值`));
  dynamicCalls += (source.match(/\bt\(\s*[A-Za-z_$][\w$.]*\s*[,)]/g) || []).length;
});

// ── 2. 字典 ────────────────────────────────────────────────────
function loadTable(rel, method) {
  const table = {};
  const source = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const sandbox = { window: {}, console };
  sandbox.window.BuzzI18n = { [method]: (code, t) => { if (code === "en") Object.assign(table, t); } };
  sandbox.BuzzI18n = sandbox.window.BuzzI18n;
  vm.runInNewContext(source, sandbox, { filename: rel });
  return table;
}
const dict = loadTable(DICT_FILE, "register");
const placeholders = (text) => new Set([...String(text).matchAll(/\{(\w+)(?:\|[^}]*)?\}/g)].map((m) => m[1]));

usedKeys.forEach((sites, key) => {
  if (!(key in dict)) fail(`字典缺 key（${sites[0]}）：${JSON.stringify(key)}`);
});
Object.entries(dict).forEach(([key, value]) => {
  if (!usedKeys.has(key)) fail(`字典裡的殭屍 key（原始碼已經沒有）：${JSON.stringify(key)}`);
  if (typeof value !== "string") { fail(`字典值不是字串：${JSON.stringify(key)}`); return; }
  if (CJK.test(value)) fail(`英文值含中文：${JSON.stringify(key)} → ${JSON.stringify(value)}`);
  if (!value && !EMPTY_OK.has(key)) fail(`英文值是空的：${JSON.stringify(key)}`);
  const want = placeholders(key);
  const got = placeholders(value);
  want.forEach((name) => { if (!got.has(name)) fail(`英文漏了佔位符 {${name}}：${JSON.stringify(key)}`); });
  got.forEach((name) => { if (!want.has(name)) fail(`英文多了佔位符 {${name}}：${JSON.stringify(key)}`); });
});

// ── 3. 題庫側表 ────────────────────────────────────────────────
const problemsTable = loadTable(PROBLEMS_FILE, "registerProblems");
const katex = require(path.join(ROOT, "assets", "vendor", "katex", "katex.min.js"));
const api = require("./lib/app_api.js");
const problems = api.allProblems();
const stripText = (tex) => String(tex).replace(/\\text\{[^{}]*\}/g, "\u0000");
const mathSignature = (tex) => stripText(tex).split("\u0000").map((s) => s.replace(/\s+/g, "")).filter(Boolean).sort().join("|");

let needed = 0;
let covered = 0;
problems.forEach((problem) => {
  const overlay = problemsTable[problem.id];
  const needsPrompt = CJK.test(problem.prompt || "");
  const needsCaption = CJK.test(problem.tableCaption || "");
  const needsCanonical = problem.answerKind === "text" && CJK.test(problem.canonical || "");
  const needsDistractors = (problem.distractors || []).some((d) => CJK.test(String(d)));
  const fieldNeeds = (problem.fields || []).filter((f) => CJK.test(f.label || "") || CJK.test(f.note || ""));
  if (!needsPrompt && !needsCaption && !needsCanonical && !needsDistractors && !fieldNeeds.length) return;
  needed += 1;
  if (!overlay) { fail(`題目 ${problem.id} 含中文但沒有英文側表`); return; }
  let ok = true;
  const check = (field, text) => {
    if (CJK.test(String(text))) { fail(`題目 ${problem.id} 的英文 ${field} 還有中文：${String(text).slice(0, 60)}`); ok = false; }
  };
  if (needsPrompt) {
    if (!overlay.prompt) { fail(`題目 ${problem.id} 缺英文題幹`); ok = false; }
    else {
      check("prompt", overlay.prompt);
      if (mathSignature(overlay.prompt) !== mathSignature(problem.prompt)) { fail(`題目 ${problem.id} 的英文題幹動到了數學（去掉 \\text 之後不一樣）`); ok = false; }
      if (/\\text\{\s*\}/.test(overlay.prompt)) { fail(`題目 ${problem.id} 的英文題幹有空的 \\text{}`); ok = false; }
      try { katex.renderToString(overlay.prompt, { throwOnError: true, displayMode: true, strict: "ignore" }); }
      catch (error) { fail(`題目 ${problem.id} 的英文題幹 KaTeX 渲染失敗：${error.message.slice(0, 80)}`); ok = false; }
    }
  }
  if (needsCaption) { if (!overlay.tableCaption) { fail(`題目 ${problem.id} 缺英文 tableCaption`); ok = false; } else check("tableCaption", overlay.tableCaption); }
  if (needsCanonical) { if (!overlay.canonical) { fail(`題目 ${problem.id} 缺英文 canonical（text 型的參考答案）`); ok = false; } else check("canonical", overlay.canonical); }
  if (needsDistractors) {
    if (!Array.isArray(overlay.distractors) || overlay.distractors.length !== problem.distractors.length) { fail(`題目 ${problem.id} 的英文 distractors 缺了或長度不對`); ok = false; }
    else overlay.distractors.forEach((d) => check("distractors", d));
  }
  fieldNeeds.forEach((field) => {
    const f = overlay.fields && overlay.fields[field.key];
    if (!f) { fail(`題目 ${problem.id} 的欄位 ${field.key} 缺英文 label/note`); ok = false; return; }
    if (CJK.test(field.label || "") && !f.label) { fail(`題目 ${problem.id} 的欄位 ${field.key} 缺英文 label`); ok = false; }
    if (CJK.test(field.note || "") && !f.note) { fail(`題目 ${problem.id} 的欄位 ${field.key} 缺英文 note`); ok = false; }
    if (f.label) check(`fields.${field.key}.label`, f.label);
    if (f.note) check(`fields.${field.key}.note`, f.note);
  });
  if (ok) covered += 1;
});
Object.keys(problemsTable).forEach((id) => {
  if (!problems.some((p) => p.id === id)) fail(`題目側表裡的殭屍 id（題庫已經沒有）：${id}`);
});

// ── 4. 載入時的語言判定 ────────────────────────────────────────
// i18n.js 在載入那一刻就定案：有設定聽設定，沒設定看瀏覽器（中文任何地區 → zh，其他 → en）。
// 這三條規則寫錯的話，台灣使用者第一次開站會看到英文 —— 那是最貴的一種壞法。
function bootLang(navigatorLanguages, storedLang) {
  const source = fs.readFileSync(path.join(ROOT, "src/kernel/i18n.js"), "utf8");
  const records = storedLang ? JSON.stringify({ settings: { lang: storedLang } }) : null;
  const sandbox = {
    navigator: { languages: navigatorLanguages, language: navigatorLanguages[0] },
    localStorage: { getItem: (key) => (key === "buzzcalculus.records.v1" ? records : null) },
    document: { documentElement: {}, querySelector: () => null },
    console
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "i18n.js" });
  return sandbox.BuzzI18n.lang;
}
const bootCases = [
  [["zh-TW", "zh"], "", "zh"],
  [["zh-CN"], "", "zh"],
  [["en-US", "en"], "", "en"],
  [["ja-JP"], "", "en"],
  [["en-US"], "zh", "zh"],
  [["zh-TW"], "en", "en"],
  [[], "", "zh"]
];
bootCases.forEach(([languages, stored, expected]) => {
  const got = bootLang(languages, stored);
  if (got !== expected) fail(`載入語言判定錯：navigator ${JSON.stringify(languages)}、設定 ${JSON.stringify(stored)} 應得 ${expected}，實得 ${got}`);
});

// ── 結果 ────────────────────────────────────────────────────────
console.log(`i18n：UI 檔 ${UI_FILES.length} 支、t() key ${usedKeys.size} 個（動態呼叫 ${dynamicCalls} 處）、字典 ${Object.keys(dict).length} 條；題目要翻 ${needed} 題、翻齊 ${covered} 題`);
if (failures.length) {
  const shown = failures.slice(0, 60);
  shown.forEach((message) => console.error("  ✗ " + message));
  if (failures.length > shown.length) console.error(`  … 還有 ${failures.length - shown.length} 條`);
  console.error(`validate_i18n：${failures.length} 個問題`);
  process.exit(1);
}
console.log("validate_i18n OK");
