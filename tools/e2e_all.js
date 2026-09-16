// 一次跑所有 E2E，幾支同時跑。
//
// 九支 E2E 各開一顆 Chrome、一支接一支跑要十幾分鐘；它們彼此獨立（各自的埠、各自的
// 暫存 profile、各自的 static server），本機多核就該同時跑——總時間變成最慢那支的長度。
// CI 維持一支一支（runner 只有兩核，並行只會互相拖慢、把時間類的斷言弄花）。
//
// 用法：node tools/e2e_all.js                 全部，並行數 = min(4, 核心數-1)
//       node tools/e2e_all.js -j 2            並行 2
//       node tools/e2e_all.js mobile beginner 只跑名字含這些字的

"use strict";

const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");

const args = process.argv.slice(2);
let jobs = Math.max(1, Math.min(4, os.cpus().length - 1));
const filters = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "-j") { jobs = Math.max(1, Number(args[i + 1]) || jobs); i += 1; } else filters.push(args[i]);
}

const dir = __dirname;
const suites = fs.readdirSync(dir)
  .filter((name) => /^e2e_.*\.js$/.test(name) && name !== "e2e_all.js")
  .filter((name) => !filters.length || filters.some((f) => name.includes(f)))
  .sort();
if (!suites.length) { console.error("沒有符合的 E2E"); process.exit(1); }

// 最慢的先排，尾巴才不會只剩一支在跑
const weight = { e2e_handwriting: 5, e2e_responsive_workspace: 5, e2e_mobile: 4, e2e_beginner: 4, e2e_main_flow: 3, e2e_proof_lang: 3 };
suites.sort((a, b) => (weight[b.replace(".js", "")] || 1) - (weight[a.replace(".js", "")] || 1));

const summaryLine = (output) => {
  const lines = output.trim().split("\n").filter(Boolean);
  const hit = [...lines].reverse().find((line) => /通過|passed|checked|失敗|FAIL|Error/.test(line));
  return (hit || lines[lines.length - 1] || "").trim().slice(0, 140);
};

const results = [];
const startedAll = Date.now();
let index = 0;
let running = 0;

// 啟動錯開 2.5 秒：四顆 Chrome 同時冷啟動會讓第一頁的 render 等超過 15 秒（初學者那支實測掛在 17 秒）
let lastLaunch = 0;
function next() {
  while (running < jobs && index < suites.length) {
    const wait = Math.max(0, lastLaunch + 2500 - Date.now());
    if (wait) { setTimeout(next, wait); return; }
    lastLaunch = Date.now();
    const name = suites[index];
    index += 1;
    running += 1;
    const started = Date.now();
    let output = "";
    const child = spawn(process.execPath, [path.join(dir, name)], { env: { ...process.env, CI: process.env.CI || "1" } });
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("close", (code) => {
      running -= 1;
      const seconds = Math.round((Date.now() - started) / 1000);
      const failed = code !== 0;
      results.push({ name, failed, seconds, summary: summaryLine(output), output });
      console.log(`${failed ? "FAIL" : "ok  "} ${name.padEnd(30)} ${String(seconds).padStart(4)}s  ${summaryLine(output)}`);
      if (results.length === suites.length) finish();
      else next();
    });
  }
}

function finish() {
  const failed = results.filter((r) => r.failed);
  console.log(`\n${suites.length} 支 E2E，並行 ${jobs}，共 ${Math.round((Date.now() - startedAll) / 1000)}s；失敗 ${failed.length}`);
  failed.forEach((r) => {
    console.log(`\n── ${r.name} ──`);
    console.log(r.output.split("\n").filter((line) => /XX|FAIL|Error|失敗|AssertionError/.test(line)).slice(0, 12).join("\n"));
  });
  process.exit(failed.length ? 1 : 0);
}

console.log(`E2E × ${suites.length}（並行 ${jobs}）`);
next();
