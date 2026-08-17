# 02 — 資料模型：Problem v2 / Records v2

原則：**只加不改、只加不刪**。所有新欄位可選，缺席時退回現行行為。

## 2.1 Problem v1（現況，凍結）

```js
{
  id: "lim-001",              // 全域唯一，目前是人類可讀的分類前綴 + 流水號
  topic: "limits",            // limits|derivatives|integrals|series
  difficulty: 1,              // 作者標，實測只用到 1–4
  prompt: "\\lim_{x \\to 0}\\frac{\\sin x}{x}",   // LaTeX，不含 $
  answerKind: "numeric",      // numeric|expression|antiderivative|text
  answer: "1",                // text 型用 answers: []
  timeLimit: 25,              // 秒
  tabLimit: 2,
  solution: "標準極限：…",     // 單段中文說明
  tags: [...],                // 284 種
  source: "Buzz original",    // 1327 題有
  hints: [...],               // 886 題有
  distractors: [...],         // 誘答必須固定的題型才用（理科移出後目前為 0）
  variable / variables,       // expression / antiderivative 判分用
  canonical                   // text 型顯示用
}
```

載入後 `problem_difficulty_calibration.js` 會 **mutate** 加上：
`rank`(1–6)、`rankLabel`、`rankReason`、`rank-N` / `beginner-friendly` / `boss-rank` / `boss-plus` tag。

## 2.2 Problem v2 新增欄位

全部可選。`id` 永不改變、永不重用。

```js
{
  // ── 身分 ───────────────────────────────────────────────
  uid: "bz-c-000417",         // 永久不可變 ID。公開 UI 只顯示這個，或什麼都不顯示
  id: "lim-001",              // 保留為工程內部代號（既有連結、SRS 資料都靠它）

  // ── 來源與原創聲明（必填，P3 起 CI 強制）─────────────────
  origin: {
    kind: "original",         // original | adapted | inspired | public-domain | user-submitted
    ref: "",                  // adapted/inspired 必填：出處描述
    year: 2026,
    note: ""                  // 「改寫自 2019 期中考第 3 題的結構，數字與函數皆更換」
  },

  // ── 難度 rubric（見 05）────────────────────────────────
  rubric: {
    steps: 3,                 // 1–2 / 3–4 / 5+ 三段
    obscurity: 2,             // 技巧冷門度 1–3
    load: 2,                  // 計算負擔 1–3
    authoredRank: 4,          // 由上三軸推出
    reason: "需要先辨識 Frullani 結構再處理發散端"
  },
  calibration: {              // 由 tools/calibrate_difficulty.js 產生，人不手改
    n: 412, p: 0.38, medianSec: 71, empiricalRank: 4, updatedAt: "2026-08-01",
    flag: ""                  // "mismatch" 時進人工複審佇列
  },

  // ── 技巧圖（見 03）─────────────────────────────────────
  skills: ["integral.frullani", "integral.improper.endpoint"],
  prereq: ["integral.improper"],

  // ── 教學內容 ───────────────────────────────────────────
  hints: [                    // 升級成三層結構，字串陣列仍相容
    { level: 1, text: "只給方向：這是兩個指數相減除以 x" },
    { level: 2, text: "關鍵技巧：Frullani，先確認 f(0)、f(∞) 存在" },
    { level: 3, text: "完整：∫₀^∞ (f(ax)-f(bx))/x dx = (f(0)-f(∞))ln(b/a)" }
  ],
  keyIdea: "看到 (e^{-ax}-e^{-bx})/x 就是 Frullani。",   // 「這題真正關鍵是什麼」一句話
  solutionSteps: [            // 結構化解答，取代單段 solution（solution 保留為 fallback）
    { title: "辨識結構", latex: "\\int_0^\\infty\\frac{f(ax)-f(bx)}{x}dx", note: "" },
    { title: "套公式",   latex: "(f(0)-f(\\infty))\\ln\\frac{b}{a}", note: "" }
  ],
  altSolutions: [             // R4+ 才需要：解法 A / 解法 B
    { label: "解法 B：參數微分", steps: [...] }
  ],

  // ── 品質與驗證 ─────────────────────────────────────────
  verify: "Math.log(5/2)",    // JS 可求值的答案表達式，CI 用來獨立驗證 answer（沿用 BuzzPhysics 做法）
  verifyTolerance: 1e-9,
  status: "live",             // draft | candidate | live | quarantined | retired
  reviewedBy: ["tudo"],
  reviewedAt: "2026-08-01",

  // ── 變體（見 05.6）─────────────────────────────────────
  template: null,             // 有 template 的題目由 build 時展開，不在 runtime 生成
  variantOf: null             // 展開出來的題目指回母題 uid
}
```

### 為什麼要 `uid` 而不是沿用 `id`

> **已上線。** `src/kernel/uid_map.js`（1456 筆）+ `tools/assign_uids.js`。
>
> 側表而不是寫進 problem 物件 —— 跟 `skill_tags.js` 同一個模式，
> 因為動 problem 物件就會動到抽題結果。
>
> **已配發的號碼永不回收。** 移除 34 題重複題之後，那 34 個 uid 仍然留在對照表裡。
> 回收的話舊連結會指到一題完全不同的題目 —— 那比連結失效更糟。

`id` 目前混雜了「分類 + 出處 + 流水號」（`td-der-002`、`int-051`、`sci-phy-014`），
使用者看得到內部結構，而且題目搬包時會有改名壓力。
`uid` 是純序號、永不重用、與分類脫鉤。**分享碼、班級作業、投稿引用、跨科連結一律用 `uid`。**
`id` 保持不動以維持既有 `records.mistakes` / `problemStats` / 分享連結的相容性。

映射表 `src/kernel/uid_map.js`（`id ↔ uid`）由 `tools/assign_uids.js` 一次性產生後凍結，
新題目在建立時就直接配 uid。CI 驗證：uid 唯一、單調遞增、已存在的 uid 永不換 id。

### 公開 UI 的題號政策

- 練習畫面：**不顯示任何題號**。
- 題庫詳情 / 回報表單：顯示 `uid`（短碼形式 `#417`）。
- 分享碼、匯出 JSON：用 `uid`。
- `id` 只出現在 devtools 與工程文件。

## 2.3 Records v1（現況，凍結）

`localStorage["buzzcalculus.records.v1"]`，由 `normalizeRecords()` 惰性補齊：

```text
attempts, practiceRuns, bestScore, bestStreak, totalAnswered, totalCorrect,
mistakes{}, history[]  (上限 40 筆), achievements{}, topicStats{}, problemStats{},
daily{}, dailyOne{}, pathUnlocks{}, pathGateAttempts{}, pathLessonRuns{},
proofs{}, favorites{}, problemReports{}, streakShields{}, namedExams{},
placement{rank,date,weakTag}, settings{difficultyCap}, rival{level,wins,losses},
weeklyChallenge{}, onboardingLevel, onboardingSeen, updatedAt
```

`history[]` 每筆含完整 `answers[]`（`problemId, input, correct, reason, elapsed, earned,
hintsUsed, errorTag, assisted, unanswered`）。

**這裡有一個關鍵發現**：`elapsed`、`unanswered`、`assisted`、`hintsUsed` 已經在記了。
這代表 Pressure Accuracy、Speed×Accuracy、「不會 vs 來不及」**今天就算得出來**，
不需要任何新欄位，只需要 `HISTORY_LIMIT` 放大。見 2.5。

## 2.4 Records v2 新增命名空間

同一把 key（`buzzcalculus.records.v1`），同一支 `normalizeRecords()`，只加頂層命名空間：

```js
{
  // …v1 全部欄位不動…

  schema: 2,                   // 缺席視為 1

  identity: {                  // 見 06
    deviceId: "d-9f3a…",       // 匿名，本機生成
    accountId: "",             // 登入後填入
    createdAt: "2026-01-04T…"
  },

  plan: {                      // 見 04.5 考試倒推
    examAt: "2026-11-05",
    label: "微積分期中",
    scope: ["integral.*", "series.*"],
    dailyMinutes: 15,
    mode: "normal"             // normal | sprint（T-7 自動切）
  },

  conf: {                      // 見 03.6 信心校準；problemId → 最近一次自評
    "int-051": { level: "sure", correct: false, at: "…" }
  },

  errorCauses: {               // 見 03.7；problemId → 錯因
    "int-051": { cause: "algebra-slip", at: "…" }
  },

  drafts: {                    // 草稿只存索引，筆畫資料在 IndexedDB（見 2.6）
    "int-051": { key: "draft:int-051:1754…", at: "…", strokes: 42 }
  },

  sessions: [],                // 見 04.4；比 history 更輕的 session 摘要，上限 400 筆

  cache: {                     // 純推導結果的記憶化，可隨時整個丟掉
    abilityAt: "…", abilityHash: "h:412:88f", ability: { … }
  }
}
```

**規則**：`cache` 以外的所有 v2 欄位都必須能從 UI 重建或可安全為空。
`cache` 必須能被刪光而不影響正確性（只影響速度），且以 `history.length + 最後一筆 finishedAt` 做 hash 失效。

## 2.5 `HISTORY_LIMIT` 是能力模型的天花板

> **實作現況（2026-08-15，已上線）**
>
> `src/kernel/records_v2.js` + `tools/validate_records_v2.js`（已進 CI）。
> `src/app.js` 的 `normalizeRecords()` 觸發惰性遷移，`saveQuizRecord()` 增量寫入，
> 兩處都是 feature-detect，kernel 缺席時紀錄仍是合法的 v1。
>
> 實測數字：
>
> | 項目 | 數字 |
> | --- | ---: |
> | 滿載體積（5000 筆作答 + 400 場摘要） | 203KB |
> | 滿載 `profile()` | 15ms |
> | 遷移保留的 v1 欄位 | 29 / 29 |
> | 遷移邊界的重複筆數 | 0 |
>
> **分層效益實測**：一個打了 50 場的使用者，`history` 只留得住 400 筆作答，
> `attemptLog` 保住全部 500 筆。更重要的是趨勢會因此**變準**：
> 只讀 `history` 時算出 d30 = +16，但那是假的 —— 舊資料被 `HISTORY_LIMIT`
> 洗掉導致 30 天前的基準線失真。分層之後算出 +2，那才是實話。
>
> 三處與原設計的差異：
>
> 1. **不做 skill 級的每週 rollup。** 原設計要求「超過上限時降採樣而非截斷，
>    更早的每技巧只留每週彙總」。實作時改成單純丟最舊的，理由是：長期成長曲線
>    由 `sessions` 摘要（400 場，涵蓋一年以上）就畫得出來，再多一層 rollup 會讓
>    能力模型要同時吃兩種資料形狀，而這個複雜度在使用者超過 5000 筆之前價值是零。
>    5000 筆以每天 30 題計是半年份。
> 2. **`history` 上限維持 40 場，沒有調到 60。** 長尾已經由 `attemptLog` 接手，
>    調大 `history` 只是多佔空間。
> 3. **`flags` 位元加寬到 9 bits。** 原設計的 5 個布林位不夠：提示層數（0-7）
>    會影響精熟度計分，錯因（0-7）是弱點分析的輸入，兩者都不能丟。
>    現在是 bit 0-2 布林、bit 3-5 提示層數、bit 6-8 錯因代碼。
>    錯因存數字代碼而不是中文字串 —— 文案會改，代碼不能改。
>
> **最重要的不變式**（由 CI 鎖住）：從 `history` 和從 `attemptLog` 算出的
> 能力模型結果必須**逐欄位完全相同**。換資料來源不能改變使用者看到的數字。

現況 `HISTORY_LIMIT = 40`，約等於 400–500 次作答。這對雷達夠用，對
「30 天能力變化」「同難度百分位」「每個技巧的 PA/UA 分離」**不夠**。

**改動**：分層保留。

| 層 | 內容 | 上限 | 用途 |
| --- | --- | --- | --- |
| `history` | 完整 session + 每題明細（現況格式） | 60 | 結算頁、最近表現、明細檢視 |
| `attemptLog` | 極精簡逐題紀錄 `[pid, t, ok, sec, flags]`（陣列不是物件） | 5000 | 能力模型、趨勢、百分位 |
| `sessions` | session 級摘要 | 400 | 熱力圖、成長曲線 |

`attemptLog` 用 tuple 陣列而非物件，5000 筆約 200–300KB，在 localStorage 5MB 額度內安全。
`flags` 是 bitfield：`1=unanswered 2=assisted 4=timed 8=hintUsed 16=practice`。

超過上限時**降採樣而非截斷**：保留最近 2000 筆全量，更早的每技巧只留每週彙總
（`weekKey, skillId, n, correct, sumSec`）。成長曲線因此可以一路回溯到第一天。

## 2.6 IndexedDB：草稿與大型資料

localStorage 放不下手寫筆畫。新增 IndexedDB `buzz` / store `drafts`：

```js
{ key: "draft:<id>:<ts>", problemId, strokes: [[x,y,p,t], …], w, h, at }
```

保留策略：每題最近 3 份 + 總量上限 50MB，超過丟最舊。
重做錯題時載入上一次草稿並疊在旁邊（C 區第 149 條）。

IndexedDB 不可用時（隱私模式）靜默降級成「不保存草稿」，不得阻斷答題。

## 2.7 遷移與相容

**沒有版本升級腳本。** 沿用現有的惰性遷移風格（`mistakeSrs` 已經是這樣做的）：

```js
function normalizeRecords(records) {
  // …v1 邏輯不動…
  next.schema = Number(next.schema || 1);
  next.identity = ensureIdentity(next.identity);
  next.attemptLog = Array.isArray(next.attemptLog) ? next.attemptLog : deriveAttemptLog(next.history);
  //                                                                    ^^^ 舊使用者從 history 回填
  next.schema = 2;
  return next;
}
```

`deriveAttemptLog()` 讓老使用者第一次開新版就有 400+ 筆作答資料可以算能力，
**不會看到空白的雷達**。這是 v2 最重要的體驗細節。

**向下相容承諾**：v2 寫出的 records 被舊版讀到時，多餘欄位被忽略但不會被刪
（`normalizeRecords` 不做白名單過濾 — 這一點目前的實作剛好符合，要寫成測試鎖住）。

## 2.8 匯出格式

匯出 JSON 加上信封，方便未來跨科目與雲端：

```js
{
  format: "buzz.records",
  version: 2,
  subject: "calculus",
  exportedAt: "…",
  app: "v1.0.0",
  records: { … }
}
```

匯入時：舊格式（裸 records）照收；新格式檢查 `subject` 不符時警告但仍允許（跨科目共用 kernel）。
