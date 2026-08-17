// 產生 src/kernel/skill_tags.js —— 給沒有技巧 tag 的題目補上 skill 對應。
//
// 為什麼需要這支：題庫最早那批核心題（problems.js）與幾個高速反射包
// 是在 tag 系統之前寫的，身上只有校準層自動加的 rank-N。對能力模型來說
// 那等於「這題不屬於任何技巧」，會有 17% 的題目永遠不進弱點分析。
//
// 為什麼不直接把 tag 寫進題目：tags 同時餵給題包抽題（matchesPack）、
// 主線關卡（includeTags / excludeTags）和既有的 8 軸雷達。往題目加 tag
// 會改變抽題結果與雷達數字 —— 那是行為變更，不是補資料。
// 所以補標另存成 id -> skillIds 對照表，只有 skill graph 讀它。
//
// 用法：node tools/backfill_skill_tags.js        產生檔案
//       node tools/backfill_skill_tags.js --dry  只看分類結果不寫檔

"use strict";

const fs = require("fs");
const path = require("path");

global.window = {};
require("./lib/load_problem_sources.js")();
// 刻意不載入既有的 skill_tags.js —— 這支工具要從「只有 tag」的狀態重新分類，
// 否則第二次執行時所有題目都已經有 skill，會產出空表。
const graph = require("../src/kernel/skill_graph.js");

const problems = window.BUZZ_PROBLEMS || [];
const OUT = path.join(__dirname, "..", "src", "kernel", "skill_tags.js");

// ── 分類規則 ────────────────────────────────────────────────────
// 由具體到籠統，第一個命中的 rule 決定 skills。
// 每條 rule 都要能用一句話講清楚為什麼 —— 看不懂的規則就是會標錯的規則。
const RULES = [
  /* ===== 極限 ===== */
  { topic: "limits", why: "多變數路徑極限", test: (s) => /\\lim_\{\(x,\s*y\)/.test(s) || /\(x,y\)\\to/.test(s),
    skills: ["mvcalc.partial"] },
  { topic: "limits", why: "Riemann 和的高階修正項（n(Σ… − 極限)）", test: (s) => /\\sum_\{k=1\}\^n/.test(s) && /\\lim_\{n/.test(s),
    skills: ["limit.riemann", "limit.asymptotic"] },
  { topic: "limits", why: "含定積分的 Taylor 展開比較", test: (s) => /\\int_0\^x/.test(s),
    skills: ["limit.taylor", "integral.ftc"] },
  { topic: "limits", why: "無窮乘積取對數後轉和", test: (s) => /\\prod/.test(s),
    skills: ["limit.exponential", "limit.riemann"] },
  { topic: "limits", why: "上確界的漸近階數", test: (s) => /\\sup/.test(s),
    skills: ["limit.asymptotic"] },
  { topic: "limits", why: "根式相消，先有理化", test: (s) => /\\sqrt\{x\^2/.test(s) && /\\to\s*\\infty/.test(s),
    skills: ["limit.rationalize"] },
  { topic: "limits", why: "1^∞ 型，取對數處理", test: (s) => /\)\^\{1\/x\^?2?\}/.test(s) || /\(1\+x\)\^\{1\/x\}/.test(s),
    skills: ["limit.exponential", "limit.taylor"] },
  { topic: "limits", why: "分母 x^3 以上，必須展開到高階", test: (s) => /\{x\^\{?([3-9])\}?\}\s*$/.test(s) || /\}\{x\^\{?[3-9]\}?\}/.test(s),
    skills: ["limit.taylor"] },
  { topic: "limits", why: "指數 / 對數的標準極限", test: (s) => /e\^|\\ln|\\log|\\cosh/.test(s),
    skills: ["limit.exponential"] },
  { topic: "limits", why: "三角函數的標準極限", test: (s) => /\\sin|\\cos|\\tan|\\sec|\\arctan/.test(s),
    skills: ["limit.trig"] },
  { topic: "limits", why: "多項式比值 / 直接代入", test: () => true,
    skills: ["limit.direct"] },

  /* ===== 微分 ===== */
  { topic: "derivatives", why: "Nabla 運算子", test: (s) => /\\nabla/.test(s),
    skills: ["mvcalc.nabla"] },
  { topic: "derivatives", why: "偏導數", test: (s) => /\\partial/.test(s),
    skills: ["mvcalc.partial"] },
  { topic: "derivatives", why: "條件極值", test: (s) => /subject to|\\text\{Optimize/.test(s),
    skills: ["mvcalc.lagrange"] },
  { topic: "derivatives", why: "Bessel 方程", test: (s) => /\\nu\^2/.test(s),
    skills: ["adv.bessel"] },
  { topic: "derivatives", why: "10 階以上導數，只能靠 Taylor 係數反推", test: (s) => /\\frac\{d\^\{?(\d{2,})\}?\}/.test(s),
    skills: ["diff.higher.extreme", "series.taylor.coeff"] },
  { topic: "derivatives", why: "低階高階導數", test: (s) => /\\frac\{d\^\{?[2-9]\}?\}/.test(s),
    skills: ["diff.higher"] },
  { topic: "derivatives", why: "變數在底也在指數，需取對數微分", test: (s) => /x\^\{?x\}?|x\^\{\\sin x\}|y\s*=\s*x\^x/.test(s),
    skills: ["diff.log"] },
  { topic: "derivatives", why: "反三角函數微分", test: (s) => /\\arctan|\\arcsin|\\arccos/.test(s),
    skills: ["diff.inverse"] },
  { topic: "derivatives", why: "對數內含複合函數，鏈鎖 + 化簡", test: (s) => /\\ln\\left\(|\\log\\left\(|\\ln\(|\\log\(/.test(s),
    skills: ["diff.chain"] },
  { topic: "derivatives", why: "複合函數，外層先微再乘內層", test: (s) => /\^\{?[2-9]\}?\\right\)\^|\\sin\(x\^|e\^\{x\^|\)\^\{?\d\}?/.test(s),
    skills: ["diff.chain"] },
  // 判斷商的微分時要先把 \frac{d}{dx} 這個微分記號本身拿掉，
  // 否則每一題都會被當成有分數。
  { topic: "derivatives", why: "商的微分",
    test: (s) => /\\frac\{[^{}]+\}\{[^{}]+\}/.test(s.replace(/\\frac\{d[^}]*\}\{d[a-z][^}]*\}/g, "")),
    skills: ["diff.basic"] },
  { topic: "derivatives", why: "基本微分律", test: () => true,
    skills: ["diff.basic"] },

  /* ===== 積分 ===== */
  { topic: "integrals", why: "重積分", test: (s) => /\\iint|\\int_0\^\\infty\\int|dx\s*\\,\s*dy|\\,dx\\,dy/.test(s),
    skills: ["integral.double"] },
  // Beta / Gamma 必須排在「帶參數」之前：B(a,b)=Γ(a)Γ(b)/Γ(a+b) 開頭長得像
  // 參數積分，但它考的是 Beta 函數本身。
  { topic: "integrals", why: "Beta 函數原型", test: (s) => /x\^\{a-1\}\(1-x\)\^\{b-1\}|B\(a,b\)\s*=/.test(s),
    skills: ["integral.beta"] },
  { topic: "integrals", why: "Gamma 函數原型", test: (s) => /x\^\{s-1\}e\^\{-x\}|\\Gamma\(/.test(s),
    skills: ["integral.gamma"] },
  { topic: "integrals", why: "帶參數且要對參數微分", test: (s) => /^[A-Z]\(a[,)]|F\(a|G\(a|H\(a|B\(a|C\(a|Q\(a/.test(s),
    skills: ["integral.parameter", "integral.improper"] },
  { topic: "integrals", why: "Frullani 型（兩指數相減除以 x）", test: (s) => /e\^\{-?\w*x\}-e\^\{-?\w*x\}/.test(s),
    skills: ["integral.frullani", "integral.improper"] },
  { topic: "integrals", why: "Gaussian 積分", test: (s) => /e\^\{-\d*x\^2\}/.test(s),
    skills: ["integral.special", "integral.improper"] },
  { topic: "integrals", why: "Bose/Fermi 型，展開成 zeta 級數", test: (s) => /\{e\^x[+-]1\}/.test(s),
    skills: ["integral.special", "integral.improper"] },
  { topic: "integrals", why: "log 冪次除以 1±x，逐項積分成 zeta", test: (s) => /\(\\log x\)\^\{?\d\}?\}?\{1[+-]x\}/.test(s) || (/\(\\log x\)\^/.test(s) && /\{1[+-]x\}/.test(s)),
    skills: ["integral.log", "series.euler"] },
  { topic: "integrals", why: "Wallis 型 sin^n / cos^n", test: (s) => /\\sin\^n|\\cos\^n|\\sin\^\{?[2-9]\}?\s*x|\\cos\^\{?[2-9]\}?\s*x/.test(s),
    skills: ["integral.wallis", "integral.trig"] },
  { topic: "integrals", why: "King's property（f(x)+f(a-x) 對稱）", test: (s) => /f\(x\)\+f\(1-x\)|\(1\+e\^\{?x\}?\)/.test(s),
    skills: ["integral.kings"] },
  { topic: "integrals", why: "無窮區間上的振盪積分", test: (s) => /\\infty/.test(s) && /\\sin|\\cos|\\arctan/.test(s),
    skills: ["integral.dirichlet", "integral.improper"] },
  // 換元必須排在分部與部分分式之前：∫x·e^{x²}dx 長得像「乘積型」，
  // 但內層導數就在外面，那是 u-sub 不是 IBP；∫2x/(1+x²)dx 同理不是部分分式。
  { topic: "integrals", why: "內層導數就在外面，直接換元",
    test: (s) => /x\s*\\?,?\s*e\^\{x\^2\}|x\\cos\(x\^\d\)|x\\sin\(x\^\d\)|\\frac\{\d*x\^?\d*\}\{1\+x\^\d\}|\\frac\{\\sin x\}\{1\+\\cos x\}|\\frac\{x\^2\}\{1\+x\^3\}/.test(s),
    skills: ["integral.usub"] },
  { topic: "integrals", why: "多項式乘超越函數，需重複分部", test: (s) => /x\^\{?[3-9]\}?\s*(e\^|\\sin|\\cos|\\arctan|\\log|\\ln)/.test(s) || /\(\\log x\)\^\{?[3-9]\}?\\,dx/.test(s),
    skills: ["integral.ibp.cyclic", "integral.ibp"] },
  { topic: "integrals", why: "乘積型，分部積分", test: (s) => /x\s*(e\^|\\sin|\\cos|\\ln|\\log|\\arctan)|e\^x\\sin|\(\\ln x\)\^2|\\log\(1\+x\)|\\ln\(1\+x\)/.test(s),
    skills: ["integral.ibp"] },
  // 1/(x²+a²) 與配方後的同型是反三角標準式，歸在三角代換家族。
  { topic: "integrals", why: "反三角標準式 / 配方後代換", test: (s) => /\\sqrt\{a\^2-x\^2\}|\\frac\{1\}\{x\^2\+\d\}|\\frac\{dx\}\{x\^2[+-]\d?x[+-]\d\}|\\frac\{1\}\{1\+x\^2\}|\\frac\{dx\}\{1\+\\?s?i?n?/.test(s),
    skills: ["integral.trigsub"] },
  { topic: "integrals", why: "假分式，先多項式除法再拆項", test: (s) => /\\frac\{x\^\{?[2-9]\}?\}\{1?\+?x\^2[+)]?|\\frac\{x\^\{?[2-9]\}?\}\{x\^2\+1\}/.test(s),
    skills: ["integral.partialfrac"] },
  { topic: "integrals", why: "有理函數拆分", test: (s) => /\\frac\{[^}]*\}\{[^}]*x\^2[^}]*\}|\{x\^2-1\}|\{1\+x\+x\^2\}/.test(s),
    skills: ["integral.partialfrac"] },
  { topic: "integrals", why: "瑕積分", test: (s) => /\\int_0?\^?\{?\\infty|_\{-\\infty\}|\\infty/.test(s),
    skills: ["integral.improper"] },
  { topic: "integrals", why: "基本反導數", test: () => true,
    skills: ["integral.basic"] },

  /* ===== 級數 ===== */
  { topic: "series", why: "求展開式係數", test: (s) => /Coefficient of/.test(s),
    skills: ["series.taylor.coeff"] },
  { topic: "series", why: "收斂半徑", test: (s) => /Radius of convergence/.test(s),
    skills: ["series.power.radius"] },
  { topic: "series", why: "收斂區間端點", test: (s) => /interval of convergence|after finding \}R|R=1/.test(s),
    skills: ["series.power.radius"] },
  { topic: "series", why: "調和數生成函數", test: (s) => /H_n/.test(s),
    skills: ["series.euler", "series.generating"] },
  { topic: "series", why: "無窮乘積", test: (s) => /\\prod/.test(s),
    skills: ["series.telescoping"] },
  { topic: "series", why: "雙階乘 / 中心二項式", test: (s) => /!!/.test(s),
    skills: ["series.euler"] },
  { topic: "series", why: "階乘比值，用 ratio test", test: (s) => /n!|\(2n\)!/.test(s),
    skills: ["series.ratio"] },
  { topic: "series", why: "交錯級數", test: (s) => /\(-1\)\^/.test(s),
    skills: ["series.alternating"] },
  { topic: "series", why: "n 的冪除以幾何項，微分生成函數求和", test: (s) => /\\frac\{n\^?\{?\d*\}?\}\{\d\^n\}/.test(s),
    skills: ["series.sum", "series.generating"] },
  { topic: "series", why: "部分分式後望遠鏡相消", test: (s) => /\\frac\{1\}\{n\(n\+\d\)\}/.test(s),
    skills: ["series.telescoping"] },
  { topic: "series", why: "zeta 值", test: (s) => /\\frac\{1\}\{n\^\{?[2-9]\}?\}|\(2n-1\)\^\{?[2-9]\}?/.test(s),
    skills: ["series.euler", "series.geometric"] },
  { topic: "series", why: "等比 / p 級數本身", test: (s) => /\\left\(\\frac\{\d\}\{\d\}\\right\)\^n|\\frac\{\d\^n\}|\\frac\{1\}\{n\}|\\frac\{1\}\{\\sqrt n\}/.test(s),
    skills: ["series.geometric"] },
  { topic: "series", why: "與 p 級數 / 幾何級數比較", test: () => true,
    skills: ["series.compare"] },

  /* ===== 物理 =====
     「power」這個 tag 在微積分裡是次方、在物理裡是功率，語意衝突，
     所以它被列進 NON_SKILL_TAGS，這幾題改由題幹補回。*/
  { topic: "physics", why: "平均功率", test: (s) => /功率/.test(s),
    skills: ["phys.energy"] },
  { topic: "physics", why: "等溫膨脹作功", test: (s) => /等溫|膨脹|atm/.test(s),
    skills: ["phys.thermo"] }
];

/* ── 執行分類 ─────────────────────────────────────────────────── */
const assignments = {};
const byRule = new Map();
const unresolved = [];

problems.forEach((problem) => {
  if (graph.skillsForProblem(problem).length) return; // 已經有 skill，不動
  const text = String(problem.prompt || "");
  const rule = RULES.find((r) => r.topic === problem.topic && r.test(text));
  if (!rule) {
    unresolved.push(problem);
    return;
  }
  // 只保留圖上真的存在的節點，避免規則寫錯 id 卻靜默通過
  const skills = rule.skills.filter((id) => graph.byId(id));
  const bad = rule.skills.filter((id) => !graph.byId(id));
  if (bad.length) {
    console.error(`規則「${rule.why}」指向不存在的 skill：${bad.join(", ")}`);
    process.exitCode = 1;
  }
  if (!skills.length) {
    unresolved.push(problem);
    return;
  }
  assignments[problem.id] = skills;
  if (!byRule.has(rule.why)) byRule.set(rule.why, []);
  byRule.get(rule.why).push(problem);
});

/* ── 報告 ─────────────────────────────────────────────────────── */
console.log(`補標 ${Object.keys(assignments).length} 題（題庫共 ${problems.length} 題）\n`);
const sorted = [...byRule.entries()].sort((a, b) => b[1].length - a[1].length);
sorted.forEach(([why, list]) => {
  const skills = assignments[list[0].id].join(" + ");
  console.log(`${String(list.length).padStart(4)} 題  ${why}`);
  console.log(`        -> ${skills}`);
  list.slice(0, 3).forEach((p) => console.log(`        e.g. ${p.id}  ${p.prompt.slice(0, 60)}`));
});

if (unresolved.length) {
  console.log(`\n仍無法分類 ${unresolved.length} 題：`);
  unresolved.slice(0, 20).forEach((p) => console.log(`  ${p.id} [${p.topic}] ${p.prompt.slice(0, 60)}`));
}

/* ── 輸出 ─────────────────────────────────────────────────────── */
if (process.argv.includes("--dry")) {
  console.log("\n--dry：沒有寫檔");
  return;
}

const entries = Object.keys(assignments).sort().map((id) => `    "${id}": [${assignments[id].map((s) => `"${s}"`).join(", ")}]`);
const banner = `// 自動產生 —— 不要手改。來源：tools/backfill_skill_tags.js
//
// 早期題目（problems.js 與幾個高速反射包）沒有技巧 tag，只有校準層加的
// rank-N。這張表補上它們的 skill 對應，讓能力模型不會漏掉 17% 的題庫。
//
// 為什麼不寫進 problem.tags：tags 會餵給題包抽題、主線關卡與既有 8 軸雷達，
// 動它等於改變抽題結果。這張表只有 skill graph 讀。
//
// 重新產生：node tools/backfill_skill_tags.js
`;
const body = `${banner}
(function () {
  "use strict";

  const SKILL_TAGS = {
${entries.join(",\n")}
  };

  if (typeof module !== "undefined" && module.exports) module.exports = SKILL_TAGS;
  if (typeof window !== "undefined") window.BUZZ_SKILL_TAGS = SKILL_TAGS;
})();
`;
fs.writeFileSync(OUT, body, "utf8");
console.log(`\n已寫入 src/kernel/skill_tags.js（${entries.length} 筆）`);
