// 理科秒殺包（physics / chemistry）是選修內容：主站的微積分流程不能抽到它們。
// 這支驗證器把那條界線鎖住——快速訓練、每日挑戰、每日一題、每週卷、大考模式、
// 定位測驗、收操與主線路徑都必須是純微積分；只有選了物理 / 化學題型或理科訓練包
// 才抽得到理科題。
const fakeApp = {
  innerHTML: "",
  querySelectorAll: () => [],
  querySelector: () => null,
  matches: () => false
};

global.window = {
  __BUZZ_TEST_HOOKS__: {},
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
  innerHeight: 720
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || "{}",
  setItem: (key, value) => {
    storage[key] = String(value);
  },
  removeItem: (key) => {
    delete storage[key];
  }
};
global.document = {
  getElementById: (id) => (id === "app" ? fakeApp : null),
  addEventListener: () => {},
  visibilityState: "visible",
  body: { appendChild: () => {} },
  createElement: () => ({ click: () => {}, remove: () => {} })
};
global.Blob = function Blob() {};
global.URL = {
  createObjectURL: () => "blob:science-gate",
  revokeObjectURL: () => {}
};
global.FileReader = function FileReader() {};

require("./lib/load_problem_sources.js")();
require("../src/app.js");

const api = global.window.__BUZZ_TEST_HOOKS__.api;
if (!api || typeof api.isScienceProblem !== "function" || typeof api.setSelectedPack !== "function") {
  throw new Error("science gate test hooks are unavailable");
}

const problems = global.window.BUZZ_PROBLEMS || [];
const science = problems.filter(api.isScienceProblem);
const failures = [];

if (!science.length) failures.push("no science problems loaded — is problem_science_pack.js wired into index.html?");

science.forEach((problem) => {
  const tags = problem.tags || [];
  if (!tags.includes("science-flash")) failures.push(`${problem.id} is missing the science-flash tag`);
  // 數值題可以沿用題庫的誘答；分類（背誦）題必須自己帶 distractors，
  // 否則選擇題會塞進「收斂 / 發散」這種微積分選項。
  if (problem.answerKind === "text") {
    const distractors = problem.distractors || [];
    if (distractors.length < 2) failures.push(`${problem.id} is a text problem with fewer than 2 authored distractors`);
    (problem.answers || []).forEach((answer) => {
      if (distractors.some((value) => String(value).trim() === String(answer).trim())) {
        failures.push(`${problem.id} lists "${answer}" as both an accepted answer and a distractor`);
      }
    });
  } else if (problem.answerKind !== "numeric") {
    failures.push(`${problem.id} must be numeric or an authored-distractor text problem`);
  }
  if (api.problemRank(problem) >= 5) failures.push(`${problem.id} is R5+, which would leak into boss packs`);
  if (!/^(ph|ch)-/.test(problem.id)) failures.push(`${problem.id} does not use the ph-/ch- id prefix`);
});

function reportLeak(label, list) {
  const leaked = (list || []).filter(api.isScienceProblem);
  if (leaked.length) failures.push(`${label} leaked science problems: ${leaked.map((problem) => problem.id).join(", ")}`);
}

// 純微積分的流程
api.setSelectedPack("all");
["quick", "daily", "brutal", "boss", "boss_rush", "rival", "exam", "survival", "warmup", "integral_bee"].forEach((modeKey) => {
  reportLeak(`mode ${modeKey}`, api.selectProblemPool(api.modes[modeKey], "all"));
});
reportLeak("daily_one", [api.pickDailyOneProblem("2026-07-31")]);
reportLeak("weekly paper", api.buildWeeklyChallengePaper("2026-W31"));
reportLeak("cooldown", api.selectCooldownPool(api.modes.cooldown.count));
for (let rank = 1; rank <= 6; rank += 1) {
  reportLeak(`placement R${rank}`, api.placementRankPools({ history: [], problemStats: {}, mistakes: {} })[rank]);
}
api.pathNodes.forEach((node) => reportLeak(`path node ${node.id}`, api.pathNodeProblems(node)));
Object.keys(api.namedExams || {}).forEach((key) => {
  reportLeak(`named exam ${key}`, api.namedExamProblems(api.namedExams[key]));
});

// 明確選了理科：一定抽得到，而且只抽到該科
const physicsPool = api.selectProblemPool(api.modes.topic, "physics");
if (!physicsPool.length || physicsPool.some((problem) => problem.topic !== "physics")) {
  failures.push(`topic mode "physics" should return physics-only problems, got ${physicsPool.length}`);
}
const chemistryPool = api.selectProblemPool(api.modes.topic, "chemistry");
if (!chemistryPool.length || chemistryPool.some((problem) => problem.topic !== "chemistry")) {
  failures.push(`topic mode "chemistry" should return chemistry-only problems, got ${chemistryPool.length}`);
}
["science_flash", "physics_flash", "chemistry_flash", "rotation_thermo", "chem_memory"].forEach((packKey) => {
  api.setSelectedPack(packKey);
  const pool = api.selectProblemPool(api.modes.quick, "all");
  if (!pool.length || pool.some((problem) => !api.isScienceProblem(problem))) {
    failures.push(`pack ${packKey} should return science problems only, got ${pool.map((problem) => problem.id).join(", ")}`);
  }
});
api.setSelectedPack("all");

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

const physicsCount = science.filter((problem) => problem.topic === "physics").length;
console.log(
  `Science gate holds: ${science.length} flash problems (物理 ${physicsCount} / 化學 ${science.length - physicsCount}) stay out of every calculus flow`
);
