// 開發者用：一次攤開全部課的黑板，從頭捲到尾看完整套課在講什麼。
// 打開方式：index.html?allboards（src/app.js 看到這個參數才抓這一支；不進打包、不佔載入預算）。
// 隱藏的 Stage 要先 ?unlock=… 解開才會列出來。
//
// 每一課就是結算畫面的「攤開整塊黑板」（BuzzBoard.overview）：畫好以後把那一課的頁面搬進來、彈窗殼丟掉。
// 300 課全畫會把頁面撐爆，所以捲到附近才畫、離很遠就收掉（留下同樣高度的空格，捲軸不會跳）。
(function () {
  "use strict";
  const host = window.__BUZZ_ALLBOARDS__ || {};
  const lazy = (g) => (host.ensureLazy ? host.ensureLazy(g) : Promise.resolve());
  const css = `
#allb{position:fixed;inset:0;z-index:90;overflow-y:auto;background:color-mix(in srgb,var(--paper,#f6f2e8) 92%,#000);color:var(--ink,#1f1d18);font-family:inherit}
#allb .ab-bar{position:sticky;top:0;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:10px 20px;background:var(--paper,#f6f2e8);box-shadow:0 2px 10px #0002}
#allb .ab-bar b{font-size:1.05rem}
#allb .ab-bar input{flex:1 1 220px;max-width:360px;padding:7px 12px;border:1px solid #0003;border-radius:10px;font:inherit;background:#fff}
#allb .ab-bar select{padding:7px 10px;border-radius:10px;border:1px solid #0003;font:inherit;background:#fff}
#allb .ab-bar small{color:#0009}
#allb .ab-body{max-width:2200px;margin:0 auto;padding:8px 20px 80px}
#allb h2{margin:40px 0 4px;font-size:1.5rem}
#allb h3{margin:22px 0 6px;font-size:1.05rem;color:#0009;font-weight:600}
#allb .ab-l{margin:14px 0 26px}
#allb .ab-h{display:flex;align-items:baseline;gap:10px;margin:0 0 8px}
#allb .ab-h b{font-size:1.15rem}
#allb .ab-h span{color:#0008;font-variant-numeric:tabular-nums}
#allb .ab-h a{margin-left:auto;font-size:.85rem}
#allb .ab-slot{min-height:220px;border-radius:12px}
#allb .ab-slot.is-wait{background:repeating-linear-gradient(135deg,#0000000a 0 12px,#0000 12px 24px)}
#allb .ab-slot .cvb-ov-grid{max-width:none;justify-content:flex-start}
#allb .ab-none{color:#0008;font-size:.9rem;padding:10px 0}
#allb .ab-l.is-hidden{display:none}
#allb .ab-over{color:#c62828;font-size:.85rem;font-weight:600}
#allb .ab-l .is-over{outline:2px solid #e5484d;outline-offset:1px;border-radius:3px}`;

  function chapterFile(code) { return `src/course_v2/ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`; }
  const chapters = {};
  function loadChapter(code) {
    const src = chapterFile(code);
    if (!chapters[src]) chapters[src] = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = resolve;
      document.head.appendChild(s);
    });
    return chapters[src];
  }

  async function start() {
    // 先把會用到的模組都載好：畫到一半才抓（有圖的課抓畫圖、筆記本抓筆跡），overview 會自己重試，跟這裡一課接一課的節奏會撞在一起
    for (const g of ["course", "coursestyle", "board", "boardplot", "figures", "ink", "secproof"]) await lazy(g).catch(() => {});
    const outline = window.BUZZ_COURSE_V2;
    if (!outline || !window.BuzzBoard) { console.warn("allboards：課程或黑板模組沒載到"); return; }
    let unlocked = false;
    try { unlocked = localStorage.getItem("buzzcalculus.unlock.v1") === "1"; } catch (_e) { /* 只列公開的 */ }
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    const root = document.createElement("div"); root.id = "allb";
    const bar = document.createElement("div"); bar.className = "ab-bar";
    const body = document.createElement("div"); body.className = "ab-body";
    root.append(bar, body);
    document.body.appendChild(root);
    document.documentElement.style.overflow = "hidden";

    // 課的清單：Stage → 章 → 課；課號照 course_v2_ui.js 的算法（Stage 編號.在 Stage 裡的第幾課）
    const rows = [];
    const stageSel = [];
    outline.stages.forEach((stage) => {
      if (stage.hidden && !unlocked) return;
      const h2 = document.createElement("h2");
      h2.id = `ab-s${stage.n}`;
      h2.textContent = `Stage ${stage.n} · ${stage.title || ""}`;
      body.appendChild(h2);
      stageSel.push(`<option value="ab-s${stage.n}">Stage ${stage.n} · ${stage.title || ""}</option>`);
      let k = 0;
      stage.chapters.forEach((chapter) => {
        const h3 = document.createElement("h3");
        h3.textContent = `${chapter.code} · ${chapter.title || ""}`;
        body.appendChild(h3);
        chapter.lessons.forEach((raw) => {
          k += 1;
          const no = `${stage.n}.${k}`;
          const box = document.createElement("section");
          box.className = "ab-l";
          box.id = `ab-${raw.id}`;
          box.innerHTML = `<div class="ab-h"><span>${no}</span><b></b><a href="#" data-ab-open="${raw.id}">打開這一課</a></div><div class="ab-slot is-wait"></div>`;
          box.querySelector("b").textContent = raw.title;
          body.appendChild(box);
          rows.push({ raw, no, chapter, stage, box, slot: box.querySelector(".ab-slot"), state: "idle", h: 0, text: `${no} ${raw.title} ${chapter.title || ""}`.toLowerCase() });
        });
      });
    });
    bar.innerHTML = `<b>全部課程黑板</b><small>${rows.length} 課${unlocked ? "（含隱藏）" : ""}</small><input type="search" placeholder="找課名、章名、課號…"><select><option value="">跳到 Stage…</option>${stageSel.join("")}</select><small data-ab-status></small><small class="ab-over" data-ab-over></small><button type="button" class="button secondary">關閉</button>`;
    const status = bar.querySelector("[data-ab-status]");
    const overCount = bar.querySelector("[data-ab-over]");
    bar.querySelector("button").addEventListener("click", () => { root.remove(); document.documentElement.style.overflow = ""; });
    bar.querySelector("select").addEventListener("change", (e) => { const t = document.getElementById(e.target.value); if (t) t.scrollIntoView({ block: "start" }); e.target.value = ""; });
    bar.querySelector("input").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      rows.forEach((r) => r.box.classList.toggle("is-hidden", Boolean(q) && !r.text.includes(q)));
    });
    body.addEventListener("click", (e) => {
      const a = e.target.closest("[data-ab-open]");
      if (!a) return;
      e.preventDefault();
      // 回到 app、打開那一課（同 record 腳本的做法：塞一顆 open-course-lesson 按鈕點下去）
      root.remove(); document.documentElement.style.overflow = "";
      const b = document.createElement("button"); b.dataset.action = "open-course-lesson"; b.dataset.lessonId = a.dataset.abOpen;
      const app = document.querySelector("#app"); app.appendChild(b); b.click(); b.remove();
    });

    // 一次畫一課（BuzzBoard 是單例：overview 畫完才換下一課）
    const queue = [];
    let busy = false;
    const records = (() => { try { return host.loadRecords ? host.loadRecords() : {}; } catch (_e) { return {}; } })();
    const deps = { ensureLazy: lazy };
    async function draw(r) {
      await loadChapter(r.chapter.code);
      // 跟課程裡的分節一樣：滑桿互動圖不上板（只在全文）
      const raw = (window.BUZZ_COURSE_V2_LESSONS || {})[r.raw.id];
      const data = window.BuzzCourseV2UI && window.BuzzCourseV2UI.secData ? window.BuzzCourseV2UI.secData(raw) : raw;
      if (!data || !data.sections) { r.slot.innerHTML = `<div class="ab-none">這一課還沒有課文</div>`; return; }
      const before = new Set(document.querySelectorAll(".cvb-ov"));
      const api = {
        m: { id: r.raw.id, title: r.raw.title, no: r.no, stage: r.stage, chapter: r.chapter },
        data, records, deps,
        state: { picks: {}, cs: {}, sec: { si: data.sections.length, shown: data.sections.map((s) => s.beats.length), pred: {}, whr: {}, dragOk: {} } }
      };
      const ok = window.BuzzBoard.overview(api);
      if (!ok) { r.slot.innerHTML = `<div class="ab-none">這一課沒有板書</div>`; return; }
      // 有圖的課會等畫圖模組、筆記本會等筆跡模組：等到彈窗裡出現頁面（或彈窗被關掉＝失敗）
      let ov = null;
      for (let i = 0; i < 300; i += 1) {
        ov = [...document.querySelectorAll(".cvb-ov")].find((n) => !before.has(n));
        if (!ov || ov.querySelector(".cvb-ov-page")) break;
        await new Promise((res) => setTimeout(res, 50));
      }
      if (!ov) { r.slot.innerHTML = `<div class="ab-none">畫不出來</div>`; return; }
      const grid = ov.querySelector(".cvb-ov-grid");
      r.slot.innerHTML = "";
      r.slot.appendChild(grid);
      ov.remove();
      markOverflow(r);
    }
    // 超出頁面右邊的行：畫紅框、課名旁標「N 行超出」（每一面都是同一塊板的複製，只看落在這一面上下範圍裡的那幾行）
    const overSeen = new Set();
    function markOverflow(r) {
      let n = 0;
      r.slot.querySelectorAll(".cvb-ov-page").forEach((pg) => {
        const box = pg.getBoundingClientRect();
        pg.querySelectorAll(".cvb-i").forEach((it) => {
          const ir = it.getBoundingClientRect();
          if (!ir.width || ir.bottom <= box.top + 2 || ir.top >= box.bottom - 2) return;
          // 右邊出頁、或從這一頁開始寫卻跨到下一頁（被切成兩半）
          if (ir.right > box.right + 2 || (ir.top >= box.top - 2 && ir.bottom > box.bottom + 2)) { it.classList.add("is-over"); n += 1; }
        });
      });
      const head = r.box.querySelector(".ab-h");
      const old = head.querySelector(".ab-over");
      if (old) old.remove();
      if (!n) return;
      const tag = document.createElement("span");
      tag.className = "ab-over";
      tag.textContent = `${n} 行超出頁面`;
      head.insertBefore(tag, head.querySelector("a"));
      overSeen.add(r.raw.id);
      overCount.textContent = `超出頁面：${overSeen.size} 課（目前畫過的）`;
    }
    async function pump() {
      if (busy) return;
      busy = true;
      while (queue.length) {
        // 挑離畫面頂端最近的那一課（一課約 1.5 秒，跳到某一課時不要先畫它旁邊的）
        const dist = (x) => Math.abs(x.slot.getBoundingClientRect().top - 60);
        let bi = 0;
        queue.forEach((x, i) => { if (dist(x) < dist(queue[bi])) bi = i; });
        const r = queue.splice(bi, 1)[0];
        if (r.state !== "queued") continue;
        const box = r.slot.getBoundingClientRect();
        if (box.bottom < -2 * innerHeight || box.top > 3 * innerHeight) { r.state = "idle"; continue; }
        r.state = "drawing";
        status.textContent = `畫 ${r.no} ${r.raw.title}…`;
        try { await draw(r); } catch (e) { r.slot.innerHTML = `<div class="ab-none">出錯：${String(e && e.message || e)}</div>`; }
        r.slot.classList.remove("is-wait");
        r.slot.style.minHeight = "";
        r.state = "shown";
        r.h = r.slot.offsetHeight;
        if (r.far) unload(r);
      }
      status.textContent = "";
      busy = false;
    }
    function unload(r) {
      if (r.state !== "shown") return;
      r.h = r.slot.offsetHeight || r.h;
      r.slot.innerHTML = "";
      r.slot.style.minHeight = `${r.h}px`;
      r.slot.classList.add("is-wait");
      r.state = "idle";
    }
    // 近的畫、遠的收：畫的範圍上下各 1.5 個螢幕，收的範圍上下各 6 個螢幕（中間有緩衝，不會來回閃）
    const near = new IntersectionObserver((es) => es.forEach((e) => {
      const r = e.target.__ab;
      r.far = false;
      if (e.isIntersecting && r.state === "idle") { r.state = "queued"; queue.push(r); pump(); }
    }), { root, rootMargin: "150% 0px" });
    const far = new IntersectionObserver((es) => es.forEach((e) => {
      const r = e.target.__ab;
      if (!e.isIntersecting) { r.far = true; if (r.state === "queued") r.state = "idle"; else unload(r); }
    }), { root, rootMargin: "600% 0px" });
    rows.forEach((r) => { r.slot.__ab = r; near.observe(r.slot); far.observe(r.slot); });
    // 網址帶 #ab-<課 id> 就跳過去
    const jump = /^#ab-(.+)$/.exec(location.hash || "");
    if (jump) { const t = document.getElementById(`ab-${jump[1]}`); if (t) t.scrollIntoView({ block: "start" }); }
  }

  const go = () => start().catch((e) => console.error("allboards", e));
  if (document.readyState === "complete") setTimeout(go, 300); else window.addEventListener("load", () => setTimeout(go, 300));
})();
