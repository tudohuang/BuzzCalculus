// Buzz Skill Graph — 技巧知識圖譜
//
// 為什麼要這個檔：題庫有 361 個 tag，但那不是能力模型能用的座標系。
// tag 是「出題時順手貼的標籤」，混了技巧、題型、題包來源、難度標記；
// 而能力模型需要的是「數量夠、語意穩、彼此有前後關係」的技巧節點。
//
// 這個檔把 tag 收斂成約 80 個 skill 節點，並定義前置關係。
// 只涵蓋微積分：理科已於 2026-08 移出本站（見 BuzzPhysics）。
//
// 設計規則：
//   1. 純資料 + 純函數。不碰 DOM、不碰 localStorage、不吃 Date.now()。
//   2. 一個 skill 由「tags 命中 且 topic 相符」決定，topics 留空代表不限主題。
//      （taylor 這個 tag 同時出現在極限題與級數題，必須靠 topics 分開，
//        否則極限題會被算成級數技巧。）
//   3. 每個 skill 至少要覆蓋 MIN_PROBLEMS 題，否則統計沒有意義 —— 由
//      tools/validate_skill_graph.js 在 CI 擋住。
//   4. prereq 的 tier 必須嚴格小於自己，且整張圖無環。
//
// 這個檔不決定「要練什麼」（那是 planner），也不算精熟度（那是 ability）。

(function () {
  "use strict";

  // ── 非技巧 tag ────────────────────────────────────────────────
  // 題包來源、難度標記、考試類型。這些是抽題用的 key，不是能力座標。
  // 明列出來（而不是靠猜）才能讓驗證器分辨「還沒對應的技巧 tag」和
  // 「本來就不該對應的標記」。
  const NON_SKILL_TAGS = new Set([
    // 校準層自動產生
    "rank-1", "rank-2", "rank-3", "rank-4", "rank-5", "rank-6",
    "boss-rank", "boss-plus", "beginner-friendly",
    // 題包 / 來源
    "todai-burst", "world-universities", "competition", "damo", "putnam",
    "true-boss", "hardcore", "long-form", "depth-r5", "depth-r6",
    "series-boss",
    // 考試類型（是情境不是技巧）
    "exam-style", "exam-depth", "transfer-exam", "proficiency-exam",
    "midterm-style", "university-exam-style",
    // 練習型態
    "technique-recognition", "technique-sprint", "trap-drill",
    "beginner-foundation", "mobile-sprint",
    // 過於籠統，無法當能力座標（函數型態而非解題技巧）
    "multivariable", "algebra", "polynomial", "power", "quadratic",
    "rational", "radical", "exponential", "trig", "log", "estimate",
    "application", "applications", "derivative", "limit", "series",
    "special-function", "special-functions", "vector-calculus",
    "definite-integral", "basic-derivative",
    "region", "constraint", "degenerate",
    "cancellation", "repeated-factor", "complete-square", "symmetry",
    "full-expansion", "product", "slope", "speed", "harmonic", "triangle",
    // 描述題目的性質，不是可以被練起來的技巧：
    //   composition    這題是合成函數（要用的技巧是鏈鎖律，那個有自己的節點）
    //   domain-aware   這題的答案要考慮定義域
    //   repeated-root  這題的根是重根（陷阱的位置，不是能力座標）
    "composition", "domain-aware", "repeated-root",
    //   even-function  函數的對稱性，是題目的性質不是能力座標（跟 symmetry 同一類）
    "even-function"
  ]);

  // ── Skill 節點 ────────────────────────────────────────────────
  // tier: 1 入門 → 5 進階。prereq 的 tier 必須更小。
  // radarAxis 對應 app.js 既有的 8 軸雷達，可留空（那 8 軸本來就沒涵蓋全部）。
  const SKILLS = [
    /* ===== 極限 ===== */
    { id: "limit.direct", label: "基本極限", tier: 1, obscurity: 1, family: "limit", topics: ["limits"], prereq: [],
      tags: ["standard-limit", "direct-substitution", "factoring", "rational-limit"] },
    { id: "limit.rationalize", label: "有理化", tier: 2, obscurity: 1, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["rationalize"] },
    { id: "limit.trig", label: "三角極限", tier: 2, obscurity: 1, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["trig-limit", "half-angle"] },
    { id: "limit.exponential", label: "指數 / 對數極限", tier: 2, obscurity: 2, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["exponential-limit", "power-exponential", "log-limit", "log-expansion", "hyperbolic", "indeterminate"] },
    { id: "limit.lhopital", label: "L'Hôpital", tier: 2, obscurity: 1, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["lhopital"] },
    { id: "limit.taylor", label: "Taylor 求極限", tier: 3, obscurity: 2, family: "limit", topics: ["limits"], prereq: ["limit.direct"], radarAxis: "taylor",
      tags: ["taylor", "nested-taylor", "composite-taylor", "series-expansion"] },
    { id: "limit.asymptotic", label: "漸近分析", tier: 4, obscurity: 2, family: "limit", topics: ["limits"], prereq: ["limit.taylor"], radarAxis: "taylor",
      tags: ["asymptotics", "asymptotic", "asymptotic-balance", "asymptotic-expansion",
        "infinity-limit", "infinity", "stirling", "boundary-layer", "stolz",
        "cesaro", "euler-mascheroni", "nth-root"] },
    { id: "limit.squeeze", label: "夾擠與有界", tier: 2, obscurity: 1, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["squeeze", "dne", "periodicity", "product-limit", "oscillation"] },
    { id: "limit.riemann", label: "Riemann 和極限", tier: 3, obscurity: 2, family: "limit", prereq: ["limit.direct"],
      tags: ["riemann-sum"] },
    { id: "limit.trap", label: "極限陷阱", tier: 3, obscurity: 2, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      tags: ["limit-trap", "hard-limit"] },
    { id: "limit.continuity", label: "連續性與 IVT", tier: 2, obscurity: 1, family: "limit", prereq: ["limit.direct"],
      // domain / rational-function：判定「哪些 x 可以代進去」跟判定連續性
      // 是同一件事的兩個問法，同一個技巧節點。
      tags: ["continuity", "ivt", "removable-singularity", "asymptote", "domain", "rational-function"] },
    { id: "limit.sequence", label: "數列極限", tier: 2, obscurity: 1, family: "limit", prereq: ["limit.direct"],
      // 無窮乘積放這裡而不是自成一節：∏ 的定義就是部分乘積這個**數列**的極限，
      // 遞迴、巢狀根式、連分數同理 —— 它們共用「先確定收斂，再對遞迴式取極限」這一步。
      tags: ["sequence", "recursive", "recurrence", "nested-radical", "continued-fraction",
        "fixed-point", "newton", "infinite-product"] },
    { id: "limit.discontinuous", label: "單邊極限與跳躍", tier: 3, obscurity: 2, family: "limit", topics: ["limits"], prereq: ["limit.direct"],
      // 高斯括號與單邊極限合成一個節點：兩者練的是同一件事 ——
      // 函數在不連續點附近的行為，只能用不等式夾，不能代進去也不能展開。
      tags: ["floor", "one-sided"] },

    /* ===== 微分 ===== */
    { id: "diff.basic", label: "基本微分律", tier: 1, obscurity: 1, family: "diff", topics: ["derivatives"], prereq: [],
      tags: ["product-rule", "quotient-rule", "power-rule"] },
    { id: "diff.chain", label: "鏈鎖律", tier: 2, obscurity: 1, family: "diff", prereq: ["diff.basic"],
      tags: ["chain-rule"] },
    // 「認出這個極限就是導數」和「這一點到底可不可微」是同一件事的兩面：
    // 兩者都要回到差商的定義去看，而不是套微分表。所以合成一個節點。
    { id: "diff.definition", label: "導數定義與可微性", tier: 2, obscurity: 1, family: "diff", topics: ["derivatives"], prereq: ["diff.basic"],
      tags: ["derivative-definition", "differentiability"] },
    { id: "diff.log", label: "對數微分", tier: 3, obscurity: 2, family: "diff", prereq: ["diff.chain"],
      tags: ["log-differentiation", "logarithmic-differentiation"] },
    { id: "diff.inverse", label: "反函數 / 反三角微分", tier: 3, obscurity: 1, family: "diff", topics: ["derivatives"], prereq: ["diff.chain"],
      tags: ["inverse-trig", "inverse-function"] },
    { id: "diff.parametric", label: "參數微分", tier: 3, obscurity: 2, family: "diff", prereq: ["diff.chain"],
      tags: ["parametric", "parametric-differentiation"] },
    { id: "diff.higher", label: "高階導數", tier: 3, obscurity: 1, family: "diff", prereq: ["diff.chain"], radarAxis: "taylor",
      tags: ["higher-derivative", "second-derivative", "leibniz-rule"] },
    { id: "diff.higher.extreme", label: "超高階導數", tier: 5, obscurity: 3, family: "diff", prereq: ["diff.higher"], radarAxis: "taylor",
      tags: ["super-high-derivative"] },
    { id: "diff.shape", label: "曲線分析與中值定理", tier: 2, obscurity: 1, family: "diff", prereq: ["diff.basic"],
      // curve-sketching / extrema 歸在這裡而不是列成非技巧：
      // 「把 f′、f″ 合起來看出形狀」就是曲線分析這個技巧本身，
      // 而且這樣選圖題才會算進能力模型（列成非技巧的話它們對雷達是隱形的）。
      tags: ["concavity", "inflection", "critical-point", "critical-points", "derivative-zero",
        "first-derivative", "monotonicity", "tangent-normal", "curve-sketching", "extrema",
        "mvt", "rolle", "curvature"] },
    { id: "diff.optimize", label: "最佳化", tier: 3, obscurity: 1, family: "diff", prereq: ["diff.shape"],
      tags: ["optimization"] },
    { id: "diff.related", label: "隱微分與相關變率", tier: 3, obscurity: 1, family: "diff", prereq: ["diff.chain"],
      tags: ["implicit-differentiation", "related-rates"] },
    { id: "diff.approx", label: "線性近似 / 牛頓法", tier: 2, obscurity: 1, family: "diff", prereq: ["diff.basic"],
      tags: ["linear-approximation", "linearization", "newton-method"] },
    { id: "diff.applied", label: "應用情境題", tier: 3, obscurity: 1, family: "diff", prereq: ["diff.basic"],
      // kinematics 是微積分的運動應用題（位移-速度-加速度的微分積分關係），
      // 不是物理題 —— 理科移出之後它留在這裡是對的。
      tags: ["story-problem", "marginal", "kinematics", "exponential-growth",
        "newton-cooling", "mixing", "half-life", "logistic"] },
    { id: "diff.graph", label: "圖形判讀", tier: 2, obscurity: 1, family: "diff", prereq: [],
      tags: ["graph-reading"] },

    /* ===== 多變數微分 ===== */
    { id: "mvcalc.partial", label: "偏導與多變數極限", tier: 3, obscurity: 1, family: "mvcalc", prereq: ["diff.chain"], radarAxis: "multivariable",
      tags: ["partial-derivative", "mixed-partial", "path-test", "multivariable-limit"] },
    { id: "mvcalc.total", label: "全微分", tier: 4, obscurity: 1, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["total-differential", "total-differential-min"] },
    { id: "mvcalc.directional", label: "方向導數 / 梯度", tier: 4, obscurity: 1, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["directional-derivative", "gradient"] },
    { id: "mvcalc.hessian", label: "Hessian 判別", tier: 4, obscurity: 2, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["hessian"] },
    { id: "mvcalc.jacobian", label: "Jacobian", tier: 4, obscurity: 2, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["jacobian", "jacobian-chain"] },
    { id: "mvcalc.lagrange", label: "Lagrange 乘子", tier: 4, obscurity: 2, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["lagrange-multiplier"] },
    { id: "mvcalc.wronskian", label: "Wronskian", tier: 4, obscurity: 2, family: "mvcalc", prereq: ["diff.higher"],
      tags: ["wronskian", "linear-independence"] },
    { id: "mvcalc.nabla", label: "Nabla 運算", tier: 4, obscurity: 2, family: "mvcalc", prereq: ["mvcalc.partial"], radarAxis: "multivariable",
      tags: ["nabla", "laplacian", "vector-identity"] },

    /* ===== 積分：基本技巧 ===== */
    { id: "integral.basic", label: "基本反導數", tier: 1, obscurity: 1, family: "integral", topics: ["integrals"], prereq: [],
      tags: ["basic-integral", "standard-integral"] },
    { id: "integral.usub", label: "u-substitution", tier: 1, obscurity: 1, family: "integral", prereq: [], radarAxis: "substitution",
      tags: ["substitution", "u-sub"] },
    { id: "integral.ibp", label: "分部積分", tier: 2, obscurity: 1, family: "integral", prereq: ["integral.usub"], radarAxis: "ibp",
      tags: ["integration-by-parts", "ibp"] },
    { id: "integral.ibp.cyclic", label: "循環分部", tier: 4, obscurity: 2, family: "integral", prereq: ["integral.ibp"], radarAxis: "ibp",
      tags: ["multi-ibp", "recurrence-formula", "reduction-formula"] },
    { id: "integral.partialfrac", label: "部分分式", tier: 2, obscurity: 1, family: "integral", prereq: ["integral.usub"], radarAxis: "partial_fraction",
      tags: ["partial-fraction", "partial-fractions", "rational-integral"] },
    { id: "integral.trigsub", label: "三角代換", tier: 3, obscurity: 2, family: "integral", prereq: ["integral.usub"], radarAxis: "substitution",
      tags: ["trig-substitution"] },
    { id: "integral.trig", label: "三角與雙曲積分", tier: 2, obscurity: 1, family: "integral", topics: ["integrals"], prereq: ["integral.usub"],
      tags: ["trig-integral", "trig-power", "hyperbolic"] },
    { id: "integral.ftc", label: "微積分基本定理", tier: 2, obscurity: 1, family: "integral", prereq: [],
      tags: ["ftc", "fundamental-theorem", "moving-limits"] },

    /* ===== 積分：進階技巧 ===== */
    { id: "integral.improper", label: "瑕積分", tier: 3, obscurity: 2, family: "integral", prereq: ["integral.usub"], radarAxis: "improper",
      tags: ["improper-integral"] },
    { id: "integral.frullani", label: "Frullani", tier: 4, obscurity: 3, family: "integral", prereq: ["integral.improper"], radarAxis: "improper",
      tags: ["frullani"] },
    { id: "integral.kings", label: "King's Property", tier: 3, obscurity: 2, family: "integral", prereq: ["integral.usub"], radarAxis: "improper",
      tags: ["kings-property"] },
    { id: "integral.parameter", label: "參數微分 / Feynman", tier: 5, obscurity: 3, family: "integral", prereq: ["integral.improper"], radarAxis: "improper",
      tags: ["parameter-integral", "feynman"] },
    { id: "integral.beta", label: "Beta 函數", tier: 4, obscurity: 2, family: "integral", prereq: ["integral.improper"], radarAxis: "special",
      tags: ["beta-function"] },
    { id: "integral.gamma", label: "Gamma 函數", tier: 4, obscurity: 2, family: "integral", prereq: ["integral.improper"], radarAxis: "special",
      tags: ["gamma-function", "gamma"] },
    { id: "integral.wallis", label: "Wallis", tier: 3, obscurity: 2, family: "integral", prereq: ["integral.trig"], radarAxis: "special",
      tags: ["wallis"] },
    { id: "integral.log", label: "對數型積分", tier: 4, obscurity: 2, family: "integral", topics: ["integrals"], prereq: ["integral.ibp"],
      tags: ["log-integral", "log-sine", "sophomore-dream"] },
    { id: "integral.dirichlet", label: "Dirichlet 型振盪積分", tier: 5, obscurity: 3, family: "integral", prereq: ["integral.improper"], radarAxis: "improper",
      tags: ["dirichlet", "dirichlet-beta", "dirichlet-integral", "cosine-integral",
        "fourier", "parseval", "weierstrass"] },
    { id: "integral.special", label: "特殊常數積分", tier: 5, obscurity: 3, family: "integral", prereq: ["integral.improper"], radarAxis: "special",
      tags: ["dilogarithm", "ahmed-integral", "eta", "fermi", "poisson", "central-limit",
        "probability", "gaussian", "gaussian-integral", "series-integral"] },

    /* ===== 積分：多重與應用 ===== */
    { id: "integral.double", label: "二重積分", tier: 3, obscurity: 1, family: "integral", prereq: ["integral.usub"], radarAxis: "multivariable",
      tags: ["double-integral", "iterated-integral", "change-order"] },
    { id: "integral.triple", label: "三重積分", tier: 4, obscurity: 1, family: "integral", prereq: ["integral.double"], radarAxis: "multivariable",
      tags: ["triple-integral", "simplex"] },
    { id: "integral.changevars", label: "變數變換", tier: 4, obscurity: 2, family: "integral", prereq: ["integral.double"], radarAxis: "substitution",
      tags: ["change-of-variables", "polar-coordinates", "cylindrical-coordinates",
        "spherical-coordinates", "spherical"] },
    { id: "integral.area", label: "面積與極座標", tier: 3, obscurity: 1, family: "integral", prereq: ["integral.ftc"],
      tags: ["area", "polar-area", "polar", "polar-curve"] },
    { id: "integral.volume", label: "體積與旋轉體", tier: 3, obscurity: 1, family: "integral", prereq: ["integral.ftc"],
      tags: ["solid-of-revolution", "volume", "surface-area", "centroid"] },
    { id: "integral.arclength", label: "弧長與均值", tier: 3, obscurity: 1, family: "integral", prereq: ["integral.ftc"],
      tags: ["arc-length", "average-value", "work-integral"] },

    /* ===== 向量分析 ===== */
    { id: "vector.line", label: "線積分與保守場", tier: 3, obscurity: 1, family: "vector", prereq: ["integral.usub"], radarAxis: "multivariable",
      tags: ["line-integral", "conservative-field"] },
    { id: "vector.green", label: "Green 定理", tier: 4, obscurity: 2, family: "vector", prereq: ["vector.line"], radarAxis: "multivariable",
      tags: ["green-theorem"] },
    { id: "vector.surface", label: "面積分與通量", tier: 4, obscurity: 2, family: "vector", prereq: ["integral.double"], radarAxis: "multivariable",
      tags: ["surface-integral", "flux"] },
    { id: "vector.divergence", label: "Stokes 與散度定理", tier: 5, obscurity: 2, family: "vector", prereq: ["vector.surface"], radarAxis: "multivariable",
      tags: ["divergence-theorem", "stokes-theorem"] },

    /* ===== 級數 ===== */
    { id: "series.geometric", label: "等比與 p 級數", tier: 1, obscurity: 1, family: "series", prereq: [], radarAxis: "series",
      tags: ["geometric-series", "p-series", "harmonic-number"] },
    { id: "series.telescoping", label: "望遠鏡級數", tier: 2, obscurity: 2, family: "series", prereq: ["series.geometric"], radarAxis: "series",
      tags: ["telescoping", "telescoping-series"] },
    { id: "series.ratio", label: "比值判別", tier: 2, obscurity: 1, family: "series", prereq: ["series.geometric"], radarAxis: "series",
      tags: ["ratio-test"] },
    { id: "series.root", label: "根值判別", tier: 2, obscurity: 1, family: "series", prereq: ["series.geometric"], radarAxis: "series",
      tags: ["root-test"] },
    { id: "series.compare", label: "比較判別", tier: 2, obscurity: 1, family: "series", prereq: ["series.geometric"], radarAxis: "series",
      tags: ["comparison", "limit-comparison", "integral-test", "term-test", "convergence-test", "series-test"] },
    { id: "series.alternating", label: "交錯級數", tier: 3, obscurity: 1, family: "series", prereq: ["series.compare"], radarAxis: "series",
      tags: ["alternating-series", "alternating", "absolute-conditional"] },
    { id: "series.power.radius", label: "冪級數收斂範圍", tier: 3, obscurity: 1, family: "series", prereq: ["series.ratio"], radarAxis: "series",
      // 收斂區間的端點要不要算進去，正是這個技巧最容易錯的地方
      tags: ["power-series", "radius", "radius-of-convergence", "endpoint-analysis",
        "interval-of-convergence", "endpoint"] },
    { id: "series.taylor.coeff", label: "Taylor 係數", tier: 4, obscurity: 2, family: "series", topics: ["series", "derivatives"], prereq: ["series.power.radius"], radarAxis: "taylor",
      tags: ["taylor", "coefficient", "binomial", "binomial-series", "euler-number"] },
    { id: "series.sum", label: "級數求和", tier: 4, obscurity: 2, family: "series", prereq: ["series.telescoping"], radarAxis: "series",
      tags: ["sum-series", "special-sum", "exponential-series", "log-series"] },
    { id: "series.euler", label: "Euler 和與 zeta", tier: 5, obscurity: 3, family: "series", prereq: ["series.sum"], radarAxis: "series",
      tags: ["zeta", "euler-sum", "central-binomial", "mittag-leffler"] },
    { id: "series.generating", label: "生成函數", tier: 5, obscurity: 3, family: "series", prereq: ["series.power.radius"], radarAxis: "series",
      tags: ["generating-function"] },

    /* ===== 進階工具 ===== */
    { id: "adv.complex", label: "複變基礎", tier: 4, obscurity: 2, family: "adv", prereq: ["diff.chain"],
      tags: ["complex", "cauchy-riemann", "complex-derivative", "real-part",
        "imaginary-part", "modulus"] },
    { id: "adv.residue", label: "留數定理", tier: 5, obscurity: 3, family: "adv", prereq: ["adv.complex"], radarAxis: "special",
      tags: ["residue", "laurent", "contour", "contour-integral"] },
    { id: "adv.ode.first", label: "一階 ODE", tier: 3, obscurity: 1, family: "adv", prereq: ["integral.usub"], radarAxis: "improper",
      tags: ["ode-intro", "separable", "first-order", "integrating-factor"] },
    { id: "adv.ode.second", label: "二階 ODE 與積分變換", tier: 4, obscurity: 2, family: "adv", prereq: ["adv.ode.first"], radarAxis: "improper",
      tags: ["second-order", "ode-style", "laplace-transform", "laplace", "convolution"] },
    { id: "adv.bessel", label: "Bessel 與特殊方程", tier: 5, obscurity: 3, family: "adv", prereq: ["adv.ode.second"], radarAxis: "special",
      tags: ["bessel"] }
  ];

  // ── 索引 ──────────────────────────────────────────────────────
  const byId = new Map();
  const tagIndex = new Map(); // tag -> skill[]
  SKILLS.forEach((skill) => {
    byId.set(skill.id, skill);
    skill.tags.forEach((tag) => {
      if (!tagIndex.has(tag)) tagIndex.set(tag, []);
      tagIndex.get(tag).push(skill);
    });
  });

  function isSkillTag(tag) {
    return !NON_SKILL_TAGS.has(tag) && !/^rank-\d$/.test(tag);
  }

  // 早期題目沒有技巧 tag，補標表（src/kernel/skill_tags.js）用 id 直接指定
  // skill。刻意每次查詢時才讀，這樣兩個檔案的載入順序就無所謂；
  // 補標表缺席時整個機制靜默降級成純 tag 比對，不會壞。
  function overridesFor(problemId) {
    const table =
      (typeof window !== "undefined" && window.BUZZ_SKILL_TAGS) ||
      (typeof globalThis !== "undefined" && globalThis.BUZZ_SKILL_TAGS) ||
      null;
    return (table && table[problemId]) || [];
  }

  // 一題的 skill = 「tag 命中 且 topic 相符」的所有節點，再聯集補標表。
  // topics 留空代表該技巧不限主題（例如 riemann-sum 同時出現在極限與積分）。
  function skillsForProblem(problem) {
    if (!problem) return [];
    const hit = new Set();
    (problem.tags || []).forEach((tag) => {
      (tagIndex.get(tag) || []).forEach((skill) => {
        if (skill.topics && !skill.topics.includes(problem.topic)) return;
        hit.add(skill.id);
      });
    });
    overridesFor(problem.id).forEach((id) => {
      if (byId.has(id)) hit.add(id);
    });
    return Array.from(hit);
  }

  function tagToSkills(tag, topic) {
    return (tagIndex.get(tag) || [])
      .filter((skill) => !topic || !skill.topics || skill.topics.includes(topic))
      .map((skill) => skill.id);
  }

  // 前置鏈：回傳所有祖先（含間接），已去重。
  function ancestors(id, seen = new Set()) {
    const skill = byId.get(id);
    if (!skill) return [];
    skill.prereq.forEach((parent) => {
      if (seen.has(parent)) return;
      seen.add(parent);
      ancestors(parent, seen);
    });
    return Array.from(seen);
  }

  const api = {
    version: 1,
    skills: SKILLS,
    byId: (id) => byId.get(id) || null,
    ids: () => SKILLS.map((s) => s.id),
    families: () => Array.from(new Set(SKILLS.map((s) => s.family))),
    nonSkillTags: NON_SKILL_TAGS,
    isSkillTag,
    skillsForProblem,
    tagToSkills,
    ancestors,
    label: (id) => (byId.get(id) || {}).label || id
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzSkillGraph = api;
})();
