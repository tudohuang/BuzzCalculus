// 題目模板（build time 展開，不會被瀏覽器載入）
//
// 什麼題目適合做成模板：**練的是動作不是洞察**的那種。
// ∫3x²dx 和 ∫5x⁴dx 要練的是同一件事（次方積分），出十個參數不會讓人學到不同的東西，
// 但會讓人把那個動作練到不用想。這是這個產品的核心主張 ——「反射」。
//
// 什麼題目不適合：需要看出結構的題。Frullani、參數微分、King's property
// 這些題目換個參數就完全是另一題，硬做成模板只會產生一堆看起來像但其實
// 難度天差地遠的東西。
//
// 每個模板的 build 產物都會**逐題跑數值驗算**才寫出去（見 expand_templates.js）。
// 這是模板可以放心大量展開的前提：人不可能檢查一百題，機器可以。

"use strict";

// 參數代入：把 {a} 之類的佔位符換掉。
// 刻意用最笨的字串取代 —— 模板要一眼看得出展開後長什麼樣，
// 一旦引入條件邏輯就會變成另一種「看不出來會產生什麼」的產生器。
module.exports = [
  {
    id: "tmpl-der-power",
    steps: [
          "把式子拆成兩項分別微分：{a}x^{n} 和 −{b}x。",
          "次方律：{a}x^{n} 的導數是 {a}·{n}x^({n}−1)。",
          "一次項 −{b}x 的導數是常數 −{b}。",
          "合起來就是 {a}·{n}x^({n}−1) − {b}。"
    ],
    topic: "derivatives",
    rank: 1,
    answerKind: "expression",
    variable: "x",
    timeLimit: 30,
    tags: ["power-rule", "polynomial"],
    prompt: "\\frac{d}{dx}\\left({a}x^{{n}}-{b}x\\right)",
    answer: "{a}*{n}*x^({n}-1)-{b}",
    solution: "逐項微分：{a}x^{n} 的導數是 {a}·{n}x^({n}−1)，−{b}x 的導數是 −{b}。",
    hints: ["次方律：x^n 的導數是 n·x^(n−1)。", "常數倍不影響微分的形式。", "一次項的導數是常數。"],
    params: [
      { a: 3, b: 4, n: 5 },
      { a: 2, b: 7, n: 6 },
      { a: 6, b: 5, n: 3 },
      { a: 4, b: 9, n: 7 },
      { a: 8, b: 3, n: 4 }
    ]
  },
  {
    id: "tmpl-int-power",
    steps: [
          "係數 {a} 提到積分外面。",
          "次方積分：∫x^{n} dx = x^({n}+1)/({n}+1)。",
          "乘回係數：{a}x^({n}+1)/({n}+1)。",
          "不定積分的 +C 這裡可以省略，判分會檢查是否只差一個常數。"
    ],
    topic: "integrals",
    rank: 1,
    answerKind: "antiderivative",
    variable: "x",
    timeLimit: 30,
    tags: ["power-rule", "basic-integral"],
    prompt: "\\int {a}x^{{n}}\\,dx",
    answer: "{a}/({n}+1)*x^({n}+1)",
    solution: "次方積分：∫x^n dx = x^(n+1)/(n+1)，再乘上係數 {a}。",
    hints: ["次方加一，再除以新的次方。", "係數提到積分外面。", "+C 可以省略。"],
    params: [
      { a: 6, n: 2 },
      { a: 10, n: 4 },
      { a: 3, n: 5 },
      { a: 12, n: 3 },
      { a: 7, n: 6 }
    ]
  },
  {
    id: "tmpl-int-definite-power",
    steps: [
          "先求反導數：{a}x^({n}+1)/({n}+1)。",
          "用微積分基本定理：F({b}) − F(0)。",
          "下限 0 代進去是 0，所以只剩上限那一項。",
          "答案是 {a}·{b}^({n}+1)/({n}+1)。"
    ],
    topic: "integrals",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 40,
    tags: ["definite-integral", "power-rule", "ftc"],
    prompt: "\\int_0^{{b}} {a}x^{{n}}\\,dx",
    answer: "{a}*{b}^({n}+1)/({n}+1)",
    solution: "反導數是 {a}x^({n}+1)/({n}+1)，代入上下限（下限 0 貢獻 0）。",
    hints: ["先求反導數。", "再用微積分基本定理代入上下限。", "下限是 0，所以只需要算上限。"],
    params: [
      { a: 3, b: 2, n: 2 },
      { a: 4, b: 3, n: 1 },
      { a: 5, b: 2, n: 3 },
      { a: 2, b: 4, n: 2 },
      { a: 6, b: 1, n: 5 }
    ]
  },
  {
    id: "tmpl-lim-trig",
    steps: [
          "認出這是 sin(u)/u 的形式，只是係數不一樣。",
          "把分子分母湊成同一個 u = {a}x：sin({a}x)/({a}x)。",
          "為了湊出分母的 {a}x，整個式子要乘上 {a}/{b}。",
          "sin(u)/u → 1，所以極限是 {a}/{b}。"
    ],
    topic: "limits",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 30,
    tags: ["trig-limit", "standard-limit"],
    prompt: "\\lim_{x \\to 0}\\frac{\\sin({a}x)}{{b}x}",
    answer: "{a}/{b}",
    solution: "sin(u)/u → 1，把式子湊成 ({a}/{b})·sin({a}x)/({a}x)，極限是 {a}/{b}。",
    hints: ["把它湊成 sin(u)/u 的形式。", "分子分母各乘一個常數不影響極限。", "答案是兩個係數的比。"],
    params: [
      { a: 3, b: 2 },
      { a: 5, b: 4 },
      { a: 7, b: 3 },
      { a: 2, b: 9 },
      { a: 6, b: 5 }
    ]
  },
  {
    id: "tmpl-ser-geometric",
    steps: [
          "把通項寫成 {a}·(1/{r})^n，看出這是等比級數。",
          "首項（n=0 那一項）是 {a}，公比是 1/{r}。",
          "公比絕對值小於 1，級數收斂。",
          "和 = 首項/(1−公比) = {a}/(1−1/{r}) = {a}·{r}/({r}−1)。"
    ],
    topic: "series",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 35,
    tags: ["geometric-series"],
    prompt: "\\sum_{n=0}^{\\infty}\\frac{{a}}{{r}^n}",
    answer: "{a}*{r}/({r}-1)",
    solution: "公比 1/{r}，首項 {a}。等比級數和 = 首項/(1−公比) = {a}/(1−1/{r}) = {a}·{r}/({r}−1)。",
    hints: ["這是等比級數。", "公比是 1/{r}，小於 1 所以收斂。", "和 = 首項 / (1 − 公比)。"],
    params: [
      { a: 1, r: 2 },
      { a: 3, r: 4 },
      { a: 2, r: 5 },
      { a: 5, r: 3 },
      { a: 4, r: 6 }
    ]
  },
  {
    id: "tmpl-int-partialfrac",
    steps: [
          "分母是兩個一次式相乘，先做部分分式分解。",
          "1/(x(x+{c})) = (1/{c})·(1/x − 1/(x+{c}))。",
          "積分得 (1/{c})·(ln|x| − ln|x+{c}|) = (1/{c})·ln(x/(x+{c}))。",
          "代入上下限 {p} 到 {q}，兩個對數相減。"
    ],
    topic: "integrals",
    rank: 3,
    answerKind: "numeric",
    timeLimit: 70,
    tags: ["partial-fraction", "definite-integral", "log"],
    prompt: "\\int_{{p}}^{{q}}\\frac{1}{x(x+{c})}\\,dx",
    answer: "(log({q}/({q}+{c}))-log({p}/({p}+{c})))/{c}",
    solution: "部分分式：1/(x(x+{c})) = (1/{c})(1/x − 1/(x+{c}))，積分得 (1/{c})·ln(x/(x+{c}))。",
    hints: ["先做部分分式分解。", "1/(x(x+c)) = (1/c)(1/x − 1/(x+c))。", "兩個對數合併成一個比值的對數。"],
    params: [
      { p: 1, q: 2, c: 1 },
      { p: 1, q: 3, c: 2 },
      { p: 2, q: 4, c: 1 },
      { p: 1, q: 5, c: 3 }
    ]
  },
  {
    id: "tmpl-der-chain-exp",
    steps: [
          "外層是 e^u，內層 u = {a}x^{n}。",
          "鏈鎖律：整個式子的導數是 e^u · u'。",
          "u' = {a}·{n}x^({n}−1)。",
          "所以答案是 {a}·{n}x^({n}−1)·e^({a}x^{n})。"
    ],
    topic: "derivatives",
    rank: 2,
    answerKind: "expression",
    variable: "x",
    timeLimit: 40,
    tags: ["chain-rule", "exponential"],
    prompt: "\\frac{d}{dx}e^{{a}x^{{n}}}",
    answer: "{a}*{n}*x^({n}-1)*exp({a}*x^{n})",
    solution: "鏈鎖律：外層 e^u 的導數還是 e^u，內層 {a}x^{n} 的導數是 {a}·{n}x^({n}−1)。",
    hints: ["外層是 e^u。", "e^u 微分後還是 e^u，再乘 u'。", "u = {a}x^{n}。"],
    params: [
      { a: 2, n: 2 },
      { a: 3, n: 3 },
      { a: 5, n: 2 },
      { a: 1, n: 4 },
      { a: 4, n: 3 }
    ]
  },
  {
    id: "tmpl-lim-direct",
    topic: "limits",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 20,
    tags: ["direct-substitution"],
    prompt: "\\lim_{x \\to {a}}\\left({b}x+{c}\\right)",
    answer: "{b}*{a}+{c}",
    solution: "多項式在每一點都連續，直接代入 x={a}：{b}·{a}+{c}。",
    steps: [
      "多項式函數處處連續。",
      "連續的地方，極限就等於函數值。",
      "直接把 x={a} 代進去。"
    ],
    hints: ["多項式是連續的。", "連續就可以直接代入。"],
    params: [
      { a: 3, b: 2, c: 1 },
      { a: 2, b: 5, c: 4 },
      { a: 4, b: 3, c: 7 },
      { a: 5, b: 2, c: 9 },
      { a: 1, b: 8, c: 3 },
      { a: 6, b: 4, c: 2 }
    ]
  },
  {
    id: "tmpl-lim-factor",
    topic: "limits",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 25,
    tags: ["factoring"],
    prompt: "\\lim_{x \\to {a}}\\frac{x^2-{aa}}{x-{a}}",
    answer: "2*{a}",
    solution: "分子是平方差 (x−{a})(x+{a})，約掉 (x−{a}) 之後代入得 2·{a}。",
    steps: [
      "直接代入會得到 0/0，不能用。",
      "分子做平方差分解：x²−{aa} = (x−{a})(x+{a})。",
      "約掉共同的 (x−{a})。",
      "剩下 x+{a}，代入 x={a} 得 2·{a}。"
    ],
    hints: ["先看分子能不能分解。", "平方差公式。", "約掉之後就可以直接代入。"],
    params: [
      { a: 2, aa: 4 },
      { a: 3, aa: 9 },
      { a: 5, aa: 25 },
      { a: 4, aa: 16 },
      { a: 6, aa: 36 },
      { a: 7, aa: 49 }
    ]
  },
  {
    id: "tmpl-lim-rational",
    topic: "limits",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 25,
    tags: ["rational-limit"],
    prompt: "\\lim_{x \\to \\infty}\\frac{{a}x+{b}}{{c}x+{d}}",
    answer: "{a}/{c}",
    solution: "分子分母同除以 x，常數項都趨近 0，剩下最高次項係數比 {a}/{c}。",
    steps: [
      "分子分母同除以 x。",
      "得到 ({a}+{b}/x)/({c}+{d}/x)。",
      "x→∞ 時 {b}/x 和 {d}/x 都趨近 0。",
      "剩下 {a}/{c}。"
    ],
    hints: ["分子分母同除以最高次的 x。", "常數除以 x 會趨近 0。"],
    params: [
      { a: 3, b: 1, c: 2, d: 5 },
      { a: 5, b: 2, c: 4, d: 1 },
      { a: 7, b: 3, c: 3, d: 2 },
      { a: 2, b: 9, c: 5, d: 4 },
      { a: 6, b: 1, c: 4, d: 7 },
      { a: 9, b: 2, c: 6, d: 5 }
    ]
  },
  {
    id: "tmpl-der-exp",
    topic: "derivatives",
    rank: 1,
    answerKind: "expression",
    variable: "x",
    timeLimit: 20,
    tags: ["chain-rule", "exponential"],
    prompt: "\\frac{d}{dx}e^{{a}x}",
    answer: "{a}*exp({a}*x)",
    solution: "e^{ax} 的導數還是 e^{ax}，再乘上內層 {a}x 的導數 {a}。",
    steps: [
      "外層是 e^u，它的導數還是 e^u。",
      "內層 u={a}x，導數是 {a}。",
      "相乘得 {a}·e^({a}x)。"
    ],
    hints: ["e 的指數函數微分後還是自己。", "別忘了乘內層的導數。"],
    params: [
      { a: 2 }, { a: 3 }, { a: 5 }, { a: 4 }, { a: 7 }, { a: 6 }
    ]
  },
  {
    id: "tmpl-der-sin",
    topic: "derivatives",
    rank: 1,
    answerKind: "expression",
    variable: "x",
    timeLimit: 20,
    tags: ["chain-rule", "trig"],
    prompt: "\\frac{d}{dx}\\sin({a}x)",
    answer: "{a}*cos({a}*x)",
    solution: "sin 的導數是 cos，再乘內層 {a}x 的導數 {a}。",
    steps: [
      "sin u 的導數是 cos u。",
      "內層 u={a}x 的導數是 {a}。",
      "相乘得 {a}cos({a}x)。"
    ],
    hints: ["sin 微分變 cos。", "鏈鎖律：乘上內層的導數。"],
    params: [
      { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }
    ]
  },
  {
    id: "tmpl-der-simple-power",
    topic: "derivatives",
    rank: 1,
    answerKind: "expression",
    variable: "x",
    timeLimit: 20,
    tags: ["power-rule"],
    prompt: "\\frac{d}{dx}\\left({a}x^{{n}}\\right)",
    answer: "{a}*{n}*x^({n}-1)",
    solution: "次方律：{a}x^{n} 的導數是 {a}·{n}x^({n}−1)。",
    steps: [
      "次方律：x^n 的導數是 n·x^(n−1)。",
      "常數係數 {a} 直接留著。",
      "得 {a}·{n}x^({n}−1)。"
    ],
    hints: ["次方拉下來當係數，指數減一。"],
    params: [
      { a: 4, n: 3 }, { a: 7, n: 2 }, { a: 5, n: 6 },
      { a: 9, n: 4 }, { a: 3, n: 8 }, { a: 11, n: 5 }
    ]
  },
  {
    id: "tmpl-int-linear",
    topic: "integrals",
    rank: 1,
    answerKind: "numeric",
    timeLimit: 25,
    tags: ["ftc", "basic-integral"],
    prompt: "\\int_0^{{b}}\\left({a}x\\right)dx",
    answer: "{a}*{b}^2/2",
    solution: "反導數是 {a}x²/2，代入上限 {b}（下限 0 貢獻 0）得 {a}·{b}²/2。",
    steps: [
      "先求反導數：{a}x²/2。",
      "代入上限 {b}。",
      "下限 0 代進去是 0。",
      "答案是 {a}·{b}²/2。"
    ],
    hints: ["先求反導數，再代上下限。", "下限是 0，所以只需要算上限。"],
    params: [
      { a: 2, b: 3 }, { a: 4, b: 2 }, { a: 6, b: 5 },
      { a: 3, b: 4 }, { a: 8, b: 3 }, { a: 5, b: 6 }
    ]
  },

  /* ── 2026-09-04 擴充（二十跳之三：題庫從有限走向參數化）────────
     選模板的標準不變：練的是動作不是洞察。參數刻意避開題庫既有的
     具體數值組合（sin4x/sin2x、1/(x+1) 的商律…），detect_duplicates
     會抓漏網之魚。 */

  {
    id: "tmpl-lim-sin-ratio",
    topic: "limits",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 35,
    tags: ["trig-limit", "standard-limit"],
    prompt: "\\lim_{x\\to 0}\\frac{\\sin({a}x)}{\\sin({b}x)}",
    answer: "{a}/{b}",
    solution: "上下各自除以引數湊 sin(u)/u，留下係數比 {a}/{b}。",
    steps: [
      "分子乘除 {a}x、分母乘除 {b}x。",
      "sin({a}x)/({a}x) 與 sin({b}x)/({b}x) 都趨近 1。",
      "剩下 {a}x/{b}x = {a}/{b}。"
    ],
    hints: ["上下都湊 sin(u)/u。", "兩個標準極限都是 1。", "剩下引數的係數比。"],
    params: [
      { a: 3, b: 5 }, { a: 5, b: 2 }, { a: 7, b: 3 },
      { a: 2, b: 9 }, { a: 6, b: 5 }
    ]
  },
  {
    id: "tmpl-lim-cos-square",
    topic: "limits",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 35,
    tags: ["trig-limit", "standard-limit"],
    prompt: "\\lim_{x\\to 0}\\frac{1-\\cos({a}x)}{x^2}",
    answer: "{a}^2/2",
    solution: "1−cos u ≈ u²/2，u={a}x 代入得 {a}²x²/2x² = {a}²/2。",
    steps: [
      "標準極限：(1−cos u)/u² → 1/2。",
      "u = {a}x，所以分子 ≈ {a}²x²/2。",
      "除以 x² 得 {a}²/2。"
    ],
    hints: ["(1−cos u)/u² 的極限是 1/2。", "u={a}x。", "別忘了係數要平方。"],
    params: [
      { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }
    ]
  },
  {
    id: "tmpl-lim-log-ratio",
    topic: "limits",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 35,
    tags: ["standard-limit", "log"],
    prompt: "\\lim_{x\\to 0}\\frac{\\log(1+{a}x)}{\\log(1+{b}x)}",
    answer: "{a}/{b}",
    solution: "log(1+u) ≈ u，上下分別是 {a}x 與 {b}x，比值 {a}/{b}。",
    steps: [
      "log(1+u)/u → 1。",
      "分子 ≈ {a}x、分母 ≈ {b}x。",
      "比值 {a}/{b}。"
    ],
    hints: ["log(1+u) ≈ u。", "上下各自線性化。", "剩下係數比。"],
    params: [
      { a: 2, b: 5 }, { a: 7, b: 2 }, { a: 3, b: 8 }, { a: 9, b: 4 }
    ]
  },
  {
    id: "tmpl-der-prod-xexp",
    topic: "derivatives",
    rank: 2,
    answerKind: "expression",
    variable: "x",
    timeLimit: 50,
    tags: ["product-rule", "exponential"],
    prompt: "\\frac{d}{dx}\\left(x^{{n}}e^{{a}x}\\right)",
    answer: "({n}*x^({n}-1)+{a}*x^{n})*exp({a}*x)",
    solution: "乘積律：{n}x^({n}−1)·e^({a}x) + x^{n}·{a}e^({a}x)，提出 e^({a}x)。",
    steps: [
      "乘積律：(uv)' = u'v + uv'。",
      "u = x^{n} 的導數是 {n}x^({n}−1)。",
      "v = e^({a}x) 的導數是 {a}e^({a}x)。",
      "提出 e^({a}x) 合併。"
    ],
    hints: ["乘積律。", "指數微分帶出 {a}。", "提出 e^({a}x)。"],
    params: [
      { n: 2, a: 3 }, { n: 3, a: 2 }, { n: 4, a: 5 },
      { n: 2, a: 7 }, { n: 5, a: 3 }
    ]
  },
  {
    id: "tmpl-der-quotient-shift",
    topic: "derivatives",
    rank: 2,
    answerKind: "expression",
    variable: "x",
    timeLimit: 45,
    tags: ["quotient-rule"],
    prompt: "\\frac{d}{dx}\\left(\\frac{x}{x+{a}}\\right)",
    answer: "{a}/(x+{a})^2",
    solution: "商律：((x+{a})−x)/(x+{a})² = {a}/(x+{a})²。",
    steps: [
      "商律：(u/v)' = (u'v − uv')/v²。",
      "分子：(x+{a}) − x = {a}。",
      "答案 {a}/(x+{a})²。"
    ],
    hints: ["商律。", "分子會大量相消。", "剩下常數 {a}。"],
    params: [
      { a: 2 }, { a: 3 }, { a: 5 }, { a: 7 }, { a: 4 }
    ]
  },
  {
    id: "tmpl-der-chain-logpoly",
    topic: "derivatives",
    rank: 2,
    answerKind: "expression",
    variable: "x",
    timeLimit: 40,
    tags: ["chain-rule", "log"],
    prompt: "\\frac{d}{dx}\\log\\left(x^2+{a}\\right)",
    answer: "2*x/(x^2+{a})",
    solution: "鏈鎖律：log(u) 的導數是 u'/u，u = x²+{a}。",
    steps: [
      "log(u) 的導數是 u'/u。",
      "u = x²+{a}，u' = 2x。",
      "答案 2x/(x²+{a})。"
    ],
    hints: ["log 的導數是 1/u 乘內層導數。", "內層是 x²+{a}。", "u'=2x。"],
    params: [
      { a: 4 }, { a: 9 }, { a: 3 }, { a: 7 }, { a: 5 }
    ]
  },
  {
    id: "tmpl-int-linear-power",
    topic: "integrals",
    rank: 2,
    answerKind: "antiderivative",
    variable: "x",
    timeLimit: 45,
    tags: ["substitution", "basic-integral"],
    prompt: "\\int \\left({a}x+{b}\\right)^{{n}}\\,dx",
    answer: "({a}*x+{b})^({n}+1)/({a}*({n}+1))",
    solution: "u = {a}x+{b}，du = {a}dx：∫u^{n}du/{a} = u^({n}+1)/({a}({n}+1))。",
    steps: [
      "令 u = {a}x+{b}。",
      "du = {a} dx，補上 1/{a}。",
      "次方積分後代回。"
    ],
    hints: ["線性內層直接換元。", "別忘了除以內層係數 {a}。", "次方加一再除。"],
    params: [
      { a: 2, b: 3, n: 4 }, { a: 3, b: 1, n: 5 }, { a: 5, b: 2, n: 3 },
      { a: 4, b: 7, n: 6 }, { a: 2, b: 5, n: 7 }
    ]
  },
  {
    id: "tmpl-int-exp-def",
    topic: "integrals",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 45,
    tags: ["exponential", "definite-integral"],
    prompt: "\\int_0^{{b}} e^{{a}x}\\,dx",
    answer: "(exp({a}*{b})-1)/{a}",
    solution: "反導數 e^({a}x)/{a}，代上下限得 (e^({a}{b})−1)/{a}。",
    steps: [
      "e^({a}x) 的反導數是 e^({a}x)/{a}。",
      "代上限 {b}、下限 0。",
      "(e^({a}{b})−1)/{a}。"
    ],
    hints: ["指數積分除以內層係數。", "下限 0 給 1。", "別忘了除以 {a}。"],
    params: [
      { a: 3, b: 1 }, { a: 2, b: 2 }, { a: 4, b: 1 }, { a: 5, b: 1 }, { a: 2, b: 3 }
    ]
  },
  {
    id: "tmpl-int-usub-poly",
    topic: "integrals",
    rank: 2,
    answerKind: "antiderivative",
    variable: "x",
    timeLimit: 50,
    tags: ["substitution", "u-sub"],
    prompt: "\\int x\\left(x^2+{a}\\right)^{{n}}\\,dx",
    answer: "(x^2+{a})^({n}+1)/(2*({n}+1))",
    solution: "u = x²+{a}，du = 2x dx：∫u^{n}du/2 = u^({n}+1)/(2({n}+1))。",
    steps: [
      "內層 x²+{a} 的導數 2x 就在外面。",
      "u 換元，補 1/2。",
      "次方積分後代回。"
    ],
    hints: ["找內層。", "du = 2x dx。", "補上 1/2。"],
    params: [
      { a: 1, n: 3 }, { a: 4, n: 4 }, { a: 2, n: 5 }, { a: 5, n: 2 }, { a: 3, n: 6 }
    ]
  },
  {
    id: "tmpl-int-sin-def",
    topic: "integrals",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 45,
    tags: ["trig", "definite-integral"],
    prompt: "\\int_0^{\\pi} \\sin({n}x)\\,dx",
    answer: "2/{n}",
    solution: "反導數 −cos({n}x)/{n}；{n} 為奇數時 cos({n}π) = −1，差值是 2/{n}。",
    steps: [
      "反導數是 −cos({n}x)/{n}。",
      "cos({n}π) = −1（{n} 是奇數）。",
      "(−(−1)+1)/{n} = 2/{n}。"
    ],
    hints: ["sin 積成 −cos，除以內層係數。", "想 cos({n}π) 是多少。", "奇數的 {n} 給 −1。"],
    params: [
      { n: 3 }, { n: 5 }, { n: 7 }, { n: 9 }
    ]
  },
  {
    id: "tmpl-ser-geo-tail",
    topic: "series",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 45,
    tags: ["geometric-series"],
    prompt: "\\sum_{n=2}^{\\infty}\\left(\\frac{1}{{r}}\\right)^n",
    answer: "1/({r}*({r}-1))",
    solution: "首項 1/{r}²、公比 1/{r}：(1/{r}²)/(1−1/{r}) = 1/({r}({r}−1))。",
    steps: [
      "從 n=2 起，首項是 1/{r}²。",
      "幾何和 = 首項/(1−公比)。",
      "化簡得 1/({r}({r}−1))。"
    ],
    hints: ["注意起點是 n=2。", "首項/(1−公比)。", "把複合分數化簡。"],
    params: [
      { r: 2 }, { r: 4 }, { r: 5 }, { r: 6 }
    ]
  },
  {
    id: "tmpl-ser-radius-geo",
    topic: "series",
    rank: 2,
    answerKind: "numeric",
    timeLimit: 40,
    tags: ["power-series", "ratio-test"],
    prompt: "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{x^n}{{r}^n}",
    answer: "{r}",
    solution: "比值判別：|x|/{r} < 1，半徑 {r}。",
    steps: [
      "相鄰項比值是 |x|/{r}。",
      "要小於 1。",
      "半徑 R = {r}。"
    ],
    hints: ["比值判別。", "幾何部分決定半徑。", "R = {r}。"],
    params: [
      { r: 3 }, { r: 5 }, { r: 6 }, { r: 7 }
    ]
  },
  {
    id: "tmpl-ser-arith-geo",
    topic: "series",
    rank: 3,
    answerKind: "numeric",
    timeLimit: 70,
    tags: ["power-series"],
    prompt: "\\sum_{n=1}^{\\infty}\\frac{n}{{r}^n}",
    answer: "{r}/(({r}-1)^2)",
    solution: "Σn xⁿ = x/(1−x)²，代 x=1/{r} 化簡得 {r}/({r}−1)²。",
    steps: [
      "Σn xⁿ 的閉式是 x/(1−x)²。",
      "代 x = 1/{r}。",
      "上下同乘 {r}² 化簡。"
    ],
    hints: ["對幾何級數微分。", "x/(1−x)²。", "代 x=1/{r} 再化簡。"],
    params: [
      { r: 6 }, { r: 7 }, { r: 8 }, { r: 9 }, { r: 10 }
    ]
  }
];