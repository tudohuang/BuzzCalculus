# 01 — 架構：如何大修而不動主架構

## 1.1 現況架構（必須理解才能不破壞它）

```text
index.html
  ├── KaTeX / lucide / anime.js      (CDN, defer)
  ├── src/problems.js                ─┐
  ├── src/problem_*.js  × 21          ├─ 依序 defer，各自 push 進 window.BUZZ_PROBLEMS
  ├── src/problem_difficulty_calibration.js  ← 最後跑，mutate 每題的 rank/rankLabel/tags
  ├── src/custom_problems.js         ─┘   (localStorage 自訂題)
  ├── src/proofs.js                       (window.BUZZ_PROOFS)
  └── src/app.js                          (單一 IIFE，9122 行，全部 UI + 邏輯)
                │
                ├── localStorage: buzzcalculus.records.v1
                ├── render(): app.innerHTML = 全量重繪
                └── sw.js: APP_SHELL 預快取清單（每加一個 src 檔就要同步）
```

**這個架構的優點必須守住**：零 build、零 npm runtime 依賴、離線可用、GitHub Pages 純靜態部署、
CI 用 node 直接跑 `tools/*.js` 驗證題庫。**大修不得犧牲其中任何一項。**

**這個架構的痛點**：`src/app.js` 9122 行單檔、模組層 `let` 全域狀態、全量 innerHTML 重繪、
新增任何檔案要同時改 `index.html` + `sw.js`。

## 1.2 大修策略：加層，不重寫

引入 **Buzz Kernel** — 一組純函數模組，載在 `app.js` 之前，透過 `window.Buzz*` 註冊。

```text
index.html
  ├── src/problem_*.js …                       (不動)
  ├── src/kernel/skill_graph.js    → window.BuzzSkillGraph
  ├── src/kernel/ability.js        → window.BuzzAbility
  ├── src/kernel/planner.js        → window.BuzzPlanner
  ├── src/kernel/session.js        → window.BuzzSession
  ├── src/kernel/records_v2.js     → window.BuzzRecords
  └── src/app.js                                (逐步瘦身，永遠可用)
```

### 三條鐵律

**鐵律 1：feature-detect，永遠有 fallback。**

```js
// src/app.js 內
function abilityProfile(records) {
  if (window.BuzzAbility) return window.BuzzAbility.profile(records);
  return legacyMasteryRadarData(records);   // 今天的行為原封不動留著
}
```

任何 kernel 檔載入失敗（CDN 掛、快取壞、舊 SW），站台退回今天的樣子，不白畫面。
`tools/validate_app_shell.js` 擴充成同時驗證「kernel 全缺席時 app 仍能 render」。

**鐵律 2：kernel 是純函數，不碰 DOM、不碰 localStorage。**

輸入 `records` / `problems` / `now`，輸出資料。理由：

- 可以在 node 裡直接 require 來寫 CI 驗證器（跟現有 `tools/lib/load_problem_sources.js` 同一套路）。
- 可以被 BuzzPhysics 直接共用，不用抄。
- 沒有時間依賴：所有函數都吃 `now` 參數，測試才能穩定。

每個 kernel 檔的尾巴同時支援兩種載入：

```js
if (typeof module !== "undefined" && module.exports) module.exports = api;   // node 測試
if (typeof window !== "undefined") window.BuzzAbility = api;                 // 瀏覽器
```

**鐵律 3：carve-out 必須是 no-op。**

從 `app.js` 搬東西出去的流程固定為：

1. 寫 golden test：把目前函數對一組固定輸入的輸出存成 `tests/golden/<fn>.json`。
2. 把函數整段複製到 kernel，改成純函數（拿掉對模組層 `let` 的依賴，改成參數）。
3. `app.js` 裡原函數改成 delegating wrapper（見鐵律 1）。
4. 跑 golden test，輸出必須**逐 byte 相同**。
5. 才准 commit。

不允許「順便重構一下」。行為改變與位置改變永遠是兩個 commit。

## 1.3 模組邊界

| 模組 | 職責 | 明確不負責 |
| --- | --- | --- |
| `skill_graph.js` | 技巧節點、前置關係、tag → skill 映射 | 使用者資料 |
| `ability.js` | 從 history 推導 skill profile / PA / speed map / 信心校準 | 決定要練什麼 |
| `planner.js` | 今天練什麼、考前倒推、session 組題比例 | 抽題（交給 session） |
| `session.js` | 依 planner 的配方實際抽題、去重、冷卻 | 計分、UI |
| `records_v2.js` | normalize、migration、匯出匯入、合併同步的 merge 規則 | 網路 IO |
| `src/app.js` | UI、事件、計時、計分、所有 render | 上面任何一項的演算法 |

**依賴方向單向**：`app.js → kernel`，kernel 之間只准 `planner → ability → skill_graph`，
`session → planner`。禁止反向、禁止環。CI 用一支 `tools/validate_kernel_deps.js` 擋。

## 1.4 `src/app.js` 的瘦身路線

不做大爆炸拆檔。目標是**把演算法搬走，UI 留著**，最終 `app.js` 剩下 render + 事件。

拆解優先序（依「被新功能依賴的程度」排）：

| 順序 | 搬出的內容 | 目前位置（行號為 2026-08 快照） | 去處 |
| --- | --- | --- | --- |
| 1 | `masteryRadarData` / `buildWeaknessAnalysis` / `topWeaknesses` | 7684 / 7956 / 8119 | `ability.js` |
| 2 | `mistakePressure` / `mistakeSrs` / `mistakeDueStatus` / `srsDueSummary` | 2413–2455 | `ability.js`（SRS 區） |
| 3 | `checkAnswer` 家族（`checkNumeric`/`checkExpression`/`checkAntiderivative`/`checkText`/`evaluateExpression`） | 6243+ | `src/kernel/checker.js` |
| 4 | 抽題邏輯（`RECENT_PROBLEM_COOLDOWN`、`difficultyScopedCount`、pack 過濾、science gate） | 分散 | `session.js` |
| 5 | `MODES` / `TRAINING_PACKS` / `PATH_NODES` / `NAMED_EXAMS` 等純資料常數 | 38–443 | `src/kernel/catalog.js` |

第 3 項（checker）獨立出來的價值最高：`tools/validate_answer_checker.js` 目前要靠字串黑魔法載入，
搬出去之後 CI 可以直接 require，而且 BuzzPhysics 立刻能共用同一個判分器。

**每一項都是獨立可上線的 PR。任何時刻中斷都不會留下半殘狀態。**

## 1.5 檔案登錄一致性

新增任何 `src/*.js` 必須同步三處：`index.html`、`sw.js` 的 `APP_SHELL`、（若是題庫）
`tools/lib/load_problem_sources.js`。這是目前最容易漏的坑。

**對策**：新增 `tools/validate_asset_manifest.js`，比對三份清單必須一致，加進 CI。
成本 30 行，永久解決漏改 `sw.js` 導致離線壞掉的問題。

## 1.6 Render 效能

現況 `render()` 全量重寫 `#app.innerHTML`。1407 題的題庫頁靠 `LIBRARY_PAGE_SIZE = 72` 分頁撐住。

**不換框架。** 分三步優化：

1. **量測先行**：加 `performance.mark` 包住 `render()`，把 p95 render 時間送進 GA4
   （事件 `perf_render`，見 [06](06-identity-sync-legal.md#65-分析事件)）。沒有數字之前不准優化。
2. ~~**切分 render 範圍**：把 `render()` 改成 `render(scope)`。~~

> **這一項的前提是錯的（2026-08-16 查證）。**
>
> spec 原本寫「計時器每秒觸發全量重繪，這是最大宗的浪費」。實際查程式碼：
> 計時器呼叫的是 `updateLiveQuizStats()`，它只改四個 DOM 節點的 `textContent`
> 和兩個 class，**沒有任何全量重繪**。那個優化本來就在。
>
> 實測單次 render 的 HTML 字串生成成本（40 場 / 480 題的使用者）：
> 首頁 6.9ms、訓練 9.6ms、數據 4.0ms —— 都在 16ms 預算內。
>
> 量測反而抓到一個真的浪費：**首頁一次 render 會算兩次完整的能力模型**
> （今天的訓練一次、成長證據一次），數據頁更多。加上以資料指紋為 key 的快取後，
> 數據頁 4.0 → 2.8ms、首頁 6.9 → 6ms。
>
> 快取的風險不是「省不到時間」，是「顯示過期的能力數字」，所以 smoke test
> 專門驗失效：多練一場、或只改信心自評，都必須拿到新的 profile。
>
> `perf_render` 事件（1% 取樣）已上線，真實瀏覽器的數字會自己說話。
> 在那之前不再做 render 拆分。
3. **題庫頁虛擬化**：搜尋輸入已有 debounce（`librarySearchTimer`），再加 IntersectionObserver 無限捲動取代分頁。

目標：首頁 render p95 < 16ms、題庫搜尋輸入到結果 < 100ms、首屏 LCP < 2.0s（4G）。

## 1.7 CDN 依賴

> **CDN vendor 實作現況（2026-08-16，已完成）**
>
> 全部搬到 `assets/vendor/`，**總共 571KB**（原本估 1.2MB）。
> 由 `tools/validate_offline_assets.js` 在 CI 擋住任何新的 CDN 依賴。
>
> | 資源 | 體積 | 做法 |
> | --- | ---: | --- |
> | KaTeX JS | 269KB | 原樣 |
> | KaTeX CSS | 21KB | 砍掉 woff/ttf 的 src，只留 woff2 |
> | KaTeX 字型 | 254KB | 20 個 woff2（原本含 woff/ttf 是三倍） |
> | 圖示 | 11KB | **只收錄本站用到的 48 個**（官方 UMD 是 1MB / 1500+ 個） |
> | anime.js | 17KB | 原樣 |
>
> **實測驗證**：把本機伺服器關掉之後重載，KaTeX 仍然用本地字型正確渲染出
> Frullani 積分。service worker 快取了 24 個 vendor 檔（含 20 個字型）。
> 唯一剩下的外部請求是 GA4 —— 那是分析而不是渲染依賴，掛掉不影響任何功能。
>
> **實測時抓到一個真 bug**：圖示清單是用正則掃 `icon("字面")` 產生的，
> 漏掉了 `icon(themeIcon)` 這種變數呼叫，結果**主題切換鈕在畫面上是一塊空白**
> —— 而且沒有任何錯誤訊息。驗證器現在會掃四種來源：字面、`data-lucide`、
> 資料表的 `icon:` 欄位、三元運算，再加上別名表右側的所有值。
>
> 圖示用本地 shim 而不是官方 bundle 的理由：官方 UMD 有 1500+ 個圖示將近 1MB，
> 我們只用 48 個。shim 提供一樣的 `window.lucide.createIcons({ attrs })`，
> 所以 `src/app.js` 一行都不用改。

目前 KaTeX / lucide / anime.js 全部走 `cdn.jsdelivr.net`。

**風險**：CDN 不可用時，離線 PWA 也會失去數學排版（`sw.js` 只快取本站資源）。

**對策（P1）**：三個函式庫 vendor 到 `assets/vendor/`，納入 `APP_SHELL`。
KaTeX 字型一併本地化（這一點與 brag 影片 render sandbox 的既有經驗一致）。
換來：完全離線可用、少三次跨網域連線、CSP 可以收緊。代價：repo 多約 1.2MB。**值得。**

## 1.8 測試策略

現況：9 支 CI 驗證器 + `smoke_app_render.js`。這已經比多數個人專案好，要延續同一風格
（零依賴 node script、直接跑、失敗就擋部署）。

新增層級：

| 層 | 工具 | 內容 |
| --- | --- | --- |
| 純函數 golden | `tools/test_kernel.js` | kernel 每個 API 對固定 fixture 的輸出快照 |
| 題庫不變式 | 既有 `validate_*` | 再加 origin / duplicate / answer-verify（見 [05](05-content-pipeline.md)） |
| Records 遷移 | `tools/test_records_migration.js` | v1 樣本 → normalize → 不得丟失任何欄位 |
| UI 煙霧 | 既有 `smoke_app_render.js` 擴充 | 每個 view 都要能在無 kernel / 有 kernel 兩種模式下 render |
| E2E | puppeteer-core（已有既有做法） | 開局 → 答題 → 結算 → 錯題進本 的主幹路徑 |

CI 時間預算：整條 workflow 含 Lean 驗證維持在 6 分鐘內。超過就把 Lean 拆成獨立 job 平行跑。
