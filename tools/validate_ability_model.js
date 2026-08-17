// 能力模型驗證器
//
// 能力數字會直接影響使用者相不相信這個產品。一旦「答 3 題全對就 100 分」
// 或「今天沒練反而變強」這種事發生一次，整個模型就沒人信了。
//
// 所以這裡不驗「跑得動」，而是驗那些一旦壞掉就會毀掉信任的性質：
//   1. 邊界    —— 樣本少不能給高分；沒資料要回 null 而不是 0
//   2. 單調性  —— 多答對不能變差、多答錯不能變好、不練不能變強
//   3. 診斷    —— 壓力垮 / 來不及 / 不會 要真的分得出來
//   4. 相容性  —— axes 的形狀必須和既有雷達一致
//   5. 效能    —— 首頁每次 render 都會叫它
//
// 用法：node tools/validate_ability_model.js

"use strict";

global.window = {};
require("./lib/load_problem_sources.js")();
require("../src/kernel/skill_tags.js");
const graph = require("../src/kernel/skill_graph.js");
const ability = require("../src/kernel/ability.js");

const problems = window.BUZZ_PROBLEMS || [];
const DAY = 86400000;
const NOW = Date.parse("2026-08-15T12:00:00.000Z");

const failures = [];
function check(name, condition, detail) {
  if (condition) return;
  failures.push(detail ? `${name} — ${detail}` : name);
}

/* ── fixture 產生器 ─────────────────────────────────────────────
   造出「某個技巧的 N 次作答」，用真實題庫裡的題目，
   這樣 skill graph 的對應與 rank / timeLimit 都是真的。 */

function problemsForSkill(skillId, count) {
  const pool = problems.filter((p) => graph.skillsForProblem(p).includes(skillId));
  if (pool.length < 1) throw new Error(`fixture 需要的技巧沒有題目：${skillId}`);
  const out = [];
  for (let i = 0; i < count; i += 1) out.push(pool[i % pool.length]);
  return out;
}

// opts: { correct, timed, elapsedRatio, assisted, hints, unanswered, daysAgo, spreadDays }
function makeRecords(skillId, count, opts) {
  const o = opts || {};
  const picked = problemsForSkill(skillId, count);
  const history = picked.map((problem, index) => {
    const daysAgo = (o.daysAgo || 0) + (o.spreadDays ? (index / count) * o.spreadDays : 0);
    const finishedAt = new Date(NOW - daysAgo * DAY).toISOString();
    const correct = typeof o.correct === "function" ? o.correct(index) : Boolean(o.correct);
    const unanswered = typeof o.unanswered === "function" ? o.unanswered(index) : Boolean(o.unanswered);
    const ratio = o.elapsedRatio == null ? 0.5 : o.elapsedRatio;
    return {
      id: `s-${skillId}-${index}`,
      mode: o.timed === false ? "practice" : "quick",
      practice: o.timed === false,
      finishedAt,
      answers: [
        {
          problemId: problem.id,
          correct: unanswered ? false : correct,
          unanswered,
          assisted: Boolean(o.assisted),
          hintsUsed: Number(o.hints || 0),
          elapsed: Math.round((problem.timeLimit || 60) * ratio),
          errorTag: o.errorTag || ""
        }
      ]
    };
  });
  return { history };
}

function mergeRecords() {
  const history = [];
  Array.prototype.forEach.call(arguments, (r) => history.push(...r.history));
  return { history };
}

const run = (records, now) => ability.profile(records, { now: now || NOW, problems, graph });
const SK = "integral.ibp";      // 題數多、tier 中段，適合當標準 fixture
const SK2 = "series.ratio";

/* ── 1. 邊界 ───────────────────────────────────────────────── */

const empty = run({});
check("空紀錄的 overall.mastery 應為 null", empty.overall.mastery === null, `實際 ${empty.overall.mastery}`);
check("空紀錄不應有任何技巧", Object.keys(empty.skills).length === 0);
check("空紀錄的雷達每軸都是 null", empty.axes.every((a) => a.score === null));
check("空紀錄的雷達仍要有 8 軸（形狀相容）", empty.axes.length === 8, `實際 ${empty.axes.length}`);
check("空紀錄的雷達每軸都有 key 與 label",
  empty.axes.every((a) => typeof a.key === "string" && typeof a.label === "string"));
check("空紀錄的雷達不得標成 stale（沒練過不等於太久沒練）",
  empty.axes.every((a) => a.stale === false));

// 「從沒測過」與「太久沒練」必須分得出來，否則老使用者回來會以為資料不見了
const longAgo = run(makeRecords(SK, 20, { correct: true, daysAgo: 120, spreadDays: 10 }));
check("120 天前的資料應衰減到 measured=false", longAgo.skills[SK].measured === false,
  `confidence ${longAgo.skills[SK].confidence}`);
check("練過但太久沒練必須標成 stale", longAgo.skills[SK].stale === true);
check("從沒練過的技巧根本不該出現在 skills 裡", Object.keys(run({}).skills).length === 0);
check("剛練完的技巧不得標成 stale",
  run(makeRecords(SK, 20, { correct: true })).skills[SK].stale === false);

const three = run(makeRecords(SK, 3, { correct: true }));
const threeM = three.skills[SK].mastery;
check("答 3 題全對不得給到 75 分以上（先驗要壓得住）", threeM !== null && threeM <= 75, `實際 ${threeM}`);
check("答 3 題全對時 measured 應為 false（樣本不足要顯示未測）",
  three.skills[SK].measured === false, `confidence ${three.skills[SK].confidence}`);

const forty = run(makeRecords(SK, 40, { correct: true, spreadDays: 20 }));
const fortyM = forty.skills[SK].mastery;
check("答 40 題全對應達 88 分以上", fortyM !== null && fortyM >= 88, `實際 ${fortyM}`);
check("答 40 題全對時 measured 應為 true", forty.skills[SK].measured === true);
check("精熟度不得超過 100", fortyM <= 100, `實際 ${fortyM}`);

const allWrong = run(makeRecords(SK, 20, { correct: false }));
check("全錯的精熟度應低於 25", allWrong.skills[SK].mastery < 25, `實際 ${allWrong.skills[SK].mastery}`);
check("精熟度不得為負", allWrong.skills[SK].mastery >= 0);
check("全錯的技巧不得出現在 dangerous（沒有信心資料就不該有結論）",
  !allWrong.dangerous.includes(SK));

const assisted = run(makeRecords(SK, 20, { correct: true, assisted: true }));
const clean = run(makeRecords(SK, 20, { correct: true }));
check("看過完整解答才對，分數必須低於乾淨答對",
  assisted.skills[SK].mastery < clean.skills[SK].mastery,
  `assisted ${assisted.skills[SK].mastery} vs clean ${clean.skills[SK].mastery}`);

const hinted = run(makeRecords(SK, 20, { correct: true, hints: 2 }));
check("用過提示答對，分數必須低於沒用提示",
  hinted.skills[SK].mastery < clean.skills[SK].mastery,
  `hinted ${hinted.skills[SK].mastery} vs clean ${clean.skills[SK].mastery}`);

/* ── 2. 單調性 ─────────────────────────────────────────────── */

const base = makeRecords(SK, 20, { correct: true, spreadDays: 10 });
const plusCorrect = mergeRecords(base, makeRecords(SK, 1, { correct: true }));
const plusWrong = mergeRecords(base, makeRecords(SK, 1, { correct: false }));
const baseM = run(base).skills[SK].mastery;
check("多答對一題，精熟度不得下降",
  run(plusCorrect).skills[SK].mastery >= baseM,
  `${baseM} -> ${run(plusCorrect).skills[SK].mastery}`);
check("多答錯一題，精熟度不得上升",
  run(plusWrong).skills[SK].mastery <= baseM,
  `${baseM} -> ${run(plusWrong).skills[SK].mastery}`);

// 時間單調性：不再作答時，精熟度隨時間單調不增
let previous = Infinity;
let monotone = true;
for (let d = 0; d <= 60; d += 5) {
  const value = run(base, NOW + d * DAY).skills[SK].mastery;
  if (value > previous + 1e-9) monotone = false;
  previous = value;
}
check("不作答時精熟度必須隨時間單調不增", monotone);
check("60 天不練後精熟度必須明顯衰退",
  run(base, NOW + 60 * DAY).skills[SK].mastery < baseM * 0.75,
  `${baseM} -> ${run(base, NOW + 60 * DAY).skills[SK].mastery}`);

// 難度單調性：同樣全對，難題應該給更高的權重（更快到達高分）
const easyPool = problems.filter((p) => graph.skillsForProblem(p).includes(SK) && p.rank <= 2);
const hardPool = problems.filter((p) => graph.skillsForProblem(p).includes(SK) && p.rank >= 5);
if (easyPool.length && hardPool.length) {
  const mk = (pool) => ({
    history: pool.slice(0, 1).map((problem, i) => ({
      id: `d-${i}`, mode: "quick", finishedAt: new Date(NOW - DAY).toISOString(),
      answers: Array.from({ length: 6 }, () => ({
        problemId: problem.id, correct: true, elapsed: 10, hintsUsed: 0
      }))
    }))
  });
  const easyM = run(mk(easyPool)).skills[SK].mastery;
  const hardM = run(mk(hardPool)).skills[SK].mastery;
  check("同樣全對，難題的精熟度增幅要比簡單題大", hardM > easyM, `easy ${easyM} vs hard ${hardM}`);
}

/* ── 3. 診斷 ───────────────────────────────────────────────── */

// 壓力垮：不限時幾乎全對，限時大量答錯
const pressure = run(mergeRecords(
  makeRecords(SK, 12, { correct: true, timed: false, spreadDays: 8 }),
  makeRecords(SK, 12, { correct: (i) => i % 3 === 0, timed: true, spreadDays: 8 })
));
const pEntry = pressure.skills[SK];
check("壓力垮的 fixture 要算得出 PA 與 UA",
  pEntry.pressureAccuracy !== null && pEntry.untimedAccuracy !== null,
  `PA ${pEntry.pressureAccuracy} UA ${pEntry.untimedAccuracy}`);
check("壓力垮的 fixture gap 必須大於門檻",
  pEntry.gap !== null && pEntry.gap > ability.constants.GAP_PRESSURE, `gap ${pEntry.gap}`);
check("壓力垮的 fixture 必須被診斷為 pressure",
  pEntry.diagnosis && pEntry.diagnosis.key === "pressure",
  `實際 ${pEntry.diagnosis && pEntry.diagnosis.key}`);
check("壓力垮的技巧要出現在 pressureGap 清單", pressure.pressureGap.includes(SK));

// 來不及：全部逾時未作答
const timeout = run(makeRecords(SK, 15, { unanswered: true, timed: true, spreadDays: 8 }));
check("全逾時的 timeoutRate 應為 1", timeout.skills[SK].timeoutRate === 1,
  `實際 ${timeout.skills[SK].timeoutRate}`);
check("全逾時應診斷為 timeout（不會 vs 來不及要分得出來）",
  timeout.skills[SK].diagnosis && timeout.skills[SK].diagnosis.key === "timeout",
  `實際 ${timeout.skills[SK].diagnosis && timeout.skills[SK].diagnosis.key}`);

// 樣本不足時不得給出 PA / UA
const fewSplit = run(makeRecords(SK, 4, { correct: true, timed: false }));
check("不限時樣本不足 8 題時 UA 必須為 null", fewSplit.skills[SK].untimedAccuracy === null);
check("沒有限時作答時 PA 必須為 null", fewSplit.skills[SK].pressureAccuracy === null);
check("PA 或 UA 缺一時 gap 必須為 null", fewSplit.skills[SK].gap === null);

// 象限
const fastAccurate = run(makeRecords(SK, 15, { correct: true, timed: true, elapsedRatio: 0.3 }));
check("快又準應落在反射區",
  fastAccurate.skills[SK].quadrant && fastAccurate.skills[SK].quadrant.key === "reflex",
  `實際 ${JSON.stringify(fastAccurate.skills[SK].quadrant)}`);
const slowAccurate = run(makeRecords(SK, 15, { correct: true, timed: true, elapsedRatio: 0.95 }));
check("慢但準應落在「會但慢」",
  slowAccurate.skills[SK].quadrant && slowAccurate.skills[SK].quadrant.key === "slow",
  `實際 ${JSON.stringify(slowAccurate.skills[SK].quadrant)}`);
const fastWrong = run(makeRecords(SK, 15, { correct: (i) => i % 4 === 0, timed: true, elapsedRatio: 0.2 }));
check("快但錯應落在「衝太快」",
  fastWrong.skills[SK].quadrant && fastWrong.skills[SK].quadrant.key === "rushed",
  `實際 ${JSON.stringify(fastWrong.skills[SK].quadrant)}`);

/* ── 4. 信心校準 ───────────────────────────────────────────── */

const confRecords = makeRecords(SK, 12, { correct: (i) => i % 4 === 0, timed: true, spreadDays: 6 });
confRecords.conf = {};
confRecords.history.forEach((session, index) => {
  confRecords.conf[session.answers[0].problemId] = {
    level: "sure",
    correct: index % 4 === 0,
    at: session.finishedAt
  };
});
const confProfile = run(confRecords);
check("有信心資料時 bias 不得為 null", confProfile.skills[SK].bias !== null);
check("標「確定」卻常錯，bias 必須為正（過度自信）",
  confProfile.skills[SK].bias > ability.constants.GAP_PRESSURE,
  `bias ${confProfile.skills[SK].bias}`);
check("沒有信心資料時 bias 必須為 null", clean.skills[SK].bias === null);
check("沒有信心資料時 dangerous 必須為空", clean.dangerous.length === 0);

/* ── 5. 趨勢與回放 ─────────────────────────────────────────── */

// 先爛後好：45-55 天前一路答錯，最近 10 天內大量答對。
// 早期那批要落在 30 天之前，d30 才有東西可以比。
const growing = mergeRecords(
  makeRecords(SK, 14, { correct: false, daysAgo: 45, spreadDays: 10 }),
  makeRecords(SK, 16, { correct: true, daysAgo: 2, spreadDays: 8 })
);
const growth = run(growing);
check("先爛後好的 fixture，d30 趨勢應為正",
  growth.trend.d30 !== null && growth.trend.d30 > 0, `d30 ${growth.trend.d30}`);
check("先爛後好的 fixture，d7 趨勢應為正",
  growth.trend.d7 !== null && growth.trend.d7 > 0, `d7 ${growth.trend.d7}`);
check("先爛後好的 fixture 應該找得出進步最快的技巧",
  growth.trend.fastestUp && growth.trend.fastestUp.delta > 0);
check("回放到第一次作答之前，不得看到任何未來的作答",
  run(growing, NOW - 70 * DAY).overall.mastery === null &&
    Object.keys(run(growing, NOW - 70 * DAY).skills).length === 0,
  "70 天前應該還沒有任何作答");

/* ── 6. 相容性與健全性 ─────────────────────────────────────── */

const real = run(mergeRecords(
  makeRecords(SK, 12, { correct: true, spreadDays: 10 }),
  makeRecords(SK2, 12, { correct: (i) => i % 2 === 0, spreadDays: 10 })
));
check("axes 必須是 8 軸且每軸有 key / label / score 欄位",
  real.axes.length === 8 && real.axes.every((a) => "key" in a && "label" in a && "score" in a));
check("axes 分數必須落在 0-100 或 null",
  real.axes.every((a) => a.score === null || (a.score >= 0 && a.score <= 100)));
check("weakest 應該排在最弱的技巧",
  real.weakest.length === 0 || real.skills[real.weakest[0]].mastery <=
    real.skills[real.weakest[real.weakest.length - 1]].mastery);
check("每個技巧都要帶得出 label", Object.values(real.skills).every((e) => e.label && e.label.length));
check("state 必須是四種之一",
  Object.values(real.skills).every((e) => e.state === null || ["weak", "shaky", "solid", "reflex"].includes(e.state)));

// 下架的題目不得讓模型爆掉
const ghost = { history: [{ id: "g", mode: "quick", finishedAt: new Date(NOW).toISOString(),
  answers: [{ problemId: "does-not-exist", correct: true, elapsed: 10 }] }] };
check("引用不存在題目的紀錄不得讓模型出錯", run(ghost).overall.mastery === null);

// 壞資料
const junk = { history: [{ id: "j", mode: "quick", finishedAt: "not-a-date", answers: null }, null] };
let junkOk = true;
try { run(junk); } catch (error) { junkOk = false; failures.push(`壞資料造成例外：${error.message}`); }
check("壞掉的 history 不得讓模型丟例外", junkOk);

/* ── 7. 效能 ───────────────────────────────────────────────── */

const bigHistory = [];
for (let i = 0; i < 300; i += 1) {
  const picked = problems.slice((i * 17) % problems.length, ((i * 17) % problems.length) + 17);
  bigHistory.push({
    id: `big-${i}`,
    mode: i % 5 === 0 ? "practice" : "quick",
    practice: i % 5 === 0,
    finishedAt: new Date(NOW - (i / 4) * DAY).toISOString(),
    answers: picked.map((problem, j) => ({
      problemId: problem.id, correct: (i + j) % 3 !== 0,
      elapsed: Math.round((problem.timeLimit || 60) * 0.6), hintsUsed: 0
    }))
  });
}
const bigRecords = { history: bigHistory };
const answersCount = bigHistory.reduce((sum, session) => sum + session.answers.length, 0);
const started = process.hrtime.bigint();
const bigProfile = run(bigRecords);
const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
check(`${answersCount} 筆作答的 profile() 應在 100ms 內完成`, elapsedMs < 100, `實際 ${elapsedMs.toFixed(1)}ms`);
check("大量資料下必須測出多個技巧", bigProfile.coverage.skillsMeasured > 20,
  `實際 ${bigProfile.coverage.skillsMeasured}`);

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("Ability model");
console.log(`  fixture 技巧    ${SK} / ${SK2}`);
console.log(`  效能            ${answersCount} 筆作答 -> ${elapsedMs.toFixed(1)}ms`);
console.log(`  大樣本覆蓋      ${bigProfile.coverage.skillsMeasured} 個技巧測得出來，共 ${bigProfile.coverage.skillsTouched} 個被碰過`);
console.log(`  總體精熟度      ${bigProfile.overall.mastery}`);

if (failures.length) {
  console.error("");
  console.error(`能力模型驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("ability model OK");
