// 選圖題的把關
//
// 這個題型的失敗方式跟數值題完全不同。答案沒有「算錯」的問題 ——
// 正解就是題目裡那條函數本身。會出事的是**誘答**：
//
//   1. 誘答跟正解在窗內幾乎重合 → 那是一道不公平的題，不是一道難題。
//      使用者選了 B、正解是 A，但兩張圖看起來一樣 —— 他會認為判分器壞了，
//      而且他是對的。
//   2. 誘答畫不出來（式子有錯、在整個窗內都是 NaN）→ 一張空白的選項，
//      等於直接送分。
//   3. 誘答沒寫理由 → 答錯之後只知道錯，不知道錯在哪。
//      而這個題型的全部價值就在「你犯的是哪一個畫圖錯誤」。
//   4. 正解不是題目說的那條函數 → 整題是錯的。
//
// 這支就是逐條擋這四件事。
//
// 用法：node tools/validate_graph_choices.js

"use strict";

const appApi = require("./lib/app_api.js");

const problems = appApi.allProblems().filter((problem) => problem.answerKind === "graph");

const failures = [];
const fail = (id, message) => failures.push(`${id}: ${message}`);

// 跟 app.js 的 graphCurveFn 同一套規則 —— 前端畫不出來的東西，這裡也不該說它沒問題
function compile(expr) {
  const cleaned = String(expr || "");
  if (!/^[0-9x+\-*/().,^\sa-z]*$/i.test(cleaned)) return null;
  try {
    const body = `"use strict"; const {sin,cos,tan,asin,acos,atan,log,exp,sqrt,abs,pow,sinh,cosh,tanh,PI,E}=Math; return (${cleaned.replace(/\^/g, "**")});`;
    return new Function("x", body);
  } catch (_error) {
    return null;
  }
}

// 兩條曲線在窗內「看起來一不一樣」。
//
// 判準刻意用**畫出來的像素距離**而不是數學差異：使用者是用眼睛比的。
// 只在其中一點差很多不算 —— 那可能落在窗外或被裁掉。要看的是
// 「有多少比例的取樣點肉眼分得出來」。
function visualGap(correct, other, win) {
  const [xmin, xmax, ymin, ymax] = win;
  const height = ymax - ymin;
  const steps = 240;
  let visible = 0;
  let plotted = 0;
  let maxGap = 0;
  for (let i = 0; i <= steps; i += 1) {
    const x = xmin + ((xmax - xmin) * i) / steps;
    const a = correct(x);
    const b = other(x);
    const aIn = Number.isFinite(a) && a >= ymin && a <= ymax;
    const bIn = Number.isFinite(b) && b >= ymin && b <= ymax;
    // 一邊在窗內、一邊不在，本身就是看得出來的差別（例如定義域不同）
    if (aIn !== bIn) { visible += 1; plotted += 1; continue; }
    if (!aIn) continue;
    plotted += 1;
    const gap = Math.abs(a - b) / height;
    maxGap = Math.max(maxGap, gap);
    if (gap > 0.04) visible += 1; // 圖高的 4%，約 5px
  }
  return { ratio: plotted ? visible / plotted : 0, maxGap, plotted };
}

problems.forEach((problem) => {
  const id = problem.id;
  const choices = problem.graphChoices;
  const win = problem.graphWindow;

  if (!Array.isArray(win) || win.length !== 4 || !(win[1] > win[0]) || !(win[3] > win[2])) {
    fail(id, "graphWindow 要寫成 [xmin, xmax, ymin, ymax] 且範圍為正");
    return;
  }
  if (!Array.isArray(choices) || choices.length < 3) {
    fail(id, `graphChoices 只有 ${Array.isArray(choices) ? choices.length : 0} 個 —— 至少要 3 個才不會太好猜`);
    return;
  }

  const correctOnes = choices.filter((choice) => choice.correct === true);
  if (correctOnes.length !== 1) {
    fail(id, `正解標記了 ${correctOnes.length} 個，必須恰好 1 個`);
    return;
  }
  const tidy = (value) => String(value || "").replace(/\s+/g, "");
  if (tidy(problem.answer) !== tidy(correctOnes[0].expr)) {
    fail(id, `answer 是 "${problem.answer}"，但標為正解的選項是 "${correctOnes[0].expr}"`);
    return;
  }

  const correctFn = compile(correctOnes[0].expr);
  if (!correctFn) {
    fail(id, `正解的式子 "${correctOnes[0].expr}" 編譯不了`);
    return;
  }

  const seen = new Set();
  choices.forEach((choice, index) => {
    const label = `選項 ${index + 1}（${choice.expr}）`;
    if (seen.has(tidy(choice.expr))) {
      fail(id, `${label} 跟前面的選項是同一條式子`);
      return;
    }
    seen.add(tidy(choice.expr));

    const fn = compile(choice.expr);
    if (!fn) {
      fail(id, `${label} 編譯不了 —— 前端會畫出一張空白的選項`);
      return;
    }

    // 每個選項自己都要真的畫得出東西
    let drawn = 0;
    for (let i = 0; i <= 120; i += 1) {
      const x = win[0] + ((win[1] - win[0]) * i) / 120;
      const y = fn(x);
      if (Number.isFinite(y) && y >= win[2] && y <= win[3]) drawn += 1;
    }
    if (drawn < 12) {
      fail(id, `${label} 在窗內只有 ${drawn} 個點畫得出來 —— 幾乎是一張空白圖，等於送分`);
      return;
    }

    if (choice.correct) return;

    if (!choice.why || !String(choice.why).trim()) {
      fail(id, `${label} 沒有寫錯在哪 —— 這個題型的價值就在「你犯的是哪一個畫圖錯誤」`);
    }

    const gap = visualGap(correctFn, fn, win);
    if (gap.ratio < 0.08) {
      fail(
        id,
        `${label} 跟正解在窗內只有 ${(gap.ratio * 100).toFixed(1)}% 的取樣點分得出來` +
        `（最大差距 ${(gap.maxGap * 100).toFixed(1)}% 圖高）—— 兩張圖看起來一樣，那是不公平不是難`
      );
    }
  });

  if (!problem.solutionSteps || problem.solutionSteps.length < 3) {
    fail(id, "選圖題一定要有 solutionSteps —— 逐項核對性質就是這題的解法");
  }
});

console.log("選圖題");
console.log(`  題數        ${problems.length}`);
if (problems.length) {
  const distractors = problems.reduce((sum, p) => sum + (p.graphChoices || []).length - 1, 0);
  const withWhy = problems.reduce(
    (sum, p) => sum + (p.graphChoices || []).filter((c) => !c.correct && c.why).length,
    0
  );
  console.log(`  誘答        ${distractors} 個，${withWhy} 個寫了錯在哪`);
  const gaps = [];
  problems.forEach((p) => {
    const correct = compile((p.graphChoices.find((c) => c.correct) || {}).expr);
    if (!correct) return;
    p.graphChoices.filter((c) => !c.correct).forEach((c) => {
      const fn = compile(c.expr);
      if (fn) gaps.push(visualGap(correct, fn, p.graphWindow).ratio);
    });
  });
  if (gaps.length) {
    const min = Math.min(...gaps);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    console.log(`  視覺差距    最小 ${(min * 100).toFixed(0)}% / 平均 ${(avg * 100).toFixed(0)}% 的取樣點分得出來`);
  }
}

if (failures.length) {
  console.error("");
  console.error(`選圖題驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("graph choices OK");
