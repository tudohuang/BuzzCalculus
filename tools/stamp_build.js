// 把「這份程式碼實際上是哪一天的」蓋進去
//
// BUILD_DATE 原本是手寫常數，於是它做了所有手寫常數都會做的事：停在過去。
// 實測時它顯示 2026-06-22，而那兩個月之間 app.js 改了三千多行。
// 使用者第一眼看到的就是標題列上那個日期 —— 一個停在兩個月前的 beta
// 讀起來像是棄坑的專案，不像正在開發的產品。
//
// 這支從 git 拿出當前 commit 的日期蓋進 src/app.js，再重產 sw.js 的產生區（tools/build_sw_revisions.js）：
// app.js 變了，它的 revision、BUILD.id（設定頁顯示的版本）、快取名都跟著變。
//
// 部署時自動跑：vercel.json 的 buildCommand（與 GitHub Pages 的 Assemble site）先跑這一支 ——
// 忘了蓋日期、忘了重產 sw.js 的 commit，部署出去的照樣是「日期對、快取表對、快取名是新的」。
// （2026-10 之前它從來沒被自動跑過：BUILD_DATE 停在 2026-09-01，快取名是手寫的、好幾次部署都沒換。）
// 沒有 git（部署環境只拿到原始碼）就用今天 —— 那就是建置日期。
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
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    if (dirty) return today;
    // %cs 是 committer date，格式就是 YYYY-MM-DD，不用自己解析
    const out = execFileSync("git", ["log", "-1", "--format=%cs"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
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
    console.log(`  提醒      跟 commit 日期不同；部署時（vercel.json 的 buildCommand）會蓋成 ${stamp}`);
  }
  console.log("");
  console.log("stamp OK");
  process.exit(0);
}

if (current !== stamp) {
  fs.writeFileSync(appPath, appSource.replace(/const BUILD_DATE = "[^"]+"/, `const BUILD_DATE = "${stamp}"`), "utf8");
}

// 快取名 = buzzcalculus-<版本>-<內容雜湊>，在 sw.js 的產生區：app.js 可能剛改了，一定要重產
const { swSource, tables } = require("./build_sw_revisions.js");
fs.writeFileSync(swPath, swSource());
const build = tables().build;

console.log(`已蓋上建置日期 ${stamp}`);
console.log(`  src/app.js  BUILD_DATE = "${stamp}"`);
console.log(`  sw.js       BUILD = ${build.version} · ${build.id} · ${build.date}（CACHE_NAME buzzcalculus-${build.version}-${build.id}）`);
