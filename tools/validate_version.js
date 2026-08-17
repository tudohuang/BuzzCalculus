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

console.log("版本號");
console.log(`  app.js    ${version}`);
console.log(`  README    ${readmeMatch ? readmeMatch[1].trim() : "(找不到)"}`);
console.log(`  sw.js     ${cacheMatch ? cacheMatch[1] : "(找不到)"}`);

if (failures.length) {
  console.error("");
  console.error(`版本號驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("version OK");
