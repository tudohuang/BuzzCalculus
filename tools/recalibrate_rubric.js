// 從題目本身的特徵重新推導難度三軸（不是從現行 rank 反推）
//
// 跟 backfill_rubric.js 的差別，是這支存在的全部理由：
//
//   backfill_rubric.js   從**現行 rank** 反推三軸。用途是遷移：讓 rank 一個都不變。
//                        代價是它把現行 rank 的所有毛病原封不動繼承下來。
//   recalibrate_rubric.js 從**題目的特徵**推三軸，rank 跟著三軸走。
//                        會改變 rank，而那正是重點。
//
// 為什麼非改不可：現行難度是 problem_difficulty_calibration.js 的
// MIN_RANK_BY_TAG「標籤地板」決定的，而地板只會抬不會降。結果是
//
//   - 名字叫「高速反射包」的 226 題有 96% 是 R5+
//   - ∫x³/√(1+x²)dx 這種標準 u-substitution 被標成 R6
//   - 任何帶 multivariable 的題自動 ≥R4，∫₀¹∫₀¹(x+y)dydx 也不例外
//   - R6 佔全庫 32.4%，spec 目標是 5%
//
// 對一個剛開始練的人來說，隨機抽到的題有三分之一是最難那級。
// 這是留存的直接殺手，而且它不是內容問題，是標籤問題。
//
// 三軸各自的推導依據（spec 05.1 的定義）：
//
//   Obscurity  技巧冷門度。直接讀 skill_graph 的 obscurity —— 那是 77 個節點
//              逐一標註的，是這三軸裡唯一有人工判斷背書的。
//              （注意不是 tier：tier 是前置深度，偏導數 tier 高但課本必教。）
//   Steps      解題步數。用「需要幾個不同技巧」＋「題幹有沒有巢狀運算子」。
//              ∫ 套在 lim 裡、疊積分、高階導數、代入求值，每一個都是多一步。
//   Load       計算負擔。用題幹的 token 數當客觀的式子大小指標，
//              再看有沒有定積分求值（要代上下限）。
//              **刻意不用 timeLimit**：作答秒數上限跟 rank 一樣是作者估的，
//              用它會把同一份偏誤再吃進來一次。
//
// 用法：
//   node tools/recalibrate_rubric.js --dry    只看分佈與樣本，不寫檔
//   node tools/recalibrate_rubric.js          寫入 src/kernel/rubric.js

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const latex = require("./lib/latex.js");
const rubricRank = require("./lib/rubric_rank.js");

const dryRun = process.argv.includes("--dry");
loadAppApi();
const problems = loadAppApi.allProblems();
const skillGraph = global.window.BuzzSkillGraph;
// 人工複核的判斷放在獨立檔案，因為 rubric.js 每次重跑都會被覆寫。
const REVIEWED = require(path.join(__dirname, "..", "src", "kernel", "rubric_reviewed.js"));

// 舊演算法（MIN_RANK_BY_TAG 標籤地板）算出來的 rank。
//
// 為什麼要特地把它算回來：這支工具寫完之後，problem.rank 已經是
// **這支工具自己的產物**了。直接拿 problem.rank 當「作者原本的判斷」，
// 第二次執行時就會變成拿自己的輸出當輸入 —— 報告會顯示「變動 0 題」，
// 而「沒有證據就沿用作者判斷」那條規則會沿用到我自己上一輪的推導，
// 原始的作者判斷永遠回不來了。
//
// 舊演算法的實作還在（fallback 路徑），把 BuzzRubric 暫時拿掉就會走它。
const LEGACY_RANK = (() => {
  const rubric = global.window.BuzzRubric;
  global.window.BuzzRubric = null;
  const table = {};
  problems.forEach((problem) => {
    table[problem.id] = global.window.BUZZ_DIFFICULTY.calibratedRank(problem);
  });
  global.window.BuzzRubric = rubric;
  return table;
})();

// 「沒有證據」時要沿用的三軸，必須重現**舊演算法**的 rank，
// 而不是現在存檔裡那一份（那份已經是這支工具的輸出）。
function axesReproducing(targetRank, skillCount) {
  let best = null;
  for (let steps = 1; steps <= 3; steps += 1) {
    for (let obscurity = 1; obscurity <= 3; obscurity += 1) {
      for (let load = 1; load <= 3; load += 1) {
        if (rubricRank({ steps, obscurity, load }, skillCount) !== targetRank) continue;
        const spread = Math.abs(steps - 2) + Math.abs(obscurity - 2) + Math.abs(load - 2);
        if (!best || spread < best.spread) best = { steps, obscurity, load, spread };
      }
    }
  }
  return best ? { steps: best.steps, obscurity: best.obscurity, load: best.load } : null;
}

/* ── 三軸推導 ─────────────────────────────────────────────── */

function skillsOf(problem) {
  try {
    return skillGraph.skillsForProblem(problem) || [];
  } catch (_error) {
    return [];
  }
}

function obscurityOf(skills, problem) {
  const values = skills.map((id) => (skillGraph.byId(id) || {}).obscurity || 1);
  let value = values.length ? Math.max(...values) : 1;
  // 「這個級數收斂嗎」的答案永遠是課本那幾個判別法，不管那個級數的**和**
  // 有多難求。Σ1/n² 的和是 π²/6（Euler 和，冷門度 3），
  // 但問它收不收斂只需要 p 級數 —— 那是課本第一章。
  // 不設這個上限，一堆送分的收斂題會因為「和很難算」被推到 R5。
  const says = String(problem.canonical || (problem.answers || [])[0] || "");
  if (problem.answerKind === "text" && /收斂|發散|converg|diverg/i.test(says)) {
    value = Math.min(value, 2);
  }
  // 無窮區間上的代數型積分：標籤常常只寫 improper 或 partial-fraction，
  // 但真正的難處是「要用哪個特殊工具才算得出值」。
  if (problem.answerKind !== "text" && isAlgebraicImproper(problem.prompt || "")) {
    value = Math.max(value, 3);
  }
  return value;
}

// 巢狀運算子：每一層都是實實在在多出來的一步
const NESTING = [
  /\\lim[\s\S]*\\(?:int|sum|prod)/, // 極限裡面套積分／級數（黎曼和、FTC 型）
  /\\i{2,3}nt|\\oint/,              // 疊積分
  /\\int[\s\S]*\\int/,
  /\\frac\{d\^\s*[2-9]\}/,          // 二階以上導數
  /\\frac\{d\}\{d[a-z]\}[\s\S]*\\int/, // 微分一個積分（微積分基本定理）
  /\\right\|_|\\big[g]?\|_|\|_\{/,  // 代入求值
  /\\prod/
];

function nestingOf(prompt) {
  return NESTING.filter((pattern) => pattern.test(prompt)).length;
}

// 極限題分母的次方 = 泰勒要展多深。
//
// 這是這批題目裡最客觀的難度訊號，而且技巧標籤完全看不到它：
// (sin x − x)/x³ 和 (log(cos x) + x²/2)/x⁴ 都標成 limit.taylor，
// 但前者展到三次就好，後者要展到四次而且中間會遇到 log 的展開。
// 分母每高一次，要多對一次係數，錯一個就全錯。
function taylorDepthOf(prompt) {
  if (!/\\lim/.test(prompt)) return 0;
  const match = String(prompt).match(/\}\{x\^\{?(\d+)\}?\}\s*$|\/x\^\{?(\d+)\}?/);
  if (!match) return 0;
  return Number(match[1] || match[2] || 0);
}

// 「求 x^n 的係數」問到第幾項。同樣是標籤看不到的東西：
// e^{2x} 的 x⁴ 係數是背公式，(1+x)^x 的 x⁶ 係數要先取對數再展開再回代。
function coefficientOrderOf(prompt) {
  const match = String(prompt).match(/[Cc]oefficient of \}?x\^\{?(\d+)/);
  return match ? Number(match[1]) : 0;
}

// 無窮區間上的**代數型**被積函數。
//
// ∫₀^∞ e^{-x}·(什麼) 收斂是因為指數壓下去，那類多半是 Gamma 分部就解決。
// 但 ∫₀^∞ dx/(1+x⁴)、∫₀^∞ log x/(1+x³)dx 這種沒有指數的，
// 收斂靠的是分母長得比分子快，而要算出**值**只能走 Beta / 留數 / 參數微分。
// 那是「要先認出非標準結構」的定義。
function isAlgebraicImproper(prompt) {
  const text = String(prompt);
  if (!/\\int_(\{?-?\\infty\}?|0|\{0\})\^\{?\\infty/.test(text)) return false;
  return !/e\^\{?-|\\exp\(-/.test(text);
}

function stepsOf(problem, skills) {
  const nesting = nestingOf(problem.prompt || "");
  let score = skills.length >= 3 ? 3 : skills.length === 2 ? 2 : 1;
  if (nesting >= 1) score += 1;
  if (nesting >= 3) score += 1;

  const depth = taylorDepthOf(problem.prompt || "");
  if (depth >= 4) score += 1;
  if (depth >= 6) score += 1;

  const order = coefficientOrderOf(problem.prompt || "");
  if (order >= 4) score += 1;
  if (order >= 6) score += 1;

  if (isAlgebraicImproper(problem.prompt || "")) score += 1;
  // 提示條數**不能**當步數用。實測發現：三條提示是這個題庫的標準格式，
  // 作者（包括模板）不管題目多簡單都寫三條 —— lim sin(3x)/(2x) 有三條提示，
  // 但它是一步就看得到答案的題。用它當訊號會把整批送分題推到 R4。
  // 這裡曾經加過「答案很長 → 步數 +1」。拿掉了，因為它跟計算量那一軸重複計算：
  // ∫x²sin(3x)dx 的答案有 35 個 token，於是計算量 3、步數也 3，兩軸一起滿分
  // 把它推到 R6。它其實是做兩輪分部積分的標準考題，長是長，但不難。
  return Math.max(1, Math.min(3, score));
}

// 題幹的 token 數 = 式子有多大。這是少數幾個完全客觀、
// 又跟「要寫多少字」直接相關的量。
function tokenCountOf(prompt) {
  try {
    return latex.tokenize(prompt).length;
  } catch (_error) {
    return String(prompt || "").length / 3;
  }
}

// 18 改成 22：lim_{x→2}(x²−4)/(x−2) 有 21 個 token，在 18 的門檻下
// 被算成「需要草稿」。那是因式分解約分，一行就寫完。
// 22 個 token 大約就是「一行寫得完的式子」。
const LOAD_SMALL = 22;
const LOAD_LARGE = 34;

// 答案有多長，是計算量最誠實的指標 —— 它是「做完之後紙上留下多少東西」。
//
// ∫x²/(1+x⁶)dx 的答案是 arctan(x³)/3，∫x⁷/(1+x²)dx 的答案是
// x⁶/6 − x⁴/4 + x²/2 − log(1+x²)/2。兩題的**題幹**幾乎一樣長、
// 技巧標籤也都是 u-substitution，但後者要先做多項式除法再逐項積分。
// 只看題幹的話這兩題無從分辨；看答案就一目了然。
function answerSizeOf(problem) {
  if (problem.answerKind === "text") return 0;
  const raw = String(problem.answer || "");
  if (!raw) return 0;
  // 用同一套 tokenizer 量，數字才可比
  try {
    return latex.tokenize(raw).length;
  } catch (_error) {
    return raw.length / 3;
  }
}

// 這些技巧沒有人能心算完成。∫x²cos(3x)dx 的題幹只有十幾個 token，
// 但它要做兩輪分部積分 —— 光看式子大小會把它評成「心算可完成」，
// 那是明顯錯的。技巧本身就決定了計算量的下限。
const NEEDS_PAPER = new Set([
  "integral.ibp", "integral.ibp.cyclic", "integral.trigsub", "integral.partialfrac",
  "integral.changevars", "integral.improper", "integral.wallis", "integral.beta",
  "integral.gamma", "integral.parameter", "integral.frullani", "integral.dirichlet",
  "integral.special", "integral.log", "integral.double", "integral.triple",
  "diff.log", "diff.parametric", "diff.higher.extreme", "diff.related",
  "series.sum", "series.euler", "series.generating", "series.taylor.coeff",
  "adv.residue", "adv.ode.first", "adv.ode.second", "adv.bessel",
  "vector.line", "vector.green", "vector.surface", "vector.divergence",
  "mvcalc.hessian", "mvcalc.jacobian", "mvcalc.lagrange", "mvcalc.wronskian"
]);

function loadOf(problem, skills) {
  const tokens = tokenCountOf(problem.prompt || "");
  let score = tokens <= LOAD_SMALL ? 1 : tokens <= LOAD_LARGE ? 2 : 3;
  // 這裡原本對所有定積分 +1（理由是「還要代上下限再相減」）。拿掉了：
  // ∫₀¹6x²dx 代上下限的成本幾乎是零，而真正花時間的定積分，
  // 下面那條「答案長度」訊號已經抓得到。多這一條只是把整批中等題推進 R4。
  // 多變數：每個變數都要各做一次
  if ((problem.variables || []).length >= 2) score = Math.min(3, score + 1);
  if (skills.some((id) => NEEDS_PAPER.has(id))) score = Math.max(score, 2);
  const answerSize = answerSizeOf(problem);
  // 門檻放寬過一次：原本 >22 就算「大量代數」，結果 d/dx(eˣ ln x) 的答案
  // exp(x)*log(x)+exp(x)/x 有 23 個 token，被判成 R4。乘積律的答案本來就有兩項，
  // 那不是計算量大，那是乘積律長這樣。
  if (answerSize > 32) score = 3;
  else if (answerSize > 12) score = Math.max(score, 2);
  return Math.max(1, Math.min(3, score));
}

/* ── 套用 ─────────────────────────────────────────────────── */

// 這一題到底有沒有可用的證據？
//
// skillsForProblem 對沒有技巧標籤的題目會退回 skill_tags.js 的補標，
// 而那份補標是啟發式猜出來的。td-int-002（∫₀^π log(5+3cos x)dx）
// 就是這樣被猜成 integral.basic 的 —— 它是全庫最難的題之一，
// 但一個技巧標籤都沒有。
//
// 對這種題目，重新推導手上的資訊比作者少。**沒有證據就不推翻作者。**

// 補標表（skill_tags.js）認不出來的時候，會退回這幾個泛用節點。
// 它們代表「我不知道這題用什麼技巧」，不是「這題用的是基本技巧」。
const FALLBACK_SKILLS = new Set([
  "integral.basic", "diff.basic", "limit.direct", "series.geometric"
]);

function hasTagEvidence(problem, skills) {
  // 題目自己帶技巧標籤 → 有證據
  if ((problem.tags || []).some((tag) => skillGraph.isSkillTag(tag))) return true;
  // 沒有自帶標籤，但補標表認出了具體技巧（improper、dirichlet、taylor.coeff…）
  // → 那也是證據，而且實測品質不錯
  if (skills.some((id) => !FALLBACK_SKILLS.has(id))) return true;
  // 只剩泛用節點 = 補標表也不知道這題在考什麼。
  // 這種情況下推出來的三軸全是 1，會把 ∫₀^π x²sin x dx（要兩輪分部）
  // 說成心算可完成。沒有證據就不推翻作者，沿用原本的三軸。
  return false;
}

const rows = problems.map((problem) => {
  const skills = skillsOf(problem);
  const axes = {
    steps: stepsOf(problem, skills),
    obscurity: obscurityOf(skills, problem),
    load: loadOf(problem, skills)
  };
  // 人工複核過的題目不動（REVIEWED 的意義就是「有人看過並且負責」），
  // 沒有可用證據的題目也不動 —— 沒有證據就不推翻作者。
  const legacy = LEGACY_RANK[problem.id];

  // 人工判斷永遠贏機器推導。複核過的題目用人寫的三軸，一個字都不改。
  const reviewed = REVIEWED[problem.id];
  if (reviewed) {
    const axesFromHuman = { steps: reviewed.axes[0], obscurity: reviewed.axes[1], load: reviewed.axes[2] };
    return {
      problem,
      axes: axesFromHuman,
      keepExisting: true,
      reviewed: true,
      before: legacy,
      after: rubricRank(axesFromHuman, skills.length)
    };
  }

  // 沒有可用證據 → 沿用舊演算法的判斷（沒有證據就不推翻作者）
  if (!hasTagEvidence(problem, skills)) {
    const preserved = axesReproducing(legacy, skills.length);
    if (preserved) {
      return {
        problem,
        axes: preserved,
        keepExisting: true,
        before: legacy,
        after: legacy
      };
    }
  }
  // 這裡曾經有兩道「上限」（弱證據時只准改一級、任何情況最多降三級）。
  // 它們是假的，已經拿掉：
  //
  // **三軸是唯一被儲存的東西，rank 永遠是從三軸算出來的。**
  // 只改 rank 而不動三軸，等於報告上寫 R4、上線後算出來卻是 R1 ——
  // 那個上限從來沒有生效過，只是讓 dry-run 的數字看起來比較保守。
  //
  // 想保守，正確的做法是「不要動這一題的三軸」（keepExisting），
  // 而不是動了三軸又偷偷改結論。
  return {
    problem,
    axes,
    keepExisting: false,
    before: legacy,
    after: rubricRank(axes, skills.length)
  };
});

/* ── 報告 ─────────────────────────────────────────────────── */

const TARGET = { 1: 8, 2: 18, 3: 28, 4: 28, 5: 13, 6: 5 };
const before = {};
const after = {};
rows.forEach((row) => {
  before[row.before] = (before[row.before] || 0) + 1;
  after[row.after] = (after[row.after] || 0) + 1;
});

console.log("難度重新推導");
console.log(`  題數  ${problems.length}`);
console.log("");
console.log("  rank   舊演算法      重推        目標");
[1, 2, 3, 4, 5, 6].forEach((rank) => {
  const b = before[rank] || 0;
  const a = after[rank] || 0;
  const bp = (100 * b) / problems.length;
  const ap = (100 * a) / problems.length;
  console.log(
    `   R${rank}  ${String(b).padStart(5)} ${bp.toFixed(1).padStart(5)}%   ` +
    `${String(a).padStart(5)} ${ap.toFixed(1).padStart(5)}%   ${String(TARGET[rank]).padStart(3)}%`
  );
});

const moved = rows.filter((row) => row.before !== row.after);
const down = moved.filter((row) => row.after < row.before);
const up = moved.filter((row) => row.after > row.before);
console.log("");
console.log(`  變動  ${moved.length} 題（降 ${down.length} / 升 ${up.length}）`);
console.log(`  保留原判  ${rows.filter((row) => row.keepExisting).length} 題（人工複核過，或沒有技巧標籤可依據）`);
const magnitudes = {};
moved.forEach((row) => {
  const delta = row.before - row.after;
  magnitudes[delta] = (magnitudes[delta] || 0) + 1;
});
console.log(
  "  變動幅度  " +
  Object.keys(magnitudes)
    .map(Number)
    .sort((a, b) => b - a)
    .map((delta) => `${delta > 0 ? "降" : "升"}${Math.abs(delta)}級 ${magnitudes[delta]}`)
    .join("　")
);

// 移動最大的題目要看得到，這是人唯一能複核的地方
const biggest = moved.slice().sort((a, b) => Math.abs(b.after - b.before) - Math.abs(a.after - a.before));
console.log("\n  降最多的：");
biggest.filter((r) => r.after < r.before).slice(0, 12).forEach((r) => {
  console.log(`    R${r.before}→R${r.after}  [${r.axes.steps}${r.axes.obscurity}${r.axes.load}]  ${r.problem.id.padEnd(22)}${r.problem.prompt.slice(0, 52)}`);
});
// 每一級都抽樣印出來。分佈對得上目標**不代表分對了** ——
// 隨便亂分也可以湊出漂亮的分佈。真正要看的是每一級裡面是不是同一種東西。
console.log("\n  各 rank 抽樣（人工複核用）：");
[1, 2, 3, 4, 5, 6].forEach((rank) => {
  const sample = rows.filter((row) => row.after === rank);
  console.log(`\n    R${rank}（${sample.length} 題）`);
  const stride = Math.max(1, Math.floor(sample.length / 6));
  sample.filter((_, index) => index % stride === 0).slice(0, 6).forEach((row) => {
    console.log(
      `      [${row.axes.steps}${row.axes.obscurity}${row.axes.load}] ` +
      `${row.problem.id.padEnd(22)}${row.problem.prompt.slice(0, 50)}`
    );
  });
});

console.log("\n  升最多的：");
biggest.filter((r) => r.after > r.before).slice(0, 8).forEach((r) => {
  console.log(`    R${r.before}→R${r.after}  [${r.axes.steps}${r.axes.obscurity}${r.axes.load}]  ${r.problem.id.padEnd(22)}${r.problem.prompt.slice(0, 52)}`);
});

// 各包重推之後的 R5+ 佔比
const packs = {};
rows.forEach((row) => {
  const key = row.problem.source || "(none)";
  if (!packs[key]) packs[key] = { n: 0, beforeHi: 0, afterHi: 0 };
  packs[key].n += 1;
  if (row.before >= 5) packs[key].beforeHi += 1;
  if (row.after >= 5) packs[key].afterHi += 1;
});
console.log("\n  各包 R5+ 佔比（現行 → 重推）：");
Object.entries(packs)
  .sort((a, b) => b[1].n - a[1].n)
  .forEach(([name, v]) => {
    console.log(
      `    ${String(Math.round((100 * v.beforeHi) / v.n)).padStart(3)}% → ${String(Math.round((100 * v.afterHi) / v.n)).padStart(3)}%   ` +
      `${String(v.n).padStart(4)} 題  ${name}`
    );
  });

// 降三級以上的題目寫成複核清單。
//
// 這些是這次改動裡風險最高的一批：如果推導錯了，一題 R6 的難題會出現在
// 新手的「暖身」訓練裡。清單存檔的意義是讓人可以真的一題一題看過去，
// 而不是只看到一個「分佈很漂亮」的總結。
{
  const queue = rows
    .filter((row) => row.before - row.after >= 3)
    .map((row) => ({
      id: row.problem.id,
      from: row.before,
      to: row.after,
      axes: [row.axes.steps, row.axes.obscurity, row.axes.load],
      skills: skillsOf(row.problem),
      prompt: row.problem.prompt,
      answer: row.problem.answerKind === "text" ? (row.problem.answers || []).join(" / ") : row.problem.answer
    }))
    .sort((a, b) => (b.from - b.to) - (a.from - a.to));
  const queuePath = path.join(__dirname, "..", "reports", "rank-review.json");
  fs.mkdirSync(path.dirname(queuePath), { recursive: true });
  fs.writeFileSync(queuePath, JSON.stringify({ generatedFrom: "tools/recalibrate_rubric.js", count: queue.length, items: queue }, null, 2) + "\n", "utf8");
  console.log(`\n  降三級以上的 ${queue.length} 題寫到 reports/rank-review.json（待人工複核）`);
}

if (dryRun) {
  console.log("\n（--dry：沒有寫檔）");
  process.exit(0);
}

/* ── 寫檔 ─────────────────────────────────────────────────── */

const table = {};
rows.forEach((row) => {
  table[row.problem.id] = [row.axes.steps, row.axes.obscurity, row.axes.load];
});

const OUTPUT = path.join(__dirname, "..", "src", "kernel", "rubric.js");
const existing = fs.readFileSync(OUTPUT, "utf8");
const lines = Object.keys(table).sort().map((id) => `    ${JSON.stringify(id)}: [${table[id].join(",")}]`);

// 只換表，其餘（REVIEWED、API、註解）原封不動
const start = existing.indexOf("  const RUBRIC = {");
const end = existing.indexOf("  };", start);
if (start < 0 || end < 0) throw new Error("rubric.js 的結構跟預期不同，不敢動");
const output = existing.slice(0, start) + "  const RUBRIC = {\n" + lines.join(",\n") + "\n" + existing.slice(end);
fs.writeFileSync(OUTPUT, output, "utf8");
console.log(`\n已寫入 src/kernel/rubric.js（${lines.length} 題）`);
console.log("記得跑 node tools/validate_content_metadata.js 確認 rank 與三軸一致");
