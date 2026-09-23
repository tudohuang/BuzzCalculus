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
