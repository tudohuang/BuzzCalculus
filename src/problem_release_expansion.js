(function () {
  "use strict";

  const SOURCE = "Buzz release expansion";
  const releaseProblems = [];

  function add(problem) {
    releaseProblems.push({
      source: SOURCE,
      timeLimit: 60,
      tabLimit: 1,
      hints: [],
      ...problem
    });
  }

  function numeric(id, topic, difficulty, prompt, answer, tags, solution, hints = [], timeLimit = 60, rank) {
    add({
      id,
      topic,
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  function antiderivative(id, difficulty, prompt, answer, tags, solution, hints = [], timeLimit = 80, rank) {
    add({
      id,
      topic: "integrals",
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "antiderivative",
      answer,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  function text(id, topic, difficulty, prompt, answers, canonical, tags, solution, hints = [], timeLimit = 50, rank) {
    add({
      id,
      topic,
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "text",
      answers,
      canonical,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  [
    ["rel-basic-001", "limits", "\\lim_{x\\to0}\\frac{\\sin(5x)}{x}", "5", ["standard-limit", "beginner-foundation"], "sin(5x)/(5x) tends to 1."],
    ["rel-basic-003", "limits", "\\lim_{x\\to0}\\frac{e^{4x}-1}{x}", "4", ["standard-limit", "beginner-foundation"], "Use e^u-1 ~ u."],
    ["rel-basic-004", "limits", "\\lim_{x\\to0}\\frac{\\ln(1+2x)}{x}", "2", ["standard-limit", "beginner-foundation"], "Use log(1+u) ~ u."],
    ["rel-basic-005", "limits", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}", "1/2", ["rationalize", "beginner-foundation"], "Rationalize the numerator."],
    ["rel-basic-007", "derivatives", "\\left.\\frac{d}{dx}x^3\\right|_{x=2}", "12", ["basic-derivative", "beginner-foundation"], "The derivative is 3x^2."],
    ["rel-basic-008", "derivatives", "\\left.\\frac{d}{dx}\\sin x\\right|_{x=0}", "1", ["basic-derivative", "beginner-foundation"], "The derivative is cos x."],
    ["rel-basic-009", "derivatives", "\\left.\\frac{d}{dx}e^{2x}\\right|_{x=0}", "2", ["chain-rule", "beginner-foundation"], "The derivative is 2e^{2x}."],
    ["rel-basic-010", "derivatives", "\\left.\\frac{d}{dx}\\sqrt{x}\\right|_{x=4}", "1/4", ["basic-derivative", "beginner-foundation"], "The derivative is 1/(2sqrt x)."],
    ["rel-basic-011", "derivatives", "\\left.\\frac{d}{dx}\\ln x\\right|_{x=e}", "1/e", ["basic-derivative", "beginner-foundation"], "The derivative is 1/x."],
    ["rel-basic-012", "derivatives", "\\left.\\frac{d}{dx}(x\\ln x)\\right|_{x=1}", "1", ["product-rule", "beginner-foundation"], "The derivative is log x+1."],
    ["rel-basic-013", "integrals", "\\int_0^1 x^2\\,dx", "1/3", ["basic-integral", "beginner-foundation"], "Use the power rule."],
    ["rel-basic-014", "integrals", "\\int_0^{\\pi}\\sin x\\,dx", "2", ["basic-integral", "beginner-foundation"], "The antiderivative is -cos x."],
    ["rel-basic-015", "integrals", "\\int_0^1 e^{2x}\\,dx", "(e^2-1)/2", ["basic-integral", "beginner-foundation"], "Divide by the inner coefficient 2."],
    ["rel-basic-016", "integrals", "\\int_0^1\\frac{1}{1+x}\\,dx", "log(2)", ["basic-integral", "log"], "The antiderivative is log(1+x)."],
    ["rel-basic-018", "integrals", "\\int_0^2 3x\\,dx", "6", ["basic-integral", "beginner-foundation"], "The antiderivative is 3x^2/2."],
    ["rel-basic-019", "series", "\\sum_{n=0}^{\\infty}\\left(\\frac12\\right)^n", "2", ["geometric-series", "beginner-foundation"], "Use 1/(1-r)."],
    ["rel-basic-022", "series", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}3^n x^n", "1/3", ["power-series", "beginner-foundation"], "This is geometric with ratio 3x."],
    ["rel-basic-024", "series", "\\sum_{n=1}^{\\infty}\\left(\\frac13\\right)^n", "1/2", ["geometric-series", "beginner-foundation"], "Use r/(1-r)."]
  ].forEach(([id, topic, prompt, answer, tags, solution]) => {
    numeric(id, topic, 1, prompt, answer, tags, solution, ["Keep the standard formula visible."], 45);
  });


  [
    ["rel-adv-002", "limits", "\\lim_{x\\to0}\\frac{e^x-1-x-x^2/2-x^3/6}{x^4}", "1/24", ["taylor", "limit-trap"], "The next Taylor coefficient is 1/24."],
    ["rel-adv-005", "derivatives", "\\frac{\\partial(u,v)}{\\partial(x,y)}\\text{ at }(1,2),\\quad u=x^2-y^2,\\ v=2xy", "20", ["jacobian", "multivariable"], "The determinant is 4(x^2+y^2)."],
    ["rel-adv-006", "derivatives", "D_{(2,-1,2)/3}(x^2y+yz)\\text{ at }(1,2,3)", "8/3", ["directional-derivative", "multivariable"], "Dot the gradient (4,4,2) with (2,-1,2)/3."],
    ["rel-adv-007", "derivatives", "\\det H_f(1,1),\\quad f=x^4+y^4-4xy", "128", ["hessian", "optimization"], "The Hessian is [[12,-4],[-4,12]]."],
    ["rel-adv-008", "derivatives", "\\min(x^2+y^2+z^2)\\quad\\text{subject to }x+2y+2z=9", "9", ["lagrange-multiplier", "optimization"], "The minimum distance squared to the plane is 9."],
    ["rel-adv-011", "integrals", "\\int_0^{\\infty}xe^{-3x}\\,dx", "1/9", ["improper-integral", "gamma-function"], "Use Gamma(2)/3^2."],
    ["rel-adv-014", "integrals", "\\int_0^1\\int_0^1(x+y)^2\\,dy\\,dx", "7/6", ["double-integral", "iterated-integral"], "Expand and integrate term by term."],
    ["rel-adv-017", "series", "\\text{coefficient of }x^6\\text{ in }e^{x^2}", "1/6", ["taylor", "power-series"], "Use e^{x^2}=sum x^{2k}/k!."],
    ["rel-adv-019", "series", "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{x^n}{n^2}", "1", ["power-series", "radius-of-convergence"], "Polynomial factors do not change the radius from 1."]
  ].forEach(([id, topic, prompt, answer, tags, solution]) => {
    numeric(id, topic, 3, prompt, answer, tags, solution, ["Identify the dominant technique before calculating."], 75);
  });

  antiderivative("rel-adv-009", 3, "\\int x^3e^{x^2}\\,dx", "exp(x^2)*(x^2-1)/2", ["substitution", "u-sub"], "Let u=x^2. Then x^3 dx=(u/2)du.", ["After substitution integrate u e^u."], 80);
  antiderivative("rel-adv-010", 3, "\\int x\\ln(1+x^2)\\,dx", "(1+x^2)*log(1+x^2)/2-(1+x^2)/2", ["substitution", "log"], "Let u=1+x^2 and integrate log u.", ["Use u=1+x^2."], 80);
  text("rel-adv-015", "series", 3, "\\sum_{n=1}^{\\infty}\\left(\\frac{n}{3n+1}\\right)^n", ["convergent", "converges"], "convergent", ["root-test", "series-test"], "The root limit is 1/3<1.", ["Use the root test."], 55);
  text("rel-adv-018", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{3n^2+1}{n^3+n}", ["divergent", "diverges"], "divergent", ["limit-comparison", "series-test"], "The terms behave like 3/n.", ["Use limit comparison with 1/n."], 55);
  text("rel-adv-020", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{x^n}{n}\\text{ at }x=-1", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["endpoint-analysis", "power-series"], "At x=-1 this is the alternating harmonic series.", ["Endpoint analysis is required."], 55);

  [
    ["rel-boss-001", "integrals", "\\int_0^{\\infty}\\frac{\\sin(3x)}{x}\\,dx", "pi/2", ["improper-integral", "dirichlet-integral"], "Dirichlet integral gives pi/2 for positive frequency.", 5],
    ["rel-boss-002", "integrals", "\\int_0^{\\infty}\\frac{e^{-2x}-e^{-5x}}{x}\\,dx", "log(5/2)", ["frullani", "improper-integral"], "Frullani gives log(5/2).", 5],
    ["rel-boss-003", "integrals", "\\int_0^{\\infty}\\frac{\\cos(2x)-\\cos(7x)}{x}\\,dx", "log(7/2)", ["frullani", "cosine-integral", "improper-integral"], "Use the cosine Frullani identity.", 5],
    ["rel-boss-004", "integrals", "\\int_0^{\\infty}x^{5/2}e^{-x}\\,dx", "15*sqrt(pi)/8", ["gamma-function", "special-functions"], "This is Gamma(7/2).", 5],
    ["rel-boss-005", "integrals", "\\int_0^1x^{-1/2}(1-x)^{3/2}\\,dx", "3*pi/8", ["beta-function", "special-functions"], "This is B(1/2,5/2).", 5],
    ["rel-boss-007", "derivatives", "\\text{coefficient of }x^4\\text{ in }J_0(x)", "1/64", ["bessel", "special-functions"], "J0(x)=1-x^2/4+x^4/64+...", 6],
    ["rel-boss-008", "integrals", "\\operatorname{Res}_{z=0}\\frac{\\sin z}{z^5}", "0", ["complex", "residue"], "There is no z^{-1} term.", 6],
    ["rel-boss-009", "integrals", "\\operatorname{Res}_{z=0}\\frac{e^z}{z^4}", "1/6", ["complex", "residue"], "The residue is the z^3 coefficient of e^z.", 6],
    ["rel-boss-010", "integrals", "\\iint_T\\frac{xy}{x+y}\\,dA,\\quad T=\\{x,y>0,\\ x+y<1\\}", "1/18", ["change-of-variables", "jacobian"], "Use u=x+y and v=x/(x+y).", 6],
    ["rel-boss-011", "integrals", "\\iiint_{x,y,z\\ge0,\\ x+y+z\\le1}xyz\\,dV", "1/720", ["triple-integral", "simplex"], "Use the simplex beta integral.", 6],
    ["rel-boss-012", "integrals", "\\iiint_{x^2+y^2+z^2\\le4}(x^2+y^2+z^2)\\,dV", "128*pi/5", ["triple-integral", "spherical"], "Use spherical coordinates: integrate 4pi r^4.", 6],
    ["rel-boss-017", "integrals", "\\int_0^1(\\ln x)^2\\,dx", "2", ["improper-integral", "gamma-function"], "Differentiate the beta/gamma integral or use Gamma(3).", 5],
    ["rel-boss-019", "limits", "\\lim_{n\\to\\infty}n\\left(\\ln(n+1)-\\ln n\\right)", "1", ["asymptotic", "limit-trap"], "Rewrite as n log(1+1/n).", 5],
    ["rel-boss-020", "integrals", "\\operatorname{Res}_{z=0}\\frac{1-\\cos z}{z^3}", "1/2", ["complex", "residue"], "The z^2/2 term in 1-cos z creates the residue.", 6]
  ].forEach(([id, topic, prompt, answer, tags, solution, rank]) => {
    numeric(id, topic, 4, prompt, answer, tags, solution, ["This is intended as a Boss/Boss+ item."], 110, rank);
  });

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 題幹的寫法自動辨識器接不到；這裡把題幹重述成數值路徑（數值偏導、數值積分、
  // 複數求值、圍道上的梯形法），不重複解題的推導、也不把答案抄一遍。
  const VERIFY = {
    "rel-adv-005": { m: "vecField", op: "jacobian", vars: ["x", "y"], F: ["x^2-y^2", "2xy"], at: [1, 2] }
  };
  releaseProblems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(releaseProblems);
})();

/* ═══ 課程缺口補題 12I／12K（cg-12i-、cg-12k-，57 題，2026-10）═══
   測度論與收斂定理：σ-代數（有限集合上的生成、族是否封閉）、加權點測度、區間族的可數可加、
   類 Cantor 構造的剩餘長度、a.e. 收斂的例外集、{f > a} 的長度，以及 MCT／Fatou／DCT 的 lim∫fₙ。
   概念題一律寫成 choice：每個誘答都用一個具體的數值反例推翻（有限集合的封閉性由位元運算逐一檢查、
   測度與 lim∫fₙ 由數值積分與外插算出），驗算端不重用作者的推導。 */
(function () {
  "use strict";
  // 課程缺口補題（12I 測度論、12K 收斂定理）：把 gaps 裡能算成一個數、或能用反例檢查的判斷題寫成真題
  const SOURCE = "Buzz course gap fill";

  const pick = (right, wrong) => ({ answerKind: "text", answer: right, answers: [right], canonical: right, distractors: wrong });

  // 有限集合 X = {1,…,n} 的子集用位元遮罩表示（元素 k 對應 2^{k−1}）。
  // 下面幾個函數只負責把「題幹列出的集合」翻成 LaTeX 算式；元素歸屬、聯集、補集、原子個數全部交給驗算引擎去算。
  const bit = (mask, index) => `\\left(\\left\\lfloor \\frac{${mask}}{2^{${index}}} \\right\\rfloor-2\\left\\lfloor \\frac{${mask}}{2^{${index}+1}} \\right\\rfloor\\right)`;
  // 由 masks 生成的 σ-代數的原子個數：數「不同的歸屬簽名」有幾種
  const atomsTex = (masks, n) => {
    const signature = masks.map((mask, j) => `${2 ** j}\\cdot ${bit(mask, "x-1")}`).join("+");
    return `\\sum_{p=0}^{${2 ** masks.length - 1}}\\operatorname{sgn}\\left(\\sum_{x=1}^{${n}}\\left(1-\\operatorname{sgn}\\left|${signature}-p\\right|\\right)\\right)`;
  };
  const memberTex = (family, expr) => family.map((c) => `\\left(1-\\operatorname{sgn}\\left|${expr}-${c}\\right|\\right)`).join("+");
  const orTex = (a, b, bits) => `\\sum_{k=0}^{${bits - 1}}2^{k}\\left(${bit(a, "k")}+${bit(b, "k")}-${bit(a, "k")}\\cdot ${bit(b, "k")}\\right)`;
  // 封閉性缺陷數：補集不在族裡的個數＋聯集不在族裡的配對數。σ-代數（有限時＝代數）⇔ 0
  const defectTex = (family, n) => {
    const full = 2 ** n - 1;
    const terms = family.map((a) => `\\left(1-\\left(${memberTex(family, `${full}-${a}`)}\\right)\\right)`);
    for (let i = 0; i < family.length; i += 1) {
      for (let j = i + 1; j < family.length; j += 1) {
        terms.push(`\\left(1-\\left(${memberTex(family, orTex(family[i], family[j], n))}\\right)\\right)`);
      }
    }
    return terms.join("+");
  };
  const step = (expr) => `\\frac{1+\\operatorname{sgn}\\left(${expr}\\right)}{2}`; // 指示函數 χ_{expr>0}
  const fat = (base) => ({ m: "let", f: "1-s", with: { s: { m: "series", f: `\\frac{2^{n-1}}{${base}^n}`, from: 1 } } });
  const cantorLeft = { m: "seqLimit", f: "1-\\sum_{k=1}^{n}\\frac{2^{k-1}}{3^k}" };

  const problems = [
    /* ── 12I σ-代數 ── */
    { id: "cg-12i-001", topic: "integrals", rank: 3,
      prompt: "\\,\\text{在 }\\,\\mathbb{R}\\,\\text{ 上，下列哪一族子集是 }\\,\\sigma\\,\\text{-代數？}\\,",
      ...pick("可數集與補集可數的集合全體", ["有界集合全體", "有限集合全體", "長度不超過 1 的區間全體"]),
      timeLimit: 150,
      tags: ["sigma-axioms", "measure", "lebesgue"],
      hints: ["σ-代數要包含全集，並且對補集與可數聯集封閉。", "每個選項各找一個操作：把可數多個成員聯集起來，或取補集，看結果還在不在族裡。"],
      solution: "有界集合：⋃[n,n+1] = [1,∞) 無界。有限集合：⋃{n} = ℕ 是無限集。長度 ≤ 1 的區間：[0,1]∪[2,3] 不是區間。可數／補集可數：補集把兩類互換；可數個可數集的聯集可數，若其中有一個補集可數，聯集的補集也可數。",
      
      verify: { m: "choice", options: [
        { say: "可數集與補集可數的集合全體", unknown: "定理：可數個可數集的聯集仍可數" },
        { say: "有界集合全體", all: [{ v: { m: "seriesConverges", f: "1", from: 1 }, claim: true }] },
        { say: "有限集合全體", all: [{ v: { m: "seriesConverges", f: "1", from: 1 }, claim: true }] },
        { say: "長度不超過 1 的區間全體", all: [{ v: { m: "value", f: "1+1" }, le: 1 }] }
      ] } },
    { id: "cg-12i-002", topic: "integrals", rank: 2,
      prompt: "X=\\{1,2,3,4\\}\\,\\text{。下列哪一族是 }\\,X\\,\\text{ 上的 }\\,\\sigma\\,\\text{-代數？}\\,",
      ...pick("{∅, {1,2}, {3,4}, X}", ["{∅, {1}, {2}, X}", "{∅, {1,2}, {2,3}, X}", "{∅, {1}, {2}, {2,3,4}, X}"]),
      timeLimit: 120,
      tags: ["sigma-axioms", "measure"],
      hints: ["有限集合上只要檢查兩件事：每個成員的補集、每兩個成員的聯集，都還在族裡。", "從最小的成員開始：它的補集是誰？在不在？"],
      solution: "{∅,{1,2},{3,4},X}：補集兩兩配對，聯集都還在族裡。{∅,{1},{2},X} 缺 {1} 的補集 {2,3,4}；{∅,{1,2},{2,3},X} 缺 {1,2} 的補集 {3,4}；最後一族缺 {1}∪{2} = {1,2}。",
      
      verify: { m: "choice", options: [
        { say: "{∅, {1,2}, {3,4}, X}", all: [{ v: { m: "value", f: defectTex([0, 3, 12, 15], 4) }, eq: 0 }] },
        { say: "{∅, {1}, {2}, X}", all: [{ v: { m: "value", f: memberTex([0, 1, 2, 15], "15-1") }, eq: 1 }] },
        { say: "{∅, {1,2}, {2,3}, X}", all: [{ v: { m: "value", f: memberTex([0, 3, 6, 15], "15-3") }, eq: 1 }] },
        { say: "{∅, {1}, {2}, {2,3,4}, X}", all: [{ v: { m: "value", f: memberTex([0, 1, 2, 14, 15], orTex(1, 2, 4)) }, eq: 1 }] }
      ] } },
    { id: "cg-12i-003", topic: "integrals", rank: 3,
      prompt: "\\,\\text{在 }\\,\\mathbb{N}\\,\\text{ 上令 }\\,\\mathcal{F}=\\{A:\\ A\\,\\text{ 有限，或 }\\,\\mathbb{N}\\setminus A\\,\\text{ 有限}\\,\\}\\,\\text{。}\\,\\mathcal{F}\\,\\text{ 對哪一種運算不封閉？}\\,",
      ...pick("可數聯集", ["補集", "兩個集合的聯集", "兩個集合的交集"]),
      timeLimit: 150,
      tags: ["sigma-axioms", "measure"],
      hints: ["補集把「有限」與「補集有限」兩類互換；有限多次的聯集、交集分情形檢查。", "試試把 {2}, {4}, {6}, … 這些單點集一次全部聯集起來。"],
      solution: "補集、有限聯集、有限交集都封閉（分「有限」「補集有限」兩類討論）。但 ⋃{2k} = 偶數集：它無限，補集（奇數集）也無限，不在 𝓕 裡。所以 𝓕 是代數，不是 σ-代數。",
      
      verify: { m: "choice", options: [
        { say: "可數聯集", all: [{ v: { m: "seriesConverges", f: "1", from: 1 }, claim: false }, { v: { m: "seriesConverges", f: "1", from: 0 }, claim: false }] },
        { say: "補集", unknown: "兩類互換，封閉" },
        { say: "兩個集合的聯集", unknown: "分情形，封閉" },
        { say: "兩個集合的交集", unknown: "De Morgan，封閉" }
      ] } },
    { id: "cg-12i-004", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "X=\\{1,2,3,4,5,6\\},\\ A=\\{2,4,6\\}\\,\\text{。由 }\\,A\\,\\text{ 生成的 }\\,\\sigma\\,\\text{-代數有幾個元素？}\\,",
      answer: "4", timeLimit: 60,
      tags: ["sigma-generated", "measure"],
      hints: ["σ-代數一定要包含 ∅、X，以及 A 的補集。", "把這些集合列出來，再檢查聯集與補集有沒有跑出新的集合。"],
      solution: "σ(A) = {∅, A, X∖A, X}，其中 X∖A = {1,3,5}。原子是 A 與 X∖A 兩塊，元素個數 2² = 4。",
      
      verify: { m: "value", f: `2^{${atomsTex([42], 6)}}` } },
    { id: "cg-12i-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "X=\\{1,2,\\dots,8\\},\\ A=\\{1,2,3,4\\},\\ B=\\{3,4,5\\}\\,\\text{。由 }\\,A\\,\\text{ 與 }\\,B\\,\\text{ 生成的 }\\,\\sigma\\,\\text{-代數有幾個元素？}\\,",
      answer: "16", timeLimit: 120,
      tags: ["sigma-generated", "measure"],
      hints: ["先找「原子」：用 A 與 B 把 X 切成互不相交的最小塊（A∩B、A∖B、B∖A、兩者之外）。", "σ-代數的每個元素都是若干個原子的聯集。"],
      solution: "原子：A∩B = {3,4}、A∖B = {1,2}、B∖A = {5}、X∖(A∪B) = {6,7,8}，共 4 塊、都非空。每個元素是原子的任意聯集，所以有 2⁴ = 16 個。",
      
      verify: { m: "value", f: `2^{${atomsTex([15, 28], 8)}}` } },
    { id: "cg-12i-006", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "X=\\{1,2,\\dots,10\\},\\ A=\\{1,\\dots,5\\},\\ B=\\{4,\\dots,8\\},\\ C=\\{2,4,6,8,10\\}\\,\\text{。由 }\\,A,\\,B,\\,C\\,\\text{ 生成的 }\\,\\sigma\\,\\text{-代數有幾個元素？}\\,",
      answer: "256", timeLimit: 210,
      tags: ["sigma-generated", "measure"],
      hints: ["每個點 x 記下它在不在 A、B、C 裡，得到一個三位的「歸屬簽名」。", "簽名相同的點落在同一個原子；數一數實際出現了幾種簽名。"],
      solution: "簽名 (A,B,C)：1→(1,0,0)、2→(1,0,1)、3→(1,0,0)、4→(1,1,1)、5→(1,1,0)、6→(0,1,1)、7→(0,1,0)、8→(0,1,1)、9→(0,0,0)、10→(0,0,1)。八種簽名全部出現，原子 8 塊，元素 2⁸ = 256 個。",
      
      verify: { m: "value", f: `2^{${atomsTex([31, 248, 682], 10)}}` } },
    { id: "cg-12i-007", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\{3\\}=\\bigcap_{n=1}^{\\infty}\\left(3-\\frac1n,\\,3+\\frac1n\\right)\\,\\text{，所以單點是 Borel 集。最小的 }\\,n\\,\\text{ 使第 }\\,n\\,\\text{ 個開區間的長度小於 }\\,0.001\\,\\text{ 是多少？}\\,",
      answer: "2001", timeLimit: 75,
      tags: ["sigma-borel-membership", "measure"],
      hints: ["第 n 個開區間的長度是多少？寫成 n 的式子。", "解嚴格不等式；長度剛好等於 0.001 的那個 n 不算。"],
      solution: "第 n 個區間長 2/n。2/n < 0.001 ⇔ n > 2000，最小 n = 2001。區間一路縮小、交集只剩 3：單點是開集的可數交集（G_δ 集），所以是 Borel 集。",
      
      verify: { m: "firstIndex", f: "\\frac{2}{n}", below: 0.001 } },
    { id: "cg-12i-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{Cantor 集 }\\,C=\\bigcap_{n} C_n\\,\\text{，}\\,C_n\\,\\text{ 是第 }\\,n\\,\\text{ 步剩下的 }\\,2^n\\,\\text{ 個閉區間的聯集。}\\,C_n\\,\\text{ 的總長第一次小於 }\\,0.05\\,\\text{ 時 }\\,n\\,\\text{ 是多少？}\\,",
      answer: "8", timeLimit: 120,
      tags: ["sigma-borel-membership", "measure", "cantor"],
      hints: ["每一步把每個閉區間的中間三分之一挖掉，剩下的總長變成原來的幾倍？", "解 (比例)ⁿ < 0.05，可以取對數，也可以直接一步一步乘。"],
      solution: "C_n 的總長 = (2/3)ⁿ。(2/3)⁷ ≈ 0.0585，(2/3)⁸ ≈ 0.0390，所以 n = 8。每個 C_n 是有限個閉區間的聯集（閉集），C 是可數多個閉集的交集，所以是 Borel 集。",
      
      verify: { m: "firstIndex", f: "1-\\sum_{k=1}^{n}\\frac{2^{k-1}}{3^k}", below: 0.05 } },

    /* ── 12I 測度 ── */
    { id: "cg-12i-009", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\,\\text{在 }\\,\\mathbb{N}=\\{1,2,3,\\dots\\}\\,\\text{ 上令 }\\,\\mu(\\{k\\})=2^{-k}\\,\\text{。求 }\\,\\mu(\\{\\,\\text{偶數}\\,\\})",
      answer: "1/3", timeLimit: 75,
      tags: ["measure-discrete-sums", "measure", "geometric-series"],
      hints: ["點測度：一個集合的測度是它每個點的權重相加（可數可加）。", "偶數 k = 2j，把 2^{−2j} 對 j 加起來。"],
      solution: "μ(偶數) = Σ_{j≥1} 2^{−2j} = Σ 4^{−j} = (1/4)/(1 − 1/4) = 1/3。",
      
      verify: { m: "series", f: "2^{-2n}", from: 1 } },
    { id: "cg-12i-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{在 }\\,\\mathbb{N}=\\{1,2,3,\\dots\\}\\,\\text{ 上令 }\\,\\mu(\\{k\\})=\\frac{2}{3^k}\\,\\text{。求 }\\,\\mu(\\{3\\,\\text{ 的倍數}\\,\\})",
      answer: "1/13", timeLimit: 90,
      tags: ["measure-discrete-sums", "measure", "geometric-series"],
      hints: ["先確認 μ(ℕ) 是多少，熟悉一下這個測度。", "3 的倍數 k = 3j，權重是 2/27ʲ。"],
      solution: "μ(3 的倍數) = Σ_{j≥1} 2·27^{−j} = 2·(1/27)/(1 − 1/27) = 2/26 = 1/13。",
      
      verify: { m: "series", f: "2\\cdot 3^{-3n}", from: 1 } },
    { id: "cg-12i-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{在 }\\,\\mathbb{N}=\\{1,2,3,\\dots\\}\\,\\text{ 上令 }\\,\\mu(\\{k\\})=2^{-k}\\,\\text{。求 }\\,\\mu(\\{k:\\ k\\ge 5\\,\\text{ 且 }\\,k\\,\\text{ 是奇數}\\,\\})",
      answer: "1/24", timeLimit: 90,
      tags: ["measure-discrete-sums", "measure", "geometric-series"],
      hints: ["列出集合：5, 7, 9, …，相鄰兩項的權重比是多少？", "首項 2^{−5}，套等比級數。"],
      solution: "k = 5, 7, 9, …：Σ 2^{−k} = 2^{−5}(1 + 1/4 + 1/16 + ⋯) = (1/32)·(4/3) = 1/24。",
      
      verify: { m: "series", f: "2^{-(2n+3)}", from: 1 } },
    { id: "cg-12i-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "E_n=\\{x\\ge 0:\\ x^2<4+\\tfrac1n\\}\\ \\,\\text{（遞減）。用由上連續求 }\\,m\\left(\\bigcap_{n} E_n\\right)",
      answer: "2", timeLimit: 90,
      tags: ["measure-continuity", "measure", "lebesgue"],
      hints: ["E_n 是一個區間，先寫出它的右端點與長度。", "m(E₁) 有限，所以可以用由上連續：交集的測度 = 測度的極限。"],
      solution: "E_n = [0, √(4 + 1/n))，m(E_n) = √(4 + 1/n)。E₁ 有限，由上連續：m(⋂E_n) = lim √(4 + 1/n) = 2。（交集是 [0,2]。）",
      
      verify: { m: "seqLimit", f: "\\sqrt{4+\\frac{1}{n}}" } },
    { id: "cg-12i-013", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "E_n=\\left[0,\\,1+\\tfrac1n\\right]\\cup[n,\\infty)\\ \\,\\text{（遞減，每個 }\\,m(E_n)=\\infty\\,\\text{）。求 }\\,m\\left(\\bigcap_{n} E_n\\right)",
      answer: "1", timeLimit: 150,
      tags: ["measure-continuity", "measure", "lebesgue"],
      hints: ["lim m(E_n) = ∞，但由上連續要求 m(E₁) < ∞，這裡不能直接用。", "一個點 x > 1 要落在每個 E_n 裡，需要什麼？對很大的 n 呢？"],
      solution: "x > 1 時，n 夠大就同時有 x > 1 + 1/n 與 x < n，所以 x ∉ E_n。交集 = [0,1]，測度 1。而 lim m(E_n) = ∞ ≠ 1：m(E₁) = ∞ 時由上連續會失敗。",
      
      verify: { m: "seqLimit", f: "1+\\frac{1}{n}" } },
    { id: "cg-12i-014", topic: "integrals", rank: 2,
      prompt: "\\,\\text{在 }\\,X=\\{1,2,3\\}\\,\\text{ 的所有子集上，下列哪一個集合函數是測度？}\\,",
      ...pick("μ(A) = A 中元素的和", ["μ(A) = （A 的元素個數）²", "μ(A) = A 的元素個數 + 1", "μ(A) = A 的最大元素（μ(∅) = 0）"]),
      timeLimit: 120,
      tags: ["measure-axioms", "measure"],
      hints: ["測度要滿足 μ(∅) = 0，而且不相交集合的測度可以相加。", "每個選項拿 ∅、{1}、{2}、{1,2} 代代看。"],
      solution: "元素和：μ(∅) = 0，不相交時和直接相加，是測度（就是點測度 μ({k}) = k）。個數平方：μ({1,2}) = 4 ≠ 1 + 1。個數 + 1：μ(∅) = 1 ≠ 0。最大元素：μ({1,2}) = 2 ≠ 1 + 2。",
      
      verify: { m: "choice", options: [
        { say: "μ(A) = A 中元素的和", unknown: "點測度 μ({k}) = k 的定義" },
        { say: "μ(A) = （A 的元素個數）²", all: [{ v: { m: "value", f: "2^2" }, eq: "1^2+1^2" }] },
        { say: "μ(A) = A 的元素個數 + 1", all: [{ v: { m: "value", f: "0+1" }, eq: 0 }] },
        { say: "μ(A) = A 的最大元素（μ(∅) = 0）", all: [{ v: { m: "value", f: "2" }, eq: "1+2" }] }
      ] } },
    { id: "cg-12i-015", topic: "integrals", rank: 3,
      prompt: "\\,\\text{在 }\\,\\mathbb{N}=\\{1,2,3,\\dots\\}\\,\\text{ 的所有子集上，下列哪一個集合函數是測度？}\\,",
      ...pick("μ(A) = Σ_{k∈A} 2^{−k}", ["μ(A) = Σ_{k∈A} (−1)^k", "μ(A) = 0（A 有限）、1（A 無限）", "μ(A) = (Σ_{k∈A} 2^{−k})²"]),
      timeLimit: 150,
      tags: ["measure-axioms", "measure"],
      hints: ["測度的值不能是負的，而且要可數可加（特別地，有限可加）。", "對每個誘答找兩個不相交的集合，看測度能不能相加；或找一個測度變負的集合。"],
      solution: "Σ2^{−k}：非負項的和，任意重排、分組都不變，所以可數可加。(−1)^k：μ({1}) = −1 < 0。0／1 那個：μ(偶數) + μ(奇數) = 2 ≠ μ(ℕ) = 1。平方：μ({1,2}) = 9/16 ≠ 1/4 + 1/16。",
      
      verify: { m: "choice", options: [
        { say: "μ(A) = Σ_{k∈A} 2^{−k}", unknown: "非負級數可以任意分組重排" },
        { say: "μ(A) = Σ_{k∈A} (−1)^k", all: [{ v: { m: "value", f: "(-1)^1" }, ge: 0 }] },
        { say: "μ(A) = 0（A 有限）、1（A 無限）", all: [{ v: { m: "value", f: "1" }, eq: "1+1" }] },
        { say: "μ(A) = (Σ_{k∈A} 2^{−k})²", all: [{ v: { m: "value", f: "\\left(\\frac12+\\frac14\\right)^2" }, eq: "\\left(\\frac12\\right)^2+\\left(\\frac14\\right)^2" }] }
      ] } },

    /* ── 12I Lebesgue 測度 ── */
    { id: "cg-12i-016", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\,\\text{求 }\\,m\\left(\\bigcup_{n=1}^{\\infty}\\left[n,\\ n+\\frac{1}{n(n+1)}\\right]\\right)",
      answer: "1", timeLimit: 90,
      tags: ["lebm-countable-additivity", "measure", "lebesgue"],
      hints: ["這些區間互不相交嗎？看每段的長度跟 1 比。", "不相交就可以把長度加起來；1/(n(n+1)) 可以拆成兩項的差。"],
      solution: "每段長 1/(n(n+1)) ≤ 1/2 < 1，所以 [n, n + 1/(n(n+1))] 兩兩不相交。可數可加：m = Σ 1/(n(n+1)) = Σ(1/n − 1/(n+1)) = 1。",
      
      verify: { m: "series", f: "\\frac{1}{n(n+1)}", from: 1 } },
    { id: "cg-12i-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{求 }\\,m\\left(\\bigcup_{n=1}^{\\infty}\\Big(\\left(-n-4^{-n},\\,-n\\right)\\cup\\left(n,\\,n+4^{-n}\\right)\\Big)\\right)",
      answer: "2/3", timeLimit: 120,
      tags: ["lebm-countable-additivity", "measure", "lebesgue"],
      hints: ["左右兩邊各一串小區間，都互不相交（長度都小於 1）。", "每個 n 貢獻兩段長 4^{−n}，加起來是等比級數。"],
      solution: "所有區間兩兩不相交（每段長 < 1，分別落在 (−n−1, −n) 與 (n, n+1) 裡）。m = Σ 2·4^{−n} = 2·(1/4)/(3/4) = 2/3。",
      
      verify: { m: "series", f: "2\\cdot 4^{-n}", from: 1 } },
    { id: "cg-12i-018", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\,\\text{Vitali 論證：}\\,V\\subset[0,1)\\,\\text{，對 }\\,[-1,1]\\,\\text{ 中不同的有理數 }\\,q\\,\\text{，}\\,V+q\\,\\text{ 兩兩不相交且都在 }\\,[-1,2)\\,\\text{ 裡。只取其中 }\\,N\\,\\text{ 個平移，得 }\\,N\\cdot m(V)\\le 3\\,\\text{。要讓這個上界 }\\,\\tfrac{3}{N}\\,\\text{ 小於 }\\,0.01\\,\\text{，}\\,N\\,\\text{ 最少是多少？}\\,",
      answer: "301", timeLimit: 120,
      tags: ["lebm-nonmeasurable", "measure", "lebesgue"],
      hints: ["N 個不相交的平移，每個測度都等於 m(V)（平移不變），總和不超過 [−1,2) 的長度。", "解嚴格不等式 3/N < 0.01，等號那一個不算。"],
      solution: "平移不變＋有限可加：N·m(V) ≤ m([−1,2)) = 3，所以 m(V) ≤ 3/N。3/N < 0.01 ⇔ N > 300，最少 N = 301。N 可以任意大，所以 m(V) 只能是 0；但 [0,1) ⊂ ⋃(V+q) 又要求 Σm(V+q) ≥ 1，矛盾 —— V 不可測。",
      
      verify: { m: "firstIndex", f: "\\frac{3}{n}", below: 0.01 } },
    { id: "cg-12i-019", topic: "integrals", rank: 3,
      prompt: "\\,\\text{Vitali 論證中，可數多個平移 }\\,V+q\\ (q\\in\\mathbb{Q}\\cap[-1,1])\\,\\text{ 兩兩不相交，聯集在 }\\,[-1,2)\\,\\text{ 裡。若 }\\,m(V)=a>0\\,\\text{，可數可加與平移不變給出什麼？}\\,",
      ...pick("Σ m(V+q) = a + a + ⋯ 發散，超過 3，矛盾", ["Σ m(V+q) = 3a ≤ 3，沒有矛盾", "Σ m(V+q) = a，沒有矛盾"]),
      timeLimit: 120,
      tags: ["lebm-nonmeasurable", "measure", "lebesgue"],
      hints: ["平移不變：每一個 V + q 的測度都是 a。", "[−1,1] 裡有幾個有理數？把那麼多個 a 加起來。"],
      solution: "每個 m(V+q) = a，有可數無窮多個 q，可數可加給 m(⋃) = a + a + ⋯ = ∞，但 ⋃ ⊂ [−1,2) 只有長度 3，矛盾。a = 0 時又和 [0,1) ⊂ ⋃ 矛盾，所以 V 不可測。",
      
      verify: { m: "choice", options: [
        { say: "Σ m(V+q) = a + a + ⋯ 發散，超過 3，矛盾", all: [{ v: { m: "seriesConverges", f: "0.001", from: 1 }, claim: false }] },
        { say: "Σ m(V+q) = 3a ≤ 3，沒有矛盾", all: [{ v: { m: "seriesConverges", f: "0.001", from: 1 }, claim: true }] },
        { say: "Σ m(V+q) = a，沒有矛盾", all: [{ v: { m: "seriesConverges", f: "0.001", from: 1 }, claim: true }] }
      ] } },

    /* ── 12I 零測集 ── */
    { id: "cg-12i-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{從 }\\,[0,1]\\,\\text{ 開始，第 }\\,k\\,\\text{ 步去掉「小數第 }\\,k\\,\\text{ 位是 }\\,7\\,\\text{」的數。第 }\\,n\\,\\text{ 步之後剩下的總長第一次小於 }\\,0.01\\,\\text{ 時 }\\,n\\,\\text{ 是多少？}\\,",
      answer: "44", timeLimit: 150,
      tags: ["null-cantor-type", "measure", "cantor"],
      hints: ["第 k 步從每個剩下的區間（長 10^{−(k−1)}）去掉十分之一。剩下的總長每一步乘上多少？", "解 (比例)ⁿ < 0.01，取對數。"],
      solution: "每一步剩下 9/10，n 步後總長 (0.9)ⁿ。(0.9)ⁿ < 0.01 ⇔ n > ln 0.01 / ln 0.9 ≈ 43.7，所以 n = 44。總長 → 0：小數展開不含 7 的數是零測集。",
      
      verify: { m: "firstIndex", f: "1-\\sum_{k=1}^{n}\\frac{9^{k-1}}{10^{k}}", below: 0.01 } },
    { id: "cg-12i-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{從 }\\,[0,1]\\,\\text{ 開始，每一步把每個剩下的區間五等分，去掉第 2 與第 4 段（留 3 段）。剩下的總長第一次小於 }\\,0.001\\,\\text{ 時是第幾步？}\\,",
      answer: "14", timeLimit: 150,
      tags: ["null-cantor-type", "measure", "cantor"],
      hints: ["每一步留下 5 段中的 3 段，總長乘上多少？", "解 (比例)ⁿ < 0.001。"],
      solution: "每步總長乘 3/5，n 步後 (0.6)ⁿ。(0.6)¹³ ≈ 0.00131，(0.6)¹⁴ ≈ 0.00078，所以第 14 步。極限集合的測度是 0，但它跟 Cantor 集一樣不可數。",
      
      verify: { m: "firstIndex", f: "1-\\sum_{k=1}^{n}\\frac{2\\cdot 3^{k-1}}{5^{k}}", below: 0.001 } },
    { id: "cg-12i-022", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\,\\text{求 }\\,[0,1]\\,\\text{ 中「小數展開裡至少出現一個數字 }\\,7\\,\\text{」的數所成集合的測度}\\,",
      answer: "1", timeLimit: 120,
      tags: ["null-cantor-type", "measure", "geometric-series"],
      hints: ["按「第一個 7 出現在第 k 位」分類，這些集合互不相交。", "第一個 7 在第 k 位：前 k−1 位各有 9 種選擇、第 k 位是 7。這一類的長度是多少？"],
      solution: "第一個 7 在第 k 位的數構成 9^{k−1} 個長 10^{−k} 的區間。可數可加：Σ 9^{k−1}/10^k = (1/10)/(1 − 9/10) = 1。也就是說，完全不含 7 的數是零測集。",
      
      verify: { m: "series", f: "\\frac{9^{n-1}}{10^n}", from: 1 } },
    { id: "cg-12i-023", topic: "integrals", rank: 3,
      prompt: "\\,\\text{下列哪一個 }\\,[0,1]\\,\\text{ 的子集，Lebesgue 測度不是 }\\,0\\,\\text{？}\\,",
      ...pick("第 n 步去掉 2^{n−1} 個長 5^{−n} 的開區間所剩的集合", ["Cantor 集", "[0,1] 中的有理數", "{1/n : n = 1, 2, 3, …}"]),
      timeLimit: 150,
      tags: ["null-vs-small", "measure", "cantor"],
      hints: ["可數集：第 k 個點用長 ε/2^k 的區間蓋住，總長多少？", "類 Cantor 構造：把去掉的總長算出來，跟 1 比。"],
      solution: "有理數與 {1/n} 都可數，蓋住的總長可以任意小，測度 0。Cantor 集剩下 (2/3)ⁿ → 0。去掉 2^{n−1} 個長 5^{−n} 的那個：去掉總長 Σ2^{n−1}/5ⁿ = 1/3，剩下 2/3 > 0。",
      
      verify: { m: "choice", options: [
        { say: "第 n 步去掉 2^{n−1} 個長 5^{−n} 的開區間所剩的集合", all: [{ v: fat(5), gt: 0 }] },
        { say: "Cantor 集", all: [{ v: { m: "seqLimit", f: "\\left(\\frac{2}{3}\\right)^n" }, gt: 0 }] },
        { say: "[0,1] 中的有理數", all: [{ v: { m: "seqLimit", f: "\\frac{1}{2^n}" }, gt: 0 }] },
        { say: "{1/n : n = 1, 2, 3, …}", all: [{ v: { m: "seqLimit", f: "\\frac{1}{3^n}" }, gt: 0 }] }
      ] } },
    { id: "cg-12i-024", topic: "integrals", rank: 3,
      prompt: "\\,\\text{關於 }\\,[0,1]\\,\\text{ 的子集，下列哪一句正確？}\\,",
      ...pick("有不含任何區間、測度卻大於 0 的集合", ["不可數的集合，測度一定大於 0", "在 [0,1] 中稠密的集合，測度一定是 1"]),
      timeLimit: 150,
      tags: ["null-vs-small", "measure", "cantor"],
      hints: ["「不可數」「稠密」「不含區間」跟「測度 0」是不同的事；每一句都試著找一個反例。", "想想 Cantor 集、有理數，以及去掉的總長小於 1 的類 Cantor 構造。"],
      solution: "第 n 步去掉 2^{n−1} 個長 6^{−n} 的區間：不含任何區間，測度 1 − 1/4 = 3/4 > 0，第一句對。Cantor 集不可數但測度 (2/3)ⁿ → 0；有理數稠密但測度 0。",
      
      verify: { m: "choice", options: [
        { say: "有不含任何區間、測度卻大於 0 的集合", all: [{ v: fat(6), gt: 0 }] },
        { say: "不可數的集合，測度一定大於 0", all: [{ v: { m: "seqLimit", f: "\\left(\\frac{2}{3}\\right)^n" }, gt: 0 }] },
        { say: "在 [0,1] 中稠密的集合，測度一定是 1", all: [{ v: { m: "seqLimit", f: "\\frac{1}{2^n}" }, eq: 1 }] }
      ] } },
    { id: "cg-12i-025", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "A\\,\\text{ 是 Cantor 集的任意一個子集（可能非常奇怪）。用 Cantor 構造第 }\\,n\\,\\text{ 步剩下的區間蓋住 }\\,A\\,\\text{，求 }\\,m^*(A)",
      answer: "0", timeLimit: 120,
      tags: ["null-completeness", "measure", "cantor"],
      hints: ["A ⊂ C ⊂ C_n，外測度有單調性。", "C_n 的總長隨 n 怎麼變？取下確界。"],
      solution: "m*(A) ≤ m(C_n) = (2/3)ⁿ 對每個 n 成立，所以 m*(A) = 0，A 是 Lebesgue 可測的零測集（完備性）。Cantor 集的子集有 2^𝔠 個，Borel 集只有 𝔠 個，所以其中有不是 Borel 集的。",
      
      verify: cantorLeft },

    /* ── 12I 幾乎處處 ── */
    { id: "cg-12i-026", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=(2\\cos x)^n\\ \\,\\text{在}\\,\\ [0,\\pi]\\,\\text{。求 }\\,f_n(x)\\,\\text{ 不收斂（發散或振盪）的點所成集合的測度}\\,",
      answer: "2*pi/3", timeLimit: 150,
      tags: ["ae-convergence", "measure", "lebesgue"],
      hints: ["rⁿ 在 |r| < 1 收斂到 0、r = 1 收斂到 1、其餘情形不收斂。", "解 |2cos x| ≥ 1 在 [0, π] 上的範圍，再扣掉 r = 1 的點。"],
      solution: "收斂 ⇔ −1 < 2cos x ≤ 1 ⇔ x ∈ [π/3, 2π/3)。不收斂：[0, π/3) ∪ [2π/3, π]，測度 π/3 + π/3 = 2π/3。例外集不是零測集，所以 fₙ 並不 a.e. 收斂。",
      
      verify: { m: "integral", f: step("4\\cos^2 x-1"), a: 0, b: "\\pi", breaks: ["\\pi/3", "2\\pi/3"] } },
    { id: "cg-12i-027", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=(x^2-3)^n\\ \\,\\text{在}\\,\\ [0,3]\\,\\text{。求 }\\,f_n(x)\\,\\text{ 不收斂（發散或振盪）的點所成集合的測度}\\,",
      answer: "1+sqrt(2)", timeLimit: 180,
      tags: ["ae-convergence", "measure", "lebesgue"],
      hints: ["令 r = x² − 3，rⁿ 只在 −1 < r ≤ 1 時收斂。", "把 −1 < x² − 3 ≤ 1 解成 x 的區間，再取補集。"],
      solution: "收斂 ⇔ −1 < x² − 3 ≤ 1 ⇔ 2 < x² ≤ 4 ⇔ √2 < x ≤ 2。不收斂：[0, √2] ∪ (2, 3]，測度 √2 + 1 ≈ 2.414。",
      
      verify: { m: "integral", f: step("(x^2-3)^2-1"), a: 0, b: 3, breaks: ["\\sqrt{2}", 2] } },
    { id: "cg-12i-028", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{(2x)^n}{1+(2x)^n}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{。求 }\\,\\lim_{n\\to\\infty}\\int_0^1 f_n\\,dx",
      answer: "1/2", timeLimit: 150,
      tags: ["ae-convergence", "convergence-theorem", "lebesgue"],
      hints: ["分成 2x < 1、2x = 1、2x > 1 三種情形求逐點極限。", "0 ≤ fₙ ≤ 1，可以用控制收斂；單一點的值不影響積分。"],
      solution: "fₙ → 0（x < 1/2）、1/2（x = 1/2）、1（x > 1/2）。a.e. 極限是 χ_{(1/2,1]}，例外點 {1/2} 是零測集。|fₙ| ≤ 1 可積，控制收斂：lim∫fₙ = ∫χ_{(1/2,1]} = 1/2。",
      
      verify: { m: "integralLimit", f: "1-\\frac{1}{1+(2x)^n}", a: 0, b: 1 } },
    { id: "cg-12i-029", topic: "integrals", rank: 3,
      prompt: "f=\\chi_{[0,1/2]}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{ 上。下列哪一句正確？}\\,",
      ...pick("f 幾乎處處連續，但不幾乎處處等於任何連續函數", ["f 幾乎處處等於某個連續函數", "f 在一個測度大於 0 的集合上不連續"]),
      timeLimit: 150,
      tags: ["ae-continuity-traps", "measure", "lebesgue"],
      hints: ["f 在哪些點不連續？那個集合的測度是多少？", "若 g 連續且 g = f a.e.，g 在 1/2 左邊、右邊附近分別要接近多少？"],
      solution: "f 只在 x = 1/2 不連續，所以 a.e. 連續。若 g 連續且 g = f a.e.，則 g 在 1/2 左邊稠密地取 1、右邊稠密地取 0，左右極限 1 ≠ 0，g 不連續 —— 矛盾。",
      
      verify: { m: "choice", options: [
        { say: "f 幾乎處處連續，但不幾乎處處等於任何連續函數", all: [
          { v: { m: "limit", f: "\\frac{1-\\operatorname{sgn}(x-1/2)}{2}", at: "1/2", dir: "-" }, eq: 1 },
          { v: { m: "limit", f: "\\frac{1-\\operatorname{sgn}(x-1/2)}{2}", at: "1/2", dir: "+" }, eq: 0 }] },
        { say: "f 幾乎處處等於某個連續函數", all: [{ v: { m: "let", f: "a-b", with: {
          a: { m: "limit", f: "\\frac{1-\\operatorname{sgn}(x-1/2)}{2}", at: "1/2", dir: "-" },
          b: { m: "limit", f: "\\frac{1-\\operatorname{sgn}(x-1/2)}{2}", at: "1/2", dir: "+" } } }, eq: 0 }] },
        { say: "f 在一個測度大於 0 的集合上不連續", unknown: "不連續點只有 1/2" }
      ] } },
    { id: "cg-12i-030", topic: "integrals", rank: 3,
      prompt: "\\,\\text{Dirichlet 函數 }\\,\\chi_{\\mathbb{Q}}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{ 上。下列哪一句正確？}\\,",
      ...pick("χ_ℚ 幾乎處處等於連續函數 0，但它處處不連續", ["χ_ℚ 幾乎處處連續", "∫₀¹ χ_ℚ dm = 1"]),
      timeLimit: 150,
      tags: ["ae-continuity-traps", "measure", "lebesgue"],
      hints: ["ℚ ∩ [0,1] 的測度是多少？用「第 k 個有理數蓋一個長 ε/2^k 的區間」估計。", "任一點附近同時有有理數與無理數，函數值在 0 與 1 之間跳。"],
      solution: "m(ℚ∩[0,1]) = 0，所以 χ_ℚ = 0 a.e.，∫ = 0。但每一點附近都同時有有理數與無理數，χ_ℚ 處處不連續 —— 「a.e. 等於連續函數」不推出「a.e. 連續」。",
      
      verify: { m: "choice", options: [
        { say: "χ_ℚ 幾乎處處等於連續函數 0，但它處處不連續", all: [{ v: { m: "seqLimit", f: "\\frac{1}{2^n}" }, eq: 0 }] },
        { say: "χ_ℚ 幾乎處處連續", unknown: "處處不連續，數值上無法取樣" },
        { say: "∫₀¹ χ_ℚ dm = 1", all: [{ v: { m: "seqLimit", f: "\\frac{1}{2^n}" }, eq: 1 }] }
      ] } },
    { id: "cg-12i-031", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=x^2\\ (x\\notin\\mathbb{Q}),\\quad f(x)=5\\ (x\\in\\mathbb{Q})\\,\\text{。求 }\\,\\int_0^3 f\\,dx",
      answer: "9", timeLimit: 75,
      tags: ["ae-equal-functions", "measure", "lebesgue"],
      hints: ["f 跟哪個簡單的函數只在一個零測集上不同？", "a.e. 相等的函數積分相同。"],
      solution: "f 只在 ℚ（零測集）上跟 x² 不同，所以 f = x² a.e.，∫₀³ f dm = ∫₀³ x² dx = 9。",
      
      verify: { m: "integral", f: "x^2", a: 0, b: 3 } },
    { id: "cg-12i-032", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C\\,\\text{ 是 Cantor 集。}\\,g(x)=100\\ (x\\in C),\\quad g(x)=e^x\\ (x\\in[0,1]\\setminus C)\\,\\text{。求 }\\,\\int_0^1 g\\,dx",
      answer: "e-1", timeLimit: 90,
      tags: ["ae-equal-functions", "measure", "cantor"],
      hints: ["Cantor 集雖然不可數，它的測度是多少？", "g 幾乎處處等於哪個連續函數？"],
      solution: "m(C) = 0，所以 g = eˣ a.e.，∫₀¹ g dm = ∫₀¹ eˣ dx = e − 1。在 C 上改成多大的值都不影響。",
      
      verify: { m: "integral", f: "e^x", a: 0, b: 1 } },

    /* ── 12I 可測函數 ── */
    { id: "cg-12i-033", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=\\sin x\\ \\,\\text{在}\\,\\ [0,2\\pi]\\,\\text{。求 }\\,m\\left(\\{x:\\ f(x)>-\\tfrac12\\}\\right)",
      answer: "4*pi/3", timeLimit: 90,
      tags: ["measf-preimage-compute", "measure", "trig"],
      hints: ["先解 sin x = −1/2 在 [0, 2π] 的兩個解。", "sin x 在兩個解之間小於 −1/2，其他地方大於。"],
      solution: "sin x = −1/2 在 x = 7π/6、11π/6。sin x > −1/2 的集合是 [0, 7π/6) ∪ (11π/6, 2π]，長度 7π/6 + π/6 = 4π/3。",
      
      verify: { m: "integral", f: step("\\sin x+\\frac12"), a: 0, b: "2\\pi", breaks: ["7\\pi/6", "11\\pi/6"] } },
    { id: "cg-12i-034", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^2-2x\\ \\,\\text{在}\\,\\ [-1,4]\\,\\text{。求 }\\,m\\left(\\{x:\\ f(x)>1\\}\\right)",
      answer: "5-2*sqrt(2)", timeLimit: 120,
      tags: ["measf-preimage-compute", "measure", "quadratic"],
      hints: ["解 x² − 2x − 1 = 0。", "拋物線開口向上，> 1 的部分在兩根外側；再跟 [−1, 4] 取交集。"],
      solution: "x² − 2x − 1 > 0 ⇔ x < 1 − √2 或 x > 1 + √2。與 [−1,4] 交：[−1, 1−√2) 長 2 − √2，(1+√2, 4] 長 3 − √2，合計 5 − 2√2 ≈ 2.172。",
      
      verify: { m: "integral", f: step("x^2-2x-1"), a: -1, b: 4, breaks: ["1-\\sqrt{2}", "1+\\sqrt{2}"] } },
    { id: "cg-12i-035", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x-\\lfloor x\\rfloor\\ \\,\\text{在}\\,\\ [0,5]\\,\\text{。求 }\\,m\\left(\\{x:\\ f(x)>0.7\\}\\right)",
      answer: "1.5", timeLimit: 90,
      tags: ["measf-preimage-compute", "measure", "floor-function"],
      hints: ["f 是小數部分，在每個 [k, k+1) 上從 0 長到接近 1。", "每個單位區間裡 f > 0.7 的部分多長？有幾個單位區間？"],
      solution: "在 [k, k+1) 上 f(x) = x − k，f > 0.7 ⇔ x ∈ (k + 0.7, k + 1)，長 0.3。k = 0,…,4 共 5 段：1.5。",
      
      verify: { m: "integral", f: step("x-\\lfloor x\\rfloor-0.7"), a: 0, b: 5, breaks: [0.7, 1, 1.7, 2, 2.7, 3, 3.7, 4, 4.7] } },
    { id: "cg-12i-036", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{n}{n+1}x^2\\ \\,\\text{在}\\,\\ [0,2]\\,\\text{。用 }\\,\\{\\sup_n f_n>1\\}=\\bigcup_n\\{f_n>1\\}\\,\\text{ 求這個集合的測度}\\,",
      answer: "1", timeLimit: 150,
      tags: ["measf-closure", "measure", "lebesgue"],
      hints: ["先解 {fₙ > 1}：它是 [0,2] 裡的一個區間，寫出左端點。", "這些集合對 n 遞增，聯集的測度是測度的極限（由下連續）。"],
      solution: "{fₙ > 1} = (√((n+1)/n), 2]，測度 2 − √((n+1)/n)，對 n 遞增。由下連續：m(⋃) = lim (2 − √(1 + 1/n)) = 1。（sup fₙ = x²，集合是 (1, 2]。）",
      
      verify: { m: "seqLimit", f: "2-\\sqrt{1+\\frac{1}{n}}" } },
    { id: "cg-12i-037", topic: "integrals", rank: 3,
      prompt: "\\,\\text{證明 }\\,\\sup_n f_n\\,\\text{ 可測時用的是哪個等式？用 }\\,f_n(x)=\\frac{n}{n+1}x\\ (0\\le x\\le 1),\\ a=\\tfrac12\\,\\text{ 檢查}\\,",
      ...pick("{sup fₙ > a} = ⋃ₙ {fₙ > a}", ["{sup fₙ > a} = ⋂ₙ {fₙ > a}", "{sup fₙ > a} = {f₁ > a}"]),
      timeLimit: 150,
      tags: ["measf-closure", "measure", "lebesgue"],
      hints: ["sup fₙ(x) > a 的意思是：「至少有一個 n」讓 fₙ(x) > a。", "例子裡 sup fₙ = x；算 {sup fₙ > 1/2} 與各選項右邊的集合的測度比一比。"],
      solution: "sup fₙ(x) > a ⇔ 存在 n 使 fₙ(x) > a，所以是聯集；可數個可測集的聯集可測。例子：{sup > 1/2} = (1/2, 1] 測度 1/2；{fₙ > 1/2} 的測度 1 − (n+1)/(2n) 遞增到 1/2。{f₁ > 1/2} = {x/2 > 1/2} = ∅，⋂ 也是 ∅，測度 0 ≠ 1/2。",
      
      verify: { m: "choice", options: [
        { say: "{sup fₙ > a} = ⋃ₙ {fₙ > a}", all: [{ v: { m: "seqLimit", f: "1-\\frac{n+1}{2n}" }, eq: { m: "integral", f: step("x-\\frac12"), a: 0, b: 1, breaks: [0.5] } }] },
        { say: "{sup fₙ > a} = ⋂ₙ {fₙ > a}", all: [{ v: { m: "integral", f: step("\\frac{x}{2}-\\frac12"), a: 0, b: 1 }, eq: { m: "integral", f: step("x-\\frac12"), a: 0, b: 1, breaks: [0.5] } }] },
        { say: "{sup fₙ > a} = {f₁ > a}", all: [{ v: { m: "integral", f: step("\\frac{x}{2}-\\frac12"), a: 0, b: 1 }, eq: { m: "integral", f: step("x-\\frac12"), a: 0, b: 1, breaks: [0.5] } }] }
      ] } },
    { id: "cg-12i-038", topic: "integrals", rank: 3,
      prompt: "\\,\\text{已知 }\\,g\\circ f\\,\\text{ 可測。}\\,g\\,\\text{ 取下列哪一個時，一定能推出 }\\,f\\,\\text{ 也可測？}\\,",
      ...pick("g(t) = t³", ["g(t) = t²", "g(t) = |t|", "g(t) = cos t"]),
      timeLimit: 150,
      tags: ["measf-counterexample", "measure", "lebesgue"],
      hints: ["如果 g 有連續的反函數，f = g⁻¹∘(g∘f) 是「連續函數 ∘ 可測函數」。", "若 g 把兩個不同的值送到同一處，取不可測集 V，讓 f 在 V 上取一個值、在 V 外取另一個。"],
      solution: "t³ 嚴格遞增、反函數 t^{1/3} 連續，f = (g∘f)^{1/3} 可測。t²、|t|：g(1) = g(−1)，令 f = 1 在 V（不可測）、−1 在 V 外，g∘f ≡ 1 可測而 f 不可測。cos：cos 0 = cos 2π，同樣的構造。",
      
      verify: { m: "choice", options: [
        { say: "g(t) = t³", all: [{ v: { m: "value", f: "1^3-(-1)^3" }, ne: 0 }] },
        { say: "g(t) = t²", all: [{ v: { m: "value", f: "1^2-(-1)^2" }, ne: 0 }] },
        { say: "g(t) = |t|", all: [{ v: { m: "value", f: "\\left|1\\right|-\\left|-1\\right|" }, ne: 0 }] },
        { say: "g(t) = cos t", all: [{ v: { m: "value", f: "\\cos 0-\\cos(2\\pi)" }, ne: 0 }] }
      ] } },
    { id: "cg-12i-039", topic: "integrals", rank: 3,
      prompt: "\\,\\text{已知 }\\,f^2\\,\\text{ 可測（}\\,f\\,\\text{ 本身未必）。下列哪一個一定可測？}\\,",
      ...pick("|f|", ["f", "f⁺ = (f + |f|)/2"]),
      timeLimit: 120,
      tags: ["measf-counterexample", "measure", "lebesgue"],
      hints: ["哪一個可以寫成「連續函數 ∘ f²」？", "f = 1 與 f = −1 給出同一個 f²；看選項在這兩個值上是否一樣。"],
      solution: "|f| = √(f²) 是連續函數 ∘ 可測函數，可測。f = χ_V − χ_{V^c}（V 不可測）時 f² ≡ 1 可測，但 f 不可測；此時 f⁺ = χ_V 也不可測。",
      
      verify: { m: "choice", options: [
        { say: "|f|", all: [{ v: { m: "value", f: "\\left|1\\right|-\\left|-1\\right|" }, eq: 0 }] },
        { say: "f", all: [{ v: { m: "value", f: "1-(-1)" }, eq: 0 }] },
        { say: "f⁺ = (f + |f|)/2", all: [{ v: { m: "value", f: "\\frac{1+\\left|1\\right|}{2}-\\frac{-1+\\left|-1\\right|}{2}" }, eq: 0 }] }
      ] } },

    /* ── 12K 單調收斂 ── */
    { id: "cg-12k-001", topic: "integrals", rank: 3,
      prompt: "\\,\\text{在 }\\,[0,1]\\,\\text{ 上，下列哪一列可以直接套用單調收斂定理（非負、逐點遞增）？}\\,",
      ...pick("fₙ(x) = Σ_{k=0}^{n} x^k/k!", ["fₙ(x) = n xⁿ", "fₙ(x) = −x/n", "fₙ(x) = n x e^{−nx}"]),
      timeLimit: 150,
      tags: ["mct-hypothesis-check", "monotone-convergence", "convergence-theorem"],
      hints: ["兩個條件分開檢查：fₙ ≥ 0？fₙ₊₁(x) ≥ fₙ(x)？", "拿一個具體的 x（例如 0.4 或 1）比較 f₁ 與 f₂。"],
      solution: "Σ_{k≤n} xᵏ/k!：每項 ≥ 0，多加一項只會變大，遞增到 eˣ，lim∫ = e − 1。n xⁿ：x = 0.4 時 f₂ = 0.32 < f₁ = 0.4。−x/n 是負的。n x e^{−nx}：x = 1 時 f₂ = 2e^{−2} < f₁ = e^{−1}。",
      
      verify: { m: "choice", options: [
        { say: "fₙ(x) = Σ_{k=0}^{n} x^k/k!", all: [{ v: { m: "integralLimit", f: "\\sum_{k=0}^{n}\\frac{x^k}{k!}", a: 0, b: 1, n0: 5, levels: 5 }, eq: "e-1" }] },
        { say: "fₙ(x) = n xⁿ", all: [{ v: { m: "value", f: "2\\cdot 0.4^2" }, ge: 0.4 }] },
        { say: "fₙ(x) = −x/n", all: [{ v: { m: "value", f: "-\\frac{0.5}{1}" }, ge: 0 }] },
        { say: "fₙ(x) = n x e^{−nx}", all: [{ v: { m: "value", f: "2e^{-2}" }, ge: "e^{-1}" }] }
      ] } },
    { id: "cg-12k-002", topic: "integrals", rank: 3,
      prompt: "g_n(x)=\\left(1-\\frac{x}{n}\\right)^n\\ (0\\le x\\le n),\\quad g_n(x)=0\\ (x>n)\\,\\text{。下列哪一句正確？}\\,",
      ...pick("gₙ ≥ 0 且對 n 遞增，可用單調收斂：lim∫₀^∞ gₙ dm = 1", ["gₙ 對 n 不遞增，單調收斂用不上", "lim∫₀^∞ gₙ dm = 0：面積跑到無窮遠"]),
      timeLimit: 180,
      tags: ["mct-hypothesis-check", "monotone-convergence", "convergence-theorem"],
      hints: ["固定 x，(1 − x/n)ⁿ 對 n 是遞增的；拿 x = 1 比較 n = 2 與 n = 3。", "逐點極限是 e^{−x}，它在 [0, ∞) 的積分是多少？"],
      solution: "固定 x，(1 − x/n)ⁿ 對 n 遞增（例：x = 1 時 1/4 < 8/27），且 gₙ ≥ 0、→ e^{−x}。單調收斂：lim∫gₙ = ∫₀^∞ e^{−x} = 1。直接算 ∫₀ⁿ(1 − x/n)ⁿ dx = n/(n+1) → 1 也吻合。",
      
      verify: { m: "choice", options: [
        { say: "gₙ ≥ 0 且對 n 遞增，可用單調收斂：lim∫₀^∞ gₙ dm = 1", all: [
          { v: { m: "value", f: "\\left(1-\\frac13\\right)^3" }, ge: "\\left(1-\\frac12\\right)^2" },
          { v: { m: "integralLimit", f: "\\left(1-\\frac{x}{n}\\right)^n\\cdot\\frac{1+\\operatorname{sgn}(n-x)}{2}", a: 0, b: 100 }, eq: 1 }] },
        { say: "gₙ 對 n 不遞增，單調收斂用不上", all: [{ v: { m: "value", f: "\\left(1-\\frac13\\right)^3" }, lt: "\\left(1-\\frac12\\right)^2" }] },
        { say: "lim∫₀^∞ gₙ dm = 0：面積跑到無窮遠", all: [{ v: { m: "integralLimit", f: "\\left(1-\\frac{x}{n}\\right)^n\\cdot\\frac{1+\\operatorname{sgn}(n-x)}{2}", a: 0, b: 100 }, eq: 0 }] }
      ] } },
    { id: "cg-12k-003", topic: "integrals", rank: 4,
      prompt: "f_n(x)=\\left(1+\\frac{x}{n}\\right)^{-n}\\ \\,\\text{在}\\,\\ [0,\\infty)\\ (n\\ge 2)\\,\\text{。下列哪一句正確？}\\,",
      ...pick("fₙ 對 n 遞減，遞增版的單調收斂用不上；但 lim∫fₙ = ∫e^{−x} = 1 仍成立", ["fₙ 對 n 遞增，單調收斂直接給 lim∫fₙ = 1", "lim∫fₙ = ∞"]),
      timeLimit: 180,
      tags: ["mct-hypothesis-check", "monotone-convergence", "convergence-theorem"],
      hints: ["(1 + x/n)ⁿ 對 n 遞增，所以它的倒數呢？用 x = 1、n = 2, 3 驗證。", "f₂ = (1 + x/2)^{−2} 可積，可以拿來當控制函數。"],
      solution: "(1 + x/n)ⁿ ↑ eˣ，所以 fₙ ↓ e^{−x}：遞減，遞增版單調收斂不能直接用。但 0 ≤ fₙ ≤ f₂ 可積，控制收斂（或對 f₂ − fₙ 用單調收斂）給 lim∫fₙ = 1。直接算：∫₀^∞ fₙ = n/(n−1) → 1。",
      
      verify: { m: "choice", options: [
        { say: "fₙ 對 n 遞減，遞增版的單調收斂用不上；但 lim∫fₙ = ∫e^{−x} = 1 仍成立", all: [
          { v: { m: "value", f: "\\left(1+\\frac13\\right)^{-3}" }, lt: "\\left(1+\\frac12\\right)^{-2}" },
          { v: { m: "integralLimit", f: "\\left(1+\\frac{x}{n}\\right)^{-n}", a: 0, b: 2000 }, eq: 1 }] },
        { say: "fₙ 對 n 遞增，單調收斂直接給 lim∫fₙ = 1", all: [{ v: { m: "value", f: "\\left(1+\\frac13\\right)^{-3}" }, ge: "\\left(1+\\frac12\\right)^{-2}" }] },
        { say: "lim∫fₙ = ∞", all: [{ v: { m: "integralLimit", f: "\\left(1+\\frac{x}{n}\\right)^{-n}", a: 0, b: 2000 }, gt: 1000 }] }
      ] } },
    { id: "cg-12k-004", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{x}{e^{3x}-1}\\,dx",
      answer: "pi^2/54", timeLimit: 240,
      tags: ["mct-series-termwise", "monotone-convergence", "improper-integral"],
      hints: ["1/(e^{3x} − 1) = e^{−3x}/(1 − e^{−3x}) = Σ_{k≥1} e^{−3kx}，每一項都非負。", "∫₀^∞ x e^{−ax} dx = 1/a²；Σ 1/k² = π²/6。"],
      solution: "x/(e^{3x} − 1) = Σ_{k≥1} x e^{−3kx}，每項非負，單調收斂允許逐項積分：Σ 1/(9k²) = (1/9)(π²/6) = π²/54 ≈ 0.1828。"},
    { id: "cg-12k-005", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^1\\frac{-\\ln x}{1-x^2}\\,dx",
      answer: "pi^2/8", timeLimit: 240,
      tags: ["mct-series-termwise", "monotone-convergence", "improper-integral"],
      hints: ["1/(1 − x²) = Σ_{k≥0} x^{2k}，而 −ln x ≥ 0：每一項都非負。", "∫₀¹ x^m(−ln x) dx = 1/(m+1)²。"],
      solution: "−ln x/(1 − x²) = Σ_{k≥0} x^{2k}(−ln x)，各項非負，單調收斂逐項積分：Σ 1/(2k+1)² = π²/8 ≈ 1.2337。"},

    /* ── 12K Fatou ── */
    { id: "cg-12k-006", topic: "integrals", rank: 3,
      prompt: "\\,\\text{Fatou 引理（}\\,f_n\\ge 0\\,\\text{ 可測）說的是哪一個？用 }\\,f_n(x)=\\frac{n}{1+n^2x^2}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{ 上檢查}\\,",
      ...pick("∫ liminf fₙ ≤ liminf ∫ fₙ", ["∫ liminf fₙ ≥ liminf ∫ fₙ", "∫ liminf fₙ = liminf ∫ fₙ"]),
      timeLimit: 150,
      tags: ["fatou-statement", "fatou", "convergence-theorem"],
      hints: ["例子裡：x > 0 時 fₙ(x) → ?；∫₀¹ fₙ 用 arctan 算。", "比較兩邊的數，看哪個方向的不等號一定對。"],
      solution: "x > 0 時 fₙ(x) → 0，所以 ∫liminf fₙ = 0；∫₀¹ fₙ = arctan n → π/2。0 < π/2：「≥」與「=」都被推翻。Fatou：∫liminf ≤ liminf∫，面積只會在極限時流失，不會憑空多出來。",
      
      verify: { m: "choice", options: [
        { say: "∫ liminf fₙ ≤ liminf ∫ fₙ", all: [{ v: { m: "integralLimit", f: "\\frac{n}{1+n^2x^2}", a: 0, b: 1 }, ge: 0 }] },
        { say: "∫ liminf fₙ ≥ liminf ∫ fₙ", all: [{ v: { m: "integralLimit", f: "\\frac{n}{1+n^2x^2}", a: 0, b: 1 }, le: 0 }] },
        { say: "∫ liminf fₙ = liminf ∫ fₙ", all: [{ v: { m: "integralLimit", f: "\\frac{n}{1+n^2x^2}", a: 0, b: 1 }, eq: 0 }] }
      ] } },
    { id: "cg-12k-007", topic: "integrals", rank: 3,
      prompt: "f_n(x)=-n^2xe^{-nx}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{。Fatou 的結論 }\\,\\int\\liminf f_n\\le\\liminf\\int f_n\\,\\text{ 對這一列成立嗎？}\\,",
      ...pick("不成立：左邊 0、右邊 −1；因為 fₙ 不是非負", ["成立：Fatou 對任何可測函數列都對", "成立：兩邊都是 0"]),
      timeLimit: 150,
      tags: ["fatou-statement", "fatou", "convergence-theorem"],
      hints: ["逐點極限：x > 0 時 −n²xe^{−nx} → ?", "∫₀¹ n²xe^{−nx} dx 用分部積分，n → ∞ 時趨近多少？"],
      solution: "x > 0 時 fₙ(x) → 0，左邊 0。∫₀¹ fₙ = −(1 − (n+1)e^{−n}) → −1，右邊 −1。0 ≤ −1 不成立：Fatou 需要 fₙ ≥ 0（或有可積的下界）。",
      
      verify: { m: "choice", options: [
        { say: "不成立：左邊 0、右邊 −1；因為 fₙ 不是非負", all: [{ v: { m: "integralLimit", f: "-n^2xe^{-nx}", a: 0, b: 1 }, eq: -1 }] },
        { say: "成立：Fatou 對任何可測函數列都對", all: [{ v: { m: "integralLimit", f: "-n^2xe^{-nx}", a: 0, b: 1 }, ge: 0 }] },
        { say: "成立：兩邊都是 0", all: [{ v: { m: "integralLimit", f: "-n^2xe^{-nx}", a: 0, b: 1 }, eq: 0 }] }
      ] } },
    { id: "cg-12k-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=x^2+n^2xe^{-nx}\\ (0\\le x\\le 2)\\,\\text{ 逐點收斂到 }\\,f\\,\\text{。Fatou 給 }\\,\\int_0^2 f\\,dx\\le L\\,\\text{，}\\,L=\\liminf_{n\\to\\infty}\\int_0^2 f_n\\,dx\\,\\text{。求 }\\,L",
      answer: "11/3", timeLimit: 180,
      tags: ["fatou-upper-bound", "fatou", "convergence-theorem"],
      hints: ["把積分拆成 ∫x² 與 ∫n²xe^{−nx} 兩塊。", "第二塊用 u = nx 代換，n → ∞ 時趨近 ∫₀^∞ u e^{−u} du。"],
      solution: "∫₀² x² = 8/3；∫₀² n²xe^{−nx} dx = 1 − (2n+1)e^{−2n} → 1。L = 8/3 + 1 = 11/3。真正的 ∫f = ∫x² = 8/3 < 11/3：尖峰的面積在極限時流失。",
      
      verify: { m: "integralLimit", f: "x^2+n^2xe^{-nx}", a: 0, b: 2 } },
    { id: "cg-12k-009", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f_n(x)=\\sqrt{x}+n^3x^2e^{-nx}\\ (0\\le x\\le 1)\\,\\text{ 逐點收斂到 }\\,f\\,\\text{。Fatou 的上界 }\\,L=\\liminf\\int_0^1 f_n\\,dx\\,\\text{ 比真正的 }\\,\\int_0^1 f\\,dx\\,\\text{ 大多少？}\\,",
      answer: "2", timeLimit: 210,
      tags: ["fatou-upper-bound", "fatou", "convergence-theorem"],
      hints: ["先求逐點極限 f：x > 0 時 n³x²e^{−nx} → ?", "∫₀¹ n³x²e^{−nx} dx 用 u = nx 代換，極限是 ∫₀^∞ u²e^{−u} du。"],
      solution: "f = √x（x > 0），∫₀¹ f = 2/3。∫₀¹ n³x²e^{−nx} dx = ∫₀ⁿ u²e^{−u} du → 2，所以 L = 2/3 + 2 = 8/3。差 = 8/3 − 2/3 = 2。",
      
      verify: { m: "let", f: "a-b", with: { a: { m: "integralLimit", f: "\\sqrt{x}+n^3x^2e^{-nx}", a: 0, b: 1 }, b: { m: "integral", f: "\\sqrt{x}", a: 0, b: 1 } } } },
    { id: "cg-12k-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=e^{-(x-n)^2}\\ \\,\\text{在}\\,\\ [0,\\infty)\\,\\text{。逐點 }\\,f_n\\to 0\\,\\text{。求 }\\,\\lim_{n\\to\\infty}\\int_0^{\\infty}f_n\\,dx",
      answer: "sqrt(pi)", timeLimit: 150,
      tags: ["fatou-mass-escape", "fatou", "convergence-theorem"],
      hints: ["fₙ 是一個高斯鐘形，中心在 x = n。n 變大時它往哪裡走？", "代換 u = x − n，積分下限變成 −n。"],
      solution: "∫₀^∞ e^{−(x−n)²} dx = ∫_{−n}^∞ e^{−u²} du → ∫_{−∞}^∞ e^{−u²} du = √π。面積整塊往無窮遠移動：∫lim fₙ = 0 < √π。",
      
      verify: { m: "integralLimit", f: "e^{-(x-n)^2}", a: 0, b: 400, n0: 10, levels: 6 } },
    { id: "cg-12k-011", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f_n(x)=1+\\sin(nx)\\ \\,\\text{在}\\,\\ [0,2\\pi]\\,\\text{（}\\,\\liminf f_n=0\\,\\text{ a.e.）。求 }\\,\\liminf_{n\\to\\infty}\\int_0^{2\\pi}f_n\\,dx",
      answer: "2*pi", timeLimit: 90,
      tags: ["fatou-mass-escape", "fatou", "convergence-theorem"],
      hints: ["sin(nx) 在 [0, 2π] 上剛好跑完 n 個週期。", "所以 ∫₀^{2π} sin(nx) dx 是多少？"],
      solution: "∫₀^{2π}(1 + sin nx) dx = 2π + 0 = 2π，對每個 n 都一樣，liminf = 2π。而 fₙ 在 0 與 2 之間來回跳，liminf fₙ = 0 a.e.，∫liminf = 0 < 2π：面積是「來回跳」掉的。",
      
      verify: { m: "integralLimit", f: "1+\\sin(nx)", a: 0, b: "2\\pi" } },

    /* ── 12K 控制收斂 ── */
    { id: "cg-12k-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\int_0^{\\infty}\\frac{n\\sin(x/n)}{x(1+x^2)}\\,dx",
      answer: "pi/2", timeLimit: 180,
      tags: ["dct-limit-compute", "convergence-theorem", "improper-integral"],
      hints: ["|sin t| ≤ |t|，所以 |n sin(x/n)| ≤ x。", "先找控制函數，再把極限搬進積分：逐點極限是什麼？"],
      solution: "|n sin(x/n)/(x(1+x²))| ≤ 1/(1+x²)，可積。逐點 n sin(x/n) → x，被積函數 → 1/(1+x²)。控制收斂：極限 = ∫₀^∞ dx/(1+x²) = π/2。",
      
      verify: { m: "integralLimit", f: "\\frac{n\\sin(x/n)}{x(1+x^2)}", a: 0, b: 1000000 } },
    { id: "cg-12k-013", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\int_0^{n}\\left(1-\\frac{x}{n}\\right)^n e^{x/3}\\,dx",
      answer: "3/2", timeLimit: 210,
      tags: ["dct-limit-compute", "convergence-theorem", "improper-integral"],
      hints: ["把積分寫成 [0, ∞) 上、乘上 χ_{[0,n]}；用 1 − t ≤ e^{−t} 找控制函數。", "控制函數 e^{−x}·e^{x/3} 可積嗎？逐點極限是什麼？"],
      solution: "0 ≤ (1 − x/n)ⁿχ_{[0,n]} ≤ e^{−x}，所以被積函數 ≤ e^{−2x/3}，可積。逐點 → e^{−x}e^{x/3} = e^{−2x/3}。控制收斂：極限 = ∫₀^∞ e^{−2x/3} dx = 3/2。",
      
      verify: { m: "integralLimit", f: "\\left(1-\\frac{x}{n}\\right)^n e^{x/3}\\cdot\\frac{1+\\operatorname{sgn}(n-x)}{2}", a: 0, b: 200 } },
    { id: "cg-12k-014", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\int_0^{\\infty}n\\ln\\left(1+\\frac{x}{n}\\right)e^{-2x}\\,dx",
      answer: "1/4", timeLimit: 210,
      tags: ["dct-limit-compute", "convergence-theorem", "improper-integral"],
      hints: ["ln(1 + t) ≤ t，所以 n ln(1 + x/n) ≤ x。", "控制函數 x e^{−2x} 可積；逐點極限 n ln(1 + x/n) → ?"],
      solution: "0 ≤ n ln(1 + x/n) ≤ x，被積函數 ≤ x e^{−2x}，可積。逐點 n ln(1 + x/n) → x。控制收斂：極限 = ∫₀^∞ x e^{−2x} dx = 1/4。",
      
      verify: { m: "integralLimit", f: "n\\ln\\left(1+\\frac{x}{n}\\right)e^{-2x}", a: 0, b: 60 } },
    { id: "cg-12k-015", topic: "integrals", rank: 3,
      prompt: "f_n(x)=\\frac{\\sin(nx)}{1+x^2}\\ \\,\\text{在}\\,\\ [0,\\infty)\\,\\text{。下列哪一個是可積的控制函數 }\\,g\\ (|f_n|\\le g)\\,\\text{？}\\,",
      ...pick("g(x) = 1/(1+x²)", ["g(x) = 1", "g(x) = 1/x", "g(x) = 1/x²"]),
      timeLimit: 150,
      tags: ["dct-find-dominator", "convergence-theorem", "improper-integral"],
      hints: ["四個選項都壓得住 |fₙ|；關鍵是哪一個在 [0, ∞) 上積分有限。", "分別檢查 x → 0 附近與 x → ∞ 的尾巴。"],
      solution: "|sin(nx)| ≤ 1 ⇒ |fₙ| ≤ 1/(1+x²)，∫₀^∞ = π/2 < ∞。g = 1：∫₀^∞ 1 = ∞。g = 1/x：兩端都發散。g = 1/x²：在 0 附近發散。",
      
      verify: { m: "choice", options: [
        { say: "g(x) = 1/(1+x²)", all: [{ v: { m: "improperConverges", f: "\\frac{1}{1+x^2}", a: 0, b: "inf" }, claim: true }] },
        { say: "g(x) = 1", all: [{ v: { m: "improperConverges", f: "1", a: 0, b: "inf" }, claim: true }] },
        { say: "g(x) = 1/x", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x}", a: 0, b: "inf", sing: [0] }, claim: true }] },
        { say: "g(x) = 1/x²", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x^2}", a: 0, b: "inf", sing: [0] }, claim: true }] }
      ] } },
    { id: "cg-12k-016", topic: "integrals", rank: 3,
      prompt: "f_n(x)=\\frac{\\cos^n x}{\\sqrt{x}}\\ \\,\\text{在}\\,\\ (0,1]\\,\\text{。下列哪一個是可積的控制函數 }\\,g\\ (|f_n|\\le g)\\,\\text{？}\\,",
      ...pick("g(x) = 1/√x", ["g(x) = 1/x", "g(x) = cos x / x", "g(x) = x^{−3/2}"]),
      timeLimit: 150,
      tags: ["dct-find-dominator", "convergence-theorem", "improper-integral"],
      hints: ["在 (0, 1] 上 0 < cos x ≤ 1，所以 |cosⁿx| ≤ 1。", "比較各選項在 x → 0⁺ 的冪次：x^{−p} 在 0 附近可積 ⇔ p < 1。"],
      solution: "|fₙ| ≤ 1/√x，∫₀¹ x^{−1/2} dx = 2 < ∞。1/x、cos x/x（在 0 附近 ≈ 1/x）、x^{−3/2} 的冪次 ≥ 1，在 0 附近不可積。之後控制收斂給 lim∫fₙ = 0。",
      
      verify: { m: "choice", options: [
        { say: "g(x) = 1/√x", all: [{ v: { m: "improperConverges", f: "x^{-1/2}", a: 0, b: 1, sing: [0] }, claim: true }] },
        { say: "g(x) = 1/x", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x}", a: 0, b: 1, sing: [0] }, claim: true }] },
        { say: "g(x) = cos x / x", all: [{ v: { m: "improperConverges", f: "\\frac{\\cos x}{x}", a: 0, b: 1, sing: [0] }, claim: true }] },
        { say: "g(x) = x^{−3/2}", all: [{ v: { m: "improperConverges", f: "x^{-3/2}", a: 0, b: 1, sing: [0] }, claim: true }] }
      ] } },
    { id: "cg-12k-017", topic: "integrals", rank: 3,
      prompt: "f_n(x)=\\frac{1}{1+x^n}\\ \\,\\text{在}\\,\\ [0,2]\\,\\text{。求 }\\,\\lim\\int_0^2 f_n\\,\\text{ 時，哪一個說法正確？}\\,",
      ...pick("控制收斂：|fₙ| ≤ 1，lim∫₀² fₙ = 1", ["單調收斂：fₙ 對 n 遞增", "lim∫₀² fₙ = 1/2（因為 fₙ(1) = 1/2）"]),
      timeLimit: 150,
      tags: ["dct-hypothesis-check", "convergence-theorem", "dominated-convergence"],
      hints: ["分 x < 1、x = 1、x > 1 求逐點極限；在 x = 1.5 比較 f₁ 與 f₂。", "0 ≤ fₙ ≤ 1，常數 1 在 [0, 2] 上可積。"],
      solution: "fₙ → 1（x < 1）、1/2（x = 1）、0（x > 1）。在 (1, 2] 上 fₙ 遞減（x = 1.5：f₁ = 0.4 > f₂ ≈ 0.31），不能用單調收斂。|fₙ| ≤ 1 可積，控制收斂：lim∫ = m([0,1)) = 1；x = 1 一個點不影響。",
      
      verify: { m: "choice", options: [
        { say: "控制收斂：|fₙ| ≤ 1，lim∫₀² fₙ = 1", all: [{ v: { m: "integralLimit", f: "\\frac{1}{1+x^n}", a: 0, b: 2 }, eq: 1 }] },
        { say: "單調收斂：fₙ 對 n 遞增", all: [{ v: { m: "value", f: "\\frac{1}{1+1.5^2}" }, ge: "\\frac{1}{1+1.5}" }] },
        { say: "lim∫₀² fₙ = 1/2（因為 fₙ(1) = 1/2）", all: [{ v: { m: "integralLimit", f: "\\frac{1}{1+x^n}", a: 0, b: 2 }, eq: 0.5 }] }
      ] } },
    { id: "cg-12k-018", topic: "integrals", rank: 4,
      prompt: "f_n(x)=n^2x^3e^{-nx^2}\\ \\,\\text{在}\\,\\ [0,1]\\,\\text{。逐點 }\\,f_n\\to 0\\,\\text{。哪一個說法正確？}\\,",
      ...pick("只有 Fatou 能用：∫lim fₙ = 0 ≤ lim∫fₙ = 1/2，找不到可積的控制函數", ["控制收斂：lim∫fₙ = ∫lim fₙ = 0", "單調收斂：fₙ 對 n 遞增"]),
      timeLimit: 210,
      tags: ["dct-hypothesis-check", "convergence-theorem", "fatou"],
      hints: ["算 ∫₀¹ fₙ：代換 u = nx²。", "若有可積的控制函數，控制收斂會給 lim∫ = ∫lim = 0。跟實際算出來的比。"],
      solution: "u = nx²：∫₀¹ fₙ = (1/2)∫₀ⁿ u e^{−u} du → 1/2 ≠ 0，所以不存在可積的控制函數（否則極限會是 0）。x = 1：f₂ = 4e^{−2} ≈ 0.54 > f₃ = 9e^{−3} ≈ 0.45，不遞增。只剩 Fatou：0 ≤ 1/2。",
      
      verify: { m: "choice", options: [
        { say: "只有 Fatou 能用：∫lim fₙ = 0 ≤ lim∫fₙ = 1/2，找不到可積的控制函數", all: [{ v: { m: "integralLimit", f: "n^2x^3e^{-nx^2}", a: 0, b: 1 }, eq: 0.5 }] },
        { say: "控制收斂：lim∫fₙ = ∫lim fₙ = 0", all: [{ v: { m: "integralLimit", f: "n^2x^3e^{-nx^2}", a: 0, b: 1 }, eq: 0 }] },
        { say: "單調收斂：fₙ 對 n 遞增", all: [{ v: { m: "value", f: "9e^{-3}" }, ge: "4e^{-2}" }] }
      ] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), answerKind: problem.answerKind || "numeric", ...problem })));
})();
