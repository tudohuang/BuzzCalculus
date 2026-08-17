// Planner / Session 驗證器
//
// 首頁只有一個主 CTA。那顆按鈕永遠要有內容、永遠要說得出為什麼、
// 而且按下去一定要拿到講好的題數 —— 這三件事任何一件破了，
// 使用者就會退回自己選題，推薦系統等於不存在。
//
// 驗的是：
//   1. 永遠給得出配方  —— 零紀錄、只練一次、只練過一個主題都要有東西可按
//   2. why 永遠非空    —— 而且不能出現 undefined / null / NaN
//   3. 一定抽滿        —— 抽不滿要降級，降級要被記錄
//   4. 可重現          —— 同樣的種子抽出同一組題
//   5. 配方真的對應能力 —— 弱點技巧真的是最弱的、到期複習真的到期
//   6. 考試倒推        —— 做不完時必須誠實說做不完
//
// 用法：node tools/validate_planner.js

"use strict";

global.window = {};
require("./lib/load_problem_sources.js")();
const store = require("../src/kernel/records_v2.js");
global.window.BuzzRecords = store;
require("../src/kernel/skill_tags.js");
const graph = require("../src/kernel/skill_graph.js");
global.window.BuzzSkillGraph = graph;
const ability = require("../src/kernel/ability.js");
global.window.BuzzAbility = ability;
const planner = require("../src/kernel/planner.js");
const session = require("../src/kernel/session.js");

const problems = window.BUZZ_PROBLEMS || [];
const calculus = problems.filter((p) => !["physics", "chemistry"].includes(p.topic));
const DAY = 86400000;
const NOW = Date.parse("2026-08-15T12:00:00.000Z");

const failures = [];
function check(name, condition, detail) {
  if (condition) return;
  failures.push(detail ? `${name} — ${detail}` : name);
}

const ctx = { now: NOW, problems, graph, BuzzSkillGraph: graph, BuzzAbility: ability };

/* ── fixture ────────────────────────────────────────────────── */

function historyFor(pool, sessionCount, perSession, correctFn, daysAgoBase) {
  const history = [];
  for (let s = 0; s < sessionCount; s += 1) {
    const picks = [];
    for (let j = 0; j < perSession; j += 1) picks.push(pool[(s * perSession + j) % pool.length]);
    history.push({
      id: `p-${daysAgoBase}-${s}`,
      mode: "quick",
      finishedAt: new Date(NOW - ((daysAgoBase || 0) + (sessionCount - s) * 0.5) * DAY).toISOString(),
      answers: picks.map((problem, j) => ({
        problemId: problem.id,
        correct: correctFn(s, j),
        elapsed: Math.round((problem.timeLimit || 60) * 0.6),
        hintsUsed: 0
      }))
    });
  }
  return history;
}

const poolFor = (skillId) => problems.filter((p) => graph.skillsForProblem(p).includes(skillId));

/* ── 1. 永遠給得出配方 ─────────────────────────────────────── */

const scenarios = {
  "零紀錄的新使用者": {},
  "只練過一場": { history: historyFor(poolFor("integral.ibp"), 1, 10, () => true, 0) },
  "只練過極限": { history: historyFor(poolFor("limit.trig"), 6, 10, (s, j) => (s + j) % 3 !== 0, 0) },
  "全對的強者": { history: historyFor(calculus, 20, 12, () => true, 0) },
  "全錯的新手": { history: historyFor(calculus, 20, 12, () => false, 0) },
  "很久沒練": { history: historyFor(calculus, 10, 12, () => true, 120) },
  "壞掉的紀錄": { history: [null, { finishedAt: "nope" }, { answers: null }] }
};

Object.keys(scenarios).forEach((name) => {
  const records = scenarios[name];
  Object.keys(planner.LENGTHS).forEach((lengthKey) => {
    let plan;
    try {
      plan = planner.recipe(records, lengthKey, ctx);
    } catch (error) {
      failures.push(`${name} / ${lengthKey} 產生配方時丟例外：${error.message}`);
      return;
    }
    check(`${name} / ${lengthKey} 的 slot 題數總和要等於配方題數`,
      plan.slots.reduce((n, s) => n + s.count, 0) === plan.count,
      `${plan.slots.reduce((n, s) => n + s.count, 0)} vs ${plan.count}`);
    check(`${name} / ${lengthKey} 的配方題數要落在合理範圍`,
      plan.count >= 4 && plan.count <= 40, `${plan.count}`);
    check(`${name} / ${lengthKey} 的 why 不得為空`, Boolean(plan.why && plan.why.trim()));
    check(`${name} / ${lengthKey} 的 why 不得出現 undefined / null / NaN`,
      !/undefined|null|NaN|\[object/.test(plan.why), plan.why);
    // why 不能寫死題數：fill 之後題數還會為了守時間預算而變，寫死就會對不起來
    check(`${name} / ${lengthKey} 的 why 不得寫死題數`, !/\d+\s*題(?!錯)/.test(plan.why), plan.why);
    check(`${name} / ${lengthKey} 的估時要是正數`, plan.estSeconds > 0, `${plan.estSeconds}`);
    check(`${name} / ${lengthKey} 每個 slot 的題數要為正`, plan.slots.every((s) => s.count > 0));
  });

  let recommendation;
  try {
    recommendation = planner.today(records, ctx);
  } catch (error) {
    failures.push(`${name} 的 today() 丟例外：${error.message}`);
    return;
  }
  check(`${name} 的 today() 要給得出推薦`, Boolean(recommendation && recommendation.recipe));
  check(`${name} 的 today() 理由不得為空`, Boolean(recommendation.reason && recommendation.reason.trim()));
  check(`${name} 的 today() 只能推薦一種長度`, typeof recommendation.length === "string");
});

/* ── 2. 一定抽滿 ───────────────────────────────────────────── */

Object.keys(scenarios).forEach((name) => {
  const records = scenarios[name];
  Object.keys(planner.LENGTHS).forEach((lengthKey) => {
    const plan = planner.recipe(records, lengthKey, ctx);
    const filled = session.fill(plan, { problems: calculus, graph, seed: `${name}-${lengthKey}` });
    check(`${name} / ${lengthKey} 不得短少（抽滿或為守時間預算而調整）`,
      filled.meta.complete,
      `要 ${plan.count} 實得 ${filled.problems.length}，短少 ${filled.meta.shortfall}`);
    const ids = filled.problems.map((p) => p.id);
    check(`${name} / ${lengthKey} 抽出來的題不得重複`, ids.length === new Set(ids).size);
    check(`${name} / ${lengthKey} 抽出來的必須都是真題`,
      filled.problems.every((p) => p && p.id && p.prompt));

    // 承諾的時間必須是真的。標榜 5 分鐘卻要做 11 分鐘，比不標時間更傷。
    const target = plan.targetMinutes * 60;
    const actual = filled.estSeconds;
    check(`${name} / ${lengthKey} 實際估時要落在承諾的 ±40% 內`,
      actual >= target * 0.6 && actual <= target * 1.4,
      `承諾 ${plan.targetMinutes} 分鐘，實際 ${(actual / 60).toFixed(1)} 分鐘`);
  });
});

// 題庫被縮到極小時仍要抽滿，並且要老實記錄降級
const tiny = calculus.filter((p) => p.rank === 1).slice(0, 15);
const tinyPlan = planner.recipe(scenarios["只練過極限"], "daily15", ctx);
const tinyFill = session.fill(tinyPlan, { problems: tiny, graph, seed: "tiny" });
check("題庫極小時仍要抽滿", tinyFill.problems.length === tinyPlan.count,
  `實際 ${tinyFill.problems.length}`);
check("降級必須被記錄下來", tinyFill.meta.fallbacks.length > 0);
check("降級要能翻成一句人話", Boolean(session.explainFallbacks(tinyFill.meta)));
check("降級說明不得出現 undefined",
  !/undefined/.test(session.explainFallbacks(tinyFill.meta)), session.explainFallbacks(tinyFill.meta));

// 題庫小於目標題數時，能給多少是多少，但不得重複塞同一題
const starved = calculus.slice(0, 5);
const starvedFill = session.fill(tinyPlan, { problems: starved, graph, seed: "starved" });
check("題庫少於目標題數時不得重複塞題",
  starvedFill.problems.length === new Set(starvedFill.problems.map((p) => p.id)).size);
check("題庫不足時 complete 必須為 false", starvedFill.meta.complete === false);
check("題庫不足時要記錄短少數", starvedFill.meta.shortfall > 0);

/* ── 3. 可重現 ─────────────────────────────────────────────── */

const planA = planner.recipe(scenarios["全對的強者"], "daily15", ctx);
const one = session.fill(planA, { problems: calculus, graph, seed: "same" });
const two = session.fill(planA, { problems: calculus, graph, seed: "same" });
const other = session.fill(planA, { problems: calculus, graph, seed: "different" });
check("同樣的種子必須抽出同一組題",
  JSON.stringify(one.problems.map((p) => p.id)) === JSON.stringify(two.problems.map((p) => p.id)));
check("不同種子應該抽出不同組題",
  JSON.stringify(one.problems.map((p) => p.id)) !== JSON.stringify(other.problems.map((p) => p.id)));

/* ── 4. 配方真的對應能力 ───────────────────────────────────── */

// 造一個「Frullani 很爛、IBP 很強」的使用者，弱點 slot 必須指向 Frullani
const frullani = poolFor("integral.frullani");
const ibp = poolFor("integral.ibp");
const mixedRecords = {
  history: [
    ...historyFor(frullani, 10, 6, () => false, 0),
    ...historyFor(ibp, 10, 6, () => true, 0)
  ]
};
const mixedPlan = planner.recipe(mixedRecords, "daily15", ctx);
const weakSlot = mixedPlan.slots.find((s) => s.role === "weak");
check("弱點 slot 必須存在", Boolean(weakSlot));
check("弱點 slot 必須指向真的很弱的技巧",
  weakSlot && (weakSlot.filter.skills || []).includes("integral.frullani"),
  `實際 ${weakSlot && JSON.stringify(weakSlot.filter.skills)}`);
check("弱點 slot 不得把很強的技巧當弱點",
  weakSlot && !(weakSlot.filter.skills || []).includes("integral.ibp"));

const mixedFill = session.fill(mixedPlan, { problems: calculus, graph, seed: "mixed" });
const weakPicked = mixedFill.problems.filter((problem, i) => mixedFill.roles[i] === "weak");
check("弱點 slot 抽出來的題必須真的屬於那些弱點技巧",
  weakPicked.length > 0 &&
    weakPicked.every((problem) =>
      graph.skillsForProblem(problem).some((id) => (weakSlot.filter.skills || []).includes(id))),
  `${weakPicked.length} 題`);

// 到期複習：造 6 題已到期的錯題，review slot 必須抽到它們
const dueIds = calculus.slice(200, 206).map((p) => p.id);
const dueRecords = {
  history: historyFor(calculus, 10, 12, (s, j) => (s + j) % 3 !== 0, 0),
  mistakes: {}
};
dueIds.forEach((id) => {
  dueRecords.mistakes[id] = {
    problemId: id, wrongCount: 3,
    lastWrongAt: new Date(NOW - 5 * DAY).toISOString(),
    srs: { interval: 1, dueAt: NOW - DAY }
  };
});
const duePlan = planner.recipe(dueRecords, "daily15", ctx);
const reviewSlot = duePlan.slots.find((s) => s.role === "review");
check("到期複習 slot 必須指向到期的錯題",
  reviewSlot && dueIds.every((id) => (reviewSlot.filter.problemIds || []).includes(id)));
check("到期複習的題數應該反映在 context", duePlan.context.dueNow === dueIds.length,
  `實際 ${duePlan.context.dueNow}`);
const dueFill = session.fill(duePlan, { problems: calculus, graph, seed: "due" });
const reviewPicked = dueFill.problems.filter((p, i) => dueFill.roles[i] === "review");
check("review slot 抽出來的必須是到期的那幾題",
  reviewPicked.length > 0 && reviewPicked.every((p) => dueIds.includes(p.id)),
  `${reviewPicked.map((p) => p.id).join(",")}`);

// 未到期的錯題不能被當成「今天到期」
const notDue = { mistakes: {} };
calculus.slice(300, 304).forEach((p) => {
  notDue.mistakes[p.id] = { problemId: p.id, wrongCount: 1, srs: { interval: 7, dueAt: NOW + 5 * DAY } };
});
check("未到期的錯題不得被算成今天到期",
  planner.recipe(notDue, "daily15", ctx).context.dueNow === 0);

// 難度上限要被遵守
const capped = { history: historyFor(calculus, 10, 12, () => true, 0), settings: { difficultyCap: 2 } };
const cappedPlan = planner.recipe(capped, "daily15", ctx);
const cappedWeak = cappedPlan.slots.find((s) => s.role === "weak");
check("難度上限要傳進弱點 slot", cappedWeak && cappedWeak.filter.maxRank === 2,
  `實際 ${cappedWeak && cappedWeak.filter.maxRank}`);

/* ── 5. 有效訓練的定義 ─────────────────────────────────────── */

check("到期夠多又有弱點時，daily15 應被判定為有效訓練",
  planner.isEffective(planner.recipe(mergeMistakes(mixedRecords, dueIds), "daily15", ctx)),
  "isEffective 回 false");
check("零紀錄時不該被判定為有效訓練（沒東西可複習）",
  planner.isEffective(planner.recipe({}, "daily15", ctx)) === false);

function mergeMistakes(records, ids) {
  const next = JSON.parse(JSON.stringify(records));
  next.mistakes = {};
  ids.forEach((id) => {
    next.mistakes[id] = { problemId: id, wrongCount: 2, srs: { interval: 1, dueAt: NOW - DAY } };
  });
  return next;
}

/* ── 6. 考試倒推 ───────────────────────────────────────────── */

const examRecords = {
  history: historyFor(calculus, 15, 12, (s, j) => (s + j) % 4 !== 0, 0),
  plan: { examAt: new Date(NOW + 30 * DAY).toISOString(), label: "微積分期中", dailyMinutes: 15 }
};
const examPlan = planner.examPlan(examRecords, ability.profile(examRecords, ctx), NOW);
check("設了考試日期就要算得出倒推計畫", Boolean(examPlan));
check("倒推要算出剩幾天", examPlan.daysLeft === 30, `實際 ${examPlan.daysLeft}`);
check("倒推要列出還沒到目標的技巧", examPlan.gaps.length > 0);
check("T-30 不該進衝刺模式", examPlan.sprint === false);
check("做不完時要算得出建議分鐘數", examPlan.neededMinutes > 0);
check("做不完時要算得出顧得到幾個技巧",
  examPlan.coverableSkills >= 0 && examPlan.coverableSkills <= examPlan.totalSkills);

const sprintRecords = JSON.parse(JSON.stringify(examRecords));
sprintRecords.plan.examAt = new Date(NOW + 5 * DAY).toISOString();
const sprintPlan = planner.recipe(sprintRecords, "daily15", ctx);
check("考前 7 天內必須切換到衝刺模式", sprintPlan.sprint === true);
check("衝刺模式必須停止引入新技巧",
  !sprintPlan.slots.some((s) => s.role === "new"),
  `slots: ${sprintPlan.slots.map((s) => s.role).join(",")}`);
check("衝刺模式的 why 要提到考試", /剩 \d+ 天/.test(sprintPlan.why), sprintPlan.why);
check("衝刺模式仍要抽滿",
  session.fill(sprintPlan, { problems: calculus, graph, seed: "sprint" }).problems.length === sprintPlan.count);

const scopedRecords = JSON.parse(JSON.stringify(sprintRecords));
scopedRecords.plan.scope = ["integral.*"];
const scopedPlan = planner.recipe(scopedRecords, "daily15", ctx);
const scopedWeak = scopedPlan.slots.find((s) => s.role === "weak");
check("設了 scope 時，弱點應該限制在 scope 內",
  !scopedWeak || !(scopedWeak.filter.skills || []).length ||
    (scopedWeak.filter.skills || []).some((id) => id.startsWith("integral.")),
  `實際 ${scopedWeak && JSON.stringify(scopedWeak.filter.skills)}`);

/* ── 7. 排除與冷卻 ─────────────────────────────────────────── */

const excludePlan = planner.recipe(scenarios["全對的強者"], "daily15", ctx);
const excluded = new Set(calculus.slice(0, 400).map((p) => p.id));
const excludeFill = session.fill(excludePlan, {
  problems: calculus, graph, seed: "exclude", exclude: [...excluded]
});
check("被排除的題絕對不能出現",
  excludeFill.problems.every((p) => !excluded.has(p.id)));
check("排除之後仍要抽滿", excludeFill.problems.length === excludePlan.count);

const recentIds = calculus.slice(0, 60).map((p) => p.id);
const recentFill = session.fill(excludePlan, {
  problems: calculus, graph, seed: "recent", recent: recentIds
});
const recentHits = recentFill.problems.filter((p) => recentIds.includes(p.id)).length;
check("最近做過的題應該被排到後面（不是硬排除）", recentHits <= 3, `實際命中 ${recentHits} 題`);

/* ── 8. 效能 ───────────────────────────────────────────────── */

const perfRecords = { history: historyFor(calculus, 40, 12, (s, j) => (s + j) % 3 !== 0, 0) };
const t0 = process.hrtime.bigint();
const perfPlan = planner.today(perfRecords, ctx);
session.fill(perfPlan.recipe, { problems: calculus, graph, seed: "perf" });
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
check("today() + fill() 應在 200ms 內完成", ms < 200, `實際 ${ms.toFixed(1)}ms`);

/* ── 報告 ─────────────────────────────────────────────────── */

const demo = planner.today(mergeMistakes(mixedRecords, dueIds), ctx);
const demoFill = session.fill(demo.recipe, { problems: calculus, graph, seed: "demo" });

console.log("Planner / Session");
console.log(`  情境覆蓋      ${Object.keys(scenarios).length} 種使用者 × ${Object.keys(planner.LENGTHS).length} 種長度`);
console.log(`  效能          today() + fill() ${ms.toFixed(1)}ms`);
console.log("");
console.log(`  範例推薦      ${demo.recipe.label}（${demo.reason}）`);
console.log(`  why           ${demo.recipe.why}`);
console.log(`  配方          ${demo.recipe.slots.map((s) => `${s.label} ${s.count}`).join(" / ")}`);
console.log(`  實際抽到      ${demoFill.problems.length} 題，估時 ${Math.round(demoFill.estSeconds / 60)} 分鐘`);
if (demoFill.meta.fallbacks.length) console.log(`  降級          ${session.explainFallbacks(demoFill.meta)}`);

if (failures.length) {
  console.error("");
  console.error(`planner 驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("planner OK");
