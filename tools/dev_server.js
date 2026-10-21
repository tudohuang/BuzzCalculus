// 開發版：在自己電腦上跑網站，改了檔案瀏覽器自己重新整理；同一個 Wi-Fi 的手機也連得到。不上線、不過 CI。
//
//   npm run dev            → http://localhost:5173 ＋ 區網網址（手機用）
//   npm run dev -- 8080    → 換埠號
//
// 跟正式站不一樣的地方（刻意的）：
//   - 不用 Service Worker：/sw.js 回一支「把自己註銷、清掉快取」的版本。不然改了檔案還是看到快取裡的舊版，
//     而且開發版的快取會跟正式站搶同一個網域名稱下的東西（localhost 不會，但 IP 會）。
//   - 一律 no-store：每次都讀磁碟上最新的檔。
//   - index.html 注入一小段：右下角「開發版」標籤＋檔案一改就重新整理（Server-Sent Events）。
//   - 支援 Range：旁白 mp3、影片可以拖時間軸（media/ 要先有檔：node tools/fetch_media.js）。
// Windows 第一次跑會跳防火牆詢問：要讓手機連，就允許「私人網路」。
"use strict";

const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.argv[2]) || 5173;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".txt": "text/plain; charset=utf-8"
};

// 註銷自己、清掉所有快取（之前在這個網址開過、裝了 SW 的瀏覽器會被洗乾淨）。不叫分頁重載：頁面那邊已經不會再註冊了
const KILL_SW = `self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.registration.unregister();
})()));`;

const HEAD = `<script>
// 開發版不註冊 Service Worker：把舊的註銷，register 換成永遠不完成的 promise（app 端照常呼叫、不會報錯、也不會跳「有新版本」）
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  navigator.serviceWorker.register = () => new Promise(() => {});
}
</script>`;

const INJECT = `<script>
(() => {
  const tag = document.createElement("div");
  tag.textContent = "開發版";
  tag.style.cssText = "position:fixed;right:8px;bottom:84px;z-index:99999;padding:2px 8px;border-radius:999px;background:#c2410c;color:#fff;font:600 12px/1.6 system-ui;opacity:.85;pointer-events:none";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(tag));
  const es = new EventSource("/__dev/reload");
  es.onmessage = () => location.reload();
})();
</script>`;

// 檔案一改就通知所有開著的頁面；大量寫檔（regen、build）時合併成一次
const clients = new Set();
let timer = null;
const IGNORE = /(^|[\\/])(\.git|node_modules|\.claude|docs[\\/]report|tmp|media|manim[\\/]out)([\\/]|$)|daily_one_history/;
// Windows 只是「讀」檔也會丟 change（NTFS 更新最後存取時間）：開一課要讀新的 lazy 檔 → 被當成改檔 → 重新整理回首頁。
// 所以只認修改時間／大小真的變了的（沒看過的檔：比開伺服器還新才算；刪掉、改名照樣算）
const START = Date.now();
const seen = new Map();
fs.watch(ROOT, { recursive: true }, (_event, file) => {
  if (!file || IGNORE.test(file)) return;
  fs.stat(path.join(ROOT, file), (err, st) => {
    if (st && st.isDirectory()) return;
    const sig = err ? "gone" : `${st.mtimeMs}:${st.size}`;
    const prev = seen.get(file);
    seen.set(file, sig);
    if (prev === undefined ? !err && st.mtimeMs < START : prev === sig) return;
    clearTimeout(timer);
    timer = setTimeout(() => { for (const res of clients) res.write("data: reload\n\n"); }, 250);
  });
});

const server = http.createServer((req, res) => {
  const url = String(req.url).split("?")[0];
  if (url === "/__dev/reload") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
    res.write(": ok\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (url === "/sw.js") {
    res.writeHead(200, { "content-type": TYPES[".js"], "cache-control": "no-store" }).end(KILL_SW);
    return;
  }
  let rel = decodeURIComponent(url);
  if (rel === "/") rel = "/index.html";
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { "content-type": TYPES[".txt"] }).end("404 " + rel); return; }
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    if (path.extname(file) === ".html") {
      const html = fs.readFileSync(file, "utf8").replace("<head>", `<head>${HEAD}`).replace("</body>", `${INJECT}</body>`);
      res.writeHead(200, { "content-type": type, "cache-control": "no-store" }).end(html);
      return;
    }
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range) {
      const start = range[1] ? Number(range[1]) : st.size - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), st.size - 1) : st.size - 1;
      res.writeHead(206, { "content-type": type, "cache-control": "no-store", "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${st.size}`, "content-length": end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { "content-type": type, "cache-control": "no-store", "accept-ranges": "bytes", "content-length": st.size });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const lan = Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => `http://${i.address}:${PORT}`);
  console.log(`開發版：http://localhost:${PORT}`);
  lan.forEach((u) => console.log(`手機（同一個 Wi-Fi）：${u}`));
  console.log("改了檔案會自己重新整理；Ctrl+C 結束。");
});
