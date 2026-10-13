// 第一分鐘：全新的人用手機打開首頁，能不能在 60 秒內找到並答對第一題（商業手冊第 04 章、附錄 C 的上線檢查）。
//
// 怎麼走：手機 390×844、觸控、空的儲存空間（全新的 Chrome profile）。每一步只按**看得到的**東西：
//   畫面上有主按鈕（.home-primary / .button.primary）就按它；開局流程第 2 步的五張階段卡沒有主次之分，
//   照人物設定按「大一微積分」（手冊第 04 章的主要受眾；按「我還沒學過」走的是入門課，另外由 e2e_beginner／課程那幾支管）。
//   到了題目：選擇題按正確的那個選項，輸入題點輸入框、打字、按送出。正解從題庫查（測試的答案卷），按的仍是畫面上的那顆。
//   每一下都是 CDP 的真觸控（Input.dispatchTouchEvent），按之前確認那個點上最上層的就是這顆按鈕（沒被浮層蓋住）；
//   不在畫面裡就像人一樣捲過去（記一次捲動）。
//
// 量什麼（印出來）：
//   - 從導覽開始到「答對」回饋出現的牆上時間（node 端量，含測試本身的輪詢）與頁面時鐘（performance.now，導覽開始 = 0）
//   - 第一題可以作答的時間（選項或輸入框第一次出現）
//   - 按了幾下、捲了幾次、每一步花多久
// 斷言：答對回饋 ≤ 60 秒（CI 的 runner 上也一樣，BUZZ_E2E_SLOW 只放寬等待的上限，不放寬這個數字）。
//
// 第二段：量測漏斗（docs/metrics.md）在真的頁面上送了什麼 —— landing_view → problem_start → answer_submit →
// answer_correct → second_question_complete，共同欄位（subject_id、session_id 在 sessionStorage），不帶打的答案；
// 回訪：本機的「第一次見到」改成 1 天前 → return_d1、7 天前 → return_7d（各只一次）、舊使用者不送；
// 分析關掉：沒有 dataLayer／gtag、沒抓 gtag.js 也沒抓 metrics.js、本機沒寫日期。GA 的請求一律攔下來回空的，不會真的送出去。
//
// 用法：node tools/e2e_first_minute.js

"use strict";

const path = require("path");
const { launch, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const SLOW = Math.max(1, Number(process.env.BUZZ_E2E_SLOW || 1) || 1);
const LIMIT_MS = 60000;
const PERSONA = "大一微積分";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };

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

// 開站前就裝好的量測（只記時間，不改 app 的行為）：第一題可作答、答對回饋各是導覽開始後第幾毫秒。
// __BUZZ_TEST_HOOKS__ 讓測試拿得到 checkAnswer（答案卷），畫面不變。
const PROBE = `
  window.__BUZZ_TEST_HOOKS__ = window.__BUZZ_TEST_HOOKS__ || {};
  window.__fm = { problemAt: 0, correctAt: 0, renderedAt: 0 };
  (function () {
    const vis = (n) => { if (!n) return false; const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const look = () => {
      const fm = window.__fm;
      if (!fm.renderedAt) { const app = document.getElementById("app"); if (app && !app.querySelector(".app-skeleton") && app.innerHTML.length > 500) fm.renderedAt = performance.now(); }
      if (!fm.problemAt && [...document.querySelectorAll('[data-action="choose-answer"]:not([disabled]), .answer-input')].some(vis)) fm.problemAt = performance.now();
      if (!fm.correctAt && [...document.querySelectorAll(".feedback.correct, .toast, [role=status]")].some((n) => vis(n) && (n.classList.contains("correct") || /^\\s*答對/.test(n.textContent || "")))) fm.correctAt = performance.now();
    };
    const start = () => { new MutationObserver(look).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }); look(); };
    if (document.documentElement) start(); else document.addEventListener("DOMContentLoaded", start);
  })();
`;

const HELPERS = `
  window.__f = {
    vis(n) { if (!n) return false; const r = n.getBoundingClientRect(); const s = getComputedStyle(n); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; },
    // 主內容裡看得到的東西（不含頂列、分頁列）
    main() { return [...document.querySelectorAll("button, a, input, [data-action]")].filter((n) => window.__f.vis(n) && !n.closest(".topbar, .bottom-nav, .tabbar, nav, header")); },
    // 畫面上最顯眼的主按鈕
    primary() { return window.__f.main().find((n) => n.matches(".home-primary, .button.primary, .placement-cta") && !n.disabled) || null; },
    byText(needle) { return window.__f.main().find((n) => (n.innerText || "").replace(/\\s+/g, " ").includes(needle)) || null; },
    // 現在這一題：題庫裡題幹相同的那一題（題幹在 .prompt[data-tex]）
    problem() {
      const tex = (document.querySelector(".prompt[data-tex]") || {}).dataset;
      if (!tex) return null;
      const all = window.BUZZ_PROBLEMS || [];
      return all.find((p) => p.prompt === tex.tex) || null;
    },
    correctChoice() {
      const p = window.__f.problem();
      const api = window.__BUZZ_TEST_HOOKS__ && window.__BUZZ_TEST_HOOKS__.api;
      const opts = [...document.querySelectorAll('[data-action="choose-answer"]')].filter(window.__f.vis);
      if (!p || !api) return { index: -1, id: p ? p.id : "" };
      const index = opts.findIndex((o) => { try { return api.checkAnswer(p, o.dataset.choice || "").correct; } catch (e) { return false; } });
      return { index, id: p.id, answer: p.answer };
    },
    wrongChoice() {
      const opts = [...document.querySelectorAll('[data-action="choose-answer"]')].filter(window.__f.vis);
      const c = window.__f.correctChoice().index;
      return opts.findIndex((o, i) => i !== c);
    },
    // 把一個元素變成觸控座標：不在畫面裡就捲過去（人也會捲），再確認那個點最上層是它
    target(el) {
      if (!el) return null;
      let scrolled = false;
      let r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const navTop = Math.min(...[...document.querySelectorAll(".bottom-nav, .tabbar, .topbar-nav")].filter(window.__f.vis).map((n) => n.getBoundingClientRect().top).filter((t) => t > vh / 2), vh);
      if (r.top < 60 || r.bottom > navTop) { el.scrollIntoView({ block: "center" }); scrolled = true; r = el.getBoundingClientRect(); }
      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(r.top + r.height / 2);
      const top = document.elementFromPoint(x, y);
      return { x, y, scrolled, covered: !(top && (top === el || el.contains(top))), coveredBy: top && top !== el && !el.contains(top) ? (top.className || top.tagName).toString().slice(0, 60) : "", label: (el.innerText || el.value || "").replace(/\\s+/g, " ").trim().slice(0, 24) };
    },
    events(prefix) { return (window.dataLayer || []).filter((a) => a && a[0] === "event" && String(a[1]).startsWith(prefix || "")).map((a) => ({ name: a[1], p: a[2] || {} })); },
    day(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); },
    metricsKey() { try { return JSON.parse(localStorage.getItem("buzzcalculus.metrics.v1") || "null"); } catch (e) { return null; } },
    sessionKey() { try { return JSON.parse(sessionStorage.getItem("buzzcalculus.metrics.session") || "null"); } catch (e) { return null; } }
  };
`;

async function run() {
  console.log("E2E 第一分鐘（新手、手機）");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const evaluate = (code) => chrome.evaluate(`${HELPERS}\n${code}`);
  // 輪詢不用 chrome.sleep（它會乘 BUZZ_E2E_SLOW）：量的是真實時間，輪詢間隔要小；只有逾時上限乘倍率
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (expr, ms = 10000) => {
    for (const deadline = Date.now() + ms * SLOW; Date.now() < deadline; await pause(60)) {
      try { if (await evaluate(`return Boolean(${expr});`)) return true; } catch (_e) { /* 換頁中 */ }
    }
    return false;
  };
  const ga = [];
  chrome.on("Fetch.requestPaused", (p) => {
    ga.push(p.request.url);
    chrome.send("Fetch.fulfillRequest", { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/javascript" }], body: "" }).catch(() => {});
  });
  const phone = async () => {
    await chrome.send("Emulation.setDeviceMetricsOverride", PHONE);
    // setDeviceMetricsOverride 會洗掉觸控模擬：每次都重設
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  };

  let taps = 0;
  let scrolls = 0;
  const trail = [];
  // 真的觸控：touchStart → touchEnd，瀏覽器自己合成 click
  const tap = async (finder, label) => {
    const t = await evaluate(`return window.__f.target(${finder});`);
    if (!t) return { ok: false, why: `畫面上找不到「${label}」` };
    if (t.scrolled) scrolls += 1;
    if (t.covered) return { ok: false, why: `「${label}」被 ${t.coveredBy} 蓋住` };
    await chrome.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: t.x, y: t.y }] });
    await chrome.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    taps += 1;
    trail.push({ label: t.label || label, at: Date.now() });
    return { ok: true };
  };

  try {
    await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: PROBE });
    await chrome.send("Fetch.enable", { patterns: [{ urlPattern: "*googletagmanager.com*", requestStage: "Request" }, { urlPattern: "*google-analytics.com*", requestStage: "Request" }] });
    await phone();

    /* ── 1. 第一分鐘 ── */
    const t0 = Date.now();
    await chrome.send("Page.navigate", { url: `${server.url}/index.html` });
    const rendered = await waitFor(`window.__fm && window.__fm.renderedAt`, 30000);
    check("首頁畫出來了", rendered);

    let answered = null;
    let stuck = "";
    for (let step = 0; step < 12 && !answered; step += 1) {
      // 等畫面停下來：有主按鈕、有階段卡、或題目可作答
      const ready = await waitFor(`window.__fm.problemAt || window.__f.primary() || window.__f.byText(${JSON.stringify(PERSONA)})`, 15000);
      if (!ready) { stuck = await evaluate(`return document.body.innerText.replace(/\\s+/g, " ").slice(0, 200);`); break; }
      const state = await evaluate(`return { problem: Boolean(window.__fm.problemAt), primary: window.__f.primary() ? window.__f.primary().innerText.trim() : "", persona: Boolean(window.__f.byText(${JSON.stringify(PERSONA)})) };`);
      if (state.problem) {
        // 題目：選擇題按正解；輸入題打正解
        await pause(150); // 選項的進場動畫
        const kind = await evaluate(`return document.querySelector('[data-action="choose-answer"]') ? "choice" : "input";`);
        if (kind === "choice") {
          const c = await evaluate(`return window.__f.correctChoice();`);
          if (c.index < 0) { stuck = `答案卷找不到這一題的正解（${c.id || "題庫裡沒有這個題幹"}）`; break; }
          const r = await tap(`[...document.querySelectorAll('[data-action="choose-answer"]')].filter(window.__f.vis)[${c.index}]`, "正確選項");
          if (!r.ok) { stuck = r.why; break; }
          answered = { kind, id: c.id };
        } else {
          const ans = await evaluate(`const p = window.__f.problem(); return p ? { id: p.id, answer: String(p.answer) } : null;`);
          if (!ans) { stuck = "答案卷找不到這一題"; break; }
          let r = await tap(`document.querySelector(".answer-input")`, "答案輸入框");
          if (!r.ok) { stuck = r.why; break; }
          await chrome.send("Input.insertText", { text: ans.answer });
          r = await tap(`[...document.querySelectorAll('[data-action="submit-answer"]')].find(window.__f.vis)`, "送出");
          if (!r.ok) { stuck = r.why; break; }
          answered = { kind, id: ans.id };
        }
      } else if (state.primary) {
        const r = await tap(`window.__f.primary()`, state.primary);
        if (!r.ok) { stuck = r.why; break; }
      } else {
        const r = await tap(`window.__f.byText(${JSON.stringify(PERSONA)})`, PERSONA);
        if (!r.ok) { stuck = r.why; break; }
      }
      // 等畫面換掉（避免同一顆按兩次）
      await pause(120);
    }
    const gotCorrect = answered ? await waitFor(`window.__fm.correctAt`, 10000) : false;
    const wall = Date.now() - t0;
    const fm = await evaluate(`return window.__fm;`);
    const steps = trail.map((s, i) => `${s.label} +${((s.at - (i ? trail[i - 1].at : t0)) / 1000).toFixed(1)}s`).join(" → ");
    console.log("");
    console.log(`  首頁畫出來       ${(fm.renderedAt / 1000).toFixed(1)} s（頁面時鐘，導覽開始 = 0）`);
    console.log(`  第一題可以作答   ${fm.problemAt ? (fm.problemAt / 1000).toFixed(1) + " s" : "沒有出現"}`);
    console.log(`  答對回饋         ${fm.correctAt ? (fm.correctAt / 1000).toFixed(1) + " s" : "沒有出現"}（頁面時鐘）／ 牆上時間 ${(wall / 1000).toFixed(1)} s`);
    console.log(`  按了             ${taps} 下（捲動 ${scrolls} 次）：${steps}`);
    console.log(`  題目             ${answered ? `${answered.id}（${answered.kind === "choice" ? "選擇題" : "輸入題"}）` : "—"}`);
    if (stuck) console.log(`  卡住             ${stuck}`);
    console.log("");
    check("新手跟著主按鈕走得到一題可以作答的題目", Boolean(fm.problemAt), stuck);
    check("第一題答對，畫面出現答對回饋", gotCorrect && Boolean(fm.correctAt), stuck || (answered ? answered.id : ""));
    check(`從打開首頁到答對 ≤ ${LIMIT_MS / 1000} 秒`, gotCorrect && fm.correctAt <= LIMIT_MS && wall <= LIMIT_MS + 5000 * SLOW, `頁面時鐘 ${(fm.correctAt / 1000).toFixed(1)}s、牆上 ${(wall / 1000).toFixed(1)}s`);
    check("一路上沒有被浮層蓋住、沒有卡住", !stuck, stuck);

    /* ── 2. 量測漏斗：這一趟送了什麼 ── */
    await waitFor(`window.__f.events("answer_correct").length`, 5000);
    const ev = await evaluate(`return window.__f.events("");`);
    const names = ev.map((e) => e.name);
    const first = (n) => ev.find((e) => e.name === n);
    const at = (n) => names.indexOf(n);
    const landing = first("landing_view");
    check("landing_view 一次（screen = home、visitor = new）", names.filter((n) => n === "landing_view").length === 1 && landing.p.screen === "home" && landing.p.visitor === "new", JSON.stringify(landing && landing.p));
    check("漏斗順序：landing_view → problem_start（practice_open）→ answer_submit → answer_correct",
      at("landing_view") >= 0 && at("landing_view") < at("problem_start") && at("problem_start") < at("answer_submit") && at("answer_submit") < at("answer_correct"), names.filter((n) => /landing|problem_|answer_/.test(n)).join(" → "));
    const sub = first("answer_submit");
    check("answer_submit 帶題號、難度、對錯、seq = 1", sub && sub.p.problem_id === answered.id && sub.p.correct === true && sub.p.seq === 1 && Number(sub.p.difficulty) >= 1, JSON.stringify(sub && sub.p));
    const cor = first("answer_correct");
    check("answer_correct 帶距開站幾秒（≤ 60）", cor && cor.p.secs_since_landing >= 0 && cor.p.secs_since_landing <= 60, JSON.stringify(cor && cor.p));
    const sess = await evaluate(`return window.__f.sessionKey();`);
    const ids = new Set(ev.map((e) => e.p.session_id).filter(Boolean));
    check("每個事件帶同一個 session_id，而且就是 sessionStorage 那一個", ids.size === 1 && sess && ids.has(sess.id) && ev.filter((e) => e.name !== "landing_view").every((e) => e.p.session_id === sess.id), [...ids].join(","));
    check("每個事件帶 subject_id = calculus", ev.every((e) => e.p.subject_id === "calculus"));
    check("session_id 沒有進 localStorage", await evaluate(`return !Object.keys(localStorage).some((k) => (localStorage.getItem(k) || "").includes(${JSON.stringify(sess ? sess.id : "@@")}));`));
    const typed = answered.kind === "input" ? await evaluate(`const p = window.__f.problem(); return p ? String(p.answer) : "";`) : "";
    check("事件裡沒有作答內容（input / draft / answer 欄位）", ev.every((e) => !("input" in e.p) && !("draft" in e.p) && !("answer" in e.p)) && (!typed || !JSON.stringify(ev).includes(typed)));
    check("還沒有 second_question_complete（才做完一題）", !names.includes("second_question_complete"));
    const mk = await evaluate(`return window.__f.metricsKey();`);
    const today = await evaluate(`return window.__f.day();`);
    check("本機記下第一次見到的日期（今天）", mk && mk.first === today && !mk.legacy, JSON.stringify(mk));
    check("分析開著：有去抓 gtag.js（被測試攔下來）與 metrics.js", ga.some((u) => /googletagmanager/.test(u)) && (await evaluate(`return performance.getEntriesByType("resource").some((e) => /kernel\\/metrics\\.js/.test(e.name));`)));

    // 第二題：等自動換題（定位測驗答對會自己往下），這次故意選錯 —— 對錯都算「完成」
    const second = await waitFor(`document.querySelector('[data-action="choose-answer"]:not([disabled])') && window.__f.problem() && window.__f.problem().id !== ${JSON.stringify(answered.id)}`, 15000);
    check("答對之後自己換到下一題", second);
    if (second) {
      const w = await evaluate(`return window.__f.wrongChoice();`);
      await tap(`[...document.querySelectorAll('[data-action="choose-answer"]')].filter(window.__f.vis)[${w}]`, "錯的選項");
      await waitFor(`window.__f.events("second_question_complete").length`, 8000);
      const ev2 = await evaluate(`return window.__f.events("");`);
      const sq = ev2.filter((e) => e.name === "second_question_complete");
      const subs = ev2.filter((e) => e.name === "answer_submit");
      check("第二題答錯：answer_submit（correct = false、seq = 2），沒有多一個 answer_correct", subs.length === 2 && subs[1].p.correct === false && subs[1].p.seq === 2 && ev2.filter((e) => e.name === "answer_correct").length === 1, JSON.stringify(subs.map((s) => s.p)));
      check("second_question_complete 送一次", sq.length === 1 && sq[0].p.secs_since_landing >= 0, JSON.stringify(sq.map((s) => s.p)));
    }

    /* ── 3. 回訪：本機「第一次見到」往前撥 ── */
    // 舊頁面標一下：Page.reload 馬上回來，舊頁面上的 landing_view 還在 —— 要等到新的那一頁
    const reload = async () => {
      await evaluate(`window.__stale = 1; return 1;`);
      await chrome.send("Page.reload", {});
      await waitFor(`!window.__stale && window.__fm && window.__fm.renderedAt && window.__f.events("landing_view").length`, 20000);
      await pause(300);
    };
    const shift = (days) => evaluate(`const d = new Date(); d.setDate(d.getDate() - ${days}); localStorage.setItem("buzzcalculus.metrics.v1", JSON.stringify({ first: window.__f.day(d) })); return 1;`);
    await shift(1);
    await reload();
    let r = await evaluate(`return { d1: window.__f.events("return_d1").map((e) => e.p), d7: window.__f.events("return_7d").length, landing: window.__f.events("landing_view")[0].p, sess: window.__f.sessionKey() };`);
    check("第一次見到是昨天 → return_d1 { days_since_first: 1 }", r.d1.length === 1 && r.d1[0].days_since_first === 1 && r.d7 === 0, JSON.stringify(r.d1));
    check("重新整理：landing_view 再記一次（每次載入一次）、visitor = returning、同一個 session", r.landing.visitor === "returning" && r.sess && sess && r.sess.id === sess.id, JSON.stringify(r.landing));
    await reload();
    r = await evaluate(`return window.__f.events("return_d1").length;`);
    check("同一天再打開不重送 return_d1", r === 0);
    await shift(7);
    await reload();
    r = await evaluate(`return window.__f.events("return_7d").map((e) => e.p);`);
    check("第一次見到是 7 天前 → return_7d { days_since_first: 7 }（嚴格 D7）", r.length === 1 && r[0].days_since_first === 7, JSON.stringify(r));
    await reload();
    r = await evaluate(`return window.__f.events("return_7d").length;`);
    check("return_7d 只送一次", r === 0);
    await shift(20);
    await reload();
    r = await evaluate(`return window.__f.events("return_").length;`);
    check("第 20 天：不在 7–13 天的窗內，什麼都不送", r === 0);
    // 舊使用者（這支上線前就在用）：紀錄裡已經有練習、本機沒有日期 → 標 legacy、不送回訪
    await evaluate(`const r = JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}"); r.totalAnswered = Math.max(12, Number(r.totalAnswered) || 0); r.lastPlayed = new Date(Date.now() - 3 * 864e5).toISOString(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(r)); localStorage.removeItem("buzzcalculus.metrics.v1"); return 1;`);
    await reload();
    r = await evaluate(`return { key: window.__f.metricsKey(), landing: window.__f.events("landing_view")[0].p };`);
    check("上線前就在用的人：標 legacy、visitor = returning", r.key && r.key.legacy === 1 && r.landing.visitor === "returning", JSON.stringify(r));
    await evaluate(`const d = new Date(); d.setDate(d.getDate() - 7); const k = window.__f.metricsKey(); k.first = window.__f.day(d); localStorage.setItem("buzzcalculus.metrics.v1", JSON.stringify(k)); return 1;`);
    await reload();
    check("legacy 的人第 7 天也不送 return_7d", (await evaluate(`return window.__f.events("return_").length;`)) === 0);

    /* ── 4. 分析關掉：什麼都不載、不寫、不送 ── */
    await evaluate(`const r = JSON.parse(localStorage.getItem("buzzcalculus.records.v1") || "{}"); r.settings = { ...(r.settings || {}), analytics: "off" }; localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(r)); localStorage.removeItem("buzzcalculus.metrics.v1"); sessionStorage.clear(); return 1;`);
    ga.length = 0;
    await evaluate(`window.__stale = 1; return 1;`);
    await chrome.send("Page.reload", {});
    await waitFor(`!window.__stale && window.__fm && window.__fm.renderedAt`, 20000);
    await pause(2500); // gtag.js 與 metrics.js 是閒下來才載：多等一下確定真的沒有
    const off = await evaluate(`return { dl: typeof window.dataLayer, gtag: typeof window.gtag, metrics: typeof window.BuzzMetrics, file: performance.getEntriesByType("resource").some((e) => /kernel\\/metrics\\.js/.test(e.name)), key: localStorage.getItem("buzzcalculus.metrics.v1"), sess: sessionStorage.getItem("buzzcalculus.metrics.session") };`);
    check("分析關掉：沒有 dataLayer／gtag、沒有 GA 請求", off.dl === "undefined" && off.gtag === "undefined" && ga.length === 0, `${off.dl} ${off.gtag} ${ga.join(" ")}`);
    check("分析關掉：metrics.js 沒有載、本機沒寫日期也沒有 session_id", off.metrics === "undefined" && !off.file && off.key === null && off.sess === null, JSON.stringify(off));
    check("分析關掉：頁面沒有錯誤", chrome.pageErrors.length === 0, chrome.pageErrors.join(" | "));
  } finally {
    await chrome.close();
    if (server && server.close) server.close();
  }

  console.log("");
  if (failures.length) {
    console.log(`第一分鐘 E2E 失敗 ${failures.length} 項（通過 ${passed}）：`);
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
  console.log(`第一分鐘 E2E 全部通過（${passed} 項）`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  ciFail("e2e_first_minute 例外", String(error && error.message));
  process.exit(1);
});
