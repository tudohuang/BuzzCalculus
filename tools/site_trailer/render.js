// 全站 trailer：把 tools/site_trailer/comp.html 逐格截圖（預設 60fps），配上合成的 120 BPM 電子配樂，接成 mp4。
// 素材：record.js（docs/trailer/site/raw）＋ course_film 的課程素材。ffmpeg 走 WSL。
//
// 用法：node tools/site_trailer/render.js             輸出 docs/trailer/site/site-trailer.mp4（1080p60）
//       node tools/site_trailer/render.js --preview   每幕三格（不出影片）
//       node tools/site_trailer/render.js --fps 30    省一半時間
//       node tools/site_trailer/render.js --audio     只重做聲音（畫格留著）
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");

const ROOT = path.join(__dirname, "..", "..");
const FILM = path.join(ROOT, "docs", "trailer", "site");
const OUT = path.join(FILM, "build");
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const FPS = Number(opt("--fps", 60));
const PREVIEW = argv.includes("--preview");
const AUDIO_ONLY = argv.includes("--audio");
const wsl = (p) => p.replace(/^([A-Za-z]):[\\/]/, (_m, d) => `/mnt/${d.toLowerCase()}/`).replace(/\\/g, "/");

/* ── 配樂：120 BPM，A 小調（Am F C G）。合成的，沒有版權問題。
   段落跟著場景走：片頭四下重擊 → 鋪底與琶音慢慢疊 → 作答段進鼓 → 「不只選擇題」上升音 → 四格那裡 drop 全開
   → 快切前小鼓滾奏 → 數字卡斷開只剩鋪底 → 片尾一個大和弦收掉。轉場有 whoosh，答對那一下有一聲叮。 ── */
function writeMusic(file, seconds, scenes, marks) {
  const SR = 44100, BEAT = 0.5, BAR = 2;
  const n = Math.floor(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);   // 乾的
  const VL = new Float32Array(n), VR = new Float32Array(n); // 送殘響
  const SC = new Float32Array(n).fill(1);                    // 側鏈（kick 時壓）
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  let seed = 7; const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
  const put = (i, l, r, wet = 0) => { if (i < 0 || i >= n) return; L[i] += l; R[i] += r; if (wet) { VL[i] += l * wet; VR[i] += r * wet; } };

  const S = (k) => scenes.find((s) => s.music === k);
  const byKind = (k) => scenes.filter((s) => s.kind === k);
  const hook = S("hits"), drop = S("drop"), end = S("end");
  const sceneAt = (t) => scenes.find((s) => t >= s.start && t < s.end) || scenes[scenes.length - 1];
  const idx = (s) => scenes.indexOf(s);
  // 每一拍的能量：0 靜、1 鋪底、2 加琶音、3 鼓、4 全開
  const stats = scenes[scenes.length - 2];
  const riserScene = scenes[idx(drop) - 1];
  const level = (t) => {
    if (t < hook.end) return 0;
    if (t >= end.start) return 1;
    if (t >= stats.start) return 1;
    if (t >= drop.start) return 4;
    if (t >= riserScene.start) return 1;
    const s = sceneAt(t);
    if (idx(s) <= idx(hook) + 1) return 1;
    if (idx(s) <= idx(hook) + 3) return 2;
    return 3;
  };

  // 樂器
  const kick = (at, g = 1) => { const s0 = Math.floor(at * SR); let ph = 0; for (let i = 0; i < SR * 0.45; i += 1) { const t = i / SR; const f = 42 + 120 * Math.exp(-t * 32); ph += 2 * Math.PI * f / SR; const v = (Math.sin(ph) * Math.exp(-t * 7) + (t < 0.004 ? noise() * 0.4 : 0)) * 0.62 * g; put(s0 + i, v, v); }
    for (let i = 0; i < SR * 0.4 && s0 + i < n; i += 1) if (s0 + i >= 0) SC[s0 + i] = Math.min(SC[s0 + i], 1 - 0.65 * Math.exp(-(i / SR) * 9)); };
  const clap = (at, g = 1) => { const s0 = Math.floor(at * SR); let lp = 0; for (let i = 0; i < SR * 0.25; i += 1) { const t = i / SR; const x = noise(); lp += (x - lp) * 0.5; const hp = x - lp; const env = (t < 0.03 ? (Math.floor(t / 0.01) % 2 ? 0.6 : 1) : 1) * Math.exp(-t * 18); const v = hp * env * 0.32 * g; put(s0 + i, v * 0.9, v, 0.35); } };
  const hat = (at, g = 1, open = false) => { const s0 = Math.floor(at * SR); let lp = 0; const d = open ? 9 : 55; for (let i = 0; i < SR * (open ? 0.3 : 0.07); i += 1) { const t = i / SR; const x = noise(); lp += (x - lp) * 0.7; const v = (x - lp) * Math.exp(-t * d) * 0.11 * g; put(s0 + i, v * 0.8, v * 1.2); } };
  const saw = (ph) => 2 * (ph - Math.floor(ph)) - 1;
  // 一顆合成音：幾條失諧的鋸齒波 + 一階低通（截止頻率可以隨時間變）
  const synth = (at, len, midi, { g = 0.1, voices = 3, det = 0.012, cut = 2400, cutEnd = null, atk = 0.005, rel = 0.12, wet = 0.3, pan = 0, side = true } = {}) => {
    const s0 = Math.floor(at * SR), cnt = Math.floor((len + rel) * SR);
    const f = hz(midi); const phs = Array.from({ length: voices }, (_v, k) => k / voices);
    let y = 0;
    const gl = Math.cos((pan + 1) * Math.PI / 4) * 1.41, gr = Math.sin((pan + 1) * Math.PI / 4) * 1.41;
    for (let i = 0; i < cnt; i += 1) {
      const t = i / SR; if (s0 + i >= n) break;
      let x = 0;
      for (let k = 0; k < voices; k += 1) { phs[k] += f * (1 + det * (k - (voices - 1) / 2)) / SR; x += saw(phs[k]); }
      x /= voices;
      const c = cutEnd === null ? cut : cut * Math.pow(cutEnd / cut, Math.min(1, t / len));
      y += (x - y) * (1 - Math.exp(-2 * Math.PI * c / SR));
      const env = Math.min(1, t / atk) * (t > len ? Math.exp(-(t - len) / rel * 3) : 1);
      const sc = side && s0 + i >= 0 ? SC[s0 + i] : 1;
      const v = y * env * g * sc;
      put(s0 + i, v * gl, v * gr, wet);
    }
  };
  const sine = (at, len, f0, f1, g, wet = 0) => { const s0 = Math.floor(at * SR); let ph = 0; for (let i = 0; i < len * SR; i += 1) { const t = i / SR; const f = f0 * Math.pow(f1 / f0, t / len); ph += 2 * Math.PI * f / SR; const v = Math.sin(ph) * g * Math.exp(-t * 3 / len); put(s0 + i, v, v, wet); } };
  const impact = (at, g = 1) => { sine(at, 1.6, 90, 38, 0.55 * g); const s0 = Math.floor(at * SR); let lp = 0; for (let i = 0; i < SR * 1.4; i += 1) { const t = i / SR; const x = noise(); lp += (x - lp) * 0.25; const v = lp * Math.exp(-t * 3.2) * 0.35 * g; put(s0 + i, v, v * 0.95, 0.6); } };
  const whoosh = (center, w = 0.32, g = 1) => { const s0 = Math.floor((center - w) * SR), cnt = Math.floor(w * 1.6 * SR); let lp = 0, lp2 = 0; for (let i = 0; i < cnt; i += 1) { const t = i / cnt; const x = noise(); const c = 0.02 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.15)); lp += (x - lp) * c; lp2 += (lp - lp2) * c; const env = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 2); const v = (lp - lp2) * env * 0.5 * g; const pan = t * 2 - 1; put(s0 + i, v * (1 - pan) * 0.7, v * (1 + pan) * 0.7, 0.2); } };
  const riser = (a, b) => { const s0 = Math.floor(a * SR), cnt = Math.floor((b - a) * SR); let lp = 0; for (let i = 0; i < cnt; i += 1) { const t = i / cnt; const x = noise(); lp += (x - lp) * (0.02 + 0.6 * t * t); const v = (lp * 0.5 + Math.sin(2 * Math.PI * (200 + 900 * t * t) * (i / SR)) * 0.05) * t * t * 0.55; put(s0 + i, v, v, 0.4); } };
  const chime = (at) => { for (const [m, d] of [[88, 0], [95, 0.07]]) synth(at + d, 0.25, m, { g: 0.07, voices: 1, cut: 6000, rel: 0.9, wet: 0.5, side: false }); };

  // 和弦：Am F C G，一小節一個
  const prog = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]];
  const roots = [45, 41, 48, 43];
  const bars = Math.ceil(seconds / BAR);
  for (let b = 0; b < bars; b += 1) {
    const at = b * BAR, ci = b % 4, ch = prog[ci];
    const lv = level(at + 0.01);
    if (at >= seconds - 0.5) break;
    // 鋪底
    if (lv >= 1) for (const m of ch) synth(at, BAR, m, { g: lv >= 4 ? 0.035 : 0.045, voices: 3, det: 0.008, cut: lv >= 4 ? 2600 : 1100, atk: 0.25, rel: 0.6, wet: 0.5, pan: (m % 3 - 1) * 0.3 });
    for (let k = 0; k < 16; k += 1) {
      const t = at + k * BEAT / 4, lk = level(t + 0.001);
      // 琶音（16 分）：2 級起
      if (lk >= 2) { const m = ch[[0, 1, 2, 3, 2, 1, 3, 2][k % 8]] + 12; synth(t, 0.09, m, { g: lk >= 4 ? 0.05 : 0.04, voices: 2, cut: 5200, cutEnd: 900, rel: 0.12, wet: 0.45, pan: k % 2 ? 0.35 : -0.35 }); }
      if (k % 4 === 0) { // 拍上
        if (lk >= 3) kick(t, lk >= 4 ? 1 : 0.85);
        if (lk >= 4 && (k === 4 || k === 12)) clap(t);
      }
      if (lk >= 3 && k % 4 === 2) hat(t, 1, lk >= 4 && k % 8 === 6);
      if (lk >= 4 && k % 2 === 1) hat(t, 0.55);
      // 低音：反拍八分
      if (lk >= 3 && k % 2 === 0 && k % 4 !== 0) synth(t, 0.2, roots[ci] - 12, { g: 0.2, voices: 2, cut: 700, rel: 0.05, wet: 0 });
      if (lk >= 3 && k % 4 === 0) synth(t, 0.12, roots[ci], { g: 0.08, voices: 1, cut: 900, rel: 0.05, wet: 0 });
      // 和弦刺（drop 段每拍半）
      if (lk >= 4 && (k === 3 || k === 6 || k === 10 || k === 14)) for (const m of ch) synth(t, 0.12, m + 12, { g: 0.03, voices: 5, det: 0.02, cut: 4500, rel: 0.25, wet: 0.5 });
    }
  }
  // 片頭：四下重擊（式子砸下來）＋ 低頻的式子音
  const fx = hook.len / 4;
  for (let k = 0; k < 4; k += 1) { impact(hook.start + k * fx, 0.7 + k * 0.1); synth(hook.start + k * fx, 0.35, [45, 48, 52, 55][k], { g: 0.12, voices: 4, det: 0.02, cut: 1600, cutEnd: 300, rel: 0.4, wet: 0.5, side: false }); }
  // 標題一閃：大的
  impact(scenes[idx(hook) + 1].start, 1.1);
  // 上升音進 drop、drop 一下重擊
  riser(riserScene.start, drop.start);
  impact(drop.start, 1.2);
  // 快切前：小鼓滾奏（最後兩拍）
  for (let k = 0; k < 8; k += 1) clap(stats.start - 1.0 + k * 0.125, 0.4 + k * 0.08);
  impact(stats.start, 1.0);
  // 片尾：大和弦長音＋高音
  impact(end.start, 0.8);
  for (const m of [45, 57, 60, 64, 69, 76]) synth(end.start, 3.2, m, { g: 0.05, voices: 4, det: 0.01, cut: 3000, cutEnd: 800, atk: 0.02, rel: 2.0, wet: 0.6, side: false });
  // 轉場 whoosh（whip 進場的拍點）、zoom 進場輕一點
  scenes.forEach((s, i) => { if (i === 0 || s.in === "cut") return; if (s.in === "whip") whoosh(s.start, Math.max(0.18, s.xin), 0.9); if (s.in === "zoom") whoosh(s.start, 0.3, 0.5); });
  // 答對叮一聲
  for (const t of marks.chime || []) chime(t);

  // 殘響（幾條梳狀濾波）＋ 收尾淡出＋柔性限幅
  const wetL = new Float32Array(n), wetR = new Float32Array(n);
  for (const [ms, g] of [[31.3, 0.78], [37.9, 0.76], [43.1, 0.74], [47.9, 0.72]]) {
    const d = Math.floor(ms / 1000 * SR); const bl = new Float32Array(n), br = new Float32Array(n);
    for (let i = 0; i < n; i += 1) { bl[i] = VL[i] + (i >= d ? bl[i - d] * g : 0); br[i] = VR[i] + (i >= d + 31 ? br[i - d - 31] * g : 0); wetL[i] += bl[i] * 0.07; wetR[i] += br[i] * 0.07; }
  }
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  const fade0 = (seconds - 2.5) * SR;
  let peak = 0;
  const outL = new Float32Array(n), outR = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    const g = i > fade0 ? Math.max(0, 1 - (i - fade0) / (2.5 * SR)) : 1;
    outL[i] = Math.tanh((L[i] + wetL[i]) * g * 1.4) / 1.4; outR[i] = Math.tanh((R[i] + wetR[i]) * g * 1.4) / 1.4;
    peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
  }
  const norm = 0.92 / Math.max(peak, 0.1);
  for (let i = 0; i < n; i += 1) { buf.writeInt16LE(Math.round(outL[i] * norm * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(outR[i] * norm * 32767), 46 + i * 4); }
  fs.writeFileSync(file, buf);
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const M = JSON.parse(fs.readFileSync(path.join(FILM, "raw", "manifest.json"), "utf8"));
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  let total, scenes;
  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    // 字型從 Google Fonts 來，偶爾慢：導覽的就緒判斷逾時不算失敗，下面會等 __fontsReady
    try { await chrome.navigate(server.url + "/tools/site_trailer/comp.html", { appReady: false }); } catch (e) { console.log("（導覽慢，繼續等合成頁）"); }
    for (let i = 0; i < 600; i += 1) { if (await chrome.evaluate("return Boolean(window.__fontsReady && window.__total);").catch(() => false)) break; await chrome.sleep(200); }
    total = await chrome.evaluate("return window.__total;");
    scenes = await chrome.evaluate("return window.__scenes;");
    scenes.forEach((s) => { s.len = s.end - s.start; });
    console.log(`total ${total.toFixed(2)}s, ${scenes.length} scenes`);
    if (!AUDIO_ONLY) {
      for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
      const grab = async (T, file, q, scale = 1) => {
        await chrome.evaluate(`await window.seek(${T.toFixed(4)}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return 1;`);
        const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: q, clip: { x: 0, y: 0, width: 1920, height: 1080, scale } });
        fs.writeFileSync(file, Buffer.from(data, "base64"));
      };
      if (PREVIEW) {
        const times = [];
        scenes.forEach((s) => [0.12, 0.5, 0.9].forEach((k) => times.push(s.start + s.len * k)));
        for (let i = 0; i < times.length; i += 1) await grab(times[i], path.join(OUT, `p${String(i).padStart(3, "0")}.jpg`), 80, 0.3);
        console.log(`preview: ${times.length} 格 → ${path.relative(ROOT, OUT)}`);
        return;
      }
      const frames = Math.ceil(total * FPS);
      const t0 = Date.now();
      for (let i = 0; i < frames; i += 1) {
        await grab(i / FPS, path.join(OUT, `f${String(i).padStart(5, "0")}.jpg`), 93);
        if (i % 300 === 0) console.log(`frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
      }
    }
  } finally {
    await chrome.close();
    await server.stop();
  }
  // 答對那一下（ok 那一幕：回饋出現的時間換到片子的時間）
  const chime = scenes.filter((s) => s.dir === "ok").map((s) => s.start + (M.ok.marks.feedback - s.from));
  writeMusic(path.join(OUT, "music.wav"), total, scenes, { chime });
  const out = path.join(FILM, "site-trailer.mp4");
  execFileSync("wsl", ["-e", "ffmpeg", "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", `${wsl(OUT)}/f%05d.jpg`, "-i", wsl(path.join(OUT, "music.wav")),
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", wsl(out)], { stdio: "inherit" });
  console.log(`${path.relative(ROOT, out)}：${total.toFixed(1)} 秒，${FPS}fps`);
}

run().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
