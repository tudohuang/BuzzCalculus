// 部署時把大檔（課程影片、分節旁白）從 GitHub Release 抓進 media/（Vercel 的 buildCommand）。
//
// 影片與旁白不進 git（倉庫已經很大），放在 Release 附件；部署時抓到同網域的 /media/，
// 網站從自己的網域播放、service worker 不快取它們。
// 每個檔案照 media/manifest.json 的 sha256 驗過才算數 —— 抓錯或抓一半直接讓部署失敗，
// 而不是上線一支壞掉的影片。
//
// 清單可以跨好幾個 Release（make_media_manifest.js）：檔案的 tag 沒寫就是清單最上面的 tag；
// 附件名 = 路徑的 / 換成 .（旁白是 media/narration/<課>-<f8>.mp3，附件名不能有斜線）。
// releases 底下標 stream 的 Release：不抓（播放器直接從 Release 串流；make_media_manifest.js --stream）。
// releases 底下標 optional 的 Release（旁白）：整個還沒上傳（每個檔都 404／本機一個都沒有）→ 印警告、不讓部署失敗
// （播放器載不到旁白時自己退回點的）；只缺一部分、或雜湊不符 → 照樣失敗。
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
const checkOnly = process.argv.includes("--check");
const tagOf = (asset) => asset.tag || manifest.tag;
const urlOf = (asset) => `https://github.com/${manifest.repo}/releases/download/${tagOf(asset)}/${encodeURIComponent(asset.name.replace(/\//g, "."))}`;

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
        const error = new Error(`${url} → HTTP ${res.statusCode}`);
        error.status = res.statusCode;
        reject(error);
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
  const tags = [...new Set(manifest.assets.map(tagOf))];
  let bad = false;
  for (const tag of tags) {
    const assets = manifest.assets.filter((a) => tagOf(a) === tag);
    const release = (manifest.releases || {})[tag] || {};
    const optional = Boolean(release.optional);
    // stream：播放器直接從 Release 的下載網址串流（make_media_manifest.js --stream），部署不帶這些檔
    if (release.stream) {
      console.log(`${tag}：${assets.length} 個檔案標 stream —— 播放器直接從 Release 串流，部署不抓`);
      continue;
    }
    let fetched = 0;
    let kept = 0;
    const missing = []; // 本機沒有／Release 上 404
    const failures = []; // 雜湊不符、其他錯誤
    // 同時抓 4 個（旁白一課一支，全部約 317 支、250MB）
    const queue = assets.slice();
    const worker = async () => {
      for (let asset = queue.shift(); asset; asset = queue.shift()) {
        const dest = path.join(DIR, ...asset.name.split("/"));
        if (fs.existsSync(dest) && sha256(dest) === asset.sha256) { kept += 1; continue; }
        if (checkOnly) { (fs.existsSync(dest) ? failures : missing).push(`${asset.name}：${fs.existsSync(dest) ? "雜湊不符" : "本機沒有"}`); continue; }
        try {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          await download(urlOf(asset), dest);
          const got = sha256(dest);
          if (got !== asset.sha256) { fs.rmSync(dest, { force: true }); failures.push(`${asset.name}：雜湊不符（${got.slice(0, 12)}…）`); continue; }
          fetched += 1;
        } catch (error) {
          (error.status === 404 ? missing : failures).push(`${asset.name}：${error.message}`);
        }
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    console.log(`${tag}：${assets.length} 個檔案，新抓 ${fetched}、已有 ${kept}${missing.length ? `、缺 ${missing.length}` : ""}`);
    // 標 optional 的 Release 整個還沒上傳：只警告
    if (optional && !failures.length && !kept && !fetched && missing.length === assets.length) {
      console.warn(`  警告：${tag} 還沒上傳（${assets.length} 個檔一個都沒有）—— 這一組功能先載不到，網站照常`);
      continue;
    }
    if (missing.length || failures.length) {
      bad = true;
      missing.concat(failures).slice(0, 20).forEach((f) => console.error("  " + f));
      if (missing.length + failures.length > 20) console.error(`  …另有 ${missing.length + failures.length - 20} 個`);
    }
  }
  if (bad) process.exit(1);
})();
