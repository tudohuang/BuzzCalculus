// 課程地圖的版面（build 時算好，執行時只畫不排）。
//
// 輸入：大綱（13 個 Stage → 章 → 課，照大綱順序）＋每一課的先修（prerequisites）與相關（related）。
// 輸出：每一課、每一章、每一個 Stage 在「世界座標」裡的位置，還有三層各自的邊。
//
// 版面是分層的複合 DAG（Sugiyama 的做法，三層巢狀）：
//   1. Stage 層：跨 Stage 的先修邊彙總成 Stage 圖。逆著大綱順序的邊（例如 Stage 11 的某課是 Stage 6 某課的先修）
//      會造成環，排層時忽略（照樣畫）。最長路徑分層 → 每一層是一欄，同一欄的 Stage 上下疊。
//   2. 章層：Stage 內部跨章的先修邊彙總成章圖，同樣最長路徑分層 → Stage 裡由左到右的章欄。
//   3. 課：一章是一欄，課照大綱順序由上往下排（章內幾乎都是一條鏈，這樣最省寬度，也跟課程表一致）。
//   交叉縮減：Stage 在欄內、章在欄內的上下順序用重心法（barycenter）來回掃，留下邊總長最短的那一輪。
//   全部決定性：沒有亂數、排序都有平手規則，同一份大綱永遠排出同一張圖。
//
// 座標單位是「世界像素」：縮放 1 的時候一課是 NODE_W × NODE_H 的膠囊。
"use strict";

const NODE_W = 152;
const NODE_H = 34;
const ROW = 46; // 章內一課的行距
const CH_HEAD = 34; // 章標題的高度
const CH_PAD = 10;
const CH_W = NODE_W + CH_PAD * 2;
const CH_GAP_X = 48; // 章欄之間（邊要有地方彎）
const CH_GAP_Y = 26; // 同一欄裡上下兩章
const ST_PAD = 22;
const ST_HEAD = 46; // Stage 標題
const ST_GAP_X = 120; // Stage 欄之間
const ST_GAP_Y = 64; // 同一欄裡上下兩個 Stage
const SWEEPS = 6;
// 一個 Stage 最多幾個章欄並排；更多就換列（像文字一樣由左到右、再下一列）。
// 不換列的話 Stage 12（十個章一條鏈）一個就佔掉兩千多像素寬，整張圖寬高比 7.6:1，拉遠看什麼都擠在一條線上。
// 兩欄時整張圖約 4900 × 2600（寬高比接近桌機的地圖視窗）；拉遠一眼看得到 13 個 Stage。
const MAX_COLS = 2;

function longestPathLayers(nodes, preds) {
  const layer = new Map();
  const visit = (n, stack) => {
    if (layer.has(n)) return layer.get(n);
    if (stack.has(n)) return 0;
    stack.add(n);
    let best = 0;
    (preds.get(n) || []).forEach((p) => { best = Math.max(best, visit(p, stack) + 1); });
    stack.delete(n);
    layer.set(n, best);
    return best;
  };
  nodes.forEach((n) => visit(n, new Set()));
  return layer;
}

// 1-D 疊放：items 依序由上往下，各自高 h，間距 gap；回傳每一個的 top，整疊以 0 為中心
function stack(heights, gap, center) {
  const total = heights.reduce((s, h) => s + h, 0) + gap * Math.max(0, heights.length - 1);
  let y = center ? -total / 2 : 0;
  return heights.map((h) => { const top = y; y += h + gap; return top; });
}

function layoutCourseMap(outline, lessonsById) {
  // ── 攤平 ──
  const lessons = []; // { id, s, c, k }
  const chapters = []; // { s, code, title, lessons:[idx] }
  const stages = []; // { n, title, branch, chapters:[ci] }
  outline.stages.forEach((stage, si) => {
    const st = { n: stage.n, title: stage.title, branch: Boolean(stage.branch), chapters: [] };
    stages.push(st);
    stage.chapters.forEach((chapter) => {
      const ci = chapters.length;
      const ch = { s: si, code: chapter.code, title: chapter.title, lessons: [] };
      chapters.push(ch);
      st.chapters.push(ci);
      chapter.lessons.forEach((entry, k) => {
        ch.lessons.push(lessons.length);
        lessons.push({ id: entry.id, s: si, c: ci, k });
      });
    });
  });
  const indexOf = new Map(lessons.map((l, i) => [l.id, i]));

  // ── 邊 ──
  const pre = []; // [from, to]：from 是 to 的先修
  const relSet = new Set();
  const rel = [];
  lessons.forEach((l, to) => {
    const data = lessonsById[l.id] || {};
    (data.prerequisites || []).filter(Boolean).forEach((pid) => {
      const from = indexOf.get(pid);
      if (from === undefined) throw new Error(`課程地圖：${l.id} 的先修 ${pid} 不在大綱`);
      pre.push([from, to]);
    });
    (data.related || []).filter(Boolean).forEach((rid) => {
      const other = indexOf.get(rid);
      if (other === undefined || other === to) return;
      const key = Math.min(other, to) + ":" + Math.max(other, to);
      if (relSet.has(key)) return;
      relSet.add(key);
      rel.push([Math.min(other, to), Math.max(other, to)]);
    });
  });
  // 先修邊跟相關邊重複的，相關就不另外畫
  const preKey = new Set(pre.map(([a, b]) => Math.min(a, b) + ":" + Math.max(a, b)));
  const relOnly = rel.filter(([a, b]) => !preKey.has(a + ":" + b));

  // 彙總：Stage 圖、章圖（帶邊數當權重）
  const weightMap = (pick) => {
    const m = new Map();
    pre.forEach(([a, b]) => {
      const pa = pick(a);
      const pb = pick(b);
      if (pa === null || pb === null || pa === pb) return;
      const key = pa + ">" + pb;
      m.set(key, (m.get(key) || 0) + 1);
    });
    return [...m.entries()].map(([key, w]) => { const [a, b] = key.split(">").map(Number); return [a, b, w]; })
      .sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  };
  const stageEdges = weightMap((i) => lessons[i].s);
  const chapterEdges = weightMap((i) => lessons[i].c);

  // ── 1. Stage 分層（逆大綱順序的邊不參與分層）──
  const stagePreds = new Map();
  stageEdges.forEach(([a, b]) => { if (a < b) { if (!stagePreds.has(b)) stagePreds.set(b, []); stagePreds.get(b).push(a); } });
  const stageLayer = longestPathLayers(stages.map((_s, i) => i), stagePreds);
  stages.forEach((st, i) => { st.layer = stageLayer.get(i); });

  // ── 2. 每個 Stage 裡的章分層 ──
  stages.forEach((st, si) => {
    const preds = new Map();
    chapterEdges.forEach(([a, b]) => {
      if (chapters[a].s !== si || chapters[b].s !== si || a > b) return;
      if (!preds.has(b)) preds.set(b, []);
      preds.get(b).push(a);
    });
    const layers = longestPathLayers(st.chapters, preds);
    st.chapters.forEach((ci) => { chapters[ci].layer = layers.get(ci); });
    st.cols = Math.max(...st.chapters.map((ci) => chapters[ci].layer)) + 1;
  });

  // 章的尺寸（固定）
  chapters.forEach((ch) => {
    ch.w = CH_W;
    ch.h = CH_HEAD + ch.lessons.length * ROW + CH_PAD - (ROW - NODE_H);
  });

  // 章在欄內的順序：初始照大綱
  stages.forEach((st) => {
    st.colOrder = Array.from({ length: st.cols }, (_v, k) => st.chapters.filter((ci) => chapters[ci].layer === k));
  });
  const stageLayers = Math.max(...stages.map((s) => s.layer)) + 1;
  let layerOrder = Array.from({ length: stageLayers }, (_v, k) => stages.map((_s, i) => i).filter((i) => stages[i].layer === k));

  // ── 給定順序 → 座標 ──
  function place() {
    // Stage 內：章欄由左到右、欄內上下疊（頂端對齊）；超過 MAX_COLS 欄就換下一列
    stages.forEach((st) => {
      let rowTop = ST_HEAD;
      let width = 0;
      for (let start = 0; start < st.colOrder.length; start += MAX_COLS) {
        let x = ST_PAD;
        let rowH = 0;
        st.colOrder.slice(start, start + MAX_COLS).forEach((col) => {
          const tops = stack(col.map((ci) => chapters[ci].h), CH_GAP_Y, false);
          col.forEach((ci, k) => { chapters[ci].rx = x; chapters[ci].ry = rowTop + tops[k]; });
          const colH = col.length ? tops[col.length - 1] + chapters[col[col.length - 1]].h : 0;
          rowH = Math.max(rowH, colH);
          x += CH_W + CH_GAP_X;
        });
        width = Math.max(width, x - CH_GAP_X + ST_PAD);
        rowTop += rowH + CH_GAP_Y * 2;
      }
      st.w = width;
      st.h = rowTop - CH_GAP_Y * 2 + ST_PAD;
    });
    // Stage 欄由左到右；欄內上下疊、整疊以 y=0 置中
    let x = 0;
    layerOrder.forEach((col) => {
      const tops = stack(col.map((si) => stages[si].h), ST_GAP_Y, true);
      let colW = 0;
      col.forEach((si, k) => { stages[si].x = x; stages[si].y = tops[k]; colW = Math.max(colW, stages[si].w); });
      x += colW + ST_GAP_X;
    });
    chapters.forEach((ch) => { ch.x = stages[ch.s].x + ch.rx; ch.y = stages[ch.s].y + ch.ry; });
    lessons.forEach((l) => {
      const ch = chapters[l.c];
      l.x = ch.x + CH_W / 2;
      l.y = ch.y + CH_HEAD + l.k * ROW + NODE_H / 2;
    });
  }
  // 品質：先修邊的總長（垂直距離為主）—— 重心法每一輪後量一次，留最好的
  const cost = () => pre.reduce((sum, [a, b]) => sum + Math.abs(lessons[a].y - lessons[b].y) + 0.15 * Math.abs(lessons[a].x - lessons[b].x), 0);

  const meanY = (list) => (list.length ? list.reduce((s, v) => s + v, 0) / list.length : null);
  // 一個 Stage／章的重心：跟它有邊的另一端（在 side 那一側）的課的 y
  const neighbourYs = (members, side) => {
    const set = new Set(members);
    const ys = [];
    pre.forEach(([a, b]) => {
      if (side !== "out" && set.has(b) && !set.has(a)) ys.push(lessons[a].y);
      if (side !== "in" && set.has(a) && !set.has(b)) ys.push(lessons[b].y);
    });
    return ys;
  };
  const stageMembers = stages.map((_s, si) => lessons.map((l, i) => (l.s === si ? i : -1)).filter((i) => i >= 0));
  const chapterMembers = chapters.map((ch) => ch.lessons);
  const reorder = (list, membersOf, side, currentY) => {
    const keyed = list.map((item, k) => {
      const b = meanY(neighbourYs(membersOf(item), side));
      return { item, key: b === null ? currentY(item) : b, k };
    });
    keyed.sort((p, q) => p.key - q.key || p.k - q.k);
    return keyed.map((e) => e.item);
  };

  place();
  let best = { cost: cost(), layerOrder: layerOrder.map((c) => c.slice()), colOrders: stages.map((st) => st.colOrder.map((c) => c.slice())) };
  for (let sweep = 0; sweep < SWEEPS; sweep += 1) {
    const side = sweep % 2 ? "out" : "in";
    const seq = layerOrder.map((_c, k) => k);
    if (side === "out") seq.reverse();
    seq.forEach((k) => {
      layerOrder[k] = reorder(layerOrder[k], (si) => stageMembers[si], side, (si) => stages[si].y + stages[si].h / 2);
      place();
    });
    stages.forEach((st) => {
      const cols = st.colOrder.map((_c, k) => k);
      if (side === "out") cols.reverse();
      cols.forEach((k) => {
        st.colOrder[k] = reorder(st.colOrder[k], (ci) => chapterMembers[ci], side, (ci) => chapters[ci].y + chapters[ci].h / 2);
      });
    });
    place();
    const c = cost();
    if (c < best.cost - 1e-6) best = { cost: c, layerOrder: layerOrder.map((col) => col.slice()), colOrders: stages.map((st) => st.colOrder.map((col) => col.slice())) };
  }
  layerOrder = best.layerOrder;
  stages.forEach((st, si) => { st.colOrder = best.colOrders[si]; });
  place();

  // 平移到左上角 (0,0)
  const minX = Math.min(...stages.map((s) => s.x));
  const minY = Math.min(...stages.map((s) => s.y));
  const r = (v) => Math.round(v);
  stages.forEach((s) => { s.x -= minX; s.y -= minY; });
  chapters.forEach((c) => { c.x -= minX; c.y -= minY; });
  lessons.forEach((l) => { l.x -= minX; l.y -= minY; });
  const width = Math.max(...stages.map((s) => s.x + s.w));
  const height = Math.max(...stages.map((s) => s.y + s.h));

  return {
    v: 1,
    node: [NODE_W, NODE_H],
    size: [r(width), r(height)],
    // Stage：[x, y, w, h, 分層]
    stages: stages.map((s) => [r(s.x), r(s.y), r(s.w), r(s.h), s.layer]),
    // 章：[Stage 索引, x, y, w, h]（照大綱順序）
    chapters: chapters.map((c) => [c.s, r(c.x), r(c.y), r(c.w), r(c.h)]),
    // 課：中心點，攤平成 [x0, y0, x1, y1, …]（照大綱順序）
    lessons: lessons.flatMap((l) => [r(l.x), r(l.y)]),
    // 先修邊：[from, to, from, to, …]（from 是 to 的先修）；相關邊（不含已是先修的）同格式
    pre: pre.flat(),
    rel: relOnly.flat(),
    // 彙總邊：[from, to, 邊數, …]
    stageEdges: stageEdges.flat(),
    chapterEdges: chapterEdges.flat(),
    stats: { cost: Math.round(best.cost), stageLayers }
  };
}

module.exports = { layoutCourseMap };
