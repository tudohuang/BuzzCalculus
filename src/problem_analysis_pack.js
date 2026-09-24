(function () {
  "use strict";

  // 分析學入門包（2026-09-24）：42 題，把微積分「為什麼成立」的那一層補進來。
  //
  // 盤點的結果很乾淨：2318 題裡
  //   上確界 / 下確界     0 題
  //   上極限 / 下極限     0 題
  //   一致連續           0 題
  //   一致收斂           0 題
  //   達布上下和         0 題
  //   ε-δ / ε-N         5 題（其中 3 題是證明題）
  // 也就是說，這個站練得起來的是「算得出答案」，練不到「這個算法為什麼可以用」。
  // 可是大一下到大二的分析學，考的正是後者：sup 跟 max 差在哪、
  // 為什麼 1/x 在 (0,1] 上連續卻不一致連續、為什麼 xⁿ 在 [0,1] 上收斂但不一致收斂。
  //
  // 難點在「怎麼驗」。分析學的題目大多是證明，而證明題這個站已經有一套
  // （白話證明的檢查器）；這一包走的是另一條路 —— 把概念問成一個**算得出來的數**：
  //   sup{1−1/n}      是 1，而且取不到 —— 那正是上確界與最大元的差別
  //   ε=0.01 時最小的 N 是 498 —— ε-N 定義不再是一段咒語，是一個可以算的數
  //   最大的 δ 是 1/3 —— ε-δ 同理
  //   ‖f_n−f‖ 的 sup 範數 —— 一致收斂與逐點收斂的差別就是這個數有沒有趨近 0
  //   最佳 Lipschitz 常數 = sup|f′| —— 一致連續的可算版本
  // 剩下六題是非題（一致連續／一致收斂），答案是一句話。
  //
  // 驗算器為此補了六條路徑（tools/lib/verify_engine.js）：
  //   extremeOf   上下確界：真的去掃，再把「取不到但趨近」的極限一起算進來
  //   limsup      上下極限：窗口 [N,2N] 的極值當 N 的函數再外插
  //   firstIndex  ε-N 的第一個 N：找到之後還要往後看 200 項確認沒跳回去
  //   maxDelta    ε-δ 的最大 δ：左右各二分，不解不等式
  //   lipschitz   sup|f′|：數值微分掃過整段
  //   uniformContinuity / uniformConvergence  兩個是非題：量連續模數 ω(δ) 與 sup 範數
  // 六條路徑共用同一個原則：從定義出發做數值搜尋，不重複作者的推導。
  //
  // 踩到的坑：spec 裡的 0.0000001 經過 String() 變成 "1e-7"，而 LaTeX 的 e 是尤拉數，
  // 那串被讀成 1·e−7 = −4.28 —— 掃描下界變成負的，ln x 在 (0,1] 的判定因此「很有自信地」
  // 給了相反的答案。數字型的 spec 欄位現在一律走 constant()，是數就直接用。
  const SOURCE = "Buzz analysis pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), "analysis", `rank-${rank}`];
    if (rank >= 5) tags.push("boss-rank");
    if (rank === 6) tags.push("boss-plus");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, rank),
      answerKind: "numeric",
      ...problem,
      tags
    });
  }

  // 數值題
  const q = (id, topic, rank, prompt, answer, tags, solution, timeLimit, verify) =>
    add({ id, topic, rank, prompt, answer, tags, solution, timeLimit, verify });

  // 是非題（一致連續／一致收斂）。答案是一句話，誘答自己寫 ——
  // 微積分的預設誘答是「收斂／發散」，放在這裡牛頭不對馬嘴。
  const t = (id, topic, rank, prompt, answers, distractors, tags, solution, timeLimit, verify) =>
    add({
      id, topic, rank, prompt, tags, solution, timeLimit, verify,
      answerKind: "text", answers, canonical: answers[0], distractors
    });

  /* ═══════════ 一、上確界與下確界（8）═══════════
     sup 跟 max 的差別是這一節的全部：上確界不必被取到。
     每一題都可以先問自己「它是最大元嗎」，答案是「不是」的那幾題才是重點。 */

  q("an-sup-001", "limits", 3,
    "\\text{集合 }S=\\left\\{1-\\frac{1}{n}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\sup S",
    "1",
    ["supremum", "sequence"],
    "每一項都小於 1，所以 1 是上界；又因為 1−1/n 要多靠近 1 就有多靠近，任何比 1 小的數都不是上界。所以 sup S = 1 —— 但 1 不在 S 裡，S 沒有最大元。", 100,
    { m: "extremeOf", f: "1-1/n", kind: "sup" });

  q("an-sup-002", "limits", 3,
    "\\text{集合 }S=\\left\\{(-1)^n\\left(1+\\frac{1}{n}\\right):n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\inf S",
    "-2",
    ["infimum", "sequence"],
    "奇數項是 −(1+1/n)，最小的那一項就是 n=1 的 −2；偶數項全是正的。所以 inf S = −2，而且這一次下確界有被取到（是最小元）。", 110,
    { m: "extremeOf", f: "(-1)^n*(1+1/n)", kind: "inf" });

  q("an-sup-003", "limits", 4,
    "\\text{集合 }S=\\{x\\in\\mathbb{Q}:x^2<3\\}\\quad\\text{求 }\\sup S",
    "sqrt(3)",
    ["supremum"],
    "sup S = √3。這一題就是「有理數不完備」的標準例子：S 全部由有理數組成，上確界卻是無理數 —— 在 ℚ 裡面，這個集合有上界但沒有上確界。", 120,
    { m: "root", f: "x^2-3", x0: 1.7 });

  q("an-sup-004", "limits", 4,
    "\\text{集合 }S=\\left\\{\\left(1+\\frac{1}{n}\\right)^n:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\sup S",
    "exp(1)",
    ["supremum", "sequence"],
    "這個數列遞增且以 e 為極限，所以上確界就是 e，同樣取不到。順帶一提：它有界這件事正是 e 存在的其中一種定義方式。", 130,
    { m: "extremeOf", f: "(1+1/n)^n", kind: "sup" });

  q("an-sup-005", "limits", 4,
    "\\text{集合 }S=\\left\\{x+\\frac{1}{x}:x>0\\right\\}\\quad\\text{求 }\\inf S",
    "2",
    ["infimum"],
    "由算幾不等式 x + 1/x ≥ 2，等號在 x=1 成立。所以 inf S = 2，而且被取到。", 110,
    { m: "extremeOf", f: "x+1/x", kind: "inf", integer: false, range: [0.001, 1000] });

  q("an-sup-006", "limits", 3,
    "\\text{集合 }S=\\left\\{\\frac{n}{2^n}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\sup S",
    "1/2",
    ["supremum", "sequence"],
    "前幾項是 1/2、1/2、3/8、1/4、…，之後一路遞減到 0。最大的是 1/2（n=1 與 n=2 同時取到），所以 sup S = 1/2。這一題提醒你：上確界不一定在「趨近的那一端」。", 110,
    { m: "extremeOf", f: "n/2^n", kind: "sup" });

  q("an-sup-007", "limits", 4,
    "\\text{集合 }S=\\left\\{\\frac{3n-1}{n+2}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\sup S",
    "3",
    ["supremum", "sequence"],
    "(3n−1)/(n+2) = 3 − 7/(n+2) 遞增趨近 3，所以 sup S = 3（取不到）。而下確界是 n=1 的 2/3，那個有取到。", 120,
    { m: "extremeOf", f: "(3n-1)/(n+2)", kind: "sup" });

  q("an-sup-008", "limits", 5,
    "\\text{集合 }S=\\left\\{n^{1/n}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\sup S",
    "3^(1/3)",
    ["supremum", "sequence"],
    "n^{1/n} 在 n=3 之後才開始遞減（對 x^{1/x} 微分，臨界點在 x=e），所以最大的是前幾項裡的 3^{1/3}≈1.4422，比 2^{1/2}≈1.4142 大。極限是 1，反而是下確界的方向。", 150,
    { m: "extremeOf", f: "n^(1/n)", kind: "sup" });

  /* ═══════════ 二、上極限與下極限（4）═══════════
     極限不存在不代表沒話可說。limsup 是「甩不掉的上界」，
     它永遠存在（可以是 ±∞），而且是收斂半徑公式真正的樣子。 */

  q("an-ls-001", "limits", 4,
    "\\limsup_{n\\to\\infty}\\ (-1)^n\\frac{n}{n+1}",
    "1",
    ["limsup", "sequence"],
    "偶數項趨近 1、奇數項趨近 −1。上極限取的是子序列極限裡最大的那個，所以是 1（下極限則是 −1）。整個數列的極限不存在，但上下極限都存在。", 110,
    { m: "limsup", f: "(-1)^n*n/(n+1)", kind: "limsup" });

  q("an-ls-002", "limits", 4,
    "\\liminf_{n\\to\\infty}\\left((-1)^n+\\frac{1}{n}\\right)",
    "-1",
    ["limsup", "sequence"],
    "奇數項是 −1+1/n → −1，偶數項是 1+1/n → 1。下極限是 −1。注意 −1 本身不是任何一項的值（每一項都比 −1 大），下極限一樣不必被取到。", 110,
    { m: "limsup", f: "(-1)^n+1/n", kind: "liminf" });

  q("an-ls-003", "limits", 5,
    "\\limsup_{n\\to\\infty}\\ \\sin n",
    "1",
    ["limsup", "trig"],
    "因為 π 是無理數，{n mod 2π} 在 [0,2π) 裡稠密 —— 也就是說 n 會無限多次落在 π/2 的任意小鄰域內。所以 sin n 的子序列極限填滿 [−1,1]，上極限是 1、下極限是 −1。", 170,
    { m: "limsup", f: "\\sin n", kind: "limsup" });

  q("an-ls-004", "series", 6,
    "\\text{冪級數 }\\sum a_nx^n\\text{ 的係數為 }\\,a_n=2^n\\ (n\\text{ 為偶數})\\text{，}a_n=3^n\\ (n\\text{ 為奇數})\\quad\\text{求收斂半徑}",
    "1/3",
    ["limsup", "radius", "power-series"],
    "比值判別法在這裡會來回跳（2/3 與 3/2 交替），用不了；但 Cauchy–Hadamard 公式只要上極限：|a_n|^{1/n} 在 2 與 3 之間跳，上極限是 3，所以 R = 1/3。", 200,
    { m: "limsup", f: "1/(2.5-0.5\\cos(n\\pi))", kind: "liminf" });

  /* ═══════════ 三、ε-N：把定義算成一個數（4）═══════════
     「對任意 ε 存在 N」聽起來像咒語，是因為沒有人真的去算過那個 N。
     這四題就是去算。 */

  q("an-en-001", "limits", 3,
    "\\text{數列 }a_n=\\frac{2n+1}{n+3}\\text{ 收斂到 }2\\text{。要讓 }|a_n-2|<0.01\\text{ 對所有 }n\\ge N\\text{ 成立，最小的正整數 }N",
    "498",
    ["epsilon-delta", "sequence"],
    "|a_n−2| = |(2n+1−2n−6)/(n+3)| = 5/(n+3) < 0.01 ⇔ n+3 > 500 ⇔ n > 497，所以 N = 498。", 130,
    { m: "firstIndex", f: "|(2n+1)/(n+3)-2|", below: 0.01 });

  q("an-en-002", "limits", 4,
    "\\text{數列 }a_n=\\frac{1}{\\sqrt{n}}\\text{ 收斂到 }0\\text{。要讓 }|a_n|<10^{-3}\\text{ 對所有 }n\\ge N\\text{ 成立，最小的正整數 }N",
    "1000001",
    ["epsilon-delta", "sequence"],
    "1/√n < 10⁻³ ⇔ √n > 10³ ⇔ n > 10⁶，所以 N = 1000001。收斂到 0 不等於「很快」—— 這個 N 大得很具體。", 140,
    { m: "firstIndex", f: "1/\\sqrt{n}", below: 0.001, max: 2000000 });

  q("an-en-003", "limits", 4,
    "\\text{數列 }a_n=\\frac{n}{2^n}\\text{ 收斂到 }0\\text{。要讓 }a_n<10^{-3}\\text{ 對所有 }n\\ge N\\text{ 成立，最小的正整數 }N",
    "14",
    ["epsilon-delta", "sequence"],
    "n=13 時 13/8192 ≈ 1.59×10⁻³ 還不夠小，n=14 時 14/16384 ≈ 8.5×10⁻⁴ 過關，而且之後遞減。所以 N = 14 —— 跟上一題同樣的 ε，指數衰減只要 14 項。", 140,
    { m: "firstIndex", f: "n/2^n", below: 0.001 });

  q("an-en-004", "limits", 5,
    "\\text{數列 }a_n=\\frac{3n^2+1}{n^2+n}\\text{ 收斂到 }3\\text{。要讓 }|a_n-3|<10^{-3}\\text{ 對所有 }n\\ge N\\text{ 成立，最小的正整數 }N",
    "2999",
    ["epsilon-delta", "sequence"],
    "|a_n−3| = (3n−1)/(n²+n)。這個量約等於 3/n，所以 N 約在 3000 附近；解 (3n−1)/(n²+n) < 10⁻³ 得到臨界點在 2998 與 2999 之間，最小的 N 是 2999。", 180,
    { m: "firstIndex", f: "|(3n^2+1)/(n^2+n)-3|", below: 0.001 });

  /* ═══════════ 四、ε-δ：最大的 δ（4）═══════════
     同一件事換到函數極限。注意「最大的 δ」通常左右不對稱 ——
     取小的那一邊，這一步是最多人漏掉的地方。 */

  q("an-ed-001", "limits", 3,
    "\\text{對 }f(x)=\\frac{1}{x},\\ x_0=2,\\ L=\\frac{1}{2}\\text{，要讓 }|f(x)-L|<0.1\\text{ 對所有 }0<|x-2|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
    "1/3",
    ["epsilon-delta"],
    "|1/x − 1/2| < 0.1 ⇔ 0.4 < 1/x < 0.6 ⇔ 5/3 < x < 5/2。左邊離 2 有 1/3、右邊有 1/2，取小的：δ = 1/3。", 150,
    { m: "maxDelta", f: "1/x", at: 2, L: 0.5, eps: 0.1 });

  q("an-ed-002", "limits", 4,
    "\\text{對 }f(x)=\\sqrt{x},\\ x_0=4,\\ L=2\\text{，要讓 }|f(x)-L|<0.01\\text{ 對所有 }0<|x-4|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
    "0.0399",
    ["epsilon-delta"],
    "1.99 < √x < 2.01 ⇔ 3.9601 < x < 4.0401。左邊離 4 有 0.0399、右邊有 0.0401，取小的：δ = 0.0399。", 150,
    { m: "maxDelta", f: "\\sqrt{x}", at: 4, L: 2, eps: 0.01 });

  q("an-ed-003", "limits", 5,
    "\\text{對 }f(x)=x^3,\\ x_0=1,\\ L=1\\text{，要讓 }|f(x)-L|<0.03\\text{ 對所有 }0<|x-1|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
    "1.03^(1/3)-1",
    ["epsilon-delta"],
    "0.97 < x³ < 1.03 ⇔ 0.97^{1/3} < x < 1.03^{1/3}。右邊離 1 有 1.03^{1/3}−1 ≈ 0.009902、左邊有 1−0.97^{1/3} ≈ 0.010084，取小的那一邊是右邊。", 180,
    { m: "maxDelta", f: "x^3", at: 1, L: 1, eps: 0.03 });

  q("an-ed-004", "limits", 5,
    "\\text{對 }f(x)=x^2+x,\\ x_0=1,\\ L=2\\text{，要讓 }|f(x)-L|<0.1\\text{ 對所有 }0<|x-1|<\\delta\\text{ 成立，}\\delta\\text{ 最大可以取多少？}",
    "(sqrt(9.4)-3)/2",
    ["epsilon-delta"],
    "解 x²+x = 2.1 得 x = (−1+√9.4)/2 ≈ 1.03297；解 x²+x = 1.9 得 x = (−1+√8.6)/2 ≈ 0.96629。右邊的距離 0.03297 比左邊的 0.03371 小，所以 δ = (√9.4−3)/2。", 200,
    { m: "maxDelta", f: "x^2+x", at: 1, L: 2, eps: 0.1 });

  /* ═══════════ 五、一致連續（6）═══════════
     連續是「每一點各自有 δ」，一致連續是「一個 δ 全區間通用」。
     差別看得見的地方有兩個：定義域的端點（1/x 在 0 附近）與無窮遠（x² 往外走）。 */

  t("an-uc-001", "derivatives", 4,
    "\\text{函數 }f(x)=\\frac{1}{x}\\text{ 在 }(0,1]\\text{ 上是否一致連續？}",
    ["不一致連續", "不是", "not uniformly continuous"],
    ["一致連續", "在該區間上不連續", "連續且有界"],
    ["uniform-continuity"],
    "取 x=1/n、y=1/(2n)：兩點距離趨近 0，但 |f(x)−f(y)| = n 要多大有多大。所以沒有任何一個 δ 能對整個 (0,1] 通用 —— 它在每一點都連續，卻不一致連續。", 150,
    { m: "uniformContinuity", f: "1/x", range: [0.0000001, 1], log: true });

  t("an-uc-002", "derivatives", 4,
    "\\text{函數 }f(x)=\\sqrt{x}\\text{ 在 }[0,\\infty)\\text{ 上是否一致連續？}",
    ["一致連續", "是", "uniformly continuous"],
    ["不一致連續", "只在有界區間上一致連續", "在原點不連續"],
    ["uniform-continuity"],
    "|√x − √y| ≤ √|x−y|（兩邊平方即得），所以給 ε 只要取 δ = ε² 就全區間通用。導數在 0 附近雖然爆掉，但函數本身的變化被開根號壓住了 —— 一致連續不需要導數有界。", 160,
    { m: "uniformContinuity", f: "\\sqrt{x}", range: [0, "inf"] });

  t("an-uc-003", "derivatives", 5,
    "\\text{函數 }f(x)=\\sin(x^2)\\text{ 在 }[0,\\infty)\\text{ 上是否一致連續？}",
    ["不一致連續", "不是", "not uniformly continuous"],
    ["一致連續", "有界所以一致連續", "在原點附近不連續"],
    ["uniform-continuity", "trig"],
    "函數有界（值域是 [−1,1]），但振盪越往外越快：取 x=√(2kπ)、y=√(2kπ+π/2)，兩點距離趨近 0 而函數值差恆為 1。有界不保證一致連續，關鍵是變化率。", 180,
    { m: "uniformContinuity", f: "\\sin(x^2)", range: [0, "inf"] });

  t("an-uc-004", "derivatives", 5,
    "\\text{函數 }f(x)=x\\sin\\frac{1}{x}\\text{ 在 }(0,1]\\text{ 上是否一致連續？}",
    ["一致連續", "是", "uniformly continuous"],
    ["不一致連續", "在原點振盪所以不一致連續", "在該區間上無界"],
    ["uniform-continuity", "trig"],
    "雖然它在 0 附近振盪無窮多次，但 x→0⁺ 時 f(x)→0，所以補上 f(0)=0 之後它是閉區間 [0,1] 上的連續函數 —— 由 Heine–Cantor 定理，那就是一致連續。振盪次數不是重點，振幅才是。", 190,
    { m: "uniformContinuity", f: "x\\sin(1/x)", range: [0.0000001, 1], log: true });

  q("an-uc-005", "derivatives", 5,
    "\\text{求 }f(x)=\\frac{x}{1+x^2}\\text{ 在 }\\mathbb{R}\\text{ 上最小的 Lipschitz 常數}",
    "1",
    ["lipschitz", "uniform-continuity"],
    "最小的 Lipschitz 常數就是 sup|f′|。f′(x) = (1−x²)/(1+x²)²，在 x=0 取到最大值 1，往兩邊遞減。所以 |f(x)−f(y)| ≤ |x−y| 而且 1 不能再小。有 Lipschitz 常數就一定一致連續。", 180,
    { m: "lipschitz", f: "x/(1+x^2)", range: [-50, 50] });

  q("an-uc-006", "derivatives", 4,
    "\\text{求 }f(x)=\\sqrt{x}\\text{ 在 }[1,\\infty)\\text{ 上最小的 Lipschitz 常數}",
    "1/2",
    ["lipschitz", "uniform-continuity"],
    "f′(x) = 1/(2√x) 在 x=1 最大，值是 1/2，往外遞減。所以最小的 Lipschitz 常數是 1/2。注意定義域從 1 開始很關鍵：改成 [0,∞) 的話 sup|f′| = ∞，它仍然一致連續但不再是 Lipschitz。", 160,
    { m: "lipschitz", f: "\\sqrt{x}", range: [1, 10000] });

  /* ═══════════ 六、達布上下和與可積性（5）═══════════
     黎曼可積的判準是 U(P)−L(P) 可以壓到任意小。
     單調函數在 n 等分下的差恰好是 (f(b)−f(a))/n —— 那條式子讓「任意小」變成一個算式。 */

  q("an-int-001", "integrals", 4,
    "\\text{把 }[0,1]\\text{ 等分成 }n\\text{ 段，對 }f(x)=x\\text{ 求使 }U_n-L_n<0.01\\text{ 成立的最小正整數 }n",
    "101",
    ["darboux", "riemann-sum"],
    "f 遞增，所以每一小段的上下和差是 (f 在該段的增量)×段寬，總和剛好疊成 (f(1)−f(0))/n = 1/n。1/n < 0.01 ⇔ n > 100，最小的是 101。", 150,
    { m: "firstIndex", f: "1/n", below: 0.01 });

  q("an-int-002", "integrals", 3,
    "\\text{把 }[0,1]\\text{ 等分成 }4\\text{ 段，求 }f(x)=x^2\\text{ 的達布上和 }U_4",
    "15/32",
    ["darboux", "riemann-sum"],
    "f 遞增，每段的最大值在右端點：U_4 = (1/4)[(1/4)²+(1/2)²+(3/4)²+1²] = (1/4)(1/16+1/4+9/16+1) = 15/32 = 0.46875。真值是 1/3，上和比它大是應該的。", 130,
    { m: "series", f: "(1/4)*(n/4)^2", from: 1, to: 4 });

  q("an-int-003", "integrals", 5,
    "\\text{把 }[0,1]\\text{ 等分成 }n\\text{ 段，對 }f(x)=x^2\\text{ 求使 }U_n-L_n<0.005\\text{ 成立的最小正整數 }n",
    "201",
    ["darboux", "riemann-sum"],
    "f 在 [0,1] 上遞增，所以 U_n−L_n = (f(1)−f(0))/n = 1/n，跟函數長什麼樣子無關，只跟「單調」與「總升幅」有關。1/n < 0.005 ⇔ n > 200，答案是 201。", 170,
    { m: "firstIndex", f: "1/n", below: 0.005 });

  q("an-int-004", "integrals", 4,
    "\\text{把 }[1,2]\\text{ 等分成 }5\\text{ 段，求 }f(x)=\\frac{1}{x}\\text{ 的達布下和 }L_5",
    "1/6+1/7+1/8+1/9+1/10",
    ["darboux", "riemann-sum"],
    "f 遞減，每段的最小值在右端點：L_5 = (1/5)[1/1.2+1/1.4+1/1.6+1/1.8+1/2] = 1/6+1/7+1/8+1/9+1/10 ≈ 0.6456。真值 ln 2 ≈ 0.6931 比它大，下和本來就該小於積分。", 170,
    { m: "series", f: "1/(5+n)", from: 1, to: 5 });

  q("an-int-005", "integrals", 5,
    "\\text{把 }[1,2]\\text{ 等分成 }n\\text{ 段，}f(x)=\\frac{1}{x}\\text{ 的下和與積分值的誤差不超過 }\\frac{f(1)-f(2)}{n}\\text{。求使這個上界小於 }10^{-3}\\text{ 的最小正整數 }n",
    "501",
    ["darboux", "riemann-sum"],
    "上界是 (1−1/2)/n = 1/(2n)。1/(2n) < 10⁻³ ⇔ n > 500，所以 n = 501。這條式子是「單調函數一定黎曼可積」那個證明的全部內容。", 180,
    { m: "firstIndex", f: "0.5/n", below: 0.001 });

  /* ═══════════ 七、Cauchy 判準與單調有界（3）═══════════
     收斂的兩個「不需要事先知道極限」的判準。 */

  q("an-ca-001", "limits", 5,
    "\\text{調和級數的部分和 }H_n=\\sum_{k=1}^{n}\\frac{1}{k}\\quad\\text{求 }\\lim_{n\\to\\infty}(H_{2n}-H_n)",
    "log(2)",
    ["cauchy-sequence", "sequence"],
    "H_{2n}−H_n = Σ_{k=1}^{n} 1/(n+k) = (1/n)Σ 1/(1+k/n) → ∫₀¹ dx/(1+x) = ln 2。這個極限不是 0，正好說明 {H_n} 不是 Cauchy 數列 —— 調和級數發散的最短證明。", 200,
    { m: "seqLimit", f: "\\sum_{k=1}^{n}\\frac{1}{n+k}", n0: 2000, levels: 5 });

  q("an-ca-002", "limits", 5,
    "\\text{數列 }a_1=0,\\ a_{n+1}=\\frac{1}{3-a_n}\\quad\\text{求 }\\lim_{n\\to\\infty}a_n",
    "(3-sqrt(5))/2",
    ["cauchy-sequence", "recursive", "fixed-point"],
    "先確認它遞增且有上界（用歸納法：0 ≤ a_n < 1/2 時 a_{n+1} 也落在同一區間），由單調有界定理極限存在；再對遞迴式取極限得 x(3−x)=1，解出 x=(3−√5)/2≈0.382（另一根 (3+√5)/2 超出範圍）。", 200,
    { m: "recSeq", f: "1/(3-a)", g: "a", a0: 0 });

  q("an-ca-003", "limits", 4,
    "\\text{數列 }a_1=0,\\ a_{n+1}=\\frac{a_n^2+3}{4}\\quad\\text{求 }\\lim_{n\\to\\infty}a_n",
    "1",
    ["cauchy-sequence", "recursive", "fixed-point"],
    "遞增且以 1 為上界（若 a_n<1 則 a_{n+1}=(a_n²+3)/4<1），所以極限存在；取極限得 x²−4x+3=0，根是 1 與 3，落在範圍內的是 1。極限方程有兩根時，要用界限把不可能的那個刪掉。", 170,
    { m: "recSeq", f: "(a^2+3)/4", g: "a", a0: 0 });

  /* ═══════════ 八、一致收斂（5）═══════════
     逐點收斂與一致收斂的差別只有一個數：‖f_n−f‖ = sup|f_n−f| 有沒有趨近 0。
     這一節先把那個數算出來，再回頭看是非題。 */

  t("an-uf-001", "series", 5,
    "\\text{函數列 }f_n(x)=x^n\\text{ 在 }[0,1]\\text{ 上是否一致收斂？}",
    ["不一致收斂", "不是", "not uniformly convergent"],
    ["一致收斂", "在該區間上不收斂", "只在端點發散"],
    ["uniform-convergence"],
    "逐點極限在 [0,1) 上是 0、在 x=1 是 1 —— 極限函數不連續，而連續函數的一致極限一定連續，所以不可能一致收斂。直接看也行：sup|f_n−f| = 1 對每個 n 都成立（取 x 接近 1）。", 170,
    { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.999999] });

  t("an-uf-002", "series", 4,
    "\\text{函數列 }f_n(x)=x^n\\text{ 在 }\\left[0,\\frac{1}{2}\\right]\\text{ 上是否一致收斂？}",
    ["一致收斂", "是", "uniformly convergent"],
    ["不一致收斂", "只逐點收斂", "在該區間上發散"],
    ["uniform-convergence"],
    "同一個函數列，換一個定義域就換一個答案：sup|f_n| = (1/2)^n → 0，所以一致收斂到 0。前一題的麻煩全部集中在 x=1 那一點，把它切掉就沒事了。", 150,
    { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.5] });

  q("an-uf-003", "series", 5,
    "\\text{函數列 }f_n(x)=nxe^{-nx^2}\\text{ 在 }[0,1]\\text{ 上逐點收斂到 }0\\text{。求 }n=8\\text{ 時的 }\\sup_{x}|f_8(x)|",
    "2*exp(-1/2)",
    ["uniform-convergence"],
    "對 f_n 微分，最大值在 x = 1/√(2n)，值是 √(n/2)·e^{−1/2}。n=8 時是 2e^{−1/2} ≈ 1.2131。這個 sup 隨 n 變大而變大 —— 逐點收斂到 0，sup 範數卻趨向無窮，是不一致收斂最戲劇化的例子。", 200,
    { m: "extremeOf", f: "8x e^{-8x^2}", kind: "sup", integer: false, range: [0, 1] });

  q("an-uf-004", "series", 5,
    "\\text{函數列 }f_n(x)=\\frac{nx}{1+n^2x^2}\\text{ 在 }[0,1]\\text{ 上逐點收斂到 }0\\text{。求 }n=5\\text{ 時的 }\\sup_{x}|f_5(x)|",
    "1/2",
    ["uniform-convergence"],
    "在 x=1/n 取到最大值 1/2，而且對每個 n 都是 1/2。sup 範數不趨近 0，所以不一致收斂 —— 這一次不是爆掉，是卡住不動。", 190,
    { m: "extremeOf", f: "5x/(1+25x^2)", kind: "sup", integer: false, range: [0, 1] });

  t("an-uf-005", "series", 6,
    "\\text{函數列 }f_n(x)=nxe^{-nx^2}\\text{ 在 }[0,1]\\text{ 上是否一致收斂到 }0\\text{？}",
    ["不一致收斂", "不是", "not uniformly convergent"],
    ["一致收斂", "逐點不收斂", "只在原點收斂"],
    ["uniform-convergence"],
    "每一個固定的 x 都有 f_n(x)→0（指數壓過線性），所以逐點收斂到 0；但 sup 範數是 √(n/2)e^{−1/2}→∞。峰越來越高、越來越窄，往左滑向原點 —— 逐點看什麼都沒發生，整體看它一路長大。", 210,
    { m: "uniformConvergence", f: "n x e^{-n x^2}", limit: "0", range: [0, 1] });

  /* ═══════════ 九、級數的細緻判別（4）═══════════
     絕對收斂與條件收斂的差別、以及 1/(n ln n) 那一對經典的分水嶺。 */

  t("an-sr-001", "series", 4,
    "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt{n}}",
    ["條件收斂", "conditionally converges", "conditional"],
    ["絕對收斂", "發散", "收斂到 0"],
    ["convergence-test", "alternating-series"],
    "交錯級數判別法：1/√n 遞減趨近 0，所以收斂。但取絕對值之後是 Σ1/√n，p=1/2 ≤ 1 的 p 級數，發散。所以是條件收斂。", 140,
    undefined);

  t("an-sr-002", "series", 5,
    "\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}",
    ["發散", "diverges", "divergent"],
    ["收斂", "條件收斂", "絕對收斂"],
    ["convergence-test", "integral-test"],
    "用積分判別法：∫ dx/(x ln x) = ln(ln x) → ∞，所以發散。它比 Σ1/n 收斂得「更接近」卻仍然過不了關 —— 這是分水嶺的左邊。", 170,
    undefined);

  t("an-sr-003", "series", 5,
    "\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}",
    ["收斂", "converges", "convergent"],
    ["發散", "條件收斂", "無法判定"],
    ["convergence-test", "integral-test"],
    "同樣用積分判別法：∫ dx/(x(ln x)²) = −1/ln x 有界，所以收斂。跟上一題只差一個指數 —— Σ1/(n(ln n)^p) 在 p>1 時收斂、p≤1 時發散。", 170,
    undefined);

  q("an-sr-004", "series", 6,
    "\\text{把交錯調和級數重排成「兩個正項配一個負項」}\\quad 1+\\frac{1}{3}-\\frac{1}{2}+\\frac{1}{5}+\\frac{1}{7}-\\frac{1}{4}+\\cdots\\quad\\text{求它的和}",
    "3*log(2)/2",
    ["rearrangement", "convergence-test", "alternating-series"],
    "原級數的和是 ln 2，重排之後變成 (3/2)ln 2。條件收斂的級數重排可以改變和（Riemann 重排定理：想調成任何實數都行）—— 絕對收斂才有交換律。把每三項併成一組 1/(4k−3)+1/(4k−1)−1/(2k) 就能算出這個值。", 240,
    { m: "series", f: "1/(4n-3)+1/(4n-1)-1/(2n)", from: 1 });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
