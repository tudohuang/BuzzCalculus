// 題目側寫（problem profile）的分類規則 —— 產生器、驗證器、報表、統計工作簿共用這一支。
//
// 每題八個欄位，跟 rank 正交（rank 只看 rubric 三軸，這裡一個字都不碰）：
//   methodFamily[]     方法家族（第一個是主要家族，抽題與上限都看它）—— 合法值見 tools/content/method_taxonomy.js
//   cognitiveAction[]  要做的事：recognize_method／compute／prove／interpret／setup／estimate／visualize
//   difficultyMode[]   難在哪：method_choice／algebra_load／insight／bookkeeping／recall／speed／rigor／trap（從 rubric 三軸＋tag）
//   prerequisiteGate[] 先修課：題目每一個技巧在新版課程裡第一次被教的那一課（大綱順序；粗 tag → 技巧，跟魔王題公平性同一套算法）
//   learningRole[]     在產品裡扮演什麼：course_core／course_extra／fluency_drill／concept_check／method_choice／visual／
//                      modeling／arena／boss／daily／exam／general_practice
//   representation     symbolic／graph／table／verbal／proof／interactive
//   noveltyFamily      模板母題：題幹把數字正規化之後結構相同的一群，用群裡第一題（題庫順序）的 id 當名字
//   defaultWeight      預設抽題池的權重（0–1）：模板飽和 1/√群大小、純反射題（只當 arena）× 0.6，再用 EXPOSURE_CAPS 壓
//
// 分類規則的原則跟 backfill_skill_tags.js 一樣：由具體到籠統、每條都說得出為什麼、第一條命中的是主要家族。
// 每題記下命中的方式（tag／skill／prompt／fallback）當信心：tag 最可靠、fallback 最不可靠，
// 命中三個以上不同家族又不是靠 tag 的，降一級 —— 這些是「人工複核」清單的來源（--review 匯出 CSV）。
// 人工覆寫：tools/content/problem_profile_overrides.json（逐題、逐欄位；覆寫的欄位不再跑規則）。

"use strict";

const fs = require("fs");
const path = require("path");
const taxonomy = require("../content/method_taxonomy.js");
const literalKey = require("./literal_key.js");
const sampler = require("../../src/kernel/sampler.js");

const ROOT = path.join(__dirname, "..", "..");
const OVERRIDES_FILE = path.join(ROOT, "tools", "content", "problem_profile_overrides.json");

/* ── 特徵 ──────────────────────────────────────────────────────── */
function featuresOf(p, graph) {
  const tags = new Set(p.tags || []);
  const skills = new Set(graph.skillsForProblem(p) || []);
  const s = String(p.prompt || "");
  const deriv = derivOrder(s);
  return {
    p, tags, skills, s, kind: p.answerKind, rank: Number(p.rank), deriv,
    tag: (...xs) => (xs.some((x) => tags.has(x)) ? "tag" : false),
    skill: (...xs) => (xs.some((x) => skills.has(x)) ? "skill" : false),
    re: (r) => (r.test(s) ? "prompt" : false),
    graphKind: /^(graph|graphtap|graphslope|sketch)$/.test(p.answerKind) ? "tag" : false
  };
}

// d^n/dx^n …|_{x=0} 或 f^{(n)}(0)：回傳階數與是不是在 0 取值
function derivOrder(s) {
  const m = /\\frac\{d\^\{?(\d+)\}?[^}]*\}\{d[a-z]\^\{?\d+\}?\}/.exec(s) || /[fy]\^\{\((\d+)\)\}\(0\)/.exec(s);
  if (!m) return { order: 0, atZero: false };
  return { order: Number(m[1]), atZero: /_\{?[a-z]\s*=\s*0\}?|\^\{\(\d+\)\}\(0\)/.test(s) };
}

/* ── 方法家族規則 ────────────────────────────────────────────────
   [家族, 為什麼, 測試]。測試回傳 "tag"／"skill"／"prompt"（命中方式）或 false。 */
// 題幹真的帶一個參數函數（I(a)、F(t)…）才算 Feynman：有些題 tag 了 parameter-integral 但題幹只是 ∫x⁵ln x（那是分部積分）
const PARAM = /\b[A-Z]\((a|b|t|s|k|n|\\alpha|\\lambda)\)|parameter|參數/;

const RULES = {
  limits: [
    ["epsilon_delta", "ε-δ／ε-N 證明或互動", (f) => (f.kind === "epsilon" ? "tag" : false) || f.tag("epsilon-delta", "epsilon-game") || f.skill("analysis.rigor")],
    ["limsup_liminf", "上下極限、確界", (f) => f.tag("limsup", "supremum", "infimum") || f.re(/\\limsup|\\liminf|\\sup\b|\\inf\b/) || f.skill("analysis.supinf")],
    ["multivariable_path", "多變數極限（路徑）", (f) => f.tag("path-test", "multivariable-limit") || f.re(/\(x,\s*y\)\s*\\to/) || f.skill("mvcalc.partial")],
    ["stolz", "Stolz–Cesàro 型", (f) => f.tag("stolz", "cesaro") || f.re(/Stolz|Ces[aà]ro/i)],
    ["stirling_gamma", "階乘／Gamma 的漸近", (f) => f.tag("stirling", "gamma-function") || ((/n!|\\Gamma|\\binom\{2n\}/.test(f.s) && /\\infty/.test(f.s)) ? "prompt" : false)],
    ["riemann_sum", "Riemann 和", (f) => f.tag("riemann-sum", "darboux") || f.skill("limit.riemann") || ((/\\sum_\{k=1\}\^\{?n/.test(f.s) && /\\frac\{1\}\{n\}|\{n\^\{?2\}?\}/.test(f.s)) ? "prompt" : false)],
    ["integral_comparison", "含參數 n 的積分序列", (f) => ((/\\int/.test(f.s) && /\\lim_\{n/.test(f.s)) ? "prompt" : false)],
    ["product_log", "乘積取對數", (f) => f.tag("infinite-product", "product-limit") || f.re(/\\prod/)],
    ["recurrence_limit", "遞迴數列", (f) => f.tag("recursive", "recursive-sequence", "recurrence", "fixed-point", "nested-radical", "continued-fraction", "recursion", "newton") || f.re(/[ax]_\{n\+1\}/)],
    ["inequality", "不等式估計", (f) => f.tag("inequality")],
    ["one_sided_piecewise", "單邊、分段、取整", (f) => f.tag("floor", "one-sided", "one-sided-limit", "piecewise", "absolute-value") || f.skill("limit.discontinuous") || f.re(/\\lfloor|\\to\s*-?[\d.]*\^\{?[+-]\}?|\|x\|/)],
    ["oscillation", "振盪、極限不存在", (f) => f.tag("oscillation", "dne")],
    ["squeeze", "夾擠", (f) => f.tag("squeeze") || f.skill("limit.squeeze")],
    ["taylor_asymptotic", "Taylor 與漸近展開", (f) => f.tag("taylor", "taylor-limit", "nested-taylor", "composite-taylor", "series-expansion", "asymptotics", "asymptotic", "asymptotic-balance", "asymptotic-expansion", "euler-mascheroni", "boundary-layer", "log-expansion") || f.skill("limit.taylor")],
    ["lhopital", "L'Hôpital", (f) => f.tag("lhopital") || f.skill("limit.lhopital")],
    ["graph_table_reading", "從圖或表讀極限", (f) => f.tag("limit-from-table", "graph-reading") || f.graphKind || f.skill("diff.graph")],
    ["continuity_reasoning", "連續性、IVT、可去不連續", (f) => f.tag("continuity", "ivt", "removable", "removable-singularity", "asymptote", "zeros", "domain") || (!/\\lim/.test(f.s) && f.skill("limit.continuity"))],
    ["sequence_limit", "數列極限", (f) => f.tag("sequence", "sequences", "sequence-limit", "cauchy-sequence", "nth-root", "infinity-limit") || f.skill("limit.sequence", "limit.asymptotic") || f.re(/\\lim_\{n\s*\\to/)],
    ["log_exp_transform", "1^∞、0^0 等指數型：取對數", (f) => f.tag("power-exponential", "exponential-limit", "log-limit", "indeterminate") || f.re(/\)\^\{[^}]*\\frac\{1\}|\)\^\{?1\/|\)\^\{\\frac/) || f.skill("limit.exponential")],
    ["rationalization", "根式相消：有理化", (f) => f.tag("rationalize") || f.skill("limit.rationalize") || ((/\\sqrt/.test(f.s) && /-\s*\\sqrt|\\sqrt\{[^}]*\}\s*-/.test(f.s)) ? "prompt" : false)],
    ["standard_trig_limit", "三角標準極限", (f) => f.tag("trig-limit", "half-angle") || f.skill("limit.trig") || f.re(/\\sin|\\cos|\\tan/)],
    ["algebraic_cancellation", "因式分解約掉 0/0", (f) => f.tag("factoring", "rational-limit", "rational-function", "polynomial", "derivative-definition", "applied-limit") || ((/\\frac/.test(f.s) && /\\to\s*-?(\d|\\infty)/.test(f.s)) ? "prompt" : false)],
    ["direct_substitution", "直接代入（其餘）", (f) => f.tag("direct-substitution") || f.skill("limit.direct") || "fallback"]
  ],
  derivatives: [
    ["super_high_derivative", "8 階以上、在 0 取值", (f) => f.tag("super-high-derivative") || ((f.deriv.order >= 8 && f.deriv.atZero) ? "pattern" : false) || f.skill("diff.higher.extreme")],
    ["taylor_coefficient", "在 0 的高階導數：Taylor 係數反推", (f) => ((f.deriv.order >= 3 && f.deriv.atZero) ? "pattern" : false) || f.tag("coefficient", "taylor-polynomial") || f.skill("series.taylor.coeff")],
    ["leibniz_high_derivative", "乘積的高階導數（Leibniz）", (f) => f.tag("leibniz-rule")],
    ["differential_operator", "ODE／Bessel：代回驗證", (f) => f.skill("adv.ode.first", "adv.ode.second", "adv.bessel", "integral.ode") || f.tag("bessel", "ode")],
    ["wronskian_structure", "Wronskian", (f) => f.skill("mvcalc.wronskian")],
    ["hessian_geometry", "Hessian", (f) => f.skill("mvcalc.hessian")],
    ["constrained_optimization", "Lagrange 乘子", (f) => f.skill("mvcalc.lagrange")],
    ["jacobian_geometry", "Jacobian", (f) => f.skill("mvcalc.jacobian")],
    ["vector_operator", "Nabla、Laplacian", (f) => f.skill("mvcalc.nabla")],
    ["gradient_directional", "梯度、方向導數、全微分", (f) => f.skill("mvcalc.directional", "mvcalc.total")],
    ["complex_derivative", "複變", (f) => f.skill("adv.complex", "adv.residue")],
    ["partial_derivative", "偏導數", (f) => f.skill("mvcalc.partial") || f.re(/\\partial/)],
    ["curvature_parametric", "曲率", (f) => f.tag("curvature")],
    ["newton_convergence", "牛頓法", (f) => f.tag("newton-method", "newton")],
    ["ftc_differentiation", "對積分上限微分", (f) => f.skill("integral.ftc") || f.re(/\\frac\{d\}\{dx\}\s*(\\left\()?\s*\\int/)],
    ["related_rates", "相關變率", (f) => f.tag("related-rates", "motion")],
    ["implicit_function_structure", "隱函數微分", (f) => f.tag("implicit-differentiation")],
    ["parametric_derivative", "參數式微分", (f) => f.skill("diff.parametric")],
    ["mean_value_theorem", "中值定理、Rolle", (f) => f.tag("mvt", "rolle", "mean-value", "mean-value-theorem")],
    ["optimization", "最佳化", (f) => f.skill("diff.optimize")],
    ["applied_modeling", "應用情境", (f) => f.skill("diff.applied") || f.tag("story-problem", "word-problem")],
    ["linear_approximation", "線性近似", (f) => f.skill("diff.approx")],
    ["graph_reading", "圖形判讀", (f) => f.graphKind || f.skill("diff.graph")],
    ["tangent_line", "切線、法線", (f) => f.tag("tangent-normal")],
    ["curve_analysis", "單調、凹凸、極值", (f) => f.skill("diff.shape")],
    ["uniform_continuity", "一致連續、Lipschitz", (f) => f.tag("uniform-continuity", "lipschitz") || f.skill("analysis.uniform")],
    ["derivative_definition", "導數定義、可微性", (f) => f.skill("diff.definition", "limit.continuity")],
    ["higher_derivative", "低階高階導數", (f) => f.skill("diff.higher") || (f.deriv.order >= 2 ? "prompt" : false)],
    ["log_derivative_structure", "對數微分", (f) => f.skill("diff.log")],
    ["inverse_function_derivative", "反函數、反三角", (f) => f.skill("diff.inverse")],
    ["chain_rule", "鏈鎖律", (f) => f.skill("diff.chain")],
    ["basic_rules", "基本微分律（其餘）", (f) => f.tag("product-rule", "quotient-rule", "power-rule", "basic-derivative") || f.skill("diff.basic") || "fallback"]
  ],
  integrals: [
    ["contour_residue", "留數、複變", (f) => f.skill("adv.residue", "adv.complex")],
    ["lebesgue_measure", "測度、收斂定理", (f) => f.skill("analysis.measure", "analysis.convergence")],
    ["parameter_differentiation", "Feynman：對參數微分", (f) => (f.skill("integral.parameter") && PARAM.test(f.s) ? "skill" : false) || f.tag("feynman")],
    ["ode_solving", "解微分方程", (f) => f.skill("integral.ode", "adv.ode.first", "adv.ode.second")],
    ["vector_field_theorems", "線積分、Green、Stokes、散度", (f) => f.skill("vector.line", "vector.green", "vector.surface", "vector.divergence")],
    ["change_order", "交換積分次序", (f) => f.tag("change-order", "order-of-integration")],
    ["change_of_variables", "變數變換、極座標", (f) => f.skill("integral.changevars", "mvcalc.jacobian")],
    ["multiple_integral", "重積分", (f) => f.skill("integral.double", "integral.triple") || f.re(/\\iint|\\iiint/)],
    ["numerical_integration", "數值積分", (f) => f.skill("integral.numeric")],
    ["riemann_sum", "Riemann 和", (f) => f.skill("limit.riemann") || f.tag("riemann-sum")],
    ["visual_integral", "看圖：累積函數、面積符號", (f) => f.skill("integral.accumulation") || f.graphKind || f.skill("diff.graph")],
    ["physical_model_setup", "物理模型列式（功、質心、運動）", (f) => f.tag("work", "work-integral", "kinematics", "centroid") || f.skill("diff.applied")],
    ["parametric_curve", "參數曲線與極座標", (f) => f.skill("diff.parametric") || f.tag("parametric", "polar-curve")],
    ["volume_revolution", "體積", (f) => f.skill("integral.volume")],
    ["area_between", "面積", (f) => f.skill("integral.area")],
    ["arc_length_average", "弧長、平均值", (f) => f.skill("integral.arclength")],
    ["frullani", "Frullani", (f) => f.skill("integral.frullani")],
    ["beta_gamma", "Beta／Gamma", (f) => f.skill("integral.beta", "integral.gamma")],
    ["symmetry_kings", "對稱、King's property", (f) => f.skill("integral.kings") || f.tag("even-function", "odd-function", "symmetry")],
    ["wallis", "Wallis", (f) => f.skill("integral.wallis")],
    ["dirichlet_oscillatory", "振盪積分", (f) => f.skill("integral.dirichlet")],
    ["series_expansion_integral", "展開成級數逐項積", (f) => f.re(/\{e\^\{?x\}?\s*[+-]\s*1\}/) || f.skill("series.euler", "series.geometric", "series.sum", "series.compare")],
    ["special_constant", "特殊常數積分", (f) => f.skill("integral.special", "integral.log")],
    ["FTC_reasoning", "微積分基本定理", (f) => f.skill("integral.ftc")],
    ["ibp_cyclic_reduction", "循環分部、遞推", (f) => f.skill("integral.ibp.cyclic")],
    ["trig_substitution", "三角代換", (f) => f.skill("integral.trigsub")],
    ["partial_fractions", "部分分式", (f) => f.skill("integral.partialfrac")],
    ["integration_by_parts", "分部積分", (f) => f.skill("integral.ibp")],
    ["trig_integral", "三角積分", (f) => f.skill("integral.trig")],
    ["u_substitution", "u 代換", (f) => f.skill("integral.usub")],
    ["improper_convergence", "瑕積分", (f) => f.skill("integral.improper")],
    ["basic_antiderivative", "基本反導數（其餘）", (f) => f.tag("basic-integral", "standard-integral") || f.skill("integral.basic") || "fallback"]
  ],
  series: [
    ["pointwise_uniform", "逐點與一致收斂", (f) => f.tag("uniform-convergence") || f.skill("analysis.uniform")],
    ["fourier_series", "Fourier", (f) => f.tag("fourier", "parseval")],
    ["infinite_product", "無窮乘積", (f) => f.tag("infinite-product") || f.re(/\\prod/)],
    ["rearrangement", "重排", (f) => f.tag("rearrangement")],
    ["conditional_vs_absolute", "條件 vs 絕對收斂", (f) => f.tag("absolute-conditional") || f.re(/conditional|absolutely|條件收斂|絕對收斂/i)],
    ["dirichlet_test", "Dirichlet 判別", (f) => f.tag("dirichlet") || f.re(/Dirichlet/)],
    ["harmonic_number", "調和數", (f) => f.tag("harmonic-number") || f.re(/H_n|H_\{n\}/)],
    ["limsup_root_behavior", "limsup／根值行為", (f) => f.skill("analysis.supinf") || f.re(/\\limsup/)],
    ["generating_function", "生成函數", (f) => f.skill("series.generating")],
    ["zeta_euler", "zeta、Euler 和", (f) => f.skill("series.euler")],
    ["error_estimate", "誤差估計", (f) => f.skill("series.estimate")],
    ["graph_reading", "圖形判讀", (f) => f.graphKind || f.skill("diff.graph")],
    ["power_series_radius", "收斂半徑與區間", (f) => f.skill("series.power.radius")],
    ["taylor_series_coefficient", "Taylor 展開與係數", (f) => f.skill("series.taylor.coeff") || f.tag("coefficient") || f.re(/coefficient of/i)],
    ["telescoping", "望遠鏡", (f) => f.skill("series.telescoping")],
    ["series_closed_form", "逐項微積分求和", (f) => f.skill("series.sum")],
    ["integral_test", "積分判別", (f) => f.tag("integral-test")],
    ["root_test", "根值判別", (f) => f.skill("series.root")],
    ["ratio_test", "比值判別", (f) => f.skill("series.ratio")],
    ["alternating_series", "交錯級數", (f) => f.skill("series.alternating")],
    ["sequence_convergence", "數列收斂", (f) => f.skill("limit.sequence") || f.tag("sequence")],
    ["geometric_p_series", "等比、p 級數", (f) => f.skill("series.geometric")],
    ["series_closed_form", "求和（其餘：要算出值的級數）", (f) => ((/^(numeric|expression)$/.test(f.kind) && !f.skill("series.compare") && /\\sum/.test(f.s)) ? "fallback" : false)],
    ["comparison_test", "比較判別（其餘）", (f) => f.skill("series.compare") || "fallback"]
  ]
};

function classifyFamily(f) {
  const rules = RULES[f.p.topic] || [];
  const hits = [];
  rules.forEach(([fam, why, test]) => {
    const how = test(f);
    if (how) hits.push({ fam, why, how });
  });
  const real = hits.filter((h) => h.how !== "fallback");
  const primary = real[0] || hits[0] || { fam: "_", why: "no rule", how: "fallback" };
  const families = [...new Set([primary.fam, ...real.slice(1).map((h) => h.fam)])].slice(0, 3);
  // pattern（題幹結構完全吻合，例如 d^n/dx^n|_{x=0}）跟 tag 一樣可靠；prompt（一般的題幹特徵）只算中等
  let confidence = primary.how === "tag" || primary.how === "pattern" ? "high" : primary.how === "fallback" ? "low" : "medium";
  // 曖昧：靠 tag／skill 命中三個以上不同家族，而主要家族本身只是中等信心
  const distinct = new Set(real.filter((h) => h.how === "tag" || h.how === "skill").map((h) => h.fam)).size;
  if (distinct >= 3 && confidence === "medium") confidence = "low";
  return { families, primary, confidence, alternatives: real.slice(1, 4).map((h) => h.fam) };
}

/* ── 其他維度 ──────────────────────────────────────────────────── */
function cognitiveActions(f) {
  const out = [];
  const k = f.kind;
  if (k === "proof") out.push("prove");
  else if (k === "epsilon") out.push("prove", "estimate");
  else if (/^(graph|graphtap|graphslope|sketch)$/.test(k)) out.push("visualize", "interpret");
  else if (k === "worksheet") out.push("compute", "setup");
  else if (k === "text") out.push(f.tag("technique-recognition") ? "recognize_method" : "interpret");
  else if (k === "set" || k === "interval") out.push("compute", "interpret");
  else out.push("compute");
  if (f.tag("technique-recognition", "trap-drill") && !out.includes("recognize_method")) out.push("recognize_method");
  if (f.tag("story-problem", "word-problem", "applied-derivative", "applications", "kinematics", "related-rates", "optimization") && !out.includes("setup")) out.push("setup");
  if (f.tag("estimate", "error-bound", "series-estimate", "linear-approximation", "numerical-integration", "lagrange-remainder") && !out.includes("estimate")) out.push("estimate");
  if (f.tag("graph-reading") && !out.includes("visualize")) out.push("visualize");
  return out;
}

function difficultyModes(f, axes) {
  const out = [];
  if (f.tag("technique-recognition")) out.push("method_choice");
  if (f.tag("limit-trap", "trap-drill")) out.push("trap");
  if (f.kind === "proof" || f.kind === "epsilon" || f.tag("written-proof")) out.push("rigor");
  if (f.tag("burst", "technique-sprint")) out.push("speed");
  if (axes) {
    if (axes.obscurity >= 3) out.push("insight");
    if (axes.load >= 3) out.push("algebra_load");
    if (axes.steps >= 3) out.push("bookkeeping");
  }
  if (!out.length) out.push("recall");
  return out;
}

function representationOf(f) {
  if (f.kind === "proof") return "proof";
  if (f.kind === "epsilon") return "interactive";
  if (/^(graph|graphtap|graphslope|sketch)$/.test(f.kind) || f.p.graph) return "graph";
  if (f.kind === "worksheet" || f.tag("worksheet-table", "limit-from-table")) return "table";
  if (f.tag("story-problem", "word-problem") || (/[一-鿿]{12,}/.test(f.s) && !/\\(frac|int|lim|sum)/.test(f.s))) return "verbal";
  return "symbolic";
}

/* ── 模板母題（noveltyFamily）──────────────────────────────────────
   題幹：拿掉排版差異（literal_key）→ 數字一律換成 #（含小數、分數的分子分母）→ 連續的 # 併成一個。
   同主題、同作答形式、正規化後一樣的題 = 同一個模板。變體題（variantOf）、模板題（tmpl-xxx-NNN）直接併進母題那一群。 */
function structureKey(p) {
  const s = literalKey(p.prompt || "")
    .replace(/\\frac\{\d+\}\{\d+\}/g, "#")
    .replace(/\d+(\.\d+)?/g, "#")
    .replace(/#(\s*#)+/g, "#");
  return `${p.topic}|${p.answerKind}|${s}`;
}
function templateMother(p) {
  if (p.variantOf) return p.variantOf;
  const m = /^(tmpl-[a-z-]+)-\d+$/.exec(p.id || "");
  return m ? m[1] : "";
}

/* ── 課程（新版大綱）────────────────────────────────────────────── */
function loadCourse(win) {
  const outline = win.BUZZ_COURSE_V2;
  const lessonDir = path.join(ROOT, "tools", "content", "course_v2", "lessons");
  const order = [];
  const usage = {}; // problemId → [{ lesson, kind: core|challenge|plain|worked, index }]
  outline.stages.forEach((stage) => stage.chapters.forEach((chapter) => chapter.lessons.forEach((raw) => {
    const index = order.length;
    order.push(raw.id);
    String(raw.practice || "").split(" ").filter(Boolean).forEach((token) => {
      const kind = token.endsWith("*") ? "core" : token.endsWith("!") ? "challenge" : "plain";
      const id = kind === "plain" ? token : token.slice(0, -1);
      (usage[id] = usage[id] || []).push({ lesson: raw.id, kind, index });
    });
    String(raw.worked || "").split(" ").filter(Boolean).forEach((id) => (usage[id] = usage[id] || []).push({ lesson: raw.id, kind: "worked", index }));
  })));
  const coarse = {};
  order.forEach((id) => {
    const file = path.join(lessonDir, `${id}.json`);
    if (!fs.existsSync(file)) return;
    const L = JSON.parse(fs.readFileSync(file, "utf8"));
    coarse[id] = (L.skillTags && L.skillTags.coarse) || [];
  });
  let bosses = {};
  const bossFile = path.join(ROOT, "tools", "content", "course_v2", "bosses.json");
  if (fs.existsSync(bossFile)) bosses = JSON.parse(fs.readFileSync(bossFile, "utf8"));
  return { order, usage, coarse, bosses };
}

// 每個技巧第一次被教的課（validate_course_v2.js 的魔王題公平性用的同一個定義）
function firstTaughtMap(course, graph) {
  const first = {};
  course.order.forEach((id, i) => {
    (course.coarse[id] || []).forEach((t) => (graph.tagToSkills(t) || []).forEach((s) => { if (!(s in first)) first[s] = i; }));
  });
  return first;
}

/* ── 主程式 ────────────────────────────────────────────────────── */
function readOverrides() {
  if (!fs.existsSync(OVERRIDES_FILE)) return {};
  const raw = JSON.parse(fs.readFileSync(OVERRIDES_FILE, "utf8"));
  return raw.problems || {};
}

function buildProfiles(problems, win, opts = {}) {
  const graph = win.BuzzSkillGraph;
  const rubric = win.BuzzRubric;
  const course = loadCourse(win);
  const firstTaught = firstTaughtMap(course, graph);
  const overrides = opts.overrides || readOverrides();
  const lecture = new Set(Object.values(win.BUZZ_LECTURE_PAPERS || {}).flatMap((x) => x.ids || []));
  const bossIds = new Set(Object.values(course.bosses).map((b) => b.problemId));

  // 模板母題：結構鍵相同 ∪ 同一個 variantOf／tmpl 家族（union-find）
  const parent = new Map();
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { const ra = find(a); const rb = find(b); if (ra !== rb) parent.set(rb, ra); };
  problems.forEach((p) => parent.set(p.id, p.id));
  const byKey = new Map();
  const byMother = new Map();
  problems.forEach((p) => {
    const k = structureKey(p);
    if (byKey.has(k)) union(byKey.get(k), p.id); else byKey.set(k, p.id);
    const m = templateMother(p);
    if (m) { if (byMother.has(m)) union(byMother.get(m), p.id); else byMother.set(m, p.id); }
  });
  const clusterMembers = new Map();
  problems.forEach((p) => { const r = find(p.id); (clusterMembers.get(r) || clusterMembers.set(r, []).get(r)).push(p.id); });
  const noveltyOf = new Map();
  clusterMembers.forEach((ids) => ids.forEach((id) => noveltyOf.set(id, ids[0])));

  const profiles = new Map();
  const meta = new Map(); // 給報表：信心、命中方式、理由
  problems.forEach((p) => {
    const f = featuresOf(p, graph);
    const fam = classifyFamily(f);
    const axes = rubric && rubric.axesFor ? rubric.axesFor(p.id) : null;
    const uses = course.usage[p.id] || [];
    // 先修課：每一個技巧第一次被教的課。題目被課程直接用了（推薦題、範例）→ 那一課就是在教它：
    //   每個技巧的先修課取「第一次被教」跟「這題第一次出現的課」較早的那一個；技巧整套課都沒教的也用第一次出現的課。
    //   沒有這一條的話，117 筆人工挑的推薦題（52 筆核心題）會因為粗 tag 對應的誤差被擋掉
    //   （例如積分表那一課的 ∫1/(1+x²) 被歸成三角代換），熟練永遠拿不到。
    //   純技巧推得的先修課另外存在 meta.rawGates —— 跟課程放的位置對不上的那些是 Phase 3 課程重新對應的待辦。
    const firstUse = uses.length ? Math.min(...uses.map((u) => u.index)) : Infinity;
    const gateIdx = new Set();
    const rawIdx = new Set();
    const untaught = [];
    [...f.skills].forEach((s) => {
      if (s in firstTaught) { rawIdx.add(firstTaught[s]); gateIdx.add(Math.min(firstTaught[s], firstUse)); } else untaught.push(s);
    });
    if (!gateIdx.size && uses.length) gateIdx.add(firstUse);
    const gates = [...gateIdx].sort((a, b) => a - b).map((i) => course.order[i]);
    const rawGates = [...rawIdx].sort((a, b) => a - b).map((i) => course.order[i]);

    const roles = new Set();
    uses.forEach((u) => roles.add(u.kind === "core" ? "course_core" : "course_extra"));
    if (bossIds.has(p.id) || f.tag("true-boss")) roles.add("boss");
    if (lecture.has(p.id) || (f.tag("exam-style") && f.rank >= 3)) roles.add("exam");
    if (f.rank >= 3 && f.rank <= 5 && !p.graph) roles.add("daily");
    const reflexHigh = fam.families[0] === "super_high_derivative" && f.rank >= 5;
    if (f.tag("burst")) roles.add(f.rank >= 4 ? "arena" : "fluency_drill");
    if (f.tag("competition", "putnam", "hardcore") || reflexHigh) roles.add("arena");
    if (f.tag("technique-sprint") || /^tmpl-/.test(p.id) || p.variantOf) roles.add("fluency_drill");
    if (f.tag("technique-recognition", "trap-drill")) roles.add("method_choice");
    if (/^(text|set|interval)$/.test(f.kind) && !roles.has("method_choice")) roles.add("concept_check");
    if (f.tag("limit-from-table", "beginner-foundation")) roles.add("concept_check");
    if (/^(graph|graphtap|graphslope|sketch)$/.test(f.kind) || f.tag("graph-reading")) roles.add("visual");
    if (f.tag("story-problem", "word-problem", "applied-derivative", "applications", "kinematics")) roles.add("modeling");
    // 一般練習池的成員：除了「純反射的超高階導數」之外都是（它們留給 arena／boss，不當課程預設）
    if (!reflexHigh) roles.add("general_practice");

    const prof = {
      methodFamily: fam.families,
      cognitiveAction: cognitiveActions(f),
      difficultyMode: difficultyModes(f, axes),
      prerequisiteGate: gates,
      learningRole: taxonomy.LEARNING_ROLES.filter((r) => roles.has(r)),
      representation: representationOf(f),
      noveltyFamily: noveltyOf.get(p.id),
      templateMother: templateMother(p),
      defaultWeight: 1
    };
    const ov = overrides[p.id];
    if (ov) Object.keys(ov).forEach((k) => { if (k !== "why" && k in prof) prof[k] = ov[k]; });
    profiles.set(p.id, prof);
    meta.set(p.id, { confidence: ov && ov.methodFamily ? "manual" : fam.confidence, how: fam.primary.how, why: fam.primary.why, alternatives: fam.alternatives, untaught, rawGates, uses, overridden: Boolean(ov) });
  });

  // defaultWeight：模板飽和 → 反射題 → 上限
  const clusterSize = new Map();
  profiles.forEach((pr) => clusterSize.set(pr.noveltyFamily, (clusterSize.get(pr.noveltyFamily) || 0) + 1));
  const base = new Map();
  problems.forEach((p) => {
    const pr = profiles.get(p.id);
    let w = 1 / Math.sqrt(clusterSize.get(pr.noveltyFamily) || 1);
    if (!pr.learningRole.includes("general_practice")) w *= 0.6;
    base.set(p.id, w);
  });
  const groups = new Map();
  problems.forEach((p) => {
    const g = `${p.topic}|${Number(p.rank)}`;
    if (!groups.has(g)) groups.set(g, new Map());
    const fam = profiles.get(p.id).methodFamily[0];
    groups.get(g).set(fam, (groups.get(g).get(fam) || 0) + base.get(p.id));
  });
  const factor = sampler.clampShares(groups, taxonomy.EXPOSURE_CAPS);
  problems.forEach((p) => {
    const pr = profiles.get(p.id);
    const ov = overrides[p.id];
    if (ov && typeof ov.defaultWeight === "number") { pr.defaultWeight = ov.defaultWeight; return; }
    const k = factor.get(`${p.topic}|${Number(p.rank)}|${pr.methodFamily[0]}`);
    const w = base.get(p.id) * (k === undefined ? 1 : k);
    // 兩位小數；上限是 0% 的格子才會真的變 0，其餘至少 0.01（不要因為四捨五入就整題消失）。
    // 被上限壓過的家族無條件捨去 —— 四捨五入會讓剛好壓在 20% 的格子變成 20.1%
    const q = k !== undefined && k < 1 ? Math.floor(w * 100) / 100 : Math.round(w * 100) / 100;
    pr.defaultWeight = w <= 0 ? 0 : Math.max(0.01, q);
  });

  return { profiles, meta, course, firstTaught, clusterMembers, noveltyOf };
}

/* ── 執行期的精簡編碼（src/kernel/problem_profiles.js）────────────── */
function encodeRuntime(problems, built) {
  const famList = [];
  const famIdx = new Map();
  const packList = [];
  const packIdx = new Map();
  const idx = (list, map, v) => { if (!map.has(v)) { map.set(v, list.length); list.push(v); } return map.get(v); };
  const lessonIndex = new Map(built.course.order.map((id, i) => [id, i]));
  const roleBit = new Map(taxonomy.LEARNING_ROLES.map((r, i) => [r, 1 << i]));
  const rows = problems.map((p) => {
    const pr = built.profiles.get(p.id);
    const fam = pr.methodFamily.map((x) => idx(famList, famIdx, x).toString(36)).join(".");
    const nov = pr.noveltyFamily === p.id ? "" : pr.noveltyFamily;
    const w = Math.round(pr.defaultWeight * 100);
    const roles = pr.learningRole.reduce((m, r) => m | (roleBit.get(r) || 0), 0).toString(36);
    const gates = pr.prerequisiteGate.map((g) => lessonIndex.get(g).toString(36)).join(".");
    const pack = p.source ? idx(packList, packIdx, p.source).toString(36) : "";
    return [p.id, fam, nov, w, roles, gates, pr.templateMother || "", pack].join("\t");
  });
  return {
    v: 1,
    families: famList,
    packs: packList,
    roles: taxonomy.LEARNING_ROLES,
    lessons: built.course.order,
    caps: taxonomy.EXPOSURE_CAPS.map(({ topic, ranks, families, any, max }) => ({ topic, ranks, ...(any ? { any: true } : { families }), max })),
    session: taxonomy.SESSION,
    rows: rows.join("\n")
  };
}

module.exports = { buildProfiles, encodeRuntime, featuresOf, classifyFamily, structureKey, RULES, OVERRIDES_FILE, loadCourse };
