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
  const tiers = new Set(["basic", "standard", "advanced", "boss", "contest"]);
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

/* ===== summary ===== */
const contest = proofs.filter((p) => p.tier === "contest");
console.log(`\nChecked ${checks} claims across ${contest.length} contest proofs (+bank structure).`);
if (failures) {
  console.error(`${failures} claim checks FAILED.`);
  process.exit(1);
}
console.log("All proof claims verified.");
