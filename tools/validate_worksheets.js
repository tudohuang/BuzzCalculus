// 作圖表題的把關
//
// 一張有錯格的作圖表比一題錯答案更傷：它同時教錯了七件事裡的一件，
// 而使用者會照著那一格去畫圖。所以**每一格都要獨立驗算過**。
//
// 驗的是：
//   1. 每一格的答案都通過 set_interval_verify 的獨立驗算
//   2. 每一格都判分得動（判分器要吃得下那個字串）
//   3. problem.answer 的序列化跟 fields 對得上（送出的格式與判分的格式一致）
//   4. 遞增／遞減不重疊、凹上／凹下不重疊（同一點不可能又升又降）
//   5. 有對照用的 sketch，而且畫得出來
//
// 第 3 條是最容易壞的：answer 是手寫的長字串，改了 fields 卻忘記改它，
// 症狀是「明明每一格都填對，整題還是判錯」。
//
// 用法：node tools/validate_worksheets.js

"use strict";

const appApi = require("./lib/app_api.js");
const siv = require("./lib/set_interval_verify.js");

const api = appApi();
const problems = appApi.allProblems().filter((problem) => problem.answerKind === "worksheet");

const failures = [];
const fail = (id, message) => failures.push(`${id}: ${message}`);

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

// 兩組區間有沒有重疊。遞增與遞減不能重疊，凹上與凹下也不能 ——
// 同一個點不可能又遞增又遞減，重疊代表某一格填錯了。
function overlaps(aText, bText) {
  let a;
  let b;
  try {
    a = siv.parseIntervals(aText);
    b = siv.parseIntervals(bText);
  } catch (_error) {
    return false; // 解析不動的話交給別的檢查報錯
  }
  return a.some((x) => b.some((y) => Math.min(x.hi, y.hi) - Math.max(x.lo, y.lo) > 1e-6));
}

let verified = 0;

problems.forEach((problem) => {
  const id = problem.id;
  const fields = problem.fields;

  if (!Array.isArray(fields) || fields.length < 4) {
    fail(id, `fields 只有 ${Array.isArray(fields) ? fields.length : 0} 個 —— 作圖表至少要有增減、極值、凹凸`);
    return;
  }

  // 3. 序列化格式必須一致
  const canonical = fields.map((field) => `${field.key}=${String(field.answer || "").trim()}`).join("; ");
  if (String(problem.answer || "").trim() !== canonical) {
    fail(
      id,
      "answer 跟 fields 對不上 —— 使用者每一格都填對也會被判錯。\n" +
      `      應該是：${canonical}\n` +
      `      現在是：${problem.answer}`
    );
  }

  const keys = new Set();
  fields.forEach((field) => {
    const label = `欄位 ${field.key}`;
    if (!field.key || !field.label) { fail(id, `${label} 缺 key 或 label`); return; }
    if (keys.has(field.key)) { fail(id, `${label} 重複`); return; }
    keys.add(field.key);
    if (!["set", "interval", "numeric", "text"].includes(field.kind)) {
      fail(id, `${label} 的 kind "${field.kind}" 不支援`);
      return;
    }

    // 2. 判分器要吃得下自己的參考答案 —— 吃不下代表這一格永遠判錯
    const sub = { answerKind: field.kind, answer: field.answer, answers: field.answers };
    const selfCheck = api.checkAnswer(sub, field.answer);
    if (!selfCheck.correct) {
      fail(id, `${label} 的參考答案 "${field.answer}" 連自己都判不過（${selfCheck.message}）`);
      return;
    }

    // 1. 獨立驗算
    if (!field.verify) {
      fail(id, `${label} 沒有 verify 描述子 —— 作圖表的每一格都必須獨立驗算過`);
      return;
    }
    const result = siv.verify(
      { answerKind: field.kind, answer: field.answer, verify: field.verify },
      { normalizeAnswer: api.normalizeExpression }
    );
    if (result.status !== "ok") {
      fail(id, `${label} 驗算不過 [${result.status}] ${result.detail || result.reason}`);
      return;
    }
    verified += 1;
  });

  // 4. 互斥檢查
  const byKey = {};
  fields.forEach((field) => { byKey[field.key] = field.answer; });
  if (byKey.increasing && byKey.decreasing && overlaps(byKey.increasing, byKey.decreasing)) {
    fail(id, "遞增與遞減的區間重疊了 —— 同一個點不可能又升又降");
  }
  if (byKey.concaveUp && byKey.concaveDown && overlaps(byKey.concaveUp, byKey.concaveDown)) {
    fail(id, "凹向上與凹向下的區間重疊了");
  }

  // 5. 對照圖
  if (!problem.sketch || !problem.sketch.expr) {
    fail(id, "沒有 sketch —— 手繪不判分，但一定要有正確的圖讓使用者對照");
  } else {
    const fn = compile(problem.sketch.expr);
    if (!fn) {
      fail(id, `sketch.expr "${problem.sketch.expr}" 編譯不了`);
    } else {
      const win = problem.sketch.window;
      if (!Array.isArray(win) || win.length !== 4) {
        fail(id, "sketch.window 要寫成 [xmin, xmax, ymin, ymax]");
      } else {
        let drawn = 0;
        for (let i = 0; i <= 120; i += 1) {
          const x = win[0] + ((win[1] - win[0]) * i) / 120;
          const y = fn(x);
          if (Number.isFinite(y) && y >= win[2] && y <= win[3]) drawn += 1;
        }
        if (drawn < 30) fail(id, `sketch 在窗內只有 ${drawn} 個點畫得出來 —— 對照圖幾乎是空白的`);
      }
    }
  }

  if (!problem.solutionSteps || problem.solutionSteps.length < 3) {
    fail(id, "作圖表一定要有 solutionSteps —— 那個填表順序就是解法");
  }
});

console.log("作圖表題");
console.log(`  題數        ${problems.length}`);
console.log(`  欄位        ${problems.reduce((sum, p) => sum + (p.fields || []).length, 0)} 格，${verified} 格通過獨立驗算`);

if (failures.length) {
  console.error("");
  console.error(`作圖表驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("worksheets OK");
