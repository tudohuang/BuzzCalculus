// 黑板的版面檢查（tools/lint_board_layout.js 與 tools/e2e_course_board.js 共用）：在真的 Chrome 裡把每一節黑板的每一步
// （每一個動作做完的那一刻）畫出來，量每一個東西的框，擋：
//   不同的兩行字疊在一起、標籤壓到字／別的標籤／記號／箭頭、記號（圈、框、底線、劃掉）壓到不是它標的字、箭頭穿過字、
//   東西跑出黑板、字太小（板上的式子與中文 < 16px、標籤 < 13px）、對比不夠（字 < 4.5、粉筆線 < 3）、黑板比畫面高度的 55% 還高、頁面橫向溢出。
// 量的是「有墨水的最小單位」（KaTeX 的字、分數線、根號，與一段中文）的框，跟畫面排版用的是同一種框。
"use strict";

const fs = require("fs");
const path = require("path");

const VIEWPORTS = [
  { name: "360", width: 360, height: 740, deviceScaleFactor: 2, mobile: true },
  { name: "390", width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  { name: "430", width: 430, height: 932, deviceScaleFactor: 2, mobile: true },
  { name: "1280", width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }
];
const MIN_LINE_PX = 16;
const MIN_LABEL_PX = 13;
const TOL = 0.75; // 重疊容許（px）：次像素的反鋸齒不算

// 在頁面裡跑（用 toString 塞進去，免得跳脫字元）
function pageHelpers(MIN_LINE, MIN_LABEL, T) {
  const LEAF = ".katex-html span,.cvb-x";
  const isLeaf = (n) => n.classList.contains("cvb-x") || (!n.firstElementChild && /[^\s​]/.test(n.textContent)) || /frac-line|overline-line|underline-line|hline|rule/.test(n.className) || (n.firstElementChild && n.firstElementChild.tagName.toLowerCase() === "svg");
  const leaves = (root) => [...root.querySelectorAll(LEAF)].filter((n) => isLeaf(n) && !(n.parentElement && n.parentElement.closest(".cvb-x")));
  const box = (r) => [r.left, r.top, r.right, r.bottom];
  // 墨水框（跟 src/course_board.js 的 inkOf 同一個量法）：字用 measureText 量真正畫到的範圍
  const cx2 = document.createElement("canvas").getContext("2d");
  const ink = (n) => {
    const r = n.getBoundingClientRect();
    const t = n.firstElementChild ? "" : n.textContent;
    if (!t || !/\S/.test(t)) return box(r);
    const cs = getComputedStyle(n);
    cx2.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cx2.measureText(t);
    if (!(m.actualBoundingBoxRight > 0) || !(m.fontBoundingBoxAscent > 0)) return box(r);
    const base = r.top + m.fontBoundingBoxAscent;
    return [r.left - m.actualBoundingBoxLeft, base - m.actualBoundingBoxAscent, r.left + m.actualBoundingBoxRight, base + m.actualBoundingBoxDescent];
  };
  const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
  const over = (a, b, t) => a[0] < b[2] - t && b[0] < a[2] - t && a[1] < b[3] - t && b[1] < a[3] - t;
  const within = (a, B, t) => a[0] >= B[0] - t && a[1] >= B[1] - t && a[2] <= B[2] + t && a[3] <= B[3] + t;
  const eff = (el, stop) => { let o = 1; for (let n = el; n && n !== stop; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === "hidden" || cs.display === "none") return 0; o *= Number(cs.opacity); } return o; };
  const parse = (c) => {
    let m = /color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)/.exec(c);
    if (m) return [m[1] * 255, m[2] * 255, m[3] * 255];
    m = String(c).match(/[\d.]+/g).map(Number);
    return [m[0], m[1], m[2]];
  };
  const lum = (x) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(x[0]) + 0.7152 * f(x[1]) + 0.0722 * f(x[2]); };
  const contrast = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  window.__bl = {
    board: () => document.querySelector("[data-cv2s] .cvb"),
    // cur：已經做完幾個動作（lint 停在第 cur 個動作之前）；給了才檢查「錯的記號一直在」
    measure(tag, cur) {
      const c = window.__bl.board();
      const P = [];
      const add = (m) => { if (!P.includes(m)) P.push(m); };
      if (!c) return { problems: [`${tag}：沒有黑板`] };
      const B = box(c.getBoundingClientRect());
      const inner = [B[0] + 1, B[1] + 1, B[2] - 1, B[3] - 1];
      const model = window.BuzzBoard.debug.model();
      const probe = document.createElement("i");
      probe.style.color = "var(--kb)";
      c.appendChild(probe);
      const bg = parse(getComputedStyle(probe).color);
      probe.remove();
      const items = [...c.querySelectorAll(".cvb-i")].map((el) => ({ el, n: Number(el.dataset.n), op: eff(el, c) })).filter((x) => x.op > 0.05);
      items.forEach((it) => {
        if (it.el.classList.contains("cvb-p")) { const s = it.el.querySelector("svg"); it.leaves = s ? [{ n: s, b: box(s.getBoundingClientRect()) }] : []; return; }
        it.leaves = leaves(it.el).map((n) => ({ n, b: ink(n) })).filter((x) => area(x.b) > 0.5);
        it.el.querySelectorAll(".katex, .cvb-x").forEach((n) => { const fz = parseFloat(getComputedStyle(n).fontSize); if (fz < MIN_LINE - 0.15) add(`${tag}：第 ${it.n} 項的字 ${fz.toFixed(1)}px（< ${MIN_LINE}px）`); });
        if (it.op > 0.95) it.leaves.forEach((x) => { const k = contrast(parse(getComputedStyle(x.n).color), bg); if (k < 4.5) add(`${tag}：第 ${it.n} 項「${x.n.textContent.slice(0, 6)}」對比 ${k.toFixed(2)}（< 4.5）`); });
      });
      const allLeaves = items.flatMap((it) => it.leaves.map((x) => ({ ...x, it: it.n })));
      // 1. 不同的兩項的字不能疊
      for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i];
        const b = items[j];
        for (const x of a.leaves) for (const y of b.leaves) if (over(x.b, y.b, T)) { add(`${tag}：第 ${a.n} 項「${x.n.textContent.slice(0, 6)}」和第 ${b.n} 項「${y.n.textContent.slice(0, 6)}」疊在一起`); break; }
      }
      // 2. 記號與箭頭
      const svg = c.querySelector(".cvb-ink");
      const so = svg ? svg.getBoundingClientRect() : { left: 0, top: 0 };
      const marks = [];
      const arrows = [];
      (svg ? [...svg.querySelectorAll("g[data-a]")] : []).forEach((g) => {
        const op = eff(g, c);
        if (op <= 0.05) return;
        const a = Number(g.dataset.a);
        const an = model.anns[a];
        const ps = [...g.querySelectorAll("path")].filter((p) => Number(p.style.strokeDashoffset || 0) < 0.98);
        if (!ps.length) return;
        const own = new Set();
        an.refs.forEach(([n, id]) => { const t = c.querySelector(`.cvb-i[data-n="${n}"] .cvb-t-${id}`); if (t) leaves(t).forEach((x) => own.add(x)); });
        const k = contrast(parse(getComputedStyle(g).color), bg);
        if (op > 0.95 && k < 3) add(`${tag}：記號 ${a}（${an.do}）的顏色對比 ${k.toFixed(2)}（< 3）`);
        if (an.do === "arrow") {
          const p = ps[0];
          const L = p.getTotalLength();
          const pts = [];
          for (let i = 0; i <= 40; i += 1) { const q = p.getPointAtLength((L * i) / 40); pts.push([so.left + q.x, so.top + q.y]); }
          arrows.push({ a, pts, own });
        } else {
          const r = ps[0].getBoundingClientRect();
          marks.push({ a, b: [r.left - 1.05, r.top - 1.05, r.right + 1.05, r.bottom + 1.05], own, kind: an.do });
        }
      });
      marks.forEach((m) => {
        for (const x of allLeaves) if (!m.own.has(x.n) && over(m.b, x.b, T)) { add(`${tag}：記號 ${m.a}（${m.kind}）壓到第 ${x.it} 項的「${x.n.textContent.slice(0, 6)}」`); break; }
        marks.forEach((o) => { if (o.a > m.a && over(m.b, o.b, T)) add(`${tag}：記號 ${m.a} 和記號 ${o.a} 疊在一起`); });
        if (!within(m.b, inner, 0.5)) add(`${tag}：記號 ${m.a}（${m.kind}）跑出黑板`);
      });
      arrows.forEach((ar) => {
        const hitLeaf = allLeaves.find((x) => !ar.own.has(x.n) && ar.pts.slice(2, -2).some(([px, py]) => px > x.b[0] + 1 && px < x.b[2] - 1 && py > x.b[1] + 1 && py < x.b[3] - 1));
        if (hitLeaf) add(`${tag}：箭頭 ${ar.a} 穿過第 ${hitLeaf.it} 項的「${hitLeaf.n.textContent.slice(0, 6)}」`);
        if (ar.pts.some(([px, py]) => px < inner[0] || px > inner[2] || py < inner[1] || py > inner[3])) add(`${tag}：箭頭 ${ar.a} 跑出黑板`);
      });
      // 3. 標籤
      const labs = [...c.querySelectorAll(".cvb-lab")].filter((l) => eff(l, c) > 0.05).map((l) => ({ l, a: Number(l.dataset.a), b: box(l.getBoundingClientRect()) }));
      labs.forEach((x, i) => {
        const fz = parseFloat(getComputedStyle(x.l).fontSize);
        if (fz < MIN_LABEL) add(`${tag}：標籤「${x.l.textContent}」${fz}px（< ${MIN_LABEL}px）`);
        if (eff(x.l, c) > 0.95) { const k = contrast(parse(getComputedStyle(x.l).color), bg); if (k < 4.5) add(`${tag}：標籤「${x.l.textContent}」對比 ${k.toFixed(2)}`); }
        const hl = allLeaves.find((y) => over(x.b, y.b, T));
        if (hl) add(`${tag}：標籤「${x.l.textContent}」壓到第 ${hl.it} 項的「${hl.n.textContent.slice(0, 6)}」`);
        labs.forEach((y, j) => { if (j > i && over(x.b, y.b, T)) add(`${tag}：標籤「${x.l.textContent}」和「${y.l.textContent}」疊在一起`); });
        marks.forEach((m) => { if (over(x.b, m.b, T)) add(`${tag}：標籤「${x.l.textContent}」壓到記號 ${m.a}`); });
        arrows.forEach((ar) => { if (ar.pts.some(([px, py]) => px > x.b[0] + 1 && px < x.b[2] - 1 && py > x.b[1] + 1 && py < x.b[3] - 1)) add(`${tag}：標籤「${x.l.textContent}」壓到箭頭 ${ar.a}`); });
        if (!within(x.b, inner, 0.5)) add(`${tag}：標籤「${x.l.textContent}」跑出黑板`);
      });
      allLeaves.forEach((x) => { if (!within(x.b, inner, 0.5)) add(`${tag}：第 ${x.it} 項的「${x.n.textContent.slice(0, 6)}」跑出黑板`); });
      // 錯的式子不能沒標記地留在板上：標成錯的項（劃掉、紅色記號）只要它那一行看得到，記號就要看得到、而且畫完
      if (cur !== undefined) model.anns.forEach((an, a) => {
        if (!an.wrong || an.g >= cur || (an.dieG >= 0 && an.dieG < cur)) return;
        const it = items.find((x) => x.n === an.refs[0][0]);
        if (!it || it.op < 0.5) return;
        const g = svg && svg.querySelector(`g[data-a="${a}"]`);
        const p = g && g.querySelector("path");
        const ok = g && eff(g, c) > 0.5 && (!p || Number(p.style.strokeDashoffset || 0) < 0.05);
        if (!ok) add(`${tag}：第 ${an.refs[0][0]} 項的「${an.refs[0][1]}」被標成錯的（${an.do}），這一行還在板上，記號卻不見了`);
      });
      const H = B[3] - B[1];
      if (H > innerHeight * 0.55) add(`${tag}：黑板 ${Math.round(H)}px 高，超過畫面高度的 55%（${Math.round(innerHeight * 0.55)}px）：先 clear／keep`);
      const d = document.documentElement;
      if (d.scrollWidth - d.clientWidth > 0) add(`${tag}：頁面橫向溢出 ${d.scrollWidth - d.clientWidth}px`);
      return { problems: P, items: items.length, labels: labs.length, marks: marks.length, arrows: arrows.length, H };
    }
  };
}

const NAV = `
  window.__nav = {
    open(id) { const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = id; document.querySelector("#app").appendChild(b); b.click(); b.remove(); return 1; },
    si() { const r = document.querySelector("[data-cv2s]"); return r ? Number(r.dataset.cv2s) : -1; },
    go(si) { const b = document.querySelector('[data-action="course-s-go"][data-to="' + si + '"]'); if (b) b.click(); return Boolean(b); }
  };`;

// 一顆 Chrome（已經 launch）把幾課的每一節、每一步在每一個視窗大小、兩種主題下量一次。回傳問題清單。
async function lintLessons(chrome, baseUrl, lessons, { viewports = VIEWPORTS, themes = ["light", "dark"], shots = "", log = () => {} } = {}) {
  const evaluate = (code) => chrome.evaluate(code);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (expr, ms = 8000) => { for (const end = Date.now() + ms; Date.now() < end; await sleep(60)) { if (await evaluate(`return Boolean(${expr});`)) return true; } return false; };
  const problems = [];
  let states = 0;
  for (const vp of viewports) {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: vp.deviceScaleFactor, mobile: vp.mobile });
    await chrome.navigate(`${baseUrl}/index.html`);
    await evaluate(`localStorage.clear(); localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({ tours: { home: 1, quiz: 1 } })); return 1;`);
    await chrome.navigate(`${baseUrl}/index.html`);
    await evaluate(`const b = document.querySelector('[data-action="set-onboarding-context"][data-context="newbie"]'); if (b) b.click(); return 1;`);
    await waitFor('document.querySelector(".cv2-index")');
    await evaluate(`${NAV} (${pageHelpers.toString()})(${MIN_LINE_PX}, ${MIN_LABEL_PX}, ${TOL}); return 1;`);
    for (const L of lessons) {
      // 多課連跑時上一課的分節畫面還在：先在舊的根上做記號，等到換成「沒有記號的新根」才算打開了，
      // 不然 go() 會點到上一課的節按鈕，這一課的第一個有黑板的節就報「黑板沒出來」（以前的隨機誤報）
      await evaluate(`const old = document.querySelector("[data-cv2s]"); if (old) old.dataset.lintOld = "1"; window.__nav.open(${JSON.stringify(L.id)}); return 1;`);
      if (!(await waitFor(`document.querySelector("[data-cv2s]:not([data-lint-old]) .cv2s-sec")`))) { problems.push(`${vp.name} ${L.id}：打不開這一課`); continue; }
      for (let si = 0; si < L.sections.length; si += 1) {
        if (!L.sections[si].beats.some((b) => b.board)) continue;
        // 節的按鈕可能還沒畫出來（剛打開課、上一節還在重繪）：等到點得到為止，不是只點一次
        await waitFor(`window.__nav.go(${si})`, 5000);
        if (!(await waitFor(`window.__nav.si() === ${si} && window.BuzzBoard && window.BuzzBoard.debug.model() && window.BuzzBoard.state() && window.BuzzBoard.state().key === ${JSON.stringify(`${L.id}:${si}`)}`, 10000))) { problems.push(`${vp.name} ${L.id} 第 ${si + 1} 節：黑板沒出來`); continue; }
        // 字型（KaTeX）載完才量：載完會自己重排一次
        await evaluate(`await document.fonts.ready; await new Promise((r) => setTimeout(r, 80)); return 1;`);
        const model = await evaluate(`return window.BuzzBoard.debug.model();`);
        for (const theme of themes) {
          await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}; window.__bl.board().scrollIntoView({ block: "center" }); return 1;`);
          for (let g = 0; g < model.acts.length; g += 1) {
            const A = model.acts[g];
            const tag = `${vp.name}/${theme} ${L.id} 第 ${si + 1} 節第 ${A.b + 1} 句動作 ${A.k + 1}（${A.do}）`;
            await evaluate(`window.BuzzBoard.debug.show(${g + 1}, 0, ${A.b}, 1); return 1;`);
            const r = await evaluate(`return window.__bl.measure(${JSON.stringify(tag)}, ${g + 1});`);
            states += 1;
            problems.push(...r.problems);
            const last = g + 1 === model.acts.length || model.acts[g + 1].b !== A.b;
            if (shots && last && (vp.name === "390" || vp.name === "1280")) {
              const rect = await evaluate(`const r = window.__bl.board().getBoundingClientRect(); return { x: r.left - 6, y: r.top - 6 + scrollY, width: r.width + 12, height: r.height + 12 };`);
              const { data } = await chrome.send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 }, captureBeyondViewport: true });
              fs.mkdirSync(shots, { recursive: true });
              fs.writeFileSync(path.join(shots, `${L.id}-${si + 1}-${A.b + 1}-${vp.name}-${theme}.png`), Buffer.from(data, "base64"));
            }
          }
        }
        await evaluate(`window.BuzzBoard.debug.release(); document.documentElement.dataset.theme = "light"; return 1;`);
        log(`  ${vp.name} ${L.id} 第 ${si + 1} 節：${model.acts.length} 步 × ${themes.length} 主題`);
      }
    }
  }
  return { problems, states };
}

module.exports = { lintLessons, pageHelpers, VIEWPORTS, MIN_LINE_PX, MIN_LABEL_PX };
