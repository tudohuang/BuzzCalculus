// 在 CI 上跑一串驗證器，哪一支紅就把它的名字與最後幾行輸出印成 GitHub annotation。
//
// 為什麼：workflow 原本把 30 支驗證器塞在同一個 run 區塊，任何一支失敗 Actions 只會說
// 「Process completed with exit code 1」；job log 要認證才抓得到，而 check-run 的
// annotations 走公開 API 就讀得到（tools/lib/cdp.js 的 ciFail 也是同一招）。
// 本機照舊可以一支一支跑；這支只是 CI 的殼。
//
// 用法：node tools/ci_checks.js "regen_all.js --check" validate_problems.js …
//       每個參數是 tools/ 底下的腳本（可帶參數），依序執行，全部跑完才決定成敗。

"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const failures = [];
const annotate = (title, detail) => {
  if (!process.env.GITHUB_ACTIONS) return;
  const clean = (text) => String(text || "").replace(/\r?\n/g, " ").replace(/%/g, "%25").slice(0, 900);
  console.log(`::error title=${clean(title).replace(/,/g, "%2C").replace(/:/g, "%3A")}::${clean(detail)}`);
};

for (const spec of process.argv.slice(2)) {
  const [script, ...args] = spec.split(/\s+/).filter(Boolean);
  const started = Date.now();
  const result = spawnSync(process.execPath, [path.join(__dirname, script), ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if (result.status === 0) {
    console.log(`ok   ${spec}  (${seconds}s)`);
    continue;
  }
  const tail = output.trim().split("\n").slice(-6).join("\n");
  console.log(`FAIL ${spec}  (${seconds}s)\n${output.trim()}\n`);
  failures.push(spec);
  annotate(`驗證器紅了：${spec}`, tail);
}

if (failures.length) {
  console.error(`\n${failures.length} 支驗證器失敗：${failures.join(", ")}`);
  process.exit(1);
}
console.log(`\n${process.argv.length - 2} 支驗證器全過`);
