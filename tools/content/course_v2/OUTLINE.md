# 新版課程大綱（v1，含穩定 id）

每一行：`課號 | id | 課名 | 要點`。課號只是顯示用，資料關聯一律用 id。
id 定下來就不改；插課、移課只改 order。寫課時引用其他課（先修、下一課、正文提到）一律用這裡的 id。

## Stage 0 預備（Before Calculus）

### 0A 函數
- 0.1 | function-intro | 函數是什麼 | 輸入輸出、f(x)、一個輸入只對一個輸出、鉛直線測試
- 0.2 | domain-range | 定義域與值域 | 分母不為 0、偶次根號、對數、複合條件
- 0.3 | piecewise-function | 分段函數 | 分段寫法、左右區間、端點
- 0.4 | graph-features | 函數圖形的基本資訊 | 截距、正負、單調、有界、對稱

### 0B 函數操作
- 0.5 | function-arithmetic | 函數加減乘除 | (f+g)(x)、(fg)(x)、f/g
- 0.6 | function-composition | 函數合成 | (f∘g)(x)、外面是誰裡面是誰（接連鎖律）
- 0.7 | inverse-function | 反函數 | 一對一、水平線測試、f⁻¹、定義域值域互換

### 0C 基本函數家族
- 0.8 | polynomial-rational | 多項式與有理函數 |
- 0.9 | exp-log | 指數與對數 | 指數律、對數律、eˣ、ln x
- 0.10 | trig-functions | 三角函數 | 弧度、sin/cos/tan、單位圓、週期
- 0.11 | trig-identities | 三角恆等式 | sin²+cos²=1、倍角、半角
- 0.12 | inverse-trig | 反三角函數 | arcsin、arccos、arctan

## Stage 1 極限與連續（Limits & Continuity）

### 1A 極限的概念
- 1.1 | limit-intro | 極限到底在問什麼 | 完全直觀（樣稿已寫）
- 1.2 | limit-one-sided | 左極限與右極限 |
- 1.3 | limit-existence | 極限存在的條件 | 左右相等
- 1.4 | limit-from-graph-table | 從表格與圖形讀極限 | 洞、跳躍、垂直漸近線

### 1B 代數極限
- 1.5 | limit-laws-direct | 直接代入與極限定律 |
- 1.6 | limit-factor | 0/0：因式分解 | (x²−a²)/(x−a)
- 1.7 | limit-rationalize | 0/0：有理化 | （樣稿已寫）
- 1.8 | limit-algebra-other | 其他代數化簡 | 通分、複合式

### 1C 標準極限
- 1.9 | limit-trig-standard | 三角標準極限 | sin x/x → 1、(1−cos x)/x²
- 1.10 | limit-exp-log-standard | 指數與對數標準極限 | (eˣ−1)/x、ln(1+x)/x
- 1.11 | limit-e-type | e 型極限 | (1+a/n)ⁿ

### 1D 無窮與夾擠
- 1.12 | limit-at-infinity | x → ∞ | 有理函數、最高次項、水平漸近線
- 1.13 | infinite-limits | 無窮極限與垂直漸近線 |
- 1.14 | squeeze-theorem | 夾擠定理 | x² sin(1/x)

### 1E 連續
- 1.15 | continuity-definition | 連續的定義 | lim f = f(a)
- 1.16 | discontinuity-types | 不連續的種類 | 可去、跳躍、無窮、振盪
- 1.17 | intermediate-value-theorem | 中間值定理 | 存在性、找根

## Stage 2 導數（Differentiation）

### 2A 導數從哪裡來
- 2.1 | average-rate | 平均變化率 |
- 2.2 | secant-to-tangent | 割線到切線 |
- 2.3 | derivative-definition | 導數定義 | f′(a) = lim (f(a+h)−f(a))/h
- 2.4 | derivative-from-definition | 用定義算導數 | x²、x³、1/x、√x

### 2B 基本微分法則
- 2.5 | derivative-power-rules | 常數、冪次、線性 |
- 2.6 | derivative-trig | 三角函數微分 |
- 2.7 | derivative-exp | 指數函數微分 |
- 2.8 | derivative-log | 對數函數微分 |

### 2C 複合運算
- 2.9 | product-rule | 乘法法則 |
- 2.10 | quotient-rule | 除法法則 |
- 2.11 | chain-rule | 連鎖律 I：兩層 |
- 2.12 | chain-rule-nested | 連鎖律 II：多層 | e^{sin(x²)}

### 2D 更進一步
- 2.13 | implicit-differentiation | 隱函數微分 | x² + y² = 1
- 2.14 | logarithmic-differentiation | 對數微分 | xˣ、x^{sin x}
- 2.15 | inverse-trig-derivative | 反函數與反三角函數微分 |
- 2.16 | higher-derivatives | 高階導數 |

## Stage 3 導數應用（Applications of Derivatives）

### 3A 函數形狀
- 3.1 | critical-points | 臨界點 |
- 3.2 | increasing-decreasing | 增減區間 |
- 3.3 | first-derivative-test | 一階導數判別 |
- 3.4 | second-derivative | 二階導數 |
- 3.5 | concavity | 凹向上／凹向下 |
- 3.6 | inflection-points | 反曲點 |
- 3.7 | second-derivative-test | 二階導數判別 |

### 3B 完整作圖
- 3.8 | asymptotes | 漸近線 | 垂直、水平、斜漸近線
- 3.9 | curve-sketching-1 | 函數完整分析 I | 定義域、截距、漸近線、極值
- 3.10 | curve-sketching-2 | 函數完整分析 II | 凹性、反曲點、自己畫

### 3C 最佳化
- 3.11 | optimization-basics | 最佳化基本模型 |
- 3.12 | optimization-geometry | 幾何最佳化 | 矩形、盒子、圓柱
- 3.13 | optimization-distance | 距離與工程最佳化 |

### 3D 變化率與近似
- 3.14 | related-rates | 相關變率 |
- 3.15 | linear-approximation | 線性近似 | f(a+h) ≈ f(a) + f′(a)h
- 3.16 | differentials-error | 微分與誤差估計 |

### 3E 理論工具
- 3.17 | rolle-theorem | Rolle 定理 |
- 3.18 | mean-value-theorem | 均值定理 |
- 3.19 | lhopital | L'Hôpital 法則 | （樣稿已寫）
- 3.20 | indeterminate-other | 其他不定型 | 0·∞、∞−∞、1^∞、0⁰、∞⁰

## Stage 4 積分（Integration）

### 4A 反導函數與定積分
- 4.1 | antiderivative | 反導函數 |
- 4.2 | indefinite-integral | 不定積分 |
- 4.3 | integral-table | 基本積分表 |
- 4.4 | definite-signed-area | 定積分與有號面積 | 不要直接說成「面積」，負值要講清楚
- 4.5 | integral-properties | 積分性質 |

### 4B Riemann 與基本定理
- 4.6 | riemann-sum-intuition | Riemann 和直觀 |
- 4.7 | riemann-sum-notation | 用和式寫定積分 | Σ f(xᵢ)Δx
- 4.8 | riemann-sum-compute | 用 Riemann 和算簡單積分 |
- 4.9 | ftc-part1 | 微積分基本定理 I | d/dx ∫ₐˣ f = f(x)
- 4.10 | ftc-part2 | 微積分基本定理 II | ∫ₐᵇ f = F(b) − F(a)

### 4C 換元
- 4.11 | reverse-chain | 反連鎖律 |
- 4.12 | u-sub-basic | 換元：基礎 | （樣稿已寫）
- 4.13 | u-sub-recognize | 換元：辨識 |
- 4.14 | u-sub-definite | 定積分換元 |
- 4.15 | u-sub-nonobvious | 非顯然的換元 |

### 4D 分部積分
- 4.16 | integration-by-parts | 分部積分推導 | ∫u dv = uv − ∫v du
- 4.17 | ibp-poly-exp | 多項式 × 指數 |
- 4.18 | ibp-poly-trig | 多項式 × 三角 |
- 4.19 | ibp-log-invtrig | ln x、反三角函數 |
- 4.20 | ibp-cyclic | 重複分部與循環積分 |

### 4E 有理函數
- 4.21 | partial-fractions-linear | 部分分式 I：相異一次因式 |
- 4.22 | partial-fractions-repeated | 部分分式 II：重複因式 |
- 4.23 | partial-fractions-quadratic | 部分分式 III：不可約二次式 |

### 4F 三角積分
- 4.24 | trig-integral-sin-cos | sinᵐ x cosⁿ x |
- 4.25 | trig-integral-tan-sec | tanᵐ x secⁿ x |
- 4.26 | trig-identity-integrals | 用三角恆等式積分 |

### 4G 三角代換
- 4.27 | trig-sub-a2-minus-x2 | √(a² − x²) |
- 4.28 | trig-sub-x2-plus-a2 | √(x² + a²) |
- 4.29 | trig-sub-x2-minus-a2 | √(x² − a²) |
- 4.30 | integration-strategy | 綜合積分：到底要用哪招？ | 題目可以只問「用哪個方法」

## Stage 5 積分應用（Applications of Integration）

### 5A 面積
- 5.1 | area-under-curve | 曲線與 x 軸圍成的面積 |
- 5.2 | area-between-curves | 兩曲線間面積 |
- 5.3 | area-dy | 對 y 積分 |

### 5B 體積
- 5.4 | volume-disk | 圓盤法 |
- 5.5 | volume-washer | 墊圈法 |
- 5.6 | volume-shell | 圓殼法 |
- 5.7 | volume-choose-method | 選墊圈還是圓殼 |

### 5C 幾何量
- 5.8 | arc-length | 弧長 |
- 5.9 | surface-area-revolution | 旋轉曲面面積 |

### 5D 平均與物理
- 5.10 | average-value | 平均值 |
- 5.11 | work | 功 |
- 5.12 | spring-work | 彈簧做功 |
- 5.13 | fluid-force | 液體壓力 |
- 5.14 | center-of-mass | 質心與形心 |

## Stage 6 數列與級數（Sequences & Series）

### 6A 數列
- 6.1 | sequence-limit | 數列與數列極限 |
- 6.2 | monotone-bounded | 單調與有界 |
- 6.3 | monotone-convergence-sequence | 單調收斂定理 |
- 6.4 | recursive-sequence | 遞迴數列 | a_{n+1} = √(2 + aₙ)

### 6B 級數基礎
- 6.5 | infinite-series | 無窮級數 |
- 6.6 | partial-sums | 部分和 |
- 6.7 | geometric-series | 幾何級數 |
- 6.8 | telescoping-series | 望遠鏡級數 |
- 6.9 | divergence-test | 發散判別 |

### 6C 正項級數
- 6.10 | p-series | p 級數 |
- 6.11 | integral-test | 積分判別 |
- 6.12 | comparison-test | 比較判別 |
- 6.13 | limit-comparison-test | 極限比較判別 |
- 6.14 | ratio-test | 比值判別 |
- 6.15 | root-test | 根值判別 |

### 6D 交錯與條件收斂
- 6.16 | alternating-series-test | 交錯級數判別 |
- 6.17 | absolute-convergence | 絕對收斂 |
- 6.18 | conditional-convergence | 條件收斂 |
- 6.19 | rearrangement | 重排的概念 | 淺講 Riemann 重排定理，不證

### 6E 冪級數
- 6.20 | power-series | 冪級數 |
- 6.21 | radius-of-convergence | 收斂半徑 |
- 6.22 | interval-of-convergence | 收斂區間 |
- 6.23 | power-series-calculus | 冪級數的微分與積分 |

### 6F Taylor
- 6.24 | taylor-polynomial | Taylor 多項式 |
- 6.25 | taylor-series | Taylor 級數 |
- 6.26 | maclaurin-series | Maclaurin 級數 | eˣ、sin、cos、ln(1+x)、1/(1−x)
- 6.27 | binomial-series | 二項級數 |
- 6.28 | taylor-error | Taylor 誤差 |
- 6.29 | taylor-limits | 用 Taylor 求極限 |

## Stage 7 參數式與極座標（Parametric & Polar）

### 7A 參數曲線
- 7.1 | parametric-curves | 參數曲線 |
- 7.2 | parametric-derivative | 參數式的導數 | dy/dx = (dy/dt)/(dx/dt)
- 7.3 | parametric-second-derivative | 參數式的二階導數 |
- 7.4 | parametric-arc-length | 參數式弧長 |
- 7.5 | parametric-area | 參數式面積 |

### 7B 極座標
- 7.6 | polar-coordinates | 極座標 |
- 7.7 | polar-graphs | 極座標圖形 | 心臟線、玫瑰線、雙紐線
- 7.8 | polar-tangent | 極座標切線 |
- 7.9 | polar-area | 極座標面積 | A = ½∫r² dθ
- 7.10 | polar-arc-length | 極座標弧長 |

## Stage 8 多變數微分（Multivariable Differential Calculus）

### 8A 多變數函數
- 8.1 | r2-r3 | ℝ² 與 ℝ³ |
- 8.2 | two-variable-functions | 二變數函數 |
- 8.3 | level-curves | 圖形與等高線 |
- 8.4 | multivariable-limit | 多變數極限 |
- 8.5 | path-test | 路徑測試 | xy/(x² + y²)
- 8.6 | multivariable-continuity | 多變數連續 |

### 8B 偏導數
- 8.7 | partial-derivatives | 偏導數 |
- 8.8 | higher-partials | 高階偏導 |
- 8.9 | clairaut | Clairaut 定理 |

### 8C 全微分與連鎖律
- 8.10 | total-differential | 全微分 |
- 8.11 | multivariable-linearization | 多變數線性近似 |
- 8.12 | multivariable-chain-rule | 多變數連鎖律 |

### 8D 梯度
- 8.13 | gradient | 梯度 |
- 8.14 | directional-derivative | 方向導數 |
- 8.15 | tangent-plane | 切平面 |

### 8E 多變數極值
- 8.16 | critical-points-2d | 臨界點 |
- 8.17 | hessian | Hessian |
- 8.18 | second-derivative-test-2d | 二階判別 |
- 8.19 | lagrange-one | Lagrange 乘數：一個條件 |
- 8.20 | lagrange-multiple | 多個條件 |

## Stage 9 重積分與向量微積分（Multiple Integrals & Vector Calculus）

### 9A.1 二重積分
- 9.1 | double-integral | 二重積分 |
- 9.2 | iterated-integral | 累次積分 |
- 9.3 | nonrectangular-regions | 非矩形區域 |
- 9.4 | change-order | 交換積分次序 |

### 9A.2 座標變換
- 9.5 | polar-double-integral | 極座標二重積分 | dx dy = r dr dθ 在這裡正式出現
- 9.6 | jacobian-geometry | Jacobian 的幾何意義 |
- 9.7 | jacobian-determinant | Jacobian 行列式 |
- 9.8 | change-of-variables | 變數變換 |

### 9A.3 三重積分
- 9.9 | triple-integral | 三重積分 |
- 9.10 | cylindrical-coordinates | 柱座標 |
- 9.11 | spherical-coordinates | 球座標 | dV = ρ² sin φ dρ dφ dθ

### 9B.1 向量場
- 9.12 | vector-field | 向量場 |
- 9.13 | gradient-field | 梯度場 |

### 9B.2 線積分
- 9.14 | scalar-line-integral | 純量線積分 |
- 9.15 | work-line-integral | 功的線積分 | ∫_C F·dr
- 9.16 | conservative-fields | 保守場 |
- 9.17 | potential-function | 位勢函數 |
- 9.18 | path-independence | 路徑無關 |

### 9B.3 Green
- 9.19 | green-theorem | Green 定理 |

### 9B.4 曲面
- 9.20 | parametric-surfaces | 參數曲面 |
- 9.21 | surface-area | 曲面面積 |
- 9.22 | surface-integral | 曲面積分 |
- 9.23 | flux | 通量 |

### 9B.5 旋度與散度
- 9.24 | curl | 旋度 |
- 9.25 | divergence | 散度 |

### 9B.6 大定理
- 9.26 | stokes-theorem | Stokes 定理 |
- 9.27 | divergence-theorem | 散度定理 |
- 9.28 | fundamental-theorems-unified | 基本定理 → Green → Stokes → Gauss | 預告 generalized Stokes，不正式講微分形式

## Stage 10 微分方程（Ordinary Differential Equations）

### 10A 一階
- 10.1 | ode-intro | 微分方程是什麼 |
- 10.2 | initial-value-problem | 初值問題 |
- 10.3 | separation-of-variables | 分離變數 |
- 10.4 | first-order-linear | 一階線性 | y′ + P(x)y = Q(x)
- 10.5 | integrating-factor | 積分因子 |
- 10.6 | exact-equations | 正合方程 | 選修

### 10B 二階
- 10.7 | second-order-linear | 二階線性 |
- 10.8 | characteristic-equation | 特徵方程 |
- 10.9 | distinct-real-roots | 相異實根 |
- 10.10 | repeated-roots | 重根 |
- 10.11 | complex-roots | 複數根 |

### 10C 非齊次
- 10.12 | undetermined-coefficients | 待定係數 |
- 10.13 | variation-of-parameters | 參數變異 | 較進階

### 10D 物理系統
- 10.14 | harmonic-oscillator | 簡諧振盪 | x″ + ω₀²x = 0
- 10.15 | damped-oscillator | 阻尼振盪 | x″ + 2γx′ + ω₀²x = 0
- 10.16 | driven-oscillator | 受迫振盪 |
- 10.17 | resonance | 共振 |

## Stage 11 高階技巧（Advanced Calculus Techniques，支線）

### 11A 漸近與極限技巧
- 11.1 | taylor-limits-higher | 高階 Taylor 求極限 |
- 11.2 | asymptotic-equivalence | 漸近等價 | f ~ g
- 11.3 | big-o-little-o | Big-O 與 little-o |
- 11.4 | stirling | Stirling 公式 |
- 11.5 | stolz-cesaro | Stolz–Cesàro |
- 11.6 | euler-maclaurin-intro | Euler–Maclaurin 入門 |

### 11B 瑕積分
- 11.7 | improper-infinite | 瑕積分 I：無窮區間 |
- 11.8 | improper-singular | 瑕積分 II：奇異點 |
- 11.9 | improper-p-test | p 判別 |
- 11.10 | improper-comparison | 比較判別 |
- 11.11 | improper-conditional | 條件收斂的瑕積分 | ∫₀^∞ sin x / x dx

### 11C Wallis
- 11.12 | reduction-formula | 遞迴公式 |
- 11.13 | wallis-integral | Wallis 積分 |
- 11.14 | wallis-product | Wallis 乘積 |

### 11D Gamma 與 Beta
- 11.15 | gamma-definition | Gamma 函數：定義與遞迴 | （樣稿已寫）
- 11.16 | gamma-recurrence-apps | Gamma 遞迴的應用 |
- 11.17 | gamma-half | Γ(1/2) = √π |
- 11.18 | gamma-half-integer | 半整數的 Gamma |
- 11.19 | gamma-scaled | 縮放的 Gamma 積分 |
- 11.20 | beta-function | Beta 函數 |
- 11.21 | beta-gamma-relation | Beta 與 Gamma 的關係 |
- 11.22 | beta-trig | 三角形式的 Beta |
- 11.23 | wallis-beta | Wallis 與 Beta |

### 11E 對參數微分
- 11.24 | parameter-integral | 參數積分 | I(a) = ∫ f(x, a) dx
- 11.25 | leibniz-rule | Leibniz 積分法則 |
- 11.26 | feynman-trick-basic | Feynman 積分法：基礎 |
- 11.27 | feynman-trick-advanced | Feynman 積分法：進階 |
- 11.28 | frullani | Frullani 積分 |

### 11F 經典問題
- 11.29 | gaussian-integral | Gaussian 積分 |
- 11.30 | dirichlet-integral | Dirichlet 積分 | ∫₀^∞ sin x / x dx
- 11.31 | log-sine-integral | ∫₀^{π/2} ln(sin x) dx |
- 11.32 | basel-problem | Basel 問題 | Σ 1/n² = π²/6

### 11G 複變入門
- 11.33 | complex-numbers | 複數 |
- 11.34 | complex-polar | 極式 |
- 11.35 | euler-formula | Euler 公式 |
- 11.36 | complex-functions | 複變函數 |
- 11.37 | complex-limit | 複變極限 |
- 11.38 | complex-differentiability | 複變可微 |
- 11.39 | cauchy-riemann | Cauchy–Riemann 方程 |
- 11.40 | holomorphic | 全純函數 |

### 11H 複變積分
- 11.41 | complex-curves | 複平面上的曲線 |
- 11.42 | contour-integral | 圍道積分 |
- 11.43 | cauchy-theorem | Cauchy 定理 |
- 11.44 | cauchy-integral-formula | Cauchy 積分公式 |

### 11I Laurent 與留數
- 11.45 | complex-taylor | 複數上的 Taylor 級數 |
- 11.46 | laurent-series | Laurent 級數 |
- 11.47 | singularities | 奇異點 | 可去、極點、本性
- 11.48 | residue | 留數 |
- 11.49 | residue-theorem | 留數定理 |
- 11.50 | residue-real-integrals | 用留數算實積分 | ∫ dx/(1 + x⁴)

## Stage 12 分析入門（Real Analysis & Measure，支線）

### 12A 證明工具
- 12.1 | propositions-quantifiers | 命題與量詞 | ∀、∃
- 12.2 | negation | 否定 | ¬(∀x∃y) = ∃x∀y¬
- 12.3 | direct-proof | 直接證明 |
- 12.4 | contrapositive | 逆否證明 |
- 12.5 | contradiction | 反證法 |
- 12.6 | induction | 數學歸納法 |

### 12B 實數
- 12.7 | bounds | 上界與下界 |
- 12.8 | max-min | 最大值與最小值 |
- 12.9 | sup-inf | 上確界與下確界 | sup{1 − 1/n}
- 12.10 | completeness-axiom | 完備性公理 |
- 12.11 | archimedean-property | 阿基米德性質 |

### 12C 數列嚴格化
- 12.12 | epsilon-n-definition | ε-N 定義 |
- 12.13 | epsilon-n-proofs | 用定義證明數列極限 |
- 12.14 | limit-laws-proof | 極限定律 |
- 12.15 | monotone-convergence-proof | 單調收斂定理（嚴格版） |
- 12.16 | cauchy-sequence | Cauchy 數列 |
- 12.17 | bolzano-weierstrass | Bolzano–Weierstrass |
- 12.18 | limsup-liminf | 上極限與下極限 |

### 12D 函數極限嚴格化
- 12.19 | epsilon-delta-definition | ε-δ 定義 |
- 12.20 | epsilon-delta-linear | 線性函數的 ε-δ | 可接網站的 ε-δ 挑戰
- 12.21 | epsilon-delta-quadratic | 二次函數的 ε-δ | δ = min(1, ε/k) 的寫法
- 12.22 | epsilon-delta-rational | 有理函數的 ε-δ |

### 12E 連續
- 12.23 | continuity-formal | 連續的正式定義 |
- 12.24 | sequential-criterion | 數列判準 |
- 12.25 | ivt-proof | 中間值定理的證明 |
- 12.26 | extreme-value-theorem | 極值定理 |
- 12.27 | uniform-continuity | 一致連續 | ∀x∃δ 與 ∃δ∀x 的差別
- 12.28 | heine-cantor | Heine–Cantor 定理 |

### 12F 函數列
- 12.29 | pointwise-convergence | 逐點收斂 |
- 12.30 | uniform-convergence | 一致收斂 |
- 12.31 | uniform-convergence-tests | 怎麼判斷一致收斂 |
- 12.32 | weierstrass-m-test | Weierstrass M 判別 |
- 12.33 | limit-integral-swap | 極限與積分交換 |
- 12.34 | limit-derivative-swap | 極限與微分交換 |

### 12G Riemann 積分嚴格版
- 12.35 | partitions | 分割 |
- 12.36 | upper-lower-sums | 上和與下和 |
- 12.37 | darboux-integral | Darboux 積分 |
- 12.38 | riemann-integrability | Riemann 可積 |
- 12.39 | continuous-integrable | 連續函數可積 |

### 12H Riemann 為什麼不夠
- 12.40 | dirichlet-function | Dirichlet 函數 |
- 12.41 | measure-zero | 測度為零的直觀 |

### 12I 測度論
- 12.42 | sigma-algebra | σ-代數 |
- 12.43 | measure | 測度 |
- 12.44 | lebesgue-measure | Lebesgue 測度 |
- 12.45 | null-sets | 零測集 |
- 12.46 | almost-everywhere | 幾乎處處 |
- 12.47 | measurable-functions | 可測函數 |

### 12J Lebesgue 積分
- 12.48 | simple-functions | 簡單函數 |
- 12.49 | positive-measurable | 非負可測函數 |
- 12.50 | lebesgue-integral | Lebesgue 積分 |
- 12.51 | riemann-vs-lebesgue | Riemann 與 Lebesgue | 切 x 軸 vs 按函數值分類

### 12K 收斂定理
- 12.52 | monotone-convergence-theorem | 單調收斂定理（測度版） |
- 12.53 | fatou-lemma | Fatou 引理 |
- 12.54 | dominated-convergence | 控制收斂定理 | 回到 lim ∫ fₙ =? ∫ lim fₙ
