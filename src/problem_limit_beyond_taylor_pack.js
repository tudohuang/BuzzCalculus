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
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\ln\\left(1+\\frac{k}{n}\\right)",
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
    "\\lim_{x\\to \\infty}\\frac{\\cos x}{\\ln x}",
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
    "\\lim_{x\\to 0^+}x^{1/\\ln x}",
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
    "\\lim_{n\\to\\infty}\\left(\\sum_{k=1}^{n}\\frac{1}{k}-\\ln n\\right)",
    "0.5772156649",
    ["stolz", "euler-mascheroni"],
    "這個極限就是 Euler–Mascheroni 常數 γ。它沒有已知的初等封閉式，也不知道是不是無理數。", 190);

  q("lm-st-003", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{\\ln n}\\sum_{k=1}^{n}\\frac{1}{k}",
    "1",
    ["stolz", "harmonic"],
    "調和數 ≈ log n + γ，除以 log n → 1。γ 那一項被除掉了。", 140);

  q("lm-st-004", 4,
    "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\cos\\frac{1}{k}",
    "1",
    ["stolz", "cesaro"],
    "cos(1/k) → 1，而 Cesàro 平均保持極限，故也是 1。注意這**不是**黎曼和：項只跟 k 有關、跟 n 無關，湊不出 k/n。", 140);

  q("lm-st-005", 5,
    "\\lim_{n\\to\\infty}\\frac{1}{n\\ln n}\\sum_{k=1}^{n}\\ln k",
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
    { m: "seqLimit", f: "\\frac{n}{\\exp\\left(\\frac{1}{n}\\sum_{k=1}^{n}\\ln k\\right)}" });

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

/* ═══════════════════════════════════════════════════════════════════
   極限深化包（lx-，2026-09-23）：應用題 × 觀念題 × 更難的計算。
   起因：盤點發現 335 題極限**全部**是純計算，帶敘述的應用題 0 題。
   真實的考卷不是這樣：瞬時速度、藥物濃度的長期行為、連續複利、
   終端速度、學習曲線、電路充電、連分數、幾何逼近，全是極限在用。

   驗算：題幹是文字敘述的題，自動辨識器讀不出結構，一律自帶 verify 欄位
   （新的 m: "limit" 路徑走數值逼近＋外插，不重複作者的代數）。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const SOURCE = "Buzz 極限深化 2026-09";
  const problems = [];

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    problems.push({
      source: SOURCE,
      topic: "limits",
      difficulty: Math.min(4, problem.rank),
      answerKind: "numeric",
      timeLimit: problem.timeLimit || 90,
      ...problem,
      tags
    });
  }

  // 應用題：題幹一段敘述，答案是一個數，驗算走 m:"limit"。
  const applied = (id, rank, prompt, answer, verify, extra) => add({
    id, rank, prompt, answer, verify,
    tags: (extra.tags || []).concat(["applied-limit", "word-problem"]),
    hints: extra.hints,
    solution: extra.solution,
    timeLimit: extra.timeLimit || 100
  });

  /* ── A. 變化率與瞬時速度（R2–R4）：極限最原始的用途 ── */
  applied("lx-app-001", 2,
    "\\text{石頭從 }80\\text{ 公尺高的崖上落下，}t\\text{ 秒後的高度 }h(t)=80-4.9t^2\\text{（公尺）。}\\quad\\text{求 }t=2\\text{ 秒時的瞬時速度（公尺／秒，向下為負）}",
    "-19.6", { m: "limit", f: "\\frac{(80-4.9(2+h)^2)-(80-4.9 \\cdot 4)}{h}", at: 0, v: "h" },
    { tags: ["motion", "derivative-definition"],
      hints: ["瞬時速度＝平均速度在時間間隔趨近 0 時的極限。", "算 (h(2+Δt)−h(2))/Δt，再讓 Δt→0。", "−4.9(4+4Δt+Δt²−4)/Δt = −4.9(4+Δt)。"],
      solution: "極限是 −4.9·4 = −19.6 公尺／秒（向下）。" });

  applied("lx-app-002", 3,
    "\\text{某城市 }t\\text{ 年後的人口（萬人）為}\\quad P(t)=\\frac{120t+300}{t+6}\\text{。}\\quad\\text{長期而言人口趨近多少萬人？}",
    "120", { m: "limit", f: "\\frac{120t+300}{t+6}", at: "inf", v: "t" },
    { tags: ["rational-limit", "asymptote"],
      hints: ["t→∞ 時分子分母同除以 t。", "常數項除以 t 之後都趨近 0，只剩兩個領導係數的比。"],
      solution: "同除以 t 之後趨近 120／1 = 120 萬人，這是水平漸近線。" });

  applied("lx-app-003", 3,
    "\\text{點滴每小時注入固定劑量，}t\\text{ 小時後血中濃度為}\\quad C(t)=12\\left(1-e^{-0.4t}\\right)\\text{ 毫克／公升。}\\quad\\text{長期穩定濃度是多少？}",
    "12", { m: "limit", f: "12(1-e^{-0.4t})", at: "inf", v: "t" },
    { tags: ["exponential-limit", "asymptote"],
      hints: ["t→∞ 時 e^{−0.4t}→0。"],
      solution: "指數項趨近 0，濃度趨近 12 毫克／公升（穩定值）。" });

  applied("lx-app-004", 3,
    "\\text{本金 }10000\\text{ 元、年利率 }5\\%\\text{，一年內複利 }n\\text{ 次的本利和是 }10000\\left(1+\\frac{0.05}{n}\\right)^{n}\\text{。}\\quad\\text{連續複利（}n\\to\\infty\\text{）一年後是多少元？}",
    "10000*exp(0.05)", { m: "limit", f: "10000(1+\\frac{0.05}{n})^{n}", at: "inf", v: "n" },
    { tags: ["exponential-limit", "standard-limit"],
      hints: ["這是 (1+1/m)^m → e 的變形。", "令 m = n/0.05。"],
      solution: "極限是 10000·e^{0.05} ≈ 10512.71 元。" });

  applied("lx-app-005", 4,
    "\\text{跳傘者的速度為 }v(t)=55\\left(1-e^{-0.18t}\\right)\\text{ 公尺／秒。}\\quad\\text{終端速度是多少公尺／秒？}",
    "55", { m: "limit", f: "55(1-e^{-0.18t})", at: "inf", v: "t" },
    { tags: ["exponential-limit", "motion"],
      hints: ["終端速度＝t→∞ 的極限。"],
      solution: "e^{−0.18t}→0，終端速度 55 公尺／秒。" });

  applied("lx-app-006", 4,
    "\\text{電容充電電壓 }V(t)=9\\left(1-e^{-t/\\tau}\\right)\\text{，時間常數 }\\tau=0.25\\text{ 秒。}\\quad\\text{充電一段時間後電壓趨近多少伏特？}",
    "9", { m: "limit", f: "9(1-e^{-t/0.25})", at: "inf", v: "t" },
    { tags: ["exponential-limit", "applications"],
      hints: ["t→∞ 時指數項趨近 0。"],
      solution: "趨近電源電壓 9 伏特。" });

  applied("lx-app-007", 4,
    "\\text{某工廠的平均成本為 }\\bar{C}(x)=\\frac{2400+18x}{x}\\text{ 元／件。}\\quad\\text{產量很大時平均成本趨近多少元／件？}",
    "18", { m: "limit", f: "\\frac{2400+18x}{x}", at: "inf" },
    { tags: ["rational-limit", "applications"],
      hints: ["拆成 2400/x + 18。"],
      solution: "固定成本被攤薄，平均成本趨近邊際成本 18 元／件。" });

  applied("lx-app-008", 4,
    "\\text{學習曲線：練習 }x\\text{ 小時後的正確率為}\\quad A(x)=\\frac{95x}{x+12}\\text{ 百分比。}\\quad\\text{再怎麼練也不會超過多少百分比？}",
    "95", { m: "limit", f: "\\frac{95x}{x+12}", at: "inf" },
    { tags: ["rational-limit", "asymptote"],
      hints: ["同除以 x。"],
      solution: "上界是水平漸近線 95%，永遠達不到。" });

  applied("lx-app-009", 4,
    "\\text{每天服藥一次，長期後體內殘留量為 }\\sum_{k=0}^{n}200\\left(0.7\\right)^{k}\\text{ 毫克。}\\quad n\\to\\infty\\text{ 時殘留量趨近多少毫克？}",
    "2000/3", { m: "limit", f: "200\\frac{1-0.7^{n+1}}{1-0.7}", at: "inf", v: "n" },
    { tags: ["geometric", "applications"],
      hints: ["這是等比級數的部分和。", "首項 200、公比 0.7。"],
      solution: "部分和 200(1−0.7^{n+1})/0.3 → 200/0.3 = 2000/3 ≈ 666.7 毫克。" });

  applied("lx-app-010", 5,
    "\\text{正 }n\\text{ 邊形內接於半徑 }1\\text{ 的圓，面積為 }A_n=\\frac{n}{2}\\sin\\frac{2\\pi}{n}\\text{。}\\quad n\\to\\infty\\text{ 時面積趨近多少？}",
    "pi", { m: "limit", f: "\\frac{n}{2}\\sin\\frac{2\\pi}{n}", at: "inf", v: "n" },
    { tags: ["trig-limit", "geometry"],
      hints: ["令 t = 2π/n，則 n = 2π/t。", "式子變成 π·(sin t)/t。"],
      solution: "π·lim (sin t)/t = π：多邊形面積趨近圓面積 π。" });

  applied("lx-app-011", 5,
    "\\text{一顆球從 }2\\text{ 公尺高落下，每次反彈到前一次高度的 }0.6\\text{ 倍。}\\quad\\text{停下來前走過的總路程是多少公尺？}",
    "8", { m: "limit", f: "2+2 \\cdot 2 \\cdot 0.6\\frac{1-0.6^{n}}{1-0.6}", at: "inf", v: "n" },
    { tags: ["geometric", "applications"],
      hints: ["先落下 2 公尺。", "之後每次上去又下來，各是等比級數。", "2 + 2·(2·0.6)/(1−0.6)。"],
      solution: "2 + 2·(1.2/0.4) = 2 + 6 = 8 公尺。" });

  applied("lx-app-012", 5,
    "\\text{把 }1\\text{ 公升食鹽水稀釋：每次倒掉 }\\frac{1}{n}\\text{ 再補純水，重複 }n\\text{ 次之後濃度為原來的 }\\left(1-\\frac{1}{n}\\right)^{n}\\text{ 倍。}\\quad n\\to\\infty\\text{ 時是原來的幾倍？}",
    "1/e", { m: "limit", f: "(1-\\frac{1}{n})^{n}", at: "inf", v: "n" },
    { tags: ["exponential-limit", "standard-limit"],
      hints: ["(1−1/n)^n 是 e 的標準極限。"],
      solution: "極限是 e^{−1} ≈ 0.368 倍。" });

  /* ── B. 連續性與中間值定理（R3–R5）：觀念題 ── */
  add({ id: "lx-con-001", rank: 3,
    prompt: "\\text{設 }f(x)=x^2+a\\ (x\\le 2)\\text{、}f(x)=3x-4\\ (x>2)\\text{。}\\quad\\text{求使 }f\\text{ 在 }x=2\\text{ 連續的 }a",
    answer: "-2", verify: { m: "root", f: "(4+x)-2", x0: 0 },
    tags: ["continuity", "piecewise"], timeLimit: 70,
    hints: ["連續＝左極限＝右極限＝函數值。", "左邊是 4+a，右邊是 2。"],
    solution: "4+a = 2 → a = −2。" });

  add({ id: "lx-con-002", rank: 4,
    prompt: "\\text{設 }f(x)=\\frac{\\sin 3x}{x}\\ (x\\ne 0)\\text{、}f(0)=c\\text{。}\\quad\\text{求使 }f\\text{ 在 }x=0\\text{ 連續的 }c",
    answer: "3", verify: { m: "limit", f: "\\frac{\\sin 3x}{x}", at: 0 },
    tags: ["continuity", "trig-limit"], timeLimit: 70,
    hints: ["c 必須等於 x→0 的極限。", "(sin 3x)/x = 3·(sin 3x)/(3x)。"],
    solution: "極限是 3，所以 c = 3。" });

  add({ id: "lx-con-003", rank: 4,
    prompt: "\\text{求使 }f(x)=\\frac{x^2+ax+6}{x-3}\\text{ 在 }x=3\\text{ 有可去間斷點（補一個值就連續）的 }a",
    answer: "-5", verify: { m: "root", f: "9+3x+6", x0: -1 },
    tags: ["continuity", "removable"], timeLimit: 80,
    hints: ["可去＝分子在 x=3 也是 0。", "9+3a+6 = 0。"],
    solution: "9+3a+6=0 → a = −5（此時分子 x²−5x+6=(x−2)(x−3)）。" });

  add({ id: "lx-con-004", rank: 5,
    prompt: "\\text{已知 }\\lim_{x\\to 2}\\frac{x^2+ax-10}{x-2}\\text{ 存在，求 }a",
    answer: "3", verify: { m: "root", f: "4+2x-10", x0: 0 },
    tags: ["continuity", "limit-trap"], timeLimit: 90,
    hints: ["分母→0 而極限存在，分子在 x=2 也必須是 0。", "4+2a−10 = 0。", "（順帶一提，此時極限是 7。）"],
    solution: "分子必須有因式 x−2：4+2a−10=0 → a=3。此時分子 =(x−2)(x+5)，極限 = 7。" });

  add({ id: "lx-con-005", rank: 4, answerKind: "text",
    prompt: "\\text{函數 }f(x)=\\frac{|x-4|}{x-4}\\text{ 在 }x=4\\text{ 的間斷屬於哪一種？}",
    answers: ["跳躍", "跳躍間斷", "jump", "跳躍不連續"], canonical: "跳躍",
    distractors: ["可去", "無窮", "振盪"],
    tags: ["continuity", "removable"], timeLimit: 60,
    hints: ["左極限 −1、右極限 +1。", "兩個單側極限都存在但不相等。"],
    solution: "左右極限都存在卻不相等，是跳躍間斷（補值也救不回來）。" });

  add({ id: "lx-con-006", rank: 4,
    prompt: "\\text{因為 }f(x)=x^3-4x+1\\text{ 連續且 }f(0)=1>0>f(1)=-2\\text{，中間值定理保證 }(0,1)\\text{ 內有根。}\\quad\\text{從 }x_0=\\tfrac{1}{2}\\text{ 出發跑一次牛頓法，}x_1\\text{ 是多少？}",
    answer: "3/13", verify: { m: "root", f: "x^3-4x+1", x0: 0.5, n: 1 },
    tags: ["ivt", "continuity"], timeLimit: 100,
    hints: ["牛頓法：x₁ = x₀ − f(x₀)/f′(x₀)。", "f(0.5) = −0.875，f′(x)=3x²−4 → f′(0.5) = −3.25。", "0.5 − 7/26。"],
    solution: "x₁ = 1/2 − 7/26 = 3/13 ≈ 0.2308（真正的根約 0.2541）。" });


  /* ── C. 認出「這個極限就是某個導數」（R3–R5）──
     課本最常考、學生最常沒看出來的一種：題目長得像極限，其實是導數定義。 */
  add({ id: "lx-der-001", rank: 3,
    prompt: "\\lim_{h\\to 0}\\frac{(3+h)^4-81}{h}",
    answer: "108", verify: { m: "deriv", f: "x^4", at: [3] },
    tags: ["derivative-definition", "standard-limit"], timeLimit: 70,
    hints: ["這是 f(x)=x⁴ 在 x=3 的導數定義。", "f′(x)=4x³。"],
    solution: "f′(3)=4·27=108。" });

  add({ id: "lx-der-002", rank: 4,
    prompt: "\\lim_{h\\to 0}\\frac{\\sqrt{16+h}-4}{h}",
    answer: "1/8", verify: { m: "deriv", f: "\\sqrt{x}", at: [16] },
    tags: ["derivative-definition", "rationalize"], timeLimit: 70,
    hints: ["f(x)=√x 在 x=16 的導數。", "也可以分子有理化。"],
    solution: "f′(16)=1/(2·4)=1/8。" });

  add({ id: "lx-der-003", rank: 4,
    prompt: "\\lim_{x\\to 4}\\frac{\\ln x-\\ln 4}{x-4}",
    answer: "1/4", verify: { m: "deriv", f: "\\ln x", at: [4] },
    tags: ["derivative-definition", "log"], timeLimit: 70,
    hints: ["這是 ln 在 x=4 的導數定義。", "f′(x)=1/x。"],
    solution: "f′(4)=1/4。" });

  add({ id: "lx-der-004", rank: 5,
    prompt: "\\lim_{h\\to 0}\\frac{\\sec\\left(\\frac{\\pi}{4}+h\\right)-\\sqrt{2}}{h}",
    answer: "sqrt(2)", verify: { m: "deriv", f: "\\frac{1}{\\cos x}", at: ["\\pi/4"] },
    tags: ["derivative-definition", "trig"], timeLimit: 90,
    hints: ["f(x)=sec x 在 x=π/4 的導數定義。", "f′=sec x·tan x。", "sec(π/4)=√2、tan(π/4)=1。"],
    solution: "f′(π/4) = √2·1 = √2 ≈ 1.414。" });

  add({ id: "lx-der-005", rank: 5,
    prompt: "\\lim_{h\\to 0}\\frac{e^{2+h}-e^{2}}{h}",
    answer: "exp(2)", verify: { m: "deriv", f: "e^{x}", at: [2] },
    tags: ["derivative-definition", "exponential"], timeLimit: 70,
    hints: ["f(x)=eˣ 在 x=2 的導數。"],
    solution: "f′(2)=e²≈7.389。" });

  /* ── D. 夾擠定理與振盪（R3–R5）── */
  add({ id: "lx-sq-001", rank: 3,
    prompt: "\\lim_{x\\to 0}x^2\\cos\\frac{5}{x}",
    answer: "0", verify: { m: "limit", f: "x^2\\cos\\frac{5}{x}", at: 0 },
    tags: ["squeeze", "trig-limit"], timeLimit: 70,
    hints: ["|cos| ≤ 1。", "−x² ≤ x²cos(5/x) ≤ x²。"],
    solution: "兩側都趨近 0，夾擠得 0。" });

  add({ id: "lx-sq-002", rank: 4,
    prompt: "\\lim_{x\\to\\infty}\\frac{2x+3\\sin x}{x+5}",
    answer: "2", verify: { m: "limit", f: "\\frac{2x+3\\sin x}{x+5}", at: "inf" },
    tags: ["squeeze", "trig-limit"], timeLimit: 80,
    hints: ["3 sin x 被夾在 −3 與 3 之間。", "(2x−3)/(x+5) ≤ 式子 ≤ (2x+3)/(x+5)。", "兩側都趨近 2。"],
    solution: "夾擠：兩邊的極限都是 2，所以極限是 2（振盪被分母壓平）。" });

  add({ id: "lx-sq-005", rank: 4,
    prompt: "\\lim_{x\\to\\infty}\\frac{\\cos(x^2)}{x^2}",
    answer: "0", verify: { m: "limit", f: "\\frac{\\cos(x^2)}{x^2}", at: "inf" },
    tags: ["squeeze", "trig-limit"], timeLimit: 70,
    hints: ["|cos| ≤ 1。", "−1/x² ≤ 式子 ≤ 1/x²。"],
    solution: "兩側都趨近 0，夾擠得 0（分子怎麼振盪都被 1/x² 壓住）。" });

  add({ id: "lx-sq-003", rank: 5,
    prompt: "\\lim_{n\\to\\infty}\\frac{\\left\\lfloor 7n\\right\\rfloor}{n}",
    answer: "7", verify: { m: "seqLimit", f: "\\frac{\\lfloor 7n\\rfloor}{n}", v: "n" },
    tags: ["squeeze", "floor"], timeLimit: 90,
    hints: ["7n−1 < ⌊7n⌋ ≤ 7n。", "同除以 n 之後夾擠。"],
    solution: "7−1/n < ⌊7n⌋/n ≤ 7，夾擠得 7。" });

  add({ id: "lx-sq-004", rank: 5,
    prompt: "\\lim_{x\\to 0^{+}}x\\left\\lfloor\\frac{3}{x}\\right\\rfloor",
    answer: "3", verify: { m: "limit", f: "x\\lfloor\\frac{3}{x}\\rfloor", at: 0, dir: "+" },
    tags: ["squeeze", "floor"], timeLimit: 90,
    hints: ["3/x−1 < ⌊3/x⌋ ≤ 3/x。", "乘上 x>0 之後夾擠。"],
    solution: "3−x < x⌊3/x⌋ ≤ 3，夾擠得 3。" });

  /* ── E. 更難的計算：參數、三次根、指對數混合（R4–R6）── */
  add({ id: "lx-hard-001", rank: 4,
    prompt: "\\lim_{x\\to 8}\\frac{\\sqrt[3]{x}-2}{x-8}",
    answer: "1/12", verify: { m: "deriv", f: "x^{1/3}", at: [8] },
    tags: ["rationalize", "radical"], timeLimit: 90,
    hints: ["用 a³−b³ 的因式分解，或視為 x^{1/3} 在 8 的導數。"],
    solution: "(1/3)·8^{−2/3}=1/12。" });

  add({ id: "lx-hard-002", rank: 5,
    prompt: "\\lim_{x\\to 0}\\frac{\\sqrt[3]{1+3x}-\\sqrt{1+2x}}{x^2}",
    answer: "-1/2", verify: { m: "limit", f: "\\frac{(1+3x)^{1/3}-(1+2x)^{1/2}}{x^2}", at: 0 },
    tags: ["taylor", "radical"], timeLimit: 120,
    hints: ["兩邊各展開到 x²。", "(1+3x)^{1/3}=1+x−x²+…", "(1+2x)^{1/2}=1+x−x²/2+…"],
    solution: "相減得 −x²/2 + …，除以 x² 得 −1/2。" });

  add({ id: "lx-hard-003", rank: 5,
    prompt: "\\lim_{x\\to\\infty}x\\left(\\ln(x+3)-\\ln x\\right)",
    answer: "3", verify: { m: "limit", f: "x(\\ln(x+3)-\\ln x)", at: "inf" },
    tags: ["log", "lhopital"], timeLimit: 100,
    hints: ["合併成 x·ln(1+3/x)。", "ln(1+u)≈u。"],
    solution: "x·(3/x+O(1/x²)) → 3。" });

  add({ id: "lx-hard-004", rank: 5,
    prompt: "\\lim_{x\\to 0^{+}}\\left(\\cos\\sqrt{x}\\right)^{\\frac{1}{x}}",
    answer: "exp(-1/2)", verify: { m: "limit", f: "(\\cos(\\sqrt{x}))^{\\frac{1}{x}}", at: 0, dir: "+" },
    tags: ["log", "exponential-limit", "taylor"], timeLimit: 120,
    hints: ["取對數：(1/x)·ln cos√x。", "cos u ≈ 1 − u²/2、ln(1+t) ≈ t。", "ln cos√x ≈ −x/2。"],
    solution: "對數趨近 −1/2，極限是 e^{−1/2} ≈ 0.6065。" });

  add({ id: "lx-hard-005", rank: 5,
    prompt: "\\lim_{x\\to\\infty}\\left(\\frac{2x+5}{2x-1}\\right)^{3x}",
    answer: "exp(9)", verify: { m: "limit", f: "(\\frac{2x+5}{2x-1})^{3x}", at: "inf" },
    tags: ["exponential-limit", "standard-limit"], timeLimit: 110,
    hints: ["寫成 (1+6/(2x−1))^{3x}。", "指數乘上去：3x·6/(2x)=9。"],
    solution: "極限是 e⁹。" });

  add({ id: "lx-hard-006", rank: 6,
    prompt: "\\lim_{x\\to 0}\\frac{\\arcsin x-\\tan x}{x^{3}}",
    answer: "-1/6", verify: { m: "limit", f: "\\frac{\\arcsin x-\\tan x}{x^3}", at: 0 },
    tags: ["taylor", "inverse-trig"], timeLimit: 110,
    hints: ["arcsin x = x + x³/6 + …", "tan x = x + x³/3 + …", "一次項互相抵消。"],
    solution: "(1/6 − 1/3) = −1/6。" });

  add({ id: "lx-hard-007", rank: 6,
    prompt: "\\lim_{n\\to\\infty}n^{2}\\left(\\sqrt[n]{5}-\\sqrt[n+1]{5}\\right)",
    answer: "log(5)", verify: { m: "seqLimit", f: "n^2(5^{1/n}-5^{1/(n+1)})", v: "n", n0: 400 },
    tags: ["taylor", "exponential-limit"], timeLimit: 150,
    hints: ["a^{1/n}=e^{(ln 5)/n}≈1+(ln 5)/n+…", "相減之後主項是 ln 5·(1/n−1/(n+1))=ln5/(n(n+1))。"],
    solution: "n²·ln5/(n(n+1)) → ln 5 ≈ 1.609。" });

  add({ id: "lx-hard-008", rank: 6,
    prompt: "\\lim_{x\\to 0}\\frac{\\ln(\\cos 3x)}{x^{2}}",
    answer: "-9/2", verify: { m: "limit", f: "\\frac{\\ln(\\cos(3x))}{x^2}", at: 0 },
    tags: ["taylor", "log"], timeLimit: 100,
    hints: ["cos 3x ≈ 1 − 9x²/2。", "ln(1+t) ≈ t。"],
    solution: "ln(cos 3x) ≈ −9x²/2，極限是 −9/2。" });

  /* ── F. 遞迴與連分數（R4–R6）：數列的極限 ── */
  add({ id: "lx-seq-001", rank: 4,
    prompt: "\\text{數列 }a_1=1,\\ a_{n+1}=\\sqrt{2+a_n}\\quad\\text{求 }\\lim_{n\\to\\infty}a_n",
    answer: "2", verify: { m: "recSeq", f: "\\sqrt{2+a}", g: "a", a0: 1 },
    tags: ["sequence-limit", "recursion"], timeLimit: 100,
    hints: ["極限 L 滿足 L=√(2+L)。", "L²−L−2=0。"],
    solution: "L²=2+L → L=2（負根不合）。" });

  add({ id: "lx-seq-002", rank: 5,
    prompt: "\\text{連分數 }x=1+\\cfrac{1}{1+\\cfrac{1}{1+\\cdots}}\\quad\\text{求 }x",
    answer: "(1+sqrt(5))/2", verify: { m: "recSeq", f: "1+\\frac{1}{a}", g: "a", a0: 1 },
    tags: ["sequence-limit", "recursion"], timeLimit: 110,
    hints: ["x=1+1/x。", "x²−x−1=0。"],
    solution: "黃金比例 (1+√5)/2 ≈ 1.618。" });

  add({ id: "lx-seq-003", rank: 5,
    prompt: "\\text{梯形電阻網路的等效電阻滿足 }R_{n+1}=1+\\cfrac{2}{1+R_n},\\ R_1=1\\quad\\text{求 }\\lim_{n\\to\\infty}R_n",
    answer: "sqrt(3)", verify: { m: "recSeq", f: "1+\\frac{2}{1+a}", g: "a", a0: 1 },
    tags: ["sequence-limit", "recursion", "applications"], timeLimit: 130,
    hints: ["極限 R 滿足 R = 1 + 2/(1+R)。", "兩邊乘 (1+R)：R + R² = 1 + R + 2。"],
    solution: "R² = 3，取正根 R = √3 ≈ 1.732。" });

  add({ id: "lx-seq-004", rank: 5,
    prompt: "\\text{巴比倫開方法：}a_1=3,\\ a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{5}{a_n}\\right)\\quad\\text{求 }\\lim_{n\\to\\infty}a_n",
    answer: "sqrt(5)", verify: { m: "recSeq", f: "\\frac{1}{2}(a+\\frac{5}{a})", g: "a", a0: 3 },
    tags: ["sequence-limit", "recursion", "applications"], timeLimit: 110,
    hints: ["極限 L 滿足 L = (L + 5/L)/2。", "兩邊乘 2L：2L² = L² + 5。"],
    solution: "L² = 5，取正根 √5 ≈ 2.236（這就是牛頓法求平方根）。" });

  add({ id: "lx-seq-005", rank: 6,
    prompt: "\\text{數列 }x_1=\\frac{1}{2},\\ x_{n+1}=\\sin x_n\\quad\\text{求 }\\lim_{n\\to\\infty}n\\,x_n^{2}",
    answer: "3", verify: { m: "recSeq", f: "\\sin a", g: "n \\cdot a^2", a0: 0.5, tol: 1e-4 },
    tags: ["sequence-limit", "recursion", "asymptotic"], timeLimit: 160,
    hints: ["x 很小時 sin x ≈ x − x³/6。", "看 1/x_{n+1}² − 1/x_n² 趨近多少（約 2/3）。", "所以 1/x_n² ≈ 2n/3，x_n² ≈ 3/(2n)…（自己算清楚係數）。"],
    solution: "1/x_n² 每步增加約 1/3，故 n·x_n² → 3。" });

  /* ── G. 從表格與圖讀極限（R2–R4）：考卷上真的會出 ── */
  add({ id: "lx-tab-001", rank: 2,
    prompt: "\\text{下表是 }f(x)=\\frac{x^2-9}{x-3}\\text{ 的值：}\\quad f(2.9)=5.9,\\ f(2.99)=5.99,\\ f(3.01)=6.01\\quad\\text{由表推測 }\\lim_{x\\to 3}f(x)",
    answer: "6", verify: { m: "limit", f: "\\frac{x^2-9}{x-3}", at: 3 },
    tags: ["limit-from-table", "rational-limit"], timeLimit: 60,
    hints: ["兩側都趨近同一個數。", "其實 f(x)=x+3（x≠3）。"],
    solution: "極限是 6（x=3 是可去間斷點）。" });

  add({ id: "lx-tab-002", rank: 3,
    prompt: "\\text{下表是 }g(x)=\\frac{\\sin 2x}{5x}\\text{ 的值：}\\quad g(0.1)\\approx 0.397,\\ g(0.01)\\approx 0.39997\\quad\\text{由表推測 }\\lim_{x\\to 0}g(x)",
    answer: "2/5", verify: { m: "limit", f: "\\frac{\\sin 2x}{5x}", at: 0 },
    tags: ["limit-from-table", "trig-limit"], timeLimit: 70,
    hints: ["(sin 2x)/(2x)→1。", "把式子湊成 (sin 2x)/(2x) 之後，前面還剩一個常數倍。"],
    solution: "極限是 0.4 = 2/5。" });

  /* ── H. ε-δ 的可算版本（R4–R5）：抽象定義落到一個數 ── */
  add({ id: "lx-eps-001", rank: 4,
    prompt: "\\text{對 }f(x)=3x+1,\\ L=7,\\ x_0=2\\text{，要讓 }|f(x)-L|<0.06\\text{，}\\delta\\text{ 最大可以取多少？}",
    answer: "0.02", verify: { m: "root", f: "3x-0.06", x0: 0.01 },
    tags: ["epsilon-delta", "continuity"], timeLimit: 80,
    hints: ["|3x+1−7|=3|x−2|。", "要 3|x−2|<0.06。"],
    solution: "|x−2|<0.02，所以 δ 最大 0.02。" });

  add({ id: "lx-eps-002", rank: 5,
    prompt: "\\text{對 }f(x)=x^2,\\ L=9,\\ x_0=3\\text{，要讓 }|f(x)-L|<0.25\\text{ 對所有 }|x-3|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
    answer: "sqrt(9.25)-3", verify: { m: "root", f: "(3+x)^2-9.25", x0: 0.04 },
    tags: ["epsilon-delta", "continuity"], timeLimit: 110,
    hints: ["右側較緊：(3+δ)²−9 ≤ 0.25。", "δ = √9.25 − 3。"],
    solution: "√9.25−3 ≈ 0.0414（左側 3−√8.75≈0.0420 較寬，取小的）。" });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══════════════════════════════════════════════════════════════════
   考卷裡的證明題（px-，2026-09-24）：answerKind "proof"。
   每一題只是一個指標，指向 proof_lang_content.js 裡的一個 spec；
   作答區是文字板，判分交給白話證明的檢查器（全綠才算對）。

   為什麼不把題目敘述再寫一遍：spec 自己有 statement 與參考解，
   畫面上顯示的是 spec 的版本，這裡的 prompt 只是考卷上的題目行。
   兩者若不一致，tools/validate_proof_lang.js 的第 11 節會擋下來。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const SOURCE = "Buzz 考卷證明題 2026-09";
  const problems = [];

  const add = (id, rank, spec, topic, prompt, tags, timeLimit) => problems.push({
    id,
    source: SOURCE,
    topic,
    rank,
    difficulty: Math.min(4, rank),
    answerKind: "proof",
    proofSpec: spec,
    prompt,
    answer: "（白話證明．機器判分）",
    timeLimit: timeLimit || 300,
    tags: ["proof", "written-proof"].concat(tags || [], [`rank-${rank}`], rank >= 5 ? ["boss-rank"] : [], rank <= 2 ? ["beginner-friendly"] : []),
    hints: ["一行一句，每句用一種句型開頭：任取／取／假設／則／由…／因為…所以／故。", "先寫出要證的東西長什麼樣，再一步一步扣回去。", "每一行都會被檢查：站不住的那一行會標紅。"],
    solution: "按送出之後會顯示參考解；跟自己寫的比對哪一步沒接上。"
  });

  /* ε-δ：期中卷最常見的證明題 */
  add("px-eps-001", 3, "pl-limit-linear", "limits",
    "\\text{用 }\\varepsilon\\text{-}\\delta\\text{ 定義證明 }\\lim_{x\\to 2}(3x-1)=5",
    ["epsilon-delta", "continuity"], 300);
  add("px-eps-002", 4, "pl-limit-square", "limits",
    "\\text{用 }\\varepsilon\\text{-}\\delta\\text{ 定義證明 }\\lim_{x\\to 3}x^{2}=9",
    ["epsilon-delta", "continuity"], 360);
  add("px-eps-003", 3, "pl-seq-reciprocal", "limits",
    "\\text{用 }\\varepsilon\\text{-}N\\text{ 定義證明 }\\lim_{n\\to\\infty}\\frac{1}{n}=0",
    ["epsilon-delta", "sequence-limit"], 300);

  /* 不等式：直接鏈，適合當短證明 */
  add("px-ineq-001", 2, "pl-amgm", "derivatives",
    "\\text{證明：}a,b>0\\text{ 時 }\\frac{a+b}{2}\\ge\\sqrt{a\\,b}",
    ["inequality"], 240);
  add("px-ineq-002", 2, "pl-square-bound", "derivatives",
    "\\text{證明：對所有實數 }x\\text{，}x^{2}+1\\ge 2x",
    ["inequality"], 210);
  add("px-ineq-003", 3, "pl-reverse-triangle", "limits",
    "\\text{證明反向三角不等式：}\\left|\\,|a|-|b|\\,\\right|\\le|a-b|",
    ["inequality", "absolute-value"], 270);

  /* 微分的定理：期末卷的證明題 */
  add("px-mvt-001", 3, "pl-mvt-constant", "derivatives",
    "\\text{證明：若 }f'(x)=0\\text{ 在一個區間上恆成立，則 }f\\text{ 在那個區間上是常數}",
    ["mean-value", "mvt"], 300);
  add("px-mvt-002", 4, "pl-mvt-increasing", "derivatives",
    "\\text{證明：若 }f'(x)>0\\text{ 在一個區間上恆成立，則 }f\\text{ 在那個區間上嚴格遞增}",
    ["mean-value", "mvt"], 330);
  add("px-mvt-003", 5, "pl-mvt-from-rolle", "derivatives",
    "\\text{由 Rolle 定理證明平均值定理}",
    ["mean-value", "rolle", "mvt"], 420);

  /* 連續性：中間值定理與夾擠 */
  add("px-ivt-001", 3, "pl-ivt-cubic", "limits",
    "\\text{證明 }x^{3}-3x+1=0\\text{ 在 }(0,1)\\text{ 內有實根}",
    ["ivt", "continuity"], 270);
  add("px-ivt-002", 4, "pl-ivt-root", "limits",
    "\\text{證明 }x^{5}+x-1=0\\text{ 有實根}",
    ["ivt", "continuity"], 300);
  add("px-sq-001", 4, "pl-squeeze-sin", "limits",
    "\\text{用夾擠定理證明 }\\lim_{x\\to 0}x\\sin\\frac{1}{x}=0",
    ["squeeze", "trig-limit"], 300);

  /* 積分與級數的範圍：期末卷與全範圍卷要用（前面那些都是極限與微分） */
  add("px-ind-001", 2, "pl-sum-odd", "series",
    "\\text{用數學歸納法證明 }1+3+5+\\cdots+(2n-1)=n^{2}",
    ["induction"], 270);
  add("px-ind-002", 3, "pl-induction-squares", "series",
    "\\text{用數學歸納法證明 }1^{2}+2^{2}+\\cdots+n^{2}=\\frac{n(n+1)(2n+1)}{6}",
    ["induction"], 300);
  add("px-ind-003", 4, "pl-bernoulli", "series",
    "\\text{用數學歸納法證明 Bernoulli 不等式：}(1+x)^{n}\\ge 1+n\\,x\\quad(x>-1)",
    ["induction", "inequality"], 330);
  add("px-int-001", 5, "pl-frullani-exp", "integrals",
    "\\text{證明 Frullani 積分：}\\int_{0}^{\\infty}\\frac{e^{-a\\,x}-e^{-b\\,x}}{x}\\,dx=\\ln\\frac{b}{a}\\quad(a,b>0)",
    ["improper-integral"], 420);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══════════════════════════════════════════════════════════════════
   經典題型擴充（cl-lim-，2026-10）：50 題短而準的極限反射練習。
   起因：盤點 3,077 題的極限區，發現幾個「經典題本必練、我們幾乎沒有」的格子 ——
     無窮小的階與主部（「~ c·x^k，求 k 或 c」）：全庫 1 題
     等價無窮小替換（含「在加減裡替換會錯」的陷阱）
     L'Hôpital 失靈：極限存在、但導數比沒有極限：全庫 0 題
     調參數讓極限成立／讓函數連續
     間斷點化成一個數：跳躍量、補值、間斷點個數
     數列：單調有界的遞迴、Stolz、Riemann 和、n 次方根、(1+a/n)^n、含 n 的積分
   展開（Taylor）只佔 2 題 —— 這一包練的是「認出結構」，不是「展到第幾階」。

   驗算：每題自帶 verify，全部是從題幹出發的獨立數值路徑：
     階 k 用 ln(f(2x)/f(x))/ln 2 的極限（不需要知道 c）；
     a+b 型的漸近線用 (f(2x)−f(x))/x 與 2f(x)−f(2x) 分別取 a、b（不需要知道答案）；
     跳躍量用左右兩個單邊極限相減；遞迴直接迭代；含參數的條件用求根或駐點。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const SOURCE = "Buzz 經典題型擴充 2026-10";
  const problems = [];

  const add = (id, rank, prompt, answer, verify, tags, hints, solution, timeLimit) => {
    const allTags = tags.slice();
    allTags.push(`rank-${rank}`);
    if (rank >= 5) allTags.push("boss-rank");
    if (rank <= 2) allTags.push("beginner-friendly");
    problems.push({
      id,
      source: SOURCE,
      topic: "limits",
      rank,
      difficulty: Math.min(4, rank),
      answerKind: "numeric",
      prompt,
      answer,
      timeLimit: timeLimit || [0, 60, 75, 90, 110, 140, 170][rank],
      tags: allTags,
      hints,
      solution,
      verify
    });
  };

  // 階 k 的驗算：f(2x)/f(x) → 2^k，跟 c 無關
  const orderOf = (f, f2, dir) => Object.assign(
    { m: "limit", f: `\\frac{\\ln\\left(\\frac{${f2}}{${f}}\\right)}{\\ln 2}`, at: 0 },
    dir ? { dir } : {});
  const lim = (f, at, dir) => Object.assign({ m: "limit", f, at }, dir ? { dir } : {});
  const jump = (f, at) => ({
    m: "let",
    with: { r: { m: "limit", f, at, dir: "+" }, l: { m: "limit", f, at, dir: "-" } },
    f: "r-l"
  });

  /* ── A. 無窮小的階與主部（R1–R6）── */
  add("cl-lim-001", 1,
    "\\text{當 }x\\to 0\\text{ 時，}\\sqrt{1+x^{2}}-1\\sim c\\,x^{k}\\ (c\\ne 0)\\text{。求 }k",
    "2", orderOf("\\sqrt{1+x^2}-1", "\\sqrt{1+4x^2}-1"),
    ["infinitesimal-order", "rationalize"],
    ["乘上共軛 √(1+x²)+1，分子會變成什麼？", "分母在 x→0 時趨近 2。"],
    "√(1+x²)−1 = x²/(√(1+x²)+1) ~ x²/2，所以 k = 2（c = 1/2）。");

  add("cl-lim-002", 2,
    "\\text{當 }x\\to 0\\text{ 時，}\\ln(1+x^{2})+1-\\cos 2x\\sim c\\,x^{2}\\text{。求 }c",
    "3", lim("\\frac{\\ln(1+x^2)+1-\\cos 2x}{x^2}", 0),
    ["infinitesimal-order", "log-limit", "trig-limit"],
    ["兩項各自是 x² 階、而且同號，可以分別換成等價無窮小再相加。", "ln(1+u) ~ u；1−cos u ~ u²/2，這裡 u = 2x。"],
    "ln(1+x²) ~ x²，1−cos 2x ~ (2x)²/2 = 2x²；兩者同號相加不會相消，c = 1 + 2 = 3。");

  add("cl-lim-003", 3,
    "\\text{當 }x\\to 0\\text{ 時，}\\sin 2x-2\\sin x\\sim c\\,x^{3}\\text{。求 }c",
    "-1", lim("\\frac{\\sin 2x-2\\sin x}{x^3}", 0),
    ["infinitesimal-order", "trig-limit"],
    ["直接用 sin u ~ u 會得到 2x − 2x = 0 —— 差的主部被消掉了，要先變形。", "sin 2x = 2 sin x cos x，提出 2 sin x。"],
    "sin 2x − 2 sin x = 2 sin x (cos x − 1) ~ 2x·(−x²/2) = −x³，c = −1。");

  add("cl-lim-004", 3,
    "\\text{當 }x\\to 0^{+}\\text{ 時，}\\sqrt{x+\\sqrt{x}}\\sim c\\,x^{k}\\text{。求 }k",
    "1/4", orderOf("\\sqrt{x+\\sqrt{x}}", "\\sqrt{2x+\\sqrt{2x}}", "+"),
    ["infinitesimal-order", "radical"],
    ["x 很小時，x 和 √x 哪一個比較大？", "根號裡只留下主導的那一項，再開根號。"],
    "x→0⁺ 時 √x ≫ x，所以 √(x+√x) = x^{1/4}·√(1+√x) ~ x^{1/4}，k = 1/4。");

  add("cl-lim-005", 4,
    "\\text{當 }x\\to 0\\text{ 時，}\\sqrt{1+\\tan x}-\\sqrt{1+\\sin x}\\sim c\\,x^{k}\\ (c\\ne 0)\\text{。求 }k",
    "3", orderOf("\\sqrt{1+\\tan x}-\\sqrt{1+\\sin x}", "\\sqrt{1+\\tan 2x}-\\sqrt{1+\\sin 2x}"),
    ["infinitesimal-order", "rationalize", "trig-limit"],
    ["先有理化：分子會變成 tan x − sin x。", "tan x − sin x = tan x (1 − cos x)。"],
    "差 = (tan x − sin x)/(√(1+tan x)+√(1+sin x))；tan x(1−cos x) ~ x·x²/2，分母 → 2，所以 ~ x³/4，k = 3。");

  add("cl-lim-006", 4,
    "\\text{當 }x\\to 0\\text{ 時，}1-\\cos x\\cos 2x\\cos 3x\\sim c\\,x^{2}\\text{。求 }c",
    "7", lim("\\frac{1-\\cos x\\cos 2x\\cos 3x}{x^2}", 0),
    ["infinitesimal-order", "trig-limit"],
    ["乘積接近 1 的時候，1 − 乘積 ~ −ln(乘積)。", "ln 把乘積拆成三個 ln cos(mx) 的和，每一個 ~ −(mx)²/2。"],
    "−ln(cos x cos 2x cos 3x) ~ (1+4+9)x²/2 = 7x²，而 1 − P ~ −ln P，所以 c = 7。");

  add("cl-lim-007", 4,
    "\\text{當 }x\\to 0\\text{ 時，}e^{\\tan x}-e^{\\sin x}\\sim c\\,x^{3}\\text{。求 }c",
    "1/2", lim("\\frac{e^{\\tan x}-e^{\\sin x}}{x^3}", 0),
    ["infinitesimal-order", "exponential-limit"],
    ["提出 e^{sin x}：剩下 e^{tan x − sin x} − 1。", "e^u − 1 ~ u，u = tan x − sin x 本身是幾階？"],
    "e^{tan x}−e^{sin x} = e^{sin x}(e^{tan x−sin x}−1) ~ tan x − sin x ~ x³/2，c = 1/2。");

  add("cl-lim-008", 6,
    "\\text{當 }x\\to 0\\text{ 時，}\\sin(\\sin x)-x\\sqrt[3]{1-x^{2}}\\sim c\\,x^{k}\\ (c\\ne 0)\\text{。求 }k",
    "5", orderOf("\\sin(\\sin x)-x\\sqrt[3]{1-x^2}", "\\sin(\\sin 2x)-2x\\sqrt[3]{1-4x^2}"),
    ["infinitesimal-order", "taylor", "composite-taylor"],
    ["兩項的 x 與 x³ 係數各是多少？先比到 x³ 看會不會消掉。", "x³ 消掉了就要比 x⁵：sin(sin x) 的 x⁵ 係數要把 sin x 的展開代進 sin u 的前三項。"],
    "sin(sin x) = x − x³/3 + x⁵/10 + …，x(1−x²)^{1/3} = x − x³/3 − x⁵/9 + …；x、x³ 都相消，差 ~ (19/90)x⁵，k = 5。");

  add("cl-lim-009", 5,
    "\\text{當 }n\\to\\infty\\text{ 時，}e-\\left(1+\\frac{1}{n}\\right)^{n}\\sim\\frac{c}{n}\\text{。求 }c",
    "exp(1)/2", { m: "seqLimit", f: "n\\left(e-\\left(1+\\frac{1}{n}\\right)^{n}\\right)" },
    ["infinitesimal-order", "exponential-limit", "asymptotic"],
    ["寫成 e^{n ln(1+1/n)}，先看指數離 1 差多少。", "n ln(1+1/n) = 1 − 1/(2n) + …；再用 e^{1−u} ≈ e(1−u)。"],
    "(1+1/n)^n = e·e^{−1/(2n)+O(1/n²)} = e − e/(2n) + …，所以 c = e/2。");

  /* ── B. 等價無窮小替換：乘除可以換，加減小心（R1–R4）── */
  add("cl-lim-010", 1,
    "\\lim_{x\\to 0}\\frac{\\arcsin 2x\\cdot\\left(e^{3x}-1\\right)}{\\ln(1+x)\\cdot\\tan 4x}",
    "3/2", lim("\\frac{\\arcsin 2x\\cdot(e^{3x}-1)}{\\ln(1+x)\\cdot\\tan 4x}", 0),
    ["equivalent-infinitesimal", "standard-limit"],
    ["全部是乘除，每個因子都可以換成它的等價無窮小。", "arcsin u ~ u、e^u − 1 ~ u、ln(1+u) ~ u、tan u ~ u。"],
    "換成 (2x)(3x)/(x·4x) = 6/4 = 3/2。");

  add("cl-lim-011", 2,
    "\\lim_{x\\to 0}\\frac{\\ln(1+x)+\\ln(1-x)}{x^{2}}",
    "-1", lim("\\frac{\\ln(1+x)+\\ln(1-x)}{x^2}", 0),
    ["equivalent-infinitesimal", "log-limit", "trap-drill"],
    ["把 ln(1+x) 換成 x、ln(1−x) 換成 −x，分子變 0 —— 這不是答案，是主部被消掉了。", "先把兩個 ln 合併成一個。"],
    "分子 = ln(1−x²) ~ −x²，極限是 −1。（加減裡分別替換會得到錯的 0。）");

  add("cl-lim-012", 3,
    "\\lim_{x\\to 0}\\frac{\\tan x-\\sin x}{x\\,(1-\\cos 2x)}",
    "1/4", lim("\\frac{\\tan x-\\sin x}{x(1-\\cos 2x)}", 0),
    ["equivalent-infinitesimal", "trig-limit", "limit-trap"],
    ["分子若直接換成 x − x 會得到 0，要先因式分解。", "tan x − sin x = tan x(1 − cos x)；分母 1 − cos 2x 也有等價無窮小。"],
    "分子 ~ x·x²/2 = x³/2，分母 ~ x·(2x)²/2 = 2x³，極限 1/4。");

  add("cl-lim-013", 4,
    "\\lim_{x\\to 0}\\frac{\\sqrt{1+2x}-\\sqrt[3]{1+3x}}{x^{2}}",
    "1/2", lim("\\frac{\\sqrt{1+2x}-\\sqrt[3]{1+3x}}{x^2}", 0),
    ["equivalent-infinitesimal", "taylor", "limit-trap"],
    ["兩個根式都 ~ 1 + x，相減只告訴你一次項消掉了。", "(1+u)^a = 1 + a u + a(a−1)u²/2 + …，兩個都展到二次。"],
    "√(1+2x) = 1 + x − x²/2 + …，∛(1+3x) = 1 + x − x² + …，差 ~ x²/2，極限 1/2。");

  add("cl-lim-014", 4,
    "\\lim_{x\\to 0}\\frac{\\ln(1+x+x^{2})+\\ln(1-x+x^{2})}{x^{2}}",
    "1", lim("\\frac{\\ln(1+x+x^2)+\\ln(1-x+x^2)}{x^2}", 0),
    ["equivalent-infinitesimal", "log-limit", "limit-trap"],
    ["若分別用 ln(1+u) ~ u，分子會是 (x+x²)+(−x+x²) —— 這樣算出來的數是錯的。", "先合併：(1+x+x²)(1−x+x²) 乘開是什麼？"],
    "分子 = ln(1+x²+x⁴) ~ x²，極限 1。分別替換得 2 是錯的：ln(1+u) ~ u 的誤差 −u²/2 在這裡跟主部同階。");

  add("cl-lim-015", 3,
    "\\lim_{x\\to 0}\\frac{\\ln\\cos 3x}{\\sin^{2}2x}",
    "-9/8", lim("\\frac{\\ln(\\cos 3x)}{(\\sin 2x)^2}", 0),
    ["equivalent-infinitesimal", "log-limit", "trig-limit"],
    ["ln cos u = ln(1 + (cos u − 1)) ~ cos u − 1。", "cos u − 1 ~ −u²/2；分母 sin² 2x ~ (2x)²。"],
    "ln cos 3x ~ −9x²/2，sin² 2x ~ 4x²，極限 −9/8。");

  /* ── C. L'Hôpital 失靈：導數比沒有極限，原極限卻存在（R2–R5）── */
  add("cl-lim-016", 2,
    "\\lim_{x\\to+\\infty}\\frac{2x-\\sin x}{3x+\\cos x}",
    "2/3", lim("\\frac{2x-\\sin x}{3x+\\cos x}", "inf"),
    ["lhopital", "squeeze", "oscillation"],
    ["上下分別微分得 (2 − cos x)/(3 − sin x)，這個比值在 x→∞ 時一直擺動 —— 但那只代表 L'Hôpital 不適用。", "分子分母同除以 x，sin x/x 與 cos x/x 都被夾到 0。"],
    "同除以 x：(2 − sin x/x)/(3 + cos x/x) → 2/3。L'Hôpital 的條件是「導數比有極限」，這裡不成立，不能拿它判定極限不存在。");

  add("cl-lim-017", 2,
    "\\lim_{x\\to+\\infty}\\frac{\\sqrt{9x^{2}+1}}{\\sqrt{x^{2}+4}}",
    "3", lim("\\frac{\\sqrt{9x^2+1}}{\\sqrt{x^2+4}}", "inf"),
    ["lhopital", "rationalize", "infinity-limit"],
    ["試一次 L'Hôpital：導數比化簡之後，分子分母的根號會交換位置 —— 再用一次又換回來。", "不要繞圈，把 x 從根號裡提出來。"],
    "√(9x²+1)/√(x²+4) = √(9+1/x²)/√(1+4/x²) → 3。L'Hôpital 在這裡會無限循環。");

  add("cl-lim-018", 4,
    "\\lim_{x\\to 0}\\frac{x^{2}\\sin\\frac{1}{x}+3x}{\\sin x}",
    "3", lim("\\frac{x^2\\sin\\frac{1}{x}+3x}{\\sin x}", 0),
    ["lhopital", "squeeze", "limit-trap"],
    ["分子的導數是 2x sin(1/x) − cos(1/x) + 3，在 0 附近沒有極限。", "改成分子分母同除以 x：x sin(1/x) 被 |x| 夾住。"],
    "同除以 x：(x sin(1/x) + 3)/(sin x / x) → (0 + 3)/1 = 3。導數比沒有極限，原極限照樣存在。");

  add("cl-lim-019", 5,
    "\\lim_{x\\to+\\infty}\\frac{1}{x}\\int_{0}^{x}\\left|\\sin t\\right|\\,dt",
    // 直接對 x 取樣行不通：|sin t| 有折點，長區間的數值積分不準，而且誤差是 O(1/x) 的擺動、外插不了。
    // 驗算端改算「一個週期的平均」—— 週期函數的長期平均就是它（夾擠論證是題目本身的內容）。
    "2/pi", { m: "let", f: "\\frac{I}{\\pi}", with: { I: { m: "integral", f: "\\left|\\sin t\\right|", a: 0, b: "\\pi", v: "t" } } },
    ["lhopital", "squeeze", "periodicity"],
    ["L'Hôpital 給 |sin x|/1，沒有極限 —— 但原式有。", "|sin t| 週期是 π，一個週期的積分是多少？", "把 x 夾在 kπ 與 (k+1)π 之間。"],
    "∫₀^π|sin t|dt = 2。kπ ≤ x < (k+1)π 時積分介於 2k 與 2k+2，除以 x 後兩邊都 → 2/π。");

  /* ── D. 調參數：讓極限成立、讓函數連續（R2–R5）── */
  add("cl-lim-020", 2,
    "\\text{已知 }\\lim_{x\\to 1}\\frac{x^{2}+ax+b}{x-1}=3\\text{。求 }b",
    "-2",
    { m: "stationary", vars: ["a", "b"], x0: [0, 0], out: "b",
      f: "(1+a+b)^2+\\left(\\frac{(1.1^2+1.1a+b)-(0.9^2+0.9a+b)}{0.2}-3\\right)^2" },
    ["piecewise", "factoring", "standard-limit"],
    ["分母 → 0 而極限有限，分子在 x=1 也必須是 0。", "分子有因式 (x−1)，約掉之後代 x=1。"],
    "1 + a + b = 0；約分後極限是 2 + a = 3，所以 a = 1、b = −2。");

  add("cl-lim-021", 4,
    "\\text{已知 }\\lim_{x\\to+\\infty}\\left(\\sqrt{x^{2}-x+1}-a\\,x-b\\right)=0\\text{。求 }a+b",
    "1/2",
    { m: "let", f: "a+b", with: {
      a: { m: "limit", f: "\\frac{\\sqrt{4x^2-2x+1}-\\sqrt{x^2-x+1}}{x}", at: "inf" },
      b: { m: "limit", f: "2\\sqrt{x^2-x+1}-\\sqrt{4x^2-2x+1}", at: "inf" } } },
    ["asymptote", "rationalize", "infinity-limit"],
    ["先除以 x 再取極限，得到 a。", "知道 a 之後，b = lim(√(x²−x+1) − a x)，用共軛有理化。"],
    "a = lim √(x²−x+1)/x = 1；b = lim(√(x²−x+1) − x) = lim (−x+1)/(√(x²−x+1)+x) = −1/2；a + b = 1/2（斜漸近線 y = x − 1/2）。");

  add("cl-lim-022", 3,
    "\\text{已知 }\\lim_{x\\to 0}\\frac{a-\\cos b\\,x}{x^{2}}=8\\ (b>0)\\text{。求 }a+b",
    "5",
    { m: "let", f: "a+b", with: {
      a: { m: "value", f: "\\cos 0" },
      b: { m: "root", f: "\\frac{1-\\cos(10^{-4}x)}{10^{-8}}-8", x0: 3 } } },
    ["trig-limit", "standard-limit"],
    ["分母 → 0、極限有限，分子在 x=0 也要 → 0。", "1 − cos u ~ u²/2。"],
    "a − 1 = 0 → a = 1；(1 − cos bx)/x² → b²/2 = 8 → b = 4；a + b = 5。");

  add("cl-lim-023", 3,
    "\\text{已知 }\\lim_{x\\to+\\infty}\\left(\\frac{x+a}{x-a}\\right)^{x}=e^{6}\\text{。求 }a",
    "3", { m: "root", f: "10^{6}\\ln\\frac{10^{6}+x}{10^{6}-x}-6", x0: 1 },
    ["exponential-limit", "power-exponential"],
    ["取對數：x ln((x+a)/(x−a))。", "(x+a)/(x−a) = 1 + 2a/(x−a)，再用 ln(1+u) ~ u。"],
    "x ln(1 + 2a/(x−a)) → 2a，所以 e^{2a} = e⁶，a = 3。");

  add("cl-lim-024", 3,
    "\\text{設 }f(x)=x+1\\ (x<1)\\text{、}f(x)=a\\,x+b\\ (1\\le x<3)\\text{、}f(x)=x^{2}\\ (x\\ge 3)\\text{。若 }f\\text{ 處處連續，}\\quad\\text{求 }a",
    "7/2",
    { m: "stationary", vars: ["a", "b"], x0: [0, 0], out: "a",
      f: "(a+b-(1+1))^2+(3a+b-3^2)^2" },
    ["continuity", "piecewise"],
    ["兩個接點 x=1 與 x=3 各給一條方程。", "x=1：左極限是 2；x=3：右邊的值是 9。"],
    "a + b = 2、3a + b = 9，相減 2a = 7，a = 7/2（b = −3/2）。");

  add("cl-lim-025", 4,
    "\\text{設 }f(x)=(1+\\sin 3x)^{\\cot x}\\ (x\\ne 0)\\text{、}f(0)=k\\text{。若 }f\\text{ 在 }x=0\\text{ 連續，求 }k",
    "exp(3)", lim("(1+\\sin 3x)^{\\frac{\\cos x}{\\sin x}}", 0),
    ["continuity", "exponential-limit", "power-exponential"],
    ["1^∞ 型：取對數變成 cot x · ln(1 + sin 3x)。", "ln(1+u) ~ u、cot x ~ 1/x。"],
    "cot x·ln(1+sin 3x) ~ (1/x)(3x) = 3，極限 e³，所以 k = e³。");

  add("cl-lim-026", 5,
    "\\text{已知 }\\lim_{x\\to+\\infty}\\left(\\sqrt[3]{x^{3}+a\\,x^{2}+1}-\\sqrt{x^{2}+3x}\\right)=1\\text{。求 }a",
    "15/2", { m: "root", f: "\\sqrt[3]{10^{21}+x\\cdot 10^{14}+1}-\\sqrt{10^{14}+3\\cdot 10^{7}}-1", x0: 5 },
    ["asymptotic", "infinity-limit", "radical"],
    ["兩個根式各減 x：∛(x³+ax²+1) − x 與 √(x²+3x) − x 各趨近多少？", "(1+u)^{1/3} ≈ 1 + u/3、(1+u)^{1/2} ≈ 1 + u/2。"],
    "∛(x³+ax²+1) = x + a/3 + o(1)，√(x²+3x) = x + 3/2 + o(1)；a/3 − 3/2 = 1，a = 15/2。");

  /* ── E. 間斷點化成一個數（R2–R4）── */
  add("cl-lim-027", 2,
    "\\text{設 }f(x)=\\frac{\\left|x^{2}-4\\right|}{x-2}\\text{。求跳躍量 }f(2^{+})-f(2^{-})",
    "8", jump("\\frac{|x^2-4|}{x-2}", 2),
    ["one-sided-limit", "continuity", "absolute-value"],
    ["x 在 2 附近時 x + 2 > 0，所以 |x²−4| = (x+2)|x−2|。", "右邊 |x−2|/(x−2) = 1，左邊 = −1。"],
    "f(2⁺) = 4、f(2⁻) = −4，跳躍量 8。");

  add("cl-lim-028", 2,
    "\\text{函數 }f(x)=\\lfloor x^{2}\\rfloor\\text{ 在開區間 }(0,3)\\text{ 內有幾個不連續點？}",
    "8", { m: "let", f: "p-r", with: {
      p: { m: "limit", f: "\\lfloor x^2\\rfloor", at: 3, dir: "-" },
      r: { m: "limit", f: "\\lfloor x^2\\rfloor", at: 0, dir: "+" } } },
    ["floor", "continuity"],
    ["⌊u⌋ 只在 u 是整數時跳。x² 在 (0,3) 內會經過哪些整數？", "x² 從 0 遞增到 9（不含端點）。"],
    "x² 經過 1, 2, …, 8 各一次，每次跳 1：不連續點是 x = √1, √2, …, √8，共 8 個。");

  add("cl-lim-029", 3,
    "\\text{設 }g(x)=\\frac{2^{1/x}-1}{2^{1/x}+1}\\text{。求跳躍量 }g(0^{+})-g(0^{-})",
    "2", jump("\\frac{2^{1/x}-1}{2^{1/x}+1}", 0),
    ["one-sided-limit", "exponential-limit"],
    ["x→0⁺ 時 1/x → +∞，2^{1/x} → ∞；x→0⁻ 時 2^{1/x} → 0。", "右邊同除以 2^{1/x}。"],
    "g(0⁺) = 1、g(0⁻) = (0−1)/(0+1) = −1，跳躍量 2：x=0 是跳躍間斷點。");

  add("cl-lim-030", 3,
    "\\text{函數 }f(x)=\\lfloor x\\rfloor+\\lfloor -x\\rfloor\\text{ 在 }x=2\\text{ 不連續。把 }f(2)\\text{ 改成多少就會連續？}",
    "-1", lim("\\lfloor x\\rfloor+\\lfloor -x\\rfloor", 2),
    ["floor", "removable", "continuity"],
    ["先算 f(2) 本身。", "x 在 2 的附近但不等於 2 時，⌊x⌋ + ⌊−x⌋ 等於多少？左右兩邊分開看。"],
    "x 不是整數時 ⌊x⌋+⌊−x⌋ = −1，而 f(2) = 2 − 2 = 0。左右極限都是 −1，是可去間斷點，改成 −1 就連續。");

  add("cl-lim-031", 4,
    "\\text{設 }f(x)=\\lim_{n\\to\\infty}\\frac{x^{2n}-1}{x^{2n}+1}\\text{。求跳躍量 }f(1^{+})-f(1^{-})",
    "2", { m: "value", f: "\\frac{1.01^{4000}-1}{1.01^{4000}+1}-\\frac{0.99^{4000}-1}{0.99^{4000}+1}" },
    ["continuity", "one-sided-limit", "sequence"],
    ["先對每個固定的 x 算出 f(x)：分 |x| < 1、|x| = 1、|x| > 1 三種。", "|x| < 1 時 x^{2n} → 0；|x| > 1 時同除以 x^{2n}。"],
    "f(x) = −1（|x|<1）、0（|x|=1）、1（|x|>1）。所以 f(1⁺) − f(1⁻) = 1 − (−1) = 2。");

  add("cl-lim-032", 3,
    "\\text{函數 }f(x)=\\frac{\\sin\\pi x}{x^{2}-1}\\text{ 在 }x=1\\text{ 是可去間斷點。應補 }f(1)\\text{ 為多少？}",
    "-pi/2", lim("\\frac{\\sin(\\pi x)}{x^2-1}", 1),
    ["removable", "trig-limit", "continuity"],
    ["令 t = x − 1，sin(πx) = sin(π + πt) = ?", "分母 x² − 1 = (x−1)(x+1)。"],
    "sin(πx) = −sin(πt) ~ −πt，分母 ~ 2t，極限 −π/2。");

  add("cl-lim-033", 3,
    "\\text{設 }f(x)=\\frac{x^{2}-x}{|x|\\,(x^{2}-1)}\\text{。求跳躍量 }f(0^{+})-f(0^{-})",
    "2", jump("\\frac{x^2-x}{|x|(x^2-1)}", 0),
    ["one-sided-limit", "continuity", "absolute-value"],
    ["分子 x(x−1)、分母 |x|(x−1)(x+1)，在 0 附近先約掉 x − 1。", "剩下 (x/|x|)/(x+1)。"],
    "f(x) = (x/|x|)/(x+1)（x ≠ 1）：f(0⁺) = 1、f(0⁻) = −1，跳躍量 2。");

  /* ── F. 數列：遞迴、Stolz、Riemann 和、n 次方根、含 n 的積分（R2–R6）── */
  add("cl-lim-034", 2,
    "\\text{數列 }a_1=1,\\ a_{n+1}=\\frac{4a_n+3}{a_n+2}\\text{。求 }\\lim_{n\\to\\infty}a_n",
    "3", { m: "recSeq", f: "\\frac{4a+3}{a+2}", g: "a", a0: 1 },
    ["recursive", "fixed-point", "sequence"],
    ["先說明數列單調有界（試算前幾項，再用歸納法）。", "極限 L 要滿足 L = (4L+3)/(L+2)，取正的那個根。"],
    "L² + 2L = 4L + 3 → L² − 2L − 3 = 0 → L = 3 或 −1；各項都正，L = 3。");

  add("cl-lim-035", 3,
    "\\text{數列 }a_1=0.1,\\ a_{n+1}=a_n\\left(2-3a_n\\right)\\text{。求 }\\lim_{n\\to\\infty}a_n",
    "1/3", { m: "recSeq", f: "a(2-3a)", g: "a", a0: 0.1 },
    ["recursive", "fixed-point", "newton"],
    ["不動點滿足 L = L(2 − 3L)：有兩個解。", "看 1 − 3a_{n+1} 與 1 − 3a_n 的關係：它是平方。"],
    "1 − 3a_{n+1} = (1 − 3a_n)²，而 1 − 3a_1 = 0.7，所以 1 − 3a_n = 0.7^{2^{n−1}} → 0，a_n → 1/3（這是牛頓法求 1/3 的倒數迭代）。");

  add("cl-lim-036", 5,
    "\\text{數列 }x_1=0,\\ x_{n+1}=x_n+e^{-x_n}\\text{。求 }\\lim_{n\\to\\infty}\\frac{e^{x_n}}{n}",
    "1", { m: "recSeq", f: "a+e^{-a}", g: "\\frac{e^{a}}{n}", a0: 0, tol: 1e-4 },
    ["recursive", "stolz", "asymptotic"],
    ["令 y_n = e^{x_n}，寫出 y_{n+1} 與 y_n 的關係。", "y_{n+1} − y_n 趨近多少？再用 Stolz。"],
    "y_{n+1} = y_n e^{1/y_n} = y_n + 1 + O(1/y_n)，y_n → ∞，所以 y_{n+1} − y_n → 1，由 Stolz 得 y_n/n → 1。");

  add("cl-lim-037", 6,
    "\\text{數列 }x_1=1,\\ x_{n+1}=\\ln(1+x_n)\\text{。求 }\\lim_{n\\to\\infty}n\\,x_n",
    "2", { m: "recSeq", f: "\\ln(1+a)", g: "n a", a0: 1, tol: 1e-4 },
    ["recursive", "stolz", "asymptotic"],
    ["先說明 x_n 遞減趨近 0。", "看 1/x_{n+1} − 1/x_n：用 ln(1+u) = u − u²/2 + …。", "差趨近一個常數之後，用 Stolz 處理 (1/x_n)/n。"],
    "1/ln(1+x) − 1/x → 1/2（x→0），所以 1/x_{n+1} − 1/x_n → 1/2，由 Stolz 得 1/(n x_n) → 1/2，n x_n → 2。");

  add("cl-lim-038", 5,
    "\\text{數列 }a_1=1,\\ a_{n+1}=a_n+\\sqrt{a_n}\\text{。求 }\\lim_{n\\to\\infty}\\frac{a_n}{n^{2}}",
    "1/4", { m: "recSeq", f: "a+\\sqrt{a}", g: "\\frac{a}{n^2}", a0: 1, tol: 1e-4 },
    ["recursive", "stolz", "asymptotic"],
    ["改看 b_n = √a_n：b_{n+1} − b_n 趨近多少？", "b_{n+1} = b_n √(1 + 1/b_n)。"],
    "b_{n+1} − b_n = b_n(√(1+1/b_n) − 1) → 1/2，由 Stolz 得 b_n/n → 1/2，所以 a_n/n² → 1/4。");

  add("cl-lim-039", 3,
    "\\lim_{n\\to\\infty}\\frac{1+\\sqrt[3]{2}+\\sqrt[3]{3}+\\cdots+\\sqrt[3]{n}}{n\\sqrt[3]{n}}",
    "3/4", { m: "seqLimit", f: "\\frac{\\sum_{k=1}^{n}\\sqrt[3]{k}}{n\\sqrt[3]{n}}" },
    ["stolz", "riemann-sum", "sequence"],
    ["Stolz：分子差是 ∛(n+1)，分母差是 (n+1)^{4/3} − n^{4/3}。", "(n+1)^{4/3} − n^{4/3} ~ (4/3) n^{1/3}。"],
    "Stolz 得 ∛(n+1)/((n+1)^{4/3} − n^{4/3}) → 1/(4/3) = 3/4（也可看成 ∫₀¹ x^{1/3} dx 的 Riemann 和）。");

  add("cl-lim-040", 3,
    "\\lim_{n\\to\\infty}\\frac{1^{2}+3^{2}+5^{2}+\\cdots+(2n-1)^{2}}{n^{3}}",
    "4/3", { m: "seqLimit", f: "\\frac{1}{n^3}\\sum_{k=1}^{n}(2k-1)^2" },
    ["stolz", "sequence"],
    ["Stolz：分子差是 (2n+1)²，分母差是 (n+1)³ − n³。", "比較兩者的最高次項。"],
    "(2n+1)²/((n+1)³ − n³) = (4n²+…)/(3n²+…) → 4/3。");

  add("cl-lim-041", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{\\sqrt{n^{2}+2kn}}",
    "sqrt(3)-1", { m: "seqLimit", f: "\\sum_{k=1}^{n}\\frac{1}{\\sqrt{n^2+2kn}}" },
    ["riemann-sum", "sequence"],
    ["從根號裡提出 n²，湊出 (1/n)·Σ g(k/n)。", "g(x) = 1/√(1+2x)，積分區間 [0,1]。"],
    "= (1/n)Σ 1/√(1+2k/n) → ∫₀¹ (1+2x)^{−1/2} dx = [√(1+2x)]₀¹ = √3 − 1。");

  add("cl-lim-042", 5,
    "\\lim_{n\\to\\infty}\\left(\\prod_{k=1}^{n}\\left(2+\\frac{k}{n}\\right)\\right)^{1/n}",
    "27/(4*exp(1))", { m: "seqLimit", f: "\\exp\\left(\\frac{1}{n}\\sum_{k=1}^{n}\\ln\\left(2+\\frac{k}{n}\\right)\\right)" },
    ["riemann-sum", "infinite-product", "log-limit"],
    ["取對數，乘積變成和。", "和是 ∫₀¹ ln(2+x) dx 的 Riemann 和。"],
    "∫₀¹ ln(2+x) dx = [(2+x)ln(2+x) − (2+x)]₀¹ = 3 ln 3 − 2 ln 2 − 1，所以極限 = e^{3ln3−2ln2−1} = 27/(4e)。");

  add("cl-lim-043", 4,
    "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{k}{n^{2}}\\sin\\frac{k\\pi}{n}",
    "1/pi", { m: "seqLimit", f: "\\sum_{k=1}^{n}\\frac{k}{n^2}\\sin\\frac{k\\pi}{n}" },
    ["riemann-sum", "trig-limit"],
    ["k/n² = (1/n)·(k/n)：這是哪個函數的 Riemann 和？", "∫₀¹ x sin(πx) dx 用分部積分。"],
    "→ ∫₀¹ x sin πx dx = [−x cos πx/π]₀¹ + ∫₀¹ cos πx/π dx = 1/π + 0 = 1/π。");

  add("cl-lim-044", 2,
    "\\lim_{n\\to\\infty}\\sqrt[n]{5^{n}+n\\cdot 4^{n}}",
    "5", { m: "seqLimit", f: "\\exp\\left(\\frac{1}{n}\\ln\\left(5^{n}+n\\cdot 4^{n}\\right)\\right)", n0: 20, levels: 5 },
    ["nth-root", "squeeze"],
    ["根號裡最大的那一項是哪一個？", "5ⁿ ≤ 5ⁿ + n·4ⁿ ≤ 2·5ⁿ（n 夠大時），開 n 次方。"],
    "n·4ⁿ/5ⁿ → 0，所以夾在 5 與 5·2^{1/n} 之間，極限 5。");

  add("cl-lim-045", 3,
    "\\lim_{n\\to\\infty}\\left(\\frac{n^{2}+3n+1}{n^{2}-n+2}\\right)^{n}",
    "exp(4)", { m: "seqLimit", f: "\\left(\\frac{n^2+3n+1}{n^2-n+2}\\right)^{n}" },
    ["exponential-limit", "power-exponential", "sequence"],
    ["1^∞ 型：底 = 1 + (4n−1)/(n²−n+2)。", "n·(4n−1)/(n²−n+2) 趨近多少？"],
    "n ln(1 + (4n−1)/(n²−n+2)) ~ n(4n−1)/(n²−n+2) → 4，極限 e⁴。");

  add("cl-lim-046", 5,
    "\\lim_{n\\to\\infty}\\left(\\frac{\\sqrt[n]{2}+\\sqrt[n]{8}}{2}\\right)^{n}",
    "4", { m: "seqLimit", f: "\\left(\\frac{2^{1/n}+8^{1/n}}{2}\\right)^{n}" },
    ["exponential-limit", "power-exponential", "nth-root"],
    ["a^{1/n} = 1 + (ln a)/n + …，先把底寫成 1 + (?)/n。", "1^∞ 型，取對數。"],
    "底 = 1 + (ln 2 + ln 8)/(2n) + O(1/n²)，n 次方 → e^{(ln 16)/2} = √16 = 4（兩數的幾何平均）。");

  add("cl-lim-047", 6,
    "\\lim_{n\\to\\infty}\\sqrt{n}\\int_{0}^{1}\\left(1-x^{2}\\right)^{n}dx",
    "sqrt(pi)/2", { m: "integralLimit", f: "\\sqrt{n}(1-x^2)^{n}", a: 0, b: 1 },
    ["asymptotic", "squeeze"],
    ["(1−x²)ⁿ 只在 x 很小時不可忽略；寬度大約 1/√n。", "(1−x²)ⁿ ≈ e^{−nx²}，再代換 x = t/√n。"],
    "√n∫₀¹(1−x²)ⁿdx ≈ √n∫₀^∞ e^{−nx²}dx = ∫₀^∞ e^{−t²}dt = √π/2（誤差兩邊都可以夾住）。");

  add("cl-lim-048", 4,
    "\\lim_{n\\to\\infty}\\int_{0}^{1}\\frac{n\\,x^{n-1}}{2+x}\\,dx",
    "1/3", { m: "integralLimit", f: "\\frac{n x^{n-1}}{2+x}", a: 0, b: 1 },
    ["squeeze", "sequence"],
    ["n x^{n−1} 在 [0,1] 上的積分永遠是 1，而且質量越來越集中在哪一端？", "把 1/(2+x) 和它在那一端的值比較，差用 |x − 1| 控制。"],
    "∫₀¹ n x^{n−1} dx = 1 且質量集中到 x = 1，所以極限是 1/(2+1) = 1/3。嚴格地：差 = ∫ n x^{n−1}(1/(2+x) − 1/3) dx，|…| ≤ ∫ n x^{n−1}(1−x)/6 dx = 1/(6(n+1)) → 0。");

  add("cl-lim-049", 5,
    "\\lim_{n\\to\\infty}n\\int_{0}^{1}\\left(\\sqrt[n]{1+x}-1\\right)dx",
    "2*log(2)-1", { m: "integralLimit", f: "n\\left((1+x)^{1/n}-1\\right)", a: 0, b: 1 },
    ["exponential-limit", "asymptotic"],
    ["(1+x)^{1/n} = e^{ln(1+x)/n}，e^u − 1 ~ u。", "n·(那一項) 在 [0,1] 上一致收斂到 ln(1+x)。"],
    "n((1+x)^{1/n} − 1) → ln(1+x)（一致），所以極限 = ∫₀¹ ln(1+x) dx = 2 ln 2 − 1。");

  /* ── G. 連續複利（R2）── */
  add("cl-lim-050", 2,
    "\\text{年利率 }6\\%\\text{、一年複利 }n\\text{ 次時，本金翻倍需要 }T_n=\\frac{\\ln 2}{n\\ln\\left(1+\\frac{0.06}{n}\\right)}\\text{ 年。}\\quad\\text{連續複利（}n\\to\\infty\\text{）時翻倍需要幾年？}",
    "50*log(2)/3", { m: "limit", f: "\\frac{\\ln 2}{n\\ln(1+\\frac{0.06}{n})}", at: "inf", v: "n" },
    ["applied-limit", "word-problem", "exponential-limit"],
    ["n ln(1 + 0.06/n) 在 n→∞ 時趨近多少？", "ln(1+u) ~ u。"],
    "n ln(1+0.06/n) → 0.06，T → ln 2/0.06 = (50/3) ln 2 ≈ 11.55 年（這就是「72 法則」的連續版：約 69.3/6）。");

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（1A–1E 極限與連續）：極限 vs 函數值、左右極限、讀圖讀表、直接代入與極限定律、
  // 因式分解／通分、e 型、x→±∞、答案是 ±∞ 的無窮極限、連續三條件、不連續分類、中間值定理與二分法。
  const SOURCE = "Buzz course gap fill";
  const V = (f) => ({ m: "value", f });
  const L = (f, at, dir) => (dir ? { m: "limit", f, at, dir } : { m: "limit", f, at });
  // 一整段區間上的下確界／上確界：靠近 a 的「每一點」都比門檻大（小），才算往 ±∞ 衝
  const ext = (f, kind, lo, hi) => ({ m: "extremeOf", integer: false, v: "x", f, kind, range: [lo, hi] });
  const side = (a, dir, width) => (dir === "+" ? [a + 1e-9, a + width] : [a - width, a - 1e-9]);
  const toPlus = (f, a, dir) => [
    { v: ext(f, "inf", ...side(a, dir, 1e-5)), gt: 1e4 },
    { v: ext(f, "inf", ...side(a, dir, 1e-7)), gt: 1e6 }
  ];
  const toMinus = (f, a, dir) => [
    { v: ext(f, "sup", ...side(a, dir, 1e-5)), lt: -1e4 },
    { v: ext(f, "sup", ...side(a, dir, 1e-7)), lt: -1e6 }
  ];
  const PLUS = ["+∞", "∞", "+infinity", "infinity", "正無窮大"];
  const MINUS = ["−∞", "-∞", "-infinity", "負無窮大"];

  const problems = [
    /* ── 1A 極限的概念 ── */
    { id: "cg-1a-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{如圖：}f(x)=x^2-2x+3\\text{，但 }x=2\\text{ 處挖空、另外定義 }f(2)=1\\text{。求 }\\lim_{x\\to 2}f(x)",
      graph: { window: [-1, 4, -1, 7], curves: [{ expr: "x*x-2*x+3", domain: [-1, 4] }], points: [{ x: 2, y: 3, open: true }, { x: 2, y: 1 }] },
      answer: "3", timeLimit: 40,
      tags: ["limit-graph-hole", "graph-reading", "removable"],
      hints: ["極限只看 x 靠近 2 的時候曲線往哪裡走，不看 x = 2 那一點。", "沿著曲線從兩邊走到空心圈，空心圈的高度是多少？"],
      solution: "兩邊沿曲線都走向空心圈 (2, 3)，極限是 3；實心點 f(2) = 1 跟極限無關。",
      solutionSteps: ["極限看的是 x → 2（x ≠ 2）時 f(x) 的去向。", "曲線在 x = 2 附近的高度靠近 2² − 4 + 3 = 3（空心圈）。", "f(2) = 1 不影響極限：lim_{x→2} f(x) = 3。"],
      verify: L("x^2-2x+3", 2) },
    { id: "cg-1a-002", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\text{如圖：}x<1\\text{ 時 }f\\text{ 沿 }(-2,4)\\to(1,1)\\text{ 的直線，}x>1\\text{ 時沿 }(1,1)\\to(4,3)\\text{；}(1,1)\\text{ 是空心圈，另外 }f(1)=3\\text{。求 }\\lim_{x\\to 1}f(x)-f(1)",
      graph: { window: [-3, 5, -1, 5], polylines: [[[-2, 4], [1, 1]], [[1, 1], [4, 3]]], points: [{ x: 1, y: 1, open: true }, { x: 1, y: 3 }] },
      answer: "-2", timeLimit: 50,
      tags: ["limit-graph-hole", "graph-reading", "removable"],
      hints: ["左右兩段都走到同一個空心圈嗎？那就是極限。", "f(1) 要看實心點，不是空心圈。"],
      solution: "兩段都走到空心圈 (1, 1)，所以極限是 1；實心點給 f(1) = 3。相減 1 − 3 = −2。",
      solutionSteps: ["左段、右段都往 (1, 1) 走：lim_{x→1} f(x) = 1。", "實心點在 (1, 3)：f(1) = 3。", "lim_{x→1} f(x) − f(1) = 1 − 3 = −2。"],
      verify: { m: "let", f: "p-3", with: { p: { m: "graphLimit", pts: [[-2, 4], [1, 1]], at: 1, side: "left" } } } },
    { id: "cg-1a-003", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{設 }f(x)=x^2+1\\ (x\\neq 2)\\text{、}f(2)=0\\text{。下列哪一個敘述正確？}",
      answers: ["f(2) = 0，lim_{x→2} f(x) = 5", "f(2)=0，lim f(x)=5"],
      canonical: "f(2) = 0，lim_{x→2} f(x) = 5",
      distractors: ["f(2) = 5，lim_{x→2} f(x) = 5", "f(2) = 0，lim_{x→2} f(x) = 0", "f(2) = 0，lim_{x→2} f(x) 不存在"],
      timeLimit: 40,
      tags: ["limit-vs-value", "direct-substitution"],
      hints: ["f(2) 直接看定義裡寫的那一行。", "極限看 x ≠ 2、靠近 2 時的 x² + 1。"],
      solution: "f(2) 是另外規定的 0；x 靠近 2（不等於 2）時 f(x) = x² + 1 → 5。兩者不必相等。",
      solutionSteps: ["函數值：定義直接寫 f(2) = 0。", "極限：x ≠ 2 時 f(x) = x² + 1，x → 2 時 → 4 + 1 = 5。", "所以 f(2) = 0，lim_{x→2} f(x) = 5。"],
      verify: { m: "choice", options: [
        { say: "f(2) = 0，lim_{x→2} f(x) = 5", all: [{ v: L("x^2+1", 2), eq: 5 }] },
        { say: "f(2) = 5，lim_{x→2} f(x) = 5", given: [{ v: L("x^2+1", 2), eq: 5 }], all: [{ v: V("0"), eq: 5 }] },
        { say: "f(2) = 0，lim_{x→2} f(x) = 0", all: [{ v: L("x^2+1", 2), eq: 0 }] },
        { say: "f(2) = 0，lim_{x→2} f(x) 不存在", all: [{ v: L("x^2+1", 2, "-"), ne: L("x^2+1", 2, "+") }] }
      ] } },
    { id: "cg-1a-004", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=\\frac{x^2-4}{x-2}\\ (x\\neq 2)\\text{、}f(2)=1\\text{。求 }\\lim_{x\\to 2}f(x)-f(2)",
      answer: "3", timeLimit: 50,
      tags: ["limit-vs-value", "factoring", "removable"],
      hints: ["極限只看 x ≠ 2 的地方，那裡可以先化簡分式。", "函數值 f(2) 直接看題目另外給的那一行。"],
      solution: "x ≠ 2 時 f(x) = x + 2 → 4，所以極限是 4；f(2) = 1。差是 4 − 1 = 3。",
      solutionSteps: ["x ≠ 2：(x² − 4)/(x − 2) = x + 2，所以 lim_{x→2} f(x) = 4。", "題目規定 f(2) = 1。", "4 − 1 = 3。"],
      verify: { m: "let", f: "p-1", with: { p: L("\\frac{x^2-4}{x-2}", 2) } } },
    { id: "cg-1a-005", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{下表是 }h(x)=\\frac{\\sqrt{x+3}-2}{x-1}\\text{ 的值：}\\ h(0.9)\\approx 0.25158,\\ h(0.99)\\approx 0.25016,\\ h(0.999)\\approx 0.25002,\\ h(1.001)\\approx 0.24998,\\ h(1.01)\\approx 0.24984,\\ h(1.1)\\approx 0.24846\\quad\\text{由表推測 }\\lim_{x\\to 1}h(x)",
      answer: "1/4", timeLimit: 45,
      tags: ["limit-table-estimate", "limit-from-table"],
      hints: ["左邊三個數（x < 1）往哪個數靠？右邊三個呢？", "兩邊靠向同一個數，那就是極限的猜測值。"],
      solution: "左側 0.25158、0.25016、0.25002 往下靠，右側 0.24846、0.24984、0.24998 往上靠，兩邊夾向 0.25 = 1/4。",
      solutionSteps: ["x → 1⁻：0.25158 → 0.25016 → 0.25002，越來越接近 0.25。", "x → 1⁺：0.24846 → 0.24984 → 0.24998，也接近 0.25。", "兩側一致，推測 lim_{x→1} h(x) = 0.25 = 1/4。"],
      verify: L("\\frac{\\sqrt{x+3}-2}{x-1}", 1) },
    { id: "cg-1a-006", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 5^+}\\frac{|x-5|}{x-5}",
      answer: "1", timeLimit: 30,
      tags: ["one-sided-abs", "one-sided-limit"],
      hints: ["x 從右邊靠近 5，x − 5 是正還是負？", "正數的絕對值就是它自己。"],
      solution: "x > 5 時 |x − 5| = x − 5，分式恆等於 1，右極限是 1。",
      solutionSteps: ["x → 5⁺ 表示 x > 5，x − 5 > 0。", "|x − 5| = x − 5，所以分式 = 1。", "右極限 = 1。"] },
    { id: "cg-1a-007", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to -2^-}\\frac{2x+4}{|x+2|}",
      answer: "-2", timeLimit: 35,
      tags: ["one-sided-abs", "one-sided-limit"],
      hints: ["x 從左邊靠近 −2，x + 2 是正還是負？", "分子 2x + 4 可以寫成 2(x + 2)。"],
      solution: "x < −2 時 |x + 2| = −(x + 2)，分式 = 2(x + 2)/(−(x + 2)) = −2，左極限是 −2。",
      solutionSteps: ["x → −2⁻：x + 2 < 0，所以 |x + 2| = −(x + 2)。", "(2x + 4)/|x + 2| = 2(x + 2)/(−(x + 2)) = −2。", "左極限 = −2。"] },
    { id: "cg-1a-008", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=x^2+1\\ (x<1)\\text{、}f(x)=4-x\\ (x\\ge 1)\\text{。求 }\\lim_{x\\to 1^-}f(x)",
      answer: "2", timeLimit: 35,
      tags: ["one-sided-piecewise", "piecewise", "one-sided-limit"],
      hints: ["左極限只用 x < 1 那一段的式子。", "把 x = 1 代進那一段。"],
      solution: "x → 1⁻ 用 x < 1 的那段 x² + 1，代入得 2。（右段 4 − x 給的是右極限 3。）",
      solutionSteps: ["x → 1⁻：x < 1，f(x) = x² + 1。", "x² + 1 是多項式，代 x = 1 得 2。", "lim_{x→1⁻} f(x) = 2。"],
      verify: L("x^2+1", 1, "-") },
    { id: "cg-1a-009", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=3x-1\\ (x\\le 2)\\text{、}f(x)=x^2+2\\ (x>2)\\text{。求 }\\lim_{x\\to 2^+}f(x)",
      answer: "6", timeLimit: 35,
      tags: ["one-sided-piecewise", "piecewise", "one-sided-limit"],
      hints: ["右極限看 x > 2，用哪一段？", "把 x = 2 代進那一段的式子。"],
      solution: "x → 2⁺ 用 x > 2 那段 x² + 2，代入得 6。（左段 3x − 1 給左極限 5。）",
      solutionSteps: ["x → 2⁺：x > 2，f(x) = x² + 2。", "代 x = 2：4 + 2 = 6。", "lim_{x→2⁺} f(x) = 6。"],
      verify: L("x^2+2", 2, "+") },
    { id: "cg-1a-010", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 4^+}\\left(2+\\sqrt{x-4}\\right)",
      answer: "2", timeLimit: 30,
      tags: ["one-sided-domain-edge", "one-sided-limit", "domain"],
      hints: ["√(x − 4) 只在 x ≥ 4 有定義，所以只能從右邊靠近。", "x → 4⁺ 時 x − 4 → 0⁺。"],
      solution: "x → 4⁺ 時 x − 4 → 0⁺，√(x − 4) → 0，所以極限是 2 + 0 = 2。",
      solutionSteps: ["定義域是 x ≥ 4，只談右極限。", "x → 4⁺：√(x − 4) → √0 = 0。", "極限 = 2 + 0 = 2。"] },
    { id: "cg-1a-011", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=x+k\\ (x<2)\\text{、}f(x)=x^2\\ (x>2)\\text{（}f(2)\\text{ 沒有定義）。若 }\\lim_{x\\to 2}f(x)\\text{ 存在，求 }k",
      answer: "2", timeLimit: 45,
      tags: ["limit-exist-piecewise-param", "piecewise", "one-sided-limit"],
      hints: ["雙側極限存在 ⟺ 左極限 = 右極限。", "左極限用 x + k，右極限用 x²，各自代 x = 2。"],
      solution: "左極限 2 + k，右極限 4。要相等：2 + k = 4，k = 2。f(2) 沒定義不影響極限存在。",
      solutionSteps: ["左極限：x → 2⁻，x + k → 2 + k。", "右極限：x → 2⁺，x² → 4。", "極限存在要 2 + k = 4，k = 2。"],
      verify: { m: "let", f: "p-2", with: { p: L("x^2", 2, "+") } } },
    { id: "cg-1a-012", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=ax+3\\ (x<1)\\text{、}f(x)=\\frac{x^2+2x-3}{x-1}\\ (x>1)\\text{、}f(1)=0\\text{。若 }\\lim_{x\\to 1}f(x)\\text{ 存在，求 }a",
      answer: "1", timeLimit: 60,
      tags: ["limit-exist-piecewise-param", "piecewise", "factoring"],
      hints: ["右邊那段代 x = 1 是 0/0，先因式分解約掉 x − 1。", "極限存在只要左右極限相等，f(1) 是多少不用管。"],
      solution: "右段 (x + 3)(x − 1)/(x − 1) = x + 3 → 4；左段 → a + 3。a + 3 = 4，a = 1。",
      solutionSteps: ["右極限：x² + 2x − 3 = (x + 3)(x − 1)，約分後 x + 3 → 4。", "左極限：ax + 3 → a + 3。", "左 = 右：a + 3 = 4，a = 1（f(1) = 0 跟極限無關）。"],
      verify: { m: "let", f: "p-3", with: { p: L("\\frac{x^2+2x-3}{x-1}", 1, "+") } } },
    { id: "cg-1a-013", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{設 }f(x)=5-x^2\\ (x\\neq 1)\\text{、}f(1)=7\\text{。求 }\\lim_{x\\to 1}f(x)",
      answer: "4", timeLimit: 30,
      tags: ["limit-exist-ignore-value", "direct-substitution"],
      hints: ["極限只看 x ≠ 1 的地方。", "x ≠ 1 時 f(x) 是哪個式子？"],
      solution: "x ≠ 1 時 f(x) = 5 − x² → 4。f(1) = 7 是另外規定的，不影響極限。",
      solutionSteps: ["x → 1（x ≠ 1）：f(x) = 5 − x²。", "5 − x² → 5 − 1 = 4。", "lim_{x→1} f(x) = 4（不是 7）。"],
      verify: L("5-x^2", 1) },
    { id: "cg-1a-014", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{設 }g(x)=\\sqrt{x+5}\\ (x\\neq 4)\\text{、}g(4)=0\\text{。求 }\\lim_{x\\to 4}g(x)",
      answer: "3", timeLimit: 30,
      tags: ["limit-exist-ignore-value", "direct-substitution", "radical"],
      hints: ["g(4) = 0 是特別規定的那一點，極限不看它。", "靠近 4 的時候用 √(x + 5)。"],
      solution: "x ≠ 4 時 g(x) = √(x + 5) → √9 = 3；g(4) = 0 不影響極限。",
      solutionSteps: ["x → 4（x ≠ 4）：g(x) = √(x + 5)。", "√(x + 5) → √9 = 3。", "lim_{x→4} g(x) = 3。"],
      verify: L("\\sqrt{x+5}", 4) },
    { id: "cg-1a-015", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{如圖：}f(x)=\\frac{1}{x-2}\\text{，虛線是 }x=2\\text{。求 }\\lim_{x\\to 2^-}f(x)",
      graph: { window: [-1, 5, -6, 6], curves: [{ expr: "1/(x-2)", domain: [-1, 1.98] }, { expr: "1/(x-2)", domain: [2.02, 5] }], dashed: [[[2, -6], [2, 6]]] },
      answers: MINUS, canonical: "−∞",
      distractors: ["+∞", "0", "不存在，也不是 ±∞"],
      timeLimit: 40,
      tags: ["limit-graph-asymptote", "graph-reading", "asymptote"],
      hints: ["看虛線左邊那一支，越靠近虛線時曲線往上還是往下？", "x 比 2 小一點點時，x − 2 是很小的負數。"],
      solution: "左支貼著虛線往下衝：x → 2⁻ 時 x − 2 → 0⁻，1/(x − 2) → −∞。",
      solutionSteps: ["只看 x < 2 的那一支。", "x → 2⁻：分母 x − 2 是越來越小的負數。", "1 除以很小的負數 → −∞。"],
      verify: { m: "choice", options: [
        { say: "−∞", all: toMinus("\\frac{1}{x-2}", 2, "-") },
        { say: "+∞", all: toPlus("\\frac{1}{x-2}", 2, "-") },
        { say: "0", all: [{ v: V("\\frac{1}{(2-10^{-6})-2}"), eq: 0 }] },
        { say: "不存在，也不是 ±∞", all: [{ v: ext("\\frac{1}{x-2}", "sup", 2 - 1e-5, 2 - 1e-9), gt: -1e4 }] }
      ] } },
    { id: "cg-1a-016", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{圖中虛線 }x=-1\\text{ 是 }f(x)=-\\frac{1}{(x+1)^2}\\text{ 的垂直漸近線。兩側一起看，求 }\\lim_{x\\to -1}f(x)",
      graph: { window: [-4, 2, -8, 2], curves: [{ expr: "-1/((x+1)*(x+1))", domain: [-4, -1.05] }, { expr: "-1/((x+1)*(x+1))", domain: [-0.95, 2] }], dashed: [[[-1, -8], [-1, 2]]] },
      answers: MINUS, canonical: "−∞",
      distractors: ["+∞", "不存在（左右往不同方向）", "-1"],
      timeLimit: 45,
      tags: ["limit-graph-asymptote", "graph-reading", "asymptote"],
      hints: ["虛線兩邊的兩支各往哪個方向衝？", "(x + 1)² 不管 x 在 −1 的哪一邊都是正的。"],
      solution: "兩支都貼著虛線往下衝：(x + 1)² → 0⁺，−1/(x + 1)² → −∞，左右一致，所以雙側極限是 −∞。",
      solutionSteps: ["x → −1⁻ 與 x → −1⁺：(x + 1)² 都是很小的正數。", "−1/(很小的正數) → −∞，兩側一樣。", "lim_{x→−1} f(x) = −∞。"],
      verify: { m: "choice", options: [
        { say: "−∞", all: [...toMinus("-\\frac{1}{(x+1)^2}", -1, "-"), ...toMinus("-\\frac{1}{(x+1)^2}", -1, "+")] },
        { say: "+∞", all: toPlus("-\\frac{1}{(x+1)^2}", -1, "+") },
        { say: "不存在（左右往不同方向）", all: toPlus("-\\frac{1}{(x+1)^2}", -1, "-") },
        { say: "-1", all: [{ v: V("-\\frac{1}{((-1+10^{-6})+1)^2}"), eq: -1 }] }
      ] } },
    { id: "cg-1a-017", topic: "limits", rank: 2, answerKind: "text",
      prompt: "f(x)=\\cos\\frac{\\pi}{x}\\text{。小明算了 }f(0.1)=f(0.01)=f(0.001)=1\\text{，就說 }\\lim_{x\\to 0^+}f(x)=1\\text{。下列哪一個判斷正確？}",
      answers: ["極限不存在：x = 1/101、1/1001 這種點的值是 −1", "極限不存在"],
      canonical: "極限不存在：x = 1/101、1/1001 這種點的值是 −1",
      distractors: ["極限是 1：三個點都算出 1", "極限是 0：x 越小 cos 越接近 0"],
      timeLimit: 60,
      tags: ["limit-table-trap", "limit-from-table", "oscillation"],
      hints: ["0.1、0.01、0.001 都是 1/(偶數)，cos(偶數·π) 當然是 1。", "換 x = 1/(奇數) 試試看。"],
      solution: "取樣點全是 1/(2k)，剛好都落在 cos 的波峰。換成 x = 1/(2k + 1) 得 cos((2k + 1)π) = −1。x → 0⁺ 時值在 1 與 −1 之間來回，極限不存在。",
      solutionSteps: ["x = 1/(2k)：cos(2kπ) = 1——表格只挑到這種點。", "x = 1/(2k + 1)：cos((2k + 1)π) = −1，例如 f(1/101) = −1。", "越靠近 0 兩種點都有，值不會固定靠向一個數：極限不存在。"],
      verify: { m: "choice", options: [
        { say: "極限不存在：x = 1/101、1/1001 這種點的值是 −1", all: [
          { v: { m: "let", f: "|p-q|", with: { p: V("\\cos(100\\pi)"), q: V("\\cos(101\\pi)") } }, gt: 1 },
          { v: { m: "let", f: "|p-q|", with: { p: V("\\cos(1000\\pi)"), q: V("\\cos(1001\\pi)") } }, gt: 1 }
        ] },
        { say: "極限是 1：三個點都算出 1", all: [{ v: V("\\cos(1001\\pi)"), eq: 1 }] },
        { say: "極限是 0：x 越小 cos 越接近 0", all: [{ v: V("\\cos(1000\\pi)"), eq: 0 }] }
      ] } },
    { id: "cg-1a-018", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{如圖：}x<2\\text{ 時 }f\\text{ 沿 }(0,0)\\to(2,1)\\text{，}x\\ge 2\\text{ 時沿 }(2,3)\\to(4,2)\\text{（}(2,1)\\text{ 空心、}(2,3)\\text{ 實心）。下列哪一組正確？}",
      graph: { window: [-1, 5, -1, 4], polylines: [[[0, 0], [2, 1]], [[2, 3], [4, 2]]], points: [{ x: 2, y: 1, open: true }, { x: 2, y: 3 }] },
      answers: ["左極限 1、右極限 3、雙側極限不存在、f(2) = 3"],
      canonical: "左極限 1、右極限 3、雙側極限不存在、f(2) = 3",
      distractors: ["左極限 1、右極限 3、雙側極限 2、f(2) = 3", "左極限 1、右極限 3、雙側極限不存在、f(2) = 1", "左極限 3、右極限 1、雙側極限不存在、f(2) = 3"],
      timeLimit: 50,
      tags: ["limit-graph-jump", "graph-reading", "one-sided-limit"],
      hints: ["左極限沿左段走到 x = 2，右極限沿右段走到 x = 2。", "f(2) 看實心點；左右不相等時雙側極限不存在。"],
      solution: "左段走到空心 (2, 1)：左極限 1；右段從 (2, 3) 出發：右極限 3。1 ≠ 3，雙側極限不存在；實心點給 f(2) = 3。",
      solutionSteps: ["左極限：沿 (0,0)→(2,1)，得 1。", "右極限：沿 (2,3)→(4,2)，得 3。", "1 ≠ 3 ⟹ lim_{x→2} f(x) 不存在；實心點 f(2) = 3。"],
      verify: { m: "choice", options: [
        { say: "左極限 1、右極限 3、雙側極限不存在、f(2) = 3", all: [
          { v: { m: "graphLimit", pts: [[0, 0], [2, 1]], at: 2, side: "left" }, eq: 1 },
          { v: { m: "graphLimit", pts: [[2, 3], [4, 2]], at: 2, side: "right" }, eq: 3 },
          { v: { m: "graphLimit", pts: [[0, 0], [2, 1]], at: 2, side: "left" }, ne: { m: "graphLimit", pts: [[2, 3], [4, 2]], at: 2, side: "right" } },
          { v: { m: "graphValue", pts: [[2, 3], [4, 2]], at: 2 }, eq: 3 }
        ] },
        { say: "左極限 1、右極限 3、雙側極限 2、f(2) = 3", all: [
          { v: { m: "graphLimit", pts: [[0, 0], [2, 1]], at: 2, side: "left" }, eq: { m: "graphLimit", pts: [[2, 3], [4, 2]], at: 2, side: "right" } }
        ] },
        { say: "左極限 1、右極限 3、雙側極限不存在、f(2) = 1", all: [{ v: { m: "graphValue", pts: [[2, 3], [4, 2]], at: 2 }, eq: 1 }] },
        { say: "左極限 3、右極限 1、雙側極限不存在、f(2) = 3", all: [{ v: { m: "graphLimit", pts: [[0, 0], [2, 1]], at: 2, side: "left" }, eq: 3 }] }
      ] } },

    /* ── 1B 代數極限 ── */
    { id: "cg-1b-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to -1}\\frac{2x^2+3}{x+4}",
      answer: "5/3", timeLimit: 30,
      tags: ["limit-direct-rational", "direct-substitution", "rational-limit"],
      hints: ["先看分母代 x = −1 會不會是 0。", "分母不是 0，有理函數就可以直接代入。"],
      solution: "分母 −1 + 4 = 3 ≠ 0，直接代入：(2 + 3)/3 = 5/3。",
      solutionSteps: ["分母在 x = −1 是 3，不為 0。", "代入：(2·1 + 3)/3 = 5/3。"] },
    { id: "cg-1b-002", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 4}\\left(\\sqrt{x}+\\frac{x}{x-2}\\right)",
      answer: "4", timeLimit: 30,
      tags: ["limit-direct-rational", "direct-substitution", "radical"],
      hints: ["√x 在 x = 4 有定義，分母 x − 2 在 x = 4 不是 0。", "兩項分別代入再相加。"],
      solution: "√4 = 2，4/(4 − 2) = 2，直接代入得 2 + 2 = 4。",
      solutionSteps: ["√x 在 x = 4 連續：→ 2。", "x/(x − 2) 分母 2 ≠ 0：→ 4/2 = 2。", "和的極限 = 2 + 2 = 4。"] },
    { id: "cg-1b-003", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{已知 }\\lim_{x\\to 1}f(x)=3\\text{、}\\lim_{x\\to 1}g(x)=-2\\text{。求 }\\lim_{x\\to 1}\\left[2f(x)-g(x)^2\\right]",
      answer: "2", timeLimit: 35,
      tags: ["limit-laws-combine", "direct-substitution"],
      hints: ["常數倍、差、乘積的極限可以拆開算。", "g(x)² 的極限是 (lim g)²。"],
      solution: "2·3 − (−2)² = 6 − 4 = 2。",
      solutionSteps: ["lim 2f(x) = 2·3 = 6。", "lim g(x)² = (−2)² = 4。", "相減：6 − 4 = 2。"],
      verify: L("2(x+2)-(x^2-2x-1)^2", 1) },
    { id: "cg-1b-004", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\text{已知 }\\lim_{x\\to 2}f(x)=4\\text{、}\\lim_{x\\to 2}g(x)=-1\\text{。求 }\\lim_{x\\to 2}\\frac{\\sqrt{f(x)}+g(x)}{f(x)+g(x)}",
      answer: "1/3", timeLimit: 40,
      tags: ["limit-laws-combine", "direct-substitution"],
      hints: ["商的極限 = 極限的商，前提是分母的極限不是 0。", "√f 的極限是 √(lim f)。"],
      solution: "分子 → √4 + (−1) = 1，分母 → 4 + (−1) = 3 ≠ 0，所以極限是 1/3。",
      solutionSteps: ["分子：√4 − 1 = 1。", "分母：4 − 1 = 3，不為 0，可以用商的定律。", "極限 = 1/3。"],
      verify: L("\\frac{\\sqrt{x+2}+(1-x)}{(x+2)+(1-x)}", 2) },
    { id: "cg-1b-005", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列三個極限，哪一個可以直接把 }x=2\\text{ 代進去求值？}",
      answers: ["lim_{x→2} (x + 2)/(x² + 1)", "(x+2)/(x^2+1)"],
      canonical: "lim_{x→2} (x + 2)/(x² + 1)",
      distractors: ["lim_{x→2} (x² − 4)/(x − 2)", "lim_{x→2} (x + 1)/(x − 2)"],
      timeLimit: 35,
      tags: ["limit-direct-check-form", "direct-substitution", "rational-limit"],
      hints: ["有理函數能直接代入，條件是分母代進去不是 0。", "三個分母各代 x = 2 看看。"],
      solution: "(x² − 4)/(x − 2) 代入是 0/0、(x + 1)/(x − 2) 是 3/0，都不能直接代；(x + 2)/(x² + 1) 分母 5 ≠ 0，可以直接代入得 4/5。",
      solutionSteps: ["(x² − 4)/(x − 2)：分母 0、分子 0，0/0 要先化簡。", "(x + 1)/(x − 2)：分母 0、分子 3，k/0 型。", "(x + 2)/(x² + 1)：分母 5 ≠ 0，直接代入 = 4/5。"],
      verify: { m: "choice", options: [
        { say: "lim_{x→2} (x + 2)/(x² + 1)", all: [{ v: V("2^2+1"), ne: 0 }, { v: L("\\frac{x+2}{x^2+1}", 2), eq: V("\\frac{2+2}{2^2+1}") }] },
        { say: "lim_{x→2} (x² − 4)/(x − 2)", all: [{ v: V("2-2"), ne: 0 }] },
        { say: "lim_{x→2} (x + 1)/(x − 2)", all: [{ v: V("2-2"), ne: 0 }] }
      ] } },
    { id: "cg-1b-006", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{把 }x=-1\\text{ 代進 }\\frac{x+3}{x^2-1}\\text{，屬於哪一種情形？}",
      answers: ["k/0 型（分子不是 0、分母是 0）", "k/0", "k/0 型"],
      canonical: "k/0 型（分子不是 0、分母是 0）",
      distractors: ["0/0 型（要先化簡）", "可以直接代入得一個數"],
      timeLimit: 30,
      tags: ["limit-direct-check-form", "direct-substitution", "rational-limit"],
      hints: ["分子、分母各自代 x = −1。", "分母是 0 的時候，再看分子是不是 0。"],
      solution: "分子 −1 + 3 = 2，分母 1 − 1 = 0：k/0 型。不能直接代入，也不是約分就能處理的 0/0。",
      solutionSteps: ["分子：−1 + 3 = 2 ≠ 0。", "分母：(−1)² − 1 = 0。", "非零 ÷ 0：k/0 型（極限會是 ±∞ 或不存在）。"],
      verify: { m: "choice", options: [
        { say: "k/0 型（分子不是 0、分母是 0）", all: [{ v: V("-1+3"), ne: 0 }, { v: V("(-1)^2-1"), eq: 0 }] },
        { say: "0/0 型（要先化簡）", all: [{ v: V("-1+3"), eq: 0 }, { v: V("(-1)^2-1"), eq: 0 }] },
        { say: "可以直接代入得一個數", all: [{ v: V("(-1)^2-1"), ne: 0 }] }
      ] } },
    { id: "cg-1b-007", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 2}\\frac{x^2-5x+6}{x^2-x-2}",
      answer: "-1/3", timeLimit: 45,
      tags: ["factor-trinomial", "factoring", "rational-limit"],
      hints: ["代入是 0/0，分子分母都有因式 (x − 2)。", "x² − 5x + 6 與 x² − x − 2 各拆成兩個一次式。"],
      solution: "(x − 2)(x − 3)/((x − 2)(x + 1)) = (x − 3)/(x + 1) → −1/3。",
      solutionSteps: ["x² − 5x + 6 = (x − 2)(x − 3)，x² − x − 2 = (x − 2)(x + 1)。", "約掉 x − 2：(x − 3)/(x + 1)。", "代 x = 2：−1/3。"] },
    { id: "cg-1b-008", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to -4}\\frac{x^2+7x+12}{x+4}",
      answer: "-1", timeLimit: 35,
      tags: ["factor-trinomial", "factoring", "rational-limit"],
      hints: ["找兩個數，相乘 12、相加 7。", "約掉 x + 4 之後再代入。"],
      solution: "x² + 7x + 12 = (x + 3)(x + 4)，約分後 x + 3 → −1。",
      solutionSteps: ["十字交乘：x² + 7x + 12 = (x + 3)(x + 4)。", "約掉 x + 4，剩 x + 3。", "代 x = −4：−1。"] },
    { id: "cg-1b-009", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 1}\\frac{x^3-3x+2}{(x-1)^2}",
      answer: "3", timeLimit: 60,
      tags: ["factor-repeated-root", "factoring", "rational-limit"],
      hints: ["分子在 x = 1 是 0，先除以 (x − 1)。", "除完的商在 x = 1 還是 0，再除一次。"],
      solution: "x³ − 3x + 2 = (x − 1)(x² + x − 2) = (x − 1)²(x + 2)，約掉 (x − 1)² 得 x + 2 → 3。",
      solutionSteps: ["x³ − 3x + 2 = (x − 1)(x² + x − 2)。", "x² + x − 2 = (x − 1)(x + 2)，所以分子 = (x − 1)²(x + 2)。", "約分後 x + 2 → 3。"] },
    { id: "cg-1b-010", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 2}\\frac{x^3-3x^2+4}{x^3-4x^2+4x}",
      answer: "3/2", timeLimit: 70,
      tags: ["factor-repeated-root", "factoring", "rational-limit"],
      hints: ["分母先提 x，剩下的是完全平方。", "分子用 x = 2 是根做除法，商還會再有一個 x = 2 的根。"],
      solution: "分子 = (x − 2)²(x + 1)，分母 = x(x − 2)²，約分後 (x + 1)/x → 3/2。",
      solutionSteps: ["分母：x³ − 4x² + 4x = x(x − 2)²。", "分子：x³ − 3x² + 4 = (x − 2)(x² − x − 2) = (x − 2)²(x + 1)。", "約掉 (x − 2)²：(x + 1)/x → 3/2。"] },
    { id: "cg-1b-011", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 2}\\frac{x^2-4}{x^2-4x+4}",
      answer: "dne", timeLimit: 60,
      tags: ["factor-after-cancel-check", "factoring", "dne"],
      hints: ["約掉一個 x − 2 之後，再代一次 x = 2 看看是什麼型。", "k/0 的時候，左右兩邊的正負號要分開看。"],
      solution: "約分後 (x + 2)/(x − 2)：代入是 4/0。x → 2⁺ 時 → +∞，x → 2⁻ 時 → −∞，極限不存在（答 dne）。",
      solutionSteps: ["(x² − 4)/(x − 2)² = (x + 2)/(x − 2)。", "代 x = 2：4/0，不是 0/0，不能再約。", "右側 → +∞、左側 → −∞，兩側不同：極限不存在。"],
      verify: { m: "choice", options: [
        { say: "dne", all: [...toMinus("\\frac{x^2-4}{(x-2)^2}", 2, "-"), ...toPlus("\\frac{x^2-4}{(x-2)^2}", 2, "+")] },
        { say: "1", all: [{ v: V("\\frac{(2+10^{-6})^2-4}{(10^{-6})^2}"), eq: 1 }] }
      ] } },
    { id: "cg-1b-012", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 3}\\frac{\\frac{2}{x}-\\frac{2}{3}}{x-3}",
      answer: "-2/9", timeLimit: 45,
      tags: ["algebra-complex-fraction", "rational-limit"],
      hints: ["先把分子 2/x − 2/3 通分成一個分式。", "通分後分子會出現 3 − x，跟分母的 x − 3 只差一個負號。"],
      solution: "2/x − 2/3 = 2(3 − x)/(3x)，除以 x − 3 得 −2/(3x) → −2/9。",
      solutionSteps: ["2/x − 2/3 = (6 − 2x)/(3x) = −2(x − 3)/(3x)。", "除以 (x − 3)：−2/(3x)。", "代 x = 3：−2/9。"] },
    { id: "cg-1b-013", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 1}\\frac{\\frac{3}{x+2}-1}{x-1}",
      answer: "-1/3", timeLimit: 50,
      tags: ["algebra-complex-fraction", "rational-limit"],
      hints: ["把 1 寫成 (x + 2)/(x + 2) 再相減。", "分子化簡後會出現 1 − x。"],
      solution: "3/(x + 2) − 1 = (1 − x)/(x + 2)，除以 x − 1 得 −1/(x + 2) → −1/3。",
      solutionSteps: ["3/(x + 2) − 1 = (3 − x − 2)/(x + 2) = (1 − x)/(x + 2)。", "除以 (x − 1)：−1/(x + 2)。", "代 x = 1：−1/3。"] },
    { id: "cg-1b-014", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 2}\\left(\\frac{1}{x-2}-\\frac{4}{x^2-4}\\right)",
      answer: "1/4", timeLimit: 55,
      tags: ["algebra-common-denominator", "rational-limit", "factoring"],
      hints: ["兩項各自都會爆掉（∞ − ∞），先通分。", "公分母取 x² − 4 = (x − 2)(x + 2)。"],
      solution: "通分：(x + 2 − 4)/(x² − 4) = (x − 2)/((x − 2)(x + 2)) = 1/(x + 2) → 1/4。",
      solutionSteps: ["1/(x − 2) = (x + 2)/(x² − 4)。", "相減：(x + 2 − 4)/(x² − 4) = (x − 2)/((x − 2)(x + 2))。", "約分得 1/(x + 2) → 1/4。"] },
    { id: "cg-1b-015", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}\\left(\\frac{1}{x}-\\frac{1}{x^2+x}\\right)",
      answer: "1", timeLimit: 50,
      tags: ["algebra-common-denominator", "rational-limit", "factoring"],
      hints: ["x² + x = x(x + 1)，公分母就用它。", "通分後分子會剩一個 x，可以約。"],
      solution: "通分：((x + 1) − 1)/(x(x + 1)) = x/(x(x + 1)) = 1/(x + 1) → 1。",
      solutionSteps: ["1/x = (x + 1)/(x(x + 1))。", "相減：(x + 1 − 1)/(x(x + 1)) = x/(x(x + 1))。", "約分得 1/(x + 1) → 1。"] },
    { id: "cg-1b-016", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{h\\to 0}\\frac{(h-2)^2-4}{h}",
      answer: "-4", timeLimit: 40,
      tags: ["algebra-expand", "rational-limit"],
      hints: ["先把 (h − 2)² 展開。", "展開後 4 會消掉，剩下的每一項都有 h。"],
      solution: "(h − 2)² − 4 = h² − 4h，除以 h 得 h − 4 → −4。",
      solutionSteps: ["(h − 2)² = h² − 4h + 4，減 4 得 h² − 4h。", "除以 h：h − 4（h ≠ 0）。", "h → 0：−4。"] },

    /* ── 1C 標準極限：e 型 ── */
    { id: "cg-1c-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}(1+3x)^{1/x}",
      answer: "e^3", timeLimit: 40,
      tags: ["e-type-zero-form", "exponential-limit", "standard-limit"],
      hints: ["基本形是 (1 + u)^{1/u} → e（u → 0）。", "令 u = 3x，指數 1/x 要寫成 (1/u)·3。"],
      solution: "(1 + 3x)^{1/x} = [(1 + 3x)^{1/(3x)}]³ → e³。",
      solutionSteps: ["令 u = 3x，x → 0 時 u → 0。", "(1 + 3x)^{1/x} = [(1 + u)^{1/u}]³。", "→ e³。"],
      verify: L("(1+3x)^{1/x}", 0) },
    { id: "cg-1c-002", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 0}(1-2x)^{1/(3x)}",
      answer: "e^(-2/3)", timeLimit: 55,
      tags: ["e-type-zero-form", "exponential-limit", "standard-limit"],
      hints: ["令 u = −2x，看指數 1/(3x) 要寫成 (1/u) 乘上多少。", "或者取 ln：ln(1 − 2x)/(3x)，用 ln(1 + u) ≈ u。"],
      solution: "1/(3x) = (1/(−2x))·(−2/3)，所以極限 = e^{−2/3}。",
      solutionSteps: ["令 u = −2x：(1 − 2x)^{1/(3x)} = [(1 + u)^{1/u}]^{−2/3}。", "(1 + u)^{1/u} → e。", "極限 = e^{−2/3} ≈ 0.5134。"] },

    /* ── 1D 無窮與夾擠 ── */
    { id: "cg-1d-001", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to\\infty}\\frac{3x+7}{x^2-5}",
      answer: "0", timeLimit: 35,
      tags: ["infinity-rational-degree-compare", "rational-limit", "infinity-limit"],
      hints: ["比較分子、分母的最高次數。", "上下同除以 x²。"],
      solution: "分子 1 次、分母 2 次，同除 x²：(3/x + 7/x²)/(1 − 5/x²) → 0/1 = 0。",
      solutionSteps: ["同除 x²：(3/x + 7/x²)/(1 − 5/x²)。", "x → ∞：分子 → 0，分母 → 1。", "極限 = 0（分母次數較高）。"],
      // 極限是 0 的時候相對誤差比不了：改驗 x·f(x) → 3（≠ 0），f 跟 3/x 同階，所以 f → 0
      verify: { m: "choice", options: [
        { say: "0", all: [{ v: L("x\\cdot\\frac{3x+7}{x^2-5}", "inf"), eq: 3 }] }
      ] } },
    { id: "cg-1d-002", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\lim_{x\\to\\infty}\\frac{2x^3-x}{5-x^2}",
      answers: MINUS, canonical: "−∞",
      distractors: ["+∞", "-2", "0"],
      timeLimit: 40,
      tags: ["infinity-rational-degree-compare", "rational-limit", "infinity-limit"],
      hints: ["分子 3 次、分母 2 次，誰長得快？", "看最高次項：2x³/(−x²) 的正負號。"],
      solution: "最高次項 2x³/(−x²) = −2x，x → ∞ 時 → −∞。",
      solutionSteps: ["分子次數 3 > 分母次數 2，極限是 ±∞。", "主導項：2x³/(−x²) = −2x。", "x → ∞：−2x → −∞。"],
      verify: { m: "choice", options: [
        { say: "−∞", all: [{ v: ext("\\frac{2x^3-x}{5-x^2}", "sup", 1e4, 1e5), lt: -1e3 }, { v: ext("\\frac{2x^3-x}{5-x^2}", "sup", 1e6, 1e7), lt: -1e5 }] },
        { say: "+∞", all: [{ v: ext("\\frac{2x^3-x}{5-x^2}", "inf", 1e4, 1e5), gt: 1e3 }] },
        { say: "-2", all: [{ v: V("\\frac{2\\cdot 10^{18}-10^6}{5-10^{12}}"), eq: -2 }] },
        { say: "0", all: [{ v: V("\\frac{2\\cdot 10^{18}-10^6}{5-10^{12}}"), eq: 0 }] }
      ] } },
    { id: "cg-1d-003", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to-\\infty}\\frac{\\sqrt{4x^2+1}}{x+3}",
      answer: "-2", timeLimit: 55,
      tags: ["infinity-negative-sqrt", "radical", "infinity-limit"],
      hints: ["x → −∞ 時 x 是負的，√(x²) = |x| = −x。", "把根號裡提出 x²，分母提出 x。"],
      solution: "√(4x² + 1) = |x|√(4 + 1/x²) = −x√(4 + 1/x²)。除以 x + 3 = x(1 + 3/x)：−√(4 + 1/x²)/(1 + 3/x) → −2。",
      solutionSteps: ["x < 0：√(4x² + 1) = −x·√(4 + 1/x²)。", "分母 x + 3 = x(1 + 3/x)。", "比值 = −√(4 + 1/x²)/(1 + 3/x) → −2。"] },
    { id: "cg-1d-004", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to-\\infty}\\frac{3x-2}{\\sqrt{x^2+5x}}",
      answer: "-3", timeLimit: 55,
      tags: ["infinity-negative-sqrt", "radical", "infinity-limit"],
      hints: ["分子分母同除以 |x|，而 x → −∞ 時 |x| = −x。", "√(x² + 5x)/|x| = √(1 + 5/x)。"],
      solution: "同除 −x（= |x| > 0）：(−3 + 2/x)/√(1 + 5/x) → −3。",
      solutionSteps: ["x < 0：√(x² + 5x) = −x·√(1 + 5/x)。", "比值 = (3x − 2)/(−x√(1 + 5/x)) = (−3 + 2/x)/√(1 + 5/x)。", "x → −∞：→ −3/1 = −3。"] },
    { id: "cg-1d-005", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\lim_{x\\to 3^+}\\frac{x+1}{x-3}",
      answers: PLUS, canonical: "+∞",
      distractors: ["−∞", "4", "0"],
      timeLimit: 35,
      tags: ["infinite-limit-sign", "infinity-limit", "one-sided-limit"],
      hints: ["代入是 4/0，極限會是 ±∞，要判斷正負號。", "x 比 3 大一點，分子、分母各是正還是負？"],
      solution: "x → 3⁺：分子 → 4 > 0，分母 x − 3 是很小的正數，比值 → +∞。",
      solutionSteps: ["分子 → 4（正）。", "x → 3⁺：分母 x − 3 → 0⁺（正）。", "正 ÷ 很小的正數 → +∞。"],
      verify: { m: "choice", options: [
        { say: "+∞", all: toPlus("\\frac{x+1}{x-3}", 3, "+") },
        { say: "−∞", all: toMinus("\\frac{x+1}{x-3}", 3, "+") },
        { say: "4", all: [{ v: V("\\frac{(3+10^{-6})+1}{10^{-6}}"), eq: 4 }] },
        { say: "0", all: [{ v: V("\\frac{(3+10^{-6})+1}{10^{-6}}"), eq: 0 }] }
      ] } },
    { id: "cg-1d-006", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\lim_{x\\to -2^-}\\frac{x}{x+2}",
      answers: PLUS, canonical: "+∞",
      distractors: ["−∞", "1", "不存在，也不是 ±∞"],
      timeLimit: 40,
      tags: ["infinite-limit-sign", "infinity-limit", "one-sided-limit"],
      hints: ["分子靠近 −2，是負的。", "x 比 −2 小一點，x + 2 是正還是負？"],
      solution: "x → −2⁻：分子 → −2 < 0，分母 x + 2 → 0⁻（負），負 ÷ 負 → +∞。",
      solutionSteps: ["分子 → −2（負）。", "x → −2⁻：x + 2 是很小的負數。", "負 ÷ 很小的負數 → +∞。"],
      verify: { m: "choice", options: [
        { say: "+∞", all: toPlus("\\frac{x}{x+2}", -2, "-") },
        { say: "−∞", all: toMinus("\\frac{x}{x+2}", -2, "-") },
        { say: "1", all: [{ v: V("\\frac{-2-10^{-6}}{-10^{-6}}"), eq: 1 }] },
        { say: "不存在，也不是 ±∞", all: [{ v: ext("\\frac{x}{x+2}", "inf", -2 - 1e-5, -2 - 1e-9), lt: 1e4 }] }
      ] } },
    { id: "cg-1d-007", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\lim_{x\\to 1^+}\\frac{2-3x}{x-1}",
      answers: MINUS, canonical: "−∞",
      distractors: ["+∞", "-3", "-1"],
      timeLimit: 35,
      tags: ["infinite-limit-sign", "infinity-limit", "one-sided-limit"],
      hints: ["分子代 x = 1 是多少？正還是負？", "x → 1⁺ 時分母是很小的正數。"],
      solution: "x → 1⁺：分子 → −1 < 0，分母 → 0⁺，負 ÷ 很小的正數 → −∞。",
      solutionSteps: ["分子 → 2 − 3 = −1（負）。", "x → 1⁺：x − 1 → 0⁺。", "−1 ÷ 很小的正數 → −∞。"],
      verify: { m: "choice", options: [
        { say: "−∞", all: toMinus("\\frac{2-3x}{x-1}", 1, "+") },
        { say: "+∞", all: toPlus("\\frac{2-3x}{x-1}", 1, "+") },
        { say: "-3", all: [{ v: V("\\frac{2-3(1+10^{-6})}{10^{-6}}"), eq: -3 }] },
        { say: "-1", all: [{ v: V("\\frac{2-3(1+10^{-6})}{10^{-6}}"), eq: -1 }] }
      ] } },
    { id: "cg-1d-008", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\lim_{x\\to 1}\\frac{3}{(x-1)^2}",
      answers: PLUS, canonical: "+∞",
      distractors: ["−∞", "不存在（左右往不同方向）", "3"],
      timeLimit: 35,
      tags: ["infinite-limit-k-over-zero", "infinity-limit", "asymptote"],
      hints: ["雙側極限：左右兩邊都要看。", "(x − 1)² 在 x = 1 兩側都是正的。"],
      solution: "兩側 (x − 1)² 都 → 0⁺，3/(x − 1)² 都 → +∞，左右一致，極限是 +∞。",
      solutionSteps: ["x → 1⁻ 與 x → 1⁺：(x − 1)² 都是很小的正數。", "3 ÷ 很小的正數 → +∞，兩側相同。", "lim_{x→1} 3/(x − 1)² = +∞。"],
      verify: { m: "choice", options: [
        { say: "+∞", all: [...toPlus("\\frac{3}{(x-1)^2}", 1, "-"), ...toPlus("\\frac{3}{(x-1)^2}", 1, "+")] },
        { say: "−∞", all: toMinus("\\frac{3}{(x-1)^2}", 1, "+") },
        { say: "不存在（左右往不同方向）", all: toMinus("\\frac{3}{(x-1)^2}", 1, "-") },
        { say: "3", all: [{ v: V("\\frac{3}{(10^{-6})^2}"), eq: 3 }] }
      ] } },
    { id: "cg-1d-009", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\lim_{x\\to -1}\\frac{x+2}{x+1}\\text{ 是哪一種情形？}",
      answers: ["不存在：左側 −∞、右側 +∞", "不存在", "dne"],
      canonical: "不存在：左側 −∞、右側 +∞",
      distractors: ["+∞", "−∞", "1"],
      timeLimit: 45,
      tags: ["infinite-limit-k-over-zero", "infinity-limit", "one-sided-limit"],
      hints: ["代入是 1/0，左右兩邊分開判斷正負號。", "分子靠近 1（正），分母 x + 1 在 −1 的左邊、右邊各是什麼號？"],
      solution: "分子 → 1 > 0。x → −1⁻ 時分母 → 0⁻，比值 → −∞；x → −1⁺ 時分母 → 0⁺，比值 → +∞。兩側不同，雙側極限不存在（連 ±∞ 都不是）。",
      solutionSteps: ["分子 → −1 + 2 = 1（正）。", "左側：x + 1 → 0⁻，比值 → −∞；右側：x + 1 → 0⁺，比值 → +∞。", "兩側不同 ⟹ 極限不存在。"],
      verify: { m: "choice", options: [
        { say: "不存在：左側 −∞、右側 +∞", all: [...toMinus("\\frac{x+2}{x+1}", -1, "-"), ...toPlus("\\frac{x+2}{x+1}", -1, "+")] },
        { say: "+∞", all: toPlus("\\frac{x+2}{x+1}", -1, "-") },
        { say: "−∞", all: toMinus("\\frac{x+2}{x+1}", -1, "+") },
        { say: "1", all: [{ v: V("\\frac{(-1+10^{-6})+2}{10^{-6}}"), eq: 1 }] }
      ] } },

    /* ── 1E 連續 ── */
    { id: "cg-1e-001", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{設 }f(x)=x^2+1\\ (x<1)\\text{、}f(x)=3x-1\\ (x\\ge 1)\\text{。}f\\text{ 在 }x=1\\text{ 連續嗎？}",
      answers: ["連續", "連續：左右極限都是 2，而且 f(1) = 2"],
      canonical: "連續",
      distractors: ["不連續：左右極限不相等", "不連續：極限存在但不等於 f(1)"],
      timeLimit: 45,
      tags: ["continuity-three-conditions", "continuity", "piecewise"],
      hints: ["連續要三件事：f(1) 有定義、極限存在、兩者相等。", "左極限用 x² + 1，右極限與 f(1) 用 3x − 1。"],
      solution: "f(1) = 3 − 1 = 2；左極限 1 + 1 = 2；右極限 3 − 1 = 2。三者相等，連續。",
      solutionSteps: ["f(1) = 3·1 − 1 = 2（x ≥ 1 那段）。", "左極限：x² + 1 → 2；右極限：3x − 1 → 2，極限存在 = 2。", "lim = f(1) = 2：連續。"],
      verify: { m: "choice", options: [
        { say: "連續", all: [{ v: L("x^2+1", 1, "-"), eq: L("3x-1", 1, "+") }, { v: L("3x-1", 1, "+"), eq: V("3\\cdot 1-1") }] },
        { say: "不連續：左右極限不相等", all: [{ v: L("x^2+1", 1, "-"), ne: L("3x-1", 1, "+") }] },
        { say: "不連續：極限存在但不等於 f(1)", all: [{ v: L("x^2+1", 1, "-"), eq: L("3x-1", 1, "+") }, { v: L("3x-1", 1, "+"), ne: V("3\\cdot 1-1") }] }
      ] } },
    { id: "cg-1e-002", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{設 }g(x)=\\frac{x^2-4}{x-2}\\ (x\\neq 2)\\text{、}g(2)=3\\text{。}g\\text{ 在 }x=2\\text{ 連續嗎？哪一條不成立？}",
      answers: ["不連續：極限存在但不等於 g(2)", "不連續"],
      canonical: "不連續：極限存在但不等於 g(2)",
      distractors: ["連續", "不連續：左右極限不相等", "不連續：極限是 ∞"],
      timeLimit: 50,
      tags: ["continuity-three-conditions", "continuity", "removable"],
      hints: ["g(2) 有定義嗎？是多少？", "x ≠ 2 時先約分，再求極限，跟 g(2) 比。"],
      solution: "g(2) = 3 有定義；x ≠ 2 時 g(x) = x + 2 → 4，極限存在。4 ≠ 3，第三條「極限 = 函數值」不成立。",
      solutionSteps: ["條件一：g(2) = 3，有定義。", "條件二：g(x) = x + 2（x ≠ 2）→ 4，極限存在。", "條件三：4 ≠ 3，不成立 ⟹ 不連續。"],
      verify: { m: "choice", options: [
        { say: "不連續：極限存在但不等於 g(2)", all: [{ v: L("\\frac{x^2-4}{x-2}", 2, "-"), eq: L("\\frac{x^2-4}{x-2}", 2, "+") }, { v: L("\\frac{x^2-4}{x-2}", 2), ne: 3 }] },
        { say: "連續", all: [{ v: L("\\frac{x^2-4}{x-2}", 2), eq: 3 }] },
        { say: "不連續：左右極限不相等", all: [{ v: L("\\frac{x^2-4}{x-2}", 2, "-"), ne: L("\\frac{x^2-4}{x-2}", 2, "+") }] },
        { say: "不連續：極限是 ∞", all: [{ v: ext("\\left|\\frac{x^2-4}{x-2}\\right|", "inf", 2 + 1e-9, 2 + 1e-5), gt: 1e4 }] }
      ] } },
    { id: "cg-1e-003", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 2}\\sqrt{\\frac{x^2+5x-14}{x-2}}",
      answer: "3", timeLimit: 50,
      tags: ["continuity-composition", "continuity", "factoring"],
      hints: ["√ 是連續函數，極限可以穿進根號裡。", "根號裡是 0/0，先因式分解約分。"],
      solution: "根號裡 (x + 7)(x − 2)/(x − 2) = x + 7 → 9。√ 連續，所以極限 = √9 = 3。",
      solutionSteps: ["x² + 5x − 14 = (x + 7)(x − 2)，根號裡 → x + 7 → 9。", "√ 在 9 連續：lim √(…) = √(lim …)。", "= √9 = 3。"] },
    { id: "cg-1e-004", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\lim_{x\\to 1}\\ln\\left(\\frac{x^3-1}{x-1}\\right)",
      answer: "ln(3)", timeLimit: 50,
      tags: ["continuity-composition", "continuity", "factoring"],
      hints: ["ln 在正數上連續，極限可以穿進 ln 裡。", "x³ − 1 用立方差分解。"],
      solution: "(x³ − 1)/(x − 1) = x² + x + 1 → 3。ln 在 3 連續，極限 = ln 3。",
      solutionSteps: ["x³ − 1 = (x − 1)(x² + x + 1)，括號裡 → x² + x + 1 → 3。", "ln 在 3 連續：lim ln(…) = ln(lim …)。", "= ln 3 ≈ 1.0986。"] },
    { id: "cg-1e-005", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=\\frac{x^2+x-6}{x-2}\\text{ 在 }x=2\\text{ 的不連續屬於哪一種？}",
      answers: ["可去", "可去不連續", "removable"],
      canonical: "可去",
      distractors: ["跳躍", "無窮", "振盪"],
      timeLimit: 40,
      tags: ["discontinuity-classify", "removable", "continuity"],
      hints: ["先因式分解分子，看能不能約掉 x − 2。", "約完之後極限存在嗎？"],
      solution: "(x + 3)(x − 2)/(x − 2) = x + 3 → 5，極限存在、只是 f(2) 沒定義，補 f(2) = 5 就連續：可去不連續。",
      solutionSteps: ["x² + x − 6 = (x + 3)(x − 2)。", "x ≠ 2 時 f(x) = x + 3，極限 = 5 存在。", "極限存在但點上沒定義 ⟹ 可去不連續。"],
      verify: { m: "choice", options: [
        { say: "可去", all: [{ v: L("\\frac{x^2+x-6}{x-2}", 2, "-"), eq: L("\\frac{x^2+x-6}{x-2}", 2, "+") }] },
        { say: "跳躍", all: [{ v: L("\\frac{x^2+x-6}{x-2}", 2, "-"), ne: L("\\frac{x^2+x-6}{x-2}", 2, "+") }] },
        { say: "無窮", all: [{ v: ext("\\left|\\frac{x^2+x-6}{x-2}\\right|", "inf", 2 + 1e-9, 2 + 1e-5), gt: 1e4 }] },
        { say: "振盪", all: [{ v: { m: "let", f: "|p-q|", with: { p: V("\\frac{(2+10^{-4})^2+(2+10^{-4})-6}{10^{-4}}"), q: V("\\frac{(2+10^{-6})^2+(2+10^{-6})-6}{10^{-6}}") } }, gt: 0.5 }] }
      ] } },
    { id: "cg-1e-006", topic: "limits", rank: 2, answerKind: "text",
      prompt: "f(x)=\\frac{x+1}{x^2-1}\\text{ 在 }x=1\\text{ 的不連續屬於哪一種？}",
      answers: ["無窮", "無窮不連續", "infinite"],
      canonical: "無窮",
      distractors: ["可去", "跳躍", "振盪"],
      timeLimit: 50,
      tags: ["discontinuity-classify", "continuity", "asymptote"],
      hints: ["先約分：x² − 1 = (x − 1)(x + 1)。", "約完之後在 x = 1 是 0/0 還是 k/0？"],
      solution: "x ≠ ±1 時 f(x) = 1/(x − 1)；在 x = 1 是 1/0，兩側 → ±∞：無窮不連續（垂直漸近線）。（x = −1 那個才是可去。）",
      solutionSteps: ["f(x) = (x + 1)/((x − 1)(x + 1)) = 1/(x − 1)（x ≠ −1）。", "x → 1：1/(x − 1) 的分母 → 0，分子是 1。", "|f| → ∞ ⟹ 無窮不連續。"],
      verify: { m: "choice", options: [
        { say: "無窮", all: [{ v: ext("\\left|\\frac{x+1}{x^2-1}\\right|", "inf", 1 + 1e-9, 1 + 1e-5), gt: 1e4 }, { v: ext("\\left|\\frac{x+1}{x^2-1}\\right|", "inf", 1 - 1e-5, 1 - 1e-9), gt: 1e4 }] },
        { say: "可去", all: [{ v: ext("\\left|\\frac{x+1}{x^2-1}\\right|", "sup", 1 + 1e-9, 1 + 1e-5), lt: 1e3 }] },
        { say: "跳躍", all: [{ v: ext("\\left|\\frac{x+1}{x^2-1}\\right|", "sup", 1 + 1e-9, 1 + 1e-5), lt: 1e3 }] },
        { say: "振盪", all: [{ v: ext("\\frac{x+1}{x^2-1}", "inf", 1 + 1e-9, 1 + 1e-5), lt: 0 }] }
      ] } },
    { id: "cg-1e-007", topic: "limits", rank: 2, answerKind: "text",
      prompt: "f(x)=\\sin\\frac{\\pi}{x-1}\\text{ 在 }x=1\\text{ 的不連續屬於哪一種？}",
      answers: ["振盪", "振盪不連續", "oscillating"],
      canonical: "振盪",
      distractors: ["可去", "跳躍", "無窮"],
      timeLimit: 55,
      tags: ["discontinuity-classify", "continuity", "oscillation"],
      hints: ["x → 1 時 π/(x − 1) 跑到哪裡去？", "sin 在那種時候會一直在 −1 與 1 之間來回。"],
      solution: "x → 1⁺ 時 π/(x − 1) → ∞，sin 在 −1 與 1 之間來回，單側極限都不存在，但函數又有界：振盪不連續。",
      solutionSteps: ["x = 1 + 2/(4k + 1) 時 f = 1；x = 1 + 2/(4k + 3) 時 f = −1。", "兩種點都可以任意靠近 1，單側極限不存在。", "|f| ≤ 1 不會衝到 ∞ ⟹ 振盪不連續。"],
      verify: { m: "choice", options: [
        { say: "振盪", all: [
          { v: { m: "let", f: "|p-q|", with: { p: V("\\sin\\frac{41\\pi}{2}"), q: V("\\sin\\frac{43\\pi}{2}") } }, gt: 1 },
          { v: { m: "let", f: "|p-q|", with: { p: V("\\sin\\frac{401\\pi}{2}"), q: V("\\sin\\frac{403\\pi}{2}") } }, gt: 1 },
          { v: ext("\\left|\\sin\\frac{\\pi}{x-1}\\right|", "sup", 1 + 1e-6, 1 + 1e-3), le: 1 }
        ] },
        { say: "可去", all: [{ v: { m: "let", f: "|p-q|", with: { p: V("\\sin\\frac{401\\pi}{2}"), q: V("\\sin\\frac{403\\pi}{2}") } }, lt: 0.5 }] },
        { say: "跳躍", all: [{ v: { m: "let", f: "|p-q|", with: { p: V("\\sin\\frac{401\\pi}{2}"), q: V("\\sin\\frac{403\\pi}{2}") } }, lt: 0.5 }] },
        { say: "無窮", all: [{ v: ext("\\left|\\sin\\frac{\\pi}{x-1}\\right|", "sup", 1 + 1e-6, 1 + 1e-3), gt: 1e4 }] }
      ] } },
    { id: "cg-1e-008", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\lim_{x\\to 3^-}\\lfloor x\\rfloor",
      answer: "2", timeLimit: 30,
      tags: ["discontinuity-jump", "floor", "one-sided-limit"],
      hints: ["x 比 3 小一點點，例如 2.999，⌊x⌋ 是多少？", "右邊（3.001）是 3，左右不同就是跳躍。"],
      solution: "x 在 (2, 3) 時 ⌊x⌋ = 2，所以左極限 2；右極限 3。兩者不同，⌊x⌋ 在 x = 3 是跳躍不連續。",
      solutionSteps: ["2 ≤ x < 3 時 ⌊x⌋ = 2。", "x → 3⁻：⌊x⌋ 恆為 2，左極限 = 2。", "（右極限 3 ≠ 2，所以 x = 3 是跳躍點。）"] },
    { id: "cg-1e-009", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{設 }f(x)=2x+1\\ (x<1)\\text{、}f(x)=x^2+4\\ (x\\ge 1)\\text{。}f\\text{ 在 }x=1\\text{ 的情形是？}",
      answers: ["左極限 3、右極限 5，跳躍不連續"],
      canonical: "左極限 3、右極限 5，跳躍不連續",
      distractors: ["左極限 3、右極限 5，可去不連續", "左極限 5、右極限 3，跳躍不連續", "左極限 3、右極限 3，連續"],
      timeLimit: 45,
      tags: ["discontinuity-jump", "piecewise", "one-sided-limit"],
      hints: ["左極限用 x < 1 的那段，右極限用 x ≥ 1 的那段。", "兩個單側極限都存在但不相等，是哪一種？"],
      solution: "左：2 + 1 = 3；右：1 + 4 = 5。兩側都存在但不相等，是跳躍不連續（補值救不回來）。",
      solutionSteps: ["左極限：2x + 1 → 3。", "右極限：x² + 4 → 5。", "3 ≠ 5，兩者都有限 ⟹ 跳躍不連續。"],
      verify: { m: "choice", options: [
        { say: "左極限 3、右極限 5，跳躍不連續", all: [{ v: L("2x+1", 1, "-"), eq: 3 }, { v: L("x^2+4", 1, "+"), eq: 5 }, { v: L("2x+1", 1, "-"), ne: L("x^2+4", 1, "+") }] },
        { say: "左極限 3、右極限 5，可去不連續", all: [{ v: L("2x+1", 1, "-"), eq: L("x^2+4", 1, "+") }] },
        { say: "左極限 5、右極限 3，跳躍不連續", all: [{ v: L("2x+1", 1, "-"), eq: 5 }] },
        { say: "左極限 3、右極限 3，連續", all: [{ v: L("x^2+4", 1, "+"), eq: 3 }] }
      ] } },
    { id: "cg-1e-010", topic: "limits", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個函數，可以用中間值定理保證在 }(0,2)\\text{ 內有根？}",
      answers: ["f(x) = x² − 2", "x^2-2"],
      canonical: "f(x) = x² − 2",
      distractors: ["g(x) = 1/(x − 1)（g(0) = −1、g(2) = 1）", "h(x) = x² + 1"],
      timeLimit: 45,
      tags: ["ivt-check-continuity", "ivt", "continuity"],
      hints: ["中間值定理要兩個條件：在 [0, 2] 上連續、兩端異號。", "1/(x − 1) 兩端是異號沒錯，但它在 [0, 2] 上連續嗎？"],
      solution: "x² − 2 連續且 f(0) = −2 < 0 < 2 = f(2)，保證有根（√2）。1/(x − 1) 在 x = 1 斷掉，定理不能用（它其實沒有根）；x² + 1 兩端同號。",
      solutionSteps: ["f(x) = x² − 2：多項式連續，f(0) = −2、f(2) = 2 異號 ⟹ 有根。", "g(x) = 1/(x − 1)：在 x = 1 無定義，不連續，定理不適用（而且 g 從不為 0）。", "h(x) = x² + 1：h(0) = 1、h(2) = 5 同號，定理不保證。"],
      verify: { m: "choice", options: [
        { say: "f(x) = x² − 2", all: [{ v: V("0^2-2"), lt: 0 }, { v: V("2^2-2"), gt: 0 }] },
        { say: "g(x) = 1/(x − 1)（g(0) = −1、g(2) = 1）", all: [{ v: ext("\\left|\\frac{1}{x-1}\\right|", "sup", 1 + 1e-9, 1 + 1e-5), lt: 1e4 }] },
        { say: "h(x) = x² + 1", all: [{ v: V("(0^2+1)(2^2+1)"), lt: 0 }] }
      ] } },
    { id: "cg-1e-011", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=\\frac{1}{x}\\text{ 滿足 }f(-1)=-1<0<1=f(1)\\text{。能用中間值定理斷定 }f\\text{ 在 }(-1,1)\\text{ 有根嗎？}",
      answers: ["不能：f 在 x = 0 不連續，定理的條件不成立", "不能"],
      canonical: "不能：f 在 x = 0 不連續，定理的條件不成立",
      distractors: ["能：兩端異號就一定有根", "能：根就是 x = 0"],
      timeLimit: 40,
      tags: ["ivt-check-continuity", "ivt", "continuity"],
      hints: ["中間值定理的前提是「在閉區間上連續」。", "1/x 在 [−1, 1] 的哪一點有問題？"],
      solution: "1/x 在 x = 0 沒有定義（兩側衝向 ±∞），在 [−1, 1] 上不連續，定理不能用。事實上 1/x 從不等於 0。",
      solutionSteps: ["定理要求 f 在 [−1, 1] 上連續。", "1/x 在 x = 0 無定義，不連續。", "條件不成立，不能斷定；而且 1/x ≠ 0 恆成立，真的沒有根。"],
      verify: { m: "choice", options: [
        { say: "不能：f 在 x = 0 不連續，定理的條件不成立", all: [{ v: ext("\\left|\\frac{1}{x}\\right|", "inf", 1e-9, 1e-5), gt: 1e4 }, { v: ext("\\left|\\frac{1}{x}\\right|", "inf", -1, 1), ge: 1 }] },
        { say: "能：兩端異號就一定有根", all: [{ v: ext("\\left|\\frac{1}{x}\\right|", "inf", -1, 1), lt: 1e-6 }] },
        { say: "能：根就是 x = 0", all: [{ v: ext("\\left|\\frac{1}{x}\\right|", "inf", -1e-5, 1e-5), lt: 1e-6 }] }
      ] } },
    { id: "cg-1e-012", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=x^3+2x-5\\text{，}f(1)=-2<0\\text{、}f(2)=7>0\\text{。二分法先算中點 }f(1.5)\\text{，根落在哪個區間？}",
      answers: ["(1, 1.5)", "(1,1.5)"],
      canonical: "(1, 1.5)",
      distractors: ["(1.5, 2)", "(0, 1)"],
      timeLimit: 45,
      tags: ["ivt-bisection", "ivt", "numerical-method"],
      hints: ["算 f(1.5) 的正負號。", "根在「兩端異號」的那一半。"],
      solution: "f(1.5) = 3.375 + 3 − 5 = 1.375 > 0，跟 f(1) = −2 異號，所以根在 (1, 1.5)。",
      solutionSteps: ["f(1.5) = 1.5³ + 2·1.5 − 5 = 1.375 > 0。", "f(1) < 0 < f(1.5)：左半段兩端異號。", "根在 (1, 1.5)。"],
      verify: { m: "choice", options: [
        { say: "(1, 1.5)", all: [{ v: { m: "root", f: "x^3+2x-5", x0: 1.5 }, gt: 1 }, { v: { m: "root", f: "x^3+2x-5", x0: 1.5 }, lt: 1.5 }] },
        { say: "(1.5, 2)", all: [{ v: { m: "root", f: "x^3+2x-5", x0: 1.5 }, gt: 1.5 }] },
        { say: "(0, 1)", all: [{ v: { m: "root", f: "x^3+2x-5", x0: 1.5 }, lt: 1 }] }
      ] } },
    { id: "cg-1e-013", topic: "limits", rank: 2, answerKind: "text",
      prompt: "f(x)=x^3-2x-2\\text{ 在 }[1,2]\\text{ 上 }f(1)<0<f(2)\\text{。做三次二分法（每次取中點、留下兩端異號的那一半），最後的區間是？}",
      answers: ["(1.75, 1.875)", "(1.75,1.875)"],
      canonical: "(1.75, 1.875)",
      distractors: ["(1.5, 1.75)", "(1.875, 2)", "(1.625, 1.75)"],
      timeLimit: 90,
      tags: ["ivt-bisection", "ivt", "numerical-method"],
      hints: ["第一次中點 1.5，第二次的中點看第一次留下哪一半。", "每次只要正負號，不用算很準。"],
      solution: "f(1.5) = −1.625 < 0 → [1.5, 2]；f(1.75) ≈ −0.141 < 0 → [1.75, 2]；f(1.875) ≈ 0.842 > 0 → [1.75, 1.875]。",
      solutionSteps: ["f(1.5) = 3.375 − 3 − 2 = −1.625 < 0，留 [1.5, 2]。", "f(1.75) = 5.359 − 3.5 − 2 ≈ −0.141 < 0，留 [1.75, 2]。", "f(1.875) ≈ 6.592 − 3.75 − 2 ≈ 0.842 > 0，留 [1.75, 1.875]。"],
      verify: { m: "choice", options: [
        { say: "(1.75, 1.875)", all: [{ v: { m: "root", f: "x^3-2x-2", x0: 1.5 }, gt: 1.75 }, { v: { m: "root", f: "x^3-2x-2", x0: 1.5 }, lt: 1.875 }] },
        { say: "(1.5, 1.75)", all: [{ v: { m: "root", f: "x^3-2x-2", x0: 1.5 }, lt: 1.75 }] },
        { say: "(1.875, 2)", all: [{ v: { m: "root", f: "x^3-2x-2", x0: 1.5 }, gt: 1.875 }] },
        { say: "(1.625, 1.75)", all: [{ v: { m: "root", f: "x^3-2x-2", x0: 1.5 }, lt: 1.75 }] }
      ] } },
    { id: "cg-1e-014", topic: "limits", rank: 1, answerKind: "text",
      prompt: "f(x)=x^2+x\\text{ 在 }[1,3]\\text{ 上連續，}f(1)=2\\text{、}f(3)=12\\text{。中間值定理保證存在 }c\\in(1,3)\\text{ 使 }f(c)=N\\text{ 的是哪一個 }N\\text{？}",
      answers: ["N = 7", "7"],
      canonical: "N = 7",
      distractors: ["N = 1", "N = 13"],
      timeLimit: 40,
      tags: ["ivt-intermediate-value", "ivt", "continuity"],
      hints: ["中間值定理：連續函數會取到 f(1) 與 f(3) 之間的每一個值。", "哪一個 N 落在 2 與 12 之間？"],
      solution: "f 連續，2 < 7 < 12，所以有 c ∈ (1, 3) 使 f(c) = 7（c = (−1 + √29)/2 ≈ 2.19）。1 與 13 不在 2 到 12 之間，定理不保證。",
      solutionSteps: ["定理保證 f 在 (1, 3) 取到 2 與 12 之間的每一個值。", "只有 7 落在 (2, 12)。", "所以 N = 7（實際上 c ≈ 2.19）。"],
      verify: { m: "choice", options: [
        { say: "N = 7", all: [{ v: { m: "root", f: "x^2+x-7", x0: 2 }, gt: 1 }, { v: { m: "root", f: "x^2+x-7", x0: 2 }, lt: 3 }] },
        { say: "N = 1", all: [{ v: { m: "root", f: "x^2+x-1", x0: 2 }, gt: 1 }] },
        { say: "N = 13", all: [{ v: { m: "root", f: "x^2+x-13", x0: 2 }, lt: 3 }] }
      ] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
