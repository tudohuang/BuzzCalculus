// 對外講的數字必須是真的。
//
// about.html 整頁的論點是「這裡的數字可以相信」——
// 然後它自己寫著 1,459 題、774 題通過驗算，而實際是 1,605 與 906。
// 沒有人是故意的：題庫每加一包就漂一次，而漂掉的方式是安靜的。
//
// 一個免費工具寫錯數字是小事；一個要收錢的產品寫錯數字，
// 那是對外的不實陳述，而且剛好是在最不該出錯的那一段文字上。
// 所以跟 spec 現況快照一樣，把它變成 CI 擋得住的東西。
//
// 作法：對外頁面上每一個「會跟著題庫變」的數字都掛 data-claim="<key>"，
// 這支程式從真實資料算出同一個 key 的值再比對。
// 沒掛標記的數字不在管轄範圍內（那些是不會漂的敘述性數字）。
//
//   node tools/validate_public_claims.js            比對，不一致就 exit 1
//   node tools/validate_public_claims.js --update   直接改寫頁面上的數字

const fs = require("fs");
const path = require("path");

global.window = {};
require("./lib/load_problem_sources.js")();

const root = path.join(__dirname, "..");
const update = process.argv.includes("--update");
const problems = window.BUZZ_PROBLEMS || [];

// 驗算側表是 tools/verify_answers.js --ci 寫出來的，
// 也就是「CI 真的算過並且對得上」的那一份，不是這裡另外數的。
function verifiedCount() {
  const file = path.join(root, "src/kernel/verified_answers.js");
  if (!fs.existsSync(file)) return null;
  const scope = { window: {} };
  const source = fs.readFileSync(file, "utf8");
  new Function("window", source)(scope.window);
  const api = scope.window.BuzzVerifiedAnswers;
  if (!api) return null;
  if (typeof api.count === "number") return api.count;
  if (api.ids && typeof api.ids.length === "number") return api.ids.length;
  const table = api.table || api.map || api.verified;
  return table ? Object.keys(table).length : null;
}

const grouped = (key) => problems.filter((p) => p.topic === key).length;

// 作業本的商品說明數字。來源是 tools/generate_workbook.js 寫出來的側表，
// 不是人抄的 —— 商品說明寫錯就是不實陳述，而題庫每擴充一次它就會漂。
const facts = (() => {
  const file = path.join(root, "src/kernel/workbook_facts.js");
  return fs.existsSync(file) ? require(file) : null;
})();
const pricing = (() => {
  const file = path.join(root, "src/kernel/pricing.js");
  return fs.existsSync(file) ? require(file) : null;
})();
const fact = (pick) => () => (facts ? pick(facts) : null);

const CLAIMS = {
  problems: () => problems.length,
  verified: verifiedCount,
  // 不符數是 0 —— 這是整套品質論述的重點，寫死成期望值：
  // 有一天它不是 0，這支驗證器就該紅，而不是默默把數字改大。
  mismatch: () => 0,
  limits: () => grouped("limits"),
  derivatives: () => grouped("derivatives"),
  integrals: () => grouped("integrals"),
  series: () => grouped("series"),
  workbookSections: fact((f) => f.sections),
  workbookExamSets: fact((f) => f.examSets),
  bandLow: fact((f) => f.rankBands.r1r2),
  bandMid: fact((f) => f.rankBands.r3r4),
  bandHigh: fact((f) => f.rankBands.r5r6),
  // 頁數只有 XeLaTeX 跑完才知道，所以它是作者維護的數字（在 pricing.js 裡），
  // 這裡只保證「頁面上寫的」跟「那個唯一來源」一致。
  workbookPages: () => (pricing ? pricing.workbook.pages : null),
  // 給「頁面上手寫了金額」的情況用（例如之後的著陸頁寫 NT$380）。
  // workbook.html 的價格是執行時從 pricing.js 讀出來組的，本來就不會漂，
  // 所以那裡不掛標記 —— 掛了反而會在還沒定價時假性失敗。
  workbookPrice: () => (pricing ? pricing.workbook.price : null),
  refundDays: () => (pricing ? pricing.refundDays : null)
};

// 數字寫成 1,605 這種千分位；比對前後都要能互轉
function format(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// HTML 用 data-claim 屬性；Markdown 沒有屬性，用 HTML 註解框起來
// （GitHub 的渲染器會把註解吃掉，讀者只看得到數字本身）。
const MARKERS = [
  { test: /\.html$/, pattern: /(<([a-z]+)[^>]*\sdata-claim="([a-zA-Z]+)"[^>]*>)([^<]*)(<\/\2>)/g, keyAt: 3, bodyAt: 4, wrap: (m, body) => m[1] + body + m[5] },
  { test: /\.md$/, pattern: /(<!--claim:([a-zA-Z]+)-->)([^<]*)(<!--\/claim-->)/g, keyAt: 2, bodyAt: 3, wrap: (m, body) => m[1] + body + m[4] }
];

const PAGES = ["about.html", "README.md", "workbook.html"];
const failures = [];
let checked = 0;
let rewritten = 0;

console.log("對外數字");

PAGES.forEach((name) => {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return;
  const marker = MARKERS.find((entry) => entry.test.test(name));
  if (!marker) return;
  let source = fs.readFileSync(file, "utf8");
  const seen = [];
  let touched = 0;
  source = source.replace(marker.pattern, (...args) => {
    const groups = args.slice(0, -2);
    const whole = groups[0];
    const key = groups[marker.keyAt];
    const body = groups[marker.bodyAt];
    const resolve = CLAIMS[key];
    if (!resolve) {
      failures.push(`${name} 的 claim "${key}" 沒有對應的真實來源`);
      return whole;
    }
    const actual = resolve();
    if (actual === null || actual === undefined) {
      failures.push(`${name} 的 claim "${key}" 算不出實際值`);
      return whole;
    }
    checked += 1;
    // 保留數字兩側的文字（「1,605 題」的「題」）
    const written = (body.match(/[\d,]+/) || [""])[0];
    // 千分位是排版風格，不是事實 —— about.html 寫 1,605、README 寫 1605
    // 都對。比對只看數值，改寫時沿用原本那一頁的寫法。
    const expected = written.includes(",") || !written ? format(actual) : String(actual);
    seen.push(`${name} ${key} ${written || "(空)"} → ${expected}`);
    if (written.replace(/,/g, "") === String(actual)) return whole;
    if (!update) {
      failures.push(`${name} 寫 ${key} = ${written || "(空)"}，實際是 ${expected}`);
      return whole;
    }
    touched += 1;
    rewritten += 1;
    return marker.wrap(groups, body.replace(/[\d,]+/, expected));
  });
  seen.forEach((line) => console.log("  " + line));
  if (update && touched) fs.writeFileSync(file, source, "utf8");
});

console.log(`  檢查 ${checked} 個標記`);

if (!checked) {
  console.error("\n一個 data-claim 標記都沒找到 —— 對外數字等於完全沒有把關。");
  process.exit(1);
}

/* ── 開賣前的最後一道閘 ───────────────────────────────────── */
// published 一旦是 true，購買按鈕就會出現在真實使用者面前。
// 這裡確認該有的東西都有，免得出現「按鈕在、金額是 null」這種頁面。
if (pricing) {
  const book = pricing.workbook || {};
  if (pricing.published) {
    if (!Number.isInteger(book.price) || book.price <= 0) {
      failures.push("pricing.js 已 published，但 workbook.price 不是正整數");
    }
    if (!/^https:\/\//.test(book.checkoutUrl || "")) {
      failures.push("pricing.js 已 published，但 checkoutUrl 不是 https 網址");
    }
    if (book.compareAt !== null && !(Number.isInteger(book.compareAt) && book.compareAt > book.price)) {
      // 假的「原價」是最沒必要的一種不誠實，而且在台灣是有法律風險的
      failures.push("compareAt 要嘛是 null，要嘛必須大於實際售價");
    }
  } else {
    console.log("  pricing published=false（購買按鈕不會出現）");
  }
}

if (update) {
  console.log(rewritten ? `\n已更新 ${rewritten} 個數字` : "\n數字本來就是對的");
  process.exit(0);
}

if (failures.length) {
  console.error(`\n對外數字跟實際不符（${failures.length}）：`);
  failures.forEach((line) => console.error("  " + line));
  console.error("\n這些數字是講給使用者聽的承諾。跑這個更新：node tools/validate_public_claims.js --update");
  process.exit(1);
}

console.log("\npublic claims OK");
