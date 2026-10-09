// ── 新版課程的「分節」模式（lesson.sections；格式見 tools/content/course_v2/SCHEMA.md）──
//
// index.html 上是 type="text/lazy" data-lazy="sections"：只有打開「有分節的課」才由 course_v2_ui.js 抓這一支。
// 中文介面專用（英文介面用舊課），字直接寫中文。
//
// 一節一屏：上面是節的進度點（做完打勾），下面是這一節的句子（beat）——點一下（「下一句」、點句子那一塊、→ 或空白鍵）
// 出現下一句；句子帶 fig 時，圖的滑桿平滑地動到那一格（prefers-reduced-motion 直接跳）。句子都出來之後是結尾的動作：
// 小測（當下對錯、選錯看理由、可以重選）、先猜（選了就揭曉）、或自己拖滑桿進範圍。動作不擋路：「下一節」一直都在。
// 最後一節之後是結算：「你現在會：」＋這一課的學習目標、這一課拿到的 XP、下一課、在地圖上看（那一課亮一下）。
//
// 紀錄（records.courseV2[id]）：secAt 讀到第幾節（下次從那裡接）、secDone 做完的節、picks 分節裡小測選過的選項
// （跨天也接得回來 —— 小測每一題都落在某一節，四節做完就是小測做完，「完成」照全文的規則算）、xp 這一課拿到的 XP、
// tierXp 三層加成發到哪一層。一節第一次做完 +5 XP（重讀不再加）；完成／熟練／全破各一次加成。
// 做完一節也記進 records.courseReadDays（app.js 的 noteCourseRead）：那一天算有學（連勝、每日任務「讀一節課」）。
// 專注模式（收起連勝與成就）：照算，結算畫面不顯示連勝。
//
// 這一支只管畫面與動作；小測的記分（第一次就對才算）沿用 course_v2_ui.js 的 course-pick，圖沿用 BuzzCourseFigures。

(function () {
  "use strict";

  const SECTION_XP = 5;
  const TIER_XP = [0, 20, 30, 50];

  const STYLE = `
.cv2-lesson.cv2s { margin: 0 auto; }
.cv2s-dots { display: flex; flex-wrap: wrap; gap: 2px; margin: 12px 0 4px -7px; padding: 0; list-style: none; }
.cv2s-dot { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; padding: 0; border: 0; background: none; cursor: pointer; }
.cv2s-dot i { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--line-strong); color: var(--muted); font-size: 0.74rem; font-style: normal; font-weight: 800; font-variant-numeric: tabular-nums; }
.cv2s-dot.is-done i { background: var(--green); box-shadow: none; color: #fff; }
.cv2s-dot.is-now i { box-shadow: inset 0 0 0 2px var(--gold); color: var(--ink); }
.cv2s-dot.is-done.is-now i { box-shadow: 0 0 0 2px var(--paper), 0 0 0 4px var(--gold); }
.cv2s-dot i svg { width: 14px; height: 14px; }
.cv2s-sec { display: block; margin: 6px 0 0; }
.cv2s-sec > h3 { margin: 0 0 14px; font-size: 1.3rem; line-height: 1.4; letter-spacing: -0.01em; }
.cv2s-sec > h3 small { display: block; margin: 0 0 2px; color: var(--muted); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.cv2s .cv2-figure { margin: 2px auto 16px; }
.cv2s .cv2-figure figcaption { display: none; }
/* 手機：有圖的那一節，圖黏在頂列下面 —— 句子往下長的時候，圖一直看得到、跟著句子動 */
@media (max-width: 959px) {
  .cv2s-sec .cv2-figure.is-widget { position: sticky; top: var(--cv2s-top, 0px); z-index: 3; gap: 2px; margin: 0 auto 12px; padding: 4px 0 6px; background: var(--paper); border-bottom: 1px solid var(--line); }
  .cv2s-sec .cv2-figure.is-widget [data-cv2-plot] { max-width: 290px; margin: 0 auto; }
  .cv2s-sec .cv2-figure.is-widget .cv2-slider input { height: 36px; }
}
.cv2s-beats { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.cv2s-beat { padding: 10px 14px; border-left: 3px solid var(--line); border-radius: 0 10px 10px 0; }
.cv2s-beat.is-now { border-left-color: var(--gold); background: color-mix(in srgb, var(--gold) 8%, var(--paper)); }
.cv2s-beat:not(.is-now) { opacity: 0.68; }
.cv2s-show { margin: 0; font-size: 1.12rem; font-weight: 650; line-height: 1.6; overflow-wrap: anywhere; }
.cv2s-show .katex { font-size: 1.06em; }
.cv2s-note { margin: 4px 0 0; color: var(--muted); font-size: 0.95rem; line-height: 1.7; overflow-wrap: anywhere; }
.cv2s-beat.is-now .cv2s-note { color: var(--ink); }
.cv2s-beat.is-new { animation: cv2s-in 0.28s ease-out; }
@keyframes cv2s-in { from { opacity: 0; transform: translateY(6px); } }
.cv2s-act { margin: 22px 0 0; }
.cv2s-act .course-check-ask { display: flex; align-items: baseline; gap: 6px; }
.cv2s-act .course-check-ask svg { flex: none; align-self: center; width: 16px; height: 16px; color: var(--gold-dark); }
.cv2s-drag { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: color-mix(in srgb, var(--blue) 7%, var(--paper)); line-height: 1.6; }
.cv2s-drag svg { flex: none; width: 18px; height: 18px; color: var(--blue); }
.cv2s-drag.is-done { background: color-mix(in srgb, var(--green) 10%, var(--paper)); }
.cv2s-drag.is-done svg { color: var(--green); }
.cv2s-xp { display: inline-flex; align-items: baseline; gap: 3px; margin-left: auto; padding: 2px 10px; border-radius: 999px; background: color-mix(in srgb, var(--gold) 16%, var(--panel)); color: var(--gold-dark); font-size: 0.82rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.cv2s-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 24px 0 0; padding-top: 16px; border-top: 1px solid var(--line); }
.cv2s-bar .button { max-width: 100%; }
.cv2s-bar .button small { margin-left: 4px; opacity: 0.75; font-variant-numeric: tabular-nums; }
.cv2s-goals { display: grid; gap: 8px; margin: 0 0 18px; padding: 0; list-style: none; }
.cv2s-goals li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; line-height: 1.75; }
.cv2s-goals li > * { min-width: 0; overflow-wrap: anywhere; }
.cv2s-goals svg { width: 18px; height: 18px; margin-top: 5px; color: var(--green); }
.cv2s-goals li.is-todo svg { color: var(--line-strong); }
.cv2s-stats { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; margin: 0 0 18px; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.cv2s-stats strong { color: var(--ink); font-size: 1.5rem; }
.cv2s-todo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; }
.cv2s-finish .action-row { display: flex; flex-wrap: wrap; gap: 8px; }
.cv2s-finish .action-row .button { max-width: 100%; }
@media (prefers-reduced-motion: reduce) { .cv2s-beat.is-new { animation: none; } }
@media (min-width: 960px) { .cv2-lesson.cv2s { margin: 0 auto; } }
`;

  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cv2s-style")) return;
    const node = document.createElement("style");
    node.id = "cv2s-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  const reduced = () => Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const entryOf = (records, id) => ((records.courseV2 || {})[id]) || {};
  const Figures = () => window.BuzzCourseFigures;
  let last = null; // 最近一次畫的那一課（拖滑桿的 change 事件要用）

  /* ── 這一次打開的狀態：放在 course_v2_ui 的 state 上（換一課時整個 state 換掉，自然重來）── */
  function visitOf(api) {
    const st = api.state;
    if (st.sec) return st.sec;
    const n = api.data.sections.length;
    const e = entryOf(api.records, api.m.id);
    st.sec = { si: Math.min(Math.max(0, Number(e.secAt) || 0), n - 1), shown: {}, pred: {}, dragOk: {}, done: {}, gain: {}, anim: null, fresh: -1, top: false, bar: false };
    // 分節裡選過的小測接回來：跨天讀完也算得到「完成」（全頁「重做小測」會清掉）
    const saved = e.picks || {};
    Object.keys(saved).forEach((ci) => {
      if (Array.isArray(saved[ci]) && saved[ci].length && !(st.picks[ci] || []).length) st.picks = { ...st.picks, [ci]: saved[ci].slice() };
    });
    if (api.data.checks.every((_c, k) => (st.picks[k] || []).length)) st.recorded = true;
    st.sec.shown[st.sec.si] = 1;
    reveal(api, st.sec.si, 0);
    return st.sec;
  }

  // 出現第 bi 句：句子帶 fig 就把圖從現在的值動到 fig.to（畫完那一格之後才動，見 afterRender）
  function reveal(api, si, bi) {
    const sec = api.state.sec;
    const beat = api.data.sections[si].beats[bi];
    sec.fresh = bi;
    if (!beat || !beat.fig) return;
    const k = beat.fig.use;
    const fig = (api.data.figures || [])[k];
    if (!fig || !fig.widget) return;
    const from = api.state.figs[k] !== undefined ? api.state.figs[k] : Figures().sliderOf(fig).value;
    api.state.figs = { ...api.state.figs, [k]: Number(beat.fig.to) };
    sec.anim = { k, from, to: Number(beat.fig.to) };
  }

  function enter(api, si) {
    const sec = visitOf(api);
    const S = api.data.sections;
    sec.si = Math.max(0, Math.min(Number(si) || 0, S.length));
    sec.top = true;
    if (sec.si < S.length) {
      if (!sec.shown[sec.si]) { sec.shown[sec.si] = 1; reveal(api, sec.si, 0); } else sec.fresh = -1;
      api.update(api.m.id, (e) => ({ ...e, secAt: sec.si }));
    } else settle(api);
  }

  /* ── 圖：直接換那一張圖（不整頁重繪），拿來播動畫 ── */
  function setFig(node, fig, value, escapeAttr) {
    const shown = Figures().view(fig, value, escapeAttr);
    const plot = node.querySelector("[data-cv2-plot]");
    const read = node.querySelector("[data-cv2-readout]");
    const input = node.querySelector("input[data-cv2-slider]");
    if (plot) plot.innerHTML = shown.plot;
    if (read) read.textContent = shown.readout;
    if (input) input.value = String(value);
    node.dataset.value = String(value);
  }
  function animate(node, fig, from, to, escapeAttr) {
    if (reduced() || from === to) { setFig(node, fig, to, escapeAttr); return; }
    const whole = fig.widget.type === "riemann" || fig.widget.type === "taylor";
    const t0 = performance.now();
    const dur = Math.min(900, 420 + 12 * (whole ? Math.abs(to - from) : 20));
    let prev = null;
    const frame = (now) => {
      if (!node.isConnected) return;
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      let v = t >= 1 ? to : from + (to - from) * e;
      if (whole) v = Math.round(v);
      if (v !== prev) { prev = v; setFig(node, fig, v, escapeAttr); }
      if (t < 1) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  }

  /* ── 紀錄 ── */
  function complete(api, si) {
    const sec = api.state.sec;
    if (sec.done[si]) return;
    sec.done[si] = true;
    const { deps } = api;
    const records = deps.loadRecords();
    records.courseV2 = records.courseV2 || {};
    const e = { ...(records.courseV2[api.m.id] || {}) };
    const list = Array.isArray(e.secDone) ? e.secDone.slice() : [];
    if (!list.includes(si)) {
      e.secDone = list.concat(si).sort((a, b) => a - b);
      e.xp = (Number(e.xp) || 0) + SECTION_XP;
      records.xp = (Number(records.xp) || 0) + SECTION_XP;
      sec.gain[si] = SECTION_XP;
    }
    records.courseV2[api.m.id] = e;
    if (deps.noteCourseRead) deps.noteCourseRead(records);
    deps.saveRecords(records);
  }
  // 三層加成：完成／熟練／全破各發一次（熟練、全破靠推薦題，練完回來打開這一課時補發）
  function settle(api) {
    const { deps } = api;
    const records = deps.loadRecords();
    const tier = api.tierOf(records);
    const e = entryOf(records, api.m.id);
    const paid = Number(e.tierXp) || 0;
    if (tier <= paid) return;
    let gain = 0;
    for (let t = paid + 1; t <= tier; t += 1) gain += TIER_XP[t] || 0;
    records.courseV2[api.m.id] = { ...e, tierXp: tier, xp: (Number(e.xp) || 0) + gain };
    records.xp = (Number(records.xp) || 0) + gain;
    deps.saveRecords(records);
  }

  /* ── 畫面 ── */
  function resolved(api, si) {
    const s = api.data.sections[si];
    const sec = api.state.sec;
    if (s.check !== undefined) return (api.state.picks[s.check] || []).some((oi) => api.data.checks[s.check].options[oi].correct);
    if (s.predict) return sec.pred[si] !== undefined;
    return Boolean(sec.dragOk[si]);
  }

  function choices(api, item, picks, opts) {
    const { fmt, rich, data, deps } = api;
    const { escapeAttr, icon } = deps;
    const right = picks.some((oi) => item.options[oi] && item.options[oi].correct);
    const settled = right || (opts.once && picks.length);
    const wrongs = picks.filter((oi) => item.options[oi] && !item.options[oi].correct);
    return `
      <div class="cv2s-act course-check ${right ? "is-right" : picks.length ? "is-wrong" : ""}" data-cv2s-act="${opts.kind}">
        <p class="course-check-ask">${opts.kind === "predict" ? icon("lightbulb") : ""}<span>${rich(item.ask, data)}</span></p>
        <div class="course-check-options">
          ${item.options.map((option, oi) => `
            <button type="button" class="course-option ${settled && option.correct ? "is-correct" : ""} ${picks.includes(oi) && !option.correct ? "is-picked" : ""}" data-action="course-s-pick" data-kind="${opts.kind}" data-check="${opts.ci}" data-option="${oi}" ${settled ? "disabled" : ""}>${fmt(option.label)}</button>`).join("")}
        </div>
        ${wrongs.map((oi) => `<p class="course-check-why">${fmt(item.options[oi].label)}：${rich(item.options[oi].why, data)}</p>`).join("")}
        ${right ? `<p class="course-check-why is-right">${icon("check")}對了</p>` : ""}
        ${!right && settled ? `<p class="course-check-why">答案是 ${fmt(item.options.find((o) => o.correct).label)}</p>` : ""}
      </div>`;
  }

  function sectionView(api, si) {
    const { data, state: st, fmt, rich, deps } = api;
    const { escapeAttr, escapeHtml, icon } = deps;
    const sec = st.sec;
    const s = data.sections[si];
    const n = data.sections.length;
    const shown = Math.min(s.beats.length, sec.shown[si] || 1);
    const all = shown >= s.beats.length;
    // 這一節用到的圖：句子的 fig.use 與 drag.use；正在動畫的那一張先畫在起點
    const used = [...new Set(s.beats.map((b) => (b.fig ? b.fig.use : null)).concat(s.drag ? [s.drag.use] : []).filter((k) => k !== null))];
    const figs = used.map((k) => {
      const fig = (data.figures || [])[k];
      if (!fig) return "";
      const value = sec.anim && sec.anim.k === k ? sec.anim.from : st.figs[k];
      return Figures().renderFigure(fig, k, value, escapeAttr, escapeHtml);
    }).join("");
    const beats = s.beats.slice(0, shown).map((b, bi) => `
      <li class="cv2s-beat ${bi === shown - 1 ? "is-now" : ""} ${bi === sec.fresh ? "is-new" : ""}" data-beat="${bi}">
        ${b.show.map((line) => `<p class="cv2s-show">${fmt(line)}</p>`).join("")}
        ${b.note ? `<p class="cv2s-note">${rich(b.note, data)}</p>` : ""}
      </li>`).join("");
    const v = data.video;
    const video = all && s.video && v ? `<figure class="cv2-figure cv2-video" data-cv2-video="${escapeAttr(v.id)}" data-duration="${v.duration}"><div class="cv2-video-box"></div><figcaption>${escapeHtml(v.caption)}</figcaption></figure>` : "";
    let action = "";
    if (all && s.check !== undefined) action = choices(api, data.checks[s.check], st.picks[s.check] || [], { kind: "check", ci: s.check });
    if (all && s.predict) action = choices(api, s.predict, sec.pred[si] === undefined ? [] : [sec.pred[si]], { kind: "predict", ci: si, once: true });
    if (all && s.drag) {
      action = `<div class="cv2s-act cv2s-drag ${sec.dragOk[si] ? "is-done" : ""}" data-cv2s-act="drag">${icon(sec.dragOk[si] ? "check" : "target")}<span>${rich(s.drag.ask, data)}</span></div>`;
    }
    const ok = all && resolved(api, si);
    const gain = sec.gain[si] ? `<span class="cv2s-xp">+${sec.gain[si]} XP</span>` : "";
    const lastOne = si === n - 1;
    const bar = all
      ? `<button type="button" class="button ${ok ? "home-primary" : "ghost"}" data-action="course-s-next" data-cv2s-next>${lastOne ? "完成這一課" : "下一節"}${icon("chevron-right")}</button>${gain}`
      : `<button type="button" class="button home-primary" data-action="course-s-next" data-cv2s-next>下一句<small>${shown} / ${s.beats.length}</small></button>`;
    return `
      <article class="cv2s-sec" aria-label="第 ${si + 1} 節">
        <h3><small>${si + 1} / ${n}</small>${fmt(s.title)}</h3>
        ${figs}
        <ol class="cv2s-beats" data-action="course-s-next" data-how="tap" aria-live="polite">${beats}</ol>
        ${video}
        ${action}
        <div class="cv2s-bar">${bar}</div>
      </article>`;
  }

  function finishView(api, e) {
    const { m, data, records, rich, deps } = api;
    const { escapeAttr, escapeHtml, icon } = deps;
    const n = data.sections.length;
    const doneSet = new Set(e.secDone || []);
    const todo = data.sections.map((_s, i) => i).filter((i) => !doneSet.has(i));
    const level = deps.xpLevel ? deps.xpLevel(records.xp) : null;
    const quiet = deps.focusModeOn ? deps.focusModeOn() : false;
    const streak = !quiet && deps.streakDays ? deps.streakDays(records) : 0;
    const bank = new Set((window.BUZZ_PROBLEMS || []).map((p) => p.id));
    const practice = (data.practice || []).filter((p) => !p.challenge && bank.has(p.id)).length;
    return `
      <article class="cv2s-sec cv2s-finish" data-cv2s-finish>
        <h3><small>${n} / ${n}</small>你現在會：</h3>
        <ul class="cv2s-goals">${data.objectives.map((line) => `<li class="${todo.length ? "is-todo" : ""}">${icon("check")}<span>${rich(line, data)}</span></li>`).join("")}</ul>
        ${todo.length ? `<p class="cv2s-todo"><span>還沒做完</span>${todo.map((i) => `<button type="button" class="cv2-link" data-action="course-s-go" data-to="${i}">第 ${i + 1} 節</button>`).join("")}</p>` : ""}
        <p class="cv2s-stats" data-cv2s-stats>
          <span><strong>+${Number(e.xp) || 0}</strong> XP</span>
          ${level ? `<span>Lv.${level.level} · ${level.into}/${level.span}</span>` : ""}
          ${streak ? `<span>${icon("flame")}連勝 ${streak} 天</span>` : ""}
        </p>
        <div class="action-row">
          ${api.next ? `<button type="button" class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(api.next.id)}">下一課：${escapeHtml(api.label(api.next))}${icon("chevron-right")}</button>` : `<button type="button" class="button home-primary" data-action="open-course">課程表</button>`}
          <button type="button" class="button secondary" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}" data-lit="1">在地圖上看</button>
          ${practice ? `<button type="button" class="button ghost" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${practice} 題</button>` : ""}
        </div>
      </article>`;
  }

  function render(api) {
    injectStyle();
    last = api;
    const { m, data, records, head, deps } = api;
    const { escapeAttr, icon } = deps;
    const sec = visitOf(api);
    const e = entryOf(records, m.id);
    const doneSet = new Set((e.secDone || []).concat(Object.keys(sec.done).map(Number)));
    const n = data.sections.length;
    const dots = `
      <nav class="cv2s-dots" aria-label="這一課的節">
        ${data.sections.map((s, i) => `<button type="button" class="cv2s-dot ${doneSet.has(i) ? "is-done" : ""} ${sec.si === i ? "is-now" : ""}" data-action="course-s-go" data-to="${i}" aria-label="${escapeAttr(`第 ${i + 1} 節：${s.title.replace(/\$/g, "")}${doneSet.has(i) ? "（做完了）" : ""}`)}" ${sec.si === i ? `aria-current="step"` : ""}><i>${doneSet.has(i) ? icon("check") : i + 1}</i></button>`).join("")}
      </nav>`;
    // 先修一行（跟全文同一行：〈課名〉連過去、「在地圖上看」）
    const pre = data.prerequisites.length ? `<div class="cv2-intro"><p class="cv2-prereq"><span>先修</span>${data.prerequisites.map(api.lessonLink).join("")}<button type="button" class="cv2-link cv2-maplink" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}">在地圖上看</button></p></div>` : "";
    const body = sec.si >= n ? finishView(api, e) : sectionView(api, sec.si);
    if (typeof queueMicrotask === "function") queueMicrotask(() => afterRender(api)); else window.setTimeout(() => afterRender(api), 0);
    return `
      <main class="screen">
        <section class="course-lesson cv2-lesson cv2s" data-cv2s="${sec.si}">
          ${head}
          ${pre}
          ${dots}
          ${body}
        </section>
      </main>`;
  }

  function afterRender(api) {
    const sec = api.state.sec;
    const root = typeof document !== "undefined" && document.querySelector("[data-cv2s]");
    if (!sec || !root) return;
    if (sec.anim) {
      const { k, from, to } = sec.anim;
      sec.anim = null;
      const node = root.querySelector(`[data-cv2-fig="${k}"]`);
      const fig = (api.data.figures || [])[k];
      if (node && fig) animate(node, fig, from, to, api.deps.escapeAttr);
    }
    sec.fresh = -1;
    // 手機的頂列是 sticky、橫跨整個寬度：黏著的圖要停在它下面（桌機的頂列是左側欄，不佔上方）
    const topbar = document.querySelector(".topbar");
    let top = 0;
    if (topbar) {
      const r = topbar.getBoundingClientRect();
      if (r.width >= document.documentElement.clientWidth - 1 && r.top <= 0.5) top = Math.round(r.bottom);
    }
    root.style.setProperty("--cv2s-top", `${top}px`);
    if (sec.top) { sec.top = false; window.scrollTo(0, 0); }
    else if (sec.bar) {
      // 新的一句或動作出現在下面：把「下一句／下一節」那一列帶進畫面，停在手機底部分頁列的上面
      const bar = root.querySelector(".cv2s-bar");
      const nav = document.querySelector(".topbar-nav");
      const navTop = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().top : window.innerHeight;
      const over = bar ? bar.getBoundingClientRect().bottom + 12 - navTop : 0;
      if (over > 0) window.scrollBy({ top: over, behavior: reduced() ? "auto" : "smooth" });
    }
    sec.bar = false;
    if (root.querySelector("[data-cv2-video]")) {
      Promise.resolve().then(() => api.deps.ensureLazy("video")).then(() => window.BuzzCourseVideo.mount(document), () => document.querySelectorAll(".cv2-video").forEach((node) => node.classList.add("is-off")));
    }
  }

  /* ── 動作（course_v2_ui 的 act 把 course-s-* 轉過來）── */
  function act(api, action, data) {
    const { deps } = api;
    if (action === "course-s-mode") {
      const records = deps.loadRecords();
      records.settings = records.settings || {};
      if (data.mode === "full") records.settings.courseView = "full";
      else delete records.settings.courseView;
      deps.saveRecords(records);
      deps.render();
      window.scrollTo(0, 0);
      return;
    }
    if (!api.data || !api.data.sections) return;
    const sec = visitOf(api);
    const S = api.data.sections;
    if (action === "course-s-go") { enter(api, data.to); return deps.render(); }
    if (action === "course-s-next") {
      if (sec.si >= S.length) return;
      const s = S[sec.si];
      const shown = sec.shown[sec.si] || 1;
      if (shown < s.beats.length) {
        sec.shown[sec.si] = shown + 1;
        reveal(api, sec.si, shown);
        sec.bar = true;
        return deps.render();
      }
      // 點句子那一塊只出下一句；換節要按鈕（或 →），免得手滑跳走
      if (data.how === "tap") return;
      enter(api, sec.si + 1);
      return deps.render();
    }
    if (action === "course-s-pick") {
      const si = sec.si;
      const s = S[si];
      if (!s) return;
      if (data.kind === "predict" && s.predict) {
        if (sec.pred[si] !== undefined) return;
        sec.pred[si] = Number(data.option);
        complete(api, si);
        sec.bar = true;
        return deps.render();
      }
      if (data.kind === "check" && s.check !== undefined) {
        const ci = s.check;
        const oi = Number(data.option);
        const check = api.data.checks[ci];
        const picks = api.state.picks[ci] || [];
        if (!check || !check.options[oi] || picks.includes(oi) || picks.some((x) => check.options[x].correct)) return;
        api.update(api.m.id, (e) => ({ ...e, picks: { ...(e.picks || {}), [ci]: picks.concat(oi) } }));
        if (check.options[oi].correct) complete(api, si);
        sec.bar = true;
        // 記分（第一次就對才算、四題都選過就結算「完成」）照全文的 course-pick；它會重繪
        api.act("course-pick", { check: ci, option: oi });
        settle(api);
        return deps.render();
      }
    }
  }

  // 拖滑桿進範圍（drag 動作）：放開時（change）判定；拖動中的每一格由 course_v2_ui 的 input 委派畫圖
  // → / 空白鍵：下一句（焦點在輸入框、滑桿上不搶；空白鍵在按鈕上照按鈕自己的意思）
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("change", (event) => {
      const input = event.target;
      if (!last || !input || !input.matches || !input.matches("[data-cv2s] input[data-cv2-slider]")) return;
      const api = last;
      const sec = api.state.sec;
      const s = sec && api.data.sections[sec.si];
      if (!s || !s.drag || sec.dragOk[sec.si] || Number(input.dataset.cv2Slider) !== s.drag.use) return;
      const value = Number(input.value);
      if (!(value >= s.drag.range[0] - 1e-9 && value <= s.drag.range[1] + 1e-9)) return;
      sec.dragOk[sec.si] = true;
      complete(api, sec.si);
      sec.bar = true;
      api.deps.render();
    });
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowRight" && event.key !== " ") return;
      const root = document.querySelector("[data-cv2s]");
      const target = event.target;
      if (!root || (target && target.closest && target.closest(`input, textarea, select, [contenteditable="true"], .modal-backdrop${event.key === " " ? ", button, a" : ""}`))) return;
      const next = root.querySelector("[data-cv2s-next]");
      if (!next) return;
      event.preventDefault();
      next.click();
    });
  }

  window.BuzzCourseSections = { render, act };
})();
