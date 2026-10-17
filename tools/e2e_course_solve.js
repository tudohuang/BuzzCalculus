// 課程的「自己算」（sections[].solve，src/course_solve.js）與隔天的課程回溫，在真的 Chrome 裡走一次（手機 390×844、觸控）。
//
// 斷言都是看得到、點得到的東西：
//   自己算：分節結尾是一個輸入框（沒有選項）＋數學鍵盤（觸控：不叫系統鍵盤、鍵 ≥ 40px）；用手指點鍵打字、預覽排好；
//   打錯 → 說錯在哪（作者預料的那一句）、提示出來、輸入框還在、不給 XP；再錯一次 → 解法攤開；打對 → +5 XP 只發一次；
//   第一次就打對 → 「一次就對」；代小測的自己算照樣算進小測（第一次打錯＝第一次選錯）；紀錄 courseV2[課].solve 跟著變；
//   結算畫面「自己算：首次答對 n / m」；題庫題（problemId）的第一次作答進 problemStats。
//   回溫：讀完一課當天首頁沒有回溫卡；隔天（頁面的時鐘往後撥一天）首頁出現「昨天讀的〈課名〉，來回溫 n 題」；
//   點下去一題一屏、全部打字（沒有選項）、題庫題的題幹排好；做完「首次答對 n / m」、重排（不是全對 → 明天再一次）、卡片消失；
//   新手保護期一天 3 題、一般 5 題（整課整課拿）；地圖的「該練」把要回溫的課排最前面、按鈕是「自己算 n 題」。
//   分析：開著 → course_solve {lesson, first_try, review}（分節裡每一題只記第一次）；關掉 → gtag.js 一個請求都沒有。
//   360／390 寬不溢出；console 沒有錯誤。
//
// 用法：node tools/e2e_course_solve.js
//       node tools/e2e_course_solve.js --screenshots   另存截圖到 docs/report/course-review/screens/solve/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "solve") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const NARROW = { width: 360, height: 780, deviceScaleFactor: 2, mobile: true };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
const CHAIN = lessonOf("chain-rule");
const COMPOSE = lessonOf("function-composition");
const USUB = lessonOf("u-sub-basic");
const solveAt = (L) => L.sections.findIndex((s) => s.solve);
const CS = solveAt(CHAIN);
const FS = solveAt(COMPOSE);
const US = solveAt(USUB);
const correctOf = (item) => item.options.findIndex((o) => o.correct);
const DAY = 86400000;

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

const HELPERS = `
  window.__b = {
    visible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && getComputedStyle(el).display !== "none" && getComputedStyle(el).opacity !== "0"; },
    find(sel) { return [...document.querySelectorAll(sel)].find((n) => window.__b.visible(n)) || null; },
    click(sel) { const el = window.__b.find(sel); if (el) { el.scrollIntoView({ block: "center" }); el.click(); } return Boolean(el); },
    act(action, data) { const b = document.createElement("button"); b.dataset.action = action; Object.assign(b.dataset, data || {}); document.querySelector("#app").appendChild(b); b.click(); return 1; },
    text(sel) { const el = window.__b.find(sel); return el ? (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim() : ""; },
    rec() { try { return JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}"); } catch (e) { return {}; } },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    files(re) { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => re.test(n)).length; },
    small(scope) { return [...document.querySelectorAll(scope + " button, " + scope + " input")].filter((n) => window.__b.visible(n) && !n.classList.contains("cv2-link")).map((n) => { const r = n.getBoundingClientRect(); return { side: Math.round(Math.min(r.width, r.height)), label: (n.textContent || n.getAttribute("aria-label") || "").trim().slice(0, 10) }; }).filter((x) => x.side < 40); },
    center(sel) { const el = window.__b.find(sel); if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    // 只量、不捲：等頁面自己的對位捲動停下來用（每次都 scrollIntoView 會把正在滑的頁面拉回來，看起來「停了」其實還在滑）
    at(sel) { const el = window.__b.find(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    events(prefix) { return (window.dataLayer || []).filter((a) => a && a[0] === "event" && String(a[1]).startsWith(prefix)).map((a) => ({ name: a[1], p: a[2] || {} })); }
  };
`;

// 頁面的時鐘往後撥 n 天（Date.now() 與 new Date() 都跟著走；帶參數的 new Date(y, m, d) 不動）
const SHIFT = (n) => `(() => { const D = Date; const shift = ${n * DAY};
  class ShiftedDate extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() + shift); } static now() { return D.now() + shift; } }
  window.Date = ShiftedDate; })();`;

async function run() {
  console.log("E2E 自己算與課程回溫");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  const sleep = (ms) => chrome.sleep(ms);
  const waitFor = async (expr, ms = 8000) => {
    for (const deadline = Date.now() + ms; Date.now() < deadline; await sleep(100)) {
      if (await evaluate(`return Boolean(${expr});`)) return true;
    }
    return false;
  };
  const shot = async (name) => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    await sleep(350);
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(data, "base64"));
  };
  const both = async (name) => {
    if (!SHOTS) return;
    await shot(`${name}-light`);
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    await shot(`${name}-dark`);
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);
  };
  // 真的用手指點（觸控事件 → 合成的 click）
  const tap = async (sel) => {
    // 人是看著鍵點的：頁面還在滑（出完句子時分節會把動作捲進畫面）就等它停，連三次（約 100ms × 3）位置都一樣才點
    let q = await evaluate(`return window.__b.center(${JSON.stringify(sel)});`);
    if (!q) return false;
    for (let k = 0, still = 0; k < 40 && still < 3; k += 1) {
      await sleep(35);
      const r = await evaluate(`return window.__b.at(${JSON.stringify(sel)});`);
      if (!r) return false;
      still = Math.abs(r.y - q.y) < 0.5 && Math.abs(r.x - q.x) < 0.5 ? still + 1 : 0;
      q = r;
    }
    await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: q.x, y: q.y }] });
    await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await sleep(80);
    return true;
  };

  // GA：gtag.js 與送事件的網址一律攔下來回空的（不會真的送出去），順便數有沒有人去抓
  const ga = [];
  chrome.on("Fetch.requestPaused", (p) => {
    ga.push(p.request.url);
    chrome.send("Fetch.fulfillRequest", { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/javascript" }], body: "" }).catch(() => {});
  });
  await chrome.send("Fetch.enable", { patterns: [{ urlPattern: "*googletagmanager.com*", requestStage: "Request" }, { urlPattern: "*google-analytics.com*", requestStage: "Request" }] });

  let clock = null;
  const setDay = async (n) => {
    if (clock) await chrome.send("Page.removeScriptToEvaluateOnNewDocument", { identifier: clock });
    clock = n ? (await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: SHIFT(n) })).identifier : null;
  };
  const boot = async (records) => {
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(200);
    await chrome.navigate(`${server.url}/index.html`);
    if (records) await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(records))}); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app") && document.querySelector("#app").children.length`);
  };
  const reload = async () => {
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(150);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app") && document.querySelector("#app").children.length`);
  };
  const openLesson = async (L) => {
    await evaluate(`window.__b.act("open-course-lesson", { lessonId: ${JSON.stringify(L.id)} }); return 1;`);
    return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(L.title)} && document.querySelector("[data-cv2s] .cv2s-sec")`, 12000);
  };
  const goSection = async (si) => {
    await evaluate(`window.__b.act("course-s-go", { to: "${si}" }); return 1;`);
    return waitFor(`document.querySelector('[data-cv2s="${si}"]')`);
  };
  // 出完這一節的句子（不做動作）
  const revealBeats = async (L) => {
    const si = await evaluate(`return Number(document.querySelector("[data-cv2s]").dataset.cv2s);`);
    const sec = L.sections[si];
    for (let k = 0; k < 2 * sec.beats.length + 2; k += 1) {
      const bi = await evaluate(`const c = document.querySelector('[data-cv2s-act="why"] [data-action="course-s-why"]:not([disabled])'); return c ? Number(c.dataset.beat) : -1;`);
      if (bi >= 0) await evaluate(`window.__b.click('[data-action="course-s-why"][data-beat="${bi}"][data-option="${correctOf(sec.beats[bi].why)}"]'); return 1;`);
      if ((await evaluate(`return document.querySelectorAll("[data-cv2s] .cv2s-beat").length;`)) >= sec.beats.length && !(await evaluate(`return Boolean(document.querySelector('[data-cv2s-act="why"]'));`))) break;
      await evaluate(`window.__b.click("[data-cv2s-next]"); return 1;`);
      await sleep(60);
    }
    return sec;
  };
  // 在這一題的輸入框裡填好答案、按送出（box = data-cs 的值）
  const typeAndSend = async (box, value) => {
    await evaluate(`const i = document.querySelector('[data-cs="${box}"] [data-cs-input]'); i.value = ${JSON.stringify(value)}; i.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
    await evaluate(`window.__b.click('[data-cs="${box}"] [data-cs-send]'); return 1;`);
    await sleep(250);
  };
  // 點完目前這一節：出完句子、做結尾的動作（自己算：打正解）
  const finishSection = async (L) => {
    const sec = await revealBeats(L);
    const si = L.sections.indexOf(sec);
    if (sec.check !== undefined) await evaluate(`window.__b.click('[data-action="course-s-pick"][data-kind="check"][data-option="${correctOf(L.checks[sec.check])}"]'); return 1;`);
    if (sec.predict) await evaluate(`window.__b.click('[data-action="course-s-pick"][data-kind="predict"][data-option="0"]'); return 1;`);
    if (sec.order) for (let j = 0; j < sec.order.steps.length; j += 1) await evaluate(`window.__b.click('[data-action="course-s-ord"][data-step="${j}"]'); return 1;`);
    if (sec.where) await evaluate(`window.__b.click('[data-action="course-s-whr"][data-option="${correctOf({ options: sec.where.steps })}"]'); return 1;`);
    if (sec.solve && !(await evaluate(`return Boolean(document.querySelector('[data-cs="${L.id}:${si}"] [data-cs-input]:disabled'));`))) {
      await waitFor(`document.querySelector('[data-cs="${L.id}:${si}"] [data-cs-input]')`);
      await typeAndSend(`${L.id}:${si}`, sec.solve.answer);
    }
    if (sec.drag) {
      const v = (sec.drag.range[0] + sec.drag.range[1]) / 2;
      await evaluate(`const i = document.querySelector('[data-cv2s] [data-cv2-fig="${sec.drag.use}"] input'); i.value = "${v}"; i.dispatchEvent(new Event("input", { bubbles: true })); i.dispatchEvent(new Event("change", { bubbles: true })); return 1;`);
    }
    await sleep(150);
  };
  const readLesson = async (L, from = 0) => {
    await goSection(from);
    for (let si = from; si < L.sections.length; si += 1) {
      await finishSection(L);
      await evaluate(`window.__b.click("[data-cv2s-next]"); return 1;`);
      await sleep(180);
    }
    return waitFor(`document.querySelector("[data-cv2s-finish] .cv2s-stats")`, 10000);
  };
  const xpNow = () => evaluate(`return Number(window.__b.rec().xp) || 0;`);
  const entry = (id) => evaluate(`return (window.__b.rec().courseV2 || {})[${JSON.stringify(id)}] || {};`);
  const solveEvents = () => evaluate(`return window.__b.events("course_solve");`);

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    const SEED = { onboardingSeen: true, tours: { home: 1, quiz: 1 }, backupNoticeSeen: true };

    /* ── 自己算：打錯兩次、看解法、打對 ── */
    await boot(SEED);
    check("首頁還沒抓 course_solve.js", (await evaluate(`return window.__b.files(/course_solve\\.js/);`)) === 0);
    check(`打開 ${CHAIN.id}`, await openLesson(CHAIN));
    check("打開有自己算的課才抓 course_solve.js（一次）", (await waitFor(`window.BuzzCourseSolve`)) && (await evaluate(`return window.__b.files(/course_solve\\.js/);`)) === 1);
    check(`到第 ${CS + 1} 節（自己算）`, await goSection(CS));
    await revealBeats(CHAIN);
    const BOX = `${CHAIN.id}:${CS}`;
    check("句子都出完：結尾是一個輸入框，沒有選項", await waitFor(`window.__b.find('[data-cs="${BOX}"] [data-cs-input]')`) && !(await evaluate(`return Boolean(document.querySelector('[data-cv2s] .course-option'));`)));
    const ui = await evaluate(`const box = document.querySelector('[data-cs="${BOX}"]'); const i = box.querySelector("[data-cs-input]"); return {
      mode: i.getAttribute("inputmode"), keys: box.querySelectorAll("[data-cs-key]").length, pad: window.__b.visible(box.querySelector("[data-cs-pad]")),
      ask: (box.querySelector(".course-check-ask").innerText || "").replace(/\\s+/g, " ").trim(), math: Boolean(box.querySelector(".course-check-ask .katex")), xp: Boolean(document.querySelector("[data-cv2s] .cv2s-xp")) };`);
    check("觸控：不叫系統鍵盤（inputmode=none）、畫面上有數學鍵盤", ui.mode === "none" && ui.keys >= 20 && ui.pad, JSON.stringify(ui));
    check("問句是那一題小測（KaTeX 排好）", ui.math && ui.ask.length > 2, ui.ask);
    check("自己算：390 寬不溢出、鍵與輸入框 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small('[data-cs="${BOX}"]').length;`)), JSON.stringify(await evaluate(`return window.__b.small('[data-cs="${BOX}"]');`)));
    // 用手指點鍵：2 ( x ^ 3 + 1 )
    for (const key of ["2", "(", "x", "^", "3", "+", "1", ")"]) await tap(`[data-cs="${BOX}"] [data-cs-key="${key}"]`);
    const typed = await evaluate(`const box = document.querySelector('[data-cs="${BOX}"]'); return { v: box.querySelector("[data-cs-input]").value, preview: Boolean(box.querySelector("[data-cs-preview] .katex")), focused: document.activeElement === box.querySelector("[data-cs-input]") };`);
    check("手指點數學鍵盤：打得進去、預覽排好、焦點留在輸入框", typed.v === "2(x^3+1)" && typed.preview && typed.focused, JSON.stringify(typed));
    await evaluate(`window.__b.find('[data-cs="${BOX}"] [data-cs-preview]').scrollIntoView({ block: "center" }); return 1;`);
    await both("solve-input");
    const xp0 = await xpNow();
    await tap(`[data-cs="${BOX}"] [data-cs-send]`);
    await waitFor(`window.__b.find('[data-cs="${BOX}"] [data-cs-msg]')`);
    const wrong1 = await evaluate(`const box = document.querySelector('[data-cs="${BOX}"]'); return { msg: window.__b.text('[data-cs="${BOX}"] [data-cs-msg]'), hint: window.__b.text('[data-cs="${BOX}"] [data-cs-hint]'), input: Boolean(box.querySelector("[data-cs-input]:not([disabled])")), value: box.querySelector("[data-cs-input]").value, steps: Boolean(window.__b.find('[data-cs="${BOX}"] [data-cs-steps]')), reveal: Boolean(window.__b.find('[data-cs="${BOX}"] [data-action="course-s-reveal"]')), xp: Boolean(document.querySelector("[data-cv2s] .cv2s-xp")) };`);
    check("打錯：說錯在哪（作者預料的那一句）", wrong1.msg.includes("只做了外層"), wrong1.msg);
    check("打錯：提示出來、輸入框還在（字留著）、還沒攤開解法、有「看解法」", wrong1.hint.startsWith("提示") && wrong1.input && wrong1.value === "2(x^3+1)" && !wrong1.steps && wrong1.reveal, JSON.stringify(wrong1));
    check("打錯：不給 XP、這一節還沒做完", (await xpNow()) === xp0 && !wrong1.xp && !((await entry(CHAIN.id)).secDone || []).includes(CS));
    check("打錯：紀錄 solve = tried", (await entry(CHAIN.id)).solve && (await entry(CHAIN.id)).solve[CS] === "tried", JSON.stringify((await entry(CHAIN.id)).solve));
    check("打錯：「下一節」還在（不擋路）", Boolean(await evaluate(`return Boolean(window.__b.find("[data-cv2s-next]"));`)));
    let ev = await solveEvents();
    check("分析：course_solve 記一次（first_try: false、review: false）", ev.length === 1 && ev[0].p.lesson === CHAIN.id && ev[0].p.first_try === false && ev[0].p.review === false, JSON.stringify(ev));
    await evaluate(`window.__b.find('[data-cs="${BOX}"] [data-cs-msg]').scrollIntoView({ block: "center" }); return 1;`);
    await both("solve-wrong");
    // 再錯一次：解法攤開
    await typeAndSend(BOX, "6x^2");
    const wrong2 = await evaluate(`return { msg: window.__b.text('[data-cs="${BOX}"] [data-cs-msg]'), steps: document.querySelectorAll('[data-cs="${BOX}"] [data-cs-steps] li').length, answer: Boolean(window.__b.find('[data-cs="${BOX}"] [data-cs-answer] .katex')) };`);
    check("再錯一次：解法自己攤開（步驟＋答案）", wrong2.steps === CHAIN.sections[CS].solve.steps.length && wrong2.answer && wrong2.msg.includes("留原樣"), JSON.stringify(wrong2));
    check("再錯一次：分析不再記（只記第一次作答）", (await solveEvents()).length === 1);
    check("紀錄 solve = shown（看了解法）", (await entry(CHAIN.id)).solve[CS] === "shown");
    await evaluate(`window.__b.find('[data-cs="${BOX}"] [data-cs-steps]').scrollIntoView({ block: "center" }); return 1;`);
    await both("solve-steps");
    // 打對：+5 XP、這一節做完；小測那一題第一次是錯的（-1），正解接在後面
    await typeAndSend(BOX, "2(x^3+1)*3x^2");
    const right = await evaluate(`return { ok: window.__b.text('[data-cs="${BOX}"] .is-right'), disabled: Boolean(document.querySelector('[data-cs="${BOX}"] [data-cs-input]:disabled')), xp: window.__b.text("[data-cv2s] .cv2s-xp"), primary: Boolean(document.querySelector("[data-cv2s-next].home-primary")) };`);
    check("打對：「對了」、輸入框收起來、+5 XP、「下一節」變主按鈕", /對了/.test(right.ok) && right.disabled && right.xp === "+5 XP" && right.primary, JSON.stringify(right));
    const e1 = await entry(CHAIN.id);
    check("打對：XP +5、這一節記成做完、solve 還是 shown（看過解法）", (await xpNow()) === xp0 + 5 && (e1.secDone || []).includes(CS) && e1.solve[CS] === "shown", `${xp0} → ${await xpNow()} ${JSON.stringify(e1.solve)}`);
    check("代小測：小測那一題第一次算錯（-1），正解接在後面", JSON.stringify((e1.picks || {})[CHAIN.sections[CS].solve.check]) === JSON.stringify([-1, correctOf(CHAIN.checks[CHAIN.sections[CS].solve.check])]), JSON.stringify(e1.picks));
    // 回到這一節再打對一次：XP 不再發
    await goSection(CS);
    await revealBeats(CHAIN);
    await waitFor(`document.querySelector('[data-cs="${BOX}"] [data-cs-input]')`);
    await typeAndSend(BOX, "6x^2(x^3+1)");
    check("重做一次：XP 只發一次", (await xpNow()) === xp0 + 5 && (await solveEvents()).length === 1);

    /* ── 讀完這一課：結算、排進回溫 ── */
    check(`點完 ${CHAIN.id} 其他節到結算`, await readLesson(CHAIN, 0));
    const fin = await evaluate(`return window.__b.text("[data-cs-stat]");`);
    check("結算：「自己算：首次答對 0 / 1」", fin === "自己算：首次答對 0 / 1", fin);
    check("結算：「明天回溫 3 題」", (await evaluate(`return window.__b.text("[data-cs-tomorrow]");`)) === "明天回溫 3 題", await evaluate(`return window.__b.text("[data-cs-tomorrow]");`));
    await evaluate(`window.__b.find("[data-cs-stat]").scrollIntoView({ block: "center" }); return 1;`);
    await both("finish-stat");
    const e2 = await entry(CHAIN.id);
    const today = await evaluate(`const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();`);
    const dayOf = (iso) => { const d = new Date(iso); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
    check("完成這一課：排進回溫（今天排、第 0 格、自己算在第一個、最多 3 題）", e2.doneAt && dayOf(e2.rvAt) === today && e2.rvStep === 0 && e2.rvItems[0] === `s${CS}` && e2.rvItems.length === 3 && e2.rvT === CHAIN.title, JSON.stringify({ rvAt: e2.rvAt, rvStep: e2.rvStep, rvItems: e2.rvItems, rvT: e2.rvT }));
    check("分析：course_lesson_complete 照記", (await evaluate(`return window.__b.events("course_lesson_complete").length;`)) === 1);
    await evaluate(`window.__b.act("home"); return 1;`);
    await waitFor(`document.querySelector(".home-screen")`);
    check("當天：首頁沒有回溫卡", !(await evaluate(`return Boolean(document.querySelector("[data-course-review]"));`)));

    /* ── 第一次就打對、題庫題的作答紀錄 ── */
    check(`打開 ${COMPOSE.id}`, await openLesson(COMPOSE));
    await goSection(FS);
    await revealBeats(COMPOSE);
    const FBOX = `${COMPOSE.id}:${FS}`;
    await waitFor(`document.querySelector('[data-cs="${FBOX}"] [data-cs-input]')`);
    const xp1 = await xpNow();
    await typeAndSend(FBOX, "(2x)^3");
    const once = await evaluate(`return window.__b.text('[data-cs="${FBOX}"] .is-right');`);
    check("第一次就打對：「對了，一次就對」、+5 XP、solve = first", /一次就對/.test(once) && (await xpNow()) === xp1 + 5 && (await entry(COMPOSE.id)).solve[FS] === "first", once);
    const ci = COMPOSE.sections[FS].solve.check;
    check("代小測：第一次就打對＝第一次就選對", JSON.stringify(((await entry(COMPOSE.id)).picks || {})[ci]) === JSON.stringify([correctOf(COMPOSE.checks[ci])]));
    ev = await solveEvents();
    check("分析：course_solve first_try: true", ev.length === 2 && ev[1].p.lesson === COMPOSE.id && ev[1].p.first_try === true, JSON.stringify(ev));

    /* ── 隔天：首頁的回溫卡、一輪回溫 ── */
    await setDay(1);
    await reload();
    await waitFor(`document.querySelector(".home-screen")`);
    const card = await evaluate(`const c = window.__b.find("[data-course-review]"); return c ? { text: (c.innerText || "").replace(/\\s+/g, " "), button: (c.querySelector('[data-action="course-rv"]') || {}).textContent || "" } : null;`);
    check("隔天：首頁有回溫卡、理由一行「昨天讀的〈課名〉，來回溫 3 題」", card && card.text.includes(`昨天讀的〈${CHAIN.title}〉，來回溫 3 題`) && /自己算 3 題/.test(card.button), JSON.stringify(card));
    check("回溫卡：390 寬不溢出、按鈕 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small("[data-course-review]").length;`)));
    await evaluate(`window.__b.find("[data-course-review]").scrollIntoView({ block: "center" }); return 1;`);
    await both("review-home");
    await tap(`[data-course-review] [data-action="course-rv"]`);
    check("回溫：一題一屏、第 1 / 3 題", await waitFor(`/1 \\/ 3/.test(window.__b.text("[data-cs-pos]"))`, 12000), await evaluate(`return window.__b.text("[data-cs-pos]");`));
    const r1 = await evaluate(`return { reason: window.__b.text(".cs-reason"), input: Boolean(window.__b.find("[data-cs-review] [data-cs-input]")), options: document.querySelectorAll("[data-cs-review] .course-option, [data-cs-review] [data-action='choose-answer']").length, ask: Boolean(document.querySelector("[data-cs-review] .course-check-ask .katex")) };`);
    check("回溫：理由一行、打字作答（沒有選項）、題目排好", r1.reason.includes(`昨天讀的〈${CHAIN.title}〉`) && r1.input && r1.options === 0 && r1.ask, JSON.stringify(r1));
    check("回溫頁：390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);
    await both("review-item");
    const RBOX = (key) => `rv:${CHAIN.id}:${key}`;
    await typeAndSend(RBOX(`s${CS}`), "6x^2(x^3+1)");
    check("回溫第 1 題第一次就對", /一次就對/.test(await evaluate(`return window.__b.text('[data-cs="${RBOX(`s${CS}`)}"] .is-right');`)));
    await evaluate(`window.__b.click('[data-action="course-rv-next"]'); return 1;`);
    const bank = (await entry(CHAIN.id)).rvItems[1];
    await waitFor(`/2 \\/ 3/.test(window.__b.text("[data-cs-pos]")) && document.querySelector("[data-cs-review] .cs-prompt .katex")`);
    check("回溫第 2 題：題庫題的題幹排好", Boolean(await evaluate(`return Boolean(window.__b.find("[data-cs-review] .cs-prompt .katex"));`)), bank);
    const stat0 = await evaluate(`return (window.__b.rec().problemStats || {})[${JSON.stringify(bank)}] || null;`);
    const bankAnswer = await evaluate(`return window.BUZZ_PROBLEMS.find((p) => p.id === ${JSON.stringify(bank)}).answer;`);
    await typeAndSend(RBOX(bank), bankAnswer);
    const stat1 = await evaluate(`return (window.__b.rec().problemStats || {})[${JSON.stringify(bank)}] || null;`);
    check("題庫題：第一次作答照一般作答記進 problemStats", stat1 && stat1.correct === ((stat0 && stat0.correct) || 0) + 1, JSON.stringify(stat1));
    await evaluate(`window.__b.click('[data-action="course-rv-next"]'); return 1;`);
    await waitFor(`/3 \\/ 3/.test(window.__b.text("[data-cs-pos]"))`);
    check("第 3 題：不會也可以跳過（不擋路）", Boolean(await evaluate(`return Boolean(window.__b.find('[data-action="course-rv-next"]'));`)) && /跳過/.test(await evaluate(`return window.__b.text('[data-action="course-rv-next"]');`)));
    await evaluate(`window.__b.click('[data-action="course-rv-next"]'); return 1;`);
    check("回溫結束：「首次答對 2 / 3」", await waitFor(`/首次答對 2 \\/ 3/.test(window.__b.text("[data-cs-stat]"))`), await evaluate(`return window.__b.text("[data-cs-stat]");`));
    check("回溫結束：有一題不是第一次就對 → 明天再一次", /明天再算一次/.test(await evaluate(`return window.__b.text("[data-cs-done] .cs-next");`)));
    const e3 = await entry(CHAIN.id);
    check("回溫結束：紀錄重排（第 0 格、上次回溫 3 題）", e3.rvStep === 0 && e3.rvDid === 3 && dayOf(e3.rvLast) === dayOf(Date.now() + DAY), JSON.stringify({ rvStep: e3.rvStep, rvDid: e3.rvDid, rvLast: e3.rvLast }));
    ev = (await solveEvents()).filter((e) => e.p.review);
    check("分析：回溫每一題記一次 course_solve（review: true）", ev.length === 3 && ev.map((e) => e.p.first_try).join() === "true,true,false", JSON.stringify(ev.map((e) => e.p)));
    await both("review-done");
    await evaluate(`window.__b.act("home"); return 1;`);
    await waitFor(`document.querySelector(".home-screen")`);
    check("回溫做完：首頁的卡不見了（今天的額度用完）", !(await evaluate(`return Boolean(document.querySelector("[data-course-review]"));`)));

    /* ── 額度：一般一天 5 題、整課整課拿；地圖的「該練」 ── */
    const AT = new Date(Date.now() - 3 * DAY).toISOString();
    const history = Array.from({ length: 4 }, (_x, i) => ({ mode: "quick", finishedAt: new Date(Date.now() - (5 + i) * DAY).toISOString(), total: 5, correct: 3 }));
    const seed = { ...SEED, history, courseV2: {
      "chain-rule": { openedAt: AT, doneAt: AT, rvAt: AT, rvStep: 0, rvT: CHAIN.title, rvItems: [`s${CS}`, "tmpl-der-sin-001", "fd-der-003"] },
      "function-composition": { openedAt: AT, doneAt: new Date(Date.now() - 2 * DAY).toISOString(), rvAt: new Date(Date.now() - 2 * DAY).toISOString(), rvStep: 0, rvT: COMPOSE.title, rvItems: [`s${FS}`] },
      "u-sub-basic": { openedAt: AT, doneAt: AT, rvAt: new Date(Date.now() - DAY).toISOString(), rvStep: 0, rvT: USUB.title, rvItems: [`s${US}`, "exam-int-005"] }
    } };
    await setDay(0);
    await boot(seed);
    await waitFor(`document.querySelector(".home-screen")`);
    const capCard = await evaluate(`return window.__b.text("[data-course-review]");`);
    check("一般：一天最多 5 題（3 + 1，第三課放不下就留到明天）", /3 天前讀的〈連鎖律 I：兩層〉等 2 課，來回溫 4 題/.test(capCard) && /自己算 4 題/.test(capCard), capCard);
    await evaluate(`window.__b.act("open-course"); return 1;`);
    await waitFor(`document.querySelector(".cv2-index")`, 12000);
    await evaluate(`window.__b.act("course-view", { mode: "map" }); return 1;`);
    await waitFor(`window.BuzzCourseMap && document.querySelector("[data-cv2-map]")`, 12000);
    await evaluate(`window.__b.act("course-map-filter", { mode: "practice" }); return 1;`);
    check("地圖載入", await waitFor(`window.BuzzCourseMap && document.querySelector(".cmap-todo")`, 12000));
    const todo = await evaluate(`return [...document.querySelectorAll(".cmap-todo button")].map((b) => ({ a: b.dataset.action, id: b.dataset.lessonId, t: (b.innerText || "").replace(/\\s+/g, " ") }));`);
    check("地圖的「該練」：要回溫的兩課排最前面、按鈕是「自己算 n 題」、第三課（今天放不下）不在", todo.length >= 2 && todo[0].a === "course-rv" && todo[0].id === "chain-rule" && /自己算 3 題/.test(todo[0].t) && todo[1].a === "course-rv" && todo[1].id === "function-composition" && !todo.some((x) => x.id === "u-sub-basic" && x.a === "course-rv"), JSON.stringify(todo.slice(0, 3)));
    check("地圖 390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);
    await evaluate(`window.__b.find(".cmap-todo").scrollIntoView({ block: "center" }); return 1;`);
    await both("map-practice");
    await evaluate(`window.__b.click('.cmap-todo [data-action="course-rv"][data-lesson-id="function-composition"]'); return 1;`);
    check("從地圖點：那一課排第一", await waitFor(`/〈${COMPOSE.title}〉/.test(window.__b.text("[data-cs-pos]"))`, 12000), await evaluate(`return window.__b.text("[data-cs-pos]");`));
    // 360 寬
    await chrome.send("Emulation.setDeviceMetricsOverride", NARROW);
    await sleep(300);
    check("回溫頁：360 寬不溢出、鍵與輸入框 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small("[data-cs-review] [data-cs]").length;`)), JSON.stringify(await evaluate(`return window.__b.small("[data-cs-review] [data-cs]");`)));
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await sleep(200);

    const errors = chrome.pageErrors.concat(chrome.consoleMessages.filter((m) => m.type === "error").map((m) => m.text));
    check("console 沒有錯誤", !errors.length, errors.slice(0, 3).join(" | "));
    const broken = chrome.failedRequests.filter((line) => !/ERR_NAME_NOT_RESOLVED|ERR_ABORTED|ERR_INTERNET_DISCONNECTED/.test(line));
    check("站內的檔沒有載入失敗", !broken.length, broken.slice(0, 3).join(" | "));
    check("分析開著：有去抓 gtag.js（被這支測試攔下來，沒有真的送出去）", ga.some((u) => /googletagmanager/.test(u)), String(ga.length));

    /* ── 分析關掉：照樣記、什麼都不送；題庫題的自己算（problemId）在分節裡第一次就對 ── */
    await boot({ ...SEED, settings: { analytics: "off" } });
    ga.length = 0;
    check(`分析關掉：打開 ${USUB.id}`, await openLesson(USUB));
    await goSection(US);
    await revealBeats(USUB);
    const UBOX = `${USUB.id}:${US}`;
    await waitFor(`document.querySelector('[data-cs="${UBOX}"] [data-cs-input]')`);
    check("代 predict 的自己算：問句寫完整（隔天單獨看也看得懂）", /\\int|∫/.test(await evaluate(`return document.querySelector('[data-cs="${UBOX}"] .course-check-ask').innerText;`)) || Boolean(await evaluate(`return Boolean(document.querySelector('[data-cs="${UBOX}"] .course-check-ask .katex'));`)));
    await typeAndSend(UBOX, "2/9(1+x^3)^(3/2)+C");
    const off = await evaluate(`const r = window.__b.rec(); return { dl: typeof window.dataLayer, gtag: typeof window.gtag, solve: ((r.courseV2 || {})[${JSON.stringify(USUB.id)}] || {}).solve || {}, stat: (r.problemStats || {})[${JSON.stringify(USUB.sections[US].solve.problemId)}] || null };`);
    check("分析關掉：照樣記（solve = first）", off.solve[US] === "first", JSON.stringify(off.solve));
    check("題庫題（problemId）：第一次作答進 problemStats", off.stat && off.stat.correct === 1 && off.stat.total === 1, JSON.stringify(off.stat));
    await sleep(1500);
    check("分析關掉：沒有 dataLayer／gtag、沒有任何 GA 請求", off.dl === "undefined" && off.gtag === "undefined" && ga.length === 0, `${off.dl} ${off.gtag} ${ga.join(" ")}`);
  } finally {
    await chrome.close();
    await server.stop();
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (SHOTS) console.log(`截圖：${SHOTS}`);
  if (failures.length) {
    failures.forEach((line) => console.log(`  XX ${line}`));
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  ciFail("e2e_course_solve crashed", error.message);
  process.exit(1);
});
