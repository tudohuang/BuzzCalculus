// 方法家族分類表（題庫精修提案 v1.0 第一、二階段的單一來源）。
//
// 這張表定義四件事，產生器、抽題器、驗證器、報表全部讀這一份：
//   1. FAMILIES：每個主題的「方法家族」（methodFamily 的合法值）。status: "planned" 是提案列出、
//      題庫目前還沒有題的家族 —— 先定義好，之後補題時直接掛上去，不用再改 schema。
//   2. 其他五個維度的詞彙（cognitiveAction／difficultyMode／learningRole／representation）。
//   3. EXPOSURE_CAPS：預設抽題池裡「某個家族在某個主題×難度的曝光比例上限」。
//      產生器用它算 defaultWeight（題庫層的權重先壓到上限內），抽題器在執行期用同一支
//      clampShares 再壓一次（窗口內的保險絲）。skill focus／選了題包／課程練習不受這些上限限制。
//   4. SESSION：一局 10 題的組成限制（同家族、同模板、同題包的上限）。
//
// rank 不在這裡：rank 永遠由 src/kernel/rubric.js 的三軸決定（difficulty-rubric-is-source-of-truth）。
// 這裡的每一個維度都跟 rank 正交 —— 改分類不會、也不准改到難度。
//
// 改了這個檔：node tools/regen_all.js（產生器會重算 src/kernel/problem_profiles.js），
// 然後 node tools/validate_problem_profiles.js。

"use strict";

/* ── 1. 方法家族 ───────────────────────────────────────────────
   flags：taylor = 計入「Taylor 曝光」；superHigh = 超高階導數；taylorCoeff = 靠 Taylor 係數反推。 */
const FAMILIES = {
  limits: [
    ["direct_substitution", "直接代入"],
    ["algebraic_cancellation", "代數約分"],
    ["rationalization", "有理化"],
    ["standard_trig_limit", "三角標準極限"],
    ["squeeze", "夾擠"],
    ["one_sided_piecewise", "單邊與分段"],
    ["lhopital", "L'Hôpital"],
    ["log_exp_transform", "取對數／指數化"],
    ["taylor_asymptotic", "Taylor 與漸近展開", { taylor: true }],
    ["sequence_limit", "數列極限"],
    ["recurrence_limit", "遞迴數列"],
    ["riemann_sum", "Riemann 和"],
    ["integral_comparison", "積分夾逼與比較"],
    ["product_log", "乘積取對數"],
    ["stolz", "Stolz–Cesàro"],
    ["inequality", "不等式估計"],
    ["limsup_liminf", "上下極限與確界"],
    ["stirling_gamma", "Stirling 與 Gamma"],
    ["oscillation", "振盪與不存在"],
    ["epsilon_delta", "ε-δ"],
    // 提案的 20 類之外、題庫裡確實存在的三類（讓每一題都有一個誠實的家）
    ["continuity_reasoning", "連續性判斷"],
    ["graph_table_reading", "從圖表讀極限"],
    ["multivariable_path", "多變數路徑"]
  ],
  derivatives: [
    ["basic_rules", "基本微分律"],
    ["chain_rule", "鏈鎖律"],
    ["implicit_function_structure", "隱函數"],
    ["log_derivative_structure", "對數微分"],
    ["inverse_function_derivative", "反函數與反三角微分"],
    ["parametric_derivative", "參數式微分"],
    ["derivative_definition", "導數定義與可微性"],
    ["uniform_continuity", "一致連續與 Lipschitz"],
    ["ftc_differentiation", "微分積分上限"],
    ["higher_derivative", "低階高階導數"],
    ["leibniz_high_derivative", "Leibniz 高階導數"],
    ["super_high_derivative", "超高階導數", { superHigh: true }],
    ["taylor_coefficient", "Taylor 係數反推", { taylorCoeff: true }],
    ["curve_analysis", "曲線分析"],
    ["tangent_line", "切線與法線"],
    ["mean_value_theorem", "中值定理"],
    ["optimization", "最佳化"],
    ["related_rates", "相關變率"],
    ["linear_approximation", "線性近似"],
    ["newton_convergence", "牛頓法"],
    ["applied_modeling", "應用情境"],
    ["graph_reading", "圖形判讀"],
    ["partial_derivative", "偏導數"],
    ["gradient_directional", "梯度、方向導數與全微分"],
    ["vector_operator", "Nabla 運算"],
    ["jacobian_geometry", "Jacobian"],
    ["hessian_geometry", "Hessian 判別"],
    ["constrained_optimization", "條件極值（Lagrange）"],
    ["wronskian_structure", "Wronskian"],
    ["differential_operator", "微分算子與 ODE 驗證"],
    ["complex_derivative", "複變微分"],
    ["curvature_parametric", "曲率"],
    // 提案列為之後補題的家族
    ["inverse_function_high_derivative", "反函數高階導數", { planned: true }],
    ["functional_equation_differentiation", "函數方程微分", { planned: true }],
    ["faa_di_bruno", "Faà di Bruno", { planned: true }],
    ["parameter_differentiation", "對參數微分", { planned: true }]
  ],
  integrals: [
    ["basic_antiderivative", "基本反導數"],
    ["u_substitution", "u 代換"],
    ["integration_by_parts", "分部積分"],
    ["ibp_cyclic_reduction", "循環分部與遞推"],
    ["partial_fractions", "部分分式"],
    ["trig_integral", "三角積分"],
    ["trig_substitution", "三角代換"],
    ["wallis", "Wallis"],
    ["symmetry_kings", "對稱與 King's property"],
    ["improper_convergence", "瑕積分"],
    ["beta_gamma", "Beta／Gamma"],
    ["frullani", "Frullani"],
    ["dirichlet_oscillatory", "振盪積分"],
    ["parameter_differentiation", "參數微分（Feynman）"],
    ["special_constant", "特殊常數積分"],
    ["series_expansion_integral", "展開成級數再積"],
    ["contour_residue", "留數與複變"],
    ["multiple_integral", "重積分"],
    ["change_of_variables", "變數變換"],
    ["change_order", "交換積分次序"],
    ["vector_field_theorems", "線積分與 Green／Stokes／散度"],
    ["parametric_curve", "參數曲線與極座標"],
    ["area_between", "面積"],
    ["volume_revolution", "體積"],
    ["arc_length_average", "弧長、均值與功"],
    ["FTC_reasoning", "微積分基本定理"],
    ["visual_integral", "看圖的積分"],
    ["riemann_sum", "Riemann 和"],
    ["numerical_integration", "數值積分"],
    ["ode_solving", "解微分方程"],
    ["lebesgue_measure", "測度與收斂定理"],
    ["physical_model_setup", "物理模型列式"],
    // 提案列為之後補題的家族
    ["method_selection", "選方法", { planned: true }],
    ["setup_only", "只列式不算", { planned: true }],
    ["interpret_integral", "解讀積分", { planned: true }],
    ["bounds_selection", "定上下限", { planned: true }],
    ["geometric_meaning", "幾何意義", { planned: true }]
  ],
  series: [
    ["geometric_p_series", "等比與 p 級數"],
    ["telescoping", "望遠鏡相消"],
    ["comparison_test", "比較判別"],
    ["integral_test", "積分判別"],
    ["ratio_test", "比值判別"],
    ["root_test", "根值判別"],
    ["alternating_series", "交錯級數"],
    ["power_series_radius", "冪級數收斂範圍"],
    ["taylor_series_coefficient", "Taylor 展開與係數", { taylorCoeff: true }],
    ["series_closed_form", "級數求和（逐項微積分）"],
    ["zeta_euler", "zeta 與 Euler 和"],
    ["error_estimate", "誤差估計"],
    ["sequence_convergence", "數列收斂"],
    ["graph_reading", "圖形判讀"],
    ["dirichlet_test", "Dirichlet 判別"],
    ["abel_test", "Abel 判別", { planned: true }],
    ["cauchy_condensation", "Cauchy 凝聚", { planned: true }],
    ["rearrangement", "重排"],
    ["conditional_vs_absolute", "條件與絕對收斂"],
    ["infinite_product", "無窮乘積"],
    ["double_series", "雙重級數", { planned: true }],
    ["change_order", "交換求和次序", { planned: true }],
    ["generating_function", "生成函數"],
    ["recurrence_generating_function", "遞迴與生成函數", { planned: true }],
    ["euler_maclaurin", "Euler–Maclaurin", { planned: true }],
    ["asymptotic_sum", "和的漸近", { planned: true }],
    ["harmonic_number", "調和數"],
    ["fourier_series", "Fourier 級數"],
    ["pointwise_uniform", "逐點與一致收斂"],
    ["counterexample_construction", "構造反例", { planned: true }],
    ["summability_cesaro", "Cesàro 可和", { planned: true }],
    ["summability_abel", "Abel 可和", { planned: true }],
    ["limsup_root_behavior", "limsup 與根值"]
  ]
};

/* ── 2. 其他維度的詞彙 ─────────────────────────────────────────── */
const COGNITIVE_ACTIONS = ["recognize_method", "compute", "prove", "interpret", "setup", "estimate", "visualize"];
const DIFFICULTY_MODES = ["method_choice", "algebra_load", "insight", "bookkeeping", "recall", "speed", "rigor", "trap"];
// general_practice 不在提案的清單裡：一般練習池的成員、沒有更特定角色的題（大多數 R3–R5 計算題）。
// 沒有它的話，這些題只能被硬塞成 fluency_drill 或 arena，兩個都不誠實。
const LEARNING_ROLES = ["course_core", "course_extra", "fluency_drill", "concept_check", "method_choice", "visual",
  "modeling", "arena", "boss", "daily", "exam", "general_practice"];
const REPRESENTATIONS = ["symbolic", "graph", "table", "verbal", "proof", "interactive"];

/* ── 3. 預設池的曝光上限 ───────────────────────────────────────
   每一條：{ topic, ranks, families | any, max }。max 是「該主題×該 rank 的預設池權重裡，
   這些家族（合計）最多佔多少」；any: true 表示「任何單一家族」。
   hard: true 的條目在 CI 報表（report_method_diversity.js）超過就紅燈；其餘只印警告。 */
const TAYLOR_CAPS_BY_RANK = { 1: 0, 2: 0.05, 3: 0.15, 4: 0.20, 5: 0.15, 6: 0.15 };
const EXPOSURE_CAPS = [
  ...Object.entries(TAYLOR_CAPS_BY_RANK).map(([rank, max]) => ({
    id: `limits-taylor-r${rank}`, topic: "limits", ranks: [Number(rank)], families: ["taylor_asymptotic"], max, hard: true
  })),
  { id: "derivatives-r6-any", topic: "derivatives", ranks: [6], any: true, max: 0.30, hard: true },
  { id: "derivatives-r6-superhigh", topic: "derivatives", ranks: [6], families: ["super_high_derivative"], max: 0.20, hard: true },
  { id: "derivatives-r6-taylorcoeff", topic: "derivatives", ranks: [6], families: ["taylor_coefficient"], max: 0.25, hard: true }
];
// 至少要有幾個家族（只報告，不能靠權重修 —— 缺的家族要補題）
const MIN_FAMILIES = [{ id: "derivatives-r6-families", topic: "derivatives", ranks: [6], min: 6 }];
// 任何主題×rank 的單一家族份額超過這個數字就在報表上標黃（不擋）
const SOFT_FAMILY_SHARE = 0.35;
// 模板飽和：同一個 noveltyFamily 在預設池／課程核心裡超過這麼多題就警告
const TEMPLATE_SATURATION_WARN = 5;

/* ── 4. 一局的組成限制 ─────────────────────────────────────────
   以 10 題一局為準；題數不同時照比例（perFamily = ceil(n × 0.3)）。 */
const SESSION = {
  referenceSize: 10,
  perFamilyShare: 0.3, // 同一個 methodFamily（主要家族）≤ 3 / 10
  perNovelty: 1, // 同一個 noveltyFamily ≤ 1
  perTemplate: 1, // 同一個模板母題（variantOf／tmpl-*）≤ 1
  perPackShare: 0.4 // 同一個來源題包 ≤ 4 / 10
};

function familyIndex() {
  const out = {};
  Object.entries(FAMILIES).forEach(([topic, list]) => list.forEach(([id, label, flags]) => {
    out[`${topic}:${id}`] = { id, topic, label, planned: Boolean(flags && flags.planned), ...(flags || {}) };
  }));
  return out;
}

module.exports = {
  FAMILIES, COGNITIVE_ACTIONS, DIFFICULTY_MODES, LEARNING_ROLES, REPRESENTATIONS,
  TAYLOR_CAPS_BY_RANK, EXPOSURE_CAPS, MIN_FAMILIES, SOFT_FAMILY_SHARE, TEMPLATE_SATURATION_WARN, SESSION,
  familyIndex
};
