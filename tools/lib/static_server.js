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
  ".ico": "image/x-icon"
};

function start(root, port) {
  const resolvedRoot = path.resolve(root);
  const missing = [];

  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(String(req.url).split("?")[0]);
    if (rel === "/") rel = "/index.html";
    const file = path.join(resolvedRoot, rel);
    if (!file.startsWith(resolvedRoot)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        // 記下來：E2E 結束時要斷言「沒有任何 404」。
        // 少一個 vendor 檔案，畫面上可能只是圖示變空白，不會有任何錯誤訊息。
        missing.push(rel);
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404 " + rel);
        return;
      }
      res.writeHead(200, {
        "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "cache-control": "no-store"
      }).end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => {
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        missing,
        stop: () => new Promise((done) => server.close(done))
      });
    });
  });
}

module.exports = { start };
