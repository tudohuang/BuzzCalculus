// E2E：互動圖形題真的點得到、拖得動
//
// 這兩個題型的失敗方式，字串比對一個都抓不到：
//   - SVG 有 render，但 pointer 事件沒綁上 → 點下去什麼都不會發生
//   - 座標換算方向錯（y 軸沒有翻） → 標記出現在鏡射的位置
//   - touch-action 沒設 → 手機上一拖就變成整頁捲動
// 所以這支只斷言「派真的事件進去之後畫面有沒有變、判分對不對」。
//
// 用法：node tools/e2e_graph_interactive.js [--keep]

"use strict";

const path = require("path");
const { launch, findChrome, ciFail } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const steps = [];
let failures = 0;

function check(name, ok, detail) {
  steps.push({ ok: Boolean(ok), name, detail });
  console.log(`  ${ok ? "ok  " : "XX  "} ${name}${detail ? "  —— " + detail : ""}`);
  if (!ok) { failures += 1; ciFail(name, detail); }
}

// 用題庫搜尋開一局只含目標題的練習。
const OPEN = (keyword) => `
  const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").includes(n)); if(h) h.click(); return !!h; };
  c("訓練"); await new Promise(r=>setTimeout(r, 700 * (window.__slow || 1)));
  const lib=document.querySelector('[data-action="open-library"]');
  if(!lib) return { ok:false, why:"找不到題庫" };
  lib.click(); await new Promise(r=>setTimeout(r, 900 * (window.__slow || 1)));
  const s=document.querySelector("[data-library-search]");
  if(!s) return { ok:false, why:"沒有搜尋框" };
  s.value=${JSON.stringify(keyword)}; s.dispatchEvent(new Event("input",{bubbles:true}));
  await new Promise(r=>setTimeout(r, 700 * (window.__slow || 1)));
  const go=document.querySelector('[data-action="start-library-filter"]');
  if(!go || go.disabled) return { ok:false, why:"「練目前篩選」不能按" };
  go.click(); await new Promise(r=>setTimeout(r, 1200 * (window.__slow || 1)));
  const ack=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("知道了"));
  if(ack){ ack.click(); await new Promise(r=>setTimeout(r, 400 * (window.__slow || 1))); }
`;

// 在 svg 的數學座標 (x,y) 上派一個真的 pointer 事件。
const POINTER = `
  const svgPoint = (svg, x, y) => {
    const win = svg.dataset.graphWindow.split(",").map(Number);
    const size = svg.dataset.graphSize.split(",").map(Number);
    const pad = Number(svg.dataset.graphPad);
    const rect = svg.getBoundingClientRect();
    const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad);
    const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad);
    return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height };
  };
  const fire = (svg, type, x, y) => {
    const at = svgPoint(svg, x, y);
    const Ctor = type.startsWith("pointer") ? PointerEvent : MouseEvent;
    svg.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, pointerId: 1, ...at }));
    return at;
  };
`;

async function run() {
  console.log("E2E 互動圖形題");
  const chromePath = findChrome();
  const server = await staticServer.start(ROOT);
  const chrome = await launch(chromePath, { headless: !process.argv.includes("--keep") });
  try {
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(900);
    // 題庫瀏覽有等級鎖（R3+ 對新使用者不可見）。這套件測的是圖形互動，
    // 不是鎖 —— 用一個等級夠的使用者跑，鎖本身由 e2e 別處與 CDP 探針守。
    await chrome.evaluate(`
      localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ onboardingSeen: true, settings: { difficultyCap: 6 } }));
      location.reload();
      return 1;
    `);
    await chrome.sleep(900);

    /* ── 1. 點位題：點在正確位置上，標記出現、判分正確 ── */
    const tap = await chrome.evaluate(`
      ${OPEN("gi-003")}
      ${POINTER}
      const svg = document.querySelector('svg[data-graph-interactive="tap"]');
      if (!svg) return { ok:false, why:"沒有可互動的 svg（事件層或 render 沒接上）" };
      // 用題號搜尋開局，所以這一局只有 gi-003 —— 目標點是確定的，不用從畫面猜。
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "gi-003");
      const targets = String(problem.answer).split(",").map(Number);
      const before = svg.querySelectorAll("circle").length;
      targets.forEach((x) => fire(svg, "click", x, 0));
      await new Promise(r=>setTimeout(r, 500 * (window.__slow || 1)));
      const svg2 = document.querySelector('svg[data-graph-interactive="tap"]');
      const marks = svg2 ? svg2.querySelectorAll("circle").length : 0;
      const submit = document.querySelector('[data-action="submit-graphtap"]');
      const enabled = Boolean(submit) && !submit.disabled;
      if (submit) submit.click();
      // 答對的回饋只停 950ms 就自動前進：不能睡固定時間再讀，要一出現就抓
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise(r=>setTimeout(r, 60))) {
        text = document.body.innerText;
        if (/位置全對|沒點準/.test(text)) break;
      }
      return { ok:true, before, marks, enabled, targets: targets.length,
               correct: /位置全對/.test(text), feedback: (text.match(/位置全對。|沒點準[^\\n]*/)||[""])[0] };
    `);
    check("點位題的 svg 是可互動的", tap.ok, tap.why || "");
    if (tap.ok) {
      check("點下去圖上真的多了標記", tap.marks > tap.before, `${tap.before} → ${tap.marks} 個圓點`);
      check("標滿之後送出鈕才能按", tap.enabled, `目標 ${tap.targets} 個`);
      check("點在正解位置上判對", tap.correct, tap.feedback);
    }

    /* ── 2. 切線題：拖動直線，讀數會變、拖到正解判對 ── */
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(900);
    const slope = await chrome.evaluate(`
      ${OPEN("gi-104")}
      ${POINTER}
      const svg = document.querySelector('svg[data-graph-interactive="slope"]');
      if (!svg) return { ok:false, why:"沒有可拖的 svg" };
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "gi-104");
      const readoutBefore = (document.querySelector("[data-slope-readout]")||{}).textContent;
      // 目標斜率取自畫面上這一題：從 pivot 沿正解方向往右拖一段
      const answer = Number(problem.answer);
      const px = Number(problem.pivot.x);
      const win = svg.dataset.graphWindow.split(",").map(Number);
      const dx = (win[1] - win[0]) * 0.2;
      const fn = new Function("x", "const {sin,cos,exp,log,sqrt}=Math; return (" + problem.graph.curves[0].expr + ");");
      const py = fn(px);
      fire(svg, "pointerdown", px + dx, py + answer * dx);
      fire(svg, "pointermove", px + dx, py + answer * dx);
      fire(svg, "pointerup", px + dx, py + answer * dx);
      await new Promise(r=>setTimeout(r, 500 * (window.__slow || 1)));
      const readoutAfter = (document.querySelector("[data-slope-readout]")||{}).textContent;
      // 放手之後會整頁重繪，原本那個 svg 已經脫離文件 ——
      // detached 元素的 computed style 是空字串，要重新查一次。
      const liveSvg = document.querySelector('svg[data-graph-interactive="slope"]') || svg;
      const touchAction = getComputedStyle(liveSvg).getPropertyValue("touch-action");
      const submit = document.querySelector('[data-action="submit-graphslope"]');
      if (submit) submit.click();
      // 同上：答對 950ms 後自動前進，回饋要一出現就抓
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise(r=>setTimeout(r, 60))) {
        text = document.body.innerText;
        // 「斜率 -1.00」是拖動時的讀數，不是回饋；等回饋卡本身出現
        if (document.querySelector(".feedback") || /的容差內/.test(text)) break;
      }
      return { ok:true, readoutBefore, readoutAfter, touchAction, id: problem.id, answer,
               correct: /的容差內/.test(text), feedback: (text.match(/斜率 [^\\n]*/)||[""])[0] };
    `);
    check("切線題的 svg 是可拖的", slope.ok, slope.why || "");
    if (slope.ok) {
      check("拖動後斜率讀數有變", slope.readoutBefore !== slope.readoutAfter,
        `${slope.readoutBefore} → ${slope.readoutAfter}（正解 ${slope.answer}）`);
      check("圖面吃掉觸控手勢，不會變成整頁捲動", slope.touchAction === "none", `touch-action: ${slope.touchAction}`);
      check("拖到正解方向判對", slope.correct, slope.feedback);
    }

    /* ── 3. 作圖題：真的用 pointer 事件在格子上畫，退一筆有效、照著畫判對、翻轉判錯有話 ── */
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(900);
    const sketch = await chrome.evaluate(`
      ${OPEN("sk-008")}
      ${POINTER}
      const svg = document.querySelector('svg[data-graph-interactive="sketch"]');
      if (!svg) return { ok:false, why:"沒有可畫的 svg" };
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "sk-008");
      const fn = new Function("x", "const {sin,cos,exp,log,sqrt,abs}=Math; return (" + problem.sketch.expr + ");");
      const [a, b] = problem.sketch.pieces[0];
      const wait = (ms) => new Promise(r=>setTimeout(r, ms * (window.__slow || 1)));
      const draw = async (transform) => {
        const s = document.querySelector('svg[data-graph-interactive="sketch"]');
        for (let i = 0; i <= 40; i += 1) {
          const x = a + ((b - a) * i) / 40;
          const y = transform(fn(x));
          fire(s, i === 0 ? "pointerdown" : "pointermove", x, y);
          if (i === 40) fire(s, "pointerup", x, y);
        }
        await wait(400);
      };
      // 先畫一筆亂的，退掉，再照著 f 畫
      await draw((y) => -y);
      const strokesBefore = (document.querySelector("[data-sketch-count]")||{}).textContent;
      const pathsBefore = document.querySelectorAll('svg[data-graph-interactive="sketch"] path[stroke="var(--gold)"]').length;
      document.querySelector('[data-action="undo-sketch"]').click();
      await wait(300);
      const strokesAfterUndo = (document.querySelector("[data-sketch-count]")||{}).textContent;
      await draw((y) => y + 0.12 * Math.sin(6 * y));
      const submit = document.querySelector('[data-action="submit-sketch"]');
      const enabled = Boolean(submit) && !submit.disabled;
      const touchAction = getComputedStyle(document.querySelector('svg[data-graph-interactive="sketch"]')).getPropertyValue("touch-action");
      if (submit) submit.click();
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await wait(60)) {
        const f = document.querySelector(".feedback");
        if (f) { text = f.innerText; break; }
      }
      return { ok:true, strokesBefore, pathsBefore, strokesAfterUndo, enabled, touchAction,
               correct: /圖形正確/.test(text), feedback: text.replace(/\\s+/g, " ").slice(0, 120) };
    `);
    check("作圖題的 svg 是可畫的", sketch.ok, sketch.why || "");
    if (sketch.ok) {
      check("畫一筆之後圖上有筆畫、計數是 1", sketch.pathsBefore >= 1 && sketch.strokesBefore === "1", `path ${sketch.pathsBefore}、計數 ${sketch.strokesBefore}`);
      check("退一筆之後計數回到 0", sketch.strokesAfterUndo === "0", `計數 ${sketch.strokesAfterUndo}`);
      check("畫了之後送出鈕才能按", sketch.enabled, "");
      check("畫布吃掉觸控手勢，不會變成整頁捲動", sketch.touchAction === "none", `touch-action: ${sketch.touchAction}`);
      check("照著 f 畫（帶手抖）判對", sketch.correct, sketch.feedback);
    }
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.sleep(900);
    const flipped = await chrome.evaluate(`
      ${OPEN("sk-008")}
      ${POINTER}
      const svg = document.querySelector('svg[data-graph-interactive="sketch"]');
      if (!svg) return { ok:false, why:"沒有可畫的 svg" };
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "sk-008");
      const fn = new Function("x", "return (" + problem.sketch.expr + ");");
      const [a, b] = problem.sketch.pieces[0];
      for (let i = 0; i <= 40; i += 1) { const x = a + ((b - a) * i) / 40; fire(svg, i === 0 ? "pointerdown" : "pointermove", x, -fn(x)); if (i === 40) fire(svg, "pointerup", x, -fn(x)); }
      await new Promise(r=>setTimeout(r, 400 * (window.__slow || 1)));
      document.querySelector('[data-action="submit-sketch"]').click();
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise(r=>setTimeout(r, 60))) { const f = document.querySelector(".feedback"); if (f) { text = f.innerText; break; } }
      return { ok:true, wrong: /應該遞增|應該遞減/.test(text), feedback: text.replace(/\\s+/g, " ").slice(0, 120) };
    `);
    check("上下翻轉的圖判錯，而且說出哪一段增減錯了（不是選擇題的誘答理由）", flipped.ok && flipped.wrong, flipped.feedback || flipped.why);


    /* ── ε-δ 挑戰（2026-09-25）────────────────────────────────
       這個題型的價值全在「看得見」與「一關一關縮」，所以 E2E 要釘的是
       畫面上真的有帶、拖滑桿真的會改判定、過關真的會換 ε、
       以及交一個不成立的 δ 會被判錯並說出卡在哪一關。 */
    await chrome.navigate(`${server.url}/index.html#p=ep-001`);
    await chrome.sleep(1300);
    const epsStart = await chrome.evaluate(`
      const svg = document.querySelector(".eps-svg");
      const slider = document.querySelector("[data-eps-delta]");
      const levels = [...document.querySelectorAll(".eps-level")].map(n => n.innerText.trim());
      return {
        ok: true,
        svg: Boolean(svg),
        slider: Boolean(slider),
        levels,
        now: (document.querySelector(".eps-level.is-now") || {}).innerText || "",
        status: (document.querySelector(".eps-status") || {}).innerText || "",
        bands: svg ? svg.innerHTML.split("<rect").length - 1 : 0
      };
    `);
    check("ε-δ 挑戰畫出兩條帶與一根 δ 滑桿", epsStart.svg && epsStart.slider && epsStart.bands >= 2, `帶 ${epsStart.bands} 個 · 滑桿 ${epsStart.slider}`);
    check("關卡列印出三個 ε，第一關是現在", epsStart.levels.length === 3 && epsStart.now.includes("0.6"), epsStart.levels.join(" / "));

    const epsDrag = await chrome.evaluate(`
      const slider = document.querySelector("[data-eps-delta]");
      if (!slider) return { ok:false, why:"沒有滑桿" };
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "ep-001");
      const best = window.BuzzEpsilonGame.maxDelta(problem.epsilon, problem.epsilon.levels[0]);
      slider.value = String(best * 1.4);
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise(r=>setTimeout(r, 400 * (window.__slow || 1)));
      const tooBig = (document.querySelector(".eps-status") || {}).innerText || "";
      slider.value = String(best * 0.7);
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise(r=>setTimeout(r, 400 * (window.__slow || 1)));
      const okNow = (document.querySelector(".eps-status") || {}).innerText || "";
      return { ok:true, tooBig, okNow };
    `);
    check("δ 太大時說「還不行」並指出跑出帶外的 x", /還不行/.test(epsDrag.tooBig) && /x≈/.test(epsDrag.tooBig), epsDrag.tooBig.slice(0, 60));
    check("δ 縮小之後即時變成「這個 δ 成立」", /成立/.test(epsDrag.okNow), epsDrag.okNow.slice(0, 60));

    const epsWin = await chrome.evaluate(`
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "ep-001");
      const game = window.BuzzEpsilonGame;
      const seen = [];
      for (let i = 0; i < problem.epsilon.levels.length; i += 1) {
        const badge = document.querySelector(".eps-level.is-now");
        seen.push(badge ? badge.innerText.trim() : "(沒有)");
        const eps = Number(problem.epsilon.levels[i]);
        const slider = document.querySelector("[data-eps-delta]");
        if (!slider) return { ok:false, why:"第 " + (i+1) + " 關沒有滑桿" };
        slider.value = String(game.maxDelta(problem.epsilon, eps) * 0.7);
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise(r=>setTimeout(r, 300 * (window.__slow || 1)));
        document.querySelector('[data-action="epsilon-submit"]').click();
        await new Promise(r=>setTimeout(r, 600 * (window.__slow || 1)));
      }
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise(r=>setTimeout(r, 60))) { const f = document.querySelector(".feedback"); if (f) { text = f.innerText; break; } }
      return { ok:true, seen, feedback: text.replace(/\\s+/g, " ").slice(0, 120) };
    `);
    check("三關的 ε 一關比一關小（過關才前進）", epsWin.ok && epsWin.seen.length === 3 && epsWin.seen[0] !== epsWin.seen[1] && epsWin.seen[1] !== epsWin.seen[2], (epsWin.seen || []).join(" → ") || epsWin.why);
    check("三關全過判對，而且說出「每一個 ε 都找得到 δ」", /答對/.test(epsWin.feedback) && /都成立/.test(epsWin.feedback), epsWin.feedback);

    await chrome.navigate(`${server.url}/index.html#p=ep-003`);
    await chrome.sleep(1300);
    const epsFail = await chrome.evaluate(`
      const problem = window.BUZZ_PROBLEMS.find(p => p.id === "ep-003");
      const slider = document.querySelector("[data-eps-delta]");
      if (!slider) return { ok:false, why:"沒有滑桿" };
      slider.value = String(window.BuzzEpsilonGame.maxDelta(problem.epsilon, problem.epsilon.levels[0]) * 1.6);
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise(r=>setTimeout(r, 300 * (window.__slow || 1)));
      document.querySelector('[data-action="epsilon-submit"]').click();
      let text = "";
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise(r=>setTimeout(r, 60))) { const f = document.querySelector(".feedback"); if (f) { text = f.innerText; break; } }
      return { ok:true, feedback: text.replace(/\\s+/g, " ").slice(0, 140) };
    `);
    check("交一個不成立的 δ 判錯，而且說出卡在第幾關、哪一點跑出去", /答案不對/.test(epsFail.feedback) && /第 1 關/.test(epsFail.feedback) && /x≈/.test(epsFail.feedback), epsFail.feedback || epsFail.why);
    const errors = chrome.consoleMessages.filter((m) => m.type === "error");
    check("console 沒有錯誤", errors.length === 0, errors.slice(0, 2).map((e) => e.text).join(" | "));
    check("沒有未捕捉的例外", chrome.pageErrors.length === 0, chrome.pageErrors.slice(0, 2).join(" | "));
  } finally {
    if (!process.argv.includes("--keep")) await chrome.close();
    await server.stop();
  }
}

run().then(() => {
  console.log("");
  console.log(`E2E 互動圖形：${steps.filter((s) => s.ok).length}/${steps.length} 通過`);
  if (failures) {
    console.error(`\n失敗 ${failures} 項：`);
    steps.filter((s) => !s.ok).forEach((s) => console.error(`  ${s.name}  ${s.detail || ""}`));
    process.exit(1);
  }
  console.log("e2e graph interactive OK");
}).catch((error) => {
  console.error(error);
  ciFail("E2E 掛掉", error.message);
  process.exit(1);
});
