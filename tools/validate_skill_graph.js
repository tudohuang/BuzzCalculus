// Skill graph 驗證器
//
// 擋住四類會讓能力模型算出垃圾數字的問題：
//   1. 覆蓋率：有題目一個 skill 都對不到 → 那題永遠不會進弱點分析
//   2. 樣本量：某個 skill 的題數太少 → 精熟度統計沒有意義
//   3. 圖結構：prereq 有環或 tier 反向 → planner 會推薦錯的學習順序
//   4. 遺漏：技巧 tag 沒被任何 skill 認領 → 靜默漏掉一整種技巧
//
// 用法：node tools/validate_skill_graph.js

"use strict";

global.window = {};
require("./lib/load_problem_sources.js")();
require("../src/kernel/skill_tags.js");   // 補標表：早期題目的 skill 對應
const graph = require("../src/kernel/skill_graph.js");

const MIN_PROBLEMS = 8;      // 每個 skill 的最低題數
const MAX_ORPHAN_RATE = 0.02; // 允許的無 skill 題目比例

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const problems = window.BUZZ_PROBLEMS || [];
const skills = graph.skills;

/* ── 1. 節點自身的完整性 ───────────────────────────────────── */
const seenId = new Set();
const seenTagOwner = new Map();
skills.forEach((skill) => {
  if (seenId.has(skill.id)) fail(`skill id 重複：${skill.id}`);
  seenId.add(skill.id);

  if (!/^[a-z]+(\.[a-z]+)+$/.test(skill.id)) {
    fail(`skill id 命名不合規（要 domain.family[.skill] 全小寫）：${skill.id}`);
  }
  if (!skill.label) fail(`${skill.id} 缺 label`);
  if (!skill.family) fail(`${skill.id} 缺 family`);
  if (!Number.isInteger(skill.tier) || skill.tier < 1 || skill.tier > 5) {
    fail(`${skill.id} 的 tier 必須是 1-5，實際：${skill.tier}`);
  }
  if (!Array.isArray(skill.tags) || !skill.tags.length) {
    fail(`${skill.id} 沒有對應任何 tag`);
  }
  (skill.tags || []).forEach((tag) => {
    if (graph.nonSkillTags.has(tag)) {
      fail(`${skill.id} 用了被標為「非技巧」的 tag：${tag}`);
    }
    // 同一個 tag 被多個 skill 認領是允許的，但必須靠 topics 分流，
    // 否則一題會同時算進兩個技巧，精熟度會被灌水。
    const prev = seenTagOwner.get(tag);
    if (prev && !prev.topics && !skill.topics) {
      fail(`tag "${tag}" 同時屬於 ${prev.id} 與 ${skill.id}，且兩者都沒有 topics 分流`);
    }
    if (!prev) seenTagOwner.set(tag, skill);
  });
});

/* ── 2. prereq 圖結構 ──────────────────────────────────────── */
skills.forEach((skill) => {
  (skill.prereq || []).forEach((parentId) => {
    const parent = graph.byId(parentId);
    if (!parent) {
      fail(`${skill.id} 的 prereq 指向不存在的節點：${parentId}`);
      return;
    }
    if (parent.tier >= skill.tier) {
      fail(`${skill.id}(tier ${skill.tier}) 的 prereq ${parentId}(tier ${parent.tier}) tier 沒有更小`);
    }
  });
});

// 環偵測（DFS 三色標記）
const WHITE = 0;
const GREY = 1;
const BLACK = 2;
const color = new Map(skills.map((s) => [s.id, WHITE]));
function visit(id, stack) {
  const state = color.get(id);
  if (state === GREY) {
    fail(`prereq 出現環：${stack.slice(stack.indexOf(id)).concat(id).join(" -> ")}`);
    return;
  }
  if (state === BLACK) return;
  color.set(id, GREY);
  const skill = graph.byId(id);
  (skill.prereq || []).forEach((parent) => {
    if (graph.byId(parent)) visit(parent, stack.concat(id));
  });
  color.set(id, BLACK);
}
skills.forEach((s) => visit(s.id, []));

/* ── 3. 覆蓋率與樣本量 ─────────────────────────────────────── */
const perSkill = new Map(skills.map((s) => [s.id, 0]));
const orphans = [];
problems.forEach((problem) => {
  const hits = graph.skillsForProblem(problem);
  if (!hits.length) {
    orphans.push(problem);
    return;
  }
  hits.forEach((id) => perSkill.set(id, perSkill.get(id) + 1));
});

const thin = [];
perSkill.forEach((count, id) => {
  if (count === 0) fail(`${id} 沒有對應到任何題目 —— 這個節點是死的`);
  else if (count < MIN_PROBLEMS) thin.push({ id, count });
});
thin.sort((a, b) => a.count - b.count);
thin.forEach(({ id, count }) => {
  fail(`${id} 只有 ${count} 題（低於 ${MIN_PROBLEMS}），統計沒有意義 —— 併入上層或補題`);
});

const orphanRate = orphans.length / problems.length;
if (orphanRate > MAX_ORPHAN_RATE) {
  fail(
    `${orphans.length}/${problems.length} 題（${(orphanRate * 100).toFixed(1)}%）對不到任何 skill，` +
      `超過上限 ${(MAX_ORPHAN_RATE * 100).toFixed(0)}%`
  );
  const sample = orphans.slice(0, 12).map((p) => `${p.id}[${(p.tags || []).filter(graph.isSkillTag).join(",") || "無技巧tag"}]`);
  sample.forEach((line) => fail(`  無 skill 題目範例：${line}`));
} else if (orphans.length) {
  warn(`${orphans.length} 題對不到 skill（${(orphanRate * 100).toFixed(1)}%，在容許範圍內）`);
}

/* ── 4. 沒被認領的技巧 tag ─────────────────────────────────── */
const allTags = new Set();
problems.forEach((p) => (p.tags || []).forEach((t) => allTags.add(t)));
const claimed = new Set();
skills.forEach((s) => s.tags.forEach((t) => claimed.add(t)));

const unclaimed = [...allTags].filter((t) => graph.isSkillTag(t) && !claimed.has(t)).sort();
if (unclaimed.length) {
  fail(`${unclaimed.length} 個技巧 tag 沒有被任何 skill 認領（要嘛歸進某個 skill，要嘛列進 NON_SKILL_TAGS）：`);
  fail(`  ${unclaimed.join(", ")}`);
}

// 反向：skill 宣告了題庫裡根本不存在的 tag（多半是打錯字）
const ghost = [];
skills.forEach((s) => s.tags.forEach((t) => { if (!allTags.has(t)) ghost.push(`${s.id} -> ${t}`); }));
if (ghost.length) fail(`skill 宣告了題庫裡不存在的 tag（打錯字？）：${ghost.join(", ")}`);

/* ── 5. 既有雷達 8 軸的輸入必須全被涵蓋 ────────────────────── */
// app.js 的 RADAR_AXES 靠 tag 直接比對。skill graph 收斂後，
// 那些 tag 仍必須存在於某個 skill，否則雷達會出現空洞。
const RADAR_TAGS = [
  "taylor", "coefficient", "nested-taylor", "composite-taylor", "asymptotic-expansion",
  "substitution", "trig-substitution", "change-of-variables", "polar-coordinates",
  "integration-by-parts", "ibp", "multi-ibp", "partial-fraction",
  "improper-integral", "frullani", "ode-style", "kings-property", "parameter-integral",
  "laplace-transform", "convolution",
  "ratio-test", "root-test", "integral-test", "p-series", "alternating-series",
  "comparison", "limit-comparison", "power-series", "radius", "endpoint-analysis",
  "convergence-test", "special-sum",
  "multivariable", "double-integral", "triple-integral", "hessian", "jacobian",
  "jacobian-chain", "lagrange-multiplier", "nabla", "vector-calculus",
  "total-differential", "total-differential-min", "line-integral", "surface-integral",
  "green-theorem", "stokes-theorem", "divergence-theorem", "flux", "conservative-field",
  "directional-derivative",
  "beta-function", "gamma-function", "wallis", "bessel", "special-function"
];
const radarMissing = RADAR_TAGS.filter((t) => allTags.has(t) && graph.isSkillTag(t) && !claimed.has(t));
if (radarMissing.length) {
  fail(`既有雷達用到的 tag 沒被 skill 認領，雷達會出現空洞：${radarMissing.join(", ")}`);
}

/* ── 報告 ─────────────────────────────────────────────────── */
const covered = problems.length - orphans.length;
console.log("Skill graph");
console.log(`  節點        ${skills.length} 個（${graph.families().length} 個 family）`);
console.log(`  題目覆蓋    ${covered}/${problems.length}（${((covered / problems.length) * 100).toFixed(1)}%）`);
console.log(`  技巧 tag    ${claimed.size} 個已認領 / ${[...allTags].filter(graph.isSkillTag).length} 個技巧 tag`);
const counts = [...perSkill.values()].sort((a, b) => a - b);
if (counts.length) {
  console.log(`  每節點題數  最少 ${counts[0]} / 中位 ${counts[Math.floor(counts.length / 2)]} / 最多 ${counts[counts.length - 1]}`);
}

if (warnings.length) {
  console.log("");
  warnings.forEach((w) => console.log(`  warn: ${w}`));
}

if (errors.length) {
  console.error("");
  console.error(`skill graph 驗證失敗（${errors.length}）：`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

console.log("");
console.log("skill graph OK");
