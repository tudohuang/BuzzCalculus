// 分節的黑板（beat.board；規格見 SCHEMA.md「黑板」）。data-lazy="board"：有黑板的課才抓。
// 寫上去、變形（同 id 的項搬過去）、前幾行的項飛過來、粉筆圈／底線／框／打叉／箭頭、畫曲線。
// 時間跟著旁白那一句的 [起,訖]（暫停就停）；沒開旁白照 PACE；reduced-motion 直接到位；下一句＝這一句畫完。
// 每一格只寫 transform／opacity／stroke-dashoffset；量位置只在動作開始時；rAF 只在動畫中跑。
(function () {
  "use strict";
  const CSS = `.cvb-slot{margin:0 0 12px}
.cvb{--k:#22302a;--kb:#eef3ec;--kl:#cfdccb;--kg:#8a5a00;--kr:#b02a20;--kc:#1b5c99;--kn:#16683f;position:relative;overflow:hidden;min-height:88px;padding:14px 10px 16px;border:1px solid var(--kl);border-radius:12px;background:var(--kb);color:var(--k);cursor:pointer;-webkit-tap-highlight-color:transparent}
:root[data-theme="dark"] .cvb{--k:#eef2e8;--kb:#1c3529;--kl:#2d4a3b;--kg:#f2d06b;--kr:#ff9f94;--kc:#a3d4f7;--kn:#a6e3b6;background:radial-gradient(130% 100% at 15% 0%,#22402f,var(--kb) 70%);box-shadow:inset 0 0 0 4px #15291f}
.cvb-ls{display:flex;flex-direction:column;gap:12px}
.cvb-l{position:relative;text-align:center;line-height:1.5}
.cvb-e{position:relative;display:inline-block;font-size:1.28rem;white-space:nowrap}
.cvb-o{position:absolute;left:0;right:0;top:0}
.cvb-lb{padding-bottom:20px}
.cvb-f{position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap}
.cvb .katex{font-size:1.14em}
.cvb [class*="cvb-t-"]{display:inline-block}
.cvb-ink,.cvb-a{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.cvb-a{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.cvb-a text{fill:currentColor;stroke:none;font-size:13px;font-weight:700}
.cvb .kg{color:var(--kg)}.cvb .kr{color:var(--kr)}.cvb .kc{color:var(--kc)}.cvb .kn{color:var(--kn)}
.cvb-p{--panel:var(--kb)}
:root[data-theme="dark"] .cvb-p{--line:#ffffff1f;--line-strong:#eef2e899;--muted:#c3cfc4;--ink:var(--k);--blue:var(--kc);--red:var(--kr);--green:var(--kn);--gold:var(--kg)}
.cvb-p .problem-graph{margin:0;padding:0;border:0;background:none;box-shadow:none}
.cvb-p svg{display:block;width:min(100%,300px);height:auto;margin:0 auto}
.cvb-tip{position:absolute;left:0;bottom:.15em;width:5px;height:5px;border-radius:50%;background:currentColor;opacity:0}
.cvb-sr{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cv2s-beat.cvb-bare{height:0;padding:0;border:0;margin-bottom:-10px;overflow:hidden}
@media(min-width:960px){.cvb-e{font-size:1.45rem}.cvb{padding:18px 16px 20px}}`;
  const NS = "http://www.w3.org/2000/svg";
  const PACE = 330; // 沒開旁白：每一份重量幾毫秒（寫一行 3 份 ≈ 1 秒）
  const CO = { gold: "kg", red: "kr", blue: "kc", green: "kn" };
  const WT = { write: 3, transform: 3, plot: 4, clear: 1, keep: 1 };
  const TAG = '[class*="cvb-t-"]';
  const cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const f2 = (v) => v.toFixed(2);
  const pt = (x, y) => `${f2(x)} ${f2(y)}`;
  const R = (n) => n.getBoundingClientRect();
  const box = (r, c) => [r.left - c.left, r.top - c.top, c.width ? r.width / c.width : 1, c.height ? r.height / c.height : 1];
  const reduced = () => Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const voice = () => { const s = window.BuzzCourseSections; return (s && s.voice && s.voice()) || {}; };

  // {{id:…}} → \htmlClass{cvb-t-id}{…}（可以巢狀）。驗證器用同一支。
  function tex(src) {
    let out = "";
    const st = [];
    for (let i = 0; i < src.length; i += 1) {
      const c = src[i];
      const m = c === "{" && /^\{\{([a-z][a-z0-9]{0,7}):/.exec(src.slice(i, i + 12));
      if (c === "\\") { out += c + (src[i + 1] || ""); i += 1; } else if (m) { out += `\\htmlClass{cvb-t-${m[1]}}{`; st.push(1); i += m[0].length - 1; } else if (c === "}" && st[st.length - 1] === 1 && src[i + 1] === "}") { out += c; st.pop(); i += 1; } else { if (c === "{") st.push(0); if (c === "}") st.pop(); out += c; }
    }
    return out;
  }
  const KOPT = { throwOnError: false, output: "html", strict: "ignore", trust: (x) => x.command === "\\htmlClass" && /^cvb-t-[a-z][a-z0-9]*$/.test(x.class) };
  // 一行：$…$ 是數學；其他是字，一個字一個 span（才能一個一個寫出來）
  const html = (line) => String(line).split(/(?<!\\)\$/).map((p, i) => (i % 2
    ? window.katex.renderToString(`\\displaystyle ${tex(p)}`, KOPT)
    : [...p].map((ch) => (ch.trim() ? `<span class="cvb-c">${esc(ch)}</span>` : " ")).join(""))).join("");
  // 時間表：沒寫 at 的動作照重量分掉前後兩個 at（或 0、1）之間
  function plan(list) {
    const s = list.map((a) => (typeof a.at === "number" ? a.at : null));
    if (s[0] === null) s[0] = 0;
    for (let i = 0, j; i < s.length; i = j) {
      for (j = i + 1; j < s.length && s[j] === null;) j += 1;
      const w = list.slice(i, j).map((a) => WT[a.do] || 2);
      const span = (j < s.length ? s[j] : 1) - s[i];
      const sum = w.reduce((x, y) => x + y, 0);
      for (let k = i + 1; k < j; k += 1) s[k] = s[k - 1] + (span * w[k - i - 1]) / sum;
    }
    return list.map((a, i) => ({ a, s: s[i], e: i + 1 < s.length ? s[i + 1] : 1, w: WT[a.do] || 2 }));
  }

  let B = null; // 這一節的黑板 { key, state, sec, el, ls, ink, at, n, run, w }
  let raf = 0;
  let timer = 0;
  const mk = (tag, cls, h) => { const n = document.createElement(tag); n.className = cls; if (h) n.innerHTML = h; return n; };
  const eqOf = (a) => mk("span", `cvb-e ${CO[a.color] || ""}`, html(a.line));
  function fit(c, e) { // 太寬就縮字
    const room = c.clientWidth - 4;
    const w = R(e).width;
    if (w > room && room > 0) e.style.fontSize = `${(parseFloat(getComputedStyle(e).fontSize) * room) / w}px`;
  }
  const find = (id) => [...B.el.querySelectorAll(`.cvb-t-${id}`)].pop();
  const idOf = (n) => (/cvb-t-([a-z0-9]+)/.exec(n.getAttribute("class")) || [])[1];
  const strip = (g) => { [g, ...g.querySelectorAll(TAG)].forEach((x) => { x.className = x.className.replace(/\bcvb-t-\S+/g, ""); }); return g; };
  const lastEq = () => [...B.ls.children].reverse().find((l) => !l.classList.contains("cvb-p"));
  function svg(cls, inner) {
    const n = document.createElementNS(NS, "svg");
    n.setAttribute("class", `cvb-a ${cls}`);
    n.innerHTML = inner;
    n.querySelectorAll("path").forEach((p) => { p.setAttribute("pathLength", "1"); p.style.strokeDasharray = "1 2"; p.style.strokeDashoffset = "1"; });
    return n;
  }
  const draw = (p, q) => { p.style.strokeDashoffset = 1 - q; };
  const fade = (t, q) => { if (t) t.style.opacity = cl((q - 0.6) / 0.4); };

  // 寫：KaTeX 最底層有墨水的 span（字、分數線、根號）與字的 span，照 x 位置一個一個出來；粉筆頭跟著走
  function prep(e, skip) {
    const ls = [...e.querySelectorAll(".katex-html span,.cvb-c")].filter((n) => !skip(n) && (n.classList.contains("cvb-c")
      || (!n.firstElementChild && /[^\s​]/.test(n.textContent)) || /frac-line|overline-line|underline-line|hline|rule/.test(n.className)
      || (n.firstElementChild && n.firstElementChild.tagName.toLowerCase() === "svg")));
    const r0 = R(e);
    const s = { ls, xs: ls.map((n) => { const r = R(n); return cl((r.left + r.width / 2 - r0.left) / (r0.width || 1)); }), v: ls.map(() => 0), tip: mk("i", "cvb-tip"), w: r0.width };
    ls.forEach((n) => { n.style.opacity = 0; });
    e.appendChild(s.tip);
    return s;
  }
  function write(s, q) {
    s.ls.forEach((n, i) => {
      const v = cl((q * 1.2 - s.xs[i]) / 0.2);
      if (v !== s.v[i] && (Math.abs(v - s.v[i]) > 0.04 || v % 1 === 0)) { s.v[i] = v; n.style.opacity = v; }
    });
    s.tip.style.transform = `translateX(${f2(Math.min(1, q * 1.2) * s.w)}px)`;
    s.tip.style.opacity = q > 0 && q < 0.84 ? 0.75 : 0;
  }
  const unwrite = (s) => { s.ls.forEach((n) => { n.style.opacity = ""; }); s.tip.remove(); };
  // 新的一行裡、前面幾行已經有的項：複製一份從那裡飛過來（TransformFromCopy）
  function flights(e, skip) {
    const fly = [];
    e.querySelectorAll(TAG).forEach((n) => {
      if (skip(n) || fly.some((f) => f.n.contains(n))) return;
      const src = [...B.ls.querySelectorAll(`.cvb-t-${idOf(n)}`)].filter((x) => !x.closest(".cvb-l").contains(e)).pop();
      if (!src) return;
      const el = mk("span", "katex cvb-f");
      el.appendChild(strip(src.cloneNode(true)));
      B.el.appendChild(el);
      fly.push({ n, el, src });
    });
    fly.forEach((f) => { const c = R(f.el); f.a = box(R(f.src), c); f.z = box(R(f.n), c); });
    fly.forEach((f) => { f.n.style.opacity = 0; });
    return fly;
  }
  const inside = (mv, x) => mv.some((f) => (f.n || f.el).contains(x));
  function move(mv, q) {
    const m = ease(cl(q / 0.75));
    mv.forEach((f) => { const v = f.a.map((a, i) => a + (f.z[i] - a) * m); f.el.style.transform = `translate(${f2(v[0])}px,${f2(v[1])}px) scale(${v[2].toFixed(4)},${v[3].toFixed(4)})`; });
  }
  const land = (mv) => mv.forEach((f) => { if (f.n) { f.el.remove(); f.n.style.opacity = ""; } else f.el.style.transform = ""; });
  // 手畫的形狀（W×H、外擴 m）
  function shape(type, W, H, m) {
    if (type === "circle") {
      let d = "";
      for (let i = 0; i <= 40; i += 1) {
        const a = -2.3 + (i / 40) * Math.PI * 2.16;
        const k = 1 + 0.07 * (i / 40 - 0.5);
        d += `${i ? "L" : "M"}${pt(W / 2 + (W / 2 + 2) * k * Math.cos(a), H / 2 + (H / 2 + 1) * k * Math.sin(a))}`;
      }
      return d;
    }
    if (type === "underline") return `M${pt(m * 0.4, H - m * 0.3)}Q${pt(W / 2, H + m * 0.2)} ${pt(W - m * 0.3, H - m * 0.6)}`;
    if (type === "box") return `M${pt(m * 0.4, m * 0.7)}L${pt(W - m * 0.2, m * 0.4)}L${pt(W - m * 0.5, H - m * 0.3)}L${pt(m * 0.6, H - m * 0.6)}L${pt(m * 0.2, m * 0.1)}`;
    return `M${pt(m, H - m * 0.6)}L${pt(W - m, m * 0.6)}M${pt(m, m * 0.6)}L${pt(W - m, H - m * 0.6)}`; // strike：打叉
  }
  const mark = {
    begin(a) {
      const t = find(a.term);
      if (!t) return null;
      const e = t.closest(".cvb-e");
      const b = R(e);
      const r = R(t);
      const m = 5;
      const W = r.width + 2 * m;
      const H = r.height + 2 * m;
      const lab = a.label ? `<text x="${W / 2}" y="${f2(b.bottom - r.top + m + 17)}" text-anchor="middle">${esc(a.label)}</text>` : "";
      if (lab) e.parentNode.classList.add("cvb-lb");
      const n = svg(CO[a.color] || (a.do === "strike" ? "kr" : "kg"), `<path d="${shape(a.do, W, H, m)}"/>${lab}`);
      n.style.cssText = `left:${f2(r.left - b.left - m)}px;top:${f2(r.top - b.top - m)}px;width:${f2(W)}px;height:${f2(H)}px`;
      e.appendChild(n);
      return { p: n.querySelector("path"), t: n.querySelector("text") };
    },
    apply(s, q) { draw(s.p, ease(q)); fade(s.t, q); }
  };
  const H = {
    write: {
      begin(a, now) {
        const l = mk("div", "cvb-l");
        const e = eqOf(a);
        l.appendChild(e);
        B.ls.appendChild(l);
        fit(l, e);
        if (now) return null;
        const mv = flights(e, () => false);
        return { mv, w: prep(e, (x) => inside(mv, x)) };
      },
      apply(s, q) { write(s.w, q); move(s.mv, q); },
      end(s) { unwrite(s.w); land(s.mv); }
    },
    // 變形：新的一行疊在舊的上面；同 id 的項是同一個元素搬過去（FLIP），舊的淡出、其他寫上
    transform: {
      begin(a, now) {
        const l = lastEq();
        const e2 = eqOf(a);
        const ink = [...B.ink.childNodes];
        if (!l) return null;
        l.classList.remove("cvb-lb");
        if (now) { ink.forEach((n) => n.remove()); l.replaceChildren(e2); fit(l, e2); return null; }
        const e1 = l.firstChild;
        const o = mk("div", "cvb-o");
        o.appendChild(e2);
        l.appendChild(o);
        fit(o, e2);
        const mv = [];
        e2.querySelectorAll(TAG).forEach((n0) => {
          const el = e1.querySelector(`.cvb-t-${idOf(n0)}`);
          if (el && !mv.some((p) => p.n0.contains(n0) || p.el.contains(el) || el.contains(p.el))) mv.push({ n0, el, f: R(el) });
        });
        mv.forEach((p) => { const g = strip(p.el.cloneNode(true)); g.style.visibility = "hidden"; p.el.replaceWith(g); p.n0.replaceWith(p.el); });
        mv.forEach((p) => { p.a = box(p.f, R(p.el)); p.z = [0, 0, 1, 1]; p.el.style.transformOrigin = "0 0"; });
        const all = mv.concat(flights(e2, (n) => mv.some((p) => p.el.contains(n) || n.contains(p.el))));
        l.style.minHeight = `${Math.max(l.offsetHeight, o.offsetHeight)}px`;
        return { l, e1, e2, mv: all, w: prep(e2, (x) => inside(all, x)), ink };
      },
      apply(s, q) {
        const f = 1 - cl(q / 0.4);
        s.e1.style.opacity = f;
        s.ink.forEach((n) => { n.style.opacity = f; });
        move(s.mv, q);
        write(s.w, cl((q - 0.4) / 0.6));
      },
      end(s) { land(s.mv); unwrite(s.w); s.ink.forEach((n) => n.remove()); s.l.replaceChildren(s.e2); s.l.style.minHeight = ""; }
    },
    circle: mark,
    underline: mark,
    box: mark,
    strike: mark,
    arrow: {
      begin(a) {
        const A = find(a.from);
        const Z = find(a.to);
        if (!A || !Z) return null;
        const b = R(B.el);
        const [p, z] = [R(A), R(Z)].map((r) => ({ x: r.left + r.width / 2 - b.left, t: r.top - b.top, b: r.bottom - b.top }));
        let y1; let y2; let cy;
        if (z.t > p.b - 2) { y1 = p.b + 3; y2 = z.t - 3; cy = (y1 + y2) / 2; } else if (p.t > z.b - 2) { y1 = p.t - 3; y2 = z.b + 3; cy = (y1 + y2) / 2; } else if (p.t > 34) { y1 = p.t - 3; y2 = z.t - 3; cy = Math.min(y1, y2) - 24; } else { y1 = p.b + 3; y2 = z.b + 3; cy = Math.max(y1, y2) + 24; }
        const cx = (p.x + z.x) / 2 + (Math.abs(z.x - p.x) < 8 ? 14 : 0);
        const an = Math.atan2(y2 - cy, z.x - cx);
        const h = (s) => pt(z.x - 9 * Math.cos(an + s), y2 - 9 * Math.sin(an + s));
        const n = svg(CO[a.color] || "kc", `<path d="M${pt(p.x, y1)}Q${pt(cx, cy)} ${pt(z.x, y2)}"/><path d="M${h(0.5)}L${pt(z.x, y2)}L${h(-0.5)}"/>${a.label ? `<text x="${f2(cx)}" y="${f2(cy + (cy < y1 ? -4 : 14))}" text-anchor="middle">${esc(a.label)}</text>` : ""}`);
        B.ink.appendChild(n);
        return { p: n.querySelectorAll("path"), t: n.querySelector("text") };
      },
      apply(s, q) { draw(s.p[0], ease(cl(q / 0.8))); draw(s.p[1], cl((q - 0.78) / 0.22)); fade(s.t, q); }
    },
    // 畫曲線（同一支 renderProblemGraph）：格線先出、曲線一筆畫、塗色與點最後
    plot: {
      begin(a, now) {
        const l = mk("div", "cvb-l cvb-p", window.BuzzGraphRender.renderProblemGraph({ graph: a.graph }, { label: " " }, esc));
        B.ls.appendChild(l);
        const g = l.querySelector("svg");
        if (now || !g) return null;
        const cv = [...g.querySelectorAll('path[fill="none"]:not([stroke-dasharray])')];
        const lens = cv.map((p) => p.getTotalLength());
        cv.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i] + 1}`; p.style.strokeDashoffset = lens[i]; });
        const rest = [...g.children].filter((n) => !cv.includes(n));
        rest.forEach((n) => { n.style.opacity = 0; });
        const early = rest.filter((n) => n.tagName.toLowerCase() === "line" || n.getAttribute("font-size") === "9");
        return { cv, lens, early, late: rest.filter((n) => !early.includes(n)) };
      },
      apply(s, q) {
        s.early.forEach((n) => { n.style.opacity = cl(q / 0.2); });
        const m = ease(cl((q - 0.12) / 0.66));
        s.cv.forEach((p, i) => { p.style.strokeDashoffset = s.lens[i] * (1 - m); });
        s.late.forEach((n) => { n.style.opacity = cl((q - 0.75) / 0.25); });
      },
      end(s) { s.cv.forEach((p) => { p.style.strokeDasharray = p.style.strokeDashoffset = ""; }); s.early.concat(s.late).forEach((n) => { n.style.opacity = ""; }); }
    },
    // 擦掉：clear 全部；keep 留最後 n 行。板上的箭頭一起擦
    clear: {
      begin(a) {
        const ls = [...B.ls.children];
        return { gone: ls.slice(0, Math.max(0, ls.length - (a.do === "keep" ? Number(a.n) || 0 : 0))).concat([...B.ink.childNodes]) };
      },
      apply(s, q) { s.gone.forEach((n) => { n.style.opacity = 1 - q; }); },
      end(s) { s.gone.forEach((n) => n.remove()); }
    }
  };
  H.keep = H.clear;

  function instant(list) {
    list.forEach((a) => {
      const h = H[a.do];
      const s = h && h.begin(a, true);
      if (s) { h.apply(s, 1); if (h.end) h.end(s); }
    });
  }
  // 這一句直接畫完（下一句、換節、離開）
  function finish() {
    const r = B && B.run;
    window.cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    raf = timer = 0;
    if (!r) return;
    B.run = null;
    r.acts.forEach((x) => {
      const h = H[x.a.do];
      if (x.done) return;
      if (x.s0 === undefined) instant([x.a]);
      else if (x.s0) { h.apply(x.s0, 1); if (h.end) h.end(x.s0); }
    });
  }
  function step(r) {
    for (const x of r.acts) {
      if (x.done) continue;
      if (r.p < x.s && !(x.s === 0 && r.p === 0)) break;
      const h = H[x.a.do];
      if (x.s0 === undefined) x.s0 = h.begin(x.a, false) || 0;
      const q = x.e > x.s ? cl((r.p - x.s) / (x.e - x.s)) : 1;
      if (x.s0) h.apply(x.s0, q);
      if (q < 1) break;
      if (x.s0 && h.end) h.end(x.s0);
      x.done = true;
    }
  }
  function frame(now) {
    raf = 0;
    const r = B && B.run;
    if (!r) return;
    if (!B.el.isConnected) { finish(); return; }
    const v = voice();
    const dt = Math.min(50, Math.max(0, now - r.prev));
    r.prev = now;
    let hold = false;
    if (v.on && v.beat === r.vk && v.end > v.start) {
      // 跟著錄音：currentTime 沒更新的那幾格自己往前推；念到這一句的 90% 畫完；換念別段（問句 → say）從現在的進度接著走
      if (v.at !== r.va) { r.va = v.at; r.ms = v.at; } else if (!v.paused) r.ms += dt * (v.rate || 1);
      hold = v.paused;
      if (r.v0 !== v.start) { r.v0 = v.start; r.p0 = r.p; }
      r.p = Math.max(r.p, r.p0 + (1 - r.p0) * cl((r.ms - v.start) / ((v.end - v.start) * 0.9)));
    } else if (v.on && v.paused) hold = true;
    else { r.t += dt; r.p = cl(r.t / r.D); }
    step(r);
    if (r.p >= 1) finish();
    else if (hold) timer = window.setTimeout(() => { timer = 0; r.prev = performance.now(); raf = window.requestAnimationFrame(frame); }, 150);
    else raf = window.requestAnimationFrame(frame);
  }
  function play(list, vk) {
    const acts = plan(list);
    B.run = { acts, p: 0, t: 0, D: acts.reduce((n, x) => n + x.w, 0) * PACE, prev: performance.now(), vk, va: -1, ms: 0, v0: null, p0: 0 };
    step(B.run);
    raf = window.requestAnimationFrame(frame);
  }
  // 這一句現在畫得到第幾個動作：why: true 的是「為什麼」的答案，答了（或直接看）才畫
  function cut(sec, si, bi) {
    const b = B.sec.beats[bi];
    const k = (b.board || []).findIndex((a) => a.why);
    return k < 0 || !b.why || !window.BuzzCourseProof || (sec.why[`${si}-${bi}`] || {}).open ? (b.board || []).length : k;
  }
  function rebuild() {
    finish();
    B.ls.replaceChildren();
    B.ink.replaceChildren();
    for (let i = 0; i <= B.at; i += 1) instant((B.sec.beats[i].board || []).slice(0, i < B.at ? undefined : B.n));
    B.w = B.el.clientWidth;
  }

  // course_sections.js 每次畫完（整頁或只換句子）叫這一支：黑板是同一個元素，搬進新畫的位置
  function sync(api, root) {
    const slot = root && root.querySelector("[data-cvb-slot]");
    const sec = api.state.sec;
    if (!slot || !sec) { finish(); B = null; return; }
    if (!document.getElementById("cvb-style")) { const st = mk("style", ""); st.id = "cvb-style"; st.textContent = CSS; document.head.appendChild(st); }
    const S = api.data.sections[sec.si];
    const at = Math.min(S.beats.length, sec.shown[sec.si] || 1) - 1;
    const key = `${api.m.id}:${sec.si}`;
    const vk = `${sec.si}-${at}`;
    if (!B || B.key !== key || B.state !== api.state) {
      finish();
      const el = mk("div", "cvb", `<div class="cvb-ls"></div><div class="cvb-ink"></div>`);
      el.setAttribute("aria-hidden", "true");
      B = { key, state: api.state, el, ls: el.firstChild, ink: el.lastChild, at: -1, n: 0, run: null, w: 0 };
    }
    B.sec = S;
    if (B.el.parentNode !== slot) slot.appendChild(B.el);
    const list = S.beats[at].board || [];
    const n = cut(sec, sec.si, at);
    if (B.at > at) { B.at = -1; rebuild(); }
    if (B.at === at) {
      // 同一句：「為什麼」剛答完 → 接著畫答案那幾個動作
      if (n > B.n) { finish(); const from = B.n; B.n = n; if (reduced()) instant(list.slice(from, n)); else play(list.slice(from, n), vk); }
      return;
    }
    finish();
    if (B.at >= 0) instant((S.beats[B.at].board || []).slice(B.n));
    while (B.at < at - 1) { B.at += 1; instant(S.beats[B.at].board || []); }
    B.at = at;
    B.n = n;
    B.w = B.el.clientWidth;
    if (sec.fresh !== at || reduced()) instant(list.slice(0, n));
    else if (n) play(list.slice(0, n), vk);
  }
  if (typeof window !== "undefined" && window.addEventListener) {
    let rt = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => { if (B && B.el.isConnected && B.el.clientWidth !== B.w) rebuild(); }, 200);
    });
  }
  // state()：給 E2E 看黑板畫到哪（第幾句、第幾個動作、動畫中、進度）
  window.BuzzBoard = { sync, tex, plan, KOPT, state: () => (B ? { key: B.key, at: B.at, n: B.n, running: Boolean(B.run), p: B.run ? B.run.p : 1 } : null) };
})();
