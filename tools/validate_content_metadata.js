// 題庫後設資料驗證：uid、rubric、origin
//
// 這三張表都是「一次產生、之後只增不改」的側表（跟 skill_tags.js 同一個模式，
// 不寫進 problem 物件本身，因為那會動到抽題結果）。側表最大的風險是**默默地漂**：
// 新增題目時忘了跑產生器，或是有人手動編輯了「不要手改」的檔案。
// 這支就是釘住它們。
//
// 用法：node tools/validate_content_metadata.js

"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const rubricRank = require("./lib/rubric_rank.js");

loadAppApi();
const problems = loadAppApi.allProblems();
const skillGraph = global.window.BuzzSkillGraph;
const uidMap = require(path.join(__dirname, "..", "src", "kernel", "uid_map.js"));
const { RUBRIC, REVIEWED } = require(path.join(__dirname, "..", "src", "kernel", "rubric.js"));
const ORIGIN = require(path.join(__dirname, "..", "src", "kernel", "origin.js"));

const failures = [];
const fail = (message) => failures.push(message);

/* ── uid ──────────────────────────────────────────────────── */

const missingUid = problems.filter((problem) => !uidMap[problem.id]);
if (missingUid.length) {
  fail(`${missingUid.length} 題沒有 uid（跑 node tools/assign_uids.js）：${missingUid.slice(0, 5).map((p) => p.id).join(", ")}`);
}

const uidSeen = new Map();
Object.entries(uidMap).forEach(([id, uid]) => {
  if (!/^bz-c-\d{6}$/.test(uid)) fail(`${id} 的 uid 格式不對：${uid}`);
  if (uidSeen.has(uid)) fail(`uid ${uid} 被 ${uidSeen.get(uid)} 和 ${id} 兩題共用`);
  uidSeen.set(uid, id);
});

/* ── rubric ───────────────────────────────────────────────── */

const missingRubric = problems.filter((problem) => !RUBRIC[problem.id]);
if (missingRubric.length) {
  fail(`${missingRubric.length} 題沒有 rubric（跑 node tools/backfill_rubric.js）：${missingRubric.slice(0, 5).map((p) => p.id).join(", ")}`);
}

// 這是整支驗證器最重要的一條：rubric 三軸算回來的 rank，
// 必須和使用者實際看到的 rank 一模一樣。
// 不然畫面上寫 R5、難度說明頁寫「這題三軸加起來是 R3」，兩邊互相打臉。
let rankMismatch = 0;
problems.forEach((problem) => {
  const axes = RUBRIC[problem.id];
  if (!axes) return;
  if (axes.length !== 3 || axes.some((value) => ![1, 2, 3].includes(value))) {
    fail(`${problem.id} 的 rubric 三軸值不合法：${JSON.stringify(axes)}`);
    return;
  }
  const skillCount = (skillGraph.skillsForProblem(problem) || []).length;
  const derived = rubricRank({ steps: axes[0], obscurity: axes[1], load: axes[2] }, skillCount);
  if (derived !== problem.rank) {
    rankMismatch += 1;
    if (rankMismatch <= 5) {
      fail(`${problem.id}：rubric 算出 R${derived}，但實際 rank 是 R${problem.rank}`);
    }
  }
});
if (rankMismatch > 5) fail(`…另有 ${rankMismatch - 5} 題 rubric 與 rank 不一致`);

Object.keys(REVIEWED).forEach((id) => {
  if (!RUBRIC[id]) fail(`REVIEWED 裡的 ${id} 沒有對應的 rubric`);
  if (!String(REVIEWED[id]).trim()) fail(`${id} 標成已複核但理由是空的`);
});

/* ── origin ───────────────────────────────────────────────── */

const ALLOWED_KINDS = new Set(["original", "adapted", "inspired", "public-domain", "user-submitted"]);
const missingOrigin = problems.filter((problem) => !ORIGIN[problem.id]);
if (missingOrigin.length) {
  fail(`${missingOrigin.length} 題沒有 origin（跑 node tools/backfill_origin.js）：${missingOrigin.slice(0, 5).map((p) => p.id).join(", ")}`);
}

// 名校詞彙偵測。大小寫敏感 + 字界，否則 "limit" 裡的 mit 會讓整個題庫誤報 ——
// 這個坑實際踩過一次。
const SCHOOL_WORDS = [
  "MIT", "Berkeley", "Princeton", "Oxford", "Cambridge", "Harvard", "Stanford",
  "Caltech", "Putnam", "Todai", "ETH", "IMO", "IMC",
  "東大", "台大", "臺大", "清大", "交大", "成大", "普林斯頓", "哈佛", "劍橋", "牛津"
];
const SCHOOL_PATTERN = new RegExp(
  "(?:" + SCHOOL_WORDS.map((word) => (/^[A-Za-z]/.test(word) ? `\\b${word}\\b` : word)).join("|") + ")"
);

let schoolFlagged = 0;
problems.forEach((problem) => {
  const entry = ORIGIN[problem.id];
  if (!entry) return;
  const [kind, note] = entry;
  if (!ALLOWED_KINDS.has(kind)) {
    fail(`${problem.id} 的 origin.kind "${kind}" 不在允許的五種之內`);
    return;
  }
  const haystack = [problem.source, problem.prompt, problem.solution, problem.school]
    .filter(Boolean)
    .join(" ");
  if (!SCHOOL_PATTERN.test(haystack)) return;
  schoolFlagged += 1;
  if (kind === "original") {
    fail(`${problem.id} 的文字裡有名校字眼，但 origin 標成 original —— 必須是 adapted / inspired / public-domain`);
  }
  if (!note || !String(note).trim()) {
    fail(`${problem.id} 的文字裡有名校字眼，origin.note 不能空著`);
  }
});

/* ── 題數不能寫死 ─────────────────────────────────────────── */

// 實測踩到的：onboarding 第一畫面寫「1407 題微積分」，而題庫頁顯示 1459。
// 使用者看到的第一個數字就跟第二個數字對不上 —— 那是最不該出錯的位置。
// README 的題數表同樣停在舊值。
//
// 規則：使用者看得到的地方一律不准寫死題數，README 的總數要跟題庫一致。
{
  const fs = require("fs");
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  // 只看會被 render 出去的字串（模板字面量裡的中文句子），註解不算
  const renderedLines = appSource
    .split("\n")
    .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"));
  renderedLines.forEach((line) => {
    const match = line.match(/(\d{3,5})\s*題[微積分庫]/);
    if (match) fail(`app.js 把題數寫死成「${match[1]} 題」—— 要改成從題庫算`);
  });

  // README 的題數改由 tools/validate_public_claims.js 把關。
  //
  // 原本這裡用正規式去撈 Problem Coverage 表格的 Total。它只看得到總數，
  // 而且看不到 about.html —— 那一頁寫著「1,459 題、774 題通過驗算」，
  // 實際是 1,605 與 906，漂了整整一包題還沒有人發現。
  // 新的那一支管所有對外頁面、每一個分項數字，用 data-claim / <!--claim:--> 標記，
  // 不是猜排版。兩邊都留著只會讓標記語法一改就有一支莫名其妙地紅。

  // 產出「給人看的東西」的工具必須經過 app_api 載題庫，不能直接用
  // load_problem_sources。
  //
  // 差別在 kernel 有沒有被載進來：難度校準要 src/kernel/rubric.js 的三軸
  // 才算得出正式 rank，rubric 沒載到就退回舊的標籤地板演算法 ——
  // 那個演算法把 29% 的題標成 R6（461 題），三軸的答案是 5%（83 題）。
  //
  // 工作簿就是這樣錯了一整本：316 頁的難度徽章、章節內排序、封面的難度分佈，
  // 印的全是已經被換掉的舊演算法。而它是要拿來賣的東西，
  // about.html 同時在對外說「難度由三個獨立的軸決定」。
  //
  // 失敗方式是安靜的（fallback 本來就該安靜，它是給 kernel 壞掉時用的），
  // 所以只能在這裡擋。
  const USER_FACING_GENERATORS = ["generate_workbook.js"];
  USER_FACING_GENERATORS.forEach((name) => {
    const file = path.join(__dirname, name);
    if (!fs.existsSync(file)) return;
    const source = fs.readFileSync(file, "utf8");
    const bare = source
      .split("\n")
      .some((line) => !line.trim().startsWith("//") && /require\(["'][^"']*load_problem_sources/.test(line));
    if (bare) {
      fail(`tools/${name} 直接用 load_problem_sources 載題庫 —— 這樣 kernel 不會載入，難度會退回舊演算法。改用 app_api.allProblems()`);
    }
  });
}

/* ── 報告 ─────────────────────────────────────────────────── */

const rankHistogram = {};
problems.forEach((problem) => { rankHistogram[problem.rank] = (rankHistogram[problem.rank] || 0) + 1; });
const TARGET = { 1: 8, 2: 18, 3: 28, 4: 28, 5: 13, 6: 5 };

// 內容深度的覆蓋率。這些數字沒有門檻可以擋 —— 它們是人要寫的東西，
// 不是程式能生的。放在這裡是為了讓缺口每次跑 CI 都被看見，
// 而不是變成「反正 CI 綠的」而永遠沒人補。
const derivedHints = require(path.join(__dirname, "..", "src", "kernel", "derived_hints.js"));
const withSteps = problems.filter((p) => Array.isArray(p.solutionSteps) && p.solutionSteps.length >= 2).length;
const withTwoHints = problems.filter((p) => (p.hints || []).length >= 2).length;
// 機器推導的要分開算。混在一起報會讓覆蓋率看起來比實際好，
// 而且「作者寫的」跟「機器算的」在使用者眼裡本來就是兩種不同的東西。
const withDerived = problems.filter((p) => (p.hints || []).length < 2 && derivedHints[p.id]).length;
const withThreeHints = problems.filter((p) => (p.hints || []).length >= 3).length;
const pct = (n) => ((100 * n) / problems.length).toFixed(1) + "%";

console.log("題庫後設資料");
console.log(`  uid       ${Object.keys(uidMap).length} 筆對照，${problems.length} 題全部有號`);
console.log(`  rubric    ${Object.keys(RUBRIC).length} 題有三軸，人工複核 ${Object.keys(REVIEWED).length} 題`);
console.log(`  origin    ${Object.keys(ORIGIN).length} 題有來源聲明，其中 ${schoolFlagged} 題含名校字眼`);
console.log("");
console.log("  內容深度（沒有門檻，這是人要寫的東西）：");
console.log(`    第二層提示 · 作者寫  ${String(withTwoHints).padStart(5)}  ${pct(withTwoHints)}`);
console.log(`    第二層提示 · 機器推  ${String(withDerived).padStart(5)}  ${pct(withDerived)}（每條都在 CI 重新驗算）`);
console.log(`    第二層提示 · 合計    ${String(withTwoHints + withDerived).padStart(5)}  ${pct(withTwoHints + withDerived)}`);
console.log(`    第三層提示（≥3 條）  ${String(withThreeHints).padStart(5)}  ${pct(withThreeHints)}`);
console.log(`    結構化解題步驟       ${String(withSteps).padStart(5)}  ${pct(withSteps)}`);
console.log("");
console.log("  難度分佈（現況 vs spec 目標）：");
[1, 2, 3, 4, 5, 6].forEach((rank) => {
  const n = rankHistogram[rank] || 0;
  const actual = (100 * n) / problems.length;
  const gap = actual - TARGET[rank];
  console.log(`    R${rank}  ${String(n).padStart(4)}  ${actual.toFixed(1).padStart(5)}%   目標 ${String(TARGET[rank]).padStart(2)}%   ${gap > 0 ? "+" : ""}${gap.toFixed(1)}`);
});

// 難度分佈的防退化門檻。
//
// 不設「必須完全命中目標」——那會逼人為了數字去改難度，而不是為了正確。
// 只擋明顯的退化：R5+R6 一度佔了全庫的 53.7%，那個狀態下新手
// 隨機抽到的題有一半是防強人題。門檻設在 25%（目前 18.1%），
// 只有在整批題目又被無差別調高時才會紅。
const hardShare = (100 * ((rankHistogram[5] || 0) + (rankHistogram[6] || 0))) / problems.length;
const HARD_SHARE_LIMIT = Number(process.env.BUZZ_MAX_HARD_SHARE || 25);
if (hardShare > HARD_SHARE_LIMIT) {
  fail(`R5+R6 佔 ${hardShare.toFixed(1)}%，超過 ${HARD_SHARE_LIMIT}% —— 對新手來說題庫又變成勸退的了`);
}
console.log(`  R5+R6 合計 ${hardShare.toFixed(1)}%（門檻 ${HARD_SHARE_LIMIT}%）`);

if (failures.length) {
  console.error("");
  console.error(`後設資料驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("content metadata OK");
