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
const { launch, findChrome } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const steps = [];
let failures = 0;

function check(name, ok, detail) {
  steps.push({ ok: Boolean(ok), name, detail });
  console.log(`  ${ok ? "ok  " : "XX  "} ${name}${detail ? "  —— " + detail : ""}`);
  if (!ok) failures += 1;
}

// 用題庫搜尋開一局只含目標題的練習。
const OPEN = (keyword) => `
  const c = (n) => { const h=[...document.querySelectorAll("button,a,[data-action]")].find(x=>(x.innerText||"").includes(n)); if(h) h.click(); return !!h; };
  c("訓練"); await new Promise(r=>setTimeout(r,700));
  const lib=document.querySelector('[data-action="open-library"]');
  if(!lib) return { ok:false, why:"找不到題庫" };
  lib.click(); await new Promise(r=>setTimeout(r,900));
  const s=document.querySelector("[data-library-search]");
  if(!s) return { ok:false, why:"沒有搜尋框" };
  s.value=${JSON.stringify(keyword)}; s.dispatchEvent(new Event("input",{bubbles:true}));
  await new Promise(r=>setTimeout(r,700));
  const go=document.querySelector('[data-action="start-library-filter"]');
  if(!go || go.disabled) return { ok:false, why:"「練目前篩選」不能按" };
  go.click(); await new Promise(r=>setTimeout(r,1200));
  const ack=[...document.querySelectorAll("button")].find(b=>b.textContent.includes("知道了"));
  if(ack){ ack.click(); await new Promise(r=>setTimeout(r,400)); }
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
      await new Promise(r=>setTimeout(r,500));
      const svg2 = document.querySelector('svg[data-graph-interactive="tap"]');
      const marks = svg2 ? svg2.querySelectorAll("circle").length : 0;
      const submit = document.querySelector('[data-action="submit-graphtap"]');
      const enabled = Boolean(submit) && !submit.disabled;
      if (submit) submit.click();
      await new Promise(r=>setTimeout(r,600));
      const text = document.body.innerText;
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
      await new Promise(r=>setTimeout(r,500));
      const readoutAfter = (document.querySelector("[data-slope-readout]")||{}).textContent;
      // 放手之後會整頁重繪，原本那個 svg 已經脫離文件 ——
      // detached 元素的 computed style 是空字串，要重新查一次。
      const liveSvg = document.querySelector('svg[data-graph-interactive="slope"]') || svg;
      const touchAction = getComputedStyle(liveSvg).getPropertyValue("touch-action");
      const submit = document.querySelector('[data-action="submit-graphslope"]');
      if (submit) submit.click();
      await new Promise(r=>setTimeout(r,600));
      const text = document.body.innerText;
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
  process.exit(1);
});
