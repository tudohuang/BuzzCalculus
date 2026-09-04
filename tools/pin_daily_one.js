// 把「已經過去的每日一題」釘進 src/kernel/daily_one_history.js。
//
// 為什麼：每日一題是「日期種子 → 對整個題池洗牌 → 取第一題」。
// 題池一變（每次加題包都會變），**所有日期**的抽選整個重排 ——
// 包括已經過去的日子。「昨天的每日一題是哪一題」這句話因此沒有
// 穩定的答案，全站同題的可比性也跟著漂。
//
// 這支把從 START 到今天為止每個日期的抽選結果凍成側表；
// pickDailyOneProblem 先查表、查不到才走種子。規則只有一條：
// **已寫進表的日期永不改寫**（append-only）—— 未來的日期不釘，
// 題池成長仍然會影響明天，但昨天從此不會再變。
//
// 用法：node tools/pin_daily_one.js（幂等；只補新日期）
// 部署前跑一次即可 —— 也可以掛在 CI 的產生器清單裡。

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");

const api = loadAppApi();
const historyPath = path.join(__dirname, "..", "src", "kernel", "daily_one_history.js");

// 既有的表：只增不改
let existing = {};
if (fs.existsSync(historyPath)) {
  existing = require(historyPath).HISTORY || {};
}

const START = "2026-06-01"; // 早於每日一題上線即可；多釘的過去日期無害
const dayMs = 24 * 60 * 60 * 1000;
const todayKey = new Date().toISOString().slice(0, 10);

let added = 0;
const table = { ...existing };
for (let t = Date.parse(START); ; t += dayMs) {
  const key = new Date(t).toISOString().slice(0, 10);
  if (key > todayKey) break;
  if (table[key]) continue; // append-only：已釘的日期永不改寫
  const problem = api.pickDailyOneProblem(key);
  if (!problem) continue;
  table[key] = problem.id;
  added += 1;
}

const keys = Object.keys(table).sort();
const lines = [
  "// 每日一題的歷史釘選。**由 tools/pin_daily_one.js 產生，只增不改。**",
  "//",
  "// 沒有這張表的話，每次題庫成長，過去所有日期的每日一題都會重排 ——",
  "// 「昨天那題」變成一個沒有穩定答案的問題。釘住的日期永遠不變；",
  "// 未來的日期照舊由日期種子對現行題池決定，等它過去再被釘進來。",
  "//",
  "// 重新產生（只補新日期）：node tools/pin_daily_one.js",
  "",
  "(function () {",
  '  "use strict";',
  "  const HISTORY = {",
  ...keys.map((key) => `    "${key}": ${JSON.stringify(table[key])},`),
  "  };",
  "  if (typeof module !== \"undefined\" && module.exports) module.exports = { HISTORY };",
  "  if (typeof window !== \"undefined\") window.BUZZ_DAILY_ONE_HISTORY = HISTORY;",
  "})();",
  ""
].join("\n");

fs.writeFileSync(historyPath, lines, "utf8");
console.log(`每日一題釘選：共 ${keys.length} 天（新增 ${added}），寫到 src/kernel/daily_one_history.js`);
