(function () {
  "use strict";

  // 超越泰勒包（2026-08）：60 題，全部是「展開救不了」的極限。
  //
  // 動機一樣是量出來的。本包之前的極限區 234 題裡：
  //   x→0 的有限型 137 題（59%），解法或標籤提到展開的 68 題（31%）
  //   黎曼和 10、無窮乘積 5、單邊 3、答案是 dne 的 3、震盪 2、高斯括號 0、遞迴數列 0
  // 換句話說，這區練的幾乎是同一件事：把分子分母各展到某一階再比。
  // 那個技巧很重要，但它不是極限，它只是極限裡最馴的一種。
  //
  // （第一次量的時候把黎曼和寫成 0、無窮乘積寫成 0。那支統計腳本用 find()
  //  逐類比對、先命中就停，而「數列 n→∞」排在「黎曼和」前面，把它整個遮掉了。
  //  重數之後才發現有 10 題，其中 4 題還跟這一包初稿撞題。）
  //
  // 這一包補的是展開接不到的地方：
  //   黎曼和        14 ── 極限的答案是一個積分，不是一個係數
  //   夾擠與震盪     8 ── 函數在任何鄰域裡都不平滑，沒有「階」可言
  //   高斯括號       7 ── 階梯函數，導數幾乎處處是 0，展開等於零資訊
  //   遞迴與巢狀      7 ── 沒有封閉式可展，只有不動點
  //   無窮乘積        5 ── 取對數之後才回到級數，而且要先確定收斂
  //   單邊與不存在    8 ── e^{-1/x²} 的所有導數都是 0，展開是 0 但函數不是
  //   Stolz 與平均   6 ── 離散的「洛必達」，對象是和不是商
  //   n 次方根與 Stirling 5 ── n^{1/n} 這種收斂慢到展開根本沒開始
  //
  // 為什麼特別放 e^{-1/x²}：它是展開這個工具的邊界本身。
  // 它在 0 的泰勒級數每一項都是 0，級數收斂到 0，函數卻只有在 x=0 等於 0。
  // 學生如果只會展開，會在這裡得到一個「對的答案配錯的理由」。
  //
  // 驗算：這一包逼著把驗算器補了五條路 ——
  //   數列倍增取樣 + Aitken 外插（黎曼和、Stolz、n 次方根）
  //   部分乘積當數列（無窮乘積）
  //   夾擠取樣：不外插，只問取樣值的散布有沒有縮到零（震盪、階梯、x→∞）
  //   遞迴迭代（巢狀根式、連分數）—— 直接迭代，不解不動點方程
  //   「不存在」的正面反證：散布一路不縮，而不是「驗算器算不出來」
  // 外加四道防線，每一道都是被一個**很有自信的錯誤**逼出來的：
  //   相鄰項要長得像 —— n·sin(2πe·n!) 的極限確實是 2π，但 e·n! 早就超過 2^53，
  //     取樣值是純浮點雜訊，外插把它變成一個很穩的 53.06 去指控正確答案。
  //   跳動不能中途放大 —— n/(n!)^{1/n} 的 n! 從 171 起溢位成 Infinity，
  //     而 Infinity^{1/n} 還是 Infinity、n/Infinity = 0：溢位變回一個乾淨的 0。
  //   兩個取樣尺度要一致 —— H_n/log n 的誤差是 γ/log n，n=32000 時還有 5%。
  //   外插不能跳出取樣範圍 —— sin(n)/n 的取樣值是 ±1/n 的震盪，
  //     Aitken 在那上面吐出的數字純屬巧合。
  // 五條路加四道防線，這一包 60 題有 55 題（92%）通過獨立驗算。
  // 剩下 5 題的共通點是收斂階為 O(1/log n) 或取樣本身會溢位 ——
  // 那是數值方法的邊界，不是答案有疑問；寧可誠實標成「驗不了」。
  const SOURCE = "Buzz limit beyond taylor pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), `rank-${rank}`];
    if (rank >= 5) tags.push("boss-rank");
    if (rank === 6) tags.push("boss-plus");
    if (rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      topic: "limits",
      answerKind: "numeric",
      ...problem,
      tags
    });
  }

  const q = (id, rank, prompt, answer, tags, solution, timeLimit) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit });

  // 遞迴數列用的版本。這類題幹沒有可以直接求值的記號（沒有 \lim 開頭、
  // 沒有 \sum），驗算器接不到，所以附一條手寫路徑：照 a_{n+1}=g(a_n) 迭代。
  // 迭代不等於解不動點方程 —— 後者是解題者的推導，重跑一次證明不了任何事。
  const r = (id, rank, prompt, answer, tags, solution, timeLimit, verify) =>
    add({ id, rank, prompt, answer, tags, solution, timeLimit, verify });

  /* ═══════════ 一、黎曼和（14）═══════════
     和式的極限是一個定積分。難的不是積分，是看出 1/n 在哪、k/n 是誰。
     裡面刻意混了兩題「長得像黎曼和但不是」的 —— 少了 1/n 那個因子，
     整個和就只是 O(1/n)，答案是 0 不是積分。 */

  q("lm-rs-001", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{n}{n^2+4k^2}",
    "atan(2)/2",
    ["riemann-sum"],
    "提出 1/n：Σ(1/n)·1/(1+4(k/n)²) → ∫₀¹dx/(1+4x²) = ½arctan(2x)|₀¹ = ½arctan2。", 120);

  q("lm-rs-002", 3,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{k}{n^2+k^2}",
    "log(2)/2",
    ["riemann-sum", "log"],
    "Σ(1/n)·(k/n)/(1+(k/n)²) → ∫₀¹ x dx/(1+x²) = ½log2。", 110);

  q("lm-rs-003", 3,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{2n+k}",
    "log(3/2)",
    ["riemann-sum", "log"],
    "= Σ(1/n)·1/(2+k/n) → ∫₀¹dx/(2+x) = log(3/2)。分母那個 2 決定了積分下界，別急著套 log2。", 110);

  q("lm-rs-004", 2,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\sqrt{\\frac{k}{n}}",
    "2/3",
    ["riemann-sum"],
    "→ ∫₀¹√x dx = 2/3。", 90);

  q("lm-rs-005", 3,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\sin\\left(\\frac{\\pi k}{n}\\right)",
    "2/pi",
    ["riemann-sum", "trig"],
    "→ ∫₀¹ sin(πx)dx = 2/π。注意積出來的 1/π 不要漏。", 100);

  q("lm-rs-006", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{\\sqrt{n^2+k^2}}",
    "log(1+sqrt(2))",
    ["riemann-sum", "hyperbolic"],
    "→ ∫₀¹dx/√(1+x²) = arsinh 1 = log(1+√2)。", 130);

  q("lm-rs-007", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\log\\left(1+\\frac{k}{n}\\right)",
    "2*log(2)-1",
    ["riemann-sum", "log"],
    "→ ∫₀¹log(1+x)dx = [(1+x)log(1+x)−x]₀¹ = 2log2−1。", 130);

  q("lm-rs-008", 3,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{n}{(n+k)^2}",
    "1/2",
    ["riemann-sum"],
    "→ ∫₀¹dx/(1+x)² = 1/2。", 110);

  q("lm-rs-009", 3,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}e^{k/n}",
    "E-1",
    ["riemann-sum", "exponential"],
    "→ ∫₀¹eˣdx = e−1。（也可以直接用等比級數求和再取極限。）", 100);

  q("lm-rs-010", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\frac{k^2}{n^2+k^2}",
    "1-pi/4",
    ["riemann-sum"],
    "→ ∫₀¹x²/(1+x²)dx = ∫₀¹(1−1/(1+x²))dx = 1−π/4。", 130);

  q("lm-rs-011", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{k}{n^2}\\sqrt{1+\\frac{k^2}{n^2}}",
    "(2*sqrt(2)-1)/3",
    ["riemann-sum"],
    "→ ∫₀¹x√(1+x²)dx = ⅓(1+x²)^{3/2}|₀¹ = (2√2−1)/3。", 140);

  q("lm-rs-012", 5,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\frac{1}{1+\\left(\\frac{k}{n}\\right)^3}",
    "log(2)/3+pi/(3*sqrt(3))",
    ["riemann-sum", "partial-fractions"],
    "→ ∫₀¹dx/(1+x³)。分母拆成 (1+x)(x²−x+1) 再部分分式：得 (log2)/3 + π/(3√3)。", 180);

  q("lm-rs-013", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{n^2+k}",
    "0",
    ["riemann-sum", "trap-drill"],
    "看起來像黎曼和，但少了 1/n。整個和夾在 n/(n²+n) 與 n/(n²+1) 之間，兩邊都 → 0。", 120);

  q("lm-rs-014", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{k}{n^2+k}",
    "1/2",
    ["riemann-sum", "trap-drill"],
    "同樣不是黎曼和。分母裡的 k 相對 n² 可以忽略，和 ≈ (1/n²)·n(n+1)/2 → 1/2。", 130);

  /* ═══════════ 二、夾擠與震盪（8）═══════════
     這一組的共同點：函數在 0 的任何鄰域裡都不平滑，
     所以「展到第幾階」這句話根本沒有意義。能用的只有不等式。 */

  q("lm-sq-001", 3,
    "\\lim_{x\\to 0}\\sqrt{|x|}\\,\\sin\\frac{1}{x}",
    "0",
    ["squeeze", "oscillation"],
    "|√|x|·sin(1/x)| ≤ √|x| → 0。sin(1/x) 本身沒有極限，但它有界就夠了；振幅只要趨近 0，收斂得多慢都無所謂。", 100);

  q("lm-sq-002", 3,
    "\\lim_{x\\to 0}x\\cos\\frac{1}{x^2}",
    "0",
    ["squeeze", "oscillation"],
    "|x·cos(1/x²)| ≤ |x| → 0。震盪頻率再高都不影響，因為振幅被 x 壓住。", 90);

  q("lm-sq-003", 4,
    "\\lim_{x\\to 0}x^3\\sin\\frac{1}{x^2}\\cos\\frac{1}{x}",
    "0",
    ["squeeze", "oscillation"],
    "兩個震盪因子都有界，乘積仍有界，|f| ≤ |x|³ → 0。", 110);

  q("lm-sq-004", 3,
    "\\lim_{x\\to \\infty}\\frac{\\sin x}{x}",
    "0",
    ["squeeze", "oscillation"],
    "|sin x/x| ≤ 1/|x| → 0。注意這裡不能用洛必達：cos x 沒有極限。", 90);

  q("lm-sq-005", 4,
    "\\lim_{x\\to 0}\\frac{1-\\cos x}{x}\\sin\\frac{1}{x}",
    "0",
    ["squeeze", "oscillation"],
    "(1−cos x)/x → 0，乘上有界的 sin(1/x) 仍 → 0。", 110);

  q("lm-sq-006", 4,
    "\\lim_{x\\to 0}\\sin\\left(\\frac{1}{x}\\right)",
    "dne",
    ["oscillation", "dne"],
    "取 x = 1/(2kπ) 得 0，取 x = 1/(2kπ+π/2) 得 1。兩串都 → 0 卻給不同的值，極限不存在。", 90);

  q("lm-sq-007", 5,
    "\\lim_{x\\to 0}\\frac{\\sin x}{x}\\sin\\frac{1}{x}",
    "dne",
    ["oscillation", "dne", "trap-drill"],
    "第一個因子 → 1，第二個震盪不收斂，乘積因此不收斂。陷阱在於「前面那塊有極限」會讓人以為整體有極限。", 120);

  q("lm-sq-008", 4,
    "\\lim_{x\\to \\infty}\\frac{\\cos x}{\\log x}",
    "0",
    ["squeeze", "oscillation"],
    "|cos x/log x| ≤ 1/log x → 0。分母長得再慢也還是 → ∞。", 100);

  /* ═══════════ 三、高斯括號（7）═══════════
     ⌊x⌋ 幾乎處處導數為 0，展開能給的資訊是零。
     這一組全部只能用 x−1 < ⌊x⌋ ≤ x 這條不等式。 */

  q("lm-fl-001", 4,
    "\\lim_{x\\to 0^+}x\\left\\lfloor\\frac{1}{x}\\right\\rfloor",
    "1",
    ["floor", "squeeze"],
    "由 1/x − 1 < ⌊1/x⌋ ≤ 1/x 乘上 x>0 得 1−x < x⌊1/x⌋ ≤ 1，夾擠得 1。", 120);

  q("lm-fl-002", 5,
    "\\lim_{x\\to 0^-}x\\left\\lfloor\\frac{1}{x}\\right\\rfloor",
    "1",
    ["floor", "squeeze", "trap-drill"],
    "x<0 時乘不等式要變號，但 ⌊1/x⌋ 也跟著在負的那側，兩個變號抵消，仍然是 1。左右極限相同。", 140);

  q("lm-fl-003", 3,
    "\\lim_{x\\to 2^-}\\left\\lfloor x\\right\\rfloor",
    "1",
    ["floor", "one-sided"],
    "從左邊逼近 2 時 x 落在 [1,2)，⌊x⌋ 恆為 1。答案不是 2。", 70);

  q("lm-fl-004", 3,
    "\\lim_{x\\to \\infty}\\frac{\\left\\lfloor x\\right\\rfloor}{x}",
    "1",
    ["floor", "squeeze"],
    "(x−1)/x < ⌊x⌋/x ≤ 1，左邊 → 1。", 90);

  q("lm-fl-005", 5,
    "\\lim_{x\\to 0}\\left\\lfloor\\frac{\\sin x}{x}\\right\\rfloor",
    "0",
    ["floor", "trap-drill"],
    "sin x/x → 1 但在 x≠0 時**嚴格小於** 1，所以括號裡恆落在 (0,1)，⌊·⌋ = 0。極限是 0 不是 1。", 140);

  q("lm-fl-006", 5,
    "\\lim_{x\\to 0}\\left\\lfloor\\frac{\\tan x}{x}\\right\\rfloor",
    "1",
    ["floor", "trap-drill"],
    "tan x/x → 1 但在 x≠0 時**嚴格大於** 1，落在 (1,·)，⌊·⌋ = 1。和上一題只差一個不等號方向。", 140);

  q("lm-fl-007", 4,
    "\\lim_{x\\to \\infty}\\frac{\\left\\lfloor 3x\\right\\rfloor}{x}",
    "3",
    ["floor", "squeeze"],
    "(3x−1)/x < ⌊3x⌋/x ≤ 3，夾擠得 3。", 100);

  /* ═══════════ 四、遞迴與巢狀根式（7）═══════════
     沒有封閉式可以展開。要先說明數列收斂，再對遞迴式兩邊取極限。
     驗算走的是直接迭代 —— 刻意不解不動點方程，那是解題者的推導。 */

  r("lm-rc-001", 4,
    "a_1=\\sqrt{2},\\quad a_{n+1}=\\sqrt{2+a_n},\\quad \\lim_{n\\to\\infty}a_n",
    "2",
    ["recurrence", "nested-radical"],
    "遞增且上界為 2（歸納），故收斂。設極限 L：L=√(2+L) ⟹ L²−L−2=0 ⟹ L=2。", 150,
    { m: "recurrence", a0: "\\sqrt{2}", f: "\\sqrt{2+a}" });

  r("lm-rc-002", 4,
    "a_1=\\sqrt{6},\\quad a_{n+1}=\\sqrt{6+a_n},\\quad \\lim_{n\\to\\infty}a_n",
    "3",
    ["recurrence", "nested-radical"],
    "L=√(6+L) ⟹ L²−L−6=0 ⟹ L=3（取正根）。", 150,
    { m: "recurrence", a0: "\\sqrt{6}", f: "\\sqrt{6+a}" });

  r("lm-rc-003", 5,
    "a_1=1,\\quad a_{n+1}=1+\\frac{1}{a_n},\\quad \\lim_{n\\to\\infty}a_n",
    "(1+sqrt(5))/2",
    ["recurrence", "continued-fraction"],
    "連分數 1+1/(1+1/(1+…))。L=1+1/L ⟹ L²−L−1=0 ⟹ L=(1+√5)/2。注意此數列是**振盪**收斂，不是單調。", 160,
    { m: "recurrence", a0: "1", f: "1+\\frac{1}{a}" });

  r("lm-rc-004", 5,
    "a_1=1,\\quad a_{n+1}=\\sqrt{1+a_n},\\quad \\lim_{n\\to\\infty}a_n",
    "(1+sqrt(5))/2",
    ["recurrence", "nested-radical"],
    "L=√(1+L) ⟹ L²−L−1=0 ⟹ 黃金比例。和上一題殊途同歸。", 150,
    { m: "recurrence", a0: "1", f: "\\sqrt{1+a}" });

  r("lm-rc-005", 5,
    "a_1=2,\\quad a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{2}{a_n}\\right),\\quad \\lim_{n\\to\\infty}a_n",
    "sqrt(2)",
    ["recurrence", "newton"],
    "這是 Newton 法解 x²=2。L=(L+2/L)/2 ⟹ L²=2 ⟹ L=√2。收斂是二次的，四次迭代就到小數第十位。", 160,
    { m: "recurrence", a0: "2", f: "\\frac{1}{2}\\left(a+\\frac{2}{a}\\right)" });

  r("lm-rc-006", 5,
    "a_1=1,\\quad a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{3}{a_n}\\right),\\quad \\lim_{n\\to\\infty}a_n",
    "sqrt(3)",
    ["recurrence", "newton"],
    "同樣是 Newton 法，這次解 x²=3。", 160,
    { m: "recurrence", a0: "1", f: "\\frac{1}{2}\\left(a+\\frac{3}{a}\\right)" });

  r("lm-rc-007", 6,
    "a_1=\\frac{1}{2},\\quad a_{n+1}=\\cos a_n,\\quad \\lim_{n\\to\\infty}a_n",
    "0.7390851332",
    ["recurrence", "fixed-point"],
    "cos 在 [0,1] 上是壓縮映射（|cos′| = |sin| ≤ sin1 < 1），故收斂到唯一不動點 L=cos L。這個數沒有初等封閉式，只能數值求。", 200,
    { m: "recurrence", a0: "\\frac{1}{2}", f: "\\cos a", tol: 1e-9 });

  /* ═══════════ 五、無窮乘積（5）═══════════
     取對數之後才變成級數，但要先確定乘積收斂（不能有因子趨近 0）。
     這幾題其實都可以望遠鏡消掉，不必真的取對數。 */

  q("lm-pr-001", 4,
    "\\prod_{n=2}^{\\infty}\\left(1-\\frac{1}{n^2}\\right)",
    "1/2",
    ["infinite-product", "telescoping"],
    "1−1/n² = (n−1)(n+1)/n²。部分乘積望遠鏡剩 (1/2)·(N+1)/N → 1/2。", 140);

  q("lm-pr-002", 5,
    "\\prod_{n=1}^{\\infty}\\left(1+\\frac{1}{n(n+2)}\\right)",
    "2",
    ["infinite-product", "telescoping"],
    "1+1/(n(n+2)) = (n+1)²/(n(n+2))。部分乘積 = (N+1)/1 · 2/(N+2) → 2。", 160);

  q("lm-pr-003", 5,
    "\\prod_{n=2}^{\\infty}\\left(1-\\frac{2}{n(n+1)}\\right)",
    "1/3",
    ["infinite-product", "telescoping"],
    "1−2/(n(n+1)) = (n−1)(n+2)/(n(n+1))。望遠鏡後 → 1/3。", 170);

  q("lm-pr-004", 6,
    "\\prod_{n=2}^{\\infty}\\frac{n^2+n}{n^2+n-2}",
    "3",
    ["infinite-product", "telescoping"],
    "分子 n(n+1)、分母 (n+2)(n−1)。部分乘積拆成兩串：∏n/(n−1) = N，∏(n+1)/(n+2) = 3/(N+2)，相乘得 3N/(N+2) → 3。", 210);

  q("lm-pr-005", 6,
    "\\prod_{n=1}^{\\infty}\\cos\\left(\\frac{\\pi}{2^{n+1}}\\right)",
    "2/pi",
    ["infinite-product", "trig"],
    "Viète 公式。反覆用 sin2θ = 2 sinθ cosθ：部分乘積 = sin(π/2)/(2^N sin(π/2^{N+1})) → 2/π。", 220);

  /* ═══════════ 六、單邊與不存在（8）═══════════
     e^{-1/x²} 是這一組的核心：它在 0 的每一階導數都是 0，
     泰勒級數恆等於 0，但函數不是 0。展開在這裡不只是不夠力，是會給錯理由。 */

  q("lm-os-001", 4,
    "\\lim_{x\\to 0^+}e^{-1/x}",
    "0",
    ["one-sided", "exponential"],
    "x→0⁺ 時 −1/x → −∞，故 e^{−1/x} → 0。", 90);

  q("lm-os-002", 5,
    "\\lim_{x\\to 0}e^{-1/x^2}",
    "0",
    ["one-sided", "exponential", "trap-drill"],
    "兩側都是 −1/x² → −∞，故極限 0。值得注意：這個函數在 0 的所有導數都是 0，泰勒級數恆為 0，卻只有在 x=0 才真的等於 0 —— 展開能算對這題，但理由是錯的。", 150);

  q("lm-os-003", 5,
    "\\lim_{x\\to 0^+}\\frac{1}{1+e^{1/x}}",
    "0",
    ["one-sided", "exponential"],
    "1/x → +∞ ⟹ e^{1/x} → ∞ ⟹ 整體 → 0。（從左邊逼近則 → 1，所以雙側極限不存在。）", 130);

  q("lm-os-004", 4,
    "\\lim_{x\\to 0}\\arctan\\frac{1}{x}",
    "dne",
    ["one-sided", "dne", "inverse-trig"],
    "右極限 π/2、左極限 −π/2，不相等，故不存在。", 100);

  q("lm-os-005", 3,
    "\\lim_{x\\to 0}\\frac{|x|}{x}",
    "dne",
    ["one-sided", "dne"],
    "右邊恆為 1、左邊恆為 −1。", 70);

  q("lm-os-006", 5,
    "\\lim_{x\\to 0^+}x^{1/\\log x}",
    "E",
    ["one-sided", "log", "trap-drill"],
    "取對數：(1/log x)·log x = 1，所以這個函數**恆等於 e**，根本不是不定型。看穿它比算它重要。", 150);

  q("lm-os-007", 4,
    "\\lim_{x\\to 0^+}x^{\\sin x}",
    "1",
    ["one-sided", "indeterminate"],
    "取對數：sin x·log x ≈ x log x → 0，故極限 1。", 130);

  q("lm-os-008", 5,
    "\\lim_{x\\to 0^+}\\left(\\sin x\\right)^{\\tan x}",
    "1",
    ["one-sided", "indeterminate"],
    "取對數：tan x·log(sin x) ≈ x·log x → 0，故極限 1。", 150);

  /* ═══════════ 七、Stolz 與平均（6）═══════════
     離散版的洛必達：對象是和不是商，比的是相鄰兩項的增量。
     這一組的收斂普遍很慢，正是外插器最容易誤判的一段。 */

  q("lm-st-001", 5,
    "\\lim_{n\\to\\infty}\\frac{1}{\\sqrt{n}}\\sum_{k=1}^{n}\\frac{1}{\\sqrt{k}}",
    "2",
    ["stolz", "cesaro"],
    "Stolz：增量比 = (1/√n)/(√n−√(n−1)) = (1/√n)·(√n+√(n−1)) → 2。", 170);

  q("lm-st-002", 5,
    "\\lim_{n\\to\\infty}\\left(\\sum_{k=1}^{n}\\frac{1}{k}-\\log n\\right)",
    "0.5772156649",
    ["stolz", "euler-mascheroni"],
    "這個極限就是 Euler–Mascheroni 常數 γ。它沒有已知的初等封閉式，也不知道是不是無理數。", 190);

  q("lm-st-003", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{\\log n}\\sum_{k=1}^{n}\\frac{1}{k}",
    "1",
    ["stolz", "harmonic"],
    "調和數 ≈ log n + γ，除以 log n → 1。γ 那一項被除掉了。", 140);

  q("lm-st-004", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\cos\\frac{1}{k}",
    "1",
    ["stolz", "cesaro"],
    "cos(1/k) → 1，而 Cesàro 平均保持極限，故也是 1。注意這**不是**黎曼和：項只跟 k 有關、跟 n 無關，湊不出 k/n。", 140);

  q("lm-st-005", 5,
    "\\lim_{n\\to\\infty}\\frac{1}{n\\log n}\\sum_{k=1}^{n}\\log k",
    "1",
    ["stolz", "stirling"],
    "Σlog k = log(n!) ≈ n log n − n，除以 n log n → 1。", 170);

  q("lm-st-006", 5,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}k^{1/k}",
    "1",
    ["stolz", "cesaro"],
    "k^{1/k} → 1，而 Cesàro 平均保持極限，故也是 1。", 160);

  /* ═══════════ 八、n 次方根與 Stirling（5）═══════════
     n^{1/n} 收斂得比任何展開的收斂半徑都慢：n=10⁶ 時還有 1.4×10⁻⁵ 的誤差。
     這一組只能取對數再看階。 */

  q("lm-nr-001", 3,
    "\\lim_{n\\to\\infty}\\sqrt[n]{n}",
    "1",
    ["nth-root", "log"],
    "取對數：(log n)/n → 0，故原式 → 1。", 100);

  q("lm-nr-002", 4,
    "\\lim_{n\\to\\infty}\\sqrt[n]{2^n+3^n}",
    "3",
    ["nth-root", "squeeze"],
    "3 ≤ (2ⁿ+3ⁿ)^{1/n} ≤ 3·2^{1/n} → 3。最大的那一項說了算。", 120);

  q("lm-nr-003", 5,
    "\\lim_{n\\to\\infty}n\\left(\\sqrt[n]{7}-1\\right)",
    "log(7)",
    ["nth-root", "log"],
    "7^{1/n}−1 = e^{(log7)/n}−1 ≈ (log7)/n，乘 n 得 log7。這條式子反過來就是「n 次方根逼近對數」的古典算法。", 150);

  // 這題必須手寫驗算路徑，理由是純數值的：n! 從 n=171 起就溢位成 Infinity，
  // 而 Infinity^{1/n} 還是 Infinity、n/Infinity = 0 —— 溢位在中途變回一個
  // 乾乾淨淨的 0，取樣值於是從某一點開始整串都是假的。
  // 這裡改用 (n!)^{1/n} = exp((1/n)Σlog k)，數學上是同一個東西，但不會溢位。
  // 注意它仍然不是「解答的推導」：沒有用到 Stirling，只是把定義算穩。
  r("lm-nr-004", 6,
    "\\lim_{n\\to\\infty}\\frac{n}{\\sqrt[n]{n!}}",
    "E",
    ["nth-root", "stirling"],
    "由 Stirling，(n!)^{1/n} ≈ n/e，故比值 → e。也可以用 aₙ₊₁/aₙ 的根值定理做。", 200,
    { m: "seqLimit", f: "\\frac{n}{\\exp\\left(\\frac{1}{n}\\sum_{k=1}^{n}\\log k\\right)}" });

  q("lm-nr-005", 5,
    "\\lim_{n\\to\\infty}\\frac{n!}{n^n}",
    "0",
    ["nth-root", "stirling"],
    "n!/nⁿ = ∏(k/n) ≤ (1/n)·1 → 0。收斂快得像 e^{−n}。", 150);

  /* ═══════════ 提示 ═══════════
     只寫給 R5 以上、而且原本一條提示都沒有的題。
     第一層說「該看出什麼」，第二層說「關鍵那一步」—— 兩層都不說出答案，
     否則提示就只是延後幾秒的解答。
     用對照表而不是塞進上面每一題的參數列，是為了讓題目定義那一段保持可讀。 */
  const HINTS = {
    "lm-rs-012": [
      "和式裡每一項只透過 k/n 依賴 k，前面又剛好有一個 1/n —— 這是黎曼和的長相。先把它寫成 ∫₀¹ 的積分。",
      "積分出來之後分母要先因式分解成 (1+x)(x²−x+1) 再做部分分式；二次那一塊配方之後會冒出 arctan。"
    ],
    "lm-rc-003": [
      "先確認它收斂。這個數列是振盪的（一項在極限之上、下一項在之下），所以「單調有界」用不上，要看相鄰兩項的距離有沒有一直縮小。",
      "確定收斂之後對遞迴式兩邊取極限，L 會滿足一個二次方程。記得負根不合（數列每一項都是正的）。"
    ],
    "lm-rc-004": [
      "這是巢狀根式 √(1+√(1+…)) 的遞迴寫法。先用歸納法證明它遞增而且有上界。",
      "兩邊取極限得 L=√(1+L)，平方後是二次方程；只有正根有意義。"
    ],
    "lm-rc-005": [
      "把遞迴式看成某個函數的 Newton 迭代。問自己：對哪一個 f，公式 x − f/f′ 會長成 (x + 2/x)/2？",
      "認出那個 f 之後，極限就是它的根。不想繞這一圈的話，直接對遞迴式兩邊取極限也解得出來。"
    ],
    "lm-rc-006": [
      "跟前一題同一個模式，只是被開方的數換了。先問這個迭代在解哪一個方程。",
      "兩邊取極限：L = (L + 3/L)/2。整理之後 L² 會等於式子裡那個常數，取正根。"
    ],
    "lm-pr-002": [
      "先把括號裡通分成一個分數 —— 分子會變成一個完全平方。",
      "寫成 (n+1)²/(n(n+2)) 之後，把部分乘積拆成 ∏(n+1)/n 與 ∏(n+1)/(n+2) 兩串，各自望遠鏡。"
    ],
    "lm-pr-003": [
      "通分之後分子是一個二次式，先把它因式分解。",
      "分子分母都變成兩個一次式相乘之後，部分乘積會拆成兩串，各自消掉中間絕大部分的項。"
    ],
    "lm-os-003": [
      "先只看指數：x 從正的那一側趨近 0 時，1/x 跑到哪裡去？",
      "指數的行為決定分母的大小。注意這題只問右極限 —— 從左邊逼近時 1/x 跑向另一端，結果不一樣。"
    ],
    "lm-os-008": [
      "底數趨近 0、指數也趨近 0，這是 0⁰ 不定型。先取對數，把冪次變成乘積。",
      "取對數後是 tan x · log(sin x)。tan x 與 sin x 在 0 附近都跟 x 同階，所以整體跟 x·log x 同階。"
    ],
    "lm-st-001": [
      "這不是黎曼和 —— 項只跟 k 有關，湊不出 k/n。改用 Stolz 定理，它是離散版的洛必達。",
      "Stolz 比的是分子與分母的增量比：分子增量是 1/√n，分母增量是 √n − √(n−1)，把後者有理化就看得出來了。"
    ],
    "lm-st-002": [
      "調和數比 log n 大一點點，而那個差距會穩定下來。把和看成矩形面積，跟 ∫dx/x 的曲線下面積比較。",
      "1/k 與 ∫ₖ^{k+1}dx/x 的差是正的而且遞減，累加起來有界 —— 這就是極限存在的證明。它是一個有名字的常數，沒有初等封閉式。"
    ],
    "lm-st-004": [
      "先看單項：k 變大時 cos(1/k) 趨近什麼？",
      "單項有極限的話，它的算術平均會收到同一個值。注意這不是黎曼和 —— 項裡湊不出 k/n。"
    ],
    "lm-st-005": [
      "分子那個和其實就是 log(n!)。",
      "用 Stirling 或 Stolz 都行：n log n 是主導項，被減掉的 n 除以 n log n 之後會消失。"
    ],
    "lm-st-006": [
      "先問單項 k^{1/k} 在 k→∞ 會趨近什麼 —— 取對數看 (log k)/k。",
      "單項有極限，它的算術平均也會收到同一個值：前面幾項再怪，都會被 1/n 稀釋掉。"
    ],
    "lm-nr-003": [
      "把 7^{1/n} 寫成 e 的指數形式。",
      "指數是 (log 7)/n，很小。用 e^t − 1 ≈ t，就看得出乘上 n 之後剩下什麼。"
    ],
    "lm-nr-005": [
      "把它寫成連乘積 ∏(k/n)，每一個因子都不超過 1。",
      "只要抓住其中一個特別小的因子（k=1 那一項就是 1/n），就能把整個乘積從上面夾住。"
    ],
    "lm-rc-007": [
      "先確認迭代會收斂：在 [0,1] 上 |cos′| = |sin| 嚴格小於 1，這是壓縮映射。",
      "壓縮映射有唯一不動點，所以極限滿足 L = cos L。這個方程沒有初等解，答案只能用數值求。"
    ],
    "lm-pr-004": [
      "分子分母各自因式分解 —— 兩邊都會裂成兩個一次式。",
      "拆成兩串乘積分別望遠鏡：一串留下最前面的常數，另一串留下一個趨近 1 的比值。"
    ],
    "lm-pr-005": [
      "用 sin 2θ = 2 sin θ cos θ，把每一個 cos 換成兩個 sin 的比。",
      "換完之後部分乘積層層相消，只剩最外層的 sin 與最內層的 2^N·sin(π/2^{N+1})；後者用 sin t ≈ t 收尾。"
    ],
    "lm-nr-004": [
      "對 (n!)^{1/n} 取對數：它是 (1/n)·Σlog k，也就是 log k 的算術平均。",
      "那個平均可以用 Stirling，也可以看成 ∫₀¹log x dx 的黎曼和。算完再把外面的 n 除回去。"
    ]
  };

  problems.forEach((problem) => {
    if (HINTS[problem.id]) problem.hints = HINTS[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
