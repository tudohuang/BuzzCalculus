// 全站 trailer 的素材。互動的鏡頭用 CDP screencast 照真實時間錄（screencast 只給 CSS 像素，
// 所以視口開 2360×1640、html zoom 2 —— 版面還是 1180×820，畫面是兩倍清楚）；
// 各頁的靜態畫面與卡片特寫用 DSF 2 直接截圖。課程的鏡頭直接用 course_film 錄好的素材。
//
// 用法：node tools/site_trailer/record.js [--only ok,slope]
// 輸出：docs/trailer/site/raw/<鏡>/f000001.jpg … ＋ raw/manifest.json（每格的秒數）、raw/stills/*.jpg
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");
const { acquire } = require("../lib/chrome_lock.js");
const { TYPE, SEED } = require("../lib/page_scripts.js");

const ROOT = path.join(__dirname, "..", "..");
const RAW = path.join(ROOT, "docs", "trailer", "site", "raw");
const argv = process.argv.slice(2);
const ONLY = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",") : null;
const want = (n) => !ONLY || ONLY.includes(n);
const ZOOM = 2;
// 慢動作錄：頁面裡的時間（setTimeout、performance.now、Date.now、rAF、CSS 動畫）全部放慢 K 倍，
// screencast 一秒十幾格 × K ＝ 成片一秒四、五十格；格的時間戳除以 K 換回真實速度
const K = Number(argv.includes("--slow") ? argv[argv.indexOf("--slow") + 1] : 8);
const SHIM = `(() => { const K = ${K}; if (K === 1) return;
  const pn = performance.now.bind(performance), p0 = pn(); performance.now = () => p0 + (pn() - p0) / K;
  const dn = Date.now, d0 = dn(); Date.now = () => d0 + (dn() - d0) / K;
  const st = window.setTimeout, si = window.setInterval;
  window.setTimeout = (fn, ms, ...a) => st(fn, (ms || 0) * K, ...a);
  window.setInterval = (fn, ms, ...a) => si(fn, (ms || 0) * K, ...a);
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(performance.now()));
})();`;
const W = 1180, H = 820;

// 合成紀錄之外：導覽都看過、全部功能打開、中等程度
const PROFILE = `const r = JSON.parse(localStorage.getItem("buzzcalculus.records.v1")); Object.assign(r, { tours: { home: 1, quiz: 1, train: 1, library: 1, insights: 1, course: 1, proofs: 1 }, backupNoticeSeen: true, onboardingContext: "hs", onboardingLevel: "mid" }); r.settings.showAllFeatures = true; localStorage.setItem("buzzcalculus.records.v1", JSON.stringify(r)); return 1;`;
const CLEAN = `const st = document.createElement("style"); st.textContent = "::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important;caret-color:transparent}"; document.head.appendChild(st); return 1;`;

async function main() {
  fs.mkdirSync(path.join(RAW, "stills"), { recursive: true });
  const mfFile = path.join(RAW, "manifest.json");
  const manifest = fs.existsSync(mfFile) ? JSON.parse(fs.readFileSync(mfFile, "utf8")) : {};
  const release = await acquire("site_trailer record");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (c) => chrome.evaluate(c);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vs = (ms) => sleep(ms * K);
  const waitFor = async (e, ms = 15000) => { for (const end = Date.now() + ms; Date.now() < end; await sleep(80)) if (await ev(`return Boolean(${e})`)) return true; return false; };

  // 一直截圖（頁面放慢 K 倍，所以每格之間頁面只走了一點點）
  let rec = null;
  const loop = async () => {
    while (rec) {
      const a = Date.now();
      const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
      if (!rec) break;
      const f = `f${String(rec.frames.length).padStart(5, "0")}.jpg`;
      fs.writeFileSync(path.join(rec.dir, f), Buffer.from(data, "base64"));
      rec.frames.push({ f, at: (a + Date.now()) / 2 });
    }
  };
  const film = async (name, body, hold = 800) => {
    const dir = path.join(RAW, name);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    rec = { dir, frames: [] };
    const looping = loop();
    await sleep(400 * K);
    const t0 = Date.now();
    const marks = {};
    try { await body((k) => { marks[k] = (Date.now() - t0) / 1000 / K; }); } finally {
      await sleep(hold * K);
      const end = Date.now();
      const frames = rec.frames;
      rec = null;
      await looping;
      const base = frames.length ? frames[0].at : t0;
      manifest[name] = { frames: frames.map((x) => ({ f: x.f, t: Number(((x.at - base) / 1000 / K).toFixed(3)) })), seconds: Number(((end - base) / 1000 / K).toFixed(3)), marks: Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, Number((v + (t0 - base) / 1000 / K).toFixed(3))])) };
      fs.writeFileSync(mfFile, JSON.stringify(manifest, null, 1));
      console.log(`${name}: ${frames.length} 格，${manifest[name].seconds.toFixed(1)} 秒（${(frames.length / manifest[name].seconds).toFixed(0)} fps）`, JSON.stringify(manifest[name].marks));
    }
  };

  const big = () => chrome.send("Emulation.setDeviceMetricsOverride", { width: W * ZOOM, height: H * ZOOM, deviceScaleFactor: 1, mobile: false });
  const sharp = (w = W, h = H, dsf = 2, mobile = false) => chrome.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: dsf, mobile });
  const setZoom = (z) => ev(`document.documentElement.style.zoom = "${z}"; return 1;`);
  const go = async (hash, zoom = 1) => {
    await chrome.navigate(`${server.url}/index.html${hash}`);
    await setZoom(zoom);
    await ev(CLEAN);
    await chrome.send("Animation.setPlaybackRate", { playbackRate: 1 / K });
    await ev(`const b = document.querySelector('button[data-action="dismiss-notice"]'); if (b) b.click(); return 1;`);
    await sleep(1200 * K);
  };
  const act = async (a, wait = 900) => { const ok = await ev(`const b = [...document.querySelectorAll('[data-action="${a}"]')].find((n) => n.getClientRects().length); if (b) b.click(); return Boolean(b);`); await sleep(wait * K); return ok; };
  const freeMode = async () => { if (!(await ev(`return Boolean(document.querySelector("#answer"))`))) await act("toggle-answer-mode", 600); };
  const type = (sel, text, per) => ev(`${TYPE} return await window.__type(${JSON.stringify(sel)}, ${JSON.stringify(text)}, ${per});`);
  const submit = () => ev(`${TYPE} return window.__submit();`);
  const waitFeedback = () => waitFor(`document.querySelector(".feedback, .feedback-head")`, 5000 * K);
  const snap = async (file, clip) => {
    const { data } = await chrome.send("Page.captureScreenshot", clip ? { format: "jpeg", quality: 93, clip: { ...clip, scale: 1 } } : { format: "jpeg", quality: 93 });
    fs.writeFileSync(path.join(RAW, "stills", file), Buffer.from(data, "base64"));
  };
  // 一個元素的框（CSS 像素，含一點邊）
  const rectOf = async (sel, pad = 0) => JSON.parse(await ev(`const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((n) => n.getClientRects().length); if (!e) return "null"; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return JSON.stringify({ x: r.left - ${pad}, y: r.top - ${pad}, width: r.width + ${pad * 2}, height: r.height + ${pad * 2} });`));

  try {
    await chrome.navigate(server.url + "/index.html");
    await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: SHIM });
    await chrome.send("Animation.enable");
    await sharp();
    await ev("localStorage.clear(); return 1;");
    await chrome.navigate(server.url + "/index.html");
    console.log("合成紀錄：", await ev(SEED), "局");
    await ev(PROFILE);

    /* ── 互動（screencast）── */
    if (want("ok")) {
      await go("#p=der-001"); await freeMode();
      await film("ok", async (mark) => {
        await vs(500);
        mark("type");
        await type("#answer", "5x^4 - 6x", 85);
        await vs(450);
        mark("submit");
        await submit(); await waitFeedback();
        mark("feedback");
        await vs(1600);
      }, 300);
    }
    if (want("wrong")) {
      await go("#p=ch-mix-001"); await freeMode();
      await film("wrong", async (mark) => {
        await vs(400);
        mark("type");
        await type("#answer", "2x*sin(e^(3x)) + x^2*e^(3x)*cos(e^(3x))", 30);
        await vs(400);
        mark("submit");
        await submit(); await waitFeedback();
        mark("feedback");
        await vs(2600);
      }, 300);
    }
    if (want("slope")) {
      await go("#p=gi-101");
      await film("slope", async (mark) => {
        await vs(300);
        mark("drag");
        await ev(`
          const svg = document.querySelector('svg[data-graph-interactive="slope"]');
          const problem = window.BUZZ_PROBLEMS.find((p) => p.id === "gi-101");
          const at = (x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
          const fire = (type, x, y) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, ...at(x, y) }));
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          const px = Number(problem.pivot.x); const py = px * px; const answer = Number(problem.answer);
          const win = svg.dataset.graphWindow.split(",").map(Number); const dx = (win[1] - win[0]) * 0.2;
          fire("pointerdown", px + dx, py - 1.0 * dx);
          for (let t = 0; t <= 50; t += 1) { const u = t / 50; const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; const s = -1.0 + (answer + 1.0) * e; fire("pointermove", px + dx, py + s * dx); await wait(28); }
          fire("pointerup", px + dx, py + answer * dx);
          return 1;`);
        await vs(350);
        mark("submit");
        await act("submit-graphslope", 0); await waitFeedback();
        mark("feedback");
        await vs(1300);
      }, 200);
    }
    if (want("tap")) {
      await go("#p=gi-003");
      await film("tap", async (mark) => {
        await vs(300);
        mark("tap");
        await ev(`
          let svg = document.querySelector('svg[data-graph-interactive="tap"]');
          const at = (x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          for (const x of [-1, 1, 0]) { svg = document.querySelector('svg[data-graph-interactive="tap"]'); svg.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ...at(x, 0) })); await wait(420); }
          return 1;`);
        await vs(250);
        mark("submit");
        await act("submit-graphtap", 0); await waitFeedback();
        mark("feedback");
        await vs(1300);
      }, 200);
    }
    if (want("interval")) {
      await go("#p=si-int-012"); await freeMode();
      await film("interval", async (mark) => {
        await vs(300);
        mark("type");
        await type("#answer", "(-inf,-1) U (1,inf)", 55);
        await vs(350);
        mark("submit");
        await submit(); await waitFeedback();
        mark("feedback");
        await vs(1400);
      }, 200);
    }
    if (want("eps")) {
      await go("#p=ep-001");
      await film("eps", async (mark) => {
        await vs(300);
        mark("start");
        // 每一關：δ 從太大慢慢縮到成立，交出去，換下一個 ε
        await ev(`
          const problem = window.BUZZ_PROBLEMS.find((p) => p.id === "ep-001");
          const game = window.BuzzEpsilonGame;
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          for (let i = 0; i < problem.epsilon.levels.length; i += 1) {
            const best = game.maxDelta(problem.epsilon, Number(problem.epsilon.levels[i]));
            const from = best * 1.8, to = best * 0.75, n = i === 0 ? 30 : 16;
            for (let k = 0; k <= n; k += 1) {
              const slider = document.querySelector("[data-eps-delta]");
              const u = k / n; slider.value = String(from + (to - from) * (1 - Math.pow(1 - u, 2)));
              slider.dispatchEvent(new Event("input", { bubbles: true }));
              await wait(36);
            }
            await wait(i === 0 ? 450 : 250);
            document.querySelector('[data-action="epsilon-submit"]').click();
            if (i < problem.epsilon.levels.length - 1) await wait(650);
          }
          return 1;`);
        mark("done");
        await waitFeedback();
        mark("feedback");
        await vs(1200);
      }, 200);
    }
    if (want("sketch")) {
      await go("#p=sk-008");
      await film("sketch", async (mark) => {
        await vs(300);
        mark("draw");
        await ev(`
          const svg = document.querySelector('svg[data-graph-interactive="sketch"]');
          const problem = window.BUZZ_PROBLEMS.find((p) => p.id === "sk-008");
          const fn = new Function("x", "const {sin,cos,exp,log,sqrt,abs}=Math; return (" + problem.sketch.expr + ");");
          const at = (x, y) => { const win = svg.dataset.graphWindow.split(",").map(Number); const size = svg.dataset.graphSize.split(",").map(Number); const pad = Number(svg.dataset.graphPad); const rect = svg.getBoundingClientRect(); const u = pad + ((x - win[0]) / (win[1] - win[0])) * (size[0] - 2 * pad); const v = size[1] - pad - ((y - win[2]) / (win[3] - win[2])) * (size[1] - 2 * pad); return { clientX: rect.left + (u / size[0]) * rect.width, clientY: rect.top + (v / size[1]) * rect.height }; };
          const fire = (type, x, y) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: "pen", ...at(x, y) }));
          const wait = (ms) => new Promise((r) => setTimeout(r, ms));
          const [a, b] = problem.sketch.pieces[0];
          for (let i = 0; i <= 60; i += 1) { const x = a + ((b - a) * i) / 60; const y = fn(x) + 0.08 * Math.sin(5 * x); fire(i === 0 ? "pointerdown" : "pointermove", x, y); if (i === 60) fire("pointerup", x, y); await wait(22); }
          return 1;`);
        await vs(350);
        mark("submit");
        await act("submit-sketch", 0); await waitFeedback();
        mark("feedback");
        await vs(1300);
      }, 200);
    }
    if (want("proof")) {
      await go("");
      await act("open-proofs", 1200);
      await ev(`const r = document.querySelector('tr[data-proof-key="pl:pl-limit-linear"]'); if (r) r.click(); return Boolean(r);`);
      await vs(1400);
      await ev(`const t = document.querySelector("[data-proof-lang-text]"); if (t) t.scrollIntoView({ block: "start" }); window.scrollBy(0, -140); return 1;`);
      await vs(500);
      await film("proof", async (mark) => {
        const lines = ["任取 ε > 0。", "取 δ = ε/3。", "假設 0 < |x − 2| < δ。", "則 |3x − 6| = 3|x − 2| < 3δ = ε。", "所以 lim_{x→2} 3x = 6。"];
        let text = "";
        mark("type");
        for (const line of lines) {
          for (const ch of line) {
            text += ch;
            await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
            await vs(14);
          }
          text += "\n";
          await vs(320);
        }
        mark("typed");
        await vs(900);
        // 把 δ 改成 ε：第 4 行馬上變紅
        mark("break");
        await ev(`const t = document.querySelector("[data-proof-lang-text]"); t.value = ${JSON.stringify(text.replace("取 δ = ε/3。", "取 δ = ε。"))}; t.dispatchEvent(new Event("input", { bubbles: true })); return 1;`);
        await vs(1800);
      }, 200);
    }
    if (want("home")) {
      // 首頁：慢慢往下捲（連勝、本週、弱點）
      await go("");
      await film("home", async (mark) => {
        await vs(500);
        mark("scroll");
        await ev(`${TYPE} await window.__scrollTo(420, 2200); return 1;`);
        await vs(400);
      }, 300);
    }

    /* ── 靜態（DSF 2 截圖）── */
    if (want("stills")) {
      await sharp();
      const page = async (file, hash, action) => {
        await go(hash, 1);
        if (action) await act(action, 1500);
        await ev(`window.scrollTo(0, 0); return 1;`);
        await sleep(600);
        await snap(file);
      };
      await sharp(390, 844, 3, true);
      await go("", 1);
      await vs(800);
      await snap("phone-home.jpg");
      await sharp();
      await page("home.jpg", "");
      for (const [sel, file] of [[".home-streak, .streak-card, [data-streak]", "c-streak.jpg"]]) {
        const r = await rectOf(sel, 0);
        console.log(file, JSON.stringify(r));
      }
      await page("train.jpg", "", "open-train");
      await page("library.jpg", "", "open-library");
      await page("insights.jpg", "", "open-insights");
      await page("proofs.jpg", "", "open-proofs");
      await page("mistakes.jpg", "", "open-mistakes");
      await page("daily.jpg", "", "start-daily-one");
      // 卡片特寫：數據頁的雷達、首頁的連勝
      await go("", 1); await act("open-insights", 1500);
      const cards = JSON.parse(await ev(`return JSON.stringify([...document.querySelectorAll(".panel, .card, section")].filter((n) => n.getClientRects().length).map((n) => { const r = n.getBoundingClientRect(); return { cls: n.className.slice(0, 40), text: (n.innerText || "").slice(0, 16), x: r.left, y: r.top + scrollY, w: r.width, h: r.height }; }).filter((c) => c.w > 200 && c.h > 120 && c.h < 900));`));
      fs.writeFileSync(path.join(RAW, "stills", "insights-cards.json"), JSON.stringify(cards, null, 1));
      // 數據頁的雷達：捲到雷達那張卡在畫面中間
      await ev(`const c = [...document.querySelectorAll(".study-card, .panel")].find((n) => /技巧精熟雷達/.test(n.innerText || "")); if (c) c.scrollIntoView({ block: "center" }); return Boolean(c);`);
      await sleep(800);
      await snap("radar.jpg");
    }
  } finally {
    await chrome.close();
    await server.stop();
    release();
  }
}

main().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
