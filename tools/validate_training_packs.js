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
if (!api || !api.trainingPacks || !api.packGroups || typeof api.packTotalCountText !== "function") {
  throw new Error("training pack test hooks are unavailable");
}

const knownKeys = new Set(Object.keys(api.trainingPacks));
const groupedKeys = new Set();
const failures = [];

api.packGroups.forEach((group) => {
  if (!group.label || !Array.isArray(group.keys)) {
    failures.push(`Invalid pack group: ${JSON.stringify(group)}`);
    return;
  }

  group.keys.forEach((key) => {
    if (!knownKeys.has(key)) failures.push(`Missing training pack referenced by group "${group.label}": ${key}`);
    if (groupedKeys.has(key)) failures.push(`Duplicate training pack in groups: ${key}`);
    groupedKeys.add(key);
  });
});

knownKeys.forEach((key) => {
  const pack = api.trainingPacks[key];
  const count = Number(api.packTotalCountText(key));
  if (!Number.isFinite(count)) failures.push(`Pack "${key}" produced non-numeric count`);
  if (count <= 0) failures.push(`Pack "${key}" has no matching problems`);
  if (!pack.label || !pack.note || !Array.isArray(pack.tags)) failures.push(`Pack "${key}" is missing label, note, or tags`);
});

const ungrouped = [...knownKeys].filter((key) => !groupedKeys.has(key));
if (ungrouped.length) failures.push(`Ungrouped training packs: ${ungrouped.join(", ")}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

api.packGroups.forEach((group) => {
  console.log(`[${group.label}]`);
  group.keys.forEach((key) => {
    const pack = api.trainingPacks[key];
    console.log(`  ${pack.label}: ${api.packTotalCountText(key)} problems`);
  });
});

console.log(`\nValidated ${knownKeys.size} training packs`);
