// 產生 media/manifest.json（部署要抓的大檔清單：檔名、大小、sha256、在哪一個 Release），並印出上傳 Release 的指令。
// 大檔本身不進 git，進 git 的只有這份清單；部署時 tools/fetch_media.js 照它從 Release 抓、逐一驗雜湊。
//
// 清單可以跨好幾個 Release：每個檔案的 tag 沒寫就是最上面的 tag（課程影片，media-v1）。
//   影片   manim/out/ 的 1080p、720p、預覽圖                                → media/<名字>
//   旁白   tools/content/course_v2/narration.json ＋ media/narration/ 的 mp3  → media/narration/<課>/<節>-<句>-<hash8>.mp3
// Release 的附件名稱不能有斜線：附件名 = 路徑的 / 換成 .（fetch_media.js 用同一條規則換回來）。
// releases 底下標 optional 的 Release：整個還沒上傳（每個檔都 404）時部署照常、只印警告（旁白載不到時播放器自己退回點的）；
// 上傳了一部分、或雜湊不符，一樣讓部署失敗。
//
// 用法：node tools/make_media_manifest.js <tag>               重列課程影片（例：media-v1），其他 Release 的檔案原樣保留
//       node tools/make_media_manifest.js --narration <tag>   重列旁白（例：media-v2），檔案複製到 tmp/release-<tag>/ 準備上傳
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const MANIFEST = path.join(ROOT, "media", "manifest.json");
const narrationMode = process.argv.includes("--narration");
const tag = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!tag) {
  console.error("用法：node tools/make_media_manifest.js <tag>  或  --narration <tag>");
  process.exit(1);
}

const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { repo: "tudohuang/BuzzCalculus", tag, videos: [], assets: [] };
const tagOf = (asset) => asset.tag || old.tag;
const releaseName = (name) => name.replace(/\//g, ".");
const entry = (name, buf, assetTag) => ({ name, bytes: buf.length, sha256: crypto.createHash("sha256").update(buf).digest("hex"), ...(assetTag ? { tag: assetTag } : {}) });

let manifest;
let upload; // [本機檔案, 附件名]
if (narrationMode) {
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "content", "course_v2", "narration.json"), "utf8"));
  const assets = Object.entries(index.clips).map(([key, clip]) => {
    const [lesson, beat] = key.split("/");
    const name = `narration/${lesson}/${beat}-${clip.h}.mp3`;
    const file = path.join(ROOT, "media", name);
    if (!fs.existsSync(file)) throw new Error(`${name} 不在本機（先跑 node tools/build_narration.js）`);
    const a = entry(name, fs.readFileSync(file), tag);
    if (a.sha256 !== clip.sha256) throw new Error(`${name} 跟 narration.json 的雜湊不符（重跑 node tools/build_narration.js）`);
    return a;
  });
  const keep = old.assets.filter((a) => !/^narration\//.test(a.name));
  manifest = { ...old, releases: { ...(old.releases || {}), [tag]: { optional: true } }, assets: keep.concat(assets) };
  const stage = path.join(ROOT, "tmp", `release-${tag}`);
  fs.rmSync(stage, { recursive: true, force: true });
  fs.mkdirSync(stage, { recursive: true });
  assets.forEach((a) => fs.copyFileSync(path.join(ROOT, "media", a.name), path.join(stage, releaseName(a.name))));
  upload = [`tmp/release-${tag}/*.mp3`];
} else {
  // 只收上線要用的：每支影片的 1080p、720p 與預覽圖（淺色、深色各一套）
  const SRC = path.join(ROOT, "manim", "out");
  const files = fs.readdirSync(SRC)
    .filter((name) => /^[a-z0-9-]+-(light|dark)-(1080p\.mp4|720p\.mp4|poster\.jpg)$/.test(name))
    .sort();
  const videos = [...new Set(files.map((name) => name.replace(/-(light|dark)-.*$/, "")))];
  const keep = old.assets.filter((a) => tagOf(a) !== old.tag).map((a) => ({ ...a, tag: tagOf(a) }));
  manifest = { ...old, tag, videos, assets: files.map((name) => entry(name, fs.readFileSync(path.join(SRC, name)))).concat(keep) };
  upload = files.map((name) => `manim/out/${name}`);
}

// 欄位順序固定（diff 好讀）
const ordered = { repo: manifest.repo, tag: manifest.tag, ...(manifest.releases ? { releases: manifest.releases } : {}), videos: manifest.videos, assets: manifest.assets };
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(ordered, null, 2) + "\n");

const mine = manifest.assets.filter((a) => tagOf(a) === tag);
const total = mine.reduce((sum, a) => sum + a.bytes, 0);
console.log(`media/manifest.json：${tag} ${mine.length} 個檔案、${(total / 1048576).toFixed(2)} MB（全部 ${manifest.assets.length} 個）`);
const title = narrationMode ? `課程旁白 ${tag}` : `課程影片 ${tag}`;
const notes = narrationMode ? "分節模式的旁白（Azure 語音合成）。附件名是路徑的 / 換成 .；由 tools/fetch_media.js 在部署時抓取。" : "課程概念動畫（Manim）。由 tools/fetch_media.js 在部署時抓取。";
console.log(`\n上傳（gh）：\ngh release create ${tag} --title "${title}" --notes "${notes}" ${upload.join(" ")}`);
