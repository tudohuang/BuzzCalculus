# 影片怎麼接進課程

試做的 5 支已經接上（課程資料的 `video` 欄位、`media/manifest.json`、`tools/fetch_media.js`）。下面第 0 節是全部 15 支的接線表；第 1–5 節是當初的設計說明，留著當規格。

## 0. 接線表（15 支）

| 影片 id | 課 id | after（觀念段，0 起算） | 片長（秒，無條件捨去） | caption | 狀態 |
|---|---|---|---|---|---|
| `riemann` | `riemann-sum-intuition` | 4 | 29 | n 加倍，左和與右和夾向 14/3 | 已接；這次重做（4→8→16→32→64），片長 27 → 29，manifest 的大小／sha256 要更新 |
| `ftc` | `ftc-part1` | 1 | 26 | 累積面積 A(x) 的斜率，就是 f(x) 的高度 | 已接，沒動 |
| `taylor` | `taylor-polynomial` | 1 | 28 | eˣ 的 T₁ 到 T₇：誤差 < 0.1 的範圍越來越寬 | 已接，沒動 |
| `epsilon-delta` | `epsilon-delta-quadratic` | 2 | 27 | x² 在 2：δ = min(1, ε/5)，為什麼要跟 1 取 min | 已接，沒動 |
| `chain-rule` | `chain-rule` | 1 | 23 | sin(x²)：兩台機器，小變化的倍數相乘 | 已接；這次修標籤貼框，片長不變，manifest 的大小／sha256 要更新 |
| `one-sided-limit` | `limit-one-sided` | 1 | 30 | 左邊往高度 2 擠、右邊往 4 擠，f(2) 另外看 | 新 |
| `secant-tangent` | `secant-to-tangent` | 1 | 27 | Q 從兩邊滑向 P，割線斜率都往 2 擠 | 新 |
| `product-rule` | `product-rule` | 1 | 24 | 長方形長大多出三塊，角落那塊除以 h 趨近 0 | 新 |
| `linear-approx` | `linear-approximation` | 0 | 26 | 往 (4, 2) 放大，√x 和切線分不開 | 新 |
| `mean-value` | `mean-value-theorem` | 0 | 22 | 割線平行往下推，切到 x³ 的地方就是 c = √3 | 新 |
| `related-rates` | `related-rates` | 3 | 24 | 梯腳等速往外，頂端越接近地面滑得越快 | 新 |
| `box-optimization` | `optimization-geometry` | 0 | 25 | 剪掉的角 x 從小到大，體積在 x = 2 最大 | 新 |
| `volume-disk` | `volume-disk` | 1 | 25 | 圓盤一片片疊起來，體積夾向 8π | 新 |
| `geometric-series` | `geometric-series` | 2 | 31 | 公比 1/2、−1/2 收斂，3/2 發散 | 新 |
| `polar-area` | `polar-area` | 0 | 23 | 細扇形一片片加起來，心臟線面積 3π/2 | 新 |

- 片長是 `ffprobe` 量 `<id>-light-1080p.mp4` 的長度取整（深色版一樣長）。
- after 指的是影片畫的那一段觀念：例如 `related-rates` 是觀念 ④「一定要先微分、再代數字」（梯子題）、`geometric-series` 是觀念 ③「收斂的條件」。同一段已有 figure 的（`linear-approx`、`polar-area`、`secant-tangent`、`one-sided-limit`）照 SCHEMA 排在圖後面。
- 新的 10 支要進 `media/manifest.json` 的 `videos`／`assets`（各 6 個檔：light/dark × 1080p/720p/poster），並上傳到 Release；這裡沒有動 manifest、課程資料、Release。
- 函數、記號、例子與答案取自該課的觀念段與範例；畫面上每一個數字都在場景開頭用 assert 獨立驗算過（不拿要講的定理去算）。

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
