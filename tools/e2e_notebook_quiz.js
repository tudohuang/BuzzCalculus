// 筆記本（預設的一課一塊、紙本樣式）裡的題目都寫在紙上 —— 不在紙下面。
//
// 2026-10-23 使用者：「排證明順序的問題會在課程的筆記紙下面，我希望都在紙上」。
// 抓到兩件事：排順序從來沒寫上板；自己沒寫板的節（只有旁白的「試一題」：小測 242、先猜 59、排順序 67 節）
// 題目整個不上板 —— 小測的選項在板下又被藏起來（給螢幕閱讀器的那一份），等於看不到。
// 其他課程 E2E 都開 boardSplit 或關筆記本量單節引擎，預設這一條路沒人走，所以另外一支。
//
// 用法：node tools/e2e_notebook_quiz.js

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SEED = { tours: { home: 1, quiz: 1 }, settings: { showAllFeatures: true }, onboardingSeen: true, onboardingContext: "hs", onboardingLevel: "standard", backupNoticeSeen: true, totalAnswered: 50 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lesson = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, "tools/content/course_v2/lessons", `${id}.json`), "utf8"));

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}${detail ? `  —— ${detail}` : ""}`);
  } else {
    failures.push(`${name}${detail ? `（${detail}）` : ""}`);
    ciFail(name, detail);
    console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`);
  }
}

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (c) => chrome.evaluate(c);
  const mouse = (type, x, y) => chrome.send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1 });
  // 點板上的那一行（真的滑鼠事件，點在字上）
  const tapLine = async (sel) => {
    const p = await ev(`const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + Math.min(40, r.width / 2), y: r.top + r.height / 2 };`);
    if (!p) return false;
    await mouse("mousePressed", p.x, p.y);
    await mouse("mouseReleased", p.x, p.y);
    await sleep(450);
    return true;
  };
  const send = (data) => ev(`const b = document.createElement("button"); Object.assign(b.dataset, ${JSON.stringify(data)}); document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1;`);
  const waitFor = async (expr, ms = 30000) => { for (let t = 0; t < ms; t += 250) { if (await ev(`return Boolean(${expr});`)) return true; await sleep(250); } return false; };
  const openAt = async (id, si) => {
    await send({ action: "open-course-lesson", lessonId: id });
    await waitFor(`document.querySelector("[data-cv2s] .cvb")`);
    await sleep(800);
    await send({ action: "course-s-go", to: String(si) });
  };
  try {
    for (const W of [1280, 390]) {
      const tag = W < 500 ? "手機" : "桌機";
      await chrome.send("Emulation.setDeviceMetricsOverride", { width: W, height: 860, deviceScaleFactor: 1, mobile: W < 500 });
      await chrome.navigate(`${server.url}/index.html`);
      await ev(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(SEED))}); return 1;`);
      await chrome.navigate(`${server.url}/index.html`);
      await sleep(2000);

      // 排順序（這一節自己沒寫板）
      const A = "antiderivative";
      const si = lesson(A).sections.findIndex((s) => s.order);
      const n = lesson(A).sections[si].order.steps.length;
      await openAt(A, si);
      const onPaper = await waitFor(`document.querySelectorAll('.cvb [data-action="course-s-ord"]').length`);
      check(`${tag}：排順序的步驟寫在紙上、點得到`, onPaper);
      const below = await ev(`const b = document.querySelector(".cv2p-left"); return b ? Math.round(b.getBoundingClientRect().width) : -1;`);
      check(`${tag}：紙下面沒有另一份看得到的步驟按鈕`, below <= 1, `寬 ${below}`);
      const title = String(lesson(A).sections[si].title || "").replace(/[{}$]/g, "");
      const head = await ev(`return document.querySelector(".cvb").textContent.replace(/\\s+/g, "").includes(${JSON.stringify(`${si + 1}.${title}`.replace(/\s+/g, ""))});`);
      check(`${tag}：沒寫板的節，紙上照樣寫節名`, head, title);
      const seen = await ev(`return [...new Set([...document.querySelectorAll('.cvb [data-action="course-s-ord"]')].map((e) => Number(e.dataset.step)))];`);
      check(`${tag}：紙上 ${n} 步都在、洗過（不是排好的）`, seen.length === n && seen.join() !== [...Array(n).keys()].join(), seen.join());
      await tapLine(`.cvb [data-action="course-s-ord"][data-step="${seen.find((j) => j !== 0)}"]`);
      const bad = await ev(`const w = document.querySelector("[data-cv2p-live]"); return { struck: document.querySelectorAll(".cvb .cvb-no").length, why: w ? w.textContent.trim() : "", h: w ? Math.round(w.getBoundingClientRect().height) : 0 };`);
      check(`${tag}：點錯一步 → 紙上劃掉、紙上看得到理由`, bad.struck > 0 && /^還不行/.test(bad.why) && bad.h > 0, JSON.stringify(bad));
      for (let j = 0; j < n; j += 1) await tapLine(`.cvb [data-action="course-s-ord"][data-step="${j}"]`);
      const done = await ev(`return { ord: [...document.querySelectorAll(".cvb .cvb-ord[data-ord]")].map((e) => e.dataset.ord).sort().join(), live: (document.querySelector("[data-cv2p-live]") || {}).textContent || "", left: document.querySelectorAll('.cvb [data-action="course-s-ord"]').length, struck: document.querySelectorAll(".cvb .cvb-no").length };`);
      check(`${tag}：照順序點完 → 每一步行首寫上第幾步、不能再點、劃線收掉`, done.ord === [...Array(n).keys()].map((k) => k + 1).join() && /順序對了/.test(done.live) && !done.left && !done.struck, JSON.stringify(done));

      // 小測（這一節自己沒寫板）
      const C = "absolute-convergence";
      const ci = lesson(C).sections.findIndex((s) => s.check !== undefined && !s.beats.some((b) => b.board));
      await openAt(C, ci);
      const opts = await waitFor(`document.querySelectorAll('.cvb [data-action="course-s-pick"]').length`);
      check(`${tag}：沒寫板的節，小測的選項寫在紙上、點得到`, opts);
    }
    const errors = await ev(`return (window.__buzzErrors || []).length;`);
    check("沒有未捕捉的例外", !errors, errors ? `${errors} 個` : "");
  } finally {
    await chrome.close();
    await server.stop();
  }
  console.log(`\nE2E 筆記本的題目: ${passed}/${passed + failures.length} 通過`);
  if (failures.length) {
    console.error(`失敗 ${failures.length} 項：`);
    failures.forEach((f) => console.error("  " + f));
    process.exit(1);
  }
  console.log("notebook_quiz OK");
}

run().catch((error) => {
  console.error("筆記本題目 E2E 掛掉：" + error.message);
  ciFail("筆記本題目 E2E 掛掉", error.message);
  process.exit(1);
});
