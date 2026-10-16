// 數值微積分工具箱：微分、定積分、極限、級數和。
//
// 這些是「獨立驗算路徑」的引擎。題目說 ∫₀¹ x² dx = 1/3，
// 驗算的方式不是再解一次積分（那會重複同一個可能出錯的推導），
// 而是**用數值方法直接算出來**再比對。兩條路徑用到的知識完全不重疊，
// 所以同時錯到同一個值的機率極低。
//
// 精度取捨：目標是把答案錯誤（差 2 倍、差正負號、差一個 π）抓出來，
// 不是做高精度計算。所以容差設在相對 1e-6，寧可偶爾判不出來（回報「無法驗證」），
// 也不要因為數值誤差誤報一堆假的錯誤 —— 假警報會讓人開始忽略驗證器。

"use strict";

/* ── 補償求和 ──────────────────────────────────────────────── */

// Neumaier 版的 Kahan 求和。級數要加十萬項，直接累加會把小項全部吃掉。
function createSum() {
  let sum = 0;
  let compensation = 0;
  return {
    add(value) {
      const t = sum + value;
      compensation += Math.abs(sum) >= Math.abs(value) ? (sum - t) + value : (value - t) + sum;
      sum = t;
    },
    get value() { return sum + compensation; }
  };
}

/* ── 微分（Ridders 外插）───────────────────────────────────── */

// 中央差分的誤差是 O(h²)，但 h 太小會被浮點誤差吃掉，存在一個最佳 h。
// Ridders 的做法是算一整排逐步縮小的 h，用多項式外插逼近 h→0，
// 同時監看誤差什麼時候開始變大就停手。單純取 h=1e-5 大概只有 1e-8，
// 這個做法可以到 1e-11，差三個數量級，判「差一點點」時才有話語權。
function derivative(f, x, options = {}) {
  const order = options.order || 1;
  if (order > 1) {
    // 高階導數用遞迴：對「一階導數函數」再微分。誤差會累積，
    // 所以每多一階就放寬一次容差（呼叫端要知道這件事）。
    const inner = (t) => derivative(f, t, { ...options, order: order - 1 }).value;
    return derivative(inner, x, { ...options, order: 1, h: Math.max(options.h || 0, 1e-3) });
  }

  const ntab = 10;
  const con = 1.4;
  const con2 = con * con;
  const safe = 2;
  let h = options.h || Math.max(1e-4, Math.abs(x) * 1e-4);
  const a = [];
  a[0] = [];
  a[0][0] = (f(x + h) - f(x - h)) / (2 * h);
  let error = Infinity;
  let best = a[0][0];

  for (let i = 1; i < ntab; i += 1) {
    h /= con;
    a[i] = [];
    a[i][0] = (f(x + h) - f(x - h)) / (2 * h);
    let fac = con2;
    for (let j = 1; j <= i; j += 1) {
      a[i][j] = (a[i][j - 1] * fac - a[i - 1][j - 1]) / (fac - 1);
      fac *= con2;
      const err = Math.max(Math.abs(a[i][j] - a[i][j - 1]), Math.abs(a[i][j] - a[i - 1][j - 1]));
      if (err <= error) { error = err; best = a[i][j]; }
    }
    // 誤差開始回頭變大代表浮點雜訊蓋過截斷誤差了，再算下去只會更差
    if (Math.abs(a[i][i] - a[i - 1][i - 1]) >= safe * error) break;
  }
  return { value: best, error };
}

// 偏導數：把其他變數釘住
function partial(f, point, index, options = {}) {
  const args = point.slice();
  return derivative((t) => {
    const local = args.slice();
    local[index] = t;
    return f(...local);
  }, point[index], options);
}

/* ── 定積分（雙指數 / tanh-sinh）───────────────────────────── */

// 為什麼不用 Simpson：題庫裡一堆 ∫₀¹ ln x dx、∫₀¹ dx/√x 這種端點發散的積分，
// Simpson 會直接在端點取到 Infinity。雙指數變換把端點推到無窮遠，
// 節點永遠取不到端點，所以可積的奇異點會自己消失。

function tanhSinh(f, a, b, options = {}) {
  const tolerance = options.tolerance || 1e-12;
  const maxLevel = options.maxLevel || 10;
  const center = (a + b) / 2;
  const half = (b - a) / 2;
  if (half === 0) return { value: 0, error: 0 };

  const g = (t) => {
    const u = (Math.PI / 2) * Math.sinh(t);
    const x = Math.tanh(u);
    const w = ((Math.PI / 2) * Math.cosh(t)) / (Math.cosh(u) * Math.cosh(u));
    // 用 1∓x 的等價形式算節點，避免 x 逼近 ±1 時整段被捨入成端點
    const value = f(center + half * x);
    return Number.isFinite(value) ? value * w : 0;
  };

  // t=4 時 1−tanh((π/2)sinh 4) 已是 1e-38，再往外算純粹是燒 CPU。
  // 從 6.5 收到 4 讓整份題庫的驗算快掉四成，精度一位數都沒掉。
  const limit = 4;
  let h = 1;
  // 第 0 層是「步長 1 的梯形和」，也就是 t = 0, ±1, ±2, … 全部都要。
  // 只放 g(0) 的話後面每加密一層都只補回一半的點，結果會沿著
  // (真值)·(1−2^−L) 慢慢爬上去 —— 看起來在收斂，其實永遠差一截。
  let sum = gridSum(g, 0, 1, limit);
  let previous = Infinity;
  let result = sum * h * half;

  for (let level = 1; level <= maxLevel; level += 1) {
    h /= 2;
    const partialSum = createSum();
    for (let t = h; t < limit; t += 2 * h) {
      const contribution = g(t) + g(-t);
      if (!Number.isFinite(contribution)) continue;
      partialSum.add(contribution);
    }
    sum += partialSum.value;
    previous = result;
    result = sum * h * half;
    if (level >= 4 && Math.abs(result - previous) <= tolerance * Math.max(1, Math.abs(result))) {
      return { value: result, error: Math.abs(result - previous) };
    }
  }
  return { value: result, error: Math.abs(result - previous) };
}

// 半無窮區間 [a, ∞)：exp-sinh 變換
function expSinh(f, a, sign, options = {}) {
  const tolerance = options.tolerance || 1e-12;
  const g = (t) => {
    const x = Math.exp((Math.PI / 2) * Math.sinh(t));
    const w = x * (Math.PI / 2) * Math.cosh(t);
    const value = f(a + sign * x);
    return Number.isFinite(value) ? value * w * sign : 0;
  };
  return deSum(g, tolerance, 4);
}

// 全實數線 (-∞, ∞)：sinh-sinh 變換
function sinhSinh(f, options = {}) {
  const tolerance = options.tolerance || 1e-12;
  const g = (t) => {
    const x = Math.sinh((Math.PI / 2) * Math.sinh(t));
    const w = Math.cosh((Math.PI / 2) * Math.sinh(t)) * (Math.PI / 2) * Math.cosh(t);
    const value = f(x);
    return Number.isFinite(value) ? value * w : 0;
  };
  return deSum(g, tolerance, 4);
}

// 把 t = start, start±step, start±2·step … 全部加起來（|t| < limit）
function gridSum(g, start, step, limit) {
  const total = createSum();
  const middle = g(start);
  if (Number.isFinite(middle)) total.add(middle);
  for (let t = start + step; t < limit; t += step) {
    const contribution = g(t) + g(-t);
    if (Number.isFinite(contribution)) total.add(contribution);
  }
  return total.value;
}

// 三種變換共用的梯形加密迴圈
function deSum(g, tolerance, limit) {
  let h = 1;
  let sum = gridSum(g, 0, 1, limit);
  let result = sum * h;
  let previous = Infinity;
  for (let level = 1; level <= 12; level += 1) {
    h /= 2;
    const partialSum = createSum();
    for (let t = h; t < limit; t += 2 * h) {
      const contribution = g(t) + g(-t);
      if (!Number.isFinite(contribution)) continue;
      partialSum.add(contribution);
    }
    sum += partialSum.value;
    previous = result;
    result = sum * h;
    if (level >= 4 && Math.abs(result - previous) <= tolerance * Math.max(1, Math.abs(result))) {
      return { value: result, error: Math.abs(result - previous) };
    }
  }
  return { value: result, error: Math.abs(result - previous) };
}

// 半無窮區間有兩種完全不同的難處，要用兩種方法。
//
// 衰減型（∫₀^∞ e^{-x}dx）：exp-sinh 幾乎是精確的。
// 振盪型（∫₀^∞ sin(x)/x dx）：exp-sinh 的節點在遠處指數級稀疏，
// 直接跳過整段整段的振盪，會安靜地給出一個錯得離譜的值（實測 0.476 vs π/2）。
// 「安靜地錯」比「算不出來」危險得多 —— 它會把對的答案判成錯的。
//
// 振盪型改成切成一段一段固定長度的積分，再把那串部分和交給 ε 演算法。
// 每段內部不振盪，段與段之間形成交錯級數，正是 ε 演算法最擅長的形狀。
// 無窮積分的尾巴（2026-10-16 抓到）：exp-sinh 對衰減慢的尾巴取樣不夠遠，會安靜地少算 ——
// ∫₂^∞ dx/(x ln²x) 算成 1.419（真值 1/ln 2 = 1.443）、∫₁^∞ x^{-1.1} 算成 9.86（真值 10），
// 發散的 ∫₁^∞ dx/x 還算出 42.9，而且回報的誤差都很小。
// 在 10⁶…10⁸ 這幾個十倍量 |f| 的衰減冪次 p（每十倍掉 10^p）：
//   指數型（遠處已經是 0）或尾巴小到可以忽略 → 照用原本的結果
//   p ≤ 1.02 → 發散（或慢到量不出來）→ 算不出來
//   p 在相鄰十倍之間還在變（ln 型的尾巴）→ 冪次外推不準 → 算不出來
//   p 穩定 > 1 → [a, X] 分段照實積、X 以後補 f(X)·X/(p−1)
function checkTail(f, a, sign, decayed, options) {
  const base = Math.max(1, Math.abs(a));
  const X = (k) => a + sign * base * 10 ** k;
  const v = (k) => Math.abs(f(X(k)));
  const far = [4, 6, 7, 8].map(v);
  if (far.some((y) => !Number.isFinite(y))) return decayed;
  if (far[0] === 0) return decayed;
  // 10⁸ 以後的尾巴質量（|f|·x，取附近幾點的最大值 —— 振盪的 (1−cos x)/x² 在節點上剛好是 0）小到可以忽略：
  // exp-sinh 原本就算得準（sin²x/x²、ln x/(1+x²)、ln x/x³ 都是這種），不要動它
  const mass = Math.max(...[1, 1.13, 1.37, 1.71, 2.3].map((m) => Math.abs(f(a + sign * base * 1e8 * m)) * base * 1e8 * m));
  if (Number.isFinite(mass) && mass <= 1e-6 * Math.max(1, Math.abs(decayed.value))) return decayed;
  const p = (k) => Math.log10(v(k) / v(k + 1));
  const p6 = p(6), p7 = p(7);
  if (!(p6 > 1.02) || !(p7 > 1.02)) return { value: Number.NaN, error: Infinity, diverges: true, reason: "尾巴衰減得不比 1/x 快 —— 發散（或慢到量不出來）" };
  // 冪次還在變（ln 型）：只有貼著 1 的才真的會少算（1/(x ln²x) 的 p≈1.12）；ln x/x^{1.5} 這種 exp-sinh 本來就算得準
  if (Math.abs(p7 - p6) > 0.005 * p7 && p7 >= 1.3) return decayed;
  if (Math.abs(p7 - p6) > 0.005 * p7) return { value: Number.NaN, error: Infinity, reason: "尾巴的衰減冪次還在變（ln 型），截斷外推不準" };
  const total = createSum();
  let lo = a;
  for (let k = 0; k <= 8; k += 1) {
    const hi = X(k);
    const piece = tanhSinh(f, Math.min(lo, hi), Math.max(lo, hi), options);
    if (!Number.isFinite(piece.value)) return decayed;
    total.add(sign * piece.value);
    lo = hi;
  }
  const tail = (f(X(8)) * base * 1e8) / (p7 - 1);
  return { value: total.value + sign * tail, error: Math.abs(tail) * 1e-3, tailExtrapolated: true };
}

function semiInfinite(f, a, sign, options = {}) {
  const decayed = expSinh(f, a, sign, options);

  // 遠處還在變號 = 振盪型
  let signChanges = 0;
  let last = 0;
  for (let k = 1; k <= 40; k += 1) {
    const value = f(a + sign * k * 3);
    if (!Number.isFinite(value) || value === 0) continue;
    const current = Math.sign(value);
    if (last && current !== last) signChanges += 1;
    last = current;
  }
  if (signChanges < 3) return checkTail(f, a, sign, decayed, options);

  const step = 2;
  const total = createSum();
  const partials = [];
  for (let k = 0; k < 120; k += 1) {
    const lo = a + sign * k * step;
    const hi = a + sign * (k + 1) * step;
    const piece = tanhSinh(f, Math.min(lo, hi), Math.max(lo, hi), { ...options, maxLevel: 7 });
    if (!Number.isFinite(piece.value)) break;
    // sign 決定方向，和 expSinh 的正負號慣例保持一致
    total.add(sign * piece.value);
    partials.push(total.value);
  }
  const accelerated = wynnEpsilon(partials.slice(0, 80));
  if (!Number.isFinite(accelerated)) {
    return { value: Number.NaN, error: Infinity, reason: "振盪型無窮積分外插失敗" };
  }
  // 兩種方法都算得出來但差很多時，只信切段法，並把差距如實回報
  return { value: accelerated, error: Math.abs(accelerated - partials[partials.length - 1]), oscillatory: true };
}

function integrate(f, a, b, options = {}) {
  if (a === b) return { value: 0, error: 0 };
  if (a > b) {
    const flipped = integrate(f, b, a, options);
    return { value: -flipped.value, error: flipped.error };
  }
  const aInf = !Number.isFinite(a);
  const bInf = !Number.isFinite(b);
  if (aInf && bInf) return sinhSinh(f, options);
  if (bInf) return semiInfinite(f, a, 1, options);
  if (aInf) {
    const flipped = semiInfinite(f, b, -1, options);
    return { value: -flipped.value, error: flipped.error };
  }
  // 內部奇異點（例如 ∫₋₁¹ dx/x^{2/3}）在 0 附近切開，讓端點變換去吃它
  if (options.breakpoints) {
    const points = [a, ...options.breakpoints.filter((p) => p > a && p < b), b];
    const total = createSum();
    let error = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const piece = tanhSinh(f, points[i], points[i + 1], options);
      total.add(piece.value);
      error += piece.error;
    }
    return { value: total.value, error };
  }
  return tanhSinh(f, a, b, options);
}

/* ── 序列外插（Wynn ε 演算法）──────────────────────────────── */

// 級數 Σ1/n² 加十萬項還只有 5 位數正確。ε 演算法吃部分和序列，
// 對交錯級數和單調慢收斂級數都有效，是把「加不完」變成「算得出來」的關鍵。
function wynnEpsilon(sequence) {
  const n = sequence.length;
  if (n < 3) return sequence[n - 1];
  let previous = new Array(n + 1).fill(0);
  let current = sequence.slice();
  let best = current[n - 1];
  for (let k = 1; k < n; k += 1) {
    const next = [];
    for (let i = 0; i + k <= n - 1; i += 1) {
      const denominator = current[i + 1] - current[i];
      if (denominator === 0 || !Number.isFinite(denominator)) { next.push(Number.NaN); continue; }
      next.push(previous[i + 1] + 1 / denominator);
    }
    previous = current;
    current = next;
    if (k % 2 === 0 && current.length) {
      const candidate = current[current.length - 1];
      if (Number.isFinite(candidate)) best = candidate;
    }
    if (current.length < 2) break;
  }
  return best;
}

/* ── 級數和 ────────────────────────────────────────────────── */

function seriesSum(term, from, options = {}) {
  const to = options.to;
  const maxTerms = options.maxTerms || 60000;
  const tolerance = options.tolerance || 1e-13;

  if (Number.isFinite(to)) {
    const total = createSum();
    for (let n = from; n <= to; n += 1) {
      const value = term(n);
      if (!Number.isFinite(value)) return { value: Number.NaN, error: Infinity, reason: "有限和裡出現非有限項" };
      total.add(value);
    }
    return { value: total.value, error: 0 };
  }

  // 單調（不變號）的慢收斂級數：直接加二十萬項只有 5 位數正確，
  // ε 演算法在單調序列上又會被捨入誤差吃掉。Euler–Maclaurin 才是對的工具：
  //   Σ_{n≥N} f(n) ≈ ∫_N^∞ f + f(N)/2 − f′(N)/12 + f‴(N)/720
  // 前 N−1 項照實加，尾巴用積分換掉。N=200 時通常能到 1e-12。
  // 尾巴不可信（eulerMaclaurin 回 rejected）的單調級數：只接受直接加就收斂的；
  // 加不完的不准交給 ε 外插（它在單調序列上會給一個「看起來合理」的錯數字），回 NaN 讓上層判 unverified。
  let rejected = "";
  if (!alternates(term, from) && options.eulerMaclaurin !== false) {
    const estimate = eulerMaclaurin(term, from, options);
    if (estimate && !estimate.rejected) return estimate;
    if (estimate && estimate.rejected) rejected = estimate.rejected;
  }

  // 先直接加：夠快收斂的話這樣最準
  const total = createSum();
  const snapshots = [];
  let n = from;
  let consecutiveTiny = 0;
  // 開頭幾項剛好是 0（Σ n(n−1)(n−2)(n−3)/n! 從 n=1 起前三項是 0）不准算成「已經收斂」——
  // 2026-10-16 之前連三個 0 就收工，回傳 0（真值 e）。看到第一個非零項之後才開始數
  let seenNonzero = false;
  for (let step = 0; step < maxTerms; step += 1, n += 1) {
    const value = term(n);
    if (!Number.isFinite(value)) return { value: Number.NaN, error: Infinity, reason: `第 ${n} 項不是有限值` };
    total.add(value);
    if (value !== 0) seenNonzero = true;
    if (step < 60) snapshots.push(total.value);
    const magnitude = Math.abs(total.value);
    if (seenNonzero && Math.abs(value) <= tolerance * Math.max(1, magnitude)) {
      consecutiveTiny += 1;
      if (consecutiveTiny >= 3) return { value: total.value, error: Math.abs(value), converged: true };
    } else {
      consecutiveTiny = 0;
    }
  }

  if (rejected) return { value: Number.NaN, error: Infinity, reason: rejected };
  // 加了二十萬項還沒收斂 → 交給 ε 演算法從前 60 個部分和外插
  const accelerated = wynnEpsilon(snapshots);
  if (Number.isFinite(accelerated)) {
    // 用直接求和的結果當作合理性檢查：外插值不該離部分和太遠
    const drift = Math.abs(accelerated - total.value);
    return { value: accelerated, error: drift, accelerated: true };
  }
  return { value: total.value, error: Infinity, reason: "級數收斂太慢，外插也失敗" };
}

// 前 30 項有沒有變號 —— 交錯級數走 ε 演算法，單調級數走 Euler–Maclaurin
function alternates(term, from) {
  let last = 0;
  let changes = 0;
  for (let n = from; n < from + 30; n += 1) {
    const value = term(n);
    if (!Number.isFinite(value) || value === 0) continue;
    const current = Math.sign(value);
    if (last && current !== last) changes += 1;
    last = current;
  }
  return changes >= 5;
}

function eulerMaclaurin(term, from, options = {}) {
  const cut = options.cut || 200;
  // Euler–Maclaurin 把尾巴換成 f 在實數上的積分 —— 只有 f 在 [cut, ∞) 是平滑、單調、量得準的時候才對。
  // 2026-10-15 抓到兩種「安靜地算錯」，回 rejected 讓 seriesSum 改走直接加或判不出來：
  //   (1−(−1)ⁿ)/n²：整數上一項 0 一項非 0，實數上的 f 根本不是這個數列（差 5e-3）；
  //   ln((n+1)²/(n(n+2)))：比值貼著 1，n 大到 1e8 以後只剩捨入雜訊，積到無窮把 ln 2 算成 −0.599。
  const near = [];
  for (let n = cut; n <= cut + 20; n += 1) near.push(term(n));
  const sign = Math.sign(near[0]);
  for (let i = 0; i < near.length; i += 1) {
    if (!Number.isFinite(near[i]) || near[i] === 0 || Math.sign(near[i]) !== sign) return { rejected: "尾巴的項有 0 或變號，不是平滑函數，Euler–Maclaurin 不適用" };
    if (i && Math.abs(near[i]) > Math.abs(near[i - 1]) * (1 + 1e-9)) return { rejected: "尾巴的項沒有單調遞減，Euler–Maclaurin 不適用" };
    const mid = term(cut + i + 0.5);
    if (i < near.length - 1 && !(Math.abs(mid) <= Math.abs(near[i]) * (1 + 1e-9) && Math.abs(mid) >= Math.abs(near[i + 1]) * (1 - 1e-9))) {
      return { rejected: "f 在整數之間不是夾在前後兩項之間（只在整數上有意義的項），Euler–Maclaurin 不適用" };
    }
  }
  // 遠方：每十倍取一點，衰減的「冪次」要一路平順（雜訊會讓它亂跳或不再下降）；掉到 0（下溢）就停。
  // 遇到雜訊（相消成 0、亂跳、變號）不直接放棄：退回兩個十倍、在那裡還量得準的地方 T 截斷，
  // [cut, T] 照常積分，T 以後用那裡量到的冪次 p 補 ∫_T^∞ f(T)(T/t)^p dt = f(T)·T/(p−1)。p 不明顯大於 1 才放棄。
  const drops = [];
  let prev = Math.abs(near[0]);
  let noisyAt = 0;
  let why = "";
  for (let k = 1; k <= 10; k += 1) {
    const value = term(cut * 10 ** k);
    const lastDrop = drops.length ? drops[drops.length - 1] : null;
    if (value === 0) {
      // 真的下溢（照衰減速度下一點本來就該是 0）才當作「尾巴沒了」；照衰減明明還算得出 1e-17 卻變成 0 —— 那是相消
      if (lastDrop !== null && prev / 10 ** lastDrop > 1e-290) { noisyAt = k; why = `第 ${cut}·10^${k} 項相消成 0`; }
      break;
    }
    const drop = Number.isFinite(value) && Math.sign(value) === sign ? Math.log10(prev / Math.abs(value)) : Number.NaN;
    if (!(drop > 0) || (lastDrop !== null && Math.abs(drop - lastDrop) > 0.5)) { noisyAt = k; why = `尾巴在 ${cut}·10^${k} 附近有捨入雜訊`; break; }
    drops.push(drop);
    prev = Math.abs(value);
  }
  let upper = Infinity;
  let beyond = 0;
  if (noisyAt) {
    const k = noisyAt - 2;
    const p = drops[k - 1];
    if (k < 1 || !(p > 1.05)) return { rejected: `${why}，而且量得準的範圍裡冪次 p 不明顯大於 1，尾巴補不起來` };
    upper = cut * 10 ** k;
    beyond = (term(upper) * upper) / (p - 1);
  }
  const head = createSum();
  for (let n = from; n < cut; n += 1) {
    const value = term(n);
    if (!Number.isFinite(value)) return null;
    head.add(value);
  }
  const tail = integrate(term, cut, upper, { tolerance: 1e-13 });
  if (!Number.isFinite(tail.value)) return null;
  tail.value += beyond;
  const first = derivative(term, cut, { h: 0.5 });
  const third = derivative((t) => derivative((u) => derivative(term, u, { h: 0.5 }).value, t, { h: 0.5 }).value, cut, { h: 0.5 });
  const correction = term(cut) / 2 - first.value / 12 + third.value / 720;
  const value = head.value + tail.value + correction;
  if (!Number.isFinite(value)) return null;
  return { value, error: Math.abs(third.value / 720), eulerMaclaurin: true };
}

/* ── 極限 ──────────────────────────────────────────────────── */

// 從 target 兩側（或指定單側）逐步逼近，再對「越來越靠近」的序列外插。
// 直接取 x = a + 1e-12 是行不通的：0/0 型的式子在那裡會被浮點誤差撕碎。
function limit(f, target, options = {}) {
  const side = options.side || "both";

  if (!Number.isFinite(target)) {
    const sign = target > 0 ? 1 : -1;
    return limit((t) => f(sign / t), 0, { ...options, side: "+" });
  }

  const evaluate = (direction) => {
    // 步長階梯用 0.8 的等比，不是 1/2。
    // 用 1/2 的話，在浮點抵消開始之前只取得到十來個點，
    // 而 x⁷ 這種分母的題目安全區間只到 x≈0.03 —— 剩下五六個點，外插不出東西。
    // 縮得慢一點，安全區間內就有二三十個點可用。
    const samples = [];
    for (let k = 0; k < 45; k += 1) {
      const value = f(target + direction * Math.pow(0.8, k));
      if (Number.isFinite(value)) samples.push(value);
      else if (samples.length) break;
    }
    if (!samples.length) return { value: Number.NaN, error: Infinity, outOfDomain: true, reason: "這一側不在定義域內" };
    if (samples.length < 5) return { value: Number.NaN, error: Infinity, reason: "可用的取樣點太少" };

    // 這裡是整支工具最容易「安靜地算錯」的地方。
    //
    // lim_{x→0}(e^x − e^{−x} − 2x)/x³ 的答案是 1/3。取樣到 x = 1e-8 時，
    // 分子是兩個 1e-8 等級的數相減得到 1e-24 —— 有效位數全部消失，算出來剛好是 0。
    // 更糟的是後面幾個取樣點**全部都是 0**，看起來像一個非常穩定的極限。
    // 只看尾端穩不穩定的話，會斬釘截鐵地回報 0，把一題正確的答案判成錯的。
    //
    // 偵測方式：相鄰取樣點的差距，在真的收斂時會一路縮小；一旦回頭變大，
    // 就是浮點抵消（或函數本身在震盪）。從那裡截斷，後面的點一律不用。
    // 只在「序列已經開始收斂之後」才找雜訊。
    // 少了這個前提會誤傷 lim_{x→∞} x²/e^x：它先爬到最大值再往下掉，
    // 前段的差距本來就在變大，會被當成抵消而在半路截斷，
    // 然後從還沒收斂的前段外插出 0.276 這種完全錯誤的值。
    // 尺度只看序列的後三分之一。用全部取樣點的最大值會被前段的爆炸值綁架：
    // lim_{x→∞} x²(x^{1/x}−1−ln x/x)/(ln x)² 在 x≈1 附近分母是 (ln x)²→0，
    // 前幾個取樣點高達 1e5。以那個當尺度的話，「差距小於 1e-3×尺度」
    // 在還沒收斂的地方就成立了，於是從一段垃圾裡外插出 0.5357。
    const tailStart = Math.floor((samples.length * 2) / 3);
    const scale = Math.max(...samples.slice(tailStart).map(Math.abs), 1e-300);
    let settled = -1;
    for (let k = 1; k < samples.length; k += 1) {
      if (Math.abs(samples[k] - samples[k - 1]) < 1e-3 * scale) { settled = k; break; }
    }
    let usable = samples.length;
    if (settled > 0) {
      for (let k = settled + 2; k < samples.length; k += 1) {
        const recent = Math.abs(samples[k] - samples[k - 1]);
        const earlier = Math.abs(samples[k - 1] - samples[k - 2]);
        if (earlier > 0 && recent > earlier * 1.5) { usable = k; break; }
      }
    }
    if (usable < 5) return { value: Number.NaN, error: Infinity, reason: "取樣序列一開始就不穩定" };
    const clean = samples.slice(0, usable);

    // 發散的式子不准外插出一個有限值（2026-10-16 抓到：x+1 在 ∞ 說是 1、1/x 在 0⁺ 說是 0 ——
    // 「LIM(x, inf) == 0」這種錯的宣稱會被判成立）。看後三分之一：差距一路同號、而且沒有在縮
    // （相鄰差距的比值平均 ≥ 0.9995：1/x 是 1.25、ln x 是 1、真的收斂的 1/x 型是 0.8；收斂得慢的（積分型、x→0 的高階項）比值在 0.99 上下，0.99 當門檻會把它們誤殺）→ 沒有在收斂，回報算不出來。
    {
      const tail = clean.slice(Math.floor((clean.length * 2) / 3));
      const diffs = tail.slice(1).map((v, i) => v - tail[i]);
      const sameSign = diffs.length >= 4 && diffs.every((d) => d !== 0 && Math.sign(d) === Math.sign(diffs[0]));
      if (sameSign) {
        const ratios = diffs.slice(1).map((d, i) => Math.abs(d / diffs[i]));
        const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
        // 還要真的「走得遠」：x→0 的高階項在最後幾個點會被捨入雜訊推著慢慢漂（比值 1.06，但整段只動 0.04%），那不是發散
        const first = tail[0], last = tail[tail.length - 1];
        const moved = Math.abs(last - first) / Math.max(Math.abs(first), Math.abs(last), 1e-300);
        if ((mean >= 0.9995 && moved > 0.05) || mean >= 1.15) return { value: Number.NaN, error: Infinity, diverges: true, reason: "取樣值一路朝同一方向走、而且沒有在縮小 —— 發散（或收斂慢到量不出來）" };
      }
    }

    // 從幾個不同深度各外插一次。淺窗格通常還沒收斂，深窗格才是答案，
    // 但深窗格也最容易踩到抵消 —— 所以取最深三個的中位數，
    // 並且用它們之間的離散程度當作「這個值可不可信」的判斷。
    // 窗格取「已清理序列」的深度比例，不是固定的 5/8/11 個點。
    //
    // 固定小窗格是錯的：lim_{x→∞}(3x+1)/(2x+5) 收斂得像 1/x 一樣慢，
    // 前 11 個取樣點還在 0.57…0.91 之間爬，對它們做外插只會得到
    // −12.8 這種垃圾。而那些垃圾會被算進「共識」裡，把正確的 1.5 否決掉。
    //
    // 序列的尾端在哪裡取決於這個函數收斂得多快，所以窗格要跟著序列長度走。
    // 前面的截斷已經保證了 clean 裡沒有浮點雜訊，所以「深」是安全的。
    const windows = [0.5, 0.7, 0.85, 1].map((fraction) => Math.max(5, Math.round(clean.length * fraction)))
      .filter((size, index, list) => size <= clean.length && list.indexOf(size) === index)
      .map((size) => wynnEpsilon(clean.slice(0, size)))
      .filter((value) => Number.isFinite(value));
    if (!windows.length) {
      return { value: Number.NaN, error: Infinity, reason: "外插不出穩定的值" };
    }

    // 全部都貼在 0 附近 → 極限就是 0。這種情況不能比相對誤差：
    // 1e-14 和 1e-13 的相對差距是 900%，但它們講的是同一件事。
    if (windows.every((value) => Math.abs(value) < 1e-10)) {
      return { value: 0, error: Math.max(...windows.map(Math.abs)) };
    }

    const deep = windows.slice(-3);
    const sorted = deep.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const spread = Math.max(...deep) - Math.min(...deep);
    // 窗格之間的離散程度就是這個值的不確定度，會一路帶到比對容差去。
    if (spread > 1e-3 * Math.abs(median)) {
      return { value: Number.NaN, error: spread, reason: "不同取樣深度的外插不一致" };
    }
    // 外插值不能落在序列「已經走過」的那一側。
    // lim_{x→∞} 0.99^x 換成 t = 1/x → 0⁺ 之後，取樣序列先慢慢從 0.99 往下爬、
    // 最後幾點已經是 e^{−180} 等級，但各窗格的外插一致地給出 1 —— 一個很穩、很錯的值。
    // 尾端單調、而且真的在收斂（間距一路縮小）時，真正的極限一定在最後一點的前方（或就是它）；
    // 落在後方代表外插被前段帶跑了。
    // 間距在變大的尾端不套用：那是浮點抵消造成的漂移（burst-boss3-lim-007 的尾端一路往下滑過真正的極限
    // 0.152778，外插值反而是對的），這種情況交給上面的雜訊截斷與窗格一致性處理。
    const tail = clean.slice(-4);
    const steps = tail.slice(1).map((v, i) => v - tail[i]);
    const shrinking = steps.length >= 3 && steps.slice(1).every((s, i) => Math.abs(s) < Math.abs(steps[i]));
    if (shrinking && (steps.every((s) => s > 0) || steps.every((s) => s < 0))) {
      const direction = Math.sign(steps[steps.length - 1]);
      const last = tail[tail.length - 1];
      const slack = Math.abs(steps[steps.length - 1]) + 1e-6 * Math.max(1, Math.abs(last));
      if ((median - last) * direction < -slack) {
        return { value: Number.NaN, error: Infinity, reason: "外插值落在序列已經走過的一側（序列還沒收斂完就外插）" };
      }
    }
    return { value: median, error: spread };
  };

  if (side === "+") return evaluate(1);
  if (side === "-") return evaluate(-1);

  const right = evaluate(1);
  const left = evaluate(-1);

  // 函數在某一側根本沒有定義（√x、ln x、x^x 這類），那不是「左右不一致」，
  // 是定義域就只有一邊。此時單側極限就是答案 —— 課本也是這樣寫的。
  // 但如果那一側**有**取樣點、只是外插失敗，那就是真的不確定，不能瞎猜。
  if (left.outOfDomain && Number.isFinite(right.value)) {
    return { value: right.value, error: right.error, oneSided: "+" };
  }
  if (right.outOfDomain && Number.isFinite(left.value)) {
    return { value: left.value, error: left.error, oneSided: "-" };
  }
  if (!Number.isFinite(right.value) || !Number.isFinite(left.value)) {
    return { value: Number.NaN, error: Infinity, reason: right.reason || left.reason || "單側算不出來" };
  }
  const gap = Math.abs(right.value - left.value);
  const scale = Math.max(1, Math.abs(right.value));
  if (gap > 1e-5 * scale) {
    return { value: Number.NaN, error: gap, reason: "左右極限不同", left: left.value, right: right.value };
  }
  return { value: (right.value + left.value) / 2, error: Math.max(right.error, left.error, gap) };
}

/* ── 泰勒係數 ──────────────────────────────────────────────── */

// 用 Cauchy 積分公式取係數：aₙ = (1/2πi)∮f(z)/z^{n+1}dz。
// 實數版是在半徑 r 的圓上取 M 個點做 DFT。比反覆微分穩得多
// —— 微分到第 6 階時 Ridders 的誤差已經放大到沒有意義了。
// 只適用於實係數函數（f(conj z) = conj f(z)），題庫裡的都是。
function taylorCoefficient(f, n, options = {}) {
  const radius = options.radius || 0.35;
  const points = options.points || 256;
  // f 只接受實數，所以用實部展開：對 f(r e^{iθ}) 取實部做離散餘弦變換。
  // 這要求 f 能吃複數 —— 做不到的話退回實軸上的有限差分（精度較低）。
  if (options.complexSafe === false) {
    const derivativeValue = derivative(f, 0, { order: n, h: 0.05 });
    return { value: derivativeValue.value / factorial(n), error: derivativeValue.error };
  }
  const total = createSum();
  for (let k = 0; k < points; k += 1) {
    const theta = (2 * Math.PI * k) / points;
    const value = f(radius * Math.cos(theta), radius * Math.sin(theta));
    if (!Number.isFinite(value)) return { value: Number.NaN, error: Infinity };
    total.add(value * Math.cos(n * theta));
  }
  return { value: total.value / (points * Math.pow(radius, n) / 2), error: 0 };
}

function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i += 1) r *= i;
  return r;
}

/* ── 比較 ──────────────────────────────────────────────────── */

// 相對誤差比較。兩邊都是 0 附近時改用絕對誤差，
// 否則 |0 - 1e-9| / 0 會變成 Infinity，把對的答案判成錯的。
function close(actual, expected, tolerance = 1e-6) {
  if (Number.isNaN(actual) || Number.isNaN(expected)) return false;
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return actual === expected;
  const scale = Math.max(Math.abs(actual), Math.abs(expected));
  if (scale < 1e-9) return Math.abs(actual - expected) < 1e-9;
  return Math.abs(actual - expected) / scale <= tolerance;
}

// 級數到底收不收斂。
//
// 四個一開始想當然耳、但都是錯的判準：
//
//   「部分和是不是有限數」—— Σ1/n 加十萬項也才 12.1，是個很正常的有限數。
//   「最後一項夠不夠小」  —— Σ(−1)ⁿ⁺¹/n 在 n=10⁵ 時項還有 1e-5，但它收斂到 ln2。
//   「有沒有算出非有限值」—— Σn!/nⁿ 在 n=171 時 n! 溢位成 Infinity，
//                            那是浮點數的極限，不是級數的性質。項早就趨近 0 了。
//   「數值積分 ∫_N^∞ f 是不是有限」—— 雙指數變換的節點最遠只到 x≈4e18，
//                            所以它算 ∫_100^∞ dx/x 會得到 38 這個「有限值」。
//                            發散的積分在有限截斷下永遠看起來收斂。
//
// 真正可判定的做法，是把積分審斂法先做一次 x = e^u 代換：
//
//     ∫_N^∞ f(x)dx = ∫_{ln N}^∞ f(e^u)·e^u du
//
// 這個代換剛好把整個 Bertrand 家族 1/(n·lnᵖn) 變成乾淨的 1/uᵖ。
// 於是「收不收斂」就化約成「量一個冪次」，而冪次是可以穩定量出來的：
//
//     1/n        → g(u) = 1      → p = 0    發散
//     1/(n ln n) → g(u) = 1/u    → p = 1    發散（剛好在邊界上）
//     1/(n ln²n) → g(u) = 1/u²   → p = 2    收斂
//     1/n²       → g(u) = e^{−u} → p 隨 u 增大  收斂
//
// 交錯級數不走這條路，走 Leibniz：|aₙ| 單調遞減到 0 就收斂，這是定理，
// 而「單調遞減到 0」正好是數值上量得準的東西。
function seriesConverges(term, from) {
  // ── 1. 項有沒有趨近 0 ──
  // 探測點要涵蓋好幾個數量級，但 n!、2ⁿ 這類項在 n≈170 就會溢位，
  // 所以只採計算得出來的那些。溢位之前已經看得出趨勢。
  const probes = [];
  [4, 9, 19, 49, 99, 199, 999, 9999].forEach((offset) => {
    const value = term(from + offset);
    if (Number.isFinite(value)) probes.push({ n: from + offset, magnitude: Math.abs(value) });
  });
  if (probes.length < 2) {
    return { unknown: true, converges: false, reason: "算得出來的項太少，無法判斷" };
  }
  const first = probes[0].magnitude;
  const last = probes[probes.length - 1].magnitude;
  if (!(last < first * 0.2)) {
    return {
      converges: false,
      reason: `項沒有趨近 0（第 ${probes[0].n} 項 ${first.toPrecision(4)}，第 ${probes[probes.length - 1].n} 項 ${last.toPrecision(4)}）`
    };
  }

  // ── 2. 交錯還是正項 ──
  let signChanges = 0;
  let previousSign = 0;
  for (let n = from; n < from + 40; n += 1) {
    const value = term(n);
    if (!Number.isFinite(value) || value === 0) continue;
    const sign = Math.sign(value);
    if (previousSign && sign !== previousSign) signChanges += 1;
    previousSign = sign;
  }

  if (signChanges >= 10) {
    // Leibniz：交錯 + |aₙ| 單調遞減 → 0，就收斂。
    let monotone = true;
    let previous = Infinity;
    for (let k = 1; k <= 60; k += 1) {
      const n = from + k * 20;
      const value = Math.abs(term(n));
      if (!Number.isFinite(value)) break;
      if (value > previous * 1.0001) { monotone = false; break; }
      previous = value;
    }
    if (monotone) {
      return { converges: true, method: "Leibniz 判別法（交錯且 |aₙ| 單調遞減到 0）" };
    }
    // |aₙ| 不單調（例如 sin(n)/n²，正負號和大小都不規則）→ Leibniz 用不上。
    // 但絕對收斂會蘊含收斂，所以改測 Σ|aₙ|。
    const absolutePower = tailPower((n) => Math.abs(term(n)), from);
    if (absolutePower !== null && absolutePower > 1.02) {
      return { converges: true, method: `絕對收斂（Σ|aₙ| 代換後冪次 p≈${absolutePower.toPrecision(4)}）` };
    }
    // 交錯、不單調、又不絕對收斂 —— 這種情況數值上判不出來，
    // 不能因為判不出來就說它發散。
    return { unknown: true, converges: false, reason: "交錯且 |aₙ| 不單調，又非絕對收斂，數值上無法判定" };
  }

  // ── 3. 正項：代換後量冪次 ──
  const power = tailPower(term, from);
  if (power === null) {
    // g(u) 在每個探測點都已經是 0 —— 項衰減得比任何冪次都快
    // （n!/nⁿ、2ⁿ/n! 這類）。前面已經確認過項在遞減，所以是收斂。
    return { converges: true, method: "項衰減快於任何冪次（階乘／指數型）" };
  }
  // 2026-10-15 修兩個方向的錯（tools/validate_verify_paths.js 的「級數邊界」釘住）：
  //   aₙ = (ln n)^k / n^p、p 稍大於 1：代換後的「冪次」e(u) = (p−1)·u − k 跟著 u 線性長大，
  //     在 u=4…16 取最小值會拿到 0.4、甚至負數而判成發散（Σ1/n^1.1、Σln n/n^1.1 都被判反）。
  //   aₙ = 1/(n ln n ln ln n)：e(u) = 1 + 1/ln u 一路往 1 掉，u≤16 時還在 1.36 —— 被判成收斂，其實發散。
  const tail = tailExponents(term, from);
  if (tail && tail.slope > 0.005) {
    return { converges: true, method: `比較 (ln n)^k/n^p（p≈${(1 + tail.slope).toPrecision(4)} > 1）`, power: 1 + tail.slope };
  }
  if (power > 1.02) {
    if (tail && tail.falling) {
      return { unknown: true, converges: false, reason: `代換後冪次一路往下掉（${tail.e.map((v) => v.toPrecision(3)).join(" → ")}），可能是 ln ln n 型，數值上判不出來` };
    }
    return { converges: true, method: `積分審斂法（代換後冪次 p≈${power.toPrecision(4)} > 1）`, power };
  }
  return { converges: false, reason: `積分審斂法：代換後冪次 p≈${power.toPrecision(4)} ≤ 1`, power };
}

// 代換後冪次 e(u) = −d ln(aₙ·n)/d ln u（n = e^u）在 u = 8、16、32 各量一次。
//   (ln n)^k/n^p：e(u) = (p−1)·u − k，對 u 是一條直線 → 兩段差 d₂ ≈ 2·d₁，斜率 p−1 = d₂/16
//   1/(n lnᵇ n)：e(u) = b，常數；1/(n ln n ln ln n)：e(u) = 1 + 1/ln u，緩慢往下掉
// 有任何一點算不出來（溢位、浮點相消變 0）就回 null，交回原本的判定。
function tailExponents(term, from) {
  const g = (v) => {
    const x = Math.round(Math.exp(v));
    if (x < from) return Number.NaN;
    const value = term(x);
    return Number.isFinite(value) ? Math.abs(value) * x : Number.NaN;
  };
  const e = [];
  for (const u of [8, 16, 32]) {
    const step = u * 0.05;
    const high = g(u + step);
    const low = g(u - step);
    if (!(high > 0) || !(low > 0)) return null;
    e.push(-(Math.log(high) - Math.log(low)) / (Math.log(u + step) - Math.log(u - step)));
  }
  const d1 = e[1] - e[0];
  const d2 = e[2] - e[1];
  const linear = d1 > 0 && d2 / d1 > 1.8 && d2 / d1 < 2.2;
  return { e, slope: linear ? d2 / 16 : 0, falling: e[2] < e[0] - 0.05 };
}

// 量 g(u) = a(e^u)·e^u 的冪次：p = −d(ln g)/d(ln u)。
// 在三個相距很遠的 u 上各量一次，取最小值 —— 因為冪次會往 1 漂的
// （Bertrand 型）本來就該判成發散，取最小值正好符合這個直覺。
function tailPower(term, from) {
  // 取樣點一定要落在整數上：(−1)ⁿ 這類項只在整數有定義，
  // 用 x = e^u 的實數值去算會得到 NaN，然後被誤判成「衰減快於任何冪次」——
  // Σ1/n 的絕對值級數就會被說成收斂。
  const g = (u) => {
    const x = Math.round(Math.exp(u));
    if (x < from) return Number.NaN;
    const value = term(x);
    if (!Number.isFinite(value)) return 0;
    return Math.abs(value) * x;
  };
  const powers = [];
  // u 從 4 起跳（n≈55），再小的話 n 取整的誤差會污染斜率。
  // 階乘型的項在 n≈170 就溢位，所以低端的探測點不能省。
  for (const u of [4, 5, 6, 8, 12, 16]) {
    const step = u * 0.05;
    const high = g(u + step);
    const low = g(u - step);
    if (!(high > 0) || !(low > 0)) {
      // g 已經掉到 0（例如 1/n² 在 u=32 時 e^{−32}）→ 收斂得比任何冪次都快
      if (low > 0 && high === 0) powers.push(Infinity);
      continue;
    }
    const slope = (Math.log(high) - Math.log(low)) / (Math.log(u + step) - Math.log(u - step));
    powers.push(-slope);
  }
  if (!powers.length) return null;
  return Math.min(...powers);
}

// 絕對收斂 ⟺ Σ|aₙ| 收斂。條件收斂的題目答錯成「絕對收斂」是常見錯誤，
// 值得單獨驗一條。
function seriesConvergesAbsolutely(term, from) {
  return seriesConverges((n) => Math.abs(term(n)), from);
}

module.exports = {
  createSum, derivative, partial, integrate, tanhSinh, seriesSum,
  limit, wynnEpsilon, taylorCoefficient, close, seriesConverges, seriesConvergesAbsolutely
};
