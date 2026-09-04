// 每日一題釘選表的驗證。
//
// 三條不變式：
//   1. 表裡的每個 id 都必須存在於現行題庫 —— 移除題目時要先看這張表。
//   2. 日期都要合法而且不在未來（未來由種子決定，不准先釘）。
//   3. 表不能落後今天超過 7 天 —— 逼著發版流程記得跑 pin_daily_one.js，
//      不然釘選就是裝飾品。
//
// 「已釘的日期永不改寫」由產生器的 append-only 邏輯＋code review 把關，
// 這裡驗不了（驗了就要存第二份真相）。

"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");

loadAppApi();
const problems = loadAppApi.allProblems();
const byId = new Set(problems.map((problem) => problem.id));
const { HISTORY } = require(path.join(__dirname, "..", "src", "kernel", "daily_one_history.js"));

const errors = [];
const todayKey = new Date().toISOString().slice(0, 10);
const keys = Object.keys(HISTORY);

if (!keys.length) errors.push("釘選表是空的 —— 跑 node tools/pin_daily_one.js");

keys.forEach((key) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || Number.isNaN(Date.parse(key))) {
    errors.push(`日期不合法：${key}`);
  } else if (key > todayKey) {
    errors.push(`釘到未來去了：${key}（未來由種子決定，過去才釘）`);
  }
  if (!byId.has(HISTORY[key])) {
    errors.push(`${key} 釘住的 ${HISTORY[key]} 不在題庫裡 —— 題目被移除前要先處理這張表`);
  }
});

const latest = [...keys].sort().at(-1) || "0000-00-00";
const staleDays = Math.floor((Date.parse(todayKey) - Date.parse(latest)) / 86400000);
if (staleDays > 7) {
  errors.push(`釘選表停在 ${latest}，落後 ${staleDays} 天 —— 跑 node tools/pin_daily_one.js`);
}

if (errors.length) {
  console.error(`每日一題釘選驗證失敗（${errors.length}）：`);
  errors.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}
console.log(`每日一題釘選：${keys.length} 天，最新 ${latest}，全部指向存在的題`);
console.log("daily one OK");
