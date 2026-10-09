// 部署時把課程影片從 GitHub Release 抓進 media/（Vercel 的 buildCommand）。
//
// 影片不進 git（倉庫已經很大，20 支影片兩個主題約 48MB），放在 Release 附件；
// 部署時抓到同網域的 /media/，網站從自己的網域播放、service worker 不快取影片。
// 每個檔案照 media/manifest.json 的 sha256 驗過才算數 —— 抓錯或抓一半直接讓部署失敗，
// 而不是上線一支壞掉的影片。
//
// 用法：node tools/fetch_media.js          照清單抓（已有且雜湊正確的檔案略過）
//       node tools/fetch_media.js --check  只驗本機 media/ 的檔案
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "media");
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
const base = `https://github.com/${manifest.repo}/releases/download/${manifest.tag}/`;
const checkOnly = process.argv.includes("--check");

const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

function download(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "buzzcalculus-fetch-media" } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
        res.resume();
        resolve(download(new URL(res.headers.location, url).href, dest, redirects + 1));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`${url} → HTTP ${res.statusCode}`));
        return;
      }
      const tmp = `${dest}.part`;
      const out = fs.createWriteStream(tmp);
      res.pipe(out);
      out.on("finish", () => out.close(() => { fs.renameSync(tmp, dest); resolve(); }));
      out.on("error", reject);
    }).on("error", reject);
  });
}

(async () => {
  let fetched = 0;
  let kept = 0;
  const failures = [];
  for (const asset of manifest.assets) {
    const dest = path.join(DIR, asset.name);
    if (fs.existsSync(dest) && sha256(dest) === asset.sha256) { kept += 1; continue; }
    if (checkOnly) { failures.push(`${asset.name}：本機沒有或雜湊不符`); continue; }
    try {
      await download(base + encodeURIComponent(asset.name), dest);
      const got = sha256(dest);
      if (got !== asset.sha256) { fs.rmSync(dest, { force: true }); failures.push(`${asset.name}：雜湊不符（${got.slice(0, 12)}…）`); continue; }
      fetched += 1;
    } catch (error) {
      failures.push(`${asset.name}：${error.message}`);
    }
  }
  console.log(`課程影片：${manifest.assets.length} 個檔案，新抓 ${fetched}、已有 ${kept}（${manifest.tag}）`);
  if (failures.length) {
    failures.forEach((f) => console.error("  " + f));
    process.exit(1);
  }
})();
