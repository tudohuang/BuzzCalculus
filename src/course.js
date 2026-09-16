// 從零開始：給還沒學過微積分的人的入門課（十六課）。
//
// 這個站原本是「把學過的微積分練成直覺」——只有題目，沒有一段教「極限是什麼」的內容。
// 完全初學者打開就被 1994 題淹死。這些課補的是那一層。兩種課：
//   - 計算課：白話概念（幾段，帶一兩個公式）→ 一題逐步示範（用題庫裡驗算過的 R1 題，
//     一步一步揭）→ 概念小測（選錯會說為什麼錯）→ 三題導引練習（題庫的 R1 題，不倒數）。
//   - 理論課（practice 是空的）：函數是什麼、連續與中間值定理、極值、均值定理、黎曼和與
//     基本定理。題庫裡沒有這種題（也不該有——它們不是反射題），所以示範是一段推導
//     （worked.tex 當題目、沒有 problemId），小測至少三題，小測全對就算完成。
//
// 順序照一般課本（Stewart / Thomas）的章節走：函數 → 極限與連續 → 導數與微分法則 →
// 導數的應用（極值、均值定理）→ 反導函數 → 定積分 → 基本定理。
//
// 內容原則：
//   - 計算課的示範與練習一律指向題庫既有的題（problemId），答案沿用題庫已經驗算過的；
//     tools/validate_course.js 會擋不存在的 id、非 R1 的題、沒有 why 的錯誤選項。
//   - 只講一件事。每課一個新概念，公式最多兩三條；技巧（換元、分部）不在這裡。
//   - 用白話，不用「有理式」「同階」這種詞；真的要用就先解釋。
//   - 小測的正解不要永遠放第一個。
//   - 課文裡寫「第 n 課」的地方，n 要跟順序一致（validate_course 會檢查 n 不超過總數）。

(function () {
  "use strict";

  window.BUZZ_COURSE = [
    {
      id: "fn-what-is-a-function",
      unit: "functions",
      title: "第 1 課 · 函數是什麼",
      minutes: 6,
      goal: "f(x) 是一台機器：放 x 進去，出來恰好一個數；定義域是「哪些 x 放得進去」。",
      concept: [
        { text: "函數是一條規則：每個輸入恰好對到一個輸出。f(x) = x² + 1 這台機器，放 2 進去出來 5，放 −3 出來 10。f(2) 讀作「f 在 2 的值」。裡面的 x 只是佔位符號，寫成 f(t) = t² + 1 是同一個函數。", tex: "f(x)=x^2+1,\\qquad f(2)=2^2+1=5,\\qquad f(-3)=10" },
        { text: "定義域：放得進去的 x。兩個最常見的禁區——分母不能是 0（1/(x − 3) 不能放 3），根號裡不能是負的（√x 只收 x ≥ 0）。多項式什麼都能放。" },
        { text: "圖形：把每一個點 (x, f(x)) 畫出來。因為一個 x 只有一個輸出，任何一條鉛直線最多碰到圖形一次（鉛直線測試）。一個圓不是函數的圖形——同一個 x 上下各有一點。" },
        { text: "為什麼微積分要從這裡講起：極限、導數、積分全都是「對一個函數做的事」。接下來每一課的主角都是某個 f(x)，先把它當成機器看熟。" }
      ],
      worked: {
        tex: "f(x)=\\frac{\\sqrt{x}}{x-4}\\ \\text{ 的定義域是什麼？}",
        steps: [
          { text: "兩個禁區各檢查一次。先看根號：裡面是 x，要 x ≥ 0。" },
          { text: "再看分母：x − 4 不能是 0，所以 x ≠ 4。" },
          { text: "兩個條件同時要成立：x ≥ 0 而且 x ≠ 4。用區間寫就是下面這樣。", tex: "[0,4)\\cup(4,\\infty)" }
        ]
      },
      checks: [
        {
          ask: "f(x) = 3x − 1，f(2) 是多少？",
          options: [
            { label: "6", why: "3 × 2 = 6 之後還要減 1。" },
            { label: "5", correct: true },
            { label: "3x − 1", why: "f(2) 是把 2 代進去之後得到的一個數，不再是含 x 的式子。" }
          ]
        },
        {
          ask: "g(x) = 1/(x + 2) 的定義域？",
          options: [
            { label: "所有實數", why: "x = −2 時分母是 0，1/0 沒有意義。" },
            { label: "x > −2", why: "負的 x 也放得進去，例如 g(−5) = 1/(−3) 好好的。只有讓分母變 0 的 −2 不行。" },
            { label: "除了 −2 以外的所有實數", correct: true }
          ]
        },
        {
          ask: "下面哪一個對應是函數？",
          options: [
            { label: "每個人 → 他的身高", correct: true },
            { label: "每個人 → 他的兄弟姊妹", why: "一個人可能有兩個以上的兄弟姊妹，也可能沒有——不是「恰好一個輸出」。" },
            { label: "每個正數 → 它的平方根（正負都算）", why: "4 會同時對到 2 和 −2，一個輸入兩個輸出。√4 之所以定義成只取 2，就是為了讓它變成函數。" }
          ]
        }
      ],
      practice: []
    },
    {
      id: "fn-families-composition",
      unit: "functions",
      title: "第 2 課 · 常見的函數家族，與「函數套函數」",
      minutes: 7,
      goal: "認得多項式、eˣ、ln x、sin／cos 的長相，還有 f(g(x)) 怎麼讀。",
      concept: [
        { text: "多項式 x² − 3x + 1、有理函數（多項式除以多項式）、根號 √x——上一課都看過了。接下來三個家族微積分裡天天用，先認臉。" },
        { text: "指數函數 eˣ：e ≈ 2.718，是微積分裡最順手的底數。eˣ 永遠是正的，e⁰ = 1，越往右長得越快。對數 ln x 是它的反操作：ln 問的是「e 的幾次方會變成 x」，所以 ln 1 = 0、ln e = 1，而且只收正的 x。", tex: "\\ln(e^x)=x,\\qquad e^{\\ln x}=x\\ (x>0)" },
        { text: "三角函數 sin x、cos x：x 是弧度（π 對應 180°），微積分裡一律用弧度，用角度後面的公式全會錯。兩個都永遠在 −1 到 1 之間，每 2π 重複一次。記三個值：sin 0 = 0、cos 0 = 1、sin(π/2) = 1。" },
        { text: "合成：把一個函數的輸出塞進另一個函數。f(x) = x²、g(x) = x + 1，f(g(x)) 是「先算 g，再把結果放進 f」，得 (x + 1)²。sin(2x)、e^{3x}、√(x² + 1) 全是這種「外面套裡面」的東西——第 11 課的連鎖律專門處理它。", tex: "f(g(x))=(x+1)^2,\\qquad g(f(x))=x^2+1" },
        { text: "順序很重要：f(g(x)) 和 g(f(x)) 通常不一樣。看到一個複雜的式子，先在心裡拆成「外面是誰、裡面是誰」，這個習慣之後會一直用到。" }
      ],
      worked: {
        tex: "f(x)=\\sqrt{x},\\quad g(x)=x^2+1.\\ \\text{寫出 } f(g(x))\\ \\text{與 } g(f(x))",
        steps: [
          { text: "f(g(x))：先算裡面的 g，得到 x² + 1；再把它整個放進 f 開根號。", tex: "f(g(x))=\\sqrt{x^2+1}" },
          { text: "g(f(x))：先算 f 得到 √x；再放進 g，平方之後加 1。", tex: "g(f(x))=(\\sqrt{x})^2+1=x+1\\quad(x\\ge 0)" },
          { text: "兩個不一樣。之後看到 √(x² + 1)，要能立刻說出：外面是開根號，裡面是 x² + 1。" }
        ]
      },
      checks: [
        {
          ask: "e⁰ 是多少？",
          options: [
            { label: "0", why: "任何數的 0 次方都是 1；而且 eˣ 永遠是正的，不會是 0。" },
            { label: "1", correct: true },
            { label: "e", why: "e¹ 才是 e。" }
          ]
        },
        {
          ask: "ln(e³) 是多少？",
          options: [
            { label: "e³", why: "ln 跟 e 的次方互相抵消，剩下指數 3。" },
            { label: "3e", why: "ln 不是「乘」，是問「e 的幾次方」。e³ 是 e 的 3 次方，答案就是 3。" },
            { label: "3", correct: true }
          ]
        },
        {
          ask: "f(x) = x³、g(x) = 2x，f(g(x)) 是？",
          options: [
            { label: "(2x)³ = 8x³", correct: true },
            { label: "2x³", why: "那是 g(f(x))：先立方再乘 2。f(g(x)) 是先乘 2，再把整個 2x 立方。" },
            { label: "x³ + 2x", why: "合成是「套進去」，不是「加起來」。" }
          ]
        }
      ],
      practice: []
    },
    {
      id: "c1-limit-meaning",
      unit: "limits",
      title: "第 3 課 · 極限是什麼",
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
      title: "第 4 課 · 代進去變 0/0 怎麼辦",
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
      title: "第 5 課 · x 跑到無窮遠",
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
      title: "第 6 課 · 三個要背的極限",
      minutes: 7,
      goal: "sin x / x → 1、(e^x − 1)/x → 1、ln(1 + x)/x → 1，還有怎麼「配」出它們。",
      concept: [
        { text: "有三個極限沒辦法用前面的方法算，是靠幾何或級數證出來的，微積分裡到處用，直接記起來：", tex: "\\lim_{x\\to 0}\\frac{\\sin x}{x}=1,\\qquad \\lim_{x\\to 0}\\frac{e^x-1}{x}=1,\\qquad \\lim_{x\\to 0}\\frac{\\ln(1+x)}{x}=1" },
        { text: "直覺：x 很小的時候 sin x 幾乎等於 x（0.1 的 sin 是 0.0998），e^x 幾乎等於 1 + x，ln(1 + x) 也幾乎等於 x（ln 1.1 ≈ 0.0953）。所以三個分數都靠近 1。第二個和第三個其實是同一件事：e 的次方和 ln 互為反操作。" },
        { text: "真正會考的是「配」：sin(5x)/x 分子裡是 5x，分母卻是 x，對不上。乘一個 5 再除一個 5，把分母也變成 5x。", tex: "\\frac{\\sin(5x)}{x}=5\\cdot\\frac{\\sin(5x)}{5x}\\ \\xrightarrow{x\\to 0}\\ 5\\cdot 1=5" },
        { text: "口訣：sin(ax)/(bx) 的極限是 a/b；(e^{ax} − 1)/(bx) 和 ln(1 + ax)/(bx) 也都是 a/b。裡面是什麼，就配成什麼。" }
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
      id: "lim-continuity-ivt",
      unit: "limits",
      title: "第 7 課 · 連續，與中間值定理",
      minutes: 8,
      goal: "連續＝畫圖不用抬筆；連續的函數從負走到正，中間一定經過 0（中間值定理）。",
      concept: [
        { text: "f 在 x = a 連續，要三件事同時成立：f(a) 有定義、x → a 的極限存在、而且兩個相等。白話就是：畫到 x = a 那裡不用抬筆。", tex: "\\lim_{x\\to a}f(x)=f(a)" },
        { text: "不連續的三種長相：洞——(x² − 4)/(x − 2) 在 x = 2，極限是 4 但 f(2) 沒定義；跳——階梯函數，左右靠近的值不同；飛走——1/x 在 x = 0。多項式、sin、cos、eˣ 處處連續；分數只在分母不為 0 的地方連續。" },
        { text: "連續為什麼重要：第 3 課的「直接代入」能用，就是因為函數在那一點連續——極限等於函數值。不連續的點才需要第 4 課那些化簡。" },
        { text: "中間值定理：f 在 [a, b] 連續，f(a) < 0 而 f(b) > 0，那 a 和 b 之間一定有某個 c 讓 f(c) = 0。理由就是「不抬筆」——從 x 軸下面畫到上面，一定會穿過 x 軸。更一般的說法：介於 f(a) 與 f(b) 之間的每一個值，中間都會被取到。", tex: "f(a)<0<f(b)\\ \\Rightarrow\\ \\exists\\,c\\in(a,b),\\ f(c)=0" },
        { text: "用途：證明一個方程式有解，而不用真的解出來。x³ − x − 1 = 0 沒有漂亮的根，但 f(1) = −1、f(2) = 5，所以 1 和 2 之間一定有根。這是微積分裡第一次遇到「知道它存在，但不知道它是多少」——之後的均值定理也是這種定理。" }
      ],
      worked: {
        tex: "\\text{證明 } x^3-x-1=0\\ \\text{在 } 1<x<2\\ \\text{之間有解}",
        steps: [
          { text: "令 f(x) = x³ − x − 1。它是多項式，處處連續，所以在 [1, 2] 上當然連續——定理的前提成立。" },
          { text: "代兩個端點：f(1) = 1 − 1 − 1 = −1，是負的；f(2) = 8 − 2 − 1 = 5，是正的。", tex: "f(1)=-1<0,\\qquad f(2)=5>0" },
          { text: "從負到正、中間不抬筆，一定穿過 0。中間值定理保證 (1, 2) 裡存在 c 使 f(c) = 0。定理沒說 c 是多少（其實 c ≈ 1.3247），但「有解」已經證完了。" }
        ]
      },
      checks: [
        {
          ask: "f(x) = (x² − 4)/(x − 2) 在 x = 2 連續嗎？",
          options: [
            { label: "連續，因為極限是 4", why: "極限存在只是三個條件之一。f(2) 本身沒有定義（0/0），畫到那裡得抬一下筆——那是一個洞。" },
            { label: "不連續，因為 f(2) 沒定義（圖形有個洞）", correct: true },
            { label: "不連續，因為極限不存在", why: "極限存在而且是 4（第 4 課算過）。缺的是 f(2)，不是極限。" }
          ]
        },
        {
          ask: "f 處處連續，f(0) = −3、f(1) = 2。可以確定什麼？",
          options: [
            { label: "0 和 1 之間恰好有一個 x 使 f(x) = 0", why: "定理只保證「至少一個」。圖形可以上下穿過 x 軸好幾次。" },
            { label: "f(0.5) = 0", why: "定理只說「存在」，沒說在哪裡。根可能在 0.1，也可能在 0.9。" },
            { label: "0 和 1 之間至少有一個 x 使 f(x) = 0", correct: true }
          ]
        },
        {
          ask: "f(x) = 1/x，f(−1) = −1、f(1) = 1。所以 −1 和 1 之間有根？",
          options: [
            { label: "有，中間一定經過 0", why: "1/x 在 x = 0 飛走了，圖形抬了筆。定理要的「連續」沒滿足，結論就不保證——事實上 1/x 永遠不是 0。" },
            { label: "不行：1/x 在 x = 0 不連續，定理的前提不成立；1/x 根本沒有根", correct: true },
            { label: "有，根就是 x = 0", why: "1/0 沒有意義，x = 0 根本不在定義域裡。" }
          ]
        }
      ],
      practice: []
    },
    {
      id: "c5-derivative-slope",
      unit: "derivatives",
      title: "第 8 課 · 導數就是斜率",
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
      title: "第 9 課 · 微分公式：不用每次算極限",
      minutes: 7,
      goal: "冪次法則 (xⁿ)′ = n·xⁿ⁻¹，加減與常數倍可以拆開，常數的導數是 0。",
      concept: [
        { text: "上一課的極限對每個函數都算一次太累。數學家算好了幾條公式，最重要的一條：", tex: "\\frac{d}{dx}x^n=n\\,x^{n-1}" },
        { text: "指數搬到前面當係數，指數減 1。x³ → 3x²，x⁵ → 5x⁴，x → 1，常數 7 → 0（常數是平的，斜率當然 0）。" },
        { text: "再加兩條規則就能微分所有多項式：加減可以一項一項做；常數倍留著不動。(x⁵ − 3x² + 7)′ = 5x⁴ − 3·2x + 0 = 5x⁴ − 6x。" },
        { text: "另外四個要記的：(sin x)′ = cos x、(cos x)′ = −sin x、(eˣ)′ = eˣ（它的斜率等於它自己的高度，這就是 e 最順手的原因）、(ln x)′ = 1/x。這四個加上冪次法則，就是這一課全部的東西。", tex: "(\\sin x)'=\\cos x,\\quad(\\cos x)'=-\\sin x,\\quad(e^x)'=e^x,\\quad(\\ln x)'=\\frac1x" }
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
      id: "der-product-quotient",
      unit: "derivatives",
      title: "第 10 課 · 相乘與相除：乘法律、除法律",
      minutes: 7,
      goal: "兩個函數相乘的導數不是導數相乘：(uv)′ = u′v + uv′；相除也有一條。",
      concept: [
        { text: "先看一個錯誤的直覺：(x · x)′ 是不是 1 · 1 = 1？可是 x · x = x²，導數是 2x。所以「各自微分再相乘」是錯的——相乘的東西要用自己的規則。" },
        { text: "乘法律：前微後不微，加上前不微後微。用 x · x 驗一次：1 · x + x · 1 = 2x，對了。", tex: "(uv)'=u'v+uv'" },
        { text: "例子：(x eˣ)′ = 1 · eˣ + x · eˣ = (x + 1)eˣ。(x ln x)′ = 1 · ln x + x · (1/x) = ln x + 1。兩個都含 x 的東西相乘就用它；常數乘函數不用（3x² 直接是 6x）。" },
        { text: "除法律：上微下不微、減、上不微下微，整個除以分母平方。用 1/x 驗：u = 1、v = x，得 (0 · x − 1 · 1)/x² = −1/x²，跟冪次法則 x⁻¹ → −x⁻² 一樣。", tex: "\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}" },
        { text: "記法：乘法律是「加」，兩項對稱、不用管順序；除法律是「減」，分子先微的那一項在前面，順序錯了正負號就反了。" }
      ],
      worked: {
        problemId: "fd-der-009",
        steps: [
          { text: "x 和 eˣ 都含 x，相乘——要用乘法律。令 u = x、v = eˣ。" },
          { text: "各自微分：u′ = 1、v′ = eˣ（第 9 課）。套公式。", tex: "u'v+uv'=1\\cdot e^x+x\\cdot e^x" },
          { text: "把共同的 eˣ 提出來。", tex: "\\frac{d}{dx}\\left(xe^x\\right)=(x+1)e^x" }
        ]
      },
      checks: [
        {
          ask: "(x · sin x)′ 是？",
          options: [
            { label: "cos x", why: "各自微分再相乘是錯的（x · x 那個例子）。要「前微後不微 + 前不微後微」。" },
            { label: "sin x + x cos x", correct: true },
            { label: "x cos x", why: "只做了「後微」那一半，還要加上前微後不微：1 · sin x。" }
          ]
        },
        {
          ask: "(x² · eˣ)′ 用乘法律，u = x²、v = eˣ，答案是？",
          options: [
            { label: "2x eˣ", why: "這只是 u′v，還要加上 uv′ = x² eˣ。" },
            { label: "x² eˣ", why: "這只是 uv′，前面那項 u′v = 2x eˣ 漏了。" },
            { label: "2x eˣ + x² eˣ", correct: true }
          ]
        }
      ],
      practice: ["der-003", "fd-der-005", "rel-basic-012"]
    },
    {
      id: "c7-chain-rule",
      unit: "derivatives",
      title: "第 11 課 · 裡面還有東西：連鎖律",
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
      id: "der-shape-extrema",
      unit: "derivatives",
      title: "第 12 課 · f′ 的正負：上坡、下坡、山頂與谷底",
      minutes: 8,
      goal: "f′ > 0 的地方圖形往上、f′ < 0 往下；山頂和谷底的地方 f′ = 0，但 f′ = 0 不保證是山頂或谷底。",
      concept: [
        { text: "導數是斜率，斜率正就是往上走。所以 f′(x) > 0 的區間 f 遞增（上坡），f′(x) < 0 的區間 f 遞減（下坡）。光看導數的正負，不用畫圖就知道圖形往哪裡走。" },
        { text: "山頂（極大值）與谷底（極小值）：在那一點切線是水平的，所以 f′ = 0。這叫費馬定理：光滑函數的極值只會出現在 f′ = 0 的地方（或區間端點、尖點）。要找最大最小，先找 f′ = 0 的點。", tex: "f\\ \\text{在 } c\\ \\text{有極值}\\ \\Rightarrow\\ f'(c)=0" },
        { text: "反過來不成立：f′ = 0 不保證是極值。f(x) = x³ 在 x = 0 的導數是 0，圖形只是「平一下」就繼續往上。怎麼分辨？看 f′ 在左右兩邊的正負：左負右正是谷底、左正右負是山頂、同號就只是平一下。" },
        { text: "例子：f(x) = x² − 4x，f′ = 2x − 4，在 x = 2 是 0。x < 2 時 f′ < 0 下坡，x > 2 時 f′ > 0 上坡——先下再上，x = 2 是谷底，最小值 f(2) = −4。" },
        { text: "這就是「最佳化」問題的全部原理：算導數、找 f′ = 0 的候選點、看左右正負。之後遇到的「求最大利潤」「最短距離」全都是這三步。" }
      ],
      worked: {
        tex: "f(x)=x^3-3x.\\ \\text{哪裡是山頂、哪裡是谷底？}",
        steps: [
          { text: "先微分：f′(x) = 3x² − 3 = 3(x − 1)(x + 1)。", tex: "f'(x)=3(x-1)(x+1)" },
          { text: "f′ = 0 在 x = −1 和 x = 1，這兩個是候選。" },
          { text: "看正負：x < −1 代 −2，f′ = 9 > 0；−1 < x < 1 代 0，f′ = −3 < 0；x > 1 代 2，f′ = 9 > 0。", tex: "f'>0\\ \\rightarrow\\ f'<0\\ \\rightarrow\\ f'>0" },
          { text: "x = −1 左正右負，先上再下，是山頂，f(−1) = −1 + 3 = 2；x = 1 左負右正，是谷底，f(1) = 1 − 3 = −2。", tex: "\\text{極大 } f(-1)=2,\\qquad \\text{極小 } f(1)=-2" }
        ]
      },
      checks: [
        {
          ask: "f′(x) = 2x。f 在 x < 0 的區間？",
          options: [
            { label: "遞增（往上走）", why: "x < 0 時 2x 是負的，斜率負就是下坡。f(x) = x² 的左半邊確實是往下的。" },
            { label: "遞減（往下走）", correct: true },
            { label: "不變", why: "只有 f′ = 0 的地方才是平的，這裡只有 x = 0 一個點。" }
          ]
        },
        {
          ask: "f′(3) = 0，所以 x = 3 一定是山頂或谷底？",
          options: [
            { label: "一定是", why: "f′ = 0 只是「候選」。f(x) = x³ 在 x = 0 導數是 0，圖形只是平一下就繼續往上。" },
            { label: "一定是谷底", why: "左負右正才是谷底、左正右負是山頂、同號什麼都不是。光看 f′(3) = 0 分不出來。" },
            { label: "不一定，x³ 在 0 就是反例；要看 f′ 在左右的正負", correct: true }
          ]
        },
        {
          ask: "f′ 在 x = 5 的左邊是正的、右邊是負的。x = 5 是？",
          options: [
            { label: "山頂（極大值）", correct: true },
            { label: "谷底（極小值）", why: "先上坡再下坡，那是山頂。谷底是先下再上。" },
            { label: "不是極值", why: "左右變號就是極值；只有同號才是「平一下」。" }
          ]
        }
      ],
      practice: []
    },
    {
      id: "der-mean-value",
      unit: "derivatives",
      title: "第 13 課 · 均值定理：某一瞬間，剛好等於平均",
      minutes: 8,
      goal: "兩點之間的平均斜率，中間某一刻的瞬間斜率恰好等於它；推論是「導數處處為 0 的函數是常數」——那就是積分要加 C 的理由。",
      concept: [
        { text: "開車 2 小時走了 200 公里，平均時速 100。中途你一定至少有一瞬間時速表正好指著 100——不可能全程都比 100 慢（那走不到 200 公里），也不可能全程都比 100 快。這就是均值定理。" },
        { text: "數學版：f 在 [a, b] 連續、中間可微，那存在一點 c，它的切線斜率等於兩端點連線（割線）的斜率。左邊是某一瞬間的變化率，右邊是整段的平均變化率。", tex: "f'(c)=\\frac{f(b)-f(a)}{b-a}" },
        { text: "例子：f(x) = x² 在 [0, 2]。平均斜率 (4 − 0)/2 = 2；f′(x) = 2x，等於 2 的地方是 x = 1。切線在 x = 1 剛好平行割線。跟第 7 課的中間值定理一樣，定理只說 c 存在，不負責告訴你在哪。" },
        { text: "最重要的用途不是找 c，是這個推論：如果 f′ 處處是 0，f 就是常數（斜率永遠 0，走不動）。再推一步：兩個函數導數相同，它們只差一個常數。這就是第 14 課 ∫ 要加 + C 的真正理由——反導函數全部長成 F(x) + C，沒有別的。", tex: "F'=G'\\ \\Rightarrow\\ F(x)=G(x)+C" },
        { text: "另一個推論就是上一課用的「f′ > 0 則遞增」：任兩點的割線斜率等於某個 f′(c) > 0，所以右邊的點一定比左邊高。上一課是直覺，這一課是證明。" }
      ],
      worked: {
        tex: "f(x)=x^3\\ \\text{在 }[0,3]\\text{。找均值定理說的那個 } c",
        steps: [
          { text: "割線斜率：(f(3) − f(0))/(3 − 0) = 27/3 = 9。", tex: "\\frac{f(3)-f(0)}{3-0}=9" },
          { text: "切線斜率 f′(x) = 3x²。要 3c² = 9，c² = 3。", tex: "3c^2=9\\ \\Rightarrow\\ c=\\sqrt{3}" },
          { text: "c = √3 ≈ 1.73，確實在 0 和 3 之間（−√3 也滿足 c² = 3，但不在區間裡，不算）。在那一點切線恰好平行整段的割線。" }
        ]
      },
      checks: [
        {
          ask: "均值定理說的那個 c 是什麼？",
          options: [
            { label: "區間的中點", why: "c 在哪裡要算。x² 在 [0, 2] 剛好是中點 1，但 x³ 在 [0, 3] 是 √3，不是 1.5。" },
            { label: "某一點，它的切線斜率等於兩端點割線的斜率", correct: true },
            { label: "f 最大值出現的地方", why: "那是上一課的極值。均值定理講的是「斜率剛好等於平均」的點。" }
          ]
        },
        {
          ask: "f′(x) = 0 對所有 x 成立。f 是？",
          options: [
            { label: "常數函數", correct: true },
            { label: "f(x) = 0", why: "斜率是 0 表示走不動，但可以停在任何高度：f(x) = 7 也符合。" },
            { label: "遞增函數", why: "遞增要 f′ > 0；f′ = 0 是平的。" }
          ]
        },
        {
          ask: "F′(x) = G′(x) = 2x。F 和 G 的關係？",
          options: [
            { label: "F = G", why: "x² 和 x² + 5 的導數都是 2x，但兩個不相等。只能說差一個常數。" },
            { label: "沒有關係", why: "導數相同的函數只差一個常數——這是均值定理的推論，也是 +C 的來源。" },
            { label: "F(x) = G(x) + 某個常數", correct: true }
          ]
        }
      ],
      practice: []
    },
    {
      id: "c8-antiderivative",
      unit: "integrals",
      title: "第 14 課 · 積分是微分的反操作",
      minutes: 7,
      goal: "∫ f(x) dx 問的是「誰微分之後會變成 f」；冪次法則倒著用，記得 +C。",
      concept: [
        { text: "微分是「給函數，求斜率」。積分先當成它的反操作：「給斜率，找回函數」。誰微分之後是 2x？x²。所以 ∫ 2x dx = x²。這種「找回來的函數」叫反導函數。" },
        { text: "但 x² + 5 微分也是 2x，x² − 100 也是。常數微分掉了，找回來的時候不知道原本是多少——所以答案要加一個 + C。", tex: "\\int 2x\\,dx=x^2+C" },
        { text: "冪次法則倒著用：指數加 1，再除以新的指數。例外是 n = −1（除以 0 不行）：誰微分之後是 1/x？第 9 課記過 (ln x)′ = 1/x，所以 ∫ 1/x dx = ln|x| + C——加絕對值是因為 x 負的時候 ln x 不存在，而 ln|x| 的導數也還是 1/x。", tex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad(n\\ne -1),\\qquad \\int\\frac1x\\,dx=\\ln|x|+C" },
        { text: "連鎖律倒過來：微分 sin(3x) 時多乘了一個 3，所以積分 cos(3x) 時要除回去——∫ cos(3x) dx = sin(3x)/3 + C；同理 ∫ e^{2x} dx = e^{2x}/2 + C。裡面有 ax，就除以 a。裡面只是平移（x + 1 這種，導數是 1）就直接照抄：∫ 1/(1 + x) dx = ln|1 + x| + C。", tex: "\\int e^{ax}\\,dx=\\frac{e^{ax}}{a}+C,\\qquad\\int\\cos(ax)\\,dx=\\frac{\\sin(ax)}{a}+C" },
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
      title: "第 15 課 · 定積分是面積",
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
    },
    {
      id: "int-riemann-ftc",
      unit: "integrals",
      title: "第 16 課 · 為什麼面積可以用反導函數算：黎曼和與基本定理",
      minutes: 9,
      goal: "定積分本來的定義是「切成無限多條細長條加起來」；微積分基本定理說這個和等於 F(b) − F(a)。這一課講兩件事為什麼會一樣。",
      concept: [
        { text: "上一課直接用了 F(b) − F(a)。但「面積」一開始跟反導函數毫無關係：把 [a, b] 切成 n 條，每條寬 Δx，高是那條的 f(xᵢ)，長條面積加起來，再讓 n 越切越多。這個和叫黎曼和，它的極限才是定積分真正的定義。", tex: "\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{i=1}^{n} f(x_i)\\,\\Delta x" },
        { text: "試算一次：y = x 從 0 到 1，切 4 條、每條取右端點的高：高是 1/4、2/4、3/4、1，寬 1/4，和 = (1 + 2 + 3 + 4)/16 = 10/16 = 0.625。真正的面積是三角形的 1/2；切越細越接近，下面的示範會切 n 條看它真的變成 1/2。" },
        { text: "為什麼會等於 F(b) − F(a)？令 A(x) = 從 a 到 x 的面積。x 再往右走一小步 h，面積多了一條寬 h、高差不多是 f(x) 的長條：A(x + h) − A(x) ≈ f(x) · h。除以 h、讓 h → 0，就是第 8 課的導數定義——得到 A′(x) = f(x)。面積函數的導數就是被積函數。這是基本定理的第一部分。", tex: "A(x)=\\int_a^x f(t)\\,dt\\ \\Rightarrow\\ A'(x)=f(x)" },
        { text: "既然 A′ = f，A 就是 f 的一個反導函數，跟任何一個反導函數 F 只差常數（第 13 課的推論）。A(a) = 0（從 a 到 a 沒有面積），所以那個常數是 −F(a)，A(x) = F(x) − F(a)。代 x = b：面積 = F(b) − F(a)。第二部分就這樣證完了。", tex: "\\int_a^b f(x)\\,dx=A(b)=F(b)-F(a)" },
        { text: "這是整個微積分的核心：微分（斜率）和積分（面積）互為反操作。牛頓與萊布尼茲最大的貢獻不是發明它們——面積和切線古希臘就在算——而是發現它們是同一件事的兩面。" }
      ],
      worked: {
        tex: "\\text{用黎曼和算 } \\int_0^1 x\\,dx\\text{，再跟基本定理對一次}",
        steps: [
          { text: "切 n 條，每條寬 1/n。第 i 條取右端點 xᵢ = i/n，高 f(xᵢ) = i/n。" },
          { text: "把 n 條的面積加起來：1 + 2 + … + n = n(n + 1)/2。", tex: "\\sum_{i=1}^{n}\\frac{i}{n}\\cdot\\frac1n=\\frac{1}{n^2}\\cdot\\frac{n(n+1)}{2}=\\frac12+\\frac{1}{2n}" },
          { text: "n → ∞ 時 1/(2n) → 0，和 → 1/2。切 4 條是 0.625，切 100 條是 0.505，越切越靠近 1/2。" },
          { text: "基本定理：F(x) = x²/2，F(1) − F(0) = 1/2。兩條路答案一樣——這就是定理說的事。", tex: "\\int_0^1 x\\,dx=\\frac12" }
        ]
      },
      checks: [
        {
          ask: "黎曼和裡的一項 f(xᵢ) · Δx 是什麼？",
          options: [
            { label: "曲線在那一點的斜率", why: "斜率是微分的事。這裡是高 f(xᵢ) 乘寬 Δx——一條細長條的面積。" },
            { label: "一條細長條的面積（高乘寬）", correct: true },
            { label: "整塊面積", why: "那是全部加起來、再讓 n → ∞ 之後的東西。一項只是其中一條。" }
          ]
        },
        {
          ask: "A(x) = ∫₀ˣ t² dt。A′(x) 是？",
          options: [
            { label: "x³/3", why: "那是 A(x) 本身（反導函數代 x 減代 0）。它的導數要再微一次，回到 x²。" },
            { label: "2x", why: "面積函數的導數是被積函數本身（t² 代 x），不是被積函數再微分一次。" },
            { label: "x²", correct: true }
          ]
        },
        {
          ask: "基本定理說的「微分與積分互為反操作」是指？",
          options: [
            { label: "先積分再微分（A′ = f）會回到原本的函數", correct: true },
            { label: "面積永遠等於 f(b) − f(a)", why: "是 F(b) − F(a)，F 是反導函數，不是 f 本身。∫₀¹ x² dx = 1/3，不是 1 − 0。" },
            { label: "微分和積分互相抵消，所以只要學一個", why: "會抵消正是它們有用的原因：算面積可以繞道去找反導函數，而不用真的切無限多條。" }
          ]
        }
      ],
      practice: []
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

  const UNITS = [["functions", "函數"], ["limits", "極限與連續"], ["derivatives", "微分"], ["integrals", "積分"]];
  const UNIT_LABEL = Object.fromEntries(UNITS);

  function create(deps) {
    const { escapeHtml, escapeAttr, icon, referenceAnswerHTML } = deps;

    const lessons = () => (Array.isArray(window.BUZZ_COURSE) ? window.BUZZ_COURSE : []);
    const lesson = (id) => lessons().find((item) => item.id === id) || null;
    const problems = () => (Array.isArray(window.BUZZ_PROBLEMS) ? window.BUZZ_PROBLEMS : []);
    const problem = (id) => problems().find((item) => item.id === id) || null;
    /** 這題是哪一課教的（回饋裡用來給「回去看第 n 課」的連結） */
    const problemLesson = (problemId) => lessons().find((item) => item.practice.includes(problemId) || (item.worked && item.worked.problemId === problemId)) || null;

    /** 理論課：沒有題庫練習（函數是什麼、定理），小測全對就算完成 */
    const isTheory = (item) => Boolean(item) && !(item.practice || []).length;
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
                <h2>微積分的 ${all.length} 課</h2>
                <p>還沒學過也沒關係。每課 6–9 分鐘，照課本的順序走：函數 → 極限與連續 → 微分 → 積分。計算課是白話概念 → 一題逐步示範 → 小測 → 三題不倒數的練習；理論課（函數是什麼、中間值定理、極值、均值定理、基本定理）沒有練習題，示範是一段推導，小測全對就算完成。上完考畢業關，再去走主線關卡。</p>
              </div>
              <div class="action-row">
                ${summary.next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(summary.next.id)}">${icon("play")}${summary.done ? "繼續" : "從第 1 課開始"}：${escapeHtml(summary.next.title.replace(/^第 \d+ 課 · /, ""))}</button>` : (graduated(records) ? `<button class="button home-primary" data-action="open-train">${icon("target")}畢業了，去走主線</button>` : `<button class="button home-primary" data-action="course-graduation">${icon("play")}${all.length} 課上完了，考畢業關</button>`)}
                <button class="button secondary" data-action="home">${icon("home")}回主線</button>
              </div>
            </div>
            <div class="course-progress"><strong>${summary.done}<small> / ${summary.total} 課</small></strong><i style="--pct:${summary.total ? Math.round(summary.done / summary.total * 100) : 0}%"></i></div>
            ${renderGraduationCard(records)}
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
                          <em>${item.minutes} 分鐘${isTheory(item) ? " · 理論課" : ""}${state === "started" ? " · 進行中" : state === "done" ? " · 完成" : ""}</em>
                        </button>`;
                    }).join("")}
                  </div>
                </section>`;
            }).join("")}
          </section>
        </main>`;
    }

    // 揭下一步之前先猜：兩個選項，一個是真的下一步、一個是同一題別的步驟。
    // 猜過再看，記憶比被動看深得多（測試效應）；猜錯也照樣揭，只是多一句「其實是這個」。
    // 「直接看」的按鈕留著（course-step）：不想猜的人、還有 E2E 都靠它。
    function renderStepGuess(item, revealed, state) {
      const steps = item.worked.steps;
      const next = steps[revealed];
      const decoyIndex = revealed + 1 < steps.length ? revealed + 1 : revealed - 1;
      const decoy = decoyIndex >= 0 ? steps[decoyIndex] : null;
      const brief = (step) => { const text = step.text.replace(/\s+/g, " "); return text.length > 46 ? `${text.slice(0, 46)}…` : text; };
      const plain = `<button class="button secondary" data-action="course-step">${icon("chevron-down")}${revealed ? "直接看下一步" : "直接看第一步"}<small>${revealed} / ${steps.length}</small></button>`;
      if (!decoy) return plain;
      const verdict = state.lastGuess === true ? `<p class="course-check-why is-right">${icon("check")}猜對了，就是這一步。</p>` : state.lastGuess === false ? `<p class="course-check-why">其實是另一個 —— 上面新揭的那一步才是。</p>` : "";
      const swap = (revealed + item.id.length) % 2 === 1;
      const option = (step, ok) => `<button type="button" class="course-option" data-action="course-guess" data-ok="${ok ? 1 : 0}">${escapeHtml(brief(step))}</button>`;
      const options = swap ? option(decoy, false) + option(next, true) : option(next, true) + option(decoy, false);
      return `
        ${verdict}
        <div class="course-check course-guess">
          <p class="course-check-ask">先猜：${revealed ? "下一步" : "第一步"}該做什麼？</p>
          <div class="course-check-options">${options}</div>
          <div class="action-row">${plain}</div>
        </div>`;
    }

    // state = { revealed: 示範揭到第幾步, picks: { [checkIndex]: optionIndex }, lastGuess: 上一次猜對沒 }
    function renderLesson(item, records, state) {
      if (!item) return null;
      const all = lessons();
      const index = all.indexOf(item);
      const entry = entryOf(records, item.id);
      const theory = isTheory(item);
      // 計算課的示範是題庫的題（有 problemId、答案沿用題庫）；理論課的示範是一段推導（worked.tex 當題目）
      const worked = item.worked && item.worked.problemId ? problem(item.worked.problemId) : null;
      const workedTex = worked ? worked.prompt : (item.worked && item.worked.tex) || "";
      const revealed = Math.max(0, Math.min(item.worked.steps.length, state.revealed || 0));
      const picks = state.picks || {};
      const allChecksRight = item.checks.every((check, i) => picks[i] !== undefined && check.options[picks[i]] && check.options[picks[i]].correct);
      const checksPassed = Boolean(entry.checksPassed) || allChecksRight;
      const practiceDone = Boolean(entry.practiceDone);
      const practiceProblems = item.practice.map(problem).filter(Boolean);
      const next = all[index + 1] || null;
      const nextButton = next
        ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("chevron-right")}下一課：${escapeHtml(next.title.replace(/^第 \d+ 課 · /, ""))}</button>`
        : `<button class="button home-primary" data-action="course-graduation">${icon("play")}${all.length} 課上完了，考畢業關</button>`;
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
              <p class="section-label">② ${theory ? "逐步推導" : "逐步示範"} · 一步一步揭</p>
              ${workedTex ? `
                <div class="pl-goal math-block" data-tex="${escapeAttr(workedTex)}"></div>
                <ol class="course-steps">${item.worked.steps.slice(0, revealed).map(stepHtml).join("")}</ol>
                ${revealed < item.worked.steps.length
                  ? renderStepGuess(item, revealed, state)
                  : (worked ? `<p class="course-answer">${icon("check")}答案：${referenceAnswerHTML(worked)}</p>` : `<p class="course-answer">${icon("check")}推導完了。</p>`)}` : `<p class="panel-note">示範題找不到（${escapeHtml(item.worked.problemId || "")}）。</p>`}
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

            ${theory ? `
            <section class="course-block" data-course-practice>
              <p class="section-label">④ 這一課是理論課，沒有練習題</p>
              <p class="panel-note">題庫裡沒有「函數是什麼」「定理說了什麼」這種題——它們不是反射題。這一課的概念會在後面的課一直用到；小測全對就算完成。</p>
              <div class="action-row">
                ${checksPassed ? `<span class="course-done-pill">${icon("check")}小測全對</span>${nextButton}` : `<span class="panel-note">小測全對，這一課就算完成。</span>`}
              </div>
            </section>` : `
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
                  ? `${nextButton}${extensionPool(item.id).length ? `<button class="button ghost" data-action="course-extension" data-lesson-id="${escapeAttr(item.id)}">${icon("zap")}延伸挑戰：一題 R2</button>` : ""}`
                  : `<span class="panel-note">${checksPassed ? "練完這三題就算完成這一課。" : "小測答對、練習做完，這一課就算完成。"}</span>`}
              </div>
            </section>`}
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
          [course.next ? `上${course.next.title.split(" · ")[0]}：${course.next.title.split(" · ")[1] || ""}` : `${course.total} 課都上完了`, "白話概念 → 逐步示範 → 小測 → 3 題練習", "open-course"],
          ["練完就有能力輪廓", "哪些概念穩、哪些還卡，數據頁看得到", "open-insights"],
          ["畢業關 10 題，過了再走主線", "只出學過的題；主線頭三局也是，不倒數", "open-course"]
        ];
        return `
          <section class="first-steps" aria-label="開始的三步">
            ${steps.map(([title, note, action], index) => `
              <button type="button" class="first-step ${index === (course.next ? 0 : 2) ? "is-current" : ""}" data-action="${action}">
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
          ["證明訓練與國際難題", "白話證明的高手路線、競賽風格、經典解析", "open-proofs"]
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

    // 首頁主卡：還沒學過的人在課上完之前，主 CTA 是「接著上課」，不是 15 題每日訓練
    function renderHomeCard(records) {
      const summary = progress(records);
      if (!summary.next) {
        const grad = graduation(records);
        if (grad && grad.passed) return "";
        return `
          <section class="today-card course-home-card">
            <div class="today-card-head"><p class="section-label">${icon("book-open")}從零開始 · ${summary.total} 課都完成了</p><span>約 10 分鐘</span></div>
            <h2>${grad ? `畢業關再考一次（上次 ${grad.correct} / ${grad.total}）` : "畢業關：10 題，8 題過關"}</h2>
            <p>只出課裡教過的東西，不倒數。過了就去主線第 1 關——頭三局也只出你學過的題。</p>
            <div class="action-row"><button class="button home-primary" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button><button class="button secondary" data-action="open-course">${icon("list")}課程表</button></div>
          </section>`;
      }
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
          <p class="panel-note">${isTheory(item) ? "理論課：白話概念 → 一段逐步推導 → 小測。" : "白話概念 → 一題逐步示範 → 小測 → 3 題不倒數的練習。"}${summary.total} 課上完考畢業關，再走主線。</p>
        </section>`;
    }

    /* ── 橋：課程 → 主線之間不能是懸崖 ──────────────────────────────────
       課裡教的是題庫 R1 的一個子集。上完課直接丟進主線第 1 關，第一題就可能是
       有理化或反三角——沒教過，信心當場塌掉。所以：
       (1) 「橋池」= R1、三個題目單元、不是技巧辨識文字題、而且沒有課裡沒教的標籤；
       (2) 畢業關：10 題橋池的題，8 題過關；
       (3) 保護期：沒學過的人在畢業前、以及畢業後頭三局，所有訓練都只從橋池抽。
       log 與 product-rule 從 2026-09-16 起有教（第 6、9、10、14 課），不再排除。 */
    const BRIDGE_TOPICS = ["limits", "derivatives", "integrals"];
    const UNCOVERED_TAGS = ["rationalize", "inverse-trig", "world-universities"];
    const GRADUATION_TOTAL = 10;
    const GRADUATION_PASS = 8;
    const PROTECTED_SESSIONS_AFTER = 3;

    // 用校準後的 rank（沒有才退回 difficulty）：模板題 difficulty 寫 1、瀏覽器端校準完 rank 是 2，
    // 只看 difficulty 會把 R2 漏進畢業關（E2E 抓到 tmpl-int-linear-004 的 chip 是「基礎 R2/6」）
    const inBridge = (p) => Boolean(p) && Number(p.rank || p.difficulty) === 1 && BRIDGE_TOPICS.includes(p.topic) && p.answerKind !== "text"
      && !(p.tags || []).some((tag) => UNCOVERED_TAGS.includes(tag));
    const bridgePool = (all) => (all || problems()).filter(inBridge);

    const graduation = (records) => records.courseGraduation || null;
    const graduated = (records) => Boolean(graduation(records) && graduation(records).passed);

    // 畢業前、畢業後頭三局：只從橋池抽。回傳 null 表示不用管
    function protectPool(pool, records) {
      if ((records.onboardingContext || "") !== "newbie") return null;
      const grad = graduation(records);
      if (grad && grad.passed) {
        // 畢業關那一局本身也會寫進 history（在 _graduation.at 之後），所以扣掉 1
        const after = (records.history || []).filter((item) => item.finishedAt && item.finishedAt > grad.at).length - 1;
        if (after >= PROTECTED_SESSIONS_AFTER) return null;
      }
      const kept = (pool || []).filter(inBridge);
      return kept.length >= 4 ? kept : null;
    }

    // 畢業關的 10 題：4 極限、3 微分、3 積分，先用課裡沒出過的題，種子決定順序
    function graduationSet(seed) {
      const used = new Set(lessons().flatMap((item) => item.practice.concat(item.worked && item.worked.problemId ? [item.worked.problemId] : [])));
      const hash = (text) => { let h = 2166136261; for (const ch of `${seed}:${text}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; };
      const quota = { limits: 4, derivatives: 3, integrals: 3 };
      const pool = bridgePool();
      const picked = [];
      BRIDGE_TOPICS.forEach((topic) => {
        const candidates = pool.filter((p) => p.topic === topic).sort((a, b) => (used.has(a.id) - used.has(b.id)) || (hash(a.id) - hash(b.id)));
        picked.push(...candidates.slice(0, quota[topic]));
      });
      return picked.sort((a, b) => hash(a.id) - hash(b.id));
    }

    function graduationVerdict(correct, total) {
      const passed = correct >= GRADUATION_PASS;
      return {
        passed,
        verdict: passed ? "畢業了" : "再回去看一眼",
        verdictClass: passed ? "is-gold" : "is-neutral",
        nextLine: passed
          ? `${correct} / ${total}。課裡教的東西你會用了。接下來走主線第 1 關：頭三局還是只出你學過的題、不倒數。`
          : `${correct} / ${total}，過關要 ${GRADUATION_PASS} 題。答錯的題下面都寫著是哪一課教的——回去看那幾課，再考一次。`
      };
    }

    function renderGraduationActions(records) {
      const grad = graduation(records);
      const passed = Boolean(grad && grad.passed);
      return `
        <div class="action-row">
          ${passed
            ? `<button class="button" data-action="open-train">${icon("target")}去走主線第 1 關</button>
               <button class="button secondary" data-action="open-course">${icon("list")}課程表</button>`
            : `<button class="button" data-action="open-course">${icon("book-open")}回課程表看那幾課</button>
               <button class="button secondary" data-action="course-graduation">${icon("refresh")}再考一次</button>`}
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>`;
    }

    // 課程表最底下：所有課都完成才出現的畢業關
    function renderGraduationCard(records) {
      const summary = progress(records);
      const grad = graduation(records);
      if (summary.done < summary.total) {
        return `<section class="course-graduation is-locked"><p class="section-label">畢業關</p><strong>${summary.total} 課都完成後解鎖</strong><small>${GRADUATION_TOTAL} 題只出課裡教過的東西，${GRADUATION_PASS} 題過關；過了再走主線，主線頭三局也只出你學過的題。</small></section>`;
      }
      if (grad && grad.passed) {
        return `<section class="course-graduation is-passed"><p class="section-label">畢業關</p><strong>${icon("check")}畢業了 · ${grad.correct} / ${grad.total}</strong><small>主線第 1 關等你；頭三局只出學過的題、不倒數。</small><div class="action-row"><button class="button home-primary" data-action="open-train">${icon("target")}去走主線第 1 關</button><button class="button ghost" data-action="course-graduation">${icon("refresh")}再考一次</button></div></section>`;
      }
      return `<section class="course-graduation"><p class="section-label">畢業關</p><strong>${grad ? `上次 ${grad.correct} / ${grad.total}，再來一次` : `${GRADUATION_TOTAL} 題，${GRADUATION_PASS} 題過關`}</strong><small>只出課裡教過的東西，不倒數、可看提示。答錯的題會告訴你是哪一課教的。</small><div class="action-row"><button class="button home-primary" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button></div></section>`;
    }

    /* ── 新手保護期的第一份訓練：不管配方排了幾題，取 8 題、由淺入深 ──
       19 題對第一次來的人太長，而且配方上「7 到期複習 · 8 弱點」對什麼都沒做過的人是補位填出來的假數字。
       topics（高中先修＝極限＋微分）給了就只在那裡面抽：級數對他們是「還沒學」，不是練習；
       配方裡這兩科不滿 8 題的日子（planner 照日期抽）從題庫 R1 補到 8，不然首頁卡上會寫 7 題。 */
    const GENTLE_FIRST_COUNT = 8;
    function gentleTrim(list, topics, rank) {
      const scoped = topics ? list.filter((problem) => topics.includes(problem.topic)) : list;
      let base = scoped.length >= Math.min(GENTLE_FIRST_COUNT, 4) ? scoped : list;
      if (topics && base.length < GENTLE_FIRST_COUNT) {
        const have = new Set(base.map((problem) => problem.id));
        base = base.concat(problems().filter((problem) => topics.includes(problem.topic) && problem.difficulty === 1 && problem.answerKind !== "text" && !have.has(problem.id)).slice(0, GENTLE_FIRST_COUNT - base.length));
      }
      return base
        .map((problem, index) => ({ problem, index }))
        .sort((a, b) => (rank(a.problem) - rank(b.problem)) || (a.index - b.index))
        .map((entry) => entry.problem)
        .slice(0, GENTLE_FIRST_COUNT);
    }

    /* ── 紀錄的變更：純函式，改完回傳同一個 records，app.js 負責 load / save ── */
    const now = () => new Date().toISOString();
    const markOpened = (records, id) => {
      const entry = records.course[id] || {};
      records.course[id] = { ...entry, openedAt: entry.openedAt || now() };
      return records;
    };
    // 計算課：小測過 + 練習做完；理論課：小測過就算完成
    const markDone = (records, id) => {
      const entry = records.course[id] || {};
      const practiced = entry.practiceDone || isTheory(lesson(id));
      if (entry.checksPassed && practiced && !entry.doneAt) records.course[id] = { ...entry, doneAt: now() };
      return records;
    };
    const markChecksPassed = (records, id) => {
      records.course[id] = { ...(records.course[id] || {}), checksPassed: true };
      return markDone(records, id);
    };
    const recordPractice = (records, id, correct, total) => {
      records.course[id] = { ...(records.course[id] || {}), practiceDone: true, practiceCorrect: correct, practiceTotal: total, practicedAt: now() };
      return markDone(records, id);
    };
    // passed 一旦 true 就不退回；at 每考一次更新，保護期從最近一次算
    const recordGraduation = (records, correct, total) => {
      const previous = records.courseGraduation || { passed: false, attempts: 0 };
      records.courseGraduation = { at: now(), correct, total, passed: Boolean(previous.passed) || correct >= GRADUATION_PASS, attempts: (previous.attempts || 0) + 1 };
      return records;
    };
    const allChecksRight = (item, picks) => item.checks.every((check, i) => {
      const pick = picks[i];
      return pick !== undefined && check.options[pick] && check.options[pick].correct;
    });
    const practicePool = (id) => {
      const item = lesson(id);
      return item ? item.practice.map((problemId) => problems().find((problem) => problem.id === problemId)).filter(Boolean) : [];
    };
    // 每課結尾的延伸挑戰：同單元一題 R2（不倒數、可跳過）。課上完不該只是「看完」。
    // 同一課永遠是同一題（用課的序號挑），練過的人回來才不會覺得被換題。
    const EXTENSION_TOPIC = { functions: "limits", limits: "limits", derivatives: "derivatives", integrals: "integrals" };
    const extensionPool = (id) => {
      const item = lesson(id);
      if (!item) return [];
      const topic = EXTENSION_TOPIC[item.unit] || item.unit;
      const pool = problems().filter((p) => Number(p.rank || p.difficulty) === 2 && p.topic === topic && p.answerKind !== "text" && !(p.tags || []).some((tag) => UNCOVERED_TAGS.includes(tag)));
      if (!pool.length) return [];
      return [pool[(number(item) * 7) % pool.length]];
    };

    return { lessons, lesson, isTheory, problemLesson, progress, renderIndex, renderLesson, renderFirstSteps, renderResultsActions, renderFeedbackLink, renderHomeCard, inBridge, bridgePool, uncoveredTags: UNCOVERED_TAGS, protectPool, graduationSet, graduationVerdict, graduation, graduated, renderGraduationActions, renderGraduationCard, markOpened, markChecksPassed, recordPractice, recordGraduation, allChecksRight, practicePool, extensionPool, gentleTrim };
  }

  window.BuzzCourseUI = { create };
})();
