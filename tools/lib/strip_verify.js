// 部署時把題目物件的 `verify: …` 拿掉（2026-10-19）
//
// verify 是給 tools/verify_answers.js 等驗證器的驗算描述子，app 本身完全不讀（grep 過：src/ 沒有任何地方讀 .verify）。
// 題庫 1,900 多題帶 verify，約 300KB —— 每個訪客都下載、解析，卻用不到。原始碼照留（作者寫題時驗算就在題目旁邊），
// 只在 bundle_site.js 串檔時拿掉；validate_performance_budget.js 也用這支量「真的送出去」的大小。
//
// 做法：一個小掃描器（認得字串、樣板字串、註解、正規式），在物件層級找 `verify:` 這個 key，
// 把它的值（物件、呼叫、識別字都可以，括號配對到底）連同一個逗號一起拿掉。
// 安全網：checkSame() 在 vm 裡把原檔與去掉後的檔各跑一次，BUZZ_PROBLEMS 去掉 verify 後必須一模一樣，不一樣就丟例外。
"use strict";

const vm = require("vm");

const REGEX_PREV = new Set(["(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^", ""]);

// 回傳每個「不在字串／註解裡」的字元位置的旗標：code[i] = true 代表是程式碼
function codeMask(text) {
  const mask = new Uint8Array(text.length);
  let i = 0;
  let prev = "";
  const stack = []; // 樣板字串裡 ${ } 的深度
  while (i < text.length) {
    const c = text[i];
    const d = text[i + 1];
    if (c === "/" && d === "/") { while (i < text.length && text[i] !== "\n") i += 1; continue; }
    if (c === "/" && d === "*") { const e = text.indexOf("*/", i + 2); i = e < 0 ? text.length : e + 2; continue; }
    if (c === "\"" || c === "'") {
      i += 1;
      while (i < text.length && text[i] !== c) { if (text[i] === "\\") i += 1; i += 1; }
      i += 1; prev = "x"; continue;
    }
    if (c === "`" || (c === "}" && stack.length && stack[stack.length - 1] === 0)) {
      if (c === "}") stack.pop();
      i += 1;
      while (i < text.length && text[i] !== "`") {
        if (text[i] === "\\") { i += 2; continue; }
        if (text[i] === "$" && text[i + 1] === "{") { stack.push(0); i += 2; break; }
        i += 1;
      }
      if (text[i] === "`") i += 1;
      prev = "x"; continue;
    }
    if (c === "/" && REGEX_PREV.has(prev)) {
      i += 1;
      let cls = false;
      while (i < text.length && (cls || text[i] !== "/")) {
        if (text[i] === "\\") i += 1;
        else if (text[i] === "[") cls = true;
        else if (text[i] === "]") cls = false;
        i += 1;
      }
      i += 1;
      while (/[a-z]/.test(text[i] || "")) i += 1;
      prev = "x"; continue;
    }
    if (stack.length) { if (c === "{") stack[stack.length - 1] += 1; else if (c === "}") stack[stack.length - 1] -= 1; }
    mask[i] = 1;
    if (!/\s/.test(c)) prev = /[A-Za-z0-9_$)\]]/.test(c) ? "x" : c;
    i += 1;
  }
  return mask;
}

function stripVerify(text) {
  const mask = codeMask(text);
  const cuts = [];
  // key 可以是 verify: 或 JSON 寫法的 "verify":（講次包是產生出來的 JSON 樣子）
  const re = /(?:\bverify|"verify")\s*:/g;
  let m;
  while ((m = re.exec(text))) {
    const at = m.index;
    const quoted = text[at] === "\"";
    if (!quoted && !mask[at]) continue;
    // 前一個有意義的程式碼字元要是 { 或 ,（物件的 key），不是 x.verify: 之類；
    // 引號版只跳空白（引號本身是字串開頭，前面緊接的必須是程式碼的 { 或 ,，才不會是別的字串裡的字）
    let p = at - 1;
    while (p >= 0 && (/\s/.test(text[p]) || (!quoted && !mask[p]))) p -= 1;
    if (p < 0 || !mask[p] || (text[p] !== "{" && text[p] !== ",")) continue;
    // 值：括號配對到同層的 , 或 }
    let i = re.lastIndex;
    let depth = 0;
    for (; i < text.length; i += 1) {
      if (!mask[i]) continue;
      const c = text[i];
      if (c === "{" || c === "(" || c === "[") depth += 1;
      else if (c === "}" || c === ")" || c === "]") { if (depth === 0) break; depth -= 1; }
      else if (c === "," && depth === 0) break;
    }
    let end = i;
    let start = at;
    if (text[end] === ",") end += 1; // 拿掉後面的逗號
    else if (text[p] === ",") start = p; // 最後一個 key：拿掉前面的逗號
    cuts.push([start, end]);
    re.lastIndex = end;
  }
  let out = "";
  let last = 0;
  for (const [s, e] of cuts) { out += text.slice(last, s); last = e; }
  out += text.slice(last);
  return { text: out, removed: cuts.length };
}

function evalProblems(code, file) {
  const sandbox = { console: { log() {}, warn() {}, error() {} } };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.BUZZ_PROBLEMS = [];
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 10000 });
  return sandbox.BUZZ_PROBLEMS || [];
}

// 原檔與去掉 verify 的檔，跑出來的題目（扣掉 verify）要一模一樣
function checkSame(original, stripped, file, opts = {}) {
  const a = evalProblems(original, file);
  const b = evalProblems(stripped, file);
  const norm = (list) => JSON.stringify(list.map((p) => { const q = { ...p }; delete q.verify; return q; }));
  if (norm(a) !== norm(b)) throw new Error(`${file}：去掉 verify 之後題目不一樣了（掃描器切錯地方）`);
  if (!opts.partial && b.some((p) => p && p.verify !== undefined)) throw new Error(`${file}：還有題目留著 verify（寫法掃描器沒認出來）`);
  return a.length;
}

// 第二種做法：verify 是用參數傳進小工具函式（q(id, …, verify, hints)）、或寫成 JSON 字串的檔，文字切不乾淨。
// 這種檔如果「自給自足」—— 只往 BUZZ_PROBLEMS 後面接題、不讀前面的題、不留別的全域、題目是純資料 ——
// 就在部署時跑一次，把產生出來的題目（去掉 verify）直接寫成資料。不符合就回 null（照原檔送）。
function reemit(text, file) {
  const run = (seed) => {
    const sandbox = { console: { log() {}, warn() {}, error() {} } };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    sandbox.BUZZ_PROBLEMS = seed.slice();
    vm.createContext(sandbox);
    vm.runInContext(text, sandbox, { filename: file, timeout: 10000 });
    return sandbox;
  };
  let a;
  let b;
  try {
    a = run([]);
    b = run([{ id: "__seed__", prompt: "x", answer: "1" }]);
  } catch (_e) { return null; }
  const extra = Object.keys(a).filter((k) => !["console", "window", "globalThis", "BUZZ_PROBLEMS"].includes(k));
  if (extra.length) return null;
  const listA = a.BUZZ_PROBLEMS || [];
  const listB = b.BUZZ_PROBLEMS || [];
  // 一定要真的生出題目（只改別人題目的側表檔，例如提示、步驟、校準，跑在空陣列上什麼都不生 —— 那種檔絕不能換成資料）；
  // 前面的題要原封不動、後面接的題跟有沒有前面的題無關
  if (!listA.length) return null;
  if (!listB.length || JSON.stringify(listB[0]) !== JSON.stringify({ id: "__seed__", prompt: "x", answer: "1" })) return null;
  if (JSON.stringify(listB.slice(1)) !== JSON.stringify(listA)) return null;
  // 純資料：stringify 再 parse 回來要一模一樣（沒有函式、undefined、NaN、RegExp…）
  const plain = (x) => {
    if (x === null || x === undefined || typeof x === "string" || typeof x === "boolean") return true; // undefined 的欄位 JSON 會省略，跟沒有這個欄位一樣
    if (typeof x === "number") return Number.isFinite(x);
    if (Array.isArray(x)) return x.every(plain);
    // vm 裡生的物件是另一個 realm 的 Object：用「原型的原型是 null」認純物件
    if (typeof x === "object" && Object.prototype.toString.call(x) === "[object Object]" && Object.getPrototypeOf(Object.getPrototypeOf(x) || Object.prototype) === null) return Object.values(x).every(plain);
    return false;
  };
  if (!listA.every(plain)) return null;
  const data = listA.map((p) => { const q = { ...p }; delete q.verify; return q; });
  return `/* ${file}：部署時把題目跑成資料、去掉 verify（tools/lib/strip_verify.js） */\nwindow.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(${JSON.stringify(data)});\n`;
}

// 部署用：挑一個「驗過、最小」的版本；兩種做法都不行就送原檔
function shipProblemFile(text, file) {
  const options = [];
  const s = stripVerify(text);
  if (s.removed) { try { checkSame(text, s.text, file, { partial: true }); options.push(s.text); } catch (_e) { /* 這種做法不行 */ } }
  const r = reemit(text, file);
  if (r) { try { checkSame(text, r, file); options.push(r); } catch (_e) { /* 這種做法不行 */ } }
  options.sort((x, y) => x.length - y.length);
  return options.length && options[0].length < text.length ? options[0] : text;
}

module.exports = { stripVerify, checkSame, reemit, shipProblemFile };
