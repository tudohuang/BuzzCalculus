// 從零開始：給還沒學過微積分的人的九課。
//
// 這個站原本是「把學過的微積分練成直覺」——只有題目，沒有一段教「極限是什麼」的內容。
// 完全初學者打開就被 1994 題淹死。這九課補的是那一層：每課 = 白話概念（幾段，
// 帶一兩個公式）→ 一題逐步示範（用題庫裡驗算過的 R1 題，一步一步揭）→ 概念小測
// （選錯會說為什麼錯）→ 三題導引練習（題庫的 R1 題，不倒數、可看提示）。
//
// 內容原則：
//   - 示範與練習一律指向題庫既有的題（problemId），答案沿用題庫已經驗算過的；
//     tools/validate_course.js 會擋不存在的 id、非 R1 的題、沒有 why 的錯誤選項。
//   - 只講一件事。每課一個新概念，公式最多兩條；技巧（換元、分部）不在這裡。
//   - 用白話，不用「有理式」「同階」這種詞；真的要用就先解釋。

(function () {
  "use strict";

  window.BUZZ_COURSE = [
    {
      id: "c1-limit-meaning",
      unit: "limits",
      title: "第 1 課 · 極限是什麼",
      minutes: 6,
      goal: "看到 lim 就知道它在問什麼：x 靠近某個數的時候，f(x) 靠近什麼。",
      concept: [
        { text: "先不要管定義。想像你有一個函數 f(x) = 2x + 1，我請你把 x 一路往 3 靠：x = 2.9、2.99、2.999……f(x) 就是 6.8、6.98、6.998……它一直往 7 靠。從另一邊 3.1、3.01、3.001 靠過去，f(x) 是 7.2、7.02、7.002，也往 7 靠。" },
        { text: "「x 靠近 3 的時候，f(x) 靠近 7」——這句話就寫成下面這個式子。讀法：x 趨近 3 時，2x + 1 的極限是 7。", tex: "\\lim_{x\\to 3}(2x+1)=7" },
        { text: "為什麼要繞這麼一圈，不直接算 f(3)？因為很多時候 f(3) 根本算不出來（分母是 0），但「靠近的值」還是存在。極限就是專門處理「到不了、但靠得到」的工具——整個微積分都建在它上面。" },
        { text: "最簡單的情況：函數在那個點好好的（多項式都是），極限就是直接把數字代進去。這一課的示範與練習全都是這種。" }
      ],
      worked: {
        problemId: "cx-lim-001",
        steps: [
          { text: "先看這是什麼函數：2x + 1 是一次多項式，在 x = 3 附近沒有任何問題（沒有分母、沒有根號裡的負數）。" },
          { text: "這種函數的極限就是直接代入：把 x = 3 放進去。", tex: "2\\cdot 3+1=7" },
          { text: "所以答案是 7。你也可以用 2.99、3.01 代進去驗證，f(x) 都在 7 附近。", tex: "\\lim_{x\\to 3}(2x+1)=7" }
        ]
      },
      checks: [
        {
          ask: "lim_{x→3} f(x) 這個式子在問什麼？",
          options: [
            { label: "x 靠近 3 的時候，f(x) 靠近哪個數", correct: true },
            { label: "f(3) 是多少", why: "很多時候答案剛好一樣，但極限問的是「靠近」——f(3) 可以不存在，極限照樣有。第 2 課就會遇到。" },
            { label: "f(x) 的最大值", why: "極限跟大小無關，只跟「往哪裡靠」有關。" }
          ]
        }
      ],
      practice: ["tmpl-lim-direct-002", "fd-lim-001", "fd-lim-002"]
    },
    {
      id: "c2-limit-zero-over-zero",
      unit: "limits",
      title: "第 2 課 · 代進去變 0/0 怎麼辦",
      minutes: 7,
      goal: "代入得到 0/0 不是答案，是「先化簡」的訊號。",
      concept: [
        { text: "上一課說「直接代入」。現在試試看 (x² − 4)/(x − 2) 在 x → 2：代入得到 0/0。0/0 不是一個數，這表示函數在 x = 2 這一點根本沒定義——但 x 靠近 2 的時候它還是有值。" },
        { text: "關鍵：x 靠近 2 但不等於 2，所以 x − 2 不是 0，可以放心約掉。分子 x² − 4 = (x − 2)(x + 2)，約掉 (x − 2) 之後剩下 x + 2。", tex: "\\frac{x^2-4}{x-2}=\\frac{(x-2)(x+2)}{x-2}=x+2\\quad(x\\ne 2)" },
        { text: "化簡完再代入：x + 2 在 x = 2 是 4。所以極限是 4，雖然 f(2) 本身不存在。" },
        { text: "口訣：代入 → 得到 0/0 → 因式分解、約掉造成 0 的那個因子 → 再代入。0/0 永遠不是最後答案。" }
      ],
      worked: {
        problemId: "lim-003",
        steps: [
          { text: "先代 x = 2 試試：分子 4 − 4 = 0，分母 2 − 2 = 0。0/0，不能直接代。" },
          { text: "分子是平方差，拆開來。", tex: "x^2-4=(x-2)(x+2)" },
          { text: "x 靠近 2 但不是 2，x − 2 ≠ 0，上下約掉。", tex: "\\frac{(x-2)(x+2)}{x-2}=x+2" },
          { text: "現在可以代了：2 + 2 = 4。", tex: "\\lim_{x\\to 2}\\frac{x^2-4}{x-2}=4" }
        ]
      },
      checks: [
        {
          ask: "代入之後得到 0/0，接下來該？",
          options: [
            { label: "因式分解，約掉讓分母變 0 的因子，再代一次", correct: true },
            { label: "答案就是 0", why: "0/0 不是 0——它什麼都不是。(x²−4)/(x−2) 在 x→2 的答案是 4，不是 0。" },
            { label: "極限不存在", why: "函數在那一點沒定義，跟極限不存在是兩回事。這一課的例子函數在 2 沒定義，極限卻是 4。" }
          ]
        }
      ],
      practice: ["cx-lim-002", "fd-lim-003", "fd-lim-004"]
    },
    {
      id: "c3-limit-infinity",
      unit: "limits",
      title: "第 3 課 · x 跑到無窮遠",
      minutes: 6,
      goal: "x → ∞ 時分數的極限只看分子分母各自的「最高次」。",
      concept: [
        { text: "x → ∞ 的意思是 x 一直變大：100、10000、1000000……問 f(x) 往哪裡靠。看 (3x + 1)/(2x + 5)：x = 1000 時是 3001/2005 ≈ 1.497；x = 1000000 時 ≈ 1.4999。往 3/2 靠。" },
        { text: "為什麼是 3/2？x 很大的時候，+1 跟 +5 根本不重要，分數幾乎就是 3x/2x = 3/2。正式一點的做法：分子分母同除以 x。", tex: "\\frac{3x+1}{2x+5}=\\frac{3+\\frac1x}{2+\\frac5x}\\ \\xrightarrow{x\\to\\infty}\\ \\frac{3+0}{2+0}=\\frac32" },
        { text: "規則：分子分母次數一樣 → 答案是最高次係數的比。分子次數比較低 → 0。分子次數比較高 → 跑到無窮大。" },
        { text: "這一課只練「次數一樣」的。看到 x → ∞，先找兩邊的最高次項，其他都可以先忽略。" }
      ],
      worked: {
        problemId: "lim-004",
        steps: [
          { text: "x → ∞。先找最高次：分子最高次是 3x²，分母最高次是 2x²，次數一樣（都是 2）。" },
          { text: "分子分母同除以 x²，剩下的小項都會跑到 0。", tex: "\\frac{3x^2-x+7}{2x^2+5}=\\frac{3-\\frac1x+\\frac7{x^2}}{2+\\frac5{x^2}}" },
          { text: "x → ∞ 時 1/x、7/x²、5/x² 全部 → 0。", tex: "\\lim_{x\\to\\infty}\\frac{3x^2-x+7}{2x^2+5}=\\frac{3}{2}" }
        ]
      },
      checks: [
        {
          ask: "(5x + 3)/(x − 2) 在 x → ∞ 時靠近？",
          options: [
            { label: "5", correct: true },
            { label: "無窮大", why: "分子分母都是一次，次數一樣，答案是係數比 5/1 = 5，不會跑掉。" },
            { label: "0", why: "只有分子次數比分母低才會是 0；這裡兩邊都是一次。" }
          ]
        }
      ],
      practice: ["cx-lim-003", "fd-lim-007", "fd-lim-008"]
    },
    {
      id: "c4-standard-limits",
      unit: "limits",
      title: "第 4 課 · 兩個要背的極限",
      minutes: 7,
      goal: "sin x / x → 1 與 (e^x − 1)/x → 1，還有怎麼「配」出它們。",
      concept: [
        { text: "有兩個極限沒辦法用前面的方法算，是靠幾何或級數證出來的，微積分裡到處用，直接記起來：", tex: "\\lim_{x\\to 0}\\frac{\\sin x}{x}=1,\\qquad \\lim_{x\\to 0}\\frac{e^x-1}{x}=1" },
        { text: "直覺：x 很小的時候 sin x 幾乎等於 x（0.1 的 sin 是 0.0998），e^x 幾乎等於 1 + x。所以兩個分數都靠近 1。" },
        { text: "真正會考的是「配」：sin(5x)/x 分子裡是 5x，分母卻是 x，對不上。乘一個 5 再除一個 5，把分母也變成 5x。", tex: "\\frac{\\sin(5x)}{x}=5\\cdot\\frac{\\sin(5x)}{5x}\\ \\xrightarrow{x\\to 0}\\ 5\\cdot 1=5" },
        { text: "口訣：sin(ax)/(bx) 的極限是 a/b；(e^{ax} − 1)/(bx) 也是 a/b。裡面是什麼，就配成什麼。" }
      ],
      worked: {
        problemId: "rel-basic-001",
        steps: [
          { text: "代 x = 0 是 0/0，但這不是因式分解能處理的——分子是 sin，要用標準極限。" },
          { text: "分子裡是 5x，把分母也配成 5x：乘 5 除 5。", tex: "\\frac{\\sin(5x)}{x}=5\\cdot\\frac{\\sin(5x)}{5x}" },
          { text: "x → 0 時 5x 也 → 0，所以 sin(5x)/(5x) → 1。", tex: "\\lim_{x\\to 0}\\frac{\\sin(5x)}{x}=5\\cdot 1=5" }
        ]
      },
      checks: [
        {
          ask: "sin(3x)/x 在 x → 0 靠近？",
          options: [
            { label: "3", correct: true },
            { label: "1", why: "要分母也是 3x 才是 1。這裡分母只有 x，配完會多出一個 3。" },
            { label: "0", why: "sin(3x) 跟 x 一起變小，比值不會是 0；它靠近 3。" }
          ]
        }
      ],
      practice: ["cx-lim-004", "tmpl-lim-trig-001", "fd-lim-009"]
    },
    {
      id: "c5-derivative-slope",
      unit: "derivatives",
      title: "第 5 課 · 導數就是斜率",
      minutes: 8,
      goal: "f′(a) 是曲線在 x = a 那一點的切線斜率；它是一個極限。",
      concept: [
        { text: "直線的斜率好算：上升除以前進。曲線呢？在一點上的「斜」——就是切線的斜率。問題是切線只碰一點，一點算不出斜率。" },
        { text: "辦法：先拿兩點。從 x = a 走到 x = a + h，畫一條割線，斜率是 (f(a+h) − f(a))/h。然後讓 h 越來越小，割線就越來越像切線——這又是一個極限。", tex: "f'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}" },
        { text: "這個極限就叫 f 在 a 的導數，記作 f′(a)。意思有三種說法，都一樣：切線斜率、瞬間變化率、f 在那一點「變得多快」。" },
        { text: "算一次就會相信：f(x) = x³ 在 x = 2。割線斜率 ((2+h)³ − 8)/h = (12h + 6h² + h³)/h = 12 + 6h + h²，h → 0 就是 12。之後有公式可以直接算，但定義要看過一次。" }
      ],
      worked: {
        problemId: "rel-basic-007",
        steps: [
          { text: "問的是 x³ 在 x = 2 的導數，也就是切線斜率。先用定義：割線斜率。", tex: "\\frac{(2+h)^3-2^3}{h}" },
          { text: "展開 (2+h)³ = 8 + 12h + 6h² + h³，減 8，除以 h。", tex: "\\frac{12h+6h^2+h^3}{h}=12+6h+h^2" },
          { text: "h → 0，剩下 12。", tex: "\\left.\\frac{d}{dx}x^3\\right|_{x=2}=12" },
          { text: "預告下一課的公式：(x³)′ = 3x²，代 x = 2 也是 12。公式就是把這個極限一次算完。" }
        ]
      },
      checks: [
        {
          ask: "f′(2) = 10 是什麼意思？",
          options: [
            { label: "f 的圖形在 x = 2 那一點的切線斜率是 10", correct: true },
            { label: "f(2) = 10", why: "f(2) 是函數值（高度），f′(2) 是斜率（有多斜）。兩個完全不同。" },
            { label: "曲線在 x = 10 的地方", why: "f′(2) 的 2 是「在哪一點」，10 是「那一點有多斜」。" }
          ]
        }
      ],
      practice: ["cx-der-001", "fd-der-007", "tb-tan-001"]
    },
    {
      id: "c6-derivative-rules",
      unit: "derivatives",
      title: "第 6 課 · 微分公式：不用每次算極限",
      minutes: 7,
      goal: "冪次法則 (xⁿ)′ = n·xⁿ⁻¹，加減與常數倍可以拆開，常數的導數是 0。",
      concept: [
        { text: "上一課的極限對每個函數都算一次太累。數學家算好了幾條公式，最重要的一條：", tex: "\\frac{d}{dx}x^n=n\\,x^{n-1}" },
        { text: "指數搬到前面當係數，指數減 1。x³ → 3x²，x⁵ → 5x⁴，x → 1，常數 7 → 0（常數是平的，斜率當然 0）。" },
        { text: "再加兩條規則就能微分所有多項式：加減可以一項一項做；常數倍留著不動。(x⁵ − 3x² + 7)′ = 5x⁴ − 3·2x + 0 = 5x⁴ − 6x。" },
        { text: "另外三個要記的：(sin x)′ = cos x、(cos x)′ = −sin x、(eˣ)′ = eˣ。這三個加上冪次法則，就是這一課全部的東西。" }
      ],
      worked: {
        problemId: "der-001",
        steps: [
          { text: "三項分開微分：x⁵、−3x²、7。" },
          { text: "x⁵：指數 5 搬前面、指數減 1。", tex: "(x^5)'=5x^4" },
          { text: "−3x²：常數倍 −3 留著，x² 變 2x。", tex: "(-3x^2)'=-3\\cdot 2x=-6x" },
          { text: "常數 7 的導數是 0。加起來。", tex: "\\frac{d}{dx}(x^5-3x^2+7)=5x^4-6x" }
        ]
      },
      checks: [
        {
          ask: "d/dx (4x³) 是？",
          options: [
            { label: "12x²", correct: true },
            { label: "4x²", why: "指數要先搬到前面乘：4 × 3 = 12，再把指數減 1。" },
            { label: "12x³", why: "指數減 1 忘了：x³ 微分後是 x²。" }
          ]
        }
      ],
      practice: ["fd-der-001", "fd-der-002", "tmpl-der-power-001"]
    },
    {
      id: "c7-chain-rule",
      unit: "derivatives",
      title: "第 7 課 · 裡面還有東西：連鎖律",
      minutes: 7,
      goal: "sin(2x)、e^{3x} 這種「外面套裡面」的函數，微分要外面微完再乘裡面的導數。",
      concept: [
        { text: "e^{2x} 不是 eˣ，裡面多了個 2x。直接套 (eˣ)′ = eˣ 會漏掉裡面。正確的做法：外層照公式微，再乘上裡面那一層的導數。", tex: "\\frac{d}{dx}e^{2x}=e^{2x}\\cdot(2x)'=2e^{2x}" },
        { text: "這條叫連鎖律。想成剝洋蔥：外層是 e^(…)，裡層是 2x；外層微分（e 還是 e）、裡層微分（2x → 2），乘起來。" },
        { text: "同一招用在 sin(3x)：外層 sin → cos，裡層 3x → 3，所以是 3cos(3x)。用在 (x² + 1)⁴：外層四次方 → 4(…)³，裡層 → 2x，得 8x(x² + 1)³。" },
        { text: "怎麼知道要用連鎖律？看括號裡面（或指數上、根號裡）是不是單純一個 x。不是，就要乘裡面的導數。" }
      ],
      worked: {
        problemId: "tmpl-der-exp-001",
        steps: [
          { text: "外層是 e 的次方，裡層是 2x。不是單純的 eˣ，要用連鎖律。" },
          { text: "外層微分：e^(…) 的導數還是 e^(…)，裡面先原封不動。", tex: "e^{2x}" },
          { text: "裡層微分：(2x)′ = 2。相乘。", tex: "\\frac{d}{dx}e^{2x}=2e^{2x}" }
        ]
      },
      checks: [
        {
          ask: "d/dx sin(2x) 是？",
          options: [
            { label: "2cos(2x)", correct: true },
            { label: "cos(2x)", why: "外層微對了，但忘了乘裡面 2x 的導數 2。" },
            { label: "2sin(2x)", why: "sin 的導數是 cos，外層要換成 cos。" }
          ]
        }
      ],
      practice: ["fd-der-003", "tmpl-der-sin-001", "fd-der-011"]
    },
    {
      id: "c8-antiderivative",
      unit: "integrals",
      title: "第 8 課 · 積分是微分的反操作",
      minutes: 7,
      goal: "∫ f(x) dx 問的是「誰微分之後會變成 f」；冪次法則倒著用，記得 +C。",
      concept: [
        { text: "微分是「給函數，求斜率」。積分先當成它的反操作：「給斜率，找回函數」。誰微分之後是 2x？x²。所以 ∫ 2x dx = x²。這種「找回來的函數」叫反導函數。" },
        { text: "但 x² + 5 微分也是 2x，x² − 100 也是。常數微分掉了，找回來的時候不知道原本是多少——所以答案要加一個 + C。", tex: "\\int 2x\\,dx=x^2+C" },
        { text: "冪次法則倒著用：指數加 1，再除以新的指數。", tex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad(n\\ne -1)" },
        { text: "檢查方法永遠是：把答案微分回去，看是不是原本的東西。∫ 6x² dx = 2x³ + C，(2x³)′ = 6x² ✓。這一課的練習寫答案時可以省略 + C。" }
      ],
      worked: {
        problemId: "int-001",
        steps: [
          { text: "問：誰微分之後是 6x²？先處理 x²：指數加 1 變 x³，除以 3。", tex: "\\int x^2\\,dx=\\frac{x^3}{3}+C" },
          { text: "常數倍 6 留著：6 × x³/3 = 2x³。", tex: "\\int 6x^2\\,dx=2x^3+C" },
          { text: "驗算：(2x³)′ = 6x² ✓。" }
        ]
      },
      checks: [
        {
          ask: "∫ x² dx 是？",
          options: [
            { label: "x³/3 + C", correct: true },
            { label: "2x", why: "2x 是 x² 的導數（往前走）；積分是往回走：誰微分會變成 x²。" },
            { label: "x³", why: "差一個 1/3：(x³)′ = 3x²，不是 x²。指數加 1 之後要除以新指數。" }
          ]
        }
      ],
      practice: ["fd-int-001", "fd-int-002", "tmpl-int-power-002"]
    },
    {
      id: "c9-definite-integral",
      unit: "integrals",
      title: "第 9 課 · 定積分是面積",
      minutes: 8,
      goal: "∫ₐᵇ f(x) dx 是曲線下從 a 到 b 的面積；算法是反導函數在 b 減在 a。",
      concept: [
        { text: "上一課的積分沒有數字，答案是函數。這一課的積分上下各有一個數字，答案是一個數：曲線 y = f(x) 底下、從 x = a 到 x = b 的面積。" },
        { text: "算面積的方法跟反導函數有關，這是微積分最漂亮的定理（微積分基本定理）：找一個反導函數 F，面積就是 F(b) − F(a)。", tex: "\\int_a^b f(x)\\,dx=F(b)-F(a),\\qquad F'=f" },
        { text: "∫₀¹ x² dx：反導函數是 x³/3，代 1 減代 0，1/3 − 0 = 1/3。這就是拋物線 y = x² 在 0 到 1 之間、跟 x 軸圍出來的面積。+C 在相減時消掉，所以定積分不用寫 C。" },
        { text: "檢查直覺：那塊面積在一個 1×1 的正方形裡，曲線在下面彎著，面積比一半小——1/3 合理。" }
      ],
      worked: {
        problemId: "rel-basic-013",
        steps: [
          { text: "先找反導函數：x² 積分是 x³/3（上一課）。", tex: "F(x)=\\frac{x^3}{3}" },
          { text: "代上限 1、代下限 0，相減。", tex: "F(1)-F(0)=\\frac13-0" },
          { text: "面積是 1/3。", tex: "\\int_0^1 x^2\\,dx=\\frac13" }
        ]
      },
      checks: [
        {
          ask: "∫₀² 3x dx 是？",
          options: [
            { label: "6（一個三角形的面積）", correct: true },
            { label: "3x²/2", why: "上下有數字的定積分答案是一個數，不是函數：把 3x²/2 代 2 減代 0 才是答案。" },
            { label: "12", why: "反導函數是 3x²/2，代 2 是 6，不是 3·2² = 12。" }
          ]
        }
      ],
      practice: ["rel-basic-018", "cx-int-001", "fd-int-006"]
    }
  ];
})();

// ── 課程畫面 ──
// 從零開始的課程畫面：課程表、單課頁（概念 → 逐步示範 → 小測 → 導引練習）。
//
// 內容在同一個檔上半（BUZZ_COURSE），題目來自題庫（BUZZ_PROBLEMS）。
// 狀態（現在在哪一課、示範揭到第幾步、小測選了什麼）留在 app.js；這裡只畫 HTML。
// 用法：const courseUI = window.BuzzCourseUI.create({ escapeHtml, escapeAttr, icon, referenceAnswerHTML });

(function () {
  "use strict";

  const UNITS = [["limits", "極限"], ["derivatives", "微分"], ["integrals", "積分"]];
  const UNIT_LABEL = Object.fromEntries(UNITS);

  function create(deps) {
    const { escapeHtml, escapeAttr, icon, referenceAnswerHTML } = deps;

    const lessons = () => (Array.isArray(window.BUZZ_COURSE) ? window.BUZZ_COURSE : []);
    const lesson = (id) => lessons().find((item) => item.id === id) || null;
    const problems = () => (Array.isArray(window.BUZZ_PROBLEMS) ? window.BUZZ_PROBLEMS : []);
    const problem = (id) => problems().find((item) => item.id === id) || null;
    /** 這題是哪一課教的（回饋裡用來給「回去看第 n 課」的連結） */
    const problemLesson = (problemId) => lessons().find((item) => item.practice.includes(problemId) || (item.worked && item.worked.problemId === problemId)) || null;

    const entryOf = (records, id) => ((records.course || {})[id]) || {};
    const isDone = (records, id) => Boolean(entryOf(records, id).doneAt);
    const number = (item) => lessons().indexOf(item) + 1;

    function progress(records) {
      const all = lessons();
      const done = all.filter((item) => isDone(records, item.id)).length;
      const next = all.find((item) => !isDone(records, item.id)) || null;
      return { total: all.length, done, next };
    }

    const status = (records, item) => {
      const entry = entryOf(records, item.id);
      if (entry.doneAt) return "done";
      if (entry.openedAt || entry.checksPassed || entry.practiceDone) return "started";
      return "new";
    };

    function renderIndex(records) {
      const all = lessons();
      const summary = progress(records);
      return `
        <main class="screen">
          <section class="panel page-panel course-index">
            <div class="page-head">
              <div>
                <p class="section-label">從零開始</p>
                <h2>微積分的九課</h2>
                <p>還沒學過也沒關係。每課 6–8 分鐘：白話講一個概念 → 一題逐步示範 → 小測 → 三題不倒數的練習。九課上完，再去走主線關卡。</p>
              </div>
              <div class="action-row">
                ${summary.next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(summary.next.id)}">${icon("play")}${summary.done ? "繼續" : "從第 1 課開始"}：${escapeHtml(summary.next.title.replace(/^第 \d+ 課 · /, ""))}</button>` : `<button class="button home-primary" data-action="open-train">${icon("target")}九課上完了，去走主線</button>`}
                <button class="button secondary" data-action="home">${icon("home")}回主線</button>
              </div>
            </div>
            <div class="course-progress"><strong>${summary.done}<small> / ${summary.total} 課</small></strong><i style="--pct:${summary.total ? Math.round(summary.done / summary.total * 100) : 0}%"></i></div>
            ${UNITS.map(([unit, label]) => {
              const group = all.filter((item) => item.unit === unit);
              if (!group.length) return "";
              return `
                <section class="course-unit">
                  <p class="section-label">${escapeHtml(label)} · ${group.length} 課</p>
                  <div class="course-grid">
                    ${group.map((item) => {
                      const state = status(records, item);
                      return `
                        <button type="button" class="course-card is-${state}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(item.id)}">
                          <span class="course-card-no">${state === "done" ? "✔" : number(item)}</span>
                          <strong>${escapeHtml(item.title.replace(/^第 \d+ 課 · /, ""))}</strong>
                          <small>${escapeHtml(item.goal)}</small>
                          <em>${item.minutes} 分鐘${state === "started" ? " · 進行中" : state === "done" ? " · 完成" : ""}</em>
                        </button>`;
                    }).join("")}
                  </div>
                </section>`;
            }).join("")}
          </section>
        </main>`;
    }

    // state = { revealed: 示範揭到第幾步, picks: { [checkIndex]: optionIndex } }
    function renderLesson(item, records, state) {
      if (!item) return null;
      const all = lessons();
      const index = all.indexOf(item);
      const entry = entryOf(records, item.id);
      const worked = item.worked && problem(item.worked.problemId);
      const revealed = Math.max(0, Math.min(item.worked.steps.length, state.revealed || 0));
      const picks = state.picks || {};
      const allChecksRight = item.checks.every((check, i) => picks[i] !== undefined && check.options[picks[i]] && check.options[picks[i]].correct);
      const checksPassed = Boolean(entry.checksPassed) || allChecksRight;
      const practiceDone = Boolean(entry.practiceDone);
      const practiceProblems = item.practice.map(problem).filter(Boolean);
      const next = all[index + 1] || null;
      const stepHtml = (step, i) => `
        <li class="course-step">
          <span class="course-step-no">${i + 1}</span>
          <div>
            <p>${escapeHtml(step.text)}</p>
            ${step.tex ? `<div class="math-block course-step-math" data-tex="${escapeAttr(step.tex)}"></div>` : ""}
          </div>
        </li>`;
      return `
        <main class="screen">
          <section class="panel page-panel pl-screen pl-tutorial course-lesson">
            <div class="page-head">
              <div>
                <p class="section-label">從零開始 · 第 ${index + 1} / ${all.length} 課 · ${escapeHtml(UNIT_LABEL[item.unit] || item.unit)}</p>
                <h2>${escapeHtml(item.title.replace(/^第 \d+ 課 · /, ""))}</h2>
                <p>${escapeHtml(item.goal)}</p>
              </div>
              <div class="action-row">
                <button class="button secondary" data-action="open-course">${icon("list")}課程表</button>
              </div>
            </div>
            <nav class="pl-lesson-nav" aria-label="課程">
              ${all.map((other, i) => `<button type="button" class="${other.id === item.id ? "is-active" : ""} ${isDone(records, other.id) ? "is-done" : ""}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(other.id)}">${i + 1}${isDone(records, other.id) ? " ✔" : ""}</button>`).join("")}
            </nav>

            <section class="course-block">
              <p class="section-label">① 概念 · 約 ${item.minutes} 分鐘</p>
              <div class="pl-intro">
                ${item.concept.map((para) => `<p>${escapeHtml(para.text)}</p>${para.tex ? `<div class="math-block course-concept-math" data-tex="${escapeAttr(para.tex)}"></div>` : ""}`).join("")}
              </div>
            </section>

            <section class="course-block" data-course-worked>
              <p class="section-label">② 逐步示範 · 一步一步揭</p>
              ${worked ? `
                <div class="pl-goal math-block" data-tex="${escapeAttr(worked.prompt)}"></div>
                <ol class="course-steps">${item.worked.steps.slice(0, revealed).map(stepHtml).join("")}</ol>
                ${revealed < item.worked.steps.length
                  ? `<button class="button secondary" data-action="course-step">${icon("chevron-down")}${revealed ? "下一步" : "先想一下，再看第一步"}<small>${revealed} / ${item.worked.steps.length}</small></button>`
                  : `<p class="course-answer">${icon("check")}答案：${referenceAnswerHTML(worked)}</p>`}` : `<p class="panel-note">示範題找不到（${escapeHtml(item.worked.problemId)}）。</p>`}
            </section>

            <section class="course-block" data-course-checks>
              <p class="section-label">③ 小測 · 選錯會告訴你為什麼</p>
              ${item.checks.map((check, ci) => {
                const picked = picks[ci];
                const done = Boolean(entry.checksPassed) && picked === undefined;
                return `
                  <div class="course-check ${picked !== undefined ? (check.options[picked].correct ? "is-right" : "is-wrong") : done ? "is-right" : ""}">
                    <p class="course-check-ask">${escapeHtml(check.ask)}</p>
                    <div class="course-check-options">
                      ${check.options.map((option, oi) => `
                        <button type="button" class="course-option ${picked === oi ? (option.correct ? "is-correct" : "is-picked") : ""} ${(picked !== undefined || done) && option.correct ? "is-correct" : ""}" data-action="course-pick" data-check="${ci}" data-option="${oi}">${escapeHtml(option.label)}</button>`).join("")}
                    </div>
                    ${picked !== undefined && !check.options[picked].correct ? `<p class="course-check-why">${escapeHtml(check.options[picked].why || "")}</p>` : ""}
                    ${(picked !== undefined && check.options[picked].correct) || done ? `<p class="course-check-why is-right">${icon("check")}對了。</p>` : ""}
                  </div>`;
              }).join("")}
            </section>

            <section class="course-block" data-course-practice>
              <p class="section-label">④ 導引練習 · ${practiceProblems.length} 題，不倒數、可看提示</p>
              <div class="course-practice-list">
                ${practiceProblems.map((p) => `<div class="course-practice-item"><div class="math-inline" data-tex="${escapeAttr(p.prompt)}"></div></div>`).join("")}
              </div>
              <div class="action-row">
                ${practiceDone
                  ? `<span class="course-done-pill">${icon("check")}練過了 · ${entry.practiceCorrect || 0} / ${entry.practiceTotal || practiceProblems.length} 對</span>
                     <button class="button secondary" data-action="course-practice" data-lesson-id="${escapeAttr(item.id)}">${icon("refresh")}再練一次</button>`
                  : `<button class="button home-primary" data-action="course-practice" data-lesson-id="${escapeAttr(item.id)}">${icon("play")}開始練這 ${practiceProblems.length} 題</button>`}
                ${checksPassed && practiceDone
                  ? (next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("chevron-right")}下一課：${escapeHtml(next.title.replace(/^第 \d+ 課 · /, ""))}</button>` : `<button class="button home-primary" data-action="open-train">${icon("target")}九課上完了，去走主線</button>`)
                  : `<span class="panel-note">${checksPassed ? "練完這三題就算完成這一課。" : "小測答對、練習做完，這一課就算完成。"}</span>`}
              </div>
            </section>
          </section>
        </main>`;
    }

    // 第一分鐘：還沒答過任何一題的人，四張全是 0 的統計卡什麼都沒告訴他。
    // 換成三步——照 onboarding 選的程度分兩種說法（先暖身／照主線 vs 直接挑戰）。
    function renderFirstSteps(records) {
      const advanced = records.onboardingLevel === "advanced";
      if (records.onboardingContext === "newbie") {
        const course = progress(records);
        const steps = [
          [course.next ? `上${course.next.title.split(" · ")[0]}：${course.next.title.split(" · ")[1] || ""}` : "九課都上完了", "白話概念 → 逐步示範 → 小測 → 3 題練習", "open-course"],
          ["練完就有能力輪廓", "哪些概念穩、哪些還卡，數據頁看得到", "open-insights"],
          ["九課上完再走主線", "從極限關開始，一格一格解鎖", "open-train"]
        ];
        return `
          <section class="first-steps" aria-label="開始的三步">
            ${steps.map(([title, note, action], index) => `
              <button type="button" class="first-step ${index === 0 ? "is-current" : ""}" data-action="${action}">
                <span class="first-step-no">${index === 0 && course.done ? `${course.done}/${course.total}` : index + 1}</span>
                <strong>${escapeHtml(title)}</strong>
                <small>${escapeHtml(note)}</small>
              </button>`).join("")}
          </section>`;
      }
      const steps = advanced
        ? [
          ["直接挑戰一局", "R5–R6 的難題，倒數計時；先知道自己在哪", "open-train"],
          ["看哪裡掉分", "不是「不會」就是「來不及」——數據頁分得出來", "open-insights"],
          ["證明訓練與國際難題", "白話證明的高手路線、Putnam 風格、經典解析", "open-proofs"]
        ]
        : [
          ["先練一份 8 題", "不倒數、不計分，看懂題目在問什麼", "open-train"],
          ["看你的能力輪廓", "練完就有：哪些技巧穩、哪些卡", "open-insights"],
          ["走主線關卡", "從極限開始，一格一格解鎖", "open-train"]
        ];
      return `
        <section class="first-steps" aria-label="開始的三步">
          ${steps.map(([title, note, action], index) => `
            <button type="button" class="first-step ${index === 0 ? "is-current" : ""}" data-action="${action}">
              <span class="first-step-no">${index + 1}</span>
              <strong>${escapeHtml(title)}</strong>
              <small>${escapeHtml(note)}</small>
            </button>`).join("")}
        </section>`;
    }


    // 結算頁的出口：回這一課／下一課（app.js 的 renderResultsActions 轉呼叫）
    function renderResultsActions(lessonId) {
        const item = lesson(lessonId);
        const all = lessons();
        const next = item ? all[all.indexOf(item) + 1] : null;
        return `
          <div class="action-row">
            <button class="button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(lessonId)}">${icon("book-open")}回到${item ? escapeHtml(item.title.split(" · ")[0]) : "課程"}</button>
            ${next ? `<button class="button secondary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("chevron-right")}下一課</button>` : `<button class="button secondary" data-action="open-course">${icon("list")}課程表</button>`}
            <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
          </div>
        `;
    }

    // 答錯時：這題是哪一課教的
    function renderFeedbackLink(problemId) {
      const taught = problemLesson(problemId);
      return taught ? `<p class="feedback-course"><button type="button" class="link-button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(taught.id)}">${icon("book-open")}這題是「${escapeHtml(taught.title)}」教的 —— 回去看一眼</button></p>` : "";
    }

    // 首頁主卡：還沒學過的人在九課上完之前，主 CTA 是「接著上課」，不是 15 題每日訓練
    function renderHomeCard(records) {
      const summary = progress(records);
      if (!summary.next) return "";
      const item = summary.next;
      const entry = entryOf(records, item.id);
      const started = Boolean(entry.openedAt);
      return `
        <section class="today-card course-home-card">
          <div class="today-card-head">
            <p class="section-label">${icon("book-open")}從零開始 · ${summary.done} / ${summary.total} 課</p>
            <span>約 ${item.minutes} 分鐘</span>
          </div>
          <h2>${started ? "接著上" : "上"}${escapeHtml(item.title.split(" · ")[0])}：${escapeHtml(item.title.split(" · ")[1] || "")}</h2>
          <p>${escapeHtml(item.goal)}</p>
          <div class="action-row">
            <button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(item.id)}">${icon("play")}${started ? "繼續這一課" : "開始"}</button>
            <button class="button secondary" data-action="open-course">${icon("list")}課程表</button>
          </div>
          <p class="panel-note">白話概念 → 一題逐步示範 → 小測 → 3 題不倒數的練習。九課上完再走主線關卡。</p>
        </section>`;
    }

    return { lessons, lesson, problemLesson, progress, renderIndex, renderLesson, renderFirstSteps, renderResultsActions, renderFeedbackLink, renderHomeCard };
  }

  window.BuzzCourseUI = { create };
})();
