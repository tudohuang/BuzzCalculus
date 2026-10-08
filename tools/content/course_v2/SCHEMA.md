# 新版課程：資料格式與寫作規則

每一課一個檔案：`tools/content/course_v2/lessons/<id>.json`，id 必須在 `OUTLINE.md` 裡。
寫完跑 `node tools/validate_course_v2.js`（只檢查某幾課：`node tools/validate_course_v2.js <id> <id> …`），要零錯誤。
`node tools/render_course_v2.js` 把全部課程輸出成給人讀的純文字。

範本：`lessons/limit-rationalize.json`（照它的格式與密度寫）。
參考讀物：`docs/report/course-review/新版課程樣稿.txt`（v0.8 樣稿，五課；review 認可的版本）。

## 欄位

```jsonc
{
  "id": "limit-rationalize",            // 穩定 id，跟 OUTLINE 一致
  "title": "0/0：有理化",                // 跟 OUTLINE 一致（不含課號）
  "readMinutes": 9,                      // 只讀觀念與範例的時間
  "totalMinutes": 35,                    // 加上小測與推薦題的完成時間（通常 20–40）
  "prerequisites": ["limit-factor"],     // OUTLINE 裡的 id；建議已學，不鎖課
  "next": ["limit-algebra-other"],
  "related": ["limit-at-infinity"],      // 正文用〈課名〉提到的其他課，全部列在這
  "objectives": ["…", "…", "…"],         // 2–4 條，學生做得到的事
  "visual": "一句到一段話描述動態圖" | null,   // 不需要動態圖就 null；只在真的有教學價值時寫
  "concept": [
    { "heading": "① 因式分解不夠用的時候",
      "body": ["段落一", "段落二"],        // 純文字；數學用 Unicode（√、²、→、∞、π、∫、Σ…）
      "tex": ["\\frac{…}{…}"],             // 可選：需要排版的獨立算式（KaTeX 要能渲染）
      "collapsible": false }               // true = 預設收起（完整定理條件、嚴格證明、預告）
  ],
  "workedExamples": [                    // 2–4 題
    { "title": "根號在分子",
      "prompt": "lim_{x→0} (√(x + 9) − 3)/x",
      "problemId": "cx-lim-005",           // 可選：範例就是題庫題時填
      "steps": ["步驟一", "步驟二", "…"],
      "answer": "1/6",
      "note": "可選的一句補充",
      "claim": "LIM((sqrt(x+9)-3)/x, 0) == 1/6",   // 機器驗算（見下），或 null
      "claimNote": "claim 為 null 時必填：為什麼驗不了" }
  ],
  "pitfalls": ["短句", "…"],            // 3–5 條
  "checks": [                            // 小測 4 題
    { "ask": "…",
      "options": [
        { "label": "正解", "correct": true },
        { "label": "錯誤選項", "why": "為什麼錯（選錯才顯示）" } ] }
  ],
  "skillTags": {
    "coarse": ["rationalize"],           // 題庫已有的 tag（驗證器會查）
    "fine": ["rationalize-conjugate"]    // 新的細標籤：<粗主題>-<可診斷的技能>，kebab-case
  },
  "practice": [                          // 推薦題，由易到難
    { "id": "rel-basic-005", "core": true, "trains": "rationalize-conjugate" },
    { "id": "lx-hard-001", "challenge": true, "trains": "rationalize-conjugate", "note": "挑戰：…" }
  ],
  "gaps": [                              // 題庫缺口：這課需要但題庫沒有的題
    { "tag": "limit-table-estimate", "count": 2, "note": "R1–R2 讀表估極限" }
  ]
}
```

## 圖（figures，可選，每課最多 4 張）

`visual` 是給作者的文字規格；真正上畫面的是 `figures`。一張圖要嘛是靜態的 `graph`，要嘛是一個 `widget`（一根滑桿）。
只在圖真的有教學價值時放；不動滑桿時就要是一張看得懂的靜態圖。

```jsonc
"figures": [
  { "caption": "x = 1 挖了洞，兩側都往 2 擠",   // 必填，一行（≤ 28 字最好，> 40 擋）
    "after": 0,                                // 放在第幾段觀念之後（0 起算；預設 0）；"examples" = 範例區最後
    "graph": {                                 // 靜態圖：跟題目附圖同一個格式，同一支 renderProblemGraph 畫
      "window": [-1, 3, -1, 4],                // [xmin, xmax, ymin, ymax]
      "equal": true,                           // 可選：x、y 同比例（極座標）
      "curves": [ { "expr": "x+1", "domain": [-1, 3], "color": "blue" },      // color：blue red green violet gold muted ink
                  { "param": { "x": "cos(t)", "y": "sin(t)", "t": [0, 6.2832] } },
                  { "polar": { "r": "1+cos(t)", "t": [0, 6.2832] }, "dashed": true } ],
      "fills":  [ { "expr": "x^2", "from": 0, "to": 1, "color": "red" },     // 曲線與 x 軸之間；expr2 = 兩條曲線之間；polar = 扇形區域
                  { "pts": [[0,0],[1,0],[1,1]] } ],
      "dashed": [ [[1, -1], [1, 4]] ],         // 虛線（漸近線、輔助線）
      "points": [ { "x": 1, "y": 2, "open": true } ],                       // open = 空心（洞）
      "labels": [ { "x": 1.1, "y": 2.2, "text": "(1, 2)", "anchor": "start" } ],
      "arrows": [ { "from": [0, 2], "to": [0.9, 2], "color": "green" } ] } },
  { "caption": "Q 滑向 P，割線轉成切線",
    "widget": { "type": "secant-tangent", "f": "x^2", "a": 1, "h": [0.05, 1.5], "window": [-1, 3, -1, 6] } }
]
```

式子是**畫圖用的 JS 語法**（`x^2`、`sqrt(x)`、`exp(x)`、`log(x)` 是自然對數、`abs`、`sin`、`PI`），不是 LaTeX；只能用 x（參數曲線、極座標用 t）。
分段函數寫成 `[{ "expr": "x+1", "domain": [-1, 2] }, { "expr": "4", "domain": [2, 4] }]`（secant-tangent／approach／riemann／taylor 的 f 可以分段）。

widget（每一種都有 `window`；`value` 可選 = 不動滑桿時的那一格；`extra` 可選 = 疊上去的靜態 curves／points／labels／dashed／fills／arrows）：

| type | 滑桿 | 其他參數 |
|---|---|---|
| `secant-tangent` | h ∈ `h:[min,max]`（預設 max） | `f`、`a`；`tangent: false` 不畫切線 |
| `riemann` | n ∈ `n:[min,max]`（整數，預設 4） | `f`、`a`、`b`、`rule`: left／right／mid；讀數有矩形和與積分值 |
| `taylor` | 階數 ∈ `order:[min,max]` | `f`、`center`、`coeffs`（c₀, c₁, …，可寫 "1/6"；驗證器拿數值導數對前 5 個）、`probe`（可選：讀數顯示這一點的值） |
| `epsilon-delta` | `drive: "eps"`（預設：拖 ε，δ 自動取可用的）或 `"delta"`（拖 δ，`eps` 固定），範圍 `range` | `f`、`at`、`limit`、`hole` |
| `family` | 參數 `param`（預設 a）∈ `range` | `f`（含參數）、`trail`（淡淡畫出的其他參數值）、`area: [from, to]`（塗色並讀面積，to 可以超出窗） |
| `accumulation` | x ∈ `range` | `f`、`a`、`windowA`（下半張 A(x) 的窗）；上下兩張圖：f 與塗色、A(x) 與它在 x 的切線 |
| `zoom` | 10 的 0 到 `levels` 次方 | `curves`（同 graph.curves）、`center: [x, y]`、`out: true` = 拉遠、`axes: "x"` = 只縮放 x、`yPower: 2` = y 用倍率的平方縮（x² 型的曲線放大後形狀不變） |
| `approach` | 「靠近」：距離從 `range[1]` 縮到 `range[0]` | `f`、`a`、`side`: both／left／right |

驗證器會擋：式子編譯不了、曲線取樣點在窗內 < 60%、widget 缺參數或範圍反了、滑桿兩端建不出圖或讀數壞掉、Taylor 係數不對、ε-δ 的 f 不靠近 limit、caption 空的或太長、超過 4 張。
圖裡的關鍵數值（洞的位置、漸近線、切線斜率）寫之前一樣先用 node 算過。

通過條件不寫在課裡，全站統一：完成＝小測答對 ≥ 3；熟練＝core 題全對；全破＝全部 practice 全對。不鎖課。

## 機器驗算（claim）

每題範例盡量帶一條 `claim`，驗證器會實際算。寫法跟答案欄一樣（`3x^2`、`sqrt(x)`、`ln(x)`、`e^x`、`pi`、`x^(1/3)` 代替 cbrt），另外有：
`D(f)`、`D(f, a)`、`D2(f)`、`INT(f, a, b)`（a、b 可以是 `inf`、`-inf`）、`LIM(f, a)`（`inf`、`0+`、`2-`）、`SUM(f, n0)`、`SUB(f, a)`。
比較用 `==`、`~=`（差一個常數，不定積分用）、`<`、`>`。一題可以有多條，用 ` ;; ` 分開。
例：
- `LIM((sqrt(x+9)-3)/x, 0) == 1/6`
- `D((2/9)*(1+x^3)^(3/2)) == x^2*sqrt(1+x^3)`
- `INT(x^4*e^(-3x), 0, inf) == 8/81`
- `SUM(1/(n*(n+1)), 1) == 1`
注意（實際踩過的）：
- `LIM` 永遠對 **x** 取極限。題目用別的變數（n、t、h）時，claim 裡改寫成 x；同時出現兩個自由變數會安靜地算錯，不要這樣寫。
- 收斂很慢的極限（如 x^x 在 0⁺）、極限是 ±∞、某些可去點的雙側 LIM 算不出來 → 改驗化簡後的式子，或 claim 為 null。
- 巢狀 D2 數值誤差大（81 會算成 80.78），二階導數用 D2(f, a) 直接取值，不要 D(D(f))。
- heading 不要自己寫「【可折疊】」，設 collapsible: true 就好。
驗不了（證明、概念判斷、多變數向量場、複變、測度……）就 `"claim": null` 並寫 `claimNote`。但凡能驗的一定要驗。

另外：範例與小測裡出現的每一個數字，寫的時候都要自己用 node 算過一次（`node -e` 就夠）。

## 寫作規則（review 的要求，全部必守）

1. **教學順序**：直觀 → 圖像 → 人話 → 公式 → 計算 → 嚴格化。新手先拿到「怎麼做」，想知道為什麼的人再展開。
2. **不跳步**：作者覺得顯然的地方要寫出來（例：√(x² + 4x) = x√(1 + 4/x) 要先說 x > 0、√(x²) = |x|）。
3. **直覺與證明分開**：直覺說明要標「直覺，不是證明」，並說它漏了什麼；嚴格證明放 `collapsible: true`，而且不能偷步（例：柯西均值定理給的是 (f(x) − f(a))/(g(x) − g(a))，要先有 f(a) = g(a) = 0）。
4. **用詞精確**：不說「不能積分」，說「沒有初等反導函數」；不說「s > 0 才有定義」，說「此積分表示式在 s > 0 時收斂」；「共軛」只用在平方根有理化與共軛複數（立方根不叫共軛）。
5. **不寫課號**：正文提到其他課寫〈課名〉（OUTLINE 裡的課名），id 放進 `related`。
6. **長度**（驗證器的算法：去掉空白、不含 TeX）：預設顯示的觀念段落約 350–800 字；整課約 1,500–2,600 字（範本 limit-rationalize 是 1,612）。不要靠加字解決問題。
7. **小測**：每題 3 個選項、只有一個正解；每個錯誤選項都要有 `why`，而且 why 要說「你是怎麼錯到這裡的」，不是只說「錯」。
8. **推薦題**：只能用題庫裡存在的題號，優先用已通過獨立驗算的題（驗證器會標出未驗算的）。題目要真的練到本課，不夠就寫進 `gaps`，不要拿不相干的題充數。用 `node tools/find_course_problems.js <關鍵字或 tag>` 找題。
9. **語言**：台灣繁體中文；數學名詞照台灣大學課本（極限、導數、反導函數、瑕積分、收斂半徑……）。不出現任何學校名稱、不出現「Putnam」（要說就寫「競賽」）、不寫付費相關字眼。
10. **語氣**：講給一個聰明但第一次學的人聽。不寫口號、不寫「讓我們一起」、不用 emoji。
11. **支線階段**（Stage 11、12）可以假設學生走完主線，但先修一樣要寫清楚。
