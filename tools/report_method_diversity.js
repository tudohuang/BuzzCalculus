// 方法集中度報表（題庫精修提案 v1.0）。CI 每次都跑；大部分是「印出來給人看」，只有分類表裡標 hard 的上限會紅燈。
//
// 印三張表：
//   1. 每個主題×rank：全題庫 vs 預設池的最大家族份額、HHI、家族數
//   2. 曝光上限（tools/content/method_taxonomy.js 的 EXPOSURE_CAPS）：全題庫的份額（題庫本身的樣子）
//      vs 預設池的份額（defaultWeight 壓過之後，抽題器第一段看到的質量）。預設池超過 hard 上限 → exit 1
//   3. 模板飽和：同一個 noveltyFamily 在課程核心或預設池裡超過 TEMPLATE_SATURATION_WARN 題 → 警告
// 量的是上線的那份側表（src/kernel/problem_profiles.js），不是重新分類 —— 忘了 regen 的話 regen_all --check 會先紅。
//
// 用法：node tools/report_method_diversity.js [--all]   （--all：每一格都印，不只超過軟上限的）

"use strict";

const load = require("./lib/app_api.js");
load();
const problems = load.allProblems();
const win = global.window;
const taxonomy = require("./content/method_taxonomy.js");
const D = require("./lib/method_diversity.js");

const showAll = process.argv.includes("--all");
if (!win.BuzzProblemProfiles || !win.BuzzSampler) {
  console.error("src/kernel/problem_profiles.js 或 sampler.js 沒有載入（index.html 的 data-lazy=\"sampler\"）");
  process.exit(1);
}
const profiles = D.profilesFromRuntime(win.BuzzProblemProfiles, win.BuzzSampler);
const missing = problems.filter((p) => !profiles.has(p.id));
if (missing.length) {
  console.error(`${missing.length} 題沒有側寫（先跑 node tools/build_problem_profiles.js）：${missing.slice(0, 5).map((p) => p.id).join(", ")}`);
  process.exit(1);
}

const bank = D.tabulate(D.bankRows(problems, profiles, "bank"));
const pool = D.tabulate(D.bankRows(problems, profiles, "default"));

console.log("方法集中度（主要家族）：主題×rank   全題庫 最大家族 / HHI / 家族數   →   預設池 最大家族 / HHI");
Object.keys(bank).sort().forEach((k) => {
  const b = bank[k];
  const d = pool[k];
  const loud = b.top.share > taxonomy.SOFT_FAMILY_SHARE || (d && d.top && d.top.share > taxonomy.SOFT_FAMILY_SHARE);
  if (!showAll && !loud) return;
  const flag = d && d.top && d.top.share > taxonomy.SOFT_FAMILY_SHARE ? "  ⚠ 預設池仍超過軟上限" : "";
  console.log(`  ${k.padEnd(15)} ${String(b.total).padStart(4)} 題  ${b.top.fam} ${D.pct(b.top.share)} / ${b.hhi} / ${b.families}   →   ${d.top.fam} ${D.pct(d.top.share)} / ${d.hhi}${flag}`);
});
if (!showAll) console.log(`  （只列最大家族超過 ${D.pct(taxonomy.SOFT_FAMILY_SHARE)} 的格子；--all 全列）`);

console.log("\n曝光上限：全題庫 → 預設池（hard = 預設池超過就紅燈）");
const failures = [];
const bankCaps = D.capChecks(bank);
D.capChecks(pool).forEach((c, i) => {
  const b = bankCaps[i];
  const tag = c.infeasible ? "不可行（家族太少）" : c.ok ? "OK" : c.cap.hard ? "超過 ✗" : "超過（警告）";
  console.log(`  ${c.cap.topic} R${c.rank} ${c.cap.any ? "任一家族" : c.what} ≤ ${D.pct(c.cap.max)}：${D.pct(b.share)} → ${D.pct(c.share)}${c.cap.any ? `（${c.what}）` : ""}  ${tag}`);
  if (!c.ok && c.cap.hard) failures.push(`${c.cap.id}：預設池 ${D.pct(c.share)} > ${D.pct(c.cap.max)}`);
});
D.minFamilyChecks(pool).forEach((c) => {
  console.log(`  ${c.rule.topic} R${c.rank} 家族數 ≥ ${c.rule.min}：${c.families}  ${c.ok ? "OK" : "不足（要補題，權重修不了）"}`);
});

const sat = D.templateSaturation(problems, profiles);
console.log(`\n模板飽和（同一個 noveltyFamily > ${taxonomy.TEMPLATE_SATURATION_WARN} 題）`);
console.log(`  課程核心：${sat.core.length ? sat.core.map(([n, c]) => `${n}×${c}`).join("、") : "無"}`);
console.log(`  預設池：${sat.pool.length ? sat.pool.map(([n, c]) => `${n}×${c}`).join("、") : "無"}（一局最多 1 題同模板，抽題器擋；這裡列的是題庫層的重複）`);

if (failures.length) {
  console.error(`\n方法集中度：${failures.length} 條 hard 上限沒過\n  ${failures.join("\n  ")}`);
  console.error("改 tools/content/method_taxonomy.js 或分類規則之後重跑 node tools/build_problem_profiles.js。");
  process.exit(1);
}
console.log("\nmethod diversity OK");
