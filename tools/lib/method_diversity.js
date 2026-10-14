// 方法多樣性的量法 —— report_method_diversity.js（CI 報表）、validate_problem_profiles.js、build_stats_workbook.js 共用。
//
// 三個口徑，同一套家族（每題的主要家族 methodFamily[0]）：
//   bank     全題庫：每題算 1
//   default  預設池：每題算 defaultWeight（抽題器兩段式的第一段就是照這個質量抽家族）
//   sampled  實際抽出來的（validate_problem_profiles.js 模擬 1,000 局）
// HHI = Σ(份額²) × 10000：1 個家族獨佔 = 10000；n 個家族平分 = 10000 / n。
"use strict";

const taxonomy = require("../content/method_taxonomy.js");

const TOPICS = ["limits", "derivatives", "integrals", "series"];

// rows：[{ topic, rank, fam, mass }] → { "topic|rank": { total, fams: { fam: mass } } }
function tabulate(rows) {
  const out = {};
  rows.forEach(({ topic, rank, fam, mass }) => {
    const k = `${topic}|${rank}`;
    const cell = (out[k] = out[k] || { topic, rank: Number(rank), total: 0, fams: {} });
    cell.total += mass;
    cell.fams[fam] = (cell.fams[fam] || 0) + mass;
  });
  Object.values(out).forEach((cell) => {
    cell.shares = {};
    Object.entries(cell.fams).forEach(([fam, m]) => { cell.shares[fam] = cell.total > 0 ? m / cell.total : 0; });
    cell.hhi = Math.round(Object.values(cell.shares).reduce((s, x) => s + x * x, 0) * 10000);
    cell.families = Object.values(cell.fams).filter((m) => m > 0).length;
    const top = Object.entries(cell.shares).sort((a, b) => b[1] - a[1])[0];
    cell.top = top ? { fam: top[0], share: top[1] } : null;
  });
  return out;
}

function bankRows(problems, profiles, mode) {
  return problems.map((p) => {
    const pr = profiles.get ? profiles.get(p.id) : profiles[p.id];
    return { topic: p.topic, rank: Number(p.rank), fam: pr.methodFamily[0], mass: mode === "default" ? pr.defaultWeight : 1 };
  });
}

// 每一條 EXPOSURE_CAPS 在某個口徑下的實際份額
function capChecks(table, caps = taxonomy.EXPOSURE_CAPS) {
  const out = [];
  caps.forEach((cap) => {
    cap.ranks.forEach((rank) => {
      const cell = table[`${cap.topic}|${rank}`];
      if (!cell) return;
      let share;
      let what;
      if (cap.any) {
        share = cell.top ? cell.top.share : 0;
        what = cell.top ? cell.top.fam : "-";
        // 家族數 × 上限 < 1 的格子不可能達成（clampShares 也不會套）：照實回報為不可行
        if (cell.families * cap.max < 1) { out.push({ cap, rank, share, what, ok: false, infeasible: true }); return; }
      } else {
        share = cap.families.reduce((s, f) => s + (cell.shares[f] || 0), 0);
        what = cap.families.join("+");
      }
      out.push({ cap, rank, share, what, ok: share <= cap.max + 0.005 });
    });
  });
  return out;
}

function minFamilyChecks(table, rules = taxonomy.MIN_FAMILIES) {
  const out = [];
  rules.forEach((rule) => rule.ranks.forEach((rank) => {
    const cell = table[`${rule.topic}|${rank}`];
    const n = cell ? cell.families : 0;
    out.push({ rule, rank, families: n, ok: n >= rule.min });
  }));
  return out;
}

// 模板飽和：某個 noveltyFamily 在「課程核心」或「預設池（權重 > 0）」裡的題數
function templateSaturation(problems, profiles, limit = taxonomy.TEMPLATE_SATURATION_WARN) {
  const get = (id) => (profiles.get ? profiles.get(id) : profiles[id]);
  const count = (pred) => {
    const m = new Map();
    problems.forEach((p) => { const pr = get(p.id); if (pred(pr)) m.set(pr.noveltyFamily, (m.get(pr.noveltyFamily) || 0) + 1); });
    return [...m.entries()].filter(([, n]) => n > limit).sort((a, b) => b[1] - a[1]);
  };
  return {
    core: count((pr) => pr.learningRole.includes("course_core")),
    pool: count((pr) => pr.defaultWeight > 0)
  };
}

const pct = (x) => `${(100 * x).toFixed(1)}%`;

// 從上線的精簡側表（window.BuzzProblemProfiles）解回報表要的四欄 —— 報表量的是真的會出貨的那一份
function profilesFromRuntime(raw, sampler) {
  const T = sampler.table(raw);
  const out = new Map();
  T.rows.forEach((row, id) => {
    out.set(id, {
      methodFamily: row.fam,
      defaultWeight: row.w,
      noveltyFamily: row.nov,
      learningRole: T.roles.filter((_r, i) => row.roles & (1 << i)),
      prerequisiteGate: row.gates.map((g) => raw.lessons[g])
    });
  });
  return out;
}

module.exports = { TOPICS, tabulate, bankRows, capChecks, minFamilyChecks, templateSaturation, pct, profilesFromRuntime };
