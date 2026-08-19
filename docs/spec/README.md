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

## 現況快照

這是大修的起點，所有設計都必須相容於此。

> 下面這一段由 `node tools/spec_snapshot.js --update` 產生，CI 會擋不一致。
>
> 原因：這段原本是手寫的，然後它做了所有手寫數字都會做的事 —— 停在過去。
> 它一度寫著 1407 題、`app.js` 9122 行、12 支驗證器，而那三個數字當時全都錯了，
> 錯的幅度還不小。整份 spec 的每一節都寫著「必須相容於此」，
> 所以**一份數字錯的規格比沒有規格更糟**：讀的人會拿它當事實去做取捨，
> 而且不會想到要去驗證。
>
> （這段說明本身刻意不寫任何當前數字 —— 不然它會變成下一個過期的地方。）

<!-- SPEC-SNAPSHOT:BEGIN 由 tools/spec_snapshot.js 產生，不要手改 -->

**規模**

| 項目 | 數字 | 備註 |
| --- | ---: | --- |
| 題目總數 | 1605 | 純微積分；理科秒殺包已於 2026-08 移出 |
| 答案通過獨立數值驗算 | 906（56%） | 其餘是證明題與定性題，本質上沒有可比對的數值 |
| 有 `source` | 1525 |  |
| 有 `tags` | 1605 | distinct tag 300 個，其中 232 個是技巧 tag |
| 有 `solution` | 1605 | 單段文字 |
| 有作者撰寫 `hints` | 1013 |  |
| 有 `solutionSteps` | 127 | 結構化步驟，仍是最大的內容缺口 |
| 證明題 | 41 | 含 Lean 機器驗證 8 則 |
| `src/app.js` | 12865 行 | 單一 IIFE，拆分進行中 |
| `styles.css` | 8254 行 |  |
| 題庫檔 `src/problem_*.js` | 26 |  |
| kernel 模組 `src/kernel/*.js` | 14 | 純函式層 |
| CI 驗證器 `tools/` | 27 支 | validate / verify / smoke / e2e |

**答案型別分佈**：`numeric` 1129、`expression` 206、`antiderivative` 123、`text` 91、`set` 17、`worksheet` 17、`interval` 16、`graph` 6。

**難度分佈**：R1 117 / R2 322 / R3 378 / R4 449 / R5 256 / R6 83。
rank 由 `src/kernel/rubric.js` 的三軸（步驟數 / 冷僻度 / 計算負擔）算出，
不再由 tag 規則推導；黃金檔 `tools/golden/difficulty.json` 釘住分佈與錨點題。

<!-- SPEC-SNAPSHOT:END -->

**已存在但只是 scaffold 的東西**（不要重做，要接完）：

- `BuzzSync`（`src/app.js`，搜 `const BuzzSync`）：GET/PUT + Bearer，未設 endpoint 時靜默降級。
  合併規則已經改成逐 key 的 `BuzzRecords.merge()`，**不再是整包 last-write-wins** ——
  舊的 LWW 只要兩台裝置都練過就會吃資料。缺的只剩伺服器那一端。
- `records.placement`（8 題定位測驗）、`ONBOARDING_LEVELS`（3 條開局路線）。
- SRS（`mistakeSrs`，惰性遷移，最長 30 天）。
- `masteryRadarData()`（8 軸、30 天半衰、借助解答只算半分）。
- GA4 `trackEvent()`（33 個事件，`validate_analytics.js` 擋上報使用者輸入）。
- 純微積分不變式 `validate_calculus_only.js`（取代原本的科目閘門）。

**已經接完、不再是 scaffold 的**：

- 難度 rubric：三軸（步驟數 / 冷僻度 / 計算負擔）→ rank，側表在 `src/kernel/rubric.js`，
  黃金檔釘住分佈與 91 個錨點題。原本「R5/R6 全部來自 tag 規則推導」的狀態已經結束。
- 答案獨立驗算：`tools/verify_answers.js` + `src/kernel/verified_answers.js` 側表，
  產品上有「答案已驗算」標記。
- 題目回報：原本只寫進使用者自己的 localStorage（等於沒送出），現在會攤開內容
  讓使用者送到 GitHub issue 或複製走。
- 法遵：`privacy.html` / `terms.html` / `about.html` / `changelog.html`，
  每一條承諾都由 `validate_privacy.js` 綁在程式碼上。

## 三個貫穿全域的設計承諾

1. **加層，不重寫。** 新能力一律以新的 `window.Buzz*` 全域模組出現，`src/app.js` 用 feature-detect 消費；
   模組載入失敗時退回今天的行為。見 [01](01-architecture.md)。
2. **能力數字用推導，不用新儲存。** Skill profile、Pressure Accuracy、Speed×Accuracy 全部由既有
   `records.history` 純函數算出。舊使用者第一次打開新版就有完整雷達，migration 風險為零。見 [03](03-ability-model.md)。
3. **凡是會顯示給人看的數字與答案，都要有 CI 守門。** 新增任何 metric 就要新增對應 validator，
   跟現在的題庫驗證同一條線。見 [05](05-content-pipeline.md)。
