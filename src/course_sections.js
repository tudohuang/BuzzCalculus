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
/* 手機：頁首往上收（第一句在第一屏的上半）；桌機在最後一行改回來 */
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
.cv2s-sec > h3 small { margin: 0 8px 0 0; color: var(--muted); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
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
.cv2s-say { margin: 6px 0 0; padding: 6px 10px; border-radius: 8px; background: color-mix(in srgb, var(--ink) 6%, var(--paper)); color: var(--ink); font-size: 0.92rem; line-height: 1.7; }
.cv2s.has-dock { padding-bottom: 72px; }
.cv2s-dock { position: fixed; z-index: 30; left: 50%; bottom: 16px; display: grid; justify-items: center; gap: 4px; transform: translateX(-50%); pointer-events: none; }
.cv2s-dock > * { pointer-events: auto; }
.cv2s-voice { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 999px; background: var(--paper); box-shadow: 0 6px 18px rgb(0 0 0 / 0.12); }
.cv2s-voice button { display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 44px; min-height: 40px; padding: 0 12px; border: 1px solid transparent; border-radius: 999px; background: var(--paper); color: var(--ink); font: inherit; font-size: 0.86rem; font-weight: 700; font-variant-numeric: tabular-nums; cursor: pointer; }
.cv2s-voice button[aria-pressed="true"] { border-color: var(--gold); background: color-mix(in srgb, var(--gold) 14%, var(--paper)); }
.cv2s-voice svg { width: 16px; height: 16px; }
.cv2s-voice-off { margin: 0; padding: 2px 10px; border-radius: 999px; background: var(--paper); color: var(--muted); font-size: 0.84rem; white-space: nowrap; }
.cv2s-voice-off[hidden] { display: none; }
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

  /* ── 旁白（按了「播放」才有）：一課一支 <大綱的 narration 前綴><課>-<voice>.mp3，每一句 t = [起, 訖] 毫秒（build_narration.js）。
     preload="none"，按了才抓、之後靠 Range 串流。念完一句自己出下一句（下一句接在後面，不跳）；這一節最後一句停在動作前。
     只有一個 <audio>（iOS 在點的那一下解鎖）。訖點用計時器看（timeupdate 太粗）。出錯先重載一次（簽名網址過期），再錯 → 一行字、點的照常。 */
  const RATES = [1, 1.25, 1.5];
  const voice = { on: false, paused: false, wait: false, err: false, id: "", si: -1, bi: -1, el: null, timer: 0, state: null, start: 0, end: 0, retries: 0 };
  const segOf = (api, si, bi) => {
    const b = api.data.sections[si] && api.data.sections[si].beats[bi];
    if (!b || !Array.isArray(b.t) || !api.data.voice) return null;
    const base = (window.BUZZ_COURSE_V2 && window.BUZZ_COURSE_V2.narration) || "media/narration/";
    return { url: `${base}${api.m.id}-${api.data.voice}.mp3`, start: Number(b.t[0]), end: Number(b.t[1]) };
  };
  const voiced = (data) => data.sections.some((s) => s.beats.some((b) => b.say));
  const voicePrefs = (records) => {
    const s = records.settings || {};
    return { rate: RATES.includes(Number(s.narrRate)) ? Number(s.narrRate) : 1, subs: Boolean(s.narrSubs) };
  };
  const alive = () => Boolean(last && voice.id === last.m.id && typeof document !== "undefined" && document.querySelector("[data-cv2s]"));
  const nowMs = () => (voice.el ? voice.el.currentTime * 1000 : 0);
  function audio() {
    if (!voice.el) { voice.el = new Audio(); voice.el.preload = "none"; }
    const el = voice.el;
    el.onended = () => { if (voice.end) advance(); };
    el.onerror = retry;
    el.onplaying = () => { voice.retries = 0; arm(); };
    el.ontimeupdate = () => { if (!alive()) halt(); };
    return el;
  }
  function hush() {
    window.clearTimeout(voice.timer);
    voice.end = 0;
    if (voice.el) voice.el.pause();
  }
  function halt() {
    hush();
    voice.on = false;
    voice.paused = false;
    voice.wait = false;
    voice.bi = -1;
  }
  // 看訖點：還沒跳到起點（seek 中）就再等；到了就往下一句
  function arm() {
    window.clearTimeout(voice.timer);
    const el = voice.el;
    if (!voice.on || voice.paused || voice.wait || !el || !voice.end) return;
    if (!alive()) { halt(); return; }
    const t = nowMs();
    if (!el.seeking && t >= voice.start - 60 && t >= voice.end - 15) { advance(); return; }
    const left = el.seeking || t < voice.start - 60 ? 250 : (voice.end - t) / (el.playbackRate || 1);
    voice.timer = window.setTimeout(arm, Math.max(15, Math.min(left - 10, 500)));
  }
  function seek(el, ms) {
    const go = () => { if (Math.abs(el.currentTime * 1000 - ms) > 30) el.currentTime = ms / 1000; };
    if (el.readyState >= 1) { go(); return; }
    // 還沒有 metadata：先記著（Chrome 會當成起播位置），metadata 到了再確認一次
    try { el.currentTime = ms / 1000; } catch (_e) { /* 舊 Safari：等 metadata */ }
    el.addEventListener("loadedmetadata", () => { if (voice.on && voice.start === ms) go(); }, { once: true });
  }
  function play(el) {
    const p = el.play();
    if (p && p.catch) p.catch((e) => { if (!e || e.name !== "AbortError") fail(); });
  }
  // 念目前亮著的那一句（這一節出到的最後一句）
  function speak(api) {
    const sec = api.state.sec;
    const s = api.data.sections[sec.si];
    window.clearTimeout(voice.timer);
    if (!s) { hush(); voice.wait = true; return; }
    const bi = Math.min(s.beats.length, sec.shown[sec.si] || 1) - 1;
    Object.assign(voice, { id: api.m.id, si: sec.si, bi, wait: false, paused: false });
    const seg = segOf(api, sec.si, bi);
    if (!seg) {
      // 有字沒錄音（字改過還沒重錄）：停一下再往下
      hush();
      voice.timer = window.setTimeout(advance, Math.max(1500, String(s.beats[bi].say || "").length * 220));
      return;
    }
    const el = audio();
    const same = el.getAttribute("src") === seg.url;
    // 自己念完上一句、下一句就接在後面：不跳，直接念下去（沒有斷點）
    const flowing = same && !el.paused && !el.seeking && Math.abs(nowMs() - seg.start) < 250;
    Object.assign(voice, { start: seg.start, end: seg.end });
    if (!same) { el.src = seg.url; voice.retries = 0; }
    // 換 src 會把 playbackRate 重設成 defaultPlaybackRate：兩個都設
    el.defaultPlaybackRate = el.playbackRate = voicePrefs(api.deps.loadRecords()).rate;
    if (!flowing) seek(el, seg.start);
    if (el.paused) play(el);
    arm();
  }
  function advance() {
    const api = last;
    if (!voice.on || voice.paused || voice.wait || !alive()) { if (!alive()) halt(); return; }
    const sec = api.state.sec;
    const s = api.data.sections[sec.si];
    const shown = (s && sec.shown[sec.si]) || 1;
    if (s && shown < s.beats.length) {
      sec.shown[sec.si] = shown + 1;
      reveal(api, sec.si, shown);
      patch(api);
      speak(api);
    } else {
      // 這一節念完：停在動作前（做完按「下一節」再接著念）
      hush();
      voice.wait = true;
      updateDock();
    }
  }
  // 播到一半出錯（網路斷一下、Release 的簽名網址過期）：重新載一次、從這一句的起點接；再錯才算載不到
  function retry() {
    const el = voice.el;
    if (!voice.on || !el || !el.getAttribute("src")) return;
    if (voice.retries >= 1 || !voice.end) { fail(); return; }
    voice.retries += 1;
    const url = el.getAttribute("src");
    el.removeAttribute("src");
    el.load();
    el.src = url;
    seek(el, voice.start);
    if (!voice.paused) play(el);
  }
  function fail() {
    if (!voice.on) return;
    halt();
    voice.err = true;
    updateDock();
  }

  /* 播放鍵、語速、字幕放在 body 底下的一條「dock」（position: fixed）：整頁重繪、一句一句長出來、捲動都不會動到它，
     按鈕一直是同一顆（鍵盤焦點留著）。手機停在底部分頁列上面，桌機停在本文欄底部置中。
     不是 #app 裡的東西：點擊自己接（app.js 的委派只看 #app），離開分節畫面（#app 換掉）就拿掉。 */
  let dock = null;
  let watcher = null;
  let pointerDown = false;
  let pending = null; // 手指按著時不捲：放開再捲
  const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
  const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>`;
  function removeDock() {
    if (watcher) { watcher.disconnect(); watcher = null; }
    if (dock) { dock.remove(); dock = null; }
  }
  function ensureDock(api) {
    if (!voiced(api.data)) { removeDock(); return; }
    if (!dock) {
      dock = document.createElement("div");
      dock.className = "cv2s-dock";
      dock.setAttribute("role", "group");
      dock.setAttribute("aria-label", "旁白");
      dock.innerHTML = `<p class="cv2s-voice-off" data-cv2s-voice-off hidden>旁白載不到，用點的繼續。</p><span class="cv2s-voice"><button type="button" data-cv2s-play></button><button type="button" data-cv2s-rate></button><button type="button" data-cv2s-subs>字幕</button></span>`;
      dock.addEventListener("click", (event) => {
        const b = event.target && event.target.closest && event.target.closest("button");
        if (!b || !last || !last.state.sec) return;
        voiceAct(last, b.hasAttribute("data-cv2s-play") ? "course-s-play" : b.hasAttribute("data-cv2s-rate") ? "course-s-rate" : "course-s-subs");
      });
      document.body.appendChild(dock);
      // 換到別的畫面（課程表、全文、結算…）：停掉、拿掉
      watcher = new MutationObserver(() => {
        if (!document.querySelector("[data-cv2s] .cv2s-sec:not(.cv2s-finish)")) { halt(); removeDock(); }
      });
      watcher.observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
    }
    placeDock();
    updateDock();
  }
  function placeDock() {
    const root = dock && document.querySelector("[data-cv2s]");
    if (!root) return;
    const nav = document.querySelector(".topbar-nav");
    const fixedNav = nav && getComputedStyle(nav).position === "fixed";
    const r = root.getBoundingClientRect();
    dock.style.bottom = `${fixedNav ? Math.round(window.innerHeight - nav.getBoundingClientRect().top + 8) : 16}px`;
    dock.style.left = `${Math.round(r.left + r.width / 2)}px`;
    root.classList.add("has-dock");
  }
  function updateDock() {
    if (!dock || !last) return;
    const { rate, subs } = voicePrefs(last.records);
    const playing = voice.on && !voice.paused;
    const play = dock.querySelector("[data-cv2s-play]");
    const label = playing ? "暫停" : voice.on ? "繼續" : "播放";
    if (play.dataset.state !== label) { play.innerHTML = `${playing ? PAUSE_SVG : PLAY_SVG}${label}`; play.dataset.state = label; }
    play.setAttribute("aria-pressed", String(playing));
    const r = dock.querySelector("[data-cv2s-rate]");
    r.textContent = `${rate}×`;
    r.setAttribute("aria-label", `語速 ${rate} 倍`);
    dock.querySelector("[data-cv2s-subs]").setAttribute("aria-pressed", String(subs));
    dock.querySelector("[data-cv2s-voice-off]").hidden = !voice.err;
  }
  // 只換這一節會變的那幾塊（句子、影片、動作、下一句那一列），不整頁重繪；圖原地動
  function patch(api) {
    const art = document.querySelector("[data-cv2s] .cv2s-sec:not(.cv2s-finish)");
    if (!art || !art.querySelector(".cv2s-beats") || typeof document.createElement("template").content === "undefined") { api.deps.render(); return; }
    const tpl = document.createElement("template");
    tpl.innerHTML = sectionView(api, api.state.sec.si);
    const fresh = tpl.content.querySelector(".cv2s-sec");
    art.querySelector(".cv2s-beats").replaceWith(fresh.querySelector(".cv2s-beats"));
    art.querySelectorAll(":scope > [data-cv2-video], :scope > [data-cv2s-act]").forEach((n) => n.remove());
    const bar = art.querySelector(".cv2s-bar");
    fresh.querySelectorAll(":scope > [data-cv2-video], :scope > [data-cv2s-act]").forEach((n) => art.insertBefore(n, bar));
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
    sec.fresh = -1;
    mountVideo(api, art);
    show(art.querySelector(".cv2s-beat.is-now"));
  }
  // 新的一句在畫面下面：只捲到剛好看得到它（停在 dock 上面）；手指按著的時候先不捲
  function show(el) {
    if (!el) return;
    if (pointerDown) { pending = el; return; }
    const limit = dock ? dock.getBoundingClientRect().top - 8 : window.innerHeight;
    const over = el.getBoundingClientRect().bottom - limit;
    if (over > 0) window.scrollBy({ top: over, behavior: reduced() ? "auto" : "smooth" });
  }
  // 換節之後：播放開著（沒暫停）就從這一節的第一句接著念；這一節已經整節出完過就停在動作前
  function resume(api) {
    if (!voice.on || voice.paused) return;
    hush();
    const sec = api.state.sec;
    const s = api.data.sections[sec.si];
    if (s && (sec.shown[sec.si] || 1) === 1) speak(api);
    else voice.wait = true;
    updateDock();
  }
  function voiceAct(api, action) {
    const { deps } = api;
    if (action === "course-s-play") {
      voice.err = false;
      if (voice.on && !voice.paused) {
        // 暫停；停在動作前的時候再按一次就是關掉
        if (voice.wait) halt();
        else { voice.paused = true; window.clearTimeout(voice.timer); if (voice.el) voice.el.pause(); }
      } else if (voice.on && voice.paused && voice.el && voice.end && voice.el.getAttribute("src") && voice.si === api.state.sec.si && voice.bi === Math.min(api.data.sections[voice.si].beats.length, api.state.sec.shown[voice.si] || 1) - 1) {
        // 暫停的那一句接著念
        voice.paused = false;
        play(audio());
        arm();
      } else {
        voice.on = true;
        speak(api);
      }
      updateDock();
      return;
    }
    const records = deps.loadRecords();
    records.settings = records.settings || {};
    if (action === "course-s-rate") {
      const rate = RATES[(RATES.indexOf(voicePrefs(records).rate) + 1) % RATES.length];
      records.settings.narrRate = rate;
      if (voice.el) voice.el.defaultPlaybackRate = voice.el.playbackRate = rate;
    }
    if (action === "course-s-subs") records.settings.narrSubs = !voicePrefs(records).subs;
    deps.saveRecords(records);
    // 之後的重繪（patch）照新的設定畫：手上這兩份 api 的 records 一起換
    if (last) last.records = { ...last.records, settings: { ...records.settings } };
    api.records = { ...api.records, settings: { ...records.settings } };
    updateDock();
    if (action === "course-s-subs") patch(api);
  }
  if (typeof document !== "undefined" && document.addEventListener) {
    // iOS：<audio> 要在點下去的那一下（同步）先 load 過，之後換 src 才能自己接著播
    document.addEventListener("click", (event) => {
      const t = event.target;
      if (!t || !t.closest || !t.closest("[data-cv2s-play]") || voice.el) return;
      voice.el = new Audio();
      voice.el.preload = "none";
      try { voice.el.load(); } catch (_e) { /* 舊瀏覽器 */ }
    }, true);
    document.addEventListener("pointerdown", () => { pointerDown = true; }, true);
    const up = () => { pointerDown = false; if (pending) { const el = pending; pending = null; if (el.isConnected) show(el); } };
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
    window.addEventListener("resize", () => { if (dock) placeDock(); });
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
    const subs = voicePrefs(api.records).subs;
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
        ${subs && b.say && bi === shown - 1 ? `<p class="cv2s-say" data-cv2s-say>${escapeHtml(b.say)}</p>` : ""}
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
    // 換一課、或重新打開（course_v2_ui 換了一份 state）：旁白停掉
    // 錄音也放掉（下次按播放重新抓：串流網址可能過期、網路可能換了）
    if (voice.state !== api.state) {
      halt();
      if (voice.el && voice.el.getAttribute("src")) { voice.el.removeAttribute("src"); voice.el.load(); }
      voice.err = false;
      voice.state = api.state;
    }
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
    const body = sec.si >= n ? finishView(api, e) : sectionView(api, sec.si);
    if (typeof queueMicrotask === "function") queueMicrotask(() => afterRender(api)); else window.setTimeout(() => afterRender(api), 0);
    return `
      <main class="screen">
        <section class="course-lesson cv2-lesson cv2s" data-cv2s="${sec.si}">
          ${head}
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
    if (sec.si < api.data.sections.length) ensureDock(api); else { halt(); removeDock(); }
    if (sec.top) { sec.top = false; window.scrollTo(0, 0); }
    else if (sec.bar) {
      // 新的一句或動作出現在下面：把「下一句／下一節」那一列帶進畫面，停在手機底部分頁列（與旁白的 dock）上面
      const bar = root.querySelector(".cv2s-bar");
      const nav = document.querySelector(".topbar-nav");
      const navTop = dock ? dock.getBoundingClientRect().top - 4 : nav && getComputedStyle(nav).position === "fixed" ? nav.getBoundingClientRect().top : window.innerHeight;
      const over = bar ? bar.getBoundingClientRect().bottom + 12 - navTop : 0;
      if (over > 0) window.scrollBy({ top: over, behavior: reduced() ? "auto" : "smooth" });
    }
    sec.bar = false;
    mountVideo(api, root);
  }
  function mountVideo(api, root) {
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
      halt();
      deps.render();
      window.scrollTo(0, 0);
      return;
    }
    if (!api.data || !api.data.sections) return;
    const sec = visitOf(api);
    const S = api.data.sections;
    if (/^course-s-(play|rate|subs)$/.test(action)) return voiceAct(api, action);
    if (action === "course-s-go") { enter(api, data.to); deps.render(); return resume(api); }
    if (action === "course-s-next") {
      if (sec.si >= S.length) return;
      const s = S[sec.si];
      const shown = sec.shown[sec.si] || 1;
      if (shown < s.beats.length) {
        sec.shown[sec.si] = shown + 1;
        reveal(api, sec.si, shown);
        // 播放中點「下一句」＝跳到下一句念（暫停中就只換句，繼續時從這一句念）；播放開著就原地長，不整頁重繪
        if (voice.on) {
          patch(api);
          hush();
          if (!voice.paused) speak(api); else voice.bi = -1;
          updateDock();
          return;
        }
        sec.bar = true;
        deps.render();
        return;
      }
      // 點句子那一塊只出下一句；換節要按鈕（或 →），免得手滑跳走
      if (data.how === "tap") return;
      enter(api, sec.si + 1);
      deps.render();
      return resume(api);
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

  // voice()：給 E2E 看旁白的狀態（<audio> 不在 DOM 裡）
  window.BuzzCourseSections = { render, act, voice: () => ({ on: voice.on, paused: voice.paused, wait: voice.wait, err: voice.err, si: voice.si, bi: voice.bi, rate: voice.el ? voice.el.playbackRate : 0, src: voice.el ? voice.el.getAttribute("src") || "" : "", preload: voice.el ? voice.el.preload : "", beat: voice.bi >= 0 ? `${voice.si}-${voice.bi}` : "", at: Math.round(nowMs()), start: voice.start, end: voice.end }) };
})();
