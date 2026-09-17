// 錄 trailer 的素材（開發工具，不進 CI）。
//
// 用真的 Chrome 以 iPad 橫向的尺寸跑網站，照 docs/trailer/ 的逐鏡腳本自動操作，
// 用 CDP 的 screencast 把每一鏡錄成畫格（jpeg + 時間戳），標題卡另外用瀏覽器畫成 PNG。
// 之後由 tools/build_trailer.js 交給 WSL 的 ffmpeg 接成 1080p 成片。
//
// 用法：node tools/record_trailer.js            寫到 docs/trailer/raw/
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "docs", "trailer", "raw");
fs.rmSync(RAW, { recursive: true, force: true });
fs.mkdirSync(RAW, { recursive: true });

// screencast 給的是 CSS 像素大小，不放大；直接用成片裝置框的尺寸錄，畫面才不會軟。
// 1400×972 的版面用 CSS zoom 1.5 畫成 2100×1458：鏡頭推近時字還是清楚的。
const ZOOM = 2;
const VIEW = { width: 1180 * ZOOM, height: 820 * ZOOM };
const SITE = "buzz-calculus.vercel.app";

// 成片的順序：card = 標題卡（秒），shot = 錄下來的一鏡
const timeline = [];

// 在頁面裡打字：一個字一個字設 value 並送 input 事件，看起來像真的在打
const TYPE = `
  window.__type = async (selector, text, perChar) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.focus();
    el.value = "";
    for (const ch of text) {
      el.value += ch;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, perChar || 60));
    }
    return true;
  };
  window.__click = (selector) => {
    const el = [...document.querySelectorAll(selector)].find((n) => n.getClientRects().length);
    if (el) el.click();
    return Boolean(el);
  };
  window.__submit = () => {
    const form = document.querySelector('form[data-action="submit-answer"]');
    if (!form) return false;
    if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    return true;
  };
  window.__clickText = (needle) => {
    const el = [...document.querySelectorAll("button, a, [data-action]")].find((n) => n.getClientRects().length && (n.innerText || "").includes(needle));
    if (el) el.click();
    return Boolean(el);
  };
  // 平滑捲動到某個高度（錄影裡要看得到捲的過程）
  window.__scrollTo = async (y, ms) => {
    const from = window.scrollY; const start = performance.now();
    await new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms); const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, from + (y - from) * e);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  };
`;

// 手寫：用折線字形合成筆跡，逐點派 pointer 事件，帶壓感，照真實時間畫。
const INK = `
  window.__ink = async (lines, opts) => {
    const canvas = document.querySelector("[data-blackboard]");
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const G = {
      l: [[[0.5,0.05],[0.46,0.55],[0.44,0.9]]],
      i: [[[0.5,0.4],[0.5,0.9]],[[0.5,0.22],[0.51,0.24]]],
      m: [[[0.08,0.9],[0.12,0.45],[0.28,0.38],[0.42,0.5],[0.46,0.9]],[[0.46,0.55],[0.62,0.38],[0.78,0.48],[0.84,0.9]]],
      s: [[[0.78,0.48],[0.6,0.38],[0.35,0.46],[0.52,0.6],[0.72,0.74],[0.55,0.9],[0.25,0.84]]],
      n: [[[0.15,0.9],[0.18,0.45],[0.34,0.38],[0.58,0.48],[0.68,0.9]]],
      x: [[[0.15,0.4],[0.8,0.9]],[[0.8,0.4],[0.15,0.9]]],
      "/": [[[0.72,0.15],[0.3,0.95]]],
      "=": [[[0.15,0.55],[0.85,0.55]],[[0.15,0.72],[0.85,0.72]]],
      "1": [[[0.3,0.3],[0.5,0.15],[0.5,0.9]]],
      "0": [[[0.5,0.18],[0.3,0.3],[0.25,0.55],[0.32,0.85],[0.5,0.92],[0.7,0.82],[0.75,0.55],[0.68,0.28],[0.5,0.18]]],
      ">": [[[0.15,0.35],[0.8,0.6],[0.15,0.85]]],
      "<": [[[0.8,0.35],[0.15,0.6],[0.8,0.85]]],
      "-": [[[0.15,0.62],[0.85,0.62]]],
      " ": []
    };
    const move = "onpointerrawupdate" in canvas ? "pointerrawupdate" : "pointermove";
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    const send = (type, x, y, pressure, id) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: id, pointerType: "pen", pressure, isPrimary: true,
      clientX: rect.left + x, clientY: rect.top + y
    }));
    let id = 700;
    const jitter = () => (Math.random() - 0.5) * 1.2;
    for (const line of lines) {
      const size = line.size * rect.height;
      let cx = line.x * rect.width; const cy = line.y * rect.height;
      for (const ch of line.text) {
        const strokes = G[ch] || [];
        for (const stroke of strokes) {
          id += 1;
          const pts = [];
          for (let k = 0; k < stroke.length - 1; k += 1) {
            const [x0, y0] = stroke[k]; const [x1, y1] = stroke[k + 1];
            const steps = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) * 14));
            for (let t = 0; t <= steps; t += 1) {
              const u = t / steps;
              pts.push([cx + (x0 + (x1 - x0) * u) * size * 0.75 + jitter(), cy + (y0 + (y1 - y0) * u) * size + jitter()]);
            }
          }
          send("pointerdown", pts[0][0], pts[0][1], 0.35, id);
          for (let k = 1; k < pts.length; k += 1) {
            const p = 0.3 + 0.45 * Math.sin((k / pts.length) * Math.PI);
            send(move, pts[k][0], pts[k][1], p, id);
            if (k % 3 === 0) await frame();
          }
          send("pointerup", pts[pts.length - 1][0], pts[pts.length - 1][1], 0.3, id);
          await new Promise((r) => setTimeout(r, 70));
        }
        cx += size * (ch === " " ? 0.45 : ch === "i" || ch === "l" || ch === "1" ? 0.5 : 0.8);
      }
      await new Promise((r) => setTimeout(r, opts && opts.linePause || 250));
    }
    return true;
  };
`;

// 合成 14 天的練習紀錄：數據頁、地圖、分享卡要有東西看。
const SEED = `
  const problems = window.BUZZ_PROBLEMS.filter((p) => ["numeric", "expression", "antiderivative"].includes(p.answerKind) && Number(p.rank || p.difficulty || 1) <= 4);
  let seed = 20260917; const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const history = [];
  const DAY = 86400000; const now = Date.now();
  for (let day = 14; day >= 1; day -= 1) {
    if (day === 6 || day === 11) continue; // 兩天沒練，連勝不用滿
    const sessions = 1 + (rand() < 0.5 ? 1 : 0);
    for (let s = 0; s < sessions; s += 1) {
      const answers = [];
      const n = 5 + Math.floor(rand() * 4);
      for (let i = 0; i < n; i += 1) {
        const p = problems[Math.floor(rand() * problems.length)];
        const rank = Number(p.rank || p.difficulty || 1);
        const skill = 0.62 + (14 - day) * 0.018; // 越近越熟
        const correct = rand() < skill - (rank - 2) * 0.08;
        const limit = Number(p.timeLimit || 60);
        answers.push({ problemId: p.id, correct, unanswered: false, assisted: false, hintsUsed: 0,
          elapsed: Math.round(limit * (0.25 + rand() * (correct ? 0.5 : 0.8))), errorTag: correct ? "" : ["sign", "chain-rule", "algebra", ""][Math.floor(rand() * 4)] });
      }
      const finishedAt = new Date(now - day * DAY - Math.floor(rand() * 6) * 3600000).toISOString();
      history.push({ id: "seed-" + day + "-" + s, mode: "quick", practice: false, finishedAt, answers });
    }
  }
  localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({
    onboardingSeen: true, settings: { difficultyCap: 6 }, history,
    placement: { rank: 3, date: new Date(now - 13 * DAY).toISOString(), weakTag: "chain-rule" }
  }));
  return history.length;
`;

// 成就分享卡在沒有系統分享的環境會直接下載；錄影要看到卡片本身，
// 所以把畫好的 canvas 疊到畫面上。只在錄影用，不動產品程式。
const SHOW_CANVAS = `
  const orig = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const c = this;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;display:grid;place-items:center;background:rgba(30,28,22,.55);z-index:9999;opacity:0;transition:opacity .35s";
    const img = document.createElement("img");
    img.src = c.toDataURL("image/png");
    img.style.cssText = "width:min(72vw,760px);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.45);transform:scale(.92);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)";
    wrap.appendChild(img); document.body.appendChild(wrap);
    requestAnimationFrame(() => { wrap.style.opacity = "1"; img.style.transform = "scale(1)"; });
    cb(null);
  };
  return 1;
`;

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  let rec = null;
  let frameNo = 0;
  chrome.on("Page.screencastFrame", (p) => {
    if (rec) {
      frameNo += 1;
      const file = `f${String(frameNo).padStart(6, "0")}.jpg`;
      fs.writeFileSync(path.join(rec.dir, file), Buffer.from(p.data, "base64"));
      rec.frames.push({ file, at: Date.now() });
    }
    chrome.send("Page.screencastFrameAck", { sessionId: p.sessionId }).catch(() => {});
  });

  const sleep = (ms) => chrome.sleep(ms);
  const ev = (code) => chrome.evaluate(code);
  const prep = () => ev(TYPE + INK + "return 1;");
  const click = async (selector, wait = 500) => { const hit = await ev(`${TYPE} return window.__click(${JSON.stringify(selector)});`); await sleep(wait); return hit; };
  const clickText = async (needle, wait = 500) => { const hit = await ev(`${TYPE} return window.__clickText(${JSON.stringify(needle)});`); await sleep(wait); return hit; };
  const type = (selector, text, perChar = 60) => ev(`${TYPE} return await window.__type(${JSON.stringify(selector)}, ${JSON.stringify(text)}, ${perChar});`);
  const open = async (id, wait = 900) => {
    await chrome.navigate(`${server.url}/index.html#p=${id}`);
    await sleep(wait);
    await click('button[data-action="dismiss-notice"]', 200);
  };
  // 自己寫模式：深連結開的局若沒有輸入框，切一次作答形式
  const ensureFree = async () => {
    const has = await ev(`return Boolean(document.querySelector("#answer"));`);
    if (!has) { await click('[data-action="toggle-answer-mode"]', 500); }
  };
  const ensureChoice = async () => {
    const has = await ev(`return Boolean(document.querySelector('[data-action="choose-answer"]'));`);
    if (!has) { await click('[data-action="toggle-answer-mode"]', 500); }
  };
  // 等回饋出現（答對會自動前進，所以一出現就回）
  const waitFeedback = async (timeout = 4000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const got = await ev(`const f = document.querySelector(".feedback, .feedback-head"); return f ? (f.innerText || "").slice(0, 200) : "";`);
      if (got) return got;
      await sleep(60);
    }
    return "";
  };

  let shotNo = 0;
  async function shot(name, body, hold = 900) {
    shotNo += 1;
    const dir = path.join(RAW, `${String(shotNo).padStart(2, "0")}-${name}`);
    fs.mkdirSync(dir, { recursive: true });
    rec = { dir, frames: [] };
    frameNo = 0;
    await chrome.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: VIEW.width, maxHeight: VIEW.height, everyNthFrame: 1 });
    await sleep(350);
    try {
      await body();
    } finally {
      await sleep(hold);
      await chrome.send("Page.stopScreencast");
      const end = Date.now();
      const frames = rec.frames;
      rec = null;
      const list = frames.map((f, i) => {
        const next = i + 1 < frames.length ? frames[i + 1].at : end;
        return `file '${f.file}'\nduration ${Math.max(0.016, (next - f.at) / 1000).toFixed(3)}`;
      });
      if (frames.length) list.push(`file '${frames[frames.length - 1].file}'`);
      fs.writeFileSync(path.join(dir, "list.txt"), list.join("\n") + "\n");
      const seconds = frames.length ? (end - frames[0].at) / 1000 : 0;
      timeline.push({ type: "shot", dir: path.basename(dir), seconds: Number(seconds.toFixed(2)), frames: frames.length });
      console.log(`shot ${path.basename(dir)}: ${frames.length} frames, ${seconds.toFixed(1)}s`);
    }
  }
  function card(title, sub, seconds = 1.7) {
    timeline.push({ type: "card", title, sub: sub || "", seconds });
  }

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: VIEW.width, height: VIEW.height, deviceScaleFactor: 1, mobile: true });
    await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__BUZZ_TEST_HOOKS__ = {}; document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.zoom = "${ZOOM}"; });` });
    await chrome.navigate(server.url + "/index.html");
    await ev("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    const seeded = await ev(SEED);
    console.log("seeded sessions:", seeded);
    await chrome.navigate(server.url + "/index.html");
    await sleep(600);
    await click('button[data-action="dismiss-notice"]', 200);

    /* ── 開場 ── */
    card("BuzzCalculus", "一個人的微積分訓練場，全部在瀏覽器裡", 2.4);

    /* ── 一、題庫 ── */
    card("1,994 題", "四大主題 · 六個難度階");
    await open("int-001", 300);
    await ensureChoice();
    await shot("difficulty", async () => {
      await sleep(1400);
      for (const [id, wait] of [["int-009", 1400], ["td-int-001", 1800]]) {
        await open(id, 300);
        await ensureChoice();
        await sleep(wait);
      }
    }, 300);

    /* ── 二、題型 ── */
    card("不只選擇題", "點位、切線、區間、集合、不定積分，各自有各自的判法");
    await open("gi-003");
    await shot("graphtap", async () => {
      await ev(`
        const svgPoint = (svg, x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
        const tap = (x) => { const svg = document.querySelector('svg[data-graph-interactive="tap"]'); svg.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ...svgPoint(svg, x, 0) })); };
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        await wait(500); tap(-1); await wait(650); tap(1); await wait(650); tap(0); await wait(800);
        document.querySelector('[data-action="submit-graphtap"]').click();
        await wait(1300);
        return 1;
      `);
    });
    await open("gi-101");
    await shot("graphslope", async () => {
      await ev(`
        const svg = document.querySelector('svg[data-graph-interactive="slope"]');
        const problem = window.BUZZ_PROBLEMS.find((p) => p.id === "gi-101");
        const svgPoint = (x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
        const fire = (type, x, y) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, ...svgPoint(x, y) }));
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const px = Number(problem.pivot.x); const py = px * px; const answer = Number(problem.answer);
        const win = svg.dataset.graphWindow.split(",").map(Number); const dx = (win[1] - win[0]) * 0.2;
        await wait(500);
        // 從歪的斜率慢慢拖到對的
        fire("pointerdown", px + dx, py - 1.2 * dx);
        for (let t = 0; t <= 40; t += 1) { const s = -1.2 + (answer + 1.2) * (t / 40); fire("pointermove", px + dx, py + s * dx); await wait(40); }
        fire("pointerup", px + dx, py + answer * dx);
        await wait(600);
        document.querySelector('[data-action="submit-graphslope"]').click();
        await wait(1300);
        return 1;
      `);
    });
    await open("si-int-012");
    await ensureFree();
    await shot("interval", async () => {
      await sleep(300);
      await type("#answer", "(-inf,-1) U (1,inf)", 50);
      await sleep(400);
      await ev(`${TYPE} return window.__submit();`);
      await waitFeedback();
      await sleep(2200);
    }, 300);
    await open("int-001");
    await ensureFree();
    await shot("antiderivative", async () => {
      await sleep(300);
      await type("#answer", "2x^3 + 100", 70);
      await sleep(400);
      await ev(`${TYPE} return window.__submit();`);
      await waitFeedback();
      await sleep(700);
    }, 200);

    /* ── 三、判分 ── */
    card("說得出你哪裡錯", "判錯不只給紅，還告訴你像是哪一步漏了");
    await open("lim-001");
    await ensureFree();
    await ev(`if (!document.querySelector("[data-blackboard]")) { const t = document.querySelector('[data-board-action="toggle"]'); if (t) t.click(); } return 1;`);
    await sleep(500);
    await click('[data-board-action="fullscreen"]', 800);
    await shot("board", async () => {
      await sleep(300);
      await ev(`${INK} return await window.__ink([
        { text: "lim sin x / x = 1", x: 0.05, y: 0.14, size: 0.105 },
        { text: "x - > 0", x: 0.08, y: 0.30, size: 0.07 },
        { text: "sin x < x", x: 0.05, y: 0.48, size: 0.095 }
      ], { linePause: 250 });`);
      await sleep(400);
      await type("#answer", "1", 90);
      await sleep(400);
      await ev(`${TYPE} return window.__submit();`);
      await waitFeedback();
      await sleep(700);
    }, 200);
    await open("der-001");
    await ensureFree();
    await shot("grading-ok", async () => {
      await sleep(300);
      await type("#answer", "5x^4 - 6x", 65);
      await sleep(400);
      await ev(`${TYPE} return window.__submit();`);
      await waitFeedback();
      await sleep(700);
    }, 200);
    await open("ch-mix-001");
    await ensureFree();
    await shot("grading-wrong", async () => {
      await sleep(300);
      await type("#answer", "2x sin(e^(3x)) + x^2 e^(3x) cos(e^(3x))", 36);
      await sleep(400);
      await ev(`${TYPE} return window.__submit();`);
      await waitFeedback();
      await sleep(2300);
    }, 300);

    /* ── 四、證明 ── */
    card("白話證明", "一行一句，即時判；跳步就紅，驗不了就黃");
    await chrome.navigate(server.url + "/index.html");
    await sleep(500);
    await click('[data-action="open-proofs"]', 800);
    await click('tr[data-proof-key="pl:pl-limit-linear"]', 900);
    await shot("proof", async () => {
      const lines = ["任取 ε > 0。", "取 δ = ε/3。", "假設 0 < |x − 2| < δ。", "則 |3x − 6| = 3|x − 2| < 3δ = ε。", "所以 lim_{x→2} 3x = 6。"];
      let text = "";
      for (const line of lines) {
        for (const ch of line) {
          text += ch;
          await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify("")} + ${JSON.stringify(text)}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
          await sleep(18);
        }
        text += "\n";
        await sleep(600);
      }
      await sleep(1400);
      // 把第 2 行改成 δ = ε，看第 4 行變紅
      const wrong = text.replace("取 δ = ε/3。", "取 δ = ε。");
      await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify(wrong)}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
      await sleep(2000);
    }, 300);

    /* ── 五、教 ── */
    card("一步一步教", "入門課程逐步揭示範；卡住先給方向，再給下一步");
    await chrome.navigate(server.url + "/index.html");
    await sleep(500);
    await click('[data-action="open-course"]', 900);
    await shot("course", async () => {
      await sleep(500);
      await click('[data-action="open-course-lesson"][data-lesson-id="c1-limit-meaning"]', 1100);
      await click('[data-action="course-step"]', 1200);
      await click('[data-action="course-step"]', 1200);
      await click('[data-action="course-step"]', 900);
    }, 500);
    await open("ch-mix-002");
    await ensureFree();
    await shot("hints", async () => {
      await sleep(700);
      await click('[data-action="show-hint"]', 1500);
      await click('[data-action="show-hint"]', 1400);
    }, 500);

    /* ── 六、帶你走 ── */
    card("知道你該練什麼", "地圖、結算、數據頁，全部從你的紀錄算出來");
    await chrome.navigate(server.url + "/index.html");
    await sleep(700);
    await shot("path", async () => {
      await sleep(300);
      await ev(`${TYPE} const map = document.querySelector('[data-action="start-path-node"]'); const y = map ? Math.max(0, map.getBoundingClientRect().top + window.scrollY - innerHeight * 0.45) : 400; await window.__scrollTo(y, 1400); return 1;`);
      await sleep(600);
      await click('[data-action="start-path-node"]', 900);
      await click('[data-action="start-path-lesson"]', 900);
      await ensureChoice();
      // 答完這一關：每題挑對的選項，答對會自動前進
      await ev(`
        const api = window.__BUZZ_TEST_HOOKS__.api;
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const ids = api.quizProblemIds();
        let answered = 0;
        for (let step = 0; step < 40 && answered < ids.length; step += 1) {
          const choices = [...document.querySelectorAll('[data-action="choose-answer"]')];
          if (!choices.length) { await wait(300); continue; }
          const problem = window.BUZZ_PROBLEMS.find((p) => p.id === ids[answered]);
          const pick = choices.find((c) => problem && api.checkAnswer(problem, c.dataset.choice).correct) || choices[0];
          await wait(700 + Math.random() * 500);
          pick.click();
          answered += 1;
          await wait(1250);
          const next = document.querySelector('[data-action="next-question"]');
          if (next) { next.click(); await wait(500); }
        }
        return 1;
      `);
      await sleep(3600);
    }, 300);
    await chrome.navigate(server.url + "/index.html");
    await sleep(600);
    await click('[data-action="open-insights"]', 900);
    await shot("insights", async () => {
      await sleep(900);
      await ev(`${TYPE} await window.__scrollTo(Math.min(document.body.scrollHeight - innerHeight, 900), 2800); return 1;`);
      await sleep(400);
    }, 500);
    await chrome.navigate(server.url + "/index.html");
    await sleep(600);
    await ev(SHOW_CANVAS);
    await shot("share", async () => {
      await sleep(500);
      await click('[data-action="share-achievement-card"]', 1600);
    }, 1500);

    /* ── 收尾 ── */
    card(SITE, "免安裝 · 離線可用 · 資料不出裝置", 3.2);

    /* ── 標題卡：用瀏覽器畫 ── */
    await chrome.send("Page.stopScreencast").catch(() => {});
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    let cardNo = 0;
    for (const item of timeline) {
      if (item.type !== "card") continue;
      cardNo += 1;
      const isUrl = item.title === SITE;
      const html = `<!doctype html><meta charset="utf-8"><style>
        html,body{margin:0;height:100%;background:#F6F2E8;font-family:"Microsoft JhengHei","PingFang TC",sans-serif;color:#1F1D18}
        .w{height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 160px;box-sizing:border-box}
        .rule{width:96px;height:6px;background:#B98A22;margin-bottom:34px;border-radius:3px}
        h1{font-size:${isUrl ? 64 : 92}px;margin:0 0 22px;font-weight:700;letter-spacing:${isUrl ? 0 : 2}px;line-height:1.1}
        p{font-size:34px;margin:0;color:#625D52;line-height:1.5}
        .brand{position:absolute;right:120px;bottom:80px;font-size:24px;color:#B98A22;font-weight:700;letter-spacing:3px}
      </style><div class="w"><div class="rule"></div><h1>${item.title}</h1><p>${item.sub}</p></div>${cardNo === 1 ? "" : '<div class="brand">BuzzCalculus</div>'}`;
      await chrome.send("Page.navigate", { url: "data:text/html;charset=utf-8," + encodeURIComponent(html) });
      await sleep(500);
      const { data } = await chrome.send("Page.captureScreenshot", { format: "png" });
      item.file = `card-${String(cardNo).padStart(2, "0")}.png`;
      fs.writeFileSync(path.join(RAW, item.file), Buffer.from(data, "base64"));
    }
    fs.writeFileSync(path.join(RAW, "timeline.json"), JSON.stringify(timeline, null, 2));
    const total = timeline.reduce((s, t) => s + t.seconds, 0);
    console.log(`timeline: ${timeline.length} items, ${total.toFixed(1)}s`);
  } finally {
    await chrome.close();
    await server.stop();
  }
}

run().catch((error) => { console.error(error); process.exit(1); });
