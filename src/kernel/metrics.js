// ── 量測漏斗（index.html 的 data-lazy="metrics"）──
//
// 定義與 GA4 怎麼讀在 docs/metrics.md。這支只做三件事：
//   1. 每個事件補上共同欄位：subject_id、session_id（分頁內的隨機碼，存 sessionStorage，關掉分頁就沒了 ——
//      不是使用者 id），以及別名 difficulty ← rank、lesson_id ← lesson、section_id ← section。
//   2. 從既有的 problem_submit 推出漏斗那幾步：answer_submit（真的按了送出：不含逾時、跳過、「還沒學過」）、
//      answer_correct、second_question_complete（同一個 session 答完第二道不同的題）。
//      practice_open 就是 problem_start、lesson_section_complete 就是 course_section_complete —— 不重送，見 docs/metrics.md。
//   3. 本機的回訪訊號：第一次（開著分析）打開時在本機記「第一次見到的日期」；之後打開時
//      第 1 天送一次 return_d1、第 7–13 天第一次打開送一次 return_7d。日期只在本機，送出去的是「隔了幾天」。
//
// 隱私：app.js 只在分析開著時載這支（跟 gtag.js 同一道閘），所以關掉分析時它連檔都不抓、什麼都不寫。
// 送事件一律走 app.js 的 trackEvent（它再擋一次開關）。不送任何使用者輸入。
// 同一頁中途關掉分析：app.js 把 window.gtag 拿掉，這裡看到就不再記「已送過」（trackEvent 本來就不送）。
// 已經記在本機的日期不會離開裝置；設定頁的「清除資料」掃整個 buzzcalculus. 命名空間，會一起刪掉。
(function () {
  "use strict";

  const KEY = "buzzcalculus.metrics.v1"; // { first: "YYYY-MM-DD", legacy?: 1, d1?: 1, d7?: 1 }
  const SESSION_KEY = "buzzcalculus.metrics.session"; // sessionStorage：{ id, done: [題號], second?: 1 }
  const DAY = 24 * 60 * 60 * 1000;
  // 漏斗推出來的事件。app.js 的 ANALYTICS_EVENTS 在 start() 時併進這幾個（validate_analytics.js 兩張表一起掃）。
  const EVENTS = {
    landing_view: "開站（每次頁面載入一次；screen = 第一個畫面，visitor = new / returning）",
    answer_submit: "真的送出一題的答案（不含逾時、跳過、還沒學過；seq = 這個 session 第幾道不同的題）",
    answer_correct: "送出且判定答對（帶 seq 與距開站幾秒）",
    second_question_complete: "同一個 session 答完第二道不同的題（對錯都算；帶距開站幾秒）",
    return_d1: "第一次見到的隔天（本機日曆日差 = 1）打開，只送一次",
    return_7d: "第一次見到之後第 7–13 天第一次打開，只送一次（days_since_first = 7 就是嚴格的 D7）"
  };
  // 推出 answer_submit 的 reason：使用者按了送出（對或錯）。Timeout／Skipped／Unlearned 不算。
  const SUBMITTED = new Set(["Correct", "Wrong"]);

  let deps = null;
  let landedAt = Date.now();
  let memorySession = null;

  const read = (store, key) => {
    try { return JSON.parse(store.getItem(key) || "null"); } catch (_error) { return null; }
  };
  const write = (store, key, value) => {
    try { store.setItem(key, JSON.stringify(value)); } catch (_error) { /* 存不了就算了：量測不能擋住使用 */ }
  };
  const local = () => { try { return window.localStorage; } catch (_error) { return null; } };
  const sessionStore = () => { try { return window.sessionStorage; } catch (_error) { return null; } };

  // 本機日曆日（不是 UTC：台灣晚上十點跟隔天早上八點是兩天）
  function dayKey(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function daysBetween(fromKey, toKey) {
    const parse = (k) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(k || ""); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; };
    return Math.round((parse(toKey) - parse(fromKey)) / DAY);
  }

  function randomId() {
    try {
      const bytes = new Uint8Array(8);
      window.crypto.getRandomValues(bytes);
      return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (_error) {
      return Math.random().toString(16).slice(2, 18);
    }
  }

  function session() {
    const store = sessionStore();
    let s = store ? read(store, SESSION_KEY) : memorySession;
    if (s && typeof s.id === "string" && Array.isArray(s.done)) {
      memorySession = s;
      return s;
    }
    // 沒有（或存不了 sessionStorage）：在這個分頁裡沿用記憶體那一份，不要每個事件換一個
    s = memorySession || { id: randomId(), done: [] };
    saveSession(s);
    return s;
  }
  function saveSession(s) {
    memorySession = s;
    const store = sessionStore();
    if (store) write(store, SESSION_KEY, s);
  }

  // 每個事件都帶的欄位。既有欄位優先（params 蓋過這裡），所以只補缺的。
  function common(params) {
    const p = params || {};
    const out = { subject_id: "calculus", session_id: session().id };
    if (p.difficulty === undefined && p.rank !== undefined) out.difficulty = p.rank;
    if (p.lesson_id === undefined && p.lesson !== undefined) out.lesson_id = p.lesson;
    if (p.section_id === undefined && p.section !== undefined) out.section_id = p.section;
    return out;
  }

  const send = (name, params) => { if (deps && deps.track) deps.track(name, params); };
  const secsSinceLanding = () => Math.min(86400, Math.round((Date.now() - landedAt) / 1000));

  // 從既有事件推出漏斗那幾步。只在 trackEvent 真的送出之後被叫（分析開著）。
  function observe(name, params) {
    const p = params || {};
    if (name !== "problem_submit" || !SUBMITTED.has(p.reason)) return;
    const s = session();
    const id = String(p.problem_id || "");
    const fresh = id && !s.done.includes(id);
    if (fresh) s.done = s.done.concat(id).slice(-50);
    const seq = fresh ? s.done.length : Math.max(1, s.done.indexOf(id) + 1);
    const base = { problem_id: id, difficulty: p.rank, mode: p.mode, seq };
    send("answer_submit", { ...base, correct: Boolean(p.correct) });
    if (p.correct) send("answer_correct", { ...base, secs_since_landing: secsSinceLanding() });
    if (fresh && s.done.length >= 2 && !s.second) {
      s.second = 1;
      send("second_question_complete", { problem_id: id, difficulty: p.rank, mode: p.mode, secs_since_landing: secsSinceLanding() });
    }
    saveSession(s);
  }

  // 有沒有用過（這支上線以前就在用的人）：他們不是新 cohort，不送 return_d1／return_7d
  function usedBefore() {
    try {
      const r = (deps && deps.records && deps.records()) || {};
      return Boolean(r.lastPlayed || Number(r.totalAnswered) > 0 || (Array.isArray(r.history) && r.history.length) || r.placement || (r.courseV2 && Object.keys(r.courseV2).length));
    } catch (_error) {
      return false;
    }
  }

  // 第一次見到的日期；回傳這一次是不是新訪客
  function firstSeen() {
    const store = local();
    if (!store) return { state: null, isNew: false };
    let state = read(store, KEY);
    if (state && typeof state.first === "string") return { state, isNew: false };
    state = { first: dayKey() };
    const legacy = usedBefore();
    if (legacy) state.legacy = 1;
    write(store, KEY, state);
    return { state, isNew: !legacy };
  }

  // 第 1 天 → return_d1；第 7–13 天第一次打開 → return_7d。各只送一次。
  function checkReturn() {
    const store = local();
    const state = store && read(store, KEY);
    if (!state || state.legacy || typeof state.first !== "string" || typeof window.gtag !== "function") return;
    const days = daysBetween(state.first, dayKey());
    if (!(days >= 1)) return;
    if (days === 1 && !state.d1) {
      state.d1 = 1;
      write(store, KEY, state);
      send("return_d1", { days_since_first: days });
    }
    if (days >= 7 && days <= 13 && !state.d7) {
      state.d7 = 1;
      write(store, KEY, state);
      send("return_7d", { days_since_first: days });
    }
  }

  // app.js 的 setupAnalytics 在分析開著時載這支、叫一次 start
  function start(options) {
    if (deps) return;
    deps = options || {};
    if (deps.events) Object.assign(deps.events, EVENTS);
    if (typeof performance !== "undefined" && performance.timeOrigin) landedAt = Math.round(performance.timeOrigin);
    const { isNew } = firstSeen();
    const screen = deps.view ? String(deps.view() || "") : "";
    send("landing_view", { screen, visitor: isNew ? "new" : "returning" });
    checkReturn();
    // 主畫面的 app 可以在背景活好幾天：回到前景時也檢查一次（同一天不會重送）
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkReturn(); });
    }
  }

  window.BuzzMetrics = { start, common, observe, EVENTS, dayKey, daysBetween };
})();
