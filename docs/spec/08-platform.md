# 08 — 平台化：多科目、symbolic、AI、商業模式

## 8.1 從 App 到 Engine

BuzzPhysics（`../BuzzPhysics`）目前是**複製一份程式碼再改**的姊妹站：
同樣的 `index.html` + `src/` + `sw.js` + `tools/` 結構，428 題物理題。

複製法在第二個科目還可以，第三個就會崩潰（判分器的修正要改三份、能力模型的修正要改三份）。

### 目標架構

```text
buzz-engine/                    ← 共用（就是 01 章的 kernel）
  kernel/checker.js             判分
  kernel/ability.js             能力模型
  kernel/planner.js             推薦
  kernel/session.js             抽題
  kernel/records_v2.js          資料
  kernel/skill_graph.js         技巧圖（介面，資料各科自帶）
  ui/                           共用元件（可選，最後才做）

buzz-calculus/                  ← 科目 = 題庫 + skill graph + 文案 + 樣式
  subject.json                  { id, label, topics, packs, radarAxes, primary }
  src/problem_*.js
  src/skills.js
buzz-physics/
buzz-linalg/  …
```

**分發方式**：不引入 monorepo 工具。`buzz-engine` 是一個獨立 repo，
各科目用 git submodule 或 CI 步驟複製進 `src/kernel/`。
**保持「開 index.html 就能跑」的能力** — 這是這個專案最珍貴的性質，不能為了工程優雅賣掉。

### 遷移順序

1. 先在 BuzzCalculus 內把 kernel 抽出來（[01.4](01-architecture.md#14-srcappjs-的瘦身路線)）。
2. BuzzPhysics 改成引用同一份 kernel，驗證介面夠通用。
3. 才抽成獨立 repo。

**不要先設計通用引擎再套兩個科目。** 先讓兩個科目共用，通用性自然浮現。

## 8.2 跨科 Skill Graph

科目內的 skill graph 已在 [03.2](03-ability-model.md#32-skill-graph) 定義。跨科多一層：

```js
// buzz-physics/src/skills.js
{
  id: "phys.kinematics.integral",
  crossPrereq: ["calculus:integral.usub", "calculus:diff.chain"]
}
```

當使用者在 BuzzPhysics 的某個 skill 反覆卡住，引擎檢查其 `crossPrereq` 在
BuzzCalculus 的精熟度。若 `M < 50`，推薦：

> 「你在等加速度積分上錯了 6 次。根本原因可能在微積分的 u-substitution（你的精熟度 38）。
> 　要不要先去 BuzzCalculus 練 8 題？」

**這是跨科訂閱最強的價值主張**，而且技術上只需要一個共用的 records 存取層。
未登入時：兩個網站各自的 localStorage 互不可見 → 提供「連結另一個科目」的匯入按鈕。
登入後：自動。

## 8.3 Symbolic Backend

### 結論先講：runtime 不引入 CAS

現行判分器是**多點數值取樣**（`checkExpression` 取 6 個樣本點，`checkAntiderivative`
比較差值是否為常數）。實測結果：對 1407 題運作良好，零依賴、零延遲、離線可用。

引入 SymPy（Pyodide，約 10MB）或 JS CAS 會摧毀離線、拖慢首屏，
換來的是「極少數等價判定邊界情形」的改善。**投報率不成立。**

### 正確的做法：symbolic 放在 CI，不放在瀏覽器

| 用途 | 位置 | 工具 |
| --- | --- | --- |
| 判分（使用者輸入 vs 答案） | 瀏覽器 | 現行數值取樣（保留、強化） |
| 答案正確性驗證 | CI | SymPy（node → python 子行程） |
| 變體生成 | build time | SymPy |
| 解析步驟結論驗證 | CI | SymPy |
| 「相似題」生成 | build time | template + SymPy 驗證 |

CI 可以裝任何東西，時間也不是瓶頸。這樣既得到 symbolic 的正確性保證，
又完全不影響 runtime 架構。

### 判分器要強化的實際問題（不需要 CAS）

1. **取樣點會踩到定義域外**：`log(x)`、`sqrt(x-2)`、`1/(x-1)`。
   現行固定樣本 `[0.35, 0.8, 1.4, 2.2, 3.1, 4.4]` 會產生 NaN 而被跳過，
   極端情況下 `valid` 不足 3 就判「格式讀不穩」— 使用者答對卻被打槍。
   **改法**：題目可帶 `domain: { min, max, avoid: [1] }`，取樣點依此生成；
   自動偵測 NaN 比例 > 40% 時擴大取樣範圍重試。CI 對每題檢查取樣有效率 >= 80%。
2. **複數答案**：現在完全不支援。加 `answerKind: "complex"`，用複數算術取樣。
3. **多值 / 區間答案**：`answerKind: "set"`（`{1, -3}`）、`"interval"`（`(-1, 1]`）。
   目前這類題被迫寫成 `text`，判分只能字串比對（115 題）。
4. **容差**：現行 `numeric` 相對容差 1e-6，對 `1e-12` 級答案過寬。改成
   `max(absTol, |a| * relTol)`，`absTol` 可由題目指定。

這四項合起來比引入 CAS 有價值得多。

## 8.4 AI 的角色

**硬規則：AI 不得產生任何會被使用者當成正確答案的內容，除非該內容已被機器驗證。**

| 允許 | 條件 |
| --- | --- |
| 分析錯誤原因 | 只根據使用者的作答紀錄與草稿，輸出「你可能在第 2 步把負號弄丟了」。不給答案 |
| 生成相似題 | 必須通過 `verify_answers.js` + 重複偵測 + 人工複審才進題庫 |
| 改寫解析文字 | 原始數學內容不變，只改文字流暢度，且要人工過目 |
| 生成提示 Level 1 | 只給方向、不給技巧名、不給答案，且人工過目 |

| 禁止 | 理由 |
| --- | --- |
| 即時對話式解題 | 那是課程產品，且錯誤率不可控 |
| 直接產生答案上線 | 一次錯誤答案的信任損失無法回收 |
| 根據 prompt 猜難度 | 難度必須有 rubric（見 [05.1](05-content-pipeline.md#51-難度-r1r6-正式-rubric)） |

## 8.5 手寫辨識與筆跡回放

長期功能，排在最後，但資料要**現在就開始存**。

- 草稿筆畫已可在 canvas 取得（`renderScratchboard` 已存在）。
  [02.6](02-data-model.md#26-indexeddb草稿與大型資料) 定義了 IndexedDB 儲存格式，
  含時間戳 `[x, y, pressure, t]` — **有 t 就能回放**。
- **階段 1（P3）**：純儲存與回放。「重做這題時看上次的草稿」已經很有價值，零 ML。
- **階段 2（P6）**：離線筆跡辨識（MathPix 類 API 或 onnxruntime-web 小模型），
  把手寫轉成 LaTeX 填入答案框。**必須可關閉**，且辨識失敗要能無痛改回鍵盤輸入。
- **階段 3（研究性）**：從筆跡時序找出「出錯步驟」。需要對照正確解法的步驟結構
  （`solutionSteps`），把學生每一行對齊到某一步。這是真正的難題，不承諾時程。

## 8.6 商業模式

### 永遠免費的部分

核心練習迴圈：題庫、每日訓練、錯題本、SRS、能力雷達、匯出。
**免費版必須是一個完整可用的產品。** 付費解鎖的是「更多」，不是「能用」。

### Buzz Pro（跨科訂閱）

| 功能 | 免費 | Pro |
| --- | --- | --- |
| 題庫與練習 | 全部 | 全部 |
| 能力雷達 / 弱點分析 | ✓ | ✓ |
| 跨裝置同步 | 手動匯出匯入 | 自動 |
| 能力歷史深度 | 30 天 | 無限 |
| 考試倒推計畫 | 1 個 | 無限 |
| 詳細診斷（PA/UA、象限、信心校準、錯因趨勢） | 摘要 | 完整 |
| 跨科弱點連結 | — | ✓ |
| 自訂題包 | 3 個 | 無限 |
| 班級（教師） | — | ✓ |
| 賽季徽章 | 參加 | 參加 + 專屬 |

### 其他方案

- **Exam Pass**：考前 14 天單次購買，解鎖 Pro 全功能 14 天。
  價格約月費的 60%。這是最貼近學生行為的方案（考前才願意付錢）。
- **學生優惠**：學生信箱驗證 5 折。
- **經濟困難免費名額**：每月固定名額，簡單申請表，不查證。**寫進條款並公開名額數。**
- **教師方案**：一位老師 + 一個班（40 人）打包價。

### 定價原則

- 對標學生一週的飲料錢，不對標線上課程。
- 不做 dark pattern：不預設年繳、不隱藏取消入口、取消後資料保留 12 個月。

## 8.7 國際化

**現況**：介面全中文（繁體），題目 `prompt` 是 LaTeX（語言中立），
`solution` / `hints` / `keyIdea` 是中文。

**做法**：

1. **UI 字串外部化**：`src/i18n/zh-Hant.js` / `en.js`，`t("home.cta")` 形式。
   9122 行 app.js 裡的中文字串是最大工作量 — 用 script 半自動抽取。
2. **題目內容**：`solution` / `hints` / `keyIdea` 支援 `{ "zh-Hant": "…", "en": "…" }` 物件形式，
   字串形式視為 `zh-Hant`。缺少翻譯時 fallback 到 zh-Hant 並標示。
3. **順序**：先做 UI（1407 題的內容翻譯是獨立的長期工作，不擋 UI 上線）。
   英文版首發只翻 UI + R1–R3 題目的解析，足以驗證市場。
4. **數學排版本身不需要翻譯** — 這是這個產品國際化成本遠低於一般教育產品的原因。

domain：`buzz.math` 之類的獨立網域，`/zh` `/en` 路徑分流（不用子網域，避免 localStorage 分家）。
