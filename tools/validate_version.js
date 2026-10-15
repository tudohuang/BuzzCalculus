// 版本號一致性
//
// 這個檔案存在的原因是一個實際發生過的分岔：
//
//   src/app.js   APP_VERSION = "v0.9.12-beta"
//   sw.js        CACHE_NAME  = "buzzcalculus-v0.20.0-beta-…"
//   README.md    v0.10.0-beta
//
// 三個數字，三個不同的答案。這不只是難看 —— `app_version` 會跟著
// **每一筆分析事件**上報，所以整份使用資料都被標上了一個不存在的版本；
// 而 README 告訴使用者的又是第三個版本。要回答「這個 bug 是哪一版開始的」
// 的時候，這三個數字沒有一個可信。
//
// 規則：
//   1. app.js 的 APP_VERSION 是唯一的真相來源。
//   2. README 的版本區塊必須跟它一字不差。
//   3. sw.js 的 CACHE_NAME 必須以 "buzzcalculus-<APP_VERSION>" 開頭。
//      後面可以接日期或標籤 —— service worker 的快取名每次部署都要變，
//      不然使用者拿到的是舊的 app shell。
//   4. （2026-10）設定頁顯示的版本 ＝ sw.js 的 BUILD：版本跟 APP_VERSION 一樣、日期跟 BUILD_DATE 一樣、
//      id ＝ REVISIONS 的雜湊（重算一次對得上）、CACHE_NAME 一字不差是 buzzcalculus-<版本>-<id>。
//      快取名手寫的年代它好幾次部署都沒換 → 新的 sw 打開同名快取、一支都沒重抓 → 主畫面的 app「不會更新」。
//   5. 部署一定會蓋章：vercel.json 的 buildCommand 先跑 stamp_build（它會重產 sw.js），GitHub Pages 的 Assemble site 也是。
//   6. 版本是從 Service Worker 問的：sw.js 回 VERSION 訊息、app_update.js 問 controller 與 waiting、設定頁畫 panel()。
//
// 用法：node tools/validate_version.js

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

const failures = [];
const fail = (message) => failures.push(message);

const appSource = read("src/app.js");
const appMatch = appSource.match(/const APP_VERSION = "([^"]+)"/);
if (!appMatch) {
  console.error("src/app.js 裡找不到 APP_VERSION");
  process.exit(1);
}
const version = appMatch[1];

if (!/^v\d+\.\d+\.\d+(-[a-z]+)?$/.test(version)) {
  fail(`APP_VERSION "${version}" 不符合 vX.Y.Z[-tag] 的格式`);
}

// README
const readme = read("README.md");
const readmeMatch = readme.match(/## Release[\s\S]*?```text\s*\n([^\n]+)\n```/);
if (!readmeMatch) {
  fail("README.md 的 Release 區塊找不到版本號");
} else if (readmeMatch[1].trim() !== version) {
  fail(`README.md 寫 "${readmeMatch[1].trim()}"，app.js 寫 "${version}"`);
}

// service worker
const sw = read("sw.js");
const cacheMatch = sw.match(/const CACHE_NAME = "([^"]+)"/);
if (!cacheMatch) {
  fail("sw.js 裡找不到 CACHE_NAME");
} else {
  const expectedPrefix = `buzzcalculus-${version}`;
  if (!cacheMatch[1].startsWith(expectedPrefix)) {
    fail(`sw.js 的 CACHE_NAME "${cacheMatch[1]}" 沒有以 "${expectedPrefix}" 開頭`);
  }
  // 快取名跟版本一模一樣的話，同一版內改了資源就不會更新
  if (cacheMatch[1] === expectedPrefix) {
    fail(`CACHE_NAME 應該在版本後面加上日期或標籤，否則同一版內改資源不會讓使用者拿到新檔`);
  }
}

// 4. BUILD 與快取名
const buildMatch = sw.match(/^const BUILD = (\{[^\n]*\});$/m);
let build = null;
if (!buildMatch) fail("sw.js 裡找不到 const BUILD = {…}（tools/build_sw_revisions.js 的產生區）");
else {
  try { build = JSON.parse(buildMatch[1]); } catch (error) { fail(`sw.js 的 BUILD 不是 JSON：${error.message}`); }
}
const dateMatch = appSource.match(/const BUILD_DATE = "([^"]+)"/);
if (build) {
  if (build.version !== version) fail(`sw.js 的 BUILD.version "${build.version}" ≠ APP_VERSION "${version}"`);
  if (!dateMatch || build.date !== dateMatch[1]) fail(`sw.js 的 BUILD.date "${build.date}" ≠ BUILD_DATE "${dateMatch && dateMatch[1]}"`);
  if (!/^[0-9a-f]{8}$/.test(build.id || "")) fail(`BUILD.id "${build.id}" 不是 8 碼 hex`);
  if (cacheMatch && cacheMatch[1] !== `buzzcalculus-${build.version}-${build.id}`) fail(`CACHE_NAME "${cacheMatch[1]}" 不是 buzzcalculus-${build.version}-${build.id}`);
  try {
    const want = require("./build_sw_revisions.js").tables().build;
    if (want.id !== build.id) fail(`BUILD.id ${build.id} 跟 REVISIONS 重算的 ${want.id} 不同：跑 node tools/build_sw_revisions.js`);
  } catch (error) { fail(`重算 BUILD 失敗：${error.message}`); }
}
// 5. 部署會蓋章
const vercel = JSON.parse(read("vercel.json"));
if (!/^node tools\/stamp_build\.js && /.test(vercel.buildCommand || "")) fail(`vercel.json 的 buildCommand 沒有先跑 node tools/stamp_build.js（${vercel.buildCommand}）`);
if (!/node tools\/stamp_build\.js[\s\S]*cp index\.html/.test(read(".github/workflows/static.yml"))) fail("static.yml 的 Assemble site 沒有先跑 node tools/stamp_build.js");
// 6. 版本從 Service Worker 問
if (!/type === "VERSION"[\s\S]{0,160}postMessage\(\{ build: BUILD \}\)/.test(sw)) fail("sw.js 沒有回應 VERSION 訊息（設定頁問不到這一版是哪一版）");
const updater = read("src/kernel/app_update.js");
if (!/type: "VERSION"/.test(updater) || !/registration\.waiting/.test(updater) || !/s\.controller/.test(updater)) fail("app_update.js 沒有向 controller 與 waiting 問版本");
// 設定頁的畫面在 settings_page.js（2026-10-15 從 app.js 搬出去）
if (!/BuzzAppUpdate\.panel\(\)/.test(read("src/settings_page.js"))) fail("設定頁沒有畫版本列（BuzzAppUpdate.panel()）");
if (!/data-lazy="pwa" src="src\/kernel\/app_update\.js"/.test(read("index.html"))) fail("index.html 沒有 data-lazy=\"pwa\" 的 app_update.js");

console.log("版本號");
console.log(`  app.js    ${version}`);
console.log(`  README    ${readmeMatch ? readmeMatch[1].trim() : "(找不到)"}`);
console.log(`  sw.js     ${cacheMatch ? cacheMatch[1] : "(找不到)"}`);
console.log(`  BUILD     ${build ? `${build.version} · ${build.id} · ${build.date}` : "(找不到)"}`);

if (failures.length) {
  console.error("");
  console.error(`版本號驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("version OK");
