(function () {
  "use strict";

  const problems = window.BUZZ_PROBLEMS || [];
  const proofs = window.BUZZ_PROOFS || [];
  const CUSTOM = window.BUZZ_CUSTOM || null;
  const app = document.getElementById("app");

  const TOPICS = {
    all: { label: "全混合", short: "All", className: "", accent: "#f6b739" },
    limits: { label: "極限", short: "Lim", className: "topic-limits", accent: "#f6b739" },
    derivatives: { label: "微分", short: "Der", className: "topic-derivatives", accent: "#4ba8dd" },
    integrals: { label: "積分", short: "Int", className: "topic-integrals", accent: "#9370d8" },
    series: { label: "級數", short: "Ser", className: "topic-series", accent: "#31ad72" }
  };

  // 2026-08：理科秒殺包（物理 90 + 化學 81）已從 BuzzCalculus 移除。
  // 這個站專攻微積分，理科歸姊妹站 BuzzPhysics —— 一個站同時放兩科，
  // 抽題、雷達、主線都要處處防污染，成本比價值高。
  // 題庫現在是純微積分，由 tools/validate_calculus_only.js 在 CI 鎖住。

  const MODES = {
    quick: {
      label: "快速訓練",
      bucket: "practice",
      note: "12 題混合",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false
    },
    topic: {
      label: "單題型訓練",
      bucket: "practice",
      note: "單主題 10 題",
      count: 10,
      topicLocked: true,
      daily: false,
      boss: false
    },
    daily: {
      label: "每日挑戰",
      bucket: "challenge",
      note: "每日固定題組",
      count: 12,
      topicLocked: false,
      daily: true,
      boss: false
    },
    practice: {
      label: "練習模式",
      bucket: "practice",
      note: "不限時不扣分 12 題",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      practice: true
    },
    brutal: {
      label: "進階訓練",
      bucket: "challenge",
      note: "只抽難題 14 題",
      count: 14,
      topicLocked: false,
      daily: false,
      boss: false,
      hardOnly: true
    },
    boss: {
      label: "階梯測驗",
      bucket: "challenge",
      note: "由易到難 16 題",
      count: 16,
      topicLocked: false,
      daily: false,
      boss: true
    },
    boss_rush: {
      label: "Boss 連戰",
      bucket: "challenge",
      note: "Boss 題連戰，錯一題就結算",
      count: 10,
      topicLocked: false,
      daily: false,
      boss: true,
      suddenDeath: true
    },
    daily_one: {
      label: "每日一題",
      bucket: "challenge",
      note: "全站同一題，一天一次",
      count: 1,
      topicLocked: false,
      daily: false,
      boss: false
    },
    exam: {
      label: "大考模式",
      bucket: "exam",
      note: "20 題 / 45 分鐘，整份倒數，自己輸入答案",
      count: 20,
      topicLocked: false,
      daily: false,
      boss: false,
      exam: true,
      examDurationSec: 45 * 60,
      noHint: true,
      forceAnswerMode: "free",
      examStyle: true,
      minRank: 3
    },
    integral_bee: {
      label: "Integral Bee",
      bucket: "challenge",
      note: "積分速度訓練 12 題",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      integralBee: true
    },
    no_hint: {
      label: "No Hint",
      bucket: "practice",
      note: "無提示計分挑戰",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      noHint: true
    },
    accuracy: {
      label: "正確率",
      bucket: "challenge",
      note: "不限時，錯題重罰",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      noTimer: true,
      accuracyMode: true
    },
    survival: {
      label: "生存",
      bucket: "challenge",
      note: "最多錯 3 題",
      count: 30,
      topicLocked: false,
      daily: false,
      boss: false,
      survival: true
    },
    pressure: {
      label: "壓力訓練",
      bucket: "challenge",
      note: "計時逐題縮短，練「會但來不及」",
      count: 10,
      topicLocked: false,
      daily: false,
      boss: false,
      pressureMode: true
    },
    warmup: {
      label: "Warm-up",
      bucket: "practice",
      note: "入場暖身 5 題",
      count: 5,
      topicLocked: false,
      daily: false,
      boss: false,
      maxRank: 2
    },
    cooldown: {
      label: "Cooldown",
      bucket: "practice",
      note: "收操複習，不計分",
      count: 5,
      topicLocked: false,
      daily: false,
      boss: false,
      practice: true,
      cooldown: true
    },
    mistakes: {
      label: "錯題重練",
      bucket: "weakness",
      note: "錯題重練",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      hidden: true
    },
    placement: {
      label: "定位測驗",
      bucket: "practice",
      note: "8 題調適定位，約 5 分鐘",
      count: 8,
      topicLocked: false,
      daily: false,
      boss: false,
      hidden: true
    }
  };

  const ANSWER_MODES = {
    choice: {
      label: "選擇題",
      note: "四選一，點選即作答"
    },
    free: {
      label: "自己寫",
      note: "答案欄 + 算式預覽 + 手寫計算紙"
    }
  };

  const TRAINING_PACKS = {
    // 題包 key 一律不改（分享連結與既有紀錄靠它），只把對外顯示的名校字樣換成
    // Buzz 自己的難度語言。出處保留在 problem.school，只在題庫詳情露出。
    todai_burst: { label: "高速反射 R6", note: "R6 IBP / Wallis / 高階導數速決", tags: ["todai-burst"] },
    nightmare_boss: { label: "終極挑戰", note: "R6 最難題：硬派數分 / 理論型 / 長鏈推導", tags: ["true-boss"] },
    world_universities: { label: "國際難題", note: "R1-R6 全跨度，由易到爆難 100 題", tags: ["world-universities"] },
    competition: { label: "競賽難題", note: "競賽級：硬微分 / 應用難題（R4-6）", tags: ["competition"] },
    damo_longform: { label: "長題挑戰", note: "競賽風格長題：漸近 / 難積分 / 難級數（R4-6）", tags: ["damo"] },
    putnam: { label: "競賽經典", note: "競賽風格經典題型（R4-6）", tags: ["putnam"] },
    all: { label: "全部技巧", note: "不限制 tags", tags: [] },
    beginner_warmup: { label: "新手暖身", note: "R1-R2 基礎題", tags: ["beginner-friendly"] },
    boss_challenge: { label: "Boss 挑戰", note: "R5-R6 防強人題", tags: ["boss-rank"] },
    exam_style: { label: "大考題感", note: "轉學考 / 免修 / 段考式混合題", tags: ["exam-style"] },
    exam_depth: { label: "大考深水區", note: "R5-R6 多步驟混合題", tags: ["exam-depth"] },
    multivariable: { label: "多變數", note: "極限 / 偏導 / 二重積分", tags: ["multivariable"] },
    taylor: { label: "Taylor", note: "展開與係數", tags: ["taylor", "coefficient"] },
    chain: { label: "鏈鎖律", note: "一元與偏導鏈鎖律", tags: ["chain-rule"] },
    substitution: { label: "換元積分", note: "u-sub 與座標換元", tags: ["substitution", "polar-coordinates"] },
    trig_substitution: { label: "三角代換", note: "根式與反三角型", tags: ["trig-substitution"] },
    integration_by_parts: { label: "分部積分", note: "IBP 與循環分部", tags: ["integration-by-parts", "ibp"] },
    partial_fraction: { label: "Partial Fraction", note: "有理函數拆分", tags: ["partial-fraction"] },
    ode_style: { label: "ODE 型積分", note: "卷積 / 參數積分", tags: ["ode-style", "convolution", "parameter-integral"] },
    kings_property: { label: "King's", note: "對稱定積分", tags: ["kings-property"] },
    double_integral: { label: "二重積分", note: "區域 / 換序 / 極座標", tags: ["double-integral", "polar-coordinates"] },
    multi_integral_advanced: { label: "多重積分進階", note: "三重積分 / 變數變換", tags: ["triple-integral", "change-of-variables"] },
    frullani: { label: "Frullani", note: "廣義積分公式", tags: ["frullani"] },
    total_differential: { label: "全微分", note: "估計 / 最小化", tags: ["total-differential", "total-differential-min"] },
    hessian: { label: "Hessian", note: "二階判別 / 極值", tags: ["hessian"] },
    wronskian: { label: "Wronskian", note: "線性獨立判定", tags: ["wronskian"] },
    jacobian_chain: { label: "Jacobian 鏈鎖", note: "合成映射行列式", tags: ["jacobian-chain", "jacobian"] },
    parametric_polar: { label: "參數 / 極座標", note: "參數微分與極座標面積", tags: ["parametric", "polar-curve"] },
    applications: { label: "微分應用", note: "相關變率 / 最佳化 / 隱微分 / 曲率", tags: ["related-rates", "tangent-normal", "linear-approximation", "newton-method", "curvature", "optimization", "implicit-differentiation"] },
    classic_theory: { label: "經典觀念", note: "L'Hôpital / MVT / 連續性 / 曲線分析", tags: ["lhopital", "mvt", "rolle", "continuity", "ivt", "concavity", "inflection", "asymptote", "squeeze"] },
    vector_theorems: { label: "向量三大定理", note: "線積分 / Green / Stokes / 散度定理", tags: ["line-integral", "green-theorem", "stokes-theorem", "divergence-theorem", "surface-integral", "flux", "conservative-field"] },
    integral_applications: { label: "積分應用", note: "弧長 / 旋轉體 / 平均值 / Riemann 和", tags: ["arc-length", "solid-of-revolution", "surface-area", "average-value", "riemann-sum", "area"] },
    sequences: { label: "數列", note: "極限 / 遞迴 / 夾擠", tags: ["sequence", "recursive"] },
    applied_story: { label: "應用情境", note: "運動 / 冷卻 / 功 / 混合 / 邊際", tags: ["story-problem"] },
    graph_reading: { label: "圖形判讀", note: "看圖答：面積 / 極值 / 反曲點", tags: ["graph-reading"] },
    complex: { label: "複變", note: "CR / 留數 / 調和", tags: ["complex"] },
    ode_intro: { label: "ODE 入門", note: "一階 / 二階基本方程", tags: ["ode-intro"] },
    series_test: { label: "級數判別", note: "比值 / 積分 / p 級數", tags: ["ratio-test", "root-test", "integral-test", "p-series", "alternating-series", "comparison"] },
    power_series: { label: "冪級數", note: "半徑與 Taylor 係數", tags: ["power-series", "radius", "taylor", "coefficient"] },
    endpoint_root: { label: "端點 / Root Test", note: "端點分析與根值判別", tags: ["endpoint-analysis", "root-test", "limit-comparison"] },
    technique_recognition: { label: "技巧辨識", note: "先判斷該用哪個工具", tags: ["technique-recognition"] },
    mobile_sprint: { label: "Mobile Sprint", note: "技巧辨識 / 陷阱 / 極限快練", tags: ["technique-sprint", "trap-drill", "limit-trap"] },
    lagrange_multiplier: { label: "LM", note: "Lagrange multiplier 最值", tags: ["lagrange-multiplier"] },
    convergence_tests: { label: "審斂", note: "級數判別與端點", tags: ["convergence-test", "endpoint-analysis", "root-test", "limit-comparison"] },
    special_functions: { label: "特殊函數", note: "Beta / Gamma / Wallis / Bessel", tags: ["beta-function", "gamma-function", "wallis", "bessel"] },
    nabla_vector: { label: "Nabla / Vector", note: "grad / div / curl / laplacian", tags: ["nabla", "vector-calculus"] },
  };

  const PACK_GROUPS = [
    { label: "競賽 / 難題", keys: ["putnam", "competition", "damo_longform", "world_universities", "nightmare_boss", "todai_burst"] },
    { label: "常用", keys: ["all", "beginner_warmup", "boss_challenge", "exam_style", "exam_depth", "mobile_sprint", "technique_recognition", "applied_story", "graph_reading", "multivariable", "substitution", "integration_by_parts", "series_test"] },
    { label: "積分技巧", keys: ["partial_fraction", "trig_substitution", "frullani", "ode_style", "kings_property", "double_integral", "multi_integral_advanced", "integral_applications"] },
    { label: "向量分析", keys: ["vector_theorems", "nabla_vector"] },
    { label: "微分 / 應用", keys: ["chain", "lagrange_multiplier", "parametric_polar", "applications", "classic_theory", "total_differential", "hessian", "wronskian", "jacobian_chain"] },
    { label: "級數 / ODE / 其他", keys: ["taylor", "power_series", "convergence_tests", "endpoint_root", "sequences", "special_functions", "ode_intro", "complex"] },
  ];

  const PATH_NODES = [
    { id: "onevar_limit", label: "單變極限", short: "極限", note: "先練標準極限、Taylor、化簡", topic: "limits", mode: "quick", icon: "zap", target: 16, maxRank: 3, excludeTags: ["multivariable", "path-test"] },
    { id: "onevar_diff", label: "單變微分", short: "微分", note: "乘除、鏈鎖、隱微分與 log 微分", topic: "derivatives", mode: "quick", icon: "git-branch", target: 16, maxRank: 3, excludeTags: ["multivariable", "hessian", "jacobian", "wronskian", "nabla", "vector-calculus", "complex"] },
    { id: "basic_integral", label: "基礎積分", short: "積分", note: "先把基本反導數和定積分節奏打穩", topic: "integrals", mode: "quick", icon: "play", target: 16, maxRank: 3, excludeTags: ["frullani", "ode-style", "trig-substitution", "kings-property", "triple-integral", "change-of-variables"] },
    { id: "usub", label: "U-sub 換元", short: "U-sub", note: "看到內外層就要反射換元", pack: "substitution", topic: "integrals", mode: "quick", icon: "shuffle", target: 14 },
    { id: "ibp", label: "分部積分", short: "IBP", note: "判斷誰微分、誰積分", pack: "integration_by_parts", topic: "integrals", mode: "quick", icon: "repeat", target: 12 },
    { id: "integral_tools", label: "技巧積分", short: "技巧", note: "Partial fraction、三角代換、King's、Frullani", topic: "integrals", mode: "quick", icon: "target", target: 18, includeTags: ["partial-fraction", "trig-substitution", "kings-property", "frullani", "ode-style", "improper-integral"] },
    { id: "series", label: "級數與審斂", short: "級數", note: "比值、根值、比較、端點分析", topic: "series", mode: "quick", icon: "list-checks", target: 18 },
    { id: "multivariable", label: "多變數", short: "多變", note: "多變極限、偏導、二重積分", pack: "multivariable", mode: "quick", icon: "boxes", target: 18 },
    { id: "advanced_tools", label: "進階工具", short: "進階", note: "Hessian、Jacobian、LM、Nabla、複變", mode: "quick", icon: "wrench", target: 18, includeTags: ["hessian", "jacobian-chain", "lagrange-multiplier", "nabla", "vector-calculus", "complex", "total-differential"] },
    { id: "boss", label: "Boss 挑戰", short: "Boss", note: "R5-R6 防強人題，可直接挑戰", pack: "boss_challenge", mode: "boss", icon: "trophy", target: 20, boss: true }
  ];

  const PATH_LESSONS = {
    onevar_limit: {
      focus: "先判斷能不能直接代入；不行再看化簡、標準極限或 Taylor。",
      bullets: ["0/0 通常先因式分解、約分或有理化。", "sin x / x、(1-cos x)/x^2、log(1+x) 是高頻核心。", "高階小量相減時，Taylor 通常最快。"],
      example: "\\lim_{x\\to 0}\\frac{\\sin x}{x}=1"
    },
    onevar_diff: {
      focus: "單變微分的重點是先看外層，再處理內層。",
      bullets: ["乘積、商數、鏈鎖律要先判型。", "log 微分適合冪次、乘除混合的式子。", "隱微分時 y 是 y(x)，微分 y 要補 y'。"],
      example: "\\frac{d}{dx}\\sin(x^2)=2x\\cos(x^2)"
    },
    basic_integral: {
      focus: "基礎積分先反向看微分表，不急著套高級技巧。",
      bullets: ["冪次、指數、三角函數先用基本表。", "定積分要注意上下限與對稱。", "答案差一個常數仍是同一個不定積分。"],
      example: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C"
    },
    usub: {
      focus: "看到內函數和它的導數同時出現，就先想 U-sub。",
      bullets: ["先找最複雜的內層當 u。", "du 要能吃掉剩下的因子。", "定積分換元後上下限也要一起換。"],
      example: "\\int x e^{x^2}\\,dx"
    },
    ibp: {
      focus: "分部積分用在一個因子會變簡單、另一個因子容易積的情況。",
      bullets: ["常見選擇：log、反三角、x^n 優先微分。", "e^x、sin x、cos x 通常拿去積分。", "循環分部時要把原積分移回同一邊。"],
      example: "\\int x e^x\\,dx"
    },
    integral_tools: {
      focus: "技巧積分先判形狀，再選工具，不要硬算。",
      bullets: ["有理函數先想 partial fraction。", "根式 a^2-x^2、x^2+a^2 常對應三角代換。", "對稱定積分、Frullani、廣義積分要先看條件。"],
      example: "\\int \\frac{1}{x^2-1}\\,dx"
    },
    series: {
      focus: "級數先做快速排除，再選審斂法。",
      bullets: ["第 n 項不趨近 0，直接發散。", "p-series、幾何級數先認出來。", "冪級數半徑用 ratio/root，端點要另外檢查。"],
      example: "\\sum_{n=1}^{\\infty}\\frac{1}{n^p}"
    },
    multivariable: {
      focus: "多變數先分清楚：極限看路徑，偏導固定其他變數，積分看區域。",
      bullets: ["多變極限常用路徑測試或極座標。", "偏導時其他變數先當常數。", "二重積分先畫區域，再決定是否換序或換座標。"],
      example: "\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}"
    },
    advanced_tools: {
      focus: "進階工具不是硬算，是先辨識結構。",
      bullets: ["Hessian 用來判斷多變數極值。", "Jacobian 負責變數變換的面積倍率。", "LM、Nabla、複變題先判定使用哪個框架。"],
      example: "\\det\\frac{\\partial(u,v)}{\\partial(x,y)}"
    },
    boss: {
      focus: "Boss 題混合多種技巧，第一步永遠是判型。",
      bullets: ["先判斷題目屬於極限、微分、積分、級數或多變數。", "看到特殊結構先想工具，不要直接展開硬算。", "速度來自少走錯路，不只是算得快。"],
      example: "\\text{identify the tool first}"
    }
  };

  // Feature 5：5 分鐘定位測驗。8 題調適（對→升一階、錯→降一階），
  // 結果映射到主線節點，沿用跳關的 pathUnlocks 機制解鎖。
  const PLACEMENT_COUNT = 8;
  const PLACEMENT_START_RANK = 2;
  const PLACEMENT_NODE_BY_RANK = {
    1: "onevar_limit",
    2: "basic_integral",
    3: "ibp",
    4: "integral_tools",
    5: "multivariable",
    6: "advanced_tools"
  };
  // 弱點統計時略過的「卷別」類 meta tags（不是技巧）。
  const META_ANALYSIS_TAGS = new Set([
    "exam-style",
    "exam-depth",
    "transfer-exam",
    "proficiency-exam",
    "midterm-style",
    "university-exam-style",
    "boss-rank",
    "boss-plus",
    "beginner-friendly",
    "depth-r5",
    "depth-r6"
  ]);

  // Feature 10：具名模擬卷。同一份卷在同一個 attempt 次數下抽題固定
  //（seed = 卷 id + 次數），重考才換一份新卷。及格線 60%。
  const NAMED_EXAM_PASS_RATE = 0.6;
  const SINGLE_VARIABLE_EXCLUDE_TAGS = [
    "multivariable",
    "double-integral",
    "triple-integral",
    "change-of-variables",
    "hessian",
    "jacobian",
    "jacobian-chain",
    "wronskian",
    "lagrange-multiplier",
    "nabla",
    "vector-calculus",
    "total-differential",
    "total-differential-min",
    "complex",
    "ode-intro"
  ];
  const NAMED_EXAMS = {
    midterm: {
      label: "期中模擬",
      note: "60 分鐘 · 12 題 · R2-R4 · 單變數",
      count: 12,
      durationSec: 60 * 60,
      minRank: 2,
      maxRank: 4,
      singleVariable: true
    },
    final: {
      label: "期末模擬",
      note: "90 分鐘 · 15 題 · R3-R5 · 全主題",
      count: 15,
      durationSec: 90 * 60,
      minRank: 3,
      maxRank: 5
    },
    transfer: {
      label: "轉學考風格",
      note: "90 分鐘 · 15 題 · R3-R6 · 大考題感",
      count: 15,
      durationSec: 90 * 60,
      minRank: 3,
      maxRank: 6,
      preferTags: ["transfer-exam", "exam-style"]
    },
    integral_bee: {
      label: "Integral Bee 快篩",
      note: "20 分鐘 · 10 題 · 積分 R4-R6",
      count: 10,
      durationSec: 20 * 60,
      minRank: 4,
      maxRank: 6,
      topic: "integrals"
    },
    // 2026-09 擴充：免修考與段考各有自己的節奏 —— 免修考偏難偏廣，
    // 段考短而基本。用既有的 preferTags 機制，不動抽卷邏輯。
    exemption: {
      label: "免修考風格",
      note: "60 分鐘 · 12 題 · R3-R6 · 免修/檢定題感",
      count: 12,
      durationSec: 60 * 60,
      minRank: 3,
      maxRank: 6,
      preferTags: ["proficiency-exam", "university-exam-style"]
    },
    quiz_sprint: {
      label: "段考衝刺",
      note: "45 分鐘 · 10 題 · R2-R4 · 段考節奏",
      count: 10,
      durationSec: 45 * 60,
      minRank: 2,
      maxRank: 4,
      preferTags: ["midterm-style", "exam-style"]
    }
  };

  const STORAGE_KEY = "buzzcalculus.records.v1";
  const THEME_KEY = "buzzcalculus.theme";
  const SYNC_META_KEY = "buzzcalculus.sync.meta";
  // 數字要在鍵盤上。
  //
  // 原本只有符號與函數，沒有 0–9 —— 於是「2*x^3」「3/4」「pi/4」這種答案
  // 一定得叫出系統鍵盤。在 iPad 上那代表：放下筆、鍵盤蓋掉半個畫面、
  // 蓋住的正是剛剛寫滿算式的計算紙。
  // 鍵盤補上數字之後，這個作答介面才真的是一個「不用系統鍵盤也能打完」的東西。
  const WEBWORK_KEY_GROUPS = [
    { label: "數字", keys: ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "-"] },
    { label: "常用", keys: ["x", "pi", "e", "(", ")", "+", "*", "/", "^"] },
    { label: "函數", keys: ["sqrt(|)", "sin(|)", "cos(|)", "tan(|)", "log(|)", "exp(|)"] },
    { label: "判定", keys: ["DNE", "convergent", "divergent", "conditional"] }
  ];
  const DIGIT_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "-"];
  const ERROR_TAGS = ["粗心", "不會", "忘公式"];
  const PROOF_TIERS = {
    all: "全部",
    basic: "基礎",
    standard: "標準",
    advanced: "進階",
    boss: "終極",
    contest: "競賽",
    lean: "Lean"
  };
  const SIMPLE_MODE_KEYS = ["quick", "topic", "practice"];
  const EXPERIMENTAL_MODE_KEYS = ["exam", "pressure", "boss_rush", "brutal", "boss", "integral_bee", "no_hint", "accuracy", "survival", "warmup", "cooldown"];
  const DEFAULT_DIFFICULTY_CAP = 2;
  const DIFFICULTY_LEVELS = {
    1: { label: "入門", note: "只抽 R1，先建立基礎。", short: "R1" },
    2: { label: "新手", note: "R1-R2，避開 Taylor 和怪題。", short: "R1-R2" },
    3: { label: "標準", note: "R1-R3，開始進入段考基本題型。", short: "R1-R3" },
    4: { label: "進階", note: "R1-R4，加入多步驟與常見陷阱。", short: "R1-R4" },
    5: { label: "高手", note: "R1-R5，Boss 題會進一般抽題。", short: "R1-R5" },
    6: { label: "大師", note: "R1-R6，高速反射 / Wallis / 特殊函數全開。", short: "R1-R6" }
  };
  const LIBRARY_PAGE_SIZE = 72;
  const TAG_LABELS = {
    // 出處型 tag 的顯示名：tag key 保留（抽題與既有資料靠它），
    // 但畫面上一律講 Buzz 自己的難度語言，不掛學校名。
    "todai-burst": "高速反射",
    "world-universities": "國際難題",
    damo: "長題挑戰",
    putnam: "競賽經典",
    competition: "競賽難題",
    "true-boss": "終極挑戰",
    "multi-ibp": "multi-IBP",
    "trig-power": "Trig power",
    "recurrence-formula": "Recurrence",
    "super-high-derivative": "High derivative",
    "special-function": "Special function",
    "series-integral": "Series integral",
    "beginner-friendly": "新手友善",
    "boss-rank": "Boss",
    "boss-plus": "Boss+",
    custom: "自訂",
    "hard-limit": "硬極限",
    "asymptotic-expansion": "漸近展開",
    "generating-function": "生成函數",
    "harmonic-number": "調和數",
    "laplace-transform": "Laplace",
    "exam-style": "大考題感",
    "exam-depth": "大考深水",
    "depth-r5": "R5 深水",
    "depth-r6": "R6 深水",
    "transfer-exam": "轉學考",
    "proficiency-exam": "免修考",
    "technique-recognition": "技巧辨識",
    "technique-sprint": "速判",
    "trap-drill": "陷阱",
    "limit-trap": "極限陷阱",
    taylor: "Taylor",
    coefficient: "係數",
    rationalize: "有理化",
    "trig-limit": "三角極限",
    "chain-rule": "鏈鎖律",
    substitution: "U-sub",
    "integration-by-parts": "IBP",
    ibp: "IBP",
    "trig-substitution": "三角代換",
    "partial-fraction": "Partial Fraction",
    "ode-style": "ODE 型",
    "kings-property": "King's",
    frullani: "Frullani",
    "improper-integral": "廣義積分",
    "double-integral": "二重積分",
    "triple-integral": "三重積分",
    "change-of-variables": "變數變換",
    multivariable: "多變數",
    hessian: "Hessian",
    wronskian: "Wronskian",
    jacobian: "Jacobian",
    "jacobian-chain": "Jacobian 鏈鎖",
    "lagrange-multiplier": "LM",
    nabla: "Nabla",
    "vector-calculus": "向量分析",
    "total-differential": "全微分",
    "total-differential-min": "全微分最小",
    complex: "複變",
    "ode-intro": "ODE 入門",
    "power-series": "冪級數",
    radius: "收斂半徑",
    "ratio-test": "Ratio",
    "root-test": "Root",
    "integral-test": "Integral Test",
    "p-series": "p-series",
    "alternating-series": "交錯級數",
    comparison: "比較判別",
    "limit-comparison": "極限比較",
    "endpoint-analysis": "端點分析",
    "convergence-test": "審斂",
    "beta-function": "Beta",
    "gamma-function": "Gamma",
    wallis: "Wallis",
    bessel: "Bessel",
    parametric: "參數式",
    "polar-curve": "極座標",
    "related-rates": "相關變率",
    "tangent-normal": "切線法線",
    "linear-approximation": "線性近似",
    "newton-method": "Newton",
    curvature: "曲率",
    "nested-taylor": "巢狀 Taylor",
    "composite-taylor": "複合 Taylor",
    "asymptotic-balance": "漸近配平",
    "power-exponential": "變冪函數",
    "moving-limits": "變動上下限",
    laplacian: "Laplacian",
    region: "積分區域",
    "special-sum": "特殊級數",
    "line-integral": "線積分",
    "green-theorem": "Green 定理",
    "stokes-theorem": "Stokes 定理",
    "divergence-theorem": "散度定理",
    "surface-integral": "面積分",
    flux: "通量",
    "conservative-field": "保守場",
    "vector-identity": "向量恆等式",
    "directional-derivative": "方向導數",
    lhopital: "L'Hôpital",
    mvt: "均值定理",
    rolle: "Rolle",
    continuity: "連續性",
    ivt: "IVT 勘根",
    concavity: "凹凸性",
    inflection: "反曲點",
    asymptote: "漸近線",
    "implicit-differentiation": "隱微分",
    optimization: "最佳化",
    "arc-length": "弧長",
    "solid-of-revolution": "旋轉體",
    "surface-area": "曲面面積",
    "average-value": "平均值",
    "riemann-sum": "Riemann 和",
    ftc: "FTC",
    sequence: "數列",
    recursive: "遞迴數列",
    squeeze: "夾擠",
    telescoping: "望遠鏡和",
    "story-problem": "情境題",
    kinematics: "運動學",
    "work-integral": "功",
    "newton-cooling": "冷卻定律",
    "half-life": "半衰期",
    mixing: "混合問題",
    marginal: "邊際分析",
    centroid: "形心",
    "graph-reading": "讀圖",
    power: "功率"
  };
  const ONBOARDING_LEVELS = {
    beginner: { label: "先暖身", pack: "beginner_warmup", mode: "warmup", topic: "all", difficultyCap: 2 },
    standard: { label: "照主線", pack: "all", mode: "daily", topic: "all", difficultyCap: 3 },
    advanced: { label: "直接挑戰", pack: "boss_challenge", mode: "boss_rush", topic: "all", difficultyCap: 6 }
  };
  const HISTORY_LIMIT = 40;
  const RECENT_PROBLEM_COOLDOWN = 30;
  const RECENT_STRONG_AVOID = 18;
  const DAY_MS = 86400000;
  const SRS_MAX_INTERVAL_DAYS = 30;
  const HEATMAP_WEEKS = 20;
  const RADAR_AXES = [
    { key: "taylor", label: "Taylor", tags: ["taylor", "coefficient", "nested-taylor", "composite-taylor", "asymptotic-expansion"] },
    { key: "substitution", label: "換元", tags: ["substitution", "trig-substitution", "change-of-variables", "polar-coordinates"] },
    { key: "ibp", label: "分部", tags: ["integration-by-parts", "ibp", "multi-ibp"] },
    { key: "partial_fraction", label: "部分分式", tags: ["partial-fraction"] },
    { key: "improper", label: "瑕積分", tags: ["improper-integral", "frullani", "ode-style", "kings-property", "parameter-integral", "laplace-transform", "convolution"] },
    { key: "series", label: "級數", tags: ["ratio-test", "root-test", "integral-test", "p-series", "alternating-series", "comparison", "limit-comparison", "power-series", "radius", "endpoint-analysis", "convergence-test", "special-sum"] },
    { key: "multivariable", label: "多變數", tags: ["multivariable", "double-integral", "triple-integral", "hessian", "jacobian", "jacobian-chain", "lagrange-multiplier", "nabla", "vector-calculus", "total-differential", "total-differential-min", "line-integral", "surface-integral", "green-theorem", "stokes-theorem", "divergence-theorem", "flux", "conservative-field", "directional-derivative"] },
    { key: "special", label: "特殊函數", tags: ["beta-function", "gamma-function", "wallis", "bessel", "special-function"] }
  ];
  const APP_VERSION = "v1.2.1";
  const BUILD_DATE = "2026-09-01";
  const GA_MEASUREMENT_ID = String(window.BUZZ_GA_MEASUREMENT_ID || "").trim();

  let view = "home";
  let selectedTopic = "all";
  let selectedMode = "quick";
  let selectedAnswerMode = "choice";
  let selectedPack = "all";
  let selectedDifficultyCap = DEFAULT_DIFFICULTY_CAP;
  let selectedBucket = "practice";
  let onboardingStep = "intro";
  let selectedMistakeTopic = "all";
  let selectedHistoryTopic = "all";
  let selectedProofTier = "all";
  let selectedLibraryTopic = "all";
  let selectedLibraryPack = "all";
  let selectedLibraryRank = "all";
  let selectedLibraryFilter = "all";
  let librarySearch = "";
  let librarySearchShouldFocus = false;
  let librarySearchTimer = null;
  let libraryVisibleCount = LIBRARY_PAGE_SIZE;
  let homeMoreOpen = false;
  let sessionSettingsOpen = false;
  let resultsDetailOpen = false;
  let appNotice = "";
  let calibrationPreview = null;
  let eraseConfirm = false;
  // 回報草稿：{ problemId, reason }。null 代表沒有開著的回報視窗。
  let reportDraft = null;
  // service worker 裝好但還在等的新版本；null 代表沒有更新。
  let pendingUpdate = null;
  let updateAccepted = false;
  // 上一次在這題留下的草稿（從 IndexedDB 非同步拿回來）
  let previousBoard = { problemId: "", entry: null, open: false };
  let syncBusy = false;
  let syncMessage = "";
  const openProofSteps = new Set();
  let lastAnimatedView = null;
  let advancedModeOpen = false;
  let selectedTheme = loadThemePreference();
  let deferredInstallPrompt = null;
  let quiz = null;
  let activePathNodeId = "";
  let justUnlockedNodeId = "";
  let creatorDraft = null;
  let creatorEditingId = "";
  let creatorStatus = null;
  let creatorImportPreview = null;
  let tickHandle = null;
  let renderPending = false;
  let lastVisibilityStamp = 0;

  // ── 鍵盤操作 ────────────────────────────────────────────────
  // spec B 區 92-93：鍵盤操作必須完整，數學輸入不能只依賴滑鼠。
  //
  // 一個在鍵盤上打數學的人，每次要按選項都得把手移到滑鼠 —— 那會直接毀掉
  // 「練到反射」這件事，因為反射的瓶頸變成了手的移動而不是腦。
  //
  // 規則：正在輸入時（input / textarea / contenteditable）一律不攔截，
  // 否則使用者打 "h" 會變成叫出提示。
  const SHORTCUTS = [
    { keys: "1 – 4", what: "選擇題直接選 A–D" },
    { keys: "Enter", what: "送出答案 / 下一題" },
    { keys: "空白鍵", what: "下一題" },
    { keys: "H", what: "看提示" },
    { keys: "S", what: "跳過這題" },
    { keys: "Esc", what: "關閉對話框 / 離開本局" },
    { keys: "Tab", what: "對話框內循環焦點（不會跑到後面的畫面）" },
    { keys: "?", what: "顯示這張表" }
  ];

  function isTypingTarget(node) {
    if (!node) return false;
    const tag = String(node.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || node.isContentEditable;
  }

  function clickAction(selector) {
    const node = app.querySelector(selector);
    if (!node || node.disabled) return false;
    node.click();
    return true;
  }

  // 對話框開著的時候，鍵盤不能跑到後面的畫面去。
  //
  // 沒有這一段的話：Tab 會走到被遮住的按鈕上（看不到焦點在哪），
  // Esc 沒有反應，而「刪除全部資料」這種對話框後面就是那顆刪除鈕。
  // 全鍵盤可操作是「這是給認真的人用的」最省成本的訊號，而焦點鎖是它的底線。
  function openModalElement() {
    return app.querySelector("[data-modal]");
  }

  function focusablesIn(node) {
    if (!node) return [];
    const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.filter.call(node.querySelectorAll(selector), (el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    });
  }

  function handleModalKeys(event) {
    const modal = openModalElement();
    if (!modal) return false;

    if (event.key === "Escape") {
      event.preventDefault();
      // 每個對話框都有自己的取消動作，找得到就按它；
      // 找不到就至少不要讓 Esc 冒泡去做別的事。
      const cancel = modal.querySelector('[data-action^="cancel-"], [data-action="dismiss-notice"]');
      if (cancel) cancel.click();
      return true;
    }

    if (event.key !== "Tab") return false;
    const items = focusablesIn(modal);
    if (!items.length) return false;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (!modal.contains(active)) {
      event.preventDefault();
      first.focus();
      return true;
    }
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function handleShortcut(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    // 對話框優先。它在的時候，底下畫面的快捷鍵一律不作用。
    if (handleModalKeys(event)) return;
    if (openModalElement() && event.key !== "?" ) return;
    if (isTypingTarget(event.target)) {
      // 輸入框裡只保留 Esc（離開）與 Enter（交給表單自己處理）
      if (event.key !== "Escape") return;
    }

    const key = event.key;

    if (key === "?" || (event.shiftKey && key === "/")) {
      event.preventDefault();
      showAppNotice("__shortcuts__");
      return;
    }

    if (view !== "quiz" || !quiz) return;

    if (key === "Escape") {
      event.preventDefault();
      if (clickAction('[data-action="confirm-exit"]')) return;
      clickAction('[data-action="home"]');
      return;
    }

    // 有回饋面板時，Enter / 空白鍵都是「下一題」
    if (quiz.feedback && (key === "Enter" || key === " ")) {
      event.preventDefault();
      clickAction('[data-action="next-question"]');
      return;
    }

    if (quiz.feedback) return;

    if (key >= "1" && key <= "4") {
      const options = app.querySelectorAll('[data-action="choose-answer"]');
      const pick = options[Number(key) - 1];
      if (pick) {
        event.preventDefault();
        pick.click();
      }
      return;
    }

    if (key === "h" || key === "H") {
      event.preventDefault();
      clickAction('[data-action="show-hint"]');
      return;
    }

    if (key === "s" || key === "S") {
      event.preventDefault();
      clickAction('[data-action="skip"]');
    }
  }

  function setupAnalytics() {
    // 回訪事件在分析初始化之後打，確保 gtag 已經在了
    window.setTimeout(() => {
      try { trackReturnVisit(loadRecords()); } catch (_error) { /* 分析不能擋住啟動 */ }
    }, 1200);
    if (!GA_MEASUREMENT_ID) return;
    // 關掉的話連 gtag.js 都不要載入 —— 光是載入那支 script 就已經
    // 對 Google 發出請求，帶著 IP 與 User-Agent。只擋事件是不夠的。
    if (!analyticsEnabled()) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      app_version: APP_VERSION,
      build_date: BUILD_DATE
    });
    if (!document.head || !document.createElement) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  // ── 正式事件表 ──────────────────────────────────────────────
  // spec 06.5：新增任何事件必須**先寫進這張表**。
  //
  // 不設白名單的話，半年後這裡會變成一堆沒人記得為什麼存在、也沒人在看的事件。
  // tools/validate_analytics.js 會掃 app.js 裡所有 trackEvent 呼叫，
  // 表上沒有的直接擋 CI。
  //
  // 隱私原則（spec 06.4）：**不上報使用者輸入的答案文字**，只帶題目 id 與對錯。
  const ANALYTICS_EVENTS = {
    // 取得
    onboarding_step: "開局流程的每一步（含是否跳過）",
    placement_complete: "定位測驗完成，帶回定位等級與最弱家族",
    // 練習
    session_start: "開一局（模式 / 長度 / 從哪裡進來）",
    session_complete: "完成一局",
    session_abandon: "中途離開（答了幾題 / 共幾題）",
    session_resume: "續傳一局中斷的訓練",
    problem_start: "題目顯示",
    problem_submit: "送出答案",
    problem_timeout: "逾時未作答",
    hint_open: "打開提示（第幾層）",
    open_full_solution: "展開完整推導（會記為借助解答）",
    // 弱點
    mistake_added: "題目進錯題本",
    mistake_cleared: "錯題被清掉",
    // 計畫
    // 內容
    report_submit: "回報題目",
    custom_problem_saved: "儲存自訂題",
    custom_pack_imported: "匯入自訂題包",
    view_proof_solution: "查看參考證明",
    mark_proof_status: "自評證明理解程度",
    mark_proof_blocker: "標記證明卡在哪",
    // 資料
    export_records: "匯出紀錄",
    import_records: "匯入紀錄（含是否真的合併進新資料）",
    calibration_export: "匯出難度校準包（去識別化，opt-in）",
    erase_data: "使用者刪除本機所有資料（只記刪了幾類，不記內容）",
    analytics_opt_out: "使用者關閉或開啟分析",
    // 其他
    install_pwa: "安裝 PWA",
    app_update_apply: "使用者接受新版本並重新載入",
    print_mistakes: "列印錯題本（只記幾題，不記內容）",
    perf_render: "render 耗時取樣（1%）",
    return_visit: "隔日回訪（帶距離上次幾天）",
    app_error: "未捕捉的錯誤（只送錯誤型別、來源檔與行號，不送訊息內容）"
  };

  // 分析開關。
  //
  // 存在 records.settings 而不是另一個 localStorage key，理由是它要跟著
  // 匯出／匯入一起走 —— 換裝置之後還要再關一次的開關等於沒有開關。
  //
  // 這個值被讀的地方有兩處，而且兩處都要擋：
  //   1. trackEvent —— 不送事件
  //   2. setupAnalytics —— **連 GA 的 script 都不要載**
  // 只擋第一處是不夠的：光是載入 gtag.js 就已經對 Google 發出請求了。
  function analyticsEnabled() {
    try {
      const settings = loadRecords().settings || {};
      return settings.analytics !== "off";
    } catch (_error) {
      return true;
    }
  }

  function setAnalyticsEnabled(enabled) {
    const records = loadRecords();
    records.settings = records.settings || {};
    records.settings.analytics = enabled ? "on" : "off";
    saveRecords(records);
    // 關掉之前送最後一個事件，開啟時也送一個 —— 這是唯一能知道
    // 有多少人主動關掉分析的方法，而那個數字本身就是產品訊號。
    if (enabled) trackEvent("analytics_opt_out", { state: "on" });
    else {
      trackEvent("analytics_opt_out", { state: "off" });
      // 已經載入的 gtag 之後也不要再送
      try { window.gtag = undefined; } catch (_error) { /* 唯讀時無所謂，trackEvent 也會擋 */ }
    }
    render();
  }

  function trackEvent(name, params = {}) {
    if (!ANALYTICS_EVENTS[name] && typeof console !== "undefined" && console.warn) {
      // 表上沒有的事件在開發時就要被看見，不要等半年後對著 GA 猜這是什麼
      console.warn(`[buzz] 未登記的分析事件：${name}。請先加進 ANALYTICS_EVENTS。`);
    }
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    // opt-out 之後只有「重新開啟分析」這個事件本身可以送出去，
    // 否則使用者永遠沒辦法把自己加回來
    if (!analyticsEnabled() && !(name === "analytics_opt_out" && params.state === "on")) return;
    window.gtag("event", name, {
      app_version: APP_VERSION,
      build_date: BUILD_DATE,
      ...params
    });
  }

  // ---- 錯誤回報 ────────────────────────────────────────────
  //
  // 在這之前，程式在使用者那邊壞掉時我們完全不會知道 —— 能發現 bug
  // 只因為自己踩到。而遇到壞掉頁面的人通常不會回報，他們只會離開。
  //
  // 但錯誤訊息**不能原樣送出去**：它可能夾帶題目內容、使用者輸入的答案、
  // 甚至 localStorage 的片段。所以這裡只送三樣東西：
  //   1. 錯誤型別（TypeError / RangeError…）
  //   2. 是哪一個檔案的第幾行（只留檔名，不留完整路徑）
  //   3. 當下在哪個畫面
  // 訊息本體與堆疊一律不送。這條規則由 tools/validate_analytics.js 把關。
  const ERROR_SAMPLE_LIMIT = 5;
  let errorsReported = 0;

  function reportRuntimeError(kind, source, line) {
    if (errorsReported >= ERROR_SAMPLE_LIMIT) return; // 同一個 session 不要洗版
    errorsReported += 1;
    // 只留檔名。完整 URL 可能帶查詢字串，而分享連結的查詢字串裡有自訂題目。
    const file = String(source || "").split(/[\\/?#]/).filter(Boolean).pop() || "unknown";
    trackEvent("app_error", {
      error_kind: String(kind || "Error").slice(0, 40),
      error_file: file.slice(0, 60),
      error_line: Number(line) || 0,
      screen: view
    });
  }

  // 動作委派：整個 app 只有一個 click 監聽器，而且只綁一次。
  //
  // 這是局部渲染的前提：只要新插入的 DOM 帶著 [data-action]，
  // 不需要重新綁任何東西就會動。
  function setupActionDelegation() {
    app.addEventListener("click", handleAction);
  }

  function setupErrorReporting() {
    window.addEventListener("error", (event) => {
      const name = event && event.error && event.error.name ? event.error.name : "Error";
      reportRuntimeError(name, event && event.filename, event && event.lineno);
    });
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event && event.reason;
      const name = reason && reason.name ? reason.name : "UnhandledRejection";
      reportRuntimeError(name, "", 0);
    });
  }

  // 回訪：D1 / D7 / D30 是 spec 09 的核心留存指標，而它們只能從
  // 「上次練習到這次打開隔了幾天」算出來。
  function trackReturnVisit(records) {
    const last = Date.parse(records.lastPlayed || "") || 0;
    if (!last) return;
    const days = Math.floor((Date.now() - last) / DAY_MS);
    if (days < 1) return;
    trackEvent("return_visit", {
      days_since: days,
      bucket: days === 1 ? "d1" : days <= 7 ? "d7" : days <= 30 ? "d30" : "lapsed"
    });
  }

  // trackTabSwitch() 已移除。
  //
  // 它上報「這個人切出去幾次」，而那個數字唯一的用途是判他答錯。
  // 判錯拿掉之後，繼續記錄使用者的注意力去哪了就只剩監控，沒有產品用途 ——
  // 而隱私政策上寫的是「只送哪個功能被用了幾次」。

  // 每次 render 都是整個畫面重寫 innerHTML，於是捲動位置歸零、焦點消失、
  // 展開的段落收起來。使用者說不出「重繪」兩個字，只會覺得這個網站怪怪的。
  //
  // 真正的解法是局部更新，那是一次大重構。在那之前，先把使用者**感覺得到**
  // 的三件事接回去：捲到哪、游標在哪、哪些段落是開的。
  // 這不是把問題藏起來 —— 是先止血，而且止得住。
  function captureViewState() {
    const active = document.activeElement;
    const inApp = active && app.contains(active) && active !== document.body;
    const details = {};
    app.querySelectorAll("details[data-session-settings], details[id], details[data-keep]").forEach((node, index) => {
      details[node.id || node.dataset.keep || `d${index}`] = node.open;
    });
    return {
      scrollY: window.scrollY || window.pageYOffset || 0,
      view,
      // 用 action / 欄位名找回同一顆按鈕或同一個輸入框，而不是存節點參照 ——
      // 節點在 innerHTML 之後一定是新的。
      focusKey: inApp ? focusKeyFor(active) : "",
      selectionStart: inApp && isTypingTarget(active) ? active.selectionStart : null,
      selectionEnd: inApp && isTypingTarget(active) ? active.selectionEnd : null,
      details
    };
  }

  function focusKeyFor(node) {
    if (!node) return "";
    if (node.dataset && node.dataset.action) return `[data-action="${node.dataset.action}"]`;
    if (node.dataset && node.dataset.boardAction) return `[data-board-action="${node.dataset.boardAction}"]`;
    if (node.id) return `#${node.id}`;
    if (node.name) return `[name="${node.name}"]`;
    const tag = String(node.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") {
      const attr = Array.prototype.find.call(node.attributes || [], (a) => a.name.startsWith("data-"));
      if (attr) return `[${attr.name}]`;
    }
    return "";
  }

  function restoreViewState(carried) {
    if (!carried) return;
    Object.keys(carried.details || {}).forEach((key) => {
      const node = app.querySelector(`details#${CSS && CSS.escape ? CSS.escape(key) : key}`)
        || app.querySelector(`details[data-keep="${key}"]`)
        || (key === "d0" ? app.querySelector("details[data-session-settings]") : null);
      if (node) node.open = carried.details[key];
    });
    // 換畫面的時候捲動本來就該回到頂端；同一個畫面內的重繪才需要接回去。
    if (carried.view === view && carried.scrollY > 0) {
      window.scrollTo(0, carried.scrollY);
    }
    if (!carried.focusKey) return;
    const target = app.querySelector(carried.focusKey);
    if (!target || typeof target.focus !== "function") return;
    target.focus({ preventScroll: true });
    if (carried.selectionStart != null && typeof target.setSelectionRange === "function") {
      try {
        target.setSelectionRange(carried.selectionStart, carried.selectionEnd);
      } catch (_error) {
        // number 型別的 input 不支援 selectionRange，忽略
      }
    }
  }

  // 丟掉畫布之前先把 backing store 歸零。
  //
  // render() 是整段 innerHTML 換掉，所以每一次重繪都會做出一個新的 canvas，
  // 舊的那個就變成垃圾。在 Chrome 上這沒事，GC 會回收 —— 實測 40 次收合／攤開
  // 之後 heap 只長 0.1MB。
  //
  // 但 WebKit 不是這樣：iOS Safari 的 canvas 記憶體不跟著 JS 物件的 GC 走，
  // 要等到 backing store 被釋放，而把 width/height 設成 0 是唯一可靠的觸發方式。
  // 一張全螢幕計算紙在 DPR=2 下是 ~2000×1600×4 ≈ 12MB —— 重繪幾十次就是幾百 MB，
  // 而 iPadOS 會直接把分頁殺掉。
  //
  // 這也解釋了為什麼桌機測不出來：那是 WebKit 特有的行為。
  // 歸零對其他瀏覽器無害（那個 canvas 本來就要被丟掉了）。
  function releaseDetachedCanvases() {
    app.querySelectorAll("canvas").forEach((canvas) => {
      canvas.width = 0;
      canvas.height = 0;
    });
  }

  function render() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      // 1% 取樣。spec 01.6：沒有數字之前不准優化 render。
      const sampled = Math.random() < 0.01;
      const startedAt = sampled && window.performance ? window.performance.now() : 0;
      const carried = captureViewState();
      releaseDetachedCanvases();
      app.innerHTML = [renderTopbar(), renderScreen(), renderAppNoticeModal(), renderCalibrationPreviewModal(), renderEraseConfirmModal(), renderReportModal(), renderUpdateBanner()].join("");
      bindEvents();
      typesetMath(app);
      window.setTimeout(() => typesetMath(app), 80);
      renderIcons();
      setupReviewBoards();
      setupPreviousBoard();
      restoreViewState(carried);
      restoreLibrarySearchFocus();
      if (view !== lastAnimatedView) {
        lastAnimatedView = view;
        animateMounts(app);
      }
      if (sampled && startedAt) {
        trackEvent("perf_render", { view, ms: Math.round(window.performance.now() - startedAt) });
      }
    });
  }

  // Mount animations: count-up numbers, fill bars, staggered entrance.
  // Uses anime.js when present, falls back to vanilla, and honours
  // prefers-reduced-motion by jumping straight to the final state.
  function animateMounts(root) {
    if (!root || typeof root.querySelectorAll !== "function") return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const A = window.anime;

    root.querySelectorAll("[data-countup]").forEach((el) => {
      const target = Number(el.getAttribute("data-countup"));
      const suffix = el.getAttribute("data-suffix") || "";
      if (!isFinite(target)) return;
      if (reduce || target <= 0) {
        el.textContent = target + suffix;
        return;
      }
      if (A) {
        const obj = { v: 0 };
        A({ targets: obj, v: target, round: 1, duration: 750, easing: "easeOutCubic", update: () => { el.textContent = obj.v + suffix; } });
        return;
      }
      const start = Date.now();
      const step = () => {
        const t = Math.min(1, (Date.now() - start) / 700);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    });

    root.querySelectorAll("[data-fill]").forEach((el) => {
      const target = Number(el.getAttribute("data-fill")) || 0;
      if (reduce) {
        el.style.width = target + "%";
        return;
      }
      el.style.width = "0%";
      if (A) {
        A({ targets: el, width: target + "%", duration: 800, easing: "easeOutQuart" });
        return;
      }
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        el.style.width = target + "%";
      }));
    });

    // 入場動畫的保險絲。
    //
    // 這幾行的模式是「先用 A.set 把元素設成 opacity:0，再動畫回 1」。
    // 問題是那個 0 是**立刻寫進 inline style** 的，而動畫要靠
    // requestAnimationFrame 才會前進 —— 分頁在背景時 Chrome 會把 rAF 停掉，
    // 動畫就卡在第一格，整個畫面是空白的。實測：在背景分頁開結算頁，
    // DOM 裡有兩萬字的 HTML，畫面上什麼都沒有。
    //
    // 分頁回到前景時 rAF 會恢復、動畫會自己跑完，所以多數情況會自癒。
    // 但「裝飾性動畫有能力讓整頁永久空白」本身就是不該存在的設計：
    // anime.js 掛掉、擴充套件擋住、分頁被丟棄再還原，任何一種都會變白畫面。
    //
    // 所以無論如何，時間到就把 inline style 清掉。動畫正常跑完的話這是 no-op。
    const fuse = (nodes) => {
      if (!nodes || !nodes.length) return;
      window.setTimeout(() => {
        Array.prototype.forEach.call(nodes, (node) => {
          if (!node || !node.style) return;
          if (Number(node.style.opacity) === 0 || node.style.opacity === "0") node.style.opacity = "";
          if (node.style.transform) node.style.transform = "";
        });
      }, 1200);
    };

    const entrants = root.querySelectorAll("[data-enter]");
    if (entrants.length && !reduce && A) {
      A.set(entrants, { opacity: 0, translateY: 12 });
      A({ targets: entrants, opacity: [0, 1], translateY: [12, 0], delay: A.stagger(55), duration: 460, easing: "easeOutCubic" });
      fuse(entrants);
    }

    const pop = root.querySelector("[data-pop]");
    if (pop && !reduce && A) {
      A.set(pop, { scale: 0.92, opacity: 0 });
      A({ targets: pop, scale: [0.92, 1], opacity: [0, 1], duration: 520, easing: "spring(1, 80, 12, 0)" });
      fuse([pop]);
    }

    // Draw the learning-path connector line only up to the freshly-unlocked
    // node (anime.js stroke animation). Absent the flag the line is static.
    const drawLine = root.querySelector("[data-draw-line]");
    if (drawLine && A && !reduce) {
      const full = A.setDashoffset(drawLine);
      const frac = Math.max(0, Math.min(1, Number(drawLine.getAttribute("data-draw-to")) || 1));
      // strokeDashoffset goes full(hidden) -> full*(1-frac)(drawn up to node).
      A({ targets: drawLine, strokeDashoffset: [full, full * (1 - frac)], duration: 900, delay: 160, easing: "easeInOutSine" });
    }
  }

  function restoreLibrarySearchFocus() {
    if (!librarySearchShouldFocus || view !== "library") return;
    librarySearchShouldFocus = false;
    const input = app.querySelector("[data-library-search]");
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  // App shell。桌面是固定側欄、手機是底部分頁列 —— 同一份 markup，
  // 兩種排法全靠 CSS。導覽（五個主分頁）與工具（安裝、主題）分開放：
  // 底部分頁列只該有分頁，工具擠進去會把最常按的五顆鍵擠到 40px 以下。
  // 版本字串從 header 拿掉了 —— 成熟軟體的 chrome 不放建置資訊，
  // 要查的人在設定頁最底下找得到。
  function renderTopbar() {
    const inQuiz = view === "quiz";
    const themeIcon = selectedTheme === "dark" ? "sun" : "moon";
    const themeLabel = selectedTheme === "dark" ? "亮色" : "深色";
    const navItem = (v, action, label, iconName) =>
      `<button class="nav-button ${view === v ? "is-active" : ""}" data-action="${action}" aria-label="${label}" title="${label}" ${view === v ? 'aria-current="page"' : ""}>${icon(iconName)}<span>${label}</span></button>`;
    return `
      <a class="skip-to-content" href="#buzz-main">跳到主要內容</a>
      <header class="topbar ${inQuiz ? "is-quiz" : ""}">
        <button class="brand" data-action="home" title="回到工作台">
          <div class="brand-mark" aria-hidden="true">∫</div>
          <h1 class="brand-title">BuzzCalculus</h1>
        </button>
        ${
          inQuiz
            ? `<div class="topbar-utils"><button class="button ghost" data-action="confirm-exit" title="離開本局">${icon("x")}<span>離開</span></button></div>`
            : `
              <nav class="topbar-nav" aria-label="主要導覽">
                ${navItem("home", "home", "今天", "home")}
                ${navItem("train", "open-train", "訓練", "target")}
                ${navItem("insights", "open-insights", "數據", "activity")}
                ${navItem("library", "open-library", "題庫", "search")}
                ${navItem("settings", "open-settings", "設定", "settings")}
              </nav>
              <div class="topbar-utils">
                ${deferredInstallPrompt ? `<button class="icon-button" data-action="install-app" title="安裝 BuzzCalculus">${icon("download")}</button>` : ""}
                <button class="icon-button" data-action="toggle-theme" title="切換${themeLabel}模式">${icon(themeIcon)}</button>
              </div>`
        }
      </header>
    `;
  }

  function renderScreen() {
    if (view === "quiz") return renderQuiz();
    if (view === "results") return renderResults();
    if (view === "path-intro") return renderPathIntro();
    if (view === "proofs") return renderProofLab();
    if (view === "library") return renderProblemLibrary();
    // 第一次進站強制走 onboarding：不讓新使用者面對 1407 題 × 18 模式的組合空間。
    if (view === "home") {
      const first = loadRecords();
      if (!first.onboardingSeen && !(first.totalAnswered || 0)) {
        return onboardingStep === "placement" ? renderOnboardingPlacementOffer(first) : renderOnboarding();
      }
    }
    if (view === "insights") return renderInsights();
    if (view === "train") return renderTrain();
    if (view === "mistakes") return renderMistakes();
    if (view === "history") return renderHistory();
    if (view === "settings") return renderSettings();
    if (view === "creator") return renderCreator();
    return renderHome();
  }

  function renderHome() {
    if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
    if (!TRAINING_PACKS[selectedPack]) selectedPack = "all";
    const records = loadRecords();
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const today = new Date().toISOString().slice(0, 10);
    const daily = records.daily && records.daily[today];
    const mission = dailyMissionInfo(records, daily);
    const weaknesses = topWeaknesses(records);
    const path = learningPathState(records);

    // spec 04.3：首頁只有一個主 CTA。其餘全部收進「訓練」與「數據」兩個分頁 ——
    // 收納不刪除，19 個模式一個都沒少，只是不再全部擠在同一屏。
    //
    // 舊首頁的內容去了哪裡：
    //   主線路線圖 / 自訂一局 / 模式選單 -> 訓練 · 練習
    //   錯題複習 / 弱點                  -> 訓練 · 弱點
    //   每週挑戰 / 具名模擬卷 / 大考      -> 訓練 · 模擬
    //   每日 / 每日一題 / Boss / 生存      -> 訓練 · 挑戰
    //   連勝 / 熱力圖 / 雷達 / 趨勢       -> 數據
    // 寬螢幕上分兩欄。
    //
    // 專業工具的視覺特徵之一是資訊密度高（想想 IDE、統計軟體），
    // 而單欄版面在 1240px 的螢幕上有一半是空的 —— 那讀起來像「內容不多」，
    // 但這裡其實有 1,459 題。窄螢幕維持單欄，順序不變。
    return `
      <main class="screen home-screen" id="buzz-main">
        <div class="home-lead">
          ${renderResumeCard()}
          ${renderTodayCard(records)}
          ${renderBackupNotice(records)}
        </div>
        <div class="home-aside">
          ${renderHomeSecondary(records, path, mission)}
          ${renderGrowthLine(records)}
          ${renderHomeWeakness(records)}
          ${renderBucketNav()}
        </div>
      </main>
    `;
  }

  // 次要入口最多 2 個，而且必須是動態的 —— 沒有到期錯題就不該出現錯題按鈕。
  // 固定顯示一排永遠存在的按鈕等於沒有優先序。
  function renderHomeSecondary(records, path, mission) {
    const summary = srsDueSummary(records);
    const entries = [];

    if (summary.due) {
      entries.push({
        action: "start-srs-review",
        icon: "refresh",
        label: `錯題 ${summary.due} 題到期`,
        note: "照排程清掉才會真的記住"
      });
    }
    if (!mission.done && (records.totalAnswered || 0)) {
      entries.push({
        action: "start-daily",
        icon: "calendar",
        label: `每日 ${mission.completed}/${mission.target}`,
        note: "維持連勝"
      });
    }
    if (entries.length < 2 && path && path.next) {
      entries.push({
        action: "start-path-node",
        data: `data-node-id="${escapeAttr(path.next.id)}"`,
        icon: "play",
        label: `主線：${path.next.short}`,
        note: escapeHtml(path.next.label)
      });
    }
    if (!entries.length) return "";

    return `
      <section class="home-secondary" aria-label="次要入口">
        ${entries
          .slice(0, 2)
          .map(
            (entry) => `
              <button class="secondary-entry" data-action="${entry.action}" ${entry.data || ""}>
                ${icon(entry.icon)}
                <span>
                  <strong>${entry.label}</strong>
                  <small>${entry.note}</small>
                </span>
              </button>`
          )
          .join("")}
      </section>
    `;
  }

  // 一行成長證據。spec 00 的「讓學生感覺自己變強」靠的就是這一行 ——
  // 它必須是具體的個人事實，不是「繼續加油」這種空話。
  // 首頁的弱點摘要。
  //
  // 這塊補上去的理由不是「填空白」，是首頁原本完全沒有展示這個產品的核心主張。
  // 站上說「會告訴你是不會還是來不及」，而首頁只有一顆開始按鈕跟四個入口 ——
  // 一個已經練了七十題的人，打開來看不到任何關於自己的東西。
  //
  // 這裡只放三個最弱的技巧與一句處方，點下去直接練。詳細診斷留在數據分頁。
  // 它是工具價值不是遊戲化，所以專注模式不會把它收起來。
  function renderHomeWeakness(records) {
    const profile = abilityProfile(records);
    if (!profile || !profile.coverage || profile.coverage.attempts < 12) return "";
    const weakest = profile.weakest
      .map((id) => profile.skills[id])
      .filter((entry) => entry && entry.measured && entry.mastery !== null)
      .slice(0, 3);
    if (weakest.length < 2) return "";

    return `
      <section class="home-weakness">
        <div class="home-weakness-head">
          <p class="section-label">最弱的三個技巧</p>
          <button class="button ghost" data-action="start-weakness">${icon("target")}練弱點</button>
        </div>
        <ul class="home-weakness-list">
          ${weakest
            .map((entry) => {
              const plan = weaknessPrescription(profile, entry.id);
              const pct = Math.round(entry.mastery);
              return `
                <li>
                  <div class="home-weakness-row">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <span class="home-weakness-score">${pct}</span>
                  </div>
                  <div class="home-weakness-bar" aria-hidden="true"><span style="width:${Math.max(4, Math.min(100, pct))}%"></span></div>
                  ${plan && plan.kind === "backtrack" ? `<small>${escapeHtml(plan.text)}</small>` : ""}
                </li>`;
            })
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderGrowthLine(records) {
    const profile = abilityProfile(records);
    if (!profile || !profile.coverage.attempts) return "";

    const parts = [];
    if (profile.trend.d7 !== null && profile.trend.d7 !== 0) {
      parts.push(`能力 ${profile.trend.d7 > 0 ? "+" : ""}${profile.trend.d7}`);
    }

    const days = activeDaysInLastWeek(records);
    if (days) parts.push(`本週練了 ${days} 天`);

    const up = profile.trend.fastestUp;
    if (up) parts.push(`${up.label} +${up.delta}`);

    if (!parts.length) {
      parts.push(`累計 ${profile.coverage.attempts} 題 · 測得出 ${profile.coverage.skillsMeasured} 個技巧`);
    }

    return `
      <button class="growth-line" data-action="open-insights">
        <span class="section-label">本週</span>
        <strong>${escapeHtml(parts.join(" · "))}</strong>
        ${icon("chevron-right")}
      </button>
    `;
  }

  function activeDaysInLastWeek(records) {
    const cutoff = Date.now() - 7 * DAY_MS;
    const days = new Set();
    (records.history || []).forEach((item) => {
      const at = item && Date.parse(item.finishedAt || "");
      if (Number.isFinite(at) && at >= cutoff) days.add(new Date(at).toISOString().slice(0, 10));
    });
    return days.size;
  }

  function renderBucketNav() {
    return `
      <nav class="bucket-nav" aria-label="訓練分類">
        ${TRAIN_BUCKETS.map(
          (item) => `
            <button data-action="open-train" data-bucket="${escapeAttr(item.key)}">
              <strong>${item.label}</strong>
              <small>${item.note}</small>
            </button>`
        ).join("")}
      </nav>
    `;
  }

  // ── 今天的訓練 ──────────────────────────────────────────────
  // spec 04.3：首頁永遠只有一個主 CTA，而且它必須說得出「為什麼是這個」。
  // 由 kernel 的 planner 決定內容；planner 沒載入時整張卡不出現，
  // 首頁退回原本的樣子。
  function renderTodayCard(records) {
    const plan = plannedSession(records);
    if (!plan) return "";

    const { recipe, filled, reason } = plan;
    const minutes = Math.max(1, Math.round(filled.estSeconds / 60));
    const focus = recipe.slots
      .filter((slot) => slot.count > 0)
      .map((slot) => `${escapeHtml(slot.label)} ${slot.count}`)
      .join(" · ");
    const dueCount = recipe.context.dueNow;
    const adjusted = window.BuzzSession.explainFallbacks(filled.meta);

    return `
      <section class="today-card" aria-label="今天的訓練">
        <div class="today-head">
          <p class="section-label">今天的訓練</p>
          <span class="today-meta">${minutes} 分鐘 · ${filled.problems.length} 題</span>
        </div>
        <h2 class="today-title">${escapeHtml(recipe.label)}</h2>
        <p class="today-why">${escapeHtml(recipe.why)}</p>
        <p class="today-mix">${focus}</p>
        <div class="today-actions">
          <button class="button home-primary" data-action="start-planned" data-length="${escapeAttr(recipe.length)}">
            ${icon("play")}<span>開始</span>
          </button>
          ${
            recipe.length !== "sprint5"
              ? `<button class="button secondary" data-action="start-planned" data-length="sprint5">${icon("zap")}5 分鐘快刷</button>`
              : ""
          }
          ${
            dueCount
              ? `<button class="button secondary" data-action="start-srs-review">${icon("repeat")}錯題 ${dueCount} 題到期</button>`
              : ""
          }
        </div>
        <p class="today-note">${escapeHtml(reason)}${adjusted ? ` · ${escapeHtml(adjusted)}` : ""}</p>
      </section>
    `;
  }

  // planner + session 的組裝。回傳 null 代表 kernel 沒載入或抽不到題，
  // 呼叫端要能接受沒有這張卡。
  function plannedSession(records, lengthKey) {
    if (!window.BuzzPlanner || !window.BuzzSession || !window.BuzzSkillGraph) return null;
    try {
      const pool = plannerCandidatePool(records);
      if (!pool.length) return null;
      // planner 自己也會算一次 profile —— 把快取的那份傳進去，
      // 首頁一次 render 就只算一次而不是兩次。
      const profile = abilityProfile(records);
      const recommendation = window.BuzzPlanner.today(records, { problems, profile });
      const key = lengthKey || recommendation.length;
      const recipe =
        key === recommendation.length
          ? recommendation.recipe
          : window.BuzzPlanner.recipe(records, key, { problems, profile });
      const filled = window.BuzzSession.fill(recipe, {
        problems: pool,
        // 抽題種子綁當天，所以同一天重整首頁看到的是同一份訓練 ——
        // 不然使用者每次重整就換一批題，會覺得推薦是隨機的。
        seed: `${new Date().toISOString().slice(0, 10)}-${key}`,
        recent: recentProblemIds(records, RECENT_PROBLEM_COOLDOWN)
      });
      if (!filled.problems.length) return null;
      return { recipe, filled, reason: recommendation.reason };
    } catch (_error) {
      return null;
    }
  }

  // 候選集：沿用站上既有的規則 —— 純微積分（科目閘門）、難度上限之內、
  // 排除自訂題。kernel 不重複實作這些規則，避免兩份規則漂移。
  function plannerCandidatePool(records) {
    const cap = activeDifficultyCap(records);
    return problems.filter(
      (problem) => problemRank(problem) <= cap + 1 && !problem.custom
    );
  }

  function startPlannedSession(lengthKey) {
    const records = loadRecords();
    const plan = plannedSession(records, lengthKey);
    if (!plan) {
      showAppNotice("目前抽不到適合的題目，請把難度上限拉高一點。");
      return;
    }
    selectedMode = "quick";
    selectedTopic = "all";
    startQuiz(plan.filled.problems, { modeKey: "quick" });
  }

  // ── 作答中斷續傳 ────────────────────────────────────────────
  // spec 04.8：模擬考做到一半重新整理 = 整份消失。這是現在最傷使用者的 bug，
  // 而且它傷的是最投入的那群人 —— 願意花 45 分鐘做一份完整模擬卷的人。
  //
  // 設計要點：
  //   1. quiz 物件裡有題目的完整參照，不能直接 JSON.stringify。
  //      存的時候換成 id，讀的時候再從題庫接回來。題目下架時該局作廢。
  //   2. 時間戳存絕對值。大考模式的整份倒數 examEndAt 一定要照實扣掉離開的時間
  //      —— 那是考試誠信；日常模式則重啟單題計時，不為難使用者。
  //   3. 續傳要誠實：中斷過就記在 history 裡，考卷成績要看得出來。
  const ACTIVE_KEY = "buzzcalculus.session.active";
  const ACTIVE_SCHEMA = 1;
  const RESUME_WINDOW_MS = 6 * 3600 * 1000;
  const AUTOSAVE_INTERVAL_MS = 10000;
  let lastAutosaveAt = 0;

  function serializeQuiz(current) {
    if (!current || !Array.isArray(current.problems)) return null;
    const copy = {};
    Object.keys(current).forEach((key) => {
      if (key === "problems" || key === "answers") return;
      const value = current[key];
      if (typeof value === "function") return;
      copy[key] = value;
    });
    copy.problemIds = current.problems.map((problem) => problem.id);
    copy.answers = (current.answers || []).map((answer) => {
      const entry = {};
      Object.keys(answer).forEach((key) => {
        if (key === "problem" || key === "boardStrokes") return;
        entry[key] = answer[key];
      });
      entry.problemId = answer.problem ? answer.problem.id : "";
      return entry;
    });
    // 草稿筆畫可能很大，續傳時不值得為它撐爆 localStorage 額度。
    // 使用者要的是「題目和答案還在」，不是「我畫的線還在」。
    delete copy.boardStrokes;
    // boardRedo 裝的是同一批筆畫（「全部擦掉」會把整頁推進去），
    // 漏掉它等於前面那一行白寫 —— 每 10 秒還是把幾 MB 序列化進 localStorage。
    delete copy.boardRedo;
    return copy;
  }

  function deserializeQuiz(saved) {
    if (!saved || !Array.isArray(saved.problemIds)) return null;
    const list = saved.problemIds.map((id) => problemById(id));
    if (list.some((problem) => !problem)) return null; // 題目下架 → 這局不能續
    const restored = { ...saved };
    delete restored.problemIds;
    restored.problems = list;
    restored.boardStrokes = {};
    restored.answers = (saved.answers || [])
      .map((entry) => {
        const problem = problemById(entry.problemId);
        if (!problem) return null;
        return { ...entry, problem, boardStrokes: [] };
      })
      .filter(Boolean);
    return restored;
  }

  function autosaveSession(force) {
    if (!quiz || view !== "quiz") return;
    const now = Date.now();
    if (!force && now - lastAutosaveAt < AUTOSAVE_INTERVAL_MS) return;
    lastAutosaveAt = now;
    try {
      const payload = serializeQuiz(quiz);
      if (!payload) return;
      localStorage.setItem(ACTIVE_KEY, JSON.stringify({ schema: ACTIVE_SCHEMA, savedAt: now, quiz: payload }));
    } catch (_error) {
      // 存不進去（配額滿、隱私模式）不能影響作答本身
    }
  }

  function clearActiveSession() {
    lastAutosaveAt = 0;
    try {
      localStorage.removeItem(ACTIVE_KEY);
    } catch (_error) {
      // ignore
    }
  }

  function readActiveSession() {
    let raw = null;
    try {
      raw = localStorage.getItem(ACTIVE_KEY);
    } catch (_error) {
      return null;
    }
    if (!raw) return null;
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (_error) {
      clearActiveSession();
      return null;
    }
    if (!parsed || parsed.schema !== ACTIVE_SCHEMA || !parsed.quiz) {
      clearActiveSession();
      return null;
    }
    const savedAt = Number(parsed.savedAt) || 0;
    if (!savedAt || Date.now() - savedAt > RESUME_WINDOW_MS) {
      clearActiveSession();
      return null;
    }
    // 已經作答完的局沒有續傳的意義
    const answered = (parsed.quiz.answers || []).length;
    const total = (parsed.quiz.problemIds || []).length;
    if (!total || answered >= total) {
      clearActiveSession();
      return null;
    }
    return { savedAt, quiz: parsed.quiz, answered, total };
  }

  function renderResumeCard() {
    const saved = readActiveSession();
    if (!saved) return "";
    const mode = MODES[saved.quiz.mode] || {};
    const label = saved.quiz.namedExam ? saved.quiz.namedExam.label : mode.label || "訓練";
    const minutesAgo = Math.max(1, Math.round((Date.now() - saved.savedAt) / 60000));
    const examExpired =
      saved.quiz.examMode && saved.quiz.examEndAt && Date.now() > Number(saved.quiz.examEndAt);

    return `
      <section class="study-card resume-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">還沒做完</p>
            <h3>${escapeHtml(label)} 第 ${saved.answered + 1} / ${saved.total} 題</h3>
          </div>
          <span class="resume-age">${minutesAgo} 分鐘前</span>
        </div>
        <p class="panel-note">
          ${
            examExpired
              ? "這份考卷的整份倒數已經結束，只能結算不能續作。"
              : saved.quiz.examMode
                ? "考卷的整份倒數是照實走的，中斷的時間不會還給你。"
                : "接著上次的地方繼續，作答紀錄都還在。"
          }
        </p>
        <div class="action-row">
          <button class="button home-primary" data-action="resume-session">${icon("play")}${examExpired ? "結算這份" : "繼續"}</button>
          <button class="button ghost" data-action="discard-session">${icon("trash")}放棄</button>
        </div>
      </section>
    `;
  }

  function resumeSession() {
    const saved = readActiveSession();
    if (!saved) {
      showAppNotice("上次那局已經無法續傳了。");
      render();
      return;
    }
    const restored = deserializeQuiz(saved.quiz);
    if (!restored) {
      clearActiveSession();
      showAppNotice("上次那局包含已經下架的題目，無法續傳。");
      render();
      return;
    }

    // 中斷次數要記下來 —— 一份中斷過的考卷，成績的意義本來就不一樣。
    restored.interruptions = Number(restored.interruptions || 0) + 1;
    restored.feedback = null;
    restored.modal = null;
    // index 只在按「下一題」時才推進，所以在回饋畫面中斷時 index 會落後 answers 一格。
    // 不補這一步的話，續傳會讓使用者**重新作答已經答過的那題**，answers 出現重複。
    restored.index = Math.min(restored.problems.length - 1, Math.max(restored.index || 0, restored.answers.length));
    restored.draft = "";
    // 大考的整份倒數照實走（考試誠信）；日常模式重啟單題計時，不為難使用者。
    if (!restored.examMode) restored.questionStartedAt = Date.now();

    quiz = restored;
    view = "quiz";
    lastVisibilityStamp = Date.now();
    if (!quiz.practice && !quiz.noTimer) startTicker();
    trackEvent("session_resume", {
      mode: quiz.mode,
      answered: quiz.answers.length,
      total: quiz.problems.length,
      gap_minutes: Math.round((Date.now() - saved.savedAt) / 60000)
    });
    autosaveSession(true);
    render();
  }

  function discardSession() {
    clearActiveSession();
    render();
  }

  // 考試倒推計畫（設考試日→每天配額→考前報告）於 2026-09 移除。
  // 它是一整個排程系統：表單、配額計算、做不完警告、考後報告 ——
  // 全部只服務「有設定考試日」的少數人，卻常駐在首頁與模擬分頁上。
  // 主線關卡＋每日任務已經回答了「今天該練什麼」；多一套排程是第二個聲音。
  // 舊紀錄 records.plan / planHistory 保留不動。BuzzPlanner kernel 保留（純函式，沒有 UI 依賴）。

  // 信心預測（「剛剛有多確定？」）於 2026-09 移除。
  // 它在每一題的回饋畫面插一個三選一的問卷 —— 核心迴圈是「看題→算→下一題」，
  // 每多一個彈出就慢一拍，而回收的資料（records.conf）從來沒有推動過任何決策。
  // 舊紀錄裡的 records.conf 保持原樣不動，只是不再寫入、不再顯示。

  // ── 錯因標註 ────────────────────────────────────────────────
  // spec 03.7：問題不在於「有沒有這個功能」，在於**標註成本**。
  // 沒有人會為了統計去點三個按鈕 —— 所以這裡先猜一個最可能的預選起來，
  // 使用者只要按一下確認，或改選。猜錯沒關係，改一下的成本遠低於從零選。
  const CAUSE_OPTIONS = [
    { key: "algebra-slip", tag: "粗心", label: "算錯，不是不會" },
    { key: "wrong-technique", tag: "不會", label: "選錯方法" },
    { key: "forgot-formula", tag: "忘公式", label: "忘公式" }
  ];

  // 推薦規則刻意用「證據」而不是機率模型：每一條都要能一句話解釋給使用者聽。
  function suggestCause(problem, answer) {
    if (!problem || !answer) return null;
    const elapsed = Number(answer.elapsed || 0);
    const limit = Number(problem.timeLimit || 0);

    // 讀太快就答錯 —— 幾乎都是看錯題目
    if (limit && elapsed > 0 && elapsed < limit * 0.25) {
      return { key: "wrong-technique", why: "你只花了不到四分之一的時間就答錯，通常是看錯題目或選錯方法" };
    }
    // 看過第二層提示才會 —— 那是記憶問題不是理解問題
    if ((answer.hintsUsed || 0) >= 2) {
      return { key: "forgot-formula", why: "你看到第二層提示才會，多半是公式忘了而不是不懂" };
    }
    // 有草稿、時間也花夠，而且這個技巧其實不弱 —— 那就是算錯
    const strokes = quiz && quiz.boardStrokes && quiz.boardStrokes[problem.id];
    const skillOk = causeSkillIsSolid(problem);
    if ((strokes && strokes.length) || (skillOk && limit && elapsed > limit * 0.5)) {
      return { key: "algebra-slip", why: "你有動筆、時間也花夠了，而且這個技巧你其實會 —— 比較像算錯" };
    }
    return { key: "wrong-technique", why: "這個技巧的精熟度還沒起來" };
  }

  function causeSkillIsSolid(problem) {
    if (!window.BuzzAbility || !window.BuzzSkillGraph) return false;
    try {
      const profile = abilityProfile(loadRecords());
      if (!profile) return false;
      const skills = window.BuzzSkillGraph.skillsForProblem(problem);
      return skills.some((id) => {
        const entry = profile.skills[id];
        return entry && entry.measured && entry.mastery !== null && entry.mastery >= 65;
      });
    } catch (_error) {
      return false;
    }
  }

  // 答錯當下的「為什麼錯？」問卷於 2026-09 移除 —— 它插在作答迴圈裡。
  // 錯因照樣有：suggestCause 在提交答案時就自動記一個（標成 causeAuto），
  // 使用者要改的話，結算頁的複盤列每一題都有標註按鈕 —— 那裡本來就是
  // 回頭看的地方，改一下不打斷任何節奏。
  function causeTagOf(key) {
    const option = CAUSE_OPTIONS.find((item) => item.key === key);
    return option ? option.tag : "";
  }

  // ── 訓練分頁：四個 bucket ────────────────────────────────────
  // spec 04.2：19 個模式全部保留，但收成四類。分類的依據不是「像不像」，
  // 而是**焦慮該不該存在**：練習區不得製造焦慮，高壓規則只准出現在模擬區。
  const TRAIN_BUCKETS = [
    { key: "practice", label: "練習", note: "沒有倒數，可以看提示" },
    { key: "weakness", label: "弱點", note: "依你的錯題自動選題" },
    { key: "exam", label: "模擬", note: "整份倒數、無提示" },
    { key: "challenge", label: "挑戰", note: "高難度、有失敗條件" }
  ];

  function renderTrain() {
    const records = loadRecords();
    const path = learningPathState(records);
    const today = new Date().toISOString().slice(0, 10);
    const mission = dailyMissionInfo(records, records.daily && records.daily[today]);
    const bucket = TRAIN_BUCKETS.some((item) => item.key === selectedBucket) ? selectedBucket : "practice";

    return `
      <main class="screen train-screen">
        <div class="segmented bucket-tabs" role="group" aria-label="訓練分類">
          ${TRAIN_BUCKETS.map(
            (item) => `
              <button class="segment ${bucket === item.key ? "is-active" : ""}"
                aria-pressed="${bucket === item.key ? "true" : "false"}"
                data-action="set-bucket" data-bucket="${escapeAttr(item.key)}">
                <strong>${item.label}</strong>
                <span>${item.note}</span>
              </button>`
          ).join("")}
        </div>
        ${
          bucket === "practice"
            ? `${renderBuzzPath(path, mission)}${renderSessionSettings(records)}${renderHomeMorePanel(records, topWeaknesses(records), Object.keys(records.mistakes || {}).length)}`
            : ""
        }
        ${bucket === "weakness" ? renderWeaknessBucket(records) : ""}
        ${bucket === "exam" ? `${renderNamedExamPanel(records)}${renderExamBucketExtras()}` : ""}
        ${bucket === "challenge" ? renderChallengeBucket(records, mission) : ""}
      </main>
    `;
  }

  // 從「哪裡弱」到「先補哪裡」
  //
  // 「勞必達法則正確率 62%」是資訊，不是產品 —— 使用者看兩次就不看了。
  // 技能圖帶著前置關係（DAG），所以可以往回走：如果一個技巧的**前置**
  // 也沒練起來，那先練它本身是浪費時間，該回頭補前置。
  //
  // 處方給錯比不給更傷信任，所以規則刻意保守：
  //   - 只在前置「明顯更弱」（差 12 分以上）的時候才建議回頭
  //   - 沒練過的前置不算數（沒有資料不等於弱）
  //   - 找不到理由就老實說「就練這個」
  function weaknessPrescription(profile, skillId) {
    const graph = window.BuzzSkillGraph;
    if (!profile || !graph || typeof graph.byId !== "function") return null;
    const self = profile.skills[skillId];
    if (!self) return null;
    const node = graph.byId(skillId);
    if (!node || !node.prereq || !node.prereq.length) return null;

    // 自己的精熟度都還沒測出來的話，談不上「回頭補前置」。
    if (self.mastery === null || !self.measured) return null;

    const MIN_GAP = 12;
    const MIN_EVIDENCE = 3;
    let worst = null;
    (typeof graph.ancestors === "function" ? graph.ancestors(skillId) : node.prereq).forEach((parentId) => {
      const parent = profile.skills[parentId];
      if (!parent) return;
      // 沒什麼作答紀錄的前置不能拿來當理由 —— 沒資料不是弱。
      if (!parent.measured || parent.mastery === null || (parent.n || 0) < MIN_EVIDENCE) return;
      if (parent.mastery >= self.mastery - MIN_GAP) return;
      if (!worst || parent.mastery < worst.mastery) worst = parent;
    });

    if (!worst) {
      return { kind: "direct", text: "前置都穩了，直接練這個技巧就會有進步。", skillId };
    }
    return {
      kind: "backtrack",
      text: `先回去補「${worst.label}」（${worst.mastery} 分）—— 它是這個技巧的前置，卡在那裡的話這裡怎麼練都會卡。`,
      skillId: worst.id,
      label: worst.label
    };
  }

  function renderWeaknessBucket(records) {
    const summary = srsDueSummary(records);
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const forecast = srsForecast(records);
    const profile = abilityProfile(records);
    const weakest = profile
      ? profile.weakest.map((id) => profile.skills[id]).filter(Boolean).slice(0, 3)
      : [];

    return `
      <section class="study-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">錯題複習</p>
            <h3>${summary.due ? `今天到期 ${summary.due} 題` : mistakeCount ? "目前沒有到期的" : "錯題本是空的"}</h3>
          </div>
        </div>
        <p class="panel-note">
          ${
            summary.due
              ? "照排程清掉，才會真的記住。"
              : summary.nextDueDays
                ? `下一批 ${summary.nextDueDays} 天後到期。`
                : "答錯的題會自動進來，並照間隔重複排程回鍋。"
          }
        </p>
        ${
          // 到期預測：讓「明天會有幾題」可以被規劃，而不是每天被突襲。
          forecast.tomorrow || forecast.week
            ? `<p class="srs-forecast">${[
                forecast.today ? `今天 ${forecast.today}` : "",
                forecast.tomorrow ? `明天 ${forecast.tomorrow}` : "",
                forecast.week ? `一週內再 ${forecast.week}` : ""
              ].filter(Boolean).join(" · ")} 題到期</p>`
            : ""
        }
        <div class="action-row">
          ${summary.due ? `<button class="button home-primary" data-action="start-srs-review">${icon("refresh")}開始複習</button>` : ""}
          ${mistakeCount ? `<button class="button secondary" data-action="open-mistakes">${icon("book")}錯題本（${mistakeCount}）</button>` : ""}
        </div>
      </section>
      ${
        weakest.length
          ? `
        <section class="study-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">弱點技巧</p>
              <h3>系統挑最弱的給你</h3>
            </div>
          </div>
          <ul class="weak-pick-list">
            ${weakest
              .map(
                (entry) => {
                  const plan = weaknessPrescription(profile, entry.id);
                  return `
                  <li>
                    <strong>${escapeHtml(entry.label)}</strong>
                    <span>${escapeHtml(entry.stateLabel)} ${entry.mastery}</span>
                    ${entry.diagnosis ? `<small>${escapeHtml(entry.diagnosis.text)}</small>` : ""}
                    ${
                      plan
                        ? `<p class="weak-plan ${plan.kind === "backtrack" ? "is-backtrack" : ""}">${icon(plan.kind === "backtrack" ? "undo" : "play")}${escapeHtml(plan.text)}</p>`
                        : ""
                    }
                  </li>`;
                }
              )
              .join("")}
          </ul>
          <div class="action-row">
            <button class="button home-primary" data-action="start-weakness">${icon("target")}練弱點</button>
            <button class="button secondary" data-action="open-insights">${icon("activity")}看完整診斷</button>
          </div>
        </section>`
          : ""
      }
    `;
  }

  function renderExamBucketExtras() {
    return `
      <section class="study-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">大考模式</p>
            <h3>20 題 / 45 分鐘</h3>
          </div>
        </div>
        <p class="panel-note">自己輸入答案、整份倒數、不給提示。時間到直接交卷 —— 這是全站唯一整份計時的地方。</p>
        <div class="action-row">
          <button class="button home-primary" data-action="start-mode" data-mode-key="exam">${icon("file-pen-line")}開始</button>
        </div>
      </section>
    `;
  }

  function renderChallengeBucket(records, mission) {
    const modes = Object.keys(MODES).filter((key) => MODES[key].bucket === "challenge" && !MODES[key].hidden);
    return `
      <section class="study-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">每日</p>
            <h3>固定題組與每日一題</h3>
          </div>
        </div>
        <div class="action-row">
          <button class="button home-primary" data-action="start-daily">${icon("calendar")}每日挑戰 ${mission.completed}/${mission.target}</button>
          <button class="button secondary" data-action="start-daily-one">${icon("puzzle")}每日一題 ${renderDailyOneBadge(records)}</button>
        </div>
      </section>
      <section class="study-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">挑戰模式</p>
            <h3>高難度，而且會失敗</h3>
          </div>
        </div>
        <div class="challenge-mode-grid">
          ${modes
            .filter((key) => !["daily", "daily_one"].includes(key))
            .map(
              (key) => `
                <button class="challenge-mode" data-action="start-mode" data-mode-key="${escapeAttr(key)}">
                  <strong>${escapeHtml(MODES[key].label)}</strong>
                  <span>${escapeHtml(modeDescription(key))}</span>
                </button>`
            )
            .join("")}
          <button class="challenge-mode" data-action="start-god-run">
            <strong>競賽魔王</strong>
            <span>R6 · 競賽級</span>
          </button>
        </div>
      </section>
    `;
  }

  // ── 數據分頁 ────────────────────────────────────────────────
  // ability.js 早就算好了 PA / UA / 速度象限 / 錯因 / 趨勢，但一直沒有地方顯示。
  // 這一頁就是把那些數字變成使用者看得懂的診斷。
  //
  // 一條原則貫穿整頁：**沒測準的東西不給數字**。ability 的 measured / stale
  // 已經分好「從沒測過」和「練過但太久沒碰」，UI 要照實講，不要拿 0 充數。
  // 本週 vs 上週的週報。全部從本機 history 算，沒有伺服器。
  //
  // 只报比較得出來的事實（題數、正確率、天數的增減），不下評語 ——
  // 「比上週多練 40 題」自己會說話，「你這週表現不錯」誰都寫得出來。
  function weeklyReportData(records) {
    const now = Date.now();
    const weekStart = (offsetWeeks) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1 - offsetWeeks * 7);
      return d.getTime();
    };
    const thisStart = weekStart(0);
    const lastStart = weekStart(1);
    const bucketOf = (at) => (at >= thisStart ? "this" : at >= lastStart ? "last" : null);
    const empty = () => ({ sessions: 0, answered: 0, correct: 0, days: new Set() });
    const buckets = { this: empty(), last: empty() };
    (records.history || []).forEach((session) => {
      const at = Date.parse(session.finishedAt || "");
      if (!Number.isFinite(at) || at > now) return;
      const key = bucketOf(at);
      if (!key) return;
      const bucket = buckets[key];
      bucket.sessions += 1;
      bucket.answered += Number(session.total || 0);
      bucket.correct += Number(session.correct || 0);
      bucket.days.add(new Date(at).toDateString());
    });
    const pack = (bucket) => ({
      sessions: bucket.sessions,
      answered: bucket.answered,
      accuracy: bucket.answered ? Math.round((bucket.correct / bucket.answered) * 100) : null,
      days: bucket.days.size
    });
    return { current: pack(buckets.this), previous: pack(buckets.last) };
  }

  function renderWeeklyReport(records) {
    const report = weeklyReportData(records);
    const { current, previous } = report;
    if (!current.answered && !previous.answered) return "";

    const delta = (nowValue, thenValue, unit) => {
      if (thenValue === null || nowValue === null) return "";
      const diff = nowValue - thenValue;
      if (!diff) return `<small class="report-delta">與上週持平</small>`;
      const sign = diff > 0 ? "+" : "−";
      return `<small class="report-delta ${diff > 0 ? "is-up" : "is-down"}">${sign}${Math.abs(diff)}${unit}</small>`;
    };

    return `
      <section class="study-card weekly-report">
        <div class="panel-title-row">
          <div>
            <p class="section-label">本週</p>
            <h3>${current.answered ? `練了 ${current.answered} 題` : "這週還沒開始"}</h3>
          </div>
        </div>
        <div class="report-grid">
          <div><span>題數</span><strong class="num">${current.answered}</strong>${delta(current.answered, previous.answered, " 題")}</div>
          <div><span>正確率</span><strong class="num">${current.accuracy === null ? "—" : `${current.accuracy}%`}</strong>${delta(current.accuracy, previous.accuracy, " 點")}</div>
          <div><span>有練的天數</span><strong class="num">${current.days}</strong>${delta(current.days, previous.days, " 天")}</div>
          <div><span>局數</span><strong class="num">${current.sessions}</strong>${delta(current.sessions, previous.sessions, " 局")}</div>
        </div>
        ${previous.answered ? `<p class="panel-note">上週：${previous.answered} 題 · ${previous.accuracy === null ? "—" : `${previous.accuracy}%`} · ${previous.days} 天</p>` : ""}
      </section>
    `;
  }

  // 反射進步卡：「三週前這型要 92 秒，現在 41 秒」。
  //
  // 這是整個產品命題（限時練反射 → 變快）的第一個可驗證證據，
  // 而且是使用者**自己的**證據，不是我們的宣稱。
  //
  // 方法上的兩個堅持：
  //   1. 比「耗時 ÷ 該題時限」不比原始秒數 —— 不同題時限差三倍，
  //      混著比只會量到「最近抽到的題比較簡單」。顯示時再用該技巧的
  //      中位時限換算回秒數，人才讀得懂。
  //   2. 門檻寧嚴勿鬆：早期與近期各要 8 筆計時答對、中間隔至少 7 天、
  //      而且要快 15% 以上才算「進步」。一張灌水的進步卡，
  //      比沒有卡更傷這個站的信用。
  function speedProgressData(records) {
    if (!window.BuzzSkillGraph) return [];
    const log = Array.isArray(records.attemptLog) ? records.attemptLog : [];
    if (log.length < 30) return [];
    const F_TIMED = 4;
    const F_UNANSWERED = 1;

    const bySkill = new Map();
    log.forEach((row) => {
      if (!Array.isArray(row) || row.length < 5) return;
      const [pid, at, correct, elapsed, flags] = row;
      if (!correct || !(flags & F_TIMED) || (flags & F_UNANSWERED)) return;
      const problem = problemById(pid);
      if (!problem || !problem.timeLimit || !Number.isFinite(elapsed) || elapsed <= 0) return;
      const ratio = elapsed / problem.timeLimit;
      if (ratio > 3) return; // 掛著沒關的分頁之類的離群值
      window.BuzzSkillGraph.skillsForProblem(problem).forEach((skillId) => {
        if (!bySkill.has(skillId)) bySkill.set(skillId, []);
        bySkill.get(skillId).push({ at, ratio, limit: problem.timeLimit });
      });
    });

    const median = (values) => {
      const sorted = values.slice().sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    };

    const results = [];
    bySkill.forEach((attempts, skillId) => {
      if (attempts.length < 16) return;
      attempts.sort((a, b) => a.at - b.at);
      const early = attempts.slice(0, Math.max(8, Math.floor(attempts.length / 3)));
      const recent = attempts.slice(-Math.max(8, Math.floor(attempts.length / 3)));
      const gapDays = (recent[0].at - early[early.length - 1].at) / 86400;
      if (gapDays < 7) return;
      const earlyRatio = median(early.map((item) => item.ratio));
      const recentRatio = median(recent.map((item) => item.ratio));
      if (!(earlyRatio > 0) || recentRatio >= earlyRatio * 0.85) return; // 要快 15% 才算
      const typicalLimit = median(attempts.map((item) => item.limit));
      results.push({
        skillId,
        label: window.BuzzSkillGraph.label(skillId),
        beforeSec: Math.round(earlyRatio * typicalLimit),
        afterSec: Math.round(recentRatio * typicalLimit),
        speedup: earlyRatio / recentRatio,
        daysSpan: Math.round((recent[recent.length - 1].at - early[0].at) / 86400)
      });
    });
    return results.sort((a, b) => b.speedup - a.speedup).slice(0, 3);
  }

  function renderSpeedProgress(records) {
    const rows = speedProgressData(records);
    if (!rows.length) return "";
    return `
      <section class="study-card speed-progress">
        <div class="panel-title-row">
          <div>
            <p class="section-label">反射進步</p>
            <h3>同型題，你變快了</h3>
          </div>
        </div>
        <p class="panel-note">同一個技巧、計時答對的題，早期 vs 近期的中位耗時。這是你自己的數據，不是我們的宣稱。</p>
        <div class="speed-rows">
          ${rows
            .map(
              (row) => `
                <div class="speed-row">
                  <strong>${escapeHtml(row.label)}</strong>
                  <span class="speed-figures num">${row.beforeSec}s → <b>${row.afterSec}s</b></span>
                  <small>${row.daysSpan} 天內快了 ${row.speedup >= 1.95 ? Math.round(row.speedup * 10) / 10 + " 倍" : Math.round((1 - 1 / row.speedup) * 100) + "%"}</small>
                </div>`
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderInsights() {
    const records = loadRecords();
    const profile = abilityProfile(records);

    if (!profile) {
      return `
        <main class="screen">
          <section class="study-card">
            <p class="section-label">數據</p>
            <h3>能力模型未載入</h3>
            <p class="panel-note">重新整理一次頁面。若持續發生，代表 kernel 檔沒有載入成功。</p>
          </section>
        </main>
      `;
    }

    if (!profile.coverage.attempts) {
      return `
        <main class="screen">
          <section class="study-card">
            <p class="section-label">數據</p>
            <h3>還沒有資料</h3>
            <p class="panel-note">先打一局訓練，這裡就會出現你的技巧雷達、速度象限與錯因分佈。</p>
            <div class="action-row">
              <button class="button home-primary" data-action="home">${icon("play")}回去開一局</button>
            </div>
          </section>
        </main>
      `;
    }

    return `
      <main class="screen insights-screen">
        ${renderInsightsSummary(profile)}
        ${renderWeeklyReport(records)}
        ${renderSpeedProgress(records)}
        ${renderMasteryRadar(records)}
        ${renderSpeedQuadrant(profile)}
        ${renderSkillTable(profile)}
        ${renderCauseBreakdown(profile)}
        ${renderActivityHeatmap(records)}
      </main>
    `;
  }

  // 能力模型的結果在同一次 render 內是不會變的，但首頁會問兩次
  // （今天的訓練一次、成長證據一次），數據頁更多。實測首頁 render 6.9ms，
  // 其中大半是重複算的 profile。
  //
  // 用資料指紋當 key 而不是「每次 render 清掉」：這樣跨 render 也能重用，
  // 而且紀錄一變（答完一題）指紋就變，不會拿到過期的數字。
  let abilityCache = { key: "", value: null };

  function abilityFingerprint(records) {
    const history = records.history || [];
    const last = history.length ? history[0].finishedAt || "" : "";
    return [
      history.length,
      Number(records.totalAnswered || 0),
      (records.attemptLog || []).length,
      Object.keys(records.mistakes || {}).length,
      Object.keys(records.conf || {}).length,
      last
    ].join(":");
  }

  function abilityProfile(records) {
    if (!window.BuzzAbility || !window.BuzzSkillGraph) return null;
    const key = abilityFingerprint(records);
    if (abilityCache.key === key && abilityCache.value) return abilityCache.value;
    try {
      const value = window.BuzzAbility.profile(records, { radarAxes: RADAR_AXES });
      abilityCache = { key, value };
      return value;
    } catch (_error) {
      return null;
    }
  }

  function trendChip(value, unit = "") {
    if (value === null || value === undefined) return `<span class="trend-chip is-flat">—</span>`;
    if (value === 0) return `<span class="trend-chip is-flat">持平</span>`;
    const cls = value > 0 ? "is-up" : "is-down";
    return `<span class="trend-chip ${cls}">${value > 0 ? "+" : ""}${value}${unit}</span>`;
  }

  function renderInsightsSummary(profile) {
    const overall = profile.overall;
    const up = profile.trend.fastestUp;
    const down = profile.trend.fastestDown;
    return `
      <section class="study-card insights-summary">
        <div class="panel-title-row">
          <div>
            <p class="section-label">整體能力</p>
            <h3>${overall.mastery === null ? "資料不足" : `${overall.mastery} 分`}</h3>
          </div>
          <div class="insights-trends">
            <div><span>7 天</span>${trendChip(profile.trend.d7)}</div>
            <div><span>30 天</span>${trendChip(profile.trend.d30)}</div>
          </div>
        </div>
        <p class="panel-note">
          測得出來的技巧 ${profile.coverage.skillsMeasured} 個 / 碰過 ${profile.coverage.skillsTouched} 個 ·
          累計 ${profile.coverage.attempts} 次作答
        </p>
        <div class="insights-movers">
          <div class="mover is-up">
            <span>本週進步最快</span>
            <strong>${up ? `${escapeHtml(up.label)} ${trendChip(up.delta)}` : "還看不出來"}</strong>
          </div>
          <div class="mover is-down">
            <span>本週退步最快</span>
            <strong>${down ? `${escapeHtml(down.label)} ${trendChip(down.delta)}` : "沒有退步的技巧"}</strong>
          </div>
        </div>
      </section>
    `;
  }

  // Speed × Accuracy 象限圖。橫軸是「相對耗時」（elapsed / timeLimit），
  // 縱軸是限時正確率 —— 這張圖回答的是「你是不會，還是來不及」。
  function renderSpeedQuadrant(profile) {
    const points = Object.values(profile.skills).filter(
      (entry) => entry.quadrant && entry.speed !== null && entry.pressureAccuracy !== null
    );

    if (!points.length) {
      return `
        <section class="study-card">
          <p class="section-label">速度 × 正確率</p>
          <h3>還測不出來</h3>
          <p class="panel-note">需要同一個技巧累積 8 題以上的限時作答。多打幾局限時訓練就會出現。</p>
        </section>
      `;
    }

    const W = 320;
    const H = 240;
    const pad = 34;
    // 相對耗時超過 1.2 的都畫在最右邊：超時本來就不需要再細分
    const x = (speed) => pad + (Math.min(1.2, speed) / 1.2) * (W - pad - 12);
    const y = (acc) => H - pad - acc * (H - pad - 12);
    const fastLine = x(0.6);
    const accLine = y(0.7);

    const dots = points
      .map((entry) => {
        const cx = x(entry.speed).toFixed(1);
        const cy = y(entry.pressureAccuracy).toFixed(1);
        return `<circle class="quad-dot is-${entry.quadrant.key}" cx="${cx}" cy="${cy}" r="5">
          <title>${escapeHtml(entry.label)}：${entry.quadrant.label} · 正確率 ${Math.round(entry.pressureAccuracy * 100)}% · 相對耗時 ${entry.speed.toFixed(2)}</title>
        </circle>`;
      })
      .join("");

    const counts = points.reduce((acc, entry) => {
      acc[entry.quadrant.key] = (acc[entry.quadrant.key] || 0) + 1;
      return acc;
    }, {});
    const legend = [
      { key: "reflex", label: "反射區", note: "快又準" },
      { key: "slow", label: "會但慢", note: "方法對、不熟" },
      { key: "rushed", label: "衝太快", note: "讀題或代數不穩" },
      { key: "unbuilt", label: "還沒建立", note: "缺技巧" }
    ];

    return `
      <section class="study-card quadrant-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">速度 × 正確率</p>
            <h3>你是不會，還是來不及</h3>
          </div>
        </div>
        <svg class="quadrant-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="速度與正確率的四象限圖">
          <line class="quad-axis" x1="${pad}" y1="${H - pad}" x2="${W - 8}" y2="${H - pad}"></line>
          <line class="quad-axis" x1="${pad}" y1="8" x2="${pad}" y2="${H - pad}"></line>
          <line class="quad-split" x1="${fastLine}" y1="8" x2="${fastLine}" y2="${H - pad}"></line>
          <line class="quad-split" x1="${pad}" y1="${accLine}" x2="${W - 8}" y2="${accLine}"></line>
          <text class="quad-label" x="${pad}" y="${H - 10}">快</text>
          <text class="quad-label" x="${W - 24}" y="${H - 10}">慢</text>
          <text class="quad-label" x="6" y="16">準</text>
          <text class="quad-label" x="6" y="${H - pad}">錯</text>
          ${dots}
        </svg>
        <div class="quad-legend">
          ${legend
            .map(
              (item) => `
                <div class="quad-legend-item is-${item.key}">
                  <span class="quad-swatch"></span>
                  <strong>${item.label}</strong>
                  <small>${item.note} · ${counts[item.key] || 0} 個技巧</small>
                </div>`
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // 技巧清單：只列測得準的，並且每一列都帶一句診斷。
  // 只給分數不給診斷的話，使用者知道「Frullani 41 分」但不知道要做什麼。
  function renderSkillTable(profile) {
    const rows = profile.weakest
      .map((id) => profile.skills[id])
      .filter((entry) => entry && entry.mastery !== null)
      .slice(0, 12);

    const stale = Object.values(profile.skills).filter((entry) => entry.stale);

    if (!rows.length) {
      return `
        <section class="study-card">
          <p class="section-label">技巧</p>
          <h3>還沒有技巧測得準</h3>
          <p class="panel-note">同一個技巧累積約 12 次作答之後才會給分數 —— 樣本不夠時寧可留白，也不給不準的數字。</p>
        </section>
      `;
    }

    return `
      <section class="study-card skill-table-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">技巧精熟度</p>
            <h3>從最弱的開始</h3>
          </div>
        </div>
        <ul class="skill-rows">
          ${rows
            .map((entry) => {
              const pct = entry.mastery;
              const pa = entry.pressureAccuracy === null ? null : Math.round(entry.pressureAccuracy * 100);
              const ua = entry.untimedAccuracy === null ? null : Math.round(entry.untimedAccuracy * 100);
              return `
                <li class="skill-row is-${entry.state}">
                  <div class="skill-row-head">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <span class="skill-state">${escapeHtml(entry.stateLabel)} ${pct}</span>
                  </div>
                  <div class="skill-bar"><div class="skill-fill" style="width:${pct}%"></div></div>
                  <div class="skill-row-meta">
                    <span>${entry.n} 題</span>
                    ${pa !== null ? `<span>限時 ${pa}%</span>` : ""}
                    ${ua !== null ? `<span>不限時 ${ua}%</span>` : ""}
                    ${entry.quadrant ? `<span>${escapeHtml(entry.quadrant.label)}</span>` : ""}
                  </div>
                  ${
                    entry.diagnosis
                      ? `<p class="skill-diagnosis">${escapeHtml(entry.diagnosis.text)} —— ${escapeHtml(entry.diagnosis.advice)}</p>`
                      : ""
                  }
                </li>`;
            })
            .join("")}
        </ul>
        ${
          stale.length
            ? `<p class="panel-note">另外有 ${stale.length} 個技巧太久沒練，資料已經不算數了 —— 重新練幾題就會回到這張表。</p>`
            : ""
        }
      </section>
    `;
  }

  // 錯因分佈。「我其實是算錯，不是不會」這句話要有數字支撐才有意義。
  function renderCauseBreakdown(profile) {
    const totals = {};
    Object.values(profile.skills).forEach((entry) => {
      Object.keys(entry.causes || {}).forEach((cause) => {
        totals[cause] = (totals[cause] || 0) + entry.causes[cause];
      });
    });
    const labels = {
      "algebra-slip": "算錯，不是不會",
      "wrong-technique": "選錯方法",
      "forgot-formula": "忘公式",
      timeout: "來不及",
      misread: "看錯題目"
    };
    const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const total = rows.reduce((sum, row) => sum + row[1], 0);

    if (!total) {
      return `
        <section class="study-card">
          <p class="section-label">錯因</p>
          <h3>還沒有錯因資料</h3>
          <p class="panel-note">答錯後在結算頁標一下原因（粗心 / 不會 / 忘公式），這裡就會統計出你最常犯的錯。</p>
        </section>
      `;
    }

    const slip = totals["algebra-slip"] || 0;
    const slipRate = Math.round((slip / total) * 100);

    return `
      <section class="study-card cause-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">錯因分佈</p>
            <h3>${slipRate >= 40 ? "你的問題主要是穩定度，不是技巧" : "你最常犯的錯"}</h3>
          </div>
        </div>
        <ul class="cause-rows">
          ${rows
            .map(([cause, count]) => {
              const pct = Math.round((count / total) * 100);
              return `
                <li class="cause-row is-${escapeAttr(cause)}">
                  <span class="cause-name">${escapeHtml(labels[cause] || cause)}</span>
                  <div class="cause-bar"><div class="cause-fill" style="width:${pct}%"></div></div>
                  <span class="cause-count">${count} 題 · ${pct}%</span>
                </li>`;
            })
            .join("")}
        </ul>
        ${
          slipRate >= 40
            ? `<p class="panel-note">算錯佔了 ${slipRate}%。這種情況該練的是低難度高計算量的題目來穩定代數，而不是往上加難度。</p>`
            : ""
        }
        ${renderCauseAutoNote()}
      </section>
    `;
  }

  // 系統推測的錯因也算進統計，但必須講清楚有多少是推測的 ——
  // 不講的話這張圖看起來像是使用者親自標的，那是在騙人。
  function renderCauseAutoNote() {
    const records = loadRecords();
    let auto = 0;
    let total = 0;
    (records.history || []).forEach((session) => {
      (session && session.answers ? session.answers : []).forEach((answer) => {
        if (!answer || answer.correct || !answer.errorTag) return;
        total += 1;
        if (answer.causeAuto) auto += 1;
      });
    });
    if (!total || !auto) return "";
    return `<p class="panel-note">其中 ${auto}/${total} 筆是系統依作答時間、提示層數與草稿推測的，你可以在結算頁改。</p>`;
  }

  // 信心校準的結果。沒有資料時明白說「還沒問到夠多」，而不是顯示 0。
  // 信心校準面板（「自信但常錯」）已隨信心自評一起移除 ——
  // 它的資料來源就是那個問卷，問卷沒了它就永遠是空的。

  function renderHomeLaunchPad(records, mission, path, weaknesses, mistakeCount) {
    const next = path.next;
    const nodes = path.nodes || [];
    const level = Math.max(1, nodes.findIndex((node) => node.id === next.id) + 1);
    const total = nodes.length || level;
    const mastery = Math.round(next.mastery || 0);
    const remaining = Math.max(0, (mission.target || 0) - (mission.completed || 0));
    const streak = mission.dailyStreak || 0;
    const statusMap = { jump: "可略過", ready: "可開始", active: "進行中", mastered: "已熟練", gold: "已精熟" };
    const statusText = statusMap[next.status] || "可挑戰";
    const isNew = !(records.totalAnswered || 0);
    const hook = isNew
      ? "先清 3 題暖機，找回手感"
      : mission.done
        ? "今日達標，超前部署一波"
        : remaining <= 1
          ? `再 ${remaining} 題就達成今日目標`
          : `再 ${remaining} 題達成今日目標`;
    return `
      <section class="home-launch-pad quest-hero" aria-label="今日練習入口">
        <div class="launch-copy">
          <p class="section-label launch-eyebrow" data-enter>${escapeHtml(homeGreeting())}${streak ? ` · 連勝 ${streak} 天` : ""}</p>
          <div class="quest-tag" data-enter>
            <span class="quest-level">第 ${level} / ${total} 階</span>
            <span class="quest-status is-${escapeAttr(next.status || "ready")}">${escapeHtml(statusText)}</span>
          </div>
          <h1 data-enter>${escapeHtml(next.label)}</h1>
          <p class="launch-hook" data-enter>${escapeHtml(hook)}</p>
          <div class="mastery-row" data-enter>
            <span class="mastery-name">精熟度</span>
            <span class="mastery-pct">${mastery}%</span>
          </div>
          <div class="mastery-gauge" data-enter role="img" aria-label="熟練度 ${mastery}%">
            <div class="mastery-fill" data-fill="${mastery}" style="width:${mastery}%"></div>
          </div>
          <div class="launch-actions" data-enter>
            <button class="button home-primary launch-start" data-action="start-path-node" data-node-id="${escapeAttr(next.id)}">
              ${icon("play")}<span>繼續主線</span><small>${escapeHtml(next.short)}</small>
            </button>
            <button class="button secondary launch-daily" data-action="start-daily">
              ${icon("calendar")}<span>每日</span><small>${mission.completed}/${mission.target}</small>
            </button>
            <button class="button secondary launch-daily-one" data-action="start-daily-one">
              ${icon("puzzle")}<span>每日一題</span><small>${renderDailyOneBadge(records)}</small>
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // 首頁保留區：錯題 SRS 到期卡 + 練習連勝（含盾牌）迷你熱力圖。
  function renderHomeRetentionRow(records) {
    const srsCard = renderHomeSrsCard(records);
    const retestCard = renderHomePathRetestCard(records);
    const refreshCard = renderHomeSkillRefreshCard(records);
    const streakCard = (records.totalAnswered || 0) && !focusModeOn() ? renderHomeStreakCard(records) : "";
    if (!srsCard && !retestCard && !refreshCard && !streakCard) return "";
    return `
      <section class="home-retention" aria-label="複習與連勝">
        ${srsCard}
        ${retestCard}
        ${refreshCard}
        ${streakCard}
      </section>
    `;
  }

  // 延遲回測：昨天在主線練的節點，今天回來考 5 題。
  // 練完當下的正確率量的是短期記憶；隔一夜還答得出來才算學會
  // （testing effect —— 分散測驗是最便宜也最有效的保持機制）。
  // 窗口 20 小時起（同一天不出現，避免「剛練完馬上再考」的假象）、7 天止。
  function pathRetestPending(records) {
    const entry = records.pathRetest;
    if (!entry || entry.doneAt || !entry.nodeId) return null;
    const age = Date.now() - Number(entry.at || 0);
    if (age < 20 * 3600 * 1000 || age > 7 * 86400000) return null;
    const node = PATH_NODES.find((item) => item.id === entry.nodeId);
    return node ? { node, at: entry.at } : null;
  }

  function renderHomePathRetestCard(records) {
    const pending = pathRetestPending(records);
    if (!pending) return "";
    return `
      <div class="retention-card srs-card is-due">
        <div class="retention-copy">
          <p class="section-label">昨日所學回測</p>
          <strong>「${escapeHtml(pending.node.label)}」還記得多少？</strong>
          <span>練完當下會 ≠ 隔天還會 —— 5 題驗收，過了才算真的學進去。</span>
        </div>
        <button class="button" data-action="start-path-retest">${icon("repeat")}回測 5 題</button>
      </div>
    `;
  }

  function startPathRetestQuiz() {
    const records = loadRecords();
    const pending = pathRetestPending(records);
    if (!pending) return;
    const pool = pathNodeProblems(pending.node);
    if (!pool.length) return;
    selectedMode = pending.node.mode || "quick";
    selectedTopic = pending.node.topic || "all";
    const ordered = adaptiveShuffle(preferFreshProblems(pool, records), records, seedFromString(`path-retest-${Date.now()}`));
    startQuiz(ordered.slice(0, 5), { modeKey: pending.node.mode || "quick", pathRetestFor: pending.node.id });
  }

  // 技巧回溫：練會的東西也會忘。
  //
  // 能力模型早就替每個技巧算好 dueAt（精熟度衰減到 65 的那一天），
  // 但訓練層一直沒有消費它 —— 錯題有 SRS，**答對的技巧**卻沒有任何
  // 保持機制：練會之後不再出現，等下次遇到已經忘光。
  // 這張卡挑「曾經練起來、現在過期」的技巧，開一局 8 題把它們拉回來。
  function skillRefreshDue(records) {
    const profile = abilityProfile(records);
    if (!profile) return [];
    const now = profile.now || Date.now();
    return Object.values(profile.skills || {})
      .filter((entry) =>
        entry.measured &&
        entry.mastery !== null &&
        entry.mastery >= 45 &&
        entry.subject !== "science" &&
        entry.dueAt && entry.dueAt <= now &&
        entry.lastAt && now - entry.lastAt >= 7 * 86400000)
      .sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0));
  }

  function renderHomeSkillRefreshCard(records) {
    const due = skillRefreshDue(records);
    if (!due.length) return "";
    const labels = due.slice(0, 3).map((entry) => escapeHtml(entry.label)).join("、");
    return `
      <div class="retention-card srs-card is-due">
        <div class="retention-copy">
          <p class="section-label">技巧回溫</p>
          <strong>${due.length} 個技巧太久沒碰</strong>
          <span>${labels}${due.length > 3 ? "…" : ""} —— 練會的東西也會忘，8 題拉回來。</span>
        </div>
        <button class="button" data-action="start-skill-refresh">${icon("zap")}回溫 8 題</button>
      </div>
    `;
  }

  function startSkillRefreshQuiz() {
    const records = loadRecords();
    const due = skillRefreshDue(records).slice(0, 6);
    if (!due.length || !window.BuzzSkillGraph) return;
    const dueIds = new Set(due.map((entry) => entry.id));
    const pool = problems.filter((problem) =>
      ["limits", "derivatives", "integrals", "series"].includes(problem.topic) &&
      (window.BuzzSkillGraph.skillsForProblem(problem) || []).some((id) => dueIds.has(id)));
    if (!pool.length) return;
    selectedMode = "quick";
    selectedTopic = "all";
    const ordered = adaptiveShuffle(preferFreshProblems(pool, records), records, seedFromString(`skill-refresh-${Date.now()}`));
    startQuiz(ordered.slice(0, 8), { modeKey: "quick" });
  }

  function renderHomeSrsCard(records) {
    const summary = srsDueSummary(records);
    if (!summary.total) return "";
    if (!summary.due) {
      return `
        <div class="retention-card srs-card is-clear">
          <div class="retention-copy">
            <p class="section-label">錯題複習</p>
            <strong>全部複習完成</strong>
            <span>${summary.nextDueDays ? `下一批 ${summary.nextDueDays} 天後到期。` : "沒有排程中的錯題。"}</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="retention-card srs-card is-due">
        <div class="retention-copy">
          <p class="section-label">錯題複習</p>
          <strong>今天到期 ${summary.due} 題</strong>
          <span>照排程清掉，才會真的記住。</span>
        </div>
        <button class="button" data-action="start-srs-review">${icon("refresh")}開始複習</button>
      </div>
    `;
  }

  function renderHomeStreakCard(records) {
    const counts = activityCounts(records);
    const streakInfo = practiceStreakInfo(records, counts);
    const cells = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    cursor.setDate(cursor.getDate() - 6);
    for (let index = 0; index < 7; index += 1) {
      const key = localDateKey(cursor);
      const count = counts[key] || 0;
      const shielded = streakInfo.usedDates.has(key);
      cells.push(`<i class="heatmap-cell ${shielded ? "is-shielded" : ""}" data-level="${activityLevel(count)}" title="${escapeAttr(`${key} · ${count} 題${shielded ? " · 盾牌保護" : ""}`)}"></i>`);
      cursor.setDate(cursor.getDate() + 1);
    }
    return `
      <div class="retention-card streak-card">
        <div class="retention-copy">
          <p class="section-label">練習連勝</p>
          <strong>${streakInfo.streak} 天</strong>
          <span class="shield-chip ${streakInfo.shieldAvailable ? "is-ready" : "is-used"}">${icon("shield")}盾牌${streakInfo.shieldAvailable ? "可用" : "本週已用"}</span>
        </div>
        <div class="mini-heatmap" aria-label="最近 7 天練習量">${cells.join("")}</div>
      </div>
    `;
  }


  function renderSessionSettings(records) {
    const cap = activeDifficultyCap(records);
    const level = difficultyLevel(cap);
    const ansLabel = ANSWER_MODES[selectedAnswerMode]?.label || "選擇題";
    return `
      <section class="session-settings-wrap">
        <details class="session-settings" data-session-settings ${sessionSettingsOpen ? "open" : ""}>
          <summary>
            <span><strong>本局設定</strong><small>${escapeHtml(level.label)} ${escapeHtml(level.short)} · ${escapeHtml(ansLabel)}</small></span>
            ${icon("chevron-down")}
          </summary>
          <div class="session-settings-body">
            ${renderDifficultyControl(records)}
            ${renderHomeAnswerModeBar()}
          </div>
        </details>
      </section>
    `;
  }

  function homeGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return "夜深了，慢慢來";
    if (hour < 11) return "早安，開練吧";
    if (hour < 14) return "午安，來幾題";
    if (hour < 18) return "下午好，繼續";
    if (hour < 23) return "晚安，練一輪";
    return "夜深了，慢慢來";
  }

  function renderHomeAnswerModeBar() {
    return `
      <section class="answer-mode-strip" aria-label="作答形式">
        <div>
          <p class="section-label">作答形式</p>
          <strong>${ANSWER_MODES[selectedAnswerMode]?.label || "選擇題"}</strong>
        </div>
        ${renderAnswerModePicker("strip-answer-picker")}
      </section>
    `;
  }

  function renderDifficultyControl(records) {
    const cap = activeDifficultyCap(records);
    selectedDifficultyCap = cap;
    const level = difficultyLevel(cap);
    const count = difficultyScopedCount(cap, selectedTopic, selectedPack);
    const percent = ((cap - 1) / 5) * 100;
    return `
      <section class="difficulty-strip" aria-label="難度上限">
        <div class="difficulty-copy">
          <p class="section-label">難度上限</p>
          <strong>${escapeHtml(level.label)} · ${escapeHtml(level.short)}</strong>
          <span>${escapeHtml(level.note)} 一般訓練目前可抽 ${count} 題。</span>
        </div>
        <div class="difficulty-range" style="--difficulty-progress:${percent}%">
          <input type="range" min="1" max="6" step="1" value="${cap}" data-difficulty-cap aria-label="調整難度上限" />
          <div class="difficulty-scale" aria-hidden="true">
            ${Object.entries(DIFFICULTY_LEVELS)
              .map(([rank, item]) => `<span class="${Number(rank) <= cap ? "is-active" : ""}">R${rank}<small>${escapeHtml(item.label)}</small></span>`)
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderBuzzPath(path, mission) {
    const next = path.next;
    const masteredCount = path.nodes.filter((node) => node.status === "mastered" || node.status === "gold").length;
    const totalProgress = Math.round(path.nodes.reduce((sum, node) => sum + node.mastery, 0) / Math.max(1, path.nodes.length));
    const nextIndex = Math.max(0, path.nodes.findIndex((node) => node.id === next.id));
    const recommendation = pathRecommendation(path, mission);
    return `
      <section class="buzz-path-card">
        <div class="path-hero">
          <div class="path-hero-copy">
            <p class="section-label">主線路線</p>
            <h2>下一格：${escapeHtml(next.label)}</h2>
            <p>${escapeHtml(next.note)}</p>
          </div>
        </div>
        <div class="path-recommendation">
          <span>推薦下一步</span>
          <strong>${escapeHtml(recommendation)}</strong>
        </div>

        <div class="next-lesson-card">
          <span class="path-node-ring next-lesson-ring">
            <span class="path-node-core">${icon(next.icon)}</span>
          </span>
          <div class="next-lesson-copy">
            <span>第 ${nextIndex + 1} 格</span>
            <strong>${escapeHtml(next.label)}</strong>
            <small>${escapeHtml(next.note)}</small>
          </div>
          <button class="button home-primary" data-action="start-path-node" data-node-id="${escapeAttr(next.id)}">${icon("play")}開始</button>
        </div>

        <div class="path-progress-line">
          <div>
            <span>已熟練 ${masteredCount}/${path.nodes.length}</span>
            <strong>${totalProgress}%</strong>
          </div>
          <div class="meter-track"><div class="meter-fill" style="width:${totalProgress}%"></div></div>
        </div>

        <div class="buzz-path-map" aria-label="BuzzCalculus learning path">
          ${renderPathLine(path)}
          ${path.nodes.map((node, index) => renderPathNode(node, index, node.id === next.id)).join("")}
        </div>
      </section>
    `;
  }

  function renderPathLine(path) {
    const total = Math.max(1, path.nodes.length);
    const unlockedIdx = justUnlockedNodeId
      ? path.nodes.findIndex((node) => node.id === justUnlockedNodeId)
      : -1;
    // Transient flag is consumed on this render; a normal visit shows a static line.
    justUnlockedNodeId = "";
    if (unlockedIdx >= 0) {
      const frac = Math.min(1, (unlockedIdx + 0.5) / total);
      return `
        <svg class="path-line" preserveAspectRatio="none" aria-hidden="true">
          <line class="path-line-draw" data-draw-line data-draw-to="${frac.toFixed(3)}" x1="50%" y1="0" x2="50%" y2="100%" />
        </svg>
      `;
    }
    return `
      <svg class="path-line" preserveAspectRatio="none" aria-hidden="true">
        <line class="path-line-draw" x1="50%" y1="0" x2="50%" y2="100%" />
      </svg>
    `;
  }

  function renderPathNode(node, index, isNext = false) {
    const statusText = {
      jump: "可跳關",
      ready: "可開始",
      active: "進行中",
      mastered: "熟練",
      gold: "金色"
    }[node.status] || "可開始";
    const label = isNext ? "下一格" : statusText;
    const badge = node.status === "gold" ? "金" : node.status === "mastered" ? "通過" : node.gated ? "關卡" : "";
    return `
      <div class="path-step is-${node.status} ${isNext ? "is-next" : ""}">
        <button class="path-node-button" data-action="start-path-node" data-node-id="${escapeAttr(node.id)}" aria-label="${escapeAttr(`${node.label}，${label}`)}" title="${escapeAttr(`${node.label} · ${label}`)}">
          <span class="path-node-ring">
            <span class="path-node-core">${icon(node.icon)}</span>
          </span>
          <span class="path-node-copy">
            <strong>${escapeHtml(node.short)}</strong>
            <small>${label} · ${node.relatedCount} 題</small>
          </span>
          ${badge ? `<span class="path-badge">${badge}</span>` : ""}
          <span class="path-node-progress">${isNext ? `${index + 1}` : `${node.mastery}%`}</span>
        </button>
      </div>
    `;
  }

  function renderPathIntro() {
    const records = loadRecords();
    const path = learningPathState(records);
    const node = path.nodes.find((item) => item.id === activePathNodeId) || path.next || path.nodes[0];
    const lesson = PATH_LESSONS[node.id] || {
      focus: node.note,
      bullets: ["先判斷題型，再選擇最短工具。"],
      example: ""
    };
    const index = Math.max(0, path.nodes.findIndex((item) => item.id === node.id));
    const unlocked = !node.gated || pathGateUnlocked(records, node.id);
    const gate = pathGateInfo(node);
    return `
      <main class="screen path-intro-screen">
        <section class="path-intro-card">
          <div class="path-intro-head">
            <button class="button ghost" data-action="home">${icon("home")}回主線</button>
            <span>第 ${index + 1} 關 · ${node.relatedCount} 題</span>
          </div>
          <div class="path-intro-main">
            <span class="path-node-ring next-lesson-ring">
              <span class="path-node-core">${icon(node.icon)}</span>
            </span>
            <div>
              <p class="section-label">${node.gated && !unlocked ? "跳關前測" : "關卡簡介"}</p>
              <h2>${escapeHtml(node.label)}</h2>
              <p>${escapeHtml(lesson.focus)}</p>
            </div>
          </div>

          <div class="path-lesson-grid">
            <section class="path-lesson-panel">
              <h3>先記這幾件事</h3>
              <ul>
                ${lesson.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>
            <section class="path-lesson-panel">
              <h3>本關目標</h3>
              <div class="path-intro-stats">
                <div><span>熟練度</span><strong>${node.mastery}%</strong></div>
                <div><span>已練</span><strong>${node.unique}/${node.relatedCount}</strong></div>
                <div><span>題數</span><strong>${(MODES[node.mode] || MODES.quick).count}</strong></div>
              </div>
              ${lesson.example ? `<div class="path-example math-block" data-tex="${escapeAttr(lesson.example)}"></div>` : ""}
            </section>
          </div>

          ${
            unlocked
              ? `
                <div class="path-intro-actions">
                  <button class="button home-primary" data-action="start-path-lesson" data-node-id="${escapeAttr(node.id)}">${icon("play")}開始本關</button>
                  <button class="button secondary" data-action="home">${icon("home")}稍後再練</button>
                </div>`
              : `
                <div class="path-gate-box">
                  <div>
                    <strong>這是跳關</strong>
                    <span>先完成 ${gate.total} 題小測驗，答對 ${gate.required} 題即可進入本關。</span>
                  </div>
                  <button class="button home-primary" data-action="start-path-gate" data-node-id="${escapeAttr(node.id)}">${icon("play")}開始小測驗</button>
                </div>`
          }
        </section>
      </main>
    `;
  }

  function renderHomeMorePanel(records, weaknesses, mistakeCount) {
    return `
      <section class="home-more">
        <details class="home-more-panel" data-home-more-panel ${homeMoreOpen ? "open" : ""}>
          <summary>
            <span>
              <strong>更多練習</strong>
              <small>暖身、大考、模擬考、競賽魔王、自訂一局</small>
            </span>
            ${icon("chevron-down")}
          </summary>
          <div class="home-more-body">
            <nav class="quick-entries" aria-label="快速入口">
              <button data-action="start-friendly-run">${icon("sparkles")}<span>輕鬆暖身</span><small>R1-R2</small></button>
              <button data-action="start-mode" data-mode-key="exam">${icon("file-pen-line")}<span>大考模式</span><small>20 題 / 45 分</small></button>
              <button data-action="start-god-run">${icon("flame")}<span>競賽魔王</span><small>R6 · 競賽級</small></button>
            </nav>
            ${renderNamedExamPanel(records)}
            <section class="control-band practice-control home-compact-control">
              <div class="home-control-head">
                <div>
                  <p class="section-label">自訂一局</p>
                  <h3>挑題目自己練</h3>
                </div>
                <div class="home-selected-pill">${packAvailabilityText(selectedPack)}</div>
              </div>

              <div class="home-control-grid">
                <div class="control-section">
                  <p class="section-label">模式</p>
                  ${renderModePicker()}
                </div>
                <div class="control-section">
                  <p class="section-label">範圍</p>
                  ${renderTopicPicker()}
                </div>
              </div>

              <div class="pack-picker home-pack compact-pack">
                <label for="pack-select">
                  <span>題包</span>
                  <select id="pack-select" data-pack-select aria-label="題包選擇">
                    ${renderPackOptions()}
                  </select>
                </label>
              </div>

              <div class="control-section">
                <p class="section-label">每日目標</p>
                <div class="goal-options" role="group" aria-label="每日目標">
                  ${[5, 10, 12, 20].map((value) => `<button class="tag-button ${dailyGoal(records) === value ? "is-active" : ""}" data-action="set-daily-goal" data-goal="${value}">${value} 題</button>`).join("")}
                </div>
              </div>

              <div class="action-row">
                <button class="button custom-start" data-action="start">${icon("play")}自訂開始</button>
              </div>
            </section>

            <details class="extra-challenge-drawer home-extra-modes">
              <summary>其他模式（${EXPERIMENTAL_MODE_KEYS.filter((key) => key !== "exam").length}）</summary>
              <div class="challenge-mode-grid">
                ${EXPERIMENTAL_MODE_KEYS.filter((key) => key !== "exam")
                  .map((key) => {
                    const mode = MODES[key];
                    return `
                      <button class="challenge-mode" data-action="start-mode" data-mode-key="${escapeAttr(key)}">
                        <strong>${escapeHtml(mode.label)}</strong>
                        <span>${escapeHtml(modeDescription(key))}</span>
                      </button>`;
                  })
                  .join("")}
              </div>
            </details>

            <nav class="home-more-links" aria-label="其他頁面">
              <button data-action="open-library">${icon("search")}題庫</button>
              <button data-action="open-boss-lab">${icon("trophy")}Boss 專區</button>
              <button data-action="open-proofs">${icon("file-pen-line")}證明題</button>
              <button data-action="open-creator">${icon("file-pen-line")}出題工作坊</button>
              <button data-action="open-settings">${icon("settings")}資料與設定</button>
            </nav>
          </div>
        </details>
      </section>
    `;
  }

  function renderNamedExamPanel(records) {
    const stats = records.namedExams || {};
    return `
      <section class="named-exam-panel" aria-label="模擬考">
        <div class="named-exam-head">
          <p class="section-label">模擬考</p>
          <h3>整份限時，考前拿這幾張卷自我檢測</h3>
          <span>同一次挑戰抽題固定；重考會換一份新卷。及格線 60%。</span>
        </div>
        <div class="named-exam-grid">
          ${Object.entries(NAMED_EXAMS)
            .map(([id, config]) => {
              const stat = stats[id];
              const line = stat && stat.attempts
                ? `最佳 ${Math.round(Number(stat.best || 0))}% · 上次 ${String(stat.lastAt || "").slice(0, 10) || "—"} · 已考 ${Number(stat.attempts || 0)} 次`
                : "尚未挑戰";
              return `
                <button class="named-exam-card" data-action="start-named-exam" data-exam-id="${escapeAttr(id)}">
                  <strong>${escapeHtml(config.label)}</strong>
                  <span>${escapeHtml(config.note)}</span>
                  <small>${escapeHtml(line)}</small>
                </button>`;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  // ── 開局 Onboarding ─────────────────────────────────────────
  // spec 04.5：新使用者第一次進站要在 6 分鐘內完成一次有效訓練並看到自己的定位。
  //
  // 舊的第一屏給了 5 個並列選項（定位測驗 / 先暖身 / 照主線 / 直接挑戰 / 稍後），
  // 那不是「選一個起點」，那是把決策成本丟給一個還不知道這站在幹嘛的人。
  //
  // 硬規則：
  //   - 每一步只有一個主要動作
  //   - 定位測驗可以跳過，跳過就用自陳給一個保守起點
  //   - 最後一步的出口只有一個：開始練。不給「隨便逛逛」
  //   - 第一次進站永遠不會看到 1407 題的題庫頁
  const ONBOARDING_CONTEXTS = [
    { key: "highschool", label: "高中先修", note: "先把基本工具練熟", cap: 2 },
    { key: "freshman", label: "大一微積分", note: "跟著課程進度練", cap: 3 },
    { key: "exam", label: "期中期末要考了", note: "考前衝刺，抓弱點", cap: 4, suggestExam: true },
    { key: "maintain", label: "想維持手感", note: "已經學過，不想生鏽", cap: 4 }
  ];

  function renderOnboarding() {
    const step = onboardingStep;
    if (step === "context") return renderOnboardingContext();
    return renderOnboardingIntro();
  }

  function renderOnboardingIntro() {
    return `
      <main class="screen onboarding-screen">
        <section class="onboarding-card">
          <p class="section-label">BuzzCalculus</p>
          <h1>這是微積分的健身房，不是課本。</h1>
          <p class="onboarding-lead">
            這裡不教你微積分，這裡讓你把已經學過的東西<strong>練到反射</strong> ——
            看到題目就知道該用哪個工具，而不是想三分鐘。
          </p>
          <ul class="onboarding-points">
            <!-- 題數要從題庫算，不能寫死。寫死的那版停在 1407，
                 而使用者第一眼看到的數字跟題庫頁顯示的 1459 對不上 ——
                 這是最不該在第一畫面出現的那種不一致。 -->
            <li>${icon("target")}<span>${problems.length} 題微積分，依技巧分類而不是章節</span></li>
            <li>${icon("activity")}<span>會告訴你是「不會」還是「來不及」</span></li>
            <li>${icon("refresh")}<span>錯題自動排程回鍋，不是丟進倉庫</span></li>
          </ul>
          <p class="onboarding-privacy">紀錄只存在這台裝置的瀏覽器，不需要註冊。</p>
          <div class="action-row">
            <button class="button home-primary" data-action="onboarding-next">${icon("play")}開始</button>
          </div>
        </section>
      </main>
    `;
  }

  function renderOnboardingContext() {
    return `
      <main class="screen onboarding-screen">
        <section class="onboarding-card">
          <p class="section-label">第 2 步 / 共 3 步</p>
          <h1>你現在在哪個階段？</h1>
          <p class="onboarding-lead">這只是用來決定起始難度，之後隨時可以調。</p>
          <div class="context-grid">
            ${ONBOARDING_CONTEXTS.map(
              (item) => `
                <button class="context-option" data-action="set-onboarding-context" data-context="${escapeAttr(item.key)}">
                  <strong>${escapeHtml(item.label)}</strong>
                  <small>${escapeHtml(item.note)}</small>
                </button>`
            ).join("")}
          </div>
        </section>
      </main>
    `;
  }

  function renderOnboardingPlacementOffer(records) {
    const context = ONBOARDING_CONTEXTS.find((item) => item.key === records.onboardingContext);
    return `
      <main class="screen onboarding-screen">
        <section class="onboarding-card">
          <p class="section-label">第 3 步 / 共 3 步</p>
          <h1>先花 5 分鐘測出你的底</h1>
          <p class="onboarding-lead">
            8 題自適應：答對就變難、答錯就變簡單。測完你會看到自己落在哪一級、
            哪個技巧最弱，之後的每日訓練都會照這個排。
          </p>
          <p class="onboarding-privacy">不想測也可以直接開始，我們會先給你${context ? `「${escapeHtml(context.label)}」` : ""}的保守起點，再從實際作答慢慢校準。</p>
          <div class="action-row">
            <button class="button home-primary" data-action="start-placement">${icon("target")}開始定位測驗</button>
            <button class="button ghost" data-action="skip-placement">直接開始練</button>
          </div>
        </section>
      </main>
    `;
  }

  function advanceOnboarding() {
    onboardingStep = "context";
    render();
  }

  function setOnboardingContext(key) {
    const entry = ONBOARDING_CONTEXTS.find((item) => item.key === key) || ONBOARDING_CONTEXTS[1];
    const records = loadRecords();
    records.onboardingContext = entry.key;
    records.settings = records.settings || {};
    records.settings.difficultyCap = entry.cap;
    saveRecords(records);
    selectedDifficultyCap = entry.cap;
    onboardingStep = "placement";
    trackEvent("onboarding_step", { step: "context", context: entry.key });
    render();
  }

  // 跳過定位測驗：用自陳給一個保守起點，並老實說它是估的。
  function skipPlacement() {
    const records = loadRecords();
    records.onboardingSeen = true;
    saveRecords(records);
    onboardingStep = "intro";
    trackEvent("onboarding_step", { step: "placement", skipped: true });
    showAppNotice("已用你選的階段設定起始難度。實際練幾局之後會自動校準。");
    view = "home";
    render();
  }

  // 定位測驗結束後**只有一個出口**：開始練。
  // 給「隨便逛逛」的話，一個剛測完的人會去逛題庫然後就走了 ——
  // 而那正是 onboarding 完成率掉下來的地方。
  function renderPlacementNextStep() {
    const records = loadRecords();
    const plan = plannedSession(records);
    const minutes = plan ? Math.max(1, Math.round(plan.filled.estSeconds / 60)) : 15;
    const count = plan ? plan.filled.problems.length : 12;
    return `
      <div class="placement-next" data-enter>
        <p class="placement-next-lead">${plan ? escapeHtml(plan.recipe.why) : "已經照你的定位排好第一份訓練。"}</p>
        <div class="action-row">
          <button class="button home-primary" data-action="start-planned" data-length="daily15">
            ${icon("play")}開始第一份訓練 · ${minutes} 分鐘 ${count} 題
          </button>
          <button class="button ghost" data-action="home">${icon("home")}先看看首頁</button>
        </div>
      </div>
    `;
  }

  function renderFirstRunNotice() {
    return `
      <section class="first-run-panel">
        <div>
          <p class="section-label launch-eyebrow">歡迎</p>
          <h3>微積分反射訓練</h3>
          <p>選一個起點。紀錄只會保存在本機瀏覽器。</p>
        </div>
        <div class="onboarding-actions">
          <button class="button placement-cta" data-action="start-placement">${icon("target")}5 分鐘定位測驗</button>
          ${Object.entries(ONBOARDING_LEVELS)
            .map(([key, item]) => `<button class="button ${key === "standard" ? "secondary" : "ghost"}" data-action="set-onboarding-level" data-level="${escapeAttr(key)}">${escapeHtml(item.label)}</button>`)
            .join("")}
          <button class="button ghost" data-action="dismiss-onboarding">${icon("check")}稍後</button>
        </div>
        <p class="first-run-hint">不知道從哪開始？做定位測驗，8 題就能校準你的起點。</p>
      </section>
    `;
  }

  function renderModePicker() {
    const primary = SIMPLE_MODE_KEYS;
    const advanced = EXPERIMENTAL_MODE_KEYS;
    const recos = modeRecommendations(loadRecords());
    const modeButton = (key) => {
      const item = MODES[key];
      const reco = recos.get(key);
      return `
        <button class="segment rich-segment ${selectedMode === key ? "is-active" : ""}" aria-pressed="${selectedMode === key ? "true" : "false"}" data-mode="${key}" ${reco ? `title="${escapeAttr(reco)}"` : ""}>
          <strong>${item.label}${reco ? `<em class="mode-reco">今天適合</em>` : ""}</strong>
          <span>${reco ? escapeHtml(reco) : modeDescription(key)}</span>
        </button>`;
    };
    // 推薦落在抽屜裡的模式時抽屜要自己打開 —— 收起來的推薦等於沒有推薦
    const advancedRecommended = advanced.some((key) => recos.has(key));
    return `
      <p class="mode-picker-note">通常只需要選這三個；高壓玩法收在下面。</p>
      <div class="segmented modes learning-picker" role="group" aria-label="模式選擇">
        ${primary.filter((key) => MODES[key]).map(modeButton).join("")}
      </div>
      <details class="advanced-mode-drawer" data-advanced-mode-drawer ${(advancedModeOpen || advancedRecommended || advanced.includes(selectedMode)) ? "open" : ""}>
        <summary>實驗 / 高壓模式（${advanced.length}）</summary>
        <div class="segmented modes learning-picker">
          ${advanced.filter((key) => MODES[key]).map(modeButton).join("")}
        </div>
      </details>
    `;
  }

  function renderTopicPicker() {
    return `
      <div class="segmented home-topic-grid learning-picker" role="group" aria-label="題型選擇">
        ${Object.entries(TOPICS)
          .filter(([key]) => key !== "all" || selectedMode !== "topic")
          .map(
            ([key, item]) => `
              <button class="segment rich-segment ${selectedTopic === key ? "is-active" : ""}" aria-pressed="${selectedTopic === key ? "true" : "false"}" data-topic="${key}">
                <strong>${item.label}</strong>
                <span>${topicCountText(key)}｜${topicDescription(key)}</span>
              </button>`
          )
          .join("")}
      </div>
    `;
  }

  function renderAnswerModePicker(extraClass = "") {
    return `
      <div class="segmented answer-modes learning-picker ${escapeAttr(extraClass)}" role="group" aria-label="答題方式選擇">
        ${Object.entries(ANSWER_MODES)
          .map(
            ([key, item]) => `
              <button class="segment rich-segment ${selectedAnswerMode === key ? "is-active" : ""}" aria-pressed="${selectedAnswerMode === key ? "true" : "false"}" data-answer-mode="${key}">
                <strong>${item.label}</strong>
                <span>${answerModeDescription(key)}</span>
              </button>`
          )
          .join("")}
      </div>
    `;
  }

  function renderDataManagementCard(records) {
    return `
      <aside class="data-management-card">
        <section class="panel">
          <details open>
            <summary>
              <span>資料管理</span>
            </summary>
            <!-- 這三個數字原本叫「作答歷史 / 錯題 / 練習局」，而前後兩個
                 在使用者眼裡是同一件事，數字卻不一樣（一個是累計，一個只留最近 40 局）。
                 看到兩個矛盾的數字之後，人會開始懷疑畫面上所有的數字。 -->
            <div class="mini-stats">
              <div><span>練過幾局</span><strong>${(records.attempts || 0) + (records.practiceRuns || 0)}</strong></div>
              <div><span>錯題本</span><strong>${Object.keys(records.mistakes || {}).length}</strong></div>
              <div title="逐題明細只保留最近 ${HISTORY_LIMIT} 局；更早的局數仍然算在「練過幾局」裡"><span>保留明細</span><strong>${(records.history || []).length}<small> / ${HISTORY_LIMIT}</small></strong></div>
            </div>
            <div class="stack-actions home-record-actions">
              <button class="button secondary" data-action="open-history">${icon("clock")}作答歷史</button>
              <button class="button ghost" data-action="export-records">${icon("download")}匯出 JSON</button>
              <label class="button ghost import-label" for="import-records">${icon("upload")}匯入 JSON</label>
              <button class="button ghost" data-action="reset-records">${icon("trash")}清除資料</button>
              <input class="sr-only" id="import-records" type="file" accept="application/json" />
            </div>
            ${renderCalibrationOptIn()}
            ${renderDisplayControls()}
            ${renderPrivacyControls()}
          </details>
        </section>
      </aside>
    `;
  }

  // 隱私控制項。放在設定頁而不是只寫在條款裡 ——
  // 條款是給法務看的，開關才是給使用者用的。
  // ---- 出卷 ──────────────────────────────────────────────────
  //
  // 這是家教、助教與自學者真正要的東西：照條件抽一份卷、看得到、印得出來。
  // 沒有這個功能，老師就會回去用 Word 手打 —— 然後永遠不會再來一次。
  //
  // 抽卷用固定種子，所以同一組條件永遠抽到同一份：
  // 老師可以把條件抄下來，下次抽到一模一樣的卷（或改一個數字換一份）。
  // 隨機而不可重現的抽卷，在教學現場等於不能用。

  // 紙本考卷產生器（view = "paper"）於 2026-09 移除。
  // 要紙本的話 workbook.html 是同一套題庫排好版的 303 頁 PDF ——
  // 一個「自己抽 10 題來印」的頁面對它沒有增量，卻要維護整套列印樣式。

  // 列印錯題本
  //
  // 紙本是台灣學生真正的複習載體。不做的話使用者會自己截圖 ——
  // 而那個成品長得完全不像這個產品。
  //
  // 這裡不做伺服器排版：直接用瀏覽器的列印，配合 @media print 把介面
  // 剝到只剩題目。「存成 PDF」在每個作業系統的列印對話框裡都是內建選項，
  // 所以零後端也能給出一份看得下去的紙。
  function printMistakes() {
    trackEvent("print_mistakes", { count: triageMistakes(loadRecords(), selectedMistakeTopic).length });
    // 先讓 KaTeX 有機會把還沒排版的式子排完，再叫列印。
    // 少了這個延遲，印出來會有一半是原始的 LaTeX 字串。
    typesetMath(app);
    window.setTimeout(() => {
      try {
        window.print();
      } catch (_error) {
        showAppNotice("這個瀏覽器擋住了列印。可以用瀏覽器選單裡的「列印」。");
      }
    }, 200);
  }

  // 專注模式
  //
  // 連勝、盾牌、成就對「還沒建立習慣的人」是有效的，對「考前兩週的研究所考生」
  // 是噪音 —— 而後者才是會付錢的那群人。所以不是拿掉，是分層。
  //
  // 關掉只影響**顯示**：連勝照算、成就照解鎖，只是不擺在眼前。
  // 這樣使用者隨時可以打開來看，資料也不會因為換過設定就對不起來。
  function focusModeOn() {
    try {
      return (loadRecords().settings || {}).focusMode === "on";
    } catch (_error) {
      return false;
    }
  }

  function setFocusMode(enabled) {
    const records = loadRecords();
    records.settings = records.settings || {};
    records.settings.focusMode = enabled ? "on" : "off";
    saveRecords(records);
    render();
  }

  function renderDisplayControls() {
    const on = focusModeOn();
    return `
      <div class="privacy-controls">
        <p class="section-label">介面</p>
        <div class="privacy-row">
          <div>
            <strong>專注模式<span class="privacy-state ${on ? "is-on" : "is-off"}">${on ? "開啟中" : "已關閉"}</span></strong>
            <p>收起連勝、盾牌與成就這類元素，只留練習本身。連勝照算，只是不顯示。</p>
          </div>
          <button class="button ${on ? "secondary" : "ghost"}" data-action="toggle-focus-mode">
            ${icon(on ? "x" : "check")}${on ? "關閉專注模式" : "開啟專注模式"}
          </button>
        </div>
        <div class="privacy-row">
          <div>
            <strong>計算紙筆寬</strong>
            <p>用 Apple Pencil 覺得線太粗或太細，在這裡調。橡皮擦不受影響。</p>
          </div>
          <div class="segmented compact pen-scale-row" role="radiogroup" aria-label="筆寬">
            ${PEN_SCALES.map(
              (item) => `
                <button class="tag-button ${((loadRecords().settings || {}).penScale || "standard") === item.key ? "is-active" : ""}"
                  data-action="set-pen-scale" data-scale="${item.key}">${item.label}</button>`
            ).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderPrivacyControls() {
    const on = analyticsEnabled();
    return `
      <div class="privacy-controls">
        <p class="section-label">隱私</p>
        <div class="privacy-row">
          <div>
            <strong>使用分析<span class="privacy-state ${on ? "is-on" : "is-off"}">${on ? "開啟中" : "已關閉"}</span></strong>
            <p>只送「哪個功能被用了幾次」這種計數。<strong>不會</strong>送你的作答內容、答案或題目。</p>
          </div>
          <!-- 狀態寫在標題旁邊，按鈕只寫「按下去會發生什麼」。
               「已開啟 · 關閉」把狀態和動作塞進同一顆按鈕，
               使用者得先解析一次才敢按。 -->
          <button class="button ${on ? "secondary" : "ghost"}" data-action="toggle-analytics">
            ${icon(on ? "x" : "activity")}${on ? "關閉分析" : "重新開啟"}
          </button>
        </div>
        <p class="privacy-links">
          <a href="about.html" target="_blank" rel="noopener">關於</a>
          <span aria-hidden="true">·</span>
          <a href="changelog.html" target="_blank" rel="noopener">更新紀錄</a>
          <span aria-hidden="true">·</span>
          <a href="privacy.html" target="_blank" rel="noopener">隱私政策</a>
          <span aria-hidden="true">·</span>
          <a href="terms.html" target="_blank" rel="noopener">服務條款</a>
          <span aria-hidden="true">·</span>
          <a href="tutor.html" target="_blank" rel="noopener">給家教與助教</a>
          <span aria-hidden="true">·</span>
          <span class="settings-version">${APP_VERSION} · ${BUILD_DATE}</span>
        </p>
      </div>
    `;
  }

  // 校準包的說明必須寫在按鈕旁邊，而不是藏在條款裡。
  // 使用者要能在按下去之前就知道「這份檔案裡有什麼、沒有什麼」。
  function renderCalibrationOptIn() {
    const records = loadRecords();
    const answered = Object.keys(records.problemStats || {}).length;
    if (answered < 20) return "";
    return `
      <div class="calibration-optin">
        <p class="section-label">幫忙校準難度（選填）</p>
        <p>
          目前的難度是作者估的，實測下來偏硬。你可以匯出一份作答統計幫忙修正。
        </p>
        <p class="calibration-contents">
          檔案裡只有 <strong>題號、難度、對錯次數、中位秒數</strong>，
          以及你的整體程度分層（高／中／低）。
          <strong>沒有</strong>題目內容、作答內容、時間戳記，也沒有任何可以認出你的東西。
          自訂題一律不匯出。
        </p>
        <div class="stack-actions">
          <button class="button ghost" data-action="preview-calibration">${icon("eye")}先看內容</button>
          <button class="button ghost" data-action="export-calibration">${icon("download")}匯出校準包（${answered} 題）</button>
        </div>
      </div>
    `;
  }

  function renderSettings() {
    const records = loadRecords();
    const week = weeklyMissionInfo(records);
    const goal = dailyGoal(records);
    return `
      <main class="screen">
        <section class="panel page-panel settings-page">
          <div class="page-head">
            <div>
              <p class="section-label">設定</p>
              <h2>資料與設定</h2>
              <p>所有紀錄都存在本機瀏覽器。換裝置前請先匯出 JSON。</p>
            </div>
            <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
          </div>
          <div class="settings-grid">
            <section class="study-card">
              <div class="panel-title-row">
                <div>
                  <p class="section-label">目標</p>
                  <h3>每日 ${goal} 題</h3>
                </div>
                <span class="study-count">${week.completed}/${week.target}</span>
              </div>
              <div class="goal-options">
                ${[5, 10, 12, 20].map((value) => `<button class="tag-button ${goal === value ? "is-active" : ""}" data-action="set-daily-goal" data-goal="${value}">${value} 題</button>`).join("")}
              </div>
              <div class="meter-track"><div class="meter-fill" style="width:${week.progress}%"></div></div>
              <p class="panel-note">本週已完成 ${week.completed} 題，${week.daysDone} 天有練。</p>
            </section>
            ${renderPlacementSettingsCard(records)}
            ${renderSyncSettingsCard()}
            ${renderIosInstallCard()}
            ${renderDataManagementCard(records)}
          </div>
        </section>
      </main>
    `;
  }

  function renderPlacementSettingsCard(records) {
    const placement = records.placement;
    const summary = placement
      ? `目前定位 R${placement.rank}${placement.weakTag ? ` · 最不穩：${tagLabel(placement.weakTag)}` : ""}`
      : "還沒做過定位測驗";
    const note = placement
      ? `上次定位：${String(placement.date || "").slice(0, 10) || "—"}。重新定位會覆蓋結果，並依表現重新解鎖主線。`
      : "8 題調適測驗，約 5 分鐘。做完會依表現解鎖主線起點。";
    return `
      <section class="study-card placement-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">定位</p>
            <h3>${escapeHtml(summary)}</h3>
          </div>
        </div>
        <p class="panel-note">${escapeHtml(note)}</p>
        <div class="action-row">
          <button class="button secondary" data-action="start-placement">${icon("target")}${placement ? "重新定位" : "開始定位測驗"}</button>
        </div>
      </section>
    `;
  }

  function renderPackOptions() {
    const used = new Set();
    const groups = PACK_GROUPS.map((group) => {
      const options = group.keys
        .filter((key) => TRAINING_PACKS[key])
        .map((key) => {
          used.add(key);
          const pack = TRAINING_PACKS[key];
          return `<option value="${escapeAttr(key)}" ${selectedPack === key ? "selected" : ""}>${escapeHtml(pack.label)} (${packTotalCountText(key)})</option>`;
        })
        .join("");
      return options ? `<optgroup label="${escapeAttr(group.label)}">${options}</optgroup>` : "";
    }).join("");
    const rest = Object.keys(TRAINING_PACKS)
      .filter((key) => !used.has(key))
      .map((key) => {
        const pack = TRAINING_PACKS[key];
        return `<option value="${escapeAttr(key)}" ${selectedPack === key ? "selected" : ""}>${escapeHtml(pack.label)} (${packTotalCountText(key)})</option>`;
      })
      .join("");
    return groups + (rest ? `<optgroup label="其他">${rest}</optgroup>` : "");
  }

  function renderLibraryBoard(records) {
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const weakLabel = topWeaknesses(records)[0]?.label || "綜合";
    const techCount = difficultyScopedCount(6, "all", "technique_recognition");
    const bossCount = difficultyScopedCount(6, "all", "boss_challenge");
    return `
      <p class="section-label">任務板</p>
      <div class="library-board">
        <button class="board-card" data-action="train-pack" data-pack="technique_recognition">
          <span class="board-tag">今日推薦</span>
          <strong>先練判型</strong>
          <small>技巧辨識 · ${techCount} 題</small>
        </button>
        <button class="board-card is-weak" data-action="start-weakness" ${mistakeCount ? "" : "disabled"}>
          <span class="board-tag">弱點包</span>
          <strong>${mistakeCount ? "清弱點" : "尚無錯題"}</strong>
          <small>${escapeHtml(weakLabel)} · ${mistakeCount} 題</small>
        </button>
        <button class="board-card is-boss" data-action="train-pack" data-pack="boss_challenge">
          <span class="board-tag">Boss 前置</span>
          <strong>強人題熱身</strong>
          <small>R5–6 · ${bossCount} 題</small>
        </button>
      </div>
    `;
  }

  function renderProblemLibrary() {
    const records = loadRecords();
    const allItems = libraryProblems(records);
    const shown = allItems.slice(0, libraryVisibleCount);
    return `
      <main class="screen">
        <section class="panel page-panel problem-library">
          <div class="page-head">
            <div>
              <p class="section-label">題庫</p>
              <h2>題庫瀏覽</h2>
              <p>搜尋題目、收藏常練題，或把可疑題目先標記回報。</p>
            </div>
            <div class="action-row">
              <button class="button ghost" data-action="home">${icon("home")}回首頁</button>
              <button class="button secondary" data-action="open-creator">${icon("file-pen-line")}我要出題</button>
              <button class="button" data-action="start-library-filter" ${allItems.length ? "" : "disabled"}>${icon("shuffle")}練目前篩選</button>
            </div>
          </div>

          ${renderLibraryBoard(records)}

          <p class="section-label library-filter-label">自己挑</p>
          <div class="library-toolbar">
            <label class="library-search">
              <span>搜尋</span>
              <input data-library-search type="search" value="${escapeAttr(librarySearch)}" placeholder="Taylor、IBP、Frullani、題號..." />
            </label>
            <label>
              <span>題包</span>
              <select data-library-pack-select>
                ${renderLibraryPackOptions()}
              </select>
            </label>
            <label>
              <span>難度</span>
              <select data-library-rank-select>
                ${["all", "1", "2", "3", "4", "5", "6"].map((rank) => `<option value="${rank}" ${selectedLibraryRank === rank ? "selected" : ""}>${rank === "all" ? "全部" : `R${rank}`}</option>`).join("")}
              </select>
            </label>
          </div>

          <div class="segmented compact library-tabs" role="group" aria-label="題庫題型篩選">
            ${Object.entries(TOPICS)
              .map(([key, topic]) => `<button class="segment ${selectedLibraryTopic === key ? "is-active" : ""}" aria-pressed="${selectedLibraryTopic === key ? "true" : "false"}" data-library-topic="${key}">${topic.label}</button>`)
              .join("")}
          </div>

          <div class="segmented compact library-tabs" role="group" aria-label="題庫狀態篩選">
            ${[
              ["all", "全部"],
              ["favorites", `收藏 ${Object.keys(records.favorites || {}).length}`],
              ["boss", "Boss"],
              ["reported", `已回報 ${Object.keys(records.problemReports || {}).length}`]
            ].map(([key, label]) => `<button class="segment ${selectedLibraryFilter === key ? "is-active" : ""}" aria-pressed="${selectedLibraryFilter === key ? "true" : "false"}" data-library-filter="${key}">${escapeHtml(label)}</button>`).join("")}
          </div>

          <div class="library-count">
            <strong>${allItems.length}</strong>
            <span>符合條件${allItems.length > shown.length ? `，先顯示 ${shown.length} 題` : ""}</span>
          </div>

          <div class="problem-library-grid">
            ${shown.length ? shown.map((problem) => renderLibraryProblemCard(problem, records)).join("") : `<div class="empty-state">沒有符合條件的題目。</div>`}
          </div>

          ${
            allItems.length > shown.length
              ? `<div class="library-more"><button class="button secondary" data-action="library-show-more">顯示更多（還有 ${allItems.length - shown.length} 題）</button></div>`
              : ""
          }
        </section>
      </main>
    `;
  }

  function resetLibraryPaging() {
    libraryVisibleCount = LIBRARY_PAGE_SIZE;
  }

  function renderLibraryPackOptions() {
    const selected = selectedLibraryPack || "all";
    const oldSelected = selectedPack;
    selectedPack = selected;
    const markup = renderPackOptions();
    selectedPack = oldSelected;
    return markup;
  }

  // 單題分享連結。純前端：#p=<題號>，打開直接進練習模式。
  // 限制講清楚：靜態站做不出「每題自己的預覽卡」（那要 1,723 張 OG 頁），
  // 貼到聊天軟體只會有站台級的預覽 —— 但點開直接是那一題，這才是重點。
  function copyProblemLink(problemId) {
    const problem = problemById(problemId);
    if (!problem) return;
    const url = window.location.origin + window.location.pathname + "#p=" + encodeURIComponent(problemId);
    const done = () => showAppNotice("連結已複製。傳給同學，點開直接作答這一題。");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, () => showAppNotice(url));
    } else {
      showAppNotice(url);
    }
  }

  function renderLibraryProblemCard(problem, records) {
    const favorite = Boolean(records.favorites?.[problem.id]);
    const reported = Boolean(records.problemReports?.[problem.id]);
    const quality = solutionQuality(problem);
    return `
      <article class="library-problem-card">
        <div class="library-problem-top">
          <div>
            <strong>${escapeHtml(problem.id || "problem")}</strong>
            <span>${TOPICS[problem.topic]?.label || problem.topic} · ${difficultyBadge(problem)}</span>
          </div>
          <div class="problem-card-actions">
            <button class="icon-button ${favorite ? "is-active" : ""}" data-action="toggle-favorite" data-problem-id="${escapeAttr(problem.id)}" title="${favorite ? "取消收藏" : "收藏題目"}">${icon("star")}</button>
            <button class="icon-button ${reported ? "is-active" : ""}" data-action="report-problem" data-problem-id="${escapeAttr(problem.id)}" title="${reported ? "已回報" : "回報題目"}">${icon("flag")}</button>
            <button class="icon-button" data-action="copy-problem-link" data-problem-id="${escapeAttr(problem.id)}" title="複製這題的連結">${icon("copy")}</button>
          </div>
        </div>
        <div class="library-prompt math-block" data-tex="${escapeAttr(problem.prompt)}"></div>
        ${renderProblemGraph(problem)}
        <div class="library-tags">
          ${problemDisplayTags(problem).slice(0, 5).map((tag) => `<span>${escapeHtml(tagLabel(tag))}</span>`).join("")}
        </div>
        <div class="library-problem-foot">
          <span class="solution-quality is-${quality.level}">${escapeHtml(quality.label)}</span>
          ${verifiedChip(problem)}
          ${rubricChip(problem)}
          ${sourceChip(problem)}
          ${problemShortCode(problem) ? `<span class="chip problem-uid" title="永久題號，回報或分享時用這個">${escapeHtml(problemShortCode(problem))}</span>` : ""}
          <button class="button ghost" data-action="start-problem" data-problem-id="${escapeAttr(problem.id)}">${icon("play")}練這題</button>
        </div>
      </article>
    `;
  }

  // ── 出題工作坊 ──────────────────────────────────────────────
  // 自訂題存本機（BUZZ_CUSTOM / localStorage）。儲存前必須通過與作答
  // 同一套 checkAnswer 自我判分，擋掉判分器讀不懂的答案。
  // 分享走 #pack=<base64url> 連結，純前端、無伺服器。

  function defaultCreatorDraft() {
    return {
      topic: "limits",
      difficulty: "2",
      answerKind: "numeric",
      variable: "x",
      prompt: "",
      answer: "",
      solution: "",
      timeLimit: "45"
    };
  }

  function activeCreatorDraft() {
    if (!creatorDraft) creatorDraft = defaultCreatorDraft();
    return creatorDraft;
  }

  function customProblemStore() {
    return CUSTOM ? CUSTOM.load() : [];
  }

  function persistCustomProblems(list) {
    if (!CUSTOM) return;
    CUSTOM.save(list);
    syncCustomProblemPool(list);
  }

  // 把 in-memory 題庫裡的自訂題換成最新狀態（題庫/抽題都吃同一個陣列）。
  function syncCustomProblemPool(list) {
    for (let index = problems.length - 1; index >= 0; index -= 1) {
      if (problems[index].custom) problems.splice(index, 1);
    }
    const knownIds = new Set(problems.map((problem) => problem.id));
    list.forEach((raw) => {
      if (raw.enabled === false) return;
      const problem = CUSTOM.sanitize(raw);
      if (!problem || knownIds.has(problem.id)) return;
      if (window.BUZZ_DIFFICULTY) window.BUZZ_DIFFICULTY.applyCalibration(problem);
      knownIds.add(problem.id);
      problems.push(problem);
    });
  }

  function renderCreator() {
    const mine = customProblemStore();
    const enabledCount = problems.filter((problem) => problem.custom).length;
    return `
      <main class="screen">
        <section class="panel page-panel creator-page">
          <div class="page-head">
            <div>
              <p class="section-label">出題工作坊</p>
              <h2>自己出題，練給自己或分享給朋友</h2>
              <p>題目存在這台裝置的瀏覽器裡；分享連結把題目編進網址本身，不經過任何伺服器。</p>
            </div>
            <div class="action-row">
              <button class="button ghost" data-action="home">${icon("home")}回首頁</button>
              <button class="button" data-action="start-custom-practice" ${enabledCount ? "" : "disabled"}>${icon("play")}練自訂題（${enabledCount}）</button>
            </div>
          </div>
          ${creatorStatus ? `<div class="creator-status is-${creatorStatus.tone}">${escapeHtml(creatorStatus.text)}</div>` : ""}
          ${creatorImportPreview ? renderCreatorImportPreview() : ""}
          <div class="creator-grid">
            ${renderCreatorForm()}
            ${renderCreatorSharePanel(mine)}
          </div>
          ${renderCreatorList(mine)}
        </section>
      </main>
    `;
  }

  function renderCreatorForm() {
    const draft = activeCreatorDraft();
    const needsVariable = draft.answerKind === "expression" || draft.answerKind === "antiderivative";
    const answerHelp = {
      numeric: "數值答案，可用 1/2、pi/4、sqrt(2)、log(2) 這類寫法。",
      expression: "寫成變數的函數，例如 2*x*cos(x^2)。系統會多點代入判分。",
      antiderivative: "原函數，可省略 +C，例如 x*log(x)-x。判分時檢查是否只差常數。",
      text: "判定型答案，用逗號列出所有可接受的寫法，例如：收斂, converges。"
    }[draft.answerKind];
    const difficultyLabels = { 1: "R1 暖身", 2: "R2 基礎", 3: "R3 標準", 4: "R4 進階" };
    return `
      <section class="study-card creator-form">
        <div class="panel-title-row">
          <div>
            <p class="section-label">${creatorEditingId ? "編輯題目" : "新題目"}</p>
            <h3>${creatorEditingId ? escapeHtml(creatorEditingId) : "先驗證，才進題庫"}</h3>
          </div>
          ${creatorEditingId ? `<button class="button ghost" data-action="creator-new">${icon("x")}取消編輯</button>` : ""}
        </div>
        <div class="creator-fields">
          <label>
            <span>主題</span>
            <select data-creator-field="topic">
              ${Object.entries(TOPICS)
                .filter(([key]) => key !== "all")
                .map(([key, topic]) => `<option value="${key}" ${draft.topic === key ? "selected" : ""}>${topic.label}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            <span>難度</span>
            <select data-creator-field="difficulty">
              ${[1, 2, 3, 4].map((level) => `<option value="${level}" ${String(draft.difficulty) === String(level) ? "selected" : ""}>${difficultyLabels[level]}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>作答型態</span>
            <select data-creator-field="answerKind">
              ${["numeric", "expression", "antiderivative", "text"].map((kind) => `<option value="${kind}" ${draft.answerKind === kind ? "selected" : ""}>${answerKindLabel(kind)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>時限（秒）</span>
            <input type="number" min="10" max="600" data-creator-field="timeLimit" value="${escapeAttr(draft.timeLimit)}" />
          </label>
          ${
            needsVariable
              ? `<label><span>變數</span><input maxlength="1" data-creator-field="variable" value="${escapeAttr(draft.variable)}" placeholder="x" /></label>`
              : ""
          }
          <label class="creator-wide">
            <span>題目（LaTeX，不用寫 $）</span>
            <textarea data-creator-field="prompt" rows="3" placeholder="\\lim_{x \\to 0}\\frac{\\sin x}{x}">${escapeHtml(draft.prompt)}</textarea>
          </label>
          <div class="creator-preview creator-wide">
            <span>預覽</span>
            <div class="math-block" data-creator-preview data-tex="${escapeAttr(draft.prompt)}"></div>
          </div>
          <label class="creator-wide">
            <span>答案</span>
            <input data-creator-field="answer" value="${escapeAttr(draft.answer)}" placeholder="${draft.answerKind === "text" ? "收斂, converges" : "例如 1/2 或 pi/4"}" />
          </label>
          <p class="panel-note creator-wide">${escapeHtml(answerHelp)}</p>
          <label class="creator-wide">
            <span>解說（答錯的人會看到，建議寫）</span>
            <textarea data-creator-field="solution" rows="2" placeholder="為什麼答案是這個？一兩句就好。">${escapeHtml(draft.solution)}</textarea>
          </label>
        </div>
        <div class="action-row">
          <button class="button" data-action="creator-save">${icon("check")}驗證並${creatorEditingId ? "更新" : "加入"}</button>
        </div>
        <p class="panel-note">儲存前系統會確認：LaTeX 讀得懂，而且判分器能把你的參考答案判成「正確」。</p>
      </section>
    `;
  }

  function renderCreatorSharePanel(mine) {
    const shareable = mine.filter((item) => item.enabled !== false);
    return `
      <section class="study-card creator-share">
        <div class="panel-title-row">
          <div>
            <p class="section-label">分享 / 匯入</p>
            <h3>用連結交換題包</h3>
          </div>
        </div>
        <p class="panel-note">分享連結會帶目前啟用中的 ${shareable.length} 題。朋友打開連結就會看到匯入預覽，確認後才進他的題庫。</p>
        <div class="action-row">
          <button class="button secondary" data-action="creator-copy-link" ${shareable.length ? "" : "disabled"}>${icon("upload")}複製分享連結</button>
          <button class="button ghost" data-action="creator-copy-code" ${shareable.length ? "" : "disabled"}>複製題包代碼</button>
        </div>
        <label class="creator-import-label">
          <span>匯入：貼上朋友的分享連結或 BZP1. 代碼</span>
          <textarea data-creator-import-input rows="2" placeholder="BZP1.… 或 https://…#pack=BZP1.…"></textarea>
        </label>
        <div class="action-row">
          <button class="button secondary" data-action="creator-import-decode">${icon("download")}解析題包</button>
        </div>
      </section>
    `;
  }

  function renderCreatorImportPreview() {
    const preview = creatorImportPreview;
    if (preview.error) {
      return `
        <section class="study-card creator-import-preview">
          <p class="section-label">匯入題包</p>
          <p class="panel-note">${escapeHtml(preview.error)}</p>
          <div class="action-row"><button class="button ghost" data-action="creator-import-dismiss">${icon("x")}關閉</button></div>
        </section>
      `;
    }
    const mineIds = new Set(customProblemStore().map((item) => item.id));
    const fresh = preview.problems.filter((problem) => !mineIds.has(problem.id));
    return `
      <section class="study-card creator-import-preview">
        <div class="panel-title-row">
          <div>
            <p class="section-label">匯入題包</p>
            <h3>收到 ${preview.problems.length} 題${preview.dropped ? `（另有 ${preview.dropped} 題格式不合，已略過）` : ""}</h3>
          </div>
        </div>
        <div class="creator-import-list">
          ${preview.problems
            .slice(0, 6)
            .map(
              (problem) => `
                <div class="creator-import-item ${mineIds.has(problem.id) ? "is-dupe" : ""}">
                  <div class="math-block" data-tex="${escapeAttr(problem.prompt)}"></div>
                  <small>${TOPICS[problem.topic]?.label || problem.topic} · ${answerKindLabel(problem.answerKind)} · R${problem.difficulty}${mineIds.has(problem.id) ? " · 已有同一題，會略過" : ""}</small>
                </div>`
            )
            .join("")}
          ${preview.problems.length > 6 ? `<p class="panel-note">…還有 ${preview.problems.length - 6} 題。</p>` : ""}
        </div>
        <div class="action-row">
          <button class="button" data-action="creator-import-confirm" ${fresh.length ? "" : "disabled"}>${icon("check")}匯入 ${fresh.length} 題</button>
          <button class="button ghost" data-action="creator-import-dismiss">${icon("x")}取消</button>
        </div>
      </section>
    `;
  }

  function renderCreatorList(mine) {
    if (!mine.length) {
      return `<div class="empty-state">還沒有自訂題。出一題試試，或請朋友傳分享連結給你。</div>`;
    }
    return `
      <p class="section-label">我的題目（${mine.length}）</p>
      <div class="creator-list">
        ${mine
          .map((raw) => {
            const enabled = raw.enabled !== false;
            return `
              <article class="creator-item ${enabled ? "" : "is-disabled"}">
                <div class="creator-item-top">
                  <div>
                    <strong>${escapeHtml(raw.id || "")}</strong>
                    <span>${TOPICS[raw.topic]?.label || raw.topic} · ${answerKindLabel(raw.answerKind) || raw.answerKind} · R${escapeHtml(String(raw.difficulty || ""))}${enabled ? "" : " · 已停用"}</span>
                  </div>
                  <div class="problem-card-actions">
                    <button class="icon-button ${enabled ? "is-active" : ""}" data-action="creator-toggle" data-problem-id="${escapeAttr(raw.id)}" title="${enabled ? "停用（不再抽進練習）" : "重新啟用"}">${icon(enabled ? "check" : "x")}</button>
                    <button class="icon-button" data-action="creator-edit" data-problem-id="${escapeAttr(raw.id)}" title="編輯">${icon("file-pen-line")}</button>
                    <button class="icon-button" data-action="creator-delete" data-problem-id="${escapeAttr(raw.id)}" title="刪除">${icon("trash")}</button>
                  </div>
                </div>
                <div class="math-block" data-tex="${escapeAttr(raw.prompt || "")}"></div>
                <div class="creator-item-foot">
                  <span>答案：${escapeHtml(raw.answerKind === "text" ? (raw.answers || []).join(" / ") : String(raw.answer || ""))}</span>
                  ${enabled ? `<button class="button ghost" data-action="start-problem" data-problem-id="${escapeAttr(raw.id)}">${icon("play")}練這題</button>` : ""}
                </div>
              </article>`;
          })
          .join("")}
      </div>
    `;
  }

  function updateCreatorPreview() {
    const node = app.querySelector("[data-creator-preview]");
    if (!node) return;
    node.dataset.tex = activeCreatorDraft().prompt || "";
    renderMathNode(node, true);
  }

  function buildCreatorCandidate() {
    const draft = activeCreatorDraft();
    if (!CUSTOM) return null;
    return CUSTOM.sanitize({
      id: creatorEditingId || undefined,
      topic: draft.topic,
      difficulty: draft.difficulty,
      answerKind: draft.answerKind,
      prompt: draft.prompt,
      answer: draft.answer,
      variable: draft.variable,
      solution: draft.solution,
      timeLimit: draft.timeLimit
    });
  }

  // 出題端的「審核」：LaTeX 要能渲染，且判分器必須把作者自己的
  // 參考答案判成正確，否則這題進了題庫也沒人答得對。
  function creatorProblemIssues(problem) {
    const issues = [];
    if (window.katex) {
      try {
        window.katex.renderToString(problem.prompt, { displayMode: true, throwOnError: true, strict: "ignore" });
      } catch (error) {
        issues.push(`LaTeX 讀不懂：${String((error && error.message) || error).slice(0, 120)}`);
      }
    }
    const sample = problem.answerKind === "text" ? problem.answers[0] : problem.answer;
    const graded = checkAnswer(problem, sample);
    if (!graded.correct) {
      issues.push(`判分器吃不下這個答案（${graded.message}）請改用這類寫法，例如 pi/4、2*x、x*log(x)-x。`);
    }
    return issues;
  }

  function saveCreatorDraft() {
    if (!CUSTOM) return;
    const draft = activeCreatorDraft();
    if (!String(draft.prompt || "").trim() || !String(draft.answer || "").trim()) {
      creatorStatus = { tone: "error", text: "題目和答案都要填。" };
      render();
      return;
    }
    const problem = buildCreatorCandidate();
    if (!problem) {
      creatorStatus = { tone: "error", text: "欄位格式不對，請再檢查一次。" };
      render();
      return;
    }
    const issues = creatorProblemIssues(problem);
    if (issues.length) {
      creatorStatus = { tone: "error", text: `還不能儲存：${issues.join(" ")}` };
      render();
      return;
    }
    const list = customProblemStore();
    const now = new Date().toISOString();
    const stored = { ...problem, enabled: true, updatedAt: now, createdAt: now };
    const index = list.findIndex((item) => item.id === problem.id);
    if (index >= 0) {
      stored.createdAt = list[index].createdAt || now;
      stored.enabled = list[index].enabled !== false;
      list[index] = stored;
    } else {
      list.push(stored);
    }
    persistCustomProblems(list);
    trackEvent("custom_problem_saved", { topic: problem.topic, answer_kind: problem.answerKind });
    creatorStatus = { tone: "ok", text: `已通過驗證並${creatorEditingId ? "更新" : "加入"}：${problem.id}。` };
    creatorEditingId = "";
    creatorDraft = defaultCreatorDraft();
    render();
  }

  function editCustomProblem(problemId) {
    const raw = customProblemStore().find((item) => item.id === problemId);
    if (!raw) return;
    creatorEditingId = raw.id;
    creatorDraft = {
      topic: raw.topic,
      difficulty: String(raw.difficulty || 2),
      answerKind: raw.answerKind,
      variable: raw.variable || "x",
      prompt: raw.prompt || "",
      answer: raw.answerKind === "text" ? (raw.answers || []).join(", ") : String(raw.answer || ""),
      solution: raw.solution === "出題者沒有附解說。" ? "" : raw.solution || "",
      timeLimit: String(raw.timeLimit || 45)
    };
    creatorStatus = null;
    view = "creator";
    render();
  }

  function deleteCustomProblem(problemId) {
    const list = customProblemStore();
    if (!list.some((item) => item.id === problemId)) return;
    if (!window.confirm(`刪除 ${problemId}？只會從這台裝置移除。`)) return;
    persistCustomProblems(list.filter((item) => item.id !== problemId));
    if (creatorEditingId === problemId) {
      creatorEditingId = "";
      creatorDraft = defaultCreatorDraft();
    }
    creatorStatus = { tone: "ok", text: `已刪除 ${problemId}。` };
    render();
  }

  function toggleCustomProblem(problemId) {
    const list = customProblemStore();
    const target = list.find((item) => item.id === problemId);
    if (!target) return;
    target.enabled = target.enabled === false;
    persistCustomProblems(list);
    render();
  }

  function customShareCode() {
    if (!CUSTOM) return "";
    const shareable = customProblemStore()
      .filter((item) => item.enabled !== false)
      .map((item) => CUSTOM.sanitize(item))
      .filter(Boolean);
    if (!shareable.length) return "";
    return CUSTOM.encodePack(shareable);
  }

  function copyCreatorShare(asLink) {
    const code = customShareCode();
    if (!code) return;
    const text = asLink
      ? `${window.location.origin}${window.location.pathname}#pack=${code}`
      : code;
    const nav = window.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
      Promise.resolve(nav.clipboard.writeText(text))
        .then(() => showAppNotice(asLink ? "分享連結已複製，貼給朋友就能匯入。" : "題包代碼已複製。"))
        .catch(() => showAppNotice("一鍵複製失敗，請改用「複製題包代碼」後手動複製。"));
      return;
    }
    showAppNotice("這個瀏覽器不支援一鍵複製。");
  }

  function decodeCustomImport() {
    if (!CUSTOM) return;
    const input = app.querySelector("[data-creator-import-input]");
    const raw = input ? input.value : "";
    if (!String(raw).trim()) {
      creatorStatus = { tone: "warn", text: "先貼上分享連結或題包代碼。" };
      render();
      return;
    }
    creatorImportPreview = CUSTOM.decodePack(raw);
    creatorStatus = null;
    render();
  }

  function confirmCustomImport() {
    if (!CUSTOM || !creatorImportPreview || creatorImportPreview.error) return;
    const list = customProblemStore();
    const have = new Set(list.map((item) => item.id));
    const now = new Date().toISOString();
    let added = 0;
    creatorImportPreview.problems.forEach((problem) => {
      if (have.has(problem.id)) return;
      have.add(problem.id);
      list.push({ ...problem, enabled: true, createdAt: now, updatedAt: now, imported: true });
      added += 1;
    });
    persistCustomProblems(list);
    trackEvent("custom_pack_imported", { count: added });
    creatorImportPreview = null;
    creatorStatus = added
      ? { tone: "ok", text: `已匯入 ${added} 題，抽題和題庫搜尋都會出現。` }
      : { tone: "warn", text: "沒有新題目（都已經在你的清單裡）。" };
    render();
  }

  function startCustomPractice() {
    const pool = problems.filter((problem) => problem.custom);
    if (!pool.length) return;
    selectedMode = "practice";
    selectedTopic = "all";
    selectedPack = "all";
    const count = Math.min(12, pool.length);
    startQuiz(shuffle(pool, seedFromString(`custom-${Date.now()}`)).slice(0, count), {
      modeKey: "practice",
      practice: true,
      noTimer: true
    });
  }

  function renderProofLab() {
    const records = loadRecords();
    const stats = proofStats(records);
    const items = proofs.filter((proof) => selectedProofTier === "all" || proof.tier === selectedProofTier);
    return `
      <main class="screen">
        <section class="panel page-panel proof-lab">
          <div class="page-head">
            <div>
              <p class="section-label">證明題</p>
              <h2>證明題庫</h2>
              <p class="proof-subtitle">不限時，不進計分，不機器改。先自己寫，再看參考證明。</p>
            </div>
            <div class="action-row">
              <button class="button secondary" data-action="home">${icon("home")}回主線</button>
            </div>
          </div>

          <div class="proof-overview">
            <div><span>總題數</span><strong>${stats.total}</strong></div>
            <div><span>已看解法</span><strong>${stats.viewed}</strong></div>
            <div><span>看懂</span><strong>${stats.understood}</strong></div>
            <div><span>部分會</span><strong>${stats.partial}</strong></div>
            <div><span>還不會</span><strong>${stats.stuck}</strong></div>
          </div>

          <div class="segmented compact proof-tier-picker" role="group" aria-label="證明題難度篩選">
            ${Object.entries(PROOF_TIERS)
              .map(([key, label]) => {
                const count = key === "all" ? proofs.length : proofs.filter((proof) => proof.tier === key).length;
                return `
                  <button class="segment ${selectedProofTier === key ? "is-active" : ""}" aria-pressed="${selectedProofTier === key ? "true" : "false"}" data-proof-tier="${escapeAttr(key)}">
                    <strong>${escapeHtml(label)}</strong>
                    <span>${count} 題</span>
                  </button>
                `;
              })
              .join("")}
          </div>

          <div class="proof-list">
            ${
              items.length
                ? items.map((proof, index) => renderProofCard(proof, records.proofs[proof.id] || {}, index)).join("")
                : `<div class="empty-state">目前沒有符合篩選的證明題。</div>`
            }
          </div>
        </section>
      </main>
    `;
  }

  function renderProofCard(proof, progress, index) {
    const status = progress.status || "";
    const viewed = Boolean(progress.solutionViewed);
    return `
      <article class="proof-card is-${escapeAttr(proof.tier)} ${status ? `status-${escapeAttr(status)}` : ""}">
        <div class="proof-card-head">
          <div>
            <span class="proof-index">#${index + 1} · ${escapeHtml(PROOF_TIERS[proof.tier] || proof.tier)} · R${proof.difficulty}</span>
            <h3>${escapeHtml(proof.title)}</h3>
          </div>
          <span class="proof-status">${proofStatusLabel(status)}</span>
        </div>

        ${proof.statement ? `<p class="proof-statement">${escapeHtml(proof.statement)}</p>` : ""}
        <div class="proof-prompt math-block" data-tex="${escapeAttr(proof.prompt)}"></div>

        <div class="proof-tags">
          ${(proof.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>

        ${
          proof.leanSkeleton
            ? `<a class="button secondary proof-lean-link" href="https://live.lean-lang.org/#code=${encodeURIComponent(proof.leanSkeleton)}" target="_blank" rel="noopener">${icon("play")}在 Lean Playground 開啟（真・機器判卷）</a>`
            : ""
        }

        <p class="proof-ladder">${proof.tier === "lean" ? "開 Playground 補完 sorry → 編譯零錯誤＝通過 → 卡了開提示 → 最後對參考解答" : "先自己寫 → 卡了開提示 → 還卡開關鍵步驟 → 最後對參考證明"}</p>

        ${
          (proof.hints || []).length
            ? `<details class="proof-step proof-hints" data-proof-step="${escapeAttr(`${proof.id}:hints`)}" ${openProofSteps.has(`${proof.id}:hints`) ? "open" : ""}>
                <summary><span class="proof-step-no">1</span>提示</summary>
                <ul>
                  ${(proof.hints || []).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
                </ul>
              </details>`
            : ""
        }

        ${
          (proof.keySteps || []).length
            ? `<details class="proof-step proof-key-steps" data-proof-step="${escapeAttr(`${proof.id}:keys`)}" ${openProofSteps.has(`${proof.id}:keys`) ? "open" : ""}>
                <summary><span class="proof-step-no">2</span>關鍵步驟</summary>
                <div class="proof-key-steps-body">${(proof.keySteps || []).map((step) => `<span>${escapeHtml(step)}</span>`).join("")}</div>
              </details>`
            : ""
        }

        ${
          viewed
            ? renderProofSolution(proof)
            : `<button class="button secondary proof-solution-button" data-action="view-proof-solution" data-proof-id="${escapeAttr(proof.id)}"><span class="proof-step-no">3</span>${icon("book-open-check")}看參考證明</button>`
        }

        <div class="proof-self-check">
          <span>自評</span>
          <div class="tag-row">
            ${renderProofStatusButton(proof.id, status, "understood", "看懂")}
            ${renderProofStatusButton(proof.id, status, "partial", "部分會")}
            ${renderProofStatusButton(proof.id, status, "stuck", "還不會")}
            ${status ? `<button class="tag-button" data-action="mark-proof-status" data-proof-id="${escapeAttr(proof.id)}" data-proof-status="">清除</button>` : ""}
          </div>
        </div>

        ${
          status === "partial" || status === "stuck"
            ? `<div class="proof-self-check proof-blocker">
                <span>卡在哪</span>
                <div class="tag-row">
                  ${renderProofBlockerButton(proof.id, progress.blocker, "start", "起手式")}
                  ${renderProofBlockerButton(proof.id, progress.blocker, "algebra", "代數整理")}
                  ${renderProofBlockerButton(proof.id, progress.blocker, "theorem", "定理選擇")}
                  ${renderProofBlockerButton(proof.id, progress.blocker, "finish", "收尾")}
                </div>
              </div>`
            : ""
        }
      </article>
    `;
  }

  function renderProofSolution(proof) {
    return `
      <section class="proof-solution">
        <div class="proof-solution-head">
          <strong>參考證明</strong>
          <span>請先自己寫完再對照。</span>
        </div>
        <ol>
          ${(proof.solution || []).map((step) => renderProofSolutionStep(step)).join("")}
        </ol>
      </section>
    `;
  }

  function renderProofSolutionStep(step) {
    if (typeof step === "string") return `<li>${escapeHtml(step)}</li>`;
    const text = step.text ? `<p>${escapeHtml(step.text)}</p>` : "";
    const tex = step.tex ? `<div class="proof-line-math math-block" data-tex="${escapeAttr(step.tex)}"></div>` : "";
    return `<li>${text}${tex}</li>`;
  }

  function renderProofStatusButton(proofId, current, status, label) {
    return `<button class="tag-button ${current === status ? "is-active" : ""}" data-action="mark-proof-status" data-proof-id="${escapeAttr(proofId)}" data-proof-status="${escapeAttr(status)}">${label}</button>`;
  }

  function renderProofBlockerButton(proofId, current, blocker, label) {
    return `<button class="tag-button ${current === blocker ? "is-active" : ""}" data-action="mark-proof-blocker" data-proof-id="${escapeAttr(proofId)}" data-proof-blocker="${escapeAttr(blocker)}">${label}</button>`;
  }

  function proofStatusLabel(status) {
    return {
      understood: "看懂",
      partial: "部分會",
      stuck: "還不會"
    }[status] || "未標記";
  }

  function mistakePressure(item) {
    const wrong = Number(item.wrongCount || 1);
    const problem = item.problem || problemById(item.problemId);
    const rank = problem ? problemRank(problem) : 1;
    const days = item.lastWrongAt ? (Date.now() - new Date(item.lastWrongAt).getTime()) / 86400000 : 30;
    const recency = Math.max(0, 3 - days / 7);
    return wrong * 3 + rank * 0.6 + recency;
  }

  // SRS 排程：舊資料沒有 srs 欄位時視為「現在就到期」，惰性遷移。
  function mistakeSrs(item) {
    const srs = item && item.srs && typeof item.srs === "object" ? item.srs : null;
    const interval = srs && Number.isFinite(Number(srs.interval)) ? Math.max(0, Number(srs.interval)) : 0;
    const dueAt = srs && Number.isFinite(Number(srs.dueAt)) ? Number(srs.dueAt) : 0;
    return { interval, dueAt };
  }

  function mistakeDueStatus(item, now = Date.now()) {
    const srs = mistakeSrs(item);
    if (srs.dueAt <= now) return { due: true, days: 0, label: "今天到期" };
    const days = Math.max(1, Math.ceil((srs.dueAt - now) / DAY_MS));
    if (days <= 7) return { due: false, days, label: `${days} 天後` };
    return { due: false, days, label: "已排程" };
  }

  function srsDueSummary(records) {
    const now = Date.now();
    let due = 0;
    let total = 0;
    let nextDueAt = null;
    Object.values(records.mistakes || {}).forEach((item) => {
      if (!problemById(item.problemId)) return;
      total += 1;
      const srs = mistakeSrs(item);
      if (srs.dueAt <= now) due += 1;
      else if (nextDueAt === null || srs.dueAt < nextDueAt) nextDueAt = srs.dueAt;
    });
    return {
      due,
      total,
      nextDueDays: nextDueAt === null ? null : Math.max(1, Math.ceil((nextDueAt - now) / DAY_MS))
    };
  }

  // 到期預測：今天／明天／七天內各有幾題會到期。
  // 「明天有 6 題要到期」是可以規劃的資訊；「總共 14 題在排程裡」不是。
  function srsForecast(records) {
    const now = Date.now();
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const todayMs = endOfToday.getTime();
    const forecast = { today: 0, tomorrow: 0, week: 0 };
    Object.values(records.mistakes || {}).forEach((item) => {
      if (!problemById(item.problemId)) return;
      const srs = mistakeSrs(item);
      if (srs.dueAt <= todayMs) forecast.today += 1;
      else if (srs.dueAt <= todayMs + DAY_MS) forecast.tomorrow += 1;
      else if (srs.dueAt <= now + 7 * DAY_MS) forecast.week += 1;
    });
    return forecast;
  }

  // 到期優先開一局錯題複習：先排到期題（依 mistakePressure），不足再補快到期的。
  function startSrsReviewQuiz() {
    const records = loadRecords();
    const now = Date.now();
    const items = Object.values(records.mistakes || {})
      .map((item) => ({ ...item, problem: problemById(item.problemId) }))
      .filter((item) => item.problem);
    if (!items.length) return;
    const cap = (MODES.mistakes && MODES.mistakes.count) || 12;
    const due = items
      .filter((item) => mistakeSrs(item).dueAt <= now)
      .sort((a, b) => mistakePressure(b) - mistakePressure(a));
    const upcoming = items
      .filter((item) => mistakeSrs(item).dueAt > now)
      .sort((a, b) => mistakeSrs(a).dueAt - mistakeSrs(b).dueAt);
    const pool = due.concat(upcoming).slice(0, cap).map((item) => item.problem);
    if (!pool.length) return;
    selectedMode = "mistakes";
    startQuiz(pool);
  }

  function triageMistakes(records, topic) {
    return Object.values(records.mistakes || {})
      .map((item) => ({ ...item, problem: problemById(item.problemId) }))
      .filter((item) => item.problem)
      .filter((item) => !topic || topic === "all" || item.problem.topic === topic)
      .sort((a, b) => mistakePressure(b) - mistakePressure(a));
  }

  function topMistakeReason(entries) {
    const counts = {};
    entries.forEach((item) => {
      const reason = item.tag || answerReasonLabel(item.reason) || "其他";
      counts[reason] = (counts[reason] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  }

  function renderMistakes() {
    const records = loadRecords();
    const entries = triageMistakes(records, selectedMistakeTopic);
    const top3 = entries.slice(0, 3);
    const danger = entries.filter((item) => Number(item.wrongCount || 1) >= 3).length;
    const quickWin = entries.filter((item) => Number(item.wrongCount || 1) <= 1).length;
    const topReason = entries.length ? topMistakeReason(entries) : "—";
    const top3Ids = top3.map((item) => item.problem.id);
    return `
      <main class="screen">
        <section class="panel page-panel">
          <div class="page-head">
            <div>
              <p class="section-label">弱點急救室</p>
              <h2>錯題本</h2>
            </div>
            <div class="action-row">
              <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
              <button class="button" data-action="start-mistakes" ${entries.length ? "" : "disabled"}>${icon("refresh")}重練目前篩選</button>
              <button class="button ghost" data-action="print-mistakes" ${entries.length ? "" : "disabled"}>${icon("printer")}列印 / 存 PDF</button>
              <button class="button ghost" data-action="clear-mistakes" ${entries.length ? "" : "disabled"}>${icon("trash")}清除目前篩選</button>
            </div>
          </div>
          ${
            entries.length
              ? `<div class="triage">
                  <div class="triage-today">
                    <div class="triage-head">
                      <div><p class="section-label">今天先清</p><strong>${top3.length} 題優先</strong></div>
                      <button class="button" data-action="start-mistake-triage" data-problem-ids="${escapeAttr(top3Ids.join(","))}">${icon("play")}練這 ${top3.length} 題</button>
                    </div>
                    <ol class="triage-list">
                      ${top3
                        .map((item) => {
                          const w = Number(item.wrongCount || 1);
                          const tier = w >= 3 ? "is-danger" : w <= 1 ? "is-win" : "";
                          return `<li class="${tier}"><span>${TOPICS[item.problem.topic].label} · ${difficultyBadge(item.problem)}</span><small>錯 ${Math.round(w)} 次 · ${escapeHtml(item.tag || answerReasonLabel(item.reason) || "錯誤")}</small></li>`;
                        })
                        .join("")}
                    </ol>
                  </div>
                  <div class="triage-stats">
                    <div class="triage-stat is-danger"><strong>${danger}</strong><span>危險題 · 連錯多次</span></div>
                    <div class="triage-stat is-win"><strong>${quickWin}</strong><span>快清掉</span></div>
                    <div class="triage-stat"><strong>${escapeHtml(topReason)}</strong><span>最常錯因</span></div>
                  </div>
                </div>`
              : ""
          }
          ${entries.length ? renderWeaknessPanel(records) : ""}
          ${renderMasteryRadar(records)}
          <div class="segmented compact" role="group" aria-label="錯題題型篩選">
            ${Object.entries(TOPICS)
              .map(
                ([key, topic]) => `
                  <button class="segment ${selectedMistakeTopic === key ? "is-active" : ""}" aria-pressed="${selectedMistakeTopic === key ? "true" : "false"}" data-mistake-topic="${key}">
                    <strong>${topic.label}</strong>
                    <span>${mistakeTopicCount(records, key)} 題</span>
                  </button>`
              )
              .join("")}
          </div>
          <div class="review-list">
            ${
              entries.length
                ? entries.map((item) => renderMistakeItem(item, records)).join("")
                : `<div class="empty-state">目前沒有符合篩選的錯題。</div>`
            }
          </div>
        </section>
      </main>
    `;
  }

  function renderMistakeItem(item, records) {
    const problem = item.problem;
    const w = Number(item.wrongCount || 1);
    const tier = w >= 3 ? "is-danger" : w <= 1 ? "is-win" : "";
    const tierLabel = w >= 3 ? "危險" : w <= 1 ? "快清掉" : "";
    const dueStatus = mistakeDueStatus(item);
    return `
      <article class="review-item is-wrong ${tier}">
        <div class="review-top">
          <span>${TOPICS[problem.topic].label} · ${difficultyBadge(problem)} · 錯 ${Math.round(w)} 次${tierLabel ? ` <span class="tier-chip">${tierLabel}</span>` : ""} <span class="srs-chip ${dueStatus.due ? "is-due" : "is-scheduled"}">${escapeHtml(dueStatus.label)}</span></span>
          <strong>${escapeHtml(item.tag || answerReasonLabel(item.reason) || "錯誤")}</strong>
        </div>
        <div class="review-prompt math-block" data-tex="${escapeAttr(problem.prompt)}"></div>
        ${renderProblemGraph(problem)}
        <div class="review-answer">
          最近答案：${escapeHtml(item.lastInput || "未作答")}<br />
          參考答案：${escapeHtml(displayAnswer(problem))}<br />
          標註：${escapeHtml(item.tag || "未標註")}
        </div>
        <div class="tag-row">
          ${ERROR_TAGS.map((tag) => `<button class="tag-button ${item.tag === tag ? "is-active" : ""}" data-action="tag-mistake" data-problem-id="${escapeAttr(problem.id)}" data-tag="${escapeAttr(tag)}">${tag}</button>`).join("")}
        </div>
        <div class="action-row">
          <button class="button secondary" data-action="start-mistake-one" data-problem-id="${escapeAttr(problem.id)}">${icon("play")}重練這題</button>
          <button class="button secondary" data-action="practice-similar" data-problem-id="${escapeAttr(problem.id)}">${icon("shuffle")}練同型</button>
          <button class="button ghost" data-action="toggle-favorite" data-problem-id="${escapeAttr(problem.id)}">${icon("star")}${records.favorites?.[problem.id] ? "已收藏" : "收藏"}</button>
          <button class="button ghost" data-action="report-problem" data-problem-id="${escapeAttr(problem.id)}">${icon("flag")}${records.problemReports?.[problem.id] ? "已回報" : "回報"}</button>
          <button class="button ghost" data-action="clear-mistake-one" data-problem-id="${escapeAttr(problem.id)}">${icon("trash")}移除</button>
        </div>
      </article>
    `;
  }

  function renderWeaknessPanel(records) {
    const analysis = buildWeaknessAnalysis(records);
    const hasData = analysis.tags.length || analysis.topics.length || analysis.errorTags.length;
    if (!hasData) {
      return `<div class="weakness-panel"><strong>弱點分析</strong><p class="panel-note">錯題累積後，這裡會顯示最常錯的題型、技巧 tags 和錯因。</p></div>`;
    }
    return `
      <div class="weakness-panel">
        <div class="weakness-head">
          <div>
            <strong>弱點分析</strong>
            <span>依錯題本統計，點擊 tag 可直接練習。</span>
          </div>
        </div>
        <div class="weakness-grid">
          <div>
            <h3>題型</h3>
            ${analysis.topics.map((item) => renderWeaknessBar(item.label, item.count, item.max)).join("") || `<p class="panel-note">尚無資料</p>`}
          </div>
          <div>
            <h3>技巧 tags</h3>
            <div class="weakness-tags">
              ${analysis.tags.map((item) => `<button class="tag-button" data-action="train-tag" data-tag="${escapeAttr(item.key)}">${escapeHtml(item.label)} · ${item.count}</button>`).join("") || `<p class="panel-note">尚無資料</p>`}
            </div>
          </div>
          <div>
            <h3>錯因</h3>
            ${analysis.errorTags.map((item) => renderWeaknessBar(item.label, item.count, item.max)).join("") || `<p class="panel-note">尚無標註</p>`}
          </div>
        </div>
      </div>
    `;
  }

  function renderWeaknessBar(label, count, max) {
    const pct = max ? Math.max(8, Math.round((count / max) * 100)) : 0;
    return `
      <div class="weakness-row">
        <span>${escapeHtml(label)}</span>
        <div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div>
        <strong>${count}</strong>
      </div>
    `;
  }

  function renderHistory() {
    const records = loadRecords();
    const history = (records.history || [])
      .filter((item) => selectedHistoryTopic === "all" || item.topic === selectedHistoryTopic || item.topics?.includes(selectedHistoryTopic));
    return `
      <main class="screen">
        <section class="panel page-panel">
          <div class="page-head">
            <div>
              <p class="section-label">Records</p>
              <h2>作答歷史</h2>
            </div>
            <div class="action-row">
              <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
              <button class="button ghost" data-action="clear-history" ${history.length ? "" : "disabled"}>${icon("trash")}清除歷史</button>
            </div>
          </div>
          ${renderActivityHeatmap(records)}
          <div class="segmented compact" role="group" aria-label="歷史題型篩選">
            ${Object.entries(TOPICS)
              .map(
                ([key, topic]) => `
                  <button class="segment ${selectedHistoryTopic === key ? "is-active" : ""}" aria-pressed="${selectedHistoryTopic === key ? "true" : "false"}" data-history-topic="${key}">
                    <strong>${topic.label}</strong>
                    <span>${historyTopicCount(records, key)} 局</span>
                  </button>`
              )
              .join("")}
          </div>
          <div class="history-list">
            ${
              history.length
                ? history.map(renderHistoryItem).join("")
                : `<div class="empty-state">尚無作答歷史。</div>`
            }
          </div>
        </section>
      </main>
    `;
  }

  function renderHistoryItem(item) {
    return `
      <article class="history-item">
        <div class="history-main">
          <div>
            <strong>${escapeHtml(item.modeLabel || item.mode || "Quiz")}</strong>
            <span>${formatDateTime(item.finishedAt)} · ${answerModeLabel(item.answerMode || "free")} · ${item.practice ? "練習" : "計分"}</span>
          </div>
          <div class="history-metrics">
            <span>${item.score} 分</span>
            <span>${item.correct}/${item.total}</span>
            <span>${item.accuracy}%</span>
            <span>${item.avgTime}s</span>
          </div>
        </div>
        ${renderHistoryReview(item)}
      </article>
    `;
  }

  function renderHistoryReview(item) {
    const answers = Array.isArray(item.answers) ? item.answers : [];
    if (!answers.length) return "";
    return `
      <details class="history-detail" data-history-detail>
        <summary>題目回顧</summary>
        <div class="history-review-list">
          ${answers
            .map((answer, index) => {
              const problem = problemById(answer.problemId);
              if (!problem) return "";
              return `
                <div class="history-review-item ${answer.correct ? "is-correct" : "is-wrong"}">
                  <strong>#${index + 1} · ${TOPICS[problem.topic].label} · ${answer.unanswered ? "未作答" : `${answer.elapsed}s`}</strong>
                  <div class="review-prompt math-block-lazy" data-tex="${escapeAttr(problem.prompt)}"></div>
                  <span>你的答案：${escapeHtml(answer.input || "未作答")} · ${answer.correct ? "正確" : answerReasonLabel(answer.reason)}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </details>
    `;
  }

  // ---- 圖形題：problem.graph -> inline SVG（座標軸 + 格線 + 折線/函數曲線） ----
  function graphCurveFn(expr) {
    const cleaned = String(expr || "");
    if (!/^[0-9x+\-*/().,^\sa-z]*$/i.test(cleaned)) return null;
    try {
      const body = `"use strict"; const {sin,cos,tan,asin,acos,atan,log,exp,sqrt,abs,pow,sinh,cosh,tanh,PI,E}=Math; return (${cleaned.replace(/\^/g, "**")});`;
      const fn = new Function("x", body);
      const probe = fn(1);
      if (!Number.isFinite(probe) && !Number.isNaN(probe)) return null;
      return fn;
    } catch (error) {
      return null;
    }
  }

  function renderProblemGraph(problem) {
    const graph = problem && problem.graph;
    if (!graph || !Array.isArray(graph.window) || graph.window.length !== 4) return "";
    const [xmin, xmax, ymin, ymax] = graph.window.map(Number);
    if (!(xmax > xmin) || !(ymax > ymin)) return "";
    const width = 320;
    const height = 220;
    const pad = 18;
    const sx = (x) => pad + ((x - xmin) / (xmax - xmin)) * (width - 2 * pad);
    const sy = (y) => height - pad - ((y - ymin) / (ymax - ymin)) * (height - 2 * pad);
    const parts = [];
    const gridStep = (range) => (range <= 8 ? 1 : range <= 16 ? 2 : range <= 40 ? 5 : 10);
    const gx = gridStep(xmax - xmin);
    const gy = gridStep(ymax - ymin);
    for (let x = Math.ceil(xmin / gx) * gx; x <= xmax + 1e-9; x += gx) {
      parts.push(`<line x1="${sx(x)}" y1="${sy(ymin)}" x2="${sx(x)}" y2="${sy(ymax)}" stroke="var(--line)" stroke-width="1"/>`);
      if (Math.abs(x) > 1e-9) parts.push(`<text x="${sx(x)}" y="${sy(0) + 12}" font-size="9" text-anchor="middle" fill="var(--muted)">${x}</text>`);
    }
    for (let y = Math.ceil(ymin / gy) * gy; y <= ymax + 1e-9; y += gy) {
      parts.push(`<line x1="${sx(xmin)}" y1="${sy(y)}" x2="${sx(xmax)}" y2="${sy(y)}" stroke="var(--line)" stroke-width="1"/>`);
      if (Math.abs(y) > 1e-9) parts.push(`<text x="${sx(0) - 5}" y="${sy(y) + 3}" font-size="9" text-anchor="end" fill="var(--muted)">${y}</text>`);
    }
    if (ymin <= 0 && ymax >= 0) parts.push(`<line x1="${sx(xmin)}" y1="${sy(0)}" x2="${sx(xmax)}" y2="${sy(0)}" stroke="var(--line-strong)" stroke-width="1.4"/>`);
    if (xmin <= 0 && xmax >= 0) parts.push(`<line x1="${sx(0)}" y1="${sy(ymin)}" x2="${sx(0)}" y2="${sy(ymax)}" stroke="var(--line-strong)" stroke-width="1.4"/>`);
    const strokes = ["var(--blue)", "var(--red)", "var(--green)", "var(--violet)"];
    const toPath = (pts) => pts.map((pt, i) => `${i ? "L" : "M"}${sx(pt[0]).toFixed(1)},${sy(pt[1]).toFixed(1)}`).join(" ");
    (graph.polylines || []).forEach((pts, index) => {
      if (!Array.isArray(pts) || pts.length < 2) return;
      parts.push(`<path d="${toPath(pts)}" fill="none" stroke="${strokes[index % strokes.length]}" stroke-width="2.2" stroke-linejoin="round"/>`);
    });
    (graph.dashed || []).forEach((pts) => {
      if (!Array.isArray(pts) || pts.length < 2) return;
      parts.push(`<path d="${toPath(pts)}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="5 4"/>`);
    });
    (graph.curves || []).forEach((curve, index) => {
      const fn = graphCurveFn(curve && curve.expr);
      if (!fn) return;
      const [a, b] = Array.isArray(curve.domain) ? curve.domain.map(Number) : [xmin, xmax];
      const pts = [];
      const steps = 160;
      for (let i = 0; i <= steps; i += 1) {
        const x = a + ((b - a) * i) / steps;
        const y = fn(x);
        if (Number.isFinite(y) && y >= ymin - 1 && y <= ymax + 1) pts.push([x, Math.max(ymin, Math.min(ymax, y))]);
      }
      if (pts.length > 1) parts.push(`<path d="${toPath(pts)}" fill="none" stroke="${strokes[(index + (graph.polylines || []).length) % strokes.length]}" stroke-width="2.2"/>`);
    });
    (graph.points || []).forEach((point) => {
      if (!point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return;
      const open = point.open === true;
      parts.push(`<circle cx="${sx(point.x)}" cy="${sy(point.y)}" r="3.4" fill="${open ? "var(--panel)" : "var(--blue)"}" stroke="var(--blue)" stroke-width="1.6"/>`);
    });
    (graph.labels || []).forEach((label) => {
      if (!label || typeof label.text !== "string") return;
      parts.push(`<text x="${sx(label.x)}" y="${sy(label.y)}" font-size="11" fill="var(--ink)">${escapeAttr(label.text)}</text>`);
    });
    return `
      <div class="problem-graph">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="題目附圖">${parts.join("")}</svg>
      </div>
    `;
  }

  function renderQuiz() {
    const current = getCurrentProblem();
    if (!quiz || !current) return "";
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const perQuestionRemaining = Math.max(0, questionTimeLimit(quiz, current) - elapsed);
    const examRemaining = quiz.examMode ? examTimeRemaining(quiz) : null;
    const remaining = quiz.examMode ? examRemaining : perQuestionRemaining;
    const progress = Math.round((quiz.index / quiz.problems.length) * 100);
    const isPractice = Boolean(quiz.practice);
    const noTimer = Boolean(quiz.noTimer || isPractice);
    const isDanger = !noTimer && remaining <= (quiz.examMode ? 180 : 8) ? "is-danger" : "";
    const feedback = quiz.feedback;
    const answerMode = quiz.answerMode || "free";
    const timeLabel = noTimer ? "模式" : quiz.examMode ? "考試" : "時間";
    const timeValue = noTimer ? "自由" : quiz.examMode ? formatCountdown(remaining) : String(remaining);
    const pathNodeIdx = quiz.pathNodeId ? PATH_NODES.findIndex((node) => node.id === quiz.pathNodeId) : -1;
    const pathNode = pathNodeIdx >= 0 ? PATH_NODES[pathNodeIdx] : null;
    const totalQ = quiz.problems.length;
    const correctSoFar = quiz.answers.filter((answer) => answer.correct).length;
    const maxPossible = correctSoFar + (totalQ - quiz.answers.length);
    const passTh = Math.ceil(totalQ * 0.7);
    const goldTh = Math.ceil(totalQ * 0.9);
    const clearLost = correctSoFar < passTh && maxPossible < passTh;
    const clearLine =
      correctSoFar >= goldTh ? "已達金牌"
      : correctSoFar >= passTh ? `差 ${goldTh - correctSoFar} 題金牌`
      : maxPossible >= passTh ? `差 ${passTh - correctSoFar} 題過關`
      : "本關失守，專心清錯";

    return `
      <main class="screen quiz-screen" id="buzz-main">
        <section class="arena">
          <div class="arena-top">
            <div class="progress-block">
              <div class="progress-meta">
                ${pathNode
                  ? `<strong>第 ${pathNodeIdx + 1} 關 · <span class="lvl-full">${escapeHtml(pathNode.label)}</span><span class="lvl-short">${escapeHtml(pathNode.short || pathNode.label)}</span></strong>
                     <span>本關進度 ${quiz.index + 1} / ${totalQ}</span>
                     <span class="clear-need ${clearLost ? "is-lost" : ""}">${clearLine}</span>
                     <span>連勝 ${quiz.currentStreak}</span>`
                  : `<strong>${escapeHtml(quiz.namedExam ? quiz.namedExam.label : modeLabel(quiz.mode))}</strong>
                     <span>第 ${quiz.index + 1} / ${quiz.problems.length} 題</span>
                     <span>${isPractice ? "不計分" : `目前分數 ${quiz.score}`}</span>
                     <span>連勝 ${quiz.currentStreak}</span>`}
              </div>
              <div class="progress-bar" aria-label="進度"><span style="width:${progress}%"></span></div>
            </div>
            <div class="timer-cluster">
              <div class="timer-box ${isDanger} ${noTimer ? "is-freeform" : ""}" data-live-box="time" role="timer" aria-live="off">
                <span>${timeLabel}</span>
                <strong data-live="time">${timeValue}</strong>
              </div>
              ${
                // 原本這裡是「監考 / 切頁」的計數盒。整組拿掉了 ——
                // 一個一直盯著你看的數字，本身就是壓力來源，而它防不了任何東西。
                quiz.examMode
                  ? `<div class="timer-box" data-live-box="answered">
                <span>已答</span>
                <strong data-live="answered">${quiz.answers.length}/${totalQ}</strong>
              </div>`
                  : ""
              }
              <!-- 快捷鍵存在了很久，但沒有任何地方告訴使用者。
                   這顆只在有實體鍵盤的環境出現（CSS 用 pointer: fine 篩），
                   觸控裝置上按不到鍵盤，顯示它只是雜訊。 -->
              <button class="kbd-hint" data-action="show-shortcuts" title="鍵盤快捷鍵">
                <kbd>?</kbd><span>快捷鍵</span>
              </button>
            </div>
          </div>
          ${quiz.examMode ? renderExamQuestionMap() : ""}
          ${
            // 只在剛前進的 1.9 秒內渲染：之後的重繪（開提示、切工具）
            // 不該讓動畫重播。CSS 動畫自己淡出，不需要計時器清 DOM。
            quiz.correctToast && Date.now() - quiz.correctToast.at < 1900
              ? `<div class="correct-toast" role="status">${icon("check")}${escapeHtml(quiz.correctToast.text)}</div>`
              : ""
          }

          <div class="problem-stage ${feedback ? "has-feedback" : ""}">
            <article class="problem-card" role="group" aria-label="作答區">
              <div class="problem-meta">
                ${topicChip(current)}
                <span class="chip">${difficultyBadge(current)}</span>
                <span class="chip">${answerKindLabel(current.answerKind)}</span>
                ${
                  // 作圖表與選圖題不受本局的作答形式影響，
                  // 標一個「選擇題」在旁邊只會讓人以為選錯模式了。
                  ["graph", "worksheet"].includes(current.answerKind)
                    ? ""
                    : `<span class="chip">${answerModeLabel(answerMode)}</span>`
                }
                ${verifiedChip(current)}
              </div>
              <div class="prompt math-block" data-tex="${escapeAttr(current.prompt)}"></div>
              ${renderProblemGraph(current)}
              ${renderHintPanel(current)}
              ${renderAnswerControls(current)}
            </article>

            ${
              feedback
                ? `<div class="feedback ${feedback.status}">
                    <strong>${feedback.title}</strong>
                    <p>${feedback.message}</p>
                    ${renderKeyIdea(current)}
                    ${
                      feedback.status !== "correct" && !quiz.examMode
                        ? `${renderSolutionStages(current, { live: true })}
                           <button class="button feedback-next" data-action="next-question">${icon("play")}${quiz.forceFinishAfterFeedback || quiz.index + 1 >= quiz.problems.length ? "看結算" : "下一題"}</button>`
                        : ""
                    }
                  </div>`
                : ""
            }
          </div>

          <div class="action-row quiz-footer-row">
            <button class="button secondary" data-action="skip">${icon("skip")}跳過</button>
            <button class="button ghost" data-action="show-rules">${icon("info")}規則</button>
            <!-- 本局規則從 300px 的側欄降級成一行小字：它是被動資訊，
                 不值得一個常駐欄位把題目卡壓窄。詳細規則在「規則」鈕裡。 -->
            <span class="quiz-mode-note">${quiz.examMode ? "整份倒數 · 時間到直接交卷" : quiz.survival ? "生存：最多錯 3 題" : quiz.suddenDeath ? "Boss 連戰：錯一題就結算" : noTimer ? "本局不倒數" : "每題各自倒數，時間到算未作答"}</span>
          </div>
        </section>
      </main>
      ${quiz.modal === "rules" ? renderRulesModal() : ""}
      ${quiz.modal === "exit" ? renderExitModal() : ""}
    `;
  }

  function renderAnswerControls(problem) {
    // 作圖表題有自己的作答介面（一張要填的表 + 手繪），不受作答形式影響。
    if (problem.answerKind === "worksheet") return renderWorksheetControls(problem);
    // 選圖題只能用選的 —— 沒有辦法「打出一張圖」。
    // 所以它不受本局的作答形式影響，永遠走選項。
    if (problem.answerKind === "graph") return renderGraphChoiceControls(problem);
    if (quiz.answerMode === "choice") return renderChoiceControls(problem);
    return renderFreeAnswerControls(problem);
  }

  // ── 作圖表題 ──────────────────────────────────────────────────
  //
  // 給一個 f，要求把遞增／遞減、極大／極小、凹向上／凹向下、反曲點
  // 逐格填進表格，最後在計算紙上把圖畫出來。
  //
  // 為什麼是一張表而不是七道獨立的題：**表格本身就是方法**。
  // 課本教作圖的時候教的不是「會算 f′」，是「照順序把這些欄位填完，
  // 圖形就浮出來了」。拆成七題各自答對，練不到那個順序感。
  //
  // 最後的手繪不判分 —— 沒辦法自動判一張手畫的圖。但送出之後會把
  // 正確的圖畫在旁邊，讓使用者自己對照。**自己看出差在哪**，
  // 比一個分數有用。

  // 表格的每一格存在 quiz.worksheet[題號][欄位]。
  // 送出時序列化成一個字串塞進 quiz.draft，這樣既有的紀錄、
  // 錯題本、attemptLog 全部不用改就會動。
  function worksheetDraft(problem) {
    if (!quiz.worksheet) quiz.worksheet = {};
    if (!quiz.worksheet[problem.id]) quiz.worksheet[problem.id] = {};
    return quiz.worksheet[problem.id];
  }

  function serializeWorksheet(problem) {
    const draft = worksheetDraft(problem);
    return (problem.fields || [])
      .map((field) => `${field.key}=${String(draft[field.key] || "").trim()}`)
      .join("; ");
  }

  function parseWorksheet(problem, input) {
    const out = {};
    String(input || "").split(";").forEach((piece) => {
      const at = piece.indexOf("=");
      if (at < 0) return;
      out[piece.slice(0, at).trim()] = piece.slice(at + 1).trim();
    });
    void problem;
    return out;
  }

  // 每一格用對應型別的判分器分開判。
  //
  // 全對才算對 —— 作圖表的重點是「整張表有沒有一致」，
  // 一格填錯就代表圖會畫錯。但回饋會逐格標出來，
  // 所以使用者知道錯的是哪一格，而不是只知道「錯了」。
  function checkWorksheet(problem, input) {
    const values = parseWorksheet(problem, input);
    const rows = (problem.fields || []).map((field) => {
      const given = values[field.key] || "";
      if (!given) return { field, given, correct: false, message: "沒有填" };
      const sub = { answerKind: field.kind, answer: field.answer, answers: field.answers };
      const result = checkAnswer(sub, given);
      return { field, given, correct: result.correct, message: result.message };
    });
    const wrong = rows.filter((row) => !row.correct);
    return {
      correct: wrong.length === 0,
      rows,
      message: wrong.length === 0
        ? "整張表都對了。對照一下你畫的圖。"
        : `有 ${wrong.length} 格對不上：${wrong.map((row) => row.field.label).join("、")}`
    };
  }

  function renderWorksheetControls(problem) {
    const disabled = quiz.feedback ? "disabled" : "";
    const draft = worksheetDraft(problem);
    const graded = quiz.feedback ? checkWorksheet(problem, serializeWorksheet(problem)) : null;
    const markFor = (key) => {
      if (!graded) return "";
      const row = graded.rows.find((entry) => entry.field.key === key);
      if (!row) return "";
      return row.correct
        ? `<span class="ws-mark is-ok">${icon("check")}</span>`
        : `<span class="ws-mark is-bad">${icon("x")}</span>`;
    };
    const answerFor = (key) => {
      if (!graded) return "";
      const row = graded.rows.find((entry) => entry.field.key === key);
      if (!row || row.correct) return "";
      return `<small class="ws-answer">正解 ${escapeHtml(row.field.answer || (row.field.answers || []).join(" / "))}</small>`;
    };

    return `
      <section class="worksheet">
        <table class="ws-table">
          <caption class="sr-only">作圖表</caption>
          <tbody>
            ${(problem.fields || [])
              .map(
                (field) => `
                  <tr>
                    <th scope="row">
                      ${escapeHtml(field.label)}
                      ${field.note ? `<small>${escapeHtml(field.note)}</small>` : ""}
                    </th>
                    <td>
                      <input class="ws-input" data-ws-field="${escapeAttr(field.key)}"
                        value="${escapeAttr(draft[field.key] || "")}"
                        placeholder="${escapeAttr(field.placeholder || worksheetPlaceholder(field.kind))}"
                        autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${disabled} />
                      ${answerFor(field.key)}
                    </td>
                    <td class="ws-mark-cell">${markFor(field.key)}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <p class="ws-hint">
          區間寫成 <code>(-inf, -1) U (1, inf)</code>，集合寫成 <code>{-1, 1}</code>，沒有就填 <code>{}</code> 或 <code>無</code>。
        </p>
        ${
          quiz.feedback
            ? renderWorksheetSketchCompare(problem)
            : `<p class="ws-sketch-cue">${icon("pen")}表格填完之後，在下面的計算紙上把圖畫出來 —— 送出後會顯示正確的圖讓你對照。</p>`
        }
        <form class="answer-panel ws-form" data-action="submit-answer">
          <button class="button" type="submit" ${disabled}>${icon("send")}送出整張表</button>
        </form>
      </section>
      ${attachedScratchboard(problem, disabled)}
    `;
  }

  function worksheetPlaceholder(kind) {
    if (kind === "interval") return "例如 (-inf, 0) U (2, inf)";
    if (kind === "set") return "例如 {-1, 1}，沒有就填 {}";
    if (kind === "numeric") return "一個數";
    return "";
  }

  // 送出之後把正確的圖畫出來。手繪不判分，但**看得到差在哪**才有意義。
  function renderWorksheetSketchCompare(problem) {
    const sketch = problem.sketch;
    if (!sketch || !sketch.expr) return "";
    return `
      <div class="ws-compare">
        <div>
          <p class="section-label">正確的圖形</p>
          ${renderMiniGraph(sketch.expr, sketch.window, sketch.domain)}
        </div>
        <p class="ws-compare-note">
          跟你畫的比一下：極值的位置、凹向翻轉的那一點、兩端往哪裡去 ——
          這三件事對了，圖就對了。
        </p>
      </div>
    `;
  }

  // ── 選圖題 ────────────────────────────────────────────────────
  //
  // 這是題庫裡唯一「答案是一張圖」的題型，而它練的東西別的題型練不到：
  // 把 f′ 的符號、f″ 的凹向、定義域與極值**合起來**變成一個形狀。
  // 拆開來每一項都有題目在練（臨界點、反曲點、遞增區間…），
  // 但「合起來長什麼樣」是另一種能力。
  //
  // 每一個誘答都是一個**具名的畫圖錯誤**（符號反了、極值位置錯、
  // 少了漸近線…），答錯時直接告訴使用者他犯的是哪一個 ——
  // 這也是題庫裡第一批有作者撰寫誘答的題目。
  function renderGraphChoiceControls(problem) {
    const disabled = quiz.feedback ? "disabled" : "";
    const choices = getGraphChoiceOptions(problem);
    return `
      <div class="graph-choice-grid" role="radiogroup" aria-label="選擇正確的圖形">
        ${choices
          .map((choice, index) => {
            const letter = String.fromCharCode(65 + index);
            const wrong = quiz.feedback && quiz.draft === choice.expr && !checkAnswer(problem, choice.expr).correct;
            return `
              <button class="graph-choice ${wrong ? "is-wrong" : ""}" type="button"
                data-action="choose-answer" data-choice="${escapeAttr(choice.expr)}" ${disabled}
                aria-label="選項 ${letter}">
                <span class="graph-choice-letter">${letter}</span>
                ${renderMiniGraph(choice.expr, problem.graphWindow, problem.graphDomain)}
                ${wrong && choice.why ? `<small class="graph-choice-why">${escapeHtml(choice.why)}</small>` : ""}
              </button>`;
          })
          .join("")}
      </div>
      <div class="helper-row">
        <span>四張圖只有一張的 f′、f″ 與定義域全部對得上</span>
      </div>
      ${attachedScratchboard(problem, disabled)}
    `;
  }

  function getGraphChoiceOptions(problem) {
    if (!quiz.choiceOptions) quiz.choiceOptions = {};
    if (quiz.choiceOptions[problem.id]) return quiz.choiceOptions[problem.id];
    const list = (problem.graphChoices || []).filter((choice) => choice && choice.expr);
    const shuffled = shuffle(list.slice(), seedFromString(`${quiz.startedAt}-${problem.id}-graph`));
    quiz.choiceOptions[problem.id] = shuffled;
    return shuffled;
  }

  // 迷你繪圖。跟 renderProblemGraph 共用座標與格線的邏輯，
  // 但尺寸小、不畫刻度數字 —— 四張並排的時候刻度只會變成雜訊。
  function renderMiniGraph(expr, windowSpec, domainSpec) {
    const win = Array.isArray(windowSpec) && windowSpec.length === 4 ? windowSpec.map(Number) : [-4, 4, -4, 4];
    const [xmin, xmax, ymin, ymax] = win;
    if (!(xmax > xmin) || !(ymax > ymin)) return "";
    const fn = graphCurveFn(expr);
    if (!fn) return "";
    const width = 150;
    const height = 118;
    const pad = 6;
    const sx = (x) => pad + ((x - xmin) / (xmax - xmin)) * (width - 2 * pad);
    const sy = (y) => height - pad - ((y - ymin) / (ymax - ymin)) * (height - 2 * pad);
    const parts = [];
    if (ymin <= 0 && ymax >= 0) {
      parts.push(`<line x1="${sx(xmin)}" y1="${sy(0)}" x2="${sx(xmax)}" y2="${sy(0)}" stroke="var(--line-strong)" stroke-width="1"/>`);
    }
    if (xmin <= 0 && xmax >= 0) {
      parts.push(`<line x1="${sx(0)}" y1="${sy(ymin)}" x2="${sx(0)}" y2="${sy(ymax)}" stroke="var(--line-strong)" stroke-width="1"/>`);
    }
    // 曲線可能在窗內斷開（極點、定義域邊界）。斷了就開新的一段，
    // 不要用一條直線把兩支接起來 —— 那會把漸近線畫成穿過去，
    // 而「有沒有穿過去」正是這類題目要看的。
    const [a, b] = Array.isArray(domainSpec) && domainSpec.length === 2 ? domainSpec.map(Number) : [xmin, xmax];
    const steps = 220;
    const segments = [];
    let current = [];
    for (let i = 0; i <= steps; i += 1) {
      const x = a + ((b - a) * i) / steps;
      const y = fn(x);
      if (Number.isFinite(y) && y >= ymin && y <= ymax) {
        current.push([x, y]);
      } else {
        if (current.length > 1) segments.push(current);
        current = [];
      }
    }
    if (current.length > 1) segments.push(current);
    segments.forEach((pts) => {
      const path = pts.map((pt, i) => `${i ? "L" : "M"}${sx(pt[0]).toFixed(1)},${sy(pt[1]).toFixed(1)}`).join(" ");
      parts.push(`<path d="${path}" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linejoin="round"/>`);
    });
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="候選圖形">${parts.join("")}</svg>`;
  }

  // renderExamLockStatus() 已移除 —— 那是全螢幕鎖定的狀態列與「鎖定全螢幕」按鈕。
  // 大考模式現在只剩整份倒數與無提示，剩下的倒數資訊在上面的計時盒裡就看得到。

  function renderHintPanel(problem) {
    const hints = hintsFor(problem);
    const shown = Math.min(quiz.hintsUsed?.[problem.id] || 0, hints.length);
    if (quiz.noHint) {
      return `
        <div class="hint-panel is-locked">
          <div>
            <strong>No Hint</strong>
            <span>本局關閉提示</span>
          </div>
          <button class="button ghost" disabled>${icon("lightbulb")}不可用</button>
        </div>
      `;
    }
    return `
      <div class="hint-panel">
        <div>
          <strong>提示</strong>
          <span>${shown}/${hints.length}${quiz.practice ? "" : ` · 每次扣 ${hintPenalty(problem)} 分`}</span>
        </div>
        <button class="button ghost" data-action="show-hint" ${quiz.feedback || shown >= hints.length ? "disabled" : ""}>${icon("lightbulb")}看提示</button>
      </div>
      ${
        shown
          ? `<ol class="hint-list">${hints.slice(0, shown).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}</ol>`
          : ""
      }
    `;
  }

  function renderFreeAnswerControls(problem) {
    const disabled = quiz.feedback ? "disabled" : "";
    const boardTool = quiz.boardTool || "pen";
    const fullscreen = Boolean(quiz.boardFullscreen);
    const strokes = cloneBoardStrokes(problem.id);
    const boardOpen = fullscreen || Boolean(quiz.boardOpen) || strokes.length > 0;
    const previewTex = answerToTex(quiz.draft, problem) || "\\text{尚未輸入}";
    const answerWorkspace = renderWebWorkAnswerWorkspace(problem, disabled, previewTex, fullscreen);
    const scratchboard = renderScratchboard(problem, disabled, boardTool, fullscreen, boardOpen, strokes.length);
    // 全螢幕書寫時題目必須留在畫面上。
    // 一開始沒有，實測就發現：攤開計算紙之後題目被推出視窗，
    // 使用者得先收起來看一眼題目再攤開 —— 那等於沒有全螢幕。
    const promptBar = fullscreen
      ? `<div class="handwrite-prompt"><div class="math-inline" data-tex="${escapeAttr(problem.prompt)}"></div></div>`
      : "";
    return `
      <div class="handwrite-shell webwork-shell ${fullscreen ? "is-fullscreen" : ""}">
        ${fullscreen ? `${promptBar}${scratchboard}${answerWorkspace}` : `${answerWorkspace}${scratchboard}`}
      </div>
    `;
  }

  function renderWebWorkAnswerWorkspace(problem, disabled, previewTex, compact) {
    const syntax = answerSyntaxInfo(problem, quiz.draft);
    const examples = answerExamples(problem);
    // Keypad/preview/examples collapse into a drawer; on a narrow screen they
    // start closed so the prompt + input stay primary. Resolved once per quiz.
    if (quiz.keypadOpen == null) {
      quiz.keypadOpen = typeof window === "undefined" || !window.innerWidth || window.innerWidth >= 760;
    }
    const extrasOpen = quiz.keypadOpen;

    // 觸控裝置預設不叫系統鍵盤。
    //
    // iPad 上點一下輸入框，系統鍵盤就蓋掉半個畫面 —— 蓋住的正是剛剛寫滿算式的
    // 計算紙，而且你得先放下筆。既然畫面上已經有一套數學鍵盤（現在含數字），
    // 那才是這個裝置上正確的輸入法。
    //
    // inputmode="none" 是標準做法：「我自己提供輸入介面，不要跳虛擬鍵盤」。
    // 但一定要留逃生門 —— 有人接了實體鍵盤，也有人就是想用系統鍵盤打字，
    // 所以旁邊有一顆可以切回去，而且選擇會記在這一局裡。
    const touchDevice = typeof window !== "undefined" && typeof window.matchMedia === "function"
      && window.matchMedia("(pointer: coarse)").matches;
    if (quiz.systemKeyboard == null) quiz.systemKeyboard = !touchDevice;
    const suppressKeyboard = touchDevice && !quiz.systemKeyboard;
    const hasDraft = Boolean(quiz.draft.trim());
    return `
      <section class="webwork-answer ${compact ? "is-docked" : ""}">
        <div class="webwork-head">
          <div>
            <span>作答</span>
            <strong>${answerKindLabel(problem.answerKind)}</strong>
          </div>
          <span class="syntax-pill ${syntax.className}" data-syntax-status>${syntax.label}</span>
        </div>
        <form class="answer-panel webwork-form" data-action="submit-answer">
        <label class="sr-only" for="answer">答案</label>
        <input id="answer" class="answer-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="${suppressKeyboard ? "none" : "text"}" value="${escapeAttr(quiz.draft)}" placeholder="${placeholderFor(problem)}" ${disabled} />
        ${
          touchDevice
            ? `<button class="icon-button keyboard-toggle ${quiz.systemKeyboard ? "is-active" : ""}" type="button" data-action="toggle-system-keyboard" title="${quiz.systemKeyboard ? "改用畫面上的數學鍵盤" : "叫出系統鍵盤"}" aria-pressed="${quiz.systemKeyboard ? "true" : "false"}" ${disabled}>${icon("keyboard")}</button>`
            : ""
        }
        <button class="button" type="submit" ${disabled}>${icon("send")}送出</button>
        </form>
        <button class="webwork-extras-toggle" type="button" data-action="toggle-keypad" aria-expanded="${extrasOpen ? "true" : "false"}" ${disabled}>
          <span>${icon(extrasOpen ? "chevron-up" : "chevron-down")}輸入工具</span>
          <small>${extrasOpen ? "預覽 · 符號鍵 · 範例" : hasDraft ? "點開看預覽" : "預覽 · 符號鍵 · 範例"}</small>
        </button>
        <div class="webwork-extras ${extrasOpen ? "is-open" : "is-collapsed"}">
          <div class="answer-preview webwork-preview">
            <span>預覽</span>
            <div class="answer-preview-math math-inline ${hasDraft ? "" : "is-empty"}" data-answer-preview data-tex="${escapeAttr(previewTex)}">${renderLiteTex(previewTex, false)}</div>
          </div>
          <div class="webwork-examples" aria-label="常用答案格式">
            ${examples.map((item) => `<button type="button" data-insert-example="${escapeAttr(item)}" ${disabled}>${escapeHtml(item)}</button>`).join("")}${canReadInk(problem) ? `<button type="button" class="ink-read-button" data-action="read-ink" ${disabled}>讀取手寫 →</button>` : ""}
            <button type="button" data-action="clear-answer" ${disabled}>清除</button>
          </div>
          <div class="keypad webwork-keypad" aria-label="快速輸入">
            ${webworkKeys(problem).map((key) => `<button type="button" data-insert="${escapeAttr(key.insert)}" ${disabled}>${escapeHtml(key.label)}</button>`).join("")}<button type="button" class="keypad-backspace" data-action="answer-backspace" title="退格" ${disabled}>⌫</button>
          </div>
          <div class="helper-row webwork-helper">
            <span>${formatHelp(problem.answerKind)}</span>
            <span>不定積分可省略 +C</span>
            <span>送出前先看預覽</span>
          </div>
        </div>
      </section>
    `;
  }

  function renderScratchboard(problem, disabled, boardTool, fullscreen, boardOpen, strokeCount) {
    const surface = boardSurface();
    const surfaceNext = surface === "paper" ? "換成黑板" : "換成方格紙";
    return `
      <section class="scratchboard-shell ${boardOpen ? "is-open" : "is-collapsed"}">
        <div class="scratchboard-summary">
          <div>
            <span>計算紙</span>
            <strong data-board-count>${strokeCount ? `${strokeCount} 筆` : "手寫草稿"}</strong>
          </div>
          <div class="board-tools" aria-label="計算紙工具">
            <button class="icon-button" type="button" data-board-action="toggle" title="${boardOpen ? "收起計算紙" : "攤開計算紙"}" ${disabled}>${icon(boardOpen ? "chevron-up" : "chevron-down")}</button>
            ${
              boardOpen
                ? `
                  <button class="icon-button ${boardTool === "pen" ? "is-active" : ""}" type="button" data-board-action="tool" data-tool="pen" title="筆" ${disabled}>${icon("pen")}</button>
                  <button class="icon-button ${boardTool === "eraser" ? "is-active" : ""}" type="button" data-board-action="tool" data-tool="eraser" title="橡皮擦" ${disabled}>${icon("eraser")}</button>
                  <button class="icon-button" type="button" data-board-action="undo" title="復原上一筆（兩指點一下也可以）" ${disabled}>${icon("undo")}</button>
                  <button class="icon-button" type="button" data-board-action="redo" title="重做" ${disabled}>${icon("redo")}</button>
                  <button class="icon-button" type="button" data-board-action="clear" title="全部擦掉（可以重做救回來）" ${disabled}>${icon("trash")}</button>
                  <button class="icon-button" type="button" data-board-action="surface" title="${surfaceNext}" ${disabled}>${icon(surface === "paper" ? "moon" : "grid")}</button>
                  <button class="icon-button" type="button" data-board-action="fullscreen" title="${fullscreen ? "退出全螢幕" : "全螢幕書寫"}" ${disabled}>${icon(fullscreen ? "minimize" : "maximize")}</button>
                `
                : ""
            }
          </div>
        </div>
        ${
          boardOpen
            ? `<canvas class="blackboard" data-blackboard data-surface="${surface}" data-tool="${escapeAttr(boardTool)}" data-problem-id="${escapeAttr(problem.id)}" aria-label="手寫計算紙"></canvas>`
            : ""
        }
        ${renderPreviousBoard(problem)}
      </section>
    `;
  }

  function answerSyntaxInfo(problem, value) {
    const raw = String(value || "").trim();
    if (!raw) return { label: "空白", className: "is-empty" };
    if (problem.answerKind === "text") return { label: "文字", className: "is-ready" };
    if (isTexLike(raw)) return { label: "TeX", className: "is-ready" };
    if (expressionToTex(raw)) return { label: "可送出", className: "is-ready" };
    return { label: "格式", className: "is-warning" };
  }

  // 觸控筆／手指操作的平板（iPad 直式 834、橫式 1194，都算）。
  //
  // pointer: coarse 把桌機排除掉（滑鼠是 fine）——
  // 桌機視窗再怎麼寬也不該被當成平板來改行為。
  function isCoarsePointerTablet() {
    if (typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(min-width: 768px) and (pointer: coarse)").matches;
  }

  // 每一種作答介面都掛得上的計算紙。
  //
  // 原本只有「自己寫」跟作圖表有紙 —— 但選擇題一樣要算：
  // 四個選項擺在那裡不代表答案用看的就看得出來，算完才知道選哪個。
  // 沒有紙的話使用者要嘛心算、要嘛真的去拿一張紙，而後者代表他離開了這個畫面。
  //
  // 預設收合（有筆跡或使用者展開過才打開），所以不會把選項往下推。
  function attachedScratchboard(problem, disabled) {
    // 只需要「有幾筆」，不要 cloneBoardStrokes ——
    // 那會把這一題的每一個取樣點深拷貝一次，而這個函式每次 render 都會跑。
    // 寫滿一頁之後是幾萬個物件配置，換來的只是一個 .length。
    const count = (quiz.boardStrokes && quiz.boardStrokes[problem.id] || []).length;
    const fullscreen = Boolean(quiz.boardFullscreen);
    const open = fullscreen || Boolean(quiz.boardOpen) || count > 0;
    return renderScratchboard(problem, disabled, quiz.boardTool || "pen", fullscreen, open, count);
  }

  function renderChoiceControls(problem) {
    const disabled = quiz.feedback ? "disabled" : "";
    const choices = getChoiceOptions(problem);
    const grid = `
      <div class="choice-grid" role="radiogroup" aria-label="選擇答案">
        ${choices
          .map(
            (choice, index) => {
              const choiceTex = answerToTex(choice.label, problem) || textToTex(choice.label);
              const selectedWrong = quiz.feedback && quiz.draft === choice.value && !checkAnswer(problem, choice.value).correct;
              return `
              <button class="choice-option" type="button" data-action="choose-answer" data-choice="${escapeAttr(choice.value)}" ${disabled}>
                <span>${String.fromCharCode(65 + index)}</span>
                <strong class="choice-math math-inline" data-tex="${escapeAttr(choiceTex)}">${renderLiteTex(choiceTex, false)}</strong>
                ${selectedWrong ? `<small class="choice-reason">${escapeHtml(choiceDistractorReason(problem, choice.value))}</small>` : ""}
              </button>`;
            }
          )
          .join("")}
      </div>
      <div class="helper-row">
        <span>點選選項後會直接送出</span>
        <!-- 全螢幕時計算紙在上面，寫「下面有計算紙」會把人往錯的方向指 -->
        <span>${quiz.boardFullscreen ? "算完直接點答案" : "要算的話下面有計算紙"}</span>
      </div>
    `;
    return fullscreenShell(problem, grid, attachedScratchboard(problem, disabled));
  }

  // 全螢幕書寫的版面外殼。
  //
  // 這個外殼原本只長在「自己寫」那條路徑上。把計算紙掛到選擇題的時候，
  // 工具列（包含全螢幕按鈕）一起帶過去了，但版面沒有 ——
  // 於是選擇題上那顆按鈕按下去只會換個圖示，畫面完全不動。
  // 做 demo 截圖時才發現：「全螢幕」那張跟前一張一模一樣。
  //
  // 三種作答形式共用這一支，就不會再出現「有按鈕沒功能」。
  function fullscreenShell(problem, controls, scratchboard) {
    if (!quiz.boardFullscreen) return `${controls}${scratchboard}`;
    // 全螢幕時題目要留在畫面上 —— 不然使用者得退出來看一眼題目再進去
    return `
      <div class="handwrite-shell is-fullscreen">
        <!-- math-block 而不是 math-inline：block 才會走 renderLongTexFlow，
             把敘述切成可折行的文字段與不可拆的算式段。
             inline 的 KaTeX 輸出整串是一個 nowrap 的 span，
             在容器上設 white-space: normal 也救不了 —— iPad 上題目兩端會被切掉。 -->
        <div class="handwrite-prompt"><div class="math-block" data-tex="${escapeAttr(problem.prompt)}"></div></div>
        ${scratchboard}
        ${controls}
      </div>
    `;
  }

  function renderRulesModal() {
    const ruleText = quiz && quiz.examMode
      ? `大考模式為整份 ${Math.round((quiz.examDurationSec || 0) / 60)} 分鐘倒數，全部題目自己輸入答案。時間到會直接交卷。中途切出去做別的事不會被記錄，也不會影響成績。`
      : "每題都有自己的倒數。超時、跳過或答案不等價都會記為錯題。答題後會顯示簡短解法，而且每一題都附一張計算紙。";
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="rules-title" data-modal>
          <h3 id="rules-title">本局規則</h3>
          <p>${escapeHtml(ruleText)}</p>
          <button class="button" data-action="close-modal">${icon("check")}繼續</button>
        </div>
      </div>
    `;
  }

  function renderExitModal() {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="exit-title" data-modal>
          <h3 id="exit-title">離開本局？</h3>
          <p>目前進度會直接結算，未完成的題目不會加分。</p>
          <div class="action-row">
            <button class="button warning" data-action="finish-now">${icon("x")}結算離開</button>
            <button class="button secondary" data-action="close-modal">${icon("check")}繼續挑戰</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderAppNoticeModal() {
    if (!appNotice) return "";
    // 快捷鍵表有自己的排版（kbd 樣式的表格）；其他通知維持一段文字。
    if (appNotice === "__shortcuts__") {
      return `
        <div class="modal-backdrop" data-action="dismiss-notice">
          <div class="modal shortcuts-modal" role="dialog" aria-modal="true" aria-labelledby="app-notice-title" data-modal>
            <h3 id="app-notice-title">鍵盤快捷鍵</h3>
            <dl class="shortcuts-table">
              ${SHORTCUTS.map(
                (item) => `
                  <div>
                    <dt>${item.keys.split(/\s*[–\/]\s*| /).filter(Boolean).map((k) => `<kbd>${escapeHtml(k)}</kbd>`).join(" ")}</dt>
                    <dd>${escapeHtml(item.what)}</dd>
                  </div>`
              ).join("")}
            </dl>
            <button class="button" data-action="dismiss-notice">${icon("check")}知道了</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="modal-backdrop" data-action="dismiss-notice">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="app-notice-title" data-modal>
          <h3 id="app-notice-title">提醒</h3>
          <p>${escapeHtml(appNotice)}</p>
          <button class="button" data-action="dismiss-notice">${icon("check")}知道了</button>
        </div>
      </div>
    `;
  }

  function showAppNotice(message) {
    appNotice = String(message || "");
    render();
  }

  // 校準包預覽。給人看的是**真的會被寫進檔案的那份資料**，
  // 不是另外寫一段「我們只收集…」的描述文字 ——
  // 描述文字會跟實作分家，實際內容不會。
  function renderCalibrationPreviewModal() {
    if (!calibrationPreview) return "";
    const pack = calibrationPreview;
    const shown = { ...pack, rows: pack.rows.slice(0, 8) };
    const rest = pack.rows.length > 8 ? `\n… 其餘 ${pack.rows.length - 8} 筆格式完全相同` : "";
    return `
      <div class="modal-backdrop" data-action="dismiss-calibration-preview">
        <div class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="calib-title" data-modal>
          <h3 id="calib-title">校準包內容</h3>
          <p>按「匯出」會產生的就是下面這份檔案，共 ${pack.rows.length} 筆。</p>
          <pre class="calibration-preview">${escapeHtml(JSON.stringify(shown, null, 2) + rest)}</pre>
          <button class="button" data-action="dismiss-calibration-preview">${icon("check")}關閉</button>
        </div>
      </div>
    `;
  }

  function showCalibrationPreview() {
    const pack = buildCalibrationPack();
    if (!pack.rows.length) {
      showAppNotice("還沒有可用的作答統計，先練幾題再看。");
      return;
    }
    calibrationPreview = pack;
    render();
  }

  // 「這局帶走」：把錯題折成兩三張技巧卡，每張一句關鍵想法＋一顆「練同型」。
  //
  // 結算頁原本的敘事停在「你考幾分」；學習的結尾應該是「所以接下來練什麼」。
  // 卡片按技巧去重 —— 同一招錯三題是一件事，不是三件事。
  function renderTakeawayCards(currentQuiz) {
    const wrong = currentQuiz.answers.filter((answer) => !answer.correct);
    if (!wrong.length) return "";
    const seenSkills = new Set();
    const cards = [];
    for (const answer of wrong) {
      const problem = answer.problem;
      const idea = keyIdeaFor(problem);
      if (!idea || !idea.text) continue;
      const skills = window.BuzzSkillGraph ? window.BuzzSkillGraph.skillsForProblem(problem) : [];
      const skillKey = skills[0] || problem.topic;
      if (seenSkills.has(skillKey)) continue;
      seenSkills.add(skillKey);
      cards.push({ problem, idea, skillKey });
      if (cards.length >= 3) break;
    }
    if (!cards.length) return "";
    return `
      <section class="takeaway" data-enter>
        <p class="section-label">這局帶走</p>
        <div class="takeaway-grid">
          ${cards
            .map(
              (card) => `
                <div class="takeaway-card">
                  <p>${escapeHtml(card.idea.text)}</p>
                  <button class="link-button" data-action="practice-similar" data-problem-id="${escapeAttr(card.problem.id)}">練同型 8 題 →</button>
                </div>`
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // 同型再練：抓「共用同一個技巧、難度 ±1」的題開一局。
  // 不用模板變體做這件事 —— 變體只是換數字，真正的同型是同一招。
  function startSimilarPractice(problemId) {
    const origin = problemById(problemId);
    if (!origin) return;
    const records = loadRecords();
    const skills = window.BuzzSkillGraph ? window.BuzzSkillGraph.skillsForProblem(origin) : [];
    const rank = problemRank(origin);
    let pool = [];
    if (skills.length) {
      const skillSet = new Set(skills);
      pool = problems.filter((problem) => {
        if (problem.id === origin.id) return false;
        if (Math.abs(problemRank(problem) - rank) > 1) return false;
        const mine = window.BuzzSkillGraph.skillsForProblem(problem);
        return mine.some((id) => skillSet.has(id));
      });
    }
    // 技巧圖接不到（kernel 沒載）就退回同主題同難度 —— 較粗但誠實
    if (pool.length < 4) {
      pool = problems.filter(
        (problem) => problem.id !== origin.id && problem.topic === origin.topic && Math.abs(problemRank(problem) - rank) <= 1
      );
    }
    if (!pool.length) return;
    selectedMode = "quick";
    const ordered = adaptiveShuffle(pool, records, seedFromString(`similar-${problemId}-${Date.now()}`));
    startQuiz(padPool(ordered.slice(0, 8), pool, Math.min(8, pool.length), { records }), { modeKey: "quick" });
  }

  function renderResults() {
    if (!quiz) return "";
    const correct = quiz.answers.filter((answer) => answer.correct).length;
    const total = quiz.problems.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const avgTime = averageAnswerTime(quiz.answers);
    const topicStats = buildTopicStats(quiz.answers);
    const examAnalysis = quiz.examMode ? buildExamAnalysis(quiz.answers) : null;
    const records = loadRecords();
    const unlocked = quiz.unlockedAchievements || [];
    const gateResult = quiz.pathGate ? pathGateResult(quiz, correct, total) : null;
    const pathResult = !gateResult && quiz.pathNodeId ? pathLessonResult(quiz, records, accuracy) : null;

    const momentum = quiz.placementResult
      ? "8 題調適完成，起點已經校準好。之後想重測，設定頁隨時可以重新定位。"
      : quiz.examMode
        ? examResultMomentum(quiz, accuracy, correct, total)
        : resultMomentum(accuracy, avgTime, pathResult, gateResult);
    const speedInsight = quiz.speedInsight || speedInsightText(avgTime, recentAnswerStats(records, 30).avgSeconds);
    const pathIdx = quiz.pathNodeId ? PATH_NODES.findIndex((node) => node.id === quiz.pathNodeId) : -1;
    let verdict;
    let verdictClass;
    let nextLine = "";
    if (gateResult) {
      verdict = gateResult.passed ? "跳關通過" : "跳關未通過";
      verdictClass = gateResult.passed ? "is-gold" : "is-fail";
    } else if (quiz.placementResult) {
      const placement = quiz.placementResult;
      verdict = `定位完成：R${placement.rank}`;
      verdictClass = "is-pass";
      nextLine = placement.weakTag
        ? `你的反射大約在 R${placement.rank}。最不穩：${tagLabel(placement.weakTag)} — 已把路線解鎖到 ${placement.nodeLabel}`
        : `你的反射大約在 R${placement.rank}。這 8 題沒有明顯弱點 — 已把路線解鎖到 ${placement.nodeLabel}`;
    } else if (quiz.namedExamOutcome) {
      const outcome = quiz.namedExamOutcome;
      verdict = outcome.passed ? (accuracy >= 85 ? "高分及格" : "及格") : "未及格";
      verdictClass = outcome.passed ? (accuracy >= 85 ? "is-gold" : "is-pass") : "is-fail";
      nextLine = outcome.passed
        ? `超過及格線 ${outcome.correct - outcome.passLine} 題（及格 ${outcome.passLine}/${outcome.total}）· 本卷最佳 ${outcome.best}%`
        : `距離及格還差 ${outcome.passLine - outcome.correct} 題（及格線 60% = ${outcome.passLine}/${outcome.total}），先清錯題再重考一份新卷`;
    } else if (pathResult) {
      const gold = pathResult.cleared && pathResult.accuracy >= 90;
      verdict = gold ? "金牌過關" : pathResult.cleared ? "過關" : "再加強";
      verdictClass = gold ? "is-gold" : pathResult.cleared ? "is-pass" : "is-fail";
      nextLine = pathResult.cleared
        ? pathResult.nextNode
          ? `解鎖下一關：${pathResult.nextNode.label}`
          : "主線全數完成"
        : `差 ${pathResult.needed || 1} 題過關，建議重練一次`;
    } else {
      verdict = resultTitle(accuracy);
      verdictClass = accuracy >= 70 ? "is-pass" : "is-fail";
    }
    const levelTag = pathIdx >= 0
      ? `結算 · 第 ${pathIdx + 1} 關 · ${PATH_NODES[pathIdx].label}`
      : quiz.namedExam
        ? `結算 · 模擬考 · ${quiz.namedExam.label}`
        : quiz.placementResult
          ? "結算 · 定位測驗"
          : "結算";

    return `
      <main class="screen results-screen">
        <section class="verdict ${verdictClass}">
          <p class="section-label" data-enter>${escapeHtml(levelTag)}</p>
          <h1 class="verdict-title" data-pop>${escapeHtml(verdict)}</h1>
          <p class="verdict-sub" data-enter>${escapeHtml(momentum)}</p>
          ${nextLine ? `<p class="verdict-next" data-enter>${escapeHtml(nextLine)}</p>` : ""}
          <div class="verdict-stats" data-enter>
            <span><strong><span data-countup="${correct}">${correct}</span>/${total}</strong>答對</span>
            <span><strong data-countup="${accuracy}" data-suffix="%">${accuracy}%</strong>正確率</span>
            <span><strong data-countup="${avgTime}" data-suffix="s">${avgTime}s</strong>平均</span>
            ${quiz.practice ? "" : `<span><strong data-countup="${quiz.score}">${quiz.score}</strong>分數</span>`}
          </div>
          ${quiz.placementResult ? renderPlacementNextStep() : renderResultsActions(gateResult, pathResult)}
          ${quiz.dailyOneOutcome ? renderDailyOneOutcomePanel(quiz.dailyOneOutcome) : ""}
          <div class="action-row results-share-row" data-enter>
            ${quiz.dailyOneOutcome ? `<button class="button ghost" data-action="share-daily-one">${icon("copy")}複製 emoji 成績</button>` : ""}
          </div>
        </section>

        ${quiz.placementResult ? "" : renderTakeawayCards(quiz)}

        <details class="results-detail" data-results-detail ${resultsDetailOpen ? "open" : ""}>
          <summary><span>詳細分析與逐題回顧</span>${icon("chevron-down")}</summary>
          <div class="results-detail-body">
            ${quiz.mode === "daily" ? renderDailyCompletionResult(quiz, records, accuracy) : ""}
            ${renderSpeedResultCard(speedInsight)}
            ${renderMistakeClearResult(quiz)}
            ${pathResult ? renderPathLessonResult(pathResult) : ""}
            ${quiz.examMode ? renderExamAnalysisSection(examAnalysis) : ""}
            <div class="results-detail-grid">
              <section class="panel">
                <h3>題型表現</h3>
                <div class="topic-meter">
                  ${Object.entries(TOPICS)
                    .filter(([key]) => key !== "all")
                    .map(([key, topic]) => {
                      const stat = topicStats[key] || { correct: 0, total: 0 };
                      const pct = stat.total ? Math.round((stat.correct / stat.total) * 100) : 0;
                      return `<div class="meter-row"><span>${topic.label}</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:${topic.accent}"></div></div><strong>${stat.correct}/${stat.total}</strong></div>`;
                    })
                    .join("")}
                </div>
              </section>
              <section class="panel">
                <h3>本機最佳</h3>
                <div class="topic-meter">
                  <div class="meter-row"><span>最高分</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, records.bestScore || 0)}%"></div></div><strong>${records.bestScore || 0}</strong></div>
                  <div class="meter-row"><span>最佳連勝</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (records.bestStreak || 0) * 10)}%"></div></div><strong>${records.bestStreak || 0}</strong></div>
                  <div class="meter-row"><span>局數</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (records.attempts || 0) * 8)}%"></div></div><strong>${records.attempts || 0}</strong></div>
                </div>
              </section>
              ${
                focusModeOn()
                  ? ""
                  : `<section class="panel">
                <h3>本局成就</h3>
                <div class="achievement-list">
                  ${
                    unlocked.length
                      ? unlocked.map((item) => `<div class="achievement is-new"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div>`).join("")
                      : `<div class="empty-state">本局沒有新成就。</div>`
                  }
                </div>
              </section>`
              }
            </div>
            <section class="panel">
              <h3>答題回顧</h3>
              <div class="review-list">
                ${
                  quiz.answers.length
                    ? quiz.answers.map((answer, index) => renderReviewItem(answer, index, records)).join("")
                    : `<div class="empty-state">本局尚未作答。</div>`
                }
              </div>
            </section>
          </div>
        </details>
      </main>
    `;
  }

  function pathGateResult(currentQuiz, correct, total) {
    const gate = currentQuiz.pathGate || {};
    return {
      ...gate,
      correct,
      total,
      passed: currentQuiz.answers.length >= total && correct >= gate.required
    };
  }

  function renderDailyCompletionResult(currentQuiz, records, accuracy) {
    const streak = dailyCompletionStreak(records);
    const goal = dailyGoal(records);
    return `
      <div class="daily-complete-result">
        <div>
          <strong>今日完成</strong>
          <span>${currentQuiz.answers.length}/${goal} 題 · ${accuracy}%</span>
        </div>
        <div>
          <strong>${streak} 天</strong>
          <span>streak 已延續</span>
        </div>
      </div>
    `;
  }

  function renderSpeedResultCard(text) {
    if (!text) return "";
    return `
      <div class="speed-result-card">
        <strong>速度定位</strong>
        <span>${escapeHtml(text)}</span>
      </div>
    `;
  }

  function renderMistakeClearResult(currentQuiz) {
    const cleared = Number(currentQuiz.mistakesCleared || 0);
    if (!cleared) return "";
    return `
      <div class="mistake-clear-result">
        <strong>錯題清理</strong>
        <span>本輪移出錯題本 ${cleared} 題</span>
      </div>
    `;
  }

  function pathLessonResult(currentQuiz, records, accuracy) {
    const path = learningPathState(records);
    const node = path.nodes.find((item) => item.id === currentQuiz.pathNodeId);
    if (!node) return null;
    const index = path.nodes.findIndex((item) => item.id === node.id);
    const nextNode = path.nodes[index + 1] || null;
    const run = records.pathLessonRuns?.[node.id] || {};
    return {
      node,
      nextNode,
      accuracy,
      correct: currentQuiz.answers.filter((answer) => answer.correct).length,
      total: currentQuiz.problems.length,
      needed: Math.max(0, Math.ceil(currentQuiz.problems.length * 0.7) - currentQuiz.answers.filter((answer) => answer.correct).length),
      mastery: node.mastery,
      cleared: Boolean(run.cleared || accuracy >= 70),
      bestAccuracy: run.bestAccuracy || accuracy
    };
  }

  function renderPathLessonResult(result) {
    const progress = Math.max(0, Math.min(100, result.mastery));
    const gold = result.cleared && result.accuracy >= 90;
    const title = gold ? "金牌" : result.cleared ? "過關" : "再加強";
    const note = result.cleared
      ? result.nextNode
        ? `下一關：${result.nextNode.label}`
        : "主線完成"
      : `差 ${result.needed || 1} 題過關，建議重練一次`;
    return `
      <div class="path-lesson-result ${result.cleared ? "is-cleared" : "is-review"} ${gold ? "is-gold" : ""}">
        <div class="lesson-result-badge">
          <strong>${title}</strong>
          <span>${result.accuracy}%</span>
        </div>
        <div class="lesson-result-main">
          <strong>${escapeHtml(result.node.label)}</strong>
          <span>${escapeHtml(note)}</span>
          <div class="meter-track"><div class="meter-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="lesson-result-stats">
          <div><span>本局</span><strong>${result.correct}/${result.total}</strong></div>
          <div><span>熟練</span><strong>${result.mastery}%</strong></div>
          <div><span>最佳</span><strong>${result.bestAccuracy}%</strong></div>
        </div>
      </div>
    `;
  }

  function examResultMomentum(currentQuiz, accuracy, correct, total) {
    const prefix = currentQuiz.examTimedOut ? "時間到交卷。" : "已交卷。";
    if (accuracy >= 85) return `${prefix}大考題組 ${correct}/${total}，可以開始挑戰更長題組。`;
    if (accuracy >= 65) return `${prefix}大考題組 ${correct}/${total}，先回看錯題分布。`;
    return `${prefix}大考題組 ${correct}/${total}，建議先補同類型題再重考。`;
  }

  function resultMomentum(accuracy, avgTime, pathResult, gateResult) {
    if (gateResult) {
      if (gateResult.passed) return "跳關門檻已達成，現在可以直接進入該關。";
      return `小測驗需要 ${gateResult.required}/${gateResult.total}，這次是 ${gateResult.correct}/${gateResult.total}。`;
    }
    if (pathResult) {
      if (pathResult.cleared && pathResult.nextNode) return `已清掉 ${pathResult.node.label}，下一格是 ${pathResult.nextNode.label}。`;
      if (pathResult.cleared) return "主線最後一關已完成，可以改打 Boss 或 Proof Lab。";
      return `本關門檻是 70%，這次 ${accuracy}%。先重練錯題會最快。`;
    }
    if (accuracy >= 90) return `穩。平均 ${avgTime}s，下一局可以提高難度。`;
    if (accuracy >= 70) return `可以進下一輪。平均 ${avgTime}s，錯題會進本機紀錄。`;
    return "先把錯題撿回來，系統會優先安排弱點。";
  }

  function renderResultsActions(gateResult, pathResult) {
    if (!gateResult && !pathResult && quiz && quiz.placementResult) {
      return `
        <div class="action-row">
          <button class="button" data-action="home">${icon("play")}回主線開打</button>
          <button class="button secondary" data-action="start-placement">${icon("refresh")}重新定位</button>
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>
      `;
    }
    if (!gateResult && !pathResult && quiz && quiz.namedExam) {
      return `
        <div class="action-row">
          <button class="button" data-action="start-named-exam" data-exam-id="${escapeAttr(quiz.namedExam.id)}">${icon("refresh")}再考一份新卷</button>
          <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>
      `;
    }
    if (gateResult) {
      return `
        <div class="action-row">
          ${
            gateResult.passed
              ? `<button class="button" data-action="start-path-lesson" data-node-id="${escapeAttr(gateResult.targetId)}">${icon("play")}進入本關</button>`
              : `<button class="button" data-action="start-path-gate" data-node-id="${escapeAttr(gateResult.targetId)}">${icon("refresh")}重考小測驗</button>`
          }
          <button class="button secondary" data-action="home">${icon("home")}回主線</button>
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>
      `;
    }
    if (pathResult) {
      const primaryAction = pathResult.cleared
        ? pathResult.nextNode
          ? `<button class="button" data-action="start-path-node" data-node-id="${escapeAttr(pathResult.nextNode.id)}">${icon("play")}下一關</button>`
          : `<button class="button" data-action="home">${icon("home")}看主線</button>`
        : `<button class="button" data-action="start-path-lesson" data-node-id="${escapeAttr(pathResult.node.id)}">${icon("refresh")}重練本關</button>`;
      return `
        <div class="action-row">
          ${primaryAction}
          ${pathResult.cleared ? `<button class="button secondary" data-action="start-path-lesson" data-node-id="${escapeAttr(pathResult.node.id)}">${icon("repeat")}再練一次</button>` : ""}
          ${pathResult.nextNode || !pathResult.cleared ? `<button class="button ghost" data-action="home">${icon("home")}回主線</button>` : ""}
        </div>
      `;
    }
    return `
      <div class="action-row">
        <button class="button" data-action="restart">${icon("refresh")}再打一局</button>
        <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
        <button class="button secondary" data-action="open-mistakes">${icon("book")}錯題本</button>
      </div>
    `;
  }

  function renderExamAnalysisSection(analysis) {
    if (!analysis) return "";
    return `
      <section class="panel exam-analysis-panel">
        <div class="exam-analysis-head">
          <div>
            <p class="section-label">考試分析</p>
            <h3>大考戰況分析</h3>
            <p class="panel-note">依本份試卷統計速度、錯誤熱區與難度斷點；未作答會算錯，但不列入平均秒數。</p>
          </div>
        </div>
        <div class="exam-insight-grid">
          ${analysis.insights.map(renderExamInsightCard).join("")}
        </div>
        <div class="exam-analysis-grid">
          <div>
            <h4>主題速度 / 正確率</h4>
            ${analysis.topicRows.map(renderExamAnalysisRow).join("") || `<p class="panel-note">尚無資料</p>`}
          </div>
          <div>
            <h4>技巧錯誤熱區</h4>
            ${analysis.tagRows.slice(0, 7).map(renderExamAnalysisRow).join("") || `<p class="panel-note">尚無資料</p>`}
          </div>
          <div>
            <h4>難度層級</h4>
            ${analysis.rankRows.map(renderExamAnalysisRow).join("") || `<p class="panel-note">尚無資料</p>`}
          </div>
        </div>
      </section>
    `;
  }

  function renderExamInsightCard(item) {
    return `
      <article class="exam-insight-card ${item.tone ? `is-${item.tone}` : ""}">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.note)}</small>
      </article>
    `;
  }

  function renderExamAnalysisRow(row) {
    const accuracy = row.total ? Math.round((row.correct / row.total) * 100) : 0;
    const miss = row.total ? Math.round((row.wrong / row.total) * 100) : 0;
    return `
      <div class="exam-analysis-row">
        <div class="exam-analysis-title">
          <span>${escapeHtml(row.label)}</span>
          <small>${row.correct}/${row.total} · 平均 ${formatSeconds(row.avgSec)}</small>
        </div>
        <div class="exam-analysis-bars">
          <div class="meter-track" aria-label="correct rate"><div class="meter-fill" style="width:${accuracy}%"></div></div>
          <div class="meter-track miss-track" aria-label="失誤率"><div class="meter-fill" style="width:${miss}%"></div></div>
        </div>
        <strong>${accuracy}%</strong>
      </div>
    `;
  }

  // Feature 9：逐步解答。三段抽屜：① 該用什麼技巧 → ② 關鍵步驟 → ③ 完整推導。
  // live=true（作答中）時，打開第 ③ 段會把這題標成「借助解答」。
  // 「這題真正關鍵是什麼」——spec 04.8 的 keyIdea。
  //
  // 全庫 1407 題人工撰寫一句話不現實，所以：作者有寫就用作者的；
  // 沒寫就從 skill graph 推導技巧名。後者不是唬爛 —— skill graph 有 100% 覆蓋率
  // 且經過 CI 驗證，「這題考的是 Frullani 積分」是查得出來的事實，
  // 而這個產品本來就是在教「看到題目該用哪個工具」。
  function keyIdeaFor(problem) {
    if (problem.keyIdea) return { text: problem.keyIdea, authored: true };
    if (!window.BuzzSkillGraph) return null;
    try {
      const names = window.BuzzSkillGraph.skillsForProblem(problem)
        .map((id) => window.BuzzSkillGraph.label(id))
        .filter(Boolean)
        .slice(0, 2);
      if (!names.length) return null;
      return { text: `這題考的是${names.join(" + ")}。`, authored: false };
    } catch (_error) {
      return null;
    }
  }

  // 結算後顯示，答對答錯都顯示。這是整個產品裡最便宜也最有效的教學元件：
  // 答對的人確認自己是「看出來」而不是「猜對」，答錯的人拿到一句可以記住的話。
  function renderKeyIdea(problem) {
    const idea = keyIdeaFor(problem);
    if (!idea) return "";
    return `
      <p class="key-idea">
        <span>關鍵</span>
        ${escapeHtml(idea.text)}
      </p>
    `;
  }

  // 作者親自寫的提示才算「題目專屬」。hintsFor() 對沒有作者提示的題目會回傳
  // topic 級的泛用文字 —— 那當第一層「給方向」可以，但**不能冒充第二層**。
  // 把泛用文字當成關鍵步驟端出去，是在假裝我們知道這題怎麼解。
  // 作者寫的提示。罐頭句子在這裡就被擋掉 —— 它們雖然存在於題目物件上，
  // 但「Identify the dominant tool before computing.」這種對整包都成立的句子
  // 不該被當成提示賣給使用者（看提示是要扣分的）。
  // 擋掉之後那些題會退回「關鍵想法 → 機器推導的關鍵步驟 → 完整解法」，
  // 三層都是這一題特有的。清單在 src/kernel/canned_hints.js。
  function authoredHints(problem) {
    if (!Array.isArray(problem.hints)) return [];
    const blocked = window.BuzzCannedHints;
    return problem.hints.filter((hint) => {
      if (!String(hint || "").trim()) return false;
      return !(blocked && blocked.isCanned(hint));
    });
  }

  // 第二層「關鍵步驟」的補充。
  //
  // 作者寫的永遠優先 —— 這裡只在他沒寫的時候出手，而且出手的內容一定是
  // **這一題特有的、機器判定出來的事實**（0/0 型、King's 的常數、比值判別的值…），
  // 不是「先求反導數再代入上下限」那種對每一題都成立、也就是對每一題都沒用的句子。
  //
  // 每一條都經過 tools/validate_derived_hints.js 在 CI 重新驗算。
  // 即使如此還是要在畫面上標明是機器推的 —— 不要讓它看起來像有人背書。
  function derivedHint(problem) {
    if (!window.BuzzDerivedHints) return "";
    if (authoredHints(problem).length >= 2) return "";
    return window.BuzzDerivedHints.textFor(problem.id) || "";
  }

  function renderSolutionStages(problem, options = {}) {
    const live = Boolean(options.live);
    const hints = hintsFor(problem);
    const authored = authoredHints(problem);
    const lead = hints[0] || "先判斷題型，再選最短的工具。";
    // 第二層優先吃作者寫的；作者沒寫時才用機器推導的事實補。
    const authoredSteps = authored.slice(1);
    const derived = authoredSteps.length ? "" : derivedHint(problem);
    const steps = authoredSteps;
    const techniqueTags = (problem.tags || [])
      .filter((tag) => !META_ANALYSIS_TAGS.has(tag))
      .slice(0, 3)
      .map(tagLabel);
    return `
      <div class="solution-stages" data-solution-stages>
        <details class="solution-stage">
          <summary><span class="stage-index">①</span>該用什麼技巧</summary>
          <div class="stage-body">
            <p>${escapeHtml(lead)}</p>
            ${techniqueTags.length ? `<div class="stage-tags">${techniqueTags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
          </div>
        </details>
        <details class="solution-stage ${steps.length || derived ? "" : "is-empty"}">
          <summary><span class="stage-index">②</span>關鍵步驟${steps.length || derived ? "" : `<small class="stage-cost">這題沒有</small>`}</summary>
          <div class="stage-body">
            ${
              steps.length
                ? `<ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`
                : derived
                  ? `<p>${escapeHtml(derived)}</p>
                     <p class="stage-derived">這一條是系統從題目本身算出來的，不是作者寫的。</p>`
                  : `<p>這題還沒有寫專屬的關鍵步驟。直接看完整推導，別在這裡浪費時間。</p>`
            }
          </div>
        </details>
        <details class="solution-stage is-full" ${live ? `data-live-solution="1"` : ""} data-problem-id="${escapeAttr(problem.id)}">
          <summary><span class="stage-index">③</span>完整推導${live ? `<small class="stage-cost">會記為「借助解答」</small>` : ""}</summary>
          <div class="stage-body">
            ${renderSolutionBody(problem)}
            <p class="stage-answer">參考答案：${escapeHtml(displayAnswer(problem))}</p>
          </div>
        </details>
      </div>
    `;
  }

  // 完整推導：有結構化步驟就照步驟列，沒有就照舊顯示那一段文字。
  //
  // 為什麼要分這兩種：一句話的推導（「用 1−cos x 約等於 x²/2」）對已經會的人
  // 是提醒，對不會的人是天書。有步驟的話，卡在第幾步是看得出來的。
  //
  // 目前只有模板變體與少數題目寫了 solutionSteps —— 其餘 1300 多題
  // 的一句話推導是還沒補的內容工作，不是程式問題。這裡不會拿
  // 「把一句話硬切成三句」來假裝有步驟。
  function renderSolutionBody(problem) {
    const steps = Array.isArray(problem.solutionSteps) ? problem.solutionSteps.filter(Boolean) : [];
    if (steps.length >= 2) {
      return `<ol class="solution-steps">${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
    }
    return `<p>${escapeHtml(problem.solution || "這題還沒有完整推導，先照上面的步驟走。")}</p>`;
  }

  function markSolutionAssisted(problemId) {
    if (!quiz || view !== "quiz" || !problemId) return;
    const answer = quiz.answers.slice().reverse().find((item) => item.problem.id === problemId);
    if (!answer || answer.assisted) return;
    answer.assisted = true;
    trackEvent("open_full_solution", {
      mode: quiz.mode,
      topic: answer.problem.topic,
      problem_id: problemId
    });
  }

  function renderReviewItem(answer, index, records) {
    const item = answer.problem;
    return `
      <article class="review-item ${answer.correct ? "is-correct" : "is-wrong"}">
        <div class="review-top">
          <span>#${index + 1} · ${TOPICS[item.topic].label} · ${answer.unanswered ? "未作答" : `${answer.elapsed}s`}${answer.assisted ? ` <span class="assist-chip">借助解答</span>` : ""}</span>
          <strong>${answer.correct ? "正確" : answerReasonLabel(answer.reason)}</strong>
        </div>
        <div class="review-prompt math-block" data-tex="${escapeAttr(item.prompt)}"></div>
        ${
          answer.boardStrokes && answer.boardStrokes.length
            ? `<canvas class="review-board" data-review-board="${index}" data-surface="${boardSurface()}" aria-label="手寫草稿回顧"></canvas>`
            : ""
        }
        <div class="review-answer">
          你的答案：${escapeHtml(answer.input || "未作答")}<br />
          提示使用：${answer.hintsUsed || 0}<br />
          參考答案：${escapeHtml(displayAnswer(item))}
        </div>
        ${renderKeyIdea(item)}
        ${renderSolutionStages(item)}
        ${
          answer.correct
            ? ""
            : `<div class="tag-row">${ERROR_TAGS.map((tag) => `<button class="tag-button ${answer.errorTag === tag ? "is-active" : ""}" data-action="tag-answer" data-problem-id="${escapeAttr(item.id)}" data-tag="${escapeAttr(tag)}">${tag}</button>`).join("")}</div>`
        }
        <div class="action-row">
          <button class="button ghost" data-action="toggle-favorite" data-problem-id="${escapeAttr(item.id)}">${icon("star")}${records.favorites?.[item.id] ? "已收藏" : "收藏"}</button>
          <button class="button ghost" data-action="report-problem" data-problem-id="${escapeAttr(item.id)}">${icon("flag")}${records.problemReports?.[item.id] ? "已回報" : "回報"}</button>
        </div>
      </article>
    `;
  }

  function bindEvents() {

    const homeMorePanel = app.querySelector("[data-home-more-panel]");
    if (homeMorePanel) {
      homeMorePanel.addEventListener("toggle", () => {
        homeMoreOpen = homeMorePanel.open;
      });
    }

    const sessionSettings = app.querySelector("[data-session-settings]");
    if (sessionSettings) {
      sessionSettings.addEventListener("toggle", () => {
        sessionSettingsOpen = sessionSettings.open;
      });
    }

    const advancedModeDrawer = app.querySelector("[data-advanced-mode-drawer]");
    if (advancedModeDrawer) {
      advancedModeDrawer.addEventListener("toggle", () => {
        advancedModeOpen = advancedModeDrawer.open;
      });
    }

    const resultsDetail = app.querySelector("[data-results-detail]");
    if (resultsDetail) {
      resultsDetail.addEventListener("toggle", () => {
        resultsDetailOpen = resultsDetail.open;
      });
    }

    app.querySelectorAll("[data-proof-step]").forEach((details) => {
      details.addEventListener("toggle", () => {
        const key = details.dataset.proofStep || "";
        if (!key) return;
        if (details.open) openProofSteps.add(key);
        else openProofSteps.delete(key);
      });
    });

    // Feature 9：作答中打開「完整推導」→ 標記借助解答（只在 quiz 畫面生效）。
    app.querySelectorAll("[data-live-solution]").forEach((details) => {
      details.addEventListener("toggle", () => {
        if (details.open) markSolutionAssisted(details.dataset.problemId || "");
      });
    });

    // History reviews carry lots of KaTeX; typeset each one lazily the first
    // time its <details> is opened instead of all sessions up front.
    app.querySelectorAll("[data-history-detail]").forEach((details) => {
      details.addEventListener("toggle", () => {
        if (!details.open || details.dataset.mathReady) return;
        details.dataset.mathReady = "1";
        details.querySelectorAll(".math-block-lazy").forEach((node) => {
          node.classList.remove("math-block-lazy");
          node.classList.add("math-block");
          renderMathNode(node, true);
        });
      });
    });

    app.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedMode = button.dataset.mode;
        if (selectedMode === "topic" && selectedTopic === "all") selectedTopic = "limits";
        render();
      });
    });

    app.querySelectorAll("[data-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTopic = button.dataset.topic;
        render();
      });
    });

    app.querySelectorAll("[data-answer-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedAnswerMode = button.dataset.answerMode;
        render();
      });
    });

    const difficultyInput = app.querySelector("[data-difficulty-cap]");
    if (difficultyInput) {
      difficultyInput.addEventListener("change", () => setDifficultyCap(difficultyInput.value));
      difficultyInput.addEventListener("input", () => {
        selectedDifficultyCap = normalizeDifficultyCap(difficultyInput.value);
      });
    }

    app.querySelectorAll("[data-pack]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedPack = button.dataset.pack;
        render();
      });
    });

    const packSelect = app.querySelector("[data-pack-select]");
    if (packSelect) {
      packSelect.addEventListener("change", () => {
        selectedPack = packSelect.value || "all";
        render();
      });
    }

    app.querySelectorAll("[data-mistake-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedMistakeTopic = button.dataset.mistakeTopic;
        render();
      });
    });

    app.querySelectorAll("[data-history-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedHistoryTopic = button.dataset.historyTopic;
        render();
      });
    });

    app.querySelectorAll("[data-proof-tier]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedProofTier = button.dataset.proofTier || "all";
        render();
      });
    });

    app.querySelectorAll("[data-library-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedLibraryTopic = button.dataset.libraryTopic || "all";
        resetLibraryPaging();
        render();
      });
    });

    app.querySelectorAll("[data-library-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedLibraryFilter = button.dataset.libraryFilter || "all";
        resetLibraryPaging();
        render();
      });
    });

    const librarySearchInput = app.querySelector("[data-library-search]");
    if (librarySearchInput) {
      // Debounced: a full render per keystroke makes typing laggy.
      librarySearchInput.addEventListener("input", () => {
        librarySearch = librarySearchInput.value || "";
        librarySearchShouldFocus = true;
        resetLibraryPaging();
        if (librarySearchTimer && window.clearTimeout) window.clearTimeout(librarySearchTimer);
        librarySearchTimer = window.setTimeout(() => {
          librarySearchTimer = null;
          render();
        }, 200);
      });
    }

    const libraryPackSelect = app.querySelector("[data-library-pack-select]");
    if (libraryPackSelect) {
      libraryPackSelect.addEventListener("change", () => {
        selectedLibraryPack = libraryPackSelect.value || "all";
        resetLibraryPaging();
        render();
      });
    }

    const libraryRankSelect = app.querySelector("[data-library-rank-select]");
    if (libraryRankSelect) {
      libraryRankSelect.addEventListener("change", () => {
        selectedLibraryRank = libraryRankSelect.value || "all";
        resetLibraryPaging();
        render();
      });
    }

    const importInput = app.querySelector("#import-records");
    if (importInput) {
      importInput.addEventListener("change", () => importRecords(importInput.files && importInput.files[0]));
    }

    // 成績代碼欄位：點一下全選，沒有 clipboard API 也能手動複製。
    app.querySelectorAll("[data-select-on-focus]").forEach((input) => {
      input.addEventListener("focus", () => {
        if (typeof input.select === "function") input.select();
      });
    });

    // 出題工作坊表單：打字只更新草稿（不重渲染，避免失焦）；
    // 題目欄同步刷新 KaTeX 預覽；換作答型態才需要整頁重畫。
    app.querySelectorAll("[data-creator-field]").forEach((input) => {
      const apply = () => {
        activeCreatorDraft()[input.dataset.creatorField] = input.value;
      };
      input.addEventListener("input", () => {
        apply();
        if (input.dataset.creatorField === "prompt") updateCreatorPreview();
      });
      input.addEventListener("change", () => {
        apply();
        if (input.dataset.creatorField === "answerKind") render();
      });
    });

    // [data-action] 改用委派，監聽器在 setupActionDelegation() 綁一次就好。
    //
    // 原本是每次 render 之後把畫面上**每一個** [data-action] 各綁一次 ——
    // 題庫頁一次就是好幾百個。那是每一次重繪都要付的固定成本，
    // 而且讓「只更新一小塊 DOM」變成不可能（新節點沒有監聽器）。

    // 作圖表的每一格：改動時寫進 quiz.worksheet，並同步 quiz.draft ——
    // 下游的紀錄、錯題本、attemptLog 都吃 quiz.draft，同步了就不用改它們。
    app.querySelectorAll("[data-ws-field]").forEach((node) => {
      node.addEventListener("input", () => {
        const current = getCurrentProblem();
        if (!quiz || !current) return;
        worksheetDraft(current)[node.dataset.wsField] = node.value;
        quiz.draft = serializeWorksheet(current);
      });
    });

    const form = app.querySelector('[data-action="submit-answer"]');
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitCurrentAnswer();
      });
    }

    const input = app.querySelector("#answer");
    if (input) {
      const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (!(quiz && quiz.answerMode === "free" && coarsePointer)) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
      input.addEventListener("input", () => {
        if (quiz) {
          quiz.draft = input.value;
          updateAnswerPreview(input.value);
        }
      });
      // 觸控裝置上系統鍵盤被壓掉了（inputmode="none"），所以「點輸入框」
      // 必須要能把畫面上的數學鍵盤叫出來 —— 不然全螢幕書寫時
      // 輸入框在那裡卻沒有任何方式可以打字。
      // 這是使用者本來就會做的動作：點你要打字的地方，鍵盤就出現。
      input.addEventListener("focus", () => {
        if (!quiz || quiz.keypadOpen) return;
        if (quiz.systemKeyboard) return;
        if (!coarsePointer) return;
        quiz.keypadOpen = true;
        render();
      });
    }

    app.querySelectorAll("[data-insert]").forEach((button) => {
      button.addEventListener("click", () => insertToken(button.dataset.insert));
    });

    app.querySelectorAll("[data-insert-example]").forEach((button) => {
      button.addEventListener("click", () => replaceAnswerDraft(button.dataset.insertExample || ""));
    });

    setupBlackboard();
    // 進到一題就去問 IndexedDB 有沒有上次的草稿（非同步，拿到才重繪）
    if (view === "quiz" && quiz && quiz.problems) loadPreviousBoard(quiz.problems[quiz.index]);
  }

  function handleAction(event) {
    const actionNode = event.target.closest("[data-action]");
    if (!actionNode) return;
    // 點在對話框「裡面」但冒泡到遮罩上的，不算「點遮罩關閉」。
    //
    // 這個判斷原本靠 event.currentTarget（因為監聽器綁在每一個節點上）。
    // 改成委派之後 currentTarget 永遠是 #app，所以改問一個更直接的問題：
    // 命中的動作節點是不是遮罩本身，而點擊起點是不是在對話框內。
    if (actionNode.classList.contains("modal-backdrop") && event.target.closest("[data-modal]")) {
      return;
    }

    const action = actionNode.dataset.action;
    if (action === "start") startQuiz();
    if (action === "practice-axis") startAxisPractice(actionNode.dataset.axis || "");
    if (action === "show-shortcuts") showAppNotice("__shortcuts__");
    if (action === "jump-question") jumpToQuestion(actionNode.dataset.index);
    if (action === "toggle-flag") toggleQuestionFlag();
    if (action === "practice-similar") startSimilarPractice(actionNode.dataset.problemId || "");
    if (action === "set-pen-scale") setPenScale(actionNode.dataset.scale || "");
    if (action === "copy-problem-link") copyProblemLink(actionNode.dataset.problemId || "");
    if (action === "answer-backspace") backspaceAnswer();
    if (action === "read-ink") readInkAnswer();
    if (action === "start-weakness") startWeaknessPractice();
    if (action === "start-friendly-run") startFriendlyRun();
    if (action === "start-god-run") startGodRun();
    if (action === "dismiss-onboarding") {
      const records = loadRecords();
      records.onboardingSeen = true;
      saveRecords(records);
      render();
    }
    if (action === "set-onboarding-level") applyOnboardingLevel(actionNode.dataset.level || "standard");
    if (action === "start-placement") startPlacementQuiz();
    if (action === "start-named-exam") startNamedExam(actionNode.dataset.examId || "");
    if (action === "start-choice") {
      selectedAnswerMode = "choice";
      selectedMode = "quick";
      startQuiz();
    }
    if (action === "start-planned") startPlannedSession(actionNode.dataset.length || "");
    if (action === "start-daily") {
      startDailyQuiz();
    }
    if (action === "start-daily-one") startDailyOne();
    if (action === "share-daily-one") shareDailyOne();
    if (action === "start-mode") startMode(actionNode.dataset.modeKey || "quick");
    if (action === "start-path-node") openPathIntro(actionNode.dataset.nodeId);
    if (action === "start-path-lesson") startPathLesson(actionNode.dataset.nodeId || activePathNodeId);
    if (action === "start-path-gate") startPathGate(actionNode.dataset.nodeId || activePathNodeId);
    if (action === "choose-answer") submitChoiceAnswer(actionNode.dataset.choice || "");
    if (action === "show-hint") showHint();
    if (action === "toggle-keypad" && quiz) {
      quiz.keypadOpen = !quiz.keypadOpen;
      render();
    }
    if (action === "toggle-system-keyboard" && quiz) {
      quiz.systemKeyboard = !quiz.systemKeyboard;
      // 切回畫面鍵盤時把輸入工具打開 —— 不然按完之後兩種鍵盤都沒有
      if (!quiz.systemKeyboard) quiz.keypadOpen = true;
      render();
      // 切成系統鍵盤時直接把游標放回輸入框，讓鍵盤跳出來，
      // 不要讓使用者按完還要再點一次
      if (quiz.systemKeyboard) {
        window.setTimeout(() => {
          const input = app.querySelector(".answer-input");
          if (input) input.focus();
        }, 60);
      }
    }
    if (action === "skip") recordAnswer({ status: "wrong", reason: "Skipped", input: quiz.draft || "" });
    if (action === "onboarding-next") advanceOnboarding();
    if (action === "set-onboarding-context") setOnboardingContext(actionNode.dataset.context || "freshman");
    if (action === "skip-placement") skipPlacement();
    if (action === "dismiss-backup-notice") dismissBackupNotice();
    if (action === "resume-session") resumeSession();
    if (action === "discard-session") discardSession();
    if (action === "open-insights") {
      view = "insights";
      render();
    }
    if (action === "open-train") {
      if (actionNode.dataset.bucket) selectedBucket = actionNode.dataset.bucket;
      view = "train";
      render();
    }
    if (action === "set-bucket") {
      selectedBucket = actionNode.dataset.bucket || "practice";
      render();
    }
    if (action === "open-mistakes") {
      view = "mistakes";
      render();
    }
    if (action === "open-history") {
      view = "history";
      render();
    }
    if (action === "open-settings") {
      view = "settings";
      render();
    }
    if (action === "open-library") {
      selectedLibraryFilter = "all";
      resetLibraryPaging();
      view = "library";
      render();
    }
    if (action === "open-boss-lab") {
      selectedLibraryFilter = "boss";
      selectedLibraryTopic = "all";
      selectedLibraryPack = "all";
      selectedLibraryRank = "all";
      resetLibraryPaging();
      view = "library";
      render();
    }
    if (action === "library-show-more") {
      libraryVisibleCount += LIBRARY_PAGE_SIZE;
      render();
    }
    if (action === "next-question") advanceToNextQuestion();
    if (action === "dismiss-calibration-preview") {
      calibrationPreview = null;
      render();
      return;
    }
    if (action === "dismiss-notice") {
      appNotice = "";
      render();
    }
    if (action === "open-proofs") {
      view = "proofs";
      render();
    }
    if (action === "open-creator") {
      view = "creator";
      creatorStatus = null;
      render();
    }
    if (action === "creator-new") {
      creatorEditingId = "";
      creatorDraft = defaultCreatorDraft();
      creatorStatus = null;
      render();
    }
    if (action === "creator-save") saveCreatorDraft();
    if (action === "creator-edit") editCustomProblem(actionNode.dataset.problemId);
    if (action === "creator-delete") deleteCustomProblem(actionNode.dataset.problemId);
    if (action === "creator-toggle") toggleCustomProblem(actionNode.dataset.problemId);
    if (action === "creator-copy-link") copyCreatorShare(true);
    if (action === "creator-copy-code") copyCreatorShare(false);
    if (action === "creator-import-decode") decodeCustomImport();
    if (action === "creator-import-confirm") confirmCustomImport();
    if (action === "creator-import-dismiss") {
      creatorImportPreview = null;
      render();
    }
    if (action === "start-custom-practice") startCustomPractice();
    if (action === "view-proof-solution") viewProofSolution(actionNode.dataset.proofId);
    if (action === "mark-proof-status") markProofStatus(actionNode.dataset.proofId, actionNode.dataset.proofStatus || "");
    if (action === "mark-proof-blocker") markProofBlocker(actionNode.dataset.proofId, actionNode.dataset.proofBlocker || "");
    if (action === "start-mistakes") startMistakeQuiz(selectedMistakeTopic);
    if (action === "start-srs-review") startSrsReviewQuiz();
    if (action === "start-skill-refresh") startSkillRefreshQuiz();
    if (action === "start-path-retest") startPathRetestQuiz();
    if (action === "start-mistake-triage") {
      const ids = (actionNode.dataset.problemIds || "").split(",").filter(Boolean);
      if (ids.length) startMistakeQuiz("all", ids);
    }
    if (action === "start-mistake-one") startMistakeQuiz("all", [actionNode.dataset.problemId]);
    if (action === "clear-mistakes") clearMistakes(selectedMistakeTopic);
    if (action === "clear-mistake-one") clearMistakes("all", [actionNode.dataset.problemId]);
    if (action === "tag-mistake") tagMistake(actionNode.dataset.problemId, actionNode.dataset.tag);
    if (action === "tag-answer") tagMistake(actionNode.dataset.problemId, actionNode.dataset.tag);
    if (action === "train-tag") {
      selectedPack = actionNode.dataset.tag || "all";
      selectedTopic = "all";
      selectedMode = "practice";
      startQuiz();
    }
    if (action === "train-pack") {
      selectedPack = actionNode.dataset.pack || "all";
      selectedTopic = "all";
      selectedMode = "quick";
      startQuiz();
    }
    if (action === "start-problem") startSingleProblem(actionNode.dataset.problemId);
    if (action === "start-library-filter") startLibraryFilterPractice();
    if (action === "toggle-favorite") toggleFavorite(actionNode.dataset.problemId);
    if (action === "report-problem") reportProblem(actionNode.dataset.problemId);
    if (action === "set-daily-goal") setDailyGoal(actionNode.dataset.goal);
    if (action === "clear-history") clearHistory();
    if (action === "export-records") exportRecords();
    if (action === "export-calibration") exportCalibrationPack();
    if (action === "toggle-analytics") setAnalyticsEnabled(!analyticsEnabled());
    if (action === "preview-calibration") showCalibrationPreview();
    if (action === "toggle-theme") toggleTheme();
    if (action === "install-app") installApp();
    if (action === "clear-answer") clearAnswerDraft();
    if (action === "show-rules" && quiz) {
      quiz.modal = "rules";
      render();
    }
    if (action === "confirm-exit" && quiz) {
      quiz.modal = "exit";
      render();
    }
    if (action === "close-modal" && quiz) {
      quiz.modal = null;
      render();
    }
    if (action === "finish-now") finishQuiz();
    if (action === "restart") restartQuiz();
    if (action === "home") {
      stopTicker();
      // 刻意不清掉續傳：離開首頁不等於放棄這局，回來還能接著做。
      if (quiz && view === "quiz") {
        autosaveSession(true);
        trackEvent("session_abandon", {
          mode: quiz.mode,
          answered: quiz.answers.length,
          total: quiz.problems.length
        });
      }
      quiz = null;
      activePathNodeId = "";
      if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
      view = "home";
      render();
    }
    if (action === "reset-records") {
      // 不再直接刪。刪除是不可逆的，而這個按鈕就在「匯出」旁邊 ——
      // 手滑一次就沒了，而且使用者連自己刪掉了什麼都不知道。
      eraseConfirm = true;
      render();
    }
    if (action === "print-mistakes") printMistakes();
    if (action === "toggle-focus-mode") setFocusMode(!focusModeOn());
    if (action === "apply-update") applyPendingUpdate();
    if (action === "dismiss-update") {
      pendingUpdate = null;
      render();
    }
    if (action === "cancel-report") {
      reportDraft = null;
      render();
    }
    if (action === "set-report-reason" && reportDraft) {
      reportDraft = { ...reportDraft, reason: actionNode.dataset.reason || reportDraft.reason };
      render();
    }
    if (action === "submit-report-github") submitReportToGithub();
    if (action === "copy-report") copyReportText();
    if (action === "cancel-erase") {
      eraseConfirm = false;
      render();
    }
    if (action === "confirm-erase") {
      eraseConfirm = false;
      const removed = eraseEverything();
      showAppNotice(`已刪除：${removed.join("、")}。這台裝置上不再有你的練習資料。`);
    }
    if (action === "sync-now") syncNow();
  }

  function startDailyQuiz() {
    const records = loadRecords();
    const mode = MODES.daily;
    selectedMode = "daily";
    selectedPack = "all";
    selectedTopic = "all";
    selectedAnswerMode = "choice";
    startQuiz(selectProblemPool({ ...mode, count: dailyGoal(records) }, "all"), { modeKey: "daily" });
  }

  function startFriendlyRun() {
    const records = loadRecords();
    selectedDifficultyCap = 2;
    records.settings.difficultyCap = selectedDifficultyCap;
    records.onboardingSeen = true;
    saveRecords(records);
    selectedMode = "quick";
    selectedPack = "beginner_warmup";
    selectedTopic = "all";
    selectedAnswerMode = "choice";
    startQuiz();
  }

  function startGodRun() {
    const records = loadRecords();
    selectedDifficultyCap = 6;
    records.settings.difficultyCap = selectedDifficultyCap;
    records.onboardingSeen = true;
    saveRecords(records);
    selectedMode = "brutal";
    selectedPack = "nightmare_boss";
    selectedTopic = "all";
    selectedAnswerMode = "free";
    startQuiz();
  }

  function startMode(modeKey) {
    const mode = MODES[modeKey] || MODES.quick;
    selectedMode = modeKey;
    selectedAnswerMode = mode.forceAnswerMode || (modeKey === "cooldown" ? "free" : "choice");
    selectedPack = "all";
    selectedTopic = "all";
    if (mode.integralBee) selectedTopic = "integrals";
    if (mode.cooldown) {
      startQuiz(selectCooldownPool(mode.count), { modeKey, practice: true, noTimer: true });
      return;
    }
    startQuiz(null, {
      modeKey,
      noTimer: Boolean(mode.noTimer),
      noHint: Boolean(mode.noHint),
      survival: Boolean(mode.survival),
      suddenDeath: Boolean(mode.suddenDeath),
      accuracyMode: Boolean(mode.accuracyMode),
      pressureMode: Boolean(mode.pressureMode),
      examMode: Boolean(mode.exam),
      examDurationSec: mode.examDurationSec || 0,
      answerMode: mode.forceAnswerMode || selectedAnswerMode
    });
  }

  function applyOnboardingLevel(level) {
    const config = ONBOARDING_LEVELS[level] || ONBOARDING_LEVELS.standard;
    const records = loadRecords();
    records.onboardingSeen = true;
    records.onboardingLevel = level;
    records.settings.difficultyCap = normalizeDifficultyCap(config.difficultyCap || DEFAULT_DIFFICULTY_CAP);
    saveRecords(records);
    selectedDifficultyCap = records.settings.difficultyCap;
    selectedPack = config.pack;
    selectedMode = config.mode;
    selectedTopic = config.topic;
    selectedAnswerMode = "choice";
    if (config.mode === "daily") {
      startDailyQuiz();
      return;
    }
    startMode(config.mode);
  }

  function startSingleProblem(problemId) {
    const problem = problemById(problemId);
    if (!problem) return;
    selectedMode = "practice";
    selectedTopic = problem.topic || "all";
    startQuiz([problem], { modeKey: "practice", practice: true, noTimer: true });
  }

  // ---- 每日一題（Wordle 式）：全站同一題，一天一次正式機會 ----
  const SITE_URL = "https://tudohuang.github.io/BuzzCalculus/";

  function dailyOneDateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function pickDailyOneProblem(dateKey = dailyOneDateKey()) {
    // 已釘選的歷史日期直接查表（tools/pin_daily_one.js 產生）。
    // 種子洗牌是對「整個題池」洗 —— 題庫一成長，過去所有日期全部重排。
    // 表裡的日期永不改寫，「昨天那題」才有穩定的答案。
    const pinned = ((typeof window !== "undefined" && window.BUZZ_DAILY_ONE_HISTORY) || {})[dateKey];
    if (pinned) {
      const fixed = problemById(pinned);
      if (fixed) return fixed;
    }
    // 題目完全由日期種子決定，所有人同一天拿到同一題（R3-5，避開看圖題）。
    const pool = problems.filter((problem) => {
      const rank = problemRank(problem);
      return rank >= 3 && rank <= 5 && !problem.graph;
    });
    const source = pool.length ? pool : problems;
    return shuffle(source, seedFromString(`buzz-daily-one-${dateKey}`))[0] || null;
  }

  function startDailyOne() {
    const records = loadRecords();
    const dateKey = dailyOneDateKey();
    if (records.dailyOne[dateKey]) {
      shareDailyOne();
      return;
    }
    const problem = pickDailyOneProblem(dateKey);
    if (!problem) return;
    const prevMode = selectedMode;
    selectedMode = "quick";
    startQuiz([problem], { modeKey: "daily_one", practice: false, dailyOne: { dateKey } });
    selectedMode = prevMode;
  }

  function renderDailyOneBadge(records) {
    const entry = records && records.dailyOne ? records.dailyOne[dailyOneDateKey()] : null;
    if (!entry) return "今日未解";
    return entry.correct ? "✅ 已解" : "❌ 已試";
  }

  function dailyOneStreak(records) {
    let streak = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    let cursor = Date.now();
    // 今天還沒解就從昨天開始算，讓早上看首頁時連勝不會歸零。
    if (!(records.dailyOne[dailyOneDateKey(new Date(cursor))] || {}).correct) cursor -= dayMs;
    while (true) {
      const entry = records.dailyOne[dailyOneDateKey(new Date(cursor))];
      if (!entry || !entry.correct) break;
      streak += 1;
      cursor -= dayMs;
    }
    return streak;
  }

  function dailyOneEmoji(entry) {
    if (!entry) return "";
    if (!entry.correct) return entry.reason === "Timeout" ? "⏰🟥" : "🟥";
    const problem = problemById(entry.problemId);
    const limit = problem ? problem.timeLimit : 0;
    let text = "🟩";
    if (limit && entry.elapsed <= limit / 3) text += "⚡";
    if (entry.hintsUsed) text += `💡x${entry.hintsUsed}`;
    return text;
  }

  function renderDailyOneOutcomePanel(outcome) {
    const problem = problemById(outcome.problemId);
    return `
      <div class="daily-one-outcome ${outcome.correct ? "is-win" : "is-loss"}" data-enter>
        <strong>每日一題 ${escapeHtml(outcome.dateKey)}：${dailyOneEmoji(outcome)} ${outcome.correct ? `${outcome.elapsed}s 解決` : "明天再來"}</strong>
        <p>${problem ? `R${problemRank(problem)} · ` : ""}${outcome.streak > 1 ? `🔥 已連續答對 ${outcome.streak} 天` : outcome.correct ? "連勝開張，明天繼續" : "連勝中斷，明天重新累積"}</p>
      </div>
    `;
  }

  function shareDailyOne() {
    const records = loadRecords();
    const dateKey = dailyOneDateKey();
    const entry = records.dailyOne[dateKey];
    if (!entry) return;
    const problem = problemById(entry.problemId);
    const streak = dailyOneStreak(records);
    const lines = [
      `BuzzCalculus 每日一題 ${dateKey}`,
      `${dailyOneEmoji(entry)}${entry.correct ? ` ${entry.elapsed}s` : ""}${problem ? ` · R${problemRank(problem)}` : ""}${entry.correct && !entry.hintsUsed ? " · 無提示" : ""}`,
      streak > 1 ? `🔥 連續 ${streak} 天` : "",
      SITE_URL
    ].filter(Boolean);
    copyPlainText(lines.join("\n"), "emoji 成績卡已複製，貼到群組炫耀吧！");
  }

  function copyPlainText(text, okMessage) {
    const nav = window.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
      Promise.resolve(nav.clipboard.writeText(text))
        .then(() => showAppNotice(okMessage || "已複製。"))
        .catch(() => showAppNotice("一鍵複製失敗，請截圖分享。"));
      return;
    }
    showAppNotice("這個瀏覽器不支援一鍵複製。");
  }

  function startLibraryFilterPractice() {
    const records = loadRecords();
    const pool = libraryProblems(records);
    if (!pool.length) return;
    selectedMode = "practice";
    selectedTopic = selectedLibraryTopic || "all";
    selectedPack = "all";
    const ordered = adaptiveShuffle(pool, records, seedFromString(`${Date.now()}-library-filter`));
    startQuiz(padPool(ordered.slice(0, 12), pool, Math.min(12, pool.length), { records }), {
      modeKey: "practice",
      practice: true,
      noTimer: true
    });
  }

  function toggleFavorite(problemId) {
    if (!problemById(problemId)) return;
    const records = loadRecords();
    if (records.favorites[problemId]) {
      delete records.favorites[problemId];
    } else {
      records.favorites[problemId] = { problemId, addedAt: new Date().toISOString() };
    }
    saveRecords(records);
    render();
  }

  // 回報題目
  //
  // 舊版的「回報」只把一筆紀錄寫進**使用者自己的 localStorage**，就結束了。
  // 使用者按了、看到按鈕變成「已回報」、以為講了 —— 而作者永遠不會收到。
  // 那比沒有回報按鈕更糟：它製造了「已經反映過」的錯覺，錯題會錯到下一屆。
  //
  // 沒有後端也能把它送出去：整理成一份可讀的文字，讓使用者選擇
  // 開 GitHub issue 或複製走。送什麼、送不送，都在他自己手上 ——
  // 這也是唯一不違反「沒有伺服器收你的資料」這句承諾的做法。

  const REPORT_REASONS = [
    { key: "wrong-answer", label: "答案好像有誤" },
    { key: "unclear", label: "題目看不懂" },
    { key: "typo", label: "排版或錯字" },
    { key: "other", label: "其他" }
  ];

  const REPO_URL = "https://github.com/tudohuang/BuzzCalculus";

  function reportProblem(problemId) {
    if (!problemById(problemId)) return;
    reportDraft = { problemId, reason: "wrong-answer" };
    render();
  }

  // 回報的內容一律先攤開給使用者看。這裡組出來的字串，
  // 就是待會兒複製或帶進 GitHub issue 的那一份，不是另外寫的說明。
  function buildReportText(problemId, reasonKey) {
    const problem = problemById(problemId);
    if (!problem) return "";
    const reason = REPORT_REASONS.find((item) => item.key === reasonKey) || REPORT_REASONS[0];
    const lines = [
      `題號：${problem.id}`,
      `題目：${problem.prompt}`,
      `參考答案：${displayAnswer(problem)}`,
      `難度：R${problem.rank}`,
      `問題類型：${reason.label}`,
      "",
      "說明（請補充你看到的狀況）：",
      "",
      "",
      `— ${APP_VERSION} · ${BUILD_DATE}`
    ];
    return lines.join("\n");
  }

  function markReported(problemId, reasonKey) {
    const records = loadRecords();
    records.problemReports = records.problemReports || {};
    const previous = records.problemReports[problemId] || {};
    records.problemReports[problemId] = {
      problemId,
      count: (previous.count || 0) + 1,
      reportedAt: new Date().toISOString(),
      reason: reasonKey || "needs-review"
    };
    saveRecords(records);
    trackEvent("report_submit", { problem_id: problemId, reason: reasonKey || "" });
  }

  function submitReportToGithub() {
    if (!reportDraft) return;
    const { problemId, reason } = reportDraft;
    const problem = problemById(problemId);
    if (!problem) return;
    const title = `題目回報：${problem.id}`;
    const url =
      `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}` +
      `&body=${encodeURIComponent(buildReportText(problemId, reason))}`;
    markReported(problemId, reason);
    reportDraft = null;
    render();
    window.open(url, "_blank", "noopener");
  }

  function copyReportText() {
    if (!reportDraft) return;
    const { problemId, reason } = reportDraft;
    markReported(problemId, reason);
    const text = buildReportText(problemId, reason);
    reportDraft = null;
    render();
    copyPlainText(text, "回報內容已複製。貼到 GitHub issue 或直接寄給我們都可以。");
  }

  function renderReportModal() {
    if (!reportDraft) return "";
    const problem = problemById(reportDraft.problemId);
    if (!problem) return "";
    const text = buildReportText(reportDraft.problemId, reportDraft.reason);
    return `
      <div class="modal-backdrop" data-action="cancel-report">
        <div class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title" data-modal>
          <h3 id="report-title">回報這一題</h3>
          <p class="report-lead">
            這個網站沒有伺服器收你的訊息，所以回報是<strong>你自己送出</strong>的 ——
            下面就是會送出去的完整內容，你可以先看過。
          </p>
          <div class="report-reasons" role="group" aria-label="問題類型">
            ${REPORT_REASONS.map(
              (item) => `
                <button class="tag-button ${reportDraft.reason === item.key ? "is-active" : ""}"
                  type="button" data-action="set-report-reason" data-reason="${escapeAttr(item.key)}"
                  aria-pressed="${reportDraft.reason === item.key ? "true" : "false"}">${escapeHtml(item.label)}</button>`
            ).join("")}
          </div>
          <pre class="report-preview">${escapeHtml(text)}</pre>
          <div class="action-row">
            <button class="button home-primary" data-action="submit-report-github">${icon("flag")}開 GitHub issue</button>
            <button class="button secondary" data-action="copy-report">${icon("copy")}複製內容</button>
            <button class="button" data-action="cancel-report">${icon("x")}取消</button>
          </div>
        </div>
      </div>
    `;
  }

  function setDailyGoal(value) {
    const goal = Number(value);
    if (![5, 10, 12, 20].includes(goal)) return;
    const records = loadRecords();
    records.settings.dailyTarget = goal;
    saveRecords(records);
    render();
  }

  function setDifficultyCap(value) {
    selectedDifficultyCap = normalizeDifficultyCap(value);
    const records = loadRecords();
    records.settings.difficultyCap = selectedDifficultyCap;
    saveRecords(records);
    render();
  }

  function startMistakeQuiz(topic, problemIds) {
    const records = loadRecords();
    const ids = problemIds && problemIds.length
      ? problemIds
      : Object.values(records.mistakes || {})
          .filter((item) => topic === "all" || problemById(item.problemId)?.topic === topic)
          .map((item) => item.problemId);
    let pool = ids.map(problemById).filter(Boolean);
    if (!pool.length) return;
    const cap = (MODES.mistakes && MODES.mistakes.count) || pool.length;
    if (pool.length > cap) {
      // Due-first (SRS), then highest-pressure, when the pool exceeds the session cap.
      const now = Date.now();
      pool = pool
        .slice()
        .sort((a, b) => {
          const itemA = records.mistakes?.[a.id] || { problemId: a.id };
          const itemB = records.mistakes?.[b.id] || { problemId: b.id };
          const dueA = mistakeSrs(itemA).dueAt <= now ? 1 : 0;
          const dueB = mistakeSrs(itemB).dueAt <= now ? 1 : 0;
          if (dueA !== dueB) return dueB - dueA;
          return mistakePressure({ ...itemB, problem: b }) - mistakePressure({ ...itemA, problem: a });
        })
        .slice(0, cap);
    }
    selectedMode = "mistakes";
    startQuiz(pool);
  }

  function restartQuiz() {
    const previous = quiz;
    if (previous) {
      if (previous.pathGate?.targetId) {
        startPathGate(previous.pathGate.targetId);
        return;
      }
      if (previous.pathNodeId) {
        startPathLesson(previous.pathNodeId);
        return;
      }
      selectedTopic = previous.topic || selectedTopic;
      selectedAnswerMode = previous.answerMode || selectedAnswerMode;
      selectedMode = previous.mode === "daily" ? "quick" : previous.mode || selectedMode;
      if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
    }
    startQuiz();
  }

  function openPathIntro(nodeId) {
    const node = PATH_NODES.find((item) => item.id === nodeId) || PATH_NODES[0];
    activePathNodeId = node.id;
    view = "path-intro";
    render();
  }

  function startPathLesson(nodeId) {
    const node = PATH_NODES.find((item) => item.id === nodeId) || PATH_NODES[0];
    activePathNodeId = node.id;
    selectedMode = node.mode || "quick";
    selectedTopic = node.topic || "all";
    selectedPack = node.pack || "all";
    startQuiz(selectPathNodePool(node), { pathNodeId: node.id });
  }

  function startPathGate(nodeId) {
    const node = PATH_NODES.find((item) => item.id === nodeId) || PATH_NODES[0];
    const gate = pathGateInfo(node);
    activePathNodeId = node.id;
    selectedMode = "practice";
    selectedTopic = "all";
    selectedPack = "all";
    selectedAnswerMode = "choice";
    startQuiz(selectPathGatePool(node, gate.total), {
      modeKey: "path_gate",
      practice: true,
      pathGate: {
        targetId: node.id,
        targetLabel: node.label,
        required: gate.required,
        total: gate.total
      }
    });
  }

  function selectPathNodePool(node) {
    const mode = MODES[node.mode || "quick"] || MODES.quick;
    const records = loadRecords();
    const pool = shouldApplyDifficultyCap(mode)
      ? filterByDifficultyCap(pathNodeProblems(node), activeDifficultyCap(records))
      : pathNodeProblems(node);
    const fallback = selectProblemPool(mode, node.topic || "all");
    const source = pool.length ? pool : fallback;
    if (mode.boss) return selectBossPool(source, mode.count, records);
    if (mode.daily) return selectDailyPool(source, mode.count, records);
    const ordered = adaptiveShuffle(source, records, seedFromString(`${Date.now()}-${node.id}`));

    // 前段的主線關卡（極限／微分／積分）只按 topic 抽題，抽到的題大多
    // 沒有帶雷達軸的技巧標籤 —— 量出來的結果是：沿主線打了一整條，
    // 數據頁的八個軸還是灰的。這裡保證每局至少三分之一帶軸標籤
    // （在關卡自己的 topic 與難度範圍內挑，順序沿用 adaptiveShuffle 的
    // 適性排序），主線和雷達才會互相餵。
    const axisTags = new Set(RADAR_AXES.flatMap((axis) => axis.tags));
    const hitsAxis = (problem) => (problem.tags || []).some((tag) => axisTags.has(tag));
    const wantAxis = Math.ceil(mode.count / 3);
    const axisPicks = ordered.filter(hitsAxis).slice(0, wantAxis);
    const rest = ordered.filter((problem) => !axisPicks.includes(problem));
    const drawn = axisPicks.concat(rest).slice(0, mode.count);
    return padPool(
      shuffle(drawn, seedFromString(`${node.id}-mix-${drawn.length}`)),
      source,
      mode.count,
      { records }
    );
  }

  function selectPathGatePool(node, count) {
    const index = Math.max(0, PATH_NODES.findIndex((item) => item.id === node.id));
    const seen = new Set();
    const records = loadRecords();
    const current = pathNodeProblems(node).filter((problem) => problemRank(problem) <= 4 || node.boss);
    const previous = PATH_NODES.slice(Math.max(0, index - 2), index).flatMap((item) => pathNodeProblems(item));
    const sourceBase = current.concat(previous).filter((problem) => {
      if (seen.has(problem.id)) return false;
      seen.add(problem.id);
      return true;
    });
    const source = filterByDifficultyCap(sourceBase, activeDifficultyCap(records));
    const pool = source.length ? source : current;
    const ordered = adaptiveShuffle(pool, records, seedFromString(`${Date.now()}-gate-${node.id}`));
    return padPool(ordered.slice(0, count), pool, count, { records });
  }

  function pathGateInfo(_node) {
    return { total: 5, required: 4 };
  }

  function pathGateUnlocked(records, nodeId) {
    return Boolean(records.pathUnlocks && records.pathUnlocks[nodeId]);
  }

  // ---- Feature 5：5 分鐘定位測驗（調適式，沿用 quiz 引擎） ----

  function placementRankPools(records = loadRecords()) {
    const stamp = Date.now();
    const pools = {};
    for (let rank = 1; rank <= 6; rank += 1) {
      pools[rank] = preferFreshProblems(
        shuffle(
          problems.filter((problem) => problemRank(problem) === rank),
          seedFromString(`${stamp}-placement-${rank}`)
        ),
        records
      );
    }
    return pools;
  }

  // 從指定 rank 附近抽一題：先抽同 rank，抽不到再往上下鄰近 rank 找；
  // 儘量避開上一題的主題，讓 8 題混到不同題型。
  function drawPlacementProblem(pools, rank, usedIds, avoidTopic = "") {
    const order = [rank, rank - 1, rank + 1, rank - 2, rank + 2, rank - 3, rank + 3, rank - 4, rank + 4, rank - 5, rank + 5]
      .filter((value, index, list) => value >= 1 && value <= 6 && list.indexOf(value) === index);
    for (const target of order) {
      const bucket = pools[target] || [];
      const fresh = bucket.find((problem) => !usedIds.has(problem.id) && problem.topic !== avoidTopic);
      if (fresh) return fresh;
      const any = bucket.find((problem) => !usedIds.has(problem.id));
      if (any) return any;
    }
    return null;
  }

  function startPlacementQuiz() {
    const records = loadRecords();
    records.onboardingSeen = true;
    saveRecords(records);
    const pools = placementRankPools(records);
    const used = new Set();
    const lineup = [];
    // 只有第一題是真的起手題；後面的槽位是佔位，作答後由調適邏輯換掉。
    while (lineup.length < PLACEMENT_COUNT) {
      const pick = drawPlacementProblem(pools, PLACEMENT_START_RANK, used, lineup.length ? lineup[lineup.length - 1].topic : "");
      if (!pick) break;
      used.add(pick.id);
      lineup.push(pick);
    }
    if (lineup.length < 4) {
      showAppNotice("題庫載入不完整，暫時無法定位。請重新整理後再試。");
      return;
    }
    selectedMode = "quick";
    selectedTopic = "all";
    selectedPack = "all";
    selectedAnswerMode = "choice";
    startQuiz(lineup, {
      modeKey: "placement",
      answerMode: "choice",
      placement: { rank: PLACEMENT_START_RANK, pools }
    });
  }

  // 對 → 下一題從 rank+1 池抽（上限 6）；錯 → rank-1（下限 1）。
  function advancePlacementLineup(currentQuiz) {
    if (!currentQuiz || !currentQuiz.placement || currentQuiz.index >= currentQuiz.problems.length) return;
    const previous = currentQuiz.answers[currentQuiz.answers.length - 1];
    currentQuiz.placement.rank = previous && previous.correct
      ? Math.min(6, currentQuiz.placement.rank + 1)
      : Math.max(1, currentQuiz.placement.rank - 1);
    const used = new Set(currentQuiz.answers.map((answer) => answer.problem.id));
    currentQuiz.problems.slice(0, currentQuiz.index).forEach((problem) => used.add(problem.id));
    const next = drawPlacementProblem(
      currentQuiz.placement.pools,
      currentQuiz.placement.rank,
      used,
      previous ? previous.problem.topic : ""
    );
    if (next) currentQuiz.problems[currentQuiz.index] = next;
  }

  // 定位結果：有 ≥2 題答對的最高 rank；退而求其次取答對過的最高 rank。
  function computePlacementResult(answers) {
    const perRank = {};
    let correct = 0;
    (answers || []).forEach((answer) => {
      const rank = problemRank(answer.problem);
      if (!perRank[rank]) perRank[rank] = { correct: 0, total: 0 };
      perRank[rank].total += 1;
      if (answer.correct) {
        perRank[rank].correct += 1;
        correct += 1;
      }
    });
    let rank = 0;
    for (let value = 6; value >= 1 && !rank; value -= 1) {
      if ((perRank[value]?.correct || 0) >= 2) rank = value;
    }
    for (let value = 6; value >= 1 && !rank; value -= 1) {
      if ((perRank[value]?.correct || 0) >= 1) rank = value;
    }
    if (!rank) rank = 1;
    const tagCounts = {};
    (answers || [])
      .filter((answer) => !answer.correct)
      .forEach((answer) => {
        (answer.problem.tags || [])
          .filter((tag) => !META_ANALYSIS_TAGS.has(tag))
          .forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
      });
    const weakTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    return { rank, correct, weakTag };
  }

  // ---- Feature 10：具名模擬卷（沿用大考模式的整份倒數 / WebWork 機制） ----

  function namedExamProblems(config) {
    return problems.filter((problem) => {
      if (!isExamAnswerProblem(problem)) return false;
      const rank = problemRank(problem);
      if (rank < config.minRank || rank > config.maxRank) return false;
      if (config.topic && problem.topic !== config.topic) return false;
      if (config.singleVariable) {
        const tags = problem.tags || [];
        if (SINGLE_VARIABLE_EXCLUDE_TAGS.some((tag) => tags.includes(tag))) return false;
      }
      return true;
    });
  }

  // 抽卷完全由 seed 決定（卷 id + 已考次數）：同一輪重進拿到同一份卷，
  // 交卷後 attempts +1，下一次就是一份新卷，但仍可重現。
  function buildNamedExamPaper(setId, attemptIndex) {
    const config = NAMED_EXAMS[setId];
    if (!config) return [];
    const seed = seedFromString(`${setId}-attempt-${Number(attemptIndex) || 0}`);
    const source = namedExamProblems(config);
    const preferredIds = new Set(
      config.preferTags
        ? source.filter((problem) => config.preferTags.some((tag) => (problem.tags || []).includes(tag))).map((problem) => problem.id)
        : []
    );
    const ordered = shuffle(source.filter((problem) => preferredIds.has(problem.id)), seed)
      .concat(shuffle(source.filter((problem) => !preferredIds.has(problem.id)), seed + 1));
    // 混主題卷做輕量主題輪替，讓每份卷的主題分布不會全押在同一區。
    const paper = [];
    const used = new Set();
    if (!config.topic) {
      const byTopic = {};
      ordered.forEach((problem) => {
        (byTopic[problem.topic] = byTopic[problem.topic] || []).push(problem);
      });
      const topics = shuffle(Object.keys(byTopic), seed + 2);
      let safety = ordered.length + 8;
      while (paper.length < config.count && safety > 0) {
        let advanced = false;
        topics.forEach((topic) => {
          if (paper.length >= config.count) return;
          const pick = byTopic[topic].shift();
          if (pick && !used.has(pick.id)) {
            used.add(pick.id);
            paper.push(pick);
            advanced = true;
          }
        });
        if (!advanced) break;
        safety -= 1;
      }
    }
    ordered.forEach((problem) => {
      if (paper.length >= config.count || used.has(problem.id)) return;
      used.add(problem.id);
      paper.push(problem);
    });
    return shuffle(paper.slice(0, config.count), seed + 3);
  }

  function startNamedExam(setId) {
    const config = NAMED_EXAMS[setId];
    if (!config) return;
    const records = loadRecords();
    const attemptIndex = Number(records.namedExams?.[setId]?.attempts || 0);
    const paper = buildNamedExamPaper(setId, attemptIndex);
    if (paper.length < Math.min(6, config.count)) {
      showAppNotice("這份模擬卷可抽的題目不足，先試試其他卷別。");
      return;
    }
    selectedMode = "quick";
    selectedTopic = config.topic || "all";
    selectedPack = "all";
    selectedAnswerMode = "free";
    startQuiz(paper, {
      modeKey: "named_exam",
      examMode: true,
      examDurationSec: config.durationSec,
      noHint: true,
      answerMode: "free",
      namedExam: { id: setId, label: config.label }
    });
  }

  // ---- Feature 6：每週挑戰（seed 固定，全站同卷，一週一次正式成績） ----

  // ISO 8601 年-週（本地時間、週一起算），例：2026-W27。
  function isoWeekKey(date = new Date()) {
    const probe = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = probe.getDay() || 7;
    probe.setDate(probe.getDate() + 4 - day); // 移到本週四 → 決定 ISO 年
    const year = probe.getFullYear();
    const yearStart = new Date(year, 0, 1);
    const week = Math.ceil(((probe - yearStart) / DAY_MS + 1) / 7);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }

  // 每週挑戰（全站同卷＋成績代碼互比）與成績分享卡於 2026-09 移除。
  // 三套打卡機制（每日任務＋連勝、每日一題、每週挑戰）互相搶同一份注意力，
  // 成熟的產品只留一條 —— 留下的是每日那條，它跟 SRS 到期複習綁在一起，
  // 是唯一有學習理由（不只是留存理由）的一套。舊紀錄 records.weeklyChallenge 保留不動。

  // ---- Feature 7：雲端同步 scaffold（可插拔 adapter，還沒接真後端） ----
  // 設定 window.BUZZ_SYNC_ENDPOINT（可選 window.BUZZ_SYNC_TOKEN）後整組生效：
  // pull = GET endpoint、push = PUT endpoint（JSON + Bearer token）。
  // 衝突規則：records.updatedAt 最新者獲勝。未設定時一切靜默降級。
  const BuzzSync = {
    endpoint() {
      const value = typeof window !== "undefined" && window.BUZZ_SYNC_ENDPOINT ? String(window.BUZZ_SYNC_ENDPOINT).trim() : "";
      return value || null;
    },
    token() {
      return typeof window !== "undefined" && window.BUZZ_SYNC_TOKEN ? String(window.BUZZ_SYNC_TOKEN) : "";
    },
    isConfigured() {
      return Boolean(this.endpoint() && typeof window.fetch === "function");
    },
    status() {
      let lastSyncAt = "";
      try {
        lastSyncAt = localStorage.getItem(SYNC_META_KEY) || "";
      } catch (_error) {
        lastSyncAt = "";
      }
      return { configured: this.isConfigured(), lastSyncAt };
    },
    markSynced() {
      try {
        localStorage.setItem(SYNC_META_KEY, new Date().toISOString());
      } catch (_error) {
        // Ignore storage failures.
      }
    },
    headers() {
      const headers = { "Content-Type": "application/json" };
      if (this.token()) headers.Authorization = `Bearer ${this.token()}`;
      return headers;
    },
    async pull() {
      if (!this.isConfigured()) return null;
      const response = await window.fetch(this.endpoint(), { headers: this.headers() });
      if (!response.ok) throw new Error(`sync pull failed: ${response.status}`);
      return normalizeRecords(await response.json());
    },
    async push(records) {
      if (!this.isConfigured()) return false;
      const response = await window.fetch(this.endpoint(), {
        method: "PUT",
        headers: this.headers(),
        body: JSON.stringify(normalizeRecords(records))
      });
      if (!response.ok) throw new Error(`sync push failed: ${response.status}`);
      return true;
    }
  };

  // 同步是**合併**，不是「誰新誰蓋掉誰」。
  //
  // 舊寫法比較兩邊的 updatedAt，然後整份取代。那個規則在單一裝置上永遠看不出問題，
  // 但只要兩台裝置都練過就會吃資料：手機練了 20 題沒同步，電腦按下同步 ——
  // 電腦的 updatedAt 比較新，手機那 20 題就沒了。而使用者以為自己在「備份」。
  //
  // merge() 是逐 key 合併、可交換、冪等的，已經在「匯入 JSON」上跑了幾個月，
  // 而且 golden 測試鎖著它的行為。同步要用的就是同一支。
  function mergeIncomingRecords(local, remote) {
    if (!remote) return local;
    if (!window.BuzzRecords || typeof window.BuzzRecords.merge !== "function") {
      // 沒有 merge 就退回舊行為，但只在遠端確實比較新的時候 ——
      // 這條路徑不該發生（kernel 是隨站出貨的），留著是為了不要整個同步壞掉。
      const localAt = Date.parse(local.updatedAt || "") || 0;
      const remoteAt = Date.parse(remote.updatedAt || "") || 0;
      return remoteAt > localAt ? remote : local;
    }
    const topics = {};
    problems.forEach((problem) => { topics[problem.id] = problem.topic; });
    return window.BuzzRecords.merge(local, normalizeRecords(remote), { problemTopics: topics });
  }

  async function syncNow() {
    if (!BuzzSync.isConfigured() || syncBusy) return;
    syncBusy = true;
    syncMessage = "同步中…";
    render();
    try {
      const local = loadRecords();
      const remote = await BuzzSync.pull();
      const merged = mergeIncomingRecords(local, remote);
      // 合併結果一定要寫回本機**再**推上去，兩邊才會收斂到同一份。
      // 只推不存的話，下一次同步又會拉到一份跟本機不同的東西。
      saveRecords(merged);
      await BuzzSync.push(merged);
      BuzzSync.markSynced();
      const gained = (merged.attemptLog || []).length - (local.attemptLog || []).length;
      syncMessage = gained > 0 ? `同步完成，合併了 ${gained} 筆作答` : "同步完成";
    } catch (_error) {
      syncMessage = "同步失敗，稍後再試";
    }
    syncBusy = false;
    render();
  }

  // iOS 裝機指引。Safari 沒有 beforeinstallprompt，「安裝」這件事
  // 只能用文字教 —— 而 iPad 正是這個產品的主力裝置。
  // 只在 iOS、瀏覽器分頁（非 standalone）時出現；裝好之後這張卡自己消失。
  function renderIosInstallCard() {
    const ua = navigator.userAgent || "";
    const isIos = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    if (!isIos || standalone || window.navigator.standalone) return "";
    return `
      <section class="study-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">裝到主畫面</p>
            <h3>像 App 一樣開，離線也能練</h3>
          </div>
        </div>
        <p class="panel-note">
          Safari 分享鈕 ${icon("share-2")} → 「加入主畫面」。
          之後從主畫面開啟：全螢幕、沒有網址列、沒訊號照樣出題。
        </p>
      </section>
    `;
  }

  function renderSyncSettingsCard() {
    const status = BuzzSync.status();
    if (!status.configured) {
      return `
        <section class="study-card sync-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">換裝置</p>
              <h3>用檔案帶走，不需要帳號</h3>
            </div>
            <span class="sync-chip">現在就能用</span>
          </div>
          <p class="panel-note">
            紀錄只存在這台裝置的瀏覽器裡。要換到別台，用下面的「匯出 JSON」帶走，再到新裝置匯入 ——
            匯入是<strong>合併</strong>不是覆蓋，兩邊練過的都會留著。
          </p>
          <details class="sync-drawer">
            <summary>那雲端同步呢？</summary>
            <p class="panel-note">
              還沒有，而且我們不想給一個做不到的日期。開帳號同步代表要有伺服器存你的作答紀錄，
              那跟現在「沒有帳號、沒有伺服器資料庫」的隱私承諾是衝突的 ——
              要做就得先想清楚怎麼做才不用把你的資料收走。
            </p>
            <p class="panel-note">在那之前，匯出／匯入就是完整的解法，而且它現在就能用。</p>
            <p class="panel-note">
              自己有伺服器的人：設 <code>window.BUZZ_SYNC_ENDPOINT</code> 就會多出
              拉／推按鈕（GET 拉、PUT 推、updatedAt 新者勝）。這是給自架者留的縫，
              資料仍然只去你自己指定的地方。
            </p>
          </details>
        </section>
      `;
    }
    const lastLine = status.lastSyncAt
      ? `上次同步：${String(status.lastSyncAt).slice(0, 16).replace("T", " ")}`
      : "尚未同步過";
    return `
      <section class="study-card sync-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">雲端同步</p>
            <h3>已連接同步端點</h3>
          </div>
          <span class="sync-chip is-on">已設定</span>
        </div>
        <p class="panel-note">${escapeHtml(lastLine)}。衝突時以最新的一份為準。</p>
        ${syncMessage ? `<p class="panel-note sync-message">${escapeHtml(syncMessage)}</p>` : ""}
        <div class="action-row">
          <button class="button secondary" data-action="sync-now" ${syncBusy ? "disabled" : ""}>${icon("refresh")}手動同步</button>
        </div>
      </section>
    `;
  }

  function startWeaknessPractice() {
    const records = loadRecords();
    const mistakeIds = Object.keys(records.mistakes || {});
    if (mistakeIds.length) {
      startMistakeQuiz("all");
      return;
    }
    selectedMode = "practice";
    selectedTopic = "all";
    selectedPack = "all";
    startQuiz();
  }

  function clearMistakes(topic, problemIds) {
    const records = loadRecords();
    if (problemIds && problemIds.length) {
      problemIds.forEach((id) => delete records.mistakes[id]);
    } else {
      Object.keys(records.mistakes || {}).forEach((id) => {
        if (topic === "all" || problemById(id)?.topic === topic) delete records.mistakes[id];
      });
    }
    saveRecords(records);
    render();
  }

  function tagMistake(problemId, tag) {
    if (!problemId || !tag) return;
    const records = loadRecords();
    if (!records.mistakes[problemId]) {
      records.mistakes[problemId] = {
        problemId,
        wrongCount: 0,
        lastWrongAt: new Date().toISOString(),
        reason: "Manual tag",
        lastInput: "",
        tag: ""
      };
    }
    records.mistakes[problemId].tag = tag;
    if (quiz) {
      quiz.answers.forEach((answer) => {
        if (answer.problem.id === problemId && !answer.correct) {
          answer.errorTag = tag;
          answer.causeAuto = false;   // 使用者親自選了，不再算系統推測
        }
      });
    }
    saveRecords(records);
    render();
  }

  function viewProofSolution(proofId) {
    if (!proofs.some((proof) => proof.id === proofId)) return;
    const records = loadRecords();
    const item = records.proofs[proofId] || {};
    records.proofs[proofId] = {
      ...item,
      solutionViewed: true,
      lastViewedAt: new Date().toISOString()
    };
    saveRecords(records);
    trackEvent("view_proof_solution", { proof_id: proofId });
    render();
  }

  function markProofStatus(proofId, status) {
    if (!proofs.some((proof) => proof.id === proofId)) return;
    const records = loadRecords();
    if (!status) {
      if (records.proofs[proofId]) {
        delete records.proofs[proofId].status;
        records.proofs[proofId].updatedAt = new Date().toISOString();
      }
    } else {
      const item = records.proofs[proofId] || {};
      records.proofs[proofId] = {
        ...item,
        status,
        updatedAt: new Date().toISOString()
      };
    }
    saveRecords(records);
    trackEvent("mark_proof_status", { proof_id: proofId, status: status || "clear" });
    render();
  }

  function markProofBlocker(proofId, blocker) {
    if (!proofs.some((proof) => proof.id === proofId)) return;
    const records = loadRecords();
    const item = records.proofs[proofId] || {};
    // Toggle off if the same blocker is tapped again.
    const next = item.blocker === blocker ? "" : blocker;
    if (!next) {
      if (records.proofs[proofId]) {
        delete records.proofs[proofId].blocker;
        records.proofs[proofId].updatedAt = new Date().toISOString();
      }
    } else {
      records.proofs[proofId] = {
        ...item,
        blocker: next,
        updatedAt: new Date().toISOString()
      };
    }
    saveRecords(records);
    trackEvent("mark_proof_blocker", { proof_id: proofId, blocker: next || "clear" });
    render();
  }

  function clearHistory() {
    const records = loadRecords();
    records.history = [];
    saveRecords(records);
    render();
  }

  function exportRecords() {
    const records = loadRecords();
    // 信封讓匯入端分得出這是哪個科目、哪個版本的檔。
    // 舊格式（裸 records）匯入時仍然照收。
    const envelope = {
      format: "buzz.records",
      version: 2,
      subject: "calculus",
      app: APP_VERSION,
      exportedAt: new Date().toISOString(),
      records
    };
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buzz-calculus-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    trackEvent("export_records", {
      history_count: (records.history || []).length,
      mistake_count: Object.keys(records.mistakes || {}).length,
      size_kb: Math.round(JSON.stringify(envelope).length / 1024)
    });
    // 匯出過就別再提醒了
    if (!records.backupNoticeSeen) {
      records.backupNoticeSeen = true;
      saveRecords(records);
    }
  }

  // ── 難度校準包 ─────────────────────────────────────────────
  //
  // 目前的難度是「作者覺得幾分」。實測分佈是 R6 佔 33%（spec 目標 5%），
  // 也就是說作者的直覺明顯偏硬 —— 但沒有資料就只能繼續猜。
  //
  // 這個功能讓願意幫忙的人匯出一份**去識別化**的作答統計。
  // 零後端：使用者按一下、下載檔案、自己決定要不要寄給作者。
  //
  // 隱私是這個功能的設計前提，不是附加條款：
  //   - 只有 uid（永久題號）、rank、對錯次數、中位秒數
  //   - 沒有題幹、沒有作答內容、沒有時間戳記、沒有任何識別碼
  //   - 沒有裝置資訊、沒有 IP（本來也拿不到）
  // 匯出前會把實際內容攤在畫面上給人看過再下載 ——
  // 「相信我沒有偷傳東西」不是一個可以要求使用者接受的說法。
  //
  // masteryBand 是必要的：難題只有強者會去做，不分層的話正確率會虛高。
  function buildCalibrationPack() {
    const records = loadRecords();
    const stats = records.problemStats || {};
    const profile = abilityProfile(records);
    const rows = [];

    Object.keys(stats).forEach((id) => {
      const stat = stats[id];
      if (!stat || !stat.total) return;
      const problem = problems.find((item) => item.id === id);
      if (!problem) return;
      const uid = window.BuzzUid && window.BuzzUid.uidFor(id);
      // 配不到永久題號的題（例如使用者自訂題）一律不匯出：
      // 自訂題只有這個人有，題號本身就是識別資訊。
      if (!uid) return;
      rows.push({
        uid,
        rank: problem.rank,
        n: stat.total,
        correct: stat.correct || 0,
        sec: medianSecondsFor(records, id)
      });
    });

    return {
      format: "buzz.calibration",
      version: 1,
      subject: "calculus",
      app: APP_VERSION,
      // 作答者的整體程度分層。沒有它，「難題正確率高」會被誤讀成「這題其實不難」，
      // 但真相往往是「只有強者去做那題」。
      masteryBand: masteryBandOf(profile),
      rows
    };
  }

  function masteryBandOf(profile) {
    const overall = profile && Number.isFinite(profile.overall) ? profile.overall : null;
    if (overall === null) return "unknown";
    if (overall >= 80) return "high";
    if (overall >= 55) return "mid";
    return "low";
  }

  function medianSecondsFor(records, id) {
    const seconds = (records.attemptLog || [])
      .filter((entry) => entry && entry.id === id && Number.isFinite(entry.sec))
      .map((entry) => entry.sec)
      .sort((a, b) => a - b);
    if (!seconds.length) return null;
    return Math.round(seconds[Math.floor(seconds.length / 2)]);
  }

  function exportCalibrationPack() {
    const pack = buildCalibrationPack();
    if (!pack.rows.length) {
      showAppNotice("還沒有可用的作答統計，先練幾題再匯出。");
      return;
    }
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buzz-calibration-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    trackEvent("calibration_export", { rows: pack.rows.length, band: pack.masteryBand });
  }

  // 「清除資料」必須真的清乾淨。
  //
  // 舊版只刪 records 那一個 key，於是這些東西全部留在裝置上：
  //   - 進行中的存檔（buzzcalculus.session.active）——續傳時整份考卷會冒出來
  //   - 自訂題（buzzcalculus.customProblems.v1）
  //   - 手寫草稿（IndexedDB，可能有幾百題的筆跡）
  //   - 主題與同步中繼資料
  //
  // 對一個叫「清除資料」的按鈕來說，那既是 UX 上的謊言，也是法遵上的問題：
  // 把電腦借給別人之前按了清除，結果手寫的草稿還在。
  const ERASABLE = [
    [STORAGE_KEY, "練習紀錄"],
    [ACTIVE_KEY, "進行中的存檔"],
    [SYNC_META_KEY, "同步中繼資料"],
    [THEME_KEY, "外觀設定"],
    ["buzzcalculus.customProblems.v1", "自訂題目"]
  ];

  // 命名空間前綴。刪除以這個開頭的**全部** key，而不是刪一份固定清單。
  //
  // 為什麼不能用固定清單：自動備份的 key 帶時間戳
  // （buzzcalculus.backup.1786885203659），列不完。E2E 實測抓到過 ——
  // 按了「清除資料」之後，一份完整的紀錄備份還躺在 localStorage 裡，
  // 而隱私政策上寫的是「會刪掉練習紀錄」。那就變成一句不實陳述。
  //
  // 固定清單留著只是為了**告訴使用者刪掉了哪幾類東西**，不是刪除的依據。
  const STORAGE_NAMESPACE = "buzzcalculus.";

  function eraseEverything() {
    const removed = [];
    ERASABLE.forEach(([key, label]) => {
      try {
        if (localStorage.getItem(key) !== null) removed.push(label);
      } catch (_error) { /* 讀不到就當作沒有 */ }
    });
    // 真正的刪除：整個命名空間掃一遍
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_NAMESPACE));
      const hadBackup = keys.some((key) => key.startsWith(BACKUP_PREFIX));
      keys.forEach((key) => localStorage.removeItem(key));
      if (hadBackup) removed.push("自動備份");
    } catch (_error) { /* storage 被鎖住時不要讓整個流程掛掉 */ }
    // 手寫草稿在 IndexedDB，是非同步的 —— 不能 await，但一定要發出去
    try {
      if (window.BuzzBoardStore) {
        window.BuzzBoardStore.clearBoards();
        removed.push("手寫草稿");
      }
    } catch (_error) { /* 同上 */ }
    trackEvent("erase_data", { buckets: removed.length });
    return removed.length ? removed : ["（本來就沒有資料）"];
  }

  // 刪除前把「會刪掉什麼」攤開講。
  // 「確定要清除嗎？」這種問法沒有資訊量 —— 使用者要知道的是刪掉的範圍。
  function renderEraseConfirmModal() {
    if (!eraseConfirm) return "";
    const records = loadRecords();
    const counts = [
      // 用詞跟資料管理卡片一致。同一份資料在兩個畫面上叫兩個名字，
      // 使用者會以為那是兩份不同的東西。
      `${(records.attempts || 0) + (records.practiceRuns || 0)} 局練習紀錄`,
      `${Object.keys(records.mistakes || {}).length} 題錯題本`,
      `${(records.attemptLog || []).length} 筆逐題作答`
    ];
    return `
      <div class="modal-backdrop" data-action="cancel-erase">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="erase-title" data-modal>
          <h3 id="erase-title">刪除這台裝置上的所有資料？</h3>
          <p>會刪掉：${escapeHtml(counts.join("、"))}，以及進行中的存檔、自訂題目、手寫草稿與外觀設定。</p>
          <p class="erase-warning"><strong>這個動作無法復原。</strong>沒有帳號、沒有雲端備份 —— 刪掉就是真的沒了。</p>
          <p class="erase-hint">想留一份的話，先按「取消」再去匯出 JSON。</p>
          <div class="action-row">
            <button class="button danger" data-action="confirm-erase">${icon("trash")}確定刪除</button>
            <button class="button" data-action="cancel-erase">${icon("x")}取消</button>
          </div>
        </div>
      </div>
    `;
  }

  function loadThemePreference() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_error) {
      // Ignore storage failures.
    }
    return "light";
  }

  function applyTheme() {
    if (document.documentElement) {
      document.documentElement.dataset.theme = selectedTheme;
    }
    const themeColor = selectedTheme === "dark" ? "#171817" : "#f5f3ed";
    const meta = document.querySelector && document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColor);
  }

  function toggleTheme() {
    selectedTheme = selectedTheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, selectedTheme);
    } catch (_error) {
      // Ignore storage failures.
    }
    applyTheme();
    render();
  }

  function setupPwa() {
    if (window.navigator && "serviceWorker" in window.navigator) {
      window.addEventListener("load", () => {
        window.navigator.serviceWorker.register("./sw.js").then((registration) => {
          if (!registration) return;
          // 已經有一個裝好在等的版本（上次沒按更新就關掉分頁）
          if (registration.waiting) markUpdateReady(registration);
          registration.addEventListener("updatefound", () => {
            const installing = registration.installing;
            if (!installing) return;
            installing.addEventListener("statechange", () => {
              // controller 存在代表這是「更新」而不是第一次安裝
              if (installing.state === "installed" && window.navigator.serviceWorker.controller) {
                markUpdateReady(registration);
              }
            });
          });
        }).catch(() => {});
        // 換手之後才重新載入，這樣拿到的一定是新版
        let reloading = false;
        window.navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!updateAccepted || reloading) return;
          reloading = true;
          window.location.reload();
        });
      });
    }
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      render();
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      render();
    });
  }

  // 有新版本可以用了。不自己更新 —— 只是說一聲。
  function markUpdateReady(registration) {
    pendingUpdate = registration;
    render();
  }

  function applyPendingUpdate() {
    if (!pendingUpdate || !pendingUpdate.waiting) return;
    updateAccepted = true;
    trackEvent("app_update_apply", {});
    pendingUpdate.waiting.postMessage({ type: "SKIP_WAITING" });
  }

  function renderUpdateBanner() {
    if (!pendingUpdate) return "";
    // 作答中不打擾 —— 新版可以等，這一局不能重來。
    if (quiz && view === "quiz" && !quiz.feedback) return "";
    return `
      <div class="update-banner" role="status">
        <span>有新版本可以用了。</span>
        <button class="button secondary" data-action="apply-update">${icon("refresh")}重新載入更新</button>
        <button class="icon-button" data-action="dismiss-update" title="稍後再說">${icon("x")}</button>
      </div>
    `;
  }

  function installApp() {
    if (!deferredInstallPrompt) return;
    trackEvent("install_pwa", {});
    deferredInstallPrompt.prompt();
    Promise.resolve(deferredInstallPrompt.userChoice).finally(() => {
      deferredInstallPrompt = null;
      render();
    });
  }

  // 匯入是**合併**不是覆蓋。
  //
  // 舊行為是整份取代：在 A 裝置匯出、在 B 裝置匯入，B 上的紀錄就全沒了。
  // 使用者以為自己在「同步」，實際上是在刪資料。
  //
  // 這也是 spec 06.3 的風險對策：merge() 先在匯入功能上跑過幾個月，
  // 等接雲端同步時它已經被真實使用者驗證過。
  function importRecords(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let incoming = null;
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        // 新格式帶信封；舊格式是裸 records，照收。
        incoming = parsed && parsed.format === "buzz.records" && parsed.records ? parsed.records : parsed;
        if (!incoming || typeof incoming !== "object") throw new Error("bad shape");
      } catch (_error) {
        showAppNotice("匯入失敗：檔案不是有效的 BuzzCalculus JSON。");
        return;
      }

      const current = loadRecords();
      const beforeCount = (current.attemptLog || []).length;
      let mergedRecords = null;

      if (window.BuzzRecords && typeof window.BuzzRecords.merge === "function") {
        try {
          const topics = {};
          problems.forEach((problem) => { topics[problem.id] = problem.topic; });
          mergedRecords = window.BuzzRecords.merge(current, normalizeRecords(incoming), { problemTopics: topics });
        } catch (_error) {
          mergedRecords = null;
        }
      }

      if (!mergedRecords) {
        // kernel 缺席時退回舊的覆蓋行為，但要先講清楚會發生什麼事。
        if (beforeCount && !window.confirm("這台裝置上已經有練習紀錄。合併功能無法使用，繼續會直接覆蓋。要繼續嗎？")) return;
        mergedRecords = normalizeRecords(incoming);
      }

      backupRecords(current, true);
      saveRecords(mergedRecords);
      const afterCount = (mergedRecords.attemptLog || []).length;
      trackEvent("import_records", {
        history_count: (mergedRecords.history || []).length,
        mistake_count: Object.keys(mergedRecords.mistakes || {}).length,
        merged: afterCount > beforeCount
      });
      showAppNotice(
        afterCount > beforeCount
          ? `已合併：作答紀錄從 ${beforeCount} 筆增加到 ${afterCount} 筆。`
          : "已匯入。這份檔案沒有帶來新的作答紀錄。"
      );
      render();
    });
    reader.readAsText(file);
  }

  // ── 本機自動備份 ────────────────────────────────────────────
  // 救得了「誤觸重設」「匯入覆蓋」，救不了「清除瀏覽器資料」——
  // 後者只有匯出檔案或雲端才擋得住，所以提醒文案不能把備份講得太安全。
  const BACKUP_PREFIX = "buzzcalculus.backup.";
  const BACKUP_KEEP = 3;
  const BACKUP_INTERVAL_MS = 24 * 3600 * 1000;

  function backupRecords(records, force) {
    if (!records || !(records.totalAnswered || 0)) return;
    try {
      const keys = Object.keys(localStorage)
        .filter((key) => key.startsWith(BACKUP_PREFIX))
        .sort();
      const newest = keys.length ? Number(keys[keys.length - 1].slice(BACKUP_PREFIX.length)) : 0;
      if (!force && Date.now() - newest < BACKUP_INTERVAL_MS) return;

      localStorage.setItem(BACKUP_PREFIX + Date.now(), JSON.stringify(records));
      const after = Object.keys(localStorage).filter((key) => key.startsWith(BACKUP_PREFIX)).sort();
      after.slice(0, Math.max(0, after.length - BACKUP_KEEP)).forEach((key) => localStorage.removeItem(key));
    } catch (_error) {
      // 配額滿的時候備份失敗不能影響正常存檔
    }
  }

  // 匯出提醒：練到一定程度才提，而且只提一次。
  // 太早提會被當雜訊，提太多次會被當推銷。
  function renderBackupNotice(records) {
    if (records.backupNoticeSeen) return "";
    const answered = Number(records.totalAnswered || 0);
    const firstAt = (records.history || []).reduce((oldest, item) => {
      const at = item && Date.parse(item.finishedAt || "");
      return Number.isFinite(at) && (!oldest || at < oldest) ? at : oldest;
    }, 0);
    const days = firstAt ? (Date.now() - firstAt) / DAY_MS : 0;
    if (answered < 200 && days < 7) return "";

    // 這張卡原本跟「今天的訓練」一樣大、而且排在它前面 ——
    // 於是每天打開站台，第一個看到的是一則提醒，不是今天要做什麼。
    // 提醒的內容是對的（資料真的會沒），但它不該跟主要行動搶版面。
    // 改成一條細的橫幅，放在主卡下面。
    return `
      <aside class="backup-bar" role="note">
        <div class="backup-bar-text">
          <strong>紀錄只在這台裝置上</strong>
          <span>已累積 ${answered} 題。清除瀏覽器資料就會全部消失，而且救不回來。</span>
        </div>
        <div class="backup-bar-actions">
          <button class="button secondary" data-action="export-records">${icon("download")}匯出備份</button>
          <button class="icon-button" data-action="dismiss-backup-notice" title="之後再說">${icon("x")}</button>
        </div>
      </aside>
    `;
  }

  // 舊的大卡片版本已刪除。它的「匯出備份」按鈕寫的是 data-action="export"，
  // 而那個 action 根本不存在（正確的是 export-records）—— 也就是說整張提醒卡的
  // 主要行動按下去什麼都不會發生，而卡片本身佔掉了首頁最上面 200px。

  function dismissBackupNotice() {
    const records = loadRecords();
    records.backupNoticeSeen = true;
    saveRecords(records);
    render();
  }

  function showHint() {
    if (!quiz || quiz.feedback || quiz.noHint) return;
    const current = getCurrentProblem();
    if (!current) return;
    const hints = hintsFor(current);
    const used = quiz.hintsUsed[current.id] || 0;
    if (used >= hints.length) return;
    quiz.hintsUsed[current.id] = used + 1;
    trackEvent("hint_open", {
      mode: quiz.mode,
      topic: current.topic,
      problem_id: current.id,
      hint_index: quiz.hintsUsed[current.id],
      hints_total: hints.length,
      practice: Boolean(quiz.practice)
    });
    render();
  }

  function startQuiz(customProblems, options = {}) {
    const records = loadRecords();
    const difficultyCap = activeDifficultyCap(records);
    const mode = MODES[selectedMode] || MODES.quick;
    const pool = customProblems && customProblems.length ? customProblems : selectProblemPool(mode, selectedTopic);
    if (!pool.length) {
      view = "home";
      showAppNotice("目前篩選沒有符合難度的題目。請把難度上限拉高，或換一個題包 / 範圍。");
      return;
    }
    quiz = {
      mode: options.modeKey || selectedMode,
      topic: selectedTopic,
      answerMode: options.answerMode || selectedAnswerMode,
      practice: options.practice !== undefined ? Boolean(options.practice) : Boolean(mode.practice),
      noTimer: Boolean(options.noTimer || mode.noTimer),
      noHint: Boolean(options.noHint || mode.noHint),
      survival: Boolean(options.survival || mode.survival),
      suddenDeath: Boolean(options.suddenDeath || mode.suddenDeath),
      accuracyMode: Boolean(options.accuracyMode || mode.accuracyMode),
      pressureMode: Boolean(options.pressureMode || mode.pressureMode),
      examMode: Boolean(options.examMode || mode.exam),
      examDurationSec: Number(options.examDurationSec || mode.examDurationSec || 0),
      examEndAt: options.examMode || mode.exam ? Date.now() + Number(options.examDurationSec || mode.examDurationSec || 0) * 1000 : 0,
      difficultyCap,
      pathNodeId: options.pathNodeId || "",
      pathRetestFor: options.pathRetestFor || "",
      pathGate: options.pathGate || null,
      placement: options.placement || null,
      namedExam: options.namedExam || null,
      problems: pool,
      index: 0,
      score: 0,
      answers: [],
      currentStreak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
      questionStartedAt: Date.now(),
      choiceOptions: {},
      boardStrokes: {},
      boardTool: "pen",
      boardOpen: false,
      boardFullscreen: false,
      hintsUsed: {},
      draft: "",
      feedback: null,
      forceFinishAfterFeedback: false,
      modal: null
    };
    if (options.dailyOne) quiz.dailyOne = options.dailyOne;
    view = "quiz";
    lastVisibilityStamp = Date.now();
    trackProblemStart(quiz.problems[0]);
    clearActiveSession();
    autosaveSession(true);
    if (!quiz.practice && !quiz.noTimer) startTicker();
    trackEvent("session_start", {
      mode: quiz.mode,
      topic: quiz.topic,
      pack: selectedPack,
      answer_mode: quiz.answerMode,
      difficulty_cap: quiz.difficultyCap,
      problem_count: quiz.problems.length,
      practice: Boolean(quiz.practice)
    });
    render();
  }

  function selectProblemPool(mode, topic) {
    const records = loadRecords();
    const difficultyCap = activeDifficultyCap(records);
    let pool = problems.slice();
    if (mode.integralBee) {
      pool = pool.filter((problem) => problem.topic === "integrals");
    }
    // 壓力訓練：優先抽「會但一計時就垮」的技巧（UA−PA 差距超過門檻）。
    // 資料不足或命中太少就退回一般池 —— 模式照樣能玩，只是失去針對性。
    if (mode.pressureMode) {
      const targets = pressuredSkillIds(records);
      if (targets.size && window.BuzzSkillGraph) {
        const focused = pool.filter((problem) =>
          (window.BuzzSkillGraph.skillsForProblem(problem) || []).some((id) => targets.has(id)));
        if (focused.length >= mode.count) pool = focused;
      }
    }
    if (mode.hidden && selectedMode === "mistakes") {
      pool = Object.values(records.mistakes || {}).map((item) => problemById(item.problemId)).filter(Boolean);
      return padPool(pool, pool, Math.min(mode.count, pool.length || mode.count), { records, avoidRecent: false });
    }
    if (mode.topicLocked) {
      pool = pool.filter((problem) => problem.topic === (topic === "all" ? "limits" : topic));
    } else if (topic !== "all") {
      pool = pool.filter((problem) => problem.topic === topic);
    }
    if (selectedPack !== "all") {
      pool = pool.filter((problem) => matchesPack(problem, selectedPack));
    }
    if (mode.examStyle) return selectExamPool(pool, mode.count, records);
    if (mode.minRank) {
      const rankedPool = pool.filter((problem) => problemRank(problem) >= mode.minRank);
      pool = rankedPool.length ? rankedPool : pool;
    }
    if (mode.hardOnly) {
      const hardPool = pool.filter((problem) => problemRank(problem) >= 4);
      pool = hardPool.length ? hardPool : pool;
    }
    if (mode.maxRank) {
      const easyPool = pool.filter((problem) => problemRank(problem) <= mode.maxRank);
      pool = easyPool.length ? easyPool : pool;
    }
    if (shouldApplyDifficultyCap(mode)) {
      pool = filterByDifficultyCap(pool, difficultyCap);
    }

    if (mode.boss) {
      return selectBossPool(pool, mode.count, records);
    }

    if (mode.daily) {
      return selectDailyPool(pool, mode.count, records);
    }

    const seed = mode.daily ? seedFromString(new Date().toISOString().slice(0, 10)) : Date.now();
    const ordered = mode.daily ? preferFreshProblems(shuffle(pool, seed), records) : adaptiveShuffle(pool, records, seed);
    return padPool(ordered.slice(0, mode.count), pool, mode.count, { records });
  }

  function selectBossPool(pool, count, records = loadRecords()) {
    const bossPool = pool.filter((problem) => problemRank(problem) >= 5);
    const sourcePool = bossPool.length ? bossPool : pool.filter((problem) => problemRank(problem) >= 4);
    const ranked = [6, 5, 4].flatMap((rank) =>
      preferFreshProblems(shuffle(sourcePool.filter((problem) => problemRank(problem) === rank), seedFromString(`${Date.now()}-boss-${rank}`)), records).slice(0, rank === 6 ? 7 : 5)
    );
    return padPool(ranked, sourcePool.length ? sourcePool : pool, count, { records });
  }

  function selectDailyPool(pool, count, records = loadRecords()) {
    const seed = seedFromString(new Date().toISOString().slice(0, 10));
    const plan = [1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 5, 2].slice(0, count);
    const selected = [];
    const buckets = [1, 2, 3, 4, 5, 6].reduce((acc, rank) => {
      acc[rank] = preferFreshProblems(shuffle(pool.filter((problem) => problemRank(problem) === rank), seedFromString(`${seed}-daily-${rank}`)), records);
      return acc;
    }, {});
    plan.forEach((targetRank) => {
      const ranks = [targetRank, targetRank - 1, targetRank + 1, targetRank - 2, targetRank + 2, 6].filter((rank) => rank >= 1 && rank <= 6);
      const bucket = ranks.map((rank) => buckets[rank]).find((items) => items && items.length);
      if (bucket) selected.push(bucket.shift());
    });
    return padPool(selected, shuffle(pool, seed), count, { records });
  }

  function selectExamPool(pool, count, records = loadRecords()) {
    const rankedWebWork = pool.filter((problem) => isExamAnswerProblem(problem) && problemRank(problem) >= 3);
    const examTagged = rankedWebWork.filter((problem) => (problem.tags || []).includes("exam-style"));
    const source = examTagged.length >= count ? examTagged : rankedWebWork.length ? rankedWebWork : pool.filter(isExamAnswerProblem);
    const plan = [
      ["integrals", 6],
      ["derivatives", 6],
      ["limits", 4],
      ["series", 4]
    ];
    const selected = [];
    const used = new Set();
    const add = (problem) => {
      if (!problem || used.has(problem.id) || selected.length >= count) return;
      used.add(problem.id);
      selected.push(problem);
    };

    plan.forEach(([topic, target]) => {
      const ordered = adaptiveShuffle(
        source.filter((problem) => problem.topic === topic),
        records,
        seedFromString(`${Date.now()}-exam-${topic}`)
      );
      if (topic !== "series") {
        ordered.slice(0, target).forEach(add);
        return;
      }
      const nonRadius = ordered.filter((problem) => !(problem.tags || []).includes("radius"));
      const radius = ordered.filter((problem) => (problem.tags || []).includes("radius"));
      nonRadius.slice(0, Math.max(0, target - 1)).forEach(add);
      radius.slice(0, Math.max(0, target - selected.filter((problem) => problem.topic === "series").length)).forEach(add);
    });

    const filler = adaptiveShuffle(
      source.filter((problem) => !used.has(problem.id) && (problem.topic !== "series" || !(problem.tags || []).includes("radius"))),
      records,
      seedFromString(`${Date.now()}-exam-fill`)
    );
    filler.forEach(add);
    return padPool(shuffle(selected, seedFromString(`${Date.now()}-exam-order`)), source, count, { records });
  }

  function selectCooldownPool(count) {
    const records = loadRecords();
    const cap = activeDifficultyCap(records);
    const mistakes = Object.values(records.mistakes || {})
      .sort((a, b) => mistakeWeight(b) - mistakeWeight(a))
      .map((item) => problemById(item.problemId))
      .filter(Boolean);
    const easy = problems.filter((problem) => problemRank(problem) <= Math.min(3, cap));
    const fallbackEasy = problems.filter((problem) => problemRank(problem) <= 3);
    return padPool(mistakes.slice(0, count), easy.length ? easy : fallbackEasy, count, { records });
  }

  function padPool(selected, pool, count, options = {}) {
    const records = options.records || loadRecords();
    const avoidRecent = options.avoidRecent !== false;
    const recent = avoidRecent ? recentProblemSet(records, options.recentLimit || RECENT_STRONG_AVOID) : new Set();
    const result = [];
    const used = new Set();

    (selected || []).forEach((problem) => {
      if (!problem || used.has(problem.id) || result.length >= count) return;
      used.add(problem.id);
      result.push(problem);
    });

    const shuffled = shuffle(pool || [], seedFromString(`${Date.now()}-pad`));
    const fillUnique = (items, skipRecent) => {
      items.forEach((problem) => {
        if (!problem || result.length >= count || used.has(problem.id)) return;
        if (skipRecent && recent.has(problem.id)) return;
        used.add(problem.id);
        result.push(problem);
      });
    };

    fillUnique(shuffled, true);
    fillUnique(shuffled, false);

    let cursor = 0;
    while (result.length < count && shuffled.length) {
      result.push(shuffled[cursor % shuffled.length]);
      cursor += 1;
    }
    return result.slice(0, count);
  }

  // 「會但一計時就垮」的技巧：不限時正確率減掉限時正確率超過
  // GAP_PRESSURE（kernel/ability.js 的門檻）。這是壓力訓練的靶。
  function pressuredSkillIds(records) {
    const profile = abilityProfile(records);
    if (!profile) return new Set();
    const threshold = (window.BuzzAbility && window.BuzzAbility.constants.GAP_PRESSURE) || 0.15;
    return new Set(
      Object.values(profile.skills || {})
        .filter((entry) => entry.measured && entry.gap !== null && entry.gap >= threshold && entry.subject !== "science")
        .map((entry) => entry.id)
    );
  }

  // 「今天適合」徽章：16 個模式對新使用者是選擇癱瘓 —— 不砍模式，
  // 改讓能力模型指路。最多兩個，而且要說得出為什麼（跟 planner 的
  // why 同一條紀律：沒有理由的推薦和隨機沒有差別）。
  function modeRecommendations(records) {
    const recos = new Map();
    const profile = abilityProfile(records);
    if (profile) {
      const skills = Object.values(profile.skills || {}).filter((entry) => entry.measured && entry.subject !== "science");
      const pressured = pressuredSkillIds(records).size;
      const weak = skills.filter((entry) => entry.state === "weak" || entry.state === "shaky").length;
      const reflex = skills.filter((entry) => entry.state === "reflex").length;
      if (pressured >= 2) {
        recos.set("pressure", `${pressured} 個技巧「會但一計時就垮」—— 練縮短的時間窗`);
      }
      if (weak >= 5) {
        recos.set("topic", `${weak} 個技巧還不穩 —— 單範圍集中補洞`);
      } else if (reflex >= 8 && recos.size < 2) {
        recos.set("boss_rush", `${reflex} 個技巧已反射級 —— 往上打`);
      }
    }
    if (!recos.size) recos.set("quick", "混合訓練維持手感，模型會自動偏向你的弱技巧");
    return new Map([...recos.entries()].slice(0, 2));
  }

  // 壓力訓練的計時遞減：第一題給全額，最後一題只給 60%。
  // 練的不是「更快算」而是「在縮短的窗裡維持判型與計算的穩定」——
  // 這正對 ability 模型抓出來的 PA/UA 差距。下限 15 秒：再短就只是反應遊戲。
  function questionTimeLimit(currentQuiz, problem) {
    const base = problem.timeLimit;
    if (!currentQuiz || !currentQuiz.pressureMode) return base;
    const total = currentQuiz.problems.length;
    if (total <= 1) return base;
    const position = Math.min(currentQuiz.index, total - 1) / (total - 1);
    return Math.max(15, Math.round(base * (1 - 0.4 * position)));
  }

  // 能力模型 → 抽題的三個訊號（2026-09-04）。
  //
  // 審計抓到的最大缺口：模型算得出「哪個技巧弱、什麼難度是挑戰點、
  // 哪些技巧已經反射化」，抽題卻只看題目級／主題級的錯誤率 ——
  // 產品的差異化核心（kernel/ability.js）一直是只讀不驅動的擺設。
  //   弱技巧優先   題目所屬技巧的最低精熟度越低越先抽。粒度是 80 個技巧
  //               節點，不是 4 個主題 —— 而且對「沒做過的題」也有訊號
  //               （同技巧的其他題教過模型了）。
  //   難度匹配     抽落在挑戰點附近的 rank：精熟 20 給 R2、精熟 80 給 R5。
  //               太簡單練不到、太難只剩挫折（desirable difficulty）。
  //   反射降權     所有技巧都已是反射級的題是舒適區，讓位給該練的。
  function selectionSkillTerms(problem, profile) {
    if (!profile || !window.BuzzSkillGraph) return { weakness: 0, fit: 0, overlearned: 0 };
    const ids = window.BuzzSkillGraph.skillsForProblem(problem) || [];
    const entries = ids
      .map((id) => profile.skills[id])
      .filter((entry) => entry && entry.measured && entry.mastery !== null);
    if (!entries.length) return { weakness: 0, fit: 0, overlearned: 0 };
    const weakest = Math.min(...entries.map((entry) => entry.mastery));
    const targetRank = 1 + Math.round((weakest / 100) * 4);
    return {
      weakness: (100 - weakest) / 100,
      fit: 1 - Math.min(1, Math.abs(problemRank(problem) - targetRank) / 3),
      overlearned: entries.every((entry) => entry.state === "reflex") ? 1 : 0
    };
  }

  // 交錯保證：同一個技巧不連續出現（能換就換，換不了才連著）。
  // blocked practice 的順手感是假的 —— 上一題剛用過的工具還掛在手上，
  // 「辨識該用哪個工具」這一步被跳過了，而那正是本產品要練的東西。
  // 交錯讓每一題都要重新判型（interleaving effect）。
  function interleaveBySkill(ordered) {
    const graph = window.BuzzSkillGraph;
    if (!graph || ordered.length < 3) return ordered;
    const primaryOf = new Map(ordered.map((problem) => {
      const ids = graph.skillsForProblem(problem) || [];
      return [problem.id, ids[0] || problem.topic || ""];
    }));
    const rest = ordered.slice();
    const result = [];
    while (rest.length) {
      const lastKey = result.length ? primaryOf.get(result[result.length - 1].id) : null;
      let index = rest.findIndex((problem) => primaryOf.get(problem.id) !== lastKey);
      if (index === -1) index = 0;
      result.push(rest.splice(index, 1)[0]);
    }
    return result;
  }

  function adaptiveShuffle(pool, records, seed) {
    const recentIndex = new Map();
    recentProblemIds(records, RECENT_PROBLEM_COOLDOWN).forEach((id, index) => {
      if (!recentIndex.has(id)) recentIndex.set(id, index);
    });
    // 每次抽題算一次（有快取），synthetic records 算不出來就回 null、各項歸零
    const profile = abilityProfile(records);
    const ordered = pool
      .slice()
      .map((problem, index) => {
        const stat = records.problemStats[problem.id] || { correct: 0, wrong: 0, total: 0 };
        const topic = records.topicStats[problem.topic] || { wrong: 0, total: 0 };
        const problemWeakness = stat.total ? stat.wrong / stat.total : 0;
        const topicWeakness = topic.total ? topic.wrong / topic.total : 0;
        const mistakeBoost = records.mistakes[problem.id] ? 0.2 + Math.min(1.2, mistakeWeight(records.mistakes[problem.id]) * 0.18) : 0;
        const recentPosition = recentIndex.has(problem.id) ? recentIndex.get(problem.id) : -1;
        const recentWeight = recentPosition >= 0 ? 1 - recentPosition / RECENT_PROBLEM_COOLDOWN : 0;
        const repeatPenalty = recentWeight
          ? records.mistakes[problem.id]
            ? 0.35 + recentWeight * 0.25
            : 1.05 + recentWeight * 0.65
          : 0;
        const skill = selectionSkillTerms(problem, profile);
        const randomness = hashUnit(`${seed}-${problem.id}-${index}`);
        return {
          problem,
          score: randomness + problemWeakness * 0.85 + topicWeakness * 0.55 + mistakeBoost - repeatPenalty
            + skill.weakness * 0.6 + skill.fit * 0.3 - skill.overlearned * 0.45
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.problem);
    return interleaveBySkill(ordered);
  }

  function preferFreshProblems(items, records, limit = RECENT_STRONG_AVOID) {
    const recent = recentProblemSet(records, limit);
    const fresh = [];
    const repeated = [];
    (items || []).forEach((problem) => {
      if (!problem) return;
      (recent.has(problem.id) ? repeated : fresh).push(problem);
    });
    return fresh.concat(repeated);
  }

  function recentProblemSet(records, limit = RECENT_STRONG_AVOID) {
    return new Set(recentProblemIds(records, limit));
  }

  function recentProblemIds(records, limit = RECENT_PROBLEM_COOLDOWN) {
    const ids = [];
    for (const item of records.history || []) {
      for (const answer of item.answers || []) {
        if (answer.problemId) ids.push(answer.problemId);
        if (ids.length >= limit) return ids;
      }
    }
    return ids;
  }

  function hashUnit(value) {
    const seed = seedFromString(value);
    return (seed % 100000) / 100000;
  }

  function matchesPack(problem, packKey) {
    if (packKey === "all") return true;
    const tags = problem.tags || [];
    const pack = TRAINING_PACKS[packKey];
    const required = pack ? pack.tags : [packKey];
    return required.some((tag) => tags.includes(tag));
  }

  function isExamAnswerProblem(problem) {
    return ["numeric", "expression", "antiderivative"].includes(problem.answerKind);
  }

  function problemRank(problem) {
    return Math.max(1, Math.min(6, Number(problem.rank || problem.difficulty || 1)));
  }

  function normalizeDifficultyCap(value) {
    const rank = Math.round(Number(value || DEFAULT_DIFFICULTY_CAP));
    return Math.max(1, Math.min(6, rank || DEFAULT_DIFFICULTY_CAP));
  }

  function activeDifficultyCap(records = loadRecords()) {
    const saved = records && records.settings ? records.settings.difficultyCap : undefined;
    return normalizeDifficultyCap(saved || selectedDifficultyCap || DEFAULT_DIFFICULTY_CAP);
  }

  function difficultyLevel(cap) {
    return DIFFICULTY_LEVELS[normalizeDifficultyCap(cap)] || DIFFICULTY_LEVELS[DEFAULT_DIFFICULTY_CAP];
  }

  function shouldApplyDifficultyCap(mode = {}) {
    return !mode.boss && !mode.examStyle && !mode.hardOnly;
  }

  function filterByDifficultyCap(pool, cap) {
    const maxRank = normalizeDifficultyCap(cap);
    return (pool || []).filter((problem) => problemRank(problem) <= maxRank);
  }

  function difficultyScopedCount(cap, topic = "all", packKey = "all") {
    const maxRank = normalizeDifficultyCap(cap);
    return problems.filter((problem) => {
      if (topic !== "all" && problem.topic !== topic) return false;
      if (packKey !== "all" && !matchesPack(problem, packKey)) return false;
      return problemRank(problem) <= maxRank;
    }).length;
  }

  function submitCurrentAnswer() {
    if (!quiz) return;
    const current = getCurrentProblem();
    const input = quiz.draft.trim();
    recordAnswer(resolveAnswerSubmission(current, input, "Wrong"));
  }

  function submitChoiceAnswer(input) {
    if (!quiz || quiz.feedback) return;
    quiz.draft = input;
    submitCurrentAnswer();
  }

  function resolveAnswerSubmission(problem, input, wrongReason) {
    const normalizedInput = String(input || "").trim();
    const result = checkAnswer(problem, normalizedInput);
    return {
      status: result.correct ? "correct" : "wrong",
      reason: result.correct ? "Correct" : wrongReason,
      input: normalizedInput,
      detail: result.message
    };
  }

  function recordAnswer({ status, reason, input, detail }) {
    if (!quiz) return;
    if (quiz.feedback) return;
    const problem = getCurrentProblem();
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const correct = status === "correct";
    const usedHints = quiz.hintsUsed?.[problem.id] || 0;
    const timeBonus = correct && !quiz.practice && !quiz.examMode ? Math.max(0, problem.timeLimit - elapsed) : 0;
    const difficultyBonus = problemRank(problem) * 10;
    const penalty = correct && !quiz.practice ? usedHints * hintPenalty(problem) : 0;
    const noHintBonus = correct && quiz.noHint ? 15 : 0;
    const earned = correct && !quiz.practice ? Math.max(0, 40 + difficultyBonus + timeBonus + noHintBonus - penalty) : 0;
    quiz.score += earned;
    if (!correct && quiz.accuracyMode && !quiz.practice) quiz.score = Math.max(0, quiz.score - 80);
    quiz.currentStreak = correct ? quiz.currentStreak + 1 : 0;
    quiz.bestStreak = Math.max(quiz.bestStreak, quiz.currentStreak);
    const recorded = {
      problem,
      input,
      correct,
      reason,
      elapsed,
      earned,
      hintsUsed: usedHints,
      boardStrokes: cloneBoardStrokes(problem.id),
      errorTag: "",
      causeAuto: false
    };
    quiz.answers.push(recorded);
    autosaveSession(true);
    // 草稿存進 IndexedDB（不是 localStorage —— 筆畫陣列一題就能到幾十 KB）。
    // 存的理由只有一個：重做錯題時，「我上次是哪一步算錯的」這個問題的答案
    // 就在上次的草稿裡。答對的也存，因為對照自己上次怎麼做對的同樣有用。
    persistBoard(problem, recorded);

    // 答錯時先幫使用者猜一個錯因並直接記下來（標成 causeAuto）。
    // 只在畫面上「預選」而不寫入的話，沒有主動點的人就完全不會產生資料，
    // 那這個功能等於不存在。使用者改選時會清掉 causeAuto，
    // 數據頁也會誠實標明有多少筆是系統推測的。
    if (!correct && !quiz.examMode) {
      const suggestion = suggestCause(problem, recorded);
      if (suggestion) {
        recorded.errorTag = recorded.unanswered ? "" : causeTagOf(suggestion.key);
        recorded.causeAuto = Boolean(recorded.errorTag);
      }
    }
    trackEvent("problem_submit", {
      mode: quiz.mode,
      topic: problem.topic,
      problem_id: problem.id,
      rank: problemRank(problem),
      answer_mode: quiz.answerMode,
      answer_kind: problem.answerKind,
      correct,
      reason,
      elapsed,
      earned,
      hints_used: usedHints,
      practice: Boolean(quiz.practice)
    });
    const wrongCount = quiz.answers.filter((answer) => !answer.correct).length;
    if (!correct && quiz.suddenDeath) quiz.forceFinishAfterFeedback = true;
    if (quiz.survival && wrongCount >= 3) quiz.forceFinishAfterFeedback = true;
    // Wrong answers no longer dump the whole solution here — the staged
    // 逐步解答 drawers below the message handle disclosure instead.
    quiz.feedback = {
      status: correct ? "correct" : reason === "Timeout" ? "timeout" : "wrong",
      title: correct ? (quiz.practice ? "答對" : `答對，+${earned}`) : answerReasonLabel(reason),
      message: detail || (correct ? "" : "先想想卡在哪一步，下面可以一段一段看解法。")
    };
    // 全螢幕書寫時答錯：回饋卡與「下一題」都在 fixed 的全螢幕外殼底下，
    // 看不到也點不到，而 feedback 一出現連「退出全螢幕」鈕都被 disabled ——
    // 使用者只能整局退出。所以回饋要停下來等人看的時候，先退出全螢幕。
    // 答對與大考模式會自動前進，維持原本停在書寫畫面的體驗。
    if (quiz.boardFullscreen && !correct && !quiz.examMode) {
      quiz.boardFullscreen = false;
      quiz.boardOpen = true;
      if (quiz.keypadBeforeFullscreen != null) {
        quiz.keypadOpen = quiz.keypadBeforeFullscreen;
        quiz.keypadBeforeFullscreen = null;
      }
    }
    stopTicker();
    // Correct answers keep the fast auto-advance; wrong answers wait for an
    // explicit「下一題」tap so the correction can actually be read. Exam mode
    // stays on auto-advance because its clock keeps running regardless.
    if (correct || quiz.examMode) {
      const pendingQuiz = quiz;
      window.setTimeout(() => {
        if (quiz !== pendingQuiz) return;
        advanceToNextQuestion();
      }, 950);
    }
    render();
    // 手機單欄版面時回饋卡疊在題目卡下面 —— 答錯要停下來看的那張卡
    // 可能整張在畫面外。block:"nearest"：已經看得到就完全不動。
    if (!correct && !quiz.examMode) {
      const panel = app.querySelector(".feedback");
      if (panel && typeof panel.scrollIntoView === "function") {
        panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }

  // 題目顯示。spec B 區 98 要求追蹤「開始題目」——沒有它就算不出
  // 「有多少人看到題目就放棄」這種漏斗數字。
  function trackProblemStart(problem) {
    if (!quiz || !problem) return;
    trackEvent("problem_start", {
      mode: quiz.mode,
      problem_id: problem.id,
      rank: problemRank(problem),
      index: quiz.index,
      answer_mode: quiz.answerMode
    });
  }

  // 大考的題號地圖：一排數字格，已答鎖住、目前題描邊、標記的有角標。
  // 點還沒答的格子直接跳過去 —— 跟紙本考卷「先寫會的」同一個動作。
  function renderExamQuestionMap() {
    if (!quiz || !quiz.examMode) return "";
    const answeredIds = new Set(quiz.answers.map((answer) => answer.problem.id));
    const flags = quiz.flags || {};
    const current = getCurrentProblem();
    const cells = quiz.problems
      .map((problem, index) => {
        const answered = answeredIds.has(problem.id);
        const flagged = Boolean(flags[problem.id]);
        const isCurrent = index === quiz.index;
        const classes = [
          "exam-map-cell",
          answered ? "is-answered" : "",
          isCurrent ? "is-current" : "",
          flagged ? "is-flagged" : ""
        ].filter(Boolean).join(" ");
        const label = `第 ${index + 1} 題${answered ? "（已作答）" : flagged ? "（已標記）" : ""}`;
        return answered
          ? `<span class="${classes}" title="${escapeAttr(label)}">${index + 1}</span>`
          : `<button class="${classes}" data-action="jump-question" data-index="${index}" title="${escapeAttr(label)}">${index + 1}</button>`;
      })
      .join("");
    const flagged = current && flags[current.id];
    return `
      <div class="exam-map" role="navigation" aria-label="考卷題號">
        <div class="exam-map-cells">${cells}</div>
        <button class="button ghost exam-flag ${flagged ? "is-on" : ""}" data-action="toggle-flag" title="標記這題，待會回來">
          ${icon("flag")}${flagged ? "取消標記" : "標記待回頭"}
        </button>
      </div>
    `;
  }

  // 大考模式的跳題與標記。
  //
  // 只有大考需要這個：其他模式一題一結、當場給回饋，沒有「先跳過、
  // 回頭再算」的空間。已作答的題鎖住不能跳回去 —— 這裡的模型是
  // 送出即定案（跟真的考卷一樣可以先寫別題，但交出去的答案不能改）。
  function jumpToQuestion(targetIndex) {
    if (!quiz || !quiz.examMode || quiz.feedback) return;
    const index = Number(targetIndex);
    if (!Number.isInteger(index) || index < 0 || index >= quiz.problems.length) return;
    if (index === quiz.index) return;
    const answeredIds = new Set(quiz.answers.map((answer) => answer.problem.id));
    if (answeredIds.has(quiz.problems[index].id)) return;
    // 這一題還沒送出的草稿要帶著走，輪回來繼續寫
    quiz.draftMap = quiz.draftMap || {};
    const current = getCurrentProblem();
    if (current) quiz.draftMap[current.id] = quiz.draft || "";
    quiz.index = index;
    quiz.draft = quiz.draftMap[quiz.problems[index].id] || "";
    quiz.questionStartedAt = Date.now();
    quiz.boardOpen = false;
    quiz.boardFullscreen = false;
    trackProblemStart(quiz.problems[index]);
    render();
  }

  function toggleQuestionFlag() {
    if (!quiz || !quiz.examMode) return;
    const current = getCurrentProblem();
    if (!current) return;
    quiz.flags = quiz.flags || {};
    quiz.flags[current.id] = !quiz.flags[current.id];
    render();
  }

  // 大考模式：找下一個還沒作答的題（從 index 之後開始、繞回來）。
  // 有跳題之後「下一題」不能再是 index+1 —— 跳過的題要能被輪回來。
  function nextUnansweredIndex(currentQuiz, fromIndex) {
    const answeredIds = new Set(currentQuiz.answers.map((answer) => answer.problem.id));
    const total = currentQuiz.problems.length;
    for (let step = 1; step <= total; step += 1) {
      const index = (fromIndex + step) % total;
      if (!answeredIds.has(currentQuiz.problems[index].id)) return index;
    }
    return -1;
  }

  function advanceToNextQuestion() {
    if (!quiz || !quiz.feedback) return;
    if (quiz.examMode) {
      const next = nextUnansweredIndex(quiz, quiz.index);
      if (next === -1) {
        finishQuiz();
        return;
      }
      quiz.index = next;
    } else {
      quiz.index += 1;
    }
    // 答對的回饋只停 950ms 就自動前進 —— 手機上「+40」根本來不及看
    //（使用者原話：「看不清綠頻上的東西」）。把它變成一個跟著下一題
    // 出現的小 toast，動畫淡出，不佔版面也不用點掉。
    if (quiz.feedback && quiz.feedback.status === "correct") {
      quiz.correctToast = { text: quiz.feedback.title, at: Date.now() };
    }
    if (quiz.index >= quiz.problems.length) {
      finishQuiz();
      return;
    }
    // 定位測驗：依上一題對錯，把下一個槽位換成 rank±1 池的題目。
    if (quiz.placement) advancePlacementLineup(quiz);
    quiz.questionStartedAt = Date.now();
    // 大考模式有跳題：離開時存進 draftMap 的草稿，輪回來要還原
    quiz.draft = (quiz.examMode && quiz.draftMap && quiz.draftMap[quiz.problems[quiz.index].id]) || "";
    quiz.feedback = null;
    quiz.modal = null;
    trackProblemStart(quiz.problems[quiz.index]);
    quiz.boardOpen = false;
    quiz.boardFullscreen = false;
    if (quiz.forceFinishAfterFeedback) {
      finishQuiz();
      return;
    }
    startTicker();
    render();
  }

  function finishQuiz() {
    stopTicker();
    if (quiz) {
      finalizeExamAnswers(quiz);
      const correct = quiz.answers.filter((answer) => answer.correct).length;
      trackEvent("session_complete", {
        mode: quiz.mode,
        topic: quiz.topic,
        answer_mode: quiz.answerMode,
        problem_count: quiz.problems.length,
        answered_count: quiz.answers.length,
        correct_count: correct,
        score: quiz.score,
        practice: Boolean(quiz.practice)
      });
      saveQuizRecord(quiz);
    }
    clearActiveSession();
    resultsDetailOpen = false;
    view = "results";
    render();
  }

  function finalizeExamAnswers(currentQuiz) {
    if (!currentQuiz || !currentQuiz.examMode || currentQuiz.examFinalized) return;
    currentQuiz.examFinalized = true;

    // 結算按 id 收，不能按 index 續走 —— 有跳題之後，answers 的順序
    // 是作答順序不是題目順序，「從 answers.length 開始補」會把已答的
    // 題重複記成未作答。
    const answeredIds = new Set(currentQuiz.answers.map((answer) => answer.problem.id));

    // 時間到的那一刻，畫面上正在寫的草稿照樣送出（含 draftMap 裡
    // 跳題留下的草稿）—— 寫了就該算，跟真的考卷收卷一樣。
    if (currentQuiz.examTimedOut) {
      const drafts = { ...(currentQuiz.draftMap || {}) };
      const current = currentQuiz.problems[currentQuiz.index];
      if (current) drafts[current.id] = String(currentQuiz.draft || "").trim() || drafts[current.id] || "";
      currentQuiz.problems.forEach((problem) => {
        if (answeredIds.has(problem.id)) return;
        const draft = String(drafts[problem.id] || "").trim();
        if (!draft) return;
        const elapsed = problem === current
          ? Math.max(0, Math.floor((Date.now() - currentQuiz.questionStartedAt) / 1000))
          : 0;
        appendFinalExamAnswer(currentQuiz, problem, resolveAnswerSubmission(problem, draft, "Timeout"), elapsed, false);
        answeredIds.add(problem.id);
      });
    }

    currentQuiz.problems.forEach((problem) => {
      if (answeredIds.has(problem.id)) return;
      appendFinalExamAnswer(
        currentQuiz,
        problem,
        {
          status: "wrong",
          reason: currentQuiz.examTimedOut ? "Timeout" : "Unanswered",
          input: "",
          detail: currentQuiz.examTimedOut ? "時間到，這題未送出。" : "交卷時未作答。"
        },
        0,
        true
      );
    });
  }

  function appendFinalExamAnswer(currentQuiz, problem, submission, elapsed, unanswered) {
    if (!problem || !submission) return;
    const correct = submission.status === "correct";
    const usedHints = currentQuiz.hintsUsed?.[problem.id] || 0;
    const difficultyBonus = problemRank(problem) * 10;
    const penalty = correct && !currentQuiz.practice ? usedHints * hintPenalty(problem) : 0;
    const noHintBonus = correct && currentQuiz.noHint ? 15 : 0;
    const earned = correct && !currentQuiz.practice ? Math.max(0, 40 + difficultyBonus + noHintBonus - penalty) : 0;
    currentQuiz.score += earned;
    currentQuiz.currentStreak = correct ? currentQuiz.currentStreak + 1 : 0;
    currentQuiz.bestStreak = Math.max(currentQuiz.bestStreak, currentQuiz.currentStreak);
    currentQuiz.answers.push({
      problem,
      input: submission.input,
      correct,
      reason: submission.reason,
      elapsed,
      earned,
      hintsUsed: usedHints,
      boardStrokes: unanswered ? [] : cloneBoardStrokes(problem.id),
      errorTag: "",
      unanswered: Boolean(unanswered)
    });
  }

  function startTicker() {
    stopTicker();
    if (quiz && (quiz.practice || quiz.noTimer)) return;
    tickHandle = window.setInterval(() => {
      if (!quiz || view !== "quiz") return;
      const current = getCurrentProblem();
      if (!current) return;
      const elapsed = Math.floor((Date.now() - quiz.questionStartedAt) / 1000);
      if (quiz.examMode && examTimeRemaining(quiz) <= 0) {
        quiz.examTimedOut = true;
        finishQuiz();
      } else if (!quiz.examMode && !quiz.feedback && elapsed >= questionTimeLimit(quiz, current)) {
        trackEvent("problem_timeout", {
          mode: quiz.mode,
          problem_id: current.id,
          rank: problemRank(current)
        });
        recordAnswer(resolveAnswerSubmission(current, quiz.draft || "", "Timeout"));
      } else {
        updateLiveQuizStats();
        autosaveSession(false);
      }
    }, 1000);
  }

  function updateLiveQuizStats() {
    if (!quiz || view !== "quiz") return;
    const current = getCurrentProblem();
    if (!current) return;
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const remaining = quiz.examMode ? examTimeRemaining(quiz) : Math.max(0, questionTimeLimit(quiz, current) - elapsed);
    const timeNode = app.querySelector('[data-live="time"]');
    const timeBox = app.querySelector('[data-live-box="time"]');
    const answeredNode = app.querySelector('[data-live="answered"]');
    if (timeNode) timeNode.textContent = quiz.examMode ? formatCountdown(remaining) : String(remaining);
    if (timeBox) timeBox.classList.toggle("is-danger", remaining <= (quiz.examMode ? 180 : 8));
    if (answeredNode) answeredNode.textContent = `${quiz.answers.length}/${quiz.problems.length}`;
  }

  function stopTicker() {
    if (tickHandle) {
      window.clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function getCurrentProblem() {
    return quiz ? quiz.problems[quiz.index] : null;
  }

  function examTimeRemaining(currentQuiz = quiz) {
    if (!currentQuiz || !currentQuiz.examMode || !currentQuiz.examEndAt) return 0;
    return Math.max(0, Math.ceil((currentQuiz.examEndAt - Date.now()) / 1000));
  }

  function formatCountdown(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds || 0)));
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}:${String(rest).padStart(2, "0")}`;
  }

  function hintsFor(problem) {
    if (Array.isArray(problem.hints) && problem.hints.length) return problem.hints;
    const hints = [];
    if (problem.topic === "limits") {
      hints.push("先找可否代入；若出現 0/0，再考慮展開、約分或標準極限。");
      hints.push("含三角函數時，優先想 sin x ~ x、1 - cos x ~ x^2/2。");
    }
    if (problem.topic === "derivatives") {
      hints.push("先判斷要用乘法、商法還是鏈鎖律。");
      hints.push("複合函數微分後，別忘了乘上內層導數。");
    }
    if (problem.topic === "integrals") {
      hints.push("先觀察是否能換元，找出函數與其導數是否同時出現。");
      hints.push("若是乘積型態，再考慮分部積分。");
    }
    if (problem.topic === "series") {
      hints.push("先判斷是等比、p 級數、交錯級數，或需要比較判別。");
      hints.push("收斂判定題要分清楚收斂、條件收斂與絕對收斂。");
    }
    if (problem.answerKind === "antiderivative") hints.push("不定積分答案可省略 +C，系統會檢查是否相差常數。");
    if (problem.answerKind === "expression") hints.push("答案請寫成 x 的函數，例如用 sin(x)、log(x)、sqrt(x)。");
    if (problem.answerKind === "numeric") hints.push("數值答案可用分數、pi、e、sqrt 表示。");
    if (problem.answerKind === "set") hints.push("把找到的值全部列出來，順序不影響判分 —— 但少一個就算錯。");
    if (problem.answerKind === "interval") hints.push("端點取不取得到，決定用小括號還是中括號。多段用 U 連起來。");
    return hints.slice(0, 3);
  }

  function hintPenalty(problem) {
    return 6 + problemRank(problem) * 2;
  }

  function checkAnswer(problem, input) {
    if (!input) return { correct: false, message: "沒有輸入答案。" };
    if (problem.answerKind === "numeric") {
      return checkNumeric(problem.answer, input);
    }
    if (problem.answerKind === "expression") {
      return checkExpression(problem.answer, input, problem.variables || problem.variable || "x", problemDomain(problem));
    }
    if (problem.answerKind === "antiderivative") {
      return checkAntiderivative(problem.answer, input, problem.variable || "x", problemDomain(problem));
    }
    if (problem.answerKind === "text") {
      return checkText(problem, input);
    }
    if (problem.answerKind === "set") {
      return checkSet(problem, input);
    }
    if (problem.answerKind === "interval") {
      return checkInterval(problem, input);
    }
    if (problem.answerKind === "graph") {
      return checkGraphChoice(problem, input);
    }
    if (problem.answerKind === "worksheet") {
      return checkWorksheet(problem, input);
    }
    return { correct: false, message: "這個題型目前不能自動判分。" };
  }

  // 選圖題：選項本身是圖，作答的值是那條曲線的式子。
  //
  // 用式子當值而不是 A/B/C/D，是因為選項會被洗牌 —— 位置不能當答案。
  // 比對是字串相等（正規化空白），不做數學等價：這裡的重點是
  // 「你選到的是不是那一張」，而不是「兩個式子是否等價」。
  function checkGraphChoice(problem, input) {
    const tidy = (value) => String(value || "").replace(/\s+/g, "");
    if (tidy(input) === tidy(problem.answer)) return { correct: true, message: "圖形判讀正確。" };
    const chosen = (problem.graphChoices || []).find((choice) => tidy(choice.expr) === tidy(input));
    return {
      correct: false,
      message: chosen && chosen.why ? chosen.why : "這張圖跟 f 的性質對不上。"
    };
  }

  // 題幹尾巴寫的定義域限制（",\ x>0"、"\quad(x\ge 1)"）。
  //
  // 為什麼要讀它：判分是「把兩個式子在幾個點上代入比較」。取樣點若跑到
  // 題目根本沒有定義的範圍，比出來的結果沒有意義。反過來說，題目**有**
  // 限制卻不讀，就會拿 x<0 的點去為難一個只需要在 x>0 成立的答案。
  //
  // 這條規則跟 tools/lib/verify_engine.js 的 stripDomain 是同一套語法，
  // 兩邊必須一致 —— 否則會出現「離線驗算說對、線上判分說錯」。
  const DOMAIN_TAIL = /[,\s]*(?:\\quad|\\qquad|\\,|\\;|\\ |\s)*\(?\s*([a-zA-Z])\s*(>=|<=|\\ge|\\geq|\\le|\\leq|\\neq|>|<)\s*(-?[0-9.]+)\s*\)?\s*$/;

  function problemDomain(problem) {
    if (problem.domain) return problem.domain;
    const match = String(problem.prompt || "").match(DOMAIN_TAIL);
    if (!match) return null;
    const operator = { "\\ge": ">=", "\\geq": ">=", "\\le": "<=", "\\leq": "<=", "\\neq": "!=" }[match[2]] || match[2];
    return { variable: match[1], operator, value: Number(match[3]) };
  }

  function inDomain(domain, vars) {
    if (!domain) return true;
    const value = vars[domain.variable];
    if (value === undefined) return true;
    switch (domain.operator) {
      case ">": return value > domain.value;
      case ">=": return value >= domain.value;
      case "<": return value < domain.value;
      case "<=": return value <= domain.value;
      case "!=": return value !== domain.value;
      default: return true;
    }
  }

  function checkNumeric(expected, input) {
    const normalized = normalizeText(input);
    if (["dne", "doesnotexist", "不存在"].includes(normalized)) {
      return { correct: normalizeText(expected) === "dne", message: "已用 DNE 判定。" };
    }
    const a = evaluateExpression(expected, {});
    const b = evaluateExpression(input, {});
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return { correct: false, message: "我讀不懂這個數值格式。可以用 pi/4、sqrt(2)、log(2) 這類寫法。" };
    }
    const tolerance = Math.max(1e-7, Math.abs(a) * 1e-6);
    const ok = Math.abs(a - b) <= tolerance;
    return {
      correct: ok,
      message: ok ? "數值等價。" : `數值不對。${friendlyWrongHint({ answerKind: "numeric" }, input, expected)}參考答案：${expected}`
    };
  }

  function checkExpression(expected, input, variable, domain) {
    const variables = Array.isArray(variable) ? variable : [variable];
    const samples = expressionSamples(variables).filter((vars) => inDomain(domain, vars));
    let valid = 0;
    for (const vars of samples) {
      const a = evaluateExpression(expected, vars);
      const b = evaluateExpression(input, vars);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      valid += 1;
      const tolerance = Math.max(1e-6, Math.abs(a) * 1e-5);
      if (Math.abs(a - b) > tolerance) {
        return { correct: false, message: `在 ${formatVars(vars)} 代入時不相同。${friendlyWrongHint({ answerKind: "expression", variable: variables[0] }, input, expected)}參考答案：${expected}` };
      }
    }
    return {
      correct: valid >= 3,
      message: valid >= 3 ? "多點代入等價。" : "格式讀不穩。請用 2*x、sin(x)、log(x) 這種寫法。"
    };
  }

  // 原本的取樣點全是正數（0.35 … 4.4）。那有一個很實際的漏洞：
  // sqrt(x²) 和 x 在正數上完全一樣，但它們不是同一個函數。
  // 只用正數取樣，這種答案一定判對。加入負值之後才有辦法分開。
  //
  // 同時把「好看的數字」換成無理數附近的值：0.5、1、2 這種點上，
  // 不同的函數剛好撞在一起的機率高得多（sin(π/6)=1/2 這類巧合）。
  const ANTIDERIVATIVE_SAMPLES = [0.3137, 0.7211, 1.2345, 1.9871, 3.3013, -0.6180, -1.3247, -2.1069];

  function expressionSamples(variables) {
    const base = ANTIDERIVATIVE_SAMPLES;
    if (variables.length === 1) return base.map((value) => ({ [variables[0]]: value }));
    return base.map((value, index) => {
      return variables.reduce((vars, name, offset) => {
        vars[name] = value + (offset + 1) * 0.27 + index * 0.11;
        return vars;
      }, {});
    });
  }

  function formatVars(vars) {
    return Object.entries(vars)
      .map(([name, value]) => `${name}=${Math.round(value * 100) / 100}`)
      .join(", ");
  }

  function checkAntiderivative(expected, input, variable, domain) {
    const samples = ANTIDERIVATIVE_SAMPLES.filter((x) => inDomain(domain, { [variable]: x }));
    const diffs = [];
    for (const x of samples) {
      const vars = { [variable]: x };
      const a = evaluateExpression(expected, vars);
      const b = evaluateExpression(stripConstant(input), vars);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      diffs.push(b - a);
    }
    if (diffs.length < 3) {
      return { correct: false, message: "答案無法穩定解析。請用 x、sin(x)、log(x) 這類寫法。" };
    }
    const base = diffs[0];
    const ok = diffs.every((value) => Math.abs(value - base) <= Math.max(1e-5, Math.abs(base) * 1e-5));
    return {
      correct: ok,
      message: ok ? "原函數相差常數，判定正確。" : `微分後不相同。${friendlyWrongHint({ answerKind: "antiderivative", variable }, input, expected)}參考答案：${expected}`
    };
  }

  // ── 集合與區間 ─────────────────────────────────────────────
  //
  // 微積分裡有一整類問題，現有的四種答案型別一種都裝不下：
  //   「求所有臨界點」        答案是一組數，順序無所謂
  //   「f 的定義域是什麼」    答案是區間或區間的聯集，端點開閉有差
  //   「哪些 x 使級數收斂」   同上
  //
  // 以前只能硬塞成 text，然後靠字串比對 —— 於是 {2, -1} 和 {-1, 2} 會被判錯，
  // 而 (0,1] 打成 (0, 1] 也會被判錯。這種「答對卻被判錯」比判寬鬆更傷，
  // 因為使用者會停止相信判分。
  //
  // 兩種型別都走數值比對：集合比元素多重集合，區間比端點與開閉。

  // "{1, -2, pi/3}" / "1, -2" / "x=1, x=-2" → [數值]
  function parseNumberSet(input) {
    const raw = String(input || "").trim();
    // 空集合是一個**合法的答案**，不是格式錯誤。
    // 「這個函數沒有極大值」必須表達得出來，而且不能被判成「你填錯格式」。
    if (/^\{\s*\}$/.test(raw) || /^(無|沒有|none|empty|∅)$/i.test(raw)) return [];
    const cleaned = raw
      .replace(/[{}]/g, "")
      .replace(/\b[a-zA-Z]\s*=/g, "")
      .trim();
    if (!cleaned) return null;
    const parts = cleaned.split(/[,;]|、/).map((part) => part.trim()).filter(Boolean);
    if (!parts.length) return null;
    const values = parts.map((part) => evaluateExpression(part, {}));
    if (values.some((value) => !Number.isFinite(value))) return null;
    return values.sort((a, b) => a - b);
  }

  function checkSet(problem, input) {
    const expected = parseNumberSet(problem.answer);
    const actual = parseNumberSet(input);
    if (!expected) return { correct: false, message: "這題的參考答案格式有問題，請回報。" };
    if (!actual) {
      return { correct: false, message: "集合請寫成 {1, -2} 或 1, -2 這種形式，元素可以用 pi/3、sqrt(2)。" };
    }
    if (actual.length !== expected.length) {
      return {
        correct: false,
        message: `元素個數不對：你給了 ${actual.length} 個，答案有 ${expected.length} 個。參考答案：${problem.answer}`
      };
    }
    const same = expected.every((value, index) => {
      const tolerance = Math.max(1e-7, Math.abs(value) * 1e-6);
      return Math.abs(value - actual[index]) <= tolerance;
    });
    return {
      correct: same,
      message: same ? "集合元素完全吻合（順序不影響）。" : `集合內容不對。參考答案：${problem.answer}`
    };
  }

  // "(-inf, 2) U [3, 5]" → [{lo, hi, loOpen, hiOpen}]
  function parseIntervals(input) {
    const raw = String(input || "").trim();
    // 空區間是合法答案，不是格式錯誤。
    // 「這個函數沒有凹向下的區間」（例如 x²−4x+3）必須表達得出來 ——
    // 跟空集合同一個道理。收得寬一點：中英文與符號都認。
    if (/^(無|沒有|不存在|none|empty|∅|\{\s*\}|\(\s*\))$/i.test(raw)) return [];
    const text = raw
      .replace(/∪/g, "U")
      .replace(/\\cup/g, "U")
      .replace(/\s+/g, "");
    if (!text) return null;
    const pieces = text.split(/U|u\b/).filter(Boolean);
    if (!pieces.length) return null;
    const parsed = [];
    for (const piece of pieces) {
      // 端點本身可以含括號（sqrt(3)/3、log(2)），所以不能用
      // 「不含 ) 的字元類」去抓 —— 那個寫法在 sqrt(3)/3 上直接失敗，
      // 而使用者會看到「參考答案格式有問題」，明明是判分器讀不動。
      // 改成：頭尾各取一個括號，中間按**深度 0 的逗號**切開。
      const open = piece[0];
      const close = piece[piece.length - 1];
      if (!"([".includes(open) || !")]".includes(close) || piece.length < 4) return null;
      const inner = piece.slice(1, -1);
      let depth = 0;
      let comma = -1;
      for (let i = 0; i < inner.length; i += 1) {
        const ch = inner[i];
        if (ch === "(" || ch === "[") depth += 1;
        else if (ch === ")" || ch === "]") depth -= 1;
        else if (ch === "," && depth === 0) { comma = i; break; }
      }
      if (comma < 0) return null;
      const match = [piece, open, inner.slice(0, comma), inner.slice(comma + 1), close];
      const lo = parseEndpoint(match[2]);
      const hi = parseEndpoint(match[3]);
      if (!Number.isFinite(lo) && lo !== -Infinity) return null;
      if (!Number.isFinite(hi) && hi !== Infinity) return null;
      if (lo > hi) return null;
      parsed.push({ lo, hi, loOpen: match[1] === "(", hiOpen: match[4] === ")" });
    }
    return parsed.sort((a, b) => a.lo - b.lo || a.hi - b.hi);
  }

  function parseEndpoint(text) {
    const normalized = String(text).trim().toLowerCase();
    if (/^[-−]\s*(inf|infty|infinity|∞)$/.test(normalized)) return -Infinity;
    if (/^\+?\s*(inf|infty|infinity|∞)$/.test(normalized)) return Infinity;
    return evaluateExpression(text, {});
  }

  function checkInterval(problem, input) {
    const expected = parseIntervals(problem.answer);
    const actual = parseIntervals(input);
    if (!expected) return { correct: false, message: "這題的參考答案格式有問題，請回報。" };
    if (!actual) {
      return { correct: false, message: "區間請寫成 (0, 1]、[2, inf) 這種形式，聯集用 U 連接。" };
    }
    if (actual.length !== expected.length) {
      return {
        correct: false,
        message: `區間段數不對：你給了 ${actual.length} 段，答案是 ${expected.length} 段。參考答案：${problem.answer}`
      };
    }
    for (let index = 0; index < expected.length; index += 1) {
      const want = expected[index];
      const got = actual[index];
      const near = (a, b) => (a === b) || Math.abs(a - b) <= Math.max(1e-7, Math.abs(a) * 1e-6);
      if (!near(want.lo, got.lo) || !near(want.hi, got.hi)) {
        return { correct: false, message: `端點不對。參考答案：${problem.answer}` };
      }
      // 開閉是這個題型的重點。端點對了但開閉錯，代表沒搞清楚
      // 端點到底屬不屬於定義域 —— 那正是這類題目要考的事。
      if (want.loOpen !== got.loOpen || want.hiOpen !== got.hiOpen) {
        return { correct: false, message: `端點的開閉不對（差在中括號還是小括號）。參考答案：${problem.answer}` };
      }
    }
    return { correct: true, message: "區間與開閉都吻合。" };
  }

  function checkText(problem, input) {
    const normalized = normalizeText(input);
    const ok = problem.answers.some((answer) => normalizeText(answer) === normalized);
    return {
      correct: ok,
      message: ok ? "文字判定吻合。" : `判定不對。參考答案：${problem.canonical || problem.answers[0]}`
    };
  }

  function getChoiceOptions(problem) {
    if (!quiz.choiceOptions) quiz.choiceOptions = {};
    if (quiz.choiceOptions[problem.id]) return quiz.choiceOptions[problem.id];

    const correct = displayAnswer(problem);
    const options = [];
    const seen = new Set();
    const addOption = (value, isCorrect) => {
      const normalized = normalizeChoice(value);
      if (!normalized || seen.has(normalized)) return;
      if (!isCorrect && checkAnswer(problem, value).correct) return;
      seen.add(normalized);
      options.push({
        value,
        label: value
      });
    };

    addOption(correct, true);
    buildChoiceDistractors(problem, correct).forEach((value) => addOption(value, false));
    // 題目可以自帶誘答；有自帶就不要再從題庫其他答案亂抓。
    if (!authoredDistractors(problem).length) {
      fallbackChoiceDistractors(problem).forEach((value) => addOption(value, false));
    }

    const shuffled = shuffle(
      options.slice(0, 4),
      seedFromString(`${quiz.startedAt}-${problem.id}-${quiz.index}-choices`)
    );
    quiz.choiceOptions[problem.id] = shuffled;
    return shuffled;
  }

  // 題目可以自己帶 distractors: ["…"]。用在「誘答必須是特定幾個選項」的題型，
  // 從題庫其他答案亂抓會抓出完全不相干的選項。
  function authoredDistractors(problem) {
    return Array.isArray(problem.distractors) ? problem.distractors.filter((value) => String(value || "").trim()) : [];
  }

  function buildChoiceDistractors(problem, correct) {
    const authored = authoredDistractors(problem);
    if (authored.length) return shuffle(authored.slice(), seedFromString(`${problem.id}-authored-distractors`));
    const sameKind = problems.filter((item) => item.id !== problem.id && item.answerKind === problem.answerKind);
    const sameTopic = sameKind.filter((item) => item.topic === problem.topic);
    // 誘答取自其他題的答案 —— 真實答案比亂數更像誘答，因為它們長得像人算得出來的東西。
    // 但少了量級過濾就會出事：梯子問題的答案是 3/4，選項裡卻冒出 94586
    // （那是題庫裡另一題的答案）。那種選項不會讓人猶豫，只會讓人一眼認出
    // 「哪個是亂放的」，等於把四選一變成三選一，還順便讓產品看起來很隨便。
    const answerPool = [...sameTopic, ...sameKind]
      .map(displayAnswer)
      .filter((value) => numericallyPlausibleDistractor(correct, value));
    const generated = generatedChoiceDistractors(problem, correct);
    return shuffle([...generated, ...answerPool], seedFromString(`${problem.id}-distractors`));
  }

  // 誘答跟正解要在同一個量級上才有鑑別力。
  // 非數值的答案（DNE、收斂/發散、含變數的式子）算不出數字，交給其他規則判，
  // 這裡一律放行 —— 寧可少擋，也不要把合理的誘答誤殺。
  const MAX_DISTRACTOR_RATIO = 25;

  function numericallyPlausibleDistractor(correct, candidate) {
    const target = evaluateExpression(correct, {});
    const value = evaluateExpression(candidate, {});
    if (!Number.isFinite(target) || !Number.isFinite(value)) return true;
    // 跟正解等值的東西不能當誘答（同一題可能有兩種寫法）
    if (Math.abs(target - value) <= Math.max(1e-9, Math.abs(target) * 1e-9)) return false;
    const scale = Math.max(Math.abs(target), 1);
    return Math.abs(value) <= scale * MAX_DISTRACTOR_RATIO;
  }

  function fallbackChoiceDistractors(problem) {
    const variable = problem.variable || "x";
    if (problem.answerKind === "text") return ["收斂", "發散", "條件收斂", "絕對收斂", "converges", "diverges"];
    if (problem.answerKind === "numeric") return ["-2", "-1", "0", "1", "2", "pi", "e", "DNE"];
    if (problem.answerKind === "antiderivative") {
      return ["0", variable, `${variable}^2`, `${variable}^3`, `log(${variable})`, `sin(${variable})`, `cos(${variable})`, `exp(${variable})`];
    }
    if (problem.answerKind === "expression") {
      return ["0", "1", "-1", variable, `${variable}^2`, `sin(${variable})`, `cos(${variable})`, `exp(${variable})`];
    }
    return ["0", "1", "DNE"];
  }

  function choiceDistractorReason(problem, value, expectedValue = "") {
    const correct = expectedValue || displayAnswer(problem);
    if (authoredDistractors(problem).length) return "這是同一張表上最容易記混的選項，回去把規則再過一次。";
    if (problem.answerKind === "text") return "判定方向不同；先確認端點、絕對/條件或 DNE 條件。";
    const variable = problem.variable || "x";
    const normalized = normalizeChoice(value);
    if (normalized === normalizeChoice(`-(${correct})`) || normalized === normalizeChoice(`-${correct}`)) return "像是符號相反。";
    if (normalized === normalizeChoice(`2*(${correct})`)) return "像是係數多乘一倍。";
    if (normalized === normalizeChoice(`(${correct})/2`)) return "像是係數少了一半。";
    if (normalized === normalizeChoice(stripOuterScale(correct))) return "像是漏掉外層係數。";
    if (normalized === normalizeChoice(stripLikelyChainFactor(correct, variable))) return "像是漏掉鏈鎖律或換元係數。";
    if (String(value).includes(`+${variable}`) || String(value).includes(`-${variable}`)) return "像是多加了不該有的項。";
    if (problem.answerKind === "numeric") return numericDistractorReason(correct, value);
    if (problem.answerKind === "antiderivative") return "檢查微分回去是否得到原 integrand。";
    return "檢查符號、係數與鏈鎖律。";
  }

  function numericDistractorReason(expected, input) {
    const a = evaluateExpression(expected, {});
    const b = evaluateExpression(input, {});
    if (!Number.isFinite(a) || !Number.isFinite(b)) return "這是常見干擾值。";
    const close = (target) => Number.isFinite(target) && Math.abs(b - target) <= Math.max(1e-6, Math.abs(target) * 1e-5);
    // 順序即優先序：先驗結構性的錯（號、倒數、平方），再驗係數滑掉。
    // 每一條都要能一句話說出「你是怎麼走到這個值的」—— 說不出來的不加。
    if (close(-a)) return "像是漏負號。";
    if (a && close(1 / a)) return "像是取倒數了。";
    if (a && close(-1 / a)) return "像是取倒數又掉了負號。";
    if (close(a * a) && Math.abs(a) > 1e-6 && Math.abs(Math.abs(a) - 1) > 1e-6) return "像是多平方了一次。";
    if (a >= 0 && close(Math.sqrt(a)) && Math.abs(a - 1) > 1e-6) return "像是多開了一次根號。";
    if (close(a * 2)) return "像是多乘 2。";
    if (close(a / 2)) return "像是少了一個 2 —— 積分或半角公式最常掉在這裡。";
    if (close(a * 3)) return "像是係數多乘 3。";
    if (close(a / 3)) return "像是少除 3。";
    if (close(a * Math.PI)) return "像是多乘了一個 π。";
    if (Math.abs(a) > 1e-9 && close(a / Math.PI)) return "像是把 π 除掉了 —— sin(πx) 積分後的 1/π 別漏。";
    if (close(a + 1)) return "像是多加 1 —— 冪次或上下限差一。";
    if (close(a - 1)) return "像是少 1 —— 冪次或上下限差一。";
    if (close(a * Math.E)) return "像是多乘一個 e。";
    if (Math.abs(a) > 1e-9 && close(a / Math.E)) return "像是少乘一個 e。";
    if (a > 0 && close(Math.log(a)) && Math.abs(a - 1) > 0.1) return "像是多取了一次 log。";
    if (close(Math.exp(a)) && Math.abs(a) > 0.1) return "像是把指數忘在外面了。";
    // 走到這裡代表**看不出**它是怎麼錯的 ——
    // 說不知道比斷言一件系統不知道的事誠實。
    return "這個值和正確答案對不上；回頭檢查第一步的判型。";
  }

  function friendlyWrongHint(problem, input, expected) {
    const hint = problem.answerKind === "numeric"
      ? numericDistractorReason(expected, input)
      : choiceDistractorReason(problem, input, expected);
    return hint ? `${hint} ` : "";
  }

  function generatedChoiceDistractors(problem, correct) {
    if (problem.answerKind === "text") {
      return ["收斂", "發散", "條件收斂", "絕對收斂"];
    }
    if (problem.answerKind === "numeric") {
      return numericChoiceDistractors(correct);
    }
    if (problem.answerKind === "antiderivative") {
      const variable = problem.variable || "x";
      return [
        `-(${correct})`,
        `2*(${correct})`,
        `(${correct})/2`,
        `(${correct})+${variable}`,
        stripOuterScale(correct),
        "0",
        variable,
        `${variable}^2`,
        `log(${variable})`,
        `sin(${variable})`,
        `exp(${variable})`
      ];
    }
    if (problem.answerKind === "expression") {
      const variable = problem.variable || "x";
      return [
        `-(${correct})`,
        `(${correct})+1`,
        `(${correct})-${variable}`,
        `${variable}*(${correct})`,
        `(${correct})/${variable}`,
        `2*(${correct})`,
        `(${correct})/2`,
        stripOuterScale(correct),
        stripLikelyChainFactor(correct, variable),
        "0",
        "1"
      ];
    }
    return ["0", "1", "DNE"];
  }

  function numericChoiceDistractors(correct) {
    const value = evaluateExpression(correct, {});
    const generated = [`-(${correct})`, `1/(${correct})`, `(${correct})+1`, `(${correct})-1`, `2*(${correct})`, `(${correct})/2`, "0", "1"];
    if (!Number.isFinite(value)) return generated;
    return [
      formatChoiceNumber(-value),
      formatChoiceNumber(value ? 1 / value : Number.NaN),
      formatChoiceNumber(value + 1),
      formatChoiceNumber(value - 1),
      formatChoiceNumber(value * 2),
      formatChoiceNumber(value / 2),
      ...generated
    ];
  }

  function formatChoiceNumber(value) {
    if (!Number.isFinite(value)) return "";
    const rounded = Math.round(value * 1000000) / 1000000;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  }

  function stripOuterScale(value) {
    const text = String(value || "");
    return text
      .replace(/^2\*/, "")
      .replace(/^\((.*)\)\/2$/, "$1")
      .replace(/^(.+)\/2$/, "$1")
      .replace(/^(.+)\*2$/, "$1");
  }

  function stripLikelyChainFactor(value, variable) {
    const text = String(value || "");
    return text
      .replace(new RegExp(`\\*?2\\*${variable}`, "g"), "")
      .replace(new RegExp(`${variable}\\*`, "g"), "")
      .replace(/\*3/g, "");
  }

  function normalizeChoice(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  function evaluateExpression(source, vars) {
    try {
      const expr = normalizeExpression(source);
      if (!expr) return Number.NaN;
      const allowed = new Set([
        ...Object.keys(vars),
        "sin",
        "cos",
        "tan",
        "asin",
        "acos",
        "atan",
        "log",
        "exp",
        "sqrt",
        "abs",
        "pow",
        "sinh",
        "cosh",
        "tanh",
        "sec",
        "csc",
        "cot",
        "PI",
        "E",
        "Infinity"
      ]);
      const identifiers = expr.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
      if (identifiers.some((identifier) => !allowed.has(identifier))) return Number.NaN;
      const names = Object.keys(vars);
      const values = Object.values(vars);
      const body = `"use strict"; const {sin,cos,tan,asin,acos,atan,log,exp,sqrt,abs,pow,sinh,cosh,tanh,PI,E}=Math; const sec=(v)=>1/cos(v); const csc=(v)=>1/sin(v); const cot=(v)=>1/tan(v); return (${expr});`;
      const fn = new Function(...names, body);
      return Number(fn(...values));
    } catch (_error) {
      return Number.NaN;
    }
  }

  function normalizeExpression(source) {
    let expr = String(source || "").trim();
    expr = expr.replace(/\\left/g, "");
    expr = expr.replace(/\\right/g, "");
    expr = expr.replace(/\\cdot/g, "*");
    expr = replaceTexFractions(expr);
    expr = replaceTexPowerGroups(expr);
    expr = replaceNaturalExponential(expr);
    expr = expr.replace(/\\pi/g, "pi");
    expr = expr.replace(/\\ln\s*\(/gi, "log(");
    expr = expr.replace(/\\log\s*\(/gi, "log(");
    expr = expr.replace(/\\exp\s*\(/gi, "exp(");
    expr = expr.replace(/\\sin\s*\(/gi, "sin(");
    expr = expr.replace(/\\cos\s*\(/gi, "cos(");
    expr = expr.replace(/\\tan\s*\(/gi, "tan(");
    expr = expr.replace(/\\arctan\s*\(/gi, "atan(");
    expr = expr.replace(/\\arcsin\s*\(/gi, "asin(");
    expr = expr.replace(/\\arccos\s*\(/gi, "acos(");
    expr = expr.replace(/\\sinh\s*\(/gi, "sinh(");
    expr = expr.replace(/\\cosh\s*\(/gi, "cosh(");
    expr = expr.replace(/\\tanh\s*\(/gi, "tanh(");
    expr = expr.replace(/\\sec\s*\(/gi, "sec(");
    expr = expr.replace(/\\csc\s*\(/gi, "csc(");
    expr = expr.replace(/\\cot\s*\(/gi, "cot(");
    expr = expr.replace(/π/g, "pi");
    expr = expr.replace(/∞/g, "Infinity");
    expr = expr.replace(/\bln\s*\(/gi, "log(");
    expr = expr.replace(/\barctan\s*\(/gi, "atan(");
    expr = expr.replace(/\barcsin\s*\(/gi, "asin(");
    expr = expr.replace(/\barccos\s*\(/gi, "acos(");
    expr = expr.replace(/\bln\b/gi, "log");
    expr = expr.replace(/\barctan\b/gi, "atan");
    expr = expr.replace(/\barcsin\b/gi, "asin");
    expr = expr.replace(/\barccos\b/gi, "acos");
    expr = expr.replace(/\bsinh\s*\(/gi, "sinh(");
    expr = expr.replace(/\bcosh\s*\(/gi, "cosh(");
    expr = expr.replace(/\btanh\s*\(/gi, "tanh(");
    expr = expandBareFunctionArguments(expr);
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/\bpi\b/gi, "PI");
    expr = expr.replace(/\be\b/g, "E");
    expr = expr.replace(/\s+/g, "");
    expr = normalizeUnaryPower(expr);
    expr = applyImplicitMultiplication(expr);
    if (/[^0-9a-zA-Z_+\-*/().,]/.test(expr)) return "";
    if (/(constructor|window|document|globalThis|Function|eval|=>|;|=)/.test(expr)) return "";
    return expr;
  }

  function normalizeUnaryPower(expr) {
    let output = "";
    for (let index = 0; index < expr.length; index += 1) {
      if (expr[index] !== "-" || !isUnaryMinusPosition(expr, index)) {
        output += expr[index];
        continue;
      }
      const base = readPowerAtom(expr, index + 1);
      if (!base || expr.slice(base.end, base.end + 2) !== "**") {
        output += expr[index];
        continue;
      }
      const exponent = readPowerAtom(expr, base.end + 2);
      if (!exponent) {
        output += expr[index];
        continue;
      }
      output += `-(${expr.slice(index + 1, exponent.end)})`;
      index = exponent.end - 1;
    }
    return output;
  }

  function isUnaryMinusPosition(expr, index) {
    return index === 0 || "+-*/,([".includes(expr[index - 1]);
  }

  function readPowerAtom(expr, start) {
    if (start >= expr.length) return null;
    if (expr[start] === "(") {
      let depth = 0;
      for (let index = start; index < expr.length; index += 1) {
        if (expr[index] === "(") depth += 1;
        if (expr[index] === ")") depth -= 1;
        if (depth === 0) return { end: index + 1 };
      }
      return null;
    }
    const match = expr.slice(start).match(/^([A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?)/);
    return match ? { end: start + match[0].length } : null;
  }

  function applyImplicitMultiplication(expr) {
    const functionNames = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "log", "exp", "sqrt", "abs", "pow", "sinh", "cosh", "tanh", "sec", "csc", "cot"]);
    const splitIdentifier = (identifier) => {
      if (functionNames.has(identifier) || ["PI", "E", "Infinity"].includes(identifier)) return identifier;
      return identifier.split("").join("*");
    };
    return String(expr || "")
      .replace(/(\d|\))(?=[A-Za-z_(])/g, "$1*")
      .replace(/\)(?=\d)/g, ")*")
      .replace(/(PI|E)(?=[A-Za-z_(])/g, "$1*")
      .replace(/[A-Za-z_][A-Za-z0-9_]*/g, splitIdentifier)
      .replace(/([A-Za-z_][A-Za-z0-9_]*)(?=\()/g, (name) => (functionNames.has(name) ? name : `${name}*`));
  }

  function replaceTexFractions(source) {
    let output = "";
    let cursor = 0;
    const command = "\\frac";
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const numerator = readGroup(source, index + command.length);
      const denominator = numerator ? readGroup(source, numerator.end) : null;
      if (!numerator || !denominator) {
        output += source.slice(cursor, index + command.length);
        cursor = index + command.length;
        continue;
      }
      output += `${source.slice(cursor, index)}((${numerator.value})/(${denominator.value}))`;
      cursor = denominator.end;
    }
    return output;
  }

  function replaceTexPowerGroups(source) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf("^", cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const group = readGroup(source, index + 1);
      if (!group) {
        output += source.slice(cursor, index + 1);
        cursor = index + 1;
        continue;
      }
      output += `${source.slice(cursor, index)}^(${group.value})`;
      cursor = group.end;
    }
    return output;
  }

  function replaceNaturalExponential(source) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf("e", cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      let powerCursor = index + 1;
      while (/\s/.test(source[powerCursor] || "")) powerCursor += 1;
      if (source[powerCursor] !== "^") {
        output += source.slice(cursor, index + 1);
        cursor = index + 1;
        continue;
      }
      const argument = readExpressionAtom(source, powerCursor + 1);
      if (!argument) {
        output += source.slice(cursor, powerCursor + 1);
        cursor = powerCursor + 1;
        continue;
      }
      output += `${source.slice(cursor, index)}exp(${argument.value})`;
      cursor = argument.end;
    }
    return output;
  }

  function expandBareFunctionArguments(source) {
    const aliases = {
      arcsin: "asin",
      arccos: "acos",
      arctan: "atan",
      ln: "log"
    };
    const functionNames = ["arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "asin", "acos", "atan", "sqrt", "sin", "cos", "tan", "log", "exp", "abs", "sec", "csc", "cot", "ln"];
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const name = functionNames.find((candidate) => source.slice(cursor).toLowerCase().startsWith(candidate));
      if (!name) {
        output += source[cursor];
        cursor += 1;
        continue;
      }
      const canonical = aliases[name] || name;
      const next = cursor + name.length;
      if (source[next] === "(") {
        if (/[A-Za-z0-9_)]$/.test(output)) output += "*";
        output += canonical;
        cursor = next;
        continue;
      }
      const argument = readBareFunctionArgument(source, next);
      if (!argument) {
        output += canonical;
        cursor = next;
        continue;
      }
      if (/[A-Za-z0-9_)]$/.test(output)) output += "*";
      output += `${canonical}(${argument.value})`;
      cursor = argument.end;
    }
    return output;
  }

  function readBareFunctionArgument(source, start) {
    let cursor = start;
    while (/\s/.test(source[cursor] || "")) cursor += 1;
    if (source[cursor] === "(") return null;
    if (source.slice(cursor, cursor + 2).toLowerCase() === "pi") return { value: "pi", end: cursor + 2 };
    if (source[cursor] && /[A-Za-z]/.test(source[cursor])) return { value: source[cursor], end: cursor + 1 };
    if (source[cursor] && /[0-9.]/.test(source[cursor])) {
      const match = source.slice(cursor).match(/^[0-9.]+/);
      if (match) return { value: match[0], end: cursor + match[0].length };
    }
    return null;
  }

  function readExpressionAtom(source, start) {
    let cursor = start;
    while (/\s/.test(source[cursor] || "")) cursor += 1;
    if (source[cursor] === "{") return readGroup(source, cursor);
    if (source[cursor] === "(") return readParenGroup(source, cursor);
    if (source[cursor] === "\\") {
      const command = source.slice(cursor).match(/^\\[A-Za-z]+/);
      if (command) return { value: command[0], end: cursor + command[0].length };
    }
    if (cursor < source.length) return { value: source[cursor], end: cursor + 1 };
    return null;
  }

  function readParenGroup(source, start) {
    if (source[start] !== "(") return null;
    let depth = 0;
    for (let index = start; index < source.length; index += 1) {
      if (source[index] === "(") depth += 1;
      if (source[index] === ")") depth -= 1;
      if (depth === 0) {
        return {
          value: source.slice(start + 1, index),
          end: index + 1
        };
      }
    }
    return null;
  }

  function stripConstant(input) {
    return String(input || "")
      .replace(/\+\s*C\b/i, "")
      .replace(/-\s*C\b/i, "");
  }

  function insertToken(token) {
    const input = app.querySelector("#answer");
    if (!input || !quiz) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const raw = String(token || "");
    const marker = raw.indexOf("|");
    const clean = raw.replace("|", "");
    const next = input.value.slice(0, start) + clean + input.value.slice(end);
    input.value = next;
    quiz.draft = next;
    const cursor = start + (marker >= 0 ? marker : clean.length);
    input.focus();
    input.setSelectionRange(cursor, cursor);
    updateAnswerPreview(next);
  }

  // 數學鍵盤的退格。系統鍵盤被 inputmode=none 關掉之後，
  // 使用者打錯一個字唯一的辦法是切回系統鍵盤 —— 那等於鍵盤白做了。
  // 有選取刪選取、沒選取刪游標前一字，跟實體鍵盤同一套語意。
  // 手寫辨識（#12 v1）：把計算紙上的數字讀進輸入框當**草稿**。
  // 永遠只是預填、永遠不自動送出 —— 模板還沒被真人手寫驗證過，
  // 所以它的定位是省打字，不是代替眼睛。
  function canReadInk(problem) {
    if (!window.BuzzInkRead || !problem || problem.answerKind !== "numeric") return false;
    const strokes = quiz && quiz.boardStrokes && quiz.boardStrokes[problem.id];
    return Boolean(strokes && strokes.length);
  }

  function readInkAnswer() {
    const problem = getCurrentProblem();
    if (!problem || !window.BuzzInkRead) return;
    const strokes = (quiz.boardStrokes && quiz.boardStrokes[problem.id]) || [];
    const result = window.BuzzInkRead.readAnswer(strokes);
    if (!result.text) { showAppNotice("計算紙上讀不到可辨識的數字。"); return; }
    replaceAnswerDraft(result.text);
    if (!result.confident) showAppNotice("讀到「" + result.text + "」但不太確定 —— 檢查一下再送出。");
  }

  function backspaceAnswer() {
    const input = app.querySelector("#answer");
    if (!input || !quiz) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    if (start === 0 && end === 0) { input.focus(); return; }
    const from = start === end ? start - 1 : start;
    const next = input.value.slice(0, from) + input.value.slice(end);
    input.value = next;
    quiz.draft = next;
    input.focus();
    input.setSelectionRange(from, from);
    updateAnswerPreview(next);
  }

  function replaceAnswerDraft(value) {
    const input = app.querySelector("#answer");
    if (!input || !quiz) return;
    quiz.draft = String(value || "");
    input.value = quiz.draft;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    updateAnswerPreview(input.value);
  }

  function clearAnswerDraft() {
    replaceAnswerDraft("");
  }

  function updateAnswerPreview(value) {
    const node = app.querySelector("[data-answer-preview]");
    if (!node || !quiz) return;
    const problem = getCurrentProblem();
    const hasValue = Boolean(String(value || "").trim());
    node.dataset.tex = answerToTex(value, problem) || "\\text{尚未輸入}";
    node.classList.toggle("is-empty", !hasValue);
    renderMathNode(node, false);
    const statusNode = app.querySelector("[data-syntax-status]");
    if (statusNode) {
      const syntax = answerSyntaxInfo(problem, value);
      statusNode.textContent = syntax.label;
      statusNode.className = `syntax-pill ${syntax.className}`;
    }
  }

  // ---- 手寫計算紙 ──────────────────────────────────────────────
  //
  // 真正的使用情境是 iPad + Apple Pencil，而那個情境有四個瀏覽器預設行為
  // 會直接把它毀掉：
  //
  //   1. 長按會選字、跳放大鏡與「拷貝／查詢」選單。用筆算式的時候
  //      手掌或筆尖碰到旁邊的題目，整段就反白起來 —— 這是最煩的一個。
  //   2. 手掌在 iPad 上是一個 pointerType:"touch" 的事件，跟筆同時發生。
  //      不擋掉的話寫字會拖出一條橫貫全頁的線。
  //   3. pointermove 每個 frame 只觸發一次，但 Pencil 取樣是 120–240Hz。
  //      不撈 coalesced events，寫快一點筆跡就變成多邊形。
  //   4. 每次 move 重畫整塊板子是 O(n²)。算到第三行就開始頓。
  //
  // 對應的處理依序是：CSS 關掉選取與 callout、看到筆之後短時間內忽略觸控、
  // getCoalescedEvents()、以及只畫新增的那一段。

  // 看到筆之後這段時間內的觸控一律視為手掌。
  //
  // 這個數字兩邊都會出事：太短擋不住手掌，太長會讓「放下筆改用手指」
  // 卡住不動 —— 而使用者感覺到的不是「防手掌」，是「這個板子不靈敏」。
  //
  // 手掌幾乎都是跟筆一起或稍早落下，不是在筆離開一秒之後才落下，
  // 所以窗格只要蓋住「筆剛離開」那一瞬間就夠。1400ms 原本太保守了。
  const PALM_WINDOW_MS = 700;

  const BOARD_INK = { paper: "#1d2b3a", board: "#fff8de" };

  function boardSurface() {
    try {
      const settings = loadRecords().settings || {};
      return settings.boardSurface === "board" ? "board" : "paper";
    } catch (_error) {
      return "paper";
    }
  }

  function setBoardSurface(name) {
    const records = loadRecords();
    records.settings = records.settings || {};
    records.settings.boardSurface = name === "board" ? "board" : "paper";
    saveRecords(records);
  }

  function setupBlackboard() {
    const canvas = app.querySelector("[data-blackboard]");
    if (!quiz) return;
    const current = getCurrentProblem();
    const problemId = canvas?.dataset.problemId || current?.id || "";
    // desynchronized 讓 Safari 走低延遲路徑：筆跡跟著筆尖，而不是跟著 frame。
    // alpha 必須留著 —— 紙的方格是 CSS 背景，橡皮擦用 destination-out 挖洞。
    const ctx = canvas ? canvas.getContext("2d", { desynchronized: true }) : null;
    let currentStroke = null;
    let activePointerId = null;
    let lastPenAt = 0;
    // 整筆共用一份 rect（見 blackboardPoint 的註解）。書寫中頁面不會捲動
    // （touch-action:none + pointer capture），所以只要在落筆與尺寸變動時更新。
    let cachedRect = null;
    let captured = false;

    app.querySelectorAll("[data-board-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!quiz || quiz.feedback) return;
        const action = button.dataset.boardAction;
        if (action === "toggle") {
          quiz.boardOpen = !quiz.boardOpen;
          if (!quiz.boardOpen) quiz.boardFullscreen = false;
          // 平板：攤開計算紙就直接進全螢幕。
          //
          // 量過的數字：iPad 上題目與選項佔掉畫面上緣 800px（直式）／711px（橫式），
          // 書寫區從那裡才開始 —— 也就是**要捲動才寫得到**，而捲下去之後題目又不見了。
          // 在平板上「攤開計算紙」和「想要一塊夠大的地方寫」本來就是同一件事，
          // 中間那一步只是多按一次。全螢幕的版面（題目在上、書寫區佔滿、選項在下）
          // 本來就存在而且測過，這裡只是讓它成為平板上的自然狀態。
          // 桌機不受影響：pointer: coarse 把滑鼠排除在外。
          if (quiz.boardOpen && isCoarsePointerTablet()) quiz.boardFullscreen = true;
          render();
          return;
        }
        if (action === "tool") {
          // 換筆／橡皮擦只改兩顆按鈕的狀態，不需要重繪整個畫面 ——
          // render() 會把 canvas 整個換掉，然後把所有筆畫重畫一次。
          // 寫滿一頁之後那一下看得出來卡，而使用者只是想換個工具。
          quiz.boardTool = button.dataset.tool || "pen";
          quiz.boardOpen = true;
          app.querySelectorAll('[data-board-action="tool"]').forEach((node) => {
            node.classList.toggle("is-active", node.dataset.tool === quiz.boardTool);
            node.setAttribute("aria-pressed", node.dataset.tool === quiz.boardTool ? "true" : "false");
          });
          if (canvas) canvas.dataset.tool = quiz.boardTool;
          return;
        }
        if (action === "fullscreen") {
          quiz.boardFullscreen = !quiz.boardFullscreen;
          quiz.boardOpen = true;
          // 全螢幕的重點是書寫區要夠大。輸入鍵盤攤開會吃掉將近一半的高度，
          // 而這個模式下使用者是在紙上算，不是在敲鍵盤 —— 所以先收起來。
          // 收起來不是鎖住，想用還是點得開。
          if (quiz.boardFullscreen) {
            quiz.keypadBeforeFullscreen = quiz.keypadOpen;
            quiz.keypadOpen = false;
          } else if (quiz.keypadBeforeFullscreen != null) {
            quiz.keypadOpen = quiz.keypadBeforeFullscreen;
            quiz.keypadBeforeFullscreen = null;
          }
          render();
          return;
        }
        if (action === "surface") {
          // 換紙／黑板改的是 CSS 背景與墨色。畫布不用重建，
          // 但既有的筆畫要用新的墨色重畫一次（黑板上的深藍看不見）。
          const next = boardSurface() === "paper" ? "board" : "paper";
          setBoardSurface(next);
          const canvas = app.querySelector("[data-blackboard]");
          if (canvas) {
            canvas.dataset.surface = next;
            const ctx = canvas.getContext("2d", { desynchronized: true });
            if (ctx) drawStrokesOnBlackboard(canvas, ctx, getBoardStrokes(canvas.dataset.problemId || ""));
          }
          app.querySelectorAll("[data-review-board], [data-previous-board]").forEach((node) => {
            node.dataset.surface = next;
          });
          button.title = next === "paper" ? "換成黑板" : "換成方格紙";
          const glyph = button.querySelector(".icon, [data-lucide]");
          if (glyph) glyph.setAttribute("data-lucide", next === "paper" ? "moon" : "grid-3x3");
          renderIcons();
          return;
        }
        // 復原與清除不重繪整個畫面 —— render() 會把 canvas 整個換掉，
        // 於是一次「復原」要重畫全部筆畫，在 iPad 上看得出來卡一下。
        const strokes = getBoardStrokes(problemId);
        if (action === "undo") {
          const undone = strokes.pop();
          if (undone) getBoardRedo(problemId).push(undone);
        }
        if (action === "redo") {
          const restored = getBoardRedo(problemId).pop();
          if (restored) strokes.push(restored);
        }
        if (action === "clear") {
          // 清空也要能救回來 —— 一次點掉整頁計算是最痛的誤觸。
          // 倒著推進堆疊，這樣一次一次重做會照原本的順序長回來；
          // 順序不是小事：橡皮擦筆畫要蓋在它當初擦掉的那幾筆之後才對。
          const removed = strokes.splice(0, strokes.length);
          const redo = getBoardRedo(problemId);
          for (let i = removed.length - 1; i >= 0; i -= 1) redo.push(removed[i]);
        }
        if (canvas && ctx) drawBlackboard(canvas, ctx, problemId);
        updateBoardCount(strokes.length);
      });
    });

    if (!canvas || !ctx) return;

    resizeBlackboard(canvas);
    drawBlackboard(canvas, ctx, problemId);

    // 旋轉 iPad 或進出全螢幕之後 canvas 尺寸會變，內容要跟著重畫。
    if (typeof window.ResizeObserver === "function") {
      const observer = new window.ResizeObserver(() => {
        if (!canvas.isConnected) {
          observer.disconnect();
          return;
        }
        if (resizeBlackboard(canvas)) drawBlackboard(canvas, ctx, problemId);
      });
      observer.observe(canvas);
    }

    // 長按叫出來的選單會直接中斷書寫，而且在 iPad 上很容易誤觸。
    canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    // 手掌判定。看到筆就記時間；接下來一小段時間內的觸控一律忽略。
    function acceptsPointer(event) {
      if (currentStroke && event.pointerId !== activePointerId) return false;
      if (event.pointerType === "pen") {
        lastPenAt = Date.now();
        return true;
      }
      if (event.pointerType === "touch" && Date.now() - lastPenAt < PALM_WINDOW_MS) return false;
      return true;
    }

    canvas.addEventListener("pointerdown", (event) => {
      if (!quiz || quiz.feedback) return;
      if (currentStroke) return; // 已經有一支筆在寫了，第二個接觸點忽略
      if (!acceptsPointer(event)) return;
      event.preventDefault();
      activePointerId = event.pointerId;
      cachedRect = canvas.getBoundingClientRect();
      captured = false;
      try {
        canvas.setPointerCapture(event.pointerId);
        captured = true;
      } catch (_error) {
        // Safari 偶爾會在 capture 上丟例外，不影響書寫
      }
      currentStroke = {
        tool: quiz.boardTool || "pen",
        points: [blackboardPoint(canvas, event, cachedRect)]
      };
      const strokes = getBoardStrokes(problemId);
      strokes.push(currentStroke);
      // 新的一筆會作廢重做堆疊 —— 分支的歷史留著只會讓「重做」跳到別的地方去。
      clearBoardRedo(problemId);
      paintStrokeTail(canvas, ctx, currentStroke, true);
      updateBoardCount(strokes.length);
    });

    // 相鄰兩個取樣點近到看不出差別時就不收。
    //
    // 慢慢寫的時候（算數學本來就慢）觸控筆會在原地回報一堆抖動的座標，
    // 那些點會被二次曲線放大成一段毛邊。門檻取次像素等級，
    // 所以丟掉它們不會讓線變短或變鈍，只會少掉抖動 —— 順便省下點數。
    const JITTER_PX = 0.6;

    function pushSamples(samples) {
      const box = cachedRect || canvas.getBoundingClientRect();
      let added = false;
      for (let index = 0; index < samples.length; index += 1) {
        const point = blackboardPoint(canvas, samples[index], box);
        const previous = currentStroke.points[currentStroke.points.length - 1];
        if (previous) {
          const dx = (point.x - previous.x) * box.width;
          const dy = (point.y - previous.y) * box.height;
          if (dx * dx + dy * dy < JITTER_PX * JITTER_PX) continue;
        }
        currentStroke.points.push(point);
        added = true;
      }
      if (added) paintStrokeTail(canvas, ctx, currentStroke, false);
    }

    function onMove(event) {
      if (!currentStroke || event.pointerId !== activePointerId) return;
      event.preventDefault();
      // Pencil 一個 frame 可以產生四五個取樣點。只取 event 本身
      // 會丟掉其中大部分，寫快的時候就是一條折線。
      const batch = typeof event.getCoalescedEvents === "function"
        ? event.getCoalescedEvents()
        : [event];
      pushSamples(batch && batch.length ? batch : [event]);
    }

    // pointerrawupdate 是瀏覽器能給的最早的一手座標：它不等 rAF 的節奏，
    // 一有新取樣就送，所以墨水會更貼著筆尖。Safari 目前沒有這個事件。
    //
    // **只能掛一個。**
    //
    // 這裡一度兩個都掛，理由是「重複的座標會被 JITTER_PX 濾掉」。那是錯的：
    // 瀏覽器先為每個原始取樣送一次 rawupdate，然後每個 frame 送一次 move，
    // 而那個 move 的 getCoalescedEvents() 會把整個 frame 的取樣**再交出來一次**。
    // 去抖動比的是「新的點 vs 上一個存下來的點」——批次的第一個點跟批次的
    // 最後一個點距離很遠，濾不掉。結果是每個取樣存兩次、筆跡每個 frame
    // 往回跳一次、繪製量變成三倍。實測 320 個取樣畫出 1000 段。
    //
    // 上線後的當機就是這樣來的。而當初改成「兩個都掛」的理由，
    // 是為了讓只送 pointermove 的舊測試繼續通過 —— 為了測試改 production，
    // 然後 production 壞給使用者看。測試要去配合真實行為，不是相反。
    if ("onpointerrawupdate" in canvas) {
      canvas.addEventListener("pointerrawupdate", onMove);
    } else {
      canvas.addEventListener("pointermove", onMove);
    }

    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    // 有 pointer capture 的時候指標離開畫布不會觸發 pointerleave，
    // 而且也不該收筆 —— 寫到邊緣再回來是正常的事。
    // 只有在 capture 失敗（Safari 偶爾會丟例外）時才需要靠 leave 收尾，
    // 否則會在使用者只是寫過頭一點點的時候把筆畫切斷。
    canvas.addEventListener("pointerleave", (event) => {
      if (captured) return;
      endStroke(event);
    });

    // Apple Pencil 懸浮預覽（M2 之後的 iPad 支援 hover）：
    // 筆還沒落下時顯示落點，對「要從上次寫到一半的地方接下去」特別有用。
    //
    // 實作刻意跟墨水管線完全分離：hover 是 buttons===0 的 pointermove，
    // 畫畫時 buttons!==0 這裡第一行就 return —— 上次的當機教訓是
    // 別在熱路徑上疊東西，所以這裡是獨立監聽器＋一顆 position:fixed 的
    // DOM 點，連 canvas 都不重畫。
    const hoverDot = (() => {
      let dot = document.getElementById("pen-hover-dot");
      if (!dot) {
        dot = document.createElement("div");
        dot.id = "pen-hover-dot";
        dot.setAttribute("aria-hidden", "true");
        document.body.appendChild(dot);
      }
      return dot;
    })();
    const hideHover = () => { hoverDot.style.opacity = "0"; };
    canvas.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "pen" || event.buttons !== 0) { hideHover(); return; }
      const size = Math.max(4, 2.4 * penScaleSetting() * 2);
      hoverDot.style.width = `${size}px`;
      hoverDot.style.height = `${size}px`;
      hoverDot.style.transform = `translate(${event.clientX - size / 2}px, ${event.clientY - size / 2}px)`;
      hoverDot.style.opacity = "1";
    });
    canvas.addEventListener("pointerleave", hideHover);
    canvas.addEventListener("pointerdown", hideHover);

    // 兩指點一下 = 復原。iPad 上的標準手勢（備忘錄、Procreate 都是這樣），
    // 而且比去點工具列的小按鈕快得多 —— 寫錯一個符號的時候手不用離開紙面。
    // 只認「沒有移動的短促點擊」，所以不會跟手掌或捲動搞混。
    setupTwoFingerUndo(canvas, problemId, () => {
      if (canvas && ctx) drawBlackboard(canvas, ctx, problemId);
    });

    function endStroke(event) {
      if (!currentStroke || event.pointerId !== activePointerId) return;
      paintStrokeTail(canvas, ctx, currentStroke, true);
      currentStroke = null;
      activePointerId = null;
      cachedRect = null;
      captured = false;
      try {
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch (_error) {
        // 同上
      }
    }
  }

  // ---- 復原 / 重做 ────────────────────────────────────────────
  //
  // 原本只有復原，而且是 strokes.pop() —— 按錯一下那一筆就永遠回不來了。
  // 手寫的時候按錯是常態（手掌壓到、想擦卻按到復原），沒有重做等於
  // 每一次誤觸都要重寫一行。

  function getBoardRedo(problemId) {
    if (!quiz.boardRedo) quiz.boardRedo = {};
    if (!quiz.boardRedo[problemId]) quiz.boardRedo[problemId] = [];
    return quiz.boardRedo[problemId];
  }

  function clearBoardRedo(problemId) {
    if (quiz && quiz.boardRedo) quiz.boardRedo[problemId] = [];
  }

  function setupTwoFingerUndo(canvas, problemId, repaint) {
    let touches = 0;
    let startedAt = 0;
    let moved = false;
    canvas.addEventListener("touchstart", (event) => {
      touches = event.touches.length;
      if (touches === 2) {
        startedAt = Date.now();
        moved = false;
      }
    }, { passive: true });
    canvas.addEventListener("touchmove", () => { moved = true; }, { passive: true });
    canvas.addEventListener("touchend", (event) => {
      if (touches !== 2 || moved || event.touches.length) return;
      touches = 0;
      if (Date.now() - startedAt > 400) return;
      if (!quiz || quiz.feedback) return;
      const strokes = getBoardStrokes(problemId);
      const undone = strokes.pop();
      if (undone) getBoardRedo(problemId).push(undone);
      repaint();
      updateBoardCount(strokes.length);
    }, { passive: true });
  }

  // 筆畫數的標籤不需要整頁重繪才更新。
  function updateBoardCount(count) {
    const label = app.querySelector("[data-board-count]");
    if (label) label.textContent = count ? `${count} 筆` : "手寫草稿";
  }

  function setupReviewBoards() {
    if (!quiz || view !== "results") return;
    app.querySelectorAll("[data-review-board]").forEach((canvas) => {
      const answer = quiz.answers[Number(canvas.dataset.reviewBoard)];
      if (!answer || !answer.boardStrokes || !answer.boardStrokes.length) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      resizeBlackboard(canvas);
      drawStrokesOnBlackboard(canvas, ctx, answer.boardStrokes);
    });
  }

  // 存草稿。整段包在 try 裡，而且不 await —— 草稿保存是加分項，
  // 任何情況下都不該影響作答流程（無痕模式、額度用完、瀏覽器不支援）。
  function persistBoard(problem, recorded) {
    if (!window.BuzzBoardStore || !recorded.boardStrokes || !recorded.boardStrokes.length) return;
    try {
      window.BuzzBoardStore.saveBoard(problem.id, recorded.boardStrokes, {
        correct: recorded.correct,
        answer: recorded.input
      });
    } catch (_error) {
      // 靜默：使用者不需要知道草稿沒存起來
    }
  }

  // 進到一題時，如果它是錯題重做且有上次的草稿，就把草稿拉回來。
  // 非同步拿到之後才 render，避免每題都因為一個可能不存在的東西多繪一次。
  function loadPreviousBoard(problem) {
    if (!window.BuzzBoardStore || !problem) return;
    if (previousBoard.problemId === problem.id) return;
    previousBoard = { problemId: problem.id, entry: null, open: false };
    try {
      window.BuzzBoardStore.loadBoard(problem.id).then((entry) => {
        if (!entry || !quiz || !quiz.problems || quiz.problems[quiz.index] !== problem) return;
        previousBoard = { problemId: problem.id, entry, open: false };
        render();
      });
    } catch (_error) {
      // 同上，靜默
    }
  }

  // 「上次的草稿」摺疊區。預設收起來 —— 直接攤開等於把上次的做法塞到眼前，
  // 那就不是重做而是照抄了。
  function renderPreviousBoard(problem) {
    if (!previousBoard.entry || previousBoard.problemId !== problem.id) return "";
    const entry = previousBoard.entry;
    const days = Math.max(0, Math.round((Date.now() - entry.savedAt) / 86400000));
    const when = days === 0 ? "今天" : `${days} 天前`;
    return `
      <details class="previous-board"${previousBoard.open ? " open" : ""}>
        <summary>
          <span>上次的草稿（${when}，${entry.correct ? "答對" : "答錯"}${entry.answer ? "：" + escapeHtml(entry.answer) : ""}）</span>
        </summary>
        <canvas class="blackboard is-readonly" data-previous-board="${escapeAttr(problem.id)}" data-surface="${boardSurface()}" aria-label="上次的手寫草稿"></canvas>
      </details>
    `;
  }

  function setupPreviousBoard() {
    if (!previousBoard.entry) return;
    const canvas = app.querySelector("[data-previous-board]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    resizeBlackboard(canvas);
    drawStrokesOnBlackboard(canvas, ctx, previousBoard.entry.strokes);
  }

  function getBoardStrokes(problemId) {
    if (!quiz.boardStrokes) quiz.boardStrokes = {};
    if (!quiz.boardStrokes[problemId]) quiz.boardStrokes[problemId] = [];
    return quiz.boardStrokes[problemId];
  }

  function cloneBoardStrokes(problemId) {
    if (!quiz || !quiz.boardStrokes || !quiz.boardStrokes[problemId]) return [];
    return quiz.boardStrokes[problemId].map((stroke) => ({
      tool: stroke.tool,
      points: stroke.points.map((point) => ({ ...point }))
    }));
  }

  // 回傳有沒有真的改變尺寸 —— 尺寸沒變就不必重畫（重畫會清掉內容）。
  function resizeBlackboard(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));
    if (canvas.width === width && canvas.height === height) return false;
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  // rect 由呼叫端傳進來，不在這裡量。
  //
  // 這個函式在一次 pointermove 裡會被呼叫五到十次（coalesced 取樣），
  // 而 getBoundingClientRect() 每一次都會逼瀏覽器重算版面。
  // 一秒 120 次 move × 每次 8 個取樣 = 每秒近千次強制 layout，
  // 全部發生在「使用者正在寫字」的那條路徑上。量一次、整筆共用就好。
  function blackboardPoint(canvas, event, rect) {
    const box = rect || canvas.getBoundingClientRect();
    // 座標存成 0–1 的比例，跟畫布尺寸無關 —— 這樣旋轉 iPad 或
    // 進出全螢幕之後，舊筆畫還畫得回原來的相對位置。
    return {
      x: (event.clientX - box.left) / Math.max(1, box.width),
      y: (event.clientY - box.top) / Math.max(1, box.height),
      // 滑鼠一律回報 0.5；Pencil 才有真的壓力。0 要當成沒有壓力資訊，
      // 不然用滑鼠或手指畫出來的線會細到看不見。
      pressure: event.pressure > 0 ? event.pressure : 0.5,
      // 是不是真的有壓感。沒有的話繪製端改用速度決定粗細 ——
      // 否則手指和滑鼠畫出來會是一條從頭到尾等寬的死線。
      pen: event.pointerType === "pen"
    };
  }

  function drawBlackboard(canvas, ctx, problemId) {
    drawStrokesOnBlackboard(canvas, ctx, getBoardStrokes(problemId));
  }

  const PEN_SCALES = [
    { key: "thin", label: "細", value: 0.75 },
    { key: "standard", label: "標準", value: 1 },
    { key: "thick", label: "粗", value: 1.3 }
  ];

  function penScaleSetting() {
    try {
      const key = (loadRecords().settings || {}).penScale || "standard";
      const entry = PEN_SCALES.find((item) => item.key === key);
      return entry ? entry.value : 1;
    } catch (_error) {
      return 1;
    }
  }

  function setPenScale(key) {
    if (!PEN_SCALES.some((item) => item.key === key)) return;
    const records = loadRecords();
    records.settings = records.settings || {};
    records.settings.penScale = key;
    saveRecords(records);
    render();
  }

  function boardRenderOptions(canvas, finish) {
    return {
      finish: Boolean(finish),
      ratio: Math.min(2, window.devicePixelRatio || 1),
      surface: (canvas && canvas.dataset && canvas.dataset.surface) || boardSurface(),
      penScale: penScaleSetting()
    };
  }

  function drawStrokesOnBlackboard(canvas, ctx, strokes) {
    // 繪製核心已經搬到 src/kernel/board_render.js。
    // 這裡照 kernel 的規矩用特徵偵測接：檔案沒載到也不能讓計算紙壞掉。
    if (window.BuzzBoardRender && typeof window.BuzzBoardRender.paintAll === "function") {
      window.BuzzBoardRender.paintAll(canvas, ctx, strokes, boardRenderOptions(canvas, true));
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((stroke) => {
      stroke.drawnTo = 0;
      paintStrokeTail(canvas, ctx, stroke, true);
    });
  }

  function boardInkColor(canvas) {
    const surface = (canvas && canvas.dataset && canvas.dataset.surface) || boardSurface();
    return BOARD_INK[surface] || BOARD_INK.paper;
  }

  // 只畫還沒畫過的那一段。stroke.drawnTo 記到哪裡了；
  // 這是「寫滿一頁還不會頓」跟「每次 move 重畫全部」的差別。
  //
  // 實作已經搬到 kernel/board_render.js；這裡保留一份等價的後備，
  // 因為 kernel 是可以被單獨拿掉的（三條鐵律的第一條）。
  function paintStrokeTail(canvas, ctx, stroke, finish) {
    if (window.BuzzBoardRender && typeof window.BuzzBoardRender.paintStrokeTail === "function") {
      window.BuzzBoardRender.paintStrokeTail(canvas, ctx, stroke, boardRenderOptions(canvas, finish));
      return;
    }
    const points = stroke.points;
    if (!points.length) return;
    const isEraser = stroke.tool === "eraser";
    const ratio = Math.min(2, window.devicePixelRatio || 1);

    ctx.save();
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : boardInkColor(canvas);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const baseWidth = (isEraser ? 20 : 2.4) * ratio;
    const widthAt = (point) => (isEraser ? baseWidth : baseWidth * (0.55 + 1.05 * point.pressure));

    // 單點：點一下要留下一個點，不是什麼都沒有。
    if (points.length === 1) {
      if (!stroke.drawnTo) {
        const only = points[0];
        ctx.beginPath();
        ctx.arc(only.x * canvas.width, only.y * canvas.height, widthAt(only) / 2, 0, Math.PI * 2);
        ctx.fill();
        stroke.drawnTo = 1;
      }
      ctx.restore();
      return;
    }

    const px = (point) => point.x * canvas.width;
    const py = (point) => point.y * canvas.height;
    const mid = (a, b) => ({ x: (px(a) + px(b)) / 2, y: (py(a) + py(b)) / 2 });

    // 以「相鄰兩點的中點」為端點、以取樣點本身為控制點畫二次曲線。
    // 這是把折線變成手寫感最便宜的做法，而且逐段可畫。
    let index = Math.max(1, stroke.drawnTo || 1);
    for (; index < points.length - 1; index += 1) {
      const previous = points[index - 1];
      const control = points[index];
      const next = points[index + 1];
      const from = mid(previous, control);
      const to = mid(control, next);
      ctx.beginPath();
      ctx.lineWidth = widthAt(control);
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(px(control), py(control), to.x, to.y);
      ctx.stroke();
    }
    stroke.drawnTo = Math.max(1, points.length - 1);

    // 收筆時把最後一小段補到真正的終點，否則每一筆都會短一截。
    if (finish && points.length >= 2) {
      const last = points[points.length - 1];
      const beforeLast = points[points.length - 2];
      const from = mid(beforeLast, last);
      ctx.beginPath();
      ctx.lineWidth = widthAt(last);
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(px(last), py(last));
      ctx.stroke();
      stroke.drawnTo = points.length;
    }

    ctx.restore();
  }

  function loadRecords() {
    try {
      return normalizeRecords(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (_error) {
      return normalizeRecords({});
    }
  }

  function saveRecords(records) {
    const next = normalizeRecords(records);
    backupRecords(next, false);
    // Feature 7：雲端同步衝突規則採「updatedAt 最新者獲勝」，
    // 所以每一次本機寫入都要蓋上新的時間戳。
    next.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function normalizeRecords(records) {
    const next = records && typeof records === "object" ? records : {};
    next.attempts = Number(next.attempts || 0);
    next.practiceRuns = Number(next.practiceRuns || 0);
    next.bestScore = Number(next.bestScore || 0);
    next.bestStreak = Number(next.bestStreak || 0);
    next.totalAnswered = Number(next.totalAnswered || 0);
    next.totalCorrect = Number(next.totalCorrect || 0);
    next.mistakes = next.mistakes && typeof next.mistakes === "object" ? next.mistakes : {};
    next.history = Array.isArray(next.history) ? next.history : [];
    next.achievements = next.achievements && typeof next.achievements === "object" ? next.achievements : {};
    next.topicStats = next.topicStats && typeof next.topicStats === "object" ? next.topicStats : {};
    next.problemStats = next.problemStats && typeof next.problemStats === "object" ? next.problemStats : {};
    next.daily = next.daily && typeof next.daily === "object" ? next.daily : {};
    next.pathUnlocks = next.pathUnlocks && typeof next.pathUnlocks === "object" ? next.pathUnlocks : {};
    next.pathGateAttempts = next.pathGateAttempts && typeof next.pathGateAttempts === "object" ? next.pathGateAttempts : {};
    next.pathLessonRuns = next.pathLessonRuns && typeof next.pathLessonRuns === "object" ? next.pathLessonRuns : {};
    next.proofs = next.proofs && typeof next.proofs === "object" ? next.proofs : {};
    next.favorites = next.favorites && typeof next.favorites === "object" ? next.favorites : {};
    next.problemReports = next.problemReports && typeof next.problemReports === "object" ? next.problemReports : {};
    next.streakShields = next.streakShields && typeof next.streakShields === "object" ? next.streakShields : {};
    next.namedExams = next.namedExams && typeof next.namedExams === "object" ? next.namedExams : {};
    next.placement = next.placement && typeof next.placement === "object"
      ? {
          rank: Math.max(1, Math.min(6, Math.round(Number(next.placement.rank) || 1))),
          date: typeof next.placement.date === "string" ? next.placement.date : "",
          weakTag: typeof next.placement.weakTag === "string" ? next.placement.weakTag : ""
        }
      : null;
    next.settings = next.settings && typeof next.settings === "object" ? next.settings : {};
    next.settings.difficultyCap = normalizeDifficultyCap(next.settings.difficultyCap || DEFAULT_DIFFICULTY_CAP);
    // 每日一題：dateKey → {problemId, correct, elapsed, hintsUsed, reason}，只記首次挑戰。
    next.dailyOne = next.dailyOne && typeof next.dailyOne === "object" ? next.dailyOne : {};
    // 延遲回測：最近一次主線課程 {nodeId, at, doneAt}。隔天回測 5 題（testing effect）。
    next.pathRetest = next.pathRetest && typeof next.pathRetest === "object" ? next.pathRetest : null;
    // 信心自評：problemId -> {level, correct, at}。只記最近一次。
    next.conf = next.conf && typeof next.conf === "object" ? next.conf : {};
    // 考試倒推：plan 是當前那一場，planHistory 封存過去的（考後報告要用）。
    next.plan = next.plan && typeof next.plan === "object" ? next.plan : null;
    next.planHistory = Array.isArray(next.planHistory) ? next.planHistory : [];
    next.planReportSeen = typeof next.planReportSeen === "string" ? next.planReportSeen : "";
    next.backupNoticeSeen = Boolean(next.backupNoticeSeen);
    next.onboardingContext = typeof next.onboardingContext === "string" ? next.onboardingContext : "";
    next.onboardingLevel = typeof next.onboardingLevel === "string" ? next.onboardingLevel : "";
    next.onboardingSeen = Boolean(next.onboardingSeen);
    // Feature 6：每週挑戰正式成績（weekKey → {score,total,timeMs,code,at}）。
    next.weeklyChallenge = next.weeklyChallenge && typeof next.weeklyChallenge === "object" ? next.weeklyChallenge : {};
    // Feature 7：雲端同步的衝突判定時間戳。
    next.updatedAt = typeof next.updatedAt === "string" ? next.updatedAt : "";
    // Records v2：分層儲存（attemptLog / sessions）。第一次載入時從 history
    // 惰性回填，之後每場結束再增量寫入。kernel 沒載入時整段跳過，
    // 紀錄仍然是合法的 v1，舊行為完全不受影響。
    if (window.BuzzRecords) {
      try {
        window.BuzzRecords.normalize(next);
      } catch (_error) {
        // 分層儲存壞掉不能連帶讓使用者存不了紀錄
      }
    }
    return next;
  }

  function saveQuizRecord(currentQuiz) {
    const records = loadRecords();
    const finishedAt = new Date().toISOString();
    const correct = currentQuiz.answers.filter((answer) => answer.correct).length;
    const total = currentQuiz.problems.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const avgTime = averageAnswerTime(currentQuiz.answers);
    const previousRecent = recentAnswerStats(records, 30);
    const beforeMistakes = new Set(Object.keys(records.mistakes || {}));
    currentQuiz.speedInsight = speedInsightText(avgTime, previousRecent.avgSeconds);

    if (currentQuiz.practice) {
      records.practiceRuns = (records.practiceRuns || 0) + 1;
    } else {
      records.attempts = (records.attempts || 0) + 1;
      records.bestScore = Math.max(records.bestScore || 0, currentQuiz.score);
    }
    records.bestStreak = Math.max(records.bestStreak || 0, currentQuiz.bestStreak);
    records.totalAnswered = (records.totalAnswered || 0) + currentQuiz.answers.length;
    records.totalCorrect = (records.totalCorrect || 0) + correct;
    records.lastPlayed = finishedAt;

    const answerContext = { mistakesMode: currentQuiz.mode === "mistakes" };
    currentQuiz.answers.forEach((answer) => updateAnswerRecords(records, answer, finishedAt, answerContext));
    currentQuiz.mistakesCleared = currentQuiz.answers.filter((answer) => beforeMistakes.has(answer.problem.id) && !records.mistakes[answer.problem.id]).length;

    const historyItem = {
      id: `${currentQuiz.startedAt}-${finishedAt}`,
      mode: currentQuiz.mode,
      modeLabel: currentQuiz.namedExam ? currentQuiz.namedExam.label : modeLabel(currentQuiz.mode),
      answerMode: currentQuiz.answerMode,
      practice: Boolean(currentQuiz.practice),
      topic: currentQuiz.topic,
      topics: Array.from(new Set(currentQuiz.problems.map((problem) => problem.topic))),
      difficultyCap: normalizeDifficultyCap(currentQuiz.difficultyCap || activeDifficultyCap(records)),
      interruptions: Number(currentQuiz.interruptions || 0),
      score: currentQuiz.score,
      correct,
      total,
      accuracy,
      avgTime,
      bestStreak: currentQuiz.bestStreak,
      finishedAt,
      answers: currentQuiz.answers.map((answer) => ({
        problemId: answer.problem.id,
        input: answer.input,
        correct: answer.correct,
        reason: answer.reason,
        elapsed: answer.elapsed,
        earned: answer.earned,
        hintsUsed: answer.hintsUsed || 0,
        errorTag: answer.errorTag || "",
        causeAuto: Boolean(answer.causeAuto),
        assisted: Boolean(answer.assisted),
        unanswered: Boolean(answer.unanswered)
      }))
    };
    records.history = [historyItem, ...(records.history || [])].slice(0, HISTORY_LIMIT);
    // history 只留最近 HISTORY_LIMIT 場，能力模型的趨勢會因此斷片。
    // attemptLog 收下每一題的精簡紀錄（上限 5000 筆），讓成長曲線活得比 history 久。
    if (window.BuzzRecords) {
      try {
        window.BuzzRecords.appendSession(records, historyItem);
      } catch (_error) {
        // 寫不進分層紀錄不影響本場成績的保存
      }
    }

    if (currentQuiz.mode === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      const answered = currentQuiz.answers.length;
      // Only a fully answered daily counts as done — quitting early must not
      // mark today's mission complete.
      if (answered >= total) {
        const previous = records.daily[today];
        if (!previous || currentQuiz.score >= previous.score) {
          records.daily[today] = {
            score: currentQuiz.score,
            correct,
            total,
            completed: answered,
            accuracy,
            finishedAt
          };
        }
      }
    }

    // 每日一題：只記首次挑戰（Wordle 精神——今天只有一次正式機會）。
    if (currentQuiz.dailyOne && currentQuiz.answers.length) {
      const dateKey = currentQuiz.dailyOne.dateKey;
      if (!records.dailyOne[dateKey]) {
        const answer = currentQuiz.answers[0];
        records.dailyOne[dateKey] = {
          problemId: answer.problem.id,
          correct: Boolean(answer.correct),
          elapsed: Number(answer.elapsed || 0),
          hintsUsed: Number(answer.hintsUsed || 0),
          reason: answer.reason || ""
        };
      }
      currentQuiz.dailyOneOutcome = { dateKey, ...records.dailyOne[dateKey], streak: dailyOneStreak(records) };
    }

    if (currentQuiz.pathGate) {
      const gate = currentQuiz.pathGate;
      const passed = currentQuiz.answers.length >= total && correct >= gate.required;
      gate.passed = passed;
      gate.correct = correct;
      gate.finishedAt = finishedAt;
      records.pathGateAttempts[gate.targetId] = {
        attempts: (records.pathGateAttempts[gate.targetId]?.attempts || 0) + 1,
        correct,
        total,
        passed,
        finishedAt
      };
      if (passed) {
        records.pathUnlocks[gate.targetId] = {
          unlockedAt: finishedAt,
          correct,
          total
        };
      }
    }

    if (currentQuiz.pathNodeId) {
      const previous = records.pathLessonRuns[currentQuiz.pathNodeId] || {};
      const wasCleared = Boolean(previous.cleared);
      const nowCleared = Boolean(previous.cleared || accuracy >= 70);
      records.pathLessonRuns[currentQuiz.pathNodeId] = {
        attempts: (previous.attempts || 0) + 1,
        bestAccuracy: Math.max(previous.bestAccuracy || 0, accuracy),
        lastAccuracy: accuracy,
        lastScore: currentQuiz.score,
        lastFinishedAt: finishedAt,
        cleared: nowCleared
      };
      // Freshly cleared this node → flag the node that just unlocked so the
      // path line animates only up to it (consumed on the next home render).
      if (!wasCleared && nowCleared) {
        const idx = PATH_NODES.findIndex((node) => node.id === currentQuiz.pathNodeId);
        const unlocked = idx >= 0 ? PATH_NODES[idx + 1] : null;
        justUnlockedNodeId = unlocked ? unlocked.id : currentQuiz.pathNodeId;
      }
      // 延遲回測（testing effect）：今天練的，隔天要回來考一次。
      // 只記最近一個節點 —— 排一整排待辦會變壓力，一張卡剛好。
      if (currentQuiz.answers.length >= 4) {
        records.pathRetest = { nodeId: currentQuiz.pathNodeId, at: Date.now(), doneAt: 0 };
      }
    }

    // 回測做完就註銷，成績照一般 quick 場計，不另立名目
    if (currentQuiz.pathRetestFor && records.pathRetest && records.pathRetest.nodeId === currentQuiz.pathRetestFor) {
      records.pathRetest.doneAt = Date.now();
    }

    // Feature 5：定位測驗 → 覆寫 records.placement，並沿用跳關的
    // pathUnlocks 把主線解鎖到對應節點。
    if (currentQuiz.mode === "placement") {
      const placement = computePlacementResult(currentQuiz.answers);
      records.placement = { rank: placement.rank, date: finishedAt, weakTag: placement.weakTag };
      const targetId = PLACEMENT_NODE_BY_RANK[placement.rank] || PATH_NODES[0].id;
      const targetIdx = Math.max(0, PATH_NODES.findIndex((node) => node.id === targetId));
      PATH_NODES.slice(1, targetIdx + 1).forEach((node) => {
        if (!records.pathUnlocks[node.id]) {
          records.pathUnlocks[node.id] = {
            unlockedAt: finishedAt,
            correct: placement.correct,
            total: currentQuiz.answers.length,
            source: "placement"
          };
        }
      });
      trackEvent("placement_complete", { rank: placement.rank, weak_tag: placement.weakTag || "" });
      currentQuiz.placementResult = {
        ...placement,
        nodeId: targetId,
        nodeLabel: PATH_NODES[targetIdx].label
      };
    }

    // Feature 10：具名模擬卷 → 累計 attempts / best / lastAt。
    if (currentQuiz.namedExam) {
      const previous = records.namedExams[currentQuiz.namedExam.id] || {};
      const nextStat = {
        attempts: Number(previous.attempts || 0) + 1,
        best: Math.max(Number(previous.best || 0), accuracy),
        lastAt: finishedAt
      };
      records.namedExams[currentQuiz.namedExam.id] = nextStat;
      const passLine = Math.ceil(total * NAMED_EXAM_PASS_RATE);
      currentQuiz.namedExamOutcome = {
        accuracy,
        correct,
        total,
        passLine,
        passed: correct >= passLine,
        best: nextStat.best,
        attempts: nextStat.attempts
      };
    }


    currentQuiz.unlockedAchievements = updateAchievements(records, currentQuiz, historyItem);
    saveRecords(records);
  }

  function updateAnswerRecords(records, answer, finishedAt, context = {}) {
    const problem = answer.problem;
    if (!records.topicStats[problem.topic]) records.topicStats[problem.topic] = { correct: 0, wrong: 0, total: 0 };
    records.topicStats[problem.topic].total += 1;
    records.topicStats[problem.topic][answer.correct ? "correct" : "wrong"] += 1;

    if (!records.problemStats[problem.id]) records.problemStats[problem.id] = { correct: 0, wrong: 0, total: 0 };
    records.problemStats[problem.id].total += 1;
    records.problemStats[problem.id][answer.correct ? "correct" : "wrong"] += 1;
    records.problemStats[problem.id].lastAnsweredAt = finishedAt;

    if (!answer.correct) {
      const previous = records.mistakes[problem.id] || {};
      if (!previous.problemId) {
        trackEvent("mistake_added", {
          problem_id: problem.id,
          rank: problemRank(problem),
          reason: answer.reason || ""
        });
      }
      records.mistakes[problem.id] = {
        problemId: problem.id,
        wrongCount: (previous.wrongCount || 0) + 1,
        lastWrongAt: finishedAt,
        reason: answer.reason,
        lastInput: answer.input,
        tag: answer.errorTag || previous.tag || "",
        correctStreak: 0,
        assisted: Boolean(answer.assisted || previous.assisted),
        // SRS: wrong answers always fall back to "due now".
        srs: { interval: 0, dueAt: Date.parse(finishedAt) || Date.now() }
      };
    } else if (records.mistakes[problem.id] || answer.assisted) {
      const now = Date.parse(finishedAt) || Date.now();
      const item = records.mistakes[problem.id] || {
        problemId: problem.id,
        wrongCount: 1,
        lastWrongAt: finishedAt,
        reason: "Assisted",
        lastInput: answer.input,
        tag: "",
        correctStreak: 0
      };
      records.mistakes[problem.id] = item;
      if (answer.assisted) {
        // 借助解答的答對不清錯題：視為快到期複習，最長 1 天後再驗。
        item.lastCorrectAt = finishedAt;
        item.correctStreak = 0;
        item.assisted = true;
        item.srs = { interval: 1, dueAt: now + DAY_MS };
        return;
      }
      item.lastCorrectAt = finishedAt;
      item.correctStreak = (item.correctStreak || 0) + 1;
      item.wrongCount = Math.max(0, Number(item.wrongCount || 1) - 0.5);
      if (item.assisted) {
        // 曾借助解答：這次乾淨答對先把旗標拿掉，錯題保留、明天再驗一次。
        delete item.assisted;
        item.srs = { interval: 1, dueAt: now + DAY_MS };
      } else if (item.correctStreak >= 2 || item.wrongCount <= 0.5) {
        trackEvent("mistake_cleared", {
          problem_id: problem.id,
          rank: problemRank(problem),
          days_in_book: Math.max(
            0,
            Math.round((Date.now() - (Date.parse(item.lastWrongAt || "") || Date.now())) / DAY_MS)
          )
        });
        delete records.mistakes[problem.id];
      } else if (context.mistakesMode) {
        // SRS: correct in a mistakes-mode session pushes the next review out.
        const srs = mistakeSrs(item);
        const interval = Math.min(SRS_MAX_INTERVAL_DAYS, Math.max(1, srs.interval * 2));
        item.srs = { interval, dueAt: now + interval * DAY_MS };
      }
    }
  }

  function updateAchievements(records, currentQuiz, historyItem) {
    const definitions = [
      ["first_run", "開局", "完成第一局", () => records.attempts + records.practiceRuns >= 1],
      ["perfect_run", "零失誤", "單局 10 題以上全對", () => historyItem.total >= 10 && historyItem.correct === historyItem.total],
      ["speed_runner", "速算節奏", "單局平均 20 秒內且正確率 70% 以上", () => historyItem.avgTime > 0 && historyItem.avgTime <= 20 && historyItem.accuracy >= 70],
      ["streak_10", "連勝 10", "單局連勝達 10 題", () => currentQuiz.bestStreak >= 10 || records.bestStreak >= 10],
      ["boss_ace", "Boss Ace", "Boss 題組正確率 90% 以上", () => currentQuiz.mode === "boss" && historyItem.accuracy >= 90],
      ["exam_clear", "大考通關", "大考模式正確率 70% 以上", () => currentQuiz.mode === "exam" && historyItem.accuracy >= 70],
      ["hundred_answers", "百題訓練", "累積作答 100 題", () => records.totalAnswered >= 100],
      ["five_hundred_answers", "五百題訓練", "累積作答 500 題", () => records.totalAnswered >= 500],
      ["thousand_answers", "千題訓練", "累積作答 1000 題", () => records.totalAnswered >= 1000]
    ];
    const unlocked = [];
    definitions.forEach(([id, title, detail, test]) => {
      if (!records.achievements[id] && test()) {
        records.achievements[id] = { id, title, detail, unlockedAt: new Date().toISOString() };
        unlocked.push({ id, title, detail });
      }
    });
    Object.entries(TOPICS)
      .filter(([key]) => key !== "all")
      .forEach(([key, topic]) => {
        const stat = records.topicStats[key] || { correct: 0, total: 0 };
        const id = `master_${key}`;
        if (!records.achievements[id] && stat.total >= 12 && stat.correct / stat.total >= 0.8) {
          const item = { id, title: `${topic.label} 熟練`, detail: `${topic.label} 正確率達 80%`, unlockedAt: new Date().toISOString() };
          records.achievements[id] = item;
          unlocked.push(item);
        }
      });
    return unlocked;
  }

  function computeRank(records) {
    const total = records.totalAnswered || 0;
    const best = records.bestScore || 0;
    const streak = records.bestStreak || 0;
    if (best >= 1300 || streak >= 25 || total >= 500) return "Legend";
    if (best >= 900 || streak >= 16 || total >= 300) return "Grandmaster";
    if (best >= 650 || streak >= 12 || total >= 180) return "Master";
    if (best >= 420 || streak >= 8 || total >= 90) return "Expert";
    if (best >= 220 || streak >= 5 || total >= 35) return "Builder";
    return "Rookie";
  }

  function dailyMissionInfo(records, daily) {
    const target = dailyGoal(records);
    const completed = daily ? Math.min(target, Number(daily.completed || daily.total || target)) : 0;
    return {
      target,
      completed,
      done: Boolean(daily),
      progress: Math.round((completed / target) * 100),
      dailyStreak: dailyCompletionStreak(records)
    };
  }

  function dailyCompletionStreak(records) {
    const daily = records.daily || {};
    const start = new Date();
    if (!daily[dateKey(start)]) start.setDate(start.getDate() - 1);
    let streak = 0;
    for (let index = 0; index < 60; index += 1) {
      const key = dateKey(start);
      if (!daily[key]) break;
      streak += 1;
      start.setDate(start.getDate() - 1);
    }
    return streak;
  }

  function dateKey(date) {
    return date.toISOString().slice(0, 10);
  }

  // 熱力圖 / 連勝一律用本地日期（YYYY-MM-DD），避免深夜練習被算到隔天。
  function localDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function weekKey(date) {
    return localDateKey(startOfWeek(date));
  }

  // 每天答題數：answers 只有 session 級時間戳，就把整局算在結束那天。
  function activityCounts(records) {
    const counts = {};
    (records.history || []).forEach((item) => {
      const time = Date.parse(item.finishedAt || "");
      if (!Number.isFinite(time)) return;
      const key = localDateKey(new Date(time));
      const answered = Array.isArray(item.answers) ? item.answers.length : Number(item.total || 0);
      counts[key] = (counts[key] || 0) + answered;
    });
    return counts;
  }

  function activityLevel(count) {
    if (!count) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 11) return 3;
    return 4;
  }

  // 連勝 + 連勝保護：每「日曆週」一面盾牌，剛好漏練一天且該週盾牌沒用過
  // 就自動補上（消耗後記進 records.streakShields，匯出匯入都會帶著走）。
  function practiceStreakInfo(records, counts) {
    const shields = records.streakShields || {};
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    let streak = 0;
    let consumedNew = false;
    const usedDates = new Set();
    // 今天還沒練不算斷，從昨天往回數。
    if (!counts[localDateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
    for (let index = 0; index < 400; index += 1) {
      const key = localDateKey(cursor);
      if (counts[key]) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      if (!streak) break;
      // 連漏兩天盾牌救不了，直接斷。
      const previousDay = new Date(cursor);
      previousDay.setDate(previousDay.getDate() - 1);
      if (!counts[localDateKey(previousDay)]) break;
      const wk = weekKey(cursor);
      const existing = shields[wk];
      if (existing && existing.date === key) {
        usedDates.add(key);
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      if (existing) break;
      shields[wk] = { date: key, usedAt: new Date().toISOString() };
      usedDates.add(key);
      consumedNew = true;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    records.streakShields = shields;
    if (consumedNew) saveRecords(records);
    const shieldAvailable = !shields[weekKey(new Date())];
    return { streak, shieldAvailable, usedDates };
  }

  function recentAnswerStats(records, limit) {
    const answers = [];
    (records.history || []).forEach((item) => {
      (item.answers || []).forEach((answer) => {
        answers.push({
          correct: Boolean(answer.correct),
          elapsed: Number(answer.elapsed || 0),
          finishedAt: item.finishedAt
        });
      });
    });
    const selected = answers.slice(0, limit);
    const correct = selected.filter((answer) => answer.correct).length;
    const timed = selected.filter((answer) => Number.isFinite(answer.elapsed) && answer.elapsed > 0);
    const avgSeconds = timed.length ? Math.round(timed.reduce((sum, answer) => sum + answer.elapsed, 0) / timed.length) : null;
    const fastestSeconds = timed.length ? Math.min(...timed.map((answer) => answer.elapsed)) : null;
    return {
      total: selected.length,
      correct,
      accuracy: selected.length ? Math.round((correct / selected.length) * 100) : null,
      avgSeconds,
      fastestSeconds
    };
  }

  function speedInsightText(avgTime, recentAvg) {
    if (!avgTime) return "";
    if (!recentAvg) return `平均 ${avgTime}s / 題。累積更多紀錄後會比較最近 30 題。`;
    const diff = avgTime - recentAvg;
    if (Math.abs(diff) <= 2) return `平均 ${avgTime}s / 題，和最近 30 題差不多。`;
    if (diff < 0) return `平均 ${avgTime}s / 題，比最近 30 題快 ${Math.abs(diff)}s。`;
    return `平均 ${avgTime}s / 題，比最近 30 題慢 ${diff}s。`;
  }

  function formatSeconds(value) {
    return value === null || value === undefined ? "—" : `${value}s`;
  }

  function proofStats(records) {
    const progress = records.proofs || {};
    return proofs.reduce(
      (stats, proof) => {
        const item = progress[proof.id] || {};
        stats.total += 1;
        if (item.solutionViewed) stats.viewed += 1;
        if (item.status === "understood") stats.understood += 1;
        if (item.status === "partial") stats.partial += 1;
        if (item.status === "stuck") stats.stuck += 1;
        return stats;
      },
      { total: 0, viewed: 0, understood: 0, partial: 0, stuck: 0 }
    );
  }

  function learningPathState(records) {
    const nodes = PATH_NODES.map((node, index) => pathNodeState(node, records, index));
    nodes.forEach((node, index) => {
      const previous = nodes[index - 1];
      const masteredBefore = nodes.slice(0, index).filter((item) => item.status === "mastered" || item.status === "gold").length;
      const shouldGate = (index > 0 && previous && previous.mastery < 35 && node.attempts === 0) || (node.boss && masteredBefore < 5);
      if (shouldGate && !pathGateUnlocked(records, node.id)) {
        node.gated = true;
        node.status = "jump";
      }
    });
    const next = nodes.find((node) => !node.gated && node.status !== "mastered" && node.status !== "gold") || nodes.find((node) => node.status !== "mastered" && node.status !== "gold") || nodes[0];
    return { nodes, next };
  }

  function pathNodeState(node, records, index) {
    const related = pathNodeProblems(node);
    let attempts = 0;
    let correct = 0;
    let unique = 0;
    let mistakes = 0;
    related.forEach((problem) => {
      const stat = records.problemStats?.[problem.id];
      if (stat && stat.total) {
        attempts += Number(stat.total || 0);
        correct += Number(stat.correct || 0);
        unique += 1;
      }
      if (records.mistakes?.[problem.id]) mistakes += 1;
    });
    const accuracy = attempts ? correct / attempts : 0;
    const target = Math.max(1, node.target || 12);
    const breadthTarget = Math.max(1, Math.min(target, related.length || target));
    const volumeScore = Math.min(1, attempts / target) * 35;
    const breadthScore = Math.min(1, unique / breadthTarget) * 25;
    const accuracyScore = attempts ? accuracy * 40 : 0;
    const mistakePenalty = Math.min(22, mistakes * 4);
    const mastery = Math.max(0, Math.min(100, Math.round(volumeScore + breadthScore + accuracyScore - mistakePenalty)));
    const status = mastery >= 90 ? "gold" : mastery >= 70 ? "mastered" : attempts ? "active" : index === 0 ? "ready" : "ready";
    return {
      ...node,
      relatedCount: related.length,
      attempts,
      correct,
      unique,
      mistakes,
      accuracy: attempts ? Math.round(accuracy * 100) : null,
      mastery,
      locked: false,
      gated: false,
      status
    };
  }

  function pathNodeProblems(node) {
    return problems.filter((problem) => {
      const tags = problem.tags || [];
      if (node.topic && problem.topic !== node.topic) return false;
      if (node.pack && node.pack !== "all" && !matchesPack(problem, node.pack)) return false;
      if (node.includeTags && node.includeTags.length && !node.includeTags.some((tag) => tags.includes(tag))) return false;
      if (node.excludeTags && node.excludeTags.some((tag) => tags.includes(tag))) return false;
      if (node.minRank && problemRank(problem) < node.minRank) return false;
      if (node.maxRank && problemRank(problem) > node.maxRank) return false;
      return true;
    });
  }

  function topWeaknesses(records) {
    const analysis = buildWeaknessAnalysis(records);
    const source = analysis.tags.length ? analysis.tags : analysis.topics;
    return source.slice(0, 3);
  }

  function dailyGoal(records) {
    const value = Number(records.settings?.dailyTarget || MODES.daily.count || 12);
    return [5, 10, 12, 20].includes(value) ? value : MODES.daily.count;
  }

  function weeklyMissionInfo(records) {
    const start = startOfWeek(new Date());
    let completed = 0;
    const days = new Set();
    (records.history || []).forEach((item) => {
      const time = Date.parse(item.finishedAt || "");
      if (!Number.isFinite(time) || time < start.getTime()) return;
      completed += Number(item.total || 0);
      days.add(dateKey(new Date(time)));
    });
    const target = Math.max(30, dailyGoal(records) * 5);
    return {
      target,
      completed,
      daysDone: days.size,
      progress: Math.min(100, Math.round((completed / target) * 100))
    };
  }

  function pathRecommendation(path, mission) {
    if (!mission.done) return `先完成每日 ${mission.target} 題，維持練習節奏。`;
    const weakNode = path.nodes.find((node) => node.attempts > 0 && node.mastery < 70);
    if (weakNode) return `重練 ${weakNode.label}，差一點就能 CLEAR。`;
    if (path.next) return `推進 ${path.next.label}，打開下一段技巧。`;
    return "主線完成後可以打 Boss 連戰或證明題。";
  }

  function startOfWeek(date) {
    const copy = new Date(date);
    const day = copy.getDay() || 7;
    copy.setHours(0, 0, 0, 0);
    copy.setDate(copy.getDate() - day + 1);
    return copy;
  }

  function libraryProblems(records) {
    const query = librarySearch.trim().toLowerCase();
    return problems.filter((problem) => {
      if (selectedLibraryTopic !== "all" && problem.topic !== selectedLibraryTopic) return false;
      if (selectedLibraryPack !== "all" && !matchesPack(problem, selectedLibraryPack)) return false;
      if (selectedLibraryRank !== "all" && problemRank(problem) !== Number(selectedLibraryRank)) return false;
      if (selectedLibraryFilter === "favorites" && !records.favorites?.[problem.id]) return false;
      if (selectedLibraryFilter === "reported" && !records.problemReports?.[problem.id]) return false;
      if (selectedLibraryFilter === "boss" && problemRank(problem) < 5) return false;
      if (!query) return true;
      const haystack = [
        problem.id,
        problem.prompt,
        problem.source,
        problem.answerKind,
        problem.answer,
        ...(problem.tags || []).map((tag) => `${tag} ${tagLabel(tag)}`)
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  // 顯示用 tag：濾掉校準層自己塞的難度 tag（rank-N / boss-rank / boss-plus /
  // beginner-friendly）。難度已經有 difficultyBadge 在講，重複列只會擠掉真正的技巧。
  const HIDDEN_DISPLAY_TAGS = /^(rank-[1-6]|boss-rank|boss-plus|beginner-friendly)$/;

  function problemDisplayTags(problem) {
    return Array.from(new Set(problem.tags || [])).filter((tag) => !HIDDEN_DISPLAY_TAGS.test(tag));
  }

  function solutionQuality(problem) {
    const solution = String(problem.solution || "");
    if (solution.length >= 48 || (problem.hints || []).length >= 2) return { level: "good", label: "解析完整" };
    if (solution.length >= 16) return { level: "basic", label: "解析簡短" };
    return { level: "todo", label: "解析待補" };
  }

  function mistakeWeight(item) {
    const wrong = Math.max(1, Number(item.wrongCount || 1));
    const lastWrong = Date.parse(item.lastWrongAt || "");
    const ageDays = Number.isFinite(lastWrong) ? Math.max(0, (Date.now() - lastWrong) / 86400000) : 0;
    const timeDecay = Math.max(0.35, Math.exp(-ageDays / 21));
    const correctDecay = Math.max(0.25, 1 - Number(item.correctStreak || 0) * 0.35);
    return wrong * timeDecay * correctDecay;
  }

  function modeDescription(mode) {
    return {
      quick: "12 題",
      topic: "單範圍",
      daily: "固定題組",
      practice: "不限時",
      brutal: "高難度",
      boss: "階梯",
      boss_rush: "錯一題結束",
      exam: "整份限時",
      pressure: "計時遞減",
      integral_bee: "積分快速戰",
      no_hint: "關閉提示",
      accuracy: "不限時精準",
      survival: "三命制",
      warmup: "5 題暖身",
      cooldown: "錯題收操",
      mistakes: "錯題"
    }[mode] || "";
  }

  function topicDescription(topic) {
    return {
      all: "混合",
      limits: "Limit",
      derivatives: "Derivative",
      integrals: "Integral",
      series: "Series",
    }[topic] || "";
  }

  // 「這一題的答案被機器獨立驗算過」是這個題庫最強的一句話，
  // 而它原本只存在於 CI 的輸出裡，使用者完全看不到。
  //
  // 沒有標記的題目不是「沒驗過就上線」，是**驗不動** —— 證明題與定性題
  // 本質上沒有可比對的數值。所以文案不能寫成「未驗證」那種暗示品質不同的說法。
  function verifiedChip(problem) {
    if (!problem || !window.BuzzVerifiedAnswers || typeof window.BuzzVerifiedAnswers.has !== "function") return "";
    if (!window.BuzzVerifiedAnswers.has(problem.id)) return "";
    return `<span class="chip is-verified" title="這一題的答案由一條與解法無關的數值路徑獨立算過，每次改版都會重跑">${icon("check")}答案已驗算</span>`;
  }

  function answerModeDescription(mode) {
    return {
      choice: "四選一",
      free: "自己輸入答案，附手寫計算紙"
    }[mode] || "";
  }

  function buildTopicStats(answers) {
    return answers.reduce((stats, answer) => {
      const topic = answer.problem.topic;
      if (!stats[topic]) stats[topic] = { correct: 0, total: 0 };
      stats[topic].total += 1;
      if (answer.correct) stats[topic].correct += 1;
      return stats;
    }, {});
  }

  function averageAnswerTime(answers) {
    const timed = (answers || []).filter((answer) => !answer.unanswered && Number.isFinite(Number(answer.elapsed)) && Number(answer.elapsed) > 0);
    return timed.length ? Math.round(timed.reduce((sum, answer) => sum + Number(answer.elapsed || 0), 0) / timed.length) : 0;
  }

  function buildExamAnalysis(answers) {
    const topicGroups = {};
    const tagGroups = {};
    const rankGroups = {};
    const ignoredTags = new Set([
      "exam-style",
      "exam-depth",
      "transfer-exam",
      "proficiency-exam",
      "midterm-style",
      "university-exam-style",
      "boss-rank",
      "depth-r5",
      "depth-r6"
    ]);

    (answers || []).forEach((answer) => {
      const problem = answer.problem;
      if (!problem) return;
      addExamStat(topicGroups, problem.topic, TOPICS[problem.topic]?.label || problem.topic, answer);
      addExamStat(rankGroups, `r${problemRank(problem)}`, `R${problemRank(problem)}`, answer);
      (problem.tags || [])
        .filter((tag) => !ignoredTags.has(tag))
        .forEach((tag) => addExamStat(tagGroups, tag, tagLabel(tag), answer));
    });

    const topicOrder = ["limits", "derivatives", "integrals", "series"];
    const topicRows = Object.values(topicGroups)
      .map(finalizeExamStat)
      .sort((a, b) => topicOrder.indexOf(a.key) - topicOrder.indexOf(b.key));
    const rankRows = Object.values(rankGroups)
      .map(finalizeExamStat)
      .sort((a, b) => Number(a.key.slice(1)) - Number(b.key.slice(1)));
    const tagRows = Object.values(tagGroups)
      .map(finalizeExamStat)
      .filter((row) => row.total >= 2 || row.wrong > 0)
      .sort((a, b) => b.wrongRate - a.wrongRate || b.wrong - a.wrong || b.total - a.total);

    const timedTopics = topicRows.filter((row) => row.avgSec !== null);
    const timedTags = tagRows.filter((row) => row.avgSec !== null);
    const fastestTopic = timedTopics.slice().sort((a, b) => a.avgSec - b.avgSec)[0] || null;
    const fastestTag = timedTags.slice().sort((a, b) => a.avgSec - b.avgSec || b.correct - a.correct)[0] || null;
    const slowestTopic = timedTopics.slice().sort((a, b) => b.avgSec - a.avgSec)[0] || null;
    const weakTag = tagRows[0] || null;
    const rankWall = rankRows.slice().sort((a, b) => b.wrongRate - a.wrongRate || Number(b.key.slice(1)) - Number(a.key.slice(1)))[0] || null;

    return {
      topicRows,
      tagRows,
      rankRows,
      insights: [
        {
          label: "最快主題",
          value: fastestTopic ? `${fastestTopic.label} · ${formatSeconds(fastestTopic.avgSec)}` : "尚無資料",
          note: fastestTopic ? `${fastestTopic.correct}/${fastestTopic.total} correct` : "至少作答一題後顯示",
          tone: "speed"
        },
        {
          label: "最快技巧",
          value: fastestTag ? `${fastestTag.label} · ${formatSeconds(fastestTag.avgSec)}` : "尚無資料",
          note: fastestTag ? `${fastestTag.correct}/${fastestTag.total} correct` : "tag 數不足時不顯示",
          tone: "speed"
        },
        {
          label: "最慢主題",
          value: slowestTopic ? `${slowestTopic.label} · ${formatSeconds(slowestTopic.avgSec)}` : "尚無資料",
          note: slowestTopic ? "優先檢查是否第一步判型太慢" : "未作答不列入秒數",
          tone: "slow"
        },
        {
          label: "錯誤最多技巧",
          value: weakTag ? `${weakTag.label} · ${weakTag.wrong}/${weakTag.total}` : "尚無資料",
          note: weakTag ? `失誤率 ${Math.round(weakTag.wrongRate * 100)}%` : "目前沒有明顯錯誤熱區",
          tone: "miss"
        },
        {
          label: "難度斷點",
          value: rankWall ? `${rankWall.label} · ${rankWall.correct}/${rankWall.total}` : "尚無資料",
          note: rankWall ? `avg ${formatSeconds(rankWall.avgSec)}，錯 ${rankWall.wrong}` : "R5/R6 分層會在這裡顯示",
          tone: "rank"
        }
      ]
    };
  }

  function addExamStat(groups, key, label, answer) {
    if (!groups[key]) groups[key] = { key, label, total: 0, correct: 0, wrong: 0, elapsedSum: 0, timed: 0 };
    const group = groups[key];
    group.total += 1;
    if (answer.correct) group.correct += 1;
    else group.wrong += 1;
    if (!answer.unanswered && Number.isFinite(Number(answer.elapsed)) && Number(answer.elapsed) > 0) {
      group.elapsedSum += Number(answer.elapsed || 0);
      group.timed += 1;
    }
  }

  function finalizeExamStat(group) {
    return {
      ...group,
      avgSec: group.timed ? Math.round(group.elapsedSum / group.timed) : null,
      wrongRate: group.total ? group.wrong / group.total : 0
    };
  }

  let problemIndex = null;

  function problemById(id) {
    if (!problemIndex) problemIndex = new Map(problems.map((problem) => [problem.id, problem]));
    return problemIndex.get(id) || null;
  }

  function modeLabel(mode) {
    if (mode === "path_gate") return "跳關小測驗";
    if (mode === "named_exam") return "模擬考";
    return MODES[mode] ? MODES[mode].label : "Quiz";
  }

  function mistakeTopicCount(records, topic) {
    return Object.values(records.mistakes || {}).filter((item) => {
      const problem = problemById(item.problemId);
      return problem && (topic === "all" || problem.topic === topic);
    }).length;
  }

  function historyTopicCount(records, topic) {
    return (records.history || []).filter((item) => topic === "all" || item.topic === topic || item.topics?.includes(topic)).length;
  }

  // 技巧精熟雷達。優先走 kernel 的能力模型（帶先驗、難度權重、樣本量門檻），
  // kernel 沒載入時退回下面的舊版計法，站台不會因此白畫面。
  //
  // 新舊差異：舊版沒有先驗也沒有難度權重，答 1 題全對就是 100 分；
  // 新版要累積到約 12 次加權作答才會脫離「未測」。分數普遍會比舊版保守。
  function masteryRadarData(records) {
    if (window.BuzzAbility && window.BuzzSkillGraph) {
      try {
        return window.BuzzAbility.profile(records, { radarAxes: RADAR_AXES }).axes;
      } catch (_error) {
        // 能力模型出錯絕對不能連帶弄壞整個畫面
      }
    }
    return legacyMasteryRadarData(records);
  }

  // 舊版計法：純 tag 比對 + 30 天指數半衰。保留為 fallback 與新舊對照基準。
  function legacyMasteryRadarData(records) {
    const now = Date.now();
    const tagToAxes = new Map();
    RADAR_AXES.forEach((axis, index) => {
      axis.tags.forEach((tag) => {
        if (!tagToAxes.has(tag)) tagToAxes.set(tag, []);
        tagToAxes.get(tag).push(index);
      });
    });
    const stats = RADAR_AXES.map(() => ({ weight: 0, correct: 0, lastAt: 0 }));
    (records.history || []).forEach((item) => {
      const time = Date.parse(item.finishedAt || "");
      if (!Number.isFinite(time)) return;
      const ageDays = Math.max(0, (now - time) / DAY_MS);
      const weight = Math.exp(-ageDays / 30);
      (item.answers || []).forEach((answer) => {
        const problem = problemById(answer.problemId);
        if (!problem) return;
        const hit = new Set();
        (problem.tags || []).forEach((tag) => {
          (tagToAxes.get(tag) || []).forEach((index) => hit.add(index));
        });
        hit.forEach((index) => {
          stats[index].weight += weight;
          // 借助解答的答對只算半分，避免雷達高估熟練度。
          if (answer.correct) stats[index].correct += answer.assisted ? weight * 0.5 : weight;
          if (time > stats[index].lastAt) stats[index].lastAt = time;
        });
      });
    });
    return RADAR_AXES.map((axis, index) => {
      const stat = stats[index];
      if (!stat.weight) return { ...axis, score: null };
      const idleDays = Math.max(0, (now - stat.lastAt) / DAY_MS);
      const raw = 100 * (stat.correct / stat.weight) * Math.pow(0.97, idleDays);
      return { ...axis, score: Math.max(0, Math.min(100, Math.round(raw))) };
    });
  }

  function renderMasteryRadar(records) {
    const axes = masteryRadarData(records);
    const measured = axes.filter((axis) => axis.score !== null);
    const n = Math.max(3, axes.length);
    const cx = 140;
    const cy = 120;
    const radius = 80;
    const point = (index, r) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    };
    const ringPoints = (frac) => axes
      .map((_, index) => point(index, radius * frac).map((value) => value.toFixed(1)).join(","))
      .join(" ");
    const rings = [0.25, 0.5, 0.75, 1]
      .map((frac) => `<polygon class="radar-ring" points="${ringPoints(frac)}"></polygon>`)
      .join("");
    const spokes = axes
      .map((_, index) => {
        const [x, y] = point(index, radius);
        return `<line class="radar-spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
      })
      .join("");
    const dataPoints = axes
      .map((axis, index) => point(index, radius * ((axis.score || 0) / 100)).map((value) => value.toFixed(1)).join(","))
      .join(" ");
    const dots = axes
      .map((axis, index) => {
        if (axis.score === null) return "";
        const [x, y] = point(index, radius * (axis.score / 100));
        return `<circle class="radar-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"></circle>`;
      })
      .join("");
    // 「未測」改成進度。對一個練了兩週的人顯示一圈灰字「未測」，
    // 讀起來像功能沒做；「差 3 題」告訴他離亮起來多近、而且暗示怎麼讓它亮。
    // 軸要 12 次加權作答才算測準（kernel 的 MIN_CONFIDENCE_W）；
    // legacy fallback 沒有 confidence 欄位，那條路維持舊字。
    const remainingFor = (axis) => {
      if (axis.confidence === undefined) return null;
      if (axis.stale) return null;
      const weight = Number(axis.n || 0);
      return Math.max(1, Math.ceil(12 - weight));
    };
    const emptyText = (axis) => {
      if (axis.confidence === undefined) return "未測";
      if (axis.stale) return "該重測";
      const remaining = remainingFor(axis);
      return remaining >= 12 ? "未測" : `差 ${remaining} 題`;
    };
    const labels = axes
      .map((axis, index) => {
        const [x, y] = point(index, radius + 16);
        const anchor = Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
        const scoreText = axis.score === null ? emptyText(axis) : String(axis.score);
        return `
          <g class="radar-label ${axis.score === null ? "is-empty" : ""}">
            <title>${escapeHtml(axis.label)}：${axis.score === null ? `${emptyText(axis)}（答滿 12 題就會亮起來）` : `${axis.score} 分`}</title>
            <text x="${x.toFixed(1)}" y="${(y - 1).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(axis.label)}</text>
            <text class="radar-score" x="${x.toFixed(1)}" y="${(y + 11).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(scoreText)}</text>
          </g>`;
      })
      .join("");

    // 收尾行是一顆可以按的處方，不是一句評語。
    // 優先序：最弱的已測軸 > 最接近亮起來的未測軸 > 從頭開始。
    const weakest = measured.slice().sort((a, b) => a.score - b.score)[0] || null;
    const nearest = axes
      .filter((axis) => axis.score === null && remainingFor(axis) !== null && remainingFor(axis) < 12)
      .sort((a, b) => remainingFor(a) - remainingFor(b))[0] || null;
    let takeaway;
    if (weakest) {
      takeaway = `
        <p class="radar-takeaway">
          最弱：${escapeHtml(weakest.label)} ${weakest.score} 分。
          <button class="link-button" data-action="practice-axis" data-axis="${escapeAttr(weakest.key)}">練 10 題 →</button>
        </p>`;
    } else if (nearest) {
      takeaway = `
        <p class="radar-takeaway">
          ${escapeHtml(nearest.label)}再答 ${remainingFor(nearest)} 題就會亮起來。
          <button class="link-button" data-action="practice-axis" data-axis="${escapeAttr(nearest.key)}">現在練 →</button>
        </p>`;
    } else {
      takeaway = `<p class="radar-takeaway">還沒有雷達資料，先打一輪快速訓練。</p>`;
    }
    return `
      <div class="radar-panel">
        <div class="radar-head">
          <strong>技巧精熟雷達</strong>
          <span>最近作答加權正確率，久沒練會慢慢褪色。</span>
        </div>
        <svg class="radar-svg" viewBox="0 0 280 240" role="img" aria-label="技巧精熟雷達">
          ${rings}
          ${spokes}
          ${measured.length ? `<polygon class="radar-data" points="${dataPoints}"></polygon>${dots}` : ""}
          ${labels}
        </svg>
        ${takeaway}
      </div>
    `;
  }

  // 雷達軸的一鍵處方：抓帶著這個軸標籤的題，尊重難度上限，開一局 10 題。
  // 用 quick（計時）而不是 practice —— 計時作答才會餵回雷達，
  // 練完那一軸真的會動，迴圈才閉合。
  function startAxisPractice(axisKey) {
    const axis = RADAR_AXES.find((item) => item.key === axisKey);
    if (!axis) return;
    const records = loadRecords();
    const tagSet = new Set(axis.tags);
    let pool = problems.filter((problem) => (problem.tags || []).some((tag) => tagSet.has(tag)));
    if (!pool.length) return;
    const capped = filterByDifficultyCap(pool, activeDifficultyCap(records));
    if (capped.length >= 6) pool = capped;
    selectedMode = "quick";
    const ordered = adaptiveShuffle(pool, records, seedFromString(`axis-${axisKey}-${Date.now()}`));
    startQuiz(padPool(ordered.slice(0, 10), pool, Math.min(10, pool.length), { records }), { modeKey: "quick" });
  }

  // GitHub 式練習熱力圖：一次算完 counts / streak，再一次吐出整片格子。
  function renderActivityHeatmap(records) {
    const counts = activityCounts(records);
    const streakInfo = practiceStreakInfo(records, counts);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const todayKey = localDateKey(today);
    const start = startOfWeek(today);
    start.setDate(start.getDate() - (HEATMAP_WEEKS - 1) * 7);
    const monthCells = [];
    const cells = [];
    let previousMonth = -1;
    for (let week = 0; week < HEATMAP_WEEKS; week += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + week * 7);
      const month = weekStart.getMonth();
      monthCells.push(`<span>${month !== previousMonth ? `${month + 1}月` : ""}</span>`);
      previousMonth = month;
      for (let day = 0; day < 7; day += 1) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        const key = localDateKey(date);
        if (key > todayKey) {
          cells.push(`<span class="heatmap-cell is-future" data-level="0"></span>`);
          continue;
        }
        const count = counts[key] || 0;
        const shielded = streakInfo.usedDates.has(key);
        const title = `${key} · ${count} 題${shielded ? " · 盾牌保護" : ""}`;
        cells.push(`<span class="heatmap-cell ${shielded ? "is-shielded" : ""}" data-level="${activityLevel(count)}" title="${escapeAttr(title)}"></span>`);
      }
    }
    return `
      <section class="heatmap-panel">
        <div class="heatmap-head">
          <div>
            <p class="section-label">練習熱力圖</p>
            <h3>每天至少 1 題</h3>
          </div>
          <div class="streak-status">
            <strong>連勝 ${streakInfo.streak} 天</strong>
            <span class="shield-chip ${streakInfo.shieldAvailable ? "is-ready" : "is-used"}">${icon("shield")}盾牌${streakInfo.shieldAvailable ? "可用" : "本週已用"}</span>
          </div>
        </div>
        <div class="heatmap-wrap">
          <div class="heatmap-months" style="grid-template-columns: repeat(${HEATMAP_WEEKS}, 1fr);">${monthCells.join("")}</div>
          <div class="heatmap-grid">${cells.join("")}</div>
          <div class="heatmap-legend">
            <span>少</span>
            ${[0, 1, 2, 3, 4].map((level) => `<i class="heatmap-cell" data-level="${level}"></i>`).join("")}
            <span>多</span>
          </div>
        </div>
      </section>
    `;
  }

  function buildWeaknessAnalysis(records) {
    const topicCounts = {};
    const tagCounts = {};
    const errorTagCounts = {};
    Object.values(records.mistakes || {}).forEach((item) => {
      const problem = problemById(item.problemId);
      if (!problem) return;
      const weight = mistakeWeight(item);
      topicCounts[problem.topic] = (topicCounts[problem.topic] || 0) + weight;
      (problem.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + weight;
      });
      if (item.tag) errorTagCounts[item.tag] = (errorTagCounts[item.tag] || 0) + weight;
    });
    return {
      topics: toWeaknessItems(topicCounts, (key) => TOPICS[key]?.label || key),
      tags: toWeaknessItems(tagCounts, tagLabel),
      errorTags: toWeaknessItems(errorTagCounts, (key) => key)
    };
  }

  function toWeaknessItems(counts, labeler) {
    const max = Math.max(0, ...Object.values(counts));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([key, count]) => ({ key, label: labeler(key), count: Math.max(1, Math.round(count)), rawCount: count, max }));
  }

  function tagLabel(tag) {
    if (TAG_LABELS[tag]) return TAG_LABELS[tag];
    const pack = TRAINING_PACKS[tag];
    if (pack) return pack.label;
    return tag
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function formatDateTime(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString("zh-Hant", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (_error) {
      return String(value);
    }
  }

  function topicCountText(topic) {
    const cap = activeDifficultyCap();
    return `${difficultyScopedCount(cap, topic, "all")} 題`;
  }

  function packCountText(packKey) {
    return difficultyScopedCount(activeDifficultyCap(), selectedTopic, packKey);
  }

  function packTotalCountText(packKey) {
    if (packKey === "all") return problems.length;
    return problems.filter((problem) => matchesPack(problem, packKey)).length;
  }

  function packAvailabilityText(packKey) {
    const current = packCountText(packKey);
    if (selectedTopic === "all") return `${current} 題`;
    const total = packTotalCountText(packKey);
    if (!current && total) return `0 / ${total} 題`;
    return `${current} / ${total} 題`;
  }

  function topicChip(problem) {
    const topic = TOPICS[problem.topic];
    return `<span class="chip ${topic.className}">${topic.label}</span>`;
  }

  // 來源只在題庫詳情露出，不進練習畫面 —— 答題當下該看到的是技巧與難度，
  // 不是出處。名校風格保留在 problem.school，標成「風格」而非官方題。
  function sourceChip(problem) {
    const parts = [];
    if (problem.source) parts.push(escapeHtml(problem.source));
    if (problem.school) parts.push(`${escapeHtml(problem.school)} 風格`);
    // 來源聲明（原創／改編／取材）由 kernel/origin.js 提供。
    // school 那 135 題一律是「取材自風格的原創題」，不是該校真題 ——
    // 這件事必須讓人看得到，含糊其辭正是這個欄位要防的。
    const originLabel = window.BuzzOrigin && window.BuzzOrigin.labelFor(problem.id);
    if (originLabel && !problem.school) parts.push(escapeHtml(originLabel));
    if (!parts.length) return "";
    // 「風格」兩個字太容易被讀成「這是該校的考古題」。
    // 一句話的說明放在 title 上，而且不是含糊的免責聲明，是直接講事實。
    const title = problem.school
      ? `仿照 ${problem.school} 的出題習慣所寫的原創題，不是該校真題，也與該校無關`
      : "題目來源聲明";
    return `<span class="chip" title="${escapeAttr(title)}">${parts.join(" · ")}</span>`;
  }

  // 永久題號。公開露出的一律用它，不用內部 id ——
  // id 帶分類語意（"td-int-005"），改版會變；使用者存下來的連結不該因此失效。
  function problemShortCode(problem) {
    if (!window.BuzzUid) return "";
    const uid = window.BuzzUid.uidFor(problem.id);
    return uid ? window.BuzzUid.shortCode(uid) : "";
  }

  // 難度為什麼是這個 rank。以前只有 rankReason（"warm-up compatible" 這種
  // 機器產的短語），使用者問「這題憑什麼算 R5」是答不出來的。
  // 現在拆成三軸，每一軸都可以單獨爭論。
  function rubricChip(problem) {
    if (!window.BuzzRubric) return "";
    const axes = window.BuzzRubric.axesFor(problem.id);
    if (!axes) return "";
    const reason = window.BuzzRubric.reasonFor(problem.id);
    const reviewed = window.BuzzRubric.isReviewed(problem.id);
    return `
      <span class="chip rubric-chip${reviewed ? " is-reviewed" : ""}" title="${escapeAttr(reason)}">
        步數 ${axes.steps} · 冷門 ${axes.obscurity} · 計算 ${axes.load}
      </span>
    `;
  }

  function answerKindLabel(kind) {
    return {
      numeric: "數值",
      expression: "函數式",
      antiderivative: "原函數",
      text: "判定",
      set: "集合",
      interval: "區間",
      graph: "選圖",
      worksheet: "作圖表"
      // 少一個對應就會在題目上印出一個 undefined chip。
      // 加新 answerKind 的時候這裡是最容易忘記的地方 —— 實測就漏了。
    }[kind] || "";
  }

  function answerModeLabel(mode) {
    return ANSWER_MODES[mode] ? ANSWER_MODES[mode].label : ANSWER_MODES.free.label;
  }

  function difficultyBadge(problem) {
    const labels = ["", "暖身", "基礎", "標準", "進階", "Boss", "Boss+"];
    const level = problemRank(problem);
    return `${labels[level]} R${level}/6`;
  }

  function placeholderFor(problem) {
    if (problem.answerKind === "text") return "收斂 / 發散 / 條件收斂";
    if (problem.answerKind === "set") return "例如：{-1, 3}（順序無所謂）";
    if (problem.answerKind === "interval") return "例如：(-inf, 2) U [3, 5]";
    if (problem.answerKind === "antiderivative") return "例如：x^2*log(x)/2-x^2/4";
    if (problem.answerKind === "expression") return "例如：2*x*sin(x)+x^2*cos(x)";
    return "例如：pi/4 或 3/2";
  }

  function answerExamples(problem) {
    if (problem.answerKind === "text") return ["convergent", "divergent", "conditional", "DNE"];
    if (problem.answerKind === "set") return ["{-1, 1}", "{0}", "{pi/4, 5*pi/4}", "{-2, 0, 2}"];
    if (problem.answerKind === "interval") return ["(1, inf)", "[-2, 2]", "(-inf, 3) U (3, inf)", "[-1, 1)"];
    if (problem.answerKind === "numeric") return ["pi/4", "sqrt(2)", "log(2)", "0"];
    if (problem.answerKind === "antiderivative") return ["sin(x)", "log(x)", "x^2/2", "exp(x)"];
    return ["2*x", "sin(x)^2", "sqrt(x)", "log(x)"];
  }

  function webworkKeys(problem) {
    // 集合與區間的元素也是數字（{-2, 2}、(0, inf)），所以除了純文字判定題，
    // 其他都要有數字鍵，不然還是得回去叫系統鍵盤。
    const groups = problem.answerKind === "text"
      ? [{ label: "判定", keys: ["convergent", "divergent", "conditional", "absolute", "DNE"] }]
      : problem.answerKind === "interval"
        ? [{ label: "數字", keys: DIGIT_KEYS }, { label: "區間", keys: ["(", ")", "[", "]", ",", "U", "inf", "-inf", "pi", "/"] }]
        : problem.answerKind === "set"
          ? [{ label: "數字", keys: DIGIT_KEYS }, { label: "集合", keys: ["{", "}", ",", "pi", "sqrt(|)", "/"] }]
          : WEBWORK_KEY_GROUPS;
    return groups.flatMap((group) => group.keys.map((token) => ({
      label: token.replace("|", ""),
      insert: token
    })));
  }

  function formatHelp(kind) {
    if (kind === "text") return "可輸入 convergent / divergent / conditional";
    if (kind === "numeric") return "支援分數、pi、e、sqrt、log";
    // 集合的順序不影響判分，區間的開閉會 —— 這兩件事都要先講清楚，
    // 不然使用者會為了猜格式而重打好幾次，那不是這題要考的東西。
    if (kind === "set") return "元素用逗號隔開，順序不影響判分";
    if (kind === "interval") return "端點用 ( ) 或 [ ]（開閉有差），聯集用 U，無窮寫 inf";
    return "用 * 表乘法，用 ^ 表次方，例如 x^2";
  }

  function answerReasonLabel(reason) {
    return {
      Wrong: "答案不對",
      Timeout: "時間到",
      Skipped: "已跳過",
      Unanswered: "未作答",
      // 「切頁次數超過」這個判定已經移除，但舊紀錄裡可能還有這個 reason，
      // 標籤留著才不會在歷史畫面上顯示成原始字串
      "Tab limit": "切頁次數超過（舊制，已停用）"
    }[reason] || reason || "未通過";
  }

  function displayAnswer(problem) {
    if (problem.answerKind === "text") return problem.canonical || problem.answers[0];
    return problem.answer;
  }

  function resultTitle(accuracy) {
    if (accuracy >= 90) return "表現穩定";
    if (accuracy >= 70) return "接近熟練";
    if (accuracy >= 45) return "需要複習";
    return "先重建基礎";
  }

  function shuffle(items, seed) {
    const result = items.slice();
    let state = Number(seed) || 1;
    for (let i = result.length - 1; i > 0; i -= 1) {
      state = (state * 1664525 + 1013904223) >>> 0;
      const j = state % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function seedFromString(value) {
    return String(value)
      .split("")
      .reduce((seed, char) => ((seed << 5) - seed + char.charCodeAt(0)) >>> 0, 2166136261);
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[。.,，]/g, "");
  }

  function answerToTex(value, problem) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (problem && problem.answerKind === "text") return textToTex(raw);
    if (isTexLike(raw)) return raw;
    const tex = expressionToTex(raw);
    return tex || textToTex(raw);
  }

  function isTexLike(value) {
    return /\\[A-Za-z]+|[_^]\{[^}]+\}|\\\(|\\\[/.test(value);
  }

  function textToTex(value) {
    const text = String(value || "").trim();
    return text ? `\\text{${escapeTexText(text)}}` : "";
  }

  function expressionToTex(source) {
    const normalized = String(source || "")
      .trim()
      .replace(/π/g, "pi")
      .replace(/\bln\s*\(/gi, "log(")
      .replace(/\barctan\s*\(/gi, "atan(")
      .replace(/\barcsin\s*\(/gi, "asin(")
      .replace(/\barccos\s*\(/gi, "acos(")
      .replace(/\s+/g, "");
    if (!normalized) return "";
    if (/[\u4e00-\u9fff]/.test(normalized)) return "";
    if (/[^0-9a-zA-Z_+\-*/^().,]/.test(normalized)) return "";
    return texExpression(normalized);
  }

  function texExpression(expr) {
    const outer = stripBalancedOuterParens(expr);
    if (outer !== expr) return `\\left(${texExpression(outer)}\\right)`;
    if (expr.startsWith("-")) return `-${texExpression(expr.slice(1))}`;
    if (expr.startsWith("+")) return texExpression(expr.slice(1));
    const addParts = splitTopLevelAdd(expr);
    if (addParts.length > 1) {
      return addParts.map((part, index) => {
        const body = texTerm(part.value);
        if (index === 0) return part.sign === "-" ? `-${body}` : body;
        return `${part.sign}${body}`;
      }).join("");
    }
    return texTerm(expr);
  }

  function texTerm(expr) {
    const parts = splitTopLevel(expr, ["*", "/"]);
    if (parts.length === 1) return texPower(expr);
    let output = texPower(parts[0].value);
    for (let index = 1; index < parts.length; index += 1) {
      const current = texPower(parts[index].value);
      output = parts[index].operator === "/" ? `\\frac{${output}}{${current}}` : `${output}\\cdot ${current}`;
    }
    return output;
  }

  function texPower(expr) {
    const index = findTopLevelRight(expr, "^");
    if (index === -1) return texAtom(expr);
    const base = texAtom(expr.slice(0, index));
    const exponent = texPower(expr.slice(index + 1));
    return `${base}^{${exponent}}`;
  }

  function texAtom(expr) {
    if (!expr) return "";
    const stripped = stripBalancedOuterParens(expr);
    if (stripped !== expr) return `\\left(${texExpression(stripped)}\\right)`;
    const call = readFunctionCall(expr);
    if (call) {
      const body = texExpression(call.argument);
      const names = {
        sqrt: `\\sqrt{${body}}`,
        sin: `\\sin\\left(${body}\\right)`,
        cos: `\\cos\\left(${body}\\right)`,
        tan: `\\tan\\left(${body}\\right)`,
        asin: `\\arcsin\\left(${body}\\right)`,
        acos: `\\arccos\\left(${body}\\right)`,
        atan: `\\arctan\\left(${body}\\right)`,
        log: `\\log\\left(${body}\\right)`,
        exp: `e^{${body}}`,
        abs: `\\left|${body}\\right|`,
        sec: `\\sec\\left(${body}\\right)`,
        csc: `\\csc\\left(${body}\\right)`,
        cot: `\\cot\\left(${body}\\right)`
      };
      return names[call.name] || `${escapeTexText(call.name)}\\left(${body}\\right)`;
    }
    if (/^dne$/i.test(expr)) return "\\mathrm{DNE}";
    if (/^infinity$/i.test(expr)) return "\\infty";
    if (/^pi$/i.test(expr)) return "\\pi";
    if (/^e$/i.test(expr)) return "e";
    if (/^[0-9.]+$/.test(expr)) return expr;
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) return escapeTexIdentifier(expr);
    return escapeTexText(expr);
  }

  function splitTopLevelAdd(expr) {
    const parts = [];
    let depth = 0;
    let start = 0;
    let sign = "+";
    for (let index = 0; index < expr.length; index += 1) {
      const char = expr[index];
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
      if (depth === 0 && (char === "+" || char === "-") && index > start) {
        parts.push({ sign, value: expr.slice(start, index) });
        sign = char;
        start = index + 1;
      }
    }
    parts.push({ sign, value: expr.slice(start) });
    return parts.filter((part) => part.value);
  }

  function splitTopLevel(expr, operators) {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let index = 0; index < expr.length; index += 1) {
      const char = expr[index];
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
      if (depth === 0 && operators.includes(char)) {
        parts.push({ operator: null, value: expr.slice(start, index) });
        parts.push({ operator: char, value: "" });
        start = index + 1;
      }
    }
    parts.push({ operator: null, value: expr.slice(start) });
    const result = [];
    for (let index = 0; index < parts.length; index += 1) {
      if (parts[index].operator) continue;
      const operator = index > 0 ? parts[index - 1].operator : null;
      if (parts[index].value) result.push({ operator, value: parts[index].value });
    }
    return result;
  }

  function findTopLevelRight(expr, operator) {
    let depth = 0;
    for (let index = expr.length - 1; index >= 0; index -= 1) {
      const char = expr[index];
      if (char === ")") depth += 1;
      if (char === "(") depth -= 1;
      if (depth === 0 && char === operator) return index;
    }
    return -1;
  }

  function stripBalancedOuterParens(expr) {
    if (!expr.startsWith("(") || !expr.endsWith(")")) return expr;
    let depth = 0;
    for (let index = 0; index < expr.length; index += 1) {
      if (expr[index] === "(") depth += 1;
      if (expr[index] === ")") depth -= 1;
      if (depth === 0 && index < expr.length - 1) return expr;
    }
    return expr.slice(1, -1);
  }

  function readFunctionCall(expr) {
    const match = expr.match(/^([A-Za-z_][A-Za-z0-9_]*)\((.*)\)$/);
    if (!match) return null;
    const name = match[1].toLowerCase();
    const argument = match[2];
    let depth = 0;
    for (let index = 0; index < argument.length; index += 1) {
      if (argument[index] === "(") depth += 1;
      if (argument[index] === ")") {
        if (depth === 0) return null;
        depth -= 1;
      }
    }
    return depth === 0 ? { name, argument } : null;
  }

  function escapeTexIdentifier(value) {
    if (value.length === 1) return value;
    if (/^d[xyztruvw]$/i.test(value)) return value;
    return `\\mathrm{${escapeTexText(value)}}`;
  }

  function escapeTexText(value) {
    return String(value || "")
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/([{}_%&#])/g, "\\$1")
      .replace(/\^/g, "\\textasciicircum{}");
  }

  function typesetMath(root) {
    const blocks = root.matches && root.matches(".math-block") ? [root] : [];
    blocks.push(...root.querySelectorAll(".math-block"));
    blocks.forEach((node) => renderMathNode(node, true));
    const inlines = root.matches && root.matches(".math-inline") ? [root] : [];
    inlines.push(...root.querySelectorAll(".math-inline"));
    inlines.forEach((node) => renderMathNode(node, false));
  }

  // Split tex at top-level \text{...} groups so long-form prompts can flow:
  // narrative segments become wrappable HTML text, math runs stay atomic.
  // readScript / readGroup 在這裡保留正本 —— 它們同時被 TeX-lite 渲染器
  // 和**答案判分器**（normalizeExpression）使用。判分器是正確性關鍵，
  // 不准依賴一個可選的渲染 kernel；抽模組時把它們一起搬走，判分器
  // 就當場壞了 229 個測試 —— CI 抓到的正是這個。
  function readScript(source, start) {
    if (source[start] === "{") return readGroup(source, start);
    if (start >= source.length) return null;
    if (source[start] === "\\") {
      const match = source.slice(start).match(/^\\[A-Za-z]+/);
      if (match) return { value: match[0], end: start + match[0].length };
    }
    return { value: source[start], end: start + 1 };
  }

  function readGroup(source, start) {
    let cursor = start;
    while (/\s/.test(source[cursor] || "")) cursor += 1;
    if (source[cursor] !== "{") return null;
    let depth = 0;
    for (let index = cursor; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        return {
          value: source.slice(cursor + 1, index),
          end: index + 1
        };
      }
    }
    return null;
  }

  // TeX-lite 渲染器已搬到 src/kernel/tex_lite.js（#20 拆模組的第一刀）。
  // 這裡只留特徵偵測的委派：kernel 沒載到時退回純文字 —— 醜但看得見。
  function splitLongTex(tex) {
    if (window.BuzzTexLite) return window.BuzzTexLite.splitLongTex(tex);
    return [{ math: String(tex || "") }];
  }

  function renderLongTexFlow(node, tex) {
    if (window.BuzzTexLite) return window.BuzzTexLite.renderLongTexFlow(node, tex);
    return false;
  }

  function texVisualWidth(tex) {
    if (window.BuzzTexLite) return window.BuzzTexLite.texVisualWidth(tex);
    return String(tex || "").length;
  }

  function renderMathNode(node, displayMode) {
    if (window.BuzzTexLite) return window.BuzzTexLite.renderMathNode(node, displayMode);
    node.textContent = node.dataset.tex || "";
  }

  function renderLiteTex(tex, displayMode = true) {
    if (window.BuzzTexLite) return window.BuzzTexLite.renderLiteTex(tex, displayMode);
    return escapeHtml(String(tex || ""));
  }

  function renderLiteTexInline(source) {
    if (window.BuzzTexLite) return window.BuzzTexLite.renderLiteTexInline(source);
    return escapeHtml(String(source || ""));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function icon(name) {
    const names = {
      play: "play",
      shuffle: "shuffle",
      send: "send",
      skip: "skip-forward",
      info: "info",
      trash: "trash-2",
      x: "x",
      check: "check",
      refresh: "rotate-cw",
      home: "house",
      book: "book-open",
      clock: "clock",
      settings: "settings",
      download: "download",
      upload: "upload",
      calendar: "calendar-days",
      lightbulb: "lightbulb",
      pen: "pen-line",
      eraser: "eraser",
      undo: "undo-2",
      redo: "redo-2",
      keyboard: "keyboard",
      maximize: "maximize-2",
      minimize: "minimize-2",
      printer: "printer",
      moon: "moon",
      grid: "grid-3x3",
      copy: "copy",
      flag: "flag"
    };
    return `<i class="icon" data-lucide="${names[name] || name}" aria-hidden="true"></i>`;
  }

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          class: "icon",
          "aria-hidden": "true"
        }
      });
    }
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", handleShortcut);
  }

  function setupVisibilityTracking() {
    document.addEventListener("visibilitychange", () => {
      if (!quiz || view !== "quiz" || quiz.feedback || quiz.practice || quiz.noTimer) return;
      const current = getCurrentProblem();
      if (!current) return;
      if (document.visibilityState === "hidden") {
        const now = Date.now();
        if (now - lastVisibilityStamp < 400) return;
        lastVisibilityStamp = now;
        render();
      }
    });

    window.addEventListener("blur", () => {
      if (!quiz || view !== "quiz" || quiz.feedback || quiz.practice) return;
      const current = getCurrentProblem();
      const now = Date.now();
      if (!current || now - lastVisibilityStamp < 800) return;
      lastVisibilityStamp = now;
      render();
    });
  }

  // 全螢幕鎖定與切頁監控已經整組移除（2026-08）。
  //
  // 那組機制的立場是「假設使用者會作弊，所以要盯著他」，而這是一個
  // **自己練給自己看**的工具 —— 想查答案的人本來就查得到，被判錯只會讓他
  // 覺得被冤枉。真正的成本在誤傷：切出去接一通電話、iPad 上被通知蓋掉、
  // 或者只是想開計算機，回來就發現這題已經算你答錯了。
  //
  // 大考模式保留真正有意義的部分：整份倒數、無提示、自己輸入答案。
  // 那是「模擬考試環境」，不是「監視使用者」。

  // 漂浮數學符號的裝飾 canvas（setupMathField）於 2026-09 移除。
  // 一個常駐的 rAF 迴圈換來 8% 透明度的 ∫ 和 dx 飄過背景 ——
  // 那是 demo 的美學，不是每天要用一小時的工具的美學。順帶省一顆迴圈。

  if (window.__BUZZ_TEST_HOOKS__) {
    window.__BUZZ_TEST_HOOKS__.api = {
      checkAnswer,
      // 作圖表與選圖題的作答介面：smoke 要能直接 render 它們。
      // 這兩個題型的失敗方式是「整張表根本沒出來」，而那用字串比對抓得到。
      answerKindLabel,
      renderWorksheetControls,
      renderGraphChoiceControls,
      checkWorksheet,
      checkNumeric,
      checkExpression,
      checkAntiderivative,
      checkText,
      rubricChip,
      problemShortCode,
      sourceChip,
      renderSolutionBody,
      renderCalibrationOptIn,
      formatHelp,
      buildCalibrationPack,
      checkSet,
      checkInterval,
      problemDomain,
      resolveAnswerSubmission,
      evaluateExpression,
      normalizeExpression,
      normalizeText,
      problemRank,
      normalizeDifficultyCap,
      activeDifficultyCap,
      filterByDifficultyCap,
      difficultyScopedCount,
      trainingPacks: TRAINING_PACKS,
      packGroups: PACK_GROUPS,
      pathNodes: PATH_NODES,
      pathNodeProblems,
      learningPathState,
      matchesPack,
      modes: MODES,
      pickDailyOneProblem,
      selectCooldownPool,
      setSelectedPack: (packKey) => {
        selectedPack = TRAINING_PACKS[packKey] ? packKey : "all";
        return selectedPack;
      },
      selectProblemPool,
      adaptiveShuffle,
      padPool,
      questionTimeLimit,
      modeRecommendations,
      pressuredSkillIds,
      pathRetestPending,
      skillRefreshDue,
      preferFreshProblems,
      recentProblemIds,
      packTotalCountText,
      averageAnswerTime,
      buildExamAnalysis,
      renderExamAnalysisSection,
      mistakeSrs,
      mistakeDueStatus,
      srsDueSummary,
      updateAnswerRecords,
      normalizeRecords,
      renderTodayCard,
      plannedSession,
      renderInsights,
      renderTrain,
      abilityProfile,
      renderOnboarding,
      renderOnboardingPlacementOffer,
      renderPlacementNextStep,
      setOnboardingStep: (next) => { onboardingStep = next; },
      onboardingContexts: ONBOARDING_CONTEXTS,
      renderBackupNotice,
      dismissBackupNotice,
      importRecordsFrom: (parsed) => {
        const current = loadRecords();
        const topics = {};
        problems.forEach((problem) => { topics[problem.id] = problem.topic; });
        return window.BuzzRecords.merge(current, normalizeRecords(parsed), { problemTopics: topics });
      },
      renderResumeCard,
      resumeSession,
      discardSession,
      serializeQuiz,
      deserializeQuiz,
      autosaveSession,
      readActiveSession,
      clearActiveSession,
      activeSessionKey: ACTIVE_KEY,
      renderKeyIdea,
      keyIdeaFor,
      authoredHints,
      renderSolutionStages,      suggestCause,
      causeTagOf,
      causeOptions: CAUSE_OPTIONS,
      setQuiz: (next) => { quiz = next; },
      speedProgressData,
      jumpToQuestion,
      toggleQuestionFlag,
      finalizeExamAnswers,
      nextUnansweredIndex,
      getQuiz: () => quiz,
      renderHome,
      trainBuckets: TRAIN_BUCKETS,
      setView: (next) => { view = next; },
      setBucket: (next) => { selectedBucket = next; },
      namedExams: NAMED_EXAMS,
      namedExamProblems,
      buildNamedExamPaper,
      placementRankPools,
      drawPlacementProblem,
      computePlacementResult,
      renderSolutionStages,
      renderProblemGraph,
      localDateKey,
      activityCounts,
      activityLevel,
      practiceStreakInfo,
      masteryRadarData,
      renderMasteryRadar,
      renderActivityHeatmap,
      isoWeekKey,      buzzSync: BuzzSync,
      renderSyncSettingsCard
    };
  }

  applyTheme();
  setupPwa();
  setupAnalytics();
  setupActionDelegation();
  setupErrorReporting();
  setupVisibilityTracking();
  setupKeyboardShortcuts();
  // 帶著 #pack= 分享連結進來：直接落在出題工作坊的匯入預覽。
  if (CUSTOM && CUSTOM.pendingImport) {
    creatorImportPreview = CUSTOM.pendingImport;
    CUSTOM.pendingImport = null;
    view = "creator";
  }
  // 帶著 #p=<題號> 進來：直接開那一題（練習模式、不計分）。
  // 「傳一題給同學，點開直接算」—— 連結是純前端的，沒有伺服器參與。
  // 引導還沒走完的新使用者不攔：這正是他們第一次見到這個站的方式。
  const deepLink = /^#p=([A-Za-z0-9_-]+)$/.exec((window.location && window.location.hash) || "");
  if (deepLink) {
    const shared = problemById(deepLink[1]);
    if (shared) {
      selectedMode = "practice";
      startQuiz([shared], { modeKey: "practice", practice: true });
    }
  }
  render();
})();
