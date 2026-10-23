// ── 課的重點：三分鐘複習、考前一張紙（data-lazy="keys"，course_v2_ui.js 點了才抓）──
// 重點＝作者在板上框起來的那一行（box 動作圈住的 {{bxN:…}}）。一課中位數 7 條、那幾句念起來約 70 秒（最長 160 秒）。
//   三分鐘複習：一條一張卡，念那一句的錄音（整課一支 mp3，句子的 t = [起, 訖] 毫秒），念完自己下一條。
//   考前一張紙：勾幾課，把框起來的式子排成 A4，列印／存 PDF。
// 畫面都是疊在最上面的一層（跟「攤開整本」一樣），不換頁、不動 app 的 view。
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // {{id:…}} 拿掉外殼留內容（可以巢狀；大括號照算）
  function strip(src) {
    let out = "";
    const st = [];
    for (let i = 0; i < src.length; i += 1) {
      const c = src[i];
      const m = c === "{" && /^\{\{([a-z][a-z0-9]{0,7}):/.exec(src.slice(i, i + 12));
      if (c === "\\") { out += c + (src[i + 1] || ""); i += 1; } else if (m) { out += "{"; st.push(1); i += m[0].length - 1; } else if (c === "}" && st[st.length - 1] === 1 && src[i + 1] === "}") { out += "}"; st.pop(); i += 1; } else { if (c === "{") st.push(0); if (c === "}") st.pop(); out += c; }
    }
    return out;
  }
  // 一行（中文＋$式子$）→ HTML
  function html(line) {
    return strip(String(line)).split(/(?<!\\)\$/).map((p, i) => {
      if (!(i % 2)) return esc(p);
      try { return window.katex.renderToString(p, { throwOnError: false, strict: "ignore", output: "html" }); } catch (_e) { return esc(p); }
    }).join("");
  }
  // 一課的重點：框住的那一行、它在哪一節哪一句（那一句的錄音時間）
  function keysOf(data) {
    const out = [];
    if (!data || !data.sections) return out;
    const lines = [];
    data.sections.forEach((s) => s.beats.forEach((b) => (b.board || []).forEach((a) => { if (typeof a.line === "string") lines.push(a.line); })));
    data.sections.forEach((s, si) => s.beats.forEach((b, bi) => {
      // 框住的是一串計算的後半（「= 3·2² − 5·2 + 1 = 3」）：前一行一起帶，不然單獨看不知道在算什麼
      const cont = (l) => /^\s*\$?\s*(\\displaystyle\s*)?(\{\{[a-z0-9]+:)?\s*(\\displaystyle\s*)?(=|<|>|\\le|\\ge|\\approx|\\to)/.test(l);
      const boxed = [];
      (b.board || []).filter((a) => a.do === "box" && a.term).forEach((a) => {
        const k = lines.findIndex((l) => l.includes(`{{${a.term}:`));
        if (k < 0) return;
        const has = (l) => boxed.some((x) => x.l === l);
        if (cont(lines[k]) && k > 0 && !has(lines[k - 1])) boxed.push({ l: lines[k - 1], box: false });
        if (!has(lines[k])) boxed.push({ l: lines[k], box: true });
      });
      if (boxed.length) out.push({ si, bi, title: s.title || "", lines: boxed, t: Array.isArray(b.t) ? b.t : null });
    }));
    return out;
  }

  const CSS = `.ck-ov{position:fixed;inset:0;z-index:80;overflow-y:auto;overscroll-behavior:contain;background:color-mix(in srgb,var(--paper) 96%,#000);padding:0 16px 40px}
.ck-bar{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;max-width:1100px;margin:0 auto;padding:12px 0;background:inherit}
.ck-bar b{font-size:1.02rem}.ck-bar small{color:var(--muted)}.ck-bar .ck-grow{flex:1}
.ck-card{display:grid;place-items:center;gap:14px;max-width:880px;min-height:52vh;margin:4vh auto 0;padding:28px 24px;border-radius:14px;background:var(--panel);box-shadow:0 6px 24px #0000001a;text-align:center}
.ck-card .ck-sec{color:var(--muted);font-size:.9rem}
.ck-card .ck-line{font-size:clamp(1.15rem,3.4vw,1.7rem);line-height:1.8;overflow-x:auto;max-width:100%;padding:6px 14px;border:2px solid transparent;border-radius:10px}.ck-card .ck-line.is-box{border-color:var(--red)}
.ck-dots{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:880px;margin:16px auto 0}
.ck-dots button{width:30px;height:30px;border:1px solid var(--line);border-radius:50%;background:var(--surface);color:var(--ink);font:inherit;font-size:.8rem;cursor:pointer}
.ck-dots button.is-on{border-color:var(--ink);background:var(--ink);color:var(--paper)}.ck-dots button.is-seen{border-color:var(--gold)}
.ck-ctl{display:flex;justify-content:center;gap:10px;margin:16px auto 0}
.ck-empty{max-width:640px;margin:10vh auto;text-align:center;color:var(--muted)}
.ck-pick{max-width:1100px;margin:0 auto 14px;padding:10px 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.ck-pick summary{cursor:pointer;font-weight:700}
.ck-pick fieldset{margin:10px 0 0;padding:0;border:0}.ck-pick legend{font-weight:700;font-size:.9rem;margin:8px 0 4px}
.ck-pick label{display:inline-flex;align-items:center;gap:4px;margin:2px 12px 2px 0;font-size:.88rem}
.ck-sheet{box-sizing:border-box;width:min(100%,210mm);margin:0 auto;padding:12mm 11mm;background:#fff;color:#111;box-shadow:0 4px 18px #0000002a;column-count:2;column-gap:8mm;column-rule:1px solid #e3e3e3;font-size:10.5pt;line-height:1.45}
.ck-sheet h1{column-span:all;margin:0 0 4mm;font-size:14pt}.ck-sheet h1 small{margin-left:8px;color:#666;font-size:9pt;font-weight:400}
.ck-sheet section{break-inside:avoid;margin:0 0 3.5mm}.ck-sheet h2{margin:0 0 1.2mm;font-size:10pt;color:#9a3412}
.ck-sheet p{margin:0 0 1.2mm;overflow-wrap:anywhere}.ck-sheet .katex{font-size:1.02em}
@media (max-width:640px){.ck-sheet{column-count:1;padding:8mm 6mm}}
@media print{@page{size:A4;margin:0}body>:not(.ck-ov){display:none!important}.ck-ov{position:static;overflow:visible;padding:0;background:none}.ck-bar,.ck-pick{display:none}.ck-sheet{width:auto;box-shadow:none}}`;
  function overlay(cls) {
    if (!document.getElementById("ck-style")) { const st = document.createElement("style"); st.id = "ck-style"; st.textContent = CSS; document.head.appendChild(st); }
    const ov = document.createElement("div");
    ov.className = `ck-ov ${cls}`;
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    document.body.appendChild(ov);
    const onKey = (e) => { if (e.key === "Escape") shut(); };
    const shut = () => { ov.dispatchEvent(new Event("ck-close")); ov.remove(); document.removeEventListener("keydown", onKey); };
    document.addEventListener("keydown", onKey);
    return { ov, shut };
  }

  /* ── 三分鐘複習：一條一張卡、念那一句、念完自己下一條 ── */
  // o = { id, title, data }（data＝這一課的課文，旁白的檔名在 data.voice、每一句的時間在 beat.t）
  function review(o) {
    const keys = keysOf(o.data);
    const { ov, shut } = overlay("ck-review");
    const base = (window.BUZZ_COURSE_V2 && window.BUZZ_COURSE_V2.narration) || "media/narration/";
    const audio = o.data && o.data.voice && keys.some((k) => k.t) ? new Audio(`${base}${o.id}-${o.data.voice}.mp3`) : null;
    const total = keys.reduce((n, k) => n + (k.t ? k.t[1] - k.t[0] : 4000), 0);
    const mmss = (ms) => `${Math.floor(ms / 60000)} 分 ${Math.round((ms % 60000) / 1000)} 秒`;
    let at = 0;
    let playing = Boolean(audio);
    let timer = 0;
    const seen = new Set();
    const stop = () => { window.clearTimeout(timer); if (audio) audio.pause(); };
    const next = () => { if (at < keys.length - 1) { at += 1; show(); } else { playing = false; stop(); paint(); } };
    function speak() {
      stop();
      const k = keys[at];
      if (!playing) return;
      if (!audio || !k.t) { timer = window.setTimeout(next, 4000); return; }
      audio.currentTime = k.t[0] / 1000;
      const p = audio.play();
      if (p && p.catch) p.catch(() => { playing = false; paint(); });
      const tick = () => { if (!playing) return; if (audio.currentTime * 1000 >= k.t[1] - 30) { audio.pause(); timer = window.setTimeout(next, 700); } else timer = window.setTimeout(tick, 80); };
      tick();
    }
    function paint() {
      const k = keys[at];
      seen.add(at);
      ov.innerHTML = `
        <div class="ck-bar"><b>三分鐘複習 · ${esc(o.title || "")}</b><small>${keys.length} 條重點${audio ? ` · 約 ${mmss(total)}` : ""}</small><span class="ck-grow"></span><button type="button" class="button secondary" data-ck="close">關閉</button></div>
        ${keys.length ? `
          <div class="ck-card" aria-live="polite"><span class="ck-sec">${at + 1} / ${keys.length} · ${esc(k.title)}</span>${k.lines.map((x) => `<div class="ck-line${x.box ? " is-box" : ""}">${html(x.l)}</div>`).join("")}</div>
          <div class="ck-ctl">
            <button type="button" class="button secondary" data-ck="prev" ${at ? "" : "disabled"}>上一條</button>
            ${audio ? `<button type="button" class="button home-primary" data-ck="play">${playing ? "暫停" : "播放"}</button>` : ""}
            <button type="button" class="button secondary" data-ck="next" ${at < keys.length - 1 ? "" : "disabled"}>下一條</button>
          </div>
          <div class="ck-dots">${keys.map((_k, i) => `<button type="button" data-ck="go" data-i="${i}" class="${i === at ? "is-on" : seen.has(i) ? "is-seen" : ""}" aria-label="第 ${i + 1} 條">${i + 1}</button>`).join("")}</div>` : `<p class="ck-empty">這一課沒有框起來的重點。</p>`}`;
    }
    function show() { paint(); speak(); }
    ov.addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest("[data-ck]");
      if (!b) return;
      const k = b.dataset.ck;
      if (k === "close") { shut(); return; }
      if (k === "play") { playing = !playing; paint(); speak(); return; }
      if (k === "prev" && at > 0) at -= 1;
      if (k === "next" && at < keys.length - 1) at += 1;
      if (k === "go") at = Number(b.dataset.i);
      show();
    });
    ov.addEventListener("ck-close", () => { playing = false; stop(); if (audio) { audio.removeAttribute("src"); audio.load(); } });
    show();
    const c = ov.querySelector('[data-ck="close"]');
    if (c) c.focus();
  }

  /* ── 考前一張紙：勾課 → 框起來的式子排成 A4 ── */
  const chapterFile = (code) => `src/course_v2/ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;
  const loading = {};
  function loadChapter(code) {
    const src = chapterFile(code);
    if (!loading[src]) loading[src] = new Promise((resolve) => { const s = document.createElement("script"); s.src = src; s.onload = resolve; s.onerror = resolve; document.head.appendChild(s); });
    return loading[src];
  }
  // o = { lessons: [{ id, title, no, chapter: { code, title }, stage: { n, title } }], done: Set(id) }（course_v2_ui.js 給）
  function sheet(o) {
    const { ov, shut } = overlay("ck-sheet-ov");
    const picked = new Set(o.lessons.filter((m) => o.done.has(m.id)).map((m) => m.id));
    if (!picked.size && o.lessons[0]) picked.add(o.lessons[0].id);
    const byStage = [];
    o.lessons.forEach((m) => { let g = byStage.find((x) => x.stage === m.stage); if (!g) { g = { stage: m.stage, list: [] }; byStage.push(g); } g.list.push(m); });
    async function paint() {
      const list = o.lessons.filter((m) => picked.has(m.id));
      await Promise.all([...new Set(list.map((m) => m.chapter.code))].map(loadChapter));
      const L = window.BUZZ_COURSE_V2_LESSONS || {};
      const blocks = list.map((m) => ({ m, keys: keysOf(L[m.id]) })).filter((b) => b.keys.length);
      const n = blocks.reduce((s, b) => s + b.keys.length, 0);
      ov.innerHTML = `
        <div class="ck-bar"><b>考前一張紙</b><small>${list.length} 課 · ${n} 條重點（作者框起來的）</small><span class="ck-grow"></span>
          <button type="button" class="button home-primary" data-ck="print">列印／存成 PDF</button><button type="button" class="button secondary" data-ck="close">關閉</button></div>
        <details class="ck-pick" ${picked.size <= 1 ? "open" : ""}><summary>選課（預設是完成過的課）</summary>
          ${byStage.map((g) => `<fieldset><legend>Stage ${esc(g.stage.n)} · ${esc(g.stage.title)} <button type="button" class="link-button" data-ck="stage" data-n="${esc(g.stage.n)}">全選／全不選</button></legend>
            ${g.list.map((m) => `<label><input type="checkbox" data-ck-id="${esc(m.id)}" ${picked.has(m.id) ? "checked" : ""}>${esc(m.no)} ${esc(m.title)}</label>`).join("")}</fieldset>`).join("")}
        </details>
        <article class="ck-sheet">
          <h1>微積分重點<small>${list.length} 課 · BuzzCalculus</small></h1>
          ${blocks.length ? blocks.map((b) => `<section><h2>${esc(b.m.no)} ${esc(b.m.title)}</h2>${b.keys.map((k) => k.lines.map((x) => `<p>${html(x.l)}</p>`).join("")).join("")}</section>`).join("") : "<p>勾幾課，這裡就會排出那幾課框起來的重點。</p>"}
        </article>`;
    }
    ov.addEventListener("change", (e) => {
      const id = e.target && e.target.dataset && e.target.dataset.ckId;
      if (!id) return;
      if (e.target.checked) picked.add(id); else picked.delete(id);
      paint();
    });
    ov.addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest("[data-ck]");
      if (!b) return;
      if (b.dataset.ck === "close") shut();
      if (b.dataset.ck === "print") window.print();
      if (b.dataset.ck === "stage") {
        const g = byStage.find((x) => String(x.stage.n) === b.dataset.n);
        const all = g.list.every((m) => picked.has(m.id));
        g.list.forEach((m) => (all ? picked.delete(m.id) : picked.add(m.id)));
        paint().then(() => { const d = ov.querySelector(".ck-pick"); if (d) d.open = true; });
      }
    });
    paint();
  }

  window.BuzzCourseKeys = { keysOf, html, review, sheet };
})();
