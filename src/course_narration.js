// 分節模式的旁白播放（從 course_sections.js 搬出來；行為不變）：一課一支 mp3、播放／暫停、語速、句間停頓、字幕、念完自己出下一句、
// 問句念完停下來等、兩個聲音（女聲／男聲，records.settings.narrVoice；選的那一個沒有就用另一個）、載不到退回點的；按鈕在 body 底下的 dock。data-lazy="narration"：有 say 的課才抓（分節那一組放不下了）。
// 分節那邊的東西（現在這一課、出下一句、只換句子、捲動對位、問著沒）從 host 拿：course_sections.js 載入後 init 一次。
(function () {
  "use strict";
  const CSS = `.cv2s.has-dock { padding-bottom: var(--cv2s-room, 72px); }
.cv2s-dock { position: fixed; z-index: 30; left: 0; right: 0; bottom: calc(var(--cv2s-nav, 8px) + 8px); display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none; }
.cv2s-dock > * { pointer-events: auto; }
.cv2s-voice { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 999px; background: var(--paper); box-shadow: 0 6px 18px rgb(0 0 0 / 0.12); }
.cv2s-voice button { display: inline-flex; white-space: nowrap; align-items: center; justify-content: center; gap: 4px; min-width: 44px; min-height: 40px; padding: 0 12px; border: 1px solid transparent; border-radius: 999px; background: var(--paper); color: var(--ink); font: inherit; font-size: 0.86rem; font-weight: 700; font-variant-numeric: tabular-nums; cursor: pointer; }
.cv2s-voice button[aria-pressed="true"] { border-color: var(--gold); background: color-mix(in srgb, var(--gold) 14%, var(--paper)); }
.cv2s-voice svg { width: 16px; height: 16px; }
.cv2s-voice button[hidden] { display: none; }
.cv2s-voice-off { margin: 0; padding: 2px 10px; border-radius: 999px; background: var(--paper); color: var(--muted); font-size: 0.84rem; white-space: nowrap; }
.cv2s-voice-off[hidden] { display: none; }`;
  let host = null;

  /* ── 旁白：一課一支 mp3，每一句 t = [起, 訖] 毫秒（build_narration.js）；preload=none、Range 串流。
     一個 <audio>（iOS 點的那一下解鎖）；訖點用計時器看；出錯重載一次，再錯留一行字。 */
  const RATES = [1, 1.25, 1.5];
  // 句與句之間停幾拍（records.settings.narrGap；旁白列上按一下換）：一拍 0.5 秒、語速調快也跟著縮。預設不停 —— 錄音本來就首尾相接
  const GAPS = [0, 1, 2, 3];
  const BEAT_MS = 500;
  // v：現在念的聲音（f 女聲／m 男聲）；fb：選的那一個這一課沒有或載不到，先用另一個；bad：這一課載不到的聲音
  const voice = { on: false, paused: false, wait: false, ask: false, rest: false, err: false, id: "", si: -1, bi: -1, el: null, timer: 0, state: null, start: 0, end: 0, retries: 0, v: "", fb: false, bad: {} };
  // 兩個聲音的欄位（build_course_v2.js）：課的 voice／vm、句子的 t／tm、大綱的前綴 narration／narrationM
  const K = { f: ["voice", "t", "narration", "media/narration/"], m: ["vm", "tm", "narrationM", "media/narration/m/"] };
  const NAME = { f: "女聲", m: "男聲" };
  const other = (v) => (v === "m" ? "f" : "m");
  const has = (data, v) => Boolean(data[K[v][0]]) && !voice.bad[v];
  // 網站有沒有在出第二個聲音（大綱帶 narrationM 才有；2026-10 起只錄女聲）：沒有就不提「這一課還沒有男聲」——以前選過男聲的人照樣聽女聲、不留字
  const twoVoices = () => Boolean(window.BUZZ_COURSE_V2 && window.BUZZ_COURSE_V2.narrationM);
  // 這一課用哪一個聲音：選的那一個有就用；沒有（還沒上傳、載不到）用另一個
  const pick = (api) => {
    const want = voicePrefs(api.deps.loadRecords()).v;
    const v = has(api.data, want) || !has(api.data, other(want)) ? want : other(want);
    return { v, fb: v !== want };
  };
  // q：念這一句的問句（why.t；答了才念 t）
  const segOf = (api, si, bi, q, v) => {
    const b = api.data.sections[si] && api.data.sections[si].beats[bi];
    const t = b && (q ? b.why[K[v][1]] : b[K[v][1]]);
    if (!Array.isArray(t) || !api.data[K[v][0]]) return null;
    const base = (window.BUZZ_COURSE_V2 && window.BUZZ_COURSE_V2[K[v][2]]) || K[v][3];
    return { url: `${base}${api.m.id}-${api.data[K[v][0]]}.mp3`, start: Number(t[0]), end: Number(t[1]) };
  };
  const voiced = (data) => data.sections.some((s) => s.beats.some((b) => b.say));
  const voicePrefs = (records) => {
    const s = records.settings || {};
    return { rate: RATES.includes(Number(s.narrRate)) ? Number(s.narrRate) : 1, gap: GAPS.includes(Number(s.narrGap)) ? Number(s.narrGap) : 0, subs: Boolean(s.narrSubs), v: s.narrVoice === "m" ? "m" : "f" };
  };
  const alive = () => Boolean(host.last && voice.id === host.last.m.id && typeof document !== "undefined" && document.querySelector("[data-cv2s]"));
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
    voice.rest = false;
    if (voice.el) voice.el.pause();
  }
  function halt() {
    hush();
    voice.on = false;
    voice.paused = false;
    voice.wait = voice.ask = false;
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
    // 還沒有 metadata：先記著，到了再確認一次
    try { el.currentTime = ms / 1000; } catch (_e) { /* 舊 Safari：等 metadata */ }
    el.addEventListener("loadedmetadata", () => { if (voice.on && voice.start === ms) go(); }, { once: true });
  }
  function play(el) {
    const p = el.play();
    if (p && p.catch) p.catch((e) => { if (!e || e.name !== "AbortError") fail(e); });
  }
  // 念目前亮著的那一句（這一節出到的最後一句）
  function speak(api) {
    const sec = api.state.sec;
    const s = api.data.sections[sec.si];
    window.clearTimeout(voice.timer);
    if (!s) { hush(); voice.wait = true; return; }
    const bi = Math.min(s.beats.length, sec.shown[sec.si] || 1) - 1;
    const q = host.asking(api, sec.si, bi);
    Object.assign(voice, { id: api.m.id, si: sec.si, bi, wait: false, paused: false, ask: q, rest: false }, pick(api));
    const seg = segOf(api, sec.si, bi, q, voice.v);
    if (!seg) {
      // 有字沒錄音（字改過還沒重錄）：停一下再往下
      hush();
      voice.timer = window.setTimeout(advance, Math.max(1500, String((q ? s.beats[bi].why : s.beats[bi]).say || "").length * 220));
      return;
    }
    const el = audio();
    const same = el.getAttribute("src") === seg.url;
    // 自己念完上一句、下一句接在後面：不跳（句與句之間錄音墊了約 0.3 秒靜音，見 build_narration.js 的 GAP_FRAMES —— 直接播過去，不 seek）
    const flowing = same && !el.paused && !el.seeking && nowMs() < seg.start + 120 && seg.start - nowMs() < 600;
    Object.assign(voice, { start: seg.start, end: seg.end });
    if (!same) { el.src = seg.url; voice.retries = 0; }
    // 換 src 會把 playbackRate 重設成 defaultPlaybackRate：兩個都設
    el.defaultPlaybackRate = el.playbackRate = voicePrefs(api.deps.loadRecords()).rate;
    if (!flowing) seek(el, seg.start);
    if (el.paused) play(el);
    arm();
  }
  function advance() {
    const api = host.last;
    if (!voice.on || voice.paused || voice.wait || !alive()) { if (!alive()) halt(); return; }
    const sec = api.state.sec;
    const s = api.data.sections[sec.si];
    const shown = (s && sec.shown[sec.si]) || 1;
    // 問句念完：還沒答就等（答了 act 接著念 say）
    if (voice.ask) {
      voice.ask = false;
      if (!host.asking(api, sec.si, voice.bi)) return speak(api);
      hush();
      voice.wait = true;
      updateDock();
      return host.show("act");
    }
    if (s && shown < s.beats.length) {
      // 停幾拍再出下一句：錄音先停在這一句的訖點，時間到了（或停頓中暫停又按繼續）才往下
      const { gap, rate } = voicePrefs(api.deps.loadRecords());
      if (gap && !voice.rest) {
        voice.rest = true;
        window.clearTimeout(voice.timer);
        if (voice.el) voice.el.pause();
        voice.timer = window.setTimeout(advance, (gap * BEAT_MS) / rate);
        return;
      }
      voice.rest = false;
      sec.shown[sec.si] = shown + 1;
      host.reveal(api, sec.si, shown);
      host.patch(api);
      speak(api);
    } else {
      // 這一節念完：停在動作前（做完按「下一節」再接著念）
      hush();
      voice.wait = true;
      updateDock();
      host.show("act");
    }
  }
  // 播到一半出錯：重載一次、從這一句的起點接；再錯才算載不到
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
  function fail(e) {
    if (!voice.on) return;
    // 這個聲音的檔載不到（還沒上傳、離線沒快取）：另一個聲音有就換過去、從這一句接著念；不准自動播（NotAllowedError）不算
    const api = host.last;
    if (voice.v && !(e && e.name === "NotAllowedError") && api && alive() && has(api.data, other(voice.v))) {
      voice.bad[voice.v] = true;
      hush();
      speak(api);
      updateDock();
      return;
    }
    halt();
    voice.err = true;
    updateDock();
  }

  /* 播放、語速、字幕在 body 底下的「dock」（fixed）：重繪、捲動都不動到它，按鈕一直是同一顆（焦點留著）。
     不在 #app 裡：點擊自己接，離開分節畫面就拿掉。 */
  let dock = null;
  let watcher = null;
  const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
  const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>`;
  let ro = null;
  function removeDock() {
    if (watcher) { watcher.disconnect(); watcher = null; }
    if (ro) { ro.disconnect(); ro = null; }
    if (dock) { dock.remove(); dock = null; document.documentElement.style.scrollPaddingBottom = ""; }
  }
  function ensureDock(api) {
    if (!voiced(api.data)) { removeDock(); return; }
    if (!dock) {
      dock = document.createElement("div");
      dock.className = "cv2s-dock";
      dock.setAttribute("role", "group");
      dock.setAttribute("aria-label", "旁白");
      dock.innerHTML = `<p class="cv2s-voice-off" data-cv2s-voice-off hidden>旁白載不到，用點的繼續。</p><span class="cv2s-voice"><button type="button" data-cv2s-play></button><button type="button" data-cv2s-rate></button><button type="button" data-cv2s-gap></button><button type="button" data-cv2s-vox hidden></button><button type="button" data-cv2s-subs>字幕</button></span>`;
      dock.addEventListener("click", (event) => {
        const b = event.target && event.target.closest && event.target.closest("button");
        if (!b || !host.last || !host.last.state.sec) return;
        voiceAct(host.last, b.hasAttribute("data-cv2s-play") ? "course-s-play" : b.hasAttribute("data-cv2s-rate") ? "course-s-rate" : b.hasAttribute("data-cv2s-gap") ? "course-s-gap" : b.hasAttribute("data-cv2s-vox") ? "course-s-voice" : "course-s-subs");
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
  /* bottom = 分頁列高 + 8（CSS 錨定，不隨 iOS 網址列伸縮）；左右貼本文欄（置中＋translate 會把按鈕擠成兩行）。
     節底與 scroll-padding 留 dock 高 + 16：捲到底一定清得開；dock 長高再算。 */
  function placeDock() {
    const root = dock && document.querySelector("[data-cv2s]");
    if (!root) return;
    const nav = host.measureNav();
    const r = root.getBoundingClientRect();
    const de = document.documentElement;
    const room = dock.offsetHeight + 16;
    dock.style.setProperty("--cv2s-nav", `${host.navH || 8}px`);
    dock.style.left = `${Math.max(0, r.left)}px`;
    dock.style.right = `${Math.max(0, de.clientWidth - r.right)}px`;
    root.style.setProperty("--cv2s-room", `${room}px`);
    de.style.scrollPaddingBottom = `${host.navH + room}px`;
    root.classList.add("has-dock");
    if (!ro && window.ResizeObserver) { ro = new ResizeObserver(() => placeDock()); ro.observe(dock); if (nav) ro.observe(nav); }
  }
  function updateDock() {
    if (!dock || !host.last) return;
    const { rate, gap, subs, v } = voicePrefs(host.last.records);
    const playing = voice.on && !voice.paused;
    const play = dock.querySelector("[data-cv2s-play]");
    const label = playing ? "暫停" : voice.on ? "繼續" : "播放";
    if (play.dataset.state !== label) { play.innerHTML = `${playing ? PAUSE_SVG : PLAY_SVG}${label}`; play.dataset.state = label; }
    play.setAttribute("aria-pressed", String(playing));
    const r = dock.querySelector("[data-cv2s-rate]");
    r.textContent = `${rate}×`;
    r.setAttribute("aria-label", `語速 ${rate} 倍`);
    const g = dock.querySelector("[data-cv2s-gap]");
    g.textContent = gap ? `停${gap}拍` : "不停";
    g.setAttribute("aria-label", gap ? `句與句之間停 ${gap} 拍` : "句與句之間不停");
    dock.querySelector("[data-cv2s-subs]").setAttribute("aria-pressed", String(subs));
    // 聲音：這一課兩個都有才給切（顯示選的那一個）；選的那一個沒有、先用另一個的時候留一行字
    const x = dock.querySelector("[data-cv2s-vox]");
    x.hidden = !(has(host.last.data, "f") && has(host.last.data, "m"));
    x.textContent = NAME[v];
    x.setAttribute("aria-label", `旁白聲音：${NAME[v]}`);
    const off = dock.querySelector("[data-cv2s-voice-off]");
    const fb = !voice.err && voice.on && voice.fb && voice.id === host.last.m.id && twoVoices();
    off.hidden = !voice.err && !fb;
    off.textContent = voice.err ? "旁白載不到，用點的繼續。" : `這一課還沒有${NAME[v]}，先用${NAME[other(v)]}。`;
  }
  // 換節：播放開著就從第一句接著念；整節出完過就停在動作前
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
        // 暫停的那一句接著念；停頓中暫停的就直接出下一句
        voice.paused = false;
        if (voice.rest) advance();
        else { play(audio()); arm(); }
      } else {
        voice.on = true;
        speak(api);
      }
      if (voice.on && !voice.paused) host.show();
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
    if (action === "course-s-gap") records.settings.narrGap = GAPS[(GAPS.indexOf(voicePrefs(records).gap) + 1) % GAPS.length];
    if (action === "course-s-subs") records.settings.narrSubs = !voicePrefs(records).subs;
    if (action === "course-s-voice") records.settings.narrVoice = other(voicePrefs(records).v);
    deps.saveRecords(records);
    // 之後的重繪照新的設定畫
    if (host.last) host.last.records = { ...host.last.records, settings: { ...records.settings } };
    api.records = { ...api.records, settings: { ...records.settings } };
    if (action === "course-s-voice") {
      // 換聲音：停掉這一段、位置留在這一句；正在念就用另一個聲音從這一句的開頭接著念，暫停中就等按播放
      voice.bad = {};
      if (voice.on && !voice.wait) { hush(); if (voice.paused) voice.bi = -1; else speak(api); }
    }
    updateDock();
    if (action === "course-s-subs") host.patch(api);
  }

  /* ── 給 course_sections.js ── */
  window.BuzzCourseNarration = {
    init(h) {
      host = h;
      if (!document.getElementById("cv2n-style")) { const st = document.createElement("style"); st.id = "cv2n-style"; st.textContent = CSS; document.head.appendChild(st); }
    },
    voiced, voicePrefs, halt, hush, speak, resume, updateDock, removeDock, ensureDock,
    act: voiceAct,
    on: () => voice.on,
    paused: () => voice.paused,
    waiting: () => voice.wait,
    // 換一課、或重新打開：旁白停掉，錄音也放掉（串流網址可能過期）
    reset(state) {
      if (voice.state === state) return;
      halt();
      if (voice.el && voice.el.getAttribute("src")) { voice.el.removeAttribute("src"); voice.el.load(); }
      voice.err = false;
      voice.bad = {};
      voice.fb = false;
      voice.v = "";
      voice.state = state;
    },
    // 播放中點「下一句」／為什麼答了：接著念
    skip(api) { hush(); if (!voice.paused) speak(api); else voice.bi = -1; updateDock(); },
    answered(api) { if (!voice.paused && voice.wait) speak(api); updateDock(); },
    dockTop: () => (dock ? dock.getBoundingClientRect().top : null),
    dockH: () => (dock ? dock.offsetHeight : 0),
    // voice()：給 E2E 與黑板看旁白的狀態（<audio> 不在 DOM 裡；黑板的時間 = at − start）
    status: () => ({ on: voice.on, paused: voice.paused, wait: voice.wait, rest: voice.rest, err: voice.err, si: voice.si, bi: voice.bi, rate: voice.el ? voice.el.playbackRate : 0, src: voice.el ? voice.el.getAttribute("src") || "" : "", preload: voice.el ? voice.el.preload : "", beat: voice.bi >= 0 ? `${voice.si}-${voice.bi}` : "", at: Math.round(nowMs()), start: voice.start, end: voice.end, v: voice.v, fb: voice.fb })
  };
  if (typeof document !== "undefined" && document.addEventListener) {
    // iOS：<audio> 要在點下去那一下先 load 過，之後換 src 才能自己播
    document.addEventListener("click", (event) => {
      const t = event.target;
      if (!t || !t.closest || !t.closest("[data-cv2s-play]") || voice.el) return;
      voice.el = new Audio();
      voice.el.preload = "none";
      try { voice.el.load(); } catch (_e) { /* 舊瀏覽器 */ }
    }, true);
    window.addEventListener("resize", () => { if (dock) placeDock(); });
  }
})();
