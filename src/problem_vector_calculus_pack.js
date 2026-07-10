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

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
