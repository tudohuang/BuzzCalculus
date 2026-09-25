// ε-δ 挑戰的把關（2026-09-25）。
//
// 這個題型會用兩種方式壞掉，而且都不會讓別的驗證器變紅：
//
//   1. **關卡無解**：ε 訂得太小而 maxDelta 的滑桿上限不夠細，或者函數在 x₀
//      附近根本不收斂 —— 使用者拖到底都過不了關，畫面上只會一直說「還不行」。
//      這比答錯更糟：他會以為是程式壞了，而他是對的。
//   2. **窗看不到重點**：水平帶 L±ε 或垂直帶 x₀±δ 落在畫面外，
//      那張圖就等於沒畫 —— 這個題型的全部價值就在「看見自己在做什麼」。
//
// 所以逐題檢查：每一關都算得出一個正的 δ、滑桿的刻度夠細、參考答案就是
// 最嚴那一關的最大 δ、以及窗框住該框住的東西。
//
// 用法：node tools/validate_epsilon_game.js

"use strict";

const appApi = require("./lib/app_api.js");

const api = appApi();
const problems = appApi.allProblems().filter((problem) => problem.answerKind === "epsilon");
const game = global.window.BuzzEpsilonGame;

const failures = [];
const fail = (id, message) => failures.push(`${id}: ${message}`);

if (!game) {
  console.error("BuzzEpsilonGame 沒有載進來 —— share_cards.js 的元件掛了");
  process.exit(1);
}

let levelCount = 0;

problems.forEach((problem) => {
  const id = problem.id;
  const spec = problem.epsilon;
  if (!spec || typeof spec !== "object") { fail(id, "缺 epsilon 設定"); return; }
  const levels = spec.levels;
  if (!Array.isArray(levels) || levels.length < 2) {
    fail(id, `levels 只有 ${Array.isArray(levels) ? levels.length : 0} 關 —— 至少兩關才看得出「ε 縮小」`);
    return;
  }
  for (let i = 1; i < levels.length; i += 1) {
    if (!(Number(levels[i]) < Number(levels[i - 1]))) {
      fail(id, `第 ${i + 1} 關的 ε=${levels[i]} 沒有比前一關小 —— 這個題型的重點就是一關比一關嚴`);
      return;
    }
  }
  const maxDelta = Number(spec.maxDelta);
  if (!(maxDelta > 0)) { fail(id, "maxDelta（滑桿上限）要是正數"); return; }

  // 1. 每一關都要有解，而且解不能貼在滑桿的刻度下面
  const step = maxDelta / 200;
  const bestByLevel = levels.map((eps) => game.maxDelta(spec, Number(eps)));
  bestByLevel.forEach((best, index) => {
    levelCount += 1;
    if (!(best > 0)) {
      fail(id, `第 ${index + 1} 關（ε=${levels[index]}）找不到任何可用的 δ —— 使用者拖到底也過不了`);
      return;
    }
    if (best < step * 3) {
      fail(
        id,
        `第 ${index + 1} 關（ε=${levels[index]}）的最大 δ 只有 ${best.toExponential(2)}，` +
        `而滑桿的刻度是 ${step.toExponential(2)} —— 拖不到那麼細，把 maxDelta 調小`
      );
    }
  });

  // 2. 參考答案要等於最嚴那一關的最大 δ（那是這題「正解」的意思）
  const hardest = bestByLevel[bestByLevel.length - 1];
  const claimed = Number(api.normalizeExpression ? api.normalizeExpression(problem.answer) : problem.answer);
  const stated = Number.isFinite(claimed) ? claimed : Number(problem.answer);
  if (!Number.isFinite(stated)) {
    fail(id, `answer 讀不出一個數（${problem.answer}）—— 參考答案是最嚴那一關的最大 δ`);
  } else if (Math.abs(stated - hardest) > 0.02 * Math.max(1e-6, hardest)) {
    fail(id, `answer 寫 ${problem.answer}，但最嚴那一關的最大 δ 獨立算出來是 ${hardest.toPrecision(6)}`);
  }

  // 3. 標準作答（solve）必須真的過關 —— 判分器與遊戲畫面共用同一條路
  const run = game.solve(problem);
  const graded = game.check(problem, run);
  if (!graded.correct) fail(id, `照 solve() 玩一遍卻沒過關：${graded.message}`);

  // 4. 窗要框得住水平帶與垂直帶
  const win = (problem.graph || {}).window;
  if (!Array.isArray(win) || win.length !== 4) { fail(id, "graph.window 要寫成 [xmin, xmax, ymin, ymax]"); return; }
  const [xmin, xmax, ymin, ymax] = win.map(Number);
  const at = Number(spec.at);
  const limit = Number(spec.limit);
  const firstEps = Number(levels[0]);
  if (!(at > xmin && at < xmax)) fail(id, `x₀=${at} 不在窗內`);
  if (!(limit > ymin && limit < ymax)) fail(id, `L=${limit} 不在窗內`);
  if (limit + firstEps > ymax || limit - firstEps < ymin) {
    fail(id, `第一關的水平帶 L±${firstEps} 超出窗（${ymin}, ${ymax}）—— 使用者看不到自己要落進去的那一條帶`);
  }
  if (at + bestByLevel[0] > xmax || at - bestByLevel[0] < xmin) {
    fail(id, "第一關的可用 δ 寬到超出窗 —— 垂直帶會被裁掉");
  }
});

console.log("ε-δ 挑戰");
console.log(`  題數        ${problems.length}`);
console.log(`  關卡        ${levelCount} 關，每一關都算得出可用的 δ`);

if (failures.length) {
  console.error("");
  console.error(`ε-δ 挑戰驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("epsilon game OK");
