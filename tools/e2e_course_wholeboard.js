// 一課一塊黑板（course_board.js 的 WHOLE、預設開）在真的 Chrome 裡走一次：桌機 1280×800、手機 390×844。
//
// 斷言都是看得到、點得到的東西：
//   整課同一塊板（換節不換板、前一節寫的還在板上）；桌機板子比本文欄寬、分成兩欄；
//   一節講完，小測寫在板上：題目寫完選項才點得到；點錯的那一個劃紅線、下面出理由、不能再點；點對的圈起來、「對了」、+XP、板上沒有可點的選項；
//   點黑板上的選項之外（板子空白處）不會跳節；設定 boardSplit 回到一節一塊；手機不溢出、板子不比畫面寬；console 沒有錯誤。
//
// 用法：node tools/e2e_course_wholeboard.js

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false };
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const BOX = { window: {} };
require("vm").runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), BOX);
const ORDER = BOX.window.BUZZ_COURSE_V2.stages.flatMap((st) => st.chapters.flatMap((ch) => ch.lessons.map((l) => l.id)));
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
// 樣本：第 1 節有黑板、結尾是小測（板上出題的那一種），而且有第 2 節
const onBoard = (s) => s.check !== undefined && !s.drag && !s.solve && !s.order && !s.where && s.beats.some((b) => b.board);
const L = ORDER.map(lessonOf).find((l) => l.sections.length >= 2 && onBoard(l.sections[0]) && l.sections[1].beats.some((b) => b.board));
const CHECK = L.checks[L.sections[0].check];
// 有圖的節：句子帶 fig、沒有拖圖、沒有自己算，至少三句；不挑第一節（量的是換到那一節以後）
const FIG = ORDER.map(lessonOf).flatMap((l) => l.sections.map((s, si) => ({ l, s, si }))).find(({ s, si }) => si > 0 && !s.drag && !s.solve && s.beats.length >= 3 && s.beats.some((b) => b.fig));
const RIGHT = CHECK.options.findIndex((o) => o.correct);
const WRONG = CHECK.options.findIndex((o) => !o.correct);
const SEED = { tours: { home: 1, quiz: 1 }, settings: { showAllFeatures: true }, onboardingSeen: true, onboardingContext: "hs", onboardingLevel: "newbie", backupNoticeSeen: true };

let passed = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) { passed += 1; console.log(`  ok   ${name}`); return; }
  failures.push(name);
  ciFail(name, detail);
  console.log(`  XX   ${name}${detail ? `  —— ${detail}` : ""}`);
}

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (s) => chrome.evaluate(s);
  const sleep = (ms) => chrome.sleep(ms);
  const SLOWER = process.env.BUZZ_E2E_SLOW ? 3 : 1;
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms * SLOWER; Date.now() < deadline; await sleep(60)) if (await evaluate(`return Boolean(${expr});`)) return true;
    return false;
  };
  const errors = [];
  chrome.on("Runtime.exceptionThrown", (p) => errors.push((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
  chrome.on("Runtime.consoleAPICalled", (p) => { if (p.type === "error") errors.push(p.args.map((a) => a.value || a.description || "").join(" ")); });
  // 真的滑鼠點：點在元素中間（先捲進畫面）
  const click = async (expr) => {
    const p = await evaluate(`const el = ${expr}; if (!el) return null; const r0 = el.getBoundingClientRect(); if (r0.top < 0 || r0.bottom > innerHeight - 120) el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };`);
    if (!p) return false;
    await chrome.send("Input.dispatchMouseEvent", { type: "mousePressed", x: p.x, y: p.y, button: "left", clickCount: 1 });
    await chrome.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: p.x, y: p.y, button: "left", clickCount: 1 });
    await sleep(250);
    return true;
  };
  const opt = (i) => `document.querySelector('.cvb .cvb-opt[data-opt="${i}"]')`;
  const boot = async (size, records, id = L.id) => {
    await chrome.send("Emulation.setDeviceMetricsOverride", size);
    await chrome.navigate(`${server.url}/index.html`);
    // 這支量的是黑板（2026-10-21 起預設是筆記本、黑板是 ?blackboard 的秘密功能）；筆記本由 tmp/solve_board.js 等量
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.notebook", "0"); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(records))}); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app")`, 30000);
    await evaluate(`const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = ${JSON.stringify(id)}; document.querySelector("#app").appendChild(b); b.click(); return 1;`);
    return waitFor(`document.querySelector("[data-cv2s] .cvb") && window.BuzzBoard && window.BuzzBoard.state()`, 15000);
  };
  const state = () => evaluate(`return window.BuzzBoard.state();`);
  // 點完第 1 節的句子（等每一句寫完再點下一句）
  const finishSection = async () => {
    for (let k = 0; k < 30; k += 1) {
      await waitFor(`window.BuzzBoard.state() && window.BuzzBoard.state().p >= 1`, 6000);
      const label = await evaluate(`const n = document.querySelector("[data-cv2s-next]"); return n ? n.innerText : "";`);
      if (!/下一句/.test(label)) return true;
      await evaluate(`document.querySelector("[data-cv2s-next]").click(); return 1;`);
      await sleep(200);
    }
    return false;
  };

  try {
    console.log(`  ·    樣本課：${L.id}（第 1 節的小測 ${CHECK.options.length} 個選項）`);
    check(`打開 ${L.id}`, await boot(DESKTOP, SEED));
    const s0 = await state();
    check("整課一塊：板子的 key 是整課（…:all）", /:all$/.test(s0.key), JSON.stringify(s0));
    const geo = await evaluate(`const b = document.querySelector(".cvb").getBoundingClientRect(); const t = document.querySelector(".cv2-lesson").getBoundingClientRect(); return { board: Math.round(b.width), text: Math.round(t.width), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };`);
    check("桌機：板子比本文欄寬、頁面不橫向溢出", geo.board > geo.text + 100 && geo.overflow <= 0, JSON.stringify(geo));
    await evaluate(`window.__board = document.querySelector(".cvb"); return 1;`);

    check("第 1 節的句子都點完", await finishSection());
    check("題目與選項寫在板上（每一個選項一行）", await waitFor(`document.querySelectorAll(".cvb .cvb-opt").length >= ${CHECK.options.length}`, 3000));
    check("題目寫完選項才點得到", await waitFor(`document.querySelectorAll(".cvb .cvb-opt[data-action]").length === ${CHECK.options.length}`, 15000));
    const vis = await evaluate(`const el = ${opt(RIGHT)}; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { op: getComputedStyle(el).opacity, mine: Boolean(h && el.contains(h) || h === el) };`);
    check("選項在板上看得到、點得到", vis.mine && Number(vis.op || 1) > 0.5, JSON.stringify(vis));
    // 板子底下什麼都不放（只剩旁白播放列）：article 裡、板子舞台以外，看得到的東西一個都沒有
    const below = await evaluate(`const st = document.querySelector(".cvb-whole .cvb-stage"); const sb = st.getBoundingClientRect().bottom;
      return [...document.querySelectorAll(".cvb-whole *")].filter((n) => !st.contains(n) && !n.closest(".cv2s-beats, .cv2s-bar, .cv2s-cue") && n.getClientRects().length && getComputedStyle(n).visibility !== "hidden").map((n) => [n, n.getBoundingClientRect()]).filter(([, r]) => r.width > 2 && r.height > 2 && r.top >= sb - 1).map(([n]) => n.className || n.tagName).slice(0, 5);`);
    check("板子底下什麼都沒有（看得到的）", below.length === 0, JSON.stringify(below));

    // 點板子空白處：不跳節
    const si0 = await evaluate(`return Number(document.querySelector("[data-cv2s]").dataset.cv2s);`);
    await click(`(() => { const b = document.querySelector(".cvb"); const r = b.getBoundingClientRect(); return { getBoundingClientRect: () => ({ left: r.left + 10, top: r.bottom - 30, width: 2, height: 2 }), scrollIntoView() {} }; })()`);
    check("點板子空白處不會跳到下一節", (await evaluate(`return Number(document.querySelector("[data-cv2s]").dataset.cv2s);`)) === si0);

    check("點錯的選項（真的滑鼠點在板上）", await click(opt(WRONG)));
    await waitFor(`${opt(WRONG)} && ${opt(WRONG)}.classList.contains("cvb-no")`, 3000);
    const w = await evaluate(`const el = ${opt(WRONG)}; return { no: el.classList.contains("cvb-no"), live: Boolean(el.dataset.action), why: [...document.querySelectorAll(".cvb-onboard .course-check-why")].map((p) => p.innerText).join(" | "), others: document.querySelectorAll(".cvb .cvb-opt[data-action]").length };`);
    check("選錯：那一行劃紅線、不能再點、下面出理由、其他選項還能點", w.no && !w.live && w.why.length > 4 && w.others === CHECK.options.length - 1, JSON.stringify(w));

    const xp0 = await evaluate(`try { return JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}").xp || 0; } catch (e) { return 0; }`);
    check("點對的選項", await click(opt(RIGHT)));
    await waitFor(`${opt(RIGHT)} && ${opt(RIGHT)}.classList.contains("cvb-yes")`, 3000);
    const r = await evaluate(`return { yes: ${opt(RIGHT)}.classList.contains("cvb-yes"), live: document.querySelectorAll(".cvb .cvb-opt[data-action]").length, ok: /對了/.test((document.querySelector(".cvb-onboard") || {}).innerText || ""), hint: Boolean(document.querySelector(".cvb-onboard .cvb-hint")), xp: (() => { try { return JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}").xp || 0; } catch (e) { return 0; } })() };`);
    check("選對：正解圈起來、「對了」疊在板子底部、板上沒有可點的選項", r.yes && r.live === 0 && r.ok, JSON.stringify(r));
    check("選對：XP 加了", r.xp > xp0, `${xp0} → ${r.xp}`);

    // 下一節：同一塊板、前一節（含小測）還在板上
    const before = await evaluate(`return [...document.querySelectorAll(".cvb .cvb-i")].filter((n) => n.style.visibility === "visible").length;`);
    check("節做完：板上出現「點黑板 → 下一節」", await waitFor(`/點黑板/.test((document.querySelector(".cvb-stage .cvb-next") || {}).textContent || "")`, 3000));
    // 沒有「下一節」按鈕：真的用滑鼠點黑板空白處換節
    await click(`(() => { const b = document.querySelector(".cvb"); const r = b.getBoundingClientRect(); return { getBoundingClientRect: () => ({ left: r.left + 10, top: r.top + 10, width: 2, height: 2 }), scrollIntoView() {} }; })()`);
    check("點黑板換到下一節", await waitFor(`Number(document.querySelector("[data-cv2s]").dataset.cv2s) === 1`, 5000));
    await sleep(500);
    const s1 = await evaluate(`return { same: document.querySelector(".cvb") === window.__board, key: window.BuzzBoard.state().key, kept: [...document.querySelectorAll(".cvb .cvb-i")].filter((n) => n.style.visibility === "visible").length, circled: Boolean(document.querySelector(".cvb .cvb-yes")) };`);
    check("換節不換板：同一塊板、第 1 節寫的（含答過的小測）還在", s1.same && /:all$/.test(s1.key) && s1.kept >= before && s1.circled, JSON.stringify({ ...s1, before }));

    // 有圖的節：圖釘在板上保留的那一塊（不在板子上面）、不蓋到板上的字、點「下一句」頁面不動
    console.log(`  ·    有圖的節：${FIG.l.id} 第 ${FIG.si + 1} 節`);
    check("有圖的課：打開", await boot(DESKTOP, SEED, FIG.l.id));
    await evaluate(`document.querySelector('[data-action="course-s-go"][data-to="${FIG.si}"]').click(); return 1;`);
    check("有圖的節：圖在板上那一塊裡", await waitFor(`Number(document.querySelector("[data-cv2s]").dataset.cv2s) === ${FIG.si} && document.querySelector(".cvb-stage .cvb-model .cv2-figure")`, 8000));
    await sleep(600);
    const ys = [];
    // 量句子之間（最後一句出來時下面多了題目／動作，往下帶一次是故意的，不算）
    for (let k = 0; k < FIG.s.beats.length - 1; k += 1) {
      await waitFor(`window.BuzzBoard.state() && window.BuzzBoard.state().p >= 1`, 6000);
      await sleep(400);
      ys.push(await evaluate(`return Math.round(scrollY);`));
      if (k < FIG.s.beats.length - 2) await evaluate(`document.querySelector("[data-cv2s-next]").click(); return 1;`);
    }
    const fg = await evaluate(`const m = document.querySelector(".cvb-model").getBoundingClientRect(); const b = document.querySelector(".cvb").getBoundingClientRect();
      const over = [...document.querySelectorAll(".cvb .cvb-i")].filter((n) => n.style.visibility === "visible" && Number(n.style.opacity || 1) > 0.05).map((n) => n.getBoundingClientRect()).filter((r) => r.bottom > b.top && r.top < b.bottom && r.right > m.left + 10 && r.left < m.right - 10 && r.bottom > m.top + 10 && r.top < m.bottom - 10).length;
      return { inside: m.left >= b.left - 1 && m.right <= b.right + 8 && m.top >= b.top - 1 && m.bottom <= b.bottom + 1, above: Boolean(document.querySelector(".cv2s-sec > .cv2-figure")), over };`);
    check("圖在板子的框裡、板子上面沒有圖、圖沒有蓋到板上的字", fg.inside && !fg.above && fg.over === 0, JSON.stringify(fg));
    check("有圖的節點「下一句」：頁面不上下動（≤ 2px）", Math.max(...ys) - Math.min(...ys) <= 2, ys.join(" → "));

    // 設定 boardSplit：回到一節一塊
    check("boardSplit：重開", await boot(DESKTOP, { ...SEED, settings: { ...SEED.settings, boardSplit: true } }));
    const sp = await state();
    check("boardSplit：一節一塊（key 是節）、板上沒有選項", /:0$/.test(sp.key) && !(await evaluate(`return Boolean(document.querySelector(".cvb .cvb-opt"));`)), JSON.stringify(sp));

    // 手機
    check("手機：打開", await boot(PHONE, SEED));
    await finishSection();
    await waitFor(`document.querySelectorAll(".cvb .cvb-opt[data-action]").length === ${CHECK.options.length}`, 15000);
    const ph = await evaluate(`const b = document.querySelector(".cvb").getBoundingClientRect(); const o = [...document.querySelectorAll(".cvb .cvb-opt")].map((n) => n.getBoundingClientRect()); return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, board: [Math.round(b.left), Math.round(b.right)], iw: innerWidth, opts: o.every((q) => q.left >= b.left - 1 && q.right <= b.right + 1) };`);
    check("手機：不溢出、板子在畫面裡、選項不超出板子", ph.overflow <= 0 && ph.board[0] >= 0 && ph.board[1] <= ph.iw && ph.opts, JSON.stringify(ph));

    check("console 沒有錯誤", errors.length === 0, errors.slice(0, 3).join(" | "));
  } finally {
    await chrome.close();
    await server.close?.();
  }
  console.log(`\n一課一塊黑板 E2E：${passed} 過、${failures.length} 失敗`);
  if (failures.length) process.exitCode = 1;
}

run().then(() => process.exit(process.exitCode || 0), (e) => { console.error(e); process.exit(1); });
