// ── 新版課程的「分節」模式：一節一屏、點一下出下一句、結尾一個動作、旁白（規格與紀錄欄位見 tools/content/course_v2/SCHEMA.md）──
// data-lazy="sections"：打開有分節的課才抓；中文介面專用。小測記分沿用 course_v2_ui.js 的 course-pick，圖沿用 BuzzCourseFigures。

(function () {
  "use strict";

  const SECTION_XP = 5;
  const TIER_XP = [0, 20, 30, 50];

  const STYLE = `
/* 手機：頁首往上收（桌機在最後一行改回來） */
.cv2-lesson.cv2s { margin: -20px auto 0; }
.cv2s-dots { display: flex; flex-wrap: wrap; gap: 2px; margin: 0 0 2px -7px; padding: 0; list-style: none; }
.cv2s-dot { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; padding: 0; border: 0; background: none; cursor: pointer; }
.cv2s-dot i { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--line-strong); color: var(--muted); font-size: 0.74rem; font-style: normal; font-weight: 800; font-variant-numeric: tabular-nums; }
.cv2s-dot.is-done i { background: var(--green); box-shadow: none; color: #fff; }
.cv2s-dot.is-now i { box-shadow: inset 0 0 0 2px var(--gold); color: var(--ink); }
.cv2s-dot.is-done.is-now i { box-shadow: 0 0 0 2px var(--paper), 0 0 0 4px var(--gold); }
.cv2s-dot i svg { width: 14px; height: 14px; }
.cv2s-sec { display: block; margin: 6px 0 0; }
.cv2s-sec > h3 { margin: 0 0 6px; font-size: 1.2rem; line-height: 1.4; letter-spacing: -0.01em; }
/* 有黑板的節：底下只留現在這一句的白話（之前寫的都還在板子上，不重複佔畫面） */
.cv2s-sec.has-board .cv2s-beat:not(.is-now) { display: none; }
/* 輪到學生動手的提示：金色一行，進場閃一下 */
.cv2s-cue { display: flex; align-items: center; gap: 8px; margin: 14px 0 8px; padding: 9px 14px; border-radius: 12px; background: color-mix(in srgb, var(--gold, #c69214) 16%, transparent); color: var(--ink); font-weight: 700; animation: cv2s-cue 1.4s ease-out 2; }
.cv2s-cue svg { flex: none; width: 18px; height: 18px; color: var(--gold, #a37400); }
@keyframes cv2s-cue { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--gold, #c69214) 55%, transparent); } 100% { box-shadow: 0 0 0 12px transparent; } }
@media (prefers-reduced-motion: reduce) { .cv2s-cue { animation: none; } }
.cv2s-key { display: flex; gap: 10px; align-items: baseline; margin: 2px 0 12px; padding: 8px 12px; border-left: 4px solid var(--gold, #c69214); border-radius: 0 10px 10px 0; background: color-mix(in srgb, var(--gold, #c69214) 13%, transparent); font-weight: 600; line-height: 1.5; }
.cv2s-key b { flex: none; color: var(--gold, #a37400); font-size: 0.85rem; letter-spacing: 0.08em; }
.cv2s-sec > h3 small { margin: 0 8px 0 0; color: var(--muted); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.cv2s .cv2-figure { margin: 2px auto 16px; }
.cv2s .cv2-figure figcaption { display: none; }
/* 手機：圖黏在頂列下面，句子往下長時一直看得到 */
@media (max-width: 959px) {
  .cv2s-sec .cv2-figure.is-widget { position: sticky; top: var(--cv2s-top, 0px); z-index: 3; gap: 2px; margin: 0 auto 12px; padding: 4px 0 6px; background: var(--paper); border-bottom: 1px solid var(--line); }
  .cv2s-sec .cv2-figure.is-widget [data-cv2-plot] { max-width: 290px; margin: 0 auto; }
  .cv2s-sec .cv2-figure.is-widget .cv2-slider input { height: 36px; }
  .cv2s-sec .cv2-figure.is-widget.is-loose { position: static; }
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
.cv2s-act .course-check-ask > svg { flex: none; align-self: center; width: 16px; height: 16px; color: var(--gold-dark); }
.cv2s-drag { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: color-mix(in srgb, var(--blue) 7%, var(--paper)); line-height: 1.6; }
.cv2s-drag > svg { flex: none; width: 18px; height: 18px; color: var(--blue); }
.cv2s-drag.is-done { background: color-mix(in srgb, var(--green) 10%, var(--paper)); }
.cv2s-drag.is-done > svg { color: var(--green); }
.cv2s-xp { display: inline-flex; align-items: baseline; gap: 3px; margin-left: auto; padding: 2px 10px; border-radius: 999px; background: color-mix(in srgb, var(--gold) 16%, var(--panel)); color: var(--gold-dark); font-size: 0.82rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.cv2s-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 24px 0 0; padding-top: 16px; border-top: 1px solid var(--line); }
.cv2s-bar .button { max-width: 100%; }
.cv2s-bar .button small { margin-left: 4px; opacity: 0.75; font-variant-numeric: tabular-nums; }
.cv2s-say { margin: 6px 0 0; padding: 6px 10px; border-radius: 8px; background: color-mix(in srgb, var(--ink) 6%, var(--paper)); color: var(--ink); font-size: 0.92rem; line-height: 1.7; }
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
  // 證明節的互動在 src/course_proof.js（data-lazy="secproof"）
  const PF = () => window.BuzzCourseProof;
  let pfail = false;
  // 黑板（beat.board）在 src/course_board.js（data-lazy="board"）：有黑板的課才抓；抓不到就照 show 的字
  const BD = () => window.BuzzBoard;
  let bfail = false;
  const boarded = (s) => s.beats.some((b) => b.board);
  // 自己算（sections[].solve）在 src/course_solve.js（data-lazy="secsolve"）
  const SV = () => window.BuzzCourseSolve;
  let sfail = false;
  let ffail = false;
  // 第 bi 句的「為什麼」還沒答：note 不出、不給下一句、旁白念完問句就停
  const asking = (api, si, bi) => { const b = api.data.sections[si].beats[bi]; return Boolean(b && b.why && PF() && !(api.state.sec.why[`${si}-${bi}`] || {}).open); };
  let last = null; // 最近一次畫的那一課（拖滑桿的 change 事件要用）

  /* ── 這一次打開的狀態：掛在 course_v2_ui 的 state 上（換一課自然重來）── */
  function visitOf(api) {
    const st = api.state;
    if (st.sec) return st.sec;
    const n = api.data.sections.length;
    const e = entryOf(api.records, api.m.id);
    // 練完推薦題按「回到這一課」（state.land = "practice"）：直接落在結算（推薦題與下一層還差什麼都在那裡），不是從記到的那一節重讀
    const land = st.land === "practice";
    // 從搜尋點進來（state.land = "sec:3"）：直接到那一節
    const at = /^sec:(\d+)$/.exec(st.land || "");
    delete st.land;
    st.sec = { si: land ? n : at ? Math.min(Number(at[1]), n - 1) : Math.min(Math.max(0, Number(e.secAt) || 0), n - 1), shown: {}, pred: {}, dragOk: {}, why: {}, done: {}, gain: {}, anim: null, fresh: -1, top: false, bar: false };
    // 分節裡選過的小測接回來：跨天讀完也算「完成」
    const saved = e.picks || {};
    Object.keys(saved).forEach((ci) => {
      if (Array.isArray(saved[ci]) && saved[ci].length && !(st.picks[ci] || []).length) st.picks = { ...st.picks, [ci]: saved[ci].slice() };
    });
    if (api.data.checks.every((_c, k) => (st.picks[k] || []).length)) st.recorded = true;
    if (land) {
      // 練完回來：這時候補發層級加成（跟走到結算那一刻一樣），畫面讀新的紀錄
      settle(api);
      api.records = api.deps.loadRecords();
      return st.sec;
    }
    st.sec.shown[st.sec.si] = 1;
    reveal(api, st.sec.si, 0);
    return st.sec;
  }

  // 出現第 bi 句：帶 fig 就把圖動到 fig.to（見 afterRender）
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

  // 旁白（播放、dock）在 course_narration.js（data-lazy="narration"）；這裡只留掛鉤
  const N = () => window.BuzzCourseNarration;
  let nfail = false;
  const voiceOn = () => Boolean(N() && N().on());
  let pointerDown = false;
  let pending = null; // 手指按著時不捲：放開再捲
  let navH = 0;
  function measureNav() {
    const nav = document.querySelector(".topbar-nav");
    navH = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().height : 0;
    return nav;
  }
  function measureNav() {
    const nav = document.querySelector(".topbar-nav");
    navH = nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().height : 0;
    return nav;
  }
  // 只換這一節會變的那幾塊，不整頁重繪；圖原地動
  function patch(api) {
    const art = document.querySelector("[data-cv2s] .cv2s-sec:not(.cv2s-finish)");
    if (!art || !art.querySelector(".cv2s-beats") || typeof document.createElement("template").content === "undefined") { api.deps.render(); return; }
    const tpl = document.createElement("template");
    tpl.innerHTML = sectionView(api, api.state.sec.si);
    const fresh = tpl.content.querySelector(".cv2s-sec");
    art.querySelector(".cv2s-beats").replaceWith(fresh.querySelector(".cv2s-beats"));
    art.querySelectorAll(":scope > [data-cv2s-act]").forEach((n) => n.remove());
    const bar = art.querySelector(".cv2s-bar");
    fresh.querySelectorAll(":scope > [data-cv2s-act]").forEach((n) => art.insertBefore(n, bar));
    bar.replaceWith(fresh.querySelector(".cv2s-bar"));
    if (window.lucide) window.lucide.createIcons({ attrs: { class: "icon", "aria-hidden": "true" } });
    const sec = api.state.sec;
    if (sec.anim) {
      const { k, from, to } = sec.anim;
      sec.anim = null;
      const node = art.querySelector(`[data-cv2-fig="${k}"]`);
      const fig = (api.data.figures || [])[k];
      if (node && fig) animate(node, fig, from, to, api.deps.escapeAttr);
    }
    if (BD()) BD().sync(api, art);
    sec.fresh = -1;
    show();
  }
  /* 把亮著那一句（或動作）到「下一句」那一列捲進「頂列＋黏著的圖」與 dock 之間，放不下就保住它的頂。
     手指按著／剛自己捲過先不捲；長高（字型、字幕）再對一次，但使用者自己捲過就等下一句。 */
  let userAt = 0;
  let grow = null;
  function show(anchor, jump) {
    const root = document.querySelector("[data-cv2s]");
    const el = root && root.querySelector(anchor === "act" ? "[data-cv2s-act]" : ".cv2s-beat.is-now");
    if (grow) { grow.disconnect(); grow = null; }
    if (!el) return;
    const t0 = Date.now();
    const go = () => {
      if (!el.isConnected || userAt > t0) return;
      // 正在輸入框裡打字（自己算的數學鍵盤）：預覽長高不准捲，不然下一顆鍵就點偏
      const ae = document.activeElement;
      if (ae && root.contains(ae) && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) return;
      if (pointerDown) { pending = go; return; }
      if (Date.now() - userAt < 700) { window.setTimeout(go, 720 - (Date.now() - userAt)); return; }
      const fig = root.querySelector(".cv2-figure.is-widget");
      const top = (parseFloat(root.style.getPropertyValue("--cv2s-top")) || 0) + (fig && getComputedStyle(fig).position === "sticky" ? fig.offsetHeight : 0) + 8;
      const dt = N() && N().dockTop();
      const bottom = (dt !== null && dt !== undefined && dt !== false ? dt : window.innerHeight - navH) - 8;
      const a = el.getBoundingClientRect();
      const z = (root.querySelector(".cv2s-bar:not(:empty)") || root.querySelector("[data-cv2s-act]") || el).getBoundingClientRect();
      // 黑板最下面那一行（剛寫的；course_board.js 放的一個看不見的框）也要看得到
      // 一課一塊：板子自己有鏡頭（最新那一行一定在板子裡看得到），頁面對的是整塊板（含釘在上面的圖）
      const bl = root.querySelector(".cvb-whole .cvb-stage") || root.querySelector(".cvb-l:last-child");
      const b = bl && bl.getBoundingClientRect();
      let d;
      if (anchor === "act" && b && b.height) {
        // 「為什麼」或這一節的動作出現在黑板底下：最後一行跟問題都放得下就都放；放不下先顧問題，上面剩的空間留給那一行的下緣
        const room = bottom - top;
        if (z.bottom - b.top <= room) d = z.bottom > bottom ? z.bottom - bottom : Math.min(0, b.top - top);
        else d = z.bottom - a.top <= room ? a.top - top - Math.min(b.height, room - (z.bottom - a.top)) : a.top - top;
      } else {
        const lt = b ? b.top : a.top;
        // 板子固定大小以後，最新那一行可能在板子上半、動作在很下面：兩個都放得下才顧那一行，放不下先顧這一句與動作
        const at = z.bottom - lt <= bottom - top ? Math.min(a.top, lt) : a.top;
        d = z.bottom > bottom ? Math.min(z.bottom - bottom, at - top) : Math.min(0, at - top);
      }
      if (Math.abs(d) >= 1) window.scrollTo({ top: window.scrollY + d, behavior: reduced() || jump ? "auto" : "smooth" });
      jump = false;
    };
    go();
    window.setTimeout(go, 350); // 進場動畫（往上 6px）結束後再對一次
    // 黑板在句子上面長高（寫上一行、標籤撐開）也會把句子往下推：一起看
    if (window.ResizeObserver) { grow = new ResizeObserver(go); grow.observe(el); const bd = root.querySelector(".cvb"); if (bd) grow.observe(bd); }
  }
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("pointerdown", (event) => {
      pointerDown = true;
      // 按在「自己算」的輸入區（數學鍵盤、輸入框、送出）：在打字 —— 對位的捲動讓路，正在滑的那一段也停在原地，
      // 不然手指底下的鍵會換一顆（打 2 進去的是上兩列的 8）
      const t = event.target;
      if (t && t.closest && t.closest("[data-cv2s] [data-cs]")) {
        userAt = Date.now();
        pending = null;
        window.scrollTo({ top: window.scrollY, behavior: "instant" });
      }
    }, true);
    const up = () => { pointerDown = false; if (pending) { const go = pending; pending = null; go(); } };
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
    // 自己捲（滾輪、手指拖、鍵盤）：跟著念的捲動讓路
    const mine = () => { userAt = Date.now(); };
    window.addEventListener("wheel", mine, { passive: true });
    window.addEventListener("touchmove", mine, { passive: true });
    document.addEventListener("keydown", (e) => { if (/^(Page|Arrow(Up|Down)|Home|End)/.test(e.key)) mine(); });
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
    const fresh = !list.includes(si);
    if (fresh) {
      e.secDone = list.concat(si).sort((a, b) => a - b);
      e.xp = (Number(e.xp) || 0) + SECTION_XP;
      records.xp = (Number(records.xp) || 0) + SECTION_XP;
      sec.gain[si] = SECTION_XP;
    }
    records.courseV2[api.m.id] = e;
    if (deps.noteCourseRead) deps.noteCourseRead(records);
    deps.saveRecords(records);
    // 第一次做完這一節才記（重讀不記）；mode：旁白開著是 voice
    if (fresh && deps.track) deps.track("course_section_complete", { lesson: api.m.id, section: si, mode: voiceOn() ? "voice" : "tap" });
  }
  // 三層加成：完成／熟練／全破各發一次（練完回來打開時補發）
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
  // 這一節做完了沒（旁白念完要不要自己換節）：沒有要做的就算；有題的要答對、猜過、拖進範圍、算對。
  // 證明的排順序／用在哪一步照舊等學生點（做完會看著結果想一下）
  function finished(api, si) {
    const s = api.data.sections[si];
    if (!s || s.order || s.where) return false;
    if (s.check === undefined && !s.predict && !s.solve && !s.drag) return true;
    return resolved(api, si);
  }

  function resolved(api, si) {
    const s = api.data.sections[si];
    const sec = api.state.sec;
    if (s.solve) return Boolean(SV() && SV().resolved(api, si));
    if (s.check !== undefined) return (api.state.picks[s.check] || []).some((oi) => api.data.checks[s.check].options[oi].correct);
    if (s.predict) return sec.pred[si] !== undefined;
    return Boolean(sec.dragOk[si]);
  }

  // 選項畫面上的順序：課文把正解都寫在第一個（1906 題有 1806 題），照原順序畫的話「選第一個就對」。
  // 固定洗牌（FNV-1a ＋ xorshift，種子＝課 id＋題），重開、測試都一樣；data-option 仍是原索引。
  function optionOrder(n, seed) {
    let h = 2166136261;
    for (const c of String(seed)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const idx = Array.from({ length: n }, (_v, i) => i);
    for (let i = n - 1; i > 0; i -= 1) {
      h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
      const j = h % (i + 1);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
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
          ${optionOrder(item.options.length, `${data.id}#${opts.kind}#${opts.ci}`).map((oi) => [item.options[oi], oi]).map(([option, oi]) => `
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
    const P = PF();
    const cur = s.beats[shown - 1];
    const pend = asking(api, si, shown - 1);
    const all = shown >= s.beats.length && !pend;
    const subs = Boolean((api.records.settings || {}).narrSubs);
    // 這一節用到的圖；正在動畫的那一張先畫在起點
    const used = [...new Set(s.beats.map((b) => (b.fig ? b.fig.use : null)).concat(s.drag ? [s.drag.use] : []).filter((k) => k !== null))];
    const figs = used.map((k) => {
      const fig = (data.figures || [])[k];
      if (!fig) return "";
      const value = sec.anim && sec.anim.k === k ? sec.anim.from : st.figs[k];
      return Figures().renderFigure(fig, k, value, escapeAttr, escapeHtml);
    }).join("");
    // 有黑板的句子：show 留給螢幕閱讀器（cvb-sr），畫面上是黑板；沒有 note 也沒有字幕的那一句收成 0 高
    const whole = Boolean(BD() && BD().whole && BD().whole(api));
    const bd = BD() && (whole ? data.sections.some(boarded) : boarded(s));
    const beats = s.beats.slice(0, shown).map((b, bi) => {
      const note = b.note && !asking(api, si, bi) ? `<p class="cv2s-note">${rich(b.note, data)}</p>` : "";
      const sub = subs && b.say && bi === shown - 1 ? `<p class="cv2s-say" data-cv2s-say>${escapeHtml(pend ? b.why.say : b.say)}</p>` : "";
      const sr = bd && b.board;
      return `
      <li class="cv2s-beat ${bi === shown - 1 ? "is-now" : ""} ${bi === sec.fresh ? "is-new" : ""} ${sr && !note && !sub ? "cvb-bare" : ""}" data-beat="${bi}">
        ${b.show.map((line) => `<p class="cv2s-show${sr ? " cvb-sr" : ""}">${fmt(line)}</p>`).join("")}
        ${note}
        ${sub}
      </li>`;
    }).join("");
    let action = "";
    if (all && s.check !== undefined) action = choices(api, data.checks[s.check], st.picks[s.check] || [], { kind: "check", ci: s.check });
    if (all && s.predict) action = choices(api, s.predict, sec.pred[si] === undefined ? [] : [sec.pred[si]], { kind: "predict", ci: si, once: true });
    if (all && s.drag) {
      action = `<div class="cv2s-act cv2s-drag ${sec.dragOk[si] ? "is-done" : ""}" data-cv2s-act="drag">${icon(sec.dragOk[si] ? "check" : "target")}<span>${rich(s.drag.ask, data)}</span></div>`;
    }
    // 一課一塊黑板：小測／先猜寫在板上、在板上點；下面只留理由（與螢幕閱讀器用的選項）
    if (bd && whole && action && (s.check !== undefined || s.predict) && !s.drag && !s.solve) {
      const item = s.check !== undefined ? data.checks[s.check] : s.predict;
      const picks = s.check !== undefined ? st.picks[s.check] || [] : sec.pred[si] === undefined ? [] : [sec.pred[si]];
      const open = !picks.some((oi) => item.options[oi] && item.options[oi].correct) && !(s.predict && picks.length);
      action = action.replace('class="cv2s-act course-check', 'class="cv2s-act course-check cvb-onboard');
      void open;
    }
    if (all && s.solve && SV()) action = SV().view(api, si);
    // 自己算：題目寫在板上，輸入框疊在題目底下（course_board.js 的 placeSolve）
    if (bd && whole && all && s.solve && !s.drag && SV()) action = action.replace('class="cv2s-act course-check cs-solve', 'class="cv2s-act course-check cs-solve cvb-onboard cvb-inpaper');
    if (P && !all && cur.why) action = P.why(api, si, shown - 1);
    if (P && all && (s.order || s.where)) action = P.view(api, si);
    // 證明的「為什麼」、「用在哪一步」與「排順序」也寫在板上、在板上點（course_board.js 的 lessonBoard）；下面只留理由與「直接看」
    if (bd && whole && action && P && ((!all && cur.why) || (all && (s.where || s.order))) && !s.drag && !s.solve) {
      action = action.replace('class="cv2s-act course-check', 'class="cv2s-act course-check cvb-onboard');
    }
    const ok = all && resolved(api, si);
    // 念完、輪到學生動手：一行看得到的提示（念到一半突然沒聲音，不知道要幹嘛）；做完就收
    const CUE = { drag: "換你了：拖拖看上面的圖", solve: "換你了：自己算算看下面這一題", why: "先想一想：這一步為什麼成立？選一個再往下" };
    const kind = !all && cur.why ? "why" : s.drag ? "drag" : s.solve ? "solve" : "act";
    const cue = action && ((all && !ok) || (!all && cur.why)) ? `<p class="cv2s-cue" data-cv2s-cue>${icon("chevron-down")}<span>${CUE[kind] || "換你了：做做看下面這一題"}</span></p>` : "";
    const gain = sec.gain[si] ? `<span class="cv2s-xp">+${sec.gain[si]} XP</span>` : "";
    const lastOne = si === n - 1;
    const bar = pend ? "" : all
      ? `<button type="button" class="button ${ok ? "home-primary" : "ghost"}" data-action="course-s-next" data-cv2s-next>${lastOne ? "完成這一課" : "下一節"}${icon("chevron-right")}</button>${gain}`
      : `<button type="button" class="button home-primary" data-action="course-s-next" data-cv2s-next>下一句<small>${shown} / ${s.beats.length}</small></button>`;
    // 一課一塊黑板：板子底下什麼都不放（使用者：「課程只剩黑板，下面什麼都不要，除了旁白播放列」）。
    // 小測的理由／「對了」疊在板子底部；拖曳、自己算、排順序、用在哪一步、證明的「為什麼」這些板上做不了的動作照舊放在板子下面。
    const onboard = bd && whole && /cvb-onboard/.test(action);
    const settled = all && (onboard ? ok || (s.predict && sec.pred[si] !== undefined) : !action || ok || Boolean(s.order || s.where));
    const nextHint = bd && whole && settled ? `<p class="cvb-next" aria-hidden="true">${typeof document !== "undefined" && document.documentElement.classList.contains("nb") ? "點一下" : "點黑板"} →${lastOne ? "完成這一課" : "下一節"}</p>` : "";
    return `
      <article class="cv2s-sec${bd ? " has-board cvb-sec" : ""}${bd && whole ? " cvb-whole" : ""}" aria-label="第 ${si + 1} 節">
        <h3><small>${si + 1} / ${n}</small>${fmt(s.title)}${P && s.proof ? P.tag(api, s) : ""}</h3>
        ${s.key ? `<p class="cv2s-key"><b>重點</b><span>${fmt(s.key)}</span></p>` : ""}
        ${bd && whole ? "" : figs}
        ${bd ? (whole
          // 一課一塊：圖釘在板上保留的那一塊（舞台裡，不在 slot 裡：拖滑桿、按播放不會被當成「點黑板＝下一句」）
          ? `<div class="cvb-stage">${figs ? `<div class="cvb-model" data-cvb-model>${figs}</div>` : ""}<div class="cvb-slot" data-cvb-slot data-action="course-s-next" data-how="tap"></div>${onboard ? action : ""}${nextHint}</div>`
          : `<div class="cvb-slot" data-cvb-slot data-action="course-s-next" data-how="tap"></div>`) : ""}
        <ol class="cv2s-beats" data-action="course-s-next" data-how="tap" aria-live="polite">${beats}</ol>
        ${onboard ? "" : cue}
        ${onboard ? "" : action}
        <div class="cv2s-bar">${bar}</div>
      </article>`;
  }

  function render(api) {
    injectStyle();
    // 換一課、或重新打開（course_v2_ui 換了一份 state）：旁白停掉
    // 錄音也放掉（串流網址可能過期）
    if (N()) N().reset(api.state);
    last = api;
    const { m, data, records, head, deps } = api;
    const { escapeAttr, icon } = deps;
    // 有證明節先抓 course_proof.js、有黑板先抓 course_board.js（抓不到：照一般的節畫）
    const need = !PF() && !pfail && data.sections.some((s) => s.proof) ? "secproof" : !BD() && !bfail && data.sections.some(boarded) ? "board" : "";
    if (need) {
      Promise.resolve(deps.ensureLazy(need)).then(deps.render, () => { if (need === "board") bfail = true; else pfail = true; deps.render(); });
      return `<main class="screen lazy-loading" aria-busy="true"><section class="course-lesson cv2-lesson cv2s">${head}</section></main>`;
    }
    if (!N() && !nfail && data.sections.some((s) => s.beats.some((b) => b.say))) {
      Promise.resolve(deps.ensureLazy("narration")).then(deps.render, () => { nfail = true; deps.render(); });
      return `<main class="screen lazy-loading" aria-busy="true"><section class="course-lesson cv2-lesson cv2s">${head}</section></main>`;
    }
    if (N() && !N().ready) { N().ready = true; N().init({ get last() { return last; }, get navH() { return navH; }, measureNav, asking, reveal, patch, show, next: (a) => act(a, "course-s-next", { how: "tap" }), done: finished }); }
    if (!SV() && !sfail && data.sections.some((s) => s.solve)) {
      Promise.resolve(deps.ensureLazy("secsolve")).then(deps.render, () => { sfail = true; deps.render(); });
      return `<main class="screen lazy-loading" aria-busy="true"><section class="course-lesson cv2-lesson cv2s">${head}</section></main>`;
    }
    const sec = visitOf(api);
    const e = entryOf(api.records, m.id);
    const doneSet = new Set((e.secDone || []).concat(Object.keys(sec.done).map(Number)));
    const n = data.sections.length;
    const dots = `
      <nav class="cv2s-dots" aria-label="這一課的節">
        ${data.sections.map((s, i) => `<button type="button" class="cv2s-dot ${doneSet.has(i) ? "is-done" : ""} ${sec.si === i ? "is-now" : ""}" data-action="course-s-go" data-to="${i}" aria-label="${escapeAttr(`第 ${i + 1} 節：${s.title.replace(/\$/g, "")}${doneSet.has(i) ? "（做完了）" : ""}`)}" ${sec.si === i ? `aria-current="step"` : ""}><i>${doneSet.has(i) ? icon("check") : i + 1}</i></button>`).join("")}
      </nav>`;
    // 結算畫面在 src/course_finish.js（data-lazy="secfinish"）：讀到最後一節就先抓
    const F = window.BuzzCourseFinish;
    if (sec.si >= n - 1 && !F && !ffail) Promise.resolve(deps.ensureLazy("secfinish")).then(() => { if (api.state.sec.si >= n) deps.render(); }, () => { ffail = true; if (api.state.sec.si >= n) deps.render(); });
    const body = sec.si < n ? sectionView(api, sec.si) : F ? F.view(api, e) : `<article class="cv2s-sec cv2s-finish" aria-busy="${!ffail}"><p class="panel-note">${ffail ? "結算載不到 —— 檢查一下網路。" : "…"}</p><button type="button" class="button" data-action="open-course">課程表</button></article>`;
    if (typeof queueMicrotask === "function") queueMicrotask(() => afterRender(api)); else window.setTimeout(() => afterRender(api), 0);
    return `
      <main class="screen">
        <section class="course-lesson cv2-lesson cv2s" data-cv2s="${sec.si}">
          ${head}
          ${dots}
          ${sec.si === 0 && api.boss ? api.boss.card() : ""}
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
    if (BD()) BD().sync(api, root);
    sec.fresh = -1;
    // 手機的頂列 sticky、橫跨整個寬度：黏著的圖停在它下面
    const topbar = document.querySelector(".topbar");
    let top = 0;
    if (topbar) {
      const r = topbar.getBoundingClientRect();
      if (r.width >= document.documentElement.clientWidth - 1 && r.top <= 0.5) top = Math.round(r.bottom);
    }
    root.style.setProperty("--cv2s-top", `${top}px`);
    measureNav();
    if (N()) { if (sec.si < api.data.sections.length) N().ensureDock(api); else { N().halt(); N().removeDock(); } }
    // 黏著的圖太高（留給字的不到 220px）就不黏。這一節有黑板也不黏：自動捲動要讓最新那一句與動作看得到，
    // 黏著的圖就會蓋住板子的上半（板子不擦以後越寫越滿；板子本身已經把這一句畫出來了）
    const boarded = Boolean(root.querySelector(".cvb-slot, .cvb"));
    root.querySelectorAll(".cv2-figure.is-widget").forEach((f) => f.classList.toggle("is-loose", boarded || f.offsetHeight > window.innerHeight - top - navH - (N() && N().dockH() ? N().dockH() + 16 : 0) - 220));
    if (sec.top) window.scrollTo(0, 0);
    if ((sec.top || sec.bar) && sec.si < api.data.sections.length) show(sec.bar, sec.top);
    sec.top = false;
    sec.bar = false;
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
      if (N()) N().halt();
      deps.render();
      window.scrollTo(0, 0);
      return;
    }
    if (!api.data || !api.data.sections) return;
    const sec = visitOf(api);
    const S = api.data.sections;
    if (/^course-s-(play|rate|subs|voice)$/.test(action)) return N() && N().act(api, action);
    // 結算畫面的「做小測／重做小測」：還有沒作答的小測 → 跳到那一節；全答過了 → 這一輪清掉（第一次就對才算分），從第一個小測重來
    if (action === "course-s-requiz") {
      const open = (s) => s.check !== undefined && !(api.state.picks[s.check] || []).length;
      if (!S.some(open)) {
        api.state.picks = {};
        api.state.recorded = false;
        api.update(api.m.id, (e) => ({ ...e, picks: {} }));
      }
      enter(api, Math.max(0, S.findIndex((s) => s.check !== undefined && (open(s) || !S.some(open)))));
      deps.render();
      return;
    }
    // 結算的「攤開整塊黑板」：黑板模組是延後載入的（直接從結算畫面重開時還沒抓）
    if (action === "course-s-board") {
      Promise.resolve(window.BuzzBoard ? null : deps.ensureLazy("board")).then(() => { if (window.BuzzBoard && window.BuzzBoard.overview) window.BuzzBoard.overview(api); });
      return;
    }
    if (action === "course-s-go") { enter(api, data.to); deps.render(); return N() && N().resume(api); }
    // 證明節：3 = 為什麼答了（播放開著就接著念）、2 = 動作做完
    if (/^course-s-(why|see|ord|whr)$/.test(action)) {
      const r = PF() ? PF().act(api, action, data) : 0;
      if (r === 2) { sec.dragOk[sec.si] = true; complete(api, sec.si); }
      if (r === 3 && voiceOn()) { patch(api); return N().answered(api); }
      sec.bar = r === 3 || "act";
      return r && deps.render();
    }
    if (/^course-s-(solve|reveal)$/.test(action)) {
      const r = SV() ? SV().act(api, action) : 0;
      if (r === 2) { complete(api, sec.si); settle(api); }
      sec.bar = "act";
      return r && deps.render();
    }
    if (action === "course-s-next") {
      if (sec.si >= S.length) return;
      const s = S[sec.si];
      const shown = sec.shown[sec.si] || 1;
      if (asking(api, sec.si, shown - 1)) return;
      if (shown < s.beats.length) {
        sec.shown[sec.si] = shown + 1;
        reveal(api, sec.si, shown);
        // 播放中點「下一句」＝跳到下一句念（暫停中只換句）；原地長，不整頁重繪
        if (voiceOn()) {
          patch(api);
          N().skip(api);
          return;
        }
        sec.bar = true;
        deps.render();
        return;
      }
      // 點句子那一塊只出下一句；換節要按鈕（或 →），免得手滑跳走。
      // 一課一塊黑板沒有按鈕（板子底下什麼都不放）：這一節做完了，點黑板就換節；小測、先猜、拖曳、自己算還沒做完就不動
      if (data.how === "tap") {
        const whole = Boolean(BD() && BD().whole && BD().whole(api));
        const quiz = s.check !== undefined || s.predict;
        const done = s.predict ? sec.pred[sec.si] !== undefined : resolved(api, sec.si);
        if (!whole || ((quiz || s.drag || s.solve) && !done)) return;
      }
      // 沒有動作的節（拖圖只在全文，分節拿掉之後剩句子）：讀完往下就算做完
      if (s.check === undefined && !s.predict && !s.solve && !s.order && !s.where && !s.drag) complete(api, sec.si);
      enter(api, sec.si + 1);
      deps.render();
      return N() && N().resume(api);
    }
    if (action === "course-s-pick") {
      const si = sec.si;
      const s = S[si];
      if (!s) return;
      if (data.kind === "predict" && s.predict) {
        if (sec.pred[si] !== undefined) return;
        sec.pred[si] = Number(data.option);
        complete(api, si);
        sec.bar = "act";
        deps.render();
        return N() && N().settled(api);
      }
      if (data.kind === "check" && s.check !== undefined) {
        const ci = s.check;
        const oi = Number(data.option);
        const check = api.data.checks[ci];
        const picks = api.state.picks[ci] || [];
        if (!check || !check.options[oi] || picks.includes(oi) || picks.some((x) => check.options[x].correct)) return;
        api.update(api.m.id, (e) => ({ ...e, picks: { ...(e.picks || {}), [ci]: picks.concat(oi) } }));
        if (check.options[oi].correct) complete(api, si);
        sec.bar = "act";
        // 記分照全文的 course-pick（第一次就對才算）；它會重繪
        api.act("course-pick", { check: ci, option: oi });
        settle(api);
        deps.render();
        return N() && N().settled(api);
      }
    }
  }

  // 拖滑桿進範圍：放開時（change）判定
  // → / 空白鍵：下一句（輸入框、滑桿上不搶；空白鍵在按鈕上照按鈕的意思）
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
      sec.bar = "act";
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

  // voice()：給 E2E 與黑板看旁白的狀態（在 course_narration.js）
  window.BuzzCourseSections = { render, act, optionOrder, voice: () => (N() ? N().status() : {}) };
})();
