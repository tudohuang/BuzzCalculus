// 效能預算。
//
// zero-build 靜態站的效能故事很簡單：首屏就是把 index.html 列的每支
// script 抓下來、跑一遍。所以預算直接掛在「出貨的位元組」上 ——
// 它跨平台確定、不會 flaky，而且違約時能指名是誰超支。
//
// 時間類指標（TTI、首繪）刻意不進閘門：CI 機器的快慢每天不同，
// 拿它當門檻的下場就是大家學會重跑直到綠燈。時間只印出來給人看。
//
// 預算數字是 2026-09 大改版後的現況加上合理餘裕 —— 它的目的不是
// 逼優化，是擋「不知不覺又肥回去」。要調預算可以，但要在這裡改數字，
// 留下紀錄，而不是默默超過。

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 各類別的預算（bytes）。gzip 前的原始大小 —— 部署雖有壓縮，
// 但解析與執行成本跟原始大小走，而且原始大小人人都能本機重現。
// kernel 分兩類：手寫的邏輯模組，跟工具產生的側表（uid/origin/rubric/
// derived_hints/verified_answers/equivalence/skill_tags）。側表是資料 ——
// 它們隨題庫成長是正常的，跟著題庫預算走；邏輯肥大才是要擋的事。
const GENERATED_TABLES = /^src\/kernel\/(uid_map|origin|rubric|rubric_reviewed|derived_hints|verified_answers|equivalence|skill_tags)\.js$/;

const BUDGETS = {
  // 2026-09-13 從 700 調到 720：初學者走查補進新手保護期、診斷式定位、
  // 考前衝刺卡（+14KB），同時把 TAG_LABELS 搬成 kernel/tag_labels.js（−7KB）。
  // 下一次撞頂不該再調數字 —— 該搬的是整頁的 render（首頁、結算、設定）。
  // 2026-09-28 720 → 736：英文版。1,800 個中文字串包成 t("…") 是純語法開銷（+14.6KB），
  // 不是新功能長胖；量出來多少就加多少。功能再撞頂仍然照上一條：搬 render，不調數字。
  "app.js 主程式": { pattern: /^src\/app\.js$/, budget: 736 * 1024 },
  "kernel 產生側表": { pattern: GENERATED_TABLES, budget: 500 * 1024 },
  // 2026-09-28 新增：zh→en 介面字典（i18n_en.js）。每個使用者都會抓（模組初始化期就要有語言），
  // 所以它有自己的上限；題目的英文側表走延後載入，不在這裡。
  "語言字典（zh→en）": { pattern: /^src\/kernel\/i18n_en\.js$/, budget: 240 * 1024 },
  // 2026-09-13 200 → 260：kernel/proof_lang.js（句型、代數、規則三個引擎）59KB 一次進來。
  // 2026-09-14 260 → 280：proof_lang.js 101KB —— 收緊語法（接地、前提、符號正負引擎 parseTree/signOf、
  // 線性解 solveLinear、泰勒規則）。這是檢查器的骨幹，不是可以搬去別處的 render；再撞頂該做的是
  // 把 signOf 那類純函式拆成 kernel/proof_sign.js 之類、順便量一次是不是真的都在用。
  // 2026-09-19 280 → 330：proof_surface.js 36KB —— Proof Input v2／v2.1 自由書寫層（LaTeX 表層、切句、
  // 一句多動作、目標宣告、結論接地、連鎖抑制、原文映射）。它是獨立模組，proof_lang.js 不用學自然語言。
  // 2026-09-19 330 → 345：Proof Input v2.2 —— proof_lang.js +11KB（改寫規則四條、接地優先序、provenance 事實表），
  // proof_surface.js +6KB（語意目標：lim 形式與 ∀ε∃δ 形式等價、目標寫錯紅、結論接地）。都是驗證邏輯，不是資料。
  // 2026-09-20 345 → 365：Proof Engine v2.3／v2.4 —— proof_lang.js +21KB（全稱條件實例化、全稱主張、自訂函數數值微分、單調性接地）。
  // 都是驗證邏輯；下一次再漲就該把接地規則搬去獨立模組（proof_grounding.js），不是再調數字。
  // 2026-09-20 365 → 385：Proof Engine v2.5 積分——tanh–sinh 數值積分、∫／Σ 寫法改寫、int()/sum() 編譯（+14KB）。
  // 這是新能力不是長胖；但 proof_lang.js 已 155KB，下一版應該把數值積分與接地規則拆成獨立檔並延遲載入（只有證明頁用）。
  // 2026-09-21 385 → 390：tex_lite 排完量畫面——過寬的 display 式子改走換行流／一式一行／縮字（+3KB）。
  // 下一次再超就不是加預算，是把 proof_lang.js（167KB）拆成按需載入。
  "kernel 邏輯模組": { pattern: /^src\/kernel\//, budget: 390 * 1024 },
  "題庫資料合計": { pattern: /^src\/problem|^src\/problems\.js$|^src\/proofs\.js$/, budget: 2400 * 1024 },
  // 2026-09-15 300 → 310：「從零開始」課程表與單課頁（course.js）約 4KB 的樣式；
  // 已盡量沿用 pl-tutorial / pl-intro / pl-goal / first-steps。再撞頂該做的是
  // 把 styles.css 的三層歷史覆蓋（見 duolingo-path-design 那次的教訓）清一輪。
  "樣式 styles.css": { pattern: /^styles\.css$/, budget: 310 * 1024, fromCss: true },
  "其他 src 腳本": { pattern: /^src\//, budget: 300 * 1024, catchAll: true },
  // 2026-09-24 新增這一類：index.html 上 type="text/lazy" 的檔案瀏覽器不會在首屏抓，
  // 進到需要它的頁面才載（目前是證明引擎三支）。它們跟首屏無關，預算也不該跟首屏的檔搶 ——
  // 但仍然要有上限：延後載入不是「隨便長」的許可證，載入那一刻使用者還是要等。
  // 2026-09-28 320 → 460：題目的英文側表（i18n_problems_en.js）只在英文介面載，中文使用者零成本。
  // 2026-09-30 新增：逐步解答側表（problem_solution_steps.js）。它也是 text/lazy，但跟上面那類不同：
  // 不是「進到某一頁才抓」，是頁面載完、閒下來就抓（答完題看解答時一定要已經在）。
  // 首屏不用解析它，所以不跟首屏的檔搶；也不跟證明引擎、英文側表搶同一個上限。
  // 它隨內容成長（每題約 0.5KB），上限給到現況的兩倍左右 —— 再撞頂就該拆成按題包載入。
  "延後載入：逐步解答": { pattern: /^$/, budget: 400 * 1024, lazy: "steps" },
  // 2026-09-30 拆成兩類：兩組是各自載入的（進證明頁才抓 proof 那三支；英文介面才抓 i18n 那一支），
  // 合在一起算等於讓英文側表跟證明引擎搶同一個額度 —— 載入的那一刻，使用者等的只是其中一組。
  // 拆開時的量：證明組 290KB（proof_lang 167 ＋ proof_surface 44 ＋ 內容 79；內容多了 20 講的 10 題證明小題 +10KB），
  // 英文側表 175KB。上限各留約兩成：證明組 320KB（下一次撞頂照 kernel 那條：把 proof_lang.js 拆檔，不是調數字）、
  // 英文側表 240KB（第二批翻譯——解說、提示——會進這一支，那是預期中的成長）。
  "延後載入：證明頁": { pattern: /^$/, budget: 320 * 1024, lazy: "proof" },
  // 2026-09-30 240 → 720：英文第二批（解說／提示／逐步解／課文／證明的句型表 i18n_text_en.js 481KB）進了這一組。
  // 只有英文介面在開站時抓（中文使用者零位元組，sw.js 也不預快取）；英文使用者第一幀要等它，所以仍然要有上限（現況 655KB）。
  "延後載入：英文內容": { pattern: /^$/, budget: 720 * 1024, lazy: "i18n" }
};

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const allTags = [...html.matchAll(/<script[^>]*src="(src\/[^"]+\.js)"[^>]*>/g)];
const lazyScripts = new Set(allTags.filter((m) => /type="text\/lazy"/.test(m[0])).map((m) => m[1]));
const lazyGroupOf = new Map(allTags.filter((m) => /type="text\/lazy"/.test(m[0])).map((m) => [m[1], (m[0].match(/data-lazy="([^"]+)"/) || [])[1] || ""]));
const scripts = allTags.map((m) => m[1]).filter((rel) => !lazyScripts.has(rel));
const failures = [];

const sizeOf = (rel) => {
  try { return fs.statSync(path.join(ROOT, rel)).size; } catch (_e) { return 0; }
};

const claimed = new Set();
const rows = [];
for (const [label, spec] of Object.entries(BUDGETS)) {
  let files = [];
  if (spec.lazy) {
    files = [...lazyScripts].filter((rel) => lazyGroupOf.get(rel) === spec.lazy);
  } else if (spec.fromCss) {
    files = ["styles.css"];
  } else if (spec.catchAll) {
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
  } else {
    // 類別依宣告順序互斥：先宣告的先認領。side table 歸資料、
    // 剩下的 kernel 才算邏輯 —— 順序反了整個分類就失真。
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
    files.forEach((f) => claimed.add(f));
  }
  const total = files.reduce((sum, f) => sum + sizeOf(f), 0);
  const pct = Math.round((total / spec.budget) * 100);
  rows.push({ label, total, budget: spec.budget, pct, count: files.length });
  if (total > spec.budget) {
    const worst = files.map((f) => [f, sizeOf(f)]).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([f, b]) => `${f} ${Math.round(b / 1024)}KB`).join("、");
    failures.push(`${label} 超出預算：${Math.round(total / 1024)}KB / ${Math.round(spec.budget / 1024)}KB（最大：${worst}）`);
  }
}

console.log("效能預算（原始位元組）");
rows.forEach((r) => {
  console.log(
    `  ${r.label.padEnd(14)} ${String(Math.round(r.total / 1024)).padStart(5)} KB / ${String(Math.round(r.budget / 1024)).padStart(5)} KB  ${String(r.pct).padStart(3)}%  （${r.count} 檔）`
  );
});

// script 數量：每支都是一次 request 與一次解析。上限一樣是「擋回肥」。
// 2026-09-13 60 → 64：白話證明的 kernel 與內容各一支。下一次該做的是把題庫檔合併，不是再加數字。
// 2026-09-16 64 → 65：share_cards.js 是從 app.js 搬出去的 230 行（app.js 撞頂），總位元組沒變；
// 題庫檔合併（37 檔）還是欠著的債，下一支再加就先合併。
// 2026-09-19 65 → 66：kernel/proof_surface.js（Proof Input v2 自由書寫層）是一支獨立的 kernel 模組，
// 讓 proof_lang.js 不用學自然語言；舊測試繼續保護引擎，新測試只管翻譯。
// 2026-09-29 66 → 67：problem_lecture_pack.js 是 tools/build_lecture_pack.js 從外部考卷產生的檔（336 題＋ 20 張固定卷的題序），
// 有自己的重產流程；塞進手寫的題庫檔會讓產生的內容跟手寫的內容擠在同一個檔裡，下一次重產就沖掉人家的字。
const SCRIPT_COUNT_BUDGET = 67;
console.log(`  script 標籤        ${String(scripts.length).padStart(5)} 支 / ${SCRIPT_COUNT_BUDGET} 支上限`);
if (scripts.length > SCRIPT_COUNT_BUDGET) {
  failures.push(`index.html 的 script 數量 ${scripts.length} 超過 ${SCRIPT_COUNT_BUDGET}`);
}

// 每一支延後載入的檔都要屬於某個有預算的組：新加一組 data-lazy 就要在上面寫它的上限
const budgetedGroups = new Set(Object.values(BUDGETS).map((spec) => spec.lazy).filter(Boolean));
[...lazyScripts].filter((rel) => !budgetedGroups.has(lazyGroupOf.get(rel))).forEach((rel) => {
  failures.push(`${rel} 是延後載入（data-lazy="${lazyGroupOf.get(rel)}"），但這一組沒有預算`);
});

if (failures.length) {
  console.error(`\n效能預算超支（${failures.length}）：`);
  failures.forEach((f) => console.error("  " + f));
  console.error("要調預算就改這個檔案裡的數字並寫清楚為什麼 —— 不要默默超過。");
  process.exit(1);
}

console.log("\nperformance budget OK");
