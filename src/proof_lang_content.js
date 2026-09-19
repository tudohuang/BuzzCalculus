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
  const sumCubes = (n) => { let total = 0; for (let i = 1; i <= Math.round(n); i += 1) total += i * i * i; return total; };
  const telescoping = (n) => { let total = 0; for (let i = 1; i <= Math.round(n); i += 1) total += 1 / (i * (i + 1)); return total; };

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
      classic: "proof-mvt-003",
      optional: [0],
      family: "direct",
      title: "導數恆為零則函數為常數",
      difficulty: 2,
      statement: "設 f 在區間 I 上可微且 f′(x) = 0 對所有 x ∈ I。證明 f 在 I 上為常數。",
      prompt: "f'(x)=0\\ \\forall x\\in I\\ \\Rightarrow\\ f\\text{ is constant on }I",
      vars: { x: { min: -3, max: 3 }, y: { min: -3, max: 3 } },
      // 抽象函數：f(任何東西) 是一個 [-3, 3] 裡的不透明變數；f′ 恆為 0 是題目給的
      abstract: { f: { min: -3, max: 3 }, "f'": { min: -3, max: 3 } },
      facts: ["f 在 I 上可微", "f'(_) = 0"],
      goal: { relation: "f(x) = f(y)", text: ["f 為常數", "f 是常數", "f is constant", "f在I上為常數", "f 在 I 上為常數"] },
      skeleton: "direct",
      reference: [
        "任取 x, y ∈ I 且 x < y。",
        "由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。",
        "因為 f'(c) = 0，所以 f(y) − f(x) = 0。",
        "故 f(x) = f(y)，即 f 在 I 上為常數。"
      ],
      coach: "抽象的 f 會被當成不透明的值：平均值定理那一句「存在 c 使 f(y) − f(x) = f′(c)(y − x)」登記之後，後面 f(y) − f(x) = 0 就驗得了。"
    },
    {
      id: "pl-mvt-increasing",
      classic: "proof-mvt-004",
      optional: [0, 3],
      family: "direct",
      title: "導數為正則函數嚴格遞增",
      difficulty: 2,
      statement: "設 f 在區間 I 上可微且 f′(x) > 0 對所有 x ∈ I。證明 f 在 I 上嚴格遞增：對 I 中任意 x < y，f(x) < f(y)。",
      prompt: "f'>0\\text{ on }I\\ \\Rightarrow\\ x<y\\implies f(x)<f(y)",
      vars: { x: { min: -3, max: 3 }, y: { min: -3, max: 3 } },
      abstract: { f: { min: -3, max: 3 }, "f'": { min: -3, max: 3 } },
      facts: ["f 在 I 上可微", "f'(_) > 0"],
      goal: { relation: "f(x) < f(y)", text: ["f 嚴格遞增", "f 遞增", "f 在 I 上嚴格遞增", "f 在 I 上遞增", "f is increasing", "f is strictly increasing"] },
      skeleton: "direct",
      reference: [
        "任取 x, y ∈ I 且 x < y。",
        "由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。",
        "因為 f'(c) > 0 且 y − x > 0，所以 f'(c)(y − x) > 0。",
        "則 f(y) − f(x) > 0。",
        "故 f(x) < f(y)，即 f 在 I 上嚴格遞增。"
      ],
      coach: "跟「導數為零則常數」同一個骨架：MVT 給一個 c，再用 f′(c) 的正負決定 f(y) − f(x) 的正負。"
    },
    {
      id: "pl-ivt-root",
      family: "direct",
      title: "中間值定理：x⁵ + x − 1 = 0 有實根",
      difficulty: 2,
      statement: "證明方程式 x⁵ + x − 1 = 0 在 (0, 1) 內有實根。",
      prompt: "\\exists\\,c\\in(0,1):\\ c^5+c-1=0",
      vars: {},
      goal: { text: ["g(c) = 0", "c^5 + c - 1 = 0", "存在實根", "有實根", "方程式有實根", "方程式在 (0, 1) 內有實根", "x^5 + x - 1 = 0 有實根", "x^5 + x - 1 = 0 在 (0, 1) 內有實根"] },
      skeleton: "direct",
      reference: [
        "令 g(x) = x⁵ + x − 1。",
        "則 g(0) = −1 < 0，g(1) = 1 > 0。",
        "因為 g 是多項式，所以 g 在 [0, 1] 上連續。",
        "由中間值定理，存在 c ∈ (0, 1) 使 g(c) = 0。",
        "故 c⁵ + c − 1 = 0，即方程式有實根。"
      ],
      coach: "中間值定理要兩個前提都寫出來：g 連續（多項式）、兩端異號（g(0) < 0、g(1) > 0）。少一個它就不放行。"
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
      coach: "夾擠要先把它夾在兩個極限相同的東西之間：−|x| 和 |x|。"
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
      coach: "反證的關鍵是「造出一個更大的」：(m+1)/2 夾在 m 和 1 中間。"
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
    },
    {
      id: "pl-limit-x2-zero",
      family: "epsilon-delta",
      title: "ε-δ：x² 在 x→0 的極限",
      difficulty: 1,
      statement: "用 ε-δ 定義證明 lim_{x→0} x² = 0。",
      prompt: "\\lim_{x\\to 0} x^2 = 0",
      vars: { x: { min: -2, max: 2 }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{x->0} x^2 = 0", "x^2→0"] },
      bound: { lhs: "abs(x^2-0)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = √ε。",
        "假設 0 < |x − 0| < δ。",
        "則 |x² − 0| = |x|² < δ² = ε。",
        "所以 lim_{x→0} x² = 0。"
      ],
      coach: "δ 不一定是 ε 的倍數 —— 這題要開根號。|x|² < δ² 是因為 0 ≤ |x| < δ。"
    },
    {
      id: "pl-seq-reciprocal",
      family: "epsilon-delta",
      title: "ε-N：數列 1/n 的極限",
      difficulty: 1,
      statement: "用 ε-N 定義證明 lim_{n→∞} 1/n = 0。",
      prompt: "\\lim_{n\\to\\infty} \\frac{1}{n} = 0",
      vars: { n: { min: 1, max: 400, int: true }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{n->inf} 1/n = 0", "1/n→0", "lim 1/n = 0"] },
      bound: { lhs: "abs(1/n-0)", rhs: "eps", threshold: "N" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 N = 1/ε。",
        "假設 n > N。",
        "則 |1/n − 0| = 1/n < 1/N = ε。",
        "所以 lim_{n→∞} 1/n = 0。"
      ],
      coach: "數列的版本把 δ 換成 N：給 ε、造 N、假設 n > N、推出 |a_n − L| < ε。"
    },
    {
      id: "pl-induction-geometric",
      optional: [0],
      family: "induction",
      title: "歸納法：1 + 2 + 4 + … + 2ⁿ",
      difficulty: 1,
      statement: "證明對所有正整數 n，1 + 2 + 4 + … + 2ⁿ = 2ⁿ⁺¹ − 1。",
      prompt: "1+2+4+\\cdots+2^n=2^{n+1}-1",
      vars: { n: { min: 1, max: 15, int: true } },
      functions: { G: (n) => geometric(2, n) },
      macros: [{ pattern: "1\\s*\\+\\s*2\\s*\\+\\s*(4\\s*\\+\\s*)?\\.\\.\\.\\s*\\+\\s*2\\s*\\^\\s*\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?", replace: "G($2)" }],
      goal: { relation: "G(n) = 2^(n+1) - 1" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1 + 2 = 3，右式 = 2² − 1 = 3，成立。",
        "假設 n = k 時成立，即 1 + 2 + 4 + ... + 2^k = 2^(k+1) − 1。",
        "則 1 + 2 + 4 + ... + 2^(k+1) = (2^(k+1) − 1) + 2^(k+1) = 2^(k+2) − 1。",
        "故對所有正整數 n，1 + 2 + 4 + ... + 2^n = 2^(n+1) − 1。"
      ],
      coach: "兩個 2^(k+1) 加起來是 2^(k+2)。指數要加括號：2^(k+1)。"
    },
    {
      id: "pl-induction-squares",
      optional: [0],
      family: "induction",
      title: "歸納法：平方和",
      difficulty: 2,
      statement: "證明對所有正整數 n，1² + 2² + … + n² = n(n+1)(2n+1)/6。",
      prompt: "1^2+2^2+\\cdots+n^2=\\frac{n(n+1)(2n+1)}{6}",
      vars: { n: { min: 1, max: 15, int: true } },
      functions: { Q: sumSquares },
      macros: [{ pattern: "1\\s*\\^\\s*2\\s*\\+\\s*2\\s*\\^\\s*2\\s*\\+\\s*(3\\s*\\^\\s*2\\s*\\+\\s*)?\\.\\.\\.\\s*\\+\\s*\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?\\s*\\^\\s*2", replace: "Q($2)" }],
      goal: { relation: "Q(n) = n*(n+1)*(2*n+1)/6" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1，右式 = 1·2·3/6 = 1，成立。",
        "假設 n = k 時成立，即 1² + 2² + ... + k² = k(k+1)(2k+1)/6。",
        "則 1² + 2² + ... + (k+1)² = k(k+1)(2k+1)/6 + (k+1)² = (k+1)(k+2)(2k+3)/6。",
        "故對所有正整數 n，1² + 2² + ... + n² = n(n+1)(2n+1)/6。"
      ],
      coach: "把 (k+1) 提出來：(k+1)[k(2k+1) + 6(k+1)] = (k+1)(2k² + 7k + 6) = (k+1)(k+2)(2k+3)。"
    },
    {
      id: "pl-cauchy-two",
      optional: [0, 2],
      family: "direct",
      title: "兩項的 Cauchy 不等式",
      difficulty: 2,
      statement: "證明對所有實數 a, b, c, d，(a² + b²)(c² + d²) ≥ (ac + bd)²。",
      prompt: "(a^2+b^2)(c^2+d^2)\\ge(ac+bd)^2",
      vars: { a: { min: -3, max: 3 }, b: { min: -3, max: 3 }, c: { min: -3, max: 3 }, d: { min: -3, max: 3 } },
      goal: { relation: "(a^2+b^2)*(c^2+d^2) >= (a*c+b*d)^2" },
      skeleton: "direct",
      reference: [
        "設 a, b, c, d 為實數。",
        "則 (ad − bc)² ≥ 0。",
        "展開得 a²d² − 2abcd + b²c² ≥ 0。",
        "移項得 (a² + b²)(c² + d²) ≥ (ac + bd)²。"
      ],
      coach: "兩邊相減剩下 (ad − bc)²。從那個平方 ≥ 0 出發往回寫。"
    },
    {
      id: "pl-reverse-triangle",
      optional: [0],
      family: "direct",
      title: "反向三角不等式",
      difficulty: 2,
      statement: "證明對所有實數 x, y，|x| − |y| ≤ |x − y|。",
      prompt: "|x|-|y|\\le|x-y|",
      vars: { x: { min: -5, max: 5 }, y: { min: -5, max: 5 } },
      goal: { relation: "abs(x) - abs(y) <= abs(x-y)" },
      skeleton: "direct",
      reference: [
        "設 x, y 為實數。",
        "由三角不等式，|x| = |(x − y) + y| ≤ |x − y| + |y|。",
        "所以 |x| − |y| ≤ |x − y|。"
      ],
      coach: "把 x 拆成 (x − y) + y，套三角不等式，再移項。"
    },
    {
      id: "pl-min-positive",
      family: "contradiction",
      title: "反證：沒有最小的正實數",
      difficulty: 1,
      statement: "證明不存在最小的正實數。（反證：假設有，再造一個更小的。）",
      prompt: "\\nexists\\ \\min\\{m\\in\\mathbb{R}: m>0\\}",
      vars: { m: { min: 0.01, max: 3 } },
      goal: { text: ["不存在最小的正實數", "沒有最小的正實數", "不存在最小的 m", "no smallest positive real", "there is no smallest positive real number"] },
      skeleton: "contradiction",
      reference: [
        "反設 m 是最小的正實數。",
        "取 t = m/2。",
        "則 0 < t < m。",
        "這與 m 是最小的矛盾。",
        "故不存在最小的正實數。"
      ],
      coach: "反證的模板：反設「有最小的」，造一個更小的（m/2），指出矛盾。"
    },
    {
      id: "pl-x-le-abs",
      optional: [0],
      family: "cases",
      title: "分情況：x ≤ |x|",
      difficulty: 1,
      statement: "證明對所有實數 x，x ≤ |x|。",
      prompt: "x\\le|x|",
      vars: { x: { min: -5, max: 5 } },
      goal: { relation: "x <= abs(x)" },
      skeleton: "cases",
      reference: [
        "分兩種情況。",
        "情況一：x ≥ 0。",
        "則 x = |x|。",
        "情況二：否則。",
        "則 x < 0 ≤ |x|。",
        "故 x ≤ |x|。"
      ],
      coach: "絕對值就是分正負：x ≥ 0 時 |x| = x；否則 x < 0 ≤ |x|。每一種情況都要走到 x ≤ |x|。"
    },

    /* ── 第二批：每一族多幾題，從 R1 熱身到 R3 ─────────────────────── */
    {
      id: "pl-limit-affine",
      family: "epsilon-delta",
      title: "ε-δ：2x + 1 在 x→1 的極限",
      difficulty: 1,
      statement: "用 ε-δ 定義證明 lim_{x→1} (2x + 1) = 3。",
      prompt: "\\lim_{x\\to 1} (2x+1) = 3",
      vars: { x: { min: -3, max: 5 }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{x->1} (2x+1) = 3", "lim_{x->1} 2x+1 = 3", "2x+1→3"] },
      bound: { lhs: "abs(2*x+1-3)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = ε/2。",
        "假設 0 < |x − 1| < δ。",
        "則 |(2x + 1) − 3| = |2x − 2| = 2|x − 1| < 2δ = ε。",
        "所以 lim_{x→1} (2x + 1) = 3。"
      ],
      coach: "跟 3x 那題一模一樣的骨架：|f(x) − L| 整理成「常數 × |x − a|」，δ 就是 ε 除以那個常數。"
    },
    {
      id: "pl-limit-sqrt",
      family: "epsilon-delta",
      title: "ε-δ：√x 在 x→4 的極限",
      difficulty: 2,
      statement: "用 ε-δ 定義證明 lim_{x→4} √x = 2。（提示：|√x − 2| = |x − 4|/(√x + 2)。）",
      prompt: "\\lim_{x\\to 4} \\sqrt{x} = 2",
      vars: { x: { min: 0, max: 10 }, eps: { min: 0.05, max: 2 } },
      given: ["x >= 0"],
      goal: { text: ["lim_{x->4} sqrt(x) = 2", "sqrt(x)→2", "lim_{x->4} √x = 2"] },
      bound: { lhs: "abs(sqrt(x)-2)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = 2ε。",
        "假設 0 < |x − 4| < δ。",
        "因為 √x + 2 ≥ 2，所以 |√x − 2| = |x − 4|/(√x + 2) ≤ |x − 4|/2。",
        "則 |x − 4|/2 < δ/2 = ε。",
        "所以 lim_{x→4} √x = 2。"
      ],
      coach: "有理化：√x − 2 = (x − 4)/(√x + 2)。分母至少是 2，所以 |√x − 2| 最多是 |x − 4| 的一半。"
    },
    {
      id: "pl-limit-reciprocal",
      optional: [3],
      family: "epsilon-delta",
      title: "ε-δ：1/x 在 x→2 的極限",
      difficulty: 3,
      statement: "用 ε-δ 定義證明 lim_{x→2} 1/x = 1/2。（提示：先把 δ 限制在 1 以內，讓 x 遠離 0。）",
      prompt: "\\lim_{x\\to 2} \\frac{1}{x} = \\frac{1}{2}",
      vars: { x: { min: 0.5, max: 4 }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{x->2} 1/x = 1/2", "1/x→1/2"] },
      bound: { lhs: "abs(1/x-1/2)", rhs: "eps" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 δ = min(1, 2ε)。",
        "假設 0 < |x − 2| < δ。",
        "因為 δ ≤ 1，所以 x = 2 + (x − 2) > 2 − δ ≥ 1。",
        "則 |1/x − 1/2| = |2 − x|/(2x) < |x − 2|/2 < δ/2 ≤ ε。",
        "所以 lim_{x→2} 1/x = 1/2。"
      ],
      coach: "|1/x − 1/2| = |2 − x|/(2x)：分子由 δ 控制，分母要先用 δ ≤ 1 保證 x > 1，才有 2x > 2。"
    },
    {
      id: "pl-seq-ratio",
      family: "epsilon-delta",
      title: "ε-N：數列 (n+1)/n 的極限",
      difficulty: 1,
      statement: "用 ε-N 定義證明 lim_{n→∞} (n+1)/n = 1。",
      prompt: "\\lim_{n\\to\\infty} \\frac{n+1}{n} = 1",
      vars: { n: { min: 1, max: 400, int: true }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{n->inf} (n+1)/n = 1", "(n+1)/n→1", "lim (n+1)/n = 1"] },
      bound: { lhs: "abs((n+1)/n-1)", rhs: "eps", threshold: "N" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 N = 1/ε。",
        "假設 n > N。",
        "則 |(n+1)/n − 1| = 1/n < 1/N = ε。",
        "所以 lim_{n→∞} (n+1)/n = 1。"
      ],
      coach: "先把 |a_n − L| 算乾淨：(n+1)/n − 1 = 1/n。剩下的跟 1/n 那題一樣。"
    },
    {
      id: "pl-seq-square",
      family: "epsilon-delta",
      title: "ε-N：數列 1/n² 的極限",
      difficulty: 2,
      statement: "用 ε-N 定義證明 lim_{n→∞} 1/n² = 0。",
      prompt: "\\lim_{n\\to\\infty} \\frac{1}{n^2} = 0",
      vars: { n: { min: 1, max: 400, int: true }, eps: { min: 0.05, max: 2 } },
      goal: { text: ["lim_{n->inf} 1/n^2 = 0", "1/n^2→0", "lim 1/n^2 = 0"] },
      bound: { lhs: "abs(1/n^2-0)", rhs: "eps", threshold: "N" },
      skeleton: "epsilon-delta",
      reference: [
        "任取 ε > 0。",
        "取 N = 1/√ε。",
        "假設 n > N。",
        "則 |1/n² − 0| = 1/n² < 1/N² = ε。",
        "所以 lim_{n→∞} 1/n² = 0。"
      ],
      coach: "要 1/n² < ε，就是 n > 1/√ε。N 不一定是 1/ε —— 看 |a_n − L| 長什麼樣子倒推。"
    },
    {
      id: "pl-two-squares",
      optional: [0, 2],
      family: "direct",
      title: "不等式：x² + y² ≥ 2xy",
      difficulty: 1,
      statement: "證明對所有實數 x, y，x² + y² ≥ 2xy。",
      prompt: "x^2+y^2\\ge 2xy",
      vars: { x: { min: -5, max: 5 }, y: { min: -5, max: 5 } },
      goal: { relation: "x^2+y^2 >= 2*x*y" },
      skeleton: "direct",
      reference: [
        "設 x, y 為實數。",
        "則 (x − y)² ≥ 0。",
        "展開得 x² − 2xy + y² ≥ 0。",
        "所以 x² + y² ≥ 2xy。"
      ],
      coach: "兩邊相減是 (x − y)²。幾乎所有「兩項的不等式」都從一個平方 ≥ 0 出發。"
    },
    {
      id: "pl-ratio-sum",
      optional: [0, 2],
      family: "direct",
      title: "不等式：a/b + b/a ≥ 2",
      difficulty: 2,
      statement: "證明對所有正實數 a, b，a/b + b/a ≥ 2。",
      prompt: "\\frac{a}{b}+\\frac{b}{a}\\ge 2\\quad(a,b>0)",
      vars: { a: { min: 0.2, max: 6 }, b: { min: 0.2, max: 6 } },
      given: ["a > 0", "b > 0"],
      goal: { relation: "a/b + b/a >= 2" },
      skeleton: "direct",
      reference: [
        "設 a, b > 0。",
        "則 (a − b)² ≥ 0。",
        "展開得 a² − 2ab + b² ≥ 0，即 a² + b² ≥ 2ab。",
        "因為 ab > 0，所以 a/b + b/a = (a² + b²)/(ab) ≥ 2。"
      ],
      coach: "通分：a/b + b/a = (a² + b²)/(ab)。除以 ab 不會翻方向，是因為 ab > 0 —— 這句要寫出來。"
    },
    {
      id: "pl-cube-sum",
      optional: [0, 2],
      family: "direct",
      title: "不等式：a³ + b³ ≥ a²b + ab²",
      difficulty: 2,
      statement: "證明對所有 a, b ≥ 0，a³ + b³ ≥ a²b + ab²。",
      prompt: "a^3+b^3\\ge a^2b+ab^2\\quad(a,b\\ge 0)",
      vars: { a: { min: 0, max: 5 }, b: { min: 0, max: 5 } },
      given: ["a >= 0", "b >= 0"],
      goal: { relation: "a^3+b^3 >= a^2*b+a*b^2" },
      skeleton: "direct",
      reference: [
        "設 a, b ≥ 0。",
        "因為 a + b ≥ 0 且 (a − b)² ≥ 0，所以 (a + b)(a − b)² ≥ 0。",
        "展開得 a³ − a²b − ab² + b³ ≥ 0。",
        "所以 a³ + b³ ≥ a²b + ab²。"
      ],
      coach: "兩邊相減因式分解：a³ + b³ − a²b − ab² = (a + b)(a − b)²。兩個非負的東西相乘還是非負。"
    },
    {
      id: "pl-square-of-sum",
      optional: [0, 2],
      family: "direct",
      title: "不等式：(a + b)² ≤ 2(a² + b²)",
      difficulty: 1,
      statement: "證明對所有實數 a, b，(a + b)² ≤ 2(a² + b²)。",
      prompt: "(a+b)^2\\le 2(a^2+b^2)",
      vars: { a: { min: -5, max: 5 }, b: { min: -5, max: 5 } },
      goal: { relation: "(a+b)^2 <= 2*(a^2+b^2)" },
      skeleton: "direct",
      reference: [
        "設 a, b 為實數。",
        "則 (a − b)² ≥ 0。",
        "展開得 a² − 2ab + b² ≥ 0，即 2ab ≤ a² + b²。",
        "所以 (a + b)² = a² + 2ab + b² ≤ 2(a² + b²)。"
      ],
      coach: "把 (a + b)² 展開，中間那個 2ab 用「2ab ≤ a² + b²」換掉。最後一行寫成鏈：= 再 ≤。"
    },
    {
      id: "pl-lipschitz",
      optional: [0],
      family: "direct",
      title: "導數有界則函數 Lipschitz",
      difficulty: 3,
      statement: "設 f 在區間 I 上可微且 |f′(x)| ≤ 2 對所有 x ∈ I。證明對 I 中任意 x < y，|f(y) − f(x)| ≤ 2|y − x|。",
      prompt: "|f'|\\le 2\\ \\Rightarrow\\ |f(y)-f(x)|\\le 2|y-x|",
      vars: { x: { min: -3, max: 3 }, y: { min: -3, max: 3 } },
      abstract: { f: { min: -3, max: 3 }, "f'": { min: -3, max: 3 } },
      facts: ["f 在 I 上可微", "f'(_) <= 2", "f'(_) >= -2"],
      goal: { relation: "abs(f(y) - f(x)) <= 2*abs(y-x)" },
      skeleton: "direct",
      reference: [
        "任取 x, y ∈ I 且 x < y。",
        "由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。",
        "因為 f'(c) ≤ 2 且 f'(c) ≥ −2，所以 |f'(c)| ≤ 2。",
        "故 |f(y) − f(x)| = |f'(c)| |y − x| ≤ 2|y − x|。"
      ],
      coach: "MVT 把「函數值的差」換成「導數 × 自變數的差」；導數有界，差就有界。題目給的 |f′| ≤ 2 要拆成 f′(c) ≤ 2 且 f′(c) ≥ −2 寫出來，檢查器才拿得到。"
    },
    {
      id: "pl-ivt-cubic",
      family: "direct",
      title: "中間值定理：x³ − 3x + 1 = 0 有實根",
      difficulty: 1,
      statement: "證明方程式 x³ − 3x + 1 = 0 在 (0, 1) 內有實根。",
      prompt: "\\exists\\,c\\in(0,1):\\ c^3-3c+1=0",
      vars: {},
      goal: { text: ["g(c) = 0", "c^3 - 3c + 1 = 0", "存在實根", "有實根", "方程式有實根", "方程式在 (0, 1) 內有實根", "x^3 - 3x + 1 = 0 有實根"] },
      skeleton: "direct",
      reference: [
        "令 g(x) = x³ − 3x + 1。",
        "則 g(0) = 1 > 0，g(1) = −1 < 0。",
        "因為 g 是多項式，所以 g 在 [0, 1] 上連續。",
        "由中間值定理，存在 c ∈ (0, 1) 使 g(c) = 0。",
        "故 c³ − 3c + 1 = 0，即方程式有實根。"
      ],
      coach: "IVT 三件套：令 g、算兩端（異號）、說 g 連續。這題兩端是 g(0) > 0、g(1) < 0，方向跟上一題相反也沒關係。"
    },
    {
      id: "pl-ivt-cos",
      family: "direct",
      title: "中間值定理：cos x = x 有解",
      difficulty: 2,
      statement: "證明方程式 cos x = x 在 (0, π/2) 內有解。",
      prompt: "\\exists\\,c\\in(0,\\tfrac{\\pi}{2}):\\ \\cos c = c",
      vars: {},
      goal: { text: ["g(c) = 0", "cos(c) = c", "cos c = c", "存在實根", "有實根", "方程式有解", "cos x = x 有解", "cos x = x 有實根"] },
      skeleton: "direct",
      reference: [
        "令 g(x) = cos(x) − x。",
        "則 g(0) = 1 > 0，g(π/2) = −π/2 < 0。",
        "因為 g 可微，所以 g 在 [0, π/2] 上連續。",
        "由中間值定理，存在 c ∈ (0, π/2) 使 g(c) = 0。",
        "故 cos c = c，即方程式有解。"
      ],
      coach: "把「cos x = x」改成「g(x) = cos x − x 有零點」。g 不是多項式，但 cos 與多項式加減出來的函數處處可微，所以連續。"
    },
    {
      id: "pl-induction-power",
      optional: [0],
      family: "induction",
      title: "歸納法：2ⁿ > n",
      difficulty: 1,
      statement: "證明對所有正整數 n，2ⁿ > n。",
      prompt: "2^n > n",
      vars: { n: { min: 1, max: 20, int: true } },
      goal: { relation: "2^n > n" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 2，右式 = 1，成立。",
        "假設 n = k 時成立，即 2^k > k。",
        "則 2^(k+1) = 2·2^k > 2k ≥ k + 1。",
        "故對所有正整數 n，2^n > n。"
      ],
      coach: "不等式的歸納：2^(k+1) = 2·2^k 用歸納假設換成 > 2k，再用 k ≥ 1 得 2k ≥ k + 1。一條鏈寫完。"
    },
    {
      id: "pl-induction-cubes",
      optional: [0],
      family: "induction",
      title: "歸納法：立方和",
      difficulty: 3,
      statement: "證明對所有正整數 n，1³ + 2³ + … + n³ = (n(n+1)/2)²。",
      prompt: "1^3+2^3+\\cdots+n^3=\\left(\\frac{n(n+1)}{2}\\right)^2",
      vars: { n: { min: 1, max: 12, int: true } },
      functions: { C: sumCubes },
      macros: [{ pattern: "1\\s*\\^\\s*3\\s*\\+\\s*2\\s*\\^\\s*3\\s*\\+\\s*(3\\s*\\^\\s*3\\s*\\+\\s*)?\\.\\.\\.\\s*\\+\\s*\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?\\s*\\^\\s*3", replace: "C($2)" }],
      goal: { relation: "C(n) = (n*(n+1)/2)^2" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1，右式 = 1，成立。",
        "假設 n = k 時成立，即 1³ + 2³ + ... + k³ = (k(k+1)/2)²。",
        "則 1³ + 2³ + ... + (k+1)³ = (k(k+1)/2)² + (k+1)³ = (k+1)²(k² + 4k + 4)/4 = ((k+1)(k+2)/2)²。",
        "故對所有正整數 n，1³ + 2³ + ... + n³ = (n(n+1)/2)²。"
      ],
      coach: "提出 (k+1)²：(k+1)²[k²/4 + (k+1)] = (k+1)²(k² + 4k + 4)/4，而 k² + 4k + 4 = (k+2)²。"
    },
    {
      id: "pl-induction-telescoping",
      optional: [0],
      family: "induction",
      title: "歸納法：1/(1·2) + … + 1/(n(n+1))",
      difficulty: 2,
      statement: "證明對所有正整數 n，1/(1·2) + 1/(2·3) + … + 1/(n(n+1)) = n/(n+1)。",
      prompt: "\\frac{1}{1\\cdot 2}+\\frac{1}{2\\cdot 3}+\\cdots+\\frac{1}{n(n+1)}=\\frac{n}{n+1}",
      vars: { n: { min: 1, max: 15, int: true } },
      functions: { T: telescoping },
      macros: [{ pattern: "1\\s*/\\s*\\(?1\\s*[*·]?\\s*2\\)?\\s*\\+\\s*(1\\s*/\\s*\\(?2\\s*[*·]?\\s*3\\)?\\s*\\+\\s*)?\\.\\.\\.\\s*\\+\\s*1\\s*/\\s*\\(\\(?([A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?)\\)?\\s*\\(\\s*[A-Za-z]\\w*(?:\\s*[+-]\\s*\\d+)?\\s*\\)\\)", replace: "T($2)" }],
      goal: { relation: "T(n) = n/(n+1)" },
      induction: { variable: "n", base: 1 },
      skeleton: "induction",
      reference: [
        "對 n 做歸納法。",
        "當 n = 1 時，左式 = 1/2，右式 = 1/2，成立。",
        "假設 n = k 時成立，即 1/(1·2) + 1/(2·3) + ... + 1/(k(k+1)) = k/(k+1)。",
        "則 1/(1·2) + ... + 1/((k+1)(k+2)) = k/(k+1) + 1/((k+1)(k+2)) = (k² + 2k + 1)/((k+1)(k+2)) = (k+1)/(k+2)。",
        "故對所有正整數 n，1/(1·2) + ... + 1/(n(n+1)) = n/(n+1)。"
      ],
      coach: "通分：k/(k+1) + 1/((k+1)(k+2)) = (k(k+2) + 1)/((k+1)(k+2))，分子是 (k+1)²。省略號的最後一項要寫成 1/((k+1)(k+2))。"
    },
    {
      id: "pl-abs-square",
      optional: [0],
      family: "cases",
      title: "分情況：|x|² = x²",
      difficulty: 1,
      statement: "證明對所有實數 x，|x|² = x²。",
      prompt: "|x|^2 = x^2",
      vars: { x: { min: -5, max: 5 } },
      goal: { relation: "abs(x)^2 = x^2" },
      skeleton: "cases",
      reference: [
        "分兩種情況。",
        "情況一：x ≥ 0。",
        "則 |x|² = x²。",
        "情況二：否則。",
        "則 |x|² = (−x)² = x²。",
        "故 |x|² = x²。"
      ],
      coach: "x ≥ 0 時 |x| = x；否則 |x| = −x，而 (−x)² = x²。兩種情況都要寫到 |x|² = x²。"
    },
    {
      id: "pl-max-formula",
      optional: [0, 1],
      family: "cases",
      title: "分情況：max(x, y) 的公式",
      difficulty: 2,
      statement: "證明對所有實數 x, y，max(x, y) = (x + y + |x − y|)/2。",
      prompt: "\\max(x,y)=\\frac{x+y+|x-y|}{2}",
      vars: { x: { min: -5, max: 5 }, y: { min: -5, max: 5 } },
      goal: { relation: "max(x,y) = (x+y+abs(x-y))/2" },
      skeleton: "cases",
      reference: [
        "設 x, y 為實數。",
        "分兩種情況。",
        "情況一：x ≥ y。",
        "則 (x + y + |x − y|)/2 = (x + y + (x − y))/2 = x = max(x, y)。",
        "情況二：否則。",
        "則 (x + y + |x − y|)/2 = (x + y + (y − x))/2 = y = max(x, y)。",
        "故 max(x, y) = (x + y + |x − y|)/2。"
      ],
      coach: "|x − y| 依 x ≥ y 或 x < y 分別是 x − y、y − x；代進去，一條鏈算到 max(x, y)。max 檢查器看得懂。"
    },
    {
      id: "pl-abs-bound",
      optional: [0, 1],
      family: "cases",
      title: "分情況：|x| ≤ a 則 −a ≤ x",
      difficulty: 2,
      statement: "設 a ≥ 0 且 |x| ≤ a。證明 −a ≤ x。",
      prompt: "|x|\\le a\\ \\Rightarrow\\ -a\\le x",
      vars: { x: { min: -5, max: 5 }, a: { min: 0, max: 5 } },
      given: ["a >= 0", "abs(x) <= a"],
      goal: { relation: "-a <= x" },
      skeleton: "cases",
      reference: [
        "設 a ≥ 0 且 |x| ≤ a。",
        "分兩種情況。",
        "情況一：x ≥ 0。",
        "則 x ≥ 0 ≥ −a。",
        "情況二：否則。",
        "則 x = −|x| ≥ −a。",
        "故 −a ≤ x。"
      ],
      coach: "x ≥ 0 那邊幾乎不用證（0 ≥ −a）；x < 0 那邊 x = −|x|，再用 |x| ≤ a。"
    },
    {
      id: "pl-max-negative",
      family: "contradiction",
      title: "反證：沒有最大的負實數",
      difficulty: 1,
      statement: "證明不存在最大的負實數。（反證：假設有，再造一個更大、但仍是負的。）",
      prompt: "\\nexists\\ \\max\\{m\\in\\mathbb{R}: m<0\\}",
      vars: { m: { min: -3, max: -0.01 } },
      goal: { text: ["不存在最大的負實數", "沒有最大的負實數", "no largest negative real"] },
      skeleton: "contradiction",
      reference: [
        "反設 m 是最大的負實數。",
        "取 t = m/2。",
        "則 m < t < 0。",
        "這與 m 是最大的矛盾。",
        "故不存在最大的負實數。"
      ],
      coach: "證人 t 要兩件事都寫：比 m 大（t > m）、而且還是負的（t < 0）。少了 t < 0，它就不算同一個集合裡的人。"
    },
    {
      id: "pl-no-largest-real",
      family: "contradiction",
      title: "反證：沒有最大的實數",
      difficulty: 1,
      statement: "證明不存在最大的實數。",
      prompt: "\\nexists\\ \\max\\mathbb{R}",
      vars: { m: { min: -3, max: 3 } },
      goal: { text: ["不存在最大的實數", "沒有最大的實數", "no largest real number", "there is no largest real number"] },
      skeleton: "contradiction",
      reference: [
        "反設 m 是最大的實數。",
        "取 t = m + 1。",
        "則 t > m。",
        "這與 m 是最大的矛盾。",
        "故不存在最大的實數。"
      ],
      coach: "最短的反證：反設、造一個更大的（m + 1）、指出矛盾、結論。四行。"
    },

    /* ── 經典解析章末問題：抽象 f 靠泰勒定理與 atom 撐起來的兩題 ─────── */
    {
      id: "pl-classic-derivative-bound",
      optional: [0],
      family: "direct",
      title: "|f| ≤ 1、|f″| ≤ 1 則 |f′| ≤ 2",
      source: "經典解析習題（A = B = 1 的情形）",
      difficulty: 3,
      statement: "設 f 在 I = (0, ∞) 上二次可微，且對所有 x 有 |f(x)| ≤ 1、|f″(x)| ≤ 1。證明對所有 x ∈ I，|f′(x)| ≤ 2。（原題：|f| ≤ A、|f″| ≤ B ⇒ |f′| ≤ 2√(AB)；取 h = 2√(A/B) 就是這裡的 h = 2。）",
      prompt: "|f|\\le 1,\\ |f''|\\le 1\\ \\Rightarrow\\ |f'(x)|\\le 2",
      vars: { x: { min: -3, max: 3 } },
      // 三個抽象函數：值域故意放寬到 [−3, 3]，題目給的 |f| ≤ 1、|f″| ≤ 1 要「寫出來」才登記——不寫就推不出來
      abstract: { f: { min: -3, max: 3 }, "f'": { min: -4, max: 4 }, "f''": { min: -3, max: 3 } },
      facts: ["f 在 I 上二次可微", "f(_) <= 1", "f(_) >= -1", "f''(_) <= 1", "f''(_) >= -1"],
      goal: { relation: "abs(f'(x)) <= 2" },
      skeleton: "direct",
      reference: [
        "任取 x ∈ I。",
        "由泰勒定理，存在 ξ ∈ (x, x + 2) 使 f(x + 2) = f(x) + 2f'(x) + 2f''(ξ)。",
        "由三角不等式，|f'(x)| = |(f(x + 2) − f(x))/2 − f''(ξ)| ≤ (|f(x + 2)| + |f(x)|)/2 + |f''(ξ)|。",
        "因為 f(x + 2) ≤ 1 且 f(x + 2) ≥ −1 且 f(x) ≤ 1 且 f(x) ≥ −1 且 f''(ξ) ≤ 1 且 f''(ξ) ≥ −1，所以 (|f(x + 2)| + |f(x)|)/2 + |f''(ξ)| ≤ (1 + 1)/2 + 1 = 2。",
        "故 |f'(x)| ≤ 2。"
      ],
      coach: "泰勒把 f′(x) 用「兩個函數值 + 一個二階導數」寫出來：f(x+h) = f(x) + h f′(x) + (h²/2) f″(ξ)。解出 f′(x)，三角不等式，再把題目給的界一個一個寫進去（|f| ≤ 1 要拆成 f ≤ 1 且 f ≥ −1）。h = 2 是讓 2A/h + hB/2 最小的那個 h。"
    },
    {
      // 經典解析 II-2 的原題（A、B 一般）：proofs.js 的 proof-classic-202 可以「自己寫，機器判」。
      // 第 4 行（三角不等式）數值上是多餘的——結論靠泰勒關係就驗得過——所以標成可刪，但它是這個證明的想法，參考證明照寫。
      id: "pl-classic-202",
      classic: "proof-classic-202",
      optional: [0, 3],
      family: "direct",
      title: "|f| ≤ A、|f″| ≤ B 則 |f′| ≤ 2√(AB)",
      source: "經典解析習題 II-2",
      difficulty: 4,
      statement: "設 f 在 I = (0, ∞) 上二次可微，A、B > 0，且對所有 x 有 |f(x)| ≤ A、|f″(x)| ≤ B。證明對所有 x ∈ I，|f′(x)| ≤ 2√(AB)。",
      prompt: "|f|\\le A,\\ |f''|\\le B\\ \\Rightarrow\\ |f'(x)|\\le 2\\sqrt{AB}",
      vars: { x: { min: 0.1, max: 3 }, A: { min: 0.5, max: 3 }, B: { min: 0.5, max: 3 } },
      abstract: { f: { min: -3, max: 3 }, "f'": { min: -6, max: 6 }, "f''": { min: -3, max: 3 } },
      facts: ["f 在 I 上二次可微", "f(_) <= A", "f(_) >= -A", "f''(_) <= B", "f''(_) >= -B"],
      goal: { relation: "abs(f'(x)) <= 2*sqrt(A*B)" },
      skeleton: "direct",
      reference: [
        "任取 x ∈ I。",
        "取 h = 2√(A/B)。",
        "由泰勒定理，存在 ξ ∈ (x, x + h) 使 f(x + h) = f(x) + h f'(x) + (h^2/2) f''(ξ)。",
        "由三角不等式，|f'(x)| = |(f(x + h) − f(x))/h − (h/2) f''(ξ)| ≤ (|f(x + h)| + |f(x)|)/h + (h/2)|f''(ξ)|。",
        "因為 f(x + h) ≤ A 且 f(x + h) ≥ −A 且 f(x) ≤ A 且 f(x) ≥ −A 且 f''(ξ) ≤ B 且 f''(ξ) ≥ −B，所以 (|f(x + h)| + |f(x)|)/h + (h/2)|f''(ξ)| ≤ 2A/h + Bh/2 = 2√(AB)。",
        "故 |f'(x)| ≤ 2√(AB)。"
      ],
      coach: "泰勒把 f′(x) 用「兩個函數值 + 一個二階導數」寫出來，步長 h 先留著。三角不等式加題目的界之後右邊是 2A/h + Bh/2；它對 h 的最小值在 h = 2√(A/B)，那就是 2√(AB)。所以一開始就取這個 h。"
    },
    {
      id: "pl-classic-second-derivative",
      optional: [2, 3],
      family: "cases",
      title: "f(0)=0, f(1)=1, f′(0)=f′(1)=0 則某處 |f″| ≥ 4",
      source: "經典解析習題",
      difficulty: 3,
      statement: "設 f 在包含 [0, 1] 的區間上二次可微，且 f(0) = 0、f(1) = 1、f′(0) = f′(1) = 0。證明存在 x ∈ [0, 1] 使 |f″(x)| ≥ 4。",
      prompt: "f(0)=0,\\ f(1)=1,\\ f'(0)=f'(1)=0\\ \\Rightarrow\\ \\exists x\\in[0,1]:\\ |f''(x)|\\ge 4",
      vars: {},
      abstract: { f: { min: -2, max: 2 }, "f'": { min: -2, max: 2 }, "f''": { min: -12, max: 12 } },
      given: ["f(0) = 0", "f(1) = 1", "f'(0) = 0", "f'(1) = 0"],
      facts: ["f 在 [0, 1] 上二次可微"],
      goal: { text: ["存在 x 使 |f''(x)| ≥ 4", "存在 x ∈ [0, 1] 使 |f''(x)| ≥ 4", "有一點 x 使 |f''(x)| ≥ 4", "存在 x 使 |f''(x)| >= 4"] },
      skeleton: "cases",
      reference: [
        "由泰勒定理，存在 ξ ∈ (0, 1/2) 使 f(1/2) = f(0) + f'(0)/2 + f''(ξ)/8。",
        "由泰勒定理，存在 η ∈ (1/2, 1) 使 f(1/2) = f(1) − f'(1)/2 + f''(η)/8。",
        "則 f''(ξ) − f''(η) = 8。",
        "分兩種情況。",
        "情況一：|f''(ξ)| ≥ 4。",
        "則存在 x 使 |f''(x)| ≥ 4。",
        "情況二：否則。",
        "則 |f''(η)| = |f''(ξ) − 8| ≥ 8 − |f''(ξ)| > 4。",
        "則存在 x 使 |f''(x)| ≥ 4。",
        "故存在 x 使 |f''(x)| ≥ 4。"
      ],
      coach: "從兩端各做一次泰勒到中點 1/2：兩個 f(1/2) 相等，f(0)、f(1)、f′(0)、f′(1) 都是題目給的數，剩下 f″(ξ)/8 − f″(η)/8 = 1。兩個數差 8，至少一個絕對值 ≥ 4 —— 分情況。"
    }
  ];
})();

// 白話證明的八課。
//
// 每一課：一段話講規則 → 一份寫好的證明（每一行旁邊是檢查器真的跑出來的註解）
// → 一個留白的練習（給開頭幾行，剩下的自己寫，即時三色回饋）。
// 課文裡引用的證明都是上面 BUZZ_PROOF_LANG_PROBLEMS 裡的題，教學跟題庫用同一套檢查器。

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
    },
    {
      id: "lesson-theorems",
      title: "第 6 課 · 定理當工具：存在句、前提、自訂函數",
      minutes: 6,
      intro: [
        "微積分的證明常常要「請一個定理出來」：由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f′(c)(y − x)。這種存在句檢查器認得：c 變成一個在 (x, y) 裡取樣的變數，後面那條關係式登記成條件，之後的每一句都在它之下驗。",
        "定理有前提，檢查器會查。平均值定理要先說 f 可微；中間值定理要先說函數連續、而且兩端異號（g(0) < 0、g(1) > 0 這種要真的算出來）。少一個前提，那一行標黃，不放行。",
        "「令 g(x) = x⁵ + x − 1。」可以自己定義函數，後面的 g(0)、g(c) 都照它算。「g 是多項式」「g 連續」「f 可微」這些文字事實它也收：多項式與 sin、cos、exp 加減乘出來的函數，它知道連續、可微；抽象的 f 則要題目給。",
        "抽象的 f(y)、f′(c) 算不出來，但檢查器把它們當成「不透明的值」：同一個寫法永遠是同一個數，所以 f(y) − f(x) = f′(c)(y − x) 登記之後，再寫 f′(c) = 0（題目給的），f(y) − f(x) = 0 就驗得了。"
      ],
      exampleId: "pl-ivt-root",
      exercise: {
        id: "pl-mvt-constant",
        starter: ["任取 x, y ∈ I 且 x < y。", "由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。"],
        task: "用題目給的 f′(c) = 0（寫成「因為 f'(c) = 0，所以 …」）推出 f(y) − f(x) = 0，再下結論 f(x) = f(y)。"
      }
    },
    {
      id: "lesson-sequences",
      title: "第 7 課 · 數列極限：ε-N",
      minutes: 4,
      intro: [
        "數列的極限把 δ 換成 N：任取 ε > 0 → 取 N =（用 ε 寫）→ 假設 n > N → 推出 |a_n − L| < ε → 結論。骨架跟 ε-δ 一模一樣，只是門檻變數叫 N，而且 n 只取正整數。",
        "N 怎麼找：先把 |a_n − L| 算乾淨（(n+1)/n − 1 = 1/n），再倒推「要它 < ε，n 要多大」。1/n < ε 就是 n > 1/ε；1/n² < ε 就是 n > 1/√ε。N 不一定長得像 1/ε。",
        "推導那一行照樣寫成鏈：|1/n − 0| = 1/n < 1/N = ε。最後一段「1/N = ε」是在檢查你的 N 有沒有取對 —— N 取錯，紅的就是這一段。"
      ],
      exampleId: "pl-seq-reciprocal",
      exercise: {
        id: "pl-seq-ratio",
        starter: ["任取 ε > 0。"],
        task: "取 N（用 ε 寫）、假設 n > N，再寫一條鏈從 |(n+1)/n − 1| 走到 < ε，最後下結論。"
      }
    },
    {
      id: "lesson-yellow",
      title: "第 8 課 · 黃色怎麼修：接地、跨行、移項",
      minutes: 5,
      intro: [
        "黃色是「數值上對，但我不知道你怎麼推出來的」。最常見的三種：一行直接寫目標、單獨一條關係式兩邊都沒在前面出現過、引用了定理但形狀對不上。修法都是同一個：從前一步寫一條鏈過來。",
        "什麼算接得上：鏈要從已知的東西出發 —— 一端是前面出現過的式子、宣告過的變數或定義、題目目標的一邊（多段鏈的起點，例如從 x² + 1 出發改寫成 (x − 1)² + 2x 再 ≥ 2x）；或第一段是顯然的起點（平方 ≥ 0、|·| ≥ 0、√ ≥ 0、|sin| ≤ 1、非負數的和與積 ≥ 0）；或跟前面某一條關係式移項後是同一件事。憑空冒出來的多段鏈不算，A = A 湊段數是紅的。",
        "「因為 P，所以 Q」的 P 也要立住：它得是題目給的、假設過的、前面推出來的、顯然的，或只由定義算得出來的（δ ≤ 1 而 δ = min(1, ε/7)）。拿目標當前提、再把目標當結論，兩句都會黃。式子裡不能有沒宣告的符號、不能有中文；一行只能一句；沒有句型的裸關係式（只寫「(x−1)² ≥ 0。」）是紅的 —— 它是推導、引入還是條件，你得說。",
        "鏈可以跨行：這一行的結尾是下一行的開頭，檢查器會接起來看。歸納步驟尤其要注意 —— 從 n = k+1 的左式出發，可以分兩三行，但要一路走到右式。",
        "引用定理時把形狀寫對：三角不等式是 |A + B| ≤ |A| + |B|，要用在 |x| − |y| ≤ |x − y| 上，得先把 x 拆成 (x − y) + y。範例就是這樣寫的。"
      ],
      exampleId: "pl-reverse-triangle",
      exercise: {
        id: "pl-cauchy-two",
        starter: ["設 a, b, c, d 為實數。"],
        task: "從一個平方 ≥ 0 出發（提示：(ad − bc)²），展開，再移項到 (a² + b²)(c² + d²) ≥ (ac + bd)²。先故意只寫最後一行，看它標黃；再補鏈讓它變綠。"
      }
    },
    {
      id: "lesson-taylor",
      title: "第 9 課 · 高手路線：抽象函數與泰勒定理",
      minutes: 7,
      intro: [
        "前八課的題目都算得出來。真正的分析題長這樣：「設 f 二次可微，|f| ≤ 1、|f″| ≤ 1，證明 |f′| ≤ 2」—— 沒有任何一個具體的函數。檢查器怎麼驗？它把 f(x)、f′(x)、f″(ξ) 當成三個不透明的變數：同一個寫法永遠是同一個數，關係式登記之後就在同一批取樣點上驗。",
        "泰勒定理是這一族的主力：「由泰勒定理，存在 ξ ∈ (x, x + h) 使 f(x + h) = f(x) + h f′(x) + (h²/2) f″(ξ)」。前提要先立住（題目給了「f 二次可微」就寫「因為 f 二次可微」或直接引用），形狀要對（等式左邊是 f(某點)，右邊含 f″(ξ)）。等式對某個還沒定義的 atom 是一次的，檢查器會自己把它解出來當定義 —— 所以第二個泰勒展開寫進去之後，f″(η) 就算得出來了。",
        "題目給的界（|f| ≤ 1）不會自動生效：你要在用到的那一句寫出來「因為 f(x + 2) ≤ 1 且 f(x + 2) ≥ −1 …」，它才登記進取樣。這不是檢查器笨，是證明本來就要說清楚哪一步用了哪個條件。",
        "分情況在這裡也常見：兩個數差 8，至少一個絕對值 ≥ 4 —— 情況一直接用條件當證人，情況二（否則）要真的推一條鏈才能下結論。範例是 |f′| ≤ 2 那題；練習是 f(0)=0, f(1)=1, f′(0)=f′(1)=0 ⇒ 某處 |f″| ≥ 4。"
      ],
      exampleId: "pl-classic-derivative-bound",
      exercise: {
        id: "pl-classic-second-derivative",
        starter: ["由泰勒定理，存在 ξ ∈ (0, 1/2) 使 f(1/2) = f(0) + f'(0)/2 + f''(ξ)/8。", "由泰勒定理，存在 η ∈ (1/2, 1) 使 f(1/2) = f(1) − f'(1)/2 + f''(η)/8。"],
        task: "兩個 f(1/2) 相等：寫出 f''(ξ) − f''(η) = 8。然後分兩種情況：|f''(ξ)| ≥ 4 直接得證；否則用 |f''(η)| = |f''(ξ) − 8| ≥ 8 − |f''(ξ)| > 4。最後一句「故存在 x 使 |f''(x)| ≥ 4」。"
      }
    }
  ];
})();
