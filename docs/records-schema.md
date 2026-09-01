# records 結構（buzzcalculus.records.v1）

所有練習資料都存在 localStorage 的 `buzzcalculus.records.v1` 這一個 key 底下。
本檔是它的權威文件。改欄位的人要同步改這裡 —— `normalizeRecords()`（src/app.js）
是實際的守門員，兩邊對不上時以程式碼為準、然後把這裡修正。

原則：

- **匯入是合併不是覆蓋**。任何欄位的設計都要能跟另一台裝置的同名欄位合併。
- **舊欄位永遠容忍**。功能可以拔，資料不准弄丟 —— 使用者匯入三年前的備份
  不能炸。已封存的欄位 normalizeRecords 照樣保留原樣。
- schema 版本在 `schema`（目前 2）。升版只在「舊資料需要轉換」時發生，
  單純加欄位不升版。

## 現役欄位

| 欄位 | 型別 | 說明 |
|---|---|---|
| `schema` | number | 結構版本，目前 2 |
| `updatedAt` | ISO string | 每次寫入蓋新，雲端同步用「最新者勝」 |
| `attempts` / `practiceRuns` | number | 計分局數／練習局數 |
| `bestScore` / `bestStreak` | number | 本機最佳 |
| `totalAnswered` / `totalCorrect` | number | 累計作答與答對 |
| `lastPlayed` | ISO string | 最後一局結算時間 |
| `history` | array | 每局摘要（mode、topic、score、accuracy、answers…），新的在前 |
| `attemptLog` | array | 逐題精簡紀錄，餵能力模型（BuzzAbility） |
| `problemStats` | object | 題號 → {對錯次數、秒數}，抽題避重與校準包用 |
| `topicStats` | object | 主題 → 統計 |
| `mistakes` | object | 題號 → 錯題項（tag、lastInput、SRS 的 interval/dueAt） |
| `daily` | object | 日期 → 每日任務進度；連勝由此推 |
| `dailyOne` | object | 每日一題的結果與連續天數 |
| `streakShields` | number | 連勝盾牌 |
| `achievements` | object | 成就解鎖狀態 |
| `favorites` | object | 題號 → 收藏 |
| `problemReports` | object | 題號 → 已回報 |
| `namedExams` | object | 具名模擬卷的成績與最佳 |
| `placement` | object | 定位測驗結果（rank、weakTag） |
| `pathUnlocks` / `pathLessonRuns` / `pathGateAttempts` | object | 主線進度 |
| `proofs` | object | 證明實驗室的自評進度 |
| `sessions` | number | 局數（records_v2 smoke 用） |
| `onboardingSeen` / `onboardingLevel` / `onboardingContext` | mixed | 引導狀態 |
| `backupNoticeSeen` | mixed | 備份提醒已讀 |
| `settings` | object | 見下 |

### settings 子欄位

| 欄位 | 值 | 說明 |
|---|---|---|
| `dailyTarget` | 5/10/12/20 | 每日題數目標 |
| `focusMode` | "on"/"off" | 收起連勝與成就等元素 |
| `penScale` | "thin"/"standard"/"thick" | 計算紙筆寬（0.75×/1×/1.3×） |
| `analytics` | "off" 等 | 使用分析開關（關掉時連 script 都不載） |

## 已封存欄位（2026-09 拔功能後保留、不再寫入、不再顯示）

| 欄位 | 原功能 | 為什麼還在 |
|---|---|---|
| `conf` | 信心自評（「剛剛有多確定？」） | 匯入舊備份不能炸；資料屬於使用者 |
| `weeklyChallenge` | 每週挑戰＋成績代碼 | 同上 |
| `plan` / `planHistory` / `planReportSeen` | 考試倒推計畫 | 同上 |

封存欄位的規矩：normalizeRecords 保留原樣、匯出照樣帶著、匯入照樣合併。
smoke_app_render 有測試釘著「舊 records.conf 容忍」這一條。

## 相鄰的儲存

- `buzzcalculus.session.active` — 進行中的一局（斷線續作）。結算即清除。
- `buzzcalculus.backup.<timestamp>` — 寫入前的自動備份，輪替上限 40 份。
- `buzzcalculus.theme` — 主題。
- `buzzcalculus.sync.meta` — 自架同步的上次同步時間（見下）。
- IndexedDB `buzzcalculus-boards` — 手寫草稿的筆畫（一題可達幾十 KB，
  不進 localStorage）。

## 自架同步（刻意保留的擴充點）

`window.BUZZ_SYNC_ENDPOINT`（可選 `BUZZ_SYNC_TOKEN`）設定後，設定頁的
換裝置卡會多出 pull/push。GET 拉、PUT 推（JSON + Bearer），衝突規則
`updatedAt` 最新者勝。**沒有官方後端**，這是給自架者的縫 —— 產品本身
不開帳號、不架伺服器存作答紀錄（隱私承諾，見 privacy.html）。
沒設定時整組靜默不出現，settings 的文案誠實說明現況。
