// 分析事件驗證
//
// 不設白名單的話，半年後 GA 裡會是一堆沒人記得為什麼存在、也沒人在看的事件，
// 而真正要看的留存漏斗反而缺角。spec 06.5 定了一張正式事件表，
// 這支驗證器負責讓那張表和程式碼永遠對得起來。
//
// 另外守一條隱私底線：**使用者輸入的答案文字不得上報**（spec 06.4）。
// 那是最容易在「多帶一個欄位方便 debug」的時候破掉的規則。
//
// 用法：node tools/validate_analytics.js

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const failures = [];
function fail(message) {
  failures.push(message);
}

/* ── 1. 取出事件表 ─────────────────────────────────────────── */

const tableSource = (app.match(/const ANALYTICS_EVENTS = \{([\s\S]*?)\n  \};/) || [])[1];
if (!tableSource) {
  console.error("找不到 ANALYTICS_EVENTS 事件表");
  process.exit(1);
}
const declared = new Map();
[...tableSource.matchAll(/^\s*([a-z_][a-z0-9_]*):\s*"([^"]*)"/gm)].forEach((m) => {
  declared.set(m[1], m[2]);
});
if (!declared.size) fail("事件表是空的");

/* ── 2. 程式碼裡呼叫的事件必須都在表上 ─────────────────────── */

const called = new Map();
[...app.matchAll(/trackEvent\("([a-z_][a-z0-9_]*)"/g)].forEach((m) => {
  called.set(m[1], (called.get(m[1]) || 0) + 1);
});

const unlisted = [...called.keys()].filter((name) => !declared.has(name)).sort();
if (unlisted.length) {
  fail(`這些事件沒有登記在 ANALYTICS_EVENTS：${unlisted.join(", ")}`);
}

// 反向：表上有但沒人送的事件是死條目，會讓人以為有在收
const unused = [...declared.keys()].filter((name) => !called.has(name)).sort();
if (unused.length) {
  fail(`事件表上有但程式碼從來不送的事件（會讓人以為有在收）：${unused.join(", ")}`);
}

/* ── 3. 每個事件都要有一句人看得懂的說明 ──────────────────── */

declared.forEach((description, name) => {
  if (!description || description.trim().length < 4) {
    fail(`${name} 沒有寫清楚在追蹤什麼`);
  }
});

/* ── 4. 隱私：答案文字不得上報 ────────────────────────────── */

// 抓出每個 trackEvent 呼叫的參數區塊，看有沒有帶上使用者輸入
const FORBIDDEN = [
  ["input", /(^|[^a-z_])input\s*:/],
  ["draft", /(^|[^a-z_])draft\s*:/],
  ["answer 內容", /\banswer\s*:\s*(?!kind)/],
  ["prompt 題幹", /\bprompt\s*:/],
  ["email", /\bemail\s*:/]
];

let scanned = 0;
let cursor = 0;
while (true) {
  const at = app.indexOf("trackEvent(", cursor);
  if (at < 0) break;
  cursor = at + 11;
  // 粗略取到該呼叫的結尾（下一個 "});" 或 ");"）
  const tail = app.slice(at, at + 900);
  const end = tail.search(/\n\s*\}\);|\);/);
  const block = end > 0 ? tail.slice(0, end) : tail;
  const name = (block.match(/trackEvent\("([a-z_]+)"/) || [])[1] || "?";
  scanned += 1;
  FORBIDDEN.forEach(([label, pattern]) => {
    if (pattern.test(block)) {
      fail(`${name} 疑似上報了${label} —— 分析事件不得帶使用者輸入的內容`);
    }
  });
}

/* ── 5. spec 06.5 點名的核心指標必須有在收 ────────────────── */

const REQUIRED = [
  ["session_start", "開始一局"],
  ["session_complete", "完成一局"],
  ["session_abandon", "中途離開"],
  ["problem_start", "開始題目"],
  ["problem_submit", "送出答案"],
  ["return_visit", "隔日回訪"]
];
REQUIRED.forEach(([name, why]) => {
  if (!called.has(name)) fail(`缺少核心指標事件 ${name}（${why}）—— 沒有它算不出留存漏斗`);
});

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("Analytics");
console.log(`  事件表        ${declared.size} 個事件`);
console.log(`  程式碼呼叫    ${called.size} 種 / 共 ${[...called.values()].reduce((a, b) => a + b, 0)} 處`);
console.log(`  隱私掃描      ${scanned} 個呼叫，未發現上報使用者輸入`);

if (failures.length) {
  console.error("");
  console.error(`分析事件驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("analytics OK");
