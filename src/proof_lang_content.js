// 白話證明的題目：每題一份 spec 給 kernel/proof_lang.js 檢查。
//
//   goal.relation  可以代入取樣的目標關係式（歸納、不等式、恆等式用它）
//   goal.text      目標的文字別名（極限這種寫不成關係式的，用字面對）
//   vars           取樣範圍；int 表示整數
//   functions      spec 專用的可計算函數（S(n) = 1+…+n 之類，讓「…」有辦法算）
//   macros         把使用者寫的「1+2+...+n」改寫成 S(n)
//   skeleton       這題必須出現的骨架：epsilon-delta / induction / cases / contradiction / direct
//   reference      參考證明 —— tools/validate_proof_lang.js 要求它全綠，而且刪一行就不能全綠
//
// 內容原則：每一題的參考證明都是「一個大一學生會寫的句子」，不是為了討好檢查器寫的。

(function () {
  "use strict";

  const sum = (n) => { let total = 0; for (let i = 1; i <= Math.round(n); i += 1) total += i; return total; };
  const sumSquares = (n) => { let total = 0; for (let i = 1; i <= Math.round(n); i += 1) total += i * i; return total; };
  const sumOdd = (n) => { let total = 0; for (let i = 1; i <= Math.round(n); i += 1) total += 2 * i - 1; return total; };
  const geometric = (r, n) => { let total = 0; for (let i = 0; i <= Math.round(n); i += 1) total += Math.pow(r, i); return total; };

  window.BUZZ_PROOF_LANG_PROBLEMS = [
    {
      id: "pl-limit-linear",
      family: "epsilon-delta",
      title: "ε-δ：線性函數的極限",
      difficulty: 1,
      statement: "用 ε-δ 定義證明 lim_{x→2} 3x = 6。",
      prompt: "\\lim_{x\\to 2} 3x = 6",
      vars: { x: { min: -4, max: 8 }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{x->2} 3x = 6", "lim_{x->2}(3x)=6", "lim x->2 3x = 6", "3x 在 x->2 的極限是 6", "3x→6"] },
      bound: { lhs: "abs(3*x-6)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = ε/3。",
        "假設 0 < |x − 2| < δ。",
        "則 |3x − 6| = 3|x − 2| < 3δ = ε。",
        "所以 lim_{x→2} 3x = 6。"
      ],
      coach: "ε-δ 的四步：給 ε、造 δ、假設 |x−a|<δ、推出 |f(x)−L|<ε。δ 要用 ε 寫出來。"
    },
    {
      id: "pl-limit-square",
      optional: [3],
      family: "epsilon-delta",
      title: "ε-δ：x² 在 x→3 的極限",
      difficulty: 2,
      statement: "用 ε-δ 定義證明 lim_{x→3} x² = 9。（提示：先把 δ 限制在 1 以內，控制 |x+3|。）",
      prompt: "\\lim_{x\\to 3} x^2 = 9",
      vars: { x: { min: 0, max: 6 }, eps: { min: 0.05, max: 3 } },
      goal: { text: ["lim_{x->3} x^2 = 9", "lim_{x->3}(x^2)=9", "lim x->3 x^2 = 9", "x^2→9"] },
      bound: { lhs: "abs(x^2-9)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = min(1, ε/7)。",
        "假設 0 < |x − 3| < δ。",
        "因為 δ <= 1，所以 |x + 3| <= |x − 3| + 6 < 7。",
        "則 |x² − 9| = |x − 3| |x + 3| < 7δ <= ε。",
        "所以 lim_{x→3} x² = 9。"
      ],
      coach: "|x²−9| = |x−3||x+3|：|x−3| 由 δ 控制，|x+3| 要先用 δ ≤ 1 綁住。"
    },
    {
      id: "pl-amgm",
      optional: [0,2],
      family: "direct",
      title: "兩數的算幾不等式",
      difficulty: 1,
      statement: "證明對所有 a, b ≥ 0，(a + b)/2 ≥ √(ab)。",
      prompt: "\\frac{a+b}{2}\\ge\\sqrt{ab}\\quad(a,b\\ge 0)",
      vars: { a: { min: 0, max: 9 }, b: { min: 0, max: 9 } },
      given: ["a >= 0", "b >= 0"],
      goal: { relation: "(a+b)/2 >= sqrt(a*b)" },
      skeleton: "direct",
      reference: [
        "設 a, b ≥ 0。",
        "則 (√a − √b)² ≥ 0。",
        "展開得 a − 2√(ab) + b ≥ 0。",
        "所以 (a + b)/2 ≥ √(ab)。"
      ],
      coach: "從一個平方 ≥ 0 出發，展開就是要的不等式。"
    },
    {
      id: "pl-abs-triangle",
      optional: [0,1],
      family: "cases",
      title: "絕對值的三角不等式",
      difficulty: 2,
      statement: "證明對所有實數 x, y，|x + y| ≤ |x| + |y|。",
      prompt: "|x+y|\\le |x|+|y|",
      vars: { x: { min: -5, max: 5 }, y: { min: -5, max: 5 } },
      goal: { relation: "abs(x+y) <= abs(x)+abs(y)" },
      skeleton: "cases",
      reference: [
        "設 x, y 為實數。",
        "分兩種情況。",
        "情況一：x + y ≥ 0。",
        "則 |x + y| = x + y ≤ |x| + |y|。",
        "情況二：否則。",
        "則 |x + y| = −(x + y) = (−x) + (−y) ≤ |x| + |y|。",
        "故 |x + y| ≤ |x| + |y|。"
      ],
      coach: "絕對值的證明常常就是拆開正負兩種情況；「否則」會自動當成補集。"
    },
    {
      id: "pl-induction-sum",
      optional: [0],
      family: "induction",
      title: "歸納法：1 + 2 + … + n",
      difficulty: 1,
      statement: "證明對所有正整數 n，1 + 2 + … + n = n(n+1)/2。",
      prompt: "1+2+\\cdots+n=\\frac{n(n+1)}{2}",
      vars: { n: { min: 1, max: 15, int: true } },
      functions: { S: sum },
      macros: [{ pattern: "1\\s*\\+\\s*2\\s*\\+\\s*\\.\\.\\.\\s*\\+\\s*\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?", replace: "S($1)" }],
      goal: { relation: "S(n) = n*(n+1)/2" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "用歸納法。",
        "當 n = 1 時，左式 = 1，右式 = 1·2/2 = 1，成立。",
        "假設 n = k 時成立，即 1 + 2 + ... + k = k(k+1)/2。",
        "則 1 + 2 + ... + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2。",
        "故對所有正整數 n，1 + 2 + ... + n = n(n+1)/2。"
      ],
      coach: "歸納三件套：基底、歸納假設、n = k+1 的鏈。「1 + 2 + ... + k」我看得懂，會當成 S(k) 來算。"
    },
    {
      id: "pl-induction-odd",
      optional: [0],
      family: "induction",
      title: "歸納法：奇數和",
      difficulty: 1,
      statement: "證明對所有正整數 n，1 + 3 + 5 + … + (2n−1) = n²。",
      prompt: "1+3+5+\\cdots+(2n-1)=n^2",
      vars: { n: { min: 1, max: 15, int: true } },
      functions: { O: sumOdd },
      macros: [{ pattern: "1\\s*\\+\\s*3\\s*\\+\\s*(5\\s*\\+\\s*)?\\.\\.\\.\\s*\\+\\s*\\(2\\s*\\*?\\s*\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?\\s*-\\s*1\\)", replace: "O($2)" }],
      goal: { relation: "O(n) = n^2" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1，右式 = 1，成立。",
        "假設 n = k 時成立，即 1 + 3 + ... + (2k−1) = k²。",
        "則 1 + 3 + ... + (2(k+1)−1) = k² + (2k+1) = (k+1)²。",
        "故對所有正整數 n 成立，1 + 3 + ... + (2n−1) = n²。"
      ],
      coach: "下一個奇數是 2k+1；k² + 2k + 1 剛好是 (k+1)²。"
    },
    {
      id: "pl-bernoulli",
      optional: [0],
      family: "induction",
      title: "歸納法：Bernoulli 不等式",
      difficulty: 2,
      statement: "證明對所有正整數 n 與 h ≥ −1，(1 + h)^n ≥ 1 + nh。",
      prompt: "(1+h)^n\\ge 1+nh\\quad(h\\ge -1)",
      vars: { n: { min: 1, max: 12, int: true }, h: { min: -1, max: 3 } },
      given: ["h >= -1"],
      goal: { relation: "(1+h)^n >= 1+n*h" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1 + h，右式 = 1 + h，成立。",
        "假設 n = k 時成立，即 (1+h)^k ≥ 1 + kh。",
        "因為 1 + h ≥ 0，所以 (1+h)^(k+1) = (1+h)^k (1+h) ≥ (1+kh)(1+h)。",
        "則 (1+kh)(1+h) = 1 + (k+1)h + kh² ≥ 1 + (k+1)h。",
        "故 (1+h)^n ≥ 1 + nh。"
      ],
      coach: "乘上 (1+h) 時方向不能反 —— 所以要先說 1+h ≥ 0。"
    },
    {
      id: "pl-mvt-constant",
      optional: [0],
      family: "direct",
      title: "導數恆為零則函數為常數",
      difficulty: 2,
      statement: "設 f 在區間 I 上可微且 f′(x) = 0 對所有 x ∈ I。證明 f 在 I 上為常數。",
      prompt: "f'(x)=0\\ \\forall x\\in I\\ \\Rightarrow\\ f\\text{ is constant on }I",
      vars: {},
      goal: { text: ["f(x) = f(y)", "f(x)=f(y)", "f 為常數", "f 是常數", "f is constant", "f在I上為常數", "f 在 I 上為常數"] },
      skeleton: "direct",
      reference: [
        "任取 x, y ∈ I 且 x < y。",
        "由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。",
        "因為 f'(c) = 0，所以 f(y) − f(x) = 0。",
        "故 f(x) = f(y)，即 f 在 I 上為常數。"
      ],
      coach: "抽象的 f 我沒辦法取樣，這題靠的是規則形狀：平均值定理那一句要寫成 f(y) − f(x) = f′(c)(y − x)。",
      allowUnsure: true
    },
    {
      id: "pl-squeeze-sin",
      optional: [0,1],
      family: "direct",
      title: "夾擠：x·sin(1/x) 的極限",
      difficulty: 2,
      statement: "證明 lim_{x→0} x·sin(1/x) = 0。",
      prompt: "\\lim_{x\\to 0} x\\sin\\frac{1}{x}=0",
      vars: { x: { min: -2, max: 2 } },
      given: ["x != 0"],
      goal: { text: ["lim_{x->0} x*sin(1/x) = 0", "lim_{x->0} x sin(1/x) = 0", "lim x->0 x*sin(1/x) = 0", "lim_{x->0}(x*sin(1/x))=0", "x*sin(1/x)→0"] },
      skeleton: "direct",
      reference: [
        "設 x ≠ 0。",
        "因為 |sin(1/x)| ≤ 1，所以 |x sin(1/x)| = |x| |sin(1/x)| ≤ |x|。",
        "則 −|x| ≤ x sin(1/x) ≤ |x|。",
        "由夾擠定理，因為 lim_{x→0} |x| = 0，所以 lim_{x→0} x·sin(1/x) = 0。"
      ],
      coach: "夾擠要先把它夾在兩個極限相同的東西之間：−|x| 和 |x|。",
      allowUnsure: true
    },
    {
      id: "pl-sqrt2-contra",
      family: "contradiction",
      title: "反證：沒有最大的正實數小於 1",
      difficulty: 2,
      statement: "證明不存在最大的實數 m 使得 m < 1。（反證：假設有，再造一個更大的。）",
      prompt: "\\nexists\\ \\max\\{m\\in\\mathbb{R}: m<1\\}",
      vars: { m: { min: -2, max: 1 } },
      goal: { text: ["不存在最大的 m", "沒有最大的 m", "不存在最大的實數 m 使得 m < 1", "no largest m", "there is no largest m"] },
      skeleton: "contradiction",
      reference: [
        "反設 m 是最大的實數且 m < 1。",
        "取 t = (m + 1)/2。",
        "則 t > m 且 t < 1。",
        "這與 m 是最大的矛盾。",
        "故不存在最大的 m。"
      ],
      coach: "反證的關鍵是「造出一個更大的」：(m+1)/2 夾在 m 和 1 中間。",
      allowUnsure: true
    },
    {
      id: "pl-square-bound",
      optional: [0,2],
      family: "direct",
      title: "不等式鏈：x² + 1 ≥ 2x",
      difficulty: 1,
      statement: "證明對所有實數 x，x² + 1 ≥ 2x。",
      prompt: "x^2+1\\ge 2x",
      vars: { x: { min: -5, max: 5 } },
      goal: { relation: "x^2+1 >= 2*x" },
      skeleton: "direct",
      reference: [
        "設 x 為實數。",
        "則 (x − 1)² ≥ 0。",
        "展開得 x² − 2x + 1 ≥ 0。",
        "所以 x² + 1 ≥ 2x。"
      ],
      coach: "配方：把不等式兩邊移到同一邊，看出它是一個平方。"
    }
  ];
})();

// 白話證明的五課。
//
// 每一課：一段話講規則 → 一份寫好的證明（每一行旁邊是檢查器真的跑出來的註解）
// → 一個留白的練習（給開頭幾行，剩下的自己寫，即時三色回饋）。
// 課文裡引用的證明都是 proof_lang_problems.js 裡的題，教學跟題庫用同一套檢查器。

(function () {
  "use strict";

  window.BUZZ_PROOF_LANG_LESSONS = [
    {
      id: "lesson-sentences",
      title: "第 1 課 · 一行一句，每句有一種句型",
      minutes: 3,
      intro: [
        "白話證明就是把你平常會寫在紙上的證明，一行一句打出來。檢查器不是在做邏輯推演 —— 它認得十三種句型，看你每一句在做什麼。",
        "四種最常用的：「任取／設／取」引入變數或定義、「假設」加條件、「則／所以／展開得」寫代數鏈、「故 …」下結論。中英文都收（Let、Assume、Then、Hence）。",
        "每一行檢查完會有三種顏色：綠＝驗過了、黃＝看得懂但驗不了（你自己確認）、紅＝讀不懂或不成立。它不會假裝驗證了它驗不了的東西。"
      ],
      exampleId: "pl-square-bound",
      exercise: {
        id: "pl-amgm",
        starter: ["設 a, b ≥ 0。", "則 (√a − √b)² ≥ 0。"],
        task: "接著寫兩行：把平方展開，再整理成 (a + b)/2 ≥ √(ab)。可以用 √、^2、≥，也可以用 sqrt、>=。"
      }
    },
    {
      id: "lesson-chains",
      title: "第 2 課 · 代數鏈：等號與不等號串起來",
      minutes: 4,
      intro: [
        "「A = B ≤ C < D」是一條鏈。檢查器把它拆成一段一段：= 看兩邊差、< 與 ≤ 看方向，在目前的假設下隨機取一百多個點驗。",
        "所以你不用怕寫多：鏈越長，檢查器看得越清楚。一行只寫目標（「所以 x² + 1 ≥ 2x」）反而會標黃 —— 數值上對，但跟前面沒有接上。",
        "顯然的起點可以直接寫：平方 ≥ 0、|·| ≥ 0、|sin| ≤ 1。從這種東西出發，一路推到目標。"
      ],
      exampleId: "pl-amgm",
      exercise: {
        id: "pl-square-bound",
        starter: ["設 x 為實數。"],
        task: "從一個平方出發，兩到三行推到 x² + 1 ≥ 2x。試試看故意把某個 ≥ 寫成 ≤，看檢查器怎麼說。"
      }
    },
    {
      id: "lesson-epsilon",
      title: "第 3 課 · ε-δ：四步骨架",
      minutes: 5,
      intro: [
        "極限的 ε-δ 證明有固定的骨架：任取 ε > 0 → 取 δ = （用 ε 寫）→ 假設 0 < |x − a| < δ → 推出 |f(x) − L| < ε → 結論。",
        "檢查器會盯著四步有沒有到齊。δ 要真的用 ε 定義（取 δ = ε/3），因為後面那條鏈是在「|x − a| < δ」的假設下取樣驗的 —— δ 錯了，鏈的最後一段 3δ = ε 就會紅。",
        "結論那句「所以 lim_{x→2} 3x = 6」檢查器讀不出數值，它靠的是骨架到齊 + 字面對上目標。"
      ],
      exampleId: "pl-limit-linear",
      exercise: {
        id: "pl-limit-square",
        starter: ["任取 ε > 0。", "取 δ = min(1, ε/7)。", "假設 0 < |x − 3| < δ。"],
        task: "把 |x² − 9| 拆成 |x − 3||x + 3|，用 δ ≤ 1 把 |x + 3| 綁在 7 以內，推到 < ε，再下結論。"
      }
    },
    {
      id: "lesson-cases",
      title: "第 4 課 · 分情況與反證",
      minutes: 5,
      intro: [
        "「分兩種情況。」之後每一個「情況一：條件」都會把取樣限制在那個條件下；「情況二：否則」自動當成前面的補集。每一種情況都要走到目標，最後再一句「故 …」總結。",
        "反證法：「反設 …」把目標取反當假設，之後推到「矛盾」。檢查器認得三種算得出來的矛盾：反設之下抽不到任何點、推出一個對所有取樣點都不成立的關係式、或「m 是最大的」配上一條驗過的 t > m。",
        "數論或存在性的矛盾它算不出來，會標黃 —— 那是誠實，不是壞掉。"
      ],
      exampleId: "pl-abs-triangle",
      exercise: {
        id: "pl-sqrt2-contra",
        starter: ["反設 m 是最大的實數且 m < 1。"],
        task: "造一個比 m 大、又小於 1 的數（取 t = …），寫出 t > m 且 t < 1，指出矛盾，下結論。"
      }
    },
    {
      id: "lesson-induction",
      title: "第 5 課 · 歸納法",
      minutes: 5,
      intro: [
        "歸納三件套：「當 n = 1 時 … 成立」（基底）、「假設 n = k 時成立」（歸納假設）、一條從 n = k+1 的左式走到右式的鏈（歸納步驟）。",
        "基底可以寫「左式 = 1，右式 = 1，成立」，檢查器會把 n = 1 代進題目驗。歸納步驟的鏈可以跨行寫（這一行的結尾 = 下一行的開頭），檢查器會接起來看它有沒有從 k+1 的左式一路到右式。",
        "「1 + 2 + ... + k」這種省略號檢查器看得懂 —— 會當成一個能算的和來取樣。"
      ],
      exampleId: "pl-induction-sum",
      exercise: {
        id: "pl-induction-odd",
        starter: ["對 n 做歸納法。", "當 n = 1 時，左式 = 1，右式 = 1，成立。"],
        task: "寫歸納假設（n = k），再從 1 + 3 + ... + (2(k+1)−1) 出發，走到 (k+1)²，最後下結論。"
      }
    }
  ];
})();
