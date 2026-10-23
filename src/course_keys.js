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
        if (!has(lines[k])) boxed.push({ l: lines[k], box: true, term: a.term });
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
.ck-card .ck-line{font-size:clamp(1.15rem,3.4vw,1.7rem);line-height:1.8;overflow-x:auto;overflow-y:hidden;max-width:100%;padding:10px 14px;border:2px solid transparent;border-radius:10px}.ck-card .ck-line.is-box{border-color:var(--red)}
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

  /* ── 翻牌卡：讀完的課，框起來的那一格挖空；記得就隔久一點再出、忘了明天再來 ── */
  // 一張卡＝一個 beat 的重點（keysOf 的一筆）；正面把框住的 {{term:…}} 換成空格，翻過來看整行。
  // 排程存 records.flash = { cards: { 卡號: { b: 0–5, due: "YYYY-MM-DD", first, last } } }（本地日期；首頁「今天三件事」直接讀這張表）；
  // 記得：b+1、隔 GAP[b] 天；忘了：b=0、明天，這一輪最後再出一次。新卡一天最多 NEW_PER_DAY 張。
  const GAP = [1, 3, 7, 14, 30, 60];
  const NEW_PER_DAY = 10;
  const HOLE = "";
  const dayKey = (plus = 0) => { const d = new Date(); d.setDate(d.getDate() + plus); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const dollars = (s) => (s.match(/(?<!\\)\$/g) || []).length;
  // 一行裡的 {{term:…}} 換成空格：在式子裡是 \boxed{?}，在中文裡是一個方格；找不到或會拆壞 $ 配對就回 null
  function cloze(raw, term) {
    const at = raw.indexOf(`{{${term}:`);
    if (at < 0) return null;
    let i = at + term.length + 3;
    let depth = 0;
    for (; i < raw.length; i += 1) {
      const c = raw[i];
      if (c === "\\") { i += 1; continue; }
      if (c === "{") depth += 1;
      else if (c === "}") { if (!depth && raw[i + 1] === "}") break; depth -= 1; }
    }
    if (i >= raw.length || dollars(raw.slice(at, i)) % 2) return null;
    const inMath = dollars(raw.slice(0, at)) % 2;
    return raw.slice(0, at) + (inMath ? keepLeft(raw.slice(at + term.length + 3, i)) : HOLE) + raw.slice(i + 2);
  }
  // 框住的幾乎都是一整條式子：留左邊、挖右邊（f(x)= ？）。看第一個最外層的關係符號（=、<、\le、\approx…）；
  // 開頭就是「=」的（接著前一行算下去）挖等號後面；aligned 留第一列 & 前面；找不到關係就整條挖掉
  const BLANK = "\\boxed{\\;?\\;}";
  function keepLeft(src) {
    const s = src.replace(/^\s*\\displaystyle\s*/, "");
    const rel = (t, j) => { const m = /^(=|<|>|\\(?:le|ge|leq|geq|approx|equiv|sim|Rightarrow|iff|to|ne)(?![A-Za-z]))/.exec(t.slice(j)); return m ? m[0] : ""; };
    const al = /^\{?\\begin\{aligned\}/.exec(s);
    if (al) {
      const amp = s.indexOf("&", al[0].length);
      const r = amp > 0 ? rel(s, amp + 1) : "";
      return r ? `\\displaystyle ${s.slice(0, amp + 1 + r.length)}${BLANK}\\end{aligned}${al[0][0] === "{" ? "}" : ""}` : BLANK;
    }
    let depth = 0;
    for (let j = 0; j < s.length; j += 1) {
      const c = s[j];
      const r = depth ? "" : rel(s, j);
      if (r) return `\\displaystyle ${s.slice(0, j + r.length)}${BLANK}`;
      if (c === "\\") j += (/^\\[A-Za-z]+|^\\./.exec(s.slice(j)) || [" "])[0].length - 1;
      else if (c === "{") depth += 1;
      else if (c === "}") depth -= 1;
    }
    return BLANK;
  }
  const holeHtml = (line) => html(line).split(HOLE).join('<span class="fl-hole">？</span>');
  // 卡的正面：前一行照抄、框住的那一行挖空（挖不了就整行藏起來）
  const front = (k) => k.lines.map((x) => {
    if (!x.box) return `<div class="ck-line">${html(x.l)}</div>`;
    const c = x.term && cloze(x.l, x.term);
    return `<div class="ck-line is-box">${c ? holeHtml(c) : '<span class="fl-hole">？</span>'}</div>`;
  }).join("");
  const back = (k) => k.lines.map((x) => `<div class="ck-line${x.box ? " is-box" : ""}">${html(x.l)}</div>`).join("");
  const FL_CSS = `.fl-card{cursor:pointer;min-height:44vh}.fl-card:focus-visible{outline:3px solid var(--brand);outline-offset:3px}
.fl-hole{display:inline-block;min-width:3em;padding:0 .4em;border-bottom:2px solid var(--red);color:var(--red);font-weight:700}
.fl-tag{color:var(--muted);font-size:.85rem}.fl-flip{color:var(--muted);font-size:.85rem}
.fl-grade{display:flex;justify-content:center;gap:12px;margin:16px auto 0}.fl-grade .button{min-width:9em}
.fl-done{display:grid;gap:10px;justify-items:center;max-width:560px;margin:10vh auto;text-align:center}.fl-done b{font-size:1.4rem}`;
  // o = { lessons: [{ id, no, title, chapter: { code } }]（讀完的課，照課號順序）, load(), save(records) }
  async function flash(o) {
    const { ov, shut } = overlay("ck-flash");
    if (!document.getElementById("fl-style")) { const st = document.createElement("style"); st.id = "fl-style"; st.textContent = FL_CSS; document.head.appendChild(st); }
    ov.innerHTML = `<div class="ck-bar"><b>翻牌卡</b><span class="ck-grow"></span><button type="button" class="button secondary" data-ck="close">關閉</button></div><p class="ck-empty">整理卡片中…</p>`;
    await Promise.all([...new Set(o.lessons.map((m) => m.chapter.code))].map(loadChapter));
    if (!ov.isConnected) return;
    const L = window.BUZZ_COURSE_V2_LESSONS || {};
    const today = dayKey();
    const all = [];
    o.lessons.forEach((m) => keysOf(L[m.id]).forEach((k) => all.push({ id: `${m.id}:${k.si}.${k.bi}`, m, k })));
    const cards = ((o.load().flash || {}).cards) || {};
    const fresh = Math.max(0, NEW_PER_DAY - Object.values(cards).filter((c) => c && c.first === today).length);
    const queue = all.filter((c) => cards[c.id] && cards[c.id].due <= today).concat(all.filter((c) => !cards[c.id]).slice(0, fresh));
    const again = new Set();
    let at = 0;
    let flipped = false;
    let right = 0;
    function grade(ok) {
      const c = queue[at];
      const r = o.load();
      r.flash = { ...(r.flash || {}), cards: { ...((r.flash || {}).cards || {}) } };
      const was = r.flash.cards[c.id];
      // 這一輪忘過的，最後補看那次記得也只算「明天再來」（不升級）
      const b = ok && !again.has(c.id) ? Math.min(GAP.length - 1, (was ? was.b : 0) + 1) : 0;
      r.flash.cards[c.id] = { b, due: dayKey(GAP[b]), first: (was && was.first) || today, last: today };
      o.save(r);
      if (ok && !again.has(c.id)) right += 1;
      // 忘了的這一輪最後再看一次（只補一次，不會無限循環）
      else if (!again.has(c.id)) { again.add(c.id); queue.push(c); }
      at += 1;
      flipped = false;
      paint();
    }
    function paint() {
      const bar = `<div class="ck-bar"><b>翻牌卡</b><small>${at < queue.length ? `${at + 1} / ${queue.length}` : ""}</small><span class="ck-grow"></span><button type="button" class="button secondary" data-ck="close">關閉</button></div>`;
      if (!all.length) { ov.innerHTML = `${bar}<p class="ck-empty">讀完一課，那一課框起來的重點就會變成翻牌卡。</p>`; return; }
      if (at >= queue.length) {
        const r = o.load();
        const cs = (r.flash || {}).cards || {};
        const tomorrow = Object.values(cs).filter((c) => c && c.due <= dayKey(1)).length;
        const left = all.filter((c) => !cs[c.id]).length;
        ov.innerHTML = `${bar}<div class="fl-done">${queue.length ? `<b>今天的翻完了</b><span>記得 ${right} 張${again.size ? `、忘了 ${again.size} 張（明天再來）` : ""}</span>` : "<b>今天沒有要翻的</b>"}
          <small class="fl-tag">明天到期 ${tomorrow} 張${left ? ` · 還有 ${left} 張新卡，每天放 ${NEW_PER_DAY} 張` : ""}</small>
          <button type="button" class="button home-primary" data-ck="close">好</button></div>`;
        const b = ov.querySelector(".fl-done .button");
        if (b) b.focus();
        return;
      }
      const c = queue[at];
      ov.innerHTML = `${bar}
        <div class="ck-card fl-card" tabindex="0" role="button" data-ck="flip" aria-label="${flipped ? "答案" : "翻面"}" aria-live="polite">
          <span class="fl-tag">${esc(c.m.no)} ${esc(c.m.title)} · ${esc(c.k.title)}${cards[c.id] ? "" : " · 新卡"}</span>
          ${flipped ? back(c.k) : front(c.k)}
          ${flipped ? "" : '<span class="fl-flip">點一下翻面（空白鍵）</span>'}
        </div>
        ${flipped ? `<div class="fl-grade"><button type="button" class="button secondary" data-ck="forgot">忘了 <kbd>1</kbd></button><button type="button" class="button home-primary" data-ck="knew">記得 <kbd>2</kbd></button></div>` : ""}`;
      const f = ov.querySelector(flipped ? '[data-ck="knew"]' : ".fl-card");
      if (f) f.focus();
    }
    ov.addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest("[data-ck]");
      if (!b) return;
      const k = b.dataset.ck;
      if (k === "close") shut();
      if (k === "flip" && !flipped) { flipped = true; paint(); }
      if (k === "knew") grade(true);
      if (k === "forgot") grade(false);
    });
    const onKey = (e) => {
      if (at >= queue.length || e.ctrlKey || e.metaKey || e.altKey) return;
      if (!flipped && (e.key === " " || e.key === "Enter")) { e.preventDefault(); flipped = true; paint(); return; }
      if (flipped && e.key === "1") { e.preventDefault(); grade(false); }
      if (flipped && e.key === "2") { e.preventDefault(); grade(true); }
    };
    document.addEventListener("keydown", onKey);
    ov.addEventListener("ck-close", () => document.removeEventListener("keydown", onKey));
    paint();
  }

  window.BuzzCourseKeys = { keysOf, html, review, sheet, flash, cloze };
})();
