// 課程介紹片：把 tools/course_film/comp.html 逐格截圖成 30fps，配上鋼琴與課程旁白，接成 mp4。
// 素材來自 record.js（docs/trailer/course-film/raw）。ffmpeg 走 WSL。
//
// 用法：node tools/course_film/render.js            輸出 docs/trailer/course-film/course-film.mp4
//       node tools/course_film/render.js --preview  每鏡抓三格拼總覽（不出影片）
//       node tools/course_film/render.js --dsf 2    4K 母帶（另外縮一支 1080p）
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { launch } = require("../lib/cdp.js");
const staticServer = require("../lib/static_server.js");

const ROOT = path.join(__dirname, "..", "..");
const FILM = path.join(ROOT, "docs", "trailer", "course-film");
const RAW = path.join(FILM, "raw");
const OUT = path.join(FILM, "build");
const FPS = 30;
const argv = process.argv.slice(2);
const DSF = Number((argv[argv.indexOf("--dsf") + 1] && argv.includes("--dsf")) ? argv[argv.indexOf("--dsf") + 1] : 1);
const PREVIEW = argv.includes("--preview");
const wsl = (p) => p.replace(/^([A-Za-z]):[\\/]/, (_m, d) => `/mnt/${d.toLowerCase()}/`).replace(/\\/g, "/");

/* ── 配樂：獨奏鋼琴，66 BPM。分解和弦慢慢走，旋律稀疏；旁白出現時讓位（壓到 0.4）。
   合成的，沒有版權問題。 ── */
function writeMusic(file, seconds, voice, swells) {
  const SR = 44100, BPM = 66, BEAT = 60 / BPM, BAR = BEAT * 4;
  const n = Math.floor(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // 鋼琴：幾個泛音、各自衰減，起音 4ms，微微失諧
  const piano = (at, midi, vel, len = 4.5, pan = 0) => {
    const f = hz(midi), s0 = Math.floor(at * SR), cnt = Math.min(Math.floor(len * SR), n - s0);
    if (s0 < 0 || cnt <= 0) return;
    const parts = [[1, 1, 1.1], [2, 0.42, 1.8], [3, 0.2, 2.6], [4, 0.1, 3.4], [5, 0.05, 4.4]];
    const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < cnt; i += 1) {
      const t = i / SR;
      const env = Math.min(1, t / 0.004) * (t > len - 0.3 ? (len - t) / 0.3 : 1);
      let v = 0;
      for (const [k, a, d] of parts) v += Math.sin(2 * Math.PI * f * k * (1 + 0.0004 * k * k) * t) * a * Math.exp(-t * d * (0.6 + f / 900));
      v *= env * vel * 0.16;
      L[s0 + i] += v * gl; R[s0 + i] += v * gr;
    }
  };
  // F△7 → Em7 → Dm9 → C△7（往下走，帶點懷舊），每個和弦兩小節
  const prog = [[53, 57, 60, 64, 67], [52, 55, 59, 62, 67], [50, 53, 57, 60, 64], [48, 52, 55, 59, 64]];
  const melody = [[0, 76], [3, 74], [6, 72], [10, 71], [12, 72], [16, 74], [19, 76], [22, 79], [26, 77], [28, 76]]; // [拍, 音]
  const bars = Math.ceil(seconds / BAR);
  for (let b = 0; b < bars; b += 1) {
    const ch = prog[Math.floor(b / 2) % prog.length];
    const at = 2.0 + b * BAR; // 片頭兩秒只有黑
    if (at > seconds - 1) break;
    // 低音＋分解和弦（每拍一顆、往上再往下）
    if (b % 2 === 0) piano(at, ch[0] - 12, 0.55, BAR * 2 + 1, -0.2);
    const order = [1, 2, 3, 4, 3, 2, 1, 2];
    order.forEach((k, j) => piano(at + j * BEAT / 2, ch[k], 0.22 + (j === 0 ? 0.08 : 0), 3.2, (k - 2.5) * 0.25));
  }
  // 旋律：從第四小節開始，每 32 拍循環一次
  for (let c = 0; c * 32 * BEAT < seconds; c += 1) for (const [beat, m] of melody) {
    const at = 2.0 + BAR * 4 + (c * 32 + beat) * BEAT;
    if (at < seconds - 2) piano(at, m, 0.5, 4.5, 0.15);
  }
  // 高潮（攤開、地圖）多一層高八度
  for (const [a0, a1] of swells) for (let at = a0; at < a1; at += BEAT) piano(at, 84 + [0, 3, 7, 5][Math.round(at / BEAT) % 4], 0.12, 2.5, 0.3);
  // 簡單的殘響：幾條回授梳狀濾波
  const wetL = new Float32Array(n), wetR = new Float32Array(n);
  for (const [ms, g] of [[29.7, 0.72], [37.1, 0.7], [41.1, 0.68], [43.7, 0.66]]) {
    const d = Math.floor(ms / 1000 * SR);
    const bl = new Float32Array(n), br = new Float32Array(n);
    for (let i = 0; i < n; i += 1) { bl[i] = L[i] + (i >= d ? bl[i - d] * g : 0); br[i] = R[i] + (i >= d + 23 ? br[i - d - 23] * g : 0); }
    for (let i = 0; i < n; i += 1) { wetL[i] += bl[i] * 0.06; wetR[i] += br[i] * 0.06; }
  }
  // 讓位給旁白：在旁白區間壓到 0.4（前後 0.5 秒滑過去）
  const duck = (t) => { let g = 1; for (const [a, b] of voice) { const k = Math.min(1, Math.max(0, Math.min(t - (a - 0.5), (b + 0.5) - t) / 0.5)); g = Math.min(g, 1 - 0.6 * k); } return g; };
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  const fadeEnd = (seconds - 4) * SR;
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    let g = duck(t) * (i > fadeEnd ? Math.max(0, 1 - (i - fadeEnd) / (4 * SR)) : 1);
    const l = Math.tanh((L[i] + wetL[i]) * g * 1.3) / 1.3, r = Math.tanh((R[i] + wetR[i]) * g * 1.3) / 1.3;
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, l)) * 30000), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, r)) * 30000), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}

// 旁白：每一鏡（沒靜音的）把素材那段時間的旁白放到片子的時間上；溶接段給下一鏡，lcut 延長
function voicePlan(scenes, manifest) {
  const out = [];
  scenes.forEach((s, i) => {
    if (s.kind !== "foot" || s.mute) return;
    const next = scenes[i + 1];
    const endFilm = Math.min(s.end, next ? next.start + 0.2 : s.end) + (s.lcut || 0);
    const w0 = s.from, w1 = s.from + (endFilm - s.start);
    for (const seg of manifest[s.dir].audio || []) {
      const a = Math.max(w0, seg.at), b = Math.min(w1, seg.at + (seg.to - seg.from));
      if (b - a < 0.05) continue;
      out.push({ mp3: seg.mp3, src: seg.from + (a - seg.at), len: b - a, at: s.start + (a - s.from) });
    }
  });
  return out;
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true }); // 留著資料夾（有 shell 停在裡面時刪不掉）
  const manifest = JSON.parse(fs.readFileSync(path.join(RAW, "manifest.json"), "utf8"));
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  let total, scenes;
  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: DSF, mobile: false });
    await chrome.navigate(server.url + "/tools/course_film/comp.html", { appReady: false });
    for (let i = 0; i < 150; i += 1) { if (await chrome.evaluate("return Boolean(window.__fontsReady && window.__total);")) break; await chrome.sleep(200); }
    total = await chrome.evaluate("return window.__total;");
    scenes = await chrome.evaluate("return window.__scenes;");
    console.log(`total ${total.toFixed(2)}s, ${scenes.length} scenes`);
    const grab = async (T, file, q, scale = 1) => {
      await chrome.evaluate(`await window.seek(${T.toFixed(4)}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return 1;`);
      const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: q, clip: { x: 0, y: 0, width: 1920, height: 1080, scale } });
      fs.writeFileSync(file, Buffer.from(data, "base64"));
    };
    if (PREVIEW) {
      const times = [];
      scenes.forEach((s) => [0.2, 0.55, 0.92].forEach((k) => times.push(s.start + s.len * k)));
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
  } finally {
    await chrome.close();
    await server.stop();
  }
  // 聲音
  const voice = voicePlan(scenes, manifest);
  const swells = scenes.filter((s) => s.kind === "still").map((s) => [s.start, s.end]);
  writeMusic(path.join(OUT, "music.wav"), total + 0.5, voice.map((v) => [v.at, v.at + v.len]), swells.slice(0, 2));
  const mp3s = [...new Set(voice.map((v) => v.mp3))];
  const parts = [];
  const counts = {};
  voice.forEach((v) => { counts[v.mp3] = (counts[v.mp3] || 0) + 1; });
  mp3s.forEach((m, k) => parts.push(`[${k + 2}:a]asplit=${counts[m]}${voice.map((v, i) => (v.mp3 === m ? `[s${i}]` : "")).join("")}`));
  voice.forEach((v, i) => {
    const ms = Math.round(v.at * 1000);
    parts.push(`[s${i}]atrim=${v.src.toFixed(3)}:${(v.src + v.len).toFixed(3)},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:d=0.04,afade=t=out:st=${Math.max(0, v.len - 0.12).toFixed(3)}:d=0.12,volume=1.35,adelay=${ms}|${ms}[v${i}]`);
  });
  parts.push(`[1:a]volume=0.9[m];[m]${voice.map((_v, i) => `[v${i}]`).join("")}amix=inputs=${voice.length + 1}:normalize=0:duration=first[aout]`);
  const graph = path.join(OUT, "audio.txt");
  fs.writeFileSync(graph, parts.join(";\n"));
  const big = DSF > 1;
  const master = path.join(FILM, big ? "course-film-4k.mp4" : "course-film.mp4");
  const args = ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", `${wsl(OUT)}/f%05d.jpg`, "-i", wsl(path.join(OUT, "music.wav"))];
  for (const m of mp3s) args.push("-i", wsl(path.join(ROOT, m)));
  args.push("-filter_complex_script", wsl(graph), "-map", "0:v", "-map", "[aout]", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", wsl(master));
  execFileSync("wsl", ["-e", "ffmpeg", ...args], { stdio: "inherit" });
  if (big) execFileSync("wsl", ["-e", "ffmpeg", "-y", "-loglevel", "error", "-i", wsl(master), "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", wsl(path.join(FILM, "course-film.mp4"))], { stdio: "inherit" });
  console.log(`${path.relative(ROOT, master)}：${total.toFixed(1)} 秒、旁白 ${voice.length} 段`);
}

run().catch((e) => { console.error(e && e.stack ? e.stack : e); process.exit(1); });
