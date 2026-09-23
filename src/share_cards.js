// 從 app.js 搬出去的獨立畫面片段：本週戰報與成就分享卡（canvas 畫 PNG，全部本地），
// 以及題目圖形的 SVG 渲染器（2026-09-21 搬來：script 標籤預算滿了，不開新檔）。
//
// 從 app.js 搬出來（2026-09-16）：app.js 預算到頂，而畫圖這種東西本來就不該住在主程式。
// 資料一律不出裝置：圖在本機畫、本機下載或走系統分享，分不分享由使用者決定。
// 用法：const shareCards = window.BuzzShareCards.create({ loadRecords, showAppNotice, trackEvent,
//   abilityProfile, activityCounts, practiceStreakInfo, activeDaysInLastWeek, localDateKey,
//   activityLevel, xpLevelInfo, siteUrl });

(function () {
  "use strict";

  function create(deps) {
    const { loadRecords, showAppNotice, abilityProfile, activityCounts, practiceStreakInfo, activeDaysInLastWeek, localDateKey, activityLevel, xpLevelInfo, siteUrl, problemById, problemRank, topicLabel } = deps;

    // 今天答對的題裡最硬的一題：純數字的卡沒有梗，「今天啃下 R5」才有人想試
    function hardestToday(records) {
      const today = localDateKey(new Date());
      let best = null;
      (records.history || []).forEach((session) => {
        if (!session || !session.finishedAt || localDateKey(new Date(session.finishedAt)) !== today) return;
        (session.answers || []).forEach((answer) => {
          if (!answer || !answer.correct) return;
          const problem = problemById(answer.problemId);
          if (!problem) return;
          const rank = problemRank(problem);
          if (!best || rank > best.rank || (rank === best.rank && answer.elapsed < best.elapsed)) {
            best = { rank, elapsed: Number(answer.elapsed || 0), topic: topicLabel(problem.topic) };
          }
        });
      });
      return best;
    }

    // ── 本週戰報（Canvas 生成 PNG，全部本地）──────────────────────
    //
    // 成長要「可見、可分享」才會變成留存與獲客 —— 但資料一律不出裝置：
    // 圖在本機 canvas 畫、本機下載，分不分享由使用者自己決定。
    function weeklyShareData(records) {
      const cutoff = Date.now() - 7 * 86400000;
      let answered = 0;
      let correctCount = 0;
      let seconds = 0;
      (records.history || []).forEach((session) => {
        const at = Date.parse(session.finishedAt || "");
        if (!Number.isFinite(at) || at < cutoff) return;
        (session.answers || []).forEach((answer) => {
          answered += 1;
          if (answer.correct) correctCount += 1;
          seconds += Number(answer.elapsed || 0);
        });
      });
      const profile = abilityProfile(records);
      const counts = activityCounts(records);
      const streak = practiceStreakInfo(records, counts);
      return {
        answered,
        accuracy: answered ? Math.round((correctCount / answered) * 100) : 0,
        minutes: Math.round(seconds / 60),
        days: activeDaysInLastWeek(records),
        streak: streak.streak || 0,
        trend: profile && profile.trend ? profile.trend.d7 : null,
        up: profile && profile.trend ? profile.trend.fastestUp : null,
        counts
      };
    }

    function downloadWeeklyReport() {
      const records = loadRecords();
      const data = weeklyShareData(records);
      if (!data.answered) {
        showAppNotice("這七天還沒有作答紀錄 —— 先練一場再來領戰報。");
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const ui = "'Segoe UI', 'Noto Sans TC', system-ui, sans-serif";

      // 底：米紙色 + 頂部金帶（跟 app 同一套視覺語言）
      ctx.fillStyle = "#f5f3ed";
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = "#e4b447";
      ctx.fillRect(0, 0, 1080, 14);

      ctx.fillStyle = "#20211f";
      ctx.font = `800 54px ${ui}`;
      ctx.fillText("BuzzCalculus 週報", 72, 128);
      ctx.fillStyle = "#6d6a60";
      ctx.font = `600 30px ${ui}`;
      const end = new Date();
      const start = new Date(end.getTime() - 6 * 86400000);
      const dateOf = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
      ctx.fillText(`${dateOf(start)} – ${dateOf(end)}`, 72, 180);

      const stat = (x, y, value, label) => {
        ctx.fillStyle = "#20211f";
        ctx.font = `800 96px ${ui}`;
        ctx.fillText(String(value), x, y);
        ctx.fillStyle = "#6d6a60";
        ctx.font = `700 32px ${ui}`;
        ctx.fillText(label, x, y + 48);
      };
      stat(72, 340, data.answered, "題");
      stat(400, 340, `${data.accuracy}%`, "正確率");
      stat(732, 340, data.minutes, "分鐘");
      stat(72, 540, data.days, "天有練");
      stat(400, 540, data.streak, "連勝天數");
      if (data.trend !== null) stat(732, 540, `${data.trend > 0 ? "+" : ""}${data.trend}`, "能力變化（7 天）");

      if (data.up) {
        ctx.fillStyle = "#14663f";
        ctx.font = `800 40px ${ui}`;
        ctx.fillText(`本週進步最快：${data.up.label} +${data.up.delta}`, 72, 700);
      }

      // 七天熱力條
      const todayKeyLocal = new Date();
      todayKeyLocal.setHours(12, 0, 0, 0);
      for (let index = 6; index >= 0; index -= 1) {
        const day = new Date(todayKeyLocal.getTime() - index * 86400000);
        const count = data.counts[localDateKey(day)] || 0;
        const level = activityLevel(count);
        const x = 72 + (6 - index) * 140;
        ctx.fillStyle = ["#e8e4d8", "#f2d9a0", "#eec564", "#e4b447", "#b28d21"][level] || "#e8e4d8";
        ctx.beginPath();
        ctx.roundRect(x, 780, 120, 120, 18);
        ctx.fill();
        ctx.fillStyle = "#6d6a60";
        ctx.font = `700 26px ${ui}`;
        ctx.fillText(dateOf(day), x + 18, 940);
      }

      ctx.fillStyle = "#20211f";
      ctx.font = `700 34px ${ui}`;
      ctx.fillText("每一題的答案都經過獨立數值驗算。", 72, 1180);
      ctx.fillStyle = "#6d6a60";
      ctx.font = `600 30px ${ui}`;
      ctx.fillText("buzz-calculus.vercel.app", 72, 1240);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `buzzcalculus-week-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      }, "image/png");
    }

    // ── 成就分享卡（Canvas 生成 PNG，全部本地）───────────────────
    //
    // 連勝與 XP 只在自己的首頁上看得到的話，它們什麼都不是 —— 它們的意義是「拿去給人看」。
    // 圖在本機畫；手機能走系統分享（navigator.share 帶檔案，直接進 IG／LINE），
    // 不行就下載 PNG。資料一律不出裝置，跟週報同一套原則。
    function achievementShareData(records) {
      const counts = activityCounts(records);
      const streak = practiceStreakInfo(records, counts);
      const level = xpLevelInfo(records.xp);
      const answered = Number(records.totalAnswered || 0);
      const correct = Number(records.totalCorrect || 0);
      return {
        streak: streak.streak || 0,
        level: level.level,
        xp: Math.max(0, Math.floor(Number(records.xp) || 0)),
        answered,
        accuracy: answered ? Math.round((correct / answered) * 100) : 0,
        week: weeklyShareData(records),
        today: hardestToday(records)
      };
    }

    function drawAchievementCard(data) {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const ui = "'Segoe UI', 'Noto Sans TC', system-ui, sans-serif";
      // 深底金字：社群動態牆上米紙色會糊掉，深色卡才跳得出來
      ctx.fillStyle = "#20211f";
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = "#e4b447";
      ctx.fillRect(0, 0, 1080, 14);

      ctx.fillStyle = "#f5f3ed";
      ctx.font = `800 54px ${ui}`;
      ctx.fillText("BuzzCalculus", 72, 128);
      ctx.fillStyle = "#b8b3a4";
      ctx.font = `600 30px ${ui}`;
      const today = new Date();
      ctx.fillText(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} · 微積分反射訓練`, 72, 180);

      ctx.fillStyle = "#e4b447";
      ctx.font = `800 210px ${ui}`;
      ctx.fillText(`Lv.${data.level}`, 64, 470);
      ctx.fillStyle = "#f5f3ed";
      ctx.font = `700 40px ${ui}`;
      ctx.fillText(`${data.xp} XP`, 72, 540);

      const stat = (x, y, value, label) => {
        ctx.fillStyle = "#f5f3ed";
        ctx.font = `800 96px ${ui}`;
        ctx.fillText(String(value), x, y);
        ctx.fillStyle = "#b8b3a4";
        ctx.font = `700 32px ${ui}`;
        ctx.fillText(label, x, y + 48);
      };
      stat(72, 760, data.streak, "天連勝");
      stat(400, 760, data.answered, "題累計");
      stat(732, 760, `${data.accuracy}%`, "正確率");
      stat(72, 960, data.week.answered, "本週題數");
      stat(400, 960, data.week.days, "本週有練的天數");
      stat(732, 960, data.week.minutes, "本週分鐘");

      if (data.today) {
        ctx.fillStyle = "#e4b447";
        ctx.font = `800 40px ${ui}`;
        ctx.fillText(`今天啃下的最硬一題：R${data.today.rank} ${data.today.topic}${data.today.elapsed ? ` · ${data.today.elapsed} 秒` : ""}`, 72, 1100);
      }

      ctx.fillStyle = "#f5f3ed";
      ctx.font = `700 34px ${ui}`;
      ctx.fillText("每一題的答案都經過獨立數值驗算。", 72, 1180);
      ctx.fillStyle = "#b8b3a4";
      ctx.font = `600 30px ${ui}`;
      ctx.fillText("buzz-calculus.vercel.app", 72, 1240);
      return canvas;
    }

    function downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    }

    function shareAchievementCard(from) {
      const records = loadRecords();
      const data = achievementShareData(records);
      if (!data.answered) {
        showAppNotice("還沒有作答紀錄 —— 先練一場，卡片才有東西可以秀。");
        return;
      }
      const canvas = drawAchievementCard(data);
      if (!canvas) return;
      const fileName = `buzzcalculus-lv${data.level}-${new Date().toISOString().slice(0, 10)}.png`;
      canvas.toBlob((blob) => {
        if (!blob) return;
        const nav = window.navigator;
        const file = typeof File === "function" ? new File([blob], fileName, { type: "image/png" }) : null;
        if (file && nav && typeof nav.share === "function" && typeof nav.canShare === "function" && nav.canShare({ files: [file] })) {
          nav.share({ files: [file], title: "BuzzCalculus", text: `Lv.${data.level} · 連勝 ${data.streak} 天 · ${siteUrl()}` })
            .catch(() => { /* 使用者取消分享：不下載、不吵 */ });
          return;
        }
        downloadBlob(blob, fileName);
        showAppNotice("成就卡已存成 PNG，貼到 IG 或群組吧。");
      }, "image/png");
    }

    // 分享一張圖：手機走系統分享（帶檔案與文字），不行就下載 PNG 並呼叫 onFallback（例如順便複製文字）
    function shareCanvas(canvas, fileName, text, onFallback) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const nav = window.navigator;
        const file = typeof File === "function" ? new File([blob], fileName, { type: "image/png" }) : null;
        if (file && nav && typeof nav.share === "function" && typeof nav.canShare === "function" && nav.canShare({ files: [file] })) {
          nav.share({ files: [file], title: "BuzzCalculus", text }).catch(() => { /* 使用者取消 */ });
          return;
        }
        downloadBlob(blob, fileName);
        if (onFallback) onFallback();
      }, "image/png");
    }

    // ── 每日一題成績卡：跟 Wordle 一樣，一張圖就說完 ──
    // data = { dateKey, emoji, rank, elapsed, correct, streak, text }
    function shareDailyOneCard(data, onFallback) {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const ui = "'Segoe UI', 'Noto Sans TC', 'Segoe UI Emoji', 'Apple Color Emoji', system-ui, sans-serif";
      ctx.fillStyle = "#20211f";
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.fillStyle = "#e4b447";
      ctx.fillRect(0, 0, 1080, 14);
      ctx.fillStyle = "#f5f3ed";
      ctx.font = `800 54px ${ui}`;
      ctx.fillText("BuzzCalculus 每日一題", 72, 128);
      ctx.fillStyle = "#b8b3a4";
      ctx.font = `600 34px ${ui}`;
      ctx.fillText(data.dateKey, 72, 184);
      ctx.font = `700 180px ${ui}`;
      ctx.fillStyle = "#f5f3ed";
      ctx.fillText(data.emoji, 64, 470);
      ctx.fillStyle = "#e4b447";
      ctx.font = `800 72px ${ui}`;
      ctx.fillText(data.correct ? `R${data.rank} · ${data.elapsed} 秒` : `R${data.rank} · 明天再來`, 72, 620);
      if (data.streak > 1) {
        ctx.fillStyle = "#f5f3ed";
        ctx.font = `700 48px ${ui}`;
        ctx.fillText(`🔥 連續 ${data.streak} 天`, 72, 720);
      }
      ctx.fillStyle = "#f5f3ed";
      ctx.font = `700 34px ${ui}`;
      ctx.fillText("全站同一題，一天一次。你來試試？", 72, 900);
      ctx.fillStyle = "#b8b3a4";
      ctx.font = `600 30px ${ui}`;
      ctx.fillText("buzz-calculus.vercel.app", 72, 960);
      shareCanvas(canvas, `buzzcalculus-daily-${data.dateKey}.png`, data.text, onFallback);
    }

    return { weeklyShareData, downloadWeeklyReport, shareAchievementCard, shareDailyOneCard };
  }

  window.BuzzShareCards = { create };
})();

/* ── 題目圖形：problem.graph → inline SVG（座標軸、格線、折線、函數曲線、塗色區域、點與標籤） ──
   純函式：只讀 problem.graph 與 opts，escapeAttr 由呼叫端傳進來。互動（點位、拖切線）的覆蓋層由 opts.overlay 給。 */
(function () {
  "use strict";

  function graphCurveFn(expr) {
    const cleaned = String(expr || "");
    if (!/^[0-9x+\-*/().,^\sa-z]*$/i.test(cleaned)) return null;
    try {
      const body = `"use strict"; const {sin,cos,tan,asin,acos,atan,log,exp,sqrt,abs,pow,sinh,cosh,tanh,PI,E}=Math; return (${cleaned.replace(/\^/g, "**")});`;
      const fn = new Function("x", body);
      // 探針不能只戳 x=1：1/(x−1) 在那裡是 ∞，會被當成壞式子（作圖題實測抓到）。
      // 三個點都是 ±∞ 才算壞。
      const probes = [1, 0.37, 2.61].map(fn);
      if (probes.every((probe) => !Number.isFinite(probe) && !Number.isNaN(probe))) return null;
      return fn;
    } catch (error) {
      return null;
    }
  }

  function renderProblemGraph(problem, opts, escapeAttr) {
    opts = opts || {};
    const graph = problem && problem.graph;
    if (!graph || !Array.isArray(graph.window) || graph.window.length !== 4) return "";
    const [xmin, xmax, ymin, ymax] = graph.window.map(Number);
    if (!(xmax > xmin) || !(ymax > ymin)) return "";
    const width = 320;
    const height = 220;
    const pad = 18;
    const sx = (x) => pad + ((x - xmin) / (xmax - xmin)) * (width - 2 * pad);
    const sy = (y) => height - pad - ((y - ymin) / (ymax - ymin)) * (height - 2 * pad);
    const parts = [];
    const gridStep = (range) => (range <= 8 ? 1 : range <= 16 ? 2 : range <= 40 ? 5 : 10);
    const gx = gridStep(xmax - xmin);
    const gy = gridStep(ymax - ymin);
    for (let x = Math.ceil(xmin / gx) * gx; x <= xmax + 1e-9; x += gx) {
      parts.push(`<line x1="${sx(x)}" y1="${sy(ymin)}" x2="${sx(x)}" y2="${sy(ymax)}" stroke="var(--line)" stroke-width="1"/>`);
      if (Math.abs(x) > 1e-9) parts.push(`<text x="${sx(x)}" y="${sy(0) + 12}" font-size="9" text-anchor="middle" fill="var(--muted)">${x}</text>`);
    }
    for (let y = Math.ceil(ymin / gy) * gy; y <= ymax + 1e-9; y += gy) {
      parts.push(`<line x1="${sx(xmin)}" y1="${sy(y)}" x2="${sx(xmax)}" y2="${sy(y)}" stroke="var(--line)" stroke-width="1"/>`);
      if (Math.abs(y) > 1e-9) parts.push(`<text x="${sx(0) - 5}" y="${sy(y) + 3}" font-size="9" text-anchor="end" fill="var(--muted)">${y}</text>`);
    }
    if (ymin <= 0 && ymax >= 0) parts.push(`<line x1="${sx(xmin)}" y1="${sy(0)}" x2="${sx(xmax)}" y2="${sy(0)}" stroke="var(--line-strong)" stroke-width="1.4"/>`);
    if (xmin <= 0 && xmax >= 0) parts.push(`<line x1="${sx(0)}" y1="${sy(ymin)}" x2="${sx(0)}" y2="${sy(ymax)}" stroke="var(--line-strong)" stroke-width="1.4"/>`);
    const strokes = ["var(--blue)", "var(--red)", "var(--green)", "var(--violet)"];
    const toPath = (pts) => pts.map((pt, i) => `${i ? "L" : "M"}${sx(pt[0]).toFixed(1)},${sy(pt[1]).toFixed(1)}`).join(" ");
    // 塗色區域（面積題）：{ pts } 是多邊形頂點，或 { expr, from, to } 是曲線與 x 軸之間的區域
    (graph.fills || []).forEach((fill) => {
      let pts = Array.isArray(fill.pts) ? fill.pts.slice() : null;
      if (!pts && fill.expr) {
        const fn = graphCurveFn(fill.expr);
        const a = Number(fill.from); const b = Number(fill.to);
        if (fn && Number.isFinite(a) && Number.isFinite(b)) {
          pts = [[a, 0]];
          for (let i = 0; i <= 80; i += 1) { const x = a + ((b - a) * i) / 80; const y = fn(x); if (Number.isFinite(y)) pts.push([x, Math.max(ymin, Math.min(ymax, y))]); }
          pts.push([b, 0]);
        }
      }
      if (!pts || pts.length < 3) return;
      parts.push(`<path d="${toPath(pts)} Z" fill="${fill.color || "var(--blue)"}" fill-opacity="0.16" stroke="none"/>`);
    });
    (graph.polylines || []).forEach((pts, index) => {
      if (!Array.isArray(pts) || pts.length < 2) return;
      parts.push(`<path d="${toPath(pts)}" fill="none" stroke="${strokes[index % strokes.length]}" stroke-width="2.2" stroke-linejoin="round"/>`);
    });
    (graph.dashed || []).forEach((pts) => {
      if (!Array.isArray(pts) || pts.length < 2) return;
      parts.push(`<path d="${toPath(pts)}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="5 4"/>`);
    });
    // 作圖題：作答時格子是空的（曲線由作答層疊上去），題庫預覽也是空的（畫出來就是答案）；
    // 只有 opts.reveal 的地方（錯題本回顧）把正解曲線照 pieces 一段一段畫出來（分段畫才不會把漸近線兩側連起來）。
    const sketchCurves = problem.sketch && problem.sketch.expr && opts.reveal && window.BuzzGraphSketch
      ? window.BuzzGraphSketch.piecesOf(problem).map((piece) => ({ expr: problem.sketch.expr, domain: piece }))
      : [];
    (graph.curves || []).concat(sketchCurves).forEach((curve, index) => {
      const fn = graphCurveFn(curve && curve.expr);
      if (!fn) return;
      const [a, b] = Array.isArray(curve.domain) ? curve.domain.map(Number) : [xmin, xmax];
      const pts = [];
      const steps = 160;
      for (let i = 0; i <= steps; i += 1) {
        const x = a + ((b - a) * i) / steps;
        const y = fn(x);
        if (Number.isFinite(y) && y >= ymin - 1 && y <= ymax + 1) pts.push([x, Math.max(ymin, Math.min(ymax, y))]);
      }
      if (pts.length > 1) parts.push(`<path d="${toPath(pts)}" fill="none" stroke="${strokes[(index + (graph.polylines || []).length) % strokes.length]}" stroke-width="2.2"/>`);
    });
    (graph.points || []).forEach((point) => {
      if (!point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return;
      const open = point.open === true;
      parts.push(`<circle cx="${sx(point.x)}" cy="${sy(point.y)}" r="3.4" fill="${open ? "var(--panel)" : "var(--blue)"}" stroke="var(--blue)" stroke-width="1.6"/>`);
    });
    (graph.labels || []).forEach((label) => {
      if (!label || typeof label.text !== "string") return;
      parts.push(`<text x="${sx(label.x)}" y="${sy(label.y)}" font-size="11" fill="var(--ink)">${escapeAttr(label.text)}</text>`);
    });
    if (typeof opts.overlay === "function") {
      parts.push(opts.overlay({ sx, sy, xmin, xmax, ymin, ymax }) || "");
    } else if (opts.overlay) {
      parts.push(opts.overlay);
    }
    // 互動圖把座標窗與內距寫在 svg 上，讓 pointer 事件能把
    // 螢幕座標換算回數學座標 —— 這是唯一一份轉換參數，不能散落兩處。
    const interactiveAttrs = opts.interactive
      ? ` data-graph-interactive="${opts.interactive}" data-graph-window="${[xmin, xmax, ymin, ymax].join(",")}" data-graph-pad="${pad}" data-graph-size="${width},${height}"`
      : "";
    return `
      <div class="problem-graph ${opts.interactive ? "is-interactive" : ""}">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="題目附圖"${interactiveAttrs}>${parts.join("")}</svg>
      </div>
    `;
  }

  // 迷你繪圖。跟 renderProblemGraph 共用座標與格線的邏輯，
  // 但尺寸小、不畫刻度數字 —— 四張並排的時候刻度只會變成雜訊。
  function renderMiniGraph(expr, windowSpec, domainSpec) {
    const win = Array.isArray(windowSpec) && windowSpec.length === 4 ? windowSpec.map(Number) : [-4, 4, -4, 4];
    const [xmin, xmax, ymin, ymax] = win;
    if (!(xmax > xmin) || !(ymax > ymin)) return "";
    const fn = graphCurveFn(expr);
    if (!fn) return "";
    const width = 150;
    const height = 118;
    const pad = 6;
    const sx = (x) => pad + ((x - xmin) / (xmax - xmin)) * (width - 2 * pad);
    const sy = (y) => height - pad - ((y - ymin) / (ymax - ymin)) * (height - 2 * pad);
    const parts = [];
    if (ymin <= 0 && ymax >= 0) {
      parts.push(`<line x1="${sx(xmin)}" y1="${sy(0)}" x2="${sx(xmax)}" y2="${sy(0)}" stroke="var(--line-strong)" stroke-width="1"/>`);
    }
    if (xmin <= 0 && xmax >= 0) {
      parts.push(`<line x1="${sx(0)}" y1="${sy(ymin)}" x2="${sx(0)}" y2="${sy(ymax)}" stroke="var(--line-strong)" stroke-width="1"/>`);
    }
    // 曲線可能在窗內斷開（極點、定義域邊界）。斷了就開新的一段，
    // 不要用一條直線把兩支接起來 —— 那會把漸近線畫成穿過去，
    // 而「有沒有穿過去」正是這類題目要看的。
    const [a, b] = Array.isArray(domainSpec) && domainSpec.length === 2 ? domainSpec.map(Number) : [xmin, xmax];
    const steps = 220;
    const segments = [];
    let current = [];
    for (let i = 0; i <= steps; i += 1) {
      const x = a + ((b - a) * i) / steps;
      const y = fn(x);
      if (Number.isFinite(y) && y >= ymin && y <= ymax) {
        current.push([x, y]);
      } else {
        if (current.length > 1) segments.push(current);
        current = [];
      }
    }
    if (current.length > 1) segments.push(current);
    segments.forEach((pts) => {
      const path = pts.map((pt, i) => `${i ? "L" : "M"}${sx(pt[0]).toFixed(1)},${sy(pt[1]).toFixed(1)}`).join(" ");
      parts.push(`<path d="${path}" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linejoin="round"/>`);
    });
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="候選圖形">${parts.join("")}</svg>`;
  }

  // 螢幕座標 → 數學座標。轉換參數（窗、內距、畫布大小）由
  // renderProblemGraph 寫在 svg 的 data-* 上，這裡只做反運算。
  function svgGraphContext(svg) {
    const win = String(svg.dataset.graphWindow || "").split(",").map(Number);
    const size = String(svg.dataset.graphSize || "").split(",").map(Number);
    const pad = Number(svg.dataset.graphPad);
    if (win.length !== 4 || size.length !== 2 || !Number.isFinite(pad)) return null;
    const [xmin, xmax, ymin, ymax] = win;
    const [width, height] = size;
    return {
      xmin, xmax, ymin, ymax,
      toMath(event) {
        const rect = svg.getBoundingClientRect();
        const u = ((event.clientX - rect.left) / rect.width) * width;
        const v = ((event.clientY - rect.top) / rect.height) * height;
        return {
          x: xmin + ((u - pad) / (width - 2 * pad)) * (xmax - xmin),
          y: ymin + ((height - pad - v) / (height - 2 * pad)) * (ymax - ymin)
        };
      },
      sx: (x) => pad + ((x - xmin) / (xmax - xmin)) * (width - 2 * pad),
      sy: (y) => height - pad - ((y - ymin) / (ymax - ymin)) * (height - 2 * pad)
    };
  }

  // 題目的曲線函數：有 curves 就編譯式子；折線題（角點、由 f′ 圖找 f 的極值）點到的位置吸附到折線上
  function graphProblemFn(problem) {
    const curve = problem.graph && (problem.graph.curves || [])[0];
    if (curve) return graphCurveFn(curve.expr);
    // 折線題（角點、由 f′ 圖找 f 的極值）：點到的位置吸附到折線上
    const pts = problem.graph && (problem.graph.polylines || [])[0];
    if (!Array.isArray(pts) || pts.length < 2) return null;
    return (x) => {
      for (let i = 0; i + 1 < pts.length; i += 1) {
        const [x0, y0] = pts[i]; const [x1, y1] = pts[i + 1];
        if (x >= x0 - 1e-9 && x <= x1 + 1e-9) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      }
      return NaN;
    };
  }

  /* 能力雷達圖：六軸、量好的分數進來就畫。純函式 —— 分數怎麼算是 app.js 的事（能力模型），
     這裡只負責把它變成 SVG。escapeHtml／escapeAttr 由呼叫端傳進來。 */
  function renderMasteryRadar(axes, helpers) {
    const escapeHtml = helpers.escapeHtml;
    const escapeAttr = helpers.escapeAttr;
    const measured = axes.filter((axis) => axis.score !== null);
    const n = Math.max(3, axes.length);
    const cx = 140;
    const cy = 120;
    const radius = 80;
    const point = (index, r) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    };
    const ringPoints = (frac) => axes
      .map((_, index) => point(index, radius * frac).map((value) => value.toFixed(1)).join(","))
      .join(" ");
    const rings = [0.25, 0.5, 0.75, 1]
      .map((frac) => `<polygon class="radar-ring" points="${ringPoints(frac)}"></polygon>`)
      .join("");
    const spokes = axes
      .map((_, index) => {
        const [x, y] = point(index, radius);
        return `<line class="radar-spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
      })
      .join("");
    const dataPoints = axes
      .map((axis, index) => point(index, radius * ((axis.score || 0) / 100)).map((value) => value.toFixed(1)).join(","))
      .join(" ");
    const dots = axes
      .map((axis, index) => {
        if (axis.score === null) return "";
        const [x, y] = point(index, radius * (axis.score / 100));
        return `<circle class="radar-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"></circle>`;
      })
      .join("");
    // 「未測」改成進度。對一個練了兩週的人顯示一圈灰字「未測」，
    // 讀起來像功能沒做；「差 3 題」告訴他離亮起來多近、而且暗示怎麼讓它亮。
    // 軸要 12 次加權作答才算測準（kernel 的 MIN_CONFIDENCE_W）；
    // legacy fallback 沒有 confidence 欄位，那條路維持舊字。
    const remainingFor = (axis) => {
      if (axis.confidence === undefined) return null;
      if (axis.stale) return null;
      const weight = Number(axis.n || 0);
      return Math.max(1, Math.ceil(12 - weight));
    };
    const emptyText = (axis) => {
      if (axis.confidence === undefined) return "未測";
      // stale = 碰過但信心不足 —— 可能是樣本太少，也可能是太久沒練衰減。
      // 對註冊第一天的人寫「該重測」像在指控他偷懶（實測回報原話：
      // 「這些技巧我從來沒被測過」）。「還測不準」兩種原因都誠實。
      if (axis.stale) return "還測不準";
      const remaining = remainingFor(axis);
      return remaining >= 12 ? "未測" : `差 ${remaining} 題`;
    };
    const labels = axes
      .map((axis, index) => {
        const [x, y] = point(index, radius + 16);
        const anchor = Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
        const scoreText = axis.score === null ? emptyText(axis) : String(axis.score);
        return `
          <g class="radar-label ${axis.score === null ? "is-empty" : ""}">
            <title>${escapeHtml(axis.label)}：${axis.score === null ? `${emptyText(axis)}（答滿 12 題就會亮起來）` : `${axis.score} 分`}</title>
            <text x="${x.toFixed(1)}" y="${(y - 1).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(axis.label)}</text>
            <text class="radar-score" x="${x.toFixed(1)}" y="${(y + 11).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(scoreText)}</text>
          </g>`;
      })
      .join("");

    // 收尾行是一顆可以按的處方，不是一句評語。
    // 優先序：最弱的已測軸 > 最接近亮起來的未測軸 > 從頭開始。
    const weakest = measured.slice().sort((a, b) => a.score - b.score)[0] || null;
    const nearest = axes
      .filter((axis) => axis.score === null && remainingFor(axis) !== null && remainingFor(axis) < 12)
      .sort((a, b) => remainingFor(a) - remainingFor(b))[0] || null;
    let takeaway;
    if (weakest) {
      takeaway = `
        <p class="radar-takeaway">
          最弱：${escapeHtml(weakest.label)} ${weakest.score} 分。
          <button class="link-button" data-action="practice-axis" data-axis="${escapeAttr(weakest.key)}">練 10 題 →</button>
        </p>`;
    } else if (nearest) {
      takeaway = `
        <p class="radar-takeaway">
          ${escapeHtml(nearest.label)}再答 ${remainingFor(nearest)} 題就會亮起來。
          <button class="link-button" data-action="practice-axis" data-axis="${escapeAttr(nearest.key)}">現在練 →</button>
        </p>`;
    } else {
      takeaway = `<p class="radar-takeaway">還沒有雷達資料，先打一輪快速訓練。</p>`;
    }
    return `
      <div class="radar-panel">
        <div class="radar-head">
          <strong>技巧精熟雷達</strong>
          <span>最近作答加權正確率，久沒練會慢慢褪色。</span>
        </div>
        <svg class="radar-svg" viewBox="0 0 280 240" role="img" aria-label="技巧精熟雷達">
          ${rings}
          ${spokes}
          ${measured.length ? `<polygon class="radar-data" points="${dataPoints}"></polygon>${dots}` : ""}
          ${labels}
        </svg>
        ${takeaway}
      </div>
    `;
  }

  /* 練習熱力圖：一格一天、顏色深淺是當天題數。純畫面 ——
     哪一天練了幾題、連勝幾天由呼叫端算好傳進來（deps）。 */
  function renderActivityHeatmap(records, deps) {
    const { activityCounts, practiceStreakInfo, localDateKey, startOfWeek, activityLevel, escapeAttr, icon } = deps;
    const HEATMAP_WEEKS = deps.weeks;
    const counts = activityCounts(records);
    const streakInfo = practiceStreakInfo(records, counts);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const todayKey = localDateKey(today);
    const start = startOfWeek(today);
    start.setDate(start.getDate() - (HEATMAP_WEEKS - 1) * 7);
    const monthCells = [];
    const cells = [];
    let previousMonth = -1;
    for (let week = 0; week < HEATMAP_WEEKS; week += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + week * 7);
      const month = weekStart.getMonth();
      monthCells.push(`<span>${month !== previousMonth ? `${month + 1}月` : ""}</span>`);
      previousMonth = month;
      for (let day = 0; day < 7; day += 1) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        const key = localDateKey(date);
        if (key > todayKey) {
          cells.push(`<span class="heatmap-cell is-future" data-level="0"></span>`);
          continue;
        }
        const count = counts[key] || 0;
        const shielded = streakInfo.usedDates.has(key);
        const title = `${key} · ${count} 題${shielded ? " · 盾牌保護" : ""}`;
        cells.push(`<span class="heatmap-cell ${shielded ? "is-shielded" : ""}" data-level="${activityLevel(count)}" title="${escapeAttr(title)}"></span>`);
      }
    }
    return `
      <section class="heatmap-panel">
        <div class="heatmap-head">
          <div>
            <p class="section-label">練習熱力圖</p>
            <h3>每天至少 1 題</h3>
          </div>
          <div class="streak-status">
            <strong>連勝 ${streakInfo.streak} 天</strong>
            <span class="shield-chip ${streakInfo.shieldAvailable ? "is-ready" : "is-used"}">${icon("shield")}盾牌${streakInfo.shieldAvailable ? "可用" : "本週已用"}</span>
          </div>
        </div>
        <div class="heatmap-wrap">
          <div class="heatmap-months" style="grid-template-columns: repeat(${HEATMAP_WEEKS}, 1fr);">${monthCells.join("")}</div>
          <div class="heatmap-grid">${cells.join("")}</div>
          <div class="heatmap-legend">
            <span>少</span>
            ${[0, 1, 2, 3, 4].map((level) => `<i class="heatmap-cell" data-level="${level}"></i>`).join("")}
            <span>多</span>
          </div>
        </div>
      </section>
    `;
  }

  /* 速度 × 正確率的四象限圖。純畫面：能力剖面由呼叫端算好傳進來。 */
  function renderSpeedQuadrant(profile, helpers) {
    const escapeHtml = helpers.escapeHtml;
    const points = Object.values(profile.skills).filter(
      (entry) => entry.quadrant && entry.speed !== null && entry.pressureAccuracy !== null
    );

    if (!points.length) {
      return `
        <section class="study-card">
          <p class="section-label">速度 × 正確率</p>
          <h3>還測不出來</h3>
          <p class="panel-note">需要同一個技巧累積 8 題以上的限時作答。多打幾局限時訓練就會出現。</p>
        </section>
      `;
    }

    const W = 320;
    const H = 240;
    const pad = 34;
    // 相對耗時超過 1.2 的都畫在最右邊：超時本來就不需要再細分
    const x = (speed) => pad + (Math.min(1.2, speed) / 1.2) * (W - pad - 12);
    const y = (acc) => H - pad - acc * (H - pad - 12);
    const fastLine = x(0.6);
    const accLine = y(0.7);

    const dots = points
      .map((entry) => {
        const cx = x(entry.speed).toFixed(1);
        const cy = y(entry.pressureAccuracy).toFixed(1);
        return `<circle class="quad-dot is-${entry.quadrant.key}" cx="${cx}" cy="${cy}" r="5">
          <title>${escapeHtml(entry.label)}：${entry.quadrant.label} · 正確率 ${Math.round(entry.pressureAccuracy * 100)}% · 相對耗時 ${entry.speed.toFixed(2)}</title>
        </circle>`;
      })
      .join("");

    const counts = points.reduce((acc, entry) => {
      acc[entry.quadrant.key] = (acc[entry.quadrant.key] || 0) + 1;
      return acc;
    }, {});
    const legend = [
      { key: "reflex", label: "反射區", note: "快又準" },
      { key: "slow", label: "會但慢", note: "方法對、不熟" },
      { key: "rushed", label: "衝太快", note: "讀題或代數不穩" },
      { key: "unbuilt", label: "還沒建立", note: "缺技巧" }
    ];

    return `
      <section class="study-card quadrant-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">速度 × 正確率</p>
            <h3>你是不會，還是來不及</h3>
          </div>
        </div>
        <svg class="quadrant-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="速度與正確率的四象限圖">
          <line class="quad-axis" x1="${pad}" y1="${H - pad}" x2="${W - 8}" y2="${H - pad}"></line>
          <line class="quad-axis" x1="${pad}" y1="8" x2="${pad}" y2="${H - pad}"></line>
          <line class="quad-split" x1="${fastLine}" y1="8" x2="${fastLine}" y2="${H - pad}"></line>
          <line class="quad-split" x1="${pad}" y1="${accLine}" x2="${W - 8}" y2="${accLine}"></line>
          <text class="quad-label" x="${pad}" y="${H - 10}">快</text>
          <text class="quad-label" x="${W - 24}" y="${H - 10}">慢</text>
          <text class="quad-label" x="6" y="16">準</text>
          <text class="quad-label" x="6" y="${H - pad}">錯</text>
          ${dots}
        </svg>
        <div class="quad-legend">
          ${legend
            .map(
              (item) => `
                <div class="quad-legend-item is-${item.key}">
                  <span class="quad-swatch"></span>
                  <strong>${item.label}</strong>
                  <small>${item.note} · ${counts[item.key] || 0} 個技巧</small>
                </div>`
            )
            .join("")}
        </div>
      </section>
    `;
  }

  /* 技巧掌握度表：一列一個技巧，量到的分數與最近趨勢。純畫面。 */
  function renderSkillTable(profile, helpers) {
    const escapeHtml = helpers.escapeHtml;
    const rows = profile.weakest
      .map((id) => profile.skills[id])
      .filter((entry) => entry && entry.mastery !== null)
      .slice(0, 12);

    const stale = Object.values(profile.skills).filter((entry) => entry.stale);

    if (!rows.length) {
      return `
        <section class="study-card">
          <p class="section-label">技巧</p>
          <h3>還沒有技巧測得準</h3>
        </section>
      `;
    }

    return `
      <section class="study-card skill-table-card">
        <div class="panel-title-row">
          <div>
            <p class="section-label">技巧精熟度</p>
            <h3>從最弱的開始</h3>
          </div>
        </div>
        <ul class="skill-rows">
          ${rows
            .map((entry) => {
              const pct = entry.mastery;
              const pa = entry.pressureAccuracy === null ? null : Math.round(entry.pressureAccuracy * 100);
              const ua = entry.untimedAccuracy === null ? null : Math.round(entry.untimedAccuracy * 100);
              return `
                <li class="skill-row is-${entry.state}">
                  <div class="skill-row-head">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <span class="skill-state">${escapeHtml(entry.stateLabel)} ${pct}</span>
                  </div>
                  <div class="skill-bar"><div class="skill-fill" style="width:${pct}%"></div></div>
                  <div class="skill-row-meta">
                    <span>${entry.n} 題</span>
                    ${pa !== null ? `<span>限時 ${pa}%</span>` : ""}
                    ${ua !== null ? `<span>不限時 ${ua}%</span>` : ""}
                    ${entry.quadrant ? `<span>${escapeHtml(entry.quadrant.label)}</span>` : ""}
                  </div>
                  ${
                    entry.diagnosis
                      ? `<p class="skill-diagnosis">${escapeHtml(entry.diagnosis.text)} —— ${escapeHtml(entry.diagnosis.advice)}</p>`
                      : ""
                  }
                </li>`;
            })
            .join("")}
        </ul>
        ${
          stale.length
            ? `<p class="panel-note">另外有 ${stale.length} 個技巧碰過但還測不準 —— 樣本不夠，或太久沒練已經衰減。多練幾題就會進到這張表。</p>`
            : ""
        }
      </section>
    `;
  }

  window.BuzzGraphRender = { graphCurveFn, renderProblemGraph, renderMiniGraph, svgGraphContext, graphProblemFn, renderMasteryRadar, renderActivityHeatmap, renderSpeedQuadrant, renderSkillTable };
})();

/* ── 作圖題（answerKind: "sketch"）：在空的格子上把 f 畫出來 ──
   題目資料：sketch = { expr, pieces: [[a,b],…], tolerance }，graph 只給 window（不畫曲線）。
   作答是幾筆折線（數學座標），判分四關：
     1. 函數：同一筆不能往回折（垂直線測試）；
     2. 覆蓋：每一段 pieces 都要畫到，沒定義的縫隙（垂直漸近線）不能穿過去；
     3. 增減：f 的每一個單調段，畫的曲線也要同方向 —— 這是作圖題真正在考的；
     4. 位置：取樣點跟正確曲線的距離在容差內（預設窗高的 10%），八成五以上才過。
   回饋講的是「哪一段該遞增你畫成遞減」「x≈2 附近差最遠、f(2) 應該是 …」，不是一個分數。
   判分是純函式，驗證器與 smoke 在 node 裡直接呼叫；畫面的綁定另外一支。 */
(function () {
  "use strict";

  const fmt = (x) => {
    const r = Math.round(x * 10) / 10;
    return String(Number.isInteger(r) ? r : r.toFixed(1));
  };

  function parse(input) {
    return String(input || "")
      .split("|")
      .map((stroke) => stroke.split(";").map((pt) => pt.split(",").map(Number)).filter((pt) => pt.length === 2 && pt.every(Number.isFinite)))
      .filter((stroke) => stroke.length >= 2);
  }

  function serialize(strokes) {
    return (strokes || []).map((stroke) => stroke.map((pt) => `${pt[0].toFixed(3)},${pt[1].toFixed(3)}`).join(";")).join("|");
  }

  function piecesOf(problem) {
    const spec = problem.sketch || {};
    const win = windowOf(problem);
    if (Array.isArray(spec.pieces) && spec.pieces.length) return spec.pieces.map((p) => p.map(Number));
    const margin = (win[1] - win[0]) * 0.05;
    return [[win[0] + margin, win[1] - margin]];
  }

  function windowOf(problem) {
    const win = problem.graph && Array.isArray(problem.graph.window) ? problem.graph.window.map(Number) : [-5, 5, -5, 5];
    return win.length === 4 ? win : [-5, 5, -5, 5];
  }

  function curveOf(problem) {
    const render = typeof window !== "undefined" ? window.BuzzGraphRender : null;
    const spec = problem.sketch || {};
    return render && spec.expr ? render.graphCurveFn(spec.expr) : null;
  }

  // 全部判分都在這裡。回傳 { correct, message }，跟其他 checkXxx 一樣。
  function check(problem, input) {
    const fn = curveOf(problem);
    if (!fn) return { correct: false, message: "這題的曲線式子壞了，不能判分。" };
    const [xmin, xmax, ymin, ymax] = windowOf(problem);
    const W = xmax - xmin;
    const H = ymax - ymin;
    const strokes = parse(input);
    const pts = strokes.flat();
    if (pts.length < 6) return { correct: false, message: "先在圖上把曲線畫出來，再送出。" };

    // 1. 垂直線測試：一筆之內 x 往回超過窗寬 8% 就不是函數的圖形
    for (const stroke of strokes) {
      const dir = Math.sign(stroke[stroke.length - 1][0] - stroke[0][0]) || 1;
      let peak = stroke[0][0];
      let back = 0;
      stroke.forEach(([x]) => {
        if (dir * (x - peak) > 0) peak = x;
        else back = Math.max(back, dir * (peak - x));
      });
      if (back > 0.08 * W) {
        return { correct: false, message: "函數的圖形不能往回折：同一個 x 只能對應一個 y。把往回的那一筆退掉重畫。" };
      }
    }

    const sorted = pts.slice().sort((a, b) => a[0] - b[0]);
    const dx = 0.02 * W;
    const userY = (x) => {
      let sum = 0;
      let n = 0;
      for (const p of sorted) {
        if (p[0] < x - dx) continue;
        if (p[0] > x + dx) break;
        sum += p[1];
        n += 1;
      }
      return n ? sum / n : null;
    };
    const pieces = piecesOf(problem);

    // 2a. 覆蓋：每一段都要畫到（兩端各讓 6%：人起筆收筆不會剛好頂到邊）
    for (const [a0, b0] of pieces) {
      const a = a0 + (b0 - a0) * 0.06;
      const b = b0 - (b0 - a0) * 0.06;
      const N = 30;
      const missing = [];
      for (let i = 0; i <= N; i += 1) {
        const x = a + ((b - a) * i) / N;
        if (userY(x) === null) missing.push(x);
      }
      if (missing.length > 0.2 * N) {
        return { correct: false, message: `曲線要畫滿 x 從 ${fmt(a)} 到 ${fmt(b)} 這一段，現在 x ≈ ${fmt(missing[0])} 附近還是空的。` };
      }
    }
    // 2b. 段與段之間的縫隙（垂直漸近線、沒定義的地方）不能有點
    for (let i = 0; i + 1 < pieces.length; i += 1) {
      const gapA = pieces[i][1];
      const gapB = pieces[i + 1][0];
      const inner = [gapA + (gapB - gapA) * 0.3, gapB - (gapB - gapA) * 0.3];
      if (sorted.some((p) => p[0] > inner[0] && p[0] < inner[1])) {
        return { correct: false, message: `x ≈ ${fmt((gapA + gapB) / 2)} 附近 f 沒有定義（垂直漸近線），曲線不該穿過去 —— 兩邊要分開畫，各自往上或往下衝。` };
      }
    }

    // 3. 增減：用 f′ 的變號把每一段切成單調段，畫的曲線在每一段都要同方向
    const h = 1e-4 * W;
    const d1 = (x) => (fn(x + h) - fn(x - h)) / (2 * h);
    for (const [a, b] of pieces) {
      const cuts = [a];
      const steps = 240;
      let prev = d1(a + ((b - a) * 1) / steps);
      for (let i = 2; i < steps; i += 1) {
        const x = a + ((b - a) * i) / steps;
        const cur = d1(x);
        if (Number.isFinite(cur) && Number.isFinite(prev) && cur * prev < 0) cuts.push(x);
        if (Number.isFinite(cur)) prev = cur;
      }
      cuts.push(b);
      for (let i = 0; i + 1 < cuts.length; i += 1) {
        const p = cuts[i] + (cuts[i + 1] - cuts[i]) * 0.12;
        const q = cuts[i + 1] - (cuts[i + 1] - cuts[i]) * 0.12;
        if (q - p < 0.06 * W) continue;
        const fy = fn(q) - fn(p);
        if (!Number.isFinite(fy) || Math.abs(fy) < 0.06 * H) continue;
        const up = userY(p);
        const uq = userY(q);
        if (up === null || uq === null) continue;
        const uy = uq - up;
        // 方向對、而且真的有起伏就算：門檻是 f 起伏的兩成或窗高的 8%，取小的 ——
        // 漸近線旁 f 衝到 ±∞（被窗夾住）時「兩成」會大到手畫追不上（模擬 840 筆手畫抓到的）。
        if (uy * fy > 0 && Math.abs(uy) >= Math.min(0.2 * Math.abs(fy), 0.08 * H)) continue;
        const should = fy > 0 ? "遞增" : "遞減";
        const drew = uy * fy < 0 ? `往${fy > 0 ? "下" : "上"}` : "幾乎是平的";
        return { correct: false, message: `x 從 ${fmt(cuts[i])} 到 ${fmt(cuts[i + 1])} 這一段 f 應該${should}（f′ ${fy > 0 ? ">" : "<"} 0），你畫的${drew}。先找 f′ 的零點，再決定每一段往上還是往下。` };
      }
    }

    // 4. 位置：取樣點到正確曲線的距離（允許 x 方向 5% 的滑動）。
    // 寬鬆度用模擬手畫（手抖、比例偏 15%、整條偏 8%、不到邊）校過：過關率要在九成五以上，
    // 而上下翻轉、整條抬 35% 窗高的要全擋下。
    const tol = (Number(problem.sketch && problem.sketch.tolerance) || 0.12) * H;
    let ok = 0;
    let total = 0;
    let worst = { err: 0, x: null };
    for (const [a, b] of pieces) {
      const N = 40;
      for (let i = 0; i <= N; i += 1) {
        const x = a + ((b - a) * i) / N;
        const uy = userY(x);
        if (uy === null) continue;
        let best = Infinity;
        for (let k = -4; k <= 4; k += 1) {
          const xx = x + (k / 4) * 0.05 * W;
          const y = fn(xx);
          if (!Number.isFinite(y) || y < ymin - 0.5 * H || y > ymax + 0.5 * H) continue;
          best = Math.min(best, Math.abs(uy - Math.max(ymin, Math.min(ymax, y))));
        }
        if (!Number.isFinite(best)) continue;
        total += 1;
        if (best <= tol) ok += 1;
        if (best > worst.err) worst = { err: best, x };
      }
    }
    if (!total) return { correct: false, message: "畫的地方跟 f 有定義的範圍對不上。" };
    const ratio = ok / total;
    if (ratio < 0.8) {
      const truth = fn(worst.x);
      return {
        correct: false,
        message: `增減方向都對了，但位置差太多：x ≈ ${fmt(worst.x)} 附近離正確曲線最遠。f(${fmt(worst.x)}) 應該是 ${fmt(truth)}，先把幾個關鍵點（零點、極值、截距）的值算出來再連線。`
      };
    }
    return { correct: true, message: `圖形正確：每一段的增減都對，${Math.round(ratio * 100)}% 的取樣點在容差內。` };
  }

  // 畫面：空格子 + 已畫的筆畫；送出後疊上正確曲線（綠虛線）。
  // 筆畫的 path 帶 data-sketch-stroke，橡皮擦拖動時 repaint() 只換這些、不整頁 render。
  function strokePath(ctx, stroke) {
    return stroke.map((p, i) => `${i ? "L" : "M"}${ctx.sx(p[0]).toFixed(1)},${ctx.sy(p[1]).toFixed(1)}`).join(" ");
  }

  function renderControls(problem, strokes, h) {
    const done = Boolean(h.done);
    const erasing = h.tool === "erase" && !done;
    const fn = curveOf(problem);
    const [, , ymin, ymax] = windowOf(problem);
    const overlay = (ctx) => {
      const parts = [];
      if (done && fn) {
        piecesOf(problem).forEach(([a, b]) => {
          const pts = [];
          const steps = 200;
          for (let i = 0; i <= steps; i += 1) {
            const x = a + ((b - a) * i) / steps;
            const y = fn(x);
            if (Number.isFinite(y) && y >= ymin - 1 && y <= ymax + 1) pts.push([x, Math.max(ymin, Math.min(ymax, y))]);
          }
          if (pts.length > 1) parts.push(`<path d="${strokePath(ctx, pts)}" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="6 4"/>`);
        });
      }
      (strokes || []).forEach((stroke) => {
        parts.push(`<path data-sketch-stroke d="${strokePath(ctx, stroke)}" fill="none" stroke="var(--gold)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);
      });
      return parts.join("");
    };
    const count = (strokes || []).reduce((n, s) => n + s.length, 0);
    const pieces = piecesOf(problem);
    const range = pieces.map(([a, b]) => `${fmt(a)} 到 ${fmt(b)}`).join("、");
    const tip = done
      ? "綠色虛線是正確圖形，金色是你畫的。"
      : erasing
        ? "橡皮擦：在要擦掉的線上拖過去。再點一次橡皮擦回到畫筆。"
        : `直接在格子上畫出 f 的圖形（x 從 ${range}）。可以分好幾筆；斷開的地方就分開畫。`;
    return `
      <div class="graph-interactive graph-sketch ${erasing ? "is-erasing" : ""}">
        ${h.renderProblemGraph(problem, { interactive: done ? null : "sketch", overlay })}
        <div class="helper-row">
          <span>${tip}</span>
          <span class="slope-readout">已畫 <strong data-sketch-count>${(strokes || []).length}</strong> 筆</span>
        </div>
        <div class="action-row">
          <button class="button" data-action="submit-sketch" ${!done && count >= 6 ? "" : "disabled"}>${h.icon("check")}送出</button>
          <button class="button ghost ${erasing ? "is-active" : ""}" data-action="sketch-tool" data-tool="${erasing ? "draw" : "erase"}" aria-pressed="${erasing ? "true" : "false"}" ${done ? "disabled" : ""}>${h.icon("eraser")}橡皮擦</button>
          <button class="button ghost" data-action="undo-sketch" ${done || !(strokes || []).length ? "disabled" : ""}>退一筆</button>
          <button class="button ghost" data-action="clear-sketch" ${done || !(strokes || []).length ? "disabled" : ""}>清除</button>
        </div>
        ${h.extra || ""}
      </div>
    `;
  }

  // 橡皮擦：把離 (x,y) 太近的點拿掉，一筆可能斷成好幾筆。距離用窗的比例算（x 跟 y 各自正規化），
  // 半徑 3.5% —— 手指的寬度。回傳有沒有擦到東西。
  function eraseAt(strokes, x, y, ctx) {
    const W = ctx.xmax - ctx.xmin;
    const H = ctx.ymax - ctx.ymin;
    const r = 0.035;
    let touched = false;
    const next = [];
    strokes.forEach((stroke) => {
      let run = [];
      stroke.forEach((p) => {
        const d = Math.hypot((p[0] - x) / W, (p[1] - y) / H);
        if (d <= r) { touched = true; if (run.length >= 2) next.push(run); run = []; }
        else run.push(p);
      });
      if (run.length >= 2) next.push(run);
    });
    if (touched) strokes.splice(0, strokes.length, ...next);
    return touched;
  }

  function repaint(svg, ctx, strokes) {
    const NS = "http://www.w3.org/2000/svg";
    svg.querySelectorAll("[data-sketch-stroke]").forEach((node) => node.remove());
    strokes.forEach((stroke) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("data-sketch-stroke", "");
      path.setAttribute("d", strokePath(ctx, stroke));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--gold)");
      path.setAttribute("stroke-width", "2.8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
    });
  }

  // 綁在 svg 上：pointerdown 開新的一筆，move 直接改 path 的 d（不整頁 render），
  // 放手才 onCommit 一次。跟切線題的拖動同一個原則：拖動中換掉 DOM 會丟 pointer capture。
  // 手機：touch-action:none 在 CSS 上，這裡再擋 touchstart／touchmove 的預設動作 ——
  // iOS Safari 手指一動有時先當成捲頁（實測回報「畫圖時頁面被拖」），兩道都要有。
  function bind(svg, ctx, strokes, onCommit, options) {
    if (!svg || !ctx) return;
    const tool = (options && options.tool) || "draw";
    const NS = "http://www.w3.org/2000/svg";
    const block = (event) => { if (event.cancelable) event.preventDefault(); };
    svg.addEventListener("touchstart", block, { passive: false });
    svg.addEventListener("touchmove", block, { passive: false });
    svg.addEventListener("contextmenu", block);
    svg.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      try { svg.setPointerCapture(event.pointerId); } catch (_error) { /* 沒有 capture 就拖出去會斷，可接受 */ }
      const start = ctx.toMath(event);
      if (tool === "erase") {
        let changed = eraseAt(strokes, start.x, start.y, ctx);
        if (changed) repaint(svg, ctx, strokes);
        const move = (ev) => { const pt = ctx.toMath(ev); if (eraseAt(strokes, pt.x, pt.y, ctx)) { changed = true; repaint(svg, ctx, strokes); } };
        const up = () => {
          svg.removeEventListener("pointermove", move);
          svg.removeEventListener("pointerup", up);
          svg.removeEventListener("pointercancel", up);
          if (changed) onCommit();
        };
        svg.addEventListener("pointermove", move);
        svg.addEventListener("pointerup", up);
        svg.addEventListener("pointercancel", up);
        return;
      }
      const stroke = [[start.x, start.y]];
      const path = document.createElementNS(NS, "path");
      path.setAttribute("data-sketch-stroke", "");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--gold)");
      path.setAttribute("stroke-width", "2.8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
      const draw = () => path.setAttribute("d", strokePath(ctx, stroke));
      const move = (ev) => {
        const pt = ctx.toMath(ev);
        const last = stroke[stroke.length - 1];
        const minStep = (ctx.xmax - ctx.xmin) * 0.004;
        if (Math.hypot(pt.x - last[0], (pt.y - last[1]) * ((ctx.xmax - ctx.xmin) / (ctx.ymax - ctx.ymin))) < minStep) return;
        stroke.push([
          Math.max(ctx.xmin, Math.min(ctx.xmax, pt.x)),
          Math.max(ctx.ymin, Math.min(ctx.ymax, pt.y))
        ]);
        draw();
      };
      const up = () => {
        svg.removeEventListener("pointermove", move);
        svg.removeEventListener("pointerup", up);
        svg.removeEventListener("pointercancel", up);
        if (stroke.length >= 2) strokes.push(stroke);
        else path.remove();
        onCommit();
      };
      draw();
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", up);
      svg.addEventListener("pointercancel", up);
    });
  }

  // 照著正解描一遍（每段 60 個點）：驗證器拿它當「標準作答」餵判分器，E2E 也用它畫。
  function trace(problem) {
    const fn = curveOf(problem);
    const [, , ymin, ymax] = windowOf(problem);
    if (!fn) return "";
    return serialize(piecesOf(problem).map(([a, b]) => {
      const pts = [];
      for (let i = 0; i <= 60; i += 1) {
        const x = a + ((b - a) * i) / 60;
        const y = fn(x);
        if (Number.isFinite(y)) pts.push([x, Math.max(ymin, Math.min(ymax, y))]);
      }
      return pts;
    }));
  }

  window.BuzzGraphSketch = { parse, serialize, check, renderControls, bind, piecesOf, trace, eraseAt };
})();

/* ── 導覽（coach marks）：指著畫面上真的那顆按鈕說話 ──────────────────
   為什麼自己寫：站上所有第三方資源都在本地，而 intro.js／shepherd 這類函式庫
   最小的也有 30KB＋自己一套樣式；這裡要的只有「挖洞 + 一張卡 + 上一步/下一步」。
   而且 script 標籤預算滿了，新檔開不了。

   設計上的三個硬條件：
   1. 導覽的 DOM 住在 document.body，不在 #app —— app.js 每次 render 都會
      整個換掉 #app.innerHTML，住在裡面的東西會連同焦點一起消失。
      每次 render 之後呼叫 refresh() 重新量錨點。
   2. 錨點用「一串候選 selector，取第一個看得見的」：手機沒有側欄、
      桌機沒有底部分頁列，同一步在兩種版面上指的是不同元件。
      一個都看不到就跳過那一步，不要指著空氣。
   3. 遮罩吃掉點擊（導覽期間只有導覽的按鈕能按），但 Esc、上一步／下一步、
      方向鍵都要能用，而且焦點不能跑到被遮住的地方。 */
(function () {
  "use strict";

  const GUTTER = 12;
  const state = { steps: [], at: 0, name: "", deps: null, nodes: null, onDone: null, bound: null };

  function visible(node) {
    if (!node || !node.getBoundingClientRect) return false;
    const rect = node.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return false;
    const style = window.getComputedStyle(node);
    if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false;
    return rect.bottom > -40 && rect.top < window.innerHeight + 400;
  }

  function anchorOf(step) {
    for (const selector of step.targets || []) {
      const node = document.querySelector(selector);
      if (visible(node)) return node;
    }
    return null;
  }

  function build() {
    const root = document.createElement("div");
    root.className = "tour-root";
    root.innerHTML = `
      <div class="tour-veil" data-tour-veil></div>
      <div class="tour-hole" data-tour-hole aria-hidden="true"></div>
      <section class="tour-card" data-tour-card role="dialog" aria-modal="true" aria-labelledby="tour-title" tabindex="-1">
        <p class="tour-step" data-tour-count></p>
        <h2 id="tour-title" data-tour-title></h2>
        <p class="tour-body" data-tour-body></p>
        <div class="tour-actions">
          <button type="button" class="tour-skip" data-tour-skip>略過</button>
          <span class="tour-spacer"></span>
          <button type="button" class="tour-back" data-tour-back>上一步</button>
          <button type="button" class="tour-next" data-tour-next></button>
        </div>
      </section>`;
    document.body.appendChild(root);
    return {
      root,
      hole: root.querySelector("[data-tour-hole]"),
      card: root.querySelector("[data-tour-card]"),
      count: root.querySelector("[data-tour-count]"),
      title: root.querySelector("[data-tour-title]"),
      body: root.querySelector("[data-tour-body]"),
      back: root.querySelector("[data-tour-back]"),
      next: root.querySelector("[data-tour-next]"),
      skip: root.querySelector("[data-tour-skip]")
    };
  }

  // 卡片放在錨點的下面；下面塞不下就放上面；兩邊都塞不下（錨點很高或在正中間）
  // 就貼著視窗底部。左右夾在視窗內，兩側各留 12px。
  function place(card, rect) {
    const cw = Math.min(card.offsetWidth || 320, window.innerWidth - GUTTER * 2);
    const ch = card.offsetHeight || 180;
    const safeTop = GUTTER;
    const safeBottom = window.innerHeight - GUTTER;
    let top;
    if (!rect) top = Math.max(safeTop, (window.innerHeight - ch) / 2);
    else if (rect.bottom + 14 + ch <= safeBottom) top = rect.bottom + 14;
    else if (rect.top - 14 - ch >= safeTop) top = rect.top - 14 - ch;
    else top = Math.max(safeTop, safeBottom - ch);
    let left = rect ? rect.left + rect.width / 2 - cw / 2 : (window.innerWidth - cw) / 2;
    left = Math.max(GUTTER, Math.min(left, window.innerWidth - GUTTER - cw));
    card.style.width = cw + "px";
    card.style.top = Math.round(top) + "px";
    card.style.left = Math.round(left) + "px";
  }

  function paint() {
    const step = state.steps[state.at];
    const nodes = state.nodes;
    if (!step || !nodes) return;
    const node = anchorOf(step);
    const rect = node ? node.getBoundingClientRect() : null;
    if (rect) {
      const pad = step.pad == null ? 8 : step.pad;
      nodes.hole.style.display = "block";
      nodes.hole.style.top = Math.round(rect.top - pad) + "px";
      nodes.hole.style.left = Math.round(rect.left - pad) + "px";
      nodes.hole.style.width = Math.round(rect.width + pad * 2) + "px";
      nodes.hole.style.height = Math.round(rect.height + pad * 2) + "px";
    } else {
      nodes.hole.style.display = "none";
    }
    nodes.count.textContent = `導覽 ${state.at + 1} / ${state.steps.length}`;
    nodes.title.textContent = step.title;
    nodes.body.textContent = step.body;
    nodes.back.hidden = state.at === 0;
    nodes.next.textContent = state.at === state.steps.length - 1 ? "開始使用" : "下一步";
    place(nodes.card, rect);
  }

  function show(index) {
    const total = state.steps.length;
    state.at = Math.max(0, Math.min(index, total - 1));
    const step = state.steps[state.at];
    // 這一步要先換頁（例如「訓練」那一步要站在訓練頁上講）：換完等 render 完成再量。
    if (step.view && state.deps.goto) state.deps.goto(step.view);
    const node = anchorOf(step);
    if (node && node.scrollIntoView) {
      const smooth = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      try { node.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" }); } catch (_error) { node.scrollIntoView(); }
    }
    window.setTimeout(paint, node ? 220 : 60);
    paint();
    state.nodes.card.focus();
    if (state.deps.track) state.deps.track({ tour: state.name, step: step.id, index: state.at + 1 });
  }

  function step(delta) {
    const next = state.at + delta;
    if (next >= state.steps.length) return finish("done");
    if (next < 0) return;
    show(next);
  }

  function finish(reason) {
    if (!state.nodes) return;
    if (state.bound) state.bound();
    state.bound = null;
    state.nodes.root.remove();
    state.nodes = null;
    const done = state.onDone;
    const name = state.name;
    state.steps = [];
    state.onDone = null;
    state.name = "";
    if (done) done(reason, name);
  }

  function start(name, steps, deps, onDone) {
    if (state.nodes) finish("restart");
    const usable = (steps || []).filter((item) => !item.targets || !item.required || anchorOf(item));
    if (!usable.length) return false;
    state.name = name;
    state.steps = usable;
    state.deps = deps || {};
    state.onDone = onDone;
    state.nodes = build();
    const nodes = state.nodes;
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); finish("skip"); return; }
      if (event.key === "ArrowRight" || event.key === "Enter") { event.preventDefault(); step(1); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); return; }
      // 焦點關在卡片裡：導覽期間 Tab 不該跑到被遮住的按鈕上
      if (event.key === "Tab") {
        const focusables = [...nodes.card.querySelectorAll("button:not([hidden])")];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === nodes.card)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => paint();
    nodes.next.addEventListener("click", () => step(1));
    nodes.back.addEventListener("click", () => step(-1));
    nodes.skip.addEventListener("click", () => finish("skip"));
    nodes.root.addEventListener("pointerdown", (event) => { if (event.target === nodes.root || event.target.hasAttribute("data-tour-veil")) event.preventDefault(); });
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    state.bound = () => {
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
    show(0);
    return true;
  }

  // 兩段導覽的步驟表。錨點一律寫成候選清單：手機是底部分頁列、桌機是左側欄，
  // 同一步在兩種版面上是不同的元件；一個都看不到就跳過那一步。
  const STEPS = {
    home: () => [
      {
        id: "today",
        view: "home",
        targets: ['[data-action="start-planned"]', '[data-action="start-mode"]', ".home-primary"],
        title: "每天從這裡開始",
        body: "今天的訓練已經排好：到期的錯題、你最弱的技巧、一點新東西。按下去就開始，不用自己挑。"
      },
      {
        id: "train",
        targets: ['.nav-button[data-action="open-train"]', '[data-action="open-train"]'],
        title: "想練特定的東西就進訓練",
        body: "四種練法：照主線走、補弱點、模擬考、挑戰題。難度會跟著你的表現自己調。"
      },
      {
        id: "library",
        targets: ['.nav-button[data-action="open-library"]', '[data-action="open-library"]'],
        title: "題庫可以自己挑題",
        body: "搜技巧、搜題號都可以，找到的題目可以直接開一局。入門課程與證明訓練也在這一區。"
      },
      {
        id: "insights",
        targets: ['.nav-button[data-action="open-insights"]', '[data-action="open-insights"]'],
        title: "數據會說你是哪一種錯",
        body: "分得出「不會」還是「來不及」，也看得到哪個技巧在退步。錯題會自動排程回鍋。"
      },
      {
        id: "settings",
        targets: ['.nav-button[data-action="open-settings"]', '[data-action="open-settings"]'],
        title: "紀錄只存在這台裝置",
        body: "不用註冊。要換裝置就在設定頁匯出備份，導覽也可以在這裡再看一次。"
      }
    ],
    quiz: () => [
      {
        id: "prompt",
        targets: [".quiz-screen .prompt", ".problem-card"],
        title: "一次一題，答完就知道對錯",
        body: "答錯不會只跟你說錯：下面會一段一段揭解法，你可以只看第一段就自己接下去。"
      },
      {
        id: "hint",
        targets: ['[data-action="show-hint"]', ".problem-tools"],
        title: "卡住先看提示，不要硬撐",
        body: "提示分層給，一次一層。練習模式不扣分，正式局才會記。"
      },
      {
        id: "board",
        targets: ['[data-board-action="toggle"]', ".scratchboard-summary", ".scratchboard-shell"],
        title: "計算紙在這裡",
        body: "手寫算式不用另外拿紙。打開計算紙的時候這一題的倒數會暫停，寫算不會被秒數懲罰。"
      }
    ]
  };

  window.BuzzTour = {
    steps: (name) => (STEPS[name] ? STEPS[name]() : []),
    start,
    stop: () => finish("stop"),
    running: () => Boolean(state.nodes),
    // app.js 每次 render 之後呼叫：錨點的元素是新的，位置要重量。
    refresh: () => { if (state.nodes) paint(); }
  };
})();
