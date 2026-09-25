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
  // 挑選器（2026-09-25 取代 47 個選項的下拉）會把 label 與 note 一起印在卡片上，
  // 所以這兩件事變成硬規則：
  //   1. label 至少要有一個中文字 —— 舊版有「LM」「Mobile Sprint」「King's」這種
  //      開發期代號，使用者看不出那是什麼；純英文的專有名詞要配一個中文的說明詞
  //      （「Taylor 展開」「Hessian 判別」）。
  //   2. note 不能跟 label 一樣，也不能是空話 —— 卡片上那一行就是「這包在練什麼」。
  if (pack.label && !/[一-鿿]/.test(pack.label)) {
    failures.push(`Pack "${key}" 的標籤「${pack.label}」沒有中文字 —— 挑選器上的卡片會變成一個看不懂的代號`);
  }
  if (pack.note && pack.label && pack.note.trim() === pack.label.trim()) {
    failures.push(`Pack "${key}" 的說明跟標籤一樣（${pack.label}）—— 卡片上那一行要說「這包在練什麼」`);
  }
});

// 一組最多十包：挑選器是一排卡片，超過十張就回到「要先猜它在哪一組」那個問題。
api.packGroups.forEach((group) => {
  if (group.keys.length > 10) {
    failures.push(`分組「${group.label}」有 ${group.keys.length} 包 —— 一組最多十包（一眼掃得完），超過就再拆一組`);
  }
  if (!group.note) {
    failures.push(`分組「${group.label}」沒有 note —— 挑選器的組標題旁邊要有一句話說這一組是什麼`);
  }
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
