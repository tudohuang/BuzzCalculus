# 05 — 內容工業化：rubric、驗證、去重、來源、變體

> **P3 實作現況（2026-08-16，已上線）**
>
> | 項目 | 狀態 | 數字 |
> | --- | --- | --- |
> | 答案獨立數值驗算 | ✅ | 712/1420 可驗證（50.1%），**不符 0** |
> | 永久題號 uid | ✅ | 1456 筆（含 36 個已下架保留） |
> | rubric 三軸 | ✅ | 1420 題，rank 完全不變 |
> | origin 來源聲明 | ✅ | 1420 題，135 題 inspired |
> | 重複偵測 | ✅ | 字面 0 組（已移除 34 題），語意 37 組待複核 |
> | 判分器強化 | ✅ | 定義域取樣 + `set` / `interval` 兩種新題型 |
> | 模板變體管線 | ✅ | 7 模板 → 32 題，逐題驗算才寫出 |
> | 難度校準包匯出 | ✅ | opt-in、去識別化、零後端 |
> | 草稿保存 | ✅ | IndexedDB，重做錯題時看得到上次的手寫 |
> | 結構化解題步驟 | ⚠️ 3.0% | 機制完成，內容待人工補 |
> | 第二層提示 | ⚠️ 52.9% | 同上 |

題庫是這個產品唯一無法被複製的資產。**答案錯一題造成的信任損失，大於新增 50 題的收益。**

## 5.1 難度 R1–R6 正式 Rubric

> **已上線，而且 rubric 現在是 rank 的唯一來源。**
>
> `src/kernel/rubric.js` 存 1459 題的三軸與公式；
> `problem_difficulty_calibration.js` 直接讀它，舊的標籤地板退居 fallback。
> `tools/lib/rubric_rank.js` 改成轉發給 kernel —— 公式只能有一份，
> 不然畫面上寫 R5、難度說明頁按三軸算出 R3，兩邊互相打臉。
>
> ### 為什麼原本的難度是壞的
>
> 舊演算法是 `MIN_RANK_BY_TAG` 標籤地板，而地板**只會抬不會降**：
>
> - 任何帶 `multivariable` 的題自動 ≥R4，∫₀¹∫₀¹(x+y)dydx 也不例外
> - 任何帶 `complex` 的題自動 ≥R5，於是 `|1+i|` 是 R6
> - 名字叫「高速反射包」的 226 題有 **96% 是 R5+**
> - `∫x³/√(1+x²)dx` 這種標準 u-substitution 被標成 R6
>
> ### 關鍵發現：tier ≠ obscurity
>
> 第一版重推直接拿 skill graph 的 `tier` 當冷門度，結果更糟。
> 因為 **tier 是前置深度**（偏導數在 DAG 上很深，因為它前面要先有鏈鎖律），
> 而 **obscurity 是課本教不教**（偏導數是課本必教）。兩者混用，
> 二重積分這種送分題就會被推到 R5。
>
> 現在 77 個技巧節點各自帶一個 `obscurity` 值，逐一按 spec 的定義判斷：
> 41 個是 1（u-sub、鏈鎖律、L'Hôpital、偏導、二重積分…）、
> 26 個是 2（三角代換、King's、Wallis、Beta/Gamma、Jacobian…）、
> 10 個是 3（Frullani、參數微分、留數、Dirichlet、Euler 和…）。
> **這 77 個判斷是整套難度唯一有人工背書的地方**，也是它可以被爭論的地方 ——
> 要改難度，就是去改那 77 個數字，或改某一題的三軸。
>
> ### 另外兩軸怎麼推
>
> | 軸 | 訊號 | 為什麼不用別的 |
> | --- | --- | --- |
> | Steps | 需要幾個不同技巧 + 題幹有沒有巢狀運算子 | **不用提示條數**：三條提示是這個題庫的標準格式，作者不管題目多簡單都寫三條 |
> | Load | 題幹 token 數 + **答案 token 數** + 技巧是否需要動筆 | **不用 timeLimit**：它跟 rank 一樣是作者估的，用它會把同一份偏誤再吃一次 |
>
> 答案長度是後來才想到、但最有效的一個訊號：
> ∫x²/(1+x⁶)dx 的答案是 `arctan(x³)/3`，∫x⁷/(1+x²)dx 的答案是
> `x⁶/6−x⁴/4+x²/2−log(1+x²)/2`。兩題的題幹幾乎一樣長、技巧標籤也都是 u-sub，
> 但後者要先做多項式除法。只看題幹分不出來，看答案一目了然。
>
> ### 修正後的分佈
>
> | | R1 | R2 | R3 | R4 | R5 | R6 |
> | --- | --- | --- | --- | --- | --- | --- |
> | 舊演算法 | 7.3% | 10.9% | 12.4% | 17.1% | 20.8% | **31.5%** |
> | 現在 | 8.9% | 21.2% | 23.7% | 28.1% | 12.8% | **5.3%** |
> | 目標 | 8% | 18% | 28% | 28% | 13% | 5% |
>
> 1090 題變動（降 913 / 升 177）。R1 的缺口是靠**新增送分題**補的（7 組模板 39 題），
> 不是靠把難題重新標成簡單 —— 那是兩件完全不同的事。
>
> ### 三條讓這件事不至於變成「為了數字改難度」的規則
>
> 1. **三軸是唯一被儲存的東西，rank 永遠從三軸算。**
>    中途曾經加過兩道「上限」（弱證據時只准改一級、最多降三級），
>    後來發現它們只改了報告裡的 rank、沒改三軸 —— 上線後算出來還是原值。
>    那種上限是假的，已經拿掉。要保守就不要動那一題的三軸。
> 2. **沒有證據就不推翻作者。** 補標表認不出技巧時會退回泛用節點
>    （`integral.basic` 之類），那代表「不知道」不是「很基本」。
>    這種題沿用原判（42 題）。
> 3. **降三級以上的 187 題寫進 `reports/rank-review.json`**。
>    分佈漂亮不代表分對了 —— 隨便亂分也可以湊出漂亮的分佈。
>    真正能檢查的只有一題一題看。
>
> CI 門檻：R5+R6 不得超過 25%（目前 18.1%）。不要求命中目標 ——
> 那會逼人為了數字改難度；只擋整批被無差別調高的退化。
>
> 遷移方式是**反推**而不是重評：枚舉 27 種三軸組合，取能還原現行 rank 的那些，
> 再挑最接近啟發式猜測的一組。`validate_content_metadata.js` 逐題檢查
> 「三軸算出來的 rank == 使用者看到的 rank」——這條不成立的話，
> 畫面上寫 R5、難度說明頁寫 R3，兩邊互相打臉。
>
> **實測難度分佈與目標的落差（這是目前題庫最大的內容問題）：**
>
> | | R1 | R2 | R3 | R4 | R5 | R6 |
> | --- | --- | --- | --- | --- | --- | --- |
> | 現況 | 4.8% | 11.2% | 12.7% | 17.5% | 21.3% | **32.4%** |
> | 目標 | 8% | 18% | 28% | 28% | 13% | **5%** |
>
> R6 超標六倍。這代表題庫對新使用者是勸退的 —— 一個剛開始練的人，
> 隨機抽到的題有三分之一是最難的那級。修正的方式是逐包人工調三軸
> （`REVIEWED` 表要求寫理由），**不是**讓機器重新分配難度。

### 現況

- 作者只填 `difficulty` 1–4（實測分佈 87 / 232 / 324 / 935）。
- R5 / R6 **完全由 `src/problem_difficulty_calibration.js` 的規則推導**：
  `calibratedRank()` 看 tag / id pattern / pack，加上 `LEGACY_OVERRIDES` 逐題硬改，
  載入時 mutate `problem.rank`。
- 結果：難度可解釋性差，且 `difficulty` 4 佔了 59%（等於沒有分辨力）。

### Rubric：三軸打分

| 軸 | 1 分 | 2 分 | 3 分 |
| --- | --- | --- | --- |
| **Steps** 解題步數 | 1–2 步，看到就會 | 3–4 步 | 5 步以上或需要分情況 |
| **Obscurity** 技巧冷門度 | 課本必教（u-sub、鏈鎖） | 課本有但常忘（King's、三角代換） | 需要辨識非標準結構（Frullani、參數微分、留數） |
| **Load** 計算負擔 | 心算可完成 | 需要草稿但直線推進 | 大量代數、易錯、需驗算 |

```text
raw  = Steps + Obscurity + Load          # 3 – 9
rank = 1  if raw <= 3
     = 2  if raw == 4
     = 3  if raw == 5
     = 4  if raw in {6,7}
     = 5  if raw == 8
     = 6  if raw == 9
```

再套兩條 override：

- 任一軸 = 3 且 raw >= 7 → rank 至少 5。
- 需要多個獨立技巧串接（`skills.length >= 3`）→ rank +1（上限 6）。

結果寫進 `problem.rubric`（見 [02.2](02-data-model.md#22-problem-v2-新增欄位)），
`rubric.reason` 必填一句話。**「作者覺得很難」不是理由。**

### 遷移

`tools/backfill_rubric.js`：用現有 `calibratedRank()` 的結果反推初始 rubric 三軸，
確保**遷移當下每一題的 rank 完全不變**（鐵律 3）。之後人工逐 pack 修正。
高優先：R4 的 935 題必須拆開，目標分佈接近 `R1 8% / R2 18% / R3 28% / R4 28% / R5 13% / R6 5%`。

## 5.2 實證校準

> **階段 2（本機統計 + opt-in 匯出）已上線。**
>
> 設定頁 →「幫忙校準難度」。匯出的檔案只有 `uid / rank / n / correct / sec`
> 加上作答者的 `masteryBand`（高／中／低）。
>
> 三個刻意的設計：
>
> 1. **按鈕旁邊就寫清楚檔案裡有什麼**，不是藏在條款裡。
> 2. **「先看內容」按鈕顯示的是真的會被寫進檔案的那份資料**，不是另外寫的描述文字
>    —— 描述文字會跟實作分家，實際內容不會。
> 3. **自訂題一律不匯出**：那些題只有這個人有，題號本身就是識別資訊。
>
> `smoke_app_render.js` 有一段專門驗這件事：欄位白名單、uid 格式、
> 沒有題幹、沒有內部 id、沒有時間戳記、沒有自訂題。
> 隱私是可測的，不是宣稱的。

### 資料來源

三階段，一路可用：

1. **作者自測**（現在就能做）：出題者實測秒數寫進 `timeLimit`。
2. **本機統計**（P2）：`records.problemStats` 已在記每題的作答結果。使用者可 opt-in
   匯出一份**去識別化**的校準包（只有 `uid, rank, correct, sec, masteryBand`），
   在設定頁一鍵複製／下載，作者手動彙整。零後端。
3. **雲端聚合**（P4）：有帳號後自動上報（opt-in）。

### 演算法

對每題彙整 `n`（作答次數）、`p`（正確率）、`medianSec`：

```text
empiricalRank =  1  if p >= 0.92
              =  2  if p >= 0.82
              =  3  if p >= 0.68
              =  4  if p >= 0.45
              =  5  if p >= 0.22
              =  6  if p <  0.22
```

`p` 必須**依作答者程度分層**才有意義：只採計 `masteryBand` 落在該題 authoredRank ±1 的作答，
否則「難題只有強者去做」會讓 p 虛高。`n >= 60`（分層後）才納入。

### 不自動覆寫（重要）

```text
if n >= 200 and |empiricalRank - authoredRank| >= 2:
    flag = "mismatch"     → 進人工複審佇列，不動 rank
elif n >= 60 and |empiricalRank - authoredRank| == 1:
    → 允許自動調整
else:
    → 不動
```

理由：R1–R6 是品牌語言（見 [00](00-north-star.md#p1-難度語言是自有品牌)），
不能因為某週的作答樣本抖動就漂移。**人為一致性 > 統計最優。**

輸出：`tools/calibrate_difficulty.js` 產生 `src/problem_difficulty_calibration.js`
的 `EMPIRICAL_OVERRIDES` 區塊（既有檔案已有 `LEGACY_OVERRIDES` 的先例），
並產出 `reports/calibration_<date>.md` 複審報告。

## 5.3 答案驗證

> **已上線，而且這是 P3 最重要的一項。**
> `tools/verify_answers.js` + `tools/lib/{latex,numeric,verify_engine}.js`，CI 擋不符。
>
> **核心原則：驗算不能重複解題時的推導。**
> 題目寫 ∫₀^{π/2} ln(sin x)dx、答案寫 −π/2·ln2。如果驗算的方式是「再解一次積分」，
> 那只是把同一個可能出錯的推理再跑一遍。這裡的做法是把**題幹的 LaTeX 直接數值積分**
> 得到 −1.0887930451518，再把答案字串求值成 −1.0887930451518，兩邊比對。
> 兩條路徑唯一的共同前提是「有沒有看懂題幹」，而看不懂時解析器會丟例外，
> 不會安靜地算出別的東西。
>
> 不定積分與導數的驗算更漂亮，完全不必解題：
> ∫f dx = F ⟹ 檢查 F′ = f；d/dx f = g ⟹ 檢查 g = f′。
>
> **八條驗算路徑，712 題通過，0 題不符：**
>
> | 路徑 | 題數 | 做法 |
> | --- | --- | --- |
> | `definite-integral` | 268 | 雙指數（tanh-sinh / exp-sinh）數值積分 |
> | `limit` | 123 | 0.8 等比階梯取樣 + Wynn ε 外插 |
> | `antiderivative` | 123 | Ridders 微分答案，比對被積函數 |
> | `derivative` | 79 | 數值微分題幹，比對答案 |
> | `series` | 68 | Euler–Maclaurin / ε 加速 |
> | `series-convergence` | 30 | x=e^u 代換後量冪次（Bertrand 級數可判） |
> | `parameter-integral` | 15 | 掃參數值比對 |
> | `partial` | 6 | 偏導數 |
>
> ### 建這支工具時抓到的兩題真錯誤
>
> - `hc-rad-006`：原始碼寫 `"1+\sin x"`（**單**反斜線），JS 把 `\s` 吃掉，
>   題幹實際渲染成斜體的 `sinx`。改成 `\\sin`。
> - `depth-der-015`：`d/dx arccos((1−x²)/(1+x²))` 的答案 `2/(1+x²)` 只在 x>0 成立，
>   x<0 時要變號。作者的解說裡寫了「For x>0」，但**題幹沒寫** ——
>   學生按題幹作答時，在 x<0 的認知下寫負號才是對的，卻會被判錯。
>   已把定義域寫進題幹，判分器與驗算器都會讀它。
>
> ### 誠實回報比覆蓋率重要
>
> 建這支工具的過程中，最危險的錯誤不是「算不出來」，是「安靜地算出一個錯的值」。
> 實際踩到三次：
>
> 1. `lim (e^x−e^{−x}−2x)/x³` 的正確答案是 1/3，但取樣到 x=1e-8 時分子
>    完全被浮點抵消吃掉，算出來剛好是 0，而且後面幾個取樣點**全都是 0**，
>    看起來像一個非常穩定的極限。→ 改成偵測「相鄰差距回頭變大」就截斷，
>    並要求多個取樣深度的外插互相同意，談不攏就回報算不出來。
> 2. 「部分和是不是有限數」不能用來判發散：Σ1/n 加十萬項也才 12.1。
>    → 改用 x=e^u 代換後量冪次。
> 3. 數值積分 ∫₁₀₀^∞ dx/x 會給出「38」這個有限值，因為雙指數變換的節點
>    最遠只到 x≈4e18。發散的積分在有限截斷下永遠看起來收斂。
>
> 現在的容差取「基準」與「數值方法自己回報的不確定度」兩者的大者 ——
> 方法知道自己有多準，就該讓它說話。

### 現況

`tools/validate_answer_checker.js` 驗判分器，但**沒有獨立驗證答案本身是否正確**。
答案正確性目前靠出題時人工檢查。

BuzzPhysics 已建立更好的做法：每題帶 `verify` 表達式，CI 獨立求值比對。**把它移植過來。**

### 規則

```js
{ answerKind: "numeric", answer: "log(5/2)", verify: "Math.log(5/2)" }
```

`tools/verify_answers.js`：

| answerKind | 驗證方式 |
| --- | --- |
| `numeric` | `eval(verify)` 與 `evaluateExpression(answer)` 比對，相對誤差 < 1e-9 |
| `expression` | 在 12 個隨機取樣點上比對 `verify(x)` 與 `answer(x)` |
| `antiderivative` | 數值微分 `answer` 後與題目被積函數比對（需 `integrand` 欄位） |
| `text` | 無法自動驗證 → 必須人工複審並標 `reviewedBy` |

**強制**：P3 起，任何 PR 新增的題目沒有 `verify`（或 text 型沒有 `reviewedBy`）就擋。
存量 1407 題分批補：優先 R4+ 與 `numeric`（1043 題）。

補充驗證：

- `answer` 必須能被現行 `checkAnswer()` 判為正確（自我一致性）。
- 每題自我判分要通過至少 3 種等價寫法（`1/2` / `0.5` / `2^-1`）。
- `antiderivative` 題的答案加上任意常數後仍須判對。

## 5.4 來源與原創聲明

> **已上線。** `src/kernel/origin.js`（1420 題）+ `validate_content_metadata.js`。
>
> 帶 `school` 欄位的 135 題一律標成 `inspired`，note 寫明
> 「XX 風格的原創題，非該校官方試題」。含糊其辭讓人以為是真題，
> 正是這個欄位要防的事。
>
> 名校詞彙偵測用**大小寫敏感 + 字界**。不這樣做的話，`limit` 裡的 `mit`
> 會讓整個題庫誤報 —— 這個坑實際踩過一次。

### 現況

1498 題有 `source`，但值多半是內部 pack 名（`Buzz core expansion pack`）。
真正外部來源集中在：`東大`(16)、`World university & competition pack 2026`(99)、
`Putnam / hard derivatives / applications pack 2026`(36)、`達摩院風格長題 pack 2026`(33)。

### 規則

每題必須有 `origin.kind`：

| kind | 定義 | UI 標示 | 允許提名校？ |
| --- | --- | --- | --- |
| `original` | Buzz 原創 | 無標示 | — |
| `adapted` | 改編自特定題目（換數字/函數，結構相同） | 「改編」 | 只在題庫詳情，且必須寫 `ref` |
| `inspired` | 靈感來自某考試的風格，題目全新 | 「◯◯風格」 | 只能寫「風格」，**不得暗示是官方題** |
| `public-domain` | 已進公有領域的經典題 | 「經典題」 | 可註明出處 |
| `user-submitted` | 社群投稿 | 作者名 | 依投稿聲明 |

**硬規則**：`inspired` 的題目在任何地方都不得出現「Putnam 第 N 題」「MIT 期中考」這種
會被誤認為官方原題的字樣。文案模板固定為「Putnam 風格」「東大風格」。

`tools/validate_origin.js`（CI）：

1. 每題必有 `origin.kind`（P3 起）。
2. `adapted` 必有 `ref`。
3. `source` / `prompt` / `solution` 中出現名校詞彙（正則表列）時，`origin.kind` 必須是
   `adapted` / `inspired` / `public-domain`，且 `origin.note` 非空。
4. 名校詞彙不得出現在 `prompt`（題幹）中 — 那是最容易被誤解的位置。

### 公開 UI 的名校淡出

- 練習畫面：只顯示 `R4` 徽章與技巧 chip。**不顯示來源。**
- 結算頁：不顯示來源。
- 題庫詳情頁：顯示「來源：東大風格（改編）」。這是唯一出現學校名的地方。
- 題包名稱：`世界名校` → 改名 `國際難題`；`Putnam` pack → `競賽級`；
  `東大 Burst` → `高速反射 R6`。**pack key 不改**（避免破壞分享連結），只改 label。

## 5.5 重複偵測

> **已上線。** `tools/detect_duplicates.js`，三層由嚴到寬。
>
> **語意層用數值指紋，不是字串比對。** ∫₀^∞ x/(x⁴+1)dx 和 ∫₀^∞ x/(1+x⁴)dx
> 是同一題，但編譯出來的 JS 一個是 `(x)/((x**4+1))`、一個是 `(x)/((1+x**4))`。
> 加法可交換這件事，字串比對永遠學不會。改成在五個無理數點上求值取指紋。
>
> **第一次跑就抓到 34 組字面重複，每一組都牽涉核心擴充包（`cx-*`）** ——
> 那個包重造了已經存在的題。已移除那 34 題（uid 保留不回收）。
>
> 重複題的傷害不只是浪費題目名額：能力模型會把同一題算成兩次獨立證據，
> 冷卻機制也會失效（剛做完的題換個 id 立刻又出現）。
>
> **去重之後 `limit.lhopital` 掉到 8 題門檻以下** —— 它原本的題數是靠重複題撐起來的。
> 已補 5 題新的，全部通過獨立驗算。（其中一題補完又跟 `world-008` 撞車，
> 被偵測器抓到，換掉。）
>
> 語意層只報告不擋 CI：它會誤報。∫₀¹∫₀^{1−x}(x+y)dy dx 和 ∫₀¹∫_y¹ x dx dy
> 的內層積分在數學上恆等，指紋因此相同，但兩題要學的東西（積分區域怎麼設）不一樣。
> 讓 CI 自動刪題，錯一次就是永久刪掉一題有價值的內容。

`tools/detect_duplicates.js`：

**指紋 1 — 結構指紋**：把 `prompt` 正規化（移除空白、`\left`/`\right`、統一變數名為 `x`、
數字全部替換為 `#`），取 SHA-1 前 12 碼。完全相同 = 疑似重複。

**指紋 2 — 數值指紋**：把答案在固定樣本點求值，四捨五入到 6 位有效數字。
`(answerKind, 數值指紋, 主要 skill)` 相同 = 疑似重複。

**指紋 3 — 編輯距離**：對同 skill 的題目，正規化後 prompt 的 Levenshtein 相似度 > 0.88 = 疑似重複。

輸出 `reports/duplicates_<date>.md` 分群清單。**不自動刪除**，人工決定
（同一技巧的變體是好事，完全一樣的題目才是問題）。
CI 只在「指紋 1 完全相同」時擋 PR。

## 5.6 參數變體

> **已上線。** `tools/content/templates.js` → `tools/expand_templates.js`
> → `src/problem_generated_pack.js`（7 模板 → 32 題）。
>
> **核心規則：每一題展開之後都要先通過數值驗算，才准寫進輸出檔。**
> 這條規則讓「一個模板生一百題」變成可以接受的事 ——
> 人檢查不了一百題，機器可以，而且每次重新產生都會再檢查一次。
>
> 展開器還會自己避開跟既有題撞車的參數組（實際跳過 2 組）。
> 模板越多、參數越多，撞車只會越常發生，靠人事後發現不是辦法。
>
> 什麼適合做成模板：**練的是動作不是洞察**的那種。∫3x²dx 和 ∫5x⁴dx
> 練的是同一件事。什麼不適合：Frullani、參數微分、King's property ——
> 換個參數就完全是另一題。

需求是「同一技巧無限變體，但不犧牲品質」。

**設計決策：變體在 build time 展開，不在 runtime 生成。**
理由：runtime 生成需要 symbolic backend，會摧毀零後端、離線可用的架構（見 [08.3](08-platform.md#83-symbolic-backend)）。

```js
// src/templates/int_usub_basic.js
{
  templateId: "int.usub.poly-trig",
  skills: ["integral.usub"],
  rubric: { steps: 2, obscurity: 1, load: 1 },
  params: { a: [2,3,4,5], n: [2,3], f: ["sin","cos"] },
  prompt: "\\int {a}{n}x^{{n-1}}\\{f}(x^{{n}})\\,dx",
  answer: "-{a}/{n}*cos(x^{n})",           // f=sin 時
  verify: "…",
  constraints: "a % n !== 0"               // 排除退化情形
}
```

`tools/expand_variants.js`：

1. 笛卡兒積展開，套 `constraints`。
2. 每個變體跑 `verify_answers.js` 的完整驗證。
3. 跑 `detect_duplicates.js` 對既有題庫去重。
4. 每個 template 最多輸出 N 個變體（避免題庫被灌水），依 `n` 隨機取樣但**種子固定**（可重現）。
5. 產出普通的 `src/problem_variants_<template>.js`，與手寫題包完全同格式。

好處：變體題與手寫題在 runtime 沒有任何差別，所有既有驗證器自動適用，離線與 PWA 不受影響。

## 5.7 推導式提示（第二層）

> **已上線。** `tools/lib/hint_facts.js` → `tools/generate_hints.js`
> → `src/kernel/derived_hints.js`（150 條）+ `tools/validate_derived_hints.js`（CI）。
>
> ### 問題
>
> 三層提示的第二層（「關鍵步驟」）有 675 題是空的，畫面上寫「這題沒有」。
> 使用者從第一層（技巧名稱）直接跳到第三層（完整推導）—— 中間那一階不見了，
> 而中間那一階正是「我想自己解出來」的人需要的。
>
> ### 為什麼不是寫罐頭句子
>
> 「先求反導數再代入上下限」對每一題定積分都成立，也就是對每一題都沒用。
> 真正幫得上忙的第一句話是**這一題特有的**：
>
> | 偵測器 | 產出的事實 | 為什麼有用 |
> | --- | --- | --- |
> | `limitForm` | 「直接代入會得到 0/0」 | 學生知道不能硬代 |
> | `kings` | 「f(x)+f(1−x) 恆等於 1」 | 一行就把積分做完 |
> | `ratio` | 「比值在 n=20…120 一路落在 0.38 以下」 | 判別法選好了 |
> | `algImproper` | 「代數型無窮積分，分部積分做不出來」 | 擋掉最常見的死路 |
> | `outer` | 「最外層是商，用商法則」 | 導數題最常見的錯是選錯律 |
>
> ### 唯一能接受的形式：每條提示都帶可重算的 claim
>
> `validate_derived_hints.js` 每次 CI 都把 150 條**重新算一次**。
> 題目改了、事實不成立了，會當場變紅。人檢查不了幾百條提示，機器可以。
>
> 實測有效：把一條 `0/0` 的 claim 竄改成 `inf/inf`，驗證器立刻報
> 「值變了：inf/inf → 0/0」。
>
> ### 開發過程中它產出過一條確定錯誤的提示
>
> 第一版的比值判別看「最後一個取樣點小於 1」就下結論，於是：
>
> > Σ1/n 的比值在 n=160 時是 160/161 = 0.9938 → 「小於 1，收斂」
>
> **而 Σ1/n 是發散的。** 比值極限是 1 的級數（1/n、1/n²、1/(n log n)…）
> 在**任何**有限的 n 都會給出一個小於 1 的數字 —— 取樣再多也不會變好，
> 因為問題不在樣本數，在於「有限的 n 永遠分不出 0.99 和 1」。
>
> 判準因此改成**整個取樣範圍都遠離 1**（≤0.8 或 ≥1.25），那對應到比值判別
> 真正的條件（limsup 明顯小於 1），而不是某一點的值。
> 對抗測試把三個「比值極限是 1」的級數釘住，它們一律不准下結論。
>
> **自信地講錯比不講更糟** —— 使用者照著錯的方向想，卡更久，然後不再相信提示。
>
> ### 邊界
>
> 作者寫的提示永遠優先，機器只在他沒寫時出手；畫面上也會標明
> 「這一條是系統從題目本身算出來的，不是作者寫的」。
> 覆蓋率：作者 53.7% + 機器 10.3% = **64.0%**。剩下的 525 題推不出可驗證的事實，
> 那是人要寫的。

## 5.7 內容審核流程

```text
draft ──作者自檢──> candidate ──CI 全綠──> review ──人工複審──> live
                                                        │
                        回報累積 ────────────────────────┴──> quarantined ──> 修正 / retired
```

`problem.status` 控制。`candidate` 與 `quarantined` 的題目**不進任何抽題池**，
但在題庫頁對作者可見（用 URL 參數 `?draft=1`）。

### 回報與自動暫停

現況 `records.problemReports` 只存在本機，作者看不到。

**P2（零後端）**：回報後產生一段可複製的短碼（`uid + 理由 + 版本`），
引導使用者貼到 GitHub Issue / 表單。低摩擦版本：`mailto:` 預填。

**P4（有後端）**：回報上報 → 聚合 → 達門檻自動 quarantine：

```text
reports >= 5  且  reports / attempts >= 0.02   →  status = "quarantined"
```

quarantine 後：該題退出所有抽題池；已在進行中的 session 保留；
作者收到通知；受影響使用者的該題錯誤紀錄**從精熟度計算中排除**（重要 — 不能因為題目錯而懲罰使用者）。

過渡做法：`src/problem_quarantine.js` 一份手動維護的 uid 清單，隨版本發布。

## 5.8 解析驗證

證明題已有 `tools/verify_proof_claims.js`（數值檢查所有量化宣稱）與 Lean 驗證。
一般題的 `solutionSteps` 也要驗：

- 每個 step 的 `latex` 必須是合法 KaTeX（用 `katex.renderToString` 在 node 下試算）。
- 最後一個 step 的結果必須與 `answer` 數值等價。
- `\text{}` 內不得含數學符號（既有 lint 經驗）。

`tools/validate_solutions.js`，進 CI。

## 5.9 CI 總表

| 驗證器 | 狀態 | 內容 |
| --- | --- | --- |
| `validate_problems.js` | 既有 | 基本欄位、id 唯一 |
| `validate_training_packs.js` | 既有 | pack 不得為空 |
| `validate_path_nodes.js` | 既有 | 主線關卡可抽到題 |
| `validate_answer_checker.js` | 既有 | 判分器行為 |
| `validate_science_gate.js` | 既有 → 改 `validate_subject_gate.js` | 科目不互相污染 |
| `validate_app_shell.js` | 既有 → 擴充 | 無 kernel 時仍能 render |
| `smoke_app_render.js` | 既有 → 擴充 | 每個 view 都能 render |
| `verify_proof_claims.js` | 既有 | 證明的量化宣稱 |
| `verify_lean_proofs.js` | 既有 | Lean 編譯 |
| `validate_asset_manifest.js` | **新** | index.html / sw.js / load_problem_sources 三份清單一致 |
| `verify_answers.js` | **新** | 答案獨立數值驗證 |
| `validate_origin.js` | **新** | 來源聲明完整、名校詞彙合規 |
| `detect_duplicates.js` | **新** | 完全重複擋 PR，疑似重複出報告 |
| `validate_skill_graph.js` | **新** | skill 圖無環、覆蓋率、最小題數 |
| `validate_ability_model.js` | **新** | 能力公式的單調性與邊界 |
| `validate_solutions.js` | **新** | 解析步驟可 render 且結論正確 |
| `validate_kernel_deps.js` | **新** | kernel 依賴單向無環 |
| `test_records_migration.js` | **新** | v1 → v2 不丟資料 |
| `test_kernel.js` | **新** | kernel golden 快照 |

全部維持「零依賴 node script、直接跑、失敗擋部署」的既有風格。
