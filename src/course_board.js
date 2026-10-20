// 分節的黑板 v2（beat.board；規格見 SCHEMA.md「黑板」，樣式見 docs/board-style.md）。data-lazy="board"：有黑板的課才抓。
// 一節整個先排好（course_board_layout.js：每一步之後每一項在哪、標籤放哪、箭頭怎麼彎、板多高），畫面只是把「時間 → 第幾步、進度多少」畫出來：
//   旁白開著：時間 = <audio>.currentTime（暫停、1.25×／1.5×、拖、卡住都自動對）；動作的起點是 say 裡某個詞被念到的那一刻（on）。
//   沒旁白：同一張時間表跑在虛擬時間上（照 say 的字數）；下一句 = 這一句畫完；reduced-motion 直接到位。
// 每一格只寫 transform／opacity／mask／stroke-dashoffset；量位置只在排版（換節、換寬度、字型載完）時。
(function () {
  "use strict";
  const LY = window.BuzzBoardLayout;
  // 粉筆灰／紙的顆粒：一張很淡的灰色雜訊，兩個主題共用（不要更明顯：再多就變成髒）
  const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  // 2026-10-18 真的黑板：淺色、深色主題都是一塊墨綠的板、粉筆色的字（白、黃、藍、粉紅、綠、紫），木框，底下一條放粉筆的溝。
  // 板面：雜訊（粉筆灰）＋左上亮右下暗的漸層＋幾道淡淡的擦拭痕。字有一點粉筆的暈（text-shadow），記號的線有一點毛邊（SVG filter）。
  const CSS = `.cvb-slot{position:relative;margin:0 0 22px;padding-bottom:12px}
.cvb-slot:has(.cvb)::after{content:"";position:absolute;left:4%;right:4%;bottom:0;height:10px;border-radius:0 0 6px 6px;background:linear-gradient(90deg,transparent 18%,#f4f1e6 18%,#f4f1e6 23%,transparent 23%,transparent 27%,#f3d36b 27%,#f3d36b 30.5%,transparent 30.5%) 0 2px/100% 4px no-repeat,linear-gradient(180deg,#8a5f37,#5e3e22);box-shadow:0 2px 3px #0000002e;pointer-events:none}
.cvb{--k:#eef1e8;--kb:#1f3a2f;--kl:#6b4a2b;--kg:#f5d56e;--kc:#a6d4f7;--kn:#b6efc2;--kr:#ffa59a;--kv:#d9bcff;position:relative;overflow:hidden;min-height:72px;border:7px solid #6e4a2a;border-radius:10px;background:${NOISE},linear-gradient(115deg,transparent 30%,#ffffff07 38%,transparent 46%),linear-gradient(160deg,transparent 55%,#ffffff05 62%,transparent 70%),radial-gradient(130% 100% at 25% 0%,#2a4a3c,var(--kb) 70%,#18302500);background-color:var(--kb);box-shadow:inset 0 0 0 1px #00000059,inset 0 2px 14px #0000004d,0 1px 0 #4b311b;color:var(--k);cursor:pointer;-webkit-tap-highlight-color:transparent;contain:layout paint}
:root[data-theme="dark"] .cvb{--kb:#1a3127;border-color:#5a3c22;box-shadow:inset 0 0 0 1px #00000073,inset 0 2px 16px #00000066,0 1px 0 #3b2715}
.cvb-chalk{position:absolute;left:0;top:0;width:20px;height:7px;margin:-6px 0 0 -1px;border-radius:2px 4px 4px 2px;background:linear-gradient(180deg,#ffffff,#dcdad0);box-shadow:0 1px 2px #00000080;transform-origin:0 50%;pointer-events:none;opacity:0;transition:opacity .18s}`;
  const CSS_REST = `
.cvb-c{position:absolute;inset:0}
.cvb.is-tall{overflow-y:auto;overscroll-behavior:contain}.cvb.is-tall .cvb-c{bottom:auto}
.cvb-i{position:absolute;left:0;top:0;display:inline-block;padding:8px;white-space:nowrap;line-height:1.3;transform-origin:0 0;will-change:transform,opacity}
.cvb-i.is-t{text-align:center}
.cvb-r{white-space:nowrap}.cvb-r+.cvb-r{margin-top:.3em}
.cvb-u{display:inline-block;white-space:nowrap}.cvb-u.is-rel{padding-left:.2778em}
.cvb .katex{font-size:1em;line-height:1.3}
.cvb-x,.cvb-s{white-space:pre;font-size:.95em;letter-spacing:.01em}.cvb-cm{margin-left:.25em;padding-right:.45em}
.cvb-lab{position:absolute;left:0;top:0;font-size:13.5px;font-weight:650;line-height:1.3;letter-spacing:.02em;white-space:nowrap;opacity:0}
.cvb-ink{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.cvb-ink path{fill:none;stroke:currentColor;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
.cvb-f{position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap;line-height:1.3}
.cvb .kg{color:var(--kg)}.cvb .kr{color:var(--kr)}.cvb .kc{color:var(--kc)}.cvb .kn{color:var(--kn)}.cvb .kv{color:var(--kv)}
.cvb-p{--panel:var(--kb);--paper:var(--kb);--line:#ffffff1a;--line-strong:#eceee680;--muted:#b9c3bc;--ink:var(--k);--blue:var(--kc);--red:var(--kr);--green:var(--kn);--gold:var(--kg);--violet:var(--kv)}
:root[data-theme="dark"] .cvb-p{--line:#ffffff1a;--line-strong:#eceee680;--muted:#b9c3bc}
.cvb-p .problem-graph{margin:0;padding:0;border:0;background:none;box-shadow:none;width:100%;height:100%}.cvb-p svg,.cvb .cvb-p .problem-graph svg{display:block;width:100%;height:100%;border:0;border-radius:0;background:none}
.cvb-sr{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cv2s-beat.cvb-bare{height:0;padding:0;border:0;margin-bottom:-10px;overflow:hidden}
.cvb-sec .cv2s-beat:not(.is-now){display:none}
.cvb-opt{cursor:default;border-radius:10px}.cvb-opt[data-action]{cursor:pointer}.cvb-opt[data-action]:hover{background:#ffffff12}
.cvb-no{color:var(--kr)}.cvb-no::after{content:"";position:absolute;left:4px;right:4px;top:52%;height:2.5px;border-radius:2px;background:var(--kr);transform:rotate(-2.5deg)}
.cvb-yes{color:var(--kn)}.cvb-yes::before{content:"";position:absolute;inset:0 -6px;border:2.5px solid var(--kn);border-radius:50%;transform:rotate(-1.5deg);pointer-events:none}
.cvb-onboard .course-check-ask,.cvb-onboard .course-check-options{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cvb-onboard .cvb-hint{margin:0;color:var(--muted);font-size:.9rem}
.cvb-stage{position:relative}
.cvb-whole .cv2s-beats,.cvb-whole .cv2s-bar,.cvb-whole .cv2s-cue{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cvb-stage>.cvb-onboard{position:absolute;z-index:3;left:14px;right:14px;bottom:12px;margin:0;pointer-events:none}
.cvb-stage>.cvb-onboard .course-check-why{margin:0;padding:6px 10px;border-radius:8px;background:color-mix(in srgb,var(--paper) 90%,transparent);box-shadow:0 2px 8px #0003;font-size:.92rem}
.cvb-stage>.cvb-onboard .course-check-why:not(:last-child){margin-bottom:6px}
.cvb-next{position:absolute;z-index:3;right:16px;bottom:12px;margin:0;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--paper) 88%,transparent);color:var(--ink);font-size:.85rem;font-weight:700;pointer-events:none;animation:cvb-next 1.6s ease-in-out infinite alternate}
.cvb-stage>.cvb-onboard~.cvb-next{bottom:auto;top:12px}
@keyframes cvb-next{from{opacity:.55}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.cvb-next{animation:none}}
.cvb-model{position:absolute;z-index:2;left:var(--mx,0);top:var(--my,0);width:var(--mw,0);height:var(--mh,0);display:grid;place-items:center;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin}
.cvb-model>.cv2-figure{width:100%;max-width:none;margin:auto 0;padding:10px 12px 8px;border-radius:8px;background:var(--panel);box-shadow:0 3px 12px #00000059,0 0 0 1px #0000001f}
.cvb-model>.cv2-figure+.cv2-figure{margin-top:10px}
.cvb-model .cv2-figure svg{max-height:calc(var(--mh,300px) - 90px)}
@media (max-width:599px){.cvb-model>.cv2-figure{padding:6px 8px}.cvb-model .cv2-figure svg{max-height:calc(var(--mh,300px) - 110px)}.cvb-model .cv2-figure figcaption{display:none}}
@media (min-width:1100px){.cvb-whole .cvb-stage{--bw:min(1120px,calc(100vw - var(--sidebar-width,0px) - 80px));width:var(--bw);margin-left:calc((100% - var(--bw))/2)}}
.cvb-ov{position:fixed;inset:0;z-index:80;overflow-y:auto;overscroll-behavior:contain;background:color-mix(in srgb,var(--paper) 94%,#000);padding:0 12px 32px}
.cvb-ov-bar{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:2140px;margin:0 auto;padding:12px 4px;background:inherit}
.cvb-ov-bar b{font-size:1rem}
.cvb-ov-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;max-width:2140px;margin:0 auto}
.cvb-ov-page{position:relative;overflow:hidden;border-radius:10px;box-shadow:0 4px 18px #0004}
.cvb-ov-board{overflow:hidden!important;pointer-events:none}
.cvb-ov-n{position:absolute;right:10px;bottom:6px;color:#fff9;font-size:.75rem;font-variant-numeric:tabular-nums}
.cvb-ov-meas{position:absolute;left:0;top:0;visibility:hidden;pointer-events:none}
html.nb .cv2s.cv2-lesson.is-nb{position:fixed;z-index:5;max-width:none;width:auto;margin:0;padding:18px 24px 0;overflow:hidden;background:var(--paper)}
@media (max-width:640px){html.nb .cv2s.cv2-lesson.is-nb{padding:12px 10px 0}}
html.nb .cvb{--k:#1f2a44;--kb:#fdfbf4;--nbm:#efa3a3;--nbg:#dfe7f3;--kg:#c2410c;--kc:#1d4ed8;--kn:#15803d;--kr:#dc2626;--kv:#7c3aed;border:0;border-radius:6px;background:var(--kb);box-shadow:0 0 0 1px #0000000f,0 4px 18px #00000017;text-shadow:none}
html.nb .cvb-whole .cvb-stage{margin-top:14px}
html.nb .cvb-c{background:linear-gradient(90deg,transparent 12px,var(--nbm) 12px,var(--nbm) 14px,transparent 14px),linear-gradient(90deg,var(--nbg) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(180deg,var(--nbg) 1px,transparent 1px) 0 0/24px 24px}
:root[data-theme="dark"].nb .cvb{--k:#dfe6f5;--kb:#1d2026;--nbm:#7f3b3b;--nbg:#2a303b;--kg:#fdba74;--kc:#93c5fd;--kn:#86efac;--kr:#fca5a5;--kv:#c4b5fd}
@supports not selector(::-webkit-scrollbar){.cvb.is-tall{scrollbar-width:thin;scrollbar-color:#ffffff40 transparent}html.nb .cvb.is-tall{scrollbar-color:#9fb0c8 transparent}}.cvb.is-tall::-webkit-scrollbar{width:8px}.cvb.is-tall::-webkit-scrollbar-track{background:transparent}.cvb.is-tall::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:8px;background:#ffffff40 padding-box}.cvb.is-tall::-webkit-scrollbar-thumb:hover{background:#ffffff70 padding-box}.cvb.is-tall::-webkit-scrollbar-button{display:none;height:0}
html.nb .cvb.is-tall::-webkit-scrollbar-thumb{background:#b7c4d8 padding-box}html.nb .cvb.is-tall::-webkit-scrollbar-thumb:hover{background:#8ea2bf padding-box}
:root[data-theme="dark"].nb .cvb.is-tall::-webkit-scrollbar-thumb{background:#4a5568 padding-box}
html.nb .cvb .cvb-i{text-shadow:none;filter:none}
html.nb .cvb-slot{margin:0;padding:0}
html.nb .cvb-slot::after{display:none}
html.nb .cvb-whole .cvb-stage{width:auto;margin-left:0}
html.nb .cvb-chalk{width:22px;height:4px;margin:-3px 0 0 -2px;border-radius:1px 3px 3px 1px;background:linear-gradient(90deg,#1f2a44 0,#1f2a44 70%,#c9ced8 70%);box-shadow:0 1px 1px #0003}
html.nb .cvb-model>.cv2-figure{box-shadow:0 1px 4px #0002}
`;
  // 原型（2026-10-20）：筆記本版 —— 同一個黑板引擎（一行一行寫、分欄、換面），換成紙、橫線、紅色邊線、藍黑筆。
  // ?notebook 打開、?notebook=0 關掉，記在這台瀏覽器
  try {
    const q = /[?&]notebook(?:=(\w+))?/.exec(location.search);
    if (q) localStorage.setItem("buzzcalculus.notebook", q[1] === "0" ? "" : "1");
    if (localStorage.getItem("buzzcalculus.notebook")) document.documentElement.classList.add("nb");
  } catch (_e) { /* 私密模式 */ }
  const NS = "http://www.w3.org/2000/svg";
  const MPC = 170; // 沒旁白：一個字幾毫秒（錄音平均約 208；看的人比念的快一點）
  const ENTRY = 320; // 下一句一開始，上一句的記號淡出要多久
  const CO = { gold: "kg", red: "kr", blue: "kc", green: "kn", violet: "kv" };
  const MARKS = { circle: "kg", underline: "kg", box: "kg", strike: "kr", arrow: "kc", focus: "kg" };
  const { cl, ease } = LY;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const R = (n) => n.getBoundingClientRect();
  // 每一格都問一次：MediaQueryList 留著，只讀 .matches（每格叫 matchMedia 會重新解析、產生垃圾）
  let RM = null;
  const reduced = () => { if (!RM && window.matchMedia) RM = window.matchMedia("(prefers-reduced-motion: reduce)"); return Boolean(RM && RM.matches); };
  const voice = () => { const s = window.BuzzCourseSections; return (s && s.voice && s.voice()) || {}; };

  // {{id:…}} → \htmlClass{cvb-t-id}{…}（可以巢狀）。驗證器用同一支。
  function tex(src) {
    let out = "";
    const st = [];
    for (let i = 0; i < src.length; i += 1) {
      const c = src[i];
      const m = c === "{" && /^\{\{([a-z][a-z0-9]{0,7}):/.exec(src.slice(i, i + 12));
      if (c === "\\") { out += c + (src[i + 1] || ""); i += 1; } else if (m) { out += `\\htmlClass{cvb-t-${m[1]}}{`; st.push(1); i += m[0].length - 1; } else if (c === "}" && st[st.length - 1] === 1 && src[i + 1] === "}") { out += c; st.pop(); i += 1; } else { if (c === "{") st.push(0); if (c === "}") st.pop(); out += c; }
    }
    return out;
  }
  const KOPT = { throwOnError: false, output: "html", strict: "ignore", trust: (x) => x.command === "\\htmlClass" && /^cvb-t-[a-z][a-z0-9]*$/.test(x.class) };
  // 字的頭尾空白放在 .cvb-x 外面：量墨水的框才不會把空白算進去（記號會以為貼著字）
  const sp = (x) => (x ? `<span class="cvb-s">${x}</span>` : "");
  // 「，」：正體字型（正黑、蘋方）把全形逗號擺在字格正中，夾在兩段式子之間像乘號「·」→ 換成貼基線的半形逗號，右邊補回全形的寬
  const cjk = (b) => b.split(/(，)/).filter(Boolean).map((x) => (x === "，" ? '<span class="cvb-x cvb-cm">,</span>' : `<span class="cvb-x">${esc(x)}</span>`)).join("");
  const tokHtml = (t) => (t.m ? window.katex.renderToString(`\\displaystyle ${tex(t.s)}`, KOPT) : t.s.replace(/^(\s*)([\s\S]*?)(\s*)$/, (_m, a, b, c) => `${sp(a)}${b ? cjk(b) : ""}${sp(c)}`));
  const mk = (tag, cls, h) => { const n = document.createElement(tag); n.className = cls; if (h) n.innerHTML = h; return n; };
  // 有墨水的最底層：KaTeX 的字、分數線、根號（svg），與一段中文
  const LEAF = ".katex-html span,.cvb-x";
  const isLeaf = (n) => n.classList.contains("cvb-x") || (!n.firstElementChild && /[^\s​]/.test(n.textContent)) || /frac-line|overline-line|underline-line|hline|rule/.test(n.className) || (n.firstElementChild && n.firstElementChild.tagName.toLowerCase() === "svg");
  const leavesOf = (root) => [...root.querySelectorAll(LEAF)].filter((n) => isLeaf(n) && !(n.parentElement && n.parentElement.closest(".cvb-x")));
  const rel = (r, o) => [r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top];
  // 一個小單位的「墨水」框：字用 canvas 的 measureText 量真正畫到的範圍（span 的框含字距與上下的留白，
  // 拿它算會以為兩個字貼在一起）；分數線、根號（svg）就是自己的框
  let cx2 = null;
  function inkOf(n) {
    const r = R(n);
    const t = n.firstElementChild ? "" : n.textContent;
    if (!t || !/\S/.test(t)) return r;
    if (!cx2) cx2 = document.createElement("canvas").getContext("2d");
    const cs = getComputedStyle(n);
    cx2.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cx2.measureText(t);
    if (!(m.actualBoundingBoxRight > 0) || !(m.fontBoundingBoxAscent > 0)) return r;
    const base = r.top + m.fontBoundingBoxAscent;
    return { left: r.left - m.actualBoundingBoxLeft, right: r.left + m.actualBoundingBoxRight, top: base - m.actualBoundingBoxAscent, bottom: base + m.actualBoundingBoxDescent };
  }
  const union = (bs) => (bs.length ? [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))] : null);
  const shift = (b, p) => [b[0] + p[0], b[1] + p[1], b[2] + p[0], b[3] + p[1]];

  let B = null; // 這一節（整課一塊時：這一課）的黑板
  // 2026-10-20 試做「一課一塊黑板」：整課寫在同一塊板上，像教授一堂課寫滿整面黑板（預設）。
  // 設定 boardSplit = true 回到一節一塊（E2E 量單節引擎的那幾支用它）
  const WHOLE = (api) => !((api && api.records && api.records.settings) || {}).boardSplit;
  const wholeCache = new WeakMap();
  function chunks(text, max) {
    // 一段 ＝ 到下一個標點為止（$…$ 不拆、跟著前後的字）
    const parts = [];
    let cur = "";
    text.split(/(\$[^$]*\$)/).forEach((p, i) => {
      if (i % 2) { cur += p; return; }
      [...p].forEach((ch) => { cur += ch; if (/[，。？、；：！,]/.test(ch)) { parts.push(cur); cur = ""; } });
    });
    if (cur) parts.push(cur);
    const out = [];
    parts.forEach((p) => {
      const last = out[out.length - 1];
      if (last !== undefined && LY.plainLen(last + p) <= max) out[out.length - 1] = last + p; else out.push(p);
    });
    return out.map((x) => x.trim()).filter(Boolean);
  }
  function lessonBoard(data) {
    if (wholeCache.has(data)) return wholeCache.get(data);
    const beats = [];
    const off = [];
    const qz = [];
    const secOf = [];
    const figSec = data.sections.map((s) => s.beats.some((b) => b.fig) || Boolean(s.drag));
    data.sections.forEach((s, si) => {
      off.push(beats.length);
      s.beats.forEach((b, bi) => {
        if (bi || !s.beats.some((x) => x.board)) { beats.push(b); return; }
        const head = [{ do: "write", line: `${si + 1}.　${String(s.title || "").replace(/[{}]/g, "")}`, color: "gold", head: true }];
        beats.push({ ...b, board: (si ? [{ do: "clear" }] : []).concat(head, b.board || []) });
      });
      // 板上出題：只有選擇題（小測、先猜）；拖圖、自己算、排順序、用在哪一步還是在板子下面
      const kind = s.check !== undefined ? "check" : s.predict ? "predict" : "";
      const item = kind === "check" ? (data.checks || [])[s.check] : s.predict;
      if (!kind || !item || !Array.isArray(item.options) || s.drag || s.solve || s.order || s.where || !s.beats.some((x) => x.board)) { qz.push(-1); return; }
      const ci = kind === "check" ? s.check : si;
      const tag = { kind, ci, si };
      const ask = chunks(String(item.ask || ""), 15).map((line, k) => ({ do: "write", line: k ? line : `${kind === "check" ? "小測" : "先猜"}　${line}`, color: "gold", qz: "ask", ...tag }));
      const opts = item.options.flatMap((o, oi) => chunks(String(o.label || ""), 24).map((line, k) => ({ do: "write", line: k ? line : `(${"ABCDEF"[oi]})　${line}`, qz: oi, ...tag })));
      ask[0].keep = ask.length - 1 + opts.length;
      qz.push(beats.length);
      beats.push({ say: "", show: [], quiz: tag, board: ask.concat(opts) });
    });
    beats.forEach((_b, bi) => { let si = 0; while (si + 1 < off.length && off[si + 1] <= bi) si += 1; secOf[bi] = si; });
    const out = { beats, off, qz, secOf, figSec, anyFig: figSec.some(Boolean) };
    wholeCache.set(data, out);
    return out;
  }
  let raf = 0;
  let poll = 0;

  /* ── 排版：建 DOM、量、排、放記號 ── */
  function build() {
    const S = B.sec;
    const W0 = B.el.clientWidth;
    if (!W0) return;
    B.w = W0;
    B.nbH = document.documentElement.classList.contains("nb") ? window.innerHeight : 0;
    const needPlot = S.beats.some((b) => (b.board || []).some((a) => a.do === "plot"));
    if (needPlot && !window.BuzzBoardPlot) {
      if (!B.plotWait && B.api) { B.plotWait = true; Promise.resolve(B.api.deps.ensureLazy("boardplot")).then(() => { if (B && B.plotWait) { B.plotWait = false; build(); kick(); } }, () => { if (B) B.plotWait = false; }); }
      return;
    }
    const M = LY.compile(S.beats);
    const F = W0 < 420 ? 20 : W0 < 640 ? 21 : 24;
    B.F = F;
    const pad = W0 < 480 ? [16, 16] : [24, 20];
    const W = W0 - 2 * pad[0];
    const smin = 16 / (F * 0.95);
    // 板子一律同一個大小（每一節都一樣，不忽大忽小）：畫面高度的 45%（280–560px），字從上面開始寫；
    // 寫得比板子還多就在板子裡捲（往上滑看前面寫過的），鏡頭跟著粉筆走（paint 的 follow）
    // 手機（窄）38%、平板與桌機 45%：手機上板子＋句子＋動作要放得進一屏。整課一塊時高一點（桌機 60%、手機 42%）
    // 筆記本：板子吃滿本文區剩下的高度（扣掉底下的播放列）
    const nbBox = document.documentElement.classList.contains("nb") && B.whole && B.el.closest("[data-cv2s] [data-cvb-slot]") ? nbFit() : null;
    const nbCap = nbBox ? Math.round(nbBox.bottom - B.el.getBoundingClientRect().top - 92) : 0;
    const cap = nbCap > 240 ? nbCap : B.whole
      ? Math.max(300, Math.min(760, Math.round((window.innerHeight || 800) * ((window.innerWidth || 800) < 600 ? (B.lesson && B.lesson.anyFig ? 0.56 : 0.42) : 0.6))))
      : Math.max(260, Math.min(560, Math.round((window.innerHeight || 800) * ((window.innerWidth || 800) < 600 ? 0.38 : 0.45))));
    // 整課一塊：分欄（一欄至少約 17 個字寬），每一行在欄寬裡排
    const colGap = Math.round(F * 2.4);
    const cols = B.whole ? Math.max(1, Math.floor((W + colGap) / (F * 17 + colGap))) : 1;
    const Wc = B.whole ? (W - (cols - 1) * colGap) / cols : W;
    const c = mk("div", "cvb-c");
    const ink = document.createElementNS(NS, "svg");
    ink.setAttribute("class", "cvb-ink");
    B.el.replaceChildren(c, ink);
    c.style.visibility = "hidden";
    // 1. 每一項：所有單位先排成一列量寬
    const V = M.items.map((it) => {
      const el = mk("div", `cvb-i ${CO[it.a.color] || ""}`);
      el.dataset.n = it.n;
      el.style.visibility = "hidden";
      el.style.fontSize = `${F}px`;
      c.appendChild(el);
      if (it.kind === "plot") {
        const g = window.BuzzBoardPlot.html(it.a.graph);
        let w = Math.min(Wc, Math.max(320, Math.min(480, W * 0.62)));
        if (B.whole) w = Math.min(w, ((cap - 2 * pad[1] - 16) * g.w) / g.h);
        el.classList.add("cvb-p");
        el.innerHTML = g.svg;
        el.style.width = `${w}px`;
        el.style.height = `${(w * g.h) / g.w}px`;
        return { el, it, w, h: (w * g.h) / g.w, leaves: [[0, 0, w, (w * g.h) / g.w]], terms: {} };
      }
      const u = LY.units(it.a.line);
      const row = mk("div", "cvb-r");
      const us = u.units.map((x) => { const n = mk("span", `cvb-u${x.rel ? " is-rel" : ""}`, x.toks.map(tokHtml).join("")); row.appendChild(n); return n; });
      el.appendChild(row);
      Object.entries(it.tint).forEach(([id, col]) => el.querySelectorAll(`.cvb-t-${id}`).forEach((t) => t.classList.add(CO[col] || "kg")));
      if (u.align < 0 && u.units.some((x) => x.toks.some((t) => !t.m))) el.classList.add("is-t");
      return { el, it, u, us, row };
    });
    const labs = M.anns.map((an) => {
      if (!an.a.label) return null;
      const l = mk("span", `cvb-lab ${CO[an.a.color] || MARKS[an.a.do]}`);
      l.textContent = an.a.label;
      c.appendChild(l);
      return l;
    });
    // 2. 太寬：小縮、換行、再縮
    const ws = V.map((v) => (v.us ? v.us.map((n) => R(n).width) : null));
    V.forEach((v, i) => {
      if (!v.us) return;
      const k = LY.compose(ws[i], Wc, smin, v.u.align);
      v.s = k.s;
      v.wrapped = Boolean(k.wrapped);
      v.el.style.fontSize = `${F * k.s}px`;
      if (k.rows.length > 1) {
        v.row.remove();
        k.rows.forEach((idx, r) => { const rw = mk("div", "cvb-r"); idx.forEach((j) => rw.appendChild(v.us[j])); if (k.ind[r]) rw.style.paddingLeft = `${k.ind[r] * k.s}px`; v.el.appendChild(rw); });
      }
    });
    // 3. 量：每一項的大小、每一個有墨水的小塊、每一個項（相對於那一項的左上角）
    V.forEach((v) => {
      if (!v.us) return;
      // 量的是內容（不含四邊 8px 的留白：那是給遮罩的，KaTeX 的字可能畫出框外一點）
      const o0 = R(v.el);
      const o = { left: o0.left + 8, top: o0.top + 8 };
      v.w = o0.width - 16;
      v.h = o0.height - 16;
      const ls = leavesOf(v.el);
      v.leaves = ls.map((n) => rel(inkOf(n), o));
      v.rb = [...v.el.children].map((r) => rel(R(r), o));
      v.rows = [...v.el.children].map((r, k) => union(leavesOf(r).map((n) => rel(inkOf(n), o))) || v.rb[k]);
      v.terms = {};
      v.el.querySelectorAll('[class*="cvb-t-"]').forEach((t) => {
        const id = (/cvb-t-([a-z0-9]+)/.exec(t.getAttribute("class")) || [])[1];
        const mine = ls.map((n, j) => (t.contains(n) ? j : -1)).filter((j) => j >= 0);
        const box = union(mine.map((j) => v.leaves[j]));
        if (!box) return;
        const row = v.rows.findIndex((r) => box[1] >= r[1] - 1 && box[3] <= r[3] + 1);
        // 到最近的字（同一列、上下左右）的距離：記號不能壓到旁邊的字
        const gaps = [99, 99, 99, 99];
        v.leaves.forEach((b, j) => {
          if (mine.includes(j)) return;
          const vy = b[1] < box[3] && b[3] > box[1];
          const vx = b[0] < box[2] && b[2] > box[0];
          if (vy && b[2] <= box[0] + 0.5) gaps[0] = Math.min(gaps[0], box[0] - b[2]);
          if (vy && b[0] >= box[2] - 0.5) gaps[2] = Math.min(gaps[2], b[0] - box[2]);
          if (vx && b[3] <= box[1] + 0.5) gaps[1] = Math.min(gaps[1], box[1] - b[3]);
          if (vx && b[1] >= box[3] - 0.5) gaps[3] = Math.min(gaps[3], b[1] - box[3]);
        });
        // er：那一項自己的框（飛的複製對的是它：複製出來的結構一樣、框也一樣，墨水框在不同的上下文裡會差一點）
        v.terms[id] = { el: t, box, er: rel(R(t), o), row: row < 0 ? 0 : row, gaps, leaves: mine };
      });
      const al = v.u.align;
      v.alignable = al >= 0 && !v.wrapped;
      v.lhs = v.alignable ? R(v.us[al]).left - o.left + (v.us[al].classList.contains("is-rel") ? 0.2778 * F * v.s : 0) : 0;
    });
    const lsz = labs.map((l) => (l ? [R(l).width, R(l).height] : null));
    // 4. 排：位置 → 記號的壽命 → 標籤放不下就在那一行底下（或上面）讓出空間，再排一次
    const L0 = B.lesson;
    const rectH = Math.round(cap * (cols === 1 ? 0.56 : 0.5));
    const figOf = L0 ? (i) => L0.figSec[L0.secOf[M.acts[M.items[i].born].b]] : null;
    const m = { W, pad, gap: Math.round(F * (nbBox ? 1.5 : 1.0)), flow: B.whole ? { view: cap, cols, colW: Wc, colGap, rectH, fig: figOf, headPage: Boolean(nbBox) } : null, items: V.map((v) => ({ w: v.w, h: v.h, lhs: v.lhs || 0, alignable: Boolean(v.alignable), gapA: 0, gapB: 0 })) };
    let st;
    let geo;
    for (let iter = 0; iter < 6; iter += 1) {
      st = LY.stack(M, m);
      LY.lifetimes(M, st.pos);
      geo = placeAll(M, V, st.pos, lsz, [6, 6, W0 - 6, Infinity], iter === 5);
      if (!geo.need || iter === 5) break;
      const [n, side, h] = geo.need;
      if (side === "B") m.items[n].gapB += h + 4; else m.items[n].gapA += h + 4;
    }
    const H = st.pages ? st.pages * cap : Math.ceil(Math.max(st.bottom, ...geo.anns.map((a) => (a ? a.bottom : 0))) + pad[1]);
    B.pages = st.pages || 0;
    B.model = B.whole ? (cols === 1 ? { x: 7 + pad[0], y: 7 + pad[1], w: W, h: rectH - pad[1] - 6 } : { x: 7 + pad[0] + (cols - 1) * (Wc + colGap), y: 7 + pad[1], w: Wc, h: cap - 2 * pad[1] }) : null;
    placeModel();
    B.tall = H > cap;
    B.el.classList.toggle("is-tall", B.tall);
    B.el.style.height = `${cap}px`;
    const CH = Math.max(H, cap);
    c.style.height = `${CH}px`;
    B.view = cap;
    ink.setAttribute("width", W0);
    ink.setAttribute("height", CH);
    // 5. 記號、箭頭、標籤；變形與「飛過來」的複製
    const sv = geo.anns.map((ga, i) => {
      if (!ga) return null;
      const an = M.anns[i];
      const col = CO[an.a.color] || MARKS[an.a.do];
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", col);
      g.dataset.a = i;
      g.innerHTML = ga.d.map((d) => `<path d="${d}" pathLength="1" style="stroke-dasharray:1 2;stroke-dashoffset:1"/>`).join("");
      ink.appendChild(g);
      const l = labs[i];
      if (l) { if (ga.lab) { l.style.left = `${ga.lab[0]}px`; l.style.top = `${ga.lab[1]}px`; l.dataset.a = i; } else l.remove(); }
      const term = an.kind === "mark" ? V[an.refs[0][0]].terms[an.refs[0][1]] : null;
      return { g, paths: [...g.children], lab: ga.lab ? l : null, term: term && term.el, col };
    });
    const fly = flights(M, V, st.pos, c);
    // 給分節的捲動對位（course_sections.js 找 .cvb-l:last-child）：一個看不見的點，放在現在最下面那一行的頂
    B.lastEl = mk("div", "cvb-l");
    B.lastEl.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px";
    c.appendChild(B.lastEl);
    B.chalk = mk("div", "cvb-chalk");
    B.chalk.setAttribute("aria-hidden", "true");
    c.insertBefore(B.chalk, B.lastEl);
    V.forEach((v) => { if (typeof v.it.a.qz === "number") { v.el.classList.add("cvb-opt"); v.el.dataset.opt = v.it.a.qz; } });
    B.M = M;
    B.V = V;
    B.L = { pos: st.pos, sv, fly, H };
    B.sch = schedules(M);
    B.last = "";
    quizState();
    c.style.visibility = "";
    if (document.fonts && document.fonts.status === "loading" && !B.fontWait) {
      const b0 = B;
      B.fontWait = true;
      document.fonts.ready.then(() => { if (B === b0 && B.el.isConnected) { build(); kick(); } });
    }
  }

  // 每一個記號：先定所有的外框與箭頭的路線（箭頭繞開字），再放標籤 —— 標籤要避開在它活著時板上的每一個字、記號、箭頭、別的標籤
  function placeAll(M, V, pos, lsz, bounds, force) {
    const out = [];
    const live = (i, j) => M.anns[j].g <= M.anns[i].last && M.anns[i].g <= M.anns[j].last;
    const glyphs = (an, skip) => {
      const o = [];
      for (let g = an.g; g <= an.last; g += 1) Object.keys(pos[g]).forEach((n) => V[n].leaves.forEach((b, j) => { if (!skip || !skip.has(`${n}:${j}`)) o.push(shift(b, pos[g][n])); }));
      return o;
    };
    M.anns.forEach((an, i) => {
      const a = an.a;
      const T = an.refs.map(([n, id]) => { const t = V[n].terms[id]; return t ? { n, t, box: shift(t.box, pos[an.g][n]), row: shift(V[n].rows[t.row] || t.box, pos[an.g][n]) } : null; });
      if (T.some((x) => !x)) { out.push(null); return; }
      if (an.kind === "mark") {
        // focus：不畫線，只把那一項換成記號的顏色（貼得太緊、圈了會壓到旁邊的字時用）
        const r = a.do === "focus" ? T[0].box : LY.markBox(a.do, T[0].box, T[0].t.gaps, B.F * 0.8);
        out.push({ d: a.do === "focus" ? [] : [LY.markPath(a.do, r)], occ: a.do === "focus" ? [] : [r], anchor: r, row: [Math.min(T[0].row[0], r[0]), Math.min(T[0].row[1], r[1]), Math.max(T[0].row[2], r[2]), Math.max(T[0].row[3], r[3])] });
        return;
      }
      const own = new Set();
      T.forEach((x) => x.t.leaves.forEach((j) => own.add(`${x.n}:${j}`)));
      const o2 = glyphs(an, own);
      // 端點那一項已經圈著、框著：箭頭接在記號的外框上，那個記號不算障礙
      const ends = T.map((x) => x.box);
      out.forEach((o, j) => {
        if (!o || !live(i, j)) return;
        const k = M.anns[j].kind === "mark" ? T.findIndex((x) => M.anns[j].refs[0][0] === x.n && M.anns[j].refs[0][1] === an.refs[T.indexOf(x)][1]) : -1;
        if (k >= 0 && o.occ.length) ends[k] = [Math.min(ends[k][0], o.occ[0][0]), Math.min(ends[k][1], o.occ[0][1]), Math.max(ends[k][2], o.occ[0][2]), Math.max(ends[k][3], o.occ[0][3])];
        else o2.push(...o.occ);
      });
      const p = LY.routeArrow(ends[0], ends[1], o2, bounds).p;
      const [ex, ey] = p.slice(4);
      const k = Math.hypot(ex - p[2], ey - p[3]) || 1;
      const ux = (ex - p[2]) / k;
      const uy = (ey - p[3]) / k;
      const hx = (sg) => `${(ex - 8 * ux * Math.cos(sg) + 8 * uy * Math.sin(sg)).toFixed(1)} ${(ey - 8 * uy * Math.cos(sg) - 8 * ux * Math.sin(sg)).toFixed(1)}`;
      const mid = LY.qpt(p, 0.5);
      const anchor = [mid[0] - 2, mid[1] - 2, mid[0] + 2, mid[1] + 2];
      out.push({ p, d: [`M${p[0].toFixed(1)} ${p[1].toFixed(1)}Q${p[2].toFixed(1)} ${p[3].toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`, `M${hx(0.45)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${hx(-0.45)}`], occ: LY.curveBoxes(p), anchor, row: anchor });
    });
    for (let i = 0; i < M.anns.length; i += 1) {
      const an = M.anns[i];
      const o = out[i];
      if (!o) continue;
      if (an.a.label && lsz[i]) {
        const [w, h] = lsz[i];
        const ob = glyphs(an);
        out.forEach((x, j) => { if (x && live(i, j)) ob.push(...x.occ, ...(x.labOcc && j !== i ? [x.labOcc] : [])); });
        let lab = an.kind === "arrow" ? LY.placeArrowLabel(w, h, o.p, ob, bounds) : LY.placeLabel(w, h, o.anchor, o.row, "below", ob, bounds);
        // 放不下：在那一行底下（劃掉的是上面）讓出一條標籤的空間再排一次；最後一輪還是放不下就放在底下（lint 會擋）
        // 箭頭：彎到那一行上面就讓上面、下面就讓下面
        const up = an.kind === "arrow" ? LY.qpt(o.p, 0.5)[1] < o.p[1] : false;
        if (!lab && !force) return { anns: out, need: [an.refs[0][0], up ? "A" : "B", h] };
        if (!lab) lab = [o.anchor[0], o.row[3] + 4, o.anchor[0] + w, o.row[3] + 4 + h];
        o.lab = lab;
        // 別的標籤離它至少 6px（擠在一起讀起來像同一個詞）
        o.labOcc = [lab[0] - 4, lab[1] - 2, lab[2] + 4, lab[3] + 2];
      }
      o.bottom = Math.max(o.anchor[3], ...o.occ.map((b) => b[3]), o.lab ? o.lab[3] : 0);
    }
    return { anns: out, need: null };
  }

  // 寫上一行、或變形時：同一個 id 的項從原本的位置飛過來（外層的帶著裡面的一起飛）
  function flights(M, V, pos, c) {
    const out = {};
    M.items.forEach((it) => {
      if (!it.fly.length || it.kind !== "line") return;
      const v = V[it.n];
      const chosen = [];
      it.fly.map(([id, src]) => ({ id, src, t: v.terms[id], s: V[src].terms && V[src].terms[id] }))
        .filter((f) => f.t && f.s)
        .sort((a, b) => (a.t.el.compareDocumentPosition(b.t.el) & 4 ? -1 : 1))
        .forEach((f) => { if (!chosen.some((x) => x.t.el.contains(f.t.el) || f.t.el.contains(x.t.el))) chosen.push(f); });
      out[it.n] = chosen.map((f) => {
        const el = mk("span", "katex cvb-f");
        el.style.fontSize = v.el.style.fontSize;
        const cp = f.t.el.cloneNode(true);
        [cp, ...cp.querySelectorAll('[class*="cvb-t-"]')].forEach((x) => { x.className = x.className.replace(/\bcvb-t-\S+/g, ""); });
        el.appendChild(cp);
        el.style.opacity = "0";
        c.appendChild(el);
        const own = rel(R(cp), R(el));
        const g = it.born;
        const srcPos = pos[g - 1] && pos[g - 1][f.src];
        return { el, own, a: srcPos ? shift(f.s.er, srcPos) : null, z: shift(f.t.er, pos[g][it.n]), tEl: f.t.el, sEl: f.s.el, moved: it.from && f.src === it.from.n };
      }).filter((f) => f.a);
    });
    return out;
  }

  /* ── 時間表：每一句的每一段（問句 q、講解 s）在錄音裡（每一個聲音各一份：女聲 t／ms、男聲 tm／mm）與虛擬時間裡各一份 ── */
  const TK = { f: ["t", "ms"], m: ["tm", "mm"] };
  function schedules(M) {
    const S = B.sec;
    const audio = { f: {}, m: {} };
    const virt = {};
    S.beats.forEach((b, bi) => {
      const acts = M.acts.filter((x) => x.b === bi);
      ["q", "s"].forEach((clip) => {
        const list = acts.filter((x) => x.clip === clip);
        if (!list.length) return;
        const say = String((clip === "q" ? b.why && b.why.say : b.say) || "");
        const n = [...say].length || 20;
        const VT = n * MPC + 400;
        LY.schedule(list.map((x) => x.a), VT, (a) => (a.on ? Math.max(0, LY.charOf(a.on, say)) * MPC : typeof a.at === "number" ? a.at * VT : null)).forEach((s, k) => { virt[list[k].g] = s; });
        Object.keys(TK).forEach((v) => {
          const [tk, mk] = TK[v];
          const t = clip === "q" ? b.why && b.why[tk] : b[tk];
          if (!Array.isArray(t)) return;
          const T = t[1] - t[0];
          LY.schedule(list.map((x) => x.a), T, (a) => (typeof a[mk] === "number" ? a[mk] : a.on ? (Math.max(0, LY.charOf(a.on, say)) * T) / n : typeof a.at === "number" ? a.at * T : null)).forEach((s, k) => { audio[v][list[k].g] = s; });
        });
      });
    });
    return { audio, virt };
  }

  /* ── 畫：游標（第 g 個動作做到 q）→ 每一個元素的樣子 ── */
  const setS = (el, k, v) => { if (el.style[k] !== v) el.style[k] = v; };
  const tr = (p) => `translate(${(p[0] - 8).toFixed(2)}px,${(p[1] - 8).toFixed(2)}px)`; // 內容的左上角 → 元素（多 8px 留白）
  // 寫的遮罩：全部列的墨水寬度加起來當一條路，q 走到哪、露到哪；每一列一層 [圖, 大小, 位置]
  function wipe(v, q) {
    const E = 22;
    const len = v.rows.map((r) => r[2] - r[0]);
    const tot = len.reduce((a, b) => a + b, 0) + E * len.length;
    let x = q * tot;
    const im = [];
    const sz = [];
    const ps = [];
    v.rows.forEach((r, k) => {
      const top = k ? v.rb[k][1] + 8 : 0;
      const bot = k + 1 < v.rb.length ? v.rb[k + 1][1] + 8 : v.h + 16;
      const at = r[0] + 8 + x - E;
      x -= len[k] + E;
      im.push(`linear-gradient(90deg,#000 ${at.toFixed(1)}px,transparent ${(at + E).toFixed(1)}px)`);
      sz.push(`${Math.ceil(v.w + 16)}px ${Math.ceil(bot - top + 1)}px`);
      ps.push(`0 ${top.toFixed(1)}px`);
    });
    // 粉筆尖：寫到的那一列、寫到的那一點（相對於這一項的元素左上角，含 8px 留白）
    let rem = q * tot;
    let tip = null;
    for (let k = 0; k < v.rows.length; k += 1) {
      const r = v.rows[k];
      if (rem <= len[k] + E || k === v.rows.length - 1) { tip = [8 + Math.min(r[2], r[0] + Math.max(0, rem)), 8 + (r[1] + r[3]) / 2]; break; }
      rem -= len[k] + E;
    }
    return [im.join(","), sz.join(","), ps.join(","), tip];
  }
  // 鏡頭跟著粉筆：寫的那一行跑出板子看得到的範圍就捲過去；使用者剛自己捲過（往回看）就 4 秒內不搶
  function follow(top, bot) {
    const el = B.el;
    if (!B.userBound) {
      B.userBound = true;
      const mark = () => { B.userAt = Date.now(); };
      el.addEventListener("wheel", mark, { passive: true });
      el.addEventListener("touchmove", mark, { passive: true });
    }
    if (B.userAt && Date.now() - B.userAt < 4000) return;
    const st = el.scrollTop;
    const view = B.view;
    let target = null;
    if (B.pages) {
      const pg = Math.max(0, Math.min(B.pages - 1, Math.floor((top + 1) / view))) * view;
      if (Math.abs(st - pg) > 1) el.scrollTop = pg;
      B.followTo = pg;
      return;
    }
    if (bot + 20 > st + view) target = Math.min(bot + 20 - view, top - 12);
    else if (top - 12 < st) target = top - 12;
    if (target === null) return;
    target = Math.max(0, Math.round(target));
    if (B.followTo === target && Math.abs(st - target) > 2) return;
    B.followTo = target;
    // 直接跳（不用 smooth）：板子裡的 smooth 捲動會打斷頁面正在跑的 smooth 捲動（Chrome），分節的對位就停在半路
    el.scrollTop = target;
  }
  function paint(g, q, beat, entry) {
    const { M, V, L } = B;
    const A = M.acts[g];
    const prev = g ? M.states[g - 1] : [];
    const next = A ? M.states[g] : prev;
    const e = ease(q);
    const hideIn = new Set(); // 變形中、還沒落地的項
    const at = {}; // 每一項現在的位置（「錯」的記號跟著它搬）
    const flyNow = A && (A.a.do === "write" || A.a.do === "transform") ? L.fly[M.items.find((it) => it.born === g && it.kind === "line")?.n] || [] : [];
    let chalkAt = null; // 正在寫的那一行的粉筆尖（板子座標）
    // 重點導引：板子寫滿了眼睛不知道看哪裡 —— 這一句寫的、這一句圈到／指到的、飛過來的來源那幾行亮著，其他舊的淡一點；
    // 一節寫完（停在動作前）全部亮回來給人複習。下一句一開始才慢慢淡（entry），不閃。
    const allDone = !A || A.b > B.secEnd;
    const lit = new Set();
    if (!allDone) {
      M.items.forEach((it) => { if (M.acts[it.born] && M.acts[it.born].b === beat) { lit.add(it.n); it.fly.forEach(([, src]) => lit.add(src)); } });
      M.anns.forEach((an) => { if (an.b === beat) an.refs.forEach(([n]) => lit.add(n)); });
    }
    const dimK = allDone || !lit.size ? 0 : 0.45 * ease(cl(entry));
    Object.values(L.fly).forEach((fs) => fs.forEach((f) => setS(f.el, "opacity", "0")));
    M.items.forEach((it) => {
      const v = V[it.n];
      const el = v.el;
      const n = it.n;
      const inP = prev.includes(n);
      const inN = next.includes(n);
      let op = 1;
      let p;
      let mask = null;
      // 還沒開始寫的（游標停在它的起點）也藏起來：遮罩全蓋住，但量框的東西（lint、螢幕閱讀器以外的工具）看不到遮罩
      if ((!inP && !inN) || (inN && !inP && q <= 0 && it.a.do !== "transform")) { setS(el, "visibility", "hidden"); setS(el, "opacity", "0"); return; }
      if (inP && inN) {
        const a = L.pos[g - 1][n];
        const z = (A ? L.pos[g] : L.pos[g - 1])[n];
        p = [a[0] + (z[0] - a[0]) * e, a[1] + (z[1] - a[1]) * e];
      } else if (inN) {
        p = L.pos[g][n];
        if (it.a.do === "transform") op = ease(cl((q - 0.3) / 0.55));
        else if (it.a.do !== "plot") {
          // 寫：從左到右露出來（軟邊）；換行的一列寫完再寫下一列（每一列一層遮罩，各管自己那一條）
          mask = q >= 1 ? null : wipe(v, q);
          if (mask && mask[3] && q > 0) chalkAt = [p[0] - 8 + mask[3][0], p[1] - 8 + mask[3][1]];
        }
      } else {
        p = L.pos[g - 1][n];
        op = 1 - ease(cl(q / (A.a.do === "transform" ? 0.4 : 1)));
      }
      if (dimK && !lit.has(n)) op *= 1 - dimK;
      at[n] = p;
      setS(el, "visibility", "visible");
      setS(el, "transform", tr(p));
      setS(el, "opacity", op >= 1 ? "" : op.toFixed(3));
      if (it.kind === "line") {
        const m = mask || ["", "", ""];
        setS(el, "webkitMaskImage", m[0]); setS(el, "maskImage", m[0]);
        setS(el, "webkitMaskSize", m[1]); setS(el, "maskSize", m[1]);
        setS(el, "webkitMaskPosition", m[2]); setS(el, "maskPosition", m[2]);
        setS(el, "webkitMaskRepeat", m[0] ? "no-repeat" : ""); setS(el, "maskRepeat", m[0] ? "no-repeat" : "");
      } else if (window.BuzzBoardPlot) {
        const pp = inN && !inP ? q : 1;
        if (v.pp !== pp) { v.pp = pp; window.BuzzBoardPlot.apply(v, pp); }
      }
    });
    // 粉筆：寫字的時候跟著寫到的那一點走（斜斜地拿著），沒在寫就淡掉
    if (B.chalk) {
      if (chalkAt) { setS(B.chalk, "transform", `translate(${chalkAt[0].toFixed(1)}px,${chalkAt[1].toFixed(1)}px) rotate(-28deg)`); setS(B.chalk, "opacity", "1"); } else setS(B.chalk, "opacity", "0");
    }
    if (B.lastEl && next.length) {
      const P = L.pos[g < M.acts.length ? g : g - 1];
      // 現在寫的那一行（不擦的板：最新的一項，不一定在最下面 —— 並排時新的一塊在右上）
      const low = A && next.includes(next[next.length - 1]) ? next[next.length - 1] : next.reduce((x, n) => (P[n][1] > P[x][1] ? n : x), next[0]);
      setS(B.lastEl, "top", `${P[low][1]}px`);
      setS(B.lastEl, "height", `${Math.max(1, V[low].h)}px`);
      if (B.tall) follow(P[low][1], P[low][1] + V[low].h);
    }
    // 飛：從舊的位置（與大小）滑到新的位置；落地前新的那一份藏著，變形時舊的那一份一開始就交給複製
    Object.values(L.fly).forEach((fs) => fs.forEach((f) => { setS(f.tEl, "opacity", ""); if (f.moved) setS(f.sEl, "opacity", ""); }));
    flyNow.forEach((f) => {
      const land = A.a.do === "transform" ? 0.85 : 0.8;
      const m = ease(cl(q / land));
      if (q > 0 && q < land) {
        const box = f.a.map((a, i) => a + (f.z[i] - a) * m);
        // 橫著搬（同一行裡換位置）走一道往上的弧，不從別的字身上壓過去（Manim 的 path_arc）
        const dx = f.z[0] - f.a[0];
        const lift = Math.abs(dx) > Math.abs(f.z[1] - f.a[1]) ? Math.min(22, Math.abs(dx) * 0.3, Math.max(0, Math.min(f.a[1], f.z[1]) - 4)) * Math.sin(Math.PI * m) : 0;
        box[1] -= lift;
        box[3] -= lift;
        const sx = (box[2] - box[0]) / (f.own[2] - f.own[0] || 1);
        const sy = (box[3] - box[1]) / (f.own[3] - f.own[1] || 1);
        setS(f.el, "transform", `translate(${(box[0] - f.own[0] * sx).toFixed(2)}px,${(box[1] - f.own[1] * sy).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`);
        setS(f.el, "opacity", "1");
      }
      if (q < land) { setS(f.tEl, "opacity", "0"); hideIn.add(f.tEl); }
      if (f.moved && q > 0) setS(f.sEl, "opacity", "0");
    });
    // 記號：畫上去（ease）、標籤後到；壽命到了淡出；被標的項跟著變色
    M.anns.forEach((an, i) => {
      const s = L.sv[i];
      if (!s) return;
      const pr = an.g < g ? 1 : an.g === g ? q : 0;
      // 兩種收法取先到的：下一句開始（淡出）、它掛的那一行動了（跟著那個動作淡出）
      let alive = 1;
      if (an.dieG <= g) alive = an.dieG === g ? 1 - cl(q / 0.35) : 0;
      if (beat >= an.dieBeat) alive = Math.min(alive, beat === an.dieBeat ? 1 - ease(entry) : 0);
      // 畫到哪先寫（收掉的也寫）：慢的裝置上新一句的第一格可能晚過淡出的 320ms，上一句沒畫完的記號就會停在半截藏著
      if (an.kind === "mark") { if (s.paths[0]) s.paths[0].style.strokeDashoffset = (1 - ease(cl(pr / 0.8))).toFixed(4); } else { s.paths[0].style.strokeDashoffset = (1 - ease(cl(pr / 0.75))).toFixed(4); s.paths[1].style.strokeDashoffset = (1 - cl((pr - 0.72) / 0.2)).toFixed(4); }
      if (pr <= 0 || alive <= 0) { setS(s.g, "opacity", "0"); if (s.lab) setS(s.lab, "opacity", "0"); if (s.term) setS(s.term, "color", ""); return; }
      setS(s.g, "opacity", alive >= 1 ? "" : alive.toFixed(3));
      const n0 = an.refs[0][0];
      const o0 = L.pos[an.g][n0];
      const dx = an.wrong && at[n0] ? at[n0][0] - o0[0] : 0;
      const dy = an.wrong && at[n0] ? at[n0][1] - o0[1] : 0;
      setS(s.g, "transform", dx || dy ? `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)` : "");
      if (s.lab) {
        const lo = cl((pr - 0.5) / 0.4) * alive;
        setS(s.lab, "opacity", lo.toFixed(3));
        setS(s.lab, "transform", `translate(${dx.toFixed(2)}px,${(dy + (1 - cl((pr - 0.5) / 0.4)) * 4).toFixed(2)}px)`);
      }
      if (s.term && !hideIn.has(s.term)) {
        const k = Math.round(cl(pr / 0.4) * alive * 20) * 5;
        setS(s.term, "color", k ? `color-mix(in srgb,var(--${s.col}) ${k}%,currentColor)` : "");
      }
    });
  }
  // 板上的選項：選錯的劃紅線、答對（或先猜選過）圈起正解；這一節的題目寫好了、還沒定案才點得到
  function quizState() {
    if (!B || !B.V || !B.api || !B.whole) return;
    const st = B.api.state;
    const data = B.api.data;
    // 題目整個寫完了才點得到（還在寫就點，點的是還沒出現的字）
    const qEnd = B.M.acts.reduce((m, x) => (x.b === B.qa ? x.g + 1 : m), 0);
    B.qOn = B.at === B.qa && Boolean(B.cur) && B.cur.g >= qEnd;
    B.V.forEach((v) => {
      const a = v.it.a;
      if (typeof a.qz !== "number") return;
      const item = a.kind === "check" ? (data.checks || [])[a.ci] : (data.sections[a.si] || {}).predict;
      if (!item) return;
      const picks = a.kind === "check" ? st.picks[a.ci] || [] : st.sec.pred[a.si] === undefined ? [] : [st.sec.pred[a.si]];
      const right = picks.some((oi) => item.options[oi] && item.options[oi].correct);
      const settled = right || (a.kind === "predict" && picks.length > 0);
      const o = item.options[a.qz] || {};
      v.el.classList.toggle("cvb-no", picks.includes(a.qz) && !o.correct);
      v.el.classList.toggle("cvb-yes", settled && Boolean(o.correct));
      const live = !settled && a.si === B.si && B.at === B.qa && B.qOn;
      if (live && !picks.includes(a.qz)) Object.assign(v.el.dataset, { action: "course-s-pick", kind: a.kind, check: String(a.ci), option: String(a.qz) });
      else ["action", "kind", "check", "option"].forEach((k) => delete v.el.dataset[k]);
    });
  }
  // 「第幾個動作做到多少」：照這一句的時間（錄音或虛擬）算
  function cursor(now) {
    const S = B.sec;
    const bi = B.at;
    const b = S.beats[bi] || {};
    const acts = B.M.acts;
    let g0 = acts.findIndex((x) => x.b >= bi);
    if (g0 < 0) g0 = acts.length;
    const mine = acts.filter((x) => x.b === bi);
    const open = !b.why || B.open;
    if (B.frozen) return B.frozen;
    const end = { g: g0 + mine.length, q: 0, entry: 1, mode: "done" };
    if (reduced()) return end;
    const v = voice();
    const key = `${B.si}-${bi - B.off}`;
    let clip;
    let tau;
    let mode;
    let entry;
    const vk = v.v === "m" ? "m" : "f"; // 念的是哪一個聲音：時間與錨點用那一個的
    const tk = TK[vk][0];
    if (v.on && v.beat === key && v.end > v.start && Array.isArray(b[tk])) {
      mode = "audio";
      clip = b.why && b.why[tk] && v.start === b.why[tk][0] ? "q" : "s";
      const raw = v.at - v.start;
      if (raw !== B.raw) { B.raw = raw; B.rawAt = now; }
      let est = raw + (v.paused ? 0 : Math.min(100, (now - B.rawAt) * (v.rate || 1)));
      if (B.clip === clip && est < B.tau && B.tau - est < 150) est = B.tau;
      if (raw < -80) est = 0; // 還在跳到這一句的起點
      tau = Math.max(0, Math.min(est, v.end - v.start));
      B.paused = Boolean(v.paused);
      B.pending = 0;
    } else if (v.on && !v.paused && v.beat !== key && (B.pending ? now - B.pending < 600 : (B.pending = now))) {
      mode = "wait";
      clip = b.why ? "q" : "s";
      tau = 0;
    } else {
      mode = "virtual";
      B.paused = false;
      if (open && b.why && B.s0 === null) B.s0 = now;
      clip = b.why && !open ? "q" : "s";
      tau = now - (clip === "s" && b.why ? B.s0 : B.q0);
    }
    if (!B.fresh && mode !== "audio") return end;
    entry = clip === (b.why ? "q" : "s") ? cl(tau / ENTRY) : 1;
    B.clip = clip;
    B.tau = tau;
    const sch = mode === "audio" ? B.sch.audio[vk] : B.sch.virt;
    for (const x of mine) {
      let q;
      if (x.why && !B.open) q = 0;
      else if (x.clip !== clip) q = x.clip === "q" ? 1 : 0;
      else { const s = sch[x.g] || B.sch.virt[x.g] || [0, 600]; q = cl((tau - s[0]) / s[1]); }
      if (q < 1) return { g: x.g, q, entry, mode };
    }
    return { g: end.g, q: 0, entry, mode };
  }
  function frame(now) {
    raf = 0;
    if (!B || !B.M) return;
    if (!B.el.isConnected) { stop(); return; }
    const c = cursor(now);
    B.cur = c;
    const beat = c.beat === undefined ? B.at : c.beat;
    const sig = `${c.g}|${c.q.toFixed(4)}|${c.entry.toFixed(3)}|${beat}`;
    if (sig !== B.last) { B.last = sig; paint(c.g, c.q, beat, c.entry); }
    if (B.qa >= 0 && B.at === B.qa - 1 && !B.frozen) {
      const g0 = B.M.acts.findIndex((x) => x.b === B.qa);
      if (g0 >= 0 && c.g >= g0) { goQuiz(now); return kick(); }
    }
    if (B.qa >= 0 && B.at === B.qa && !B.qOn) { quizState(); if (B.qOn) B.last = ""; }
    const A = B.M.acts[c.g];
    const busy = c.mode === "wait" || (c.mode === "audio" && !B.paused) || (c.mode === "virtual" && (c.q > 0 || (A && A.b === B.at && !(A.why && !B.open)))) || (c.mode !== "done" && c.entry < 1);
    // 不動的時候也每 300ms 看一眼：旁白可能剛按了播放、跳回這一句的開頭
    if (busy) raf = window.requestAnimationFrame(frame);
    else if (!B.frozen) poll = window.setTimeout(() => { poll = 0; kick(); }, 300);
  }
  // 圖那一塊：位置寫在舞台上（.cvb-stage 的 --mx／--my／--mw／--mh）
  function placeModel() {
    const stage = B && B.el.parentNode && B.el.parentNode.closest && B.el.parentNode.closest(".cvb-stage");
    if (!stage || !B.model) return;
    const g = B.model;
    [["--mx", g.x], ["--my", g.y], ["--mw", g.w], ["--mh", g.h]].forEach(([k, v]) => stage.style.setProperty(k, `${Math.round(v)}px`));
  }
  function goQuiz(now) {
    B.at = B.qa;
    B.fresh = !reduced();
    B.q0 = now;
    B.s0 = null;
    B.open = true;
    B.raw = null;
    B.pending = 0;
    B.last = "";
    quizState();
  }
  function kick() {
    window.clearTimeout(poll);
    poll = 0;
    if (!raf && B && B.M) raf = window.requestAnimationFrame(frame);
  }
  function answered(api, si) {
    const s = api.data.sections[si];
    if (s.check !== undefined) return (api.state.picks[s.check] || []).length > 0;
    return api.state.sec.pred[si] !== undefined;
  }
  function stop() { window.cancelAnimationFrame(raf); window.clearTimeout(poll); raf = poll = 0; }

  // course_sections.js 每次畫完（整頁或只換句子）叫這一支：黑板是同一個元素，搬進新畫的位置
  // 筆記本原型：課的根（[data-cv2s]）固定成整個本文區 —— 桌機：側欄右邊、麵包屑列下面到底；手機：頂列下面、分頁列上面
  function nbFit() {
    const root = document.querySelector("[data-cv2s]");
    if (!root || !document.documentElement.classList.contains("nb")) return null;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const side = document.querySelector(".topbar:not(.is-quiz)");
    const sr = side ? side.getBoundingClientRect() : null;
    const vertical = sr && sr.height > vh * 0.6 && sr.width < vw * 0.5;
    const bar = document.querySelector(".workspace-bar");
    const br = bar && bar.getClientRects().length ? bar.getBoundingClientRect() : null;
    const left = vertical ? Math.round(sr.right) : 0;
    const top = Math.round(br ? br.bottom : sr && !vertical ? sr.bottom : 0);
    const nav = document.querySelector(".topbar-nav");
    const nr = nav && nav.getClientRects().length ? nav.getBoundingClientRect() : null;
    const bottom = nr && nr.top > vh / 2 ? Math.round(vh - nr.top) : 0;
    root.classList.add("is-nb");
    const avail = vw - left;
    const w = Math.min(avail, 1120);
    const gap = Math.max(0, Math.round((avail - w) / 2));
    Object.assign(root.style, { left: `${left + gap}px`, top: `${top}px`, right: `${gap}px`, bottom: `${bottom}px` });
    return root.getBoundingClientRect();
  }

  function sync(api, root) {
    const slot = root && root.querySelector("[data-cvb-slot]");
    const sec = api.state.sec;
    if (!slot || !sec || !api.data.sections[sec.si]) { stop(); B = null; return; }
    if (!document.getElementById("cvb-style")) { const st = mk("style", ""); st.id = "cvb-style"; st.textContent = CSS + CSS_REST; document.head.appendChild(st); }
    const whole = WHOLE(api) && lessonBoard(api.data);
    if (whole) nbFit();
    const S = whole || api.data.sections[sec.si];
    const local = Math.min(api.data.sections[sec.si].beats.length, sec.shown[sec.si] || 1) - 1;
    const off = whole ? whole.off[sec.si] : 0;
    const at = off + local;
    const key = whole ? `${api.m.id}:all` : `${api.m.id}:${sec.si}`;
    const now = performance.now();
    if (!B || B.key !== key || B.state !== api.state) {
      stop();
      const el = mk("div", "cvb");
      el.setAttribute("aria-hidden", "true");
      B = { key, si: sec.si, state: api.state, el, at: -1, sec: S, M: null, w: 0, raw: null, rawAt: 0, tau: 0, clip: "", pending: 0, s0: null, q0: now };
    }
    B.api = api;
    B.sec = S;
    B.whole = Boolean(whole);
    B.lesson = whole || null;
    B.si = sec.si;
    B.off = off;
    B.qa = whole ? whole.qz[sec.si] : -1;
    B.secEnd = B.qa >= 0 ? B.qa : whole ? whole.off[sec.si] + api.data.sections[sec.si].beats.length - 1 : S.beats.length - 1;
    // 換節時板子搬進新畫的那一格：搬過去 scrollTop 會歸零，鏡頭要重新對到粉筆
    if (B.el.parentNode !== slot) { slot.appendChild(B.el); B.followTo = null; B.last = ""; }
    if (!B.M || B.el.clientWidth !== B.w) build();
    placeModel();
    // 出題那一句：最後一句寫完才接（frame 的 goQuiz）；已經在出題、或這一題答過了，就停在出題
    const lastLocal = local === api.data.sections[sec.si].beats.length - 1;
    if (B.qa >= 0 && lastLocal && (B.at === B.qa || answered(api, sec.si))) { if (B.at !== B.qa) goQuiz(now); quizState(); kick(); return; }
    const b = S.beats[at] || {};
    const open = Boolean(b.why && (!window.BuzzCourseProof || (sec.why[`${sec.si}-${local}`] || {}).open));
    if (B.at !== at) {
      B.at = at;
      B.fresh = sec.fresh === local && !reduced();
      B.q0 = now;
      B.s0 = open ? now : null;
      B.open = open || !b.why;
      B.raw = null;
      B.pending = 0;
      B.last = "";
    } else if (open && !B.open) { B.open = true; B.s0 = now; B.last = ""; }
    quizState();
    kick();
  }
  if (typeof window !== "undefined" && window.addEventListener) {
    let rt = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(rt);
      // 筆記本的高度跟著視窗：高度變了才重排（手機捲動時網址列伸縮也會丟 resize，同樣大小就不動）
      rt = window.setTimeout(() => { if (B && B.whole) nbFit(); const nbH = document.documentElement.classList.contains("nb") ? window.innerHeight : 0; if (B && B.el.isConnected && (B.el.clientWidth !== B.w || nbH !== (B.nbH || 0))) { B.nbH = nbH; build(); B.last = ""; kick(); } }, 200);
    });
  }
  // 給 E2E 與 tools/lint_board_layout.js：狀態、停在某一步、直接畫某個游標
  const debug = {
    model: () => (B && B.M && B.L ? { acts: B.M.acts.map((x) => ({ g: x.g, b: x.b, k: x.k, do: x.a.do, clip: x.clip, why: x.why })), anns: B.M.anns.map((x) => ({ g: x.g, b: x.b, do: x.a.do, refs: x.refs, wrong: x.wrong, dieG: x.dieG === Infinity ? -1 : x.dieG })), H: B.L.H, w: B.w, sch: B.sch } : null),
    show(g, q, beat, entry) {
      if (!B || !B.M) return false;
      const A = B.M.acts[g];
      const bt = beat === undefined ? (A ? A.b : B.M.acts[g - 1].b) : beat;
      B.frozen = { g, q: q || 0, entry: entry === undefined ? 0 : entry, mode: "frozen", beat: bt };
      stop();
      B.last = "";
      paint(g, q || 0, bt, B.frozen.entry);
      return true;
    },
    tick() { if (B && B.M) { window.cancelAnimationFrame(raf); raf = 0; frame(performance.now()); } },
    // 虛擬時鐘撥到這一句的第 ms 毫秒（之後照牆上時間繼續走）：E2E 驗「念到那個詞才開始」不必跟機器快慢賽跑
    clock(ms) { if (!B || !B.M) return null; const t = performance.now() - ms; B.q0 = t; if (B.s0 !== null) B.s0 = t; B.last = ""; debug.tick(); return window.BuzzBoard.state(); },
    release() { if (B) { B.frozen = null; B.last = ""; kick(); } },
    rebuild() { if (B) { build(); B.last = ""; kick(); } }
  };
  // 攤開整塊黑板（結算畫面的按鈕）：整課的板重排一次、直接畫到最後（每一句都寫完、小測照作答狀態圈／劃），
  // 再把每一面切下來並排 —— 一課寫滿的推導一次看完。板子本身是一個會捲的框（一次一面），這裡把每一面各複製一份。
  function overview(api) {
    const whole = lessonBoard(api.data);
    if (!whole || !whole.beats.some((b) => (b.board || []).length)) return false;
    if (!document.getElementById("cvb-style")) { const st = mk("style", ""); st.id = "cvb-style"; st.textContent = CSS + CSS_REST; document.head.appendChild(st); }
    stop();
    const ov = mk("div", "cvb-ov");
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "整塊黑板");
    const bar = mk("div", "cvb-ov-bar");
    const ttl = mk("b", "");
    ttl.textContent = `整塊黑板 · ${(api.m && api.m.title) || api.data.title || ""}`;
    const close = mk("button", "button secondary");
    close.type = "button";
    close.textContent = "關閉";
    close.dataset.cvbOvClose = "1";
    bar.append(ttl, close);
    const grid = mk("div", "cvb-ov-grid");
    const meas = mk("div", "cvb-ov-meas");
    const vw = window.innerWidth || 1024;
    const W0 = Math.round(Math.min(1060, vw - (vw < 600 ? 32 : 96)));
    meas.style.width = `${W0}px`;
    ov.append(bar, grid, meas);
    document.body.appendChild(ov);
    const el = mk("div", "cvb");
    meas.appendChild(el);
    const lastSi = api.data.sections.length - 1;
    B = { key: `${api.m.id}:overview`, si: lastSi, state: api.state, el, at: whole.beats.length - 1, sec: whole, M: null, w: 0, raw: null, rawAt: 0, tau: 0, clip: "", pending: 0, s0: null, q0: performance.now(),
      api, whole: true, lesson: whole, off: 0, qa: -1, secEnd: whole.beats.length - 1 };
    const finish = () => {
      build();
      if (!B || !B.M) return false;
      debug.show(B.M.acts.length, 1);
      const cap = B.view;
      const pages = Math.max(1, B.pages || Math.ceil(B.L.H / cap));
      const inner = [...el.children];
      const cols = vw >= 1100 ? 2 : 1;
      const gap = 16;
      const s = Math.min(1, (Math.min(vw - (vw < 600 ? 24 : 64), 2 * 1060) - (cols - 1) * gap) / cols / W0);
      for (let p = 0; p < pages; p += 1) {
        const box = mk("div", "cvb-ov-page");
        box.style.width = `${W0 * s}px`;
        box.style.height = `${cap * s}px`;
        const pg = mk("div", "cvb cvb-ov-board");
        pg.style.cssText = `width:${W0}px;height:${cap}px;transform:scale(${s});transform-origin:0 0`;
        const shift = mk("div", "");
        shift.style.cssText = `position:relative;transform:translateY(${-p * cap}px)`;
        inner.forEach((n) => shift.appendChild(n.cloneNode(true)));
        pg.appendChild(shift);
        const num = mk("small", "cvb-ov-n");
        num.textContent = `${p + 1} / ${pages}`;
        box.append(pg, num);
        grid.appendChild(box);
      }
      meas.remove();
      B = null;
      return true;
    };
    const shut = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") shut(); };
    close.addEventListener("click", shut);
    document.addEventListener("keydown", onKey);
    // 有圖（plot）的課要先抓畫圖模組；build 自己會抓、抓到再畫
    const go = () => { if (!finish()) { if (B && B.plotWait) window.setTimeout(go, 120); else shut(); } };
    go();
    close.focus();
    return true;
  }

  window.BuzzBoard = {
    sync, tex, KOPT, debug, whole: WHOLE, overview,
    state: () => (B && B.M ? { key: B.key, at: B.at, g: (B.cur || {}).g, q: (B.cur || {}).q, mode: (B.cur || {}).mode, clip: B.clip, tau: Math.round(B.tau || 0), running: Boolean(raf), p: B.cur && B.cur.mode !== "done" ? (B.cur.g + B.cur.q) : 1 } : null)
  };
})();
