const fakeApp = {
  innerHTML: "",
  querySelectorAll: () => [],
  querySelector: () => null,
  matches: () => false,
  // [data-action] 改成委派之後，#app 自己也要能收監聽器
  addEventListener: () => {},
  removeEventListener: () => {},
  contains: () => false
};

global.window = {
  addEventListener: () => {},
  setTimeout: (fn) => {
    if (typeof fn === "function") fn();
  },
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: (fn) => {
    if (typeof fn === "function") fn();
  },
  matchMedia: () => ({ matches: false }),
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 720,
  __BUZZ_TEST_HOOKS__: {}
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.localStorage = {
  getItem: () => "{}",
  setItem: () => {},
  removeItem: () => {}
};
global.document = {
  getElementById: (id) => (id === "app" ? fakeApp : null),
  addEventListener: () => {},
  visibilityState: "visible",
  body: {
    appendChild: () => {}
  },
  createElement: () => ({ click: () => {}, remove: () => {} })
};
global.Blob = function Blob() {};
global.URL = {
  createObjectURL: () => "blob:smoke",
  revokeObjectURL: () => {}
};
global.FileReader = function FileReader() {};

require("./lib/load_problem_sources.js")();
require("../src/app.js");

if (!fakeApp.innerHTML.includes("BuzzCalculus")) {
  throw new Error("home screen did not render");
}

const api = global.window.__BUZZ_TEST_HOOKS__?.api;
if (!api || typeof api.buildExamAnalysis !== "function") {
  throw new Error("exam analysis hooks did not initialize");
}

const sampleProblems = [
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-int-005"),
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-der-005"),
  global.window.BUZZ_PROBLEMS.find((problem) => problem.id === "depth-ser-009")
];
if (sampleProblems.some((problem) => !problem)) {
  throw new Error("exam depth sample problems are missing");
}

const sampleAnswers = [
  { problem: sampleProblems[0], correct: true, elapsed: 80, reason: "Correct" },
  { problem: sampleProblems[1], correct: false, elapsed: 110, reason: "Wrong" },
  { problem: sampleProblems[2], correct: false, elapsed: 0, reason: "Unanswered", unanswered: true }
];
const analysis = api.buildExamAnalysis(sampleAnswers);
if (api.averageAnswerTime(sampleAnswers) !== 95 || !analysis.topicRows.length || !analysis.tagRows.length) {
  throw new Error("exam analysis sample did not produce expected stats");
}
const analysisHtml = api.renderExamAnalysisSection(analysis);
if (!analysisHtml.includes("大考戰況分析") || !analysisHtml.includes("技巧錯誤熱區")) {
  throw new Error("exam analysis section did not render expected copy");
}

// ── 雷達的兩條路徑都要能 render ──────────────────────────────
// app.js 走 feature-detect：kernel 在就用能力模型，不在就退回舊計法。
// 這裡刻意先在「沒有 kernel」的狀態下驗一次，再載入 kernel 驗第二次 ——
// 任何一條路徑壞掉，使用者看到的就是白畫面或空雷達。
const radarRecords = (() => {
  const picks = global.window.BUZZ_PROBLEMS.filter((problem) =>
    (problem.tags || []).includes("integration-by-parts")
  ).slice(0, 12);
  if (picks.length < 6) throw new Error("radar smoke fixture is missing problems");
  return {
    history: picks.map((problem, index) => ({
      id: `radar-${index}`,
      mode: "quick",
      finishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      answers: [{ problemId: problem.id, correct: index % 4 !== 0, elapsed: 30, hintsUsed: 0 }]
    }))
  };
})();

function checkRadar(label) {
  const axes = api.masteryRadarData(radarRecords);
  if (!Array.isArray(axes) || axes.length !== 8) {
    throw new Error(`${label}: radar axes shape changed (${axes && axes.length})`);
  }
  if (!axes.every((axis) => axis && typeof axis.label === "string" && "score" in axis)) {
    throw new Error(`${label}: radar axis entries are missing label/score`);
  }
  if (!axes.every((axis) => axis.score === null || (axis.score >= 0 && axis.score <= 100))) {
    throw new Error(`${label}: radar score out of range`);
  }
  const html = api.renderMasteryRadar(radarRecords);
  if (!html.includes("技巧精熟雷達")) throw new Error(`${label}: radar did not render`);
  return axes;
}

if (global.window.BuzzAbility) throw new Error("kernel leaked into the no-kernel smoke pass");
const legacyAxes = checkRadar("no kernel");

require("../src/kernel/records_v2.js");
require("../src/kernel/skill_tags.js");
require("../src/kernel/skill_graph.js");
require("../src/kernel/ability.js");
// 內容側表：永久題號、來源聲明、難度三軸。它們不影響上面那段
// 「沒有 kernel 也要能跑」的測試，但後面的校準包測試需要 uid 對照。
require("../src/kernel/uid_map.js");
require("../src/kernel/origin.js");
require("../src/kernel/rubric.js");
if (!global.window.BuzzAbility || !global.window.BuzzSkillGraph || !global.window.BuzzRecords) {
  throw new Error("kernel modules did not register on window");
}
const kernelAxes = checkRadar("with kernel");

// ── records v2 的關鍵路徑：normalizeRecords 要真的做遷移 ──────────
// app.js 只在 window.BuzzRecords 存在時才呼叫分層儲存。這裡驗的是那條線
// 真的接上了 —— 接錯的話使用者的趨勢資料會靜默地不被記錄。
const migrated = api.normalizeRecords(JSON.parse(JSON.stringify(radarRecords)));
if (migrated.schema !== 2) {
  throw new Error(`normalizeRecords did not migrate to schema 2 (got ${migrated.schema})`);
}
if (!Array.isArray(migrated.attemptLog) || migrated.attemptLog.length !== radarRecords.history.length) {
  throw new Error(
    `attemptLog backfill mismatch: ${migrated.attemptLog && migrated.attemptLog.length} vs ${radarRecords.history.length}`
  );
}
if (migrated.history.length !== radarRecords.history.length) {
  throw new Error("migration must not touch history");
}
const beforeAppend = migrated.attemptLog.length;
api.normalizeRecords(migrated);
if (migrated.attemptLog.length !== beforeAppend) {
  throw new Error("normalizeRecords is not idempotent — attemptLog grew on a second pass");
}
console.log(
  `Records v2 smoke: schema ${migrated.schema}, ${migrated.attemptLog.length} attempts, ${migrated.sessions.length} sessions`
);

// ── 今天的訓練：兩條路徑都要能 render ────────────────────────
// 這張卡是首頁唯一的主 CTA。planner 沒載入時它必須整張消失（首頁退回原樣），
// 載入時必須產生得出一局可玩的題 —— 中間任何一步壞掉，使用者按下去就是空白。
require("../src/kernel/planner.js");
require("../src/kernel/session.js");
if (!global.window.BuzzPlanner || !global.window.BuzzSession) {
  throw new Error("planner/session did not register on window");
}

const todayHtml = api.renderTodayCard(radarRecords);
if (!todayHtml.includes("今天的訓練")) throw new Error("today card did not render");
if (!todayHtml.includes('data-action="start-planned"')) throw new Error("today card has no CTA");
if (/undefined|NaN|\[object/.test(todayHtml)) {
  throw new Error(`today card rendered a broken value: ${todayHtml.slice(0, 200)}`);
}

const planned = api.plannedSession(radarRecords);
if (!planned || !planned.filled.problems.length) throw new Error("planned session produced no problems");
if (!planned.recipe.why.trim()) throw new Error("planned session has an empty why");
const plannedIds = planned.filled.problems.map((p) => p.id);
if (plannedIds.length !== new Set(plannedIds).size) throw new Error("planned session repeated a problem");
if (planned.filled.problems.some((p) => !["limits", "derivatives", "integrals", "series"].includes(p.topic))) {
  throw new Error("non-calculus problems leaked into the session");
}

// 同一天重整首頁應該拿到同一份訓練，不然推薦看起來像隨機的
const again = api.plannedSession(radarRecords);
if (JSON.stringify(again.filled.problems.map((p) => p.id)) !== JSON.stringify(plannedIds)) {
  throw new Error("planned session is not stable within the same day");
}

console.log(
  `Today card smoke: ${planned.recipe.label} / ${planned.filled.problems.length} problems / ` +
    `${Math.round(planned.filled.estSeconds / 60)} min / why="${planned.recipe.why}"`
);

// 所有 MODES 都要有 bucket，否則 04.2 的四分類收納會漏掉模式
const missingBucket = Object.keys(api.modes).filter((key) => !api.modes[key].bucket);
if (missingBucket.length) throw new Error(`MODES missing bucket: ${missingBucket.join(", ")}`);
const badBucket = Object.keys(api.modes).filter(
  (key) => !["practice", "weakness", "exam", "challenge"].includes(api.modes[key].bucket)
);
if (badBucket.length) throw new Error(`MODES has unknown bucket: ${badBucket.join(", ")}`);
console.log(`Mode buckets: ${Object.keys(api.modes).length} modes classified`);

const scored = (axes) => axes.filter((axis) => axis.score !== null).length;
console.log(
  `Radar smoke: legacy ${scored(legacyAxes)}/8 axes scored, kernel ${scored(kernelAxes)}/8 axes scored`
);

console.log(`Rendered home HTML: ${fakeApp.innerHTML.length} chars`);

// ── 訓練 / 數據兩個新分頁 ────────────────────────────────────
// 首頁收納之後，舊首頁的內容全部搬進這兩頁。任何一個 bucket render 不出來，
// 就等於某一批模式從產品裡消失了 —— 收納不刪除，這條線由這裡守。
const trainRecords = (() => {
  const seeded = JSON.parse(JSON.stringify(radarRecords));
  seeded.mistakes = {};
  global.window.BUZZ_PROBLEMS.slice(0, 5).forEach((p) => {
    seeded.mistakes[p.id] = { problemId: p.id, wrongCount: 2, srs: { interval: 1, dueAt: 0 } };
  });
  seeded.totalAnswered = 120;
  return seeded;
})();

api.trainBuckets.forEach((bucket) => {
  api.setBucket(bucket.key);
  const html = api.renderTrain();
  if (!html.includes(bucket.label)) throw new Error(`train bucket ${bucket.key} did not render its label`);
  if (html.length < 400) throw new Error(`train bucket ${bucket.key} rendered almost nothing (${html.length} chars)`);
  if (/undefined|NaN|\[object/.test(html)) {
    throw new Error(`train bucket ${bucket.key} rendered a broken value`);
  }
});
api.setBucket("practice");

// 每一個模式都必須從某個 bucket 到得了，否則收納就變成藏起來
const allTrainHtml = api.trainBuckets
  .map((bucket) => {
    api.setBucket(bucket.key);
    return api.renderTrain();
  })
  .join("");
api.setBucket("practice");
const unreachable = Object.keys(api.modes).filter((key) => {
  if (api.modes[key].hidden) return false;
  if (["placement", "mistakes", "weekly"].includes(key)) return false; // 由專屬按鈕進入
  return !allTrainHtml.includes(`data-mode-key="${key}"`) && !allTrainHtml.includes(api.modes[key].label);
});
if (unreachable.length) {
  throw new Error(`these modes are unreachable from the train page: ${unreachable.join(", ")}`);
}

const emptyInsights = api.renderInsights();
if (!emptyInsights.includes("還沒有資料")) {
  throw new Error("insights should tell a brand-new user there is no data yet");
}

const filledInsights = (() => {
  const original = global.localStorage.getItem;
  global.localStorage.getItem = () => JSON.stringify(trainRecords);
  try {
    return api.renderInsights();
  } finally {
    global.localStorage.getItem = original;
  }
})();
["整體能力", "速度 × 正確率", "技巧精熟度", "錯因"].forEach((needle) => {
  if (!filledInsights.includes(needle)) throw new Error(`insights is missing the "${needle}" section`);
});
if (/undefined|NaN|\[object/.test(filledInsights)) {
  throw new Error("insights rendered a broken value");
}

console.log(
  `Views smoke: home ${api.renderHome().length} chars, train ${allTrainHtml.length} chars, insights ${filledInsights.length} chars`
);

// ── 信心自評 / 錯因推薦 ──────────────────────────────────────
// 這兩個互動的價值全在「有沒有真的產生資料」。只在畫面上出現、
// 但沒人點或點了不記，等於功能不存在 —— 所以這裡驗的是資料流。
const cq = (mode, answer) => ({
  mode,
  examMode: mode === "exam",
  problems: [answer.problem],
  answers: [answer],
  hintsUsed: {},
  boardStrokes: {},
  confidence: {},
  confidenceSkipped: {}
});

const wrongProblem = global.window.BUZZ_PROBLEMS.find((p) => p.timeLimit >= 60);
const mkAnswer = (over) =>
  Object.assign(
    { problem: wrongProblem, correct: false, input: "x", reason: "Wrong", elapsed: 40, hintsUsed: 0, errorTag: "" },
    over
  );

// 信心自評：只在日常模式問，大考與宿敵不打斷節奏
api.setQuiz(cq("quick", mkAnswer({})));
const confHtml = api.renderConfidencePrompt(wrongProblem);
api.confidenceLevels.forEach((level) => {
  if (!confHtml.includes(level.label)) throw new Error(`confidence prompt is missing "${level.label}"`);
});
if (!confHtml.includes('data-action="set-confidence"')) throw new Error("confidence prompt has no action");
if (!confHtml.includes('data-action="skip-confidence"')) throw new Error("confidence prompt cannot be skipped");

api.setQuiz(cq("exam", mkAnswer({})));
if (api.renderConfidencePrompt(wrongProblem) !== "") {
  throw new Error("confidence prompt must not interrupt exam mode");
}
const rivalQuiz = cq("rival", mkAnswer({}));
rivalQuiz.rival = { name: "小積" };
api.setQuiz(rivalQuiz);
if (api.renderConfidencePrompt(wrongProblem) !== "") {
  throw new Error("confidence prompt must not interrupt rival mode");
}

// 錯因推薦：每一種證據都要推出對應的猜測，而且要附得出理由
const cases = [
  { name: "讀太快", answer: mkAnswer({ elapsed: Math.floor(wrongProblem.timeLimit * 0.1) }), expect: "wrong-technique" },
  { name: "看到第二層提示", answer: mkAnswer({ hintsUsed: 2 }), expect: "forgot-formula" }
];
api.setQuiz(cq("quick", mkAnswer({})));
cases.forEach((c) => {
  const s = api.suggestCause(wrongProblem, c.answer);
  if (!s) throw new Error(`suggestCause returned nothing for ${c.name}`);
  if (s.key !== c.expect) throw new Error(`suggestCause(${c.name}) = ${s.key}, expected ${c.expect}`);
  if (!s.why || !s.why.trim()) throw new Error(`suggestCause(${c.name}) has no reason`);
  if (!api.causeTagOf(s.key)) throw new Error(`suggestCause(${c.name}) maps to no legacy tag`);
});

// 錯因面板：一定要預選一項，否則「降低標註成本」這個設計目的沒達成
const wrong = mkAnswer({ causeAuto: true, errorTag: "不會" });
api.setQuiz(cq("quick", wrong));
const causeHtml = api.renderCausePrompt(wrongProblem, { status: "wrong" });
if (!causeHtml.includes("is-active")) throw new Error("cause prompt did not pre-select a suggestion");
if (!causeHtml.includes("已先幫你選好")) throw new Error("cause prompt did not explain its guess");
// 使用者親自選過之後就不該再解釋
api.setQuiz(cq("quick", mkAnswer({ causeAuto: false, errorTag: "粗心" })));
if (api.renderCausePrompt(wrongProblem, { status: "wrong" }).includes("已先幫你選好")) {
  throw new Error("cause prompt should stop explaining once the user picked");
}
api.causeOptions.forEach((option) => {
  if (!causeHtml.includes(option.label)) throw new Error(`cause prompt is missing "${option.label}"`);
});

// 逾時是系統判定的，不該再問使用者
api.setQuiz(cq("quick", mkAnswer({ unanswered: true, elapsed: wrongProblem.timeLimit })));
const timeoutHtml = api.renderCausePrompt(wrongProblem, { status: "wrong" });
if (!timeoutHtml.includes("來不及") || timeoutHtml.includes('data-action="tag-answer"')) {
  throw new Error("timeout should be auto-classified, not asked");
}

// 答對不問錯因
api.setQuiz(cq("quick", mkAnswer({ correct: true })));
if (api.renderCausePrompt(wrongProblem, { status: "correct" }) !== "") {
  throw new Error("cause prompt must not appear on a correct answer");
}

// records.conf 要被 normalizeRecords 認得
const confRecords = api.normalizeRecords({ conf: { "lim-001": { level: "sure", correct: false, at: "x" } } });
if (!confRecords.conf || confRecords.conf["lim-001"].level !== "sure") {
  throw new Error("normalizeRecords dropped records.conf");
}
if (!api.normalizeRecords({}).conf) throw new Error("normalizeRecords did not create records.conf");

api.setQuiz(null);
console.log(
  `Confidence/cause smoke: ${api.confidenceLevels.length} levels, ${api.causeOptions.length} causes, suggestions verified`
);

// ── 考試倒推 / 考後報告 ──────────────────────────────────────
// 這個功能唯一的價值是「排不完的時候誠實說排不完」。假裝排得下，
// 使用者考砸只會怪產品 —— 所以那條線一定要有測試守著。
const DAY = 86400000;

const noPlan = api.renderExamPlanCard({ history: [] });
if (!noPlan.includes("有考試要準備")) throw new Error("exam card should invite setup when no plan is set");

const examRecords = (() => {
  // 刻意造一個「碰過很多技巧但都沒練熟」的使用者 —— 那才會排不完。
  // fixture 太薄的話 gaps 很少，反而算得出排得完，就測不到警告那條線。
  const wide = global.window.BUZZ_PROBLEMS.filter((p) => global.window.BuzzSkillGraph.skillsForProblem(p).length).slice(0, 160);
  const seeded = { history: [] };
  for (let i = 0; i < 16; i += 1) {
    seeded.history.push({
      id: "exam-" + i,
      mode: "quick",
      finishedAt: new Date(Date.now() - (16 - i) * DAY).toISOString(),
      answers: wide.slice(i * 10, i * 10 + 10).map((p, j) => ({
        problemId: p.id, correct: (i + j) % 3 !== 0, elapsed: 30, hintsUsed: 0
      }))
    });
  }
  seeded.plan = {
    label: "微積分期中",
    examAt: new Date(Date.now() + 20 * DAY).toISOString().slice(0, 10),
    scopeKey: "all",
    scope: null,
    dailyMinutes: 10,
    target: 70,
    setAt: new Date(Date.now() - 10 * DAY).toISOString()
  };
  return seeded;
})();

const examCard = api.renderExamPlanCard(examRecords);
if (!examCard.includes("微積分期中")) throw new Error("exam card lost its label");
if (!/\d+<\/strong>\s*<span>天/.test(examCard)) throw new Error("exam card has no countdown");
if (/undefined|NaN|\[object/.test(examCard)) throw new Error("exam card rendered a broken value");

// 每天只給 10 分鐘、範圍全開 —— 一定排不完，必須看得到警告與具體建議
if (!examCard.includes("排不完")) {
  throw new Error("exam card must say so when the plan does not fit");
}
if (!/建議把每天加到 \d+ 分鐘/.test(examCard)) {
  throw new Error("exam card must suggest a concrete number of minutes");
}
if (!/只顧得到\s*\n?\s*\d+ 個技巧中的 \d+ 個/.test(examCard.replace(/\s+/g, " "))) {
  throw new Error("exam card must say how many skills are actually coverable");
}

// 考前 7 天內要進衝刺模式
const sprintRecords = JSON.parse(JSON.stringify(examRecords));
sprintRecords.plan.examAt = new Date(Date.now() + 4 * DAY).toISOString().slice(0, 10);
if (!api.renderExamPlanCard(sprintRecords).includes("衝刺模式已啟動")) {
  throw new Error("exam card did not switch to sprint mode inside T-7");
}

// 考完之後要出報告，而且只出一次
const doneRecords = JSON.parse(JSON.stringify(examRecords));
doneRecords.plan.examAt = new Date(Date.now() - 2 * DAY).toISOString().slice(0, 10);
const report = api.renderExamReport(doneRecords);
if (!report.includes("考後報告")) throw new Error("exam report did not render after the exam date");
if (/undefined|NaN|\[object/.test(report)) throw new Error("exam report rendered a broken value");
doneRecords.planReportSeen = doneRecords.plan.examAt;
if (api.renderExamReport(doneRecords) !== "") throw new Error("exam report must not reappear once dismissed");

// 考試還沒到不該出報告
if (api.renderExamReport(examRecords) !== "") throw new Error("exam report appeared before the exam");

// 範圍選項都要有 label
api.examScopes.forEach((scope) => {
  if (!scope.key || !scope.label) throw new Error("exam scope option is missing key/label");
});

// records 正規化要認得 plan 家族
const normalized = api.normalizeRecords({});
if (normalized.plan !== null || !Array.isArray(normalized.planHistory) || typeof normalized.planReportSeen !== "string") {
  throw new Error("normalizeRecords did not set up the exam plan fields");
}

console.log(`Exam plan smoke: ${api.examScopes.length} scopes, infeasible warning + sprint + report verified`);

// ── keyIdea 與三層提示 ───────────────────────────────────────
// 第二層提示只能吃作者親自寫的。把 topic 級泛用文字冒充成「這題的關鍵步驟」，
// 是在假裝我們知道這題怎麼解 —— 那比沒有提示更糟。
const withHints = global.window.BUZZ_PROBLEMS.find((p) => api.authoredHints(p).length >= 2);
const withoutHints = global.window.BUZZ_PROBLEMS.find((p) => api.authoredHints(p).length === 0);
if (!withHints || !withoutHints) throw new Error("hint smoke fixture is missing problems");

const richStages = api.renderSolutionStages(withHints);
if (richStages.includes("這題沒有")) throw new Error("a problem with authored hints should have stage 2");
if (!/<ol>/.test(richStages)) throw new Error("stage 2 did not render the authored steps");

const bareStages = api.renderSolutionStages(withoutHints);
if (!bareStages.includes("這題沒有")) throw new Error("stage 2 must admit when there is no authored guidance");
if (!bareStages.includes("直接看完整推導")) throw new Error("stage 2 should send the user to the full solution");
if (/<ol>/.test(bareStages.split("關鍵步驟")[1].split("完整推導")[0])) {
  throw new Error("stage 2 rendered generic topic hints as if they were problem-specific");
}

// keyIdea：作者寫的優先，沒寫的從 skill graph 推導，兩者都不得為空字串
const idea = api.keyIdeaFor(withoutHints);
if (!idea || !idea.text.trim()) throw new Error("keyIdea fell through to nothing");
if (idea.authored !== false) throw new Error("keyIdea should be marked as derived when not authored");
const html = api.renderKeyIdea(withoutHints);
if (!html.includes("關鍵")) throw new Error("keyIdea did not render");
if (/undefined|NaN|\[object/.test(html)) throw new Error("keyIdea rendered a broken value");

let covered = 0;
global.window.BUZZ_PROBLEMS.forEach((p) => { if (api.keyIdeaFor(p)) covered += 1; });
if (covered !== global.window.BUZZ_PROBLEMS.length) {
  throw new Error(`keyIdea covers only ${covered}/${global.window.BUZZ_PROBLEMS.length} problems`);
}

const authoredCount = global.window.BUZZ_PROBLEMS.filter((p) => api.authoredHints(p).length >= 2).length;
console.log(
  `Key idea smoke: ${covered}/${global.window.BUZZ_PROBLEMS.length} problems have a key idea, ` +
    `${authoredCount} have an authored stage-2 hint`
);

// ── 作答中斷續傳 ─────────────────────────────────────────────
// spec 一路標為「如果只能做一件事」的那項：模擬考重整不能丟整份卷。
// 這裡驗的是「存下去再讀回來，還是同一局」——序列化只要漏一個欄位，
// 使用者續傳後就會發現分數、連勝或計時對不上。
const resumeProblems = global.window.BUZZ_PROBLEMS.slice(40, 52);
const liveQuiz = {
  mode: "exam",
  topic: "all",
  answerMode: "free",
  practice: false,
  noTimer: false,
  examMode: true,
  examDurationSec: 2700,
  examEndAt: Date.now() + 1200000,
  requireFullscreen: true,
  fullscreenStatus: "active",
  difficultyCap: 4,
  problems: resumeProblems,
  index: 3,
  score: 640,
  currentStreak: 2,
  bestStreak: 3,
  startedAt: Date.now() - 600000,
  questionStartedAt: Date.now() - 45000,
  tabSwitches: { [resumeProblems[0].id]: 1 },
  choiceOptions: {},
  boardStrokes: { [resumeProblems[0].id]: [[1, 2, 0.5, 10]] },
  hintsUsed: { [resumeProblems[1].id]: 2 },
  draft: "log(2)",
  feedback: null,
  confidence: { [resumeProblems[0].id]: "sure" },
  answers: resumeProblems.slice(0, 3).map((problem, i) => ({
    problem,
    input: "x" + i,
    correct: i !== 1,
    reason: i === 1 ? "Wrong" : "Correct",
    elapsed: 30 + i,
    earned: i === 1 ? 0 : 90,
    hintsUsed: 0,
    errorTag: i === 1 ? "粗心" : "",
    causeAuto: i === 1,
    boardStrokes: []
  }))
};

const frozen = api.serializeQuiz(liveQuiz);
if (!frozen) throw new Error("serializeQuiz returned nothing");

// 必須真的可以 JSON 化（有題目物件參照的話這裡就會爆或膨脹）
const json = JSON.stringify(frozen);
if (json.includes('"prompt"')) throw new Error("serialized session still carries whole problem objects");
if (json.length > 60000) throw new Error(`serialized session is too big: ${json.length} bytes`);

const thawed = api.deserializeQuiz(JSON.parse(json));
if (!thawed) throw new Error("deserializeQuiz returned nothing");

[
  "mode", "topic", "answerMode", "examMode", "examDurationSec", "examEndAt",
  "requireFullscreen", "difficultyCap", "index", "score", "currentStreak",
  "bestStreak", "startedAt", "questionStartedAt", "draft"
].forEach((key) => {
  if (JSON.stringify(thawed[key]) !== JSON.stringify(liveQuiz[key])) {
    throw new Error(`resume lost ${key}: ${liveQuiz[key]} -> ${thawed[key]}`);
  }
});
if (JSON.stringify(thawed.hintsUsed) !== JSON.stringify(liveQuiz.hintsUsed)) throw new Error("resume lost hintsUsed");
if (JSON.stringify(thawed.tabSwitches) !== JSON.stringify(liveQuiz.tabSwitches)) throw new Error("resume lost tabSwitches");
if (JSON.stringify(thawed.confidence) !== JSON.stringify(liveQuiz.confidence)) throw new Error("resume lost confidence");

if (thawed.problems.length !== liveQuiz.problems.length) throw new Error("resume lost problems");
thawed.problems.forEach((problem, i) => {
  if (problem.id !== liveQuiz.problems[i].id) throw new Error(`resume reordered problems at ${i}`);
  if (!problem.prompt) throw new Error("resume did not rehydrate the problem object");
});

if (thawed.answers.length !== liveQuiz.answers.length) throw new Error("resume lost answers");
thawed.answers.forEach((answer, i) => {
  const before = liveQuiz.answers[i];
  if (answer.problem.id !== before.problem.id) throw new Error("resume lost an answer's problem");
  ["input", "correct", "reason", "elapsed", "earned", "errorTag", "causeAuto"].forEach((key) => {
    if (JSON.stringify(answer[key]) !== JSON.stringify(before[key])) {
      throw new Error(`resume lost answer.${key}`);
    }
  });
});

// 在回饋畫面中斷時，index 會落後 answers 一格 —— 續傳不能讓使用者重答同一題。
{
  const midFeedback = JSON.parse(json);
  midFeedback.index = 2;                                  // 第 3 題已作答，還沒按「下一題」
  midFeedback.answers = midFeedback.answers.slice(0, 3);
  const store2 = {};
  const real2 = global.localStorage;
  global.localStorage = {
    getItem: (k) => (k in store2 ? store2[k] : null),
    setItem: (k, v) => { store2[k] = String(v); },
    removeItem: (k) => { delete store2[k]; }
  };
  store2[api.activeSessionKey] = JSON.stringify({ schema: 1, savedAt: Date.now() - 1000, quiz: midFeedback });
  api.resumeSession();
  const q = api.getQuiz();
  global.localStorage = real2;
  if (!q) throw new Error("resumeSession did not restore a quiz");
  if (q.index !== 3) throw new Error(`resume must skip past answered questions: index ${q.index}, expected 3`);
  if (q.answers.length !== 3) throw new Error("resume changed the answer count");
  if (q.feedback) throw new Error("resume should clear the stale feedback panel");
  if (q.draft) throw new Error("resume should clear the stale draft");
  if (q.interruptions !== 1) throw new Error(`resume must count the interruption: ${q.interruptions}`);
  api.setQuiz(null);
}

// 題目下架 → 該局不能續，但不能因此丟例外
const ghost = JSON.parse(json);
ghost.problemIds[2] = "does-not-exist";
if (api.deserializeQuiz(ghost) !== null) {
  throw new Error("a session referencing a removed problem must not resume");
}
if (api.deserializeQuiz(null) !== null) throw new Error("deserializeQuiz(null) should be null");
if (api.deserializeQuiz({}) !== null) throw new Error("deserializeQuiz({}) should be null");

// 續傳卡：時間窗、已完成、壞資料都要處理
const store = {};
const realLocalStorage = global.localStorage;
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const write = (savedAt, quizPayload) => {
  store[api.activeSessionKey] = JSON.stringify({ schema: 1, savedAt, quiz: quizPayload });
};

write(Date.now() - 60000, frozen);
const card = api.renderResumeCard();
if (!card.includes("還沒做完")) throw new Error("resume card did not render for a fresh save");
if (!card.includes("第 4 / 12 題")) throw new Error(`resume card shows the wrong position: ${card.match(/第 .* 題/)}`);
if (!card.includes("整份倒數是照實走的")) throw new Error("exam resume must warn that the countdown kept running");
if (/undefined|NaN|\[object/.test(card)) throw new Error("resume card rendered a broken value");

// 過期考卷要說只能結算
const expired = JSON.parse(JSON.stringify(frozen));
expired.examEndAt = Date.now() - 1000;
write(Date.now() - 60000, expired);
if (!api.renderResumeCard().includes("只能結算不能續作")) {
  throw new Error("an expired exam should say it can only be submitted");
}

// 超過 6 小時就不提供續傳
write(Date.now() - 7 * 3600 * 1000, frozen);
if (api.renderResumeCard() !== "") throw new Error("a stale session should not offer resume");
if (store[api.activeSessionKey]) throw new Error("a stale session should be cleared");

// 已經做完的局沒有續傳意義
const finished = JSON.parse(JSON.stringify(frozen));
finished.answers = resumeProblems.map((p) => ({ problemId: p.id, correct: true }));
write(Date.now() - 60000, finished);
if (api.renderResumeCard() !== "") throw new Error("a completed session should not offer resume");

// 壞掉的 JSON 不能讓首頁掛掉
store[api.activeSessionKey] = "{not json";
if (api.renderResumeCard() !== "") throw new Error("corrupt session data should be ignored");
if (store[api.activeSessionKey]) throw new Error("corrupt session data should be cleared");

// 沒有存檔時不出卡
delete store[api.activeSessionKey];
if (api.renderResumeCard() !== "") throw new Error("resume card appeared with no saved session");

global.localStorage = realLocalStorage;
console.log(`Resume smoke: ${json.length} bytes for a 12-question exam, round-trip verified`);

// ── 匯入合併 / 備份提醒 ──────────────────────────────────────
// 舊行為是整份取代：在 A 匯出、在 B 匯入，B 上的紀錄就全沒了。
// 使用者以為自己在同步，實際上是在刪資料。這一節守著那件事不會再發生。
{
  const pool = global.window.BUZZ_PROBLEMS.filter(
    (p) => global.window.BuzzSkillGraph.skillsForProblem(p).length
  );
  const DAY2 = 86400000;
  const device = (seed, sessions) => {
    const history = [];
    for (let s = 0; s < sessions; s += 1) {
      const picks = [];
      for (let j = 0; j < 10; j += 1) picks.push(pool[(seed * 331 + s * 10 + j) % pool.length]);
      history.push({
        id: `imp${seed}-${s}`,
        mode: "quick",
        finishedAt: new Date(Date.now() - (seed * 30 + sessions - s) * DAY2 * 0.2).toISOString(),
        answers: picks.map((problem, j) => ({
          problemId: problem.id,
          correct: (seed + s + j) % 3 !== 0,
          elapsed: 30,
          hintsUsed: 0
        }))
      });
    }
    const r = api.normalizeRecords({ history });
    r.totalAnswered = sessions * 10;
    r.favorites = {};
    r.favorites["fav" + seed] = true;
    return r;
  };

  const here = device(1, 6);
  const there = device(2, 5);
  // importRecordsFrom 讀的是「這台裝置目前的紀錄」，所以要先讓 localStorage 回傳 here
  const realGet = global.localStorage.getItem;
  global.localStorage.getItem = (k) =>
    k === "buzzcalculus.records.v1" ? JSON.stringify(here) : realGet(k);
  const mergedIn = api.importRecordsFrom(there);
  global.localStorage.getItem = realGet;

  if (mergedIn.attemptLog.length < here.attemptLog.length) {
    throw new Error("import must never shrink the local attempt log");
  }
  if (mergedIn.attemptLog.length < there.attemptLog.length) {
    throw new Error("import dropped the incoming attempts");
  }
  if (!mergedIn.favorites.fav2) throw new Error("import lost the incoming favorites");

  // 信封格式與裸格式都要收
  const enveloped = { format: "buzz.records", version: 2, subject: "calculus", records: there };
  const unwrapped = enveloped.format === "buzz.records" && enveloped.records ? enveloped.records : enveloped;
  if (unwrapped !== there) throw new Error("envelope unwrapping is broken");

  // 備份提醒：練不夠不提，練夠了要提，關掉不再提
  const quiet = api.normalizeRecords({ totalAnswered: 12, history: [] });
  if (api.renderBackupNotice(quiet) !== "") throw new Error("backup notice appeared far too early");

  const loud = api.normalizeRecords({ totalAnswered: 260, history: here.history });
  const notice = api.renderBackupNotice(loud);
  if (!notice.includes("只在這台裝置上")) throw new Error("backup notice did not render for a heavy user");
  if (!notice.includes("260")) throw new Error("backup notice should quote the real number");
  if (!notice.includes("清除瀏覽器資料就會全部消失")) {
    throw new Error("backup notice must be honest about what local storage means");
  }
  if (/undefined|NaN|\[object/.test(notice)) throw new Error("backup notice rendered a broken value");

  loud.backupNoticeSeen = true;
  if (api.renderBackupNotice(loud) !== "") throw new Error("backup notice must not nag once dismissed");

  console.log(
    `Import/backup smoke: ${here.attemptLog.length} + ${there.attemptLog.length} -> ${mergedIn.attemptLog.length} attempts merged`
  );
}

// ── 開局 Onboarding ──────────────────────────────────────────
// spec 的取得指標是「落地 → 首次完成訓練」。舊的第一屏給 5 個並列選項，
// 那是把決策成本丟給一個還不知道這站在幹嘛的人。
// 這一節守著三件事：每步只有一個主要動作、可以跳過、最後只有一個出口。
{
  api.setOnboardingStep("intro");
  const intro = api.renderOnboarding();
  if (!intro.includes("健身房")) throw new Error("onboarding intro did not render its positioning");
  if (!intro.includes("不需要註冊")) throw new Error("onboarding must say no signup is needed");
  const introPrimary = (intro.match(/home-primary/g) || []).length;
  if (introPrimary !== 1) throw new Error(`onboarding intro must have exactly one primary action, found ${introPrimary}`);

  api.setOnboardingStep("context");
  const ctx = api.renderOnboarding();
  api.onboardingContexts.forEach((entry) => {
    if (!ctx.includes(entry.label)) throw new Error(`onboarding is missing the "${entry.label}" option`);
    if (!(entry.cap >= 1 && entry.cap <= 6)) throw new Error(`${entry.key} has an invalid difficulty cap`);
  });
  if (ctx.includes("home-primary")) throw new Error("the context step should be a choice, not a CTA");

  const offer = api.renderOnboardingPlacementOffer(api.normalizeRecords({ onboardingContext: "freshman" }));
  if (!offer.includes("定位測驗")) throw new Error("placement offer did not render");
  if (!offer.includes("直接開始練")) throw new Error("placement must be skippable");
  if (!offer.includes("大一微積分")) throw new Error("placement offer should reflect the chosen context");
  if (/undefined|NaN|\[object/.test(offer)) throw new Error("placement offer rendered a broken value");

  // 定位測驗結束後只有一個出口：開始練。給「隨便逛逛」的話完成率就掉在這裡。
  const nextStep = api.renderPlacementNextStep();
  if (!nextStep.includes("start-planned")) throw new Error("placement result must lead straight into a session");
  if (!/開始第一份訓練 · \d+ 分鐘 \d+ 題/.test(nextStep)) {
    throw new Error("placement CTA should state the real length and count");
  }
  if ((nextStep.match(/home-primary/g) || []).length !== 1) {
    throw new Error("placement result must have exactly one primary action");
  }
  if (/undefined|NaN|\[object/.test(nextStep)) throw new Error("placement next step rendered a broken value");

  // 舊使用者不該再被丟進 onboarding
  const veteran = api.normalizeRecords({ totalAnswered: 300, onboardingSeen: true });
  if (!veteran.onboardingSeen) throw new Error("normalizeRecords lost onboardingSeen");

  api.setOnboardingStep("intro");
  console.log(`Onboarding smoke: 3 steps, ${api.onboardingContexts.length} contexts, single-exit verified`);
}

// ── 無障礙與鍵盤 ─────────────────────────────────────────────
// 一個在鍵盤上打數學的人，每次要按選項都得把手移到滑鼠 —— 那會直接毀掉
// 「練到反射」，因為反射的瓶頸變成手的移動而不是腦。
{
  const appSource = require("fs").readFileSync(require("path").join(__dirname, "..", "src", "app.js"), "utf8");
  const css = require("fs").readFileSync(require("path").join(__dirname, "..", "styles.css"), "utf8");

  // KaTeX 必須輸出 MathML，否則螢幕閱讀器讀到的是一串無意義字元
  const mathmlCalls = (appSource.match(/output:\s*"htmlAndMathml"/g) || []).length;
  const katexCalls = (appSource.match(/window\.katex\.render\(/g) || []).length;
  if (mathmlCalls < katexCalls) {
    throw new Error(`${katexCalls} 個 katex.render 但只有 ${mathmlCalls} 個輸出 MathML`);
  }
  if (!/\.katex \.katex-mathml/.test(css)) {
    throw new Error("MathML 必須視覺隱藏，否則會在畫面上重複出現一份數學");
  }

  // 焦點可見
  if (!/:focus-visible/.test(css)) throw new Error("沒有任何 :focus-visible 樣式");
  if (!/outline:\s*3px solid/.test(css)) throw new Error("focus 外框太細，鍵盤使用者看不到自己在哪");
  if (!/prefers-reduced-motion/.test(css)) throw new Error("沒有尊重「減少動態效果」的系統設定");

  // 計時器不能每秒被朗讀
  if (!/role="timer"[^>]*aria-live="off"/.test(appSource)) {
    throw new Error("倒數計時器必須 aria-live=off，否則螢幕閱讀器會每秒朗讀一次");
  }

  // 跳到主要內容
  if (!/skip-to-content/.test(appSource)) throw new Error("缺少「跳到主要內容」連結");
  if (!/id="buzz-main"/.test(appSource)) throw new Error("skip link 沒有對應的目標");

  // 鍵盤快捷鍵：輸入時不得攔截，否則打 h 會叫出提示
  if (!/function isTypingTarget/.test(appSource)) {
    throw new Error("鍵盤處理必須先判斷使用者是不是正在輸入");
  }
  if (!/document\.addEventListener\("keydown", handleShortcut\)/.test(appSource)) {
    throw new Error("keydown 監聽沒有掛上");
  }
  const shortcutBlock = (appSource.match(/const SHORTCUTS = \[([\s\S]*?)\];/) || [])[1] || "";
  const shortcutCount = (shortcutBlock.match(/keys:/g) || []).length;
  if (shortcutCount < 6) throw new Error(`快捷鍵表只有 ${shortcutCount} 項，太少`);
  ["Enter", "Esc", "H"].forEach((key) => {
    if (!shortcutBlock.includes(key)) throw new Error(`快捷鍵表缺少 ${key}`);
  });

  // 監考機制不准回來。
  //
  // 全螢幕鎖定與切頁判錯在 2026-08 整組移除。它們的問題不是實作不好，
  // 是立場錯了：假設使用者會作弊，然後誤傷接電話、被通知蓋掉、
  // 或只是想開計算機的人。這一條擋的是「哪天有人覺得加回去比較嚴謹」。
  // 掃之前先把註解拿掉：解釋「這東西為什麼被移除」的註解本身就會提到那些名字，
  // 不排除的話這條規則會被自己的說明文字絆倒。
  const appCode = appSource
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

  [
    ["requestQuizFullscreen", "全螢幕鎖定"],
    ["trackTabSwitch", "切頁次數追蹤"],
    ['reason: "Tab limit"', "切頁超過就判錯"],
    ["fullscreenStatus", "全螢幕狀態機"],
    ["quiz.tabSwitches", "切頁計數"]
  ].forEach(([needle, label]) => {
    if (appCode.includes(needle)) {
      throw new Error(`${label}（${needle}）回來了 —— 監考類的規則已經整組移除，見 docs/spec/00-north-star.md P4`);
    }
  });

  // 對話框要有焦點鎖。
  // 沒有的話 Tab 會走到被遮住的按鈕上（看不到焦點在哪），
  // 而「刪除全部資料」那個對話框後面就是那顆刪除鈕。
  if (!/function handleModalKeys\(/.test(appSource)) {
    throw new Error("對話框沒有焦點處理 —— Tab 會跑到後面被遮住的畫面上");
  }
  if (!/event\.key === "Escape"[\s\S]{0,400}cancel/.test(appSource)) {
    throw new Error("對話框沒有支援 Esc 關閉");
  }

  // 每一個 modal 都要有 role / aria-modal / 標題關聯，一個都不能漏
  // 只抓對話框本體。class="modal-backdrop" 是遮罩，不需要這些屬性 ——
  // 所以 "modal" 後面必須是引號或空格，不能是連字號。
  const modals = appSource.match(/<div class="modal(?: [^"]*)?"[^>]*>/g) || [];
  modals.forEach((tag) => {
    ["role=\"dialog\"", "aria-modal=\"true\"", "aria-labelledby="].forEach((needle) => {
      if (!tag.includes(needle)) {
        throw new Error(`有 modal 缺少 ${needle}：${tag.slice(0, 80)}`);
      }
    });
  });

  // 手寫計算紙：畫布本身對螢幕閱讀器是空的，至少要有標籤說明它是什麼
  if (!/data-blackboard[^>]*aria-label=/.test(appSource)) {
    throw new Error("手寫計算紙的 canvas 沒有 aria-label");
  }

  // 出卷的每個下拉都要有 label 包著（不是只有 placeholder）
  const paperFields = (appSource.match(/<label class="paper-field[\s\S]{0,400}?<\/label>/g) || []);
  if (paperFields.length < 4) throw new Error(`出卷的欄位只有 ${paperFields.length} 個被 label 包住`);

  console.log(
    `A11y smoke: ${katexCalls} 個 katex.render 全輸出 MathML, ${shortcutCount} 組快捷鍵, ${modals.length} 個對話框有焦點鎖與 aria, focus-visible 已就位`
  );
}

// ── 能力模型快取 ─────────────────────────────────────────────
// 首頁一次 render 會問兩次 profile（今天的訓練 + 成長證據），數據頁更多。
// 快取沒問題是省時間，快取失效沒做對就是**顯示過期的能力數字** —— 後者嚴重得多。
{
  const pool = global.window.BUZZ_PROBLEMS.filter(
    (p) => global.window.BuzzSkillGraph.skillsForProblem(p).length
  );
  const mk = (sessions) => {
    const history = [];
    for (let i = 0; i < sessions; i += 1) {
      history.push({
        id: "cache-" + i,
        mode: "quick",
        finishedAt: new Date(Date.now() - (sessions - i) * 3600000).toISOString(),
        answers: pool.slice(i * 10, i * 10 + 10).map((p) => ({
          problemId: p.id, correct: true, elapsed: 30, hintsUsed: 0
        }))
      });
    }
    return api.normalizeRecords({ history, totalAnswered: sessions * 10 });
  };

  const a = mk(4);
  const first = api.abilityProfile(a);
  const second = api.abilityProfile(a);
  if (first !== second) throw new Error("同一份紀錄應該重用快取，而不是重算");

  // 多練一場 → 指紋必須變 → 拿到新的 profile
  const b = mk(6);
  const third = api.abilityProfile(b);
  if (third === first) throw new Error("紀錄變了卻拿到舊的 profile —— 使用者會看到過期的能力數字");
  if (third.coverage.attempts <= first.coverage.attempts) {
    throw new Error("新 profile 沒有反映多出來的作答");
  }

  // 只改信心自評也要讓快取失效（它會影響 dangerous 清單）
  const c = JSON.parse(JSON.stringify(b));
  c.conf = { [pool[0].id]: { level: "sure", correct: false, at: "x" } };
  if (api.abilityProfile(c) === third) {
    throw new Error("信心自評改了卻沒讓快取失效");
  }

  console.log("Ability cache smoke: 重用與失效都正確");
}


// ── 難度校準包：隱私是可測的，不是宣稱的 ────────────────────
// 這段測的不是「功能會不會動」，是「檔案裡有沒有多出不該有的東西」。
// 這種保證只能靠測試釘住 —— 以後有人為了 debug 想「順便帶個題目 id」，
// 這裡就會紅。
{
  const pool = (global.window.BUZZ_PROBLEMS || []).slice();
  const sample = pool.slice(0, 25);
  const records = {
    problemStats: {},
    attemptLog: [],
    history: []
  };
  sample.forEach((problem, index) => {
    records.problemStats[problem.id] = { correct: index % 3 ? 2 : 0, wrong: index % 3 ? 1 : 2, total: 3 };
    records.attemptLog.push({ id: problem.id, sec: 20 + index, correct: index % 2 === 0 });
  });
  // 自訂題：只有這個人有，題號本身就是識別資訊，一定不能出現在校準包裡
  records.problemStats["custom-private-001"] = { correct: 5, wrong: 0, total: 5 };

  // 這個 harness 的 localStorage 是硬寫死回 "{}" 的假物件，
  // 所以要像其他測試一樣暫時換掉 getItem，而不是 setItem。
  const originalGetItem = global.localStorage.getItem;
  global.localStorage.getItem = () => JSON.stringify(records);
  let pack;
  try {
    pack = api.buildCalibrationPack();
  } finally {
    global.localStorage.getItem = originalGetItem;
  }

  if (!pack.rows.length) throw new Error("校準包是空的");
  const ALLOWED_ROW_KEYS = new Set(["uid", "rank", "n", "correct", "sec"]);
  pack.rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!ALLOWED_ROW_KEYS.has(key)) {
        throw new Error(`校準包多帶了欄位 "${key}" —— 只能有 uid / rank / n / correct / sec`);
      }
    });
    if (!/^bz-c-\d{6}$/.test(row.uid)) throw new Error(`校準包裡出現非永久題號：${row.uid}`);
  });

  const serialized = JSON.stringify(pack);
  // 題幹、內部 id、時間戳記一律不得出現
  sample.forEach((problem) => {
    if (serialized.includes(problem.id)) {
      throw new Error(`校準包洩漏了內部 id ${problem.id}（應該只有 uid）`);
    }
    if (problem.prompt && serialized.includes(problem.prompt)) {
      throw new Error("校準包洩漏了題幹");
    }
  });
  if (serialized.includes("custom-private-001")) {
    throw new Error("校準包含有自訂題 —— 自訂題只有這個人有，題號就是識別資訊");
  }
  if (/\d{4}-\d{2}-\d{2}T/.test(serialized)) {
    throw new Error("校準包含有時間戳記 —— 作答時間可以用來認人");
  }
  if (!["high", "mid", "low", "unknown"].includes(pack.masteryBand)) {
    throw new Error("masteryBand 不合法：" + pack.masteryBand);
  }

  console.log(`校準包 smoke: ${pack.rows.length} 筆，欄位與去識別化都通過，自訂題已排除`);
}

// ── 作圖表題與選圖題的作答介面 ──────────────────────────────
//
// 這兩個題型的失敗方式是「整張表／四張圖根本沒出來」——
// 那用字串比對抓得到，而且抓不到的話上線就是一個空白的作答區。
{
  const all = global.window.BUZZ_PROBLEMS || [];

  const worksheet = all.find((p) => p.answerKind === "worksheet");
  if (worksheet) {
    api.setQuiz({
      problems: [worksheet], index: 0, draft: "", answers: [], feedback: null,
      startedAt: 1, boardStrokes: {}, worksheet: {}, choiceOptions: {}, hintsUsed: {}, boardTool: "pen"
    });
    const html = api.renderWorksheetControls(worksheet);
    const rows = (html.match(/data-ws-field=/g) || []).length;
    if (rows !== worksheet.fields.length) {
      throw new Error(`作圖表 ${worksheet.id} 只 render 出 ${rows} 格，應該有 ${worksheet.fields.length} 格`);
    }
    if (!/data-blackboard|scratchboard/.test(html)) {
      throw new Error("作圖表沒有附計算紙 —— 最後那一步是手繪，沒有紙就做不到");
    }

    // 判分的來回：全對要對，改壞一格要錯，而且要指出是哪一格
    const right = worksheet.fields.map((f) => `${f.key}=${f.answer}`).join("; ");
    const ok = api.checkWorksheet(worksheet, right);
    if (!ok.correct) throw new Error(`作圖表的參考答案自己判不過：${ok.message}`);
    const broken = worksheet.fields
      .map((f, i) => `${f.key}=${i === 0 ? "(0, 1)" : f.answer}`)
      .join("; ");
    const bad = api.checkWorksheet(worksheet, broken);
    if (bad.correct) throw new Error("改壞一格之後還是判對 —— 作圖表必須全對才算對");
    if (!bad.message.includes(worksheet.fields[0].label)) {
      throw new Error(`錯誤訊息沒有指出是哪一格：${bad.message}`);
    }
    const kinds = [...new Set(all.map((p) => p.answerKind))];
    const missing = kinds.filter((kind) => !api.answerKindLabel || !api.answerKindLabel(kind));
    if (api.answerKindLabel && missing.length) {
      throw new Error(`這些 answerKind 沒有中文標籤，題目上會印出 undefined：${missing.join(", ")}`);
    }

    console.log(`作圖表 smoke: ${rows} 格 + 計算紙，全對判對、改壞一格判錯並指出「${worksheet.fields[0].label}」`);
  }

  const graph = all.find((p) => p.answerKind === "graph");
  if (graph) {
    api.setQuiz({
      problems: [graph], index: 0, draft: "", answers: [], feedback: null,
      startedAt: 1, choiceOptions: {}, hintsUsed: {}
    });
    const html = api.renderGraphChoiceControls(graph);
    const svgs = (html.match(/<svg/g) || []).length;
    if (svgs !== graph.graphChoices.length) {
      throw new Error(`選圖題 ${graph.id} 只畫出 ${svgs} 張圖，應該有 ${graph.graphChoices.length} 張`);
    }
    if (!api.checkAnswer(graph, graph.answer).correct) {
      throw new Error(`選圖題 ${graph.id} 的正解自己判不過`);
    }
    const wrong = graph.graphChoices.find((c) => !c.correct);
    const verdict = api.checkAnswer(graph, wrong.expr);
    if (verdict.correct) throw new Error("選圖題的誘答被判成對的");
    if (verdict.message !== wrong.why) {
      throw new Error(`答錯時沒有回傳那個誘答的理由：${verdict.message}`);
    }
    console.log(`選圖 smoke: ${svgs} 張圖，正解判對、誘答判錯並回傳它的理由`);
  }
}
