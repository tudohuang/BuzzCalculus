// 動態設計版 trailer：把 tools/trailer/comp.html 逐格截圖成 30fps，配上合成配樂，接成 mp4。
//
// comp.html 是一個能「定格到任一秒」的合成頁：黑底大字、裝置推近、鏡頭推到重點。
// 素材來自 record_trailer.js 錄的畫格（docs/trailer/raw）。ffmpeg 走 WSL。
//
// 用法：node tools/render_trailer.js            輸出 docs/trailer/trailer.mp4
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { launch } = require("./lib/cdp.js");
const staticServer = require("./lib/static_server.js");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "docs", "trailer", "raw");
const OUT = path.join(ROOT, "docs", "trailer", "build", "comp");
const FPS = 30;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 畫格清單 → manifest.json（每格的起始秒）
const manifest = {};
for (const dir of fs.readdirSync(RAW)) {
  const listFile = path.join(RAW, dir, "list.txt");
  if (!fs.existsSync(listFile)) continue;
  const lines = fs.readFileSync(listFile, "utf8").split("\n");
  const frames = [];
  let t = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^file '(.+)'$/);
    if (!m) continue;
    const d = lines[i + 1] && lines[i + 1].startsWith("duration") ? Number(lines[i + 1].split(" ")[1]) : 0;
    if (frames.length && frames[frames.length - 1].f === m[1] && !d) continue; // 結尾重複的那一筆
    frames.push({ f: m[1], t: Number(t.toFixed(3)) });
    t += d;
  }
  manifest[dir] = { frames, seconds: Number(t.toFixed(3)) };
}
fs.writeFileSync(path.join(RAW, "manifest.json"), JSON.stringify(manifest));

/* ── 配樂：極簡的合成鋼琴 + 鋪底，沒有版權問題，之後要換真的曲子也只是換一個檔 ── */
function writeMusic(file, seconds, cuts) {
  const SR = 44100;
  const n = Math.floor(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const note = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  // 和弦：Cmaj7 → Am9 → Fmaj7 → G6，每 4 秒一換，鋪底用正弦疊三個泛音，慢慢起
  const chords = [[60, 64, 67, 71], [57, 60, 64, 71], [53, 57, 60, 64], [55, 59, 62, 64]];
  const padGain = 0.045;
  for (let i = 0; i < n; i += 1) {
    const t = i / SR;
    const ci = Math.floor(t / 4) % chords.length;
    const into = (t % 4) / 4;
    const env = Math.min(1, into / 0.35) * (1 - Math.max(0, (into - 0.85) / 0.15) * 0.6);
    let v = 0;
    for (const m of chords[ci]) {
      const f = note(m - 12);
      v += Math.sin(2 * Math.PI * f * t) * 0.5 + Math.sin(2 * Math.PI * f * 2 * t) * 0.18 + Math.sin(2 * Math.PI * f * 3 * t + 0.4) * 0.06;
    }
    v *= padGain * env;
    const pan = 0.5 + 0.12 * Math.sin(t * 0.21);
    L[i] += v * (1 - pan) * 1.4; R[i] += v * pan * 1.4;
  }
  // 鋼琴式撥音：在每個切點敲一顆音（五聲音階往上走），快起慢落
  const scale = [72, 74, 76, 79, 81, 84, 86, 88];
  cuts.forEach((at, k) => {
    const midi = scale[k % scale.length] - (k % 3 === 2 ? 12 : 0);
    const f = note(midi);
    const start = Math.floor(at * SR);
    const len = Math.floor(2.4 * SR);
    for (let i = 0; i < len && start + i < n; i += 1) {
      const t = i / SR;
      const env = Math.exp(-t * 2.2) * Math.min(1, t / 0.006);
      const v = (Math.sin(2 * Math.PI * f * t) * 0.6 + Math.sin(2 * Math.PI * f * 2 * t) * 0.25 * Math.exp(-t * 4) + Math.sin(2 * Math.PI * f * 3 * t) * 0.08 * Math.exp(-t * 6)) * env * 0.16;
      L[start + i] += v * 0.9; R[start + i] += v * 1.0;
    }
  });
  // 收尾淡出
  const fadeStart = Math.floor((seconds - 3.2) * SR);
  for (let i = fadeStart; i < n; i += 1) { const g = 1 - (i - fadeStart) / (n - fadeStart); L[i] *= g; R[i] *= g; }
  // 起頭淡入
  for (let i = 0; i < SR * 0.8; i += 1) { const g = i / (SR * 0.8); L[i] *= g; R[i] *= g; }
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i += 1) {
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * 32767))), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}

async function run() {
  const server = await staticServer.start(ROOT, 0);
  const chrome = await launch();
  try {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await chrome.navigate(server.url + "/tools/trailer/comp.html", { appReady: false });
    for (let i = 0; i < 100; i += 1) {
      if (await chrome.evaluate("return Boolean(window.__fontsReady && window.__total);")) break;
      await chrome.sleep(200);
    }
    const total = await chrome.evaluate("return window.__total;");
    const scenes = await chrome.evaluate("return window.__scenes;");
    const frames = Math.ceil(total * FPS);
    console.log(`total ${total.toFixed(2)}s, ${frames} frames, ${scenes.length} scenes`);
    // 預熱：把所有會用到的畫格先載一次，截圖時才不會等圖
    await chrome.evaluate(`
      const m = await (await fetch("/docs/trailer/raw/manifest.json")).json();
      const urls = [];
      for (const s of window.__scenes) if (s.dir) for (const f of m[s.dir].frames) urls.push("/docs/trailer/raw/" + s.dir + "/" + f.f);
      let done = 0;
      await Promise.all(urls.map((u) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = () => { done += 1; r(); }; im.src = u; })));
      return done;
    `);
    // --preview：每個場景抓兩格拼成總覽，先看版面再花五分鐘全渲染
    if (process.argv.includes("--preview")) {
      const times = [];
      for (const s of scenes) { times.push(s.start + (s.end - s.start) * 0.3, s.start + (s.end - s.start) * 0.85); }
      for (let i = 0; i < times.length; i += 1) {
        await chrome.evaluate(`await window.seek(${times[i].toFixed(3)}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return 1;`);
        const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 85, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 0.25 } });
        fs.writeFileSync(path.join(OUT, `preview-${String(i).padStart(2, "0")}.jpg`), Buffer.from(data, "base64"));
      }
      console.log("preview frames:", times.length);
      await chrome.close(); await server.stop();
      return;
    }
    const t0 = Date.now();
    for (let i = 0; i < frames; i += 1) {
      const T = i / FPS;
      await chrome.evaluate(`await window.seek(${T.toFixed(4)}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return 1;`);
      const { data } = await chrome.send("Page.captureScreenshot", { format: "jpeg", quality: 93, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 1 } });
      fs.writeFileSync(path.join(OUT, `f${String(i).padStart(5, "0")}.jpg`), Buffer.from(data, "base64"));
      if (i % 300 === 0) console.log(`frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    const cuts = scenes.filter((s) => s.kind !== "wordmark").map((s) => s.start);
    writeMusic(path.join(OUT, "music.wav"), total + 0.5, cuts);
  } finally {
    await chrome.close();
    await server.stop();
  }
  const wsl = (p) => "/mnt/c" + p.replace(/^C:/i, "").replace(/\\/g, "/");
  const out = path.join(ROOT, "docs", "trailer", "trailer.mp4");
  const cmd = `cd "${wsl(OUT)}" && ffmpeg -y -loglevel error -framerate ${FPS} -i f%05d.jpg -i music.wav -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart "${wsl(out)}" && ffprobe -v error -show_entries format=duration -of csv=p=0 "${wsl(out)}"`;
  const log = execFileSync("wsl", ["-e", "bash", "-lc", cmd], { encoding: "utf8" });
  console.log("trailer.mp4", log.trim(), "s");
}

run().catch((error) => { console.error(error); process.exit(1); });
