// 錄一份「學生實際上一堂課」：從首頁點「下一課」進課 → 旁白調 1.25× → 播放 → 跟著板書聽 → 板上作答（有一題先答錯）→ 完成這一課。
//
// 慢動作錄（同 tools/site_trailer/record.js）：頁面裡的時間全部放慢 K 倍、一直截圖，格的時間戳除以 K 換回真實速度。
// 旁白也要一起慢：audio 的 playbackRate 實際設成 rate / K，對 app 回報 rate（旁白的時鐘就是 audio.currentTime，
// 剩多久用 playbackRate 換算，兩邊一起慢才對得上）。headless 錄不到聲音 —— 每一格記下旁白念到 mp3 的哪一秒，
// 之後照這張表把 mp3 一段一段剪出來、1.25 倍速、擺回影片的時間軸（render.js）。
//
// 用法：node tools/lesson_recording/record.js [--lesson mean-value-theorem] [--rate 1.25] [--slow 4]
// 輸出：docs/trailer/lesson/<課>/frames/f00000.jpg … ＋ manifest.json（每格的秒數、旁白位置）
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");
const { acquire } = require("../lib/chrome_lock.js");
const { SEED } = require("../lib/page_scripts.js");

const ROOT = path.join(__dirname, "..", "..");
const argv = process.argv.slice(2);
const arg = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const LESSON = arg("--lesson", "mean-value-theorem");
const RATE = Number(arg("--rate", "1.25"));
// 旁白實際速度＝語速 ÷ K；Chrome 低於 0.25 倍會怪（1.25 ÷ 6 卡住過），K 不要超過 5
const K = Number(arg("--slow", "4"));
const PROBE = argv.includes("--probe"); // 只錄到按下播放（除錯用）
const OUT = path.join(ROOT, "docs", "trailer", "lesson", LESSON);
const W = 1280, H = 800, DSF = 1.5;

const SHIM = `(() => { const K = ${K};
  const pn = performance.now.bind(performance), p0 = pn(); performance.now = () => p0 + (pn() - p0) / K;
  const dn = Date.now, d0 = dn(); Date.now = () => d0 + (dn() - d0) / K;
  const st = window.setTimeout, si = window.setInterval;
  window.setTimeout = (fn, ms, ...a) => st(fn, (ms || 0) * K, ...a);
  window.setInterval = (fn, ms, ...a) => si(fn, (ms || 0) * K, ...a);
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(performance.now()));
  // 旁白跟著慢：實際速度 ÷ K，app 讀到的還是它設的速度
  ["playbackRate", "defaultPlaybackRate"].forEach((p) => {
    const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, p);
    Object.defineProperty(HTMLMediaElement.prototype, p, { configurable: true, get() { return d.get.call(this) * K; }, set(v) { d.set.call(this, v / K); } });
  });
  window.__auds = new Set();
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { window.__auds.add(this); return play.call(this); };
  window.__aud = () => { for (const a of window.__auds) if (!a.paused) return { t: a.currentTime, src: (a.getAttribute("src") || "").split("/").pop() }; return null; };
})();`;

// 假游標（headless 截圖沒有滑鼠）：箭頭＋點下去的漣漪；移動用 CSS transition（也被放慢 K 倍）
const CURSOR = `(() => { if (document.getElementById("__cur")) return 1;
  const st = document.createElement("style");
  st.textContent = "#__cur{position:fixed;left:0;top:0;z-index:2147483647;width:26px;height:26px;pointer-events:none;transition:transform .55s cubic-bezier(.3,.7,.2,1);filter:drop-shadow(0 2px 3px #0005)}#__rip{position:fixed;z-index:2147483646;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:3px solid #e8a33d;pointer-events:none;opacity:0}#__rip.on{animation:__rip .5s ease-out}@keyframes __rip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.5)}}::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important;caret-color:transparent}";
  document.head.appendChild(st);
  const c = document.createElement("div"); c.id = "__cur";
  c.innerHTML = '<svg viewBox="0 0 26 26" width="26" height="26"><path d="M3 2 L3 21 L8.5 16 L12 24 L15.5 22.5 L12 14.8 L19.5 14.8 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  c.style.transform = "translate(900px, 520px)";
  const r = document.createElement("div"); r.id = "__rip";
  document.body.append(c, r);
  window.__move = (x, y) => { c.style.transform = "translate(" + (x - 3) + "px," + (y - 2) + "px)"; };
  window.__ripple = (x, y) => { r.classList.remove("on"); r.style.left = x + "px"; r.style.top = y + "px"; void r.offsetWidth; r.classList.add("on"); };
  return 1; })()`;

async function main() {
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/content/course_v2/lessons", `${LESSON}.json`), "utf8"));
  // 這一課之前（大綱順序、沒藏起來的 Stage）的課都讀完了：首頁「下一課」就是這一課
  const before = [];
  let hidden = false;
  for (const line of fs.readFileSync(path.join(ROOT, "tools/content/course_v2/OUTLINE.md"), "utf8").split(/\r?\n/)) {
    const s = /^## Stage \d+ (.+)$/.exec(line);
    if (s) hidden = /隱藏/.test(s[1]);
    const m = /^- [\d.]+ \| ([a-z0-9-]+) \|/.exec(line);
    if (!m || hidden) continue;
    if (m[1] === LESSON) break;
    before.push(m[1]);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, "frames"), { recursive: true });

  const release = await acquire("lesson recording");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (c) => chrome.evaluate(c);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vs = (ms) => sleep(ms * K);
  // 滑鼠座標：這台機器上 DSF ≠ 1 時 Input 的座標會被再除一次 DSF（點到左上方的東西）—— 開頭量一次比例再乘回去
  let scale = 1;
  const mouse = (type, x, y) => chrome.send("Input.dispatchMouseEvent", { type, x: x * scale, y: y * scale, button: "left", buttons: type === "mousePressed" ? 1 : 0, clickCount: 1 });
  const calibrate = async () => {
    await ev(`window.__mm = null; document.addEventListener("mousemove", (e) => { window.__mm = [e.clientX, e.clientY]; }, { once: true, capture: true }); return 1;`);
    await chrome.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 600, y: 400, button: "none", buttons: 0 });
    await sleep(300);
    const got = JSON.parse(await ev("return JSON.stringify(window.__mm);"));
    scale = got && got[0] ? 600 / got[0] : 1;
    console.log("滑鼠座標比例", scale.toFixed(3), JSON.stringify(got));
  };

  let rec = null;
  // 截圖跟滑鼠事件不能同時送：截圖的那一下 Input 的座標會被當成裝置像素（點到左上方 1/DSF 的地方）
  let gate = Promise.resolve();
  const exclusive = (fn) => { const run = gate.then(fn); gate = run.catch(() => {}); return run; };
  const loop = async () => {
    while (rec) {
      const a = Date.now();
      const { data } = await exclusive(() => chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 88 }));
      const aud = await ev("return window.__aud ? window.__aud() : null;").catch(() => null);
      if (!rec) break;
      const f = `f${String(rec.frames.length).padStart(5, "0")}.jpg`;
      fs.writeFileSync(path.join(OUT, "frames", f), Buffer.from(data, "base64"));
      rec.frames.push({ f, at: (a + Date.now()) / 2, aud });
    }
  };
  // 游標滑到元素上（找第一個看得到的）、停一下、真的點下去
  const tap = async (sel, { dx = 0.5, hold = 350 } = {}) => {
    const p = JSON.parse(await ev(`const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((n) => n.getClientRects().length); if (!e) return "null"; const r = e.getBoundingClientRect(); return JSON.stringify({ x: r.left + Math.min(r.width * ${dx}, 60), y: r.top + r.height / 2 });`));
    if (!p) { console.log("找不到", sel); return false; }
    await ev(`window.__move(${p.x}, ${p.y}); return 1;`);
    await vs(700);
    await ev(`window.__ripple(${p.x}, ${p.y}); return 1;`);
    if (PROBE) await ev(`window.__clicks = []; ["pointerdown", "mousedown", "pointerup", "click"].forEach((t) => document.addEventListener(t, (e) => window.__clicks.push(t + ":" + e.target.tagName + "#" + e.target.id + "." + e.target.className + "@" + e.clientX + "," + e.clientY), true)); return 1;`);
    if (PROBE) console.log("點在", sel, Math.round(p.x), Math.round(p.y), await ev(`const e = document.elementFromPoint(${p.x}, ${p.y}); return e ? e.outerHTML.slice(0, 90) : "null";`));
    await exclusive(async () => { await mouse("mouseMoved", p.x, p.y); await mouse("mousePressed", p.x, p.y); await mouse("mouseReleased", p.x, p.y); });
    await vs(hold);
    return true;
  };

  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DSF, mobile: false });
    await chrome.navigate(`${server.url}/index.html`);
    // 讀完的課分散在前幾週（今天還沒讀過 —— 首頁「下一課」才不會先打勾）；練習紀錄用合成的兩週（page_scripts 的 SEED）
    const day = (n) => new Date(Date.now() - n * 86400000).toISOString();
    await ev(SEED);
    const seeded = JSON.parse(await ev(`return localStorage.getItem("buzzcalculus.records.v1");`));
    const records = { ...seeded,
      tours: { home: 1, quiz: 1, train: 1, library: 1, insights: 1, course: 1, proofs: 1 }, onboardingSeen: true, backupNoticeSeen: true,
      onboardingContext: "freshman", onboardingLevel: "mid", settings: { ...(seeded.settings || {}), showAllFeatures: true, narrRate: 1 },
      courseV2: Object.fromEntries(before.map((id, i) => [id, { openedAt: day(1 + Math.round((before.length - i) / 6)), doneAt: day(1 + Math.round((before.length - i) / 6)) }]))
    };
    await ev(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(records))}); return 1;`);
    await chrome.send("Page.addScriptToEvaluateOnNewDocument", { source: SHIM });
    await chrome.send("Animation.enable");
    await chrome.navigate(`${server.url}/index.html`);
    await chrome.send("Animation.setPlaybackRate", { playbackRate: 1 / K });
    await vs(2500);
    await ev(`const b = document.querySelector('button[data-action="dismiss-notice"]'); if (b) b.click(); return 1;`);
    await ev(`return ${CURSOR};`);
    await calibrate();
    if (PROBE) console.log("zoom", await ev(`return JSON.stringify({ html: getComputedStyle(document.documentElement).zoom, body: getComputedStyle(document.body).zoom, app: getComputedStyle(document.querySelector("#app")).zoom, dpr: devicePixelRatio, iw: innerWidth, vv: visualViewport.scale, cw: document.documentElement.clientWidth });`));
    console.log("首頁下一課：", await ev(`const b = document.querySelector('.today-three [data-action="open-course-lesson"]'); return b ? b.textContent.trim() : "沒有";`));

    rec = { frames: [] };
    const looping = loop();
    const t0 = Date.now();
    const marks = [];
    const mark = (k) => { marks.push({ k, t: (Date.now() - t0) / 1000 / K }); console.log(`[${((Date.now() - t0) / 1000 / K).toFixed(1)}s] ${k}`); };
    try {
      await vs(1500);
      // 首頁 → 「今天三件事」的下一課
      await tap(`.today-three [data-action="open-course-lesson"][data-lesson-id="${LESSON}"]`, { hold: 2500 });
      mark("進課");
      if (PROBE) console.log("事件", await ev("return JSON.stringify(window.__clicks)"));
      console.log("進課後：", await ev(`return JSON.stringify({ lesson: Boolean(document.querySelector("[data-cv2s]")), h: (document.querySelector("main h2, .cv2-lesson h2") || {}).textContent, rate: Boolean(document.querySelector("[data-cv2s-rate]")), errs: window.__buzzErrors || [] });`));
      await vs(1500);
      // 語速 1× → 1.25×（一次往後一格）
      for (let i = 0; i < 3 && (await ev(`const r = document.querySelector("[data-cv2s-rate]"); return r ? r.textContent.trim() : "";`)) !== `${RATE}×`; i += 1) await tap("[data-cv2s-rate]", { hold: 900 });
      mark(`語速 ${await ev(`return document.querySelector("[data-cv2s-rate]").textContent.trim();`)}`);
      await tap("[data-cv2s-play]", { hold: 600 });
      mark("播放");
      if (PROBE) { await vs(4000); throw new Error("probe 結束"); }

      // 跟著上：板上的題目寫好了就答（第 7 節那題先答錯一次）；沒事做就等；卡住才點「下一節」
      const n = L.sections.length;
      const wrongOnce = new Set([6]);
      let lastKey = "";
      let still = 0;
      for (let guard = 0; guard < 6000; guard += 1) {
        const st = JSON.parse(await ev(`const v = window.BuzzCourseSections ? window.BuzzCourseSections.voice() : {}; const sec = document.querySelector("[data-cv2s] h3 small"); return JSON.stringify({ si: v.si, on: v.on, paused: v.paused, wait: v.wait, at: v.at, sec: sec ? sec.textContent : "", picks: [...document.querySelectorAll('.cvb [data-action="course-s-pick"]')].map((e) => ({ o: Number(e.dataset.option), kind: e.dataset.kind, c: Number(e.dataset.check) })), done: Boolean(document.querySelector(".cv2s-finish, .cv2s-goals")), inLesson: Boolean(document.querySelector("[data-cv2s]")) });`));
        if (st.done || !st.inLesson) { mark("完成畫面"); break; }
        const si = Number(String(st.sec).split("/")[0]) - 1;
        if (st.picks.length) {
          await vs(1600); // 看題、想一下
          const item = st.picks[0].kind === "check" ? L.checks[st.picks[0].c] : L.sections[si].predict;
          const right = item.options.findIndex((o) => o.correct);
          const opts = [...new Set(st.picks.map((p) => p.o))];
          let pick = right >= 0 ? right : opts[0];
          if (wrongOnce.has(si)) { wrongOnce.delete(si); pick = opts.find((o) => o !== right); mark(`第 ${si + 1} 節：先答錯`); }
          else mark(`第 ${si + 1} 節：作答`);
          await tap(`.cvb [data-action="course-s-pick"][data-option="${pick}"]`, { hold: 1200 });
          still = 0;
          continue;
        }
        // 旁白在念就是在上課：不算卡住（at 在慢動作下要好幾格才變一次，不能拿來判斷）
        const busy = st.on && !st.paused && !st.wait;
        const key = `${st.sec}|${st.on}|${st.paused}|${st.wait}`;
        still = busy || key !== lastKey ? 0 : still + 1;
        lastKey = key;
        // 旁白沒在走、也沒題目可答：等一下（自動翻頁是 1.2–3 秒），太久才自己按
        if (still > 24) {
          const nx = await ev(`const b = document.querySelector("[data-cv2s-next]"); return b && b.getClientRects().length ? b.textContent.trim() : "";`);
          mark(`卡住 → 按「${nx || "點板子"}」`);
          if (nx) await tap("[data-cv2s-next]", { hold: 1500 }); else await tap("[data-cvb-slot]", { dx: 0.5, hold: 1500 });
          still = 0;
          if (/完成這一課/.test(nx)) { await vs(1500); }
        }
        await vs(250);
      }
      await vs(5000);
      mark("結束");
    } finally {
      const frames = rec.frames;
      rec = null;
      await looping;
      const base = frames[0].at;
      const manifest = { lesson: LESSON, rate: RATE, K, size: [W * DSF, H * DSF], voice: L.voice || null, marks, frames: frames.map((x) => ({ f: x.f, t: Number(((x.at - base) / 1000 / K).toFixed(3)), a: x.aud ? Number(x.aud.t.toFixed(3)) : null, src: x.aud ? x.aud.src : undefined })) };
      fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest));
      const secs = manifest.frames[manifest.frames.length - 1].t;
      console.log(`${frames.length} 格、${secs.toFixed(1)} 秒（${(frames.length / secs).toFixed(1)} fps）→ ${OUT}`);
    }
  } finally {
    await chrome.close();
    if (server.close) server.close(); else if (server.stop) await server.stop();
    release();
  }
}

module.exports = { SHIM, CURSOR };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
