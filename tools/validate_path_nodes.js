// 載入方式改用 tools/lib/app_api.js（2026-08-16）。
//
// 這支原本自己帶一份假 DOM，只載題庫 + app.js，沒有載 kernel，
// 所以難度校準走的是 fallback 路徑 —— 驗到的 rank 跟使用者看到的不一樣。
// 共用載入層會照 index.html 的**文件順序**把所有 src/*.js 載進來，
// 驗證的因此是實際上線的那份組態。

"use strict";

const loadAppApi = require("./lib/app_api.js");
const api = loadAppApi();
const window = global.window;
if (!api || !api.pathNodes || !api.pathNodeProblems) {
  throw new Error("path test hooks are unavailable");
}

let failed = false;
api.pathNodes.forEach((node) => {
  const count = api.pathNodeProblems(node).length;
  console.log(`${node.id}: ${count} problems`);
  if (!count) failed = true;
});

if (failed) {
  throw new Error("one or more path nodes have zero problems");
}
