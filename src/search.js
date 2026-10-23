// ── 全站搜尋（Ctrl+K／⌘K／「/」、側欄的搜尋；data-lazy="search"，跟 search_index.js 同一組，打開才抓）──
// 一個框同時搜：課（課號、課名）、課文（每一節的標題與黑板上寫的中文 —— 點了開到那一課那一節）、證明題、功能（錯題本、設定…）。
// 最後一列「在題庫搜」把字帶到題庫的搜尋框。結果用 ↑↓ 選、Enter 開、Esc 關。
// 點了做什麼：在 #app 裡塞一顆帶 data-action 的按鈕點下去（跟 app.js 其他按鈕走同一條路）。
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // 功能：字面（中文、英文、常見的說法）都收
  const FEATURES = [
    ["今天", "首頁 home today 今日", { action: "home" }],
    ["課程表", "課程 course lessons 課表", { action: "open-course" }],
    ["訓練", "練習 train practice 自訂", { action: "open-train" }],
    ["數據", "統計 insights 進度 雷達", { action: "open-insights" }],
    ["題庫", "library problems 找題", { action: "open-library" }],
    ["設定", "settings 偏好 備份 匯出 匯入 資料 語言", { action: "open-settings" }],
    ["錯題本", "mistakes 錯題 複習", { action: "open-mistakes" }],
    ["練習紀錄", "history 紀錄", { action: "open-history" }],
    ["證明訓練", "proof 證明 梯子", { action: "open-proofs" }],
    ["今日函數", "funcle wordle 猜函數 遊戲", { action: "open-funcle" }],
    ["每日一題", "daily one 每日", { action: "start-daily-one" }],
    ["考前一張紙", "cheat sheet 小抄 重點 列印 pdf", { action: "course-keys-sheet" }],
    ["翻牌卡", "flashcards 字卡 公式 記憶 背 複習 anki", { action: "course-keys-flash" }],
    ["切換深色／亮色", "dark light theme 深色 主題 夜間", { action: "toggle-theme" }]
  ];
  const unlocked = () => { try { return localStorage.getItem("buzzcalculus.unlock.v1") === "1"; } catch (_e) { return false; } };
  // 同一個東西的不同寫法：課名多用原文（L'Hôpital、Taylor），學生常打中文音譯
  const ALIAS = [
    ["羅必達", "洛必達", "l'hôpital", "l'hopital", "lhopital"], ["泰勒", "taylor"], ["馬克勞林", "麥克勞林", "maclaurin"], ["柯西", "cauchy"],
    ["黎曼", "riemann"], ["勒貝格", "lebesgue"], ["羅爾", "rolle"], ["均值定理", "平均值定理", "mvt"], ["中間值定理", "ivt"],
    ["格林", "green"], ["史托克", "斯托克斯", "stokes"], ["高斯", "gauss"], ["傅立葉", "fourier"], ["伽瑪", "gamma"], ["貝塔", "beta"],
    ["瓦里斯", "wallis"], ["斯特林", "stirling"], ["費曼", "feynman"], ["弗魯拉尼", "frullani"], ["拉格朗日", "lagrange"], ["雅可比", "jacobian"],
    ["分部積分", "ibp"], ["變數變換", "換元", "u-sub"], ["夾擠", "squeeze"], ["數學歸納", "歸納", "induction"]
  ];
  const variants = (k) => { const hit = ALIAS.find((g) => g.some((w) => w.toLowerCase() === k)); return hit ? hit.map((w) => w.toLowerCase()) : [k]; };

  function search(q) {
    const S = window.BUZZ_SEARCH || { lessons: [], secs: [], proofs: [] };
    const k = q.trim().toLowerCase();
    const open = unlocked();
    const L = S.lessons;
    const visible = (li) => open || !L[li][3];
    const ks = variants(k);
    const has = (s) => { const v = String(s || "").toLowerCase(); return ks.some((w) => v.includes(w)); };
    const where = (s) => { const v = String(s || "").toLowerCase(); for (const w of ks) { const i = v.indexOf(w); if (i >= 0) return [i, w.length]; } return [-1, 0]; };
    if (!k) return { lessons: [], secs: [], proofs: [], features: FEATURES.slice(0, 8) };
    const lessons = L.map((l, li) => ({ l, li })).filter(({ l, li }) => visible(li) && (has(l[2]) || l[1] === k || has(l[0]))).slice(0, 8);
    const secs = [];
    S.secs.forEach(([li, si, title, text]) => {
      if (!visible(li)) return;
      const inTitle = has(title);
      const [at, len] = where(text);
      if (!inTitle && at < 0) return;
      // 摘錄：關鍵字前後各一段（｜分開的是板上不同行）
      const from = Math.max(0, at - 16);
      const snip = at < 0 ? String(text).slice(0, 40) : `${from ? "…" : ""}${String(text).slice(from, at + len + 24)}…`;
      secs.push({ li, si, title, snip, score: inTitle ? 2 : 1 });
    });
    secs.sort((a, b) => b.score - a.score);
    const proofs = S.proofs.filter((p) => has(p[1])).slice(0, 6);
    const features = FEATURES.filter(([label, words]) => has(label) || has(words)).slice(0, 5);
    return { lessons, secs: secs.slice(0, 14), proofs, features, total: secs.length };
  }

  const CSS = `.sr-ov{position:fixed;inset:0;z-index:90;display:grid;justify-items:center;align-content:start;padding:8vh 12px 12px;background:rgb(0 0 0/.32)}
.sr-box{display:grid;grid-template-rows:auto 1fr;width:min(680px,100%);max-height:80vh;border:1px solid var(--line);border-radius:14px;background:var(--panel);box-shadow:0 18px 50px rgb(0 0 0/.25);overflow:hidden}
.sr-in{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line)}
.sr-in input{flex:1;min-width:0;min-height:40px;border:0;background:none;color:var(--ink);font:inherit;font-size:1.05rem;outline:none}
.sr-in kbd{padding:1px 6px;border:1px solid var(--line);border-radius:5px;color:var(--muted);font-size:.75rem}
.sr-list{overflow-y:auto;padding:6px 0 10px}
.sr-group{margin:8px 16px 4px;color:var(--muted);font-size:.76rem;font-weight:700}
.sr-item{display:grid;gap:2px;width:100%;padding:8px 16px;border:0;background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.sr-item small{color:var(--muted);font-size:.8rem;line-height:1.5;overflow-wrap:anywhere}
.sr-item.is-on,.sr-item:hover{background:var(--brand-soft)}
.sr-item mark{background:color-mix(in srgb,var(--gold) 35%,transparent);color:inherit;border-radius:3px}
.sr-empty{margin:18px 16px;color:var(--muted);font-size:.9rem}
@media (max-width:640px){.sr-ov{padding-top:12px}.sr-box{max-height:88vh}}`;

  let ov = null;
  function close() { if (ov) { ov.remove(); ov = null; document.removeEventListener("keydown", onKey, true); } }
  function onKey(e) {
    if (!ov) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    const items = [...ov.querySelectorAll(".sr-item")];
    if (!items.length) return;
    let i = items.findIndex((n) => n.classList.contains("is-on"));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      i = e.key === "ArrowDown" ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      items.forEach((n, j) => n.classList.toggle("is-on", j === i));
      items[i].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); (items[i] || items[0]).click(); }
  }
  // 點了：在 #app 塞一顆按鈕點下去（app.js 的事件委派接）
  function go(data) {
    close();
    const app = document.querySelector("#app");
    if (!app) return;
    const b = document.createElement("button");
    b.type = "button";
    b.hidden = true;
    Object.entries(data).forEach(([key, v]) => { b.dataset[key] = v; });
    app.appendChild(b);
    b.click();
    b.remove();
  }
  function mark(text, q) {
    const s = String(text);
    const low = s.toLowerCase();
    const k = q.trim().toLowerCase();
    let at = -1; let len = 0;
    if (k) for (const w of variants(k)) { const i = low.indexOf(w); if (i >= 0) { at = i; len = w.length; break; } }
    return at < 0 ? esc(s) : `${esc(s.slice(0, at))}<mark>${esc(s.slice(at, at + len))}</mark>${esc(s.slice(at + len))}`;
  }
  function paint(q) {
    const list = ov.querySelector(".sr-list");
    const r = search(q);
    const L = (window.BUZZ_SEARCH || { lessons: [] }).lessons;
    const item = (data, title, note) => `<button type="button" class="sr-item" data-go='${esc(JSON.stringify(data))}'><span>${title}</span>${note ? `<small>${note}</small>` : ""}</button>`;
    const groups = [];
    if (r.lessons.length) groups.push(`<p class="sr-group">課</p>${r.lessons.map(({ l }) => item({ action: "open-course-lesson", lessonId: l[0] }, `${esc(l[1])} ${mark(l[2], q)}`, "")).join("")}`);
    if (r.secs.length) groups.push(`<p class="sr-group">課文${r.total > r.secs.length ? `（前 ${r.secs.length} 筆，共 ${r.total} 筆）` : ""}</p>${r.secs.map((s) => item({ action: "open-course-lesson", lessonId: L[s.li][0], section: String(s.si) }, `${esc(L[s.li][1])} ${esc(L[s.li][2])} · 第 ${s.si + 1} 節 ${mark(s.title, q)}`, mark(s.snip, q))).join("")}`);
    if (r.proofs.length) groups.push(`<p class="sr-group">證明題</p>${r.proofs.map((p) => item({ action: "open-proof-problem", proofKey: p[0] }, mark(p[1], q), "")).join("")}`);
    if (r.features.length) groups.push(`<p class="sr-group">${q.trim() ? "功能" : "常用"}</p>${r.features.map(([label, , data]) => item(data, mark(label, q), "")).join("")}`);
    if (q.trim()) groups.push(`<p class="sr-group">題庫</p>${item({ action: "open-library-search", q: q.trim() }, `在題庫搜「${esc(q.trim())}」`, "題目、解說、題號")}`);
    list.innerHTML = groups.join("") || `<p class="sr-empty">找不到「${esc(q)}」。</p>`;
    const first = list.querySelector(".sr-item");
    if (first) first.classList.add("is-on");
  }
  function open() {
    if (ov) { ov.querySelector("input").focus(); return; }
    if (!document.getElementById("sr-style")) { const st = document.createElement("style"); st.id = "sr-style"; st.textContent = CSS; document.head.appendChild(st); }
    ov = document.createElement("div");
    ov.className = "sr-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "搜尋");
    ov.innerHTML = `<div class="sr-box"><div class="sr-in"><input type="search" placeholder="搜課、課文、證明題、功能…（例：夾擠、羅必達、錯題本）" aria-label="搜尋" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div><div class="sr-list" role="listbox"></div></div>`;
    document.body.appendChild(ov);
    const input = ov.querySelector("input");
    let t = 0;
    input.addEventListener("input", () => { window.clearTimeout(t); t = window.setTimeout(() => paint(input.value), 90); });
    ov.addEventListener("click", (e) => {
      if (e.target === ov) { close(); return; }
      const b = e.target.closest && e.target.closest("[data-go]");
      if (b) go(JSON.parse(b.dataset.go));
    });
    document.addEventListener("keydown", onKey, true);
    paint("");
    input.focus();
  }

  window.BuzzSearch = { open, close, search };
})();
