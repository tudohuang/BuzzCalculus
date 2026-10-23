// 筆記本上自己寫：同一張紙，愛寫哪裡寫哪裡，不寫也沒差（只有筆記本模式＋一課一塊板才載，見 course_board.js 的 ink()）。
//
// 筆跡：perfect-freehand（tldraw 的筆）把一串點變成粗細會變、頭尾收尖的外框，畫成 SVG path。
//   SVG 不用 canvas：整課的紙可以捲到好幾千 px 高，一張那麼大的 canvas 太吃記憶體；path 跟著內容層一起捲，不用重畫。
// 誰在寫：觸控筆（pointerType pen）隨時都能寫；滑鼠、手指要先點右上角的筆。
//   點一下（沒有拖）照樣是「點黑板 → 下一節」；拖過才算寫字，那一下的 click 吃掉。
//   用過觸控筆之後手指不寫（手掌不會留痕）；筆開著、用手指寫的時候，兩指捲動。
// 存：一課一份，localStorage buzzcalculus.ink.v1；座標除以紙寬（換寬度時跟著縮放，排版重排時位置只是大約對得上）。
(function () {
  "use strict";

  /* perfect-freehand 1.2.2 — MIT License, Copyright (c) 2021 Stephen Ruiz Ltd（https://github.com/steveruizok/perfect-freehand） */
  const getStroke = (function () {
    function $(e,t,u,x=h=>h){return e*x(.5-t*(.5-u))}function se(e){return[-e[0],-e[1]]}function l(e,t){return[e[0]+t[0],e[1]+t[1]]}function a(e,t){return[e[0]-t[0],e[1]-t[1]]}function b(e,t){return[e[0]*t,e[1]*t]}function he(e,t){return[e[0]/t,e[1]/t]}function R(e){return[e[1],-e[0]]}function B(e,t){return e[0]*t[0]+e[1]*t[1]}function ue(e,t){return e[0]===t[0]&&e[1]===t[1]}function ge(e){return Math.hypot(e[0],e[1])}function de(e){return e[0]*e[0]+e[1]*e[1]}function A(e,t){return de(a(e,t))}function G(e){return he(e,ge(e))}function ie(e,t){return Math.hypot(e[1]-t[1],e[0]-t[0])}function L(e,t,u){let x=Math.sin(u),h=Math.cos(u),y=e[0]-t[0],n=e[1]-t[1],f=y*h-n*x,d=y*x+n*h;return[f+t[0],d+t[1]]}function K(e,t,u){return l(e,b(a(t,e),u))}function ee(e,t,u){return l(e,b(t,u))}var{min:C,PI:xe}=Math,pe=.275,V=xe+1e-4;function ce(e,t={}){let{size:u=16,smoothing:x=.5,thinning:h=.5,simulatePressure:y=!0,easing:n=r=>r,start:f={},end:d={},last:D=!1}=t,{cap:S=!0,easing:j=r=>r*(2-r)}=f,{cap:q=!0,easing:c=r=>--r*r*r+1}=d;if(e.length===0||u<=0)return[];let p=e[e.length-1].runningLength,g=f.taper===!1?0:f.taper===!0?Math.max(u,p):f.taper,T=d.taper===!1?0:d.taper===!0?Math.max(u,p):d.taper,te=Math.pow(u*x,2),_=[],M=[],H=e.slice(0,10).reduce((r,i)=>{let o=i.pressure;if(y){let s=C(1,i.distance/u),W=C(1,1-s);o=C(1,r+(W-r)*(s*pe))}return(r+o)/2},e[0].pressure),m=$(u,h,e[e.length-1].pressure,n),U,X=e[0].vector,z=e[0].point,F=z,O=z,E=F,J=!1;for(let r=0;r<e.length;r++){let{pressure:i}=e[r],{point:o,vector:s,distance:W,runningLength:I}=e[r];if(r<e.length-1&&p-I<3)continue;if(h){if(y){let v=C(1,W/u),Z=C(1,1-v);i=C(1,H+(Z-H)*(v*pe))}m=$(u,h,i,n)}else m=u/2;U===void 0&&(U=m);let le=I<g?j(I/g):1,fe=p-I<T?c((p-I)/T):1;m=Math.max(.01,m*Math.min(le,fe));let re=(r<e.length-1?e[r+1]:e[r]).vector,Y=r<e.length-1?B(s,re):1,be=B(s,X)<0&&!J,ne=Y!==null&&Y<0;if(be||ne){let v=b(R(X),m);for(let Z=1/13,w=0;w<=1;w+=Z)O=L(a(o,v),o,V*w),_.push(O),E=L(l(o,v),o,V*-w),M.push(E);z=O,F=E,ne&&(J=!0);continue}if(J=!1,r===e.length-1){let v=b(R(s),m);_.push(a(o,v)),M.push(l(o,v));continue}let oe=b(R(K(re,s,Y)),m);O=a(o,oe),(r<=1||A(z,O)>te)&&(_.push(O),z=O),E=l(o,oe),(r<=1||A(F,E)>te)&&(M.push(E),F=E),H=i,X=s}let P=e[0].point.slice(0,2),k=e.length>1?e[e.length-1].point.slice(0,2):l(e[0].point,[1,1]),Q=[],N=[];if(e.length===1){if(!(g||T)||D){let r=ee(P,G(R(a(P,k))),-(U||m)),i=[];for(let o=1/13,s=o;s<=1;s+=o)i.push(L(r,P,V*2*s));return i}}else{if(!(g||T&&e.length===1))if(S)for(let i=1/13,o=i;o<=1;o+=i){let s=L(M[0],P,V*o);Q.push(s)}else{let i=a(_[0],M[0]),o=b(i,.5),s=b(i,.51);Q.push(a(P,o),a(P,s),l(P,s),l(P,o))}let r=R(se(e[e.length-1].vector));if(T||g&&e.length===1)N.push(k);else if(q){let i=ee(k,r,m);for(let o=1/29,s=o;s<1;s+=o)N.push(L(i,k,V*3*s))}else N.push(l(k,b(r,m)),l(k,b(r,m*.99)),a(k,b(r,m*.99)),a(k,b(r,m)))}return _.concat(N,M.reverse(),Q)}function me(e,t={}){var q;let{streamline:u=.5,size:x=16,last:h=!1}=t;if(e.length===0)return[];let y=.15+(1-u)*.85,n=Array.isArray(e[0])?e:e.map(({x:c,y:p,pressure:g=.5})=>[c,p,g]);if(n.length===2){let c=n[1];n=n.slice(0,-1);for(let p=1;p<5;p++)n.push(K(n[0],c,p/4))}n.length===1&&(n=[...n,[...l(n[0],[1,1]),...n[0].slice(2)]]);let f=[{point:[n[0][0],n[0][1]],pressure:n[0][2]>=0?n[0][2]:.25,vector:[1,1],distance:0,runningLength:0}],d=!1,D=0,S=f[0],j=n.length-1;for(let c=1;c<n.length;c++){let p=h&&c===j?n[c].slice(0,2):K(S.point,n[c],y);if(ue(S.point,p))continue;let g=ie(p,S.point);if(D+=g,c<j&&!d){if(D<x)continue;d=!0}S={point:p,pressure:n[c][2]>=0?n[c][2]:.5,vector:G(a(S.point,p)),distance:g,runningLength:D},f.push(S)}return f[0].vector=((q=f[1])==null?void 0:q.vector)||[0,0],f}function ae(e,t={}){return ce(me(e,t),t)}
    return ae;
  })();

  const KEY = "buzzcalculus.ink.v1";
  const NS = "http://www.w3.org/2000/svg";
  // 筆：細的墨水筆（三色）與螢光筆；size 是紙寬 1000px 時的粗細，跟著紙寬縮放
  const PEN = { size: 3.4, thinning: 0.62, smoothing: 0.55, streamline: 0.42, start: { taper: 6, cap: true }, end: { taper: 10, cap: true } };
  const HL = { size: 18, thinning: 0, smoothing: 0.6, streamline: 0.5, start: { cap: true }, end: { cap: true } };
  const COLORS = [["k", "黑"], ["c", "藍"], ["r", "紅"]];
  const CSS = `.cvk{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:2}
.cvk .cvk-hl path{fill:#facc15;opacity:.42;mix-blend-mode:multiply}
:root[data-theme="dark"] .cvk .cvk-hl path{fill:#a16207;opacity:.5;mix-blend-mode:screen}
.cvk .cvk-k{fill:var(--k)}.cvk .cvk-c{fill:var(--kc)}.cvk .cvk-r{fill:var(--kr)}
html.nb .cvb{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html.nb .cvb.is-ink{cursor:crosshair}html.nb .cvb.is-ink.is-er{cursor:cell}
html.nb .cvb.is-ink-touch{touch-action:none}
.cvk-bar{--k:#1f2a44;--kc:#1d4ed8;--kr:#dc2626;position:absolute;z-index:4;top:10px;right:16px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;border-radius:999px;background:color-mix(in srgb,var(--paper,#fff) 92%,transparent);box-shadow:0 1px 2px #0000001f,0 2px 10px #00000014;-webkit-user-select:none;user-select:none}
.cvk-bar button{display:grid;place-items:center;width:34px;height:34px;padding:0;border:0;border-radius:50%;background:none;color:var(--ink,#1f2a44);cursor:pointer}
.cvk-bar button:hover{background:#0000000d}.cvk-bar button[aria-pressed="true"]{background:#1d4ed81f;color:#1d4ed8}
.cvk-bar button svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.cvk-bar .cvk-dot{width:15px;height:15px;border-radius:50%;background:var(--d);box-shadow:0 0 0 2px var(--paper,#fff)}
.cvk-bar button[aria-pressed="true"] .cvk-dot{box-shadow:0 0 0 2px var(--paper,#fff),0 0 0 4px var(--d)}
.cvk-bar .cvk-more{display:contents}.cvk-bar:not(.is-open) .cvk-more{display:none}
.cvk-bar .cvk-sep{width:18px;height:1px;margin:2px 0;background:#0000001f}
.cvk-bar .is-sure{background:#dc26261f;color:#dc2626}
.cvk-bar .cvk-dot{background:var(--d)}:root[data-theme="dark"] .cvk-bar{--k:#dfe6f5;--kc:#93c5fd;--kr:#fca5a5}:root[data-theme="dark"] .cvk-bar button:hover{background:#ffffff14}:root[data-theme="dark"] .cvk-bar button[aria-pressed="true"]{background:#93c5fd29;color:#93c5fd}
@media (max-width:640px){.cvk-bar{top:8px;right:10px}.cvk-bar button{width:32px;height:32px}}
.cvb-ov.cvk-off .cvk{display:none}.cvk-ovb{display:flex;gap:8px;margin-left:auto}
.cvb.is-ink-hide .cvk{display:none}.cvk-bar button[hidden]{display:none}
.cvk-ovb .is-on{border-color:var(--gold,#c79a2b);background:color-mix(in srgb,var(--gold,#c79a2b) 14%,var(--paper,#fff))}
@media print{.cvk-bar{display:none}body>:not(.cvb-ov){display:none!important}.cvb-ov{position:static;overflow:visible;padding:0;background:none}.cvb-ov-bar{display:none}.cvb-ov-grid{display:block}
.cvb-ov-page{width:auto!important;height:auto!important;margin:0;border-radius:0;box-shadow:none;break-after:page;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.cvb-ov-board{transform:none!important}.cvb-ov-n{display:none}html.nb .cvb-ov .cvb{background-image:none!important;box-shadow:none!important}}`;
  const ICON = {
    pen: '<svg viewBox="0 0 24 24"><path d="M4 20l1.2-4.6L15.8 4.8a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z"/><path d="M14 6.6l3.4 3.4"/></svg>',
    hl: '<svg viewBox="0 0 24 24"><path d="M9 15l-3 3h5l1.5-1.5"/><path d="M9 15l7.5-9.5a2 2 0 0 1 2.9-.3l.4.4a2 2 0 0 1-.3 2.9L12 15.5z"/><path d="M4 21h16" stroke-width="2.6" stroke="#facc15"/></svg>',
    er: '<svg viewBox="0 0 24 24"><path d="M8 20h12"/><path d="M5.5 16.5l9.8-9.8a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L11.5 18.5H8z"/><path d="M10 12l4 4"/></svg>',
    undo: '<svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    clear: '<svg viewBox="0 0 24 24"><path d="M5 7h14"/><path d="M10 4h4"/><path d="M7 7l1 13h8l1-13"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z"/><path d="M12 6.5v13"/></svg>'
  };

  // 狀態：這一課的筆跡、工具、復原
  const S = { id: "", strokes: [], undo: [], on: false, tool: "pen", color: "k", penSeen: false, board: null, layer: null, svg: null, gHl: null, gInk: null, bar: null, w: 1 };
  let all = null;
  const load = () => { if (all) return all; try { all = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (_e) { all = {}; } return all; };
  let saveT = 0;
  const save = () => {
    window.clearTimeout(saveT);
    if (S.bar) mode();
    saveT = window.setTimeout(() => {
      const a = load();
      if (S.strokes.length) a[S.id] = { v: 1, w: S.lw, k: S.w, h: S.cap, s: S.strokes }; else delete a[S.id];
      try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (_e) { /* 滿了：這次不存，畫面上的還在 */ }
    }, 400);
  };

  /* ── 畫 ── */
  // 外框 → path：相鄰兩點的中點當二次曲線的終點（perfect-freehand README 的寫法），小數一位
  function pathOf(pts) {
    if (pts.length < 2) return "";
    const f = (n) => Math.round(n * 10) / 10;
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}Q`;
    for (let i = 0; i < pts.length; i += 1) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      d += `${f(a[0])} ${f(a[1])} ${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2)} `;
    }
    return `${d}Z`;
  }
  function outline(s, done, k = S.w) {
    const opt = s.t === "h" ? HL : PEN;
    const pts = s.p.map((q) => [q[0] * k, q[1] * k, q[2]]);
    return getStroke(pts, { ...opt, size: opt.size * Math.max(0.75, Math.min(1.25, k / 900)), simulatePressure: !s.pr, last: done });
  }
  function draw(s, done) {
    if (!s.el) {
      s.el = document.createElementNS(NS, "path");
      if (s.t !== "h") s.el.setAttribute("class", `cvk-${s.c}`);
      (s.t === "h" ? S.gHl : S.gInk).appendChild(s.el);
    }
    s.el.setAttribute("d", pathOf(outline(s, done)));
  }
  function redraw() {
    if (!S.svg) return;
    S.gHl.replaceChildren();
    S.gInk.replaceChildren();
    S.strokes.forEach((s) => { s.el = null; draw(s, true); });
  }

  /* ── 輸入 ── */
  const pt = (e) => {
    const r = S.layer.getBoundingClientRect();
    const k = S.w;
    const p = [(e.clientX - r.left) / k, (e.clientY - r.top) / k, e.pointerType === "pen" ? Math.max(0.05, e.pressure || 0.5) : 0.5];
    return p.map((n) => Math.round(n * 10000) / 10000);
  };
  let lastInk = 0; // 最後一次在紙上寫／擦的時間：寫字的時候板子不要自己翻頁（course_board.js 的 follow 問 busy()）
  let cur = null; // 正在寫的那一筆：{ s, id, t0, len, last, eraser }
  let raf = 0;
  let eat = false; // 寫過字的那一下：click 吃掉（不要當成點黑板）
  const touches = new Map(); // 手指（兩指捲動）
  let pan = null;
  const writes = (e) => (e.pointerType === "pen" ? true : S.on && !(e.pointerType === "touch" && S.penSeen));
  function down(e) {
    if (e.button > 0 || !S.layer || (e.target.closest && e.target.closest(".cvk-bar"))) return;
    if (e.pointerType === "pen") { S.penSeen = true; mode(); }
    if (e.pointerType === "touch") {
      touches.set(e.pointerId, e.clientY);
      // 第二根手指：剛下的那一筆不算，改成捲動
      if (touches.size >= 2) { if (cur) { cancel(); } pan = { y: avgY(), top: S.board.scrollTop }; return; }
    }
    if (!writes(e)) return;
    const tool = e.pointerType === "pen" && !S.on ? "pen" : S.tool;
    try { S.board.setPointerCapture(e.pointerId); } catch (_e) { /* 舊瀏覽器 */ }
    lastInk = Date.now();
    const p = pt(e);
    cur = { id: e.pointerId, t0: performance.now(), len: 0, last: p, eraser: tool === "er", pen: e.pointerType === "pen", target: e.target };
    if (cur.eraser) { erase(p); return; }
    cur.s = { t: tool === "hl" ? "h" : "p", c: S.color, pr: e.pointerType === "pen" ? 1 : 0, p: [p] };
  }
  const avgY = () => { let t = 0; touches.forEach((y) => { t += y; }); return t / touches.size; };
  function move(e) {
    if (e.pointerType === "touch" && touches.has(e.pointerId)) {
      touches.set(e.pointerId, e.clientY);
      if (pan && touches.size >= 2) { S.board.scrollTop = pan.top - (avgY() - pan.y); return; }
    }
    if (!cur || e.pointerId !== cur.id) return;
    const evs = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
    (evs.length ? evs : [e]).forEach((x) => {
      const p = pt(x);
      cur.len += Math.hypot(p[0] - cur.last[0], p[1] - cur.last[1]) * S.w;
      cur.last = p;
      lastInk = Date.now();
      if (cur.eraser) erase(p); else cur.s.p.push(p);
    });
    if (!cur.eraser && cur.len > 2 && !raf) raf = window.requestAnimationFrame(() => { raf = 0; if (cur && cur.s) draw(cur.s, false); });
  }
  function up(e) {
    if (e.pointerType === "touch") { touches.delete(e.pointerId); if (touches.size < 2) pan = null; }
    if (!cur || e.pointerId !== cur.id) return;
    const c = cur;
    cur = null;
    const tap = c.len < 4 && performance.now() - c.t0 < 350;
    if (c.eraser) { eat = true; return; }
    if (tap) {
      // 點一下不是寫字（點選項、點黑板照常）：觸控筆的 touchstart 被擋掉了（不然會捲），自己對點到的那個補一個 click
      if (c.s.el) c.s.el.remove();
      if (c.pen && c.target && c.target.isConnected) c.target.click();
      return;
    }
    eat = true;
    draw(c.s, true);
    S.strokes.push(c.s);
    S.undo.push({ add: c.s });
    save();
  }
  function cancel() { if (cur && cur.s && cur.s.el) cur.s.el.remove(); cur = null; }
  function erase(p) {
    const r = 12 / S.w;
    const hit = S.strokes.filter((s) => {
      const pad = r + ((s.t === "h" ? HL.size : PEN.size) / 2) / S.w;
      return s.p.some((q, i) => {
        const a = s.p[i - 1] || q;
        const dx = q[0] - a[0];
        const dy = q[1] - a[1];
        const L = dx * dx + dy * dy;
        const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0;
        return Math.hypot(a[0] + t * dx - p[0], a[1] + t * dy - p[1]) < pad;
      });
    });
    if (!hit.length) return;
    hit.forEach((s) => { if (s.el) s.el.remove(); });
    S.strokes = S.strokes.filter((s) => !hit.includes(s));
    S.undo.push({ del: hit });
    save();
  }
  function bind(board) {
    if (board.__cvk) return;
    board.__cvk = true;
    board.addEventListener("pointerdown", down);
    board.addEventListener("pointermove", move);
    board.addEventListener("pointerup", up);
    board.addEventListener("pointercancel", (e) => { if (e.pointerType === "touch") { touches.delete(e.pointerId); pan = null; } if (cur && e.pointerId === cur.id) cancel(); });
    // 寫過字的那一下不是「點黑板 → 下一節」
    board.addEventListener("click", (e) => { if (eat) { eat = false; e.stopPropagation(); e.preventDefault(); } }, true);
    // 觸控筆一碰到就不捲（iPad：touch-action 擋不住 Apple Pencil 的捲動，要擋 touchstart）；手指照常捲
    board.addEventListener("touchstart", (e) => { if ([...e.touches].some((t) => t.touchType === "stylus")) e.preventDefault(); }, { passive: false });
  }

  /* ── 工具列：筆（開關）→ 三色、螢光、橡皮、復原、清掉 ── */
  function mode() {
    if (!S.board) return;
    S.board.classList.toggle("is-ink", S.on);
    S.board.classList.toggle("is-er", S.on && S.tool === "er");
    S.board.classList.toggle("is-ink-touch", S.on && !S.penSeen);
    S.board.classList.toggle("is-ink-hide", Boolean(S.hide));
    if (!S.bar) return;
    S.bar.classList.toggle("is-open", S.on);
    // 眼睛：這一課有寫過才出現
    const eye = S.bar.querySelector('[data-k="hide"]');
    if (eye) eye.hidden = !S.strokes.length && !S.hide;
    S.bar.querySelectorAll("button[data-k]").forEach((b) => {
      const k = b.dataset.k;
      const on = k === "on" ? S.on : k === "hide" ? Boolean(S.hide) : k === "hl" || k === "er" ? S.tool === k : k.startsWith("c-") ? S.tool === "pen" && S.color === k.slice(2) : null;
      if (on !== null) b.setAttribute("aria-pressed", String(on));
    });
    const u = S.bar.querySelector('[data-k="undo"]');
    if (u) u.disabled = !S.undo.length;
  }
  let sureT = 0;
  function act(k, b) {
    if (k === "on") { S.on = !S.on; if (S.on) S.hide = false; }
    // 看乾淨的：先藏起寫的（不刪），再點一下回來；拿起筆就自動顯示
    else if (k === "hide") S.hide = !S.hide;
    // 攤開整本：跟結尾的「攤開整塊黑板」同一個（course_sections 的 course-s-board），那裡可以切乾淨版、列印
    else if (k === "book") {
      const host = document.querySelector("[data-cv2s]");
      if (host) { const go = document.createElement("button"); go.type = "button"; go.dataset.action = "course-s-board"; go.hidden = true; host.appendChild(go); go.click(); go.remove(); }
      return;
    }
    else if (k === "hl" || k === "er") S.tool = k;
    else if (k.startsWith("c-")) { S.tool = "pen"; S.color = k.slice(2); }
    else if (k === "undo") {
      const u = S.undo.pop();
      if (u && u.add) { S.strokes = S.strokes.filter((s) => s !== u.add); if (u.add.el) u.add.el.remove(); }
      if (u && u.del) { S.strokes.push(...u.del); u.del.forEach((s) => { s.el = null; draw(s, true); }); }
      if (u && u.clear) { S.strokes = u.clear; redraw(); }
      save();
    } else if (k === "clear") {
      // 清掉這一課寫的：點兩下（第一下變紅、兩秒內再點才清）；清了還能復原
      if (!b.classList.contains("is-sure")) { b.classList.add("is-sure"); b.setAttribute("aria-label", "再點一下清掉"); window.clearTimeout(sureT); sureT = window.setTimeout(() => { b.classList.remove("is-sure"); b.setAttribute("aria-label", "清掉這一課寫的"); }, 2000); return; }
      b.classList.remove("is-sure");
      b.setAttribute("aria-label", "清掉這一課寫的");
      if (S.strokes.length) { S.undo.push({ clear: S.strokes }); S.strokes = []; redraw(); save(); }
    }
    mode();
  }
  function makeBar() {
    const bar = document.createElement("div");
    bar.className = "cvk-bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "自己寫");
    const btn = (k, label, inner) => `<button type="button" data-k="${k}" aria-label="${label}" title="${label}">${inner}</button>`;
    bar.innerHTML = btn("on", "筆（滑鼠、手指在紙上寫）", ICON.pen) + btn("hide", "藏起我寫的（看乾淨的，不刪）", ICON.eye) + btn("book", "攤開整本筆記（乾淨版、列印／存 PDF）", ICON.book) +
      `<span class="cvk-more"><span class="cvk-sep"></span>${COLORS.map(([c, n]) => btn(`c-${c}`, `${n}筆`, `<span class="cvk-dot" style="--d:var(--k${c === "k" ? "" : c})"></span>`)).join("")}` +
      btn("hl", "螢光筆", ICON.hl) + btn("er", "橡皮擦（擦掉整筆）", ICON.er) + `<span class="cvk-sep"></span>` +
      btn("undo", "復原", ICON.undo) + btn("clear", "清掉這一課寫的", ICON.clear) + "</span>";
    // 工具列在可以點的板子格裡：自己接 click，不往上傳（不然會被當成點黑板）
    bar.addEventListener("click", (e) => { e.stopPropagation(); const b = e.target.closest && e.target.closest("button[data-k]"); if (b) act(b.dataset.k, b); });
    bar.addEventListener("pointerdown", (e) => e.stopPropagation());
    return bar;
  }

  /* ── 掛上去：course_board.js 每次排版完（內容層換新的）與換節時叫；同一個東西叫幾次都一樣 ── */
  function mount(o) {
    if (!o || !o.board || !o.layer) return;
    css();
    S.cap = o.cap || 0;
    S.lw = o.w || 0;
    if (S.id !== o.id) {
      cancel();
      S.id = o.id;
      S.undo = [];
      const rec = load()[o.id];
      S.strokes = rec && Array.isArray(rec.s) ? rec.s.filter((s) => s && Array.isArray(s.p) && s.p.length > 1).map((s) => ({ t: s.t === "h" ? "h" : "p", c: ["k", "c", "r"].includes(s.c) ? s.c : "k", pr: s.pr ? 1 : 0, p: s.p })) : [];
      S.svg = null;
    }
    S.board = o.board;
    bind(o.board);
    const w = o.layer.clientWidth || 1;
    if (!S.svg || S.layer !== o.layer || S.svg.parentNode !== o.layer || w !== S.w) {
      S.layer = o.layer;
      S.w = w;
      if (!S.svg || S.svg.parentNode !== o.layer) {
        S.svg = document.createElementNS(NS, "svg");
        S.svg.setAttribute("class", "cvk");
        S.svg.setAttribute("aria-hidden", "true");
        S.gHl = document.createElementNS(NS, "g");
        S.gHl.setAttribute("class", "cvk-hl");
        S.gInk = document.createElementNS(NS, "g");
        S.svg.append(S.gHl, S.gInk);
        o.layer.appendChild(S.svg);
      }
      redraw();
    }
    if (!S.bar) S.bar = makeBar();
    const home = o.board.parentNode;
    if (home && S.bar.parentNode !== home) home.appendChild(S.bar);
    mode();
  }
  // 離開筆記本（或課）：工具列拿掉，正在寫的那一筆丟掉
  function unmount() { cancel(); if (S.bar) S.bar.remove(); }

  /* ── 攤開整塊黑板（course_board.js 的 overview）：照寫字那時的紙寬（w）與板高（h）排，筆跡畫進那塊的內容層 ── */
  const css = () => { if (!document.getElementById("cvk-style")) { const st = document.createElement("style"); st.id = "cvk-style"; st.textContent = CSS; document.head.appendChild(st); } };
  function meta(id) { const r = load()[id]; return r && Array.isArray(r.s) && r.s.length ? { w: r.w || 0, h: r.h || 0 } : null; }
  function paint(layer, id) {
    const r = load()[id];
    if (!r || !Array.isArray(r.s)) return;
    css();
    const k = r.k || layer.clientWidth || 1;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "cvk");
    svg.setAttribute("aria-hidden", "true");
    const gH = document.createElementNS(NS, "g");
    gH.setAttribute("class", "cvk-hl");
    const gI = document.createElementNS(NS, "g");
    svg.append(gH, gI);
    r.s.forEach((q) => {
      if (!q || !Array.isArray(q.p) || q.p.length < 2) return;
      const p = document.createElementNS(NS, "path");
      if (q.t !== "h") p.setAttribute("class", `cvk-${["k", "c", "r"].includes(q.c) ? q.c : "k"}`);
      p.setAttribute("d", pathOf(outline(q, true, k)));
      (q.t === "h" ? gH : gI).appendChild(p);
    });
    layer.appendChild(svg);
  }
  // 整塊黑板的上方：藏／顯示自己寫的、列印（瀏覽器的「存成 PDF」）
  // 攤開整本的工具列：「我的筆記／乾淨版」（乾淨版＝沒寫過、沒答過的樣子，course_board 重排一次）、列印
  // o = { clean, swap(clean), w, h }：w×h 是一頁的大小，列印時一頁紙就是一頁筆記（@page 跟著設）
  function ovBar(bar, ov, mine, o) {
    css();
    const opt = o || {};
    const btn = (t) => { const b = document.createElement("button"); b.type = "button"; b.className = "button secondary"; b.textContent = t; return b; };
    const g = document.createElement("span");
    g.className = "cvk-ovb";
    if (opt.swap) {
      [[false, mine ? "我的筆記" : "我做的"], [true, "乾淨版"]].forEach(([clean, label]) => {
        const b = btn(label);
        b.classList.toggle("is-on", Boolean(opt.clean) === clean);
        b.setAttribute("aria-pressed", String(Boolean(opt.clean) === clean));
        b.addEventListener("click", () => { if (Boolean(opt.clean) !== clean) opt.swap(clean); });
        g.appendChild(b);
      });
    }
    const pr = btn("列印／存成 PDF");
    pr.addEventListener("click", () => {
      let st = document.getElementById("cvk-page");
      if (!st) { st = document.createElement("style"); st.id = "cvk-page"; document.head.appendChild(st); }
      st.textContent = opt.w && opt.h ? `@page{size:${Math.round(opt.w)}px ${Math.round(opt.h)}px;margin:0}` : "";
      window.print();
    });
    g.appendChild(pr);
    bar.insertBefore(g, bar.lastChild);
  }

  window.BuzzInk = { mount, unmount, meta, paint, ovBar, busy: () => Boolean(cur) || Date.now() - lastInk < 4000, debug: { state: () => ({ id: S.id, n: S.strokes.length, on: S.on, tool: S.tool, color: S.color, penSeen: S.penSeen, undo: S.undo.length }), clearAll: () => { all = {}; try { localStorage.removeItem(KEY); } catch (_e) { /* 無 */ } } } };
})();
