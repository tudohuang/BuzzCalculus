# 量測：漏斗、回訪與怎麼在 GA4 讀

> 對應《工程宅的 Buzz 商業實戰手冊》第 02、03、12、13、15 章與附錄 A、C。
> 這份文件是**定義**：GA 上的數字要跟這裡寫的一樣才算數。改事件的觸發條件就要改這份，
> `tools/validate_analytics.js` 會擋「漏斗某一步沒有事件在送」與「這份文件沒寫到某一步」。

## 1. 我們要回答的問題

> 進來的人裡，有多少人開了一題、送出答案、答對一題、做完第二題、7 天後回來、完成一節課？

| 漏斗那一步（手冊附錄 A） | GA 上實際的事件 | 新／既有 |
| --- | --- | --- |
| `landing_view` | `landing_view` | 新 |
| `practice_open` | `problem_start` | **別名**（既有事件，意思相同，不重送） |
| `answer_submit` | `answer_submit` | 新（從 `problem_submit` 推出，排除逾時與跳過） |
| `answer_feedback`（第 03 章） | 同 `answer_submit` | 送出當下就有回饋（模擬考除外），不另外記 |
| `answer_correct` | `answer_correct` | 新 |
| `second_question_complete` | `second_question_complete` | 新 |
| `lesson_section_complete` | `course_section_complete` | **別名** |
| `return_7d`（另有 `return_d1`） | `return_7d`、`return_d1` | 新 |

別名的理由：`problem_start` 與 `course_section_complete` 已經在收、已經有歷史資料，意思也跟手冊的定義一樣。
改名會讓 GA 上的趨勢斷在改名那天，重送一份則讓事件數翻倍、兩個名字永遠要對帳。所以在這裡寫清楚「手冊的 X 就是 GA 上的 Y」。

## 2. 每個事件的觸發條件

所有事件都只在**分析開著**時送；關掉時連 `gtag.js` 與 `src/kernel/metrics.js` 都不載（見第 5 節）。

| 事件 | 什麼時候送 | 參數（不含共同欄位） | 來源 |
| --- | --- | --- | --- |
| `landing_view` | 每次**頁面載入**送一次（含重新整理、主畫面 app 冷啟動）。在 app 裡切頁回到首頁**不**再送。 | `screen`（第一個畫面：home / course / quiz …）、`visitor`（`new` = 這台裝置第一次見到、`returning`） | metrics.js `start()` |
| `problem_start`（= `practice_open`） | 一題變成可以作答：開局的第一題、按下一題、考卷跳題。定位測驗、每日一題、錯題重做都算。 | `mode, problem_id, rank, index, answer_mode` | app.js `trackProblemStart` |
| `answer_submit` | 使用者**按了送出**、系統判完對錯（`problem_submit` 的 reason 是 Correct 或 Wrong）。打字不算；逾時、按「跳過」、定位測驗的「我還沒學過這個」不算。 | `problem_id, difficulty, mode, correct, seq`（seq = 這個 session 第幾道**不同**的題；同一題重做 seq 不變） | metrics.js `observe()` |
| `answer_correct` | 同上且判定答對 | `problem_id, difficulty, mode, seq, secs_since_landing`（距頁面載入幾秒） | metrics.js |
| `second_question_complete` | 同一個 session 裡第二道**不同**的題送出並判完（對錯都算）。每個 session 只送一次。 | `problem_id, difficulty, mode, secs_since_landing` | metrics.js |
| `course_section_complete`（= `lesson_section_complete`） | 課程分節**第一次**完成節末的學習動作：預測選了、小測選對、滑桿拖進範圍、證明節的動作做完、「自己算」答完。只滑到底、只點「下一句」**不算**；重讀不再記。 | `lesson, section, mode`（tap / voice）＋別名 `lesson_id, section_id` | course_sections.js `complete()` |
| `return_d1` | 「第一次見到」的**隔一個本機日曆日**打開 app。只送一次。 | `days_since_first`（= 1） | metrics.js |
| `return_7d` | 「第一次見到」之後第 **7–13** 天之間**第一次**打開 app。只送一次。 | `days_since_first`（7–13；**= 7 就是嚴格的 D7**） | metrics.js |

「打開 app」= 頁面載入，或主畫面 app 從背景回到前景（`visibilitychange`）；同一天不會重送。

### 共同欄位（每個事件都帶，既有欄位優先）

| 欄位 | 值 | 說明 |
| --- | --- | --- |
| `subject_id` | `calculus` | 第二科上線時用來分科 |
| `session_id` | 16 個 hex 的隨機碼 | 開分頁時產生，存在 **sessionStorage**（`buzzcalculus.metrics.session`），關掉分頁就沒了。**不是**使用者 id。 |
| `difficulty` | 1–6 | 有 `rank` 的事件補一個同值的 `difficulty` |
| `lesson_id` / `section_id` | 課 id／第幾節 | 有 `lesson` / `section` 的事件補上 |
| `app_version` / `build_date` | | 原本就有 |

`session_id` 在 metrics.js 載入之前送出的事件上沒有（開站頭幾百毫秒，實際上只有極少數）。

### 「session」的定義

一個瀏覽器分頁的生命週期（sessionStorage 的範圍）。重新整理仍是同一個 session；關掉分頁、或主畫面 app 被系統殺掉再開，是新的 session。
這跟 GA4 自己的 session（30 分鐘無互動就切）不同 —— `second_question_complete` 用的是我們的定義。

### 「第一次見到」的定義與舊使用者

分析開著時第一次載入 metrics.js 的那一天（本機日曆日），存在 localStorage `buzzcalculus.metrics.v1`：`{ first: "YYYY-MM-DD", d1?, d7?, legacy? }`。
這個日期**不會**送出去，送出去的只有「隔了幾天」。

這支上線前就在用的人（紀錄裡已經有練習、答題或讀課）標成 `legacy`：他們不是新 cohort，**不送** `return_d1` / `return_7d`，
`landing_view` 的 `visitor` 是 `returning`。所以 return 事件只會來自上線之後的新訪客。

## 3. 在 GA4 讀

### 3.1 先做一次：註冊自訂維度

GA4 的自訂參數要先註冊成維度，探索報表才看得到（管理 → 資料顯示 → 自訂定義 → 建立自訂維度，範圍「事件」）：

`screen`、`visitor`、`mode`、`difficulty`、`correct`、`seq`、`days_since_first`、`subject_id`、`lesson_id`。
`secs_since_landing` 註冊成**自訂指標**（單位：秒）。
`session_id`、`problem_id` 基數太高，不建議註冊（要逐題分析請用 BigQuery 匯出）。註冊之前收到的資料不會回補。

### 3.2 新手漏斗（探索 → 漏斗探索）

1. 新增探索 → 「漏斗探索」，選「**封閉式漏斗**」（必須從第一步進來）、「顯示經過時間」。
2. 步驟依序：
   1. `landing_view`，條件 `visitor = new`（只看新訪客；拿掉這個條件就是所有人）
   2. `problem_start`（practice_open）
   3. `answer_submit`
   4. `answer_correct`
   5. `second_question_complete`
3. 「後續步驟」設「間接跟隨」，時間限制可設 30 分鐘（近似「同一次使用」）。
4. 細分維度可加 `screen`（從首頁進來 vs. 分享連結直接進題目）或裝置類別。
5. 讀法：看**最大的絕對流失**（手冊第 03 章）——例如 1,000 → 400 → 160 → 70，最痛的是首頁到開題，先修那一段。

課程漏斗另開一個：`landing_view` → `course_section_complete`（lesson_section_complete）→ `course_lesson_complete`。

### 3.3 D1 / D7 回訪

**方法 A（我們自己的訊號，建議）**：報表 → 互動 → 事件，或探索 → 任意形式：

- D1 ≈ 某段期間 `return_d1` 的使用者數 ÷ 前一天 `landing_view (visitor = new)` 的使用者數。
- 嚴格 D7 = `return_7d` 且 `days_since_first = 7` 的使用者數 ÷ 7 天前 `landing_view (visitor = new)` 的使用者數。
  例：10/1 新訪客 100 人，10/8 有 12 人送了 `return_7d (days_since_first = 7)` → D7 = 12%。
- 「第二週有回來」（7–13 天內任一天）= 所有 `return_7d` 的使用者數 ÷ 對應那週的新訪客。**這是不同的指標，不能叫 D7**（手冊第 03 章）。
- 比較時用整週的 cohort（例如「10/1–10/7 的新訪客」對「他們的 return_7d」），一天幾十人的量逐日比會很吵。

**方法 B（GA4 內建）**：探索 → 「同類群組探索」，納入條件 `first_visit`、回訪條件「任何事件」或 `answer_submit`（後者 = 回來而且真的做題，對應手冊第 02 章的「活躍學習者」）、精細程度「每日」。
這是 GA 用自己的 cookie 算的，數字會跟方法 A 有落差（見第 4 節）；兩邊一起看，差很多時以方法 A 為主再查原因。

### 3.4 第一分鐘

`answer_correct` 且 `seq = 1` 的 `secs_since_landing` 分布 = 真實使用者從開站到第一次答對花多久（手冊第 04 章、附錄 C 的「60 秒」）。
看中位數與 P75，不要只看平均（手冊第 03 章）。CI 另有一支 `tools/e2e_first_minute.js` 用手機尺寸實測同一件事。

## 4. 已知的偏差

- **匿名**：沒有帳號。換裝置、換瀏覽器、無痕視窗、清除網站資料，對我們（和 GA）都是一個新的人：新訪客被高估、回訪被低估。
- **清除儲存空間**：`buzzcalculus.metrics.v1` 被清掉的人下次會被當成新訪客；設定頁的「清除資料」也會清掉它（整個 `buzzcalculus.` 命名空間）。
- **關掉分析的人完全不在數字裡**；中途關掉再打開的人，「第一次見到」從重新打開那天算（如果那時已經有練習紀錄，會被標成 legacy、不送 return）。
- **iOS Safari 的 ITP** 與廣告阻擋外掛會擋 GA：事件少收是常態，比例比絕對數可靠。
- **主畫面 app 背景太久被系統殺掉**再打開是新的頁面載入：會多一個 `landing_view` 與新的 session。`landing_view` 是「載入次數」，算人要用「使用者」而不是「事件數」。
- **跨午夜**：日期用裝置的本機時間；改時區或改系統時間會讓 `days_since_first` 偏一天。往回撥時間（負的天數）不送。
- **legacy**：上線前就在用的人不送 return 事件，所以頭兩週 `return_7d` 會很少——那是定義，不是流失。
- **考試季**：期中、期末前後的新訪客 cohort 本來就不一樣（手冊第 12、13 章）。比較改版前後時對齊學期週次，不要拿考前一週對寒假。
- **小樣本**：一週幾十個新訪客的 D7 差兩三個百分點是雜訊。先寫假設、一次只改一個變數（手冊第 12 章）。

## 5. 隱私

- 分析關掉：不載 `gtag.js`、不載 `src/kernel/metrics.js`、不寫 `buzzcalculus.metrics.v1`、不送任何事件。
  `tools/validate_privacy.js` 檢查 metrics 只從 `setupAnalytics` 的開關後面載；`e2e_first_minute.js` 在真的 Chrome 裡確認關掉時沒有 dataLayer、沒有抓 metrics.js、沒有寫日期。
- 不送：打的答案、手寫、題目內容、任何自由文字或可以辨識人的東西。`problem_id` 是題號，`difficulty` 是 1–6。
- `session_id` 只活在一個分頁裡；「第一次見到的日期」只在本機，送出去的只有天數差。
- 這些都寫在 `privacy.html`（中、英兩段），`tools/validate_analytics.js` 會擋「新事件沒列進隱私頁」。

## 6. 程式在哪

- `src/kernel/metrics.js`（`data-lazy="metrics"`，進 APP_SHELL）：EVENTS 表、共同欄位、從 `problem_submit` 推出漏斗、回訪訊號。
- `src/app.js`：`setupAnalytics` 載它（開關後面）；`trackEvent` 加共同欄位並把事件交給 `observe()`。新事件一律先登記在 metrics.js 的 EVENTS（start 時併進 `ANALYTICS_EVENTS`）。
- `docs/spec/06-identity-sync-legal.md` §6.5 的正式事件表列了這些事件。
