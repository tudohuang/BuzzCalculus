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


/* ═══════════════════════════════════════════════════════════════
   泰勒餘項與誤差上界（2026-09-25）：30 題。

   盤點：帶 taylor 標籤的題目有 146 題，但提到「餘項」或「誤差上界」的只有 4 題，
   而且其中兩題是這個月剛加的。也就是說，這個站練得起來「把展開式寫出來」，
   練不到「這個近似到底準不準」—— 可是後者才是泰勒定理的內容。
   展開式本身只是代數，餘項才是定理。

   四節，刻意照這個順序：
     多項式的值   7 ── 先把 T_n 算對（連這個都錯的話，後面的誤差都沒意義）
     實際誤差     8 ── |f(x) − T_n(x)| 真正是多少
     餘項上界     9 ── 拉格朗日餘項 M|x−a|ⁿ⁺¹/(n+1)!，M 取實際最大值
     要展到幾階   6 ── 反過來問：給定精度，n 要多少
   第二節與第三節故意配成對（同一個 f、同一個 n、同一個 x）：
   實際誤差 0.218 對上上界 0.453 —— 上界是「保證不會更糟」，不是「就是這麼多」。
   很多人把這兩件事當成同一個數，是因為從來沒有把它們並排算過。

   驗算器為此補四條路徑（taylorValue / taylorError / lagrangeBound / taylorTerms）。
   共同底層是「在 a 附近用 Chebyshev 取樣解出所有階的係數」：重複數值微分每微一次
   放大一次雜訊，四階以後就不能看；Chebyshev 一次取樣到九階仍然穩。
   取樣半徑要蓋得住代入點 —— r=0.4 而 x=1 時，sin 的九階係數差了 3e-5，
   「要展到幾階」那一節會整個算錯（實際踩到，第一版跑出「十二階還不夠」）。
   lagrangeBound 的 M 是數值掃出來的最大值，不是題目給的 —— 所以「M 要取多少」
   這一步也在驗算範圍內。 */
(function () {
  "use strict";

  const SOURCE = "Buzz 泰勒餘項包 2026-09";
  const problems = [];

  const add = (id, rank, prompt, answer, tags, solution, timeLimit, verify) => {
    const all = [...tags, "taylor", `rank-${rank}`];
    if (rank >= 5) all.push("boss-rank");
    if (rank === 6) all.push("boss-plus");
    problems.push({
      source: SOURCE, id, rank, difficulty: Math.min(4, rank), topic: "series",
      answerKind: "numeric", prompt, answer, solution, timeLimit, verify, tags: all
    });
  };

  /* ── 一、泰勒多項式的值（7）──────────────────────────────── */

  add("tr-val-001", 3,
    "\\text{設 }T_3\\text{ 為 }e^x\\text{ 在 }x=0\\text{ 的三階泰勒多項式}\\quad\\text{求 }T_3(1)",
    "8/3", ["taylor-polynomial"],
    "T_3(x)=1+x+x²/2+x³/6，代 x=1 得 1+1+1/2+1/6 = 8/3 ≈ 2.667。真值 e≈2.718，差了 0.052。", 90,
    { m: "taylorValue", f: "e^x", a: 0, n: 3, at: 1 });

  add("tr-val-002", 3,
    "\\text{設 }T_5\\text{ 為 }\\sin x\\text{ 在 }x=0\\text{ 的五階泰勒多項式}\\quad\\text{求 }T_5(1)",
    "101/120", ["taylor-polynomial", "trig"],
    "T_5(x)=x−x³/6+x⁵/120，代 1 得 1−1/6+1/120 = 101/120 ≈ 0.84167。真值 sin 1 ≈ 0.84147。", 90,
    { m: "taylorValue", f: "\\sin x", a: 0, n: 5, at: 1 });

  add("tr-val-003", 3,
    "\\text{設 }T_4\\text{ 為 }\\cos x\\text{ 在 }x=0\\text{ 的四階泰勒多項式}\\quad\\text{求 }T_4\\!\\left(\\frac{1}{2}\\right)",
    "337/384", ["taylor-polynomial", "trig"],
    "T_4(x)=1−x²/2+x⁴/24，代 1/2 得 1−1/8+1/384 = 337/384 ≈ 0.87760。cos 0.5 ≈ 0.87758，四階已經準到小數第四位。", 100,
    { m: "taylorValue", f: "\\cos x", a: 0, n: 4, at: 0.5 });

  add("tr-val-004", 4,
    "\\text{設 }T_3\\text{ 為 }\\ln(1+x)\\text{ 在 }x=0\\text{ 的三階泰勒多項式}\\quad\\text{求 }T_3\\!\\left(\\frac{1}{2}\\right)",
    "5/12", ["taylor-polynomial", "log"],
    "T_3(x)=x−x²/2+x³/3，代 1/2 得 1/2−1/8+1/24 = 5/12 ≈ 0.4167。真值 ln 1.5 ≈ 0.4055 —— 這個級數收斂慢，三階還差 0.011。", 110,
    { m: "taylorValue", f: "\\ln(1+x)", a: 0, n: 3, at: 0.5 });

  add("tr-val-005", 3,
    "\\text{設 }T_2\\text{ 為 }\\sqrt{1+x}\\text{ 在 }x=0\\text{ 的二階泰勒多項式}\\quad\\text{求 }T_2(0.2)",
    "219/200", ["taylor-polynomial"],
    "T_2(x)=1+x/2−x²/8，代 0.2 得 1+0.1−0.005 = 1.095 = 219/200。√1.2 ≈ 1.09545，兩階就準到小數第三位。", 100,
    { m: "taylorValue", f: "\\sqrt{1+x}", a: 0, n: 2, at: 0.2 });

  add("tr-val-006", 4,
    "\\text{設 }T_3\\text{ 為 }\\frac{1}{1-x}\\text{ 在 }x=0\\text{ 的三階泰勒多項式}\\quad\\text{求 }T_3(0.2)",
    "156/125", ["taylor-polynomial", "geometric-series"],
    "這裡的泰勒多項式就是等比級數的部分和：T_3=1+x+x²+x³，代 0.2 得 1.248 = 156/125。真值 1/0.8 = 1.25。", 100,
    { m: "taylorValue", f: "1/(1-x)", a: 0, n: 3, at: 0.2 });

  add("tr-val-007", 4,
    "\\text{設 }T_4\\text{ 為 }e^{-x^2}\\text{ 在 }x=0\\text{ 的四階泰勒多項式}\\quad\\text{求 }T_4\\!\\left(\\frac{1}{2}\\right)",
    "25/32", ["taylor-polynomial", "composition"],
    "把 e^u 的展開代 u=−x²：T_4(x)=1−x²+x⁴/2，代 1/2 得 1−1/4+1/32 = 25/32 = 0.78125。真值 e^{−0.25} ≈ 0.7788。", 120,
    { m: "taylorValue", f: "e^{-x^2}", a: 0, n: 4, at: 0.5 });

  /* ── 二、實際誤差（8）────────────────────────────────────── */

  add("tr-err-001", 4,
    "\\text{求 }e^x\\text{ 在 }x=0\\text{ 展開的三階泰勒多項式在 }x=1\\text{ 的實際誤差 }|e-T_3(1)|",
    "exp(1)-8/3", ["error-bound"],
    "e − 8/3 ≈ 2.71828 − 2.66667 = 0.05162。下一節會算同一個設定的上界 e/24 ≈ 0.11326 —— 上界大約是實際誤差的兩倍。", 130,
    { m: "taylorError", f: "e^x", a: 0, n: 3, at: 1 });

  add("tr-err-002", 4,
    "\\text{求 }\\sin x\\text{ 在 }x=0\\text{ 展開的三階泰勒多項式在 }x=\\frac{1}{2}\\text{ 的實際誤差}",
    "sin(1/2)-23/48", ["error-bound", "trig"],
    "T_3(1/2)=1/2−1/48 = 23/48 ≈ 0.479167，sin 0.5 ≈ 0.479426，差 0.000259。離展開點越近誤差掉得越快（差距是 x⁵ 級的）。", 140,
    { m: "taylorError", f: "\\sin x", a: 0, n: 3, at: 0.5 });

  add("tr-err-003", 4,
    "\\text{求 }\\max_{0\\le x\\le 1/2}\\left|\\cos x-\\left(1-\\frac{x^2}{2}\\right)\\right|",
    "cos(1/2)-7/8", ["error-bound", "trig"],
    "差值在 [0,1/2] 上遞增（餘項是 x⁴/24 級的正量），最大在端點：cos 0.5 − 0.875 ≈ 0.002583。", 150,
    { m: "taylorError", f: "\\cos x", a: 0, n: 2, range: [0, 0.5] });

  add("tr-err-004", 4,
    "\\text{求 }\\ln(1+x)\\text{ 在 }x=0\\text{ 展開的二階泰勒多項式在 }x=\\frac{1}{2}\\text{ 的實際誤差}",
    "log(3/2)-3/8", ["error-bound", "log"],
    "T_2(1/2)=1/2−1/8 = 3/8 = 0.375，ln 1.5 ≈ 0.40546，差 0.03047。跟 sin 那一題比：同樣是二、三階，這裡的誤差大了一百倍 —— 收斂速度差很多。", 150,
    { m: "taylorError", f: "\\ln(1+x)", a: 0, n: 2, at: 0.5 });

  add("tr-err-005", 4,
    "\\text{求 }\\frac{1}{1-x}\\text{ 在 }x=0\\text{ 展開的三階泰勒多項式在 }x=0.2\\text{ 的實際誤差}",
    "1/500", ["error-bound", "geometric-series"],
    "等比級數的尾巴可以直接加起來：誤差 = x⁴/(1−x) = 0.0016/0.8 = 0.002 = 1/500。這是少數能把餘項寫成封閉式的例子。", 150,
    { m: "taylorError", f: "1/(1-x)", a: 0, n: 3, at: 0.2 });

  add("tr-err-006", 5,
    "\\text{求 }\\max_{-1/2\\le x\\le 1/2}\\left|e^x-\\left(1+x+\\frac{x^2}{2}\\right)\\right|",
    "exp(1/2)-13/8", ["error-bound"],
    "兩個端點都要算：左端 |e^{−0.5}−0.625| ≈ 0.01847，右端 |e^{0.5}−1.625| ≈ 0.02372。右邊大，所以答案是 e^{1/2}−13/8。對稱區間不代表誤差對稱。", 180,
    { m: "taylorError", f: "e^x", a: 0, n: 2, range: [-0.5, 0.5] });

  add("tr-err-007", 5,
    "\\text{求 }\\sqrt{1+x}\\text{ 在 }x=0\\text{ 展開的二階泰勒多項式在 }x=0.2\\text{ 的實際誤差}",
    "sqrt(6/5)-219/200", ["error-bound"],
    "√1.2 − 1.095 ≈ 1.0954451 − 1.095 = 0.0004451。二階就到小數第四位 —— 這也是為什麼工程上算 √ 常常只展到二階。", 170,
    { m: "taylorError", f: "\\sqrt{1+x}", a: 0, n: 2, at: 0.2 });

  add("tr-err-008", 5,
    "\\text{求 }\\arctan x\\text{ 在 }x=0\\text{ 展開的三階泰勒多項式在 }x=\\frac{1}{2}\\text{ 的實際誤差}",
    "atan(1/2)-11/24", ["error-bound"],
    "T_3(x)=x−x³/3，代 1/2 得 11/24 ≈ 0.458333；arctan 0.5 ≈ 0.463648，差 0.005314。下一項是 x⁵/5 = 0.00625，跟實際誤差同一個量級 —— 交錯級數的誤差界在這裡很準。", 180,
    { m: "taylorError", f: "\\arctan x", a: 0, n: 3, at: 0.5 });

  /* ── 三、拉格朗日餘項的上界（9）──────────────────────────────
     一律取 M 為 |f⁽ⁿ⁺¹⁾| 在展開點與代入點之間的**實際最大值**（不是課本常用的粗略 1）。
     這樣「M 要取多少」也是題目的一部分，而不是背一個數。 */

  add("tr-bnd-001", 4,
    "\\text{用拉格朗日餘項估 }e^x\\text{ 的二階泰勒多項式在 }x=1\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(3)}|\\text{ 在 }[0,1]\\text{ 上的最大值）}",
    "exp(1)/6", ["error-bound", "lagrange-remainder"],
    "f⁽³⁾=e^x 在 [0,1] 的最大值是 e，餘項界 = e·1³/3! = e/6 ≈ 0.4530。實際誤差是 e−2.5 ≈ 0.2183 —— 上界大了約一倍，但它保證了「不會更糟」。", 160,
    { m: "lagrangeBound", f: "e^x", a: 0, n: 2, at: 1 });

  add("tr-bnd-002", 4,
    "\\text{用拉格朗日餘項估 }e^x\\text{ 的三階泰勒多項式在 }x=1\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(4)}|\\text{ 在 }[0,1]\\text{ 上的最大值）}",
    "exp(1)/24", ["error-bound", "lagrange-remainder"],
    "e·1⁴/4! = e/24 ≈ 0.1133。多展一階，上界掉了四倍（分母多乘一個 4）。", 160,
    { m: "lagrangeBound", f: "e^x", a: 0, n: 3, at: 1 });

  add("tr-bnd-003", 4,
    "\\text{用拉格朗日餘項估 }\\sin x\\text{ 的三階泰勒多項式在 }x=1\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(4)}|\\text{ 在 }[0,1]\\text{ 上的最大值）}",
    "sin(1)/24", ["error-bound", "lagrange-remainder", "trig"],
    "f⁽⁴⁾=sin x，在 [0,1] 的最大值是 sin 1 ≈ 0.8415，所以界是 sin(1)/24 ≈ 0.03506。課本常直接取 M=1 得 1/24 ≈ 0.04167 —— 那也是對的上界，只是鬆一點。", 180,
    { m: "lagrangeBound", f: "\\sin x", a: 0, n: 3, at: 1 });

  add("tr-bnd-004", 5,
    "\\text{用拉格朗日餘項估 }\\ln(1+x)\\text{ 的二階泰勒多項式在 }x=\\frac{1}{2}\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(3)}|\\text{ 在 }[0,1/2]\\text{ 上的最大值）}",
    "1/24", ["error-bound", "lagrange-remainder", "log"],
    "f⁽³⁾=2/(1+x)³ 在 x=0 最大，M=2。界 = 2·(1/2)³/3! = 1/24 ≈ 0.0417。實際誤差 0.0305，同一個量級。", 190,
    { m: "lagrangeBound", f: "\\ln(1+x)", a: 0, n: 2, at: 0.5 });

  add("tr-bnd-005", 4,
    "\\text{用拉格朗日餘項估 }e^{-x}\\text{ 的二階泰勒多項式在 }x=\\frac{1}{2}\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(3)}|\\text{ 在 }[0,1/2]\\text{ 上的最大值）}",
    "1/48", ["error-bound", "lagrange-remainder"],
    "f⁽³⁾=−e^{−x}，絕對值在 x=0 最大，M=1。界 = 1·(1/2)³/6 = 1/48 ≈ 0.0208。", 160,
    { m: "lagrangeBound", f: "e^{-x}", a: 0, n: 2, at: 0.5 });

  add("tr-bnd-006", 5,
    "\\text{用拉格朗日餘項估 }\\cos x\\text{ 的二階泰勒多項式在 }x=0.3\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(3)}|\\text{ 在 }[0,0.3]\\text{ 上的最大值）}",
    "sin(3/10)*9/2000", ["error-bound", "lagrange-remainder", "trig"],
    "f⁽³⁾=sin x，在 [0,0.3] 遞增，M=sin 0.3 ≈ 0.2955。界 = M·0.3³/6 = M·0.0045 ≈ 0.00133。取 M=1 會得到 0.0045，鬆了三倍多 —— 在小區間上算實際的 M 值得。", 200,
    { m: "lagrangeBound", f: "\\cos x", a: 0, n: 2, at: 0.3 });

  add("tr-bnd-007", 5,
    "\\text{用拉格朗日餘項估 }\\sqrt{1+x}\\text{ 的一階泰勒多項式在 }x=0.2\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f''|\\text{ 在 }[0,0.2]\\text{ 上的最大值）}",
    "1/200", ["error-bound", "lagrange-remainder"],
    "f''=−(1/4)(1+x)^{−3/2}，絕對值在 x=0 最大，M=1/4。界 = (1/4)(0.2)²/2 = 0.005 = 1/200。一階泰勒多項式就是線性近似，這個界就是線性近似的誤差界。", 190,
    { m: "lagrangeBound", f: "\\sqrt{1+x}", a: 0, n: 1, at: 0.2 });

  add("tr-bnd-008", 5,
    "\\text{用拉格朗日餘項估 }\\frac{1}{1-x}\\text{ 的三階泰勒多項式在 }x=0.2\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(4)}|\\text{ 在 }[0,0.2]\\text{ 上的最大值）}",
    "5/1024", ["error-bound", "lagrange-remainder", "geometric-series"],
    "f⁽⁴⁾=24/(1−x)⁵ 在 x=0.2 最大，M=24/0.8⁵ = 73.24。界 = M·0.2⁴/24 ≈ 0.004883 = 5/1024。實際誤差 0.002，上界大約兩倍。", 210,
    { m: "lagrangeBound", f: "1/(1-x)", a: 0, n: 3, at: 0.2, r: 0.25 });

  add("tr-bnd-009", 6,
    "\\text{用拉格朗日餘項估 }e^x\\text{ 在 }x=1\\text{ 展開的二階泰勒多項式在 }x=1.5\\text{ 的誤差上界}\\quad\\text{（}M\\text{ 取 }|f^{(3)}|\\text{ 在 }[1,1.5]\\text{ 上的最大值）}",
    "exp(3/2)/48", ["error-bound", "lagrange-remainder"],
    "展開點不是 0 的版本：M = e^{1.5}（在右端最大），界 = e^{1.5}·(0.5)³/6 = e^{1.5}/48 ≈ 0.0934。注意 |x−a| 是 0.5 不是 1.5 —— 距離要從展開點量。", 230,
    { m: "lagrangeBound", f: "e^x", a: 1, n: 2, at: 1.5 });

  /* ── 四、要展到幾階（6）──────────────────────────────────── */

  add("tr-num-001", 5,
    "\\text{要讓 }e^x\\text{ 在 }x=0\\text{ 展開的泰勒多項式在整個 }[0,1]\\text{ 上誤差小於 }10^{-3}\\text{，最小的階數 }n",
    "6", ["error-bound", "lagrange-remainder"],
    "誤差界 e/(n+1)!：n=5 給 e/720 ≈ 0.0038 還不夠，n=6 給 e/5040 ≈ 0.00054 過關。所以 n=6。", 200,
    { m: "taylorTerms", f: "e^x", a: 0, range: [0, 1], eps: 0.001 });

  add("tr-num-002", 5,
    "\\text{要讓 }e^x\\text{ 在 }x=0\\text{ 展開的泰勒多項式在整個 }[0,1]\\text{ 上誤差小於 }10^{-4}\\text{，最小的階數 }n",
    "7", ["error-bound", "lagrange-remainder"],
    "n=6 的界是 5.4×10⁻⁴，n=7 是 6.7×10⁻⁵。精度要求嚴十倍，只多一階 —— 階乘長得比要求快。", 200,
    { m: "taylorTerms", f: "e^x", a: 0, range: [0, 1], eps: 0.0001 });

  add("tr-num-003", 6,
    "\\text{要讓 }\\sin x\\text{ 在 }x=0\\text{ 展開的泰勒多項式在整個 }[0,1]\\text{ 上誤差小於 }10^{-6}\\text{，最小的階數 }n",
    "9", ["error-bound", "lagrange-remainder", "trig"],
    "sin 的展開只有奇次項，所以 n=8 跟 n=7 是同一個多項式。誤差界 1/(n+1)!：n=7 給 1/40320 ≈ 2.5×10⁻⁵，n=9 給 1/3628800 ≈ 2.8×10⁻⁷ 才過關。", 240,
    { m: "taylorTerms", f: "\\sin x", a: 0, range: [0, 1], eps: 0.000001 });

  add("tr-num-004", 5,
    "\\text{要讓 }\\cos x\\text{ 在 }x=0\\text{ 展開的泰勒多項式在整個 }\\left[0,\\frac{\\pi}{4}\\right]\\text{ 上誤差小於 }10^{-4}\\text{，最小的階數 }n",
    "6", ["error-bound", "lagrange-remainder", "trig"],
    "區間右端 π/4 ≈ 0.785，誤差界 (π/4)^{n+1}/(n+1)!：n=5 給 3.3×10⁻⁴、n=6 給 3.7×10⁻⁵。區間縮小比多展一階更省力 —— 這就是查表法把角度先化到第一象限的理由。", 220,
    { m: "taylorTerms", f: "\\cos x", a: 0, range: [0, 0.7853981634], eps: 0.0001 });

  add("tr-num-005", 4,
    "\\text{要讓 }\\ln(1+x)\\text{ 在 }x=0\\text{ 展開的泰勒多項式在 }x=\\frac{1}{2}\\text{ 誤差小於 }10^{-2}\\text{，最小的階數 }n",
    "4", ["error-bound", "log"],
    "這裡的餘項就是交錯級數的第一個被丟掉的項 (1/2)^{n+1}/(n+1)：n=3 給 0.0156 不夠，n=4 給 0.00625 過關。", 190,
    { m: "taylorTerms", f: "\\ln(1+x)", a: 0, at: 0.5, eps: 0.01 });

  add("tr-num-006", 5,
    "\\text{要讓 }\\ln(1+x)\\text{ 在 }x=0\\text{ 展開的泰勒多項式在 }x=\\frac{1}{2}\\text{ 誤差小於 }10^{-3}\\text{，最小的階數 }n",
    "6", ["error-bound", "log"],
    "n=5 給 (1/2)⁶/6 ≈ 0.0026、n=6 給 (1/2)⁷/7 ≈ 0.0011，而實際誤差比界再小一點，n=6 剛好過關。跟 e^x 比：同樣要 10⁻³，這裡也要六階，但每一階只換到兩倍的精度。", 210,
    { m: "taylorTerms", f: "\\ln(1+x)", a: 0, at: 0.5, eps: 0.001 });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();


/* ═══════════════════════════════════════════════════════════════
   ε-δ 挑戰（2026-09-25）：14 題，新的作答形式 `epsilon`。

   為什麼要做一個新題型而不是再出十題計算題：
   「對任意 ε 存在 δ」這句話，學生背得出來、也考得過，但多數人從來沒有
   真的找過一個 δ。這一題型把量詞的順序做成遊戲規則 ——
     系統先給 ε（畫成水平帶 L±ε），你拖 δ（垂直帶 x₀±δ），
     曲線在垂直帶裡的那一段必須整段落在水平帶內；過關之後 ε 縮小，再來一次。
   三關全過才算答對。那正是 ∀ε 的意思：一次成功不算，每一個 ε 都要行。

   題目的挑法有兩個原則：
     1. 前四題是線性與二次，δ 跟 ε 的關係看得出來（δ=ε/3、δ≈ε/4），
        先讓人相信「這件事真的可以算」。
     2. 後面故意放難算的：1/x 的 δ 兩側不對稱、√x 在 0 附近只有單側、
        sin(1/x) 的極限根本不存在（那一題三關必然卡住 —— 卡住就是答案）。
   每一題都附 verify: maxDelta，所以「最嚴的那一關到底有沒有解」由驗算器算，
   不是作者說有就有。 */
(function () {
  "use strict";

  const SOURCE = "Buzz ε-δ 挑戰 2026-09";
  const problems = [];

  const add = (id, rank, topic, prompt, spec, window, answer, tags, solution, timeLimit, verify) => {
    const all = [...tags, "epsilon-delta", `rank-${rank}`];
    if (rank >= 5) all.push("boss-rank");
    if (rank === 6) all.push("boss-plus");
    problems.push({
      source: SOURCE, id, rank, topic, difficulty: Math.min(4, rank),
      answerKind: "epsilon", prompt, epsilon: spec, graph: { window }, answer,
      solution, timeLimit, verify, tags: all
    });
  };

  const ask = (fLabel, at, limit) =>
    `\\text{挑戰 }\\lim_{x\\to ${at}}${fLabel}=${limit}\\text{：系統給 }\\varepsilon\\text{，你找一個 }\\delta\\quad\\text{（三關）}`;

  add("ep-001", 3, "limits",
    ask("(3x-1)", 2, 5),
    { f: "3*x-1", at: 2, limit: 5, levels: [0.6, 0.3, 0.06], maxDelta: 0.5 },
    [1.2, 2.8, 3.6, 6.4], "0.02",
    ["epsilon-game"],
    "|3x−1−5| = 3|x−2| < ε 只要 δ ≤ ε/3。這一題的重點是看出 δ 可以「跟著 ε 算」——三關的答案分別是 0.2、0.1、0.02（取到邊界以下就好）。", 150,
    { m: "maxDelta", f: "3x-1", at: 2, L: 5, eps: 0.06 });

  add("ep-002", 3, "limits",
    ask("(2x+1)", 1, 3),
    { f: "2*x+1", at: 1, limit: 3, levels: [0.8, 0.4, 0.1], maxDelta: 0.6 },
    [0.2, 1.8, 1.4, 4.6], "0.05",
    ["epsilon-game"],
    "|2x+1−3| = 2|x−1|，所以 δ = ε/2 就夠。斜率越大，同一個 ε 需要的 δ 越小 —— 這就是 δ 跟斜率成反比的意思。", 140,
    { m: "maxDelta", f: "2x+1", at: 1, L: 3, eps: 0.1 });

  add("ep-003", 4, "limits",
    ask("x^2", 3, 9),
    { f: "x^2", at: 3, limit: 9, levels: [1.2, 0.6, 0.12], maxDelta: 0.5 },
    [2.2, 3.8, 6.5, 11.5], "0.0199338",
    ["epsilon-game"],
    "|x²−9| = |x−3||x+3|，靠近 3 時 |x+3| ≈ 6，所以 δ ≈ ε/6。精確解是 δ = √(9+ε)−3（右側比左側窄，取小的那邊）。", 170,
    { m: "maxDelta", f: "x^2", at: 3, L: 9, eps: 0.12 });

  add("ep-004", 4, "limits",
    ask("(x^2+x)", 1, 2),
    { f: "x^2+x", at: 1, limit: 2, levels: [0.9, 0.45, 0.09], maxDelta: 0.5 },
    [0.4, 1.6, 0.8, 3.2], "0.0297059",
    ["epsilon-game"],
    "|x²+x−2| = |x−1||x+2|，|x+2| 在 1 附近約 3，所以 δ ≈ ε/3。兩側不一樣寬：右邊窄，答案要取右邊。", 180,
    { m: "maxDelta", f: "x^2+x", at: 1, L: 2, eps: 0.09 });

  add("ep-005", 5, "limits",
    ask("\\frac{1}{x}", 2, "\\frac{1}{2}"),
    { f: "1/x", at: 2, limit: 0.5, levels: [0.2, 0.1, 0.02], maxDelta: 1.2 },
    [0.6, 3.4, -0.1, 1.2], "0.076923",
    ["epsilon-game"],
    "|1/x − 1/2| = |x−2|/(2x)，分母裡還有 x，所以兩側差很多：左邊（x 變小）分母縮小、誤差放大。δ 要取左邊那個較嚴的值 2−2/(1+2ε)。", 210,
    { m: "maxDelta", f: "1/x", at: 2, L: 0.5, eps: 0.02 });

  add("ep-006", 5, "limits",
    ask("\\sqrt{x}", 4, 2),
    { f: "sqrt(x)", at: 4, limit: 2, levels: [0.3, 0.15, 0.03], maxDelta: 1.5 },
    [2.2, 5.8, 1.2, 2.8], "0.1191",
    ["epsilon-game"],
    "|√x−2| = |x−4|/(√x+2)，分母約 4，所以 δ ≈ 4ε。這是少數 δ 比 ε 大的例子 —— 開根號把變化壓扁了。", 210,
    { m: "maxDelta", f: "\\sqrt{x}", at: 4, L: 2, eps: 0.03 });

  add("ep-007", 4, "limits",
    ask("\\frac{x^2-1}{x-1}", 1, 2),
    { f: "(x^2-1)/(x-1)", at: 1, limit: 2, levels: [0.5, 0.25, 0.05], maxDelta: 0.8, hole: true },
    [0.1, 1.9, 1.1, 2.9], "0.05",
    ["epsilon-game", "removable"],
    "約分之後就是 x+1，所以 δ = ε 剛好。注意 x=1 這一點函數沒有定義（圖上是空心的）——「0<|x−x₀|」那個 0 就是在說這件事：極限不管 x₀ 本身。", 190,
    { m: "maxDelta", f: "x+1", at: 1, L: 2, eps: 0.05 });

  add("ep-008", 5, "limits",
    ask("x^3", 1, 1),
    { f: "x^3", at: 1, limit: 1, levels: [0.6, 0.3, 0.03], maxDelta: 0.5 },
    [0.3, 1.7, 0.2, 1.8], "0.00990163",
    ["epsilon-game"],
    "|x³−1| = |x−1|(x²+x+1)，括號在 1 附近約 3。精確解 δ = (1+ε)^{1/3}−1，比 ε/3 稍小一點 —— 立方的曲率讓右側更緊。", 220,
    { m: "maxDelta", f: "x^3", at: 1, L: 1, eps: 0.03 });

  add("ep-009", 5, "limits",
    ask("\\frac{\\sin x}{x}", 0, 1),
    { f: "sin(x)/x", at: 0, limit: 1, levels: [0.1, 0.05, 0.01], maxDelta: 1.2, hole: true },
    [-1.3, 1.3, 0.4, 1.3], "0.2453178",
    ["epsilon-game", "trig", "removable"],
    "sin x/x 在 0 沒有定義，但極限是 1。|sin x/x − 1| ≈ x²/6，所以 δ ≈ √(6ε) —— 這一題的 δ 是 ε 的平方根級，比線性的例子寬得多。", 230,
    { m: "maxDelta", f: "\\sin(x)/x", at: 0, L: 1, eps: 0.01 });

  add("ep-010", 5, "limits",
    ask("(4-x^2)", 1, 3),
    { f: "4-x^2", at: 1, limit: 3, levels: [0.7, 0.35, 0.07], maxDelta: 0.6 },
    [0.2, 1.8, 1.8, 4.2], "0.034408",
    ["epsilon-game"],
    "|4−x²−3| = |1−x²| = |x−1||x+1|，|x+1| 約 2，δ ≈ ε/2。開口向下不影響做法：只看 |f−L|。", 200,
    { m: "maxDelta", f: "4-x^2", at: 1, L: 3, eps: 0.07 });

  add("ep-011", 6, "limits",
    ask("x\\sin\\frac{1}{x}", 0, 0),
    { f: "x*sin(1/x)", at: 0, limit: 0, levels: [0.3, 0.1, 0.02], maxDelta: 0.8, hole: true },
    [-0.9, 0.9, -0.5, 0.5], "0.020448",
    ["epsilon-game", "squeeze", "trig"],
    "|x sin(1/x)| ≤ |x|，所以 δ = ε 一定可以。這一題振盪得很厲害，但夾擠告訴你「振幅」才是重點 —— 畫面上會看到紅色曲線瘋狂上下，卻仍然被綠帶夾住。", 240,
    { m: "maxDelta", f: "x*\\sin(1/x)", at: 0, L: 0, eps: 0.02 });

  add("ep-012", 6, "limits",
    ask("\\frac{1}{\\sqrt{x}}", 1, 1),
    { f: "1/sqrt(x)", at: 1, limit: 1, levels: [0.25, 0.1, 0.02], maxDelta: 0.7 },
    [0.35, 1.65, 0.5, 1.9], "0.0388312",
    ["epsilon-game"],
    "|1/√x − 1| 在 x<1 那一側放大得快（分母變小），所以 δ 由左側決定：1 − 1/(1+ε)²。又一個兩側不對稱的例子。", 240,
    { m: "maxDelta", f: "1/\\sqrt{x}", at: 1, L: 1, eps: 0.02 });

  add("ep-013", 6, "limits",
    ask("e^x", 0, 1),
    { f: "exp(x)", at: 0, limit: 1, levels: [0.4, 0.2, 0.04], maxDelta: 0.8 },
    [-0.9, 0.9, 0.3, 1.9], "0.039221",
    ["epsilon-game"],
    "右側 e^δ−1 < ε 給 δ < ln(1+ε)，左側 1−e^{−δ} < ε 給 δ < −ln(1−ε)，右側比較嚴。ε=0.04 時 δ = ln(1.04) ≈ 0.0392。", 250,
    { m: "maxDelta", f: "e^x", at: 0, L: 1, eps: 0.04 });

  add("ep-014", 6, "limits",
    ask("\\ln(1+x)", 0, 0),
    { f: "log(1+x)", at: 0, limit: 0, levels: [0.4, 0.2, 0.05], maxDelta: 0.8 },
    [-0.7, 0.9, -0.9, 0.9], "0.048771",
    ["epsilon-game"],
    "|ln(1+x)| < ε 給 e^{−ε}−1 < x < e^{ε}−1，左側 1−e^{−ε} 比右側 e^{ε}−1 小，所以 δ 取左側。ε=0.05 時 δ ≈ 0.0488。", 250,
    { m: "maxDelta", f: "\\ln(1+x)", at: 0, L: 0, eps: 0.05 });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();


/* ═══════════════════════════════════════════════════════════════
   測度與勒貝格積分（2026-09-25）：26 題。

   這一章在課本上幾乎全是證明，而這個站的長處是「算得出來的數」。
   所以每一題都問一個可以驗算的量，讓抽象的東西落地：

     簡單函數     ∫φ = Σcᵢ·m(Eᵢ) —— 勒貝格積分的定義本身就是一個和，
                  用 ⌊3x⌋、⌊x²⌋ 這種階梯函數寫出來就真的算得出來。
     測度         Cantor 集去掉的總長是 1（所以測度 0）；同樣的作法把每一步
                  去掉的長度改成 1/4ⁿ，剩下的測度就是 1/2 —— 「沒有內點卻有
                  正測度」這件事，用一個等比級數就講完了。
     收斂定理     lim∫fₙ 跟 ∫lim fₙ 差多少：n²xe^{-nx} 的積分恆等於 1，
                  但函數逐點趨近 0。這個 1 與 0 的落差就是 Fatou 不等式的內容。
     Lᵖ 範數      ‖f‖_p =(∫|f|^p)^{1/p}；1/√x 無界卻可積、1/x 不可積，
                  差別在一個指數。
     黎曼與勒貝格  兩題判定題：Dirichlet 函數（黎曼不可積、勒貝格可積）與
                  sin x/x 在 (0,∞)（瑕積分收斂但不勒貝格可積）。

   驗算器為此補兩條路徑（integralLimit、lpNorm），並讓 integral 認得 breaks：
   階梯函數的跳躍點要由題目宣告，不然自適應積分會在跳躍處失準
   （∫₀¹(2⌊2x⌋+1) 它給 2.00077 而不是 2）。跳在哪裡本來就是題目的一部分，
   面積仍然由驗算器自己算。 */
(function () {
  "use strict";

  const SOURCE = "Buzz 勒貝格積分包 2026-09";
  const problems = [];

  const add = (id, rank, prompt, answer, tags, solution, timeLimit, verify) => {
    const all = [...tags, "lebesgue", `rank-${rank}`];
    if (rank >= 5) all.push("boss-rank");
    if (rank === 6) all.push("boss-plus");
    problems.push({
      source: SOURCE, id, rank, difficulty: Math.min(4, rank), topic: "integrals",
      answerKind: "numeric", prompt, answer, solution, timeLimit, verify, tags: all
    });
  };

  const decide = (id, rank, prompt, answers, distractors, tags, solution, timeLimit) => {
    const all = [...tags, "lebesgue", `rank-${rank}`];
    if (rank >= 5) all.push("boss-rank");
    problems.push({
      source: SOURCE, id, rank, difficulty: Math.min(4, rank), topic: "integrals",
      answerKind: "text", prompt, answers, canonical: answers[0], distractors,
      solution, timeLimit, tags: all
    });
  };

  /* ── 一、簡單函數的積分（7）──────────────────────────────────
     勒貝格積分的定義第一步就是簡單函數：∫φ = Σ cᵢ·m(Eᵢ)。
     階梯函數寫成 ⌊·⌋ 就是一個具體的簡單函數，每一塊的「高」與「測度」都看得見。 */

  add("lb-sim-001", 3,
    "\\text{簡單函數 }\\varphi(x)=2\\lfloor 2x \\rfloor+1\\text{ 在 }[0,1]\\text{ 上}\\quad\\text{求 }\\int_0^1 \\varphi\\,d\\mu",
    "2", ["simple-function", "measure"],
    "φ 在 [0,½) 取 1、在 [½,1] 取 3，兩塊的測度都是 ½：∫φ = 1·½ + 3·½ = 2。這就是 ∫φ = Σcᵢ·m(Eᵢ) 的最小例子。", 110,
    { m: "integral", f: "2\\lfloor 2x \\rfloor+1", a: 0, b: 1, breaks: [0.5] });

  add("lb-sim-002", 4,
    "\\text{求 }\\int_0^1 \\lfloor 3x \\rfloor\\,d\\mu",
    "1", ["simple-function", "measure"],
    "⌊3x⌋ 在三段上分別取 0、1、2，每段測度 ⅓：∫ = (0+1+2)/3 = 1。", 110,
    { m: "integral", f: "\\lfloor 3x \\rfloor", a: 0, b: 1, breaks: [1 / 3, 2 / 3] });

  add("lb-sim-003", 4,
    "\\text{求 }\\int_0^1 \\lfloor 5x \\rfloor\\,d\\mu",
    "2", ["simple-function", "measure"],
    "五段的值是 0,1,2,3,4，每段測度 ⅕：∫ = 10/5 = 2。一般地 ∫₀¹⌊nx⌋dm = (n−1)/2。", 120,
    { m: "integral", f: "\\lfloor 5x \\rfloor", a: 0, b: 1, breaks: [0.2, 0.4, 0.6, 0.8] });

  add("lb-sim-004", 4,
    "\\text{求 }\\int_0^1 \\lfloor 4x \\rfloor^2\\,d\\mu",
    "7/2", ["simple-function", "measure"],
    "值是 0,1,4,9，每塊測度 ¼：∫ = 14/4 = 7/2。簡單函數的平方還是簡單函數 —— 高變了，分割沒變。", 130,
    { m: "integral", f: "\\lfloor 4x \\rfloor^2", a: 0, b: 1, breaks: [0.25, 0.5, 0.75] });

  add("lb-sim-005", 5,
    "\\text{求 }\\int_0^2 \\lfloor x^2 \\rfloor\\,d\\mu",
    "5-sqrt(2)-sqrt(3)", ["simple-function", "measure"],
    "⌊x²⌋ 在 [1,√2) 取 1、[√2,√3) 取 2、[√3,2] 取 3，其餘取 0。∫ = 1(√2−1)+2(√3−√2)+3(2−√3) = 5−√2−√3 ≈ 1.8537。這一題的分割點不是等分的 —— 簡單函數不要求等分，只要求每一塊可測。", 190,
    { m: "integral", f: "\\lfloor x^2 \\rfloor", a: 0, b: 2, breaks: [1, 1.4142135623730951, 1.7320508075688772] });

  add("lb-sim-006", 5,
    "\\text{求 }\\int_{1/5}^{1} \\left\\lfloor \\frac{1}{x} \\right\\rfloor \\,d\\,m",
    "77/60", ["simple-function", "measure"],
    "⌊1/x⌋ 在 (1/(k+1), 1/k] 上等於 k，那一段的測度是 1/k − 1/(k+1)。k 從 1 到 4：∫ = Σ k(1/k−1/(k+1)) = Σ 1/(k+1) = ½+⅓+¼+⅕ = 77/60。", 210,
    { m: "integral", f: "\\lfloor 1/x \\rfloor", a: 0.2, b: 1, breaks: [0.25, 0.3333333333333333, 0.5] });

  add("lb-sim-007", 5,
    "\\text{求 }\\int_0^3 \\lfloor x \\rfloor\\,(x-\\lfloor x \\rfloor)\\,d\\mu",
    "3/2", ["simple-function", "measure"],
    "在 [k,k+1) 上被積函數是 k·(x−k)，那一段的積分是 k/2。k=0,1,2 相加得 0+½+1 = 3/2。這一題的被積函數不是簡單函數，但它在每一塊上是好積的 —— 分塊是勒貝格的思路。", 200,
    { m: "integral", f: "\\lfloor x \\rfloor (x-\\lfloor x \\rfloor)", a: 0, b: 3, breaks: [1, 2] });

  /* ── 二、測度（4）────────────────────────────────────────────
     等比級數就能把「測度 0 卻不可數」與「沒有內點卻有正測度」講完。 */

  add("lb-mea-001", 4,
    "\\text{Cantor 集在每一步去掉中間三分之一。求「被去掉的總長度」}",
    "1", ["measure", "cantor", "geometric-series"],
    "第 n 步去掉 2^{n−1} 個長度 1/3ⁿ 的區間，總長 Σ2^{n−1}/3ⁿ = (1/3)/(1−2/3) = 1。所以 Cantor 集的測度是 1−1=0 —— 一個不可數卻測度為零的集合。", 160,
    { m: "series", f: "2^(n-1)/3^n", from: 1 });

  add("lb-mea-002", 5,
    "\\text{某個集合在第 }n\\text{ 步去掉 }2^{n-1}\\text{ 個長度 }4^{-n}\\text{ 的開區間（從 }[0,1]\\text{ 開始）。求剩下集合的測度}",
    "1/2", ["measure", "cantor", "geometric-series"],
    "去掉的總長 Σ2^{n−1}/4ⁿ = (1/4)/(1−1/2) = 1/2，所以剩下的測度是 1/2。這就是 Smith–Volterra–Cantor 集：跟 Cantor 集一樣沒有任何內點（無處稠密），測度卻是正的。", 210,
    { m: "series", f: "1-2^(n-1)/4^n", from: 1, to: 1, tol: 1 });

  add("lb-mea-003", 5,
    "\\text{同樣的作法改成第 }n\\text{ 步去掉 }2^{n-1}\\text{ 個長度 }5^{-n}\\text{ 的開區間。求「被去掉的總長度」}",
    "1/3", ["measure", "cantor", "geometric-series"],
    "Σ2^{n−1}/5ⁿ = (1/5)/(1−2/5) = 1/3，剩下的測度是 2/3。去掉的區間越短，留下來的「灰塵」就越重 —— 但它仍然沒有任何內點。", 190,
    { m: "series", f: "2^(n-1)/5^n", from: 1 });

  add("lb-mea-004", 4,
    "\\text{把 }\\mathbb{Q}\\cap[0,1]\\text{ 排成一列，第 }n\\text{ 個有理數用一個長度 }\\frac{1}{100\\cdot 2^{n}}\\text{ 的開區間蓋住。求這些區間的總長度}",
    "1/100", ["measure", "geometric-series"],
    "Σ 1/(100·2ⁿ) = 1/100。ε 可以取任意小，所以可數集的測度是 0 —— 這是「有理數在 [0,1] 裡稠密，卻幾乎不佔位置」那句話的證明。", 170,
    { m: "series", f: "1/(100*2^n)", from: 1 });

  /* ── 三、收斂定理（6）────────────────────────────────────────
     定理在問的是：先積分再取極限，跟先取極限再積分，一不一樣。 */

  add("lb-con-001", 5,
    "\\text{設 }f_n(x)=n^2xe^{-nx}\\text{ 在 }[0,1]\\text{ 上}\\quad\\text{求 }\\lim_{n\\to\\infty}\\int_0^1 f_n\\,d\\mu",
    "1", ["convergence-theorem", "fatou"],
    "每一個固定的 x>0 都有 fₙ(x)→0（指數壓過多項式），所以 ∫lim fₙ = 0。但 ∫fₙ → 1。Fatou 只保證 ∫liminf ≤ liminf∫，這裡是 0 ≤ 1，嚴格不等 —— 質量「滑」到原點跑掉了。", 220,
    { m: "integralLimit", f: "n^2 x e^{-n x}", a: 0, b: 1 });

  add("lb-con-002", 4,
    "\\text{設 }f_n(x)=n^2xe^{-nx}\\text{。求 }\\int_0^1 f_3\\,d\\mu",
    "2/3-17/3*exp(-3)", ["convergence-theorem"],
    "∫₀¹9x²e^{−3x}dx，兩次分部積分得 2/3 − (17/3)e^{−3} ≈ 0.3845。n 越大這個值越靠近 1，但每一個都小於 1。", 210,
    { m: "integral", f: "9 x^2 e^{-3x}", a: 0, b: 1 });

  add("lb-con-003", 5,
    "\\text{設 }f_n(x)=nxe^{-nx^2}\\text{ 在 }[0,1]\\text{ 上}\\quad\\text{求 }\\lim_{n\\to\\infty}\\int_0^1 f_n\\,d\\mu",
    "1/2", ["convergence-theorem", "fatou"],
    "∫₀¹fₙ = (1−e^{−n})/2 → 1/2，而 fₙ→0 逐點。又一個 lim∫ ≠ ∫lim：這一次落差是 1/2。控制收斂定理用不上，因為找不到一個可積的 g 同時壓住所有 fₙ。", 220,
    { m: "integralLimit", f: "n x e^{-n x^2}", a: 0, b: 1 });

  add("lb-con-004", 4,
    "\\text{設 }f_n(x)=nxe^{-nx^2}\\text{。求 }\\int_0^1 f_3\\,d\\mu",
    "(1-exp(-3))/2", ["convergence-theorem"],
    "代換 u=x²：∫₀¹3xe^{−3x²}dx = (1−e^{−3})/2 ≈ 0.4751。整串的極限是 1/2。", 180,
    { m: "integral", f: "3x e^{-3x^2}", a: 0, b: 1 });

  add("lb-con-005", 4,
    "\\text{設 }f_n(x)=nx^n\\text{ 在 }[0,1]\\text{ 上}\\quad\\text{求 }\\lim_{n\\to\\infty}\\int_0^1 f_n\\,d\\mu",
    "1", ["convergence-theorem", "fatou"],
    "∫fₙ = n/(n+1) → 1，但 fₙ(x)→0 對每個 x<1 成立（x=1 那一點測度為零，不影響積分）。質量全部擠到右端點去了。", 190,
    { m: "integralLimit", f: "n x^n", a: 0, b: 1 });

  add("lb-con-006", 4,
    "\\text{設 }f_n(x)=x^{1/n}\\text{ 在 }[0,1]\\text{ 上（這一列遞增）}\\quad\\text{求 }\\lim_{n\\to\\infty}\\int_0^1 f_n\\,d\\mu",
    "1", ["convergence-theorem", "monotone-convergence"],
    "fₙ 遞增且逐點趨近 1（x>0），由單調收斂定理 lim∫fₙ = ∫1 = 1。直接算也一樣：∫x^{1/n} = n/(n+1) → 1。這一題是定理成立的例子 —— 跟前面三題對照著看。", 190,
    { m: "integralLimit", f: "x^(1/n)", a: 0, b: 1 });

  /* ── 四、Lᵖ 範數（5）────────────────────────────────────────
     可積與否在 Lᵖ 的語言裡是一個指數問題。 */

  add("lb-lp-001", 3,
    "\\text{求 }f(x)=x\\text{ 在 }[0,1]\\text{ 上的 }L^2\\text{ 範數 }\\|f\\|_2",
    "1/sqrt(3)", ["lp-space"],
    "‖f‖₂ = (∫₀¹x²dx)^{1/2} = (1/3)^{1/2} = 1/√3 ≈ 0.5774。", 140,
    { m: "lpNorm", f: "x", a: 0, b: 1, p: 2 });

  add("lb-lp-002", 5,
    "\\text{求 }f(x)=x\\text{ 在 }[0,1]\\text{ 上的 }L^3\\text{ 範數 }\\|f\\|_3",
    "4^(-1/3)", ["lp-space"],
    "(∫₀¹x³dx)^{1/3} = (1/4)^{1/3} ≈ 0.6300。p 越大，範數越靠近 sup|f| —— 在 [0,1] 上這一串會往 1 爬。", 170,
    { m: "lpNorm", f: "x", a: 0, b: 1, p: 3 });

  add("lb-lp-003", 3,
    "\\text{求 }f(x)=\\sin x\\text{ 在 }[0,\\pi]\\text{ 上的 }L^1\\text{ 範數 }\\|f\\|_1",
    "2", ["lp-space", "trig"],
    "sin x 在 [0,π] 上非負，所以 ‖f‖₁ = ∫₀^π sin x dx = 2。L¹ 範數就是「面積」。", 130,
    { m: "lpNorm", f: "\\sin x", a: 0, b: 3.141592653589793, p: 1 });

  add("lb-lp-004", 4,
    "\\text{求 }f(x)=\\frac{1}{\\sqrt{x}}\\text{ 在 }(0,1]\\text{ 上的 }L^1\\text{ 範數 }\\|f\\|_1",
    "2", ["lp-space", "improper-integral"],
    "∫₀¹x^{−1/2}dx = 2。函數在 0 附近無界，卻仍然勒貝格可積 —— 可積要求的是「面積有限」，不是「函數有界」。", 170,
    { m: "lpNorm", f: "1/\\sqrt{x}", a: 0, b: 1, p: 1 });

  add("lb-lp-005", 5,
    "\\text{求 }f(x)=x^{-1/3}\\text{ 在 }(0,1]\\text{ 上的 }L^2\\text{ 範數 }\\|f\\|_2",
    "sqrt(3)", ["lp-space", "improper-integral"],
    "‖f‖₂² = ∫₀¹x^{−2/3}dx = 3，所以 ‖f‖₂ = √3。同一個 f 換個 p 就可能跳出 Lᵖ：x^{−1/3} 在 L² 裡，但 x^{−1/2} 不在（∫x^{−1} 發散）。", 210,
    { m: "lpNorm", f: "x^(-1/3)", a: 0, b: 1, p: 2 });

  add("lb-lp-006", 4,
    "\\text{求 }\\int_0^1 x^{-2/3}\\,d\\mu",
    "3", ["lp-space", "improper-integral"],
    "∫₀¹x^{−2/3}dx = 3x^{1/3}|₀¹ = 3。判準是指數：∫₀¹x^{−p}dx 在 p<1 時收斂、p≥1 時發散。", 150,
    { m: "integral", f: "x^(-2/3)", a: 0, b: 1 });

  /* ── 五、黎曼與勒貝格的差別（2）─────────────────────────────
     這兩題是整章存在的理由，答案是一句判定而不是一個數。 */

  decide("lb-cmp-001", 4,
    "\\text{Dirichlet 函數（有理點取 }1\\text{、無理點取 }0\\text{）在 }[0,1]\\text{ 上的可積性}",
    ["黎曼不可積，但勒貝格可積", "勒貝格可積但黎曼不可積"],
    ["兩者都可積", "兩者都不可積", "黎曼可積但勒貝格不可積"],
    ["measure", "riemann-lebesgue"],
    "上黎曼和恆為 1、下黎曼和恆為 0，所以黎曼不可積。但它幾乎處處等於 0（有理數是零測度集），勒貝格積分等於 0。這正是勒貝格積分被發明出來的理由。", 160);

  decide("lb-cmp-002", 5,
    "\\text{函數 }\\frac{\\sin x}{x}\\text{ 在 }(0,\\infty)\\text{ 上的可積性}",
    ["瑕積分收斂，但不是勒貝格可積", "黎曼瑕積分收斂但不勒貝格可積"],
    ["勒貝格可積", "兩者都收斂", "瑕積分也發散"],
    ["measure", "riemann-lebesgue", "improper-integral"],
    "∫₀^∞ sin x/x dx = π/2 是收斂的瑕積分（靠正負相消），但 ∫₀^∞|sin x/x|dx = ∞。勒貝格積分要求 ∫|f| 有限，所以它不是勒貝格可積 —— 條件收斂在勒貝格的世界裡不算收斂。", 200);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
