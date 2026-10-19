(function () {
  // 2026-08-16：移除 34 題與既有題庫重複的題目（tools/detect_duplicates.js 抓出來的）。
  // 重複題不只是浪費一個題目名額 —— 能力模型會把同一題算成兩次獨立證據，
  // 使用者做了兩題一模一樣的東西，系統卻以為他在那個技巧上有兩倍的把握；
  // 冷卻機制也會失效，剛做完的題目換個 id 立刻又出現。
  // 被移除的那些題，原本的版本都還在（lim-011、int-002、ser-001…）。
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
  num("cx-int-003", "integrals", 1, "\\int_0^1 e^x\\,dx", "exp(1)-1", ["exponential", "definite-integral"], "原函數 eˣ，答案 e−1。", 25);
  anti("cx-int-004", 2, "\\int \\frac{1}{1+x^2}\\,dx", "atan(x)", ["inverse-trig"], "標準反導數：arctan x。", 25);
  num("cx-int-006", "integrals", 2, "\\int_1^{e}\\frac{1}{x}\\,dx", "1", ["log", "definite-integral"], "ln x 代上下限：ln e − ln 1 = 1。", 30);
  num("cx-int-008", "integrals", 2, "\\int_0^1 \\frac{x}{x^2+1}\\,dx", "log(2)/2", ["substitution", "log", "definite-integral"], "u=x²+1，(1/2)ln 2。", 40);

  text("cx-ser-002", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["p-series"], "p=2>1 的 p-級數收斂。", 25);
  num("cx-ser-003", "series", 2, "\\sum_{n=1}^{\\infty}\\left(\\frac{2}{3}\\right)^n", "2", ["geometric-series"], "首項 2/3、公比 2/3：(2/3)/(1/3)=2。", 35);
  text("cx-ser-005", "series", 1, "\\sum_{n=1}^{\\infty}\\frac{1}{n}\\ \\text{ 收斂或發散？}", DIV, "divergent", ["p-series"], "調和級數發散。", 25);
  num("cx-ser-007", "series", 2, "\\sum_{n=0}^{\\infty} n!\\,x^n\\ \\text{ 的收斂半徑}", "0", ["radius", "ratio-test"], "比值判別：(n+1)|x| → ∞，只有 x=0 收斂。", 40);
  num("cx-ser-008", "series", 2, "\\sum_{n=0}^{\\infty}\\frac{1}{n!}", "exp(1)", ["taylor", "special-sum"], "eˣ 在 x=1 的級數：e。", 30);

  // ================= L'Hôpital =================
  num("cx-lh-001", "limits", 2, "\\lim_{x\\to 0}\\frac{e^x-1-x}{x^2}", "1/2", ["lhopital", "taylor"], "L'Hôpital 兩次或 Taylor：x²/2 項給 1/2。", 40);
  num("cx-lh-002", "limits", 3, "\\lim_{x\\to 0}\\frac{x-\\sin x}{x^3}", "1/6", ["lhopital", "taylor"], "sin x = x − x³/6 + …，答案 1/6。", 50);
  num("cx-lh-004", "limits", 3, "\\lim_{x\\to\\infty}\\frac{x^2}{e^x}", "0", ["lhopital"], "指數壓過多項式，L'Hôpital 兩次得 0。", 40);
  num("cx-lh-007", "limits", 2, "\\lim_{x\\to 1}\\frac{\\ln x}{x-1}", "1", ["lhopital", "log"], "L'Hôpital：1/x → 1。也可視為 ln 在 1 的導數。", 35);
  // 2026-08-16 補的五題。去重之後這個技巧只剩 4 題 —— 原本的 8 題有一半是
  // 跟其他包重複的同一題，也就是說「這個技巧有八題」從來都不是真的。
  // 這五題的答案全部通過 tools/verify_answers.js 的獨立數值驗算。
  num("cx-lh-009", "limits", 2, "\\lim_{x\\to 0}\\frac{x\\cos x-\\sin x}{x^3}", "-1/3", ["lhopital", "taylor"], "分子展開得 −x³/3 + O(x⁵)，比值 −1/3。L'Hôpital 要連用三次。", 45);
  num("cx-lh-010", "limits", 2, "\\lim_{x\\to 0}\\frac{e^{x}-e^{-x}}{\\sin x}", "2", ["lhopital", "trig"], "分子導數 e^x+e^{−x} → 2，分母導數 cos x → 1。", 35);
  num("cx-lh-011", "limits", 3, "\\lim_{x\\to \\pi/2}\\frac{1-\\sin x}{(\\pi/2-x)^2}", "1/2", ["lhopital", "trig"], "令 t=π/2−x：(1−cos t)/t² → 1/2。也可直接 L'Hôpital 兩次。", 45);
  num("cx-lh-012", "limits", 3, "\\lim_{x\\to 0}\\left(\\frac{1}{x}-\\frac{1}{e^x-1}\\right)", "1/2", ["lhopital", "taylor"], "通分成 (e^x−1−x)/(x(e^x−1))，分子 x²/2、分母 x²，得 1/2。", 55);
  num("cx-lh-013", "limits", 3, "\\lim_{x\\to\\infty}x\\left(\\frac{\\pi}{2}-\\arctan x\\right)", "1", ["lhopital", "inverse-trig"], "令 t=1/x：(π/2−arctan(1/t))/t = arctan t/t → 1。", 50);

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
  num("cx-ftc-006", "integrals", 2, "f(x)=x^2+3x,\\quad \\int_0^5 f'(x)\\,dx", "40", ["ftc"], "FTC：f(5)−f(0) = 40。", 35);

  // ================= 數列 =================
  num("cx-seq-001", "series", 2, "a_n=\\frac{3n^2+n}{n^2+2},\\quad \\lim_{n\\to\\infty}a_n", "3", ["sequence"], "最高次係數比 3。", 30);
  num("cx-seq-002", "series", 2, "a_n=\\left(1+\\frac{1}{n}\\right)^n,\\quad \\lim_{n\\to\\infty}a_n", "exp(1)", ["sequence"], "e 的定義。", 30);
  num("cx-seq-003", "series", 3, "a_n=n^{1/n},\\quad \\lim_{n\\to\\infty}a_n", "1", ["sequence", "power-exponential"], "ln aₙ = (ln n)/n → 0，極限 1。", 50);
  num("cx-seq-004", "series", 3, "a_1=\\sqrt{2},\\ a_{n+1}=\\sqrt{2a_n},\\quad \\lim_{n\\to\\infty}a_n", "2", ["sequence", "recursive"], "單調有界，固定點 L=√(2L) → L=2。", 65);
  num("cx-seq-005", "series", 4, "a_1=1,\\ a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{2}{a_n}\\right),\\quad \\lim_{n\\to\\infty}a_n", "sqrt(2)", ["sequence", "recursive", "newton-method"], "Newton 法求 √2 的迭代，固定點 L=(L+2/L)/2 → L²=2。", 75);
  num("cx-seq-006", "series", 2, "a_n=\\frac{\\sin n}{n},\\quad \\lim_{n\\to\\infty}a_n", "0", ["sequence", "squeeze"], "夾擠：|sin n/n| ≤ 1/n → 0。", 35);

  // ================= 級數 R4 斷層 =================
  num("cx-smid-006", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}x^n\\text{ 的收斂半徑}", "exp(1)", ["radius", "ratio-test"], "比值 → (n/(n+1))ⁿ → 1/e，半徑 e。", 90);
  num("cx-smid-007", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{x^n}{n\\,3^n}\\text{ 的收斂半徑}", "3", ["radius", "ratio-test"], "比值 |x|/3，半徑 3。", 55);
  num("cx-smid-008", "series", 4, "\\sum_{n=1}^{\\infty}n x^{n-1}\\text{ 在 }x=\\tfrac{1}{3}\\text{ 的和}", "9/4", ["power-series"], "= 1/(1−x)²，代 1/3 得 9/4。", 60);
  num("cx-smid-009", "series", 4, "\\cos(x^2)\\text{ 中 }x^4\\text{ 的 Taylor 係數}", "-1/2", ["taylor", "coefficient", "composite-taylor"], "cos u = 1 − u²/2 + …，u=x² 給 −x⁴/2。", 60);
  text("cx-smid-011", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{(n!)^2}{(2n)!}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["ratio-test"], "比值 → (n+1)²/((2n+1)(2n+2)) → 1/4 < 1，收斂。", 70);
  text("cx-smid-012", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}\\ \\text{ 收斂或發散？}", CONV, "convergent", ["integral-test"], "積分判別：∫dx/(x ln²x) 收斂。", 70);
  text("cx-smid-013", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}\\ \\text{ 收斂或發散？}", DIV, "divergent", ["integral-test"], "積分判別：ln(ln x) 發散。", 70);

  // ================= 三角代換 / 部分分式 / King's 入門 =================
  num("cx-trig-001", "integrals", 3, "\\int_0^1\\sqrt{1-x^2}\\,dx", "pi/4", ["trig-substitution", "definite-integral"], "四分之一單位圓面積 π/4（或 x=sin θ 代換）。", 55);
  num("cx-trig-002", "integrals", 3, "\\int_0^1\\frac{dx}{(1+x^2)^{3/2}}", "1/sqrt(2)", ["trig-substitution", "definite-integral"], "x=tan θ：∫cos θ dθ = sin θ = x/√(1+x²) → 1/√2。", 75);
  anti("cx-trig-003", 3, "\\int\\frac{dx}{\\sqrt{4-x^2}}", "asin(x/2)", ["trig-substitution", "inverse-trig"], "標準形：arcsin(x/2)。", 50);
  num("cx-pf-001", "integrals", 3, "\\int_0^1\\frac{dx}{(x+1)(x+2)}", "log(4/3)", ["partial-fraction", "log", "definite-integral"], "拆成 1/(x+1)−1/(x+2)，得 ln(4/3)。", 60);
  num("cx-pf-002", "integrals", 3, "\\int_2^3\\frac{dx}{x^2-1}", "log(3/2)/2", ["partial-fraction", "log", "definite-integral"], "(1/2)ln((x−1)/(x+1)) 代限：(1/2)ln(3/2)。", 75);
  num("cx-pf-003", "integrals", 3, "\\int_0^1\\frac{x\\,dx}{(x+1)(x+2)}", "log(9/8)", ["partial-fraction", "log", "definite-integral"], "x/((x+1)(x+2)) = −1/(x+1)+2/(x+2)，得 2ln3−3ln2 = ln(9/8)。", 90);
  num("cx-king-001", "integrals", 4, "\\int_0^{\\pi/2}\\frac{\\sin x}{\\sin x+\\cos x}\\,dx", "pi/4", ["kings-property", "definite-integral"], "King's：與 cos 版本相加得 π/2，故各半 π/4。", 70);

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
  num("cx-exam-003", "derivatives", 3, "f(x)=x^3e^{-x},\\quad f'(1)", "2*exp(-1)", ["product-rule", "exponential", ...EXAM], "f'=(3x²−x³)e^{−x}，代 1 得 2/e。", 60);
  num("cx-exam-004", "derivatives", 4, "\\frac{d}{dx}x^x\\ \\text{ 在 }x=1", "1", ["power-exponential", "log", ...EXAM], "y'=x^x(ln x+1)，代 1 得 1。", 70);
  num("cx-exam-005", "integrals", 3, "\\int_0^{\\pi/4}\\tan x\\,dx", "log(2)/2", ["trig", "log", "definite-integral", ...EXAM], "−ln|cos x|：−ln(1/√2) = (1/2)ln 2。", 60);
  num("cx-exam-006", "integrals", 4, "\\int_0^1 x^2e^x\\,dx", "exp(1)-2", ["integration-by-parts", ...EXAM], "IBP 兩次：(x²−2x+2)eˣ，代限 e−2。", 90);
  num("cx-exam-008", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n\\,2^n}", "log(2)", ["power-series", "special-sum", ...EXAM], "−ln(1−x) 的級數在 x=1/2：ln 2。", 75);

  // ================= R5-R6 進階難題 =================
  num("cx-hi-001", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)^2}", "pi/4", ["improper-integral", "trig-substitution"], "x=tan θ：∫cos²θ dθ 從 0 到 π/2 = π/4。", 110);
  num("cx-hi-007", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{(x^2+4)(x^2+9)}", "pi/60", ["improper-integral", "partial-fraction"], "拆成 (1/5)[1/(x²+4)−1/(x²+9)]：(1/5)(π/4−π/6) = π/60。", 120);
  num("cx-hi-008", "integrals", 6, "\\int_0^{\\infty}\\frac{e^{-x}-e^{-2x}}{x}\\,dx", "log(2)", ["improper-integral", "frullani"], "Frullani：ln(2/1) = ln 2。", 110);
  num("cx-hs-003", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n}{(n+1)!}", "1", ["telescoping", "special-sum"], "n/(n+1)! = 1/n! − 1/(n+1)! 望遠鏡 = 1。", 90);
  num("cx-hs-006", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n},\\quad H_n=1+\\tfrac12+\\cdots+\\tfrac1n", "2*log(2)", ["harmonic-number", "generating-function", "special-sum"], "ΣHₙxⁿ = −ln(1−x)/(1−x)，代 1/2 得 2 ln 2。", 140);
  num("cx-hl-001", "limits", 5, "\\lim_{x\\to 0}\\left(\\frac{1}{\\sin^2 x}-\\frac{1}{x^2}\\right)", "1/3", ["taylor", "hard-limit"], "通分後用 sin²x ≈ x² − x⁴/3：分子/x⁴ → 1/3。", 120);
  num("cx-hl-002", "limits", 5, "\\lim_{x\\to\\infty}\\left(x-x^2\\ln\\left(1+\\frac{1}{x}\\right)\\right)", "1/2", ["taylor", "hard-limit", "log"], "ln(1+u)=u−u²/2+…，展開得 1/2 − 1/(3x) → 1/2。", 110);
  num("cx-hl-004", "limits", 5, "\\lim_{n\\to\\infty}\\frac{(n!)^{1/n}}{n}", "exp(-1)", ["hard-limit", "asymptotic-expansion"], "Stirling：(n!)^{1/n} ~ n/e，比值 → 1/e。", 120);
  num("cx-hl-005", "limits", 6, "\\lim_{n\\to\\infty}n\\sin(2\\pi e\\,n!)", "2*pi", ["hard-limit", "putnam", "taylor"], "e·n! = 整數 + 1/(n+1) + O(1/n²)，sin 剩 2π/(n+1) 項，乘 n → 2π。", 160);
  num("cx-hl-006", "limits", 5, "\\lim_{x\\to\\infty}\\frac{x\\left(x^{1/x}-1\\right)}{\\ln x}", "1", ["hard-limit", "power-exponential", "log"], "x^{1/x} = e^{ln x/x} ≈ 1 + ln x/x，比值 → 1。", 120);
  num("cx-hm-002", "integrals", 6, "\\int_0^{\\pi/2}\\frac{dx}{1+\\tan^{\\sqrt{2}}x}", "pi/4", ["kings-property", "putnam"], "x→π/2−x 相加得 π/2，任何指數都一樣：π/4。", 130);
  num("cx-hm-004", "derivatives", 6, "f(x)=x\\sin x,\\quad f^{(100)}(0)", "-100", ["higher-derivative", "taylor"], "x sin x 的 x^{100} 係數是 −1/99!，乘 100! 得 −100。", 140);

  // ---- 獨立驗算規格：文字敘述的相關變率題（自動辨識器讀不出結構）----
  const VERIFY = {
    "cx-app-003": { m: "relatedRate", f: "\\frac{4}{3}\\pi r^3", v: "r", at: 2, given: 8 },
    // 「下滑速率」是正的：對 −y 微分
    "cx-app-004": { m: "differential", f: "-\\sqrt{25-x^2}", a: 3, dx: 1 },

    // ---- 2026-10 高曝光題補驗算：題幹是「…的弧長／平均值／連續求 k」這種句型 ----
    // 弧長：把曲線寫成參數式走 lineIntegral(ds, f=1)，切向量由數值微分取 ——
    // 不用 1+y′² 化成完全平方那一步。
    "cx-arc-002": { m: "lineIntegral", kind: "ds", f: "1", path: { x: "t", y: "\\frac{t^3}{6}+\\frac{1}{2t}", from: 1, to: 2 } },
    "cx-arc-003": { m: "lineIntegral", kind: "ds", f: "1", path: { x: "3\\cos t", y: "3\\sin t", from: 0, to: "\\frac{\\pi}{2}" } },
    "cx-arc-004": { m: "lineIntegral", kind: "ds", f: "1", path: { x: "t", y: "\\ln(\\cos t)", from: 0, to: "\\frac{\\pi}{3}" } },
    "cx-arc-005": { m: "lineIntegral", kind: "ds", f: "1", path: { x: "t", y: "\\cosh t", from: 0, to: 1 } },
    // 旋轉曲面面積：把旋轉面參數化成 (u, f(u)cos v, f(u)sin v)，|r_u×r_v| 數值取
    "cx-sa-001": { m: "surfaceScalar", surface: { x: "u", y: "3u\\cos v", z: "3u\\sin v", u: [0, 4], v: [0, "2\\pi"] } },
    // 半圓用角度參數化（端點 y→0 時 y′ 發散，用 x 當參數會吃掉精度）
    "cx-sa-002": { m: "surfaceScalar", surface: { x: "2\\cos u", y: "2\\sin u\\cos v", z: "2\\sin u\\sin v", u: [0, "\\pi"], v: [0, "2\\pi"] } },
    "cx-sa-003": { m: "surfaceScalar", surface: { x: "u", y: "\\frac{u^3}{3}\\cos v", z: "\\frac{u^3}{3}\\sin v", u: [0, 1], v: [0, "2\\pi"] } },
    // 繞 y 軸：解答用圓盤（對 y 積），這裡改用殼層（對 x 積），高 1 − x²
    "cx-rev-004": { m: "integral", f: "2\\pi x(1-x^2)", a: 0, b: 1 },
    // 平均值的定義
    "cx-avg-001": { m: "value", f: "\\frac{1}{3-0}\\int_0^3 x^2\\,dx" },
    "cx-avg-003": { m: "value", f: "\\frac{1}{e-1}\\int_1^e \\frac{1}{x}\\,dx" },
    // 連續：k 就是 x→3 的極限
    "cx-cont-001": { m: "limit", f: "\\frac{x^2-9}{x-3}", at: 3 },
    // 分段連續：左段在接點的值 = 右段在接點的值，未知數放 x 讓牛頓法解
    "cx-cont-002": { m: "root", f: "x\\cdot 2+1-2^2", x0: 0 },
    "cx-cont-005": { m: "root", f: "1^2+x-(3\\cdot 1-1)", x0: 0 },
    // 根的個數：在 (0,1) 上切 20000 格數變號次數
    "cx-cont-004": { m: "value", f: "\\sum_{k=0}^{19999}\\frac{1-\\operatorname{sgn}\\left(\\left(\\left(\\frac{k}{20000}\\right)^3+\\frac{k}{20000}-1\\right)\\left(\\left(\\frac{k+1}{20000}\\right)^3+\\frac{k+1}{20000}-1\\right)\\right)}{2}" },
    // ∫f′：f′ 用中央差分（步長 10⁻³）取、不手算，再數值積分 —— 不套 f(5) − f(0)
    "cx-ftc-006": { m: "integral", f: "\\frac{(x+0.001)^2+3(x+0.001)-\\left((x-0.001)^2+3(x-0.001)\\right)}{0.002}", a: 0, b: 5 },
    // e·n! 的小數部分 = Σ_{k>n} n!/k!（前面的項都是整數，sin(2π·整數) 消掉），
    // 直接用 e·n! 浮點會失去全部精度。
    "cx-hl-005": { m: "seqLimit", f: "n\\sin\\left(2\\pi\\sum_{k=n+1}^{n+40}\\prod_{j=n+1}^{k}\\frac{1}{j}\\right)" },
    // Rolle：在 (0, π) 掃 f′(c) = 平均斜率
    "cx-mvt-006": { m: "mvtPoint", f: "\\sin x", a: 0, b: "\\pi" }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（4A–4C）：反導函數的初值與「一族」、先化簡再積、aˣ、有號面積的正負、
  // 積分性質（相接／對調／線性／對稱／上下界）、Riemann 和（負值、函數值表、Σ 記號、辨識與寫出）、
  // FTC II 的連續性檢查與淨變化、反連鎖律與換元「行不行得通」、定積分換元的找錯題、先變形再換元。
  // 給「已知幾段積分」或「函數值表」的題，verify 用一個滿足所有已知條件的多項式 witness：
  // 先逐條檢查 witness 真的符合題目給的數，再拿它算被問的那個量（答案只由已知條件決定，跟 witness 選哪個無關）。
  const SOURCE = "Buzz course gap fill";
  const STORY = "story-problem";

  // f 在 x0 的值：左端點和、一段、寬 1（不做字串代換）
  const at = (f, x0) => ({ m: "riemannRule", f, a: x0, b: x0 + 1, n: 1, rule: "left" });
  const slopeAt = (f, x0) => ({ m: "deriv", f, at: [x0] });
  const integ = (f, a, b) => ({ m: "integral", f, a, b });
  // 函數值表的每一格都要被 witness 對上
  const tableConds = (w, pts) => pts.map(([x, y]) => ({ v: at(w, x), eq: y }));
  // 「F′ = g」在兩個點上成立／不成立
  const antiOk = (F, g) => [0.7, 1.9].map((x0) => ({ v: slopeAt(F, x0), eq: at(g, x0) }));
  const antiBad = (F, g, x0) => ({ v: slopeAt(F, x0), ne: at(g, x0) });

  const problems = [
    /* ── 4.1 反導函數 ── */
    { id: "cg-4a-001", topic: "integrals", rank: 1, answerKind: "expression", variable: "x",
      prompt: "F'(x)=6x^2-4x\\text{，而且 }F(1)=5\\text{。求 }F(x)",
      answer: "2*x^3-2*x^2+5", timeLimit: 60,
      tags: ["antiderivative-initial-condition", "antiderivative", "power-rule"],
      hints: ["先找出一個反導函數，再加上一個常數 C。", "把 x = 1 代進去，用 F(1) = 5 解出 C。"],
      solution: "F(x) = 2x³ − 2x² + C。F(1) = 2 − 2 + C = 5，所以 C = 5，F(x) = 2x³ − 2x² + 5。",
      solutionSteps: ["逐項反微分：F(x) = 2x³ − 2x² + C。", "F(1) = 0 + C = 5 ⟹ C = 5。", "F(x) = 2x³ − 2x² + 5。"],
      // F(x) = F(1) + ∫₁ˣ F′
      verify: { m: "fn", cases: [1.5, 2, 3].map((x0) => ({ at: { x: x0 }, v: { m: "let", with: { I: integ("6x^2-4x", 1, x0) }, f: "5+I" } })) } },
    { id: "cg-4a-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "F'(x)=3\\sqrt{x}\\text{，而且 }F(4)=10\\text{。求 }F(9)",
      answer: "48", timeLimit: 75,
      tags: ["antiderivative-initial-condition", "antiderivative", "power-rule"],
      hints: ["3√x = 3x^{1/2}，冪次加一再除以新的冪次。", "用 F(4) = 10 定出常數，再代 x = 9。"],
      solution: "F(x) = 2x^{3/2} + C。F(4) = 16 + C = 10，C = −6。F(9) = 2·27 − 6 = 48。",
      solutionSteps: ["F(x) = 3·(2/3)x^{3/2} + C = 2x^{3/2} + C。", "F(4) = 2·8 + C = 10 ⟹ C = −6。", "F(9) = 2·27 − 6 = 48。"],
      verify: { m: "let", with: { I: integ("3\\sqrt{x}", 4, 9) }, f: "10+I" } },
    { id: "cg-4a-003", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{已知 }-\\frac{1}{2}\\cos 2x\\text{ 是 }f(x)=\\sin 2x\\text{ 的一個反導函數。下列哪一個也是 }f\\text{ 的反導函數？}",
      answer: "sin²x", answers: ["sin²x"], canonical: "sin²x",
      distractors: ["cos²x", "−cos 2x", "½ sin²x"], timeLimit: 75,
      tags: ["antiderivative-family", "antiderivative", "trig"],
      hints: ["一個函數是不是 f 的反導函數，微分看看就知道。", "同一個 f 的兩個反導函數，彼此只能差一個常數。"],
      solution: "(sin²x)′ = 2 sin x cos x = sin 2x，對。其實 sin²x = ½ − ½cos 2x，跟已知的只差常數 ½。(cos²x)′ = −sin 2x，(−cos 2x)′ = 2 sin 2x，(½ sin²x)′ = ½ sin 2x，都不對。",
      solutionSteps: ["逐一微分檢查：(sin²x)′ = 2 sin x cos x = sin 2x。", "(cos²x)′ = −sin 2x；(−cos 2x)′ = 2 sin 2x；(½ sin²x)′ = ½ sin 2x。", "只有 sin²x 對；它等於 −½cos 2x + ½，只差常數。"],
      verify: { m: "choice", options: [
        { say: "sin²x", all: antiOk("\\sin^2 x", "\\sin 2x") },
        { say: "cos²x", all: antiOk("\\cos^2 x", "\\sin 2x") },
        { say: "−cos 2x", all: antiOk("-\\cos 2x", "\\sin 2x") },
        { say: "½ sin²x", all: antiOk("\\frac{1}{2}\\sin^2 x", "\\sin 2x") }
      ] } },
    { id: "cg-4a-004", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "F\\text{ 與 }G\\text{ 都是同一個函數 }f\\text{ 的反導函數。已知 }F(0)=2,\\ G(0)=-3,\\ F(5)=11\\text{，求 }G(5)",
      answer: "6", timeLimit: 60,
      tags: ["antiderivative-family", "antiderivative"],
      hints: ["同一個 f 的兩個反導函數，G − F 是什麼樣的函數？", "從 x = 0 的資料算出 G − F，它在 x = 5 也一樣。"],
      solution: "G − F 是常數，等於 G(0) − F(0) = −5。所以 G(5) = F(5) − 5 = 6。",
      solutionSteps: ["(G − F)′ = f − f = 0，所以 G − F 是常數。", "G − F = G(0) − F(0) = −3 − 2 = −5。", "G(5) = 11 − 5 = 6。"],
      // witness：f = (18/25)x，F = (9/25)x² + 2 符合 F(0)、F(5)；G(5) = G(0) + ∫₀⁵ f
      verify: { m: "choice", options: [
        { say: "6", all: [
          { v: { m: "let", with: { I: integ("\\frac{18}{25}x", 0, 5) }, f: "2+I" }, eq: 11 },
          { v: { m: "let", with: { I: integ("\\frac{18}{25}x", 0, 5) }, f: "-3+I" }, eq: 6 }] }
      ] } },

    /* ── 4.2 不定積分 ── */
    { id: "cg-4a-005", topic: "integrals", rank: 1, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{2x^3-5x+4}{x}\\,dx",
      answer: "2*x^3/3-5*x+4*log(abs(x))", timeLimit: 60,
      tags: ["indefinite-simplify-first", "basic-integral", "power-rule"],
      hints: ["分子每一項各自除以 x，變成幾項的和。", "1/x 的反導函數要加絕對值。"],
      solution: "拆成 2x² − 5 + 4/x，逐項積：(2/3)x³ − 5x + 4 ln|x| + C。",
      solutionSteps: ["(2x³ − 5x + 4)/x = 2x² − 5 + 4/x。", "逐項積：(2/3)x³ − 5x + 4 ln|x| + C。"] },
    { id: "cg-4a-006", topic: "integrals", rank: 2, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\sqrt{x}\\,(x-3)\\,dx",
      answer: "2*x^(5/2)/5-2*x^(3/2)", timeLimit: 75,
      tags: ["indefinite-simplify-first", "basic-integral", "power-rule"],
      hints: ["先乘開：√x 寫成 x^{1/2}，乘進括號。", "冪次是分數也一樣：加一，再除以新的冪次。"],
      solution: "√x(x − 3) = x^{3/2} − 3x^{1/2}。積分：(2/5)x^{5/2} − 2x^{3/2} + C。",
      solutionSteps: ["乘開：x^{1/2}·x − 3x^{1/2} = x^{3/2} − 3x^{1/2}。", "∫x^{3/2} dx = (2/5)x^{5/2}，∫3x^{1/2} dx = 2x^{3/2}。", "答案：(2/5)x^{5/2} − 2x^{3/2} + C。"] },
    { id: "cg-4a-007", topic: "integrals", rank: 1, answerKind: "antiderivative", variable: "x",
      prompt: "\\int (x+4)(x-1)\\,dx",
      answer: "x^3/3+3*x^2/2-4*x", timeLimit: 60,
      tags: ["indefinite-simplify-first", "basic-integral", "power-rule"],
      hints: ["乘積不能一個一個積，先乘開成多項式。", "多項式就逐項用冪次規則。"],
      solution: "(x + 4)(x − 1) = x² + 3x − 4，積分得 x³/3 + (3/2)x² − 4x + C。",
      solutionSteps: ["乘開：x² + 3x − 4。", "逐項積：x³/3 + (3/2)x² − 4x + C。"] },
    { id: "cg-4a-008", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{取 }f(x)=x,\\ g(x)=x^2\\text{。計算 }\\int_0^1 f(x)g(x)\\,dx-\\left(\\int_0^1 f(x)\\,dx\\right)\\left(\\int_0^1 g(x)\\,dx\\right)",
      answer: "1/12", timeLimit: 60,
      tags: ["indefinite-no-product-split", "definite-integral", "power-rule"],
      hints: ["第一項要先把 f·g 乘出來再積。", "三個積分各自算好再組合；結果不是 0，就說明乘積不能拆開積。"],
      solution: "∫₀¹ x³ dx = 1/4，∫₀¹ x dx = 1/2，∫₀¹ x² dx = 1/3。差 = 1/4 − 1/6 = 1/12 ≠ 0：∫fg 不等於 (∫f)(∫g)。",
      solutionSteps: ["f·g = x³，∫₀¹ x³ dx = 1/4。", "(∫₀¹ x dx)(∫₀¹ x² dx) = (1/2)(1/3) = 1/6。", "1/4 − 1/6 = 1/12，不是 0。"],
      verify: { m: "let", with: { P: integ("x^3", 0, 1), Q: integ("x", 0, 1), S: integ("x^2", 0, 1) }, f: "P-Q\\cdot S" } },
    { id: "cg-4a-009", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\text{有人寫 }\\int x\\cdot x\\,dx=\\left(\\int x\\,dx\\right)\\left(\\int x\\,dx\\right)=\\frac{x^4}{4}+C\\text{。這樣對嗎？}",
      answer: "不對，正確是 x³/3 + C", answers: ["不對，正確是 x³/3 + C"], canonical: "不對，正確是 x³/3 + C",
      distractors: ["對，乘積可以分開積", "不對，正確是 x⁴/2 + C"], timeLimit: 60,
      tags: ["indefinite-no-product-split", "antiderivative", "power-rule"],
      hints: ["把他的答案微分，看看會不會回到 x·x。", "x·x 可以先合成一個冪次再積。"],
      solution: "(x⁴/4)′ = x³ ≠ x²，所以不對。x·x = x²，∫x² dx = x³/3 + C。積分對乘法沒有「分開積再相乘」的規則。",
      solutionSteps: ["檢查：(x⁴/4)′ = x³，不是 x·x = x²。", "正確做法：x·x = x²，∫x² dx = x³/3 + C。", "（(x⁴/2)′ = 2x³ 也不對。）"],
      verify: { m: "choice", options: [
        { say: "不對，正確是 x³/3 + C", all: [...antiOk("\\frac{x^3}{3}", "x^2"), antiBad("\\frac{x^4}{4}", "x^2", 1.3)] },
        { say: "對，乘積可以分開積", all: antiOk("\\frac{x^4}{4}", "x^2") },
        { say: "不對，正確是 x⁴/2 + C", all: antiOk("\\frac{x^4}{2}", "x^2") }
      ] } },

    /* ── 4.3 基本積分表 ── */
    { id: "cg-4a-010", topic: "integrals", rank: 1, answerKind: "antiderivative", variable: "x",
      prompt: "\\int 6\\cdot 5^{x}\\,dx",
      answer: "6*5^x/log(5)", timeLimit: 45,
      tags: ["table-exp-base", "basic-integral", "exponential"],
      hints: ["(aˣ)′ = aˣ ln a，倒過來看 ∫aˣ dx 要除以什麼？", "常數 6 可以先提出來。"],
      solution: "∫5ˣ dx = 5ˣ/ln 5 + C，所以 ∫6·5ˣ dx = 6·5ˣ/ln 5 + C。",
      solutionSteps: ["(5ˣ)′ = 5ˣ ln 5 ⟹ ∫5ˣ dx = 5ˣ/ln 5 + C。", "乘上 6：6·5ˣ/ln 5 + C。"] },
    { id: "cg-4a-011", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\int_{-1}^{1}2^{x}\\,dx",
      answer: "3/(2*log(2))", timeLimit: 60,
      tags: ["table-exp-base", "definite-integral", "exponential"],
      hints: ["2ˣ 的反導函數是 2ˣ/ln 2。", "代上下限：2¹ 與 2^{−1}。"],
      solution: "[2ˣ/ln 2]₋₁¹ = (2 − 1/2)/ln 2 = 3/(2 ln 2) ≈ 2.164。",
      solutionSteps: ["反導函數：2ˣ/ln 2。", "(2 − 1/2)/ln 2 = 3/(2 ln 2) ≈ 2.164。"] },
    { id: "cg-4a-012", topic: "integrals", rank: 2, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{\\left(1+\\sqrt{x}\\right)^2}{x}\\,dx",
      answer: "log(x)+4*sqrt(x)+x", timeLimit: 75,
      tags: ["table-algebra-first", "basic-integral", "power-rule"],
      hints: ["先把分子平方展開，再每一項除以 x。", "會出現 1/x、x^{−1/2} 和常數三種，各自查表。"],
      solution: "(1 + √x)²/x = (1 + 2√x + x)/x = 1/x + 2x^{−1/2} + 1。積分：ln x + 4√x + x + C（x > 0）。",
      solutionSteps: ["展開：(1 + 2√x + x)/x = 1/x + 2x^{−1/2} + 1。", "∫1/x dx = ln x（x > 0），∫2x^{−1/2} dx = 4√x，∫1 dx = x。", "答案：ln x + 4√x + x + C。"] },
    { id: "cg-4a-013", topic: "integrals", rank: 2, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{\\sin^2 x}{1+\\cos x}\\,dx",
      answer: "x-sin(x)", timeLimit: 75,
      tags: ["table-algebra-first", "basic-integral", "trig"],
      hints: ["sin²x 可以寫成 1 − cos²x，再因式分解。", "約分之後剩下的式子就在表上。"],
      solution: "sin²x = 1 − cos²x = (1 − cos x)(1 + cos x)，約掉 1 + cos x 剩 1 − cos x。積分：x − sin x + C。",
      solutionSteps: ["sin²x = (1 − cos x)(1 + cos x)。", "約分：被積函數 = 1 − cos x。", "∫(1 − cos x) dx = x − sin x + C。"] },

    /* ── 4.4 有號面積：只判斷正負 ── */
    { id: "cg-4a-014", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\text{不算出數值，判斷 }\\int_0^{3\\pi/2}\\sin x\\,dx\\text{ 是正、負還是零}",
      answer: "正", answers: ["正"], canonical: "正", distractors: ["負", "零"], timeLimit: 45,
      tags: ["signed-area-meaning", "definite-integral", "trig"],
      hints: ["畫出 sin x 在 [0, 3π/2] 的圖：哪一段在 x 軸上方、哪一段在下方？", "比較上方那塊和下方那塊誰比較大。"],
      solution: "[0, π] 是整個上方的拱（面積 2），[π, 3π/2] 只有下方拱的一半（面積 1）。上方比較大，有號面積是正的。",
      solutionSteps: ["0 到 π：sin x ≥ 0，一整個拱在上方。", "π 到 3π/2：sin x ≤ 0，只有半個拱在下方。", "上方 > 下方，所以積分為正。"],
      verify: { m: "choice", options: [
        { say: "正", all: [{ v: integ("\\sin x", 0, "3\\pi/2"), gt: 0 }] },
        { say: "負", all: [{ v: integ("\\sin x", 0, "3\\pi/2"), lt: 0 }] },
        { say: "零", all: [{ v: integ("\\sin x", 0, "3\\pi/2"), eq: 0 }] }
      ] } },
    { id: "cg-4a-015", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\text{不算出數值，判斷 }\\int_{-2}^{1}x^3\\,dx\\text{ 是正、負還是零}",
      answer: "負", answers: ["負"], canonical: "負", distractors: ["正", "零"], timeLimit: 45,
      tags: ["signed-area-meaning", "definite-integral", "odd-function"],
      hints: ["x³ 在 x < 0 是負的、x > 0 是正的。", "x 軸下方那段從 −2 到 0，上方那段只從 0 到 1：哪塊比較大？"],
      solution: "x³ 是奇函數：[−1, 0] 與 [0, 1] 正負抵消，剩下 [−2, −1] 那段全在 x 軸下方，所以積分是負的。",
      solutionSteps: ["[−1, 1] 上奇函數正負抵消。", "剩下 [−2, −1]：x³ < 0，整塊在下方。", "有號面積為負。"],
      verify: { m: "choice", options: [
        { say: "負", all: [{ v: integ("x^3", -2, 1), lt: 0 }] },
        { say: "正", all: [{ v: integ("x^3", -2, 1), gt: 0 }] },
        { say: "零", all: [{ v: integ("x^3", -2, 1), eq: 0 }] }
      ] } },

    /* ── 4.5 積分性質 ── */
    { id: "cg-4a-016", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{已知 }\\int_0^3 f(x)\\,dx=5,\\ \\int_3^7 f(x)\\,dx=-2\\text{，求 }\\int_0^7 f(x)\\,dx",
      answer: "3", timeLimit: 45,
      tags: ["integral-properties-additivity", "definite-integral"],
      hints: ["[0, 3] 和 [3, 7] 接起來是哪個區間？", "相接的區間，積分直接相加。"],
      solution: "∫₀⁷ f = ∫₀³ f + ∫₃⁷ f = 5 + (−2) = 3。",
      solutionSteps: ["區間相接：∫₀⁷ = ∫₀³ + ∫₃⁷。", "5 + (−2) = 3。"],
      verify: { m: "choice", options: [{ say: "3", all: [
        { v: integ("\\frac{109}{42}-\\frac{13}{21}x", 0, 3), eq: 5 },
        { v: integ("\\frac{109}{42}-\\frac{13}{21}x", 3, 7), eq: -2 },
        { v: integ("\\frac{109}{42}-\\frac{13}{21}x", 0, 7), eq: 3 }] }] } },
    { id: "cg-4a-017", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{已知 }\\int_1^6 f(x)\\,dx=10,\\ \\int_4^6 f(x)\\,dx=7\\text{，求 }\\int_4^1 f(x)\\,dx",
      answer: "-3", timeLimit: 60,
      tags: ["integral-properties-additivity", "definite-integral"],
      hints: ["先用相接求出 ∫₁⁴ f。", "上下限對調，積分要變號。"],
      solution: "∫₁⁴ f = ∫₁⁶ f − ∫₄⁶ f = 10 − 7 = 3，對調上下限：∫₄¹ f = −3。",
      solutionSteps: ["∫₁⁶ = ∫₁⁴ + ∫₄⁶ ⟹ ∫₁⁴ f = 10 − 7 = 3。", "∫₄¹ f = −∫₁⁴ f = −3。"],
      verify: { m: "choice", options: [{ say: "-3", all: [
        { v: integ("-\\frac{3}{2}+x", 1, 6), eq: 10 },
        { v: integ("-\\frac{3}{2}+x", 4, 6), eq: 7 },
        { v: integ("-\\frac{3}{2}+x", 4, 1), eq: -3 }] }] } },
    { id: "cg-4a-018", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{已知 }\\int_{-2}^{5} f(x)\\,dx=8,\\ \\int_{-2}^{0} f(x)\\,dx=3,\\ \\int_{2}^{5} f(x)\\,dx=1\\text{，求 }\\int_0^2 f(x)\\,dx",
      answer: "4", timeLimit: 60,
      tags: ["integral-properties-additivity", "definite-integral"],
      hints: ["[−2, 5] 可以切成哪三段？", "整段減掉已知的兩段。"],
      solution: "∫₋₂⁵ = ∫₋₂⁰ + ∫₀² + ∫₂⁵，所以 ∫₀² f = 8 − 3 − 1 = 4。",
      solutionSteps: ["[−2, 5] = [−2, 0] ∪ [0, 2] ∪ [2, 5]。", "8 = 3 + ∫₀² f + 1 ⟹ ∫₀² f = 4。"],
      verify: { m: "choice", options: [{ say: "4", all: [
        { v: integ("\\frac{169}{84}+\\frac{1}{4}x-\\frac{11}{56}x^{2}", -2, 5), eq: 8 },
        { v: integ("\\frac{169}{84}+\\frac{1}{4}x-\\frac{11}{56}x^{2}", -2, 0), eq: 3 },
        { v: integ("\\frac{169}{84}+\\frac{1}{4}x-\\frac{11}{56}x^{2}", 2, 5), eq: 1 },
        { v: integ("\\frac{169}{84}+\\frac{1}{4}x-\\frac{11}{56}x^{2}", 0, 2), eq: 4 }] }] } },
    { id: "cg-4a-019", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{已知 }\\int_0^4 f(x)\\,dx=6,\\ \\int_0^4 g(x)\\,dx=-2\\text{，求 }\\int_0^4\\left(3f(x)-5g(x)\\right)dx",
      answer: "28", timeLimit: 45,
      tags: ["integral-properties-linearity", "definite-integral"],
      hints: ["積分可以拆成兩項，常數倍可以提出來。", "注意 −5 乘上一個負數。"],
      solution: "∫₀⁴ (3f − 5g) = 3·6 − 5·(−2) = 18 + 10 = 28。",
      solutionSteps: ["線性：∫(3f − 5g) = 3∫f − 5∫g。", "3·6 − 5·(−2) = 28。"],
      verify: { m: "choice", options: [{ say: "28", all: [
        { v: integ("\\frac{5}{6}+\\frac{1}{3}x", 0, 4), eq: 6 },
        { v: integ("\\frac{3}{2}-x", 0, 4), eq: -2 },
        { v: integ("3\\left(\\frac{5}{6}+\\frac{1}{3}x\\right)-5\\left(\\frac{3}{2}-x\\right)", 0, 4), eq: 28 }] }] } },
    { id: "cg-4a-020", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{已知 }\\int_1^3 f(x)\\,dx=4,\\ \\int_1^3 g(x)\\,dx=9\\text{，求 }\\int_1^3\\left(2f(x)-g(x)+5\\right)dx",
      answer: "9", timeLimit: 60,
      tags: ["integral-properties-linearity", "definite-integral"],
      hints: ["拆成三項：2∫f、∫g、∫5。", "常數 5 在長度為 2 的區間上積分是多少？"],
      solution: "2·4 − 9 + 5·(3 − 1) = 8 − 9 + 10 = 9。",
      solutionSteps: ["∫(2f − g + 5) = 2∫f − ∫g + ∫5 dx。", "∫₁³ 5 dx = 5·2 = 10。", "8 − 9 + 10 = 9。"],
      verify: { m: "choice", options: [{ say: "9", all: [
        { v: integ("-2+2x", 1, 3), eq: 4 },
        { v: integ("\\frac{13}{2}-x", 1, 3), eq: 9 },
        { v: integ("2(-2+2x)-\\left(\\frac{13}{2}-x\\right)+5", 1, 3), eq: 9 }] }] } },
    { id: "cg-4a-021", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\int_{-1}^{1}\\sin\\left(x^3\\right)dx",
      answer: "0", timeLimit: 45,
      tags: ["integral-properties-symmetry", "symmetry", "odd-function"],
      hints: ["sin(x³) 找不到初等的反導函數，換個角度：它是奇函數還是偶函數？", "區間對稱於 0。"],
      solution: "sin((−x)³) = −sin(x³)，是奇函數；在對稱區間 [−1, 1] 上積分為 0。",
      solutionSteps: ["檢查：sin((−x)³) = sin(−x³) = −sin(x³)，奇函數。", "奇函數在 [−a, a] 上積分 = 0。"],
      verify: { m: "integral", f: "\\sin\\left(x^3\\right)", a: -1, b: 1 } },
    { id: "cg-4a-022", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\int_{-3}^{3}\\left(x^5\\cos x+\\left|x\\right|\\right)dx",
      answer: "9", timeLimit: 75,
      tags: ["integral-properties-symmetry", "symmetry", "even-function"],
      hints: ["拆成兩項，各自判斷奇偶。", "偶函數在 [−a, a] 上的積分是 [0, a] 上的兩倍。"],
      solution: "x⁵cos x 是奇函數，積分 0。|x| 是偶函數：2∫₀³ x dx = 9。合計 9。",
      solutionSteps: ["x⁵cos x：(−x)⁵cos(−x) = −x⁵cos x，奇，積分 0。", "|x| 偶：2∫₀³ x dx = 2·9/2 = 9。", "答案 9。"],
      verify: { m: "integral", f: "x^5\\cos x+\\left|x\\right|", a: -3, b: 3 } },
    { id: "cg-4a-023", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{用 }m(b-a)\\le\\int_a^b f(x)\\,dx\\le M(b-a)\\text{（}m,M\\text{ 是 }{f}\\text{ 在 }[a,b]\\text{ 上的最小、最大值）估計 }\\int_0^2\\sqrt{1+x^3}\\,dx\\text{，求得到的上界 }{M}(b-a)",
      answer: "6", timeLimit: 60,
      tags: ["integral-properties-bounds", "integral-estimate", "definite-integral"],
      hints: ["√(1 + x³) 在 [0, 2] 上是遞增還是遞減？最大值在哪一端？", "最大值乘上區間長度。"],
      solution: "√(1 + x³) 在 [0, 2] 遞增，M = √9 = 3，上界 = 3·2 = 6（下界 m(b − a) = 1·2 = 2）。",
      solutionSteps: ["1 + x³ 在 [0, 2] 遞增，所以 √(1 + x³) 也遞增。", "M = f(2) = √9 = 3。", "上界 M(b − a) = 3·2 = 6。"],
      verify: { m: "let", with: { M: { m: "extremeOf", kind: "sup", integer: false, f: "\\sqrt{1+x^3}", range: [0, 2] } }, f: "2M" } },
    { id: "cg-4a-024", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{用 }m(b-a)\\le\\int_a^b f(x)\\,dx\\le M(b-a)\\text{（}m,M\\text{ 是 }{f}\\text{ 在 }[a,b]\\text{ 上的最小、最大值）估計 }\\int_1^3\\frac{dx}{1+x^2}\\text{，求得到的下界 }m(b-a)",
      answer: "1/5", timeLimit: 60,
      tags: ["integral-properties-bounds", "integral-estimate", "definite-integral"],
      hints: ["1/(1 + x²) 在 [1, 3] 上是遞增還是遞減？最小值在哪一端？", "最小值乘上區間長度。"],
      solution: "1/(1 + x²) 在 [1, 3] 遞減，m = f(3) = 1/10，下界 = (1/10)·2 = 1/5（上界 = (1/2)·2 = 1）。",
      solutionSteps: ["x > 0 時 1 + x² 遞增，所以 1/(1 + x²) 遞減。", "m = f(3) = 1/10。", "下界 m(b − a) = (1/10)·2 = 1/5。"],
      verify: { m: "let", with: { L: { m: "extremeOf", kind: "inf", integer: false, f: "\\frac{1}{1+x^2}", range: [1, 3] } }, f: "2L" } },

    /* ── 4.6 Riemann 和直觀 ── */
    { id: "cg-4b-001", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "f(x)=x^2-4\\text{ 在 }[0,3]\\text{ 上分成 }3\\text{ 等分，求右端點和 }R_3",
      answer: "2", timeLimit: 60,
      tags: ["riemann-signed", "riemann-sum"],
      hints: ["Δx = 1，右端點是 x = 1, 2, 3。", "f 是負的那幾個點，長條要算成負的。"],
      solution: "R₃ = [f(1) + f(2) + f(3)]·1 = (−3) + 0 + 5 = 2。",
      solutionSteps: ["Δx = (3 − 0)/3 = 1，右端點 1, 2, 3。", "f(1) = −3，f(2) = 0，f(3) = 5。", "R₃ = (−3 + 0 + 5)·1 = 2。"],
      verify: { m: "riemannRule", f: "x^2-4", a: 0, b: 3, n: 3, rule: "right" } },
    { id: "cg-4b-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=x^3-3x\\text{ 在 }[-2,2]\\text{ 上分成 }4\\text{ 等分，求左端點和 }L_4",
      answer: "-2", timeLimit: 75,
      tags: ["riemann-signed", "riemann-sum"],
      hints: ["Δx = 1，左端點是 −2, −1, 0, 1（不含 2）。", "每個 f 值保留正負號再相加。"],
      solution: "f(−2) = −2，f(−1) = 2，f(0) = 0，f(1) = −2。L₄ = (−2 + 2 + 0 − 2)·1 = −2。",
      solutionSteps: ["Δx = 1，左端點 −2, −1, 0, 1。", "f(−2) = −8 + 6 = −2，f(−1) = −1 + 3 = 2，f(0) = 0，f(1) = 1 − 3 = −2。", "L₄ = −2。"],
      verify: { m: "riemannRule", f: "x^3-3x", a: -2, b: 2, n: 4, rule: "left" } },
    { id: "cg-4b-003", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{一輛車每 2 秒記一次速度：}t=0,2,4,6,8\\text{ 秒時，}v=3,7,10,12,13\\text{（公尺/秒）。用左端點和（4 段）估計 }0\\le t\\le 8\\text{ 秒內走的距離（公尺）}",
      answer: "64", timeLimit: 60,
      tags: ["riemann-partition", "riemann-sum", STORY],
      hints: ["每段寬 Δt = 2 秒；左端點用每段開頭的速度。", "最後一個時刻 t = 8 的速度用不到。"],
      solution: "L₄ = 2·(3 + 7 + 10 + 12) = 2·32 = 64 公尺。",
      solutionSteps: ["Δt = 2，左端點 t = 0, 2, 4, 6。", "L₄ = 2·(3 + 7 + 10 + 12) = 64（公尺）。"],
      // witness v(t) = 3 + 9t/4 − t²/8 通過表上五點
      verify: { m: "choice", options: [{ say: "64", all: [
        ...tableConds("3+\\frac{9}{4}x-\\frac{1}{8}x^{2}", [[0, 3], [2, 7], [4, 10], [6, 12], [8, 13]]),
        { v: { m: "riemannRule", f: "3+\\frac{9}{4}x-\\frac{1}{8}x^{2}", a: 0, b: 8, n: 4, rule: "left" }, eq: 64 }] }] } },
    { id: "cg-4b-004", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{已知 }f(0)=4,\\ f(1)=5,\\ f(2)=7,\\ f(3)=6,\\ f(4)=3,\\ f(5)=-1,\\ f(6)=-2\\text{。用中點和（3 段，每段寬 2）估計 }\\int_0^6 f(x)\\,dx",
      answer: "20", timeLimit: 75,
      tags: ["riemann-partition", "riemann-sum", "riemann-midpoint"],
      hints: ["三段是 [0,2]、[2,4]、[4,6]，中點各是多少？", "負的函數值照樣代進去。"],
      solution: "中點 1, 3, 5：M₃ = 2·(f(1) + f(3) + f(5)) = 2·(5 + 6 − 1) = 20。",
      solutionSteps: ["三段 [0,2]、[2,4]、[4,6]，中點 1、3、5。", "M₃ = 2·(5 + 6 + (−1)) = 2·10 = 20。"],
      verify: { m: "choice", options: [{ say: "20", all: [
        ...tableConds("4-\\frac{53}{12}x+\\frac{3571}{360}x^{2}-\\frac{47}{8}x^{3}+\\frac{113}{72}x^{4}-\\frac{5}{24}x^{5}+\\frac{1}{90}x^{6}",
          [[0, 4], [1, 5], [2, 7], [3, 6], [4, 3], [5, -1], [6, -2]]),
        { v: { m: "riemannRule", f: "4-\\frac{53}{12}x+\\frac{3571}{360}x^{2}-\\frac{47}{8}x^{3}+\\frac{113}{72}x^{4}-\\frac{5}{24}x^{5}+\\frac{1}{90}x^{6}", a: 0, b: 6, n: 3, rule: "mid" }, eq: 20 }] }] } },
    { id: "cg-4b-005", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "f(x)=e^{-x}\\text{ 在 }[0,2]\\text{ 上分成 }4\\text{ 等分。左端點和 }L_4\\text{ 跟 }\\int_0^2 e^{-x}\\,dx\\text{ 比，是高估還是低估？}",
      answer: "高估", answers: ["高估"], canonical: "高估", distractors: ["低估", "剛好相等"], timeLimit: 45,
      tags: ["riemann-over-under", "riemann-sum", "exponential"],
      hints: ["e^{−x} 是遞增還是遞減？", "遞減時，每段左端點的高度是那一段裡最高還是最低的？"],
      solution: "e^{−x} 遞減，每一段的左端點是該段最高點，長條都比曲線高，所以 L₄ 高估。",
      solutionSteps: ["e^{−x} 在 [0, 2] 遞減。", "左端點 = 每段的最大值，長條蓋過曲線。", "L₄ 高估。"],
      verify: { m: "choice", options: [
        { say: "高估", all: [{ v: { m: "ruleBias", f: "e^{-x}", a: 0, b: 2, n: 4, rule: "left" }, claim: true }] },
        { say: "低估", all: [{ v: { m: "ruleBias", f: "e^{-x}", a: 0, b: 2, n: 4, rule: "left" }, claim: false }] },
        { say: "剛好相等", all: [{ v: { m: "riemannRule", f: "e^{-x}", a: 0, b: 2, n: 4, rule: "left" }, eq: integ("e^{-x}", 0, 2) }] }
      ] } },

    /* ── 4.7 用和式寫定積分 ── */
    { id: "cg-4b-006", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\left(1+\\frac{2i}{n}\\right)^3\\frac{2}{n}\\text{ 是哪一個定積分？}",
      answer: "∫₁³ x³ dx", answers: ["∫₁³ x³ dx"], canonical: "∫₁³ x³ dx",
      distractors: ["∫₀² x³ dx", "∫₀¹ x³ dx", "∫₀¹ (1 + 2x)³ dx"], timeLimit: 60,
      tags: ["riemann-notation-identify", "riemann-sum"],
      hints: ["Δx 是哪一個因子？它告訴你區間長度。", "xᵢ = 1 + 2i/n：i = 0 和 i = n 時 xᵢ 各是多少？"],
      solution: "Δx = 2/n，xᵢ = 1 + i·Δx 從 1 走到 3，f(x) = x³。所以是 ∫₁³ x³ dx。",
      solutionSteps: ["Δx = 2/n ⟹ 區間長度 2。", "xᵢ = 1 + 2i/n：起點 1，終點 3。", "f(xᵢ) = xᵢ³ ⟹ ∫₁³ x³ dx。"],
      verify: { m: "choice", options: [
        { say: "∫₁³ x³ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\left(1+\\frac{2i}{n}\\right)^3\\frac{2}{n}" }, eq: integ("x^3", 1, 3), tol: 1e-4 }] },
        { say: "∫₀² x³ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\left(1+\\frac{2i}{n}\\right)^3\\frac{2}{n}" }, eq: integ("x^3", 0, 2), tol: 1e-4 }] },
        { say: "∫₀¹ x³ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\left(1+\\frac{2i}{n}\\right)^3\\frac{2}{n}" }, eq: integ("x^3", 0, 1), tol: 1e-4 }] },
        { say: "∫₀¹ (1 + 2x)³ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\left(1+\\frac{2i}{n}\\right)^3\\frac{2}{n}" }, eq: integ("(1+2x)^3", 0, 1), tol: 1e-4 }] }
      ] } },
    { id: "cg-4b-007", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\frac{3}{n}\\sin\\left(\\frac{3i}{n}\\right)\\text{ 是哪一個定積分？}",
      answer: "∫₀³ sin x dx", answers: ["∫₀³ sin x dx"], canonical: "∫₀³ sin x dx",
      distractors: ["∫₀¹ sin x dx", "∫₀³ sin 3x dx", "∫₀¹ sin 3x dx"], timeLimit: 75,
      tags: ["riemann-notation-identify", "riemann-sum", "trig"],
      hints: ["把 3/n 看成 Δx，把 3i/n 看成 xᵢ。", "xᵢ 從哪裡走到哪裡？"],
      solution: "Δx = 3/n，xᵢ = 3i/n 從 0 走到 3，f(x) = sin x：∫₀³ sin x dx。（∫₀¹ sin 3x dx 少了一個因子 3。）",
      solutionSteps: ["Δx = 3/n，xᵢ = 0 + i·Δx。", "xᵢ 從 0 到 3，f(xᵢ) = sin xᵢ。", "∫₀³ sin x dx。"],
      verify: { m: "choice", options: [
        { say: "∫₀³ sin x dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\frac{3}{n}\\sin\\left(\\frac{3i}{n}\\right)" }, eq: integ("\\sin x", 0, 3), tol: 1e-4 }] },
        { say: "∫₀¹ sin x dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\frac{3}{n}\\sin\\left(\\frac{3i}{n}\\right)" }, eq: integ("\\sin x", 0, 1), tol: 1e-4 }] },
        { say: "∫₀³ sin 3x dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\frac{3}{n}\\sin\\left(\\frac{3i}{n}\\right)" }, eq: integ("\\sin 3x", 0, 3), tol: 1e-4 }] },
        { say: "∫₀¹ sin 3x dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=1}^{n}\\frac{3}{n}\\sin\\left(\\frac{3i}{n}\\right)" }, eq: integ("\\sin 3x", 0, 1), tol: 1e-4 }] }
      ] } },
    { id: "cg-4b-008", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\lim_{n\\to\\infty}\\sum_{i=0}^{n-1}\\frac{2}{n}e^{-1+\\frac{2i}{n}}\\text{ 是哪一個定積分？}",
      answer: "∫₋₁¹ eˣ dx", answers: ["∫₋₁¹ eˣ dx"], canonical: "∫₋₁¹ eˣ dx",
      distractors: ["∫₀² eˣ dx", "∫₋₁¹ e²ˣ dx", "∫₀¹ eˣ dx"], timeLimit: 75,
      tags: ["riemann-notation-identify", "riemann-sum", "exponential"],
      hints: ["i 從 0 到 n − 1：這是左端點和，極限照樣是定積分。", "指數裡的 −1 + 2i/n 就是 xᵢ；它從哪裡開始？"],
      solution: "Δx = 2/n，xᵢ = −1 + i·Δx 從 −1 開始、長度 2，所以區間 [−1, 1]，f(x) = eˣ：∫₋₁¹ eˣ dx。",
      solutionSteps: ["Δx = 2/n，xᵢ = −1 + 2i/n（左端點）。", "區間 [−1, −1 + 2] = [−1, 1]。", "f(x) = eˣ ⟹ ∫₋₁¹ eˣ dx。"],
      verify: { m: "choice", options: [
        { say: "∫₋₁¹ eˣ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=0}^{n-1}\\frac{2}{n}e^{-1+\\frac{2i}{n}}" }, eq: integ("e^{x}", -1, 1), tol: 1e-4 }] },
        { say: "∫₀² eˣ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=0}^{n-1}\\frac{2}{n}e^{-1+\\frac{2i}{n}}" }, eq: integ("e^{x}", 0, 2), tol: 1e-4 }] },
        { say: "∫₋₁¹ e²ˣ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=0}^{n-1}\\frac{2}{n}e^{-1+\\frac{2i}{n}}" }, eq: integ("e^{2x}", -1, 1), tol: 1e-4 }] },
        { say: "∫₀¹ eˣ dx", all: [{ v: { m: "seqLimit", f: "\\sum_{i=0}^{n-1}\\frac{2}{n}e^{-1+\\frac{2i}{n}}" }, eq: integ("e^{x}", 0, 1), tol: 1e-4 }] }
      ] } },
    { id: "cg-4b-009", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\int_2^5 x^2\\,dx\\text{ 切成 }n\\text{ 等分，右端點和 }R_n\\text{ 是哪一個？}",
      answer: "Σᵢ₌₁ⁿ (2 + 3i/n)² · 3/n", answers: ["Σᵢ₌₁ⁿ (2 + 3i/n)² · 3/n"], canonical: "Σᵢ₌₁ⁿ (2 + 3i/n)² · 3/n",
      distractors: ["Σᵢ₌₁ⁿ (2 + i/n)² · 3/n", "Σᵢ₌₁ⁿ (3i/n)² · 3/n", "Σᵢ₌₀ⁿ⁻¹ (2 + 3i/n)² · 3/n"], timeLimit: 60,
      tags: ["riemann-notation-write", "riemann-sum"],
      hints: ["Δx = (b − a)/n，右端點 xᵢ = a + i·Δx。", "右端點和的 i 從 1 數到 n。"],
      solution: "Δx = 3/n，xᵢ = 2 + 3i/n（i = 1, …, n），R_n = Σ (2 + 3i/n)²·3/n。i 從 0 到 n − 1 的是左端點和 L_n。",
      solutionSteps: ["Δx = (5 − 2)/n = 3/n。", "右端點 xᵢ = 2 + 3i/n，i = 1, …, n。", "R_n = Σᵢ₌₁ⁿ (2 + 3i/n)²·(3/n)。"],
      // 取 n = 6 具體比：每個選項的和 vs 右端點公式
      verify: { m: "choice", options: [
        { say: "Σᵢ₌₁ⁿ (2 + 3i/n)² · 3/n", all: [{ v: { m: "value", f: "\\sum_{i=1}^{6}\\left(2+\\frac{3i}{6}\\right)^2\\frac{3}{6}" }, eq: { m: "riemannRule", f: "x^2", a: 2, b: 5, n: 6, rule: "right" } }] },
        { say: "Σᵢ₌₁ⁿ (2 + i/n)² · 3/n", all: [{ v: { m: "value", f: "\\sum_{i=1}^{6}\\left(2+\\frac{i}{6}\\right)^2\\frac{3}{6}" }, eq: { m: "riemannRule", f: "x^2", a: 2, b: 5, n: 6, rule: "right" } }] },
        { say: "Σᵢ₌₁ⁿ (3i/n)² · 3/n", all: [{ v: { m: "value", f: "\\sum_{i=1}^{6}\\left(\\frac{3i}{6}\\right)^2\\frac{3}{6}" }, eq: { m: "riemannRule", f: "x^2", a: 2, b: 5, n: 6, rule: "right" } }] },
        { say: "Σᵢ₌₀ⁿ⁻¹ (2 + 3i/n)² · 3/n", all: [{ v: { m: "value", f: "\\sum_{i=0}^{5}\\left(2+\\frac{3i}{6}\\right)^2\\frac{3}{6}" }, eq: { m: "riemannRule", f: "x^2", a: 2, b: 5, n: 6, rule: "right" } }] }
      ] } },
    { id: "cg-4b-010", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\int_1^3\\ln x\\,dx\\text{ 切成 }{n}\\text{ 等分，左端點和 }{L}_n\\text{ 是哪一個？}",
      answer: "Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 2/n", answers: ["Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 2/n"], canonical: "Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 2/n",
      distractors: ["Σᵢ₌₁ⁿ ln(1 + 2i/n) · 2/n", "Σᵢ₌₀ⁿ⁻¹ ln(1 + i/n) · 2/n", "Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 1/n"], timeLimit: 75,
      tags: ["riemann-notation-write", "riemann-sum", "log"],
      hints: ["Δx = (3 − 1)/n；左端點 xᵢ = 1 + i·Δx。", "左端點和的 i 從 0 數到 n − 1。"],
      solution: "Δx = 2/n，左端點 xᵢ = 1 + 2i/n（i = 0, …, n − 1），L_n = Σ ln(1 + 2i/n)·2/n。",
      solutionSteps: ["Δx = 2/n。", "左端點 xᵢ = 1 + 2i/n，i = 0, …, n − 1。", "L_n = Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n)·(2/n)。"],
      verify: { m: "choice", options: [
        { say: "Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 2/n", all: [{ v: { m: "value", f: "\\sum_{i=0}^{4}\\ln\\left(1+\\frac{2i}{5}\\right)\\frac{2}{5}" }, eq: { m: "riemannRule", f: "\\ln x", a: 1, b: 3, n: 5, rule: "left" } }] },
        { say: "Σᵢ₌₁ⁿ ln(1 + 2i/n) · 2/n", all: [{ v: { m: "value", f: "\\sum_{i=1}^{5}\\ln\\left(1+\\frac{2i}{5}\\right)\\frac{2}{5}" }, eq: { m: "riemannRule", f: "\\ln x", a: 1, b: 3, n: 5, rule: "left" } }] },
        { say: "Σᵢ₌₀ⁿ⁻¹ ln(1 + i/n) · 2/n", all: [{ v: { m: "value", f: "\\sum_{i=0}^{4}\\ln\\left(1+\\frac{i}{5}\\right)\\frac{2}{5}" }, eq: { m: "riemannRule", f: "\\ln x", a: 1, b: 3, n: 5, rule: "left" } }] },
        { say: "Σᵢ₌₀ⁿ⁻¹ ln(1 + 2i/n) · 1/n", all: [{ v: { m: "value", f: "\\sum_{i=0}^{4}\\ln\\left(1+\\frac{2i}{5}\\right)\\frac{1}{5}" }, eq: { m: "riemannRule", f: "\\ln x", a: 1, b: 3, n: 5, rule: "left" } }] }
      ] } },
    { id: "cg-4b-011", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\sum_{k=1}^{5}(2k-1)^2",
      answer: "165", timeLimit: 45,
      tags: ["riemann-sigma", "riemann-sum"],
      hints: ["把 k = 1 到 5 一個一個代進去寫出來。", "代進去的是 2k − 1，不是 k。"],
      solution: "1² + 3² + 5² + 7² + 9² = 1 + 9 + 25 + 49 + 81 = 165。",
      solutionSteps: ["k = 1, …, 5 時 2k − 1 = 1, 3, 5, 7, 9。", "1 + 9 + 25 + 49 + 81 = 165。"],
      verify: { m: "series", f: "(2n-1)^2", from: 1, to: 5 } },
    { id: "cg-4b-012", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\sum_{i=3}^{6}\\left(i^2-i\\right)",
      answer: "68", timeLimit: 45,
      tags: ["riemann-sigma", "riemann-sum"],
      hints: ["下標從 3 開始，不是從 1。", "總共有幾項？一項一項寫出來。"],
      solution: "i = 3, 4, 5, 6：6 + 12 + 20 + 30 = 68。",
      solutionSteps: ["i = 3 到 6，共 4 項。", "(9−3) + (16−4) + (25−5) + (36−6) = 6 + 12 + 20 + 30 = 68。"],
      verify: { m: "series", f: "n^2-n", from: 3, to: 6 } },

    /* ── 4.8 用 Riemann 和算 ── */
    { id: "cg-4b-013", topic: "integrals", rank: 2, answerKind: "expression", variable: "n",
      prompt: "f(x)=3x+1\\text{ 在 }[2,4]\\text{ 上切成 }n\\text{ 等分，求右端點和 }R_n\\text{（以 }n\\text{ 表示並化簡）}",
      answer: "20+6/n", timeLimit: 120,
      tags: ["riemann-closed-form", "riemann-sum"],
      hints: ["Δx = 2/n，xᵢ = 2 + 2i/n；先寫出 f(xᵢ)。", "拆成常數項與含 i 的項，用 Σi = n(n+1)/2。"],
      solution: "f(xᵢ) = 7 + 6i/n。R_n = Σ(7 + 6i/n)(2/n) = 14 + (12/n²)·n(n+1)/2 = 20 + 6/n；n → ∞ 得 20 = ∫₂⁴(3x+1)dx。",
      solutionSteps: ["Δx = 2/n，xᵢ = 2 + 2i/n，f(xᵢ) = 7 + 6i/n。", "R_n = (2/n)Σ7 + (12/n²)Σi = 14 + 6(n+1)/n。", "R_n = 20 + 6/n。"],
      verify: { m: "fn", vars: ["n"], cases: [1, 4, 10].map((n) => ({ at: { n }, v: { m: "riemannRule", f: "3x+1", a: 2, b: 4, n, rule: "right" } })) } },
    { id: "cg-4b-014", topic: "integrals", rank: 2, answerKind: "expression", variable: "n",
      prompt: "f(x)=5-2x\\text{ 在 }[1,3]\\text{ 上切成 }n\\text{ 等分，求右端點和 }R_n\\text{（以 }n\\text{ 表示並化簡）}",
      answer: "2-4/n", timeLimit: 120,
      tags: ["riemann-closed-form", "riemann-sum"],
      hints: ["Δx = 2/n，xᵢ = 1 + 2i/n；f(xᵢ) 化簡成「常數 − 某倍的 i/n」。", "Σi = n(n+1)/2，最後整理成常數加 1/n 的項。"],
      solution: "f(xᵢ) = 3 − 4i/n。R_n = (2/n)Σ(3 − 4i/n) = 6 − (8/n²)·n(n+1)/2 = 2 − 4/n；極限 2 = ∫₁³(5 − 2x)dx。",
      solutionSteps: ["Δx = 2/n，xᵢ = 1 + 2i/n，f(xᵢ) = 3 − 4i/n。", "R_n = 6 − (8/n²)·n(n+1)/2 = 6 − 4(n+1)/n。", "R_n = 2 − 4/n。"],
      verify: { m: "fn", vars: ["n"], cases: [1, 3, 8].map((n) => ({ at: { n }, v: { m: "riemannRule", f: "5-2x", a: 1, b: 3, n, rule: "right" } })) } },
    { id: "cg-4b-015", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\sum_{i=1}^{12}i^2",
      answer: "650", timeLimit: 45,
      tags: ["riemann-sum-formulas", "riemann-sum"],
      hints: ["Σi² = n(n+1)(2n+1)/6。", "n = 12 代進去。"],
      solution: "12·13·25/6 = 650。",
      solutionSteps: ["Σᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6。", "n = 12：12·13·25/6 = 650。"],
      verify: { m: "series", f: "n^2", from: 1, to: 12 } },
    { id: "cg-4b-016", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\sum_{i=1}^{10}\\left(i^3-2i\\right)",
      answer: "2915", timeLimit: 60,
      tags: ["riemann-sum-formulas", "riemann-sum"],
      hints: ["拆成 Σi³ − 2Σi。", "Σi³ = [n(n+1)/2]²，Σi = n(n+1)/2。"],
      solution: "Σi³ = 55² = 3025，2Σi = 110，3025 − 110 = 2915。",
      solutionSteps: ["Σᵢ₌₁¹⁰ i³ = (10·11/2)² = 3025。", "2Σᵢ₌₁¹⁰ i = 2·55 = 110。", "3025 − 110 = 2915。"],
      verify: { m: "series", f: "n^3-2n", from: 1, to: 10 } },

    /* ── 4.10 FTC II ── */
    { id: "cg-4b-017", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{能不能用 }F(b)-F(a)\\text{ 直接算 }\\int_{-2}^{1}\\frac{dx}{x^3}\\text{？}",
      answer: "不能：1/x³ 在 x = 0 不連續，這個積分發散", answers: ["不能：1/x³ 在 x = 0 不連續，這個積分發散"], canonical: "不能：1/x³ 在 x = 0 不連續，這個積分發散",
      distractors: ["可以，答案是 −3/8", "可以，答案是 3/8"], timeLimit: 75,
      tags: ["ftc2-continuity-check", "ftc", "improper-integral"],
      hints: ["FTC II 的前提：f 在整個 [a, b] 上連續。", "區間 [−2, 1] 裡有沒有讓分母為 0 的點？"],
      solution: "x = 0 在 [−2, 1] 裡，1/x³ 在那裡無界，不能套 F(b) − F(a)。當瑕積分看，∫₀¹ dx/x³ 就已經發散，所以整個積分發散；硬套會得到錯的 −3/8。",
      solutionSteps: ["0 ∈ [−2, 1]，1/x³ 在 x = 0 沒有定義，FTC II 前提不成立。", "拆成瑕積分：∫₀¹ dx/x³ = lim [−1/(2x²)] → ∞，發散。", "所以不能直接套，積分發散。"],
      verify: { m: "choice", options: [
        { say: "不能：1/x³ 在 x = 0 不連續，這個積分發散", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x^3}", a: 0, b: 1, sing: [0] }, claim: false }] },
        { say: "可以，答案是 −3/8", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x^3}", a: 0, b: 1, sing: [0] }, claim: true }] },
        { say: "可以，答案是 3/8", all: [{ v: { m: "improperConverges", f: "\\frac{1}{x^3}", a: 0, b: 1, sing: [0] }, claim: true }] }
      ] } },
    { id: "cg-4b-018", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{有人算 }\\int_0^{\\pi}\\sec^2 x\\,dx=\\tan\\pi-\\tan 0=0\\text{。這樣對嗎？}",
      answer: "不對：sec²x 在 x = π/2 沒有定義，這個積分發散", answers: ["不對：sec²x 在 x = π/2 沒有定義，這個積分發散"], canonical: "不對：sec²x 在 x = π/2 沒有定義，這個積分發散",
      distractors: ["對，答案是 0", "不對，答案是 π"], timeLimit: 75,
      tags: ["ftc2-continuity-check", "ftc", "improper-integral"],
      hints: ["sec²x > 0，正的函數積出 0 合理嗎？", "tan x 在 [0, π] 裡有沒有斷掉的地方？"],
      solution: "sec²x 恆正，積分不可能是 0。問題出在 x = π/2：cos x = 0，sec²x 無界，FTC II 不能套。∫₀^{π/2} sec²x dx = lim tan x → ∞，發散。",
      solutionSteps: ["sec²x > 0，答案 0 本身就不合理。", "x = π/2 ∈ [0, π]，cos x = 0，sec²x 不連續。", "∫₀^{π/2} sec²x dx = lim_{x→π/2⁻} tan x = ∞，發散。"],
      verify: { m: "choice", options: [
        { say: "不對：sec²x 在 x = π/2 沒有定義，這個積分發散", all: [{ v: { m: "improperConverges", f: "\\sec^2 x", a: 0, b: "\\pi/2", sing: ["\\pi/2"] }, claim: false }] },
        { say: "對，答案是 0", all: [{ v: { m: "improperConverges", f: "\\sec^2 x", a: 0, b: "\\pi/2", sing: ["\\pi/2"] }, claim: true }] },
        { say: "不對，答案是 π", all: [{ v: { m: "improperConverges", f: "\\sec^2 x", a: 0, b: "\\pi/2", sing: ["\\pi/2"] }, claim: true }] }
      ] } },
    { id: "cg-4b-019", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{水以 }r(t)=40-2t\\text{（公升/分鐘）的速率流進水槽，}0\\le t\\le 10\\text{。這 10 分鐘共流進多少公升？}",
      answer: "300", timeLimit: 60,
      tags: ["ftc2-net-change", "ftc", STORY],
      hints: ["總量 = 速率對時間的積分。", "∫₀¹⁰ (40 − 2t) dt，用 F(10) − F(0)。"],
      solution: "∫₀¹⁰ (40 − 2t) dt = [40t − t²]₀¹⁰ = 400 − 100 = 300 公升。",
      solutionSteps: ["總流入量 = ∫₀¹⁰ r(t) dt。", "[40t − t²]₀¹⁰ = 400 − 100 = 300（公升）。"],
      verify: { m: "integral", f: "40-2t", v: "t", a: 0, b: 10 } },
    { id: "cg-4b-020", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{質點沿直線運動，速度 }v(t)=t^2-4t+3\\text{（公尺/秒）。求 }0\\le t\\le 4\\text{ 秒的位移（公尺，有正負）}",
      answer: "4/3", timeLimit: 75,
      tags: ["ftc2-net-change", "ftc", STORY],
      hints: ["位移 = 速度的定積分（不取絕對值）。", "反導函數 t³/3 − 2t² + 3t，代 4 與 0。"],
      solution: "∫₀⁴ (t² − 4t + 3) dt = [t³/3 − 2t² + 3t]₀⁴ = 64/3 − 32 + 12 = 4/3 公尺。",
      solutionSteps: ["位移 = ∫₀⁴ v(t) dt。", "[t³/3 − 2t² + 3t]₀⁴ = 64/3 − 32 + 12。", "= 4/3（公尺）。"],
      verify: { m: "integral", f: "t^2-4t+3", v: "t", a: 0, b: 4 } },

    /* ── 4.11 反連鎖律 ── */
    { id: "cg-4c-001", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\int\\left(x^2+1\\right)^2dx\\text{ 能不能「猜 }\\tfrac{1}{3}(x^2+1)^3\\text{、再修正常數」算出來？}",
      answer: "不能：微分後多出 2x，不是常數，要先展開", answers: ["不能：微分後多出 2x，不是常數，要先展開"], canonical: "不能：微分後多出 2x，不是常數，要先展開",
      distractors: ["能：答案是 (x² + 1)³/3 + C", "能：答案是 (x² + 1)³/(6x) + C"], timeLimit: 60,
      tags: ["reverse-chain-constant-only", "chain-rule", "antiderivative"],
      hints: ["把猜的 (x² + 1)³/3 微分，跟被積函數比較。", "多出來的因子如果含 x，能不能用除以常數修正？"],
      solution: "[(x² + 1)³/3]′ = 2x(x² + 1)²，多了含 x 的 2x，修不掉（除以 2x 會破壞微分）。正確做法是展開：x⁴ + 2x² + 1，積得 x⁵/5 + 2x³/3 + x + C。",
      solutionSteps: ["[(x² + 1)³/3]′ = (x² + 1)²·2x ≠ (x² + 1)²。", "多出的 2x 含 x，不能用常數修正。", "展開積分：x⁵/5 + 2x³/3 + x + C。"],
      verify: { m: "choice", options: [
        { say: "不能：微分後多出 2x，不是常數，要先展開", all: [antiBad("\\frac{(x^2+1)^3}{3}", "(x^2+1)^2", 1.2), ...antiOk("\\frac{x^5}{5}+\\frac{2x^3}{3}+x", "(x^2+1)^2")] },
        { say: "能：答案是 (x² + 1)³/3 + C", all: antiOk("\\frac{(x^2+1)^3}{3}", "(x^2+1)^2") },
        { say: "能：答案是 (x² + 1)³/(6x) + C", all: antiOk("\\frac{(x^2+1)^3}{6x}", "(x^2+1)^2") }
      ] } },
    { id: "cg-4c-002", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{猜 }(x^2+1)^6\\text{ 當外層，下列哪一個積分可以只靠「修正常數」積出來？}",
      answer: "∫ x(x² + 1)⁵ dx", answers: ["∫ x(x² + 1)⁵ dx"], canonical: "∫ x(x² + 1)⁵ dx",
      distractors: ["∫ (x² + 1)⁵ dx", "∫ x²(x² + 1)⁵ dx", "∫ (x² + 1)⁵/x dx"], timeLimit: 75,
      tags: ["reverse-chain-constant-only", "chain-rule", "antiderivative"],
      hints: ["[(x² + 1)⁶]′ = 12x(x² + 1)⁵。", "被積函數除以它，結果要是常數才修得掉。"],
      solution: "[(x² + 1)⁶]′ = 12x(x² + 1)⁵。只有 x(x² + 1)⁵ 跟它差常數倍 1/12，所以 ∫x(x² + 1)⁵ dx = (x² + 1)⁶/12 + C。其餘三個的比值是 1/(12x)、x/12、1/(12x²)，含 x。",
      solutionSteps: ["[(x² + 1)⁶]′ = 12x(x² + 1)⁵。", "比值：x(x²+1)⁵ → 1/12（常數）；其他是 1/(12x)、x/12、1/(12x²)。", "只有 ∫x(x² + 1)⁵ dx = (x² + 1)⁶/12 + C。"],
      // 「只差常數」⟺ 被積函數 ÷ [(x²+1)⁶]′ 在兩個點一樣
      verify: { m: "choice", options: [
        ["∫ x(x² + 1)⁵ dx", "x(x^2+1)^5"],
        ["∫ (x² + 1)⁵ dx", "(x^2+1)^5"],
        ["∫ x²(x² + 1)⁵ dx", "x^2(x^2+1)^5"],
        ["∫ (x² + 1)⁵/x dx", "\\frac{(x^2+1)^5}{x}"]
      ].map(([say, g]) => ({ say, all: [{
        v: { m: "let", with: { G: at(g, 0.5), D: slopeAt("(x^2+1)^6", 0.5) }, f: "\\frac{G}{D}" },
        eq: { m: "let", with: { G: at(g, 1.5), D: slopeAt("(x^2+1)^6", 1.5) }, f: "\\frac{G}{D}" } }] })) } },

    /* ── 4.12 換元：行不通的時候 ── */
    { id: "cg-4c-003", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "\\text{下列哪一個積分不能用 }u=x^2\\text{ 換掉（換完還卡著 }x\\text{）？}",
      answer: "∫ cos(x²) dx", answers: ["∫ cos(x²) dx"], canonical: "∫ cos(x²) dx",
      distractors: ["∫ x cos(x²) dx", "∫ x/(1 + x⁴) dx", "∫ x e^{x²} dx"], timeLimit: 60,
      tags: ["u-sub-failure-detection", "u-sub"],
      hints: ["u = x² 時 du = 2x dx：被積函數裡要能湊出 x dx。", "哪一個沒有那個 x？"],
      solution: "du = 2x dx，被積函數要寫成 h(x²)·x 才換得掉。x cos(x²)、x/(1 + x⁴)、x e^{x²} 都有 x；cos(x²) 沒有，換完剩 cos u/(2√u)，沒有變簡單。",
      solutionSteps: ["u = x²，du = 2x dx：需要「x² 的函數 × x」。", "x cos(x²)、x/(1 + (x²)²)、x e^{x²} 都是這個形狀。", "cos(x²) 少了 x，換不掉。"],
      // 形狀 h(x²)·x ⟺ g(x)/x 是偶函數 ⟺ g(a) + g(−a) = 0；「換不掉」就是這個和不為 0
      verify: { m: "choice", options: [
        ["∫ cos(x²) dx", "\\cos\\left(x^2\\right)"],
        ["∫ x cos(x²) dx", "x\\cos\\left(x^2\\right)"],
        ["∫ x/(1 + x⁴) dx", "\\frac{x}{1+x^4}"],
        ["∫ x e^{x²} dx", "x e^{x^2}"]
      ].map(([say, g]) => ({ say, all: [{ v: { m: "let", with: { P: at(g, 0.8), Q: at(g, -0.8) }, f: "P+Q" }, ne: 0 }] })) } },
    { id: "cg-4c-004", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{對 }\\int\\frac{dx}{1+x^2}\\text{ 令 }u=1+x^2\\text{，結果會怎樣？}",
      answer: "行不通：du = 2x dx，被積函數裡沒有 x 可以配", answers: ["行不通：du = 2x dx，被積函數裡沒有 x 可以配"], canonical: "行不通：du = 2x dx，被積函數裡沒有 x 可以配",
      distractors: ["可以，答案是 ln(1 + x²) + C", "可以，答案是 ln(1 + x²)/(2x) + C"], timeLimit: 60,
      tags: ["u-sub-failure-detection", "u-sub", "inverse-trig"],
      hints: ["算 du，看被積函數裡湊不湊得出來。", "把那兩個「可以」的答案微分看看。"],
      solution: "du = 2x dx，但被積函數裡沒有 x，換不過去。[ln(1 + x²)]′ = 2x/(1 + x²)，不對；把 x 當常數除掉的 ln(1 + x²)/(2x) 也不對。這題是表上的 arctan x + C。",
      solutionSteps: ["u = 1 + x²，du = 2x dx，被積函數沒有 x。", "檢查：[ln(1 + x²)]′ = 2x/(1 + x²) ≠ 1/(1 + x²)。", "正確答案是 arctan x + C，不用換元。"],
      verify: { m: "choice", options: [
        { say: "行不通：du = 2x dx，被積函數裡沒有 x 可以配", all: [
          { v: { m: "let", with: { P: at("\\frac{1}{1+x^2}", 0.8), Q: at("\\frac{1}{1+x^2}", -0.8) }, f: "P+Q" }, ne: 0 },
          antiBad("\\ln\\left(1+x^2\\right)", "\\frac{1}{1+x^2}", 0.8)] },
        { say: "可以，答案是 ln(1 + x²) + C", all: antiOk("\\ln\\left(1+x^2\\right)", "\\frac{1}{1+x^2}") },
        { say: "可以，答案是 ln(1 + x²)/(2x) + C", all: antiOk("\\frac{\\ln\\left(1+x^2\\right)}{2x}", "\\frac{1}{1+x^2}") }
      ] } },

    /* ── 4.13 換元：辨識 ── */
    { id: "cg-4c-005", topic: "integrals", rank: 1, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\sin x\\,e^{\\cos x}\\,dx",
      answer: "-exp(cos(x))", timeLimit: 60,
      tags: ["u-sub-exp-form", "u-sub", "exponential"],
      hints: ["指數上的 cos x 當 u。", "du = −sin x dx：差一個負號。"],
      solution: "u = cos x，du = −sin x dx：∫sin x e^{cos x} dx = −∫eᵘ du = −e^{cos x} + C。",
      solutionSteps: ["u = cos x，du = −sin x dx。", "−∫eᵘ du = −eᵘ + C = −e^{cos x} + C。"] },
    { id: "cg-4c-006", topic: "integrals", rank: 2, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{e^{3/x}}{x^2}\\,dx",
      answer: "-exp(3/x)/3", timeLimit: 75,
      tags: ["u-sub-exp-form", "u-sub", "exponential"],
      hints: ["令 u = 3/x，算 du。", "du 裡有 dx/x²，再看差多少常數倍。"],
      solution: "u = 3/x，du = −3/x² dx，dx/x² = −du/3：∫ = −(1/3)∫eᵘ du = −(1/3)e^{3/x} + C。",
      solutionSteps: ["u = 3/x，du = −(3/x²) dx。", "dx/x² = −du/3。", "−(1/3)eᵘ + C = −(1/3)e^{3/x} + C。"] },
    { id: "cg-4c-007", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\int 2\\sin x\\cos x\\,dx\\text{：甲得 }\\sin^2x+C\\text{，乙得 }-\\cos^2x+C\\text{，丙得 }-\\tfrac{1}{2}\\cos 2x+C\\text{。誰對？}",
      answer: "三個都對（彼此只差常數）", answers: ["三個都對（彼此只差常數）"], canonical: "三個都對（彼此只差常數）",
      distractors: ["只有甲對", "只有甲、乙對", "三個都不對"], timeLimit: 75,
      tags: ["u-sub-choice-constant", "u-sub", "trig"],
      hints: ["三個答案各自微分，看是不是 2 sin x cos x。", "sin²x、−cos²x、−½cos 2x 兩兩相減是什麼？"],
      solution: "三個微分都是 2 sin x cos x。它們只差常數：sin²x − (−cos²x) = 1，sin²x − (−½cos 2x) = ½。不同的 u 給出長得不同、但只差常數的答案。",
      solutionSteps: ["(sin²x)′ = 2 sin x cos x；(−cos²x)′ = 2 cos x sin x；(−½cos 2x)′ = sin 2x = 2 sin x cos x。", "sin²x = −cos²x + 1 = −½cos 2x + ½。", "三個都對。"],
      verify: { m: "choice", options: [
        { say: "三個都對（彼此只差常數）", all: [...antiOk("\\sin^2 x", "2\\sin x\\cos x"), ...antiOk("-\\cos^2 x", "2\\sin x\\cos x"), ...antiOk("-\\frac{1}{2}\\cos 2x", "2\\sin x\\cos x")] },
        { say: "只有甲對", all: [antiBad("-\\cos^2 x", "2\\sin x\\cos x", 0.7)] },
        { say: "只有甲、乙對", all: [antiBad("-\\frac{1}{2}\\cos 2x", "2\\sin x\\cos x", 0.7)] },
        { say: "三個都不對", all: [antiBad("\\sin^2 x", "2\\sin x\\cos x", 0.7)] }
      ] } },

    /* ── 4.14 定積分換元：找錯 ── */
    { id: "cg-4c-008", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{某生算 }\\int_0^2 x\\left(x^2+1\\right)^3dx\\text{：令 }u=x^2+1\\text{，寫成 }\\frac{1}{2}\\int_0^2 u^3\\,du=\\frac{1}{2}\\cdot\\frac{2^4}{4}=2\\text{。哪一個說法正確？}",
      answer: "上下限沒跟著換：u 要從 1 到 5，正確值是 78", answers: ["上下限沒跟著換：u 要從 1 到 5，正確值是 78"], canonical: "上下限沒跟著換：u 要從 1 到 5，正確值是 78",
      distractors: ["沒錯，答案就是 2", "du 的係數錯了，正確值是 4", "上下限要換成 1 到 5，正確值是 156"], timeLimit: 90,
      tags: ["u-sub-def-no-mixing", "u-sub", "definite-integral"],
      hints: ["換成 u 之後，積分的上下限是 u 的範圍，不是 x 的。", "x = 0 和 x = 2 時，u 各是多少？"],
      solution: "x = 0 ⟹ u = 1，x = 2 ⟹ u = 5。正確是 ½∫₁⁵ u³ du = ½·(625 − 1)/4 = 78。他把 x 的上下限直接寫在 u 的積分上。",
      solutionSteps: ["u = x² + 1，du = 2x dx，x dx = du/2（這步沒錯）。", "上下限：x = 0 → u = 1，x = 2 → u = 5。", "½∫₁⁵ u³ du = ½·(5⁴ − 1)/4 = 78。"],
      verify: { m: "choice", options: [
        { say: "上下限沒跟著換：u 要從 1 到 5，正確值是 78", all: [{ v: integ("x\\left(x^2+1\\right)^3", 0, 2), eq: 78 }] },
        { say: "沒錯，答案就是 2", all: [{ v: integ("x\\left(x^2+1\\right)^3", 0, 2), eq: 2 }] },
        { say: "du 的係數錯了，正確值是 4", all: [{ v: integ("x\\left(x^2+1\\right)^3", 0, 2), eq: 4 }] },
        { say: "上下限要換成 1 到 5，正確值是 156", all: [{ v: integ("x\\left(x^2+1\\right)^3", 0, 2), eq: 156 }] }
      ] } },
    { id: "cg-4c-009", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{某生算 }\\int_0^{\\pi/2}\\cos x\\sin^3x\\,dx\\text{：令 }u=\\sin x\\text{ 得 }\\frac{u^4}{4}\\text{，再代 }\\frac{\\pi}{2}\\text{ 與 }0\\text{：}\\frac{(\\pi/2)^4}{4}=\\frac{\\pi^4}{64}\\text{。哪一個說法正確？}",
      answer: "u 的式子代了 x 的上下限：u 要從 0 到 1，正確值是 1/4", answers: ["u 的式子代了 x 的上下限：u 要從 0 到 1，正確值是 1/4"], canonical: "u 的式子代了 x 的上下限：u 要從 0 到 1，正確值是 1/4",
      distractors: ["沒錯，答案就是 π⁴/64", "du 少了負號，正確值是 −1/4", "正確值是 0，因為 sin 0 = 0"], timeLimit: 90,
      tags: ["u-sub-def-no-mixing", "u-sub", "trig"],
      hints: ["u⁴/4 是 u 的式子，要代的是 u 的範圍。", "x = π/2 時 u = sin(π/2) 是多少？"],
      solution: "u = sin x：x = 0 → u = 0，x = π/2 → u = 1。∫₀¹ u³ du = 1/4。不然就要先換回 sin⁴x/4 再代 x 的上下限，結果一樣是 1/4。",
      solutionSteps: ["u = sin x，du = cos x dx（沒有負號）。", "上下限：u 從 0 到 1。", "∫₀¹ u³ du = 1/4。"],
      verify: { m: "choice", options: [
        { say: "u 的式子代了 x 的上下限：u 要從 0 到 1，正確值是 1/4", all: [{ v: integ("\\cos x\\sin^3 x", 0, "\\pi/2"), eq: "1/4" }] },
        { say: "沒錯，答案就是 π⁴/64", all: [{ v: integ("\\cos x\\sin^3 x", 0, "\\pi/2"), eq: "\\pi^4/64" }] },
        { say: "du 少了負號，正確值是 −1/4", all: [{ v: integ("\\cos x\\sin^3 x", 0, "\\pi/2"), eq: "-1/4" }] },
        { say: "正確值是 0，因為 sin 0 = 0", all: [{ v: integ("\\cos x\\sin^3 x", 0, "\\pi/2"), eq: 0 }] }
      ] } },

    /* ── 4.15 先變形再換元 ── */
    { id: "cg-4c-010", topic: "integrals", rank: 2, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{dx}{1+e^{-x}}",
      answer: "log(1+exp(x))", timeLimit: 90,
      tags: ["u-sub-rewrite-first", "u-sub", "exponential"],
      hints: ["分子分母同乘 eˣ，看分母變成什麼。", "分子變成分母的導數，就是 u′/u 的形狀。"],
      solution: "同乘 eˣ：eˣ/(eˣ + 1)。令 u = eˣ + 1，du = eˣ dx：∫du/u = ln(1 + eˣ) + C。",
      solutionSteps: ["1/(1 + e^{−x}) = eˣ/(eˣ + 1)。", "u = eˣ + 1，du = eˣ dx。", "∫du/u = ln(1 + eˣ) + C。"] },
    { id: "cg-4c-011", topic: "integrals", rank: 3, answerKind: "antiderivative", variable: "x",
      prompt: "\\int\\frac{dx}{e^{x}+4e^{-x}}",
      answer: "atan(exp(x)/2)/2", timeLimit: 120,
      tags: ["u-sub-rewrite-first", "u-sub", "inverse-trig"],
      hints: ["同乘 eˣ，分母變成 e^{2x} + 4。", "令 u = eˣ 後是 du/(u² + 4)：arctan 的形狀。"],
      solution: "同乘 eˣ：eˣ/(e^{2x} + 4)。u = eˣ，du = eˣ dx：∫du/(u² + 4) = ½ arctan(u/2) = ½ arctan(eˣ/2) + C。",
      solutionSteps: ["1/(eˣ + 4e^{−x}) = eˣ/(e^{2x} + 4)。", "u = eˣ：∫du/(u² + 4)。", "= ½ arctan(u/2) + C = ½ arctan(eˣ/2) + C。"] }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
