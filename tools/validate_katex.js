// 題幹真的拿 KaTeX 渲染一遍。
//
// app.js 用 throwOnError:false 渲染 —— 那是對的，線上不該因為一題壞掉整頁空白。
// 但代價是壞掉的式子只會變成一段紅字，沒有任何東西會叫。
// 過去靠 validate_problems.js 逐條加 lint（未跳脫的 %、\text{} 裡的 ·）來補，
// 那是在一個一個猜哪裡會壞；直接把 throwOnError 打開跑一遍，才是把整類問題關掉。
//
// 掃的是題幹、選項與參考答案 —— 三者都會進到 KaTeX。
global.window = {};
const path = require("path");
const katex = require(path.join(__dirname, "..", "assets", "vendor", "katex", "katex.min.js"));
require("./lib/load_problem_sources.js")();

const problems = window.BUZZ_PROBLEMS || [];
const failures = [];
let rendered = 0;

function render(id, field, tex) {
  if (typeof tex !== "string" || !tex.trim()) return;
  rendered += 1;
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: true });
  } catch (error) {
    failures.push(`${id} 的 ${field}：${error.message.split("\n")[0]}\n    ${tex}`);
  }
}

problems.forEach((problem) => {
  render(problem.id, "prompt", problem.prompt);
  // 選圖題的答案是一條曲線的式子，作圖表題的答案是集合/區間文字，兩者都不走 KaTeX
  if (problem.answerKind === "expression" || problem.answerKind === "antiderivative" || problem.answerKind === "numeric") {
    render(problem.id, "answer", problem.answer);
  }
  (problem.choices || []).forEach((choice, index) => render(problem.id, `choices[${index}]`, choice));
});

console.log("KaTeX 渲染");
console.log(`  題目      ${problems.length}`);
console.log(`  渲染字串  ${rendered}`);

if (failures.length) {
  console.error(`\nKaTeX 渲染失敗（${failures.length}）：`);
  failures.forEach((line) => console.error("  " + line));
  console.error("\n這些式子在畫面上會變成紅色錯誤文字，而且不會有任何錯誤訊息。");
  process.exit(1);
}

console.log("\nkatex OK");
