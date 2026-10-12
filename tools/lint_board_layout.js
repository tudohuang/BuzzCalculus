// 黑板的版面 lint：每一課有黑板的節、每一步（動作做完的那一刻）、四種寬度（360／390／430 手機、1280 桌機）× 淺色／深色，
// 在真的 Chrome 裡量：不能疊、不能出板、字不能太小、對比要夠、板不能太高。規則在 tools/lib/board_lint.js。
//
// Chrome 很吃記憶體：整台機器同一時間只跑一顆（tools/lib/chrome_lock.js，鎖檔在系統暫存資料夾；拿著的程序不在了會自己收回）。
//
// 用法：node tools/lint_board_layout.js                       全部有黑板的課
//       node tools/lint_board_layout.js chain-rule ftc-part1   只跑這幾課（寫課的 agent 一課一課跑）
//       --viewports 390,360   只跑這幾種寬度      --themes dark   只跑一種主題
//       --shots <資料夾>       每一句畫完的黑板截一張（390 與 1280）給人看
// 先跑 node tools/build_course_v2.js（畫面讀的是 src/course_v2/ 產生的課文）。
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");
const { acquire } = require("./lib/chrome_lock.js");
const { lintLessons, VIEWPORTS } = require("./lib/board_lint.js");

const ROOT = path.join(__dirname, "..");
const LESSONS = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const argv = process.argv.slice(2);
const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const flags = new Set(["--viewports", "--themes", "--shots"]);
const ids = argv.filter((a, i) => !a.startsWith("--") && !flags.has(argv[i - 1]));

async function main() {
  const all = fs.readdirSync(LESSONS).filter((n) => n.endsWith(".json")).map((n) => JSON.parse(fs.readFileSync(path.join(LESSONS, n), "utf8")));
  const boarded = all.filter((L) => (L.sections || []).some((s) => s.beats.some((b) => b.board)));
  const pick = ids.length ? ids.map((id) => all.find((L) => L.id === id) || id) : boarded;
  const missing = pick.filter((L) => typeof L === "string");
  if (missing.length) { console.error(`沒有這幾課：${missing.join("、")}`); process.exit(1); }
  const lessons = pick.filter((L) => (L.sections || []).some((s) => s.beats.some((b) => b.board)));
  if (!lessons.length) { console.log("黑板 lint：沒有黑板的課，略過"); return; }
  const vps = opt("--viewports") ? VIEWPORTS.filter((v) => opt("--viewports").split(",").includes(v.name)) : VIEWPORTS;
  const themes = opt("--themes") ? opt("--themes").split(",") : ["light", "dark"];
  const shots = opt("--shots") ? path.resolve(opt("--shots")) : "";
  console.log(`黑板 lint：${lessons.map((L) => L.id).join("、")}（${vps.map((v) => v.name).join("／")} × ${themes.join("／")}）`);
  const release = await acquire(`lint_board_layout ${lessons.map((L) => L.id).join(",").slice(0, 60)}`);
  const server = await staticServer.start(ROOT, 0);
  let chrome = null;
  let out;
  try {
    chrome = await launch();
    const t0 = Date.now();
    out = await lintLessons(chrome, server.url, lessons, { viewports: vps, themes, shots, log: (m) => console.log(m) });
    console.log(`  量了 ${out.states} 個狀態，${((Date.now() - t0) / 1000).toFixed(0)} 秒`);
  } finally {
    if (chrome) await chrome.close();
    await server.stop();
    release();
  }
  if (out.problems.length) {
    out.problems.slice(0, 80).forEach((p) => console.error(`  XX ${p}`));
    if (out.problems.length > 80) console.error(`  …另有 ${out.problems.length - 80} 個`);
    console.error(`黑板 lint：${out.problems.length} 個問題`);
    process.exit(1);
  }
  console.log("黑板 lint OK：沒有疊、沒有出板、字夠大、對比夠");
}

main().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
