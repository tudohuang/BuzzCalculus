// Numeric verification of the quantitative claims inside BUZZ_PROOFS
// reference solutions (contest tier). A proof "answer" is its chain of
// claims; each identity / inequality / asymptotic / counterexample below is
// checked on concrete instances, so a wrong step in a reference proof fails
// loudly here. Logical structure (quantifier order etc.) still needs a human
// read — this tool guards every step that CAN be computed.
//
// Usage: node tools/verify_proof_claims.js

"use strict";

global.window = {};
require("../src/proofs.js");
const proofs = global.window.BUZZ_PROOFS || [];
const byId = new Map(proofs.map((p) => [p.id, p]));

let checks = 0;
let failures = 0;

function assert(proofId, label, ok, detail) {
  checks += 1;
  if (!ok) {
    failures += 1;
    console.log(`FAIL ${proofId} :: ${label}${detail ? ` :: ${detail}` : ""}`);
  } else {
    console.log(`PASS ${proofId} :: ${label}`);
  }
}

function simpson(f, a, b, n) {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/* ===== structural sanity for the whole proof bank ===== */
{
  const ids = new Set();
  const tiers = new Set(["basic", "standard", "advanced", "boss", "contest", "todai", "lean"]);
  let ok = true;
  proofs.forEach((p) => {
    if (!p.id || ids.has(p.id)) ok = false;
    ids.add(p.id);
    if (!tiers.has(p.tier)) ok = false;
    if (!p.title || !p.prompt || !Array.isArray(p.solution) || p.solution.length < 3) ok = false;
    if (!Number.isInteger(p.difficulty) || p.difficulty < 1 || p.difficulty > 6) ok = false;
    p.solution.forEach((step) => {
      if (!step.text || !step.tex) ok = false;
    });
  });
  assert("bank", `structure of ${proofs.length} proofs (unique ids, tiers, steps)`, ok);
}

/* ===== proof-contest-001: Stolz–Cesàro =====
   Instance a_n = sum sqrt(k), b_n = n^{3/2}, L = 2/3. */
{
  const id = "proof-contest-001";
  const L = 2 / 3;
  const N = 200000;
  const a = new Float64Array(N + 2);
  const b = (n) => Math.pow(n, 1.5);
  for (let n = 1; n <= N + 1; n++) a[n] = a[n - 1] + Math.sqrt(n);
  // claim 1: difference quotient -> L
  const dq = (n) => (a[n + 1] - a[n]) / (b(n + 1) - b(n));
  assert(id, "difference quotient -> L", Math.abs(dq(N) - L) < 1e-4, `dq=${dq(N)}`);
  // claim 2: telescoped sandwich for eps=0.01 from an N0 where dq is inside L±eps
  const eps = 0.01;
  let N0 = 1;
  while (Math.abs(dq(N0) - L) >= eps) N0++;
  let sandwich = true;
  for (let n = N0 + 1; n <= N; n += 997) {
    const lhs = (L - eps) * (b(n) - b(N0));
    const rhs = (L + eps) * (b(n) - b(N0));
    const mid = a[n] - a[N0];
    if (!(lhs < mid && mid < rhs)) sandwich = false;
  }
  assert(id, "telescoped inequality (L±ε)(b_n-b_N) brackets a_n-a_N", sandwich);
  // claim 3: conclusion a_n/b_n -> L
  assert(id, "conclusion a_n/b_n -> L", Math.abs(a[N] / b(N) - L) < 1e-3, `${a[N] / b(N)}`);
}

/* ===== proof-contest-002: a_{n+1}=a_n+1/a_n ~ sqrt(2n) ===== */
{
  const id = "proof-contest-002";
  const N = 1000000;
  let a = 1;
  let identityOk = true, lowerOk = true, upperOk = true;
  let sumInv = 0; // sum_{k=1}^{n-1} 1/a_k^2
  for (let n = 1; n <= N; n++) {
    const sq = a * a;
    if (sq < 2 * n - 1 - 1e-9) lowerOk = false;
    if (sq > 2 * n + Math.log(n) + 1 + 1e-9) upperOk = false;
    if (n % 100000 === 1) {
      const next = a + 1 / a;
      if (Math.abs(next * next - (sq + 2 + 1 / sq)) > 1e-9 * next * next) identityOk = false;
    }
    sumInv += 1 / sq;
    a += 1 / a;
  }
  assert(id, "identity a_{n+1}^2 = a_n^2 + 2 + 1/a_n^2", identityOk);
  assert(id, "lower bound a_n^2 >= 2n-1 for n<=1e6", lowerOk);
  assert(id, "upper bound a_n^2 <= 2n + ln n + 1 for n<=1e6", upperOk);
  // harmonic-type bound used in step 3: sum 1/a_k^2 <= sum 1/(2k-1) <= ln n + 1 + 1
  let harm = 0;
  for (let k = 1; k < N; k++) harm += 1 / (2 * k - 1);
  assert(id, "sum 1/(2k-1) <= ln n + 2 (majorant of step 3)", sumInv <= harm && harm <= Math.log(N) + 2, `sumInv=${sumInv} harm=${harm}`);
  assert(id, "conclusion a_n/sqrt(2n) -> 1", Math.abs(a / Math.sqrt(2 * (N + 1)) - 1) < 1e-3, `${a / Math.sqrt(2 * (N + 1))}`);
}

/* ===== proof-contest-003: x_{n+1}=sin x_n, sqrt(n) x_n -> sqrt(3) ===== */
{
  const id = "proof-contest-003";
  // claim: monotone decreasing to 0
  let x = 1, mono = true;
  const N = 2000000;
  const snapshot = [];
  for (let n = 1; n <= N; n++) {
    const nx = Math.sin(x);
    if (!(nx > 0 && nx < x)) mono = false;
    if (n === N - 1) snapshot.push(x);
    x = nx;
  }
  assert(id, "0 < sin x < x keeps x_n decreasing to 0", mono && x < 1e-2, `x_N=${x}`);
  // claim: 1/sin^2 t - 1/t^2 -> 1/3
  const g = (t) => 1 / Math.sin(t) ** 2 - 1 / (t * t);
  assert(id, "Taylor: 1/sin^2 t - 1/t^2 -> 1/3", Math.abs(g(1e-3) - 1 / 3) < 1e-5 && Math.abs(g(1e-2) - 1 / 3) < 1e-3, `${g(1e-3)}`);
  // claim: consecutive difference of 1/x_n^2 near 1/3 at the tail
  const prev = snapshot[0];
  const diff = 1 / (Math.sin(prev) ** 2) - 1 / (prev * prev);
  assert(id, "1/x_{n+1}^2 - 1/x_n^2 -> 1/3", Math.abs(diff - 1 / 3) < 1e-4, `${diff}`);
  // conclusion via n x_n^2 -> 3
  assert(id, "conclusion n x_n^2 -> 3", Math.abs(N * x * x - 3) < 5e-2, `${N * x * x}`);
}

/* ===== proof-contest-004: integral Cauchy–Schwarz ===== */
{
  const id = "proof-contest-004";
  // random polynomial instances on [0,1]
  let rngState = 42;
  const rnd = () => ((rngState = (rngState * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
  let qNonneg = true, discOk = true, finalOk = true;
  for (let trial = 0; trial < 20; trial++) {
    const cf = [rnd(), rnd(), rnd(), rnd()];
    const cg = [rnd(), rnd(), rnd(), rnd()];
    const f = (u) => cf[0] + cf[1] * u + cf[2] * u * u + cf[3] * Math.sin(3 * u);
    const gg = (u) => cg[0] + cg[1] * u + cg[2] * u * u + cg[3] * Math.cos(2 * u);
    const If2 = simpson((u) => f(u) ** 2, 0, 1, 2000);
    const Ig2 = simpson((u) => gg(u) ** 2, 0, 1, 2000);
    const Ifg = simpson((u) => f(u) * gg(u), 0, 1, 2000);
    for (const t of [-3, -1, -0.2, 0.4, 1.7, 5]) {
      const q = t * t * Ig2 + 2 * t * Ifg + If2;
      if (q < -1e-10) qNonneg = false;
    }
    if (4 * Ifg * Ifg - 4 * If2 * Ig2 > 1e-9) discOk = false;
    if (Ifg * Ifg > If2 * Ig2 + 1e-9) finalOk = false;
  }
  assert(id, "q(t)=∫(f+tg)^2 >= 0 on sampled t (20 random instances)", qNonneg);
  assert(id, "discriminant (∫fg)^2 - ∫f^2∫g^2 <= 0", discOk);
  assert(id, "conclusion |∫fg| <= sqrt(∫f^2 ∫g^2)", finalOk);
}

/* ===== proof-contest-005: Young's inequality ===== */
{
  const id = "proof-contest-005";
  let rngState = 7;
  const rnd = () => ((rngState = (rngState * 1103515245 + 12345) % 2147483648) / 2147483648);
  let jensen = true, young = true;
  for (let trial = 0; trial < 200; trial++) {
    const a = 0.05 + 4 * rnd(), b = 0.05 + 4 * rnd(), p = 1.05 + 4 * rnd();
    const q = p / (p - 1);
    const u = Math.pow(a, p), v = Math.pow(b, q);
    if (Math.log(u / p + v / q) < Math.log(u) / p + Math.log(v) / q - 1e-12) jensen = false;
    if (a * b > u / p + v / q + 1e-12) young = false;
  }
  assert(id, "concavity step: ln(u/p+v/q) >= ln(u)/p + ln(v)/q", jensen);
  assert(id, "conclusion ab <= a^p/p + b^q/q (200 random triples)", young);
  // equality case a^p = b^q
  const a = 1.7, p = 2.5, q = p / (p - 1), b = Math.pow(Math.pow(a, p), 1 / q);
  assert(id, "equality iff a^p=b^q", Math.abs(a * b - (Math.pow(a, p) / p + Math.pow(b, q) / q)) < 1e-9);
}

/* ===== proof-contest-006: Dirichlet integral converges, not absolutely ===== */
{
  const id = "proof-contest-006";
  assert(id, "continuous extension: sin x/x -> 1", Math.abs(Math.sin(1e-8) / 1e-8 - 1) < 1e-9);
  // IBP identity and 2/a bound on random windows
  let ibpOk = true, boundOk = true;
  const pairs = [[1, 7.3], [2.5, 40], [10, 1000], [5, 6]];
  for (const [a, b] of pairs) {
    const direct = simpson((t) => Math.sin(t) / t, a, b, 400000);
    const viaIBP = Math.cos(a) / a - Math.cos(b) / b - simpson((t) => Math.cos(t) / (t * t), a, b, 400000);
    if (Math.abs(direct - viaIBP) > 1e-8) ibpOk = false;
    if (Math.abs(direct) > 2 / a + 1e-9) boundOk = false;
  }
  assert(id, "IBP identity on sampled [a,b]", ibpOk);
  assert(id, "tail bound |∫_a^b sin x/x| <= 2/a", boundOk);
  // half-period lower bound and harmonic divergence
  let lbOk = true, hsum = 0;
  for (let k = 1; k <= 60; k++) {
    const seg = simpson((t) => Math.abs(Math.sin(t)) / t, k * Math.PI, (k + 1) * Math.PI, 4000);
    if (seg < 2 / ((k + 1) * Math.PI) - 1e-9) lbOk = false;
    hsum += 2 / ((k + 1) * Math.PI);
  }
  assert(id, "each half-period >= 2/((k+1)π)", lbOk);
  assert(id, "harmonic minorant grows without bound (partial sum past 2)", hsum > 2, `sum60=${hsum}`);
}

/* ===== proof-contest-007: Riemann–Lebesgue (C^1) ===== */
{
  const id = "proof-contest-007";
  const a = 0, b = 2;
  const f = (u) => Math.exp(u) * Math.sin(3 * u) + u * u;
  const fp = (u) => Math.exp(u) * (Math.sin(3 * u) + 3 * Math.cos(3 * u)) + 2 * u;
  const intAbsFp = simpson((u) => Math.abs(fp(u)), a, b, 200000);
  const M = Math.abs(f(a)) + Math.abs(f(b)) + intAbsFp;
  let boundOk = true;
  const vals = [];
  for (const n of [10, 100, 1000]) {
    const I = simpson((u) => f(u) * Math.sin(n * u), a, b, 2000000);
    vals.push(Math.abs(I));
    if (Math.abs(I) > M / n + 1e-9) boundOk = false;
  }
  assert(id, "bound |∫ f sin(nx)| <= (|f(a)|+|f(b)|+∫|f'|)/n for n=10,100,1000", boundOk, vals.join(","));
  assert(id, "conclusion: values decay to 0", vals[2] < vals[0] && vals[2] < 1e-2, vals.join(","));
}

/* ===== proof-contest-008: Dini's theorem ===== */
{
  const id = "proof-contest-008";
  // instance: f_n(x) = (1+x/n)^n increasing to e^x on [0,1], convergence uniform
  const sup = (n) => {
    let m = 0;
    for (let i = 0; i <= 2000; i++) {
      const u = i / 2000;
      m = Math.max(m, Math.exp(u) - Math.pow(1 + u / n, n));
    }
    return m;
  };
  let monotone = true;
  for (let i = 0; i <= 200; i++) {
    const u = i / 200;
    if (Math.pow(1 + u / 5, 5) > Math.pow(1 + u / 6, 6) + 1e-12) monotone = false;
    if (Math.pow(1 + u / 40, 40) > Math.pow(1 + u / 41, 41) + 1e-12) monotone = false;
  }
  assert(id, "instance (1+x/n)^n is monotone increasing in n", monotone);
  assert(id, "uniform convergence on compact [0,1]: sup error 5 -> 50 -> 500 shrinks to 0", sup(5) > sup(50) && sup(50) > sup(500) && sup(500) < 3e-3, `${sup(500)}`);
  // counterexample: x^n on [0,1) — pointwise to 0, sup stays 1
  const supXn = (n) => Math.pow(1 - 1e-9, n); // approaches sup over [0,1)
  assert(id, "compactness necessary: sup_{[0,1)} x^n stays near 1", supXn(10) > 0.999 && supXn(1000) > 0.999);
}

/* ===== proof-contest-009: e irrational (exact BigInt tail check) ===== */
{
  const id = "proof-contest-009";
  // claim: 0 < n!(e - s_n) < 1/n. Compute tail_n = sum_{k>n} n!/k! exactly enough.
  let ok = true;
  for (let n = 1; n <= 30; n++) {
    let term = 1, tail = 0;
    for (let k = n + 1; k <= n + 80; k++) { term /= k; tail += term; }
    if (!(tail > 0 && tail < 1 / n)) ok = false;
  }
  assert(id, "tail bound 0 < n!(e - s_n) < 1/n for n=1..30", ok);
  // integer parts: q! * s_q is an integer (exact BigInt)
  let intOk = true;
  for (let q = 2; q <= 20; q++) {
    let fact = 1n;
    for (let k = 2n; k <= BigInt(q); k++) fact *= k;
    let acc = 0n, kfact = 1n;
    for (let k = 0; k <= q; k++) {
      if (k > 0) kfact *= BigInt(k);
      acc += fact / kfact; // divides exactly since k <= q
      if ((fact % kfact) !== 0n) intOk = false;
    }
  }
  assert(id, "q!·s_q is an exact integer (BigInt, q=2..20)", intOk);
}

/* ===== proof-contest-010: Darboux theorem ===== */
{
  const id = "proof-contest-010";
  // instance: f(x) = x^2 sin(1/x), f(0)=0 — derivative exists everywhere, discontinuous at 0
  const fp = (x) => (x === 0 ? 0 : 2 * x * Math.sin(1 / x) - Math.cos(1 / x));
  // discontinuity: f'(1/(2πk)) = -1 while f'(0)=0
  const spike = fp(1 / (2 * Math.PI * 50));
  assert(id, "f' is discontinuous at 0 (values near -1 arbitrarily close to 0)", Math.abs(spike + 1) < 1e-2, `${spike}`);
  // Darboux property: for y between f'(a), f'(b), a root of f' - y exists
  let ivtOk = true;
  const a = 0.03, b = 0.5; // fp(a) oscillates, fp(b) computed
  for (const y of [-0.5, -0.2, 0.1, 0.3]) {
    // scan for sign change of fp - y on [a,b], then bisect
    let found = false, prevU = a, prevV = fp(a) - y;
    for (let i = 1; i <= 20000 && !found; i++) {
      const u = a + ((b - a) * i) / 20000;
      const v = fp(u) - y;
      if (prevV === 0 || prevV * v < 0) {
        let lo = prevU, hi = u;
        for (let it = 0; it < 80; it++) {
          const mid = (lo + hi) / 2;
          if ((fp(lo) - y) * (fp(mid) - y) <= 0) hi = mid;
          else lo = mid;
        }
        if (Math.abs(fp((lo + hi) / 2) - y) < 1e-6) found = true;
      }
      prevU = u; prevV = v;
    }
    if (!found) ivtOk = false;
  }
  assert(id, "intermediate values of f' are attained (4 targets, bisection)", ivtOk);
}

/* ===== proof-contest-011: Gronwall inequality ===== */
{
  const id = "proof-contest-011";
  // instance: u(t)=e^{0.5t}, beta=1, alpha=1 on [0,2]
  const u = (t) => Math.exp(0.5 * t);
  const beta = () => 1;
  const alpha = 1;
  const v = (t) => alpha + simpson((s) => beta(s) * u(s), 0, Math.max(t, 1e-12), 2000);
  let hypOk = true, stepOk = true, conclOk = true;
  for (let i = 1; i <= 40; i++) {
    const t = (2 * i) / 40;
    if (u(t) > v(t) + 1e-9) hypOk = false;                    // hypothesis u <= alpha + ∫βu
    const vp = beta(t) * u(t);                                 // v' = βu
    if (vp > beta(t) * v(t) + 1e-9) stepOk = false;            // key step v' <= βv
    if (u(t) > alpha * Math.exp(t) + 1e-9) conclOk = false;    // conclusion u <= α e^{∫β}
  }
  assert(id, "instance satisfies hypothesis u <= α + ∫βu", hypOk);
  assert(id, "key step v' = βu <= βv", stepOk);
  assert(id, "conclusion u <= α e^{∫β}", conclOk);
}

/* ===== proof-contest-012: n∫x^n f -> f(1) ===== */
{
  const id = "proof-contest-012";
  const f = (x) => Math.cos(2 * x) + x * x * x;
  const target = f(1);
  const I = (n) => n * simpson((s) => Math.pow(1 - s, n) * f(1 - s), 0, Math.min(1, 80 / n), 400000);
  const v1 = I(2000), v2 = I(4000);
  assert(id, "conclusion n∫x^n f -> f(1) (Richardson n=2000,4000)", Math.abs(2 * v2 - v1 - target) < 1e-3, `${2 * v2 - v1} vs ${target}`);
  // constant case: n∫x^n dx = n/(n+1)
  assert(id, "constant case n∫x^n = n/(n+1)", Math.abs(1000 * simpson((x) => Math.pow(x, 1000), 0, 1, 400000) - 1000 / 1001) < 1e-6);
  // geometric-decay claim: n(1-δ)^{n+1} -> 0
  const dieOff = (n, d) => n * Math.pow(1 - d, n + 1);
  assert(id, "front piece dies: n(1-δ)^{n+1} -> 0 (δ=0.1)", dieOff(50, 0.1) > dieOff(200, 0.1) && dieOff(200, 0.1) < 1e-6, `${dieOff(200, 0.1)}`);
}


/* ===== 東大杉浦《解析演習》：每一題可算的主張 ===== */
{
  const near = (a, b, tol) => Math.abs(a - b) <= tol * (1 + Math.abs(b));
  const deriv = (f, x, h = 1e-4) => (f(x + h) - f(x - h)) / (2 * h);
  const deriv2 = (f, x, h = 1e-3) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);

  /* II-1：f(x) = (x²+1)/3，0 ≤ f ≤ 1、f′ = 2x/3 ≠ 1，唯一不動點 (3−√5)/2 */
  {
    const id = "proof-todai-201";
    const f = (x) => (x * x + 1) / 3;
    const g = (x) => f(x) - x;
    let crossings = 0;
    for (let i = 0; i < 10000; i += 1) { const a = i / 10000, b = (i + 1) / 10000; if (g(a) * g(b) < 0) crossings += 1; }
    assert(id, "g = f − x changes sign exactly once on [0,1]", g(0) > 0 && g(1) < 0 && crossings === 1, `${crossings}`);
    assert(id, "fixed point is (3−√5)/2", near(f((3 - Math.sqrt(5)) / 2), (3 - Math.sqrt(5)) / 2, 1e-12));
    let maxDeriv = 0;
    for (let x = 0; x <= 1; x += 0.001) maxDeriv = Math.max(maxDeriv, Math.abs(deriv(f, x)));
    assert(id, "f′ stays away from 1 on the instance", maxDeriv < 0.7, `${maxDeriv}`);
  }

  /* II-2：min_h (2A/h + Bh/2) = 2√(AB)，達到於 h = 2√(A/B)；f = sin 的實例 */
  {
    const id = "proof-todai-202";
    const A = 3, B = 5;
    let best = Infinity, bestH = 0;
    for (let h = 0.01; h <= 20; h += 0.001) { const v = 2 * A / h + B * h / 2; if (v < best) { best = v; bestH = h; } }
    assert(id, "min over h of 2A/h + Bh/2 = 2√(AB)", near(best, 2 * Math.sqrt(A * B), 1e-5) && near(bestH, 2 * Math.sqrt(A / B), 1e-2), `${best} at h=${bestH}`);
    let sup = 0;
    for (let x = 0; x <= 20; x += 0.01) sup = Math.max(sup, Math.abs(Math.cos(x)));
    assert(id, "instance f = sin: |f′| ≤ 2√(1·1)", sup <= 2);
    // 泰勒餘項的等式在具體點上：f(x+h) − f(x) − h f′(x) = (h²/2) f″(ξ) 有解 ξ ∈ (x, x+h)
    const x0 = 0.3, h = 0.5, lhs = Math.sin(x0 + h) - Math.sin(x0) - h * Math.cos(x0);
    let found = false;
    for (let xi = x0; xi <= x0 + h; xi += 1e-4) if (Math.abs((h * h / 2) * (-Math.sin(xi)) - lhs) < 1e-4) found = true;
    assert(id, "Taylor remainder has a ξ in (x, x+h)", found);
  }

  /* II-4：Hermite 遞迴與實根 */
  {
    const id = "proof-todai-204";
    const H = [(x) => 1, (x) => x, (x) => x * x - 1, (x) => x * x * x - 3 * x, (x) => x ** 4 - 6 * x * x + 3];
    const rodrigues = (n, x) => {
      // (−1)^n e^{x²/2} dⁿ/dxⁿ e^{−x²/2}，用高階中央差分（n ≤ 3 夠準）
      const g = (t) => Math.exp(-t * t / 2);
      const h = 1e-2;
      const d = [g(x)];
      if (n >= 1) d.push((g(x + h) - g(x - h)) / (2 * h));
      if (n >= 2) d.push((g(x + h) - 2 * g(x) + g(x - h)) / (h * h));
      if (n >= 3) d.push((g(x + 2 * h) - 2 * g(x + h) + 2 * g(x - h) - g(x - 2 * h)) / (2 * h * h * h));
      return Math.pow(-1, n) * Math.exp(x * x / 2) * d[n];
    };
    let ok = true;
    for (let n = 0; n <= 3; n += 1) for (const x of [-1.3, 0.4, 2.1]) if (!near(rodrigues(n, x), H[n](x), 2e-3)) ok = false;
    assert(id, "Rodrigues form matches H_0..H_3 = 1, x, x²−1, x³−3x", ok);
    ok = true;
    for (let n = 0; n <= 3; n += 1) for (const x of [-1.3, 0.4, 2.1]) if (!near(x * H[n](x) - deriv(H[n], x), H[n + 1](x), 1e-6)) ok = false;
    assert(id, "recurrence H_{n+1} = xH_n − H_n′", ok);
    const roots = (f, lo, hi) => { let c = 0; for (let x = lo; x < hi; x += 1e-3) if (f(x) * f(x + 1e-3) < 0) c += 1; return c; };
    assert(id, "H_3 has 3 real roots, H_4 has 4", roots(H[3], -4, 4) === 3 && roots(H[4], -4, 4) === 4);
  }

  /* II-5：f^{(1)} = 2x⁻³e^{−1/x²}，與 tᵏe^{−t²} → 0 */
  {
    const id = "proof-todai-205";
    const f = (x) => (x > 0 ? Math.exp(-1 / (x * x)) : 0);
    const P1 = (x) => 2 * Math.pow(x, -3) * Math.exp(-1 / (x * x));
    assert(id, "f′(x) = P_1(1/x)e^{−1/x²} with P_1(t) = 2t³ (x = 0.7)", near(deriv(f, 0.7, 1e-5), P1(0.7), 1e-5), `${deriv(f, 0.7, 1e-5)} vs ${P1(0.7)}`);
    assert(id, "t⁵e^{−t²} → 0 (t = 8)", Math.pow(8, 5) * Math.exp(-64) < 1e-20);
    assert(id, "f′(0) = 0 from the right (h = 0.05)", Math.abs(f(0.05) / 0.05) < 1e-100);
  }

  /* II-6：Jensen，f = eˣ */
  {
    const id = "proof-todai-206";
    const xs = [0, 1, 2.5], ps = [0.2, 0.5, 0.3];
    const m = xs.reduce((s, x, i) => s + ps[i] * x, 0);
    const lhs = xs.reduce((s, x, i) => s + ps[i] * Math.exp(x), 0);
    assert(id, "Σ p_i e^{x_i} ≥ e^{Σ p_i x_i}", lhs >= Math.exp(m), `${lhs} vs ${Math.exp(m)}`);
    assert(id, "tangent-line inequality e^y ≥ e^m + e^m(y − m)", [-1, 0.3, 2].every((y) => Math.exp(y) >= Math.exp(m) + Math.exp(m) * (y - m) - 1e-12));
  }

  /* II-7：Wronskian */
  {
    const id = "proof-todai-207";
    const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const W3 = (x) => det3([[1, x, 1 + 2 * x], [0, 1, 2], [0, 0, 0]]);
    assert(id, "dependent 1, x, 1+2x ⇒ W ≡ 0", [0.2, 1.5, -3].every((x) => Math.abs(W3(x)) < 1e-12));
    const W2 = (x) => Math.exp(x) * 2 * Math.exp(2 * x) - Math.exp(2 * x) * Math.exp(x);
    assert(id, "W(eˣ, e²ˣ) = e³ˣ ≠ 0", [0.2, 1.5].every((x) => near(W2(x), Math.exp(3 * x), 1e-12)));
  }

  /* II-8：對稱差商 */
  {
    const id = "proof-todai-208";
    const q = (x) => (Math.cos(x) + Math.cos(-x) - 2) / (x * x);
    assert(id, "(f(x)+f(−x)−2f(0))/x² → f″(0) = −1 for cos", near(q(1e-3), -1, 1e-5), `${q(1e-3)}`);
    const F = (x, y) => Math.exp(x * y);
    const q2 = (t) => (F(t, t) - F(t, 0) - F(0, t) + F(0, 0)) / (t * t);
    assert(id, "(f(t,t)−f(t,0)−f(0,t)+f(0,0))/t² → f_xy(0,0) = 1 for e^{xy}", near(q2(1e-3), 1, 1e-5), `${q2(1e-3)}`);
  }

  /* II-11：旋轉 θ 下 |∇f| 與 Δf 不變 */
  {
    const id = "proof-todai-211";
    const f = (x1, x2) => x1 * x1 + 3 * x2 * x2 + x1 * x2 + Math.sin(x1);
    const th = 0.7, c = Math.cos(th), s = Math.sin(th);
    const g = (y1, y2) => f(c * y1 - s * y2, s * y1 + c * y2);
    const pt = [0.4, -0.9];
    const x = [c * pt[0] - s * pt[1], s * pt[0] + c * pt[1]];
    const gradF = [deriv((t) => f(t, x[1]), x[0]), deriv((t) => f(x[0], t), x[1])];
    const gradG = [deriv((t) => g(t, pt[1]), pt[0]), deriv((t) => g(pt[0], t), pt[1])];
    assert(id, "|∇_x f|² = |∇_y g|²", near(gradF[0] ** 2 + gradF[1] ** 2, gradG[0] ** 2 + gradG[1] ** 2, 1e-6));
    const lapF = deriv2((t) => f(t, x[1]), x[0]) + deriv2((t) => f(x[0], t), x[1]);
    const lapG = deriv2((t) => g(t, pt[1]), pt[0]) + deriv2((t) => g(pt[0], t), pt[1]);
    assert(id, "Δ_x f = Δ_y g", near(lapF, lapG, 1e-4), `${lapF} vs ${lapG}`);
  }

  /* II-12：乘積極限 √e */
  {
    const id = "proof-todai-212";
    const n = 4000;
    let prod = 1, L = 0;
    for (let k = 1; k <= n; k += 1) { prod *= 1 + k / (n * n); L += Math.log(1 + k / (n * n)); }
    assert(id, "Π(1 + k/n²) → √e (n = 4000)", near(prod, Math.sqrt(Math.E), 1e-3), `${prod}`);
    const A = (n + 1) / (2 * n);
    let B = 0;
    for (let k = 1; k <= n; k += 1) B += (k / (n * n)) ** 2;
    assert(id, "A − B/2 ≤ L ≤ A with the closed forms", A - B / 2 <= L && L <= A && B <= 1 / n);
    assert(id, "t − t²/2 ≤ log(1+t) ≤ t on [0,1]", [0.01, 0.3, 0.9].every((t) => t - t * t / 2 <= Math.log(1 + t) && Math.log(1 + t) <= t));
  }

  /* II-15：y = arctan(1/x) 的二階導數 */
  {
    const id = "proof-todai-215";
    const y = (x) => Math.atan(1 / x);
    const x0 = 2;
    const sy = Math.sin(y(x0));
    const formula2 = Math.pow(-1, 2) * 1 * sy * sy * Math.sin(2 * y(x0));
    assert(id, "y″(2) = (−1)²·1!·sin²y·sin 2y = 4/25", near(deriv2(y, x0, 1e-3), formula2, 1e-4) && near(formula2, 4 / 25, 1e-12), `${deriv2(y, x0, 1e-3)} vs ${formula2}`);
    assert(id, "y′ = −sin²y", near(deriv(y, x0), -sy * sy, 1e-6));
    const formula3 = -2 * Math.pow(sy, 3) * Math.sin(3 * y(x0));
    const d3 = (deriv2(y, x0 + 1e-3, 1e-3) - deriv2(y, x0 - 1e-3, 1e-3)) / (2e-3);
    assert(id, "y‴(2) matches the formula", near(d3, formula3, 1e-2), `${d3} vs ${formula3}`);
  }

  /* II-17：y = ½log((1+x)/(1−x)) 滿足 (1−x²)y″ − 2xy′ = 0 */
  {
    const id = "proof-todai-217";
    const y = (x) => 0.5 * Math.log((1 + x) / (1 - x));
    const x0 = 0.3;
    const residual = (1 - x0 * x0) * deriv2(y, x0) - 2 * x0 * deriv(y, x0);
    assert(id, "ODE residual ≈ 0 at x = 0.3", Math.abs(residual) < 1e-5, `${residual}`);
    assert(id, "(1 − x²)y′ = 1", near((1 - x0 * x0) * deriv(y, x0), 1, 1e-6));
    let series = 0;
    for (let k = 0; k <= 60; k += 1) series += Math.pow(x0, 2 * k + 1) / (2 * k + 1);
    assert(id, "artanh series", near(series, y(x0), 1e-10));
  }

  /* II-20：y = e^{a·arcsin x} */
  {
    const id = "proof-todai-220";
    const a = 2;
    const y = (x) => Math.exp(a * Math.asin(x));
    const x0 = 0.3;
    const residual = (1 - x0 * x0) * deriv2(y, x0) - x0 * deriv(y, x0) - a * a * y(x0);
    assert(id, "ODE residual ≈ 0 at x = 0.3, a = 2", Math.abs(residual) < 1e-4 * y(x0), `${residual}`);
    const c = [1, a];
    for (let n = 0; n <= 4; n += 1) c[n + 2] = (n * n + a * a) / ((n + 1) * (n + 2)) * c[n];
    const series = c.reduce((s, cn, n) => s + cn * Math.pow(0.1, n), 0);
    assert(id, "recurrence series matches y(0.1) to O(x⁷)", near(series, y(0.1), 1e-6), `${series} vs ${y(0.1)}`);
    assert(id, "c_2 = a²/2, c_3 = a(1+a²)/6", near(c[2], a * a / 2, 1e-12) && near(c[3], a * (1 + a * a) / 6, 1e-12));
  }

  /* II-21：橢圓內接三角形 */
  {
    const id = "proof-todai-221";
    const a = 3, b = 1.5;
    const area = (t1, t2, t3) => {
      const p = [t1, t2, t3].map((t) => [a * Math.cos(t), b * Math.sin(t)]);
      return Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1])) / 2;
    };
    const best = 3 * Math.sqrt(3) / 4 * a * b;
    assert(id, "equilateral image reaches (3√3/4)ab", near(area(0, 2 * Math.PI / 3, 4 * Math.PI / 3), best, 1e-12));
    let sup = 0;
    for (let i = 0; i < 20000; i += 1) sup = Math.max(sup, area(Math.random() * 6.3, Math.random() * 6.3, Math.random() * 6.3));
    assert(id, "random inscribed triangles never exceed it", sup <= best + 1e-9, `${sup} vs ${best}`);
  }

  /* II-28：exp(tX) 的導數 */
  {
    const id = "proof-todai-228";
    const E = (t) => [[Math.cos(t), Math.sin(t)], [-Math.sin(t), Math.cos(t)]];   // exp(tX), X = [[0,1],[-1,0]]
    const X = [[0, 1], [-1, 0]];
    const t0 = 0.5, h = 1e-5;
    const dE = E(t0 + h).map((row, i) => row.map((v, j) => (v - E(t0 - h)[i][j]) / (2 * h)));
    const XE = [[0, 0], [0, 0]];
    for (let i = 0; i < 2; i += 1) for (let j = 0; j < 2; j += 1) for (let k = 0; k < 2; k += 1) XE[i][j] += X[i][k] * E(t0)[k][j];
    assert(id, "d/dt exp(tX) = X exp(tX) for the rotation generator", [0, 1].every((i) => [0, 1].every((j) => near(dE[i][j], XE[i][j], 1e-6))));
    let series = [[0, 0], [0, 0]], power = [[1, 0], [0, 1]], fact = 1;
    for (let k = 0; k < 30; k += 1) {
      series = series.map((row, i) => row.map((v, j) => v + Math.pow(t0, k) / fact * power[i][j]));
      const next = [[0, 0], [0, 0]];
      for (let i = 0; i < 2; i += 1) for (let j = 0; j < 2; j += 1) for (let m = 0; m < 2; m += 1) next[i][j] += power[i][m] * X[m][j];
      power = next; fact *= k + 1;
    }
    assert(id, "series Σ tᵏXᵏ/k! equals the rotation matrix", [0, 1].every((i) => [0, 1].every((j) => near(series[i][j], E(t0)[i][j], 1e-10))));
  }

  /* III-3：∫₀^∞ cos(tx)/(1+x²) = (π/2)e^{−|t|} */
  {
    const id = "proof-todai-303";
    const t = 1;
    const I = simpson((x) => Math.cos(t * x) / (1 + x * x), 0, 400, 800000);
    assert(id, "∫₀^∞ cos x/(1+x²) ≈ (π/2)/e (tail < 1/400)", near(I, Math.PI / 2 * Math.exp(-1), 5e-3), `${I}`);
    const Fnum = simpson((x) => Math.sin(t * x) / (x * (1 + x * x)), 1e-9, 400, 800000);
    assert(id, "F(1) = ∫ sin x/(x(1+x²)) ≈ (π/2)(1 − 1/e)", near(Fnum, Math.PI / 2 * (1 - Math.exp(-1)), 5e-3), `${Fnum}`);
    const F = (s) => Math.PI / 2 * (1 - Math.exp(-s));
    assert(id, "F″ = F − π/2 for F = (π/2)(1 − e^{−t})", near(deriv2(F, 1.3), F(1.3) - Math.PI / 2, 1e-5));
  }

  /* III-5、III-6、III-8 */
  {
    const I5 = simpson((x) => (x <= 0 ? 0 : (x * x - 1) / Math.log(x)), 1e-12, 1 - 1e-9, 400000);
    assert("proof-todai-305", "∫₀¹ (x² − 1)/log x = log 3", near(I5, Math.log(3), 1e-4), `${I5}`);
    const I6 = simpson((x) => (x <= 0 ? 0 : (1 - x) / ((1 + x) * Math.log(x))), 1e-12, 1 - 1e-9, 400000);
    assert("proof-todai-306", "∫₀¹ (1−x)/((1+x)log x) = log(2/π)", near(I6, Math.log(2 / Math.PI), 1e-4), `${I6}`);
    let wallis = 1;
    for (let m = 1; m <= 200000; m += 1) wallis *= (2 * m - 1) * (2 * m + 1) / (4 * m * m);
    assert("proof-todai-306", "Wallis product → 2/π", near(wallis, 2 / Math.PI, 1e-5), `${wallis}`);
    const a = 2, b = 1;
    const I8 = simpson((x) => Math.log(a + b * Math.cos(x)), 0, Math.PI, 20000);
    assert("proof-todai-308", "∫₀^π log(2 + cos x) = π log((2+√3)/2)", near(I8, Math.PI * Math.log((a + Math.sqrt(a * a - b * b)) / 2), 1e-8), `${I8}`);
    const J = simpson((x) => 1 / (a + b * Math.cos(x)), 0, Math.PI, 20000);
    assert("proof-todai-308", "∫₀^π dx/(a + b cos x) = π/√(a²−b²)", near(J, Math.PI / Math.sqrt(a * a - b * b), 1e-8));
  }

  /* III-10、III-11：Frullani，f = e^{−x}，∫(e^{−2x} − e^{−x})/x = log(1/2) */
  {
    const I = simpson((x) => (Math.exp(-2 * x) - Math.exp(-x)) / x, 1e-9, 60, 400000);
    assert("proof-todai-310", "Frullani with f = e^{−x}: log(a/b) = log(1/2)", near(I, Math.log(0.5), 1e-4), `${I}`);
    assert("proof-todai-311", "(2) ∫(e^{−bx} − e^{−ax})/x = log(a/b)", near(I, Math.log(1 / 2), 1e-4));
    const damped = (a, b) => simpson((x) => (Math.cos(b * x) - Math.cos(a * x)) / x * Math.exp(-0.002 * x), 1e-9, 4000, 4000000);
    assert("proof-todai-311", "(1) ∫(cos bx − cos ax)/x = log(a/b) (Abel-damped, a=3, b=2)", near(damped(3, 2), Math.log(3 / 2), 5e-3), `${damped(3, 2)}`);
  }

  /* III-12：等周：橢圓嚴格、圓相等 */
  {
    const id = "proof-todai-312";
    const a = 2, b = 1;
    const L = simpson((t) => Math.sqrt(a * a * Math.sin(t) ** 2 + b * b * Math.cos(t) ** 2), 0, 2 * Math.PI, 20000);
    const F = Math.PI * a * b;
    assert(id, "ellipse 2×1: L² > 4πF", L * L > 4 * Math.PI * F, `${L * L} vs ${4 * Math.PI * F}`);
    assert(id, "circle: L² = 4πF", near((2 * Math.PI * 3) ** 2, 4 * Math.PI * (Math.PI * 9), 1e-12));
    assert(id, "termwise n|a||b| ≤ n²(|a|²+|b|²)/2", [[2, 0.3, 0.7], [3, 1, 1]].every(([n, x, y]) => n * x * y <= n * n * (x * x + y * y) / 2));
  }

  /* III-13：Legendre */
  {
    const id = "proof-todai-313";
    const P2 = (x) => (3 * x * x - 1) / 2, P3 = (x) => (5 * x * x * x - 3 * x) / 2;
    assert(id, "∫P_2P_3 = 0", Math.abs(simpson((x) => P2(x) * P3(x), -1, 1, 2000)) < 1e-12);
    assert(id, "∫P_2² = 2/5, ∫P_3² = 2/7", near(simpson((x) => P2(x) ** 2, -1, 1, 2000), 2 / 5, 1e-10) && near(simpson((x) => P3(x) ** 2, -1, 1, 2000), 2 / 7, 1e-10));
    assert(id, "P_n(1) = 1", P2(1) === 1 && P3(1) === 1);
    assert(id, "∫(1−x²)³ = 2⁷(3!)²/7!", near(simpson((x) => (1 - x * x) ** 3, -1, 1, 2000), 128 * 36 / 5040, 1e-10));
  }

  /* III-21：Σ (2n−1)!!/(2n)!! /n = 2 log 2 */
  {
    const id = "proof-todai-321";
    let ratio = 1, sum = 0;
    const N = 3000000;
    for (let n = 1; n <= N; n += 1) { ratio *= (2 * n - 1) / (2 * n); sum += ratio / n; }
    const tail = 2 / Math.sqrt(Math.PI * N);   // 尾巴 ~ Σ 1/(√(πn)·n)
    assert(id, "partial sum + tail estimate ≈ 2 log 2", near(sum + tail, 2 * Math.log(2), 2e-3), `${sum + tail}`);
    assert(id, "∫₀^{π/2} log cos = −(π/2) log 2", near(simpson((x) => Math.log(Math.cos(x)), 0, Math.PI / 2 - 1e-9, 400000), -Math.PI / 2 * Math.log(2), 1e-4));
    assert(id, "(2n−1)!!/(2n)!! = (2/π)∫ sin^{2n} (n = 3)", near(2 / Math.PI * simpson((x) => Math.sin(x) ** 6, 0, Math.PI / 2, 2000), 15 / 48, 1e-10));
  }

  /* III-22：Legendre 關係式 */
  {
    const id = "proof-todai-322";
    const K = (k) => simpson((t) => 1 / Math.sqrt(1 - k * k * Math.sin(t) ** 2), 0, Math.PI / 2, 20000);
    const E = (k) => simpson((t) => Math.sqrt(1 - k * k * Math.sin(t) ** 2), 0, Math.PI / 2, 20000);
    const k = 0.6, kp = Math.sqrt(1 - k * k);
    const G = E(k) * K(kp) + E(kp) * K(k) - K(k) * K(kp);
    assert(id, "EK′ + E′K − KK′ = π/2 (k = 0.6)", near(G, Math.PI / 2, 1e-8), `${G}`);
    assert(id, "dE/dk = (E − K)/k", near(deriv(E, k), (E(k) - K(k)) / k, 1e-5));
    assert(id, "dK/dk = (E − k′²K)/(k k′²)", near(deriv(K, k), (E(k) - kp * kp * K(k)) / (k * kp * kp), 1e-5));
  }

  /* IV-10：一維波動方程能量守恆 */
  {
    const id = "proof-todai-410";
    const c = 1.5;
    const bump = (s) => (Math.abs(s) < 1 ? Math.exp(-1 / (1 - s * s)) : 0);
    const u = (t, x) => bump(x - c * t) + 0.5 * bump(x + c * t);
    const energy = (t) => simpson((x) => deriv((s) => u(t, s), x) ** 2 + deriv((s) => u(s, x), t) ** 2 / (c * c), -6, 6, 6000) / 2;
    assert(id, "E(0) = E(0.8) for a d'Alembert solution", near(energy(0), energy(0.8), 1e-4), `${energy(0)} vs ${energy(0.8)}`);
  }

  /* IV-16：Apéry 路線上算得出的幾步 */
  {
    const id = "proof-todai-416";
    let zeta3 = 0;
    for (let n = 1; n <= 200000; n += 1) zeta3 += 1 / (n * n * n);
    zeta3 += 1 / (2 * 200000 * 200000);
    assert(id, "ζ(3) ≈ 1.2020569", near(zeta3, 1.2020569031595942, 1e-9), `${zeta3}`);
    // (4)：−∫∫ log(xy)/(1−xy) dxdy = 2ζ(3)（中點法則，被積函數在邊上可積但奇異）
    const m = 1200;
    let I0 = 0;
    for (let i = 0; i < m; i += 1) for (let j = 0; j < m; j += 1) {
      const x = (i + 0.5) / m, y = (j + 0.5) / m;
      I0 += -Math.log(x * y) / (1 - x * y);
    }
    I0 /= m * m;
    assert(id, "−∫∫ log(xy)/(1−xy) = 2ζ(3) (midpoint rule, 1%)", near(I0, 2 * zeta3, 1e-2), `${I0}`);
    // (10)：核 ≤ (√2−1)⁴
    const bound = Math.pow(Math.SQRT2 - 1, 4);
    let sup = 0;
    for (let i = 1; i < 200; i += 1) for (let j = 1; j < 200; j += 1) for (let k = 1; k < 200; k += 1) {
      const x = i / 200, y = j / 200, w = k / 200;
      sup = Math.max(sup, x * (1 - x) * y * (1 - y) * w * (1 - w) / (1 - (1 - x * y) * w));
    }
    assert(id, "kernel ≤ (√2−1)⁴ on [0,1]³ (grid sup)", sup <= bound + 1e-12, `${sup} vs ${bound}`);
    assert(id, "27(√2−1)⁴ < 4/5", 27 * bound < 0.8, `${27 * bound}`);
    // (3)：n=2,m=0 的有理值 Σ_{k=0}^{1} 1/((k+1)²·2) = 1/2 + 1/8 = 5/8，分母 8 | d_2³ = 8
    let I20 = 0;
    for (let i = 0; i < m; i += 1) for (let j = 0; j < m; j += 1) {
      const x = (i + 0.5) / m, y = (j + 0.5) / m;
      I20 += -Math.log(x * y) / (1 - x * y) * x * x;
    }
    I20 /= m * m;
    assert(id, "n=2, m=0 integral = 5/8 with denominator dividing d_2³", near(I20, 5 / 8, 1e-2), `${I20}`);
  }

  /* IV-17：對稱差體積比 → 0 */
  {
    const id = "proof-todai-417";
    const ratio = (R, d) => (6 * R * R * d + 2 * d * d * d) / (R * R * R);
    assert(id, "(6R²d + 2d³)/R³ → 0 (R = 1000, d = 1)", ratio(1000, 1) < 0.01 && ratio(1e6, 1) < 1e-5);
    // 球平均值性質的實例：u = x² − y²（調和），球心 (0.3, 0.2, 0) 半徑 1 的平均 = u(ξ)
    let avg = 0, count = 0;
    const N = 60;
    for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) for (let k = 0; k < N; k += 1) {
      const x = -1 + (i + 0.5) * 2 / N, y = -1 + (j + 0.5) * 2 / N, z = -1 + (k + 0.5) * 2 / N;
      if (x * x + y * y + z * z <= 1) { avg += (x + 0.3) ** 2 - (y + 0.2) ** 2; count += 1; }
    }
    assert(id, "mean value property for u = x² − y²", near(avg / count, 0.3 * 0.3 - 0.2 * 0.2, 2e-2), `${avg / count}`);
  }
}

/* ===== summary ===== */
const contest = proofs.filter((p) => p.tier === "contest" || p.tier === "todai");
console.log(`\nChecked ${checks} claims across ${contest.length} contest + 東大 proofs (+bank structure).`);
if (failures) {
  console.error(`${failures} claim checks FAILED.`);
  process.exit(1);
}
console.log("All proof claims verified.");
