(function () {
  "use strict";

  const problems = window.BUZZ_PROBLEMS || [];
  const proofs = window.BUZZ_PROOFS || [];
  const app = document.getElementById("app");
  const field = document.getElementById("math-field");

  const TOPICS = {
    all: { label: "全混合", short: "All", className: "", accent: "#f6b739" },
    limits: { label: "極限", short: "Lim", className: "topic-limits", accent: "#f6b739" },
    derivatives: { label: "微分", short: "Der", className: "topic-derivatives", accent: "#4ba8dd" },
    integrals: { label: "積分", short: "Int", className: "topic-integrals", accent: "#9370d8" },
    series: { label: "級數", short: "Ser", className: "topic-series", accent: "#31ad72" }
  };

  const MODES = {
    quick: {
      label: "快速訓練",
      note: "12 題混合",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false
    },
    topic: {
      label: "單題型訓練",
      note: "單主題 10 題",
      count: 10,
      topicLocked: true,
      daily: false,
      boss: false
    },
    daily: {
      label: "每日挑戰",
      note: "每日固定題組",
      count: 12,
      topicLocked: false,
      daily: true,
      boss: false
    },
    practice: {
      label: "練習模式",
      note: "不限時不扣分 12 題",
      count: 12,
      topicLocked: false,
      daily: false,
      boss: false,
      practice: true
    },
    brutal: {
      label: "進階訓練",
      note: "只抽難題 14 題",
      count: 14,
      topicLocked: false,
      daily: false,
      boss: false,
      hardOnly: true
    },
    boss: {
      label: "階梯測驗",
      note: "由易到難 16 題",
      count: 16,
      topicLocked: false,
      daily: false,
      boss: true
    },
    mistakes: {
      label: "錯題重練",
      note: "錯題重練",
      count: 12,
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
      label: "WebWork",
      note: "答案欄 + LaTeX 預覽 + 黑板草稿"
    }
  };

  const TRAINING_PACKS = {
    all: { label: "全部技巧", note: "不限制 tags", tags: [] },
    beginner_warmup: { label: "新手暖身", note: "R1-R2 基礎題", tags: ["beginner-friendly"] },
    boss_challenge: { label: "Boss 挑戰", note: "R5-R6 防強人題", tags: ["boss-rank"] },
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
    applications: { label: "微分應用", note: "相關變率 / 線性近似 / 曲率", tags: ["related-rates", "tangent-normal", "linear-approximation", "newton-method", "curvature"] },
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
    nabla_vector: { label: "Nabla / Vector", note: "grad / div / curl / laplacian", tags: ["nabla", "vector-calculus"] }
  };

  const PACK_GROUPS = [
    { label: "常用", keys: ["all", "beginner_warmup", "boss_challenge", "mobile_sprint", "technique_recognition", "multivariable", "substitution", "integration_by_parts", "series_test"] },
    { label: "積分技巧", keys: ["partial_fraction", "trig_substitution", "frullani", "ode_style", "kings_property", "double_integral", "multi_integral_advanced"] },
    { label: "微分 / 應用", keys: ["chain", "lagrange_multiplier", "nabla_vector", "parametric_polar", "applications", "total_differential", "hessian", "wronskian", "jacobian_chain"] },
    { label: "級數 / ODE / 其他", keys: ["taylor", "power_series", "convergence_tests", "endpoint_root", "special_functions", "ode_intro", "complex"] }
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

  const KEYS = ["x", "pi", "e", "(", ")", "+", "-", "*", "/", "^", "sqrt(", "sin(", "cos(", "tan(", "log(", "DNE"];
  const STORAGE_KEY = "buzzcalculus.records.v1";
  const ERROR_TAGS = ["粗心", "不會", "忘公式"];
  const PROOF_TIERS = {
    all: "全部",
    basic: "基礎",
    standard: "標準",
    advanced: "進階",
    boss: "東大"
  };
  const HISTORY_LIMIT = 40;
  const APP_VERSION = "v0.9.0-beta";
  const BUILD_DATE = "2026-06-07";
  const GA_MEASUREMENT_ID = String(window.BUZZ_GA_MEASUREMENT_ID || "").trim();

  let view = "home";
  let selectedTopic = "all";
  let selectedMode = "quick";
  let selectedAnswerMode = "choice";
  let selectedPack = "all";
  let selectedMistakeTopic = "all";
  let selectedHistoryTopic = "all";
  let selectedProofTier = "all";
  let quiz = null;
  let activePathNodeId = "";
  let tickHandle = null;
  let renderPending = false;
  let lastVisibilityStamp = 0;
  let fieldAnimation = null;

  function setupAnalytics() {
    if (!GA_MEASUREMENT_ID) return;
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

  function trackEvent(name, params = {}) {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    window.gtag("event", name, {
      app_version: APP_VERSION,
      build_date: BUILD_DATE,
      ...params
    });
  }

  function trackTabSwitch(problem) {
    if (!quiz || !problem) return 0;
    quiz.tabSwitches[problem.id] = (quiz.tabSwitches[problem.id] || 0) + 1;
    const count = quiz.tabSwitches[problem.id];
    trackEvent(count > problem.tabLimit ? "tab_violation" : "tab_switch", {
      mode: quiz.mode,
      topic: problem.topic,
      problem_id: problem.id,
      tab_switches: count,
      tab_limit: problem.tabLimit
    });
    return count;
  }

  function render() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      app.innerHTML = [renderTopbar(), renderScreen()].join("");
      bindEvents();
      typesetMath(app);
      window.setTimeout(() => typesetMath(app), 80);
      renderIcons();
      setupReviewBoards();
    });
  }

  function renderTopbar() {
    const inQuiz = view === "quiz";
    return `
      <header class="topbar">
        <button class="brand" data-action="home" title="回到工作台">
          <div class="brand-mark" aria-hidden="true">∫</div>
          <div>
            <h1 class="brand-title">BuzzCalculus</h1>
            <p class="brand-subtitle">${APP_VERSION} · Build ${BUILD_DATE}</p>
          </div>
        </button>
        <div class="topbar-actions">
          ${
            inQuiz
              ? `<button class="button ghost" data-action="confirm-exit" title="離開本局">${icon("x")}<span>離開</span></button>`
              : `
                <button class="nav-button ${view === "home" ? "is-active" : ""}" data-action="home">${icon("home")}<span>工作台</span></button>
                <button class="nav-button ${view === "mistakes" ? "is-active" : ""}" data-action="open-mistakes">${icon("book")}<span>錯題</span></button>
                <button class="nav-button ${view === "history" ? "is-active" : ""}" data-action="open-history">${icon("clock")}<span>歷史</span></button>
                <button class="icon-button" data-action="reset-records" title="清除本機紀錄">${icon("trash")}</button>
              `
          }
        </div>
      </header>
    `;
  }

  function renderScreen() {
    if (view === "quiz") return renderQuiz();
    if (view === "results") return renderResults();
    if (view === "path-intro") return renderPathIntro();
    if (view === "proofs") return renderProofLab();
    if (view === "mistakes") return renderMistakes();
    if (view === "history") return renderHistory();
    return renderHome();
  }

  function renderHome() {
    return renderHomeV2();
    if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
    if (!TRAINING_PACKS[selectedPack]) selectedPack = "all";
    const records = loadRecords();
    const best = records.bestScore || 0;
    const attempts = records.attempts || 0;
    const streak = records.bestStreak || 0;
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const historyCount = (records.history || []).length;
    const rank = computeRank(records);
    const accuracy = overallAccuracy(records);
    const today = new Date().toISOString().slice(0, 10);
    const daily = records.daily && records.daily[today];
    const mode = MODES[selectedMode] || MODES.quick;
    const topic = TOPICS[selectedTopic] || TOPICS.all;
    const pack = TRAINING_PACKS[selectedPack] || TRAINING_PACKS.all;
    return `
      <main class="screen">
        <div class="dashboard-grid">
          <section class="dashboard-main">
            <div class="dashboard-header">
              <div>
                <h2>訓練工作台</h2>
              </div>
              <div class="session-summary" aria-label="目前設定">
                <span>本局</span>
                <strong>${mode.count} 題</strong>
                <small>${topic.label} · ${pack.label} · ${ANSWER_MODES[selectedAnswerMode].label}</small>
              </div>
            </div>

            <div class="metric-grid" aria-label="本機訓練概況">
              <div class="metric-card">
                <span>段位</span>
                <strong>${rank}</strong>
                <small>${records.totalAnswered || 0} 題累積</small>
              </div>
              <div class="metric-card">
                <span>總正確率</span>
                <strong>${accuracy}%</strong>
                <small>${records.totalCorrect || 0}/${records.totalAnswered || 0}</small>
              </div>
              <div class="metric-card">
                <span>最高分</span>
                <strong>${best}</strong>
                <small>${attempts} 局計分</small>
              </div>
              <div class="metric-card">
                <span>最佳連勝</span>
                <strong>${streak}</strong>
                <small>${mistakeCount} 題待複習</small>
              </div>
            </div>

            <section class="control-band session-panel">
              <div class="panel-title-row">
                <div>
                  <h3>設定本局</h3>
                </div>
                <div class="quiet-meta">${packAvailabilityText(selectedPack)} · ${mode.practice ? "練習" : "計分"}</div>
              </div>

              <div class="control-section">
                <p class="section-label">模式</p>
                <div class="segmented modes" role="tablist" aria-label="模式選擇">
                  ${Object.entries(MODES)
                    .filter(([, mode]) => !mode.hidden)
                    .map(
                      ([key, mode]) => `
                        <button class="segment ${selectedMode === key ? "is-active" : ""}" data-mode="${key}">
                          <strong>${mode.label}</strong>
                        </button>`
                    )
                    .join("")}
                </div>
              </div>

              <div class="control-section">
                <p class="section-label">題型</p>
                <div class="segmented" role="tablist" aria-label="題型選擇">
                  ${Object.entries(TOPICS)
                    .filter(([key]) => key !== "all" || selectedMode !== "topic")
                    .map(
                      ([key, topic]) => `
                        <button class="segment ${selectedTopic === key ? "is-active" : ""}" data-topic="${key}">
                          <strong>${topic.label}</strong>
                          <span>${topicCountText(key)}</span>
                        </button>`
                    )
                    .join("")}
                </div>
              </div>

              <div class="control-section">
                <p class="section-label">答題方式</p>
                <div class="segmented answer-modes" role="tablist" aria-label="答題方式選擇">
                  ${Object.entries(ANSWER_MODES)
                    .map(
                      ([key, mode]) => `
                        <button class="segment ${selectedAnswerMode === key ? "is-active" : ""}" data-answer-mode="${key}">
                          <strong>${mode.label}</strong>
                        </button>`
                    )
                    .join("")}
                </div>
              </div>

              <div class="control-section">
                <p class="section-label">題包 / 技巧</p>
                <div class="pack-picker">
                  <label for="pack-select">
                    <span>目前題包</span>
                    <select id="pack-select" data-pack-select aria-label="題包選擇">
                      ${renderPackOptions()}
                    </select>
                  </label>
                </div>
              </div>

              <div class="action-row">
                <button class="button" data-action="start">${icon("play")}開始挑戰</button>
                <button class="button ghost" data-action="start-daily">${icon("calendar")}今日題組</button>
              </div>
            </section>

          </section>

          <aside class="dashboard-side">
            <section class="panel daily-panel">
              <div class="panel-title-row">
                <div>
                  <h3>每日挑戰</h3>
                </div>
                <span class="status-dot ${daily ? "is-done" : ""}"></span>
              </div>
              ${daily ? `<div class="quiet-meta">${daily.score} 分 · ${daily.correct}/${daily.total} · ${daily.accuracy}%</div>` : ""}
              <button class="button secondary" data-action="start-daily">${icon("calendar")}開始今日題組</button>
            </section>

            <section class="panel">
              <div class="panel-title-row">
                <h3>弱點摘要</h3>
                <button class="link-button" data-action="open-mistakes">查看錯題</button>
              </div>
              ${renderHomeWeaknessSnapshot(records)}
            </section>

            <section class="panel">
              <h3>題庫進度</h3>
              <div class="topic-meter">
                ${Object.entries(TOPICS)
                  .filter(([key]) => key !== "all")
                  .map(([key, topic]) => renderTopicMeter(key, topic))
                  .join("")}
              </div>
            </section>

            <section class="panel">
              <h3>本機訓練</h3>
              <div class="mini-stats">
                <div><span>錯題</span><strong>${mistakeCount}</strong></div>
                <div><span>歷史</span><strong>${historyCount}</strong></div>
                <div><span>練習</span><strong>${records.practiceRuns || 0}</strong></div>
              </div>
              <div class="stack-actions">
                <button class="button secondary" data-action="open-mistakes">${icon("book")}錯題本</button>
                <button class="button secondary" data-action="open-history">${icon("clock")}作答歷史</button>
                <button class="button ghost" data-action="export-records">${icon("download")}匯出紀錄</button>
                <label class="button ghost import-label" for="import-records">${icon("upload")}匯入紀錄</label>
                <input class="sr-only" id="import-records" type="file" accept="application/json" />
              </div>
            </section>

          </aside>
        </div>
      </main>
    `;
  }

  function renderHomeV2() {
    if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
    if (!TRAINING_PACKS[selectedPack]) selectedPack = "all";
    const records = loadRecords();
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const today = new Date().toISOString().slice(0, 10);
    const daily = records.daily && records.daily[today];
    const mission = dailyMissionInfo(records, daily);
    const weaknesses = topWeaknesses(records);
    const path = learningPathState(records);
    const showIntro = !records.onboardingSeen && !(records.totalAnswered || 0);

    return `
      <main class="screen home-screen">
        ${showIntro ? renderFirstRunNotice() : ""}
        ${renderMobileQuestCard(mission, daily, path, mistakeCount)}
        <section class="path-layout home-path-layout">
          ${renderBuzzPath(path, mission)}
          <aside class="path-sidebar">
            ${renderPathMissionCard(records, mission, daily, path)}
          </aside>
        </section>

        ${renderHomeMorePanel(records, weaknesses, mistakeCount)}

        ${renderMobileStartDock(path, mission)}
      </main>
    `;
  }

  function renderBuzzPath(path, mission) {
    const next = path.next;
    const masteredCount = path.nodes.filter((node) => node.status === "mastered" || node.status === "gold").length;
    const totalProgress = Math.round(path.nodes.reduce((sum, node) => sum + node.mastery, 0) / Math.max(1, path.nodes.length));
    const nextIndex = Math.max(0, path.nodes.findIndex((node) => node.id === next.id));
    return `
      <section class="buzz-path-card">
        <div class="path-hero">
          <div class="path-hero-copy">
            <p class="section-label">主線路線</p>
            <h2>下一格：${escapeHtml(next.label)}</h2>
            <p>${escapeHtml(next.note)}</p>
          </div>
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
          ${path.nodes.map((node, index) => renderPathNode(node, index, node.id === next.id)).join("")}
        </div>
      </section>
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
          <span class="path-node-progress">${isNext ? `${index + 1}` : `${node.mastery}%`}</span>
        </button>
      </div>
    `;
  }

  function renderMobileQuestCard(mission, daily, path, mistakeCount) {
    const next = path.next;
    const streak = mission.dailyStreak || 0;
    return `
      <section class="mobile-quest-card">
        <div class="mobile-quest-head">
          <div>
            <p class="section-label">今日</p>
            <h2>${mission.done ? "完成" : `${mission.completed}/${mission.target}`}</h2>
          </div>
          <span>${streak ? `${streak} 天` : "新任務"}</span>
        </div>
        <div class="mission-progress" aria-label="今日任務進度">
          <div class="meter-track"><div class="meter-fill" style="width:${mission.progress}%"></div></div>
        </div>
        <div class="mobile-quest-next">
          <span>下一格</span>
          <strong>${escapeHtml(next.short)}</strong>
          <small>${daily ? `${daily.accuracy}%` : escapeHtml(next.note)}</small>
        </div>
        <div class="mobile-quest-actions">
          <button data-action="start-path-node" data-node-id="${escapeAttr(next.id)}">${icon("play")}主線</button>
          <button data-action="start-daily">${icon("calendar")}每日</button>
          <button data-action="start-weakness" ${mistakeCount ? "" : "disabled"}>${icon("refresh")}${mistakeCount ? "弱點" : "錯題"}</button>
        </div>
      </section>
    `;
  }

  function renderMobileStartDock(path, mission) {
    const next = path.next;
    return `
      <div class="mobile-start-dock">
        <button class="button home-primary" data-action="start-path-node" data-node-id="${escapeAttr(next.id)}">
          ${icon("play")}
          <span>開始下一格</span>
          <small>${escapeHtml(next.short)}</small>
        </button>
        <button class="button secondary" data-action="start-daily">
          ${icon("calendar")}
          <span>${mission.done ? "每日" : `${mission.completed}/${mission.target}`}</span>
        </button>
      </div>
    `;
  }

  function renderPathMissionCard(records, mission, daily, path) {
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const next = path.next;
    const boss = path.nodes.find((node) => node.id === "boss") || path.nodes[path.nodes.length - 1];
    return `
      <section class="summary-card path-mission-card">
        <div class="path-mission-head">
          <p class="section-label">今日</p>
          <h3>${mission.done ? "已完成" : `${mission.completed}/${mission.target} 題`}</h3>
          <span>${daily ? `${daily.accuracy}% 正確率` : "選擇題優先"}</span>
        </div>
        <div class="mission-progress" aria-label="今日任務進度">
          <div class="meter-track"><div class="meter-fill" style="width:${mission.progress}%"></div></div>
        </div>
        <div class="path-mini-actions">
          <button class="path-mini-button" data-action="start-daily"><strong>每日</strong><span>${mission.progress}%</span></button>
          <button class="path-mini-button" data-action="start-weakness"><strong>錯題</strong><span>${mistakeCount}</span></button>
          <button class="path-mini-button" data-action="start-path-node" data-node-id="${escapeAttr(boss.id)}"><strong>Boss</strong><span>${boss.gated ? "可跳" : `${boss.mastery}%`}</span></button>
        </div>
        <button class="button secondary" data-action="start-path-node" data-node-id="${escapeAttr(next.id)}">${icon("play")}練下一格</button>
      </section>
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
        <details class="home-more-panel">
          <summary>
            <span>
              <strong>更多練習</strong>
              <small>自訂題包、證明、錯題、本機資料</small>
            </span>
            ${icon("chevron-down")}
          </summary>
          <div class="home-more-grid">
            ${renderWeaknessStudyCard(records, weaknesses, mistakeCount)}
            ${renderProofHomeCard(records)}
            ${renderDataManagementCard(records)}
            <section class="control-band practice-control home-compact-control">
              <div class="home-control-head">
                <div>
                  <p class="section-label">自訂</p>
                  <h3>指定題包</h3>
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

                <div class="control-section">
                  <p class="section-label">形式</p>
                  ${renderAnswerModePicker()}
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
              <div class="action-row">
                <button class="button ghost custom-start" data-action="start">${icon("play")}自訂開始</button>
              </div>
            </section>
          </div>
        </details>
      </section>
    `;
  }

  function renderMobileLessonPath(records, mission, weaknesses, recent30) {
    const mistakeCount = Object.keys(records.mistakes || {}).length;
    const weaknessLabel = weaknesses[0]?.label || "全混合";
    const recentLabel = recent30.accuracy === null || recent30.accuracy === undefined ? `${records.totalAnswered || 0} 題` : `${recent30.accuracy}%`;
    return `
      <section class="mobile-lesson-path" aria-label="手機練習路線">
        <button class="lesson-step is-primary" data-action="start-daily">
          <span class="lesson-node">${icon("play")}</span>
          <span><strong>每日選擇題</strong><small>${mission.target} 題 · ${mission.progress}%</small></span>
        </button>
        <button class="lesson-step" data-action="start-weakness" ${mistakeCount ? "" : "disabled"}>
          <span class="lesson-node">${icon("refresh")}</span>
          <span><strong>弱點複習</strong><small>${escapeHtml(weaknessLabel)} · ${mistakeCount} 題</small></span>
        </button>
        <button class="lesson-step" data-action="start-choice">
          <span class="lesson-node">${icon("check")}</span>
          <span><strong>選擇題快練</strong><small>四選一 · ${recentLabel}</small></span>
        </button>
      </section>
    `;
  }

  function renderFirstRunNotice() {
    return `
      <section class="first-run-panel">
        <div>
          <p class="section-label">BuzzCalculus</p>
          <h3>微積分反射訓練</h3>
          <p>紀錄保存在本機瀏覽器。</p>
        </div>
        <button class="button ghost" data-action="dismiss-onboarding">${icon("check")}關閉</button>
      </section>
    `;
  }

  function renderPerformanceCard(records, accuracy, recent30, recent7) {
    const trend = performanceTrend(accuracy, recent30.accuracy);
    return `
      <section class="summary-card">
        <p class="section-label">最近表現</p>
        <div class="summary-stat">
          <span>總正確率</span>
          <strong>${accuracy}%</strong>
          <small>${records.totalCorrect || 0}/${records.totalAnswered || 0}</small>
        </div>
        <div class="summary-pair">
          <div><span>最近 30 題</span><strong>${formatPercent(recent30.accuracy, "—")}</strong></div>
          <div><span>最近 7 天</span><strong>${formatPercent(recent7.accuracy, "—")}</strong></div>
        </div>
        <div class="speed-row">
          <div><span>均速</span><strong>${formatSeconds(recent30.avgSeconds)}</strong></div>
          <div><span>最快</span><strong>${formatSeconds(recent30.fastestSeconds)}</strong></div>
        </div>
        ${trend ? `<p class="performance-note">${trend}</p>` : ""}
      </section>
    `;
  }

  function renderRankProgressCard(records, rank, accuracy) {
    return `
      <section class="summary-card">
        <p class="section-label">段位進度</p>
        <div class="rank-head">
          <strong>${escapeHtml(rank.current)}</strong>
          <span>${rank.next ? `Next ${escapeHtml(rank.next.name)}` : "Max"}</span>
        </div>
        <div class="meter-track"><div class="meter-fill" style="width:${rank.progress}%"></div></div>
        <div class="rank-grid">
          <div><span>完成題數</span><strong>${records.totalAnswered || 0}</strong></div>
          <div><span>正確率</span><strong>${accuracy}%</strong></div>
        </div>
        <p class="panel-note">${rank.next ? `差 ${rank.remaining} 題` : "最高段位"}</p>
      </section>
    `;
  }

  function renderWeaknessStudyCard(records, weaknesses, mistakeCount) {
    return `
      <section class="study-card weakness-study">
        <div class="panel-title-row">
          <div>
            <p class="section-label">弱點複習</p>
            <h3>弱點排序</h3>
          </div>
          <span class="study-count">${mistakeCount} 題</span>
        </div>
        ${weaknesses.length ? renderWeaknessList(weaknesses) : renderLockedWeaknessState()}
        ${weaknesses.length ? `<p class="panel-note">下一組：${escapeHtml(weaknesses[0].label)}</p>` : ""}
        <div class="action-row">
          <button class="button secondary" data-action="start-weakness" ${mistakeCount ? "" : "disabled"}>${icon("refresh")}重練弱點</button>
          <button class="button ghost" data-action="open-mistakes">${icon("book")}查看錯題</button>
        </div>
      </section>
    `;
  }

  function renderProofHomeCard(records) {
    const stats = proofStats(records);
    return `
      <section class="study-card proof-home-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">Proof Lab</p>
            <h3>證明題庫</h3>
          </div>
          <span class="study-count">${stats.total} 題</span>
        </div>
        <div class="proof-mini-stats">
          <div><span>看懂</span><strong>${stats.understood}</strong></div>
          <div><span>部分會</span><strong>${stats.partial}</strong></div>
          <div><span>卡住</span><strong>${stats.stuck}</strong></div>
        </div>
        <p class="panel-note">不限時、不機器判分。看參考證明後自己標記掌握程度。</p>
        <div class="action-row">
          <button class="button secondary" data-action="open-proofs">${icon("file-pen-line")}進入 Proof Lab</button>
        </div>
      </section>
    `;
  }

  function renderBrandFocusCard(records, weaknesses) {
    const focus = focusTrainingInfo(records, weaknesses[0]);
    const subtopic = weaknesses[1]?.label || "Rationalization";
    return `
      <section class="study-card brand-focus-card">
        <div>
          <p class="section-label">Buzz Focus</p>
          <h3>本週主題：${escapeHtml(focus.label)}</h3>
        </div>
        <div class="focus-route">
          <div><span>錯誤</span><strong>${focus.errorCount} 次</strong></div>
          <div><span>進度</span><strong>${focus.completed}/${focus.total}</strong></div>
          <div><span>目標</span><strong>10 題</strong></div>
        </div>
      </section>
    `;
  }

  function renderLockedWeaknessState() {
    return `
      <div class="locked-state">
        <strong>尚無弱點資料</strong>
        <span>完成一局後顯示</span>
      </div>
    `;
  }

  function renderTodayStatusCard(records, mission, daily) {
    return `
      <section class="study-card today-study">
        <div class="panel-title-row">
          <div>
            <p class="section-label">今日進度</p>
            <h3>${mission.done ? "已完成" : "尚未完成"}</h3>
          </div>
          <span class="status-dot ${mission.done ? "is-done" : ""}"></span>
        </div>
        <div class="today-target">
          <span>目標：完成 ${mission.target} 題</span>
          <strong>${mission.completed} / ${mission.target}</strong>
        </div>
        <div class="meter-track"><div class="meter-fill" style="width:${mission.progress}%"></div></div>
        <p class="panel-note">${mission.done ? `今日最佳分數 ${daily.score}，正確率 ${daily.accuracy}%。` : `完成後可延續每日任務紀錄，目前連續完成 ${mission.dailyStreak} 天。`}</p>
        <div class="local-data-note">本機紀錄：${records.totalAnswered || 0} 題完成，${Object.keys(records.mistakes || {}).length} 題待複習。</div>
      </section>
    `;
  }

  function renderModePicker() {
    const primary = ["quick", "daily"];
    const advanced = ["topic", "practice", "brutal", "boss"];
    return `
      <div class="segmented modes learning-picker" role="tablist" aria-label="模式選擇">
        ${primary
          .filter((key) => MODES[key])
          .map(
            (key) => {
              const item = MODES[key];
              return `
              <button class="segment rich-segment ${selectedMode === key ? "is-active" : ""}" data-mode="${key}">
                <strong>${item.label}</strong>
                <span>${modeDescription(key)}</span>
              </button>`;
            }
          )
          .join("")}
      </div>
      <details class="advanced-mode-drawer">
        <summary>進階模式</summary>
        <div class="segmented modes learning-picker">
          ${advanced
            .filter((key) => MODES[key])
            .map(
              (key) => {
                const item = MODES[key];
                return `
                <button class="segment rich-segment ${selectedMode === key ? "is-active" : ""}" data-mode="${key}">
                  <strong>${item.label}</strong>
                  <span>${modeDescription(key)}</span>
                </button>`;
              }
            )
            .join("")}
        </div>
      </details>
    `;
  }

  function renderTopicPicker() {
    return `
      <div class="segmented home-topic-grid learning-picker" role="tablist" aria-label="題型選擇">
        ${Object.entries(TOPICS)
          .filter(([key]) => key !== "all" || selectedMode !== "topic")
          .map(
            ([key, item]) => `
              <button class="segment rich-segment ${selectedTopic === key ? "is-active" : ""}" data-topic="${key}">
                <strong>${item.label}</strong>
                <span>${topicCountText(key)}｜${topicDescription(key)}</span>
              </button>`
          )
          .join("")}
      </div>
    `;
  }

  function renderAnswerModePicker() {
    return `
      <div class="segmented answer-modes learning-picker" role="tablist" aria-label="答題方式選擇">
        ${Object.entries(ANSWER_MODES)
          .map(
            ([key, item]) => `
              <button class="segment rich-segment ${selectedAnswerMode === key ? "is-active" : ""}" data-answer-mode="${key}">
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
            <div class="mini-stats">
              <div><span>作答歷史</span><strong>${(records.history || []).length}</strong></div>
              <div><span>錯題</span><strong>${Object.keys(records.mistakes || {}).length}</strong></div>
              <div><span>練習局</span><strong>${(records.attempts || 0) + (records.practiceRuns || 0)}</strong></div>
            </div>
            <div class="stack-actions home-record-actions">
              <button class="button secondary" data-action="open-history">${icon("clock")}作答歷史</button>
              <button class="button ghost" data-action="export-records">${icon("download")}匯出 JSON</button>
              <label class="button ghost import-label" for="import-records">${icon("upload")}匯入 JSON</label>
              <button class="button ghost" data-action="reset-records">${icon("trash")}清除資料</button>
              <input class="sr-only" id="import-records" type="file" accept="application/json" />
            </div>
          </details>
        </section>
      </aside>
    `;
  }

  function renderWeaknessChips(weaknesses) {
    const items = weaknesses.length ? weaknesses.slice(0, 3) : [{ label: "今日題組" }, { label: "全混合" }, { label: "12 題" }];
    return items.map((item) => `<span class="weakness-chip">${escapeHtml(item.label)}</span>`).join("");
  }

  function renderWeaknessList(weaknesses) {
    return `
      <ol class="weakness-study-list">
        ${weaknesses
          .slice(0, 3)
          .map((item) => `<li><strong>${escapeHtml(item.label)}</strong><span>最近錯誤 ${item.count} 次</span></li>`)
          .join("")}
      </ol>
    `;
  }

  function renderHomeWeaknessSnapshot(records) {
    const analysis = buildWeaknessAnalysis(records);
    if (!analysis.topics.length && !analysis.tags.length) {
      return `
        <div class="empty-state compact-empty">尚無錯題</div>
      `;
    }
    return `
      <div class="focus-list">
        ${analysis.topics.slice(0, 3).map((item) => renderFocusItem(item.label, item.count, item.max)).join("")}
      </div>
      <div class="weakness-tags compact-tags">
        ${analysis.tags.slice(0, 4).map((item) => `<button class="tag-button" data-action="train-tag" data-tag="${escapeAttr(item.key)}">${escapeHtml(item.label)} · ${item.count}</button>`).join("")}
      </div>
    `;
  }

  function renderFocusItem(label, count, max) {
    const pct = max ? Math.max(8, Math.round((count / max) * 100)) : 0;
    return `
      <div class="focus-item">
        <span>${escapeHtml(label)}</span>
        <strong>${count}</strong>
        <div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div>
      </div>
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

  function renderProofLab() {
    const records = loadRecords();
    const stats = proofStats(records);
    const items = proofs.filter((proof) => selectedProofTier === "all" || proof.tier === selectedProofTier);
    return `
      <main class="screen">
        <section class="panel page-panel proof-lab">
          <div class="page-head">
            <div>
              <p class="section-label">Proof Lab</p>
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

          <div class="segmented compact proof-tier-picker" role="tablist" aria-label="證明題難度篩選">
            ${Object.entries(PROOF_TIERS)
              .map(([key, label]) => {
                const count = key === "all" ? proofs.length : proofs.filter((proof) => proof.tier === key).length;
                return `
                  <button class="segment ${selectedProofTier === key ? "is-active" : ""}" data-proof-tier="${escapeAttr(key)}">
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

        <details class="proof-hints">
          <summary>提示</summary>
          <ul>
            ${(proof.hints || []).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
          </ul>
        </details>

        <div class="proof-key-steps">
          <strong>關鍵步驟</strong>
          <div>${(proof.keySteps || []).map((step) => `<span>${escapeHtml(step)}</span>`).join("")}</div>
        </div>

        ${
          viewed
            ? renderProofSolution(proof)
            : `<button class="button secondary proof-solution-button" data-action="view-proof-solution" data-proof-id="${escapeAttr(proof.id)}">${icon("book-open-check")}看參考證明</button>`
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

  function proofStatusLabel(status) {
    return {
      understood: "看懂",
      partial: "部分會",
      stuck: "還不會"
    }[status] || "未標記";
  }

  function renderMistakes() {
    const records = loadRecords();
    const entries = Object.values(records.mistakes || {})
      .map((item) => ({ ...item, problem: problemById(item.problemId) }))
      .filter((item) => item.problem)
      .filter((item) => selectedMistakeTopic === "all" || item.problem.topic === selectedMistakeTopic)
      .sort((a, b) => (b.lastWrongAt || "").localeCompare(a.lastWrongAt || ""));
    return `
      <main class="screen">
        <section class="panel page-panel">
          <div class="page-head">
            <div>
              <p class="section-label">Review</p>
              <h2>錯題本</h2>
            </div>
            <div class="action-row">
              <button class="button secondary" data-action="home">${icon("home")}回首頁</button>
              <button class="button" data-action="start-mistakes" ${entries.length ? "" : "disabled"}>${icon("refresh")}重練目前篩選</button>
              <button class="button ghost" data-action="clear-mistakes" ${entries.length ? "" : "disabled"}>${icon("trash")}清除目前篩選</button>
            </div>
          </div>
          ${renderWeaknessPanel(records)}
          <div class="segmented compact" role="tablist" aria-label="錯題題型篩選">
            ${Object.entries(TOPICS)
              .map(
                ([key, topic]) => `
                  <button class="segment ${selectedMistakeTopic === key ? "is-active" : ""}" data-mistake-topic="${key}">
                    <strong>${topic.label}</strong>
                    <span>${mistakeTopicCount(records, key)} 題</span>
                  </button>`
              )
              .join("")}
          </div>
          <div class="review-list">
            ${
              entries.length
                ? entries.map(renderMistakeItem).join("")
                : `<div class="empty-state">目前沒有符合篩選的錯題。</div>`
            }
          </div>
        </section>
      </main>
    `;
  }

  function renderMistakeItem(item) {
    const problem = item.problem;
    return `
      <article class="review-item is-wrong">
        <div class="review-top">
          <span>${TOPICS[problem.topic].label} · ${difficultyBadge(problem)} · 錯 ${item.wrongCount || 1} 次</span>
          <strong>${escapeHtml(item.reason || "Wrong")}</strong>
        </div>
        <div class="review-prompt math-block" data-tex="${escapeAttr(problem.prompt)}"></div>
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
          <div class="segmented compact" role="tablist" aria-label="歷史題型篩選">
            ${Object.entries(TOPICS)
              .map(
                ([key, topic]) => `
                  <button class="segment ${selectedHistoryTopic === key ? "is-active" : ""}" data-history-topic="${key}">
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
      <details class="history-detail">
        <summary>題目回顧</summary>
        <div class="history-review-list">
          ${answers
            .map((answer, index) => {
              const problem = problemById(answer.problemId);
              if (!problem) return "";
              return `
                <div class="history-review-item ${answer.correct ? "is-correct" : "is-wrong"}">
                  <strong>#${index + 1} · ${TOPICS[problem.topic].label} · ${answer.elapsed}s</strong>
                  <div class="review-prompt math-block" data-tex="${escapeAttr(problem.prompt)}"></div>
                  <span>你的答案：${escapeHtml(answer.input || "未作答")} · ${answer.correct ? "Correct" : answer.reason}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </details>
    `;
  }

  function renderQuiz() {
    const current = getCurrentProblem();
    if (!quiz || !current) return "";
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const remaining = Math.max(0, current.timeLimit - elapsed);
    const progress = Math.round((quiz.index / quiz.problems.length) * 100);
    const totalTabs = quiz.tabSwitches[current.id] || 0;
    const isPractice = Boolean(quiz.practice);
    const isDanger = !isPractice && remaining <= 8 ? "is-danger" : "";
    const feedback = quiz.feedback;
    const answerMode = quiz.answerMode || "free";

    return `
      <main class="screen quiz-screen">
        <section class="arena">
          <div class="arena-top">
            <div class="progress-block">
              <div class="progress-meta">
                <strong>${modeLabel(quiz.mode)}</strong>
                <span>第 ${quiz.index + 1} / ${quiz.problems.length} 題</span>
                <span>${isPractice ? "練習模式" : `目前分數 ${quiz.score}`}</span>
                <span>連勝 ${quiz.currentStreak}</span>
              </div>
              <div class="progress-bar" aria-label="進度"><span style="width:${progress}%"></span></div>
            </div>
            <div class="timer-cluster">
              <div class="timer-box ${isDanger}" data-live-box="time">
                <span>${isPractice ? "Mode" : "Time"}</span>
                <strong data-live="time">${isPractice ? "Free" : remaining}</strong>
              </div>
              <div class="timer-box ${!isPractice && totalTabs > current.tabLimit ? "is-danger" : ""}">
                <span>${isPractice ? "Tabs" : "Tabs"}</span>
                <strong>${isPractice ? "Off" : `${totalTabs}/${current.tabLimit}`}</strong>
              </div>
            </div>
          </div>

          <div class="problem-stage">
            <article class="problem-card">
              <div class="problem-meta">
                ${topicChip(current)}
                <span class="chip">${difficultyBadge(current)}</span>
                ${sourceChip(current)}
                <span class="chip">${answerKindLabel(current.answerKind)}</span>
                <span class="chip">${answerModeLabel(answerMode)}</span>
              </div>
              <div class="prompt math-block" data-tex="${escapeAttr(current.prompt)}"></div>
              ${renderHintPanel(current)}
              ${renderAnswerControls(current)}
            </article>

            ${
              feedback
                ? `<div class="feedback ${feedback.status}">
                    <strong>${feedback.title}</strong>
                    <p>${feedback.message}</p>
                  </div>`
                : `<div class="feedback"><strong>作答狀態</strong><p>${isPractice ? "練習模式不倒數、不記切分頁、不加扣分。" : `倒數開始後請保持在本頁。這題允許 ${current.tabLimit} 次切分頁。`}</p></div>`
            }
          </div>

          <div class="action-row">
            <button class="button secondary" data-action="skip">${icon("skip")}跳過</button>
            <button class="button ghost" data-action="show-rules">${icon("info")}規則</button>
          </div>
        </section>
      </main>
      ${quiz.modal === "rules" ? renderRulesModal() : ""}
      ${quiz.modal === "exit" ? renderExitModal() : ""}
    `;
  }

  function renderAnswerControls(problem) {
    if (quiz.answerMode === "choice") return renderChoiceControls(problem);
    return renderFreeAnswerControls(problem);
  }

  function renderHintPanel(problem) {
    const hints = hintsFor(problem);
    const shown = Math.min(quiz.hintsUsed?.[problem.id] || 0, hints.length);
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
    return `
      <div class="handwrite-shell webwork-shell ${fullscreen ? "is-fullscreen" : ""}">
        ${fullscreen ? `${scratchboard}${answerWorkspace}` : `${answerWorkspace}${scratchboard}`}
      </div>
    `;
  }

  function renderWebWorkAnswerWorkspace(problem, disabled, previewTex, compact) {
    const syntax = answerSyntaxInfo(problem, quiz.draft);
    return `
      <section class="webwork-answer ${compact ? "is-docked" : ""}">
        <div class="webwork-head">
          <div>
            <span>Answer</span>
            <strong>${answerKindLabel(problem.answerKind)}</strong>
          </div>
          <span class="syntax-pill ${syntax.className}" data-syntax-status>${syntax.label}</span>
        </div>
        <form class="answer-panel webwork-form" data-action="submit-answer">
        <label class="sr-only" for="answer">答案</label>
        <input id="answer" class="answer-input" autocomplete="off" inputmode="text" value="${escapeAttr(quiz.draft)}" placeholder="${placeholderFor(problem)}" ${disabled} />
        <button class="button" type="submit" ${disabled}>${icon("send")}送出</button>
        </form>
        <div class="answer-preview webwork-preview">
          <span>Preview</span>
          <div class="answer-preview-math math-inline ${quiz.draft.trim() ? "" : "is-empty"}" data-answer-preview data-tex="${escapeAttr(previewTex)}">${renderLiteTex(previewTex, false)}</div>
        </div>
        <div class="keypad webwork-keypad" aria-label="快速輸入">
          ${KEYS.map((key) => `<button type="button" data-insert="${escapeAttr(key)}" ${disabled}>${key}</button>`).join("")}
        </div>
        <div class="helper-row webwork-helper">
          <span>${formatHelp(problem.answerKind)}</span>
          <span>不定積分可省略 +C</span>
          <span>送出前先看 Preview</span>
        </div>
      </section>
    `;
  }

  function renderScratchboard(problem, disabled, boardTool, fullscreen, boardOpen, strokeCount) {
    return `
      <section class="scratchboard-shell ${boardOpen ? "is-open" : "is-collapsed"}">
        <div class="scratchboard-summary">
          <div>
            <span>Scratchboard</span>
            <strong>${strokeCount ? `${strokeCount} strokes` : "草稿黑板"}</strong>
          </div>
          <div class="board-tools" aria-label="黑板工具">
            <button class="icon-button" type="button" data-board-action="toggle" title="${boardOpen ? "收合黑板" : "展開黑板"}" ${disabled}>${icon(boardOpen ? "chevron-up" : "chevron-down")}</button>
            ${
              boardOpen
                ? `
                  <button class="icon-button ${boardTool === "pen" ? "is-active" : ""}" type="button" data-board-action="tool" data-tool="pen" title="筆" ${disabled}>${icon("pen")}</button>
                  <button class="icon-button ${boardTool === "eraser" ? "is-active" : ""}" type="button" data-board-action="tool" data-tool="eraser" title="橡皮擦" ${disabled}>${icon("eraser")}</button>
                  <button class="icon-button" type="button" data-board-action="undo" title="復原" ${disabled}>${icon("undo")}</button>
                  <button class="icon-button" type="button" data-board-action="clear" title="清除黑板" ${disabled}>${icon("trash")}</button>
                  <button class="icon-button" type="button" data-board-action="fullscreen" title="${fullscreen ? "退出全螢幕" : "黑板全螢幕"}" ${disabled}>${icon(fullscreen ? "minimize" : "maximize")}</button>
                `
                : ""
            }
          </div>
        </div>
        ${
          boardOpen
            ? `<canvas class="blackboard" data-blackboard data-problem-id="${escapeAttr(problem.id)}" aria-label="手寫黑板"></canvas>`
            : ""
        }
      </section>
    `;
  }

  function answerSyntaxInfo(problem, value) {
    const raw = String(value || "").trim();
    if (!raw) return { label: "Empty", className: "is-empty" };
    if (problem.answerKind === "text") return { label: "Text", className: "is-ready" };
    if (isTexLike(raw)) return { label: "TeX", className: "is-ready" };
    if (expressionToTex(raw)) return { label: "Ready", className: "is-ready" };
    return { label: "Syntax", className: "is-warning" };
  }

  function renderChoiceControls(problem) {
    const disabled = quiz.feedback ? "disabled" : "";
    const choices = getChoiceOptions(problem);
    return `
      <div class="choice-grid" role="radiogroup" aria-label="選擇答案">
        ${choices
          .map(
            (choice, index) => {
              const choiceTex = answerToTex(choice.label, problem) || textToTex(choice.label);
              return `
              <button class="choice-option" type="button" data-action="choose-answer" data-choice="${escapeAttr(choice.value)}" ${disabled}>
                <span>${String.fromCharCode(65 + index)}</span>
                <strong class="choice-math math-inline" data-tex="${escapeAttr(choiceTex)}">${renderLiteTex(choiceTex, false)}</strong>
              </button>`;
            }
          )
          .join("")}
      </div>
      <div class="helper-row">
        <span>點選選項後會直接送出</span>
        <span>選擇題仍使用原本答案檢查器判定</span>
      </div>
    `;
  }

  function renderRulesModal() {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="rules-title" data-modal>
          <h3 id="rules-title">本局規則</h3>
          <p>每題都有自己的倒數與切分頁限制。超時、跳過、答案不等價或超過切分頁限制，都會記為錯題。系統會在答題後顯示簡短解法。</p>
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

  function renderResults() {
    if (!quiz) return "";
    const correct = quiz.answers.filter((answer) => answer.correct).length;
    const total = quiz.problems.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const avgTime = quiz.answers.length
      ? Math.round(quiz.answers.reduce((sum, answer) => sum + answer.elapsed, 0) / quiz.answers.length)
      : 0;
    const topicStats = buildTopicStats(quiz.answers);
    const records = loadRecords();
    const unlocked = quiz.unlockedAchievements || [];
    const gateResult = quiz.pathGate ? pathGateResult(quiz, correct, total) : null;
    const pathResult = !gateResult && quiz.pathNodeId ? pathLessonResult(quiz, records, accuracy) : null;

    return `
      <main class="screen">
        <div class="results-grid">
          <section class="score-hero">
            <div>
              <p class="section-label">結算</p>
              <h2>${gateResult ? (gateResult.passed ? "跳關通過" : "跳關未通過") : resultTitle(accuracy)}</h2>
            </div>
            <div class="score-cards">
              <div class="score-card"><span>Score</span><strong>${quiz.score}</strong></div>
              <div class="score-card"><span>Correct</span><strong>${correct}/${total}</strong></div>
              <div class="score-card"><span>Accuracy</span><strong>${accuracy}%</strong></div>
              <div class="score-card"><span>Avg Sec</span><strong>${avgTime}</strong></div>
            </div>
            ${gateResult ? renderPathGateResult(gateResult) : ""}
            ${pathResult ? renderPathLessonResult(pathResult) : ""}
            ${renderResultsActions(gateResult, pathResult)}
          </section>

          <aside class="side-panel">
            <section class="panel">
              <h3>本機最佳</h3>
              <div class="topic-meter">
                <div class="meter-row"><span>最高分</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, records.bestScore || 0)}%"></div></div><strong>${records.bestScore || 0}</strong></div>
                <div class="meter-row"><span>最佳連勝</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (records.bestStreak || 0) * 10)}%"></div></div><strong>${records.bestStreak || 0}</strong></div>
                <div class="meter-row"><span>局數</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (records.attempts || 0) * 8)}%"></div></div><strong>${records.attempts || 0}</strong></div>
              </div>
            </section>
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
              <h3>本局成就</h3>
              <div class="achievement-list">
                ${
                  unlocked.length
                    ? unlocked.map((item) => `<div class="achievement is-new"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div>`).join("")
                    : `<div class="empty-state">本局沒有新成就。</div>`
                }
              </div>
            </section>
          </aside>
        </div>

        <section class="panel" style="margin-top:24px">
          <h3>答題回顧</h3>
          <div class="review-list">
            ${
              quiz.answers.length
                ? quiz.answers.map(renderReviewItem).join("")
                : `<div class="empty-state">本局尚未作答。</div>`
            }
          </div>
        </section>
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

  function renderPathGateResult(gate) {
    return `
      <div class="path-gate-result ${gate.passed ? "is-passed" : "is-failed"}">
        <strong>${gate.targetLabel}</strong>
        <span>${gate.correct}/${gate.total}，門檻 ${gate.required}/${gate.total}</span>
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
      mastery: node.mastery,
      cleared: Boolean(run.cleared || accuracy >= 70),
      bestAccuracy: run.bestAccuracy || accuracy
    };
  }

  function renderPathLessonResult(result) {
    return `
      <div class="path-lesson-result ${result.cleared ? "is-cleared" : "is-review"}">
        <div>
          <strong>${escapeHtml(result.node.label)}</strong>
          <span>熟練度 ${result.mastery}% · 最佳 ${result.bestAccuracy}%</span>
        </div>
        <span>${result.cleared ? (result.nextNode ? `下一關：${escapeHtml(result.nextNode.label)}` : "主線完成") : "建議再練一次"}</span>
      </div>
    `;
  }

  function renderResultsActions(gateResult, pathResult) {
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

  function renderReviewItem(answer, index) {
    const item = answer.problem;
    return `
      <article class="review-item ${answer.correct ? "is-correct" : "is-wrong"}">
        <div class="review-top">
          <span>#${index + 1} · ${TOPICS[item.topic].label} · ${answer.elapsed}s</span>
          <strong>${answer.correct ? "Correct" : answer.reason}</strong>
        </div>
        <div class="review-prompt math-block" data-tex="${escapeAttr(item.prompt)}"></div>
        ${
          answer.boardStrokes && answer.boardStrokes.length
            ? `<canvas class="review-board" data-review-board="${index}" aria-label="黑板草稿回顧"></canvas>`
            : ""
        }
        <div class="review-answer">
          你的答案：${escapeHtml(answer.input || "未作答")}<br />
          提示使用：${answer.hintsUsed || 0}<br />
          參考答案：${escapeHtml(displayAnswer(item))}<br />
          ${escapeHtml(item.solution)}
        </div>
        ${
          answer.correct
            ? ""
            : `<div class="tag-row">${ERROR_TAGS.map((tag) => `<button class="tag-button ${answer.errorTag === tag ? "is-active" : ""}" data-action="tag-answer" data-problem-id="${escapeAttr(item.id)}" data-tag="${escapeAttr(tag)}">${tag}</button>`).join("")}</div>`
        }
      </article>
    `;
  }

  function bindEvents() {
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

    const importInput = app.querySelector("#import-records");
    if (importInput) {
      importInput.addEventListener("change", () => importRecords(importInput.files && importInput.files[0]));
    }

    app.querySelectorAll("[data-action]").forEach((node) => {
      node.addEventListener("click", handleAction);
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
    }

    app.querySelectorAll("[data-insert]").forEach((button) => {
      button.addEventListener("click", () => insertToken(button.dataset.insert));
    });

    setupBlackboard();
  }

  function handleAction(event) {
    const modal = event.target.closest("[data-modal]");
    const actionNode = event.target.closest("[data-action]");
    if (!actionNode) return;
    if (event.currentTarget.classList && event.currentTarget.classList.contains("modal-backdrop") && modal) {
      return;
    }

    const action = actionNode.dataset.action;
    if (action === "start") startQuiz();
    if (action === "start-weakness") startWeaknessPractice();
    if (action === "dismiss-onboarding") {
      const records = loadRecords();
      records.onboardingSeen = true;
      saveRecords(records);
      render();
    }
    if (action === "start-choice") {
      selectedAnswerMode = "choice";
      selectedMode = "quick";
      startQuiz();
    }
    if (action === "start-daily") {
      selectedMode = "daily";
      selectedAnswerMode = "choice";
      startQuiz();
    }
    if (action === "start-path-node") openPathIntro(actionNode.dataset.nodeId);
    if (action === "start-path-lesson") startPathLesson(actionNode.dataset.nodeId || activePathNodeId);
    if (action === "start-path-gate") startPathGate(actionNode.dataset.nodeId || activePathNodeId);
    if (action === "choose-answer") submitChoiceAnswer(actionNode.dataset.choice || "");
    if (action === "show-hint") showHint();
    if (action === "skip") recordAnswer({ status: "wrong", reason: "Skipped", input: quiz.draft || "" });
    if (action === "open-mistakes") {
      view = "mistakes";
      render();
    }
    if (action === "open-history") {
      view = "history";
      render();
    }
    if (action === "open-proofs") {
      view = "proofs";
      render();
    }
    if (action === "view-proof-solution") viewProofSolution(actionNode.dataset.proofId);
    if (action === "mark-proof-status") markProofStatus(actionNode.dataset.proofId, actionNode.dataset.proofStatus || "");
    if (action === "start-mistakes") startMistakeQuiz(selectedMistakeTopic);
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
    if (action === "clear-history") clearHistory();
    if (action === "export-records") exportRecords();
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
      quiz = null;
      activePathNodeId = "";
      if (MODES[selectedMode] && MODES[selectedMode].hidden) selectedMode = "quick";
      view = "home";
      render();
    }
    if (action === "reset-records") {
      localStorage.removeItem(STORAGE_KEY);
      render();
    }
  }

  function startMistakeQuiz(topic, problemIds) {
    const records = loadRecords();
    const ids = problemIds && problemIds.length
      ? problemIds
      : Object.values(records.mistakes || {})
          .filter((item) => topic === "all" || problemById(item.problemId)?.topic === topic)
          .map((item) => item.problemId);
    const pool = ids.map(problemById).filter(Boolean);
    if (!pool.length) return;
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
    selectedAnswerMode = "choice";
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
    const pool = pathNodeProblems(node);
    const fallback = selectProblemPool(mode, node.topic || "all");
    const source = pool.length ? pool : fallback;
    if (mode.boss) return selectBossPool(source, mode.count);
    if (mode.daily) return selectDailyPool(source, mode.count);
    const ordered = adaptiveShuffle(source, loadRecords(), seedFromString(`${Date.now()}-${node.id}`));
    return padPool(ordered.slice(0, mode.count), source, mode.count);
  }

  function selectPathGatePool(node, count) {
    const index = Math.max(0, PATH_NODES.findIndex((item) => item.id === node.id));
    const sourceNodes = index > 0 ? PATH_NODES.slice(0, index) : [node];
    const seen = new Set();
    const pool = sourceNodes
      .flatMap((item) => pathNodeProblems(item))
      .filter((problem) => {
        if (seen.has(problem.id)) return false;
        seen.add(problem.id);
        return true;
      });
    const fallback = pathNodeProblems(node);
    const source = pool.length ? pool : fallback;
    const ordered = adaptiveShuffle(source, loadRecords(), seedFromString(`${Date.now()}-gate-${node.id}`));
    return padPool(ordered.slice(0, count), source, count);
  }

  function pathGateInfo(_node) {
    return { total: 5, required: 4 };
  }

  function pathGateUnlocked(records, nodeId) {
    return Boolean(records.pathUnlocks && records.pathUnlocks[nodeId]);
  }

  function startWeaknessPractice() {
    const records = loadRecords();
    selectedAnswerMode = "choice";
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
        if (answer.problem.id === problemId && !answer.correct) answer.errorTag = tag;
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

  function clearHistory() {
    const records = loadRecords();
    records.history = [];
    saveRecords(records);
    render();
  }

  function exportRecords() {
    const records = loadRecords();
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buzzcalculus-records-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    trackEvent("export_data", {
      history_count: (records.history || []).length,
      mistake_count: Object.keys(records.mistakes || {}).length
    });
  }

  function importRecords(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const incoming = normalizeRecords(JSON.parse(String(reader.result || "{}")));
        saveRecords(incoming);
        trackEvent("import_data", {
          history_count: (incoming.history || []).length,
          mistake_count: Object.keys(incoming.mistakes || {}).length
        });
        render();
      } catch (_error) {
        window.alert("匯入失敗：檔案不是有效的 BuzzCalculus JSON。");
      }
    });
    reader.readAsText(file);
  }

  function showHint() {
    if (!quiz || quiz.feedback) return;
    const current = getCurrentProblem();
    if (!current) return;
    const hints = hintsFor(current);
    const used = quiz.hintsUsed[current.id] || 0;
    if (used >= hints.length) return;
    quiz.hintsUsed[current.id] = used + 1;
    trackEvent("use_hint", {
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
    const mode = MODES[selectedMode] || MODES.quick;
    const pool = customProblems && customProblems.length ? customProblems : selectProblemPool(mode, selectedTopic);
    if (!pool.length) {
      view = "home";
      render();
      return;
    }
    quiz = {
      mode: options.modeKey || selectedMode,
      topic: selectedTopic,
      answerMode: selectedAnswerMode,
      practice: options.practice !== undefined ? Boolean(options.practice) : Boolean(mode.practice),
      pathNodeId: options.pathNodeId || "",
      pathGate: options.pathGate || null,
      problems: pool,
      index: 0,
      score: 0,
      answers: [],
      currentStreak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
      questionStartedAt: Date.now(),
      tabSwitches: {},
      choiceOptions: {},
      boardStrokes: {},
      boardTool: "pen",
      boardOpen: false,
      boardFullscreen: false,
      hintsUsed: {},
      draft: "",
      feedback: null,
      modal: null
    };
    view = "quiz";
    lastVisibilityStamp = Date.now();
    if (!quiz.practice) startTicker();
    trackEvent("start_session", {
      mode: quiz.mode,
      topic: quiz.topic,
      pack: selectedPack,
      answer_mode: quiz.answerMode,
      problem_count: quiz.problems.length,
      practice: Boolean(quiz.practice)
    });
    render();
  }

  function selectProblemPool(mode, topic) {
    let pool = problems.slice();
    if (mode.hidden && selectedMode === "mistakes") {
      const records = loadRecords();
      pool = Object.values(records.mistakes || {}).map((item) => problemById(item.problemId)).filter(Boolean);
      return padPool(pool, pool, Math.min(mode.count, pool.length || mode.count));
    }
    if (mode.topicLocked) {
      pool = pool.filter((problem) => problem.topic === (topic === "all" ? "limits" : topic));
    } else if (topic !== "all") {
      pool = pool.filter((problem) => problem.topic === topic);
    }
    if (selectedPack !== "all") {
      pool = pool.filter((problem) => matchesPack(problem, selectedPack));
    }
    if (mode.hardOnly) {
      const hardPool = pool.filter((problem) => problemRank(problem) >= 4);
      pool = hardPool.length ? hardPool : pool;
    }

    if (mode.boss) {
      return selectBossPool(pool, mode.count);
    }

    if (mode.daily) {
      return selectDailyPool(pool, mode.count);
    }

    const seed = mode.daily ? seedFromString(new Date().toISOString().slice(0, 10)) : Date.now();
    const ordered = mode.daily ? shuffle(pool, seed) : adaptiveShuffle(pool, loadRecords(), seed);
    return padPool(ordered.slice(0, mode.count), pool, mode.count);
  }

  function selectBossPool(pool, count) {
    const bossPool = pool.filter((problem) => problemRank(problem) >= 5);
    const sourcePool = bossPool.length ? bossPool : pool.filter((problem) => problemRank(problem) >= 4);
    const ranked = [6, 5, 4].flatMap((rank) =>
      shuffle(sourcePool.filter((problem) => problemRank(problem) === rank), seedFromString(`${Date.now()}-boss-${rank}`)).slice(0, rank === 6 ? 7 : 5)
    );
    return padPool(ranked, sourcePool.length ? sourcePool : pool, count);
  }

  function selectDailyPool(pool, count) {
    const seed = seedFromString(new Date().toISOString().slice(0, 10));
    const plan = [1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 5, 2].slice(0, count);
    const selected = [];
    const buckets = [1, 2, 3, 4, 5, 6].reduce((acc, rank) => {
      acc[rank] = shuffle(pool.filter((problem) => problemRank(problem) === rank), seedFromString(`${seed}-daily-${rank}`));
      return acc;
    }, {});
    plan.forEach((targetRank) => {
      const ranks = [targetRank, targetRank - 1, targetRank + 1, targetRank - 2, targetRank + 2, 6].filter((rank) => rank >= 1 && rank <= 6);
      const bucket = ranks.map((rank) => buckets[rank]).find((items) => items && items.length);
      if (bucket) selected.push(bucket.shift());
    });
    return padPool(selected, shuffle(pool, seed), count);
  }

  function padPool(selected, pool, count) {
    const result = selected.slice();
    const shuffled = shuffle(pool, seedFromString(`${Date.now()}-pad`));
    let cursor = 0;
    while (result.length < count && shuffled.length) {
      result.push(shuffled[cursor % shuffled.length]);
      cursor += 1;
    }
    return result.slice(0, count);
  }

  function adaptiveShuffle(pool, records, seed) {
    return pool
      .slice()
      .map((problem, index) => {
        const stat = records.problemStats[problem.id] || { correct: 0, wrong: 0, total: 0 };
        const topic = records.topicStats[problem.topic] || { wrong: 0, total: 0 };
        const problemWeakness = stat.total ? stat.wrong / stat.total : 0;
        const topicWeakness = topic.total ? topic.wrong / topic.total : 0;
        const mistakeBoost = records.mistakes[problem.id] ? 0.45 : 0;
        const randomness = hashUnit(`${seed}-${problem.id}-${index}`);
        return {
          problem,
          score: randomness + problemWeakness * 0.85 + topicWeakness * 0.55 + mistakeBoost
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.problem);
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

  function problemRank(problem) {
    return Math.max(1, Math.min(6, Number(problem.rank || problem.difficulty || 1)));
  }

  function submitCurrentAnswer() {
    if (!quiz) return;
    const current = getCurrentProblem();
    const input = quiz.draft.trim();
    const totalTabs = quiz.tabSwitches[current.id] || 0;
    if (!quiz.practice && totalTabs > current.tabLimit) {
      recordAnswer({ status: "wrong", reason: "Tab limit", input });
      return;
    }
    const result = checkAnswer(current, input);
    recordAnswer({
      status: result.correct ? "correct" : "wrong",
      reason: result.correct ? "Correct" : "Wrong",
      input,
      detail: result.message
    });
  }

  function submitChoiceAnswer(input) {
    if (!quiz || quiz.feedback) return;
    quiz.draft = input;
    submitCurrentAnswer();
  }

  function recordAnswer({ status, reason, input, detail }) {
    if (!quiz) return;
    if (quiz.feedback) return;
    const problem = getCurrentProblem();
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const correct = status === "correct";
    const usedHints = quiz.hintsUsed?.[problem.id] || 0;
    const timeBonus = correct && !quiz.practice ? Math.max(0, problem.timeLimit - elapsed) : 0;
    const difficultyBonus = problemRank(problem) * 10;
    const penalty = correct && !quiz.practice ? usedHints * hintPenalty(problem) : 0;
    const earned = correct && !quiz.practice ? Math.max(0, 40 + difficultyBonus + timeBonus - penalty) : 0;
    quiz.score += earned;
    quiz.currentStreak = correct ? quiz.currentStreak + 1 : 0;
    quiz.bestStreak = Math.max(quiz.bestStreak, quiz.currentStreak);
    quiz.answers.push({
      problem,
      input,
      correct,
      reason,
      elapsed,
      earned,
      hintsUsed: usedHints,
      boardStrokes: cloneBoardStrokes(problem.id),
      errorTag: ""
    });
    trackEvent("submit_answer", {
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
      tab_switches: quiz.tabSwitches[problem.id] || 0,
      practice: Boolean(quiz.practice)
    });
    quiz.feedback = {
      status: correct ? "correct" : reason === "Timeout" ? "timeout" : "wrong",
      title: correct ? (quiz.practice ? "答對" : `答對，+${earned}`) : `${reason}`,
      message: detail || problem.solution || "這題先記下來，結算頁可以回看。"
    };
    stopTicker();
    window.setTimeout(() => {
      if (!quiz) return;
      quiz.index += 1;
      if (quiz.index >= quiz.problems.length) {
        finishQuiz();
        return;
      }
      quiz.questionStartedAt = Date.now();
      quiz.draft = "";
      quiz.feedback = null;
      quiz.modal = null;
      quiz.boardOpen = false;
      quiz.boardFullscreen = false;
      startTicker();
      render();
    }, 950);
    render();
  }

  function finishQuiz() {
    stopTicker();
    if (quiz) {
      const correct = quiz.answers.filter((answer) => answer.correct).length;
      const tabSwitches = Object.values(quiz.tabSwitches || {}).reduce((sum, count) => sum + count, 0);
      trackEvent("finish_session", {
        mode: quiz.mode,
        topic: quiz.topic,
        answer_mode: quiz.answerMode,
        problem_count: quiz.problems.length,
        answered_count: quiz.answers.length,
        correct_count: correct,
        score: quiz.score,
        tab_switches: tabSwitches,
        practice: Boolean(quiz.practice)
      });
      saveQuizRecord(quiz);
    }
    view = "results";
    render();
  }

  function startTicker() {
    stopTicker();
    if (quiz && quiz.practice) return;
    tickHandle = window.setInterval(() => {
      if (!quiz || view !== "quiz") return;
      const current = getCurrentProblem();
      const elapsed = Math.floor((Date.now() - quiz.questionStartedAt) / 1000);
      if (!quiz.feedback && elapsed >= current.timeLimit) {
        recordAnswer({ status: "wrong", reason: "Timeout", input: quiz.draft || "" });
      } else {
        updateLiveQuizStats();
      }
    }, 1000);
  }

  function updateLiveQuizStats() {
    if (!quiz || view !== "quiz") return;
    const current = getCurrentProblem();
    if (!current) return;
    const elapsed = Math.max(0, Math.floor((Date.now() - quiz.questionStartedAt) / 1000));
    const remaining = Math.max(0, current.timeLimit - elapsed);
    const timeNode = app.querySelector('[data-live="time"]');
    const timeBox = app.querySelector('[data-live-box="time"]');
    if (timeNode) timeNode.textContent = String(remaining);
    if (timeBox) timeBox.classList.toggle("is-danger", remaining <= 8);
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
      return checkExpression(problem.answer, input, problem.variables || problem.variable || "x");
    }
    if (problem.answerKind === "antiderivative") {
      return checkAntiderivative(problem.answer, input, problem.variable || "x");
    }
    if (problem.answerKind === "text") {
      return checkText(problem, input);
    }
    return { correct: false, message: "這個題型的檢查器還沒接上。" };
  }

  function checkNumeric(expected, input) {
    const normalized = normalizeText(input);
    if (["dne", "doesnotexist", "不存在"].includes(normalized)) {
      return { correct: normalizeText(expected) === "dne", message: "以 DNE 判定。" };
    }
    const a = evaluateExpression(expected, {});
    const b = evaluateExpression(input, {});
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return { correct: false, message: "數值答案無法解析。" };
    }
    const tolerance = Math.max(1e-7, Math.abs(a) * 1e-6);
    return {
      correct: Math.abs(a - b) <= tolerance,
      message: Math.abs(a - b) <= tolerance ? "數值等價。" : `參考答案是 ${expected}。`
    };
  }

  function checkExpression(expected, input, variable) {
    const variables = Array.isArray(variable) ? variable : [variable];
    const samples = expressionSamples(variables);
    let valid = 0;
    for (const vars of samples) {
      const a = evaluateExpression(expected, vars);
      const b = evaluateExpression(input, vars);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      valid += 1;
      const tolerance = Math.max(1e-6, Math.abs(a) * 1e-5);
      if (Math.abs(a - b) > tolerance) {
        return { correct: false, message: `代入 ${formatVars(vars)} 時不等價。參考答案：${expected}` };
      }
    }
    return {
      correct: valid >= 3,
      message: valid >= 3 ? "多點代入等價。" : "答案在測試點無法穩定解析。"
    };
  }

  function expressionSamples(variables) {
    const base = [0.35, 0.8, 1.4, 2.2, 3.1, 4.4];
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

  function checkAntiderivative(expected, input, variable) {
    const samples = [0.7, 1.1, 1.8, 2.6, 3.5];
    const diffs = [];
    for (const x of samples) {
      const vars = { [variable]: x };
      const a = evaluateExpression(expected, vars);
      const b = evaluateExpression(stripConstant(input), vars);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      diffs.push(b - a);
    }
    if (diffs.length < 3) {
      return { correct: false, message: "答案無法穩定解析；請用 x、sin(x)、log(x) 這類格式。" };
    }
    const base = diffs[0];
    const ok = diffs.every((value) => Math.abs(value - base) <= Math.max(1e-5, Math.abs(base) * 1e-5));
    return {
      correct: ok,
      message: ok ? "原函數相差常數。" : `原函數不等價。參考答案：${expected}`
    };
  }

  function checkText(problem, input) {
    const normalized = normalizeText(input);
    const ok = problem.answers.some((answer) => normalizeText(answer) === normalized);
    return {
      correct: ok,
      message: ok ? "文字判定吻合。" : `參考答案：${problem.canonical || problem.answers[0]}`
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
    fallbackChoiceDistractors(problem).forEach((value) => addOption(value, false));

    const shuffled = shuffle(
      options.slice(0, 4),
      seedFromString(`${quiz.startedAt}-${problem.id}-${quiz.index}-choices`)
    );
    quiz.choiceOptions[problem.id] = shuffled;
    return shuffled;
  }

  function buildChoiceDistractors(problem, correct) {
    const sameKind = problems.filter((item) => item.id !== problem.id && item.answerKind === problem.answerKind);
    const sameTopic = sameKind.filter((item) => item.topic === problem.topic);
    const answerPool = [...sameTopic, ...sameKind].map(displayAnswer);
    const generated = generatedChoiceDistractors(problem, correct);
    return shuffle([...generated, ...answerPool], seedFromString(`${problem.id}-distractors`));
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
      const body = `"use strict"; const {sin,cos,tan,asin,acos,atan,log,exp,sqrt,abs,pow,PI,E}=Math; const sec=(v)=>1/cos(v); const csc=(v)=>1/sin(v); const cot=(v)=>1/tan(v); return (${expr});`;
      const fn = new Function(...names, body);
      return Number(fn(...values));
    } catch (_error) {
      return Number.NaN;
    }
  }

  function normalizeExpression(source) {
    let expr = String(source || "").trim();
    expr = expr.replace(/\\pi/g, "pi");
    expr = expr.replace(/π/g, "pi");
    expr = expr.replace(/∞/g, "Infinity");
    expr = expr.replace(/\bln\s*\(/gi, "log(");
    expr = expr.replace(/\barctan\s*\(/gi, "atan(");
    expr = expr.replace(/\barcsin\s*\(/gi, "asin(");
    expr = expr.replace(/\barccos\s*\(/gi, "acos(");
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/\bpi\b/gi, "PI");
    expr = expr.replace(/\be\b/g, "E");
    expr = expr.replace(/\s+/g, "");
    expr = applyImplicitMultiplication(expr);
    if (/[^0-9a-zA-Z_+\-*/().,]/.test(expr)) return "";
    if (/(constructor|window|document|globalThis|Function|eval|=>|;|=)/.test(expr)) return "";
    return expr;
  }

  function applyImplicitMultiplication(expr) {
    const functionNames = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "log", "exp", "sqrt", "abs", "pow", "sec", "csc", "cot"]);
    return String(expr || "")
      .replace(/(\d|\))(?=[A-Za-z_(])/g, "$1*")
      .replace(/\)(?=\d)/g, ")*")
      .replace(/(PI|E)(?=[A-Za-z_(])/g, "$1*")
      .replace(/([A-Za-z_][A-Za-z0-9_]*)(?=\()/g, (name) => (functionNames.has(name) ? name : `${name}*`));
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
    const next = input.value.slice(0, start) + token + input.value.slice(end);
    input.value = next;
    quiz.draft = next;
    const cursor = start + token.length;
    input.focus();
    input.setSelectionRange(cursor, cursor);
    updateAnswerPreview(next);
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

  function setupBlackboard() {
    const canvas = app.querySelector("[data-blackboard]");
    if (!quiz) return;
    const current = getCurrentProblem();
    const problemId = canvas?.dataset.problemId || current?.id || "";
    const ctx = canvas ? canvas.getContext("2d") : null;
    let drawing = false;
    let currentStroke = null;

    app.querySelectorAll("[data-board-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!quiz || quiz.feedback) return;
        const action = button.dataset.boardAction;
        if (action === "toggle") {
          quiz.boardOpen = !quiz.boardOpen;
          if (!quiz.boardOpen) quiz.boardFullscreen = false;
          render();
          return;
        }
        if (action === "tool") {
          quiz.boardTool = button.dataset.tool || "pen";
          quiz.boardOpen = true;
          render();
          return;
        }
        if (action === "fullscreen") {
          quiz.boardFullscreen = !quiz.boardFullscreen;
          quiz.boardOpen = true;
          render();
          return;
        }
        const strokes = getBoardStrokes(problemId);
        if (action === "undo") strokes.pop();
        if (action === "clear") strokes.length = 0;
        if (canvas && ctx) drawBlackboard(canvas, ctx, problemId);
        render();
      });
    });

    if (!canvas || !ctx) return;

    resizeBlackboard(canvas);
    drawBlackboard(canvas, ctx, problemId);

    canvas.addEventListener("pointerdown", (event) => {
      if (!quiz || quiz.feedback) return;
      event.preventDefault();
      quiz.boardOpen = true;
      drawing = true;
      canvas.setPointerCapture(event.pointerId);
      currentStroke = {
        tool: quiz.boardTool || "pen",
        points: [blackboardPoint(canvas, event)]
      };
      getBoardStrokes(problemId).push(currentStroke);
      drawBlackboard(canvas, ctx, problemId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!drawing || !currentStroke) return;
      event.preventDefault();
      currentStroke.points.push(blackboardPoint(canvas, event));
      drawBlackboard(canvas, ctx, problemId);
    });

    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);

    function endStroke(event) {
      if (!drawing) return;
      drawing = false;
      currentStroke = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }
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

  function resizeBlackboard(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
  }

  function blackboardPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / Math.max(1, rect.width),
      y: (event.clientY - rect.top) / Math.max(1, rect.height),
      pressure: event.pressure || 0.5
    };
  }

  function drawBlackboard(canvas, ctx, problemId) {
    drawStrokesOnBlackboard(canvas, ctx, getBoardStrokes(problemId));
  }

  function drawStrokesOnBlackboard(canvas, ctx, strokes) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#11130f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((stroke) => drawStroke(canvas, ctx, stroke));
  }

  function drawStroke(canvas, ctx, stroke) {
    if (!stroke.points.length) return;
    const isEraser = stroke.tool === "eraser";
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = isEraser ? "#11130f" : "#fff8de";
    ctx.lineWidth = (isEraser ? 18 : 4) * Math.min(2, window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    stroke.points.forEach((point, index) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    if (stroke.points.length === 1) {
      const point = stroke.points[0];
      ctx.lineTo(point.x * canvas.width + 0.1, point.y * canvas.height + 0.1);
    }
    ctx.stroke();
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeRecords(records)));
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
    next.onboardingSeen = Boolean(next.onboardingSeen);
    return next;
  }

  function saveQuizRecord(currentQuiz) {
    const records = loadRecords();
    const finishedAt = new Date().toISOString();
    const correct = currentQuiz.answers.filter((answer) => answer.correct).length;
    const total = currentQuiz.problems.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const avgTime = currentQuiz.answers.length
      ? Math.round(currentQuiz.answers.reduce((sum, answer) => sum + answer.elapsed, 0) / currentQuiz.answers.length)
      : 0;

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

    currentQuiz.answers.forEach((answer) => updateAnswerRecords(records, answer, finishedAt));

    const historyItem = {
      id: `${currentQuiz.startedAt}-${finishedAt}`,
      mode: currentQuiz.mode,
      modeLabel: modeLabel(currentQuiz.mode),
      answerMode: currentQuiz.answerMode,
      practice: Boolean(currentQuiz.practice),
      topic: currentQuiz.topic,
      topics: Array.from(new Set(currentQuiz.problems.map((problem) => problem.topic))),
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
        errorTag: answer.errorTag || ""
      }))
    };
    records.history = [historyItem, ...(records.history || [])].slice(0, HISTORY_LIMIT);

    if (currentQuiz.mode === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      const previous = records.daily[today];
      if (!previous || currentQuiz.score >= previous.score) {
        records.daily[today] = {
          score: currentQuiz.score,
          correct,
          total,
          accuracy,
          finishedAt
        };
      }
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
      records.pathLessonRuns[currentQuiz.pathNodeId] = {
        attempts: (previous.attempts || 0) + 1,
        bestAccuracy: Math.max(previous.bestAccuracy || 0, accuracy),
        lastAccuracy: accuracy,
        lastScore: currentQuiz.score,
        lastFinishedAt: finishedAt,
        cleared: Boolean(previous.cleared || accuracy >= 70)
      };
    }

    currentQuiz.unlockedAchievements = updateAchievements(records, currentQuiz, historyItem);
    saveRecords(records);
  }

  function updateAnswerRecords(records, answer, finishedAt) {
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
      records.mistakes[problem.id] = {
        problemId: problem.id,
        wrongCount: (previous.wrongCount || 0) + 1,
        lastWrongAt: finishedAt,
        reason: answer.reason,
        lastInput: answer.input,
        tag: answer.errorTag || previous.tag || ""
      };
    } else if (records.mistakes[problem.id]) {
      records.mistakes[problem.id].lastCorrectAt = finishedAt;
    }
  }

  function updateAchievements(records, currentQuiz, historyItem) {
    const definitions = [
      ["first_run", "開局", "完成第一局", () => records.attempts + records.practiceRuns >= 1],
      ["streak_5", "連勝 5", "單局連勝達 5 題", () => currentQuiz.bestStreak >= 5 || records.bestStreak >= 5],
      ["streak_10", "連勝 10", "單局連勝達 10 題", () => currentQuiz.bestStreak >= 10 || records.bestStreak >= 10],
      ["score_500", "500 分", "單局分數達 500", () => records.bestScore >= 500],
      ["daily_done", "Daily 完成", "完成每日題組", () => currentQuiz.mode === "daily"],
      ["boss_clear", "Boss 通關", "完成 Boss Ladder 且正確率 70% 以上", () => currentQuiz.mode === "boss" && historyItem.accuracy >= 70],
      ["blackboard_user", "黑板使用者", "至少一題留下手寫草稿", () => currentQuiz.answers.some((answer) => answer.boardStrokes && answer.boardStrokes.length)],
      ["hundred_answers", "百題訓練", "本機累積作答 100 題", () => records.totalAnswered >= 100]
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

  function overallAccuracy(records) {
    return records.totalAnswered ? Math.round(((records.totalCorrect || 0) / records.totalAnswered) * 100) : 0;
  }

  function dailyMissionInfo(records, daily) {
    const target = MODES.daily.count;
    const completed = daily ? Math.min(target, Number(daily.total || target)) : 0;
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

  function recentDaysStats(records, days) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    let total = 0;
    let correct = 0;
    (records.history || []).forEach((item) => {
      const time = Date.parse(item.finishedAt || "");
      if (!Number.isFinite(time) || time < cutoff) return;
      total += Number(item.total || 0);
      correct += Number(item.correct || 0);
    });
    return {
      total,
      correct,
      accuracy: total ? Math.round((correct / total) * 100) : null
    };
  }

  function formatPercent(value, emptyLabel = "尚無資料") {
    return value === null || value === undefined ? emptyLabel : `${value}%`;
  }

  function formatSeconds(value) {
    return value === null || value === undefined ? "—" : `${value}s`;
  }

  function performanceTrend(overall, recent) {
    if (recent === null || recent === undefined) return "";
    const diff = recent - overall;
    if (diff >= 8) return `最近 30 題 +${diff}%`;
    if (diff <= -8) return `最近 30 題 ${diff}%`;
    return "";
  }

  function rankProgress(records) {
    const tiers = [
      { name: "Rookie", total: 0 },
      { name: "Builder", total: 35 },
      { name: "Expert", total: 90 },
      { name: "Master", total: 180 },
      { name: "Grandmaster", total: 300 },
      { name: "Legend", total: 500 }
    ];
    const current = computeRank(records);
    const index = Math.max(0, tiers.findIndex((tier) => tier.name === current));
    const currentTier = tiers[index] || tiers[0];
    const next = tiers[index + 1] || null;
    const total = records.totalAnswered || 0;
    if (!next) return { current, next: null, remaining: 0, progress: 100 };
    const span = Math.max(1, next.total - currentTier.total);
    const progress = Math.max(0, Math.min(100, Math.round(((total - currentTier.total) / span) * 100)));
    return {
      current,
      next,
      remaining: Math.max(0, next.total - total),
      progress
    };
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

  function focusTrainingInfo(records, weakness) {
    const fallback = { key: "taylor", label: "Taylor Series", count: 0 };
    const item = weakness || fallback;
    const relatedProblems = problems.filter((problem) => {
      if (problem.topic === item.key) return true;
      return (problem.tags || []).includes(item.key);
    });
    const completed = relatedProblems.filter((problem) => records.problemStats?.[problem.id]?.total).length;
    const total = relatedProblems.length || problems.length;
    const reason = item.count
      ? `因為最近錯誤集中在 ${item.label}。`
      : "目前尚無錯題紀錄，先用高頻技巧建立反射。";
    return {
      label: item.label,
      errorCount: item.count || 0,
      completed,
      total,
      reason
    };
  }

  function modeDescription(mode) {
    return {
      quick: "12 題",
      topic: "單範圍",
      daily: "固定題組",
      practice: "不限時",
      brutal: "高難度",
      boss: "階梯",
      mistakes: "錯題"
    }[mode] || "";
  }

  function topicDescription(topic) {
    return {
      all: "混合",
      limits: "Limit",
      derivatives: "Derivative",
      integrals: "Integral",
      series: "Series"
    }[topic] || "";
  }

  function answerModeDescription(mode) {
    return {
      choice: "四選一",
      free: "輸入 + 預覽"
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

  function problemById(id) {
    return problems.find((problem) => problem.id === id) || null;
  }

  function modeLabel(mode) {
    if (mode === "path_gate") return "跳關小測驗";
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

  function buildWeaknessAnalysis(records) {
    const topicCounts = {};
    const tagCounts = {};
    const errorTagCounts = {};
    Object.values(records.mistakes || {}).forEach((item) => {
      const problem = problemById(item.problemId);
      if (!problem) return;
      const weight = item.wrongCount || 1;
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
      .map(([key, count]) => ({ key, label: labeler(key), count, max }));
  }

  function tagLabel(tag) {
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
    if (topic === "all") return `${problems.length} 題`;
    return `${problems.filter((problem) => problem.topic === topic).length} 題`;
  }

  function packCountText(packKey) {
    const topicPool = selectedTopic === "all" ? problems : problems.filter((problem) => problem.topic === selectedTopic);
    if (packKey === "all") return topicPool.length;
    return topicPool.filter((problem) => matchesPack(problem, packKey)).length;
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

  function renderTopicMeter(key, topic) {
    const count = problems.filter((problem) => problem.topic === key).length;
    const pct = Math.round((count / Math.max(1, problems.length)) * 100);
    return `
      <div class="meter-row">
        <span>${topic.label}</span>
        <div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:${topic.accent}"></div></div>
        <strong>${count}</strong>
      </div>
    `;
  }

  function topicChip(problem) {
    const topic = TOPICS[problem.topic];
    return `<span class="chip ${topic.className}">${topic.label}</span>`;
  }

  function sourceChip(problem) {
    return problem.source ? `<span class="chip">${escapeHtml(problem.source)}</span>` : "";
  }

  function answerKindLabel(kind) {
    return {
      numeric: "數值",
      expression: "函數式",
      antiderivative: "原函數",
      text: "判定"
    }[kind];
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
    if (problem.answerKind === "antiderivative") return "例如：x^2*log(x)/2-x^2/4";
    if (problem.answerKind === "expression") return "例如：2*x*sin(x)+x^2*cos(x)";
    return "例如：pi/4 或 3/2";
  }

  function formatHelp(kind) {
    if (kind === "text") return "收斂、發散、條件收斂";
    if (kind === "numeric") return "分數、pi、e、sqrt";
    return "用 * 表乘法，^ 表次方";
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

  function renderMathNode(node, displayMode) {
    const tex = node.dataset.tex || "";
    if (window.katex) {
      try {
        window.katex.render(tex, node, {
          displayMode,
          throwOnError: false,
          strict: "ignore"
        });
        return;
      } catch (_error) {
        node.innerHTML = renderLiteTex(tex, displayMode);
      }
    }
    node.innerHTML = renderLiteTex(tex, displayMode);
  }

  function renderLiteTex(tex, displayMode = true) {
    return `<span class="lite-math ${displayMode ? "" : "lite-math-inline"}">${renderLiteTexInline(tex)}</span>`;
  }

  function renderLiteTexInline(source) {
    let text = String(source || "");
    text = replaceTwoGroupCommand(text, "\\frac", (top, bottom) => {
      return `<span class="lite-frac"><span>${renderLiteTexInline(top)}</span><span>${renderLiteTexInline(bottom)}</span></span>`;
    });
    text = replaceOneGroupCommand(text, "\\sqrt", (body) => {
      return `<span class="lite-sqrt"><span>${renderLiteTexInline(body)}</span></span>`;
    });
    text = replaceBigOperator(text, "\\sum", "Σ", "lite-sum");
    text = replaceBigOperator(text, "\\int", "∫", "lite-int");
    text = replaceLimitOperator(text);
    text = replaceScripts(text);
    text = escapeHtml(text);
    text = text
      .replace(/ZZHTMLLTZZ/g, "<")
      .replace(/ZZHTMLGTZZ/g, ">")
      .replace(/ZZHTMLQUOTEZZ/g, '"')
      .replace(/ZZHTMLSLASHZZ/g, "/");
    return text
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\,/g, " ")
      .replace(/\\to/g, "→")
      .replace(/\\infty/g, "∞")
      .replace(/\\pi/g, "π")
      .replace(/\\sin/g, "sin")
      .replace(/\\cos/g, "cos")
      .replace(/\\tan/g, "tan")
      .replace(/\\ln/g, "ln")
      .replace(/\\log/g, "log")
      .replace(/\\arctan/g, "arctan")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\{/g, "")
      .replace(/\}/g, "");
  }

  function protectHtml(html) {
    return html
      .replace(/</g, "ZZHTMLLTZZ")
      .replace(/>/g, "ZZHTMLGTZZ")
      .replace(/"/g, "ZZHTMLQUOTEZZ")
      .replace(/\//g, "ZZHTMLSLASHZZ");
  }

  function replaceOneGroupCommand(source, command, renderer) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const group = readGroup(source, index + command.length);
      if (!group) {
        output += source.slice(cursor, index + command.length);
        cursor = index + command.length;
        continue;
      }
      output += source.slice(cursor, index) + protectHtml(renderer(group.value));
      cursor = group.end;
    }
    return output;
  }

  function replaceTwoGroupCommand(source, command, renderer) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      const first = readGroup(source, index + command.length);
      const second = first ? readGroup(source, first.end) : null;
      if (!first || !second) {
        output += source.slice(cursor, index + command.length);
        cursor = index + command.length;
        continue;
      }
      output += source.slice(cursor, index) + protectHtml(renderer(first.value, second.value));
      cursor = second.end;
    }
    return output;
  }

  function replaceBigOperator(source, command, symbol, className) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      let next = index + command.length;
      let sub = "";
      let sup = "";
      if (source[next] === "_") {
        const group = readScript(source, next + 1);
        if (group) {
          sub = group.value;
          next = group.end;
        }
      }
      if (source[next] === "^") {
        const group = readScript(source, next + 1);
        if (group) {
          sup = group.value;
          next = group.end;
        }
      }
      const html = `<span class="${className}"><span class="lite-script">${renderLiteTexInline(sup)}</span><span class="lite-symbol">${symbol}</span><span class="lite-script">${renderLiteTexInline(sub)}</span></span>`;
      output += source.slice(cursor, index) + protectHtml(html);
      cursor = next;
    }
    return output;
  }

  function replaceLimitOperator(source) {
    let output = "";
    let cursor = 0;
    const command = "\\lim";
    while (cursor < source.length) {
      const index = source.indexOf(command, cursor);
      if (index === -1) {
        output += source.slice(cursor);
        break;
      }
      let next = index + command.length;
      let sub = "";
      if (source[next] === "_") {
        const group = readScript(source, next + 1);
        if (group) {
          sub = group.value;
          next = group.end;
        }
      }
      const html = `<span class="lite-lim"><span class="lite-symbol">lim</span><span class="lite-script">${renderLiteTexInline(sub)}</span></span>`;
      output += source.slice(cursor, index) + protectHtml(html);
      cursor = next;
    }
    return output;
  }

  function replaceScripts(source) {
    let output = "";
    let cursor = 0;
    while (cursor < source.length) {
      const char = source[cursor];
      if (char !== "^" && char !== "_") {
        output += char;
        cursor += 1;
        continue;
      }
      const script = readScript(source, cursor + 1);
      if (!script) {
        output += char;
        cursor += 1;
        continue;
      }
      const tag = char === "^" ? "sup" : "sub";
      output += protectHtml(`<${tag}>${renderLiteTexInline(script.value)}</${tag}>`);
      cursor = script.end;
    }
    return output;
  }

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
      download: "download",
      upload: "upload",
      calendar: "calendar-days",
      lightbulb: "lightbulb",
      pen: "pen-line",
      eraser: "eraser",
      undo: "undo-2",
      maximize: "maximize-2",
      minimize: "minimize-2"
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

  function setupVisibilityTracking() {
    document.addEventListener("visibilitychange", () => {
      if (!quiz || view !== "quiz" || quiz.feedback || quiz.practice) return;
      const current = getCurrentProblem();
      if (!current) return;
      if (document.visibilityState === "hidden") {
        const now = Date.now();
        if (now - lastVisibilityStamp < 400) return;
        lastVisibilityStamp = now;
        const totalTabs = trackTabSwitch(current);
        if (totalTabs > current.tabLimit) {
          recordAnswer({ status: "wrong", reason: "Tab limit", input: quiz.draft || "" });
        } else {
          render();
        }
      }
    });

    window.addEventListener("blur", () => {
      if (!quiz || view !== "quiz" || quiz.feedback || quiz.practice) return;
      const current = getCurrentProblem();
      const now = Date.now();
      if (!current || now - lastVisibilityStamp < 800) return;
      lastVisibilityStamp = now;
      const totalTabs = trackTabSwitch(current);
      if (totalTabs > current.tabLimit) {
        recordAnswer({ status: "wrong", reason: "Tab limit", input: quiz.draft || "" });
      } else {
        render();
      }
    });
  }

  function setupMathField() {
    if (!field) return;
    const ctx = field.getContext("2d");
    if (!ctx) return;
    const symbols = ["∫", "Σ", "lim", "dx", "π", "eˣ", "f′", "→"];
    const particles = Array.from({ length: 24 }, (_, index) => ({
      text: symbols[index % symbols.length],
      x: Math.random(),
      y: Math.random(),
      speed: 0.00012 + Math.random() * 0.00018,
      size: 14 + Math.random() * 22
    }));

    function resize() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      field.width = Math.floor(window.innerWidth * ratio);
      field.height = Math.floor(window.innerHeight * ratio);
      field.style.width = `${window.innerWidth}px`;
      field.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(23, 22, 20, 0.14)";
      particles.forEach((particle) => {
        particle.y += particle.speed * 16;
        if (particle.y > 1.08) {
          particle.y = -0.08;
          particle.x = Math.random();
        }
        ctx.font = `${particle.size}px Georgia, serif`;
        ctx.fillText(particle.text, particle.x * window.innerWidth, particle.y * window.innerHeight);
      });
      fieldAnimation = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  if (window.__BUZZ_TEST_HOOKS__) {
    window.__BUZZ_TEST_HOOKS__.api = {
      checkAnswer,
      checkNumeric,
      checkExpression,
      checkAntiderivative,
      checkText,
      evaluateExpression,
      normalizeExpression,
      normalizeText,
      problemRank,
      trainingPacks: TRAINING_PACKS,
      packGroups: PACK_GROUPS,
      pathNodes: PATH_NODES,
      pathNodeProblems,
      learningPathState,
      matchesPack,
      packTotalCountText
    };
  }

  setupAnalytics();
  setupVisibilityTracking();
  setupMathField();
  render();
})();
