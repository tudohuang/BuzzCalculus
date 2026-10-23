// 章首魔王題（bosses.json → outline.bosses；畫面 src/course_boss.js）與課程的分析事件，在真的 Chrome 裡走一次（手機 390×844、觸控）。
//
// 斷言都是看得到、點得到的東西：
//   課程表：有魔王題的章，章名下一行是鉤子＋「還差 n 課」；打開課程表還沒抓 course_boss.js，打開那一章的課才抓。
//   章的第一課（分節）：第一節上面一張卡 —— 題目（KaTeX 排好）、鉤子、「這章學完你就會 · 還差 n 課」、先試試看；全文模式一樣有。
//   先試試看：走一般的作答流程；答錯結算是「還沒解開」，錯題本裡沒有這一題（boss-try: 是診斷），也沒有記成解開。
//   讀完第一課：結算畫面「離魔王題還差 1 課」；課程表那一行跟著變 1。讀完 payoff 那一課：「現在解得開了」＋主按鈕，「下一課」降成次要。
//   解魔王題：答對 → 「魔王題解開了 · +30 XP」＋解開之後那一行；records.courseV2Boss[章].solvedAt；XP 只發一次（再解一次不再 +30）；
//   第一課的卡變成「已解開」；課程表那一行「已解開」；地圖上那一章有皇冠、payoff 那一課的小卡提到魔王題。
//   新使用者：每一章的「還差 n 課」是那一章到 payoff 的課數；360／390 寬不溢出、按鈕 ≥ 40px；深色主題卡上的字對比 ≥ 4.5。
//   分析（GA 的請求一律由這支測試攔下來回空的，不會真的送出去）：開著 → course_section_complete 每一節一次（重讀不再記）、
//   course_lesson_complete 一次、course_boss_view、course_boss_solve 各一次；關掉 → gtag.js 的請求一個都沒有、dataLayer 不存在。
//
// 用法：node tools/e2e_course_boss.js
//       node tools/e2e_course_boss.js --screenshots   另存截圖到 docs/report/course-review/screens/boss/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "boss") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const NARROW = { width: 360, height: 780, deviceScaleFactor: 2, mobile: true };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
// 網站上的課 2026-10-23 換成交付的筆記本課；這支照舊版的課（lessons_v1/）走一節，開頁時塞進頁面（tools/lib/course_v1_fixture.js）
const FX = require("./lib/course_v1_fixture.js");
const USED = new Set();
const lessonOf = (id) => { USED.add(id); return FX.lessonOf(id); };
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "course_v2", "outline.js"), "utf8"), box);
const OUTLINE = box.window.BUZZ_COURSE_V2;
const CHAPTERS = OUTLINE.stages.flatMap((s) => s.chapters);
const BOSSES = OUTLINE.bosses || {};
const CODE = "2D";
const CH = CHAPTERS.find((c) => c.code === CODE);
const B = BOSSES[CODE];
const ROWS = CH.lessons.slice(0, CH.lessons.findIndex((l) => l.id === B.at) + 1).map((l) => l.id);
const FIRST = lessonOf(ROWS[0]);
const PAYOFF = lessonOf(B.at);
const correctOf = (item) => item.options.findIndex((o) => o.correct);

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
    small(scope) { return [...document.querySelectorAll(scope + " button")].filter((n) => window.__b.visible(n) && !n.classList.contains("cv2-link")).map((n) => { const r = n.getBoundingClientRect(); return { side: Math.round(Math.min(r.width, r.height)), label: (n.textContent || "").trim().slice(0, 10) }; }).filter((x) => x.side < 40); },
    // 計算後的顏色可能是 rgb() 或 color(srgb …)（color-mix 的結果）
    rgb(c) { const v = (c.match(/[\\d.]+/g) || []).slice(0, 3).map(Number); return /^color\\(/.test(c) ? v.map((x) => x * 255) : v; },
    lum(c) { const v = window.__b.rgb(c).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; },
    contrast(a, b) { const x = window.__b.lum(a); const y = window.__b.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); },
    // GA 的事件：gtag() 把 arguments 推進 dataLayer
    events(prefix) { return (window.dataLayer || []).filter((a) => a && a[0] === "event" && String(a[1]).startsWith(prefix)).map((a) => ({ name: a[1], p: a[2] || {} })); }
  };
`;

async function run() {
  console.log("E2E 章首魔王題");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: FX.script([...USED]) });
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

  // GA：gtag.js 與送事件的網址一律攔下來回空的（不會真的送出去），順便數有沒有人去抓
  const ga = [];
  chrome.on("Fetch.requestPaused", (p) => {
    ga.push(p.request.url);
    chrome.send("Fetch.fulfillRequest", { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/javascript" }], body: "" }).catch(() => {});
  });
  await chrome.send("Fetch.enable", { patterns: [{ urlPattern: "*googletagmanager.com*", requestStage: "Request" }, { urlPattern: "*google-analytics.com*", requestStage: "Request" }] });

  const boot = async (records) => {
    await chrome.send("Page.navigate", { url: "about:blank" });
    await sleep(200);
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(records))}); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app") && document.querySelector("#app").children.length`);
  };
  const openLesson = async (id, title) => {
    await evaluate(`window.__b.act("open-course-lesson", { lessonId: ${JSON.stringify(id)} }); return 1;`);
    return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(title)} && (document.querySelector("[data-cv2s] .cv2s-sec") || document.querySelector("[data-course-concept]"))`, 10000);
  };
  const openCourse = async () => {
    await evaluate(`window.__b.act("open-course"); return 1;`);
    return waitFor(`document.querySelector(".cv2-index .cv2-stages")`, 10000);
  };
  const lineOf = (code) => evaluate(`const s = document.querySelector('[data-cv2-boss="${code}"]'); if (!s) return null; const st = s.closest("details"); if (st && !st.open) st.open = true; return { text: (s.innerText || "").replace(/\\s+/g, " ").trim(), visible: window.__b.visible(s), h: Math.round(s.getBoundingClientRect().height) };`);
  // 點完目前這一節：出完句子、做結尾的動作（跟 e2e_course_sections 同一套）
  const finishSection = async (lesson) => {
    const si = await evaluate(`return Number(document.querySelector("[data-cv2s]").dataset.cv2s);`);
    const sec = lesson.sections[si];
    const answerWhy = async () => {
      const bi = await evaluate(`const c = document.querySelector('[data-cv2s-act="why"] [data-action="course-s-why"]:not([disabled])'); return c ? Number(c.dataset.beat) : -1;`);
      if (bi >= 0) await evaluate(`window.__b.click('[data-action="course-s-why"][data-beat="${bi}"][data-option="${correctOf(sec.beats[bi].why)}"]'); return 1;`);
    };
    for (let k = 0; k < 2 * sec.beats.length + 2; k += 1) {
      await answerWhy();
      if ((await evaluate(`return document.querySelectorAll("[data-cv2s] .cv2s-beat").length;`)) >= sec.beats.length) break;
      await evaluate(`window.__b.click("[data-cv2s-next]"); return 1;`);
      await sleep(60);
    }
    await answerWhy();
    if (sec.check !== undefined) await evaluate(`window.__b.click('[data-action="course-s-pick"][data-kind="check"][data-option="${correctOf(lesson.checks[sec.check])}"]'); return 1;`);
    if (sec.predict) await evaluate(`window.__b.click('[data-action="course-s-pick"][data-kind="predict"][data-option="0"]'); return 1;`);
    if (sec.order) for (let j = 0; j < sec.order.steps.length; j += 1) await evaluate(`window.__b.click('[data-action="course-s-ord"][data-step="${j}"]'); return 1;`);
    if (sec.where) await evaluate(`window.__b.click('[data-action="course-s-whr"][data-option="${correctOf({ options: sec.where.steps })}"]'); return 1;`);
    // 分節沒有拖圖（滑桿互動圖只在全文）
    await sleep(120);
  };
  const readLesson = async (lesson) => {
    for (let si = 0; si < lesson.sections.length; si += 1) {
      await finishSection(lesson);
      await evaluate(`window.__b.click("[data-cv2s-next]"); return 1;`);
      await sleep(150);
    }
    return waitFor(`document.querySelector("[data-cv2s-finish] .cv2s-stats")`, 10000);
  };
  // 一題的一局：right = 選正解（選項的 data-choice 等於 problem.answer）；走到結算頁
  const answerBoss = async (right) => {
    await waitFor(`document.querySelector('[data-action="choose-answer"]')`, 10000);
    const picked = await evaluate(`const p = window.BUZZ_PROBLEMS.find((x) => x.id === ${JSON.stringify(B.p)});
      const c = [...document.querySelectorAll('[data-action="choose-answer"]')].filter((n) => !n.disabled);
      const hit = c.find((n) => (n.getAttribute("data-choice") === String(p.answer)) === ${right});
      if (!hit) return { n: c.length, ok: false };
      hit.click(); return { n: c.length, ok: true };`);
    for (let k = 0; k < 40; k += 1) {
      if (await evaluate(`return Boolean(document.querySelector('.results-screen, [data-action="restart"]'));`)) break;
      await evaluate(`const n = document.querySelector('[data-action="next-question"]'); if (n && !n.disabled) n.click(); return 1;`);
      await sleep(250);
    }
    return picked;
  };

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

    /* ── 新使用者：課程表 ── */
    await boot({ tours: { home: 1, quiz: 1 } });
    check("新使用者首頁：還沒抓 course_boss.js", (await evaluate(`return window.__b.files(/course_boss\\.js/);`)) === 0);
    check("打開課程表", await openCourse());
    const fresh = {};
    for (const code of Object.keys(BOSSES)) fresh[code] = await lineOf(code);
    const expectLeft = (code) => {
      const ch = CHAPTERS.find((c) => c.code === code);
      return ch.lessons.findIndex((l) => l.id === BOSSES[code].at) + 1;
    };
    Object.keys(BOSSES).forEach((code) => {
      const line = fresh[code];
      check(`課程表 ${code}：鉤子＋還差 ${expectLeft(code)} 課`, line && line.visible && line.text.includes(BOSSES[code].h) && line.text.includes(`還差 ${expectLeft(code)} 課`) && line.h >= 40, JSON.stringify(line));
    });
    check("課程表還沒抓 course_boss.js（那一行留在課程組裡）", (await evaluate(`return window.__b.files(/course_boss\\.js/);`)) === 0);
    check("課程表 390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);
    if (SHOTS) { await evaluate(`document.querySelector('[data-cv2-boss="${CODE}"]').scrollIntoView({ block: "center" }); return 1;`); await both("course-list"); }

    /* ── 章的第一課：卡 ── */
    check(`打開 ${FIRST.id}（章的第一課）`, await openLesson(FIRST.id, FIRST.title));
    check("卡出現了：題目排好、鉤子、還差 2 課、先試試看", await waitFor(`window.__b.find("[data-cvb-card] .cvb-problem .katex")`));
    const card = await evaluate(`const c = window.__b.find("[data-cvb-card]"); const sec = document.querySelector("[data-cv2s] .cv2s-sec"); return {
      text: (c.innerText || "").replace(/\\s+/g, " "), try: Boolean(c.querySelector('[data-action="course-boss"][data-try="1"]')),
      before: Boolean(c.compareDocumentPosition(sec) & Node.DOCUMENT_POSITION_FOLLOWING), files: window.__b.files(/course_boss\\.js/) };`);
    check("卡：鉤子、「這章學完你就會 · 還差 2 課」", card.text.includes(B.h) && /這章學完你就會 · 還差 2 課/.test(card.text), card.text);
    check("卡在第一節上面、按鈕是先試試看（boss-try）", card.before && card.try && card.text.includes("先試試看"));
    check("打開那一章的課才抓 course_boss.js（一次）", card.files === 1, String(card.files));
    check("卡：390 寬不溢出、按鈕 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small("[data-cvb-card]").length;`)));
    let views = await evaluate(`return window.__b.events("course_boss_view");`);
    check("分析開著：course_boss_view 記一次（章碼）", views.length === 1 && views[0].p.chapter === CODE, JSON.stringify(views));
    await evaluate(`window.__b.click("[data-cv2s-next]"); return 1;`);
    await sleep(200);
    check("出下一句（重繪）不再記 course_boss_view", (await evaluate(`return window.__b.events("course_boss_view").length;`)) === 1);
    // 深色：卡上的字對卡的底色
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    await sleep(150);
    const dark = await evaluate(`const c = window.__b.find("[data-cvb-card]"); const bg = getComputedStyle(c).backgroundColor; return { hook: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-hook")).color, bg), kicker: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-kicker")).color, bg), meta: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-meta")).color, bg), bg };`);
    check("深色：卡上的鉤子／標題／還差幾課對底色 ≥ 4.5", dark.hook >= 4.5 && dark.kicker >= 4.5 && dark.meta >= 4.5, JSON.stringify(dark));
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);
    const light = await evaluate(`const c = window.__b.find("[data-cvb-card]"); const bg = getComputedStyle(c).backgroundColor; return { hook: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-hook")).color, bg), kicker: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-kicker")).color, bg), meta: window.__b.contrast(getComputedStyle(c.querySelector(".cvb-meta")).color, bg) };`);
    check("淺色：卡上的字對底色 ≥ 4.5", light.hook >= 4.5 && light.kicker >= 4.5 && light.meta >= 4.5, JSON.stringify(light));
    await evaluate(`scrollTo(0, 0); return 1;`);
    await both("boss-card-chapter-start");
    // 360 寬
    await chrome.send("Emulation.setDeviceMetricsOverride", NARROW);
    await sleep(250);
    check("卡：360 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0, String(await evaluate(`return window.__b.overflow();`)));
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await sleep(200);

    /* ── 先試試看：答錯不進錯題本、不算解開 ── */
    await evaluate(`window.__b.click('[data-cvb-card] [data-action="course-boss"]'); return 1;`);
    const tried = await answerBoss(false);
    check("先試試看：走一般的作答流程（有選項）", tried.ok && tried.n >= 2, JSON.stringify(tried));
    check("先試試看答錯：結算頁「還沒解開 · 讀到〈payoff〉就解得開」", await waitFor(`/還沒解開/.test(window.__b.text("[data-cvb-unsolved]"))`), await evaluate(`return window.__b.text("[data-cvb-unsolved]");`));
    const afterTry = await evaluate(`const r = window.__b.rec(); return { mistake: Boolean((r.mistakes || {})[${JSON.stringify(B.p)}]), boss: r.courseV2Boss || null, stat: (r.problemStats || {})[${JSON.stringify(B.p)}] || null };`);
    check("先試試看答錯：錯題本裡沒有這一題（診斷），也沒記成解開", !afterTry.mistake && !(afterTry.boss && afterTry.boss[CODE]), JSON.stringify(afterTry));
    check("先試試看答錯：作答統計照記（誠實的資料）", afterTry.stat && afterTry.stat.wrong === 1, JSON.stringify(afterTry.stat));
    check("先試試看沒有送 course_boss_solve", (await evaluate(`return window.__b.events("course_boss_solve").length;`)) === 0);
    check("結算頁 390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);

    /* ── 讀完第一課：還差 1 課 ── */
    check(`回到 ${FIRST.id}`, await openLesson(FIRST.id, FIRST.title));
    check(`點完 ${FIRST.id} 的 ${FIRST.sections.length} 節到結算`, await readLesson(FIRST));
    const fin1 = await evaluate(`return { left: window.__b.text("[data-cvb-left]"), n: (document.querySelector("[data-cvb-left]") || {}).dataset ? document.querySelector("[data-cvb-left]").dataset.cvbLeft : "", next: (window.__b.find("[data-cv2s-finish] .action-row .button") || {}).className || "" };`);
    check("結算畫面：離魔王題還差 1 課", fin1.n === "1" && /離魔王題還差\s*1\s*課/.test(fin1.left), JSON.stringify(fin1));
    check("結算畫面：下一課還是主按鈕", /home-primary/.test(fin1.next), fin1.next);
    check("結算 390 寬不溢出、按鈕 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small("[data-cv2s-finish]").length;`)));
    await evaluate(`window.__b.find("[data-cvb-left]").scrollIntoView({ block: "center" }); return 1;`);
    await both("finish-still-n-lessons");
    const sec1 = await evaluate(`return window.__b.events("course_section_complete");`);
    check(`course_section_complete 每一節一次（${FIRST.sections.length} 次、mode tap）`, sec1.length === FIRST.sections.length && sec1.every((e, i) => e.p.lesson === FIRST.id && e.p.section === i && e.p.mode === "tap"), JSON.stringify(sec1.map((e) => e.p.section)));
    const les1 = await evaluate(`return window.__b.events("course_lesson_complete");`);
    check("course_lesson_complete 一次（課 id、層級）", les1.length === 1 && les1[0].p.lesson === FIRST.id && les1[0].p.tier >= 1, JSON.stringify(les1));
    // 重讀：同一課再點完第一節，不再記
    check("重開第一課", await openLesson(FIRST.id, FIRST.title));
    await evaluate(`window.__b.act("course-s-go", { to: "0" }); return 1;`);
    await waitFor(`document.querySelector('[data-cv2s="0"]')`);
    await finishSection(FIRST);
    await sleep(200);
    check("重讀：course_section_complete 不再記、course_lesson_complete 不再記", (await evaluate(`return window.__b.events("course_section_complete").length;`)) === FIRST.sections.length && (await evaluate(`return window.__b.events("course_lesson_complete").length;`)) === 1);
    await waitFor(`window.__b.find("[data-cvb-card]")`);
    check("卡（第一節）：還差 1 課", /還差 1 課/.test(await evaluate(`return window.__b.text("[data-cvb-card]");`)));
    check("課程表那一行跟著變：還差 1 課", (await openCourse()) && /還差 1 課/.test((await lineOf(CODE)).text));

    /* ── payoff 那一課：現在解得開了 ── */
    check(`打開 ${PAYOFF.id}（payoff）`, await openLesson(PAYOFF.id, PAYOFF.title));
    check("payoff 那一課開頭沒有卡（卡只在章的第一課）", !(await evaluate(`return Boolean(window.__b.find("[data-cvb-card]"));`)));
    check(`點完 ${PAYOFF.id} 到結算`, await readLesson(PAYOFF));
    const pay = await evaluate(`const p = window.__b.find("[data-cvb-pay]"); const btns = [...document.querySelectorAll("[data-cv2s-finish] .button")].filter((b) => window.__b.visible(b)); return {
      text: p ? (p.innerText || "").replace(/\\s+/g, " ") : "", math: Boolean(p && p.querySelector(".katex")),
      solve: (p && p.querySelector('[data-action="course-boss"]') || {}).className || "", tryAttr: Boolean(p && p.querySelector("[data-try]")),
      primaries: btns.filter((b) => /home-primary/.test(b.className)).map((b) => b.textContent.trim()) };`);
    check("payoff 結算：「現在解得開了」＋題目", /現在解得開了/.test(pay.text) && pay.math, pay.text);
    check("payoff 結算：解魔王題是唯一的主按鈕（下一課降成次要）、不是先試試看", /home-primary/.test(pay.solve) && !pay.tryAttr && pay.primaries.length === 1 && /解魔王題/.test(pay.primaries[0]), JSON.stringify(pay.primaries));
    await evaluate(`window.__b.find("[data-cvb-pay]").scrollIntoView({ block: "center" }); return 1;`);
    await both("payoff-finish");

    /* ── 解魔王題 ── */
    const xp0 = await evaluate(`return Number(window.__b.rec().xp) || 0;`);
    await evaluate(`window.__b.click('[data-cvb-pay] [data-action="course-boss"]'); return 1;`);
    const solved = await answerBoss(true);
    check("解魔王題：選得到正解", solved.ok, JSON.stringify(solved));
    check("解開了：結算頁「魔王題解開了 · +30 XP」＋解開之後那一行", await waitFor(`/魔王題解開了 · \\+30 XP/.test(window.__b.text("[data-cvb-solved]"))`) && (await evaluate(`return window.__b.text("[data-cvb-solved]");`)).includes(B.n), await evaluate(`return window.__b.text("[data-cvb-solved]");`));
    const rec1 = await evaluate(`const r = window.__b.rec(); return { boss: (r.courseV2Boss || {})[${JSON.stringify(CODE)}] || null, xp: Number(r.xp) || 0, gained: (r.history || []).slice(-1)[0] };`);
    const quizXp1 = await evaluate(`return 0;`);
    check("records.courseV2Boss[章].solvedAt", rec1.boss && /^\d{4}-/.test(rec1.boss.solvedAt), JSON.stringify(rec1.boss));
    check("XP 多了 30 以上（魔王題加成 ＋ 這一局）", rec1.xp - xp0 >= 30, `${xp0} → ${rec1.xp}`);
    const solveEv = await evaluate(`return window.__b.events("course_boss_solve");`);
    check("course_boss_solve 一次（章碼、before_payoff: false）", solveEv.length === 1 && solveEv[0].p.chapter === CODE && solveEv[0].p.before_payoff === false, JSON.stringify(solveEv));
    check("解開的結算 390 寬不溢出、按鈕 ≥ 40px", (await evaluate(`return window.__b.overflow();`)) <= 0 && !(await evaluate(`return window.__b.small("#app .results-screen, #app main").length;`)));
    await evaluate(`const n = window.__b.find("[data-cvb-solved]"); if (n) n.scrollIntoView({ block: "center" }); return 1;`);
    await both("boss-solved");

    // 再解一次：不再 +30、不再記 course_boss_solve
    await evaluate(`window.__b.act("course-boss", { code: ${JSON.stringify(CODE)} }); return 1;`);
    const xp1 = await evaluate(`return Number(window.__b.rec().xp) || 0;`);
    await answerBoss(true);
    await waitFor(`window.__b.find("[data-cvb-solved]")`);
    const again = await evaluate(`const r = window.__b.rec(); const h = (r.history || []).slice(-1)[0] || {}; return { xp: Number(r.xp) || 0, text: window.__b.text("[data-cvb-solved]"), solvedAt: r.courseV2Boss[${JSON.stringify(CODE)}].solvedAt };`);
    check("再解一次：XP 加成只發一次（結算不再寫 +30）", !/\+30/.test(again.text) && again.solvedAt === rec1.boss.solvedAt, again.text);
    check("再解一次：course_boss_solve 不再記", (await evaluate(`return window.__b.events("course_boss_solve").length;`)) === 1);
    void quizXp1; void xp1;

    // 第一課的卡：已解開＋那一行
    check("回到第一課", await openLesson(FIRST.id, FIRST.title));
    await evaluate(`window.__b.act("course-s-go", { to: "0" }); return 1;`);
    await waitFor(`window.__b.find("[data-cvb-card]")`);
    const solvedCard = await evaluate(`return window.__b.text("[data-cvb-card]");`);
    check("第一課的卡：已解開、解開之後那一行、沒有按鈕", /已解開/.test(solvedCard) && solvedCard.includes(B.n) && !(await evaluate(`return Boolean(document.querySelector('[data-cvb-card] [data-action="course-boss"]'));`)), solvedCard);
    // 全文模式一樣有卡
    await evaluate(`window.__b.click('[data-action="course-s-mode"][data-mode="full"]'); return 1;`);
    check("全文模式：卡在觀念之前", await waitFor(`window.__b.find("[data-cvb-card]") && document.querySelector("[data-course-concept]") && (window.__b.find("[data-cvb-card]").compareDocumentPosition(document.querySelector("[data-course-concept]")) & Node.DOCUMENT_POSITION_FOLLOWING)`));
    check("全文模式 390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);
    await evaluate(`window.__b.click('[data-action="course-s-mode"][data-mode="sec"]'); return 1;`);

    /* ── 課程表與地圖 ── */
    check("課程表那一行：已解開", (await openCourse()) && /已解開/.test((await lineOf(CODE)).text));
    await evaluate(`window.__b.act("course-map-focus", { lessonId: ${JSON.stringify(B.at)} }); return 1;`);
    check("地圖載入", await waitFor(`window.BuzzCourseMap && window.BuzzCourseMap.state()`, 10000));
    const mapState = await evaluate(`return window.BuzzCourseMap.state().crowns;`);
    check("地圖：解開的那一章有皇冠（只有那一章）", Array.isArray(mapState) && mapState.length === 1 && mapState[0] === CODE, JSON.stringify(mapState));
    const mcard = await evaluate(`await new Promise((r) => setTimeout(r, 900)); const p = window.BuzzCourseMap.project(${JSON.stringify(B.at)}); return { p, card: window.__b.text(".cmap-card") };`);
    if (mcard.p && !/魔王題/.test(mcard.card)) {
      await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: mcard.p.x, y: mcard.p.y }] });
      await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await sleep(400);
    }
    const mtext = await evaluate(`return window.__b.text(".cmap-card");`);
    check("地圖：payoff 那一課的小卡提到魔王題", /魔王題已解開/.test(mtext), mtext.slice(0, 80));
    check("地圖 390 寬不溢出", (await evaluate(`return window.__b.overflow();`)) <= 0);
    await both("map-crown");

    // 專注模式：照樣記（solvedAt 還在），但不畫皇冠
    await evaluate(`const r = window.__b.rec(); r.settings = { ...(r.settings || {}), focusMode: "on" }; localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(r)); window.__b.act("course-view", { mode: "list" }); return 1;`);
    await sleep(200);
    await evaluate(`window.__b.act("course-view", { mode: "map" }); return 1;`);
    await waitFor(`window.BuzzCourseMap.state()`);
    await sleep(300);
    check("專注模式：地圖不畫皇冠（紀錄還在）", (await evaluate(`return window.BuzzCourseMap.state().crowns.length;`)) === 0 && Boolean(await evaluate(`return window.__b.rec().courseV2Boss[${JSON.stringify(CODE)}];`)));

    const errors = chrome.pageErrors.concat(chrome.consoleMessages.filter((m) => m.type === "error").map((m) => m.text));
    check("console 沒有錯誤", !errors.length, errors.slice(0, 3).join(" | "));
    const broken = chrome.failedRequests.filter((line) => !/ERR_NAME_NOT_RESOLVED|ERR_ABORTED|ERR_INTERNET_DISCONNECTED/.test(line));
    check("站內的檔沒有載入失敗", !broken.length, broken.slice(0, 3).join(" | "));
    check("分析開著：有去抓 gtag.js（被這支測試攔下來，沒有真的送出去）", ga.some((u) => /googletagmanager/.test(u)), String(ga.length));

    /* ── 分析關掉：連 gtag.js 都不抓、什麼都不送 ── */
    await boot({ tours: { home: 1, quiz: 1 }, settings: { analytics: "off" } });
    // 開機時第一次導覽還是上一份紀錄（分析開著）：從關掉的那一頁開始數
    ga.length = 0;
    check("分析關掉：打開課程表", await openCourse());
    check("分析關掉：打開章的第一課（卡在）", (await openLesson(FIRST.id, FIRST.title)) && (await waitFor(`window.__b.find("[data-cvb-card]")`)));
    await finishSection(FIRST);
    await sleep(400);
    const off = await evaluate(`return { dl: typeof window.dataLayer, gtag: typeof window.gtag, done: (window.__b.rec().courseV2[${JSON.stringify(FIRST.id)}] || {}).secDone || [] };`);
    check("分析關掉：讀完一節照樣記進度", off.done.length === 1, JSON.stringify(off.done));
    await sleep(1800);
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
  ciFail("e2e_course_boss crashed", error.message);
  process.exit(1);
});
