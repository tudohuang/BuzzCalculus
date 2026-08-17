(function () {
  "use strict";

  const LABELS = {
    1: "Warm-up",
    2: "Basic",
    3: "Standard",
    4: "Advanced",
    5: "Boss",
    6: "Boss+"
  };

  const LEGACY_OVERRIDES = {
    "lim-012": 3,
    "lim-013": 3,
    "lim-014": 4,
    "lim-015": 3,
    "lim-016": 4,
    "lim-017": 3,
    "lim-018": 3,
    "lim-019": 4,
    "lim-020": 3,
    "der-013": 4,
    "der-014": 3,
    "der-015": 3,
    "der-016": 3,
    "der-017": 3,
    "der-018": 3,
    "der-019": 2,
    "der-020": 3,
    "int-012": 2,
    "int-013": 3,
    "int-014": 3,
    "int-015": 4,
    "int-016": 3,
    "int-017": 3,
    "int-018": 3,
    "int-019": 4,
    "int-020": 3,
    "ser-012": 2,
    "ser-013": 2,
    "ser-014": 3,
    "ser-015": 3,
    "ser-016": 4,
    "ser-017": 3,
    "ser-018": 2,
    "ser-019": 2,
    "ser-020": 3,
    "td-der-002": 2,
    "td-der-003": 3,
    "td-der-004": 3,
    "int-040": 3,
    "int-047": 3,
    "int-048": 4,
    "int-049": 4,
    "int-050": 4,
    "int-051": 4
  };

  // 2026-07 audit: per-item corrections for packs that hardcoded R5/R6.
  // These are authoritative — tag floors do not re-lift them.
  const AUDIT_OVERRIDES = {
    "exam-ser-018": 1,
    "exam-der-003": 2,
    "exam-int-001": 2,
    "exam-ser-009": 2,
    "uni-int-018": 2,
    "uni-der-001": 3,
    "uni-ser-004": 3,
    "world-076": 2,
    "world-050": 2,
    "world-090": 3,
    "world-069": 3,
    "world-071": 3,
    "world-079": 3,
    "world-092": 3,
    "world-055": 3,
    "world-087": 4,
    "world-063": 4,
    "burst-int-039": 2,
    "burst-boss2-int-012": 3,
    "burst-boss2-int-013": 3,
    "burst-boss2-int-014": 3,
    "burst-boss2-anti-006": 3,
    "burst-der-001": 3,
    "burst-boss-int-011": 3,
    "burst-boss2-ser-001": 4,
    "app-005": 2,
    "app-006": 1,
    "app-007": 2,
    "app-008": 2,
    "app-011": 3,
    "hd-001": 3,
    "putnam-010": 3,
    "hc-rad-002": 3
  };

  // Routine technique recognition (improper integrals, Frullani, King's
  // property, Beta/Gamma, Wallis) floors at R4, not R5 — genuinely hard
  // instances already carry a native R5-6 rank, and floors only lift.
  const MIN_RANK_BY_TAG = [
    [["technique-sprint", "trap-drill", "technique-recognition"], 2],
    [["limit-trap", "partial-fraction", "trig-substitution", "integration-by-parts", "ibp", "root-test", "endpoint-analysis", "limit-comparison"], 3],
    [["multivariable", "double-integral", "hessian", "wronskian", "lagrange-multiplier", "nabla", "vector-calculus", "jacobian", "total-differential", "frullani", "parameter-integral", "kings-property", "improper-integral", "cosine-integral", "beta-function", "gamma-function", "wallis"], 4],
    [["complex", "ode-style", "convolution", "triple-integral", "change-of-variables", "jacobian-chain", "total-differential-min", "bessel"], 5],
    [["bessel", "complex", "change-of-variables", "triple-integral"], 6]
  ];

  const BOSS_PLUS_PATTERNS = [/^td-lim-00[123]$/, /^td-ser-00[123]$/, /^td-int-00[1256]$/];

  function clampRank(value) {
    return Math.max(1, Math.min(6, Number(value) || 1));
  }

  function hasAny(tags, required) {
    return required.some((tag) => tags.includes(tag));
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  // rubric 三軸是難度的正式來源（spec 05.1）。
  //
  // 下面那整套 MIN_RANK_BY_TAG「標籤地板」是它的前身，現在退居 fallback：
  // 地板只會抬不會降，結果是任何帶 multivariable 的題自動 ≥R4，
  // ∫₀¹∫₀¹(x+y)dydx 這種送分題也不例外；R6 一度佔了全庫的 32%。
  //
  // 保留 fallback 是架構鐵律 1：kernel 沒載進來時，程式仍然要能跑，
  // 只是難度回到舊的算法。
  function rubricRankFor(problem) {
    if (typeof window === "undefined" || !window.BuzzRubric || !window.BuzzSkillGraph) return null;
    try {
      const skills = window.BuzzSkillGraph.skillsForProblem(problem) || [];
      return window.BuzzRubric.rankFor(problem.id, skills.length);
    } catch (_error) {
      return null;
    }
  }

  function calibratedRank(problem) {
    const fromRubric = rubricRankFor(problem);
    if (fromRubric) return clampRank(fromRubric);

    const tags = problem.tags || [];
    let rank = clampRank(problem.authoredRank || problem.rank || problem.difficulty || 1);

    if (AUDIT_OVERRIDES[problem.id]) {
      return clampRank(AUDIT_OVERRIDES[problem.id]);
    }

    if (LEGACY_OVERRIDES[problem.id]) {
      rank = LEGACY_OVERRIDES[problem.id];
    }

    MIN_RANK_BY_TAG.forEach(([required, minRank]) => {
      if (hasAny(tags, required)) rank = Math.max(rank, minRank);
    });

    if (BOSS_PLUS_PATTERNS.some((pattern) => pattern.test(problem.id || ""))) {
      rank = Math.max(rank, 6);
    }

    if (hasAny(tags, ["technique-sprint", "trap-drill"]) && !hasAny(tags, ["limit-trap"])) {
      rank = Math.min(rank, 2);
    }

    return clampRank(rank);
  }

  const CALIBRATION_TAGS = /^(rank-\d|boss-rank|boss-plus|beginner-friendly)$/;

  function applyCalibration(problem) {
    // 出題者原本填的難度，覆寫之前先留一份。
    // 沒有這一行的話，校準跑完之後作者的判斷就永久消失了 ——
    // 難度重推工具第二次執行時會拿自己上一輪的輸出當「作者原判」，
    // 而那條「沒有證據就不推翻作者」的規則也就失去意義。
    if (problem.authoredRank === undefined) {
      problem.authoredRank = clampRank(problem.rank || problem.difficulty || 1);
    }
    const rank = calibratedRank(problem);
    const extraTags = [`rank-${rank}`];
    if (rank <= 2) extraTags.push("beginner-friendly");
    if (rank >= 5) extraTags.push("boss-rank");
    if (rank >= 6) extraTags.push("boss-plus");

    problem.rank = rank;
    problem.rankLabel = LABELS[rank];
    // 理由改用三軸的白話說明（「三四步、課本有教但容易忘、要草稿但直線推進」），
    // 而不是 "standard calibration" 這種對使用者毫無資訊的字串。
    problem.rankReason = (typeof window !== "undefined" && window.BuzzRubric && window.BuzzRubric.reasonFor(problem.id))
      || (rank >= 5 ? "advanced technique" : rank <= 2 ? "warm-up compatible" : "standard calibration");
    // Strip stale calibration-owned tags (packs may self-tag) before re-deriving.
    const baseTags = (problem.tags || []).filter((tag) => !CALIBRATION_TAGS.test(tag));
    problem.tags = unique([...baseTags, ...extraTags]);
    return problem;
  }

  const problems = window.BUZZ_PROBLEMS || [];
  problems.forEach(applyCalibration);

  window.BUZZ_DIFFICULTY = {
    labels: LABELS,
    calibratedRank,
    applyCalibration
  };
})();
