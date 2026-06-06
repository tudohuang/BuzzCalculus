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
  createObjectURL: () => "blob:training-packs",
  revokeObjectURL: () => {}
};
global.FileReader = function FileReader() {};

require("../src/problems.js");
require("../src/problem_extensions.js");
require("../src/problem_extensions_2.js");
require("../src/problem_integrals_hard.js");
require("../src/problem_advanced_analysis.js");
require("../src/problem_gap_pack.js");
require("../src/problem_mobile_advanced_pack.js");
require("../src/problem_difficulty_calibration.js");
require("../src/app.js");

const api = global.window.__BUZZ_TEST_HOOKS__.api;
if (!api || !api.trainingPacks || !api.packGroups || typeof api.packTotalCountText !== "function") {
  throw new Error("training pack test hooks are unavailable");
}

const knownKeys = new Set(Object.keys(api.trainingPacks));
const groupedKeys = new Set();
const failures = [];

api.packGroups.forEach((group) => {
  if (!group.label || !Array.isArray(group.keys)) {
    failures.push(`Invalid pack group: ${JSON.stringify(group)}`);
    return;
  }

  group.keys.forEach((key) => {
    if (!knownKeys.has(key)) failures.push(`Missing training pack referenced by group "${group.label}": ${key}`);
    if (groupedKeys.has(key)) failures.push(`Duplicate training pack in groups: ${key}`);
    groupedKeys.add(key);
  });
});

knownKeys.forEach((key) => {
  const pack = api.trainingPacks[key];
  const count = Number(api.packTotalCountText(key));
  if (!Number.isFinite(count)) failures.push(`Pack "${key}" produced non-numeric count`);
  if (count <= 0) failures.push(`Pack "${key}" has no matching problems`);
  if (!pack.label || !pack.note || !Array.isArray(pack.tags)) failures.push(`Pack "${key}" is missing label, note, or tags`);
});

const ungrouped = [...knownKeys].filter((key) => !groupedKeys.has(key));
if (ungrouped.length) failures.push(`Ungrouped training packs: ${ungrouped.join(", ")}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}

api.packGroups.forEach((group) => {
  console.log(`[${group.label}]`);
  group.keys.forEach((key) => {
    const pack = api.trainingPacks[key];
    console.log(`  ${pack.label}: ${api.packTotalCountText(key)} problems`);
  });
});

console.log(`\nValidated ${knownKeys.size} training packs`);
