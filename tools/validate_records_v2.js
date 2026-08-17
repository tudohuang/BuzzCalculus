// Records v2 驗證器
//
// 這一層動的是使用者唯一的資產：他們的練習紀錄。任何一個 bug 的後果都是
// 「我幾個月的紀錄不見了」，而那種使用者不會回來。
//
// 所以這裡驗的是：
//   1. 遷移不丟東西  —— v1 的每個欄位都要原封不動留著
//   2. 編碼可逆      —— flags 位元打包後要能完整還原
//   3. 冪等          —— normalize 跑幾次結果都一樣
//   4. 去重          —— 遷移當下正在存的那一場不能被算兩次
//   5. 一致          —— 從 history 和從 attemptLog 算出的能力必須完全相同
//   6. 容量          —— 上限內的體積要在 localStorage 額度內
//
// 用法：node tools/validate_records_v2.js

"use strict";

global.window = {};
require("./lib/load_problem_sources.js")();
require("../src/kernel/skill_tags.js");
const graph = require("../src/kernel/skill_graph.js");
const store = require("../src/kernel/records_v2.js");
global.window.BuzzRecords = store;
const ability = require("../src/kernel/ability.js");

const problems = window.BUZZ_PROBLEMS || [];
const DAY = 86400000;
const NOW = Date.parse("2026-08-15T12:00:00.000Z");

const failures = [];
function check(name, condition, detail) {
  if (condition) return;
  failures.push(detail ? `${name} — ${detail}` : name);
}

/* ── fixture ────────────────────────────────────────────────── */

function makeHistory(sessionCount, perSession) {
  const pool = problems.filter((p) => graph.skillsForProblem(p).length);
  const history = [];
  for (let s = 0; s < sessionCount; s += 1) {
    const picks = [];
    for (let j = 0; j < perSession; j += 1) picks.push(pool[(s * perSession + j) % pool.length]);
    history.push({
      id: `sess-${s}`,
      mode: s % 5 === 0 ? "practice" : "quick",
      practice: s % 5 === 0,
      score: 60 + (s % 40),
      finishedAt: new Date(NOW - (sessionCount - s) * 0.5 * DAY).toISOString(),
      answers: picks.map((problem, j) => ({
        problemId: problem.id,
        correct: (s + j) % 10 > 2,
        unanswered: (s + j) % 17 === 0,
        assisted: (s + j) % 23 === 0,
        hintsUsed: (s + j) % 7 === 0 ? 2 : 0,
        elapsed: Math.round((problem.timeLimit || 60) * 0.6),
        errorTag: (s + j) % 10 <= 2 ? ["粗心", "不會", "忘公式"][(s + j) % 3] : ""
      }))
    });
  }
  return history;
}

/* ── 1. 遷移不丟東西 ────────────────────────────────────────── */

const v1 = {
  attempts: 12, practiceRuns: 3, bestScore: 900, bestStreak: 7,
  totalAnswered: 300, totalCorrect: 210,
  mistakes: { "lim-001": { problemId: "lim-001", wrongCount: 2 } },
  achievements: { first: true }, topicStats: { limits: { n: 10 } },
  problemStats: { "lim-001": { n: 3 } }, daily: { "2026-08-01": { score: 80 } },
  dailyOne: { "2026-08-02": { correct: true } }, pathUnlocks: { usub: true },
  pathGateAttempts: {}, pathLessonRuns: {}, proofs: { p1: "understood" },
  favorites: { "int-001": true }, problemReports: {}, streakShields: {},
  namedExams: { midterm: { score: 70 } },
  placement: { rank: 3, date: "2026-07-01", weakTag: "series" },
  settings: { difficultyCap: 4 }, rival: { level: 5, wins: 3, losses: 1 },
  weeklyChallenge: {}, onboardingLevel: "standard", onboardingSeen: true,
  updatedAt: "2026-08-10T00:00:00.000Z", lastPlayed: "2026-08-10T00:00:00.000Z",
  history: makeHistory(20, 10)
};

const v1Snapshot = JSON.parse(JSON.stringify(v1));
const migrated = store.normalize(JSON.parse(JSON.stringify(v1)));

Object.keys(v1Snapshot).forEach((key) => {
  const same = JSON.stringify(v1Snapshot[key]) === JSON.stringify(migrated[key]);
  check(`遷移不得動到 v1 的 ${key}`, same);
});
check("遷移後 schema 應為 2", migrated.schema === 2, `實際 ${migrated.schema}`);
check("遷移應從 history 回填 attemptLog（老使用者不能看到空白趨勢）",
  migrated.attemptLog.length === 200, `實際 ${migrated.attemptLog.length}`);
check("遷移應產生 session 摘要", migrated.sessions.length === 20, `實際 ${migrated.sessions.length}`);
check("attemptLog 必須按時間遞增排序",
  migrated.attemptLog.every((row, i) => i === 0 || row[1] >= migrated.attemptLog[i - 1][1]));

/* ── 2. 編碼可逆 ────────────────────────────────────────────── */

let flagRoundtrip = true;
[true, false].forEach((unanswered) => {
  [true, false].forEach((assisted) => {
    [true, false].forEach((timed) => {
      [0, 1, 3, 7].forEach((hints) => {
        ["", "粗心", "不會", "忘公式"].forEach((errorTag) => {
          const flags = store.encodeFlags({ unanswered, assisted, hintsUsed: hints, errorTag }, timed);
          const back = store.decodeFlags(flags);
          const expectedCause = unanswered
            ? "timeout"
            : { "粗心": "algebra-slip", "不會": "wrong-technique", "忘公式": "forgot-formula" }[errorTag] || "";
          if (
            back.unanswered !== unanswered || back.assisted !== assisted ||
            back.timed !== timed || back.hints !== hints || back.cause !== expectedCause
          ) {
            flagRoundtrip = false;
          }
        });
      });
    });
  });
});
check("flags 位元打包必須完全可逆（含提示層數與錯因）", flagRoundtrip);
check("錯因用數字代碼而不是中文（文案會改，代碼不能改）",
  store.CAUSES.every((c) => c === "" || /^[a-z-]+$/.test(c)));

const decoded = store.attempts(migrated);
check("解碼後筆數要對得上", decoded.length === 200, `實際 ${decoded.length}`);
check("解碼後每筆都要有可用的時間戳", decoded.every((a) => Number.isFinite(a.at) && a.at > 0));
check("練習模式的作答必須被標成不限時",
  decoded.some((a) => !a.timed) && decoded.some((a) => a.timed));

/* ── 3. 冪等 ───────────────────────────────────────────────── */

const twice = store.normalize(JSON.parse(JSON.stringify(migrated)));
check("normalize 跑第二次不得改變任何東西",
  JSON.stringify(twice) === JSON.stringify(migrated));
check("normalize 跑第二次不得重複回填",
  twice.attemptLog.length === migrated.attemptLog.length,
  `${migrated.attemptLog.length} -> ${twice.attemptLog.length}`);

/* ── 4. 增量寫入與去重 ─────────────────────────────────────── */

const live = store.normalize({ history: makeHistory(3, 10), schema: 1 });
const beforeN = live.attemptLog.length;
const newSession = makeHistory(1, 10)[0];
newSession.id = "brand-new";
newSession.finishedAt = new Date(NOW).toISOString();

store.appendSession(live, newSession);
check("新的一場要寫進 attemptLog", live.attemptLog.length === beforeN + 10,
  `${beforeN} -> ${live.attemptLog.length}`);
check("新的一場要寫進 sessions", live.sessions.length === 4);

store.appendSession(live, newSession);
check("同一場重複寫入必須被去重（遷移當下正在存的那場不能算兩次）",
  live.attemptLog.length === beforeN + 10, `實際 ${live.attemptLog.length}`);
check("去重後 sessions 也不得增加", live.sessions.length === 4);

check("沒有 answers 的 session 要被忽略",
  store.appendSession({ attemptLog: [], sessions: [] }, { id: "x", finishedAt: new Date(NOW).toISOString() })
    .attemptLog.length === 0);
check("finishedAt 壞掉的 session 要被忽略",
  store.appendSession({ attemptLog: [], sessions: [] },
    { id: "y", finishedAt: "nope", answers: [{ problemId: "lim-001", correct: true }] })
    .attemptLog.length === 0);

/* ── 5. 修剪 ───────────────────────────────────────────────── */

const overflowing = { attemptLog: [], sessions: [], schema: 2 };
for (let i = 0; i < store.ATTEMPT_LIMIT + 500; i += 1) {
  overflowing.attemptLog.push(["lim-001", Math.round((NOW - (store.ATTEMPT_LIMIT + 500 - i) * 1000) / 1000), 1, 10, 4]);
}
for (let i = 0; i < store.SESSION_LIMIT + 50; i += 1) {
  overflowing.sessions.push({ id: `o-${i}`, at: Math.round(NOW / 1000) - i, mode: "quick", n: 1, ok: 1, sec: 10, score: 10 });
}
const newestBefore = overflowing.attemptLog[overflowing.attemptLog.length - 1][1];
store.compact(overflowing);
check("attemptLog 必須被修剪到上限", overflowing.attemptLog.length === store.ATTEMPT_LIMIT,
  `實際 ${overflowing.attemptLog.length}`);
check("sessions 必須被修剪到上限", overflowing.sessions.length === store.SESSION_LIMIT);
check("修剪必須丟最舊的、留最新的",
  overflowing.attemptLog[overflowing.attemptLog.length - 1][1] === newestBefore);

/* ── 6. 能力模型兩條來源必須一致 ─────────────────────────────
   這是整個 v2 最重要的不變式：換了資料來源，使用者看到的數字不能變。 */

const bigHistory = makeHistory(40, 12);
const viaHistory = { history: bigHistory };
const viaLog = store.normalize({ history: bigHistory, schema: 1 });

const profileA = ability.profile(viaHistory, { now: NOW, problems, graph });
const profileB = ability.profile(viaLog, { now: NOW, problems, graph });

check("兩條來源的作答數必須相同",
  profileA.coverage.attempts === profileB.coverage.attempts,
  `${profileA.coverage.attempts} vs ${profileB.coverage.attempts}`);
check("兩條來源的總體精熟度必須相同",
  profileA.overall.mastery === profileB.overall.mastery,
  `${profileA.overall.mastery} vs ${profileB.overall.mastery}`);

let mismatch = 0;
Object.keys(profileA.skills).forEach((id) => {
  const a = profileA.skills[id];
  const b = profileB.skills[id];
  if (!b) { mismatch += 1; return; }
  ["mastery", "pressureAccuracy", "untimedAccuracy", "speed", "timeoutRate", "wrongRate", "n"].forEach((field) => {
    const x = a[field];
    const y = b[field];
    const same = x === y || (x !== null && y !== null && Math.abs(x - y) < 1e-9);
    if (!same) mismatch += 1;
  });
  if (JSON.stringify(a.causes) !== JSON.stringify(b.causes)) mismatch += 1;
});
check("兩條來源的每個技巧統計必須完全相同", mismatch === 0, `${mismatch} 處不同`);
check("兩條來源的雷達必須完全相同",
  JSON.stringify(profileA.axes) === JSON.stringify(profileB.axes));

// 而且 attemptLog 要真的比 history 看得更遠
const trimmed = { history: bigHistory.slice(0, 8), attemptLog: viaLog.attemptLog, sessions: viaLog.sessions, schema: 2 };
const deepProfile = ability.profile(trimmed, { now: NOW, problems, graph });
check("history 被截斷後，attemptLog 仍要保住完整的作答歷史",
  deepProfile.coverage.attempts === profileB.coverage.attempts,
  `${deepProfile.coverage.attempts} vs ${profileB.coverage.attempts}`);
const shallowProfile = ability.profile({ history: bigHistory.slice(0, 8) }, { now: NOW, problems, graph });
check("沒有 attemptLog 時就只看得到被截斷的 history（證明分層真的有差）",
  shallowProfile.coverage.attempts < deepProfile.coverage.attempts,
  `${shallowProfile.coverage.attempts} vs ${deepProfile.coverage.attempts}`);

/* ── 7. 容量 ───────────────────────────────────────────────── */

const full = { attemptLog: [], sessions: [], schema: 2 };
const pool = problems.filter((p) => graph.skillsForProblem(p).length);
for (let i = 0; i < store.ATTEMPT_LIMIT; i += 1) {
  const problem = pool[i % pool.length];
  full.attemptLog.push(["", 0, 0, 0, 0]);
  full.attemptLog[i] = [problem.id, Math.round(NOW / 1000) - i * 60, i % 3 ? 1 : 0, 45, (i % 8) | 4];
}
for (let i = 0; i < store.SESSION_LIMIT; i += 1) {
  full.sessions.push({ id: `f-${i}`, at: Math.round(NOW / 1000) - i * 3600, mode: "quick", timed: 1, n: 12, ok: 9, sec: 400, score: 700 });
}
const bytes = store.stats(full).approxBytes;
const kb = bytes / 1024;
check(`滿載（${store.ATTEMPT_LIMIT} 筆作答）的體積應在 500KB 內`, kb < 500, `實際 ${kb.toFixed(0)}KB`);

const perfStart = process.hrtime.bigint();
const fullProfile = ability.profile(full, { now: NOW, problems, graph });
const perfMs = Number(process.hrtime.bigint() - perfStart) / 1e6;
check("滿載時 profile() 仍應在 150ms 內", perfMs < 150, `實際 ${perfMs.toFixed(1)}ms`);

/* ── 8. 合併 ───────────────────────────────────────────────
   兩台裝置各自練習後合併。現行的「整份 updatedAt 最新者獲勝」會讓其中
   一邊整份消失 —— 這一節就是為了讓那件事永遠不會發生。 */

function makeDevice(seed, sessionCount, daysAgoBase) {
  const pool = problems.filter((p) => graph.skillsForProblem(p).length);
  const history = [];
  for (let s = 0; s < sessionCount; s += 1) {
    const picks = [];
    for (let j = 0; j < 10; j += 1) picks.push(pool[(seed * 997 + s * 10 + j) % pool.length]);
    history.push({
      id: `dev${seed}-${s}`,
      mode: "quick",
      score: 500 + s,
      finishedAt: new Date(NOW - (daysAgoBase + sessionCount - s) * DAY).toISOString(),
      answers: picks.map((problem, j) => ({
        problemId: problem.id,
        correct: (seed + s + j) % 3 !== 0,
        elapsed: Math.round((problem.timeLimit || 60) * 0.6),
        hintsUsed: 0
      }))
    });
  }
  const rec = store.normalize({ history, schema: 1 });
  rec.bestScore = 400 + seed * 100;
  rec.bestStreak = 3 + seed;
  rec.favorites = { ["fav-" + seed]: true };
  rec.achievements = { ["ach-" + seed]: { id: "ach-" + seed } };
  rec.daily = {};
  rec.daily["2026-08-0" + seed] = { score: 60 + seed * 10 };
  rec.settings = { difficultyCap: 3 + seed };
  rec.updatedAt = new Date(NOW - (seed === 1 ? 2 : 1) * DAY).toISOString();
  rec.mistakes = {};
  pool.slice(seed * 3, seed * 3 + 4).forEach((problem) => {
    rec.mistakes[problem.id] = {
      problemId: problem.id,
      wrongCount: 1 + seed,
      lastWrongAt: new Date(NOW - (5 - seed) * DAY).toISOString(),
      srs: { interval: 2 + seed, dueAt: NOW + (seed === 1 ? 3 : 7) * DAY }
    };
  });
  return rec;
}

const topics = {};
problems.forEach((p) => { topics[p.id] = p.topic; });

const devA = makeDevice(1, 8, 4);
const devB = makeDevice(2, 6, 0);
const merged = store.merge(devA, devB, { problemTopics: topics });

// 不丟資料：作答總數至少要是兩邊的最大值，而且應該接近兩邊之和
const aCount = devA.attemptLog.length;
const bCount = devB.attemptLog.length;
check("合併後的作答數不得少於任一邊",
  merged.attemptLog.length >= Math.max(aCount, bCount),
  `${aCount} + ${bCount} -> ${merged.attemptLog.length}`);
check("兩台裝置的作答應該幾乎都被保留",
  merged.attemptLog.length >= aCount + bCount - 5,
  `${aCount} + ${bCount} -> ${merged.attemptLog.length}`);
check("合併後 attemptLog 仍按時間排序",
  merged.attemptLog.every((row, i) => i === 0 || row[1] >= merged.attemptLog[i - 1][1]));
check("合併後不得有重複的作答",
  new Set(merged.attemptLog.map((r) => r[0] + "@" + r[1])).size === merged.attemptLog.length);

// 交換律：換邊合併結果必須相同
const flipped = store.merge(devB, devA, { problemTopics: topics });
const strip = (r) => {
  const copy = JSON.parse(JSON.stringify(r));
  delete copy.updatedAt;
  return JSON.stringify(copy);
};
check("merge(a,b) 與 merge(b,a) 必須相同（交換律）", strip(merged) === strip(flipped));

// 冪等：合併過的結果再合併一次不得改變任何東西。
// （注意 merge(a,a) 不會等於 normalize(a) —— 合併會從 attemptLog 重算計數器，
//  那是刻意的：計數器不能相加也不能取 max，只能重算。）
const selfMerged = store.merge(devA, devA, { problemTopics: topics });
check("merge(a,a) 再合併一次不得改變內容（冪等）",
  strip(store.merge(selfMerged, devA, { problemTopics: topics })) === strip(selfMerged),
  "重複合併改變了內容");
check("merge(a,a) 不得丟掉 a 的任何作答",
  selfMerged.attemptLog.length === devA.attemptLog.length,
  `${devA.attemptLog.length} -> ${selfMerged.attemptLog.length}`);
check("重複合併不得再增加資料",
  store.merge(merged, merged, { problemTopics: topics }).attemptLog.length === merged.attemptLog.length);

// 逐欄位規則
check("bestScore 取兩邊最大", merged.bestScore === Math.max(devA.bestScore, devB.bestScore));
check("bestStreak 取兩邊最大", merged.bestStreak === Math.max(devA.bestStreak, devB.bestStreak));
check("收藏必須是聯集", merged.favorites["fav-1"] && merged.favorites["fav-2"]);
check("成就必須是聯集", merged.achievements["ach-1"] && merged.achievements["ach-2"]);
check("每日成績兩邊的 key 都要在", merged.daily["2026-08-01"] && merged.daily["2026-08-02"]);
check("錯題必須是聯集", Object.keys(merged.mistakes).length >= Object.keys(devA.mistakes).length);
check("設定用 LWW，較新的那邊勝",
  merged.settings.difficultyCap === devB.settings.difficultyCap,
  `實際 ${merged.settings.difficultyCap}`);
check("history 也要合併", merged.history.length >= Math.max(devA.history.length, devB.history.length));

// 同一題在兩邊都錯過：錯誤次數取多的，SRS 到期日取早的（寧可多複習）
const sharedId = Object.keys(devA.mistakes).find((id) => devB.mistakes[id]);
if (sharedId) {
  check("同一題的錯誤次數取兩邊最大",
    merged.mistakes[sharedId].wrongCount ===
      Math.max(devA.mistakes[sharedId].wrongCount, devB.mistakes[sharedId].wrongCount));
  check("同一題的 SRS 到期日取較早者（寧可多複習一次）",
    merged.mistakes[sharedId].srs.dueAt ===
      Math.min(devA.mistakes[sharedId].srs.dueAt, devB.mistakes[sharedId].srs.dueAt));
}

// 計數器要重算，不能相加也不能取 max
check("totalAnswered 必須等於合併後的實際作答數",
  merged.totalAnswered === merged.attemptLog.length,
  `${merged.totalAnswered} vs ${merged.attemptLog.length}`);
check("topicStats 的總和必須等於作答數",
  Object.values(merged.topicStats).reduce((sum, t) => sum + t.total, 0) === merged.attemptLog.length);

// 能力模型在合併後仍要算得出東西，而且比單邊多
const mergedProfile = ability.profile(merged, { now: NOW, problems, graph });
const aProfile = ability.profile(devA, { now: NOW, problems, graph });
check("合併後能力模型看到的作答數不得少於單邊",
  mergedProfile.coverage.attempts >= aProfile.coverage.attempts,
  `${aProfile.coverage.attempts} -> ${mergedProfile.coverage.attempts}`);

// 壞資料
let mergeOk = true;
try {
  store.merge(null, undefined);
  store.merge({ history: [null] }, { attemptLog: ["bad", null] });
} catch (error) { mergeOk = false; failures.push(`merge 遇到壞資料丟例外：${error.message}`); }
check("merge 不得因壞資料丟例外", mergeOk);
check("merge(null, null) 仍要回傳合法紀錄", store.merge(null, null).schema === 2);

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("Records v2");
console.log(`  遷移            v1 ${Object.keys(v1Snapshot).length} 個欄位原封不動 -> schema 2`);
console.log(`  回填            ${migrated.attemptLog.length} 筆作答 / ${migrated.sessions.length} 場摘要`);
console.log(`  滿載體積        ${kb.toFixed(0)}KB（${store.ATTEMPT_LIMIT} 筆作答 + ${store.SESSION_LIMIT} 場摘要）`);
console.log(`  滿載效能        profile() ${perfMs.toFixed(1)}ms，測得出 ${fullProfile.coverage.skillsMeasured} 個技巧`);
console.log(`  分層效益        history 截斷後仍保住 ${deepProfile.coverage.attempts} 筆（只讀 history 只剩 ${shallowProfile.coverage.attempts} 筆）`);
console.log(`  合併            ${aCount} + ${bCount} -> ${merged.attemptLog.length} 筆，交換律與冪等已驗`);

if (failures.length) {
  console.error("");
  console.error(`records v2 驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("records v2 OK");
