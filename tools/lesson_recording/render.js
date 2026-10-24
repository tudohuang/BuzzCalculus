// 把 record.js 錄的格＋旁白位置表合成 mp4：
//   畫面：每格照它真實的時間戳排（concat 的 duration），輸出 30fps
//   聲音：每一格記了旁白念到 mp3 的第幾秒 —— 連續往前走的那幾格是一段（暫停、跳句、換檔就斷），
//         一段＝mp3 的 [起, 訖] 剪出來、照語速 atempo、adelay 擺到影片上它開始的時間
//
// 用法：node tools/lesson_recording/render.js [--lesson mean-value-theorem]
// 輸出：docs/trailer/lesson/<課>/<課>.mp4
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const argv = process.argv.slice(2);
const LESSON = argv.includes("--lesson") ? argv[argv.indexOf("--lesson") + 1] : "mean-value-theorem";
const DIR = path.join(ROOT, "docs", "trailer", "lesson", LESSON);
const M = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
const RATE = M.rate;
const FPS = 30;

// 畫面
const F = M.frames;
const list = F.map((f, i) => `file 'frames/${f.f}'\nduration ${Math.max(0.001, ((F[i + 1] ? F[i + 1].t : f.t + 1 / FPS) - f.t)).toFixed(4)}`).join("\n") + `\nfile 'frames/${F[F.length - 1].f}'\n`;
fs.writeFileSync(path.join(DIR, "frames.txt"), list);
const total = F[F.length - 1].t + 1 / FPS;

// 聲音：一段一段
const segs = [];
let cur = null;
F.forEach((f, i) => {
  const prev = F[i - 1];
  const cont = cur && f.a != null && prev && prev.a != null && f.src === cur.src && Math.abs((f.a - prev.a) - RATE * (f.t - prev.t)) < 0.25;
  if (f.a == null) { cur = null; return; }
  if (!cont) { cur = { src: f.src, pts: [] }; segs.push(cur); }
  cur.pts.push(f);
});
const gap = total / F.length;
const clips = segs.filter((s) => s.pts.length >= 2).map((s) => {
  // 影片時間 t ↔ mp3 時間 a：a ≈ c + RATE·t（整段平均掉截圖的抖動）
  const c = s.pts.reduce((m, p) => m + (p.a - RATE * p.t), 0) / s.pts.length;
  const a0 = s.pts[0].a;
  const a1 = s.pts[s.pts.length - 1].a + RATE * gap; // 最後一格之後還念了不到一格的時間
  return { src: s.src, a0, a1, at: (a0 - c) / RATE };
});
const srcs = [...new Set(clips.map((c) => c.src))];
console.log(`${F.length} 格、${total.toFixed(1)} 秒；旁白 ${clips.length} 段（${srcs.join(", ")}），共念 ${(clips.reduce((m, c) => m + c.a1 - c.a0, 0)).toFixed(1)} 秒的錄音`);

const inputs = ["-f", "concat", "-safe", "0", "-i", path.join(DIR, "frames.txt")];
srcs.forEach((s) => inputs.push("-i", path.join(ROOT, "media", "narration", s)));
const parts = clips.map((c, k) => {
  const ms = Math.max(0, Math.round(c.at * 1000));
  return `[${1 + srcs.indexOf(c.src)}:a]atrim=start=${c.a0.toFixed(3)}:end=${c.a1.toFixed(3)},asetpts=PTS-STARTPTS,atempo=${RATE},adelay=${ms}|${ms}[c${k}]`;
});
// 墊一條從 0 秒開始、整片長的靜音一起混：不然聲音軌的 start_time 是第一段旁白開始的時間（8.5 秒），
// 有的播放器（Windows 相片、手機、通訊軟體）不理 start_time、聲音從 0 秒開始放 —— 整片聲音比畫面早 8.5 秒
const graph = parts.length
  ? `anullsrc=r=44100:cl=mono,atrim=end=${total.toFixed(3)}[sil];${parts.join(";")};[sil]${clips.map((_c, k) => `[c${k}]`).join("")}amix=inputs=${clips.length + 1}:normalize=0:duration=first,aresample=async=1:first_pts=0[aout]`
  : `anullsrc=r=44100:cl=mono,atrim=end=${total.toFixed(3)}[aout]`;
fs.writeFileSync(path.join(DIR, "audio_graph.txt"), graph);
const out = path.join(DIR, `${LESSON}.mp4`);
const args = ["-y", ...inputs, "-filter_complex_script", path.join(DIR, "audio_graph.txt"), "-map", "0:v", "-map", "[aout]",
  "-vf", `fps=${FPS},format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-t", total.toFixed(3), out];
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"], encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
if (r.status !== 0) { console.error(String(r.stderr || "").split("\n").slice(-25).join("\n")); process.exit(1); }
console.log(`→ ${out}（${(fs.statSync(out).size / 1048576).toFixed(1)} MB）`);
