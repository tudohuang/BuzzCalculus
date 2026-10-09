// 從 manim/out/ 產生 media/manifest.json（課程影片清單：檔名、大小、sha256），並印出上傳 Release 的指令。
// 影片本身不進 git，進 git 的只有這份清單；部署時 tools/fetch_media.js 照它從 Release 抓、逐一驗雜湊。
//
// 用法：node tools/make_media_manifest.js <release tag>     例：node tools/make_media_manifest.js media-v1
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "manim", "out");
const tag = process.argv[2];
if (!tag) {
  console.error("用法：node tools/make_media_manifest.js <release tag>");
  process.exit(1);
}

// 只收上線要用的：每支影片的 1080p、720p 與預覽圖（淺色、深色各一套）
const files = fs.readdirSync(SRC)
  .filter((name) => /^[a-z0-9-]+-(light|dark)-(1080p\.mp4|720p\.mp4|poster\.jpg)$/.test(name))
  .sort();
const assets = files.map((name) => {
  const buf = fs.readFileSync(path.join(SRC, name));
  return { name, bytes: buf.length, sha256: crypto.createHash("sha256").update(buf).digest("hex") };
});
const videos = [...new Set(files.map((name) => name.replace(/-(light|dark)-.*$/, "")))];

const manifest = { repo: "tudohuang/BuzzCalculus", tag, videos, assets };
fs.mkdirSync(path.join(ROOT, "media"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "media", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const total = assets.reduce((sum, a) => sum + a.bytes, 0);
console.log(`media/manifest.json：${videos.length} 支影片、${assets.length} 個檔案、${(total / 1048576).toFixed(1)} MB（${tag}）`);
console.log(`\n上傳（gh）：\ngh release create ${tag} --title "課程影片 ${tag}" --notes "課程概念動畫（Manim）。由 tools/fetch_media.js 在部署時抓取。" ${files.map((name) => `manim/out/${name}`).join(" ")}`);
