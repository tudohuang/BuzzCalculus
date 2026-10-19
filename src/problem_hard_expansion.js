(function () {
  "use strict";

  const SOURCE = "Buzz hard expansion";
  const hardProblems = [];

  function add(problem) {
    hardProblems.push({
      source: SOURCE,
      difficulty: 4,
      rank: 5,
      timeLimit: 120,
      tabLimit: 1,
      hints: ["Identify the structure before calculating."],
      ...problem
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, rank = 5, timeLimit = 120) {
    add({
      id,
      topic,
      rank,
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      timeLimit
    });
  }

  function text(id, topic, prompt, answers, canonical, tags, solution, rank = 5, timeLimit = 80) {
    add({
      id,
      topic,
      rank,
      prompt,
      answerKind: "text",
      answers,
      canonical,
      tags,
      solution,
      timeLimit
    });
  }

  [
    ["rel-hard-lim-001", "\\lim_{x\\to0}\\frac{\\sin x-x+x^3/6-x^5/120}{x^7}", "-1/5040", "Use the x^7 term of sin x."],
    ["rel-hard-lim-002", "\\lim_{x\\to0}\\frac{\\tan x-x-x^3/3-2x^5/15}{x^7}", "17/315", "Use the x^7 term of tan x."],
    ["rel-hard-lim-003", "\\lim_{x\\to0}\\frac{\\ln(1+x)-x+x^2/2-x^3/3+x^4/4}{x^5}", "1/5", "Use the x^5 term of log(1+x)."],
    ["rel-hard-lim-004", "\\lim_{x\\to0}\\frac{e^x+e^{-x}-2-x^2-x^4/12}{x^6}", "1/360", "Use the even expansion of e^x+e^{-x}."],
    ["rel-hard-lim-007", "\\lim_{(x,y)\\to(0,0)}\\frac{1-\\cos(xy)}{x^2y^2}", "1/2", "Use 1-cos u ~ u^2/2."],
    ["rel-hard-lim-008", "\\lim_{(x,y)\\to(0,0)}\\frac{e^{x^2+y^2}-1}{x^2+y^2}", "1", "Use e^u-1 ~ u."],
    ["rel-hard-lim-009", "\\lim_{x\\to0}\\frac{\\arctan x-x+x^3/3}{x^5}", "1/5", "Use arctan x=x-x^3/3+x^5/5-..."],
    ["rel-hard-lim-010", "\\lim_{n\\to\\infty}n^2\\left(\\left(1+\\frac1n\\right)^n-e+\\frac{e}{2n}\\right)", "11*e/24", "The second correction term is 11e/(24n^2)."]
  ].forEach(([id, prompt, answer, solution]) => {
    numeric(id, "limits", prompt, answer, ["taylor", "limit-trap", "boss-rank"], solution, 5, 95);
  });

  text("rel-hard-lim-006", "limits", "\\lim_{(x,y)\\to(0,0)}\\frac{x^2y^2}{(x^2+y^2)^2}", ["dne", "does not exist", "no limit"], "DNE", ["path-test", "multivariable", "boss-rank"], "Along y=0 the limit is 0; along y=x it is 1/4.", 5, 80);

  [
    ["rel-hard-ser-001", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}\\frac{(2n)!}{(n!)^2}x^n", "1/4", ["power-series", "ratio-test"], "The central binomial coefficient grows like 4^n."],
    ["rel-hard-ser-002", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}\\frac{(n!)^2}{(2n)!}x^n", "4", ["power-series", "ratio-test"], "This is the reciprocal central binomial scale."],
    ["rel-hard-ser-004", "\\text{coefficient of }x^{10}\\text{ in }\\sin(x^2)", "1/120", ["taylor", "coefficient"], "Use sin u=u-u^3/6+u^5/120-... with u=x^2."],
    ["rel-hard-ser-005", "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)(n+3)}", "1/18", ["telescoping", "series-boss"], "Write it as a telescoping difference of triple products."],
    ["rel-hard-ser-008", "\\sum_{n=1}^{\\infty}\\frac{1}{4n^2-1}", "1/2", ["telescoping", "partial-fraction"], "Use 1/(4n^2-1)=1/2(1/(2n-1)-1/(2n+1))."],
    ["rel-hard-ser-012", "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{n^n}{n!}x^n", "1/e", ["power-series", "ratio-test"], "The nth root of n^n/n! tends to e."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "series", prompt, answer, [...tags, "boss-rank"], solution, 5, 100);
  });

  text("rel-hard-ser-010", "series", "\\sum_{n=1}^{\\infty}\\frac{n^n}{n!}", ["divergent", "diverges"], "divergent", ["term-test", "series-boss"], "The terms do not tend to 0.", 5);
  text("rel-hard-ser-011", "series", "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}\\text{ at the endpoint}", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["endpoint-analysis", "alternating"], "Alternating test gives convergence; p=1/2 gives no absolute convergence.", 5);

  [
    ["rel-hard-int-001", "\\int_0^{\\infty}x^5e^{-2x}\\,dx", "15/8", ["gamma-function", "improper-integral"], "Use Gamma(6)/2^6."],
    ["rel-hard-int-002", "\\int_0^{\\infty}x^{3/2}e^{-4x}\\,dx", "3*sqrt(pi)/128", ["gamma-function", "improper-integral"], "This is Gamma(5/2)/4^{5/2}."],
    ["rel-hard-int-004", "\\int_0^1x^3(\\ln x)^2\\,dx", "1/32", ["parameter-integral", "gamma-function"], "Use int_0^1 x^a(log x)^2 dx=2/(a+1)^3."],
    ["rel-hard-int-005", "\\int_0^{\\pi/2}\\sin^8x\\,dx", "35*pi/256", ["wallis", "special-functions"], "Use Wallis reduction."],
    ["rel-hard-int-007", "\\int_0^{\\pi/2}\\sin^4x\\cos^2x\\,dx", "pi/32", ["beta-function", "wallis"], "Convert to one half of a beta integral."],
    ["rel-hard-int-008", "\\int_0^{\\infty}\\frac{e^{-3x}-e^{-11x}}{x}\\,dx", "log(11/3)", ["frullani", "improper-integral"], "Frullani gives log(11/3)."],
    ["rel-hard-int-009", "\\int_0^{\\infty}\\frac{\\cos(4x)-\\cos(10x)}{x}\\,dx", "log(5/2)", ["frullani", "cosine-integral"], "Use the cosine Frullani identity."],
    ["rel-hard-int-011", "\\int_0^{\\infty}\\frac{x}{x^4+1}\\,dx", "pi/4", ["improper-integral", "substitution"], "Let u=x^2."],
    ["rel-hard-int-012", "\\int_0^{\\infty}\\frac{dx}{x^4+1}", "pi/(2*sqrt(2))", ["improper-integral", "residue"], "The standard quartic integral equals pi/(2sqrt2)."],
    ["rel-hard-int-015", "\\int_0^1x^{-1/2}\\ln x\\,dx", "-4", ["parameter-integral", "improper-integral"], "Use int_0^1 x^{a-1} log x dx=-1/a^2."],
    ["rel-hard-int-017", "\\int_0^{\\pi/2}(\\ln(\\sin x)+\\ln(\\cos x))\\,dx", "-pi*log(2)", ["kings-property", "improper-integral"], "Both log sine and log cosine integrals equal -pi log2 /2."],
    ["rel-hard-int-018", "\\int_0^{\\infty}\\frac{dx}{(x^2+4)^2}", "pi/32", ["improper-integral", "trig-substitution"], "Use int_0^infty dx/(x^2+a^2)^2=pi/(4a^3)."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "integrals", prompt, answer, [...tags, "boss-rank"], solution, 5, 125);
  });

  [
    ["rel-hard-cpx-001", "\\operatorname{Res}_{z=0}\\frac{\\sin z}{z^4}", "-1/6", "Use the z^3 coefficient of sin z."],
    ["rel-hard-cpx-002", "\\operatorname{Res}_{z=0}\\frac{\\cos z}{z^3}", "-1/2", "Use the z^2 coefficient of cos z."],
    ["rel-hard-cpx-003", "\\operatorname{Res}_{z=0}\\frac{e^z-1-z}{z^4}", "1/6", "Use the z^3 coefficient of e^z-1-z."],
    ["rel-hard-cpx-004", "\\operatorname{Res}_{z=0}\\frac{\\ln(1+z)}{z^3}", "-1/2", "Use the z^2 coefficient of log(1+z)."],
    ["rel-hard-cpx-005", "\\operatorname{Res}_{z=0}\\frac{1}{z^2(1-z)}", "1", "Expand 1/(1-z)."],
    ["rel-hard-cpx-006", "\\operatorname{Res}_{z=1}\\frac{e^z}{(z-1)^2}", "e", "For a second-order pole, take the derivative of e^z."],
    ["rel-hard-cpx-007", "\\operatorname{Res}_{z=0}\\frac{z}{\\sin^2z}", "1", "Use csc^2 z=1/z^2+..."],
    ["rel-hard-cpx-008", "\\operatorname{Res}_{z=0}\\cot z", "1", "cot z has residue 1 at 0."],
    ["rel-hard-cpx-009", "\\operatorname{Res}_{z=0}\\frac{e^{2z}-1}{z^3}", "2", "Use the z^2 coefficient of e^{2z}-1."],
    ["rel-hard-cpx-010", "\\operatorname{Res}_{z=0}\\frac{1-\\cos z-z^2/2}{z^5}", "-1/24", "Use the z^4 coefficient of 1-cos z-z^2/2."]
  ].forEach(([id, prompt, answer, solution]) => {
    numeric(id, "integrals", prompt, answer, ["complex", "residue", "boss-plus"], solution, 6, 115);
  });

  [
    ["rel-hard-mv-001", "integrals", "\\iint_{x,y\\ge0,\\ x+y\\le1}x^2y\\,dA", "1/60", ["double-integral", "simplex"], "Use the two-dimensional simplex formula.", 5],
    ["rel-hard-mv-002", "integrals", "\\iint_{x^2+y^2\\le1}x^2y^2\\,dA", "pi/24", ["double-integral", "polar"], "Use polar coordinates and integrate cos^2 theta sin^2 theta."],
    ["rel-hard-mv-003", "integrals", "\\iiint_{x^2+y^2+z^2\\le1}(x^2+y^2+z^2)\\,dV", "4*pi/5", ["triple-integral", "spherical"], "Use spherical coordinates."],
    ["rel-hard-mv-004", "integrals", "\\iiint_{x^2+y^2+z^2\\le9}1\\,dV", "36*pi", ["triple-integral", "spherical"], "Volume of a ball of radius 3."],
    ["rel-hard-mv-005", "derivatives", "\\frac{\\partial(u,v)}{\\partial(x,y)}\\text{ at }(2,1),\\quad u=\\frac{x}{y},\\ v=xy", "4", ["jacobian", "multivariable"], "Compute the determinant of [[1/y,-x/y^2],[y,x]]."],
    ["rel-hard-mv-006", "derivatives", "\\max xyz\\quad\\text{subject to }x+y+z=1,\\ x,y,z>0", "1/27", ["lagrange-multiplier", "optimization"], "The symmetric maximum occurs at x=y=z=1/3."],
    ["rel-hard-mv-007", "derivatives", "\\min(x^2+y^2)\\quad\\text{subject to }xy=1,\\ x,y>0", "2", ["lagrange-multiplier", "optimization"], "The minimum occurs at x=y=1."],
    ["rel-hard-mv-008", "integrals", "\\iint_R(x+y)\\,dA,\\quad 0\\le x+y\\le1,\\ 0\\le x-y\\le2", "1/2", ["change-of-variables", "jacobian"], "Use u=x+y, v=x-y, with Jacobian 1/2.", 6],
    ["rel-hard-mv-009", "integrals", "\\iint_{x^2+y^2\\le4}(x^2+y^2)^2\\,dA", "64*pi/3", ["double-integral", "polar"], "Use polar coordinates and integrate r^5."],
    ["rel-hard-mv-010", "integrals", "\\iiint_{x,y,z\\ge0,\\ x+y+z\\le1}x^2yz\\,dV", "1/2520", ["triple-integral", "simplex"], "Use the three-dimensional simplex beta formula.", 6]
  ].forEach(([id, topic, prompt, answer, tags, solution, rank = 5]) => {
    numeric(id, topic, prompt, answer, [...tags, "boss-rank"], solution, rank, 120);
  });

  [
    ["rel-hard-der-001", "W(e^x,xe^x)\\text{ at }x=0", "1", ["wronskian"], "The Wronskian is e^{2x}."],
    ["rel-hard-der-002", "W(\\sin x,\\cos x)\\text{ at }x=0", "-1", ["wronskian"], "Compute f g'-f'g."],
    ["rel-hard-der-003", "\\det H_f(1,0),\\quad f=\\ln(x^2+y^2)", "-4", ["hessian"], "At (1,0), the Hessian is diag(-2,2)."],
    ["rel-hard-der-004", "\\kappa\\text{ for }y=\\ln x\\text{ at }x=1", "1/(2*sqrt(2))", ["curvature"], "Use |y''|/(1+(y')^2)^{3/2}."],
    ["rel-hard-der-005", "\\frac{dy}{dx}\\text{ at }t=2,\\quad x=t+\\frac1t,\\ y=t-\\frac1t", "5/3", ["parametric-differentiation"], "Use (dy/dt)/(dx/dt)."],
    ["rel-hard-der-006", "\\frac{d^2y}{dx^2}\\text{ at }t=2,\\quad x=t^2,\\ y=t^3", "3/8", ["parametric-differentiation"], "Differentiate dy/dx with respect to t, then divide by dx/dt."],
    ["rel-hard-der-007", "D_{(1,2,2)/3}(xyz)\\text{ at }(1,1,1)", "5/3", ["directional-derivative", "nabla"], "The gradient is (1,1,1)."],
    ["rel-hard-der-008", "\\nabla\\cdot\\langle xy,yz,zx\\rangle\\text{ at }(1,2,3)", "6", ["nabla", "vector-calculus"], "The divergence is y+z+x."],
    ["rel-hard-der-009", "\\text{z-component of }\\nabla\\times\\left\\langle\\frac{-y}{x^2+y^2},\\frac{x}{x^2+y^2},0\\right\\rangle\\text{ at }(1,0,0)", "0", ["nabla", "vector-calculus"], "Away from the origin, this field has zero curl."],
    ["rel-hard-der-010", "\\Delta e^{x+y}\\text{ at }(0,0)", "2", ["nabla", "laplacian"], "f_xx+f_yy=2e^{x+y}."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "derivatives", prompt, answer, [...tags, "boss-rank"], solution, 5, 95);
  });

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 題幹的寫法自動辨識器接不到；這裡把題幹重述成數值路徑（數值偏導、數值積分、
  // 複數求值、圍道上的梯形法），不重複解題的推導、也不把答案抄一遍。
  const VERIFY = {
    "rel-hard-der-006": { m: "paramSecond", x: "t^2", y: "t^3", at: 2 },
    // 方向導數 = Σ ∂f/∂xᵢ · uᵢ，偏導數值取
    "rel-hard-der-007": { m: "totalDiff", f: "xyz", vars: ["x", "y", "z"], at: [1, 1, 1], d: ["1/3", "2/3", "2/3"] },
    "rel-hard-mv-005": { m: "vecField", op: "jacobian", vars: ["x", "y"], F: ["x/y", "xy"], at: [2, 1] },
    // 不換變數：直接在 xy 平面上積這個斜放的長方形（y 的上下界用 |·| 寫 max/min）
    "rel-hard-mv-008": { m: "double", f: "x+y", u: "x", v: "y", a: 0, b: 1.5, c: "\\frac{-2+|2-2x|}{2}", d: "\\frac{1-|1-2x|}{2}", tol: 1e-6 }
  };
  hardProblems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(hardProblems);
})();

(function () {
  "use strict";
  // 課程缺口補題（9B.3–9B.6）：Green 的方向與奇異點、參數曲面與法向量、曲面面積、純量曲面積分、
  // 通量的方向、槳輪與源匯的判讀、Stokes／散度定理的方向與補蓋子、定理辨識。
  // 用定理算的題，驗算一律直接算原本那個線積分／面積分（數值參數化），不走定理。
  const SOURCE = "Buzz course gap fill";

  // 參數曲面：u、v 的範圍都是常數；封閉面的 r_u × r_v 朝外
  const sphere = (r, u0, u1, cx) => ({
    x: `${cx ? cx + "+" : ""}${r}\\sin u\\cos v`, y: `${r}\\sin u\\sin v`, z: `${r}\\cos u`,
    u: [u0 === undefined ? 0 : u0, u1 === undefined ? "\\pi" : u1], v: [0, "2\\pi"]
  });
  // 同一張球面，參數順序對調 → 法向量指向球心
  const sphereInward = (r, v0, v1) => ({
    x: `${r}\\sin v\\cos u`, y: `${r}\\sin v\\sin u`, z: `${r}\\cos v`, u: [0, "2\\pi"], v: [v0, v1]
  });
  const box = (a, b, c) => [
    { x: String(a[1]), y: "u", z: "v", u: b, v: c },
    { x: String(a[0]), y: "v", z: "u", u: c, v: b },
    { x: "v", y: String(b[1]), z: "u", u: c, v: a },
    { x: "u", y: String(b[0]), z: "v", u: a, v: c },
    { x: "u", y: "v", z: String(c[1]), u: a, v: b },
    { x: "v", y: "u", z: String(c[0]), u: b, v: a }
  ];
  const scalar = (f, surface) => ({ m: "surfaceScalar", f, surface });
  // 參數式選擇題：每個選項都要在曲面上（殘差 0）、面積對、（必要時）z 的矩對
  const paramOption = (say, surface, residual, area, moment) => ({
    say,
    all: [
      { v: scalar(residual, surface), eq: 0, tol: 1e-6 },
      { v: scalar("1", surface), eq: area },
      ...(moment ? [{ v: scalar("z", surface), eq: moment }] : [])
    ]
  });
  // 平面場的槳輪／源匯：看一點上的 Q_x − P_y 或 P_x + Q_y 的正負
  const signOptions = (op, F, at, words) => [
    { say: words[0], all: [{ v: { m: "fieldOp", op, F, at }, gt: 0 }] },
    { say: words[1], all: [{ v: { m: "fieldOp", op, F, at }, lt: 0 }] },
    { say: words[2], all: [{ v: { m: "fieldOp", op, F, at }, eq: 0, tol: 1e-6 }] }
  ];
  const WHEEL = ["逆時針轉", "順時針轉", "不轉"];
  const SOURCE_SINK = ["正（像源）", "負（像匯）", "0"];
  const BOTH = "兩個方向都可以（Stokes 不管方向）";

  const problems = [
    /* ── 9B.3 Green：方向、洞、奇異點 ── */
    { id: "cg-9b3-001", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_C y^2\\,dx+3xy\\,dy,\\quad C:\\text{ 三角形 }(0,0)\\to(0,2)\\to(2,0)\\to(0,0)",
      answer: "-4/3", timeLimit: 150,
      tags: ["green-orientation-hypotheses", "green-theorem", "line-integral", "vector-calculus"],
      hints: ["先看方向：照頂點順序走一圈，三角形在你的左手邊還是右手邊？", "Green 給的是逆時針的值；順時針要整個變號。"],
      solution: "照順序走，三角形在右手邊：順時針，Green 要加負號。Q_x − P_y = 3y − 2y = y，∬_T y dA = ∫₀² y(2 − y) dy = 4/3，所以答案 −4/3。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["y^2", "3xy"], paths: [
        { x: "0", y: "2t", from: 0, to: 1 },
        { x: "2t", y: "2-2t", from: 0, to: 1 },
        { x: "2-2t", y: "0", from: 0, to: 1 }
      ] } },
    { id: "cg-9b3-002", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_{\\partial D}-x^2y\\,dx+xy^2\\,dy,\\quad D:\\ 1\\le x^2+y^2\\le 4,\\ \\partial D\\text{ 取正向（外圈逆時針、內圈順時針）}",
      answer: "15*pi/2", timeLimit: 180,
      tags: ["green-orientation-hypotheses", "green-theorem", "polar-coordinates", "vector-calculus"],
      hints: ["有洞的區域也能用 Green：兩圈都照「區域在左手邊」的方向走就是正向。", "Q_x − P_y 化成極座標，r 只從內圈積到外圈。"],
      solution: "外圈逆時針＋內圈順時針正是 ∂D 的正向，Green 直接用。Q_x − P_y = y² + x² = r²，∫₀^{2π}∫₁² r²·r dr dθ = 2π·(16 − 1)/4 = 15π/2。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["-x^2y", "xy^2"], paths: [
        { x: "2\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" },
        { x: "\\cos t", y: "-\\sin t", from: 0, to: "2\\pi" }
      ] } },
    { id: "cg-9b3-003", topic: "integrals", rank: 5, answerKind: "numeric",
      prompt: "\\oint_C\\left(y-\\frac{y}{x^2+y^2}\\right)dx+\\left(3x+\\frac{x}{x^2+y^2}\\right)dy,\\quad C:\\ \\frac{x^2}{9}+\\frac{y^2}{4}=1\\text{ 逆時針}",
      answer: "14*pi", timeLimit: 240,
      tags: ["green-orientation-hypotheses", "green-theorem", "line-integral", "vector-calculus"],
      hints: ["原點在橢圓裡面，場在原點沒有定義：不能把 Green 直接用在整個場上。", "把場拆成光滑的 ⟨y, 3x⟩ 和 ⟨−y, x⟩/(x² + y²) 兩部分分開處理。"],
      solution: "拆開：⟨y, 3x⟩ 光滑，Green 給 (3 − 1)·橢圓面積 6π = 12π。⟨−y, x⟩/(x² + y²) 在原點外旋度為 0，C 可以縮成繞原點的小圓，積分 = 2π。合計 14π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["y-\\frac{y}{x^2+y^2}", "3x+\\frac{x}{x^2+y^2}"], path: { x: "3\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } } },

    /* ── 9B.4 參數曲面：寫參數式（選擇題）── */
    { id: "cg-9b4-001", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{圓柱側面 }x^2+y^2=9,\\ 0\\le z\\le 2\\text{ 的參數式是哪一個？}",
      answer: "⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2",
      answers: ["⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2"],
      canonical: "⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2",
      distractors: ["⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ 2", "⟨cos u, sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", "⟨3cos u, v, 3sin u⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2"],
      timeLimit: 60,
      tags: ["surface-parametrize", "parametric", "surface-integral"],
      hints: ["把每個選項的 x、y 代進 x² + y²，看是不是恆等於 9。", "繞 z 軸的角度要跑完整一圈；高度交給另一個參數。"],
      solution: "x = 3cos u、y = 3sin u 讓 x² + y² = 9；u 跑 0 到 2π 才繞滿一圈，z = v 從 0 到 2。只跑到 π 是半個圓柱；半徑 1 不在這個圓柱上；把 3sin u 放在 z 是繞 y 軸的另一根圓柱。",
      
      verify: { m: "choice", options: [
        paramOption("⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "3\\cos u", y: "3\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] }, "(x^2+y^2-9)^2", "12\\pi", "12\\pi"),
        paramOption("⟨3cos u, 3sin u, v⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ 2", { x: "3\\cos u", y: "3\\sin u", z: "v", u: [0, "\\pi"], v: [0, 2] }, "(x^2+y^2-9)^2", "12\\pi", "12\\pi"),
        paramOption("⟨cos u, sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "\\cos u", y: "\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] }, "(x^2+y^2-9)^2", "12\\pi", "12\\pi"),
        paramOption("⟨3cos u, v, 3sin u⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "3\\cos u", y: "v", z: "3\\sin u", u: [0, "2\\pi"], v: [0, 2] }, "(x^2+y^2-9)^2", "12\\pi", "12\\pi")
      ] } },
    { id: "cg-9b4-002", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{上半球面 }x^2+y^2+z^2=9,\\ z\\ge 0\\text{ 的參數式是哪一個？（}u\\text{ 是與 }z\\text{ 軸的夾角，}v\\text{ 是繞 }z\\text{ 軸的角）}",
      answer: "⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π",
      answers: ["⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π"],
      canonical: "⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π",
      distractors: ["⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ 2π", "⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ π", "⟨9sin u cos v, 9sin u sin v, 9cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π"],
      timeLimit: 75,
      tags: ["surface-parametrize", "parametric", "spherical-coordinates"],
      hints: ["球面方程式右邊是半徑的平方，參數式裡乘的是半徑。", "z = 3cos u ≥ 0 限制的是哪個角的範圍？另一個角要繞滿一圈。"],
      solution: "半徑是 3 不是 9。z = 3cos u ≥ 0 ⟺ 0 ≤ u ≤ π/2，v 繞滿 0 到 2π。u 到 π 是整顆球；u 到 π、v 只到 π 是 y ≥ 0 的那半顆（也是半球，但不是上半）。",
      
      verify: { m: "choice", options: [
        paramOption("⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π", sphere(3, 0, "\\pi/2"), "(x^2+y^2+z^2-9)^2", "18\\pi", "27\\pi"),
        paramOption("⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ 2π", sphere(3, 0, "\\pi"), "(x^2+y^2+z^2-9)^2", "18\\pi", "27\\pi"),
        paramOption("⟨3sin u cos v, 3sin u sin v, 3cos u⟩; 0 ≤ u ≤ π, 0 ≤ v ≤ π", { x: "3\\sin u\\cos v", y: "3\\sin u\\sin v", z: "3\\cos u", u: [0, "\\pi"], v: [0, "\\pi"] }, "(x^2+y^2+z^2-9)^2", "18\\pi", "27\\pi"),
        paramOption("⟨9sin u cos v, 9sin u sin v, 9cos u⟩; 0 ≤ u ≤ π/2, 0 ≤ v ≤ 2π", sphere(9, 0, "\\pi/2"), "(x^2+y^2+z^2-9)^2", "18\\pi", "27\\pi")
      ] } },
    { id: "cg-9b4-003", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{圓錐面 }z=\\sqrt{x^2+y^2},\\ 0\\le z\\le 2\\text{ 的參數式是哪一個？}",
      answer: "⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2",
      answers: ["⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2"],
      canonical: "⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2",
      distractors: ["⟨v cos u, v sin u, v²⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", "⟨2cos u, 2sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", "⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 4"],
      timeLimit: 75,
      tags: ["surface-parametrize", "parametric", "polar-coordinates"],
      hints: ["用極座標 x = r cos θ、y = r sin θ，圓錐上 z 跟 r 是什麼關係？", "高度 0 ≤ z ≤ 2 翻成參數範圍時，要看 z 等於哪個參數。"],
      solution: "圓錐上 z = √(x² + y²) = r，所以 ⟨v cos u, v sin u, v⟩，z = v ∈ [0, 2]。z = v² 是拋物面；半徑固定 2 是圓柱；v 到 4 會讓 z 到 4，超出這一段。",
      
      verify: { m: "choice", options: [
        paramOption("⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "v\\cos u", y: "v\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] }, "(z^2-x^2-y^2)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨v cos u, v sin u, v²⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "v\\cos u", y: "v\\sin u", z: "v^2", u: [0, "2\\pi"], v: [0, 2] }, "(z^2-x^2-y^2)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨2cos u, 2sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 2", { x: "2\\cos u", y: "2\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] }, "(z^2-x^2-y^2)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨v cos u, v sin u, v⟩; 0 ≤ u ≤ 2π, 0 ≤ v ≤ 4", { x: "v\\cos u", y: "v\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 4] }, "(z^2-x^2-y^2)^2", "4\\sqrt{2}\\pi")
      ] } },
    { id: "cg-9b4-004", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{平面 }z=3-x\\text{ 在圓柱 }x^2+y^2\\le 4\\text{ 裡面的那一片，參數式是哪一個？}",
      answer: "⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π",
      answers: ["⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π"],
      canonical: "⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π",
      distractors: ["⟨r cos θ, r sin θ, 3 − r⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π", "⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 4, 0 ≤ θ ≤ 2π", "⟨2cos θ, 2sin θ, z⟩; 0 ≤ θ ≤ 2π, 1 ≤ z ≤ 5"],
      timeLimit: 90,
      tags: ["surface-parametrize", "parametric", "polar-coordinates"],
      hints: ["這片曲面是平面的一部分：z 要照平面方程式由 x 決定。", "「在圓柱裡面」限制的是 (x, y) 落在哪個圓盤；圓盤的半徑是多少？"],
      solution: "(x, y) 跑遍圓盤 x² + y² ≤ 4：x = r cos θ、y = r sin θ，0 ≤ r ≤ 2；z 照平面 z = 3 − x = 3 − r cos θ。z = 3 − r 不是這個平面；r 到 4 是把 4 當成半徑；⟨2cos θ, 2sin θ, z⟩ 是圓柱壁，不是平面。",
      
      verify: { m: "choice", options: [
        paramOption("⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π", { x: "u\\cos v", y: "u\\sin v", z: "3-u\\cos v", u: [0, 2], v: [0, "2\\pi"] }, "(z-3+x)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨r cos θ, r sin θ, 3 − r⟩; 0 ≤ r ≤ 2, 0 ≤ θ ≤ 2π", { x: "u\\cos v", y: "u\\sin v", z: "3-u", u: [0, 2], v: [0, "2\\pi"] }, "(z-3+x)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨r cos θ, r sin θ, 3 − r cos θ⟩; 0 ≤ r ≤ 4, 0 ≤ θ ≤ 2π", { x: "u\\cos v", y: "u\\sin v", z: "3-u\\cos v", u: [0, 4], v: [0, "2\\pi"] }, "(z-3+x)^2", "4\\sqrt{2}\\pi"),
        paramOption("⟨2cos θ, 2sin θ, z⟩; 0 ≤ θ ≤ 2π, 1 ≤ z ≤ 5", { x: "2\\cos u", y: "2\\sin u", z: "v", u: [0, "2\\pi"], v: [1, 5] }, "(z-3+x)^2", "4\\sqrt{2}\\pi")
      ] } },

    /* ── 9B.4 參數曲面：r_u × r_v 與切平面 ── */
    { id: "cg-9b4-005", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf r(u,v)=\\langle u^2,\\ v^2,\\ u+2v\\rangle\\text{ 在 }(u,v)=(1,1)\\text{ 的切平面與 }z\\text{ 軸交在 }z=?",
      answer: "3/2", timeLimit: 120,
      tags: ["surface-normal-cross", "tangent-plane", "parametric"],
      hints: ["先算切點 r(1,1)，再算 r_u、r_v 在這點的值。", "法向量 n = r_u × r_v；切平面 n·(X − P₀) = 0，令 x = y = 0。"],
      solution: "切點 (1, 1, 3)。r_u = ⟨2, 0, 1⟩、r_v = ⟨0, 2, 2⟩，n = ⟨−2, −4, 4⟩。切平面 −2(x − 1) − 4(y − 1) + 4(z − 3) = 0，令 x = y = 0：4z = 6，z = 3/2。",
      
      // 獨立路徑：u, v > 0 時這張曲面就是 z = √x + 2√y 的圖形，用圖形的偏導數寫切平面
      verify: { m: "let", f: "3-g-h", with: {
        g: { m: "deriv", f: "\\sqrt{x}+2\\sqrt{y}", vars: ["x", "y"], at: [1, 1], wrt: "x" },
        h: { m: "deriv", f: "\\sqrt{x}+2\\sqrt{y}", vars: ["x", "y"], at: [1, 1], wrt: "y" }
      } } },
    { id: "cg-9b4-006", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf r(u,v)=\\langle u\\cos v,\\ u\\sin v,\\ 2v\\rangle\\text{ 在 }(u,v)=\\left(\\sqrt5,\\tfrac{\\pi}{3}\\right)\\text{ 的面積放大率 }|\\mathbf r_u\\times\\mathbf r_v|",
      answer: "3", timeLimit: 120,
      tags: ["surface-normal-cross", "parametric", "cross-product"],
      hints: ["r_u、r_v 各對一個參數偏微分；cos²v + sin²v 會在哪裡出現？", "先把 r_u × r_v 寫成一般式再代點，會發現它跟 v 無關。"],
      solution: "r_u = ⟨cos v, sin v, 0⟩、r_v = ⟨−u sin v, u cos v, 2⟩，r_u × r_v = ⟨2 sin v, −2 cos v, u⟩，長度 √(4 + u²)。u = √5：√9 = 3。",
      
      verify: { m: "let", f: "\\sqrt{(b\\cdot w-c\\cdot q)^2+(c\\cdot p-a\\cdot w)^2+(a\\cdot q-b\\cdot p)^2}", with: {
        a: { m: "deriv", f: "u\\cos v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "u" },
        b: { m: "deriv", f: "u\\sin v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "u" },
        c: { m: "deriv", f: "2v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "u" },
        p: { m: "deriv", f: "u\\cos v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "v" },
        q: { m: "deriv", f: "u\\sin v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "v" },
        w: { m: "deriv", f: "2v", vars: ["u", "v"], at: ["\\sqrt{5}", "\\pi/3"], wrt: "v" }
      } } },
    { id: "cg-9b4-007", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf r(u,v)=\\langle u+v,\\ u-v,\\ uv\\rangle\\text{ 在 }(u,v)=(2,1)\\text{ 的切平面與 }x\\text{ 軸交在 }x=?",
      answer: "4/3", timeLimit: 120,
      tags: ["surface-normal-cross", "tangent-plane", "parametric"],
      hints: ["切點是 r(2,1)；r_u、r_v 在這點各是什麼向量？", "用 n = r_u × r_v 寫切平面，再令 y = z = 0。"],
      solution: "切點 (3, 1, 2)。r_u = ⟨1, 1, 1⟩、r_v = ⟨1, −1, 2⟩，n = ⟨3, −1, −2⟩。切平面 3x − y − 2z = 9 − 1 − 4 = 4，令 y = z = 0：x = 4/3。",
      
      // 獨立路徑：u = (x+y)/2、v = (x−y)/2，曲面就是 z = (x² − y²)/4 的圖形
      verify: { m: "let", f: "3+\\frac{h-2}{g}", with: {
        g: { m: "deriv", f: "\\frac{x^2-y^2}{4}", vars: ["x", "y"], at: [3, 1], wrt: "x" },
        h: { m: "deriv", f: "\\frac{x^2-y^2}{4}", vars: ["x", "y"], at: [3, 1], wrt: "y" }
      } } },

    /* ── 9B.4 曲面面積 ── */
    { id: "cg-9b4-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{平面 }2x+2y+z=4\\text{ 在第一卦限那一片的面積}",
      answer: "6", timeLimit: 120,
      tags: ["surface-area-graph", "surface-area"],
      hints: ["寫成 z = g(x, y)，面積元素是 √(1 + g_x² + g_y²) dA。", "這片投影到 xy 平面是哪個三角形？"],
      solution: "z = 4 − 2x − 2y，√(1 + 4 + 4) = 3。投影是 x + y ≤ 2 的三角形，面積 2。曲面面積 3·2 = 6。",
      
      verify: scalar("1", { x: "2u", y: "(2-2u)v", z: "4-4u-2(2-2u)v", u: [0, 1], v: [0, 1] }) },
    { id: "cg-9b4-009", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "z=\\tfrac12\\left(x^2+y^2\\right)\\text{ 在圓柱 }x^2+y^2\\le 8\\text{ 裡面那一片的面積}",
      answer: "52*pi/3", timeLimit: 150,
      tags: ["surface-area-graph", "surface-area", "polar-coordinates", "vector-calculus"],
      hints: ["g_x、g_y 平方相加剛好是 r²。", "極座標下 ∫ √(1 + r²) r dr 用 w = 1 + r² 換元。"],
      solution: "g_x = x、g_y = y，dS = √(1 + r²) dA。∫₀^{2π}∫₀^{√8} √(1 + r²) r dr dθ = 2π·⅓[(1 + r²)^{3/2}]₀^{√8} = 2π·(27 − 1)/3 = 52π/3。",
      
      verify: scalar("1", { x: "u\\cos v", y: "u\\sin v", z: "\\frac{u^2}{2}", u: [0, "\\sqrt{8}"], v: [0, "2\\pi"] }) },
    { id: "cg-9b4-010", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{曲面 }z=xy\\text{ 在圓盤 }x^2+y^2\\le 3\\text{ 上方那一片的面積}",
      answer: "14*pi/3", timeLimit: 150,
      tags: ["surface-area-graph", "surface-area", "polar-coordinates", "vector-calculus"],
      hints: ["g_x = y、g_y = x，平方和在極座標下很乾淨。", "區域是圓盤，用極座標積。"],
      solution: "√(1 + y² + x²) = √(1 + r²)。∫₀^{2π}∫₀^{√3} √(1 + r²) r dr dθ = 2π·⅓(4^{3/2} − 1) = 2π·7/3 = 14π/3。",
      
      verify: scalar("1", { x: "u\\cos v", y: "u\\sin v", z: "u^2\\cos v\\sin v", u: [0, "\\sqrt{3}"], v: [0, "2\\pi"] }) },
    { id: "cg-9b4-011", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{球面 }x^2+y^2+z^2=16\\text{ 在平面 }z=2\\text{ 上方那一部分的面積}",
      answer: "16*pi", timeLimit: 150,
      tags: ["surface-area-sphere", "surface-area", "spherical-coordinates", "vector-calculus"],
      hints: ["球座標下 dS = a² sin φ dφ dθ；z = 2 對應哪個 φ？", "4 cos φ = 2 解出 φ 的上限。"],
      solution: "半徑 4，dS = 16 sin φ dφ dθ。z = 4 cos φ ≥ 2 ⟺ φ ≤ π/3。面積 = 2π·16·(1 − cos π/3) = 16π。",
      
      verify: scalar("1", sphere(4, 0, "\\pi/3")) },
    { id: "cg-9b4-012", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{球面 }x^2+y^2+z^2=4\\text{ 在圓錐 }z=\\sqrt{x^2+y^2}\\text{ 上方那一部分的面積}",
      answer: "4*pi*(2-sqrt(2))", timeLimit: 150,
      tags: ["surface-area-sphere", "surface-area", "spherical-coordinates", "vector-calculus"],
      hints: ["圓錐 z = √(x² + y²) 在球座標是 φ 等於一個常數。", "球面上 dS = 4 sin φ dφ dθ，φ 從 0 積到那個常數。"],
      solution: "圓錐是 φ = π/4，上方是 0 ≤ φ ≤ π/4。面積 = ∫₀^{2π}∫₀^{π/4} 4 sin φ dφ dθ = 8π(1 − √2/2) = 4π(2 − √2)。",
      
      verify: scalar("1", sphere(2, 0, "\\pi/4")) },

    /* ── 9B.4 純量曲面積分 ── */
    { id: "cg-9b4-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\iint_S y\\,dS,\\quad S:\\ x+2y+2z=6\\text{ 在第一卦限的部分}",
      answer: "27/2", timeLimit: 150,
      tags: ["surface-integral-graph", "surface-integral"],
      hints: ["寫成 z = 3 − x/2 − y，dS 是 dA 的固定倍數。", "投影是 x + 2y ≤ 6 的三角形；先對 x 積比較快。"],
      solution: "z = 3 − x/2 − y，dS = √(1 + ¼ + 1) dA = (3/2) dA。∬_T y dA = ∫₀³ y(6 − 2y) dy = 27 − 18 = 9，所以答案 (3/2)·9 = 27/2。",
      
      verify: scalar("y", { x: "(6-6u)v", y: "3u", z: "\\frac{6-(6-6u)v-6u}{2}", u: [0, 1], v: [0, 1] }) },
    { id: "cg-9b4-014", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S z\\,dS,\\quad S:\\ z=x^2+y^2,\\ z\\le 2",
      answer: "149*pi/30", timeLimit: 210,
      tags: ["surface-integral-graph", "surface-integral", "polar-coordinates", "vector-calculus"],
      hints: ["dS = √(1 + 4r²) dA，被積函數 z 在曲面上等於 r²。", "換元 w = 1 + 4r²：r² = (w − 1)/4，r dr = dw/8。"],
      solution: "∬ r²√(1 + 4r²) r dr dθ，r ≤ √2。w = 1 + 4r²：(1/32)∫₁⁹ (w^{3/2} − w^{1/2}) dw = (1/32)(484/5 − 52/3) = 149/60。乘 2π 得 149π/30。",
      
      verify: scalar("z", { x: "u\\cos v", y: "u\\sin v", z: "u^2", u: [0, "\\sqrt{2}"], v: [0, "2\\pi"] }) },
    { id: "cg-9b4-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\iint_S \\left(x^2+y^2\\right)dS,\\quad S:\\ z=\\sqrt{x^2+y^2},\\ 0\\le z\\le 1",
      answer: "sqrt(2)*pi/2", timeLimit: 150,
      tags: ["surface-integral-graph", "surface-integral", "polar-coordinates"],
      hints: ["圓錐 z = √(x² + y²) 的 g_x² + g_y² 是常數。", "投影是單位圓盤，被積函數是 r²。"],
      solution: "g_x² + g_y² = (x² + y²)/(x² + y²) = 1，dS = √2 dA。√2 ∫₀^{2π}∫₀¹ r²·r dr dθ = √2·2π/4 = √2π/2。",
      
      verify: scalar("x^2+y^2", { x: "u\\cos v", y: "u\\sin v", z: "u", u: [0, 1], v: [0, "2\\pi"] }) },
    { id: "cg-9b4-016", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\iint_S x^2\\,dS,\\quad S:\\ x^2+y^2+z^2=4",
      answer: "64*pi/3", timeLimit: 90,
      tags: ["surface-integral-symmetry", "surface-integral", "symmetry"],
      hints: ["球面對 x、y、z 三個座標地位相同：∬x²、∬y²、∬z² 三個一樣大。", "三個加起來的被積函數在球面上是常數。"],
      solution: "對稱：∬x² = ∬y² = ∬z²，三者和 = ∬(x² + y² + z²) dS = 4·(4π·4) = 64π。所以 ∬x² dS = 64π/3。",
      
      verify: scalar("x^2", sphere(2)) },
    { id: "cg-9b4-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\iint_S \\left(2x-y+z^2\\right)dS,\\quad S:\\ x^2+y^2+z^2=1",
      answer: "4*pi/3", timeLimit: 90,
      tags: ["surface-integral-symmetry", "surface-integral", "symmetry"],
      hints: ["球面關於 x ↦ −x、y ↦ −y 對稱：奇函數的部分會怎樣？", "剩下的 ∬z² dS 用「三個座標平方地位相同」。"],
      solution: "2x、−y 是奇函數，在對稱的球面上積分為 0。∬z² dS = ⅓∬(x² + y² + z²) dS = ⅓·4π = 4π/3。",
      
      verify: scalar("2x-y+z^2", sphere(1)) },

    /* ── 9B.4 通量：圖形朝上／朝下、方向 ── */
    { id: "cg-9b4-018", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle x,y,z\\rangle,\\ S:\\ z=1-x^2-y^2,\\ z\\ge 0,\\ \\mathbf n\\text{ 朝上}",
      answer: "3*pi/2", timeLimit: 180,
      tags: ["flux-graph-upward", "flux", "polar-coordinates", "vector-calculus"],
      hints: ["圖形 z = g(x, y) 朝上：F·n dS = (−P g_x − Q g_y + R) dA。", "代進去後被積函數只跟 r 有關，用極座標。"],
      solution: "g_x = −2x、g_y = −2y：−P g_x − Q g_y + R = 2x² + 2y² + 1 − x² − y² = 1 + r²。∫₀^{2π}∫₀¹ (1 + r²) r dr dθ = 2π(½ + ¼) = 3π/2。",
      
      verify: { m: "surfaceFlux", F: ["x", "y", "z"], surface: { x: "u\\cos v", y: "u\\sin v", z: "1-u^2", u: [0, 1], v: [0, "2\\pi"] } } },
    { id: "cg-9b4-019", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle y,-x,z^2\\rangle,\\ S:\\ z=x+2y,\\ 0\\le x\\le 1,\\ 0\\le y\\le 1,\\ \\mathbf n\\text{ 朝上}",
      answer: "19/6", timeLimit: 180,
      tags: ["flux-graph-upward", "flux", "double-integral", "vector-calculus"],
      hints: ["朝上的圖形：dS 向量是 ⟨−g_x, −g_y, 1⟩ dA。", "R = z² 要先把 z 換成 x + 2y 再積。"],
      solution: "⟨−g_x, −g_y, 1⟩ = ⟨−1, −2, 1⟩。F·⟨−1, −2, 1⟩ = −y + 2x + (x + 2y)²。在 [0,1]² 上：−½ + 1 + (⅓ + 1 + 4/3) = 19/6。",
      
      verify: { m: "surfaceFlux", F: ["y", "-x", "z^2"], surface: { x: "u", y: "v", z: "u+2v", u: [0, 1], v: [0, 1] } } },
    { id: "cg-9b4-020", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle x,y,z\\rangle,\\ S:\\ z=x^2+y^2,\\ z\\le 4,\\ \\mathbf n\\text{ 朝下}",
      answer: "8*pi", timeLimit: 180,
      tags: ["flux-graph-upward", "flux", "polar-coordinates", "vector-calculus"],
      hints: ["先用朝上的公式 (−P g_x − Q g_y + R) dA 算，最後再處理方向。", "朝下的法向量是朝上的負號。"],
      solution: "朝上：−x(2x) − y(2y) + (x² + y²) = −r²，∫₀^{2π}∫₀² −r³ dr dθ = −8π。題目要朝下，變號得 8π。",
      
      verify: { m: "surfaceFlux", F: ["x", "y", "z"], surface: { x: "v\\cos u", y: "v\\sin u", z: "v^2", u: [0, "2\\pi"], v: [0, 2] } } },
    { id: "cg-9b4-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle 0,0,z\\rangle,\\ S:\\text{ 上半球面 }x^2+y^2+z^2=1,\\ z\\ge 0,\\ \\mathbf n\\text{ 指向球心}",
      answer: "-2*pi/3", timeLimit: 150,
      tags: ["flux-orientation", "flux", "spherical-coordinates"],
      hints: ["單位球面上朝外的單位法向量就是 ⟨x, y, z⟩；指向球心是它的負號。", "朝外時 F·n = z²，球座標下 z = cos φ。"],
      solution: "朝外 n = ⟨x, y, z⟩，F·n = z²；∬z² dS = ∫₀^{2π}∫₀^{π/2} cos²φ sin φ dφ dθ = 2π/3。指向球心要變號：−2π/3。",
      
      verify: { m: "surfaceFlux", F: ["0", "0", "z"], surface: sphereInward(1, 0, "\\pi/2") } },
    { id: "cg-9b4-022", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "S:\\ \\mathbf r(u,v)=\\langle v\\cos u,\\ v\\sin u,\\ 1\\rangle,\\ 0\\le u\\le 2\\pi,\\ 0\\le v\\le 2\\text{。}\\mathbf F=\\langle x,y,x^2+y^2\\rangle\\text{ 穿過 }S\\text{、法向量取朝上的通量}",
      answer: "8*pi", timeLimit: 150,
      tags: ["flux-orientation", "flux", "polar-coordinates"],
      hints: ["先算 r_u × r_v，看它的 z 分量是正還是負。", "如果它朝下，就要用它的負號當朝上的法向量。"],
      solution: "r_u × r_v = ⟨0, 0, −v⟩ 朝下，所以朝上要用 ⟨0, 0, v⟩。F·⟨0, 0, v⟩ = (x² + y²)v = v³，∫₀^{2π}∫₀² v³ dv du = 8π。",
      
      verify: { m: "surfaceFlux", F: ["x", "y", "x^2+y^2"], surface: { x: "u\\cos v", y: "u\\sin v", z: "1", u: [0, 2], v: [0, "2\\pi"] } } },

    /* ── 9B.5 槳輪（旋度的正負）── */
    { id: "cg-9b5-001", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\langle y,0\\rangle\\text{（往右流，越高流得越快）。在 }(0,1)\\text{ 放一個小槳輪，它會？}",
      answer: "順時針轉", answers: ["順時針轉"], canonical: "順時針轉", distractors: ["逆時針轉", "不轉"],
      timeLimit: 60,
      tags: ["curl-paddle-wheel", "curl"],
      hints: ["槳輪的上緣和下緣被推得一樣快嗎？", "平面上看 Q_x − P_y 的正負：正是逆時針，負是順時針。"],
      solution: "箭頭全部朝右，但上緣比下緣快，槳輪被帶著順時針轉。算式：Q_x − P_y = 0 − 1 = −1 < 0，順時針。",
      
      verify: { m: "choice", options: signOptions("curl", ["y", "0"], [0, 1], WHEEL) } },
    { id: "cg-9b5-002", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\langle x,y\\rangle\\text{（箭頭從原點往外放射）。在 }(1,2)\\text{ 放一個小槳輪，它會？}",
      answer: "不轉", answers: ["不轉"], canonical: "不轉", distractors: ["逆時針轉", "順時針轉"],
      timeLimit: 60,
      tags: ["curl-paddle-wheel", "curl"],
      hints: ["往外放射的流，有沒有哪一邊被推得比較偏向側面？", "算 Q_x − P_y。"],
      solution: "Q_x − P_y = ∂y/∂x − ∂x/∂y = 0：純粹往外推，沒有繞圈的成分，槳輪不轉。",
      
      verify: { m: "choice", options: signOptions("curl", ["x", "y"], [1, 2], WHEEL) } },
    { id: "cg-9b5-003", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\langle 0,x^2\\rangle\\text{（箭頭都朝上，離 }y\\text{ 軸越遠越長）。在 }(-1,0)\\text{ 放一個小槳輪，它會？}",
      answer: "順時針轉", answers: ["順時針轉"], canonical: "順時針轉", distractors: ["逆時針轉", "不轉"],
      timeLimit: 60,
      tags: ["curl-paddle-wheel", "curl"],
      hints: ["在 x = −1 附近，槳輪的左緣和右緣哪一邊被往上推得比較用力？", "平面上看 Q_x − P_y 的正負。"],
      solution: "在 x = −1，左邊（x 更負）x² 較大、往上推得較快，右邊較慢：左上右慢 ⟹ 順時針。算式 Q_x − P_y = 2x = −2 < 0。",
      
      verify: { m: "choice", options: signOptions("curl", ["0", "x^2"], [-1, 0], WHEEL) } },

    /* ── 9B.5 源與匯（散度的正負）── */
    { id: "cg-9b5-004", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\frac{\\langle x,y\\rangle}{x^2+y^2}\\text{（箭頭從原點往外）。在 }(1,1)\\text{，}\\nabla\\cdot\\mathbf F\\text{ 是正、負，還是 }0\\text{？}",
      answer: "0", answers: ["0"], canonical: "0", distractors: ["正（像源）", "負（像匯）"],
      timeLimit: 75,
      tags: ["divergence-source-meaning", "divergence"],
      hints: ["箭頭往外，但越往外越短：流進一小塊的量和流出的量誰多？", "直接算 P_x + Q_y。"],
      solution: "P_x = (y² − x²)/(x² + y²)²，Q_y = (x² − y²)/(x² + y²)²，相加 = 0。箭頭往外，但越往外越弱，流出剛好等於流進：散度 0。",
      
      verify: { m: "choice", options: signOptions("div", ["\\frac{x}{x^2+y^2}", "\\frac{y}{x^2+y^2}"], [1, 1], SOURCE_SINK) } },
    { id: "cg-9b5-005", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\langle x^2,0\\rangle\\text{（箭頭都朝右）。在 }(-1,0)\\text{，}\\nabla\\cdot\\mathbf F\\text{ 是正、負，還是 }0\\text{？}",
      answer: "負（像匯）", answers: ["負（像匯）"], canonical: "負（像匯）", distractors: ["正（像源）", "0"],
      timeLimit: 60,
      tags: ["divergence-source-meaning", "divergence"],
      hints: ["在 x = −1 附近往右走，流速 x² 是變大還是變小？", "從左邊流進一小塊的量，跟從右邊流出的量比一比。"],
      solution: "在 x = −1 往右走，x² 變小：左邊進來的多、右邊出去的少，流體在這裡堆積，像匯。P_x = 2x = −2 < 0。",
      
      verify: { m: "choice", options: signOptions("div", ["x^2", "0"], [-1, 0], SOURCE_SINK) } },
    { id: "cg-9b5-006", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\mathbf F=\\langle 3x,-y\\rangle\\text{（左右往外推、上下往內壓）。在 }(1,1)\\text{，}\\nabla\\cdot\\mathbf F\\text{ 是正、負，還是 }0\\text{？}",
      answer: "正（像源）", answers: ["正（像源）"], canonical: "正（像源）", distractors: ["負（像匯）", "0"],
      timeLimit: 60,
      tags: ["divergence-source-meaning", "divergence"],
      hints: ["往外推的那個方向和往內壓的那個方向，哪個比較強？", "算 P_x + Q_y。"],
      solution: "P_x + Q_y = 3 − 1 = 2 > 0：x 方向往外散得比 y 方向往內壓得多，淨流出為正，像源。",
      
      verify: { m: "choice", options: signOptions("div", ["3x", "-y"], [1, 1], SOURCE_SINK) } },

    /* ── 9B.6 Stokes：法向量朝下、從下面看、兩圈邊界 ── */
    { id: "cg-9b6-001", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle y,-x,e^{xz}\\rangle,\\ S:\\ z=4-x^2-y^2,\\ z\\ge 0,\\ \\mathbf n\\text{ 朝下}",
      answer: "8*pi", timeLimit: 210,
      tags: ["stokes-orientation", "stokes-theorem", "line-integral", "vector-calculus"],
      hints: ["邊界是 z = 0 上的圓 x² + y² = 4；法向量朝下時，從上方看邊界要怎麼走？", "邊界上 dz = 0，e^{xz} 那一項不會出現。"],
      solution: "n 朝下 ⟹ 邊界從上方看順時針。邊界上 ∮ y dx − x dy：逆時針時 = −2·4π = −8π，順時針變號得 8π。",
      
      verify: { m: "curlFlux", F: ["y", "-x", "e^{xz}"], surface: { x: "v\\cos u", y: "v\\sin u", z: "4-v^2", u: [0, "2\\pi"], v: [0, 2] } } },
    { id: "cg-9b6-002", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_C\\mathbf F\\cdot d\\mathbf r,\\quad \\mathbf F=\\langle z-y,\\ x+z,\\ xy\\rangle,\\ C:\\ x^2+y^2=9,\\ z=2,\\text{ 從下方往上看是逆時針}",
      answer: "-18*pi", timeLimit: 180,
      tags: ["stokes-orientation", "stokes-theorem", "line-integral", "vector-calculus"],
      hints: ["從下方看逆時針，等於從上方看是哪個方向？", "取圓盤 z = 2 當曲面：法向量要配合這個走法，再算 (∇×F) 的 z 分量。"],
      solution: "從下方看逆時針 = 從上方看順時針，配的圓盤法向量朝下。∇×F = ⟨x − 1, 1 − y, 2⟩，朝下時 (∇×F)·n = −2，乘面積 9π 得 −18π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["z-y", "x+z", "xy"], path: { x: "3\\cos t", y: "-3\\sin t", z: "2", from: 0, to: "2\\pi" } } },
    { id: "cg-9b6-003", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S(\\nabla\\times\\mathbf F)\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle -yz,\\ xz,\\ xyz\\rangle,\\ S:\\text{ 圓柱側面 }x^2+y^2=1,\\ 0\\le z\\le 2\\text{（不含上下底），}\\mathbf n\\text{ 朝外}",
      answer: "-4*pi", timeLimit: 240,
      tags: ["stokes-orientation", "stokes-theorem", "line-integral", "vector-calculus"],
      hints: ["這張曲面有兩圈邊界：上圈 z = 2、下圈 z = 0。n 朝外時，兩圈各要怎麼走？", "沿著邊界走、曲面要在左手邊；下圈的 F 是多少？"],
      solution: "n 朝外：下圈從上方看逆時針、上圈從上方看順時針。下圈 z = 0 時 F = 0。上圈 F = ⟨−2y, 2x, ·⟩，逆時針 ∮ = 2·2·π = 4π，順時針得 −4π。總和 −4π。",
      
      verify: { m: "curlFlux", F: ["-yz", "xz", "xyz"], surface: { x: "\\cos u", y: "\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] } } },

    /* ── 9B.6 散度定理：補蓋子、奇異點 ── */
    { id: "cg-9b6-004", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iint_S\\mathbf F\\cdot\\mathbf n\\,dS,\\quad \\mathbf F=\\langle xy^2,\\ yz^2,\\ zx^2+3\\rangle,\\ S:\\text{ 上半球面 }x^2+y^2+z^2=4,\\ z\\ge 0\\text{（不含底面），}\\mathbf n\\text{ 朝外}",
      answer: "124*pi/5", timeLimit: 240,
      tags: ["divergence-theorem-add-lid", "divergence-theorem", "spherical-coordinates", "vector-calculus"],
      hints: ["半球面不封閉：補上 z = 0 的圓盤（法向量朝下）就封閉了。", "∇·F 在球座標下只跟 ρ 有關；蓋子上的通量要另外算再扣掉。"],
      solution: "∇·F = y² + z² + x² = ρ²，半球體 ∭ρ² dV = 2π·1·(32/5) = 64π/5。蓋子 z = 0 朝下：F·(−k) = −3，通量 −12π。半球面 = 64π/5 − (−12π) = 124π/5。",
      
      verify: { m: "surfaceFlux", F: ["xy^2", "yz^2", "zx^2+3"], surface: sphere(2, 0, "\\pi/2") } },
    { id: "cg-9b6-005", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle x+y^2,\\ y+z^2,\\ z+x^2\\rangle\\text{ 穿過碗面 }z=4-x^2-y^2,\\ z\\ge 0\\text{（不含底面）、法向量朝上的通量}",
      answer: "28*pi", timeLimit: 240,
      tags: ["divergence-theorem-add-lid", "divergence-theorem", "polar-coordinates", "vector-calculus"],
      hints: ["補上 z = 0 的圓盤（朝下）就是封閉曲面，∇·F 是常數。", "蓋子上 z = 0，F·(−k) 只剩 x² 那一項。"],
      solution: "∇·F = 3，體積 ∫₀^{2π}∫₀² (4 − r²) r dr dθ = 8π，封閉通量 24π。蓋子 F·(−k) = −x²，∬ −x² dA = −4π。碗面 = 24π − (−4π) = 28π。",
      
      verify: { m: "surfaceFlux", F: ["x+y^2", "y+z^2", "z+x^2"], surface: { x: "u\\cos v", y: "u\\sin v", z: "4-u^2", u: [0, 2], v: [0, "2\\pi"] } } },
    { id: "cg-9b6-006", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle x,y,2z\\rangle\\text{ 穿過圓錐側面 }z=\\sqrt{x^2+y^2},\\ 0\\le z\\le 1\\text{（不含頂蓋）的通量，}\\mathbf n\\text{ 朝外（離開 }z\\text{ 軸、偏下）}",
      answer: "-2*pi/3", timeLimit: 210,
      tags: ["divergence-theorem-add-lid", "divergence-theorem", "flux", "vector-calculus"],
      hints: ["補上頂蓋 z = 1 的圓盤（法向量朝上）就封閉了。", "∇·F 是常數，乘圓錐體積；頂蓋上 F·k 也是常數。"],
      solution: "∇·F = 4，圓錐體積 π/3，封閉通量 4π/3。頂蓋 z = 1 朝上：F·k = 2，通量 2π。側面 = 4π/3 − 2π = −2π/3。",
      
      verify: { m: "surfaceFlux", F: ["x", "y", "2z"], surface: { x: "v\\cos u", y: "v\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 1] } } },
    { id: "cg-9b6-007", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\mathbf F=\\frac{\\langle x,y,z\\rangle}{\\left(x^2+y^2+z^2\\right)^{3/2}}\\text{ 穿出球面 }(x-3)^2+y^2+z^2=1\\text{ 的通量}",
      answer: "0", timeLimit: 150,
      tags: ["divergence-theorem-hypotheses", "divergence-theorem", "flux", "vector-calculus"],
      hints: ["這個場在原點外的散度是多少？", "原點在不在這顆球裡面？在不在決定了散度定理能不能直接用。"],
      solution: "原點外 ∇·F = 0。這顆球以 (3,0,0) 為心、半徑 1，不含原點，F 在整顆球上都光滑，散度定理直接給 ∭0 dV = 0。",
      
      verify: { m: "surfaceFlux", F: ["\\frac{x}{(x^2+y^2+z^2)^{3/2}}", "\\frac{y}{(x^2+y^2+z^2)^{3/2}}", "\\frac{z}{(x^2+y^2+z^2)^{3/2}}"], surface: sphere(1, 0, "\\pi", "3") } },
    { id: "cg-9b6-008", topic: "integrals", rank: 5, answerKind: "numeric",
      prompt: "\\mathbf F=\\frac{\\langle x,y,z\\rangle}{\\left(x^2+y^2+z^2\\right)^{3/2}}+\\langle x,0,0\\rangle\\text{ 穿出正方體 }[-1,1]^3\\text{ 表面的通量}",
      answer: "4*pi+8", timeLimit: 240,
      tags: ["divergence-theorem-hypotheses", "divergence-theorem", "flux", "vector-calculus"],
      hints: ["拆成兩個場：⟨x, 0, 0⟩ 光滑，可以直接用散度定理。", "點源那一項在正方體裡有奇異點；把原點用一顆小球挖掉，夾層裡散度是 0。"],
      solution: "⟨x, 0, 0⟩：散度 1，乘體積 8 得 8。點源項：原點在正方體內，挖掉小球後夾層散度 0，所以通量等於穿出小球的 4π。合計 4π + 8。",
      
      verify: { m: "surfaceFlux", F: ["\\frac{x}{(x^2+y^2+z^2)^{3/2}}+x", "\\frac{y}{(x^2+y^2+z^2)^{3/2}}", "\\frac{z}{(x^2+y^2+z^2)^{3/2}}"], surfaces: box([-1, 1], [-1, 1], [-1, 1]) } },

    /* ── 9B.6 定理辨識（先判斷用哪一個，再算）── */
    { id: "cg-9b6-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_C (2xy+z)\\,dx+x^2\\,dy+x\\,dz,\\quad C:\\ \\mathbf r(t)=\\langle\\cos t,\\ \\sin t,\\ t\\rangle,\\ 0\\le t\\le 2\\pi",
      answer: "2*pi", timeLimit: 120,
      tags: ["theorem-recognition", "line-integral", "conservative-field"],
      hints: ["曲線不封閉，Green／Stokes 用不上；先檢查這個場是不是某個函數的梯度。", "找 f 使 f_x = 2xy + z、f_y = x²、f_z = x。"],
      solution: "F = ∇(x²y + xz)，用線積分基本定理：f(1, 0, 2π) − f(1, 0, 0) = 2π − 0 = 2π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["2xy+z", "x^2", "x"], path: { x: "\\cos t", y: "\\sin t", z: "t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b6-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\oint_C\\left(3y-\\sqrt{1+x^4}\\right)dx+\\left(5x+e^{-y^2}\\right)dy,\\quad C:\\ \\frac{x^2}{4}+y^2=1\\text{ 逆時針}",
      answer: "4*pi", timeLimit: 120,
      tags: ["theorem-recognition", "green-theorem", "line-integral"],
      hints: ["平面上的封閉曲線，直接參數化會卡在 √(1 + x⁴)。", "換成二重積分後，難算的項會消失。"],
      solution: "Green：Q_x − P_y = 5 − 3 = 2（√(1 + x⁴) 對 y 偏微分、e^{−y²} 對 x 偏微分都是 0），乘橢圓面積 2π 得 4π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["3y-\\sqrt{1+x^4}", "5x+e^{-y^2}"], path: { x: "2\\cos t", y: "\\sin t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b6-011", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_C\\mathbf F\\cdot d\\mathbf r,\\quad \\mathbf F=\\langle z-y,\\ x+y^2,\\ e^{z}\\rangle,\\ C:\\text{ 圓柱 }x^2+y^2=4\\text{ 與平面 }z=3+x\\text{ 的交線，從上方看逆時針}",
      answer: "8*pi", timeLimit: 180,
      tags: ["theorem-recognition", "stokes-theorem", "line-integral", "vector-calculus"],
      hints: ["空間中的封閉曲線：可以換成任何一張以它為邊界的曲面上的旋度通量。", "取平面 z = 3 + x 在圓盤上方那片，朝上的 dS 向量是 ⟨−g_x, −g_y, 1⟩ dA。"],
      solution: "Stokes：∇×F = ⟨0, 1, 2⟩。曲面取平面 z = 3 + x，朝上 dS = ⟨−1, 0, 1⟩ dA，(∇×F)·⟨−1, 0, 1⟩ = 2，乘圓盤面積 4π 得 8π。",
      
      verify: { m: "lineIntegral", kind: "work", F: ["z-y", "x+y^2", "e^{z}"], path: { x: "2\\cos t", y: "2\\sin t", z: "3+2\\cos t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b6-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle x-yz,\\ 2y+xz^2,\\ xy+3z\\rangle\\text{ 穿出長方體 }[0,1]\\times[0,2]\\times[0,3]\\text{ 表面的通量}",
      answer: "36", timeLimit: 120,
      tags: ["theorem-recognition", "divergence-theorem", "flux"],
      hints: ["封閉曲面、六個面：一面一面算太慢。", "先算 ∇·F，看它是不是常數。"],
      solution: "散度定理：∇·F = 1 + 2 + 3 = 6，乘體積 1·2·3 = 6 得 36。",
      
      verify: { m: "surfaceFlux", F: ["x-yz", "2y+xz^2", "xy+3z"], surfaces: box([0, 1], [0, 2], [0, 3]) } },

    /* ── 9B.6 邊界方向配對（選擇題）── */
    { id: "cg-9b6-013", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{用 Stokes 定理時，}S\\text{ 是下半球面 }x^2+y^2+z^2=4,\\ z\\le 0\\text{，}\\mathbf n\\text{ 朝外（偏下）。邊界圓 }x^2+y^2=4,\\ z=0\\text{ 要怎麼走？}",
      answer: "從上方往下看順時針", answers: ["從上方往下看順時針"], canonical: "從上方往下看順時針",
      distractors: ["從上方往下看逆時針", BOTH],
      timeLimit: 75,
      tags: ["boundary-orientation-match", "stokes-theorem"],
      hints: ["右手定則：拇指指向 n，四指彎的方向就是邊界的走法。", "n 偏下時拇指朝下；從上方看四指怎麼繞？"],
      solution: "右手拇指朝下（n 朝外偏下），四指從上方看是順時針；也可以想成沿邊界走、頭朝 n 的方向時，曲面要在左手邊。",
      
      // 用測試場 ⟨−y, x, 0⟩：哪個走法的環流等於 S 上（朝外）的旋度通量，哪個就是配對的方向
      verify: { m: "choice", options: [
        { say: "從上方往下看順時針", all: [{ v: { m: "lineIntegral", kind: "work", F: ["-y", "x", "0"], path: { x: "2\\cos t", y: "-2\\sin t", z: "0", from: 0, to: "2\\pi" } },
          eq: { m: "curlFlux", F: ["-y", "x", "0"], surface: sphere(2, "\\pi/2", "\\pi") } }] },
        { say: "從上方往下看逆時針", all: [{ v: { m: "lineIntegral", kind: "work", F: ["-y", "x", "0"], path: { x: "2\\cos t", y: "2\\sin t", z: "0", from: 0, to: "2\\pi" } },
          eq: { m: "curlFlux", F: ["-y", "x", "0"], surface: sphere(2, "\\pi/2", "\\pi") } }] },
        { say: BOTH, all: [
          { v: { m: "lineIntegral", kind: "work", F: ["-y", "x", "0"], path: { x: "2\\cos t", y: "-2\\sin t", z: "0", from: 0, to: "2\\pi" } },
            eq: { m: "curlFlux", F: ["-y", "x", "0"], surface: sphere(2, "\\pi/2", "\\pi") } },
          { v: { m: "lineIntegral", kind: "work", F: ["-y", "x", "0"], path: { x: "2\\cos t", y: "2\\sin t", z: "0", from: 0, to: "2\\pi" } },
            eq: { m: "curlFlux", F: ["-y", "x", "0"], surface: sphere(2, "\\pi/2", "\\pi") } }] }
      ] } },
    { id: "cg-9b6-014", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "S\\text{ 是平面 }x+y+z=1\\text{ 在第一卦限的三角形，}\\mathbf n\\text{ 指向原點那一側。用 Stokes 定理時邊界要怎麼走？}",
      answer: "(1,0,0) → (0,0,1) → (0,1,0) → (1,0,0)", answers: ["(1,0,0) → (0,0,1) → (0,1,0) → (1,0,0)"], canonical: "(1,0,0) → (0,0,1) → (0,1,0) → (1,0,0)",
      distractors: ["(1,0,0) → (0,1,0) → (0,0,1) → (1,0,0)", BOTH],
      timeLimit: 90,
      tags: ["boundary-orientation-match", "stokes-theorem"],
      hints: ["指向原點的法向量是 ⟨−1, −1, −1⟩ 那個方向。", "從原點那一側看這個三角形，四指逆時針繞的是哪個頂點順序？"],
      solution: "n ∝ ⟨−1, −1, −1⟩。若 n 朝 ⟨1, 1, 1⟩，從外側看逆時針是 (1,0,0)→(0,1,0)→(0,0,1)；n 反過來，走法也反過來：(1,0,0)→(0,0,1)→(0,1,0)。",
      
      // 測試場 ⟨z, x, y⟩（旋度 ⟨1,1,1⟩）：哪個走法的環流等於 S 上（指向原點）的旋度通量
      verify: { m: "choice", options: [
        { say: "(1,0,0) → (0,0,1) → (0,1,0) → (1,0,0)", all: [{ v: { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], paths: [
          { x: "1-t", y: "0", z: "t", from: 0, to: 1 }, { x: "0", y: "t", z: "1-t", from: 0, to: 1 }, { x: "t", y: "1-t", z: "0", from: 0, to: 1 }] },
          eq: { m: "curlFlux", F: ["z", "x", "y"], surface: { x: "v", y: "(1-v)u", z: "1-v-(1-v)u", u: [0, 1], v: [0, 1] } } }] },
        { say: "(1,0,0) → (0,1,0) → (0,0,1) → (1,0,0)", all: [{ v: { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], paths: [
          { x: "1-t", y: "t", z: "0", from: 0, to: 1 }, { x: "0", y: "1-t", z: "t", from: 0, to: 1 }, { x: "t", y: "0", z: "1-t", from: 0, to: 1 }] },
          eq: { m: "curlFlux", F: ["z", "x", "y"], surface: { x: "v", y: "(1-v)u", z: "1-v-(1-v)u", u: [0, 1], v: [0, 1] } } }] },
        { say: BOTH, all: [
          { v: { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], paths: [
            { x: "1-t", y: "0", z: "t", from: 0, to: 1 }, { x: "0", y: "t", z: "1-t", from: 0, to: 1 }, { x: "t", y: "1-t", z: "0", from: 0, to: 1 }] },
            eq: { m: "curlFlux", F: ["z", "x", "y"], surface: { x: "v", y: "(1-v)u", z: "1-v-(1-v)u", u: [0, 1], v: [0, 1] } } },
          { v: { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], paths: [
            { x: "1-t", y: "t", z: "0", from: 0, to: 1 }, { x: "0", y: "1-t", z: "t", from: 0, to: 1 }, { x: "t", y: "0", z: "1-t", from: 0, to: 1 }] },
            eq: { m: "curlFlux", F: ["z", "x", "y"], surface: { x: "v", y: "(1-v)u", z: "1-v-(1-v)u", u: [0, 1], v: [0, 1] } } }] }
      ] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
