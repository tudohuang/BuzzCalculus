// 題庫答案的獨立數值驗算
//
// 為什麼這支比其他驗證器都重要：spec 00 把「答案錯一題造成的信任損失，
// 大於新增五十題帶來的價值」列為題庫第一原則。但在這支之前，
// 答案的正確性完全靠人工檢查 —— 也就是完全沒有機器把關。
//
// 做法見 tools/lib/verify_engine.js：從**題幹**推出一條和解題無關的數值路徑，
// 再跟答案比。不定積分驗微分回去、導數驗數值微分、定積分/極限/級數直接算。
//
// 用法：
//   node tools/verify_answers.js              只報摘要與不符的題
//   node tools/verify_answers.js --list        連無法驗證的題一起列出
//   node tools/verify_answers.js --id lim-001  只驗一題（會印出中間結果）
//   node tools/verify_answers.js --ci          覆蓋率與不符數低於門檻就失敗

"use strict";

const path = require("path");
const fs = require("fs");
const loadAppApi = require("./lib/app_api.js");
const { verifyProblem } = require("./lib/verify_engine.js");

const args = process.argv.slice(2);
const onlyId = args.includes("--id") ? args[args.indexOf("--id") + 1] : null;
const listAll = args.includes("--list");
const ciMode = args.includes("--ci");

const api = loadAppApi();
const problems = loadAppApi.allProblems();
const targets = onlyId ? problems.filter((p) => p.id === onlyId) : problems;
if (onlyId && !targets.length) {
  console.error(`找不到題目 ${onlyId}`);
  process.exit(1);
}

const buckets = { ok: [], mismatch: [], unverified: [], unsupported: [], error: [] };

targets.forEach((problem) => {
  let result;
  try {
    result = verifyProblem(problem, { normalizeAnswer: api.normalizeExpression });
  } catch (error) {
    result = { status: "error", reason: error.message };
  }
  (buckets[result.status] || buckets.error).push({ problem, result });
});

/* ── 單題模式：把過程攤開 ─────────────────────────────────── */

if (onlyId) {
  const [{ problem, result }] = Object.values(buckets).flat();
  console.log(`題目    ${problem.id}  (${problem.topic}, R${problem.rank}, ${problem.answerKind})`);
  console.log(`題幹    ${problem.prompt}`);
  console.log(`答案    ${problem.answerKind === "text" ? (problem.answers || []).join(" / ") : problem.answer}`);
  console.log(`判分器讀成  ${api.normalizeExpression(problem.answer) || "(讀不出來)"}`);
  console.log("");
  console.log(`結果    ${result.status}${result.method ? "  [" + result.method + "]" : ""}`);
  console.log(`        ${result.detail || result.reason || ""}`);
  process.exit(result.status === "mismatch" ? 1 : 0);
}

/* ── 報告 ─────────────────────────────────────────────────── */

const total = targets.length;
const verified = buckets.ok.length + buckets.mismatch.length;
const pct = (n) => ((100 * n) / total).toFixed(1) + "%";

console.log("答案獨立驗算");
console.log(`  題數        ${total}`);
console.log(`  可驗證      ${verified} (${pct(verified)})`);
console.log(`    通過      ${buckets.ok.length}`);
console.log(`    不符      ${buckets.mismatch.length}`);
console.log(`  無法驗證    ${buckets.unverified.length + buckets.unsupported.length + buckets.error.length}`);
console.log(`    題幹形式尚未支援  ${buckets.unsupported.length}`);
console.log(`    數值方法不收斂    ${buckets.unverified.length}`);
console.log(`    解析／求值失敗    ${buckets.error.length}`);

const byMethod = {};
buckets.ok.forEach(({ result }) => { byMethod[result.method] = (byMethod[result.method] || 0) + 1; });
console.log("\n  通過的驗算路徑：");
Object.entries(byMethod).sort((a, b) => b[1] - a[1]).forEach(([method, n]) => {
  console.log(`    ${String(method).padEnd(22)}${n}`);
});

if (buckets.mismatch.length) {
  console.log(`\n答案和獨立算出來的值不符（${buckets.mismatch.length} 題）：`);
  buckets.mismatch.forEach(({ problem, result }) => {
    console.log(`\n  ${problem.id}  [${result.method}]`);
    console.log(`    題幹  ${problem.prompt}`);
    console.log(`    ${result.detail}`);
    if (result.ratio && Number.isFinite(result.ratio)) {
      console.log(`    比值  ${Number(result.ratio.toPrecision(8))}`);
    }
  });
}

if (listAll) {
  ["error", "unverified", "unsupported"].forEach((kind) => {
    if (!buckets[kind].length) return;
    console.log(`\n--- ${kind} (${buckets[kind].length}) ---`);
    buckets[kind].forEach(({ problem, result }) => {
      console.log(`  ${problem.id.padEnd(22)}${(result.reason || "").slice(0, 70)}   ${problem.prompt.slice(0, 50)}`);
    });
  });
}

/* ── 寫出報告，讓覆蓋率的變化看得見 ───────────────────────── */

if (!onlyId) {
  const summary = {
    total,
    verified,
    ok: buckets.ok.length,
    mismatch: buckets.mismatch.map(({ problem, result }) => ({ id: problem.id, detail: result.detail })),
    unsupported: buckets.unsupported.length,
    unverified: buckets.unverified.length,
    error: buckets.error.length
  };
  const outputPath = path.join(__dirname, "..", "reports", "answer-verification.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2) + "\n", "utf8");
  console.log(`\n報告寫到 ${path.relative(path.join(__dirname, ".."), outputPath)}`);

  // 側表：哪些題通過了獨立驗算。
  //
  // 這是整個題庫最強的一句話，而它原本只存在於 CI 的輸出裡 ——
  // 使用者在畫面上看不到任何痕跡。寫成側表（而不是寫進題目物件）
  // 是因為題目物件的任何欄位都會影響抽題結果與 golden 測試。
  const verifiedIds = buckets.ok.map(({ problem }) => problem.id).sort();
  const methods = {};
  buckets.ok.forEach(({ problem, result }) => {
    methods[result.method] = (methods[result.method] || 0) + 1;
    void problem;
  });
  const sidecar = [
    "// 通過獨立數值驗算的題號。**這個檔案由 tools/verify_answers.js 產生，不要手改。**",
    "//",
    "// 「獨立」的意思是：驗算路徑從題幹推出來，跟題目附的答案沒有共用任何推理。",
    "// 積分用雙指數積分法、微分用 Ridders、級數判斂用冪次量測 —— 算完再跟答案比。",
    "//",
    "// 為什麼放側表而不是寫進題目物件：題目物件多一個欄位就會改變抽題與 golden 測試的結果。",
    "// 內容的中繼資料一律走側表，這是專案的既有約定。",
    "//",
    `// 產生時的統計：${total} 題中 ${verifiedIds.length} 題通過，不符 ${summary.mismatch.length} 題。`,
    "",
    "(function registerVerifiedAnswers() {",
    '  "use strict";',
    "  var IDS = [",
    ...verifiedIds.map((id) => `    ${JSON.stringify(id)},`),
    "  ];",
    "  var SET = Object.create(null);",
    "  IDS.forEach(function (id) { SET[id] = true; });",
    "  window.BuzzVerifiedAnswers = {",
    "    has: function (id) { return Boolean(id && SET[id]); },",
    "    count: IDS.length,",
    `    total: ${total}`,
    "  };",
    "})();",
    ""
  ].join("\n");
  const sidecarPath = path.join(__dirname, "..", "src", "kernel", "verified_answers.js");
  fs.writeFileSync(sidecarPath, sidecar, "utf8");
  console.log(`側表寫到 src/kernel/verified_answers.js（${verifiedIds.length} 題，方法分布 ${JSON.stringify(methods)}）`);
}

/* ── CI 門檻 ──────────────────────────────────────────────── */

if (ciMode) {
  // 門檻的意義：不符必須是零（一題錯答案就夠毀掉信任），
  // 覆蓋率則設在目前水準之下一點，只擋「退步」不擋「還沒補完」。
  const MIN_COVERAGE = Number(process.env.BUZZ_MIN_VERIFY_COVERAGE || 48);
  const failures = [];
  if (buckets.mismatch.length) failures.push(`${buckets.mismatch.length} 題答案與獨立算出來的值不符`);
  const coverage = (100 * verified) / total;
  if (coverage < MIN_COVERAGE) {
    failures.push(`可驗證比例 ${coverage.toFixed(1)}% 低於門檻 ${MIN_COVERAGE}%`);
  }
  if (failures.length) {
    console.error("\n答案驗算失敗：");
    failures.forEach((line) => console.error(`  ${line}`));
    process.exit(1);
  }
  console.log("\nverify OK");
}
