// ── 更新與版本（index.html 的 data-lazy="pwa"：app.js 在頁面載完、閒下來時載，進 APP_SHELL，離線也有）──
//
// 為什麼「加到主畫面的 app 不會更新」（2026-10 查到的）：
//   1. sw.js 的快取名是手寫的，好幾次部署都沒改 → 新的 Service Worker 打開同名快取、以為每支都在、一支都沒重抓。
//      按了「更新」拿到的還是舊檔。（修在 sw.js 的 carry／fetch 與 tools/build_sw_revisions.js 的 BUILD.id。）
//   2. 瀏覽器只在「導覽」時檢查 sw.js。主畫面的 app 從背景叫回來不是導覽 —— iOS 上可以好幾天不檢查。
//      → 回到前景、拿回焦點、從 bfcache 回來時呼叫 registration.update()（最多 15 分鐘一次），開著的時候每小時一次。
//   3. 註冊在 load 之後、閒下來才做；瀏覽器在那之前就發現新版的話 updatefound 已經過了，「有新版本」永遠不出現。
//      → 註冊完也看 registration.installing。
//   4. 按過「稍後」記在 sessionStorage：主畫面的 app 一個 session 可以活好幾天 → 等於再也不提醒。
//      → 「稍後」只到下次回到前景；設定頁的版本列一直看得到「有新版本」。
//
// 什麼時候自動換新版（不用按）：剛開站、或離開超過 10 分鐘再回來的頭 30 秒內，使用者還沒點任何東西、
// 而且 busy() 是 false（沒在作答／考卷／出題／寫證明／讀課、沒有沒存進去的紀錄）。其他時候只顯示「有新版本」，
// 作答中連橫幅都不出（app.js 的 answering()）。模擬考考到一半絕不重新載入。
//
// 版本：每一版的 sw.js 有自己的 BUILD（版本、內容雜湊、建置日期）。正在跑的那一版問 controller，
// 等著的新版問 registration.waiting（postMessage＋MessageChannel）。沒有 Service Worker 時退回 app.js 的 APP_VERSION／BUILD_DATE。
(function () {
  "use strict";

  const MINUTE = 60 * 1000;
  // E2E 可以調（tools/e2e_update.js）：不然要等 15 分鐘
  const tune = { checkGap: 15 * MINUTE, resumeGap: 10 * MINUTE, autoWindow: 30 * 1000, hourly: 60 * MINUTE };
  const t = (s, v) => (window.t ? window.t(s, v) : s);

  let api = null;
  let reg = null;
  let running = null; // 這一頁跑的那一版的 BUILD
  let next = null; // 等著的新版的 BUILD
  let pending = false; // 有一個裝好在等的新版
  let accepted = false; // 使用者（或自動）同意換新版 → controllerchange 時 reload
  let dismissed = false; // 按了「稍後」：到下次回到前景為止不出橫幅
  let status = ""; // 設定頁「檢查更新」的結果：checking / latest / downloading / ready / offline
  let lastCheck = Date.now(); // 開站那一次導覽瀏覽器已經檢查過
  let hiddenAt = 0;
  let windowStart = Date.now(); // 自動換新版的時間窗：開站、或離開夠久回來
  let interacted = false;

  const sw = () => (window.navigator && window.navigator.serviceWorker) || null;
  const busy = () => Boolean(api && api.busy && api.busy());
  const label = (b) => (b ? `${b.version}${b.id ? ` · ${b.id}` : ""} · ${b.date}` : "");

  function ask(worker) {
    return new Promise((resolve) => {
      if (!worker || typeof MessageChannel === "undefined") { resolve(null); return; }
      const channel = new MessageChannel();
      const timer = setTimeout(() => resolve(null), 3000);
      channel.port1.onmessage = (event) => { clearTimeout(timer); resolve((event.data && event.data.build) || null); };
      try { worker.postMessage({ type: "VERSION" }, [channel.port2]); } catch (_error) { clearTimeout(timer); resolve(null); }
    });
  }

  function redraw() { if (api && api.render) api.render(); }

  async function markReady() {
    if (!reg || !reg.waiting) return;
    const fresh = !pending;
    pending = true;
    if (fresh) dismissed = false;
    if (status === "checking" || status === "downloading" || status === "latest") status = "ready";
    next = (await ask(reg.waiting)) || next;
    if (maybeAuto()) return;
    redraw();
  }

  function watch(worker) {
    if (!worker) return;
    if (status === "checking" || status === "latest") { status = "downloading"; redraw(); }
    worker.addEventListener("statechange", () => {
      // controller 存在代表這是「更新」而不是第一次安裝
      if (worker.state === "installed" && sw() && sw().controller) markReady();
      if (worker.state === "redundant" && status === "downloading") { status = "offline"; redraw(); }
    });
  }

  // 自動換：時間窗內、沒動過、沒在忙
  function maybeAuto() {
    if (!pending || accepted || interacted || busy()) return false;
    if (Date.now() - windowStart > tune.autoWindow) return false;
    apply(true);
    return true;
  }

  function apply(auto) {
    if (!reg || !reg.waiting) { if (accepted) window.location.reload(); return; }
    accepted = true;
    if (api && api.track) api.track("app_update_apply", {});
    if (auto) document.documentElement.setAttribute("data-auto-update", "1");
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    // 萬一 controllerchange 沒來（新版其實已經接手了）：3 秒後自己重新載入
    setTimeout(() => window.location.reload(), 3000);
  }

  function check(force) {
    if (!reg) return Promise.resolve();
    if (!force && Date.now() - lastCheck < tune.checkGap) return Promise.resolve();
    if (!force && window.navigator.onLine === false) return Promise.resolve();
    lastCheck = Date.now();
    return Promise.resolve(reg.update()).then(() => {
      if (reg.installing) watch(reg.installing);
      else if (reg.waiting) markReady();
    });
  }

  function manualCheck() {
    if (!reg) return;
    if (reg.waiting) { markReady(); return; }
    status = "checking";
    redraw();
    check(true).then(() => {
      if (status === "checking") status = reg.waiting ? "ready" : "latest";
      redraw();
    }, () => { status = "offline"; redraw(); });
  }

  function resumed() {
    const away = hiddenAt ? Date.now() - hiddenAt : 0;
    hiddenAt = 0;
    dismissed = false;
    if (away >= tune.resumeGap) { windowStart = Date.now(); interacted = false; }
    if (pending && maybeAuto()) return;
    check(away >= tune.resumeGap).catch(() => {});
  }

  function listen() {
    const s = sw();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") hiddenAt = Date.now();
      else resumed();
    });
    window.addEventListener("pageshow", (event) => { if (event.persisted) resumed(); });
    window.addEventListener("focus", () => check(false).catch(() => {}));
    setInterval(() => { if (document.visibilityState === "visible") check(false).catch(() => {}); }, tune.hourly);
    ["pointerdown", "keydown"].forEach((type) => document.addEventListener(type, () => { interacted = true; }, true));
    document.addEventListener("click", (event) => {
      const target = event.target && /** @type {Element} */ (event.target).closest ? /** @type {Element} */ (event.target).closest("[data-action]") : null;
      const action = target ? target.getAttribute("data-action") : "";
      if (action === "apply-update") apply(false);
      if (action === "dismiss-update") { dismissed = true; redraw(); }
      if (action === "check-update") manualCheck();
    });
    // 換手之後才重新載入，這樣拿到的一定是新版。別的分頁換了新版：沒在忙就跟著換，在忙就等使用者按
    // 第一次安裝的 clients.claim() 也會觸發 controllerchange（從沒有到有）：那一次不算
    let reloading = false;
    let hadController = Boolean(s.controller);
    s.addEventListener("controllerchange", () => {
      if (!hadController) {
        hadController = true;
        ask(s.controller).then((build) => { if (build && !running) { running = build; redraw(); } });
        return;
      }
      if (reloading) return;
      if (!accepted && busy()) { pending = true; accepted = true; redraw(); return; }
      reloading = true;
      window.location.reload();
    });
  }

  // 版本列的樣式跟著這支檔（styles.css 的預算已經滿了）
  const STYLE = `
.app-version { margin: 6px 0 0; color: var(--ink); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.app-version p { margin: 0 0 6px; overflow-wrap: anywhere; }
.app-version span { color: var(--muted); }
.app-version-next { color: var(--brand); font-weight: 700; }
.app-version-status { color: var(--muted); }
.app-version .action-row { margin-top: 6px; }
`;

  function init(deps) {
    api = deps;
    if (document.head && !document.getElementById("app-update-style")) {
      const style = document.createElement("style");
      style.id = "app-update-style";
      style.textContent = STYLE;
      document.head.appendChild(style);
    }
    redraw();
    const s = sw();
    if (!s) return;
    listen();
    // updateViaCache: "none"：sw.js 本身永遠不走 HTTP 快取（vercel.json 也是 max-age=0）
    s.register("./sw.js", { updateViaCache: "none" }).then(async (registration) => {
      if (!registration) return;
      reg = registration;
      running = (await ask(s.controller || registration.active)) || running;
      redraw();
      // 已經有一個裝好在等的版本（上次沒按更新就關掉）→ 剛開站、還沒動、沒在忙的話直接換
      if (registration.waiting) markReady();
      // 瀏覽器在我們註冊之前就開始裝新版了（updatefound 已經過去）
      if (registration.installing && s.controller) watch(registration.installing);
      registration.addEventListener("updatefound", () => watch(registration.installing));
    }).catch(() => {});
  }

  function banner() {
    if (!pending || dismissed || (api && api.answering && api.answering())) return "";
    return `
      <div class="update-banner" role="status" aria-live="polite" data-update-banner>
        <span>${next ? t("有新版本 {v} 可以用了。", { v: next.version }) : t("有新版本可以用了。")}</span>
        <button class="button secondary" data-action="apply-update">${api.icon("refresh")}${t("重新載入更新")}</button>
        <button class="icon-button" data-action="dismiss-update" title="${t("稍後再說")}" aria-label="${t("稍後再說")}">${api.icon("x")}</button>
      </div>
    `;
  }

  // 設定頁「關於」卡裡的版本列
  function panel() {
    const now = running || (api ? { version: api.version, id: "", date: api.date } : null);
    const lines = { checking: t("正在檢查…"), latest: t("已經是最新版。"), downloading: t("找到新版本，下載中…"), offline: t("現在連不上，稍後再試。"), ready: "" };
    const note = pending
      ? `<p class="app-version-next" data-update-next>${t("有新版本 {v}", { v: next ? label(next) : "" })}</p>`
      : status && lines[status] ? `<p class="app-version-status" role="status" data-update-status="${status}">${lines[status]}</p>` : "";
    const action = pending
      ? `<button class="button secondary" data-action="apply-update">${api.icon("refresh")}${t("重新載入更新")}</button>`
      : reg ? `<button class="button ghost" data-action="check-update" ${status === "checking" ? "disabled" : ""}>${api.icon("refresh")}${t("檢查更新")}</button>` : "";
    return `
      <div class="app-version" data-app-version>
        <p><span>${pending ? t("目前") : t("版本")}</span> <strong data-version-running>${label(now)}</strong></p>
        ${note}
        ${action ? `<div class="action-row">${action}</div>` : ""}
      </div>
    `;
  }

  function state() {
    return { registered: Boolean(reg), running, next, pending, accepted, status, dismissed };
  }

  window.BuzzAppUpdate = { init, banner, panel, state, tune };
})();
