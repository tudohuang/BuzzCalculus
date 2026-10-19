(function () {
  "use strict";

  // 向量分析補強包：線積分 / Green / 散度定理 / Stokes / 保守場 / 進階 nabla。
  // 2026-07 題庫審計後新增：三大定理原本幾乎為零、nabla 題全是低階直算。
  const SOURCE = "Buzz vector calculus pack";
  const problems = [];

  function add(problem) {
    const rank = problem.rank;
    const tags = [...(problem.tags || []), "multivariable", "vector-calculus", `rank-${rank}`];
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

  function numeric(id, topic, rank, prompt, answer, tags, solution, timeLimit, hints) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, tags, solution, timeLimit, hints });
  }

  function text(id, topic, rank, prompt, answers, canonical, tags, solution, timeLimit) {
    add({ id, topic, rank, prompt, answerKind: "text", answers, canonical, tags, solution, timeLimit });
  }

  // ---- 純量場線積分 ----
  numeric("vc-line-001", "integrals", 4,
    "\\int_C x\\,ds,\\quad C:(0,0)\\to(3,4)\\text{ 直線段}",
    "15/2", ["line-integral"],
    "參數化 x=3t, y=4t, ds=5\\,dt，積分 ∫ 3t·5 dt = 15/2。", 90);
  numeric("vc-line-002", "integrals", 4,
    "\\int_C (x^2+y^2)\\,ds,\\quad C: x^2+y^2=4",
    "16*pi", ["line-integral"],
    "在圓上 x²+y²=4 是常數，直接乘以周長 4π 得 16π。", 75);
  numeric("vc-line-003", "integrals", 5,
    "\\int_C x\\,ds,\\quad C: y=x^2,\\ 0\\le x\\le 1",
    "(5*sqrt(5)-1)/12", ["line-integral"],
    "ds=√(1+4x²)dx，令 u=1+4x² 換元得 (5√5−1)/12。", 120);
  numeric("vc-line-004", "integrals", 5,
    "\\int_C z\\,ds,\\quad C:(\\cos t,\\sin t,t),\\ 0\\le t\\le 2\\pi",
    "2*sqrt(2)*pi^2", ["line-integral"],
    "螺旋線 ds=√2 dt，∫₀^{2π} t√2 dt = 2√2 π²。", 110);

  // ---- 向量場線積分（功） ----
  numeric("vc-work-001", "integrals", 4,
    "\\int_C y\\,dx+x\\,dy,\\quad C:(0,0)\\to(2,3)\\text{ 直線段}",
    "6", ["line-integral", "conservative-field"],
    "F=(y,x) 是保守場，位能 f=xy，答案 f(2,3)−f(0,0)=6。", 90);
  numeric("vc-work-002", "integrals", 5,
    "\\oint_C y\\,dx-x\\,dy,\\quad C:\\text{單位圓逆時針}",
    "-2*pi", ["line-integral", "green-theorem"],
    "Green 定理：∂(−x)/∂x−∂y/∂y=−2，乘上面積 π 得 −2π。", 100);
  numeric("vc-work-003", "integrals", 4,
    "\\int_C x^2\\,dx+xy\\,dy,\\quad C: y=x,\\ (0,0)\\to(1,1)",
    "2/3", ["line-integral"],
    "代 x=t, y=t：∫₀¹ (t²+t²)dt = 2/3。", 90);
  numeric("vc-work-004", "integrals", 5,
    "\\int_C y^2\\,dx+x^2\\,dy,\\quad C: y=x^2,\\ (0,0)\\to(1,1)",
    "7/10", ["line-integral"],
    "代 y=x²：∫₀¹ x⁴dx + x²·2x dx = 1/5 + 1/2 = 7/10。", 110);

  // ---- 保守場與位能 ----
  numeric("vc-cons-001", "integrals", 4,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle 2xy+1,\\ x^2\\rangle,\\ C:(0,0)\\to(1,2)",
    "3", ["conservative-field", "line-integral"],
    "F 保守，位能 f=x²y+x，f(1,2)−f(0,0)=3。", 100);
  numeric("vc-cons-002", "integrals", 5,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle e^x\\sin y,\\ e^x\\cos y\\rangle,\\ C:(0,0)\\to(0,\\tfrac{\\pi}{2})",
    "1", ["conservative-field", "line-integral"],
    "位能 f=eˣ sin y，f(0,π/2)−f(0,0)=1−0=1。", 110);
  numeric("vc-cons-003", "derivatives", 4,
    "\\mathbf{F}=\\langle a\\,xy,\\ x^2+2y\\rangle\\text{ 為保守場，求 }a",
    "2", ["conservative-field", "nabla"],
    "保守要求 ∂P/∂y=∂Q/∂x：ax=2x，所以 a=2。", 80);
  numeric("vc-cons-004", "integrals", 5,
    "\\int_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y^2,\\ 2xy+3y^2\\rangle,\\ C:(1,1)\\to(2,2)",
    "14", ["conservative-field", "line-integral"],
    "位能 f=xy²+y³，f(2,2)−f(1,1)=16−2=14。", 110);

  // ---- Green 定理 ----
  numeric("vc-green-001", "integrals", 4,
    "\\oint_C x\\,dy-y\\,dx,\\quad C:\\text{三角形 }(0,0),(2,0),(0,3)\\text{ 逆時針}",
    "6", ["green-theorem", "line-integral"],
    "∮x dy−y dx = 2×面積 = 2×3 = 6。", 90);
  numeric("vc-green-002", "integrals", 4,
    "\\oint_C (x-y)\\,dx+(x+y)\\,dy,\\quad C:\\text{單位圓逆時針}",
    "2*pi", ["green-theorem", "line-integral"],
    "Green：∂Q/∂x−∂P/∂y = 1−(−1) = 2，乘面積 π。", 90);
  numeric("vc-green-003", "integrals", 4,
    "\\oint_C y^2\\,dx+x^2\\,dy,\\quad C:\\text{正方形 }[0,1]^2\\text{ 逆時針}",
    "0", ["green-theorem", "line-integral"],
    "Green 給 ∬(2x−2y)dA，對稱區域上抵銷為 0。", 90);
  numeric("vc-green-004", "integrals", 5,
    "\\oint_C xy\\,dx+x^2\\,dy,\\quad C:\\text{正方形 }[0,1]^2\\text{ 逆時針}",
    "1/2", ["green-theorem", "line-integral"],
    "旋度 2x−x=x，∬₀¹∬₀¹ x dA = 1/2。", 100);
  numeric("vc-green-005", "integrals", 5,
    "\\oint_C -y^3\\,dx+x^3\\,dy,\\quad C:\\text{單位圓逆時針}",
    "3*pi/2", ["green-theorem", "line-integral", "polar-coordinates"],
    "旋度 3x²+3y²=3r²，極座標 ∬3r²·r dr dθ = 3π/2。", 110);
  numeric("vc-green-006", "integrals", 4,
    "\\text{用 }\\tfrac12\\oint_C x\\,dy-y\\,dx\\text{ 求橢圓 }x=3\\cos t,\\ y=2\\sin t\\text{ 的面積}",
    "6*pi", ["green-theorem", "area"],
    "面積公式給 ½∮(3cos t·2cos t+2sin t·3sin t)dt = ½·6·2π = 6π。", 100);
  numeric("vc-green-007", "integrals", 5,
    "\\oint_C \\left(e^{x^2}-y\\right)dx+\\left(x+\\ln(1+y^2)\\right)dy,\\quad C:\\text{單位圓逆時針}",
    "2*pi", ["green-theorem", "line-integral"],
    "難算的項都被 Green 消掉：旋度 = 1−(−1) = 2，答案 2π。", 110);
  numeric("vc-green-008", "integrals", 5,
    "\\oint_C xy^2\\,dx+(x^2y+x)\\,dy,\\quad C: x^2+y^2=9\\text{ 逆時針}",
    "9*pi", ["green-theorem", "line-integral"],
    "旋度 = 2xy+1−2xy = 1，等於區域面積 9π。", 110);

  // ---- Green 通量形式（2D 散度） ----
  numeric("vc-flux-001", "integrals", 4,
    "\\mathbf{F}=\\langle x,y\\rangle\\text{ 穿出單位圓的通量 }\\oint_C \\mathbf{F}\\cdot\\mathbf{n}\\,ds",
    "2*pi", ["flux", "green-theorem"],
    "通量形式：∬ div F dA = ∬2 dA = 2π。", 90);
  numeric("vc-flux-002", "integrals", 5,
    "\\mathbf{F}=\\langle x^3,y^3\\rangle\\text{ 穿出單位圓的通量}",
    "3*pi/2", ["flux", "green-theorem", "polar-coordinates"],
    "div F = 3x²+3y²，極座標積分得 3π/2。", 110);

  // ---- 面積分 ----
  numeric("vc-surf-001", "integrals", 5,
    "\\iint_S z\\,dS,\\quad S:\\text{上半球面 }x^2+y^2+z^2=1,\\ z\\ge 0",
    "pi", ["surface-integral"],
    "球座標 z=cos φ, dS=sin φ dφ dθ，∫₀^{2π}∫₀^{π/2} cosφ sinφ = π。", 120);
  numeric("vc-surf-002", "integrals", 5,
    "\\iint_S (x^2+y^2)\\,dS,\\quad S:\\text{圓柱側面 }x^2+y^2=4,\\ 0\\le z\\le 3",
    "48*pi", ["surface-integral"],
    "側面上 x²+y²=4 為常數，乘側面積 2π·2·3 = 12π 得 48π。", 110);
  numeric("vc-surf-003", "integrals", 6,
    "z=x^2+y^2\\ (z\\le 1)\\text{ 的曲面面積}",
    "pi*(5*sqrt(5)-1)/6", ["surface-integral", "surface-area", "polar-coordinates"],
    "dS=√(1+4r²) r dr dθ，換元得 π(5√5−1)/6。", 150);

  // ---- 散度定理 ----
  numeric("vc-div-001", "integrals", 4,
    "\\mathbf{F}=\\langle x,y,z\\rangle\\text{ 穿出單位球面的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "div F = 3，乘球體積 4π/3 得 4π。", 90);
  numeric("vc-div-002", "integrals", 5,
    "\\mathbf{F}=\\langle x^3,y^3,z^3\\rangle\\text{ 穿出單位球面的通量}",
    "12*pi/5", ["divergence-theorem", "flux"],
    "div F = 3r²，球座標 ∫₀¹ 3r²·4πr² dr = 12π/5。", 130);
  numeric("vc-div-003", "integrals", 4,
    "\\mathbf{F}=\\langle xy,yz,zx\\rangle\\text{ 穿出正方體 }[0,1]^3\\text{ 的通量}",
    "3/2", ["divergence-theorem", "flux"],
    "div F = y+z+x，∭ (x+y+z) dV = 3·(1/2) = 3/2。", 100);
  numeric("vc-div-004", "integrals", 4,
    "\\mathbf{F}=\\langle x^2,y^2,z^2\\rangle\\text{ 穿出正方體 }[0,1]^3\\text{ 的通量}",
    "3", ["divergence-theorem", "flux"],
    "div F = 2(x+y+z)，∭ = 2·3/2 = 3。", 100);
  numeric("vc-div-005", "integrals", 5,
    "\\mathbf{F}=\\langle x+\\sin z,\\ y+e^{z},\\ z+\\cos x\\rangle\\text{ 穿出球面 }x^2+y^2+z^2=4\\text{ 的通量}",
    "32*pi", ["divergence-theorem", "flux"],
    "sin z、e^z、cos x 對散度沒貢獻：div F = 3，乘體積 32π/3 得 32π。", 120);
  numeric("vc-div-006", "integrals", 6,
    "\\mathbf{F}=\\frac{\\langle x,y,z\\rangle}{(x^2+y^2+z^2)^{3/2}}\\text{ 穿出球面 }x^2+y^2+z^2=25\\text{ 的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "反平方場對任何包住原點的封閉面通量都是 4π（原點是奇點，不能直接用散度定理塞 0）。", 140);
  numeric("vc-div-007", "integrals", 5,
    "\\mathbf{F}=\\langle 0,0,z^2\\rangle\\text{ 穿出封閉圓柱 }x^2+y^2\\le 1,\\ 0\\le z\\le 2\\text{ 的通量}",
    "4*pi", ["divergence-theorem", "flux"],
    "div F = 2z，∭ 2z dV = π·[z²]₀² = 4π。", 120);

  // ---- Stokes 定理 ----
  numeric("vc-stokes-001", "integrals", 4,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle -y,x,z\\rangle,\\ C: x^2+y^2=1,\\ z=0\\text{ 逆時針}",
    "2*pi", ["stokes-theorem", "line-integral"],
    "curl F = (0,0,2)，穿過單位圓盤的通量 2π。", 100);
  numeric("vc-stokes-002", "integrals", 5,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle z,x,y\\rangle,\\ C: x^2+y^2=1,\\ z=1\\text{ 逆時針（由上往下看）}",
    "pi", ["stokes-theorem", "line-integral"],
    "curl F = (1,1,1)，取法向 ẑ 的圓盤：通量 = 1·π = π。", 120);
  numeric("vc-stokes-003", "integrals", 5,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y,z,x\\rangle,\\ C: x^2+y^2=4,\\ z=0\\text{ 逆時針}",
    "-4*pi", ["stokes-theorem", "line-integral"],
    "curl F = (−1,−1,−1)，法向 ẑ 分量 −1，乘面積 4π 得 −4π。", 120);
  numeric("vc-stokes-004", "integrals", 6,
    "\\oint_C y^2dx+z^2dy+x^2dz,\\quad C:\\text{三角形 }(1,0,0)\\to(0,1,0)\\to(0,0,1)\\to(1,0,0)",
    "-1", ["stokes-theorem", "line-integral"],
    "curl F = −2(z,x,y)，在平面 x+y+z=1 上 curl·n = −2/√3，乘三角形面積 √3/2 得 −1。", 160);
  numeric("vc-stokes-005", "integrals", 5,
    "\\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S},\\ \\mathbf{F}=\\langle -y,x,0\\rangle,\\ S:\\text{上半球面 }x^2+y^2+z^2=1\\text{（法向朝上）}",
    "2*pi", ["stokes-theorem", "surface-integral"],
    "Stokes：換成沿赤道的線積分 ∮−y dx+x dy = 2π，不必真的在球面上積。", 130);
  numeric("vc-stokes-006", "integrals", 6,
    "\\oint_C \\mathbf{F}\\cdot d\\mathbf{r},\\ \\mathbf{F}=\\langle y,-x,z^2\\rangle,\\ C: x^2+y^2=4,\\ z=3\\text{ 逆時針（由上往下看）}",
    "-8*pi", ["stokes-theorem", "line-integral"],
    "curl F = (0,0,−2)，乘圓盤面積 4π 得 −8π；z² 項完全不影響。", 140);

  // ---- 進階 nabla ----
  numeric("vc-nab-001", "derivatives", 5,
    "\\nabla^2\\left(\\frac{1}{\\sqrt{x^2+y^2+z^2}}\\right)\\text{ at }(1,2,2)",
    "0", ["nabla", "laplacian"],
    "1/r 在原點以外是調和函數：∇²(1/r)=0。", 110);
  numeric("vc-nab-002", "derivatives", 4,
    "\\nabla^2(x^2+y^2+z^2)",
    "6", ["nabla", "laplacian"],
    "每個變數貢獻 2，共 6。", 60);
  numeric("vc-nab-003", "derivatives", 6,
    "\\nabla\\cdot\\left(\\frac{\\langle x,y,z\\rangle}{\\sqrt{x^2+y^2+z^2}}\\right)\\text{ at }(2,1,2)",
    "2/3", ["nabla", "vector-identity"],
    "∇·(r̂) = 2/r（用 ∇·(rf(r)) = 3f + rf'），r=3 得 2/3。", 140);
  numeric("vc-nab-004", "derivatives", 4,
    "\\left|\\nabla\\times(\\nabla f)\\right|,\\quad f=x^2y+z^3",
    "0", ["nabla", "vector-identity"],
    "梯度場的旋度恆為零：∇×∇f = 0。", 60);
  numeric("vc-nab-005", "derivatives", 4,
    "\\nabla\\cdot(\\nabla\\times\\mathbf{F}),\\quad \\mathbf{F}=\\langle xyz,\\ x+y+z,\\ x^2y^2\\rangle",
    "0", ["nabla", "vector-identity"],
    "旋度場的散度恆為零：∇·(∇×F) = 0。", 60);
  numeric("vc-nab-006", "derivatives", 4,
    "f=x^2y+z\\text{ 在 }(1,2,0)\\text{ 的最大方向導數}",
    "3*sqrt(2)", ["nabla", "directional-derivative"],
    "最大方向導數 = |∇f| = |(4,1,1)| = √18 = 3√2。", 90);
  numeric("vc-nab-007", "derivatives", 5,
    "f=\\ln(x^2+y^2)\\text{ 在 }(1,1)\\text{ 沿指向 }(2,3)\\text{ 方向的方向導數}",
    "3/sqrt(5)", ["nabla", "directional-derivative"],
    "∇f(1,1)=(1,1)，方向 (1,2)/√5，內積 3/√5。", 120);
  numeric("vc-nab-008", "derivatives", 4,
    "\\nabla^2(x^2y^3)\\text{ at }(1,1)",
    "8", ["nabla", "laplacian"],
    "f_xx = 2y³ = 2，f_yy = 6x²y = 6，相加 8。", 80);
  numeric("vc-nab-009", "derivatives", 5,
    "\\nabla^2(x^3y-xy^3)\\text{ at }(5,7)",
    "0", ["nabla", "laplacian"],
    "f_xx = 6xy，f_yy = −6xy，處處相消：這是調和函數。", 100);
  numeric("vc-nab-010", "derivatives", 5,
    "\\nabla\\cdot(f\\mathbf{F})\\text{ at }(1,2,3),\\quad f=x,\\ \\mathbf{F}=\\langle y,z,x\\rangle",
    "2", ["nabla", "vector-identity"],
    "∇·(fF) = f∇·F + ∇f·F = x·0 + (1,0,0)·(y,z,x) = y = 2。", 120);
  numeric("vc-nab-011", "derivatives", 5,
    "\\left|\\nabla\\times\\mathbf{F}\\right|,\\quad \\mathbf{F}=\\langle yz,\\ zx,\\ xy\\rangle",
    "0", ["nabla", "vector-identity", "conservative-field"],
    "F = ∇(xyz) 是梯度場，旋度為零。", 100);
  numeric("vc-nab-012", "derivatives", 4,
    "\\left|\\nabla\\times\\mathbf{F}\\right|\\text{ at }(1,2,0),\\quad \\mathbf{F}=\\langle -y^2,\\ x^2,\\ 0\\rangle",
    "6", ["nabla", "vector-identity"],
    "curl F = (0,0,2x+2y)，在 (1,2) 得 |6| = 6。", 90);

  // ---- 定理辨識 ----
  text("vc-rec-001", "integrals", 4,
    "\\text{封閉曲面上的通量 }\\oiint_S \\mathbf{F}\\cdot d\\mathbf{S}\\text{ 最適合用哪個定理化成體積分？}",
    ["divergence theorem", "divergence", "gauss", "散度定理", "高斯定理", "高斯"],
    "divergence theorem",
    ["technique-recognition", "divergence-theorem"],
    "封閉曲面 → 散度（高斯）定理，把通量換成 ∭ div F dV。", 45);
  text("vc-rec-002", "integrals", 4,
    "\\text{平面封閉曲線上的環流 }\\oint_C P\\,dx+Q\\,dy\\text{ 最適合用哪個定理化成二重積分？}",
    ["green", "green theorem", "green's theorem", "格林定理", "格林"],
    "green theorem",
    ["technique-recognition", "green-theorem"],
    "平面封閉曲線 → Green 定理，∮ = ∬(Q_x − P_y) dA。", 45);

  /* ═══════════ 提示 ═══════════
     只寫給 R5 以上、而且原本一條提示都沒有的題。
     這一區的提示特別容易寫成罐頭（「用 Green 定理」對整包都成立），
     所以第一層寫的是「這一題為什麼不該硬算」，第二層才是關鍵那一步。 */
  const HINTS = {
    "vc-green-001": [
      "先用 Green 算一下這個被積式的旋度 —— 你會發現它是個常數，而且這個組合有特別的身分。",
      "旋度是常數時，線積分就等於那個常數乘上圍住的面積。三角形的面積用底乘高除以 2。"
    ],
    "vc-green-003": [
      "用 Green 換成二重積分，先算旋度 ∂Q/∂x − ∂P/∂y。",
      "旋度會長成 2x − 2y。在正方形這種對 x 與 y 對稱的區域上，這兩項的積分一樣大。"
    ],
    "vc-green-004": [
      "Green 定理：旋度是 ∂(x²)/∂x 減掉 ∂(xy)/∂y。",
      "化簡之後旋度只剩下一個變數。在單位正方形上積分，等於那個變數在 [0,1] 上的平均。"
    ],
    "vc-green-005": [
      "算出來的旋度會是 3x² + 3y² —— 看到 x²+y² 就該換極座標。",
      "極座標下旋度變成 3r²，別忘了面積元素還要再乘一個 r。"
    ],
    "vc-green-006": [
      "½∮(x dy − y dx) 這個組合算出來剛好就是圍住的面積 —— 直接把參數式代進去。",
      "代入後被積式會靠 cos²+sin² 併成一個常數，再乘上參數走一圈的長度。"
    ],
    "vc-green-007": [
      "e^{x²} 與 ln(1+y²) 都沒有初等原函數。題目把它們放進來，就是在告訴你不要直接算線積分。",
      "用 Green 之後，那兩個難算的項一個對 x 微分、一個對 y 微分，全部消失，只剩常數旋度。"
    ],
    "vc-green-008": [
      "先算旋度：∂(x²y+x)/∂x 減掉 ∂(xy²)/∂y。",
      "兩個 2xy 會抵消，只剩下一個常數。常數旋度乘上圓的面積就是答案。"
    ],
    "vc-flux-001": [
      "通量形式的 Green 定理用的是**散度**，不是旋度 —— 先確認自己拿的是哪一個。",
      "div F 是常數，所以通量等於那個常數乘上圓的面積。"
    ],
    "vc-flux-002": [
      "先算散度，會得到 3x² + 3y²，又是 x²+y² 的形狀。",
      "換極座標之後散度變成 3r²，面積元素再乘一個 r。"
    ],
    "vc-surf-003": [
      "曲面面積是 ∬√(1 + z_x² + z_y²) dA，先把兩個偏導數算出來。",
      "根號裡會化成 1 + 4r²。換極座標之後，對 r 的那一段用 u = 1 + 4r² 換元。"
    ],
    "vc-stokes-001": [
      "先算 curl F —— 它會是一個常向量，這題就不必真的沿曲線積分。",
      "常向量穿過圓盤的通量，等於它的 z 分量乘上圓盤面積。"
    ],
    "vc-stokes-002": [
      "算出來的 curl F 三個分量都是 1。",
      "只有跟曲面法向同方向的那個分量有貢獻；取 ẑ 當法向時，只剩一個分量在算。"
    ],
    "vc-stokes-003": [
      "curl F 的三個分量都一樣，而且都是負的 —— 先把它算出來。",
      "取 ẑ 當法向時只有 z 分量有貢獻。注意這題的半徑不是 1，面積要重算。"
    ],
    "vc-stokes-004": [
      "curl F 會是 −2(z, x, y)。曲面就取平面 x+y+z=1 被那個三角形圍住的那一塊。",
      "那個平面的單位法向是 (1,1,1)/√3，內積之後 curl·n 是個常數；三角形的面積是 √3/2。"
    ],
    "vc-stokes-005": [
      "不要真的在球面上積分。Stokes 定理讓你把曲面積分換成沿邊界的線積分。",
      "邊界就是赤道那個圓。參數化之後，線積分短到幾行就結束。"
    ],
    "vc-stokes-006": [
      "先算 curl F，並且確認 z² 那一項對旋度完全沒有貢獻。",
      "剩下的旋度是常向量，乘上圓盤面積即可。注意半徑不是 1。"
    ]
  };

  problems.forEach((problem) => {
    if (HINTS[problem.id]) problem.hints = HINTS[problem.id];
  });

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  //
  // 每條都把題幹的曲線／曲面寫成參數式，驗算端只做數值微分＋數值積分 ——
  // 完全不用 Green / Stokes / 散度定理，跟解題的推導共用不到任何一步。
  // 參數化是題幹的重述（那條線／那塊面本來就是那個東西），不是解法。
  // 封閉曲面的法向要指向外側（r_u × r_v 的方向由參數順序決定）。
  const SPHERE = (r) => ({ x: `${r}\\sin u\\cos v`, y: `${r}\\sin u\\sin v`, z: `${r}\\cos u`, u: [0, "\\pi"], v: [0, "2\\pi"] });
  const CUBE_FACES = [
    { x: "1", y: "u", z: "v", u: [0, 1], v: [0, 1] },
    { x: "0", y: "v", z: "u", u: [0, 1], v: [0, 1] },
    { x: "v", y: "1", z: "u", u: [0, 1], v: [0, 1] },
    { x: "u", y: "0", z: "v", u: [0, 1], v: [0, 1] },
    { x: "u", y: "v", z: "1", u: [0, 1], v: [0, 1] },
    { x: "v", y: "u", z: "0", u: [0, 1], v: [0, 1] }
  ];
  const UNIT_CIRCLE = { x: "\\cos t", y: "\\sin t", from: 0, to: "2\\pi" };
  const VERIFY = {
    "vc-line-001": { m: "lineIntegral", kind: "ds", f: "x", path: { x: "3t", y: "4t", from: 0, to: 1 } },
    "vc-line-002": { m: "lineIntegral", kind: "ds", f: "x^2+y^2", path: { x: "2\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } },
    "vc-line-003": { m: "lineIntegral", kind: "ds", f: "x", path: { x: "t", y: "t^2", from: 0, to: 1 } },
    "vc-line-004": { m: "lineIntegral", kind: "ds", f: "z", path: { x: "\\cos t", y: "\\sin t", z: "t", from: 0, to: "2\\pi" } },
    "vc-work-001": { m: "lineIntegral", kind: "work", F: ["y", "x"], path: { x: "2t", y: "3t", from: 0, to: 1 } },
    "vc-work-002": { m: "lineIntegral", kind: "work", F: ["y", "-x"], path: UNIT_CIRCLE },
    "vc-work-003": { m: "lineIntegral", kind: "work", F: ["x^2", "xy"], path: { x: "t", y: "t", from: 0, to: 1 } },
    "vc-work-004": { m: "lineIntegral", kind: "work", F: ["y^2", "x^2"], path: { x: "t", y: "t^2", from: 0, to: 1 } },
    "vc-cons-001": { m: "lineIntegral", kind: "work", F: ["2xy+1", "x^2"], path: { x: "t", y: "2t", from: 0, to: 1 } },
    "vc-cons-002": { m: "lineIntegral", kind: "work", F: ["e^x\\sin y", "e^x\\cos y"], path: { x: "0", y: "\\pi t/2", from: 0, to: 1 } },
    // 求參數：數值旋度當成 a 的函數解零點，再確認每個取樣點都歸零 —— 不碰 ∂P/∂y=∂Q/∂x 的代數
    "vc-cons-003": { m: "conservativeParam", F: ["a\\,xy", "x^2+2y"], param: "a" },
    // ∇·(fF)：f 跟 F 逐點相乘後直接數值偏導，不用乘積法則
    "vc-nab-010": { m: "fieldOp", op: "div", scale: "x", F: ["y", "z", "x"], at: [1, 2, 3] },
    "vc-cons-004": { m: "lineIntegral", kind: "work", F: ["y^2", "2xy+3y^2"], path: { x: "1+t", y: "1+t", from: 0, to: 1 } },
    "vc-green-001": { m: "lineIntegral", kind: "work", F: ["-y", "x"], paths: [
      { x: "2t", y: "0", from: 0, to: 1 },
      { x: "2-2t", y: "3t", from: 0, to: 1 },
      { x: "0", y: "3-3t", from: 0, to: 1 }
    ] },
    "vc-green-002": { m: "lineIntegral", kind: "work", F: ["x-y", "x+y"], path: UNIT_CIRCLE },
    "vc-green-003": { m: "lineIntegral", kind: "work", F: ["y^2", "x^2"], paths: [
      { x: "t", y: "0", from: 0, to: 1 },
      { x: "1", y: "t", from: 0, to: 1 },
      { x: "1-t", y: "1", from: 0, to: 1 },
      { x: "0", y: "1-t", from: 0, to: 1 }
    ] },
    "vc-green-004": { m: "lineIntegral", kind: "work", F: ["xy", "x^2"], paths: [
      { x: "t", y: "0", from: 0, to: 1 },
      { x: "1", y: "t", from: 0, to: 1 },
      { x: "1-t", y: "1", from: 0, to: 1 },
      { x: "0", y: "1-t", from: 0, to: 1 }
    ] },
    "vc-green-005": { m: "lineIntegral", kind: "work", F: ["-y^3", "x^3"], path: UNIT_CIRCLE },
    "vc-green-006": { m: "lineIntegral", kind: "work", F: ["-y/2", "x/2"], path: { x: "3\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } },
    "vc-green-007": { m: "lineIntegral", kind: "work", F: ["e^{x^2}-y", "x+\\ln(1+y^2)"], path: UNIT_CIRCLE },
    "vc-green-008": { m: "lineIntegral", kind: "work", F: ["xy^2", "x^2y+x"], path: { x: "3\\cos t", y: "3\\sin t", from: 0, to: "2\\pi" } },
    // 通量 ∮F·n ds = ∮P dy − Q dx，等於向量場 (−Q, P) 的環流 —— 這是恆等式不是解法
    "vc-flux-001": { m: "lineIntegral", kind: "work", F: ["-y", "x"], path: UNIT_CIRCLE },
    "vc-flux-002": { m: "lineIntegral", kind: "work", F: ["-y^3", "x^3"], path: UNIT_CIRCLE },
    "vc-surf-001": { m: "surfaceScalar", f: "z", surface: { x: "\\sin u\\cos v", y: "\\sin u\\sin v", z: "\\cos u", u: [0, "\\pi/2"], v: [0, "2\\pi"] } },
    "vc-surf-002": { m: "surfaceScalar", f: "x^2+y^2", surface: { x: "2\\cos u", y: "2\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 3] } },
    "vc-surf-003": { m: "surfaceScalar", f: "1", surface: { x: "u\\cos v", y: "u\\sin v", z: "u^2", u: [0, 1], v: [0, "2\\pi"] } },
    "vc-div-001": { m: "surfaceFlux", F: ["x", "y", "z"], surface: SPHERE(1) },
    "vc-div-002": { m: "surfaceFlux", F: ["x^3", "y^3", "z^3"], surface: SPHERE(1) },
    "vc-div-003": { m: "surfaceFlux", F: ["xy", "yz", "zx"], surfaces: CUBE_FACES },
    "vc-div-004": { m: "surfaceFlux", F: ["x^2", "y^2", "z^2"], surfaces: CUBE_FACES },
    "vc-div-005": { m: "surfaceFlux", F: ["x+\\sin z", "y+e^{z}", "z+\\cos x"], surface: SPHERE(2) },
    "vc-div-006": { m: "surfaceFlux", F: ["\\frac{x}{(x^2+y^2+z^2)^{3/2}}", "\\frac{y}{(x^2+y^2+z^2)^{3/2}}", "\\frac{z}{(x^2+y^2+z^2)^{3/2}}"], surface: SPHERE(5) },
    "vc-div-007": { m: "surfaceFlux", F: ["0", "0", "z^2"], surfaces: [
      { x: "\\cos u", y: "\\sin u", z: "v", u: [0, "2\\pi"], v: [0, 2] },
      { x: "u\\cos v", y: "u\\sin v", z: "2", u: [0, 1], v: [0, "2\\pi"] },
      { x: "u\\sin v", y: "u\\cos v", z: "0", u: [0, 1], v: [0, "2\\pi"] }
    ] },
    "vc-stokes-001": { m: "lineIntegral", kind: "work", F: ["-y", "x", "z"], path: { x: "\\cos t", y: "\\sin t", z: "0", from: 0, to: "2\\pi" } },
    "vc-stokes-002": { m: "lineIntegral", kind: "work", F: ["z", "x", "y"], path: { x: "\\cos t", y: "\\sin t", z: "1", from: 0, to: "2\\pi" } },
    "vc-stokes-003": { m: "lineIntegral", kind: "work", F: ["y", "z", "x"], path: { x: "2\\cos t", y: "2\\sin t", z: "0", from: 0, to: "2\\pi" } },
    "vc-stokes-004": { m: "lineIntegral", kind: "work", F: ["y^2", "z^2", "x^2"], paths: [
      { x: "1-t", y: "t", z: "0", from: 0, to: 1 },
      { x: "0", y: "1-t", z: "t", from: 0, to: 1 },
      { x: "t", y: "0", z: "1-t", from: 0, to: 1 }
    ] },
    "vc-stokes-005": { m: "curlFlux", F: ["-y", "x", "0"], surface: { x: "\\sin u\\cos v", y: "\\sin u\\sin v", z: "\\cos u", u: [0, "\\pi/2"], v: [0, "2\\pi"] } },
    "vc-stokes-006": { m: "lineIntegral", kind: "work", F: ["y", "-x", "z^2"], path: { x: "2\\cos t", y: "2\\sin t", z: "3", from: 0, to: "2\\pi" } }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（9A.3 三重積分／柱座標／球座標、9B.1 向量場／梯度場、9B.2 線積分／保守場／位勢）：
  // 自己找投影區域的三重積分、柱球座標的上下限、場的讀法、分段曲線與方向、有洞的保守場、位勢函數。
  const SOURCE = "Buzz course gap fill";

  // 把 x、y、z 代成數字（只動指令名稱以外的字元：\sin、\frac 不受影響）。
  // 用在「場在某點的值」這種題幹重述，給 value／fn 路徑用。
  function sub(tex, at) {
    return String(tex).split(/(\\[A-Za-z]+)/).map((part, i) => (i % 2
      ? part
      : part.replace(/[xyz]/g, (v) => (at[v] !== undefined ? `(${at[v]})` : v)))).join("");
  }
  const val = (tex, at) => ({ m: "value", f: sub(tex, at) });
  // 位勢函數：f(基準點) = 0，且每個偏導等於場的分量（場是題幹給的）
  function potentialVerify(vars, F, base, pts) {
    const cases = [{ at: base, v: { m: "value", f: "0" } }];
    pts.forEach((pt) => vars.forEach((name, i) => cases.push({ at: pt, d: name, v: val(F[i], pt) })));
    return { m: "fn", vars, cases };
  }
  // 平面場的旋度 Q_x − P_y 在兩點都是 0 → 交叉偏導相等
  const curlZero = (F) => [
    { v: { m: "fieldOp", op: "curl", F, at: [0.7, 1.3] }, eq: 0 },
    { v: { m: "fieldOp", op: "curl", F, at: [-1.1, 0.4] }, eq: 0 }
  ];
  // 繞原點的角度場：繞一圈的功 = 2π × 繞的圈數；拿來證明某個區域裡有洞
  const ANGLE = ["\\frac{-y}{x^2+y^2}", "\\frac{x}{x^2+y^2}"];
  const loop = (R) => ({ m: "lineIntegral", kind: "work", F: ANGLE, path: { x: `${R}\\cos t`, y: `${R}\\sin t`, from: 0, to: "2\\pi" } });
  // ∇f 在某點跟向量 (p, q) 同方向：叉積 0、內積正
  const sameDir = (f, at, p, q) => {
    const grad = { a: { m: "deriv", vars: ["x", "y"], f, at, wrt: "x" }, b: { m: "deriv", vars: ["x", "y"], f, at, wrt: "y" } };
    return [
      { v: { m: "let", f: `a\\cdot(${q})-b\\cdot(${p})`, with: grad }, eq: 0 },
      { v: { m: "let", f: `a\\cdot(${p})+b\\cdot(${q})`, with: grad }, gt: 0 }
    ];
  };

  const problems = [
    /* ── 9A.3 三重積分：自己找投影區域 D ── */
    { id: "cg-9a3-001", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{立體 }E\\text{ 由拋物柱面 }y=x^2\\text{、平面 }z=0\\text{ 與平面 }y+z=4\\text{ 圍成。求 }E\\text{ 的體積}",
      answer: "256/15", timeLimit: 180,
      tags: ["triple-bounds-z-first", "iterated-integral", "volume"],
      hints: ["z 從底下的平面走到上面的斜平面；上下限是什麼？", "投影 D 是 y = x² 與 y + z = 4 在 z = 0 時交出的那一塊：x² ≤ y ≤ 4。"],
      solution: "z 從 0 到 4 − y，D：−2 ≤ x ≤ 2、x² ≤ y ≤ 4。V = ∫∫_D (4 − y) dA = ∫₋₂² (4 − x²)²/2 dx = 256/15。",
      solutionSteps: ["最內層：0 ≤ z ≤ 4 − y。", "D：上平面碰到 z = 0 時 y = 4，所以 x² ≤ y ≤ 4、−2 ≤ x ≤ 2。", "∫_{x²}^{4} (4 − y) dy = (4 − x²)²/2。", "∫₋₂² (16 − 8x² + x⁴)/2 dx = ½(64 − 128/3 + 64/5) = 256/15。"],
      verify: { m: "double", u: "x", v: "y", a: -2, b: 2, c: "x^2", d: 4, f: "\\int_{0}^{4-y} 1\\,dz" } },
    { id: "cg-9a3-002", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{立體 }E\\text{ 夾在曲面 }z=y^2\\text{ 與 }z=8-y^2\\text{ 之間，並介於平面 }x=0\\text{ 與 }x=3\\text{ 之間。求 }\\iiint_E x\\,dV",
      answer: "96", timeLimit: 180,
      tags: ["triple-bounds-z-first", "iterated-integral"],
      hints: ["兩張曲面哪一張在上？它們在哪裡相交？", "相交處決定 y 的範圍；x 的範圍題目已經給了。"],
      solution: "y² = 8 − y² ⟹ y = ±2，D 是 0 ≤ x ≤ 3、−2 ≤ y ≤ 2。∭ x dV = ∫₀³ x dx · ∫₋₂² (8 − 2y²) dy = (9/2)(64/3) = 96。",
      solutionSteps: ["上曲面 z = 8 − y²、下曲面 z = y²，交在 y = ±2。", "D：0 ≤ x ≤ 3、−2 ≤ y ≤ 2；內層 ∫_{y²}^{8−y²} x dz = x(8 − 2y²)。", "∫₀³ x dx = 9/2，∫₋₂² (8 − 2y²) dy = 32 − 32/3 = 64/3。", "相乘：96。"],
      verify: { m: "double", u: "y", v: "x", a: -2, b: 2, c: 0, d: 3, f: "\\int_{y^2}^{8-y^2} x\\,dz" } },
    { id: "cg-9a3-003", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{立體 }E\\text{ 在第一卦限，由拋物柱面 }z=4-y^2\\text{、平面 }x+y=2\\text{ 與三個座標平面圍成。求 }\\iiint_E y\\,dV",
      answer: "56/15", timeLimit: 200,
      tags: ["triple-bounds-z-first", "iterated-integral"],
      hints: ["最內層對 z：從 xy 平面到拋物柱面。", "D 是 xy 平面上被 x = 0、y = 0、x + y = 2 圍出的三角形。"],
      solution: "0 ≤ z ≤ 4 − y，D：0 ≤ y ≤ 2、0 ≤ x ≤ 2 − y。∭ y dV = ∫₀² y(2 − y)(4 − y²) dy = 16 − 32/3 − 8 + 32/5 = 56/15。",
      solutionSteps: ["內層：∫₀^{4−y²} y dz = y(4 − y²)。", "D：0 ≤ y ≤ 2、0 ≤ x ≤ 2 − y；對 x 積得 y(2 − y)(4 − y²)。", "展開 8y − 4y² − 2y³ + y⁴，積 0 到 2：16 − 32/3 − 8 + 32/5 = 56/15。"],
      verify: { m: "double", u: "y", v: "x", a: 0, b: 2, c: 0, d: "2-y", f: "\\int_{0}^{4-y^2} y\\,dz" } },
    { id: "cg-9a3-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{四面體 }x,y,z\\ge0,\\ x+y+2z\\le2\\text{（公尺）的密度是 }\\rho=z\\text{（公斤／立方公尺）。求它的質量（公斤）}",
      answer: "1/6", timeLimit: 150,
      tags: ["triple-volume-mass", "iterated-integral", "story-problem"],
      hints: ["質量 = ∭ 密度 dV。", "z 的上限從 x + y + 2z = 2 解出來；D 是 z = 0 時的三角形。"],
      solution: "0 ≤ z ≤ (2 − x − y)/2，D：x + y ≤ 2。內層 ∫ z dz = (2 − x − y)²/8，再積 D：∫₀² (2 − x)³/24 dx = 1/6 公斤。",
      solutionSteps: ["m = ∭_E z dV，最內層 0 ≤ z ≤ (2 − x − y)/2。", "∫₀^{(2−x−y)/2} z dz = (2 − x − y)²/8。", "對 y 從 0 到 2 − x：(2 − x)³/24；對 x 從 0 到 2：16/96 = 1/6（公斤）。"],
      verify: { m: "double", u: "x", v: "y", a: 0, b: 2, c: 0, d: "2-x", f: "\\int_{0}^{(2-x-y)/2} z\\,dz" } },
    { id: "cg-9a3-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{立體 }E\\text{：}0\\le y\\le x\\le1,\\ 0\\le z\\le x+y\\text{，密度 }\\rho(x,y,z)=z\\text{。求 }E\\text{ 的質量}",
      answer: "7/24", timeLimit: 150,
      tags: ["triple-volume-mass", "iterated-integral"],
      hints: ["質量是密度的三重積分，最內層對 z。", "對 z 積完是 (x+y)²/2；接著在三角形 0 ≤ y ≤ x ≤ 1 上積。"],
      solution: "∫₀^{x+y} z dz = (x+y)²/2。∫₀^x (x+y)²/2 dy = (8x³ − x³)/6 = 7x³/6，再 ∫₀¹ 7x³/6 dx = 7/24。",
      solutionSteps: ["內層：∫₀^{x+y} z dz = (x + y)²/2。", "對 y 從 0 到 x：[(x+y)³/6]₀ˣ = 7x³/6。", "∫₀¹ 7x³/6 dx = 7/24。"],
      verify: { m: "double", u: "x", v: "y", a: 0, b: 1, c: 0, d: "x", f: "\\int_{0}^{x+y} z\\,dz" } },

    /* ── 9A.3 柱座標 ── */
    { id: "cg-9a3-006", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{立體在錐面 }z=\\sqrt{x^2+y^2}\\text{ 之上、拋物面 }z=6-x^2-y^2\\text{ 之下。用柱座標求體積}",
      answer: "32*pi/3", timeLimit: 200,
      tags: ["cylindrical-bounds", "cylindrical-coordinates", "volume"],
      hints: ["換成柱座標，兩張曲面各是 z = r 的什麼函數？", "兩張曲面相交的 r 就是投影圓盤的半徑。"],
      solution: "錐面 z = r、拋物面 z = 6 − r²，r = 6 − r² ⟹ r = 2。V = ∫₀^{2π}∫₀² (6 − r² − r) r dr dθ = 2π(12 − 4 − 8/3) = 32π/3。",
      solutionSteps: ["r ≤ z ≤ 6 − r²；相交 r² + r − 6 = 0 ⟹ r = 2。", "V = ∫₀^{2π}∫₀² (6r − r³ − r²) dr dθ。", "∫₀² (6r − r³ − r²) dr = 12 − 4 − 8/3 = 16/3；乘 2π：32π/3。"],
      verify: { m: "double", u: "x", v: "y", a: -2, b: 2, c: "-\\sqrt{4-x^2}", d: "\\sqrt{4-x^2}", f: "\\int_{\\sqrt{x^2+y^2}}^{6-x^2-y^2} 1\\,dz" } },
    { id: "cg-9a3-007", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "E\\text{ 夾在拋物面 }z=x^2+y^2\\text{ 與 }z=8-x^2-y^2\\text{ 之間。求 }\\iiint_E\\sqrt{x^2+y^2}\\,dV",
      answer: "256*pi/15", timeLimit: 200,
      tags: ["cylindrical-bounds", "cylindrical-coordinates"],
      hints: ["柱座標下 √(x² + y²) = r，別忘了 dV 還要再乘一個 r。", "兩張拋物面交在哪個圓？那是 r 的上限。"],
      solution: "r² ≤ z ≤ 8 − r²，交在 r = 2。∭ = ∫₀^{2π}∫₀² r(8 − 2r²) r dr dθ = 2π(64/3 − 64/5) = 256π/15。",
      solutionSteps: ["柱座標：r² ≤ z ≤ 8 − r²，r² = 8 − r² ⟹ r = 2。", "被積函數 r 再乘 dV 的 r：∫₀^{2π}∫₀² r²(8 − 2r²) dr dθ。", "∫₀² (8r² − 2r⁴) dr = 64/3 − 64/5 = 128/15；乘 2π：256π/15。"],
      verify: { m: "double", u: "x", v: "y", a: -2, b: 2, c: "-\\sqrt{4-x^2}", d: "\\sqrt{4-x^2}", f: "\\int_{x^2+y^2}^{8-x^2-y^2} \\sqrt{x^2+y^2}\\,dz" } },
    { id: "cg-9a3-008", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{圓柱 }x^2+y^2\\le4\\text{ 被平面 }z=0\\text{ 與斜平面 }z=y+3\\text{ 截出一塊立體。求它的體積}",
      answer: "12*pi", timeLimit: 180,
      tags: ["cylindrical-bounds", "cylindrical-coordinates", "volume"],
      hints: ["柱座標下，上平面的高度 y + 3 要寫成 r 與 θ 的函數。", "對 θ 積一整圈時，含 sin θ 的那一項會怎樣？"],
      solution: "0 ≤ z ≤ 3 + r sin θ（在圓柱內恆正）。V = ∫₀^{2π}∫₀² (3 + r sin θ) r dr dθ；sin θ 那項積一圈是 0，剩 3 · 4π = 12π。",
      solutionSteps: ["上限 z = y + 3 = 3 + r sin θ；|y| ≤ 2，所以它在圓柱內都大於 0。", "V = ∫₀^{2π}∫₀² (3r + r² sin θ) dr dθ。", "∫₀^{2π} sin θ dθ = 0；剩 2π · 3 · (4/2) = 12π。"],
      verify: { m: "double", u: "x", v: "y", a: -2, b: 2, c: "-\\sqrt{4-x^2}", d: "\\sqrt{4-x^2}", f: "\\int_{0}^{y+3} 1\\,dz" } },
    { id: "cg-9a3-009", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{圓柱面 }x^2+y^2=6x\\text{ 寫成柱座標是哪一個方程式？}",
      answer: "r = 6 cos θ", answers: ["r = 6 cos θ", "r=6cosθ"], canonical: "r = 6 cos θ",
      distractors: ["r = 6 sin θ", "r = 3 cos θ", "r² = 6 cos θ"], timeLimit: 60,
      tags: ["cylindrical-surface-convert", "cylindrical-coordinates", "polar-coordinates"],
      hints: ["x² + y² = r²、x = r cos θ。", "代進去以後兩邊同除一個 r。"],
      solution: "r² = 6r cos θ，除以 r 得 r = 6 cos θ（r = 0 那一點也在這條曲線上，θ = π/2 時）。這是圓心 (3, 0)、半徑 3 的圓柱。",
      solutionSteps: ["x² + y² = r²，6x = 6r cos θ。", "r² = 6r cos θ ⟹ r = 6 cos θ。"],
      verify: { m: "choice", options: [
        ["r = 6 cos θ", "6\\cos(0.6)"], ["r = 6 sin θ", "6\\sin(0.6)"], ["r = 3 cos θ", "3\\cos(0.6)"], ["r² = 6 cos θ", "\\sqrt{6\\cos(0.6)}"]
      ].map(([say, R]) => ({ say, all: [{ v: { m: "value", f: `(${R}\\cos(0.6))^2+(${R}\\sin(0.6))^2-6(${R}\\cos(0.6))` }, eq: 0 }] })) } },
    { id: "cg-9a3-010", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{錐面 }z=\\sqrt{3x^2+3y^2}\\text{ 寫成柱座標是哪一個方程式？}",
      answer: "z = √3 r", answers: ["z = √3 r", "z=√3r"], canonical: "z = √3 r",
      distractors: ["z = 3r", "z = √3 r²", "z = 3r²"], timeLimit: 60,
      tags: ["cylindrical-surface-convert", "cylindrical-coordinates"],
      hints: ["先把根號裡的 3 提出來。", "√(x² + y²) 在柱座標下是什麼（r ≥ 0）？"],
      solution: "3x² + 3y² = 3r²，所以 z = √(3r²) = √3 r（r ≥ 0）。這是一個開口比 z = r 窄的錐。",
      solutionSteps: ["x² + y² = r²，根號內 = 3r²。", "z = √(3r²) = √3 · r（r ≥ 0）。"],
      verify: { m: "choice", options: [
        ["z = √3 r", "\\sqrt{3}(1.3)"], ["z = 3r", "3(1.3)"], ["z = √3 r²", "\\sqrt{3}(1.3)^2"], ["z = 3r²", "3(1.3)^2"]
      ].map(([say, Z]) => ({ say, all: [{ v: { m: "value", f: `${Z}-\\sqrt{3(1.3\\cos(0.6))^2+3(1.3\\sin(0.6))^2}` }, eq: 0 }] })) } },
    { id: "cg-9a3-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{實心圓柱 }x^2+y^2\\le9,\\ 0\\le z\\le2\\text{（公尺），密度 }\\rho=\\sqrt{x^2+y^2}\\text{（公斤／立方公尺）。求質量（公斤）}",
      answer: "36*pi", timeLimit: 120,
      tags: ["cylindrical-volume-element", "cylindrical-coordinates", "story-problem"],
      hints: ["密度在柱座標下就是 r。", "dV = r dz dr dθ，所以被積函數變成 r 乘 r。"],
      solution: "m = ∫₀^{2π}∫₀³∫₀² r · r dz dr dθ = 2π · 2 · 9 = 36π 公斤。",
      solutionSteps: ["ρ = r，dV = r dz dr dθ。", "m = ∫₀^{2π} dθ · ∫₀² dz · ∫₀³ r² dr = 2π · 2 · 9。", "m = 36π（公斤）。"],
      verify: { m: "double", u: "x", v: "y", a: -3, b: 3, c: "-\\sqrt{9-x^2}", d: "\\sqrt{9-x^2}", f: "\\int_{0}^{2} \\sqrt{x^2+y^2}\\,dz" } },
    { id: "cg-9a3-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{實心錐體在錐面 }z=\\sqrt{x^2+y^2}\\text{ 之上、平面 }z=2\\text{ 之下，密度 }1\\text{。求它對 } z \\text{ 軸的轉動慣量 } I_z=\\iiint(x^2+y^2)\\,dV",
      answer: "16*pi/5", timeLimit: 150,
      tags: ["cylindrical-volume-element", "cylindrical-coordinates"],
      hints: ["柱座標下 x² + y² = r²，dV 再多一個 r。", "z 從錐面 z = r 走到平面 z = 2；r 的範圍到錐面碰到 z = 2 為止。"],
      solution: "r ≤ z ≤ 2、0 ≤ r ≤ 2。I_z = ∫₀^{2π}∫₀² r³(2 − r) dr dθ = 2π(8 − 32/5) = 16π/5。",
      solutionSteps: ["柱座標：r ≤ z ≤ 2，0 ≤ r ≤ 2。", "被積函數 r² 乘 dV 的 r：∫₀² r³(2 − r) dr = 8 − 32/5 = 8/5。", "乘 2π：16π/5。"],
      verify: { m: "double", u: "x", v: "y", a: -2, b: 2, c: "-\\sqrt{4-x^2}", d: "\\sqrt{4-x^2}", f: "\\int_{\\sqrt{x^2+y^2}}^{2} (x^2+y^2)\\,dz" } },

    /* ── 9A.3 球座標：φ 的上下限不是 0、π ── */
    { id: "cg-9a3-013", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iiint_{x^2+y^2+z^2\\le 4,\\ z\\ge 0,\\ z^2\\ge 3x^2+3y^2} 1\\,dV",
      answer: "8*pi*(2-sqrt(3))/3", timeLimit: 180,
      tags: ["spherical-cone-bounds", "spherical-coordinates", "volume"],
      hints: ["z ≥ √3 · √(x² + y²) 是一個錐；在球座標下它是 φ 等於多少的錐？", "ρ 從 0 到 2，θ 一整圈，φ 從 0 到錐的角度。"],
      solution: "z = √3 r ⟺ cot φ = √3 ⟺ φ = π/6。V = ∫₀^{2π}∫₀^{π/6}∫₀² ρ² sin φ dρ dφ dθ = 2π(1 − √3/2)(8/3) = 8π(2 − √3)/3。",
      solutionSteps: ["錐 z = √3 r：tan φ = r/z = 1/√3，φ = π/6；區域是 0 ≤ φ ≤ π/6。", "∫₀² ρ² dρ = 8/3，∫₀^{π/6} sin φ dφ = 1 − √3/2。", "V = 2π · (8/3) · (1 − √3/2) = 8π(2 − √3)/3 ≈ 2.245。"],
      // 錐尖附近網格掃描的誤差約 1e-3，改用直角座標的累次積分（錐與球交在 x²+y²=1）
      verify: { m: "double", u: "x", v: "y", a: -1, b: 1, c: "-\\sqrt{1-x^2}", d: "\\sqrt{1-x^2}", f: "\\int_{\\sqrt{3x^2+3y^2}}^{\\sqrt{4-x^2-y^2}} 1\\,dz" } },
    { id: "cg-9a3-014", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iiint_{x^2+y^2+z^2\\le 2z,\\ 3z^2\\ge x^2+y^2} 1\\,dV",
      answer: "5*pi/4", timeLimit: 240,
      tags: ["spherical-cone-bounds", "spherical-coordinates", "volume"],
      hints: ["x² + y² + z² ≤ 2z 是一顆不在原點的球；在球座標下 ρ 的上限是 φ 的函數。", "另一個條件是錐，先找出它的 φ 角。"],
      solution: "球：ρ² ≤ 2ρ cos φ ⟹ ρ ≤ 2 cos φ；錐 r ≤ √3 z ⟹ φ ≤ π/3。V = 2π∫₀^{π/3} (8/3)cos³φ sin φ dφ = 2π · (2/3)(1 − 1/16) = 5π/4。",
      solutionSteps: ["球 x² + y² + (z − 1)² ≤ 1：ρ ≤ 2 cos φ。錐 tan φ ≤ √3：0 ≤ φ ≤ π/3。", "∫₀^{2cos φ} ρ² dρ = (8/3)cos³φ。", "∫₀^{π/3} (8/3)cos³φ sin φ dφ = (2/3)(1 − cos⁴(π/3)) = (2/3)(15/16) = 5/8。", "乘 2π：5π/4。"] },
    { id: "cg-9a3-015", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\iiint_{x^2+y^2+z^2\\le 4,\\ z\\ge 0,\\ z^2\\ge x^2+y^2} z\\,dV",
      answer: "2*pi", timeLimit: 200,
      tags: ["spherical-cone-bounds", "spherical-coordinates"],
      hints: ["z ≥ 0 且 z² ≥ x² + y²：這是錐 z = √(x² + y²) 的上方，φ 的範圍是多少？", "z = ρ cos φ，再乘上 ρ² sin φ。"],
      solution: "0 ≤ φ ≤ π/4、0 ≤ ρ ≤ 2。∭ = ∫₀^{2π}∫₀^{π/4}∫₀² ρ³ cos φ sin φ dρ dφ dθ = 2π · 4 · (1/4) = 2π。",
      solutionSteps: ["錐 z = r ⟺ φ = π/4；區域 0 ≤ φ ≤ π/4、0 ≤ ρ ≤ 2。", "被積函數 z dV = ρ³ cos φ sin φ dρ dφ dθ。", "∫₀² ρ³ dρ = 4，∫₀^{π/4} sin φ cos φ dφ = 1/4，乘 2π：2π。"],
      verify: { m: "double", u: "x", v: "y", a: "-\\sqrt{2}", b: "\\sqrt{2}", c: "-\\sqrt{2-x^2}", d: "\\sqrt{2-x^2}", f: "\\int_{\\sqrt{x^2+y^2}}^{\\sqrt{4-x^2-y^2}} z\\,dz" } },

    /* ── 9B.1 向量場：在一點求箭頭 ── */
    { id: "cg-9b1-001", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\mathbf F(x,y)=\\langle x^2-y,\\ 2xy\\rangle\\text{。求箭頭 }\\mathbf F(2,1)\\text{ 的長度}",
      answer: "5", timeLimit: 45,
      tags: ["vector-field-evaluate", "vector"],
      hints: ["先把 x = 2、y = 1 代進兩個分量。", "長度是分量平方和開根號。"],
      solution: "F(2,1) = ⟨4 − 1, 4⟩ = ⟨3, 4⟩，長度 √(9 + 16) = 5。",
      solutionSteps: ["F(2,1) = ⟨2² − 1, 2·2·1⟩ = ⟨3, 4⟩。", "|F(2,1)| = √(3² + 4²) = 5。"],
      verify: val("\\sqrt{(x^2-y)^2+(2xy)^2}", { x: 2, y: 1 }) },
    { id: "cg-9b1-002", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\mathbf F(x,y,z)=\\langle yz,\\ xz,\\ xy\\rangle\\text{。求 }|\\mathbf F(1,2,2)|",
      answer: "2*sqrt(6)", timeLimit: 45,
      tags: ["vector-field-evaluate", "vector"],
      hints: ["三個分量各代一次。", "長度 = √(P² + Q² + R²)。"],
      solution: "F(1,2,2) = ⟨4, 2, 2⟩，長度 √(16 + 4 + 4) = √24 = 2√6。",
      solutionSteps: ["F(1,2,2) = ⟨2·2, 1·2, 1·2⟩ = ⟨4, 2, 2⟩。", "|F| = √24 = 2√6。"],
      verify: val("\\sqrt{(yz)^2+(xz)^2+(xy)^2}", { x: 1, y: 2, z: 2 }) },
    { id: "cg-9b1-003", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\mathbf F(x,y)=\\left\\langle \\frac{-y}{x^2+y^2},\\ \\frac{x}{x^2+y^2}\\right\\rangle\\text{。求 }|\\mathbf F(3,4)|",
      answer: "1/5", timeLimit: 50,
      tags: ["vector-field-evaluate", "vector"],
      hints: ["分母 x² + y² 在 (3,4) 是多少？", "算出兩個分量再求長度。"],
      solution: "x² + y² = 25，F(3,4) = ⟨−4/25, 3/25⟩，長度 5/25 = 1/5（這個場的長度是 1/到原點的距離）。",
      solutionSteps: ["x² + y² = 9 + 16 = 25。", "F(3,4) = ⟨−4/25, 3/25⟩。", "|F| = √(16 + 9)/25 = 1/5。"],
      verify: val("\\sqrt{\\left(\\frac{-y}{x^2+y^2}\\right)^2+\\left(\\frac{x}{x^2+y^2}\\right)^2}", { x: 3, y: 4 }) },

    /* ── 9B.1 從場圖的描述認公式 ── */
    { id: "cg-9b1-004", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{某平面向量場的圖：每個箭頭都跟位置向量垂直、繞原點逆時針轉，而且離原點越遠箭頭越長。它是哪一個場？}",
      answer: "⟨−y, x⟩", answers: ["⟨−y, x⟩", "<-y,x>"], canonical: "⟨−y, x⟩",
      distractors: ["⟨y, −x⟩", "⟨x, y⟩", "⟨−y, x⟩ / (x² + y²)"], timeLimit: 75,
      tags: ["vector-field-sketch", "vector"],
      hints: ["跟位置向量 ⟨x, y⟩ 垂直：內積是 0。逆時針：在 (1, 0) 的箭頭應該朝上。", "最後看長度：除以 x² + y² 會讓遠處變長還是變短？"],
      solution: "⟨−y, x⟩·⟨x, y⟩ = 0，在 (1,0) 是 ⟨0, 1⟩ 朝上（逆時針），長度 = 到原點的距離，越遠越長。⟨y, −x⟩ 是順時針；⟨x, y⟩ 往外放射；除以 x² + y² 後長度是 1/距離，越遠越短。",
      solutionSteps: ["垂直：⟨−y, x⟩·⟨x, y⟩ = 0；⟨x, y⟩ 不垂直。", "方向：(1,0) 處 ⟨−y, x⟩ = ⟨0, 1⟩ 朝上，是逆時針；⟨y, −x⟩ 朝下是順時針。", "長度：|⟨−y, x⟩| = √(x² + y²) 越遠越長；除以 x² + y² 之後變成 1/√(x² + y²)，越遠越短。答案 ⟨−y, x⟩。"],
      verify: { m: "choice", options: [
        ["⟨−y, x⟩", "-y", "x"], ["⟨y, −x⟩", "y", "-x"], ["⟨x, y⟩", "x", "y"], ["⟨−y, x⟩ / (x² + y²)", "\\frac{-y}{x^2+y^2}", "\\frac{x}{x^2+y^2}"]
      ].map(([say, P, Q]) => {
        const p = { x: 0.6, y: 0.8 };
        const q = { x: 1.2, y: 1.6 };
        return { say, all: [
          { v: { m: "value", f: `(0.6)(${sub(P, p)})+(0.8)(${sub(Q, p)})` }, eq: 0 },
          { v: { m: "value", f: `(0.6)(${sub(Q, p)})-(0.8)(${sub(P, p)})` }, gt: 0 },
          { v: { m: "value", f: `\\sqrt{(${sub(P, q)})^2+(${sub(Q, q)})^2}-\\sqrt{(${sub(P, p)})^2+(${sub(Q, p)})^2}` }, gt: 0 }
        ] };
      }) } },
    { id: "cg-9b1-005", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{某平面向量場的圖：每一點的箭頭都一模一樣，長度相同、都指向右上方 }45^\\circ\\text{。它是哪一個場？}",
      answer: "⟨1, 1⟩", answers: ["⟨1, 1⟩", "<1,1>"], canonical: "⟨1, 1⟩",
      distractors: ["⟨x, x⟩", "⟨1, −1⟩", "⟨y, y⟩"], timeLimit: 60,
      tags: ["vector-field-sketch", "vector"],
      hints: ["「每一點都一樣」代表分量裡不能有 x、y。", "右上方 45°：兩個分量相等而且都是正的。"],
      solution: "均勻場的分量是常數；右上 45° 要 P = Q > 0，所以是 ⟨1, 1⟩。⟨x, x⟩、⟨y, y⟩ 的箭頭隨位置改變（甚至反向），⟨1, −1⟩ 指右下。",
      solutionSteps: ["處處相同 ⟹ 分量是常數，排除 ⟨x, x⟩、⟨y, y⟩。", "右上 45°：P = Q > 0；⟨1, −1⟩ 指右下。答案 ⟨1, 1⟩。"],
      verify: { m: "choice", options: [
        ["⟨1, 1⟩", "1", "1"], ["⟨x, x⟩", "x", "x"], ["⟨1, −1⟩", "1", "-1"], ["⟨y, y⟩", "y", "y"]
      ].map(([say, P, Q]) => {
        const p = { x: 0.6, y: 0.8 };
        const q = { x: -1.2, y: 0.5 };
        return { say, all: [
          { v: { m: "value", f: `(${sub(P, p)})-(${sub(P, q)})` }, eq: 0 },
          { v: { m: "value", f: `(${sub(Q, p)})-(${sub(Q, q)})` }, eq: 0 },
          { v: { m: "value", f: `(${sub(P, p)})-(${sub(Q, p)})` }, eq: 0 },
          { v: { m: "value", f: sub(P, p) }, gt: 0 }
        ] };
      }) } },
    { id: "cg-9b1-006", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{某平面向量場的圖：箭頭全都是水平的；}x\\text{ 軸上方的指向右、下方的指向左，離 }x\\text{ 軸越遠越長。它是哪一個場？}",
      answer: "⟨y, 0⟩", answers: ["⟨y, 0⟩", "<y,0>"], canonical: "⟨y, 0⟩",
      distractors: ["⟨0, y⟩", "⟨x, 0⟩", "⟨−y, 0⟩"], timeLimit: 75,
      tags: ["vector-field-sketch", "vector"],
      hints: ["水平箭頭：第二個分量是 0。", "第一個分量的正負要跟著「在 x 軸上方或下方」變，它該是哪個變數？"],
      solution: "水平 ⟹ Q = 0（排除 ⟨0, y⟩）。上方向右、下方向左 ⟹ P 跟 y 同號，而且 |P| 隨 |y| 變大：P = y。⟨−y, 0⟩ 方向剛好相反；⟨x, 0⟩ 看的是左右不是上下。",
      solutionSteps: ["水平：Q = 0，⟨0, y⟩ 是鉛直的。", "P 的正負由 y 決定、越遠越長：P = y。", "⟨−y, 0⟩ 上方指左；⟨x, 0⟩ 在 (0.5, −1) 仍指右。答案 ⟨y, 0⟩。"],
      verify: { m: "choice", options: [
        ["⟨y, 0⟩", "y", "0"], ["⟨0, y⟩", "0", "y"], ["⟨x, 0⟩", "x", "0"], ["⟨−y, 0⟩", "-y", "0"]
      ].map(([say, P, Q]) => {
        const up = { x: 0.5, y: 1 };
        const down = { x: 0.5, y: -1 };
        const far = { x: 0.5, y: 2 };
        return { say, all: [
          { v: { m: "value", f: sub(Q, up) }, eq: 0 },
          { v: { m: "value", f: sub(Q, down) }, eq: 0 },
          { v: { m: "value", f: sub(P, up) }, gt: 0 },
          { v: { m: "value", f: sub(P, down) }, lt: 0 },
          { v: { m: "value", f: `(${sub(P, far)})-(${sub(P, up)})` }, gt: 0 }
        ] };
      }) } },

    /* ── 9B.1 流線 ── */
    { id: "cg-9b1-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F(x,y)=\\langle x,\\ 2y\\rangle\\text{ 的一條流線經過點 }(1,3)\\text{。這條流線走到 }x=2\\text{ 時，}y\\text{ 是多少？}",
      answer: "12", timeLimit: 120,
      tags: ["vector-field-flow-line", "vector", "separable-ode"],
      hints: ["流線上 dx/dt = x、dy/dt = 2y；兩式相除得到 dy/dx。", "dy/dx = 2y/x 是可分離的方程，用 (1, 3) 定常數。"],
      solution: "dy/dx = 2y/x ⟹ ln|y| = 2 ln|x| + C ⟹ y = Cx²。過 (1,3)：C = 3，y = 3x²。x = 2 時 y = 12。",
      solutionSteps: ["流線：dx/dt = x，dy/dt = 2y ⟹ dy/dx = 2y/x。", "分離變數：dy/y = 2 dx/x ⟹ y = Cx²。", "過 (1, 3)：C = 3；x = 2 時 y = 3·4 = 12。"],
      verify: { m: "odeValue", f: "\\frac{2y}{x}", y0: [1, 3], at: 2 } },
    { id: "cg-9b1-008", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }\\mathbf r(t)=\\langle e^{2t},\\ 5e^{-t}\\rangle\\text{ 是向量場 }\\mathbf F=\\langle 2x,\\ c\\,y\\rangle\\text{ 的流線。求常數 }c",
      answer: "-1", timeLimit: 75,
      tags: ["vector-field-flow-line", "vector"],
      hints: ["流線的意思是 r′(t) = F(r(t))：速度等於那一點的箭頭。", "比較第二個分量：y′(t) 跟 y(t) 差幾倍？"],
      solution: "r′(t) = ⟨2e^{2t}, −5e^{−t}⟩ = ⟨2x, −y⟩。第一分量自動吻合，第二分量要 cy = −y，所以 c = −1。",
      solutionSteps: ["r′(t) = ⟨2e^{2t}, −5e^{−t}⟩。", "x = e^{2t} ⟹ 2e^{2t} = 2x ✓；y = 5e^{−t} ⟹ −5e^{−t} = −y。", "cy = −y ⟹ c = −1。"],
      verify: { m: "let", f: "\\frac{b}{a}", with: { b: { m: "deriv", vars: ["t"], f: "5e^{-t}", at: [0.3], wrt: "t" }, a: { m: "value", f: "5e^{-0.3}" } } } },

    /* ── 9B.1 梯度場：交叉偏導 ── */
    { id: "cg-9b1-009", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個平面向量場是某個函數 }f\\text{ 的梯度場？}",
      answer: "⟨2xy, x² + 1⟩", answers: ["⟨2xy, x² + 1⟩", "<2xy,x^2+1>"], canonical: "⟨2xy, x² + 1⟩",
      distractors: ["⟨xy, x²⟩", "⟨y², x²⟩", "⟨−y, x⟩"], timeLimit: 75,
      tags: ["gradient-field-cross-partials", "conservative-field", "partial-derivative"],
      hints: ["梯度場 ⟨P, Q⟩ 一定滿足 P_y = Q_x。", "每個選項算 P_y 與 Q_x，看哪一個處處相等。"],
      solution: "⟨2xy, x² + 1⟩：P_y = 2x = Q_x，而且 f = x²y + y。⟨xy, x²⟩：x ≠ 2x；⟨y², x²⟩：2y ≠ 2x；⟨−y, x⟩：−1 ≠ 1。",
      solutionSteps: ["⟨2xy, x² + 1⟩：P_y = 2x，Q_x = 2x ✓（f = x²y + y）。", "⟨xy, x²⟩：P_y = x、Q_x = 2x ✗；⟨y², x²⟩：2y vs 2x ✗。", "⟨−y, x⟩：P_y = −1、Q_x = 1 ✗。答案 ⟨2xy, x² + 1⟩。"],
      verify: { m: "choice", options: [
        { say: "⟨2xy, x² + 1⟩", all: curlZero(["2xy", "x^2+1"]) },
        { say: "⟨xy, x²⟩", all: curlZero(["xy", "x^2"]) },
        { say: "⟨y², x²⟩", all: curlZero(["y^2", "x^2"]) },
        { say: "⟨−y, x⟩", all: curlZero(["-y", "x"]) }
      ] } },
    { id: "cg-9b1-010", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\text{要讓 }\\mathbf F=\\langle 2x\\sin y+3y^2,\\ x^2\\cos y+a\\,xy\\rangle\\text{ 成為梯度場，常數 }a\\text{ 要是多少？}",
      answer: "6", timeLimit: 75,
      tags: ["gradient-field-cross-partials", "conservative-field", "partial-derivative"],
      hints: ["梯度場要 P_y = Q_x。", "兩邊的三角函數項會自己對上，剩下的項比係數。"],
      solution: "P_y = 2x cos y + 6y，Q_x = 2x cos y + a y。相等要 a = 6（此時 f = x² sin y + 3xy²）。",
      solutionSteps: ["P_y = 2x cos y + 6y。", "Q_x = 2x cos y + a y。", "6y = a y ⟹ a = 6。"],
      verify: { m: "conservativeParam", F: ["2x\\sin y+3y^2", "x^2\\cos y+axy"] } },
    { id: "cg-9b1-011", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle x^2-y,\\ x+y^2\\rangle\\text{。計算 }Q_x-P_y\\text{（它不是 }0\\text{，所以 }\\mathbf F\\text{ 不是梯度場）}",
      answer: "2", timeLimit: 50,
      tags: ["gradient-field-cross-partials", "conservative-field", "partial-derivative"],
      hints: ["P = x² − y，Q = x + y²。", "Q 對 x 偏微、P 對 y 偏微，再相減。"],
      solution: "Q_x = 1，P_y = −1，Q_x − P_y = 2 ≠ 0，所以沒有 f 的梯度是它。",
      solutionSteps: ["Q_x = ∂(x + y²)/∂x = 1。", "P_y = ∂(x² − y)/∂y = −1。", "Q_x − P_y = 2。"],
      verify: { m: "fieldOp", op: "curl", F: ["x^2-y", "x+y^2"], at: [0.7, 1.3] } },

    /* ── 9B.1 梯度場：從等高線讀箭頭 ── */
    { id: "cg-9b1-012", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(x,y)=x^2+y^2\\text{ 的等高線是以原點為圓心的同心圓，越外圈 }f\\text{ 越大。在點 }(1,1)\\text{，}\\nabla f\\text{ 的箭頭怎麼指？}",
      answer: "垂直等高線、背離原點", answers: ["垂直等高線、背離原點"], canonical: "垂直等高線、背離原點",
      distractors: ["垂直等高線、指向原點", "沿等高線、逆時針", "沿等高線、順時針"], timeLimit: 60,
      tags: ["gradient-field-level-curves", "gradient", "level-curve"],
      hints: ["梯度一定跟等高線垂直。", "梯度指向 f 增加最快的方向；這裡 f 往哪邊變大？"],
      solution: "∇f(1,1) = ⟨2, 2⟩：跟位置向量同方向，垂直於圓，指向外（f 變大的那側）。",
      solutionSteps: ["∇f = ⟨2x, 2y⟩，在 (1,1) 是 ⟨2, 2⟩。", "⟨2, 2⟩ 平行於 ⟨1, 1⟩，與圓的切線 ⟨−1, 1⟩ 垂直。", "方向朝外，f 變大的那側：垂直等高線、背離原點。"],
      verify: { m: "choice", options: [
        { say: "垂直等高線、背離原點", all: sameDir("x^2+y^2", [1, 1], 1, 1) },
        { say: "垂直等高線、指向原點", all: sameDir("x^2+y^2", [1, 1], -1, -1) },
        { say: "沿等高線、逆時針", all: sameDir("x^2+y^2", [1, 1], -1, 1) },
        { say: "沿等高線、順時針", all: sameDir("x^2+y^2", [1, 1], 1, -1) }
      ] } },
    { id: "cg-9b1-013", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{函數 }f\\text{ 的等高線是拋物線 }y=x^2+c \\text{（} c \\text{ 就是 } f \\text{ 在那條線上的值）。在點 }(1,0)\\text{，}\\nabla f\\text{ 跟哪個向量同方向？}",
      answer: "⟨−2, 1⟩", answers: ["⟨−2, 1⟩", "<-2,1>"], canonical: "⟨−2, 1⟩",
      distractors: ["⟨1, 2⟩", "⟨2, −1⟩", "⟨2, 1⟩"], timeLimit: 90,
      tags: ["gradient-field-level-curves", "gradient", "level-curve"],
      hints: ["先寫出 f：在 y = x² + c 上 f = c，所以 f(x, y) = ?", "梯度垂直於等高線，並指向 c 變大的那一側（拋物線往上移）。"],
      solution: "f = y − x²，∇f = ⟨−2x, 1⟩，在 (1,0) 是 ⟨−2, 1⟩。⟨1, 2⟩ 是拋物線的切線方向；⟨2, −1⟩ 雖然也垂直但指向 f 變小的那側。",
      solutionSteps: ["y = x² + c ⟹ c = y − x²，所以 f(x, y) = y − x²。", "∇f = ⟨−2x, 1⟩，在 (1, 0) 是 ⟨−2, 1⟩。", "檢查：切線 ⟨1, 2⟩ 與 ⟨−2, 1⟩ 垂直，而 ⟨−2, 1⟩ 往上，指向 c 變大。"],
      verify: { m: "choice", options: [
        { say: "⟨−2, 1⟩", all: sameDir("y-x^2", [1, 0], -2, 1) },
        { say: "⟨1, 2⟩", all: sameDir("y-x^2", [1, 0], 1, 2) },
        { say: "⟨2, −1⟩", all: sameDir("y-x^2", [1, 0], 2, -1) },
        { say: "⟨2, 1⟩", all: sameDir("y-x^2", [1, 0], 2, 1) }
      ] } },

    /* ── 9B.2 純量線積分：分段曲線 ── */
    { id: "cg-9b2-001", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_C x^2\\,ds\\text{，} C \\text{ 是頂點 }(0,0),(2,0),(2,1)\\text{ 的三角形邊界}",
      answer: "(20+4*sqrt(5))/3", timeLimit: 200,
      tags: ["line-integral-parametrize", "line-integral"],
      hints: ["三條邊各自參數化、各自算 ds，最後相加。", "斜邊從 (0,0) 到 (2,1) 的長度是 √5；純量線積分跟方向無關。"],
      solution: "底邊 (t,0)：∫₀² t² dt = 8/3；鉛直邊 (2,t)：∫₀¹ 4 dt = 4；斜邊 (2s, s)，ds = √5 ds：∫₀¹ 4s²√5 ds = 4√5/3。總和 (20 + 4√5)/3。",
      solutionSteps: ["底邊 r = (t, 0)，0 ≤ t ≤ 2，ds = dt：∫ t² dt = 8/3。", "右邊 r = (2, t)，0 ≤ t ≤ 1：∫ 4 dt = 4。", "斜邊 r = (2s, s)，|r′| = √5：∫₀¹ 4s² √5 ds = 4√5/3。", "合計 8/3 + 4 + 4√5/3 = (20 + 4√5)/3 ≈ 9.65。"],
      verify: { m: "lineIntegral", kind: "ds", f: "x^2", paths: [
        { x: "t", y: "0", from: 0, to: 2 },
        { x: "2", y: "t", from: 0, to: 1 },
        { x: "2-2t", y: "1-t", from: 0, to: 1 }
      ] } },
    { id: "cg-9b2-002", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_C (x^2+y)\\,ds\\text{，} C \\text{ 由上半圓 }x^2+y^2=4\\ (y\\ge0)\\text{ 與 }x\\text{ 軸上的線段 }[-2,2]\\text{ 組成的封閉曲線}",
      answer: "4*pi+40/3", timeLimit: 200,
      tags: ["line-integral-parametrize", "line-integral"],
      hints: ["半圓用 (2cos t, 2sin t)，0 ≤ t ≤ π，ds = 2 dt。", "線段上 y = 0、ds = dx。"],
      solution: "半圓：∫₀^π (4cos²t + 2sin t)·2 dt = 4π + 8；線段：∫₋₂² x² dx = 16/3。合計 4π + 40/3。",
      solutionSteps: ["半圓 r = (2cos t, 2sin t)，|r′| = 2：∫₀^π (8cos²t + 4sin t) dt = 4π + 8。", "線段 (x, 0)，−2 ≤ x ≤ 2：∫ x² dx = 16/3。", "合計 4π + 8 + 16/3 = 4π + 40/3。"],
      verify: { m: "lineIntegral", kind: "ds", f: "x^2+y", paths: [
        { x: "2\\cos t", y: "2\\sin t", from: 0, to: "\\pi" },
        { x: "t", y: "0", from: -2, to: 2 }
      ] } },

    /* ── 9B.2 功：方向與空間曲線 ── */
    { id: "cg-9b2-003", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_C y\\,dx+x^2\\,dy\\text{，} C \\text{ 是拋物線 }y=x^2\\text{ 從 }(2,4)\\text{ 走到 }(0,0)",
      answer: "-32/3", timeLimit: 150,
      tags: ["work-integral-orientation", "line-integral"],
      hints: ["用 x = t 參數化時，t 要從哪裡走到哪裡？", "也可以先算 (0,0) → (2,4)，再想反向會讓答案怎樣。"],
      solution: "x = t、y = t²，t 從 2 到 0：∫₂⁰ (t² + t²·2t) dt = −(8/3 + 8) = −32/3。",
      solutionSteps: ["x = t，y = t²，dy = 2t dt，t：2 → 0。", "被積式 t² dt + t² · 2t dt = (t² + 2t³) dt。", "∫₂⁰ (t² + 2t³) dt = −(8/3 + 8) = −32/3。"],
      verify: { m: "lineIntegral", kind: "work", F: ["y", "x^2"], path: { x: "2-t", y: "(2-t)^2", from: 0, to: 2 } } },
    { id: "cg-9b2-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\oint_C x\\,dy-2y\\,dx\\text{，} C \\text{ 是圓 }x^2+y^2=9\\text{，順時針繞一圈}",
      answer: "-27*pi", timeLimit: 150,
      tags: ["work-integral-orientation", "line-integral"],
      hints: ["(3cos t, 3sin t) 隨 t 增加是逆時針；順時針要怎麼辦？", "先照逆時針算，再處理方向。"],
      solution: "逆時針：∫₀^{2π} (9cos²t + 18sin²t) dt = 9π + 18π = 27π。順時針是反向，答案 −27π。",
      solutionSteps: ["逆時針參數 x = 3cos t、y = 3sin t：x dy − 2y dx = (9cos²t + 18sin²t) dt。", "∫₀^{2π} = 9π + 18π = 27π。", "題目要順時針，反向變號：−27π。"],
      verify: { m: "lineIntegral", kind: "work", F: ["-2y", "x"], path: { x: "3\\cos t", y: "-3\\sin t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b2-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle -y,\\ x,\\ z\\rangle\\text{ 沿螺旋線 }\\mathbf r(t)=\\langle 2\\cos t,\\ 2\\sin t,\\ 3t\\rangle,\\ 0\\le t\\le 2\\pi\\text{ 所作的功}",
      answer: "8*pi+18*pi^2", timeLimit: 150,
      tags: ["work-integral-parametrize", "line-integral", "work"],
      hints: ["功 = ∫ F(r(t)) · r′(t) dt。", "r′(t) = ⟨−2sin t, 2cos t, 3⟩；把 x、y、z 都換成 t。"],
      solution: "F·r′ = (−2sin t)(−2sin t) + (2cos t)(2cos t) + 3t·3 = 4 + 9t。∫₀^{2π} (4 + 9t) dt = 8π + 18π²。",
      solutionSteps: ["F(r(t)) = ⟨−2sin t, 2cos t, 3t⟩，r′ = ⟨−2sin t, 2cos t, 3⟩。", "內積 = 4sin²t + 4cos²t + 9t = 4 + 9t。", "∫₀^{2π} (4 + 9t) dt = 8π + 18π²。"],
      verify: { m: "lineIntegral", kind: "work", F: ["-y", "x", "z"], path: { x: "2\\cos t", y: "2\\sin t", z: "3t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b2-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_C y\\,dx+z\\,dy+x\\,dz\\text{，} C:\\ \\mathbf r(t)=\\langle \\cos t,\\ \\sin t,\\ t\\rangle,\\ 0\\le t\\le 2\\pi",
      answer: "-pi", timeLimit: 150,
      tags: ["work-integral-parametrize", "line-integral"],
      hints: ["dx = −sin t dt、dy = cos t dt、dz = dt。", "會出現 ∫ t cos t dt：分部積分，算完再代 0 與 2π。"],
      solution: "被積式 = −sin²t + t cos t + cos t。∫₀^{2π} −sin²t dt = −π，∫ t cos t dt = [t sin t + cos t]₀^{2π} = 0，∫ cos t = 0。答案 −π。",
      solutionSteps: ["y dx = −sin²t dt，z dy = t cos t dt，x dz = cos t dt。", "∫₀^{2π} −sin²t dt = −π。", "∫₀^{2π} t cos t dt = [t sin t + cos t]₀^{2π} = 0；∫ cos t dt = 0。答案 −π。"],
      verify: { m: "lineIntegral", kind: "work", F: ["y", "z", "x"], path: { x: "\\cos t", y: "\\sin t", z: "t", from: 0, to: "2\\pi" } } },

    /* ── 9B.2 保守場：區域有洞 ── */
    { id: "cg-9b2-007", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一個平面區域是單連通的（區域裡任何封閉曲線都能在區域裡縮成一點）？}",
      answer: "上半平面 y > 0", answers: ["上半平面 y > 0"], canonical: "上半平面 y > 0",
      distractors: ["環形 1 < x² + y² < 4", "平面去掉原點", "圓盤外 x² + y² > 1"], timeLimit: 75,
      tags: ["conservative-simply-connected", "conservative-field"],
      hints: ["找找看：區域裡有沒有一圈繞著「洞」的曲線？", "有洞的話，繞洞的那一圈縮不到一點。"],
      solution: "環形、去掉原點的平面、圓盤外面都有洞，繞洞一圈的曲線縮不掉（角度場 ⟨−y, x⟩/(x² + y²) 沿它的功是 2π ≠ 0 就是證據）。上半平面沒有洞，是單連通。",
      solutionSteps: ["環形：圓 r = 1.5 在區域裡、繞著內洞。", "去掉原點：單位圓繞著原點；圓盤外：圓 r = 2 繞著單位圓盤。", "上半平面是凸的，任何封閉曲線都能縮成一點。答案：上半平面 y > 0。"],
      verify: { m: "choice", options: [
        { say: "上半平面 y > 0", unknown: "凸區域單連通是定理；其他選項各有繞洞的圈被數值推翻" },
        { say: "環形 1 < x² + y² < 4", all: [{ v: loop(1.5), eq: 0 }] },
        { say: "平面去掉原點", all: [{ v: loop(1), eq: 0 }] },
        { say: "圓盤外 x² + y² > 1", all: [{ v: loop(2), eq: 0 }] }
      ] } },
    { id: "cg-9b2-008", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\mathbf F=\\left\\langle \\frac{-y}{x^2+y^2}+2x,\\ \\frac{x}{x^2+y^2}+2y\\right\\rangle\\text{ 在原點以外 }P_y=Q_x\\text{。求它沿橢圓 }\\frac{x^2}{9}+\\frac{y^2}{4}=1\\text{ 逆時針一圈的功}",
      answer: "2*pi", timeLimit: 200,
      tags: ["conservative-simply-connected", "conservative-field", "line-integral"],
      hints: ["P_y = Q_x 只在單連通區域上保證功是 0；橢圓圍住了哪個「洞」？", "把場拆成 ⟨2x, 2y⟩（梯度場）加上繞原點的角度場，各自算。"],
      solution: "⟨2x, 2y⟩ = ∇(x² + y²)，繞一圈功 0。角度場 ⟨−y, x⟩/(x² + y²) 沿任何逆時針繞原點一圈的曲線功都是 2π（可以把橢圓縮成單位圓來算）。答案 2π。",
      solutionSteps: ["拆開：F = ∇(x² + y²) + ⟨−y, x⟩/(x² + y²)。", "梯度場部分沿封閉曲線：0。", "角度場：橢圓與單位圓之間沒有奇點，功相同；單位圓上 ∫₀^{2π} (sin²t + cos²t) dt = 2π。答案 2π。"],
      verify: { m: "lineIntegral", kind: "work", F: ["\\frac{-y}{x^2+y^2}+2x", "\\frac{x}{x^2+y^2}+2y"], path: { x: "3\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b2-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F=\\left\\langle \\frac{-y}{x^2+y^2},\\ \\frac{x}{x^2+y^2}\\right\\rangle\\text{。求它沿圓 }(x-3)^2+y^2=1\\text{ 逆時針一圈的功}",
      answer: "0", timeLimit: 150,
      tags: ["conservative-simply-connected", "conservative-field", "line-integral"],
      hints: ["這個場在原點有洞；這個圓有沒有圍住原點？", "能不能找一個不含原點、又包住這個圓的單連通區域？"],
      solution: "圓在 2 ≤ x ≤ 4 之間，沒圍住原點。在右半平面 x > 0（單連通）上 P_y = Q_x，F 是 ∇(arctan(y/x))，封閉曲線的功是 0。",
      solutionSteps: ["P_y = Q_x = (y² − x²)/(x² + y²)²（原點以外）。", "圓整個落在右半平面 x > 0，那是單連通區域，在那裡 F = ∇ arctan(y/x)。", "梯度場繞封閉曲線一圈：0。"],
      verify: { m: "lineIntegral", kind: "work", F: ANGLE, path: { x: "3+\\cos t", y: "\\sin t", from: 0, to: "2\\pi" } } },

    /* ── 9B.2 位勢函數 ── */
    { id: "cg-9b2-010", topic: "integrals", rank: 3, answerKind: "expression",
      prompt: "\\mathbf F=\\langle e^{y}+2x,\\ x e^{y}-\\sin y\\rangle\\text{ 是保守場。求位勢函數 }f\\text{（取 }f(0,0)=0\\text{）}",
      answer: "x*e^y+x^2+cos(y)-1", variables: ["x", "y"], timeLimit: 150,
      tags: ["potential-integrate-match", "potential", "conservative-field"],
      hints: ["先對 x 積 P，常數換成 g(y)。", "對 y 偏微後跟 Q 比對，找出 g(y)；最後用 f(0,0) = 0 定常數。"],
      solution: "f = ∫(e^y + 2x)dx = x e^y + x² + g(y)；f_y = x e^y + g′(y) = x e^y − sin y ⟹ g = cos y + C。f(0,0) = 1 + C = 0 ⟹ C = −1。f = x e^y + x² + cos y − 1。",
      solutionSteps: ["對 x 積：f = x e^y + x² + g(y)。", "f_y = x e^y + g′(y) = x e^y − sin y ⟹ g(y) = cos y + C。", "f(0,0) = 1 + C = 0 ⟹ C = −1：f = x e^y + x² + cos y − 1。"],
      verify: potentialVerify(["x", "y"], ["e^{y}+2x", "xe^{y}-\\sin y"], { x: 0, y: 0 }, [{ x: 0.4, y: 1.3 }, { x: -1.1, y: 0.6 }]) },
    { id: "cg-9b2-011", topic: "integrals", rank: 3, answerKind: "expression",
      prompt: "\\mathbf F=\\langle y\\cos(xy)+3,\\ x\\cos(xy)+2y\\rangle\\text{ 是保守場。求位勢函數 }f\\text{（取 }f(0,0)=0\\text{）}",
      answer: "sin(x*y)+3*x+y^2", variables: ["x", "y"], timeLimit: 150,
      tags: ["potential-integrate-match", "potential", "conservative-field"],
      hints: ["y cos(xy) 對 x 積分：令 u = xy。", "剩下的 y 項由 Q 比對出來。"],
      solution: "f = sin(xy) + 3x + g(y)；f_y = x cos(xy) + g′ = x cos(xy) + 2y ⟹ g = y² + C，f(0,0) = 0 給 C = 0。f = sin(xy) + 3x + y²。",
      solutionSteps: ["∫(y cos(xy) + 3) dx = sin(xy) + 3x + g(y)。", "f_y = x cos(xy) + g′(y)，跟 Q 比 ⟹ g′ = 2y，g = y² + C。", "f(0,0) = C = 0：f = sin(xy) + 3x + y²。"],
      verify: potentialVerify(["x", "y"], ["y\\cos(xy)+3", "x\\cos(xy)+2y"], { x: 0, y: 0 }, [{ x: 0.4, y: 1.3 }, { x: -1.1, y: 0.6 }]) },
    { id: "cg-9b2-012", topic: "integrals", rank: 3, answerKind: "expression",
      prompt: "\\mathbf F=\\langle 2x\\cos y,\\ -x^2\\sin y+3e^{3y}\\rangle\\text{ 是保守場。求位勢函數 }f\\text{（取 }f(0,0)=0\\text{）}",
      answer: "x^2*cos(y)+e^(3*y)-1", variables: ["x", "y"], timeLimit: 150,
      tags: ["potential-integrate-match", "potential", "conservative-field"],
      hints: ["對 x 積分時 cos y 當常數。", "比對 f_y 與 Q 之後剩下的項只跟 y 有關，再積一次；別忘了 f(0,0) = 0。"],
      solution: "f = x² cos y + g(y)；f_y = −x² sin y + g′ = Q ⟹ g′ = 3e^{3y}，g = e^{3y} + C。f(0,0) = 1 + C = 0 ⟹ C = −1。f = x² cos y + e^{3y} − 1。",
      solutionSteps: ["∫ 2x cos y dx = x² cos y + g(y)。", "f_y = −x² sin y + g′(y) ⟹ g′(y) = 3e^{3y}，g = e^{3y} + C。", "f(0,0) = 1 + C = 0：f = x² cos y + e^{3y} − 1。"],
      verify: potentialVerify(["x", "y"], ["2x\\cos y", "-x^2\\sin y+3e^{3y}"], { x: 0, y: 0 }, [{ x: 0.4, y: 1.3 }, { x: -1.1, y: 0.6 }]) },
    { id: "cg-9b2-013", topic: "integrals", rank: 4, answerKind: "expression",
      prompt: "\\mathbf F=\\langle 2xy,\\ x^2+\\sin z,\\ y\\cos z+(1+z)e^{z}\\rangle\\text{ 是保守場。求位勢函數 }f\\text{（取 }f(0,0,0)=0\\text{）}",
      answer: "x^2*y+y*sin(z)+z*e^z", variables: ["x", "y", "z"], timeLimit: 200,
      tags: ["potential-3d", "potential", "conservative-field"],
      hints: ["對 x 積 P，「常數」是 g(y, z)。", "先用 Q 找出 g 對 y 的部分，剩下的 h(z) 再用 R 找；(1+z)e^z 是誰的導數？"],
      solution: "f = x²y + g(y,z)；f_y = x² + g_y = x² + sin z ⟹ g = y sin z + h(z)；f_z = y cos z + h′ = R ⟹ h′ = (1+z)e^z，h = z e^z + C，C = 0。",
      solutionSteps: ["對 x 積：f = x²y + g(y, z)。", "f_y = x² + g_y = x² + sin z ⟹ g = y sin z + h(z)。", "f_z = y cos z + h′(z) = y cos z + (1+z)e^z ⟹ h = z e^z + C。", "f(0,0,0) = C = 0：f = x²y + y sin z + z e^z。"],
      verify: potentialVerify(["x", "y", "z"], ["2xy", "x^2+\\sin z", "y\\cos z+(1+z)e^{z}"], { x: 0, y: 0, z: 0 }, [{ x: 0.4, y: 1.3, z: -0.7 }, { x: -1.1, y: 0.6, z: 0.9 }]) },
    { id: "cg-9b2-014", topic: "integrals", rank: 4, answerKind: "expression",
      prompt: "\\mathbf F=\\langle yz+e^{x},\\ xz+2yz,\\ xy+y^2\\rangle\\text{ 是保守場。求位勢函數 }f\\text{（取 }f(0,0,0)=0\\text{）}",
      answer: "x*y*z+e^x+y^2*z-1", variables: ["x", "y", "z"], timeLimit: 200,
      tags: ["potential-3d", "potential", "conservative-field"],
      hints: ["對 x 積：xyz + eˣ + g(y, z)。", "用 Q 找 g，再用 R 檢查還缺不缺只跟 z 有關的項；最後用 f(0,0,0) = 0。"],
      solution: "f = xyz + eˣ + g(y,z)；f_y = xz + g_y = xz + 2yz ⟹ g = y²z + h(z)；f_z = xy + y² + h′ = R ⟹ h′ = 0。f(0,0,0) = 1 + C = 0 ⟹ C = −1。",
      solutionSteps: ["對 x 積：f = xyz + eˣ + g(y, z)。", "f_y = xz + g_y = xz + 2yz ⟹ g = y²z + h(z)。", "f_z = xy + y² + h′(z) = xy + y² ⟹ h 是常數 C。", "f(0,0,0) = 1 + C = 0：f = xyz + eˣ + y²z − 1。"],
      verify: potentialVerify(["x", "y", "z"], ["yz+e^{x}", "xz+2yz", "xy+y^2"], { x: 0, y: 0, z: 0 }, [{ x: 0.4, y: 1.3, z: -0.7 }, { x: -1.1, y: 0.6, z: 0.9 }]) },

    /* ── 9B.2 路徑無關：比兩條路／封閉曲線 ── */
    { id: "cg-9b2-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle 2y,\\ x\\rangle\\text{。}W_1\\text{ 是沿 }y=x\\text{、}W_2\\text{ 是沿 }y=x^2\\text{，都從 }(0,0)\\text{ 到 }(1,1)\\text{ 的功。求 }W_1-W_2",
      answer: "1/6", timeLimit: 150,
      tags: ["path-independence-detect", "line-integral", "conservative-field"],
      hints: ["兩條路各參數化成 x = t，各算一次功。", "差不是 0 代表什麼？"],
      solution: "W₁ = ∫₀¹ (2t + t) dt = 3/2；W₂ = ∫₀¹ (2t² + t·2t) dt = 4/3。差 1/6 ≠ 0，所以 F 不是保守場（也可看 P_y = 2 ≠ 1 = Q_x）。",
      solutionSteps: ["y = x：x = y = t，F·r′ = 2t + t = 3t，W₁ = 3/2。", "y = x²：r = (t, t²)，F·r′ = 2t² + t·2t = 4t²，W₂ = 4/3。", "W₁ − W₂ = 1/6 ≠ 0：功跟路徑有關，F 不保守。"],
      verify: { m: "let", f: "a-b", with: {
        a: { m: "lineIntegral", kind: "work", F: ["2y", "x"], path: { x: "t", y: "t", from: 0, to: 1 } },
        b: { m: "lineIntegral", kind: "work", F: ["2y", "x"], path: { x: "t", y: "t^2", from: 0, to: 1 } }
      } } },
    { id: "cg-9b2-016", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\mathbf F=\\langle a\\,xy,\\ x^2+1\\rangle\\text{。要讓沿 }y=x\\text{ 與沿 }y=x^2\\text{（都從 }(0,0)\\text{ 到 }(1,1)\\text{）的功相等，常數 }a\\text{ 是多少？}",
      answer: "2", timeLimit: 180,
      tags: ["path-independence-detect", "line-integral", "conservative-field"],
      hints: ["兩條路的功都寫成 a 的一次式。", "令兩者相等解 a；得到的 a 讓 P_y = Q_x 嗎？"],
      solution: "沿 y = x：∫₀¹ (a t² + t² + 1) dt = (a+1)/3 + 1；沿 y = x²：∫₀¹ (a t³ + 2t³ + 2t) dt = a/4 + 3/2。相等 ⟹ a/12 = 1/6，a = 2；此時 P_y = 2x = Q_x，F = ∇(x²y + y)。",
      solutionSteps: ["y = x：W₁ = ∫₀¹ (a + 1)t² + 1 dt = (a + 1)/3 + 1。", "y = x²：W₂ = ∫₀¹ (a t³ + (t² + 1)·2t) dt = a/4 + 3/2。", "W₁ = W₂ ⟹ a/3 − a/4 = 1/6 ⟹ a = 2（剛好讓 P_y = Q_x）。"],
      verify: { m: "let", f: "\\frac{-(p-q)}{(r-s)-(p-q)}", with: {
        p: { m: "lineIntegral", kind: "work", F: ["0", "x^2+1"], path: { x: "t", y: "t", from: 0, to: 1 } },
        q: { m: "lineIntegral", kind: "work", F: ["0", "x^2+1"], path: { x: "t", y: "t^2", from: 0, to: 1 } },
        r: { m: "lineIntegral", kind: "work", F: ["xy", "x^2+1"], path: { x: "t", y: "t", from: 0, to: 1 } },
        s: { m: "lineIntegral", kind: "work", F: ["xy", "x^2+1"], path: { x: "t", y: "t^2", from: 0, to: 1 } }
      } } },
    { id: "cg-9b2-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\oint_C (2xe^{y}+y\\cos x)\\,dx+(x^2e^{y}+\\sin x)\\,dy\\text{，} C:\\ \\mathbf r(t)=\\langle\\cos^3 t,\\ \\sin^3 t\\rangle,\\ 0\\le t\\le 2\\pi",
      answer: "0", timeLimit: 120,
      tags: ["path-independence-closed-loop", "line-integral", "conservative-field"],
      hints: ["別急著代參數式。先檢查 P_y 與 Q_x。", "如果它是某個 f 的梯度，沿封閉曲線的功是多少？"],
      solution: "P_y = 2xe^y + cos x = Q_x，而且在整個平面都成立；F = ∇(x²e^y + y sin x)。曲線封閉，起點等於終點，功 = 0。",
      solutionSteps: ["P_y = 2xe^y + cos x，Q_x = 2xe^y + cos x，處處相等。", "位勢 f = x²e^y + y sin x。", "封閉曲線：f(終點) − f(起點) = 0。"],
      verify: { m: "lineIntegral", kind: "work", F: ["2xe^{y}+y\\cos x", "x^2e^{y}+\\sin x"], path: { x: "\\cos^3 t", y: "\\sin^3 t", from: 0, to: "2\\pi" } } },
    { id: "cg-9b2-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\oint_C (e^{x}\\sin y-y)\\,dx+(e^{x}\\cos y+x)\\,dy\\text{，} C \\text{ 是圓 }x^2+y^2=4\\text{ 逆時針一圈}",
      answer: "8*pi", timeLimit: 150,
      tags: ["path-independence-closed-loop", "line-integral", "conservative-field"],
      hints: ["把場拆成兩塊：一塊是 eˣ sin y 的梯度，另一塊是 ⟨−y, x⟩。", "梯度那塊繞一圈是 0；⟨−y, x⟩ 在半徑 2 的圓上直接參數化。"],
      solution: "F = ∇(eˣ sin y) + ⟨−y, x⟩。梯度部分繞一圈 0；⟨−y, x⟩ 沿 (2cos t, 2sin t)：∫₀^{2π} (4sin²t + 4cos²t) dt = 8π。",
      solutionSteps: ["⟨eˣ sin y, eˣ cos y⟩ = ∇(eˣ sin y)，封閉曲線上功為 0。", "剩 ∮ −y dx + x dy，r = (2cos t, 2sin t)。", "被積式 4sin²t + 4cos²t = 4，∫₀^{2π} 4 dt = 8π。"],
      verify: { m: "lineIntegral", kind: "work", F: ["e^{x}\\sin y-y", "e^{x}\\cos y+x"], path: { x: "2\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), tabLimit: 1, ...problem })));
})();
