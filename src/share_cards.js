// 本週戰報與成就分享卡：canvas 畫 PNG，全部本地。
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
