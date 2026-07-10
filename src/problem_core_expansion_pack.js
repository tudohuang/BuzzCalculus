(function () {
  "use strict";

  // 核心擴充包（2026-07 題庫審計）：
  // 1) R1-R2 基礎補強（分級測驗 / 學習路徑 / SRS 池太淺）
  // 2) 整缺經典主題：L'Hôpital、MVT/Rolle、連續性/IVT、曲線分析、
  //    相關變率/最佳化、弧長、旋轉體、平均值、Riemann 和/FTC、數列
  // 3) 中等補洞：級數 R4 斷層、三角代換/部分分式/King's/ODE 入門引導題
  // 4) R5-R6 進階難題
  const SOURCE = "Buzz core expansion pack";
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
      tabLimit: 1,
      ...problem,
      tags
    });
  }

  function num(id, topic, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit });
  }

  function expr(id, topic, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, variable: "x", tags, solution, timeLimit });
  }

  function anti(id, rank, prompt, answer, tags, solution, timeLimit) {
    add({ id, topic: "integrals", rank, prompt, answerKind: "antiderivative", answer, variable: "x", tags, solution, timeLimit });
  }

  function text(id, topic, rank, prompt, answers, canonical, tags, solution, timeLimit) {
    add({ id, topic, rank, prompt, answerKind: "text", answers, canonical, tags, solution, timeLimit });
  }

  const CONV = ["convergent", "converge", "converges", "收斂"];
  const DIV = ["divergent", "diverge", "diverges", "發散"];

  // ================= R1-R2 基礎補強 =================
  num("cx-lim-001", "limits", 1, "\\lim_{x\\to 3}(2x+1)", "7", ["direct-substitution"], "多項式直接代入：2·3+1=7。", 20);
  num("cx-lim-002", "limits", 1, "\\lim_{x\\to 4}\\frac{x^2-16}{x-4}", "8", ["factoring"], "因式分解約掉 (x−4)，剩 x+4=8。", 25);
  num("cx-lim-003", "limits", 1, "\\lim_{x\\to\\infty}\\frac{5x+3}{x-2}", "5", ["rational-limit"], "分子分母同除以 x，最高次係數比 5。", 25);
  num("cx-lim-004", "limits", 1, "\\lim_{x\\to 0}\\frac{\\sin(3x)}{x}", "3", ["trig-limit"], "sin(3x)≈3x，答案 3。", 25);
  num("cx-lim-005", "limits", 2, "\\lim_{x\\to 0}\\frac{\\sqrt{x+9}-3}{x}", "1/6", ["rationalize"], "分子有理化得 1/(√(x+9)+3) → 1/6。", 35);
  num("cx-lim-006", "limits", 2, "\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+4x}-x\\right)", "2", ["rationalize"], "乘共軛：4x/(√(x²+4x)+x) → 4/2 = 2。", 40);
  num("cx-lim-007", "limits", 2, "\\lim_{x\\to 0}\\frac{1-\\cos(2x)}{x^2}", "2", ["trig-limit", "taylor"], "1−cos u ≈ u²/2，u=2x 得 4x²/2x² = 2。", 35);
  num("cx-lim-008", "limits", 2, "\\lim_{x\\to\\infty}\\left(1+\\frac{2}{x}\\right)^x", "exp(2)", ["power-exponential"], "標準 e 型極限：(1+a/x)^x → e^a。", 35);
  num("cx-lim-009", "limits", 2, "\\lim_{x\\to 1}\\frac{x^3-1}{x-1}", "3", ["factoring"], "x³−1=(x−1)(x²+x+1)，代入得 3。", 30);
  num("cx-lim-010", "limits", 2, "\\lim_{x\\to 0}x^2\\sin\\frac{1}{x}", "0", ["squeeze"], "夾擠：|x² sin(1/x)| ≤ x² → 0。", 35);

  num("cx-der-001", "derivatives", 1, "f(x)=x^3-2x,\\quad f'(2)", "10", ["power-rule"], "f'=3x²−2，代 2 得 10。", 25);
  num("cx-der-002", "derivatives", 1, "\\frac{d}{dx}\\sin x\\ \\text{ 在 }x=0", "1", ["trig"], "導數 cos x，cos 0 = 1。", 20);
  num("cx-der-003", "derivatives", 1, "f(x)=e^{2x},\\quad f'(0)", "2", ["chain-rule", "exponential"], "鏈鎖律：2e^{2x}，代 0 得 2。", 25);
  num("cx-der-004", "derivatives", 2, "\\frac{d}{dx}\\left(x^2\\ln x\\right)\\text{ 在 }x=1", "1", ["product-rule", "log"], "乘法律：2x ln x + x，代 1 得 0+1=1。", 35);
  expr("cx-der-005", "derivatives", 2, "\\frac{d}{dx}\\frac{x}{x+1}", "1/(x+1)^2", ["quotient-rule"], "商律：((x+1)−x)/(x+1)² = 1/(x+1)²。", 40);
  expr("cx-der-006", "derivatives", 2, "\\frac{d}{dx}\\tan x", "sec(x)^2", ["trig"], "基本導數：tan' = sec²。", 30);
  num("cx-der-007", "derivatives", 2, "f(x)=\\sqrt{3x+1},\\quad f'(1)", "3/4", ["chain-rule", "radical"], "f' = 3/(2√(3x+1))，代 1 得 3/4。", 40);
  num("cx-der-008", "derivatives", 2, "\\frac{d}{dx}\\arctan x\\ \\text{ 在 }x=1", "1/2", ["inverse-trig"], "導數 1/(1+x²)，代 1 得 1/2。", 30);

  num("cx-int-001", "integrals", 1, "\\int_0^2 3x^2\\,dx", "8", ["power-rule", "definite-integral"], "原函數 x³，代上下限得 8。", 25);
  anti("cx-int-002", 1, "\\int \\cos x\\,dx", "sin(x)", ["trig"], "cos 的反導數是 sin。", 20);
  num("cx-int-003", "integrals", 1, "\\int_0^1 e^x\\,dx", "exp(1)-1", ["exponential", "definite-integral"], "原函數 eˣ，答案 e−1。", 25);
  anti("cx-int-004", 2, "\\int \\frac{1}{1+x^2}\\,dx", "atan(x)", ["inverse-trig"], "標準反導數：arctan x。", 25);
  num("cx-int-005", "integrals", 2, "\\int_0^\\pi \\sin x\\,dx", "2", ["trig", "definite-integral"], "原函數 −cos x，−cos π + cos 0 = 2。", 30);
  num("cx-int-006", "integrals", 2, "\\int_1^{e}\\frac{1}{x}\\,dx", "1", ["log", "definite-integral"], "ln x 代上下限：ln e − ln 1 = 1。", 30);
  anti("cx-int-007", 2, "\\int x e^{x^2}\\,dx", "exp(x^2)/2", ["substitution"], "u=x² 換元，得 e^{x²}/2。", 40);
  num("cx-int-008", "integrals", 2, "\\int_0^1 \\frac{x}{x^2+1}\\,dx", "log(2)/2", ["substitution", "log", "definite-integral"], "u=x²+1，(1/2)ln 2。", 40);

  num("cx-ser-001", "series", 1, "\\sum_{n=0}^{\\infty}\\left(\\frac{1}{2}\\right)^n", "2", ["geometric-series"], "幾何級數 1/(1−1/2)=2。", 25);
  text("cx-ser-002", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["p-series"], "p=2>1 的 p-級數收斂。", 25);
  num("cx-ser-003", "series", 2, "\\sum_{n=1}^{\\infty}\\left(\\frac{2}{3}\\right)^n", "2", ["geometric-series"], "首項 2/3、公比 2/3：(2/3)/(1/3)=2。", 35);
  num("cx-ser-004", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)}", "1", ["telescoping"], "拆成 1/n − 1/(n+1) 望遠鏡求和。", 40);
  text("cx-ser-005", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{1}{n}\\ \\text{ 收斂或發散？}", DIV, "divergent", ["p-series"], "調和級數發散。", 25);
  num("cx-ser-006", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}", "log(2)", ["alternating-series", "special-sum"], "交錯調和級數收斂到 ln 2。", 40);
  num("cx-ser-007", "series", 2, "\\sum_{n=0}^{\\infty} n!\\,x^n\\ \\text{ 的收斂半徑}", "0", ["radius", "ratio-test"], "比值判別：(n+1)|x| → ∞，只有 x=0 收斂。", 40);
  num("cx-ser-008", "series", 2, "\\sum_{n=0}^{\\infty}\\frac{1}{n!}", "exp(1)", ["taylor", "special-sum"], "eˣ 在 x=1 的級數：e。", 30);

  // ================= L'Hôpital =================
  num("cx-lh-001", "limits", 2, "\\lim_{x\\to 0}\\frac{e^x-1-x}{x^2}", "1/2", ["lhopital", "taylor"], "L'Hôpital 兩次或 Taylor：x²/2 項給 1/2。", 40);
  num("cx-lh-002", "limits", 3, "\\lim_{x\\to 0}\\frac{x-\\sin x}{x^3}", "1/6", ["lhopital", "taylor"], "sin x = x − x³/6 + …，答案 1/6。", 50);
  num("cx-lh-003", "limits", 3, "\\lim_{x\\to 0^+}x\\ln x", "0", ["lhopital"], "改寫成 ln x/(1/x) 用 L'Hôpital：−x → 0。", 50);
  num("cx-lh-004", "limits", 3, "\\lim_{x\\to\\infty}\\frac{x^2}{e^x}", "0", ["lhopital"], "指數壓過多項式，L'Hôpital 兩次得 0。", 40);
  num("cx-lh-005", "limits", 3, "\\lim_{x\\to 0}\\frac{\\tan x-x}{x^3}", "1/3", ["lhopital", "taylor"], "tan x = x + x³/3 + …，答案 1/3。", 55);
  num("cx-lh-006", "limits", 4, "\\lim_{x\\to 0^+}x^x", "1", ["lhopital", "power-exponential"], "ln 後是 x ln x → 0，所以極限 e⁰=1。", 60);
  num("cx-lh-007", "limits", 2, "\\lim_{x\\to 1}\\frac{\\ln x}{x-1}", "1", ["lhopital", "log"], "L'Hôpital：1/x → 1。也可視為 ln 在 1 的導數。", 35);
  num("cx-lh-008", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{\\sin x}{x}\\right)^{1/x^2}", "exp(-1/6)", ["lhopital", "power-exponential", "taylor"], "ln(sin x/x) ≈ −x²/6，除以 x² 得 −1/6，答案 e^{−1/6}。", 90);

  // ================= MVT / Rolle =================
  num("cx-mvt-001", "derivatives", 2, "f(x)=x^2\\text{ 在 }[0,2]\\text{ 上滿足 MVT 的 }c", "1", ["mvt"], "割線斜率 (4−0)/2=2，f'(c)=2c=2 → c=1。", 45);
  num("cx-mvt-002", "derivatives", 3, "f(x)=x^3\\text{ 在 }[0,3]\\text{ 上滿足 MVT 的 }c", "sqrt(3)", ["mvt"], "割線斜率 27/3=9，3c²=9 → c=√3。", 55);
  num("cx-mvt-003", "derivatives", 3, "f(x)=\\sqrt{x}\\text{ 在 }[1,4]\\text{ 上滿足 MVT 的 }c", "9/4", ["mvt", "radical"], "斜率 (2−1)/3=1/3，1/(2√c)=1/3 → c=9/4。", 60);
  num("cx-mvt-004", "derivatives", 2, "f(x)=x^2-4x+3\\text{ 在 }[1,3]\\text{ 上滿足 Rolle 定理的 }c", "2", ["rolle", "mvt"], "f(1)=f(3)=0，f'(c)=2c−4=0 → c=2。", 45);
  num("cx-mvt-005", "derivatives", 4, "f(x)=\\ln x\\text{ 在 }[1,e]\\text{ 上滿足 MVT 的 }c", "exp(1)-1", ["mvt", "log"], "斜率 1/(e−1)，1/c = 1/(e−1) → c = e−1。", 70);
  num("cx-mvt-006", "derivatives", 4, "f(x)=\\sin x\\text{ 在 }[0,\\pi]\\text{ 上滿足 Rolle 定理的 }c", "pi/2", ["rolle", "mvt", "trig"], "f(0)=f(π)=0，cos c = 0 → c=π/2。", 55);

  // ================= 連續性 / IVT =================
  num("cx-cont-001", "limits", 2, "f(x)=\\frac{x^2-9}{x-3}\\ (x\\ne 3),\\ f(3)=k\\text{ 連續，求 }k", "6", ["continuity"], "極限值 x+3 → 6，k 必須等於極限。", 40);
  num("cx-cont-002", "limits", 2, "f(x)=ax+1\\ (x\\le 2),\\quad f(x)=x^2\\ (x>2),\\ \\text{在 }x=2\\text{ 連續，求 }a", "3/2", ["continuity"], "2a+1 = 4 → a = 3/2。", 50);
  num("cx-cont-003", "limits", 3, "f(x)=\\frac{\\sin(3x)}{x}\\ (x\\ne 0),\\ f(0)=k\\text{ 連續，求 }k", "3", ["continuity", "trig-limit"], "極限 3，c=3。", 45);
  num("cx-cont-004", "limits", 3, "f(x)=x^3+x-1\\text{ 在 }(0,1)\\text{ 內恰有幾個實根？}", "1", ["ivt", "continuity"], "f(0)=−1<0<1=f(1) 由 IVT 有根；f'>0 嚴格遞增所以恰一個。", 60);
  num("cx-cont-005", "limits", 3, "f(x)=x^2+b\\ (x<1),\\quad f(x)=3x-1\\ (x\\ge 1),\\ \\text{在 }x=1\\text{ 連續，求 }b", "1", ["continuity"], "1+b = 2 → b=1。", 50);

  // ================= 凹凸 / 反曲點 / 漸近線 =================
  num("cx-curve-001", "derivatives", 2, "f(x)=x^3-3x^2\\text{ 的反曲點 }x\\text{ 座標}", "1", ["inflection", "concavity"], "f''=6x−6=0 且變號 → x=1。", 40);
  num("cx-curve-002", "derivatives", 3, "f(x)=x^4-6x^2\\text{ 的反曲點個數}", "2", ["inflection", "concavity"], "f''=12x²−12，在 x=±1 變號，共 2 個。", 50);
  num("cx-curve-003", "derivatives", 3, "f(x)=x e^{-x}\\text{ 的反曲點 }x\\text{ 座標}", "2", ["inflection", "concavity", "exponential"], "f''=(x−2)e^{−x}=0 且變號 → x=2。", 60);
  num("cx-curve-004", "limits", 2, "y=\\frac{2x^2+1}{x^2+3}\\text{ 的水平漸近線 }y\\text{ 值}", "2", ["asymptote", "rational-limit"], "x→±∞ 時比值 → 2。", 40);
  num("cx-curve-005", "limits", 3, "y=\\frac{x^2+2x+3}{x}\\text{ 的斜漸近線 }y=x+k\\text{ 的 }k", "2", ["asymptote"], "除法：x + 2 + 3/x，k=2。", 50);
  num("cx-curve-006", "limits", 3, "y=\\frac{x-1}{(x^2-1)(x^2-4)}\\text{ 的垂直漸近線條數}", "3", ["asymptote"], "x=1 是可去洞；剩 x=−1, 2, −2 共 3 條。", 60);
  num("cx-curve-007", "derivatives", 4, "f(x)=\\frac{x}{x^2+1}\\text{ 的反曲點個數}", "3", ["inflection", "concavity"], "f''=2x(x²−3)/(x²+1)³，在 x=0, ±√3 變號，共 3 個。", 75);
  num("cx-curve-008", "derivatives", 3, "f(x)=x^3-6x^2+5\\text{ 的反曲點 }x\\text{ 座標}", "2", ["inflection", "concavity"], "f''=6x−12=0 且變號 → x=2。", 45);

  // ================= 隱微分 / 相關變率 / 最佳化 =================
  num("cx-app-001", "derivatives", 2, "x^2+y^2=25,\\quad \\frac{dy}{dx}\\text{ 在 }(3,4)", "-3/4", ["implicit-differentiation"], "隱微分：dy/dx = −x/y = −3/4。", 45);
  num("cx-app-002", "derivatives", 3, "x^3+y^3=6xy,\\quad \\frac{dy}{dx}\\text{ 在 }(3,3)", "-1", ["implicit-differentiation"], "dy/dx=(2y−x²)/(y²−2x)，代 (3,3) 得 −1。", 70);
  num("cx-app-003", "derivatives", 3, "\\text{球體 }V=\\tfrac{4}{3}\\pi r^3,\\ \\frac{dV}{dt}=8,\\ r=2\\text{ 時 }\\frac{dr}{dt}", "1/(2*pi)", ["related-rates"], "dV/dt = 4πr² dr/dt → dr/dt = 8/(16π) = 1/(2π)。", 70);
  num("cx-app-004", "derivatives", 3, "\\text{5 m 梯子靠牆，底端以 1 m/s 滑離，底端距牆 3 m 時頂端下滑速率}", "3/4", ["related-rates"], "x²+y²=25：y dy/dt = −x dx/dt → |dy/dt| = 3/4。", 75);
  num("cx-app-005", "derivatives", 4, "\\text{倒圓錐水槽 }r=\\tfrac{h}{2},\\ \\frac{dV}{dt}=3,\\ h=2\\text{ 時 }\\frac{dh}{dt}", "3/pi", ["related-rates"], "V=πh³/12，dV/dh=πh²/4=π → dh/dt=3/π。", 90);
  num("cx-app-006", "derivatives", 2, "\\text{兩正數和為 20，乘積最大值}", "100", ["optimization"], "對稱時最大：10×10=100。", 40);
  num("cx-app-007", "derivatives", 3, "\\text{40 m 圍籬靠牆圍長方形（三邊），最大面積}", "200", ["optimization"], "x+2y=40，A=xy=(40−2y)y，y=10 時最大 200。", 70);
  num("cx-app-008", "derivatives", 3, "f(x)=x+\\frac{4}{x}\\ (x>0)\\text{ 的最小值}", "4", ["optimization"], "f'=1−4/x²=0 → x=2，f(2)=4（或 AM-GM）。", 50);
  num("cx-app-009", "derivatives", 4, "\\text{12×12 紙板四角剪去 }x\\text{ 摺成無蓋盒，最大體積}", "128", ["optimization"], "V=x(12−2x)²，V'=0 → x=2，V=2·64=128。", 90);
  num("cx-app-010", "derivatives", 4, "y=\\sqrt{x}\\text{ 上離 }(\\tfrac{3}{2},0)\\text{ 最近的點的 }x\\text{ 座標}", "1", ["optimization"], "D²=(x−3/2)²+x，微分 2(x−3/2)+1=0 → x=1。", 80);

  // ================= 弧長 =================
  num("cx-arc-001", "integrals", 3, "y=\\tfrac{2}{3}x^{3/2},\\ 0\\le x\\le 3\\text{ 的弧長}", "14/3", ["arc-length"], "1+y'²=1+x，∫√(1+x)dx = (2/3)(8−1)=14/3。", 70);
  num("cx-arc-002", "integrals", 4, "y=\\frac{x^3}{6}+\\frac{1}{2x},\\ 1\\le x\\le 2\\text{ 的弧長}", "17/12", ["arc-length"], "1+y'² 是完全平方：(x²/2+1/(2x²))²，積分得 17/12。", 100);
  num("cx-arc-003", "integrals", 3, "x=3\\cos t,\\ y=3\\sin t,\\ 0\\le t\\le \\tfrac{\\pi}{2}\\text{ 的弧長}", "3*pi/2", ["arc-length", "parametric"], "速率恆為 3，弧長 3·π/2。", 55);
  num("cx-arc-004", "integrals", 4, "y=\\ln(\\cos x),\\ 0\\le x\\le \\tfrac{\\pi}{3}\\text{ 的弧長}", "log(2+sqrt(3))", ["arc-length", "trig"], "1+tan²=sec²，∫sec x dx = ln|sec+tan| = ln(2+√3)。", 100);
  num("cx-arc-005", "integrals", 4, "y=\\cosh x,\\ 0\\le x\\le 1\\text{ 的弧長}", "sinh(1)", ["arc-length"], "1+sinh² = cosh²，∫cosh = sinh 1。", 80);

  // ================= 旋轉體體積 =================
  num("cx-rev-001", "integrals", 3, "y=\\sqrt{x},\\ 0\\le x\\le 4\\text{ 繞 }x\\text{ 軸的體積}", "8*pi", ["solid-of-revolution"], "圓盤法 π∫x dx = π·8。", 60);
  num("cx-rev-002", "integrals", 3, "y=x^2,\\ 0\\le x\\le 1\\text{ 繞 }x\\text{ 軸的體積}", "pi/5", ["solid-of-revolution"], "π∫x⁴ dx = π/5。", 55);
  num("cx-rev-003", "integrals", 4, "y=x\\text{ 與 }y=x^2\\text{ 所圍區域繞 }x\\text{ 軸的體積}", "2*pi/15", ["solid-of-revolution"], "墊圈法 π∫(x²−x⁴) = π(1/3−1/5) = 2π/15。", 90);
  num("cx-rev-004", "integrals", 4, "y=x^2,\\ 0\\le x\\le 1\\text{ 與 }y\\text{ 軸、}y=1\\text{ 所圍區域繞 }y\\text{ 軸的體積}", "pi/2", ["solid-of-revolution"], "對 y 積：x²=y，π∫₀¹ y dy = π/2。", 90);
  num("cx-rev-005", "integrals", 4, "y=x-x^2\\text{ 與 }x\\text{ 軸所圍區域繞 }y\\text{ 軸的體積}", "pi/6", ["solid-of-revolution"], "殼層法 2π∫x(x−x²)dx = 2π(1/3−1/4) = π/6。", 100);
  num("cx-rev-006", "integrals", 3, "y=\\sqrt{4-x^2}\\text{ 繞 }x\\text{ 軸的體積（半徑 2 的球）}", "32*pi/3", ["solid-of-revolution"], "π∫(4−x²)dx 從 −2 到 2 = 32π/3。", 65);
  num("cx-rev-007", "integrals", 4, "y=e^x,\\ 0\\le x\\le 1\\text{ 繞 }x\\text{ 軸的體積}", "pi*(exp(2)-1)/2", ["solid-of-revolution", "exponential"], "π∫e^{2x}dx = π(e²−1)/2。", 80);

  // ================= 旋轉曲面面積 =================
  num("cx-sa-001", "integrals", 4, "y=3x,\\ 0\\le x\\le 4\\text{ 繞 }x\\text{ 軸的旋轉曲面面積}", "48*sqrt(10)*pi", ["surface-area", "solid-of-revolution"], "S=2π∫3x√10 dx = 2π√10·24 = 48√10 π。", 90);
  num("cx-sa-002", "integrals", 5, "y=\\sqrt{4-x^2},\\ -2\\le x\\le 2\\text{ 繞 }x\\text{ 軸的旋轉曲面面積}", "16*pi", ["surface-area", "solid-of-revolution"], "圓的 y√(1+y'²)=r=2 為常數：2π·2·4 = 16π（球面 4πr²）。", 100);
  num("cx-sa-003", "integrals", 5, "y=\\frac{x^3}{3},\\ 0\\le x\\le 1\\text{ 繞 }x\\text{ 軸的旋轉曲面面積}", "pi*(2*sqrt(2)-1)/9", ["surface-area", "solid-of-revolution"], "S=(2π/3)∫x³√(1+x⁴)dx = (2π/3)·(2√2−1)/6 = π(2√2−1)/9。", 120);

  // ================= 平均值 =================
  num("cx-avg-001", "integrals", 2, "f(x)=x^2\\text{ 在 }[0,3]\\text{ 的平均值}", "3", ["average-value"], "(1/3)∫x² = (1/3)(9) = 3。", 40);
  num("cx-avg-002", "integrals", 3, "f(x)=\\sin x\\text{ 在 }[0,\\pi]\\text{ 的平均值}", "2/pi", ["average-value", "trig"], "(1/π)·2 = 2/π。", 45);
  num("cx-avg-003", "integrals", 3, "f(x)=\\frac{1}{x}\\text{ 在 }[1,e]\\text{ 的平均值}", "1/(exp(1)-1)", ["average-value", "log"], "積分是 1，除以區間長 e−1。", 50);

  // ================= Riemann 和 / FTC =================
  num("cx-ftc-001", "integrals", 3, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{n}\\left(\\frac{k}{n}\\right)^2", "1/3", ["riemann-sum"], "這是 ∫₀¹x²dx 的 Riemann 和 = 1/3。", 60);
  num("cx-ftc-002", "integrals", 4, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{n+k}", "log(2)", ["riemann-sum", "log"], "= (1/n)Σ1/(1+k/n) → ∫₀¹dx/(1+x) = ln 2。", 75);
  num("cx-ftc-003", "integrals", 2, "F(x)=\\int_0^x e^{t^2}dt,\\quad F'(1)", "exp(1)", ["ftc", "moving-limits"], "FTC：F'(x)=e^{x²}，代 1 得 e。", 40);
  expr("cx-ftc-004", "integrals", 3, "\\frac{d}{dx}\\int_0^{x^2}\\sin t\\,dt", "2*x*sin(x^2)", ["ftc", "moving-limits", "chain-rule"], "FTC + 鏈鎖：sin(x²)·2x。", 60);
  num("cx-ftc-005", "integrals", 4, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{n}{n^2+k^2}", "pi/4", ["riemann-sum", "inverse-trig"], "= (1/n)Σ1/(1+(k/n)²) → ∫₀¹dx/(1+x²) = π/4。", 90);
  num("cx-ftc-006", "integrals", 2, "f(x)=x^2+3x,\\quad \\int_0^5 f'(x)\\,dx", "40", ["ftc"], "FTC：f(5)−f(0) = 40。", 35);

  // ================= 數列 =================
  num("cx-seq-001", "series", 2, "a_n=\\frac{3n^2+n}{n^2+2},\\quad \\lim_{n\\to\\infty}a_n", "3", ["sequence"], "最高次係數比 3。", 30);
  num("cx-seq-002", "series", 2, "a_n=\\left(1+\\frac{1}{n}\\right)^n,\\quad \\lim_{n\\to\\infty}a_n", "exp(1)", ["sequence"], "e 的定義。", 30);
  num("cx-seq-003", "series", 3, "a_n=n^{1/n},\\quad \\lim_{n\\to\\infty}a_n", "1", ["sequence", "power-exponential"], "ln aₙ = (ln n)/n → 0，極限 1。", 50);
  num("cx-seq-004", "series", 3, "a_1=\\sqrt{2},\\ a_{n+1}=\\sqrt{2a_n},\\quad \\lim_{n\\to\\infty}a_n", "2", ["sequence", "recursive"], "單調有界，固定點 L=√(2L) → L=2。", 65);
  num("cx-seq-005", "series", 4, "a_1=1,\\ a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{2}{a_n}\\right),\\quad \\lim_{n\\to\\infty}a_n", "sqrt(2)", ["sequence", "recursive", "newton-method"], "Newton 法求 √2 的迭代，固定點 L=(L+2/L)/2 → L²=2。", 75);
  num("cx-seq-006", "series", 2, "a_n=\\frac{\\sin n}{n},\\quad \\lim_{n\\to\\infty}a_n", "0", ["sequence", "squeeze"], "夾擠：|sin n/n| ≤ 1/n → 0。", 35);

  // ================= 級數 R4 斷層 =================
  num("cx-smid-001", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n}{2^n}", "2", ["power-series", "special-sum"], "Σn xⁿ = x/(1−x)²，代 x=1/2 得 2。", 70);
  num("cx-smid-002", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^2}{2^n}", "6", ["power-series", "special-sum"], "Σn²xⁿ = x(1+x)/(1−x)³，代 1/2 得 6。", 90);
  num("cx-smid-003", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+2)}", "3/4", ["telescoping"], "(1/2)(1/n − 1/(n+2)) 望遠鏡：(1/2)(1+1/2)=3/4。", 70);
  num("cx-smid-004", "series", 4, "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}", "pi/4", ["alternating-series", "special-sum", "taylor"], "Leibniz 級數：arctan 1 = π/4。", 60);
  num("cx-smid-005", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{4n^2-1}", "1/2", ["telescoping"], "(1/2)(1/(2n−1)−1/(2n+1)) 望遠鏡 = 1/2。", 70);
  num("cx-smid-006", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}x^n\\text{ 的收斂半徑}", "exp(1)", ["radius", "ratio-test"], "比值 → (n/(n+1))ⁿ → 1/e，半徑 e。", 90);
  num("cx-smid-007", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{x^n}{n\\,3^n}\\text{ 的收斂半徑}", "3", ["radius", "ratio-test"], "比值 |x|/3，半徑 3。", 55);
  num("cx-smid-008", "series", 4, "\\sum_{n=1}^{\\infty}n x^{n-1}\\text{ 在 }x=\\tfrac{1}{3}\\text{ 的和}", "9/4", ["power-series"], "= 1/(1−x)²，代 1/3 得 9/4。", 60);
  num("cx-smid-009", "series", 4, "\\cos(x^2)\\text{ 中 }x^4\\text{ 的 Taylor 係數}", "-1/2", ["taylor", "coefficient", "composite-taylor"], "cos u = 1 − u²/2 + …，u=x² 給 −x⁴/2。", 60);
  num("cx-smid-010", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{2^n}{n!}", "exp(2)-1", ["taylor", "special-sum"], "e² 的級數去掉 n=0 項：e²−1。", 60);
  text("cx-smid-011", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{(n!)^2}{(2n)!}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["ratio-test"], "比值 → (n+1)²/((2n+1)(2n+2)) → 1/4 < 1，收斂。", 70);
  text("cx-smid-012", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["integral-test"], "積分判別：∫dx/(x ln²x) 收斂。", 70);
  text("cx-smid-013", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}\\ \\text{ 收斂或發散？}", DIV, "divergent", ["integral-test"], "積分判別：ln(ln x) 發散。", 70);

  // ================= 三角代換 / 部分分式 / King's 入門 =================
  num("cx-trig-001", "integrals", 3, "\\int_0^1\\sqrt{1-x^2}\\,dx", "pi/4", ["trig-substitution", "definite-integral"], "四分之一單位圓面積 π/4（或 x=sin θ 代換）。", 55);
  num("cx-trig-002", "integrals", 3, "\\int_0^1\\frac{dx}{(1+x^2)^{3/2}}", "1/sqrt(2)", ["trig-substitution", "definite-integral"], "x=tan θ：∫cos θ dθ = sin θ = x/√(1+x²) → 1/√2。", 75);
  anti("cx-trig-003", 3, "\\int\\frac{dx}{\\sqrt{4-x^2}}", "asin(x/2)", ["trig-substitution", "inverse-trig"], "標準形：arcsin(x/2)。", 50);
  num("cx-trig-004", "integrals", 3, "\\int_0^2\\sqrt{4-x^2}\\,dx", "pi", ["trig-substitution", "definite-integral"], "四分之一個半徑 2 的圓：4π/4 = π。", 55);
  num("cx-pf-001", "integrals", 3, "\\int_0^1\\frac{dx}{(x+1)(x+2)}", "log(4/3)", ["partial-fraction", "log", "definite-integral"], "拆成 1/(x+1)−1/(x+2)，得 ln(4/3)。", 60);
  num("cx-pf-002", "integrals", 3, "\\int_2^3\\frac{dx}{x^2-1}", "log(3/2)/2", ["partial-fraction", "log", "definite-integral"], "(1/2)ln((x−1)/(x+1)) 代限：(1/2)ln(3/2)。", 75);
  num("cx-pf-003", "integrals", 3, "\\int_0^1\\frac{x\\,dx}{(x+1)(x+2)}", "log(9/8)", ["partial-fraction", "log", "definite-integral"], "x/((x+1)(x+2)) = −1/(x+1)+2/(x+2)，得 2ln3−3ln2 = ln(9/8)。", 90);
  num("cx-king-001", "integrals", 4, "\\int_0^{\\pi/2}\\frac{\\sin x}{\\sin x+\\cos x}\\,dx", "pi/4", ["kings-property", "definite-integral"], "King's：與 cos 版本相加得 π/2，故各半 π/4。", 70);
  num("cx-king-002", "integrals", 4, "\\int_0^{\\pi}\\frac{x\\sin x}{1+\\cos^2 x}\\,dx", "pi^2/4", ["kings-property", "definite-integral", "inverse-trig"], "x→π−x 得 I = (π/2)∫sin/(1+cos²) = (π/2)·(π/2) = π²/4。", 110);

  // ================= ODE 入門 =================
  expr("cx-ode-001", "derivatives", 2, "y'=3y,\\ y(0)=2.\\ y=?", "2*exp(3*x)", ["ode-intro", "separable", "exponential-growth"], "指數解 y=Ce^{3x}，C=2。", 55);
  expr("cx-ode-002", "derivatives", 2, "y'=-2y,\\ y(0)=5.\\ y=?", "5*exp(-2*x)", ["ode-intro", "separable"], "衰減解 y=5e^{−2x}。", 55);
  expr("cx-ode-003", "derivatives", 3, "y'=y^2,\\ y(0)=1.\\ y=?", "1/(1-x)", ["ode-intro", "separable"], "分離變數：−1/y = x + C → y = 1/(1−x)。", 75);
  num("cx-ode-004", "derivatives", 3, "y'=\\frac{x}{y},\\ y(0)=2.\\quad y(2)=?", "2*sqrt(2)", ["ode-intro", "separable"], "y²=x²+4，y(2)=√8=2√2。", 70);
  expr("cx-ode-005", "derivatives", 3, "y'+y=1,\\ y(0)=0.\\ y=?", "1-exp(-x)", ["ode-intro", "integrating-factor", "first-order"], "積分因子 eˣ：y = 1 − e^{−x}。", 80);
  expr("cx-ode-006", "derivatives", 4, "y''-3y'+2y=0,\\ y(0)=0,\\ y'(0)=1.\\ y=?", "exp(2*x)-exp(x)", ["ode-intro", "second-order"], "特徵根 1, 2：y=C₁eˣ+C₂e^{2x}，初值給 y=e^{2x}−eˣ。", 95);

  // ================= 大考題感中等題 =================
  const EXAM = ["exam-style", "transfer-exam", "proficiency-exam", "midterm-style"];
  num("cx-exam-001", "limits", 3, "\\lim_{x\\to 0}\\frac{\\sqrt{1+x}-\\sqrt{1-x}}{x}", "1", ["rationalize", ...EXAM], "有理化：2x/(x(√(1+x)+√(1−x))) → 1。", 55);
  num("cx-exam-002", "limits", 4, "\\lim_{x\\to 0}\\frac{e^{x^2}-\\cos x}{x^2}", "3/2", ["taylor", ...EXAM], "e^{x²}≈1+x²，cos x≈1−x²/2，相減除 x² 得 3/2。", 70);
  num("cx-exam-003", "derivatives", 3, "f(x)=x^3e^{-x},\\quad f'(1)", "2*exp(-1)", ["product-rule", "exponential", ...EXAM], "f'=(3x²−x³)e^{−x}，代 1 得 2/e。", 60);
  num("cx-exam-004", "derivatives", 4, "\\frac{d}{dx}x^x\\ \\text{ 在 }x=1", "1", ["power-exponential", "log", ...EXAM], "y'=x^x(ln x+1)，代 1 得 1。", 70);
  num("cx-exam-005", "integrals", 3, "\\int_0^{\\pi/4}\\tan x\\,dx", "log(2)/2", ["trig", "log", "definite-integral", ...EXAM], "−ln|cos x|：−ln(1/√2) = (1/2)ln 2。", 60);
  num("cx-exam-006", "integrals", 4, "\\int_0^1 x^2e^x\\,dx", "exp(1)-2", ["integration-by-parts", ...EXAM], "IBP 兩次：(x²−2x+2)eˣ，代限 e−2。", 90);
  num("cx-exam-007", "integrals", 4, "\\int_0^{\\pi/2}\\sin^3 x\\,dx", "2/3", ["trig-power", "definite-integral", ...EXAM], "拆 sin³=sin(1−cos²)，得 1−1/3 = 2/3。", 75);
  num("cx-exam-008", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n\\,2^n}", "log(2)", ["power-series", "special-sum", ...EXAM], "−ln(1−x) 的級數在 x=1/2：ln 2。", 75);

  // ================= R5-R6 進階難題 =================
  num("cx-hi-001", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)^2}", "pi/4", ["improper-integral", "trig-substitution"], "x=tan θ：∫cos²θ dθ 從 0 到 π/2 = π/4。", 110);
  num("cx-hi-002", "integrals", 5, "\\int_0^1\\ln x\\,dx", "-1", ["improper-integral", "log", "integration-by-parts"], "x ln x − x 代限，瑕點極限 x ln x → 0，答案 −1。", 90);
  num("cx-hi-003", "integrals", 5, "\\int_0^{\\infty}x^2e^{-x}\\,dx", "2", ["improper-integral", "gamma-function"], "Γ(3) = 2! = 2。", 80);
  num("cx-hi-004", "integrals", 6, "\\int_0^{\\infty}e^{-x^2}\\,dx", "sqrt(pi)/2", ["improper-integral", "gamma-function"], "高斯積分的一半：√π/2。", 90);
  num("cx-hi-005", "integrals", 6, "\\int_0^1(\\ln x)^2\\,dx", "2", ["improper-integral", "log", "integration-by-parts"], "IBP 兩次（或 Γ(3)）：答案 2。", 110);
  num("cx-hi-006", "integrals", 6, "\\int_0^{\\pi/2}\\ln(\\sin x)\\,dx", "-(pi/2)*log(2)", ["improper-integral", "log", "kings-property"], "經典：對稱性 + 倍角化簡，I = −(π/2)ln 2。", 150);
  num("cx-hi-007", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{(x^2+4)(x^2+9)}", "pi/60", ["improper-integral", "partial-fraction"], "拆成 (1/5)[1/(x²+4)−1/(x²+9)]：(1/5)(π/4−π/6) = π/60。", 120);
  num("cx-hi-008", "integrals", 6, "\\int_0^{\\infty}\\frac{e^{-x}-e^{-2x}}{x}\\,dx", "log(2)", ["improper-integral", "frullani"], "Frullani：ln(2/1) = ln 2。", 110);
  num("cx-hs-001", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}", "pi^2/6", ["special-sum"], "Basel 問題：π²/6。", 60);
  num("cx-hs-002", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^2}", "pi^2/12", ["alternating-series", "special-sum"], "η(2) = (1−2^{1−2})ζ(2) = π²/12。", 80);
  num("cx-hs-003", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n}{(n+1)!}", "1", ["telescoping", "special-sum"], "n/(n+1)! = 1/n! − 1/(n+1)! 望遠鏡 = 1。", 90);
  num("cx-hs-004", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^4}", "pi^4/90", ["special-sum"], "ζ(4) = π⁴/90。", 80);
  num("cx-hs-005", "series", 6, "\\sum_{n=0}^{\\infty}\\frac{1}{(2n)!}", "cosh(1)", ["special-sum", "taylor"], "cosh 的級數在 x=1。", 80);
  num("cx-hs-006", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n},\\quad H_n=1+\\tfrac12+\\cdots+\\tfrac1n", "2*log(2)", ["harmonic-number", "generating-function", "special-sum"], "ΣHₙxⁿ = −ln(1−x)/(1−x)，代 1/2 得 2 ln 2。", 140);
  num("cx-hl-001", "limits", 5, "\\lim_{x\\to 0}\\left(\\frac{1}{\\sin^2 x}-\\frac{1}{x^2}\\right)", "1/3", ["taylor", "hard-limit"], "通分後用 sin²x ≈ x² − x⁴/3：分子/x⁴ → 1/3。", 120);
  num("cx-hl-002", "limits", 5, "\\lim_{x\\to\\infty}\\left(x-x^2\\ln\\left(1+\\frac{1}{x}\\right)\\right)", "1/2", ["taylor", "hard-limit", "log"], "ln(1+u)=u−u²/2+…，展開得 1/2 − 1/(3x) → 1/2。", 110);
  num("cx-hl-003", "limits", 5, "\\lim_{n\\to\\infty}n\\left(\\left(1+\\frac{1}{n}\\right)^n-e\\right)", "-exp(1)/2", ["taylor", "hard-limit", "asymptotic-expansion"], "(1+1/n)ⁿ = e(1 − 1/(2n) + O(1/n²))，答案 −e/2。", 140);
  num("cx-hl-004", "limits", 5, "\\lim_{n\\to\\infty}\\frac{(n!)^{1/n}}{n}", "exp(-1)", ["hard-limit", "asymptotic-expansion"], "Stirling：(n!)^{1/n} ~ n/e，比值 → 1/e。", 120);
  num("cx-hl-005", "limits", 6, "\\lim_{n\\to\\infty}n\\sin(2\\pi e\\,n!)", "2*pi", ["hard-limit", "putnam", "taylor"], "e·n! = 整數 + 1/(n+1) + O(1/n²)，sin 剩 2π/(n+1) 項，乘 n → 2π。", 160);
  num("cx-hl-006", "limits", 5, "\\lim_{x\\to\\infty}\\frac{x\\left(x^{1/x}-1\\right)}{\\ln x}", "1", ["hard-limit", "power-exponential", "log"], "x^{1/x} = e^{ln x/x} ≈ 1 + ln x/x，比值 → 1。", 120);
  num("cx-hm-001", "integrals", 6, "\\int_0^1\\frac{\\ln(1+x)}{1+x^2}\\,dx", "(pi/8)*log(2)", ["improper-integral", "kings-property", "putnam", "log"], "x=tan θ 後用 King's 對稱：I = (π/8)ln 2。", 160);
  num("cx-hm-002", "integrals", 6, "\\int_0^{\\pi/2}\\frac{dx}{1+\\tan^{\\sqrt{2}}x}", "pi/4", ["kings-property", "putnam"], "x→π/2−x 相加得 π/2，任何指數都一樣：π/4。", 130);
  num("cx-hm-003", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)}", "1/4", ["telescoping", "special-sum"], "拆成 (1/2)[1/(n(n+1)) − 1/((n+1)(n+2))] 望遠鏡 = 1/4。", 120);
  num("cx-hm-004", "derivatives", 6, "f(x)=x\\sin x,\\quad f^{(100)}(0)", "-100", ["higher-derivative", "taylor"], "x sin x 的 x^{100} 係數是 −1/99!，乘 100! 得 −100。", 140);

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
