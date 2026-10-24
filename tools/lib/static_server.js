// 行程內的靜態檔案伺服器，給 E2E 用。
//
// 為什麼不能用 file:// 直接開：service worker 只在 http(s) 底下註冊，
// fetch 對 file:// 也會被 CORS 擋掉。要測「使用者實際跑的那份」就得走 HTTP。
//
// 刻意送 no-store：E2E 每一輪都要看到磁碟上最新的檔案，
// 被快取住的話會出現「改了程式但測試還是舊行為」這種最難查的假象。

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg"
};

// options.overrides：Map("/路徑" → 內容)。有的話先回它、不讀磁碟 —— e2e_update 用它「部署新版」（改一支檔＋新的 sw.js）而不動到工作區。
function start(root, port, options = {}) {
  const overrides = options.overrides || new Map();
  const resolvedRoot = path.resolve(root);
  const missing = [];
  // 每一個打到伺服器的請求（含 Service Worker 送的）：e2e_transfer 用它數「第一次造訪抓了什麼、課程表有沒有整套預抓」
  const requests = [];

  const server = http.createServer((req, res) => {
    requests.push(String(req.url));
    let rel = decodeURIComponent(String(req.url).split("?")[0]);
    if (rel === "/") rel = "/index.html";
    const file = path.join(resolvedRoot, rel);
    if (!file.startsWith(resolvedRoot)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    const send = (err, data) => {
      if (err) {
        // 記下來：E2E 結束時要斷言「沒有任何 404」。
        // 少一個 vendor 檔案，畫面上可能只是圖示變空白，不會有任何錯誤訊息。
        missing.push(rel);
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404 " + rel);
        return;
      }
      const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
      // Range（206）：正式站（Vercel）有，這裡沒有的話 Chrome 不能在 mp3 裡 seek ——
      // 從第 7 節開始播，旁白會從檔頭念起（錄課程影片時抓到的假 bug）
      const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ""));
      if (range && (range[1] || range[2])) {
        const size = data.length;
        const from = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        const to = range[1] && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
        if (from >= size || from > to) { res.writeHead(416, { "content-range": `bytes */${size}` }).end(); return; }
        res.writeHead(206, { "content-type": type, "cache-control": "no-store", "accept-ranges": "bytes", "content-range": `bytes ${from}-${to}/${size}`, "content-length": to - from + 1 }).end(data.subarray(from, to + 1));
        return;
      }
      res.writeHead(200, {
        "content-type": type,
        "cache-control": "no-store",
        "accept-ranges": "bytes"
      }).end(data);
    };
    if (overrides.has(rel)) send(null, Buffer.from(overrides.get(rel)));
    else fs.readFile(file, send);
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => {
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        missing,
        requests,
        overrides,
        // Chrome 的 keep-alive 連線會讓 server.close 等到天荒地老（E2E 斷言失敗之後整支卡住、
        // 真正的錯誤訊息印不出來）。先把連線全部切掉再關。
        stop: () => new Promise((done) => {
          if (typeof server.closeAllConnections === "function") server.closeAllConnections();
          server.close(done);
        })
      });
    });
  });
}

module.exports = { start };
