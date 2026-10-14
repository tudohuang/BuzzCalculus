// 分節的黑板 v2（beat.board；規格見 SCHEMA.md「黑板」，樣式見 docs/board-style.md）。data-lazy="board"：有黑板的課才抓。
// 一節整個先排好（course_board_layout.js：每一步之後每一項在哪、標籤放哪、箭頭怎麼彎、板多高），畫面只是把「時間 → 第幾步、進度多少」畫出來：
//   旁白開著：時間 = <audio>.currentTime（暫停、1.25×／1.5×、拖、卡住都自動對）；動作的起點是 say 裡某個詞被念到的那一刻（on）。
//   沒旁白：同一張時間表跑在虛擬時間上（照 say 的字數）；下一句 = 這一句畫完；reduced-motion 直接到位。
// 每一格只寫 transform／opacity／mask／stroke-dashoffset；量位置只在排版（換節、換寬度、字型載完）時。
(function () {
  "use strict";
  const LY = window.BuzzBoardLayout;
  // 粉筆灰／紙的顆粒：一張很淡的灰色雜訊，兩個主題共用（不要更明顯：再多就變成髒）
  const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  const CSS = `.cvb-slot{margin:0 0 14px}
.cvb{--k:#1d2622;--kb:#f7f5ee;--kl:#e2ddd0;--kg:#875400;--kc:#1b5a96;--kn:#1a6a40;--kr:#b0262a;--kv:#69409c;position:relative;overflow:hidden;min-height:72px;border:1px solid var(--kl);border-radius:14px;background:${NOISE},linear-gradient(180deg,#fbfaf5,var(--kb));color:var(--k);cursor:pointer;-webkit-tap-highlight-color:transparent;contain:layout paint}
:root[data-theme="dark"] .cvb{--k:#eceee6;--kb:#17221e;--kl:#25342e;--kg:#f1cd6a;--kc:#93c8f2;--kn:#93d8ab;--kr:#ff9f92;--kv:#cfb0f7;background:${NOISE},radial-gradient(120% 90% at 30% 0%,#1d2b26,var(--kb) 75%);box-shadow:inset 0 1px 0 #ffffff0d}
.cvb-c{position:absolute;inset:0}
.cvb-i{position:absolute;left:0;top:0;display:inline-block;padding:8px;white-space:nowrap;line-height:1.3;transform-origin:0 0;will-change:transform,opacity}
.cvb-i.is-t{text-align:center}
.cvb-r{white-space:nowrap}.cvb-r+.cvb-r{margin-top:.3em}
.cvb-u{display:inline-block;white-space:nowrap}.cvb-u.is-rel{padding-left:.2778em}
.cvb .katex{font-size:1em;line-height:1.3}
.cvb-x,.cvb-s{white-space:pre;font-size:.95em;letter-spacing:.01em}.cvb-cm{margin-left:.25em;padding-right:.45em}
.cvb-lab{position:absolute;left:0;top:0;font-size:13.5px;font-weight:650;line-height:1.3;letter-spacing:.02em;white-space:nowrap;opacity:0}
.cvb-ink{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.cvb-ink path{fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round}
.cvb-f{position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap;line-height:1.3}
.cvb .kg{color:var(--kg)}.cvb .kr{color:var(--kr)}.cvb .kc{color:var(--kc)}.cvb .kn{color:var(--kn)}.cvb .kv{color:var(--kv)}
.cvb-p{--line:#1d26221a;--line-strong:#1d262280;--muted:#5b6560;--ink:var(--k);--blue:var(--kc);--red:var(--kr);--green:var(--kn);--gold:var(--kg);--violet:var(--kv)}
:root[data-theme="dark"] .cvb-p{--line:#ffffff1a;--line-strong:#eceee680;--muted:#b9c3bc}
.cvb-p .problem-graph{margin:0;padding:0;border:0;background:none;box-shadow:none;width:100%;height:100%}.cvb-p svg,.cvb .cvb-p .problem-graph svg{display:block;width:100%;height:100%;border:0;border-radius:0;background:none}
.cvb-sr{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cv2s-beat.cvb-bare{height:0;padding:0;border:0;margin-bottom:-10px;overflow:hidden}`;
  const NS = "http://www.w3.org/2000/svg";
  const MPC = 170; // 沒旁白：一個字幾毫秒（錄音平均約 208；看的人比念的快一點）
  const ENTRY = 320; // 下一句一開始，上一句的記號淡出要多久
  const CO = { gold: "kg", red: "kr", blue: "kc", green: "kn", violet: "kv" };
  const MARKS = { circle: "kg", underline: "kg", box: "kg", strike: "kr", arrow: "kc", focus: "kg" };
  const { cl, ease } = LY;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const R = (n) => n.getBoundingClientRect();
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
  // 字的頭尾空白放在 .cvb-x 外面：量墨水的框才不會把空白算進去（記號會以為貼著字）
  const sp = (x) => (x ? `<span class="cvb-s">${x}</span>` : "");
  // 「，」：正體字型（正黑、蘋方）把全形逗號擺在字格正中，夾在兩段式子之間像乘號「·」→ 換成貼基線的半形逗號，右邊補回全形的寬
  const cjk = (b) => b.split(/(，)/).filter(Boolean).map((x) => (x === "，" ? '<span class="cvb-x cvb-cm">,</span>' : `<span class="cvb-x">${esc(x)}</span>`)).join("");
  const tokHtml = (t) => (t.m ? window.katex.renderToString(`\\displaystyle ${tex(t.s)}`, KOPT) : t.s.replace(/^(\s*)([\s\S]*?)(\s*)$/, (_m, a, b, c) => `${sp(a)}${b ? cjk(b) : ""}${sp(c)}`));
  const mk = (tag, cls, h) => { const n = document.createElement(tag); n.className = cls; if (h) n.innerHTML = h; return n; };
  // 有墨水的最底層：KaTeX 的字、分數線、根號（svg），與一段中文
  const LEAF = ".katex-html span,.cvb-x";
  const isLeaf = (n) => n.classList.contains("cvb-x") || (!n.firstElementChild && /[^\s​]/.test(n.textContent)) || /frac-line|overline-line|underline-line|hline|rule/.test(n.className) || (n.firstElementChild && n.firstElementChild.tagName.toLowerCase() === "svg");
  const leavesOf = (root) => [...root.querySelectorAll(LEAF)].filter((n) => isLeaf(n) && !(n.parentElement && n.parentElement.closest(".cvb-x")));
  const rel = (r, o) => [r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top];
  // 一個小單位的「墨水」框：字用 canvas 的 measureText 量真正畫到的範圍（span 的框含字距與上下的留白，
  // 拿它算會以為兩個字貼在一起）；分數線、根號（svg）就是自己的框
  let cx2 = null;
  function inkOf(n) {
    const r = R(n);
    const t = n.firstElementChild ? "" : n.textContent;
    if (!t || !/\S/.test(t)) return r;
    if (!cx2) cx2 = document.createElement("canvas").getContext("2d");
    const cs = getComputedStyle(n);
    cx2.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cx2.measureText(t);
    if (!(m.actualBoundingBoxRight > 0) || !(m.fontBoundingBoxAscent > 0)) return r;
    const base = r.top + m.fontBoundingBoxAscent;
    return { left: r.left - m.actualBoundingBoxLeft, right: r.left + m.actualBoundingBoxRight, top: base - m.actualBoundingBoxAscent, bottom: base + m.actualBoundingBoxDescent };
  }
  const union = (bs) => (bs.length ? [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))] : null);
  const shift = (b, p) => [b[0] + p[0], b[1] + p[1], b[2] + p[0], b[3] + p[1]];

  let B = null; // 這一節的黑板
  let raf = 0;
  let poll = 0;

  /* ── 排版：建 DOM、量、排、放記號 ── */
  function build() {
    const S = B.sec;
    const W0 = B.el.clientWidth;
    if (!W0) return;
    B.w = W0;
    const needPlot = S.beats.some((b) => (b.board || []).some((a) => a.do === "plot"));
    if (needPlot && !window.BuzzBoardPlot) {
      if (!B.plotWait && B.api) { B.plotWait = true; Promise.resolve(B.api.deps.ensureLazy("boardplot")).then(() => { if (B && B.plotWait) { B.plotWait = false; build(); kick(); } }, () => { if (B) B.plotWait = false; }); }
      return;
    }
    const M = LY.compile(S.beats);
    const F = W0 < 420 ? 20 : W0 < 640 ? 21 : 24;
    B.F = F;
    const pad = W0 < 480 ? [16, 16] : [24, 20];
    const W = W0 - 2 * pad[0];
    const smin = 16 / (F * 0.95);
    const c = mk("div", "cvb-c");
    const ink = document.createElementNS(NS, "svg");
    ink.setAttribute("class", "cvb-ink");
    B.el.replaceChildren(c, ink);
    c.style.visibility = "hidden";
    // 1. 每一項：所有單位先排成一列量寬
    const V = M.items.map((it) => {
      const el = mk("div", `cvb-i ${CO[it.a.color] || ""}`);
      el.dataset.n = it.n;
      el.style.visibility = "hidden";
      el.style.fontSize = `${F}px`;
      c.appendChild(el);
      if (it.kind === "plot") {
        const g = window.BuzzBoardPlot.html(it.a.graph);
        const w = Math.min(W, 320);
        el.classList.add("cvb-p");
        el.innerHTML = g.svg;
        el.style.width = `${w}px`;
        el.style.height = `${(w * g.h) / g.w}px`;
        return { el, it, w, h: (w * g.h) / g.w, leaves: [[0, 0, w, (w * g.h) / g.w]], terms: {} };
      }
      const u = LY.units(it.a.line);
      const row = mk("div", "cvb-r");
      const us = u.units.map((x) => { const n = mk("span", `cvb-u${x.rel ? " is-rel" : ""}`, x.toks.map(tokHtml).join("")); row.appendChild(n); return n; });
      el.appendChild(row);
      Object.entries(it.tint).forEach(([id, col]) => el.querySelectorAll(`.cvb-t-${id}`).forEach((t) => t.classList.add(CO[col] || "kg")));
      if (u.align < 0 && u.units.some((x) => x.toks.some((t) => !t.m))) el.classList.add("is-t");
      return { el, it, u, us, row };
    });
    const labs = M.anns.map((an) => {
      if (!an.a.label) return null;
      const l = mk("span", `cvb-lab ${CO[an.a.color] || MARKS[an.a.do]}`);
      l.textContent = an.a.label;
      c.appendChild(l);
      return l;
    });
    // 2. 太寬：小縮、換行、再縮
    const ws = V.map((v) => (v.us ? v.us.map((n) => R(n).width) : null));
    V.forEach((v, i) => {
      if (!v.us) return;
      const k = LY.compose(ws[i], W, smin, v.u.align);
      v.s = k.s;
      v.wrapped = Boolean(k.wrapped);
      v.el.style.fontSize = `${F * k.s}px`;
      if (k.rows.length > 1) {
        v.row.remove();
        k.rows.forEach((idx, r) => { const rw = mk("div", "cvb-r"); idx.forEach((j) => rw.appendChild(v.us[j])); if (k.ind[r]) rw.style.paddingLeft = `${k.ind[r] * k.s}px`; v.el.appendChild(rw); });
      }
    });
    // 3. 量：每一項的大小、每一個有墨水的小塊、每一個項（相對於那一項的左上角）
    V.forEach((v) => {
      if (!v.us) return;
      // 量的是內容（不含四邊 8px 的留白：那是給遮罩的，KaTeX 的字可能畫出框外一點）
      const o0 = R(v.el);
      const o = { left: o0.left + 8, top: o0.top + 8 };
      v.w = o0.width - 16;
      v.h = o0.height - 16;
      const ls = leavesOf(v.el);
      v.leaves = ls.map((n) => rel(inkOf(n), o));
      v.rb = [...v.el.children].map((r) => rel(R(r), o));
      v.rows = [...v.el.children].map((r, k) => union(leavesOf(r).map((n) => rel(inkOf(n), o))) || v.rb[k]);
      v.terms = {};
      v.el.querySelectorAll('[class*="cvb-t-"]').forEach((t) => {
        const id = (/cvb-t-([a-z0-9]+)/.exec(t.getAttribute("class")) || [])[1];
        const mine = ls.map((n, j) => (t.contains(n) ? j : -1)).filter((j) => j >= 0);
        const box = union(mine.map((j) => v.leaves[j]));
        if (!box) return;
        const row = v.rows.findIndex((r) => box[1] >= r[1] - 1 && box[3] <= r[3] + 1);
        // 到最近的字（同一列、上下左右）的距離：記號不能壓到旁邊的字
        const gaps = [99, 99, 99, 99];
        v.leaves.forEach((b, j) => {
          if (mine.includes(j)) return;
          const vy = b[1] < box[3] && b[3] > box[1];
          const vx = b[0] < box[2] && b[2] > box[0];
          if (vy && b[2] <= box[0] + 0.5) gaps[0] = Math.min(gaps[0], box[0] - b[2]);
          if (vy && b[0] >= box[2] - 0.5) gaps[2] = Math.min(gaps[2], b[0] - box[2]);
          if (vx && b[3] <= box[1] + 0.5) gaps[1] = Math.min(gaps[1], box[1] - b[3]);
          if (vx && b[1] >= box[3] - 0.5) gaps[3] = Math.min(gaps[3], b[1] - box[3]);
        });
        // er：那一項自己的框（飛的複製對的是它：複製出來的結構一樣、框也一樣，墨水框在不同的上下文裡會差一點）
        v.terms[id] = { el: t, box, er: rel(R(t), o), row: row < 0 ? 0 : row, gaps, leaves: mine };
      });
      const al = v.u.align;
      v.alignable = al >= 0 && !v.wrapped;
      v.lhs = v.alignable ? R(v.us[al]).left - o.left + (v.us[al].classList.contains("is-rel") ? 0.2778 * F * v.s : 0) : 0;
    });
    const lsz = labs.map((l) => (l ? [R(l).width, R(l).height] : null));
    // 4. 排：位置 → 記號的壽命 → 標籤放不下就在那一行底下（或上面）讓出空間，再排一次
    const m = { W, pad, gap: Math.round(F * 0.75), items: V.map((v) => ({ w: v.w, h: v.h, lhs: v.lhs || 0, alignable: Boolean(v.alignable), gapA: 0, gapB: 0 })) };
    let st;
    let geo;
    for (let iter = 0; iter < 6; iter += 1) {
      st = LY.stack(M, m);
      LY.lifetimes(M, st.pos);
      geo = placeAll(M, V, st.pos, lsz, [6, 6, W0 - 6, Infinity], iter === 5);
      if (!geo.need || iter === 5) break;
      const [n, side, h] = geo.need;
      if (side === "B") m.items[n].gapB += h + 4; else m.items[n].gapA += h + 4;
    }
    const H = Math.ceil(Math.max(st.bottom, ...geo.anns.map((a) => (a ? a.bottom : 0))) + pad[1]);
    B.el.style.height = `${H}px`;
    ink.setAttribute("width", W0);
    ink.setAttribute("height", H);
    // 5. 記號、箭頭、標籤；變形與「飛過來」的複製
    const sv = geo.anns.map((ga, i) => {
      if (!ga) return null;
      const an = M.anns[i];
      const col = CO[an.a.color] || MARKS[an.a.do];
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", col);
      g.dataset.a = i;
      g.innerHTML = ga.d.map((d) => `<path d="${d}" pathLength="1" style="stroke-dasharray:1 2;stroke-dashoffset:1"/>`).join("");
      ink.appendChild(g);
      const l = labs[i];
      if (l) { if (ga.lab) { l.style.left = `${ga.lab[0]}px`; l.style.top = `${ga.lab[1]}px`; l.dataset.a = i; } else l.remove(); }
      const term = an.kind === "mark" ? V[an.refs[0][0]].terms[an.refs[0][1]] : null;
      return { g, paths: [...g.children], lab: ga.lab ? l : null, term: term && term.el, col };
    });
    const fly = flights(M, V, st.pos, c);
    // 給分節的捲動對位（course_sections.js 找 .cvb-l:last-child）：一個看不見的點，放在現在最下面那一行的頂
    B.lastEl = mk("div", "cvb-l");
    B.lastEl.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px";
    c.appendChild(B.lastEl);
    B.M = M;
    B.V = V;
    B.L = { pos: st.pos, sv, fly, H };
    B.sch = schedules(M);
    B.last = "";
    c.style.visibility = "";
    if (document.fonts && document.fonts.status === "loading" && !B.fontWait) {
      const b0 = B;
      B.fontWait = true;
      document.fonts.ready.then(() => { if (B === b0 && B.el.isConnected) { build(); kick(); } });
    }
  }

  // 每一個記號：先定所有的外框與箭頭的路線（箭頭繞開字），再放標籤 —— 標籤要避開在它活著時板上的每一個字、記號、箭頭、別的標籤
  function placeAll(M, V, pos, lsz, bounds, force) {
    const out = [];
    const live = (i, j) => M.anns[j].g <= M.anns[i].last && M.anns[i].g <= M.anns[j].last;
    const glyphs = (an, skip) => {
      const o = [];
      for (let g = an.g; g <= an.last; g += 1) Object.keys(pos[g]).forEach((n) => V[n].leaves.forEach((b, j) => { if (!skip || !skip.has(`${n}:${j}`)) o.push(shift(b, pos[g][n])); }));
      return o;
    };
    M.anns.forEach((an, i) => {
      const a = an.a;
      const T = an.refs.map(([n, id]) => { const t = V[n].terms[id]; return t ? { n, t, box: shift(t.box, pos[an.g][n]), row: shift(V[n].rows[t.row] || t.box, pos[an.g][n]) } : null; });
      if (T.some((x) => !x)) { out.push(null); return; }
      if (an.kind === "mark") {
        // focus：不畫線，只把那一項換成記號的顏色（貼得太緊、圈了會壓到旁邊的字時用）
        const r = a.do === "focus" ? T[0].box : LY.markBox(a.do, T[0].box, T[0].t.gaps, B.F * 0.8);
        out.push({ d: a.do === "focus" ? [] : [LY.markPath(a.do, r)], occ: a.do === "focus" ? [] : [r], anchor: r, row: [Math.min(T[0].row[0], r[0]), Math.min(T[0].row[1], r[1]), Math.max(T[0].row[2], r[2]), Math.max(T[0].row[3], r[3])] });
        return;
      }
      const own = new Set();
      T.forEach((x) => x.t.leaves.forEach((j) => own.add(`${x.n}:${j}`)));
      const o2 = glyphs(an, own);
      // 端點那一項已經圈著、框著：箭頭接在記號的外框上，那個記號不算障礙
      const ends = T.map((x) => x.box);
      out.forEach((o, j) => {
        if (!o || !live(i, j)) return;
        const k = M.anns[j].kind === "mark" ? T.findIndex((x) => M.anns[j].refs[0][0] === x.n && M.anns[j].refs[0][1] === an.refs[T.indexOf(x)][1]) : -1;
        if (k >= 0 && o.occ.length) ends[k] = [Math.min(ends[k][0], o.occ[0][0]), Math.min(ends[k][1], o.occ[0][1]), Math.max(ends[k][2], o.occ[0][2]), Math.max(ends[k][3], o.occ[0][3])];
        else o2.push(...o.occ);
      });
      const p = LY.routeArrow(ends[0], ends[1], o2, bounds).p;
      const [ex, ey] = p.slice(4);
      const k = Math.hypot(ex - p[2], ey - p[3]) || 1;
      const ux = (ex - p[2]) / k;
      const uy = (ey - p[3]) / k;
      const hx = (sg) => `${(ex - 8 * ux * Math.cos(sg) + 8 * uy * Math.sin(sg)).toFixed(1)} ${(ey - 8 * uy * Math.cos(sg) - 8 * ux * Math.sin(sg)).toFixed(1)}`;
      const mid = LY.qpt(p, 0.5);
      const anchor = [mid[0] - 2, mid[1] - 2, mid[0] + 2, mid[1] + 2];
      out.push({ p, d: [`M${p[0].toFixed(1)} ${p[1].toFixed(1)}Q${p[2].toFixed(1)} ${p[3].toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`, `M${hx(0.45)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${hx(-0.45)}`], occ: LY.curveBoxes(p), anchor, row: anchor });
    });
    for (let i = 0; i < M.anns.length; i += 1) {
      const an = M.anns[i];
      const o = out[i];
      if (!o) continue;
      if (an.a.label && lsz[i]) {
        const [w, h] = lsz[i];
        const ob = glyphs(an);
        out.forEach((x, j) => { if (x && live(i, j)) ob.push(...x.occ, ...(x.labOcc && j !== i ? [x.labOcc] : [])); });
        let lab = an.kind === "arrow" ? LY.placeArrowLabel(w, h, o.p, ob, bounds) : LY.placeLabel(w, h, o.anchor, o.row, "below", ob, bounds);
        // 放不下：在那一行底下（劃掉的是上面）讓出一條標籤的空間再排一次；最後一輪還是放不下就放在底下（lint 會擋）
        // 箭頭：彎到那一行上面就讓上面、下面就讓下面
        const up = an.kind === "arrow" ? LY.qpt(o.p, 0.5)[1] < o.p[1] : false;
        if (!lab && !force) return { anns: out, need: [an.refs[0][0], up ? "A" : "B", h] };
        if (!lab) lab = [o.anchor[0], o.row[3] + 4, o.anchor[0] + w, o.row[3] + 4 + h];
        o.lab = lab;
        // 別的標籤離它至少 6px（擠在一起讀起來像同一個詞）
        o.labOcc = [lab[0] - 4, lab[1] - 2, lab[2] + 4, lab[3] + 2];
      }
      o.bottom = Math.max(o.anchor[3], ...o.occ.map((b) => b[3]), o.lab ? o.lab[3] : 0);
    }
    return { anns: out, need: null };
  }

  // 寫上一行、或變形時：同一個 id 的項從原本的位置飛過來（外層的帶著裡面的一起飛）
  function flights(M, V, pos, c) {
    const out = {};
    M.items.forEach((it) => {
      if (!it.fly.length || it.kind !== "line") return;
      const v = V[it.n];
      const chosen = [];
      it.fly.map(([id, src]) => ({ id, src, t: v.terms[id], s: V[src].terms && V[src].terms[id] }))
        .filter((f) => f.t && f.s)
        .sort((a, b) => (a.t.el.compareDocumentPosition(b.t.el) & 4 ? -1 : 1))
        .forEach((f) => { if (!chosen.some((x) => x.t.el.contains(f.t.el) || f.t.el.contains(x.t.el))) chosen.push(f); });
      out[it.n] = chosen.map((f) => {
        const el = mk("span", "katex cvb-f");
        el.style.fontSize = v.el.style.fontSize;
        const cp = f.t.el.cloneNode(true);
        [cp, ...cp.querySelectorAll('[class*="cvb-t-"]')].forEach((x) => { x.className = x.className.replace(/\bcvb-t-\S+/g, ""); });
        el.appendChild(cp);
        el.style.opacity = "0";
        c.appendChild(el);
        const own = rel(R(cp), R(el));
        const g = it.born;
        const srcPos = pos[g - 1] && pos[g - 1][f.src];
        return { el, own, a: srcPos ? shift(f.s.er, srcPos) : null, z: shift(f.t.er, pos[g][it.n]), tEl: f.t.el, sEl: f.s.el, moved: it.from && f.src === it.from.n };
      }).filter((f) => f.a);
    });
    return out;
  }

  /* ── 時間表：每一句的每一段（問句 q、講解 s）在錄音裡（每一個聲音各一份：女聲 t／ms、男聲 tm／mm）與虛擬時間裡各一份 ── */
  const TK = { f: ["t", "ms"], m: ["tm", "mm"] };
  function schedules(M) {
    const S = B.sec;
    const audio = { f: {}, m: {} };
    const virt = {};
    S.beats.forEach((b, bi) => {
      const acts = M.acts.filter((x) => x.b === bi);
      ["q", "s"].forEach((clip) => {
        const list = acts.filter((x) => x.clip === clip);
        if (!list.length) return;
        const say = String((clip === "q" ? b.why && b.why.say : b.say) || "");
        const n = [...say].length || 20;
        const VT = n * MPC + 400;
        LY.schedule(list.map((x) => x.a), VT, (a) => (a.on ? Math.max(0, LY.charOf(a.on, say)) * MPC : typeof a.at === "number" ? a.at * VT : null)).forEach((s, k) => { virt[list[k].g] = s; });
        Object.keys(TK).forEach((v) => {
          const [tk, mk] = TK[v];
          const t = clip === "q" ? b.why && b.why[tk] : b[tk];
          if (!Array.isArray(t)) return;
          const T = t[1] - t[0];
          LY.schedule(list.map((x) => x.a), T, (a) => (typeof a[mk] === "number" ? a[mk] : a.on ? (Math.max(0, LY.charOf(a.on, say)) * T) / n : typeof a.at === "number" ? a.at * T : null)).forEach((s, k) => { audio[v][list[k].g] = s; });
        });
      });
    });
    return { audio, virt };
  }

  /* ── 畫：游標（第 g 個動作做到 q）→ 每一個元素的樣子 ── */
  const setS = (el, k, v) => { if (el.style[k] !== v) el.style[k] = v; };
  const tr = (p) => `translate(${(p[0] - 8).toFixed(2)}px,${(p[1] - 8).toFixed(2)}px)`; // 內容的左上角 → 元素（多 8px 留白）
  // 寫的遮罩：全部列的墨水寬度加起來當一條路，q 走到哪、露到哪；每一列一層 [圖, 大小, 位置]
  function wipe(v, q) {
    const E = 22;
    const len = v.rows.map((r) => r[2] - r[0]);
    const tot = len.reduce((a, b) => a + b, 0) + E * len.length;
    let x = q * tot;
    const im = [];
    const sz = [];
    const ps = [];
    v.rows.forEach((r, k) => {
      const top = k ? v.rb[k][1] + 8 : 0;
      const bot = k + 1 < v.rb.length ? v.rb[k + 1][1] + 8 : v.h + 16;
      const at = r[0] + 8 + x - E;
      x -= len[k] + E;
      im.push(`linear-gradient(90deg,#000 ${at.toFixed(1)}px,transparent ${(at + E).toFixed(1)}px)`);
      sz.push(`${Math.ceil(v.w + 16)}px ${Math.ceil(bot - top + 1)}px`);
      ps.push(`0 ${top.toFixed(1)}px`);
    });
    return [im.join(","), sz.join(","), ps.join(",")];
  }
  function paint(g, q, beat, entry) {
    const { M, V, L } = B;
    const A = M.acts[g];
    const prev = g ? M.states[g - 1] : [];
    const next = A ? M.states[g] : prev;
    const e = ease(q);
    const hideIn = new Set(); // 變形中、還沒落地的項
    const at = {}; // 每一項現在的位置（「錯」的記號跟著它搬）
    const flyNow = A && (A.a.do === "write" || A.a.do === "transform") ? L.fly[M.items.find((it) => it.born === g && it.kind === "line")?.n] || [] : [];
    Object.values(L.fly).forEach((fs) => fs.forEach((f) => setS(f.el, "opacity", "0")));
    M.items.forEach((it) => {
      const v = V[it.n];
      const el = v.el;
      const n = it.n;
      const inP = prev.includes(n);
      const inN = next.includes(n);
      let op = 1;
      let p;
      let mask = null;
      // 還沒開始寫的（游標停在它的起點）也藏起來：遮罩全蓋住，但量框的東西（lint、螢幕閱讀器以外的工具）看不到遮罩
      if ((!inP && !inN) || (inN && !inP && q <= 0 && it.a.do !== "transform")) { setS(el, "visibility", "hidden"); setS(el, "opacity", "0"); return; }
      if (inP && inN) {
        const a = L.pos[g - 1][n];
        const z = (A ? L.pos[g] : L.pos[g - 1])[n];
        p = [a[0] + (z[0] - a[0]) * e, a[1] + (z[1] - a[1]) * e];
      } else if (inN) {
        p = L.pos[g][n];
        if (it.a.do === "transform") op = ease(cl((q - 0.3) / 0.55));
        else if (it.a.do !== "plot") {
          // 寫：從左到右露出來（軟邊）；換行的一列寫完再寫下一列（每一列一層遮罩，各管自己那一條）
          mask = q >= 1 ? null : wipe(v, q);
        }
      } else {
        p = L.pos[g - 1][n];
        op = 1 - ease(cl(q / (A.a.do === "transform" ? 0.4 : 1)));
      }
      at[n] = p;
      setS(el, "visibility", "visible");
      setS(el, "transform", tr(p));
      setS(el, "opacity", op >= 1 ? "" : op.toFixed(3));
      if (it.kind === "line") {
        const m = mask || ["", "", ""];
        setS(el, "webkitMaskImage", m[0]); setS(el, "maskImage", m[0]);
        setS(el, "webkitMaskSize", m[1]); setS(el, "maskSize", m[1]);
        setS(el, "webkitMaskPosition", m[2]); setS(el, "maskPosition", m[2]);
        setS(el, "webkitMaskRepeat", m[0] ? "no-repeat" : ""); setS(el, "maskRepeat", m[0] ? "no-repeat" : "");
      } else if (window.BuzzBoardPlot) {
        const pp = inN && !inP ? q : 1;
        if (v.pp !== pp) { v.pp = pp; window.BuzzBoardPlot.apply(v, pp); }
      }
    });
    if (B.lastEl && next.length) {
      const P = L.pos[g < M.acts.length ? g : g - 1];
      const low = next.reduce((x, n) => (P[n][1] > P[x][1] ? n : x), next[0]);
      setS(B.lastEl, "top", `${P[low][1]}px`);
      setS(B.lastEl, "height", `${Math.max(1, V[low].h)}px`);
    }
    // 飛：從舊的位置（與大小）滑到新的位置；落地前新的那一份藏著，變形時舊的那一份一開始就交給複製
    Object.values(L.fly).forEach((fs) => fs.forEach((f) => { setS(f.tEl, "opacity", ""); if (f.moved) setS(f.sEl, "opacity", ""); }));
    flyNow.forEach((f) => {
      const land = A.a.do === "transform" ? 0.85 : 0.8;
      const m = ease(cl(q / land));
      if (q > 0 && q < land) {
        const box = f.a.map((a, i) => a + (f.z[i] - a) * m);
        // 橫著搬（同一行裡換位置）走一道往上的弧，不從別的字身上壓過去（Manim 的 path_arc）
        const dx = f.z[0] - f.a[0];
        const lift = Math.abs(dx) > Math.abs(f.z[1] - f.a[1]) ? Math.min(22, Math.abs(dx) * 0.3, Math.max(0, Math.min(f.a[1], f.z[1]) - 4)) * Math.sin(Math.PI * m) : 0;
        box[1] -= lift;
        box[3] -= lift;
        const sx = (box[2] - box[0]) / (f.own[2] - f.own[0] || 1);
        const sy = (box[3] - box[1]) / (f.own[3] - f.own[1] || 1);
        setS(f.el, "transform", `translate(${(box[0] - f.own[0] * sx).toFixed(2)}px,${(box[1] - f.own[1] * sy).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`);
        setS(f.el, "opacity", "1");
      }
      if (q < land) { setS(f.tEl, "opacity", "0"); hideIn.add(f.tEl); }
      if (f.moved && q > 0) setS(f.sEl, "opacity", "0");
    });
    // 記號：畫上去（ease）、標籤後到；壽命到了淡出；被標的項跟著變色
    M.anns.forEach((an, i) => {
      const s = L.sv[i];
      if (!s) return;
      const pr = an.g < g ? 1 : an.g === g ? q : 0;
      // 兩種收法取先到的：下一句開始（淡出）、它掛的那一行動了（跟著那個動作淡出）
      let alive = 1;
      if (an.dieG <= g) alive = an.dieG === g ? 1 - cl(q / 0.35) : 0;
      if (beat >= an.dieBeat) alive = Math.min(alive, beat === an.dieBeat ? 1 - ease(entry) : 0);
      if (pr <= 0 || alive <= 0) { setS(s.g, "opacity", "0"); if (s.lab) setS(s.lab, "opacity", "0"); if (s.term) setS(s.term, "color", ""); return; }
      setS(s.g, "opacity", alive >= 1 ? "" : alive.toFixed(3));
      const n0 = an.refs[0][0];
      const o0 = L.pos[an.g][n0];
      const dx = an.wrong && at[n0] ? at[n0][0] - o0[0] : 0;
      const dy = an.wrong && at[n0] ? at[n0][1] - o0[1] : 0;
      setS(s.g, "transform", dx || dy ? `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)` : "");
      if (an.kind === "mark") { if (s.paths[0]) s.paths[0].style.strokeDashoffset = (1 - ease(cl(pr / 0.8))).toFixed(4); } else { s.paths[0].style.strokeDashoffset = (1 - ease(cl(pr / 0.75))).toFixed(4); s.paths[1].style.strokeDashoffset = (1 - cl((pr - 0.72) / 0.2)).toFixed(4); }
      if (s.lab) {
        const lo = cl((pr - 0.5) / 0.4) * alive;
        setS(s.lab, "opacity", lo.toFixed(3));
        setS(s.lab, "transform", `translate(${dx.toFixed(2)}px,${(dy + (1 - cl((pr - 0.5) / 0.4)) * 4).toFixed(2)}px)`);
      }
      if (s.term && !hideIn.has(s.term)) {
        const k = Math.round(cl(pr / 0.4) * alive * 20) * 5;
        setS(s.term, "color", k ? `color-mix(in srgb,var(--${s.col}) ${k}%,currentColor)` : "");
      }
    });
  }
  // 「第幾個動作做到多少」：照這一句的時間（錄音或虛擬）算
  function cursor(now) {
    const S = B.sec;
    const bi = B.at;
    const b = S.beats[bi] || {};
    const acts = B.M.acts;
    let g0 = acts.findIndex((x) => x.b >= bi);
    if (g0 < 0) g0 = acts.length;
    const mine = acts.filter((x) => x.b === bi);
    const open = !b.why || B.open;
    if (B.frozen) return B.frozen;
    const end = { g: g0 + mine.length, q: 0, entry: 1, mode: "done" };
    if (reduced()) return end;
    const v = voice();
    const key = `${B.si}-${bi}`;
    let clip;
    let tau;
    let mode;
    let entry;
    const vk = v.v === "m" ? "m" : "f"; // 念的是哪一個聲音：時間與錨點用那一個的
    const tk = TK[vk][0];
    if (v.on && v.beat === key && v.end > v.start && Array.isArray(b[tk])) {
      mode = "audio";
      clip = b.why && b.why[tk] && v.start === b.why[tk][0] ? "q" : "s";
      const raw = v.at - v.start;
      if (raw !== B.raw) { B.raw = raw; B.rawAt = now; }
      let est = raw + (v.paused ? 0 : Math.min(100, (now - B.rawAt) * (v.rate || 1)));
      if (B.clip === clip && est < B.tau && B.tau - est < 150) est = B.tau;
      if (raw < -80) est = 0; // 還在跳到這一句的起點
      tau = Math.max(0, Math.min(est, v.end - v.start));
      B.paused = Boolean(v.paused);
      B.pending = 0;
    } else if (v.on && !v.paused && v.beat !== key && (B.pending ? now - B.pending < 600 : (B.pending = now))) {
      mode = "wait";
      clip = b.why ? "q" : "s";
      tau = 0;
    } else {
      mode = "virtual";
      B.paused = false;
      if (open && b.why && B.s0 === null) B.s0 = now;
      clip = b.why && !open ? "q" : "s";
      tau = now - (clip === "s" && b.why ? B.s0 : B.q0);
    }
    if (!B.fresh && mode !== "audio") return end;
    entry = clip === (b.why ? "q" : "s") ? cl(tau / ENTRY) : 1;
    B.clip = clip;
    B.tau = tau;
    const sch = mode === "audio" ? B.sch.audio[vk] : B.sch.virt;
    for (const x of mine) {
      let q;
      if (x.why && !B.open) q = 0;
      else if (x.clip !== clip) q = x.clip === "q" ? 1 : 0;
      else { const s = sch[x.g] || B.sch.virt[x.g] || [0, 600]; q = cl((tau - s[0]) / s[1]); }
      if (q < 1) return { g: x.g, q, entry, mode };
    }
    return { g: end.g, q: 0, entry, mode };
  }
  function frame(now) {
    raf = 0;
    if (!B || !B.M) return;
    if (!B.el.isConnected) { stop(); return; }
    const c = cursor(now);
    B.cur = c;
    const beat = c.beat === undefined ? B.at : c.beat;
    const sig = `${c.g}|${c.q.toFixed(4)}|${c.entry.toFixed(3)}|${beat}`;
    if (sig !== B.last) { B.last = sig; paint(c.g, c.q, beat, c.entry); }
    const A = B.M.acts[c.g];
    const busy = c.mode === "wait" || (c.mode === "audio" && !B.paused) || (c.mode === "virtual" && (c.q > 0 || (A && A.b === B.at && !(A.why && !B.open)))) || (c.mode !== "done" && c.entry < 1);
    // 不動的時候也每 300ms 看一眼：旁白可能剛按了播放、跳回這一句的開頭
    if (busy) raf = window.requestAnimationFrame(frame);
    else if (!B.frozen) poll = window.setTimeout(() => { poll = 0; kick(); }, 300);
  }
  function kick() {
    window.clearTimeout(poll);
    poll = 0;
    if (!raf && B && B.M) raf = window.requestAnimationFrame(frame);
  }
  function stop() { window.cancelAnimationFrame(raf); window.clearTimeout(poll); raf = poll = 0; }

  // course_sections.js 每次畫完（整頁或只換句子）叫這一支：黑板是同一個元素，搬進新畫的位置
  function sync(api, root) {
    const slot = root && root.querySelector("[data-cvb-slot]");
    const sec = api.state.sec;
    if (!slot || !sec) { stop(); B = null; return; }
    if (!document.getElementById("cvb-style")) { const st = mk("style", ""); st.id = "cvb-style"; st.textContent = CSS; document.head.appendChild(st); }
    const S = api.data.sections[sec.si];
    const at = Math.min(S.beats.length, sec.shown[sec.si] || 1) - 1;
    const key = `${api.m.id}:${sec.si}`;
    const now = performance.now();
    if (!B || B.key !== key || B.state !== api.state) {
      stop();
      const el = mk("div", "cvb");
      el.setAttribute("aria-hidden", "true");
      B = { key, si: sec.si, state: api.state, el, at: -1, sec: S, M: null, w: 0, raw: null, rawAt: 0, tau: 0, clip: "", pending: 0, s0: null, q0: now };
    }
    B.api = api;
    B.sec = S;
    if (B.el.parentNode !== slot) slot.appendChild(B.el);
    if (!B.M || B.el.clientWidth !== B.w) build();
    const b = S.beats[at] || {};
    const open = Boolean(b.why && (!window.BuzzCourseProof || (sec.why[`${sec.si}-${at}`] || {}).open));
    if (B.at !== at) {
      B.at = at;
      B.fresh = sec.fresh === at && !reduced();
      B.q0 = now;
      B.s0 = open ? now : null;
      B.open = open || !b.why;
      B.raw = null;
      B.pending = 0;
      B.last = "";
    } else if (open && !B.open) { B.open = true; B.s0 = now; B.last = ""; }
    kick();
  }
  if (typeof window !== "undefined" && window.addEventListener) {
    let rt = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => { if (B && B.el.isConnected && B.el.clientWidth !== B.w) { build(); B.last = ""; kick(); } }, 200);
    });
  }
  // 給 E2E 與 tools/lint_board_layout.js：狀態、停在某一步、直接畫某個游標
  const debug = {
    model: () => (B && B.M && B.L ? { acts: B.M.acts.map((x) => ({ g: x.g, b: x.b, k: x.k, do: x.a.do, clip: x.clip, why: x.why })), anns: B.M.anns.map((x) => ({ g: x.g, b: x.b, do: x.a.do, refs: x.refs, wrong: x.wrong, dieG: x.dieG === Infinity ? -1 : x.dieG })), H: B.L.H, w: B.w, sch: B.sch } : null),
    show(g, q, beat, entry) {
      if (!B || !B.M) return false;
      const A = B.M.acts[g];
      const bt = beat === undefined ? (A ? A.b : B.M.acts[g - 1].b) : beat;
      B.frozen = { g, q: q || 0, entry: entry === undefined ? 0 : entry, mode: "frozen", beat: bt };
      stop();
      B.last = "";
      paint(g, q || 0, bt, B.frozen.entry);
      return true;
    },
    tick() { if (B && B.M) { window.cancelAnimationFrame(raf); raf = 0; frame(performance.now()); } },
    release() { if (B) { B.frozen = null; B.last = ""; kick(); } },
    rebuild() { if (B) { build(); B.last = ""; kick(); } }
  };
  window.BuzzBoard = {
    sync, tex, KOPT, debug,
    state: () => (B && B.M ? { key: B.key, at: B.at, g: (B.cur || {}).g, q: (B.cur || {}).q, mode: (B.cur || {}).mode, clip: B.clip, tau: Math.round(B.tau || 0), running: Boolean(raf), p: B.cur && B.cur.mode !== "done" ? (B.cur.g + B.cur.q) : 1 } : null)
  };
})();
