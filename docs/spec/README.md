# Buzz Master Spec — 大修準備文件

> 目標：把 BuzzCalculus 從「一個很好的微積分刷題網站」推進成「STEM 的健身房」與能力訓練 OS，
> **而且不重寫現有主架構**。

這份 spec 是為了「大修」而寫的規格集，不是 roadmap 願望清單。每一節都要能直接開工。

## 讀法

| 檔案 | 內容 | 什麼時候讀 |
| --- | --- | --- |
| [00-north-star.md](00-north-star.md) | 產品定位、原則、明確不做的事 | 做任何取捨之前 |
| [01-architecture.md](01-architecture.md) | 分層架構、不可破壞的 invariants、carve-out 流程 | 動 `src/app.js` 之前 |
| [02-data-model.md](02-data-model.md) | Problem v2 / Records v2 schema 與遷移 | 加欄位、改儲存之前 |
| [03-ability-model.md](03-ability-model.md) | Skill graph、精熟度、Pressure Accuracy、Speed×Accuracy、信心校準 | 做任何能力數字之前 |
| [04-experience-ia.md](04-experience-ia.md) | 資訊架構收納、onboarding、Session 引擎、考試倒推 | 動首頁與模式選單之前 |
| [05-content-pipeline.md](05-content-pipeline.md) | 難度 rubric、答案驗證、重複偵測、來源聲明、變體生成 | 出新題包之前 |
| [06-identity-sync-legal.md](06-identity-sync-legal.md) | 帳號、跨裝置合併同步、備份、分析事件、法遵 | 接後端之前 |
| [07-community-classroom.md](07-community-classroom.md) | 投稿、curator、班級、Duel、Season | P5 之前 |
| [08-platform.md](08-platform.md) | 多科目、跨科 skill graph、symbolic backend、Buzz Pro、i18n | P6 之前 |
| [09-roadmap.md](09-roadmap.md) | 分期、每期 exit criteria、指標、風險 | 排期時 |
| [10-traceability.md](10-traceability.md) | 200 條需求逐條對應到規格章節與期別 | 驗收時 |

## 現況快照（2026-08，由程式碼實測）

這是大修的起點，所有設計都必須相容於此。

**規模**

| 項目 | 數字 |
| --- | ---: |
| 題目總數 | 1407（純微積分；理科秒殺包已於 2026-08 移出，見 [04.7](04-experience-ia.md#47-科目閘門的一般化)） |
| 有 `source` | 1327 |
| 有 `tags` | 1407（distinct tag 284 個，其中 220 個是技巧 tag） |
| 有 `solution`（單段文字） | 1407 |
| 有作者撰寫 `hints` | 886 |
| 有作者撰寫 `distractors` | 0（原本 24 題都在理科包） |
| 有 `solutionSteps`（結構化步驟） | 0 |
| 證明題 | 21（含 Lean 機器驗證 8） |
| `src/app.js` | 9122 行，單一 IIFE |
| `styles.css` | 6538 行 |
| 題庫檔 | 21 個 `src/problem_*.js` |
| CI 驗證器 | 12 支 `tools/validate_*` / `verify_*` |

**答案型別分佈**：`numeric` 1043、`expression` 152、`antiderivative` 121、`text` 91。

**難度現況（重要）**：題目原始 `difficulty` 欄位實測只用到 1–4（分佈 87 / 232 / 324 / 935）。
R5/R6 完全來自 `src/problem_difficulty_calibration.js` 的規則推導（`calibratedRank()`），
在載入時 mutate `problem.rank` / `problem.rankLabel` / `rank-N` tag。
**這代表難度校準層已經存在且是全站唯一 rank 來源** — 這是實證校準最好的插入點，見 [05](05-content-pipeline.md)。

**已存在但只是 scaffold 的東西**（不要重做，要接完）：

- `BuzzSync`（`src/app.js:5148`）：GET/PUT + Bearer + `records.updatedAt` LWW，未接後端時靜默降級。
- `records.placement`（8 題定位測驗）、`ONBOARDING_LEVELS`（3 條開局路線）。
- `records.problemReports`（本機題目回報）。
- SRS（`mistakeSrs`，惰性遷移，最長 30 天）。
- `masteryRadarData()`（8 軸、30 天半衰、借助解答只算半分）。
- GA4 `trackEvent()`。
- 純微積分不變式 `validate_calculus_only.js`（取代原本的科目閘門）。

## 三個貫穿全域的設計承諾

1. **加層，不重寫。** 新能力一律以新的 `window.Buzz*` 全域模組出現，`src/app.js` 用 feature-detect 消費；
   模組載入失敗時退回今天的行為。見 [01](01-architecture.md)。
2. **能力數字用推導，不用新儲存。** Skill profile、Pressure Accuracy、Speed×Accuracy 全部由既有
   `records.history` 純函數算出。舊使用者第一次打開新版就有完整雷達，migration 風險為零。見 [03](03-ability-model.md)。
3. **凡是會顯示給人看的數字與答案，都要有 CI 守門。** 新增任何 metric 就要新增對應 validator，
   跟現在的題庫驗證同一條線。見 [05](05-content-pipeline.md)。
