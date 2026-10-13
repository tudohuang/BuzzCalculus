// 分析事件驗證
//
// 不設白名單的話，半年後 GA 裡會是一堆沒人記得為什麼存在、也沒人在看的事件，
// 而真正要看的留存漏斗反而缺角。spec 06.5 定了一張正式事件表，
// 這支驗證器負責讓那張表和程式碼永遠對得起來。
//
// 另外守一條隱私底線：**使用者輸入的答案文字不得上報**（spec 06.4）。
// 那是最容易在「多帶一個欄位方便 debug」的時候破掉的規則。
//
// 2026-10-13 加：量測漏斗（src/kernel/metrics.js 的 EVENTS 表與 send() 呼叫一起算進來）、
// 手冊附錄 A 的每一步都要對到一個真的在送的事件、docs/metrics.md 與 privacy.html 要寫到它們。
//
// 用法：node tools/validate_analytics.js

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
// 課程（延後載入的那幾支）不能直接碰 gtag：一律呼叫 app.js 給的 deps.track（就是 trackEvent，所以關掉分析一樣擋得住）。
// 這幾支裡的 track("…") 跟 app.js 的 trackEvent("…") 一起掃。
const COURSE_FILES = ["src/course.js", "src/course_v2_ui.js", "src/course_sections.js", "src/course_finish.js", "src/course_boss.js", "src/course_solve.js",
  // 更新與版本（data-lazy="pwa"）：app_update_apply 從這裡送
  "src/kernel/app_update.js"];
const course = COURSE_FILES.map((rel) => [rel, fs.readFileSync(path.join(root, rel), "utf8")]);
// 量測漏斗（src/kernel/metrics.js，data-lazy="metrics"）：自己有一張 EVENTS 表（start() 時併進 ANALYTICS_EVENTS），
// 送事件一律呼叫 send("…") —— 也就是 app.js 交過去的 trackEvent，關掉分析一樣擋得住。
const METRICS_FILE = "src/kernel/metrics.js";
const metrics = fs.readFileSync(path.join(root, METRICS_FILE), "utf8");
const DOC = (() => { try { return fs.readFileSync(path.join(root, "docs", "metrics.md"), "utf8"); } catch (_e) { return ""; } })();
const PRIVACY = fs.readFileSync(path.join(root, "privacy.html"), "utf8");
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
// 事件說明是 UI 字串（隱私頁會列出來），所以包在 t("…") 裡；不包的舊寫法也認。
[...tableSource.matchAll(/^\s*([a-z_][a-z0-9_]*):\s*(?:t\()?"([^"]*)"/gm)].forEach((m) => {
  declared.set(m[1], m[2]);
});
if (!declared.size) fail("事件表是空的");
const metricsTable = (metrics.match(/const EVENTS = \{([\s\S]*?)\n  \};/) || [])[1] || "";
if (!metricsTable) fail(`${METRICS_FILE} 找不到 EVENTS 表`);
const metricsEvents = [...metricsTable.matchAll(/^\s*([a-z_][a-z0-9_]*):\s*"([^"]*)"/gm)].map((m) => [m[1], m[2]]);
metricsEvents.forEach(([name, description]) => {
  if (declared.has(name)) fail(`${name} 在 ANALYTICS_EVENTS 與 ${METRICS_FILE} 的 EVENTS 各登記了一次`);
  declared.set(name, description);
});

/* ── 2. 程式碼裡呼叫的事件必須都在表上 ─────────────────────── */

const called = new Map();
[...app.matchAll(/trackEvent\("([a-z_][a-z0-9_]*)"/g)].forEach((m) => {
  called.set(m[1], (called.get(m[1]) || 0) + 1);
});
course.forEach(([rel, source]) => {
  if (/\bgtag\b|dataLayer/.test(source)) fail(`${rel} 直接碰了 gtag／dataLayer —— 課程的事件要走 deps.track（trackEvent），關掉分析才擋得住`);
  [...source.matchAll(/\btrack\("([a-z_][a-z0-9_]*)"/g)].forEach((m) => called.set(m[1], (called.get(m[1]) || 0) + 1));
});
if (!/\btrack: trackEvent\b/.test(app)) fail("app.js 沒有把 trackEvent 當成 track 交給課程（courseUI 的 deps）");
// 量測：只准透過 send()（trackEvent）送；可以看 typeof window.gtag（中途關掉分析時 app.js 會拿掉它），不准呼叫它
if (/\bgtag\s*\(|dataLayer/.test(metrics)) fail(`${METRICS_FILE} 直接呼叫了 gtag／dataLayer —— 要走 send()（trackEvent），關掉分析才擋得住`);
if (!/BuzzMetrics\.start\(\{[^}]*track: trackEvent[^}]*events: ANALYTICS_EVENTS/.test(app)) {
  fail("app.js 沒有把 trackEvent 與 ANALYTICS_EVENTS 交給 BuzzMetrics.start —— 漏斗事件會繞過白名單");
}
[...metrics.matchAll(/\bsend\("([a-z_][a-z0-9_]*)"/g)].forEach((m) => called.set(m[1], (called.get(m[1]) || 0) + 1));

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
[[app, "trackEvent("], ...course.map(([, source]) => [source, 'track("']), [metrics, 'send("']].forEach(([source, needle]) => {
  let cursor = 0;
  while (true) {
    const at = source.indexOf(needle, cursor);
    if (at < 0) break;
    cursor = at + needle.length;
    // 粗略取到該呼叫的結尾（下一個 "});" 或 ");"）
    const tail = source.slice(at, at + 900);
    const end = tail.search(/\n\s*\}\);|\);/);
    const block = end > 0 ? tail.slice(0, end) : tail;
    const name = (block.match(/(?:track(?:Event)?|send)\("([a-z_0-9]+)"/) || [])[1] || "?";
    scanned += 1;
    FORBIDDEN.forEach(([label, pattern]) => {
      if (pattern.test(block)) {
        fail(`${name} 疑似上報了${label} —— 分析事件不得帶使用者輸入的內容`);
      }
    });
  }
});

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

/* ── 6. 漏斗（docs/metrics.md）：商業手冊附錄 A 的每一步都要有一個真的在送的事件 ── */

// [漏斗那一步, 實際送的事件]：同名是新事件；不同名是別名（意思一樣的既有事件，不重送一份）
const FUNNEL = [
  ["landing_view", "landing_view"],
  ["practice_open", "problem_start"],
  ["answer_submit", "answer_submit"],
  ["answer_correct", "answer_correct"],
  ["second_question_complete", "second_question_complete"],
  ["lesson_section_complete", "course_section_complete"],
  ["return_d1", "return_d1"],
  ["return_7d", "return_7d"]
];
FUNNEL.forEach(([step, actual]) => {
  if (!called.has(actual)) fail(`漏斗 ${step} 對到的事件 ${actual} 沒有人在送`);
  const tick = (word) => DOC.includes("`" + word + "`");
  if (!tick(step) || !tick(actual)) fail(`docs/metrics.md 沒有寫到 ${step}${step === actual ? "" : ` → ${actual}`}（定義寫在那裡，GA 才讀得對）`);
});
// 隱私頁要列出量測加的事件（中英文在同一頁，各列一次）
metricsEvents.forEach(([name]) => {
  const hits = PRIVACY.split(`<code>${name}</code>`).length - 1;
  if (hits < 2) fail(`privacy.html 的中文與英文兩段都要列出 ${name}（現在 ${hits} 處）`);
});
// session_id 只能是分頁內的隨機碼：存 sessionStorage，不准進 localStorage（那就變成持久的使用者 id）
if (!/SESSION_KEY[\s\S]{0,400}sessionStorage|sessionStorage[\s\S]{0,400}SESSION_KEY/.test(metrics) || /localStorage[^\n]*SESSION_KEY|write\(local\(\), SESSION_KEY/.test(metrics)) {
  fail("session_id 只能放 sessionStorage（關掉分頁就沒了），不能是持久的使用者 id");
}

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("Analytics");
console.log(`  事件表        ${declared.size} 個事件`);
console.log(`  程式碼呼叫    ${called.size} 種 / 共 ${[...called.values()].reduce((a, b) => a + b, 0)} 處`);
console.log(`  隱私掃描      ${scanned} 個呼叫，未發現上報使用者輸入`);
console.log(`  漏斗          ${FUNNEL.length} 步都有事件（${FUNNEL.filter(([a, b]) => a !== b).length} 個是既有事件的別名，見 docs/metrics.md）`);

if (failures.length) {
  console.error("");
  console.error(`分析事件驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("analytics OK");
