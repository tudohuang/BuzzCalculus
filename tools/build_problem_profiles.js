// 產生 src/kernel/problem_profiles.js —— 每題的側寫（方法家族、模板母題、先修課、角色、預設權重…）。
//
// 規則在 tools/lib/problem_profiles.js，分類表在 tools/content/method_taxonomy.js，
// 人工覆寫在 tools/content/problem_profile_overrides.json。題目物件一個字都不動（content-side-tables 的慣例）。
//
// 用法：
//   node tools/build_problem_profiles.js            產生側表，印覆蓋率與各主題×rank 的家族分布
//   node tools/build_problem_profiles.js --dry      只印，不寫檔
//   node tools/build_problem_profiles.js --review   另外匯出高曝光題（課程核心、魔王、考卷、每日一題的歷史）
//                                                   的自動分類 CSV 給人工複核：docs/report/stats/profile-review.csv（gitignored）
//
// 產物：src/kernel/problem_profiles.js（lazy 群組 sampler，開站閒下來才載；給 src/kernel/sampler.js 用）
//       reports/problem-profiles.json（完整八欄＋分類信心，gitignored，給報表與 Phase 3 用）

"use strict";

const fs = require("fs");
const path = require("path");

const load = require("./lib/app_api.js");
load();
const problems = load.allProblems();
const win = global.window;
const { buildProfiles, encodeRuntime } = require("./lib/problem_profiles.js");
const taxonomy = require("./content/method_taxonomy.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src", "kernel", "problem_profiles.js");
const args = process.argv.slice(2);

const built = buildProfiles(problems, win);
const { profiles, meta } = built;

/* ── 報告 ─────────────────────────────────────────────────────── */
const conf = {};
meta.forEach((m) => { conf[m.confidence] = (conf[m.confidence] || 0) + 1; });
console.log(`側寫 ${profiles.size} 題；主要家族的分類信心：${Object.entries(conf).map(([k, v]) => `${k} ${v}`).join("、")}`);
const clusters = [...built.clusterMembers.values()];
const sizes = {};
clusters.forEach((c) => { const k = c.length >= 10 ? "10+" : String(c.length); sizes[k] = (sizes[k] || 0) + 1; });
console.log(`模板母題 ${clusters.length} 群：大小分布 ${Object.entries(sizes).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10)).map(([k, v]) => `${k}題×${v}`).join("、")}`);
console.log(`最大的 8 群：${clusters.sort((a, b) => b.length - a.length).slice(0, 8).map((c) => `${c[0]}(${c.length})`).join("、")}`);
const gated = [...profiles.values()].filter((p) => p.prerequisiteGate.length).length;
console.log(`有先修課的題 ${gated} / ${profiles.size}`);
if (args.includes("--verbose")) {
  const cell = {};
  problems.forEach((p) => {
    const k = `${p.topic} R${p.rank}`;
    const fam = profiles.get(p.id).methodFamily[0];
    cell[k] = cell[k] || {};
    cell[k][fam] = (cell[k][fam] || 0) + 1;
  });
  Object.keys(cell).sort().forEach((k) => {
    const total = Object.values(cell[k]).reduce((a, b) => a + b, 0);
    console.log(`  ${k}（${total}）：${Object.entries(cell[k]).sort((a, b) => b[1] - a[1]).map(([f, n]) => `${f} ${n}`).join("、")}`);
  });
}

/* ── 完整側寫（gitignored，給報表與下一階段）───────────────────── */
const full = {};
problems.forEach((p) => { full[p.id] = { ...profiles.get(p.id), _meta: meta.get(p.id) }; });

if (args.includes("--review")) {
  const dir = path.join(ROOT, "docs", "report", "stats");
  fs.mkdirSync(dir, { recursive: true });
  const history = new Set(Object.values(win.BUZZ_DAILY_ONE_HISTORY || {}));
  const esc = (v) => `"${String(v === undefined || v === null ? "" : v).replace(/"/g, '""')}"`;
  const head = ["id", "topic", "rank", "exposure", "confidence", "how", "methodFamily", "alternatives", "rule", "learningRole", "prerequisiteGate", "noveltyFamily", "defaultWeight", "prompt"];
  const lines = [head.join(",")];
  const rankConf = { low: 0, medium: 1, high: 2, manual: 3 };
  const rows = problems.map((p) => {
    const pr = profiles.get(p.id);
    const m = meta.get(p.id);
    const exposure = [
      pr.learningRole.includes("course_core") && "course_core",
      pr.learningRole.includes("course_extra") && "course",
      pr.learningRole.includes("boss") && "boss",
      Object.values(win.BUZZ_LECTURE_PAPERS || {}).some((x) => (x.ids || []).includes(p.id)) && "exam_paper",
      history.has(p.id) && "daily_one"
    ].filter(Boolean);
    return { p, pr, m, exposure };
  }).filter((r) => r.exposure.length)
    .sort((a, b) => (rankConf[a.m.confidence] - rankConf[b.m.confidence]) || (b.exposure.length - a.exposure.length));
  rows.forEach(({ p, pr, m, exposure }) => {
    lines.push([p.id, p.topic, p.rank, exposure.join(" "), m.confidence, m.how, pr.methodFamily.join(" "), m.alternatives.join(" "), m.why,
      pr.learningRole.join(" "), pr.prerequisiteGate.join(" "), pr.noveltyFamily, pr.defaultWeight, String(p.prompt).slice(0, 160)].map(esc).join(","));
  });
  const file = path.join(dir, "profile-review.csv");
  fs.writeFileSync(file, `﻿${lines.join("\n")}\n`, "utf8");
  console.log(`人工複核清單：${path.relative(ROOT, file)}（${rows.length} 題；信心 low ${rows.filter((r) => r.m.confidence === "low").length}、medium ${rows.filter((r) => r.m.confidence === "medium").length}）`);
}

if (args.includes("--dry")) {
  console.log("--dry：沒有寫檔");
  process.exit(0);
}

fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "reports", "problem-profiles.json"), JSON.stringify(full, null, 1), "utf8");

const runtime = encodeRuntime(problems, built);
const banner = `// 自動產生 —— 不要手改。來源：tools/build_problem_profiles.js
//
// 每題的側寫（題庫精修提案 v1.0）：方法家族、模板母題、先修課、學習角色、預設抽題權重。
// 規則 tools/lib/problem_profiles.js、分類表 tools/content/method_taxonomy.js、人工覆寫 tools/content/problem_profile_overrides.json。
// 一列 = id \\t 家族索引(36 進位, . 分隔) \\t 模板母題(空 = 自己) \\t 權重 0–100 \\t 角色位元(36 進位) \\t 先修課索引(36 進位, . 分隔)
//        \\t 模板母題 id(variantOf／tmpl-*) \\t 來源題包索引。解碼與抽題在 src/kernel/sampler.js。
// rank 不在這裡：rank 永遠由 src/kernel/rubric.js 的三軸決定。
//
// 重新產生：node tools/build_problem_profiles.js（regen_all.js 會跑）
`;
const body = `${banner}
window.BuzzProblemProfiles = ${JSON.stringify(runtime)};
`;
fs.writeFileSync(OUT, body, "utf8");
console.log(`已寫入 src/kernel/problem_profiles.js（${problems.length} 題，${Math.round(Buffer.byteLength(body) / 1024)}KB）`);
void taxonomy;
