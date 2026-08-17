# 06 — 帳號、同步、備份、分析、法遵

## 6.1 現況與風險

**現況**：完全無帳號，所有紀錄在 `localStorage["buzzcalculus.records.v1"]`。
`BuzzSync`（`src/app.js:5148`）是一個可插拔 scaffold：設 `window.BUZZ_SYNC_ENDPOINT`
就啟用 GET/PUT + Bearer，衝突用 `records.updatedAt` 最新者獲勝。未設定時靜默降級。

**風險（B 區第 59–62 條，最高優先）**：
清除瀏覽器資料 = 使用者幾個月的訓練紀錄與能力模型全部歸零。
這件事發生一次，那個使用者就永遠不會回來。

## 6.2 三階段

### 階段 A：不上雲，先止血（P1，一週內可做完）

1. **匯出提醒**：連續使用 7 天或累積 200 題後，出現一次性提示「你的紀錄只在這台裝置上」+ 匯出按鈕。
2. **自動本機備份**：每次 `saveRecords` 後，若距上次備份 > 24h，
   把整份 records 複製到 `localStorage["buzzcalculus.backup.<date>"]`，保留最近 3 份。
   救得了「誤觸重設」，救不了「清除瀏覽器資料」— 誠實告知。
3. **匯出格式升級**：加信封（見 [02.8](02-data-model.md#28-匯出格式)），加檔名 `buzz-calculus-<date>.json`。
4. **匯入更寬容**：接受舊裸格式、接受從 BuzzPhysics 匯出的檔（警告 subject 不符但允許）。
5. **設定頁誠實文案**：現有「雲端同步 · 即將推出」的卡片保留，但把「匯出 = 你的手動備份」講得更大聲。

> **實作現況（2026-08-16）**：1、2、3、4 都完成了。
> 匯出提醒在「累積 200 題或練了 7 天」之後出現一次，關掉或匯出過就不再提 ——
> 太早提是雜訊，提太多次是推銷。文案直接寫「清除瀏覽器資料就會全部消失，而且救不回來」。
> 匯出檔加了信封（`format / version / subject / exportedAt`），舊的裸格式匯入時仍照收。

### 階段 B：帳號與真同步（P4）

**認證**：Google OIDC（`prompt=select_account`）→ 換取自家 JWT。
不自建密碼系統（密碼外洩風險 > 便利性收益）。後續可加 Apple Sign-In（iOS 上架需要）。

**後端最小形狀**（維持靜態站台，只多一個 API）：

```text
GET    /v1/records          -> { records, version, updatedAt }
PUT    /v1/records          -> { ok, version }        # 帶 If-Match: <version> 做樂觀鎖
POST   /v1/auth/google      -> { token, accountId }
DELETE /v1/account          -> 204                    # 資料刪除（法遵要求）
POST   /v1/calibration      -> 204                    # opt-in 的去識別化作答統計
POST   /v1/reports          -> 204                    # 題目回報
```

實作建議：Cloudflare Workers + D1/KV，或 Supabase。**選擇標準是「免運維 + 免費額度撐得住前 5000 人」。**
GitHub Pages 保持不變，API 走另一個網域，CORS 白名單。

**`BuzzSync` 幾乎不用改**：現有的 GET/PUT + Bearer 契約就是這個形狀。
只需要把 token 從 `window.BUZZ_SYNC_TOKEN` 改成登入後存在記憶體（不進 localStorage）。

### 階段 C：跨科目帳號（P6）

一個 accountId → 多個 subject 的 records。API 加 `?subject=calculus`。
Buzz Pro 訂閱狀態掛在 account 上，各科目共用。

## 6.3 同步衝突：LWW 不夠，要 per-key merge

> **實作現況（2026-08-16，已上線於匯入功能）**
>
> `BuzzRecords.merge(a, b, { problemTopics })` 已實作，並**先接在匯入上**。
> 舊的匯入行為是整份取代：在 A 裝置匯出、在 B 裝置匯入，B 上的紀錄就全沒了 ——
> 使用者以為自己在同步，實際上是在刪資料。
>
> 實測：兩台裝置各自練習後合併，**60 + 50 → 110 筆作答，零遺失**。
>
> 實作時被驗證器抓到的兩個真問題：
>
> 1. **交換律真的破了。** `Object.assign({}, a, b)` 有先後之分，
>    所以 `merge(a,b)` 和 `merge(b,a)` 在「兩邊都有同一個 key」時給出不同結果。
>    對同步來說那是災難：兩台裝置各自合併會得到兩份不一樣的資料，然後**永遠收斂不了**。
>    修法是先把兩份紀錄排成固定順序（updatedAt → attemptLog 長度 → 字典序），
>    之後所有合併都照那個順序做。
> 2. **冪等的定義原本是錯的。** `merge(a,a)` 不會等於 `normalize(a)` ——
>    合併會從 attemptLog **重算**計數器（計數器不能相加也不能取 max）。
>    正確的性質是 `merge(merge(a,a), a) === merge(a,a)`。
>
> **本機自動備份**也上線了：每 24 小時一份、保留 3 份、匯入前強制備份一次。
> 它救得了「誤觸重設」與「匯入覆蓋」，**救不了「清除瀏覽器資料」**——
> 所以提醒文案沒有把備份講得比實際安全。

**現行 LWW 的致命問題**：手機練了 10 題、電腦練了 5 題，同步後其中一邊整份消失。
對「訓練紀錄」這種只增不減的資料，這是不可接受的。

**改成分命名空間合併**：

| 欄位 | 合併規則 |
| --- | --- |
| `attempts, totalAnswered, totalCorrect, practiceRuns` | **不可用 max**（會低估）→ 改由 `attemptLog` 重算 |
| `bestScore, bestStreak` | `max` |
| `history[]` | 依 `id` union，按 `finishedAt` 排序後截斷至上限 |
| `attemptLog[]` | 依 `(problemId, t)` union，排序後截斷 |
| `sessions[]` | 同上 |
| `mistakes{}` | per-problem 取 `lastWrongAt` 較新者；但 `wrongCount` 取 max；SRS `dueAt` 取**較早**者（保守複習） |
| `problemStats{}, topicStats{}` | 由 `attemptLog` 重算，不直接合併 |
| `daily{}, dailyOne{}, weeklyChallenge{}, namedExams{}` | per-key 取分數較高者 |
| `favorites{}, achievements{}, pathUnlocks{}` | union（只增不減） |
| `proofs{}` | per-key 取狀態較進階者（看懂 > 部分會 > 還不會） |
| `settings, plan, placement, onboarding*` | LWW（使用者偏好，最後設定的算數） |
| `rival{}` | LWW（遊戲狀態，避免刷等級） |
| `cache` | 捨棄，重算 |

實作在 `src/kernel/records_v2.js` 的 `merge(a, b) -> records`，**純函數**。
`tools/test_records_merge.js` 驗證：
`merge(a,b) === merge(b,a)`（交換律）、`merge(a,a) === a`（冪等）、
`merge` 後的作答總數 >= max(兩邊)（不丟資料）。

**這個 merge 函數在沒有後端時就先寫、先測、先用在「匯入 JSON」上**（匯入 = 合併而非覆蓋）。
等後端上線時它已經被真實使用者驗證過。

## 6.4 隱私與法遵

> **已上線（2026-08-16）。** `privacy.html` / `terms.html`，設定頁可直達，
> 兩頁都進 service worker 快取（離線也讀得到）。
>
> ### 三個實作上的決定
>
> 1. **關閉分析要連 script 都不載。** 只擋 trackEvent 是不夠的 ——
>    光是載入 gtag.js 就已經帶著 IP 與 User-Agent 對 Google 發出請求。
> 2. **開關存在 records.settings**，跟著匯出／匯入走。存在另一個 localStorage key 的話，
>    換裝置之後要再關一次 —— 那等於沒有開關。
> 3. **刪除的依據是命名空間前綴，不是固定清單。**
>
> 第 3 點是 E2E 抓出來的真 bug：舊版的「清除資料」只刪一個 key，
> 於是進行中的存檔、自訂題、手寫草稿全部留著；而自動備份的 key 帶時間戳
> （`buzzcalculus.backup.<ts>`），固定清單**永遠列不完**。
> 實測按下清除之後，一份完整的紀錄備份還躺在 localStorage 裡 ——
> 而政策上寫的是「會刪掉練習紀錄」。那就變成一句不實陳述。
>
> 現在刪除會掃過整個 `buzzcalculus.` 命名空間 + IndexedDB 的手寫草稿，
> 並且刪除前把實際數量攤開講（「1 場練習紀錄、2 題錯題本、7 筆逐題作答…」），
> 而不是問一句沒有資訊量的「確定要清除嗎？」。
>
> `tools/validate_privacy.js` 把政策的承諾釘成靜態檢查：法務頁存在且互相連得到、
> 分析開關在兩處都有擋、每個 localStorage key 都在刪除範圍內。
> 實測擋得住：把 trackEvent 的檢查拿掉、或新增一個沒進清單的 key，兩個都會紅。

上線收費或收帳號**之前**必須就位：

| 文件 | 路徑 | 重點 |
| --- | --- | --- |
| 隱私權政策 | `legal/privacy.html` | 收什麼、為什麼、存多久、第三方（GA4、認證商）、聯絡方式 |
| 服務條款 | `legal/terms.html` | 題目著作權、投稿授權、禁止行為、免責 |
| 資料刪除 | `legal/delete.html` + 設定頁按鈕 | 一鍵刪除本機 + 一鍵刪除雲端帳號（30 天內完成） |
| Cookie / 分析告知 | 首次進站底部一行 | GA4 的告知與**關閉開關** |

**原則**：

- 不收集姓名、學校、年齡等 PII。帳號只存 `accountId + email hash + 建立時間`。
- **答案文字不上報**。分析事件只帶 `problemUid` 與對錯，不帶使用者輸入。
- 未成年人：不主動收集年齡，但條款寫明 13 歲以下需監護人同意。
- 資料留存：帳號刪除後 30 天內硬刪除；去識別化的校準統計可保留（且說明白）。

## 6.5 分析事件

> **實作現況（2026-08-16，已上線）**
>
> `ANALYTICS_EVENTS` 白名單 27 個事件，`tools/validate_analytics.js` 進 CI。
> 驗證器擋四件事：
>
> 1. 程式碼呼叫了表上沒有的事件
> 2. 表上有但程式碼從來不送（死條目會讓人以為有在收）
> 3. 事件沒有寫清楚在追蹤什麼
> 4. **上報了使用者輸入的內容**（`input` / `draft` / `answer` / `prompt` / `email`）
>
> 第 4 條是隱私底線，也是最容易在「多帶一個欄位方便 debug」的時候破掉的規則。
>
> 事件名對齊了 spec 的命名（`start_session` → `session_start` 等），
> 並補上原本缺的核心指標：`problem_start` / `problem_timeout` /
> `session_abandon` / `mistake_added` / `mistake_cleared` /
> `placement_complete` / `report_submit` / `install_pwa` /
> `perf_render`（1% 取樣）/ `return_visit`（帶 d1/d7/d30 分桶）。

現況：GA4 已接（`setupAnalytics` / `trackEvent`），事件命名未系統化。

### 正式事件表

| 事件 | 觸發 | 參數 |
| --- | --- | --- |
| `session_start` | 開局 | `mode, bucket, length, count, difficulty_cap, source`（source = home_cta / bucket / deeplink） |
| `problem_start` | 題目顯示 | `uid, rank, skill, answer_kind, timed` |
| `problem_submit` | 送出答案 | `uid, rank, correct, sec, hints, assisted, error_cause` |
| `problem_timeout` | 未作答逾時 | `uid, rank, skill` |
| `problem_abandon` | 離開未完成 | `uid, index, elapsed_total` |
| `hint_open` | 開提示 | `uid, level` |
| `session_complete` | 完成 | `mode, count, correct, sec, streak` |
| `session_abandon` | 中途離開 | `mode, answered, total` |
| `session_resume` | 續傳 | `mode, gap_minutes` |
| `mistake_added` / `mistake_cleared` | 錯題進出 | `uid, skill, days_in_book` |
| `onboarding_step` | 開局流程 | `step, skipped` |
| `placement_complete` | 定位完成 | `rank, weak_family` |
| `plan_set` | 設定考試 | `days_to_exam, daily_minutes, scope_size` |
| `report_submit` | 題目回報 | `uid, reason` |
| `export_records` / `import_records` | 資料管理 | `size_kb, merged` |
| `install_pwa` | 安裝 | — |
| `perf_render` | 效能取樣（1%） | `view, ms` |
| `return_d1` / `return_d7` | 回訪（用 `lastPlayed` 判定） | `days_since` |

**紀律**：新增任何事件必須先寫進這張表。`trackEvent()` 加上白名單檢查，
不在表上的事件名在 dev 模式 console.warn。避免半年後事件表變成垃圾場。

### 核心指標（見 [09](09-roadmap.md#指標)）

`return_d1 / d7 / d30`、每週有效 session 數、`session_complete / session_start` 完成率、
錯題回收率、onboarding 漏斗（step 1 → placement → 第一次 session_complete）。

## 6.6 效能預算

| 指標 | 目標 | 量測 |
| --- | --- | --- |
| 首屏 LCP（4G） | < 2.0s | Lighthouse CI |
| 首次可互動 | < 2.5s | Lighthouse CI |
| 首頁 render p95 | < 16ms | `perf_render` |
| 題庫搜尋輸入→結果 | < 100ms | `perf_render` |
| JS 總傳輸量（gzip） | < 900KB | CI 檢查 |
| 離線可用 | 100% 核心流程 | E2E |

現況估算：22 個題庫檔 + 9122 行 app.js，未壓縮約 2.5MB。GitHub Pages 有 gzip，實際約 500–600KB。
**主要優化不是拆檔，是延後載入**：

- 首屏只需要 `problems.js` + 常用 pack。冷門 pack（`damo_longform`、`world_universities`、
  `science_pack`）改成**按需載入**：使用者選到該 pack 時才 `import()`。
- `sw.js` 仍全部預快取（離線要完整），但那是背景進行，不擋首屏。
- KaTeX 只在有數學要 render 時才初始化（現在是 defer 全載）。
