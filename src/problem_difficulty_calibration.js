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

  function calibratedRank(problem) {
    const tags = problem.tags || [];
    let rank = clampRank(problem.rank || problem.difficulty || 1);

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
    const rank = calibratedRank(problem);
    const extraTags = [`rank-${rank}`];
    if (rank <= 2) extraTags.push("beginner-friendly");
    if (rank >= 5) extraTags.push("boss-rank");
    if (rank >= 6) extraTags.push("boss-plus");

    problem.rank = rank;
    problem.rankLabel = LABELS[rank];
    problem.rankReason = rank >= 5 ? "advanced technique" : rank <= 2 ? "warm-up compatible" : "standard calibration";
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
