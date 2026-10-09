// 分節模式（lesson.sections，src/course_sections.js）在真的 Chrome 裡走一次：手機 390×844（觸控）＋桌機 1280×800。
//
// 斷言都是看得到、摸得到的東西：
//   有分節的課預設一節一屏（不是整頁）、上面是節的進度點；打開課程表時還沒抓 course_sections.js，打開那一課才抓；
//   「下一句」、點句子那一塊、→ 鍵都會出下一句；句子帶 fig 時 widget 的值真的動到那一格（中間有過渡值），
//   reduced-motion 直接跳；句子都出來才有結尾的動作；小測選錯當下就看到理由、可以重選，選對打勾、+5 XP；
//   拖滑桿進範圍也算一個動作；一節的 XP 只發一次（重讀不再加）；下一節、記到節（重開從那一節接）；
//   整課點完（不碰任何聲音的路）就到結算：「你現在會：」＋學習目標、這一課的 XP（數字直接是總數）、下一課、在地圖上看；
//   在地圖上看：地圖打開、那一課亮一下（環），然後自己消失；每日任務「讀一節課」1/1、連勝 1 天；
//   「全文」切回整頁、而且記住（重開還是全文）、再切回分節；390 寬不溢出、按鈕 ≥ 40px；桌機本文欄置中；console 沒有錯誤。
//
// 用法：node tools/e2e_course_sections.js
//       node tools/e2e_course_sections.js --screenshots   另存截圖到 docs/report/course-review/screens/sections/（不進版控）

"use strict";

const fs = require("fs");
const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.argv.includes("--screenshots") ? path.join(ROOT, "docs", "report", "course-review", "screens", "sections") : "";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false };
const LESSON_DIR = path.join(ROOT, "tools", "content", "course_v2", "lessons");
const lessonOf = (id) => JSON.parse(fs.readFileSync(path.join(LESSON_DIR, `${id}.json`), "utf8"));
const FIRST = lessonOf("function-intro");
const SECOND = lessonOf("domain-range");
const WIDGET = lessonOf("riemann-sum-intuition");
const correctOf = (item) => item.options.findIndex((o) => o.correct);
const wrongOf = (item) => item.options.findIndex((o) => !o.correct);

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
  window.__s = {
    visible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && getComputedStyle(el).display !== "none"; },
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); return 1; },
    text(sel) { const el = document.querySelector(sel); return el ? (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim() : ""; },
    root() { return document.querySelector("[data-cv2s]"); },
    si() { const r = window.__s.root(); return r ? Number(r.dataset.cv2s) : -1; },
    beats() { return document.querySelectorAll("[data-cv2s] .cv2s-beat").length; },
    rec() { try { return JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}"); } catch (e) { return {}; } },
    today() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); },
    files() { return performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /course_sections\\.js/.test(n)).length; },
    overflow() { const d = document.documentElement; return d.scrollWidth - d.clientWidth; },
    small() { return [...document.querySelectorAll("[data-cv2s] button")].filter((n) => window.__s.visible(n) && !n.classList.contains("cv2-link")).map((n) => { const r = n.getBoundingClientRect(); return { side: Math.round(Math.min(r.width, r.height)), label: (n.textContent || n.getAttribute("aria-label") || "").trim().slice(0, 12) }; }).filter((x) => x.side < 40); },
    fig(k) { return document.querySelector('[data-cv2s] [data-cv2-fig="' + k + '"]'); },
    // 點一下之後 1.2 秒內 widget 經過的每一個值（看「平滑地動」與 reduced-motion 的「直接跳」）
    watch(k) {
      window.__vals = [];
      const t0 = performance.now();
      const step = () => { const f = window.__s.fig(k); if (f && f.dataset.value !== undefined && window.__vals[window.__vals.length - 1] !== f.dataset.value) window.__vals.push(f.dataset.value); if (performance.now() - t0 < 1200) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      return 1;
    }
  };
`;

async function run() {
  console.log("E2E 課程分節");
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
    await sleep(250);
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(data, "base64"));
  };
  let touch = true;
  // 真的點：捲到看得到、在元素中間派觸控（手機）或滑鼠（桌機）事件
  const tap = async (selector) => {
    // 先等捲動停下來（新的一句出現時頁面會平滑地把按鈕列帶進畫面），再量位置
    const find = `[...document.querySelectorAll(${JSON.stringify(selector)})].find((n) => window.__s.visible(n))`;
    let p = null;
    for (let k = 0; k < 20; k += 1) {
      const a = await evaluate(`const el = ${find}; if (!el) return null; return Math.round(scrollY);`);
      if (a === null) return false;
      await sleep(80);
      const b = await evaluate(`return Math.round(scrollY);`);
      if (a === b) break;
    }
    p = await evaluate(`const el = ${find}; if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.left + Math.min(r.width / 2, 60), y: r.top + r.height / 2 };`);
    if (!p) return false;
    await sleep(60);
    if (touch) {
      await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
      await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } else {
      await chrome.send("Input.dispatchMouseEvent", { type: "mousePressed", x: p.x, y: p.y, button: "left", clickCount: 1 });
      await chrome.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: p.x, y: p.y, button: "left", clickCount: 1 });
    }
    await sleep(160);
    return true;
  };
  const key = async (name, code, keyCode) => {
    await evaluate(`if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); return 1;`);
    await chrome.send("Input.dispatchKeyEvent", { type: "keyDown", key: name, code, windowsVirtualKeyCode: keyCode });
    await chrome.send("Input.dispatchKeyEvent", { type: "keyUp", key: name, code, windowsVirtualKeyCode: keyCode });
    await sleep(160);
  };
  const openLesson = async (id) => {
    await evaluate(`window.__s.open(${JSON.stringify(id)}); return 1;`);
    return waitFor(`document.querySelector(".cv2-lesson h2") && document.querySelector(".cv2-lesson h2").textContent.trim() === ${JSON.stringify(lessonOf(id).title)} && (document.querySelector("[data-cv2s]") || document.querySelector("[data-course-concept]"))`);
  };
  // 把目前這一節點完：出完句子、做動作（小測選正解、先猜選第一個、拖圖拖進範圍）；回傳這一節的種類
  const finishSection = async (lesson) => {
    const si = await evaluate(`return window.__s.si();`);
    const sec = lesson.sections[si];
    for (let k = 0; k < sec.beats.length && (await evaluate(`return window.__s.beats();`)) < sec.beats.length; k += 1) await tap('[data-cv2s-next]');
    if (sec.check !== undefined) await tap(`[data-action="course-s-pick"][data-kind="check"][data-option="${correctOf(lesson.checks[sec.check])}"]`);
    if (sec.predict) await tap(`[data-action="course-s-pick"][data-kind="predict"][data-option="0"]`);
    if (sec.drag) {
      const v = (sec.drag.range[0] + sec.drag.range[1]) / 2;
      await evaluate(`const i = window.__s.fig(${sec.drag.use}).querySelector("input"); i.value = "${v}"; i.dispatchEvent(new Event("input", { bubbles: true })); i.dispatchEvent(new Event("change", { bubbles: true })); return 1;`);
      await sleep(200);
    }
    return sec.check !== undefined ? "check" : sec.predict ? "predict" : "drag";
  };

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await chrome.navigate(`${server.url}/index.html`);
    // 導覽（coach marks）會蓋住真的觸控事件：當作看過了（跟 e2e_mobile 同一招）
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await evaluate(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    check("新手進課程表", await waitFor('document.querySelector(".cv2-index")'));
    check("課程表還沒抓分節的那一支", (await evaluate(`return window.__s.files();`)) === 0);

    /* ── 第一課：預設一節一屏 ── */
    check(`打開 ${FIRST.id}`, await openLesson(FIRST.id));
    const first = await evaluate(`return {
      root: Boolean(window.__s.root()), page: Boolean(document.querySelector("[data-course-concept]")),
      secs: document.querySelectorAll("[data-cv2s] .cv2s-sec").length, dots: document.querySelectorAll(".cv2s-dot").length,
      seg: [...document.querySelectorAll('[data-action="course-s-mode"]')].map((b) => b.textContent.trim() + ":" + b.getAttribute("aria-pressed")).join(","),
      beats: window.__s.beats(), files: window.__s.files(), si: window.__s.si(), action: Boolean(document.querySelector("[data-cv2s-act]")) };`);
    check("預設是分節：一節一屏、不是整頁", first.root && !first.page && first.secs === 1 && first.si === 0, JSON.stringify(first));
    check(`節的進度點 ${FIRST.sections.length} 個`, first.dots === FIRST.sections.length, String(first.dots));
    check("頁首「分節／全文」切換，分節按下", first.seg === "分節:true,全文:false", first.seg);
    check("打開有分節的課才抓 course_sections.js", first.files === 1);
    check("一開始只有第一句、還沒有動作", first.beats === 1 && !first.action);

    // 下一句：按鈕、點句子那一塊、→ 鍵
    await tap("[data-cv2s-next]");
    check("「下一句」出第二句", (await evaluate(`return window.__s.beats();`)) === 2);
    await tap(".cv2s-beats");
    check("點句子那一塊出第三句", (await evaluate(`return window.__s.beats();`)) === 3);
    await key("ArrowRight", "ArrowRight", 39);
    const s1 = FIRST.sections[0];
    check("→ 鍵出下一句", (await evaluate(`return window.__s.beats();`)) === 4);
    const midBeat = await evaluate(`const now = document.querySelector("[data-cv2s] .cv2s-beat.is-now"); return { last: now && now.dataset.beat, note: window.__s.text("[data-cv2s] .cv2s-beat.is-now .cv2s-note"), act: Boolean(document.querySelector('[data-cv2s-act="check"]')), bar: window.__s.text("[data-cv2s-next]") };`);
    check("最新那一句亮著、白話那一句在畫面上", midBeat.last === String(s1.beats.length - 1) && midBeat.note.length > 0, JSON.stringify(midBeat));
    check("句子都出來之後才有結尾的小測，按鈕變「下一節」", midBeat.act && /下一節/.test(midBeat.bar), midBeat.bar);
    await tap(".cv2s-beats");
    check("句子出完後點句子那一塊不會換節", (await evaluate(`return window.__s.si();`)) === 0);

    // 小測：選錯當下有理由、還沒給 XP；再選對 → 打勾、+5 XP、記進今天
    const q = FIRST.checks[s1.check];
    await tap(`[data-action="course-s-pick"][data-kind="check"][data-option="${wrongOf(q)}"]`);
    const wrong = await evaluate(`return { why: window.__s.text("[data-cv2s-act] .course-check-why"), xp: window.__s.rec().xp || 0, done: document.querySelector(".cv2s-dot").classList.contains("is-done") };`);
    check("選錯：當下就看到那個選項的理由", wrong.why.includes(q.options[wrongOf(q)].why.replace(/\$[^$]*\$/g, "").slice(0, 4)) && !wrong.done, wrong.why.slice(0, 40));
    check("選錯還沒給 XP", wrong.xp === 0, String(wrong.xp));
    await shot("phone-light-action-wrong");
    await tap(`[data-action="course-s-pick"][data-kind="check"][data-option="${correctOf(q)}"]`);
    const right = await evaluate(`const r = window.__s.rec(); const e = (r.courseV2 || {})["${FIRST.id}"] || {}; return { ok: /對了/.test(window.__s.text("[data-cv2s-act]")), dot: document.querySelector(".cv2s-dot").classList.contains("is-done"), chip: window.__s.text(".cv2s-xp"), xp: r.xp || 0, secDone: e.secDone || [], day: (r.courseReadDays || {})[window.__s.today()] || 0, primary: document.querySelector("[data-cv2s-next]").classList.contains("home-primary") };`);
    check("重選對了：打勾、第一個點變成做完", right.ok && right.dot, JSON.stringify(right));
    check("這一節 +5 XP（畫面與紀錄）", right.chip === "+5 XP" && right.xp === 5 && right.secDone.join() === "0", `${right.chip} · xp ${right.xp}`);
    check("今天記一節（連勝、每日任務用）", right.day === 1, String(right.day));
    check("做完之後「下一節」是主按鈕", right.primary);
    await sleep(700);
    const reach = await evaluate(`const b = document.querySelector("[data-cv2s-next]").getBoundingClientRect(); const nav = document.querySelector(".topbar-nav"); const limit = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().top : innerHeight; const hit = document.elementFromPoint(b.left + 20, b.top + b.height / 2); return { bottom: Math.round(b.bottom), limit: Math.round(limit), mine: Boolean(hit && hit.closest("[data-cv2s-next]")) };`);
    check("「下一節」自己捲進畫面、沒被底部分頁列蓋住", reach.bottom <= reach.limit && reach.mine, JSON.stringify(reach));
    const geo = await evaluate(`return { overflow: window.__s.overflow(), small: window.__s.small() };`);
    check("390 寬沒有橫向溢出", geo.overflow <= 1, `${geo.overflow}px`);
    check("分節裡的按鈕都 ≥ 40px", !geo.small.length, JSON.stringify(geo.small.slice(0, 4)));
    await shot("phone-light-action");

    // 下一節、記到節
    await tap("[data-cv2s-next]");
    const nextSec = await evaluate(`const e = (window.__s.rec().courseV2 || {})["${FIRST.id}"] || {}; return { si: window.__s.si(), beats: window.__s.beats(), at: e.secAt, y: Math.round(scrollY), title: window.__s.text("[data-cv2s] .cv2s-sec h3") };`);
    check("下一節：第 2 節、從第一句開始、捲回頂端", nextSec.si === 1 && nextSec.beats === 1 && nextSec.y === 0, JSON.stringify(nextSec));
    check("記到第 2 節", nextSec.at === 1, String(nextSec.at));
    await chrome.navigate(`${server.url}/index.html`);
    check("重新整理後再打開：從第 2 節接", (await openLesson(FIRST.id)) && (await waitFor(`window.__s.si() === 1`)), String(await evaluate(`return window.__s.si();`)));

    // 不碰聲音、只點：第 2 到最後一節點完
    for (let si = 1; si < FIRST.sections.length; si += 1) {
      if (si === 2) {
        await tap("[data-cv2s-next]");
        await shot("phone-light-midbeat");
        await tap("[data-cv2s-next]");
      }
      const kind = await finishSection(FIRST);
      check(`第 ${si + 1} 節（${kind}）點完：打勾`, await waitFor(`document.querySelectorAll(".cv2s-dot")[${si}].classList.contains("is-done")`, 3000), JSON.stringify(await evaluate(`return { si: window.__s.si(), beats: window.__s.beats(), act: window.__s.text("[data-cv2s-act]").slice(0, 80), y: scrollY };`)));
      await tap("[data-cv2s-next]");
    }
    check("最後一節之後是結算", await waitFor(`document.querySelector("[data-cv2s-finish]")`));
    const fin = await evaluate(`const r = window.__s.rec(); const e = (r.courseV2 || {})["${FIRST.id}"] || {}; return {
      head: window.__s.text("[data-cv2s-finish] h3"), goals: [...document.querySelectorAll(".cv2s-goals li")].map((li) => ({ todo: li.classList.contains("is-todo"), text: li.textContent.trim().slice(0, 8) })),
      stats: window.__s.text("[data-cv2s-stats]"), xp: r.xp || 0, lessonXp: e.xp || 0, tierXp: e.tierXp || 0, done: Boolean(e.doneAt), secDone: (e.secDone || []).join(),
      next: window.__s.text('[data-cv2s-finish] [data-action="open-course-lesson"]'), map: Boolean(document.querySelector('[data-cv2s-finish] [data-action="course-map-focus"][data-lit="1"]')), overflow: window.__s.overflow() };`);
    const sectionXp = 5 * FIRST.sections.length;
    check("結算：「你現在會：」＋這一課的學習目標全部打勾", /你現在會/.test(fin.head) && fin.goals.length === FIRST.objectives.length && fin.goals.every((g) => !g.todo), JSON.stringify(fin.goals));
    check("小測四題都在分節裡做完 → 這一課「完成」（第一題第一次選錯，3 / 4）", fin.done && fin.tierXp === 1, `doneAt ${fin.done} · tierXp ${fin.tierXp}`);
    check(`XP：每節 5 × ${FIRST.sections.length} ＋ 完成 20 = ${sectionXp + 20}，畫面直接寫總數`, fin.lessonXp === sectionXp + 20 && fin.xp === sectionXp + 20 && fin.stats.includes(`+${sectionXp + 20}`), fin.stats);
    check("結算有「下一課」與「在地圖上看」", /下一課：0\.2/.test(fin.next) && fin.map, fin.next);
    check("結算 390 寬不溢出", fin.overflow <= 1);
    await shot("phone-light-finish");

    // 在地圖上看：地圖打開、這一課亮一下，然後自己消失
    await tap('[data-cv2s-finish] [data-action="course-map-focus"]');
    check("在地圖上看：地圖打開、這一課亮起來", await waitFor(`window.BuzzCourseMap && window.BuzzCourseMap.debug().lit === "${FIRST.id}" && document.querySelector('[data-cv2-map][data-lit="${FIRST.id}"]')`, 8000));
    const lit = await evaluate(`return window.BuzzCourseMap.debug();`);
    check("停在那一課", lit.selected === FIRST.id, lit.selected);
    await shot("phone-light-map-lit");
    check("亮一下就消失（一次性）", await waitFor(`window.BuzzCourseMap.debug().lit === "" && !document.querySelector("[data-cv2-map][data-lit]")`, 4000));

    // 重開這一課、重做最後一節：XP 不再加
    check("再打開：從最後一節接", (await openLesson(FIRST.id)) && (await waitFor(`window.__s.si() === ${FIRST.sections.length - 1}`)));
    await finishSection(FIRST);
    const again = await evaluate(`const r = window.__s.rec(); return { xp: r.xp || 0, chip: window.__s.text(".cv2s-xp"), day: (r.courseReadDays || {})[window.__s.today()] || 0 };`);
    check("重做一節：XP 不再加（一節只發一次）", again.xp === sectionXp + 20 && again.chip === "", JSON.stringify(again));

    // 每日任務與連勝
    await evaluate(`const b = document.querySelector('[data-action="home"]'); if (b) b.click(); return 1;`);
    await waitFor(`document.querySelector(".home-screen")`);
    const home = await evaluate(`const row = [...document.querySelectorAll(".quest-row")].find((r) => /讀一節課/.test(r.textContent)); return { quest: row ? row.querySelector(".quest-count").textContent.trim() : "", done: row ? row.classList.contains("is-done") : false, streak: window.__s.text(".streak-number") };`);
    check("每日任務「讀一節課」1/1", home.quest === "1/1" && home.done, JSON.stringify(home));
    check("讀一節課也算進連勝：1 天", /1 天/.test(home.streak), home.streak);

    /* ── 第二課：全文切換、記住 ── */
    check(`打開 ${SECOND.id}`, await openLesson(SECOND.id));
    await waitFor(`window.__s.root()`);
    await tap('[data-action="course-s-mode"][data-mode="full"]');
    const full = await evaluate(`return { page: Boolean(document.querySelector("[data-course-concept]")), root: Boolean(window.__s.root()), pref: (window.__s.rec().settings || {}).courseView, seg: [...document.querySelectorAll('[data-action="course-s-mode"]')].map((b) => b.getAttribute("aria-pressed")).join() };`);
    check("「全文」：整頁回來", full.page && !full.root && full.seg === "false,true", JSON.stringify(full));
    check("選擇記在紀錄裡", full.pref === "full", String(full.pref));
    await chrome.navigate(`${server.url}/index.html`);
    check("重新整理再打開：還是全文", (await openLesson(SECOND.id)) && (await evaluate(`return Boolean(document.querySelector("[data-course-concept]")) && !window.__s.root();`)));
    await tap('[data-action="course-s-mode"][data-mode="sec"]');
    check("切回「分節」", await waitFor(`window.__s.root()`, 4000) && !(await evaluate(`return (window.__s.rec().settings || {}).courseView || "";`)));

    /* ── 有 widget 的課：句子帶 fig，圖真的動；拖滑桿進範圍也算一個動作 ── */
    check(`打開 ${WIDGET.id}`, await openLesson(WIDGET.id));
    const w0 = WIDGET.sections[0].beats[0].fig;
    check(`第一句把 n 帶到 ${w0.to}`, await waitFor(`window.__s.fig(${w0.use}) && window.__s.fig(${w0.use}).dataset.value === "${w0.to}" && /n = ${w0.to} /.test(window.__s.fig(${w0.use}).querySelector("[data-cv2-readout]").textContent)`, 4000));
    const w1 = WIDGET.sections[0].beats[1].fig;
    await evaluate(`window.__s.watch(${w1.use}); return 1;`);
    await tap("[data-cv2s-next]");
    await sleep(1300);
    const vals = await evaluate(`return window.__vals;`);
    check(`下一句：n 從 ${w0.to} 平滑地動到 ${w1.to}（中間有過渡值）`, vals[vals.length - 1] === String(w1.to) && vals.length >= 3, vals.join("→"));
    const slider = await evaluate(`const f = window.__s.fig(${w1.use}); return { input: f.querySelector("input").value, readout: f.querySelector("[data-cv2-readout]").textContent };`);
    check("滑桿與讀數跟著到那一格", slider.input === String(w1.to) && new RegExp(`n = ${w1.to} `).test(slider.readout), JSON.stringify(slider));
    await shot("phone-light-widget");
    // reduced-motion：直接跳
    await chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    const dragSi = WIDGET.sections.findIndex((s) => s.drag);
    await tap(`.cv2s-dot:nth-child(${dragSi + 1})`);
    await waitFor(`window.__s.si() === ${dragSi}`);
    const d0 = WIDGET.sections[dragSi].beats[0].fig;
    const d1 = WIDGET.sections[dragSi].beats[1].fig;
    await sleep(200);
    await evaluate(`window.__s.watch(${d1.use}); return 1;`);
    await tap("[data-cv2s-next]");
    await sleep(1300);
    const still = (await evaluate(`return window.__vals;`)).filter((v, i) => !(i === 0 && v === String(d0.to)));
    check(`reduced-motion：直接跳到 ${d1.to}，沒有過渡值`, still.length === 1 && still[0] === String(d1.to), `${d0.to} → ${still.join("→")}`);
    await chrome.send("Emulation.setEmulatedMedia", { features: [] });
    for (let k = 2; k < WIDGET.sections[dragSi].beats.length; k += 1) await tap("[data-cv2s-next]");
    const dragAct = await evaluate(`return { act: Boolean(document.querySelector('[data-cv2s-act="drag"]')), done: document.querySelector('[data-cv2s-act="drag"]').classList.contains("is-done"), video: Boolean(document.querySelector("[data-cv2s] [data-cv2-video]")) };`);
    check("拖圖的動作出現（還沒做到）", dragAct.act && !dragAct.done);
    if (WIDGET.sections[dragSi].video) check("這一節帶著這一課的影片", dragAct.video);
    const stick = await evaluate(`scrollTo(0, document.documentElement.scrollHeight); await new Promise((r) => setTimeout(r, 150)); const f = window.__s.fig(${WIDGET.sections[dragSi].drag.use}).getBoundingClientRect(); const bar = document.querySelector(".topbar").getBoundingClientRect(); return { fig: Math.round(f.top), bar: Math.round(bar.bottom), y: Math.round(scrollY) };`);
    check("手機：捲到底時圖黏在頂列下面（句子在下面長、圖一直看得到）", stick.y > 0 && Math.abs(stick.fig - stick.bar) <= 1, JSON.stringify(stick));
    await shot("phone-light-widget-sticky");
    const xpBefore = await evaluate(`return window.__s.rec().xp || 0;`);
    await finishSection(WIDGET);
    const dragDone = await evaluate(`return { done: document.querySelector('[data-cv2s-act="drag"]').classList.contains("is-done"), dot: document.querySelectorAll(".cv2s-dot")[${dragSi}].classList.contains("is-done"), xp: window.__s.rec().xp || 0 };`);
    check("拖進範圍：動作完成、這一節打勾、+5 XP", dragDone.done && dragDone.dot && dragDone.xp === xpBefore + 5, JSON.stringify(dragDone));

    /* ── 深色 ── */
    await evaluate(`document.documentElement.dataset.theme = "dark"; return 1;`);
    check(`深色：打開 ${SECOND.id}`, await openLesson(SECOND.id));
    await tap(".cv2s-dot:nth-child(3)");
    await waitFor(`window.__s.si() === 2`);
    await tap("[data-cv2s-next]");
    await tap("[data-cv2s-next]");
    await shot("phone-dark-midbeat");
    await finishSection(SECOND);
    await shot("phone-dark-action");
    check(`深色：打開 ${FIRST.id} 到結算`, (await openLesson(FIRST.id)) && (await waitFor(`window.__s.si() === ${FIRST.sections.length - 1}`)));
    await finishSection(FIRST);
    await tap("[data-cv2s-next]");
    check("深色：結算", await waitFor(`document.querySelector("[data-cv2s-finish]")`));
    await shot("phone-dark-finish");
    await evaluate(`document.documentElement.dataset.theme = "light"; return 1;`);

    /* ── 桌機 ── */
    touch = false;
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await chrome.send("Emulation.setDeviceMetricsOverride", DESKTOP);
    check(`桌機：打開 ${SECOND.id}`, await openLesson(SECOND.id));
    await tap(".cv2s-dot:nth-child(1)");
    await waitFor(`window.__s.si() === 0`);
    await key("ArrowRight", "ArrowRight", 39);
    const desk = await evaluate(`const col = window.__s.root().getBoundingClientRect(); const main = document.querySelector("main.screen").getBoundingClientRect(); return { w: Math.round(col.width), center: Math.abs((col.left + col.right) / 2 - (main.left + main.right) / 2), overflow: window.__s.overflow(), beats: window.__s.beats() };`);
    check("桌機：分節欄最寬 40em、在內容區置中", desk.w <= 720 && desk.center < 2, `${desk.w}px · 偏 ${desk.center.toFixed(1)}px`);
    check("桌機：→ 鍵出下一句", desk.beats === 2, String(desk.beats));
    check("桌機沒有橫向溢出", desk.overflow <= 1);
    await shot("desktop-light");

    const errors = chrome.pageErrors.concat(chrome.consoleMessages.filter((m) => m.type === "error" && !/ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(m.text)).map((m) => m.text));
    check("console 沒有錯誤", !errors.length, errors.slice(0, 3).join(" | "));
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
  ciFail("e2e_course_sections crashed", error.message);
  process.exit(1);
});
