// 手寫數字辨識（2026-09，#12 第一版）。
//
// 範圍刻意窄：數字 0-9、負號、小數點、分數斜線 —— 數值題的答案字元集。
// 用途也刻意窄：把計算紙上寫的答案「讀進輸入框當草稿」，永遠只是預填、
// 永遠不自動送出 —— 辨識錯了使用者看得到、改得掉，不會被判錯。
//
// 演算法是 $P 點雲匹配（Vatavu et al.）：把一個字形的所有筆畫合併成
// 點雲、重取樣、平移縮放正規化，跟模板做貪婪最近點配對。選它的理由：
// 對筆順與筆畫數完全不敏感（「4」寫一筆或兩筆都認得），實作只要百來行，
// 而且沒有任何外部依賴 —— 這個站是 zero-build 靜態站。
//
// 模板是程式化生成的標準字形（每個數字 1–2 種寫法）。誠實聲明：
// 這一版的模板沒有經過真人手寫資料的field驗證 —— 管線用合成筆跡測過，
// 真實準確率要靠上線後的回報來修模板。這也是它只做「預填」的原因。

(function () {
  "use strict";

  const N = 32; // 每個字形重取樣的點數

  /* ── 幾何 ─────────────────────────────────────────────────── */

  function resample(points, count) {
    if (!points.length) return [];
    const path = [];
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    if (total === 0) return Array.from({ length: count }, () => ({ ...points[0] }));
    const step = total / (count - 1);
    path.push({ ...points[0] });
    let acc = 0;
    let index = 1;
    let prev = points[0];
    while (index < points.length && path.length < count) {
      const current = points[index];
      const d = Math.hypot(current.x - prev.x, current.y - prev.y);
      if (acc + d >= step && d > 0) {
        const t = (step - acc) / d;
        const nx = prev.x + t * (current.x - prev.x);
        const ny = prev.y + t * (current.y - prev.y);
        path.push({ x: nx, y: ny });
        prev = { x: nx, y: ny };
        acc = 0;
      } else {
        acc += d;
        prev = current;
        index += 1;
      }
    }
    while (path.length < count) path.push({ ...points[points.length - 1] });
    return path;
  }

  function normalize(points) {
    const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
    let scale = 0;
    points.forEach((p) => { scale = Math.max(scale, Math.hypot(p.x - cx, p.y - cy)); });
    if (scale === 0) scale = 1;
    return points.map((p) => ({ x: (p.x - cx) / scale, y: (p.y - cy) / scale }));
  }

  // $P 貪婪雲距離（雙向取小）
  function cloudDistance(a, b) {
    const one = greedy(a, b);
    const two = greedy(b, a);
    return Math.min(one, two);
  }

  function greedy(a, b) {
    const used = new Array(b.length).fill(false);
    let sum = 0;
    for (let i = 0; i < a.length; i += 1) {
      let best = Infinity;
      let bestJ = -1;
      for (let j = 0; j < b.length; j += 1) {
        if (used[j]) continue;
        const d = Math.hypot(a[i].x - b[j].x, a[i].y - b[j].y);
        if (d < best) { best = d; bestJ = j; }
      }
      if (bestJ >= 0) { used[bestJ] = true; sum += best; }
    }
    return sum;
  }

  /* ── 模板（程式化標準字形）───────────────────────────────── */

  function arc(cx, cy, r, a0, a1, steps = 16) {
    const out = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = a0 + ((a1 - a0) * i) / steps;
      out.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
    }
    return out;
  }
  function line(x0, y0, x1, y1, steps = 12) {
    const out = [];
    for (let i = 0; i <= steps; i += 1) {
      out.push({ x: x0 + ((x1 - x0) * i) / steps, y: y0 + ((y1 - y0) * i) / steps });
    }
    return out;
  }

  // 座標系：單位框，y 往下。每個模板是一串點（筆畫界線不重要）。
  const TEMPLATES = [];
  function tpl(label, points) { TEMPLATES.push({ label, cloud: normalize(resample(points, N)) }); }

  tpl("0", arc(0.5, 0.5, 0.45, -Math.PI / 2, (3 * Math.PI) / 2, 28).map((p) => ({ x: 0.5 + (p.x - 0.5) * 0.75, y: p.y })));
  tpl("1", line(0.5, 0.05, 0.5, 0.95));
  tpl("1", [...line(0.35, 0.2, 0.5, 0.05, 5), ...line(0.5, 0.05, 0.5, 0.95)]);
  tpl("2", [...arc(0.5, 0.3, 0.28, Math.PI, 2 * Math.PI, 12), ...line(0.78, 0.3, 0.2, 0.92, 10), ...line(0.2, 0.92, 0.82, 0.92, 8)]);
  tpl("3", [...arc(0.48, 0.28, 0.24, (-3 * Math.PI) / 4, Math.PI / 2, 12), ...arc(0.48, 0.72, 0.26, -Math.PI / 2, (3 * Math.PI) / 4, 12)]);
  tpl("4", [...line(0.6, 0.05, 0.15, 0.6, 8), ...line(0.15, 0.6, 0.85, 0.6, 8), ...line(0.62, 0.35, 0.62, 0.95, 8)]);
  tpl("5", [...line(0.75, 0.08, 0.3, 0.08, 6), ...line(0.3, 0.08, 0.28, 0.45, 5), ...arc(0.5, 0.68, 0.26, -Math.PI / 2 - 0.4, Math.PI - 0.3, 14)]);
  tpl("6", [...line(0.62, 0.06, 0.3, 0.5, 8), ...arc(0.5, 0.7, 0.24, Math.PI, 3 * Math.PI, 20)]);
  tpl("7", [...line(0.18, 0.08, 0.82, 0.08, 8), ...line(0.82, 0.08, 0.4, 0.95, 10)]);
  tpl("8", [...arc(0.5, 0.28, 0.2, -Math.PI / 2, (3 * Math.PI) / 2, 14), ...arc(0.5, 0.72, 0.24, -Math.PI / 2, (3 * Math.PI) / 2, 14)]);
  tpl("9", [...arc(0.5, 0.3, 0.22, -Math.PI / 2, (3 * Math.PI) / 2, 14), ...line(0.72, 0.3, 0.62, 0.95, 8)]);
  tpl("-", line(0.15, 0.5, 0.85, 0.5));
  tpl("/", line(0.2, 0.9, 0.8, 0.1));

  /* ── 字形切割與辨識 ───────────────────────────────────────── */

  function strokeBounds(stroke) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    stroke.points.forEach((p) => {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    });
    return { minX, maxX, minY, maxY };
  }

  // 按水平間隙把筆畫分群成字形：同一個字的筆畫在 x 上重疊或貼近。
  function clusterGlyphs(strokes) {
    const items = strokes
      .filter((s) => s.tool !== "eraser" && s.points && s.points.length)
      .map((s) => ({ stroke: s, box: strokeBounds(s) }))
      .sort((a, b) => a.box.minX - b.box.minX);
    if (!items.length) return [];
    // 用中位字形高度決定「貼近」的尺度
    const heights = items.map((i) => i.box.maxY - i.box.minY).sort((a, b) => a - b);
    const unit = Math.max(0.02, heights[Math.floor(heights.length / 2)]);
    const gap = unit * 0.35;

    const glyphs = [];
    let current = null;
    items.forEach((item) => {
      if (current && item.box.minX <= current.maxX + gap) {
        current.strokes.push(item.stroke);
        current.maxX = Math.max(current.maxX, item.box.maxX);
        current.minY = Math.min(current.minY, item.box.minY);
        current.maxY = Math.max(current.maxY, item.box.maxY);
      } else {
        current = { strokes: [item.stroke], minX: item.box.minX, maxX: item.box.maxX, minY: item.box.minY, maxY: item.box.maxY };
        glyphs.push(current);
      }
    });
    glyphs.forEach((g) => { g.unit = unit; });
    return glyphs;
  }

  function recognizeGlyph(glyph) {
    const points = glyph.strokes.flatMap((s) => s.points.map((p) => ({ x: p.x, y: p.y })));
    const w = glyph.maxX - glyph.minX;
    const h = glyph.maxY - glyph.minY;

    // 幾何捷徑：小數點是「相對行高很小」的一撮；負號是「扁而寬」的一橫。
    // 這兩個交給 $P 反而容易跟 0 和 1 混。
    if (w < glyph.unit * 0.25 && h < glyph.unit * 0.25) return { char: ".", score: 0 };
    if (h < glyph.unit * 0.28 && w > h * 2.2) return { char: "-", score: 0 };

    const cloud = normalize(resample(points, N));
    let best = { label: "?", distance: Infinity };
    TEMPLATES.forEach((template) => {
      const d = cloudDistance(cloud, template.cloud);
      if (d < best.distance) best = { label: template.label, distance: d };
    });
    return { char: best.label, score: best.distance };
  }

  // 主入口：strokes（board 的原始筆畫）→ { text, glyphs, confident }
  function readAnswer(strokes) {
    const glyphs = clusterGlyphs(strokes || []);
    if (!glyphs.length) return { text: "", glyphs: 0, confident: false };
    const reads = glyphs.map(recognizeGlyph);
    const text = reads.map((r) => r.char).join("");
    // $P 距離經驗上 < 6（N=32 正規化雲）算穩；任何一字爆掉就標不確定
    const confident = reads.every((r) => r.score < 6) && !text.includes("?");
    return { text, glyphs: glyphs.length, confident };
  }

  const api = { version: 1, readAnswer, _internals: { resample, normalize, cloudDistance, clusterGlyphs, recognizeGlyph, TEMPLATES } };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzInkRead = api;
})();
