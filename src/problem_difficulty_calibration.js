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

  const MIN_RANK_BY_TAG = [
    [["technique-sprint", "trap-drill", "technique-recognition"], 2],
    [["limit-trap", "partial-fraction", "trig-substitution", "integration-by-parts", "ibp", "root-test", "endpoint-analysis", "limit-comparison"], 3],
    [["multivariable", "double-integral", "hessian", "wronskian", "lagrange-multiplier", "nabla", "vector-calculus", "jacobian", "total-differential"], 4],
    [["complex", "frullani", "ode-style", "convolution", "parameter-integral", "kings-property", "improper-integral", "triple-integral", "change-of-variables", "jacobian-chain", "total-differential-min", "cosine-integral", "beta-function", "gamma-function", "wallis", "bessel"], 5],
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

  function calibratedRank(problem) {
    const tags = problem.tags || [];
    let rank = clampRank(problem.rank || problem.difficulty || 1);

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

  function applyCalibration(problem) {
    const rank = calibratedRank(problem);
    const extraTags = [`rank-${rank}`];
    if (rank <= 2) extraTags.push("beginner-friendly");
    if (rank >= 5) extraTags.push("boss-rank");
    if (rank >= 6) extraTags.push("boss-plus");

    problem.rank = rank;
    problem.rankLabel = LABELS[rank];
    problem.rankReason = rank >= 5 ? "advanced technique" : rank <= 2 ? "warm-up compatible" : "standard calibration";
    problem.tags = unique([...(problem.tags || []), ...extraTags]);
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
