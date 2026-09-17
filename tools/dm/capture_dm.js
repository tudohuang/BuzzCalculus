// DM 用的截圖：每一張依元素框選、2 倍解析度、狀態先鋪好（有紀錄、有筆跡、有回饋）。
//
// 用法：node tools/dm/capture_dm.js <輸出資料夾>
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");
const { TYPE, INK, SEED } = require("../lib/page_scripts.js");

const ROOT = path.join(__dirname, "..", "..");
const OUT = process.argv[2];
if (!OUT) { console.error("用法：node tools/dm/capture_dm.js <輸出資料夾>"); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

// 頁面端：算一組元素的聯集框（頁面座標），可加邊
const RECT = `
  window.__rect = (els, pad) => {
    const list = els.filter(Boolean);
    if (!list.length) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const el of list) { const r = el.getBoundingClientRect(); x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
    const p = pad || 0;
    return { x: Math.max(0, x0 - p + window.scrollX), y: Math.max(0, y0 - p + window.scrollY), w: x1 - x0 + 2 * p, h: y1 - y0 + 2 * p };
  };
  // 含某段文字、高度在範圍內的最小元素
  window.__byText = (re, minH, maxH) => {
    const cands = [...document.querySelectorAll("section, article, div")].filter((el) => { const r = el.getBoundingClientRect(); return re.test(el.innerText || "") && r.height >= minH && r.height <= maxH; });
    cands.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height);
    return cands[0] || null;
  };
`;

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (code) => chrome.evaluate(code);
  const sleep = (ms) => chrome.sleep(ms);
  const click = async (sel, wait = 500) => { const hit = await ev(`${TYPE} return window.__click(${JSON.stringify(sel)});`); await sleep(wait); return hit; };
  const type = (sel, text, per = 0) => ev(`${TYPE} return await window.__type(${JSON.stringify(sel)}, ${JSON.stringify(text)}, ${per});`);
  const submit = () => ev(`${TYPE} return window.__submit();`);
  const size = (w, h, dsf = 2, mobile = true) => chrome.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: dsf, mobile });
  const open = async (id, wait = 900) => { await chrome.navigate(`${server.url}/index.html#p=${id}`); await sleep(wait); await click('button[data-action="dismiss-notice"]', 150); };
  const ensureFree = async () => { if (!(await ev(`return Boolean(document.querySelector("#answer"));`))) await click('[data-action="toggle-answer-mode"]', 500); };
  const ensureChoice = async () => { if (!(await ev(`return Boolean(document.querySelector('[data-action="choose-answer"]'));`))) await click('[data-action="toggle-answer-mode"]', 500); };
  const waitFeedback = async () => { for (const end = Date.now() + 4000; Date.now() < end;) { if (await ev(`return Boolean(document.querySelector(".feedback"));`)) return; await sleep(60); } };
  const shot = async (name, rectCode, pad = 14) => {
    const rect = await ev(`${RECT} return window.__rect(${rectCode}, ${pad});`);
    if (!rect) { console.log("skip", name, "(no element)"); return; }
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 1 } });
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(data, "base64"));
    console.log("shot", name, Math.round(rect.w), "x", Math.round(rect.h));
  };
  const viewportShot = async (name) => {
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(data, "base64"));
    console.log("shot", name, "(viewport)");
  };

  try {
    await size(1180, 1000);
    await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__BUZZ_TEST_HOOKS__ = {};" });
    await chrome.navigate(server.url + "/index.html");
    await ev("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    await ev(SEED);
    await chrome.navigate(server.url + "/index.html");
    await sleep(600);
    await click('button[data-action="dismiss-notice"]', 150);

    // 1. 白話證明：正確的證明全綠；再一版 δ 取錯，第 4 行紅
    await click('[data-action="open-proofs"]', 800);
    await click('tr[data-proof-key="pl:pl-limit-linear"]', 900);
    const ok = "任取 ε > 0。\n取 δ = ε/3。\n假設 0 < |x − 2| < δ。\n則 |3x − 6| = 3|x − 2| < 3δ = ε。\n所以 lim_{x→2} 3x = 6。";
    await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify(ok)}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
    await sleep(1600);
    await shot("proof", `[document.querySelector("[data-proof-lang-text]").parentElement, document.querySelector("[data-pl-report]")]`, 18);
    await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify(ok.replace("ε/3", "ε"))}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
    await sleep(1600);
    await shot("proof-wrong", `[document.querySelector("[data-proof-lang-text]").parentElement, document.querySelector("[data-pl-report]")]`, 18);

    // 2. 計算紙：題目 + 攤開的計算紙 + 筆跡
    await size(1180, 1500);
    await open("lim-001");
    await ensureFree();
    await ev(`if (!document.querySelector("[data-blackboard]")) { const t = document.querySelector('[data-board-action="toggle"]'); if (t) t.click(); } return 1;`);
    await sleep(700);
    await ev(`${INK} return await window.__ink([
      { text: "lim sin x / x = 1", x: 0.05, y: 0.16, size: 0.13 },
      { text: "x - > 0", x: 0.08, y: 0.38, size: 0.09 },
      { text: "sin x < x", x: 0.05, y: 0.62, size: 0.12 }
    ], { linePause: 50 });`);
    await sleep(400);
    await shot("board", `[document.querySelector(".problem-card"), document.querySelector("[data-blackboard]")]`, 12);

    // 3. 答錯的回饋：漏了鏈鎖律的係數
    await size(1180, 1300);
    await open("ch-mix-001");
    await ensureFree();
    await type("#answer", "2x sin(e^(3x)) + x^2 e^(3x) cos(e^(3x))");
    await submit();
    await waitFeedback();
    await sleep(500);
    await shot("wrong", `[document.querySelector(".problem-card"), document.querySelector(".feedback")]`, 12);

    // 4. 第六階的題目、圖上點位（點完未送出）
    await size(1180, 1000);
    await open("td-int-001");
    await ensureChoice();
    await sleep(400);
    await shot("hard", `[document.querySelector(".problem-card")]`, 12);
    await open("gi-003");
    await ev(`
      const svgPoint = (svg, x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
      for (const x of [-1, 0, 1]) { const svg = document.querySelector('svg[data-graph-interactive="tap"]'); svg.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ...svgPoint(svg, x, 0) })); await new Promise((r) => setTimeout(r, 250)); }
      return 1;
    `);
    await sleep(400);
    await shot("tap", `[document.querySelector(".problem-card")]`, 12);

    // 5. 主線一關打完：金牌過關（含撒花）
    await chrome.navigate(server.url + "/index.html");
    await sleep(700);
    await shot("map", `[document.querySelector(".buzz-path-map")]`, 0);
    await click('[data-action="start-path-node"]', 900);
    await click('[data-action="start-path-lesson"]', 900);
    await ensureChoice();
    await ev(`
      const api = window.__BUZZ_TEST_HOOKS__.api;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const ids = api.quizProblemIds();
      let answered = 0;
      for (let step = 0; step < 40 && answered < ids.length; step += 1) {
        const choices = [...document.querySelectorAll('[data-action="choose-answer"]')];
        if (!choices.length) { await wait(200); continue; }
        const problem = window.BUZZ_PROBLEMS.find((p) => p.id === ids[answered]);
        const pick = choices.find((c) => problem && api.checkAnswer(problem, c.dataset.choice).correct) || choices[0];
        pick.click(); answered += 1; await wait(1100);
        const next = document.querySelector('[data-action="next-question"]'); if (next) { next.click(); await wait(300); }
      }
      return answered;
    `);
    await sleep(1200);
    await shot("results", `[window.__byText(/金牌過關|表現穩定|過關/, 120, 520)]`, 0);

    // 6. 數據頁：雷達與象限
    await chrome.navigate(server.url + "/index.html");
    await sleep(600);
    await click('[data-action="open-insights"]', 1200);
    await shot("radar", `[document.querySelector(".radar-panel")]`, 0);
    await shot("quadrant", `[document.querySelector(".quadrant-svg").closest("section, article, div.card, div")]`, 0);

    // 7. 入門課程：第 3 課揭兩步
    await size(1180, 1100);
    await chrome.navigate(server.url + "/index.html");
    await sleep(500);
    await click('[data-action="open-course"]', 900);
    await click('[data-action="open-course-lesson"][data-lesson-id="c1-limit-meaning"]', 1100);
    await click('[data-action="course-step"]', 400);
    await click('[data-action="course-step"]', 600);
    await shot("course", `[window.__byText(/極限是什麼/, 500, 1400)]`, 0);

    // 8. 手機：首頁與作答
    await size(390, 844, 3);
    await chrome.navigate(server.url + "/index.html");
    await sleep(900);
    await viewportShot("phone-home");
    await chrome.navigate(server.url + "/index.html#p=der-002");
    await sleep(900);
    await ensureChoice();
    await sleep(300);
    await viewportShot("phone-quiz");
  } finally {
    setTimeout(() => process.exit(0), 1500).unref();
    await chrome.close();
    await server.stop();
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
