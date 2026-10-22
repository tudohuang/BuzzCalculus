// 課程介紹片的素材：照 STORYBOARD.md 一鏡一鏡錄。不是螢幕錄影 —— 跟 record_board_demo.js 一樣，
// 旁白用假的時鐘一格一格推（每格之前把 BuzzCourseSections.voice() 換成「現在念到第幾毫秒」），所以畫面跟聲音對得剛好；
// 筆跡是一格送幾個點、再截一格；攤開整課／地圖是靜態大圖（鏡頭在合成頁裡動）。
//
// 用法：node tools/course_film/record.js [--only a-wrong,e-ink] [--dsf 3]
// 輸出：docs/trailer/course-film/raw/<鏡>/f00000.jpg … ＋ raw/manifest.json（每鏡格數、尺寸、旁白片段）
"use strict";

const fs = require("fs");
const path = require("path");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");
const { acquire } = require("../lib/chrome_lock.js");
const { anchorMs } = require("../lib/course_board_check.js");

const ROOT = path.join(__dirname, "..", "..");
const RAW = path.join(ROOT, "docs", "trailer", "course-film", "raw");
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ONLY = opt("--only", "") ? opt("--only", "").split(",") : null;
const DSF = Number(opt("--dsf", "3"));
const FPS = 30;
const VIEW = { width: 1180, height: 820 }; // 合成頁的螢幕是 1400×972，同比例
const SEED = { tours: { home: 1, quiz: 1 }, settings: { showAllFeatures: true }, onboardingSeen: true, onboardingContext: "hs", onboardingLevel: "newbie", backupNoticeSeen: true };

// 一課的旁白時間（narration.json 女聲那一支）＋ 板書錨點換成毫秒
const narr = require("../build_narration.js").readIndex();
function timing(id) {
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`), "utf8"));
  const N = narr.lessons[id].f;
  const patch = L.sections.map((s, si) => s.beats.map((b, bi) => {
    const k = `${si}-${bi}`;
    const e = N.beats[k], q = N.beats[`${k}q`];
    return {
      t: e && e.t, qt: q && q.t, say: b.say, ask: b.why && b.why.say,
      ms: (b.board || []).map((a) => { const w = (b.why && !a.why ? q : e) || {}; return a.on && w.w ? anchorMs(a.on, b.why && !a.why ? b.why.say : b.say, w.w) : null; })
    };
  }));
  return { L, N, patch, mp3: path.join(ROOT, "media", "narration", `${id}-${N.f}.mp3`) };
}

// 鏡頭表（順序＝錄的順序；名稱對 comp.html 的 SCENES）
const SHOTS = [
  { name: "a-wrong", kind: "board", lesson: "chain-rule", sec: 0, beats: [0, 1, 2] },
  { name: "b-arrow", kind: "board", lesson: "chain-rule", sec: 1, beats: [0], then: "e-ink" },
  { name: "c-plot", kind: "board", lesson: "secant-to-tangent", sec: 2, beats: [0, 1] },
  { name: "d-why", kind: "board", lesson: "mean-value-theorem", sec: 2, beats: [0, 1, 2], why: true },
  { name: "f-overview", kind: "overview", lesson: "chain-rule" },
  { name: "g-map", kind: "map" },
  { name: "h-mont-1", kind: "overview", lesson: "secant-to-tangent", plain: true },
  { name: "h-mont-2", kind: "overview", lesson: "mean-value-theorem", plain: true },
  { name: "h-mont-3", kind: "overview", lesson: "basel-problem", plain: true },
  { name: "h-mont-4", kind: "overview", lesson: "polar-graphs", plain: true }
];

async function main() {
  fs.mkdirSync(RAW, { recursive: true });
  const mfFile = path.join(RAW, "manifest.json");
  const manifest = fs.existsSync(mfFile) ? JSON.parse(fs.readFileSync(mfFile, "utf8")) : {};
  const release = await acquire("course_film record");
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (c) => chrome.evaluate(c);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (e, ms = 15000) => { for (const end = Date.now() + ms; Date.now() < end; await sleep(80)) if (await ev(`return Boolean(${e})`)) return true; return false; };
  const metrics = (h = VIEW.height, dsf = DSF) => chrome.send("Emulation.setDeviceMetricsOverride", { width: VIEW.width, height: h, deviceScaleFactor: dsf, mobile: false });

  let dir = null, n = 0;
  const begin = (name) => { dir = path.join(RAW, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); n = 0; };
  const shot = async () => {
    const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
    fs.writeFileSync(path.join(dir, `f${String(n).padStart(5, "0")}.jpg`), Buffer.from(data, "base64"));
    n += 1;
  };
  const still = async (file, q = 92) => {
    const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: q });
    fs.writeFileSync(path.join(dir, file), Buffer.from(data, "base64"));
  };

  const fresh = async () => {
    await metrics();
    await chrome.navigate(`${server.url}/index.html`);
    await ev(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", ${JSON.stringify(JSON.stringify(SEED))}); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await waitFor(`document.querySelector("#app")`, 30000);
    await sleep(800);
  };
  const openLesson = async (id) => {
    await ev(`const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = ${JSON.stringify(id)}; document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1;`);
    await waitFor(`window.BUZZ_COURSE_V2_LESSONS && window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(id)}] && document.querySelector("[data-cv2s] .cv2s-sec") && window.BuzzBoard`, 20000);
  };
  // 換成假的旁白時鐘，播放列藏起來（字幕在合成頁上另外打）
  const fakeVoice = async (T) => {
    await ev(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(T.L.id)}]; const P = ${JSON.stringify(T.patch.map((s) => s.map((b) => ({ t: b.t, qt: b.qt, ms: b.ms }))))};
      L.voice = ${JSON.stringify(T.N.f)};
      L.sections.forEach((s, si) => s.beats.forEach((b, bi) => { const p = P[si][bi]; if (p.t) b.t = p.t; if (p.qt && b.why) b.why.t = p.qt; (b.board || []).forEach((a, k) => { if (p.ms[k] !== null) a.ms = p.ms[k]; else delete a.ms; }); }));
      const S = window.BuzzCourseSections; S.voice = () => window.__fake || {};
      const st = document.createElement("style"); st.textContent = ".cv2s-voice,.cv2s-dock,[data-cv2s-dock]{visibility:hidden!important}*{caret-color:transparent}";
      document.head.appendChild(st); return 1;`);
  };
  const tick = (o) => ev(`window.__fake = ${JSON.stringify(o)}; window.BuzzBoard.debug.tick(); return 1;`);

  try {
    for (const S of SHOTS) {
      if (ONLY && !ONLY.includes(S.name) && !(S.then && ONLY.includes(S.then))) continue;
      console.log(`── ${S.name}`);
      const entry = { kind: S.kind, fps: FPS, audio: [], subs: [] };
      if (S.kind === "board") {
        const T = timing(S.lesson);
        await fresh();
        await openLesson(S.lesson);
        await fakeVoice(T);
        await ev(`document.querySelector('[data-action="course-s-go"][data-to="${S.sec}"]').click(); return 1;`);
        await waitFor(`window.BuzzBoard.state() && window.BuzzBoard.state().key === ${JSON.stringify(`${S.lesson}:${S.sec}`)}`);
        await ev(`await document.fonts.ready; window.BuzzBoard.debug.rebuild(); return 1;`);
        begin(S.name);
        let video = 0; // 毫秒
        // 一段旁白：時鐘從 a 走到 b（錄音毫秒）
        const clip = async (key, a, b, say) => {
          const total = Math.round(((b - a) / 1000) * FPS);
          entry.audio.push({ mp3: path.relative(ROOT, T.mp3).replace(/\\/g, "/"), at: video / 1000, from: a / 1000, to: (a + (total * 1000) / FPS) / 1000 });
          if (say) entry.subs.push({ at: video / 1000, to: (video + (total * 1000) / FPS) / 1000, text: say });
          for (let f = 0; f < total; f += 1) {
            await tick({ on: true, paused: false, wait: false, beat: key, at: Math.round(a + ((f + 0.5) / FPS) * 1000), start: a, end: b, rate: 1 });
            await shot();
          }
          video += (total * 1000) / FPS;
        };
        const hold = async (ms, key, span) => {
          const total = Math.round((ms / 1000) * FPS);
          for (let f = 0; f < total; f += 1) { await tick({ on: true, paused: true, wait: true, beat: key, at: span[1], start: span[0], end: span[1], rate: 1 }); await shot(); }
          video += (total * 1000) / FPS;
        };
        for (const bi of S.beats) {
          if (bi !== S.beats[0]) {
            await ev(`const n = document.querySelector("[data-cv2s-next]"); if (n) n.click(); return 1;`);
            await waitFor(`window.BuzzBoard.state().at === ${bi}`);
          } else if (bi > 0) {
            for (let k = 0; k < bi; k += 1) { await ev(`const n = document.querySelector("[data-cv2s-next]"); if (n) n.click(); return 1;`); await sleep(300); }
            await waitFor(`window.BuzzBoard.state().at === ${bi}`);
          }
          await sleep(450);
          const p = T.patch[S.sec][bi];
          const key = `${S.sec}-${bi}`;
          if (p.qt && S.why) {
            await clip(key, p.qt[0], p.qt[1], p.ask);
            await hold(900, key, p.qt);
            // 先點錯的（看它說為什麼不對），再點對的
            const wrong = T.L.sections[S.sec].beats[bi].why.options.findIndex((o) => !o.correct);
            const right = T.L.sections[S.sec].beats[bi].why.options.findIndex((o) => o.correct);
            await ev(`const b = document.querySelector('[data-action="course-s-why"][data-beat="${bi}"][data-option="${wrong}"]'); if (b) b.click(); return 1;`);
            await sleep(400);
            await hold(1800, key, p.qt);
            await ev(`const b = document.querySelector('[data-action="course-s-why"][data-beat="${bi}"][data-option="${right}"]'); if (b) b.click(); return 1;`);
            await sleep(400);
            await hold(1000, key, p.qt);
          }
          if (p.t) await clip(key, p.t[0], p.t[1], p.say);
          if (bi === S.beats[S.beats.length - 1]) await hold(700, key, p.t);
        }
        entry.frames = n;
        entry.seconds = n / FPS;
        manifest[S.name] = entry;
        console.log(`  ${n} 格（${(n / FPS).toFixed(1)} 秒）`);
        // 接著在同一塊板上用筆寫（e-ink）：一格送幾個點
        if (S.then && (!ONLY || ONLY.includes(S.then))) {
          const ink = { kind: "ink", fps: FPS, audio: [], subs: [] };
          await waitFor(`document.querySelector(".cvk-bar") && window.BuzzInk`, 8000);
          const items = JSON.parse(await ev(`const b = document.querySelector("[data-cv2s] .cvb"); return JSON.stringify([...b.querySelectorAll(".cvb-c > .cvb-i")].filter((e) => getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).opacity > 0.5 && e.getBoundingClientRect().height > 10 && e.getBoundingClientRect().top > b.getBoundingClientRect().top && e.getBoundingClientRect().bottom < innerHeight - 40).map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }));`));
          console.log("  板上的項：", JSON.stringify(items.slice(0, 6)));
          begin(S.then);
          const mouse = (type, x, y) => chrome.send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1, pointerType: "pen" });
          const strokes = inkPlan(items);
          ink.strokes = [];
          for (let f = 0; f < 10; f += 1) await shot();
          for (const pts of strokes) {
            const f0 = n;
            await mouse("mousePressed", pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i += 1) {
              await mouse("mouseMoved", pts[i][0], pts[i][1]);
              if (i % 3 === 0) await shot(); // 一格 3 點（點距約 6px → 約 540px／秒，手寫的速度）
            }
            await mouse("mouseReleased", pts[pts.length - 1][0], pts[pts.length - 1][1]);
            await shot();
            ink.strokes.push({ f0, f1: n, box: bbox(pts) });
            for (let f = 0; f < 6; f += 1) await shot(); // 換筆之間的停頓
          }
          for (let f = 0; f < 24; f += 1) await shot();
          ink.frames = n;
          ink.seconds = n / FPS;
          ink.view = VIEW;
          manifest[S.then] = ink;
          console.log(`  ${S.then}：${n} 格，${strokes.length} 筆`);
        }
      } else if (S.kind === "overview") {
        await fresh();
        // 有筆跡的那一課：先把 e-ink 寫進 localStorage 的筆記留著（同一台、同一個 origin）—— 直接重錄一次最穩：
        await openLesson(S.lesson);
        if (!S.plain) {
          const T = timing(S.lesson);
          await fakeVoice(T);
          await ev(`document.querySelector('[data-action="course-s-go"][data-to="1"]').click(); return 1;`);
          await waitFor(`window.BuzzBoard.state() && window.BuzzBoard.state().key === ${JSON.stringify(`${S.lesson}:1`)}`);
          const t0 = T.patch[1][0].t;
          await tick({ on: true, paused: true, wait: true, beat: "1-0", at: t0[1], start: t0[0], end: t0[1], rate: 1 });
          await sleep(1200);
          await waitFor(`document.querySelector(".cvk-bar") && window.BuzzInk`, 8000);
          const items = JSON.parse(await ev(`const b = document.querySelector("[data-cv2s] .cvb"); return JSON.stringify([...b.querySelectorAll(".cvb-c > .cvb-i")].filter((e) => getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).opacity > 0.5 && e.getBoundingClientRect().height > 10 && e.getBoundingClientRect().top > b.getBoundingClientRect().top && e.getBoundingClientRect().bottom < innerHeight - 40).map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }));`));
          const mouse = (type, x, y) => chrome.send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1, pointerType: "pen" });
          for (const pts of inkPlan(items)) {
            await mouse("mousePressed", pts[0][0], pts[0][1]);
            for (const p of pts.slice(1)) await mouse("mouseMoved", p[0], p[1]);
            await mouse("mouseReleased", pts[pts.length - 1][0], pts[pts.length - 1][1]);
            await sleep(120);
          }
          await sleep(800);
        }
        await ev(`const b = document.createElement("button"); b.dataset.action = "course-s-board"; document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1;`);
        await waitFor(`document.querySelector(".cvb-ov-page")`, 20000);
        await sleep(2500);
        begin(S.name);
        // 一張是畫面大小（鏡頭從這裡拉遠），一張是整面攤開的長圖（往下搖）；
        // 有筆跡的那一課再補一張筆跡附近的放大（匹配剪接要推到很近；整張用 DSF 6 截，GPU 的圖塊會掉）
        await still("view.jpg");
        if (!S.plain) {
          const Z = { x: 0, y: 330, w: 600, h: 300 };
          const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 92, clip: { x: Z.x, y: Z.y, width: Z.w, height: Z.h, scale: 2 } });
          fs.writeFileSync(path.join(dir, "zoom.jpg"), Buffer.from(data, "base64"));
          entry.zoom = Z;
        }
        const H = await ev(`return document.querySelector(".cvb-ov").scrollHeight;`);
        const tall = Math.min(H, 5200);
        await metrics(tall, 2);
        await sleep(1500);
        await still("tall.jpg", 88);
        // 有筆跡的那一頁在畫面上的位置（match cut 要對準）
        entry.ink = JSON.parse(await ev(`const p = document.querySelector(".cvb-ov .cvk path"); if (!p) return "null"; const r = p.closest(".cvb-ov-page").getBoundingClientRect(); const q = p.getBoundingClientRect(); return JSON.stringify({ page: { x: r.left, y: r.top, w: r.width, h: r.height }, path: { x: q.left, y: q.top, w: q.width, h: q.height } });`));
        entry.view = VIEW;
        entry.tall = { w: VIEW.width, h: tall };
        manifest[S.name] = entry;
        console.log(`  攤開：長 ${H}px，存 ${tall}px`);
      } else if (S.kind === "map") {
        await fresh();
        await ev(`const b = [...document.querySelectorAll("a,button")].find((x) => x.dataset.action === "open-course"); if (b) b.click(); return 1;`);
        await waitFor(`document.querySelector('[data-action="course-view"][data-mode="map"]')`);
        await ev(`document.querySelector('[data-action="course-view"][data-mode="map"]').click(); return 1;`);
        await waitFor(`document.querySelector(".cv2-map svg, .cv2-map canvas, .cv2-map .cmap")`, 20000);
        await sleep(2500);
        begin(S.name);
        await still("view.jpg");
        const box = JSON.parse(await ev(`const m = document.querySelector(".cv2-map"); const r = m.getBoundingClientRect(); return JSON.stringify({ x: r.left, y: r.top + scrollY, w: r.width, h: m.scrollHeight, sw: m.scrollWidth, doc: document.documentElement.scrollHeight });`));
        console.log("  地圖：", JSON.stringify(box));
        const tall = Math.min(box.doc, 6000);
        await metrics(tall, 2);
        await sleep(2000);
        await still("tall.jpg", 88);
        entry.map = box;
        entry.view = VIEW;
        entry.tall = { w: VIEW.width, h: tall };
        manifest[S.name] = entry;
      }
      fs.writeFileSync(mfFile, JSON.stringify(manifest, null, 1));
    }
  } finally {
    await chrome.close();
    await server.stop();
    release();
  }
}

// 筆跡：第一項底下畫一條波浪底線、右邊寫「×2」、第二項右邊打勾。座標是 CSS 像素
function inkPlan(items) {
  const out = [];
  const A = items[1] || items[0], B = items[2] || A; // 跳過節標題
  if (!A) return out;
  const pts = (fn, k) => { const p = []; for (let i = 0; i <= k; i += 1) p.push(fn(i / k)); return p; };
  // 波浪底線
  const y = A.y + A.h + 6, x0 = A.x - 4, x1 = A.x + Math.min(A.w, 360) + 4;
  out.push(pts((t) => [x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI * 5) * 3 + t * 2], Math.round((x1 - x0) / 6)));
  // ×2（右邊空白）
  const cx = A.x + Math.min(A.w, 360) + 40, cy = A.y + A.h * 0.5 - 4;
  out.push(pts((t) => [cx + t * 18, cy - 9 + t * 20], 6));
  out.push(pts((t) => [cx + 18 - t * 18, cy - 9 + t * 20], 6));
  const two = [[0, 0.25], [0.15, 0.05], [0.45, 0], [0.7, 0.12], [0.72, 0.38], [0.45, 0.65], [0.05, 1], [0.5, 0.98], [0.85, 1.02]];
  const tx = cx + 30, ty = cy - 14, s = 26;
  const two2 = [];
  for (let i = 0; i < two.length - 1; i += 1) for (let k = 0; k < 3; k += 1) { const u = k / 3; two2.push([tx + s * (two[i][0] + (two[i + 1][0] - two[i][0]) * u), ty + s * (two[i][1] + (two[i + 1][1] - two[i][1]) * u)]); }
  two2.push([tx + s * 0.85, ty + s * 1.02]);
  out.push(two2);
  // 第二項右邊打勾
  const kx = B.x + Math.min(B.w, 420) + 90, ky = B.y + B.h * 0.5;
  out.push(pts((t) => (t < 0.35 ? [kx + t / 0.35 * 10, ky + t / 0.35 * 12] : [kx + 10 + (t - 0.35) / 0.65 * 26, ky + 12 - (t - 0.35) / 0.65 * 30]), 14));
  return out;
}
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };

main().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
