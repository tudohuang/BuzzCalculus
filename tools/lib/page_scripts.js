// 錄影與截圖工具共用的「頁面端」腳本：在 Chrome 裡跑的字串。
// TYPE：打字／點擊／捲動；INK：合成手寫；SEED：14 天的合成紀錄；SHOW_CANVAS：把分享卡疊到畫面上。
"use strict";

// 在頁面裡打字：一個字一個字設 value 並送 input 事件，看起來像真的在打
const TYPE = `
  window.__type = async (selector, text, perChar) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.focus();
    el.value = "";
    for (const ch of text) {
      el.value += ch;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, perChar || 60));
    }
    return true;
  };
  window.__click = (selector) => {
    const el = [...document.querySelectorAll(selector)].find((n) => n.getClientRects().length);
    if (el) el.click();
    return Boolean(el);
  };
  window.__submit = () => {
    const form = document.querySelector('form[data-action="submit-answer"]');
    if (!form) return false;
    if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    return true;
  };
  window.__clickText = (needle) => {
    const el = [...document.querySelectorAll("button, a, [data-action]")].find((n) => n.getClientRects().length && (n.innerText || "").includes(needle));
    if (el) el.click();
    return Boolean(el);
  };
  // 平滑捲動到某個高度（錄影裡要看得到捲的過程）
  window.__scrollTo = async (y, ms) => {
    const from = window.scrollY; const start = performance.now();
    await new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms); const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, from + (y - from) * e);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  };
`;

// 手寫：用折線字形合成筆跡，逐點派 pointer 事件，帶壓感，照真實時間畫。
const INK = `
  window.__ink = async (lines, opts) => {
    const canvas = document.querySelector("[data-blackboard]");
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const G = {
      l: [[[0.5,0.05],[0.46,0.55],[0.44,0.9]]],
      i: [[[0.5,0.4],[0.5,0.9]],[[0.5,0.22],[0.51,0.24]]],
      m: [[[0.08,0.9],[0.12,0.45],[0.28,0.38],[0.42,0.5],[0.46,0.9]],[[0.46,0.55],[0.62,0.38],[0.78,0.48],[0.84,0.9]]],
      s: [[[0.78,0.48],[0.6,0.38],[0.35,0.46],[0.52,0.6],[0.72,0.74],[0.55,0.9],[0.25,0.84]]],
      n: [[[0.15,0.9],[0.18,0.45],[0.34,0.38],[0.58,0.48],[0.68,0.9]]],
      x: [[[0.15,0.4],[0.8,0.9]],[[0.8,0.4],[0.15,0.9]]],
      "/": [[[0.72,0.15],[0.3,0.95]]],
      "=": [[[0.15,0.55],[0.85,0.55]],[[0.15,0.72],[0.85,0.72]]],
      "1": [[[0.3,0.3],[0.5,0.15],[0.5,0.9]]],
      "0": [[[0.5,0.18],[0.3,0.3],[0.25,0.55],[0.32,0.85],[0.5,0.92],[0.7,0.82],[0.75,0.55],[0.68,0.28],[0.5,0.18]]],
      ">": [[[0.15,0.35],[0.8,0.6],[0.15,0.85]]],
      "<": [[[0.8,0.35],[0.15,0.6],[0.8,0.85]]],
      "-": [[[0.15,0.62],[0.85,0.62]]],
      " ": []
    };
    const move = "onpointerrawupdate" in canvas ? "pointerrawupdate" : "pointermove";
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    const send = (type, x, y, pressure, id) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: id, pointerType: "pen", pressure, isPrimary: true,
      clientX: rect.left + x, clientY: rect.top + y
    }));
    let id = 700;
    const jitter = () => (Math.random() - 0.5) * 1.2;
    for (const line of lines) {
      const size = line.size * rect.height;
      let cx = line.x * rect.width; const cy = line.y * rect.height;
      for (const ch of line.text) {
        const strokes = G[ch] || [];
        for (const stroke of strokes) {
          id += 1;
          const pts = [];
          for (let k = 0; k < stroke.length - 1; k += 1) {
            const [x0, y0] = stroke[k]; const [x1, y1] = stroke[k + 1];
            const steps = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) * 14));
            for (let t = 0; t <= steps; t += 1) {
              const u = t / steps;
              pts.push([cx + (x0 + (x1 - x0) * u) * size * 0.75 + jitter(), cy + (y0 + (y1 - y0) * u) * size + jitter()]);
            }
          }
          send("pointerdown", pts[0][0], pts[0][1], 0.35, id);
          for (let k = 1; k < pts.length; k += 1) {
            const p = 0.3 + 0.45 * Math.sin((k / pts.length) * Math.PI);
            send(move, pts[k][0], pts[k][1], p, id);
            if (k % 3 === 0) await frame();
          }
          send("pointerup", pts[pts.length - 1][0], pts[pts.length - 1][1], 0.3, id);
          await new Promise((r) => setTimeout(r, 70));
        }
        cx += size * (ch === " " ? 0.45 : ch === "i" || ch === "l" || ch === "1" ? 0.5 : 0.8);
      }
      await new Promise((r) => setTimeout(r, opts && opts.linePause || 250));
    }
    return true;
  };
`;

// 合成 14 天的練習紀錄：數據頁、地圖、分享卡要有東西看。
const SEED = `
  const problems = window.BUZZ_PROBLEMS.filter((p) => ["numeric", "expression", "antiderivative"].includes(p.answerKind) && Number(p.rank || p.difficulty || 1) <= 4);
  let seed = 20260917; const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const history = [];
  const DAY = 86400000; const now = Date.now();
  for (let day = 14; day >= 1; day -= 1) {
    if (day === 6 || day === 11) continue; // 兩天沒練，連勝不用滿
    const sessions = 1 + (rand() < 0.5 ? 1 : 0);
    for (let s = 0; s < sessions; s += 1) {
      const answers = [];
      const n = 5 + Math.floor(rand() * 4);
      for (let i = 0; i < n; i += 1) {
        const p = problems[Math.floor(rand() * problems.length)];
        const rank = Number(p.rank || p.difficulty || 1);
        const skill = 0.62 + (14 - day) * 0.018; // 越近越熟
        const correct = rand() < skill - (rank - 2) * 0.08;
        const limit = Number(p.timeLimit || 60);
        answers.push({ problemId: p.id, correct, unanswered: false, assisted: false, hintsUsed: 0,
          elapsed: Math.round(limit * (0.25 + rand() * (correct ? 0.5 : 0.8))), errorTag: correct ? "" : ["sign", "chain-rule", "algebra", ""][Math.floor(rand() * 4)] });
      }
      const finishedAt = new Date(now - day * DAY - Math.floor(rand() * 6) * 3600000).toISOString();
      history.push({ id: "seed-" + day + "-" + s, mode: "quick", practice: false, finishedAt, answers });
    }
  }
  localStorage.setItem("buzzcalculus.records.v1", JSON.stringify({
    onboardingSeen: true, settings: { difficultyCap: 6 }, history,
    placement: { rank: 3, date: new Date(now - 13 * DAY).toISOString(), weakTag: "chain-rule" }
  }));
  return history.length;
`;

// 成就分享卡在沒有系統分享的環境會直接下載；錄影要看到卡片本身，
// 所以把畫好的 canvas 疊到畫面上。只在錄影用，不動產品程式。
const SHOW_CANVAS = `
  const orig = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const c = this;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;display:grid;place-items:center;background:rgba(30,28,22,.55);z-index:9999;opacity:0;transition:opacity .35s";
    const img = document.createElement("img");
    img.src = c.toDataURL("image/png");
    img.style.cssText = "width:min(72vw,760px);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.45);transform:scale(.92);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)";
    wrap.appendChild(img); document.body.appendChild(wrap);
    requestAnimationFrame(() => { wrap.style.opacity = "1"; img.style.transform = "scale(1)"; });
    cb(null);
  };
  return 1;
`;


module.exports = { TYPE, INK, SEED, SHOW_CANVAS };
