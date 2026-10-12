// 黑板的示範影片：手機直立 390×844，真的旁白（narration.json 現在那一支 mp3）配上黑板，1× 與 1.5×。
// 給人看「動畫有沒有落在念到的那個詞上」—— 所以不是螢幕錄影：時間是假的（虛擬的旁白時鐘），一格一格截圖，
// 每一格之前把 BuzzCourseSections.voice() 換成「現在念到第幾毫秒」，黑板照它畫（跟真的 <audio>.currentTime 走同一條路）。
// 聲音另外照同一張時間表從那一課的 mp3 剪出來接好（WSL 的 ffmpeg），再跟畫面合成 mp4。
//
// 用法：node tools/record_board_demo.js chain-rule [--rate 1.5] [--sections 2,3] [--fps 30]
// 輸出：docs/report/course-review/board-demo/<課>-<rate>x.mp4（不進版控）＋ 抽格的總覽圖 <課>-<rate>x-sheet-*.png
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");
const { acquire } = require("./lib/chrome_lock.js");
const { anchorMs } = require("./lib/course_board_check.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs", "report", "course-review", "board-demo");
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const id = argv.find((a, i) => !a.startsWith("--") && !(argv[i - 1] || "").startsWith("--"));
const RATE = Number(opt("--rate", "1"));
const FPS = Number(opt("--fps", "30"));
const ONLY = opt("--sections", "") ? opt("--sections", "").split(",").map((x) => Number(x) - 1) : null;
const PAUSE_ANSWER = 1600; // 問「為什麼」之後，假裝想了一下再按「直接看」（毫秒，影片時間）
const PAUSE_SECTION = 1200; // 一節念完，停在動作前一下再換節
const wslPath = (p) => p.replace(/^([A-Za-z]):[\\/]/, (_m, d) => `/mnt/${d.toLowerCase()}/`).replace(/\\/g, "/");

async function main() {
  if (!id) { console.error("用法：node tools/record_board_demo.js <課> [--rate 1.5]"); process.exit(1); }
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "lessons", `${id}.json`), "utf8"));
  const N = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "narration.json"), "utf8")).lessons[id];
  const mp3 = path.join(ROOT, "media", "narration", `${id}-${N.f}.mp3`);
  if (!fs.existsSync(mp3)) throw new Error(`沒有 ${mp3}（先跑 node tools/build_narration.js）`);
  // 頁面上的課換成「新的那一支」的時間（上傳前出貨的是 prev）：t、why.t、board 的 ms
  const patch = L.sections.map((s, si) => s.beats.map((b, bi) => {
    const k = `${si}-${bi}`;
    const e = N.beats[k];
    const q = N.beats[`${k}q`];
    return {
      t: e && e.t, qt: q && q.t,
      ms: (b.board || []).map((a) => { const w = (b.why && !a.why ? q : e) || {}; return a.on && w.w ? anchorMs(a.on, b.why && !a.why ? b.why.say : b.say, w.w) : null; })
    };
  }));
  fs.mkdirSync(OUT, { recursive: true });
  const tag = `${id}-${RATE}x`;
  const frames = path.join(OUT, `${tag}-frames`);
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });

  const release = await acquire(`record_board_demo ${tag}`);
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  const ev = (c) => chrome.evaluate(c);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (e, ms = 8000) => { for (const end = Date.now() + ms; Date.now() < end; await sleep(60)) if (await ev(`return Boolean(${e})`)) return true; return false; };
  const segs = []; // 聲音：[{ from, to } | { gap }]（毫秒，錄音時間）
  let n = 0;
  let video = 0; // 影片時間（毫秒）
  const shot = async () => {
    const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
    fs.writeFileSync(path.join(frames, `f${String(n).padStart(6, "0")}.jpg`), Buffer.from(data, "base64"));
    n += 1;
  };
  // 錄一段：時鐘從 at0 走到 at1（錄音毫秒），影片時間照 RATE 縮
  const clip = async (key, at0, at1) => {
    const dur = (at1 - at0) / RATE;
    const total = Math.round((dur / 1000) * FPS);
    for (let f = 0; f < total; f += 1) {
      const at = at0 + ((f + 0.5) / FPS) * 1000 * RATE;
      await ev(`window.__fake = { on: true, paused: false, wait: false, beat: ${JSON.stringify(key)}, at: ${Math.round(at)}, start: ${at0}, end: ${at1}, rate: ${RATE} }; window.BuzzBoard.debug.tick(); return 1;`);
      await shot();
    }
    video += total * (1000 / FPS);
    segs.push({ from: at0, to: at0 + (total * 1000 * RATE) / FPS });
  };
  // 停一下（等回答、一節念完）：旁白停在那一段的結尾 —— start／end 要是那一段本來的，不然黑板會以為又從頭念
  const hold = async (ms, key, span) => {
    const total = Math.round((ms / 1000) * FPS);
    for (let f = 0; f < total; f += 1) {
      await ev(`window.__fake = { on: true, paused: true, wait: true, beat: ${JSON.stringify(key)}, at: ${span[1]}, start: ${span[0]}, end: ${span[1]}, rate: ${RATE} }; window.BuzzBoard.debug.tick(); return 1;`);
      await shot();
    }
    segs.push({ gap: (total * 1000) / FPS });
  };
  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await chrome.navigate(`${server.url}/index.html`);
    await ev(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 }, settings: { narrSubs: true } })); return 1;`);
    await chrome.navigate(`${server.url}/index.html`);
    await ev(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    await waitFor('document.querySelector(".cv2-index")');
    // 課文載進來之後換時間；旁白的狀態換成假的時鐘；播放鍵那一列藏起來，右上角標語速
    await ev(`const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = ${JSON.stringify(id)}; document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1;`);
    await waitFor(`window.BUZZ_COURSE_V2_LESSONS && window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(id)}] && document.querySelector("[data-cv2s] .cv2s-sec") && window.BuzzBoard`);
    await ev(`const L = window.BUZZ_COURSE_V2_LESSONS[${JSON.stringify(id)}]; const P = ${JSON.stringify(patch)};
      L.voice = ${JSON.stringify(N.f)};
      L.sections.forEach((s, si) => s.beats.forEach((b, bi) => { const p = P[si][bi]; if (p.t) b.t = p.t; if (p.qt && b.why) b.why.t = p.qt; (b.board || []).forEach((a, k) => { if (p.ms[k] !== null) a.ms = p.ms[k]; else delete a.ms; }); }));
      const S = window.BuzzCourseSections; S.voice = () => window.__fake || {};
      const st = document.createElement("style"); st.textContent = ".cv2s-voice,.cv2s-dock,[data-cv2s-dock]{visibility:hidden!important}.__rate{position:fixed;right:10px;top:10px;z-index:99;padding:3px 9px;border-radius:99px;background:#000a;color:#fff;font:600 13px system-ui}";
      document.head.appendChild(st); const r = document.createElement("div"); r.className = "__rate"; r.textContent = "旁白 ${RATE}×"; document.body.appendChild(r); return 1;`);
    const sections = L.sections.map((_s, i) => i).filter((i) => !ONLY || ONLY.includes(i));
    for (const si of sections) {
      await ev(`document.querySelector('[data-action="course-s-go"][data-to="${si}"]').click(); return 1;`);
      await waitFor(`document.querySelector("[data-cv2s]") && Number(document.querySelector("[data-cv2s]").dataset.cv2s) === ${si} && window.BuzzBoard.state() && window.BuzzBoard.state().key === ${JSON.stringify(`${id}:${si}`)}`);
      await ev(`await document.fonts.ready; window.BuzzBoard.debug.rebuild(); return 1;`);
      const S = L.sections[si];
      for (let bi = 0; bi < S.beats.length; bi += 1) {
        if (bi > 0) {
          await ev(`const n = document.querySelector("[data-cv2s-next]"); if (n) n.click(); return 1;`);
          await waitFor(`window.BuzzBoard.state().at === ${bi}`);
        }
        // 卷到這一句：等捲動停（smooth）
        await sleep(450);
        const b = S.beats[bi];
        const p = patch[si][bi];
        const key = `${si}-${bi}`;
        if (b.why && p.qt) {
          await clip(key, p.qt[0], p.qt[1]);
          await hold(PAUSE_ANSWER, key, p.qt);
          await ev(`const s = document.querySelector('[data-action="course-s-see"]'); if (s) s.click(); return 1;`);
          await sleep(300);
        }
        if (p.t) await clip(key, p.t[0], p.t[1]);
      }
      await hold(PAUSE_SECTION, `${si}-${S.beats.length - 1}`, patch[si][S.beats.length - 1].t);
      console.log(`  第 ${si + 1} 節：到第 ${n} 格（${(video / 1000).toFixed(1)} 秒）`);
    }
  } finally {
    await chrome.close();
    await server.stop();
    release();
  }
  // 聲音：照 segs 從 mp3 剪、中間補靜音，接起來再照語速加快（atempo 保持音高）
  const parts = [];
  const inputs = [];
  const nA = segs.filter((sg) => !sg.gap).length;
  // 同一個輸入在濾鏡圖裡只能用一次：先 asplit 成 nA 份
  if (nA) parts.push(`[1:a]asplit=${nA}${segs.map((sg, i) => (sg.gap ? "" : `[m${i}]`)).join("")}`);
  segs.forEach((sg, i) => {
    const fmt = ",aformat=sample_fmts=fltp:sample_rates=16000:channel_layouts=mono";
    if (sg.gap) { parts.push(`anullsrc=r=16000:cl=mono,atrim=0:${(sg.gap / 1000 * RATE).toFixed(3)}${fmt}[a${i}]`); }
    else parts.push(`[m${i}]atrim=${(sg.from / 1000).toFixed(3)}:${(sg.to / 1000).toFixed(3)},asetpts=PTS-STARTPTS${fmt}[a${i}]`);
    inputs.push(`[a${i}]`);
  });
  const graph = `${parts.join(";")};${inputs.join("")}concat=n=${segs.length}:v=0:a=1[cat];[cat]atempo=${RATE}[aout]`;
  const graphFile = path.join(OUT, `${tag}-audio.txt`);
  fs.writeFileSync(graphFile, graph);
  const outFile = path.join(OUT, `${tag}.mp4`);
  const ff = spawnSync("wsl", ["-e", "ffmpeg", "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", `${wslPath(frames)}/f%06d.jpg`, "-i", wslPath(mp3), "-filter_complex_script", wslPath(graphFile), "-map", "0:v", "-map", "[aout]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-shortest", wslPath(outFile)], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (ff.status !== 0) { console.error(ff.stderr || ff.error); process.exit(1); }
  console.log(`${path.relative(ROOT, outFile)}：${n} 格、${(video / 1000).toFixed(1)} 秒`);
  if (!argv.includes("--keep-frames")) fs.rmSync(frames, { recursive: true, force: true });
}

main().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
