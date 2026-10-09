// ── 課程地圖（中文介面，新版課程的「地圖」檢視）──
//
// 版面在 build 時就算好了（tools/lib/course_map_layout.js → src/course_v2/map.js 的 window.BUZZ_COURSE_MAP），
// 這支只負責畫跟操作：執行時不排版、不跑力導向模擬。兩支都是 index.html 的 type="text/lazy" data-lazy="map"，
// 打開地圖才抓。英文介面不載新版課程，所以字直接寫中文（validate_i18n 不掃這支）。
//
// 畫法：一張 canvas（DPR 感知、最多 2×），整張圖一個相機變換（screen = world × s + t）。
//   靜態幾何（317 課的膠囊、770 條先修邊、章與 Stage 的框、三層彙總邊）在第一次打開時做成 Path2D，
//   之後每一格只是 setTransform ＋ stroke/fill 這些 Path2D ＋ 畫看得到的字 —— 每格不配置新物件。
//   閒著不畫：只有相機在動（拖、慣性、飛行動畫）或狀態變了才排一格 requestAnimationFrame。
// 語意縮放：拉遠是 13 個 Stage（＋Stage 之間的相依），中間是章，拉近才是一課一課（課號 · 課名、狀態）。
//   三層用縮放倍率淡入淡出（不是一下子換掉）。
// 操作：pointer events —— 一指拖曳（放開有慣性）、兩指捏合（以兩指中點為中心）、滾輪／觸控板（以游標為中心）、
//   點兩下放大；點一課 → 它的全部先修（祖先）與後續（子孫）亮起、其他變淡，下面出小卡。
//   canvas 是 touch-action:none（只有地圖本身不捲頁）；滾輪只在地圖上 preventDefault。
//   鍵盤：地圖本身可以 focus，←→ 在先修／後續之間走、↑↓ 在同一章上下走、Enter 打開、Esc 取消、+/- 縮放。
//   螢幕閱讀器：旁邊有一份看不見的清單（course_v2_ui.js 畫），焦點移動也會念出來（aria-live）。
// prefers-reduced-motion：相機直接跳到位，不飛、不滑。
(function () {
  "use strict";

  const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  const F_LESSON_NO = `700 12px ${FONT}`;
  const F_LESSON = `600 13px ${FONT}`;
  const F_CHAPTER_W = `700 12px ${FONT}`;
  const F_LABEL = `700 13px ${FONT}`;
  const F_SMALL = `600 11px ${FONT}`;
  const F_STAGE_NO = `800 12px ${FONT}`;
  const MAX_SCALE = 2.4;
  // 三層的淡入淡出區間（倍率）
  const STAGE_OUT = [0.2, 0.3];
  const LESSON_IN = [0.45, 0.6];
  const STYLE = `
.cv2-map { display: flex; flex-direction: column; gap: 8px; }
.cmap-stage { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: var(--paper); -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.cmap-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.cmap-chips button, .cmap-todo button { min-height: 40px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); font: inherit; font-weight: 700; cursor: pointer; }
.cmap-chips button { padding: 0 12px; border-radius: 999px; font-size: 0.86rem; font-variant-numeric: tabular-nums; }
.cmap-chips button[aria-pressed="true"] { border-color: var(--ink); background: var(--ink); color: var(--panel); }
.cmap-dot { display: inline-block; width: 7px; height: 7px; margin-right: 5px; border-radius: 50%; background: var(--blue); vertical-align: 1px; }
.cmap-dot.is-red { background: var(--red); }
.cmap-goal { flex-basis: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 0 6px; margin: 0; padding: 4px 4px 4px 12px; border: 1px solid color-mix(in srgb, var(--violet) 50%, var(--line)); border-radius: 12px; font-size: 0.86rem; }
.cmap-goal b { color: var(--violet); }
.cmap-goal small { display: inline-block; color: var(--muted); font-size: inherit; font-variant-numeric: tabular-nums; }
.cmap-goal .button { min-height: 40px; }
.cmap-todo { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
.cmap-todo button { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 0 10px; width: 100%; padding: 6px 12px; border-radius: 12px; text-align: left; }
.cmap-todo strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.9rem; }
.cmap-todo small { grid-column: 1; color: var(--red); font-size: 0.8rem; }
.cmap-todo em { grid-column: 2; grid-row: 1 / span 2; padding: 4px 10px; border-radius: 999px; background: var(--ink); color: var(--panel); font-size: 0.82rem; font-style: normal; white-space: nowrap; }
.cmap-empty { margin: 0; color: var(--muted); font-size: 0.86rem; }
.cmap-why { margin: 0 0 6px; color: var(--red); font-size: 0.86rem; font-weight: 700; }
.cmap-tag { padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, var(--blue) 12%, var(--panel)); color: var(--blue); font-weight: 700; }
.cmap-tag.is-goal { background: color-mix(in srgb, var(--violet) 12%, var(--panel)); color: var(--violet); }
.cmap-canvas { display: block; width: 100%; height: 100%; touch-action: none; outline: none; cursor: grab; }
.cmap-canvas:active { cursor: grabbing; }
.cmap-stage.is-kbd .cmap-canvas:focus { outline: 2px solid var(--blue); outline-offset: -2px; }
.cmap-zoom { position: absolute; top: 10px; right: 10px; display: grid; gap: 6px; }
.cmap-zoom button { width: 40px; height: 40px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); color: var(--ink); font: inherit; font-size: 1.2rem; font-weight: 700; line-height: 1; cursor: pointer; }
.cmap-card { position: absolute; left: 10px; right: 10px; bottom: 10px; max-width: 400px; padding: 12px 14px 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); box-shadow: var(--shadow); }
.cmap-card[hidden] { display: none; }
.cmap-card-kicker { margin: 0 44px 2px 0; color: var(--muted); font-size: 0.78rem; font-weight: 700; }
.cmap-card h3 { margin: 0 44px 6px 0; font-size: 1.12rem; line-height: 1.4; }
.cmap-card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 12px; margin: 0 0 6px; color: var(--muted); font-size: 0.84rem; font-variant-numeric: tabular-nums; }
.cmap-key { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%; background: var(--gold); }
.cmap-key.is-desc { background: var(--blue); }
.cmap-tier { padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 7%, transparent); color: var(--muted); font-weight: 700; }
.cmap-tier.t1 { background: color-mix(in srgb, var(--green) 14%, var(--panel)); color: var(--green); }
.cmap-tier.t2 { background: color-mix(in srgb, var(--blue) 14%, var(--panel)); color: var(--blue); }
.cmap-tier.t3 { background: color-mix(in srgb, var(--gold) 20%, var(--panel)); color: var(--gold-dark); }
.cmap-card-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.cmap-card-actions .button { min-height: 40px; }
.cmap-card .cmap-close { position: absolute; top: 6px; right: 6px; width: 40px; min-width: 40px; height: 40px; padding: 0; font-size: 1.3rem; }
`;
  function injectStyle() {
    if (document.getElementById("cmap-style")) return;
    const node = document.createElement("style");
    node.id = "cmap-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }
  const smooth = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  /* ── 靜態模型：第一次打開時從 BUZZ_COURSE_MAP 建一次 ── */
  let G = null;
  function buildModel(data) {
    const n = data.lessons.length / 2;
    const [NW, NH] = data.node;
    const lx = new Float32Array(n);
    const ly = new Float32Array(n);
    for (let i = 0; i < n; i += 1) { lx[i] = data.lessons[2 * i]; ly[i] = data.lessons[2 * i + 1]; }
    const preds = Array.from({ length: n }, () => []);
    const succs = Array.from({ length: n }, () => []);
    for (let k = 0; k < data.pre.length; k += 2) { preds[data.pre[k + 1]].push(data.pre[k]); succs[data.pre[k]].push(data.pre[k + 1]); }
    const rel = Array.from({ length: n }, () => []);
    for (let k = 0; k < data.rel.length; k += 2) { rel[data.rel[k]].push(data.rel[k + 1]); rel[data.rel[k + 1]].push(data.rel[k]); }
    return { data, n, NW, NH, lx, ly, preds, succs, rel, chapterOf: new Int16Array(n) };
  }

  // 先修邊的形狀：從來源膠囊的右邊出、到目標膠囊的左邊進；同一章裡相鄰的是一小段直線，同一章隔行的是左側的弧
  function edgePath(path, m, a, b) {
    const hw = m.NW / 2;
    const hh = m.NH / 2;
    const ax = m.lx[a];
    const ay = m.ly[a];
    const bx = m.lx[b];
    const by = m.ly[b];
    if (Math.abs(ax - bx) < 1) {
      if (by > ay && by - ay < m.NH * 1.6) { path.moveTo(ax, ay + hh); path.lineTo(bx, by - hh); return; }
      const off = 16 + Math.min(40, Math.abs(by - ay) * 0.08);
      path.moveTo(ax - hw, ay);
      path.bezierCurveTo(ax - hw - off, ay, bx - hw - off, by, bx - hw, by);
      return;
    }
    const x1 = ax + hw;
    const x2 = bx - hw;
    if (x2 < x1 + 24) {
      // 目標在左邊（Stage 裡換列的章、逆大綱順序的少數幾條）：從兩課的左緣繞，不畫橫跨的 S 形大圈
      const off = 40 + Math.min(120, Math.abs(by - ay) * 0.15);
      path.moveTo(ax - hw, ay);
      path.bezierCurveTo(ax - hw - off, ay, bx - hw - off, by, bx - hw, by);
      return;
    }
    const dx = Math.max(60, Math.abs(x2 - x1) * 0.5);
    path.moveTo(x1, ay);
    path.bezierCurveTo(x1 + dx, ay, x2 - dx, by, x2, by);
  }
  // Stage 層：中心到中心（拉遠時標籤就在框的中心附近）
  function centerEdge(path, A, B) {
    const x1 = A[0] + A[2] / 2;
    const y1 = A[1] + A[3] / 2;
    const x2 = B[0] + B[2] / 2;
    const y2 = B[1] + B[3] / 2;
    const dx = Math.max(80, Math.abs(x2 - x1) * 0.5);
    path.moveTo(x1, y1);
    path.bezierCurveTo(x1 + dx, y1, x2 - dx, y2, x2, y2);
  }
  function boxEdge(path, A, B) {
    // A、B：[x, y, w, h]；右邊中點 → 左邊中點
    const x1 = A[0] + A[2];
    const y1 = A[1] + A[3] / 2;
    const x2 = B[0];
    const y2 = B[1] + B[3] / 2;
    if (x2 < x1 + 24) {
      const off = 60 + Math.min(160, Math.abs(y2 - y1) * 0.2);
      path.moveTo(A[0], y1);
      path.bezierCurveTo(A[0] - off, y1, x2 - off, y2, x2, y2);
      return;
    }
    const dx = Math.max(80, Math.abs(x2 - x1) * 0.5);
    path.moveTo(x1, y1);
    path.bezierCurveTo(x1 + dx, y1, x2 - dx, y2, x2, y2);
  }
  function roundRect(path, x, y, w, h, r) {
    if (typeof path.roundRect === "function") { path.roundRect(x, y, w, h, r); return; }
    path.moveTo(x + r, y);
    path.arcTo(x + w, y, x + w, y + h, r);
    path.arcTo(x + w, y + h, x, y + h, r);
    path.arcTo(x, y + h, x, y, r);
    path.arcTo(x, y, x + w, y, r);
    path.closePath();
  }

  function buildGeometry(m) {
    const d = m.data;
    const stageBox = (si) => [d.stages[si][0], d.stages[si][1], d.stages[si][2], d.stages[si][3]];
    const chapterBox = (ci) => [d.chapters[ci][1], d.chapters[ci][2], d.chapters[ci][3], d.chapters[ci][4]];
    m.stageBoxes = d.stages.map((_s, si) => stageBox(si));
    m.chapterBoxes = d.chapters.map((_c, ci) => chapterBox(ci));
    m.stageOfChapter = d.chapters.map((c) => c[0]);
    // 課 → 章（用位置：課的中心落在哪個章框裡；章框不重疊）
    for (let i = 0; i < m.n; i += 1) {
      for (let ci = 0; ci < m.chapterBoxes.length; ci += 1) {
        const b = m.chapterBoxes[ci];
        if (m.lx[i] > b[0] && m.lx[i] < b[0] + b[2] && m.ly[i] > b[1] && m.ly[i] < b[1] + b[3]) { m.chapterOf[i] = ci; break; }
      }
    }
    m.allEdges = new Path2D();
    d.pre.forEach((_v, k) => { if (k % 2 === 0) edgePath(m.allEdges, m, d.pre[k], d.pre[k + 1]); });
    const buckets = (flat, boxes, limits, shape) => {
      const paths = limits.map(() => new Path2D());
      for (let k = 0; k < flat.length; k += 3) {
        const w = flat[k + 2];
        const slot = limits.findIndex((lim) => w <= lim);
        shape(paths[slot < 0 ? limits.length - 1 : slot], boxes[flat[k]], boxes[flat[k + 1]]);
      }
      return paths;
    };
    m.stageEdgePaths = buckets(d.stageEdges, m.stageBoxes, [2, 8, Infinity], centerEdge);
    m.chapterEdgePaths = buckets(d.chapterEdges, m.chapterBoxes, [1, 3, Infinity], boxEdge);
  }

  /* ── 執行期狀態（跨重繪保留：相機、選取）── */
  const cam = { s: 0.1, tx: 0, ty: 0 };
  const anim = { on: false, t0: 0, dur: 0, fs: 0, fcx: 0, fcy: 0, ts: 0, tcx: 0, tcy: 0, ax: 0, ay: 0 };
  const inertia = { on: false, vx: 0, vy: 0, last: 0 };
  let host = null;
  let canvas = null;
  let ctx = null;
  let card = null;
  let live = null;
  let opts = null;
  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let frame = 0;
  let dirty = false;
  let placed = false;
  let sel = -1;
  let mark = null; // Uint8Array：1 祖先、2 子孫、3 自己
  let ancCount = 0;
  let descCount = 0;
  let hlAnc = null; // Path2D：祖先那一串的邊
  let hlDesc = null;
  let hlRel = null;
  let tiers = null; // Uint8Array：0 還沒、1 完成、2 熟練、3 全破
  // 每一課的樣式（打開時與紀錄變了才算一次，畫的時候只讀這兩個 typed array）：
  //   sty  0 還遠（先修沒齊、淡的）、1 可以學（先修都完成了）、2 完成（亮的）
  //   emph 1 照目前的篩選是「要看的」、0 被篩掉（淡掉）
  let sty = null;
  let emph = null;
  let D = null; // derive() 的結果：點亮數、可以學、目標、該練
  let stageEl = null;
  let pending = { focus: "", say: "" }; // 整頁重繪之後要把焦點還給誰、要念什麼（篩選、目標）
  // 剛做完的那一課亮一下（從分節的結算按「在地圖上看」進來）：一圈金色的環往外擴、淡掉，只播一次。
  // 那一課剛好把整章（或整個 Stage）做完：章框（Stage 框）也跟著亮一次。
  // reduced-motion：不動，環直接畫著，時間到拿掉。
  let lit = null; // { i, t0, ci, si }
  const LIT_MS = 1600;
  let N = null; // 膠囊與各種環的 Path2D（buildNodes）
  let labels = null; // 課的字：{ no, title, noW }
  let stageLabel = null;
  let chapterLabel = null;
  let pal = null;
  let ro = null;
  let mo = null;
  let drawCount = 0;
  let lastDrawMs = 0;
  const reduced = () => Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ── 顏色：讀網站的 token（亮／暗兩套），變主題時重讀 ── */
  function parseColor(text) {
    const s = String(text || "").trim();
    let m = /^#([0-9a-f]{6})$/i.exec(s);
    if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) return m[1].split("").map((c) => parseInt(c + c, 16));
    m = /rgba?\(([^)]+)\)/.exec(s);
    if (m) return m[1].split(/[ ,/]+/).slice(0, 3).map(Number);
    return [128, 128, 128];
  }
  const mix = (a, b, t) => `rgb(${Math.round(a[0] * (1 - t) + b[0] * t)}, ${Math.round(a[1] * (1 - t) + b[1] * t)}, ${Math.round(a[2] * (1 - t) + b[2] * t)})`;
  const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const tok = (name) => parseColor(cs.getPropertyValue(name));
    const paper = tok("--paper");
    const panel = tok("--panel");
    const ink = tok("--ink");
    const muted = tok("--muted");
    const line = tok("--line");
    const strong = tok("--line-strong");
    const green = tok("--green");
    const blue = tok("--blue");
    const gold = tok("--gold");
    const violet = tok("--violet");
    const red = tok("--red");
    const dark = document.documentElement.dataset.theme === "dark";
    pal = {
      dark,
      paper: rgb(paper),
      panel: rgb(panel),
      ink: rgb(ink),
      muted: rgb(muted),
      line: rgb(line),
      strong: rgb(strong),
      edge: mix(paper, muted, dark ? 0.42 : 0.38),
      edgeHeavy: mix(paper, muted, dark ? 0.62 : 0.55),
      stageFill: mix(paper, ink, dark ? 0.045 : 0.035),
      stageStroke: mix(paper, strong, 0.7),
      branchFill: mix(paper, violet, dark ? 0.1 : 0.07),
      branchStroke: mix(paper, violet, 0.45),
      chapterFill: mix(paper, panel, 0.8),
      chapterStroke: rgb(line),
      nodeFill: rgb(panel),
      nodeStroke: rgb(strong),
      // 還遠的課：底色幾乎跟紙一樣、框淡；字用 --muted（對這個底色仍 ≥ 4.5，e2e 量）
      farFill: mix(paper, panel, 0.5),
      farStroke: mix(line, strong, 0.45),
      farBlob: mix(paper, line, 0.75),
      doneBlob: mix(panel, green, dark ? 0.45 : 0.4),
      red: rgb(red),
      doneFill: mix(panel, green, dark ? 0.3 : 0.16),
      doneStroke: rgb(green),
      green: rgb(green),
      blue: rgb(blue),
      gold: rgb(gold),
      violet: rgb(violet),
      anc: rgb(gold),
      desc: rgb(blue),
      plate: mix(paper, panel, 0.6)
    };
  }

  /* ── 相機 ── */
  const W = () => G.data.size[0];
  const H = () => G.data.size[1];
  function fitScale() { return Math.min(vw / (W() + 80), vh / (H() + 80)); }
  function minScale() { return Math.min(fitScale() * 0.9, 0.08); }
  function clampCam() {
    cam.s = Math.min(MAX_SCALE, Math.max(minScale(), cam.s));
    // 圖的邊緣外最多露出 PAD 像素的空白；整張圖比畫面小的那一軸就置中
    const PAD = 56;
    const fit = (size, view, t) => {
      const span = size * cam.s;
      if (span + 2 * PAD <= view) return (view - span) / 2;
      return Math.min(PAD, Math.max(view - span - PAD, t));
    };
    cam.tx = fit(W(), vw, cam.tx);
    cam.ty = fit(H(), vh, cam.ty);
  }
  function zoomAt(px, py, factor) {
    const wx = (px - cam.tx) / cam.s;
    const wy = (py - cam.ty) / cam.s;
    cam.s = Math.min(MAX_SCALE, Math.max(minScale(), cam.s * factor));
    cam.tx = px - wx * cam.s;
    cam.ty = py - wy * cam.s;
    clampCam();
  }
  // 飛到：世界座標 (cx, cy) 放在畫面 (ax, ay)、倍率 s
  function flyTo(cx, cy, s, ax, ay) {
    s = Math.min(MAX_SCALE, Math.max(minScale(), s));
    ax = ax === undefined ? vw / 2 : ax;
    ay = ay === undefined ? vh / 2 : ay;
    inertia.on = false;
    if (reduced() || !placed) {
      cam.s = s;
      cam.tx = ax - cx * s;
      cam.ty = ay - cy * s;
      clampCam();
      anim.on = false;
      request();
      return;
    }
    anim.fs = cam.s;
    anim.fcx = (anim.ax = ax, (ax - cam.tx) / cam.s);
    anim.fcy = (anim.ay = ay, (ay - cam.ty) / cam.s);
    anim.ts = s;
    anim.tcx = cx;
    anim.tcy = cy;
    anim.t0 = performance.now();
    // 距離越遠飛越久，但不超過 0.6 秒
    const span = Math.abs(Math.log(s / cam.s)) + Math.hypot(cx - anim.fcx, cy - anim.fcy) * Math.min(s, cam.s) / Math.max(vw, 1);
    anim.dur = Math.min(600, 260 + span * 120);
    anim.on = true;
    request();
  }
  function flyToBox(x, y, w, h, maxS, ay) {
    const pad = 48;
    const usableH = ay === undefined ? vh : ay * 2;
    const s = Math.min(maxS || 1, (vw - pad) / Math.max(w, 1), (usableH - pad) / Math.max(h, 1));
    flyTo(x + w / 2, y + h / 2, s, vw / 2, ay);
  }
  function stepAnim(now) {
    const t = Math.min(1, (now - anim.t0) / anim.dur);
    const e = easeOut(t);
    // 倍率在對數上內插、中心點線性內插：看起來是同一個速度在推近
    const s = Math.exp(Math.log(anim.fs) + (Math.log(anim.ts) - Math.log(anim.fs)) * e);
    const cx = anim.fcx + (anim.tcx - anim.fcx) * e;
    const cy = anim.fcy + (anim.tcy - anim.fcy) * e;
    cam.s = s;
    cam.tx = anim.ax - cx * s;
    cam.ty = anim.ay - cy * s;
    if (t >= 1) { anim.on = false; clampCam(); }
  }
  function stepInertia(now) {
    const dt = Math.min(48, now - inertia.last);
    inertia.last = now;
    cam.tx += inertia.vx * dt;
    cam.ty += inertia.vy * dt;
    const decay = Math.exp(-dt / 325);
    inertia.vx *= decay;
    inertia.vy *= decay;
    const before = cam.tx + cam.ty;
    clampCam();
    if (Math.hypot(inertia.vx, inertia.vy) < 0.02 || Math.abs(cam.tx + cam.ty - before) > 0.5) inertia.on = false;
  }

  /* ── 排一格 ── */
  function request() {
    dirty = true;
    if (!frame) frame = window.requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    if (!host || !host.isConnected) { teardown(); return; }
    // 換螢幕／縮放瀏覽器會改 DPR，ResizeObserver 不一定叫：每格順手比一下（只是讀一個數字）
    if (Math.min(2, window.devicePixelRatio || 1) !== dpr && measure()) dirty = true;
    if (anim.on) stepAnim(now);
    if (inertia.on) stepInertia(now);
    if (lit && now - lit.t0 > LIT_MS) { lit = null; dirty = true; if (host) delete host.dataset.lit; }
    const glow = Boolean(lit) && !reduced();
    if (dirty || anim.on || inertia.on || glow) {
      dirty = false;
      draw();
    }
    if (anim.on || inertia.on || glow) frame = window.requestAnimationFrame(tick);
    else publish();
  }

  /* ── 畫 ── */
  // 字的碰撞：這一格已經放了哪些字（預先配置好的陣列，不在每格產生新物件）
  const boxes = new Float32Array(4 * 400);
  let nBoxes = 0;
  function freeSpot(x, y, w, h) {
    for (let k = 0; k < nBoxes; k += 1) {
      const o = 4 * k;
      if (x < boxes[o] + boxes[o + 2] && x + w > boxes[o] && y < boxes[o + 1] + boxes[o + 3] && y + h > boxes[o + 1]) return false;
    }
    return true;
  }
  function take(x, y, w, h) {
    if (nBoxes >= 400) return;
    const o = 4 * nBoxes;
    boxes[o] = x; boxes[o + 1] = y; boxes[o + 2] = w; boxes[o + 3] = h;
    nBoxes += 1;
  }
  function plate(x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    ctx.fill();
  }

  const stats = { level: "stage", visibleLessons: 0, labelledLessons: 0, visibleStages: 0, visibleChapters: 0 };
  function draw() {
    const t0 = performance.now();
    drawCount += 1;
    const s = cam.s;
    const m = G;
    const aStage = 1 - smooth(STAGE_OUT[0], STAGE_OUT[1], s);
    const aLesson = smooth(LESSON_IN[0], LESSON_IN[1], s);
    const aChapter = (1 - aStage) * (1 - aLesson);
    const aNodes = smooth(0.2, 0.32, s); // 膠囊（不帶字）從章那一層就開始淡入：拉近時不會突然冒出來
    stats.level = aStage >= 0.5 ? "stage" : aLesson >= 0.5 ? "lesson" : "chapter";
    const dim = sel >= 0;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = pal.paper;
    ctx.fillRect(0, 0, vw, vh);
    // 世界座標
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * cam.tx, dpr * cam.ty);
    const wx0 = -cam.tx / s;
    const wy0 = -cam.ty / s;
    const wx1 = (vw - cam.tx) / s;
    const wy1 = (vh - cam.ty) / s;

    // Stage 框
    ctx.lineWidth = 1 / s;
    ctx.fillStyle = pal.stageFill;
    ctx.fill(m.pathStageMain);
    ctx.strokeStyle = pal.stageStroke;
    ctx.stroke(m.pathStageMain);
    ctx.fillStyle = pal.branchFill;
    ctx.fill(m.pathStageBranch);
    ctx.strokeStyle = pal.branchStroke;
    ctx.setLineDash(m.dashFor(s));
    ctx.stroke(m.pathStageBranch);
    ctx.setLineDash(m.noDash);
    // 整個 Stage 都完成：金框（專注模式不畫，見 buildNodes）
    if (N.stageGold) {
      ctx.lineWidth = 3 / s;
      ctx.strokeStyle = pal.gold;
      ctx.stroke(N.stageGold);
    }
    // 章框＋章的進度條（框頂、章名底下的一條細線）
    if (aNodes > 0.01) {
      ctx.globalAlpha = aNodes;
      ctx.fillStyle = pal.chapterFill;
      ctx.fill(m.pathChapters);
      ctx.strokeStyle = pal.chapterStroke;
      ctx.lineWidth = 1 / s;
      ctx.stroke(m.pathChapters);
      ctx.fillStyle = pal.line;
      ctx.fill(N.chTrack);
      ctx.fillStyle = pal.green;
      ctx.fill(N.chBar);
    }

    // 邊：Stage 層 → 章層 → 課層，各自淡入淡出
    if (aStage > 0.01) {
      ctx.globalAlpha = aStage;
      ctx.strokeStyle = pal.edgeHeavy;
      const widths = m.stageEdgeWidths;
      for (let k = 0; k < 3; k += 1) { ctx.lineWidth = widths[k] / s; ctx.stroke(m.stageEdgePaths[k]); }
    }
    if (aChapter > 0.01 && !dim) {
      ctx.globalAlpha = aChapter * 0.32;
      ctx.strokeStyle = pal.edgeHeavy;
      const widths = m.chapterEdgeWidths;
      for (let k = 0; k < 3; k += 1) { ctx.lineWidth = widths[k] / s; ctx.stroke(m.chapterEdgePaths[k]); }
    }
    const aEdges = dim ? Math.max(aNodes, aLesson) : aLesson;
    if (aEdges > 0.01) {
      ctx.globalAlpha = aEdges * (dim ? 0.16 : 0.45);
      ctx.strokeStyle = pal.edge;
      ctx.lineWidth = 1 / s;
      ctx.stroke(m.allEdges);
      if (dim) {
        ctx.globalAlpha = aEdges * 0.75;
        ctx.lineWidth = 1.5 / s;
        ctx.strokeStyle = pal.desc;
        ctx.stroke(hlDesc);
        ctx.globalAlpha = aEdges;
        ctx.lineWidth = 2.4 / s;
        ctx.strokeStyle = pal.anc;
        ctx.stroke(hlAnc);
        ctx.strokeStyle = pal.violet;
        ctx.lineWidth = 1.4 / s;
        ctx.setLineDash(m.dashFor(s));
        ctx.stroke(hlRel);
        ctx.setLineDash(m.noDash);
      }
    }
    // 目標那一串（還沒完成的先修 → 目標）的邊：章那一層就看得到
    const aGoal = Math.max(aNodes * 0.7, aLesson);
    if (!dim && N.goalEdges && aGoal > 0.01) {
      ctx.globalAlpha = aGoal * 0.7;
      ctx.lineWidth = 1.5 / s;
      ctx.strokeStyle = pal.violet;
      ctx.stroke(N.goalEdges);
    }

    // 課的膠囊：三種樣式（還遠／可以學／完成）× 兩層（被篩掉的淡、要看的亮）
    if (aNodes > 0.01) {
      const base = aNodes * (0.55 + 0.45 * aLesson);
      const near = aLesson > 0.5;
      for (let layer = 0; layer < 2; layer += 1) {
        if (!layer && !N.anyDim) continue;
        const la = base * (dim ? 0.3 : 1) * (layer ? 1 : 0.3);
        const F = N.fill[layer];
        ctx.globalAlpha = la;
        ctx.lineWidth = 1.2 / s;
        ctx.fillStyle = near ? pal.farFill : pal.farBlob;
        ctx.fill(F[0]);
        ctx.fillStyle = near ? pal.nodeFill : pal.strong;
        ctx.fill(F[1]);
        ctx.fillStyle = near ? pal.doneFill : pal.doneBlob;
        ctx.fill(F[2]);
        ctx.globalAlpha = la * aLesson;
        ctx.strokeStyle = pal.farStroke;
        ctx.stroke(F[0]);
        ctx.strokeStyle = pal.nodeStroke;
        ctx.stroke(F[1]);
        ctx.strokeStyle = pal.doneStroke;
        ctx.stroke(F[2]);
        ctx.globalAlpha = la;
        ctx.lineWidth = 2 / s;
        ctx.strokeStyle = pal.blue;
        ctx.stroke(N.ring2[layer]);
        ctx.strokeStyle = pal.gold;
        ctx.stroke(N.ring3[layer]);
      }
      if (!dim) {
        ctx.globalAlpha = base * aLesson;
        ctx.fillStyle = pal.blue;
        ctx.fill(N.dots);
        ctx.globalAlpha = base;
        ctx.lineWidth = 1.6 / s;
        ctx.strokeStyle = pal.violet;
        ctx.stroke(N.goal);
        ctx.lineWidth = 3 / s;
        ctx.stroke(N.goalHead);
        ctx.lineWidth = 2.4 / s;
        ctx.strokeStyle = pal.red;
        ctx.stroke(N.red);
        if (N.next) { ctx.strokeStyle = pal.gold; ctx.stroke(N.next); }
      } else {
        // 亮起來的那一串再畫一次（實心、不淡）
        const hl = m.hlNodes;
        ctx.globalAlpha = base;
        ctx.lineWidth = 1.2 / s;
        ctx.fillStyle = pal.farFill;
        ctx.fill(hl[0]);
        ctx.strokeStyle = pal.farStroke;
        ctx.stroke(hl[0]);
        ctx.fillStyle = pal.nodeFill;
        ctx.fill(hl[1]);
        ctx.strokeStyle = pal.nodeStroke;
        ctx.stroke(hl[1]);
        ctx.fillStyle = pal.doneFill;
        ctx.fill(hl[2]);
        ctx.strokeStyle = pal.doneStroke;
        ctx.stroke(hl[2]);
        ctx.lineWidth = 2 / s;
        ctx.strokeStyle = pal.blue;
        ctx.stroke(hl[3]);
        ctx.strokeStyle = pal.gold;
        ctx.stroke(hl[4]);
        ctx.lineWidth = 3 / s;
        ctx.strokeStyle = pal.ink;
        ctx.stroke(hl[5]);
      }
    }

    // 課的字（世界座標，跟著縮放；太小就不畫）
    let visibleLessons = 0;
    let labelled = 0;
    const hw = m.NW / 2;
    for (let i = 0; i < m.n; i += 1) {
      const x = m.lx[i];
      const y = m.ly[i];
      if (x + hw < wx0 || x - hw > wx1 || y + 20 < wy0 || y - 20 > wy1) continue;
      visibleLessons += 1;
    }
    if (aLesson > 0.01 && s * 13 >= 6) {
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      const lab = labels;
      for (let pass = 0; pass < 2; pass += 1) {
        // 第一輪畫淡的、第二輪畫亮起來的（有選取時）
        if (pass === 1 && !dim) break;
        const alpha = aLesson * (dim && pass === 0 ? 0.35 : 1);
        for (let i = 0; i < m.n; i += 1) {
          if (dim && (pass === 0) === (mark[i] > 0)) continue;
          const x = m.lx[i];
          const y = m.ly[i];
          if (x + hw < wx0 || x - hw > wx1 || y + 20 < wy0 || y - 20 > wy1) continue;
          const L = lab[i];
          ctx.globalAlpha = emph[i] || dim ? alpha : alpha * 0.4;
          ctx.font = F_LESSON_NO;
          ctx.fillStyle = pal.muted;
          ctx.fillText(L.no, x - hw + 12, y + 0.5);
          ctx.font = F_LESSON;
          ctx.fillStyle = sty[i] ? pal.ink : pal.muted;
          ctx.fillText(L.title, x - hw + 12 + L.noW + 5, y + 0.5);
          labelled += 1;
        }
      }
      // 章名（課這一層：寫在章框的頂端，世界座標）
      ctx.globalAlpha = aLesson * (dim ? 0.5 : 1);
      ctx.font = F_CHAPTER_W;
      ctx.fillStyle = pal.muted;
      for (let ci = 0; ci < m.chapterBoxes.length; ci += 1) {
        const b = m.chapterBoxes[ci];
        if (b[0] > wx1 || b[0] + b[2] < wx0 || b[1] > wy1 || b[1] + 40 < wy0) continue;
        ctx.fillText(chapterLabel[ci].full, b[0] + 10, b[1] + 17);
      }
    }
    stats.visibleLessons = visibleLessons;
    stats.labelledLessons = labelled;

    // 螢幕座標的字：Stage 標籤（拉遠是置中的大標，拉近變成黏在框左上角的小標）、章標籤（章這一層）
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nBoxes = 0;
    ctx.textBaseline = "middle";
    let visibleStages = 0;
    for (let si = 0; si < m.stageBoxes.length; si += 1) {
      const b = m.stageBoxes[si];
      const x0 = b[0] * s + cam.tx;
      const y0 = b[1] * s + cam.ty;
      const bw = b[2] * s;
      const bh = b[3] * s;
      if (x0 > vw || x0 + bw < 0 || y0 > vh || y0 + bh < 0) continue;
      visibleStages += 1;
      const L = stageLabel[si];
      if (aStage > 0.01) {
        // 拉遠的標籤：圓圈裡是 Stage 編號，旁邊是名字與進度。依序試框的中間、上緣、下緣；
        // 名字放不下就只放圓圈；圓圈也放不下就不放（框還在）。字之間不會疊。
        ctx.globalAlpha = aStage;
        const cx = x0 + bw / 2;
        const full = L.w + 34;
        const tall = bh > 76;
        let cy = -1;
        let wide = false;
        for (let k = 0; k < 6 && cy < 0; k += 1) {
          const y = k % 3 === 0 ? y0 + bh / 2 : k % 3 === 1 ? (tall ? y0 + 20 : -99) : (tall ? y0 + bh - 20 : -99);
          if (y < -50) continue;
          const w = k < 3 ? full : 28;
          if (freeSpot(cx - w / 2, y - 15, w, 30)) { cy = y; wide = k < 3; take(cx - w / 2, y - 15, w, 30); }
        }
        if (cy >= 0) {
          const left = wide ? cx - full / 2 : cx - 14;
          ctx.strokeStyle = L.branch ? pal.violet : pal.strong;
          ctx.lineWidth = 1.5;
          if (wide) {
            ctx.fillStyle = pal.plate;
            plate(left, cy - 15, full, 30, 15);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(left + 14, cy, 11.5, 0, Math.PI * 2);
          ctx.fillStyle = L.done ? pal.green : pal.panel;
          ctx.fill();
          ctx.stroke();
          ctx.textAlign = "center";
          ctx.font = F_STAGE_NO;
          ctx.fillStyle = L.done ? pal.panel : pal.ink;
          ctx.fillText(L.n, left + 14, cy + 0.5);
          if (wide) {
            ctx.textAlign = "left";
            ctx.font = F_LABEL;
            ctx.fillStyle = pal.ink;
            ctx.fillText(L.title, left + 31, cy + 0.5);
            ctx.font = F_SMALL;
            ctx.fillStyle = L.branch ? pal.violet : pal.muted;
            ctx.fillText(L.tail, left + 31 + L.titleW + 6, cy + 0.5);
          }
        }
      }
      if (aStage < 0.99) {
        // 黏著的小標：框的左上角，框的左邊捲出畫面時黏在畫面左邊
        ctx.globalAlpha = (1 - aStage) * (dim ? 0.6 : 1);
        const w = L.w + 30;
        const lx = Math.min(Math.max(x0 + 10, 8), x0 + bw - w - 8);
        const ly = Math.min(Math.max(y0 + 10, 8), y0 + bh - 34);
        if (lx >= x0 - 1 && ly >= y0 - 1) {
          ctx.fillStyle = pal.plate;
          plate(lx, ly, w, 24, 12);
          ctx.textAlign = "left";
          ctx.font = F_STAGE_NO;
          ctx.fillStyle = L.branch ? pal.violet : pal.muted;
          ctx.fillText(L.n, lx + 9, ly + 12.5);
          ctx.font = F_LABEL;
          ctx.fillStyle = pal.ink;
          ctx.fillText(L.title, lx + 15 + L.nW, ly + 12.5);
          ctx.font = F_SMALL;
          ctx.fillStyle = L.branch ? pal.violet : pal.muted;
          ctx.fillText(L.tail, lx + 15 + L.nW + L.titleW + 6, ly + 12.5);
          take(lx, ly, w, 24);
        }
      }
    }
    stats.visibleStages = visibleStages;
    let visibleChapters = 0;
    if (aChapter > 0.01) {
      ctx.globalAlpha = aChapter * (dim ? 0.55 : 1);
      ctx.textAlign = "center";
      const pitch = (m.NW + 68) * s;
      for (let ci = 0; ci < m.chapterBoxes.length; ci += 1) {
        const b = m.chapterBoxes[ci];
        const x0 = b[0] * s + cam.tx;
        const y0 = b[1] * s + cam.ty;
        const bw = b[2] * s;
        const bh = b[3] * s;
        if (x0 > vw || x0 + bw < 0 || y0 > vh || y0 + bh < 0) continue;
        visibleChapters += 1;
        const L = chapterLabel[ci];
        const cx = x0 + bw / 2;
        const cy = Math.min(Math.max(y0 + 22, 50), y0 + bh - 20);
        const useFull = L.w + 16 <= pitch;
        const w = (useFull ? L.w : L.codeW) + 16;
        if (!freeSpot(cx - w / 2, cy - 18, w, 36)) continue;
        take(cx - w / 2, cy - 18, w, 36);
        ctx.fillStyle = pal.panel;
        plate(cx - w / 2, cy - 18, w, 36, 8);
        ctx.strokeStyle = pal.line;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = F_LABEL;
        ctx.fillStyle = pal.ink;
        ctx.fillText(useFull ? L.title : L.code, cx, cy - 6);
        ctx.font = F_SMALL;
        ctx.fillStyle = L.done === L.total ? pal.green : pal.muted;
        ctx.fillText(L.count, cx, cy + 9);
      }
    }
    stats.visibleChapters = visibleChapters;
    if (lit) {
      const p = Math.min(1, (performance.now() - lit.t0) / LIT_MS);
      const still = reduced();
      const grow = still ? 4 : 4 + 22 * p;
      const w = m.NW * s;
      const h = m.NH * s;
      ctx.globalAlpha = still ? 1 : 1 - p * p;
      ctx.lineWidth = still ? 3 : 3 + 2 * (1 - p);
      ctx.strokeStyle = pal.gold;
      ctx.beginPath();
      const x = m.lx[lit.i] * s + cam.tx - w / 2 - grow;
      const y = m.ly[lit.i] * s + cam.ty - h / 2 - grow;
      if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w + 2 * grow, h + 2 * grow, h / 2 + grow);
      else ctx.rect(x, y, w + 2 * grow, h + 2 * grow);
      // 這一課把整章／整個 Stage 做完了：框也亮一次（同一圈金色、同一個節奏）
      for (let k = 0; k < 2; k += 1) {
        const b = k ? (lit.si >= 0 ? m.stageBoxes[lit.si] : null) : (lit.ci >= 0 ? m.chapterBoxes[lit.ci] : null);
        if (!b) continue;
        const g = grow * 0.6;
        const bx = b[0] * s + cam.tx - g;
        const by = b[1] * s + cam.ty - g;
        if (typeof ctx.roundRect === "function") ctx.roundRect(bx, by, b[2] * s + 2 * g, b[3] * s + 2 * g, 12 + g);
        else ctx.rect(bx, by, b[2] * s + 2 * g, b[3] * s + 2 * g);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    lastDrawMs = performance.now() - t0;
  }

  // 給測試與無障礙：目前在哪一層、相機、選了誰（寫在 host 的 data-*，閒下來才寫，不在每格碰 DOM）
  function publish() {
    if (!host) return;
    host.dataset.level = stats.level;
    host.dataset.scale = cam.s.toFixed(3);
    host.dataset.transform = `${cam.s.toFixed(4)},${cam.tx.toFixed(1)},${cam.ty.toFixed(1)}`;
    host.dataset.selected = sel >= 0 ? opts.lessons[sel].id : "";
  }

  /* ── 選取：祖先與子孫 ── */
  function select(i, how) {
    sel = i;
    mark.fill(0);
    ancCount = 0;
    descCount = 0;
    hlAnc = new Path2D();
    hlDesc = new Path2D();
    hlRel = new Path2D();
    const hl = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    G.hlNodes = hl;
    if (i < 0) { renderCard(); request(); return; }
    // 祖先：往先修走到底
    const stackA = [i];
    while (stackA.length) {
      const v = stackA.pop();
      G.preds[v].forEach((p) => { if (!(mark[p] & 1)) { mark[p] |= 1; ancCount += 1; stackA.push(p); } });
    }
    const stackD = [i];
    while (stackD.length) {
      const v = stackD.pop();
      G.succs[v].forEach((c) => { if (!(mark[c] & 2)) { mark[c] |= 2; descCount += 1; stackD.push(c); } });
    }
    mark[i] = 3;
    const d = G.data;
    for (let k = 0; k < d.pre.length; k += 2) {
      const a = d.pre[k];
      const b = d.pre[k + 1];
      if ((mark[a] & 1) && (b === i || (mark[b] & 1) && mark[b] !== 3)) edgePath(hlAnc, G, a, b);
      else if ((mark[b] & 2) && (a === i || (mark[a] & 2) && mark[a] !== 3)) edgePath(hlDesc, G, a, b);
    }
    G.rel[i].forEach((r) => {
      const ax = G.lx[i];
      const bx = G.lx[r];
      hlRel.moveTo(ax, G.ly[i]);
      hlRel.bezierCurveTo((ax + bx) / 2, G.ly[i] - 60, (ax + bx) / 2, G.ly[r] - 60, bx, G.ly[r]);
      mark[r] = mark[r] || 4;
    });
    const hw = G.NW / 2;
    const hh = G.NH / 2;
    for (let v = 0; v < G.n; v += 1) {
      if (!mark[v]) continue;
      roundRect(hl[sty[v]], G.lx[v] - hw, G.ly[v] - hh, G.NW, G.NH, hh);
      // 亮起來的課只留熟練／全破的環（跟平常同一套顏色）；選中的那一課另外一圈深色
      if (tiers[v] >= 2) roundRect(hl[tiers[v] === 2 ? 3 : 4], G.lx[v] - hw - 3.5, G.ly[v] - hh - 3.5, G.NW + 7, G.NH + 7, hh + 3.5);
      if (mark[v] === 3) roundRect(hl[5], G.lx[v] - hw - 5, G.ly[v] - hh - 5, G.NW + 10, G.NH + 10, hh + 5);
    }
    renderCard();
    announce(i);
    if (how === "key" || how === "focus") {
      const ay = card && !card.hidden ? Math.max(120, (vh - card.offsetHeight) / 2) : vh / 2;
      flyTo(G.lx[i], G.ly[i], Math.max(cam.s, 0.95), vw / 2, ay);
    }
    request();
  }

  function statusText(i) {
    const L = opts.lessons[i];
    if (!L.available) return "尚未開放";
    return ["", "完成", "熟練", "全破"][tiers[i]] || (L.opened ? "讀過" : "還沒開始");
  }
  // 一課除了狀態以外的事：可以學、該練的理由、在不在目標那一串上（小卡、念出來、隱藏清單共用這一份）
  function tagsOf(i) {
    const out = [];
    if (sty[i] === 1) out.push("可以學");
    if (D.goal && D.goal.i === i) out.push(tiers[i] ? "目標（已完成）" : "目標");
    else if (D.goalMark[i]) out.push("目標要先學");
    return out;
  }
  function renderCard() {
    if (!card) return;
    if (sel < 0) { card.hidden = true; card.innerHTML = ""; return; }
    const L = opts.lessons[sel];
    const esc = opts.escapeHtml;
    const attr = opts.escapeAttr;
    const minutes = L.available ? `<span>閱讀 ${L.read} 分</span><span>完成 ${L.total} 分</span>` : "";
    const ids = D.ids[sel];
    const why = D.why[sel];
    const isGoal = D.goal && D.goal.i === sel;
    card.innerHTML = `
      <p class="cmap-card-kicker">${esc(L.no)} · ${esc(L.stageTitle)}${L.branch ? "（支線）" : ""}</p>
      <h3>${esc(L.title)}</h3>
      <p class="cmap-card-meta">${minutes}<span class="cmap-tier t${tiers[sel]}">${statusText(sel)}</span>${tagsOf(sel).map((x) => `<span class="cmap-tag${x === "可以學" ? "" : " is-goal"}">${x}</span>`).join("")}</p>
      <p class="cmap-card-meta"><span><i class="cmap-key is-anc"></i>先修 ${ancCount} 課</span><span><i class="cmap-key is-desc"></i>後續 ${descCount} 課</span></p>
      ${why ? `<p class="cmap-why">${esc(why)}</p>` : ""}
      <div class="cmap-card-actions">
        ${ids ? `<button type="button" class="button ${why ? "home-primary" : "secondary"}" data-action="course-lesson-practice" data-lesson-id="${attr(L.id)}" data-ids="${attr(ids.join(" "))}">練這課 ${ids.length} 題</button>` : ""}
        ${L.available ? `<button type="button" class="button ${why ? "secondary" : "home-primary"}" data-action="open-course-lesson" data-lesson-id="${attr(L.id)}">${tiers[sel] ? "打開這課" : "開始這課"}</button>` : ""}
        ${ancCount ? `<button type="button" class="button secondary" data-cmap="prereq">看先修</button>` : ""}
        ${isGoal ? `<button type="button" class="button ghost" data-action="course-goal" data-lesson-id="">清除目標</button>` : !tiers[sel] && L.available ? `<button type="button" class="button ghost" data-action="course-goal" data-lesson-id="${attr(L.id)}">設為目標</button>` : ""}
        <button type="button" class="button ghost cmap-close" data-cmap="close" aria-label="關閉">×</button>
      </div>`;
    card.hidden = false;
  }
  function detail(i) {
    return [statusText(i), ...tagsOf(i), D.why[i]].filter(Boolean).join("，");
  }
  function announce(i) {
    if (!live || i < 0) return;
    const L = opts.lessons[i];
    live.textContent = `${L.no} ${L.title}，${detail(i)}，先修 ${ancCount} 課、後續 ${descCount} 課`;
  }
  function showPrereqs() {
    if (sel < 0) return;
    let x0 = G.lx[sel];
    let x1 = x0;
    let y0 = G.ly[sel];
    let y1 = y0;
    for (let v = 0; v < G.n; v += 1) {
      if (!(mark[v] & 1) && v !== sel) continue;
      x0 = Math.min(x0, G.lx[v]); x1 = Math.max(x1, G.lx[v]);
      y0 = Math.min(y0, G.ly[v]); y1 = Math.max(y1, G.ly[v]);
    }
    const ay = card && !card.hidden ? Math.max(100, (vh - card.offsetHeight - 12) / 2) : vh / 2;
    // 整串先修放進畫面；但不拉遠到 Stage 那一層（那裡看不到亮起來的課）——放不下就讓選中的那一課留在畫面右側
    const w = x1 - x0 + G.NW + 48;
    const h = y1 - y0 + G.NH * 2 + 48;
    const sc = Math.max(0.34, Math.min(1, (vw - 24) / w, (ay * 2 - 24) / h));
    const half = (vw / 2 - 24) / sc;
    const cx = Math.max((x0 + x1) / 2, G.lx[sel] + G.NW / 2 - half);
    flyTo(cx, (y0 + y1) / 2, sc, vw / 2, ay);
  }

  /* ── 點到誰 ── */
  function hitLesson(px, py) {
    const wx = (px - cam.tx) / cam.s;
    const wy = (py - cam.ty) / cam.s;
    const slop = 6 / cam.s;
    const hw = G.NW / 2 + slop;
    const hh = G.NH / 2 + slop;
    for (let i = 0; i < G.n; i += 1) if (Math.abs(G.lx[i] - wx) <= hw && Math.abs(G.ly[i] - wy) <= hh) return i;
    return -1;
  }
  function hitBox(list, px, py) {
    const wx = (px - cam.tx) / cam.s;
    const wy = (py - cam.ty) / cam.s;
    for (let k = 0; k < list.length; k += 1) {
      const b = list[k];
      if (wx >= b[0] && wx <= b[0] + b[2] && wy >= b[1] && wy <= b[1] + b[3]) return k;
    }
    return -1;
  }
  function tap(px, py) {
    const level = stats.level;
    if (level === "stage") {
      const si = hitBox(G.stageBoxes, px, py);
      if (si >= 0) { const b = G.stageBoxes[si]; flyToBox(b[0], b[1], b[2], b[3], 0.42); return; }
      select(-1);
      return;
    }
    const i = cam.s >= 0.3 ? hitLesson(px, py) : -1;
    if (level === "chapter" && i < 0) {
      const ci = hitBox(G.chapterBoxes, px, py);
      if (ci >= 0) { const b = G.chapterBoxes[ci]; flyToBox(b[0] - 40, b[1], b[2] + 80, b[3], 1); return; }
    }
    if (i >= 0 && level !== "lesson") {
      select(i);
      flyTo(G.lx[i], G.ly[i], 1, vw / 2, card && !card.hidden ? Math.max(120, (vh - card.offsetHeight) / 2) : vh / 2);
      return;
    }
    select(i === sel ? -1 : i);
  }

  /* ── 指標：拖、慣性、捏、點、點兩下 ── */
  const pointers = new Map();
  const trail = new Float64Array(3 * 6); // 最近 6 個取樣（x, y, t）算放手時的速度
  let trailN = 0;
  let gesture = null; // { kind: "pan" | "pinch", ... }
  let downAt = { x: 0, y: 0, t: 0, moved: false, multi: false };
  let lastTap = { x: -99, y: -99, t: 0 };
  function local(e) {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  function pushTrail(x, y, t) {
    const k = trailN % 6;
    trail[3 * k] = x; trail[3 * k + 1] = y; trail[3 * k + 2] = t;
    trailN += 1;
  }
  function startPinch() {
    const [a, b] = [...pointers.values()];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    gesture = { kind: "pinch", d0: Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)), s0: cam.s, wx: (mx - cam.tx) / cam.s, wy: (my - cam.ty) / cam.s };
  }
  function onDown(e) {
    if (e.button !== undefined && e.button > 0 && e.pointerType === "mouse") return;
    stageEl.classList.remove("is-kbd");
    canvas.focus({ preventScroll: true });
    try { canvas.setPointerCapture(e.pointerId); } catch (_error) { /* 合成事件沒有 capture */ }
    const [x, y] = local(e);
    pointers.set(e.pointerId, { x, y });
    anim.on = false;
    inertia.on = false;
    if (pointers.size === 1) {
      gesture = { kind: "pan", lx: x, ly: y };
      downAt = { x, y, t: performance.now(), moved: false, multi: false };
      trailN = 0;
      pushTrail(x, y, performance.now());
    } else if (pointers.size === 2) {
      downAt.multi = true;
      startPinch();
    }
  }
  function onMove(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const list = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : null;
    const last = list && list.length ? list[list.length - 1] : e;
    const r = canvas.getBoundingClientRect();
    p.x = last.clientX - r.left;
    p.y = last.clientY - r.top;
    if (!gesture) return;
    if (gesture.kind === "pan" && pointers.size === 1) {
      const dx = p.x - gesture.lx;
      const dy = p.y - gesture.ly;
      if (!downAt.moved && Math.hypot(p.x - downAt.x, p.y - downAt.y) < (e.pointerType === "mouse" ? 4 : 9)) return;
      downAt.moved = true;
      gesture.lx = p.x;
      gesture.ly = p.y;
      cam.tx += dx;
      cam.ty += dy;
      clampCam();
      pushTrail(p.x, p.y, e.timeStamp || performance.now());
      request();
    } else if (gesture.kind === "pinch" && pointers.size >= 2) {
      const [a, b] = pointers.values();
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dist = Math.max(10, Math.hypot(a.x - b.x, a.y - b.y));
      cam.s = Math.min(MAX_SCALE, Math.max(minScale(), gesture.s0 * dist / gesture.d0));
      cam.tx = mx - gesture.wx * cam.s;
      cam.ty = my - gesture.wy * cam.s;
      clampCam();
      downAt.moved = true;
      request();
    }
  }
  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    const [x, y] = local(e);
    if (pointers.size === 1) {
      // 捏完剩一指：接著拖，不跳
      const rest = pointers.values().next().value;
      gesture = { kind: "pan", lx: rest.x, ly: rest.y };
      trailN = 0;
      return;
    }
    if (pointers.size) return;
    const was = gesture;
    gesture = null;
    if (e.type === "pointercancel") return;
    const now = performance.now();
    if (!downAt.moved && !downAt.multi && now - downAt.t < 600) {
      // 點兩下（300ms 內、附近）：放大兩倍；點一下：選課／飛進 Stage 或章
      if (now - lastTap.t < 320 && Math.hypot(x - lastTap.x, y - lastTap.y) < 30) {
        lastTap.t = 0;
        const factor = 2.2;
        flyTo((x - cam.tx) / cam.s, (y - cam.ty) / cam.s, cam.s * factor, x, y);
        return;
      }
      lastTap = { x, y, t: now };
      tap(x, y);
      return;
    }
    if (was && was.kind === "pan" && downAt.moved && !reduced() && trailN >= 2) {
      // 放手的速度：最近 100ms 內的取樣
      const newest = (trailN - 1) % 6;
      const tN = trail[3 * newest + 2];
      let oldest = newest;
      for (let k = 1; k < Math.min(trailN, 6); k += 1) {
        const idx = (newest - k + 6) % 6;
        if (tN - trail[3 * idx + 2] > 100) break;
        oldest = idx;
      }
      const dt = tN - trail[3 * oldest + 2];
      if (dt > 8 && performance.now() - tN < 80) {
        inertia.vx = (trail[3 * newest] - trail[3 * oldest]) / dt;
        inertia.vy = (trail[3 * newest + 1] - trail[3 * oldest + 1]) / dt;
        if (Math.hypot(inertia.vx, inertia.vy) > 0.12) {
          inertia.on = true;
          inertia.last = performance.now();
          request();
        }
      }
    }
    publish();
  }
  function onWheel(e) {
    e.preventDefault();
    anim.on = false;
    inertia.on = false;
    const [x, y] = local(e);
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh : 1;
    const dx = e.deltaX * unit;
    const dy = e.deltaY * unit;
    // 觸控板捏合（ctrlKey）與一般滑鼠滾輪 → 縮放；觸控板兩指滑動（有 deltaX 或小而不整的 deltaY）→ 平移
    const mouseWheel = e.deltaMode !== 0 || (dx === 0 && Math.abs(dy) >= 40 && Number.isInteger(dy));
    if (e.ctrlKey || mouseWheel) zoomAt(x, y, Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0018)));
    else { cam.tx -= dx; cam.ty -= dy; clampCam(); }
    request();
  }

  /* ── 鍵盤 ── */
  function nearestBy(list, from) {
    let best = -1;
    let bestD = Infinity;
    list.forEach((v) => {
      const dd = Math.abs(G.ly[v] - G.ly[from]) + Math.abs(G.lx[v] - G.lx[from]) * 0.2;
      if (dd < bestD) { bestD = dd; best = v; }
    });
    return best;
  }
  function centerLesson() {
    let best = 0;
    let bestD = Infinity;
    const cx = (vw / 2 - cam.tx) / cam.s;
    const cy = (vh / 2 - cam.ty) / cam.s;
    for (let i = 0; i < G.n; i += 1) {
      const dd = Math.hypot(G.lx[i] - cx, G.ly[i] - cy);
      if (dd < bestD) { bestD = dd; best = i; }
    }
    return best;
  }
  function onKey(e) {
    if (e.target !== canvas) return;
    stageEl.classList.add("is-kbd");
    const k = e.key;
    let next = -2;
    if (k === "ArrowRight" || k === "ArrowLeft" || k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      if (sel < 0) next = opts.next >= 0 && stats.level === "stage" ? opts.next : centerLesson();
      else if (k === "ArrowRight") next = nearestBy(G.succs[sel], sel);
      else if (k === "ArrowLeft") next = nearestBy(G.preds[sel], sel);
      else {
        // 同一章上下；到章的頭尾就找同一欄最近的那一課
        const dir = k === "ArrowDown" ? 1 : -1;
        let best = -1;
        let bestD = Infinity;
        for (let v = 0; v < G.n; v += 1) {
          if (Math.abs(G.lx[v] - G.lx[sel]) > 1) continue;
          const dy = (G.ly[v] - G.ly[sel]) * dir;
          if (dy > 0 && dy < bestD) { bestD = dy; best = v; }
        }
        next = best;
      }
      if (next >= 0) select(next, "key");
      return;
    }
    if (k === "Enter" && sel >= 0) {
      e.preventDefault();
      if (opts.lessons[sel].available) opts.open(opts.lessons[sel].id);
      return;
    }
    if (k === "Escape" && sel >= 0) { e.preventDefault(); select(-1); return; }
    if (k === "+" || k === "=" || k === "-" || k === "_") {
      e.preventDefault();
      const f = k === "+" || k === "=" ? 1.6 : 1 / 1.6;
      flyTo((vw / 2 - cam.tx) / cam.s, (vh / 2 - cam.ty) / cam.s, cam.s * f);
    }
  }

  /* ── 尺寸與主題 ── */
  function measure() {
    const r = stageEl.getBoundingClientRect();
    // 地圖高度：視窗剩下的高度（扣掉手機底部分頁列），不讓整頁需要捲才看得到地圖的下緣；
    // 「該練」的清單在地圖底下，也要在第一屏裡（地圖讓出它的高度，最矮 300）
    const nav = document.querySelector(".topbar-nav");
    const navTop = nav && nav.getBoundingClientRect().height && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().top : window.innerHeight;
    const list = host.querySelector(".cmap-list");
    const below = list ? list.offsetHeight + 8 : 0;
    const want = Math.max(below ? 300 : 360, Math.round(Math.min(navTop, window.innerHeight) - Math.max(0, r.top) - 12 - below));
    if (Math.abs(stageEl.offsetHeight - want) > 2) stageEl.style.height = `${want}px`;
    const w = Math.max(1, Math.round(stageEl.clientWidth));
    const h = Math.max(1, Math.round(stageEl.clientHeight));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    if (w === vw && h === vh && canvas.width === Math.round(w * dpr)) return false;
    // 保持畫面中心那一點不動
    const cx = vw ? (vw / 2 - cam.tx) / cam.s : 0;
    const cy = vh ? (vh / 2 - cam.ty) / cam.s : 0;
    const had = vw > 0;
    vw = w;
    vh = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    if (had && placed) { cam.tx = vw / 2 - cx * cam.s; cam.ty = vh / 2 - cy * cam.s; clampCam(); }
    return true;
  }

  function buildLabels() {
    const c = ctx;
    c.font = F_LESSON_NO;
    const noW = opts.lessons.map((L) => c.measureText(L.no).width);
    c.font = F_LESSON;
    labels = opts.lessons.map((L, i) => {
      const room = G.NW - 24 - noW[i] - 5;
      let title = L.title;
      if (c.measureText(title).width > room) {
        let lo = 0;
        let hi = title.length;
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          if (c.measureText(`${title.slice(0, mid)}…`).width <= room) lo = mid; else hi = mid - 1;
        }
        title = `${title.slice(0, lo).trimEnd()}…`;
      }
      return { no: L.no, title, noW: noW[i] };
    });
    stageLabel = opts.stages.map((st, si) => {
      const tail = `${st.branch ? "支線 · " : ""}${D.stDone[si]}/${D.stTotal[si]}`;
      c.font = F_STAGE_NO;
      const nW = c.measureText(String(st.n)).width;
      c.font = F_LABEL;
      const titleW = c.measureText(st.title).width;
      c.font = F_SMALL;
      const tailW = c.measureText(tail).width;
      return { n: String(st.n), title: st.title, tail, nW, titleW, w: nW + titleW + tailW + 12, branch: Boolean(st.branch), done: D.stComplete[si] };
    });
    const chapters = opts.stages.flatMap((st) => st.chapters);
    chapterLabel = chapters.map((ch, ci) => {
      c.font = F_LABEL;
      const w = c.measureText(ch.title).width;
      const codeW = c.measureText(ch.code).width;
      return { title: ch.title, code: ch.code, full: `${ch.code} ${ch.title}`, w, codeW, done: D.chDone[ci], total: D.chTotal[ci], count: `${D.chDone[ci]}/${D.chTotal[ci]}` };
    });
  }

  /* ── 這個人走到哪：點亮、可以學、目標、該練（打開地圖與紀錄變了才算一次，畫的時候不算）──
     「該練」只從既有的紀錄推，不另外記東西。門檻跟 planner／首頁同一套說法，改的時候兩邊一起看：
       錯題     推薦題還在 records.mistakes 裡（答錯進錯題本，連對才清掉）              →「上次錯 n 題」
       該複習   這課的主要技巧（≥ 一半的推薦題都掛著的技巧）被能力模型判成該回溫：跟首頁「技巧回溫」
                （app.js skillRefreshDue）同一條 —— 量過、精熟度 ≥ 45、dueAt 已過、最後一次碰在 7 天以前 →「n 天沒碰，該複習」
       常錯     推薦題累計作答 ≥ 3 次、答對率 < 60%                                      →「答對 x%」
                或主要技巧量過、精熟度 < 65（planner classify 的 weak，SOLID = 65）       →「〈技巧〉還不穩」
       還沒熟練 完成了、核心題還沒全對（課程表的「熟練」差在哪）                        →「核心題還差 n 題」
     一課只給一個理由（上面的順序就是優先序，也是「該練」清單的排序）。只看完成的課：還沒上的課該做的是「上」，不是「練」。
     「練這課」的題：還在錯題本的（到期的先）＋ 還沒答對過的非挑戰題；都沒有（只是該回溫）就整組非挑戰題再做一次。 */
  const DAY = 86400000;
  function goalPlan(g, isDone, minutesOf) {
    const n = G.n;
    const miss = new Uint8Array(n);
    const seen = new Uint8Array(n);
    const stack = [g];
    if (!isDone(g)) miss[g] = 1;
    while (stack.length) {
      G.preds[stack.pop()].forEach((p) => { if (!seen[p]) { seen[p] = 1; if (!isDone(p)) miss[p] = 1; stack.push(p); } });
    }
    // 拓撲順序（同時可以學的照大綱順序）：每次拿大綱裡最前面、先修都不缺的那一課
    const order = [];
    const left = miss.slice();
    let minutes = 0;
    for (let guard = 0; guard < n; guard += 1) {
      let pick = -1;
      for (let v = 0; v < n && pick < 0; v += 1) if (left[v] && G.preds[v].every((p) => !left[p])) pick = v;
      if (pick < 0) break;
      left[pick] = 0;
      order.push(pick);
      minutes += Number(minutesOf(pick)) || 0;
    }
    return { i: g, missing: order, minutes, first: order.length ? order[0] : -1, mark: miss };
  }
  function derive(o) {
    const n = G.n;
    const rec = o.records || {};
    const stats = rec.problemStats || {};
    const mistakes = rec.mistakes || {};
    const skills = (o.profile && o.profile.skills) || {};
    const now = o.now || Date.now();
    const d = G.data;
    const out = {
      lit: 0, mastered: 0, ready: 0, why: Array(n).fill(""), ids: Array(n).fill(null), practice: [], goal: null, goalMark: new Uint8Array(n),
      chDone: d.chapters.map(() => 0), chTotal: d.chapters.map(() => 0), stDone: d.stages.map(() => 0), stTotal: d.stages.map(() => 0)
    };
    sty = new Uint8Array(n);
    emph = new Uint8Array(n);
    for (let i = 0; i < n; i += 1) {
      const ci = G.chapterOf[i];
      const si = G.stageOfChapter[ci];
      out.chTotal[ci] += 1;
      out.stTotal[si] += 1;
      if (tiers[i]) {
        sty[i] = 2;
        out.lit += 1;
        out.chDone[ci] += 1;
        out.stDone[si] += 1;
        if (tiers[i] >= 2) out.mastered += 1;
      } else if (o.lessons[i].available && G.preds[i].every((p) => tiers[p])) {
        sty[i] = 1;
        out.ready += 1;
      }
    }
    out.chComplete = out.chDone.map((x, ci) => x > 0 && x === out.chTotal[ci]);
    out.stComplete = out.stDone.map((x, si) => x > 0 && x === out.stTotal[si]);
    for (let i = 0; i < n; i += 1) {
      const P = o.lessons[i].practice || [];
      if (!tiers[i] || !P.length) continue;
      const solved = (id) => Boolean(stats[id] && stats[id].correct > 0);
      const wrong = [];
      const fresh = [];
      const easy = [];
      const hits = {};
      let tot = 0;
      let cor = 0;
      P.forEach((p) => {
        const st = stats[p.id];
        const mk = mistakes[p.id];
        if (mk) wrong.push([p.id, mk.srs && Number.isFinite(Number(mk.srs.dueAt)) ? Number(mk.srs.dueAt) : 0]);
        if (st) { tot += Number(st.total) || 0; cor += Number(st.correct) || 0; }
        if (p.kind !== "challenge") { easy.push(p.id); if (!mk && !solved(p.id)) fresh.push(p.id); }
        (o.skillsOf ? o.skillsOf(p.id) : []).forEach((sid) => { hits[sid] = (hits[sid] || 0) + 1; });
      });
      const core = P.some((p) => p.kind === "core") ? P.filter((p) => p.kind === "core") : P.filter((p) => p.kind !== "challenge");
      let refresh = null;
      let weak = null;
      Object.keys(hits).forEach((sid) => {
        const e = skills[sid];
        if (hits[sid] * 2 < P.length || !e || !e.measured || e.mastery === null || e.mastery === undefined || e.subject === "science") return;
        if (e.mastery >= 45 && e.dueAt && e.dueAt <= now && e.lastAt && now - e.lastAt >= 7 * DAY && (!refresh || e.lastAt < refresh.lastAt)) refresh = e;
        if (e.mastery < 65 && (!weak || e.mastery < weak.mastery)) weak = e;
      });
      wrong.sort((a, b) => a[1] - b[1]);
      const ids = wrong.map((w) => w[0]).concat(fresh);
      out.ids[i] = (ids.length ? ids : easy.length ? easy : P.map((p) => p.id)).slice(0, 10);
      let why = "";
      let score = 0;
      if (wrong.length) { why = `上次錯 ${wrong.length} 題`; score = 400 + wrong.length; }
      else if (refresh) { const days = Math.floor((now - refresh.lastAt) / DAY); why = `${days} 天沒碰，該複習`; score = 300 + Math.min(99, days) / 100; }
      else if (tot >= 3 && cor / tot < 0.6) { why = `答對 ${Math.round((100 * cor) / tot)}%`; score = 201 - cor / tot; }
      else if (weak) { why = `「${weak.label || weak.id}」還不穩`; score = 100 + (65 - weak.mastery) / 100; }
      else if (tiers[i] === 1) { why = `核心題還差 ${core.filter((p) => !solved(p.id)).length} 題`; score = 1; }
      if (!why) continue;
      out.why[i] = why;
      out.practice.push({ i, why, score });
    }
    out.practice.sort((a, b) => b.score - a.score || a.i - b.i);
    const gi = o.goal ? o.lessons.findIndex((L) => L.id === o.goal) : -1;
    if (gi >= 0) {
      out.goal = goalPlan(gi, (v) => tiers[v] > 0, (v) => o.lessons[v].total);
      out.goalMark = out.goal.mark;
    }
    const f = o.filter;
    for (let i = 0; i < n; i += 1) emph[i] = f === "ready" ? (sty[i] === 1 ? 1 : 0) : f === "practice" ? (out.why[i] ? 1 : 0) : 1;
    return out;
  }

  function buildNodes() {
    const hw = G.NW / 2;
    const hh = G.NH / 2;
    const P = () => new Path2D();
    N = { fill: [[P(), P(), P()], [P(), P(), P()]], ring2: [P(), P()], ring3: [P(), P()], dots: P(), goal: P(), goalHead: P(), red: P(), next: null, goalEdges: null, stageGold: null, chTrack: P(), chBar: P(), anyDim: false };
    const ring = (path, i, off) => roundRect(path, G.lx[i] - hw - off, G.ly[i] - hh - off, G.NW + 2 * off, G.NH + 2 * off, hh + off);
    for (let i = 0; i < G.n; i += 1) {
      const t = tiers[i];
      const layer = emph[i];
      if (!layer) N.anyDim = true;
      roundRect(N.fill[layer][sty[i]], G.lx[i] - hw, G.ly[i] - hh, G.NW, G.NH, hh);
      if (t >= 2) ring(t === 2 ? N.ring2[layer] : N.ring3[layer], i, 3.5);
      // 可以學：膠囊右端一個小點（課名截字時右邊留了 12px，點放得下、不壓字）
      if (sty[i] === 1 && layer) { N.dots.moveTo(G.lx[i] + hw - 5, G.ly[i]); N.dots.arc(G.lx[i] + hw - 8, G.ly[i], 3, 0, Math.PI * 2); }
      if (D.goal && D.goal.i === i) ring(N.goalHead, i, 6);
      else if (D.goalMark[i]) ring(N.goal, i, 3.5);
      if (opts.filter === "practice" && D.why[i]) ring(N.red, i, 3.5);
    }
    if (opts.next >= 0) { N.next = P(); ring(N.next, opts.next, 3.5); }
    if (D.goal) {
      const pre = G.data.pre;
      N.goalEdges = P();
      for (let k = 0; k < pre.length; k += 2) if (D.goalMark[pre[k]] && (D.goalMark[pre[k + 1]] || pre[k + 1] === D.goal.i)) edgePath(N.goalEdges, G, pre[k], pre[k + 1]);
    }
    // 整個 Stage 完成的金框是獎勵：專注模式（不顯示連勝／成就）照樣算、不畫
    if (!opts.quiet && D.stComplete.some(Boolean)) {
      N.stageGold = P();
      G.stageBoxes.forEach((b, si) => { if (D.stComplete[si]) roundRect(N.stageGold, b[0], b[1], b[2], b[3], 22); });
    }
    G.chapterBoxes.forEach((b, ci) => {
      N.chTrack.rect(b[0] + 10, b[1] + 27, b[2] - 20, 3.5);
      if (D.chDone[ci]) N.chBar.rect(b[0] + 10, b[1] + 27, ((b[2] - 20) * D.chDone[ci]) / D.chTotal[ci], 3.5);
    });
    G.pathStageMain = new Path2D();
    G.pathStageBranch = new Path2D();
    G.stageBoxes.forEach((b, si) => roundRect(opts.stages[si].branch ? G.pathStageBranch : G.pathStageMain, b[0], b[1], b[2], b[3], 22));
    G.pathChapters = new Path2D();
    G.chapterBoxes.forEach((b) => roundRect(G.pathChapters, b[0], b[1], b[2], b[3], 12));
  }

  // 螢幕閱讀器用的清單：Stage → 章 → 課（狀態、可以學、該練的理由、目標、先修）。看不見、也不是按鈕
  //（打開課用地圖的 Enter 或清單檢視）。跟小卡、方向鍵念出來的是同一份字（detail）。
  function srList() {
    const esc = opts.escapeHtml;
    let i = 0;
    let ci = -1;
    const items = opts.stages.map((st, si) => `<li>${esc(`${st.n} ${st.title}${st.branch ? "（支線）" : ""}，${D.stDone[si]}/${D.stTotal[si]}`)}<ol>${st.chapters.map((ch) => {
      ci += 1;
      return `<li>${esc(`${ch.title}，${D.chDone[ci]}/${D.chTotal[ci]}`)}<ol>${ch.lessons.map(() => {
        const L = opts.lessons[i];
        const pre = G.preds[i].map((p) => opts.lessons[p].no).join("、");
        i += 1;
        return `<li>${esc(`${L.no} ${L.title}，${detail(i - 1)}${pre ? `，先修 ${pre}` : ""}`)}</li>`;
      }).join("")}</ol></li>`;
    }).join("")}</ol></li>`).join("");
    return `<div class="sr-only"><ol aria-label="課程地圖（清單）">${items}</ol></div>`;
  }

  // 地圖上面那一列（點亮幾課、篩選）、目標那一列、「該練」的清單（地圖底下，一點就練）
  function chrome() {
    const esc = opts.escapeHtml;
    const attr = opts.escapeAttr;
    const f = opts.filter;
    const name = (i) => `${opts.lessons[i].no} ${opts.lessons[i].title}`;
    const chip = (key, label, count, dot) => `<button type="button" data-action="course-map-filter" data-mode="${key}" aria-pressed="${f === key}">${dot ? `<i class="cmap-dot${dot}"></i>` : ""}${label}${count ? ` ${count}` : ""}</button>`;
    const g = D.goal;
    const goal = g ? `<p class="cmap-goal"><span>目標 <b>${esc(name(g.i))}</b> ${g.missing.length
      ? `<small title="每課「完成」分鐘數加總">還差 ${g.missing.length} 課 · 約 ${g.minutes} 分鐘</small></span><button type="button" class="button secondary" data-action="open-course-lesson" data-lesson-id="${attr(opts.lessons[g.first].id)}">照順序學</button>`
      : "<small>完成了</small></span>"}<button type="button" class="button ghost" data-action="course-goal" data-lesson-id="" aria-label="清除目標" title="清除目標">×</button></p>` : "";
    const top = D.practice.slice(0, 5);
    const list = f !== "practice" ? "" : `<div class="cmap-list">${top.length ? `<ol class="cmap-todo">${top.map(({ i, why }) => `<li><button type="button" data-action="course-lesson-practice" data-lesson-id="${attr(opts.lessons[i].id)}" data-ids="${attr(D.ids[i].join(" "))}"><strong>${esc(name(i))}</strong><small>${esc(why)}</small><em>練 ${D.ids[i].length} 題</em></button></li>`).join("")}</ol>` : `<p class="cmap-empty">現在沒有該練的課</p>`}</div>`;
    return {
      bar: `<div class="cmap-bar"><div class="cmap-chips" role="group" aria-label="篩選">${chip("all", "全部", 0, "")}${chip("ready", "可以學", D.ready, " ")}${chip("practice", "該練", D.practice.length, " is-red")}</div>${goal}</div>`,
      list
    };
  }
  function sayFor(what) {
    if (what === "filter") {
      const f = opts.filter;
      if (f === "ready") return `可以學 ${D.ready} 課`;
      if (f === "practice") return D.practice.length ? `該練 ${D.practice.length} 課：${D.practice.slice(0, 3).map((p) => `${opts.lessons[p.i].title}，${p.why}`).join("；")}` : "現在沒有該練的課";
      return `全部 ${G.n} 課，已點亮 ${D.lit} 課`;
    }
    if (what === "goal") return D.goal ? `目標 ${opts.lessons[D.goal.i].title}，還差 ${D.goal.missing.length} 課，約 ${D.goal.minutes} 分鐘` : "已清除目標";
    return "";
  }

  function teardown() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (ro) ro.disconnect();
    if (mo) mo.disconnect();
    ro = null;
    mo = null;
    pointers.clear();
    gesture = null;
    host = null;
    stageEl = null;
    canvas = null;
    ctx = null;
    card = null;
    live = null;
  }

  function ensureModel() {
    if (G) return;
    G = buildModel(window.BUZZ_COURSE_MAP);
    G.noDash = [];
    const dashes = new Map();
    G.dashFor = (s) => {
      // 虛線的長度跟著縮放換算（只有幾種倍率會出現，算過的留著，不在每格產生新陣列）
      const key = Math.round(Math.log(s) * 8);
      if (!dashes.has(key)) { const u = 1 / Math.exp(key / 8); dashes.set(key, [6 * u, 5 * u]); }
      return dashes.get(key);
    };
    G.stageEdgeWidths = [1.2, 2, 3.2];
    G.chapterEdgeWidths = [1, 1.6, 2.4];
    buildGeometry(G);
    mark = new Uint8Array(G.n);
  }

  /* ── 對外：掛到一個容器上（app 整頁重繪會換掉容器，所以每次重繪後重掛；相機與選取留著）── */
  function attach(target, options) {
    const data = window.BUZZ_COURSE_MAP;
    if (!target || !data) return false;
    if (host && host !== target) teardown();
    opts = options;
    ensureModel();
    if (opts.lessons.length !== G.n) return false;
    tiers = Uint8Array.from(opts.lessons.map((L) => L.tier || 0));
    D = derive(opts);
    host = target;
    injectStyle();
    const ui = chrome();
    host.innerHTML = `${ui.bar}
      <div class="cmap-stage">
        <canvas class="cmap-canvas" tabindex="0" role="application" aria-roledescription="課程地圖" aria-label="課程地圖：方向鍵在相連的課之間移動，Enter 打開"></canvas>
        <div class="cmap-zoom" aria-hidden="true"><button type="button" data-cmap="in" tabindex="-1">+</button><button type="button" data-cmap="out" tabindex="-1">−</button></div>
        <div class="cmap-card" hidden></div>
      </div>
      ${ui.list}
      <p class="sr-only" aria-live="polite"></p>
      ${srList()}`;
    stageEl = host.querySelector(".cmap-stage");
    canvas = host.querySelector("canvas");
    card = host.querySelector(".cmap-card");
    live = host.querySelector("[aria-live]");
    ctx = canvas.getContext("2d", { alpha: false });
    readPalette();
    buildLabels();
    buildNodes();
    measure();
    if (!placed) {
      placed = true;
      if (D.lit && opts.next >= 0) {
        // 有進度：直接停在下一課（課那一層，看得到它前後的課）
        cam.s = 0.8;
        cam.tx = vw / 2 - G.lx[opts.next] * cam.s;
        cam.ty = vh / 2 - G.ly[opts.next] * cam.s;
      } else {
        // 新的人：整張圖放得下就看整張；窄螢幕（手機）看整張字會擠成一團，改成「高度放滿」——
        // 還在 Stage 那一層、字讀得到，左右滑看其他 Stage；從目前要上的那一課所在的 Stage 開始
        cam.s = Math.max(fitScale(), Math.min(0.19, (vh - 40) / (H() + 80)));
        const at = opts.next >= 0 ? opts.next : 0;
        const b = G.stageBoxes[G.stageOfChapter[G.chapterOf[at]]];
        cam.tx = vw / 2 - (b[0] + b[2] / 2) * cam.s;
        cam.ty = vh / 2 - (H() / 2) * cam.s;
      }
      clampCam();
    }
    clampCam();
    // 選取接回來（重繪前選了誰，回來還是它）
    if (sel >= 0) select(sel); else select(-1);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onKey);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    host.addEventListener("click", (e) => {
      // 篩選與目標會讓整頁重繪：記下焦點在哪、要念什麼，重掛之後還回去（這個 listener 比 app 的先跑）
      const act = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
      // 換篩選：選取收起來（被篩掉的那一課留著小卡只會擋路）
      if (act && act.dataset.action === "course-map-filter") sel = -1;
      if (act && act.dataset.action === "course-map-filter") pending = { focus: `[data-action="course-map-filter"][data-mode="${act.dataset.mode}"]`, say: "filter" };
      if (act && act.dataset.action === "course-goal") pending = { focus: act.closest(".cmap-card") ? '.cmap-card [data-action="course-goal"]' : ".cmap-canvas", say: "goal" };
      const b = e.target && e.target.closest ? e.target.closest("[data-cmap]") : null;
      if (!b) return;
      const what = b.dataset.cmap;
      if (what === "close") { select(-1); canvas.focus({ preventScroll: true }); }
      if (what === "prereq") showPrereqs();
      if (what === "in" || what === "out") flyTo((vw / 2 - cam.tx) / cam.s, (vh / 2 - cam.ty) / cam.s, cam.s * (what === "in" ? 1.8 : 1 / 1.8));
    });
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(() => { if (host && measure()) request(); });
      ro.observe(host);
    }
    mo = new MutationObserver(() => { readPalette(); request(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (options.focusId) {
      const i = opts.lessons.findIndex((L) => L.id === options.focusId);
      if (i >= 0) {
        // 從一課的「在地圖上看」進來：先停在拉遠一點的地方，再飛進那一課
        if (!reduced()) { cam.s = Math.max(fitScale(), 0.3); cam.tx = vw / 2 - G.lx[i] * cam.s; cam.ty = vh / 2 - G.ly[i] * cam.s; clampCam(); }
        select(i, "focus");
        canvas.focus({ preventScroll: true });
      }
    }
    if (options.litId) {
      const i = opts.lessons.findIndex((L) => L.id === options.litId);
      if (i >= 0) {
        const ci = G.chapterOf[i];
        const si = G.stageOfChapter[ci];
        // 整章／整個 Stage 剛好被這一課做完：框也亮一次（專注模式不放這個獎勵，照樣念出來）
        lit = { i, t0: performance.now(), ci: D.chComplete[ci] && !opts.quiet ? ci : -1, si: D.stComplete[si] && !opts.quiet ? si : -1 };
        host.dataset.lit = options.litId;
        host.dataset.litBox = `${D.chComplete[ci] ? "chapter" : ""}${D.stComplete[si] ? " stage" : ""}`.trim();
        if (D.chComplete[ci]) {
          const whole = `${chapterLabel[ci].title} 整章完成${D.stComplete[si] ? `，${opts.stages[si].title} 整個 Stage 完成` : ""}`;
          window.setTimeout(() => { if (live) live.textContent = whole; }, 80);
        }
        // reduced-motion 時沒有一直在畫的格子：時間到要自己叫一格把環拿掉
        window.setTimeout(() => request(), LIT_MS + 50);
      }
    }
    if (pending.focus || pending.say) {
      const p = pending;
      pending = { focus: "", say: "" };
      const el = p.focus && host.querySelector(p.focus);
      if (el) el.focus({ preventScroll: true });
      // 新掛上去的 aria-live 要等一下再寫，螢幕閱讀器才會念
      if (p.say) window.setTimeout(() => { if (live) live.textContent = sayFor(p.say); }, 80);
    }
    request();
    return true;
  }

  // 課程表（清單）上的目標那一行：不開地圖也算得出「還差幾課」（先修的圖在 map.js 裡）
  function goal(done, gi, minutes) {
    if (!window.BUZZ_COURSE_MAP) return null;
    ensureModel();
    if (gi < 0 || gi >= G.n) return null;
    const g = goalPlan(gi, (v) => Boolean(done[v]), (v) => minutes[v]);
    return { missing: g.missing.length, minutes: g.minutes, first: g.first };
  }

  // 測試用：每一課現在算成什麼（點亮、可以學、目標、該練），跟畫面上的是同一份
  function state() {
    if (!D || !opts) return null;
    const id = (i) => opts.lessons[i].id;
    const all = (pred) => opts.lessons.map((_L, i) => i).filter(pred).map(id);
    return {
      filter: opts.filter || "all",
      lit: D.lit,
      mastered: D.mastered,
      ready: all((i) => sty[i] === 1),
      next: opts.next >= 0 ? id(opts.next) : "",
      goal: D.goal ? { id: id(D.goal.i), missing: D.goal.missing.map(id), minutes: D.goal.minutes, first: D.goal.first >= 0 ? id(D.goal.first) : "" } : null,
      practice: D.practice.map((p) => ({ id: id(p.i), why: p.why, ids: D.ids[p.i] })),
      chapters: D.chDone.map((x, ci) => [x, D.chTotal[ci]]),
      stages: D.stDone.map((x, si) => [x, D.stTotal[si]]),
      gold: D.stComplete.map((x, si) => (x && N && N.stageGold ? si : -1)).filter((si) => si >= 0),
      dimmed: emph ? emph.length - emph.reduce((a, b) => a + b, 0) : 0,
      colors: pal ? { far: [pal.muted, pal.farFill], ready: [pal.ink, pal.nodeFill], done: [pal.ink, pal.doneFill] } : null
    };
  }

  // 測試用：課在畫面上的位置（client 座標）、目前的狀態
  function debug() {
    return {
      level: stats.level,
      scale: cam.s,
      tx: cam.tx,
      ty: cam.ty,
      visibleStages: stats.visibleStages,
      visibleChapters: stats.visibleChapters,
      visibleLessons: stats.visibleLessons,
      labelledLessons: stats.labelledLessons,
      selected: sel >= 0 && opts ? opts.lessons[sel].id : "",
      ancestors: ancCount,
      descendants: descCount,
      animating: anim.on || inertia.on,
      lit: lit ? opts.lessons[lit.i].id : "",
      draws: drawCount,
      lastDrawMs
    };
  }
  function project(id) {
    if (!G || !canvas || !opts) return null;
    const i = opts.lessons.findIndex((L) => L.id === id);
    if (i < 0) return null;
    const r = canvas.getBoundingClientRect();
    return { x: r.left + G.lx[i] * cam.s + cam.tx, y: r.top + G.ly[i] * cam.s + cam.ty };
  }

  // 截圖與測試用：把相機直接放到某個倍率、某個世界座標（不經過手勢）
  function look(scale, wx, wy) {
    if (!G || !canvas) return;
    anim.on = false;
    inertia.on = false;
    cam.s = scale === "fit" ? fitScale() : scale;
    cam.tx = vw / 2 - (wx === undefined ? W() / 2 : wx) * cam.s;
    cam.ty = vh / 2 - (wy === undefined ? H() / 2 : wy) * cam.s;
    clampCam();
    request();
  }

  window.BuzzCourseMap = { attach, debug, project, look, goal, state };
})();
