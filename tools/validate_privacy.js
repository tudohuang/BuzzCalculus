// 隱私與法遵：把「我們宣稱的事」跟「程式碼實際做的事」綁在一起
//
// 隱私政策最常見的失敗方式不是寫錯，是**寫完之後程式碼改了**。
// 政策上寫「可以關閉分析」，半年後有人重構把那個判斷拿掉，
// 政策就變成一份不實陳述 —— 而且沒有任何測試會紅。
//
// 這支檢查四件事：
//   1. 兩個法務頁存在、有實質內容、而且互相連得到
//   2. 產品裡連得到它們（藏在條款裡的條款沒有意義）
//   3. **關掉分析真的會擋住 GA**：不只是不送事件，連 gtag.js 都不載
//   4. **「清除資料」真的清乾淨**：每一個 localStorage key 都在刪除清單裡
//
// 第 3、4 兩條是政策上寫死的承諾，所以用靜態檢查釘住。
//
// 用法：node tools/validate_privacy.js

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

const failures = [];
const fail = (message) => failures.push(message);

/* ── 1. 法務頁本身 ────────────────────────────────────────── */

const PAGES = [
  ["privacy.html", "隱私政策", ["localStorage", "IndexedDB", "清除資料", "Google Analytics", "回報"]],
  ["terms.html", "服務條款", ["原創", "不保證", "匯出"]],
  // 匿名的工具沒有人推薦，也沒有人敢付錢。關於頁不是裝飾，是「有人負責」的證據。
  ["about.html", "關於", ["tudohuang", "驗算", "原創"]],
  ["changelog.html", "更新紀錄", ["v1.0.0"]]
];

PAGES.forEach(([file, label, mustMention]) => {
  let source;
  try {
    source = read(file);
  } catch (_error) {
    fail(`${file} 不存在 —— ${label}是變現前的硬性前提`);
    return;
  }
  if (source.length < 1500) fail(`${file} 太短（${source.length} 字元），像是範本沒填完`);
  if (!/最後更新：\d{4}-\d{2}-\d{2}/.test(source)) fail(`${file} 沒有寫最後更新日期`);
  mustMention.forEach((needle) => {
    if (!source.includes(needle)) fail(`${file} 沒有提到「${needle}」`);
  });
  if (!source.includes("index.html")) fail(`${file} 沒有回到產品的連結`);
});

const privacy = read("privacy.html");
const terms = read("terms.html");
if (!privacy.includes("terms.html")) fail("隱私政策沒有連到服務條款");
if (!terms.includes("privacy.html")) fail("服務條款沒有連到隱私政策");

/* ── 2. 產品裡連得到 ─────────────────────────────────────── */

const app = read("src/app.js");
["privacy.html", "terms.html", "about.html", "changelog.html"].forEach((page) => {
  if (!app.includes(`href="${page}"`)) fail(`設定頁沒有連到 ${page}`);
});

const sw = read("sw.js");
["./privacy.html", "./terms.html", "./about.html", "./changelog.html"].forEach((entry) => {
  if (!sw.includes(entry)) fail(`sw.js 沒有快取 ${entry} —— 離線時會開不起來`);
});

/* ── 回報題目不能只寫進使用者自己的瀏覽器 ─────────────────── */

// 實際踩過：reportProblem() 只把一筆紀錄寫進 localStorage 就結束，
// 使用者看到按鈕變成「已回報」，以為講了，而作者永遠不會收到。
// 那比沒有回報按鈕更糟 —— 它製造了「已經反映過」的錯覺。
if (!/function buildReportText\(/.test(app)) {
  fail("找不到 buildReportText() —— 回報要能組出一份使用者送得出去的內容");
}
if (!/issues\/new\?title=/.test(app)) {
  fail("回報沒有對外的出口（GitHub issue）—— 回報只寫進本機等於沒有回報");
}
if (!/function renderReportModal\(/.test(app)) {
  fail("回報沒有預覽步驟 —— 要送出去的內容必須先攤開給使用者看");
}

/* ── 3. 關閉分析要真的擋住 ───────────────────────────────── */

if (!/function analyticsEnabled\(/.test(app)) {
  fail("找不到 analyticsEnabled() —— 隱私政策承諾了可以關閉分析");
}
// trackEvent 要擋
const trackEventBody = (app.match(/function trackEvent\([\s\S]*?\n  \}/) || [""])[0];
if (!/analyticsEnabled\(\)/.test(trackEventBody)) {
  fail("trackEvent 沒有檢查 analyticsEnabled() —— 關掉之後還是會送事件");
}
// setupAnalytics 要在載入 gtag.js **之前**擋
const setupBody = (app.match(/function setupAnalytics\([\s\S]*?\n  \}/) || [""])[0];
if (!/analyticsEnabled\(\)/.test(setupBody)) {
  fail("setupAnalytics 沒有檢查 analyticsEnabled()");
} else {
  const guardAt = setupBody.indexOf("analyticsEnabled()");
  const scriptAt = setupBody.indexOf("googletagmanager");
  if (scriptAt >= 0 && guardAt > scriptAt) {
    fail("analyticsEnabled() 的檢查在載入 gtag.js 之後 —— 那時候請求已經發出去了");
  }
}

/* ── 3b. 錯誤回報不能夾帶內容 ─────────────────────────────── */

// 加錯誤遙測最大的風險不是「送太多事件」，是**錯誤訊息本身**：
// 一句 "Cannot read properties of null" 沒差，但 JS 引擎組出來的訊息
// 常常會把變數的值印進去 —— 那可能是題目、使用者輸入的答案，或存檔片段。
// 所以只送型別、檔名、行號，訊息與堆疊一律不送。
const errorReporter = (app.match(/function reportRuntimeError\([\s\S]*?\n  \}/) || [""])[0];
if (!errorReporter) {
  fail("找不到 reportRuntimeError() —— 錯誤遙測要有單一出口才管得住送出去的欄位");
} else {
  [
    [/\.message/, "錯誤訊息（message）"],
    [/\.stack/, "堆疊追蹤（stack）"],
    [/JSON\.stringify/, "序列化整包物件"]
  ].forEach(([pattern, label]) => {
    if (pattern.test(errorReporter)) {
      fail(`錯誤遙測送出了${label} —— 那裡面可能夾帶題目或使用者的作答`);
    }
  });
  if (!/error_kind/.test(errorReporter) || !/error_line/.test(errorReporter)) {
    fail("錯誤遙測沒有送型別或行號 —— 那樣收到也修不了");
  }
}

/* ── 4. 「清除資料」要真的清乾淨 ─────────────────────────── */

// 掃出所有 localStorage 的 key 常數，逐一確認它們在刪除清單裡
const sources = ["src/app.js", "src/custom_problems.js"];
const keys = new Set();
sources.forEach((file) => {
  const source = read(file);
  [...source.matchAll(/const ([A-Z_]+KEY[A-Z_]*) = "([^"]+)"/g)].forEach((match) => {
    keys.add(match[2]);
  });
});

// 刪除的依據必須是**整個命名空間**，不是一份固定清單。
// 自動備份的 key 帶時間戳（buzzcalculus.backup.<ts>），固定清單永遠列不完 ——
// E2E 實測抓到過「按了清除資料，但一份完整備份還躺在 localStorage 裡」，
// 而隱私政策上寫的是「會刪掉練習紀錄」。
if (!/const STORAGE_NAMESPACE = "buzzcalculus\."/.test(app)) {
  fail("eraseEverything 沒有用命名空間前綴 —— 帶時間戳的 key（自動備份）會被漏掉");
}
if (!/Object\.keys\(localStorage\)[\s\S]{0,240}startsWith\(STORAGE_NAMESPACE\)/.test(app)) {
  fail("清除資料沒有掃過整個 buzzcalculus. 命名空間");
}

const erasableBlock = (app.match(/const ERASABLE = \[[\s\S]*?\];/) || [""])[0];
if (!erasableBlock) {
  fail("找不到 ERASABLE 清單 —— 要用它告訴使用者刪掉了哪幾類東西");
} else {
  keys.forEach((key) => {
    // key 可能以常數名出現在清單裡，所以兩種寫法都算
    const constantName = [...app.matchAll(/const ([A-Z_]+KEY[A-Z_]*) = "([^"]+)"/g)]
      .concat([...read("src/custom_problems.js").matchAll(/const ([A-Z_]+KEY[A-Z_]*) = "([^"]+)"/g)])
      .find((match) => match[2] === key);
    const byName = constantName && erasableBlock.includes(constantName[1]);
    const byLiteral = erasableBlock.includes(`"${key}"`);
    if (!byName && !byLiteral) {
      fail(`localStorage key "${key}" 不在清除清單裡 —— 「清除資料」會留下它`);
    }
  });
}

if (!/BuzzBoardStore[\s\S]{0,80}clearBoards/.test(app)) {
  fail("清除資料沒有清掉 IndexedDB 的手寫草稿");
}
if (!/renderEraseConfirmModal/.test(app)) {
  fail("刪除沒有確認步驟 —— 不可逆的動作不能一鍵完成");
}

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("隱私與法遵");
console.log(`  法務頁      privacy.html ${privacy.length} 字元 / terms.html ${terms.length} 字元`);
console.log(`  分析開關    trackEvent 與 setupAnalytics 都有檢查`);
console.log(`  清除範圍    ${keys.size} 個 localStorage key + IndexedDB 手寫草稿`);

if (failures.length) {
  console.error("");
  console.error(`隱私驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("privacy OK");
