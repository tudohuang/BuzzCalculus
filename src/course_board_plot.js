// 黑板上的圖（board 的 plot 動作）：只有句子裡有 plot 的節才抓（data-lazy="boardplot"，course_board.js 自己叫 ensureLazy）。
// 跟題目、課文的圖同一支 renderProblemGraph；這裡只管「一筆一筆畫出來」：格線先淡入、曲線一筆畫（ease）、塗色與點、標籤最後。
(function () {
  "use strict";
  const cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  // raw／nb：交付的筆記本課的圖
  function html(graph, raw, nb) {
    const svg = nb ? window.BuzzNotebookPlot.svg(nb).svg : raw || window.BuzzGraphRender.renderProblemGraph({ graph }, { label: " " }, esc);
    const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg) || [0, 320, 220];
    return { svg, w: Number(m[1]), h: Number(m[2]) };
  }
  function prep(v) {
    const g = v.el.querySelector("svg");
    if (!g) return null;
    const cv = [...g.querySelectorAll('path[fill="none"]:not([stroke-dasharray])')];
    const lens = cv.map((p) => p.getTotalLength());
    const kids = [...g.children].filter((n) => !cv.includes(n));
    const early = kids.filter((n) => n.tagName.toLowerCase() === "line" || n.getAttribute("font-size") === "9");
    return { cv, lens, early, late: kids.filter((n) => !early.includes(n)) };
  }
  function apply(v, q) {
    if (!v.plot) v.plot = prep(v);
    const s = v.plot;
    if (!s) return;
    if (q >= 1) {
      s.cv.forEach((p) => { p.style.strokeDasharray = p.style.strokeDashoffset = ""; });
      s.early.concat(s.late).forEach((n) => { n.style.opacity = ""; });
      return;
    }
    s.early.forEach((n) => { n.style.opacity = cl(q / 0.2).toFixed(3); });
    const m = ease(cl((q - 0.12) / 0.66));
    s.cv.forEach((p, i) => { p.style.strokeDasharray = `${s.lens[i]} ${s.lens[i] + 1}`; p.style.strokeDashoffset = (s.lens[i] * (1 - m)).toFixed(2); });
    s.late.forEach((n) => { n.style.opacity = cl((q - 0.75) / 0.25).toFixed(3); });
  }
  window.BuzzBoardPlot = { html, apply };
})();
