// 黑板 v2 的純函式（不碰 DOM，node 裡也能測）：切式子、排一節的狀態、排版、放標籤、畫箭頭的路線、時間表。
// 畫面在 src/course_board.js（同一組 data-lazy="board"）。規格：SCHEMA.md「黑板」；樣式：docs/board-style.md。
(function () {
  "use strict";
  const REL = new Set(["=", "<", ">", "\\le", "\\ge", "\\leq", "\\geq", "\\ne", "\\neq", "\\approx", "\\to", "\\Rightarrow", "\\Leftrightarrow", "\\iff", "\\implies", "\\equiv", "\\sim", "\\lt", "\\gt", "\\mapsto", "\\longrightarrow"]);
  const PUNCT = /[，、：；。！？]/;
  const IDS = /\{\{([a-z][a-z0-9]{0,7}):/g;
  const ids = (s) => [...String(s).matchAll(IDS)].map((m) => m[1]);
  const cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ease-in-out cubic

  // 一段 TeX 在最外層（括號外、\left…\right 外）的關係符號處切開：[lhs, "= …", "\le …"]
  function relSplit(src) {
    const out = [];
    let depth = 0;
    let lr = 0;
    let from = 0;
    for (let i = 0; i < src.length; i += 1) {
      const c = src[i];
      if (c === "\\") {
        const m = /^\\([a-zA-Z]+|.)/.exec(src.slice(i));
        const cmd = m[0];
        if (cmd === "\\left") lr += 1;
        else if (cmd === "\\right") lr -= 1;
        else if (!depth && !lr && REL.has(cmd) && i > from) { out.push(src.slice(from, i)); from = i; } else if (!depth && !lr && REL.has(cmd) && i === 0) from = 0;
        i += cmd.length - 1;
      } else if (c === "{") depth += 1;
      else if (c === "}") depth -= 1;
      else if (!depth && !lr && (c === "=" || c === "<" || c === ">") && i > from) {
        // 連著的關係（<=、\le= 之類）算同一個
        if (!/[=<>]\s*$/.test(src.slice(from, i)) || src.slice(from, i).trim().length > 2) { out.push(src.slice(from, i)); from = i; }
      }
    }
    out.push(src.slice(from));
    return out.filter((s) => s.trim());
  }
  const IMPL = new Set(["\\Rightarrow", "\\Leftrightarrow", "\\iff", "\\implies"]);
  const isRel = (s) => { const t = s.trim(); const m = /^\\[a-zA-Z]+/.exec(t); return /^[=<>]/.test(t) || Boolean(m && REL.has(m[0])); };

  // 一行 → 單位（可以在單位之間換行）：每個單位是 [{m: 數學?, s}]。換行點：中文標點之後、最外層的關係符號之前。
  function units(line) {
    const toks = [];
    String(line).split(/(?<!\\)\$/).forEach((p, i) => {
      if (!p) return;
      if (i % 2) relSplit(p).forEach((s, k) => toks.push({ m: true, s, rel: isRel(s), brk: k > 0 }));
      else p.split(/(?<=[，、：；。！？])/).forEach((s, k) => { if (s) toks.push({ m: false, s, brk: k > 0 }); });
    });
    const out = [];
    toks.forEach((t, k) => {
      const prev = toks[k - 1];
      const brk = k > 0 && (t.brk || t.rel || (prev && !prev.m && PUNCT.test(prev.s.trim().slice(-1))));
      if (!out.length || brk) out.push({ rel: Boolean(t.rel), toks: [] });
      out[out.length - 1].toks.push({ m: t.m, s: t.s });
    });
    const pure = toks.every((t) => t.m);
    // 對齊用第一個關係符號（⇒ 這種推論箭頭不算：它開的是新的一句）；開頭就是推論箭頭的行不對齊
    const lead = (u) => { const m = /^\s*(\\[a-zA-Z]+)/.exec(u.toks[0].s); return m && IMPL.has(m[1]); };
    const r = out.findIndex((u) => u.rel && !lead(u));
    if (out[0] && lead(out[0])) return { units: out, align: -1, chars: plainLen(line) };
    return { units: out, align: pure && r >= 0 ? r : -1, chars: plainLen(line) };
  }
  // 看得到的字數（估寫字的時間）：拿掉指令、括號、{{id:
  function plainLen(line) {
    return String(line).replace(/\{\{[a-z][a-z0-9]*:/g, "").replace(/\\[a-zA-Z]+/g, "x").replace(/[{}$\\^_\s]/g, "").length;
  }

  // 一行放進寬 W：太寬先小縮（≥ 0.9），再在單位之間換行，最後才縮到放得下（低於 smin 會被 lint 擋）
  function compose(ws, W, smin, align) {
    const total = ws.reduce((a, b) => a + b, 0);
    if (total <= W) return { rows: [ws.map((_w, i) => i)], s: 1, ind: [0] };
    if (W / total >= Math.max(0.9, smin)) return { rows: [ws.map((_w, i) => i)], s: W / total, ind: [0] };
    const rows = [[]];
    let x = 0;
    ws.forEach((w, i) => {
      if (rows[rows.length - 1].length && x + w > W) { rows.push([]); x = 0; }
      rows[rows.length - 1].push(i);
      x += w;
    });
    // 接續的行以關係符號開頭：對齊到第一個關係符號底下（放得下的話）
    const lhs = align > 0 ? ws.slice(0, align).reduce((a, b) => a + b, 0) : 0;
    const wid = rows.map((r) => r.reduce((a, i) => a + ws[i], 0));
    const ind = rows.map((r, k) => (k && align >= 0 && r[0] >= align ? Math.max(0, Math.min(lhs, W - wid[k])) : 0));
    const widest = Math.max(...wid.map((w, k) => w + ind[k]));
    return { rows, s: widest > W ? W / widest : 1, ind, wrapped: true };
  }

  /* ── 一節的動作照順序走一次：板上有哪些項（一行式子或一張圖）、每一步之後的狀態、記號什麼時候畫什麼時候收 ── */
  function compile(beats) {
    const acts = [];
    const items = []; // { n, kind: line|plot, a, born, from, die, ids }
    const anns = []; // { g, a, kind: mark|arrow, refs: [[item, id]], dieG, dieBeat }
    const states = [];
    let cur = [];
    const tint = {};
    const holder = (id, skip) => { for (let k = cur.length - 1; k >= 0; k -= 1) { const it = items[cur[k]]; if (it !== skip && it.ids.includes(id)) return it; } return null; };
    beats.forEach((b, bi) => (b.board || []).forEach((a, k) => {
      const g = acts.length;
      acts.push({ g, b: bi, k, a, why: Boolean(a.why), clip: b.why && !a.why ? "q" : "s" });
      if (a.do === "write" || a.do === "transform" || a.do === "plot") {
        const it = { n: items.length, kind: a.do === "plot" ? "plot" : "line", a, born: g, from: null, die: Infinity, ids: a.line ? ids(a.line) : [], fly: [] };
        if (a.tint) Object.assign(tint, a.tint);
        it.tint = { ...tint };
        if (a.do === "transform") {
          const k0 = cur.map((n) => items[n].kind).lastIndexOf("line");
          if (k0 < 0) { acts.pop(); return; }
          it.from = items[cur[k0]];
          it.from.die = g;
          cur = cur.slice();
          cur[k0] = it.n;
        } else cur = cur.concat(it.n);
        items.push(it);
        // 前面幾行已經有的項：複製一份飛過來（變形時從被換掉的那一行搬；對得上就是同一個式子）
        it.ids.forEach((id) => { const src = it.from && it.from.ids.includes(id) ? it.from : holder(id, it); if (src && src !== it) it.fly.push([id, src.n]); });
      } else if (a.do === "clear" || a.do === "keep") {
        const keep = a.do === "keep" ? Math.max(0, Number(a.n) || 0) : 0;
        cur.slice(0, cur.length - keep).forEach((n) => { items[n].die = g; });
        cur = cur.slice(cur.length - keep);
      } else {
        const refs = a.do === "arrow" ? [a.from, a.to] : [a.term];
        const rs = refs.map((id) => [holder(id), id]);
        // 「錯」的記號（劃掉、紅色）跟著那一行活：那一行還在板上，它就一直在（不能讓一個錯的式子沒標記地留著）
        const wrong = a.do === "strike" || a.color === "red";
        if (rs.every((r) => r[0])) anns.push({ g, a, b: bi, kind: a.do === "arrow" ? "arrow" : "mark", refs: rs.map(([it, id]) => [it.n, id]), dieG: Infinity, dieBeat: wrong ? Infinity : bi + 1, wrong });
      }
      states.push(cur);
    }));
    return { acts, items, anns, states };
  }

  /* ── 排版：每一個狀態裡每一項的位置。m = { W(內寬), pad:[左,上], gap, items: [{ h, w, rows?, lhs?, alignable, gapA, gapB }] } ── */
  function stack(model, m) {
    const { states, items } = model;
    // 對齊組：任何一個狀態裡相鄰、都能對齊（一行純式子、有關係符號）的行，整節用同一條 = 的位置
    const grp = items.map((_it, i) => i);
    const root = (i) => (grp[i] === i ? i : (grp[i] = root(grp[i])));
    states.forEach((st) => st.forEach((n, k) => { const p = st[k - 1]; if (k && m.items[n].alignable && m.items[p].alignable) grp[root(n)] = root(p); }));
    const G = {};
    items.forEach((_it, i) => {
      const mi = m.items[i];
      if (!mi.alignable) return;
      const r = root(i);
      const g = G[r] || (G[r] = { L: 0, R: 0, n: 0 });
      g.L = Math.max(g.L, mi.lhs);
      g.R = Math.max(g.R, mi.w - mi.lhs);
      g.n += 1;
    });
    const xs = items.map((_it, i) => {
      const mi = m.items[i];
      const g = mi.alignable && G[root(i)];
      if (g && g.n > 1 && g.L + g.R <= m.W) return m.pad[0] + (m.W - g.L - g.R) / 2 + g.L - mi.lhs;
      return m.pad[0] + Math.max(0, (m.W - mi.w) / 2);
    });
    let bottom = 0;
    const pos = states.map((st) => {
      const p = {};
      let y = m.pad[1];
      st.forEach((n) => {
        const mi = m.items[n];
        y += mi.gapA || 0;
        p[n] = [xs[n], y];
        y += mi.h + (mi.gapB || 0) + m.gap;
      });
      bottom = Math.max(bottom, y - m.gap);
      return p;
    });
    return { pos, bottom };
  }

  // 記號什麼時候收：下一句一開始（淡出），或它掛的那一行被換掉、擦掉、搬動（之後就不對位了），看哪個先
  function lifetimes(model, pos) {
    model.anns.forEach((an) => {
      an.dieG = Infinity;
      for (let g = an.g + 1; g < model.acts.length; g += 1) {
        // 一般的記號：那一行動了就收；「錯」的記號跟著那一行搬，那一行不在了（擦掉、被變形換掉）才收
        const gone = an.refs.some(([n]) => { const p = pos[g][n]; const q = pos[an.g][n]; return !p || (!an.wrong && (p[0] !== q[0] || p[1] !== q[1])); });
        if (gone) { an.dieG = g; break; }
      }
      const lastInBeat = an.wrong ? model.acts.length - 1 : model.acts.filter((x) => x.b === an.b).pop().g;
      an.last = Math.min(lastInBeat, an.dieG - 1);
    });
  }

  /* ── 碰撞 ── */
  const hit = (a, b, m) => a[0] < b[2] + m && b[0] < a[2] + m && a[1] < b[3] + m && b[1] < a[3] + m;
  const inside = (a, B) => a[0] >= B[0] && a[1] >= B[1] && a[2] <= B[2] && a[3] <= B[3];
  // 標籤：候選位置照偏好試，第一個不碰任何東西、不出板的就是它
  function placeLabel(w, h, T, row, pref, obs, bounds) {
    const cx = (T[0] + T[2]) / 2;
    const out = [];
    const xs = [cx - w / 2, cx - w / 2 + w * 0.35, cx - w / 2 - w * 0.35, cx - w / 2 + w * 0.7, cx - w / 2 - w * 0.7, T[2] - w, T[0]];
    const below = (lane) => xs.forEach((x) => out.push([x, row[3] + 4 + lane * (h + 2)]));
    const above = (lane) => xs.forEach((x) => out.push([x, row[1] - 4 - h - lane * (h + 2)]));
    const side = () => { out.push([T[2] + 7, (T[1] + T[3]) / 2 - h / 2]); out.push([T[0] - 7 - w, (T[1] + T[3]) / 2 - h / 2]); };
    if (pref === "above") { above(0); below(0); side(); above(1); below(1); } else { below(0); above(0); side(); below(1); above(1); }
    for (const [x, y] of out) {
      const r = [x, y, x + w, y + h];
      if (inside(r, bounds) && !obs.some((o) => hit(r, o, 2))) return r;
    }
    return null;
  }
  // 箭頭的標籤：沿著曲線（中間優先）往法線方向的兩邊試，離線 6px
  function placeArrowLabel(w, h, p, obs, bounds) {
    for (const t of [0.5, 0.42, 0.58, 0.34, 0.66]) {
      const [px, py] = qpt(p, t);
      const [ax, ay] = qpt(p, t - 0.02);
      const [bx, by] = qpt(p, t + 0.02);
      const k = Math.hypot(bx - ax, by - ay) || 1;
      const n = [-(by - ay) / k, (bx - ax) / k];
      for (const sg of [1, -1]) {
        const nx = n[0] * sg;
        const ny = n[1] * sg;
        const r = Math.abs(nx) >= Math.abs(ny)
          ? [nx > 0 ? px + 6 : px - 6 - w, py - h / 2]
          : [px - w / 2, ny > 0 ? py + 6 : py - 6 - h];
        const box = [r[0], r[1], r[0] + w, r[1] + h];
        if (inside(box, bounds) && !obs.some((o) => hit(box, o, 2))) return box;
      }
    }
    return null;
  }
  // 箭頭：一條二次曲線；試幾種彎法，挑不穿過字、不出板、最短的
  function qpt(p, t) { const u = 1 - t; return [u * u * p[0] + 2 * u * t * p[2] + t * t * p[4], u * u * p[1] + 2 * u * t * p[3] + t * t * p[5]]; }
  function routeArrow(A, Bx, obs, bounds) {
    const ax = (A[0] + A[2]) / 2;
    const bx = (Bx[0] + Bx[2]) / 2;
    const c = [];
    if (Bx[1] >= A[3] - 2 || A[1] >= Bx[3] - 2) {
      const down = Bx[1] >= A[3] - 2;
      const y0 = down ? A[3] + 4 : A[1] - 4;
      const y1 = down ? Bx[1] - 4 : Bx[3] + 4;
      [0, 18, -18, 36, -36, 60, -60].forEach((d) => c.push([ax, y0, (ax + bx) / 2 + d, (y0 + y1) / 2, bx, y1]));
      [[A[2] + 3, Bx[1] - 4], [A[0] - 3, Bx[1] - 4]].forEach(([x0, y]) => { if (down) c.push([x0, (A[1] + A[3]) / 2, bx, (A[1] + A[3]) / 2, bx, y]); });
    }
    [16, 26, 38].forEach((h) => {
      const top = Math.min(A[1], Bx[1]) - 4;
      const bot = Math.max(A[3], Bx[3]) + 4;
      c.push([ax, A[1] - 4, (ax + bx) / 2, top - h, bx, Bx[1] - 4]);
      c.push([ax, A[3] + 4, (ax + bx) / 2, bot + h, bx, Bx[3] + 4]);
    });
    let best = null;
    c.forEach((p) => {
      let cost = Math.hypot(p[4] - p[0], p[5] - p[1]) + 0.3 * Math.hypot(p[2] - (p[0] + p[4]) / 2, p[3] - (p[1] + p[5]) / 2);
      for (let i = 0; i <= 40; i += 1) {
        const [x, y] = qpt(p, i / 40);
        if (x < bounds[0] || x > bounds[2] || y < bounds[1] || y > bounds[3]) cost += 400;
        // 每一段都算，不管路線長短：用比例，免得短的路線吃虧
        if (obs.some((o) => x > o[0] - 2 && x < o[2] + 2 && y > o[1] - 2 && y < o[3] + 2)) cost += 25000 / 41;
      }
      if (!best || cost < best.cost) best = { p, cost };
    });
    return best;
  }
  const curveBoxes = (p) => { const out = []; for (let i = 0; i <= 24; i += 1) { const [x, y] = qpt(p, i / 24); out.push([x - 1.5, y - 1.5, x + 1.5, y + 1.5]); } return out; };

  // 記號的外框（離旁邊的字留一點，不壓到）：T = 項的墨水框，gaps = [左, 上, 右, 下] 到最近的字的距離
  // m：最小的邊長（很扁的項，例如一個負號，圈起來至少要像一個圈）
  function markBox(type, T, gaps, m) {
    const pad = (k, want) => Math.max(0.5, Math.min(want, (gaps[k] === undefined ? 99 : gaps[k]) - 2.2));
    if (type === "underline") return [T[0], T[3] + 1, T[2], T[3] + pad(3, 5)];
    if (type === "strike") return [T[0] + 1, T[1] + 1, T[2] - 1, T[3] - 1];
    const w = type === "box" ? 4 : 6;
    const h = type === "box" ? 3 : 4;
    const ex = (lo, hi, k0, k1, want) => { const d = Math.max(0, (m || 0) - (hi - lo)) / 2; return [lo - Math.min(d + want, Math.max(0.5, gaps[k0] - 2.2)), hi + Math.min(d + want, Math.max(0.5, gaps[k1] - 2.2))]; };
    const [x0, x1] = ex(T[0], T[2], 0, 2, w);
    const [y0, y1] = ex(T[1], T[3], 1, 3, h);
    return [x0, y0, x1, y1];
  }
  const f1 = (v) => Math.round(v * 10) / 10;
  function markPath(type, r) {
    const [x0, y0, x1, y1] = r;
    if (type === "underline") return `M${f1(x0)} ${f1(y1 - 1)}Q${f1((x0 + x1) / 2)} ${f1(y1 + 0.8)} ${f1(x1)} ${f1(y1 - 1.6)}`;
    if (type === "strike") return `M${f1(x0)} ${f1(y1)}L${f1(x1)} ${f1(y0)}`;
    if (type === "box") { const k = 3.5; return `M${f1(x0 + k)} ${f1(y0)}H${f1(x1 - k)}Q${f1(x1)} ${f1(y0)} ${f1(x1)} ${f1(y0 + k)}V${f1(y1 - k)}Q${f1(x1)} ${f1(y1)} ${f1(x1 - k)} ${f1(y1)}H${f1(x0 + k)}Q${f1(x0)} ${f1(y1)} ${f1(x0)} ${f1(y1 - k)}V${f1(y0 + k)}Q${f1(x0)} ${f1(y0)} ${f1(x0 + k)} ${f1(y0)}`; }
    // circle：超橢圓（n ≈ 3.3）貼著項，起點在左上、多畫一點收尾（手畫的感覺，但不歪）
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const a = (x1 - x0) / 2;
    const b = (y1 - y0) / 2;
    let d = "";
    for (let i = 0; i <= 48; i += 1) {
      const t = -2.2 + (i / 48) * (Math.PI * 2 + 0.35);
      const c = Math.cos(t);
      const s = Math.sin(t);
      d += `${i ? "L" : "M"}${f1(cx + a * Math.sign(c) * Math.pow(Math.abs(c), 0.6))} ${f1(cy + b * Math.sign(s) * Math.pow(Math.abs(s), 0.6))}`;
    }
    return d;
  }

  /* ── 時間表：一段錄音（或沒有錄音時的虛擬時間）裡的動作 → [起, 長] 毫秒 ── */
  const NAT = { write: 0, transform: 1000, plot: 1800, clear: 450, keep: 700, circle: 650, box: 650, underline: 550, strike: 450, arrow: 800, focus: 500 };
  const natural = (a) => (a.do === "write" ? Math.max(550, Math.min(1300, 320 + 40 * plainLen(a.line || ""))) : NAT[a.do] || 600);
  // on: "字" 或 "字#2"（第 2 次出現）→ 在 say 裡的字元位置（找不到 → -1）
  function charOf(on, say) {
    const m = /^(.*?)(?:#(\d+))?$/.exec(String(on));
    let at = -1;
    for (let k = 0; k < (Number(m[2]) || 1); k += 1) { at = String(say).indexOf(m[1], at + 1); if (at < 0) return -1; }
    return [...String(say).slice(0, at)].length;
  }
  // acts: 這一段的動作；T: 這一段多長；startOf(a) → 錨定的毫秒或 null
  function schedule(acts, T, startOf) {
    const out = [];
    let t = 0;
    acts.forEach((a, i) => {
      const fixed = startOf(a);
      let s = fixed === null || fixed === undefined ? (i ? t + 60 : 0) : fixed;
      if (i) s = Math.max(s, out[i - 1][0] + 160);
      out.push([s, natural(a)]);
      t = s + natural(a);
    });
    // 每個動作在下一個開始前做完；全部在這一段結束前（留 60ms）做完
    for (let i = out.length - 1; i >= 0; i -= 1) {
      // 錨定的起點不提早（畫面不能搶在念到之前）；只有最後一個動作離這一段的結尾太近時才往前挪，免得被下一句截斷
      const last = i + 1 === out.length;
      const lim = last ? T - 60 : out[i + 1][0];
      if (out[i][0] + out[i][1] > lim) out[i][1] = Math.max(last ? 220 : 120, lim - out[i][0]);
      if (last && out[i][0] + out[i][1] > lim) out[i][0] = Math.max(i ? out[i - 1][0] + 160 : 0, lim - out[i][1]);
    }
    return out;
  }

  window.BuzzBoardLayout = { placeArrowLabel, relSplit, units, plainLen, compose, compile, stack, lifetimes, placeLabel, routeArrow, curveBoxes, markBox, markPath, qpt, schedule, natural, charOf, hit, inside, ease, cl, ids };
})();
