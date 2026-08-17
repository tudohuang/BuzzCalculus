// 配發永久題號 uid，產生 src/kernel/uid_map.js
//
// 為什麼 id 不夠用：id 是 "td-int-005" 這種帶分類語意的字串。題目改分類、
// 從一個包搬到另一個包、或是題號重編，id 就會變。但分享碼、班級作業、
// 使用者回報、跨科連結全都會把那串字存下來 —— id 一變，那些連結就死了。
//
// uid 是純序號，配了就不再變動，也永不重用（題目下架後號碼也不回收，
// 否則舊連結會指到一題完全不同的東西，那比連結失效更糟）。
//
// 用法：node tools/assign_uids.js          只補沒有 uid 的題
//       node tools/assign_uids.js --check  不寫檔，只回報有幾題還沒有 uid

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");

const OUTPUT = path.join(__dirname, "..", "src", "kernel", "uid_map.js");
const PREFIX = "bz-c-";
const checkOnly = process.argv.includes("--check");

loadAppApi();
const problems = loadAppApi.allProblems();

// 既有配發不可更動：先讀回來
let existing = {};
if (fs.existsSync(OUTPUT)) {
  existing = require(OUTPUT);
}

const assigned = { ...existing };
const usedNumbers = new Set(
  Object.values(existing).map((uid) => Number(String(uid).replace(PREFIX, "")))
);
let nextNumber = usedNumbers.size ? Math.max(...usedNumbers) + 1 : 1;

const fresh = [];
problems.forEach((problem) => {
  if (assigned[problem.id]) return;
  const uid = PREFIX + String(nextNumber).padStart(6, "0");
  assigned[problem.id] = uid;
  usedNumbers.add(nextNumber);
  nextNumber += 1;
  fresh.push(problem.id);
});

// 題目下架後號碼不回收，但要留下記錄，免得以後有人「發現一個沒用到的 uid」
// 就想拿去重用
const retired = Object.keys(existing).filter(
  (id) => !problems.some((problem) => problem.id === id)
);

if (checkOnly) {
  console.log(`題數 ${problems.length}，已配發 ${Object.keys(existing).length}，待配發 ${fresh.length}`);
  if (retired.length) console.log(`已下架但保留號碼：${retired.length} 個`);
  process.exit(fresh.length ? 1 : 0);
}

const lines = Object.keys(assigned)
  .sort()
  .map((id) => `    ${JSON.stringify(id)}: ${JSON.stringify(assigned[id])}`);

const body = `// 自動產生 —— 不要手改。來源：tools/assign_uids.js
//
// id ↔ uid 的永久對照表。id 帶分類語意（"td-int-005"），會隨改版變動；
// uid 是純序號，配了就凍結。公開會露出去的東西一律用 uid：
// 分享碼、匯出 JSON、題目回報短碼、以後的跨科連結。
//
// 已配發的項目**永遠不能改也不能刪**。題目下架時保留該筆對應即可，
// 號碼不回收 —— 回收的話舊連結會指到一題完全不同的題目，比連結失效更糟。
//
// 重新產生（只會補新題，不會動既有配發）：node tools/assign_uids.js

(function () {
  "use strict";

  const UID_MAP = {
${lines.join(",\n")}
  };

  const ID_BY_UID = {};
  Object.keys(UID_MAP).forEach((id) => { ID_BY_UID[UID_MAP[id]] = id; });

  const API = {
    version: 1,
    map: UID_MAP,
    uidFor: (id) => UID_MAP[id] || null,
    idFor: (uid) => ID_BY_UID[uid] || null,
    // 給 UI 用的短碼：bz-c-000417 → #417
    shortCode: (uid) => (uid ? "#" + String(Number(String(uid).replace(/^bz-c-/, ""))) : "")
  };

  if (typeof module !== "undefined" && module.exports) module.exports = UID_MAP;
  if (typeof window !== "undefined") {
    window.BUZZ_UID_MAP = UID_MAP;
    window.BuzzUid = API;
  }
})();
`;

fs.writeFileSync(OUTPUT, body, "utf8");
console.log(`uid_map.js 寫出 ${Object.keys(assigned).length} 筆`);
console.log(`  新配發  ${fresh.length}`);
console.log(`  已下架但保留號碼  ${retired.length}`);
if (fresh.length && fresh.length < 12) console.log(`  ${fresh.join(", ")}`);
