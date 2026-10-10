// ── 證明節（lesson.sections[].proof；規格見 tools/content/course_v2/SCHEMA.md 的「證明節」）──
//
// data-lazy="secproof"：只有打開「有證明節的課」才由 course_sections.js 抓這一支（分節那一組的預算滿了，其他課一個位元組都不付）。
// 這一支只畫三種互動、改 api.state.sec 上自己的那幾格；記 XP、念旁白、整頁重繪都在 course_sections.js：
//   句子的 why：「這一步為什麼成立？」三選一，答對（或「直接看」）才出白話（note）與下一句；選錯看那個選項的 why、可以再選。
//   節的 order：把 3–5 步證明排回順序（洗牌固定：同一課同一節每次一樣，而且絕不是排好的）；點錯一步搖一下、說要先有什麼，排好的留著。
//   節的 where：「〈假設〉用在哪一步？」證明的步驟照順序列出來，點一步；選錯看 why。
// act() 回傳：0 沒事、1 重畫、2 這一節的動作做完（course_sections 記 +5 XP）、3 這一句的白話打開了（播放開著就接著念）。

(function () {
  "use strict";

  const STYLE = `
.cv2p-tag { display: inline-block; margin: 0 0 0 8px; padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, var(--blue) 12%, var(--paper)); color: var(--blue); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.04em; vertical-align: 0.15em; white-space: nowrap; }
.cv2s-bar:empty { display: none; }
.cv2p-why .course-check-options, .cv2p-where .course-check-options { display: grid; gap: 8px; }
.cv2p-why .course-option, .cv2p-where .course-option, .cv2p-left .course-option { min-height: 44px; text-align: left; }
.cv2p-see { display: inline-flex; align-items: center; gap: 4px; min-height: 40px; margin: 6px 0 0; padding: 0 4px; border: 0; background: none; color: var(--muted); font: inherit; font-size: 0.9rem; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.cv2p-see svg { width: 15px; height: 15px; }
.cv2p-num { display: inline-flex; align-items: center; justify-content: center; flex: none; min-width: 22px; height: 22px; margin-right: 8px; border-radius: 50%; background: color-mix(in srgb, var(--ink) 8%, var(--paper)); font-size: 0.78rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.cv2p-where .course-option { display: flex; align-items: center; width: 100%; }
.cv2p-built { display: grid; gap: 6px; margin: 0 0 12px; padding: 0; list-style: none; }
.cv2p-built li { display: flex; align-items: center; min-height: 40px; padding: 6px 12px; border-left: 3px solid var(--green); border-radius: 0 10px 10px 0; background: color-mix(in srgb, var(--green) 8%, var(--paper)); line-height: 1.6; overflow-wrap: anywhere; }
.cv2p-built li.is-slot { border-left-color: var(--line); background: none; color: var(--muted); }
.cv2p-left { display: grid; gap: 8px; }
.cv2p-left .is-shake { animation: cv2p-shake 0.36s ease-in-out; border-color: var(--red, #c0392b); }
@keyframes cv2p-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
@media (prefers-reduced-motion: reduce) { .cv2p-left .is-shake { animation: none; } }
.cv2p-live:empty { display: none; }
.cv2p-whyline { margin: 0 0 14px; }
.cv2p-where ol.course-check-options { margin: 0; padding: 0; list-style: none; }
`;

  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cv2p-style")) return;
    const node = document.createElement("style");
    node.id = "cv2p-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  // 固定的洗牌：種子是「課 id + 節」（FNV-1a ＋ xorshift），測試與重開都一樣；洗出來剛好排好就整個轉一格
  function shuffle(n, seed) {
    let h = 2166136261;
    for (const c of String(seed)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const idx = Array.from({ length: n }, (_v, i) => i);
    for (let i = n - 1; i > 0; i -= 1) {
      h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
      const j = h % (i + 1);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (idx.every((v, i) => v === i)) idx.push(idx.shift());
    return idx;
  }

  const slot = (sec, name) => (sec[name] = sec[name] || {});
  const strip = (s) => String(s || "").replace(/\$/g, "");
  let focusTo = "";
  function refocus() {
    const sel = focusTo;
    focusTo = "";
    if (!sel) return;
    window.setTimeout(() => {
      const el = document.querySelector(sel);
      if (el && el.focus) el.focus({ preventScroll: true });
    }, 0);
  }

  function tag(api, s) {
    injectStyle();
    return `<span class="cv2p-tag">證明${s.skeleton ? ` · ${api.deps.escapeHtml(s.skeleton)}` : ""}</span>`;
  }

  // 句子的「為什麼」：還沒答 = 三個選項＋直接看；答了 = 對的那個打勾（下一句在按鈕列）
  function why(api, si, bi) {
    injectStyle();
    const { fmt, rich, data, deps } = api;
    const { icon } = deps;
    const w = data.sections[si].beats[bi].why;
    const st = slot(api.state.sec, "why")[`${si}-${bi}`] || {};
    const picks = st.picks || [];
    const open = Boolean(st.open);
    const right = picks.some((oi) => w.options[oi].correct);
    const wrongs = picks.filter((oi) => !w.options[oi].correct);
    return `
      <div class="cv2s-act course-check cv2p-why ${right ? "is-right" : wrongs.length ? "is-wrong" : ""}" data-cv2s-act="why" role="group" aria-label="這一步為什麼成立">
        <p class="course-check-ask">${icon("lightbulb")}<span>${rich(w.ask || "這一步為什麼成立？", data)}</span></p>
        <div class="course-check-options">
          ${w.options.map((o, oi) => `
            <button type="button" class="course-option ${open && o.correct ? "is-correct" : ""} ${picks.includes(oi) && !o.correct ? "is-picked" : ""}" data-action="course-s-why" data-beat="${bi}" data-option="${oi}" ${open || picks.includes(oi) ? "disabled" : ""}>${fmt(o.label)}</button>`).join("")}
        </div>
        <div aria-live="polite">
          ${wrongs.map((oi) => `<p class="course-check-why">${fmt(w.options[oi].label)}：${rich(w.options[oi].why, data)}</p>`).join("")}
          ${right ? `<p class="course-check-why is-right">${icon("check")}對了</p>` : open ? `<p class="course-check-why">答案是 ${fmt(w.options.find((o) => o.correct).label)}</p>` : ""}
        </div>
        ${open ? "" : `<button type="button" class="cv2p-see" data-action="course-s-see" data-beat="${bi}">${icon("eye")}直接看</button>`}
      </div>`;
  }

  // 節的動作：排順序或用在哪一步
  function view(api, si) {
    injectStyle();
    const s = api.data.sections[si];
    // 最後一句也問了為什麼：動作頂端留一行答案（問題卡收掉，動作不被擠到下面）
    const bi = s.beats.length - 1;
    const w = s.beats[bi].why;
    let pre = "";
    if (w) {
      const st = slot(api.state.sec, "why")[`${si}-${bi}`] || {};
      const right = (st.picks || []).some((oi) => w.options[oi].correct);
      pre = `<p class="course-check-why cv2p-whyline ${right ? "is-right" : ""}">${right ? `${api.deps.icon("check")}對了：` : "答案是 "}${api.fmt(w.options.find((o) => o.correct).label)}</p>`;
    }
    return s.order ? orderView(api, si, s.order, pre) : whereView(api, si, s.where, pre);
  }

  function orderView(api, si, o, pre) {
    const { fmt, rich, data, deps, m } = api;
    const { icon, escapeAttr } = deps;
    const st = slot(api.state.sec, "ord")[si] || { got: [] };
    const got = st.got || [];
    const n = o.steps.length;
    const done = got.length === n;
    const left = shuffle(n, `${m.id}#${si}`).filter((j) => !got.includes(j));
    const shake = st.shake;
    st.shake = -1;
    const live = done ? `排好了：${n} 步都對。` : st.miss >= 0 ? `還不行：${strip(o.steps[st.miss].why)}` : got.length ? `第 ${got.length} 步：${strip(o.steps[got[got.length - 1]].label)}。還有 ${n - got.length} 步。` : "";
    return `
      <div class="cv2s-act course-check cv2p-order ${done ? "is-right" : ""}" data-cv2s-act="order" role="group" aria-label="把證明排回順序">
        ${pre}
        <p class="course-check-ask">${icon("list-checks")}<span>${rich(o.ask || "把證明排回順序：依序點每一步", data)}</span></p>
        <ol class="cv2p-built" aria-label="排好的步驟">
          ${o.steps.map((_x, k) => (k < got.length
            ? `<li><span class="cv2p-num">${k + 1}</span><span>${fmt(o.steps[got[k]].label)}</span></li>`
            : `<li class="is-slot"><span class="cv2p-num">${k + 1}</span><span class="sr-only">還沒排</span></li>`)).join("")}
        </ol>
        ${done ? "" : `<div class="cv2p-left">${left.map((j) => `
          <button type="button" class="course-option ${shake === j ? "is-shake is-picked" : ""}" data-action="course-s-ord" data-step="${j}" aria-label="${escapeAttr(`${strip(o.steps[j].label)}：放在第 ${got.length + 1} 步`)}">${fmt(o.steps[j].label)}</button>`).join("")}
        </div>`}
        <p class="course-check-why cv2p-live ${done ? "is-right" : ""}" data-cv2p-live>${done ? `${icon("check")}順序對了` : st.miss >= 0 ? `還不行：${rich(o.steps[st.miss].why, data)}` : ""}</p>
        <p class="sr-only" aria-live="polite">${live}</p>
      </div>`;
  }

  function whereView(api, si, w, pre) {
    const { fmt, rich, data, deps } = api;
    const { icon } = deps;
    const picks = slot(api.state.sec, "whr")[si] || [];
    const right = picks.some((oi) => w.steps[oi].correct);
    const wrongs = picks.filter((oi) => !w.steps[oi].correct);
    return `
      <div class="cv2s-act course-check cv2p-where ${right ? "is-right" : wrongs.length ? "is-wrong" : ""}" data-cv2s-act="where" role="group" aria-label="假設用在哪一步">
        ${pre}
        <p class="course-check-ask">${icon("search")}<span>${rich(w.ask, data)}</span></p>
        <ol class="course-check-options" aria-label="證明的步驟">
          ${w.steps.map((step, oi) => `
            <li><button type="button" class="course-option ${right && step.correct ? "is-correct" : ""} ${picks.includes(oi) && !step.correct ? "is-picked" : ""}" data-action="course-s-whr" data-option="${oi}" ${right || picks.includes(oi) ? "disabled" : ""} aria-label="${api.deps.escapeAttr(`第 ${oi + 1} 步：${strip(step.label)}`)}"><span class="cv2p-num" aria-hidden="true">${oi + 1}</span><span>${fmt(step.label)}</span></button></li>`).join("")}
        </ol>
        <div aria-live="polite">
          ${wrongs.map((oi) => `<p class="course-check-why">第 ${oi + 1} 步：${rich(w.steps[oi].why, data)}</p>`).join("")}
          ${right ? `<p class="course-check-why is-right">${icon("check")}對了</p>` : ""}
        </div>
      </div>`;
  }

  function act(api, action, data) {
    const sec = api.state.sec;
    const si = sec.si;
    const s = api.data.sections[si];
    if (!s) return 0;
    if (action === "course-s-why" || action === "course-s-see") {
      const bi = Number(data.beat);
      const b = s.beats[bi];
      if (!b || !b.why) return 0;
      const map = slot(sec, "why");
      const st = (map[`${si}-${bi}`] = map[`${si}-${bi}`] || { picks: [], open: false });
      if (st.open) return 0;
      if (action === "course-s-see") { st.open = true; focusTo = "[data-cv2s-next]"; refocus(); return 3; }
      const oi = Number(data.option);
      if (!b.why.options[oi] || st.picks.includes(oi)) return 0;
      st.picks.push(oi);
      if (!b.why.options[oi].correct) { focusTo = `[data-action="course-s-why"][data-beat="${bi}"]:not([disabled])`; refocus(); return 1; }
      st.open = true;
      focusTo = "[data-cv2s-next]";
      refocus();
      return 3;
    }
    if (action === "course-s-ord" && s.order) {
      const map = slot(sec, "ord");
      const st = (map[si] = map[si] || { got: [], miss: -1, shake: -1 });
      const n = s.order.steps.length;
      const j = Number(data.step);
      if (st.got.length === n || !(j >= 0 && j < n) || st.got.includes(j)) return 0;
      if (j !== st.got.length) {
        // 點錯：搖一下、說要先有什麼；排好的留著，焦點留在同一顆
        st.miss = j;
        st.shake = j;
        focusTo = `[data-action="course-s-ord"][data-step="${j}"]`;
        refocus();
        return 1;
      }
      st.got.push(j);
      st.miss = -1;
      if (st.got.length === n) { focusTo = "[data-cv2s-next]"; refocus(); return 2; }
      focusTo = ".cv2p-left .course-option";
      refocus();
      return 1;
    }
    if (action === "course-s-whr" && s.where) {
      const map = slot(sec, "whr");
      const picks = (map[si] = map[si] || []);
      const oi = Number(data.option);
      const step = s.where.steps[oi];
      if (!step || picks.includes(oi) || picks.some((k) => s.where.steps[k].correct)) return 0;
      picks.push(oi);
      if (step.correct) { focusTo = "[data-cv2s-next]"; refocus(); return 2; }
      focusTo = `[data-action="course-s-whr"]:not([disabled])`;
      refocus();
      return 1;
    }
    return 0;
  }

  window.BuzzCourseProof = { tag, why, view, act, shuffle };
})();
