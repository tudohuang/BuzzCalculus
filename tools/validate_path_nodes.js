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
  createObjectURL: () => "blob:path",
  revokeObjectURL: () => {}
};
global.FileReader = function FileReader() {};

require("./lib/load_problem_sources.js")();
require("../src/app.js");

const api = window.__BUZZ_TEST_HOOKS__ && window.__BUZZ_TEST_HOOKS__.api;
if (!api || !api.pathNodes || !api.pathNodeProblems) {
  throw new Error("path test hooks are unavailable");
}

let failed = false;
api.pathNodes.forEach((node) => {
  const count = api.pathNodeProblems(node).length;
  console.log(`${node.id}: ${count} problems`);
  if (!count) failed = true;
});

if (failed) {
  throw new Error("one or more path nodes have zero problems");
}
