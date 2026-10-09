# 影片怎麼接進課程（提案，尚未實作）

這份只是提案：網站（`src/`、`index.html`、`sw.js`、課程資料）目前完全沒動。

## 1. 課程資料加一個欄位

新版課程每課已有 `figures: [{ caption, after, widget }]`，`after` 是插在第幾個觀念段之後。影片沿用同一個語意：

```js
"riemann-sum-intuition": {
  // …既有欄位…
  "video": {
    "id": "riemann",                       // 對應 manim/render.sh 的短名
    "after": 1,                            // 插在觀念 ② 之後；跟 figures.after 同義
    "duration": 28,                        // 秒，顯示在播放鍵旁
    "caption": "n 加倍，左和與右和夾向 14/3",  // 影片下方一行說明（跟圖的 caption 同樣式）
    "captionTrack": null                   // 以後要配音或外掛字幕再加 .vtt；目前字幕已燒在畫面上
  }
}
```

- `src`／`poster` **不寫在課程資料裡**，由 `id` + 主題 + 寬度在執行時組出網址：
  `${VIDEO_BASE}/${id}-${theme}-${w >= 900 ? "1080p" : "720p"}.mp4`、`…-poster.jpg`。
  這樣換主機、換畫質都不用改 317 課的資料。
- 一課最多一支（15–20 支只給最核心的概念），所以是 `video` 不是 `videos[]`。
- 試做 5 支對應：`riemann-sum-intuition`、`ftc-part1`、`taylor-polynomial`、`epsilon-delta-quadratic`、`chain-rule`。

## 2. 頁面上的行為

- 先只放 poster（`loading="lazy"` 的 `<img>`）＋播放鍵；**點了才建 `<video>`**，`preload="none"`、`playsinline`、`muted`、有 `controls`。
  不自動播放：課文是書本式閱讀，會動的東西不該自己跑。
- 主題：讀 `document.documentElement.dataset.theme`，挑 `-light` 或 `-dark`；播放中切主題不換片。
- `prefers-reduced-motion: reduce` 時照樣顯示，但只顯示 poster＋「播放」，不做任何預載。
- 寬度：手機滿欄、桌機跟圖一樣最寬 560px 置中（16:9 → 315px 高）。720p 給 < 900px 的螢幕就夠，1080p 給桌機。
- 失敗（離線、404）：留著 poster 與 caption，播放鍵變灰並顯示「離線時無法播放」。

## 3. Service worker：不要預快取、而且要繞過

`sw.js` 目前的 fetch handler 會把**每個 GET 回應**都 `cache.put` 進 `CACHE_NAME`。影片若走同一條路：

- 每看一支就多塞 0.5–1 MB 進 Cache Storage，而且換版就整包重下；
- `<video>` 會送 `Range` 請求，回的是 206，`cache.put` 會丟例外（現在被 `.catch` 吞掉，但白白多一次 clone）；
- `new Request(event.request, { cache: "reload" })` 對 Range 請求也不必要。

所以接影片時 `sw.js` 要加一條（只是提案）：

```js
if (event.request.headers.has("range") || event.request.destination === "video"
    || new URL(event.request.url).pathname.startsWith("/media/")) return; // 讓瀏覽器自己處理
```

`APP_SHELL` 不加任何影片或 poster。poster 走一般 HTTP 快取即可。

## 4. 檔案放哪裡

`.git` 已經 159 MB，影片**不要進 repo**（`.gitignore` 早就擋 `*.mp4`，`manim/out/` 也擋了）。選項：

| 方案 | 優點 | 缺點 |
|---|---|---|
| **A. GitHub Release 資產**（例如 tag `media-v1`，上傳 `out/*.mp4`、`*-poster.jpg`） | 免費、不進 git 歷史、網址穩定 | 跨網域、沒有 Range 最佳化；下載走 `objects.githubusercontent.com`，有時被學校網路擋 |
| **B. Vercel 靜態檔，但不進 repo**：部署前由 CI 跑 `render.sh` 或從 Release 下載到站根的 `media/`（同樣列在 .gitignore） | 同網域、Vercel CDN 支援 Range、不用處理 CORS | 部署多一步；Vercel 免費方案流量 100 GB/月（5 支 × 2 主題 × ~0.6 MB，一萬次播放才 6 GB） |
| C. Cloudflare R2 / 物件儲存 | 無出站流量費 | 多一個帳號與 CORS 設定 |

**建議 B**：影片原始檔在 Release（A）當備份與來源，部署時抓到 `/media/`，網站一律用同網域相對路徑 `VIDEO_BASE = "/media"`。這樣不用處理 CORS（日後若加 CSP 也不必開外部 `media-src`），service worker 也只要繞過 `/media/` 一條規則。

總量估算：20 支 × 2 主題 × (1080p ~0.7 MB + 720p ~0.45 MB + poster ~40 KB) ≈ 48 MB，對 CDN 很小，但對 git 歷史是負擔——所以不進 repo。

## 5. 驗收（接上之後）

- E2E：有 `video` 的課，poster 看得到、點了才出現 `<video>`、網路面板在點之前沒有 mp4 請求。
- E2E：service worker 啟用後播放一次，Cache Storage 裡沒有任何 `.mp4`。
- 深色主題的課挑到 `-dark` 版。
- 影片裡的數字已在各場景的 `assert` 裡驗過；課文若引用影片裡的數字（例如 L₆₄ = 4.6045），要跟場景一致。
