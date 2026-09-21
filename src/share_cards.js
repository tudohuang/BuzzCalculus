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

  window.BuzzGraphRender = { graphCurveFn, renderProblemGraph };
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

    // 2a. 覆蓋：每一段都要畫到
    for (const [a, b] of pieces) {
      const N = 30;
      const missing = [];
      for (let i = 0; i <= N; i += 1) {
        const x = a + ((b - a) * i) / N;
        if (userY(x) === null) missing.push(x);
      }
      if (missing.length > 0.15 * N) {
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
        if (uy * fy > 0 && Math.abs(uy) >= 0.2 * Math.abs(fy)) continue;
        const should = fy > 0 ? "遞增" : "遞減";
        const drew = uy * fy < 0 ? `往${fy > 0 ? "下" : "上"}` : "幾乎是平的";
        return { correct: false, message: `x 從 ${fmt(cuts[i])} 到 ${fmt(cuts[i + 1])} 這一段 f 應該${should}（f′ ${fy > 0 ? ">" : "<"} 0），你畫的${drew}。先找 f′ 的零點，再決定每一段往上還是往下。` };
      }
    }

    // 4. 位置：取樣點到正確曲線的距離（允許 x 方向 3% 的滑動）
    const tol = (Number(problem.sketch && problem.sketch.tolerance) || 0.1) * H;
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
          const xx = x + (k / 4) * 0.03 * W;
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
    if (ratio < 0.85) {
      const truth = fn(worst.x);
      return {
        correct: false,
        message: `增減方向都對了，但位置差太多：x ≈ ${fmt(worst.x)} 附近離正確曲線最遠。f(${fmt(worst.x)}) 應該是 ${fmt(truth)}，先把幾個關鍵點（零點、極值、截距）的值算出來再連線。`
      };
    }
    return { correct: true, message: `圖形正確：每一段的增減都對，${Math.round(ratio * 100)}% 的取樣點在容差內。` };
  }

  // 畫面：空格子 + 已畫的筆畫；送出後疊上正確曲線（綠虛線）。
  function renderControls(problem, strokes, h) {
    const done = Boolean(h.done);
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
          if (pts.length > 1) parts.push(`<path d="${pts.map((p, i) => `${i ? "L" : "M"}${ctx.sx(p[0]).toFixed(1)},${ctx.sy(p[1]).toFixed(1)}`).join(" ")}" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="6 4"/>`);
        });
      }
      (strokes || []).forEach((stroke) => {
        parts.push(`<path d="${stroke.map((p, i) => `${i ? "L" : "M"}${ctx.sx(p[0]).toFixed(1)},${ctx.sy(p[1]).toFixed(1)}`).join(" ")}" fill="none" stroke="var(--gold)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);
      });
      return parts.join("");
    };
    const count = (strokes || []).reduce((n, s) => n + s.length, 0);
    const pieces = piecesOf(problem);
    const range = pieces.map(([a, b]) => `${fmt(a)} 到 ${fmt(b)}`).join("、");
    return `
      <div class="graph-interactive graph-sketch">
        ${h.renderProblemGraph(problem, { interactive: done ? null : "sketch", overlay })}
        <div class="helper-row">
          <span>${done ? "綠色虛線是正確圖形，金色是你畫的。" : `用手指或滑鼠直接在格子上畫出 f 的圖形（x 從 ${range}）。可以分好幾筆；斷開的地方就分開畫。`}</span>
          <span class="slope-readout">已畫 <strong data-sketch-count>${(strokes || []).length}</strong> 筆</span>
        </div>
        <div class="action-row">
          <button class="button" data-action="submit-sketch" ${!done && count >= 6 ? "" : "disabled"}>${h.icon("check")}送出</button>
          <button class="button ghost" data-action="undo-sketch" ${done || !(strokes || []).length ? "disabled" : ""}>退一筆</button>
          <button class="button ghost" data-action="clear-sketch" ${done || !(strokes || []).length ? "disabled" : ""}>清除</button>
        </div>
        ${h.extra || ""}
      </div>
    `;
  }

  // 綁在 svg 上：pointerdown 開新的一筆，move 直接改 path 的 d（不整頁 render），
  // 放手才 onCommit 一次。跟切線題的拖動同一個原則：拖動中換掉 DOM 會丟 pointer capture。
  function bind(svg, ctx, strokes, onCommit) {
    if (!svg || !ctx) return;
    const NS = "http://www.w3.org/2000/svg";
    svg.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      try { svg.setPointerCapture(event.pointerId); } catch (_error) { /* 沒有 capture 就拖出去會斷，可接受 */ }
      const start = ctx.toMath(event);
      const stroke = [[start.x, start.y]];
      const path = document.createElementNS(NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--gold)");
      path.setAttribute("stroke-width", "2.8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
      const draw = () => path.setAttribute("d", stroke.map((p, i) => `${i ? "L" : "M"}${ctx.sx(p[0]).toFixed(1)},${ctx.sy(p[1]).toFixed(1)}`).join(" "));
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

  window.BuzzGraphSketch = { parse, serialize, check, renderControls, bind, piecesOf, trace };
})();
