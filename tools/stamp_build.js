// 把「這份程式碼實際上是哪一天的」蓋進去
//
// BUILD_DATE 原本是手寫常數，於是它做了所有手寫常數都會做的事：停在過去。
// 實測時它顯示 2026-06-22，而那兩個月之間 app.js 改了三千多行。
// 使用者第一眼看到的就是標題列上那個日期 —— 一個停在兩個月前的 beta
// 讀起來像是棄坑的專案，不像正在開發的產品。
//
// 這支從 git 拿出當前 commit 的日期蓋進 src/app.js，並同步 sw.js 的快取名
// （快取名每次部署都必須變，否則使用者拿到的還是舊的 app shell）。
//
// 用法：
//   node tools/stamp_build.js           寫入
//   node tools/stamp_build.js --check   只檢查，不寫（CI 用）

"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const appPath = path.join(root, "src", "app.js");
const swPath = path.join(root, "sw.js");
const checkOnly = process.argv.includes("--check");

function commitDate() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    // 工作區有未提交的改動時，commit 日期不代表這份程式碼 —— 用今天。
    const dirty = execFileSync("git", ["status", "--porcelain", "src", "styles.css", "sw.js", "index.html"], {
      cwd: root,
      encoding: "utf8"
    }).trim();
    if (dirty) return today;
    // %cs 是 committer date，格式就是 YYYY-MM-DD，不用自己解析
    const out = execFileSync("git", ["log", "-1", "--format=%cs"], { cwd: root, encoding: "utf8" });
    const stamp = out.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(stamp)) return stamp;
  } catch (_error) {
    // 沒有 git（例如打包後的環境）就退回今天
  }
  return today;
}

const stamp = commitDate();
const appSource = fs.readFileSync(appPath, "utf8");

const versionMatch = appSource.match(/const APP_VERSION = "([^"]+)"/);
const dateMatch = appSource.match(/const BUILD_DATE = "([^"]+)"/);
if (!versionMatch || !dateMatch) {
  console.error("src/app.js 裡找不到 APP_VERSION 或 BUILD_DATE");
  process.exit(1);
}

const version = versionMatch[1];
const current = dateMatch[1];

if (checkOnly) {
  const today = new Date().toISOString().slice(0, 10);
  if (current > today) {
    console.error(`BUILD_DATE ${current} 在未來（今天 ${today}）`);
    process.exit(1);
  }
  console.log("建置日期");
  console.log(`  app.js    ${current}`);
  console.log(`  git       ${stamp}`);
  if (current !== stamp) {
    console.log(`  提醒      跟 commit 日期不同；部署時 CI 會蓋成 ${stamp}`);
  }
  console.log("");
  console.log("stamp OK");
  process.exit(0);
}

const nextApp = appSource.replace(/const BUILD_DATE = "[^"]+"/, `const BUILD_DATE = "${stamp}"`);
fs.writeFileSync(appPath, nextApp, "utf8");

// 快取名 = buzzcalculus-<版本>-<日期>。版本沒動但內容動了的時候，
// 日期就是讓使用者拿到新 app shell 的那個變數。
const swSource = fs.readFileSync(swPath, "utf8");
const nextSw = swSource.replace(
  /const CACHE_NAME = "[^"]+"/,
  `const CACHE_NAME = "buzzcalculus-${version}-${stamp}"`
);
fs.writeFileSync(swPath, nextSw, "utf8");

console.log(`已蓋上建置日期 ${stamp}`);
console.log(`  src/app.js  BUILD_DATE = "${stamp}"`);
console.log(`  sw.js       CACHE_NAME = "buzzcalculus-${version}-${stamp}"`);
