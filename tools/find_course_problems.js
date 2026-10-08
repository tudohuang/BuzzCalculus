// 寫新版課程時找推薦題：用 tag、題號前綴或題幹關鍵字搜題庫。
//
// 用法：
//   node tools/find_course_problems.js rationalize            tag 完全相同
//   node tools/find_course_problems.js "\\sqrt" --topic limits 題幹含這段字
//   node tools/find_course_problems.js mob-gamma               題號前綴
//   選項：--topic limits|derivatives|integrals|series  --max-rank 3  --limit 40  --all（含未驗算）
"use strict";

const load = require("./lib/app_api.js");

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const flags = new Set(args.filter((a) => a.startsWith("--")));
const terms = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && !["--all"].includes(args[i - 1])));
if (!terms.length) {
  console.error("用法：node tools/find_course_problems.js <tag | 題號前綴 | 題幹關鍵字> [--topic t] [--max-rank n] [--limit n] [--all]");
  process.exit(1);
}

load();
const verified = global.window.BuzzVerifiedAnswers;
const isVerified = (id) => Boolean(verified && verified.has && verified.has(id));
const topic = opt("--topic", null);
const maxRank = Number(opt("--max-rank", 6));
const limit = Number(opt("--limit", 40));

const problems = load.allProblems().filter((p) => {
  if (topic && p.topic !== topic) return false;
  if (Number(p.rank || 0) > maxRank) return false;
  if (!flags.has("--all") && !isVerified(p.id)) return false;
  return terms.every((term) => (p.tags || []).includes(term) || String(p.id).startsWith(term) || String(p.prompt).includes(term));
});
problems.sort((a, b) => (a.rank || 0) - (b.rank || 0) || String(a.id).localeCompare(String(b.id)));
problems.slice(0, limit).forEach((p) => {
  const tags = (p.tags || []).filter((t) => !/^(rank-|boss|lecture|exam-style|midterm|beginner)/.test(t)).slice(0, 5).join(",");
  console.log(`${p.id}\tR${p.rank}\t${p.answerKind}\t${isVerified(p.id) ? "已驗算" : "未驗算"}\t${String(p.prompt).slice(0, 90)}\t答：${String(p.answer ?? p.canonical ?? "").slice(0, 30)}\t[${tags}]`);
});
console.log(`— 共 ${problems.length} 題${problems.length > limit ? `（只列前 ${limit} 題）` : ""}`);
