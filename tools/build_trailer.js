// 把 record_trailer.js 錄下的畫格與標題卡接成 1080p 成片（開發工具，不進 CI）。
//
// 每一鏡：畫格 → 30fps → 縮到 1400 寬 → 圓角遮罩 → 疊在紙色背景的裝置框上 → 淡入淡出。
// 標題卡：PNG 停幾秒，同樣淡入淡出。最後全部串起來。ffmpeg 與 ImageMagick 走 WSL。
//
// 用法：node tools/build_trailer.js            輸出 docs/trailer/trailer.mp4
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "docs", "trailer", "raw");
const BUILD = path.join(ROOT, "docs", "trailer", "build");
fs.rmSync(BUILD, { recursive: true, force: true });
fs.mkdirSync(BUILD, { recursive: true });

const timeline = JSON.parse(fs.readFileSync(path.join(RAW, "timeline.json"), "utf8"));
const W = 1920, H = 1080, SW = 1400, SH = 972, FPS = 30, FADE = 0.28;
const OX = Math.round((W - SW) / 2), OY = Math.round((H - SH) / 2);

// 某些鏡太長：只取頭尾（秒）。負數從尾巴算。
const TRIM = { "12-path": [[0, 6.5], [-5.5, 0]] };

const wsl = (p) => "/mnt/c" + p.replace(/^C:/i, "").replace(/\\/g, "/");
const lines = ["set -e", `cd "${wsl(BUILD)}"`];
// 背景：紙色 + 裝置陰影；遮罩：圓角
lines.push(`convert -size ${W}x${H} xc:'#F6F2E8' \\( -size ${SW}x${SH} xc:none -fill '#1F1D18' -draw "roundrectangle 0,0,${SW - 1},${SH - 1},26,26" -blur 0x28 \\) -geometry +${OX}+${OY + 22} -composite -channel A -evaluate multiply 0.35 +channel bg.png 2>/dev/null || convert -size ${W}x${H} xc:'#F6F2E8' bg.png`);
lines.push(`convert -size ${W}x${H} xc:'#F6F2E8' bg_base.png`);
lines.push(`convert bg_base.png \\( -size ${SW}x${SH} xc:none -fill 'rgba(31,29,24,0.38)' -draw "roundrectangle 0,0,${SW - 1},${SH - 1},26,26" -blur 0x26 \\) -geometry +${OX}+${OY + 20} -composite bg.png`);
lines.push(`convert -size ${SW}x${SH} xc:none -fill white -draw "roundrectangle 0,0,${SW - 1},${SH - 1},26,26" mask.png`);

const segments = [];
let segNo = 0;
const enc = "-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30";
for (const item of timeline) {
  if (item.type === "card") {
    segNo += 1;
    const out = `seg${String(segNo).padStart(2, "0")}.mp4`;
    const d = item.seconds;
    lines.push(`ffmpeg -y -loglevel error -loop 1 -t ${d} -i "${wsl(path.join(RAW, item.file))}" -vf "fade=t=in:st=0:d=${FADE},fade=t=out:st=${(d - FADE).toFixed(2)}:d=${FADE},fps=${FPS}" ${enc} ${out}`);
    segments.push(out);
    continue;
  }
  const dir = path.join(RAW, item.dir);
  const pieces = TRIM[item.dir] || [[0, 0]];
  for (const [from, to] of pieces) {
    segNo += 1;
    const out = `seg${String(segNo).padStart(2, "0")}.mp4`;
    const total = item.seconds;
    const start = from < 0 ? Math.max(0, total + from) : from;
    const end = to <= 0 ? total + to : to;
    const d = Math.max(0.5, end - start);
    const filter = [
      `[1:v]trim=start=${start.toFixed(2)}:end=${end.toFixed(2)},setpts=PTS-STARTPTS,fps=${FPS},scale=${SW}:${SH}:flags=lanczos,format=rgba[s]`,
      `[s][2:v]alphamerge[r]`,
      `[0:v][r]overlay=${OX}:${OY}:format=auto,format=yuv420p,fade=t=in:st=0:d=${FADE},fade=t=out:st=${(d - FADE).toFixed(2)}:d=${FADE}[v]`
    ].join(";");
    lines.push(`ffmpeg -y -loglevel error -loop 1 -i bg.png -f concat -safe 0 -i "${wsl(path.join(dir, "list.txt"))}" -loop 1 -i mask.png -filter_complex "${filter}" -map "[v]" -t ${d.toFixed(2)} ${enc} ${out}`);
    segments.push(out);
  }
}
lines.push(`printf '%s\\n' ${segments.map((s) => `"file '${s}'"`).join(" ")} > concat.txt`);
lines.push(`ffmpeg -y -loglevel error -f concat -safe 0 -i concat.txt -c copy "${wsl(path.join(ROOT, "docs", "trailer", "trailer.mp4"))}"`);
lines.push(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${wsl(path.join(ROOT, "docs", "trailer", "trailer.mp4"))}"`);

const script = path.join(BUILD, "build.sh");
fs.writeFileSync(script, lines.join("\n") + "\n");
console.log(`segments: ${segments.length}`);
const outLog = execFileSync("wsl", ["-e", "bash", wsl(script)], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });
console.log(outLog.trim().split("\n").slice(-3).join("\n"));
