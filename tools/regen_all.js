// 內容產生器一鍵重跑（照正確順序）。
//
// 改動題庫之後要重跑的產生器有七支，順序有意義：
//   uid → rubric 反推 → REVIEWED 落地 → origin → skill_tags
//   → 每日一題釘選 → 驗算側表 → 對外數字 → 英文句型表（解說／提示改了數字，句型沒變的話英文自動跟上）
// 忘記其中一支的下場是 validate_content_metadata / verify --ci 紅燈，
// 或者更糟 —— 安靜地上線過期的中繼資料。
//
// 用法：
//   node tools/regen_all.js           全部重跑
//   node tools/regen_all.js --check   重跑後驗證「產物沒有 diff」——
//                                     忘記重跑產生器的 PR 會在這裡紅燈。
//                                     （daily_one_history 除外：它每天長一格，
//                                       新鮮度由 validate_daily_one 的 7 天寬限把關）

"use strict";

const { execSync } = require("child_process");
const path = require("path");

const checkMode = process.argv.includes("--check");
const root = path.join(__dirname, "..");

const STEPS = [
  ["uid", "node tools/assign_uids.js"],
  ["rubric 反推", "node tools/backfill_rubric.js"],
  ["人工三軸落地", "node tools/apply_reviewed_rubric.js"],
  ["origin", "node tools/backfill_origin.js"],
  ["skill tags", "node tools/backfill_skill_tags.js"],
  ["每日一題釘選", "node tools/pin_daily_one.js"],
  ["驗算側表", "node tools/verify_answers.js"],
  ["對外數字", "node tools/validate_public_claims.js --update"],
  ["英文句型表", "node tools/build_i18n_text.js"],
  // 新版課程：tools/content/course_v2/ → src/course_v2/（大綱＋每一章的課文）。改了課文或大綱忘記打包，--check 會紅。
  ["新版課程", "node tools/build_course_v2.js"]
];

for (const [label, command] of STEPS) {
  process.stdout.write(`── ${label}：${command}\n`);
  execSync(command, { cwd: root, stdio: ["ignore", "inherit", "inherit"] });
}

if (checkMode) {
  // 產物路徑（--check 只看這些；daily_one_history 因日期成長排除）
  const GENERATED = [
    "src/kernel/uid_map.js",
    "src/kernel/rubric.js",
    "src/kernel/origin.js",
    "src/kernel/skill_tags.js",
    "src/kernel/verified_answers.js",
    "src/kernel/i18n_text_en.js",
    "src/course_v2",
    "reports/answer-verification.json",
    "README.md",
    "about.html"
  ];
  const dirty = execSync(`git status --porcelain -- ${GENERATED.join(" ")}`, { cwd: root })
    .toString().trim();
  if (dirty) {
    console.error("\n產生器的產物跟版控不同步（改了題庫忘記重跑產生器？）：");
    console.error(dirty);
    console.error("\n跑 node tools/regen_all.js 之後把 diff 一起 commit。");
    process.exit(1);
  }
  console.log("\nregen check OK：所有產物與版控一致");
} else {
  console.log("\nregen 完成。");
}
