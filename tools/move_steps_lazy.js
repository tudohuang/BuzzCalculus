// 把題包裡內嵌的 solutionSteps 搬到延後載入的側表（src/problem_solution_steps.js 的 PLAIN 表）
//
// 為什麼：步驟只有答完題看解答才用得到，放在題包裡等於每個訪客首屏都多解析一次。
// 側表本來就是 text/lazy（data-lazy="steps"），瀏覽器閒下來才注入、使用者答第一題之前就到了。
// PLAIN 表跟原本的 STEPS 表不同的是不帶驗算宣稱 —— 驗證層級跟搬之前（內嵌在題包裡）一樣：
// validate_solution_steps 第 5 條的形狀檢查照樣涵蓋，宣稱等詳解 v2（tools/content/detail/）補。
//
// 用法：node tools/move_steps_lazy.js <id 前綴…>     例：node tools/move_steps_lazy.js cg-
// 安全網：搬完在 vm 裡把整個題庫（含側表）載一次，每一題除了「步驟從哪裡來」之外都要一模一樣，否則全部還原。
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const loadAppApi = require("./lib/app_api.js");

const prefixes = process.argv[2] === "--dump" ? [""] : process.argv.slice(2);
if (!prefixes.length) { console.error("要給 id 前綴，例如 cg-"); process.exit(1); }
const want = (id) => prefixes.some((p) => String(id).startsWith(p));

// 與 strip_verify.js 同一個掃描器：認得字串、樣板、註解、正規式
const REGEX_PREV = new Set(["(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^", ""]);
function codeMask(text) {
  const mask = new Uint8Array(text.length);
  let i = 0; let prev = ""; const stack = [];
  while (i < text.length) {
    const c = text[i]; const d = text[i + 1];
    if (c === "/" && d === "/") { while (i < text.length && text[i] !== "\n") i += 1; continue; }
    if (c === "/" && d === "*") { const e = text.indexOf("*/", i + 2); i = e < 0 ? text.length : e + 2; continue; }
    if (c === "\"" || c === "'") { i += 1; while (i < text.length && text[i] !== c) { if (text[i] === "\\") i += 1; i += 1; } i += 1; prev = "x"; continue; }
    if (c === "`" || (c === "}" && stack.length && stack[stack.length - 1] === 0)) {
      if (c === "}") stack.pop();
      i += 1;
      while (i < text.length && text[i] !== "`") { if (text[i] === "\\") { i += 2; continue; } if (text[i] === "$" && text[i + 1] === "{") { stack.push(0); i += 2; break; } i += 1; }
      if (text[i] === "`") i += 1;
      prev = "x"; continue;
    }
    if (c === "/" && REGEX_PREV.has(prev)) {
      i += 1; let cls = false;
      while (i < text.length && (cls || text[i] !== "/")) { if (text[i] === "\\") i += 1; else if (text[i] === "[") cls = true; else if (text[i] === "]") cls = false; i += 1; }
      i += 1; while (/[a-z]/.test(text[i] || "")) i += 1; prev = "x"; continue;
    }
    if (stack.length) { if (c === "{") stack[stack.length - 1] += 1; else if (c === "}") stack[stack.length - 1] -= 1; }
    mask[i] = 1;
    if (!/\s/.test(c)) prev = /[A-Za-z0-9_$)\]]/.test(c) ? "x" : c;
    i += 1;
  }
  return mask;
}

// 在一個題包檔裡，拿掉「id 符合前綴的物件」的 solutionSteps 屬性；回傳新文字與搬了哪些 id
function stripSteps(text) {
  const mask = codeMask(text);
  const cuts = []; const ids = [];
  const re = /\bsolutionSteps\s*:/g; let m;
  while ((m = re.exec(text))) {
    const at = m.index;
    if (!mask[at]) continue;
    let p = at - 1;
    while (p >= 0 && (/\s/.test(text[p]) || !mask[p])) p -= 1;
    if (p < 0 || (text[p] !== "{" && text[p] !== ",")) continue;
    // 往回找這個物件的開頭 {（同層），再在物件裡找 id: "…"
    let depth = 0; let open = -1;
    for (let k = at - 1; k >= 0; k -= 1) {
      if (!mask[k]) continue;
      if (text[k] === "}" || text[k] === "]" || text[k] === ")") depth += 1;
      else if (text[k] === "{" || text[k] === "[" || text[k] === "(") { if (depth === 0) { open = k; break; } depth -= 1; }
    }
    if (open < 0 || text[open] !== "{") continue;
    const idm = /^\{\s*id:\s*"([^"]+)"/.exec(text.slice(open, open + 200));
    if (!idm || !want(idm[1])) continue;
    let i = re.lastIndex; depth = 0;
    for (; i < text.length; i += 1) {
      if (!mask[i]) continue;
      const c = text[i];
      if (c === "{" || c === "(" || c === "[") depth += 1;
      else if (c === "}" || c === ")" || c === "]") { if (depth === 0) break; depth -= 1; }
      else if (c === "," && depth === 0) break;
    }
    let end = i; let start = at;
    if (text[end] === ",") end += 1; else start = p;
    cuts.push([start, end]); ids.push(idm[1]);
    re.lastIndex = end;
  }
  let out = ""; let last = 0;
  for (const [s, e] of cuts) { out += text.slice(last, s); last = e; }
  return { text: out + text.slice(last), ids };
}

// 每次快照在子行程裡載題庫（app_api 一個行程只能載一次）
const { spawnSync } = require("child_process");
if (process.argv[2] === "--dump") {
  const api = loadAppApi.allProblems();
  const sorted = (p) => JSON.stringify(Object.keys(p).sort().reduce((o, k) => { o[k] = p[k]; return o; }, {}));
  fs.writeFileSync(process.argv[3], JSON.stringify(api.map(sorted)));
  process.exit(0);
}
const snapshot = () => {
  const out = path.join(require("os").tmpdir(), "buzz_steps_snapshot.json");
  const r = spawnSync(process.execPath, [__filename, "--dump", out], { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(fs.readFileSync(out, "utf8"));
};

const before = snapshot();
const byId = new Map(before.map((s) => JSON.parse(s)).map((p) => [p.id, p]));
const STEPS_FILE = path.join(ROOT, "src", "problem_solution_steps.js");
const backups = new Map();
const moved = {};
for (const name of fs.readdirSync(path.join(ROOT, "src")).filter((n) => /^problem_.*\.js$/.test(n) && n !== "problem_solution_steps.js")) {
  const file = path.join(ROOT, "src", name);
  const text = fs.readFileSync(file, "utf8");
  const r = stripSteps(text);
  if (!r.ids.length) continue;
  backups.set(file, text);
  fs.writeFileSync(file, r.text);
  r.ids.forEach((id) => { moved[id] = byId.get(id).solutionSteps; });
  console.log(`${name}: 搬 ${r.ids.length} 題`);
}
const ids = Object.keys(moved);
if (!ids.length) { console.log("沒有要搬的"); process.exit(0); }

// 寫進側表的 PLAIN 區塊（已有就合併）
const stepsText = fs.readFileSync(STEPS_FILE, "utf8");
backups.set(STEPS_FILE, stepsText);
const START = "  // ── PLAIN：題包搬來的步驟（不帶驗算宣稱，見 tools/move_steps_lazy.js）──\n  const PLAIN = ";
let plain = {};
let next;
const at = stepsText.indexOf(START);
if (at >= 0) {
  const end = stepsText.indexOf(";\n", at);
  plain = JSON.parse(stepsText.slice(at + START.length, end));
  Object.assign(plain, moved);
  next = stepsText.slice(0, at) + START + JSON.stringify(plain, null, 0).replace(/\],"/g, "],\n    \"") + stepsText.slice(end);
} else {
  plain = moved;
  const anchor = "\n  const textOf = (step) =>";
  if (!stepsText.includes(anchor)) throw new Error("側表裡找不到插入點");
  const block = `\n${START}${JSON.stringify(plain, null, 0).replace(/\],"/g, "],\n    \"")};\n`;
  next = stepsText.replace(anchor, () => block + anchor);
  // 套用：STEPS 沒有的題才用 PLAIN
  const apply = "    const steps = STEPS[problem.id];";
  if (!next.includes(apply)) throw new Error("側表的套用迴圈變了");
  next = next.replace(apply, "    const steps = STEPS[problem.id] || PLAIN[problem.id];");
}
fs.writeFileSync(STEPS_FILE, next);

// 安全網：每一題除了步驟從哪裡來，其他都一樣
const after = snapshot();
const restore = (why) => { for (const [f, t] of backups) fs.writeFileSync(f, t); console.error(`還原：${why}`); process.exit(1); };
if (after.length !== before.length) restore(`題數變了 ${before.length} → ${after.length}`);
for (let k = 0; k < before.length; k += 1) if (before[k] !== after[k]) restore(`第 ${k} 題不一樣：${before[k].slice(0, 80)}`);
console.log(`搬了 ${ids.length} 題的步驟到側表；全部題目載入後一模一樣`);
