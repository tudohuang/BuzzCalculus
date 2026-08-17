// 黃金檔測試：釘住「重跑產生器之後，結果應該一模一樣」
//
// 這個題庫有六支產生器（skill_tags、uid、rubric、origin、templates、recalibrate），
// 而它們的輸出會互相影響。實際踩過的坑：
//
//   - recalibrate_rubric 把 rank 寫進 rubric.js，下一次執行讀到的
//     「作者原判」就變成自己上一輪的輸出，難度會一輪一輪往下漂。
//   - skill graph 的一個 obscurity 數字改掉，全庫 1400 題的難度跟著動。
//
// 這種漂移不會讓任何驗證器變紅 —— 每一輪的結果都是「自洽」的，
// 只是跟上一輪不一樣。只有黃金檔擋得住。
//
// 釘兩件事：
//   1. 難度分佈（六個數字）
//   2. 一組錨點題目的 rank 與三軸 —— 涵蓋六個等級，並包含所有人工複核過的題
//
// 更新方式：確認變動是你要的之後，跑 node tools/validate_golden.js --update
// 並在 commit message 裡說明為什麼。

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");

const update = process.argv.includes("--update");
const api = loadAppApi();
const problems = loadAppApi.allProblems();
const rubric = global.window.BuzzRubric;
const reviewed = require(path.join(__dirname, "..", "src", "kernel", "rubric_reviewed.js"));

const GOLDEN = path.join(__dirname, "golden", "difficulty.json");

/* ── 目前狀態 ─────────────────────────────────────────────── */

const distribution = {};
problems.forEach((problem) => {
  distribution[problem.rank] = (distribution[problem.rank] || 0) + 1;
});

// 錨點的清單來自黃金檔，不是每次重新挑。
//
// 一開始寫成「每個 rank 各挑幾題」，結果錨點是**跟著現在的難度**選出來的：
// 難度一動，被挑中的題目就換了一批，比對時看起來像「錨點題不見了」，
// 而真正的變化（某一題的 rank 變了）反而看不到。
// 錨點的意義就是固定不動，所以它必須存在檔案裡。
const anchorIds = new Set(Object.keys(reviewed));
if (!update && fs.existsSync(GOLDEN)) {
  Object.keys(JSON.parse(fs.readFileSync(GOLDEN, "utf8")).anchors || {}).forEach((id) => anchorIds.add(id));
} else {
  [1, 2, 3, 4, 5, 6].forEach((rank) => {
    problems
      .filter((problem) => problem.rank === rank)
      .map((problem) => problem.id)
      .sort()
      .filter((_, index) => index % 18 === 0)
      .slice(0, 12)
      .forEach((id) => anchorIds.add(id));
  });
}

const anchors = {};
[...anchorIds].sort().forEach((id) => {
  const problem = problems.find((item) => item.id === id);
  if (!problem) return;
  const axes = rubric.axesFor(id);
  anchors[id] = {
    rank: problem.rank,
    axes: axes ? [axes.steps, axes.obscurity, axes.load] : null,
    reviewed: rubric.isReviewed(id)
  };
});

/* ── kernel 輸出快照 ──────────────────────────────────────── */

// 能力模型、判分器、SRS 的輸出也要釘住。
//
// 難度那半段擋的是「題庫的數字漂掉」，這半段擋的是「演算法的行為漂掉」。
// 兩者都不會讓其他驗證器變紅：能力模型算出來的精熟度從 62 變成 71，
// 每一支驗證器都還是綠的，但使用者看到的雷達圖已經不一樣了。
//
// 所有輸入都是固定的，而且 profile 的 now 是參數不是 Date.now()，
// 所以整份快照完全可重現。
const FIXED_NOW = Date.parse("2026-06-01T00:00:00Z");

function kernelSnapshot() {
  const snapshot = {};

  // ── 能力模型 ──
  // 固定的作答紀錄：挑技巧明確的題，讓 mastery 有東西可算
  const picks = problems
    .filter((problem) => (problem.tags || []).includes("integration-by-parts"))
    .slice(0, 10);
  const records = {
    // 用 history 當輸入而不是直接塞 attemptLog：attemptLog 是打包過的 tuple，
    // 手寫容易寫錯格式而測到一片空白。history 是使用者資料真正的來源，
    // 讓 normalizeRecords 自己去遷移，測到的路徑也才跟實際一致。
    history: picks.map((problem, index) => ({
      id: `golden-${index}`,
      mode: "quick",
      finishedAt: new Date(FIXED_NOW - (index + 1) * 86400000).toISOString(),
      answers: [{ problemId: problem.id, correct: index % 3 !== 0, elapsed: 30 + index * 5, hintsUsed: 0 }]
    }))
  };
  const migrated = api.normalizeRecords(JSON.parse(JSON.stringify(records)));
  if (global.window.BuzzAbility && global.window.BuzzSkillGraph) {
    const value = global.window.BuzzAbility.profile(migrated, { now: FIXED_NOW });
    const skillEntries = Object.keys(value.skills || {}).sort();
    snapshot.ability = {
      overallMastery: value.overall ? value.overall.mastery : null,
      overallN: value.overall ? value.overall.n : 0,
      skillCount: skillEntries.length,
      // 只取前三個技巧，而且四捨五入到整數：小數點後的浮動不是「行為漂移」
      skills: skillEntries.slice(0, 3).map((id) => {
        const entry = value.skills[id];
        return `${id}:${entry.mastery === null ? "null" : Math.round(entry.mastery)}:n${entry.n}`;
      }),
      scoredAxes: (value.axes || []).filter((axis) => axis.score !== null).length
    };
  }

  // ── 判分器 ──
  // 每一組都是曾經出過問題、或代表一整類語意的案例
  const CHECKS = [
    [{ answerKind: "numeric", answer: "1/2" }, "0.5", true],
    [{ answerKind: "numeric", answer: "pi/4" }, "PI/4", true],
    [{ answerKind: "numeric", answer: "1/2" }, "1/3", false],
    [{ answerKind: "expression", answer: "2*x", variable: "x" }, "x+x", true],
    [{ answerKind: "expression", answer: "x", variable: "x" }, "sqrt(x^2)", false],
    [{ answerKind: "antiderivative", answer: "x^2", variable: "x" }, "x^2+5", true],
    [{ answerKind: "antiderivative", answer: "x^2", variable: "x" }, "x^3", false],
    [{ answerKind: "text", answers: ["收斂", "converges"], canonical: "收斂" }, "converges", true],
    [{ answerKind: "set", answer: "{-1, 3}" }, "{3, -1}", true],
    [{ answerKind: "set", answer: "{-1, 3}" }, "{3}", false],
    [{ answerKind: "interval", answer: "[0, 1)" }, "[0,1)", true],
    [{ answerKind: "interval", answer: "[0, 1)" }, "[0,1]", false]
  ];
  snapshot.checker = CHECKS.map(([problem, input, expected], index) => {
    const got = api.checkAnswer(problem, input).correct;
    return `${index}:${got === expected ? "ok" : "DRIFT(" + got + ")"}`;
  });

  // ── SRS ──
  // 三種到期狀態各釘一個：已到期 / 一週內 / 已排程。
  // SRS 的間隔算錯不會有任何東西變紅，但錯題會在錯的時間跳出來，
  // 而那正是間隔重複這個功能的全部價值所在。
  if (api.mistakeSrs && api.mistakeDueStatus) {
    const cases = [
      ["overdue", { srs: { interval: 3, dueAt: FIXED_NOW - 86400000 } }],
      ["soon", { srs: { interval: 3, dueAt: FIXED_NOW + 3 * 86400000 } }],
      ["scheduled", { srs: { interval: 21, dueAt: FIXED_NOW + 30 * 86400000 } }],
      ["never-answered", {}]
    ];
    snapshot.srs = cases.map(([label, item]) => {
      const status = api.mistakeDueStatus(item, FIXED_NOW);
      return `${label}:${status.due ? "due" : status.days + "d"}:${status.label}`;
    });
  }

  // ── 手寫筆跡 ──
  // board_render 是從 app.js 拆出來的第二塊 kernel。拆分的承諾是
  // 「行為完全不變」，而筆跡的行為沒有任何斷言看得到 ——
  // 線變粗一點、壓感曲線改一點，什麼都不會紅，但寫起來就是不一樣了。
  //
  // 這裡不畫真的畫布（Node 沒有 canvas），改成錄下**繪圖指令**：
  // 用一個假的 ctx 把每一次 lineWidth / moveTo / quadraticCurveTo 記下來。
  // 指令序列變了，就是筆跡變了。
  const render = global.window.BuzzBoardRender;
  if (render) {
    const ops = [];
    const fakeCtx = {
      save: () => ops.push("save"),
      restore: () => ops.push("restore"),
      beginPath: () => ops.push("begin"),
      moveTo: (x, y) => ops.push(`move ${x.toFixed(2)},${y.toFixed(2)}`),
      lineTo: (x, y) => ops.push(`line ${x.toFixed(2)},${y.toFixed(2)}`),
      quadraticCurveTo: (cx, cy, x, y) =>
        ops.push(`quad ${cx.toFixed(2)},${cy.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`),
      arc: (x, y, r) => ops.push(`arc ${x.toFixed(2)},${y.toFixed(2)} r${r.toFixed(2)}`),
      fill: () => ops.push("fill"),
      stroke: () => ops.push("stroke"),
      clearRect: () => ops.push("clear"),
      set lineWidth(value) { ops.push(`w${Number(value).toFixed(2)}`); },
      get lineWidth() { return 1; },
      set strokeStyle(value) { ops.push(`ink ${value}`); },
      get strokeStyle() { return ""; },
      set fillStyle(value) { void value; },
      get fillStyle() { return ""; },
      set globalCompositeOperation(value) { ops.push(`mode ${value}`); },
      get globalCompositeOperation() { return "source-over"; },
      set lineCap(value) { void value; },
      get lineCap() { return "round"; },
      set lineJoin(value) { void value; },
      get lineJoin() { return "round"; }
    };
    const canvas = { width: 400, height: 200 };
    const strokes = [
      {
        tool: "pen",
        points: [
          { x: 0.1, y: 0.2, pressure: 0.3 },
          { x: 0.3, y: 0.4, pressure: 0.6 },
          { x: 0.5, y: 0.3, pressure: 0.9 },
          { x: 0.7, y: 0.5, pressure: 0.5 }
        ]
      },
      { tool: "eraser", points: [{ x: 0.2, y: 0.2, pressure: 0.5 }, { x: 0.8, y: 0.2, pressure: 0.5 }] },
      { tool: "pen", points: [{ x: 0.5, y: 0.5, pressure: 0.7 }] }
    ];
    render.paintAll(canvas, fakeCtx, strokes, { ratio: 2, surface: "paper" });
    snapshot.board = {
      opCount: ops.length,
      // 前 14 個指令就足以釘住寬度、顏色、合成模式與曲線控制點
      head: ops.slice(0, 14),
      eraserMode: ops.includes("mode destination-out"),
      ink: ops.find((op) => op.startsWith("ink ")) || ""
    };
  }

  return snapshot;
}

const current = { total: problems.length, distribution, anchors, kernel: kernelSnapshot() };

/* ── 更新模式 ─────────────────────────────────────────────── */

if (update) {
  fs.mkdirSync(path.dirname(GOLDEN), { recursive: true });
  fs.writeFileSync(GOLDEN, JSON.stringify(current, null, 2) + "\n", "utf8");
  console.log(`黃金檔已更新：${problems.length} 題，${Object.keys(anchors).length} 個錨點`);
  console.log("記得在 commit message 裡寫清楚為什麼難度會變。");
  process.exit(0);
}

if (!fs.existsSync(GOLDEN)) {
  console.error("找不到黃金檔。第一次建立請跑：node tools/validate_golden.js --update");
  process.exit(1);
}

/* ── 比對 ─────────────────────────────────────────────────── */

const golden = JSON.parse(fs.readFileSync(GOLDEN, "utf8"));
const failures = [];
const fail = (message) => failures.push(message);

if (golden.total !== current.total) {
  // 題數變了是正常的（新增題包），但要講出來，因為分佈一定會跟著動
  console.log(`  題數 ${golden.total} → ${current.total}（差 ${current.total - golden.total}）`);
}

[1, 2, 3, 4, 5, 6].forEach((rank) => {
  const before = golden.distribution[rank] || 0;
  const after = current.distribution[rank] || 0;
  if (before === after) return;
  // 只有新增題目能解釋的變動就放過；超過的部分代表既有題目被重新分級
  const added = Math.max(0, current.total - golden.total);
  if (Math.abs(after - before) > added) {
    fail(`R${rank} 從 ${before} 變成 ${after}，超出新增 ${added} 題可以解釋的範圍`);
  }
});

// kernel 快照逐欄比對
if (golden.kernel) {
  const before = JSON.stringify(golden.kernel);
  const after = JSON.stringify(current.kernel);
  if (before !== after) {
    fail("kernel 輸出跟黃金檔不同：");
    Object.keys(golden.kernel).forEach((key) => {
      const a = JSON.stringify(golden.kernel[key]);
      const b = JSON.stringify(current.kernel[key]);
      if (a !== b) fail(`  ${key}\n      黃金檔 ${a}\n      現在   ${b}`);
    });
  }
}

let anchorDrift = 0;
Object.keys(golden.anchors).forEach((id) => {
  const before = golden.anchors[id];
  const after = current.anchors[id];
  if (!after) {
    fail(`錨點題 ${id} 不見了（題目被移除？黃金檔要一起更新）`);
    return;
  }
  if (before.rank !== after.rank) {
    anchorDrift += 1;
    if (anchorDrift <= 8) {
      fail(`${id}：R${before.rank} → R${after.rank}（三軸 ${JSON.stringify(before.axes)} → ${JSON.stringify(after.axes)}）`);
    }
  }
  if (before.reviewed && !after.reviewed) {
    fail(`${id} 原本是人工複核過的，現在不是了 —— 人工判斷不該被產生器洗掉`);
  }
});
if (anchorDrift > 8) fail(`…另有 ${anchorDrift - 8} 個錨點題的 rank 變了`);

console.log("難度黃金檔");
console.log(`  題數      ${current.total}`);
console.log(`  分佈      ${[1, 2, 3, 4, 5, 6].map((r) => "R" + r + ":" + (current.distribution[r] || 0)).join("  ")}`);
console.log(`  錨點      ${Object.keys(current.anchors).length} 題（人工複核 ${Object.keys(reviewed).length}）`);
console.log(`  kernel    能力模型 mastery=${current.kernel.ability ? current.kernel.ability.overallMastery : "n/a"}、判分器 ${current.kernel.checker.length} 案例、SRS ${(current.kernel.srs||[]).length} 種狀態`);

if (failures.length) {
  console.error("");
  console.error(`黃金檔比對失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  console.error("");
  console.error("如果這些變動是你要的，跑 node tools/validate_golden.js --update 更新黃金檔。");
  process.exit(1);
}

console.log("");
console.log("golden OK");
